import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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

  let navUser: { email: string; firstName?: string; isAdmin: boolean } | null = null

  if (user) {
    const { data: profile } = await createAdminClient()
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const meta = (user.user_metadata ?? {}) as Record<string, string>

    navUser = {
      email: user.email ?? '',
      firstName: meta.first_name || undefined,
      isAdmin: profile?.role === 'admin',
    }
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-kp-dark text-white min-h-screen flex flex-col antialiased">
        <Navigation navUser={navUser} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
