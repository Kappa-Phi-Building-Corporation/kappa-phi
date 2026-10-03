'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'
import { compressImage } from '@/lib/imageCompress'

const BUCKET = 'mascot-photos'

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
// `${mascotId}.jpg`. Overwriting the same path left the public URL
// unchanged, and browsers/CDNs/Next's image optimizer all cache by URL — so
// replacing a photo at a stable URL could go on serving the old image
// (inconsistently per device/cache) instead of the new one. A new URL on
// every upload forces everyone to fetch fresh.
async function uploadPhoto(
  admin: ReturnType<typeof createAdminClient>,
  mascotId: string,
  file: File,
  previousPhotoUrl?: string | null,
): Promise<string | null> {
  const path = `${mascotId}-${Date.now()}.jpg`
  const raw = new Uint8Array(await file.arrayBuffer())
  const { buffer, contentType } = await compressImage(raw)
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

function buildPayload(form: FormData) {
  const startYear = (form.get('start_year') as string)?.trim()
  const endYear = (form.get('end_year') as string)?.trim()
  return {
    name:         (form.get('name') as string)?.trim() || '',
    start_year:   startYear ? parseInt(startYear, 10) : null,
    end_year:     endYear ? parseInt(endYear, 10) : null,
    sort_order:   parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
    is_published: form.get('is_published') === 'on',
  }
}

export async function createMascot(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('chapter_mascots').insert(payload).select('id').single()
  if (error || !data) redirect('/admin/mascots?error=' + encodeURIComponent(error?.message ?? 'Create failed'))

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, data.id, photo)
    if (url) await admin.from('chapter_mascots').update({ photo_url: url }).eq('id', data.id)
  }

  await logActivity(admin, { action: 'create', entityType: 'chapter_mascot', entityId: data.id, entityLabel: payload.name || 'Mascot' })

  revalidatePath('/about')
  redirect(`/admin/mascots/${data.id}?success=created`)
}

export async function updateMascot(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData) as Record<string, unknown>

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const { data: existing } = await admin.from('chapter_mascots').select('photo_url').eq('id', id).single()
    const url = await uploadPhoto(admin, id, photo, existing?.photo_url)
    if (url) payload.photo_url = url
  }

  const { error } = await admin.from('chapter_mascots').update(payload).eq('id', id)
  if (error) redirect(`/admin/mascots/${id}?error=` + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'chapter_mascot', entityId: id, entityLabel: (payload.name as string) || 'Mascot' })

  revalidatePath('/about')
  redirect(`/admin/mascots/${id}?success=saved`)
}

export async function deleteMascot(id: string) {
  const admin = await assertAdmin()
  const { data: existing } = await admin.from('chapter_mascots').select('name, photo_url').eq('id', id).single()
  const photoPath = existing?.photo_url ? storagePathFromUrl(existing.photo_url) : null
  if (photoPath) await admin.storage.from(BUCKET).remove([photoPath])
  await admin.from('chapter_mascots').delete().eq('id', id)
  await logActivity(admin, { action: 'delete', entityType: 'chapter_mascot', entityId: id, entityLabel: existing?.name ?? 'Mascot' })
  revalidatePath('/about')
  redirect('/admin/mascots')
}
