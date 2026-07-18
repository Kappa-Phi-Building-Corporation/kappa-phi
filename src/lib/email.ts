// Email utility — uses Resend (https://resend.com) via plain fetch.
// Required env vars:
//   RESEND_API_KEY   — your Resend API key
//   EMAIL_FROM       — verified sending address, e.g. noreply@kappa-phi.org
//   ADMIN_EMAIL      — where admin notifications are sent (default: kappaphi@kappa-phi.org)

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'kappaphi@kappa-phi.org'
const FROM = process.env.EMAIL_FROM ?? 'Kappa Phi BC <noreply@kappa-phi.org>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kappa-phi.org'

export async function sendAdminNewUserEmail(userName: string, userEmail: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping admin notification')
    return
  }

  const adminUrl = `${SITE_URL}/admin/users`

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
      <div style="background:#1a3a6b;padding:24px 32px;border-radius:8px 8px 0 0">
        <span style="color:#c9a227;font-weight:900;font-size:22px">ΔΤΔ Kappa Phi BC</span>
      </div>
      <div style="background:#f9f9f9;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
        <h2 style="margin-top:0">New Member Registration — Action Required</h2>
        <p><strong>${userName}</strong> (${userEmail}) has verified their email address and is waiting for account approval.</p>
        <p>Please visit the admin panel to review and approve or deny their access:</p>
        <a href="${adminUrl}" style="display:inline-block;background:#c9a227;color:#000;font-weight:700;padding:12px 28px;border-radius:6px;text-decoration:none;margin-top:8px">
          Review in Admin Panel →
        </a>
        <p style="margin-top:32px;font-size:13px;color:#666">
          Kappa Phi Building Corporation · Epsilon Nu Chapter · Missouri S&amp;T
        </p>
      </div>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `New Member Registration: ${userName}`,
      html,
    }),
  })

  if (!res.ok) {
    console.error('[email] Failed to send admin notification:', await res.text())
  }
}

export async function sendUserApprovedEmail(userName: string, userEmail: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping approval notification')
    return
  }

  const loginUrl = `${SITE_URL}/login`

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
      <div style="background:#1a3a6b;padding:24px 32px;border-radius:8px 8px 0 0">
        <span style="color:#c9a227;font-weight:900;font-size:22px">ΔΤΔ Kappa Phi BC</span>
      </div>
      <div style="background:#f9f9f9;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
        <h2 style="margin-top:0">Your Account Has Been Approved</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>Your Kappa Phi Building Corporation portal account has been approved. You can now log in to access the Alumni Directory, Big Brother Tree, and other member resources.</p>
        <a href="${loginUrl}" style="display:inline-block;background:#c9a227;color:#000;font-weight:700;padding:12px 28px;border-radius:6px;text-decoration:none;margin-top:8px">
          Log In →
        </a>
        <p style="margin-top:32px;font-size:13px;color:#666">
          Kappa Phi Building Corporation · Epsilon Nu Chapter · Missouri S&amp;T
        </p>
      </div>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [userEmail],
      subject: 'Your Kappa Phi Portal Account Has Been Approved',
      html,
    }),
  })

  if (!res.ok) {
    console.error('[email] Failed to send approval notification:', await res.text())
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendPropertyIssueEmail(report: {
  name: string
  email: string
  phone: string
  message: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping property issue notification')
    return false
  }

  const to = process.env.PROPERTY_ISSUE_EMAIL || ADMIN_EMAIL

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
      <div style="background:#1a3a6b;padding:24px 32px;border-radius:8px 8px 0 0">
        <span style="color:#c9a227;font-weight:900;font-size:22px">ΔΤΔ Kappa Phi BC</span>
      </div>
      <div style="background:#f9f9f9;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
        <h2 style="margin-top:0">Property Issue Reported</h2>
        <p><strong>Name:</strong> ${escapeHtml(report.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(report.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(report.phone)}</p>
        <p><strong>Description:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(report.message)}</p>
        <p style="margin-top:32px;font-size:13px;color:#666">
          Kappa Phi Building Corporation · Epsilon Nu Chapter · Missouri S&amp;T
        </p>
      </div>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: report.email,
      subject: `Property Issue Report: ${report.name}`,
      html,
    }),
  })

  if (!res.ok) {
    console.error('[email] Failed to send property issue notification:', await res.text())
    return false
  }
  return true
}
