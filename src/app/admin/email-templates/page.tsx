import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { EMAIL_TEMPLATE_DEFAULTS, getEmailTemplate, type EmailTemplateKey } from '@/lib/emailTemplates'
import { updateEmailTemplates } from './actions'

export const metadata = { title: 'Email Templates — Admin' }

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'
const textareaCls = inputCls + ' resize-y font-mono text-xs leading-relaxed'

export default async function EmailTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')

  const { success, error } = await searchParams
  const keys = Object.keys(EMAIL_TEMPLATE_DEFAULTS) as EmailTemplateKey[]
  const templates = await Promise.all(keys.map(async key => ({ key, ...await getEmailTemplate(key) })))

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Email Templates</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Edit the subject and body of the system emails sent to admins and members.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            Changes saved.
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form action={updateEmailTemplates} className="space-y-8">
          {templates.map(t => {
            const def = EMAIL_TEMPLATE_DEFAULTS[t.key]
            return (
              <div key={t.key} className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <h2 className="text-white font-bold text-lg">{def.label}</h2>
                  <p className="text-gray-500 text-xs mt-1">{def.description}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Available variables:{' '}
                    {def.variables.map(v => (
                      <code key={v} className="text-kp-gold font-mono mr-2">{`{{${v}}}`}</code>
                    ))}
                  </p>
                </div>

                <div>
                  <label htmlFor={`${t.key}_subject`} className={labelCls}>Subject</label>
                  <input id={`${t.key}_subject`} name={`${t.key}_subject`} defaultValue={t.subject} className={inputCls} />
                </div>

                <div>
                  <label htmlFor={`${t.key}_body`} className={labelCls}>Body (HTML)</label>
                  <textarea id={`${t.key}_body`} name={`${t.key}_body`} defaultValue={t.body_html} rows={10} className={textareaCls} />
                </div>
              </div>
            )
          })}

          <div className="flex justify-end pt-2 border-t border-kp-border">
            <button type="submit" className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </form>

        <Link href="/admin" className="text-gray-500 text-sm hover:text-gray-300 transition-colors no-underline">
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  )
}
