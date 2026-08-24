'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { resolveEventRange } from '@/lib/ics'

type Props = {
  eventId: string
  title: string
  description?: string | null
  location?: string | null
  startDate: string
  endDate?: string | null
  startTime?: string | null
  endTime?: string | null
}

const MENU_WIDTH = 224

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}

function compact(dateStr: string) {
  return dateStr.replace(/-/g, '')
}

function googleCalendarUrl(props: Props): string {
  const range = resolveEventRange(props)
  const dates = range.hasTime
    ? `${compact(range.startDate)}T${range.startTime.replace(':', '')}00/${compact(range.endDate)}T${range.endTime.replace(':', '')}00`
    : `${compact(range.startDate)}/${compact(addDays(range.endDate, 1))}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: props.title,
    dates,
  })
  if (range.hasTime) params.set('ctz', 'America/Chicago')
  if (props.description) params.set('details', props.description)
  if (props.location) params.set('location', props.location)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function outlookUrl(props: Props): string {
  const range = resolveEventRange(props)
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: props.title,
  })
  if (range.hasTime) {
    params.set('startdt', `${range.startDate}T${range.startTime}:00`)
    params.set('enddt', `${range.endDate}T${range.endTime}:00`)
  } else {
    params.set('startdt', range.startDate)
    params.set('enddt', addDays(range.endDate, 1))
    params.set('allday', 'true')
  }
  if (props.description) params.set('body', props.description)
  if (props.location) params.set('location', props.location)

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

export default function AddToCalendarButton(props: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  function toggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const left = Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8)
      setPos({ top: rect.bottom + 8, left: Math.max(8, left) })
    }
    setOpen(v => !v)
  }

  // Positioning is computed once on open (viewport-relative via `fixed`),
  // so close the menu on scroll rather than letting it drift out of place.
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    return () => window.removeEventListener('scroll', close, true)
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Add to Calendar
      </button>

      {open && pos && createPortal(
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            className="fixed z-50 bg-kp-surface border border-kp-border rounded-xl shadow-xl shadow-black/40 overflow-hidden"
            style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
          >
            <a
              href={googleCalendarUrl(props)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-kp-card hover:text-kp-gold no-underline transition-colors"
            >
              Google Calendar
            </a>
            <a
              href={outlookUrl(props)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-kp-card hover:text-kp-gold no-underline transition-colors"
            >
              Outlook.com
            </a>
            <a
              href={`/events/${props.eventId}/ics`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-kp-card hover:text-kp-gold no-underline transition-colors border-t border-kp-border"
            >
              Apple Calendar / Outlook desktop (.ics)
            </a>
          </div>
        </>,
        document.body,
      )}
    </>
  )
}
