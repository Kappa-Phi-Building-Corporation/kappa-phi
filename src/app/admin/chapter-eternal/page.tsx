import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { showEternalEntry, hideEternalEntry } from './actions'
import VisibilityButton from './VisibilityButton'

export const metadata = { title: 'Chapter Eternal Memorial' }

function fmtDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function sortByBadge<T extends { badge_number: string | null }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => {
    const na = parseInt(a.badge_number ?? '', 10)
    const nb = parseInt(b.badge_number ?? '', 10)
    if (isNaN(na) && isNaN(nb)) return 0
    if (isNaN(na)) return 1
    if (isNaN(nb)) return -1
    return na - nb
  })
}

export default async function AdminChapterEternalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')

  const [{ data: entryRows }, { data: pendingRows }] = await Promise.all([
    admin
      .from('members')
      .select('id, first_name, last_name, title, badge_number, pledge_class, passing_date, photo_url, hide_entry')
      .eq('is_deceased', true)
      .not('passing_date', 'is', null),
    admin
      .from('members')
      .select('id, first_name, last_name, title, badge_number, pledge_class')
      .eq('is_deceased', true)
      .is('passing_date', null),
  ])

  const entries = sortByBadge(entryRows ?? [])
  const pending = sortByBadge(pendingRows ?? [])

  const { error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-5xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              ← Admin Dashboard
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Chapter Eternal Memorial</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'}
              {pending.length > 0 && (
                <span className="text-amber-400 ml-2">· {pending.length} pending</span>
              )}
            </p>
          </div>
          <Link
            href="/admin/chapter-eternal/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + Add Entry
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Pending — deceased members without a chapter eternal entry yet */}
        {pending.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-amber-400 text-xs font-bold uppercase tracking-widest">Pending</div>
              <span className="text-gray-600 text-xs">Marked deceased — no chapter eternal entry yet</span>
            </div>
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl overflow-hidden">
              <div className="divide-y divide-kp-border">
                {pending.map(m => (
                  <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold">
                        {[m.title, m.first_name, m.last_name].filter(Boolean).join(' ')}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {[m.pledge_class, m.badge_number ? `Badge ${m.badge_number}` : null]
                          .filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <Link
                      href={`/admin/chapter-eternal/new?member_id=${m.id}`}
                      className="shrink-0 px-3 py-1.5 text-xs rounded-lg bg-amber-500/20 border border-amber-600/40 text-amber-400 hover:bg-amber-500/30 transition-colors no-underline">
                      Create Entry →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Memorial entries */}
        <div>
          {pending.length > 0 && (
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Memorial Entries</div>
          )}
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            {entries.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No entries yet. Add the first member.
              </div>
            ) : (
              <div className="divide-y divide-kp-border">
                {entries.map(m => {
                  const showThis = showEternalEntry.bind(null, m.id)
                  const hideThis = hideEternalEntry.bind(null, m.id)
                  return (
                    <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-kp-card shrink-0">
                        {m.photo_url
                          ? <img src={m.photo_url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold">
                          {[m.title, m.first_name, m.last_name].filter(Boolean).join(' ')}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {[m.pledge_class, m.badge_number ? `Badge ${m.badge_number}` : null]
                            .filter(Boolean).join(' · ')}
                          {m.passing_date && ` · Eternal ${fmtDate(m.passing_date)}`}
                        </div>
                      </div>
                      <VisibilityButton isHidden={!!m.hide_entry} showAction={showThis} hideAction={hideThis} />
                      <Link
                        href={`/admin/chapter-eternal/${m.id}`}
                        className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                        Edit
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
