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

## Done in stills, 2026-10-25 (render and join left)

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
