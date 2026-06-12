import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Honor Rolls' }

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'student_knight', label: 'Student Knights' },
  { value: 'highest_gpa', label: 'Highest Initiate GPA' },
  { value: 'ifc_rep', label: 'IFC Representatives' },
  { value: 'st_pats_board', label: "St. Pat's Board" },
  { value: 'chapter_president', label: 'Chapter Presidents' },
]

export default async function AdminHonorsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { data: honors } = await admin
    .from('chapter_honors')
    .select('id, category, display_name, year_label, title, sort_order, member_id')
    .order('sort_order', { ascending: true })

  const rows = honors ?? []
  const { success, error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-4xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              â† Admin Dashboard
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">Honor Rolls</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {rows.length} entr{rows.length !== 1 ? 'ies' : 'y'} across the About page&apos;s Records &amp; Recognition section
            </p>
          </div>
          <Link
            href="/admin/honors/new"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            + Add Entry
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
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

        {CATEGORIES.map(cat => {
          const items = rows.filter(r => r.category === cat.value)
          return (
            <div key={cat.value}>
              <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">
                {cat.label} <span className="text-gray-600 normal-case font-normal">({items.length})</span>
              </div>
              <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
                {items.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500 text-sm">No entries yet.</div>
                ) : (
                  <div className="divide-y divide-kp-border">
                    {items.map(r => (
                      <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                        <span className="text-gray-500 text-xs font-mono w-12 shrink-0">{r.year_label ?? 'â€”'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-semibold truncate">{r.display_name}</div>
                          {r.title && <div className="text-gray-500 text-xs mt-0.5 truncate">{r.title}</div>}
                        </div>
                        {r.member_id && <span className="text-kp-gold text-xs shrink-0">linked</span>}
                        <Link
                          href={`/admin/honors/${r.id}`}
                          className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                          Edit
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
