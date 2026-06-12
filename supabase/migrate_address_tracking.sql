-- Track when a member's address was last changed and by whom.
-- address_updated_by is a denormalized display label (e.g. "Self" or
-- "Jane Smith (Admin)"), not a FK, so it stays meaningful as a point-in-time
-- audit snapshot even if the acting profile/role later changes.

ALTER TABLE public.members ADD COLUMN IF NOT EXISTS address_updated_at TIMESTAMPTZ;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS address_updated_by TEXT;
