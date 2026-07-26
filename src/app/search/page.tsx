import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Search' }

type MemberResult = {
  id: string
  first_name: string | null
  last_name: string | null
  nickname: string | null
  badge_number: string | null
  pledge_class: string | null
}

type HonorResult = {
  id: string
  category: string
  display_name: string
  year_label: string | null
  title: string | null
}

type ProjectResult = {
  id: string
  name: string
  status: string
  description: string | null
}

const HONOR_CATEGORY_LABELS: Record<string, string> = {
  student_knight: 'Student Knight',
  highest_gpa: 'Highest Initiate GPA',
  ifc_rep: 'IFC Representative',
  st_pats_board: "St. Pat's Board",
  chapter_president: 'Chapter President',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: qRaw } = await searchParams
  const q = (qRaw ?? '').trim()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient()
  let canSearchMembers = false
  let isAdmin = false

  if (user) {
    const { data: profile } = await admin
      .from('profiles')
      .select('is_approved, role')
      .eq('id', user.id)
      .single()
    canSearchMembers = !!profile?.is_approved
    isAdmin = profile?.role === 'admin'
  }

  let members: MemberResult[] = []
  let honors: HonorResult[] = []
  let projects: ProjectResult[] = []

  if (q.length >= 2) {
    const like = `%${q}%`

    let memberQuery = admin
      .from('members')
      .select('id, first_name, last_name, nickname, badge_number, pledge_class')
      .not('badge_number', 'is', null)
      .or(`first_name.ilike.${like},last_name.ilike.${like},nickname.ilike.${like},badge_number.ilike.${like}`)
      .order('last_name')

    if (!isAdmin) memberQuery = memberQuery.or('hide_entry.is.null,hide_entry.eq.false')

    const [{ data: honorRows }, { data: projectRows }, memberRows] = await Promise.all([
      admin
        .from('chapter_honors')
        .select('id, category, display_name, year_label, title')
        .or(`display_name.ilike.${like},title.ilike.${like}`)
        .order('display_name'),
      admin
        .from('property_projects')
        .select('id, name, status, description')
        .eq('is_published', true)
        .or(`name.ilike.${like},description.ilike.${like}`)
        .order('name'),
      canSearchMembers ? memberQuery : Promise.resolve({ data: [] as MemberResult[] }),
    ])

    honors = (honorRows as HonorResult[] | null) ?? []
    projects = (projectRows as ProjectResult[] | null) ?? []
    members = (memberRows.data as MemberResult[] | null) ?? []
  }

  const totalResults = members.length + honors.length + projects.length
  const hasSearched = q.length >= 2

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Search</div>
          <h1 className="text-4xl font-black text-white mb-6">
            {canSearchMembers ? 'Search Members, Honors & Property' : 'Search Honors & Property'}
          </h1>
          <form method="get" className="flex gap-3">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={canSearchMembers ? 'Search by name, badge number, honor, or project…' : 'Search honor rolls or property projects…'}
              autoFocus
              className="flex-1 bg-kp-dark border border-kp-border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors"
            />
            <button
              type="submit"
              className="bg-kp-gold text-black font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shrink-0"
            >
              Search
            </button>
          </form>
          {!canSearchMembers && (
            <p className="text-gray-400 text-xs mt-3">
              <Link href="/login" className="text-kp-gold hover:underline">Log in</Link> as an approved alumni member to also search the member directory.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {!hasSearched && (
          <p className="text-gray-500 text-sm">Enter at least 2 characters to search.</p>
        )}

        {hasSearched && totalResults === 0 && (
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-12 text-center text-gray-500">
            No results for &ldquo;{q}&rdquo;.
          </div>
        )}

        {members.length > 0 && (
          <section>
            <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">
              Members <span className="text-gray-500 font-normal normal-case">({members.length})</span>
            </h2>
            <div className="bg-kp-surface border border-kp-border rounded-2xl divide-y divide-kp-border overflow-hidden">
              {members.map(m => (
                <Link
                  key={m.id}
                  href={`/alumni/tree?focus=${m.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-kp-card/40 transition-colors no-underline"
                >
                  <div>
                    <div className="text-white text-sm font-semibold">
                      {[m.first_name, m.nickname ? `"${m.nickname}"` : null, m.last_name].filter(Boolean).join(' ')}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {[m.pledge_class, m.badge_number ? `Badge #${m.badge_number}` : null].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">View in Family Tree →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {honors.length > 0 && (
          <section>
            <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">
              Honor Roll <span className="text-gray-500 font-normal normal-case">({honors.length})</span>
            </h2>
            <div className="bg-kp-surface border border-kp-border rounded-2xl divide-y divide-kp-border overflow-hidden">
              {honors.map(h => (
                <Link
                  key={h.id}
                  href="/about"
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-kp-card/40 transition-colors no-underline"
                >
                  <div>
                    <div className="text-white text-sm font-semibold">{h.display_name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {[HONOR_CATEGORY_LABELS[h.category] ?? h.category, h.title, h.year_label].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">View on About page →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">
              Property History <span className="text-gray-500 font-normal normal-case">({projects.length})</span>
            </h2>
            <div className="bg-kp-surface border border-kp-border rounded-2xl divide-y divide-kp-border overflow-hidden">
              {projects.map(p => (
                <Link
                  key={p.id}
                  href="/property"
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-kp-card/40 transition-colors no-underline"
                >
                  <div className="min-w-0">
                    <div className="text-white text-sm font-semibold">{p.name}</div>
                    {p.description && (
                      <div className="text-gray-500 text-xs mt-0.5 truncate">{p.description}</div>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">View on Property page →</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
