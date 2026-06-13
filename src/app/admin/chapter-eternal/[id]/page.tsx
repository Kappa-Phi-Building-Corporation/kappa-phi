import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateEternalEntry } from '../actions'
import EternalForm from '../EternalForm'

export const metadata = { title: 'Edit Memorial Entry' }

export default async function EditEternalPage({
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

  const { data: member } = await admin
    .from('members')
    .select('first_name, last_name, title, badge_number, pledge_class, initiation_date, passing_date, memorial_link_url, photo_url, hide_entry')
    .eq('id', id)
    .single()
  if (!member) notFound()

  const { success, error } = await searchParams
  const updateThis = updateEternalEntry.bind(null, id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/chapter-eternal"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Memorial
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Memorial Entry</h1>
          <p className="text-gray-500 text-sm mt-1">
            {[member.title, member.first_name, member.last_name].filter(Boolean).join(' ')}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'created' ? 'Entry added to memorial.' : 'Changes saved.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <EternalForm mode="edit" action={updateThis} member={member} />
        </div>

        <div className="bg-kp-card border border-kp-border rounded-xl px-5 py-4 text-xs text-gray-500">
          To permanently remove someone from the memorial, uncheck &ldquo;Show on public memorial page&rdquo; above
          and mark their member record as not deceased in{' '}
          <Link href="/admin/members" className="text-kp-gold hover:underline">Member Records</Link>.
        </div>
      </div>
    </div>
  )
}
