'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

  if (data.user) {
    // Trigger handles this in normal flow; upsert here as a fallback.
    await createAdminClient().from('profiles').upsert(
      { id: data.user.id, member_id: null, is_approved: false, role: 'member' },
      { onConflict: 'id', ignoreDuplicates: true }
    )
  }

  revalidatePath('/', 'layout')

  // With email confirmation disabled, signUp returns a session and data.session
  // is set — send them to the pending-approval page instead.
  if (data.session) {
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
