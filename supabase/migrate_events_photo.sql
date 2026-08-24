-- Adds an optional flyer/hero photo to events, shown on the public
-- events page. Uploaded files are compressed and stored in the
-- 'event-photos' Supabase Storage bucket (create it manually via the
-- Dashboard, same as the other photo buckets in this app).

alter table public.events add column if not exists photo_url text;
