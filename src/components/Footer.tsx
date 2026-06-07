import Link from 'next/link'

const quickLinks = [
  ['About Kappa Phi', '/about'],
  ['Board Members', '/board'],
  ['Alumni Information', '/alumni'],
  ['Donations & Fundraising', '/donations'],
  ['Events & Calendar', '/events'],
  ['Contact Us', '/contact'],
  ['Chapter Portal', '/portal'],
]

export default function Footer() {
  return (
    <footer className="bg-kp-blue-dark border-t-4 border-kp-gold mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-kp-gold rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">ΔΤΔ</span>
              </div>
              <div className="text-kp-gold font-bold leading-tight">Kappa Phi<br />Building Corporation</div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              Supporting the Epsilon Nu Chapter of Delta Tau Delta Fraternity at Missouri S&amp;T since 1963. Over 500 brothers initiated, lives of excellence.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/endelts" target="_blank" rel="noopener noreferrer"
                className="text-blue-300 hover:text-kp-gold text-sm no-underline transition-colors">
                Facebook
              </a>
              <a href="https://www.instagram.com/rolladelts/" target="_blank" rel="noopener noreferrer"
                className="text-blue-300 hover:text-kp-gold text-sm no-underline transition-colors">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-kp-gold font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</div>
            <ul className="space-y-2">
              {quickLinks.map(([label, href]) => (
                <li key={href}>
                  <Link href={href}
                    className="text-blue-200 hover:text-kp-gold text-sm no-underline transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-kp-gold font-semibold text-sm uppercase tracking-wider mb-4">Contact</div>
            <address className="not-italic text-blue-200 text-sm space-y-2">
              <p className="text-white font-semibold">Kappa Phi Building Corporation</p>
              <p>500 Old Moray Place<br />St. Charles, MO 63301</p>
              <p>(314) 640-5875</p>
              <a href="mailto:kappaphi@kappa-phi.org"
                className="text-kp-gold hover:opacity-80 no-underline transition-opacity">
                kappaphi@kappa-phi.org
              </a>
            </address>
            <div className="mt-4 pt-4 border-t border-blue-700">
              <p className="text-blue-300 text-xs">Delta Tau Delta Fraternity</p>
              <p className="text-blue-300 text-xs">Epsilon Nu Chapter · Rolla, MO 65401</p>
              <a href="mailto:dtd@mst.edu" className="text-blue-300 hover:text-kp-gold text-xs no-underline">
                dtd@mst.edu
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-10 pt-6 text-center text-blue-400 text-xs">
          Kappa Phi Building Corporation &mdash; Copyright {new Date().getFullYear()} &mdash; 236 Enterprises
        </div>
      </div>
    </footer>
  )
}
