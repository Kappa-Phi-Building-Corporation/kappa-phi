import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteContent } from '@/lib/siteContent'
import { ImageLightboxThumbnail } from '@/components/ImageLightbox'
import WaysToGive from '@/components/WaysToGive'

export const metadata = {
  title: 'Capital Campaign — Renovating the Shelter',
  description:
    'Help renovate the Epsilon Nu Shelter at Missouri S&T. See the design renderings, giving levels, and ways to give.',
  openGraph: {
    title: 'Capital Campaign — Renovating the Shelter',
    description:
      'Help renovate the Epsilon Nu Shelter at Missouri S&T. See the design renderings, giving levels, and ways to give.',
    images: ['/images/campaign/living-room.jpg'],
  },
}

// Cached for 1 hour; revalidated on demand when admin saves campaign settings or giving levels
export const revalidate = 3600

type Rendering = { src: string; alt: string; caption: string }

type Space = {
  title: string
  blurb: string
  renderings: Rendering[]
}

// The renderings come from the architect's design package and don't change
// with the campaign's text, so they live in code rather than the database.
const SPACES: Space[] = [
  {
    title: 'Multi-Purpose Room',
    blurb:
      'The lower level becomes a true gathering space: a full kitchen, a large video wall for game days and chapter meetings, and long tables that seat the whole chapter for meals, study, and events.',
    renderings: [
      {
        src: '/images/campaign/multipurpose-room-option-1.jpg',
        alt: 'Rendering of the renovated multi-purpose room with a purple accent wall, video wall, kitchen, and long wood tables (Option 1)',
        caption: 'Multi-Purpose Room — Design Option 1',
      },
      {
        src: '/images/campaign/multipurpose-room-option-2.jpg',
        alt: 'Rendering of the renovated multi-purpose room with wood-look flooring and a stone veneer wall (Option 2)',
        caption: 'Multi-Purpose Room — Design Option 2',
      },
    ],
  },
  {
    title: 'Custom Crest Flooring',
    blurb:
      'The fraternity crest inlaid in the floor of the multi-purpose room, so every brother who walks in stands on the chapter’s heritage.',
    renderings: [
      {
        src: '/images/campaign/crest-flooring-option-1.jpg',
        alt: 'Rendering of the multi-purpose room with a custom crest inlaid in the floor (Option 1)',
        caption: 'Custom Crest Flooring — Design Option 1',
      },
      {
        src: '/images/campaign/crest-flooring-option-2.jpg',
        alt: 'Rendering of the multi-purpose room with a full-color custom crest inlaid in the floor (Option 2)',
        caption: 'Custom Crest Flooring — Design Option 2',
      },
    ],
  },
  {
    title: 'Living Room',
    blurb:
      'A warmer, updated living room built around a stone fireplace, new flooring, and space for the chapter’s history on the walls.',
    renderings: [
      {
        src: '/images/campaign/living-room.jpg',
        alt: 'Rendering of the renovated living room with a stone fireplace, wood-look flooring, and framed chapter photos',
        caption: 'Living Room',
      },
    ],
  },
]

const SCOPE = [
  'New flooring and wall base throughout the lower level, corridors, and stairs',
  'Updated lighting in the renovated spaces',
  'Redesigned multi-purpose room with kitchen and audio/video wall',
  'Renovated living room',
  'Updated meeting room',
  'Refreshed restrooms and showers',
]

function toNumber(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default async function CampaignPage() {
  const admin = createAdminClient()

  const [content, { data: levelRows }] = await Promise.all([
    getSiteContent(),
    admin
      .from('campaign_giving_levels')
      .select('id, name, amount_label, description')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
  ])

  if (content.campaign_enabled !== 'true') notFound()

  const levels = levelRows ?? []
  const goal = toNumber(content.campaign_goal)
  const raised = toNumber(content.campaign_raised)
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0

  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Hero */}
      <div
        className="border-b border-kp-border relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/campaign/living-room.jpg')",
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
            <a
              href="#renderings"
              className="inline-block border-2 border-white/40 text-white font-bold px-6 py-3 rounded-xl text-sm no-underline hover:border-kp-gold hover:text-kp-gold transition-colors"
            >
              See the Renderings
            </a>
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
              <div className="text-kp-gold text-2xl font-black tabular-nums">{percent}%</div>
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
          </section>
        )}

        {/* Renderings */}
        <section id="renderings" className="scroll-mt-24 space-y-10">
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">The Vision</div>
            <h2 className="text-white font-black text-3xl">What We&apos;re Building</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Select any image to view it full size.
            </p>
          </div>

          {SPACES.map(space => {
            const single = space.renderings.length === 1
            const heading = (
              <div>
                <h3 className="text-white font-bold text-xl">{space.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mt-1 max-w-3xl">{space.blurb}</p>
              </div>
            )
            return (
              <div
                key={space.title}
                className={single ? 'grid grid-cols-1 md:grid-cols-5 gap-6 items-center' : 'space-y-4'}
              >
                {!single && heading}
                <div className={single ? 'md:col-span-3' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                  {space.renderings.map(r => (
                    <figure key={r.src} className="space-y-2">
                      <ImageLightboxThumbnail
                        src={r.src}
                        alt={r.alt}
                        caption={r.caption}
                        fit="cover"
                        sizes={single ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 50vw'}
                        className="relative block w-full aspect-video rounded-xl overflow-hidden border border-kp-border bg-kp-card"
                      />
                      <figcaption className="text-gray-500 text-xs">{r.caption}</figcaption>
                    </figure>
                  ))}
                </div>
                {single && <div className="md:col-span-2">{heading}</div>}
              </div>
            )
          })}

          <p className="text-gray-500 text-xs">
            Renderings by Chiodini Architects. These are design concepts; final finishes and layouts may vary.
          </p>
        </section>

        {/* Scope */}
        <section className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8">
          <h2 className="text-white font-black text-2xl mb-5">What Your Gift Funds</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {SCOPE.map(item => (
              <li key={item} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-kp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Giving levels */}
        {levels.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Giving Levels</div>
              <h2 className="text-white font-black text-3xl">Choose Your Level of Impact</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {levels.map(l => (
                <div key={l.id} className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden flex flex-col">
                  <div className="bg-kp-blue px-5 py-4">
                    <div className="text-kp-gold text-2xl font-black tabular-nums">{l.amount_label}</div>
                    <div className="text-white font-bold text-sm mt-0.5">{l.name}</div>
                  </div>
                  {l.description && (
                    <p className="p-5 text-gray-300 text-sm leading-relaxed">{l.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Give */}
        <section id="give" className="scroll-mt-24 space-y-6">
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Make Your Gift</div>
            <h2 className="text-white font-black text-3xl">Be Part of the Renovation</h2>
            <p className="text-gray-300 text-sm leading-relaxed mt-2 max-w-2xl">
              Please note &ldquo;Capital Campaign&rdquo; with your gift so it&apos;s directed to the renovation.
            </p>
          </div>

          <WaysToGive checkMemo="Write “Capital Campaign” on the memo line." />

          <div className="bg-kp-blue-dark rounded-2xl p-6 md:p-8">
            <p className="text-blue-100 text-sm leading-relaxed">
              Interested in a larger gift, a multi-year pledge, or naming and recognition opportunities? Contact
              Adam Rice, VP of Fundraising, at{' '}
              <a href="mailto:fundraising@kappa-phi.org" className="text-kp-gold">fundraising@kappa-phi.org</a>{' '}
              or 573-514-3016.
            </p>
            <p className="text-blue-300 text-xs mt-4">
              Donations to the Kappa Phi Building Corporation are <em>not</em> tax deductible.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
