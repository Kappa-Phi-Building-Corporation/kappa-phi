import { createAdminClient } from '@/lib/supabase/admin'

type AdminClient = ReturnType<typeof createAdminClient>
export type ReportRow = Record<string, string | number | boolean | null>

export type ReportDef = {
  id: string
  title: string
  description: string
  columns: { key: string; label: string }[]
  fetchRows: (admin: AdminClient) => Promise<ReportRow[]>
}

function fullName(first: string | null, last: string | null) {
  return `${first ?? ''} ${last ?? ''}`.trim()
}

function badgeNum(badge: string | null) {
  return parseInt(badge ?? '999999', 10) || 999999
}

export const REPORTS: ReportDef[] = [
  {
    id: 'mailing-list',
    title: 'Mailing & Contact List',
    description: 'Members eligible for mail/contact — excludes Do Not Mail and hidden records. Full address, phones, and emails.',
    columns: [
      { key: 'badge_number', label: 'Badge' },
      { key: 'name', label: 'Name' },
      { key: 'address_street', label: 'Address' },
      { key: 'address_city', label: 'City' },
      { key: 'address_state', label: 'State' },
      { key: 'address_zip', label: 'Zip' },
      { key: 'home_phone', label: 'Home Phone' },
      { key: 'mobile_phone', label: 'Mobile Phone' },
      { key: 'work_phone', label: 'Work Phone' },
      { key: 'email', label: 'Primary Email' },
      { key: 'alternate_email', label: 'Alternate Email' },
    ],
    async fetchRows(admin) {
      const { data } = await admin
        .from('members')
        .select('badge_number, first_name, last_name, address_street, address_city, address_state, address_zip, home_phone, mobile_phone, work_phone, email, alternate_email')
        .eq('do_not_mail', false)
        .eq('hide_entry', false)
      return (data ?? [])
        .sort((a, b) => badgeNum(a.badge_number) - badgeNum(b.badge_number))
        .map(m => ({
          badge_number: m.badge_number,
          name: fullName(m.first_name, m.last_name),
          address_street: m.address_street,
          address_city: m.address_city,
          address_state: m.address_state,
          address_zip: m.address_zip,
          home_phone: m.home_phone,
          mobile_phone: m.mobile_phone,
          work_phone: m.work_phone,
          email: m.email,
          alternate_email: m.alternate_email,
        }))
    },
  },
  {
    id: 'email-list',
    title: 'Email List',
    description: 'Members with an email on file, excluding deceased and hidden records — for email newsletter exports.',
    columns: [
      { key: 'badge_number', label: 'Badge' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Primary Email' },
      { key: 'alternate_email', label: 'Alternate Email' },
    ],
    async fetchRows(admin) {
      const { data } = await admin
        .from('members')
        .select('badge_number, first_name, last_name, email, alternate_email')
        .eq('is_deceased', false)
        .eq('hide_entry', false)
      return (data ?? [])
        .filter(m => m.email || m.alternate_email)
        .sort((a, b) => badgeNum(a.badge_number) - badgeNum(b.badge_number))
        .map(m => ({
          badge_number: m.badge_number,
          name: fullName(m.first_name, m.last_name),
          email: m.email,
          alternate_email: m.alternate_email,
        }))
    },
  },
  {
    id: 'nicknames',
    title: 'Nickname Roster',
    description: 'Badge, pledge class, and nickname for every non-expelled member with a nickname on file.',
    columns: [
      { key: 'badge_number', label: 'Badge' },
      { key: 'name', label: 'Name' },
      { key: 'pledge_class', label: 'Pledge Class' },
      { key: 'nickname', label: 'Nickname' },
    ],
    async fetchRows(admin) {
      const { data } = await admin
        .from('members')
        .select('badge_number, first_name, last_name, pledge_class, nickname')
        .neq('member_status', 'expelled_other')
        .not('nickname', 'is', null)
      return (data ?? [])
        .sort((a, b) => badgeNum(a.badge_number) - badgeNum(b.badge_number))
        .map(m => ({
          badge_number: m.badge_number,
          name: fullName(m.first_name, m.last_name),
          pledge_class: m.pledge_class,
          nickname: m.nickname,
        }))
    },
  },
  {
    id: 'big-brother',
    title: 'Big Brother Assignments',
    description: 'Full roster with recorded big brother — for auditing lineage data against outside records.',
    columns: [
      { key: 'badge_number', label: 'Badge' },
      { key: 'name', label: 'Name' },
      { key: 'nickname', label: 'Nickname' },
      { key: 'pledge_class', label: 'Pledge Class' },
      { key: 'big_brother', label: 'Big Brother' },
      { key: 'do_not_mail', label: 'Do Not Mail' },
      { key: 'dnm_reason', label: 'DNM Reason' },
    ],
    async fetchRows(admin) {
      const { data } = await admin
        .from('members')
        .select('id, badge_number, first_name, last_name, nickname, pledge_class, big_brother_id, do_not_mail, dnm_reason')
      const rows = data ?? []
      const nameById = new Map(rows.map(m => [m.id, fullName(m.first_name, m.last_name)]))
      return rows
        .sort((a, b) => badgeNum(a.badge_number) - badgeNum(b.badge_number))
        .map(m => ({
          badge_number: m.badge_number,
          name: fullName(m.first_name, m.last_name),
          nickname: m.nickname,
          pledge_class: m.pledge_class,
          big_brother: m.big_brother_id ? (nameById.get(m.big_brother_id) ?? '') : '',
          do_not_mail: m.do_not_mail ? 'Yes' : 'No',
          dnm_reason: m.dnm_reason,
        }))
    },
  },
  {
    id: 'lost-contact',
    title: 'Lost Contact Detail',
    description: 'Full detail (address, big brother, last known address update) for members marked Missing / Lost Contact — for research.',
    columns: [
      { key: 'badge_number', label: 'Badge' },
      { key: 'name', label: 'Name' },
      { key: 'address_street', label: 'Last Known Address' },
      { key: 'address_city', label: 'City' },
      { key: 'address_state', label: 'State' },
      { key: 'address_zip', label: 'Zip' },
      { key: 'pledge_class', label: 'Pledge Class' },
      { key: 'big_brother', label: 'Big Brother' },
      { key: 'dnm_reason', label: 'DNM Reason' },
      { key: 'address_updated_at', label: 'Address Last Updated' },
      { key: 'address_updated_by', label: 'Updated By' },
    ],
    async fetchRows(admin) {
      const { data: all } = await admin.from('members').select('id, first_name, last_name')
      const nameById = new Map((all ?? []).map(m => [m.id, fullName(m.first_name, m.last_name)]))

      const { data } = await admin
        .from('members')
        .select('badge_number, first_name, last_name, address_street, address_city, address_state, address_zip, pledge_class, big_brother_id, dnm_reason, address_updated_at, address_updated_by')
        .eq('is_missing', true)
      return (data ?? [])
        .sort((a, b) => badgeNum(a.badge_number) - badgeNum(b.badge_number))
        .map(m => ({
          badge_number: m.badge_number,
          name: fullName(m.first_name, m.last_name),
          address_street: m.address_street,
          address_city: m.address_city,
          address_state: m.address_state,
          address_zip: m.address_zip,
          pledge_class: m.pledge_class,
          big_brother: m.big_brother_id ? (nameById.get(m.big_brother_id) ?? '') : '',
          dnm_reason: m.dnm_reason,
          address_updated_at: m.address_updated_at,
          address_updated_by: m.address_updated_by,
        }))
    },
  },
]

export function getReport(id: string) {
  return REPORTS.find(r => r.id === id)
}

export function toCsv(columns: { key: string; label: string }[], rows: ReportRow[]) {
  const esc = (v: unknown) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const header = columns.map(c => esc(c.label)).join(',')
  const lines = rows.map(r => columns.map(c => esc(r[c.key])).join(','))
  return [header, ...lines].join('\r\n')
}
