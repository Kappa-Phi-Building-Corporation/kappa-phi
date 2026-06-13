import { login } from '@/app/auth/actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-kp-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-kp-gold font-black text-lg">ΔΤΔ</span>
          </div>
          <h1 className="text-3xl font-black text-white">Alumni Login</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Access member records, the Big Brother tree, and more
          </p>
        </div>

        <div className="bg-kp-blue/20 border border-kp-blue text-blue-200 px-4 py-3 rounded-xl mb-5 text-sm flex gap-2">
          <span>ℹ</span>
          <span>
            This is our new website. If you had an account on the old site, you&apos;ll need to{' '}
            <Link href="/register" className="text-kp-gold underline hover:opacity-80">create a new account</Link> here.
          </span>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm flex gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Card */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <form action={login} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-kp-gold text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm mt-2"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-kp-border space-y-2 text-sm text-center">
            <p>
              <Link href="/register" className="text-kp-gold hover:opacity-80">
                Not registered? Create an account
              </Link>
            </p>
            <p>
              <Link href="/forgot-password" className="text-gray-500 hover:text-gray-300">
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>

        {/* What you get */}
        <div className="mt-6 bg-kp-surface border border-kp-border rounded-xl px-6 py-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Members get access to</p>
          <ul className="space-y-2">
            {[
              'Personal Profile & Contact Info',
              'Alumni Directory',
              'Big Brother Tree',
              'Chapter Eternal Memorial',
              'Board Minutes & Financial Reports',
            ].map(item => (
              <li key={item} className="flex gap-2 text-gray-300 text-sm">
                <span className="text-kp-gold text-xs mt-0.5">◆</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Need help?{' '}
            <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">
              kappaphi@kappa-phi.org
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
