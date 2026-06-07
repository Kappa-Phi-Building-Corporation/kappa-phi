import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import LinkRequestActions from './LinkRequestActions'
import type { MemberSummary } from '@/app/profile/ProfileForm'

export const metadata = { title: 'Link Requests — Admin' }

export default async function LinkRequestsPage() {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin.from('profiles').select('role').eq('id', currentUser.id).single()
  if (currentProfile?.role !== 'admin') redirect('/portal')

  const [
    { data: requestsRaw },
    { data: allMembersRaw },
  ] = await Promise.all([
    admin.from('profiles')
      .select('id, link_request_status, requested_member_id, member_id')
      .in('link_request_status', ['pending', 'conflict'])
      .order('link_request_status'),
    admin.from('members')
      .select('id, first_name, last_name, badge_number')
      .order('last_name'),
  ])

  const allMembers = (allMembersRaw ?? []) as MemberSummary[]
  const memberMap  = new Map(allMembers.map(m => [m.id, m]))

  // Fetch auth emails for each request
  type RequestRow = {
    id: string
    link_request_status: string
    requested_member_id: string
    member_id: string | null
  }
  const requests = (requestsRaw ?? []) as RequestRow[]

  const emailMap = new Map<string, string>()
  await Promise.all(
    requests.map(async r => {
      try {
        const { data: { user } } = await admin.auth.admin.getUserById(r.id)
        if (user?.email) emailMap.set(r.id, user.email)
      } catch { /* ignore */ }
    })
  )

  const pending  = requests.filter(r => r.link_request_status === 'pending')
  const conflict = requests.filter(r => r.link_request_status === 'conflict')

  function RequestRow({ r }: { r: RequestRow }) {
    const requested = memberMap.get(r.requested_member_id)
    const current   = r.member_id ? memberMap.get(r.member_id) : null
    const email     = emailMap.get(r.id) ?? '—'
    const isConflict = r.link_request_status === 'conflict'

    return (
      <tr className="border-b border-kp-border hover:bg-kp-card/50 transition-colors">
        <td className="px-4 py-3">
          <div className="text-white text-sm font-medium">{email}</div>
          {current && (
            <div className="text-gray-500 text-xs mt-0.5">
              Currently linked: {current.first_name} {current.last_name}
              {current.badge_number && ` #${current.badge_number}`}
            </div>
          )}
        </td>
        <td className="px-4 py-3">
          {requested ? (
            <div>
              <div className="text-white text-sm">
                {requested.first_name} {requested.last_name}
              </div>
              {requested.badge_number && (
                <div className="text-gray-500 text-xs">#{requested.badge_number}</div>
              )}
            </div>
          ) : (
            <span className="text-gray-600 text-sm">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            isConflict
              ? 'bg-amber-900/40 text-amber-400'
              : 'bg-blue-900/40 text-blue-300'
          }`}>
            {isConflict ? 'Conflict' : 'Pending'}
          </span>
        </td>
        <td className="px-4 py-3">
          <LinkRequestActions
            profileId={r.id}
            requestedMemberId={r.requested_member_id}
            allMembers={allMembers}
          />
        </td>
      </tr>
    )
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Member Link Requests</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {requests.length} pending request{requests.length !== 1 ? 's' : ''}
            {conflict.length > 0 && ` · ${conflict.length} conflict${conflict.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {requests.length === 0 && (
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-12 text-center text-gray-500">
            No pending link requests.
          </div>
        )}

        {conflict.length > 0 && (
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-3 bg-amber-900/30">
              <h2 className="text-kp-gold font-bold">Conflicts</h2>
              <span className="bg-amber-900/40 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">{conflict.length}</span>
            </div>
            <p className="px-6 py-3 text-amber-300/80 text-xs border-b border-kp-border/50 bg-amber-900/10">
              These users requested a member record that already has a linked account. Review and decide which account should hold the link.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-kp-border">
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">User Account</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Requested Member</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>{conflict.map(r => <RequestRow key={r.id} r={r} />)}</tbody>
              </table>
            </div>
          </div>
        )}

        {pending.length > 0 && (
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-3 bg-kp-blue">
              <h2 className="text-kp-gold font-bold">Pending Requests</h2>
              <span className="bg-kp-gold/20 text-kp-gold text-xs font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-kp-border">
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">User Account</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Requested Member</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>{pending.map(r => <RequestRow key={r.id} r={r} />)}</tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <a href="/admin/users"
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors no-underline">
            ← Back to User Accounts
          </a>
        </div>
      </div>
    </div>
  )
}
