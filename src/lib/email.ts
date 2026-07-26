// Email utility — uses Resend (https://resend.com) via plain fetch.
// Required env vars:
//   RESEND_API_KEY   — your Resend API key
//   EMAIL_FROM       — verified sending address, e.g. noreply@kappa-phi.org
//   ADMIN_EMAIL      — where admin notifications are sent (default: kappaphi@kappa-phi.org)

import { getEmailTemplate, renderTemplate } from '@/lib/emailTemplates'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'kappaphi@kappa-phi.org'
const FROM = process.env.EMAIL_FROM ?? 'Kappa Phi BC <noreply@kappa-phi.org>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kappa-phi.org'

function wrapEmailHtml(inner: string) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
      <div style="background:#1a3a6b;padding:24px 32px;border-radius:8px 8px 0 0">
        <span style="color:#c9a227;font-weight:900;font-size:22px">ΔΤΔ Kappa Phi BC</span>
      </div>
      <div style="background:#f9f9f9;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
        ${inner}
        <p style="margin-top:32px;font-size:13px;color:#666">
          Kappa Phi Building Corporation · Epsilon Nu Chapter · Missouri S&amp;T
        </p>
      </div>
    </div>
  `
}

export async function sendAdminNewUserEmail(userName: string, userEmail: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping admin notification')
    return
  }

  const vars = { name: userName, email: userEmail, admin_url: `${SITE_URL}/admin/users` }
  const template = await getEmailTemplate('admin_new_user')
  const subject = renderTemplate(template.subject, vars)
  const html = wrapEmailHtml(renderTemplate(template.body_html, vars))

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [ADMIN_EMAIL],
      subject,
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

  const vars = { name: userName || 'there', login_url: `${SITE_URL}/login` }
  const template = await getEmailTemplate('user_approved')
  const subject = renderTemplate(template.subject, vars)
  const html = wrapEmailHtml(renderTemplate(template.body_html, vars))

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [userEmail],
      subject,
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

  const html = wrapEmailHtml(`
        <h2 style="margin-top:0">Property Issue Reported</h2>
        <p><strong>Name:</strong> ${escapeHtml(report.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(report.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(report.phone)}</p>
        <p><strong>Description:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(report.message)}</p>
  `)

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
