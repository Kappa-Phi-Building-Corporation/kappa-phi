-- Giving levels shown on the public Capital Campaign page (/campaign).
-- amount_label is free text (e.g. "$10,000+" or "$500 – $999") rather than a
-- number so admins can express ranges and open-ended top tiers. Not seeded —
-- the campaign page hides the section until at least one level is published.

create table campaign_giving_levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount_label text not null,
  description text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index campaign_giving_levels_sort_order_idx on campaign_giving_levels (sort_order);

alter table campaign_giving_levels enable row level security;

create policy "Admins can view giving levels"
  on campaign_giving_levels for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );
