import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { REPORTS } from './reportDefinitions'

export const metadata = { title: 'Member Reports' }

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Admin Dashboard
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Member Reports</h1>
          <p className="text-gray-400 mt-2 text-sm">Run a report, review it on screen, and export it to CSV for Excel.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {REPORTS.map(r => (
            <Link
              key={r.id}
              href={`/admin/reports/${r.id}`}
              className="bg-kp-surface border border-kp-border rounded-2xl p-6 no-underline hover:border-kp-gold/40 transition-colors"
            >
              <h2 className="text-white font-bold text-lg mb-1.5">{r.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{r.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
