CREATE TABLE IF NOT EXISTS public.member_change_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_id      UUID NOT NULL REFERENCES public.members(id)  ON DELETE CASCADE,
  badge_number   TEXT,
  pledge_class   TEXT,
  big_brother_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  note           TEXT,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'approved', 'denied')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS member_change_requests_pending_idx
  ON public.member_change_requests (status)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS member_change_requests_member_idx
  ON public.member_change_requests (member_id);
