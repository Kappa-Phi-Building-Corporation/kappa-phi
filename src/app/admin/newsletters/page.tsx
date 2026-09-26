import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatBytes } from '@/lib/formatBytes'

export const metadata = { title: 'Newsletters' }

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function AdminNewslettersPage({
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

  const { data: rows } = await admin
    .from('newsletters')
    .select('id, title, issue_date, file_url, file_size, is_published')
    .order('issue_date', { ascending: false })

  const newsletters = rows ?? []
  const { success, error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              ← Admin Dashboard
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Newsletters</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {newsletters.length} newsletter{newsletters.length !== 1 ? 's' : ''} on the{' '}
              <Link href="/newsletters" className="text-kp-gold hover:underline">public Newsletters page</Link>
            </p>
          </div>
          <Link
            href="/admin/newsletters/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + Upload Newsletter
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'created' ? 'Newsletter published.' : 'Changes saved.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          {newsletters.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">No newsletters yet.</div>
          ) : (
            <div className="divide-y divide-kp-border">
              {newsletters.map(n => (
                <div key={n.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                  <span className="text-kp-gold text-xs font-black w-24 shrink-0 tabular-nums">{fmtDate(n.issue_date)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-semibold truncate">{n.title}</span>
                      {!n.is_published && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700 shrink-0">Hidden</span>
                      )}
                    </div>
                    {n.file_size ? <div className="text-gray-500 text-xs mt-0.5">PDF · {formatBytes(n.file_size)}</div> : null}
                  </div>
                  <Link
                    href={`/admin/newsletters/${n.id}`}
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
