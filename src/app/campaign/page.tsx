import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'qrcode'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteContent } from '@/lib/siteContent'
import { ImageLightboxThumbnail } from '@/components/ImageLightbox'
import { Markdown } from '@/components/Markdown'

export const metadata = {
  title: 'Capital Campaign — Renovating the Shelter',
  description:
    'Help renovate the Epsilon Nu Shelter at Missouri S&T. See the design renderings, giving societies, and how to give.',
  openGraph: {
    title: 'Capital Campaign — Renovating the Shelter',
    description:
      'Help renovate the Epsilon Nu Shelter at Missouri S&T. See the design renderings, giving societies, and how to give.',
    images: ['/images/campaign/living-room.jpg'],
  },
}

// Cached for 1 hour; revalidated on demand when admin saves campaign
// settings, sections/photos, or giving levels.
export const revalidate = 3600

const DEFAULT_HERO = '/images/campaign/living-room.jpg'

function toNumber(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

// A friendly label for the give-online link, e.g. "dtdepsilonnu.causevox.com".
function urlLabel(url: string): string {
  try {
    const u = new URL(url)
    return `${u.hostname}${u.pathname}`.replace(/\/$/, '')
  } catch {
    return url
  }
}

export default async function CampaignPage() {
  const admin = createAdminClient()

  const [content, { data: levelRows }, { data: donorRows }, { data: sectionRows }, { data: photoRows }] = await Promise.all([
    getSiteContent(),
    admin
      .from('campaign_giving_levels')
      .select('id, name, amount_label, description')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    // Queried separately from the levels above so that if the donors column
    // doesn't exist yet (migration not run), only donor names are missing —
    // the levels themselves still load.
    admin.from('campaign_giving_levels').select('id, donors'),
    admin
      .from('campaign_sections')
      .select('id, title, body')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    admin
      .from('campaign_section_photos')
      .select('id, section_id, photo_url, caption')
      .order('sort_order', { ascending: true }),
  ])

  if (content.campaign_enabled !== 'true') notFound()

  const donorsByLevel = new Map(
    (donorRows ?? []).map(r => [
      r.id,
      ((r.donors as string | null) ?? '').split('\n').map(n => n.trim()).filter(Boolean),
    ]),
  )
  const levels = (levelRows ?? []).map(l => ({ ...l, donors: donorsByLevel.get(l.id) ?? [] }))

  const photosBySection = new Map<string, { id: string; photo_url: string; caption: string | null }[]>()
  for (const p of photoRows ?? []) {
    if (!photosBySection.has(p.section_id)) photosBySection.set(p.section_id, [])
    photosBySection.get(p.section_id)!.push(p)
  }
  const sections = (sectionRows ?? []).map(s => ({ ...s, photos: photosBySection.get(s.id) ?? [] }))

  const goal = toNumber(content.campaign_goal)
  const raised = toNumber(content.campaign_raised)
  const donorCount = toNumber(content.campaign_donors)
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0

  const giftFunds = content.campaign_gift_funds.split('\n').map(s => s.trim()).filter(Boolean)

  const giveUrl = content.campaign_give_url
  const giveLabel = urlLabel(giveUrl)
  const qrDataUrl = await QRCode.toDataURL(giveUrl, { margin: 1, width: 400 })

  const heroImage = content.campaign_hero_image || DEFAULT_HERO

  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Hero */}
      <div
        className="border-b border-kp-border relative overflow-hidden"
        style={{
          backgroundImage: `url('${heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-kp-dark/85" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Capital Campaign</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 max-w-3xl">{content.campaign_headline}</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">{content.campaign_intro}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#give"
              className="inline-block bg-kp-gold text-black font-bold px-6 py-3 rounded-xl text-sm no-underline hover:opacity-90 transition-opacity"
            >
              Give Now
            </a>
            {sections.length > 0 && (
              <a
                href="#renderings"
                className="inline-block border-2 border-white/40 text-white font-bold px-6 py-3 rounded-xl text-sm no-underline hover:border-kp-gold hover:text-kp-gold transition-colors"
              >
                See the Renderings
              </a>
            )}
            <Link
              href="/newsletters"
              className="inline-block border-2 border-white/40 text-white font-bold px-6 py-3 rounded-xl text-sm no-underline hover:border-kp-gold hover:text-kp-gold transition-colors"
            >
              See the Newsletters
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Progress */}
        {goal > 0 && (
          <section
            aria-label="Campaign progress"
            className="bg-kp-surface border border-kp-gold/30 rounded-2xl p-6 md:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-4">
              <div>
                <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Campaign Progress</div>
                <div className="text-white text-3xl font-black tabular-nums">
                  {usd(raised)} <span className="text-gray-500 text-lg font-semibold">of {usd(goal)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-kp-gold text-2xl font-black tabular-nums">{percent}%</div>
                {donorCount > 0 && (
                  <div className="text-gray-400 text-xs tabular-nums">{donorCount} donors</div>
                )}
              </div>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label={`${percent}% of the campaign goal raised`}
              className="h-3 rounded-full bg-kp-card overflow-hidden"
            >
              <div className="h-full rounded-full bg-kp-gold" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-gray-500 text-xs mt-3">
              Thank you, generous donors! As of {content.campaign_as_of}.
            </p>
          </section>
        )}

        {/* Renderings */}
        {sections.length > 0 && (
          <section id="renderings" className="scroll-mt-24 space-y-10">
            <div>
              <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">The Vision</div>
              <h2 className="text-white font-black text-3xl">What We&apos;re Building</h2>
              <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                Select any image to view it full size.
              </p>
            </div>

            {sections.map(section => {
              const single = section.photos.length === 1
              const heading = (
                <div>
                  <h3 className="text-white font-bold text-xl">{section.title}</h3>
                  {section.body && (
                    <Markdown body={section.body} className="text-gray-300 text-sm leading-relaxed mt-1 max-w-3xl" />
                  )}
                </div>
              )
              return (
                <div
                  key={section.id}
                  className={single ? 'grid grid-cols-1 md:grid-cols-5 gap-6 items-center' : 'space-y-4'}
                >
                  {!single && heading}
                  {section.photos.length > 0 && (
                    <div className={single ? 'md:col-span-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
                      {section.photos.map(p => (
                        <figure key={p.id} className="space-y-2">
                          <ImageLightboxThumbnail
                            src={p.photo_url}
                            alt={p.caption ?? section.title}
                            caption={p.caption ?? section.title}
                            fit="cover"
                            sizes={single ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 33vw'}
                            className="relative block w-full aspect-video rounded-xl overflow-hidden border border-kp-border bg-kp-card"
                          />
                          {p.caption && <figcaption className="text-gray-500 text-xs">{p.caption}</figcaption>}
                        </figure>
                      ))}
                    </div>
                  )}
                  {single && <div className="md:col-span-2">{heading}</div>}
                </div>
              )
            })}

            {content.campaign_renderings_credit && (
              <p className="text-gray-500 text-xs">{content.campaign_renderings_credit}</p>
            )}
          </section>
        )}

        {/* Scope */}
        {giftFunds.length > 0 && (
          <section className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8">
            <h2 className="text-white font-black text-2xl mb-5">What Your Gift Funds</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {giftFunds.map(item => (
                <li key={item} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-kp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Giving levels */}
        {levels.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Giving Societies</div>
              <h2 className="text-white font-black text-3xl">Giving Levels &amp; Donor Recognition</h2>
              <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                Donors of $1,000 and above are recognized in giving societies in campaign publications, and
                pledges of $2,500 and above are displayed on a permanent donor plaque at the house.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
              {levels.map(l => (
                <div key={l.id} className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
                  <div className="bg-kp-blue px-5 py-4">
                    <div className="text-white font-bold">{l.name}</div>
                    <div className="text-kp-gold text-sm font-bold tabular-nums mt-0.5">{l.amount_label}</div>
                  </div>
                  <div className="p-5 space-y-3">
                    {l.donors.length > 0 ? (
                      <ul className="space-y-1 text-gray-200 text-sm">
                        {l.donors.map((d, i) => <li key={`${i}-${d}`}>{d}</li>)}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm italic">Your name could be here…</p>
                    )}
                    {l.description && (
                      <p className="text-gray-500 text-xs leading-relaxed pt-3 border-t border-kp-border">{l.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-4">
              Donor list as of {content.campaign_as_of}. To request a change to how you&apos;re recognized, use the
              contact below.
            </p>
          </section>
        )}

        {/* Give */}
        <section id="give" className="scroll-mt-24 space-y-6">
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Make Your Gift</div>
            <h2 className="text-white font-black text-3xl">Be Part of the Renovation</h2>
          </div>

          <div className="bg-kp-surface border border-kp-gold/30 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center">
              <div className="bg-kp-blue p-6 md:p-8 flex flex-col items-center gap-3">
                <div className="text-kp-gold text-xs font-bold uppercase tracking-widest">Scan to give</div>
                <a
                  href={giveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Give online at ${giveLabel}`}
                  className="block rounded-2xl bg-white p-2 ring-4 ring-kp-gold"
                >
                  <Image
                    src={qrDataUrl}
                    alt={`QR code linking to ${giveLabel}`}
                    width={200}
                    height={200}
                    unoptimized
                    className="w-44 h-44 sm:w-52 sm:h-52"
                  />
                </a>
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <p className="text-gray-200 leading-relaxed">
                  {content.campaign_give_blurb}
                  {' '}Scan the QR code with your phone, or visit{' '}
                  <a href={giveUrl} target="_blank" rel="noopener noreferrer" className="text-kp-gold font-bold">
                    {giveLabel}
                  </a>.
                </p>
                <a
                  href={giveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-kp-gold text-black font-bold px-6 py-3 rounded-xl text-sm no-underline hover:opacity-90 transition-opacity"
                >
                  Give Online
                </a>
              </div>
            </div>
          </div>

          <div className="bg-kp-blue-dark rounded-2xl p-6 md:p-8">
            <p className="text-blue-100 text-sm leading-relaxed">
              Interested in a larger gift, a multi-year pledge, or naming and recognition opportunities? Contact{' '}
              {content.fundraising_contact_name} at{' '}
              <a href={`mailto:${content.fundraising_contact_email}`} className="text-kp-gold">{content.fundraising_contact_email}</a>
              {content.fundraising_contact_phone ? ` or ${content.fundraising_contact_phone}` : ''}.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
