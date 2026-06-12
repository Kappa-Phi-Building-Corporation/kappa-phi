import PropertyIssueForm from './PropertyIssueForm'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Chapter Portal' }

// Revalidate hourly; admin saves call revalidatePath('/portal') for on-demand bust
export const revalidate = 3600

export default async function PortalPage() {
  const admin = createAdminClient()
  const { data: resources } = await admin
    .from('portal_resources')
    .select('id, label, href, is_external, requires_auth')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  const hasAuthLinks = (resources ?? []).some(r => r.requires_auth)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Members & Chapter</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Chapter Portal</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Resources for active members and alumni of the Epsilon Nu Chapter.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Resources */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          <div className="bg-kp-blue px-6 py-4">
            <h2 className="text-kp-gold font-bold">Resources</h2>
            {hasAuthLinks && (
              <p className="text-gray-300 text-xs mt-1">
                Some links below require you to be logged in to access.
              </p>
            )}
          </div>
          <div className="divide-y divide-kp-border">
            {(resources ?? []).map(r => (
              <a
                key={r.id}
                href={r.href}
                target={r.is_external ? '_blank' : undefined}
                rel={r.is_external ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between px-6 py-4 no-underline hover:bg-kp-card transition-colors group"
              >
                <span className="text-gray-200 text-sm group-hover:text-kp-gold transition-colors">{r.label}</span>
                <span className="flex items-center gap-2 shrink-0 ml-4">
                  {r.requires_auth && (
                    <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wide border border-amber-500/30 bg-amber-500/10 rounded-full px-2 py-0.5">
                      Login required
                    </span>
                  )}
                  <span className="text-kp-gold text-xs">{r.is_external ? '↗' : '→'}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Property Issue Form */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          <div className="bg-kp-blue px-6 py-4">
            <h2 className="text-kp-gold font-bold">Report a Property Issue</h2>
          </div>
          <div className="p-6">
            <PropertyIssueForm />
          </div>
        </div>
      </div>
    </div>
  )
}
