-- Board members table. Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.board_members (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT    NOT NULL,
  role           TEXT    NOT NULL,
  category       TEXT    NOT NULL DEFAULT 'director'
                         CHECK (category IN ('officer', 'director')),
  email          TEXT,
  bio            TEXT,                          -- paragraphs joined with \n\n
  goals          TEXT,                          -- paragraphs joined with \n\n
  goals_bulleted BOOLEAN NOT NULL DEFAULT FALSE,
  photo_url      TEXT,                          -- Supabase Storage public URL
  sort_order     INT     NOT NULL DEFAULT 0,    -- ascending within category
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER board_members_updated_at
  BEFORE UPDATE ON public.board_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

-- Public can read active members (board page is public)
CREATE POLICY "Public read active board members"
  ON public.board_members FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins read all board members"
  ON public.board_members FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins manage board members"
  ON public.board_members FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Also create the storage bucket for board photos.
-- Dashboard: Storage → New bucket → Name: board-photos → Public: ON → Save

-- ── Seed existing data ─────────────────────────────────────────────

INSERT INTO public.board_members (name, role, category, email, bio, goals, goals_bulleted, sort_order) VALUES

('Peter Moore', 'President', 'officer', 'president@kappa-phi.org',
E'I joined Delta Tau Delta in the Fall of 2012 as part of the Beta Pi pledge class. As an undergraduate, I served as Director of Academic Affairs and Vice President–External. I also served as a dedicated member of Epsilon Nu''s intramural billiards team.\n\nI graduated in 2014 with a BS in Mechanical Engineering. Since graduation, I''ve worked at Baxter Healthcare Corporation in Mountain Home, Arkansas. I am currently a Quality Engineer with focus on Sterility Assurance.\n\nWithin Kappa Phi, I have previously served as Secretary, Treasurer, and Vice President of Membership.',
E'I plan to lead Kappa Phi as we work to modernize our operations, create the near- and long-term vision for KPBC, and begin work to update and return the shelter to one of the leading shelters on the MS&T campus.',
FALSE, 1),

('Brian Booth', 'VP of Membership', 'officer', 'booth@kappa-phi.org',
E'I joined Delta Tau Delta in the Fall of 1994 and was part of the Alpha Omicron pledge class. As a member, I served as Historian and 2nd VP for one semester, as well as being the de-facto "Network Admin".\n\nI graduated in 1997 with a BS in Computer Science and have worked at Edward Jones Investments in St. Louis for 28 years. I returned to UMR and obtained my MS in Information Science in 2005. Currently, I am working in Information Security as a Senior Engineer.\n\nIn my spare time, I have served the Fraternity continually since graduation as the Assistant Chapter Advisor and Chapter Advisor for Epsilon Nu for 10 years and as Division Vice-President for the Missouri chapters for the last 15 years. As Delt reorganized nationally, I was appointed Region-12 Governor and served in that position for one year, in charge of volunteers for eight chapters in Missouri, Kansas, and Illinois. Currently, I am acting locally as an Assistant Advisor for the Epsilon Nu and Iota Chi chapters and nationally as a Master Ritualist.\n\nPrior roles with Kappa-Phi have included serving on the Building Corporation board as President, VP of Membership, VP of Fundraising, and as a general Director.',
E'As in my previous roles, I will continue to serve the EN undergraduates, Corporation, and support the objectives of the board. Rolla Delts have existed over 58 years, and our shelter is showing its age. We need to repair our infrastructure as well as continuing to maintain our alumni relations. It is my overall goal to attract young alumni back to serve the chapter/corp, have regular events that engage and rekindle an attraction to the Brotherhood, and maintain the continuity between the undergraduate and alumni experience.\n\nI began by repairing our database and web page, aligning all of our points of contact for alumni with National and the active chapter. On a regular basis, we have been sending out postal and email correspondence in an effort to keep our alumni base connected.\n\nI plan to continue my support of the KPBC webpage and alumni database, assist with the self-managed network and security infrastructure of the shelter, and assist the VP of Property Management with projects and maintenance.\n\nThese efforts will continue to build our alumni and undergraduate relationships, keeping members in contact with Epsilon Nu in preparation for our next 50 years as Brothers!',
FALSE, 2),

('Richard Braun', 'VP of Property Management', 'officer', NULL,
E'I joined Epsilon Nu in 2013 as a part of the Beta Rho pledge class.\n\nDuring my time in the house, I held many positions but my three favorites were President, Vice President, and Pledge Ed.\n\nI graduated with a degree in Engineering Management with an emphasis in Industrial Engineering.\n\nI started working for PepsiCo in July of 2019 as a member of their campus hire program in St. Louis.',
E'Improve communications between undergrads and Kappa Phi\n\nAttend at least one worklab per year\n\nTry to attend at least 3 non-alumni functions per year\n\nImprove the shelter to be better than when I joined',
TRUE, 3),

('Adam Rice', 'VP of Fundraising', 'officer', 'fundraising@kappa-phi.org',
E'I joined Delta Tau Delta in Fall 2018 as part of the Beta Omega pledge class. As an active member, I served as Service & Philanthropy chair, FAAR chair, Secretary, Director of Member Development, and, most notably, as President during the pandemic of 2020.\n\nI graduated from Missouri S&T with a B.S. in Petroleum Engineering in Fall 2021 and remained in Rolla after taking a position with British Petroleum as an Application Engineer.\n\nUpon graduation, I immediately took on the role of Assistant Chapter Advisor providing guidance and support for new member education and FAAR roles.',
E'Kappa Phi strives to provide high quality shelter for our undergraduate Brothers as one way we support them and give back. As such, I would like to increase our capabilities to budget and plan by encouraging recurring donations. I want to continue to support the chapter through improvements through capital campaigns as well.',
FALSE, 4),

('Greg Eike', 'Treasurer', 'officer', NULL,
E'I joined Delta Tau Delta in Fall 2005 as a member of the Beta Eta pledge class. During my time as an undergraduate I served as Recruitment Chair, Vice President, and President. I have had the opportunity to participate in our Delta Tau Delta National Leadership Academies as both a participant and a facilitator over the last 15 years.\n\nI graduated in 2010 with a B.S. in Chemical Engineering and joined Anheuser-Busch in St. Louis, Missouri. During my first stint in St. Louis, I obtained my MBA from Washington University in 2016. Over the last 12 years I have worked closely with our 18 breweries across the US and Canada as a Production Engineer and Staff Brewmaster.\n\nIn my time outside of Delta Tau Delta I am an avid cyclist, a board member on the Young Friends of Kids with Cancer in St. Louis, and am enjoying all the time I can get with my son who joined our family in 2021.',
E'Generally speaking, don''t cook the books. Please check the "Board Financial Information" page under Alumni Information for specific details on the Kappa Phi Treasury.',
FALSE, 5),

('Travis Zerna', 'Secretary', 'officer', NULL,
E'I joined the fraternity in 2014 as a member of the Beta Sigma pledge class. While in house, I was the secretary and service & philanthropy chair for a semester.\n\nAfter graduating in 2018 with a bachelor''s in metallurgical engineering, I began working at a privately owned business in Pacific Missouri, first as a machinist and now as a programmer of CNC mills and lathes.',
E'As the secretary of housing Corp, I plan on taking the best meeting minutes around.',
FALSE, 6),

('Andy Bateman', 'Director', 'director', NULL,
E'I joined Delta Tau Delta in Fall 2015 as a member of the Beta Tau pledge class. During my time as an undergraduate, I served as Alumni Relations and Events Chair, Director of Academic Affairs, Recruitment Chairman, and Vice President. Outside of these positions I took a very active role in almost all aspects of the house and really appreciate what I got out of it.\n\nI now work as a project coordinator at Black and McDonald, an electrical distribution contractor. The company is based out of Canada and has a large presence in Kansas City, and recently expanded operations to St. Louis.',
E'As Director for the Kappa Phi Building Corporation my main goal is to increase alumni engagement. If any alumni have ideas on ways the board could better engage alumni — or things that would motivate you to participate — feel free to email me at abatemanstl@gmail.com.',
FALSE, 1),

('Preston Kramer', 'Director', 'director', NULL,
E'I received my Bachelor''s Degree in Civil Engineering from University of Missouri at Rolla (now Missouri S&T), my Masters of Business Administration Degree from William Woods University, and a Bachelor''s Degree in Architectural Engineering from Missouri S&T.\n\nI am a native of Missouri and live approximately 5 miles southwest of Vichy near the Phelps and Maries County Line. Since 2011, I have been the Area Engineer for the Meramec Region, comprising the eight counties of Phelps, Pulaski, Maries, Osage, Gasconade, Crawford, Dent, and Washington. I work closely with counties and communities to find solutions to the many transportation needs across the area. Prior to these duties, I worked as a Field Engineer for the Safe and Sound Bridge Improvement Program, as a Project Manager for the North-Central District, and in various Construction Inspection roles. I have worked for MoDOT for approximately 20 years, and believe the best years are yet to come.',
E'Get the house refurbished.',
FALSE, 2),

('David Hammon', 'Director', 'director', NULL,
E'I joined Delta Tau Delta in Fall 1998 as a member of the Alpha Upsilon pledge class. During my time as an undergraduate member, I served as the Treasurer in 2002.\n\nFollowing my graduation with a B.S. in Computer Science, I moved to St. Louis and started my career with Accenture. I am currently a Senior Manager and focus on complex program delivery at Utility clients.\n\nAs an alumni volunteer, I have served as Assistant Chapter Advisor, Chapter Advisor, and Finance Advisor for the EN chapter. I have also been a finance advisor for the Delta Omicron and Iota Chi chapters.',
E'I plan to help lead Kappa Phi as we work to modernize our operations, create the near- and long-term vision for KPBC, and begin work to update and return the shelter to one of the leading shelters on the MS&T campus.',
FALSE, 3),

('JB Matthews', 'Director', 'director', NULL,
E'I joined Delta Tau Delta in the fall of 2006 as part of the Beta Iota pledge class. As an active member, I served as Sergeant of Arms and Director of Academic Affairs. I''m most well known for my escapades on a certain lawn mower at the 100th St. Pats.\n\nI graduated from Missouri S&T with a B.S. in Mechanical Engineering in spring 2009. Since graduation I''ve worked for Phillips 66 in Ponca City, OK. I''m currently a Maintenance Engineer working closely with coke and acid, helping to fuel ''high-octane FUN!''\n\nSince graduation, I had the role of Secretary on the Kappa Phi Housing Corp. and was recently elected to the role of Director.',
E'Assist the chapter and HC when needed from a distance, support the structure remodel, and partake in the occasional DTD gatherings.',
FALSE, 4),

('Eric McDaniel', 'Director', 'director', NULL,
E'I started at Missouri S&T in the Fall of 2003 in the Beta Delta pledge class. I held the position of Historian for one semester. During my time at Rolla, I studied aerospace engineering and later graduated with a degree in geology.\n\nAt present, I''m working in the Missouri Department of Revenue as a Management Analysis Specialist with a focus on permissions for employees.\n\nThis is my first position on Housing Corp, and I look forward to seeing what it brings.',
E'To serve where I''m able in my time with the position in ways to help the house and the undergraduates.\n\nAt present I plan to get the photos and media that I''ve taken over the past several years together in a way which can be given back to the house for both them and alumni to enjoy.',
FALSE, 5),

('Dr. Tyler Richards', 'Director', 'director', NULL,
E'I was initiated into ΔΤΔ with the ΒΤ pledge class in Fall ''15. During my time at the Shelter, I served as Director of Academic Affairs, Pledge Educator to the ΒΥ pledge class, Director of Risk Management, and Vice President.\n\nAfter earning my B.S. in Ceramic Engineering, I decided to stay in Rolla to work towards my Ph.D in Materials Science and Engineering. I enjoyed being close by — I was able to check in from time to time and connect with some of the newer pledge classes, and make sure the fraternity was in good hands with the subsequent Exec Boards.\n\nAfter earning my Doctorate, I moved out to Ohio to begin my current role as a Process Research Engineer at Cleveland-Cliffs. Even though I am now over 500 miles away, I am still eager to visit and check in (even if remotely sometimes) and do whatever I can to help ensure the fraternity prospers. No matter where I move to, the Shelter will always be my home.',
E'Generally just want to make sure the actives take full advantage of the renovations to foster growth and longevity of the fraternity.',
FALSE, 6),

('Wade Waldmann', 'Director', 'director', NULL,
E'I was initiated in Delta Tau Delta in the Fall of 2010 during my Sophomore year of college as a member of the BN pledge class. I served as Historian and on the Exec Board as the Director of Risk Management while an active in the house. I was the last person to hold both as individual positions.\n\nI graduated in the Spring of 2014 with a BS in Mechanical Engineering and commissioned as a 2nd Lt in the US Air Force. I am currently a Major in USAF serving as a B-52 Weapons Systems Officer. I even met my wife Rachel in the house during St. Pats 2013. I am also the proud father of three beautiful little girls, Aubree, Aurora, and Autumn. Due to my military career it has been hard to get back to the house but I have managed a few events and always stop by when in the St. Louis area.\n\nThere were many negatives from COVID-19 but one of the few positives was the normalization of virtual meetings which has allowed me to serve the fraternity yet again. I started attending general member meetings again, which ultimately led to me attaining a seat on the Board of Directors.',
E'As director my goal is to preserve and ensure that there is a shelter for the EN chapter of Delta Tau Delta so that current and future brothers can grow and develop in their careers and lives as I did as an undergrad. The house has been sorely deteriorating in the past years and is in need of infrastructure updates. I hope to help guide the Kappa Phi Housing Corps in the future development of the EN shelter.',
FALSE, 7),

('Alex Apple', 'Director', 'director', NULL,
NULL,
E'To serve where I''m able in my time with the position in ways to help the house and the undergraduates.',
FALSE, 8);
