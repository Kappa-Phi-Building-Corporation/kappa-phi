import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logout } from '@/app/auth/actions'
import UserAccountSection from './UserAccountSection'
import MemberProfileSection from './MemberProfileSection'
import type { MemberRow, MemberSummary, ChangeRequest } from './ProfileForm'

export const metadata = { title: 'My Profile' }

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; registered?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const [profileResult, membersResult, linkedResult] = await Promise.all([
    admin.from('profiles')
      .select('member_id, link_request_status, requested_member_id')
      .eq('id', user.id)
      .single(),
    admin.from('members')
      .select('id, first_name, last_name, badge_number')
      .order('last_name'),
    admin.from('profiles')
      .select('member_id')
      .not('member_id', 'is', null),
  ])

  const memberId = profileResult.data?.member_id as string | null

  // Fetch the linked member separately to avoid the null-FK join issue
  const memberResult = memberId
    ? await admin.from('members').select('*').eq('id', memberId).single()
    : null
  const member = (memberResult?.data ?? null) as MemberRow | null
  const linkRequestStatus   = (profileResult.data?.link_request_status as string | null) ?? null
  const requestedMemberId   = (profileResult.data?.requested_member_id as string | null) ?? null
  const allMembers          = (membersResult.data ?? []) as MemberSummary[]
  const linkedMemberIds = (linkedResult.data ?? []).map(r => r.member_id as string).filter(Boolean)
  const requestedMember = requestedMemberId
    ? (allMembers.find(m => m.id === requestedMemberId) ?? null)
    : null

  const changeRequestResult = memberId
    ? await admin.from('member_change_requests')
        .select('id, badge_number, pledge_class, big_brother_id, note')
        .eq('member_id', memberId)
        .eq('status', 'pending')
        .maybeSingle()
    : null
  const pendingChangeRequest = (changeRequestResult?.data ?? null) as ChangeRequest | null

  const meta         = (user.user_metadata ?? {}) as Record<string, string>
  const authFirstName = meta.first_name ?? ''
  const authLastName  = meta.last_name  ?? ''

  const { saved, registered, error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              {authFirstName || member?.first_name
                ? `Welcome back, ${authFirstName || member?.first_name}`
                : 'Your Profile'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <form action={logout}>
            <button type="submit"
              className="border border-kp-border text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-kp-gold hover:text-kp-gold transition-colors">
              Sign Out
            </button>
          </form>
        </div>

        {/* Banners */}
        {saved && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl mb-6 text-sm flex gap-2">
            <span>✓</span> Saved successfully.
          </div>
        )}
        {registered && (
          <div className="bg-kp-blue/30 border border-kp-blue text-blue-200 px-4 py-3 rounded-xl mb-6 text-sm flex gap-2">
            <span>✓</span> Account created! Please complete your profile below.
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Two sections */}
        <div className="space-y-6">
          <UserAccountSection
            authEmail={user.email ?? ''}
            authFirstName={authFirstName}
            authLastName={authLastName}
            memberId={memberId}
            memberFirstName={member?.first_name ?? null}
            memberLastName={member?.last_name ?? null}
            memberEmail={member?.email ?? null}
          />

          <MemberProfileSection
            member={member}
            allMembers={allMembers}
            targetMemberId={memberId}
            linkRequestStatus={linkRequestStatus}
            requestedMember={requestedMember}
            linkedMemberIds={linkedMemberIds}
            pendingChangeRequest={pendingChangeRequest}
          />
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Alumni Directory', href: '/alumni/directory' },
            { label: 'Big Brother Tree',  href: '/alumni/tree' },
            { label: 'Events & Calendar', href: '/events' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className="bg-kp-surface border border-kp-border rounded-xl px-4 py-3 text-sm no-underline text-center text-kp-gold hover:border-kp-blue hover:bg-kp-card transition-colors">
              {item.label}
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}
