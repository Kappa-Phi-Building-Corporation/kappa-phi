-- Add a 'website_admin' role: full access to Website Administration panels
-- (Honor Rolls, Mascots, Board Members, Chapter Eternal, Property, Events,
-- Portal Resources), but no access to Member Administration panels and no
-- visibility of hidden alumni.

ALTER TABLE public.profiles DROP CONSTRAINT profiles_v2_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_v2_role_check
  CHECK (role IN ('member', 'admin', 'website_admin'));
