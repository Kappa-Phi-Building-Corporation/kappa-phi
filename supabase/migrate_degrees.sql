-- Add a free-text "degrees" field to members (e.g. "B.S. Mechanical Engineering").

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS degrees TEXT;
