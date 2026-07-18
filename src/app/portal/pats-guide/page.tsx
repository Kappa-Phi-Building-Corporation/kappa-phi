import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: "Booth's Guide to Pats" }

// Revalidate hourly; admin saves call revalidatePath('/portal/pats-guide') for on-demand bust
export const revalidate = 3600

// Shared markdown → styled-JSX mapping so every section renders consistently.
// Blockquotes double as warning callouts (matches the source doc's red-text warnings).
const markdownComponents: Components = {
  p: ({ children }) => <p className="text-gray-300 text-sm leading-relaxed mb-4">{children}</p>,
  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
  em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
  a: ({ href, children }) => {
    const external = href?.startsWith('http')
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="text-kp-gold hover:underline"
      >
        {children}
      </a>
    )
  },
  ul: ({ children }) => <ul className="list-disc list-outside pl-5 text-gray-300 text-sm leading-relaxed space-y-1.5 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-outside pl-5 text-gray-300 text-sm leading-relaxed space-y-1.5 mb-4">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-red-600 bg-red-950/30 rounded-r-lg px-4 py-3 mb-4 text-red-200 text-sm leading-relaxed [&>p]:mb-0 [&>p]:text-red-200">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4 rounded-xl border border-kp-border">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-kp-card">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left text-kp-gold text-xs font-bold uppercase tracking-wider px-3 py-2.5 border-b border-kp-border whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="text-gray-300 px-3 py-2.5 border-b border-kp-border/50 align-top">{children}</td>
  ),
  tr: ({ children }) => <tr className="even:bg-kp-card/30">{children}</tr>,
}

function Markdown({ body }: { body: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {body}
    </ReactMarkdown>
  )
}

export default async function PatsGuidePage() {
  const admin = createAdminClient()

  const { data: guide } = await admin
    .from('pats_guide')
    .select('title, intro, pdf_url, updated_at')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  const { data: sections } = await admin
    .from('pats_guide_sections')
    .select('slug, title, body')
    .order('sort_order', { ascending: true })

  const { data: photos } = await admin
    .from('pats_guide_photos')
    .select('id, photo_url, caption')
    .order('sort_order', { ascending: true })

  const rows = sections ?? []

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
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

      <div className="max-w-6xl mx-auto px-4 py-12">
        {rows.length === 0 ? (
          <div className="bg-kp-surface border border-kp-border rounded-2xl px-6 py-10 text-center text-gray-500 text-sm">
            The guide hasn&apos;t been published yet — check back soon.
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
            {/* Table of contents — sticky on desktop, horizontal scroller on mobile */}
            <nav className="mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-6">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 hidden lg:block">
                  On This Page
                </div>
                <div className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                  {rows.map(s => (
                    <a
                      key={s.slug}
                      href={`#${s.slug}`}
                      className="shrink-0 lg:shrink text-gray-400 hover:text-kp-gold text-sm px-3 py-1.5 lg:px-2 lg:py-1 rounded-lg lg:rounded border border-kp-border lg:border-0 whitespace-nowrap lg:whitespace-normal no-underline transition-colors"
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              </div>
            </nav>

            {/* Sections */}
            <div className="space-y-8 min-w-0">
              {rows.map(s => (
                <section key={s.slug} id={s.slug} className="scroll-mt-20 bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8">
                  <h2 className="text-kp-gold text-xl font-bold mb-4">{s.title}</h2>
                  <Markdown body={s.body} />
                </section>
              ))}

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
        )}
      </div>
    </div>
  )
}
