import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Chapter Eternal Memorial' }

function fmtDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
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

  const { data: members } = await admin
    .from('members')
    .select('id, first_name, last_name, title, badge_number, pledge_class, passing_date, photo_url')
    .eq('is_deceased', true)

  const rows = (members ?? []).sort((a, b) => {
    const na = parseInt(a.badge_number ?? '', 10)
    const nb = parseInt(b.badge_number ?? '', 10)
    if (isNaN(na) && isNaN(nb)) return 0
    if (isNaN(na)) return 1
    if (isNaN(nb)) return -1
    return na - nb
  })
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
            <p className="text-gray-400 mt-1 text-sm">{rows.length} entr{rows.length !== 1 ? 'ies' : 'y'}</p>
          </div>
          <Link
            href="/admin/chapter-eternal/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + Add Entry
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          {rows.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No entries yet. Add the first member.
            </div>
          ) : (
            <div className="divide-y divide-kp-border">
              {rows.map(m => (
                <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                  {/* Thumbnail */}
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
                      {m.pledge_class && `${m.pledge_class} · `}
                      {m.badge_number && `Badge ${m.badge_number}`}
                      {m.passing_date && ` · Eternal ${fmtDate(m.passing_date)}`}
                    </div>
                  </div>
                  <Link
                    href={`/admin/chapter-eternal/${m.id}`}
                    className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
