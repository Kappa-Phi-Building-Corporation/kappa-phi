export const metadata = { title: 'Alumni Events & Calendar' }

export default function EventsPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      <div
        className="border-b border-kp-border relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/bonfire.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-kp-dark/80" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Brotherhood & Events</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Events &amp; Calendar</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Upcoming events for Kappa Phi alumni and the Epsilon Nu Chapter at Missouri S&T.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        {/* St. Pats 2026 */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          <div className="bg-kp-blue px-6 py-4 flex items-center justify-between">
            <h2 className="text-kp-gold font-black text-lg">118th Annual St. Pats — 2026</h2>
            <span className="text-blue-200 text-sm font-medium">March 11–15, 2026</span>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-kp-gold font-bold">GET FIRED UP about PATS 26!</p>

            {[
              {
                date: 'Wednesday, March 11',
                items: [
                  'Various — contact the Delt Ombudsman for general Pats activities',
                  '7pm–10pm: FOL Casino Night · Havener Center, St. Pats Ballroom · $7 at the door',
                ],
              },
              {
                date: 'Thursday, March 12',
                items: ['Noon: Gonzo & Games and beer garden at Schuman Park pavilion'],
              },
              {
                date: 'Friday, March 13',
                items: [
                  'All day/night: Hanging at the Shelter',
                  '8:30am: Screwdrivers & Donuts (and more) in the Great Room',
                  'Noon: Gonzo & Games and beer garden at Schuman Park pavilion',
                ],
              },
              {
                date: 'Saturday, March 14',
                items: [
                  'Early Morning: Street Painting, Hair of the Dog',
                  'Morning: Drinking on Pine, parade around 11am',
                  '2pm: Housing Corporation general membership meeting',
                ],
              },
              {
                date: 'Sunday, March 15',
                items: ['Go home safely! 🏠'],
              },
            ].map(({ date, items }) => (
              <div key={date}>
                <h3 className="text-white font-bold text-sm mb-2">{date}</h3>
                <ul className="space-y-1.5">
                  {items.map(item => (
                    <li key={item} className="flex gap-2 text-gray-300 text-sm">
                      <span className="text-kp-gold shrink-0 mt-0.5 text-xs">◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* HC Virtual Meeting */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-white font-bold text-lg mb-1">HC General Membership Meeting</h2>
              <p className="text-gray-400 text-sm">Saturday, March 14, 2026 · 2pm–3pm CST · Virtual</p>
            </div>
            <a
              href="https://meet.google.com/vgf-nqyd-pjn"
              target="_blank" rel="noopener noreferrer"
              className="bg-kp-gold text-black font-bold px-5 py-2.5 rounded-lg text-sm no-underline hover:opacity-90 transition-opacity shrink-0"
            >
              Join Google Meet
            </a>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Dial-in: +1 678-801-8110 · PIN: 725 458 954#
          </p>
        </div>

        {/* Photo gallery strip */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { src: '/images/stpats-group.jpg', alt: 'St. Pats group' },
            { src: '/images/stpats-friends.jpg', alt: 'St. Pats friends' },
          ].map(img => (
            <div
              key={img.src}
              className="aspect-video rounded-xl bg-kp-card"
              style={{ backgroundImage: `url('${img.src}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              role="img"
              aria-label={img.alt}
            />
          ))}
        </div>

        {/* Social */}
        <div className="bg-kp-blue rounded-2xl p-5 flex flex-wrap items-center gap-4">
          <p className="text-blue-100 text-sm flex-1">Stay up to date — follow the chapter on social media</p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/endelts" target="_blank" rel="noopener noreferrer"
              className="bg-kp-gold text-black font-bold px-4 py-2 rounded-lg text-sm no-underline hover:opacity-90">
              Facebook
            </a>
            <a href="https://www.instagram.com/rolladelts/" target="_blank" rel="noopener noreferrer"
              className="border border-white/40 text-white font-bold px-4 py-2 rounded-lg text-sm no-underline hover:border-kp-gold hover:text-kp-gold transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
