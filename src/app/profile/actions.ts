'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAddressStamp } from '@/lib/addressTracking'

function str(v: FormDataEntryValue | null) { return (v as string) || null }
function bool(v: FormDataEntryValue | null) { return v === 'on' }
function num(v: FormDataEntryValue | null)  { return v ? parseInt(v as string) : null }

function memberPayload(formData: FormData) {
  return {
    title:                   str(formData.get('title')),
    first_name:              str(formData.get('first_name')) ?? '',
    last_name:               str(formData.get('last_name'))  ?? '',
    nickname:                str(formData.get('nickname')),
    spouse_title:            str(formData.get('spouse_title')),
    spouse_first_name:       str(formData.get('spouse_first_name')),
    spouse_last_name:        str(formData.get('spouse_last_name')),
    marital_status:          str(formData.get('marital_status')),
    home_phone:              str(formData.get('home_phone')),
    mobile_phone:            str(formData.get('mobile_phone')),
    work_phone:              str(formData.get('work_phone')),
    alternate_phone:         str(formData.get('alternate_phone')),
    email:                   str(formData.get('email')),
    alternate_email:         str(formData.get('alternate_email')),
    address_street:          str(formData.get('address_street')),
    address_city:            str(formData.get('address_city')),
    address_state:           str(formData.get('address_state')),
    address_zip:             str(formData.get('address_zip')),
    badge_number:            str(formData.get('badge_number')),
    pledge_class:            str(formData.get('pledge_class')),
    big_brother_id:          str(formData.get('big_brother_id')),
    graduation_year:         num(formData.get('graduation_year')),
    degrees:                 str(formData.get('degrees')),
    completed_undergraduate: bool(formData.get('completed_undergraduate')),
    completed_graduate:      bool(formData.get('completed_graduate')),
    employer:                str(formData.get('employer')),
    occupation:              str(formData.get('occupation')),
    bio:                     str(formData.get('bio')),
    updated_at:              new Date().toISOString(),
  }
}

// ── User account ──────────────────────────────────────────────────────────────

export type AccountSyncState = {
  type: 'syncToMember'
  memberId: string
  firstName: string
  lastName: string
  email: string
  memberFirstName: string | null
  memberLastName: string | null
  memberEmail: string | null
} | {
  type: 'error'
  message: string
} | null

export async function updateUserAccount(
  _prev: AccountSyncState,
  formData: FormData,
): Promise<AccountSyncState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const firstName = ((formData.get('firstName') as string) ?? '').trim()
  const lastName  = ((formData.get('lastName')  as string) ?? '').trim()
  const email     = ((formData.get('email')     as string) ?? '').trim()

  const updateData: Parameters<typeof supabase.auth.updateUser>[0] = {
    data: { first_name: firstName, last_name: lastName },
  }
  if (email && email !== user.email) updateData.email = email

  const { error } = await supabase.auth.updateUser(updateData)
  if (error) return { type: 'error', message: error.message }

  // Check if linked member record needs syncing
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('member_id')
    .eq('id', user.id)
    .single()

  let member: { first_name: string | null; last_name: string | null; email: string | null } | null = null
  if (profile?.member_id) {
    const { data } = await admin
      .from('members')
      .select('first_name, last_name, email')
      .eq('id', profile.member_id)
      .single()
    member = data ?? null
  }

  if (profile?.member_id && member) {
    const differs =
      (member.first_name !== null && member.first_name !== firstName) ||
      (member.last_name  !== null && member.last_name  !== lastName)  ||
      (member.email      !== null && member.email      !== email)

    if (differs) {
      return {
        type: 'syncToMember',
        memberId: profile.member_id,
        firstName, lastName, email,
        memberFirstName: member.first_name,
        memberLastName:  member.last_name,
        memberEmail:     member.email,
      }
    }
  }

  revalidatePath('/profile')
  redirect('/profile?saved=1')
}

export async function syncAccountToMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const memberId  = formData.get('memberId')  as string
  const firstName = formData.get('firstName') as string
  const lastName  = formData.get('lastName')  as string
  const email     = formData.get('email')     as string

  const admin = createAdminClient()
  await admin.from('members').update({
    first_name: firstName || null,
    last_name:  lastName  || null,
    email:      email     || null,
  }).eq('id', memberId)

  revalidatePath('/profile')
  redirect('/profile?saved=1')
}

export type PasswordState = { type: 'error'; message: string } | null

export async function updatePassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const password = (formData.get('password') as string) ?? ''
  const confirm  = (formData.get('confirm')  as string) ?? ''

  if (!password) return { type: 'error', message: 'Please enter a new password.' }
  if (password.length < 8) return { type: 'error', message: 'Password must be at least 8 characters.' }
  if (password !== confirm) return { type: 'error', message: 'Passwords do not match.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { type: 'error', message: error.message }

  revalidatePath('/profile')
  redirect('/profile?saved=1')
}

// ── Member profile ────────────────────────────────────────────────────────────

export type MemberSyncState = {
  type: 'syncToAccount'
  firstName: string
  lastName: string
  email: string
  authFirstName: string
  authLastName: string
  authEmail: string
} | {
  type: 'error'
  message: string
} | null

export async function updateProfile(
  _prev: MemberSyncState,
  formData: FormData,
): Promise<MemberSyncState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('member_id, role')
    .eq('id', user.id)
    .single()

  const payload = memberPayload(formData)

  // Non-admins cannot change locked fields — restore current DB values regardless of what was submitted
  if (profile?.role !== 'admin' && profile?.member_id) {
    const { data: current } = await admin
      .from('members')
      .select('badge_number, pledge_class, big_brother_id')
      .eq('id', profile.member_id)
      .single()
    if (current) {
      payload.badge_number   = current.badge_number
      payload.pledge_class   = current.pledge_class
      payload.big_brother_id = current.big_brother_id
    }
  }

  const meta = (user.user_metadata ?? {}) as Record<string, string>
  const actor = {
    role: profile?.role ?? 'member',
    memberId: profile?.member_id ?? null,
    name: `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim() || (user.email ?? 'Member'),
  }
  const addressStamp = await getAddressStamp(admin, profile?.member_id ?? null, {
    address_street: payload.address_street,
    address_city:   payload.address_city,
    address_state:  payload.address_state,
    address_zip:    payload.address_zip,
  }, actor)
  Object.assign(payload, addressStamp)

  if (profile?.member_id) {
    const { error } = await admin.from('members').update(payload).eq('id', profile.member_id)
    if (error) return { type: 'error', message: error.message }
  } else {
    const { data: newMember, error } = await admin.from('members').insert(payload).select('id').single()
    if (error) return { type: 'error', message: error.message }
    if (newMember) {
      await admin.from('profiles').update({ member_id: newMember.id }).eq('id', user.id)
    }
  }

  // Check if auth user needs syncing
  const newFirst = payload.first_name ?? ''
  const newLast  = payload.last_name  ?? ''
  const newEmail = payload.email      ?? ''
  const authFirst = meta.first_name ?? ''
  const authLast  = meta.last_name  ?? ''
  const authEmail = user.email ?? ''

  const differs =
    (authFirst && authFirst !== newFirst) ||
    (authLast  && authLast  !== newLast)  ||
    (newEmail  && authEmail !== newEmail)

  if (differs) {
    return {
      type: 'syncToAccount',
      firstName: newFirst,
      lastName:  newLast,
      email:     newEmail,
      authFirstName: authFirst,
      authLastName:  authLast,
      authEmail,
    }
  }

  revalidatePath('/profile')
  redirect('/profile?saved=1')
}

// ── Member link requests ──────────────────────────────────────────────────────

export async function requestMemberLink(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const requestedMemberId = formData.get('requestedMemberId') as string
  if (!requestedMemberId) redirect('/profile?error=Please+select+a+member')

  const admin = createAdminClient()

  // Check if another profile already links to this member
  const { data: conflict } = await admin
    .from('profiles')
    .select('id')
    .eq('member_id', requestedMemberId)
    .neq('id', user.id)
    .maybeSingle()

  await admin.from('profiles').update({
    requested_member_id: requestedMemberId,
    link_request_status: conflict ? 'conflict' : 'pending',
  }).eq('id', user.id)

  revalidatePath('/profile')
  redirect('/profile')
}

export async function cancelLinkRequest() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await createAdminClient().from('profiles').update({
    requested_member_id: null,
    link_request_status: null,
  }).eq('id', user.id)

  revalidatePath('/profile')
}

// ── Chapter field change requests ─────────────────────────────────────────────

export async function requestFieldChange(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('member_id').eq('id', user.id).single()
  if (!profile?.member_id) redirect('/profile')

  // Replace any existing pending request from this member
  await admin.from('member_change_requests')
    .delete()
    .eq('member_id', profile.member_id)
    .eq('status', 'pending')

  await admin.from('member_change_requests').insert({
    profile_id:     user.id,
    member_id:      profile.member_id,
    badge_number:   (formData.get('badge_number')   as string) || null,
    pledge_class:   (formData.get('pledge_class')   as string) || null,
    big_brother_id: (formData.get('big_brother_id') as string) || null,
    note:           (formData.get('note')           as string) || null,
  })

  revalidatePath('/profile')
  redirect('/profile')
}

export async function cancelChangeRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('member_id').eq('id', user.id).single()
  if (!profile?.member_id) redirect('/profile')

  await admin.from('member_change_requests')
    .delete()
    .eq('id', formData.get('requestId') as string)
    .eq('member_id', profile.member_id)

  revalidatePath('/profile')
}

export async function syncMemberToAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const firstName = (formData.get('firstName') as string) ?? ''
  const lastName  = (formData.get('lastName')  as string) ?? ''
  const email     = (formData.get('email')     as string) ?? ''

  const updateData: Parameters<typeof supabase.auth.updateUser>[0] = {
    data: { first_name: firstName, last_name: lastName },
  }
  if (email && email !== user.email) updateData.email = email

  await supabase.auth.updateUser(updateData)
  revalidatePath('/profile')
  redirect('/profile?saved=1')
}
