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
   each, seen at the film's real size. The same birds burst up in s14 (`cngBurst()`, `sets.js`).
2. **The snakes' tails** (s14, s15): "Change the snake tails so they have rounded ends and are a bit longer."
   `riverSnake()` in `naga.js`: the tail ends round, not in a point, and runs a little longer.
3. **A thinking face** (11:00, s15 at 7.8 s): "give the prince a concentrating/thinking expression around 11:00 when
   he is thinking hard according to the story." A feeling for the kit's faces (brows drawn together, eyes a little
   narrowed and looking aside, the mouth pressed small), alongside the 9 feelings, then on Phrom there.

## The scenes, one by one

4. **Life in every scene**: "Go through each scene and decorate it with birds, animals, fish, plants, flowers, unique
   Lanna items, etc. as appropriate." Scene by scene, from what the kit has: the river's birds and fish (`s01`, `s13`
   to `s20`), the town's things (`s01`, `s03`, `s04`), the house's (`s05`, `s10`), Ku Kaeo's flowers and trees (`s07`),
   the village's animals (`s11`, `s13`), the night's (`s08`). Nothing that plays at monks or rites (the respect rule);
   keep action above y 880 (the subtitles).
5. **A brick wall for Yonok** (2:10, s01 at 20.2 s, the pan to the town): "Add a brick wall to the city of Yonok."
   **Ask first:** the set leaves the river side without a wall on purpose (`sets.js` near line 201: Chiang Saen had
   none there, the Mae Khong was its moat; Penth 1975), and the tale's rule is the chronicle and the sources first.
   The north rampart is drawn (`cityWall`, far left, small) but hardly shows at 2:10. Either show that rampart
   larger and in frame, in brick, or put a wall along the bank as the owner asks.
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

## The sound

17. **The gong** (13:05, s18 at 2.8 s): "add a gong sound when the gong is struck." Thukkhita strikes the golden
    plate (the kangsadan, "ting ting"), and `C18_SOUND` is empty. A bright ring at each stroke: a free recording
    (Wikimedia Commons, CC0 or CC BY) or one made from numbers as the music is; a `sounds.py` entry either way, and
    the credits say where it came from.

## Then

Kit check on a copy, render every changed scene once (from a clean tree), the sound, `chain.py` with the hero and the
card, loudness (-14 LUFS), and show the owner. v2 goes to S3 only on the owner's word.
