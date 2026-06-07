export const metadata = { title: 'Property Management' }

const futureProjects = [
  {
    name: 'HVAC Upgrades Phase 2',
    scheduled: 'TBD',
    cost: '$15,000',
    desc: 'Replace aging furnaces, air conditioner compressor units and coils in the new wing with modern equipment.',
  },
  {
    name: 'Great Room Noise Reduction',
    scheduled: 'TBD',
    cost: 'TBD',
    desc: 'Reduce noise in the Great Room to make it a more attractive environment for events, studying, and brotherhood.',
  },
  {
    name: 'Recreation Room Remodel',
    scheduled: 'TBD',
    cost: 'TBD',
    desc: 'Remodel the former dining/meeting area — currently underutilized — to make it more attractive and useful.',
  },
]

const completedProjects = [
  { name: 'Volleyball Pit Renovation', year: 'Fall 2013' },
  { name: 'Exterior Brick & Wood Deck Seal', year: 'Summer 2013' },
  { name: 'Upstairs Bathroom Waterproofing', year: 'Summer 2013' },
  { name: 'HVAC Upgrades Phase 1', year: 'Spring 2013', cost: '$15,000' },
  { name: 'Parking Lot Sealing & Striping', year: 'Summer 2012', cost: '$1,900' },
  { name: 'Great Room Storage', year: 'Spring 2011' },
  { name: 'Water Heater Replacement', year: 'Summer 2010', cost: '$3,100' },
  { name: 'Front Room Furniture Replacement', year: 'Winter 2010', cost: '$7,000' },
]

export default function PropertyPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">The Shelter</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Property Management</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Since 1999, the Building Corporation has made substantial improvements to the Chapter House, keeping Epsilon Nu one of the most modern fraternities on campus.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        {/* Awards context */}
        <div
          className="w-full h-48 rounded-2xl bg-kp-card"
          style={{ backgroundImage: "url('/images/awards-wall.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Future Projects */}
        <div>
          <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Future Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {futureProjects.map(p => (
              <div key={p.name} className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
                <div className="bg-kp-blue px-5 py-3">
                  <h3 className="text-kp-gold font-bold text-sm">{p.name}</h3>
                </div>
                <div className="p-5">
                  <div className="flex gap-4 text-xs text-gray-500 mb-3">
                    <span>Scheduled: <span className="text-gray-400">{p.scheduled}</span></span>
                    <span>Est. Cost: <span className="text-gray-400">{p.cost}</span></span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Projects */}
        <div>
          <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Completed Projects</h2>
          <div className="bg-kp-surface border border-kp-border rounded-2xl divide-y divide-kp-border overflow-hidden">
            {completedProjects.map(p => (
              <div key={p.name} className="flex items-center justify-between px-6 py-4 hover:bg-kp-card transition-colors">
                <div className="text-gray-200 text-sm font-medium">{p.name}</div>
                <div className="flex items-center gap-4 text-right shrink-0">
                  {p.cost && <span className="text-gray-500 text-xs">{p.cost}</span>}
                  <span className="text-kp-gold text-xs font-semibold tabular-nums">{p.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
