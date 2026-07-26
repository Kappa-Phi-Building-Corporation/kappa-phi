'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/activityLog'
import { SITE_CONTENT_DEFAULTS, type SiteContentKey } from '@/lib/siteContent'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')
  return admin
}

export async function updateSiteContent(formData: FormData) {
  const admin = await assertAdmin()

  const keys = Object.keys(SITE_CONTENT_DEFAULTS) as SiteContentKey[]
  const rows = keys.map(key => ({
    key,
    value: ((formData.get(key) as string) ?? '').trim() || SITE_CONTENT_DEFAULTS[key],
    updated_at: new Date().toISOString(),
  }))

  const { error } = await admin.from('site_content').upsert(rows, { onConflict: 'key' })
  if (error) redirect('/admin/content?error=' + encodeURIComponent(error.message))

  await logActivity(admin, { action: 'update', entityType: 'site_content', entityLabel: 'Homepage & About copy' })

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/content')
  redirect('/admin/content?success=1')
}
