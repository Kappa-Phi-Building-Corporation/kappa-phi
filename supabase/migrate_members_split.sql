-- ============================================================
-- MIGRATION: Split profiles into members + profiles
-- Run in: Supabase Dashboard → SQL Editor
--
-- Before: profiles (id = auth.users.id, all member data + auth)
-- After:  members  (id = own UUID, all member data)
--         profiles (id = auth.users.id, member_id FK, is_approved, role)
--
-- IDs are preserved in members so big_brother_id links remain valid.
-- ============================================================

-- ── 1. Create the new members table ──────────────────────────
CREATE TABLE IF NOT EXISTS public.members (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                   TEXT,
  first_name              TEXT,
  last_name               TEXT,
  nickname                TEXT,
  badge_number            TEXT,
  pledge_class            TEXT,
  graduation_year         INT,
  big_brother_id          UUID REFERENCES public.members(id) ON DELETE SET NULL,
  -- Contact
  home_phone              TEXT,
  mobile_phone            TEXT,
  phone                   TEXT,
  alternate_phone         TEXT,
  work_phone              TEXT,
  email                   TEXT,
  alternate_email         TEXT,
  -- Address
  address_street          TEXT,
  address_city            TEXT,
  address_state           TEXT,
  address_zip             TEXT,
  -- Professional
  employer                TEXT,
  occupation              TEXT,
  bio                     TEXT,
  -- Spouse / Family
  spouse_title            TEXT,
  spouse_first_name       TEXT,
  spouse_last_name        TEXT,
  marital_status          TEXT,
  -- Chapter involvement
  completed_undergraduate BOOLEAN NOT NULL DEFAULT FALSE,
  completed_graduate      BOOLEAN NOT NULL DEFAULT FALSE,
  member_kpbc             BOOLEAN NOT NULL DEFAULT FALSE,
  member_advisory         BOOLEAN NOT NULL DEFAULT FALSE,
  past_member_kpbc        BOOLEAN NOT NULL DEFAULT FALSE,
  past_member_advisory    BOOLEAN NOT NULL DEFAULT FALSE,
  -- Admin flags (stored on member record)
  do_not_mail             BOOLEAN NOT NULL DEFAULT FALSE,
  dnm_reason              TEXT,
  hide_entry              BOOLEAN NOT NULL DEFAULT FALSE,
  is_deceased             BOOLEAN NOT NULL DEFAULT FALSE,
  is_missing              BOOLEAN NOT NULL DEFAULT FALSE,
  -- Timestamps
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. Copy existing profile data into members (preserve IDs) ─
--    Preserving IDs means all existing big_brother_id values remain valid.
INSERT INTO public.members (
  id, title, first_name, last_name, nickname, badge_number, pledge_class, graduation_year,
  big_brother_id, home_phone, mobile_phone, phone, alternate_phone, work_phone,
  email, alternate_email, address_street, address_city, address_state, address_zip,
  employer, occupation, bio, spouse_title, spouse_first_name, spouse_last_name, marital_status,
  completed_undergraduate, completed_graduate,
  member_kpbc, member_advisory, past_member_kpbc, past_member_advisory,
  do_not_mail, dnm_reason, hide_entry, is_deceased, is_missing,
  created_at, updated_at
)
SELECT
  id, title, first_name, last_name, nickname, badge_number, pledge_class, graduation_year,
  big_brother_id, home_phone, mobile_phone, phone, alternate_phone, work_phone,
  email, alternate_email, address_street, address_city, address_state, address_zip,
  employer, occupation, bio, spouse_title, spouse_first_name, spouse_last_name, marital_status,
  COALESCE(completed_undergraduate, FALSE),
  COALESCE(completed_graduate, FALSE),
  COALESCE(member_kpbc, FALSE),
  COALESCE(member_advisory, FALSE),
  COALESCE(past_member_kpbc, FALSE),
  COALESCE(past_member_advisory, FALSE),
  COALESCE(do_not_mail, FALSE),
  dnm_reason,
  COALESCE(hide_entry, FALSE),
  COALESCE(is_deceased, FALSE),
  COALESCE(is_missing, FALSE),
  created_at, updated_at
FROM public.profiles
ON CONFLICT (id) DO NOTHING;

-- ── 3. Create new slim profiles table ─────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles_v2 (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id   UUID REFERENCES public.members(id) ON DELETE SET NULL,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  role        TEXT    NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. Migrate real user accounts (skip test dummy users) ─────
--    Profiles whose auth email ends with @test.kp were created by
--    the dummy data SQL and have no real login; leave them out.
INSERT INTO public.profiles_v2 (id, member_id, is_approved, role, created_at, updated_at)
SELECT p.id,
       p.id   AS member_id,   -- member.id = old profile.id (same UUID)
       p.is_approved,
       p.role,
       p.created_at,
       p.updated_at
FROM public.profiles p
INNER JOIN auth.users au ON au.id = p.id
WHERE au.email NOT LIKE '%@test.kp'
ON CONFLICT (id) DO NOTHING;

-- ── 5. Updated-at trigger for members ─────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS members_updated_at ON public.members;
CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS profiles_v2_updated_at ON public.profiles_v2;
CREATE TRIGGER profiles_v2_updated_at
  BEFORE UPDATE ON public.profiles_v2
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── 6. Enable RLS on members ──────────────────────────────────
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Any approved user can read all members (directory / tree)
CREATE POLICY "Approved users read members"
  ON public.members FOR SELECT
  USING (public.is_approved_member());

-- Admins can do everything
CREATE POLICY "Admins manage members"
  ON public.members FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 7. Enable RLS on new profiles ────────────────────────────
ALTER TABLE public.profiles_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
  ON public.profiles_v2 FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users insert own profile"
  ON public.profiles_v2 FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles_v2 FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins manage profiles"
  ON public.profiles_v2 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 8. Swap tables ────────────────────────────────────────────
ALTER TABLE public.profiles  RENAME TO profiles_old;
ALTER TABLE public.profiles_v2 RENAME TO profiles;

-- ── 9. Index for tree / directory queries ─────────────────────
CREATE INDEX IF NOT EXISTS idx_members_big_brother ON public.members(big_brother_id);
CREATE INDEX IF NOT EXISTS idx_members_badge       ON public.members(badge_number);

-- ── Done ──────────────────────────────────────────────────────
-- The old data is preserved in profiles_old for safety.
--
-- Optional cleanup (run after verifying the app works):
--   DELETE FROM auth.users WHERE email LIKE '%@test.kp';
--   DROP TABLE public.profiles_old;
