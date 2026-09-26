import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateGivingLevel, deleteGivingLevel } from '../actions'
import GivingLevelForm from '../GivingLevelForm'
import DeleteGivingLevelButton from '../DeleteGivingLevelButton'

export const metadata = { title: 'Edit Giving Level' }

export default async function EditGivingLevelPage({
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
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { data: level } = await admin
    .from('campaign_giving_levels')
    .select('name, amount_label, description, donors, sort_order, is_published')
    .eq('id', id)
    .single()
  if (!level) notFound()

  const { success, error } = await searchParams
  const updateThis = updateGivingLevel.bind(null, id)
  const deleteThis = deleteGivingLevel.bind(null, id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/giving-levels"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Giving Levels
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Giving Level</h1>
          <p className="text-gray-500 text-sm mt-1">{level.name}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            Changes saved.
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <GivingLevelForm action={updateThis} level={level} />
        </div>

        <div className="bg-kp-surface border border-red-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-1">Remove Level</h3>
          <p className="text-gray-500 text-xs mb-4">Permanently removes this level from the Campaign page. This cannot be undone.</p>
          <DeleteGivingLevelButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}
