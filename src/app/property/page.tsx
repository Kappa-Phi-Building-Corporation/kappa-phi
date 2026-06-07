export const metadata = { title: 'Property Management' }

// ─── Types ────────────────────────────────────────────────────────

type Project = {
  name: string
  description: string
  cost?: string
  contractor?: string
  // Set image to a path like '/images/property/hvac-phase1.jpg' when a photo is ready.
  // When undefined the photo area is simply not rendered.
  image?: string
}

type PlannedProject = Project & { scheduled: string }
type CompletedProject = Project & { completed: string }

// ─── Data ─────────────────────────────────────────────────────────

const plannedProjects: PlannedProject[] = [
  {
    name: 'HVAC Upgrades Phase 2',
    scheduled: 'Spring 2014',
    cost: '$15,000',
    description:
      'The existing HVAC systems in the fraternity house are requiring more maintenance every year and becoming less reliable. This phase will replace the three aging furnace, compressor, and coil units in the new wing, which was built in 1999. A capital campaign is currently underway to fund this project.',
  },
  {
    name: 'Great Room Noise Reduction',
    scheduled: 'TBD',
    description:
      'A long overdue improvement. We are currently evaluating options to reduce noise in the Great Room to make it a more attractive environment for events, studying, and general brotherhood use.',
  },
  {
    name: 'Recreation Room Remodel',
    scheduled: 'TBD',
    description:
      'Since the kitchen was moved to the Great Room level, the former dining and meeting area has gone largely underutilized. We are in the planning phase for a remodel that makes the space more useful to the actives and more attractive to potential brothers, alumni, and guests.',
  },
]

const recentProjects: CompletedProject[] = [
  {
    name: 'Volleyball Pit Renovation',
    completed: 'Fall 2013',
    contractor: 'Pledge Class Project',
    description:
      'To address drainage issues near the volleyball pit and the front of the shelter, Housing Corps rented a skid loader for a day and had the actives provide the labor. The drainage corrections turned out very well.',
  },
  {
    name: 'Exterior Brick, Mortar & Wood Deck Seal',
    completed: 'Summer 2013',
    description:
      'The brick, mortar, and exterior surfaces were sealed to protect the shelter exterior for approximately ten years. The contractor also re-stained the back deck at a very acceptable bid price. With the sealed brick and new deck stain, the exterior of the house is looking pretty good.',
  },
  {
    name: 'Upstairs Men\'s Bathroom Shower Waterproofing',
    completed: 'Summer 2013',
    description:
      'All floor tiles in the shower were removed and replaced, with the contractor also tiling up the walls approximately 10 inches. A new waterproof liner system now covers the entire floor surface and rises up the walls, preventing water from migrating behind the liner as it did with the old system.',
  },
  {
    name: 'HVAC Upgrades Phase 1',
    completed: 'Spring 2013',
    cost: '$15,000',
    contractor: 'Denny Hartman (Jason Hartman\'s BE-337 father)',
    description:
      'Phase 1 replaced the three HVAC units in the old wing of the shelter and added a compact unit in the attic over the carport for additional capacity in that zone. The result is a split zone for the old wing with independent control of each area.',
  },
  {
    name: 'Parking Lot Sealing & Striping',
    completed: 'Summer 2012',
    cost: '$1,900',
    contractor: 'Melrose Quarry & Asphalt, LLC — Rolla, MO',
    description:
      'The entire lot was cleaned and coated with sealer, then re-striped in the original locations. This project extended the life of the asphalt and greatly improved its resistance to motor oil, gasoline, and de-icing salts.',
  },
  {
    name: 'Great Room Storage',
    completed: 'Spring 2011',
    contractor: 'Fall 2010 Pledge Class (direct alumni funding)',
    description:
      'This project opened up the area under the stairwell at the end of the great room, giving the undergraduates additional storage space. Work included drywalling, lighting, and installation of a commercial-grade door.',
  },
  {
    name: 'Water Heater Replacement',
    completed: 'Summer 2010',
    cost: '$3,100',
    description:
      'The fraternity\'s aging water heaters — installed as part of the 1999 expansion — were replaced with new electric units providing 240 gallons of total storage capacity. The new units feature higher-wattage elements for quicker recovery times during periods of heavy use.',
  },
  {
    name: 'Front Room Furniture Replacement',
    completed: 'Winter 2010',
    cost: '$7,000',
    description:
      'Several front-room couches damaged from heavy day-to-day use were replaced with heavy-duty Flexsteel brand couches — fully upholstered with steel frames, the same grade used in hotels and commercial settings. The new furniture is warranted against physical damage and staining.',
  },
]

const archiveProjects: CompletedProject[] = [
  {
    name: 'Stair Tread Replacement',
    completed: 'Spring 2009',
    cost: '$2,100',
    description:
      'The stair treads installed 10 years earlier as part of the 1999 expansion were difficult to clean and torn in several places. This project replaced the treads on the stairs from the front room to the rec room and from the rec room to the great room.',
  },
  {
    name: 'Upstairs Hall Bathroom Remodeling',
    completed: 'Summer 2008',
    cost: '$2,700',
    description:
      'Originally the master bathroom of the Chapter House when it was a family dwelling, this project replaced plumbing fixtures, sinks, cabinetry, flooring, and walls; removed an unused door from the 5-man study; and added a shower. Labor was donated by actives, alumni, and friends.',
  },
  {
    name: 'Great Room Foundation Leak Repairs',
    completed: 'Spring 2008',
    cost: '$2,000',
    description:
      'Water was leaking into the great room through the foundation during moderate to heavy rains. Investigation found that the grade of the side yard caused water to pond against the exterior wall, and the foundation drain tile was clogged. This project excavated next to the foundation, installed an improved drainage system, corrected the yard slope, and repositioned three AC units that had to be moved in the process.',
  },
  {
    name: 'Upstairs Shower Ceiling Renovation',
    completed: 'Summer 2007',
    cost: '$500',
    description:
      'Poor lighting and ventilation of the upstairs shower were causing a mildew problem. This project removed the existing waterboard, replaced the ceiling with new drywall, added recessed can lighting and new exhaust fans, and installed a shower door. Completed by alums Brian Booth and Chris Kelly with the assistance of undergraduates Alex Carnes and Greg Eike.',
  },
  {
    name: 'Fire Alarm System Additions',
    completed: 'Summer 2007',
    cost: '$1,500',
    description:
      'The study rooms in the old wing were not tied into the hard-wired fire alarm system installed during the 1999 expansion. This project added hard-wired smoke detectors to all rooms lacking one, increasing safety throughout the house. Completed by alums Brian Booth and Chris Kelly with the assistance of undergraduates Alex Carnes and Dan Gill.',
  },
  {
    name: 'Downstairs Shower Renovation',
    completed: 'Summer 2006',
    cost: '$2,700',
    description:
      'Water infiltration behind the tile had ruined sections of drywall in the downstairs shower, which also had only two heads in poor condition. The project gutted the shower room, corrected floor slope for drainage, moved and added shower heads, rebuilt walls in cement board and tile, improved lighting with recessed cans, and installed a decorative shower door featuring the UMR and DTD 150th Anniversary logos. All work was performed by alums Brian Booth and Chris Kelly with the undergraduates.',
  },
  {
    name: 'Professional Carpet Cleaning',
    completed: 'Summer 2006',
    cost: '$250',
    contractor: 'Kirkwood Carpet Cleaning — Rolla, MO',
    description:
      'After nearly 7 years, the existing carpet had accumulated embedded dirt that rental equipment could no longer remove. Commercial steam cleaning of all public areas and hallways made the shelter presentable for the 40th Anniversary Homecoming celebration in 2006.',
  },
  {
    name: 'Front Room Furniture Replacement',
    completed: 'Fall 2005',
    cost: '$4,100',
    description:
      'The tables and couches in the front room had not been replaced in many years. Through generous alumni support, fully upholstered replacement couches were purchased — more comfortable, much less like dorm furniture, and warranted against physical damage and staining.',
  },
  {
    name: 'Parking Lot Sealing & Striping',
    completed: 'Summer 2005',
    cost: '$1,450',
    contractor: 'Pierce Asphalt & Sealing — Newburg, MO',
    description:
      'The entire lot was cleaned, coated with sealer, and re-striped. This treatment extended the life of the asphalt and improved resistance to motor oil, gasoline, and de-icing salts.',
  },
  {
    name: 'New Kitchen Equipment (Expansion & Renovation Phase II)',
    completed: 'Summer 2004',
    cost: '$23,825',
    contractor: 'Commercial & Restaurant Equipment (Camdenton, MO); Vernon White Mechanical Contractors (Rolla, MO); Korsmeyer Fire Protection (Jefferson City, MO); additional work by alumni Gary Greene and Brian Booth',
    description:
      'Fire safety code changes in Rolla threatened kitchen condemnation in 2004. The kitchen — largely unchanged since the 1960s and too small for post-1999 membership — was relocated to the new wing. The project added a new range hood with fire suppression, new sinks, a commercial-grade dishwasher, and new cabinetry. Both kitchen and pantry are approximately double the size of the former facilities.',
  },
  {
    name: 'Shed Project',
    completed: 'Summer 2002',
    cost: '$3,580',
    description:
      'Led by former Director of Property Management Gary Greene, with the help of 11 undergraduates, a 15×18 wood-frame shed was constructed to house the chapter\'s lawn equipment and tools. The Alpha Omega Pledge Class poured the concrete slab and foundation the previous fall as their pledge class project.',
  },
  {
    name: 'Window Replacement',
    completed: 'Summer 2002',
    cost: '$15,650',
    contractor: 'Coverdell Glass — Waynesville, MO',
    description:
      'The original single-pane aluminum windows in the older half of the Chapter House were replaced with modern double-pane, gas-filled, vinyl-clad windows. Wood trim and aluminum mini-blinds were also added at this time.',
  },
  {
    name: 'Expansion & Renovation — Phase I',
    completed: 'Fall 1999',
    cost: '$500,000',
    contractor: 'Hogan Construction Co. — Rolla, MO',
    description:
      'The landmark project that modernized the shelter: 9 new 2-man sleep/study rooms, a large multipurpose room, provisions for a future kitchen, complete renovation of restroom facilities and sleeping dorms, installation of central forced-air heating and air conditioning (the first fraternity on campus to have central A/C throughout), a new larger parking lot, new sidewalks, and numerous other improvements.',
  },
]

// ─── Components ───────────────────────────────────────────────────

function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function PlannedCard({ p }: { p: PlannedProject }) {
  return (
    <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden flex flex-col">
      <div className="bg-kp-blue px-5 py-3 flex items-center justify-between gap-2">
        <h3 className="text-white font-bold text-sm">{p.name}</h3>
        <span className="text-kp-gold text-xs font-semibold shrink-0 bg-kp-blue-dark px-2 py-0.5 rounded-full">
          {p.scheduled === 'TBD' ? 'Planned' : p.scheduled}
        </span>
      </div>

      {p.image && (
        <img src={p.image} alt={p.name} className="w-full h-36 object-cover" />
      )}

      <div className="p-5 flex-1 flex flex-col gap-3">
        {p.cost && (
          <div className="text-xs text-gray-500">
            Est. Cost: <span className="text-gray-300 font-medium">{p.cost}</span>
          </div>
        )}
        <p className="text-gray-300 text-sm leading-relaxed">{p.description}</p>
      </div>
    </div>
  )
}

function RecentCard({ p }: { p: CompletedProject }) {
  return (
    <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden flex flex-col">
      {p.image && (
        <img src={p.image} alt={p.name} className="w-full h-44 object-cover" />
      )}

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-white font-bold text-sm leading-snug">{p.name}</h3>
          <span className="text-kp-gold text-xs font-semibold shrink-0 tabular-nums">{p.completed}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
          {p.cost && (
            <span>Cost: <span className="text-gray-400">{p.cost}</span></span>
          )}
          {p.contractor && (
            <span className="truncate max-w-[220px]">
              Contractor: <span className="text-gray-400">{p.contractor}</span>
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm leading-relaxed">{p.description}</p>
      </div>
    </div>
  )
}

function ArchiveRow({ p }: { p: CompletedProject }) {
  return (
    <details className="group border-b border-kp-border last:border-0">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-kp-card transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <Chevron className="w-4 h-4 text-gray-600 group-open:rotate-180 transition-transform shrink-0" />
          <span className="text-gray-200 text-sm font-medium truncate">{p.name}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs">
          {p.cost && <span className="text-gray-500">{p.cost}</span>}
          <span className="text-kp-gold font-semibold tabular-nums">{p.completed}</span>
        </div>
      </summary>

      <div className="px-5 pb-5 pt-1">
        {p.image && (
          <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-xl mb-4" />
        )}
        <div className="space-y-2 pl-7">
          {p.contractor && (
            <p className="text-xs text-gray-500">
              Contractor: <span className="text-gray-400">{p.contractor}</span>
            </p>
          )}
          <p className="text-gray-400 text-sm leading-relaxed">{p.description}</p>
        </div>
      </div>
    </details>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function PropertyPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">The Shelter</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Property Management</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Since 1999, the Building Corporation has made substantial improvements to the Chapter House,
            keeping Epsilon Nu among the most modern fraternities on the MS&T campus.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">

        {/* Intro note + awards photo side by side */}
        <div className="flex flex-col md:flex-row gap-5 items-stretch">
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 flex-1">
            <p className="text-gray-300 text-sm leading-relaxed">
              The amenities we provide the men of Epsilon Nu allow them to concentrate on the fundamentals
              of the Fraternity — as demonstrated by the 5 Court of Honor and 3 Hugh Shields Awards won in the
              last 15 years. This page summarizes major projects the Building Corporation has undertaken and
              showcases what is planned next.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              Questions about property management? Contact our{' '}
              <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">VP of Property Management</a>.
            </p>
          </div>
          <div
            className="w-full md:w-72 min-h-48 rounded-2xl bg-kp-card shrink-0"
            style={{ backgroundImage: "url('/images/awards-wall.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        </div>

        {/* Planned Projects */}
        <section>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Planned Projects</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plannedProjects.map(p => <PlannedCard key={p.name} p={p} />)}
          </div>
        </section>

        {/* Recent Projects */}
        <section>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Recent Projects</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recentProjects.map(p => <RecentCard key={p.name} p={p} />)}
          </div>
        </section>

        {/* Archive */}
        <section>
          <details className="group">
            <summary className="flex items-center gap-3 cursor-pointer list-none mb-0">
              <div className="text-kp-gold text-xs font-bold uppercase tracking-widest">
                Project Archive — 1999 to 2009
              </div>
              <Chevron className="w-4 h-4 text-kp-gold group-open:rotate-180 transition-transform" />
              <span className="text-gray-600 text-xs ml-auto">{archiveProjects.length} projects</span>
            </summary>

            <div className="mt-5 bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              {archiveProjects.map(p => <ArchiveRow key={p.name} p={p} />)}
            </div>
          </details>
        </section>

      </div>
    </div>
  )
}
