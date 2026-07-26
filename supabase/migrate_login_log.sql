-- Login log: records each successful sign-in so admins can see who has
-- actually logged into the site, and when.

create table login_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  name text,
  created_at timestamptz not null default now()
);

create index login_log_created_at_idx on login_log (created_at desc);
create index login_log_user_id_idx on login_log (user_id);

alter table login_log enable row level security;

create policy "Admins can view login log"
  on login_log for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
