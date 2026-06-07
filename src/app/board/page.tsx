export const metadata = { title: 'Board Members' }

const officers = [
  { name: 'Peter Moore', role: 'President', email: 'president@kappa-phi.org' },
  { name: 'Brian Booth', role: 'VP of Membership', email: 'booth@kappa-phi.org' },
  { name: 'Richard Braun', role: 'VP of Property Management', email: null },
  { name: 'Adam Rice', role: 'VP of Fundraising', email: 'fundraising@kappa-phi.org' },
  { name: 'Greg Eike', role: 'Treasurer', email: null },
  { name: 'Travis Zerna', role: 'Secretary', email: null },
]

const directors = [
  { name: 'Andy Bateman', role: 'Director' },
  { name: 'Preston Kramer', role: 'Director' },
  { name: 'David Hammon', role: 'Director' },
  { name: 'JB Matthews', role: 'Director' },
  { name: 'Eric McDaniel', role: 'Director' },
  { name: 'Dr. Tyler Richards', role: 'Director' },
  { name: 'Wade Waldmann', role: 'Director' },
  { name: 'Alex Apple', role: 'Director' },
]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('')
}

function MemberCard({ name, role, email }: { name: string; role: string; email?: string | null }) {
  return (
    <div className="bg-kp-surface border border-kp-border rounded-2xl p-5 text-center hover:border-kp-blue transition-colors group">
      <div className="w-14 h-14 bg-kp-blue rounded-full mx-auto mb-3 flex items-center justify-center text-kp-gold font-black text-sm group-hover:bg-kp-blue-light transition-colors">
        {initials(name)}
      </div>
      <div className="text-white font-semibold text-sm leading-tight">{name}</div>
      <div className="text-kp-gold text-xs mt-1 font-medium">{role}</div>
      {email && (
        <a href={`mailto:${email}`} className="text-gray-500 text-xs mt-2 block hover:text-kp-gold transition-colors no-underline">
          {email}
        </a>
      )}
    </div>
  )
}

export default function BoardPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Page hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Leadership</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Board Members</h1>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
            The officers and directors of the Kappa Phi Building Corporation, committed to supporting Epsilon Nu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hugh Shields photo */}
        <div
          className="w-full h-48 rounded-2xl mb-12 bg-kp-card"
          style={{
            backgroundImage: "url('/images/hugh-shields.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />

        {/* Officers */}
        <div className="mb-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Officers</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {officers.map(m => <MemberCard key={m.name} {...m} />)}
          </div>
        </div>

        {/* Directors */}
        <div>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Directors</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {directors.map(m => <MemberCard key={m.name} {...m} />)}
          </div>
        </div>

        {/* General contact */}
        <div className="mt-10 bg-kp-blue rounded-2xl p-6 text-center">
          <p className="text-blue-100 text-sm mb-3">
            To reach the board, email us at{' '}
            <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold font-semibold">
              kappaphi@kappa-phi.org
            </a>{' '}
            or call <span className="text-white font-semibold">(314) 640-5875</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
