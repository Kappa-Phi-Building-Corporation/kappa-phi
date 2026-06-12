'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

async function uploadPhoto(
  admin: ReturnType<typeof createAdminClient>,
  mascotId: string,
  file: File,
): Promise<string | null> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${mascotId}.${ext}`
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
  const startYear = (form.get('start_year') as string)?.trim()
  const endYear = (form.get('end_year') as string)?.trim()
  return {
    name:         (form.get('name') as string)?.trim() || '',
    start_year:   startYear ? parseInt(startYear, 10) : null,
    end_year:     endYear ? parseInt(endYear, 10) : null,
    sort_order:   parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
    is_published: form.get('is_published') !== 'off',
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

  revalidatePath('/about')
  redirect(`/admin/mascots/${data.id}?success=created`)
}

export async function updateMascot(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData) as Record<string, unknown>

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, id, photo)
    if (url) payload.photo_url = url
  }

  const { error } = await admin.from('chapter_mascots').update(payload).eq('id', id)
  if (error) redirect(`/admin/mascots/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/about')
  redirect(`/admin/mascots/${id}?success=saved`)
}

export async function deleteMascot(id: string) {
  const admin = await assertAdmin()
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    await admin.storage.from(BUCKET).remove([`${id}.${ext}`])
  }
  await admin.from('chapter_mascots').delete().eq('id', id)
  revalidatePath('/about')
  redirect('/admin/mascots')
}
