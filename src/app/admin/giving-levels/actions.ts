'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'
import { CAMPAIGN_KEYS, CAMPAIGN_BLANK_OK, SITE_CONTENT_DEFAULTS } from '@/lib/siteContent'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')
  return admin
}

function buildPayload(form: FormData) {
  return {
    name: (form.get('name') as string)?.trim() || '',
    amount_label: (form.get('amount_label') as string)?.trim() || '',
    description: (form.get('description') as string)?.trim() || null,
    donors: (form.get('donors') as string)?.trim() || null,
    sort_order: parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
    is_published: form.get('is_published') === 'on',
  }
}

export async function updateCampaignSettings(formData: FormData) {
  const admin = await assertAdmin()

  const rows = CAMPAIGN_KEYS.map(key => {
    const value = ((formData.get(key) as string) ?? '').trim()
    return {
      key,
      value: value || (CAMPAIGN_BLANK_OK.has(key) ? '' : SITE_CONTENT_DEFAULTS[key]),
      updated_at: new Date().toISOString(),
    }
  })

  const { error } = await admin.from('site_content').upsert(rows, { onConflict: 'key' })
  if (error) redirect('/admin/giving-levels?error=' + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'site_content', entityLabel: 'Capital campaign settings' })

  revalidatePath('/')
  revalidatePath('/campaign')
  revalidatePath('/donations')
  revalidatePath('/admin/giving-levels')
  redirect('/admin/giving-levels?success=settings')
}

export async function createGivingLevel(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('campaign_giving_levels').insert(payload).select('id').single()
  if (error || !data) redirect('/admin/giving-levels?error=' + encodeURIComponent(error?.message ?? 'Create failed'))

  await logActivity(admin, { action: 'create', entityType: 'giving_level', entityId: data.id, entityLabel: payload.name })

  revalidatePath('/campaign')
  redirect('/admin/giving-levels?success=created')
}

export async function updateGivingLevel(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { error } = await admin.from('campaign_giving_levels').update(payload).eq('id', id)
  if (error) redirect(`/admin/giving-levels/${id}?error=` + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'giving_level', entityId: id, entityLabel: payload.name })

  revalidatePath('/campaign')
  redirect(`/admin/giving-levels/${id}?success=saved`)
}

export async function deleteGivingLevel(id: string) {
  const admin = await assertAdmin()
  const { data: existing } = await admin.from('campaign_giving_levels').select('name').eq('id', id).single()
  await admin.from('campaign_giving_levels').delete().eq('id', id)
  await logActivity(admin, { action: 'delete', entityType: 'giving_level', entityId: id, entityLabel: existing?.name ?? 'Giving level' })
  revalidatePath('/campaign')
  redirect('/admin/giving-levels')
}
