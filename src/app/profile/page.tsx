import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import ProfileForm from './ProfileForm'

export const metadata = { title: 'My Profile' }

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; registered?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { saved, registered, error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              {profile?.first_name ? `Welcome back, ${profile.first_name}` : 'Your Profile'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="border border-kp-border text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-kp-gold hover:text-kp-gold transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Flash messages */}
        {saved && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl mb-6 text-sm flex gap-2">
            <span>✓</span> Profile saved successfully.
          </div>
        )}
        {registered && (
          <div className="bg-kp-blue/30 border border-kp-blue text-blue-200 px-4 py-3 rounded-xl mb-6 text-sm flex gap-2">
            <span>✓</span> Account created! Please fill out your profile below so other alumni can find you.
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Profile card */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <ProfileForm profile={profile} />
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Alumni Directory', href: '/alumni', soon: true },
            { label: 'Big Brother Tree', href: '/alumni/tree', soon: true },
            { label: 'Events & Calendar', href: '/events', soon: false },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className={`bg-kp-surface border border-kp-border rounded-xl px-4 py-3 text-sm no-underline text-center transition-colors ${
                item.soon
                  ? 'text-gray-600 cursor-default'
                  : 'text-kp-gold hover:border-kp-blue hover:bg-kp-card'
              }`}
            >
              {item.label}
              {item.soon && <span className="block text-xs text-gray-700 mt-0.5">Coming soon</span>}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
