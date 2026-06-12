-- Records & Recognition: chapter honors + chapter mascots. Run in Supabase SQL Editor.
--
-- Also create a public Storage bucket named "mascot-photos" (Dashboard →
-- Storage → New bucket → Public: ON), matching the existing "board-photos"
-- bucket used for board member photos.

-- ── chapter_honors ───────────────────────────────────────────────
-- Covers Student Knights, Highest Initiate GPA, IFC Representatives,
-- St. Pat's Board, and Chapter Presidents. One row per honor/term.
--
-- year_label conventions:
--   student_knight, ifc_rep   : 4-digit year, e.g. '1977'
--   chapter_president         : 4-digit year if known, else NULL (ordered
--                                by sort_order); add one row per term for
--                                presidents who served multiple times
--   highest_gpa                : "<Season> '<YY>", e.g. "Fall '65", "Spg '98"
--                                (Season ∈ Spg, Summer, Fall) — multiple rows
--                                may share the same year_label
--   st_pats_board              : "'<YY>" e.g. "'77", plus optional title
--                                (Masterguard, St. Pat, Trumpeteer, Guard, Herald)

CREATE TABLE IF NOT EXISTS public.chapter_honors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category     TEXT NOT NULL CHECK (category IN
                 ('student_knight', 'highest_gpa', 'ifc_rep', 'st_pats_board', 'chapter_president')),
  member_id    UUID REFERENCES public.members(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  year_label   TEXT,
  title        TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chapter_honors_category_idx ON public.chapter_honors (category);

CREATE TRIGGER chapter_honors_updated_at
  BEFORE UPDATE ON public.chapter_honors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.chapter_honors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read chapter honors"
  ON public.chapter_honors FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins manage chapter honors"
  ON public.chapter_honors FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── chapter_mascots ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.chapter_mascots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  start_year   INT,
  end_year     INT,                          -- NULL = "Present"
  photo_url    TEXT,                         -- Supabase Storage public URL
  sort_order   INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER chapter_mascots_updated_at
  BEFORE UPDATE ON public.chapter_mascots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.chapter_mascots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published mascots"
  ON public.chapter_mascots FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins manage mascots"
  ON public.chapter_mascots FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── Seed: Student Knights ───────────────────────────────────────

INSERT INTO public.chapter_honors (category, display_name, year_label, sort_order) VALUES
('student_knight', 'Gary M. Woodard', '1965', 1),
('student_knight', 'David Smith', '1966', 2),
('student_knight', 'James C. Cowles, Jr.', '1967', 3),
('student_knight', 'Walter D. Dietrich', '1968', 4),
('student_knight', 'Virgil A. Deshazer', '1969', 5),
('student_knight', 'Richard Campen', '1970', 6),
('student_knight', 'James W. Walker', '1971', 7),
('student_knight', 'Roy B. Woods', '1972', 8),
('student_knight', 'Paul E. Erlandson', '1973', 9),
('student_knight', 'William L. Morley', '1974', 10),
('student_knight', 'David L. Lyon', '1975', 11),
('student_knight', 'Merle Dillow', '1976', 12),
('student_knight', 'William J. Tierney', '1977', 13),
('student_knight', 'Eddie H. Doss', '1978', 14),
('student_knight', 'Thomas H. Schmitt', '1979', 15),
('student_knight', 'David K. Hall', '1980', 16),
('student_knight', 'David E. Dubois', '1981', 17),
('student_knight', 'Clarence Miller', '1982', 18),
('student_knight', 'David A. Robben', '1983', 19),
('student_knight', 'Christopher S. Greenwood', '1984', 20),
('student_knight', 'Steven M. Bretzke', '1985', 21),
('student_knight', 'Terry T. Palisch', '1986', 22),
('student_knight', 'Craig A. Thomas', '1987', 23),
('student_knight', 'Frederick T. Miller', '1988', 24),
('student_knight', 'Andrew P. Jones', '1989', 25),
('student_knight', 'Charles M. Pulay', '1990', 26),
('student_knight', 'John D. Pulay', '1991', 27),
('student_knight', 'Timothy A. Stelljes', '1992', 28),
('student_knight', 'Brian K. Verman', '1993', 29),
('student_knight', 'Matthew L. Leap', '1995', 30),
('student_knight', 'Keith R. Dandurand', '1996', 31),
('student_knight', 'Samuel D. Erter', '1997', 32),
('student_knight', 'Liem D. T. Nguyen', '1998', 33),
('student_knight', 'Jeff Heckman', '1999', 34),
('student_knight', 'Gary Roberts', '2000', 35),
('student_knight', 'Daniel Woodcock', '2001', 36),
('student_knight', 'Daniel Maddex', '2002', 37),
('student_knight', 'James Henken', '2003', 38),
('student_knight', 'Corey Ernst', '2004', 39),
('student_knight', 'Brian Schwegal', '2005', 40),
('student_knight', 'Mike Scherr', '2006', 41),
('student_knight', 'Bryan Madson', '2007', 42),
('student_knight', 'Marshall King', '2008', 43);

-- ── Seed: Highest Initiate Grade Point ──────────────────────────

INSERT INTO public.chapter_honors (category, display_name, year_label, sort_order) VALUES
('highest_gpa', 'Bob McDavid', E'Fall \'65', 1),
('highest_gpa', 'Gerald Miller', E'Spg \'66', 2),
('highest_gpa', 'Charles Parks', E'Spg \'68', 3),
('highest_gpa', 'David Holdener', E'Fall \'68', 4),
('highest_gpa', 'Richard Smith', E'Fall \'69', 5),
('highest_gpa', 'John Morrissey', E'Fall \'70', 6),
('highest_gpa', 'Sandy Cambell', E'Spg \'71', 7),
('highest_gpa', 'Bob Jones', E'Fall \'71', 8),
('highest_gpa', 'Bill Van Veghte III', E'Fall \'73', 9),
('highest_gpa', 'Ed Doss', E'Spg \'74', 10),
('highest_gpa', 'Marc Bunz', E'Fall \'74', 11),
('highest_gpa', 'John Trousdale', E'Fall \'75', 12),
('highest_gpa', 'Jeff Sheets', E'Fall \'76', 13),
('highest_gpa', 'Tim Heath', E'Fall \'77', 14),
('highest_gpa', 'Dave Anderson', E'Fall \'78', 15),
('highest_gpa', 'John Alles', E'Spg \'79', 16),
('highest_gpa', 'Dave Kniepkamp', E'Fall \'79', 17),
('highest_gpa', 'Scott Niewoehner', E'Fall \'80', 18),
('highest_gpa', 'Dennis Card', E'Fall \'81', 19),
('highest_gpa', 'Terrence', E'Fall \'82', 20),
('highest_gpa', 'Robert Carden', E'Fall \'83', 21),
('highest_gpa', 'Andrew Jones', E'Fall \'84', 22),
('highest_gpa', 'Tom Sovar', E'Fall \'85', 23),
('highest_gpa', 'James McDaniel', E'Fall \'86', 24),
('highest_gpa', 'John Winkler', E'Fall \'87', 25),
('highest_gpa', 'Perry Mar', E'Fall \'88', 26),
('highest_gpa', 'Josh Chandler', E'Fall \'89', 27),
('highest_gpa', 'Brian Verman', E'Fall \'90', 28),
('highest_gpa', 'Dan Ludwig', E'Fall \'91', 29),
('highest_gpa', 'Gary Greene', E'Fall \'92', 30),
('highest_gpa', 'Brad Butler', E'Fall \'93', 31),
('highest_gpa', 'Jeff Heckman', E'Fall \'94', 32),
('highest_gpa', 'Phillip Courtney', E'Fall \'95', 33),
('highest_gpa', 'Preston Kramer', E'Fall \'95', 34),
('highest_gpa', 'Brian Miller', E'Fall \'95', 35),
('highest_gpa', 'Ben Braker', E'Fall \'96', 36),
('highest_gpa', 'Jason Bodson', E'Fall \'97', 37),
('highest_gpa', 'Minjie Xu', E'Spg \'98', 38),
('highest_gpa', 'James Henken', E'Fall \'98', 39),
('highest_gpa', 'Jason Bridges', E'Spg \'99', 40),
('highest_gpa', 'Eugene Shoykhet', E'Fall \'99', 41),
('highest_gpa', 'James Kramer', E'Fall \'00', 42),
('highest_gpa', 'Brian Schwegal', E'Fall \'01', 43),
('highest_gpa', 'Nathan Wilke', E'Fall \'02', 44),
('highest_gpa', 'Mike Scherr', E'Spg \'03', 45),
('highest_gpa', 'Kurt Bloch', E'Fall \'04', 46),
('highest_gpa', 'Ryan Seman', E'Fall \'04', 47),
('highest_gpa', 'Zach Nelson', E'Spg \'05', 48),
('highest_gpa', 'Jason Hartman', E'Fall \'05', 49),
('highest_gpa', 'Nicholas Russo', E'Spg \'06', 50),
('highest_gpa', 'Austin Thompson', E'Fall \'06', 51);

-- ── Seed: Interfraternity Council Representatives ───────────────

INSERT INTO public.chapter_honors (category, display_name, year_label, sort_order) VALUES
('ifc_rep', 'Harwell Schutty', '1964', 1),
('ifc_rep', 'Jerry Fortner', '1965', 2),
('ifc_rep', 'Eric Aschinger, Tom Fritzinger', '1966', 3),
('ifc_rep', 'Peter Dunkailo', '1967', 4),
('ifc_rep', 'Robert Cramner', '1968', 5),
('ifc_rep', 'Gary Wicke', '1969', 6),
('ifc_rep', 'Gary Shanklin', '1970', 7),
('ifc_rep', 'Donald Power', '1971', 8),
('ifc_rep', 'William Morley', '1972', 9),
('ifc_rep', 'Jeff Wassilak', '1973', 10),
('ifc_rep', 'Mike Hauser', '1974', 11),
('ifc_rep', 'Hillis Pratt', '1975', 12),
('ifc_rep', 'Tom Schmitt', '1976', 13),
('ifc_rep', 'Johnie Trousdale', '1977', 14),
('ifc_rep', 'Jeff Sheets', '1978', 15),
('ifc_rep', 'Nick Dungey', '1979', 16),
('ifc_rep', 'Clarence Miller', '1980', 17),
('ifc_rep', 'Richard Weber', '1981', 18),
('ifc_rep', 'Steve Bretzke', '1982', 19),
('ifc_rep', 'Lew Westermeyer', '1983', 20),
('ifc_rep', 'Terry Palisch', '1984', 21),
('ifc_rep', 'Rob Brown', '1985', 22),
('ifc_rep', 'John Fox III', '1986', 23),
('ifc_rep', 'Sean McKessy', '1987', 24),
('ifc_rep', 'Kenneth Johnson', '1988', 25),
('ifc_rep', 'Noel Gibler', '1989', 26),
('ifc_rep', 'Josh Chandler', '1990', 27),
('ifc_rep', 'Matt Leap', '1991', 28),
('ifc_rep', 'Keith Dandurand', '1992', 29),
('ifc_rep', 'Jim Schrock', '1993', 30),
('ifc_rep', 'Sean Teitelbaum', '1995', 31),
('ifc_rep', 'Clint Napton', '1996', 32),
('ifc_rep', 'Frank Koch', '1997', 33),
('ifc_rep', 'Doug Chappell', '1998', 34),
('ifc_rep', 'Tim Thomason', '1999', 35),
('ifc_rep', 'M. Daniel McGhee', '2000', 36),
('ifc_rep', 'Matt Wolken', '2001', 37),
('ifc_rep', 'Kraig Kelley', '2002', 38),
('ifc_rep', 'Ryan Kelly', '2003', 39),
('ifc_rep', 'Joe Brunner', '2004', 40),
('ifc_rep', 'David Baugher', '2005', 41),
('ifc_rep', 'Greg Bates', '2006', 42),
('ifc_rep', 'Kevin Butler', '2007', 43),
('ifc_rep', 'Trevor O''Brien', '2008', 44),
('ifc_rep', 'Josh Parks', '2009', 45);

-- ── Seed: St. Pat's Board Representatives ───────────────────────

INSERT INTO public.chapter_honors (category, display_name, year_label, title, sort_order) VALUES
('st_pats_board', 'Michael J. Schreiner', E'\'69', NULL, 1),
('st_pats_board', 'Sammy Hopper', E'\'70', NULL, 2),
('st_pats_board', 'Jack Higgins', E'\'71', NULL, 3),
('st_pats_board', 'Kenneth Kifer', E'\'72', NULL, 4),
('st_pats_board', 'Lloyd Reynolds', E'\'73', NULL, 5),
('st_pats_board', 'Donald Dierker', E'\'74', NULL, 6),
('st_pats_board', 'Craig Thomson', E'\'75', NULL, 7),
('st_pats_board', 'Edward Haberstroh', E'\'76', NULL, 8),
('st_pats_board', 'Gary Underwood', E'\'77', 'Masterguard', 9),
('st_pats_board', 'Gary Underwood', E'\'79', 'St. Pat', 10),
('st_pats_board', 'Joseph Morales', E'\'78', NULL, 11),
('st_pats_board', 'Kevin Hauser', E'\'80', NULL, 12),
('st_pats_board', 'Clifton Dodson', E'\'81', NULL, 13),
('st_pats_board', 'Keith Markway', E'\'82', 'Trumpeteer', 14),
('st_pats_board', 'Scott Niewoehner', E'\'83', 'Guard', 15),
('st_pats_board', 'Scott Muskopf', E'\'84', 'Masterguard', 16),
('st_pats_board', 'Robert Carden', E'\'85', 'Guard', 17),
('st_pats_board', 'David Hettenhausen', E'\'86', 'St. Pat', 18),
('st_pats_board', 'Scott McReynolds', E'\'87', 'Trumpeteer', 19),
('st_pats_board', 'Brian Johnson', E'\'00', 'Herald', 20),
('st_pats_board', 'Dan Maddex', E'\'01', 'Masterguard', 21),
('st_pats_board', 'Allyn Perigin', E'\'04', NULL, 22),
('st_pats_board', 'Winston Carr', E'\'07', NULL, 23),
('st_pats_board', 'Caleb Nelson', E'\'17', NULL, 24);

-- ── Seed: Chapter Presidents ─────────────────────────────────────
-- year_label left NULL; chronological order preserved via sort_order.

INSERT INTO public.chapter_honors (category, display_name, sort_order) VALUES
('chapter_president', 'Mike Conway', 1),
('chapter_president', 'Tom Lillie', 2),
('chapter_president', 'Jerry Fortner', 3),
('chapter_president', 'Ronald Smith', 4),
('chapter_president', 'Dale Ricks', 5),
('chapter_president', 'Eric Aschinger', 6),
('chapter_president', 'Anthony Mack', 7),
('chapter_president', 'Gary Wicke', 8),
('chapter_president', 'Donald Power', 9),
('chapter_president', 'Gary Shanklin', 10),
('chapter_president', 'William Morley', 11),
('chapter_president', 'Dave Lyon', 12),
('chapter_president', 'Edward Haberstroh', 13),
('chapter_president', 'Kelly McGrath', 14),
('chapter_president', 'Michael Hauser', 15),
('chapter_president', 'Warren Greenwalt', 16),
('chapter_president', 'Jeff Sheets', 17),
('chapter_president', 'Clarence Miller', 18),
('chapter_president', 'Nick Dungey', 19),
('chapter_president', 'Dave Anderson', 20),
('chapter_president', 'Christopher Greenwood', 21),
('chapter_president', 'Craig Thomas', 22),
('chapter_president', 'Steve Bretzke', 23),
('chapter_president', 'John Powell (2 terms)', 24),
('chapter_president', 'Rob Brown', 25),
('chapter_president', 'Matt King', 26),
('chapter_president', 'Kirk McMenamin', 27),
('chapter_president', 'Charlie Pulay', 28),
('chapter_president', 'John Pulay', 29),
('chapter_president', 'Jim Hill', 30),
('chapter_president', 'John Goethe', 31),
('chapter_president', 'Daniel Ludwig', 32),
('chapter_president', 'Jason Carter', 33),
('chapter_president', 'Samuel Erter', 34),
('chapter_president', 'Clint Napton', 35),
('chapter_president', 'Jeff Heckman', 36),
('chapter_president', 'Ben Braker', 37),
('chapter_president', 'Matt Chesebrough', 38),
('chapter_president', 'Doug Chappell', 39),
('chapter_president', 'Chris Kelly', 40),
('chapter_president', 'Matt Wolken', 41),
('chapter_president', 'Brian Schwegal', 42),
('chapter_president', 'Ryan Kelly', 43),
('chapter_president', 'Joseph Brunner', 44),
('chapter_president', 'Greg Eike', 45),
('chapter_president', 'Nicholas Russo', 46),
('chapter_president', 'Austin Thompson', 47),
('chapter_president', 'Joshua Parks', 48),
('chapter_president', 'Derek Dixon', 49),
('chapter_president', 'Gabriel Ellis', 50),
('chapter_president', 'Matthew Vogel', 51),
('chapter_president', 'Joseph Collum', 52),
('chapter_president', 'Ian Flannigan', 53),
('chapter_president', 'Tyler Hembrock', 54),
('chapter_president', 'Richard Braun', 55);

-- ── Seed: Chapter Mascots ────────────────────────────────────────

INSERT INTO public.chapter_mascots (name, start_year, end_year, sort_order) VALUES
('Studley', 1969, 1969, 1),
('Seymour', 1972, 1974, 2),
('Zeke', 1975, 1977, 3),
('Heidi', 1975, 1979, 4),
('Astro', 1978, 1987, 5),
('Beouregard', 1981, 1982, 6),
('Gonzo', 1982, 1983, 7),
('Jake', 1986, 1991, 8),
('Thor', 1988, 1990, 9),
('Kooter', 1992, 1996, 10),
('April', 1996, 2012, 11),
('Hindippens', 1998, 1999, 12),
('Reagan', 2009, NULL, 13),
('Sasha', 2012, 2012, 14);
