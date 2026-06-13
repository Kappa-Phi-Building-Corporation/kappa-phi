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
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')
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

// Creates a chapter eternal entry by updating an existing member record.
// Member info (name, badge, etc.) is already in the record; we only set
// the chapter-eternal-specific fields.
export async function createEternalEntry(formData: FormData) {
  const admin = await assertAdmin()
  const memberId = (formData.get('member_id') as string)?.trim()
  if (!memberId) redirect('/admin/chapter-eternal?error=' + encodeURIComponent('No member selected'))

  const payload: Record<string, unknown> = {
    is_deceased: true,
    passing_date: (formData.get('passing_date') as string) || null,
    memorial_link_url: (formData.get('memorial_link_url') as string)?.trim() || null,
    hide_entry: false,
  }

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, memberId, photo)
    if (url) payload.photo_url = url
  }

  const { error } = await admin.from('members').update(payload).eq('id', memberId)
  if (error) redirect('/admin/chapter-eternal?error=' + encodeURIComponent(error.message))

  revalidatePath('/alumni/chapter-eternal')
  redirect(`/admin/chapter-eternal/${memberId}?success=created`)
}

export async function updateEternalEntry(id: string, formData: FormData) {
  const admin = await assertAdmin()

  const payload: Record<string, unknown> = {
    passing_date: (formData.get('passing_date') as string) || null,
    memorial_link_url: (formData.get('memorial_link_url') as string)?.trim() || null,
    hide_entry: formData.get('show_on_memorial') !== 'on',
  }

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, id, photo)
    if (url) payload.photo_url = url
  }

  const { error } = await admin.from('members').update(payload).eq('id', id)
  if (error) redirect(`/admin/chapter-eternal/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/alumni/chapter-eternal')
  redirect(`/admin/chapter-eternal/${id}?success=saved`)
}

export async function showEternalEntry(id: string) {
  const admin = await assertAdmin()
  await admin.from('members').update({ hide_entry: false }).eq('id', id)
  revalidatePath('/alumni/chapter-eternal')
  redirect('/admin/chapter-eternal')
}

export async function hideEternalEntry(id: string) {
  const admin = await assertAdmin()
  await admin.from('members').update({ hide_entry: true }).eq('id', id)
  revalidatePath('/alumni/chapter-eternal')
  redirect('/admin/chapter-eternal')
}
