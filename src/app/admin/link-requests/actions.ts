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

export async function approveLinkRequest(formData: FormData) {
  const admin      = await requireAdmin()
  const profileId  = formData.get('profileId')  as string
  const memberId   = formData.get('memberId')    as string

  // If this member was linked to someone else (conflict), unlink them first
  await admin.from('profiles').update({ member_id: null }).eq('member_id', memberId).neq('id', profileId)

  await admin.from('profiles').update({
    member_id:            memberId,
    requested_member_id:  null,
    link_request_status:  null,
    is_approved:          true,
  }).eq('id', profileId)

  revalidatePath('/admin/link-requests')
}

export async function approveWithMember(formData: FormData) {
  const admin          = await requireAdmin()
  const profileId      = formData.get('profileId')      as string
  const newMemberId    = formData.get('newMemberId')     as string

  // Unlink any existing profile pointing at newMemberId
  await admin.from('profiles').update({ member_id: null }).eq('member_id', newMemberId).neq('id', profileId)

  await admin.from('profiles').update({
    member_id:            newMemberId,
    requested_member_id:  null,
    link_request_status:  null,
    is_approved:          true,
  }).eq('id', profileId)

  revalidatePath('/admin/link-requests')
}

export async function denyLinkRequest(formData: FormData) {
  const admin     = await requireAdmin()
  const profileId = formData.get('profileId') as string

  await admin.from('profiles').update({
    requested_member_id: null,
    link_request_status: 'denied',
  }).eq('id', profileId)

  revalidatePath('/admin/link-requests')
}
