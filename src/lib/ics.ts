// Builds a standards-compliant (RFC 5545) .ics file for a single event.
// Times are expressed with TZID=America/Chicago (Rolla, MO) rather than
// floating or UTC — every major client (Google/Outlook/Apple) has the IANA
// timezone database built in and resolves a bare TZID correctly without
// needing an embedded VTIMEZONE block.

const TZID = 'America/Chicago'
const DEFAULT_DURATION_HOURS = 2

export type IcsEventInput = {
  id: string
  title: string
  description?: string | null
  location?: string | null
  startDate: string // YYYY-MM-DD
  endDate?: string | null // YYYY-MM-DD
  startTime?: string | null // HH:MM
  endTime?: string | null // HH:MM
  url?: string | null
}

// Strips the common Markdown syntax used in event descriptions down to
// plain text — calendar apps don't render Markdown, so **bold**/# headings/
// etc. would otherwise show up as literal asterisks and hashes.
function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/<u>(.+?)<\/u>/gi, '$1')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
    .trim()
}

// Escapes TEXT-type field values per RFC 5545 §3.3.11.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// Folds lines longer than 75 octets with a leading space on continuations,
// as RFC 5545 §3.1 requires.
function foldLine(line: string): string {
  const bytes = Buffer.byteLength(line, 'utf8')
  if (bytes <= 75) return line

  const out: string[] = []
  let rest = line
  let first = true
  while (Buffer.byteLength(rest, 'utf8') > (first ? 75 : 74)) {
    let cut = first ? 75 : 74
    // Back off until we're not splitting a multi-byte UTF-8 character.
    while (Buffer.byteLength(rest.slice(0, cut), 'utf8') > (first ? 75 : 74)) cut--
    out.push((first ? '' : ' ') + rest.slice(0, cut))
    rest = rest.slice(cut)
    first = false
  }
  out.push(' ' + rest)
  return out.join('\r\n')
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function dateOnlyStamp(dateStr: string): string {
  return dateStr.replace(/-/g, '')
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}

function addHoursToTime(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = (h * 60 + m + hours * 60) % (24 * 60)
  return `${pad2(Math.floor(total / 60))}:${pad2(total % 60)}`
}

// start_time/end_time come from a plain text column, not a validated
// time type — some existing rows hold free text like "2pm–3pm CST"
// typed directly rather than "14:00". Only trust values that actually
// match HH:MM; anything else is treated the same as no time set.
const STRICT_TIME = /^([01]?\d|2[0-3]):([0-5]\d)$/

function normalizeTime(t: string | null | undefined): string | null {
  if (!t) return null
  const m = t.match(STRICT_TIME)
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null
}

// Resolves start/end date+time with the same defaulting rules (missing
// end date falls back to start date; missing end time gets a 2-hour
// default duration) so the .ics file and the Google/Outlook web links
// always agree on when the event actually is.
export function resolveEventRange(event: Pick<IcsEventInput, 'startDate' | 'endDate' | 'startTime' | 'endTime'>) {
  const startTime = normalizeTime(event.startTime)
  if (startTime) {
    return {
      hasTime: true as const,
      startDate: event.startDate,
      startTime,
      endDate: event.endDate || event.startDate,
      endTime: normalizeTime(event.endTime) || addHoursToTime(startTime, DEFAULT_DURATION_HOURS),
    }
  }
  return {
    hasTime: false as const,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
  }
}

export function buildIcs(event: IcsEventInput): string {
  const range = resolveEventRange(event)
  const now = new Date()
  const dtstamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`

  let dtstart: string
  let dtend: string

  if (range.hasTime) {
    const startTime = range.startTime.replace(':', '') + '00'
    const endTime = range.endTime.replace(':', '') + '00'
    dtstart = `DTSTART;TZID=${TZID}:${dateOnlyStamp(range.startDate)}T${startTime}`
    dtend = `DTEND;TZID=${TZID}:${dateOnlyStamp(range.endDate)}T${endTime}`
  } else {
    // All-day event(s) — DTEND is exclusive, so it's the day *after* the last day.
    dtstart = `DTSTART;VALUE=DATE:${dateOnlyStamp(range.startDate)}`
    dtend = `DTEND;VALUE=DATE:${dateOnlyStamp(addDays(range.endDate, 1))}`
  }

  const descriptionParts = [
    event.description ? stripMarkdown(event.description) : null,
    event.url ? `More info: ${event.url}` : null,
  ].filter(Boolean)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kappa Phi Building Corporation//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@kappa-phi.org`,
    `DTSTAMP:${dtstamp}`,
    dtstart,
    dtend,
    `SUMMARY:${escapeText(event.title)}`,
    ...(descriptionParts.length ? [`DESCRIPTION:${escapeText(descriptionParts.join('\n\n'))}`] : []),
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.map(foldLine).join('\r\n') + '\r\n'
}
