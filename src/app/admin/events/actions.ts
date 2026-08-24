'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'
import { compressImage } from '@/lib/imageCompress'

const BUCKET = 'event-photos'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')
  return admin
}

async function uploadPhoto(
  admin: ReturnType<typeof createAdminClient>,
  eventId: string,
  file: File,
): Promise<string | null> {
  const path = `${eventId}.jpg`
  const raw = new Uint8Array(await file.arrayBuffer())
  const { buffer, contentType } = await compressImage(raw)
  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: true,
  })
  if (error) return null
  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}

function buildPayload(form: FormData) {
  const startDate = form.get('start_date') as string
  const endDate = (form.get('end_date') as string) || null
  return {
    title: (form.get('title') as string).trim(),
    description: (form.get('description') as string)?.trim() || null,
    start_date: startDate,
    end_date: endDate || null,
    start_time: (form.get('start_time') as string)?.trim() || null,
    end_time: (form.get('end_time') as string)?.trim() || null,
    location: (form.get('location') as string)?.trim() || null,
    link_label: (form.get('link_label') as string)?.trim() || null,
    link_url: (form.get('link_url') as string)?.trim() || null,
    is_published: form.get('is_published') === 'true',
  }
}

export async function createEvent(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('events').insert(payload).select('id').single()
  if (error || !data) redirect('/admin/events?error=' + encodeURIComponent(error?.message ?? 'Failed to create'))

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, data.id, photo)
    if (url) await admin.from('events').update({ photo_url: url }).eq('id', data.id)
  }

  await logActivity(admin, { action: 'create', entityType: 'event', entityId: data.id, entityLabel: payload.title })

  revalidatePath('/events')
  redirect(`/admin/events/${data.id}?success=created`)
}

export async function updateEvent(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData) as Record<string, unknown>

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, id, photo)
    if (url) payload.photo_url = url
  }

  const { error } = await admin.from('events').update(payload).eq('id', id)
  if (error) redirect(`/admin/events/${id}?error=` + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'event', entityId: id, entityLabel: (payload.title as string) })

  revalidatePath('/events')
  redirect(`/admin/events/${id}?success=saved`)
}

export async function deleteEvent(id: string) {
  const admin = await assertAdmin()
  const { data: existing } = await admin.from('events').select('title').eq('id', id).single()
  await admin.storage.from(BUCKET).remove([`${id}.jpg`])
  await admin.from('events').delete().eq('id', id)
  await logActivity(admin, { action: 'delete', entityType: 'event', entityId: id, entityLabel: existing?.title ?? 'Event' })
  revalidatePath('/events')
  redirect('/admin/events')
}
