-- Memories/messages members can leave on a Chapter Eternal memorial entry.
-- Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.chapter_eternal_memories (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id          UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  author_profile_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name        TEXT NOT NULL,
  message            TEXT NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chapter_eternal_memories_member_id_idx
  ON public.chapter_eternal_memories(member_id);

ALTER TABLE public.chapter_eternal_memories ENABLE ROW LEVEL SECURITY;

-- Any logged-in member can read and post memories (matches the memorial
-- page itself, which only requires being logged in, not full approval).
CREATE POLICY "Members read memories"
  ON public.chapter_eternal_memories FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Members post memories"
  ON public.chapter_eternal_memories FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors delete own memories"
  ON public.chapter_eternal_memories FOR DELETE
  USING (auth.uid() = author_profile_id);

CREATE POLICY "Admins manage memories"
  ON public.chapter_eternal_memories FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
