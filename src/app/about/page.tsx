import Link from 'next/link'

export const metadata = { title: 'About Kappa Phi' }

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

// ─── Honor Rolls ──────────────────────────────────────────────────

const studentKnights = [
  { year: '1965', name: 'Gary M. Woodard' },
  { year: '1966', name: 'David Smith' },
  { year: '1967', name: 'James C. Cowles, Jr.' },
  { year: '1968', name: 'Walter D. Dietrich' },
  { year: '1969', name: 'Virgil A. Deshazer' },
  { year: '1970', name: 'Richard Campen' },
  { year: '1971', name: 'James W. Walker' },
  { year: '1972', name: 'Roy B. Woods' },
  { year: '1973', name: 'Paul E. Erlandson' },
  { year: '1974', name: 'William L. Morley' },
  { year: '1975', name: 'David L. Lyon' },
  { year: '1976', name: 'Merle Dillow' },
  { year: '1977', name: 'William J. Tierney' },
  { year: '1978', name: 'Eddie H. Doss' },
  { year: '1979', name: 'Thomas H. Schmitt' },
  { year: '1980', name: 'David K. Hall' },
  { year: '1981', name: 'David E. Dubois' },
  { year: '1982', name: 'Clarence Miller' },
  { year: '1983', name: 'David A. Robben' },
  { year: '1984', name: 'Christopher S. Greenwood' },
  { year: '1985', name: 'Steven M. Bretzke' },
  { year: '1986', name: 'Terry T. Palisch' },
  { year: '1987', name: 'Craig A. Thomas' },
  { year: '1988', name: 'Frederick T. Miller' },
  { year: '1989', name: 'Andrew P. Jones' },
  { year: '1990', name: 'Charles M. Pulay' },
  { year: '1991', name: 'John D. Pulay' },
  { year: '1992', name: 'Timothy A. Stelljes' },
  { year: '1993', name: 'Brian K. Verman' },
  { year: '1995', name: 'Matthew L. Leap' },
  { year: '1996', name: 'Keith R. Dandurand' },
  { year: '1997', name: 'Samuel D. Erter' },
  { year: '1998', name: 'Liem D. T. Nguyen' },
  { year: '1999', name: 'Jeff Heckman' },
  { year: '2000', name: 'Gary Roberts' },
  { year: '2001', name: 'Daniel Woodcock' },
  { year: '2002', name: 'Daniel Maddex' },
  { year: '2003', name: 'James Henken' },
  { year: '2004', name: 'Corey Ernst' },
  { year: '2005', name: 'Brian Schwegal' },
  { year: '2006', name: 'Mike Scherr' },
  { year: '2007', name: 'Bryan Madson' },
  { year: '2008', name: 'Marshall King' },
]

const highestGPA: { term: string; names: string[] }[] = [
  { term: "Fall '65", names: ['Bob McDavid'] },
  { term: "Spg '66", names: ['Gerald Miller'] },
  { term: "Spg '68", names: ['Charles Parks'] },
  { term: "Fall '68", names: ['David Holdener'] },
  { term: "Fall '69", names: ['Richard Smith'] },
  { term: "Fall '70", names: ['John Morrissey'] },
  { term: "Spg '71", names: ['Sandy Cambell'] },
  { term: "Fall '71", names: ['Bob Jones'] },
  { term: "Fall '73", names: ['Bill Van Veghte III'] },
  { term: "Spg '74", names: ['Ed Doss'] },
  { term: "Fall '74", names: ['Marc Bunz'] },
  { term: "Fall '75", names: ['John Trousdale'] },
  { term: "Fall '76", names: ['Jeff Sheets'] },
  { term: "Fall '77", names: ['Tim Heath'] },
  { term: "Fall '78", names: ['Dave Anderson'] },
  { term: "Spg '79", names: ['John Alles'] },
  { term: "Fall '79", names: ['Dave Kniepkamp'] },
  { term: "Fall '80", names: ['Scott Niewoehner'] },
  { term: "Fall '81", names: ['Dennis Card'] },
  { term: "Fall '82", names: ['Terrence'] },
  { term: "Fall '83", names: ['Robert Carden'] },
  { term: "Fall '84", names: ['Andrew Jones'] },
  { term: "Fall '85", names: ['Tom Sovar'] },
  { term: "Fall '86", names: ['James McDaniel'] },
  { term: "Fall '87", names: ['John Winkler'] },
  { term: "Fall '88", names: ['Perry Mar'] },
  { term: "Fall '89", names: ['Josh Chandler'] },
  { term: "Fall '90", names: ['Brian Verman'] },
  { term: "Fall '91", names: ['Dan Ludwig'] },
  { term: "Fall '92", names: ['Gary Greene'] },
  { term: "Fall '93", names: ['Brad Butler'] },
  { term: "Fall '94", names: ['Jeff Heckman'] },
  { term: "Fall '95", names: ['Phillip Courtney', 'Preston Kramer', 'Brian Miller'] },
  { term: "Fall '96", names: ['Ben Braker'] },
  { term: "Fall '97", names: ['Jason Bodson'] },
  { term: "Spg '98", names: ['Minjie Xu'] },
  { term: "Fall '98", names: ['James Henken'] },
  { term: "Spg '99", names: ['Jason Bridges'] },
  { term: "Fall '99", names: ['Eugene Shoykhet'] },
  { term: "Fall '00", names: ['James Kramer'] },
  { term: "Fall '01", names: ['Brian Schwegal'] },
  { term: "Fall '02", names: ['Nathan Wilke'] },
  { term: "Spg '03", names: ['Mike Scherr'] },
  { term: "Fall '04", names: ['Kurt Bloch', 'Ryan Seman'] },
  { term: "Spg '05", names: ['Zach Nelson'] },
  { term: "Fall '05", names: ['Jason Hartman'] },
  { term: "Spg '06", names: ['Nicholas Russo'] },
  { term: "Fall '06", names: ['Austin Thompson'] },
]

const ifcReps = [
  { year: '1964', name: 'Harwell Schutty' },
  { year: '1965', name: 'Jerry Fortner' },
  { year: '1966', name: 'Eric Aschinger, Tom Fritzinger' },
  { year: '1967', name: 'Peter Dunkailo' },
  { year: '1968', name: 'Robert Cramner' },
  { year: '1969', name: 'Gary Wicke' },
  { year: '1970', name: 'Gary Shanklin' },
  { year: '1971', name: 'Donald Power' },
  { year: '1972', name: 'William Morley' },
  { year: '1973', name: 'Jeff Wassilak' },
  { year: '1974', name: 'Mike Hauser' },
  { year: '1975', name: 'Hillis Pratt' },
  { year: '1976', name: 'Tom Schmitt' },
  { year: '1977', name: 'Johnie Trousdale' },
  { year: '1978', name: 'Jeff Sheets' },
  { year: '1979', name: 'Nick Dungey' },
  { year: '1980', name: 'Clarence Miller' },
  { year: '1981', name: 'Richard Weber' },
  { year: '1982', name: 'Steve Bretzke' },
  { year: '1983', name: 'Lew Westermeyer' },
  { year: '1984', name: 'Terry Palisch' },
  { year: '1985', name: 'Rob Brown' },
  { year: '1986', name: 'John Fox III' },
  { year: '1987', name: 'Sean McKessy' },
  { year: '1988', name: 'Kenneth Johnson' },
  { year: '1989', name: 'Noel Gibler' },
  { year: '1990', name: 'Josh Chandler' },
  { year: '1991', name: 'Matt Leap' },
  { year: '1992', name: 'Keith Dandurand' },
  { year: '1993', name: 'Jim Schrock' },
  { year: '1995', name: 'Sean Teitelbaum' },
  { year: '1996', name: 'Clint Napton' },
  { year: '1997', name: 'Frank Koch' },
  { year: '1998', name: 'Doug Chappell' },
  { year: '1999', name: 'Tim Thomason' },
  { year: '2000', name: 'M. Daniel McGhee' },
  { year: '2001', name: 'Matt Wolken' },
  { year: '2002', name: 'Kraig Kelley' },
  { year: '2003', name: 'Ryan Kelly' },
  { year: '2004', name: 'Joe Brunner' },
  { year: '2005', name: 'David Baugher' },
  { year: '2006', name: 'Greg Bates' },
  { year: '2007', name: 'Kevin Butler' },
  { year: '2008', name: "Trevor O'Brien" },
  { year: '2009', name: 'Josh Parks' },
]

const stPatsBoard = [
  { name: 'Michael J. Schreiner', position: "'69" },
  { name: 'Sammy Hopper', position: "'70" },
  { name: 'Jack Higgins', position: "'71" },
  { name: 'Kenneth Kifer', position: "'72" },
  { name: 'Lloyd Reynolds', position: "'73" },
  { name: 'Donald Dierker', position: "'74" },
  { name: 'Craig Thomson', position: "'75" },
  { name: 'Edward Haberstroh', position: "'76" },
  { name: 'Gary Underwood', position: "'77 Masterguard · '79 St. Pat" },
  { name: 'Joseph Morales', position: "'78" },
  { name: 'Kevin Hauser', position: "'80" },
  { name: 'Clifton Dodson', position: "'81" },
  { name: 'Keith Markway', position: "'82 Trumpeteer" },
  { name: 'Scott Niewoehner', position: "'83 Guard" },
  { name: 'Scott Muskopf', position: "'84 Masterguard" },
  { name: 'Robert Carden', position: "'85 Guard" },
  { name: 'David Hettenhausen', position: "'86 St. Pat" },
  { name: 'Scott McReynolds', position: "'87 Trumpeteer" },
  { name: 'Brian Johnson', position: "'00 Herald" },
  { name: 'Dan Maddex', position: "'01 Masterguard" },
  { name: 'Allyn Perigin', position: "'04" },
  { name: 'Winston Carr', position: "'07" },
  { name: 'Caleb Nelson', position: "'17" },
]

const chapterPresidents = [
  'Mike Conway', 'Tom Lillie', 'Jerry Fortner', 'Ronald Smith', 'Dale Ricks',
  'Eric Aschinger', 'Anthony Mack', 'Gary Wicke', 'Donald Power', 'Gary Shanklin',
  'William Morley', 'Dave Lyon', 'Edward Haberstroh', 'Kelly McGrath', 'Michael Hauser',
  'Warren Greenwalt', 'Jeff Sheets', 'Clarence Miller', 'Nick Dungey', 'Dave Anderson',
  'Christopher Greenwood', 'Craig Thomas', 'Steve Bretzke', 'John Powell (2 terms)',
  'Rob Brown', 'Matt King', 'Kirk McMenamin', 'Charlie Pulay', 'John Pulay',
  'Jim Hill', 'John Goethe', 'Daniel Ludwig', 'Jason Carter', 'Samuel Erter',
  'Clint Napton', 'Jeff Heckman', 'Ben Braker', 'Matt Chesebrough', 'Doug Chappell',
  'Chris Kelly', 'Matt Wolken', 'Brian Schwegal', 'Ryan Kelly', 'Joseph Brunner',
  'Greg Eike', 'Nicholas Russo', 'Austin Thompson', 'Joshua Parks', 'Derek Dixon',
  'Gabriel Ellis', 'Matthew Vogel', 'Joseph Collum', 'Ian Flannigan', 'Tyler Hembrock',
  'Richard Braun',
]

const mascots = [
  { years: '1969', name: 'Studley' },
  { years: '1972–1974', name: 'Seymour' },
  { years: '1975–1977', name: 'Zeke' },
  { years: '1975–1979', name: 'Heidi' },
  { years: '1978–1987', name: 'Astro' },
  { years: '1981–1982', name: 'Beouregard' },
  { years: '1982–1983', name: 'Gonzo' },
  { years: '1986–1991', name: 'Jake' },
  { years: '1988–1990', name: 'Thor' },
  { years: '1992–1996', name: 'Kooter' },
  { years: '1996–2012', name: 'April' },
  { years: '1998–1999', name: 'Hindippens' },
  { years: '2009–Present', name: 'Reagan' },
  { years: '2012', name: 'Sasha' },
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

export default function AboutPage() {
  return (
    <div className="bg-kp-dark min-h-screen">

      {/* Hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">History &amp; Heritage</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About Kappa Phi</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Over 60 years of brotherhood, excellence, and service at Missouri University of Science &amp; Technology.
          </p>
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
                  {studentKnights.map(e => (
                    <div key={e.year + e.name} className="flex gap-2 items-baseline">
                      <span className="text-kp-gold text-xs font-black shrink-0 tabular-nums">{e.year}</span>
                      <span className="text-gray-300 text-xs">{e.name}</span>
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
                  {highestGPA.map(e => (
                    <div key={e.term} className="flex gap-2 items-start">
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
                  {ifcReps.map(e => (
                    <div key={e.year} className="flex gap-2 items-baseline">
                      <span className="text-kp-gold text-xs font-black shrink-0 tabular-nums">{e.year}</span>
                      <span className="text-gray-300 text-xs">{e.name}</span>
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
                  {stPatsBoard.map(e => (
                    <div key={e.name} className="flex gap-3 items-start">
                      <div className="min-w-0">
                        <div className="text-gray-200 text-xs">{e.name}</div>
                        <div className="text-kp-gold text-xs font-semibold">{e.position}</div>
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
                  {chapterPresidents.map((name, i) => (
                    <div key={i} className="flex gap-2 items-baseline">
                      <span className="text-kp-gold text-xs font-black shrink-0">{i + 1}.</span>
                      <span className="text-gray-300 text-xs">{name}</span>
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
                  {mascots.map(m => (
                    <div key={m.name} className="bg-kp-card border border-kp-border rounded-xl px-3 py-2.5">
                      <div className="text-kp-gold font-bold text-sm">{m.name}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{m.years}</div>
                    </div>
                  ))}
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
