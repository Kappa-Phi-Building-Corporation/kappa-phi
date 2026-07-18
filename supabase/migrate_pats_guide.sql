-- "Booth's Guide to Pats" — in-house replacement for the external PDF link
-- (http://vulcan.booth236.net/warez/Pats-prep-Booth_118-32.pdf) that was
-- linked from the Chapter Portal. Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.pats_guide (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL DEFAULT 'Booth''s Guide to Pats',
  intro       TEXT,
  body        TEXT NOT NULL DEFAULT '',
  pdf_url     TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER pats_guide_updated_at
  BEFORE UPDATE ON public.pats_guide
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.pats_guide ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read guide"
  ON public.pats_guide FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins manage guide"
  ON public.pats_guide FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Photo gallery for the guide page (optional images admins can attach)
CREATE TABLE IF NOT EXISTS public.pats_guide_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url  TEXT NOT NULL,
  caption    TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pats_guide_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read guide photos"
  ON public.pats_guide_photos FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins manage guide photos"
  ON public.pats_guide_photos FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Also create the storage bucket:
-- Dashboard → Storage → New bucket → Name: pats-guide-photos → Public: ON → Save

-- ── Seed with the content from the existing external guide ──────────

INSERT INTO public.pats_guide (title, intro, body, pdf_url)
VALUES (
  'Booth''s Guide to Pats',
  'TIME TO CELEBRATE the 118th BEST-EVER! A survival/orientation guide for alumni, guests, and imports visiting Rolla for St. Pat''s — revised annually.',
  $body$## What it is

A pseudo celebration of the patron saint of engineers. The town essentially allows us to use their city as a romper-room for a few weeks. Yes, weeks: for students and the town, Pats starts about two weeks prior to the parade and includes campus events, house parties, and bar nights. It has little — actually, nothing — to do with St. Patrick's Day! So avoid all the BS four-leaf clovers, silly Irish-themed hats-n-shirts, leprechauns, and whatnot. Engineering schools are hard, and Rolla makes it even more difficult. This is all about celebrating the town, school, and the Engineering/Science disciplines we went through hell for.

From the 60's – 90's, Pats in Rolla was legendary and was balls-out the most insane place in the Midwest to party in the spring, but things have quieted down substantially. Gentrification, sandy-twats, and death have ruined some of the fun, but made it way safer for others. These days, the St. Pats Board, IFC, and fraternities are responsible for all the unofficial activities and parties, with all official activities hosted by MS&T and the alumni association. It is a place to have some fun, do some reasonably good cold-weather drinking, and people-watching. No one will ask you if you graduated (except for the alumni-association trolls) or what "house" you are with, but people may assume you are associated with a fraternity should you be visiting one. No one will think less of you because you aren't Greek or didn't graduate. It's pretty hassle-free if you keep an open mind and manage your time, along with your expectations.

## What it is not <bummer alert>

Speaking of expectations, let's just get this out of the way. Not meaning this to be a deterrent, but more of an attempt to level-set perceptions. You may have attended Rolla, be a visiting veteran, or a complete noob, and you are entitled to a good time. But Pats is not a free-for-all, and people can get in serious trouble or hurt if they step out of certain boundaries. It is not a red carpet for students, alumni, and guests/imports/visitors to be: ignorant, intolerant, sexually creepy, disrespectful, violent, or retarded. It is not a training ground for experiments with alcohol tolerance, but it ends up being that way for some — intentionally or unintentionally. The cops, hospital, townies, and businesses are tolerant, but won't play games with you. Leave your pocket-book-lawyer shit at home. I wouldn't go into any fraternity or the Pad (hangout for Pats Reps) and start mouthing off about how Pats is lame, or how you can drink anyone under the table, or how your mom can drink more than me, etc. I have witnessed many people getting "adjusted" over the years for various things, and have seen just about everything happen including: being arrested, hospitalized, sent back to your hotel duct-taped, ponded (thrown into Schuman Lake), or just fucking bagged (Board-speak for being dogpiled, up-to-and-including an ass-beating) on the spot if you are a fucktard. The hosts of these events have forgotten more about how to handle fucktardery and douchebaggery irretardlessTM of the situation and will deal with it accordingly. If you are any of the above (in bold), or just can't handle drinking with some irresponsibility for a couple of days straight: do everyone and yourself a favor and stay home. If you do happen to get yourself into some shit in a location that I have some influence, then you will probably catch a break (like a fraternity house, etc.). But if you do get yourself into a situation, it is likely that you are going to get what's coming to you. I can always come get you out of the lake with a very-stinky pickup-truck ride-of-shame back to your hotel room, where you can fuck up your own shower and towels. If you are staying at my fraternity, you get the hose!

Turbo-version — it's really easy: if you drink, handle your shit, or have a handler. Don't be that-guyTM. </bummer alert>

## What you need to know: Contacts

My number is 314-640-5875, and Michelle (my wife Carrie's sister) will likely be with me — 314-640-5802 — or know where I am at. She is essentially my girl-Friday and head people-watcher. The fraternity house number is 573-364-1909. Ask for Booth or whomever sober is in charge, etc. Anyone with the Delt letters on their clothing (or body) knows me, guaranteed.

## When to arrive

Depends on how much you want to party. The hardcore alumni enthusiasts show up Wednesday evening (or even earlier) to pre-game, followed by FOL Casino Night, then some fraternity or off-campus house party. Most of the general Pats activities where alumni start to show up begins at noon Thursday with the "Gonzo" (beer-garden) and "Games" hosted at Shuman Park under the pavilion. You will need a "Gonzo" cup, which the Reps sell out of the van nearby for about $5. You can purchase beer and sometimes mixers inside the wind fence and fill your cup or get pitchers for consumption within the perimeter. You may feel out of place with some of the people that are there, like the old Board Reps, GDI Governors, IFC reps, Fraternity/Sorority alums, and such, but everyone is about reconnecting and having a great time, so dig in! Make some new friends and lasting memories!

Wednesday–Thursday too early? Well, Gonzo & Games repeats at noon on Friday. This is when most alumni start to show up in Rolla. There isn't really such a thing as "too late to come." Some people only come for Saturday, get their fill, and leave.

Booth hosts the now-annual Drivers-n-Donuts buffoonery at the House once again in the Great Room at 8:30am Friday. Come and drink, eat some shitty donuts, and get your morning started right!

## Where to arrive — where to come back to

If you arrive in Rolla prior to check-in time at your hotel, then just come straight to the House and park in the driveway (you will see people parking in the grass — that is for Rolla undergrads). If you can check in to your hotel early, do that first. It is always best to get your pad all set up so you can just go back and crash at the end of the night or when you need a break.

If you are staying at the Delt Shelter, then be aware that beds, rooms, and the sleeping dorms tend to fill up quickly. You may be left with a couch or floor to sleep on if you do not pre-prepare. It's always smart to get your arrangements figured out before it gets late and you are stuck drunk with no place to sleep. The undergrads arrange the in-house sleeping stuff, so check with Booth and he can get you with them.

When you arrive… come on in (never need to knock on a fraternity house door) or just walk around the back and start drinking, or ask for Booth. More than likely, he will be outside or off drinking in Rolla somewhere. Feel free to use the restroom facilities or take a load off on any of our fine couches. Of course, should he be out, you can come straight to meet him in Rolla, but you may be leaving your car in an unsecured location. Crime is minimal in Rolla, especially around Pats… but your vehicle can be inconveniently separated from you, your keys, etc., so best to just avoid that BS altogether.

Always remember that you can consider the House your home base, as someone will always be there.

## How to get around

Please don't drank and drive. It's suggested you leave your vehicles either at the hotel or the house parking lot. There is always someone that can give a ride. If you get stranded somewhere, you can taxi/uber (maybe), or call/text Booth and he will hail a ride from the house or provide instructions. While walking is the main mode of conveyance, the walk back to the shelter from most places in Rolla can be long, or even treacherous (horsey-way), especially when intoxicated. Best rule of thumb is that if you don't know exactly where you are going, call for a ride. Just try not to "blow" (Pats term for power-puking, vomiting, hurling, barfing, upchuckin') in a ride-giver's car.

## Where you will be partying/drinking/eating

In general terms, you may potentially find Booth in the following locations:

- Fraternity houses (indoor/outdoor): the Delt house, Sigma Nu, Sigma Pi, Sigma Chi, Triangle, Phi Kappa Theta, Frat-Row (Kappa Sigma, Kappa Alpha, TKE, Beta Sig)
- Park Pavilions — Schuman
- People's houses or backyards: Swimmers, Rugby, GDI, Pad, Fraternity-Annex (senior's house, etc.)
- Bars/Restaurants/Hasselmann Alumni House (on Pine): Alex's Pizza, Hoppers, Public House Brewing, Tater-Patch, Ruckyhouse
- On Pine Street for the parade on Saturday, or at the bars along the route. The Pig Roast at noon on Saturday is on for '26, so get your tickets ($25, registration required). Delts typically hang out in front of the old Grotto and Pats Sales van area.
- Or anywhere else in Rolla! You are big-boys — go have some adventure somewhere!

## What to bring

Beer. Coolers with ice, and beer. You can store them back behind the house. Most of the old guys don't go to the late-evening parties anymore, so bringing glass bottles is OK. Larger containers such as growlers are OK, but anything bigger (like silver with a tap) is a serious no-go. If you do plan to head to an official party, then cans-only (want to go? you'll need to be on the IFC guest list prior — ask Booth how). Bring enough good beer and beer to share so you aren't constantly making or subsidizing trips to the store. While there aren't cooler-pirates, some beer sharing, mingling, and misplacement will happen. If you have something you don't want anyone else to touch, it's best to keep it separate in a bag or something that can be stored in one of the rooms. But beer/ice runs, etc. are frequent, and Rolla has many fine sources of beer, liquors, and wine, etc. just in case. No one will think less of you if you bring water-beer. Everyone drinks stuff ranging from White Claw to Clase Azul Ultra Tequila, so seriously — no judgement on beverage selection.

It is cold-weather season, and Pats has been anywhere from 16 to 90 degrees, snowy, rainy, and all in between. Let the weather-godz be your guide. There is a significant amount of walking and potentially wet/muddy back-yarding, etc., so something comfortable, waterproof, boots, and extra clothing is a plus. Oh yeah — plan on showering n' stuff… no one likes a dirty filthy party-animal.

It seriously does not hurt to bring cash for beer tickets (Gonzo, Hasselmann) or providing cash to people making beer/food runs, otherwise cards are accepted everywhere. Keep an ID on you in case you have to interact with the hospital or authorities such as UPoPo or Rolla PoPo. If you have your old UMR/MST ID or IFC ID, then bring it along for extra laughs. Almost every party table attendant or security guy can recognize a Rolla alumnus from a mile away, so if you don't bring an ID for a party, just say "Really?"

Also bring a positive attitude. Everyone is down to have a good time, but you will be around between 1 and 1000 drunk people of various levels and various ages (many "under") at any given time. Some get annoying as-fuck! You know who you are…

## What we recommend that you not bring

As of November 2019, any alcohol with an ABV above 15% is not allowed on IFC fraternity chapter properties, including the House. Yes, that's not a typo. Because it's Pats, most people still bring it, and those in charge will probably look the other way. During Pats it is unlikely that there will be any IFC inspections, so guard will be mostly down. In most cases, if you are chill with the source by leaving it in a room, bag/cooler, or something, you will likely be fine. Since this policy has gone into effect, the guys seem rather relaxed about it as long as you aren't being dumb. As Pats '20–'25 showed, most people who bring the hard stuff tend to manage it rather well. This is not a green light — if you are warned once, just take it off property. Please don't make Booth's job harder as a chapter official by kicking you off his own property.

Note: not that this crowd openly does this, but recreational substances will not be dropping by the house in any form, so leave it at home. We're not holding, so you shouldn't either on chapter property. Yes, it's recreationally legal now in some places — that's not up for debate here. Booth isn't risking the chapter's 60-year-old Charter over anyone's "right" to partake.

## What not to do

When outside the fraternity: you are adults and not Booth's problem — please see the <bummer alert> section above. Please behave as such, and tip well.

Don't freak out if you lose someone, especially if Booth or somebody else wanders off. There are a lot of things going on and the squirrel-chasers are about. Don't be butthurt if you turn around and you've been "left"… just text/call, walk, ride, regroup, and keep drinking. Something not to your liking? Just hit the reset button and head back to the house. Drink some more, catch another ride.

Specific to the chapter house and property: Booth is old and alumni and does have some seniority, but the chapter is run by the undergrads, and they make the rules since they are responsible for everything and everyone. If something is happening that you don't understand, there is probably a reason for it. Please ask before reacting, and let Booth or the exec of the house handle it first. Unrelated note: the house has a 6'x6'x4' deep brick-lined fire pit, and in the evening it will be raging. The fire is managed by the house and you don't need to mess with it. It gets hot, fire burns — do not attempt to jump the fire pit.

Please don't haze anyone. If you do see something funky, no judgement — just let it roll! If it's hella creepy or seriously illegal, then let Booth or someone know.

IM FIRED UP!

## Schedule (turbo guide)

The house's local, dynamically updated schedule is the source of truth — this is a general shape of the weekend from past years:

- Late evening Thursday: Party at TKE for St. Pats Court Reveal (10pm–2am)
- Friday afternoon: Student Knighting Ceremony at the Puck (2pm–4pm); evening social at El Maguey (8pm); late party TBD (11pm–2am)
- Saturday evening: Social at Sputs (8pm–11pm); late party TBD (11pm–2am)
- Monday evening: Social at Alex's Pizza (7pm–9pm)
- Tuesday evening: Social at Public House (7pm–10pm); late party at Lambda Chi Alpha (11pm–2am)
- Pats Wednesday: Court arrival & Follies at the Puck (11am); daytime darty TBD (noon–3pm); FOL/Theta-Tau Casino Night (8pm–11pm); late party at Sigma Tau Gamma (11pm–2am)
- Pats Thursday: Gonzo at Schuman Park Pavilion (noon–6pm); darty at Sigma Nu (noon–3pm); bonfire at the house in the evening; late parties at Beta Sigma Psi and Phi Kappa Theta (11pm–2am)
- Pats Friday: Drivers-n-Donuts at the house (8:30am); Gonzo continues (noon–6pm); St. Pats Coronation at Castleman Hall/Leach Theatre (9pm–10pm); late party at Sigma Nu (11pm–3am)
- Pats Saturday: Street Painters assemble at 6th & Pine at ~3am (mop up, green latex paint — pace yourself, this one's intense); Hasselmann Alumni House opens early with breakfast and drinks; Parade on Pine Street at 11am (Delts on the west side outside the old Grotto); Hasselmann Pig Roast (noon–2pm, pre-registration required, ~$20); Grateful Board Concert at the bandshell (1pm); housing corp meeting (2pm); bonfire and St. Pats Concert on the McNutt lawn (6pm); late parties at Sigma Pi, Delta Sig, and wherever the Pats winner hosts (11pm–2am)
- Sunday: Recovery. Go home. Some grab breakfast and a mimosa on the way out.

## Notes from past years

'20 was the absolute shit — amazing turnout, and the +15% alcohol policy wasn't an issue. '21 Pats and Homecoming were no different — keep it cool and no one has an issue.

'22 was great, power-up! Drivers-n-Donuts at the house Friday morning was a hit, everyone was well behaved, and the parade Saturday was fun.

'23 was a lot of fun — turnout could have been better, but no complaints. Drivers-n-Donuts and the social after were a really good time.

'24 was truly the best ever — Drivers-n-Donuts was a blast, with some new drink ideas for Friday morning. Special shout-out to Tabs, Sonya, Jessica, and Sarah for making it what Booth remembers.

'25 was epic — so epic Booth can't remember most of it, and that's the point. Drivers-n-Donuts was a hit as usual.

Plans for '26: Booth's coming down Thursday the 11th again, and hosting Drivers-n-Donuts Friday morning at the house.$body$,
  'http://vulcan.booth236.net/warez/Pats-prep-Booth_118-32.pdf'
);

-- Point the existing Chapter Portal resource link at the new in-house page
UPDATE public.portal_resources
SET href = '/portal/pats-guide', is_external = FALSE
WHERE href = 'http://vulcan.booth236.net/warez/Pats-prep-Booth_118-32.pdf';
