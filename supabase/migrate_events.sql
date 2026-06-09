-- Events table for the public events/calendar page.
-- Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.events (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT    NOT NULL,
  description  TEXT,
  start_date   DATE    NOT NULL,
  end_date     DATE,                   -- null = single day
  start_time   TEXT,                   -- flexible, e.g. "7pm" or "2pm–3pm CST"
  location     TEXT,
  link_label   TEXT,                   -- CTA button text, e.g. "Join Google Meet"
  link_url     TEXT,                   -- CTA button URL
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated) can read published events
CREATE POLICY "Public read published events"
  ON public.events FOR SELECT
  USING (is_published = TRUE);

-- Admins can read unpublished events too
CREATE POLICY "Admins read all events"
  ON public.events FOR SELECT
  USING (public.is_admin());

-- Admins manage events
CREATE POLICY "Admins manage events"
  ON public.events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed the existing static events so the page isn't empty after migration
INSERT INTO public.events (title, description, start_date, end_date, start_time, location, link_label, link_url, is_published)
VALUES
  (
    '118th Annual St. Pats — 2026',
    'Wednesday, March 11
• Various — contact the Delt Ombudsman for general Pats activities
• 7pm–10pm: FOL Casino Night · Havener Center, St. Pats Ballroom · $7 at the door

Thursday, March 12
• Noon: Gonzo & Games and beer garden at Schuman Park pavilion

Friday, March 13
• All day/night: Hanging at the Shelter
• 8:30am: Screwdrivers & Donuts (and more) in the Great Room
• Noon: Gonzo & Games and beer garden at Schuman Park pavilion

Saturday, March 14
• Early Morning: Street Painting, Hair of the Dog
• Morning: Drinking on Pine, parade around 11am
• 2pm: Housing Corporation general membership meeting

Sunday, March 15
• Go home safely!',
    '2026-03-11',
    '2026-03-15',
    NULL,
    'Rolla, MO',
    NULL,
    NULL,
    TRUE
  ),
  (
    'HC General Membership Meeting',
    'Dial-in: +1 678-801-8110 · PIN: 725 458 954#',
    '2026-03-14',
    NULL,
    '2pm–3pm CST',
    'Virtual (Google Meet)',
    'Join Google Meet',
    'https://meet.google.com/vgf-nqyd-pjn',
    TRUE
  );
