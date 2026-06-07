export const metadata = { title: 'Chapter Portal' }

const resources = [
  { label: 'Delta Tau Delta — Alumni Mailing List', href: 'https://www.kappa-phi.org/contactlist/index.php', external: true },
  { label: 'Byron N. Vermillion Scholarship Info & Application', href: '/donations', external: false },
  { label: 'Kappa Phi — Zoom Video Archives', href: 'https://www.kappa-phi.org/media.html', external: true },
]

export default function PortalPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Members & Chapter</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Chapter Portal</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Resources for active members and alumni of the Epsilon Nu Chapter.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Resources */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          <div className="bg-kp-blue px-6 py-4">
            <h2 className="text-kp-gold font-bold">Resources</h2>
          </div>
          <div className="divide-y divide-kp-border">
            {resources.map(r => (
              <a
                key={r.label}
                href={r.href}
                target={r.external ? '_blank' : undefined}
                rel={r.external ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between px-6 py-4 no-underline hover:bg-kp-card transition-colors group"
              >
                <span className="text-gray-200 text-sm group-hover:text-kp-gold transition-colors">{r.label}</span>
                <span className="text-kp-gold text-xs shrink-0 ml-4">{r.external ? '↗' : '→'}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Property Issue Form */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          <div className="bg-kp-blue px-6 py-4">
            <h2 className="text-kp-gold font-bold">Report a Property Issue</h2>
          </div>
          <div className="p-6">
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">Callback Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">Description of Issue</label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                  placeholder="Please describe the issue in detail..."
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="bg-kp-gold text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  Submit Report
                </button>
                <p className="text-gray-500 text-xs">
                  For urgent issues, contact the VP of Property Management or President directly.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
