import { createAdminClient } from '@/lib/supabase/admin'

export const SITE_CONTENT_DEFAULTS = {
  home_hero_badge: 'Epsilon Nu · Delta Tau Delta · Missouri S&T',
  home_hero_subtitle: 'Supporting brotherhood, housing, and alumni engagement at Missouri University of Science & Technology since 1963.',
  home_mission: 'Ensure the Epsilon Nu chapter of Delta Tau Delta Fraternity is the recognized leader among social fraternities on the Missouri University of Science & Technology campus through the abiding maintenance and upkeep of the Shelter.',
  home_stat_1_number: '500+',
  home_stat_1_label: 'Brothers Initiated',
  home_stat_2_number: '440+',
  home_stat_2_label: 'Living Alumni',
  home_stat_3_number: '60+',
  home_stat_3_label: 'Years of Brotherhood',
  home_stat_4_number: '5×',
  home_stat_4_label: 'Hugh Shields Award',
  about_intro: 'Over 60 years of brotherhood, excellence, and service at Missouri University of Science & Technology.',
  about_founded_number: '1963',
  about_founded_label: 'Founded',
} as const

export type SiteContentKey = keyof typeof SITE_CONTENT_DEFAULTS

export async function getSiteContent(): Promise<Record<SiteContentKey, string>> {
  const admin = createAdminClient()
  const keys = Object.keys(SITE_CONTENT_DEFAULTS) as SiteContentKey[]
  const { data } = await admin.from('site_content').select('key, value').in('key', keys)

  const overrides = new Map((data ?? []).map(r => [r.key, r.value]))
  const result = {} as Record<SiteContentKey, string>
  for (const k of keys) result[k] = overrides.get(k) ?? SITE_CONTENT_DEFAULTS[k]
  return result
}
