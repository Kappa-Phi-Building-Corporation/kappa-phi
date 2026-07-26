-- Admin activity/audit log: records who did what across member and content edits.
-- Written only via the service-role client from server actions, so RLS here is
-- read-only defense in depth (admin pages already gate access at the route level).

create table admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text not null,
  action text not null check (action in ('create', 'update', 'delete', 'approve', 'deny')),
  entity_type text not null,
  entity_id uuid,
  entity_label text not null,
  created_at timestamptz not null default now()
);

create index admin_activity_log_created_at_idx on admin_activity_log (created_at desc);
create index admin_activity_log_entity_type_idx on admin_activity_log (entity_type);

alter table admin_activity_log enable row level security;

create policy "Admins can view activity log"
  on admin_activity_log for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );
