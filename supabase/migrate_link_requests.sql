-- Add member link request columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS requested_member_id uuid references public.members(id) on delete set null,
  ADD COLUMN IF NOT EXISTS link_request_status text check (
    link_request_status in ('pending', 'conflict', 'denied')
  );

CREATE INDEX IF NOT EXISTS profiles_link_request_status_idx
  ON public.profiles (link_request_status)
  WHERE link_request_status IS NOT NULL;
