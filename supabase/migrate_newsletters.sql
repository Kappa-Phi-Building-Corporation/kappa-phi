-- Newsletters (PDFs) listed on the public /newsletters page and managed under
-- /admin/newsletters. The PDF itself lives in the "newsletters" Storage bucket,
-- which the admin upload flow creates automatically (public, PDF-only, 50 MB
-- max) the first time a newsletter is uploaded — no dashboard step needed.

create table if not exists newsletters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issue_date date not null,
  description text,
  file_path text not null,
  file_url text not null,
  file_size bigint,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists newsletters_issue_date_idx on newsletters (issue_date desc);

alter table newsletters enable row level security;

drop policy if exists "Admins can view newsletters" on newsletters;
create policy "Admins can view newsletters"
  on newsletters for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'website_admin')
    )
  );
