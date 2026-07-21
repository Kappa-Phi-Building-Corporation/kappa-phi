import { createAdminClient } from '@/lib/supabase/admin'
import { sendAdminNewUserEmail } from '@/lib/email'

// Prefer the name the user signed up with; fall back to a linked member record, then email.
export async function notifyAdminOfNewUser(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  userEmail: string | null,
  userMeta: Record<string, string>,
) {
  let userName = `${userMeta.first_name ?? ''} ${userMeta.last_name ?? ''}`.trim()

  if (!userName) {
    const { data: profile } = await admin.from('profiles').select('member_id').eq('id', userId).single()
    if (profile?.member_id) {
      const { data: member } = await admin
        .from('members')
        .select('first_name, last_name')
        .eq('id', profile.member_id)
        .single()
      if (member?.first_name) userName = `${member.first_name} ${member.last_name ?? ''}`.trim()
    }
  }

  await sendAdminNewUserEmail(userName || userEmail || 'Unknown', userEmail ?? '')
}
