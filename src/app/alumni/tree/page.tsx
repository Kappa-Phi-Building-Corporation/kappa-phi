import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import FamilyTree from './FamilyTree'

export const metadata = { title: 'Big/Little Family Tree' }

export default async function FamilyTreePage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: currentProfile } = await admin
    .from('profiles')
    .select('is_approved, role')
    .eq('id', user.id)
    .single()

  if (!currentProfile?.is_approved) redirect('/auth/pending')

  const { data: members } = await admin
    .from('members')
    .select('id, first_name, last_name, badge_number, pledge_class, big_brother_id, hide_entry')
    .not('badge_number', 'is', null)
    .neq('member_status', 'expelled_other')
    .order('badge_number')

  const count = members?.length ?? 0
  const { focus } = await searchParams

  return (
    <div className="bg-kp-dark flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-kp-crimson-dark border-b border-kp-border shrink-0">
        <div className="max-w-full px-6 py-5 flex items-end gap-6">
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Members Only</div>
            <h1 className="text-2xl font-black text-white">Big/Little Family Tree</h1>
          </div>
          <p className="text-gray-500 text-sm pb-0.5">
            {count} member{count !== 1 ? 's' : ''}
          </p>
          <p className="text-gray-600 text-xs pb-0.5 hidden sm:block">
            Click a member to highlight their lineage · Scroll to zoom · Drag to pan
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <FamilyTree members={members ?? []} initialFocusId={focus} />
      </div>
    </div>
  )
}
