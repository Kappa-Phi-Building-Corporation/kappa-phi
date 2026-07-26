-- Chapter milestones: the "Key Milestones" timeline on the About page,
-- previously hardcoded. Seeded with the entries the page already shows
-- so nothing goes blank after this migration runs.

create table chapter_milestones (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  event text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index chapter_milestones_sort_order_idx on chapter_milestones (sort_order);

alter table chapter_milestones enable row level security;

create policy "Admins can view chapter milestones"
  on chapter_milestones for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );

insert into chapter_milestones (year, event, sort_order) values
  ('1963', 'Kappa Phi Fraternity founded at University of Missouri School of Mines (Dec. 5)', 0),
  ('1964', 'Constitution adopted; first house purchased on eight acres along Vienna Road', 1),
  ('1965', 'Petitioned Delta Tau Delta; recognized as official DTD colony (Apr. 10)', 2),
  ('1966', 'Initiated into Delta Tau Delta as Epsilon Nu Chapter — 96th nationally (Dec. 10)', 3),
  ('1986', '20th anniversary banquet & mortgage burning ceremony on Homecoming weekend', 4),
  ('1991', 'First Court of Honor Award — top 24 of 124 DTD chapters nationally', 5),
  ('1999', 'Major chapter house expansion completed', 6),
  ('2000', 'First Hugh Shields Award for Chapter Excellence', 7),
  ('2004', 'Second Hugh Shields Award for Chapter Excellence', 8),
  ('2006', 'Third Hugh Shields Award for Chapter Excellence', 9),
  ('2016', '50th anniversary as Epsilon Nu Chapter of Delta Tau Delta', 10),
  ('2021', 'Fourth Hugh Shields Award for Chapter Excellence', 11),
  ('2022', 'Fifth Hugh Shields Award for Chapter Excellence', 12);
