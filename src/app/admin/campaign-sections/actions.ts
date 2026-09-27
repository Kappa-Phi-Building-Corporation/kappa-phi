'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'
import { compressImage } from '@/lib/imageCompress'
import { ensureBucket } from '@/lib/ensureBucket'

const BUCKET = 'campaign-photos'

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
    title: (form.get('title') as string)?.trim() || '',
    body: (form.get('body') as string)?.trim() || null,
    sort_order: parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
    is_published: form.get('is_published') === 'on',
  }
}

export async function createSection(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('campaign_sections').insert(payload).select('id').single()
  if (error || !data) redirect('/admin/campaign-sections?error=' + encodeURIComponent(error?.message ?? 'Create failed'))

  await logActivity(admin, { action: 'create', entityType: 'campaign_section', entityId: data.id, entityLabel: payload.title })

  revalidatePath('/campaign')
  redirect(`/admin/campaign-sections/${data.id}?success=created`)
}

export async function updateSection(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { error } = await admin.from('campaign_sections').update(payload).eq('id', id)
  if (error) redirect(`/admin/campaign-sections/${id}?error=` + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'campaign_section', entityId: id, entityLabel: payload.title })

  revalidatePath('/campaign')
  redirect(`/admin/campaign-sections/${id}?success=saved`)
}

export async function deleteSection(id: string) {
  const admin = await assertAdmin()
  const { data: existing } = await admin.from('campaign_sections').select('title').eq('id', id).single()

  const { data: photos } = await admin.from('campaign_section_photos').select('photo_url').eq('section_id', id)
  for (const p of photos ?? []) {
    const path = new URL(p.photo_url, 'https://placeholder.invalid').pathname.split(`/${BUCKET}/`)[1]
    if (path) await admin.storage.from(BUCKET).remove([path])
  }

  await admin.from('campaign_sections').delete().eq('id', id)
  await logActivity(admin, { action: 'delete', entityType: 'campaign_section', entityId: id, entityLabel: existing?.title ?? 'Campaign section' })
  revalidatePath('/campaign')
  redirect('/admin/campaign-sections')
}

export async function addSectionPhotos(sectionId: string, formData: FormData) {
  const admin = await assertAdmin()
  const files = formData.getAll('photos') as File[]

  await ensureBucket(admin, BUCKET, { fileSizeLimitBytes: 8 * 1024 * 1024, allowedMimeTypes: ['image/*'] })

  const { data: existingPhotos } = await admin
    .from('campaign_section_photos')
    .select('sort_order')
    .eq('section_id', sectionId)
    .order('sort_order', { ascending: false })
    .limit(1)

  let nextOrder = (existingPhotos?.[0]?.sort_order ?? -1) + 1

  for (const file of files) {
    if (!file || file.size === 0) continue
    const path = `${sectionId}/${crypto.randomUUID()}.jpg`
    const raw = new Uint8Array(await file.arrayBuffer())
    const { buffer, contentType } = await compressImage(raw, 1920)

    const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: false })
    if (uploadError) continue

    const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path)
    await admin.from('campaign_section_photos').insert({ section_id: sectionId, photo_url: publicUrl, sort_order: nextOrder++ })
  }

  revalidatePath('/campaign')
  redirect(`/admin/campaign-sections/${sectionId}?success=photos-added`)
}

export async function updateSectionPhotoCaption(photoId: string, sectionId: string, formData: FormData) {
  const admin = await assertAdmin()
  const caption = (formData.get('caption') as string)?.trim() || null
  await admin.from('campaign_section_photos').update({ caption }).eq('id', photoId)
  revalidatePath('/campaign')
  redirect(`/admin/campaign-sections/${sectionId}?success=caption-saved`)
}

export async function deleteSectionPhoto(photoId: string, sectionId: string) {
  const admin = await assertAdmin()
  const { data: photo } = await admin.from('campaign_section_photos').select('photo_url').eq('id', photoId).single()
  if (photo?.photo_url) {
    const path = new URL(photo.photo_url, 'https://placeholder.invalid').pathname.split(`/${BUCKET}/`)[1]
    if (path) await admin.storage.from(BUCKET).remove([path])
  }
  await admin.from('campaign_section_photos').delete().eq('id', photoId)
  revalidatePath('/campaign')
  redirect(`/admin/campaign-sections/${sectionId}?success=photo-removed`)
}
