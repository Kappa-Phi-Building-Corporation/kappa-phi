'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '../users/actions'
import { createAdminClient } from '@/lib/supabase/admin'

export async function assignBigBrothers(formData: FormData) {
  await requireAdmin()
  const admin = createAdminClient()

  // Only rows where the admin actually picked someone get touched — everyone
  // else's record (including other members still missing a big brother) is
  // left untouched.
  const updates: { id: string; big_brother_id: string }[] = []
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('bb_')) continue
    const bigBrotherId = (value as string)?.trim()
    if (!bigBrotherId) continue
    updates.push({ id: key.slice(3), big_brother_id: bigBrotherId })
  }

  for (const u of updates) {
    await admin.from('members').update({ big_brother_id: u.big_brother_id }).eq('id', u.id)
  }

  revalidatePath('/admin/big-brother')
  revalidatePath('/admin')
  revalidatePath('/alumni/tree')
  revalidatePath('/alumni/directory')
  redirect(`/admin/big-brother?success=${updates.length}`)
}
