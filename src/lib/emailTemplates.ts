import { createAdminClient } from '@/lib/supabase/admin'

export type EmailTemplateKey = 'admin_new_user' | 'user_approved'

export const EMAIL_TEMPLATE_DEFAULTS: Record<EmailTemplateKey, {
  label: string
  description: string
  variables: string[]
  subject: string
  body_html: string
}> = {
  admin_new_user: {
    label: 'New Member Registration',
    description: 'Sent to the admin email when a new member registers and needs approval.',
    variables: ['name', 'email', 'admin_url'],
    subject: 'New Member Registration: {{name}}',
    body_html:
`<h2 style="margin-top:0">New Member Registration — Action Required</h2>
<p><strong>{{name}}</strong> ({{email}}) has verified their email address and is waiting for account approval.</p>
<p>Please visit the admin panel to review and approve or deny their access:</p>
<a href="{{admin_url}}" style="display:inline-block;background:#c9a227;color:#000;font-weight:700;padding:12px 28px;border-radius:6px;text-decoration:none;margin-top:8px">Review in Admin Panel →</a>`,
  },
  user_approved: {
    label: 'Account Approved',
    description: 'Sent to a member when their account is approved.',
    variables: ['name', 'login_url'],
    subject: 'Your Kappa Phi Portal Account Has Been Approved',
    body_html:
`<h2 style="margin-top:0">Your Account Has Been Approved</h2>
<p>Hi {{name}},</p>
<p>Your Kappa Phi Building Corporation portal account has been approved. You can now log in to access the Alumni Directory, Big Brother Tree, and other member resources.</p>
<a href="{{login_url}}" style="display:inline-block;background:#c9a227;color:#000;font-weight:700;padding:12px 28px;border-radius:6px;text-decoration:none;margin-top:8px">Log In →</a>`,
  },
}

export async function getEmailTemplate(key: EmailTemplateKey) {
  const admin = createAdminClient()
  const { data } = await admin.from('email_templates').select('subject, body_html').eq('key', key).single()
  return {
    subject: data?.subject ?? EMAIL_TEMPLATE_DEFAULTS[key].subject,
    body_html: data?.body_html ?? EMAIL_TEMPLATE_DEFAULTS[key].body_html,
  }
}

export function renderTemplate(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}
