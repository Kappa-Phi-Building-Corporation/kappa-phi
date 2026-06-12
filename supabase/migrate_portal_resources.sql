-- Chapter Portal resource links. Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.portal_resources (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  label        TEXT    NOT NULL,
  href         TEXT    NOT NULL,
  is_external  BOOLEAN NOT NULL DEFAULT FALSE,
  requires_auth BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INT     NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- If the table already existed from an earlier run of this migration:
ALTER TABLE public.portal_resources ADD COLUMN IF NOT EXISTS requires_auth BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TRIGGER portal_resources_updated_at
  BEFORE UPDATE ON public.portal_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.portal_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published resources"
  ON public.portal_resources FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins manage resources"
  ON public.portal_resources FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── Seed ──────────────────────────────────────────────────────────

INSERT INTO public.portal_resources (label, href, is_external, requires_auth, sort_order) VALUES
('Delta Tau Delta — Alumni Mailing List', 'https://www.kappa-phi.org/contactlist/index.php', TRUE, FALSE, 1),
('Byron N. Vermillion Scholarship Info & Application', '/donations', FALSE, FALSE, 2),
('Kappa Phi — Zoom Video Archives', 'https://www.kappa-phi.org/media.html', TRUE, FALSE, 3),
('Epsilon Nu Big Brother Tree', '/alumni/tree', FALSE, TRUE, 4),
('Property Management Checklist', 'https://www.kappa-phi.org/contactlist/DTD-SemesterInspectionList.docx', TRUE, FALSE, 5),
('Booth''s Unofficial Guide to Pats', 'http://vulcan.booth236.net/warez/Pats-prep-Booth_118-32.pdf', TRUE, FALSE, 6);

-- If the table was already seeded by an earlier run, mark the Big Brother Tree as requiring login:
UPDATE public.portal_resources SET requires_auth = TRUE WHERE href = '/alumni/tree';
