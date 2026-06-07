import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { approveChangeRequest, denyChangeRequest } from './actions'

export const metadata = { title: 'Change Requests — Admin' }

export default async function ChangeRequestsPage() {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin.from('profiles').select('role').eq('id', currentUser.id).single()
  if (currentProfile?.role !== 'admin') redirect('/portal')

  const [{ data: requestsRaw }, { data: membersRaw }] = await Promise.all([
    admin.from('member_change_requests')
      .select('id, member_id, profile_id, badge_number, pledge_class, big_brother_id, note, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    admin.from('members')
      .select('id, first_name, last_name, badge_number, pledge_class, big_brother_id'),
  ])

  type ReqRow = {
    id: string
    member_id: string
    profile_id: string
    badge_number: string | null
    pledge_class: string | null
    big_brother_id: string | null
    note: string | null
    created_at: string
  }

  type MemberMin = {
    id: string
    first_name: string | null
    last_name: string | null
    badge_number: string | null
    pledge_class: string | null
    big_brother_id: string | null
  }

  const requests = (requestsRaw ?? []) as ReqRow[]
  const members  = (membersRaw  ?? []) as MemberMin[]
  const memberMap = new Map(members.map(m => [m.id, m]))

  // Fetch emails for requesters
  const emailMap = new Map<string, string>()
  await Promise.all(requests.map(async r => {
    try {
      const { data: { user } } = await admin.auth.admin.getUserById(r.profile_id)
      if (user?.email) emailMap.set(r.profile_id, user.email)
    } catch { /* ignore */ }
  }))

  function memberName(id: string | null) {
    if (!id) return '—'
    const m = memberMap.get(id)
    return m ? `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || '—' : '—'
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Chapter Record Change Requests</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {requests.length} pending request{requests.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {requests.length === 0 ? (
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-12 text-center text-gray-500">
            No pending change requests.
          </div>
        ) : (
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 bg-kp-blue flex items-center gap-3">
              <h2 className="text-kp-gold font-bold">Pending Requests</h2>
              <span className="bg-kp-gold/20 text-kp-gold text-xs font-bold px-2 py-0.5 rounded-full">{requests.length}</span>
            </div>
            <div className="divide-y divide-kp-border">
              {requests.map(r => {
                const current = memberMap.get(r.member_id)
                const email   = emailMap.get(r.profile_id) ?? '—'
                return (
                  <div key={r.id} className="px-6 py-5 hover:bg-kp-card/30 transition-colors">
                    <div className="flex flex-wrap gap-6 items-start justify-between">
                      {/* Who & when */}
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm">
                          {memberName(r.member_id)}
                        </p>
                        <p className="text-gray-500 text-xs">{email}</p>
                        <p className="text-gray-600 text-xs mt-0.5">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Requested changes */}
                      <div className="flex-1 min-w-64">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Requested Changes</p>
                        <dl className="grid grid-cols-1 gap-1.5 text-sm">
                          {r.badge_number !== null && (
                            <div className="flex gap-3">
                              <dt className="text-gray-500 w-28 shrink-0">Badge Number</dt>
                              <dd>
                                <span className="text-gray-500 line-through text-xs mr-2">{current?.badge_number ?? '—'}</span>
                                <span className="text-white font-medium">{r.badge_number}</span>
                              </dd>
                            </div>
                          )}
                          {r.pledge_class !== null && (
                            <div className="flex gap-3">
                              <dt className="text-gray-500 w-28 shrink-0">Pledge Class</dt>
                              <dd>
                                <span className="text-gray-500 line-through text-xs mr-2">{current?.pledge_class ?? '—'}</span>
                                <span className="text-white font-medium">{r.pledge_class}</span>
                              </dd>
                            </div>
                          )}
                          {r.big_brother_id !== null && (
                            <div className="flex gap-3">
                              <dt className="text-gray-500 w-28 shrink-0">Big Brother</dt>
                              <dd>
                                <span className="text-gray-500 line-through text-xs mr-2">{memberName(current?.big_brother_id ?? null)}</span>
                                <span className="text-white font-medium">{memberName(r.big_brother_id)}</span>
                              </dd>
                            </div>
                          )}
                        </dl>
                        {r.note && (
                          <p className="text-xs text-gray-500 italic mt-2">Note: {r.note}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <form action={approveChangeRequest}>
                          <input type="hidden" name="requestId" value={r.id} />
                          <button type="submit"
                            className="px-4 py-2 rounded-lg bg-green-800/60 text-green-300 text-sm font-semibold hover:bg-green-700/60 transition-colors">
                            Approve
                          </button>
                        </form>
                        <form action={denyChangeRequest}>
                          <input type="hidden" name="requestId" value={r.id} />
                          <button type="submit"
                            className="px-4 py-2 rounded-lg bg-red-900/40 text-red-400 text-sm font-semibold hover:bg-red-800/40 transition-colors">
                            Deny
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <a href="/admin/users"
          className="text-gray-500 text-sm hover:text-gray-300 transition-colors no-underline">
          ← Back to User Accounts
        </a>
      </div>
    </div>
  )
}
