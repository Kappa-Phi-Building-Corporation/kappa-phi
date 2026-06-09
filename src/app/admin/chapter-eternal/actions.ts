'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET = 'chapter-eternal-photos'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')
  return admin
}

async function uploadPhoto(admin: ReturnType<typeof createAdminClient>, memberId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${memberId}.${ext}`
  const buffer = new Uint8Array(await file.arrayBuffer())
  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || 'image/jpeg',
    upsert: true,
  })
  if (error) return null
  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}

function buildPayload(form: FormData) {
  return {
    first_name: (form.get('first_name') as string)?.trim() || null,
    last_name: (form.get('last_name') as string)?.trim() || null,
    title: (form.get('title') as string)?.trim() || null,
    badge_number: (form.get('badge_number') as string)?.trim() || null,
    pledge_class: (form.get('pledge_class') as string)?.trim() || null,
    initiation_date: (form.get('initiation_date') as string) || null,
    passing_date: (form.get('passing_date') as string) || null,
    memorial_link_url: (form.get('memorial_link_url') as string)?.trim() || null,
    is_deceased: true,
    hide_entry: false,
  }
}

export async function createEternalEntry(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('members').insert(payload).select('id').single()
  if (error || !data) redirect('/admin/chapter-eternal?error=' + encodeURIComponent(error?.message ?? 'Create failed'))

  // Upload photo if provided
  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, data.id, photo)
    if (url) await admin.from('members').update({ photo_url: url }).eq('id', data.id)
  }

  revalidatePath('/alumni/chapter-eternal')
  redirect(`/admin/chapter-eternal/${data.id}?success=created`)
}

export async function updateEternalEntry(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  // Upload new photo if one was provided
  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, id, photo)
    if (url) (payload as Record<string, unknown>).photo_url = url
  }

  const { error } = await admin.from('members').update(payload).eq('id', id)
  if (error) redirect(`/admin/chapter-eternal/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/alumni/chapter-eternal')
  redirect(`/admin/chapter-eternal/${id}?success=saved`)
}

export async function deleteEternalEntry(id: string) {
  const admin = await assertAdmin()
  // Remove photo from storage (best effort)
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    await admin.storage.from(BUCKET).remove([`${id}.${ext}`])
  }
  await admin.from('members').delete().eq('id', id)
  revalidatePath('/alumni/chapter-eternal')
  redirect('/admin/chapter-eternal')
}
