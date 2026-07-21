import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyAdminOfNewUser } from '@/lib/notifyNewUser'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code       = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as EmailOtpType | null
  const next       = searchParams.get('next')

  const supabase = await createClient()
  let userId: string | null = null
  let userEmail: string | null = null
  let userMeta: Record<string, string> = {}
  let success = false

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      userId = data.user.id
      userEmail = data.user.email ?? null
      userMeta = (data.user.user_metadata ?? {}) as Record<string, string>
      success = true
    }
  } else if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error && data.user) {
      userId = data.user.id
      userEmail = data.user.email ?? null
      userMeta = (data.user.user_metadata ?? {}) as Record<string, string>
      success = true
    }
  }

  if (!success || !userId) {
    return NextResponse.redirect(new URL('/auth/email-confirmed?error=expired', origin))
  }

  // Password reset (and similar) flows keep the session active and continue elsewhere.
  if (next) {
    return NextResponse.redirect(new URL(next, origin))
  }

  const admin = createAdminClient()
  notifyAdminOfNewUser(admin, userId, userEmail, userMeta).catch(console.error)

  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/auth/email-confirmed', origin))
}
