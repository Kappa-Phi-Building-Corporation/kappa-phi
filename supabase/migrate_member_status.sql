-- Add member status (Active/UG, Alumni, Expelled/Other) and admin notes to members.

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS member_status TEXT NOT NULL DEFAULT 'alumni'
    CHECK (member_status IN ('active_ug', 'alumni', 'expelled_other'));

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;
