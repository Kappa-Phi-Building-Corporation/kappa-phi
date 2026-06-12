import { createAdminClient } from '@/lib/supabase/admin'
import PastEventsToggle from './PastEventsToggle'

export const metadata = { title: 'Alumni Events & Calendar' }

// Cache for 1 hour; revalidated on demand when admin saves an event
export const revalidate = 3600

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

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

function formatDateRange(start: string, end: string | null): string {
  const startDate = new Date(start + 'T12:00:00')
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  if (!end) return fmt(startDate)
  const endDate = new Date(end + 'T12:00:00')
  if (startDate.getFullYear() === endDate.getFullYear()) {
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}–${endDate.getDate()}, ${endDate.getFullYear()}`
    }
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${fmt(endDate)}`
  }
  return `${fmt(startDate)} – ${fmt(endDate)}`
}

type EventRow = {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  link_label: string | null
  link_url: string | null
}

const CalendarIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

function EventDateTime({ event }: { event: EventRow }) {
  const startFmt = formatTime(event.start_time)
  const endFmt = formatTime(event.end_time)
  const isSingleDay = !event.end_date || event.end_date === event.start_date

  if (isSingleDay) {
    // Single day — put date and time on one line
    return (
      <div className="flex items-start gap-2.5 text-sm">
        <span className="text-kp-gold mt-0.5"><CalendarIcon /></span>
        <div>
          <span className="text-white font-semibold">{fmtDate(event.start_date)}</span>
          {startFmt && endFmt && (
            <span className="text-gray-400"> &nbsp;·&nbsp; {startFmt} – {endFmt}</span>
          )}
          {startFmt && !endFmt && (
            <span className="text-gray-400"> &nbsp;·&nbsp; Starting at {startFmt}</span>
          )}
        </div>
      </div>
    )
  }

  // Multi-day with no times — compact range is unambiguous
  if (!startFmt && !endFmt) {
    return (
      <div className="flex items-center gap-2.5 text-sm">
        <span className="text-kp-gold"><CalendarIcon /></span>
        <span className="text-white font-semibold">{formatDateRange(event.start_date, event.end_date)}</span>
      </div>
    )
  }

  // Multi-day with at least one time — label each end explicitly
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="text-kp-gold mt-0.5"><CalendarIcon /></span>
      <div className="space-y-1.5">
        <div className="flex items-baseline gap-2">
          <span className="text-kp-gold text-xs font-bold uppercase tracking-wider w-9 shrink-0">Start</span>
          <span className="text-white font-medium">
            {fmtDate(event.start_date)}{startFmt ? ` at ${startFmt}` : ''}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider w-9 shrink-0">End</span>
          <span className="text-gray-300">
            {fmtDate(event.end_date!)}{endFmt ? ` at ${endFmt}` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default async function EventsPage() {
  const admin = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: upcomingRaw }, { data: pastRaw }] = await Promise.all([
    admin
      .from('events')
      .select('id, title, description, start_date, end_date, start_time, end_time, location, link_label, link_url')
      .eq('is_published', true)
      .gte('start_date', today)
      .order('start_date', { ascending: true }),
    admin
      .from('events')
      .select('id, title, description, start_date, end_date, start_time, end_time, location, link_label, link_url')
      .eq('is_published', true)
      .lt('start_date', today)
      .order('start_date', { ascending: false })
      .limit(50),
  ])

  // Promote any multi-day event still in progress (started before today, ends today or later)
  const inProgress = (pastRaw ?? []).filter(e => e.end_date && e.end_date >= today)
  const trueUpcoming = upcomingRaw ?? []
  const upcoming = [...inProgress, ...trueUpcoming]
  const past = (pastRaw ?? []).filter(e => !e.end_date || e.end_date < today)

  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Hero */}
      <div
        className="border-b border-kp-border relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/bonfire.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-kp-dark/80" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Brotherhood & Events</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Events &amp; Calendar</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Upcoming events for Kappa Phi alumni and the Epsilon Nu Chapter at Missouri S&T.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">

        {/* Upcoming events */}
        {upcoming.length === 0 ? (
          <div className="bg-kp-surface border border-kp-border rounded-2xl px-6 py-10 text-center">
            <div className="text-gray-500 text-sm">No upcoming events scheduled.</div>
            <div className="text-gray-600 text-xs mt-1">Check back soon or follow us on social media for updates.</div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-kp-gold">Upcoming Events</h2>
            {upcoming.map(event => (
              <div
                key={event.id}
                className="bg-kp-surface border border-kp-gold/30 rounded-2xl overflow-hidden"
              >
                {/* Title only in header */}
                <div className="bg-kp-blue/30 border-b border-kp-gold/20 px-6 py-4">
                  <h3 className="text-kp-gold font-black text-lg leading-tight">{event.title}</h3>
                </div>

                <div className="p-6 space-y-4">
                  {/* Date/time — unambiguous */}
                  <EventDateTime event={event} />

                  {event.location && (
                    <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  )}

                  {event.description && (
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  )}

                  {event.link_url && event.link_label && (
                    <div>
                      <a
                        href={event.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-kp-gold text-black font-bold px-5 py-2.5 rounded-lg text-sm no-underline hover:opacity-90 transition-opacity"
                      >
                        {event.link_label}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photo strip */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { src: '/images/stpats-group.jpg', alt: 'St. Pats group' },
            { src: '/images/stpats-friends.jpg', alt: 'St. Pats friends' },
          ].map(img => (
            <div
              key={img.src}
              className="aspect-video rounded-xl bg-kp-card"
              style={{ backgroundImage: `url('${img.src}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              role="img"
              aria-label={img.alt}
            />
          ))}
        </div>

        {/* Past events — collapsed */}
        {past.length > 0 && <PastEventsToggle events={past} />}

        {/* Social */}
        <div className="bg-kp-blue-dark rounded-2xl p-5 flex flex-wrap items-center gap-4">
          <p className="text-blue-100 text-sm flex-1">Stay up to date — follow the chapter on social media</p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/endelts" target="_blank" rel="noopener noreferrer"
              className="bg-kp-gold text-black font-bold px-4 py-2 rounded-lg text-sm no-underline hover:opacity-90">
              Facebook
            </a>
            <a href="https://www.instagram.com/rolladelts/" target="_blank" rel="noopener noreferrer"
              className="border border-white/40 text-white font-bold px-4 py-2 rounded-lg text-sm no-underline hover:border-kp-gold hover:text-kp-gold transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
