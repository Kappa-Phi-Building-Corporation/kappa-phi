import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ProfileForm from '@/app/profile/ProfileForm'
import type { MemberRow, MemberSummary } from '@/app/profile/ProfileForm'
import { updateMemberById } from './actions'

export const metadata = { title: 'Edit Member Record' }

export default async function AdminEditMemberPage({
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

  const [memberResult, membersResult] = await Promise.all([
    admin.from('members').select('*').eq('id', id).single(),
    admin.from('members')
      .select('id, first_name, last_name, badge_number')
      .order('last_name'),
  ])

  if (!memberResult.data) redirect('/admin/members')

  const member     = memberResult.data as MemberRow
  const allMembers = (membersResult.data ?? []) as MemberSummary[]

  const { saved, error } = await searchParams
  const displayName = `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() || 'Unknown Member'

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/admin/members"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Members
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">{displayName}</h1>
          {member.badge_number && (
            <p className="text-gray-500 text-sm mt-1">Badge #{member.badge_number}</p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {saved && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm flex gap-2">
            <span>✓</span> Member record saved.
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm flex gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <ProfileForm
            member={member}
            members={allMembers}
            isAdmin={true}
            targetMemberId={id}
            action={updateMemberById}
          />
        </div>
      </div>
    </div>
  )
}
