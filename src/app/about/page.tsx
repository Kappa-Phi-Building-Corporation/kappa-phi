export const metadata = { title: 'About Kappa Phi' }

const chapters = [
  {
    title: 'The Founding',
    body: 'Kappa Phi Fraternity was founded on December 5, 1963, at the University of Missouri School of Mines and Metallurgy. The founders chose the letters Kappa Phi — the first two letters of Phi Kappa Sigma reversed — as their official name, with a founding philosophy that no member shall expect any pledge to do anything which that member cannot or will not do.',
  },
  {
    title: 'Delta Tau Delta',
    body: 'In early February of 1965, Kappa Phi decided to petition Delta Tau Delta Fraternity for colony status. On December 10, 1966, Kappa Phi Fraternity was initiated into Delta Tau Delta as Epsilon Nu Chapter — the 96th chapter — at Westminster College in Fulton, Missouri, with US Supreme Court Chief Justice Tom C. Clark in attendance.',
  },
  {
    title: 'Achievements',
    body: 'Epsilon Nu has consistently been among MS&T\'s academic leaders and has distinguished itself in numerous campus organizations. In 2000, the chapter received the Hugh Shields Award for Chapter Excellence — the highest award given to any Delta Tau Delta chapter — and has earned it three times total along with five Court of Honor awards.',
  },
]

const milestones = [
  { year: '1963', event: 'Kappa Phi Fraternity founded at MSM' },
  { year: '1964', event: 'First chapter house purchased on Vienna Road' },
  { year: '1966', event: 'Initiated into Delta Tau Delta as Epsilon Nu' },
  { year: '1986', event: '20th anniversary & mortgage burning ceremony' },
  { year: '1991', event: 'First Court of Honor Award received' },
  { year: '1999', event: 'Major chapter house expansion completed' },
  { year: '2000', event: 'First Hugh Shields Award for Chapter Excellence' },
  { year: '2016', event: '50th anniversary as Epsilon Nu Chapter' },
]

export default function AboutPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Page hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">History & Mission</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About Kappa Phi</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Over 60 years of brotherhood, excellence, and service at Missouri University of Science &amp; Technology.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Intro stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { n: '1963', l: 'Founded' },
            { n: '500+', l: 'Brothers Initiated' },
            { n: '440+', l: 'Living Alumni' },
            { n: '5×', l: 'Court of Honor' },
          ].map(s => (
            <div key={s.l} className="bg-kp-surface border border-kp-border rounded-2xl p-5 text-center">
              <div className="text-kp-gold text-3xl font-black">{s.n}</div>
              <div className="text-gray-400 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Chapter history */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {chapters.map(c => (
            <div key={c.title} className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <div className="bg-kp-blue px-5 py-3">
                <h2 className="text-kp-gold font-bold">{c.title}</h2>
              </div>
              <div className="p-5">
                <p className="text-gray-300 text-sm leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo + milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div
            className="rounded-2xl overflow-hidden min-h-[300px] bg-kp-card"
            style={{
              backgroundImage: "url('/images/historical-roof.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Key Milestones</div>
            <div className="space-y-4">
              {milestones.map(m => (
                <div key={m.year} className="flex gap-4 items-start">
                  <div className="bg-kp-blue text-kp-gold text-xs font-black px-2.5 py-1 rounded-lg shrink-0 tabular-nums">
                    {m.year}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 50th anniversary image */}
        <div className="rounded-2xl overflow-hidden">
          <div
            className="w-full h-48 md:h-64 bg-kp-card"
            style={{
              backgroundImage: "url('/images/50th-anniversary.png')",
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      </div>
    </div>
  )
}
