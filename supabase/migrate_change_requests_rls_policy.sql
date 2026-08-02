-- Closes the Supabase Security Advisor "RLS Enabled No Policy" finding for
-- member_change_requests. RLS was enabled on this table at some point
-- (likely via the dashboard) with no tracked migration and no policy ever
-- added — with zero policies, RLS silently denies all access to every
-- role except service_role, which is all this app has ever used against
-- this table (both the admin review flow and the member's own submission
-- in profile/actions.ts go through createAdminClient()), so nothing was
-- broken. Adding the same admin-only SELECT policy used elsewhere in this
-- app as defense in depth.

create policy "Admins can view change requests"
  on public.member_change_requests for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
