'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'

// No real external store to subscribe to — this only needs a one-time,
// SSR-safe read of localStorage. useSyncExternalStore's getServerSnapshot
// lets the server (and the client's first hydration pass) render "hidden"
// while the client can correctly show it right after, with no mismatch.
function subscribe() {
  return () => {}
}

export default function AnnouncementBanner({
  enabled,
  message,
  expires,
}: {
  enabled: boolean
  message: string
  expires: string
}) {
  const dismissKey = `kp_announcement_dismissed::${expires}::${message}`

  const eligible = useSyncExternalStore(
    subscribe,
    () => {
      if (!enabled || !message.trim()) return false
      if (expires && new Date(`${expires}T23:59:59`) < new Date()) return false
      try {
        return localStorage.getItem(dismissKey) !== '1'
      } catch {
        return true
      }
    },
    () => false,
  )

  const [dismissed, setDismissed] = useState(false)

  function dismiss() {
    try {
      localStorage.setItem(dismissKey, '1')
    } catch {
      // ignore — worst case it reappears next visit
    }
    setDismissed(true)
  }

  if (!eligible || dismissed) return null

  return (
    <div className="bg-kp-gold text-black">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
        <span className="flex-1 font-medium">
          {message}{' '}
          <Link href="/register" className="text-black font-bold underline underline-offset-2 hover:opacity-70">
            Register now →
          </Link>
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 p-1 hover:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
