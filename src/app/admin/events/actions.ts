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
  if (profile?.role !== 'admin') redirect('/portal')
  return admin
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

  revalidatePath('/events')
  redirect(`/admin/events/${data.id}?success=created`)
}

export async function updateEvent(id: string, formData: FormData) {
  const admin = await assertAdmin()
  const payload = buildPayload(formData)

  const { error } = await admin.from('events').update(payload).eq('id', id)
  if (error) redirect(`/admin/events/${id}?error=` + encodeURIComponent(error.message))

  revalidatePath('/events')
  redirect(`/admin/events/${id}?success=saved`)
}

export async function deleteEvent(id: string) {
  const admin = await assertAdmin()
  await admin.from('events').delete().eq('id', id)
  revalidatePath('/events')
  redirect('/admin/events')
}
