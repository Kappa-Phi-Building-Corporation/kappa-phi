-- Adds end_time to the events table.
-- Run in Supabase SQL Editor after migrate_events.sql.

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_time TEXT;
