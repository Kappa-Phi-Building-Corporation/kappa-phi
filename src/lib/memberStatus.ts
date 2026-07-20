export const MEMBER_STATUS_OPTIONS = [
  { v: 'active_ug',      l: 'Active / UG' },
  { v: 'alumni',         l: 'Alumni' },
  { v: 'suspended',      l: 'Suspended' },
  { v: 'expelled_other', l: 'Expelled / Withdrawn' },
] as const

export const MEMBER_STATUS_LABELS: Record<string, string> = {
  active_ug: 'Active / UG',
  alumni: 'Alumni',
  suspended: 'Suspended',
  expelled_other: 'Expelled / Withdrawn',
}

// If a member is Expelled/Withdrawn or Deceased, force Do Not Mail + Hide Entry.
// Suspended members are NOT forced hidden — they stay visible by default.
// The DNM reason is left as submitted — the form prepopulates it but allows edits.
export function applyMemberStatusRules<T extends {
  member_status?: string | null
  is_deceased?: boolean | null
  do_not_mail?: boolean | null
  dnm_reason?: string | null
  hide_entry?: boolean | null
}>(payload: T): T {
  if (payload.member_status === 'expelled_other' || payload.is_deceased) {
    payload.do_not_mail = true
    payload.hide_entry  = true
  }
  return payload
}
