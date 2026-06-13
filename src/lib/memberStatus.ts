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

// If a member is Expelled/Other or Deceased, force Do Not Mail + Hide Entry.
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
