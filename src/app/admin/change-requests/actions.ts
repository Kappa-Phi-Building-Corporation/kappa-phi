'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')
  return admin
}

export async function approveChangeRequest(formData: FormData) {
  const admin     = await requireAdmin()
  const requestId = formData.get('requestId') as string

  const { data: req } = await admin
    .from('member_change_requests')
    .select('member_id, badge_number, pledge_class, big_brother_id')
    .eq('id', requestId)
    .single()

  if (!req) redirect('/admin/change-requests')

  const update: Record<string, string | null> = {}
  if (req.badge_number   !== null) update.badge_number   = req.badge_number
  if (req.pledge_class   !== null) update.pledge_class   = req.pledge_class
  if (req.big_brother_id !== null) update.big_brother_id = req.big_brother_id

  if (Object.keys(update).length > 0) {
    await admin.from('members').update(update).eq('id', req.member_id)
  }

  await admin.from('member_change_requests').update({ status: 'approved' }).eq('id', requestId)

  revalidatePath('/admin/change-requests')
}

export async function denyChangeRequest(formData: FormData) {
  const admin     = await requireAdmin()
  const requestId = formData.get('requestId') as string

  await admin.from('member_change_requests').update({ status: 'denied' }).eq('id', requestId)

  revalidatePath('/admin/change-requests')
}
