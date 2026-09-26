-- Adds a donor list to each giving level and seeds the giving societies from
-- the Spring 2025 campaign mailing (names, dollar ranges, recognition text).
-- Safe to run whether or not migrate_campaign_giving_levels.sql was already
-- run: everything here is idempotent, and the seed only inserts when the table
-- is empty, so it never overwrites levels edited in the admin.
--
-- Donor names are deliberately NOT seeded here — they are personal data and
-- shouldn't live in source control. Enter them per level at
-- /admin/giving-levels (Donors box, one name per line); they are shown
-- publicly on /campaign.

create table if not exists campaign_giving_levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount_label text not null,
  description text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table campaign_giving_levels add column if not exists donors text;

create index if not exists campaign_giving_levels_sort_order_idx on campaign_giving_levels (sort_order);

alter table campaign_giving_levels enable row level security;

drop policy if exists "Admins can view giving levels" on campaign_giving_levels;
create policy "Admins can view giving levels"
  on campaign_giving_levels for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );

do $$
begin
  if not exists (select 1 from campaign_giving_levels) then
    insert into campaign_giving_levels (name, amount_label, description, sort_order) values
      ('Legacy Society', '$100,000 and above',
        'Recognized on the permanent donor plaque at the house.', 0),
      ('Founders Society', '$75,000 – $99,999',
        'Recognized on the permanent donor plaque at the house.', 5),
      ('The 1964 Society', '$50,000 – $74,999',
        'Recognized on the permanent donor plaque at the house.', 10),
      ('Epsilon Nu Society', '$25,000 – $49,999',
        'Recognized on the permanent donor plaque at the house.', 15),
      ('Bethany Society', '$15,000 – $24,999',
        'Recognized on the permanent donor plaque at the house.', 20),
      ('April Society', '$10,000 – $14,999',
        'Recognized on the permanent donor plaque at the house.', 25),
      ('Street Painter Society', '$5,000 – $9,999',
        'Recognized on the permanent donor plaque at the house.', 30),
      ('Purple and Gold Society', '$2,500 – $4,999',
        'Recognized on the permanent donor plaque at the house.', 35),
      ('Rolla Society', '$1,000 – $2,499',
        'Recognized in campaign publications.', 40);
  end if;
end $$;
