-- Bug fix: the 'suspended' member status was added to the app (memberStatus.ts)
-- but the database CHECK constraint from migrate_member_status.sql still only
-- allows ('active_ug', 'alumni', 'expelled_other'), so saving a member as
-- Suspended would fail at the database level. Run in Supabase SQL Editor.

DO $$
DECLARE
  con record;
BEGIN
  FOR con IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.members'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%member_status%'
  LOOP
    EXECUTE format('ALTER TABLE public.members DROP CONSTRAINT %I', con.conname);
  END LOOP;
END $$;

ALTER TABLE public.members
  ADD CONSTRAINT members_member_status_check
  CHECK (member_status IN ('active_ug', 'alumni', 'suspended', 'expelled_other'));
