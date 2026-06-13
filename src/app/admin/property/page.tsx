import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { archiveProject } from './actions'
import ArchiveButton from './ArchiveButton'

export const metadata = { title: 'Property Management' }

const STATUS_LABELS: Record<string, string> = {
  planned: 'Planned',
  recent: 'Recent',
  archive: 'Archive',
}

export default async function AdminPropertyPage({
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

  // Planned and recent sorted by sort_order; archive sorted by updated_at DESC (newest-archived first)
  const [{ data: activeProjects }, { data: archiveProjects }] = await Promise.all([
    admin
      .from('property_projects')
      .select('id, name, status, scheduled_date, completed_date, cost, is_published, sort_order')
      .in('status', ['planned', 'recent'])
      .order('sort_order', { ascending: true }),
    admin
      .from('property_projects')
      .select('id, name, status, scheduled_date, completed_date, cost, is_published, sort_order, updated_at')
      .eq('status', 'archive')
      .order('updated_at', { ascending: false }),
  ])

  const { error } = await searchParams

  const groups: Record<string, typeof activeProjects> = {
    planned: (activeProjects ?? []).filter(p => p.status === 'planned'),
    recent:  (activeProjects ?? []).filter(p => p.status === 'recent'),
    archive: archiveProjects ?? [],
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-5xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              ← Admin Dashboard
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Property Management</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {(activeProjects ?? []).length + (archiveProjects ?? []).length} project{((activeProjects ?? []).length + (archiveProjects ?? []).length) !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/admin/property/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + Add Project
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {(['planned', 'recent', 'archive'] as const).map(section => (
          <div key={section}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-kp-gold text-xs font-bold uppercase tracking-widest">{STATUS_LABELS[section]}</div>
              {section === 'archive' && (
                <span className="text-gray-600 text-xs">sorted by most recently updated</span>
              )}
            </div>
            <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              {(groups[section] ?? []).length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">No {STATUS_LABELS[section].toLowerCase()} projects.</div>
              ) : (
                <div className="divide-y divide-kp-border">
                  {(groups[section] ?? []).map(p => {
                    const archiveThis = archiveProject.bind(null, p.id)
                    return (
                      <div key={p.id} className="flex items-center gap-3 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-semibold truncate">{p.name}</span>
                            {!p.is_published && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 shrink-0">hidden</span>
                            )}
                          </div>
                          <div className="text-gray-500 text-xs mt-0.5">
                            {p.scheduled_date && `Scheduled: ${p.scheduled_date}`}
                            {p.completed_date && `Completed: ${p.completed_date}`}
                            {p.cost && ` Â· ${p.cost}`}
                          </div>
                        </div>

                        {/* One-click archive for recent items */}
                        {section === 'recent' && <ArchiveButton action={archiveThis} />}

                        <Link
                          href={`/admin/property/${p.id}`}
                          className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                          Edit
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
