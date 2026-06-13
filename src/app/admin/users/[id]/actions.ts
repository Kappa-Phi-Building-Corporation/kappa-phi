'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '../actions'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getAddressStamp } from '@/lib/addressTracking'
import { applyMemberStatusRules } from '@/lib/memberStatus'

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
    do_not_mail:             bool(formData.get('do_not_mail')),
    dnm_reason:              str(formData.get('dnm_reason')),
    hide_entry:              bool(formData.get('hide_entry')),
    member_kpbc:             bool(formData.get('member_kpbc')),
    member_advisory:         bool(formData.get('member_advisory')),
    past_member_kpbc:        bool(formData.get('past_member_kpbc')),
    past_member_advisory:    bool(formData.get('past_member_advisory')),
    is_deceased:             bool(formData.get('is_deceased')),
    is_missing:              bool(formData.get('is_missing')),
    member_status:           str(formData.get('member_status')) ?? 'alumni',
    admin_notes:             str(formData.get('admin_notes')),
    updated_at:              new Date().toISOString(),
  }
}

export async function updateUserAdmin(formData: FormData) {
  await requireAdmin()

  const targetProfileId = formData.get('targetProfileId') as string
  const targetMemberId  = formData.get('targetMemberId')  as string | null
  if (!targetProfileId) redirect('/admin/users')

  const admin = createAdminClient()
  const payload = applyMemberStatusRules(memberPayload(formData))

  // Update profile account fields
  const { error: profileError } = await admin.from('profiles').update({
    is_approved: bool(formData.get('is_approved')),
    role:        str(formData.get('role')) ?? 'member',
  }).eq('id', targetProfileId)

  if (profileError) {
    redirect(`/admin/users/${targetProfileId}?error=${encodeURIComponent(profileError.message)}`)
  }

  // Determine the acting admin's identity for the address audit trail
  const supabase = await createClient()
  const { data: { user: actingUser } } = await supabase.auth.getUser()
  const { data: actingProfile } = await admin
    .from('profiles')
    .select('role, member_id')
    .eq('id', actingUser!.id)
    .single()
  const actingMeta = (actingUser!.user_metadata ?? {}) as Record<string, string>
  const actor = {
    role: actingProfile?.role ?? 'admin',
    memberId: actingProfile?.member_id ?? null,
    name: `${actingMeta.first_name ?? ''} ${actingMeta.last_name ?? ''}`.trim() || (actingUser!.email ?? 'Admin'),
  }
  const newAddr = {
    address_street: payload.address_street,
    address_city:   payload.address_city,
    address_state:  payload.address_state,
    address_zip:    payload.address_zip,
  }

  if (targetMemberId) {
    // Update existing member record
    Object.assign(payload, await getAddressStamp(admin, targetMemberId, newAddr, actor))
    const { error } = await admin.from('members').update(payload).eq('id', targetMemberId)
    if (error) redirect(`/admin/users/${targetProfileId}?error=${encodeURIComponent(error.message)}`)
  } else {
    // Create new member record and link it
    Object.assign(payload, await getAddressStamp(admin, null, newAddr, actor))
    const { data: newMember, error } = await admin.from('members').insert(payload).select('id').single()
    if (error) redirect(`/admin/users/${targetProfileId}?error=${encodeURIComponent(error.message)}`)
    if (newMember) {
      await admin.from('profiles').update({ member_id: newMember.id }).eq('id', targetProfileId)
    }
  }

  revalidatePath(`/admin/users/${targetProfileId}`)
  revalidatePath('/admin/users')
  redirect(`/admin/users/${targetProfileId}?saved=1`)
}

export async function linkMember(formData: FormData) {
  await requireAdmin()
  const targetProfileId = formData.get('targetProfileId') as string
  const memberId        = str(formData.get('memberId'))
  if (!targetProfileId) redirect('/admin/users')

  await createAdminClient()
    .from('profiles')
    .update({ member_id: memberId })
    .eq('id', targetProfileId)

  revalidatePath(`/admin/users/${targetProfileId}`)
  redirect(`/admin/users/${targetProfileId}?saved=1`)
}
