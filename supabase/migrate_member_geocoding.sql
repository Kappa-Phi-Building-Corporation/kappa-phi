-- Adds geocoded coordinates to members for the alumni directory map view.
-- Run in Supabase SQL Editor.

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

COMMENT ON COLUMN public.members.lat IS 'Geocoded latitude. Auto-populated when address is saved via admin.';
COMMENT ON COLUMN public.members.lng IS 'Geocoded longitude. Auto-populated when address is saved via admin.';
