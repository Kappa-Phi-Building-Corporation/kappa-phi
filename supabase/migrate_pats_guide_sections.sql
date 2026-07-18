-- Upgrades "Booth's Guide to Pats" from one flat text blob to structured,
-- navigable sections with real markdown (bold, links, lists, tables, and
-- blockquote-style warning callouts). Run in Supabase SQL Editor AFTER
-- migrate_pats_guide.sql has already been run once.

CREATE TABLE IF NOT EXISTS public.pats_guide_sections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',  -- markdown (GFM: bold, links, lists, tables, blockquotes)
  sort_order  INT  NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER pats_guide_sections_updated_at
  BEFORE UPDATE ON public.pats_guide_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.pats_guide_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read guide sections"
  ON public.pats_guide_sections FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins manage guide sections"
  ON public.pats_guide_sections FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- The flat body on pats_guide is superseded by pats_guide_sections.
ALTER TABLE public.pats_guide DROP COLUMN IF EXISTS body;

-- ── Seed sections (markdown) ─────────────────────────────────────────

INSERT INTO public.pats_guide_sections (slug, title, body, sort_order) VALUES

('what-it-is', 'What It Is', $md$A pseudo celebration of the patron saint of engineers. The town essentially allows us to use their city as a romper-room for a few weeks. Yes, **weeks**: for students and the town, Pats starts about two weeks prior to the parade and includes campus events, house parties, and bar nights. It has little — actually, **nothing** — to do with St. Patrick's Day! So avoid all the BS four-leaf clovers, silly Irish-themed hats-n-shirts, leprechauns, and whatnot. Engineering schools are hard, and Rolla makes it even more difficult. This is all about celebrating the town, school, and the Engineering/Science disciplines we went through hell for.

From the 60's–90's, Pats in Rolla was legendary and was balls-out the most insane place in the Midwest to party in the spring, but things have quieted down substantially. Gentrification, sandy-twats, and death have ruined some of the fun, but made it way safer for others. These days, the St. Pats Board, IFC, and fraternities are responsible for all the unofficial activities and parties, with all official activities hosted by MS&T and the alumni association. It is a place to have some fun, do some reasonably good cold-weather drinking, and people-watching. No one will ask you if you graduated (except for the alumni-association trolls) or what "house" you are with, but people may assume you are associated with a fraternity should you be visiting one. No one will think less of you because you aren't Greek or didn't graduate. It's pretty hassle-free if you keep an open mind and manage your time, along with your expectations.$md$, 1),

('what-it-is-not', 'What It Is Not', $md$Speaking of expectations, let's just get this out of the way. Not meaning this to be a deterrent, but more of an attempt to level-set perceptions. You may have attended Rolla, be a visiting veteran, or a complete noob, and you are entitled to a good time.

> Pats is **not** a free-for-all, and people can get in serious trouble or hurt if they step out of certain boundaries. It is not a red carpet for students, alumni, and guests/imports/visitors to be: ignorant, intolerant, sexually creepy, disrespectful, violent, or retarded.

It is not a training ground for experiments with alcohol tolerance, but it ends up being that way for some — intentionally or unintentionally. The cops, hospital, townies, and businesses are tolerant, but won't play games with you. Leave your pocket-book-lawyer shit at home. Don't go into any fraternity or the Pad (hangout for Pats Reps) and start mouthing off about how Pats is lame, or how you can drink anyone under the table, or how your mom can drink more than Booth, etc.

> Booth has witnessed people getting "adjusted" over the years for various things — arrested, hospitalized, sent back to your hotel duct-taped, ponded (thrown into Schuman Lake), or just fucking bagged (Board-speak for being dogpiled, up to and including an ass-beating) on the spot if you are a fucktard.

If you are any of the above, or just can't handle drinking with some irresponsibility for a couple of days straight: do everyone and yourself a favor and stay home. If you do get yourself into some shit somewhere Booth has influence, you'll probably catch a break. Otherwise, it is likely you're going to get what's coming to you. He can always come get you out of the lake with a very-stinky pickup-truck ride-of-shame back to your hotel room. If you're staying at the fraternity, you get the hose!

**Turbo-version — it's really easy:** if you drink, handle your shit, or have a handler. Don't be *that guy*.$md$, 2),

('contacts', 'Contacts', $md$- **Booth:** [314-640-5875](tel:3146405875)
- **Michelle** (Booth's wife Carrie's sister — his girl-Friday and head people-watcher): [314-640-5802](tel:3146405802)
- **Fraternity house:** [573-364-1909](tel:5733641909) — ask for Booth or whomever sober is in charge

Anyone with Delt letters on their clothing (or body) knows Booth, guaranteed.$md$, 3),

('when-to-arrive', 'When to Arrive', $md$Depends on how much you want to party.

- **Wednesday evening (or earlier):** the hardcore alumni enthusiasts pre-game, followed by FOL Casino Night, then a fraternity or off-campus house party.
- **Thursday, noon:** most general Pats activities begin with the "Gonzo" (beer-garden) and "Games" hosted at Shuman Park under the pavilion. You'll need a "Gonzo" cup (~$5 from the Reps' van nearby) to buy beer/mixers inside the wind fence.
- **Friday, noon:** Gonzo & Games repeats — this is when most alumni start showing up.
- **Saturday:** some people only come for Saturday, get their fill, and leave. There's no such thing as "too late to come."

You may feel out of place among the old Board Reps, GDI Governors, IFC reps, and Fraternity/Sorority alums, but everyone's there to reconnect — dig in and make some new friends!

Booth hosts the now-annual **Drivers-n-Donuts** buffoonery at the house in the Great Room at 8:30am Friday. Come drink, eat some shitty donuts, and get your morning started right.$md$, 4),

('where-to-arrive', 'Where to Arrive', $md$If you arrive in Rolla before your hotel's check-in time, come straight to the house and park in the driveway (people parking in the grass are Rolla undergrads). If you can check in early, do that first — it's best to get your pad set up so you can crash at the end of the night or when you need a break.

If you're staying at the Delt Shelter, beds, rooms, and sleeping dorms fill up quickly. You may end up on a couch or floor if you don't pre-prepare — check with Booth and he'll get you sorted with the undergrads, who run the in-house sleeping arrangements.

When you arrive: come on in (you never need to knock on a fraternity house door), or walk around back and start drinking, or ask for Booth. More than likely he'll be outside or off drinking somewhere in Rolla. Feel free to use the restroom or take a load off on the couches. If he's out, you can come meet him in town — but your car may be left in an unsecured spot. Crime is minimal in Rolla around Pats, but it's best to avoid the hassle altogether.

> Always remember: you can consider the house your home base, as someone will always be there.$md$, 5),

('getting-around', 'How to Get Around', $md$> Please don't drink and drive.

Leave your vehicle at the hotel or the house's parking lot — there's always someone who can give you a ride. If you get stranded, taxi/uber (maybe), or call/text Booth and he'll hail a ride from the house or give instructions.

Walking is the main mode of conveyance, but the walk back to the shelter from most places in Rolla can be long or even treacherous ("horsey-way") when intoxicated. Best rule of thumb: if you don't know exactly where you're going, call for a ride. Just try not to "blow" (Pats term for power-puking, vomiting, hurling, barfing, upchuckin') in a ride-giver's car.$md$, 6),

('where-youll-be', 'Where You''ll Be Partying, Drinking, Eating', $md$In general terms, you may find Booth in the following spots:

- **Fraternity houses (indoor/outdoor):** the Delt house, Sigma Nu, Sigma Pi, Sigma Chi, Triangle, Phi Kappa Theta, Frat-Row (Kappa Sigma, Kappa Alpha, TKE, Beta Sig)
- **Park pavilions:** Schuman Park
- **People's houses/backyards:** Swimmers, Rugby, GDI, Pad, the Fraternity Annex (senior's house, etc.)
- **Bars/restaurants/Hasselmann Alumni House (on Pine):** Alex's Pizza, Hoppers, Public House Brewing, Tater-Patch, Ruckyhouse
- **Pine Street, for the parade Saturday** or the bars along the route — Delts typically hang out on the west side of Pine outside the old Grotto by the Pats Sales van. The Pig Roast at noon Saturday is on for '26 — get your tickets ($25, pre-registration required).
- Or anywhere else in Rolla — you're big-boys, go have some adventure!$md$, 7),

('what-to-bring', 'What to Bring', $md$Beer. Coolers with ice, and beer — store them behind the house. Most of the old guys don't hit the late-evening parties anymore, so glass bottles are fine. Growlers are OK; anything bigger (like a tap keg) is a serious no-go.

> If you're heading to an official party, it's **cans-only** — you'll need to be on the IFC guest list beforehand (ask Booth how).

Bring enough good beer to share so you're not constantly subsidizing store runs. There aren't cooler-pirates, but some sharing, mingling, and misplacement will happen — if you don't want something touched, keep it separate in a bag or stored in a room. Beer/ice runs are frequent and Rolla has plenty of sources. No judgement on beverage selection — water-beer to Clase Azul Ultra Tequila, whatever you're into.

It's cold-weather season, and Pats has ranged from 16 to 90 degrees — snowy, rainy, all of it. Comfortable, waterproof clothing, boots, and layers are a plus. And plan on showering — no one likes a dirty filthy party-animal.

Bring cash for beer tickets (Gonzo, Hasselmann) and beer/food runs, though cards work almost everywhere. Keep an ID on you in case you interact with the hospital or authorities (UPoPo or Rolla PoPo). Old UMR/MST or IFC ID gets extra laughs — every party attendant can spot a Rolla alumnus from a mile away, so bring one.

Also bring a positive attitude — you'll be around 1 to 1000 drunk people of various ages (many "under") at any given time.$md$, 8),

('what-not-to-bring', 'What We Recommend You Not Bring', $md$> As of November 2019, any alcohol with an ABV above 15% is not allowed on IFC fraternity chapter properties, including the house. This is a real policy, not a joke.

Because it's Pats, most people still bring it, and enforcement is relaxed as long as you're not being dumb — if you're chill with keeping the source out of sight (a room, bag, or cooler), you'll likely be fine. Pats '20–'25 showed most people manage the hard stuff responsibly.

> **This is not a green light.** If you're warned once, take it off property — don't make Booth's job harder as a chapter official.

Recreational substances of any kind don't come to the house either — the chapter isn't risking a 60-year-old Charter over it, regardless of what's legal elsewhere. No judgement, just not on chapter property.$md$, 9),

('what-not-to-do', 'What Not to Do', $md$When outside the fraternity: you're adults, and it's not Booth's problem — see the warnings above. Behave accordingly, and tip well.

Don't freak out if you lose someone (including Booth) — there's a lot going on. Don't be butthurt if you get "left"; just text/call, walk, ride, regroup, and keep drinking. Not liking something? Hit the reset button and head back to the house.

The chapter is run by the undergrads, and they make the rules — they're responsible for everything and everyone. If something's happening that you don't understand, there's probably a reason. Ask before reacting, and let Booth or the house exec handle it first.

> The house has a 6'×6'×4' deep brick-lined fire pit that will be raging in the evening. It's managed by the house — you don't need to mess with it. It gets **hot**, fire burns, and you should **not** attempt to jump the fire pit.

Please don't haze anyone. If you see something funky, let it roll — no judgement. If it's hella creepy or seriously illegal, let Booth or someone know.

**IM FIRED UP!**$md$, 10),

('schedule', 'Schedule (Turbo Guide)', $md$The house's local, dynamically updated schedule is the source of truth — this is the general shape of the weekend from past years.

| Day | Time | What |
|---|---|---|
| Thu 3/5, late evening | 10pm–2am | Party at TKE for St. Pats Court Reveal |
| Fri 3/6, afternoon | 2pm–4pm | Student Knighting Ceremony at the Puck |
| Fri 3/6, evening | 8pm | Social at El Maguey |
| Fri 3/6, late evening | 11pm–2am | Party TBD |
| Sat 3/7, evening | 8pm–11pm | Social at Sputs |
| Sat 3/7, late evening | 11pm–2am | Party TBD |
| Mon 3/9, evening | 7pm–9pm | Social at Alex's Pizza |
| Tue 3/10, evening | 7pm–10pm | Social at Public House |
| Tue 3/10, late evening | 11pm–2am | Party at Lambda Chi Alpha |
| Wed 3/11, midday | 11am | Court arrival & Follies at the Puck |
| Wed 3/11, afternoon | 12pm–3pm | Darty TBD |
| Wed 3/11, evening | 8pm–11pm | FOL/Theta-Tau Casino Night |
| Wed 3/11, late evening | 11pm–2am | Party at Sigma Tau Gamma |
| Thu 3/12, midday | 12pm–6pm | Gonzo at Schuman Park Pavilion |
| Thu 3/12, afternoon | 12pm–3pm | Darty at Sigma Nu |
| Thu 3/12, evening | — | Bonfire at the house |
| Thu 3/12, late evening | 11pm–2am | Parties at Beta Sigma Psi and Phi Kappa Theta |
| Fri 3/13, early morning | 8:30am | Drivers-n-Donuts at the house |
| Fri 3/13, midday | 12pm–6pm | Gonzo continues |
| Fri 3/13, evening | 9pm–10pm | St. Pats Coronation at Castleman Hall/Leach Theatre |
| Fri 3/13, late evening | 11pm–3am | Party at Sigma Nu |
| Sat 3/14, early morning | ~3am | Street Painters assemble at 6th & Pine — intense, know what you're doing before jumping in |
| Sat 3/14, morning | — | Hair of the dog at the house; Hasselmann and Hopper's open early |
| Sat 3/14, late morning | 11am | Parade on Pine Street |
| Sat 3/14, noon | 12pm–2pm | Hasselmann Pig Roast (pre-registration, ~$20) |
| Sat 3/14, afternoon | 1pm | Grateful Board Concert at the bandshell |
| Sat 3/14, afternoon | 2pm | Housing corp meeting |
| Sat 3/14, evening | 6pm | St. Pats Concert on the McNutt lawn; bonfire at the house |
| Sat 3/14, late evening | 11pm–2am | Parties at Sigma Pi, Delta Sig, and wherever the Pats winner hosts |
| Sun 3/15 | — | Recovery. Go home. |$md$, 11),

('notes', 'Notes from Past Years', $md$- **'20:** The absolute shit — amazing turnout, and the +15% alcohol policy wasn't an issue.
- **'21:** Pats and Homecoming were no different — keep it cool, no one has an issue.
- **'22:** Great, power-up! Drivers-n-Donuts was a hit, everyone well behaved, parade was fun.
- **'23:** A lot of fun — turnout could've been better, but no complaints.
- **'24:** Truly the best ever. Special shout-out to Tabs, Sonya, Jessica, and Sarah for making it what Booth remembers.
- **'25:** Epic — so epic Booth can't remember most of it, and that's the point.

**Plans for '26:** Booth's coming down Thursday the 11th again, hosting Drivers-n-Donuts Friday morning at the house.$md$, 12);
