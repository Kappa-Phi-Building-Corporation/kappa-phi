-- Kappa Phi Building Corporation - Database Schema
-- Run this in the Supabase SQL editor after creating your project

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_number    TEXT UNIQUE,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  pledge_class    TEXT,
  big_brother_id  UUID REFERENCES public.profiles(id),
  email           TEXT,
  phone           TEXT,
  address_street  TEXT,
  address_city    TEXT,
  address_state   TEXT,
  address_zip     TEXT,
  graduation_year INTEGER,
  employer        TEXT,
  occupation      TEXT,
  bio             TEXT,
  is_deceased     BOOLEAN DEFAULT FALSE,
  is_missing      BOOLEAN DEFAULT FALSE,
  is_approved     BOOLEAN DEFAULT FALSE,  -- admin can approve new registrations
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read any approved profile (for member directory)
CREATE POLICY "Approved members can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_approved = TRUE
    )
  );

-- Users can always read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Index for family tree queries
CREATE INDEX idx_profiles_big_brother ON public.profiles(big_brother_id);
