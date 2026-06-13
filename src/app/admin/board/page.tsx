import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Board Members' }

export default async function AdminBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { data: members } = await admin
    .from('board_members')
    .select('id, name, role, category, is_active, photo_url, sort_order')
    .order('category', { ascending: true })  // 'director' < 'officer' alphabetically — we'll sort in JS
    .order('sort_order', { ascending: true })

  const rows = members ?? []
  const officers = rows.filter(m => m.category === 'officer')
  const directors = rows.filter(m => m.category === 'director')

  const { error } = await searchParams

  function MemberRow({ m }: { m: typeof rows[0] }) {
    return (
      <div className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-kp-card shrink-0">
          {m.photo_url ? (
            <img src={m.photo_url} alt="" className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-bold">
              {(m.name ?? '?').replace(/^Dr\.\s+/, '').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold">{m.name}</div>
          <div className="text-gray-500 text-xs mt-0.5">
            {m.role}
            {!m.is_active && <span className="ml-2 text-gray-600">(hidden)</span>}
          </div>
        </div>
        <Link
          href={`/admin/board/${m.id}`}
          className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
          Edit
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-4xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              ← Admin Dashboard
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Board Members</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {officers.length} officer{officers.length !== 1 ? 's' : ''} Â· {directors.length} director{directors.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/admin/board/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + Add Member
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Officers */}
        <div>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Officers</div>
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            {officers.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">No officers added yet.</div>
            ) : (
              <div className="divide-y divide-kp-border">
                {officers.map(m => <MemberRow key={m.id} m={m} />)}
              </div>
            )}
          </div>
        </div>

        {/* Directors */}
        <div>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Directors</div>
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            {directors.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">No directors added yet.</div>
            ) : (
              <div className="divide-y divide-kp-border">
                {directors.map(m => <MemberRow key={m.id} m={m} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
