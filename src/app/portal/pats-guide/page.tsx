import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: "Booth's Guide to Pats" }

// Revalidate hourly; admin saves call revalidatePath('/portal/pats-guide') for on-demand bust
export const revalidate = 3600

// Body content uses a light "## Heading" convention (see admin editor) —
// no markdown library, matches the plain-paragraph style used elsewhere on the site.
function renderBody(body: string) {
  return body.split('\n\n').filter(Boolean).map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="text-kp-gold text-lg font-bold mt-8 mb-2 first:mt-0">
          {block.slice(3).trim()}
        </h2>
      )
    }
    return (
      <p key={i} className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4">
        {block}
      </p>
    )
  })
}

export default async function PatsGuidePage() {
  const admin = createAdminClient()

  const { data: guide } = await admin
    .from('pats_guide')
    .select('title, intro, body, pdf_url, updated_at')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  const { data: photos } = await admin
    .from('pats_guide_photos')
    .select('id, photo_url, caption')
    .order('sort_order', { ascending: true })

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link href="/portal" className="text-gray-400 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Chapter Portal
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Members & Chapter</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            {guide?.title ?? "Booth's Guide to Pats"}
          </h1>
          {guide?.intro && (
            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">{guide.intro}</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        {!guide?.body ? (
          <div className="bg-kp-surface border border-kp-border rounded-2xl px-6 py-10 text-center text-gray-500 text-sm">
            The guide hasn&apos;t been published yet — check back soon.
          </div>
        ) : (
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8">
            {renderBody(guide.body)}
          </div>
        )}

        {photos && photos.length > 0 && (
          <div>
            <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map(p => (
                <figure key={p.id} className="rounded-xl overflow-hidden bg-kp-card border border-kp-border">
                  <img src={p.photo_url} alt={p.caption ?? ''} className="w-full aspect-square object-cover" />
                  {p.caption && (
                    <figcaption className="text-gray-500 text-xs px-2 py-1.5 truncate">{p.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-kp-border text-xs text-gray-600">
          {guide?.pdf_url && (
            <a href={guide.pdf_url} target="_blank" rel="noopener noreferrer" className="text-kp-gold hover:underline">
              ↗ Original PDF version
            </a>
          )}
          {guide?.updated_at && (
            <span>
              Last updated {new Date(guide.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
