import { requestPasswordReset } from '@/app/auth/actions'
import Link from 'next/link'

export const metadata = { title: 'Forgot Password' }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-kp-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-kp-gold font-black text-lg">ΔΤΔ</span>
          </div>
          <h1 className="text-3xl font-black text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <form action={requestPasswordReset} className="space-y-5">
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

            <button
              type="submit"
              className="w-full bg-kp-gold text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm mt-2"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-kp-border text-sm text-center">
            <Link href="/login" className="text-kp-gold hover:opacity-80">Back to Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
