'use client'

import { useActionState } from 'react'
import Script from 'next/script'
import { submitPropertyIssue } from './actions'
import type { PropertyIssueState } from './actions'

const inputClass = 'w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors'
const labelClass = 'block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2'

export default function PropertyIssueForm() {
  const [state, formAction, pending] = useActionState<PropertyIssueState, FormData>(submitPropertyIssue, null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  return (
    <form action={formAction} className="space-y-5">
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}

      {state?.type === 'error' && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
          {state.message}
        </div>
      )}
      {state?.type === 'success' && (
        <div className="bg-kp-blue/30 border border-kp-blue text-blue-200 px-4 py-3 rounded-xl text-sm">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Your Name</label>
          <input type="text" name="name" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input type="email" name="email" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Callback Phone</label>
          <input type="tel" name="phone" required className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Description of Issue</label>
        <textarea
          name="message"
          rows={4}
          required
          className={inputClass}
          placeholder="Please describe the issue in detail..."
        />
      </div>

      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} />}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="bg-kp-gold text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
        >
          {pending ? 'Submitting…' : 'Submit Report'}
        </button>
        <p className="text-gray-500 text-xs">
          For urgent issues, contact the VP of Property Management or President directly.
        </p>
      </div>
    </form>
  )
}
