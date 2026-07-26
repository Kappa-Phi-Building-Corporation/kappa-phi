'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendUserApprovedEmail } from '@/lib/email'
import { logActivity } from '@/lib/activityLog'

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

async function notifyUserApproved(admin: ReturnType<typeof createAdminClient>, userId: string) {
  const { data } = await admin.auth.admin.getUserById(userId)
  const authUser = data.user
  if (!authUser?.email) return
  const meta = (authUser.user_metadata ?? {}) as Record<string, string>
  const name = `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim()
  await sendUserApprovedEmail(name, authUser.email)
}

async function userLabel(admin: ReturnType<typeof createAdminClient>, userId: string) {
  const { data } = await admin.auth.admin.getUserById(userId)
  const authUser = data.user
  if (!authUser) return 'User account'
  const meta = (authUser.user_metadata ?? {}) as Record<string, string>
  return `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim() || authUser.email || 'User account'
}

export async function approveUser(userId: string) {
  await requireAdmin()
  const admin = createAdminClient()
  const label = await userLabel(admin, userId)
  await admin.from('profiles').update({ is_approved: true }).eq('id', userId)
  await notifyUserApproved(admin, userId)
  await logActivity(admin, { action: 'approve', entityType: 'user_account', entityId: userId, entityLabel: label })
  revalidatePath('/admin/users')
}

export async function approveLinkUser(formData: FormData) {
  await requireAdmin()
  const userId   = formData.get('userId')   as string
  const memberId = (formData.get('memberId') as string) || null
  if (!userId) return
  const admin = createAdminClient()
  const label = await userLabel(admin, userId)
  await admin.from('profiles').update({ is_approved: true, member_id: memberId }).eq('id', userId)
  await notifyUserApproved(admin, userId)
  await logActivity(admin, { action: 'approve', entityType: 'user_account', entityId: userId, entityLabel: label })
  revalidatePath('/admin/users')
}

export async function denyUser(userId: string) {
  await requireAdmin()
  const admin = createAdminClient()
  const label = await userLabel(admin, userId)
  // Delete only the profile (account) — the member record is preserved
  await admin.from('profiles').delete().eq('id', userId)
  await admin.auth.admin.deleteUser(userId)
  await logActivity(admin, { action: 'deny', entityType: 'user_account', entityId: userId, entityLabel: label })
  revalidatePath('/admin/users')
}

export async function setRole(userId: string, role: 'member' | 'admin' | 'website_admin') {
  await requireAdmin()
  const admin = createAdminClient()
  const label = await userLabel(admin, userId)
  const { error } = await admin.from('profiles').update({ role }).eq('id', userId)
  if (error) throw new Error(error.message)
  await logActivity(admin, { action: 'update', entityType: 'user_account', entityId: userId, entityLabel: `${label} → role: ${role}` })
  revalidatePath('/admin/users')
}
