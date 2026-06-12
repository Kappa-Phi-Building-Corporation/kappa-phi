'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '../../users/actions'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { geocodeMemberFull } from '@/lib/geocode'
import { getAddressStamp, type AddressActor } from '@/lib/addressTracking'

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
    initiation_date:         str(formData.get('initiation_date')) || null,
    updated_at:              new Date().toISOString(),
  }
}

// Identify the acting admin for the address audit trail
async function getActor(admin: ReturnType<typeof createAdminClient>): Promise<AddressActor> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await admin
    .from('profiles')
    .select('role, member_id')
    .eq('id', user!.id)
    .single()
  const meta = (user!.user_metadata ?? {}) as Record<string, string>
  return {
    role: profile?.role ?? 'admin',
    memberId: profile?.member_id ?? null,
    name: `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim() || (user!.email ?? 'Admin'),
  }
}

function addrFromForm(formData: FormData) {
  return {
    address_street: str(formData.get('address_street')),
    address_city:   str(formData.get('address_city')),
    address_state:  str(formData.get('address_state')),
    address_zip:    str(formData.get('address_zip')),
  }
}

// Extract address fields from form and geocode, storing result in DB.
// Priority: full street address → zip code → city/state.
async function geocodeAndStore(admin: ReturnType<typeof createAdminClient>, memberId: string, formData: FormData) {
  const addr = {
    address_street: str(formData.get('address_street')),
    address_city:   str(formData.get('address_city')),
    address_state:  str(formData.get('address_state')),
    address_zip:    str(formData.get('address_zip')),
  }
  const hasAddress = !!(addr.address_street || addr.address_city || addr.address_zip)
  const coords = hasAddress ? await geocodeMemberFull(addr) : null
  await admin.from('members').update({ lat: coords?.lat ?? null, lng: coords?.lng ?? null }).eq('id', memberId)
}

export async function createMember(formData: FormData) {
  await requireAdmin()

  const admin = createAdminClient()
  const payload = memberPayload(formData)
  Object.assign(payload, await getAddressStamp(admin, null, addrFromForm(formData), await getActor(admin)))

  const { data: newMember, error } = await admin
    .from('members')
    .insert(payload)
    .select('id')
    .single()

  if (error) redirect(`/admin/members/new?error=${encodeURIComponent(error.message)}`)

  // Geocode after insert (non-blocking redirect if this takes a moment)
  await geocodeAndStore(admin, newMember.id, formData)

  revalidatePath('/admin/members')
  redirect(`/admin/members/${newMember.id}?saved=1`)
}

export async function updateMemberById(formData: FormData) {
  await requireAdmin()

  const memberId = formData.get('targetMemberId') as string
  if (!memberId) redirect('/admin/members')

  const admin = createAdminClient()
  const payload = memberPayload(formData)
  Object.assign(payload, await getAddressStamp(admin, memberId, addrFromForm(formData), await getActor(admin)))

  const { error } = await admin
    .from('members')
    .update(payload)
    .eq('id', memberId)

  if (error) redirect(`/admin/members/${memberId}?error=${encodeURIComponent(error.message)}`)

  // Re-geocode with updated address (street → zip → city/state priority)
  await geocodeAndStore(admin, memberId, formData)

  revalidatePath(`/admin/members/${memberId}`)
  revalidatePath('/admin/members')
  redirect(`/admin/members/${memberId}?saved=1`)
}
