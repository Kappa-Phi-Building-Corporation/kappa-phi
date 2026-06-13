import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { MEMBER_STATUS_LABELS } from '@/lib/memberStatus'

export const metadata = { title: 'Member Records' }

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin
    .from('profiles').select('role').eq('id', user.id).single()
  if (currentProfile?.role !== 'admin') redirect('/portal')

  const { q } = await searchParams

  let query = admin
    .from('members')
    .select('id, first_name, last_name, badge_number, pledge_class, email, is_deceased, is_missing, hide_entry, member_status')

  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,badge_number.ilike.%${q}%,email.ilike.%${q}%`
    )
  }

  const { data: members } = await query.limit(500)

  // Sort numerically — badge_number is TEXT so lexicographic DB sort is wrong
  const rows = (members ?? []).sort((a, b) => {
    const na = parseInt(a.badge_number ?? '', 10)
    const nb = parseInt(b.badge_number ?? '', 10)
    if (isNaN(na) && isNaN(nb)) return 0
    if (isNaN(na)) return 1
    if (isNaN(nb)) return -1
    return na - nb
  })

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-6xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Member Records</h1>
            <p className="text-gray-400 mt-2 text-sm">
              {rows.length} record{rows.length !== 1 ? 's' : ''} ·{' '}
              <Link href="/admin/users" className="text-kp-gold hover:underline">Manage user accounts →</Link>
            </p>
          </div>
          <Link
            href="/admin/members/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + New Member
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Search */}
        <form method="GET" className="flex gap-3">
          <input
            name="q"
            type="search"
            defaultValue={q ?? ''}
            placeholder="Search name, badge, email…"
            className="flex-1 bg-kp-surface border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue"
          />
          <button type="submit"
            className="px-5 py-2.5 bg-kp-blue rounded-xl text-sm text-white font-medium hover:bg-kp-blue-light transition-colors">
            Search
          </button>
          {q && (
            <Link href="/admin/members"
              className="px-5 py-2.5 border border-kp-border rounded-xl text-sm text-gray-400 hover:text-white transition-colors no-underline">
              Clear
            </Link>
          )}
        </form>

        {/* Table */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-kp-border">
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden sm:table-cell">Badge</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">Pledge Class</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500 italic">
                      {q ? 'No members match your search.' : 'No member records yet.'}
                    </td>
                  </tr>
                )}
                {rows.map(m => (
                  <tr key={m.id} className="border-b border-kp-border hover:bg-kp-card/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-white">
                        {m.first_name ?? '—'} {m.last_name ?? ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {m.badge_number ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {m.pledge_class ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {m.email ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const status = m.member_status ?? 'alumni'
                          const cls = status === 'expelled_other'
                            ? 'bg-red-900/40 text-red-400'
                            : status === 'active_ug'
                              ? 'bg-green-900/40 text-green-400'
                              : 'bg-blue-900/40 text-blue-400'
                          return (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>
                              {MEMBER_STATUS_LABELS[status] ?? status}
                            </span>
                          )
                        })()}
                        {m.is_deceased && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400">Deceased</span>
                        )}
                        {m.is_missing && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-900/60 text-yellow-400">Missing</span>
                        )}
                        {m.hide_entry && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-300">Hidden</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/members/${m.id}`}
                        className="px-3 py-1 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
