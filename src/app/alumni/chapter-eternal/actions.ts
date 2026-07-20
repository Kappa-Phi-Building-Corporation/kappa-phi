'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function addMemory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/alumni/chapter-eternal')

  const memberId = formData.get('member_id') as string
  const message = ((formData.get('message') as string) ?? '').trim()
  if (!memberId) redirect('/alumni/chapter-eternal')
  if (!message) redirect(`/alumni/chapter-eternal?memory=${memberId}`)

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('member_id').eq('id', user.id).single()

  const meta = (user.user_metadata ?? {}) as Record<string, string>
  let authorName = `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim()

  if (!authorName && profile?.member_id) {
    const { data: linkedMember } = await admin
      .from('members')
      .select('first_name, last_name')
      .eq('id', profile.member_id)
      .single()
    if (linkedMember?.first_name) {
      authorName = `${linkedMember.first_name} ${linkedMember.last_name ?? ''}`.trim()
    }
  }

  if (!authorName) authorName = user.email ?? 'A member'

  await admin.from('chapter_eternal_memories').insert({
    member_id: memberId,
    author_profile_id: user.id,
    author_name: authorName,
    message,
  })

  revalidatePath('/alumni/chapter-eternal')
  redirect(`/alumni/chapter-eternal?memory=${memberId}#memories`)
}

export async function deleteMemory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/alumni/chapter-eternal')

  const id = formData.get('id') as string
  const memberId = formData.get('member_id') as string

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'website_admin'

  let query = admin.from('chapter_eternal_memories').delete().eq('id', id)
  if (!isAdmin) query = query.eq('author_profile_id', user.id)
  await query

  revalidatePath('/alumni/chapter-eternal')
  redirect(`/alumni/chapter-eternal?memory=${memberId}#memories`)
}
