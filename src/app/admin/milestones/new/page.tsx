import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createMilestone } from '../actions'
import MilestoneForm from '../MilestoneForm'

export const metadata = { title: 'Add Milestone' }

export default async function NewMilestonePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { data: existing } = await admin
    .from('chapter_milestones')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const defaultSortOrder = (existing?.[0]?.sort_order ?? -5) + 5

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/milestones"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Chapter Milestones
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Add Milestone</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <MilestoneForm action={createMilestone} defaultSortOrder={defaultSortOrder} />
        </div>
      </div>
    </div>
  )
}
