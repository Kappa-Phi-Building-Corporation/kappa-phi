import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Activity Log — Admin' }

type LogRow = {
  id: string
  actor_name: string
  action: string
  entity_type: string
  entity_id: string | null
  entity_label: string
  created_at: string
}

const ENTITY_LABELS: Record<string, string> = {
  member: 'Member',
  board_member: 'Board Member',
  property_project: 'Property Project',
  chapter_honor: 'Honor Roll',
  chapter_mascot: 'Mascot',
  chapter_eternal: 'Chapter Eternal',
  event: 'Event',
  portal_resource: 'Portal Resource',
  pats_guide: "Pat's Guide",
  pats_guide_section: "Pat's Guide Section",
  pats_guide_photo: "Pat's Guide Photo",
  user_account: 'User Account',
  big_brother: 'Big Brother',
  change_request: 'Change Request',
  link_request: 'Link Request',
  site_content: 'Site Content',
  email_template: 'Email Template',
}

const ACTION_STYLES: Record<string, string> = {
  create: 'bg-green-900/40 text-green-300',
  update: 'bg-kp-blue/30 text-blue-300',
  delete: 'bg-red-900/40 text-red-400',
  approve: 'bg-green-900/40 text-green-300',
  deny: 'bg-red-900/40 text-red-400',
}

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (currentProfile?.role !== 'admin') redirect('/portal')

  const { type } = await searchParams

  let query = admin
    .from('admin_activity_log')
    .select('id, actor_name, action, entity_type, entity_id, entity_label, created_at')
    .order('created_at', { ascending: false })
    .limit(300)

  if (type) query = query.eq('entity_type', type)

  const { data: rowsRaw } = await query
  const rows = (rowsRaw ?? []) as LogRow[]

  const entityTypes = Object.keys(ENTITY_LABELS)

  function typeHref(t?: string) {
    return t ? `/admin/activity?type=${t}` : '/admin/activity'
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Activity Log</h1>
          <p className="text-gray-400 mt-2 text-sm">
            The most recent {rows.length} change{rows.length !== 1 ? 's' : ''} across member and content records.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href={typeHref()}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold no-underline transition-colors ${
              !type ? 'bg-kp-gold text-black' : 'bg-kp-surface border border-kp-border text-gray-400 hover:text-white'
            }`}
          >
            All
          </Link>
          {entityTypes.map(t => (
            <Link
              key={t}
              href={typeHref(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold no-underline transition-colors ${
                type === t ? 'bg-kp-gold text-black' : 'bg-kp-surface border border-kp-border text-gray-400 hover:text-white'
              }`}
            >
              {ENTITY_LABELS[t]}
            </Link>
          ))}
        </div>

        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          {rows.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No activity recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-kp-border">
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">When</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Who</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Record</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id} className="border-b border-kp-border/50 last:border-0 hover:bg-kp-card/40 transition-colors">
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{r.actor_name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ACTION_STYLES[r.action] ?? 'bg-gray-800 text-gray-400'}`}>
                          {r.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{ENTITY_LABELS[r.entity_type] ?? r.entity_type}</td>
                      <td className="px-4 py-3 text-gray-300">{r.entity_label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Link href="/admin" className="text-gray-500 text-sm hover:text-gray-300 transition-colors no-underline">
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  )
}
