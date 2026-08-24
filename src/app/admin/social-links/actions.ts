'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'

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
    platform: (form.get('platform') as string) || 'other',
    label: (form.get('label') as string)?.trim() || '',
    url: (form.get('url') as string)?.trim() || '',
    sort_order: parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
    is_published: form.get('is_published') === 'on',
  }
}

export async function createSocialLink(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('social_links').insert(payload).select('id').single()
  if (error || !data) redirect('/admin/social-links?error=' + encodeURIComponent(error?.message ?? 'Create failed'))

  await logActivity(admin, { action: 'create', entityType: 'social_link', entityId: data.id, entityLabel: payload.label })

  revalidatePath('/events')
  redirect('/admin/social-links?success=created')
}

export async function updateSocialLink(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { error } = await admin.from('social_links').update(payload).eq('id', id)
  if (error) redirect(`/admin/social-links/${id}?error=` + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'social_link', entityId: id, entityLabel: payload.label })

  revalidatePath('/events')
  redirect(`/admin/social-links/${id}?success=saved`)
}

export async function deleteSocialLink(id: string) {
  const admin = await assertAdmin()
  const { data: existing } = await admin.from('social_links').select('label').eq('id', id).single()
  await admin.from('social_links').delete().eq('id', id)
  await logActivity(admin, { action: 'delete', entityType: 'social_link', entityId: id, entityLabel: existing?.label ?? 'Social link' })
  revalidatePath('/events')
  redirect('/admin/social-links')
}
