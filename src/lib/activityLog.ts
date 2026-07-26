import type { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type ActivityAction = 'create' | 'update' | 'delete' | 'approve' | 'deny'

export type ActivityEntityType =
  | 'member'
  | 'board_member'
  | 'property_project'
  | 'chapter_honor'
  | 'chapter_mascot'
  | 'chapter_eternal'
  | 'event'
  | 'portal_resource'
  | 'pats_guide'
  | 'pats_guide_section'
  | 'pats_guide_photo'
  | 'user_account'
  | 'big_brother'
  | 'change_request'
  | 'link_request'

export async function logActivity(
  admin: ReturnType<typeof createAdminClient>,
  params: {
    action: ActivityAction
    entityType: ActivityEntityType
    entityId?: string | null
    entityLabel: string
  },
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const meta = (user?.user_metadata ?? {}) as Record<string, string>
  const actorName = `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim() || user?.email || 'Admin'

  await admin.from('admin_activity_log').insert({
    actor_id: user?.id ?? null,
    actor_name: actorName,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    entity_label: params.entityLabel,
  })
}
