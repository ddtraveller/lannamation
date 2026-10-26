# People: the figure, its dress, body, face and hair

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## The model on its own

The owner's judgement (2026-10-11): the character model was at about 65% of where it needs to be,
and the film can wait; the model is judged on `model.html`, not through the lens. Three rounds so
far, each a one-time patch, each looked at as a sheet and as strips of consecutive frames:

1. **Hands** (the dance hand was a sea anemone: fat fingers, fanned too far, curled backward into
   a C): slimmer, even fingers, a gentle fan that widens at the outer fingers, a back-bend at the
   knuckle only. **Face:** a lid that comes down (a blink is a quick drop and a slower lift), two
   lashes on the upper lid, a bow and a light on the smiling mouth, a sheen and more comb lines in
   the hair. **Motion:** the eyes hold and jump instead of drifting; a walker's arms swing by
   themselves and the hips rise through each step; everyone breathes.
2. **What hangs, follows** (`follow`): earrings, sabai ends, waist-cloth ends, the jasmine loop,
   the pin strands, a tail of hair and the drum lag behind the real motion of the body on a
   damped spring, instead of swinging on the beat clock.
3. The walker's arm swing went from sideways to mostly up and down: in a figure seen from the
   front, a sideways swing met the two hands at the belly.
4. The upper lid throws a shadow on the white of the eye; the head lags the body and overshoots
   as it stops (`follow` on the neck, turned into a tilt); the brows drop a little in a blink; a
   walker's hips sway with the stride.
5. **A knee pushes the skirt** (`tier` takes `pushes`): a raised leg used to come out from under
   the side of the pha sin; now the cloth bulges over the knee and the shin shows below the hem.
6. **The face close-up** (the owner's pick, after the puppet was set aside): the iris is a radial
   gradient (`#9a6a34` round the pupil, `#6a3e1c` outward, a `#2e1808` rim) instead of two flat
   discs; the nose is a soft bridge line (`0.45` ink, `0.7 · LINE`) down to a firm tip that rounds
   under, a faint wing round the nostril (`0.32`, `0.5 · LINE`, radius 3) and a faint light down the
   bridge, instead of one hooked line; the chin is rounder (the jaw's control at (18, −227), the chin
   at (2, −229)); the ear is 11 × 14 instead of 12 × 15; a fine strand of hair curls at the temple
   before the ear. A first try drew the wing dark and apart from the nostril and read as a ring.
7. **The head turns** (the first item of the ranked list against the references): `view(turn)`
   blends the head, the hair, the bun, the ears and every feature of the face between profile,
   three-quarter and full face; `model.html` shows seven turns in a row and its big head takes
   `HEAD_TURN` from a page for stills of the profile or the full face. Found by looking: in
   profile the ear hid behind the hair, so toward profile it is drawn after the hair; the front
   nose hooked to one side, so the hook straightens as the face comes round.
8. **Acting** (the second item): five feelings on the face, by number or by name, with what each
   does to the brows, the lids, the mouth, the lean and the tilt (`FEELINGS`); and a pose key marked
   `"snap"` that is hit with anticipation and overshoot. `model.html`'s bottom-left row shows the
   six named feelings on the lady and anger on the fellow (`window.ROW = "turns"` brings the turns
   back), and the big head takes `HEAD_FEEL` for a still of one.
9. **Real dance hands** (the third item): the hand model over the same video, each hand found in
   a crop round its wrist (as the face was), gives five curls a pose, and `glove` bends each
   finger its own way: two fingers out and two curled, a pointing hand with the rest in a fist,
   flat spread hands, as her hands are. One pass in the full frame found hands in 189 frames of
   804; the crops found them in 559.
10. **The spine** (the owner, watching the sample: "Spine is stiff for the model. Introduce some
    sway"): a lean is an arc and the sway is a wave up the spine, hips one way and chest the
    other; the chest's outline became a list of points moved across by `spine(y)`. The first try
    slanted the torso as a block; the second drew it in ten bands and took the model sheet from
    61 ms a frame to 106; the third, moving the points, costs nothing (56 ms).
11. **Lip sync with consonants** (the fourth item), and a wider "ah". Looking at it found an old
    fault: the lips were drawn round the tongue, on every singing mouth of both faces.
12. **The walk's feet** (the sixth item): heel strike, a roll through the foot, toe-off; the ankle
    goes round the heel with the foot.
13. **The line** (the fifth item): a finer pen on a larger figure (`FINE`), so a close-up is not
    inked like a small figure blown up. Tried and dropped for the same item: each figure on a sheet
    of its own, with the heavier side of the line added once round the whole figure instead of
    under every shape. Side by side it was hard to tell from the kit's line, and it was no
    faster once the timing was done properly (6.7 ms a lady against 4.7 to 6.6). No smear
    frames on fast moves: not attempted.
14. **The owner watched the film** (`lanna.mp4`, 2026-10-12) and named five things, each now a
    rule above: the sister's elbow flipped at the door (an arm remembers its bend); arms turned
    right round at the shoulder (the shoulder rule and the forearm rule); a body that moves to
    one side tips its shoulders that way and its hips the other; the walkers' arms were bent and
    their hands cupped (an arm that hangs is almost straight, its hand at rest); and the takraw
    was headed, not kicked. `checks/arms_check.py` counts what an arm cannot do in every frame
    of a film, and found a sixth thing nobody had named: the tracker had the dancer's two arms
    on each other's shoulders.
15. **Takraw is kicked** (`lanna.html`): three players, the ball going foot to foot in an arc,
    the one on the left feeding the other two so nobody kicks behind them. A leg comes up over
    0.35 s as the ball comes down, meets it on the instep and goes down over 0.45 s; the foot is
    held with its toes up (`raise` takes a fourth number, the foot's own turn). Under long cloth
    the foot goes low and far forward (34 up, 92 forward), out where it shows; in trousers 62
    up and 34 forward.
16. **A lady's face, by the painting.** The owner, of the three-quarter face on the other
    session's dancer: "The 3/4 face looks funny." Three passes, each set beside the
    painting's face at the same height: the features (small half-lidded eyes at mid-face,
    thin brows one eye-height above, a one-line nose, a small mouth, faint blush) and a
    longer oval on a neck; then a shorter nose line, a tapered jaw and flat skin; then the
    taper softened, because the first made the chin a point.
17. **A lady's profile, by the painting.** The owner, of the fon lep doll's side view: "The side
    view of the face looks weird." The other session measured the painting's profile; the
    kit's was a round head with a bulge. It was rebuilt as a skull with a flat front and a
    piece before it (brow, nose, lips, chin) that slides out as the head turns. Four passes,
    each drawn at six times size and looked at whole. The first had a ledge at the brow and a
    step under the chin, where two outlines crossed at an angle: the piece now leaves the
    skull along the forehead's slope and comes back along the jaw. It had the ear half on the
    hair (moved to −17, and the hairline brought behind it) and no earring (painted before the
    head, so hidden by it). The dip at the bridge was a corner (now two curves) and the tip a
    point (now a small round end). Then the head was drawn at six turns from profile to
    three-quarter, to see the nose leave the face tip first, and on the doll's own sheet.
18. **What hangs, hangs straight down.** Seen in the same pictures, with the head tilted back
    as the doll wears it: the earring and the tail swung round with the head. They, the pin
    strands and the garland now hang along the film's down.
19. **No shadow on the chin.** The owner, of a man's face on a doll's sheet: "Take the shadow
    off the chin." The ellipse under the jaw is gone, for everyone.
20. **A fellow's profile.** The same build as the lady's, with his own piece: a heavier brow, a
    blunter nose, a smile line that runs to the edge of the face, a fuller chin. Looked at on
    the fellow at three turns, on the villager, the monk, the child, the drummer and the
    scientist in profile, and with the mouth open on "ah" and on "oo". The monk in that row
    showed a curl of hair at his nape: a shaved head has none now.
21. **Hopscotch lies on the ground** (`lanna.html`). The owner, of the film: "when she plays
    hopscotch she doesn't travel up into the sky. Just move the girl and hopscotch track down
    onto the ground." The squares had been drawn stacked up the picture, 36 a row, and she was
    moved up a row at each hop, until she hung before the house and the palms. A thing that
    lies on the ground is drawn as the ground is seen, from the side and a little from above:
    a point so far along it and so far back goes to `(along + 0.3 · back, y − 0.34 · back)`, so
    a square 62 along is 56 wide, 19 deep, and leans. Five rows run to the left along the
    lane, a single square and a pair by turns. She hops a row to each beat: out, a turn, and
    back, ten beats, which was the five seconds of the game (it has six now: see 23). Her
    feet stay on the ground line under the middle of the track, she moves along it only
    while the hop has her in the air, one foot is lifted over a single square and both come
    down on a pair.
22. **The iris closed with a bar across it.** At every cut, for half a second each side, a
    black bar lay across the round hole. `iris()` drew the sheet's rectangle and then the
    circle in one path: the canvas joined the rectangle's corner to the circle's start with a
    line, and the circle ran from 0 to 7 radians, a little more than once round, so the two
    made a wedge that was filled. The hole is now a path of its own (`moveTo` on the circle,
    once round, filled by the even-odd rule). No check found this, and nobody had named it: it
    was seen in one still of a tutorial film, taken at 4.8 s, half a second before a cut. The
    stills this document recommends were always taken in the middle of scenes. **Take one at
    a cut.**
23. **The games follow the song** (`lanna.html`, 2026-10-13). The lane had a new game every five
    seconds of its own clock, `Math.floor(t / 5)`, and each game came as its words ended or
    after them: "kick the takraw" was sung over skipping, "walk on coconut shells, play
    hopscotch" over takraw, and "fly a kite" over hopscotch until its last half second.
    Nothing had measured it: it was found by reading the cue sheet beside the timetable. The
    lane now asks the cue sheet, `cueAt(clock + 1, CUES)`, so a game is there a second before
    the line that names it:

    | Game | Before | Now | Its words are sung |
    |---|---|---|---|
    | skipping | 17 to 22 s | 17 to 20 s | 18 to 19.5 s |
    | takraw | 22 to 27 s | 20 to 23 s | 19.5 to 21 s |
    | shells and hopscotch | 27 to 32 s | 23 to 29 s | 24 to 27 s |
    | kites and tops | 32 to 36 s | 29 to 36 s | 30 to 32.5 s |

    The first line names two games, so each has three seconds, and takraw arrives half a
    second after "kick" begins. Takraw has three flights of one second (it had four of 1.25 s).
    The hopscotch is still ten beats long: in the sixth second of the game she hops in place
    on the first square. The owner saw the two lanes side by side in motion and found them
    much alike; what showed the difference was a sheet of stills at three sung moments, each
    with the words under it. **To show a change of timing, show the moment and its words.**

**How to look.** `python stills.py model.html sheet.jpg 1.0 1.1 1.2 1.3 1.4 1.5` is a strip of six
consecutive frames: 0.1 s apart shows a walk, 0.5 s apart shows blinks and saccades. The sheet's
four parts answer different questions: the walk and the dance test the motion, the head at 4.4
times tests the drawing, the row tests that every model still stands.

**What open source could help (researched 2026-10-11).** Nothing drops in: every rigged-puppet
runtime (Live2D-style) wants a mesh made in its own editor and a WebGL runtime, and the page has no
build step and no dependency. Taken as techniques instead: the Follow rig above (Willett et al.,
*Secondary Motion for Performed 2D Animation*, UIST 2017), the Pose Animator idea of a drawn
surface with a skeleton through it (Google, Apache-2.0, 2020), and MediaPipe's blendshapes
(already in `dance_track.py`; the same models run in the browser through `@mediapipe/tasks-vision`,
which would let a reader track their own clip on the page). Not taken: Spine (needs a licence),
Rive (new exports need a paid plan since October 2025), DragonBones (closed editor), Iki and
Inochi2D (early; WebGL), Synfig, OpenToonz, Blender Grease Pencil and Glaxnimate (they end in
rendered frames, not in code that draws). The open decision is whether the lady should be drawn
once as SVG paths in Inkscape and skinned by the kit, which makes the drawing the ceiling instead
of the code; until the owner says so, everything stays code-drawn.

## Each figure its own

The owner sent a Royal Thai Art painting of a fon lep dancer, two more dancers, and a board of Thai
and Lanna pictures (2026-10-12): "Each character should be as unique and beautiful as this one."
The dancer herself is built by another session as a paperdoll on the kit (`fonlep.js`,
`fonlep.html`); this is what the kit's own cast took from the same pictures. In them no two
figures share skin, dress or ornaments, and the kit's cast shared one skin and one face.

| What the paintings do | In the kit |
|---|---|
| Skin is each figure's own: near white on a dancer, warm on a girl, tan on a man who works outside | `skin: "#rrggbb"` on a look; `person()` sets the kit's skin for that figure and puts it back |
| A pha sin is a straight tube to the ankle in three parts: a plain dark head at the waist, a body striped across (sin ta), a foot of another colour with a woven pattern (tin jok) | `sin: 0, 1 or 2` picks one of `SINS` (indigo with a red foot; green and black with a red foot; brick red with an indigo foot): one tier 196 long, 58 wide at the hem. The figure stands taller in it (hips at 216, where the tiered skirt has them at 190) |
| A dancer's blouse wraps: a patterned band runs down both sides of a V neck and on down the front edge | `collar: [band, pattern]`: three strokes along one path, clipped to the chest (a dark edge 11.5, the band 8.5, the pattern as dots 5.5 apart) |
| A fan of gold leaves stands behind the bun | `fan: true`: seven leaves 27 to 42 long at −1.8 to 0.6 rad, drawn behind the bun and turning with the head |
| Bangles in stacks; long gold nails that curve back from the fingertips (fon lep, the fingernail dance of the north) | `bangles: n`; `nails: "long"`: each nail 36 long (a finger and a half), curving 0.36 of its length away from the palm, worn all the time |
| Cloth carries bands of interlace and of rings | two more kinds of band for `tier`: `"braid"` (two strands crossing 14 times) and `"roundels"` (nine rings with a dot) |
| A shoulder cloth goes with any skirt | a `sabai` no longer needs the tiered `skirt`; a lady in a sin with no sabai wears a blouse buttoned down the front |
| No two faces are one size | `eyes` and `lips`: how large the eyes and how wide the mouth, 1 being the kit's (a child 1.12 to 1.16, an older woman 0.9) |

The cast now: `lady`, `fellow` (tan), `child` (larger eyes), `drummer`, `celestial`, `dancer` (near
white, a wrap blouse, a gold fan, five bangles, long nails), `villager` (darker, a head-cloth),
`monk`, and two new ones from the village paintings: `maiden` (a white blouse with an indigo band,
a pale blue shoulder cloth, an indigo sin with a red foot) and `weaver` (an older woman: an indigo
blouse buttoned down the front, a green and black sin). In `lanna.html` the sister has a rose band
on her blouse, a gold fan and four bangles; one boy is in a turmeric mo hom; the other is darker,
with an indigo head-cloth and a purple sarong; the small girl wears a brick-red sin with an indigo
foot.

`person()` now gives back where its joints came to on the film, in the film's own pixels (`hip`,
`waist`, `neck`, `bun`, `crown`, `chin`, `shoulderA/B`, `elbowA/B`, `wristA/B`, `handA/B`,
`kneeA/B`, `ankleA/B`, with `size` and `face`), so a file that draws on top of a figure can hang
things from them. (`crown` and `chin` are the top of the skull and the point of the chin; a figure
that is a cut-up drawing, `rig`, has neither.)

### The build: how many heads tall (2026-10-13)

A figure's height is counted in its own heads: from the ground to the crown, over the crown to the
chin. `checks/heads_tall.py` measures it from the joints, with each of the cast standing straight.
The kit's figures were said here to be "about four and a half to five heads tall". Measured, the
lady is 4.3 and the fellow 4.5: a big head on short legs, which is the cartoon's build. The figures
of the Thai and Lanna paintings are six or seven, with a small head and long legs.

`build` on a look goes from the one to the other, 0 to 1. Two things change, and nothing else:

| What | Rule | Numbers |
|---|---|---|
| The head is smaller, and stands on the same chin | the head is drawn in a frame of its own, about its middle; the frame is scaled, and moved down by what the head lost below its middle, so the chin stays on the neck. The pen is made heavier by the same measure inside the frame, so the ink on the head is the ink on the body | `small = 1 - 0.28 * build`: 0.72 of its size at 1 |
| The legs are longer, and what hangs to them | the hips stand higher, the two bones of each leg are longer by the same measure, and so is a tiered skirt, a sin or a sarong, and a long coat. A shirt's hem and the ends of a sabai are not: they belong to the body above | `leggy = 1 + 0.3 * build`: 1.3 times at 1 |

`heads_tall.py`, run on the kit as it is (2026-10-13):

| | build 0 | build 0.5 | build 1 |
|---|---|---|---|
| `lady`, `celestial`, `dancer` (a tiered skirt) | 4.30 | 5.13 | 6.28 |
| `fellow`, `child`, `scientist`, `drummer`, `villager`, `monk` | 4.51 | 5.42 | 6.68 |
| `maiden`, `weaver` (a sin) | 4.53 | 5.43 | 6.68 |

Nobody has a build unless a film gives one, so the films made before it are as they were: with the
build in the kit and no look using it, twelve frames of `lanna.html`, `dance.html`, `starter.html`
and `nature.html` are the same pixel for pixel, and `village.html` and `model.html` differ in one
frame of twelve by 1 and 4 pixels, which is what two loads of one kit differ by. `build.html` is
the sheet to judge it on: the lady and the fellow at 0, 0.33, 0.66 and 1, the ladies hopping and
the fellows walking, with each one's height in heads written under it. `model.html` takes
`window.BUILD` for a still of the whole sheet with another build. A child in a cast keeps 0: a
child's head is large for its body.

**A little boy and a little girl** (the owner, 2026-10-13: "Add a little boy and a little girl").
`cast("boy")` and `cast("girl")`. The `child` of the cast is a fellow drawn small, and looks it.
What makes a child a child is the head: so `build` now goes below 0, as far as -1, where the head
is 1.28 of its size on the same chin and the legs 0.85 of their length (the legs grow by 0.3 of the
build above 0 and shrink by 0.15 of it below). A child's arms and hands are shorter by as much as
its legs: an arm is drawn smaller about its shoulder (`armOf` in `person()`), and a reach or a wai
allows for it. The two also have round heads (`head` 1.06 and 1.08),
large eyes (`eyes` 1.3 and 1.4) and stand small (`size` 0.8 and 0.78, where a lady is 1.3). He
wears an indigo shirt and trousers; she a white blouse, a red sin (`sin: 2`) and a flower in her
hair, and her mouth is a little smaller (`lips` 0.85).

| `heads_tall.py -1 -0.5 0` | build -1 | build -0.5 | build 0 |
|---|---|---|---|
| `boy` | 3.57 | 4.02 | 4.59 |
| `girl` | 3.63 | 4.08 | 4.66 |
| `fellow` | 3.51 | 3.95 | 4.51 |
| `lady` | 3.39 | 3.79 | 4.30 |

`children.html` is their sheet: each drawn large, then at their own size beside a lady and a
fellow, then walking, sitting on the floor, in a wai, waving, and holding hands. They also stand on
a hill of `landscape.html`. No page made before uses a build below 0, so those pages are as they
were (`same_kit.py`: lanna and build 0 of 12 frames; model, together, floor and looks one frame each by 1 to
8 px, which is what two loads of one kit differ by).

A lady paints her lips red; a child does not, and neither do the old. `person()` sets `PAINTED`
for the figure it draws (false for a build below 0, and for anyone with an `age`), and `lipOf()`
gives a lady's mouth its red or else the colour of her own lips. Both were mended on the owner's
"Fix the weak part": at first a child's hanging hand came to its knee, and the girl and the old
women had painted mouths.

A child's trunk is its own too (the owner's second "Fix weaknesses"): all above the waist is
drawn smaller about the waist, by 0.12 of the build below 0, so 0.88 at -1, and the head and the
arms are given back what that takes from them. At first the trunk was a grown-up's made small.
The smaller trunk brought the shoulders nearer the point the two hold hands at on `children.html`,
and one elbow flipped in one frame of 240 (the limit of a reach written above); `kit_check.py`
found it, and the point was lowered.

**Not done for them:** the girl's face is the lady's in its shape; she has a lady's bun and not a
child's topknot or plaits. Judged from stills only.

**Two old men and two old women** (the owner, 2026-10-13: "Add 2 old men and 2 old women of
different styles"). Four of the cast, and what makes each old is three new look names and a stoop:

| Name | What it does | Numbers |
|---|---|---|
| `hair` | this figure's own hair colour: the mass, the bun or the brush on top, and the hair under a hat. The line round it and the lines a comb leaves are worked out from it (`HAIR`, `HAIR_LINE`, set by `person()` as `SKIN` is) | white `#ece7dd`, grey `#a9a39a` |
| `age` | 0 to 1: the lines of age, drawn over the face by `ageLines()`: two across the brow, three at the outer corner of the near eye, one under each eye, the fold from beside the nose down past each corner of the mouth, the hollow of the cheek | their ink is 0.3 to 0.75 of full, by the age |
| `beard` | a colour: a moustache that droops past the corners of the mouth, and a tuft on the chin that goes down with the jaw (`beard()`) | |
| `holding: "stick"` | a walking stick from the near hand to the ground: the hand is held forward and lies over its top unless the scene places it | hand at `[34, 62]`, wrist bent 0.9 |

| In the cast | Style |
|---|---|
| `elder` | an old man of the village: white hair and beard, an indigo shirt, a dark red sarong, a stick; he stoops (`bend` 0.16) |
| `oldfarmer` | an old farmer under his woven hat: grey hair, a faded blue shirt, darker skin; a smaller stoop (0.1) |
| `grandmother` | small and bent (`size` 1.1, `bend` 0.2): white hair in a bun, a plum blouse buttoned down the front, a brick-red sin |
| `devotee` | an old woman dressed in white for the temple: grey hair, a white blouse and shoulder cloth, an indigo sin, a lotus in her hand; nearly upright (0.06) |

`elders.html` is their sheet: the four as the cast has them, and below, the elder walking with his
stick, the grandmother sitting on the floor, the old woman in white in a wai, the farmer waving, and
the grandmother holding the little girl's hand. `looks.html` shows the three new names.

**Not done for them:** the brows and the lashes stay dark on white hair; nobody is thin or stout, bald, or toothless; the stick does not take
any weight (the walk is the same walk); the old do not move more slowly unless the film gives a
smaller `spring`. Judged from stills only.

**Seen on the sheets and not mended:** at the bottom of a hop a bare knee comes out of the side of
a tiered skirt. It did before (the cloth is pushed out by the knees, and not far enough); with long
legs there is more of the leg to see. A walker's step is as long as it was (68 across), which is
short for long legs. The arms, the hands and the feet are the cartoon's size at every build.

### Hands that go to a place: a reach, and a wai (2026-10-13)

A hand was only ever given from its own shoulder (`handA: [44, -84]`), and `arm()` does not put the
wrist where the hand is given: a hand given near folds the arm and one given far straightens it. So
two people could not touch, and a hand could not be laid on a thing drawn at a place.

| What | Rule | Numbers |
|---|---|---|
| A wrist goes to a point of the scene | `reachA`, `reachB`: `[x, y]` in the space `person(x, y)` and `at` are in. The point is carried into the arm's own frame when the arm is drawn, once the shoulder is known (the body has hopped, leaned and swayed by then), and `handFor(dx, dy)` gives the hand that brings the wrist there: the rule of `arm()` turned round | a wrist can be 32 to 119 from its shoulder (an arm is 120 long) |
| The elbow that brings it there wins | an arm has two elbows for any wrist and takes the one it likes better (back and down for a hanging arm). One of them may be stopped by the joint rules and leave the wrist short. For a wrist with a place to be, being there counts ten times as much, and the wrist is there at once while the elbow comes round | `armJoints(..., sure)` with `sure = 2`; a miss costs 60 a pixel where it cost 6 |
| It keeps to its joints all the same | a point further than the arm is long, nearer than it folds, or behind the body is reached for and not touched | |
| A wai | `wai: true`: both wrists side by side before the chest, 28 below the shoulders' line; the hands stand upright whatever the forearms do, four fingers straight and together, the thumb along them (`WAI`). The bow is the film's: `bend` and `turn` | |

`together.html` is the sheet, and `checks/reach_check.py` draws all 240 frames of it and measures
(2026-10-13): two children given one point, hopping a quarter of a beat apart, have their wrists
within 1.6 px of each other in every frame; a maiden's wrist sent to a lotus that goes round is 0.0
px from it whenever it is within her reach, and up to 20.9 px short in the 103 frames where it is
not. A figure is squashed as it lands and stretched as it springs, by up to a tenth, so "within
reach" is counted there with that much to spare.

Two things found on the way. The first try missed a near point by 10 px: a hand given close to its
shoulder is taken to point nowhere in particular, and the arm leaned on the way it had pointed the
frame before. And `joints.handA` and `joints.handB`, which `person()` gives back, were wrong and had
been since they were written: they were worked out after the pen had moved to the far wrist, so each
was off by that much (27 to 58 px from its wrist, where it should be 24 of the kit's units). Nothing
in the repo read them. They are right now: 24.0 to 25.5 px at size 1.3.

**Not done:** a point within about 40 of the shoulder folds the arm as far as it goes, and its
elbow then jumps from side to side as the body hops (`looks.html` first had its two reach points
there: 17 flips in five seconds, none once they were moved out to about 80); the hand goes on from
the wrist the way the forearm points, so two held hands overlap and do not clasp; a point is given by the film, and to send a wrist to another person's joint a film
must give the point itself (the joints `person()` gives back are pixels of the sheet, after the
camera has moved in, and a reach is a point of the scene).

### Sitting on the floor (2026-10-13)

`person()` could only stand. `sit` is a dancer's half-sit: the hips drop 40 and the knees bend, on
the same two feet. People in the paintings sit on the floor more than they stand: to eat, to weave,
to listen, before a monk. `floor: true` seats a figure, with the same `(x, y)` now the ground under
the seat.

| What | Rule | Numbers |
|---|---|---|
| Two ways to sit | one with her hair tied up (`bun`) folds both legs to one side (phap phiap); anyone else sits cross-legged. `floor: "side"` or `"cross"` says which, against that | |
| And one to ride | `floor: "astride"`: the seat is on an animal's back, the near leg hangs down its side with the knee forward, and the far leg is not seen. In a skirt both legs hang together on the near side, as one who rides side-saddle. No shadow is laid on the ground | knee 52 forward and 44 down from the hips, ankle 104 below it |
| The seat stays on the ground | the hips are 38 above the ground and do not rock, slide or hop: the beat lowers them by 5 at most, and the squash and stretch is 0.4 of a standing figure's. What is above the waist keeps the kit's rock, sway and nod | hips 38 up, where a standing fellow's are 216 |
| Legs to one side | the thighs lie along the ground to the knees, in front (the way she faces); the shins fold back along them, nearer to us, so they are drawn over the thighs and lower; the feet come out behind, one on the other. Thigh and shin end on one round knee | knee 92 in front of the hips, ankle 52 behind them |
| Cross-legged, in trousers | each thigh goes out to its knee and each shin comes back across, its foot toward the other knee; the leg at the back is drawn first. The knee is given, not solved: the thigh points partly at us, so its length on the picture is not its length | knees 100 to each side, ankles 16 past the middle |
| Cross-legged, in cloth | a sarong or a skirt pulled over both knees is one shape. Its hem lifts off the ground between the knees and the feet show under it | |
| The cloth keeps its weave | `wrap()` is a length of cloth round the legs with the bands of `tier()` across it; a tiered skirt's three tiers are laid end to end as one length, the foot band's cloth as one wide band. `stripe()`, taken out of `tier()`, draws one band whichever way it runs | the thigh carries the cloth from 0.1 to 0.5 of its length, the shin from 0.5 to the hem |
| Hands with nothing to do | lie in the lap, turned in toward each other (legs to one side), or one on each knee with the arm nearly straight (cross-legged). A hand the scene places is the scene's, as before | |
| What hangs lies down | the ends of a sabai and of a waist cloth lie on the ground beside the seat; a shirt's hem and a coat stop at the lap | |

`floor.html` is the sheet: six with their legs to one side, six cross-legged, a wai, a hand lifted,
two at `build: 1`, and one in each row told to sit the other way. `checks/floor_check.py` draws all
240 frames of it and measures each figure (2026-10-13): the hips travel 3.1 to 3.4 px over the
sheet and a knee 1.6 to 2.7 px, while the neck travels 32 to 36 px. `tier()` draws the same bands
as before: the pages made earlier come out the same (`same_kit.py`, 0 of 12 frames on seven pages;
on `model.html` 2 or 3 frames by 2 to 11 px, where the kit against an exact copy of itself gave 0
to 3 frames by 5 to 7 px).

**Not done:** no one gets down or up (a figure sits or stands for a whole shot); a knee is never
drawn up, and nobody kneels; a drum is not laid across a lap; a seated figure with a `rig` stands;
the side a lady's legs fold to is the side she faces. Judged from stills only.

### Standing still, and a walk from place to place (2026-10-13)

The owner: "All the sprites bounce up and down but create a style for them to be still and normal
and just move regularly. Add a normal walking style animation to the framework." What bounced: in
the kit everyone given `late` hops on the beat, rocks from side to side, squashes on landing, puffs
dust and stands with the knees bent, and cloth swings with the rock. That is the 1930s cartoon, and
it is still what a film gets unless it says otherwise.

| What | Rule | Numbers |
|---|---|---|
| The other style | the film's style says `hop: false`, before the kit loads: `<script>var FILM_STYLE = {hop: false};</script>`. Then nobody hops, whatever `late` they are given: no hop, no squash or stretch, no dust, no rock | |
| Standing upright | the hips are as high as legs almost straight hold them: hip height − 22 − 0.985 × the two bones of the leg, which depends on what the legs are in | by that rule, at size 1 and build 0, the hips stand this far above the ground: in trousers 226.88 (the cartoon stands at 192), in a tiered skirt 189.45 (160), in a pha sin or a sarong 189.45 (192) |
| What still moves | the breath, a blink, the eyes' jumps, hair and earrings that follow the head, the spine's slow sway at 0.25 of its size, cloth at 0.2 of its swing. The head stands up on the neck | the head is 8 higher than at the bottom of a hop |
| `late` still means something | it times the mouth of one who has `sing: true`, and a drummer's hit | |
| A walk has a length of step | `stride`: 1, or left out, is the cartoon's step (34 before the body and 34 behind). The arms swing by it (up to 1.6), and a step shorter than 1 rolls through the foot less | |
| A walker who does not hop only sinks | the hips are at their standing height as a leg passes under them and lowest when the feet are furthest apart: `2.5 × stride × (1 + cos(2 × walk))`. So the leg under the body can always reach the ground | 0 to 9 at stride 1.8 |
| Cloth covers the legs of one who walks | in a film with no hop the shin and the ankle push the cloth as the knee does, and each point is put where the body's lean leaves it, because the cloth leans with the body and the legs do not | the knee reaches 44 up and down the cloth, the shin 50, the ankle 60 |
| A walk from one place to another | `stroll(t, from, to, start, look)` gives back `{x, look, arrives}`: `var walk = stroll(t, 200, 1100, 2, cast("lady", {size: 1.2})); person(walk.x, GROUND, walk.look);`. One step on every beat. The body goes forward as far as the foot on the ground goes back, so the feet do not slide: 136 × stride × 0.82 × size for two steps. Step and stride grow together through the first half stride and shrink through the last, so the walk begins and ends with the feet together. It sets `face` the way of the walk | `STROLL`: stride 1.2 in a skirt, a pha sin or a sarong, 1.8 in trousers, unless the look has its own |
| The same for an animal | `amble(kind, t, from, to, start, look)` in `beasts.js`: `var walk = amble("tiger", t, 100, 1300, 2, {size: 0.8}); tiger(walk.x, GROUND, walk.look);`. A foot is on the ground for 0.62 of a stride, so one stride takes the animal its foot's reach / 0.62. `GAITS` holds each animal's size, reach and beats to a stride, and `elephant()` and `buffalo()` read their size and reach from it | at size 1 a stride is 261 for the elephant (4 beats), 169 for the buffalo (3), 163 for the tiger (2), 42 for the cat (1), 85 for the pig (2) |
| Animals keep no beat either | in a film with no hop the ears, tail and head of an animal given `late` do not nod on the beat | |

Measured (2026-10-13, `stroll()`, 1000 across at size 1, each frame of the walk drawn and each
ankle's place read from what `person()` gives back): the fellow goes 200.7 px a second and takes 5.5
seconds, the lady in a pha sin 133.8 px a second and 8.0 seconds. A foot flat on the ground moved
0.00 px in every whole step, and at most 5.58 px (the fellow) and 3.72 px (the lady) in a first or
last step, where the stride is changing.

The pages made before draw as they did, because every change is behind `hop: false` or behind a
`stride` that is told. `same_kit.py` on 24 pages: 0 of 12 frames differ on 16 of them, `lanna.html`
among them. On 7 pages (`village.html`, `floor.html`, `build.html`, `model.html`, `landscape.html`,
`naga.html`, `dragon.html`) 1 to 8 frames differ by 1 to 9 px, which is what a kit shows against a
copy of itself: `naga.html` and `dragon.html` do not call `person()` at all. `looks.html` differs
in all 12, by its new row and its title, which counts the names. `kit_check.py`, whole: 23 pages, 0 failures; `walk.html`: draws, same 1 / 1, 46.6 ms a frame, arms 0, 0, 0. `walk.html` is the
sheet: seven who stand, the first drawn a second time with `hop: true` beside her; a lady, a
fellow and the little girl who walk across and back, and a cat; an elephant and a tiger.

**Not done:** there is one pace, a step on every beat: nobody runs, and a slower walk is a longer
`BEAT` or a shorter `stride`. A walk is along the ground in a straight line at one height: no
stairs, no slope, nobody walks toward us or away. A walker who turns back faces the other way in
one frame. An animal sets off and stops at once, with no short first step, and its feet were not
measured: only the rule says they do not slide. The elder's stick does not strike the ground in
time with his steps. `hop` is the whole film's: one figure cannot hop beside another who stands,
except as `walk.html` does it, by changing `STYLE.hop` between two calls. The flowers and the sun
still keep the beat in a film with no hop. The paperdolls were not tried in one. Judged from
stills, and from strips of eight moments of a stride: not watched moving.

**Not done.** A lady's face is now the paintings' (see "A lady's face, by the painting"), a
fellow's is still the cartoon's, and within each the faces differ in measure but are one
drawing; cloth has no folds drawn on it.

## The dress of the north, by the record (2026-10-13)

The owner's rule: historical accuracy comes before what anyone thinks looks right. Three
sources settle the men of Chiang Mai, and the kit follows them.

- **Holt Hallett, *A Thousand Miles on an Elephant in the Shan States* (1890), ch. XIII**
  (gutenberg.org/files/73607): the Zimmé Shans "do not wear a chignon, nor twine a silk
  handkerchief round their head"; the hair is shaved at the sides and back "leaving a tuft like
  a clothes-brush at the crown", or cut in the modern style; "tattooed from the waist
  downwards, sometimes as far as the ankle".
- **Lillian Johnson Curtis, *The Laos of North Siam* (1903), ch. VIII** (archive.org,
  laosofnorthsiam00curtrich): the pa toi "should fall to the knee when a person is dressed for
  social life, but the workingman often pulls the cloth up to a mere loin cloth, the tattooing
  upon his legs serving as a garment"; cloth "woven solid or in plaids"; a scarf or blanket
  round the shoulders in the cool season; "a man's hair is evenly cut and stands up from his
  head"; "the feet are always bare, and the head uncovered". Women: the skirt to the ankle with
  its bands and a plain strip at the top, a bosom scarf, hair tied at the back and coiled into
  a knot, a coil of gold or brass in the stretched ear lobe.
- **Manop Manasaem, พัฒนาการเครื่องแต่งกายชาวล้านนา (ไทยวน), วารสารวิจิตรศิลป์ 1:1** (Chiang Mai
  University): the pha ta kong in black-and-white checks, worn three ways, all with the chest
  bare; trousers (เตี่ยว) short or long; shirts only from the reign of Rama V on, round-necked,
  open down the front and tied, or half-open with two shell buttons, undyed cotton or indigo
  (ม่อฮ่อม), never with a stand collar; a ผ้าขาวม้า as the belt; tattoo from the waist to the
  knee, and a man with white hips was called a coward.

What follows in the kit: every mo hom has a round neck (the collar band drawn until this day
was in none of the sources); `patoi` hitches a sarong to the knee, or higher, over bare legs;
`tattoo` draws the waist-to-knee tattoo where the cloth leaves the thigh bare; `takong(rows,
long)` is the check; `CAST.farmer` is the Chiang Mai man. `CAST.villager` keeps his head-cloth
as a man of the Tai Yai, Lue or Burmese villages of the north (the head-cloth is theirs, not
the Tai Yuan's). A woman's bun stays where it is, by the owner's choice (2026-10-14; Manasaem has it at or just
above the nape).

**Later the same day the owner sent two pictures and said "Redo the men to look like this"
and "Make a model like this too".** The first is a Chiang Mai costume studio's revival of the
old dress: the hair in a knot on top of the head, a red head-cloth wound round below the knot
with fringed ends, the chest bare with a yantra on the breast and a line round the neck, a dark
cord round each upper arm, a green and pink checked cloth over one shoulder, a brown cloth
hitched high over thighs tattooed from mid-thigh to the knee, a pink sash hanging in front,
bare feet. The second is a noble: the knot set with gold flowers under a patterned red silk
head-wrap, gold earrings, a broad gold collar, gold armbands and bracelets, a jewelled sash
across the chest, a jewelled belt, a red and silver brocade cloth to the ankle. The kit's men
(`fellow`, `villager`, `drummer`, `farmer`) are now that first man, by `bare`, `turban`,
`sabai` with a third entry `"check"`, `patoi: 0.75` and `tattoo` (a bare man's waist-cloth ends
hang bright to the knee); the hair is the knot, which replaced the shaved crown of the morning;
`regalia` and `CAST.noble` are the second picture. Then ("redo the kids and old people
but give the old man a shirt"): `child` and `boy` wear the same, small, with no tattoo (a boy was
inked when he came of age; the chest ink now needs `tattoo` as well as `bare`); `elder` wears
it with a round-necked indigo shirt and his white hair in the knot; `oldfarmer` goes bare under
his hat. The girl and the old women are not touched. The pictures are not kept: only what they
show, as these rules. Which of the written record (bare chest, tattoo, hitched cloth, bare feet)
and the pictures agree on, the kit draws; where the pictures go beyond the record (the knot
and the head-cloth on a Chiang Mai man), the pictures won, by the owner's word.

## The torso turns, the shoulders work, a hand in the round (2026-10-15)

The owner: "Work on the js framework to create a more realistic movement model. Look at torso
rotation and a more realistic shoulder action and a better hand model." Looked at first, on
`model.html` and on stills of the hero film at twice their size, and written down before anything
was changed:

- **The torso** was one three-quarter drawing for every pose. The dancer reaching across her
  chest, the celestial with both arms overhead and the walker all showed the same chest; nothing
  turned about the spine, and a walker's shoulders never turned against the hips.
- **The shoulders** stayed where they were whatever the arms did: with both arms overhead the
  chest kept its square corners and the arm came out of the corner like a tube. A shoulder rose
  7 units by the hand's height, not the arm's angle.
- **The hands** were one flat drawing of the back of a hand, the fingers fanned, whether the hand
  hung at rest, lay on the chest or made a wai. A hand could not show its palm or its edge, and
  the resting hand's fingers bent slightly backward (`REST_A` had curls below 0), which is why a
  walker's hands read as starfish.

| What | Rule | Numbers |
|---|---|---|
| The body turns about its spine | the look name **`twist`**, -1 to 1 as the head's `turn`: profile (the body facing the way the figure faces), the three-quarter view the kit was drawn in (0), full face (1). The chest is drawn from three outlines blended as `view()` blends the head's features (`blendOutline`): seen from the side it is narrow, the back curving out to the shoulder blade and in to the neck, the front swelling at the bust, both shoulders over the middle; from the front it is widest and its two sides alike. The head turns with the body unless given its own `turn` | `CHEST_LADY_P`/`_F`, `CHEST_MAN_P`/`_F`, point for point with the three-quarter lists; shoulder roots at 4, 40, 46 from the spine; each leg's root at 6, 20, 23 and its foot at 8, 26, 30 |
| The far arm hangs behind the body | the owner, of the first cut (2026-10-15): "The far shoulder should be behind the body." The far arm (A, on the side the figure faces: of a body seen three-quarter, the shoulder on the leading side is the one further from us) is drawn before the chest, hand and all, at every turn, so it shows only where it comes out past the chest's edge; until then both arms were drawn over the body (the rule of 2026-10-11, which stays for a hand before the face). It stays in front when its hand is lifted, crosses to the other side, goes to a point of the scene (`reachA`), makes a wai or closes round a thing (`grip`): all of those lie before the body. Nearer profile than three-quarter (`twist` below -0.5) the far leg is drawn first as well. The cord round a bare upper arm goes on with its own arm (`armBand`), so the far arm's band is behind the body too (the owner, of the boy and the farmer: "the arm bands on the far shoulder show on top of the body when they should be behind it") | `behindA`: the hand below its shoulder and not more than 10 in toward the other side |
| A walker's shoulders turn against the stride | the chest's turn gets `0.15 · cos(walk) · min(1, stride)` of its own: the shoulder of the arm swinging forward comes forward, so the chest faces us a little more while the near arm is before the body and a little less while it is behind (about 8 degrees each way, as a person walking shows). The hips keep the body's own turn | the shoulders' width breathes between 73 and 86 units (80 standing) |
| A shoulder rises with its arm | `shoulderWork()`: as an arm rises above the level of its shoulder, the shoulder itself rises (the collarbone swings up) and comes in toward the neck, by more the higher the arm goes, and little in the first part of the rise; an arm held straight out to its side lifts it a little; a hand sent across the body to the other side brings its shoulder forward and in, as the shoulder blade slides round the ribs | 10 up and 10 in with the arm straight overhead (`10 · raised^1.5`, `10 · raised`, raised = the hand's angle above the shoulder's level over 90 degrees, so 3.5 up at 45 degrees); 3 up held out to the side; 10 in across the body |
| The chest carries its shoulders | `chest(px, py)` lifts and draws in the top of the outline on each side by how much of that shoulder the point is (the top 24 units, from 10 to 30 out from the spine), so the corner of the chest, a sleeve's seam and the breast star go up with the arm; the arm's root goes through the same rule | |
| A hand in the round | `hand(x, y, angle, pose)` draws a bare hand from a small skeleton: a palm (a slab as wide as the hand across, as thick as a palm is, so edge-on it is thin), four fingers of three joints and a thumb of two, laid out in the hand's own frame, bent at the joints toward the palm, turned as a whole and seen from the front. Each finger is one inked unit, so no line crosses it at a joint; the units are painted from the furthest to the nearest, the palm after the fingers that lie level with it. The knuckles and the nails are drawn where the back faces us, the creases where the palm does, each fading out toward the edge. The measures are `glove()`'s bare hand, so no figure's hands change size | `HAND`: palm 9.5 half-wide at the knuckles, 6.5 at the wrist, 2.4 thick, fingers 12.5 × [1.02, 1.16, 1.08, 0.84], a finger folds 0.62 / 0.7 / 0.5 of its curl at its three joints |
| The turn of a hand | the look names **`palmA`, `palmB`**: 0 the back of the hand toward us, 1 the palm, 0.5 the thumb's edge, -0.5 the little finger's edge. Left out, the kit chooses: a hanging hand at rest shows its back and a little of the thumb's edge, so the fingers stack; a lifted hand its palm; a dancer's lifted hand its back, so the long nails of fon lep are seen whole; a hand closed round a thing (`grip`, a stick, a parasol being worked) its thumb's edge, where a fist reads as one; a wai a quarter | 0.15, 0.85, 0.15, 0.3, 0.25 |
| A hand at rest | `REST`: the fingers gently curled, the little one most | [0.2, 0.26, 0.32, 0.38, 0.45] |
| The flat hand is still there | `FILM_STYLE = {hands: "flat"}` draws every bare hand with `glove()` as before 2026-10-15; `gloves: true` is the 1930s glove either way, and the parasol hand is `gripHand()` either way | |

**The shoulder's numbers come from photographs, read by another session the same day** (MediaPipe
pose on single stills, by a script kept outside this repository; readings in the kit's units, the
torso being 112). First written as 15 up and 6 in from anatomy; measured on Commons photographs:
both arms straight overhead, front on (two "upward salute" studio shots, CC BY-SA 4.0): the shoulders
come in by 8 to 14 a side and rise by 3 to 19, the rise being the less certain number across bodies;
one arm up and one down in one body (a Muay Thai fighter, CC0, arm at 44 degrees: the raised side 2.6
higher; an overhead triceps stretch, two photographs, arm at 53 degrees: 4.5 and 3.3 higher). So
10 up and 10 in at overhead, and the curve `raised^1.5` gives 3.5 at 45 degrees, beside the 2.6 to
4.5 measured. No photograph of a hand across the chest was found, so the 10 in across the body
stays unmeasured. The same reader on the kit's own dancer at an arm of 80 degrees found her shoulder
11 up, what the first rule drew; the kit's figures can be measured against the photographs with
one tool.

Picked by drawing and looking, not by reasoning: the eight poses of the hand at eight turns each, on
one scratch sheet (`at rest`, `lifted`, `the dance hand`, `a fist`, each at palm 0, 0.15 … 1). A fist
seen from the back showed four stubs under the knuckles until the knuckle joint took the most of the
curl; the fon lep nails, curving back as real ones do, lose their length to the eye from the palm's
side, so the dance hand keeps its back to us. The first draft inked every joint of a finger as its own
sausage; grouping a finger's three bones into one unit mended it.

**How to look.** `body.html` is the sheet: the lady and the fellow at five turns, the fellow's
shoulders at five arms (hanging, out to the side, across the body, raised, both overhead), a walker
and a walking lady large, and the hand at eight poses, each three times its size.
`checks/kit_check.py body.html --quick` draws it; `looks.html` shows `twist`, `palmA` and `palmB`
with the other names (83 look names).

**Not done:** the far arm at profile goes behind the chest only when it hangs; nothing is foreshortened
in the arms themselves (an arm pointing at us is still drawn short, not thick); the hips do not turn
against the chest in the walk by themselves (their share is under a unit at this size, so it was left
out); a paperdoll with `twist` below -0.5 is not tried (its wrapper counts the far arm's call as the
first, and at that turn the near arm is drawn first).

## An arm lifted the natural way, and the sabai over it (2026-10-22)

The owner: "when a woman raises her arms above her head, it looks like it's going through a hole in her
sabai. Try animating the arm lifting so that the bicep angles away from the body slightly and instead of
lifting like a jumping jack the arm should lift naturally where the forearm comes up first inside with the
back of the hand facing out then turns palm out as the arm extends up. Lift the sabai up around the shoulder
when it lifts up. Also, women should extend their biceps up at a slightly less steep angle." Of three
candidates side by side (the kit as it was, A and B) the owner took A, "but have the sabai tilt so the corner
nearest the neck of the woman goes down and the other end goes up. Also, the thumbs should be on the inside
when palms are facing out and on the outside when they are facing down", and asked for every raise in the
films to take the new lift.

| What | Rule | Numbers |
|---|---|---|
| The lift | `liftHand(u, outward)` is the hand to give for an arm lifted from hanging (0) to up over the head (1). It is not a hand that `arm()` finds its own elbow for (that swung the arm out and up straight) but the arm's two angles in turn (`liftJoints`): the upper arm a little out from the side while the forearm comes up, inside, before the chest, folded as far as an elbow folds; then the elbow comes forward, toward us (the upper arm drawn short), while the forearm turns upright and a little out, so the hands rise beside the head and never before the face; the upper arm rises out and up and lengthens again, and at the last the forearm leans in over the head. (A forearm up inside cannot get past the upper arm in the picture's plane but by lying flat along it, which an elbow does not do: in the round it goes by in front, which is the elbow coming forward. Wherever else a lift would fold the arm near flat, the elbow comes forward too.) Give `u` in time, as any hand | the first half the forearm; the second the elbow forward, the arm out and up, the lean |
| From any hand | `liftHand(u, outward, from)` starts where the hand `from` puts the arm, and comes into the lift by the time the forearm is up. In `poseAt()`, a key whose hand is a `liftHand(...)`, after or before a key whose hand is low (at or below the shoulder), goes there by the lift; between a lift and a hand already up, the hand goes straight there | |
| The hand turns as it goes | the back of the hand out while the forearm comes up, then the palm, as the arm reaches up; the thumb inside when the palm is out and outside when it faces down (`handPose`, for a lift) | palm 0 until halfway, 0.85 at the top |
| A woman's upper arm rises less steeply | with her hand above the shoulder her upper arm stops at 150 degrees from straight down (a man's lift goes to 168) and stands at least 18 out from her side; at the top of a lift her forearm leans 25 in over her head (`LADY_ARM`, `MAN_ARM`; `person()` puts one in `ARM_TOP`) | 150, 18, 25; a man 168, 12, 8 |
| The arm goes up under the sabai | the cloth on arm A's shoulder is drawn again over that upper arm wherever it lies on it, and the forearm over the cloth, whenever the arm is before the body (the wai's layer, until then drawn only for a wai). So the arm comes out from under the cloth's edge, not out of a hole in it | |
| The sabai rides up and tilts | as a woman's arm A lifts, the top of her sabai rises a little and tilts: the corner by the neck goes down, the outer one up over the shoulder, and the back of the cloth hangs from that corner as it did | 4 up, `SABAI_TILT` 0.6 radians at a full lift |
| Where it was put in | the village's dance (`village.html`, `DANCE`: the two keys where an arm goes up over the head from low) and `motion.html`'s nine girls who raise a hand. Every other raised arm of a woman in the kit holds a pose already up (the hero film's dancers, the sheets): those take the gentler angle and the sabai over the shoulder by themselves. The Maeng tale has no woman lifting her arms (its goodbye is a wai) | |

## The soldiers of Chang Ngu, a spear and a pointed cap; a walk that leans (2026-10-22)

For the tale of Chang Ngu (the owner's picks of 2026-10-22, from the candidates in the tale's research): two soldiers in
`CAST`, told apart by their dress only, never by face or skin, as the people of the tale's enemy are real people's
ancestors.

- `cast("soldier")`: a Tai soldier, the villager's body, bare, a red head-cloth, no shoulder cloth, holding a spear.
- `cast("khomsoldier")`: a soldier of the Khom Dam, the same body in black cloth (shirt, sarong, head-cloth) under a
  pointed black cap (`cap`, a colour: a new look key, drawn over the head-cloth by `headCap()`).
- `holding: "spear"`: the near hand at the chest, closed round the shaft; the shaft from the ground up through the
  fist to `SPEAR_LONG` (560) above the ground, an iron blade like a leaf at the top and under it a tassel of the
  head-cloth's colour, swinging a little (red for the Tai, black for the Khom). It is drawn behind the fingers, as the
  walking stick is.
- `holding: "dap"` (2026-10-25, for the boys' sword practice in Chang Ngu): a Lanna sword (chiangsaen.js `dap()`)
  in the near fist. The owner: "The swords should be in front of the hands and behind the fingers": `hand()` takes a
  `pose.held` painter and paints it after the palm and before the fingers and thumb, so they close over the hilt. The
  blade is square to the forearm, `DAP_TILT` (0.3 rad) forward of it: upright at a guard with the forearm level,
  falling back as the arm is raised ("the angle of the sword should naturally fall back"). `look.dap`, its size in the
  figure's units, 0.55 unless told. A child's arm is short beside its head: raise it up and forward, not straight up,
  or the falling blade crosses the face (s11's `c11Stroke()`).
- `stroll()` leans the walker into the walk as they set off and back as they stop (`STROLL_LEAN`, 0.07 of `bend`
  at the most, rising and falling over the first and the last stride), from the kit's research into 2D animation:
  a body leans into its acceleration. Measured on `walk.html`: the crown goes about 0.11 of a torso ahead of the hip as
  a walker sets off, and as far behind as they stop.

## Legs, ankles and feet, measured from photographs (2026-10-15)

The owner: "Generate hip, hand, knee, ankle and foot models as well", then "Update the kit with the
recommendations." The models are measurements, not drawings: free Commons photographs read by a
pose reader (MediaPipe, 33 points on a still) and turned into the kit's units (torso hip-to-shoulder
= 112), kept outside this repository with the readers and the photographs' licences
(the method is the one `dance_track.py` uses on a video, applied
to one picture). What the photographs showed against the kit, and what was changed:

| What | Measured | The kit, before and after |
|---|---|---|
| the ankle above the heel's point on the ground | 14 to 18 (three standing people) | 22 → **16** (`ANKLE_UP`); forward of the heel 6 to 10, the kit's 6 → **7** (`ANKLE_FWD`). A shin is that much longer for its thigh (measured thigh : shin 1.0 standing, the kit's bones 106 : 102) |
| a standing knee | 172 to 179 degrees | the standing hips sat at 0.985 of the leg's reach, a knee of 160 degrees; now **0.997**, 171 degrees (`still` figures only; the hopping style keeps its bent knees by design) |
| a kick | teep: the hips 55 lower and a hip width over the standing foot, the standing knee 145 degrees, the standing foot turned out 66 degrees; a knee strike: the standing knee 172 | nothing bent the standing leg. Now a `raise` with its fourth number (a kicking foot, held) drops the hips `55 · clamp(height / 110)` and moves them 20 toward the standing foot; the standing knee bends through the two bones. A lifted foot without the fourth number (a dancer's) is as it was |
| hips | 42 to 49 wide; level within 0.03 rad standing, 0.12 to 0.25 rad in a kick; 189 to 193 above the ankles standing against the kit's 208 | unchanged: the width and the tip are within the kit's; the leg's length for the torso is the 1930s proportion, a style choice (`build` is the knob) |
| a deep squat | knees 119 to 132 degrees, the hips 35 to 40 down, the knees 34 to 43 forward, the feet flat | unchanged: `sit` at 1 lowers the hips 40 and the knee angle falls out of the bones, which agrees |
| the walk's foot | at the ankle, 98 degrees at the heel strike to 145 at the toe-off | **not changed**: the one walking photograph's foot pitches came out with a sign that could not be settled from the picture, and the kit's roll (toes up 0.3 rad at the strike, the heel up 0.55 rad at the toe-off) is not contradicted by what could be read |
| toe-out | 8 to 16 degrees standing, 60 to 70 for the standing foot of a kick | **not drawn**: the kit's foot is a profile shape pointing the way the figure faces; a turned foot would be a new shape |
| the foot's length | 45 (a woman), 45 to 48 (a man) | unchanged, 40 and 48 |
| hands (for the record; the hand is the body model's, above) | real fingers 1.5 palm widths long (the kit's 0.7, the mitten); the fingers' lengths one to another match the kit's; a fist is four at 1.0 with the thumb 0.76 across them | unchanged here |

Checked: `kit_check.py` on the sheets below after the change, and the two teaching pages refreshed.

## A lady's hair: four ways and three ornaments (2026-10-17)

The owner: "use notebooklm to research lanna culture and hair styles and create 2-3 more women's hair
styles with animation and decorations that can be applied to the hair." A NotebookLM notebook was made
of nine sources: Chiang Mai News on the fashion of Lanna women through their hair and on Lanna dress;
Silpa-Mag on Princess Dara Rasami's Japanese bun and on garlands bound round the bun; Matichon Weekly on
how the old Lanna kept their hair; Kalm Village on dok mai wai; the Chiang Rai database of Mae Fah Luang
University and Chiang Mai University's Lanna pages on the dress of the Tai Lue; and Thai Style Studio
1984 on the dress of Lanna's era. The shapes were read from photographs on Wikimedia Commons (Dara
Rasami in Chiang Mai in 1909 and in Bangkok, public domain; the murals of Wat Phumin, CC0, of Wat Phra
Singh's Viharn Lai Kham and of Wat Nong Bua, CC BY-SA 3.0), kept with their credits outside the
repository; nothing of them is copied. What the sources say, in short: Lanna women never cut their hair,
for the soul (khwan) is on the head, and wore it coiled in a knot held with a comb or a pin, with
scented flowers in it as an offering.

| The way (`bun`) | What the sources say | In the code |
|---|---|---|
| `true` ("high") | the kit's own: one high bun at the back of the head | unchanged; its comb and stones as before, and every page that had it draws the same pixels |
| `"wong"`, klao wit wong (เกล้าผมวิดว้อง) | "a high knot in the middle of the head, a lock of hair drawn into a ring (wong) in the middle of the knot, as the temple murals show"; the Tai Lue wear their knot on the crown and wind a head-cloth round the head, pink for a maiden, white or red when married | `view()`'s `crown`; `ladyKnot()`: an arch of hair standing up out of the knot with the sky through it, the line where the hair gathers, a long gold pin through it with a bud at its end (Wat Nong Bua). With `turban` (pink, "#f2b8c6") it is the Tai Lue maiden |
| `"low"`, kao phom (เก้าผม) | the everyday knot: "the long hair twisted into a knot toward the nape, held with a comb (wi sap) or a pin" | `view()`'s `nape`; drawn before the head, so the head and the hair cover its front and from the front it is not seen; a comb of ivory across its top; what is set in it is drawn with it |
| `"ipun"`, klao i-pun (เกล้าผมอี่ปุ่น) | Dara Rasami took it from the wives of Japanese diplomats in Bangkok and brought it home in 1914: "the hair at the front raised on a cushion into a high frame (krabang), the knot behind" | `ipunFrame()`: a smooth raised frame over the brow, round over its top, lit there, and a jewelled pin standing at its top whose stones glint; the knot a little higher than the high bun's |
| The comb lines | | `COMBED`: each way's fine lines run to its own knot, and the new ways' are kept inside the hair's outline (`ladyMass()`) |

| Ornament | What the sources say | In the code |
|---|---|---|
| `maiwai`, dok mai wai (ดอกไม้ไหว) | "flowers of brass, silver or gold sheet... the spring is attached to the hairpin to induce movement when the wearer moves" | three metal flowers (gold, or the colour given) on fine coiled springs set in the top of the knot; a stiff `follow()` spring (320) shakes them as the head moves, and they shiver a little more for a moment after |
| `malai`, malai rat klao (มาลัยรัดเกล้า) | jasmine threaded into a garland bound round the knot, a small tassel hanging that "sways as she moves" | the front of a ring of jasmine buds round the knot, and a tassel (uba) of three strings of buds ending in rose buds, swinging after the head on a softer spring (90) |
| `ueang`, dok ueang phueng (ดอกเอื้องผึ้ง) | the scented flowers of the offerings are pale (jasmine, ylang-ylang, gardenia, champak); for beauty "dok ueang phueng" is worn, the golden orchid | an arching stem of seven small yellow flowers with orange lips, from the knot's side, that hangs and nods after the head (a slow spring, 60) |
| A fine line | | the ornaments' small pieces are drawn by `bead()`, with a line 0.9 of the fine pen: with `oval()`'s body line a flower 6 pixels across at the film's size was all ink |
| In the hero film | (owner: "Give women some different hair styles in the hero video") `sash.html`'s `HAIR_OF`: the weaver of the lane and of the fields wears `low` with `ueang`; the maiden at the pond `wong` with `maiwai` in silver (gold was lost against the golden shower behind her); in the fields the lady `ipun` with `malai`, and the maiden `wong` under a pink `turban`, a Tai Lue maiden; at night the dancer `maiwai` and `malai`, the grandmother `low`. The woman of the cloth keeps the high bun she is woven with | |
| Tried first | the loop of the wit wong as a small ring on top of the knot: a cartoon bomb; the i-pun frame peaked at its top: a bishop's mitre; the crown knot at y -396: it floated above the hair; the ornaments inked with the body's line: dark at the film's size | |

## Faces of the north, from a photograph (2026-10-18)

The owner: "Look at the animation framework in lannamation and see if you can add Northern Thai/Lanna
face shapes. Add 2 men and women and 1 child of each gender with a Northern style face shape." First,
a NotebookLM notebook on the question ("Face shapes of Lanna (Northern Thai) people", 17 sources).
It found **no measured Northern face**: studies of Thai skulls from Chiang Mai, Khon Kaen and
Naresuan find no difference in cranial shape between the regions (Freas 2011, 429 skeletons;
Techataweewan et al. 2021), the Chiang Mai collections do not record who was Khon Mueang, and the
studies of living faces sample Bangkok or the whole country. So the face had to come from pictures,
and two disagreed. The Lai Kham mural of Wat Phra Singh (1863, the Chiang Mai school) paints oval
faces with long eyes lifted at the corners, thin high brows, a long nose and a small mouth: the
conventions of the paintings the kit's lady already follows. A photograph of Princess Dara Rasmi's
ladies of the north, with children, about 1909 (public domain, Commons "Dara Rasami + Entourage @
Bang Pa-In"), shows broader faces. The owner chose the photograph, a face of its own for each of
the six, and the six in the maker too. Then ("Show me face change candidates before implementing")
three candidates were drawn beside the photograph over the kit, unchanged, by a scratch script: A
the outline only, B the outline and the features, C stronger. The owner chose B. Nothing of the
pictures is in the repo, only the rules below.

| What the photograph shows | In the kit |
|---|---|
| The face is widest at the cheekbones, just below the eyes, and nearly as wide there as it is tall from the brows to the chin | `view(turn, lady, north)` moves the far cheekbone out (`cheek`), and the near one more as the face comes round; the head is drawn as wide as the shape says (`wide`, 0.98 to 1.12), a lady's too (the kit's lady is 0.9) |
| The jaw's sides drop nearly straight and turn at a soft corner level with the mouth; the chin is broad and round | the jaw's corners go out and a little down (`jaw`), the chin broadens (`chin`); none of it in profile, where the face is the painted profile piece |
| The eyes are small, about an eye's width apart, under a heavy upper lid with little or no crease | `eye()` reads `NORTH_FACE`: the upper lid hangs 0.2 (a fellow's 0.12) whenever the eye is open, its line a little heavier and its shadow deeper, the light lower; the crease and the hollow show 0.15 of the kit's; the outer corner lifts 0.06 (the lady's painted eye lifts 0.17) and has no flick; each eye moves 2.5 out from the nose; a fellow's eye is 0.8 of the comic eye's height, its middle where his was |
| The brows are straight or gently arched, low over the eye | lower by 3 (a fellow's, set high under a head-cloth, by 8), the arch 0.65 of the kit's, the weight 1.4 |
| The nose is short with a low bridge; its base is broad, the wings flare | `northNose()`: a bridge line only from below the eyes, a broad round tip, a wing and a nostril each side (the far one fuller as the face comes round), a soft shadow under the base, fainter for a lady |
| The mouth is about as wide as the pupils are apart, the lips full | the mouth 1.1 as wide, a lady's lips 1.25 as full; a fellow's line keeps its smile, with a little colour above and below it and the lower lip's line lower |
| The cheeks are full and high; a child's face is rounder still | the blush a little larger and higher; `northFace()` gives a child (`build` below 0) half of every change, a jaw corner 0.3 as square and a chin fuller by 2 |

**The look name** `north` (95 names) takes a shape from `NORTH_FACES`, which lie either side of the
chosen candidate (cheek 5, jaw 4, chin 2): `round` (4, 1, 4; head 1.06), `square` (5, 8, 1; 1.06),
`broad` (8, 4, 2; 1.12), `soft` (5, -1, 0; 0.98) and `full` (3, 3, 5; 1.04). `true` is `round`; a
name the kit does not know is warned about. What every face of the north shares is `NORTH`.
`person()` sets `NORTH_FACE` as it sets `SKIN`, and puts it back to `null` when it is done, so a
figure without `north` draws as it did: `checks/same_kit.py` against the kit before, on fifteen pages, found
0 to 2 pixels in twelve of them; `feelings.html` and `sash.html` differ as much or more between two loads
of one and the same kit (feelings 139,000 to 162,000 pixels in the same four frames, sash 23).

**The six** (`CAST`), each named as the north names people, each in the dress of the record:
`inta` (อินตา, `square`): a Chiang Mai man as the travellers saw him, the head uncovered, a
round-necked indigo shirt, the cloth hitched to the knee over the tattoo; `khammun` (คำมูล, `broad`):
bare and tattooed under a white head-cloth, a red and indigo check over the shoulder; `buakham`
(บัวคำ, `soft`): the everyday knot at the nape (`bun: "low"`), a white blouse, a pink shoulder cloth,
a green and black sin; `sinuan` (ศรีนวล, `round`): the knot on the crown (`"wong"`), a dark blouse, a
brick-red sin; the boy `bunma` (บุญมา, `full`): bare in a hitched cloth with a turmeric check over
his shoulder; the girl `dokkham` (ดอกคำ, `round`): a pale yellow blouse, an indigo sin, a flower in
her hair. In the maker they are six more people of the palette (👨 อินตา, 👨 คำมูล, 👩 บัวคำ,
👩 ศรีนวล, 👦 บุญมา, 👧 ดอกคำ). Sheet: `northfaces.html`.

- **Found, not changed.** A `bare` figure with neither `tattoo` nor a `sabai` falls through to the
  shirt's branch and is drawn with a shirt's buttons and breast pocket on the skin (the first
  Bun-ma showed it). Every bare figure of the cast has one or the other, so nothing drew it before.
  Bun-ma wears a check over his shoulder, as the kit's other boys do.
- **Not done.** In profile a face of the north keeps the painted profile piece (its nose, lips and
  chin), and the nostril line that the lady's profile keeps is gone; the brow, the eye and the
  outline there are the kit's. The six are not yet in any film.

## The Thai face, bodies, and the lady apart from her hair (2026-10-20)

The owner, 2026-10-20: "They don't really look like Asian eyes. They look Western", then "Start from scratch with
faces in general and try one from your research", then "fold these faces into the kit ... Add a few fat bodies for
men, women and children. Ideally faces, hair and bodies and clothes will be swappable", and "Rather than just
swelling I'd like fat bodies redrawn from scratch". Each is a look name, off unless asked for: a figure without them
draws as it did.

- **`north: "thai"`**, a face in `NORTH_FACES` with its own numbers (`own`, in place of `NORTH`'s) and its own
  eye (`eyes: "folded"`): broad cheekbones and a soft jaw (cheek 6, jaw 3, chin 3, head 1.08); the eye's upper lid
  with no crease and no hollow under the brow, a lower arch (1.45 of the opening's height, the kit's 1.9), a dark
  iris filling the opening with one light, and the lid line running on past the inner corner into the fold over
  it; a slant of 0.13 (between the 6 degrees measured on men and the 9 on women); brows straight, low and heavy;
  a low, broad nose; fuller lips. A child keeps half of each change, as every face of the north does, but not
  the smaller eye. Drawn from photographs of Thai people and a 3D study of Thai faces, never from one face.
- **Everyone's eye is folded** (owner, 2026-10-20: "Make sure to fix the eyes in all the models with a folded lid
  eye"): `STYLE.lids` is `"folded"`, so every person, of the cast or not, has the Thai face's eye (its lid, the
  dark iris, no crease, no hollow, the soft fold at the inner corner) on their own face; a face of the north keeps
  its heavy lid and is folded too. `person()` sets `EYE_LIDS` (`FOLDED_EYE`, or the face of the north's), and
  `eye()` reads only it, so an animal's eye, drawn outside `person()`, keeps its own. The fold at the inner corner
  is a short soft crease measured by the eye's height: drawn long and in ink, it met the nose's line on the comic
  eyes, which are wide. `FILM_STYLE = {lids: "kit"}` draws the creased eye the kit drew before. The Lanna Tales
  film was rendered before this, with the eye it had.
- **`body`**, one of `BODIES`: `"slim"` is the kit's own; `"fat"` has its own chests (a man's and a lady's,
  `CHEST_MAN_FAT`, `CHEST_LADY_FAT`, turned to profile and full face by `chestTurns()`): a broad back curving out
  from the waist, sloping round shoulders, a thick neck, the chest running down into a belly carried low; a
  lady's fuller bust over a soft belly. With it: shoulders, hips and feet further from the middle, thicker arms
  and legs, a wider waist where cloth hangs (`tier()`), wider hems and waist cloth, a thicker neck, hands that
  rest clear of the belly, a larger shadow, a face 1.1 as broad. A child is any body at a child's measure.
- **`lady`**: true for a woman's face, chest, neck, hands and jewellery, false for a man's. Left out it follows
  `bun`, as before (hair tied up is a lady), so the hair and the one who wears it can now be chosen apart:
  `{lady: true}` with no bun is a woman with a fellow's hair, `{bun: "low", lady: false}` a man with a knot.
  `bun` itself now says only how the hair is tied.

Sheets (outside the kit, for looking): the slim and fat cast with the Thai face, five swaps, and every cast member's
eyes before and after the fold. `checks/kit_check.py` passes with all of it (169 of 169, 2026-10-20). With the Thai
face added and nothing else, the kit as committed and the kit then drew every page alike (apsara, fonlep and puman
differ at 2 seconds between two loads of one and the same kit too); the folded eye for everyone changes every page
with a person on it, as it was asked to.

- **Not done.** The cast still wears the kit's own faces: nobody is given the Thai face or the fat body until the
  owner picks. Clothes are still drawn by the person (`sin`, `skirt`, `sabai`, `bare`): swapping them is the
  next step, then the cast as compositions of face, hair, body and clothes.

## The dress of the Lua (Lawa), and three things to wear (2026-10-25)

`cast("luagirl")`, `cast("luawife")`, `cast("luaman")`: the Lua as they dress today, the only dress recorded (the
chronicles and the travellers say nothing of it), from Creative Knowledge CMU (ลัวะ), the Cultural Map of Thailand
(ผ้าทอลัวะ), Chutimun Sasong's 2021 study of the Lawa of Mae Hong Son and the Indigenous Media Ecology project. A
woman: the black skirt to the knee with bands of red, pink and blue tie-dye (`LUA_SIN`, worn as a hitched `sarong`),
a girl's white blouse or a married woman's black one, the low bun. A man: white shirt and trousers, a pink head-cloth.
`plain: true` keeps off the kit's checked waist cloth, which nobody in the sources wears. Sheet: `lua.html`.

Three new keys of `person()` carry what the Lua wear, and anyone else may:

| Key | What it draws |
|---|---|
| `beads` | a list of colours: strands of beads hung from the neck, one a colour, the longer lower, in place of a lady's gold necklace (`LUA_BEADS`: red, orange, yellow glass and silver). Each bead is filled with only a hairline rim, so its colour shows |
| `earrings` | a colour: a tassel of wool from each ear to the shoulder, swinging with the head, in place of the gold drop |
| `wraps` | a colour: cloth wound round each shin from below the knee to the ankle (ปอซวง), the turns of the cloth across it |

Not drawn yet: the arm wraps (ปอเต๊ะ) and the porcupine-quill pin in the bun.

## The ogres of the tales (2026-10-26)

`ogre.js`, beside the kit: `ogre(x, y, t, look)` is a living ogre (ยักษ์), a person's body at a giant's size (1.75 unless
told) in a skin of its own, with an ogre's head drawn over the person's head at the place `person()` gives back
(`joints.crown`, `joints.chin`): round white eyes that bulge and roll, thick curled brows, a mouth the width of the
face with a fang at each corner, big ears ringed in gold. `look.kind`: `"mural"` (the murals' green yaksha with the
gold spire crown, the kit's temple-gate `yak()` alive), `"forest"` (dark, wild-haired, tusked, no crown) or `"king"`
(red, crowned, in gold); the rest of the look is `person()`'s (size, face, step, at, feel, reachA) and wins over the
kind's own (`OGRE_LOOKS`). It gives back the person's joints. `ogreHead(j, kind, face, t)` is the head alone, over a
person a scene draws itself. The owner's picks, all three. Sheet: `ogre.html`.
