import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { denyUser, setRole } from './actions'
import { ApproveActions } from './ApproveActions'

export const metadata = { title: 'User Administration' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single()
  if (currentProfile?.role !== 'admin') redirect('/portal')

  const [
    { data: { users: authUsers } },
    { data: profiles },
    { data: allMembersRaw },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 500 }),
    admin.from('profiles')
      .select('id, member_id, is_approved, role')
      .order('created_at', { ascending: false }),
    admin.from('members')
      .select('id, first_name, last_name, badge_number')
      .order('last_name'),
  ])

  type ProfileRow = {
    id: string
    member_id: string | null
    is_approved: boolean
    role: string
  }

  type MemberOption = {
    id: string
    first_name: string | null
    last_name: string | null
    badge_number: string | null
  }

  const allMembers = (allMembersRaw ?? []) as MemberOption[]
  const memberMap  = new Map<string, MemberOption>(allMembers.map(m => [m.id, m]))

  const profileMap = new Map<string, ProfileRow>(
    ((profiles ?? []) as ProfileRow[]).map((p: ProfileRow) => [p.id, p])
  )

  const rows = authUsers.map(au => ({
    id:             au.id,
    authEmail:      au.email ?? '',
    emailConfirmed: !!au.email_confirmed_at,
    createdAt:      au.created_at,
    profile:        profileMap.get(au.id),
  }))

  const pending     = rows.filter(r => r.profile && !r.profile.is_approved && r.emailConfirmed)
  const approved    = rows.filter(r => r.profile?.is_approved)
  const unconfirmed = rows.filter(r => !r.emailConfirmed)

  const statusBadge = (row: typeof rows[0]) => {
    if (!row.emailConfirmed)           return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400">Unconfirmed</span>
    if (!row.profile?.is_approved)     return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-900/60 text-yellow-400">Pending</span>
    if (row.profile?.role === 'admin') return <span className="px-2 py-0.5 rounded-full text-xs bg-kp-blue text-kp-gold">Admin</span>
    if (row.profile?.role === 'website_admin') return <span className="px-2 py-0.5 rounded-full text-xs bg-kp-blue text-kp-gold">Website Admin</span>
    return <span className="px-2 py-0.5 rounded-full text-xs bg-green-900/60 text-green-400">Approved</span>
  }

  function UserRow({ row }: { row: typeof rows[0] }) {
    const p = row.profile
    const m = p?.member_id ? (memberMap.get(p.member_id) ?? null) : null
    const displayName = m ? `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || '—' : '—'
    return (
      <tr className="border-b border-kp-border hover:bg-kp-card/50 transition-colors">
        <td className="px-4 py-3">
          <div className="font-medium text-white text-sm">{displayName}</div>
          <div className="text-gray-500 text-xs">{row.authEmail}</div>
        </td>
        <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{m?.badge_number ?? '—'}</td>
        <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
          {new Date(row.createdAt).toLocaleDateString()}
        </td>
        <td className="px-4 py-3">{statusBadge(row)}</td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            {p && p.is_approved && (
              <a href={`/admin/users/${row.id}`}
                className="px-3 py-1 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                Edit
              </a>
            )}
            {p && !p.is_approved && row.emailConfirmed && (
              <ApproveActions userId={row.id} allMembers={allMembers} />
            )}
            {p && !p.is_approved && !row.emailConfirmed && (
              <form action={denyUser.bind(null, row.id)}>
                <button className="px-3 py-1 text-xs rounded-lg bg-red-800 hover:bg-red-700 text-white font-medium transition-colors">
                  Deny &amp; Delete
                </button>
              </form>
            )}
            {p?.is_approved && p.role === 'member' && row.id !== currentUser?.id && (
              <form action={setRole.bind(null, row.id, 'admin')}>
                <button className="px-3 py-1 text-xs rounded-lg border border-kp-border text-gray-400 hover:border-kp-gold hover:text-kp-gold transition-colors">Make Admin</button>
              </form>
            )}
            {p?.is_approved && p.role === 'admin' && row.id !== currentUser?.id && (
              <form action={setRole.bind(null, row.id, 'member')}>
                <button className="px-3 py-1 text-xs rounded-lg border border-kp-border text-gray-400 hover:border-red-500 hover:text-red-400 transition-colors">Remove Admin</button>
              </form>
            )}
            {p?.is_approved && p.role === 'member' && row.id !== currentUser?.id && (
              <form action={setRole.bind(null, row.id, 'website_admin')}>
                <button className="px-3 py-1 text-xs rounded-lg border border-kp-border text-gray-400 hover:border-kp-gold hover:text-kp-gold transition-colors">Make Website Admin</button>
              </form>
            )}
            {p?.is_approved && p.role === 'website_admin' && row.id !== currentUser?.id && (
              <form action={setRole.bind(null, row.id, 'member')}>
                <button className="px-3 py-1 text-xs rounded-lg border border-kp-border text-gray-400 hover:border-red-500 hover:text-red-400 transition-colors">Remove Website Admin</button>
              </form>
            )}
          </div>
        </td>
      </tr>
    )
  }

  function Section({ title, items, accent }: { title: string; items: typeof rows; accent?: string }) {
    if (items.length === 0) return null
    return (
      <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
        <div className={`px-6 py-4 flex items-center gap-3 ${accent ?? 'bg-kp-blue'}`}>
          <h2 className="text-kp-gold font-bold">{title}</h2>
          <span className="bg-kp-gold/20 text-kp-gold text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-kp-border">
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Name / Email</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider hidden sm:table-cell">Badge</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">Registered</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>{items.map(row => <UserRow key={row.id} row={row} />)}</tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">User Accounts</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {rows.length} registered account{rows.length !== 1 ? 's' : ''} ·{' '}
            {pending.length} pending approval
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {pending.length === 0 && approved.length === 0 && unconfirmed.length === 0 && (
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-12 text-center text-gray-500">No users registered yet.</div>
        )}
        <Section title="Pending Approval" items={pending} accent="bg-yellow-900/40" />
        <Section title="Approved Users" items={approved} />
        <Section title="Awaiting Email Confirmation" items={unconfirmed} accent="bg-gray-800" />
        <div className="flex gap-6 pt-2">
          <a href="/admin/link-requests"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors no-underline">
            Member Link Requests →
          </a>
          <a href="/admin/change-requests"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors no-underline">
            Chapter Record Change Requests →
          </a>
          <a href="/admin/members"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors no-underline">
            Manage Member Records →
          </a>
        </div>
      </div>
    </div>
  )
}
