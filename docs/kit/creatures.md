# Creatures: the naga, the dragons, the beasts, the birds and the night

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## A Naga: a creature in a file of its own

The owner gave one drawing (2026-10-13): a five-headed Naga in black line on gold paper, from
Chiang Mai. `naga.js` is loaded after the kit and gives `naga(x, y, look)`. Nothing of the drawing
is copied: the file opens with what the drawing does, as six rules, and draws its own serpent in the
kit's manner, flat colour inside a fine dark line.

| Rule from the drawing | In the code | Numbers |
|---|---|---|
| Several heads, one body | `heads`: 1, 3, 5 or 7 necks fan out of one chest, the middle one the longest, the one furthest back drawn first | necks 180 to 236 long, from 0.58 rad back of upright to 0.8 rad forward |
| A head is a profile with a tall flame of a crest | `nagaHead`: a turned-up nose, teeth, a forked tongue, a beard, a crest of five tongues that step down the back of the head | crest 108 on a head 96 long (the drawing's crest is nearer one and a half heads) |
| The body narrows all the way, in an S and one loop | `NAGA_PATH`, 18 points, made a smooth line (`nagaLine`) with a point every 9; where it crosses itself the part nearer the heads is on top, because `nagaStrip` paints from the tail forward, four points at a time | half-width 37 at the chest to 11 at the tail |
| Scales, a belly band and a fringe run its whole length | `nagaStrip`, for the body and every neck: scales in rows that sit between each other, round edge to the tail; a ladder of bars on the belly's side, a quarter of the width; spikes on the back that lean to the tail | |
| Belts and a round flower cross it | the `belts` of a strip, drawn with the kit's `stripe()` | at 0.045, 0.2, 0.33, 0.47, 0.6 and 0.74 of the body |
| The tail ends in a flame | `nagaFlame`, five tongues that flicker | 96 long |

What the drawing cannot show is the movement: a wave runs down the body and is widest at the tail
(13 at the tip), the heads sway one after the other, and with `late` they nod on the beat and
`sing: true` opens the mouths on it.

**It can travel, by the rule of `procedural_animation.html`** (the owner: "The procedural_animation
page has some good code for doing the dragon"). Give it `trail`, the film's own function for where
its chest is at a time, and the body follows as that page's snake does: each point of the spine
turns to face the point in front, no more than `BEND` (π/14) from the way that one faces, and stands
`GAP` (14) behind it, 96 points long. A chain remembers where it has been, and a film must not: a
frame has to come out the same played or jumped into. So `nagaChain` lays the chain out straight as
it was ten seconds ago and leads it along `trail` from then until now, 300 steps, in every frame.
That costs time and buys a still that matches the film (`kit_check.py`: same 1 / 0).

```js
function swim(t) { return [-220 + 330 * t, 962 + 44 * Math.sin(t * 4.8)]; }
var chest = swim(t);
naga(chest[0], chest[1], {size: 0.5, heads: 3, trail: swim});
```

`naga.html` is the sheet: the five-headed one as the drawing lays it, one head in gold and ink, seven
in indigo, and one that crosses the sheet on a trail. Measured (2026-10-13): at size 1 it is 752
across and 501 high; one frame of it takes 16.9 ms with five heads, 13.0 ms with one, and 25.3 ms
on a trail; the sheet of four takes 41.8 ms a frame. A look has 13 names, in `NAGA_KEYS`, and a name
that is not one of them is warned about as the kit warns.

**Not done:** the heads are plainer than the drawing's (no ornament on the cheek, no jewelled
collar); every head is the same size; it has no hood; it lies in the plane of the picture, so it
cannot wind round a thing or climb a stair rail; a travelling one always shows its heads the way
`face` says, and does not turn round. Judged from stills only.

## A dragon, on the Naga's spine

The owner gave a second picture the same day ("Make a dragon like this"): a dragon among clouds in
the manner of the Tibetan and Bhutanese painters. `dragon.js` is loaded after `naga.js` and gives
`dragon(x, y, look)`, where `(x, y)` is its head. Nothing of the painting is copied; the file opens
with what the painting does, as seven rules.

| Rule from the painting | In the code | Numbers |
|---|---|---|
| One long body in arches, as thick as the head behind the shoulders | the spine is 17 points 52 apart in a straight line (or the chain behind a led head); `nagaLine` makes it smooth, and `dragonFlight` lays the arches over it, small behind the head and full from 0.19 of the body, travelling down it: for the led dragon too, since 2026-10-15 (owner: "make the whole body glide, not just the tail"; before, a led body was the chain alone, nearly straight) | arches 80 high, 12 radians over the body, 2.2 radians a second; half-width 45 at the shoulders to 10 at the tail, 32 at the neck |
| Dots, not scales; a belly of pink plates; a band of flame down the back | the Naga's own painter, `nagaStrip`, with a second skin (`c.skin: "dots"`): dots that are longer along the body and larger toward the back, a curved line across the belly at every point, a band of the flame's colour inside the back's edge, and taller points to it | dots 0.07 to 0.1 of the half-width |
| Taller flames rise from the back here and there | `nagaFlame`, at seven places, leaning toward the tail | at 0.1, 0.22, 0.36, 0.5, 0.63, 0.76 and 0.88 of the body |
| Four short legs, a tuft at each shoulder, a pearl in every paw | `dragonLeg`: the kit's `limb()`, dots down both bones, a pearl with a spiral, three toes with claws over it. The far pair is drawn before the body and a little darker; all four paddle | legs at 0.19 and 0.56 of the body; a pearl's radius is 29 |
| A round head, more a lion's than a snake's; a mane of long gold locks, whiskers | `dragonHead`: a high round skull, a step down from the brow to a short muzzle, a pink nose with two nostrils, a round eye with a yellow iris under a bushy brow, an ear, two fangs, and two horns, each a beam that sweeps back with a tine on it. `dragonLock` is one lock: a ribbon that narrows to a point and waves as it goes, so the hair streams | seven locks of 128 to 204; the head keeps 0.3 of the neck's slope |
| It breathes a scroll of flame | `breath`, 0 to 1: five flames that wave out of the mouth (`dragonFire`) | the longest 300 at 1 |
| The tail ends in long gold hair | five locks | 138 to 190 long |
| The tail undulates (owner, 2026-10-15: "make the tail undulate"; a sideways wave was tried on his word and dropped on his word, 35473e63 to 462c11c3) | `dragonFlight`, laid over the body's line after it is smoothed (`nagaLine` at 4, then `nagaWalk` at 9 again so the painter gets even points): a wave across the body that is nothing at the shoulders, grows as the square of the way from `from` of the body, is fullest at the tip and travels toward it | glide: 72 at the tip, 12 radians over the body, 3.2 radians a second, from 0.3 |
| Three manners of flight, `fly` (owner: "a hover mode and a fast mode where the animation style for the tail is really different"; the painters' postures 行龙 the travelling dragon, level, 升龙/降龙 rising and descending, 盘龙 coiled: Xinhua on the Forbidden City's dragons, Zhihu on dragon motifs on porcelain) | `DRAGON_FLIGHT`: **glide** (the default, 行龙): arches 80 and the tail's wave. **hover**: arches at 0.9 radians a second, the tail's wave 50 at 9 radians over the body and 1.2 a second, locks waving half as much again and streaming at 0.4, legs at half pace. **fast**: arches 25 and close (1.3 a point) at 7 radians a second, the tail's wave 28 at 22 radians over the body and 9 a second from 0.1 of the body, locks waving 0.45 and streaming at 2.4, legs at 2.2. `DRAGON_AIR` carries the locks' wave and stream into `dragonLock` for the dragon being drawn | sheet `dragon_flight.html`: the same dragon three times, 12 s |
| A corkscrew through the whole body (owner, 2026-10-15, after a tail corkscrew was built, placed in the pond scene four times and dropped: "add a corkscrew through the whole body") | in a glide, now and then, `dragonFlight` carries a short stretch of the body's line once round a circle, along the body and across it, which is nothing at the stretch's ends of itself, so the body makes a full loop and runs smoothly into it and out of it; the loop is large where the body is thick and smaller toward the tail. Drawn in ONE frame, the line's way at the loop's middle (each point's own frame smears it into a hairpin where the body bends), with no window (a window shrinks it to a kink) and the arches and the tail's wave held still through it. It starts behind the mane, at 0.2 of the body, and runs off the tip. The look name `corkscrew`: the seconds from one to the next (8 if unsaid), or a list of the clock's seconds at which one starts; the sash film's dragon has `corkscrew: [POND_AT + 4]`, one run of the whole body from the left of the sheet. `seed` (from `late` and `face`) keeps two dragons on the same period apart | radius 84 at the front to 50 at the tip, over 0.14 of the body; 3.6 s from mane to tip; two in the 12 s of `dragon_flight.html` |
| Long undulating whiskers (owner, 2026-10-15) | two `dragonLock`s from beside the nose, back and a little down, waving as they stream | 360 and 290 long, 13 wide, wave 58, turn 2.2 a second (were 150 and 116, wave 16) |

With `trail` (the film's own function for where its head is) it flies, and the body follows the head
as the Naga's does, by the chain of `procedural_animation.html`, 62 points long.

`dragon.html` is the sheet: the large one as the painting has it, among the kit's scroll clouds,
some behind it and some nearer; and a smaller one in other colours that flies across on a trail.
Measured (2026-10-13): at size 1 it is 1077 across and 349 high; one frame takes 11.8 ms where it
stays and 14.0 ms on a trail; the sheet of two, with nine clouds, takes 46.4 ms a frame. A look has
16 names, in `DRAGON_KEYS`. `nagaStrip` draws the Naga as before with the second skin in it: its
sheet came out the same but for one pixel in two frames, and three more loads of the same code
differed from each other by 0 to 2 pixels.

The first head was a blunt box with no horns, and was named as the weakest part of the day's work;
the owner: "Fix the weak part." It was drawn again as the row above has it.

Then it was modelled, inside its own line: light on the cheek and on the top of the muzzle, shade
where the back of the skull turns away and under the brow and the muzzle, three folds behind the
nose, the line of the upper lip.

**Not done:** the flames of the back are points, where the painting's curl; the mane hides the neck and most of the
near front leg; the clouds are the kit's, flat under and blue-grey, not the painting's scrolls all
round; it does not turn round, and it does not wind through the clouds. Judged from stills only.

## An elephant and a water buffalo

The owner (2026-10-13): "Make an elephant and a water buffalo." `beasts.js` is loaded after the kit
and gives `elephant(x, y, look)` and `buffalo(x, y, look)`, where `(x, y)` is the ground under the
middle of the animal. No picture was given for these two: they are drawn from what the animals are.

| What the animal is | In the code | Numbers |
|---|---|---|
| The elephant of this country: a high domed head with two bumps, small ears, a back highest in its middle, legs like columns, round feet with pale nails, tusks | the body is one curved shape; the head turns a little about the neck; an ear that flaps. Drawn again the same day: see "The elephant, drawn again" below | at size 1, 1084 long and 808 high |
| Its trunk hangs in a long curve and curls at its tip, and it can lift it | a row of 17 points, each 26 on from the one before and turned a little more, its last five turned in. `trunk` (0 to 1) turns the first five the other way by half a radian each and the rest by 0.12, so it rises close before the face, and its end curls forward. `elephantTrunk` paints it for both views | half-width 50 at the face to 13 at the tip |
| It may be dressed | `cloth`, a colour: a cloth over the back with a gold border and a fringe, a cloth on the brow, and bands of gold on the tusks. `howdah: true`: a seat of wood on its back, and the seat it gives back is then in it | |
| The water buffalo: a barrel of a body on short legs, the withers higher than the hips, the head carried forward and low, two great horns that sweep back along the neck and up, cloven hooves, a pale band under the throat | the neck is painted with no line where it joins the shoulder; `rope: true` is a rope through the nose | at size 1, 752 long and 496 high |
| Both walk one foot at a time: the hind foot of one side, then the fore foot of that side, then the same on the other | `beastFoot`: a foot is on the ground for 0.62 of its stride, going straight back, and in the air for the rest, coming forward along an arc. The four feet are a quarter of a stride apart. `beastLegs` draws each leg with the kit's `limb()`; the far pair is drawn before the body and a little darker | an elephant's foot reaches 120 and lifts 26; a buffalo's 84 and 24 |
| Someone can ride | each gives back `{seat, head}`, points of the scene: `var b = buffalo(...); person(b.seat[0], b.seat[1], cast("boy", {floor: "astride"}))` | the seat is on the elephant's neck, behind the ears (113 before its middle and 712 up at size 1), and on the middle of the buffalo's back |
| Each can come toward us | `front: true` is another drawing (`elephantFront`, `buffaloFront`): the head before a round body, the elephant's ears spread and its trunk down the middle, the buffalo's horns a crescent to each side; the fore feet lift in turn | a lifted fore foot rises 46 on the elephant and 36 on the buffalo |

`size: 1` is as large as the animal is beside the cast at their own sizes: the elephant half as
tall again as a person, the buffalo's back at a person's chest. A look has 17 names, in
`BEAST_KEYS`: these two read 13 of them. `beasts.html` is the sheet: an elephant walking, one walking toward us, and one
standing in a red cloth with its trunk lifting and a fellow astride its neck; a buffalo walking
with the little boy astride its back, one walking toward us, and one standing on a rope beside the
little girl. Measured (2026-10-13): one frame of the first elephant took 11.3 ms and of the buffalo
6.0 ms; the elephant as it is now takes 9.1 ms from the side and 4.4 ms from the front.
`kit_check.py`: `beasts.html` draws, same 1 / 0, 21.4 ms a frame, and `elephant.html`, same 0 / 0, 26.6 ms; the six pages that load `beasts.js`: 6 pages, 0 failures.

### The elephant, drawn again (2026-10-13)

The owner: "Work on improving the elephant". It was drawn large and looked at, from the side, from
the front and in six moments of its walk, and what was weak was written down before anything was
changed. No picture was given: the rules are what an Asian elephant is.

| What was weak | The rule now | Numbers |
|---|---|---|
| The legs read as trouser legs: each ended in a flat slab like a shoe, with a line across the ankle | a leg is a column that spreads to a round pad. The pad is filled whole and inked only round its sides and its sole, so no line parts the foot from the leg. A fore foot shows four nails and a hind foot three, and the knee has two folds | half-widths 57 at the top, 48 at the knee, 45 at the ankle; the pad 59 |
| A round shape stood under every foot, below the ground | it was the round end the kit's `limb()` gives a bone. The ankle is now as high as that end is wide, so the end stands on the ground and the pad covers it | ankle 46 up, where it was 22 |
| Each near leg had a round cap on the body, like a pipe stuck on | the body's colour is laid back over the top of each near leg, inside the body's own line, and the belly's shade is laid after it: the leg comes out of the shoulder or the hip. The fade ends in the body's own colour with no opacity, not in clear black, which left a dark band | all of it down to 0.62 of the way, none by the belly |
| The head was small and plain, level with the back | larger and carried higher than the back; a brow, a hollow at the temple, freckles where the trunk begins; an eye with a heavy lid, lashes and folds (`elephantEye`); an ear whose top folds over and which narrows to a lobe with a pink, freckled edge; tusks that go forward and down and up again at the point | the top of the head is 803 up at size 1, where the whole animal was 754 |
| The trunk was thin, and lifted it went straight out before the face | thick where it leaves the face, with rings that bow toward the tip and a finger on the tip. Lifted, it turns up in its first five points and its end curls forward; the head tips back with it and the mouth opens | the head tips back 0.14 of a radian |
| It had no mouth to open | the lower lip is a piece of its own behind the trunk, and the skull has none: `mouth` (0 to 1) drops it, and so does a lifted trunk, by 0.7 of the lift | |
| The body was one bean | a line down from the withers to the fore leg and one down from the hip to the hind leg, folds on the flank and under the belly, a little light along the back, a brush of hair on the tail | |
| From the front it was made of rectangles, with ears like two round plates and a trunk like a board | columns of legs that narrow above the foot and spread to a pad with nails across it; the fore legs have no top and take the chest's colour where they leave it; ears wide at the top that narrow to a hanging lobe; a head wide at the cheeks and narrow where the trunk begins; the trunk grows out of the face with no line across its root; tusks that go out, down and in; the cloth shows at each side behind the ears | 807 wide and 820 high at size 1 |
| The rider sat on the ear | the seat is behind the ears, where a mahout sits | |

`beastTube` gives the two edges of a tube that narrows along a row of points; `elephantTrunk` and
`elephantEye` are shared by the two views. A trap met on the way: a variable named `light` inside
`elephant()` hid the kit's own `light()`, which the foot's painter calls, and the page stopped.

### The elephant, a second round (2026-10-13)

The owner: "Work on improving the elephant some more". It was looked at large again, and what was
still weak, or not there at all, was written down first.

| What was weak or missing | The rule now | Numbers |
|---|---|---|
| The trunk still looked hung behind the face: the line of the face ran across its root | the trunk is drawn over the skull with no line across its root, and its front edge begins where the brow's line ends, so the brow runs on into the trunk. Its other edge has no line for its first four points, where it is under the cheek. `elephantTrunk(points, wide, thin, colour, open)`: `open` left out is a line all round; `true` is none across the root; a number is that and how many points of the first edge are bare | |
| It never blinked, and in a walk only its legs moved | it blinks (`elephantEye(ink, shut)`: the lid comes down over the eye); in a walk the head nods twice in a stride, the trunk swings and the ears flap with the steps | the nod is 0.025 of a radian |
| It could not get down for someone to climb on | `sit: true` lays it down: all above the legs is 196 lower; the hind leg is folded, its knee forward on the ground and its foot out behind; the fore leg goes down to an elbow on the ground and is stretched out before it, the pad turned to face forward. The joints are given to `limb()`, not solved. It does not walk. From the front it is the same drawing lowered, on two short stumps | lying, 1179 long and 544 high at size 1; its seat is 448 up, where standing it is 712 |
| A trunk that reached the ground went on under it | what reaches the ground lies along it, and its end lifts. This is what the trunk of one that lies does | |
| Its dress was a back cloth, and from the front two flat pieces | `cloth` dresses it: the back cloth as before, a cloth on the brow from the top of the head to where the trunk begins, with a gold edge and a tassel, and two bands of gold on each tusk (`elephantRings`, clipped to the tusk). From the front the brow cloth comes to a point between the eyes, with a gold boss | |
| It had no howdah | `howdah: true`: a cushion, a sill, three posts with gold caps and a rail on them, a high back, and two girths round the belly, inside the body's line. The seat it gives back is on the cushion, for one who sits `floor: "cross"`. From the front its back stands up behind the head, and the seat is above the head, so the one who rides is seen over it | a howdah's seat is 799 up at size 1 |

`elephant.html` is the sheet: walking; dressed, with a howdah and a lady in it, the trunk lifting;
lying down with a fellow astride its neck; and the same three from the front.

**Not done:** they are seen from the side or from the front, with nothing between, and never from
behind; the trunk does not pick anything up or spray; the elephant lies or stands, and does not get
down or get up between the two; the one who rides is drawn after the elephant, so a howdah's rail
is behind their legs and not before them; from the front only the back of a howdah shows; there is
no bell or rope at the neck, no plough and no cart; the buffalo does not lie down or wallow. A walk
is the only gait. The elephant has no calf of its own shape: a small one is the same drawing.
Judged from stills only.

## A cat and a tiger

The owner (2026-10-13): "Add a siamese cat and tiger sprite", with two pictures: a Thai drawing of
two leaping tigers in black line on gold paper, with writing between them, and a Thai picture of
three cats in a room, a pale one with dark points sitting on a chair, a white one reaching up and a
dark one stretching. Neither picture is in the repo and nothing of either is copied; the writing in
the tiger drawing is no part of this. `beasts.js` gives `cat(x, y, look)` and `tiger(x, y, look)`.

| What the picture does | In the code | Numbers |
|---|---|---|
| A cat and a tiger are one animal in two sizes | one function, `feline(kind, ...)`, and two rows of measures, `FELINES` | cat: scale 0.3, a body 0.9 as long, standing 52 lower on legs 0.76 as long, head 1.18. Tiger: scale 0.9, a belly that hangs 26 lower, head 1.15 |
| The Siamese: a pale body with dark points (the face, the ears, the legs, the tail), blue eyes, large pointed ears | the mask is a round gradient of `points` clipped to the head, darkest at the nose. `limb()` paints a leg one colour, so the body's colour is laid back over the top of each near leg, inside the body's outline (`bodyOver`: all of it at the top, none by the belly): a leg is dark only below | body `#efe2c8`, points `#4a3226`, eyes `#5fa8d8`; an ear 70 high |
| The other two cats are one colour each | `colour` with no `points` is a cat of that colour all over; `eyes` is the colour of the eyes | the sheet's: `#f6f1e6` and `#3f4a5c`, eyes `#e9c45c` |
| The tiger's stripes are bold and curved and lie close, each thick at the back and running to a point | `stripes()`: pointed shapes clipped to the body, to the neck and to the sitting body, with a shorter one up from the belly after every second; rings across each leg and on every second piece of the tail; a pale belly, throat, chest and muzzle | stripes 30 to 38 apart; a leg's rings 26 apart; body `#e2892b`, stripes `#1f1a1a`, pale `#f6ead0` |
| A tuft like a small flame at each joint | `beastTuft`: three points. Gold ones at the shoulder and the hip (`tufts: false` leaves them off), a pale one for the ruff of the cheek | 54 long |
| A long tail that curls at its end | a row of 11 points, each 26 on from the one before and turned a little, the last three turned more. A cat's is held up and hooks forward; a tiger's hangs, sweeps back and curls up. It sways | half-width 12 to 6 on the cat, 16 to 9 on the tiger |
| They walk | `step`, with the `beastFoot` and `beastLegs` of the elephant. `beastLegs` now also tells the foot's painter where the knee and the hip are: that is how a tiger's legs get their rings | a cat's foot reaches 86 and lifts 24; a tiger's 112 and 30 |
| They sit | `sit: true` is another outline: the haunch on the ground, the back rising to the shoulders, the fore legs straight, the tail along the ground round the feet with its end lifted | |
| They mew and roar | `mouth`, 0 to 1: the lower jaw turns down by 0.85 of it, the inside is red, there is a tooth above and one below, and the head tips back by 0.2 of it. The lower jaw is a piece of its own behind the skull, turning about the corner of the mouth, and the skull gives up its own chin as the mouth opens: its lower edge rises to the upper lip. The owner saw two jaws on the first version ("The tiger's jaw opens but there is a second still jaw on top of it", "Same with the cat"): the skull had kept its chin over the jaw that dropped | the skull's chin is gone by `mouth` 0.15 |

Measured (2026-10-13), at size 1: the cat is 179 long and 147 high with its tail up, and sitting 109
by 148; the tiger is 738 long and 370 high, and sitting 322 by 392. Beside them the little girl of
the cast is 298 high and the lady 491. One frame of the cat takes 2.1 ms and of the tiger 4.3 ms.
`kit_check.py felines.html beasts.html`: both draw, same 1 / 0, 28.2 and 26.1 ms a frame, no
warnings. `felines.html` is the sheet: above, at twice its size, the Siamese walking and sitting
with a mew, a white cat sitting and a dark cat walking; below, a tiger sitting, walking and roaring,
with the little girl and a cat beside it at the same size.

**Not done:** a walk is the only gait: neither runs, leaps, pounces, climbs, lies down or stretches,
and the cat does not reach up as one in the picture does. They are seen from the side only: `front`
does nothing for these two. Every tiger has the same stripes. There is no kitten and no cub. A
tiger gives back a `seat`, and nobody has been set on it. Judged from stills only.

## A pig

The owner (2026-10-13): "Add a pig sprite and traditional Thai food icons." `beasts.js` gives
`pig(x, y, look)`. No picture was given: it is drawn from what a pig is.

| What a pig is | In the code | Numbers |
|---|---|---|
| A barrel of a body low on short legs, a round rump, a belly that hangs | one curved shape, darker toward the belly; legs and walk are the `beastFoot` and `beastLegs` of the elephant | at size 1, 406 long and 208 high (the lady is 491 high) |
| A big head carried low, a flat round snout with two nostrils, a small dark eye, an ear that flops forward | the head turns a little about the shoulders; the ears flop, and the far one is darker | |
| It opens its mouth | `mouth`, 0 to 1. The skull is drawn with no chin: the lower jaw is always a piece of its own behind it, turning about the corner of the mouth by 0.6 of `mouth`. This is the rule the cat and the tiger were mended to, built in from the start | |
| Cloven trotters, a tail in a curl | two small dark toes; the tail is one turn and a half that winds tighter, drawn fat in ink and then in colour as a hose is, and it wags | |
| Pink, or black as the hill villages keep them, or patched | `colour` (pink `#eeb2a6` unless told); `points` is the colour of patches on the back and the head, clipped to the body and the skull; `eyes` | |
| It walks from place to place | `amble("pig", t, from, to, start, look)`: `GAITS.pig` | a foot reaches 66 and lifts 18; a stride takes it 85 at size 1, in 2 beats |

It reads names `BEAST_KEYS` already had: `size`, `face`, `step`, `colour`, `late`, `mouth`, `eyes`,
`points`. `pig.html` is the sheet: a pig walking, a black one that grunts, one with patches, and a
sow who walks across and back with three piglets behind her (a piglet is `size: 0.42`; its stride is
shorter, so its `step` is how far she has gone counted in its own strides), with the little boy at
his own size. Measured (2026-10-13): one frame of the pig takes 2.0 ms; `kit_check.py`: `pig.html`
draws, same 2 / 0, 26.3 ms a frame.

**Not done:** it does not sit, lie down, wallow or root with its snout in the ground; it is seen
from the side only; a piglet is a small pig and not a piglet's own shape; there is no boar with
tusks and no bristles. Judged from stills only.

## A beast's feet on a slope (2026-10-15)

The owner: "work on the elephant's feet in the model so when it goes up and down a movement curve
the feet look like they angle up or down to account for it." A beast walked a course that rose or
fell with its feet flat and level, so they slid. Now `beasts.js` reads a look name **`slope`**
(radians: above 0 the ground falls away ahead of it, as when it walks down the picture; below 0 it
climbs), and `beastLegs()` does two things with it: the ground under each foot is where the sloped
line is at that foot (`tan(slope) · x` added to the ankle's reach, x forward from the body's
middle), so the legs ahead reach lower on a fall and higher on a climb while the body stays level,
as a walking animal's does; and the foot is told a turn of `slope` (plus the 0.2 of a lifted foot),
so the elephant's pad is pitched to the ground, toes down a fall and up a climb. The buffalo's
hooves follow the ground's height but are not yet pitched (its `foot` takes no turn). A film walking
a beast along a path `y = ground(x)` gives `slope = atan((ground(x + 1) − ground(x − 1)) / 2) · face`;
`amble()` is unchanged (it walks a level line). Sheet: `elephant.html`'s first lane, the ground
tilting under it, down ahead and then up, by `0.32 · sin(πt / 6)`, a line drawn through the feet.
Without `slope` nothing a page draws changes. Eighteen beast names.

**Then (owner): "Angle the body down a little on the down slope so its feet touch the ground a bit
more firmly."** The elephant's body now pitches with the ground (`pitch`), about a point in its
middle (`PIVOT`, −400 in its own frame): the leg joints are turned with it (`legsNow`), so the legs
hang from the pitched body and still reach the sloped ground, and `pitched(on)` turns the body's
frame for the tail, the body, the head and everything drawn above the legs, and back for the near
legs, which stand on the ground. Lying, no pitch. First tried as a third of the fall and a fifth
of the climb; the owner: "The feet still aren't touching the line on the down walking elephant."
They were not: an elephant's legs are columns of one length (`limb` reaches at most the two bones
less one), and on a fall the ground under the fore feet drops by more than a leg can stretch, so
they stopped short and floated. **The body follows the whole slope** (`pitch = slope`), as a
quadruped's spine does on a hill; then the joint-to-ground distance is the same at every leg and
every foot lands on the line, seen at the fall and the climb on the sheet. **And then (owner): "The
elephants front feet don't touch the ground when it's walking down."** Standing they did; in the
walk, a fore foot at the front of its stride reaches 60 forward as well as down the slope, and that
is farther than the two bones span (`limb` stops at `upper + lower − 1`; on the flat the extreme is
261 of 263, so the slack was 2). On a slope `beastLegs` now measures the distance from the joint to
the foot's ground and, when it is more than the bones span, draws both bones longer by that ratio
(`stretch`), so the leg reaches: an elephant's legs are columns, and a stretch of a tenth does not
show. On the flat `stretch` is 1 and nothing changes. Checked through the stride at six moments.

**Elephants far off in the hero film's pond (owner, 2026-10-15: "Add an elephant to the pond scene
in the hero video and also have the man stop before he gets into the water. Add a baby elephant
too. They should be far off in the background partially obscured by a banana tree grove").**
`sash.html`'s `pondElephants(t)`: a cow (size 0.09) and her calf (0.052, `tusks: false`) `amble`
along the middle range's ridge (`ridgeAt`, the same ridge the dusk scene's elephant walked), right
to left over the pond's far side, the calf 0.7 s behind; four banana trees (`banana()` under a
scale of 0.4–0.5) stand on the ridge at 1040–1270 of the old sheet, drawn over them so they show
between the stems. All of it is drawn on a sheet of its own (`FAR`, the kit's `pen` swapped for its
length) and veiled there with `source-atop` at 0.4 of the set's haze colour, over the figures alone:
a veil painted on the film in a rectangle doubled the set's own haze and showed as a pale box, and
the group first stood at 1290–1540, right behind the fellow's head. The fellow now strolls from
1600 to 1330, short of the water's right edge at 1280, instead of into it.

**On the hill's line, not on its grass (2026-10-17).** First the owner: "When the elephant is walking
down the hill its front feet are in air": the kit's elephant pitches with `slope`, and the film gave it
none, so the film fitted a straight line to the ridge under each beast's length and gave it that line's
angle. Then: "it pops up into the air a couple of times while walking down the hill. It should maintain
course along a line." Each beast still stood on `ridgeAt(x)`, the ridge's first painted pixel, and the
tufts of grass `hills()` draws along the ridge (7 to 13 pixels tall, up to 15 wide) lifted that pixel:
as the cow walked over a tuft she rose by 6 to 13 pixels in one frame, rode along its top for half a
second and dropped. Now `GROUND` is the ridge with its tufts taken off (a closing: each column lowered
to the lowest of the ridge within 9 columns, then raised to the highest of that within 9, so what is
narrower than 19 columns goes and a straight or gently curved ridge comes back as it was), and
`ridgeLine(x, face, half)` fits one straight line to `GROUND` under the beast, each sample at its own
column, and gives both where the beast stands and its slope. Over the scene's 450 frames the cow's
largest change of height in a frame went from 13 px to 0.69 (the walk down the hill) and the calf's from
10 to 0.33; the largest change of pitch in a frame from 0.036 to 0.017 radians for the cow and from 0.086
to 0.035 for the calf. Leaving out the samples above the line instead (fit, drop, fit again) was tried
first: at the end of the window a tuft tilted the first fit toward itself and stayed in, and the pitch
still jumped as it left.

## Three creatures of the myths of Lanna

The owner (2026-10-13): "Add mythical creatures specific to Lanna Thailand." The kit had a Naga and
a dragon of the Himalayan paintings. Three were chosen because each is the north's own and each has
a work in the north that can be looked at. `myth.js` is loaded after `naga.js` and `beasts.js`.

**Where each is from.** Nothing is copied. Each was read by eye from one photograph on Wikimedia
Commons, and from what is written of it.

| Creature | What is written of it | The work it was read from |
|---|---|---|
| The Mom (ตัวมอม), `mom(x, y, look)` | a creature the craftsmen of the north made up, seen as sculpture at the temples of the upper north, at a stair's foot or a gate; it is told that it is the mount of Pajjunna, the god of rain, and was carried in a procession to ask for rain; mixed of a lion, a cat, a dog, a monkey, a gecko and a lizard, with long arms and a long body, no two craftsmen making it alike (Silpa Wattanatham). One writer holds that the name "singha mom" is not found in old Lanna (Matichon Weekly): so "it is told" | the Mom at the stair of Wat Phra That Doi Suthep, Chiang Mai: photograph by Photo Dharma, CC BY 2.0 (`File:013 Mom (9205083869).jpg`) |
| The Luang (พญาลวง, ตัวลวง), `luang(x, y, look)` | the dragon of the Tai Lue and of Lanna, often taken for a Naga: four legs, wings, ears and horns (Royal Park Rajapruek); a deer's horns, a snake's body, a fish's scales, a hawk's or a dragon's feet, and plainly wings; its name from the Chinese for dragon; lightning that plays in the clouds without thunder is "luang len fa", the Luang playing in the sky (Matichon Weekly); mixed of five animals of good omen (Chiang Mai Design Week 2025) | the gilded carving in the museum of Wat Phra Kaeo, Chiang Rai, whose label calls it a mix of elephant, horse, deer, swan and fish: photograph by Iudexvivorum, CC0 (`File:Wat Phra Kaeo, Chiang Rai - 2017-06-27 (044).jpg`) |
| The Hatsadiling bird (นกหัสดีลิงค์), `hatsadiling(x, y, look)` | a great bird of the Himavanta forest: a bird's body and an elephant's head, a trunk for a beak, tusks, a swan's tail, the strength of several elephants; in the north a tower in its shape carries the body at the cremation of a revered monk or a ruler; in the legend of Lamphun it brought the conch shell by which the city was laid out (Thai Wikipedia; Khaosod) | the bird made at Wat Chedi Luang, Chiang Mai, in 2010: photograph by Takeaway, CC BY-SA 3.0 (`File:Chan Kusalo cremation 01.jpg`). Here it is the bird alone and carries nothing |

**What each work does, kept as rules.**

| Creature | Rules | How it is built |
|---|---|---|
| Mom | low and stout on four bent legs with claws, the fore legs longer; scales all over, each with a pale edge; a broad head, a great round eye in a ring of gold under a heavy curled brow, a mouth full of teeth, a fin on the cheek, a mane of five curls; a row of nine small flames down the back and one at the end of the tail | the beasts' `beastLegs` twice (the hind legs with bones of 66 and 62, the fore with 76 and 70); the jaw is a piece of its own that turns about the corner of the mouth, as the pig's and the tiger's |
| Luang | a long body in scales that narrows to the tail; the tail ends in a tall flame; four legs, each a hoof with a tuft over it; a wing of five long feathers at the shoulder; a snout that turns up at its tip as a trunk does, a deer's antlers, two long whiskers, teeth, a flame of a crest | the dragon's plan: the Naga's `nagaChain` when it has a `trail`, `nagaLine`, `nagaStrip` for the scaled body with its belly band and the spikes of its back, `nagaFlame` for the crest and the tail; its own head (`luangHead`) and leg (`luangLeg`) |
| Hatsadiling | a great round body in scales of feathers on a bird's two legs; a thick neck with a collar of three bands; a dark elephant's head with a hanging trunk, two tusks and a flame of gold on its crown; a wing along its side with a round flower at the shoulder; a tail that stands up in a fan of five great flames, each with a border | the trunk is the elephant's own (`elephantTrunk`, `elephantEye`); the legs are the kit's `limb` with the joint pointing back; a walking foot is `beastFoot` |

Three painters serve all of them: `mythScales(shapeOf, left, top, right, bottom, r, colour)` (rows
of the lower halves of circles inside a shape, all in one stroke), `mythFeather(long, wide, curl,
colour, border)` (a flame of a leaf with a border and a rib, for a wing, a tail, an ear) and
`mythTube(points, wide, thin, colour)`. `GAITS.mom` and `GAITS.hatsadiling` are added to the
beasts' table, so `amble("mom", ...)` walks one with feet that do not slide.

**The look.** `MYTH_KEYS`: `size`, `face`, `late`, `mouth`, `colour`, `gold`, `belly`; `step` (the
Mom and the bird); `eyes` (the Mom); `trail`, `depth`, `sing`, `horns`, `wings` (the Luang; the
bird's wing too); `fly`, `head`, `trunk` (the bird). The Luang's (x, y) is its head, as the
dragon's is. The bird's is the ground under it, also when it flies: the place it would stand.

**In the maker.** Its palette offers the three as things: 🦁 มอม, ⚡ พญาลวง, 🦚 นกหัสดีลิงค์. The
Mom walks while its course moves it; the Luang is led as the dragon is; the bird flies when its
point is above y = 800 and walks below it. Each has parts a child can colour. The page and the
exported page load `beasts.js` and `myth.js`, and the prompt for a model says what each is.

**Traps met on the way.**

- A turn of the pen is clockwise on the sheet: the bird's lifted wing was turned by a number below
  0 and pointed at the ground. Feathers that point back lie at an angle of pi, and a little more
  than pi is up.
- The fin on the Mom's cheek was drawn before the skull, which then covered it: nobody saw it. A
  thing that lies on another is drawn after it.
- `mythScales` crosses the shape's own line, so the shape is made again afterwards for its line (as
  after `roofTiles`).

`myth.html` is the sheet. `kit_check.py myth.html`: 1 pages, 0 failures; draws, same 12 / 1, 32.6
ms a frame. In the maker: every button of the palette dragged onto the stage with the mouse, 63
buttons, 69 lines, all held; a film with the three on courses (the film's code, a colour for a
part, the model's prompt, the film's own page drawn at three seconds, no warning): 9 lines, all
held; a frame of that film takes 91.5 ms.

**The bird left the maker (2026-10-13, the same evening).** The owner was told that in the north
the Hatsadiling is known above all from the cremations of revered monks and of rulers, and asked
whether it should stay out of a children's maker; the answer was "yes". It is out of the palette,
the colours, the film's code, the prompt for a model and the help, with the reason written beside
`THINGS` as the monk's is beside `CASTS`. The kit keeps it: `hatsadiling()` and its place on
`myth.html` are as they were, for a film written by hand. The maker offers two of the three, 🦁 มอม
and ⚡ พญาลวง. A film that names the bird is taken without it, and says so; and a film kept in the
browser from before comes back without it, because `load()` now leaves out any thing the page does
not offer (until then a kept film was taken as it was). Checked in the browser: the bird is in no
list and on no button, a model's film and a kept film both lose it and draw, the Mom and the Luang
are untouched, 10 lines, all held; every palette button dragged again, 62 buttons, all held; the
backdrops' check, 38 lines, and the grandmother's, 6, all held. Read "In the maker" above with
that in mind: what it says of the bird there was true for one commit.

**Not done.** The Singha at a gate, the Makara that lets a Naga out of its mouth, the Hong, the
Kinnari of the Tai Yai dance and the To are not made. Each of the three was read from one work, and
a Mom above all is made differently by every craftsman: this is one Mom, scaled, not the smooth
cat-like one of other temples. The Mom does not sit, as it does at a stair's foot. The Luang has no
`depth` in the maker (the dragon's slider is not given to it), and it only flies: it does not
stand on the ground. The bird takes off and lands at one height, 800, with no run and no settling.
In the maker the Mom's feet slide if its course is faster or slower than its stride. The bird is
known in the north above all from cremations; it is offered to children here as a bird of the
Himavanta forest, and the owner was told so. Judged from stills only.

## The creature with four ears and five eyes

The owner (2026-10-19), for the film of the Lanna tale it belongs to: an orphan catches it in a snare
at a cave on Doi Khao Khwai, Chiang Rai; it eats nothing but red-hot embers, and what it leaves behind
is gold (แมงสี่หูห้าตา, Maeng Si Hu Ha Ta; the palm-leaf *Tham Si Hu Ha Ta* of Wat Chae Chang, and the
shrine at Wat Phra That Doi Khao Khwai Kaeo, where people still bring it charcoal).
`maengSiHuHaTa(x, y, look)` in `myth.js`; its sheet is `fiveeyes.html`.

**Where it is from.** Nothing is copied. It was read from the shrine's statue (photograph by
Chainwit., CC BY-SA 4.0, `File:ศาลแมงสี่หูห้าตา Si Hu Ha Ta Shrine in Wat Doi Khao Kwai - img 02.jpg`) and
the older statue and amulets made after it (Big HDV, CC BY-SA 3.0, `File:4eye5eyecr02.jpg`,
`File:4e5e cr remake1.jpg`, `File:4e5e cr remake2.jpg`), on Wikimedia Commons. Three candidates
drawn from them were shown beside the photographs (a smooth temple statue, a shaggy one grinning,
a round cub); the owner: "Like C but longer, with a big grin and 2 big tusks and oversized feet and
claws"; between tusks that rise from the lower jaw and fangs that hang from the upper, "Tusks up";
then "Make the mouth bigger".

| Rule | How it is built |
|---|---|
| a long heavy body like a bear's, in short dark grey fur a little shaggy at its edge | the outline is points (`maengOutline`, cubic curves sampled), drawn by `maengPath` with each stretch bowed out from the middle a little: a tuft; lit from above, darker under the belly, strokes of fur down the flank |
| a big round head, turned to whoever looks at it, a heavy jaw | the body is side on, the face full on (`maengFace`), 1.24 times the size it was drawn at |
| five eyes as the points of a star: one high in the middle of the brow, two above at the sides, two lower and nearer the middle, each in a carved ring, green | `maengEye`: the ring, the white, the iris, the pupil and a light, filled without a line (the kit's `oval()` inks what it fills, and five inked irises went muddy) |
| four round ears, two on each side, high on the head | drawn behind the head |
| a small blunt nose; a grin from cheek to cheek with a row of small teeth and a tongue; two great tusks rising from the lower jaw | the tusks belong to the jaw: they drop with it |
| paws too big for it, with long pale claws hooked down to the ground | `maengPaw`, 1.7 times a paw, four claws thick at the root, their tips on the ground (longer, they lay on the ground as thin blades) |

**It moves and feels.** It walks by `amble("maengSiHuHaTa", ...)` (`GAITS.maengSiHuHaTa`) on the
beasts' legs (`beastLegs`), blinks, wags a short tail, and takes the kit's feelings
(`creatureFeel()`): the lids of all five eyes come down as a person's do (in anger low by the nose,
in sadness and worry at the outer corner; the middle eye takes the mean), wide in wonder and fear,
shut and bowed up in a laugh, half shut when sleepy or full; the ears lie back, low and flat, in
fear, anger and sadness; the grin narrows and its corners drop in a frown or fear, and the jaw drops
in a laugh, a yawn or a fright. `mouth` (0 to 1) drops the jaw for an ember; `glow` (0 to 1) lights
the five eyes and the air about them, as after one. It gives back `{head, mouth}`, points of the
scene, so a film can send an ember into its mouth.

**The look.** With the Mom's keys `size`, `face`, `step`, `mouth`, `colour`, `eyes` and `feel`, one of
its own: `glow`.

**Not in the maker** (yet): only a film written by hand draws it.

`kit_check.py fiveeyes.html myth.html creatures.html sabai.html sash.html` (every page that loads `myth.js`):
5 pages, 0 failures; `fiveeyes.html` draws, same 0 / 0, 45.9 ms a frame.

## The Chinese dragon (2026-10-15)

The owner: "Look at the Chinese dragon and see if you can upgrade that model." The dragon of
`dragon.js` was the thangka painters' (dots for scales, a lion's round head, a pearl in every paw,
flames down the back). The Chinese painters' and the glazed walls' dragon is another animal, so it
is a manner of the same `dragon()`: `kind: "chinese"`, with `claws` (4, or 5 for an emperor's, or 3)
and `chase: false` to take the pearl away. Read from the Nine-Dragon Walls of the Forbidden City and
Beihai Park (photographs on Commons, CC/PD) and Chen Rong's Nine Dragons (1244, MFA Boston, public
domain), with Wang Fu's nine resemblances behind them. Nothing is copied; the rules head `dragon.js`.

| Rule | In the code | Numbers |
|---|---|---|
| Carp's scales over the body, a clam's belly, a sawtooth of spines down the back | `dragonScales` after `nagaStrip`: rows of crescents opening toward the tail, clipped to the body's own outline and kept off the belly's band; the strip's own spikes are the spines, and the seven taller flames are left out | a scale 0.17 of the half-width; rows 0.3 of the width apart, each row half a scale on from the last point's; the belly band is the strip's, 0.5 of the width |
| A long head: the snout turned up into a bulbous nose, the mouth open on teeth and a tongue, round eyes under bushy brows, the chimu lump on the crown, a cow's ear, a stag's antlers that sweep back, long whiskers, a beard, a mane | `dragonHeadChina`, in the head's frame as `dragonHead` is | the snout to 126 from the neck (the lion's reached 98); five teeth a row above and below, two of them fangs; the antlers' beams 96 back and 44 up with two tines; whiskers 380 and 300 long, 20 wide, waving 70; three beard locks of 70 to 98 |
| Eagle's feet, the elbow bent, a tuft at the elbow | `dragonTalons`: a palm, "claws" toes spread like a bird's (one turned back), each a short bone and a curved talon; `dragonLeg` with `china` draws the bones longer and thinner, three locks at the elbow, no dots, no pearl | bones 74 and 68 (were 66 and 60), widths 20, 13, 10; the talon 44 long; the forward toes spread over 1.45 rad |
| The flaming pearl before the snout | `dragonChasedPearl`: five flames licking round a pearl, after the head | at 168 before the neck's root, 40 up, radius 30; the paws hold nothing unless `pearls: true` |
| The emperor's colours | defaults for the kind: gold body `#e0b24a`, scales inked `#8a5a1a`, a pale belly `#f4e6bf`, vermilion spines `#c9552a`; any of `body`, `spots`, `belly`, `flame`, `mane`, `pearl` overrides, so the azure one of the sheet is `body: "#5d87b8"` | |

Sheet `dragon_china.html`: the emperor's five-clawed one chasing its pearl among scroll clouds,
its head close up, and an azure four-clawed one hovering. The thangka dragon of `dragon.html`
is unchanged: a look without `kind` draws as before.

**Not done:** the body's S-loops are the glide's arches, not the walls' tight coils; the scales
are not on the legs or the tail's end; the tongue is the Naga's; the far antler and ear do not go
behind the mane's locks.

## The rooster and the hen (2026-10-17)

The owner asked, of the lane: "have the chicken run a few steps and then jump into the air flapping its
wings but then come down and scurry off until it is off screen. The dog should increase speed as soon
as the chicken starts to run"; then "When the chicken jumps have a small feather fall and descend to the
ground and fade away. Spend some time on the framework and chicken behaviors"; and "Add a second
chicken a little to the right of the first that startles and scurries off screen". So what a chicken
does is in the kit, for any film, and the lane only says when.

| What it is | In the code | Numbers |
|---|---|---|
| A look for the rooster | `rooster(x, y, t, look)`: with no look it crows every two beats, as before (`village.html`, the sabai's tiles and the maker call it so); a look makes it do something else, and it crows only when nothing is asked of it. The names are in `ROOSTER_KEYS`, and one it does not know is warned of, as a person's are. The look is called `bird` inside the kit, so `kit_check`'s count of a person's look keys does not take them for a person's | 9 keys |
| Running | `step`, a number that grows a step at a time: each foot swings forward and back half a step behind the other, lifting as it swings forward; the body leans into the run (`lean`, 0.2 radians unless told) and bobs; the head reaches forward and pumps with the steps | foot swing 12, lift 7, bob 3; the head 8 forward, 10 down, 3 either way |
| Wings | `flap`: both wings beat up over the back and down, eight times a second, the far wing showing behind the body; `wings`: held out and a little up, shivering, as a chicken scurries. A wing spreads as it opens (`roosterWing`'s `open`, longer and broader): folded-size wings beating read as two small fins | up 0.8 ± 0.95 radians from folded; spread to 1.7 × long, 1.4 × broad |
| Walking | `walk`, a number that grows by one for each two steps (owner, 2026-10-22: walking on the run's legs "looks like they are running in slow motion"): the body nearly level (0.04 radians) and bobbing 1.5; a foot that is down goes back under the bird as fast as it goes, so it does not slide, while the other lifts with its toes curled and is set down ahead; at each step the head holds still over the ground while the body walks under it, then thrusts forward in the last quarter of the step. `stride` (0 to 1) eases a walk in and out. A scene's fowl (`lifeFowl()`, decorate.js) walk their courses so, and forage at a "peck" stop with `roosterPeck()`, roam 0 | a foot 14 ahead and behind, so two steps cover 56 (a hen's 48); lift 9; the head swings 10 about its place (`ROOSTER_WALK`) |
| Pecking | `peck`: the body tips forward from the hips and the neck reaches down until the beak is at the ground, the tail lifting with the tip; `reach` (-1 to 1) moves the spot the beak comes down on 8 behind or ahead; `cock` (-1 to 1) cocks the head, beak up or down, as a chicken looks about with one eye. `roosterPeck(t, plan)` gives a forager's ways (owner, 2026-10-22: "peck 1-3 times in different spots ... then go up and either look around or take a few steps to the left or right and then peck again rather than hammering away"), bout after bout: the head down to the ground and a moment looking, one to three pecks each at a spot of its own, the head up, then a look about (cocked one way, then the other) or two to four steps to one side, turning to face the way it goes, or, a rooster, a crow (`crow`: 0 to 1 through a crow, on demand and not on the beat; every crow is heard: `hear()`, sound.md, "The picture's own sounds"). What it does after its pecks goes round all it can do, each once in an order of its own before any comes again (owner: "Make sure they have a chance to go through all their actions. I forgot about singing"); a hen never crows. It gives back `{x, look}`: `plan.roam` (60) is how far it may wander, 0 at a course's stop; `seed`, `hen`, `face`. It took the place of `roosterForage()`, a jab every 0.3 s | down 0.3 s to `peck` 0.7, a look 0.25-0.55 s, a peck in 0.3 s (down in a tenth, up in a fifth), to the next spot 0.25-0.45 s, up 0.3 s; a look about 1-2.2 s, the head cocked 0.2-0.4 radians; a step 0.3 s (`ROOSTER_PECK`) |
| A fright and a crouch | `alarm`: the head up 14 and back 5, the body upright, the comb shaking, the eye wide with the white all round it, no blink, the tail up; `sink`: the body down on bent legs and the head drawn in, before a spring and on landing | |
| Facing, and a hen | `face` −1 faces left. `hen: true` draws a brown village hen (`HEN_COAT`): 0.85 of the rooster's size, three short upright tail feathers, a small comb and wattle; a hen never crows | `#c98b4e` |
| The whole flight | `roosterBolt(s, plan)`, s seconds after the fright (`BOLT` holds the times): it starts up (alarm in 0.06 s) with a jump of 10 where it stands, crouches, runs a few steps faster and faster with its wings coming out, hops with its wings beating and leaning back, crouches as it lands, and scurries off with its wings out, faster than it ran. The legs hold the stride they left the ground in through the hop, so the steps go on unbroken. `plan.peck` is where its head was when the fright came, so it comes up from there; `hop: false` runs straight off; `hen`, `face`. It gives back where it is from where it stood, and the look | run from 0.35 s, to 380 a second; hop 1.1 to 1.85 s, 130 high, 340 a second; then to 520 a second; a hen without the hop to 520 in 0.4 s |
| A feather | `feather()` draws one, a vane and a quill; `fallingFeather(x, y, ground, age, seed, colour, drift)` lets one fall as a feather does: slowly, swinging from side to side, quickest through the middle of a swing and tipping up and rising a little at its ends; it carries on `drift` the way it was going, lands, lies flat a moment and fades. Its fall is worked out from the age alone, so a still shows what the film does | 22 long; a swing in 1.1 to 1.4 s, 20 to 32 wide; falls 50 to 65 a second; fades from 0.6 s to 1.6 s after landing |
| The sheet | `chickens.html`: each behaviour on its own above (foraging by `roosterPeck()`, a rooster and a hen), the run, a hen walking, the hop, the scurry and a hen running in place in the middle, and the whole of `roosterBolt()` below, with its feather and a hen that only runs | |
| In the lane | `sash.html`'s `COOP`, `chicken()` and `looseFeather()`: the rooster crows, then pecks about (from 3 s); the hen, a little to its right and a step farther back, pecks all along. At `FRIGHT` the rooster bolts, a feather coming loose at the top of its hop; the hen takes fright 0.08 s after it and runs straight off. The dog (`chase()`), from the second the rooster starts to run, eases in half a second from its trot to more than twice that, its legs quicker with it, and follows them out. The rooster stood at 1060, under the words; it stands at 1300 now, so the fright shows | the fright at 6.2 s of the scene (the dog's nose 250 from the rooster's tail); the hen at 1490; the dog 195 to 420 a second |
| Tried | the hen 140 to the rooster's right and 0.25 s later: the running rooster caught up with her tail; folded-size wings beating, which read as two small fins | |

## A chick, a worm, a grasshopper: the yard's small stories (2026-10-22)

The owner, 2026-10-22: "Try to animate the scenes with a sense of creating a small chicken story within the greater
story just like the dog chasing the chickens in the first scene ... How about having a chick struggle pulling a worm
out of the ground or a chicken hunting a grasshopper? Not every scene needs to be like that." Each new creature was
picked of three candidates drawn beside the kit's hen (the chick "B: striped", the worm "B: thick, red-brown", the
grasshopper "B: rice grasshopper").

| What it is | In the code | Numbers |
|---|---|---|
| The chick | `chick(x, y, t, look)`: a chick of the village fowl, as the native fowl's and the junglefowl's are: brown, a dark stripe down its back with a pale one beside it, a dark cap and a stripe through the eye. It walks, pecks, looks about as the rooster does (`walk`, `stride`, `peck`, `reach`, `cock`); `tug` leans it back pulling at what its beak holds, its feet braced; `sit` sits it down hard, rocked back with its feet up; `dizzy` circles three little stars over its head. It gives back where its beak's tip is | about half the hen's height; two steps cover 24 (`CHICK_WALK`) |
| The worm | `worm(points, stretch)`: an earthworm along a line of points, red-brown, ringed, its pale band a third of the way along, thinner the harder it is pulled; `wormBetween(a, b, bow, t)` gives the points of one bowed between two ends and wriggling | 6 wide, 46 long (`WORM`) |
| The chick and the worm | `chickWorm(s)`, s seconds after the chick stops at the spot: it pecks there and looks; grips the worm's end and pulls, leaning back, its feet skidding, the worm stretching up out of its hole; the worm gives and snaps back, and the chick sits down hard, stars round its head; it gets up, grips again and pulls harder, trembling; the worm pops out and the chick tumbles back with it dangling from its beak; it slurps it down, gets up and walks back to its spot. `chickWormDrawn()` draws the worm for it. A course's "worm" stop plays it (decorate.js `chick`) | 7.6 s (`CHICK_WORM`) |
| The grasshopper | `grasshopper(x, y, t, look)`: Oxya, the rice-field grasshopper: green, its folded wings brown, a dark stripe behind the eye, thin legs and feelers, the great hind thigh along its side; its feelers stir; in a hop (`leap`) its hind legs kick out behind and its wings lift. On a course (decorate.js `grasshopper`) it hops from stop to stop in an arc higher the further it goes, and at a "caught" stop it is snapped up in a tenth of a second, so it never blinks out | 0.9 of the candidate; an arc 0.35 of the hop and 18 more |
| The hunt | a hen's course (decorate.js `lifeFowl()`), by the words of its stops: "stalk" crouches it, the head low and forward, frozen, and a slow creep on the way from there (the walk's stride 0.6); "pounce" lunges, the beak to the ground, the wings flicking; "missed" puts its head up, cocked one way and the other ("look", the same: two roosters eyeing each other); "caught" lifts the grasshopper kicking in its beak (`rooster()`'s `holding`) and gulps it down (`gulp`). The grasshopper's course is "caught" as the beak comes down and "hide" from the hen's "caught". A rooster's "crow" stop crows once | caught: up in 0.3 s, gulped from 1.2 s to 1.6 s |

In the tale: in s02 the hen's two chicks, one at her heels, the other with the worm, left of the words under the
house; in s07 a hen creeps up on a grasshopper and pounces, it hops past her and lands under the nose of the brown
hen, too full to have moved all morning, and as the hen creeps up on it again the brown hen leans down and gobbles
it; in s08 the two roosters crow at each other face to face, eyeing each other between, twice each, then both at once. s10 and s11 keep their fowl wandering and
foraging, as the owner allowed. The hero film's lane, which the owner liked as it was, is untouched.

## A buffalo turning round, and the far fields (2026-10-22)

The owner, 2026-10-22, of the buffalo ploughing in the far fields behind the poor family's house (`maengFieldLife()`,
maeng/sets.js): "Animate it turning from facing left to facing right. It should turn first where the head meets the
neck, then where the neck meets the body with a gentle curve. Legs should move up and down. Have the plow farmer move
in front of the buffalo as he follows and it turns. In the scene where egrets are following, they should fly up and
away when the buffalo turns around. Also, animate 2 small kids on a buffalo being led at the same distance."

| What it is | In the code | Numbers |
|---|---|---|
| A turn | `buffalo()`'s `turn`, 0 to 1, from facing `face` round to the other way: the head swings round where it meets the neck first (about x 92 of the neck's frame), looking back over its shoulder; then the neck at the shoulder, lifting in a gentle arc as it comes; then the body, which shows its front (`buffaloFront()`) for the moment it is end-on to us. Each part is seen side on as it goes round, shorter the more it faces us, never thinner than a beast's girth; each flips with its parent while the parent is end-on and thinnest. Keep `step` going and it steps round | the head 0 to 0.4, the neck 0.25 to 0.7 (lifting 0.3 radians at most), the body 0.45 to 1; the front for \|cos\| under 0.2; parts never under 0.3 of their length |
| The ploughing | `fieldPloughAt(t)`: along `FIELD_PLOUGH` at 9 a second, turning round in its place at each end for `FIELD_TURN` seconds; its first turn, from facing left to facing right, `FIELD_TURN_FIRST` seconds into a scene, so that a short scene has one. The furrow is right of the pen in the yard's close views and clear of the family's path in its wide one (measured: it had been behind the pen, and behind the family in s02) | x 1350 to 1550 of row 1; a turn 3.5 s, the first at 3 s, then every 25.7 s |
| The ploughman and the egrets | in a turn the plough swings round with the buffalo, and the ploughman walks round in front of it, a step nearer us, to take it up behind again; the three egrets behind the plough lift off one after another as it turns, fly up and away past the picture's edge, and 9 s after glide back down to where they would be walking (they took the place of the one that flew off every 24 s) | up and away in 5 s, back in 5 s, a quarter second apart |
| The led buffalo | a man leads a second buffalo by its nose rope along the same row, slowly, two small children astride it (`floor: "astride"` at its seat) | from x 1000, 5 a second |

## Five birds of the north (2026-10-17)

The owner: "research a handful of birds that are special to northern Thailand and animate them in the
framework." They are `northbirds.js`, a module beside the kit with its sheet `northbirds.html`, and each
is called as the kit's `rooster()` is: `(x, y, t, look)`, the feet at (x, y), or the middle of the body
for one in flight, and a name in `look` the bird does not know is warned of. The rules heading each bird
were read from nine photographs on Wikimedia Commons under free licences, kept with their credits outside
the repository; nothing of them is copied.

| Bird | Why it, and its source | In the code | Moves |
|---|---|---|---|
| Green peafowl, นกยูงไทย | the largest known population in mainland Southeast Asia lives in Phayao's forests (Saridnirun and others, Global Ecology and Conservation, 2021) | `peafowl()`: long grey legs, a slender scaled green neck, a narrow upright crest, bare yellow and blue face, blue-black shoulders, the wing scaled with cinnamon flight feathers; the train is four lengths of feather, the longest laid first, so the eyes lie in rows, lying along the ground or raised into a fan | `step`, `peck`, `call`, `display` (the train rises back and up, never through the bird), `shiver` (the fan rattles at 22 a second) |
| Mrs Hume's pheasant, ไก่ฟ้าหางลายขวาง | in Thailand only in the far north; birders go to Doi Chiang Dao for it; Vulnerable since 2023 (BirdLife) | `pheasant()`: red bare face, grey head, ivory bill, dark blue neck, chestnut body scaled darker, two white wing bars, a very long pale tail crossed by dark bars; `hen: true` brown, mottled, a short tail | `step` (the tail sways), `peck` (the body tips a little, the tail stays low, the neck bends down) |
| Green-tailed sunbird, นกกินปลีหางยาวเขียว | the north's form, angkanensis, was named in 1929 from Doi Ang Ka, Doi Inthanon's old name, and alone has the scarlet on its breast | `sunbird()`: a long thin bill curved down, glossed head, yellow breast with the red patch, olive back, long green tail; drawn with a finer pen | `hover` (the wings beat 13 times a second: a blur of two faint wings and one beating), `sip` |
| Red-billed blue magpie, นกขุนแผน | small parties through the hill forests; one of the longest tails of any crow (Thai National Parks) | `blueMagpie()`: red bill and legs, black hood with a pale patch behind, white belly, blue back; the tail graduated, every feather blue-grey with a black band and a white tip, each pair set out a little so its tip shows | perched it flicks the tail up and lets it sink (`bob: false` keeps it still); `fly`: three beats and a glide, rising and sinking |
| Great hornbill, นกกก | gone from the northern wild for twenty years; two set free in Chae Son National Park in 2022 (Thai PBS World), two on Doi Chiang Dao in 2023 (Chiang Mai City Life) | `hornbill()`: black, the neck cream, the huge yellow bill and casque, a red eye in a black face; the wing black with a pale band along it, white at the trailing edge, fingered at the tip; the tail white with a black band | perched it looks about (`turn`); `fly`: about one slow beat a second, the neck stretched forward |
| A wing in flight | `nbLift(lift)`: every wing is drawn pointing up and squeezed from 1 (up) through edge on to -1 (down), as a side view sees a wing beat; the far wing is the same, darker, a little behind | the first wings swung about the shoulder like a door and read as fins |
| No jumps | the largest change of any 10 x 10 block between frames over the sheet's 480: median 84, at most 139 inside a part, 182 at the cut between the parts. The beating wings and the shivering fan move a lot every frame; no single frame stands out | |
| In the hero film | (owner, 2026-10-17: "Add some birds to the hero video"; the words unchanged) `sash.html` loads `northbirds.js`: `villageMagpies()`, three magpies across the village sky as the camera pulls back (15.5 to 22 s); `sunbirdVisit()`, a sunbird on a round of two flowers, at the bougainvillea in the lane and at the thong kwao at the pond while the voice names it (`SUNBIRD_LANE`, `SUNBIRD_POND`: [second, [x, y]], two keys at one place a stay where it sips; the flowers' places are floraTree()'s own spots); `paddyBirds()`, once the storm has cleared, a hornbill over the hills (size 0.6) and a peafowl walking into the far field (size 0.4) and raising its train as the women walk off. None at night | the peafowl first stopped at x 170, and the film's slow push toward the centre cut it in half at the frame's edge: it stops at 260 |
| Tried first | the train as one feather in two, with only its eye at the end: a broom of sticks, lying as a single strip; the crest as five inked dots: a black box | |

## The night: a moon, the barn owl, the atlas moth, bats and fireflies (2026-10-21)

The owner: "Research nocturnal creatures of northern thailand in notebooklm. I want to add some creatures to the
credits and the lannamation framework", then, of the research's list, "do the moth, the fireflies, the owl, maybe a
common bat and add them to the credits". The research is the NotebookLM notebook "Nocturnal creatures of northern
Thailand" (44 sources: Thai National Parks, Avibase, ThaiBirding, North Thailand Birding, FORRU of Chiang Mai
University, theses of Chiang Mai Rajabhat and Naresuan universities, ThaiJo, Silpa Wattanatham, Thai PBS and
others). They are `night.js`, a module beside the kit (it draws with `northbirds.js`'s helpers, so it loads after
it), with its sheet `night.html`. Each was drawn first as two or three candidates beside photographs from Wikimedia
Commons under free licences, kept with their credits outside the repository; the owner chose, and nothing of the
photographs is copied.

| Creature | The owner's choice | In the code | Moves |
|---|---|---|---|
| The moon | "Add a Moon and clouds" | `nightMoon(x, y, r)`: a cream disc, lit toward its upper left, four soft grey seas, a glow 4.5 times its radius; it returns `{x, y, r}`. `moonLight(x, y, moon)`: 1 within twice its radius of it, falling to 0.3 at nine radii. The clouds are the kit's own, `cumulus(pen, t, CLOUD_LOOKS.night)`, drawn after the moon so they pass over it | |
| Eastern barn owl, นกแสก | all three candidates; "change the color of the owl when it is in or out of moon light and show its silouette as it crosses the moon" | `barnOwl(x, y, t, look)`: the heart-shaped white face rimmed in buff with a ridge to the pale beak and two dark eyes; a golden back mottled grey; white breast and underwings; long feathered legs. Perched (no `fly`): (x, y) its feet, the folded wings golden over each side, the head turning (`turn`). `fly: "side"`: deep slow beats (0.9 s), the face turned to us. `fly: "front"`: gliding toward us, the wings wide and white from below with a golden leading edge, a slow beat every 1.6 s. `lit` (0 to 1): every colour of its palette taken toward the night's blue by 0.72 of what is unlit (`nightPalette`). `moon`: the owl is drawn again, black, clipped to the moon's disc, so the part of it in front of the moon is a silhouette and the rest stays lit | `seed` sets where in its beat it is |
| Atlas moth, ผีเสื้อหนอนใบกระท้อน | "B: bolder bands" | `atlasMoth(x, y, t, look)`: seen from above, rust wings darker at the body, the fore wing's tip hooked down as a snake's head (pale, a dark eye, a pink lip), a clear triangular window edged black in each wing, a pale zigzag and a pale band; a furry ringed body and feathery feelers | the wings fold up and open again (`flutter` beats a second, 2.2); `turn` tilts it; `lit` as the owl's |
| Bats | "a stream far off ... Instead of leaving a cave just have them fly behind hills or get smaller and fade out" | `batStream(t, look)`: each bat a flapping "m", dark, along a line from `from` to `to`, one every `every` seconds from `start`, each `long` seconds on the way, shrinking from `size` to `far` and fading over the last half; a stream drawn before a hill's sheet goes behind the hill | the wings beat 5 a second; each wobbles less as it goes |
| Fireflies, หิ่งห้อย | "Make it subtle and distant in the background. Try to create a realistic look at fireflies from far away" | `farFireflies(t, look)`: far off a firefly is a point, not a glow: a short flash, up in 0.08 s and out over 0.3 s, then dark for two to five seconds, each in its own time; a core of 1 to 2.2 px and a faint halo four times as wide, a little brighter and larger the lower (nearer) it is in its `box`. The large soft glows of `sls_intro.html`'s `fireflies()` are the near ones | a slow drift of 14 px |
| Tried first | the owl's folded wings drawn before its breast showed only as golden rims; the bat stream started below the hill's top and was hidden behind it from its first second | |

## The beings of the Himmaphan, flying (2026-10-21)

The owner: "Change the SLS video to be of a misty mountain scene with birds flying and ... these Thai angels and other
mystic beings flying around. Everything should move glide and soar effortlessly and slowly as if viewing something
really high up", with a photograph of a temple mural of thewada flying among clouds, then "Spend some time adding
detail and improving the quality of each sprite". They are `himmaphan.js`, with its sheet `himmaphan.html`; the mural
was studied, not copied. Each is drawn about its middle, flying right (`face` -1 left), `size` 1 about 220 tall, its
own time by `seed`, `light` (0 to 1) the low sun gilding it.

| Being | In the code | Moves |
|---|---|---|
| Thewada, an angel | `thewada(x, y, t, look)`: the murals' pose of flight, one knee forward and down, the other leg swept up behind, the foot flexed with its sole to the sky; a slim gilded body, the crossed chains over the chest (sangwan) with a jewel, a gold collar, armbands, bracelets and anklets; hands of Thai dance, the fingers bent far back (`himmaHand`); the face turned a little to us, brows arched, eyes long and lowered, a small red mouth, an earring on the long lobe (`himmaHead`); the tall crown in tiers to a spire that flicks back, its jewelled band and the gold flame behind the ear (`himmaCrown`); the cloth red with rows of gold diamonds over a green under-layer, its ends flaring back in curling flames (`himmaCloth`). `gift`: "lotus" (a bud held up) or "garland"; `scarves`: two long scarves streaming | a slow rise and fall (0.55 a second), a slight roll; the cloth's flames and the scarves ripple |
| Kinnari | `kinnari(x, y, t, look)`: a woman crowned to the waist, her hands forward; below, a bird: a feathered body, legs tucked back with curled claws, a tail of broad gold plumes each with a red eye (`himmaPlume`); two wings spread from her back, white feathers with buff edges, coverts in rows, gilt along the leading edge (`himmaWing`) | slow deep wingbeats (0.9 a second) |
| Hong, the golden swan | `hongFlight(x, y, t, look)`: a full breast and belly in rows of small feathers, the long S of the neck with fine ticks, a jewelled red collar with gold beads, the head with a gold eye ring, a slim crest curling back (kranok), a red curved beak; each wing (`hongWing`) of barbed feathers, a shaft and its barbs each a line over gold leaf (`himmaBarbs`, since 2026-10-24; the leaf feathers of `himmaFeather` before): six long primaries fanned from the wrist, secondaries along the trailing edge, scalloped coverts in rows, gilt along the leading edge, the tail five curling plumes like a flame | it beats as a wing does, not turning as a board (2026-10-21: "Make the golden bird's wing flap like a natural wing instead of rotating"): the arm swings about the shoulder and is seen shorter as it comes toward us, the hand bends at the wrist and trails the stroke, the primaries part on the downstroke and close on the upstroke, the secondaries always trail back; slow deep beats (1.0 a second), now and then a glide; the body lifts as the wings come down. `soar: true`: it soars, the wings held up in a V, only the hands flexing; with `beats: [when, how many]` it gives that many strong beats (1.1 s each) from `when`, down below the belly and back up over the back, then glides on. Its spine moves by the rule of `procedural_animation.html` ("Can you use the spine logic from procedural_animation on the bird so it's neck and head and body move more fluidly?"): eight joints from the head to the tail's root (`HONG_SPINE`), the head leading at `HONG_AIR` and each joint facing the one in front, turned no more than `HONG_BEND` (`hongChain`, laid out afresh from four seconds back each frame, as `nagaChain` is); each piece of the drawing turns with its joint and the neck is a band through its joints (`hongNeck`), so as it rises the head tips first and the body comes round after, and the neck flexes as the wings lift the body under a steady head. `trail`, the film's path for it, gives the rises and falls |
| On the studio's card | `sls_intro.html`: dawn high over the mountains, steep forested peaks out of a sea of mist, the far ranges pale and gold toward the sun. Birds in place of the thewada (2026-10-21: "Replace the angels with birds and make them move a touch faster but also at variable rates and over gently rolling curves rather than flat lines", then "Add some of the egrets really far away and the v shaped super far away birds too"): seven fliers in `SLS_FLIGHT`, egrets so far off they are flecks and one nearer, far off a small blue magpie, and a hong that soars and beats its wings three times from 4 s (`soar`, `beats`) (then fewer: "Get rid of the near egret, the Thai angel one set of v birds, one of the golden birds and the hornbills": the nearest egret, the kinnari, a flock, a hong and two hornbills went; then the egret by the magpie and the last flock went, and the magpie went far off; then Phaya Luang, the dragon); each one's pace swells and eases by a third at its own rate and it rides long gentle waves, tilting with them (`slsPath`); `slsFarBirds` adds 34 birds so far off they are a "v" each, in two loose skeins and alone; the far ones hazed; the camera rises 40 and comes in 4%. Its sound (`sls_sound.py`): the kit's `wind` (sounds.py, made from numbers), a red-billed blue magpie at 2.2 s, a flock passing at 5.5 s, and at its end a white-rumped shama singing twice where the evening card's tokay called (`shama` in sounds.py: Utain Pummarin, CC BY 4.0, chosen of ten recordings by its song's loudness over the noise above 1.5 kHz), its second song ending 0.5 s before the card, the music lowered under it | |
| Tried first | thewada drawn in straight segments, blocky; then curved, but the legs too thick (the raised leg read as a flipper) and the tails thin spikes; the card's first view had a wall of forest below the mist and rounded hills | |

## The tokay's spine, a buffalo grazing, the farmer's nose rope (2026-10-21)

From the owner's list of 2026-10-21 (maeng/TODO.md). **`GECKO_BEND`** (beasts.js): a joint of the gecko's spine turns
at most 0.5 from the one before; where a route doubles back the joints behind follow the one before instead of the
route, so the body curves round behind the head and never folds over itself ("When it walks up the wall it folds over
itself"); the feet go with their hips where the body leaves the route. A route that turns gently draws as it did.
**A chain, as procedural_animation.html's (2026-10-22).** The owner: "The tokay looks mechanical and grinding when it
turns." Its joints had been laid on the route's straight stretches, so at each corner the head, then each joint as it
came to the corner, turned all at once. `geckoChain()` now leads the head along the route and drags each joint after the
one before (facing it, no more than `GECKO_BEND` from it, `gap` behind), laid out afresh from two body lengths back in
every frame (`GECKO_STRIDE`, 3 px a pull), as the Naga's `nagaChain()`: the body swings round a corner after the head,
and the head faces the way its neck leads it. On a straight route it draws as before (the woven tile, the credits').
**`graze`** (buffalo, 0 to 1): the head lowered to the ground, the muzzle on the grass at 1, the jaw working; the
lowered neck takes the body's shade and its two lines stop short of the body, so nothing shows across it.
**The nose rope** (`rope`): from the pierced nose up each cheek under the eye, behind the horn's base between horn and
ear, and over the poll behind the horns, drawn before the near horn (Dennis G. Jarvis's photograph of a Thai buffalo on
Commons, and the "Lanna village farming" notebook: both ends of the finger-thick rope are looped behind the horns and
tied loosely; the lead is a separate rope tied to one side).

## Chang Ngu: the river snakes, the white elephant and the snake-elephant (2026-10-22)

For the next tale, Chang Ngu (ตำนานช้างงู, Chiang Saen): Prince Phrom, thirteen, is told in a dream to wash his face in
the Mekong, where three white elephants will float down; three giant snakes come instead, and the third becomes a white
elephant when he jumps on to its neck. It will not come ashore until a golden kangsadan rings (things.md); it carries him
to win back the city from the Khom, and at the end walks into a ravine of Doi Chang Ngu and becomes a snake again. From
the Lanna Folktales tellings of Chang Ngu and of Phra Chao Phrom Maharat, the Chiang Saen school's page and the Ministry
of Culture's page on the town's statue (the research: the "Lanna fairy tales" NotebookLM notebook). Three candidates of
each were drawn in scratch on the kit's own river and doi backdrops, and the owner picked.

| Creature | Picked | How it is built |
|---|---|---|
| `riverSnake(x, water, look)`, `naga.js` | B, plain and blotched, for the first two; C, pearl-white, for the third | the head held up out of the water, the body in humps along the water line behind it (`riverSnakeSpine`: a wave runs back along it), clipped at the water line, rings where it goes in and out, a wake before the head; a smooth band (`riverSnakeStrip`) with blotches and a pale belly line, or the pearl's sheen; a plain head with no crest (`riverSnakeHead`). `kind` "plain" or "pearl", `size` (1 as thick as a palm trunk; the granary-sized first one about 1.6), `face`, `body`, `blot`, `belly`, `late`. Gives back `{head, neck}`: the neck is where Phrom holds on. On `naga.html` |
| the white elephant (ช้างเผือก) | C, pink-white with a gold cloth | no new function: `elephant(x, y, {colour: "#f1ddd3", cloth: "#c9962a"})`, read from the royal white elephants (Commons, public domain): pale, pinkish skin, a red-and-gold cloth with a fringed edge |
| `changNgu(x, y, look)`, `myth.js` | A, three heads, white and gold, as the statue at Chiang Saen's roundabout ("ลำตัวเป็นงู หัวเป็นช้าง ๓ เศียร") | the Naga's body and fan of necks (`nagaLine`, `nagaStrip`, `NAGA_PATH`), and on each neck the kit's own elephant cut to its head (`changNguHead`: `elephant()` clipped, the ear over the joint). The owner: "Make the bodies and heads of the naga elephants the same color": `body` colours both (white, `#efe6d6`), with gold belly, bars and spikes. `heads` 1, 3 or 5, `size`, `face`, `trunk`. On `myth.html` |

The change itself (the snake held at the neck, a ring of light and spray, the white elephant swimming round) is the
film's to draw from these; its three stills are in the candidates (`chang_ngu_candidates_2026-10-22.jpg`, not kept in git).

## The hong's feathers, barb by barb (2026-10-24)

The owner: "Look at how you did the threads for the cloth then look at the hong bird and see if you can do the wing
feathers in a similar way", then "Make them look more pristine and beautiful", "Slow the wing beat down just a bit",
and of the far wing, after three tries: "The wings should flap in unison", "The birds body should stay straight. The
wings should go up and down", "The backside wing looks like it's falling to the near side of the bird rather than
the far side".

| What | How |
|---|---|
| A feather | `himmaBarbs(root, tip, wide, deep, lit, t, air, seed)` (himmaphan.js), as `weaving.js` weaves a cloth thread by thread: a shaft bowed a little, and off it on both sides a barb every pixel or so, each its own line, swept toward the tip and curving evenly; the outer vane narrower than the inner, as a flight feather's is. Under the barbs the vane is laid in gold, so no sky shows through; each barb is a strand over it, a darker edge and a lit crown, in five shades from the root's deep to the tip's light (so a wing of thousands of barbs is a few strokes). A sheen lies along the inner vane and drifts, so the feathers shimmer; one smooth line of ink goes round the vane; the shaft is gilt. The air moves the barbs' ends a little, a wave along the feather that is a function of the second alone (a film is drawn in any order) |
| The wing | `hongWing(up, rate, light, far, t)` draws its primaries and secondaries with `himmaBarbs`, the air in them as strong as the stroke is fast; without `t` they are still. The coverts and the gilt leading edge are as they were |
| The far wing | the near one as the other side of the body shows it from the side: the same stroke, a shade darker, a little behind and above as the wings rise, and sinking behind the body as they come down, so the body hides it there. Tried and dropped: the far wing flipped to fold down as the near one rose (the bird looked banked over, "tilting to the side") |
| The beat | `HONG_BEAT` 1.35 s (was 1.1: each of a soaring hong's few beats; the card's three, from 4 s, end at 8.05 of its 12 s); a flapping hong beats at 0.85 radians a second (was 1.0) |
| Held still | `look.level`: the head and body held straight and level, nothing but the wings moving |

`himmaphan.html` and `sls_intro.html`: kit_check passes; on a quiet laptop a frame of the card takes 35.0 ms and of
`himmaphan.html` 30.7 ms (the leaf feathers were not timed; the 60 to 160 ms seen while trying this were the laptop
busy with renders at the same time).
