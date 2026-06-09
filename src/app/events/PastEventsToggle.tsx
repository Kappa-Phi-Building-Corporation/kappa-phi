'use client'

import { useState } from 'react'

type Event = {
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
  if (s && e) return `${s} – ${e}`
  return s ?? e ?? null
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

function PastEventRow({ event }: { event: Event }) {
  const [expanded, setExpanded] = useState(false)
  const timeRange = formatTimeRange(event.start_time, event.end_time)
  const hasDetails = event.description || timeRange || event.link_url

  return (
    <div className="bg-kp-surface/50 divide-y divide-kp-border/50">
      <button
        onClick={() => setExpanded(v => !v)}
        className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-colors ${
          hasDetails ? 'hover:bg-kp-card/40 cursor-pointer' : 'cursor-default'
        }`}
        disabled={!hasDetails}
      >
        <div className="sm:w-44 shrink-0">
          <div className="text-gray-500 text-xs font-medium">
            {formatDateRange(event.start_date, event.end_date)}
          </div>
          {timeRange && !expanded && (
            <div className="text-gray-600 text-xs mt-0.5">{timeRange}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-300 text-sm font-medium">{event.title}</div>
          {event.location && (
            <div className="text-gray-500 text-xs mt-0.5">{event.location}</div>
          )}
        </div>
        {hasDetails && (
          <svg
            className={`w-4 h-4 text-gray-600 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {expanded && hasDetails && (
        <div className="px-6 py-4 bg-kp-card/20 space-y-3">
          {/* Date/time — use same unambiguous logic as upcoming cards */}
          {(() => {
            const isSingleDay = !event.end_date || event.end_date === event.start_date
            const startFmt = formatTime(event.start_time)
            const endFmt = formatTime(event.end_time)
            if (!startFmt && !endFmt) return null
            if (isSingleDay) {
              return (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {startFmt && endFmt ? `${startFmt} – ${endFmt}` : startFmt ?? endFmt}
                </div>
              )
            }
            return (
              <div className="space-y-1 text-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider w-9 shrink-0">Start</span>
                  <span className="text-gray-300">{formatDateRange(event.start_date, null)}{startFmt ? ` at ${startFmt}` : ''}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider w-9 shrink-0">End</span>
                  <span className="text-gray-300">{formatDateRange(event.end_date!, null)}{endFmt ? ` at ${endFmt}` : ''}</span>
                </div>
              </div>
            )
          })()}
          {event.description && (
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          )}
          {event.link_url && event.link_label && (
            <a
              href={event.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold font-medium px-4 py-2 rounded-lg text-sm no-underline transition-colors"
            >
              {event.link_label} ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function PastEventsToggle({ events }: { events: Event[] }) {
  const [open, setOpen] = useState(false)

  if (events.length === 0) return null

  return (
    <div className="border border-kp-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-kp-surface hover:bg-kp-card transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-400 text-sm font-medium">
            Past Events ({events.length})
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="divide-y divide-kp-border">
          {events.map(event => (
            <PastEventRow key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
