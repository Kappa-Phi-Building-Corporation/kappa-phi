'use client'

import { useState, useEffect, useCallback } from 'react'

type Member = {
  name: string
  role: string
  email?: string
  bio: string[]
  goals: string[]
  goalsBulleted?: boolean
}

// ─── Data ─────────────────────────────────────────────────────────

const officers: Member[] = [
  {
    name: 'Peter Moore',
    role: 'President',
    email: 'president@kappa-phi.org',
    bio: [
      "I joined Delta Tau Delta in the Fall of 2012 as part of the Beta Pi pledge class. As an undergraduate, I served as Director of Academic Affairs and Vice President–External. I also served as a dedicated member of Epsilon Nu's intramural billiards team.",
      "I graduated in 2014 with a BS in Mechanical Engineering. Since graduation, I've worked at Baxter Healthcare Corporation in Mountain Home, Arkansas. I am currently a Quality Engineer with focus on Sterility Assurance.",
      "Within Kappa Phi, I have previously served as Secretary, Treasurer, and Vice President of Membership.",
    ],
    goals: [
      "I plan to lead Kappa Phi as we work to modernize our operations, create the near- and long-term vision for KPBC, and begin work to update and return the shelter to one of the leading shelters on the MS&T campus.",
    ],
  },
  {
    name: 'Brian Booth',
    role: 'VP of Membership',
    email: 'booth@kappa-phi.org',
    bio: [
      'I joined Delta Tau Delta in the Fall of 1994 and was part of the Alpha Omicron pledge class. As a member, I served as Historian and 2nd VP for one semester, as well as being the de-facto "Network Admin".',
      "I graduated in 1997 with a BS in Computer Science and have worked at Edward Jones Investments in St. Louis for 28 years. I returned to UMR and obtained my MS in Information Science in 2005. Currently, I am working in Information Security as a Senior Engineer.",
      "In my spare time, I have served the Fraternity continually since graduation as the Assistant Chapter Advisor and Chapter Advisor for Epsilon Nu for 10 years and as Division Vice-President for the Missouri chapters for the last 15 years. As Delt reorganized nationally, I was appointed Region-12 Governor and served in that position for one year, in charge of volunteers for eight chapters in Missouri, Kansas, and Illinois. Currently, I am acting locally as an Assistant Advisor for the Epsilon Nu and Iota Chi chapters and nationally as a Master Ritualist.",
      "Prior roles with Kappa-Phi have included serving on the Building Corporation board as President, VP of Membership, VP of Fundraising, and as a general Director.",
    ],
    goals: [
      "As in my previous roles, I will continue to serve the EN undergraduates, Corporation, and support the objectives of the board. Rolla Delts have existed over 58 years, and our shelter is showing its age. We need to repair our infrastructure as well as continuing to maintain our alumni relations. It is my overall goal to attract young alumni back to serve the chapter/corp, have regular events that engage and rekindle an attraction to the Brotherhood, and maintain the continuity between the undergraduate and alumni experience.",
      "I began by repairing our database and web page, aligning all of our points of contact for alumni with National and the active chapter. On a regular basis, we have been sending out postal and email correspondence in an effort to keep our alumni base connected.",
      "I plan to continue my support of the KPBC webpage and alumni database, assist with the self-managed network and security infrastructure of the shelter, and assist the VP of Property Management with projects and maintenance.",
      "These efforts will continue to build our alumni and undergraduate relationships, keeping members in contact with Epsilon Nu in preparation for our next 50 years as Brothers!",
    ],
  },
  {
    name: 'Richard Braun',
    role: 'VP of Property Management',
    bio: [
      "I joined Epsilon Nu in 2013 as a part of the Beta Rho pledge class.",
      "During my time in the house, I held many positions but my three favorites were President, Vice President, and Pledge Ed.",
      "I graduated with a degree in Engineering Management with an emphasis in Industrial Engineering.",
      "I started working for PepsiCo in July of 2019 as a member of their campus hire program in St. Louis.",
    ],
    goals: [
      "Improve communications between undergrads and Kappa Phi",
      "Attend at least one worklab per year",
      "Try to attend at least 3 non-alumni functions per year",
      "Improve the shelter to be better than when I joined",
    ],
    goalsBulleted: true,
  },
  {
    name: 'Adam Rice',
    role: 'VP of Fundraising',
    email: 'fundraising@kappa-phi.org',
    bio: [
      "I joined Delta Tau Delta in Fall 2018 as part of the Beta Omega pledge class. As an active member, I served as Service & Philanthropy chair, FAAR chair, Secretary, Director of Member Development, and, most notably, as President during the pandemic of 2020.",
      "I graduated from Missouri S&T with a B.S. in Petroleum Engineering in Fall 2021 and remained in Rolla after taking a position with British Petroleum as an Application Engineer.",
      "Upon graduation, I immediately took on the role of Assistant Chapter Advisor providing guidance and support for new member education and FAAR roles.",
    ],
    goals: [
      "Kappa Phi strives to provide high quality shelter for our undergraduate Brothers as one way we support them and give back. As such, I would like to increase our capabilities to budget and plan by encouraging recurring donations. I want to continue to support the chapter through improvements through capital campaigns as well.",
    ],
  },
  {
    name: 'Greg Eike',
    role: 'Treasurer',
    bio: [
      "I joined Delta Tau Delta in Fall 2005 as a member of the Beta Eta pledge class. During my time as an undergraduate I served as Recruitment Chair, Vice President, and President. I have had the opportunity to participate in our Delta Tau Delta National Leadership Academies as both a participant and a facilitator over the last 15 years.",
      "I graduated in 2010 with a B.S. in Chemical Engineering and joined Anheuser-Busch in St. Louis, Missouri. During my first stint in St. Louis, I obtained my MBA from Washington University in 2016. Over the last 12 years I have worked closely with our 18 breweries across the US and Canada as a Production Engineer and Staff Brewmaster.",
      "In my time outside of Delta Tau Delta I am an avid cyclist, a board member on the Young Friends of Kids with Cancer in St. Louis, and am enjoying all the time I can get with my son who joined our family in 2021.",
    ],
    goals: [
      'Generally speaking, don\'t cook the books. Please check the "Board Financial Information" page under Alumni Information for specific details on the Kappa Phi Treasury.',
    ],
  },
  {
    name: 'Travis Zerna',
    role: 'Secretary',
    bio: [
      "I joined the fraternity in 2014 as a member of the Beta Sigma pledge class. While in house, I was the secretary and service & philanthropy chair for a semester.",
      "After graduating in 2018 with a bachelor's in metallurgical engineering, I began working at a privately owned business in Pacific Missouri, first as a machinist and now as a programmer of CNC mills and lathes.",
    ],
    goals: [
      "As the secretary of housing Corp, I plan on taking the best meeting minutes around.",
    ],
  },
]

const directors: Member[] = [
  {
    name: 'Andy Bateman',
    role: 'Director',
    bio: [
      'I joined Delta Tau Delta in Fall 2015 as a member of the Beta Tau pledge class. During my time as an undergraduate, I served as Alumni Relations and Events Chair, Director of Academic Affairs, Recruitment Chairman, and Vice President. Outside of these positions I took a very active role in almost all aspects of the house and really appreciate what I got out of it.',
      "I now work as a project coordinator at Black and McDonald, an electrical distribution contractor. The company is based out of Canada and has a large presence in Kansas City, and recently expanded operations to St. Louis.",
    ],
    goals: [
      "As Director for the Kappa Phi Building Corporation my main goal is to increase alumni engagement. If any alumni have ideas on ways the board could better engage alumni — or things that would motivate you to participate — feel free to email me at abatemanstl@gmail.com.",
    ],
  },
  {
    name: 'Preston Kramer',
    role: 'Director',
    bio: [
      "I received my Bachelor's Degree in Civil Engineering from University of Missouri at Rolla (now Missouri S&T), my Masters of Business Administration Degree from William Woods University, and a Bachelor's Degree in Architectural Engineering from Missouri S&T.",
      "I am a native of Missouri and live approximately 5 miles southwest of Vichy near the Phelps and Maries County Line. Since 2011, I have been the Area Engineer for the Meramec Region, comprising the eight counties of Phelps, Pulaski, Maries, Osage, Gasconade, Crawford, Dent, and Washington. I work closely with counties and communities to find solutions to the many transportation needs across the area. Prior to these duties, I worked as a Field Engineer for the Safe and Sound Bridge Improvement Program, as a Project Manager for the North-Central District, and in various Construction Inspection roles. I have worked for MoDOT for approximately 20 years, and believe the best years are yet to come.",
    ],
    goals: [
      "Get the house refurbished.",
    ],
  },
  {
    name: 'David Hammon',
    role: 'Director',
    bio: [
      "I joined Delta Tau Delta in Fall 1998 as a member of the Alpha Upsilon pledge class. During my time as an undergraduate member, I served as the Treasurer in 2002.",
      "Following my graduation with a B.S. in Computer Science, I moved to St. Louis and started my career with Accenture. I am currently a Senior Manager and focus on complex program delivery at Utility clients.",
      "As an alumni volunteer, I have served as Assistant Chapter Advisor, Chapter Advisor, and Finance Advisor for the EN chapter. I have also been a finance advisor for the Delta Omicron and Iota Chi chapters.",
    ],
    goals: [
      "I plan to help lead Kappa Phi as we work to modernize our operations, create the near- and long-term vision for KPBC, and begin work to update and return the shelter to one of the leading shelters on the MS&T campus.",
    ],
  },
  {
    name: 'JB Matthews',
    role: 'Director',
    bio: [
      "I joined Delta Tau Delta in the fall of 2006 as part of the Beta Iota pledge class. As an active member, I served as Sergeant of Arms and Director of Academic Affairs. I'm most well known for my escapades on a certain lawn mower at the 100th St. Pats.",
      "I graduated from Missouri S&T with a B.S. in Mechanical Engineering in spring 2009. Since graduation I've worked for Phillips 66 in Ponca City, OK. I'm currently a Maintenance Engineer working closely with coke and acid, helping to fuel 'high-octane FUN!'",
      "Since graduation, I had the role of Secretary on the Kappa Phi Housing Corp. and was recently elected to the role of Director.",
    ],
    goals: [
      "Assist the chapter and HC when needed from a distance, support the structure remodel, and partake in the occasional DTD gatherings.",
    ],
  },
  {
    name: 'Eric McDaniel',
    role: 'Director',
    bio: [
      "I started at Missouri S&T in the Fall of 2003 in the Beta Delta pledge class. I held the position of Historian for one semester. During my time at Rolla, I studied aerospace engineering and later graduated with a degree in geology.",
      "At present, I'm working in the Missouri Department of Revenue as a Management Analysis Specialist with a focus on permissions for employees.",
      "This is my first position on Housing Corp, and I look forward to seeing what it brings.",
    ],
    goals: [
      "To serve where I'm able in my time with the position in ways to help the house and the undergraduates.",
      "At present I plan to get the photos and media that I've taken over the past several years together in a way which can be given back to the house for both them and alumni to enjoy.",
    ],
  },
  {
    name: 'Dr. Tyler Richards',
    role: 'Director',
    bio: [
      "I was initiated into ΔΤΔ with the ΒΤ pledge class in Fall '15. During my time at the Shelter, I served as Director of Academic Affairs, Pledge Educator to the ΒΥ pledge class, Director of Risk Management, and Vice President.",
      "After earning my B.S. in Ceramic Engineering, I decided to stay in Rolla to work towards my Ph.D in Materials Science and Engineering. I enjoyed being close by — I was able to check in from time to time and connect with some of the newer pledge classes, and make sure the fraternity was in good hands with the subsequent Exec Boards.",
      "After earning my Doctorate, I moved out to Ohio to begin my current role as a Process Research Engineer at Cleveland-Cliffs. Even though I am now over 500 miles away, I am still eager to visit and check in (even if remotely sometimes) and do whatever I can to help ensure the fraternity prospers. No matter where I move to, the Shelter will always be my home.",
    ],
    goals: [
      "Generally just want to make sure the actives take full advantage of the renovations to foster growth and longevity of the fraternity.",
    ],
  },
  {
    name: 'Wade Waldmann',
    role: 'Director',
    bio: [
      "I was initiated in Delta Tau Delta in the Fall of 2010 during my Sophomore year of college as a member of the BN pledge class. I served as Historian and on the Exec Board as the Director of Risk Management while an active in the house. I was the last person to hold both as individual positions.",
      "I graduated in the Spring of 2014 with a BS in Mechanical Engineering and commissioned as a 2nd Lt in the US Air Force. I am currently a Major in USAF serving as a B-52 Weapons Systems Officer. I even met my wife Rachel in the house during St. Pats 2013. I am also the proud father of three beautiful little girls, Aubree, Aurora, and Autumn. Due to my military career it has been hard to get back to the house but I have managed a few events and always stop by when in the St. Louis area.",
      "There were many negatives from COVID-19 but one of the few positives was the normalization of virtual meetings which has allowed me to serve the fraternity yet again. I started attending general member meetings again, which ultimately led to me attaining a seat on the Board of Directors.",
    ],
    goals: [
      "As director my goal is to preserve and ensure that there is a shelter for the EN chapter of Delta Tau Delta so that current and future brothers can grow and develop in their careers and lives as I did as an undergrad. The house has been sorely deteriorating in the past years and is in need of infrastructure updates. I hope to help guide the Kappa Phi Housing Corps in the future development of the EN shelter.",
    ],
  },
  {
    name: 'Alex Apple',
    role: 'Director',
    bio: [],
    goals: [
      "To serve where I'm able in my time with the position in ways to help the house and the undergraduates.",
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────

function initials(name: string) {
  return name.replace(/^Dr\.\s+/, '').split(' ').map(n => n[0]).slice(0, 2).join('')
}

function photoPath(name: string) {
  const slug = name
    .replace(/^Dr\.\s+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `/images/board/${slug}.jpg`
}

// ─── Card ─────────────────────────────────────────────────────────

function MemberCard({
  member,
  onClick,
  variant = 'director',
}: {
  member: Member
  onClick: () => void
  variant?: 'officer' | 'director'
}) {
  const lg = variant === 'officer'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-kp-surface border border-kp-border hover:border-kp-gold rounded-2xl overflow-hidden transition-colors duration-200 w-full text-center cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-kp-gold ${lg ? 'p-7' : 'p-5'}`}
    >
      <div className={`rounded-2xl mx-auto relative overflow-hidden bg-kp-blue group-hover:ring-2 group-hover:ring-kp-gold transition-all ${lg ? 'w-28 h-28 mb-4' : 'w-20 h-20 mb-3'}`}>
        <span className={`absolute inset-0 flex items-center justify-center text-kp-gold font-black ${lg ? 'text-2xl' : 'text-base'}`}>
          {initials(member.name)}
        </span>
        <img
          src={photoPath(member.name)}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>

      <div className={`text-white font-semibold leading-tight ${lg ? 'text-base' : 'text-sm'}`}>
        {member.name}
      </div>
      <div className={`text-kp-gold font-medium mt-1 ${lg ? 'text-sm' : 'text-xs'}`}>
        {member.role}
      </div>

      <div className="flex items-center justify-center gap-1 mt-3 text-gray-600 group-hover:text-gray-400 transition-colors text-xs">
        <span>View profile</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

// ─── Drawer ───────────────────────────────────────────────────────

function Drawer({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const isOpen = member !== null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={member ? `${member.name} profile` : 'Member profile'}
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-kp-surface border-l border-kp-border z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {member && (
          <div className="p-8">
            {/* Close */}
            <div className="flex justify-end mb-6">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kp-gold"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Identity */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-2xl relative overflow-hidden bg-kp-blue shrink-0">
                <span className="absolute inset-0 flex items-center justify-center text-kp-gold font-black text-xl">
                  {initials(member.name)}
                </span>
                <img
                  src={photoPath(member.name)}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div>
                <div className="text-white text-xl font-bold leading-tight">{member.name}</div>
                <div className="text-kp-gold text-sm font-medium mt-1">{member.role}</div>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-kp-gold transition-colors mt-2 no-underline"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {member.email}
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {member.bio.length > 0 && (
                <section>
                  <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Biography</div>
                  <div className="space-y-3">
                    {member.bio.map((p, i) => (
                      <p key={i} className="text-gray-300 text-sm leading-relaxed">{p}</p>
                    ))}
                  </div>
                </section>
              )}

              {member.goals.length > 0 && (
                <section>
                  <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Goals &amp; Updates</div>
                  {member.goalsBulleted ? (
                    <ul className="space-y-2">
                      {member.goals.map((g, i) => (
                        <li key={i} className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                          <span className="text-kp-gold mt-0.5 shrink-0">◆</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-3">
                      {member.goals.map((g, i) => (
                        <p key={i} className="text-gray-300 text-sm leading-relaxed">{g}</p>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────

export default function BoardClient() {
  const [activeMember, setActiveMember] = useState<Member | null>(null)
  const close = useCallback(() => setActiveMember(null), [])

  return (
    <>
      {/* Officers */}
      <div className="mb-10">
        <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Officers</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {officers.map(m => (
            <MemberCard key={m.name} member={m} onClick={() => setActiveMember(m)} variant="officer" />
          ))}
        </div>
      </div>

      {/* Directors */}
      <div>
        <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Directors</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {directors.map(m => (
            <MemberCard key={m.name} member={m} onClick={() => setActiveMember(m)} variant="director" />
          ))}
        </div>
      </div>

      {/* General contact */}
      <div className="mt-10 bg-kp-blue rounded-2xl p-6 text-center">
        <p className="text-blue-100 text-sm">
          To reach the board, email us at{' '}
          <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold font-semibold">
            kappaphi@kappa-phi.org
          </a>{' '}
          or call <span className="text-white font-semibold">(314) 640-5875</span>.
        </p>
      </div>

      <Drawer member={activeMember} onClose={close} />
    </>
  )
}
