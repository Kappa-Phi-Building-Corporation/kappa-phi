'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET = 'property-photos'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')
  return admin
}

function buildProjectPayload(form: FormData) {
  return {
    name:           (form.get('name') as string)?.trim() || null,
    status:         (form.get('status') as string) || 'planned',
    description:    (form.get('description') as string)?.trim() || null,
    scheduled_date: (form.get('scheduled_date') as string)?.trim() || null,
    completed_date: (form.get('completed_date') as string)?.trim() || null,
    cost:           (form.get('cost') as string)?.trim() || null,
    contractor:     (form.get('contractor') as string)?.trim() || null,
    sort_order:     parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
    is_published:   form.get('is_published') !== 'off',
  }
}

export async function createProject(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildProjectPayload(formData)

  const { data, error } = await admin
    .from('property_projects')
    .insert(payload)
    .select('id')
    .single()
  if (error || !data) redirect('/admin/property?error=' + encodeURIComponent(error?.message ?? 'Create failed'))

  revalidatePath('/property')
  redirect(`/admin/property/${data.id}?success=created`)
}

export async function archiveProject(id: string) {
  const admin = await assertAdmin()
  const { error } = await admin
    .from('property_projects')
    .update({ status: 'archive' })
    .eq('id', id)
  if (error) redirect('/admin/property?error=' + encodeURIComponent(error.message))
  revalidatePath('/property')
  redirect('/admin/property')
}

export async function updateProject(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildProjectPayload(formData)

  const { error } = await admin.from('property_projects').update(payload).eq('id', id)
  if (error) redirect(`/admin/property/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/property')
  redirect(`/admin/property/${id}?success=saved`)
}

export async function deleteProject(id: string) {
  const admin = await assertAdmin()

  // Fetch and delete all photos from storage
  const { data: photos } = await admin
    .from('property_project_photos')
    .select('photo_url')
    .eq('project_id', id)

  for (const p of photos ?? []) {
    const path = new URL(p.photo_url).pathname.split(`/${BUCKET}/`)[1]
    if (path) await admin.storage.from(BUCKET).remove([path])
  }

  await admin.from('property_projects').delete().eq('id', id)
  revalidatePath('/property')
  redirect('/admin/property')
}

export async function addProjectPhotos(projectId: string, formData: FormData) {
  const admin = await assertAdmin()
  const files = formData.getAll('photos') as File[]

  const { data: existingPhotos } = await admin
    .from('property_project_photos')
    .select('sort_order')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: false })
    .limit(1)

  let nextOrder = (existingPhotos?.[0]?.sort_order ?? -1) + 1

  for (const file of files) {
    if (!file || file.size === 0) continue
    const photoId = crypto.randomUUID()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${projectId}/${photoId}.${ext}`
    const buffer = new Uint8Array(await file.arrayBuffer())

    const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })
    if (uploadError) continue

    const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path)
    const caption = (formData.get(`caption_${file.name}`) as string)?.trim() || null

    await admin.from('property_project_photos').insert({
      project_id: projectId,
      photo_url: publicUrl,
      caption,
      sort_order: nextOrder++,
    })
  }

  revalidatePath('/property')
  redirect(`/admin/property/${projectId}?success=photos-added`)
}

export async function deleteProjectPhoto(photoId: string, projectId: string) {
  const admin = await assertAdmin()

  const { data: photo } = await admin
    .from('property_project_photos')
    .select('photo_url')
    .eq('id', photoId)
    .single()

  if (photo?.photo_url) {
    const path = new URL(photo.photo_url).pathname.split(`/${BUCKET}/`)[1]
    if (path) await admin.storage.from(BUCKET).remove([path])
  }

  await admin.from('property_project_photos').delete().eq('id', photoId)
  revalidatePath('/property')
  redirect(`/admin/property/${projectId}?success=photo-removed`)
}
