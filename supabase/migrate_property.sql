-- Property management tables. Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.property_projects (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT    NOT NULL,
  status         TEXT    NOT NULL DEFAULT 'planned'
                         CHECK (status IN ('planned', 'recent', 'archive')),
  description    TEXT,
  scheduled_date TEXT,   -- for planned: "Spring 2014", "TBD"
  completed_date TEXT,   -- for recent/archive: "Fall 2013"
  cost           TEXT,   -- display string: "$15,000"
  contractor     TEXT,
  sort_order     INT     NOT NULL DEFAULT 0,
  is_published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.property_project_photos (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID    NOT NULL REFERENCES public.property_projects(id) ON DELETE CASCADE,
  photo_url  TEXT    NOT NULL,
  caption    TEXT,
  sort_order INT     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER property_projects_updated_at
  BEFORE UPDATE ON public.property_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.property_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_project_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published projects"
  ON public.property_projects FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins manage projects"
  ON public.property_projects FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read project photos"
  ON public.property_project_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.property_projects p
      WHERE p.id = project_id AND p.is_published = TRUE
    )
  );

CREATE POLICY "Admins manage project photos"
  ON public.property_project_photos FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Also create the storage bucket:
-- Dashboard → Storage → New bucket → Name: property-photos → Public: ON → Save

-- ── Seed ──────────────────────────────────────────────────────────

INSERT INTO public.property_projects (name, status, scheduled_date, cost, description, sort_order) VALUES

('HVAC Upgrades Phase 2', 'planned', 'Spring 2014', '$15,000',
$$The existing HVAC systems in the fraternity house are requiring more maintenance every year and becoming less reliable. This phase will replace the three aging furnace, compressor, and coil units in the new wing, which was built in 1999. A capital campaign is currently underway to fund this project.$$,
1),

('Great Room Noise Reduction', 'planned', 'TBD', NULL,
$$A long overdue improvement. We are currently evaluating options to reduce noise in the Great Room to make it a more attractive environment for events, studying, and general brotherhood use.$$,
2),

('Recreation Room Remodel', 'planned', 'TBD', NULL,
$$Since the kitchen was moved to the Great Room level, the former dining and meeting area has gone largely underutilized. We are in the planning phase for a remodel that makes the space more useful to the actives and more attractive to potential brothers, alumni, and guests.$$,
3);

INSERT INTO public.property_projects (name, status, completed_date, contractor, cost, description, sort_order) VALUES

('Volleyball Pit Renovation', 'recent', 'Fall 2013', 'Pledge Class Project', NULL,
$$To address drainage issues near the volleyball pit and the front of the shelter, Housing Corps rented a skid loader for a day and had the actives provide the labor. The drainage corrections turned out very well.$$,
1),

('Exterior Brick, Mortar & Wood Deck Seal', 'recent', 'Summer 2013', NULL, NULL,
$$The brick, mortar, and exterior surfaces were sealed to protect the shelter exterior for approximately ten years. The contractor also re-stained the back deck at a very acceptable bid price. With the sealed brick and new deck stain, the exterior of the house is looking pretty good.$$,
2),

('Upstairs Men''s Bathroom Shower Waterproofing', 'recent', 'Summer 2013', NULL, NULL,
$$All floor tiles in the shower were removed and replaced, with the contractor also tiling up the walls approximately 10 inches. A new waterproof liner system now covers the entire floor surface and rises up the walls, preventing water from migrating behind the liner as it did with the old system.$$,
3),

('HVAC Upgrades Phase 1', 'recent', 'Spring 2013', $$Denny Hartman (Jason Hartman's BE-337 father)$$, '$15,000',
$$Phase 1 replaced the three HVAC units in the old wing of the shelter and added a compact unit in the attic over the carport for additional capacity in that zone. The result is a split zone for the old wing with independent control of each area.$$,
4),

('Parking Lot Sealing & Striping', 'recent', 'Summer 2012', 'Melrose Quarry & Asphalt, LLC — Rolla, MO', '$1,900',
$$The entire lot was cleaned and coated with sealer, then re-striped in the original locations. This project extended the life of the asphalt and greatly improved its resistance to motor oil, gasoline, and de-icing salts.$$,
5),

('Great Room Storage', 'recent', 'Spring 2011', 'Fall 2010 Pledge Class (direct alumni funding)', NULL,
$$This project opened up the area under the stairwell at the end of the great room, giving the undergraduates additional storage space. Work included drywalling, lighting, and installation of a commercial-grade door.$$,
6),

('Water Heater Replacement', 'recent', 'Summer 2010', NULL, '$3,100',
$$The fraternity's aging water heaters — installed as part of the 1999 expansion — were replaced with new electric units providing 240 gallons of total storage capacity. The new units feature higher-wattage elements for quicker recovery times during periods of heavy use.$$,
7),

('Front Room Furniture Replacement', 'recent', 'Winter 2010', NULL, '$7,000',
$$Several front-room couches damaged from heavy day-to-day use were replaced with heavy-duty Flexsteel brand couches — fully upholstered with steel frames, the same grade used in hotels and commercial settings. The new furniture is warranted against physical damage and staining.$$,
8);

INSERT INTO public.property_projects (name, status, completed_date, contractor, cost, description, sort_order) VALUES

('Stair Tread Replacement', 'archive', 'Spring 2009', NULL, '$2,100',
$$The stair treads installed 10 years earlier as part of the 1999 expansion were difficult to clean and torn in several places. This project replaced the treads on the stairs from the front room to the rec room and from the rec room to the great room.$$,
1),

('Upstairs Hall Bathroom Remodeling', 'archive', 'Summer 2008', NULL, '$2,700',
$$Originally the master bathroom of the Chapter House when it was a family dwelling, this project replaced plumbing fixtures, sinks, cabinetry, flooring, and walls; removed an unused door from the 5-man study; and added a shower. Labor was donated by actives, alumni, and friends.$$,
2),

('Great Room Foundation Leak Repairs', 'archive', 'Spring 2008', NULL, '$2,000',
$$Water was leaking into the great room through the foundation during moderate to heavy rains. Investigation found that the grade of the side yard caused water to pond against the exterior wall, and the foundation drain tile was clogged. This project excavated next to the foundation, installed an improved drainage system, corrected the yard slope, and repositioned three AC units that had to be moved in the process.$$,
3),

('Upstairs Shower Ceiling Renovation', 'archive', 'Summer 2007', 'Alumni Brian Booth and Chris Kelly with undergraduates Alex Carnes and Greg Eike', '$500',
$$Poor lighting and ventilation of the upstairs shower were causing a mildew problem. This project removed the existing waterboard, replaced the ceiling with new drywall, added recessed can lighting and new exhaust fans, and installed a shower door.$$,
4),

('Fire Alarm System Additions', 'archive', 'Summer 2007', 'Alumni Brian Booth and Chris Kelly with undergraduates Alex Carnes and Dan Gill', '$1,500',
$$The study rooms in the old wing were not tied into the hard-wired fire alarm system installed during the 1999 expansion. This project added hard-wired smoke detectors to all rooms lacking one, increasing safety throughout the house.$$,
5),

('Downstairs Shower Renovation', 'archive', 'Summer 2006', 'Alumni Brian Booth and Chris Kelly with the undergraduates', '$2,700',
$$Water infiltration behind the tile had ruined sections of drywall in the downstairs shower, which also had only two heads in poor condition. The project gutted the shower room, corrected floor slope for drainage, moved and added shower heads, rebuilt walls in cement board and tile, improved lighting with recessed cans, and installed a decorative shower door featuring the UMR and DTD 150th Anniversary logos.$$,
6),

('Professional Carpet Cleaning', 'archive', 'Summer 2006', 'Kirkwood Carpet Cleaning — Rolla, MO', '$250',
$$After nearly 7 years, the existing carpet had accumulated embedded dirt that rental equipment could no longer remove. Commercial steam cleaning of all public areas and hallways made the shelter presentable for the 40th Anniversary Homecoming celebration in 2006.$$,
7),

('Front Room Furniture Replacement', 'archive', 'Fall 2005', NULL, '$4,100',
$$The tables and couches in the front room had not been replaced in many years. Through generous alumni support, fully upholstered replacement couches were purchased — more comfortable, much less like dorm furniture, and warranted against physical damage and staining.$$,
8),

('Parking Lot Sealing & Striping', 'archive', 'Summer 2005', 'Pierce Asphalt & Sealing — Newburg, MO', '$1,450',
$$The entire lot was cleaned, coated with sealer, and re-striped. This treatment extended the life of the asphalt and improved resistance to motor oil, gasoline, and de-icing salts.$$,
9),

('New Kitchen Equipment (Expansion & Renovation Phase II)', 'archive', 'Summer 2004',
$$Commercial & Restaurant Equipment (Camdenton, MO); Vernon White Mechanical Contractors (Rolla, MO); Korsmeyer Fire Protection (Jefferson City, MO); additional work by alumni Gary Greene and Brian Booth$$,
'$23,825',
$$Fire safety code changes in Rolla threatened kitchen condemnation in 2004. The kitchen — largely unchanged since the 1960s and too small for post-1999 membership — was relocated to the new wing. The project added a new range hood with fire suppression, new sinks, a commercial-grade dishwasher, and new cabinetry. Both kitchen and pantry are approximately double the size of the former facilities.$$,
10),

('Shed Project', 'archive', 'Summer 2002', NULL, '$3,580',
$$Led by former Director of Property Management Gary Greene, with the help of 11 undergraduates, a 15×18 wood-frame shed was constructed to house the chapter's lawn equipment and tools. The Alpha Omega Pledge Class poured the concrete slab and foundation the previous fall as their pledge class project.$$,
11),

('Window Replacement', 'archive', 'Summer 2002', 'Coverdell Glass — Waynesville, MO', '$15,650',
$$The original single-pane aluminum windows in the older half of the Chapter House were replaced with modern double-pane, gas-filled, vinyl-clad windows. Wood trim and aluminum mini-blinds were also added at this time.$$,
12),

('Expansion & Renovation — Phase I', 'archive', 'Fall 1999', 'Hogan Construction Co. — Rolla, MO', '$500,000',
$$The landmark project that modernized the shelter: 9 new 2-man sleep/study rooms, a large multipurpose room, provisions for a future kitchen, complete renovation of restroom facilities and sleeping dorms, installation of central forced-air heating and air conditioning (the first fraternity on campus to have central A/C throughout), a new larger parking lot, new sidewalks, and numerous other improvements.$$,
13);
