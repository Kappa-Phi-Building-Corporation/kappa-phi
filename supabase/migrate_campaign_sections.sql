-- The "What We're Building" renderings/vision sections on the public
-- /campaign page, previously hardcoded, now fully admin-managed at
-- /admin/campaign-sections (title, rich-text body, and one or more photos
-- each). The "campaign-photos" Storage bucket is created automatically on
-- first upload (public, image-only, 8 MB/file max) — no dashboard step
-- needed, same as the "newsletters" bucket.
--
-- Seeded with the three sections that were previously hardcoded, pointing at
-- the same bundled image files under /public/images/campaign/, so nothing
-- disappears from the live page once this migration runs. Admins can freely
-- edit, reorder, add photos to, or delete these afterward.

create table if not exists campaign_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists campaign_section_photos (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references campaign_sections(id) on delete cascade,
  photo_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists campaign_sections_sort_order_idx on campaign_sections (sort_order);
create index if not exists campaign_section_photos_section_id_idx on campaign_section_photos (section_id);

alter table campaign_sections enable row level security;
alter table campaign_section_photos enable row level security;

drop policy if exists "Admins can view campaign sections" on campaign_sections;
create policy "Admins can view campaign sections"
  on campaign_sections for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );

drop policy if exists "Admins can view campaign section photos" on campaign_section_photos;
create policy "Admins can view campaign section photos"
  on campaign_section_photos for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );

do $$
declare
  multipurpose_id uuid;
  crest_id uuid;
  living_room_id uuid;
begin
  if not exists (select 1 from campaign_sections) then
    insert into campaign_sections (title, body, sort_order) values
      ('Multi-Purpose Room',
       'The lower level becomes a true gathering space: a full kitchen, a large video wall for game days and chapter meetings, and long tables that seat the whole chapter for meals, study, and events.',
       0)
      returning id into multipurpose_id;
    insert into campaign_section_photos (section_id, photo_url, caption, sort_order) values
      (multipurpose_id, '/images/campaign/multipurpose-room-option-1.jpg', 'Multi-Purpose Room — Design Option 1', 0),
      (multipurpose_id, '/images/campaign/multipurpose-room-option-2.jpg', 'Multi-Purpose Room — Design Option 2', 1);

    insert into campaign_sections (title, body, sort_order) values
      ('Custom Coat of Arms Flooring',
       'The fraternity coat of arms inlaid in the floor of the multi-purpose room.',
       5)
      returning id into crest_id;
    insert into campaign_section_photos (section_id, photo_url, caption, sort_order) values
      (crest_id, '/images/campaign/crest-flooring-option-1.jpg', 'Custom Coat of Arms Flooring — Design Option 1', 0),
      (crest_id, '/images/campaign/crest-flooring-option-2.jpg', 'Custom Coat of Arms Flooring — Design Option 2', 1);

    insert into campaign_sections (title, body, sort_order) values
      ('Living Room',
       'A warmer, updated living room built around a stone fireplace, new flooring, and space for the chapter''s history on the walls.',
       10)
      returning id into living_room_id;
    insert into campaign_section_photos (section_id, photo_url, caption, sort_order) values
      (living_room_id, '/images/campaign/living-room.jpg', 'Living Room', 0);
  end if;
end $$;
