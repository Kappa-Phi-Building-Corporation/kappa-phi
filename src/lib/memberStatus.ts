export const MEMBER_STATUS_OPTIONS = [
  { v: 'active_ug',      l: 'Active / UG' },
  { v: 'alumni',         l: 'Alumni' },
  { v: 'expelled_other', l: 'Expelled / Other' },
] as const

export const MEMBER_STATUS_LABELS: Record<string, string> = {
  active_ug: 'Active / UG',
  alumni: 'Alumni',
  expelled_other: 'Expelled / Other',
}

// If a member is Expelled/Other or Deceased, force Do Not Mail + Hide Entry,
// with the DNM reason set to match why.
export function applyMemberStatusRules<T extends {
  member_status?: string | null
  is_deceased?: boolean | null
  do_not_mail?: boolean | null
  dnm_reason?: string | null
  hide_entry?: boolean | null
}>(payload: T): T {
  if (payload.member_status === 'expelled_other') {
    payload.do_not_mail = true
    payload.dnm_reason  = 'Expelled / Other'
    payload.hide_entry  = true
  } else if (payload.is_deceased) {
    payload.do_not_mail = true
    payload.dnm_reason  = 'Deceased'
    payload.hide_entry  = true
  }
  return payload
}
