export const metadata = { title: 'Contact Us' }

const contacts = [
  {
    org: 'Kappa Phi Building Corporation',
    address: ['500 Old Moray Place', 'St. Charles, MO 63301'],
    phone: '(314) 640-5875',
    email: 'kappaphi@kappa-phi.org',
    url: null,
  },
  {
    org: 'Delta Tau Delta — Epsilon Nu Chapter',
    address: ['Missouri University of Science and Technology', '2631 Vienna Road', 'Rolla, MO 65401'],
    phone: '(573) 364-1909',
    email: 'dtd@mst.edu',
    url: 'http://www.rolladelts.org',
  },
  {
    org: 'Delta Tau Delta International Fraternity',
    address: ['10000 Allisonville Road', 'Fishers, IN 46038'],
    phone: '1-800-335-8795',
    email: null,
    url: 'http://www.delts.org',
  },
]

export default function ContactPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Get in Touch</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Reach out to the Building Corporation, the active chapter, or Delta Tau Delta International.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contacts.map(c => (
            <div key={c.org} className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <div className="bg-kp-blue px-5 py-3.5">
                <h2 className="text-kp-gold font-bold text-sm">{c.org}</h2>
              </div>
              <div className="p-6">
                <address className="not-italic text-gray-300 text-sm space-y-2">
                  {c.address.map((line, i) => <p key={i}>{line}</p>)}
                  {c.phone && <p className="pt-1 text-white font-medium">{c.phone}</p>}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="block text-kp-gold hover:opacity-80 no-underline">
                      {c.email}
                    </a>
                  )}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="block text-kp-gold hover:opacity-80 no-underline text-xs">
                      {c.url.replace('http://', '')}
                    </a>
                  )}
                </address>
              </div>
            </div>
          ))}
        </div>

        {/* Campus photo */}
        <div
          className="w-full h-48 rounded-2xl bg-kp-card"
          style={{
            backgroundImage: "url('/images/mst-campus.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    </div>
  )
}
