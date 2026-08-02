-- Closes the Supabase Security Advisor "Public Can Execute SECURITY
-- DEFINER Function" findings for is_admin(), is_approved_member(), and
-- log_site_visit(). Postgres grants EXECUTE to PUBLIC by default on every
-- new function unless explicitly revoked — none of these three ever had
-- that revoked, so they were callable (harmlessly, each one no-ops for an
-- unauthenticated caller via auth.uid()) by anonymous requests. Revoking
-- PUBLIC and granting only to authenticated matches how they're actually
-- used: as RLS-policy helpers and, for log_site_visit, from proxy.ts on
-- behalf of a signed-in user.

revoke execute on function public.is_admin() from public;
revoke execute on function public.is_approved_member() from public;
revoke execute on function public.log_site_visit(text, text) from public;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_approved_member() to authenticated;
-- log_site_visit already has "grant ... to authenticated" from
-- migrate_site_visits.sql — only the public revoke above was missing.
