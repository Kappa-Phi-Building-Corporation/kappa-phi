-- Adds memorial-specific columns to members.
-- Run in Supabase SQL Editor.

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS initiation_date  DATE,
  ADD COLUMN IF NOT EXISTS passing_date     DATE,
  ADD COLUMN IF NOT EXISTS photo_url        TEXT,
  ADD COLUMN IF NOT EXISTS memorial_link_url TEXT;

-- Also create the Supabase Storage bucket for memorial photos.
-- Run this in the Supabase Storage section of the dashboard,
-- OR execute via the Storage API. The bucket must be public.
--
-- Dashboard steps:
--   Storage → New bucket → Name: chapter-eternal-photos → Public: ON → Save
--
-- The photo_url column stores the full public URL returned by Supabase Storage.
