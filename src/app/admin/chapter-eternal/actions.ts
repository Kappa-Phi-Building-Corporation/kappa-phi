'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'
import { compressImage } from '@/lib/imageCompress'

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

function storagePathFromUrl(url: string): string | null {
  try {
    return new URL(url).pathname.split(`/${BUCKET}/`)[1] || null
  } catch {
    return null
  }
}

// Every upload gets a unique, timestamped filename rather than reusing
// `${memberId}.jpg`. Overwriting the same path left the public URL
// unchanged, and browsers/CDNs/Next's image optimizer all cache by URL — so
// replacing a photo at a stable URL could go on serving the old image
// (inconsistently per device/cache) instead of the new one. A new URL on
// every upload forces everyone to fetch fresh.
async function uploadPhoto(
  admin: ReturnType<typeof createAdminClient>,
  memberId: string,
  file: File,
  previousPhotoUrl?: string | null,
): Promise<string | null> {
  const path = `${memberId}-${Date.now()}.jpg`
  const raw = new Uint8Array(await file.arrayBuffer())
  const { buffer, contentType } = await compressImage(raw, 1200)
  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  })
  if (error) return null
  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path)

  const oldPath = previousPhotoUrl ? storagePathFromUrl(previousPhotoUrl) : null
  if (oldPath) await admin.storage.from(BUCKET).remove([oldPath])

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
    memorial_hide_entry: formData.get('show_on_memorial') !== 'on',
  }

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const { data: existing } = await admin.from('members').select('photo_url').eq('id', memberId).single()
    const url = await uploadPhoto(admin, memberId, photo, existing?.photo_url)
    if (url) payload.photo_url = url
  }

  const { error } = await admin.from('members').update(payload).eq('id', memberId)
  if (error) redirect('/admin/chapter-eternal?error=' + encodeURIComponent(error.message))

  const { data: member } = await admin.from('members').select('first_name, last_name').eq('id', memberId).single()
  await logActivity(admin, {
    action: 'create',
    entityType: 'chapter_eternal',
    entityId: memberId,
    entityLabel: member ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() : 'Memorial entry',
  })

  revalidatePath('/alumni/chapter-eternal')
  redirect(`/admin/chapter-eternal/${memberId}?success=created`)
}

export async function updateEternalEntry(id: string, formData: FormData) {
  const admin = await assertAdmin()

  const payload: Record<string, unknown> = {
    passing_date: (formData.get('passing_date') as string) || null,
    memorial_link_url: (formData.get('memorial_link_url') as string)?.trim() || null,
    memorial_hide_entry: formData.get('show_on_memorial') !== 'on',
  }

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const { data: existing } = await admin.from('members').select('photo_url').eq('id', id).single()
    const url = await uploadPhoto(admin, id, photo, existing?.photo_url)
    if (url) payload.photo_url = url
  }

  const { error } = await admin.from('members').update(payload).eq('id', id)
  if (error) redirect(`/admin/chapter-eternal/${id}?error=` + encodeURIComponent(error.message))

  const { data: member } = await admin.from('members').select('first_name, last_name').eq('id', id).single()
  await logActivity(admin, {
    action: 'update',
    entityType: 'chapter_eternal',
    entityId: id,
    entityLabel: member ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() : 'Memorial entry',
  })

  revalidatePath('/alumni/chapter-eternal')
  redirect(`/admin/chapter-eternal/${id}?success=saved`)
}

export async function showEternalEntry(id: string) {
  const admin = await assertAdmin()
  await admin.from('members').update({ memorial_hide_entry: false }).eq('id', id)
  const { data: member } = await admin.from('members').select('first_name, last_name').eq('id', id).single()
  await logActivity(admin, {
    action: 'update',
    entityType: 'chapter_eternal',
    entityId: id,
    entityLabel: `${member ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() : 'Memorial entry'} (shown)`,
  })
  revalidatePath('/alumni/chapter-eternal')
  redirect('/admin/chapter-eternal')
}

export async function hideEternalEntry(id: string) {
  const admin = await assertAdmin()
  await admin.from('members').update({ memorial_hide_entry: true }).eq('id', id)
  const { data: member } = await admin.from('members').select('first_name, last_name').eq('id', id).single()
  await logActivity(admin, {
    action: 'update',
    entityType: 'chapter_eternal',
    entityId: id,
    entityLabel: `${member ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() : 'Memorial entry'} (hidden)`,
  })
  revalidatePath('/alumni/chapter-eternal')
  redirect('/admin/chapter-eternal')
}
