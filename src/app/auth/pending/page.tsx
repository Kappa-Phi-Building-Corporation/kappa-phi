import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'

export const metadata = { title: 'Account Pending Approval' }

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user
    ? (user.user_metadata?.first_name as string | undefined)
    : undefined

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-kp-surface border border-kp-border rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⏳</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">
          {name ? `Hi, ${name}!` : 'Account Pending'}
        </h1>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Your account is awaiting approval from the site administrator. You will have full
          access to the alumni portal once your account is approved.
        </p>

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 text-sm text-gray-400 text-left space-y-2 mb-6">
          <p className="font-semibold text-white">Need access sooner?</p>
          <p>
            Email{' '}
            <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">
              kappaphi@kappa-phi.org
            </a>{' '}
            and include your name and badge number if known.
          </p>
        </div>

        {user && (
          <form action={logout}>
            <button
              type="submit"
              className="border border-kp-border text-gray-500 px-5 py-2.5 rounded-lg text-sm hover:border-kp-gold hover:text-kp-gold transition-colors"
            >
              Sign Out
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
