# The Chang Ngu film: what to fix and upgrade, in the order to do it

Written 2026-10-25 from the owner's list of that day (each item quoted below). The film is
`lanna_tales_changngu.mp4`, v1 (live 2026-10-23, 1271.3 s): the hero film and the studio's card from 0 to 109.75 s,
then the tale (`film.html`, scenes `s01` to `s25`) and the credits (`s26`), joined by `../chain.py`. Times below are
of v1, so a tale second is the film's minus 109.75; each item names its scene and the scene's own second, checked
against a frame of v1 at that time.

**Why this order** (as `../maeng/TODO.md`). Rendering is the slow step, and item 4 touches every scene anyway, so
every scene is drawn and checked in stills first, then the kit check on a copy once, then each scene rendered once,
then the sound, then the join. Each new look (the birds, the wall, the column of Khom, the thinking face, the snake's
tail, the gong's sound) goes on one sheet of candidates beside its reference, for the owner to pick from in one round.

## The kit (other films use these too: kit check after)

1. **The river birds** (1:53, s01 at 3.2 s, the sandbar): "Upgrade the quality of the birds in the animation kit for
   the opening scene ... Add detail and make sure the birds have eyes." `csBird()`, `riverLapwing()` and
   `ringedPlover()` in `chiangsaen.js`: at that size they read as white dashes with no eye. More detail (the
   lapwing's black cap and breast band, the plover's ring and yellow eye-ring, legs, a wing edge) and an eye on
   each, seen at the film's real size. The same birds burst up in s14 (`cngBurst()`, `sets.js`). **Owner's pick
   (2026-10-25): C**, a new body (folded wing with its primaries past the tail, a tail, legs bent back at the ankle,
   three toes), the eye drawn last with a ring and a light, feather edges, dark wingtips, a shadow on the sand.
2. **The snakes' tails** (s14, s15): "Change the snake tails so they have rounded ends and are a bit longer."
   `riverSnake()` in `naga.js`: the tail ends round, not in a point, and runs a little longer. **Owner's pick
   (2026-10-25): A**, 860 long (was 760), tapering to 10 at the tail (was 14), a round end; the wave and the neck
   keep their length.
3. **A thinking face** (11:00, s15 at 7.8 s): "give the prince a concentrating/thinking expression around 11:00 when
   he is thinking hard according to the story." A feeling for the kit's faces (brows drawn together, eyes a little
   narrowed and looking aside, the mouth pressed small), alongside the 9 feelings, then on Phrom there. **Owner's
   pick (2026-10-25): C**, brows knit hard, the head on one side, the eyes up: "thinking" = worry 0.6, anger 0.35,
   sad 0.4, bend 0.03, tilt 0.2.

## The scenes, one by one

4. **Life in every scene**: "Go through each scene and decorate it with birds, animals, fish, plants, flowers, unique
   Lanna items, etc. as appropriate." Scene by scene, from what the kit has: the river's birds and fish (`s01`, `s13`
   to `s20`), the town's things (`s01`, `s03`, `s04`), the house's (`s05`, `s10`), Ku Kaeo's flowers and trees (`s07`),
   the village's animals (`s11`, `s13`), the night's (`s08`). Nothing that plays at monks or rites (the respect rule);
   keep action above y 880 (the subtitles).
5. **A brick wall for Yonok** (2:10, s01 at 20.2 s, the pan to the town): "Add a brick wall to the city of Yonok."
   The set leaves the river side without a wall on purpose (`sets.js` near line 201: Chiang Saen had none there, the
   Mae Khong was its moat; Penth 1975). The north rampart is drawn (`cityWall`, far left, small) but hardly shows at
   2:10. **Owner's pick (2026-10-25): the north rampart's outer face (`cityWall`) larger, to the bank, "and extend
   the wall down to the bottom of the screen": it turns at the bank and follows it down to the frame's foot.** That
   wall along the river is the owner's departure from the sources, said so in `sets.js`.
6. **A second column of Khom** (2:40, s02 at 17 s): "Add a mirrored column of Black Khom soldiers entering the city."
   The column comes in from the left to the gate (`s02_khom.js` line 54): a second, mirrored, from the right.
7. **The baby smiles** (4:36, s05 at 12.2 s): "Add a small smile to the baby face." The baby in `hangingCradle()`
   (`chiangsaen.js`) sleeps with no mouth: a small smile. Check the baby of s10 too.
8. **The house dressed** (4:36, s05): "Add some decorations to the house and outside the house add natural items as
   decorations to the scene as well." Inside: things of a Lanna house on the wall and floor. Outside the window:
   trees, flowers, a bird.
9. **The temple on its hill** (5:34, s07 at 3.2 s): "make the mountain bigger so the circle the temple sits on is on
   the hill and doesn't extend outside the mountain." `cngKuKaeo()` in `sets.js`: the chedi's round terrace is wider
   than the hilltop. A wider, higher hill under all of it; the path and the tree to suit.
10. **The swords gripped** (8:35, s11 at 37.8 s): "have the boys grip the swords." Their hands close on the hilts.
11. **Fifty children, three deep** (9:41, s13 at 18.8 s): "Add more children to the scene so they are 3 deep and go off
    the screen so it seems like there may really be 50."
12. **The birds fly away** (10:05, s14 at 7.8 s): "the birds should just fly away." They burst up and then hang in the
    sky for the rest of the scene: they fly on and out of the frame.
13. **More children on the beach** (s14 at 10:00, s15 at 11:00): "add more children to the scene on the beach." About
    15 now: more, in rows, going off the frame as in item 11.
14. **Two trunks** (13:25, s18 at 22.8 s): "the elephant has 2 trunks. Maybe there are 2 sprites one behind the other."
    One trunk up, a second down toward Thukkhita. Find what draws the second (two elephants drawn, or a trunk drawn
    twice) and keep one.
15. **The credits' elephants** (s26; the owner's time is 21:11, the film's last second; the elephants pass beside the
    cast list about 19:40 to 19:50): "the elephants trunks get cut off." Find where the trunk is clipped and draw it
    whole.
16. **The credits' sky** (s26, from 18:41): "a dark area above the horizon and a line separates this dark area from a
    lighter dark area. From the top to the hills, make it consistent like the top area the moon is in." One night sky
    from the top down to the hills, no band and no edge.

18. **The newborn in his mother's arms** (s10, about 7:35): "When the second baby is born it looks to be floating in
    air. Put it in it's mothers arms." (owner, 2026-10-25). `swaddledBaby()` at `C10_BABY` hangs beside the queen's
    hand: she holds him, cradled in her arms (`reachA`, `reachB` to him), and he moves with her.
19. **A cloud cut in two** (found 2026-10-25 checking item 5; 2:10, s01 at 20 s): a cloud at the top right ends on a
    straight upright edge where the two panels of the pan meet.

## The sound

17. **The gong** (13:05, s18 at 2.8 s): "add a gong sound when the gong is struck." Thukkhita strikes the golden
    plate (the kangsadan, "ting ting"), and `C18_SOUND` is empty. A bright ring at each stroke: a free recording
    (Wikimedia Commons, CC0 or CC BY), and **owner's word (2026-10-25): "if the quality is bad or there is background
    noise generate one"**, made from numbers as the music is; a `sounds.py` entry either way, and the credits say
    where it came from.

## Done in stills, 2026-10-25

Each was looked at in stills of its scene at its moments (`stills.py`, full-size crops where small).

- **1 birds**: `csBird()` redrawn (pick C) for the pratincole, the lapwing and the plover; the lapwing had an eye all
  along, under its black cap: the eye is drawn last now.
- **2 tails**: `riverSnake()`: `RIVER_SNAKE_LONG` 860, a taper to 10 and a round end; all three river snakes (s14's
  two, the pearl one of s15 and s23) draw through it. Seen round in s15 at 30 s and s23 at 27 s.
- **3 thinking**: the kit's tenth feeling, `thinking` (`FEELINGS`, `docs/kit/feelings.md`); Phrom wears it in s15
  until 13 s, his eyes up and aside.
- **4 life**, by `decorate.js` (two new kinds, `egret` and `fish`, the fish leaping out of the water and back) and
  `sets.js` `cngYard()` (a rooster and two hens pecking about a spot): s01 a flock across the dawn, an egret low
  over the water and a barb that leaps, all before the voice; s03, s06, s09, s11, s17, s19, s23 a yard's fowl clear
  of the people; s05 a tokay on the wall; s07 a flock home at dusk, in the quiet after his first words; s13, s16,
  s18 a barb leaping by the sandbar, s16 and s18 a flock in the quiet; s24 two egrets over the new city's fields
  after the words; s25 a flock home at dusk after the words. On the sets' sheets: the village's papaya, frangipani,
  marigolds by the headman's house and hibiscus; the room's (item 8). Left without on purpose (the kit's rules:
  nothing moves through a death or a fear, life stays out of the way): s02 the Khom take the city, s04 the tribute,
  s08 the dream, s10 the birth (the room is dressed), s12 the deva in the night, s14 and s15 the snakes (their birds
  fly off), s20 the spies, s21 the battle, s22 Indra's wall, s26 the credits (their owl and bats).
- **5 wall**: `cityWall` larger to the bank, and `cngBankWall()` down the bank to the sheet's foot (`sets.js`).
- **6 Khom**: the second column from the near right, a half step behind (`s02_khom.js`).
- **7 smile**: `swaddledBaby()` has pink cheeks and a small smile (both babies, s05 and s10).
- **8 house**: `cngRoom()`: a striped sin hung on a bamboo rail, bananas from the beam, the rice basket and a basket
  under the window; through the window a frangipani, the ta laew on its post and a bougainvillea. s05, s08, s10.
- **9 hill**: `cngKuKaeoRidge()` has a broad flat crown 220 either side of the chedi; the clearing sits on it.
- **10 grips**: the owner, after the first try: "The swords should be in front of the hands and behind the fingers.
  The biceps should be angled down with the forarm at a flatter angle and the sword pointing almost straight up. Then
  the arm should extend up and the angle of the sword should naturally fall back." The kit's `holding: "dap"`
  (oldcartoon.js): the hilt across the closed palm, painted after the palm and before the fingers (`hand()`'s
  `pose.held`), the blade square to the forearm and `DAP_TILT` forward of it; s11's `c11Stroke()` takes the wrist
  from the guard (upper arm down, forearm level, blade upright) up and forward to the stroke (the blade back over his
  head), the brothers in turn.
- **11, 13 children**: thirty, three rows of ten, the far ends past the frame (`sets.js` `cngWaiting()`,
  `cngHuddle()`, `CNG_KIDS`): s13 (village and bank), s14, s15, s16.
- **12 birds away**: `cngRiverLife()` takes `away`, the seconds since they rose: they fly on and out of the frame
  (s14, s15); gone by 13 s in s14.
- **14 trunks**: s18 drew the elephant twice once it was on the sand (under the river's near edge, and over the
  bank, with different trunks): drawn once now.
- **15 credits' trunks**: it was Chang Ngu, the snake elephant, beside the cast (not the white elephant): its trunks
  ran past `sabaiTile()`'s scratch sheet and were cut. Drawn at size 0.15 (the tile fits it to the same size).
- **16 credits' sky**: the night's darkening of the river (from y 320, its top edge the line) now lies only on what the
  river's layers paint (`c26Land()`): one night sky from the top to the hills.
- **17 gong**: `sounds.py` `plate-ting`, made from numbers (no free recording rang true: Commons' gongs were deep, one
  cut off, one with a room in it); `C18_SOUND` calls it at the four strokes; the credits say so.
- **18 newborn**: in her lap, held across her front, her hands under him (`s10_born.js`).
- **19 cloud**: s01's clouds on the frame, not on the pan (`cumulus()` draws on one sheet's width).
- **The old film's scratches gone** (owner, 2026-10-25: "remove the vertical yellow lines that pop up to make it look
  like an old film from the framework"): oldcartoon.js no longer draws the pale upright line on about one frame in
  sixteen; the grain, flicker, dust and dark corners stay. For every film of the kit.

## Then

**The hero film** (owner, 2026-10-25: "Replace the hero video with the one the meang si hoo video uses when you are
done with the other work"): the join takes Maeng's hero, `../sash_maeng.html` in Pan's readings, as rendered for
`lanna_tales_maeng.mp4` (`series.json`: 122.475 s, the card at 122.5 s), in place of `lanna_sash_pan21`: that render
is `lanna_sash_maeng_cuts.mp4` (122.47 s; its frame at 42 s is the published film's, compared 2026-10-25). Every film
time after it moves by about 12.7 s from v1's.

Kit check on a copy, render every changed scene once (from a clean tree), the sound, `chain.py` with the hero and the
card, loudness (-14 LUFS), and show the owner. v2 goes to S3 only on the owner's word.

## v2 rendered and shipped, 2026-10-25

All 26 scenes rendered from lannamation a0f191e (laptop scenes 1 to 14, the Spark 15 to 26; the kit check skipped,
owner: "Cancel the check for this time"). The render's look found only what is meant: the fish going back under
(scenes 1 and 13), the riders into the gate's dust (21), Phrom's knee behind the elephant as he climbs down (23, as
in v1). Joined: hero 122.5 s, card 12.0 s, tale 1161.5 s = 1296.0 s, -14.0 LUFS, peak -1.7 dBFS, the joins seen.
Shipped over v1 at krueng.ai/video/lanna_tales_changngu.mp4 (owner: "yes"); `series.json` says v2's parts.

Seen after: scene 18's pale title, ช้างพานคำ, lies over a cloud at 690 s of the tale and reads poorly. Not fixed.

## v3: the scenery pass, the new beasts, scene 18's title (owner, 2026-10-26)

The owner chose, of "the Chang Ngu video upgrade": **the scenery pass as the Maeng film's** (`docs/kit/places.md`,
"Painting the scenery", with `../scenery.js`), **the new elephants and buffalo** (c7b37e6: shorter legs; the white
elephant and Chang Ngu draw through `elephant()`) and **scene 18's pale title** over a cloud (690 s of the tale).
Everything else as v2. The steps, in the order to do them (rendering is the slow step, so every scene is painted and
seen in stills first, and each scene is rendered once at the end):

1. **Read how Maeng was painted** before touching anything: `docs/kit/places.md` "Painting the scenery", the header
   of `../scenery.js` and `../scenery.html`, and Maeng's own use of it (`../maeng/sets.js`: `MAENG_FAR`, `MAENG_AIR`,
   `maengForest(brush, ridge, {blooms, pines, top, foot, seed})`, the slope clothing `maengDoi()` became;
   `maengSky()`'s "sunset" and "sunrise", `maengMorningLight()`, `maengGlint()`; 9287bd0 and the peer's commit after
   it). The Maeng pass is still going on in a peer session: `../scenery.js` is the kit's and shared, so a change there
   is agreed with the peer first; Chang Ngu's painting goes in `sets.js` here. 9287bd0's calls keep their signatures;
   the peer adds only optional ones: `scenerySun()` (a warm disc for a low sun: a white one is lost in a pale sky),
   `sceneryLampLight()` (a lantern's flicker and its pool of light), `sceneryCaveTint()` with the x, y the sprite was
   placed at, and in `../pieces.js` `look.fine` (bamboo fibres, teak grain, a plinth's mouldings) and a ladder "in".
2. **SCENERY in `story.py`**, a line for each of the 25 scenes of the plan (`python tale_plan.py changngu` names any
   without and the plan shows it red; the credits, s26, are painted with them). By set, as the scenes use them (one
   set painted once serves all its scenes):
   - **the Mae Khong** (`cngRiver`, `cngRiverLife`): s01, s13, s14, s15, s16, s18, s26. The river as a water
     (`sceneryWaterSurface()`), but a wide brown river that flows, not a still pond: its mirror soft and broken,
     the sandbar and the far (Lao) bank's trees mirrored; plants along the near bank; no lotus in the main stream.
   - **the village and its yard** (`cngVillage`, `cngYard`): s03, s04, s08, s09, s11, s13, s17, s19, s20, s23.
     Painted trees in fruit (longan, mango, banana, papaya), flowers at the houses' feet, beds behind the people.
   - **the town, court, palace, gate and fields** (`cngTown`, `cngCourt`, `cngPalace`, `cngGateWall`, `cngFields`,
     `cngLane`): s01, s02, s04, s06, s20, s21, s24. The fields as Maeng's paddies were painted.
   - **Ku Kaeo's hill** (`cngKuKaeo`, `cngKuKaeoRidge`): s07, at dusk; a frangipani at the temple.
   - **the new city's skyline and Doi Chang Ngu** (`cngSkyline`): s22, s23, s24, s25.
   - **the room** (`cngRoom`): s05, s08, s10, s12; only what shows through the window.
   - **the skies** (`cngSky`): soft clouds (`sceneryClouds()`) in place of the cartoon cumulus everywhere (this also
     clears scene 18's title of its cloud, step 6); the nights of s08, s12 and s26 with fine stars and NO Milky Way
     (`sceneryStars()` band null), the moon, bats behind a far range and fireflies; a sky of its own for each dusk and
     dawn (s01's dawn, s07's dusk, s25's), as Maeng's "sunset" and "sunrise" (a flat dusk gradient looked poor); a
     low sun drawn after the clouds (they grey it), as a warm disc.
   - **the far mountains**: Chang Ngu's own (`farRange()`), not the hero's nor Maeng's (owner: "Don't reuse the same
     background mountain"): the low hills across the Mae Khong in Laos and the Chiang Saen basin's, compared with real
     photographs of the place (kept out of the repo).
   - **the air** by the line's feeling (the kit's rule): none where v2 left life out on purpose (s02 the Khom take the
     city, s04 the tribute, s08 the dream, s10 the birth, s12 the deva, s14 and s15 the snakes, s20 the spies, s21 the
     battle, s22 Indra's wall, s26 the credits' night, which takes fireflies only if the owner wants).
3. **Scene by scene, with the owner** (owner's pick, 2026-10-26, as the Maeng pass went: "I'd like to go through all
   the scenes like this"; no A/B/C sheet): for each scene, 3 or 4 stills of it as it is, a numbered plan of what
   its place gets, the owner's yes, then build and show stills again. The far mountains come first, with two or
   three candidates beside a photograph of the place, since every set stands in front of them. A set shared by many
   scenes is painted the first time a scene needs it, in `sets.js`, and the later scenes take it from there.
4. **What the owner taught in the Maeng pass**, to do from the start: a bush or hedgerow stands on the ground, its
   foot running all the way down ("Keep going down with the bush because it's floating"); bushes about a boulder
   split into those behind it and those before it; thin wraps on lashings, not bold crosses; fine grain on wood and
   bamboo; flowers and fruit on the near slopes for colour; water mirrored as the hero's pond, egrets over it and in
   it; one butterfly at most. Keep every action above y 880 (the subtitles); what flies or swims is given its z.
   Traps: `between()` is a smoothstep, not a straight line; a "lighter" wash centred on a sun hollows it to a ring
   (start its gradient clear at the middle); dust or paint the colour of the path vanishes on it; a heavy page (500
   ms a frame) times out in a stills sheet of many frames, so take one frame a run; a camera push moves pixel probes.
5. **Every scene's stills** at its moments (`../stills.py`) once its plan is built, then a quick clip of each changed
   scene with its narration (`render.py ... --fast --no-vanish --from A --to B`, the film's sound laid under it) for
   the owner to watch.
6. **Scene 18's title**: find where the scene titles are drawn for the film (`film.html` and the kit's `film()`),
   and make ช้างพานคำ read over any sky (no cloud behind it once the soft clouds are in, and the title's own
   shading if it still reads poorly); the stills at 690 s of the tale show it.
7. **The new beasts** come with the render: the scenes that draw an elephant, the white elephant or Chang Ngu (s08,
   s12, s15, s16, s18, s19, s20, s21, s22, s23, s25, s26) are looked at in stills for the elephant's new height
   (shorter legs: what is set on its back, a rider, a howdah, a trunk reaching to someone, its feet in the river).
   The swimming white elephant of s15, s16 and s18 was moved with c7b37e6 (`SWIM + 160`): check its waterline against
   the river's new mirror; if it is to be mirrored it is drawn before the water, as a flier over it is
   (`sceneryMirrored()`).
8. **Kit check on a copy** of every changed page (all 26 scenes and `film.html`, plus `scenery.html` if the kit
   changed), never on the shared checkout.
9. **Render every scene once** from a clean worktree at the commit (`../scenes.py` on the laptop and
   `../maeng/render_back.py` on the Spark, from the two ends), one heavy job on the laptop at a time. The Maeng film's
   14 scenes render first (agreed with the peer, 2026-10-26: its pass is painted, this one starts with stills, which
   are light); the peer says when it starts and when the laptop is free. The render's look (popped, blinked out) read
   for every scene.
10. **The sound is v2's**: the scenes keep their seconds, so the tale's sound is copied from v2's tale as it is. The
    hero is Maeng's newest hero with the new beasts (the same one Maeng's film opens with when this ships); the card
    as v2. `../chain.py` hero + card (`--fade 1,0.75`) + tale; the whole checked at v2's length (1296.0 s), -14 LUFS,
    peak at most -1 dBFS; shown to the owner. **v3 goes to S3 only on the owner's word.**

### v3, the owner's picks (2026-10-26)

- **The far mountains: C** (of three candidates beside a photograph of the Lao hills across the Mae Khong from
  Chiang Saen): ridge behind ridge, taller, blue and hazy with the air, a few pines standing out of the forest, the
  Lao bank's low line of trees in front (every photograph has it). `farRange()`'s sheet made small (0.72) about its
  foot and copied beside itself mirrored, so the range is far across a wide river: `CNG_FAR`, `cngFar()` in sets.js.
- **The Mae Khong's water: "Water 1"** (owner: "Look at the water in the pond scene and try to recreate the lazy slow
  Mae Khong and give it the qualities of water like the pond has"): the river as a water (`sceneryWaterSurface()`):
  the Lao bank, the sandbar and the ducks mirrored in it, strong across the far water and fading toward the near bank;
  brown with silt whatever it mirrors; slow streaks of current and foam drifting downstream, left to right (the river
  runs south, we look east into Laos); the water parting at the sandbar's upstream end; a thin mist along the far water.
- **The ducks: B** (owner: "The 2 birds in the water could use a lot more detail"): `spotbill()` redrawn from
  photographs of the Indian spot-billed duck: pale head and long pale neck finely streaked, dark crown and eye stripe,
  the red spot at the bill's base, the black bill tipped yellow, dark flanks scaled with pale edges, the breast paler
  and spotted, the white tertials, the green speculum, shaded, with its reflection and a small wake.

### v3, scene by scene

- **s01, the Mae Khong at dawn** (owner's yes to a plan of 7, 2026-10-26; done, stills seen, "Good"): the sunrise sky
  (`cngSky("sunrise")`), soft clouds (`cngClouds()`) dawn going to day; the sun coming up over the Lao hills
  (`C01_SUN`, `scenerySun()` after the clouds, before the hills) and its glitter on the water (`natGlitter()`, over the
  mist); the far range in the dawn's light (`cngFar(..., "dawn")`), fading to the day's; the dawn's mist lying on the
  river and rising off it, gone as the day comes; the egret mirrored under it (`C01_EGRET_HIGH`); the barb's one leap
  with its rings (`C01_LEAP`, `sceneryLeap()`); reeds and clumps of grass along the near bank, soft grass in the bottom
  corners (`cngRiverBank()`); the town's trees painted in fruit and flower (mango, longan, golden shower, flame of the
  forest, a frangipani by the chedi), flowers at the houses' feet, the houses moved left, clear of the wall; the sand's
  step where the town's panel meets the river's mended; one live river under both panels (`cngTown()` in two: back and
  front). And the bank's wall in 3D (owner: "make the right hand side brick wall look more 3D. have a path for soldiers
  like a road and then battlements on the right hand side", with a photograph of Chiang Saen's wall): `cngBankWall()`,
  its walkway paved, its inner face of brick, its parapet and merlons on the river's side, the earth bank below.
  A frame of s01 is about 0.5 s on a loaded laptop: render it in one run of its own.
- **s02, the Black Khom take Yonok** (owner's yes to a plan of 7; done, "Good"): soft clouds in all three shots;
  Chang Ngu's range behind the court and the gate (`cngFar()` at foot 560); the rampart behind the court in 3D
  (`cngCourt()`: merlons on its outer edge, the walkway along its top, its inner face of brick with courses and joints,
  shade at its foot); `cityWall()` in depth (chiangsaen.js, Chang Ngu's own: merlons with lit tops and shaded sides,
  the coping, grass on the earth face, shaded palisade posts, the gate's passage with its sides and the town's daylight
  beyond as the doors open, the moat a water mirroring the wall, `look.t` for its ripples; a page without
  pinewoods.js keeps the old waves); the court's trees painted (golden shower, frangipani, mango), small beds of
  hibiscus and orange jasmine at its back, finer paving (`cngBeds("court")`); the fields as paddies in rows behind
  bunds, ruts in the road, bamboo, a mango on a bund, beds of flame of the forest and hibiscus at the sides
  (`cngBeds("fields")`), soft grass in the corners; no air (the city is taken).
- **s03, to Si Tuang** (owner's yes to a plan of 9; done, "Good"), and with it the village set of s04, s08, s09, s11,
  s13, s17, s19, s20, s23: soft clouds; Chang Ngu's range behind Doi Nang Non; Doi Nang Non clothed in forest
  (`sceneryForest()`, moved into scenery.js from the Maeng film's maengForest() by agreement with its session, 64402ea,
  Maeng's frames pixel-identical; `CNG_FOREST_BLOOMS`); the paddies in rows behind their bunds (`cngPaddies()`, scene
  2's fields on it too, their frames unchanged); the Mae Sai a water with grass and reeds along it (`cngStream()`);
  the trees painted in fruit and flower (longan, mango, golden shower, flame of the forest, a frangipani by the
  headman's house); small beds at the back of the ground; the fences' bamboo grained, the lashings thin; soft grass in
  the corners (`cngBeds(t, "village", "frame")`); the air light only, no petals or butterfly (he loses his crown).
  The other village scenes still have their cartoon clouds and no corner grass: each gets them when it is visited.
- **s04, four tuang of gold** (owner's yes to a plan of 6; done, "Good"): soft clouds; the near Mae Sai a water
  (`C04_WATER`: the panners mirrored, `C04_RINGS` at their shins, reeds at its edges); the close on a teak floor
  (`sceneryWoodGrain()`) and a woven tray, strips over and under with their grain, its rim bound (`c04Close()`,
  painted once), shadows under the bael and the lumps, glints winking on the gold; the old picture's court with its
  beds in sepia; soft grass in the corners; no air.
- **s05, Thukkhita** (owner's yes to a plan of 6; done), and with it the room of s08, s10, s12 (day and night): through
  the window Chang Ngu's range and a ridge of forest (`sceneryForest()` over the window only), a frangipani painted in
  flower; the teak boards each grained (`sceneryWoodGrain()`, a knot on every fifth), their edges lit and shaded, the
  beam grained and the rafters' edges lit, the floor plank by plank; the window's light lying on the floor in bars
  with a faint shaft (the moon's, paler, at night); the mat woven over and under; dust motes in the shaft
  (`cngMotes()`, the air of a room by day).
- **From s06 on, the owner (2026-10-26): "Go ahead and make plans without consulting me."** Each scene's plan is
  written here and built; the stills are shown together at the end.
- **s06, the novice** (my plan, done): the lane at sunrise (`cngSky("sunrise")`, dawn clouds, Chang Ngu's range in the
  dawn's light), the rampart behind in 3D (`cngRampart()`, out of `cngCourt()`, scene 2's frames unchanged), painted
  trees in flower and fruit, flowers at the houses' feet, ruts and grass along the lane, the dawn's mist low between the
  houses, the first light (no petals or butterfly); the court with soft clouds and its beds; no air in the court.
- **s07, the wish** (my plan, done): a sunset of its own (`cngSky("sunset")`), soft dusk clouds, the sun going down
  over the range at the left (`C07_SUN`); Ku Kaeo's set painted for each light (`cngKuKaeo(light)`: Chang Ngu's range
  in the dusk's light, the hill clothed by `sceneryForest()`, flowers near its foot, the great tree and a frangipani by
  the chedi painted, grass and stones along the path, the dusk's warm light over it); in the days going over him,
  fine stars and the moon at night (no Milky Way, no fireflies: only his small light rises).
- **s08, the dream** (my plan, done): the room and the village from s05 and s03; the lamp's own light on her and the
  floor at night (`sceneryLampLight()`); soft pale clouds in the dream's sky; dust motes in the morning room; no other
  air (the dream). The white elephant at its new height stands right (c7b37e6).
- **s09, weapons** (my plan, done): the forge's yard painted once (`c09Yard()`: beaten earth with charcoal, pebbles and
  footprints, dark with soot under the forge; the weapons' mat woven); the forge's smoke rising and leaning; the fire's
  light on the smiths (`sceneryLampLight()`, orange); soft clouds; grass in the corners; the light of the day.
- **s10, the birth**: the room of s05 (day) carries it; no air (v2 left life out on purpose).
- **Soft clouds everywhere** (2026-10-26): every scene's `cumulus()` with `CNG_CLOUDS` is `cngClouds()` now, but s22's
  heavenly clouds and s26's night, which are their scenes' own.
- **s11, growing up** (my plan, done): the forge's yard from s09, moved into sets.js as `cngForgeGround(f, mat)` (s09's
  frames unchanged); the forge's smoke and the fire's light; the season's light as v2; grass in the corners; the day's
  light and one butterfly (a boy growing up). The room's floor: a knot on every third plank (the eyes along the floor).
- **s12, the deva** (my plan, done): the night room of s05; the lamp's light (`sceneryLampLight()`); the vision's river
  as the film now paints it (`cngRiver()` small in the oval: the range, the still brown water, the sandbar), and the
  three white elephants float in it, the water to their bellies, a ring round each (they stood on it in v2); no air.
- **s13, to the river** (my plan, done): the bamboo at sunrise (dawn clouds, the dawn's mist on the fields, the first
  light); the children's run with soft clouds and one butterfly; on the bank the reeds and grass along the water
  (`cngRiverBank()`), rings where he washes (`C13_RINGS`), grass in the corners, the light only.
- **s14, s15, s16, s18 on the river** (my plan, done): the river set of s01 carries them; v2's flat band and waves over
  whoever is in the channel are the river's own face now (`cngRiverOver()`: the elephant's legs, the children to their
  shoulders); reeds and grass along the near bank, soft grass in the corners (`cngRiverBank()`); no air in s14 and s15
  (the snakes), the light only in s16 and s18. **Scene 18's title** (step 6): ช้างพานคำ edged in dark brown over a soft
  dark halo, so it reads over any sky (it was pale over a cloud at 690 s of the tale); s16's ควานทน the same.
- **s17, the golden plate** (my plan, done): soft clouds in all three shots; the yard's beaten earth
  (`cngForgeGround(null)`: a yard with no forge, no soot) and the forge's (scenes 9, 11), its smoke and the fire's
  light; grass in the corners; the light of the day.
- **s19, golden pots** (my plan, done): soft clouds; the yard's beaten earth under the yard and the stable; the stable's
  thatch laid in rows of bundles, its strands down the slope, its posts grained (`cngStable()`); the moat shot's water
  rippling (`cityWall()` look.t), and outside the earthwork the fields and the road to its gate (`cngFields()`), not the
  village's houses as in v2; grass in the corners; the light of the day.
- **s20, three years; s21, Thung San Chai** (my plan, done): the range, fields, court and gate of s02 carry them; the
  drill field painted once (`c20Ground()`: grass worn to the earth in patches, its blades); the Khom court's beds; soft
  grass in the corners of the open shots; the light only on the drill field, no air for the spies, the Khom king or
  the battle.
- **s22, the stone wall** (my plan, done): the road south painted once (`c22RoadSet()`: Chang Ngu's range, the slope
  clothed by `sceneryForest()`, the road's ruts and grass), soft clouds by day, fine stars and the moon through the
  month's nights; heaven's clouds soft and lit gold from within, above and below (`sceneryClouds()` colours of its
  own); Indra's wall in depth (`risingWall()` in chiangsaen.js: each stone lit and shaded, speckled, moss in its
  joints, the wall's top lit and its near end in shade).
- **s23, Doi Chang Ngu** (my plan, done): the plain painted once (`c23Plain()`: Chang Ngu's range, the paddies, the
  hill), Doi Chang Ngu's forest painted as a mountain's (`karstHill()` with natBush() where the scenery's painters are
  loaded, its circles kept for a page without them); the home yard's beaten earth with its fowl on it (v2 drew the
  ground over them); soft clouds; grass in the corners; the light.
- **s24, the brothers** (my plan, done): the court's beds; the wedding under a sunset of its own; Wiang Chai Prakan's
  back painted once (`c24TownSet()`: Chang Ngu's range, the plain, the earthwork), the Kok a water mirroring them
  (`C24_WATER`, scenery.js), grass along its near bank, soft grass in the corners, the light.
- **s25, Chiang Saen today** (my plan, done): a sunset and the sun low over the hills; the road at dusk painted once
  (`c25Set()`: Chang Ngu's range in the dusk's light, the paddies, the town's trees painted, the dusk's warm light);
  each street lamp's pool of light on the road as it comes on (`sceneryLampLight()`).
- **s26, the credits** (my plan, done): a clear night sky (`cngSky("clear")`) with fine stars, no Milky Way
  (`sceneryStars()`), soft clouds in the moon's light; the river at night is the new river; the moon, owl, bats and
  fireflies as v2. `CNG_CLOUDS` and `cngSkyline()` are gone (nothing calls them now).

### v3: where it stands (2026-10-26, about 20:30 ICT)

All 26 scenes painted and seen in stills (overview: one still of each). The page generators (scene_page.py and
film_page.py, kept privately) load the scenery's painters as the pages do. **Not yet done:** step 5's quick clips
with narration, step 8's kit check on a copy (`checks/kit_check.py` over all 26 pages, film.html and chiangsaen.html:
chiangsaen.js changed, spotbill(), cityWall(), risingWall(), karstHill()), the commit and push (by path, after the
kit check), step 9's render (the laptop and ONE Spark render job at a time, the next only after the last ends: the
owner's rule since 2026-10-26; Maeng's renders first), step 10's sound, chain and the owner's look. A frame of s01
and the river scenes is about 0.5 s on a loaded laptop (natReflect twice in some): render each in a run of its own.

## v3 rendered and shipped, 2026-10-27

All 26 scenes rendered from lannamation 9aabac1 by the laptop and the Spark from either end (the Spark in software,
no `--gpus`: the GPU path hung at its first screenshot), scene 21 again from ad1a5df (the white elephant goes through
the gate, faded on a layer of its own; 0 blinked out). The render's look found only the barb leaping and diving back
in (scenes 13 and 18), which the blink check now lets pass (`VANISH.dives`, ad1a5df). v2's sound under it. Joined by
`../chain.py` with `--fade 1,0.75`: the hero with the new beasts (`lanna_sash_maeng_beasts.mp4`, 122.5 s), the card
12.0 s, the tale 1161.5 s = 1295.97 s, -14.0 LUFS, peak -1.7 dBFS. Shipped over v2 at
krueng.ai/video/lanna_tales_changngu.mp4 at 07:04 (owner: "Go ahead and ship the videos and commit and push."),
871,441,483 bytes, sha256 84165296..., the public copy read back and matched; `series.json`'s parts are unchanged.

## v4: the owner's list of 2026-10-27 (after v3 went live)

1. "redo the grassy area ahead of Wiang Si Tuang and make the flat grassy area rich with flowers and birds, and
   animals" (after a clip of Spirited Away's meadow): `sceneryMeadow()` (scenery.js), a flat meadow in drifts of grass,
   leafy clumps, tall grass in plume and wild flowers, where the valley's paddies were (`cngVillage()`, the village
   standing in it); scene 3's life: egrets feeding, a barking deer and her fawn, doves, butterflies, a flock
   (`cngFeeding()`; the pages load lannabirds.js and taleanimals.js).
2. "look at Yonok from the front view and fix the grassy area there": the same meadow before the wall (`cngFields()`,
   scenes 2, 19, 20, 21), egrets, butterflies and a flock in scene 2. The rampart's earth face is as it was.
3. "When the queen gives rice to the monk the rice should go in the monk's bowl" (scene 6): her hand to over the bowl,
   the rice dropped in, a mound of it in the bowl after.
4. "the workers carrying items shouldn't be making hand gestures like they're laughing/mocking": `cngPorter()`'s near
   arm swings free (its hand on the pole was before the face); scenes 3, 4 and 24.
5. The statue's heads, "a right angle cut out of them near the jaw" and "the trunks get cut off when they raise up":
   `changNguHead()` draws the elephant's head alone (`elephant(..., {only: "head"})`, beasts.js) where a clip cut it.
6. "Add some vegetation to scene 24. make it grassy and wild but beautiful": Wiang Chai Prakan's land a meadow in
   flower, the porters' track, bamboo, a flame of the forest; the near bank tall grass in plume, reeds, flowering
   bushes; butterflies.

Items 1 to 6 are in lannamation 0b54310 (pushed 2026-10-27), each seen in stills (before and after on one sheet). Not
rendered: the render began and was stopped (the owner, 09:30: "hold off on V4").

### v4: on hold, and what it waits for (2026-10-27, about 09:50)

v4 is rendered once, after two pieces of work from other sessions land in lannamation (the owner: "a new set of sprites
for Chang Ngu is coming that will go into v4 as well as a hand animation change for the kit that will affect all
scenes"):

- A new set of sprites for Chang Ngu (another session): they go into v4.
- A change to the kit's hand animation, which touches every scene of every film. The first part is in: d61af03, "Hands
  run into the wrist and the fingers into the palm, with no line at either join". So v4 renders all 26 scenes, not
  only the 16 that items 1 to 6 change, and no v3 clip is kept.

Then, in order:

1. The kit check, once, on a copy of lannamation main with all of it (`checks/kit_check.py` over the 26 scene pages,
   `film.html`, `chiangsaen.html`, and the Maeng and hero pages the hand change touches). A check of 0b54310 was
   stopped by the owner after 6 of 47 pages, none failed.
2. Render the 26 scenes: the laptop from 1 up and the Spark from 26 down, in software (no `--gpus`), one container a
   scene, ONE Spark job at a time; a script copies the Spark's clips to the laptop and leaves empty clips on the Spark
   for the laptop's scenes, so neither renders what the other has. Never two heavy Chrome jobs on the laptop at once
   (a render's first screenshot timed out beside a kit check, 2026-10-27 08:37).
3. The sound: v2's tale sound, if the scenes keep their seconds; a new sprite that changes a scene's length means that
   scene's sound again.
4. The join (`../chain.py`: the hero with the new beasts, the card with `--fade 1,0.75`, the tale) and the checks
   (1295.966 s while the lengths hold, -15 to -13 LUFS, peak at most -1 dBFS), then the owner's look. S3 only on the
   owner's word.
5. Sync lannamation into watdonchan (`scripts/sync_lannamation.py`, in a watdonchan worktree of feat/lanna-flora, never
   the main checkout) once the other sessions' kit changes are in: it carries 28259ef, ad1a5df, 5a74fdc and 0b54310 too.

The Maeng film (live as v29 since 2026-10-27 09:39) has every scene drawn with the old hands; whether it renders again
for the hand change is the owner's call.
