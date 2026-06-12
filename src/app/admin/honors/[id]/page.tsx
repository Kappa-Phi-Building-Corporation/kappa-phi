import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateChapterHonor, deleteChapterHonor } from '../actions'
import HonorForm from '../HonorForm'
import DeleteHonorButton from '../DeleteHonorButton'

export const metadata = { title: 'Edit Honor Roll Entry' }

export default async function EditHonorPage({
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

  const [{ data: honor }, { data: memberRows }] = await Promise.all([
    admin
      .from('chapter_honors')
      .select('category, member_id, display_name, year_label, title, sort_order')
      .eq('id', id)
      .single(),
    admin
      .from('members')
      .select('id, first_name, last_name')
      .order('last_name', { ascending: true }),
  ])
  if (!honor) notFound()

  const members = (memberRows ?? []).map(m => ({
    id: m.id,
    label: `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || '(unnamed)',
  }))

  const { success, error } = await searchParams
  const updateThis = updateChapterHonor.bind(null, id)
  const deleteThis = deleteChapterHonor.bind(null, id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/honors"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            â† Back to Honor Rolls
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Honor Roll Entry</h1>
          <p className="text-gray-500 text-sm mt-1">{honor.display_name}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'created' ? 'Entry added.' : 'Changes saved.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <HonorForm action={updateThis} honor={honor} members={members} />
        </div>

        <div className="bg-kp-surface border border-red-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-1">Remove Entry</h3>
          <p className="text-gray-500 text-xs mb-4">
            Permanently deletes this entry from the Records &amp; Recognition section. This cannot be undone.
          </p>
          <DeleteHonorButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}
