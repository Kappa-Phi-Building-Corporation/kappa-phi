'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyAdminOfNewUser } from '@/lib/notifyNewUser'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error || !authData.user) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? 'Login failed')}`)
  }

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('is_approved')
    .eq('id', authData.user.id)
    .single()

  if (!profile?.is_approved) {
    await supabase.auth.signOut()
    redirect('/auth/pending')
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email    = formData.get('email')     as string
  const password = formData.get('password')  as string
  const firstName = formData.get('firstName') as string
  const lastName  = formData.get('lastName')  as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/confirm`,
    },
  })

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  const admin = data.user ? createAdminClient() : null
  if (data.user && admin) {
    // Trigger handles this in normal flow; upsert here as a fallback.
    await admin.from('profiles').upsert(
      { id: data.user.id, member_id: null, is_approved: false, role: 'member' },
      { onConflict: 'id', ignoreDuplicates: true }
    )
  }

  revalidatePath('/', 'layout')

  // With email confirmation disabled, signUp returns a session immediately —
  // there's no confirmation link for the user to click, so /auth/confirm
  // (which normally sends the admin notification) never runs. Notify here
  // instead so this path isn't silently unnotified.
  if (data.session && data.user && admin) {
    const meta = (data.user.user_metadata ?? {}) as Record<string, string>
    notifyAdminOfNewUser(admin, data.user.id, data.user.email ?? null, meta).catch(console.error)
    await supabase.auth.signOut()
    redirect('/auth/pending')
  }

  redirect('/auth/check-email')
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/confirm?next=/auth/update-password`,
  })

  // Always show the same confirmation, whether or not the email is registered.
  redirect('/auth/reset-password-sent')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect('/auth/update-password?error=' + encodeURIComponent('Passwords do not match'))
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    redirect('/auth/update-password?error=' + encodeURIComponent(error.message))
  }

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login?reset=1')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
