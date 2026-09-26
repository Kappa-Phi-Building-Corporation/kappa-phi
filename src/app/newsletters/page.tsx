import { createAdminClient } from '@/lib/supabase/admin'
import { formatBytes } from '@/lib/formatBytes'

export const metadata = {
  title: 'Newsletters',
  description: 'Delta Shelter News and other Epsilon Nu newsletters from the Kappa Phi Building Corporation.',
}

// Cached for 1 hour; revalidated on demand when admin saves a newsletter
export const revalidate = 3600

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function downloadName(title: string) {
  return (title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 80) || 'newsletter') + '.pdf'
}

const PdfIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

export default async function NewslettersPage() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('newsletters')
    .select('id, title, issue_date, description, file_url, file_size')
    .eq('is_published', true)
    .order('issue_date', { ascending: false })

  const newsletters = data ?? []

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Stay Connected</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Newsletters</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            News from the Shelter and the Kappa Phi Building Corporation, from campaign updates to chapter life.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {newsletters.length === 0 ? (
          <div className="bg-kp-surface border border-kp-border rounded-2xl px-6 py-10 text-center text-gray-500 text-sm">
            No newsletters have been posted yet. Check back soon.
          </div>
        ) : (
          <ul className="space-y-4">
            {newsletters.map(n => {
              const size = formatBytes(n.file_size)
              return (
                <li key={n.id} className="bg-kp-surface border border-kp-border rounded-2xl p-6 flex flex-wrap sm:flex-nowrap items-start gap-5">
                  <span className="w-12 h-12 rounded-xl bg-kp-blue text-kp-gold flex items-center justify-center shrink-0">
                    <PdfIcon />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">{fmtDate(n.issue_date)}</div>
                    <h2 className="text-white font-bold text-lg leading-snug">{n.title}</h2>
                    {n.description && <p className="text-gray-300 text-sm leading-relaxed mt-2">{n.description}</p>}
                    {size && <p className="text-gray-500 text-xs mt-2">PDF · {size}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0 w-full sm:w-auto">
                    <a
                      href={n.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-kp-gold text-black font-bold px-5 py-2.5 rounded-lg text-sm no-underline hover:opacity-90 transition-opacity"
                    >
                      Read
                    </a>
                    <a
                      href={`${n.file_url}?download=${encodeURIComponent(downloadName(n.title))}`}
                      className="inline-block border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold font-semibold px-5 py-2.5 rounded-lg text-sm no-underline transition-colors"
                    >
                      Download
                    </a>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
