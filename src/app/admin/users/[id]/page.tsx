import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ProfileForm from '@/app/profile/ProfileForm'
import type { MemberRow, MemberSummary } from '@/app/profile/ProfileForm'
import { updateUserAdmin, linkMember } from './actions'

export const metadata = { title: 'Edit User Account' }

export default async function AdminEditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin
    .from('profiles').select('role').eq('id', currentUser.id).single()
  if (currentProfile?.role !== 'admin') redirect('/portal')

  const [profileResult, membersResult, authUserResult] = await Promise.all([
    admin.from('profiles')
      .select('id, member_id, is_approved, role')
      .eq('id', id)
      .single(),
    admin.from('members')
      .select('id, first_name, last_name, badge_number')
      .order('last_name'),
    admin.auth.admin.getUserById(id),
  ])

  if (!profileResult.data) redirect('/admin/users')

  const profile = profileResult.data

  // Fetch the linked member record separately to avoid the null-FK join issue
  const memberResult = profile.member_id
    ? await admin.from('members').select('*').eq('id', profile.member_id).single()
    : null
  const member = (memberResult?.data ?? null) as MemberRow | null
  const allMembers = (membersResult.data ?? []) as MemberSummary[]
  const authEmail  = authUserResult.data?.user?.email ?? ''

  const accountData = {
    is_approved: profile.is_approved,
    role:        profile.role,
    member_id:   profile.member_id,
  }

  const { saved, error } = await searchParams
  const displayName = member
    ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() || authEmail
    : authEmail

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/admin/users"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Users
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">{displayName}</h1>
          <p className="text-gray-500 text-sm mt-1">{authEmail}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {saved && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm flex gap-2">
            <span>✓</span> Saved successfully.
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm flex gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Linked member record */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6">
          <div className="text-xs font-bold text-kp-gold uppercase tracking-widest mb-4">Linked Member Record</div>
          {member ? (
            <p className="text-sm text-gray-300 mb-4">
              Currently linked to:{' '}
              <span className="text-white font-medium">
                {member.first_name} {member.last_name}
                {(member as MemberRow & { badge_number?: string | null }).badge_number
                  ? ` (#${(member as MemberRow & { badge_number?: string | null }).badge_number})`
                  : ''}
              </span>
              {' · '}
              <Link href={`/admin/members/${profile.member_id}`}
                className="text-kp-gold hover:underline text-xs">
                Edit member record →
              </Link>
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-4 italic">
              No member record linked. Save the profile below to auto-create one, or relink to an existing member.
            </p>
          )}

          <form action={linkMember} className="flex flex-wrap gap-3 items-end">
            <input type="hidden" name="targetProfileId" value={id} />
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Relink to existing member
              </label>
              <select name="memberId"
                className="w-full bg-kp-card border border-kp-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-kp-blue">
                <option value="">— None (unlink) —</option>
                {allMembers.map(m => (
                  <option key={m.id} value={m.id}
                    selected={m.id === profile.member_id}>
                    {m.last_name}, {m.first_name}{m.badge_number ? ` (#${m.badge_number})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit"
              className="px-4 py-2 rounded-lg border border-kp-border text-sm text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors">
              Relink
            </button>
          </form>
        </div>

        {/* Member + account form */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <ProfileForm
            member={member}
            accountData={accountData}
            members={allMembers}
            isAdmin={true}
            targetProfileId={id}
            targetMemberId={profile.member_id}
            action={updateUserAdmin}
          />
        </div>
      </div>
    </div>
  )
}
