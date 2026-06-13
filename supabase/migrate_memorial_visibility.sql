-- Chapter Eternal memorial visibility was previously stored in the shared
-- hide_entry column, which is also forced to TRUE for deceased/expelled
-- members for the alumni directory and big brother tree. That caused
-- editing a deceased member's record to silently re-hide their memorial
-- entry. Give the memorial page its own visibility column.

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS memorial_hide_entry BOOLEAN NOT NULL DEFAULT FALSE;

-- Preserve current memorial visibility for existing chapter eternal entries.
UPDATE public.members
SET memorial_hide_entry = hide_entry
WHERE is_deceased = true AND passing_date IS NOT NULL;
