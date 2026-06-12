import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Manage Events' }

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function formatTime(t: string | null): string | null {
  if (!t) return null
  const match = t.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return t
  const h = parseInt(match[1])
  const m = match[2]
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return m === '00' ? `${h12} ${period}` : `${h12}:${m} ${period}`
}

function formatTimeRange(start: string | null, end: string | null): string | null {
  const s = formatTime(start)
  const e = formatTime(end)
  if (s && e) return `${s} â€“ ${e}`
  return s ?? e ?? null
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (currentProfile?.role !== 'admin' && currentProfile?.role !== 'website_admin') redirect('/portal')

  const today = new Date().toISOString().split('T')[0]

  const { data: events } = await admin
    .from('events')
    .select('id, title, start_date, end_date, start_time, end_time, location, is_published')
    .order('start_date', { ascending: false })

  const rows = events ?? []
  const upcoming = rows.filter(e => e.start_date >= today)
  const past = rows.filter(e => e.start_date < today)

  const { error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-5xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              â† Admin Dashboard
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Events</h1>
            <p className="text-gray-400 mt-1 text-sm">{rows.length} total event{rows.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/admin/events/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + New Event
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {[
          { label: 'Upcoming', items: upcoming.reverse() },
          { label: 'Past', items: past },
        ].map(({ label, items }) => items.length > 0 && (
          <div key={label}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{label}</h2>
            <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden divide-y divide-kp-border">
              {items.map(event => (
                <div key={event.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-semibold truncate">{event.title}</span>
                      {!event.is_published && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700 shrink-0">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {formatDate(event.start_date)}
                      {event.end_date && event.end_date !== event.start_date && ` â€“ ${formatDate(event.end_date)}`}
                      {formatTimeRange(event.start_time, event.end_time) && ` Â· ${formatTimeRange(event.start_time, event.end_time)}`}
                      {event.location && ` Â· ${event.location}`}
                    </div>
                  </div>
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="bg-kp-surface border border-kp-border rounded-2xl px-6 py-12 text-center text-gray-500">
            No events yet. Create the first one.
          </div>
        )}
      </div>
    </div>
  )
}
