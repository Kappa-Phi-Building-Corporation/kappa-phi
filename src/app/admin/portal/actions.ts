'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
    label:        (form.get('label') as string)?.trim() || '',
    href:         (form.get('href')  as string)?.trim() || '',
    is_external:  form.get('is_external') === 'on',
    requires_auth: form.get('requires_auth') === 'on',
    sort_order:   parseInt((form.get('sort_order') as string) ?? '0', 10) || 0,
    is_published: form.get('is_published') !== 'off',
  }
}

export async function createPortalResource(formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { error } = await admin.from('portal_resources').insert(payload)
  if (error) redirect('/admin/portal?error=' + encodeURIComponent(error.message))

  revalidatePath('/portal')
  redirect('/admin/portal?success=created')
}

export async function updatePortalResource(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { error } = await admin.from('portal_resources').update(payload).eq('id', id)
  if (error) redirect(`/admin/portal/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/portal')
  redirect(`/admin/portal/${id}?success=saved`)
}

export async function deletePortalResource(id: string) {
  const admin = await assertAdmin()
  await admin.from('portal_resources').delete().eq('id', id)
  revalidatePath('/portal')
  redirect('/admin/portal')
}
