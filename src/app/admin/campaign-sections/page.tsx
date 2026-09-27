import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Campaign Vision & Renderings' }

export default async function AdminCampaignSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const [{ data: sections }, { data: photoRows }] = await Promise.all([
    admin
      .from('campaign_sections')
      .select('id, title, sort_order, is_published')
      .order('sort_order', { ascending: true }),
    admin.from('campaign_section_photos').select('section_id'),
  ])

  const photoCountBySection = new Map<string, number>()
  for (const p of photoRows ?? []) {
    photoCountBySection.set(p.section_id, (photoCountBySection.get(p.section_id) ?? 0) + 1)
  }

  const rows = sections ?? []
  const { error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin/giving-levels" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              ← Back to Capital Campaign &amp; Giving Levels
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Campaign Vision &amp; Renderings</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {rows.length} section{rows.length !== 1 ? 's' : ''} in &quot;What We&apos;re Building&quot; on the{' '}
              <Link href="/campaign" className="text-kp-gold hover:underline">Campaign page</Link>
            </p>
          </div>
          <Link
            href="/admin/campaign-sections/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + Add Section
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          {rows.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              No sections yet. The Campaign page hides &quot;What We&apos;re Building&quot; until you add one.
            </div>
          ) : (
            <div className="divide-y divide-kp-border">
              {rows.map(s => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-semibold truncate">{s.title}</span>
                      {!s.is_published && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700 shrink-0">Hidden</span>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {photoCountBySection.get(s.id) ?? 0} photo{(photoCountBySection.get(s.id) ?? 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Link
                    href={`/admin/campaign-sections/${s.id}`}
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
