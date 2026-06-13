import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Kappa Phi Building Corporation', template: '%s | Kappa Phi BC' },
  description: 'Supporting the Epsilon Nu Chapter of Delta Tau Delta Fraternity at Missouri University of Science & Technology.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let navUser: { email: string; firstName?: string; isAdmin: boolean; adminPendingCount?: number } | null = null

  if (user) {
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const meta = (user.user_metadata ?? {}) as Record<string, string>
    const isAdmin = profile?.role === 'admin'
    const isWebsiteAdmin = profile?.role === 'website_admin'

    let adminPendingCount: number | undefined
    if (isAdmin) {
      const [
        { count: pendingUsers },
        { count: pendingLinks },
        { count: pendingChanges },
        { count: eternalPending },
      ] = await Promise.all([
        admin.from('profiles').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        admin.from('profiles').select('*', { count: 'exact', head: true }).in('link_request_status', ['pending', 'conflict']),
        admin.from('member_change_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        admin.from('members').select('*', { count: 'exact', head: true }).eq('is_deceased', true).is('passing_date', null),
      ])
      adminPendingCount = (pendingUsers ?? 0) + (pendingLinks ?? 0) + (pendingChanges ?? 0) + (eternalPending ?? 0)
    } else if (isWebsiteAdmin) {
      const { count: eternalPending } = await admin.from('members')
        .select('*', { count: 'exact', head: true })
        .eq('is_deceased', true)
        .is('passing_date', null)
      adminPendingCount = eternalPending ?? 0
    }

    navUser = {
      email: user.email ?? '',
      firstName: meta.first_name || undefined,
      isAdmin: isAdmin || isWebsiteAdmin,
      adminPendingCount,
    }
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-kp-dark text-white min-h-screen flex flex-col antialiased">
        <Navigation navUser={navUser} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
