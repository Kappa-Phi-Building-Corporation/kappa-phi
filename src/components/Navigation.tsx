'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logout } from '@/app/auth/actions'

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

type NavUser = {
  email: string
  firstName?: string
  isAdmin: boolean
  adminPendingCount?: number
}

export default function Navigation({ navUser }: { navUser: NavUser | null }) {
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

        {/* Desktop right side — auth-aware */}
        <div className="hidden lg:flex items-center gap-2 ml-auto shrink-0">
          {navUser ? (
            <>
              {navUser.isAdmin && (
                <Link
                  href="/admin"
                  className={`relative px-3 py-1.5 rounded-md text-sm font-medium no-underline transition-colors ${
                    isActive('/admin')
                      ? 'bg-kp-gold text-black'
                      : 'text-blue-100 hover:bg-kp-blue-light hover:text-white'
                  }`}
                >
                  Admin
                  {(navUser.adminPendingCount ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-amber-500 text-black text-[10px] font-bold px-1 leading-none">
                      {navUser.adminPendingCount}
                    </span>
                  )}
                </Link>
              )}
              <Link
                href="/profile"
                className={`px-3 py-1.5 rounded-md text-sm font-medium no-underline transition-colors ${
                  isActive('/profile')
                    ? 'bg-kp-gold text-black'
                    : 'text-blue-100 hover:bg-kp-blue-light hover:text-white'
                }`}
              >
                {navUser.firstName ? `${navUser.firstName}` : 'My Account'}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-blue-200 hover:bg-kp-blue-light hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-kp-gold text-black font-bold px-4 py-2 rounded-lg text-sm no-underline hover:opacity-90 transition-opacity"
            >
              Alumni Login
            </Link>
          )}
        </div>

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

            {navUser ? (
              <>
                {navUser.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className={`relative px-3 py-2.5 rounded-md text-sm font-medium no-underline transition-colors ${
                      isActive('/admin')
                        ? 'bg-kp-gold text-black'
                        : 'text-blue-100 hover:bg-kp-blue-light hover:text-white'
                    }`}
                  >
                    Admin
                    {(navUser.adminPendingCount ?? 0) > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-amber-500 text-black text-[10px] font-bold px-1 leading-none">
                        {navUser.adminPendingCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium no-underline transition-colors ${
                    isActive('/profile')
                      ? 'bg-kp-gold text-black'
                      : 'bg-kp-gold/10 text-kp-gold hover:bg-kp-gold/20'
                  }`}
                >
                  {navUser.firstName ?? 'My Account'}
                </Link>
                <form action={logout} className="col-span-2 mt-1">
                  <button
                    type="submit"
                    className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-700 text-blue-300 hover:border-kp-gold hover:text-kp-gold transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="col-span-2 mt-2 text-center bg-kp-gold text-black font-bold px-4 py-2.5 rounded-lg text-sm no-underline hover:opacity-90"
              >
                Alumni Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
