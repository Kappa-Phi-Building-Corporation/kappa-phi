'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'
import { EMAIL_TEMPLATE_DEFAULTS, type EmailTemplateKey } from '@/lib/emailTemplates'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')
  return admin
}

export async function updateEmailTemplates(formData: FormData) {
  const admin = await requireAdmin()

  const keys = Object.keys(EMAIL_TEMPLATE_DEFAULTS) as EmailTemplateKey[]
  const rows = keys.map(key => ({
    key,
    subject: ((formData.get(`${key}_subject`) as string) ?? '').trim() || EMAIL_TEMPLATE_DEFAULTS[key].subject,
    body_html: ((formData.get(`${key}_body`) as string) ?? '').trim() || EMAIL_TEMPLATE_DEFAULTS[key].body_html,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await admin.from('email_templates').upsert(rows, { onConflict: 'key' })
  if (error) redirect('/admin/email-templates?error=' + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'email_template', entityLabel: 'Email templates' })

  revalidatePath('/admin/email-templates')
  redirect('/admin/email-templates?success=1')
}
