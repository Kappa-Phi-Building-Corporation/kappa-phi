import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { SocialIcon, SOCIAL_PLATFORMS } from '@/lib/socialPlatforms'

export const metadata = { title: 'Social Links' }

export default async function AdminSocialLinksPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { data: links } = await admin
    .from('social_links')
    .select('id, platform, label, url, sort_order, is_published')
    .order('sort_order', { ascending: true })

  const rows = links ?? []
  const { success, error } = await searchParams
  const platformLabel = (p: string) => SOCIAL_PLATFORMS.find(x => x.value === p)?.label ?? p

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              ← Admin Dashboard
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Social Links</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {rows.length} link{rows.length !== 1 ? 's' : ''} in the Events page &quot;Stay up to date&quot; strip
            </p>
          </div>
          <Link
            href="/admin/social-links/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + Add Link
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'created' ? 'Link added.' : 'Changes saved.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          {rows.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">No social links yet.</div>
          ) : (
            <div className="divide-y divide-kp-border">
              {rows.map(l => (
                <div key={l.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                  <span className="w-9 h-9 rounded-lg bg-kp-card flex items-center justify-center text-gray-400 shrink-0">
                    <SocialIcon platform={l.platform} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-semibold truncate">{l.label}</span>
                      {!l.is_published && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700 shrink-0">Hidden</span>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5 truncate">{platformLabel(l.platform)} · {l.url}</div>
                  </div>
                  <Link
                    href={`/admin/social-links/${l.id}`}
                    className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
