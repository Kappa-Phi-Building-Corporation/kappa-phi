'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET = 'board-photos'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')
  return admin
}

async function uploadPhoto(
  admin: ReturnType<typeof createAdminClient>,
  memberId: string,
  file: File,
): Promise<string | null> {
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
    name:            (form.get('name') as string)?.trim() || null,
    role:            (form.get('role') as string)?.trim() || null,
    category:        (form.get('category') as string) || 'director',
    email:           (form.get('email') as string)?.trim() || null,
    bio:             (form.get('bio') as string)?.trim() || null,
    goals:           (form.get('goals') as string)?.trim() || null,
    goals_bulleted:  form.get('goals_bulleted') === 'on',
    sort_order:      parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
    is_active:       form.get('is_active') !== 'off',
  }
}

export async function createBoardMember(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { data, error } = await admin.from('board_members').insert(payload).select('id').single()
  if (error || !data) redirect('/admin/board?error=' + encodeURIComponent(error?.message ?? 'Create failed'))

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, data.id, photo)
    if (url) await admin.from('board_members').update({ photo_url: url }).eq('id', data.id)
  }

  revalidatePath('/board')
  redirect(`/admin/board/${data.id}?success=created`)
}

export async function updateBoardMember(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData) as Record<string, unknown>

  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const url = await uploadPhoto(admin, id, photo)
    if (url) payload.photo_url = url
  }

  const { error } = await admin.from('board_members').update(payload).eq('id', id)
  if (error) redirect(`/admin/board/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/board')
  redirect(`/admin/board/${id}?success=saved`)
}

export async function deleteBoardMember(id: string) {
  const admin = await assertAdmin()
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    await admin.storage.from(BUCKET).remove([`${id}.${ext}`])
  }
  await admin.from('board_members').delete().eq('id', id)
  revalidatePath('/board')
  redirect('/admin/board')
}
