import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePassword } from '@/app/auth/actions'

export const metadata = { title: 'Set New Password' }

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/forgot-password')

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-kp-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-kp-gold font-black text-lg">ΔΤΔ</span>
          </div>
          <h1 className="text-3xl font-black text-white">Set New Password</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Choose a new password for your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm flex gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <form action={updatePassword} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">
                New Password
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

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full bg-kp-card border border-kp-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-kp-gold text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm mt-2"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
