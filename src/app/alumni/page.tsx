import { createClient } from '@/lib/supabase/server'
import { login } from '@/app/auth/actions'
import Link from 'next/link'

export const metadata = { title: 'Alumni Information' }

const memberSections = [
  { label: 'Your Personal Profile', href: '/profile', soon: false },
  { label: 'Alumni Records & Contact Directory', href: '/alumni/directory', soon: true },
  { label: 'Big Brother Tree', href: '/alumni/tree', soon: true },
  { label: 'Chapter Eternal Memorial & Missing Brothers', href: '/alumni/eternal', soon: true },
  { label: 'Board Minutes, Reports & Financial Info', href: '/alumni/board-docs', soon: true },
]

export default async function AlumniPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await searchParams

  if (user) {
    return (
      <div className="bg-kp-dark min-h-screen">
        <div className="bg-kp-crimson-dark border-b border-kp-border">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Members Only</div>
            <h1 className="text-4xl font-black text-white">Alumni Information</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberSections.map(item => (
              <div key={item.label}>
                {item.soon ? (
                  <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 opacity-50">
                    <div className="text-gray-400 font-semibold mb-1">{item.label}</div>
                    <div className="text-xs bg-kp-card text-gray-500 px-2 py-0.5 rounded inline-block">Coming soon</div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block bg-kp-surface border border-kp-border rounded-2xl p-6 no-underline hover:border-kp-blue hover:bg-kp-card transition-colors group"
                  >
                    <div className="text-white font-semibold mb-1 group-hover:text-kp-gold transition-colors">{item.label}</div>
                    <div className="text-kp-gold text-xs">Access →</div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Members Only</div>
          <h1 className="text-4xl font-black text-white mb-3">Alumni Information</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Sign in to access alumni contact information and other private content for Epsilon Nu alumni.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Login form */}
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
            <h2 className="text-kp-gold font-bold text-xl mb-6">Sign In</h2>
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm">
                ⚠ {error}
              </div>
            )}
            <form action={login} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-kp-gold text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Sign In
              </button>
            </form>
            <div className="mt-5 pt-5 border-t border-kp-border space-y-2 text-sm">
              <Link href="/register" className="block text-kp-gold hover:opacity-80">Not registered? Create an account →</Link>
              <Link href="/forgot-password" className="block text-gray-500 hover:text-gray-300">Forgot password?</Link>
              <p className="text-gray-600 text-xs pt-1">
                Need help with your badge number or profile? Email{' '}
                <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">kappaphi@kappa-phi.org</a>
              </p>
            </div>
          </div>

          {/* What you get */}
          <div>
            <h2 className="text-white font-bold text-xl mb-6">What Members Can Access</h2>
            <div className="space-y-3">
              {memberSections.map(item => (
                <div key={item.label} className="flex gap-3 items-start bg-kp-surface border border-kp-border rounded-xl px-5 py-4">
                  <span className="text-kp-gold mt-0.5 text-xs shrink-0">◆</span>
                  <span className="text-gray-300 text-sm">{item.label}</span>
                  {item.soon && (
                    <span className="ml-auto text-xs text-gray-600 bg-kp-card px-2 py-0.5 rounded shrink-0">Soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
