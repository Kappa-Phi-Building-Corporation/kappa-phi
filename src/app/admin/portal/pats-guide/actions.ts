'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET = 'pats-guide-photos'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')
  return admin
}

function str(v: FormDataEntryValue | null) { return (v as string)?.trim() || null }

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function updateGuide(id: string, formData: FormData) {
  const admin = await assertAdmin()

  const payload = {
    title:   str(formData.get('title')) ?? "Booth's Guide to Pats",
    intro:   str(formData.get('intro')),
    pdf_url: str(formData.get('pdf_url')),
  }

  const { error } = await admin.from('pats_guide').update(payload).eq('id', id)
  if (error) redirect(`/admin/portal/pats-guide?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/portal/pats-guide')
  revalidatePath('/admin/portal/pats-guide')
  redirect('/admin/portal/pats-guide?success=saved')
}

export async function createSection(formData: FormData) {
  const admin = await assertAdmin()

  const title = str(formData.get('title')) ?? ''
  const slug = str(formData.get('slug')) || slugify(title)
  const payload = {
    title,
    slug,
    body: (formData.get('body') as string) ?? '',
    sort_order: parseInt((formData.get('sort_order') as string) ?? '0', 10) || 0,
  }

  const { error } = await admin.from('pats_guide_sections').insert(payload)
  if (error) redirect('/admin/portal/pats-guide/sections/new?error=' + encodeURIComponent(error.message))

  revalidatePath('/portal/pats-guide')
  revalidatePath('/admin/portal/pats-guide')
  redirect('/admin/portal/pats-guide?success=section-created')
}

export async function updateSection(id: string, formData: FormData) {
  const admin = await assertAdmin()

  const title = str(formData.get('title')) ?? ''
  const slug = str(formData.get('slug')) || slugify(title)
  const payload = {
    title,
    slug,
    body: (formData.get('body') as string) ?? '',
    sort_order: parseInt((formData.get('sort_order') as string) ?? '0', 10) || 0,
  }

  const { error } = await admin.from('pats_guide_sections').update(payload).eq('id', id)
  if (error) redirect(`/admin/portal/pats-guide/sections/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/portal/pats-guide')
  revalidatePath('/admin/portal/pats-guide')
  redirect('/admin/portal/pats-guide?success=section-saved')
}

export async function deleteSection(id: string) {
  const admin = await assertAdmin()
  await admin.from('pats_guide_sections').delete().eq('id', id)
  revalidatePath('/portal/pats-guide')
  revalidatePath('/admin/portal/pats-guide')
  redirect('/admin/portal/pats-guide?success=section-deleted')
}

export async function addPhoto(formData: FormData) {
  const admin = await assertAdmin()

  const file = formData.get('photo') as File | null
  if (!file || file.size === 0) {
    redirect('/admin/portal/pats-guide?error=' + encodeURIComponent('Choose a photo to upload'))
  }

  const { count } = await admin
    .from('pats_guide_photos')
    .select('*', { count: 'exact', head: true })
  const sortOrder = count ?? 0

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`
  const buffer = new Uint8Array(await file.arrayBuffer())
  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || 'image/jpeg',
  })
  if (uploadError) redirect('/admin/portal/pats-guide?error=' + encodeURIComponent(uploadError.message))

  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path)

  const caption = str(formData.get('caption'))
  const { error } = await admin.from('pats_guide_photos').insert({
    photo_url: publicUrl,
    caption,
    sort_order: sortOrder,
  })
  if (error) redirect('/admin/portal/pats-guide?error=' + encodeURIComponent(error.message))

  revalidatePath('/portal/pats-guide')
  revalidatePath('/admin/portal/pats-guide')
  redirect('/admin/portal/pats-guide?success=photo-added')
}

export async function deletePhoto(id: string, photoUrl: string) {
  const admin = await assertAdmin()

  const path = photoUrl.split(`${BUCKET}/`).pop()
  if (path) await admin.storage.from(BUCKET).remove([path])

  await admin.from('pats_guide_photos').delete().eq('id', id)

  revalidatePath('/portal/pats-guide')
  revalidatePath('/admin/portal/pats-guide')
  redirect('/admin/portal/pats-guide?success=photo-removed')
}
