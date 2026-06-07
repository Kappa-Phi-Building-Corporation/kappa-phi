'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/portal')
  return user.id
}

export async function approveUser(userId: string) {
  await requireAdmin()
  const admin = createAdminClient()
  await admin.from('profiles').update({ is_approved: true }).eq('id', userId)
  revalidatePath('/admin/users')
}

export async function approveLinkUser(formData: FormData) {
  await requireAdmin()
  const userId   = formData.get('userId')   as string
  const memberId = (formData.get('memberId') as string) || null
  if (!userId) return
  const admin = createAdminClient()
  await admin.from('profiles').update({ is_approved: true, member_id: memberId }).eq('id', userId)
  revalidatePath('/admin/users')
}

export async function denyUser(userId: string) {
  await requireAdmin()
  const admin = createAdminClient()
  // Delete only the profile (account) — the member record is preserved
  await admin.from('profiles').delete().eq('id', userId)
  await admin.auth.admin.deleteUser(userId)
  revalidatePath('/admin/users')
}

export async function setRole(userId: string, role: 'member' | 'admin') {
  await requireAdmin()
  const admin = createAdminClient()
  await admin.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin/users')
}
