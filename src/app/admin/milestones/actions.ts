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
    year: (form.get('year') as string)?.trim() || '',
    event: (form.get('event') as string)?.trim() || '',
    sort_order: parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
  }
}

export async function createMilestone(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('chapter_milestones').insert(payload).select('id').single()
  if (error || !data) redirect('/admin/milestones?error=' + encodeURIComponent(error?.message ?? 'Create failed'))

  await logActivity(admin, { action: 'create', entityType: 'chapter_milestone', entityId: data.id, entityLabel: `${payload.year} — ${payload.event}` })

  revalidatePath('/about')
  redirect('/admin/milestones?success=created')
}

export async function updateMilestone(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { error } = await admin.from('chapter_milestones').update(payload).eq('id', id)
  if (error) redirect(`/admin/milestones/${id}?error=` + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'chapter_milestone', entityId: id, entityLabel: `${payload.year} — ${payload.event}` })

  revalidatePath('/about')
  redirect(`/admin/milestones/${id}?success=saved`)
}

export async function deleteMilestone(id: string) {
  const admin = await assertAdmin()
  const { data: existing } = await admin.from('chapter_milestones').select('year, event').eq('id', id).single()
  await admin.from('chapter_milestones').delete().eq('id', id)
  await logActivity(admin, {
    action: 'delete',
    entityType: 'chapter_milestone',
    entityId: id,
    entityLabel: existing ? `${existing.year} — ${existing.event}` : 'Milestone',
  })
  revalidatePath('/about')
  redirect('/admin/milestones')
}
