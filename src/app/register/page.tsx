import { register } from '@/app/auth/actions'
import Link from 'next/link'

export default async function RegisterPage({
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
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Join the Epsilon Nu alumni network
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm flex gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <form action={register} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                  placeholder="Smith"
                />
              </div>
            </div>

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
                minLength={8}
                autoComplete="new-password"
                className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                placeholder="Minimum 8 characters"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-kp-gold text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm mt-2"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-kp-border text-sm text-center">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/login" className="text-kp-gold hover:opacity-80">Sign in</Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-600 text-center leading-relaxed">
          Accounts may be reviewed by the site administrator. For immediate access or
          help with your badge number, email{' '}
          <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">kappaphi@kappa-phi.org</a>.
        </p>
      </div>
    </div>
  )
}
