'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Board', href: '/board' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Property', href: '/property' },
  { label: 'Donations', href: '/donations' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
  { label: 'Portal', href: '/portal' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 bg-kp-blue shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 no-underline shrink-0"
        >
          <div className="w-9 h-9 bg-kp-gold rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-sm tracking-tight">ΔΤΔ</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="text-kp-gold font-bold text-sm">Kappa Phi BC</div>
            <div className="text-blue-200 text-xs">Epsilon Nu · Missouri S&T</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium no-underline transition-colors ${
                isActive(item.href)
                  ? 'bg-kp-gold text-black'
                  : 'text-blue-100 hover:bg-kp-blue-light hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Alumni Login CTA */}
        <Link
          href="/alumni"
          className="hidden lg:block ml-auto shrink-0 bg-kp-gold text-black font-bold px-4 py-2 rounded-lg text-sm no-underline hover:opacity-90 transition-opacity"
        >
          Alumni Login
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="lg:hidden ml-auto text-white p-2 rounded-md hover:bg-kp-blue-light transition-colors"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden bg-kp-blue-dark border-t border-blue-700">
          <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm font-medium no-underline transition-colors ${
                  isActive(item.href)
                    ? 'bg-kp-gold text-black'
                    : 'text-blue-100 hover:bg-kp-blue-light hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/alumni"
              onClick={() => setOpen(false)}
              className="col-span-2 mt-2 text-center bg-kp-gold text-black font-bold px-4 py-2.5 rounded-lg text-sm no-underline hover:opacity-90"
            >
              Alumni Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
