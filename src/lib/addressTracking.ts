import type { createAdminClient } from '@/lib/supabase/admin'

export type AddressActor = { role: string; memberId: string | null; name: string }

type AddressFields = {
  address_street: string | null
  address_city:   string | null
  address_state:  string | null
  address_zip:    string | null
}

function roleLabel(role: string) {
  if (role === 'admin') return 'Admin'
  if (role === 'website_admin') return 'Website Admin'
  return 'Member'
}

export async function getAddressStamp(
  admin: ReturnType<typeof createAdminClient>,
  currentMemberId: string | null,
  newAddr: AddressFields,
  actor: AddressActor,
): Promise<{ address_updated_at: string; address_updated_by: string } | Record<string, never>> {
  let changed: boolean

  if (currentMemberId) {
    const { data: current } = await admin
      .from('members')
      .select('address_street, address_city, address_state, address_zip')
      .eq('id', currentMemberId)
      .single()

    changed = !current
      || current.address_street !== newAddr.address_street
      || current.address_city   !== newAddr.address_city
      || current.address_state  !== newAddr.address_state
      || current.address_zip    !== newAddr.address_zip
  } else {
    changed = !!(newAddr.address_street || newAddr.address_city || newAddr.address_state || newAddr.address_zip)
  }

  if (!changed) return {}

  const label = actor.memberId === currentMemberId ? 'Self' : `${actor.name} (${roleLabel(actor.role)})`

  return {
    address_updated_at: new Date().toISOString(),
    address_updated_by: label,
  }
}
