'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const updates = {
    id: user.id,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    badge_number: formData.get('badge_number') as string || null,
    pledge_class: formData.get('pledge_class') as string || null,
    email: formData.get('email') as string || null,
    phone: formData.get('phone') as string || null,
    address_street: formData.get('address_street') as string || null,
    address_city: formData.get('address_city') as string || null,
    address_state: formData.get('address_state') as string || null,
    address_zip: formData.get('address_zip') as string || null,
    graduation_year: formData.get('graduation_year')
      ? parseInt(formData.get('graduation_year') as string)
      : null,
    employer: formData.get('employer') as string || null,
    occupation: formData.get('occupation') as string || null,
    bio: formData.get('bio') as string || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('profiles').upsert(updates)

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/profile')
  redirect('/profile?saved=1')
}
