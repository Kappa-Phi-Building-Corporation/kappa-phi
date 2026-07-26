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
    category:     (form.get('category') as string) || 'student_knight',
    member_id:    (form.get('member_id') as string)?.trim() || null,
    display_name: (form.get('display_name') as string)?.trim() || '',
    year_label:   (form.get('year_label') as string)?.trim() || null,
    title:        (form.get('title') as string)?.trim() || null,
    sort_order:   parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
  }
}

export async function createChapterHonor(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('chapter_honors').insert(payload).select('id').single()
  if (error) redirect('/admin/honors?error=' + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'create', entityType: 'chapter_honor', entityId: data?.id, entityLabel: payload.display_name || 'Chapter honor' })

  revalidatePath('/about')
  redirect('/admin/honors?success=created')
}

export async function updateChapterHonor(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { error } = await admin.from('chapter_honors').update(payload).eq('id', id)
  if (error) redirect(`/admin/honors/${id}?error=` + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'chapter_honor', entityId: id, entityLabel: payload.display_name || 'Chapter honor' })

  revalidatePath('/about')
  redirect(`/admin/honors/${id}?success=saved`)
}

export async function deleteChapterHonor(id: string) {
  const admin = await assertAdmin()
  const { data: existing } = await admin.from('chapter_honors').select('display_name').eq('id', id).single()
  await admin.from('chapter_honors').delete().eq('id', id)
  await logActivity(admin, { action: 'delete', entityType: 'chapter_honor', entityId: id, entityLabel: existing?.display_name ?? 'Chapter honor' })
  revalidatePath('/about')
  redirect('/admin/honors')
}
