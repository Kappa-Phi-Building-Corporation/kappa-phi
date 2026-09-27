'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'
import { ensureBucket } from '@/lib/ensureBucket'

const BUCKET = 'newsletters'
const MAX_BYTES = 50 * 1024 * 1024

// Newsletter PDFs are uploaded straight from the browser to Storage (using a
// one-time signed URL from prepareNewsletterUpload) rather than posted through
// a Server Action: Vercel caps request bodies at ~4.5 MB and a print-quality
// newsletter easily exceeds that. These actions only handle the metadata.

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')
  return admin
}

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string }

export type NewsletterInput = {
  title: string
  issueDate: string
  description: string
  isPublished: boolean
  // Set when a PDF was just uploaded (create, or replacing the file on edit).
  file?: { path: string; size: number }
}

export async function prepareNewsletterUpload(): Promise<Result<{ path: string; token: string }>> {
  const admin = await assertAdmin()

  await ensureBucket(admin, BUCKET, { fileSizeLimitBytes: MAX_BYTES, allowedMimeTypes: ['application/pdf'] })

  const path = `${crypto.randomUUID()}.pdf`
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path)
  if (error || !data) return { ok: false, error: error?.message ?? 'Could not start the upload.' }
  return { ok: true, path, token: data.token }
}

function validate(input: NewsletterInput): string | null {
  if (!input.title.trim()) return 'Title is required.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.issueDate)) return 'Issue date is required.'
  if (input.file && !/^[0-9a-f-]{36}\.pdf$/.test(input.file.path)) return 'Invalid file reference.'
  return null
}

function publicUrl(admin: ReturnType<typeof createAdminClient>, path: string) {
  return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

export async function createNewsletter(input: NewsletterInput): Promise<Result<{ id: string }>> {
  const admin = await assertAdmin()
  const invalid = validate(input)
  if (invalid) return { ok: false, error: invalid }
  if (!input.file) return { ok: false, error: 'Choose a PDF to upload.' }

  const { data, error } = await admin
    .from('newsletters')
    .insert({
      title: input.title.trim(),
      issue_date: input.issueDate,
      description: input.description.trim() || null,
      is_published: input.isPublished,
      file_path: input.file.path,
      file_url: publicUrl(admin, input.file.path),
      file_size: input.file.size,
    })
    .select('id')
    .single()
  if (error || !data) {
    await admin.storage.from(BUCKET).remove([input.file.path])
    return { ok: false, error: error?.message ?? 'Could not save the newsletter. Has migrate_newsletters.sql been run?' }
  }

  await logActivity(admin, { action: 'create', entityType: 'newsletter', entityId: data.id, entityLabel: input.title.trim() })
  revalidatePath('/newsletters')
  return { ok: true, id: data.id }
}

export async function updateNewsletter(id: string, input: NewsletterInput): Promise<Result> {
  const admin = await assertAdmin()
  const invalid = validate(input)
  if (invalid) return { ok: false, error: invalid }

  const { data: existing } = await admin.from('newsletters').select('file_path').eq('id', id).single()
  if (!existing) return { ok: false, error: 'Newsletter not found.' }

  const payload: Record<string, unknown> = {
    title: input.title.trim(),
    issue_date: input.issueDate,
    description: input.description.trim() || null,
    is_published: input.isPublished,
  }
  if (input.file) {
    payload.file_path = input.file.path
    payload.file_url = publicUrl(admin, input.file.path)
    payload.file_size = input.file.size
  }

  const { error } = await admin.from('newsletters').update(payload).eq('id', id)
  if (error) {
    if (input.file) await admin.storage.from(BUCKET).remove([input.file.path])
    return { ok: false, error: error.message }
  }
  // The old PDF is only removed once the row points at the new one.
  if (input.file && existing.file_path !== input.file.path) {
    await admin.storage.from(BUCKET).remove([existing.file_path])
  }

  await logActivity(admin, { action: 'update', entityType: 'newsletter', entityId: id, entityLabel: input.title.trim() })
  revalidatePath('/newsletters')
  return { ok: true }
}

export async function deleteNewsletter(id: string) {
  const admin = await assertAdmin()
  const { data: existing } = await admin.from('newsletters').select('title, file_path').eq('id', id).single()
  await admin.from('newsletters').delete().eq('id', id)
  if (existing?.file_path) await admin.storage.from(BUCKET).remove([existing.file_path])
  await logActivity(admin, { action: 'delete', entityType: 'newsletter', entityId: id, entityLabel: existing?.title ?? 'Newsletter' })
  revalidatePath('/newsletters')
  redirect('/admin/newsletters')
}
