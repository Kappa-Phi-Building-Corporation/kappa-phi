-- Email templates: lets admins edit the subject/body of system emails
-- without a code change. The app always falls back to a hardcoded
-- default when a key is missing, so this table only holds overrides.

create table email_templates (
  key text primary key,
  subject text not null,
  body_html text not null,
  updated_at timestamptz not null default now()
);

alter table email_templates enable row level security;

create policy "Admins can view email templates"
  on email_templates for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
