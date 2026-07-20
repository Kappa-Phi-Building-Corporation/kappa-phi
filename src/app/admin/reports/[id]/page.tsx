import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getReport } from '../reportDefinitions'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const report = getReport(id)
  return { title: report ? report.title : 'Report' }
}

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const report = getReport(id)
  if (!report) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/portal')

  const rows = await report.fetchRows(admin)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-6xl mx-auto px-4 py-10 flex items-end justify-between gap-4">
          <div>
            <Link href="/admin/reports" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
              ← Member Reports
            </Link>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-4xl font-black text-white">{report.title}</h1>
            <p className="text-gray-400 mt-2 text-sm">
              {report.description} · {rows.length} row{rows.length !== 1 ? 's' : ''}
            </p>
          </div>
          <a
            href={`/admin/reports/${report.id}/export`}
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline"
          >
            Export to CSV
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-kp-border">
                  {report.columns.map(c => (
                    <th key={c.key} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={report.columns.length} className="px-4 py-12 text-center text-gray-500 italic">
                      No rows match this report.
                    </td>
                  </tr>
                )}
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-kp-border hover:bg-kp-card/50 transition-colors">
                    {report.columns.map(c => (
                      <td key={c.key} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        {row[c.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
