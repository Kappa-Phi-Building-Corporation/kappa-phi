import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createChapterHonor } from '../actions'
import HonorForm from '../HonorForm'

export const metadata = { title: 'Add Honor Roll Entry' }

export default async function NewHonorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { data: memberRows } = await admin
    .from('members')
    .select('id, first_name, last_name')
    .order('last_name', { ascending: true })

  const members = (memberRows ?? []).map(m => ({
    id: m.id,
    label: `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || '(unnamed)',
  }))

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/honors"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Honor Rolls
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Add Honor Roll Entry</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <HonorForm action={createChapterHonor} members={members} />
        </div>
      </div>
    </div>
  )
}
