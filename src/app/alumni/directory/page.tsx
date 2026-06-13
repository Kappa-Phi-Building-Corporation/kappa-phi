import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { geocodeFallback } from '@/lib/geocode'
import AlumniDirectory from './AlumniDirectory'

export const metadata = { title: 'Alumni Directory' }

export default async function AlumniDirectoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: currentProfile } = await admin
    .from('profiles')
    .select('is_approved, role')
    .eq('id', user.id)
    .single()

  if (!currentProfile?.is_approved) redirect('/auth/pending')

  const isAdmin = currentProfile.role === 'admin'

  let query = admin
    .from('members')
    .select(`
      id, first_name, last_name, title, nickname,
      badge_number, pledge_class, big_brother_id, graduation_year,
      home_phone, mobile_phone, phone, alternate_phone, work_phone,
      email, alternate_email,
      address_street, address_city, address_state, address_zip,
      employer, occupation,
      member_kpbc, member_advisory, past_member_advisory,
      is_deceased, is_missing, hide_entry, updated_at,
      lat, lng
    `)
    .not('first_name', 'is', null)
    .not('badge_number', 'is', null)
    .neq('member_status', 'expelled_other')

  // Non-admins never see hidden members
  if (!isAdmin) {
    query = query.or('hide_entry.is.null,hide_entry.eq.false')
  }

  const { data: raw } = await query

  // Use DB-stored coordinates (precise, geocoded when address was last saved).
  // Fall back to local zip/city lookup for members not yet geocoded.
  const members = (raw ?? []).map(m => {
    if (m.lat != null && m.lng != null) return m
    const fallback = geocodeFallback(m)
    return { ...m, lat: fallback?.lat ?? null, lng: fallback?.lng ?? null }
  })

  const count = members.length

  return (
    <div className="bg-kp-dark flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-kp-crimson-dark border-b border-kp-border shrink-0">
        <div className="max-w-full px-6 py-5 flex items-end gap-6">
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Members Only</div>
            <h1 className="text-2xl font-black text-white">Alumni Directory</h1>
          </div>
          <p className="text-gray-500 text-sm pb-0.5">{count} member{count !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Directory — fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <AlumniDirectory members={members ?? []} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
