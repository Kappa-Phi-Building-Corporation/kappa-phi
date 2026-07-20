import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export const metadata = { title: 'Chapter Eternal Memorial' }

// Revalidate hourly; admin saves trigger on-demand revalidation
export const revalidate = 3600

function fmtDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function fmtDateLong(d: string | null) {
  if (!d) return null
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default async function ChapterEternalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/alumni/chapter-eternal')

  const admin = createAdminClient()

  const { data: members } = await admin
    .from('members')
    .select('id, first_name, last_name, title, badge_number, pledge_class, initiation_date, passing_date, photo_url, memorial_link_url, updated_at')
    .eq('is_deceased', true)
    .eq('memorial_hide_entry', false)
    .not('passing_date', 'is', null)

  const rows = (members ?? []).sort((a, b) => {
    const na = parseInt(a.badge_number ?? '', 10)
    const nb = parseInt(b.badge_number ?? '', 10)
    if (isNaN(na) && isNaN(nb)) return 0
    if (isNaN(na)) return 1
    if (isNaN(nb)) return -1
    return na - nb
  })

  // Last updated = most recent updated_at across all entries
  const lastUpdated = rows.reduce((latest, m) => {
    return m.updated_at > latest ? m.updated_at : latest
  }, '')

  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })
    : null

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Alumni</div>
          <h1 className="text-4xl font-black text-white mb-2">Chapter Eternal Memorial</h1>
          <p className="text-gray-300 text-sm max-w-2xl">
            In loving memory of the brothers of Epsilon Nu Chapter of Delta Tau Delta who have passed to Chapter Eternal.
          </p>
          {lastUpdatedLabel && (
            <p className="text-gray-600 text-xs mt-3">Last update {lastUpdatedLabel}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {rows.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No entries yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {rows.map(m => {
              const name = [m.title === 'Mr.' ? null : m.title, m.first_name, m.last_name].filter(Boolean).join(' ')
              return (
                <div
                  key={m.id}
                  className="bg-kp-surface border border-kp-border rounded-xl overflow-hidden flex flex-col"
                >
                  {/* Photo */}
                  <div className="aspect-[3/4] bg-kp-card relative overflow-hidden">
                    {m.photo_url ? (
                      <img
                        src={m.photo_url}
                        alt={name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="px-3 py-3 text-center space-y-0.5 flex-1 flex flex-col items-center justify-start">
                    {/* Name — linked if memorial URL provided */}
                    {m.memorial_link_url ? (
                      <a
                        href={m.memorial_link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm font-bold leading-tight hover:underline"
                      >
                        {name}
                      </a>
                    ) : (
                      <div className="text-white text-sm font-bold leading-tight">{name}</div>
                    )}

                    {/* Pledge class + badge */}
                    {(m.pledge_class || m.badge_number) && (
                      <div className="text-amber-400 text-xs">
                        {[m.pledge_class, m.badge_number ? `Badge ${m.badge_number}` : null]
                          .filter(Boolean).join(' - ')}
                      </div>
                    )}

                    {/* Initiation date */}
                    {m.initiation_date && (
                      <div className="text-amber-400 text-xs">
                        Initiated - {fmtDateLong(m.initiation_date)}
                      </div>
                    )}

                    {/* Chapter Eternal date */}
                    {m.passing_date && (
                      <div className="text-amber-400 text-xs">
                        Chapter Eternal - {fmtDateLong(m.passing_date)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-kp-border">
          <Link href="/alumni" className="text-gray-500 text-sm hover:text-kp-gold transition-colors no-underline">
            ← Back to Alumni
          </Link>
        </div>
      </div>
    </div>
  )
}
