import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createBoardMember } from '../actions'
import BoardMemberForm from '../BoardMemberForm'

export const metadata = { title: 'Add Board Member' }

export default async function NewBoardMemberPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/board"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            â† Back to Board Members
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Add Board Member</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <BoardMemberForm action={createBoardMember} />
        </div>
      </div>
    </div>
  )
}
