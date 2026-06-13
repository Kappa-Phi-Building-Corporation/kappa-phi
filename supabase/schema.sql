-- Kappa Phi Building Corporation — Database Schema
-- Run this in the Supabase SQL editor for a fresh project.
-- For an existing project, use supabase/migrate_members_split.sql instead.

-- ── members: every fraternity member, independent of auth ─────
CREATE TABLE public.members (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                   TEXT,
  first_name              TEXT,
  last_name               TEXT,
  nickname                TEXT,
  badge_number            TEXT,
  pledge_class            TEXT,
  graduation_year         INT,
  degrees                 TEXT,
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
  address_updated_at      TIMESTAMPTZ,
  address_updated_by      TEXT,
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
  -- Admin flags
  member_status           TEXT NOT NULL DEFAULT 'alumni'
    CHECK (member_status IN ('active_ug', 'alumni', 'expelled_other')),
  do_not_mail             BOOLEAN NOT NULL DEFAULT FALSE,
  dnm_reason              TEXT,
  hide_entry              BOOLEAN NOT NULL DEFAULT FALSE,
  is_deceased             BOOLEAN NOT NULL DEFAULT FALSE,
  is_missing              BOOLEAN NOT NULL DEFAULT FALSE,
  admin_notes             TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_members_big_brother ON public.members(big_brother_id);
CREATE INDEX idx_members_badge       ON public.members(badge_number);

-- ── profiles: slim auth account linked (optionally) to a member
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id   UUID REFERENCES public.members(id) ON DELETE SET NULL,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  role        TEXT    NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'website_admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Triggers ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── Helper functions (SECURITY DEFINER avoids RLS recursion) ─
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_approved_member()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = TRUE);
$$;

-- ── RLS: members ─────────────────────────────────────────────
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved users read members"
  ON public.members FOR SELECT
  USING (public.is_approved_member());

CREATE POLICY "Admins manage members"
  ON public.members FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── RLS: profiles ────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins manage profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── Grant first admin ─────────────────────────────────────────
-- UPDATE public.profiles SET role = 'admin', is_approved = TRUE
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
