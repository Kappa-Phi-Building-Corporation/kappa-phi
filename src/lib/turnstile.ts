// Cloudflare Turnstile server-side verification.
// If TURNSTILE_SECRET_KEY isn't set, verification is skipped (matches the
// client-side widget, which hides itself when NEXT_PUBLIC_TURNSTILE_SITE_KEY
// is blank) so CAPTCHA stays fully optional until both keys are configured.
export async function verifyTurnstile(token: string, ip: string | null) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not set — skipping verification')
    return true
  }
  if (!token) return false

  const body = new URLSearchParams({ secret: secretKey, response: token })
  if (ip) body.append('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = await res.json()
  return data.success === true
}
