'use client'

// Server components render in the server's timezone, but an admin reading
// a log wants times in their own local time — so this piece renders on
// the client. The client-rendered value legitimately differs from the
// server-rendered placeholder, which is exactly what suppressing the
// hydration warning here is for.

export function LocalTime({ iso }: { iso: string }) {
  return (
    <span suppressHydrationWarning>
      {new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
    </span>
  )
}

export function LocalDateTime({ iso }: { iso: string }) {
  return (
    <span suppressHydrationWarning>
      {new Date(iso).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
      })}
    </span>
  )
}
