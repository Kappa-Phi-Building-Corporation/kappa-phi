import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'About Kappa Phi' }
export const revalidate = 3600

// ─── Founders ─────────────────────────────────────────────────────

const founders = [
  'Gregory D. Bachman', 'Davis M. Conway', 'James C. Cowles', 'Jerry L. Fortner',
  'William H. Harwell', 'Al Herold', 'John Hoog', 'Stephen E. Krieger',
  'Edward T. Lillie', 'Ronald Martin', 'Gerard Mendel', 'Stanley Ricks',
  'Donald C. Scarpero', 'Phillip Schutty', 'David N. Smith', 'Ronald R. Smith',
  'David A. Spencer', 'Gary Woodward',
]

// ─── Chapter History ──────────────────────────────────────────────

const historyChapters = [
  {
    id: 'founding',
    title: 'Chapter 1: The Founding',
    paragraphs: [
      'Kappa Phi Fraternity was founded on December 5, 1963, at the University of Missouri School of Mines and Metallurgy when the eighteen founders met with Norman Fishel, field secretary of Phi Kappa Sigma. It was Norman Fishel\'s stated intention to form a colony of Phi Kappa Sigma on the MSM campus. Since the founders were at first in favor of becoming a colony of Phi Kappa Sigma, they chose, on December 9, 1963, the letters Kappa Phi — the first two letters of Phi Kappa Sigma reversed — as their official name.',
      'The founding members of Kappa Phi had many reasons for founding a new fraternity. Most of them had been pledges in other fraternities on the MSM campus and had quit because they disliked certain elements which were present. Most of these undesirable elements were involved in the pledge programs of the other fraternities, as is evidenced by the early resolution that "no member shall expect any pledge to do anything which that member cannot or will not do."',
      'The founding members came from two groups. The first group had already started to found a new fraternity when they met in the Rolla Building on December 5. The other group consisted of men who were interested in forming a new fraternity but had not yet taken any steps toward the actual formation of one.',
    ],
  },
  {
    id: 'organization',
    title: 'Chapter 2: The Organization',
    paragraphs: [
      'Because of the long school vacations for Christmas and semester break, the next meeting of Kappa Phi after December 9 was on February 4, 1964. At this meeting, the constitution of Kappa Phi was accepted. The Constitution included in its coverage the requirements for membership in Kappa Phi, the fraternity\'s administration, the financial affiliation between the fraternity and its members, the conduct of the fraternity meetings, and the necessary procedure for amendment of the Constitution.',
      'At the meeting of February 4, the fraternity\'s faculty advisor, Kenneth G. Mayhan, was also introduced to the founders. At this time, he spoke to the founders on his views on fraternity life and on scholarship. This was the first of several occasions on which he took the opportunity to influence the course of the fraternity.',
    ],
  },
  {
    id: 'members-officers',
    title: 'Chapter 3: New Members & Officers',
    paragraphs: [
      'Since Davis M. Conway had been the president of one of the groups which merged to form Kappa Phi, Norman Fishel had suggested at the fraternity\'s first meeting that Conway be accepted as the leader of the fraternity until (1) Conway requested that elections be held, (2) a majority of members requested elections, or (3) the first regular meeting of April 1964. Thus, on February 17, at Conway\'s request, the first officers of Kappa Phi were elected.',
      'Elected to office were: Davis M. Conway, Alpha (president); Edward T. Lillie, Beta (vice-president); William H. Harwell, Sigma (secretary); Jerry L. Fortner, Pi (scholastic chairman); Gregory D. Bachmann, Iota (ritualist); Ronald Martin, Upsilon (extracurricular director); James C. Cowles, Psi (social chairman); Gary Woodard, Theta (sergeant-at-arms and house manager); and Stanley Ricks, Assistant Theta.',
      'On March 16, the founders accepted a policy on all men who as non-founders affiliated themselves with the fraternity before September 1964. These men were to be known as tentative members and were allowed to attend fraternity functions until September 1964. If they met the requirements of membership and were accepted by the founders, they would become active members. Those who did not become active members by September 1964 would then become pledges.',
      'On October 19, 1964, the fraternity formed the new office of Steward, known as the Gamma. This office was created to relieve the Theta of some of the responsibilities which his office included — most of which involved maintenance of the fraternity\'s house. Ronald R. Smith was elected to this office.',
    ],
  },
  {
    id: 'new-house',
    title: "Chapter 4: Kappa Phi's New House",
    paragraphs: [
      'At the meeting of March 2, a committee was appointed to secure a house for the fraternity. This committee consisted of David Spencer (chairman), Gary Woodard, Jerry Fortner, and Phillip Schutty. The housing committee proceeded to set up a housing corporation and find a house suitable for the usage of the fraternity.',
      'The house which was purchased was located on eight acres of land along Vienna Road. This property, which included a pond, was located 1.1 miles from the MSM Electrical Engineering Building. The house itself, which was brick, had two floors containing 2,500 square feet of floor space each, and was for sale at $35,000. The changes which were necessary in the house and the furniture originally bought raised that initial expense to about $50,000. The housing corporation managed a long-term loan of the house at 6.6% interest and supervised all changes to the house and furniture.',
    ],
  },
  {
    id: 'delta-tau-delta',
    title: 'Chapter 5: Delta Tau Delta',
    paragraphs: [
      'Although Kappa Phi was originally formed with the intention of eventually becoming a chapter of Phi Kappa Sigma, the founders soon became disenchanted with Phi Kappa Sigma\'s lack of correspondence and support. They then began to look around and consider other national fraternities.',
      'In the Fall of 1964, a graduate student who was a member of Phi Kappa Tau arranged to have a field secretary visit Kappa Phi. This visit precipitated the formation of the National Fraternity Selection Committee (NFSC), whose duty it was to choose several good national fraternities, correspond with them, and recommend to the chapter an affiliation movement. In addition to Phi Kappa Sigma and Phi Kappa Tau, the NFSC chose Phi Gamma Delta, Beta Theta Pi, Phi Delta Theta, Sigma Chi, and Delta Tau Delta as national fraternities to consider. On December 14, 1964, the NFSC recommended that a decision be delayed until three members of Kappa Phi could attend and report to the chapter on the national convention of Phi Kappa Sigma.',
      'In early February of 1965, Kappa Phi decided, upon recommendation of the NFSC, to petition Delta Tau Delta Fraternity for colony status. A letter of intent was dispatched immediately, and on April 10, 1965, Delta Tau Delta recognized Kappa Phi as an official colony. On May 10, Bruce Jones, field secretary of Delta Tau Delta, announced that Whit Smith, stationed at nearby Fort Leonard Wood, was to serve as Kappa Phi\'s colony advisor and do all he could to expedite the acceptance of Kappa Phi as a chapter of Delta Tau Delta.',
    ],
  },
  {
    id: 'epsilon-nu',
    title: 'Chapter 6: Epsilon Nu of Delta Tau Delta',
    paragraphs: [
      'On December 10, 1966, Kappa Phi Fraternity was initiated into Delta Tau Delta Fraternity as Epsilon Nu Chapter — the 96th chapter to be initiated into Delta Tau Delta. The initiation took place at the Delta Omicron Chapter at Westminster College in Fulton, Missouri, with Delta Tau Delta\'s International President and US Supreme Court Chief Justice Tom C. Clark in attendance.',
      'Since its initiation, Epsilon Nu has consistently been among MS&T\'s academic leaders. It has distinguished itself in numerous organizations, perhaps the most well known of which is the St. Pat\'s Board, on which it has had two St. Pats (presidents).',
      'In the Fall of 1986, Epsilon Nu celebrated its 20th anniversary with a banquet on Homecoming weekend. Many alumni returned for the joyous occasion. At the same time, a mortgage burning ceremony was held to celebrate the fact that the eight acres of land and the house that was Kappa Phi\'s first house were fully paid for.',
    ],
  },
  {
    id: 'achievements',
    title: 'Chapter 7: Achievements',
    paragraphs: [
      'Epsilon Nu has received various awards from Delta Tau Delta nationally for programs, including awards for excellence in website design, exceeding the All Men\'s/All Fraternity Average GPA, excellent Honor Board practices, and outstanding Undergraduate Manual.',
      'Epsilon Nu\'s brightest moments include 1991, when it received the Court of Honor award from the Arch Chapter for its overall performance in 1990. This award placed EN Chapter in the top 24 chapters of 124 Delt chapters in the United States and Canada at the time — the first time EN Chapter had received this award since the Court of Honor program was begun. Since then, the chapter has received a total of 5 Court of Honor awards.',
      'In 2000, Epsilon Nu received the highest award given to any chapter: the Hugh Shields Award for Chapter Excellence. This award is reserved for only those who are "first among equals," and only 10 are given every year. Epsilon Nu has taken the Hugh Shields flag home three times — in 2000, 2004, and 2006.',
    ],
  },
]

const milestones = [
  { year: '1963', event: 'Kappa Phi Fraternity founded at University of Missouri School of Mines (Dec. 5)' },
  { year: '1964', event: 'Constitution adopted; first house purchased on eight acres along Vienna Road' },
  { year: '1965', event: 'Petitioned Delta Tau Delta; recognized as official DTD colony (Apr. 10)' },
  { year: '1966', event: 'Initiated into Delta Tau Delta as Epsilon Nu Chapter — 96th nationally (Dec. 10)' },
  { year: '1986', event: '20th anniversary banquet & mortgage burning ceremony on Homecoming weekend' },
  { year: '1991', event: 'First Court of Honor Award — top 24 of 124 DTD chapters nationally' },
  { year: '1999', event: 'Major chapter house expansion completed' },
  { year: '2000', event: 'First Hugh Shields Award for Chapter Excellence' },
  { year: '2004', event: 'Second Hugh Shields Award for Chapter Excellence' },
  { year: '2006', event: 'Third Hugh Shields Award for Chapter Excellence' },
  { year: '2016', event: '50th anniversary as Epsilon Nu Chapter of Delta Tau Delta' },
]

// ─── Honor roll sorting helpers ────────────────────────────────────

// Pulls a 4-digit year, or a 2-digit year (e.g. "'77") normalized to 19xx/20xx.
function parseYear(label: string | null): number {
  if (!label) return 9999
  const m4 = label.match(/(\d{4})/)
  if (m4) return parseInt(m4[1], 10)
  const m2 = label.match(/(\d{2})/)
  if (m2) {
    const yy = parseInt(m2[1], 10)
    return yy >= 50 ? 1900 + yy : 2000 + yy
  }
  return 9999
}

function seasonOrder(label: string): number {
  if (/spg|spring/i.test(label)) return 0
  if (/summer/i.test(label)) return 1
  if (/fall/i.test(label)) return 2
  return 1
}

// ─── Chevron icon ─────────────────────────────────────────────────

function Chevron() {
  return (
    <svg
      className="w-5 h-5 text-kp-gold shrink-0 group-open:rotate-180 transition-transform duration-200"
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default async function AboutPage() {
  const admin = createAdminClient()

  const [{ data: honorRows }, { data: mascotRows }] = await Promise.all([
    admin
      .from('chapter_honors')
      .select('category, display_name, year_label, title, sort_order'),
    admin
      .from('chapter_mascots')
      .select('name, start_year, end_year, photo_url, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
  ])

  const honors = honorRows ?? []
  const mascots = mascotRows ?? []
  const byCategory = (cat: string) => honors.filter(h => h.category === cat)

  const studentKnights = byCategory('student_knight')
    .sort((a, b) => parseYear(a.year_label) - parseYear(b.year_label) || a.sort_order - b.sort_order)

  const ifcReps = byCategory('ifc_rep')
    .sort((a, b) => parseYear(a.year_label) - parseYear(b.year_label) || a.sort_order - b.sort_order)

  const chapterPresidents = byCategory('chapter_president')
    .sort((a, b) => a.sort_order - b.sort_order)

  const highestGPARaw = byCategory('highest_gpa')
    .sort((a, b) =>
      parseYear(a.year_label) - parseYear(b.year_label) ||
      seasonOrder(a.year_label ?? '') - seasonOrder(b.year_label ?? '') ||
      a.sort_order - b.sort_order
    )
  const highestGPA: { term: string; names: string[] }[] = []
  for (const row of highestGPARaw) {
    const term = row.year_label ?? ''
    const last = highestGPA[highestGPA.length - 1]
    if (last && last.term === term) last.names.push(row.display_name)
    else highestGPA.push({ term, names: [row.display_name] })
  }

  const stPatsRaw = byCategory('st_pats_board')
    .sort((a, b) => parseYear(a.year_label) - parseYear(b.year_label) || a.sort_order - b.sort_order)
  const stPatsBoard: { name: string; positions: string[] }[] = []
  for (const row of stPatsRaw) {
    const position = [row.year_label, row.title].filter(Boolean).join(' ')
    const existing = stPatsBoard.find(g => g.name === row.display_name)
    if (existing) existing.positions.push(position)
    else stPatsBoard.push({ name: row.display_name, positions: [position] })
  }

  return (
    <div className="bg-kp-dark min-h-screen">

      {/* Hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-lg shadow-black/30 p-2 flex items-center justify-center shrink-0">
            <img src="/images/coat-of-arms.png" alt="Kappa Phi coat of arms" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">History &amp; Heritage</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About Kappa Phi</h1>
            <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
              Over 60 years of brotherhood, excellence, and service at Missouri University of Science &amp; Technology.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: '1963', l: 'Founded' },
            { n: '500+', l: 'Brothers Initiated' },
            { n: '440+', l: 'Living Alumni' },
            { n: '3×', l: 'Hugh Shields Award' },
          ].map(s => (
            <div key={s.l} className="bg-kp-surface border border-kp-border rounded-2xl p-5 text-center">
              <div className="text-kp-gold text-3xl font-black">{s.n}</div>
              <div className="text-gray-400 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── Photo + Milestones ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className="rounded-2xl overflow-hidden min-h-[320px] bg-kp-card"
            style={{
              backgroundImage: "url('/images/historical-roof.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Key Milestones</div>
            <div className="space-y-3">
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

        {/* Intro */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-7 space-y-4">
          <p className="text-gray-200 leading-relaxed">
            Kappa Phi and its Building Corporation is comprised of alumni that attended the university
            known as MSM–UMR–MST in Rolla, Missouri. All members are initiates and alumni in good standing
            of Delta Tau Delta Fraternity. The Corporation owns the chapter house and property located in Rolla.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We have a strong local history in Rolla, Missouri as a social organization on the Missouri
            University of Science and Technology campus — first as Kappa Phi and then as the Epsilon Nu
            chapter of Delta Tau Delta Fraternity. Since our founding, we have initiated over 500 men and
            have close to 440 living alumni dispersed all around the world.
          </p>
        </div>

        {/* ── Chapter History ── */}
        <section>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Our Story</div>
          <h2 className="text-white text-2xl font-bold mb-6">Chapter History</h2>
          <div className="space-y-3">
            {historyChapters.map((ch, i) => (
              <details
                key={ch.id}
                className="group bg-kp-surface border border-kp-border rounded-2xl overflow-hidden"
                open={i === 0}
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-kp-blue hover:bg-kp-blue-light transition-colors">
                  <span className="text-kp-gold font-bold">{ch.title}</span>
                  <Chevron />
                </summary>
                <div className="px-6 py-5 space-y-4 border-t border-kp-border">
                  {ch.paragraphs.map((p, j) => (
                    <p key={j} className="text-gray-300 text-sm leading-relaxed">{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Founders ── */}
        <section>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">December 5, 1963</div>
          <h2 className="text-white text-2xl font-bold mb-6">The 18 Founders</h2>
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {founders.map(f => (
                <div
                  key={f}
                  className="bg-kp-card border border-kp-border rounded-xl px-3 py-2.5 text-center"
                >
                  <span className="text-gray-200 text-xs leading-tight block">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Honor Rolls ── */}
        <section>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Records &amp; Recognition</div>
          <h2 className="text-white text-2xl font-bold mb-6">Honor Rolls</h2>
          <div className="space-y-3">

            {/* Student Knights */}
            <details className="group bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-kp-blue hover:bg-kp-blue-light transition-colors">
                <span className="text-kp-gold font-bold">Student Knights</span>
                <Chevron />
              </summary>
              <div className="px-6 py-5 border-t border-kp-border">
                <p className="text-gray-400 text-xs mb-4">Annual honor recognizing outstanding active brothers.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {studentKnights.map((e, i) => (
                    <div key={i} className="flex gap-2 items-baseline">
                      <span className="text-kp-gold text-xs font-black shrink-0 tabular-nums">{e.year_label}</span>
                      <span className="text-gray-300 text-xs">{e.display_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Highest Initiate GPA */}
            <details className="group bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-kp-blue hover:bg-kp-blue-light transition-colors">
                <span className="text-kp-gold font-bold">Highest Initiate Grade Point</span>
                <Chevron />
              </summary>
              <div className="px-6 py-5 border-t border-kp-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {highestGPA.map((e, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-kp-gold text-xs font-black shrink-0 tabular-nums w-16">{e.term}</span>
                      <span className="text-gray-300 text-xs">{e.names.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* IFC Representatives */}
            <details className="group bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-kp-blue hover:bg-kp-blue-light transition-colors">
                <span className="text-kp-gold font-bold">Interfraternity Council Representatives</span>
                <Chevron />
              </summary>
              <div className="px-6 py-5 border-t border-kp-border">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {ifcReps.map((e, i) => (
                    <div key={i} className="flex gap-2 items-baseline">
                      <span className="text-kp-gold text-xs font-black shrink-0 tabular-nums">{e.year_label}</span>
                      <span className="text-gray-300 text-xs">{e.display_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* St. Pat's Board */}
            <details className="group bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-kp-blue hover:bg-kp-blue-light transition-colors">
                <span className="text-kp-gold font-bold">St. Pat&apos;s Board Representatives</span>
                <Chevron />
              </summary>
              <div className="px-6 py-5 border-t border-kp-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {stPatsBoard.map((e, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="min-w-0">
                        <div className="text-gray-200 text-xs">{e.name}</div>
                        <div className="text-kp-gold text-xs font-semibold">{e.positions.join(' · ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Chapter Presidents */}
            <details className="group bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-kp-blue hover:bg-kp-blue-light transition-colors">
                <span className="text-kp-gold font-bold">Chapter Presidents</span>
                <Chevron />
              </summary>
              <div className="px-6 py-5 border-t border-kp-border">
                <p className="text-gray-400 text-xs mb-4">Listed in chronological order from 1964 to present.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {chapterPresidents.map((e, i) => (
                    <div key={i} className="flex gap-2 items-baseline">
                      <span className="text-kp-gold text-xs font-black shrink-0">{i + 1}.</span>
                      <span className="text-gray-300 text-xs">{e.display_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Chapter Mascots */}
            <details className="group bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-kp-blue hover:bg-kp-blue-light transition-colors">
                <span className="text-kp-gold font-bold">Chapter Mascots</span>
                <Chevron />
              </summary>
              <div className="px-6 py-5 border-t border-kp-border">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mascots.map((m, i) => {
                    const years = m.start_year === m.end_year
                      ? `${m.start_year ?? ''}`
                      : `${m.start_year ?? ''}–${m.end_year ?? 'Present'}`
                    return (
                      <div key={i} className="bg-kp-card border border-kp-border rounded-xl overflow-hidden">
                        {m.photo_url && (
                          <img src={m.photo_url} alt={m.name} className="w-full h-24 object-cover" />
                        )}
                        <div className="px-3 py-2.5">
                          <div className="text-kp-gold font-bold text-sm">{m.name}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{years}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </details>

          </div>
        </section>

        {/* ── Chapter Eternal ── */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-1">
            <div className="text-kp-gold font-bold text-lg mb-1">Chapter Eternal</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The Chapter Eternal memorial — honoring brothers who have passed — is available exclusively
              to logged-in alumni members in the portal.
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 bg-kp-blue text-white font-bold px-6 py-3 rounded-xl no-underline hover:bg-kp-blue-light transition-colors text-sm"
          >
            Sign In to View
          </Link>
        </div>

        {/* ── 50th anniversary photo ── */}
        <div className="rounded-2xl overflow-hidden">
          <div
            className="w-full h-48 md:h-64 bg-kp-card"
            style={{
              backgroundImage: "url('/images/50th-anniversary.jpg')",
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
