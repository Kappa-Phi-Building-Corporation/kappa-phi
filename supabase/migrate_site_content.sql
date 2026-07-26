-- Site content: lightweight key/value store for homepage and About page
-- copy that admins can edit without a code change. The app always falls
-- back to a hardcoded default when a key is missing, so this table only
-- ever needs to hold overrides.

create table site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "Admins can view site content"
  on site_content for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );
