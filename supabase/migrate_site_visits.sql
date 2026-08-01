-- Site visits: tracks actual ongoing site access (not just the login
-- moment), since a session cookie can sit unused for weeks. One row per
-- user per calendar day, updated via an atomic upsert on every request
-- from src/proxy.ts — cheap enough to call on every navigation without
-- adding read-then-write latency to the request.

create table site_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  name text,
  visit_date date not null default current_date,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  request_count integer not null default 1,
  unique (user_id, visit_date)
);

create index site_visits_last_seen_at_idx on site_visits (last_seen_at desc);

alter table site_visits enable row level security;

create policy "Admins can view site visits"
  on site_visits for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Derives the acting user from the request's own JWT (auth.uid()), so a
-- caller can never write a visit row for anyone but themselves — proxy.ts
-- calls this with only the anon-key, cookie-scoped client, never service role.
create or replace function log_site_visit(p_email text, p_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return;
  end if;

  insert into site_visits (user_id, email, name, visit_date, first_seen_at, last_seen_at, request_count)
  values (v_user_id, p_email, p_name, current_date, now(), now(), 1)
  on conflict (user_id, visit_date)
  do update set
    last_seen_at = now(),
    request_count = site_visits.request_count + 1,
    email = excluded.email,
    name = excluded.name;
end;
$$;

grant execute on function log_site_visit(text, text) to authenticated;
