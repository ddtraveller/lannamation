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
