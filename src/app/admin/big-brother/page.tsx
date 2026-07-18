import Link from 'next/link'
import { requireAdmin } from '../users/actions'
import { createAdminClient } from '@/lib/supabase/admin'
import BigBrotherMaintenance from './BigBrotherMaintenance'
import { assignBigBrothers } from './actions'

export const metadata = { title: 'Big Brother Maintenance' }

function badgeNum(badge: string | null) {
  return parseInt(badge ?? '999999', 10) || 999999
}

export default async function BigBrotherMaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  await requireAdmin()
  const admin = createAdminClient()

  const [{ data: missingRaw }, { data: allMembersRaw }] = await Promise.all([
    admin
      .from('members')
      .select('id, first_name, last_name, badge_number, pledge_class')
      .not('badge_number', 'is', null)
      .is('big_brother_id', null),
    admin
      .from('members')
      .select('id, first_name, last_name, badge_number')
      .not('badge_number', 'is', null),
  ])

  const missing = (missingRaw ?? []).sort((a, b) => badgeNum(a.badge_number) - badgeNum(b.badge_number))
  const allMembers = allMembersRaw ?? []

  const { success } = await searchParams

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Admin Dashboard
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Member Administration</div>
          <h1 className="text-4xl font-black text-white">Big Brother Maintenance</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {missing.length} member{missing.length !== 1 ? 's' : ''} without a big brother on record
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {success !== undefined && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {Number(success) > 0
              ? `Updated ${success} member${Number(success) !== 1 ? 's' : ''}.`
              : 'No changes were made — nothing was assigned.'}
          </div>
        )}

        {missing.length === 0 ? (
          <div className="bg-kp-surface border border-kp-border rounded-2xl px-6 py-10 text-center text-gray-500 text-sm">
            Every member with a badge number has a big brother on record.
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm">
              Some of these are legitimately root members (early badge numbers, colony founders, etc.) with no
              big brother to assign — leave those set to <span className="text-gray-400">&ldquo;Leave unset&rdquo;</span>.
              Only rows you change here get saved; anyone you skip stays in this list.
            </p>
            <BigBrotherMaintenance missing={missing} allMembers={allMembers} action={assignBigBrothers} />
          </>
        )}
      </div>
    </div>
  )
}
