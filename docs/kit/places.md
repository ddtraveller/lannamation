# Places: nature, buildings, backdrops, and decorating a scene

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## Nature rules

The owner sent a Thai mural of a lotus pond ("Look at the flower and spend a few iterations making
nature rules") and a White Tara thangka (2026-10-12). Until then what grew in the kit was blobs
under a blur: a tree was eight green ellipses, a palm seven, a hill a flat colour behind
`blur(3px)`. The rules below are what the two paintings do, and every painter of what grows now
keeps them. `nature.html` is the sheet they are judged on: a lotus pond on the left, a hillside on
the right, no lens.

1. **A plant is drawn, not smudged.** A fine line round each petal, leaf and stem, darker than
   what it holds (line widths 1.2 to 2.5; `rgba(120, 40, 60, 0.8)` round a petal, `rgba(35, 65,
   40, 0.85)` round a leaf). No blur anywhere.
2. **Colour changes inside a shape and nowhere else**: from its foot to its tip, or from its heart
   to its rim. No cast shadows, no shine. A mural's lotus petal is pale at the foot (`#fff6ea` for
   the first 40%) and its colour at the tip, with five fine veins fanning to the tip; a thangka's
   flower is the other way, deep at the heart and pale at the rim; a leaf is deep at its foot and
   lighter at the tip, with a pale rib.
3. **A petal and a leaf are one shape** (`leafPath`): pointed, widest at 30% of its length, with a
   `bow` that bends the tip aside.
4. **A flower is built from the back** (`lotus`): two lowest petals drooping at ±1.75 rad, an
   outer ring at ±1.22 and ±0.66, the next rising at ±0.9 and ±0.34, and a heart of three at ±0.4
   and 0 that stays nearly shut. `open` runs from a bud to the full flower; a bud shows three
   petals.
5. **A stem is one long curve from the root** (`stemOf`, `stemPoint`): a cubic that swings its
   lower half one way and its upper half back, lighter than the leaves, with its own line; a lotus
   stem carries prickles. All the stems of a clump leave one root (`lotusClump`).
6. **Nothing is evenly spaced, the same height, or upright.** Heights, leans, bows and sizes come
   from `dice(seed)`: a lotus flower's stem is 260 × (0.72 to 1.22), a bud's 200, a leaf's 150;
   a flowering plant leans up to 60 either way and its flower is one of three kinds. **Given a second, a
   clump stirs in a breeze** (`lotusClump(..., t)`): each stem's tip sways on two gusts (5 px at 1.3 rad/s and
   2.5 px at 2.7 rad/s, scaled by the stem's height over 260) and the stem bends with it; a leaf rocks 0.06
   rad; an open flower breathes, closing to 0.92 and opening again (2026-10-13; nothing is kept between
   frames, and without a second the clump is pixel for pixel as before).
7. **Water is rows of overlapping arcs** (`waves`): each arc with a smaller one inside it, the rows
   further off smaller (radius 15 to 30) and fainter. **Given a second, the water moves** (`waves(..., t)`,
   `pond(..., {t, rings})`, `ripples`): each row slides along at a pace set by its depth (6 px/s at the far
   edge, 22 at the near), every arc rides two swells crossing at different speeds (1.6 px at 1.7 rad/s and
   1.1 px at 2.6 rad/s), ten glints on the far water brighten and fade, and a drop spreads two rings for
   2.5 s, fading as they widen (2026-10-13, after the three.js study: the parallax of depth and the two
   crossing swells are how a 3D scene moves water; nothing is kept between frames). Without a second the
   water is still, pixel for pixel as before. **A hill is a hump** (`hills`): deepest
   along its ridge, pale where the next range begins, with a firm ridge line and tufts of grass no
   two spaced alike. **A cloud is a scroll** (`scrollCloud`): white along its lobes, a tint
   gathering toward its foot, a small spiral in each middle lobe. **A tree's leaves are pads**
   (`leafPad`): a cluster of eight round lobes with one line round the whole cluster, deep at
   the heart and lighter at the rim, with small leaves marked on it.

| Painter | What it paints |
|---|---|
| `lotus(brush, x, y, size, colour, open)` | a lotus from the side; `open` 0 is a bud |
| `lotusLeaf(brush, x, y, size, tilt, colour)` | a lotus leaf as a shallow cup: the underside with veins to the stem, and a slice of the top over the near rim |
| `lotusClump(brush, x, base, size, seed, colour, t)` | seven to nine stems from one root: flowers, buds, leaves, and curling blades at the root; given a second it stirs in a breeze |
| `flowerSpray(brush, x, base, size, colour, seed)` | a thangka's flowering plant: a leaning stem, six leaves, a flower of three rings |
| `blossom(brush, x, y, r, colour)` | a small five-petal flower for the ground |
| `waves(brush, x, y, wide, tall, colour, t)`, `pond(brush, x, y, wide, tall, {t, rings})`, `ripples(brush, rings, t)`, `fish(brush, x, y, size, facing, colour)` | water, still or moving with the second; a pool with a bank line; the rings of a drop; a fish in profile (since 2026-10-20 one of the native fish: the orange one is gone) |
| `tree`, `leafPad`, `palm`, `banana`, `hills`, `scrollCloud`, `pathside` | rebuilt on the rules: a trunk as a shape with a line; fronds and banana leaves as leaves with ribs and cuts; grass as three small blades |
| `leafPath`, `paintPetal`, `paintLeaf`, `blend(a, b, amount)` | the shared shape, its two paints, and a colour between two |
| `peaks(brush, x, base, wide, tall, colour, seed)` | a heap of pointed peaks, as a thangka piles a mountain (see "Mountains and plants from a thangka") |
| `fanPlant(brush, x, base, size, colour, seed)` | a plant that is a fan of long leaves from one root |
| `tasselTree(brush, x, base, size, colour, seed)` | a tree whose dark round clumps each carry a pale tassel |
| `rocks(brush, x, base, size, colour, seed)` | boulders piled one before another, banded in layers |
| `foam(brush, x, y, wide, tall, colour, seed)` | water that runs: rows of waves whose crests curl over |
| `scrollCloud(brush, x, y, size, fill, line, foot)` | `foot` is new: the colour that gathers toward a cloud's underside, so a cloud can be ochre above and green below |

**In the film.** `lanna.html` paints its sets without blur, lays flowering plants behind the fence
and at the front corners of the lane, and has a lotus pond at the corner of the yard: the water
is in the back layer and the lotus in a front layer (`HOUSE_FRONT`), so people walk between them.
It also sets its own lens, `window.FILM_STYLE = {lens: "saturate(1.06) contrast(1.03)"}`: the
kit's old-print lens (`blur(0.5px) saturate(0.93) sepia(0.14)`) takes colour out and softens the
line, which is the opposite of rules 1 and 2.

**Where the rules come from.** The two pictures, read by eye. For the thangka half there is also a
NotebookLM notebook on thangka painting (made by the session building the fon lep dancer; 14
sources, among them Jackson's *Tibetan Thangka Painting* and the Rubin Museum's account of the
process). Asked how the sources say landscape and plants are painted, it answered: every form
outlined with a hair-thin line of black ink or dark dye; shading in thin transparent washes; no
cast shadows; fine gold lines for leaf veins and petal edges; each lotus petal shaded from a
darker base to a lighter tip. On wet or dry shading, and on which way hills and water are graded,
it said the sources are silent, so those directions here are from the pictures. The gold lines are
the pale ribs; real gold is not attempted.

### Mountains and plants from a thangka (2026-10-13)

The owner gave a third picture and asked for "items from nature like mountains and plants inspired
from this image": a thangka of the path of calm abiding, painted in Nepal, its whole ground filled
with landscape. Nothing of it is copied. What it does, and the painter that does it:

| What the thangka does | Painter | Numbers |
|---|---|---|
| A mountain is a heap of pointed peaks, one before another, each with a line down from its tip and strokes down one side; pale at the tip, deep at the foot | `peaks` | three rows of 5, 6 and 5 peaks, the furthest first and tallest (1, 0.72 and 0.46 of `tall`); four strokes a peak |
| The hills carry plants that are fans of long leaves, green and russet side by side | `fanPlant` | 9 to 13 leaves over 1.25 rad each side, 76 long at size 1; the side leaves are drawn first |
| A tree's crown is dark round clumps, and every clump carries one pale tassel | `tasselTree` | seven clumps of radius about 30; a tassel is an arc and six lines that hang from it and meet |
| Rocks are round boulders, banded | `rocks` | six boulders, three lines in each that arch the way its top does |
| Running water is rows of waves whose crests curl over, white at the crest | `foam` | a wave 54 wide and 30 high in the furthest row, 10 wider and 6 higher in each row nearer |
| A cloud is one colour above and another below | `scrollCloud`'s `foot` | the foot's colour at 0.9 of full at the underside |
| The sky is dark and full of gold dots | the sheet's own few lines | 320 dots |

All of them keep the nature rules above: a fine line darker than what it holds (the tassels and the
rocks' bands are the exception: pale lines on dark, as the thangka draws them), colour that changes
only inside a shape, and nothing evenly spaced: every painter takes a `seed`, and another number
gives another heap, plant, tree or pile.

`landscape.html` is the sheet: three heaps of peaks under the dark sky, the kit's own `hills()` in
four ranges, nine tassel trees, twenty-one fan plants, three piles of rocks, three stretches of
foam and three clouds that drift. It is painted once, as a set is, and the clouds are drawn live.
The pages made before come out the same (`same_kit.py`: nature, lanna and starter 0 of 12 frames;
village one frame by 1 px).

**Not done.** The house, the fence and the far crowd are as they were. A stream is stretches of
foam laid by the film, not one thing that runs down a slope. The thangka's banana leaves, its
flames, its temple and its people on the path are not made. The peaks, the rocks and the tassels are
plainer than the painting's. Nothing here sways. Judged from stills only.

## Buildings with depth

The owner (2026-10-13): "Add depth to the building images. Like roof tiles". The four buildings
were drawn large and looked at first. The house's roof was one flat brown with thin arcs on it; the
temple was three flat triangles on a white box; the hall and the stupa of the backdrops were flat
shapes inside a line.

| What was flat | The rule now | Numbers |
|---|---|---|
| A roof | `roofTiles(brush, left, right, top, bottom, tile, colour, end)`, called with the roof's own shape as the brush's clip. Rows are laid from the eave up, so each lies over the one below and only the lower end of a tile shows. Each row throws a line of shade on the row below; no two tiles are quite one colour; and the whole roof is lighter toward its ridge and darker at its eave. `end` is how a tile ends: `"round"` (scales), `"point"` or `"square"`. `colour` may be a function of a place on the roof, for a roof in bands | a row is 0.75 of a tile high; a tile is up to 0.12 lighter or darker than its colour; the house's tiles are 15 wide, the temple's 11 |
| The house stood on three posts in the open | a second row of posts behind the first, darker and set in; shade under the floor, deepest under it; each front post lit down one side and in shade down the other, on a stone; jars with a rim and a light on the shoulder | |
| Its wall was one brown with lines | boards of more than one brown, each with two lines of grain and a gap beside it; the eave's shade is deepest under the eave and gone 48 below it; a beam under the wall, dark beneath | |
| Its window was a dark square | a frame, the dark of the room, the wall's own thickness in shade along the top and one side, a sill and the shade under it; each shutter is two boards on two battens and throws shade on the wall | |
| The temple's roofs were triangles | each roof sweeps (its slopes sag); glazed tiles with a border of green and a line of yellow along each slope, the roof's own red inside (`reach()` finds how far a roof reaches at a height, by halving); a board of gold along each slope with eight teeth, a horn at each lower end, and a cho fa at the top; a board along each eave; the shade each roof throws on the roof below | the green is 18 wide, the yellow 6; a roof's shade is 30 deep |
| Its wall was a white box with a red door | one side of the wall in shade; the lowest roof's shade on it; four pillars, each with gold at its head, a side in shade, and its own shade on the wall; the door set back under a gold arch, its top and one side in shade, with studs of gold; a window each side with a pointed top; a foot of stone and two steps | |
| The two chedis were flat | what is round is lit down one side and in shade down the other; the white one stands on two steps and has two rings; the gilded one has a foot of stone and rings that come closer toward the top | |
| The hall of the backdrops | `bdHall`: one side in shade, the band's shade down the wall, the roof's shade on the band; each window has a lintel, the shade under it, a sill and a little lamplight; the door is set back in a frame of gold, with a step; the gilded roof is tiles (`roofTiles`); a flat roof's edge stands out | a tile is 0.036 of the hall's width, and at least 7 |
| The stupa of the backdrops | `bdStupa`: each step in shade along its foot; the dome, the square and the rings of the spire lit on one side | |

A trap met on the way: after `roofTiles` the brush's path is the last tile it painted. A `stroke()`
that was meant for the roof's line drew one tile, outside the roof. Build the roof's path again
before its line.

`buildings.html` is the sheet. A building is painted once, on a set's sheet, not in every frame.
Measured (2026-10-13): to paint one, the house takes 3.1 ms (331 shapes filled), the temple 8.5 ms
(1660), a gilded hall 1.9 ms and a stupa 0.2 ms. `kit_check.py`, whole: 27 pages, 0 failures;
`buildings.html`: draws, same 0 / 0, 22.1 ms a frame.

The films made before draw the new buildings when they are drawn again: `lanna.html`,
`village.html` and `starter.html` have the house, and `village.html` the temple. The videos already
on the site were rendered before this and keep the old ones until they are rendered again.

**Not done:** the light is from one side whatever the hour of the scene, and a night scene's house
is lit as a day's; the rows of tiles are level, and do not follow the sweep of a temple's roof; the
temple has no gable of carved gold and no porch, as a Lanna wihan has; there is one house (a rice
barn is the same house, smaller) and it is seen from one side; nothing has an inside; the fence and
the trees are as they were (the guardians were redrawn 2026-10-15, next). Judged from stills only.

### The temple guardians (2026-10-15)

The owner sent a photograph of a yak at Wat Phra Kaeo and said "make the green temple guardians at
the temple image look more like this". The kit's `yak()` had been a green block with a belt, a
triangle crown, two fangs and a club at its side. What the statue does, written as rules and drawn
in `yak(brush, x, base, facing)` (placed in pairs by `temple()`; the maker's "yak" piece is one):

- The crown is a tall gold spire of tiers, each narrower than the one under it, from a bell with a
  red jewel on a band above the brow; it stands half again the height of the face (band at -162,
  tip at -232 in the figure's own units, the plinth top at -28).
- Gold flames flare up and out behind each ear, rising beside the head, not out from it (the first
  draft had them as wings; narrowed to a tip at 29 across, 178 up).
- The eyes are round, white and bulging, each in a blue rim, set in a blue mask across the face
  edged in gold, under a thick curved gold brow; a broad flat blue nose.
- The mouth runs the width of the face: a row of white teeth between pink lips, a fang rising from
  each corner.
- Both green hands are clasped, one above the other, on a club held upright before him; its knob at
  the chest, its foot on the plinth between his feet. The arms go down and out to the elbow, then in
  across the belly; a gold band at each upper arm, bracelets stacked at each wrist.
- A gold collar of mosaic lies over the shoulders and ends in points; the chest is gold armour in a
  lattice; a red belt; a jewelled sash with a blue panel hangs before the hips to the knees. Only the
  face, neck, arms, hands and shins show green.

The temple's layout is unchanged (the guardians stand at x ± 205 as before; the figure is 20 taller).
Checked at three sizes on a scratch sheet beside the photograph, then `kit_check.py buildings.html
village.html sash.html --quick`. Nothing of the photograph is copied; the rules above are what it shows.

### A paper parasol for the women (2026-10-15)

The owner sent a picture of four Thai border patterns, red on white, and asked for a parasol with those
patterns running round it, held by the women: upright as a rule, able to tip down toward the viewer
until it is a circle, spin for a time, stop, and come back up. In the kit, as the look name
**`parasol`** (80 look names): `true` holds it upright, a colour is its paper, and `parasolAt(t, start)`
gives `{tilt, spin}` for the show. What the picture does, as rules, in `parasol(brush, x, y, R, tilt,
spin, colour)`:

- Along the hem a row of pointed petals (36), each with a smaller petal of the ground inside it.
- A ring of round rosettes (10) between two rails of dots, each a red disc with a ring of cream gaps,
  a cream ring and a red heart; a small square flower between every two.
- A ring of diamond flowers (10): a lozenge with four cream dots and a heart, and a three-fingered
  leaf pointing out between each pair.
- A vine that scrolls round in S-curves (8 turns, bulging in and out by turns) with a lotus bud leaning
  along it at every turn; a rail of dots; a rosette at the crown.
- The canopy is a shallow cone (radius 120, 38 high, the handle 150 from the fist to the rim's middle).
  Each ring of pattern is a circle of the cone seen at the tilt: an ellipse as wide as the ring and
  `0.18 + 0.82 sin(tilt · 90°)` as tall, raised toward the crown by the cone's height times
  `cos(tilt · 90°)`. The rings are drawn from the hem inward, and each band's ground is painted over the
  band outside it, so the far side of the dome is hidden and the front shows every ring; the ribs show
  faint through the paper; a gold knob and a red point stand at the crown.
- The show (`parasolAt`): 1.2 s tipping down, 3.2 s of three turns (quickening, then slowing to a
  stop), 0.6 s still, 1.2 s coming back up: six seconds. The hand goes from above the shoulder
  (`[26, -22]`) to before the chest (`[32, 30]`) as it tips, closed round the handle and pointing up it.

**Two more kinds, and furling (the same day).** The owner sent an eight-direction yantra (a sak yant,
white on black) and a Lanna cloth of elephants round a seated Buddha (black on white): "make two more
spinning parasols from these patterns as well. When the one with the buddha spins, make everything
spin except the buddha." Then: "see if you can make the parasols open and close in an upright and
down position as well." So `parasol` takes a kind (`"lai"`, `"yantra"`, `"buddha"`; the paper and
ink of each in `PARASOL.kinds`), and `{open: 0..1}`:

- **yantra**: a rim of dots; eight rays, each a spike tapering to the hem with script down its length
  (script = short strokes across, by turns longer and shorter); a small circle with a cross between
  every two rays and a cluster of three dots beyond it; round the core, three rings of script between
  lines, and a spiral rising to a point (the unalome). Ivory on black; the ribs show pale.
- **buddha**: a hem of 48 close triangles; a vine of kanok flames (a curled flame and a leaf, by
  turns, 12); 36 smaller triangles pointing in; eight elephants walking round, feet to the hem, a
  rosette above each (an ink body, four legs, a head with an ear, a trunk down and curling forward, a
  tusk and an eye of the ground, a bordered cloth on the back); a rail of dots; six diamond flowers
  with a lobe at each point; and at the crown the Buddha on a lotus in an aureole of flame, drawn in
  the still frame (`each(..., still)` and `ring(0, ...)` take no spin), so everything turns but him.
- **Furling** (`parasolShape(open)`): a rib is as long as the open parasol's slant; closed it lies
  0.09 rad from the handle, open `atan2(1, dome/radius)` = 1.26 rad, eased between. The canopy's
  radius and dome are that length's sine and cosine, so furled it is a tall thin spindle whose rings
  draw in to the handle; the crown stays at the top of the handle and the rim rises to it. The finial
  keeps its size. Furled and tipped to the viewer it is a small disc at the hand.
- **Shows** (`parasolAt(t, start, kind, colour, show)`): `"twirl"` as before (six seconds, open);
  `"open"` (upright, opens over 1.4 s from furled); `"close"` (upright, furls over 1.4 s); `"bloom"`
  (furled: tips down 1.2 s, opens 1.4 s, three turns 3.2 s, rests 0.6 s, furls 1.4 s, comes up 1.2 s:
  nine seconds, ending furled).

The cartoon maker offers six poses, **parasol** (🌂 กางร่ม, open), **furled** (🌂 ร่มหุบ), **twirl**
(🎡 หมุนร่ม), **open** (☂️ เปิดร่ม), **close** (🌂 หุบร่ม) and **bloom** (🎡 บานแล้วหุบ), each show from its
key's second, and a select under the pose buttons for which parasol she carries (`item.parasol`, also
read from the model's JSON as `"parasol"`); its rules tell the model all of this and that a parasol is
for the women. Sheet: `looks.html` (row `parasol`). Not done: the parasol does not lag the hand
(nothing hangs from it), it is one size, it never tips to the side, and a furled parasol is still held
up above the shoulder rather than down at her side.

**A scene of them (`parasol_rain.html`, 36 s; owner: "walk along in a rain storm but then the clouds
should disperse and it should stop raining ... spin their parasols with a bit of rain flying off ...
open and close them a couple of times before finally closing them and walking on").** The paddy backdrop;
a storm (`storm(t)`, 1 until 8 s, 0 by 13 s) drawn as dark cumulus (`STORM_LOOK`) on a sheet of the
film's own, laid on at the storm's strength (cumulus() sets its own alpha per cloud, so a fade needs
its own sheet) and drifting faster as it thins, under a dark wash over everything and a warm wash as the
sun comes out; one flash of lightning at 4.0 s; rain (`rainfall(t)`, stops by 11 s) as 240 slanting
streaks on their own courses, half behind the women and half before them. The three women `stroll()` in
with parasols open, stop at 400, 720 and 1040, twirl from 13 s (each 0.3 s after the one before), then
close, open, close, open, close (the kit's shows, 1.8 s apart), and at 28.5 s walk off furled. **Rain
flies off the rim**: person() now returns `joints.parasol` (the rim's middle) and `joints.parasolRim`
(a point on the rim), in the film's pixels; for two seconds after the spin begins, 60 drops leave the
rim along its turn (the spin angle at each drop's birth from `parasolAt(born, 0).spin`) and fall, each
a short streak, blue with a white light. The first drops were pale blue and invisible on the sky.

**More rain off the rims, and in the hero film at all (2026-10-16; owner: "when the parasols spin,
make the rain that spins off more evident").** In `sash.html` (`pixels: 2`) no drop showed: the rim is
given in the film's own pixels, and the drops were drawn under the scene's base scale, so twice as far
out, off the picture. `rainOff()`, the same in both films, now draws with the transform reset and every
length times `PIX`, as the boy's rope is drawn. The drops are also more and plainer: 150 a parasol (was
60), born over 2.6 s (was 2.0) and living 0.9 s (was 0.6), thrown 450 to 750 px/s along the rim's turn
and 60 to 140 outward (was 380, and none outward), falling at 1400 px/s² (was 1040); each is a teardrop,
a head of radius 5 to 8 with a tail up to 60 behind it along its way, a dark blue edge (#1e468c), a
light blue body and a white glint, so it reads on the cream parasol, the black one and the sky.
Checked with the rows above (`kit_check.py sash.html sabai.html parasol_rain.html`, 2026-10-16): 3 pages,
0 failures. `sash.html`'s known folded arms are four now: a wai at 20.0 s, added to the film after the
allowance was written, has the same one-frame elbow blend as those at 28.3, 29.2 and 35.0 s.

**The owner's three notes on the first cut (same day):** "parasols become translucent when they start
to close" (a furled cone was its rings alone, thin ellipses stacked up the handle with the field showing
between them: now the cone's silhouette, crown to the rim's two sides, is filled with the ground and
outlined before the rings); "they also seem to open and close magically without the women using their
hands. Have them open and close them from the down position so you don't have to animate the hand
actions, then when they are finally closed they should hold them naturally and walk on." So the kit
gained **`hang`** (0 to 1: the furled parasol swung about the fist by `-(π − 0.45)·hang` to hang down
behind her, tip to the ground, the hand moving from the handle's place to `[16, 64]` at her side,
`parasolHand(tilt, hang)` / `parasolSwing(hang)`), and two shows: **`spin`** (as twirl, but it stays
down) and **`fold`** (down: close, open, close, open, close at 1.4 s each and 0.4 s apart, come up
furled 1.2 s, swing to the side 0.8 s: 11.2 s, ending carried). The film: spin from 13 s, fold from
19 s, walk on carried from 31 s; 40 s. The maker: poses **carry** (🌂 ถือร่ม, `{open: 0, hang: 1}`),
**spin** (🎡 หมุนค้างไว้) and **fold** (🎡 หุบแล้วถือ); nine parasol poses now.

**The hands (owner, on the second cut): "Have the women's right hands go to the parasol when they are
opening and closing them. The hands look upside down."** The fist on the handle had pointed straight
up the handle, and carried, with the parasol turned, straight up past it: a hand holding the handle
from below, palm up. Now the fist points forward over the handle (`angleA = −0.6`) when the parasol is
up, and turns to hang down past it (`+π/2 + 0.3`) as `hang` goes to 1; the parasol's own turn
(`parasolSwing`) is separate, so the handle angles back under a hand that hangs straight. In `fold`,
`busy` (0 to 1, 0.4 s in, 0.5 s out, over the five closings and openings) brings the far hand to the
handle (`handB` toward `[80, 56]`, closed), the arm coming across the chest; open, the canopy hides
both hands, and closed, both show on the small furled parasol. The free hand that hangs while walking
is the kit's rest hand, unchanged.

**Third notes (owner): "move their hands to the parasols before they spin but while the parasols are
down. Don't have the women raise up the closed parasols. Also look at the tops of the parasols and
push down anything sticking up."** `spin` now tips down (1.2 s), brings the other hand to it (0.4 s)
and spins from 1.8 s, the hand staying on; `fold` starts with the hand on, drops it after the last
closing (8.6 s), and from 9 s swings the furled parasol from the down position straight to her side
(`hang` up and `tilt` down together, 1 s), never lifted: 10 s. The points on top were the far side of
an inner ring's motifs: a ring's frame is raised by the cone's height at that ring, so a yantra ray
from 0.3 R out to 0.92 R, or an elephant, reached above the dome's apex on the far side. The rings
are now drawn inside a clip of the cone's outline (the triangle to the crown plus the rim's ellipse,
both wound the same way), so nothing shows past the dome's edge.

**Fourth notes (owner): "There is a big triangle cut out of each parasol. Have the women only close
them twice. Change the rate so that they open really quickly once they are closed like they are
shaking off rain."** The wedge was the clip: the rim's ellipse was added with the kit's usual
`0, 7` end angle, a turn and 41° more, so the path closed from that point across the disc and cut
the wedge between; a clip path takes `moveTo` first and exactly `2π`, where a fill forgives both.
`fold` is now close (1.4 s), snap open (0.35 s), close (1.4 s), the hand drops, the swing to the
side: 5.6 s; the film walks on at 25.5 s and is 35 s.

**Fifth notes (owner): "Turn the left hand palm down when they are walking away and evaluate the
left hand to make a new hand position for holding parasols."** Looked at on a sheet of the lady at
size 2.2 (three moments of the walk, and holding the parasol up), hands cropped at twice the size.
The carrying hand had been a closed hand with the fingers curling forward and up, a claw; the free
hand hung flat with straight fingers. Now the carrying hand IS the free hand's shape: it hangs on
from the forearm (`forearmA + 0.12`), open 0.1 with `REST_A` curls, and the handle lies across the
palm under the thumb (the parasol's own turn, `parasolSwing`, angles it back). Held up, the hand
keeps the fist (`PARASOL_GRIP`, the fingers curled round the handle, the thumb over them). And the
free hand of anyone holding a parasol, when at rest, takes `PARASOL_FREE` (a little cupped, the
back of the hand out: the glove draws knuckles and nails, so a hand that hangs shows its back).
The kit's rest hand for everyone else is unchanged.

**Sixth note (owner): "Change the right hand so the pinky isn't on top of the ring finger and the
thumb is under the pointer finger."** `glove()` draws its fingers in order from the thumb's side,
so the little finger lies over the others, and the thumb last, over them all: right for a far hand,
wrong for the near hand of one carrying a parasol, whose first finger is nearest the viewer. A ninth
argument, `near`, draws the thumb first and then the fingers from the little one to the first; the
carried parasol's hand passes it. Judged on the sheet at three times the size.

**Seventh note (owner): "the right hand looks like it has a palm curve line on the back of the
hand."** It was the crease at the base of the thumb that `glove()` draws on every bare hand, a palm
mark on a hand that otherwise shows its back (knuckles, nails); with the fingers drawn the other
way round it crossed the hand. A `near` hand gets no crease. Seen at five times the size.

**The hold, from a picture (owner, 2026-10-15: "Look at this image and use it as a reference for how
the parasols should be held", a Victorian woman with a lace parasol on a London embankment).** What
the picture does, as rules: the hand holds the handle's END, low, at the chest, the forearm across the
body and the elbow at her side; the handle rises past her shoulder, angled back, so the canopy stands
above and behind her head, its axis along the handle (the canopy leans back with it); nothing of the
canopy is before her face. In the kit: `PARASOL.handle` 225 (was 150, which put the canopy over the
head); `parasolHand` up = `[24, 36]` (before, `[26, −22]` above the shoulder), tipped `[32, 30]`,
carried `[16, 50]`; `parasolSwing(tilt, hang)` = `−0.5 · (1 − tilt)` held up (back over the shoulder),
0 tipped, `−(π − 0.75)` carried; the fist points along the handle (`−π/2 + swing`) when held, and
hangs from the forearm when carried. The canopy is still drawn in front of the figure, so at the
crown it covers the back of the bun; carried, the long parasol trails to the ground behind her.
Nothing of the picture is copied.

**Then (owner): "modify how the hand is not the positions."** The picture was for the hand, not for
where the arm and parasol go. The positions went back as they were (handle 150, the hand above the
shoulder at `[26, −22]`, the parasol upright, carried at `[16, 64]` and `−(π − 0.45)`), and the hand
became the picture's grip: a fist closed round the handle, horizontal (`angleA = −0.1`), the back of
the hand and the knuckles to the viewer, the thumb on top, the handle going in at the top of the fist
and out at the bottom (the handle is drawn with a gap of 12 either side of the grip, so the fist
covers it). The parasol hand is now the `near` hand in every position: first finger over the others,
thumb beneath, no crease. Judged at four times the size on the hand sheet, the fourth lady moved in
from the sheet's edge, which had clipped her hand.

**Then (owner): "The grip looks terrible. Model from a picture of a real hand and make a new hand
that can hold things."** The glove's curled fingers could not make a fist round a handle: it is a
hand seen flat. A photograph of a hand on the bar of a gym machine (Wikimedia Commons, "Hands of a
fit woman are gripping the handles of cardio equipment…", Shixart1985, CC BY 2.0; kept in scratch,
nothing copied) gave the rules, drawn as **`gripHand(x, y, angle)`** in the kit: the back of the hand
is a wedge widening from the wrist to a ridge of knuckles just before the handle; four fingers,
stacked from the first at the top to the little one at the bottom (the little one shortest), leave
the ridge and wrap round the handle, their first joints crossing in front of it, so at the grip the
handle is hidden and shows only above and below the fist; the thumb comes over the top from the
wrist's side and lies along the first finger, its tip and nail past the handle; a short curve at
each knuckle. Drawn pointing +x with the handle crossing at `GRIP_AT` = 16 and turned by `angle`;
the fingers are drawn from the little one up, each under the one above, the thumb last. The parasol
hand is this hand in every position, set square to the handle (`angleA` = the handle's axis ± π/2,
whichever points forward), so held up the wrist is behind the handle and the fingers wrap forward,
and carried the fist turns with the trailing handle. The handle is drawn with a gap of 14 either
side of the grip. `glove()`'s `near` argument and `PARASOL_GRIP` are gone with it. Judged at four
times the size, held up and carried.

**Then (owner): "angle the wrist and the arm so they aren't at odd angles."** The fist is square to
the handle, so a vertical handle means a horizontal fist, and a forearm that came straight up to it
bent the wrist a right angle. Three hand positions were drawn side by side at size 2.2 (`[56, −4]`,
`[46, −12]`, `[36, −18]` from the shoulder): the middle one taken, the forearm rising at a shallow
angle to the fist and the canopy still clear of the head; `parasolHand` up = `[46, −12]`, tipped
`[32, 30]`, carried `[16, 64]`. Carried, the parasol now leans further back, `−(π − 0.9)`, so the
fist square to it points down and forward and the hanging forearm meets it with a modest bend; the
tip trails to just above the ground.

**In the hero film (owner, 2026-10-15: "Replace the dusk monk scene with the parasol scene in the
main hero video").** `sash.html`'s scene 40–49 s, the temple at dusk (an elephant on the hill, the
monk who wais, the crowd, the lanterns rising), is now `scenePaddy`: the paddy backdrop (sash is a
1920-wide film, and `backdrop()` paints at `WIDE`, so it fills the frame), the storm clouds on their
own sheet, the dark and the warm washes, the rain in two layers, the flash at 1 s, and the three
women strolling in under the three parasols from 60/360/680 to 400/720/1040 (under `translate(SIDE)`,
the drops in the film's own pixels), the twirl from 3.2 s (each 0.3 s later than the one before) so
they are coming up as the iris closes; the parasol scene at length stays `parasol_rain.html`. The
sung line 41–48 was "โคมลอยที่วัดยามเย็น" (lanterns at the temple at dusk) and is now
"ร่ม บาน เมื่อ ฝน ซา แล้ว" / ร่มบานเมื่อฝนซาแล้ว, "the parasols open when the rain has passed", six
syllables on six beats as before, so the song is re-sung (`sash_sing.py`, in a scratch lab with the
kit, the page, `sash.wav` and the singing helpers: it imports `lanna_sing`). `backdrops.js` is now
loaded by sash.html. The dusk set, `paintTempleFront` and the monk's crowd call are still painted at
load and unused by any scene (the dance scene keeps its own `crowd`): left for a later tidy.
`lanna_cartoon.html`'s two descriptions of the film say "the rice fields in a rain that clears" in
its three languages. kit_check sash.html --quick: 0 failures, the four lines each inside one scene.

**Then (owner): "Let the parasol scene play out a little more and watch the women walk away until
at least one of them is off the screen."** The scene is now 40–60 s and the film 68 s: the women
stroll in (arrive by ~3 s), `spin` from 3.2 s (down, the other hand to it, three turns, held down),
`fold` from 8.8 s (close, snap open, close, swing to the side, 5.6 s), and walk off from 15 s, each
0.3 s after the one before; the weaver, nearest the right edge, is out of the frame by ~59.2 s and
the lady is the last in the iris. The dance is 60–66 and the card 66–68; `STYLE.hop` follows; the
dance line is sung from 61 s; the night sky's clock is `t + 60`. `sash_music.py` is 132 beats (66 s
of music after 3 s of silence, 71 s in all; was 110), regenerated, and the song re-sung on it: the
dance line now takes the tune's notes at its new beats. `lanna_cartoon.html` says 68 seconds in its
three languages and its meta descriptions (eight places). (Then, owner: "Remove the reference to the
time of the video as it may change": the page states no length anywhere now, thirteen places.)


**Put down, behind her (2026-10-15).** The owner: "change it so when the women put the parasols down they
are behind the body not in front". The kit drew the parasol last, over everything, even carried at her
side, where its own comment said it hangs "down behind her". Now, from the moment it starts to swing down
(`hang` > 0), `person()` draws the figure on a layer of its own (`PERSON_LAYER`, made once at the size of
the sheet, with the sheet's transform, line joins and smoothing; `PERSON_LAYERED` keeps it to one figure
at a time), puts the parasol on the sheet first at the same transform, and lays the figure's layer over
it, so the fist holds a handle that goes behind the skirt and only the tip shows by the feet. Over the
swing the parasol always lies across the body, so a switch in one frame would jump: a copy drawn in front
fades out, at `1 − smoothstep((hang − 0.25) / 0.5)`, so at the start of the swing the picture is what it
was and by the end the parasol is wholly behind her (a faint copy shows over the chest for about half a
second). Every carried parasol in the kit behaves this way.

**The handle over the sabai (2026-10-19).** The owner: "When the women are walking away with their
umbrellas, you can't see 2 of the handles." The two who wear a sabai lost the handle between the fist and
the skirt, and from the middle of the swing back the whole parasol: the back of the sabai hangs beside her
arm and was drawn on her layer, so over the parasol on the sheet. The woman without one showed hers. The
back of a sabai hangs behind the arm whose hand holds the parasol, so while the parasol hangs behind her
(`layered`) `sabaiBack()` paints it on the sheet, before the parasol, at the same transform: the handle
runs from the fist over the cloth and on behind the skirt, the fingers still closed over it. With no
parasol behind her, nothing changes. (Drawing the handle's end over the whole figure was tried first and
dropped: it lay over the fingers of the fist.)

**Down first, then back (2026-10-17).** The owner: "when the women close the parasols the parasols then
pass through their torsos. Change it so the parasol swings straight down first and then back." In `fold`
the furled parasol went from tipped toward the viewer to carried in one movement: `tilt` from 1 to 0
while `parasolSwing` turned it `−(π − 0.9)` about the fist, so it rose, went back over her and came down;
half way it lay level across her chest, and the fading copy showed it there (the hero film at 64.0 s).
Now it swings in two halves, each eased, so it stops at the bottom: from 4.6 s to 5.1 s `tilt` goes on
from 1 to 2, which tips it on past the viewer until it points at the ground (the painter needs nothing
new: `cos(tilt · π/2)` turns negative and the crown is drawn below the rim, as a mirror of tilt 0), while
`parasolHand` lowers the fist from before the chest, `[32, 30]`, to her side, `[18, 72]`, which is where
its own formula already put tilt 2; then from 5.1 s to 5.6 s `hang` goes to 1 and `parasolSwing` turns
it back only `+0.9`, for a parasol at tilt above 1. That ends where the old way ended: the same carried
parasol at `[16, 64]`, leaning back by the same angle, except that the small furled canopy's pattern is
mirrored about its own shaft (at 66.5 s, 373 of the frame's 8.3 million pixels differ, all at the
furled tips; before the swing, at 60.0 and 63.35 s, none do). The handle's end below the fist comes
round above it as the parasol points down (`end` = `cos((tilt − 1) · π)` past tilt 1, 1 otherwise, so
no other show changes). The copy in front now fades over the first fifth of the swing back
(`1 − smoothstep(hang / 0.2)`, about 0.14 s), while the parasol still hangs beside her skirt and
crosses only the edge of its hem; it then swings back behind her, never across her. The show is still
5.6 s. The maker's carried pose, `{open: 0, hang: 1}`, is unchanged.

## A dozen backdrops to start from

The owner (2026-10-13): "Make a dozen different background to start from. Research thangka paintings
online and draw inspiration from traditional sources." `backdrops.js` is loaded after the kit and
gives `backdrop(name)`: a set, 1440 x 1080, painted the first time it is asked for and kept. A
scene begins with `pen.drawImage(backdrop("meadow"), 0, 0)` and stands its people on the ground,
which in all twelve is near y = 900. A name it does not know is warned about, as the kit warns.

**Where the rules come from.** No painting was copied, and none was used as a model. The rules are
the tradition's own, as a scholar sets them out: P. Lehtisalo, "Holy Grounds: Landscapes in Tibetan
thangka paintings", *Studia Orientalia* 109 (Helsinki 2011), from p. 61, which reads Jackson and
Jackson's *Tibetan Thangka Painting: Methods and Materials* and others; and for the grounds of one
colour, the page on ground colours of Himalayan Art Resources (himalayanart.org). The article says
there are no strict rules for a thangka's ground as there are for its holy figures, and yet the
ground is painted very formally: "mountains, water, clouds, etc. tend to repeat few basic patterns".
Those patterns are what the file keeps.

| What the tradition does (Lehtisalo's section) | Painter in `backdrops.js` |
|---|---|
| The sky is darker the higher it goes; the horizon is light, or has a red glow (2.5) | `bdSky` |
| The sun and the moon are almost always there, near the top corners: the sun at the right, orange or red, the moon at the left, white, sometimes a crescent with stars by it (2.8) | `bdSunMoon` |
| Mountains stand on the horizon behind green hills: very steep, pointed, wholly under snow, white to light blue, the folds of the snow edged in a darker blue (2.3) | `bdSnow` |
| The land is green hills with rows of small specks along their edges (2.1) | the kit's own `hills()`, whose tufts are those specks |
| Land is a triangle that points up and water one that points down (2, figure 1) | the streams of `crags` and `valley`, each cut as a triangle that widens as it comes |
| Stones are angular, with jagged and hollow edges, and stand up; a crag has an outer zone of blue and an inner one of green, each darker at its outer edge, with gold round it; brown ones stand among them (2.2) | `bdCrags` |
| Water is solid, with no reflections: zones divided by wavy white lines, each zone darkest at the front; a cascade's lines follow its fall, and it ends in a splash (2.4) | `bdWater`, `bdCascade` (its splash is the kit's `foam`) |
| Clouds are of two kinds: plump, a row of round lobes on a flat foot, and layered, thin bars high up joined by short necks; they are of many colours, several in one picture (2.6) | the kit's `scrollCloud` with a `foot`, and `bdLayers` |
| Rainbows twist, loop, change their width and end in the middle of the air; they are solid, of two to five stripes (2.7) | `bdRainbow` |
| There are few plants and each leaf is drawn, the leaves in rings about the middle of the foliage; a jewel tree is a small tree hung with strings of gems (2.9, 2.10) | `bdJewelTree` |
| Birds stand on the ground or in the water; fish put their heads out of it, because the water is solid (2.11) | `bdCrane`, the kit's `fish` |
| Buildings are those of the Himalaya, and stupas and temples have rainbows about them (2.12, 2.7) | `bdHall`, `bdStupa`, `bdFlags` |
| Nothing casts a shadow on the ground (1) | none of them paints one |
| Besides the paintings of many colours there are three of one ground: black with lines of gold, which may be darkly tinted; red with lines of gold; gold with lines of red or black (1) | `bdOneGround`: it finds the edges of a painted set and makes them the line, and makes all the rest the ground, with a little of the set's own colour kept |

| Name | What it is |
|---|---|
| `meadow` | green hills under snow peaks, the sun and the moon, one tree, flowers |
| `crags` | blue and green crags at both sides, a cascade, a stream, a red glow at the horizon |
| `lake` | a lake of lotus in zones of water, two goldfish, snow peaks far off |
| `sky` | nothing but sky: plump and layered clouds of many colours, two rainbows, a bank of cloud to stand on |
| `midnight` | the meadow as a black thangka: a black ground, lines of gold (it was `night` until the cartoon maker offered these: the maker has a `night` of its own, an hour of the day) |
| `vermilion` | the crags as a red thangka: a red ground, lines of gold |
| `golden` | the lake as a gold thangka: a gold ground, lines of red |
| `hermitage` | a cave in a crag under great snow mountains, a crescent moon, a cascade |
| `longlife` | the rock, the water and the tree of long life, with two cranes (the old man is the cast's `elder`; the deer is not made) |
| `garden` | a garden of jewel trees before a gilded hall with a rainbow behind it, and a round pond |
| `monastery` | halls one above another up a hill, a stupa, lines of flags |
| `valley` | the open, pale manner: a wide sky with little in it, small far peaks, a river that widens as it comes |

`backdrops.html` is the sheet: every backdrop at once for six seconds (since the seven places of
the north were added, nineteen, the seven first), then each whole for two seconds
with three of the cast standing in it. Measured
(2026-10-13, on battery): the slowest of the twelve to paint is `meadow`, 107 ms, and the three of
one ground take 58 to 84 ms; all twelve together take 438 ms, once. `kit_check.py backdrops.html`:
draws, same 7 / 0, 21.5 ms a frame, no warnings.

## Seven places of the north, and the backdrops of the cartoon maker

The owner (2026-10-13): "Add more backgrounds for the cartoon maker." The maker had three, its own
green hills at three hours of the day. It now offers every picture of `backdrops.js` beside them, and
`backdrops.js` has seven more: places of the north of Thailand. (For an hour there were eight. Of
the yard of a temple the owner said "Don't do a temple yard. Just forget that one", and it is gone.)

| Name | In Thai | What it is |
|---|---|---|
| `paddy` | นาข้าว | rice fields in five rows that are wider the nearer they come, every bund pointing at one place far off (720, 560); one field in six is under water and one in seven is ripe; a field hut, three palms, and a wide bund of earth to stand on |
| `river` | แม่น้ำ | a far bank with trees, palms and a house at 0.4 of its size; water pale far off and deep near, in the kit's `waves`; two boats; a near bank of grass with reeds, a lotus and a tree |
| `doi` | ดอย | one great mountain with seven spurs, each light along its back and in shade on the side away from the morning sun; a white wall, a hall and a gold chedi on its shoulder, and the road down; three bands of mist and two clouds that lie on it |
| `waterfall` | น้ำตก | a cliff in layers with a ledge half way down, a mass of rock standing forward at each side, the forest along its top, creepers and ferns; the water falls in two leaps into a pool |
| `village` | หมู่บ้าน | three houses on posts at three sizes, a haystack, palms, bananas, a tree, and the kit's fence and flowers (`pathside`) |
| `market` | ตลาด | four stalls under cloth in stripes, each with three baskets heaped with fruit, the village behind them, and a rope of nine paper lanterns from one pole to another |
| `yipeng` | ยี่เป็ง | the night of Yi Peng: stars, a full moon, 34 lanterns in the sky (the kit's `lantern`), a temple across the water, eight krathongs on it, and 22 clay lamps along the bank |

They are in the kit's own manner, the manner of the film in `lanna.html`, and not the thangka's: a
sky that is pale at the horizon, ranges of hills that are bluer the further off they stand, earth or
grass to stand on, the kit's own `house`, `temple`, `tree`, `palm` and `banana`, and the wash of
watercolour (`wash`) over the whole sheet at the end. People stand between y = 880 and 1040 in each,
as in the twelve. What they needed that the kit did not have:

| Painter in `backdrops.js` | What it paints |
|---|---|
| `bdFloor(brush, top, far, near)` | the ground to stand on, from `top` to the foot of the sheet: `far` at its top, `near` at its foot |
| `bdTufts(brush, top, bottom, count, seed)` | tufts of grass between two heights, a small flower on one in three |
| `bdSized(brush, x, base, size, paint)` | something of the kit's at another size, for what stands far off: `paint` draws it at (0, 0) |
| `bdTreeLine(brush, left, right, y, r, colour, seed)` | a line of trees far off: the tops of their crowns, each a `leafPad` |
| `bdHut(brush, x, base, size)` | a field hut: a floor on four posts, open on every side, under thatch (`roofTiles` with pointed ends) |
| `bdBoat(brush, x, y, size, facing)` | a long boat of the river: a hull that rises at both ends, a roof of matting |
| `bdChedi(brush, x, base, size)` | a gilded chedi of the north: a foot of white stone in three steps, a body with a niche, a bell, a spire of seven rings, an umbrella |
| `bdHaystack(brush, x, base, size)` | rice straw heaped round a pole, in layers |
| `bdKhom(brush, x, y, size, colour)` | a paper lantern that hangs: eight sides, gold at its top and foot, three tails |
| `bdStall(brush, x, base, wide, cloth, seed)` | a market stall: baskets of fruit on a table with a cloth down its front, under cloth in stripes on four bamboo poles |

**What changes for a film that had the twelve.** A row of `BACKDROPS` has a third thing, the name in
Thai, and the seven come first. One name changed: the black thangka was `night` and is `midnight`.
A page that offers these beside an hour of the day already has a `night`, and one name cannot be
two backdrops. Nothing in the repository asked for `backdrop("night")` by name (searched).

**Traps met on the way.**

- The kit's `lantern()` draws on the film's sheet, `pen`, at the second `clock`. A set is painted on
  a brush of its own, and it must be the same picture whenever it happens to be painted. `yipeng`
  gives `pen` the set's brush and `clock` the value 0 for the length of its lanterns, then gives
  both back.
- Night is not painted in dark colours. The land is painted as by day on a sheet of its own, and one
  fill of dark blue is laid on it with `source-atop` (`rgba(12, 20, 56, 0.74)`): everything on the
  sheet keeps its shape and loses its light. Then it is drawn over the sky, and the lights are
  painted after it.
- Three `ellipse()` calls in one path are joined to one another by lines: the moon's seas were one
  odd blot. Each has a `beginPath()` of its own.
- A gradient laid as a rectangle shows on the air beside the shape it was meant for: the chedi stood
  in a pale box. The shape is made the clip first (`gilt()` and `foot()` in `bdChedi`).
- On a dark sheet the pale strokes of `wash()` show more: `yipeng` lays it at half strength.

**The maker** (`krueng.ai/cartoon_maker.html`).

- Its own table of backdrops had the kit's name, `BACKDROPS`, and would have taken the kit's place
  once `backdrops.js` was loaded. It is three tables now: `HOURS` (day, dusk, night), `PICTURES` (read
  from the kit's `BACKDROPS`; a row with the name of an hour is left out) and `BACKS` (both).
- A film on a picture has no `SKY` and no `cumulus`: its scene begins
  `pen.drawImage(backdrop("paddy"), 0, 0);` and then lays the `SHEET`, which holds the set pieces
  only. The exported page loads `backdrops.js`.
- A picture's button shows the picture itself, 184 x 138, over its name in Thai, two to a row. They
  are painted one at a time once the page is up, 40 ms apart. The kit keeps every set it has painted
  (1440 x 1080 each); the maker's `letGo()` throws away all but the film's own, so that a child who
  tries them all does not fill a phone's memory.
- The prompt for a model lists every name with the kit's line about it. A film that names a
  backdrop the page does not have gets `day`, whether it comes from a model or from what the browser
  kept.

**The maker's grandmother is old (2026-10-13).** The owner: "The old people in the maker look
normal. Make their faces and hair look old." The maker offers one old person, แม่อุ๊ย, and she is
the kit's `weaver`: a grown woman with black hair, painted lips and no lines. The kit already has
the looks of age (`hair`, `age`; see "Each figure its own"). The maker's table `AGED` names who is old and what
makes them so, and `personCode()` adds it to the look, so the film's code says it in full:
`cast("weaver", {..., hair: "#e8e3da", age: 1})`. Nothing is stored in a film: one made before is
drawn old too. The kit's own `weaver` is not changed: `sash.html`, the film at the top of
`lanna_cartoon.html`, has her as its young woman. A check in the browser (her code, nobody else's
changed, the film's own page drawn before and after, no warning): 6 lines, all held; the check of
the backdrops again, 38 lines, all held. Not done: she does not stoop (the kit's old people have
`bend`; the owner asked for the face and the hair).

**The maker's buttons, each tried with the mouse (2026-10-13).** The owner, told that the maker had
one old person and that the kit has four more: "Make sure the buttons on the maker are accurately
adding them." Read as two things, and both done. The four are in the palette: `elder` (👴 พ่ออุ๊ย),
`grandmother` (👩‍🦳 ยาย), `oldfarmer` (👨‍🌾 ลุงชาวนา) and `devotee` (🙏 ยายไปวัด), beside `weaver`
(👵 แม่อุ๊ย); they are old as the kit draws them, so `AGED` still names only the weaver. And every
button of the palette was dragged onto the stage as a child's finger does it (press on the button,
carry, let go): for each, what was added (its kind and its name), where (against the place the mouse
let go, worked out by the check and not by the page: the stage shows 1920 x 1080 and the sheet lies
240 from its left), whether the film's code draws that very thing, and whether the stage changed.
Before the four were added: 56 buttons, all held, so nothing was adding wrongly. After: 60 buttons
(15 people, 7 things, 20 flowers and fruits, 18 set pieces), 66 lines, all held; the five old
people, each added by its own button, are drawn old in the maker and in the film's own page, with
no warning. Each of the five was also drawn in every pose a child can pick (walk, wave, wai, sit,
sing): no warning. The prompt for a model says who the five are. Not done: a button does nothing
when it is only tapped (it has to be carried to the stage: that is how the page was made); the old
man waves with the hand that holds his stick, so the stick goes up with it; the backdrop buttons,
the text buttons and the panel's buttons are not in this check (the backdrops have their own).

Measured (2026-10-13): of the seven the slowest to paint is `yipeng`, 167 ms, and the quickest `market`, 107
ms; the seven together take 939 ms and all 19 backdrops 1278 ms, each once. In the maker all 19 small
pictures are painted 2272 ms after the page is ready, and a frame of its example film takes 79.5 ms on a
picture and 81.4 ms on the hills of day. `kit_check.py backdrops.html buildings.html`: 2 pages, 0
failures; `backdrops.html`: yes, same 3 / 0, 21.1 ms a frame. A check that taps every backdrop of the
maker as a visitor would (the film's code, the stage, the export, a film from a model, a film kept
in the browser): 38 lines, all held.

**Not done.** A place has one hour: only the maker's own hills can be had by day, at dusk and at
night, and `yipeng` is the only night among the places. Nothing in a picture moves: its clouds do
not drift, its water is still, and the lanterns of `yipeng` do not rise (the maker's own lantern
can be given a course over them). Everyone stands in front of everything: there is no front layer,
so nobody walks behind a stall, as `lanna.html` lets its people walk between the pond's water and
its lotus. The temple still stands across the water in `yipeng` and small on the mountain in `doi`:
the owner's word was about the yard. The waterfall's two leaps are stiff. There is no school, no
room inside a house, no town and no sea. The maker lists nineteen small pictures in one run, with
no heading between the seven and the twelve. Judged from stills only.

**Found on the way, and not mended** (neither is from this change):

- At a phone's width the maker's stage has no width. `applySides()` writes the three columns on the
  page itself (`190px minmax(0, 1fr) 250px`), and that beats the rule that makes the page one column
  under 900 px: at 400 px the middle column is 0 px wide and the page is 480 px wide. Measured on
  main's copy before this change, and the same after it.
- `film.py stills` and `film.py render` write a film's page that loads the kit from the site, also
  when `--maker` names a local copy. Until this is on the site, a film on one of the seven places is
  drawn there on the meadow (the kit's answer to a name it does not know), and `film.py` still prints
  "the kit raised no warning", because it gathers warnings in the maker's page and not in the film's.

**The snow mountains stood on the air, and do not now (2026-10-13).** A range ended in a level
foot, and where the hills before it dipped lower than that foot, the sky's lowest colour showed
under the mountains. The owner saw it in `valley` ("extend the mountains in the valley image down
past the horizon so they don't float"), was shown the same line in `meadow`, `crags`, `lake`,
`hermitage`, `longlife` and `monastery`, and said "fix them". `bdSnow` takes a seventh thing,
`under`: how far below `base` the sides of each peak, and the folds of its snow, run on, each the
way it was going. The rule for the number: the base of the first hills before the range, less the
range's own base, and 10 more. The ridge of `hills()` is never lower than its base, so the foot is
always behind it. That gives 90 for `meadow`, `crags`, `hermitage` and `longlife`, 80 for `lake`,
110 for `monastery` and 70 for `valley`; the three of one ground follow the three they are made
from. `sky` and `garden` have no snow mountains and are the same picture as before (compared).
`kit_check.py backdrops.html buildings.html`: 2 pages, 0 failures.

**Not done, the twelve.** These are grounds without their figures: nothing holy is drawn, and a film's own
people stand where a thangka's would sit. Nothing in them moves (a film can draw its own clouds
over them). The three of one ground are made from the others by a rule, not painted line by line as
a painter would. Their lines are of one weight (a pixel is line or it is ground: at first they
faded with the strength of each edge, and that was mended); a real black thangka's are finer. No snow lion, deer, peacock
or offering is made. The styles of the schools (the article names how the manners differ) are kept
only as far as `valley` is open and pale and the rest are full. Judged from stills only.

## Decorating a scene (2026-10-19)

The owner: "Come up with a decorate scene process for the kit. Go through the scenes that exist and add
background flora and mist as appropriate ... Then go through and add birds and animals and then plot their
courses." A scene is decorated once it is built and checked, in passes, each looked at in stills before the next:

1. **Place.** Mist and flora that the place and the hour have. Mist as mountain mist lies: a sea of it in the
   valleys at dawn (`mistSea`), bands along a slope (`mistBand`), drifts at a mountain's foot and over the fields
   (`mistDrift`), thinning as the sun climbs; the opening of the film of the creature starts inside a fog that
   sinks over its first twelve seconds. Mist that lies behind a house goes between the far sheet and the house
   (the yard's `maengYardAt(t, night, glow, behind)` draws `behind` there). Flora painted on a set's sheets costs
   nothing a frame.
2. **Life.** What lives there at that hour, each on a course (`decorate.js`): by day the yard's rooster and hens,
   a flock across the sky, a blue magpie in the meadow's tree; at dusk a hornbill over the mountain and a flock
   going home to roost; on the slope a sunbird at the ferns; at night, in the hut, two mice and a tokay on the
   wall; at the palace a magpie on the tip of the roof's finial that flies off when the gong is struck.
3. **Look and check.** Stills of each scene at its moments; `checks/ghost.py` for each course (its spacing is its
   pace); `checks/seek_check.py` (a course is worked out from the second alone); `kit_check.py maeng/sNN.html`.

The rules the first round taught:

- **The line's feeling rules the life.** Nothing moves through a death (scene 2's night, scene 4's grief); the
  morning after it there is one hen alone, and no flock. A mouse that listens sits up while the father speaks,
  and is gone before his son weeps.
- **Life stays out of the way.** Clear of the people, of the path they walk and of the lines' subtitles (the foot
  of the picture, about 900 to 1015); a bird crosses a sky in the quiet between two lines, not over one.
- **Life is seen where the scene is lit.** In the hut the lamp's reach is the stage: an animal beyond about 450
  of the lamp is lost in the dark that the scene lays over everything.
- **Small animals are drawn a little larger than life**, as a cartoon draws them: the mice at 0.8 and the tokay
  at 1, in the hut whose people are drawn twice the yard's size.
- **One thing does one thing.** A bird perched on a finial flies at the gong; a mouse bolts at "crunch, crunch!".
- **A course is a row of stops** [second, x, y, what]; "hide" keeps it unseen until the next stop, and a stop that
  hides through a gap (a scene's days going by) gives its own place again, or it is drawn moving between them.
- **A layer must be one the scene draws.** An entry with no layer is "front": a scene that calls only
  `decorate(t, life, "back")` never draws it (the first hornbill and sunbird were lost that way).
- **What a scene's camera does not show is not decorated**: scene 7's close shot never shows the hut's wall,
  so its tokay was left out there.

## What hangs, sways (2026-10-16)

The owner: "Look at the flags and lanterns and if they are hanging give them a sway function. I notice
the one with the yellow rooster at the top has a swaying stick but the flag doesn't sway. I'd prefer
the stick not to sway or barely at all." (The "rooster" is the hong on the tung by the house.)

| What hangs | Before | Now |
|---|---|---|
| The tung's cloth, `tung(brush, x, base, t, crowned)` | given t, its six panels each waved on its own, 7 to 15 px three times a second, so they came apart; the pole still | given t, the cloth hangs from the pole's tip and sways as one strip, the pole and the hong still (below); without t, drawn as before |
| The tung by the house in `sash.html`, `villageTung()` | the whole tung leaned 1.2 degrees about its foot, pole and hong with it, the cloth frozen at the kit's wave of second 0 | no lean: `tung(pen, x, 905, T, true)` on the film's clock, so the cloth's sway goes on across the cut from the cloth to the lane |
| The rope of nine khom over the `market` backdrop | painted into the picture: still | each swings from its tie, 0.07 and 0.025 radians of two slow sines, each in its own time |
| The two lines of flags at the `monastery` backdrop | painted into the picture: still | the line breathes 3 px; the foot of each flag swings 4 and 1.5 px, each a little behind the one before |
| The tung in the cartoon maker | a set piece, painted once on the scene's sheet: still | drawn every frame (`SWAYS`, `swayCode()`), among the movers by where it stands |
| `khom()`, its string and poles in the hero film, `khomPhat`, `khomDao`, `khomBua`, `tungYai`, `tungSaiMu`, the sand pagodas' flags | already swayed | as they were |

**The cloth of a tung.** At a depth d down the cloth (0 where it is tied, 1 its foot) it is moved
sideways by `14 * breeze(t - 0.8 d) * d^1.3 + 2.5 * sin(7 d - 2.4 t) * d`, where `breeze` is three slow
sines (1.1, 1.9 and 3.1 radians a second, at 1, 0.5 and 0.25: a gust comes and goes in about six
seconds, never twice alike, as `khomBreeze()` does for the khom's tail). So the foot swings about 20
px each way at the strongest, a little behind the top, with a faint ripple down the cloth. Each of the
six panels is a stretch of that one strip, its top edge where the panel above it ends, so they move as
one cloth.

**A backdrop's hanging things.** `BACKDROP_HANGING` holds a painter for what hangs in a backdrop
(market, monastery), given a brush and the second t; without t it draws them at rest. `backdrop(name)`
paints them at rest into its picture, as it always did: all nineteen still pictures are the same to
the byte as before (each painted by the old and the new `backdrops.js` and compared over every byte),
so no film or page that uses them changes. `backdrop(name, true)` is the picture without them (kept
apart, under its own key), and `backdropSway(name, t)` draws them swaying on the kit's sheet, over it;
the cartoon maker does both for a picture that has anything hanging in it.

**Left as they are.** The tung woven into the sabai's cloth (`sabai.js`, `tung(b, 0, 0, 0)`) is a
picture in the weave, drawn once at second 0: it takes the new cloth's shape at that second (a gentle
curve where it had a zigzag) and does not move. Two tung on the dusk set of `sash.html`
(`paintTempleFront()`) are painted but drawn by no scene since the temple scene went. `backdrops.html`
shows the still pictures.

## The highlands: terraces, forest and mist (2026-10-17)

The owner: "spend some time on the framework and make some background decorators - terraces that look
like rice fields cut into mountain slopes and forest/jungle in Thailand and mist effects for valleys and
mountains." They are `highlands.js`, a module beside the kit with its sheet `highlands.html`. The rules
heading each part were read from thirteen photographs on Wikimedia Commons under free licences (the
terraces of Mae Klang Luang and of Mae Chaem, dry-season fields of a Karen village, the forest of Doi Pui
and of Khao Sok, a bamboo grove, and a sea of mist at sunrise from a mountain garden in the north), kept
with their credits outside the repository; nothing of them is copied.

| What it is | In the code | Numbers |
|---|---|---|
| Terraces | `terraces(brush, x, top, wide, tall, look)`: benches between contour lines that bow up into a gully and down over a spur, more the lower they are; each band a paddy under a darker step, lightest at its lip, a line round it; thinner up the slope; each bench ends at a place of its own and tapers to a point; small crowns at the ends; `hut` puts `fieldHut()` on a bench. It gives back `lip(k, x)` to stand someone on a bench | `season`: `green`, `gold`, `water` (the sky in it, pale streaks), `dry` (stubble); levels at `0.45v + 0.55v²` of the height; the bow `0.012 + 0.045v` of it |
| The forest | `forest(brush, left, right, base, look)`: a dark shade, the back of the canopy, tall trees, the front of the canopy, then bamboo and areca palms among it and bananas (the kit's `banana()`) at its foot. `far` (0 to 1) blends it toward `haze` and, past 0.4, leaves out the lines inside the crowns and the plants at the front; the belt comes down to the ground at its two ends | a tall tree's crown about 1.5 times the canopy's height; tints (new leaf, red leaf, flame of the forest, a tree in flower) on 1 crown in 40, a fifth of the way back to green |
| A mountain in forest | `forestSlope(brush, ridge, left, right, foot, look)`: crowns woven close over the whole slope, from the ridge (`small`, 7) to the foot (`large`, 26), the higher ones first so the nearer lie over them, and a row standing up along the ridge | one crown for every 0.7 of a crown's area, at most 5,000; tints on 1 in 80 |
| The pieces | `crown()` (lobes on a dome, the line drawn as every lobe a little larger, lit at the top), `tallTree()`, `bamboo()`, `areca()`, `fieldHut()` | |
| Mist | `mistSea(brush, t, look)`: rows of flat puffs on a level, drawn as `cumulus()` draws a cloud (line, fill, the lower arcs of some puffs inside) on a sheet of its own, then faded below with a `destination-in` mask and laid on; `layers` 3 lie higher and thinner the further back. `mistBand()` is one tapering band across a slope; `mistDrift()` drifts several across a box | the near layer drifts at `drift` (5) pixels a second, the far at 0.4 of it; a band breathes 5 per cent over 18 s |
| Between ranges | a film lays the far range's sheet, `mistSea({layers: 1})`, the nearer range's sheet, the valley's `mistSea`, and so on; `highlands.html` paints its four sets once and lays the mist between them each frame | |
| No jumps | measured as the largest change of any 10 x 10 block between one frame and the next, over the sheet's 480 frames: three jumps were found and mended. A band's swells were counted from its breathing length, so a swell came or went in one frame (14.8 against a median of 0.5); the inner arcs went on every other puff by its place in the list, which changes as the mist drifts (2.9); and a band leaving `mistDrift`'s box at x 1300 vanished there. Now the swells are counted from the length at rest, the arcs go by each swell's own number, and a band gathers over its first length of travel and thins over its last | now at most 0.9 in the valley (median 0.49) and 0.42 on the parts (median 0.35) |
| In the hero film | (owner, 2026-10-17: "add some items to the background of the hero video mountains", then "decorate all the mountains like that" and "add plants and flowers that are special to the different scenes"). `sash.html`'s `paintSet()` gives two sheets, `back` (the far and middle ranges, each clothed by `forestSlope` on its own ridge, `ridgeOf()` + `withoutTufts()`, under the old haze) and `front` (the near range, clothed, the ground and what stands on it); a scene lays the back, `hillMist()` (two `mistDrift`s: bands on the middle range's slopes, wider patches at its foot) and the pond's elephants, then the front. By day the middle range has `terraces()` with a hut where it stands highest in the part the set leaves open (`TERRACES_AT`); at night the forest is painted on its own sheet and laid at 0.3, as its crowns are lit by day. The rice fields' backdrop is laid whole, its two ranges clothed above the fields' edge (y 652), terraces on the near range's shoulder, the palms laid again in front, and the mist rises as the storm clears. Plants: a longan where the village's plain tree stood, marigolds and jasmine at the house's foot, a bougainvillea at the yard's edge; a mango on a bund of the rice fields; a frangipani at the night of dancing | a sea of mist the whole width at the fields' foot read as a ruled stripe: patches instead. The haze veil over the far ranges began whole at y 640 and drew a ruled line across the forest (row 639 to 640 changed six times as much as any other row of the set): it comes in over its first 40 rows now |
| Tried first | the mist as bands filled with a gradient: it read as stripes; the forest's crowns spaced apart with 1 in 25 tinted: polka dots; the tall tree with pale boughs fanned from one point: a lamp; areca leaflets as strokes: fishbones | |
