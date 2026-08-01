import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Login Log — Admin' }

type LoginRow = {
  id: string
  user_id: string | null
  email: string
  name: string | null
  created_at: string
}

type VisitRow = {
  id: string
  user_id: string
  email: string
  name: string | null
  visit_date: string
  first_seen_at: string
  last_seen_at: string
  request_count: number
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export default async function LoginLogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (currentProfile?.role !== 'admin') redirect('/portal')

  const { q } = await searchParams

  let loginQuery = admin
    .from('login_log')
    .select('id, user_id, email, name, created_at')
    .order('created_at', { ascending: false })
    .limit(300)

  if (q) loginQuery = loginQuery.or(`email.ilike.%${q}%,name.ilike.%${q}%`)

  let visitQuery = admin
    .from('site_visits')
    .select('id, user_id, email, name, visit_date, first_seen_at, last_seen_at, request_count')
    .order('last_seen_at', { ascending: false })
    .limit(300)

  if (q) visitQuery = visitQuery.or(`email.ilike.%${q}%,name.ilike.%${q}%`)

  const [{ data: loginRowsRaw }, { data: visitRowsRaw }] = await Promise.all([loginQuery, visitQuery])
  const loginRows = (loginRowsRaw ?? []) as LoginRow[]
  const visitRows = (visitRowsRaw ?? []) as VisitRow[]

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Login Log</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Who has signed in, and who has actually been using the site since — a valid session cookie
            doesn&apos;t mean someone&apos;s still around.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <form method="get" className="flex gap-3">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search by name or email…"
            className="flex-1 bg-kp-surface border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
          />
          <button
            type="submit"
            className="bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity shrink-0"
          >
            Search
          </button>
        </form>

        <section>
          <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">
            Site Access <span className="text-gray-500 font-normal normal-case">— one row per user per day</span>
          </h2>
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            {visitRows.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No site access recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-kp-border">
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">First Seen</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Last Seen</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitRows.map(r => (
                      <tr key={r.id} className="border-b border-kp-border/50 last:border-0 hover:bg-kp-card/40 transition-colors">
                        <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">{r.visit_date}</td>
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{r.name ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-300">{r.email}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtTime(r.first_seen_at)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtTime(r.last_seen_at)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs tabular-nums">{r.request_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">
            Logins <span className="text-gray-500 font-normal normal-case">— discrete sign-in events</span>
          </h2>
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            {loginRows.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No sign-ins recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-kp-border">
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">When</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginRows.map(r => (
                      <tr key={r.id} className="border-b border-kp-border/50 last:border-0 hover:bg-kp-card/40 transition-colors">
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtDateTime(r.created_at)}</td>
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{r.name ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-300">{r.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <Link href="/admin" className="text-gray-500 text-sm hover:text-gray-300 transition-colors no-underline">
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  )
}
