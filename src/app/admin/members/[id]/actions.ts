'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '../../users/actions'
import { createAdminClient } from '@/lib/supabase/admin'

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
    updated_at:              new Date().toISOString(),
  }
}

export async function createMember(formData: FormData) {
  await requireAdmin()

  const admin = createAdminClient()
  const { data: newMember, error } = await admin
    .from('members')
    .insert(memberPayload(formData))
    .select('id')
    .single()

  if (error) redirect(`/admin/members/new?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/admin/members')
  redirect(`/admin/members/${newMember.id}?saved=1`)
}

export async function updateMemberById(formData: FormData) {
  await requireAdmin()

  const memberId = formData.get('targetMemberId') as string
  if (!memberId) redirect('/admin/members')

  const admin = createAdminClient()
  const { error } = await admin
    .from('members')
    .update(memberPayload(formData))
    .eq('id', memberId)

  if (error) redirect(`/admin/members/${memberId}?error=${encodeURIComponent(error.message)}`)

  revalidatePath(`/admin/members/${memberId}`)
  revalidatePath('/admin/members')
  redirect(`/admin/members/${memberId}?saved=1`)
}
