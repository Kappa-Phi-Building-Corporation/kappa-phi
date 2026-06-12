import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const stats = [
  { number: '500+', label: 'Brothers Initiated' },
  { number: '440+', label: 'Living Alumni' },
  { number: '60+', label: 'Years of Brotherhood' },
  { number: '3×', label: 'Hugh Shields Award' },
]

const banners = [
  {
    title: 'Modern',
    body: 'Since our first expansion in 1999, the KPBC has made many substantial improvements to the Chapter House, keeping Epsilon Nu among the most competitive fraternities on the MS&T campus.',
  },
  {
    title: 'Alumni',
    body: 'Kappa Phi and Epsilon Nu can only succeed with active alumni participation. We achieve this through frequent communication, alumni contacts, announcements, and event promotion.',
  },
  {
    title: 'Proactive',
    body: 'Kappa Phi employs proactive planning & leadership to develop property assets, promoting a conducive atmosphere for undergraduate living, learning, and brotherhood.',
  },
  {
    title: 'Donations',
    body: 'We encourage you to give back through donations to the Kappa Phi Building Corporation or our tax-deductible Byron N. Vermillion Memorial Scholarship Fund.',
  },
]

const values = [
  'Maintain financial excellence through conservative practical planning and maximizing value.',
  'Provide state-of-the-art housing and a safe, modern learning environment.',
  "Develop the housing corporation's property assets to foster undergraduate excellence through proactive planning and leadership.",
  'Develop and maintain an outstanding relationship with alumni, undergraduates, and the community.',
  'Encourage active alumni participation through frequent and effective communication.',
]

const gallery = [
  { src: '/images/bonfire.jpg', alt: 'Brotherhood bonfire' },
  { src: '/images/stpats-group.jpg', alt: 'St. Pats celebration' },
  { src: '/images/hugh-shields.jpg', alt: 'Hugh Shields Award' },
  { src: '/images/stpats-parade.jpg', alt: 'St. Pats parade' },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative min-h-[520px] md:min-h-[620px] flex items-center overflow-hidden bg-kp-dark"
        style={{
          backgroundImage: "url('/images/hero-bw.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-kp-dark/95 via-kp-dark/75 to-kp-crimson-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-kp-dark/60 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 w-full py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-kp-blue/80 backdrop-blur text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-kp-gold rounded-full" />
              Epsilon Nu · Delta Tau Delta · Missouri S&T
            </div>

            <div className="flex items-center gap-5 mb-5">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-lg shadow-black/30 p-2 flex items-center justify-center shrink-0">
                <img src="/images/coat-of-arms.png" alt="Kappa Phi coat of arms" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05]">
                Kappa Phi<br />
                <span className="text-kp-gold">Building Corp.</span>
              </h1>
            </div>

            <p className="text-gray-200 text-xl mb-8 leading-relaxed max-w-lg">
              Supporting brotherhood, housing, and alumni engagement at Missouri University of Science &amp; Technology since 1963.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={isLoggedIn ? '/alumni' : '/login'}
                className="bg-kp-gold text-black font-bold px-7 py-3.5 rounded-xl no-underline hover:opacity-90 transition-opacity text-sm"
              >
                {isLoggedIn ? 'Alumni Information' : 'Alumni Login'}
              </Link>
              <Link
                href="/donations"
                className="border-2 border-white/50 text-white font-bold px-7 py-3.5 rounded-xl no-underline hover:border-kp-gold hover:text-kp-gold transition-colors text-sm"
              >
                Support the Shelter
              </Link>
              <Link
                href="/about"
                className="text-gray-300 font-medium px-4 py-3.5 no-underline hover:text-kp-gold transition-colors text-sm"
              >
                Our History →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-kp-blue-dark border-y-2 border-kp-gold py-7">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-kp-gold text-3xl md:text-4xl font-black">{s.number}</div>
                <div className="text-blue-100 text-sm mt-1 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="bg-kp-surface border-b border-kp-border py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block text-kp-gold text-xs font-bold uppercase tracking-widest mb-4 border-b border-kp-gold pb-1">
              Our Mission
            </div>
            <p className="text-white text-xl md:text-2xl leading-relaxed font-light">
              Ensure the Epsilon Nu chapter of Delta Tau Delta Fraternity is the recognized leader
              among social fraternities on the Missouri University of Science &amp; Technology campus
              through the abiding maintenance and upkeep of the Shelter.
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature Banners ── */}
      <section className="bg-kp-dark border-b border-kp-border py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">What We Do</div>
            <h2 className="text-white text-3xl font-bold">Our Pillars of Excellence</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {banners.map(b => (
              <div
                key={b.title}
                className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden hover:border-kp-blue transition-colors group"
              >
                <div className="bg-kp-blue px-5 py-3.5">
                  <h3 className="text-kp-gold font-bold tracking-wide">{b.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-300 text-sm leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <section className="bg-kp-crimson-dark border-b border-kp-border py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">The Brotherhood</div>
            <h2 className="text-white text-3xl font-bold">Life at Epsilon Nu</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map(img => (
              <div
                key={img.src}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-kp-card"
                style={{
                  backgroundImage: `url('${img.src}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                role="img"
                aria-label={img.alt}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Values + CTA ── */}
      <section className="bg-kp-surface border-b border-kp-border py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Values */}
            <div>
              <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">
                Kappa Phi&apos;s Values
              </div>
              <ul className="space-y-4">
                {values.map((v, i) => (
                  <li key={i} className="flex gap-3 text-gray-200 text-sm leading-relaxed">
                    <span className="text-kp-gold mt-0.5 shrink-0">◆</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Donate CTA */}
            <div className="bg-kp-blue rounded-2xl p-8 text-center">
              <div className="text-kp-gold text-4xl font-black mb-1">Give Back</div>
              <div className="text-blue-100 text-lg font-light mb-6">
                Support the next generation of Delts
              </div>
              <p className="text-blue-200 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                Your generosity keeps the Shelter strong and helps fund the Byron N. Vermillion
                Memorial Scholarship for deserving brothers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/donations"
                  className="bg-kp-gold text-black font-bold px-7 py-3 rounded-xl no-underline hover:opacity-90 transition-opacity text-sm"
                >
                  Make a Donation
                </Link>
                <Link
                  href={isLoggedIn ? '/alumni' : '/login'}
                  className="border border-white/40 text-white font-medium px-7 py-3 rounded-xl no-underline hover:border-kp-gold hover:text-kp-gold transition-colors text-sm"
                >
                  {isLoggedIn ? 'Alumni Information' : 'Alumni Login'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
