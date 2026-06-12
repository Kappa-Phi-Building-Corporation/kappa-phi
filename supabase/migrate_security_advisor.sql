-- Fixes for Supabase Security Advisor warnings. Run in Supabase SQL Editor.

-- "Function Search Path Mutable" — public.update_updated_at
-- Pin the search_path so the function can't be hijacked by objects
-- created earlier in an unqualified search path.
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- "Public/Signed-In Users Can Execute SECURITY DEFINER Function" — public.handle_new_user
-- This is only ever invoked by the on_auth_user_created trigger, so no
-- role needs to call it directly via the API.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
