import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateBoardMember, deleteBoardMember } from '../actions'
import BoardMemberForm from '../BoardMemberForm'
import DeleteBoardMemberButton from '../DeleteBoardMemberButton'

export const metadata = { title: 'Edit Board Member' }

export default async function EditBoardMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')

  const { data: member } = await admin
    .from('board_members')
    .select('name, role, category, email, bio, goals, goals_bulleted, sort_order, is_active, photo_url')
    .eq('id', id)
    .single()
  if (!member) notFound()

  const { success, error } = await searchParams
  const updateThis = updateBoardMember.bind(null, id)
  const deleteThis = deleteBoardMember.bind(null, id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/board"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Board Members
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Board Member</h1>
          <p className="text-gray-500 text-sm mt-1">{member.name}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'created' ? 'Board member added.' : 'Changes saved.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <BoardMemberForm action={updateThis} member={member} />
        </div>

        <div className="bg-kp-surface border border-red-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-1">Remove from Board</h3>
          <p className="text-gray-500 text-xs mb-4">
            Permanently deletes this member and their photo. This cannot be undone.
          </p>
          <DeleteBoardMemberButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}
