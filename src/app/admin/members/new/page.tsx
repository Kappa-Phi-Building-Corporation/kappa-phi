import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ProfileForm from '@/app/profile/ProfileForm'
import type { MemberSummary } from '@/app/profile/ProfileForm'
import { createMember } from '../[id]/actions'

export const metadata = { title: 'New Member Record' }

export default async function NewMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin
    .from('profiles').select('role').eq('id', currentUser.id).single()
  if (currentProfile?.role !== 'admin') redirect('/portal')

  const { data: membersRaw } = await admin
    .from('members')
    .select('id, first_name, last_name, badge_number')
    .order('last_name')

  const allMembers = (membersRaw ?? []) as MemberSummary[]

  const { error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/members"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Members
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">New Member Record</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details below and save to create the record.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm flex gap-2 mb-6">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <ProfileForm
            member={null}
            members={allMembers}
            isAdmin={true}
            action={createMember}
          />
        </div>
      </div>
    </div>
  )
}
