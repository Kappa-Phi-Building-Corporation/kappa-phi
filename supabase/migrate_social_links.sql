-- Social media links shown in the "Stay up to date" strip on the Events
-- page. A real list (not fixed fields) so admins can add any number of
-- platforms. Seeded with the two links that were previously hardcoded so
-- nothing disappears once this migration runs.

create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null default 'other',
  label text not null,
  url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index social_links_sort_order_idx on social_links (sort_order);

alter table social_links enable row level security;

create policy "Admins can view social links"
  on social_links for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );

insert into social_links (platform, label, url, sort_order) values
  ('facebook', 'Facebook', 'https://www.facebook.com/endelts', 0),
  ('instagram', 'Instagram', 'https://www.instagram.com/rolladelts/', 1);
