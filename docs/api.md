# The kit's functions and tools

Made by `kit/api_index.py` from the comments in the code (run it again after a change). A film is a page that loads `oldcartoon.js`, then the modules it needs, and draws second t in `draw(t)`: see the README's "A film is a page" and `docs/STYLE.md`. The look keys of `person()` are listed in the comment above it in `oldcartoon.js`. Distances are pixels of the film's sheet (1440 x 1080, or 1920 with FILM_STYLE.wide), times are seconds.

# Modules (JavaScript)

## oldcartoon.js

oldcartoon.js - the style of a 1930s cartoon, as a kit.  A film that uses this kit is a web page that: 1. has  <canvas id="stage" width="1920" height="1080">  and then loads this file; 2. sets  var DURATION  (seconds) and  var BEAT  (seconds for one beat of its music); 3. writes its scenes as functions of their own clock, and lists them: var SCENES = [[0, 8, sceneOne], [8, 20, sceneTwo]]; 4. ends with   function draw(t) { film(t, SCENES); } village.html is such a film. Everything a scene draws, it draws with "pen".  The style is these rules, and each is a function below: ink        thin brown outlines on the actors, none on the backgrounds   shape, oval hoses      arms, legs, tails: one curve drawn fat and dark, then thinner in colour   hose the beat   hop(t) is 0 on the beat and 1 between beats; everything moves by it (a film whose style has hop: false is the other kind: its people stand still, and walk evenly from place to place with stroll()) bodies     tall; a chest with a waist; tails, coat or skirt that flare and swing; legs that bow at the knee as the hips drop on the beat          person cloth      tiers with a hem of scallops that breathe and swing             tier hair   

### `warn(message)`

```
warn(message): message, a sentence. Says it once in the browser's console, after "oldcartoon.js: ", and keeps it
in WARNINGS; the same message again says nothing. Returns nothing.
e.g. warn('the scene "dusk" has no clock');
```

### `lettersApart(a, b)`

```
how many letters must change to turn one name into the other
a, b: two names (capitals count). Returns a whole number: 0 when they are the same.
e.g. lettersApart("handa", "handB")   // 1
```

### `checkName(what, name, known)`

```
Warn if "name" is not a name in "known", and offer the known name nearest
to it: one that differs only in capitals, or by one or two letters.
  what    the words that begin the warning, for the kind of name ("The look's name")
  name    the name given
  known   an object whose keys are the names the kit knows (LOOK_KEYS, STYLE ...)
Returns nothing; it may warn() once.
e.g. checkName("The feeling", "hapy", FEELINGS);
```

### `checkNames(what, given, known)`

```
the same for every key of an object, such as a look
"given" is the object whose keys are checked; "what" and "known" are checkName()'s. Returns nothing.
e.g. checkNames("The look's name", look, LOOK_KEYS);
```

### `lipOf(red)`

```
red: the colour a painted mouth asks for, "#rrggbb". Returns red while PAINTED, else her own lips' colour (from
SKIN).
e.g. pen.fillStyle = lipOf("#c8343a");
```

### `clamp(x)`

```
x held between 0 and 1.
e.g. clamp(1.4)   // 1
```

### `between(t, a, b)`

```
t, a, b: one unit, mostly seconds. Gives 0 before a, 1 after b, and an eased S-curve from 0 to 1 between them.
e.g. var come = between(t, 2, 3.5);   // 0 until 2 s, 1 from 3.5 s
```

### `mix(a, b, amount)`

```
a number "amount" of the way from a to b: amount 0 gives a, 1 gives b (beyond 0 to 1 it goes past them).
e.g. mix(100, 300, 0.25)   // 150
```

### `dice(n)`

```
A number from 0 to (just under) 1 that looks random but is always the same for the same n: the kit's dice, so a
frame can be drawn again alike. n: any number (a seed, a count).
e.g. var gap = 40 + dice(n * 3 + 1) * 20;
```

### `hop(t, late)`

```
  t      seconds of the film (or of the scene's clock)
  late   beats to shift the hop by, default 0 (0.5: down while the others are up)
Returns 0 to 1. Reads BEAT and HOLD (STYLE.hold).
e.g. var lift = hop(t, 0.25) * 12;
```

### `saccade(t)`

```
Eyes do not drift. They hold on a spot, then jump to another in a twentieth
of a second (a saccade), after a hold of half a second to a few seconds.
The spots and the holds come from dice, so no two people look alike.
t: seconds (add a person's own time, so no two look alike). Returns [across, down]: where the eyes look, in face
pixels, across -3 to 3 and down -1.2 to 1.2.
e.g. var glance = saccade(t + ownTime("noi"));
```

### `blendOutline(t, P, Q, F)`

```
an outline (a list as CHEST_LADY is) for a turn t, blended through its
profile, three-quarter and full-face lists as blend3() blends a number
  t         the turn: -1 profile, 0 three-quarter, 1 full face
  P, Q, F   the profile, three-quarter and full-face lists, alike point for point
Returns a new list (Q itself when t is 0).
e.g. outline(blendOutline(0.5, CHEST_LADY_P, CHEST_LADY, CHEST_LADY_F), function (x, y) { return [x, y]; });
```

### `chestTurns(q)`

```
A three-quarter chest seen in profile and from the front: in profile the back comes in to the spine and the front
stays out (a belly is seen most from the side); from the front both sides are alike, as wide as the wider side.
q: a three-quarter chest list (as CHEST_MAN_FAT). Returns [profile, q, full face], the three lists BODIES[..].chest
takes; q itself is not changed.
e.g. var turns = chestTurns(CHEST_LADY_FAT);
```

### `outline(points, put)`

```
the path of such a list, with every point put where put(x, y) says it
goes: a drawing bent along a curve, and tipped, and still drawn only once
  points   a list as CHEST_LADY is: a start [x, y], then curves of three points or two
  put      put(x, y) gives [x, y]: where that point goes, in pen's pixels
Returns nothing. It begins a new path on pen and closes it, but neither fills nor inks it: the caller does
(shape(), pen.clip() ...).
e.g. outline(CHEST_LADY, function (x, y) { return [x, y - 20]; }); shape("#c0392b");
```

### `rigImages(rig, folder)`

```
---------- a puppet of drawn parts ----------
A rig is a drawing cut into parts (rig_cut.py): each part is an image and
the two joints it hangs between, in its own pixels. A page loads the rig's
rig.js (var RIG = {...}), calls rigImages(RIG, "folder/") once, and then
person(x, y, {rig: RIG, ...}) moves the drawing instead of drawing the
kit's own shapes: the same hops, steps, poses and lags, on a drawn body.
  rig      the rig's RIG object, from its rig.js (parts, neck, hip, ankle)
  folder   where its images are, ending in "/"
Returns the same rig, which it changes: it adds byName, images, scale (kit units per picture pixel) and upper,
lower and legs (bone lengths, in kit units). The images load in the background; part() draws nothing until they
have.
e.g. rigImages(RIG, "rig_lady/");
```

### `part(rig, name, ax, ay, bx, by, stretch)`

```
One part, drawn so that its joints land on (ax, ay) and (bx, by): turned
to the bone's direction, scaled alike both ways by the rig's scale, and,
with "stretch", stretched along the bone to reach the far joint.
  rig              a rig after rigImages()
  name             one of its parts' names ("armL_upper")
  ax, ay, bx, by   where its two joints land, in pen's pixels
  stretch          true to stretch it along the bone so it reaches (bx, by); else it keeps its length
Returns nothing: it draws with pen (nothing while the image has not loaded, or for a name the rig lacks).
e.g. part(RIG, "armL_upper", 0, -140, 24, -80, true);
```

### `rigArm(rig, names, sx, sy, hand, outward, bend)`

```
An arm of parts from a shoulder toward a hand, as arm() places the bones:
the elbow is found from the rig's own bone lengths. "names" are the upper
arm, the forearm and the hand; "bend" is the wrist's bend. Returns the
wrist and the elbow, as limb() does.
  rig       a rig after rigImages()
  sx, sy    the shoulder, in pen's pixels
  hand      [across, down]: where the hand reaches from the shoulder, in pen's pixels
  outward   1 or -1: which way the elbow points, as armJoints() takes it
  bend      the wrist's bend, in radians
e.g. var wrist = rigArm(RIG, ["armL_upper", "armL_lower", "handL"], 20, -140, [36, 70], 1, 0.2);
```

### `follow(key, lx, ly, stiff, damp, limit)`

```
  key        a name for this hanging thing, kept across frames: the person's id and the thing ("noi/earring")
  lx, ly     its pivot, in pen's local pixels now
  stiff      the spring: 40 to 320 (stiffer comes back sooner)
  damp       the slowing: 5 to 9
  limit      the most it may lag, in screen pixels
Returns [across, down] in local pixels. Reads clock; keeps its state in FOLLOWS[key], so call it once a frame
for each key.
e.g. var lag = follow("noi/earring", 50, -272, 200, 8, 10);
```

### `sungBeats(lines)`

```
[beat, "syllable syllable ..."] lines, as in village_sing.py, to a flat
list of [beat, syllable]
lines: the song's rows, [beat, "syllable syllable ..."] (CUES does). Returns [[beat, syllable], ...], one beat for
each syllable, for mouthAt().
e.g. var SUNG = sungBeats(CUES);
```

### `vowelOf(syllable)`

```
the shape of the mouth for a syllable: how wide and how round, 0 to 1
syllable: one Thai syllable. Returns {wide: 0 or 1, round: 0 or 1}.
e.g. vowelOf("จัง")   // {wide: 0, round: 0}
```

### `onsetOf(syllable)`

```
The consonant a syllable starts with, as the mouth makes it: "lips" for
ม บ ป พ ผ ภ (the lips meet first), "teeth" for ฟ ฝ (the upper teeth on
the lower lip), "tongue" for ล ร น ด ต ถ ท ธ ณ (the tongue up behind the
teeth), "hiss" for ส ซ ศ ษ (the teeth near, the lips wide), and nothing
for the rest, which start open. A written vowel before the consonant
(เ แ โ ใ ไ) and a silent ห or อ leading it are passed over.
syllable: one Thai syllable. Returns "lips", "teeth", "tongue", "hiss" or "".
e.g. onsetOf("บ้าน")   // "lips"
```

### `mouthAt(sung)`

```
The mouth at this moment of the film, or null when nothing is sung. A
syllable lasts one beat: for its first 0.08 s the mouth makes the
consonant it starts with, then opens fast into the vowel, holds, and
shuts before the next.
sung: the list sungBeats() gives. Reads clock and BEAT. Returns {open, wide, round} (0 to 1 each), with teeth and
tongue (true or false) while a consonant shows; or null. The page passes it to person() as look.mouth.
e.g. person(700, GROUND, {lady: true, mouth: mouthAt(SUNG)});
```

### `cueAt(t, cues)`

```
The line being sung at second t of the film: its number in the list (-1
before the first line), the seconds since it began, and the beats it is
sung for. A line stays "the line" until the next one begins.
t: seconds of the film; cues: the cue sheet (CUES). Returns {line: its number, -1 before the first; since:
seconds since it began; beats: how many syllables it has}.
e.g. if (cueAt(t, CUES).line === 2) { wave = 1; }
```

### `words(t, cues)`

```
The words of the line being sung, under the picture: from its first beat
until half a beat after its last syllable.
t: seconds of the film; cues: the cue sheet (CUES). Returns nothing: it draws the line with subtitle(), or
nothing between lines.
e.g. words(t, CUES);
```

### `inkFor(colour)`

```
The ink for a line round paint of this colour: mostly INK, a little of the paint. colour: "#rrggbb"; any other
form ("red", "rgb(...)") gets INK itself. Returns a CSS colour.
e.g. pen.strokeStyle = inkFor("#c0392b");
```

### `heavy(ink)`

```
From here on, whatever is drawn in "ink" is drawn a second time, one step
down and to the left: that is the heavier side of the line.
ink: a CSS colour. Sets pen's shadow to it, offset (-1.1, 1.1) pixels; it stays set until light().
Returns nothing.
e.g. heavy(INK); pen.stroke(); light();
```

### `light()`

```
Ends heavy(): pen's shadow off. Returns nothing.
e.g. light();
```

### `shape(colour, width)`

```
Fills the path pen holds now with "colour" and inks its line (inkFor(colour), the heavy side below and to the
left). colour: a CSS colour; width: the line's width in pixels, default LINE. Returns nothing; leaves pen's
fillStyle, strokeStyle, lineWidth and lineJoin as it set them.
e.g. pen.beginPath(); pen.arc(0, -40, 20, 0, 7); shape("#c0392b");
```

### `strokeOutside(path, other)`

```
Ink the line of one shape, but not where it runs inside another. Two shapes
that overlap, each inked this way against the other, read as one shape
with one line round it.
path, other: Path2D objects in pen's pixels. Inks path with pen's strokeStyle and lineWidth as they are, except
inside other. Returns nothing; pen's clip is put back as it was.
e.g. pen.strokeStyle = INK; strokeOutside(sleeve, body); strokeOutside(body, sleeve);
```

### `oval(x, y, rx, ry, colour, turn)`

```
A filled ellipse with its ink line: middle (x, y), half-widths rx and ry, in pen's pixels; colour a CSS colour;
turn in radians, default 0. Returns nothing.
e.g. oval(0, -40, 12, 8, "#f4d6b8");
```

### `hose(x1, y1, x2, y2, bend, width, colour)`

```
A rubber hose: one curved line, drawn fat in ink and then thinner in
colour. Arms, legs, tails and necks are all hoses.
  x1, y1, x2, y2   its two ends, in pen's pixels
  bend             how far its middle bows out, as a share of its length: 0 straight, 0.2 a good bow (the sign
                   picks the side)
  width            its width in pixels, without the ink
  colour           a CSS colour
Returns nothing; leaves pen's lineCap "round".
e.g. hose(0, -140, 30, -60, 0.15, 12, SKIN);
```

### `ribbon(x1, y1, x2, y2, bend, width, colour, border)`

```
A hanging end of cloth: a flat band from (x1, y1) to (x2, y2) that bends
like a hose but is drawn as cloth, wide at its root and a little wider at
its hem, with an ink edge, a fold line down its middle where it turns, and,
for a checked cloth, bars across it in the border's colour. "bend" is the
hose's; "width" its width at the root; "border" the colour of the bars, or
nothing for a plain cloth.
Units are pen's pixels. Returns nothing.
e.g. ribbon(-28, 2, -40, 70, 0.15, 14, "#a33a2a", "#e0b23a");
```

### `pieEye(x, y, shut)`

```
The eye of a 1930s cartoon: a tall black oval with a slice cut out of it.
Now and then it blinks: for a moment it is only a curved line.
x, y: the eye's middle, in pen's pixels (it is 14 wide and 26 tall); shut: true draws the blink, a curved line.
Returns nothing.
e.g. pieEye(20, -300, hop(t) > 0.9);
```

### `ownTime(who)`

```
A time of its own for each person, from their name (see "id" above
person()), so that a crowd of sleepers do not nod and yawn as one.
who: the person's id, a string. Returns seconds, 0 to 13, the same each time for the same name.
e.g. var at = clock + ownTime("yai");
```

### `feelingOverTime(f, at)`

```
What sleepy and full do over time, at a person's own time "at". Sleepy:
the lids hang half down; every seven seconds the head sinks for four
seconds as the eyes close, and comes up with a start in a quarter of a
second, eyes open; every eleven seconds a yawn of 2.4 seconds: the mouth
opens tall and round, the eyes squeeze shut, the brows go up and the head
goes back (a yawn stops a nod). Full: the lids are heavy, and every six
seconds they close for a second and a half, savouring it. Laughing: the
eyes shut, the mouth opens on each "ha", four and a half a second, and
the head and the shoulders shake with it, in bursts of two seconds with a
breath of half a second between.
  f    the feeling's numbers, as feelingOf() builds them: it reads sleepy, full and laugh (0 to 1) and adds to
       bend and tilt
  at   the person's own time, in seconds
Returns f itself, changed: lids (0 to 1), browUp (pixels), ha (-1 to 1) set, bend and tilt added to, and open
set during a yawn or a laugh.
e.g. var f = feelingOverTime({sleepy: 1, full: 0, laugh: 0, bend: 0, tilt: 0}, clock);
```

### `feelingOf(look, at)`

```
The feeling a look asks for, as the numbers the face and the body read.
"at" is the person's own time (ownTime() added to the clock).
  look   the look: it reads feel (a name of FEELINGS, or one of FEELING_WAS) and the numbers wonder, smile,
         fear, anger, sad, sleepy, full, worry, laugh (0 to 1, each beating the name's own), eyes and lips
  at     the person's own time in seconds, default clock
Returns {wonder, smile, fear, anger, sad, sleepy, full, worry, laugh, open, bend, tilt, eyes, lips} and what
feelingOverTime() adds (lids, browUp, ha). It warns once for a feeling's name it does not know.
e.g. var f = feelingOf({feel: "sleepy"}, clock + ownTime("yai"));
```

### `creatureFeel(look, at)`

```
---------- a creature's feeling ----------
The feelings people have, on a creature (owner, 2026-10-18: "start the
creatures"). A creature's look takes the same names (feel: "angry") and
numbers, and creatureFeel() turns them into what any face and body can
show; each creature draws what it has. With no feeling all of it is 0
(wide 1), and a creature draws as it did before.
  f      what feelingOf() gives, over time at the creature's own time "at"
  lid    0 to 1: how far the upper lid is down (sleepy, full, laughing)
  bowed  true: a laughing eye, shut and bowed up
  slant  -1 to 1, as eye()'s: a lid low at the front corner (anger), or at
         the back (sadness, worry)
  wide   how wide the eye opens: 1 as it is, more in wonder and fear
  brow   [lift, turn]: a brow raised (in eye-heights) and turned, its front
         end down (anger) or up (sadness, worry), in radians
  open   0 to 1: how far the mouth opens (wonder, fear, a laugh, a yawn)
  grin   -1 to 1: the corners of a mouth up in a smile, down in a frown
  raise  -1 to 1: the head carried high (wonder, joy) or low (sad, sleepy)
  ears   -1 to 1: up and forward (wonder, joy) or down and back (sad,
         afraid, angry, sleepy)
  wag    0 to 1: how hard a tail wags (happy, laughing)
  tail   -1 to 1: a tail carried up (happy, angry) or down (sad, afraid)
  shake  -1 to 1: a laugh's shake, on each "ha"
  nod    the head's tilt, down positive: the person's (a sleepy nod, a
         yawn back, a laugh's toss)
  startle  0 to 1: a fright, for a creature that has one of its own
  jaw(usual)  how far a jaw opens, given how far it would otherwise
look: the creature's look (feel and the numbers, as feelingOf() reads them); at: its own time in seconds,
default clock. Returns the object above.
e.g. var e = creatureFeel({feel: "angry"}, clock + ownTime("dog"));
```

### `creatureEye(x, y, rx, ry, e, how)`

```
A creature's eye: an ellipse about (x, y), rx by ry, turned by how.turn,
looking along +x (its front). The white, an iris toward the front
(how.iris, with a pupil in it if how.pupil is a colour), and the lid a
feeling brings down (e, from creatureFeel()), in the colour of the skin
(how.skin), its edge inked (how.ink). how.pie: a 1930s pie eye instead,
black with a slice of light (how.light, the kit's skin unless told) cut out.
how.ball: an eye coloured all through (a cat's, a pig's) in place of the
white and the iris, with only a pupil (how.pupil; how.slit, a slit) and a light. Shut (a blink, how.shut,
or a lid down past 0.9) it is a line bowed down; laughing, bowed up.
x, y, rx, ry are in pen's pixels (ry is made taller by e.wide); e needs lid, wide, bowed and slant. how.skin is
the lid's colour: give it unless no lid comes down. Returns nothing.
e.g. creatureEye(40, -20, 6, 7, creatureFeel({feel: "sleepy"}, clock), {skin: "#c98d4e", iris: "#5a3a1a"});
```

### `snap(u)`

```
A pose reached with a snap: first a small move the other way (the
anticipation), then fast to the pose and a little past it, then settling.
u: 0 to 1, how far through the move (between() gives one). Returns about -0.1 at first, a little past 1 in the
middle, and 1 at u = 1: multiply the move by it.
e.g. var reach = snap(clamp((t - 2) / 0.4)) * 30;
```

### `blend3(t, atProfile, atQuarter, atFront)`

```
---------- the turn of the head ----------
A head is drawn at a turn from -1 (profile, the face pointing the way the
figure faces) through 0 (the three-quarter view the kit was drawn in) to
1 (full face). Every feature has a place and a width at those three views,
keyed below, and view() blends them for any turn between, on a curve
through the three. The features sit on the front of an egg: as it turns
to the camera they spread and come to the middle; as it turns away they
crowd to the front, the far eye goes behind the nose, and the nose
becomes part of the outline.
t: the turn, -1 to 1. Returns the number on the curve that passes atProfile at -1, atQuarter at 0 and atFront
at 1.
e.g. blend3(0.5, 30, 2, -19)
```

### `blendPoints(t, P, Q, F)`

```
t: the turn, -1 to 1; P, Q, F: lists of [x, y], alike in length. Returns a new list: each point blended as
blend3() blends a number.
e.g. var head = blendPoints(0.5, HEAD_P, HEAD_Q, HEAD_F);
```

### `profilePiece(tip, side, drop, lady)`

```
The piece of a profile that stands before the skull: from inside the
forehead, out at the brow, down the nose, the lips and the chin, and back
into the jaw.
  tip     where the face draws the tip of the nose (V.tip): the piece is slid to it
  side    how far the profile has taken over (until it has, the chin is kept up inside the jaw)
  drop    how far the jaw has dropped to open the mouth
  lady    true for a lady's piece, false for a fellow's
Returns a Path2D in the head's pixels; it draws nothing.
e.g. var V = view(-1, true, null); pen.fill(profilePiece(V.tip, V.side, 0, true));
```

### `view(turn, lady, north)`

```
"lady" is true for a head with a lady's face: her profile's measure, or a fellow's.
"north" is a face of the north (northFace(), from look.north): its cheekbones, jaw and chin reshape the outline.
Where every feature of a head goes at a turn. turn: -1 (profile) to 1 (full face), default 0. Returns V, in the
head's pixels: the eyes (near, nearW, far, farW), the nose (nose, tip), the mouth (mouth, mouthW), the cheeks
(cheek, farCheek, farCheekR), the ears (ear, farEar 0 to 1), hairShift, the knots (bun, crown, nape: [x, y]),
the outlines (head, hairLady, hairMan: points for HEAD_Q's order), and how far it has turned (t, toProfile,
toFront, side: 0 to 1).
e.g. var V = view(0.5, true, null);
```

### `northFace(look)`

```
What a figure's face of the north is, from its look (null when it has none):
its shape's numbers and every one of NORTH. A child keeps a child's measure:
half of each change, a rounder jaw and a fuller chin.
look: the figure's look; it reads north (a name of NORTH_FACES; an unknown name warns and draws "round") and
build (below 0 a child). Returns {cheek, jaw, chin, wide, tilt, eyes, apart, lid, lidMan, browLow, browLowMan,
noseLow, fold, browArch, browHeavy, noseWide, lipsWide, lipsFull, eyeSmall}, or null. person() keeps it in
NORTH_FACE.
e.g. var north = northFace({north: "thai", build: -0.5});
```

### `ageLines(age, V)`

```
The lines of age, over a face that ladyFace() or manFace() has drawn, in
the head's own frame: two across the brow, three at the outer corner of
the near eye, one under each eye, the fold from beside the nose down past
each corner of the mouth, and the hollow of the cheek. "age" is 0 to 1:
the lines are firmer the older the face.
V: the head's view (view()), with V.face, the face's Path2D, to keep the lines on it. Returns nothing: it draws
with pen, in the head's pixels.
e.g. ageLines(0.7, view(0.2, false, null));
```

### `beard(colour, V, drop)`

```
A beard, over a face: a moustache that droops from under the nose past
each corner of the mouth, and a tuft that hangs from the chin. "drop" is
how far the jaw has dropped: the tuft goes down with it.
colour: the beard's CSS colour; V: the head's view (view()); drop: pixels the jaw has dropped, 0 when shut.
Returns nothing: it draws with pen, in the head's pixels.
e.g. beard("#d8d0c4", view(0.2, false, null), 0);
```

### `eye(x, y, wide, tall, shut, glance, outer, lashes, slant, bowed)`

```
One eye. It is an almond: the upper lid is a high arch, the lower lid is
nearly flat, and both meet in a point at each corner. The iris sits behind
the lids, so the upper lid always hides the top of it.
  wide, tall   half the width of the eye, and the height of its arch
  outer        -1 or 1: which corner is the outer one, where lashes grow
  lashes       0 for a fellow; 3 for the lady of the 1930s films, with lashes on her lid;
               1 for an eye as the paintings draw it: a fine lid line with a flick at
               the outer corner, a large dark iris that touches the lid, no lashes
  glance       where the iris sits: across, or [across, down]
  slant        -1 to 1: a feeling's lid. Above 0 a straight lid comes down over the inner
               half of the eye, lowest at the inner corner (anger); below 0 it comes down
               at the outer corner (sadness, worry). It reads where no brow can be seen,
               as under a head-cloth, and on a creature's eye
  bowed        true: shut, the eye bows up (^), as a laugh pushes the cheeks up under it
  x, y     the eye's middle, between its corners, in pen's pixels
  shut     true, false, or 0 to 1
Reads EYE_LIDS (the heavy lid of a face of the north, or the folded eye) and EYE_TEARS, which person() sets:
outside person() they are as the last figure left them. Returns nothing: it draws with pen.
e.g. eye(30, -277, 9, 4.6, false, [1, 0], -1, 1, 0, false);
```

### `tearsFrom(x, y, wide, tall, outer, shut)`

```
Tears from one eye (see EYE_TEARS): the lower lid brims with water, and a drop gathers at its middle toward the
outer corner, grows, and now and then lets go and runs down the cheek. They move with the clock, so a still frame
catches them on the way; the two eyes are out of step.
x, y, wide, tall, outer, shut: as eye() was given them. Reads EYE_TEARS (0 to 1) and clock. Returns nothing:
it draws with pen. eye() calls it.
e.g. EYE_TEARS = 0.8; tearsFrom(30, -277, 9, 4.6, -1, false);
```

### `slantedLid(x, y, wide, peak, outer, slant)`

```
The part of an eye left open under a slanted lid (see eye()): a Path2D
below a straight line from the outer corner to the inner, each end as high
as the slant leaves it ("peak": how high the lid's arch stands), and the line.
x, y, wide, outer, slant: as eye() takes them; peak in pixels. Returns {open: a Path2D, line: [x1, y1, x2, y2]};
it draws nothing.
e.g. var below = slantedLid(30, -277, 9, 8, -1, 0.6);
```

### `frownFold(x, y, feel, V)`

```
The fold or two that brows drawn together leave between them, in worry
and in anger: two short lines from the brows' height "y" down toward the
nose, either side of "x". Gone toward profile.
x, y in the head's pixels; feel: feelingOf()'s numbers (it reads worry and anger); V: the head's view (it reads
toProfile). Returns nothing: it draws with pen, or nothing when there is no fold.
e.g. frownFold(28, -293, feelingOf({feel: "concerned"}), view(0.2, true, null));
```

### `brow(x, y, wide, arch, heavy, tilt)`

```
a brow: thick where it starts, by the nose, and thin at its far end
"tilt" turns it about its middle: the inner end down for anger, up for sadness
x, y: its middle; wide: half its length; arch: how high its middle rises; heavy: how thick; all in pixels.
tilt in radians, default 0. Returns nothing: it draws in INK with pen.
e.g. brow(30, -292, 12, 9, 1.1, 0.2);
```

### `blush(x, y, r, strength)`

```
colour in a cheek: strongest in the middle ("strength", 0.42 unless told), gone at the edge, with no line
x, y: its middle; r: its radius, in pixels; strength: 0 to 1. Returns nothing: it draws with pen.
e.g. blush(-10, -250, 15);
```

### `northNose(V, lady)`

```
The nose of a face of the north (NORTH_FACE), for a lady ("lady" true) or a
fellow: a low bridge, a line only from below the eyes, a short nose with a
broad round tip, a wing flaring each side and a nostril under it, and a soft
shadow under the base. The far wing shows more as the face comes round; in
profile it all fades, as the kit's noses do, because there the nose is the outline.
V: the head's view (view()); lady: true for her measure. Reads NORTH_FACE, which must be set (person() sets it).
Returns nothing: it draws with pen, in the head's pixels.
e.g. NORTH_FACE = northFace({north: "round"}); northNose(view(0.3, true, NORTH_FACE), true);
```

### `ladyFace(shut, mouth, glance, V, feel)`

```
A lady's face, drawn in the head's pixels (middle (0, -286)): eyes, brows, nose, rouge, mouth.
  V      the view of the head for its turn (see view()): where each feature sits
  feel   {wonder, smile}, each 0 to 1
  shut     true, false, or 0 to 1: how far the lids are down
  mouth    mouthAt()'s shape, or null for a shut mouth
  glance   where the irises look: across, or [across, down], in pixels (saccade() gives one)
  feel     in full, feelingOf()'s numbers: it reads wonder, smile, fear, anger, sad, worry, laugh, full, browUp,
           eyes and lips
V.face (a Path2D of the face, which personHead() adds) keeps the far eye, the cheek and the mouth on the face.
Reads NORTH_FACE. Returns nothing: it draws with pen. person() calls it; a page draws a person instead.
e.g. ladyFace(false, null, saccade(t), view(0.3, true, null), feelingOf({feel: "happy"}));
```

### `manFace(shut, mouth, glance, V, feel)`

```
A fellow's face, drawn as ladyFace() draws hers, with the same arguments (shut, mouth, glance, V, feel). Reads
NORTH_FACE. Returns nothing: it draws with pen. person() calls it.
e.g. manFace(false, mouthAt(SUNG), 0, view(0, false, null), feelingOf({}));
```

### `stripe(left, mid, right, colour, width, kind)`

```
One woven band across a cloth: from "left" to "right", bowed toward "mid".
"kind" is nothing (a line), "zigzag", "diamonds", "dots", "braid" or
"roundels". What stands up from the band stands across it, whichever way
the band runs: (ux, uy) is the way along it, and (-uy, ux) the way across.
  left, mid, right   [x, y] in pen's pixels: the band's two ends and the point it bows toward
  colour, width      a CSS colour, and the line's width in pixels (for "checks" and "checks-odd", the squares' side)
  kind               also "checks" or "checks-odd": every other square; the two stacked make a check
Returns nothing: it draws with pen, and leaves its strokeStyle, fillStyle, lineWidth and lineJoin as it set them.
e.g. stripe([-30, 40], [0, 46], [30, 40], STYLE.gold, 3, "diamonds");
```

### `tier(long, wide, reach, phase, colour, deep, stripes, pushes)`

```
One tier of cloth, hanging from the waist: a skirt, a coat, or the hem of
a shirt. Cloth does not swing like a board. A wave runs down it: the waist
moves first and the hem follows a moment later, so the sides bend into
soft S-curves, and the side the cloth is leaving swells out.
  long, wide   how far down it hangs, and half its width at the hem
  reach        how far the hem swings to each side
  phase        where the wearer is in their rock from side to side
  deep         how deep the scallops of the hem are
  stripes      woven bands, each [how far down (0 to 1), colour, width, kind]: kind is
               nothing (a line), "zigzag", "diamonds", "dots", "braid" or "roundels";
               they bend with the cloth, and sag a little across it
  pushes       [x, y, reach] points under the cloth, such as knees, measured from
               the waist: an edge within "reach" of one moves out to cover it
  phase        radians: the rock's phase (a beat's 2 pi gives one swing a beat)
  colour       a CSS colour
  stripes      (kind may also be "checks" or "checks-odd": see stripe())
All lengths are in pen's pixels, with the waist at (0, 0). Reads BODY (its waist and hem) and clock. Returns
nothing: it draws with pen.
e.g. tier(120, 50, 10, clock * Math.PI * 2 / BEAT, "#a33a2a", 4, [[0.85, STYLE.gold, 3, "diamonds"]]);
```

### `curl(x, y, r)`

```
one rolled curl of hair, with the light on it
x, y: its middle; r: its radius, in pixels. Drawn in the person's hair colour, HAIR and HAIR_LINE (until
2026-10-21 always the kit's dark brown, and an elder's white hair had dark curls). Returns nothing.
e.g. curl(-40, -330, 8);
```

### `lock(x, y, long, wide, swing, phase, plain, shove)`

```
One lock of hair, hanging from (x, y) and ending in a rolled curl. The
root is fixed to the head. A wave runs down the lock, so the tip swings
the furthest and the latest, as the hem of a skirt does.
  long, wide   the length of the lock, and half its width
  swing        how far the tip swings to each side
  shove        [across, down]: a lag for the tip, from follow()
  phase        radians: where the swing is (tier()'s phase)
  plain        true: a straight lock that narrows to its tip, with no curl
Units are pen's pixels; drawn in the person's hair colour, HAIR and HAIR_LINE. Returns nothing.
e.g. lock(-40, -338, 150, 11, 6, clock * 3, true, follow("noi/tail", -40, -338, 50, 6, 40));
```

### `combed(lines)`

```
the lines a comb leaves in hair: each is [fromX, fromY, bendX, bendY, toX, toY]
lines: a list of such lines, in pen's pixels; they are drawn in HAIR_LINE and a light by turns. Returns nothing;
leaves pen's lineCap "round".
e.g. combed([[-30, -330, 0, -352, 34, -336], [-24, -322, 4, -344, 38, -326]]);
```

### `glove(x, y, angle, thumb, bare, open, nails, curls)`

```
A hand: a palm, fingers of two joints each, and a thumb. Every part is
drawn first a little fat in ink and then in colour, so the parts join
into one shape with one line round it, as a drawn hand has. Only short
lines between the fingers are left inside.
  angle    the way the hand points
  thumb    -1 or 1: the side the thumb is on, so a left hand is not a right hand
  bare     a lady's hand: skin, four slim fingers, a narrow wrist.
           Otherwise a white glove: three fat fingers and a rolled cuff.
  open     0 is a loose fist, 1 is a hand spread wide
  nails    true for a dancer's gold nail tips; "long" for the long curved nails of fon lep
A finger has three joints, as a real one has: at the knuckle, in the
middle and near the tip. Each bends a little more than the one before
it, so a closing finger rolls up. A thumb has two.
  curls    five numbers, 0 straight to 1 curled (the first finger to the little
           one, then the thumb): each finger then curls its own way. A hand
           model reads them from a video; REST_A and REST_B are a hand at
           rest. Below 0 a finger bends the other way, away from the thumb's side
  x, y     the wrist, in pen's pixels
  angle    in radians: 0 points along +x
Reads SKIN and clock (each finger moves a little by itself). Returns nothing: it draws with pen. It is the flat
hand (STYLE.hands "flat"); hand() is the one drawn in the round.
e.g. glove(40, -60, 1.2, 1, true, 0.6, false);
```

### `gestureOf(gesture)`

```
A hand of dance, whole: a name of GESTURES, or {from, to, u} for a hand
part of the way from one to the other; gives back the form, the wrist's
bend and the turn, mixed. A hand goes from one form to the next joint by
joint, and the thumb's pinch closes or opens with it.
gesture: a name of GESTURES ("jeeb"), or {from: name, to: name, u: 0 to 1}. Returns {curls, spread, arch: four
numbers, pinch, wrist, palm, down}: its curls, spread, arch and pinch are hand()'s pose, wrist the bend in
radians. An unknown name warns and gives "wong".
e.g. var g = gestureOf({from: "wong", to: "jeeb", u: 0.5});
```

### `danceHand(near, t)`

```
A dancer's lifted hands, unless a look names them: one in wong and one in
jeeb, as Thai dancers hold them, changing over every eight seconds, each
hand going from one form to the other in the first 1.2 s of the eight,
slowly, as a Lanna dancer's hands do (owner's reference, 2026-10-16).
near: true for the near hand (the two are out of step); t: seconds. Returns a name of GESTURES, or {from, to,
u} while it changes: what gestureOf() takes.
e.g. var g = gestureOf(danceHand(true, t));
```

### `pinchThumb(t0, t1, t2, tip, amount)`

```
The thumb of a pinch: from its root t0 to the pad of a fingertip ("tip" as
hand() keeps it: [point, way, back of the joint, across]), the two bones of
the thumb bending out at their joint, toward the thumb's side and the back
of the hand, as a thumb does when it presses a fingertip; its root comes
forward too, as a thumb's does to meet a finger (a curled finger's tip is
well in front of the palm, out of reach of a root left at the wrist).
"amount" takes it there from where it was (t0, t1, t2), so a hand can
close into the pinch. It gives back the thumb's three points.
t0, t1, t2: the thumb's root, joint and tip, [x, y, z] in the hand's frame; tip: [point, way, back, across],
each [x, y, z]; amount: 0 to 1. Returns [root, joint, tip], each [x, y, z]. hand() calls it.
e.g. var thumb = pinchThumb([-4, 5.7, -1], [3, 15, -3], [5, 23, -6],
                        [[24, 8, -4], [1, 0, 0], [0, 0, 1], [0, 1, 0]], 0.8);
```

### `hand(x, y, angle, pose)`

```
A bare hand drawn in the round. x, y, angle and pose are listed at the top of this section (pixels and radians,
as glove() takes them). Reads clock (a little life in the fingers, unless pose.still). Returns nothing: it draws
with pen.
e.g. hand(40, -60, 1.2, {curls: REST, thumb: 1, palm: 0.2});
```

### `foot(x, y, lifted, small)`

```
A bare foot, as the murals and paintings draw one: its heel at (x, y) and
its toes pointing the way the person faces. The top of the foot slopes
down from the ankle to the toes; the big toe is the first of four bumps.
A lifted foot points its toes down, as a real ankle lets it.
x, y: the heel, in pen's pixels; lifted: 0 on the ground to 1 lifted (the toes tip down by up to 0.45
radians); small: true for a child's foot. Returns nothing: it draws with pen in SKIN.
e.g. foot(-6, 0, 0, false);
```

### `shoe(x, y, lifted, small)`

```
A shoe, with its heel at (x, y) and its toe pointing the way the person
faces. A lifted foot tips its toe down, as a real ankle lets it.
x, y: the heel, in pen's pixels; lifted: 0 on the ground to 1 lifted; small: true for a child's. Returns nothing:
it draws a brown shoe with pen.
e.g. shoe(-6, 0, 0.3, false);
```

### `bone(ax, ay, bx, by, wideA, wideB, swell)`

```
the outline of one bone, from (ax, ay) to (bx, by): half as wide as
"wideA" at its start and "wideB" at its end, round at both ends
Points and widths are in pen's pixels; swell: how far the sides bow out beyond the ends, in pixels. Returns
nothing: it begins a new path on pen and closes it, but neither fills nor inks it.
e.g. bone(0, -100, 10, -40, 12, 9, 2); shape(SKIN);
```

### `paintBone(ax, ay, bx, by, wideA, wideB, colour)`

```
One bone, painted: its colour, and a shadow down the side that is away
from the light. The shadow is what is left when the same shape is painted
again a little toward the light, inside the first one.
Points and widths are in pen's pixels; colour a CSS colour. It is not inked. Returns nothing.
e.g. paintBone(0, -100, 10, -40, 12, 9, SKIN);
```

### `bendOf(key, gain)`

```
Which of its two elbows an arm takes: 1 for the first, -1 for the second,
and between the two while it swings from one to the other. "gain" is how
much better the first is than the second. With a key the arm remembers:
it keeps the elbow it has unless the other is better by a clear margin,
and a change takes a fifth of a second. A cut (no memory, or the clock
gone back, or stopped a while) takes the better elbow at once.
key: a name for the arm ("noi/armA"), or nothing for no memory; gain: a number, above 0 when the first elbow
is better. Returns -1 to 1. Reads clock; keeps its state in BENDS[key].
e.g. var side = bendOf("noi/armA", 5);
```

### `armJoints(wx, wy, upper, lower, outward, key, sure)`

```
Where an arm's wrist and elbow are, measured from its shoulder, for a wrist
asked for at (wx, wy): [wristX, wristY, elbowX, elbowY]. Two elbows reach
any wrist, one on each side of the line to it. Each is first made to keep
the two rules; then the arm takes the one it likes better: back and down
for a hanging arm, out to its own side and down for a lifted one, and the
one that leaves the wrist nearer to where it was asked for.
  upper, lower   the lengths of the two bones
  outward        1 or -1: which side of the body the arm is on
  key            a name to remember the bend by (or nothing)
  sure           0 to 1: how sure the way to the wrist is. A hand lying on
                 its own shoulder points nowhere in particular, and the
                 arm then leans on the way it pointed the frame before.
                 2: the wrist has a place to be (a reach). Then the elbow
                 that brings it there wins over the one the arm likes
                 better, and the wrist is there at once while the elbow
                 comes round
  wx, wy         the wrist asked for, from the shoulder, in pixels (down is +y)
Changes BENDS[key] when a key is given (bendOf(), and the way it points).
e.g. var at = armJoints(30, 100, 62, 58, 1, "noi/armA", 1);
```

### `limb(x1, y1, x2, y2, upper, lower, wide, colour, prefer, open)`

```
Two bones from (x1, y1) toward (x2, y2), and where the joint between them
must be. A limb cannot stretch: if the end is too far it stops short, and
the nearer the end is, the more the joint bends. Of the two ways a joint
could bend, "prefer" picks one: it is given a point and answers with a
number, and the higher number wins. A caller that has found the joint
itself, as an arm does by rules of its own, gives it as [x, y] instead.
  upper, lower   the lengths of the two bones
  wide           half-widths: [at the start, at the joint, at the end]
  open           how much of the first bone, from its start, has no ink line
                 (0 to 1). An arm is open at the shoulder: a line there would
                 draw a ball on the chest, and the ball would turn like a wheel.
  x1, y1, x2, y2   the root and the end asked for, in pen's pixels
  colour           a CSS colour
  prefer           function (point) giving a number, or the joint itself as [x, y]
Returns [endX, endY, jointX, jointY], in pen's pixels. It draws with pen.
e.g. limb(20, -190, 30, -22, 106, 102, BODY.leg, "#3d4f78", function (knee) { return knee[0]; });
```

### `arm(shoulderX, shoulderY, hand, outward, colour, key)`

```
An arm from a shoulder to a hand: an upper arm, an elbow and a forearm.
A hanging arm bends its elbow back; a lifted arm bends it out to the side;
an arm that reaches forward lets it drop. "hand" is the way the hand lies;
"key" names the arm, so that it remembers its bend from frame to frame.
Where the joints go is armJoints(), with its two rules.
  shoulderX, shoulderY   the shoulder, in pen's pixels
  hand                   [across, down] from the shoulder, in pixels; or handFor()'s [x, y, 1]
  outward                1 or -1: which side of the body the arm is on
  colour                 the sleeve's or the skin's CSS colour
Draws the arm, not the hand, as thick as BODY.arm. Returns [wristX, wristY, elbowX, elbowY], in pen's pixels.
Changes BENDS[key].
e.g. var wrist = arm(44, -112, [14, 82], 1, SKIN, "noi/armA");
```

### `handFor(dx, dy)`

```
The hand to give an arm so that its wrist comes to (dx, dy) from its
shoulder. arm() does not put the wrist where the hand is given: a hand
given near folds the arm and one given far straightens it. This is that
rule turned round, for a wrist that has to be at a place: on a rope, in a
friend's hand, against the other wrist. A wrist can be 32 to 119 from its
shoulder.
dx, dy: where the wrist must be, from the shoulder, in pixels. Returns [x, y, 1], to pass to arm() (or as a
look's handA, handB).
e.g. arm(44, -112, handFor(30, 60), 1, SKIN, "noi/armA");
```

### `legOf(hipX, hipY, ankleX, ankleY, thin, colour, longer)`

```
A leg from a hip to an ankle: a thigh, a knee and a shin. A knee bends
forward, the way the person faces, and never back.
  hipX, hipY, ankleX, ankleY   in pen's pixels
  thin                         true under a skirt: shorter, thinner bones (BODY.legThin; else BODY.leg)
  colour                       a CSS colour
Returns [ankleX, ankleY, kneeX, kneeY], as limb() does. It draws with pen.
e.g. legOf(20, -190, 30, -16, false, "#3d4f78", leggyOf(0));
```

### `wrap(ax, ay, bx, by, wideA, wideB, colour, bands, from, to, open)`

```
A length of cloth round the legs of one who sits, or the two legs together
in trousers: a bone from (ax, ay) to (bx, by), its line, and the woven
bands that go across it.
  bands      as tier() takes them, or nothing
  from, to   how far down the whole cloth this length begins and ends (0 is the waist, 1 the hem)
  open       how much of it, from its start, has no line (0 to 1)
Points and widths are in pen's pixels (widths are half-widths, as bone() takes them); colour a CSS colour.
Returns nothing: it draws with pen.
e.g. wrap(4, -54, 92, -21, 24, 17, "#2f3f6e", SINS[0][1], 0.1, 0.5, 0.35);
```

### `seated(kind, hipY, colour, bands, slight, longer)`

```
The lower body of one who sits on the floor, drawn about the hips at
(0, hipY). The ground is y = 0, and the person faces along x.
  kind     "side": both legs folded to one side, the knees to the front and the feet out
           behind (phap phiap); "cross": cross-legged
  colour   the colour of the trousers, or of the cloth
  bands    the woven bands of a skirt, a pha sin or a sarong, as tier() takes them, from
           the waist (0) to the hem (1); nothing for trousers
  slight   a lady's smaller feet
  longer   how much longer than the cartoon's the legs are (1 unless a build is given)
It gives back where the joints are: [knee B, knee A, ankle B, ankle A].
  kind     also "astride": one who rides, the near leg hanging down the animal's side (in cloth, both legs, as
           side-saddle)
  hipY     the hips' height, in pen's pixels: below 0, above the ground
It draws in pen's frame as it is (the caller has moved pen to the person's place on the ground).
e.g. var joints = seated("cross", -60, "#3d4f78", null, false, 1);
```

### `leggyOf(build)`

```
How much longer than the cartoon's a figure's legs are, for its build: up
to 1.3 times at build 1, and down to 0.85 at -1, a child's (see person()).
build: -1 to 1, default 0. Returns 0.85 to 1.3.
e.g. leggyOf(-1)   // 0.85
```

### `tattoo(ax, ay, bx, by)`

```
The tattoo of a man of the north on one thigh, from the hip at (ax, ay) to the
knee at (bx, by): rows of small dark marks across the leg, the way the ink
reads from a few steps off. It is drawn under the cloth, so only what the
cloth leaves bare shows: nothing under a cloth to the ankle, a hand's width
under one to the knee, the whole thigh under one hitched up for work.
Points in pen's pixels. Returns nothing: it draws with pen.
e.g. tattoo(10, -190, 30, -100);
```

### `bangles(angle, count)`

```
gold rings round a wrist, drawn across the forearm: "angle" is the way the arm points
Drawn about pen's origin, which is the wrist: count rings in STYLE.gold, from the wrist up the forearm (until
2026-10-21 it drew count + 1, and every look's count was one less than the rings it showed).
count: a whole number. Returns nothing.
e.g. pen.translate(wristX, wristY); bangles(1.2, 2);
```

### `cast(name, more)`

```
name: a name of CAST ("lady"; an unknown one warns and gives a bare figure); more: the look's keys to change,
or nothing. Returns a new look; CAST is not changed.
e.g. person(700, GROUND, cast("lady", {late: 0.5}));
```

### `takong(rows, long)`

```
the bands of a man's sarong
The pha ta kong, the black-and-white check a man of the north wore (Manasaem):
bands of squares as close as the squares are wide, every other row shifted,
make the check. "rows" squares down a cloth "long" pixels long at size 1: a
cloth to the knee is about 112 long, to the ankle about 196.
rows: how many rows of squares; long: the cloth's length in pixels at size 1. Returns a list of bands, as tier()
and look.sarong take them ([colour, bands]).
e.g. var look = cast("farmer", {sarong: ["#efe6d2", takong(9, 112)]});
```

### `poseAt(t, keys, hold)`

```
---------- poses ----------
A pose is a "look" with numbers in it: where the hands are, how far the
body bends, sits, tilts. poseAt(t, keys, hold) gives the look at time t
from a list of [time, look] keys: it holds each key for "hold" of the way
to the next (half, unless told otherwise), then eases into the next, the
way a dancer hits a position and holds it. A track read from a video, a
pose every tenth of a second, plays with hold 0. Numbers and pairs of
numbers are eased; anything else is taken from the key being held. A key
[time, look, "snap"] is reached the way a cartoon hits a pose: a small move
the other way first, then fast, a little past, and settling.
  t      seconds; past the last key's time it starts again from the first (the keys loop)
  keys   [[time, look], [time, look, "snap"], ...]: at least two, the times rising
  hold   0 to 1, default 0.5
Returns a new look; the keys are not changed.
e.g. var keys = [[0, {handA: [30, -80]}], [2, {handA: [60, 20]}], [4, {handA: [30, -80]}]];
     person(700, GROUND, Object.assign(cast("dancer"), poseAt(t, keys)));
```

### `jointOf(x1, y1, x2, y2, upper, lower, prefer)`

```
where the joint of two bones lies, from (x1, y1) toward (x2, y2); the
same answer limb() draws, so a stick figure and a person agree
Points and lengths in pixels; prefer: function (point) giving a number, the higher one wins. Returns [x, y].
e.g. var knee = jointOf(20, -190, 30, -22, 92, 90, function (k) { return k[0]; });
```

### `stick(x, y, look)`

```
A stick figure standing on (x, y), in the same pose a person would take
from the same look: the movement guide, drawn as joints and bones.
x, y: where it stands, in pen's pixels; look: a person's look (it reads size, sit, handA, handB, raise, bend,
tilt, turn, glance, dance, face, and warns about names LOOK_KEYS lacks). Returns nothing: it draws with pen.
e.g. stick(700, GROUND, {handA: [30, -80], bend: 0.1, size: 1.3});
```

### `stroll(t, from, to, start, look)`

```
It reads BEAT and the look's size, stride, skirt, sin, sarong and patoi; the look given is not changed.
e.g. var walk = stroll(t, 200, 1100, 2, cast("lady")); person(walk.x, GROUND, walk.look);
```

### `person(x, y, look)`

```
person() draws by personDrawn(), below. Should that fail part-way, what it had set is put back before the error
goes on: the pen on the sheet (not on her layer, where every later frame would be drawn unseen), the usual skin,
hair and body, and her layers with nothing left open on them. A page that keeps drawing after an error, as the
cartoon maker does, then draws its next frame as it would have.
```

### `personDone()`

```
What person() sets for one person, back as it is for whatever is drawn next.
```

### `unwound(brush)`

```
Every save() of a sheet put back, after an error left some open; restore() with none open does nothing, and no
drawing nests anywhere near this deep.
```

### `personDrawn(x, y, look)`

(no comment)

### `personLook(fig)`

```
person(), stage 1 of 8: the look worked out into this person's numbers for this frame: who they are, whether they sit,
the beat, the squash, the build, the arms' rest, the sway, the kick, the tips and the turn
```

### `personGround(fig)`

```
person(), stage 2 of 8: on the ground, before the figure: its shadow, and the dust of a landing
```

### `personLegs(fig)`

```
person(), stage 3 of 8: the figure's own frame, and the legs: a thigh and a shin each, the walk, the feet, and the cloth
a sitter's legs are in
```

### `personTrunk(fig)`

```
person(), stage 4 of 8: at the waist: the breath, the spine, the chest's outline, the shoulders that work with the
arms, the back of the sabai, and the skirt
```

### `personReach(fig)`

```
person(), stage 5 of 8: the arms worked out before they are drawn: the trunk, the shoulders, where each hand goes, the
hands and the far arm
```

### `personBody(fig)`

```
person(), stage 6 of 8: the body painted over the skirt: the torso and its shading, the chest, the cloth, the neck
```

### `personHead(fig)`

```
person(), stage 7 of 8: the head, in a frame of its own: the knots and ornaments, the brow, cheek, jaw and chin, the hair,
the ears, the face, and the blink
```

### `personArms(fig)`

```
person(), stage 8 of 8: the arms, drawn last over the body and the head; what the hands hold; her layer put over the
parasol; and the usual pen again
```

### `scrollCloud(brush, x, y, size, fill, line, foot)`

```
A scroll cloud, as a thangka paints one: a flat underside, a row of round
lobes along the top with a smaller row above them, every lobe outlined,
and a curl at each end where the cloud rolls under itself. "brush" is
the canvas to paint on; "fill" and "line" its colours. "foot" is the colour
that gathers toward its underside: a pale blue unless told, and a thangka
gives an ochre cloud a green one.
brush: a 2D context (pen, or a set's hidden sheet); x, y: its middle, in that canvas's pixels;
size: 1 is about 300 wide; fill, line, foot: CSS colours, foot "#rrggbb". Returns nothing; brush is left as it
was found.
e.g. scrollCloud(pen, 400, 160, 0.8, "#f6f1e6", "rgba(120, 130, 150, 0.65)");
```

### `cloud(x, y, size, dark)`

```
A cloud drawn live, so it can drift. STYLE.clouds is "scroll" (a thangka's
cloud) or "soft" (three blurred blobs). "dark" is an evening colour.
x, y: its middle, in the sheet's pixels; size: 1 is about 300 wide; dark: a CSS colour for an evening cloud,
or nothing. Reads STYLE.clouds. Returns nothing: it draws with pen.
e.g. cloud(300 + t * 8, 180, 0.9);
```

### `blend(a, b, amount)`

```
a colour between two: "#rrggbb" a and b, "amount" of the way from a to b. Each
channel is mixed as light (its square), not as the number written, so the
middle of a blend between two unlike colours keeps its brightness instead of
going grey or dark the way plain averaging does.
a, b: "#rrggbb" colours (no other form); amount: 0 gives a, 1 gives b. Returns "#rrggbb".
e.g. blend("#5f9a4e", "#f6f2a4", 0.3)
```

### `leafPath(brush, long, wide, bow)`

```
The shape a petal and a leaf share: pointed, widest below its middle, from
its foot at (0, 0) to its tip "long" above. "bow" bends the tip to one side.
brush: a 2D context; long and wide in its pixels (wide is about its half-width); bow: a share of long,
default 0. Returns nothing: it begins a new path on brush and closes it, unfilled.
e.g. leafPath(pen, 40, 10, 0.2); pen.fill();
```

### `paintPetal(brush, long, wide, bow, pale, deep, line)`

```
One petal: pale at its foot and its colour at the tip, fine veins that fan
toward the tip, and a thin line round it.
brush: a 2D context, its origin at the petal's foot; long, wide, bow: leafPath()'s; pale, deep, line: CSS
colours. Returns nothing; leaves brush's strokeStyle, fillStyle, lineWidth and lineJoin as it set them.
e.g. paintPetal(pen, 34, 11, 0.1, "#fff6ea", "#f28fa8", "rgba(120, 40, 60, 0.8)");
```

### `paintLeaf(brush, long, wide, bow, deep, pale, line, rib)`

```
One leaf: deep at its foot and lighter at the tip, a rib up its middle,
and a line round it.
brush: a 2D context, its origin at the leaf's foot; long, wide, bow: leafPath()'s; deep, pale, line, rib: CSS
colours, rib a pale gold unless told. Returns nothing.
e.g. paintLeaf(pen, 50, 12, 0.22, "#1f5a48", "#6fb268", "rgba(20, 50, 40, 0.85)");
```

### `lotus(brush, x, y, size, colour, open)`

```
A lotus, seen from the side, as the mural draws it: the lowest petals
droop, the outer ring lies wide, the next ring rises and the heart stays
shut. Each petal is pale at its foot and "colour" at its tip. "open" runs
from 0, a bud, to 1, the flower full out. Thai and Tibetan painting put
one wherever there is room, and in the hand of anyone holy.
brush: a 2D context; x, y: the cup at its foot; size: 1 is about 70 across; colour: the tips', "#f28fa8"
unless told; open: 0 to 1, default 1. Returns nothing; brush is left as it was found.
e.g. lotus(pen, 820, 700, 1.4, "#f28fa8", 0.8);
```

### `lotusLeaf(brush, x, y, size, tilt, colour)`

```
A lotus leaf on its stem, seen from the side and a little from above: a
shallow cup. We see its underside, deep green, with veins running down to
the stem, and over the near rim a slice of the top, lighter, with a wavy
edge. The stem joins it at (x, y); "tilt" leans it.
brush: a 2D context; size: 1 is about 104 across; tilt: radians, default 0; colour: "#rrggbb", "#5f9a4e"
unless told. Returns nothing; brush is left as it was found.
e.g. lotusLeaf(pen, 760, 720, 1, -0.2);
```

### `stemPoint(x0, y0, x1, y1, bow, u)`

```
A point on a stem: u is 0 at its root (x0, y0) and 1 at its top (x1, y1).
"bow" swings the lower half to one side and the upper half back, so the
stem is a long S.
All in pixels; u: 0 to 1. Returns [x, y]: the same curve stemOf() draws.
e.g. var p = stemPoint(0, 0, 40, -200, 30, 0.5);
```

### `stemOf(brush, x0, y0, x1, y1, bow, colour, prickles)`

```
A stem: one long curve, lighter than the leaves, with a line of its own.
A lotus stem carries small prickles.
brush: a 2D context; from (x0, y0) to (x1, y1), with stemPoint()'s bow, in pixels; colour: a CSS colour;
prickles: true for a lotus stem. Returns nothing; leaves brush's lineCap "round".
e.g. stemOf(pen, 700, 900, 740, 700, 40, "#b7cf86", true);
```

### `lotusClump(brush, x, base, size, seed, colour, t)`

```
A clump of lotus, all its stems from one root at (x, base): flowers, buds
and leaves, each at a height and a lean of its own, with curling blades at
the root. "seed" changes the clump; "colour" is the flowers'.
Seven to nine stems from one root. Given a second t the clump stirs in a breeze,
and no frame depends on the one before: each stem's tip sways on two gusts of
different pace (the taller the stem, the further), the stem bending with it rather
than sliding; the leaves rock on the water; and an open flower breathes, its petals
closing a little and opening again.
brush: a 2D context; size: 1 is about 260 tall; seed: a whole number, default 0; colour: the flowers', as
lotus() takes it; t: seconds, or nothing for a clump that stands still. Returns nothing.
e.g. lotusClump(pen, 900, 930, 0.8, 3, "#f28fa8", t);
```

### `waves(brush, x, y, wide, tall, colour, t)`

```
Water, as the murals draw it: rows of overlapping arcs, like scales, each
with a smaller arc inside it. The rows further off are smaller and fainter.
Rows of overlapping arcs, the water of the murals. Given a second t the water
moves, and no frame depends on the one before: each row slides along at a pace
set by how far off it is (the far rows slowly, the near rows faster, as a camera
passing would show them), every arc rides two swells of different length that
cross at different speeds, and a few glints along the far water brighten and fade.
brush: a 2D context; x, y, wide, tall: the box it fills, in pixels; colour: a CSS colour, a pale white unless
told; t: seconds, or nothing for still water. Returns nothing; brush is left as it was found.
e.g. waves(pen, 0, 780, WIDE, 200, "rgba(255, 250, 230, 0.6)", t);
```

### `ripples(brush, rings, t)`

```
Drops on the water: rings is [[x, y, at], ...], and from second "at" a ring
spreads from (x, y) for 2.5 seconds, a second ring behind it, fading as it
widens. The film says when a fish rose or a drop fell, so nothing is remembered.
brush: a 2D context; rings: [[x, y, at], ...], x and y in pixels, at in seconds; t: seconds, on the same clock.
Returns nothing; brush is left as it was found.
e.g. ripples(pen, [[700, 860, 4], [920, 880, 6.5]], t);
```

### `pond(brush, x, y, wide, tall, flow)`

```
A pond: a pool of graded water with a line along its bank and rows of
wave arcs on it. The box (x, y, wide, tall) holds it: its near bank is the
bottom of the box, and its far bank curves across the top.
A pool with a bank line. Given flow.t the water moves (see waves), and
flow.rings are drops on it (see ripples).
brush: a 2D context; x, y, wide, tall: in pixels; flow: {t: seconds, rings: as ripples() takes them}, or
nothing for still water. Returns nothing; brush is left as it was found.
e.g. pond(pen, 300, 760, 900, 220, {t: t, rings: [[700, 860, 4]]});
```

### `fish(brush, x, y, size, facing, colour)`

```
A fish in the water, in profile: "facing" is 1 or -1. Once an orange cartoon fish; since 2026-10-20 (owner:
"remove the orange fish from the kit or update their look to be more consistent with the kit style") one of the
kit's native fish of a Lanna pond (nativeFish, below), as big as the old one was: a warm colour asks for the mud
barb, whose fins are red, any other for the gourami. Its tail sweeps on the kit's clock.
brush: a 2D context; x, y: its middle; size: 1 is the old fish's size; facing: 1 right or -1 left, default 1;
colour: "#rrggbb" or nothing. Reads clock. Returns nothing.
e.g. fish(pen, 640, 840, 1, -1, "#e8873a");
```

### `nativeFish(brush, x, y, size, facing, kind, t)`

```
kind: one of NATIVE_FISH (an unknown kind is drawn as a gourami); t: seconds, default 0. Returns nothing;
brush is left as it was found.
e.g. nativeFish(pen, 640, 850, 1, 1, "snakehead", t);
```

### `blossom(brush, x, y, r, colour)`

```
A small flower of five round petals, pale at their rims, with a gold heart
brush: a 2D context; x, y: its heart; r: its radius in pixels; colour: the petals' heart, a CSS colour.
Returns nothing.
e.g. blossom(pen, 400, 600, 8, "#f28fa8");
```

### `flowerSpray(brush, x, base, size, colour, seed)`

```
A flowering plant, as a thangka paints one: a curving stem, leaves up it
on both sides (deep green, lighter at the tip, with a pale rib), and at
its top a round flower of three rings of petals, each ring pale at its
rim and "colour" toward the heart. "seed" changes the plant.
brush: a 2D context; x, base: its root on the ground; size: 1 is 150 to 220 tall; colour: a "#rrggbb", "#f08a5c"
unless told; seed: a whole number, default 0. Returns nothing; brush is left as it was found.
e.g. flowerSpray(pen, 200, GROUND, 0.9, "#f08a5c", 2);
```

### `leafPad(brush, x, y, r, colour, seed)`

```
A pad of leaves: a cluster of round lobes with one line round the whole
cluster, deep green at its heart and lighter at its rim, and small leaves
marked on it. A tree's foliage is pads, not one blob.
brush: a 2D context; x, y: its middle; r: its radius in pixels; colour: "#rrggbb"; seed: any number (give one:
it turns the lobes). Returns nothing.
e.g. leafPad(pen, 300, 500, 60, "#3f7a4a", 4);
```

### `birds(t, x, y)`

```
A flock of birds, far off: each is two strokes that flap, and they fly
in a loose line, each a little behind the one before.
t: seconds; x, y: the first bird, the rest behind it to the left, in the sheet's pixels. Returns nothing: it
draws six birds in INK with pen.
e.g. birds(t, 900 + t * 40, 220);
```

### `crowd(t, y, slide, lanterns)`

```
People far away, watching: no ink line, only soft shapes that bob. As a
mural draws a crowd, they stand in rows: the further row is higher on the
picture and smaller, and even the furthest face has eyes and a mouth.
Every so often one holds up a red paper umbrella, or carries a gong.
  lanterns   true in the evening: some hold a lantern
  t        seconds: they bob on the beat (hop()) and wave
  y        the foot of the nearest row, in the sheet's pixels; the others stand higher
  slide    pixels the rows have slid to the left (the camera passing), 0 for none
Returns nothing: it draws three rows across the sheet with pen.
e.g. crowd(t, 820, t * 30, false);
```

### `dog(x, y, t, how)`

```
A dog that trots. Its body, neck, legs and tail are painted the way a
hand is: all of them first in ink, a little fat, then all of them in
colour. So one line goes round the whole dog, and no line cuts a leg off
from the body. A leg is two bones, and its knee bends as it steps.
how: {feel: a feeling, as a person's (creatureFeel())}: its head is carried
high or low, its ears go up or back, its tail wags or droops, its brows
and its mouth show it, and its eyes close, slant or go wide.
x, y: where its feet stand, in the sheet's pixels; it faces right and is about 140 long. t: seconds (it
trots on the beat). how: {feel}, or nothing; another name warns. Returns nothing: it draws with pen.
e.g. dog(500, GROUND, t, {feel: "happy"});
```

### `roosterWing(x, y, angle, colour, open)`

```
A rooster's wing, from its root at (x, y) of the pen, turned by "angle"
(0.35 folded; more lifts it up over the back, less lowers it): a few
feathered curves, as rooster() draws it. "open", 0 to 1, spreads it, longer
and broader, as a wing that beats or is held out is.
x, y, in pen's pixels; angle in radians; colour a CSS colour; open 0 to 1, default 0. Returns nothing.
e.g. roosterWing(-6, -38, 0.35, "#f0dcc0", 0);
```

### `rooster(x, y, t, bird)`

```
A rooster. It crows once every two beats, in three parts, as an animator
would time it: it sinks first (the part that makes the crow read), then
stretches its neck up and throws its head back with its beak open and its
wings out, then settles. "stretch" is below 0 while it sinks and runs up to
1 at the top of the crow.
Its look, "bird", if given, makes it do something else, and it crows only
when nothing is asked of it (owner, 2026-10-17: a chicken that runs a few
steps, jumps up flapping and scurries off; "spend some time on the framework
and chicken behaviors"; a second chicken that takes fright with it):
  step   a number that grows a step at a time while it runs: its legs run,
         a foot lifting as it swings forward, the body leans forward and
         bobs, and the head reaches forward, pumping with the steps
  flap   0 to 1: both wings beat, up over the back and down, eight times a
         second (the far wing shows above the body as it rises), as in a jump
  wings  0 to 1: both wings held out and up a little, shivering, as a
         chicken holds them when it scurries
  lean   how far it leans forward running (radians; 0.2 unless told)
  peck   0 to 1: it tips forward from the hips and reaches down until its
         beak is at the ground (roosterForage() gives a forager's pecks)
  alarm  0 to 1: a fright: the head high and drawn back, the body upright,
         the comb shaking, the eye wide
  sink   0 to 1: it crouches, the body down on bent legs and the head drawn
         in, as before a spring and on landing
  face   1, facing right, or -1, left
  hen    true: a hen (HEN_COAT), smaller, which never crows
  feel   a feeling, as a person's (creatureFeel()): surprise is its fright,
         sleep and fullness settle it down, sadness drops its head and
         tail; a brow shows anger, sadness and worry, a laugh gapes the
         beak on each "ha"; only a happy, a neutral or an angry rooster crows
roosterBolt() puts them together into a whole fright and flight.
x, y: where its feet stand, in the sheet's pixels; t: seconds (it crows on the beat); bird: its look, as above,
or nothing (other names warn). Returns nothing: it draws with pen (and a note of music while it crows).
e.g. rooster(600, GROUND, t, {hen: true, peck: roosterForage(t, 2)});
```

### `roosterForage(t, seed)`

```
A forager's pecking, for rooster()'s peck at second t: its head low,
looking, now and then a peck or a few quick pecks at the ground, each down
in a tenth of a second and up in a fifth, and now and then its head up a
while, looking about. "seed" gives each bird its own.
t: seconds; seed: any number, default 0. Returns 0 to 1: the peck to give rooster().
e.g. rooster(600, GROUND, t, {peck: roosterForage(t, 1)});
```

### `roosterBolt(s, plan)`

```
A rooster (or a hen) that something frightens, s seconds after the fright
(owner, 2026-10-17: "have the chicken run a few steps and then jump into the
air flapping its wings but then come down and scurry off until it is off
screen"). It starts up, its head high and its eye wide, jumping a little
where it stands, and crouches; runs a few steps, faster and faster, its
wings coming out; hops up with its wings beating, leaning back, and comes
down, crouching as it lands; and scurries off with its wings held out,
faster than it ran, until it is out of the picture. One that does not hop
runs straight off as fast as a scurry. Its legs go on from step to step all
through: in the hop they hold the stride they left the ground in.
plan: {face: -1 to run left; hop: false for one that only runs; peck: how
far down its head was when the fright came, so it comes up from there; hen:
true for a hen}. It gives back {x, y, look}: how far it has gone from where
it stood (x the way it runs; y up from the ground, so below 0) and the look
for rooster(). Before the fright (s below 0) it stands.
s: seconds since the fright (below 0: before it). Returns {x, y, look}, x and y in pixels.
e.g. var b = roosterBolt(t - 3, {face: -1}); rooster(600 + b.x, GROUND + b.y, t, b.look);
```

### `feather(x, y, turn, long, colour)`

```
A feather: a quill and a soft vane, "long" from end to end, its middle at
(x, y), turned by "turn" (0: the root at the left, the tip at the right).
x, y, long in pen's pixels; turn in radians; colour a CSS colour. Returns nothing.
e.g. feather(600, 800, 0.3, 22, "#fff6e6");
```

### `fallingFeather(x, y, ground, age, seed, colour, drift)`

```
A feather that came loose at (x, y) "age" seconds ago and falls to the
ground at "ground" (owner, 2026-10-17: "When the chicken jumps have a small
feather fall and descend to the ground and fade away"). It falls as a
feather does: slowly, swinging from side to side, quickest through the
middle of a swing and, at the ends, tipping up and rising a little before
it swings back; it carries on "drift" the way it was going before the air
stops it; it lands, lies flat a moment and fades. "seed" gives each its own
swing. Nothing is drawn before it comes loose or after it has gone.
x, y, ground in the sheet's pixels; age and drift: seconds, and pixels it carries sideways (default 0); seed:
any number; colour: a CSS colour, the rooster's white unless told. Returns nothing: it draws with pen, or
nothing at all.
e.g. fallingFeather(620, 760, GROUND, t - 4.2, 1, "#c98b4e", 40);
```

### `sun(x, y, t, how)`

```
The sun. STYLE.sun is "flames" (a gold disc ringed with the flame scrolls
of a thangka, which turn and swell on the beat) or "face" (the smiling sun
of a 1930s cartoon). how: {feel: a feeling (creatureFeel())}, for the face:
its pie eyes under their lids, a brow over each, the smile turned or opened.
x, y: its middle, in the sheet's pixels (the disc is about 150 across); t: seconds (it swells on the beat and
its flames turn); how: {feel}, or nothing; another name warns, for the face. Returns nothing: it draws with pen.
e.g. sun(1200, 200, t);
```

### `lantern(x, y, size)`

```
A khom loi: a paper lantern that flies because the air in it is hot. The
paper is brightest low down, by the flame, and darker toward the closed
top. Thin bamboo hoops show through it. It leans a little one way and
then the other as it climbs, and its flame never holds still.
x, y: its middle, in the sheet's pixels; size: its width in pixels (it was drawn 40 wide), the glow round it
about seven times that. Reads clock. Returns nothing: it draws with pen.
e.g. lantern(600, 400 - t * 30, 40);
```

### `tree(brush, x, base, size)`

```
A big tree with a round canopy, as the murals paint one: a trunk that
forks, drawn as a shape with a line round it, and its leaves in pads.
brush: a 2D context; x, base: the foot of its trunk; size: 1 is about 470 tall and 400 across. Returns nothing;
brush is left as it was found.
e.g. tree(pen, 1200, GROUND, 0.9);
```

### `leafClump(brush, x, base, size)`

```
a clump of leaves at the edge of the path, each leaf outlined, as a mural draws foliage
brush: a 2D context; x, base: its root; size: 1 is five leaves about 90 long. Returns nothing.
e.g. leafClump(pen, 140, GROUND + 20, 0.7);
```

### `hills(brush, wide, base, tall, shape, colour)`

```
A range of hills across the picture: one ridge, graded from deep along
the top to pale at the foot, with a firm line and tufts of grass. A film
lays three or four, the furthest first.
  brush    a 2D context
  wide     how far across it runs, from x = 0, in pixels (WIDE for the whole sheet)
  base     the foot of the range, y in pixels; tall: how high its ridge rises above it
  shape    any number: another number, another ridge
  colour   "#rrggbb" for the graded hill; any other CSS colour is laid flat
Returns nothing; leaves brush's fillStyle, strokeStyle, lineWidth, lineJoin and lineCap as it set them.
e.g. hills(pen, WIDE, 760, 220, 1.3, "#7fa86a");
```

### `peaks(brush, x, base, wide, tall, colour, seed)`

```
A heap of peaks, as a thangka piles a mountain: pointed, one before
another, the furthest and tallest first. Each peak is pale at its tip and
deep at its foot, its sides a little hollow, with a ridge line from the tip
down and short strokes down the side away from the light.
  x, base     the middle of the heap's foot
  wide, tall  how far the heap spreads, and how high its tallest peak stands
  colour      "#rrggbb"
  seed        which heap it is: another number, another heap
brush: a 2D context; x, base, wide and tall in its pixels. Returns nothing; leaves brush's line settings and
paint as it set them.
e.g. peaks(pen, 700, 640, 900, 360, "#6f9a7a", 2);
```

### `fanPlant(brush, x, base, size, colour, seed)`

```
A plant that is a fan of long leaves from one root, as a thangka fills
its hills with: the leaves at the sides lie low and are drawn first, the
ones in the middle stand and lie over them. Each is a leaf of the kit's
(paintLeaf): deep at its foot, lighter at its tip, a pale rib, a fine line.
brush: a 2D context; x, base: its root; size: 1 is leaves about 76 long; colour: "#rrggbb"; seed: any number,
default 0. Returns nothing; brush is left as it was found.
e.g. fanPlant(pen, 260, GROUND, 0.8, "#3f7a4a", 5);
```

### `tasselTree(brush, x, base, size, colour, seed)`

```
A tree as a thangka paints one: a trunk that leans, and a crown of round
dark clumps, each carrying one pale tassel: a small arc with lines that
hang from it and meet. The clumps further back are drawn first.
brush: a 2D context; x, base: the foot of its trunk; size: 1 is about 230 tall; colour: the crown's, "#rrggbb";
seed: any number, default 0. Returns nothing; brush is left as it was found.
e.g. tasselTree(pen, 980, 700, 1, "#2f5a3a", 3);
```

### `rocks(brush, x, base, size, colour, seed)`

```
Rocks, as a thangka paints them: round boulders piled one before another,
each banded in layers: lines inside it that arch the way its top does, one
under another. A boulder is deep at its heart and its colour at its rim.
brush: a 2D context; x, base: the middle of the pile, on the ground; size: 1 is about 300 across; colour:
"#rrggbb"; seed: any number, default 0. Returns nothing; brush is left as it was found.
e.g. rocks(pen, 400, GROUND, 0.6, "#9a8a70", 1);
```

### `foam(brush, x, y, wide, tall, colour, seed)`

```
Water that runs, as a thangka paints it: rows of waves, each a hump whose
crest curls over, white at the crest and the water's colour at the foot,
with two lines inside it that follow its back. The rows further off are
drawn first, and each row sits between the waves of the one behind.
brush: a 2D context; x, y, wide, tall: the box, in pixels; colour: "#rrggbb", "#6f8fb0" unless told; seed: any
number, default 0. Returns nothing; brush is left as it was found.
e.g. foam(pen, 0, 820, WIDE, 120, "#6f8fb0", 2);
```

### `roofTiles(brush, left, right, top, bottom, tile, colour, end)`

```
Rows of tiles on a roof, inside the brush's clip: the roof's own shape is
clipped before this is called. Each row lies over the one below it, as
tiles do, so only the lower end of a tile shows. No two tiles are quite
one colour, each row throws a line of shade on the row below, and the
whole roof is lighter toward its ridge and darker at its eave.
  left, right, top, bottom   the box the roof is in
  tile                       how wide a tile is; a row is 0.75 of that high
  colour                     the tiles' colour, or a function of (x, y) that gives one, for a roof in bands
  end                        how a tile ends: "round" (scales), "point" or "square"
brush: a 2D context, already clipped to the roof; the box and tile in pixels; colour "#rrggbb" or a function
(x, y) giving one. Returns nothing; leaves brush's paint and line as it set them.
e.g. pen.save(); pen.beginPath(); pen.rect(-200, -330, 400, 100); pen.clip();
     roofTiles(pen, -200, 200, -330, -230, 22, "#9a3a2a", "round"); pen.restore();
```

### `house(brush, x, base, size)`

```
A wooden house on posts, with the crossed roof ends of a northern house.
It has depth: a second row of posts behind the first and shade under the
floor; posts with a lit side and a side in shade, each on a stone; boards
of more than one brown, with their grain; a window set into the wall,
with a sill; a roof of tiles in rows with a board along its eave; and the
shade the eave throws on the wall.
brush: a 2D context; x, base: the middle of its foot, on the ground; size: 1 is about 380 across and 440 tall.
Returns nothing; brush is left as it was found.
e.g. house(pen, 900, GROUND, 0.8);
```

### `palm(brush, x, base, tall)`

```
A coconut palm: a ringed trunk that curves out to one side and back, a crown of fronds, three coconuts.
brush: a 2D context; x, base: the foot of its trunk; tall: the trunk's height in pixels. Returns nothing; leaves
brush's paint and line settings as it set them.
e.g. palm(pen, 1300, GROUND, 360);
```

### `tung(brush, x, base, t, crowned)`

```
a tung: the long woven flag that hangs from a bamboo pole at a festival
With "crowned", a hong (pieces.js) stands on the top of the pole, as the
hamsa crowns the tall tung poles of a northern temple.
brush: a 2D context; x, base: the foot of its pole (the pole leans to the right, its top 70 across and 470 up,
in pixels); t: seconds, or nothing for a flag that hangs still; crowned: true for a hong on the top (pieces.js
must be loaded, or none is drawn). Returns nothing; leaves brush's paint and line settings as it set them.
e.g. tung(pen, 300, GROUND, t, true);
```

### `gripHand(x, y, angle)`

```
x, y: the wrist, in pen's pixels; angle in radians. Reads SKIN. Returns nothing: it draws with pen.
e.g. gripHand(0, 0, -1.4);
```

### `parasolShape(open)`

```
How far open a parasol is (0 furled to 1 open) sets the angle of its ribs
from the handle: closed they lie 5 degrees from it, open 72. Each rib is
as long as the open parasol's slant, so the canopy's radius and height
are that length's sine and cosine, as parts of the open radius.
open: 0 furled to 1 open, default 1. Returns {radius, dome}, as shares of PARASOL.radius.
e.g. var R = PARASOL.radius * parasolShape(0.5).radius;
```

### `parasolAt(t, start, kind, colour, show)`

```
The tilt, spin and openness of a parasol at second t, for a show that
begins at "start". The shows:
  "twirl"  (or left out) open all along: over 1.2 s it tips down toward the
           viewer, spins three times round over the next 3.2 s (quickening,
           then slowing to a stop), rests for 0.6 s, and over 1.2 s comes
           back up: six seconds
  "open"   upright, furled before the start; it opens over 1.4 s and stays open
  "close"  upright, open before the start; it furls over 1.4 s and stays furled
  "bloom"  furled and upright before the start: it tips down furled (1.2 s),
           opens (1.4 s), spins three times (3.2 s), rests (0.6 s), furls
           (1.4 s) and comes back up (1.2 s): nine seconds, ending furled
  "spin"   it tips down toward the viewer (1.2 s), the other hand comes to
           it (0.4 s), and it spins three times (3.2 s) and stays tipped down,
           open, with the hand on it (5 s)
  "fold"   tipped down and open before the start (after "spin"), the other
           hand on it: it closes (1.4 s), snaps open (0.35 s, as if shaking
           the rain off) and closes again (1.4 s); the hand drops (0.5 s);
           and furled it swings on down until it points straight at the
           ground (0.5 s, tilt 1 to 2), then back, to hang at her side, tip
           to the ground behind her (0.5 s), never lifted and never across
           her: 5.6 seconds, ending carried
"busy" (0 to 1, in "fold") brings the other hand to the handle, as the hand
that opens and closes it. A parasol with hang 1 is carried: {open: 0, hang: 1}. "kind" is "lai" (or
left out), "yantra" or "buddha"; "colour" its paper, if not the kind's own.
Give it as the look's parasol:
cast("lady", {parasol: parasolAt(t, 4, "buddha", undefined, "bloom")}).
t, start: seconds; kind and colour as said; show: one of the shows above, "twirl" when left out. Returns
{tilt: 0 to 2, spin: radians, open: 0 to 1, hang: 0 to 1, busy: 0 to 1, kind, colour}.
e.g. person(800, GROUND, cast("lady", {parasol: parasolAt(t, 4, "lai", undefined, "twirl")}));
```

### `parasolHand(tilt, hang)`

```
The hand on the handle is the owner's picture of a Victorian woman with a
parasol (2026-10-15): a fist closed round the handle, the back of the hand
and the knuckles to the viewer, the thumb on top, the handle going in at
the top of the fist and out at the bottom. (The picture's hold, the handle
over the shoulder and the canopy behind the head, was tried the same day
and taken out: "modify how the hand is, not the positions".)
tilt: 0 to 2, default 0; hang: 0 to 1, default 0. Returns [across, down] from the shoulder, in pixels: a hand
for arm().
e.g. var handA = parasolHand(1, 0);
where the near hand holds the handle: forward at shoulder height when upright (the forearm rises at a shallow angle to the fist), before the chest when tipped, lowered to her side when it points down (tilt 2), at the side when carried
```

### `parasolSwing(tilt, hang)`

```
tilt: 0 to 2; hang: 0 to 1, default 0. Returns radians.
e.g. var axis = -Math.PI / 2 + parasolSwing(2, 1);
the turn of the parasol about the fist: upright held, down behind her carried, leaning back so the hanging forearm meets the fist without a sharp wrist
```

### `parasolOf(given)`

```
given: the look's parasol. Returns an object with at least tilt and spin (the object itself, when given one).
e.g. var p = parasolOf("yantra");   // {tilt: 0, spin: 0, kind: "yantra"}
the look's parasol as {tilt, spin, kind, colour}: true, a kind, a colour, or parasolAt()'s object
```

### `parasol(brush, x, y, R, tilt, spin, colour, kind, open)`

```
The canopy, its centre (the middle of the rim) at (x, y), of radius R, tipped
toward the viewer by tilt (0 upright, 1 face on) and turned by spin. Each
ring of the pattern is a circle of the cone seen at that tilt: an ellipse
as wide as the ring and as tall as the tilt makes it, raised toward the
crown by the cone's height. The rings are drawn from the hem inward, each
band's ground painted over the far side of the band outside it, so the far
side of the dome is hidden as it should be, and the front shows every ring.
brush: a 2D context; x, y, R in its pixels (R the open radius: PARASOL.radius); tilt 0 to 2; spin in radians;
colour: the paper's CSS colour, or nothing for the kind's own; kind: "lai" (or anything else), "yantra" or
"buddha"; open: 0 to 1, default 1. The handle is not drawn: person() draws it. Returns nothing.
e.g. parasol(pen, 700, 400, PARASOL.radius, 1, t * 2, undefined, "buddha", 1);
```

### `yak(brush, x, base, facing)`

```
A yak, the giant that guards a temple gate, as the painted statues of a
Bangkok temple stand: a green giant facing straight out, both hands clasped
on a club held upright before him, its foot on the plinth between his feet.
What such a statue does, as rules: the crown is a tall gold spire of tiers,
each narrower than the one under it, rising from a bell on a band above the
brow, half again the height of the face; gold flames flare up and out behind
each ear; the eyes are round and white and bulge, with a blue rim and a thick
curved brow over each; the mouth runs the width of the face, a row of white
teeth between pink lips, and a fang rises from each corner; a gold collar of
mosaic lies over the shoulders and ends in points; the chest is gold armour in
a lattice over the green; a band at each upper arm and a stack of bracelets at
each wrist; a jewelled sash hangs before the hips to the knees; only the face,
neck, arms, hands and shins show green. They stand in pairs, one each side of
the gate.
brush: a 2D context; x, base: where he stands, on the ground; facing: 1 or -1, which mirrors him (give it: it
is not defaulted). He is about 230 tall. Returns nothing; brush is left as it was found.
e.g. yak(pen, 500, GROUND, 1);
```

### `temple(brush, x, base)`

```
A temple hall with three roofs, a white chedi beside it, a gilded one
behind, and two guardians at its gate. It has depth: roofs that sweep, of
glazed tiles in rows, with a border of green and a line of yellow along
each slope; a board of gold along each slope, toothed, with a horn at the
top and one at each lower end; the shade each roof throws on what is
under it; four pillars before the white wall; a door set into it under a
gold arch, with studs; a window each side; a foot of stone and steps; and
the two chedis are round: each is in shade down one side.
brush: a 2D context; x, base: the middle of the hall's foot, on the ground. It spreads from about x - 345 to
x + 410 and stands about 525 high, its two guardians (yak()) at x - 205 and x + 205. Returns nothing.
e.g. temple(pen, 700, GROUND);
```

### `clouds(brush, wide)`

```
soft white clouds, and the uneven wash of watercolour over the whole sheet
brush: a 2D context (a set's sheet, painted once); wide: the sheet's width in pixels. Reads STYLE.clouds.
Returns nothing.
e.g. clouds(paper.getContext("2d"), WIDE);   // paper: the set's hidden canvas, WIDE x 1080
```

### `wash(brush, wide)`

```
The wash of watercolour over a whole sheet, 1080 high: soft blots, long strokes of a wide brush and the
tooth of the paper, light and dark. brush: a 2D context (a set's sheet, painted once: it is slow); wide: the
sheet's width in pixels. Returns nothing; leaves brush's lineCap "round".
e.g. wash(paper.getContext("2d"), WIDE);
```

### `pathside(brush, wide, part)`

```
what lies along the path: a fence, tufts of grass, flowers and stones
The edge of the path: a fence at the back, flowers and stones along it.
"part" is "back" (the fence and what grows behind the people), "front"
(only what grows in front of them) or nothing, for all of it at once.
brush: a 2D context of a sheet 1080 high (the fence stands at y 800 to 852, the plants down to 1075); wide: its
width in pixels. "front" first clears the whole sheet. Returns nothing.
e.g. pathside(paper.getContext("2d"), WIDE);
```

### `banana(brush, x, base)`

```
a banana tree: a short green stem and wide leaves, torn along their edges
brush: a 2D context; x, base: the foot of its stem; about 270 tall. Returns nothing; leaves brush's paint and
line settings as it set them.
e.g. banana(pen, 1250, GROUND);
```

### `makeGrain(n)`

```
three sheets of film grain, used one after another
n: which sheet (any number). Returns a new canvas, the sheet's size at device pixels (WIDE x 1080, times PIX),
with specks of light and dark on it. GRAIN holds three of them.
e.g. var grain = makeGrain(4);
```

### `card(big, small)`

```
A title card: the whole sheet in cream, a red double border, "big" in a large serif and "small" (Thai is fine)
under it, a lotus in each lower corner and a scroll cloud in each upper. big, small: strings. Returns nothing:
it draws with pen over everything.
e.g. card("A Lanna Girl", "สาวล้านนา");
```

### `subtitle(big, small)`

```
Words under the picture: the line being sung, and what it means. They
are drawn on the screen after the film's lens, grain and dust, so they
stay sharp and still while the picture behind them shakes.
big: the line (Thai is fine), small: what it means, or nothing. It draws on "screen", so call it from draw(t)
after film(t, SCENES): drawn inside a scene, film() paints over it. Returns nothing.
e.g. function draw(t) { film(t, SCENES); subtitle("สนุกจัง", "What fun"); }
```

### `bubble(at, words, how)`

```
---------- speech and thought bubbles ----------
Words a person says or thinks, in a bubble over their head (owner,
2026-10-18: "add text that the character will see in a speech or thought
bubble"). It is drawn on the scene after everyone, so the camera and the
lens take it as they take the people. A speech bubble is a box of paper
with round corners and a tail that points at the top of the head; a
thought bubble is a cloud, with three puffs that get smaller toward the
head. It leans the way the person faces, stays inside what the camera
shows, and pops in over a fifth of a second. Over a person, the box keeps
over where they stand and the height of their head at rest (joints.stand,
joints.rest), so it neither rocks nor hops with them; only its tail follows
the head.
  at     what person() gave back, drawn in this frame (the bubble points at
         the top of that head), or [x, y] in the scene
  words  the words, or [big, small]: the words and, smaller under them,
         what they mean
  how    {kind: "say" (the default) or "think", side: 1 or -1 (which way it
         leans; unless given, the way the person faces), age: the seconds
         since it came (it pops in), size: 1}
Returns nothing: it draws with pen, in the scene's frame as pen has it.
e.g. var joints = person(700, GROUND, cast("girl")); bubble(joints, ["สวัสดี", "Hello"], {age: t - 2});
```

### `bubbleLines(text, font, most)`

```
A bubble's words in lines no wider than "most": broken between words (Thai
has no spaces: the browser's word segmenter finds its words); a word wider
than a line is left whole.
text: the words; font: a CSS font; most: the widest line, in pixels. Returns a list of strings (at least
one, "" for no words). Leaves pen.font set to font.
e.g. var rows = bubbleLines("สวัสดีเจ้า", "bold 40px Tahoma", 420);
```

### `curtain(open)`

```
a red stage curtain. "open" runs from 0, shut, to 1, gone to the sides.
open: 0 to 1. It covers the whole sheet when shut. Returns nothing: it draws with pen.
e.g. curtain(between(t, 1, 3));
```

### `iris(open)`

```
the iris: black everywhere but a round hole, which closes on a scene
and opens on the next one
open: 0 (shut: all black) to 1 (the hole is wider than the sheet). Returns nothing: it draws with pen.
e.g. iris(1 - between(t, 7.5, 8));
```

### `cutFade(dark)`

```
dark: a number; 0 or less draws nothing, 1 or more is black. Returns nothing: it draws over the whole sheet
with pen. filmFrameOnce() calls it at every cut.
e.g. cutFade(between(t, 9, 10));
```

### `forget()`

(no comment)

### `settled(t, paint)`

(no comment)

### `sighted(x, y)`

```
x, y: in the sheet's pixels. Returns nothing; while a film's frame is drawn it adds [x, y] to SIGHTS.seen,
else it does nothing. person() and decorate.js call it.
e.g. sighted(700, 560);
one seen at (x, y) in the sheet's pixels
```

### `sightsNow()`

```
Returns [[x, y], ...]: everyone noted in this frame (empty outside a film's frame). Calling it marks the frame
watched (SIGHTS.watched), so filmFrame() draws it a second time.
e.g. var seen = sightsNow();   // [[700, 560], [1100, 540]]
what a watcher can see in this frame, in the sheet's pixels
```

### `filmFrame(t, scenes)`

```
one frame of a film on the film's own sheet: the scene of that second,
with the camera's slow move in, and the iris at a cut; drawn again when
something in it watched (SIGHTS, above)
(Since 2026-10-21 a cut fades through black, cutFade(), in place of the iris.)
  t        seconds of the film
  scenes   [[from, to, scene], ...]: seconds, and a function of the scene's own clock (t - from)
Returns nothing. Sets clock to t; changes SIGHTS; draws on pen (the sheet), not on the screen.
e.g. filmFrame(12.5, SCENES);
```

### `filmFrameOnce(t, scenes)`

```
One pass of filmFrame(): sets clock, puts pen at the sheet's base scale, draws the scene whose [from, to)
holds t with the camera's push in (6 per cent over the scene), and the fade at a cut. t: seconds; scenes: as
filmFrame() takes them. Returns nothing.
e.g. filmFrameOnce(12.5, SCENES);
```

### `film(t, scenes)`

```
Draw second t of a film: find its scene, let the camera push in, fade
through black at the cuts, then send the sheet to the screen through the lens.
```

## motion.js

motion.js - timing and travel for films of the Lanna cartoon kit (oldcartoon.js).  Load it after the kit. Everything here is a plain function of the time, with no state between frames: a frame drawn alone is the frame the film would show, which is what render.py and the maker's scrub bar need.  ramp(t, a, b, name)        0 at second a, 1 at second b, bent by the ease named tween(t, points, name)     a value through [[second, value], ...]: held before the first, eased between, held after the last; a value is a number, a colour "#rrggbb", or a list of numbers such as [x, y] springTween(t, points, look)  a number through points in time on a spring: pulled to each new value at its second, and swinging past cycle(t, seconds, look)    a repeat, 0 to 1 over and over: a loop, or back the next time ("reverse", "mirror"), with a rest between span(v, from, to, name)    a value of one range as a value of another: span(speed, [0, 300], [0, 0.2]) is a lean that grows with the speed glide(t, from, speed, look)  a thing thrown or let go: it slows as it goes and stops on its own, or at a bound ease(name, u)              a curve from 0 to 1: "smooth", "in", "out", "back", "bounce", "elastic", "wobbl

### `springCurve(look)`

```
Three eases are made from numbers written after the name: "spring 0.8 0.5" is a spring
of those seconds and that bounce, "steps 4" moves in that many drawings (each held, the
last at the end), and "bezier .4 0 .2 1" is the cubic Bezier curve of CSS, by its two
handles (x1 y1 x2 y2). Without numbers: "spring" is SPRING_EASE, "steps" is 4 drawings,
"bezier" is the CSS "ease".
springCurve(look) gives back an ease curve, a function of u (0 to 1) to 0 to 1: the spring's whole
swing (springAt with that look) squeezed into u, and exactly 1 at u = 1. look is springAt's.
Changes nothing outside itself.
e.g. var curve = springCurve({seconds: 0.8, bounce: 0.5}); curve(0.5)
```

### `stepsCurve(count)`

```
stepsCurve(count) gives back an ease curve that moves in count held drawings (rounded, at least 1;
4 when left out): u = 0.5 with 4 steps gives 0.5, u = 0.6 gives 0.5 too.
e.g. stepsCurve(4)(0.6)
```

### `bezierCurve(x1, y1, x2, y2)`

```
bezierCurve(x1, y1, x2, y2) gives back an ease curve: the cubic Bezier of CSS's cubic-bezier(),
by its two handles (x from 0 to 1, y any number). The curve gives 0 at u <= 0 and 1 at u >= 1.
e.g. bezierCurve(0.4, 0, 0.2, 1)(0.5)
the point at s along a cubic Bezier from (0,0) through the handles to (1,1); find the s whose x is u, then read y
```

### `reversed(curve)`

```
reversed(curve) gives back that ease curve turned round: 1 - curve(1 - u). "back" made "back in".
e.g. reversed(EASES.back)(0.2)
```

### `mirrored(curve)`

```
mirrored(curve) gives back an "inout" curve: curve over the first half of u, its mirror over the second.
e.g. mirrored(EASES.in)(0.25)
```

### `curveOf(name)`

```
curveOf(name) gives back the curve, a function of u (0 to 1), for an ease name such as "smooth",
"back in", "spring 0.8 0.5", "steps 4" or "bezier .4 0 .2 1" (the names: the top of this file).
An unknown name warns and gives "smooth"; an unknown form warns and uses the ease as it is.
Fills CURVES, the cache of curves by name.
e.g. curveOf("bounce out")(0.7)
```

### `ease(name, u)`

```
ease(name, u) gives back how far along a move is, usually 0 to 1 ("back" and "elastic" go past),
u of the way along in time (0 to 1, held there outside). name: an ease name (see curveOf).
e.g. var x = 100 + 400 * ease("back out", (t - 2) / 1.5);
```

### `ramp(t, a, b, name)`

```
ramp(t, a, b, name) gives back 0 before second a, 1 after second b and the eased way between.
t: the film's time in seconds; name: an ease name ("smooth" when left out). a must not equal b.
e.g. pen.globalAlpha = ramp(t, 4, 5.5, "out");
0 before second a, 1 after second b, eased between
```

### `mixOf(a, b, u)`

```
mixOf(a, b, u) gives back the value u of the way (0 to 1, or past) from a to b: numbers, colours
"#rrggbb" (mixed by the kit's blend()) or lists of numbers of one length.
e.g. mixOf([0, 0], [100, 40], 0.5)
u of the way from a to b: a number, a colour "#rrggbb" (the kit's blend), or a list of numbers
```

### `tween(t, points, name)`

```
tween(t, points, name) gives back a value through points in time.
t: the time in seconds. points: [[second, value], ...] in order of the seconds, at least one;
the values all numbers, all colours "#rrggbb" or all lists of numbers of one length.
name: one ease name for every step ("smooth" when left out), or a list of names, one for
each step between two points. Returns the value now. Changes nothing outside itself.
e.g. var x = tween(t, [[2, 160], [5, 620], [8, 620]], "smooth");  var sky = tween(t, [[0, "#9ad0e8"], [20, "#e8a070"]]);
a value through points in time, [[second, value], ...]: the first value before
```

### `springTween(t, points, look)`

```
A number through points in time on a spring: at each point's second the spring is
pulled toward the new value and swings past it, still swinging when the next pull
comes. A spring is linear, so the answer is the first value plus one swing
(springAt) for every change, each started at its own second; no frame depends on
the one before. The look is springAt's (stiffness, damping, mass, velocity; or
seconds and bounce). A lantern tugged along a line, a kite, a held thing that lags.
springTween(t, points, look) gives back a number through points in time, on a spring.
t: the time in seconds. points: [[second, number], ...] in order, at least one. look: springAt's
({seconds: 0.6, bounce: 0.4}, or stiffness, damping, mass, velocity; 80, 10, 1, 0 when left out).
Returns the number now: the first value before the second point's second. Changes nothing outside.
e.g. var lean = springTween(t, [[0, 0], [3, 0.3], [6, 0]], {seconds: 0.8, bounce: 0.5});
```

### `cycle(t, seconds, look)`

```
A repeat: 0 to 1 over "seconds", again and again. look.kind says how it goes back:
"loop" (the default) starts again from 0; "reverse" runs the same way back, the
ease traced backwards; "mirror" goes back by the same ease run forwards (a bounce
up is as quick as the bounce down). look.ease bends each run (linear); look.rest
is a pause in seconds at the end of each run, held there; look.from is the second
the first run begins (0, and before it the answer is 0). A wing beat, a flag, a bob.
cycle(t, seconds, look) gives back where a repeat is now, 0 to 1.
t: the time in seconds; seconds: how long one run takes. look (all optional): kind "loop",
"reverse" or "mirror"; ease (an ease name, "linear"); rest (seconds held at each run's end, 0);
from (the second the first run starts, 0). Returns 0 to 1 (0 before look.from).
e.g. var flap = cycle(t, 0.4, {kind: "mirror", ease: "smooth"});
```

### `span(v, from, to, name)`

```
A value of one range read as a value of another: v at from[0] gives to[0], at
from[1] gives to[1], held at the ends, bent by an ease between. The question
"how much of this for that much of that" asked once instead of with arithmetic:
a lean that grows with the speed, a lantern's glow with the dark, a blush with
the smile. to may be two numbers, two colours, or two lists.
span(v, from, to, name) gives back v read from one range into another.
v: the value read; from: [low, high] of its range; to: [first, second], two numbers, colours
"#rrggbb" or lists; name: an ease name ("linear" when left out). Returns the value in to's range,
held at to[0] below from[0] and at to[1] above from[1]. Changes nothing outside itself.
e.g. var bend = span(240, [0, 400], [0, 0.15]);   // the lean for a speed of 240 pixels a second
```

### `glide(t, from, speed, look)`

```
A thing thrown or let go at second 0 from "from" with a speed (units a second):
it slows as it goes, losing speed in proportion to what it has (the way a
rolled ball or a drifting boat does), and stops on its own. look.seconds is
how long the slowing takes (1: by then it has lost two thirds of its speed,
and comes to rest at from + speed x seconds); look.min and look.max are the
bounds it stops at, a wall or the ground. Written as a formula of the time, so
a frame does not depend on the one before. A takraw kicked and rolling, a top
slowing, a boat pushed off.
glide(t, from, speed, look) gives back where a thing let go is at time t.
t: seconds since it was let go (from is held before 0); from: where it starts, any unit; speed:
that unit a second, any sign; look (all optional): seconds (1), min, max. Returns where it is now.
e.g. var x = glide(t - 4, 300, 500, {seconds: 0.8, max: 1700});
```

### `held(t, frames)`

```
held(t, frames) gives back the time t (seconds) held to a drawing that lasts that many frames of
a 30-a-second film: 2 is "on twos", 3 "on threes". Pass the result as the time to a drawing.
e.g. var tt = held(t, 2);
a cartoon drawn on twos holds each drawing for two frames (of 30 a second)
```

### `springOf(look)`

```
---------- a spring ----------
A weight on a spring, let go at second 0 one unit short of its rest, read at second
t: it goes from 0 to 1, overshoots, and settles. Written as a formula of the time
(the physics of a damped spring), so a frame does not depend on the one before;
the kit's follow() integrates frame by frame instead, and needs settled()'s pre-roll.
  look.stiffness   how hard it pulls (80): higher is quicker
  look.damping     how soon the swinging dies (10): low swings for a while, high creeps in
  look.mass        how heavy (1): heavier is slower and swings longer
  look.velocity    a push at the start (0), in units a second
or, instead of stiffness and damping, in a film's words:
  look.seconds     about how long the move takes (the swing after it may go on a little)
  look.bounce      how bouncy, 0 to 1: 0 just stops, 0.3 a small overshoot, 1 swings for a long while;
                   below 0 it creeps in without any swing (-1 very slowly)
springOf(look) gives back the spring's numbers for a look.
look: springAt's look, or nothing. Returns {k, c, m, push}: stiffness, damping, mass and the
start push in units a second (from look.seconds and look.bounce when they are given and
stiffness and damping are not). Changes nothing outside itself.
e.g. springOf({seconds: 0.6, bounce: 0.3}).k
the spring's stiffness, damping and mass, from whichever words the look uses
```

### `springAt(t, look)`

```
springAt(t, look) gives back where the spring is at second t (0 before, then toward 1, past it
and back): a number, 1 once settled. look: the keys listed above (stiffness, damping, mass,
velocity; or seconds and bounce); left out it is stiffness 80, damping 10.
Changes nothing outside itself.
e.g. var pop = springAt(t - 3, {seconds: 0.5, bounce: 0.6});  var size = 0.8 + 0.4 * pop;
```

### `springTime(look)`

```
springTime(look) gives back the second by which a spring has settled.
look: springAt's look. Returns seconds, a number: how long after its start the spring's swing
has died to a hundredth of the first. Changes nothing outside itself.
e.g. var done = 3 + springTime({seconds: 0.5, bounce: 0.6});
when the swing has died to a hundredth
```

### `stagger(n, count, look)`

```
---------- a crowd ----------
How late the n-th of count things starts: look.gap seconds (0.3) between neighbours,
spreading from the "first" (the default), the "last", the "centre", or a number, the
index it spreads from. An ease name bends the spread: "in" bunches the near ones,
"out" the far ones.
stagger(n, count, look) gives back how late the n-th of a crowd starts.
n: which one (0 is the first); count: how many in all; look (all optional): gap (seconds, 0.3),
from ("first", "last", "centre" or "center", or an index), ease (an ease name). Returns seconds,
a number of 0 or more, to take from that one's time. Changes nothing outside itself.
e.g. for (var n = 0; n < 5; n++) { var u = ramp(t - stagger(n, 5, {gap: 0.2, from: "centre"}), 2, 3); }
```

### `spline(p0, p1, p2, p3, u)`

```
spline(p0, p1, p2, p3, u) gives back the point u of the way along the curve from p1 to p2.
p0, p1, p2, p3: points [x, y] (more numbers are ignored), in pixels of the sheet; u: 0 to 1.
Returns [x, y, dx, dy]: dx and dy are the change over the whole step from p1 to p2 (pixels per
whole step, not per second). Changes nothing outside itself.
e.g. spline([0, 0], [100, 0], [200, 50], [300, 50], 0.5)
```

### `leg(keys, i)`

```
leg(keys, i) gives back the i-th step of a course and the points that bend it.
keys: a course (see "a course" above); i: the index of a step, 0 to keys.length - 2.
Returns {a, b, first, end, before, after}: the two keys, whether the step starts or ends a walk,
and the made-up or real points [x, y] behind and ahead. Changes nothing outside itself.
e.g. leg([[0, 100, 900], [4, 500, 900]], 0).first
```

### `lengthsOf(keys)`

```
lengthsOf(keys) gives back how long each step of a course is, measured along its curve.
keys: a course. Returns a list, one entry for each step: the length so far, in pixels of the
sheet, at each of SAMPLES + 1 points along it ([0] for a wait in place). Fills COURSES, a cache
by the course's numbers, and empties it when 64 courses are kept.
e.g. var whole = lengthsOf([[0, 100, 900], [4, 500, 900]])[0][SAMPLES];   // 400, the first step's length
```

### `where(keys, t)`

```
where(keys, t) gives back where a thing on a course is at second t, as a list of 9 numbers:
[x, y, moving, facing, depth, angle, distance, reached, speed] (the comment inside says each;
p[8], the speed, is pixels of the sheet a second, 0 while it stands). keys: [[second, x, y], ...] or [[second, x, y, depth], ...], in order of the seconds,
at least one; x and y in pixels of the sheet; t: the time in seconds. Before the first second
it is at the first key, after the last at the last. Fills the COURSES cache (lengthsOf).
e.g. var p = where([[3, 160, 960], [9, 620, 950]], t);  person(p[0], p[1], cast("boy", {face: p[3], step: p[2] ? p[6] / 130 : 0}));
```

## backdrops.js

backdrops.js - nineteen backgrounds to start a film from: seven places of the north of Thailand, in the kit's own manner, and twelve in the manner of the thangka painters. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="backdrops.js"></script>  backdrop(name) gives a set, 1440 x 1080, painted once and kept. A scene lays it down with  pen.drawImage(backdrop("meadow"), 0, 0)  and stands its people on the ground, which in every one of them is near y = 900. BACKDROPS lists the nineteen names, each with a line about it and its name in Thai, for a page that lets a child choose one.  No painting is copied here. The twelve of the thangka keep what the tradition does, as it is set out in P. Lehtisalo, "Holy Grounds: Landscapes in Tibetan thangka paintings" (Studia Orientalia 109, 2011), which reads Jackson and Jackson's "Tibetan Thangka Painting: Methods and Materials" and others:  1. The sky is darker the higher it goes, and light at the horizon, or there is a red glow there. The sun and the moon are both in it, near the top corners: the sun at the right, orange or red, and the moon at the left, white. 2. Snow mountains stand on the horizon behind green hills: st

### `bdSky(brush, horizon, high, low, glow)`

```
The sky: "high" at the top, "low" at the horizon, and a glow of another
colour just above the horizon if one is given.
brush: a canvas 2D context (a set's sheet, WIDE x 1080); horizon: y in pixels of the sheet; high,
low, glow: CSS colours (glow may be left out). It fills the whole sheet. Returns nothing; it leaves
brush's fillStyle set.
e.g. bdSky(brush, 520, "#234f9a", "#d6e8f4", "#f3b27a");
```

### `bdSunMoon(brush, crescent)`

```
The sun, at the right, and the moon, at the left, near the top corners.
"crescent" makes the moon a crescent with three stars by it.
brush: a canvas 2D context; crescent: true for the crescent and its stars, else a full white moon.
The sun is at (WIDE - 150, 112), the moon at (150, 112), pixels of the sheet. Returns nothing; it
leaves brush's fill and line set.
e.g. bdSunMoon(brush, true);
```

### `bdSnow(brush, x, base, wide, tall, seed, under)`

```
A range of snow mountains: steep, pointed, wholly under snow. The folds of
the snow are lines of a darker blue that run down from each top. "under"
is how far below "base" their sides and folds run on. A range stands
behind hills, and where those dip its level foot would show, with the sky
under it: every range in this file gives the base of its first hills less
its own base, and 10 more, so that the foot is always behind the ridge.
  brush          a canvas 2D context
  x, base        the middle of the range's foot, pixels of the sheet
  wide, tall     its size in pixels (one peak for every 150 of wide, at least 3)
  seed           a number; under: pixels the sides run on below base (0 or left out: none)
Returns nothing: it draws with brush, and leaves its fill and line set (round joins and caps).
e.g. bdSnow(brush, 720, 520, 1500, 300, 1, 90);
```

### `bdCrags(brush, x, base, size, seed, count)`

```
A formation of crags: angular stones that stand up, each with a blue outer
zone and a green inner one, darker at the edge, and a line of gold. A
stone here and there is brown.
brush: a canvas 2D context; x, base: the middle of the formation's foot, pixels of the sheet;
size: 1 is stones 170 to 360 tall; seed: a number; count: how many stones (4 when left out).
Returns nothing: it draws with brush, and leaves its fill and line set.
e.g. bdCrags(brush, 300, 900, 1.2, 2, 5);
```

### `bdWater(brush, x, y, wide, tall, colour)`

```
Water, as a thangka paints it: zones divided by wavy white lines, each
zone darkest at the front. The box (x, y, wide, tall) holds it.
brush: a canvas 2D context; x, y, wide, tall: the box, pixels of the sheet; colour: the deep
"#rrggbb" ("#2f6fa8" when left out). Returns nothing: it draws with brush, clipped to the box,
and leaves brush as it found it.
e.g. bdWater(brush, 0, 860, WIDE, 220, "#3f7fb8");
```

### `bdCascade(brush, x, top, bottom, wide)`

```
A cascade: it falls from (x, top) to "bottom", a little wider as it goes,
its lines following the fall, and ends in a splash (the kit's foam).
brush: a canvas 2D context; x, top, bottom, wide: pixels of the sheet (wide: its width at the
foot is about 1.2 times it). Returns nothing: it draws with brush (and the kit's foam()), and
leaves its fill and line set.
e.g. bdCascade(brush, 700, 300, 860, 80);
```

### `bdLayers(brush, x, y, wide, colours, seed)`

```
A layered cloud, for high in the sky: thin bars of several colours, one
under another, joined by short necks.
brush: a canvas 2D context; x, y: the middle of the top bar, pixels of the sheet; wide: the
longest bar, pixels; colours: a list of CSS colours, one bar each, 22 apart; seed: a number.
Returns nothing: it draws with brush, and leaves its fill and line set.
e.g. bdLayers(brush, 900, 160, 360, ["#f4d6d6", "#d6e4f4", "#f6eebc"], 3);
```

### `bdCurve(points)`

```
A smooth line through a list of points, as points close together.
points: a list of two or more [x, y]. Returns a new list of [x, y], 14 to each step and the last
point, on a smooth curve through them. Changes nothing.
e.g. var line = bdCurve([[100, 400], [300, 250], [500, 330]]);
```

### `bdRainbow(brush, points, wideA, wideB, colours)`

```
A rainbow, as a thangka has one: a ribbon of stripes along a line that
twists and ends in the middle of the air. It is "wideA" across at its
start and "wideB" at its end.
brush: a canvas 2D context; points: [x, y] list the rainbow runs along (bdCurve() smooths it),
pixels of the sheet; wideA, wideB: its width in pixels at the start and the end; colours: the
stripes, a list of CSS colours (five from red to blue when left out). Returns nothing: it draws
with brush, and leaves its fill and line set.
e.g. bdRainbow(brush, [[200, 500], [420, 260], [700, 300], [760, 420]], 40, 12);
```

### `bdJewelTree(brush, x, base, size, seed, leaf)`

```
A jewel tree: a small tree whose leaves are each drawn, in rings about its
middle, with fruit at the heart, and strings of gems hanging from it.
brush: a canvas 2D context; x, base: its foot, pixels of the sheet; size: 1 is about 240 tall;
seed: a number; leaf: the green "#rrggbb" ("#2f7a4a" when left out). Returns nothing: it draws
with brush, and leaves brush as it found it.
e.g. bdJewelTree(brush, 200, 800, 1.1, 1);
```

### `bdHall(brush, x, base, wide, tall, gilded)`

```
A hall of the Himalaya: walls that lean in, a dark red band under a flat
roof, dark windows, and a gilded roof on top if "gilded" is true.
brush: a canvas 2D context; x, base: the middle of its foot, pixels of the sheet; wide, tall: the
walls' size in pixels (the gilded roof adds 0.7 of tall above); gilded: true or false.
Returns nothing: it draws with brush, and leaves its fill and line set.
e.g. bdHall(brush, 720, 860, 420, 220, true);
```

### `bdStupa(brush, x, base, size)`

```
A stupa: steps, a white dome, a square, a gilded spire of rings, and a sun
and moon at its top.
brush: a canvas 2D context; x, base: the middle of its foot, pixels of the sheet; size: 1 is about
260 tall. Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. bdStupa(brush, 980, 620, 0.8);
```

### `bdFlags(brush, x1, y1, x2, y2, t)`

```
A line of flags from one point to another, sagging between them: blue,
white, red, green and yellow, over and over. Given the second t, the line
breathes a little in the breeze and each flag swings from it, its foot
moving, each a little behind the one before; without t it hangs still.
brush: a canvas 2D context; x1, y1, x2, y2: the two ends, pixels of the sheet; t: seconds, or
left out for still flags. One flag to every 26 pixels across. Returns nothing: it draws with
brush, and leaves its fill and line set. A backdrop's sway: backdropSway("monastery", t).
e.g. bdFlags(pen, 880, 600, 1180, 530, t);
```

### `bdCrane(brush, x, base, size, facing)`

```
A crane, standing: white, with a black neck, a red crown and long legs.
"facing" is 1 or -1.
brush: a canvas 2D context; x, base: its feet, pixels of the sheet; size: 1 is about 150 tall;
facing: 1 (bill to the right) or -1. Returns nothing: it draws with brush, and leaves brush as it
found it.
e.g. bdCrane(brush, 1100, 900, 0.9, -1);
```

### `bdOneGround(set, ground, line, keep)`

```
A set of one ground, made from a set of many colours. Wherever the
picture changes, at the edge of every shape, there is a line of the line's
colour; everything else is the ground's colour, with a little of the
picture's own colours left in it ("keep", 0 to 1), as a black thangka may
be darkly tinted. A black or a red thangka has light lines on a dark
ground; a gold one has dark lines on a light ground.
set: a canvas (not a context) already painted; ground, line: "#rrggbb"; keep: 0 to 1. It reads and
writes every pixel of set in place (slow: once, when the set is made). Returns nothing.
e.g. bdOneGround(set, "#121012", "#e0b23a", 0.08);
```

### `bdFloor(brush, top, far, near)`

```
The ground people stand on, from "top" to the foot of the sheet: "far" is
its colour at the top and "near" at the foot.
brush: a canvas 2D context; top: y in pixels of the sheet; far, near: CSS colours. It fills from
top to the foot of the sheet. Returns nothing; it leaves brush's fillStyle set.
e.g. bdFloor(brush, 860, "#9ab868", "#6f9a4a");
```

### `bdTufts(brush, top, bottom, count, seed)`

```
Tufts of grass scattered between two heights, with a small flower on one
in three. A tuft is three blades, each a leaf of the kit's with its line.
brush: a canvas 2D context; top, bottom: y in pixels of the sheet; count: how many tufts, across
the whole width; seed: a number. Returns nothing: it draws with brush (the kit's paintLeaf() and
blossom()).
e.g. bdTufts(brush, 880, 1060, 60, 4);
```

### `bdSized(brush, x, base, size, paint)`

```
Something of the kit's at another size, for what stands far off: "paint"
draws it standing at (0, 0), and it is put at (x, base), "size" times as big.
brush: a canvas 2D context; x, base: pixels of the sheet; size: a scale; paint: a function of no
arguments that draws on brush standing on (0, 0). Returns nothing; it leaves brush as it found it.
e.g. bdSized(brush, 1200, 640, 0.4, function () { house(brush, 0, 0, 1); });
```

### `bdTreeLine(brush, left, right, y, r, colour, seed)`

```
A line of trees far off: the tops of their crowns side by side along a
height, each a pad of leaves of the kit's, no two the same size.
brush: a canvas 2D context; left, right, y: pixels of the sheet; r: a pad's radius in pixels;
colour: "#rrggbb"; seed: a number. Returns nothing: it draws with brush (the kit's leafPad()).
e.g. bdTreeLine(brush, 0, WIDE, 640, 30, "#5f8a54", 2);
```

### `bdHut(brush, x, base, size)`

```
A field hut, where a farmer rests at noon: a floor on four posts, open on
every side, under a roof of thatch.
brush: a canvas 2D context; x, base: the middle of its foot, pixels of the sheet; size: 1 is 214
tall and 252 wide. Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. bdHut(brush, 1100, 860, 0.7);
```

### `bdBoat(brush, x, y, size, facing)`

```
A long boat of the river, seen from the side: a hull that rises at both
ends and a roof of matting over its middle. "facing" is 1 or -1: the way
its prow points.
brush: a canvas 2D context; x, y: the waterline under its middle, pixels of the sheet; size: 1 is
about 400 long; facing: 1 or -1. Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. bdBoat(brush, 600, 760, 0.8, 1);
```

### `bdChedi(brush, x, base, size)`

```
A chedi of the north, gilded: a foot of white stone in three steps, a
square body with a niche in it, a bell, a spire of rings and an umbrella
at the top. It is lit down one side and in shade down the other.
brush: a canvas 2D context; x, base: the middle of its foot, pixels of the sheet; size: 1 is about
300 tall. Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. bdChedi(brush, 980, 520, 0.5);
```

### `bdHaystack(brush, x, base, size)`

```
A haystack: rice straw heaped round a pole after the harvest, in layers
that lie over one another as a roof's do.
brush: a canvas 2D context; x, base: the middle of its foot, pixels of the sheet; size: 1 is about
250 tall with its pole. Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. bdHaystack(brush, 1250, 880, 0.8);
```

### `bdKhom(brush, x, y, size, colour)`

```
A paper lantern of the north, the kind that hangs: a body of eight sides,
wider at its middle, a band of gold at its top and its foot, and three
tails of paper under it. (x, y) is where its string is tied.
brush: a canvas 2D context; x, y: the tie, pixels of the sheet; size: 1 is about 106 from the tie
to the longest tail; colour: the paper's "#rrggbb" (needed). Returns nothing: it draws with brush,
and leaves brush as it found it. (khom.js has the kit's full lantern, khom().)
e.g. bdKhom(brush, 400, 340, 1.15, "#e86f6f");
```

### `bdStall(brush, x, base, wide, cloth, seed)`

```
A market stall: a table of goods heaped in baskets, under a cloth in
stripes held up on four bamboo poles. "wide" is how wide its table is and
"cloth" the colour of the stripes; "seed" changes what it sells.
brush: a canvas 2D context; x, base: the middle of its foot, pixels of the sheet; wide: its table
in pixels (the stall stands 300 tall); cloth: the stripes' "#rrggbb"; seed: a whole number.
Returns nothing: it draws with brush, and leaves its fill and line set.
e.g. bdStall(brush, 400, 900, 300, "#d8423a", 1);
```

### `bdGround(brush, colour, shape)`

```
The green ground every one of the thangka's twelve ends in, for people to stand on: two
low hills and the field before them.
brush: a canvas 2D context; colour: the near hill's "#rrggbb"; shape: a number, the kit's hills()'s.
Returns nothing: it draws two rows of hills with brush, at y 900 and 1010.
e.g. bdGround(brush, "#6aa350", 3.1);
```

### `backdrop(name, live)`

```
The backdrop called "name", painted the first time it is asked for and kept.
With "live" true, it leaves out what hangs in it (BACKDROP_HANGING), for a
film that draws that swaying with backdropSway().
  name   one of BACKDROPS' names (above): paddy, river, doi, waterfall, village, market, yipeng, meadow,
         crags, lake, sky, midnight, vermilion, golden, hermitage, longlife, garden, monastery, valley;
         another warns and gives the meadow
  live   true: the set without what hangs in it (market, monastery), for backdropSway()
Returns a canvas, WIDE x 1080 pixels. The first call for a name paints it (slow) and keeps it in
BACKDROP_SETS; later calls give the same canvas.
e.g. pen.drawImage(backdrop("market", true), 0, 0); backdropSway("market", t);
```

### `backdropSway(name, t)`

```
What hangs in the backdrop "name", swaying at the second t, drawn on the
kit's sheet "pen"; nothing for a backdrop with nothing hanging in it.
name: a backdrop's name; t: the time in seconds. Returns nothing: it draws with pen, and only for
"market" and "monastery" (BACKDROP_HANGING); any other name draws nothing.
e.g. backdropSway("monastery", t);
```

## pieces.js

Pieces of the north for the Lanna cartoon kit: the inanimate things of a village and a temple yard that the kit did not draw. Each is a painter on a brush, as house() and banana() are, standing on (x, base) or set at (x, y), with a size (1 is the kit's own scale) and, where it moves, the second t. Load this file after oldcartoon.js.  What each one is, and what the photographs it was drawn from do (Wikimedia Commons, free licences; nothing copied, only what they show): hong       the hamsa, the sacred swan that crowns the tall tung poles of a northern temple: a swan's body, the neck curved up and back, a crest and a pointed beak, one wing swept up behind with feather notches, and a tail that curls up in a flame scroll; gold. tung(brush, x, base, t, true) sets one on the pole. namton     the water jar at the gate, Lanna hospitality: a round brown clay pot with a lid on a small wooden stand of four posts under a little roof, and a coconut-shell dipper on a hook. chediSai   a Songkran sand pagoda: a cone of pale sand, smoothed, with small paper flags (tung chai) on sticks pushed into it, each a triangle of a bright colour that flutters. pratheep   a phang pratheep, the clay lamp of Yi 

### `hong(brush, x, y, size, colour)`

```
hong(brush, x, y, size, colour) draws the golden hamsa (see the list above), about 70 long and 66 tall
at size 1. brush: a canvas 2D context (pen, or a set's sheet); x, y: its feet, pixels of the sheet;
size: 1 when left out; colour: its gold ("#e0b23a" when left out). Returns nothing: it draws with
brush, and leaves brush as it found it.
e.g. hong(pen, 600, 400, 1.2);
standing on (x, y), facing right
```

### `namton(brush, x, base, size)`

```
namton(brush, x, base, size) draws the water jar on its stand, about 60 wide and 116 tall at size 1.
brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out. Returns nothing:
it draws with brush, and leaves brush as it found it.
e.g. namton(pen, 820, 940, 1.2);
standing on (x, base)
```

### `chediSai(brush, x, base, size, t, seed)`

```
chediSai(brush, x, base, size, t, seed) draws a sand pagoda with five flags, 92 wide and about 110
tall at size 1. brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out;
t: seconds (0 when left out: still flags); seed: a whole number that sets the flags (0). Returns
nothing: it draws with brush, and leaves brush as it found it.
e.g. chediSai(pen, 700, 920, 1, t, 2);
standing on (x, base); the flags flutter with t
```

### `pratheep(brush, x, y, size, t, seed, look)`

```
pratheep(brush, x, y, size, t, seed, look) draws one clay lamp, 20 across, its flame about 17 tall at
size 1. brush: a canvas 2D context; x, y: pixels of the sheet; size: 1 when left out; t: seconds
(0); seed: a number that sets this flame apart (0); look: optional, {glow: false} for no light.
Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. pratheep(pen, 400, 900, 1.5, t, 3);
the dish on (x, y); the flame flickers with t; look.glow false: no light on the ground
```

### `pratheepRow(brush, x, y, count, gap, size, t)`

```
pratheepRow(brush, x, y, count, gap, size, t) draws count lamps, gap pixels apart, the first at
(x, y), pixels of the sheet, each with its own flicker. Returns nothing: it draws with brush.
e.g. pratheepRow(pen, 200, 900, 12, 60, 1, t);
a row of lamps from (x, y) to the right
```

### `krathong(brush, x, y, size, t, afloat)`

```
krathong(brush, x, y, size, t, afloat) draws a krathong, 52 wide and about 60 tall with its flame
at size 1. brush: a canvas 2D context; x, y: pixels of the sheet; size: 1 when left out; t:
seconds (0); afloat: true to bob. Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. krathong(pen, 640, 880, 1.4, t, true);
set at (x, y), the middle of its base; afloat, it bobs on the water
```

### `oxcart(brush, x, base, size, turn, facing, yoke)`

```
oxcart(brush, x, base, size, turn, facing, yoke) draws the kwian, its wheels 124 across and its
rail's horns 206 above base at size 1, its shaft out about 260 ahead of the axle.
  brush    a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out
  turn     the wheels' turn, radians (0); the ground covered divided by 62 x size rolls them true
  facing   1 (right, the default) or -1; yoke: optional [x, y], pixels of the sheet
Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. oxcart(pen, 500, 940, 1, t * 120 / 62, 1, [760, 820]);   // rolling 120 pixels a second
the axle over (x, base), the wheels' feet on base; facing 1 goes right
```

### `drumCart(brush, x, base, size, facing)`

```
drumCart(brush, x, base, size, facing) draws the great drum on its cart, about 450 long and 240
tall at size 1. brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out;
facing: 1 (the head to the right, the default) or -1. Returns nothing: it draws with brush, and
leaves brush as it found it.
e.g. drumCart(pen, 900, 940, 0.6, -1);
the axle over (x, base); the drum's head toward the way it faces
```

### `sawian(brush, x, base, size)`

```
brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out. Returns nothing:
it draws with brush, and leaves brush as it found it.
e.g. sawian(pen, 300, 920, 1.2);
standing on (x, base): 64 wide, 76 tall at size 1
```

### `longKhao(brush, x, base, size, walls)`

```
brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out; walls: true for
walls of boards, else open with two sawian inside. Returns nothing: it draws with brush, and leaves
brush as it found it.
e.g. longKhao(pen, 1100, 900, 0.8, true);
standing on (x, base): 250 across its eaves, 270 to its ridge at size 1
```

### `tungSaiMu(brush, x, base, size, t, seed, tiers)`

```
The cluster tung, planted at (x, base): a stick 170 tall at size 1, "tiers"
(5 or 7) of small triangular flags on its upper part, widest at the
bottom; every flag flutters with t.
brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out; t: seconds, or left
out for still flags; seed: a whole number (0); tiers: how many rows, 2 or more (7). Returns nothing:
it draws with brush, and leaves brush as it found it.
e.g. tungSaiMu(pen, 700, 860, 1.3, t, 2, 5);
```

### `tungYai(brush, x, base, size, t, colour)`

```
The web tung, on a pole planted at (x, base) as the kit's tung() is: the
pole 470 tall at size 1, the tung hanging from its top, five cells of
woven thread between six strips of bamboo, a frill and a flower at each
strip's ends; it sways in the breeze with t, more toward its foot.
brush: a canvas 2D context; x, base: the pole's foot, pixels of the sheet; size: 1 when left out;
t: seconds, or left out for a still tung; colour: the thread's CSS colour ("#c8402e"). Returns
nothing: it draws with brush, and leaves brush as it found it.
e.g. tungYai(pen, 300, 940, 0.8, t, "#f2ead8");
"colour": the thread's (red unless given; white shows at night)
```

### `rotDaeng(brush, x, base, size, turn, facing, inside)`

```
The red truck, its middle over (x, base): 650 long, 344 to its peak at size
1; facing 1 drives to the right. "turn" rolls the wheels; "inside" is
called with the far bench's seats (see above). Draw it on "pen" to seat
people: a set painted once has nobody in it.
  brush    a canvas 2D context (pen, to seat people); x, base: pixels of the sheet; size: 1 when left out
  turn     the wheels' turn, radians (0: still, and the body does not ride)
  facing   1 (the default) or -1
  inside   optional: a function (seats), seats a list of 4 [x, y], pixels of the sheet, called with
           brush back in the caller's frame
Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. rotDaeng(pen, 720, 960, 1, t * 200 / 46, 1, function (seats) { person(seats[0][0], seats[0][1], cast("boy", {floor: "cross", size: 0.66, twist: 1})); });
```

### `tub(brush, x, base, size, look)`

```
A tub (ตูบ): the small hut of a poor family of the north, standing on (x, base). Four short stilts and a
floor of beams; walls of woven bamboo (fa khat tae), a plain weave of pale and darker strips across; a
doorway at the right, dark inside, with a short ladder of bamboo down from it; a steep roof of grass
thatch, its eaves ragged with straw. 250 wide and 225 high at size 1.
look: glow, 0 to 1: a lamp's light in the doorway and on the ground before it, at night; tint, [colour,
amount]: every colour blended toward one light, as caveMouth()'s.
brush: a canvas 2D context; x, base: pixels of the sheet; size: needed (1 is 250 wide); look:
optional, glow and tint as above. Returns nothing: it draws with brush (the lamp's pool of light
on the ground too, when glow is over 0.01), and leaves its fill and line set.
e.g. tub(pen, 900, 900, 1.2, {glow: 0.8, tint: ["#2a3a6a", 0.35]});
```

### `firewood(brush, x, y, size, look)`

```
A bundle of firewood, its middle at (x, y): "count" sticks (7 unless told) 120 long at size 1, their cut ends
pale, bound round in two places with a vine; look.turn turns it (radians, 0 lying along x); look.loose: the
sticks lie apart on the ground, not yet bound; look.tint as the hut's.
brush: a canvas 2D context; x, y: its middle, pixels of the sheet; size: needed (1 is 120 long);
look: optional, count (7), turn (radians, 0), loose (true or false), tint. Returns nothing: it
draws with brush, and leaves brush as it found it.
e.g. firewood(pen, 400, 930, 1, {turn: 0.2});
```

### `kok(brush, x, base, wide, size, look)`

```
A pen (คอก) of bamboo for an animal, its front's middle on (x, base), "wide" across and two-thirds as deep:
posts at its corners and along its sides, two rails of split bamboo round it, bound at each post. A pen is
drawn in two parts, so that what is kept in it stands inside: look.part "back" (the far fence, before the
animal) and "front" (the near fence, after it). 110 high at size 1. look.tint as the hut's.
brush: a canvas 2D context; x, base: the front's middle, pixels of the sheet; wide: pixels of the
sheet (not scaled by size); size: the posts' and the rails' scale (1 is 110 high); look: part
("back" when left out, or "front"), tint. Returns nothing: it draws with brush, and leaves its
fill and line set.
e.g. kok(pen, 700, 930, 380, 1, {part: "back"}); pig(700, 900, {}); kok(pen, 700, 930, 380, 1, {part: "front"});
```

### `snare(brush, x, base, size, look)`

```
A snare (แร้ว) as the north set one for a small animal, its foot's middle on (x, base): a pole of bamboo
pushed into the ground and bent over, held down by a cord to a trigger peg; from the pole's tip a noose of
rattan lies open on the ground under it. look.sprung (0 to 1): the trigger let go, the pole flies up
straight and the noose with it, closed; look.caught: a point of the scene (a foot, a paw) the noose holds,
so that it closes round it there instead of in the air; look.t stirs the cord; look.tint as the hut's.
Stout, and drawn 1.3 times its size (owner, 2026-10-20: "Increase the size of the snare and make it look a little
stronger"; of the snare as it was and this, "Stout, 1.3x larger"): a thick pole, a cord of twisted rattan, a
thick noose, a trigger of a hooked peg and a crossbar under the hook, and a stake at the pole's root, lashed to it.
About 210 wide and 260 high at size 1.
brush: a canvas 2D context; x, base: pixels of the sheet; size: needed (drawn 1.3 times it); look:
optional, sprung (0 to 1), caught ([x, y], pixels of the sheet), t (seconds), tint. Returns nothing:
it draws with brush, and leaves brush as it found it.
e.g. snare(pen, 900, 940, 0.8, {sprung: between(t, 4, 4.4), t: t});
```

### `campfire(brush, x, base, size, t, look)`

```
A campfire on the ground of a yard, its middle on (x, base): a ring of stones, sticks laid crossed and
charred at their ends, flames that leap and flicker with t (the second), coals glowing red under them, and
a warm light round it. look.low (0 to 1) burns it down to coals; look.light (0 to 1, 1 unless told) is how
strong the light round it is. 150 wide and, with its flames, 170 high at size 1.
brush: a canvas 2D context; x, base: pixels of the sheet; size: needed (1 is 150 wide); t: seconds
(needed); look: optional, low (0 to 1, 0), light (0 to 1, 1). Returns nothing: it draws with brush,
and leaves brush as it found it.
e.g. campfire(pen, 720, 960, 1, t, {low: 0.3});
```

### `ember(brush, x, y, size, t)`

```
An ember, a coal red-hot, its middle on (x, y): dark red with a bright core and a glow about it, sparks
leaving it. "t" flickers it. 10 across at size 1.
brush: a canvas 2D context; x, y: pixels of the sheet; size: needed; t: seconds. Returns nothing:
it draws with brush, and leaves brush as it found it.
e.g. ember(pen, 700, 940, 1.2, t);
```

### `emberFlight(brush, from, to, u, size, high, t)`

```
An ember flying from "from" to "to" (points of the scene) on an arc "high" above the straight line, u of
the way (0 to 1), with a few sparks trailing behind it.
brush: a canvas 2D context; from, to: [x, y], pixels of the sheet; u: 0 to 1 (nothing is drawn at 0
or 1 and outside); size: the ember's; high: pixels the arc rises; t: seconds. Returns nothing: it
draws with brush, and leaves its fillStyle set.
e.g. emberFlight(pen, [700, 940], [980, 820], between(t, 5, 6.2), 1, 140, t);
```

### `goldNugget(brush, x, y, size, t, look)`

```
A nugget of gold, its middle on (x, y): a lump of no shape, gold lit from the upper left with a bright edge,
and now and then a star of light that twinkles on it (t, the second; look.shine 0 to 1, 1 unless told).
16 across at size 1.
brush: a canvas 2D context; x, y: pixels of the sheet; size: needed; t: seconds; look: optional,
shine (0 to 1, 1), seed (1). Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. goldNugget(pen, 760, 930, 1.5, t, {seed: 2});
```

### `hoKhamFloor(base, size)`

```
A hall of a Lanna palace (หอคำ, ho kham), open at the front, its plinth's foot's middle on (x, base): a white
plinth with a stair up its middle; a floor of teak; posts of dark red teak banded with gold; behind, a wall of
red with gold patterns (lai kham) and a gilded dais against it where a king sits; a roof in two tiers of dark
wooden shingles, their eaves trimmed with gold, a golden gable with rays, and a golden finial (cho fa) curling
up at each end of the ridge. Drawn in two parts, so that who sits in it is inside: look.part "back" (the wall,
the floor, the dais) and "front" (the posts and the roof). 800 wide and 700 high at size 1; the floor is 150 up,
the dais's top 190 (hoKhamFloor() and hoKhamDais() give where). look.tint as the hut's. look.pediment "peacock":
a peacock carved in the gable among leaf scrolls, as the Lanna halls' gables have it (the household notebook's
sources: the pediment of the old Ho Kham at Wat Phan Tao, "a peacock surrounded by foliate ornament").
hoKhamFloor(base, size) gives back the y, pixels of the sheet, of the hall's floor: base - 150 x size.
e.g. person(560, hoKhamFloor(980, 0.9), cast("noble"));
```

### `hoKhamDais(base, size)`

```
hoKhamDais(base, size) gives back the y, pixels of the sheet, of the dais's top: base - 190 x size.
e.g. person(720, hoKhamDais(980, 0.9), cast("noble", {floor: "cross"}));
```

### `hoKham(brush, x, base, size, look)`

```
brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look: part ("back" when left
out, or "front"), pediment ("peacock" or none), tint. Returns nothing: it draws with brush, and
leaves brush as it found it.
e.g. hoKham(pen, 720, 980, 0.9, {part: "back"}); person(720, hoKhamDais(980, 0.9), cast("noble")); hoKham(pen, 720, 980, 0.9, {part: "front"});
```

### `gongAt(x, base, size)`

```
A gong (ฆ้อง) on its stand, the stand's foot's middle on (x, base): two posts and a beam of wood, the gong of
bronze hanging from the beam by a cord, a raised boss in its middle. look.struck: the seconds since it was struck
(it swings a little and rings: rings of sound go out from it for a second and a half). 110 wide, 170 high at
size 1; gongAt() gives the boss's middle, where a mallet strikes.
gongAt(x, base, size) gives back [x, y], pixels of the sheet: the boss's middle, where a mallet strikes.
e.g. var boss = gongAt(900, 940, 1);
```

### `gong(brush, x, base, size, look)`

```
brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, struck
(seconds since the stroke; left out, it hangs still and silent). Returns nothing: it draws with
brush, and leaves brush as it found it.
e.g. gong(pen, 900, 940, 1, {struck: 0.4});   // struck 0.4 seconds ago
```

### `linKham(brush, ground, built, look)`

```
A trough of gold (ลินคำ, lin kham) on posts, as a house's rainwater runs along one to a jar: a half-pipe of
gold, lit along its upper lip, raised "high" (46 unless told) above the ground on forked posts of wood, one
every "gap" (80). It runs along "ground", a row of points of the scene on the ground (the first at its start),
and is drawn only "built" of the way along it (0 to 1): a trough as it grows. look.sag: [where (0 to 1 of
the way), how far (px)] for a trough that bends down in its middle; look.size scales its width and its posts;
look.tint as the hut's.
brush: a canvas 2D context; ground: a list of two or more [x, y], pixels of the sheet; built: 0 to 1;
look: optional, high (46), gap (80), sag ([where, pixels]), size (1), tint. Returns nothing: it
draws with brush, and leaves its fill and line set.
e.g. linKham(pen, [[200, 940], [700, 930], [1100, 945]], between(t, 2, 12), {sag: [0.5, 12]});
```

### `thingTone(look)`

```
---------- the things of a Lanna home ----------
Read from the household notebook's sources (the Lanna Traditional House Museum, the Ministry of Education's
book of Thai basketry, Tai Yuan house studies; 2026-10-19): what a Tai Yuan home has, drawn in the kit's
manner. Each a painter on a brush, standing on (x, base), with a size and a look.tint as the hut's.
  huad(brush, x, base, size, t, look)   the sticky-rice steamer: a cone of woven bamboo set in the mouth of a
                                         round clay pot on three hearth stones, a cloth over its top, and with
                                         look.fire (0 to 1) a fire under the pot and steam (t) going up
  kongKhao(brush, x, base, size, look)  the kong khao, the lidded basket that keeps the steamed rice: a round
                                         body of fine woven bamboo on a squared foot, a domed lid, a cord to
                                         carry it by
  krabung(brush, x, base, size, look)   an open basket of woven bamboo, round, a little wider at the mouth, its
                                         rim bound, for crops and the kitchen's things
  mortar(brush, x, base, size, look)    the wooden mortar and its long pestle, kept under the house: a block of
                                         wood hollowed at its top, the pestle leaning against it (look.pound, a
                                         second: it is pounded, up and down, as the second runs)
  taLaew(brush, x, base, size, look)    the ta laew, a star of woven bamboo strips on a post, at a yard's way in,
                                         against bad fortune: look.points 6 (or 8, the great one)
thingTone(look) gives back a function (colour) -> colour: "#rrggbb" blended toward look.tint[0] by
look.tint[1], or the colour as it is when look or look.tint is missing.
e.g. var tone = thingTone({tint: ["#2a3a6a", 0.3]}); brush.fillStyle = tone("#8a4a2e");
```

### `thingFill(brush, colour, line)`

```
brush: a canvas 2D context holding a path; colour: "#rrggbb"; line: pixels (1.8 when left out).
Returns nothing; it leaves brush's fill and line set.
e.g. brush.beginPath(); brush.rect(-16, -14, 32, 14); thingFill(brush, "#8a6a3a");
the kit's manner: flat colour inside a fine dark line
```

### `thingWeave(brush, left, top, wide, high, colour, step)`

```
brush: a canvas 2D context; left, top, wide, high, step: pixels of the brush's frame; colour: a CSS
colour. Returns nothing; it leaves brush's line set.
e.g. brush.save(); brush.clip(); thingWeave(brush, -40, -78, 80, 66, "rgba(110, 78, 36, 0.5)", 5); brush.restore();
a plain weave of strips, clipped by the caller
```

### `huad(brush, x, base, size, t, look)`

```
huad(brush, x, base, size, t, look) draws the sticky-rice steamer on its pot and stones (see the list
above), about 90 wide and 146 tall at size 1. brush: a canvas 2D context; x, base: pixels of the
sheet; size: needed; t: seconds; look: optional, fire (0 to 1, 0), tint. Returns nothing: it draws
with brush, and leaves brush as it found it.
e.g. huad(pen, 640, 940, 1, t, {fire: 1});
```

### `kongKhao(brush, x, base, size, look)`

```
kongKhao(brush, x, base, size, look) draws the lidded rice basket, about 60 wide and 100 tall at size
1. brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, tint.
Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. kongKhao(pen, 560, 930, 1.1);
```

### `krabung(brush, x, base, size, look)`

```
krabung(brush, x, base, size, look) draws an open basket, 68 wide and 54 tall at size 1. brush: a
canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, tint. Returns
nothing: it draws with brush, and leaves brush as it found it.
e.g. krabung(pen, 480, 930, 1.1);
```

### `mortar(brush, x, base, size, look)`

```
mortar(brush, x, base, size, look) draws the wooden mortar and its pestle, the block 56 wide and 60
tall at size 1. brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look:
optional, pound (seconds: pounding), tint. Returns nothing: it draws with brush, and leaves brush
as it found it.
e.g. mortar(pen, 820, 940, 1.1, {pound: t});
```

### `taLaew(brush, x, base, size, look)`

```
taLaew(brush, x, base, size, look) draws the ta laew on its post, about 210 tall at size 1. brush:
a canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, points (6), tint.
Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. taLaew(pen, 200, 940, 1.1, {points: 8});
```

### `grassBundle(brush, x, y, size, look)`

```
Things a person holds out, to feed an animal (owner, 2026-10-20: "Make grass and a banana for the kit"), drawn with
their middle on (x, y), so a hand can hold them: grassBundle() an armful of cut grass, look.tied (true: a band of
twisted grass round the middle, the blades fanned above and below it; false: loose blades, drooping);
bananas() a hand of short, plump bananas (kluai nam wa, the north's everyday banana), look.count (1 to 6),
look.ripe (0 green to 1 yellow, brown-flecked), look.angle. Each about 90 long at size 1.
brush: a canvas 2D context; x, y: its middle, pixels of the sheet; size: needed; look: optional,
tied (true), angle (radians, 0), tint. Returns nothing: it draws with brush, and leaves brush as it
found it.
e.g. var j = person(600, 950, cast("boy")); grassBundle(pen, j.handA[0], j.handA[1], 1, {angle: -0.4});
```

### `bananas(brush, x, y, size, look)`

```
brush: a canvas 2D context; x, y: the crown where they meet, pixels of the sheet; size: needed;
look: optional, count (1 to 6, 1), ripe (0 to 1, 1), angle (radians, 0), tint. Returns nothing:
it draws with brush, and leaves brush as it found it.
e.g. bananas(pen, 640, 900, 1, {count: 4, ripe: 0.8});
```

### `grassTuft(brush, x, y, size, look)`

```
A tuft of grass growing (owner, 2026-10-21: "Add some grass tufts", for the buffalo to eat): blades from one root at
(x, y), the ground, up and out, swaying a little with look.t (the second); look.eaten (0 to 1) crops them short, as a
buffalo leaves a tuft; look.tint as a set's pieces take it. About 50 tall at size 1.
brush: a canvas 2D context; x, y: its root, pixels of the sheet; size: needed; look: optional, t
(seconds, 0), eaten (0 to 1, 0), tint. Returns nothing: it draws with brush, and leaves brush as it
found it.
e.g. grassTuft(pen, 520, 960, 1, {t: t, eaten: between(t, 3, 8)});
```

### `fireStick(brush, from, to, look)`

```
A fire stick (owner, 2026-10-20: "When he's feeding the monster coals, have the boy flip them up with a stick"): a
thin length of split bamboo from a hand (from) out to its far end (to), the far end charred, and glowing while it
is in the fire (look.hot, 0 to 1). Pass a person's hand joint as from, and the point in the coals, or up in the
air at the top of a flick, as to; emberFlight() then throws the ember from the stick's end.
brush: a canvas 2D context; from, to: [x, y], pixels of the sheet; look: optional, hot (0 to 1, 0),
tint. Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. fireStick(pen, person(600, 950, cast("boy")).handA, [760, 930], {hot: 0.6});
```

### `ruenPhuk(brush, x, base, size, look)`

```
The poor family's house of the north, a bamboo house (เรือนเครื่องผูก), drawn 2026-10-20. Owner: "research traditional Lanna housing
and redo the poor house like this" (a picture of the bamboo house at Chiang Mai University's Lanna Traditional House
Museum). From the kit's research ("Lanna houses" notebook): the เรือนเครื่องผูก, a house tied together, not nailed:
bamboo posts with bracing, the floor raised; walls and floor of flattened split bamboo (ฟาก), bound with bamboo
strips and rattan; one steep gable roof (45 degrees and more) with low sweeping eaves, laid in rows of tong tueng
leaf panels (ตับ), a plain ridge with crossed bamboo tips (no carved kalae: that is a rich house's); an open veranda
(ชาน) with a low railing and a water-pot shelf under its own little roof; the ladder recessed under the eaves, a
water jar at its foot to wash the feet; hardly any windows; under the house, firewood and tools.
ruenPhuk(brush, x, base, size, look): standing on (x, base); about 290 wide and 240 high at size 1; the door at the
right, the veranda and the ladder right of it, where the tub's door and ladder were. look: glow (0 to 1, a lamp in
the doorway at night), tint ([colour, amount]).
brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, glow (0 to
1, 0), tint. Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. ruenPhuk(pen, 900, 900, 1.2, {glow: 0.7});
```

## flora.js

flora.js - the flowers and fruits of Thailand, drawn small, for films made with oldcartoon.js. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="flora.js"></script>  and call flora(name, x, y, look) from a scene. (x, y) is the foot of a flower's stem, or the ground a fruit lies on. The names are the keys of FLORA below; each has its Thai name beside it, and how that is said.  flora("mango", 700, 900, {size: 1.5}); flora("orchid", 300, 1000, {colour: "#e86fb0"});  A tree in flower or in fruit is painted on a set's sheet, as the kit's tree() is, with the named flower or fruit hanging in its boughs:  floraTree(brush, 240, 900, 1.0, "mango", 1);  They are drawn in the kit's manner: flat colour inside a fine dark line. What each is, in rules, is the comment above its painter. The flowers are the ones of a northern garden and a temple's offering tray: ratchaphruek, the golden shower that is the national flower; thong kwao, the flame of the forest that is Chiang Mai's own; frangipani; an orchid; hibiscus; bougainvillea; jasmine; and marigold. The fruits are the ones of the market and the orchard: mango, durian, mangosteen, rambutan, the longan of Lamphun and Chian

### `floraPaint(colour, paint)`

```
The kit's shape(), with a gradient as the paint and the ink taken from "colour".
colour: "#rrggbb" (the ink is the kit's inkFor() of it); paint: a gradient or colour to fill with
(colour when left out). Returns nothing: it fills and inks the path pen holds, and leaves pen's
fill and line as it set them.
e.g. pen.beginPath(); pen.ellipse(0, -40, 34, 40, 0, 0, 7); floraPaint("#d8306e");
```

### `floraLeaf(x, y, long, wide, turn, deep, pale)`

```
A leaf growing from (x, y), "long" and "wide", turned by "turn" from straight up.
x, y, long, wide: pixels of the pen's frame; turn: radians, 0 straight up; deep, pale: the leaf's two greens
(FLORA_LEAF and FLORA_PALE when left out). Returns nothing: it draws with pen (the kit's paintLeaf()).
e.g. floraLeaf(-40, -14, 40, 14, -1.1);
```

### `floraBall(x, y, r, colour, shine)`

```
A round fruit or bud of radius r, with a light on its upper left unless told not.
x, y, r: pixels of the pen's frame; colour: "#rrggbb"; shine: false for no light. Returns nothing: it draws with pen.
e.g. floraBall(-24, -46, 46, "#c9d66a");
```

### `floraPetals(x, y, count, long, wide, colour, heart, turn, rim)`

```
"count" petals round (x, y), each an ellipse "long" out from the heart and
"wide" across; pale toward "rim" if a rim colour is given; a heart of "heart".
x, y, long, wide: pixels of the pen's frame; count: how many; colour, heart, rim: "#rrggbb" (heart and rim may be
left out); turn: radians, 0 when left out. Returns nothing: it draws with pen.
e.g. floraPetals(0, -90, 6, 9, 5.4, FLORA_WHITE, "#f2e4a0", 0.3);
```

### `floraBunch(x, y, count, r, colour, seed, spread, dot, bumps)`

```
A bunch that hangs from (x, y): "count" stalks to round fruits of radius r
below, the lowest drawn last so that it lies in front. "dot" marks each
with a dark speck, "bumps" with the short arcs of a lychee's skin.
x, y, r, spread: pixels of the pen's frame; count: how many fruits; colour: "#rrggbb"; seed: a number; dot, bumps:
true or false. Returns nothing: it draws with pen.
e.g. floraBunch(0, -108, 13, 8, "#c9a060", 4, 68, true, false);
```

### `floraRaceme(x, y, long, seed)`

```
Ratchaphruek, the golden shower: a raceme of small yellow five-petal
flowers that hangs "long" from (x, y), the buds at its tip.
x, y, long: pixels of the pen's frame; seed: a number.
Returns nothing: it draws with pen.
e.g. floraRaceme(-8, -104, 92, 3);
```

### `floraRatchaphruek(look, seed)`

```
A sprig of it: a twig with its leaves in a fan, and two racemes hanging.
FLORA.ratchaphruek.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("ratchaphruek", 700, 900, {size: 1.5});
```

### `floraFlame(x, y, turn, colour)`

```
Thong kwao, the flame of the forest: one flower is a curved keel like a
parrot's beak, orange-red, in a dark velvet calyx; they stand in clusters
on a bare twig, because the tree flowers before it has leaves.
x, y: pixels of the pen's frame; turn: radians; colour: "#rrggbb".
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraFlame(0, 0, -1.2, "#f0581e");
```

### `floraFlameCluster(x, y, colour, seed)`

```
Draws one cluster of six flames round (x, y).
x, y: pixels of the pen's frame; colour: "#rrggbb"; seed: a number.
Returns nothing: it draws with pen.
e.g. floraFlameCluster(12, -118, "#f0581e", 2);
```

### `floraThongkwao(look, seed)`

```
FLORA.thongkwao.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("thongkwao", 700, 900, {size: 1.5});
```

### `floraFrangipaniBloom(x, y, r, colour, turn)`

```
Frangipani (leelawadee): five petals that overlap like a pinwheel, each
wider at its tip, white (or the colour told) going to yellow at the heart.
x, y, r: pixels of the pen's frame; colour: "#rrggbb"; turn: radians (needed).
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraFrangipaniBloom(-18, -108, 22, FLORA_WHITE, 0.2);
```

### `floraFrangipani(look, seed)`

```
A sprig: a thick grey-green twig, long leaves, three blooms and a bud.
FLORA.frangipani.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("frangipani", 700, 900, {size: 1.5});
```

### `floraFrangipaniHang(seed, colour)`

```
FLORA.frangipani.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number; colour: "#rrggbb" (FLORA.frangipani.hang passes FLORA_WHITE when it is given none). Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "frangipani", 1);
```

### `floraOrchidBloom(x, y, r, colour, turn)`

```
An orchid: five petals, pale at their rims, and a darker lip below with a
yellow throat; the blooms stand along an arching spray over strap leaves.
x, y, r: pixels of the pen's frame; colour: "#rrggbb"; turn: radians.
Returns nothing: it draws with pen.
e.g. floraOrchidBloom(12, -80, 15, "#b64fb3", 0.6);
```

### `floraOrchid(look, seed)`

```
FLORA.orchid.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("orchid", 700, 900, {size: 1.5});
```

### `floraHibiscusBloom(x, y, r, colour, turn)`

```
Hibiscus (chaba): one big flower of five broad petals, paler at their rims,
with a long column from its heart carrying the pollen and five red tips.
x, y, r: pixels of the pen's frame; colour: "#rrggbb"; turn: radians.
Returns nothing: it draws with pen.
e.g. floraHibiscusBloom(10, -118, 34, "#d93a2e", 0.3);
```

### `floraHibiscus(look, seed)`

```
FLORA.hibiscus.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("hibiscus", 700, 900, {size: 1.5});
```

### `floraBract(x, y, long, turn, colour)`

```
Bougainvillea (fueang fa): what shows is three papery bracts, magenta,
round a few tiny white flowers; they crowd a thorny woody twig.
x, y, long: pixels of the pen's frame; turn: radians; colour: "#rrggbb".
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraBract(0, 0, 22, 1, "#d8338a");
```

### `floraBractCluster(x, y, colour, seed)`

```
Draws three bracts and their white flowers round (x, y).
x, y: pixels of the pen's frame; colour: "#rrggbb"; seed: a number.
Returns nothing: it draws with pen.
e.g. floraBractCluster(50, -122, "#d8338a", 1);
```

### `floraBougainvillea(look, seed)`

```
FLORA.bougainvillea.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("bougainvillea", 700, 900, {size: 1.5});
```

### `floraJasmineBloom(x, y, r, turn)`

```
Jasmine (mali): small white flowers of rounded petals, and buds like
white grains in a green cup, on thin stems with small dark leaves in pairs.
Draws one jasmine flower of six petals.
x, y, r: pixels of the pen's frame; turn: radians.
Returns nothing: it draws with pen.
e.g. floraJasmineBloom(6, -92, 9, 0.3);
```

### `floraJasmineBud(x, y, turn)`

```
Draws a jasmine bud standing from its cup at (x, y).
x, y: pixels of the pen's frame; turn: radians.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraJasmineBud(18, -84, 0.4);
```

### `floraJasmine(look, seed)`

```
FLORA.jasmine.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("jasmine", 700, 900, {size: 1.5});
```

### `floraPompom(x, y, r, outer, inner)`

```
Marigold (dao rueang): a pompom of many short ruffled petals, orange
outside and lighter at the heart, on a stem with ferny leaves.
x, y, r: pixels of the pen's frame; outer, inner: "#rrggbb".
Returns nothing: it draws with pen.
e.g. floraPompom(-12, -118, 26, "#f08a1e", "#f8b44c");
```

### `floraMarigold(look, seed)`

```
FLORA.marigold.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("marigold", 700, 900, {size: 1.5});
```

### `floraMango(x, y, size, turn)`

```
A mango: a kidney shape with a beak at one end, green at the stem going to
yellow and a blush of orange, lying on its side, with a leaf.
x, y: its middle, pixels of the pen's frame; size: 1 is 68 long; turn: radians.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraMango(0, -14, 1, -0.15);
```

### `fruitMango(look, seed)`

```
FLORA.mango.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("mango", 700, 900, {size: 1.5});
```

### `fruitMangoHang(seed)`

```
FLORA.mango.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number. Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "mango", 1);
```

### `floraDurian(x, y, size, turn, seed)`

```
A durian: a big oval in a coat of spikes, green going to brown, a thick
stem at one end; the spikes on its face are marks like small tents.
x, y: its middle, pixels of the pen's frame; size: 1 is about 130 long; turn: radians; seed: a number.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraDurian(0, -54, 1, 0.1, 2);
```

### `fruitDurian(look, seed)`

```
FLORA.durian.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("durian", 700, 900, {size: 1.5});
```

### `fruitDurianHang(seed)`

```
FLORA.durian.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number. Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "durian", 1);
```

### `floraMangosteen(x, y, size)`

```
A mangosteen: a round fruit of deep purple with a cap of four thick green
lobes round its stem, and a rosette of marks on its underside; beside it,
the lower half of one opened, its white segments in the pink of the rind.
x, y: its foot, pixels of the pen's frame; size: 1 is 44 across.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraMangosteen(-20, 0, 1);
```

### `floraMangosteenHalf(x, y, size)`

```
Draws the opened half of a mangosteen.
x, y: its foot, pixels of the pen's frame; size: 1 is 40 across.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraMangosteenHalf(26, 0, 1);
```

### `fruitMangosteen(look, seed)`

```
FLORA.mangosteen.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("mangosteen", 700, 900, {size: 1.5});
```

### `fruitMangosteenHang(seed)`

```
FLORA.mangosteen.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number. Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "mangosteen", 1);
```

### `floraRambutan(x, y, r, seed)`

```
A rambutan: a red ball in a coat of soft hairs that turn green at their
tips; three on a twig, with a leaf.
x, y, r: its middle and radius, pixels of the pen's frame; seed: a number.
Returns nothing: it draws with pen.
e.g. floraRambutan(-2, -50, 15, 6);
```

### `fruitRambutan(look, seed)`

```
FLORA.rambutan.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("rambutan", 700, 900, {size: 1.5});
```

### `fruitRambutanHang(seed)`

```
FLORA.rambutan.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number. Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "rambutan", 1);
```

### `fruitLongan(look, seed)`

```
Longan (lamyai), the orchard crop of Lamphun and Chiang Mai: a bunch of
small round fruits in thin brown skins hanging from a twig with two
leaves, and one peeled, white, with its black seed showing.
FLORA.longan.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("longan", 700, 900, {size: 1.5});
```

### `fruitLonganHang(seed)`

```
FLORA.longan.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number. Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "longan", 1);
```

### `fruitLychee(look, seed)`

```
Lychee (linchi): a bunch of red fruits with a bumpy skin, on a twig with
leaves, and one peeled to its white flesh.
FLORA.lychee.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("lychee", 700, 900, {size: 1.5});
```

### `fruitLycheeHang(seed)`

```
FLORA.lychee.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number. Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "lychee", 1);
```

### `floraPapaya(x, y, size, turn)`

```
A papaya: long, narrow at the stem and full at the far end, green going to
orange, with faint ridges along it; and one cut lengthwise, its orange
flesh round a boat of black seeds.
x, y: its middle, pixels of the pen's frame; size: 1 is about 120 long; turn: radians.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraPapaya(-22, -34, 0.9, -0.08);
```

### `floraPapayaHalf(x, y, size)`

```
Draws a papaya cut lengthwise.
x, y: its middle, pixels of the pen's frame; size: 1 is about 120 long.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraPapayaHalf(44, -12, 0.55);
```

### `fruitPapaya(look, seed)`

```
FLORA.papaya.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("papaya", 700, 900, {size: 1.5});
```

### `fruitPapayaHang(seed)`

```
FLORA.papaya.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number. Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "papaya", 1);
```

### `fruitCoconut(look, seed)`

```
A young coconut as the street sells it: the green husk trimmed to a peak
of flat cuts, with a pale cut at the top to drink from.
FLORA.coconut.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("coconut", 700, 900, {size: 1.5});
```

### `fruitPineapple(look, seed)`

```
A pineapple: a crown of stiff leaves on a body netted in diamonds, each
with a dark eye, orange going to brown at its foot.
FLORA.pineapple.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("pineapple", 700, 900, {size: 1.5});
```

### `floraJackfruit(x, y, size, turn, seed)`

```
A jackfruit: a great oblong, green-yellow, all over small bumps, with a
short thick stem; it grows from the trunk of its tree.
x, y: its middle, pixels of the pen's frame; size: 1 is 148 long; turn: radians; seed: a number.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. floraJackfruit(0, -54, 1, 0.12, 3);
```

### `fruitJackfruit(look, seed)`

```
FLORA.jackfruit.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("jackfruit", 700, 900, {size: 1.5});
```

### `fruitJackfruitHang(seed)`

```
FLORA.jackfruit.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
seed: a number. Returns nothing: it draws with pen.
e.g. floraTree(pen, 240, 900, 1.0, "jackfruit", 1);
```

### `fruitDragonfruit(look, seed)`

```
A dragon fruit: an oval of magenta in a coat of scales, each a flap that
turns green at its tip.
FLORA.dragonfruit.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("dragonfruit", 700, 900, {size: 1.5});
```

### `fruitPomelo(look, seed)`

```
A pomelo: a big round fruit of pale green-yellow with a nub at the top
and the pores of its rind; beside it a segment peeled to its pink pulp.
FLORA.pomelo.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0). Call flora() instead.
e.g. flora("pomelo", 700, 900, {size: 1.5});
```

### `flora(name, x, y, look)`

```
One flower or fruit at (x, y). "name" is a key of FLORA.
flora(name, x, y, look) draws one flower or fruit, with a soft shadow under it unless look.ground is false.
  name   a key of FLORA: ratchaphruek, thongkwao, frangipani, orchid, hibiscus, bougainvillea, jasmine,
         marigold, mango, durian, mangosteen, rambutan, longan, lychee, papaya, coconut, pineapple,
         jackfruit, dragonfruit, pomelo; another is reported by checkName() and nothing is drawn
  x, y   the foot of the stem, or the ground the fruit lies on, pixels of the sheet
  look   optional; its keys: FLORA_KEYS, at the top of this file (size 1, colour, ground)
Returns nothing: it draws with pen, and leaves pen as it found it. It sets the kit's LINE and FINE
while it draws, and puts them back to STYLE.line and 1 after.
e.g. flora("orchid", 300, 1000, {colour: "#e86fb0"});
```

### `floraPapayaTree(x, base, size, seed)`

```
A papaya tree: a slim straight trunk, grey-green, marked where leaves
have fallen, its fruit crowded under a crown of big lobed leaves on long
stalks. Drawn with the pen at (x, base), scaled by size.
x, base: its foot, pixels of the pen's frame; size: 1 is about 400 tall; seed: a number.
Returns nothing: it draws with pen, and leaves pen as it found it. floraTree(brush, ..., "papaya")
calls it with pen pointed at the brush.
e.g. floraTree(pen, 300, 900, 1, "papaya", 2);
```

### `floraTree(brush, x, base, size, name, seed, colour)`

```
The kit's tree with the named flower or fruit in its boughs, painted on a
set's sheet ("brush") as tree() is. Eight hang in the canopy, a jackfruit
on the trunk; a papaya has a tree of its own; a coconut is on the kit's
palm already, and a pineapple grows on the ground.
  brush    a canvas 2D context: a set's sheet, painted once
  x, base  its foot, pixels of the sheet; size: as the kit's tree() takes it
  name     a key of FLORA that has a hang (FLORA_TREES): ratchaphruek, thongkwao, frangipani,
           bougainvillea, mango, durian, mangosteen, rambutan, longan, lychee, papaya, jackfruit;
           another is reported by checkName() and nothing is drawn
  seed     a number, 0 when left out; colour: the flower's "#rrggbb", for the ones that take one
Returns nothing: it draws with brush. It points pen at brush while it draws and puts pen and LINE
back after; FINE is left at 1.
e.g. floraTree(pen, 240, 900, 1.0, "mango", 1);
```

## food.js

food.js - a dozen Thai dishes, drawn small, for films made with oldcartoon.js. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="food.js"></script>  and call food(name, x, y, look) from a scene. (x, y) is the middle of what the dish stands on: a mat, a table, the ground. The names are the keys of FOODS below; each has its Thai name beside it, and how that is said.  food("khaosoi", 700, 900, {size: 2});  They are drawn in the kit's manner: flat colour inside a fine dark line, seen from the side and a little from above, as the paintings show a tray. What each is, in rules, is the comment above its painter. The dishes are the ones a northern Thai household and market have: sticky rice in its basket, khao soi, a mortar of som tam, mango and sticky rice, the coiled sausage sai ua, a chilli dip with vegetables and pork crackling, a curry, a tom yam, phat thai, pork on skewers, coconut cakes in their pan, and the khantok, the low round table that a meal is set on.  The names a food's look may have (food() warns about any other): size       how large it is drawn: 1 is as large as it is beside the cast at their own sizes (a bowl is about 64 across) colour     the cu

### `foodBowl(wide, deep, colour, band, inside)`

```
A bowl, seen from the side and a little from above: its rim is an ellipse
"wide" to each side, "deep" above the ground. "band" is the colour of the
line painted under the rim, or nothing. "inside" paints what is in it: it
is called with the pen kept to the rim, and (0, 0) at the rim's middle.
wide, deep: pixels of the pen's frame (the dish's own frame, before food()'s size); colour, band:
"#rrggbb" (band may be left out); inside(wide, flat): a function that paints the bowl's contents.
Returns nothing: it draws with pen at (0, 0), the ground under the bowl's middle, and leaves pen's
fill and line as shape() leaves them.
e.g. foodBowl(52, 40, FOOD_WHITE, "#b23a3a", function (wide, flat) { pen.fillStyle = "#9db656"; pen.fillRect(-wide, -flat, wide * 2, flat * 2); });
```

### `foodPlate(wide, colour)`

```
A plate: a rim "wide" to each side, and a well in it.
wide: pixels of the pen's frame; colour: "#rrggbb". Returns nothing: it draws with pen, its middle
on (0, 0).
e.g. foodPlate(64, FOOD_WHITE);
```

### `foodLeaf(wide, deep)`

```
A piece of banana leaf to lay food on: green, with its rib and its veins.
wide, deep: pixels of the pen's frame, to each side and up and down from (0, 0). Returns nothing:
it draws with pen, and leaves its strokeStyle and lineWidth set.
e.g. foodLeaf(74, 34);
```

### `foodSteam(x, y, look, seed)`

```
Steam over a hot dish: three wisps that rise, fade, and begin again.
x, y: the foot of the steam, pixels of the pen's frame; look: the dish's look (look.steam false
draws none); seed: a number that sets the wisps apart from another dish's. Reads the kit's clock.
Returns nothing: it draws with pen, and leaves its line set (round caps).
e.g. foodSteam(0, -84, {}, 0.5);
```

### `foodLime(x, y, turn)`

```
A wedge of lime: a half circle of rind, and the pale flesh in it.
x, y: pixels of the pen's frame; turn: radians. Returns nothing: it draws with pen, and leaves pen
as it found it.
e.g. foodLime(-42, -46, 2.6);
```

### `foodPrawn(x, y, turn, scale)`

```
A cooked prawn: a curled body in bands, a fan of a tail.
x, y: pixels of the pen's frame; turn: radians; scale: its size (1 is 60 long). Returns nothing:
it draws with pen, and leaves pen as it found it.
e.g. foodPrawn(-4, -56, -0.2, 0.8);
```

### `foodStickyRice(look, seed)`

```
Sticky rice in its basket (a kratip): woven bamboo on a small foot, the lid
lifted on one side so that the rice shows, and a cord to carry it by.
One of FOODS' painters ("stickyrice"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("stickyrice", 700, 900, {size: 1.5});
```

### `foodKhaoSoi(look, seed)`

```
Khao soi: a bowl of curry broth with a nest of crisp noodles on it, a leg
of chicken, shallot, a wedge of lime, and chopsticks across the rim.
One of FOODS' painters ("khaosoi"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (look.steam false: no steam); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("khaosoi", 700, 900, {size: 1.5});
```

### `foodSomTam(look, seed)`

```
Som tam: a clay mortar heaped with shreds of green papaya, tomato, long
beans, chilli and peanuts, with the wooden pestle standing in it.
One of FOODS' painters ("somtam"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("somtam", 700, 900, {size: 1.5});
```

### `foodMangoRice(look, seed)`

```
Mango and sticky rice: slices of ripe mango laid in a fan, a mound of
rice with coconut cream over it and yellow beans on the cream.
One of FOODS' painters ("mangorice"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("mangorice", 700, 900, {size: 1.5});
```

### `foodSaiUa(look, seed)`

```
Sai ua: the sausage of the north, in a coil on a banana leaf, flecked with
herbs and chilli, and two slices cut from its end.
One of FOODS' painters ("saiua"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("saiua", 700, 900, {size: 1.5});
```

### `foodNamPhrik(look, seed)`

```
Nam phrik num: a small bowl of green chilli dip on a plate, with what is
eaten with it: slices of cucumber, a wedge of cabbage, long beans, and
pieces of pork crackling.
One of FOODS' painters ("namphrik"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("namphrik", 700, 900, {size: 1.5});
```

### `foodCurry(look, seed)`

```
A curry: a bowl of it, green unless its colour is told, with coconut cream
turned through it, round eggplants, slices of red chilli and leaves of basil.
One of FOODS' painters ("curry"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (look.colour: the curry's colour, green when left out; look.steam false: no steam); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("curry", 700, 900, {size: 1.5});
```

### `foodTomYum(look, seed)`

```
Tom yam kung: a bowl of red broth with prawns, straw mushrooms, a stalk of
lemongrass and lime leaves.
One of FOODS' painters ("tomyum"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (look.steam false: no steam); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("tomyum", 700, 900, {size: 1.5});
```

### `foodPadThai(look, seed)`

```
Phat thai: a plate of fried noodles with a prawn on them, bean sprouts and
chives beside, crushed peanuts, and a wedge of lime.
One of FOODS' painters ("padthai"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("padthai", 700, 900, {size: 1.5});
```

### `foodMuPing(look, seed)`

```
Mu ping: pork grilled on skewers of bamboo, three of them on a leaf, each
piece glazed and marked by the fire.
One of FOODS' painters ("muping"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("muping", 700, 900, {size: 1.5});
```

### `foodKhanomKrok(look, seed)`

```
Khanom khrok: small cakes of coconut cream, cooked in the round iron pan
with seven hollows, each white with a browned edge and a little green onion.
One of FOODS' painters ("khanomkrok"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (look.steam false: no steam); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
e.g. food("khanomkrok", 700, 900, {size: 1.5});
```

### `foodKhantoke(look, seed)`

```
A khantok: the low round table of the north, red lacquer on a ring of
turned legs, set with small bowls and a basket of sticky rice.
One of FOODS' painters ("khantoke"): food() calls it with the pen moved to the dish's foot and scaled.
look: food()'s look (passed to the basket); seed: a number for the steam (food() passes x * 0.013).
Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line and scale changed: call food() instead.
e.g. food("khantoke", 700, 900, {size: 1.5});
```

### `food(name, x, y, look)`

```
One dish, standing on (x, y). "name" is a key of FOODS.
food(name, x, y, look) draws one dish with a soft shadow under it.
  name   a key of FOODS: stickyrice, khaosoi, somtam, mangorice, saiua, namphrik, curry, tomyum,
         padthai, muping, khanomkrok, khantoke; another name is reported by checkName() and nothing is drawn
  x, y   the middle of what it stands on, pixels of the sheet
  look   optional; its keys: FOOD_KEYS above (size 1, colour for the curry, steam false)
Returns nothing: it draws with pen, and leaves pen as it found it. It sets the kit's LINE and FINE
while it draws, and puts them back to STYLE.line and 1 after.
e.g. food("khaosoi", 700, 900, {size: 2});
```

## khom.js

khom.js - the hanging paper lantern of Lanna (โคมล้านนา, the khom hung up for Yi Peng), for films made with oldcartoon.js. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="khom.js"></script>  and call khom(x, y, look) from a scene: (x, y) is where its string is tied, and the lantern hangs below it. It is drawn on the kit's sheet, "pen", at the kit's second, "clock", and it is a plain function of time: nothing is kept between frames, so a still is the film's own frame.  Nothing is copied. It was read by eye from a drawing of three such lanterns, red, blue and green, each worked in gold, and this file keeps what the lanterns do, as rules, and draws its own in the kit's manner, flat colour inside a fine line: 1. A crown of three paper points on top: the middle one tallest, the two beside it shorter and leaning out. 2. A body of eight sides in three rings: sloping panels above, upright panels in the middle, where it is widest, sloping panels below. The front panel faces us, and the panels beside it are seen aslant. 3. Every edge of the paper is bound in a gold ribbon with a toothed edge, and a band of gold rings the top and the foot. 4. A gold flower in every 

### `khomRibbon(gold)`

```
A gold ribbon along the path the pen holds: a fine dark line, the gold
over it, and teeth of gold along both its edges.
gold: "#rrggbb". Returns nothing: it strokes the path pen holds three times, and leaves pen's
strokeStyle, lineWidth, lineJoin and lineCap as it set them (the line dash back to none).
e.g. pen.beginPath(); pen.moveTo(0, 0); pen.lineTo(0, 40); khomRibbon(KHOM_GOLD);
```

### `khomFlower(cx, cy, long, gold, hole, across, turn)`

```
A gold flower: eight petals round a hole where the paper shows through.
"across" squashes it sideways, for a panel seen aslant; "turn" tilts it.
cx, cy, long (the petals' length): pixels of the pen's frame; gold, hole: "#rrggbb" (hole is the
paper's colour); across: 0 to 1, 1 when left out; turn: radians, 0 when left out.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. khomFlower(0, 120, 13, KHOM_GOLD, KHOM_RED, 1, 0);
```

### `khomDiamond(cx, cy, half, gold, across)`

```
The diamond frame round the front panel's flower, with a dot in each corner.
cx, cy, half (its half-height): pixels of the pen's frame; gold: "#rrggbb"; across: 0 to 1 (must
be given). Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. khomDiamond(0, 130, 22, KHOM_GOLD, 1);
```

### `khomBreeze(t)`

```
The breeze at second t: a slow pressure that comes and goes, never twice
alike, between about -1.7 and 1.7.
t: seconds. Returns a number, about -1.7 to 1.7. Changes nothing.
e.g. var drift = 18 * khomBreeze(clock);
```

### `khomStrip(cx, top, half, long, colour, gold, wind, at, end)`

```
A ribbon of paper hanging from (cx, top), "half" wide each side, "long"
down, that sways in the breeze: the whole of it drifts to one side and
back, more toward its end, and its end trails its root by most of a
second, with only a faint flutter over that. "at" is its own second.
"end" is "point" for a streamer or "fish" for the tail's three points. It
gives back the places of its middle every twelfth of the way, for the
flowers.
  cx, top, half, long   pixels of the pen's frame
  colour, gold          "#rrggbb"
  wind                  0 to 1 (how far it sways)
  at                    seconds
  end                   "point" or "fish"
Returns a list of 13 [x, y, angle] (angle in radians, its lean there), from root to end.
It draws with pen and leaves its fill and line set (khomRibbon()).
e.g. var mids = khomStrip(0, 196, 24, 214, KHOM_RED, KHOM_GOLD, 1, clock, "fish");
```

### `khom(x, y, look)`

```
khom(x, y, look) draws the hanging khom of Yi Peng, its string tied at (x, y), pixels of the sheet,
the lantern below it, at the kit's second (clock + look.late). look: optional; its keys are KHOM_KEYS,
listed at the top of this file (defaults: size 1, colour KHOM_RED, gold KHOM_GOLD, lit 0, sway 1,
spin 1, wind 1, lean 0, late 0, tail true). A name it does not know is reported by checkNames().
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. khom(640, 120, {colour: KHOM_BLUE, lit: 1, late: 0.7});
```

### `khomKeys(names)`

```
---------- More lanterns of Lanna (2026-10-16) ----------
Four more of the north's lanterns, beside the hanging khom above; khom()
is as it was. Each is drawn on "pen" at the kit's second, from (x, y), and
is a plain function of time, as khom() is. What each is, from what is
written of it (the NotebookLM notebook "Lanna material culture"): Polyglot
Petra's "Lanna Lanterns" (the four kinds by use, tabletop, floating,
handheld and hanging, and the shapes: cylinder, spinning, Dharmachakra,
octagon, sixteen-angled, stars), Soodprod of Bangkok Bank on the khom
phat, Wikipedia on Yi Peng (the khom phat that told the Vessantara Jataka,
raised on pulleys, so also called khom lo) and the CMU Lanna Information
Center on the lanterns of Yi Peng. No free photograph of any of the four
was found on Wikimedia Commons: they are drawn from those words, in the
manner of khom() (paper in one colour, every edge in a toothed gold
ribbon), and each is to be checked against a photograph when one turns up.
  khomPhat   the spinning lantern: a cylinder of white mulberry or kite
             paper; inside it a frame that turns, strung with threads and
             hung with figures cut from black paper; a little wheel of
             vanes on top that the candle's heat turns, so the figures'
             shadows go round the paper. Here the figures are of the
             village (an elephant, a horse and its rider, a deer, a
             carrier with two baskets on a pole, a buffalo, a dancer), not
             the stories of the temple.
  khomThue   the handheld lantern of the parades: a small lantern with a
             handle underneath, "quite like a giant candle", in coloured
             paper with gold, carried upright.
  khomDao    a star lantern: a star of five points, each point a low
             pyramid of paper, hung from its top point, with paper tails
             from its lower points.
  khomBua    a lotus lantern: a lotus of paper with open petals, hung
             from above, a paper tail under it.
The look of each (names it does not know are reported, as khom() does):
  size, colour, gold, lit    as for khom(): 1 is the size the comments give
  sway, late, lean           as for khom()
  spin       khomPhat: how fast the inner frame turns (1, about a turn in
             fourteen seconds; 0 still, as an unlit one is). khomDao: how
             far it turns on its string, as for khom()
  turn       khomPhat: the inner frame's angle, for a film that turns it
             itself (a frame that starts still and gathers speed); it
             stands in for spin times the clock
  figures    khomPhat: the figures that go round, a list of functions, each
             drawing one figure on "pen", standing on (0, 0) and facing
             right, about 44 to 100 tall, given a step to walk by; the
             black-paper cut-outs of KHOM_CUTOUTS unless a film gives its own
  light      khomPhat: true for figures of light: the frame inside is a
             dark drum with the figures cut out of it, so the paper is dim
             and each figure glows on it in the candle's colour (drawn on a
             layer of its own, whatever the figure is made of)
  wind, tail khomDao and khomBua: as for khom()
khomThue's (x, y) is where a hand holds its handle: draw it after the one
who carries it, so the handle goes up through the fist (person() gives
back the hand as joints.handA).
names: a list of strings. Returns {name: true, ...}, a key list for checkNames().
e.g. var KEYS = khomKeys(["size", "lit"]);
```

### `khomGlow(cy, radius, lit, flicker)`

```
The candle's soft light round a lantern, centred on (0, cy) of the pen.
cy, radius: pixels of the pen's frame; lit: 0 to 1; flicker: about 0.6 to 1 (khomFlickerAt()).
Returns nothing: it fills a square of light with pen, and leaves pen's fillStyle set to the glow.
e.g. khomGlow(140, 300, 1, khomFlickerAt(clock, x));
```

### `khomFlickerAt(t, x)`

```
khomFlickerAt(t, x) gives back the candle's flicker at second t, 0.6 to 1; x (any number, the
lantern's x) sets lanterns apart.
e.g. var flicker = khomFlickerAt(clock, 640);
```

### `khomCutout(kind, step)`

```
One figure cut from black paper, for the khom phat, standing on (0, 0) and
facing right, about 44 tall; "step" swings its legs.
kind: "elephant", "rider", "deer", "carrier", "buffalo", anything else a dancer (KHOM_CUTOUTS);
step: radians of the legs' swing (khomPhat() passes 5 a second). Draws in the colour pen's
fillStyle and strokeStyle already hold. Returns nothing; it leaves pen's lineWidth and lineCap set.
e.g. pen.fillStyle = pen.strokeStyle = "#1a120c"; khomCutout("elephant", clock * 5);
```

### `khomPhat(x, y, look)`

```
The spinning lantern, hung by its string from (x, y): 150 wide and about
245 from the tie to the foot of its fringe, at size 1.
x, y: the tie, pixels of the sheet. look: optional; its keys are KHOM_PHAT_KEYS (the list above:
size 1, colour KHOM_RED, gold KHOM_GOLD, lit 0, sway 1, spin 1, lean 0, late 0, turn, figures,
light). Returns nothing: it draws with pen, and leaves pen as it found it. With look.light it
makes KHOM_LAYER (a sheet as large as pen's canvas) the first time and draws the figures there.
A figure function is called with pen pointing at that layer while it draws.
e.g. khomPhat(900, 100, {lit: 1, light: true, spin: 0.6});
```

### `khomUpright(foot, R, colour, gold, lit, flicker)`

```
The front of a small lantern of six sides, upright, from its foot at
(0, foot) up to the point of its crown; "R" its half-width at the middle.
foot, R: pixels of the pen's frame; colour, gold: "#rrggbb"; lit: 0 to 1; flicker: khomFlickerAt()'s.
About 110 tall from its foot to the crown's point at R 34. Returns nothing: it draws with pen at
x 0, and leaves its fill and line set.
e.g. khomUpright(-104, 34, KHOM_BLUE, KHOM_GOLD, 1, 0.9);
```

### `khomThue(x, y, look)`

```
The handheld lantern, its handle held at (x, y): the lantern stands 104
above the hand and the handle goes 64 below it, at size 1.
x, y: the hand, pixels of the sheet. look: optional; its keys are KHOM_THUE_KEYS (size 1, colour
KHOM_BLUE, gold KHOM_GOLD, lit 0, lean 0, late 0). Returns nothing: it draws with pen, and leaves
pen as it found it.
e.g. var j = person(500, 950, cast("girl")); khomThue(j.handA[0], j.handA[1], {lit: 1});
```

### `khomDao(x, y, look)`

```
The star lantern, hung by its string from (x, y): 150 across its points,
the star 145 tall below a string of 30, at size 1.
x, y: the tie, pixels of the sheet. look: optional; its keys are KHOM_DAO_KEYS (size 1, colour
KHOM_RED, gold KHOM_GOLD, lit 0, sway 1, spin 1, wind 1, lean 0, late 0, tail true).
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. khomDao(300, 80, {colour: KHOM_GREEN, lit: 0.8});
```

### `khomBua(x, y, look)`

```
The lotus lantern, hung by its strings from (x, y): the flower 150 across
its open petals, its foot 150 below the tie, at size 1.
x, y: the tie, pixels of the sheet. look: optional; its keys are KHOM_BUA_KEYS (size 1, colour
"#e98aa8", gold KHOM_GOLD, lit 0, sway 1, wind 1, lean 0, late 0, tail true).
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. khomBua(1200, 90, {lit: 1});
```

## highlands.js

highlands.js - the uplands of the north of Thailand, for the Lanna cartoon kit: rice terraces cut into the slopes, the forest, and mist that lies in the valleys and drifts across the mountains. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="highlands.js"></script>  The terraces and the forest are painted once, on a set's sheet, as the kit's hills() and tree() are. The mist goes on every frame, over the set, and the second t alone says where it is (as in cumulus.js): render.py's frames and the browser's playing agree, and scrubbing back shows the same mist. Mist between two ranges goes between their sheets: lay the far range, the mist, then the nearer range (highlands.html does).  terraces(brush, x, top, wide, tall, look)          rice terraces in a fold of a slope; (x, top) the top of the patch fieldHut(brush, x, base, size)                     the hut a farmer rests in, on four posts under thatch forest(brush, left, right, base, look)             a belt of forest standing on the line y = base forestSlope(brush, ridge, left, right, foot, look) a mountain under the line ridge(x), clothed in forest crown(brush, x, y, r, colour, seed, plain)         one cro

### `hlTint(colour, a)`

```
A colour "#rrggbb" as rgba() at the opacity a.
colour: "#rrggbb"; a: 0 to 1. Returns a string "rgba(r, g, b, a)". Changes nothing.
e.g. brush.strokeStyle = hlTint("#34521f", 0.8);
```

### `terraces(brush, x, top, wide, tall, look)`

```
The look's names: season ("green", "gold", "water" or "dry"), count (how
many benches; from the height if left out), bow (how far the benches bow
with the fold, 1 as the photographs), seed, hut (true, or the bench it
stands on), trees (false: no trees at the ends of the benches).
It gives back lip(k, x): the height of bench k's lip at x, for a film that
stands someone on a terrace (bench 0 is the highest, count the lowest).
terraces(brush, x, top, wide, tall, look) paints a patch of rice terraces and gives back {count, lip}.
  brush       a canvas 2D context (a set's sheet, painted once)
  x, top      the middle of the patch's top, pixels of the sheet
  wide, tall  the patch's size, pixels of the sheet
  look        optional; the names listed just above (season "green", count from tall / 24 and at
              least 4, bow 1, seed 1, hut off, trees on)
Returns {count, lip}: lip(k, x) is the y, pixels of the sheet, of bench k's lip at x.
It leaves brush's fill and line set as it last set them.
e.g. var field = terraces(pen, 960, 420, 1100, 380, {season: "gold", hut: true}); person(700, field.lip(5, 700), cast("boy"));
```

### `fieldHut(brush, x, base, size)`

```
The hut of the fields: a floor of split bamboo raised on four posts, open
on every side, under a hipped roof of thatch; as tall as a person at size 1
(its foot at (x, base)).
brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 is about 80 tall (as tall as a
person). Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. fieldHut(pen, 640, 820, 1.2);
```

### `crown(brush, x, y, r, colour, seed, plain)`

```
One crown: lobes on a dome, the whole clump inked, lit at the top. "plain"
is a crown far off (rule 6): no lines inside, and a faint outline.
  brush   a canvas 2D context
  x, y    the middle of the clump's dome, pixels of the sheet
  r       its radius in pixels (the clump is about 2.4 r wide)
  colour  "#rrggbb", such as one of FOREST_GREENS
  seed    a number: the same seed draws the same crown
  plain   true for a far crown
Returns nothing: it draws with brush, and leaves its fillStyle (and line, when it inks inside) set.
e.g. crown(pen, 400, 600, 40, FOREST_GREENS[2], 7);
```

### `hlHose(brush, from, bend, to, width, colour, ink)`

```
A bough or a culm, inked as the kit inks a hose: the line wider in ink,
then the line again in its own colour.
brush: a canvas 2D context; from, bend, to: [x, y] in pixels (a quadratic curve); width: pixels;
colour, ink: CSS colours. Returns nothing: it draws with brush, and leaves its line set.
e.g. hlHose(pen, [100, 800], [110, 600], [160, 420], 4, "#9fb85a", "rgba(32, 52, 24, 0.88)");
```

### `tallTree(brush, x, base, size, colour, seed)`

```
A tree that stands above the canopy (rule 1): a straight grey trunk that
flares at its foot and bends a little, three boughs that leave it near the
top, each at a height of its own, and a wide, flat crown of clumps at
their ends; about 420 tall at size 1, its foot at (x, base).
brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when about 420 tall (needed);
colour: the crown's "#rrggbb"; seed: 1 when left out. Returns nothing: it draws with brush, and
leaves its fill and line set.
e.g. tallTree(pen, 820, 700, 0.8, FOREST_GREENS[0], 3);
```

### `bamboo(brush, x, base, size, seed)`

```
A clump of bamboo (rule 4), its foot at (x, base); about 330 tall at size 1.
brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when about 330 tall (needed);
seed: 1 when left out. Returns nothing: it draws with brush, and leaves its fill and line set.
e.g. bamboo(pen, 300, 900, 0.9, 5);
```

### `areca(brush, x, base, size, seed)`

```
An areca palm (rule 5), its foot at (x, base); about 330 tall at size 1.
brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when about 330 tall (needed);
seed: 1 when left out. Returns nothing: it draws with brush, and leaves its fill and line set.
e.g. areca(pen, 1500, 880, 1, 2);
```

### `forest(brush, left, right, base, look)`

```
A belt of forest standing on y = base from left to right (rule 1). The
look's names: tall (how high the canopy stands, 220 if left out), far (0
near to 1 far: paler, bluer and plainer, rule 6), seed, haze (the colour it
fades toward), ground (a function x -> y, for ground that is not level),
bamboo, palms, trees (how many of each to a thousand pixels: 3, 2 and 2 if
left out), front (false: no bananas at its foot).
brush: a canvas 2D context (a set's sheet); left, right, base: pixels of the sheet; look: optional,
the names just above. It also draws the kit's banana() (oldcartoon.js) at its foot when near.
Returns nothing: it draws with brush, and leaves its fill and line set.
e.g. forest(pen, 0, WIDE, 760, {tall: 260, seed: 4});  forest(pen, 0, WIDE, 560, {far: 0.7, tall: 150});
```

### `forestSlope(brush, ridge, left, right, foot, look)`

```
A mountain whose ridge is the line ridge(x), from left to right, standing
down to y = foot, clothed in forest (rule 7): its own deep ground under the
trees, crowns woven close all over it, smaller the higher they stand, and a
row of them along the ridge. The look's names: far (0 near to 1 far), seed,
haze, small and large (a crown's size at the ridge and at the foot: 7 and
26).
brush: a canvas 2D context; ridge: a function x -> y, pixels of the sheet; left, right, foot: pixels
of the sheet; look: optional, the names just above (far 0, seed 1, haze FOREST_HAZE, small 7,
large 26). It draws up to 5000 crowns: paint it once on a sheet, not every frame.
Returns nothing: it draws with brush, and leaves its fill and line set.
e.g. forestSlope(pen, function (x) { return 420 + 120 * Math.cos(x / 300); }, 0, WIDE, 900, {far: 0.3});
```

### `mistLay(brush, puffs, body, frame, box, look, alpha, solid, gone)`

```
Lay one body of mist: the puffs ([x, y, rx, ry, number], flat ellipses; the
number, if given, is the swell's own, which picks the swells that show an
inner arc, so that it does not change as the mist drifts) and a body
under them (a function that adds its path), drawn on the mist sheet in the
frame "frame" sets up (or none), the line first and every shape a little
larger, then the fill, then the inner arcs (rule 7); then faded from solid
at "solid" to gone at "gone" down the frame (rule 3), and laid on brush at
"alpha" inside the box [left, top, right, bottom] of the picture.
  brush            the canvas 2D context the mist goes onto
  puffs            [[x, y, rx, ry, number], ...] in the frame's pixels
  body             a function (b, grow) that adds a path to b, or null
  frame            a function (b) that moves b's frame, or null (the sheet's own pixels)
  box              [left, top, right, bottom], pixels of the sheet: where on MIST_SHEET it is drawn
  look             colour ("#ffffff"), shade ("#8fa2b8"), glow (optional "#rrggbb")
  alpha            0 to 1; solid, gone: y in the frame's pixels
Returns nothing: it draws on brush through MIST_SHEET (left clear after), and leaves brush as it found it.
e.g. mistLay(pen, [[600, 700, 120, 14]], null, null, [400, 660, 800, 760], {}, 0.8, 690, 760);
```

### `mistSea(brush, t, look)`

```
A sea of mist, its top at y = level from left to right (rule 1). The
look's names: level, left, right, deep (how far it reaches down before it
is gone: 160), swell (the swells' height: 12), wave (a near swell's width:
130), drift (pixels a second: 5), layers (3: the furthest highest and
thinnest, rule 4; give 1 to lay one between two ranges, calling it once
for each, the furthest first), colour ("#ffffff"), glow (the sky's colour
on its top, at sunrise), shade (its line and its grey), seed, alpha.
brush: a canvas 2D context to lay the mist on, every frame; t: the time in seconds; look: optional,
the names just above (level 700, left 0, right WIDE; all y and x in pixels of the sheet).
Returns nothing: it draws on brush (through MIST_SHEET), and leaves brush as it found it.
e.g. mistSea(pen, t, {level: 640, layers: 1, glow: "#f3b27a"});   // between the far range's sheet and the near one's
```

### `mistBand(brush, x, y, wide, t, look)`

```
One band of mist across a slope, its middle at (x, y), "wide" long (rule
5). The look's names: tall (how high it swells: wide * 0.07), tilt (radians,
to lie along a slope), colour, shade, glow, seed, alpha (0.8).
brush: a canvas 2D context; x, y, wide: pixels of the sheet; t: the time in seconds; look: optional,
the names just above. Returns nothing: it draws on brush (through MIST_SHEET), and leaves brush as
it found it.
e.g. mistBand(pen, 900, 520, 420, t, {tilt: -0.12});
```

### `mistDrift(brush, t, look)`

```
Bands of mist drifting across a mountain, inside the box left..right,
top..bottom (rule 6): each at a depth that sets its length, its pace and
how strong it is; it gathers as it drifts in at one side of the box and
thins away as it leaves at the other, then comes round again. The
look's names: left, right, top, bottom, count (5), wide (a near band's
length: 380), drift (a near band's pixels a second: 9), tilt, seed, colour,
shade, glow, alpha.
brush: a canvas 2D context; t: the time in seconds; look: optional, the names just above (left 0,
right WIDE, top 300, bottom 700, pixels of the sheet). Returns nothing: it draws on brush (through
MIST_SHEET), and leaves brush as it found it.
e.g. mistDrift(pen, t, {top: 360, bottom: 620, count: 4});
```

### `caveMouth(brush, x, y, size, look)`

```
---------- a cave's mouth ----------
The cave of a tale on a mountain's side (the film of the creature with four ears and five eyes: its cave on
Doi Khao Khwai). Drawn live, with the forest's own crowns before and over it, so the forest grows round it.
The mouth of a cave in a mountain's side, its foot's middle on (x, y): a dark arched opening among
boulders lit from the upper left, a ledge of stone before it, moss on the stones and ferns over the top
that stir (look.t, the second). 250 wide and 135 high at size 1, the opening 120 by 92.
look: t; rock (the stone's colour); dark (the inside's); tint, [colour, amount]: every colour of it
blended that far toward one light (a dawn's blue, a dusk's red), as a set painted by day and tinted is.
  brush   a canvas 2D context
  x, y    the middle of its foot, pixels of the sheet
  size    1 is 250 wide (needed)
  look    optional: t (seconds, 0), rock ("#7d7266"), dark ("#0f0b0a", not tinted), tint
Returns nothing: it draws with brush, and leaves brush as it found it.
e.g. caveMouth(pen, 1100, 640, 1.4, {t: t, tint: ["#3a4a7a", 0.3]});
```

## cumulus.js

Cumulus for the Lanna cartoon kit: puffy clouds that drift, with depth, drawn as the old cartoons drew them: flat colour in three tones inside a line round the outside of each cloud, and a few lines inside it where one puff rounds over another. (The kit's own clouds() paints the flat scroll clouds of the murals; this is the other kind.)  Each cloud is a pile of discs on a flat base, taller in the middle. Each puff is one of three flat tones by how high it sits, lit on top and in shade below (at dusk the light comes from below), and a little lighter toward the sun's side. The line round the outside is drawn as the kit draws a hose: every disc first in ink and a little larger, then every disc in its tone, so only the outer edge of the pile keeps its ink. The inner lines are the lower arcs of every third puff, stroked in ink and kept inside the pile. A cloud is drawn whole and opaque on a sheet of its own and then laid on the sky at one transparency, so its puffs do not show through each other. Each cloud sits at a depth, 1 near to 0.3 far, that sets its size, how fast it crosses the sky, how low it hangs toward the horizon, how much it fades into the distance, and how fine its line i

### `cumulus(brush, t, look)`

```
cumulus(brush, t, look) draws one frame of drifting cumulus clouds over the whole sheet (WIDE x 1080).
  brush   a canvas 2D context to draw on (pen, or a sheet's own context)
  t       the time in seconds: it alone says where each cloud is
  look    CLOUD_LOOKS.day, .dusk or .night, or one of your own with the same keys:
          count (how many clouds), lit and shade ("#rrggbb" tones), below (true: lit from below, at dusk),
          ink (optional: the colour of the line; the kit's inkFor(lit) when left out)
Returns nothing: it draws with brush. It leaves brush.globalAlpha at 1, whatever it was before,
and uses CUMULUS_SHEET as scratch (left clear).
e.g. cumulus(pen, t, CLOUD_LOOKS.dusk);
```

## band.js

The band of the north for the Lanna cartoon kit: the salo, the sueng, the pi chum and the phin phia, and a musician who sits on the floor and plays one of them on the beat. Load this file after oldcartoon.js:  <script src="oldcartoon.js"></script> <script src="band.js"></script>  Each instrument is a painter on the kit's sheet, "pen": salo(x, y, size, angle) and the rest, drawn from (x, y) along "angle" (radians; 0 points to the right, -Math.PI / 2 straight up), so one can lie on a mat or stand against a post. musician(x, y, kind, look, late) seats a person at (x, y) with one in their hands, as person(x, y, look) stands one, and gives back where person() drew the joints.  What each one is, from what is written of it (the NotebookLM notebook "Lanna material culture", 2026-10-16: Wikipedia on the salo and the sueng, the ThaiJO papers on the phin phia and on a Lanna music teacher, Hotsia on the salo-so-sueng band) and the photographs it was read from (Wikimedia Commons, free licences; nothing copied, only what they show): salo       a spike fiddle of two or three wire strings: a coconut shell for a body with a thin wooden plate over its face, a turned spike under it, a long dark neck 

### `bandFill(colour, width)`

```
Fill the path the pen holds, and ink it in a darker line of its own colour.
colour: "#rrggbb"; width: the line in pixels of the pen's frame (1.6 when left out).
Returns nothing. It leaves pen's fillStyle, strokeStyle, lineWidth and lineJoin set as it set them.
e.g. pen.beginPath(); pen.arc(0, 0, 10, 0, 7); bandFill(BAND_SHELL, 1.4);
```

### `bandTurned(u0, u1, halves, colour)`

```
A turned piece: a solid of round section along u, from u0 to u1, with the
half-widths "halves" spread evenly along it (a spike, a spire, a peg).
u0, u1 and the halves are in pixels of the pen's frame (an instrument's frame, along its length);
halves: a list of two or more half-widths; colour: "#rrggbb". Returns nothing: it draws with pen
(and leaves pen's fill and line set, as bandFill() does).
e.g. bandTurned(0, 22, [0.6, 2, 2.6, 4.2], BAND_DARK);
```

### `bandStrings(u0, u1, count, gap)`

```
Strings: "count" fine lines from u0 to u1, "gap" apart about the middle.
u0, u1, gap: pixels of the pen's frame; count: how many strings. Returns nothing: it draws with pen
and leaves its strokeStyle and lineWidth set.
e.g. bandStrings(35, 172, 2, 2.2);
```

### `bandFrame(x, y, size, angle)`

```
bandFrame(x, y, size, angle) saves pen and moves its frame to (x, y), turned by angle (radians,
0 when left out) and scaled by size (1 when left out). Returns nothing. It leaves pen saved and
moved: the caller must pen.restore() when the instrument is drawn.
e.g. bandFrame(400, 900, 1, -Math.PI / 2); bandTurned(0, 22, [1, 3], BAND_DARK); pen.restore();
```

### `salo(x, y, size, angle)`

```
The salo, from the tip of its spike at (x, y) along "angle"; 214 long at size 1.
x, y: pixels of the sheet; size: 1 when left out; angle: radians, 0 (pointing right) when left out.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. salo(600, 900, 1, -Math.PI / 2);   // standing on its spike
```

### `saloBow(x, y, size, angle)`

```
The salo's bow, from its frog at (x, y) along "angle"; 190 long. The stick
arches to the side of +90 degrees from "angle", the hair runs straight.
x, y: pixels of the sheet; size: 1 when left out; angle: radians, 0 when left out.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. saloBow(560, 840, 1, 0.05);
```

### `sueng(x, y, size, angle)`

```
The sueng, with the middle of its round body at (x, y) and its neck along
"angle"; 190 long, the body 60 across, at size 1.
x, y: pixels of the sheet; size: 1 when left out; angle: radians, 0 (neck to the right) when left out.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. sueng(700, 880, 1, -0.4);
```

### `suengPick(x, y, size, angle)`

```
The sueng's pick, a long thin blade of horn, held at (x, y) along "angle".
26 long at size 1. x, y: pixels of the sheet; size: 1 when left out; angle: radians, 0 when left out.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. suengPick(720, 860, 1, 2.5);
```

### `piChum(x, y, size, angle)`

```
The pi chum, from the end that goes in the mouth at (x, y) along "angle";
126 long at size 1 (the middle of its five sizes; size scales it).
x, y: pixels of the sheet; size: 1 when left out; angle: radians, 0 when left out.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. piChum(500, 760, 1, 1.03);
```

### `phinPhia(x, y, size, angle, flip)`

```
The phin phia, with the post of its coconut at (x, y) on the stick and the
stick along "angle" toward its curled end; 48 of it lies behind (x, y) to
the pegs, 170 before it to the curl. The coconut hangs on the side of +90
degrees from "angle" (under the stick when it lies to the right), the
other side when "flip" is true.
x, y: pixels of the sheet; size: 1 when left out; angle: radians, 0 when left out; flip: true or false.
Returns nothing: it draws with pen, and leaves pen as it found it.
e.g. phinPhia(800, 800, 1, 0.8, true);
```

### `bandHold(kind, p)`

```
Where each instrument is held, as numbers of the player's own frame: a
figure of size 1 sitting cross-legged at (0, 0) and looking right
(face 1), its shoulders at (35, -131) near and (-31, -131) far, its chin at
(2, -150), its arms 98 long, measured from person() with floor "cross".
"p" is the beat, counted from the clock: each kind plays on it.
  at, angle   where the instrument's own (x, y) lies, and which way it points
  a, b        where the wrist of the near arm (A) and of the far arm (B) goes
  bow         the salo's bow: its frog and its angle
  fingers     the curls of the fingers on the instrument, as person() takes them
bandHold(kind, p) gives back how a player holds one instrument at beat p.
kind: "salo", "sueng", "pichum" or anything else (the phin phia); p: the beat, a number of beats
(seconds / BEAT). Returns {at, angle, a, b} and, by kind: bow [x, y, angle] (salo), pick [x, y,
angle] (sueng), flip (phin phia), grip or fingers (true). Changes nothing outside itself.
e.g. var hold = bandHold("sueng", clock / BEAT);
```

### `musician(x, y, kind, look, late)`

```
A musician: a person sitting cross-legged at (x, y), playing "kind" (one of
BAND_KINDS) on the beat. "look" is a person's look (cast("fellow") and the
like); the musician adds floor, the reach of both hands and the instrument,
worn under the arms so the hands lie over it, and takes away a stick or a
parasol from the hands. The phin phia is played on the bare chest: its
player has no shirt and no cloth over the shoulder. "late" is seconds added to its clock,
so two players do not move as one. Gives back the joints person() gives.
  x, y   where the player sits on the floor, pixels of the sheet (person()'s (x, y), with floor "cross")
  kind   "salo", "sueng", "pichum" or "phinphia"; another name is reported by checkName() and plays the salo
  look   a person's look (its keys: person()'s, in oldcartoon.js); its own floor is kept, else "cross";
         size and face also place the instrument. Left out: {}
  late   seconds added to the kit's clock (0 when left out)
It reads the globals clock and BEAT (the film's seconds a beat). Returns what person() returns,
the joints it drew; it draws with pen through person(), and leaves pen as person() does.
e.g. musician(760, 940, "salo", cast("fellow", {face: -1}), 0.25);
```

## sabai.js

sabai.js - a sabai woven with figures that walk, for films made with oldcartoon.js: the shoulder cloth of the sash film (sash.html), as a piece of the kit. Load it after the kit and the creatures its rows use:  <script src="oldcartoon.js"></script> <script src="naga.js"></script> <script src="dragon.js"></script> <script src="beasts.js"></script> <script src="khom.js"></script> <script src="myth.js"></script> <script src="flora.js"></script> <script src="pieces.js"></script> <script src="band.js"></script> <script src="northbirds.js"></script> <script src="sabai.js"></script>  and in a scene, draw the back of the cloth, then the person wearing it: the kit paints the band after the body and the head and before the arms, so the near arm hangs over its lower end:  var where = sabaiOf(t, 720, 1010, look);     // where the cloth lies on this person, this frame sabai(t, where, {from: 3}, "back");          // the end that hangs behind her shoulder, down her back person(720, 1010, sabaiWorn(look, t, where, {from: 3}));   // the woven band across the chest, under the arm; its rows flow from second 3  The cloth is twelve rows of woven tiles, each tile one picture of the kit drawn by the kit'

### `paintWith(brush, action, at)`

```
Run a painter that draws with the kit's "pen" on another sheet, at second "at".
brush: a canvas 2D context; action: a function of no arguments that draws with pen; at: the second
to set the kit's clock to while it runs (0 when left out). Returns nothing. It sets the globals pen
and clock for the while and puts them back after, even if action throws (since 2026-10-21: before, a painter's
error left every later drawing on the tile's sheet).
e.g. var sheet = document.createElement("canvas"); paintWith(sheet.getContext("2d"), function () { person(150, 280, cast("boy")); }, 2.5);
```

### `sabaiTile(painter, side)`

```
A tile from a painter: the picture is drawn once on a scratch sheet and
measured, then drawn again to fit the tile, at each moment of its cycle. A figure whose later moments reach past
its first (and would be cut at the tile's edge) is measured at every moment, and fitted to them all.
painter: a function (brush, u): it draws standing on (0, 0) of the pen's frame (pen is brush while
it runs), u 0 to 1 its walk; one that takes fewer than two arguments stands still. side: the
tile's side in pixels (SABAI_TILE, 384, when left out). Returns a list of canvases, side by side
pixels: SABAI_FRAMES (6) of them for a painter that walks, else 1. Slow: make tiles once, not per frame.
e.g. var frames = sabaiTile(function (b, u) { person(0, 0, cast("boy", {step: u})); }, 192);
```

### `sabaiBird(painter, before)`

```
The twelve rows the sash film weaves, top to bottom: what Thai life is made
of, and in every row the people and the animals that live among those things.
The owner (2026-10-15): "remove some of the repeating sprites like the monk
and add the temple guardian, the oxen, a baby pig, and a few of the hanging
lanterns". So no monk (there were two), one dog fewer, two fish fewer, one
drummer and one villager fewer, one khom loi fewer; the temple guardian (yak,
as the statue at Wat Phra Kaeo) stands between the two naga as well as by
the temple; the water buffalo, the kit's draught animal (it pulls the cart
in the rain), walks among the lotus leaves; a sow walks with her piglet
behind her among the houses (a tile is fitted to its picture, so a piglet
alone would be drawn as large as a sow); and three khom, the hanging
lanterns, red, blue and green, hang by the temple and among the lanterns. A
khom is tied 400 above the tile's middle so it hangs inside it.
Then (owner, 2026-10-17): "Replace the fish on the sash with the humingbird
type bird and review the items on the sash and replace generic items with
special Lanna specific items". The two fish are the green-tailed sunbird of
northbirds.js, one sipping at a thong kwao flower and one hovering; and what
any land might weave is now Lanna's own: the second house is the long khao,
the rice granary of a farmstead of the north; the plain tree, the coconut
palm and the banana are a kwian, the wooden ox cart (its wheels turn), a
bunch of longan (the fruit of Lamphun and Chiang Mai) and the nam ton, the
water jar at the gate (a thong kwao tree and a longan tree in fruit were
tried first: at a tile's size both read as the same green tree); a dog is an elephant, and the other a green peafowl in
display (Phayao's); the plain paper lantern is the khom dao, the star lantern
of Yi Peng; a yellow blossom is the dok ueang, the orchid of the north; the
two dragons of the Himalayan paintings are Lanna's own creatures, the luang
and the mom, and the scientist in his white coat is a player of the sueng;
the sun and the cloud of the thangka are the hong, the golden swan on its
pole, and a chedi sai, the sand pagoda of Songkran with its flags; and the
two plain blossoms are a thong kwao flower and a krathong of Yi Peng. A film
made before this that loads no northbirds.js weaves a gourami, a barb and the dog (the kit's native fish:
owner, 2026-10-20, "Replace any of the old style fish on the sash").
sabaiBird(painter, before) gives back a painter (b, u) that runs painter when northbirds.js is
loaded (sunbird() is a function), and before when it is not. Both are painters as sabaiTile() takes.
e.g. sabaiBird(function (b, u) { sunbird(0, 0, u / 13, {size: 2.4, hover: 1}); }, function (b) { dog(0, 0, 0); })
a tile of northbirds.js, or what was woven there before it
```

### `sabaiPool()`

```
sabaiPool() gives back the painters the cloth may weave, a list of functions (b, u), each with a
.key string ("villager walk", "khom dao", "khaosoi"): every item first, by SABAI_LANNA's order,
then the rest, then SABAI_COMMON's, then the people's other ways. Only painters whose script the
page loaded are in it. Changes nothing outside itself.
e.g. var keys = sabaiPool().map(function (p) { return p.key; });
```

### `sabaiUnique(rows, count, shown, centre)`

```
The rows, each filled with painters of the pool up to "count" figures, none of them twice on the cloth and none
whose key is in "shown". A row that has more than "count" painters already is left as it is.
With "centre" ([row, slot]: where the film opens, the figure it follows), the places nearest it, in its row and the
rows beside it, are dealt first, so the pool's first (the mythical and the exotic) are what is seen there.
  rows    a list of rows, each a list of painters (SABAI_ROWS or a film's own); not changed
  count   how many figures each row should hold
  shown   optional: a list of keys (sabaiPool()'s) not to weave again
  centre  optional: [row, slot], where the film opens
Returns a new list of rows. It warns (the kit's warn()) when the pool is too small and painters come twice.
e.g. var ROWS = sabaiUnique(SABAI_ROWS, 24, [], [4, 8]);  var CLOTH = {rows: ROWS, row: 4, follow: 8};
```

### `sabaiHanging(look, id)`

```
The look with the arms hanging, under an id of its own, so that the cloth
does not move when the arms do (a wai, a wave), and the drawing that is
measured keeps its own swing apart from the person's.
look: a person's look; id: a string. Returns a copy of look with that id and without the keys of
SABAI_ARMS. Changes nothing outside itself.
e.g. var still = sabaiHanging(cast("lady", {sabai: false}), "lady/sabai");
```

### `sabaiOf(t, x, y, look)`

```
Where the cloth lies on a person drawn at (x, y) with "look", at second t.
The owner (2026-10-15), building it up a step at a time: a rectangle from
the neck off the shoulder down to the waist on the opposite side; its upper
corner where the neck meets the shirt, then moved down and to the side so
it starts beside the neck, not at its middle; the top end rounded, curving
down over the shoulder; the two long sides bent so it looks like it wraps
her body; cut off just past the vertical line of her shirt on the far side;
then the whole of it up and to the right a little, and the long sides bent
to the right, the way she faces. So: one band, 72 wide, at 45 degrees, from
beside the base of the neck on the near side (her left, in the kit's
three-quarter view) down across the chest, its middle line bowed a little
the way she faces, worn under the far arm (sabaiWorn), its lower end cut
on a slant under that arm: the middle line is laid to a vertical line 4
outside the shirt's own line on that side (the sleeve's outer edge at the
elbow's height, read off the drawing of the person on the scratch sheet),
the band begins 59 along from where it would meet that line, so that its
upper corner lies 12 inside the line, under the arm, and its lower corner
is 10 further to the left (and down) along the lower edge (owner: "the
long left and right side both need to be shorter", "make sure the top two
corners stay pinned where they are": the curve is the same, only cut
shorter; then "just move the bottom most corner over to the left about 10
px"). It is tucked into the skirt at the waist: nothing of it is drawn
below the waist's line (owner: "cut it off near where the shirt tucks into
the skirt"). The wearer has sabai: false, so the kit draws no band of its
own on the other diagonal.
The back of the cloth (owner, with a photograph of a woman in a red
sabai, its end hanging in folds behind her arm to the ground with a
fringe): "add a line from the right most corner down to just past the
hand that gently undulates down past the waist and hand and a curved line
to the left and fill with the red sash color and shade it but leave it
unmarked. Add tassels to the end of the sash." So from the top end's
corner at the shoulder an outer edge waves gently down the far side of
the body, leaning out a little, to a hem just past the hand; the hem
curves to the left, bowing down, to an inner edge behind the body; it is
drawn before the person, so only what lies past the body's and the arm's
edge is seen. The hem is read from the hip, not the hand, so a hand
raised to wave does not lift it.
Gives back {at(u), angle(u), uAt(along), length, start, fold, top,
squeeze(along), middle, tilt, startCap, endCap, tuck, tail}: a point and a
heading at u of the way along; the u of a distance along; the length; how
far along the band begins; how far along the fold is and how far the part
drawn over the person ends (both the whole length while there is no
fold); how much narrower the cloth is at a distance along (1: it does not
gather); the part across the chest that a camera holds (0.4 of the way);
how each end is cut (see sabai()); the height of the waist's line, below
which the cloth is tucked away; and the back of the cloth, {outer, hem,
inner}: the outer edge's points from the shoulder down, the hem's from
the outer edge's foot to the inner edge, and the inner edge's top.
  t      the time in seconds
  x, y   where the person stands, pixels of the sheet, as person(x, y, look) takes them
  look   the person's look (needed; its keys: person()'s, in oldcartoon.js); give it sabai: false
It draws the person twice on SABAI_SCRATCH (a sheet it makes the first time) and fills
SABAI_SLEEVE, a cache by build (emptied past 200). It does not draw on pen.
e.g. var where = sabaiOf(t, 720, 1010, cast("lady", {sabai: false}));
```

### `sabaiWorn(look, t, where, cloth)`

```
The look of a person wearing the cloth: the same look with "worn", a painter
the kit calls after the body and the head and before the arms, so the near
arm hangs over the cloth's lower end (owner, 2026-10-15: "put it behind the
right arm"); in a wai the kit calls it again inside the upper arm on the
cloth's shoulder, so that upper arm is under the cloth and its forearm over
it (owner, 2026-10-16). It draws the front of the cloth in the frame the pen
has now, the scene's, so call it where the person is drawn, inside the camera.
  look    the person's look; t: seconds; where: sabaiOf()'s answer for that person and frame
  cloth   the cloth's names (SABAI_KEYS, at the top of this file), as sabai() takes them
Returns a new look for person(); it reads pen's frame now, when it is called.
e.g. person(720, 1010, sabaiWorn(look, t, where, {from: 3}));
```

### `sabaiAt(where, along, across)`

```
A point of the cloth: "along" is the distance from the hip end, "across" the
offset from the middle line; gives [x, y, heading].
where: sabaiOf()'s answer; along, across: pixels of the sheet (along held to 0 .. where.length).
Returns [x, y, heading] (heading in radians). Changes nothing.
e.g. var p = sabaiAt(where, where.length * 0.4, 0);
```

### `sabaiOn(where, along, across)`

```
A point of the cloth as sabaiAt() gives it, also beyond either end of the
middle line: there the line runs on straight along the end's heading, so a
row of figures goes on into a slanted cut or a rounded end, which clip it.
where: sabaiOf()'s answer; along (any, even past the ends), across: pixels of the sheet.
Returns [x, y, heading]. Changes nothing.
e.g. var q = sabaiOn(where, -20, 10);
```

### `sabaiEdge(where, across, from, to, joined)`

```
sabaiEdge(where, across, from, to, joined) adds one edge of the cloth to pen's path: 25 points at
offset across, from distance from to distance to along (pixels of the sheet). joined: true goes on
from the open path, false starts with a moveTo. Returns nothing.
e.g. pen.beginPath(); sabaiEdge(where, -36, 0, where.length, false); pen.stroke();
one edge of the cloth, or of a row, from one end to the other
```

### `sabaiBand(where, inner, outer, from, to)`

```
sabaiBand(where, inner, outer, from, to) sets pen's path to the closed shape between offsets inner
and outer, from distance from to distance to (pixels of the sheet). Returns nothing; fill or
stroke it after.
e.g. sabaiBand(where, -36, 36, 0, where.length); pen.fillStyle = "#8a2a3a"; pen.fill();
the shape between two offsets, from one distance along to another: one closed path
```

### `sabaiTiles(cloth)`

```
sabaiTiles(cloth) gives back the cloth's tiles, a list of rows, each a list of sabaiTile() frame
lists. cloth: the cloth's names (rows, row, fine). Made the first time and kept on cloth.tiles,
so pass the same cloth object every frame.
e.g. var tiles = sabaiTiles(CLOTH);
the cloth's tiles, made once from its rows
```

### `sabaiAlong(where, cloth, row, k, t)`

```
How far along the cloth's middle line figure k of a row is at second t: the row holds a whole number of its patterns,
evenly spaced, flowing along the cloth (each row the other way from its neighbour) from second cloth.from on, the
figure walking off one end coming on at the other. sabai() lays its figures by it, and sabaiCamera() follows one.
sabaiAlong(where, cloth, row, k, t) gives back the distance along the middle line, pixels of the
sheet, of figure k of a row at second t. where: sabaiOf()'s; cloth: the cloth's names; row: its
index; k: the figure's place (any whole number). Makes the cloth's tiles if they are not made yet.
e.g. var along = sabaiAlong(where, CLOTH, 4, 8, t);
```

### `sabai(t, where, cloth, part)`

```
The woven cloth at "where" (from sabaiOf), at second t, drawn as bands. Each
end of a band is cut one of three ways: square (nothing), on a line
({N, c, s, kx, ky}: the line through N with the normal (kx, ky), met by a
band heading (c, s): a fold's crease, or a cut parallel to the shirt), or
rounded ({bulge}: the end bows out that far along the band's heading, as
cloth does lying over a shoulder). While the cloth has no fold (where.fold
is its whole length) it is one band, cut as where.startCap and where.endCap
say. With a fold it is three: the chest, up to the fold at the neck; the
shoulder, from the fold to where the shoulder ends; and the tail, behind
the arm; the chest and shoulder bands meet on one crease line at the fold,
as a folded ribbon does. "part" is which of it to draw: "front", all but
the tail, over the person; "back" (or nothing), all of it, before the
person, so the tail hangs behind the arm.
  t      the time in seconds
  where  sabaiOf()'s answer for the person, this frame
  cloth  optional; its keys: SABAI_KEYS, at the top of this file (wide 72, rows SABAI_ROWS,
         cloth "#8a2a3a", flow 2.5, from 0, row 4, fine, follow, tiles). Keep one object for the
         film: the tiles are made into it on the first call (slow) and kept
  part   "back" before the person, "front" over them (sabaiWorn() does that one)
Returns nothing: it draws with pen, and leaves its line set (gold, 3 wide).
e.g. sabai(t, where, CLOTH, "back");
```

### `sabaiCamera(t, where, cloth, start, end)`

```
The camera of the sash film's opening: it holds one row of the cloth (cloth.row)
close up, the part across the chest, and between seconds "start" and "end"
makes one steady pull-back, with no pause, from the row to the whole cloth to
the person to the whole stage, turning upright as it goes. Call it inside
pen.save() ... pen.restore(), before the scene is drawn.
  t           the time in seconds; start, end: the seconds of the pull-back
  where       sabaiOf()'s answer; cloth: the cloth's names (wide, rows or tiles, row, follow)
Returns nothing. It moves pen's frame (translate, rotate, scale) and leaves it moved: the caller's
pen.restore() undoes it.
e.g. pen.save(); sabaiCamera(t, where, CLOTH, 6, 20); /* draw the scene */ pen.restore();
```

## decorate.js

decorate.js - the life of a scene: animals and birds on courses, for films made with oldcartoon.js. Load it after the kit and after the files of the animals a scene uses (beasts.js, northbirds.js, ...):  <script src="oldcartoon.js"></script> <script src="decorate.js"></script>  A scene that is built is decorated in passes (docs/kit/places.md, "Decorating a scene"): its place (flora and mist, painted on its sheets or drawn live), its things (what a home or a hall of that place has: dress(), at the end of this file), its life (what lives there, at that hour, each on a course: decorate()), and a check of it (checks/ghost.py plots every course; checks/seek_check.py; kit_check.py).  A course is a row of stops, [[second, x, y, what], ...]: where the animal is at each second, and what it does there ("sniff", "up", "rest", "peck", "hide", or nothing). From the first stop's second to the last stop's it is drawn; between two stops it goes from one to the other at an even pace, facing the way it goes, its feet or wings going as far as it goes; at a stop whose "what" is "hide" it is not drawn until the next stop (gone into a hole, into the thatch, behind the trees). Every frame is worked out f

### `courseAt(t, course)`

```
courseAt(t, course) gives back where an animal on a course of stops is at second t:
{on: false} before the first stop's second and after the last's; else {on, x, y, face, moving,
along, what, points, speed}: on is false while it hides; x, y in pixels of the scene; face 1
(right) or -1; moving true or false; along the pixels it has come; what the stop's word while it
stands (else null); points the route [[x, y], ...]; speed in pixels a second.
course: [[second, x, y, what], ...] in order of the seconds (see the top of this file).
Changes nothing outside itself.
e.g. var at = courseAt(t, [[2, 300, 900], [6, 700, 900, "sniff"], [8, 700, 900]]);
```

### `lifePeck(at, t)`

```
lifePeck(at, t) gives back a peck, 0 to 1 (down and up twice a second), when at.what is "peck",
and undefined otherwise. at: what courseAt() gives back; t: seconds.
e.g. var at = courseAt(t, [[0, 300, 950, "peck"], [9, 300, 950]]); rooster(at.x, at.y, t, {peck: lifePeck(at, t)});
a peck: down and up again, twice a second, at a stop marked "peck"
```

### `lifeFowl(at, look, t, hen)`

```
lifeFowl(at, look, t, hen) draws the kit's rooster (hen true: a hen) where courseAt() has it,
walking as far as it goes and pecking at a "peck" stop. at: courseAt()'s answer; look: the
rooster's look (look.size, 1 when left out, sizes only the box and the stride: the kit's rooster
has one size); t: seconds. Returns the box it was drawn in, [left, top, right, bottom], pixels of the scene.
e.g. var box = lifeFowl(courseAt(t, [[1, 300, 950], [5, 700, 950]]), {}, t, true);   // a hen, as LIFE_KINDS.hen draws one
```

### `decorate(t, life, layer)`

```
decorate(t, life, layer) draws every animal of a scene's life in that layer at second t.
  t      the time in seconds
  life   [{name, kind, look, course, layer, calls}, ...]: its keys are LIFE_KEYS, kind one of LIFE_KINDS
         (above), course courseAt()'s, layer "back" or "front" ("front" when left out); calls is read
         by the film's sound tools, not here
  layer  "back" (call it before the people) or "front" (after them)
Returns nothing: it draws with pen. An unknown key or kind is reported by the kit's checkNames() and
checkName(). It tells the kit where each one is (sighted(), for eyes that watch), and pushes
{name, kind, t, box} onto window.LIFE_SEEN when a check has set that list.
e.g. decorate(t, [{name: "mouse", kind: "mouse", course: [[1, 200, 950], [5, 600, 950, "sniff"], [7, 600, 950]]}], "front");
```

### `dress(t, things, layer, tint)`

```
dress(t, things, layer, tint) draws one layer of a place's things at second t.
  t       the time in seconds
  things  [{name, kind, x, base, size, look, layer, from, to}, ...]: its keys are THING_KEYS, kind one of
          THING_KINDS (above); x, base in pixels of the scene (base: the ground it stands on, or the
          point a khom hangs from); size 1 when left out; layer "back" ("back" when left out) or "front";
          from, to: the seconds it is there, always when left out
  layer   "back" or "front"
  tint    optional: a set's [colour, amount], laid over every thing except the namton and the khom
Returns nothing: it draws with pen.
e.g. dress(t, [{name: "jar", kind: "namton", x: 820, base: 940}], "back");
```

## naga.js

naga.js - a Naga, the many-headed serpent of the temple stairs, for films made with oldcartoon.js. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="naga.js"></script>  and call naga(x, y, look) from a scene, as person() is called.  It was read from one drawing the owner gave (2026-10-13): a five-headed Naga in black line on gold paper, from Chiang Mai. Nothing of the drawing is copied. This file keeps what the drawing does, as rules, and draws its own serpent in the kit's manner: flat colour inside a fine dark line.  1. Several heads, one body. Five necks fan out of one chest, the middle neck the longest, and every head looks the same way. A head that is further forward lies over the neck behind it. 2. A head is a profile with a turned-up nose, an open mouth, and a tall flame of a crest that leans back, about one and a half heads high. 3. The body is one band that narrows all the way: about a head wide at the chest, a third of that at the tail. It lies in an S and one loop, and where it crosses itself the part nearer the heads is on top. 4. Three things run its whole length, and every neck's too: scales, in rows that sit between each other, their round edg

### `nagaWalk(dense, step)`

```
Points every "step" along a line that is given as a list of points.
  dense   the line, a list of [x, y], close together
  step    the gap wanted between the points given back, in pixels of the sheet
Returns a new list of [x, y], the first point of "dense" first; the last
piece, shorter than a step, is left off. Draws nothing.
e.g. nagaWalk([[0, 0], [100, 0]], 10)   // 11 points, 10 apart
```

### `nagaLine(points, step)`

```
A smooth line through a list of points (each piece is a Catmull-Rom
curve), as points every "step" along it.
  points  the points it passes through, a list of [x, y] (two or more)
  step    the gap between the points given back, in pixels of the sheet
Returns a list of [x, y] (nagaWalk() of the curve). Draws nothing.
e.g. nagaLine(NAGA_PATH, 9)   // the middle of the body as naga() lays it
```

### `nagaChain(trail, x, y, size, face)`

```
The spine of a Naga that travels, as a chain behind its chest: the rule of
procedural_animation.html. Each point turns to face the point in front, no
more than BEND from the way that one faces, and stands GAP behind it.
A chain remembers where it has been, and a film must not: a frame has to
come out the same whether the film is played or jumped into. So the chain
is laid out straight as it was ten seconds ago and led along "trail" from
then until now, in every frame. The points are given as naga() draws them:
measured from the chest at (x, y), as if looking right.
  trail   a function of the time in seconds that gives [x, y], where the chest
          is then, in pixels of the sheet (look.trail)
  x, y    where the chest is now, in pixels of the sheet
  size    the Naga's size (look.size); face 1 looks right, -1 left
Returns a list of 96 [x, y], the chest first, 14 apart, unscaled. It reads
the film's clock and calls trail() some 300 times; it draws nothing.
e.g. nagaChain(function (t) { return [100 + 60 * t, 400]; }, x, y, 0.5, 1)
```

### `nagaStrip(line, wide, c, belts)`

```
One length of the Naga, a neck or the body, painted from its far end to
its near one, so that where it crosses itself the part nearer the heads is
on top.
  line     its middle, as points a step apart, the end nearer the heads first
  wide     wide(u) is half its width at u, 0 at the first point and 1 at the last
  c        the colours: body, belly, bars, crest. With c.skin "dots" it is painted as
           dragon.js wants it: dots for scales (c.spots), a band of the crest's colour
           down the back with taller points, and a belly of plates
  belts    how far along (0 to 1) a band crosses it; a number below 0 is a round flower there
           (none when left out)
Returns nothing: it draws with pen, in pen's own frame, inked as FINE and
LINE say. It leaves pen's colours, line width, lineJoin and lineCap as it
last set them. dragon.js draws its body with it too.
e.g. nagaStrip(nagaLine(NAGA_PATH, 9), function (u) { return mix(37, 11, u); },
               {body: "#2f7d5c", belly: "#f1dfa0", bars: "#b23a2a", crest: STYLE.gold}, [0.2, -0.5])
```

### `nagaTongue(long, wide, curl, colour, line)`

```
One tongue of flame, from (0, 0) out along x: "long" to its tip, "wide"
at its foot, and "curl" is how far its tip is bent to one side (all in
pixels of pen's frame; a curl below 0 bends it up). "colour" fills it;
"line", a width, inks its edge too (shape()), and without it it is only filled.
Returns nothing: it draws with pen, and leaves pen's fillStyle set.
e.g. nagaTongue(60, 20, -8, STYLE.gold, 1.6)
```

### `nagaFlame(long, wide, tongues, seed, c)`

```
A flame of several tongues, fanned about the way x points: a crest, a
beard, or the end of the tail. It flickers with the film's clock.
  long, wide  the longest tongue's length and every tongue's width at its foot,
              in pixels of pen's frame
  tongues     a list of [turn, length, curl]: its angle from x in radians, its
              length as a part of "long" (0 to 1), and its bend (-1 to 1)
  seed        any number, so that flames side by side do not flicker together
  c           the colours: c.crest outside, c.fire inside
Returns nothing: it draws with pen about (0, 0); pen's frame is kept.
e.g. nagaFlame(96, 26, [[-0.3, 0.8, -1], [0, 1, 1], [0.3, 0.8, 1]], 5, {crest: STYLE.gold, fire: "#c8382c"})
```

### `nagaHead(open, seed, c, e)`

```
A Naga's head in profile, looking along x, its neck joining at (0, 0).
"open" is how far the mouth is open, 0 to 1; "e" a feeling (creatureFeel()), or none.
"seed" is any number (naga() gives the head's place), so heads blink and
flicker apart; "c" the colours (body, crest, fire). Drawn at a size about
140 high with its crest, in pen's frame.
Returns nothing: it draws with pen, and leaves pen's colours and line width
as it last set them.
e.g. nagaHead(0.5, 2, {body: "#2f7d5c", crest: STYLE.gold, fire: "#c8382c"}, null)
```

### `naga(x, y, look)`

```
A Naga, its chest standing on (x, y). Everything about it is in "look"
(see NAGA_KEYS above).
  x, y   where the chest stands, in pixels of the sheet; with look.trail
         it is the chest itself, where trail(clock) puts it
  look   an object, never left out ({} gives the green, five-headed Naga
         at size 1, facing right): its keys are NAGA_KEYS above, and
         naming another warns (checkNames)
Returns nothing: it draws with pen at the film's clock (call it from a
scene's draw, every frame). It sets the kit's FINE and LINE while it
draws and leaves them at 1 and STYLE.line; pen's frame is restored.
e.g. naga(640, 560, {size: 0.6, face: -1, heads: 5, late: 0.2, feel: "happy"})
```

## dragon.js

dragon.js - a dragon of the Himalayan paintings, for films made with oldcartoon.js. It is built on the Naga's spine, so load it after naga.js:  <script src="oldcartoon.js"></script> <script src="naga.js"></script> <script src="dragon.js"></script>  and call dragon(x, y, look) from a scene. (x, y) is where its head is.  It was read from one painting the owner gave (2026-10-13): a dragon among clouds, in the manner of the Tibetan and Bhutanese painters. Nothing of the painting is copied. This file keeps what the painting does, as rules, and draws its own dragon in the kit's manner: flat colour inside a fine dark line.  1. One long body that rises and falls in arches, as thick as the head behind the shoulders and narrowing to the tail. 2. Its skin is dots, not scales: rows of dark dots on tan, larger toward the back. Its belly is a pink band of plates. 3. A band of flame runs down the whole back with small points to it, and taller flames rise from it here and there. 4. Four short legs, the same dotted skin, a tuft of hair at each shoulder, and every paw holds a pearl: a pale ball with a spiral on it. 5. The head is round, more a lion's than a snake's: a short muzzle, a pink nose, a ro

### `dragonLock(long, wide, wave, turn, colour)`

```
dragonLock() is that lock of hair (described just above).
  long, wide  its length and its width at the root, in pixels of pen's frame
  wave        how far it swings to each side, in the same pixels
  turn        where in its swing it is, in radians (clock * 3 makes it stream)
  colour      its fill; the line down its middle is that colour darkened
Both wave and turn are multiplied by DRAGON_AIR, which dragon() sets for
its flight. Returns nothing: it draws with pen, and leaves pen's stroke
colour and line width set.
e.g. dragonLock(190, 26, 20, clock * 3, "#d9a441")
```

### `dragonFire(long, wide, wave, turn, c)`

```
A flame that waves: a lock in the flame's colour, with a shorter one of
the fire's own colour inside it. long, wide, wave and turn are as
dragonLock() takes them; c.crest is the flame's colour and c.fire the inside.
Returns nothing: it draws with pen out along x from (0, 0).
e.g. dragonFire(300, 46, 22, clock * 6, {crest: "#e8632c", fire: "#f6c445"})
```

### `dragonPearl(x, y, r, colour)`

```
A pearl: a pale ball with a spiral on it, about (x, y), of radius r (in
pixels of pen's frame), filled with "colour". Returns nothing: it draws
with pen, and leaves pen's stroke colour and line width set.
e.g. dragonPearl(120, -40, 30, "#dfe6f2")
```

### `dragonLeg(sx, sy, px, py, knee, skin, c, pearls, china, claws)`

```
One leg, from the shoulder (sx, sy) to the paw at (px, py), and what the
paw holds. "knee" is 1 for a leg whose joint points forward and -1 for one
whose joint points back; "skin" is the leg's colour.
A Chinese dragon's leg is longer in the bone, bent hard at the elbow, and
ends in an eagle's foot ("claws" of them); a tuft streams from the elbow.
It gives back where the foot is, in the dragon's own drawing.
  c       the dragon's colours (mane for the tufts, spots, pearl)
  pearls  true: the paw holds a pearl
  china   true: the Chinese dragon's leg, elbow tuft and eagle's foot
  claws   that foot's claws, 3 to 5 (4 when left out)
Returns [x, y], the foot, in pen's frame. It draws with pen.
e.g. dragonLeg(0, 20, 34, 116, -1, "#dcb47c", c, true, false)   // c as dragon() makes it
```

### `dragonHead(open, breath, c, e)`

```
A dragon's head in profile, looking along x, its neck joining at (0, 0):
round, more a lion's than a snake's, with a high skull, a short muzzle
that steps down from the brow, a pink nose, an ear, and two horns. "open"
is how far the mouth is open and "breath" how much flame it breathes,
both 0 to 1. "c" is the dragon's colours (body, spots, belly, mane, crest,
fire); "e" a feeling (creatureFeel()), or null. The head is about 160
across without its mane and whiskers, in pen's frame.
Returns nothing: it draws with pen, and leaves pen's colours, line width
and lineCap as it last set them.
e.g. dragonHead(0.4, 0, c, null)   // c as dragon() makes it
```

### `dragonTalons(x, y, down, claws, skin)`

```
An eagle's foot at (x, y), the shin coming in at the angle "down": "claws"
toes spread like a bird's, all but one forward and that one turned back,
each a short bone and a long curved talon. "down" is in radians; "claws"
3 to 5 (4 when left out); "skin" the colour of the palm and the toes.
Returns nothing: it draws with pen; pen's frame is kept.
e.g. dragonTalons(34, 116, Math.PI / 2, 5, "#e0b24a")
```

### `dragonScales(line, wide, c)`

```
Scales over the body: rows of overlapping crescents, each opening toward
the tail, about a sixth of the body's width, kept off the belly's plates
and inside the body's own line. The body's edges are found as nagaStrip
finds them: the back to the right of the way to the tail.
  line, wide  the body's middle and half-width, as nagaStrip() takes them
  c           the colours: c.spots draws the scales
Returns nothing: it draws with pen over a body nagaStrip() has painted.
e.g. dragonScales(line, wide, c)   // as dragon() calls it, after nagaStrip(line, wide, c, [])
```

### `dragonChasedPearl(x, y, r, c)`

```
The flaming pearl a Chinese dragon chases: a pearl ringed with flames that
lick round it, at (x, y). "r" is the pearl's radius in pixels of pen's
frame (the flames reach about twice that past it); c.crest and c.fire
colour the flames, c.pearl the pearl. Returns nothing: it draws with pen.
e.g. dragonChasedPearl(168, -40, 30, {crest: "#c9552a", fire: "#f6c445", pearl: "#f2f4f8"})
```

### `dragonHeadChina(open, breath, c, e)`

```
A Chinese dragon's head in profile, looking along x, its neck joining at
(0, 0): long, a camel's more than a lion's, the snout turned up into a
bulbous nose, the mouth open on a row of teeth, round bulging eyes under
bushy brows, the lump on the crown, a cow's ear, branched antlers, long
curling whiskers, a beard, and the mane streaming back.
open, breath, c and e are as dragonHead() takes them. Returns nothing: it
draws with pen, and leaves pen's colours, line width and lineCap set.
e.g. dragonHeadChina(0.6, 0.3, c, null)   // c as dragon() makes it for kind: "chinese"
```

### `dragonFlight(line, air, when, seed)`

```
The flight, laid over the body's line (the dense one), whether the body is
a straight line or the chain behind a led head: the arches, small behind
the head and full from 0.19 of the body, travelling down it; the tail's
own undulation across the body, nothing at the shoulders, growing down the
body and fullest at the tip, travelling toward it; and in a glide, now and
then, the corkscrew. Each point is moved across the line's own way there,
so the waves lie across the body whichever way the body runs (owner,
2026-10-15: "make the whole body glide, not just the tail": before this
the led dragon's body was the chain alone).

The corkscrew (owner: "a corkscrew through the whole body"): over a short
stretch of the body the line is carried once round a circle, along the body
and across it, which is nothing at the stretch's ends of itself, so the body
makes a full loop there (the circle is wider than the stretch, so the line
comes back on itself) and runs smoothly into it and out of it; the loop is
large where the body is thick and smaller toward the tail. It is drawn in
ONE frame, the line's way at the loop's middle (in each point's own frame it
smears into a hairpin where the body bends), with the waves held still
through it (or they shear it). It starts behind the mane and runs off the
tip in 3.6 s, every "when" seconds (8 if unsaid) or at the moments "when"
lists; "seed" keeps two dragons on the same period from looping together.
  line   the body's middle, a dense list of [x, y], the head first
  air    one of DRAGON_FLIGHT's manners (above)
  when   look.corkscrew: seconds between corkscrews, or a list of the clock's
         seconds at which one starts (8 seconds apart when left out)
  seed   seconds added to the clock for the corkscrew's timing
Returns a new list of [x, y], as many as "line", moved. It reads the
film's clock and draws nothing.
e.g. dragonFlight(nagaLine(spine, 4), DRAGON_FLIGHT.glide, undefined, 0)
```

### `dragon(x, y, look)`

```
A dragon, its head at (x, y). Everything about it is in "look" (see
DRAGON_KEYS above). It gives back {claw, size}: where its near front foot
is, in the points of the frame it was drawn in, so a film can put something
in that claw; and how large it was drawn, depth and all.
  x, y   where the head is, in pixels of the sheet; the body runs back from
         it (to the left when it faces right), about 1080 long at size 1.
         With look.trail, (x, y) should be where trail(clock) puts the head
  look   an object, never left out ({} gives the thangka's tan dragon at
         size 1, gliding, facing right, holding pearls): its keys are
         DRAGON_KEYS above, and naming another warns (checkNames)
Returns {claw: [x, y], size: number}. It draws with pen at the film's
clock. It sets the kit's FINE and LINE, and DRAGON_AIR, while it draws,
and leaves them at 1, STYLE.line and {wave: 1, turn: 1}; pen is restored.
e.g. var d = dragon(900, 260, {size: 0.5, face: -1, fly: "glide", breath: 0.4, feel: "angry"});
     // then draw a pearl or a lamp at d.claw
```

## beasts.js

beasts.js - an elephant, a water buffalo, a cat, a tiger, a pig, a pack horse, two mice and a tokay gecko, for films made with oldcartoon.js. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="beasts.js"></script>  and call elephant(x, y, look), buffalo(x, y, look), cat(x, y, look), tiger(x, y, look), pig(x, y, look) or horse(x, y, look) from a scene; the mice and the gecko, at the end of this file, are drawn by mouse(x, y, look) and gecko(route, along, look), each with its own look. (x, y) is the ground under the middle of the animal. (The cat, the tiger and the pig are toward the end of this file.) Each gives back where its back is, in the scene, so that someone can ride:  var b = buffalo(600, 900, {step: t / BEAT / 4}); person(b.seat[0], b.seat[1], cast("boy", {floor: "astride"}));  amble(), at the end of this file, walks one from place to place at an even pace, with feet that do not slide:  var walk = amble("tiger", t, 100, 1300, 2, {size: 0.8}); tiger(walk.x, GROUND, walk.look);  They are drawn in the kit's manner: flat colour inside a fine dark line, no cast shadow but the soft one on the ground, and nothing that stays still. What each is, in rules:  T

### `beastFoot(s, reach, lift)`

```
Where a walking foot is in its stride: [how far forward of its joint, how
high off the ground]. "s" is how far through the stride it is; it is on
the ground for the first 0.62 of it.
  s      strides: look.step plus the leg's own offset (only its fraction counts)
  reach  how far the foot goes back along the ground in one stride, in pixels
         of the beast's own drawing (GAITS' second number)
  lift   how high the foot rises in the air, in the same pixels
Returns [forward, up]. Draws nothing.
e.g. beastFoot(clock / BEAT / 3, 84, 24)
```

### `beastLegs(legs, far, look, bones, wide, colour, reach, lift, foot)`

```
The four legs of a beast. Each row of "legs" is one leg: [the joint's x and
y, how far through the stride it is when the hind near foot begins, which
way its joint bends (1 forward, -1 back), true if it is on the far side].
"far" says which side to draw now. "foot" draws a foot at an ankle; it is
also told where the knee and the top of the leg are, for one that paints
the leg, and how far the pad is turned.
On a slope (look.slope, radians: above 0 the ground falls away ahead of
it, as when it walks down the picture; below 0 it climbs), the ground
under each foot is where the sloped line is at that foot, so the legs
ahead reach lower or higher than the legs behind, the body staying level
as a walking animal's does; and each foot is pitched to the ground, toes
down a fall and up a climb.
  legs    the rows above, in the beast's own drawing (the ground at y = 0)
  far     true: draw the far legs (before the body); false: the near ones
  look    the beast's look: step and slope are read from it
  bones   [the upper bone's length, the lower's, how high the ankle stands]
  wide    the leg's half-widths, as limb() takes them: [top, joint, ankle]
  colour  the hide; a far leg is drawn a little darker
  reach, lift  as beastFoot() takes them
  foot    foot(ankleX, ankleY, skin, lifted, kneeX, kneeY, hipX, hipY, turn)
Returns nothing: it draws with pen in the beast's own frame.
e.g. beastLegs(legs, true, look, [92, 86, 14], [27, 18, 15], colour, GAITS.buffalo[1], 24, foot)   // as buffalo() does
```

### `beastTube(points, wideAt)`

```
The two edges of a tube that runs along a row of points and narrows, as a
trunk does. "wideAt" gives its half-width from 0 (the first point) to 1.
"points" is a list of [x, y]. Returns [edge, edge]: two lists of [x, y], one
point on each for every point given, the first on the right of the way the
row runs, as the sheet shows it (y down). Draws nothing.
e.g. beastTube([[0, 0], [0, 100], [20, 180]], function (u) { return mix(50, 15, u); })
```

### `elephantTrunk(points, wide, thin, colour, open)`

```
An elephant's trunk along a row of points: thick at the face, a round tip
with a small finger on it, and rings across it that bow toward the tip.
"open" left out: a line goes all round it. Given, there is no line across
its root: it grows out of the face it is drawn on. true is that and no
more; a number is how many points of its first edge, counted from the
root, have no line either (the side of the trunk that is under the cheek).
  points  the trunk's middle, a list of [x, y] from the face to the tip (two or more)
  wide    its half-width at the face, thin its half-width at the tip, in pixels
          of pen's frame
  colour  the hide
Returns nothing: it draws with pen, and leaves pen's stroke colour, line
width and lineCap set.
e.g. elephantTrunk(trunk, 57, 15, colour, true)   // as elephantFront() does
```

### `elephantEye(ink, shut, e, skin)`

```
An elephant's eye, about (0, 0), looking along x: small and dark under a
heavy lid, with lashes and the folds of old skin round it. "shut" is true
in a blink. "e", a feeling (creatureFeel()), in the colour "skin": its lid,
and the fold of the brow raised or turned. "ink" is the colour of its lines
(inkFor(skin)). The eye is about 22 across, in pen's frame.
Returns nothing: it draws with pen, and leaves pen's stroke colour, line
width and lineCap set.
e.g. elephantEye(inkFor("#8e9098"), false, null, "#8e9098")
```

### `elephantRings(bands)`

```
Two bands of gold across a tusk: the tusk's shape is the pen's path when
this is called, and each band is a line [x1, y1, x2, y2] across it.
Returns nothing: it draws with pen in STYLE.gold, clipped to that path;
pen is restored after.
e.g. elephantRings([[60, -318, 110, -330], [68, -292, 114, -300]])   // after drawing the tusk's path
```

### `elephantFront(look, colour)`

```
An elephant seen from the front, coming toward us: drawn about the middle
of the pen's frame, the ground at y = 0. It gives back how high its head
stands, for a rider. (elephant() calls it for a look with front: true.)
  look    the elephant's look (sit, step, late, trunk, mouth, feel, tusks,
          cloth, howdah are read)
  colour  the hide
Returns a number: the head's height above the ground, in pixels of pen's
frame (about 606 standing). It draws with pen.
e.g. var tall = elephantFront({front: true, trunk: 0.5}, "#8e9098");
```

### `buffaloFront(look, colour)`

```
A water buffalo seen from the front, coming toward us, drawn the same way.
(buffalo() calls it for a look with front: true.)
  look    the buffalo's look (step, late, feel, rope are read)
  colour  the hide
Returns a number: the head's height above the ground, in pixels of pen's
frame (about 346). It draws with pen.
e.g. var tall = buffaloFront({front: true, rope: true}, "#55565f");
```

### `elephant(x, y, look)`

```
An elephant, standing on (x, y). Everything about it is in "look" (see
BEAST_KEYS above). It gives back {seat, head}: where a rider sits on its
neck (or in its howdah), and the top of its head, in the scene.

How it is drawn, from the side: the legs are columns that spread to a round
pad, with no line where the leg ends and the foot begins, and no cap where
a near leg meets the body: the body's colour is laid back over the top of
it, so the leg comes out of the shoulder or the hip. The head is carried
higher than the back. The trunk grows out of the face with no line across
its root; it is thick there, hangs with its end curled in, and when it is
lifted it turns up close before the face and its end curls forward; the
mouth opens with it (or by "mouth"). It blinks, and in a walk its head
nods and its trunk swings with the steps. "sit" lays it down with its legs
folded, so that someone can climb on.
  x, y   the ground under its middle, in pixels of the sheet
  look   an object, never left out ({} gives a grey tusker standing, size 1,
         facing right): its keys are BEAST_KEYS above (the elephant reads
         size, face, ground, step, colour, late, front, trunk, tusks, cloth,
         howdah, sit, mouth, feel, and slope: radians, as beastLegs() says)
Returns {seat: [x, y], head: [x, y]}, points of the sheet. It draws with
pen at the film's clock; it sets the kit's FINE and LINE while it draws
and leaves them at 1 and STYLE.line.
e.g. var e = elephant(700, GROUND, {size: 0.6, step: clock / BEAT / 4, trunk: 0.4, cloth: "#b23a2a"});
     person(e.seat[0], e.seat[1], cast("boy", {floor: "astride"}));
```

### `buffalo(x, y, look)`

```
A water buffalo, standing on (x, y). Everything about it is in "look"
(see BEAST_KEYS above). It gives back {seat, head}: where a rider sits on
its back, and the top of its head, in the scene.
  x, y   the ground under its middle, in pixels of the sheet
  look   an object, never left out ({} gives a slate-grey buffalo standing,
         size 1, facing right): its keys are BEAST_KEYS above (the buffalo
         reads size, face, step, colour, late, front, rope, graze, feel,
         slope)
Returns {seat: [x, y], head: [x, y]}, points of the sheet. It draws with
pen at the film's clock; it sets FINE and LINE while it draws and leaves
them at 1 and STYLE.line.
e.g. var b = buffalo(600, GROUND, {size: 0.7, face: -1, graze: 1, rope: true});
```

### `beastSheer(colour, alpha)`

```
A colour that can be seen through: "alpha" of it, 0 to 1.
"colour" must be written "#rrggbb" (six hex digits; a name or "#rgb" gives
a wrong colour). Returns the colour as an "rgba(r, g, b, alpha)" string.
e.g. beastSheer("#e2892b", 0.4)   // "rgba(226, 137, 43, 0.4)"
```

### `beastTuft(x, y, turn, size, colour)`

```
One tuft like a small flame: three points that lean the way x goes.
Its root at (x, y), turned "turn" radians, "size" long, in pixels of pen's
frame, filled with "colour" and inked. Returns nothing: it draws with pen.
e.g. beastTuft(150, -250, Math.PI + 0.5, 54, "#f6c445")   // a tiger's tuft at a joint
```

### `felineHead(kind, open, c, m, seed, e)`

```
A feline's head in profile, looking along x, about its middle. "open" is
how far the mouth is open; "c" the colours; "m" the measures (FELINES).
"kind" is "cat" or "tiger"; "open" 0 to 1; "seed" any number, so two
heads blink apart; "e" a feeling (creatureFeel()), or null.
Returns nothing: it draws with pen, and leaves pen's colours and line
width as it last set them.
e.g. felineHead("cat", 0.3, c, FELINES.cat, 1, null)   // c as cat() makes it
```

### `feline(kind, x, y, look, c)`

```
A feline: a cat or a tiger, standing on (x, y). "kind" is "cat" or
"tiger"; "c" its colours. It gives back {seat, head}, points of the scene.
A page calls cat() or tiger(), which check the look's names and make "c":
{body, points, eye, pale, stripes, tuft}. (x, y) is the ground under its
middle, in pixels of the sheet; look's keys are BEAST_KEYS above.
Returns {seat: [x, y], head: [x, y]}. It draws with pen; it sets FINE and
LINE while it draws and leaves them at 1 and STYLE.line.
e.g. feline("tiger", 500, GROUND, {step: 1.5}, {body: "#e2892b", points: "#e2892b", eye: "#f0c23a",
                                              pale: "#f6ead0", stripes: "#1f1a1a", tuft: "#f6c445"})
```

### `cat(x, y, look)`

```
A cat, standing on (x, y): the Siamese unless its colours are told.
  x, y   the ground under its middle, in pixels of the sheet
  look   an object, never left out: its keys are BEAST_KEYS above (a cat
         reads size, face, step, colour, points, eyes, late, sit, mouth, feel,
         slope); at size 1 it is a house cat beside the cast
Returns {seat: [x, y], head: [x, y]}, points of the sheet (feline()). It
draws with pen; FINE and LINE are left at 1 and STYLE.line.
e.g. cat(820, GROUND, {sit: true, face: -1, feel: "sleepy"})
```

### `tiger(x, y, look)`

```
A tiger, standing on (x, y).
  x, y   the ground under its middle, in pixels of the sheet
  look   an object, never left out: its keys are BEAST_KEYS above (a tiger
         reads size, face, step, colour, stripes, tufts, eyes, late, sit,
         mouth, feel, slope)
Returns {seat: [x, y], head: [x, y]}, points of the sheet (feline()). It
draws with pen; FINE and LINE are left at 1 and STYLE.line.
e.g. var walk = amble("tiger", clock, 100, 1300, 2, {size: 0.8});
     tiger(walk.x, GROUND, walk.look);
```

### `pig(x, y, look)`

```
---------- a pig ----------
A pig, standing on (x, y): a barrel of a body low on short legs, a belly
that hangs, a big head with a flat round snout, a small eye, an ear that
flops forward, cloven trotters and a tail in a curl. It is pink unless its
colour is told (the hill villages keep black ones), and "points" is the
colour of patches on its back. It walks (step), keeps the beat with its
ears and tail (late), and opens its mouth (mouth, 0 to 1). It gives back
{seat, head}, points of the scene, as the other animals do.
  x, y   the ground under its middle, in pixels of the sheet
  look   an object, never left out: its keys are BEAST_KEYS above (a pig
         reads size, face, step, colour, points, eyes, late, mouth, feel,
         slope)
Returns {seat: [x, y], head: [x, y]}. It draws with pen; it sets FINE and
LINE while it draws and leaves them at 1 and STYLE.line.
e.g. pig(400, GROUND, {colour: "#3a3436", step: clock / BEAT / 2})
```

### `amble(kind, t, from, to, start, look)`

```
amble() takes an animal along the ground at an even pace, as the kit's
stroll() takes a person. The feet do not slide: a foot is on the ground
for 0.62 of a stride (see beastFoot), and in that time the body goes
forward as far as the foot goes back.
  kind       "elephant", "buffalo", "cat", "tiger", "pig" or "horse"
  t          the scene's clock
  from, to   where the walk begins and where it ends (x)
  start      the second the animal sets off
  look       its look
It gives back {x, look, arrives}: where the animal is at t; the look to
draw it with, which is the one given with face set, and step while it
walks; and the second it arrives.
The look given is not changed (a copy is given back). t and start are in
seconds, from and to in pixels of the sheet. "kind" must be a key of GAITS
(myth.js adds "mom", "hatsadiling" and "maengSiHuHaTa"; a mouse has no
gait). Draws nothing.
e.g. var walk = amble("buffalo", clock, 1400, 300, 1, {size: 0.7, rope: true});
     buffalo(walk.x, GROUND, walk.look);
```

### `horse(x, y, look)`

```
---------- a pack horse ----------
The small horse of the Yunnan caravans (ม้าต่าง, ma tang), as the Haw traders led them over the hills into the north:
short and sturdy, a deep chest, a thick neck carried up, a big head, a short dark mane that stands up and a long
dark tail, slim legs on single hooves, darker below the knee. It walks as the other beasts do (step), and
GAITS.horse is its gait. A bay unless told (colour; mane, the colour of its mane, tail and lower legs).
look.pack: a pack saddle of wood on its back, with a load lashed on each side: true, or the colour of the load's
cloth. About 330 high at the withers at size 1. It gives back {seat, head, nose, load}: the top of the load; the
head and the nose (where the halter's rope ties) in the film's own pixels, as the buffalo's head.
  x, y   the ground under its middle, in pixels of the sheet
  look   an object, never left out: its keys are BEAST_KEYS above (a horse
         reads size, face, step, colour, mane, pack, feel, slope)
Returns {seat: [x, y], head: [x, y], nose: [x, y], load: [x, y] or null}: seat
is on its back, where a rider sits; load is the top of the load, null with
no pack. It draws with pen; it sets FINE and LINE while it draws and leaves
them at 1 and STYLE.line.
e.g. var h = horse(900, GROUND, {pack: "#6a4a8a", step: clock / BEAT / 2, face: -1});
```

### `mouse(x, y, look)`

(no comment)

### `geckoRoute(route)`

```
"route" is a list of [x, y] in pixels of the sheet. Returns a list of
numbers, one for each point: how far along the route it is, in pixels.
It keeps that list on the route itself (route.marks) the first time and
gives it back after, so a route changed after its first use keeps its old
distances: make a new list for a new route. Draws nothing.
e.g. geckoRoute([[100, 800], [100, 200]])   // [0, 600]
the distance along a route at each of its points, kept with it
```

### `geckoAt(route, d)`

```
"route" as geckoRoute() takes it (two points or more); "d" a distance along
it in pixels (below 0 is on back past its first point; past its end, on
along its last stretch). Returns [x, y, angle]: the point, in pixels of the
sheet, and the way the route runs there, in radians. Draws nothing.
e.g. geckoAt([[100, 800], [100, 200]], 150)   // [100, 650, -Math.PI / 2]
the point a distance along a route, and the way it runs there
```

### `gecko(route, along, look)`

(no comment)

## myth.js

myth.js - four creatures of the myths of Lanna, the north of Thailand, for films made with oldcartoon.js: the Mom, the Luang, the Hatsadiling bird and the creature with four ears and five eyes. They stand on the beasts' legs and the Naga's body, so load it after both:  <script src="oldcartoon.js"></script> <script src="naga.js"></script> <script src="beasts.js"></script> <script src="myth.js"></script>  and call mom(x, y, look), luang(x, y, look), hatsadiling(x, y, look) or maengSiHuHaTa(x, y, look) from a scene.  Nothing is copied. Each was read by eye from one photograph of a work in the north (all on Wikimedia Commons) and from what is written of it, and this file keeps what the work does, as rules, and draws its own creature in the kit's manner: flat colour inside a fine dark line.  The Mom (ตัวมอม). A creature the craftsmen of the north made up, seen as sculpture at the temples of the upper north, at the foot of a stair or by a gate, where it keeps watch. It is told that it is the mount of Pajjunna, the god of rain, and that it was carried in a procession to ask for rain. Writers on it say it is mixed of a lion, a cat, a dog, a monkey, a gecko and a lizard, with long arms and 

### `mythScales(shapeOf, left, top, right, bottom, r, colour)`

```
Scales, inside the shape that "shapeOf" makes: rows of small round scales,
each row sitting between the scales of the row above, their round edges
downward. They are all one colour and one stroke.
  shapeOf   a function that makes the shape's path on pen (it need not fill it)
  left, top, right, bottom   the box the scales are laid in, in pixels of pen's frame
  r         a scale's radius, in the same pixels
  colour    the scales' line
Returns nothing: it draws with pen, clipped to the shape; pen is restored.
e.g. mythScales(function () { pen.beginPath(); pen.ellipse(0, -150, 120, 60, 0, 0, 7); }, -120, -210, 120, -90, 9, "#e0b23a")
```

### `mythFeather(long, wide, curl, colour, border)`

```
One great feather of a wing or a tail, from (0, 0) out along x: a flame of
a leaf with a border of another colour and a rib. "curl" is how far its
tip is bent to one side. long, wide and curl are in pixels of pen's frame;
"colour" fills the middle and "border" the edge round it.
Returns nothing: it draws with pen, and leaves pen's stroke colour, line
width and lineCap set.
e.g. mythFeather(176, 36, -8, "#f6dc8a", "#e0b23a")
```

### `mythTube(points, wide, thin, colour)`

```
A tube along a row of points, as a tail or a neck: wide at its first point
and "thin" at its last, with one line round it.
"points" is a list of [x, y]; wide and thin are half-widths, in pixels of
pen's frame; "colour" fills it. Returns its two edges, as beastTube()
gives them. It draws with pen.
e.g. mythTube([[0, 0], [-60, -20], [-110, -80]], 22, 6, "#8d6f9b")
```

### `mom(x, y, look)`

```
---------- the Mom ----------
A Mom, standing on (x, y): see the top of this file. It gives back
{seat, head}, points of the scene, as the kit's beasts do.
  x, y   the ground under its middle, in pixels of the sheet
  look   an object, never left out ({} gives a purple Mom standing, size 1,
         facing right): its keys are MYTH_KEYS above (the Mom reads size,
         face, colour, gold, belly, eyes, step, late, mouth, feel)
Returns {seat: [x, y], head: [x, y]}, points of the sheet. It draws with
pen; it sets FINE and LINE while it draws and leaves them at 1 and STYLE.line.
e.g. var walk = amble("mom", clock, 200, 900, 1, {size: 0.8});
     mom(walk.x, GROUND, walk.look);
```

### `luangLeg(sx, sy, px, py, knee, skin, c)`

```
---------- the Luang ----------
One leg of a Luang, from the shoulder (sx, sy) to the foot at (px, py): a
horse's leg, with a tuft over a dark hoof. "knee" is 1 for a leg whose
joint points forward and -1 for one whose joint points back. All in
pixels of pen's frame; "skin" is the leg's colour, "c" the Luang's colours
(crest and fire, for the tuft).
Returns nothing (unlike dragonLeg()): it draws with pen.
e.g. luangLeg(0, 20, 30, 112, -1, "#2f8f6a", {crest: "#e0b23a", fire: "#e8632c"})
```

### `luangHead(open, c, e)`

```
A Luang's head in profile, looking along x, its neck joining at (0, 0).
"open" is how far the mouth is open, 0 to 1.
"c" the Luang's colours (body, belly, crest, fire, horn, edge, as luang()
makes them); "e" a feeling (creatureFeel()), or null.
Returns nothing: it draws with pen, and leaves pen's colours and line width set.
e.g. luangHead(0.4, c, null)   // c as luang() makes it
```

### `luang(x, y, look)`

```
A Luang, its head at (x, y). Everything about it is in "look" (see
MYTH_KEYS above). Without a trail it hangs in the air and its body waves.
  x, y   where its head is, in pixels of the sheet; the body runs back from
         it, about 900 long at size 1. With look.trail, (x, y) should be
         where trail(clock) puts the head
  look   an object, never left out ({} gives a green Luang at size 1,
         facing right): the Luang reads size, face, colour, gold, belly,
         horns, wings, trail, depth, late, sing, mouth, feel
Returns nothing (unlike the dragon). It draws with pen at the film's clock;
it sets FINE and LINE while it draws and leaves them at 1 and STYLE.line.
e.g. luang(760, 300, {size: 0.5, face: -1, trail: function (t) { return [1400 - 120 * t, 300 + 40 * Math.sin(t)]; }})
```

### `hatsadiling(x, y, look)`

```
---------- the Hatsadiling bird ----------
A Hatsadiling bird, standing on (x, y): see the top of this file. It gives
back {seat, head}, points of the scene, as the kit's beasts do. One that
flies has (x, y) under it as one that stands has: the place it would stand.
  x, y   the ground under it, in pixels of the sheet
  look   an object, never left out ({} gives a blue bird with a dark
         elephant's head, standing, size 1, facing right): it reads size,
         face, colour, gold, belly, head, wings, step, fly, trunk, late, feel
         (MYTH_KEYS above)
Returns {seat: [x, y], head: [x, y]}, points of the sheet. It draws with
pen; it sets FINE and LINE while it draws and leaves them at 1 and STYLE.line.
e.g. hatsadiling(640, GROUND - 200, {fly: true, size: 0.7, trunk: 0.6})
```

### `maengOutline(start, curves, steps)`

```
---------- the creature with four ears and five eyes ----------
Its outline as points: from "start", along cubic curves [c1x, c1y, c2x, c2y, x, y], "steps" points each.
"start" is [x, y]. Returns a list of [x, y]: start, then steps points for each curve. Draws nothing.
e.g. maengOutline([0, 0], [[20, -40, 80, -40, 100, 0]], 12)   // 13 points
```

### `maengPath(points, shag, middle, seed)`

```
The outline as a path; with "shag" each stretch of it bows out from "middle" a little, a tuft of fur.
"points" as maengOutline() gives them; "shag" 0 (straight) to about 1, a tuft then about 7 to 11 pixels;
"middle" [x, y], the point the tufts bow away from; "seed" any number, so two outlines tuft apart.
Returns nothing: it makes a closed path on pen (pen.beginPath() first) and neither fills nor strokes it.
e.g. maengPath(body, 0.45, [0, -154], seed); shape("#46424c");
```

### `maengPaw(ax, ay, skin)`

```
A paw too big for it, at the ankle (ax, ay): broad, with four long pale claws hooked down to the ground.
"skin" is the fur's colour. It is the "foot" beastLegs() is given (the other arguments it passes are not
used). Returns nothing: it draws with pen; pen's frame is kept.
e.g. maengPaw(92, -12, "#46424c")
```

### `maengEye(x, y, r, e, c, shut, glow, gaze)`

```
One of its eyes, about (x, y), r across: the carved ring, the white, a green iris, the pupil and a light. A
feeling (e, from creatureFeel()) brings the lid down, low at the corner by the nose in anger, at the outer
corner in sadness; shut, or laughing, the eye is a line, bowed up in a laugh. "glow" lights the iris and the
air about it. "gaze" [-1 to 1, -1 to 1] is where it looks: [0, 0] out at the viewer, 1 to the eye's edge.
e must be given (an object with lid, wide, slant, bowed: creatureFeel()'s, or maengSiHuHaTa()'s calm one);
"c" the colours: c.eyes the iris, c.fur and c.lit the skin round it; "shut" true for a blink; "glow" 0 to 1;
gaze null looks straight out. r and (x, y) are in pixels of pen's frame (the head's own).
Returns nothing: it draws with pen.
e.g. maengEye(0, -54, 14.4, e, {fur: "#46424c", lit: "#6a6672", eyes: "#7cc25a"}, false, 0.5, [0.3, 0])
```

### `maengFace(c, e, open, shut, glow, seed, wake, eyes)`

```
The face, turned to the viewer, about its middle: 172 across the cheeks. "open" is how far the jaw has dropped;
e the feeling (creatureFeel()).
  c      the colours, {fur, lit, eyes}, as maengSiHuHaTa() makes them
  e      must be given (ears, grin, lid, wide, slant, bowed are read)
  open   0 to 1; shut true for a blink of all five; glow 0 to 1
  seed   any number, for the fur's tufts
  wake   0 to 5: how many eyes are open (MAENG_EYES gives the order)
  eyes   what maengEyes() gives, one for each eye; null: all five have e
         and look straight out
Returns nothing: it draws with pen about (0, 0).
e.g. maengFace(c, e, 0.3, false, 0, 1, 5, null)   // c and e as maengSiHuHaTa() makes them
```

### `maengHash(n)`

```
A number from 0 to 1 that stays the same for the same whole number n (the kit's dice()): the creature's
own choices, made again the same in every frame.
e.g. maengHash(12)
```

### `maengEyes(look, at, own)`

```
What each of its five eyes does at second t, as a list of {role, e, narrow, look}: three watch the nearest one
in the frame (SIGHTS, oldcartoon.js), one stares out at the viewer and then scans slowly from side to side,
narrowed in suspicion, and one wanders; every MAENG_EYE_TURN seconds the staring one and the wandering one
change to two others. Three eyes, chosen once for this creature, have its own feeling and the other two a
second (look.eyeFeel, or MAENG_EYE_FEEL's). From the second alone, as everything in a frame is.
  look   the creature's look (id, feel, eyeFeel and the feeling's numbers are read)
  at     the creature's own time in seconds, for the second feeling (the turns go by the film's clock)
  own    the creature's own feeling, as creatureFeel() gives it
Returns five {role: "watch", "stare" or "wander", e: a feeling, narrow: 0 to 1, look: [x, y] or null (a
watcher: maengGaze() finds where)}, in the order of MAENG_EYES. Draws nothing.
e.g. maengEyes({feel: "happy"}, clock, creatureFeel({feel: "happy"}, clock))
```

### `maengGaze(place, eye)`

```
Where one eye looks, in its own -1 to 1: the nearest one in the frame for a watcher (the sheet's pixels, brought
into the head's own), straight out when there is none, or what maengEyes() gave it.
"place" is the eye's [x, y] in the head's own pixels (a row of MAENG_EYES); "eye" one of maengEyes()'s. It
reads pen's frame as it is now, so call it with pen in the head's frame. Returns [x, y], each -1 to 1, as
maengEye() takes "gaze". Draws nothing.
e.g. maengGaze(MAENG_EYES[0], eyes[0])   // eyes from maengEyes()
```

### `maengSiHuHaTa(x, y, look)`

```
maengSiHuHaTa(x, y, look): the creature with four ears and five eyes (described above, before "its eyes").
  x, y   the ground under its middle, in pixels of the sheet
  look   an object, never left out ({} gives the dark grey creature standing, size 1, facing right, five eyes
         open and watching): it reads size, face, colour, eyes, step, mouth, glow, wake, watch, eyeFeel, id,
         feel (MYTH_KEYS above)
Returns {head, mouth, paw, neck}, each [x, y], points of the sheet. It draws with pen at the film's clock;
it sets FINE and LINE while it draws and leaves them at 1 and STYLE.line. Its watching eyes look at what
the film has drawn in the frame (sightsNow() in the kit).
e.g. var m = maengSiHuHaTa(700, GROUND, {size: 0.9, glow: 0.6, wake: 3.5, feel: "happy"});
```

## night.js

night.js - the night of the north, for the Lanna cartoon kit: a moon, the eastern barn owl, the atlas moth, bats going out at dusk, and fireflies far off. Load it after the kit and northbirds.js (it draws with their helpers):  <script src="oldcartoon.js"></script> <script src="northbirds.js"></script> <script src="night.js"></script>  nightMoon(x, y, r)            the full moon, its glow round it; returns {x, y, r} to hand to the owl and moonLight() moonLight(x, y, moon)         how much of the moon's light falls at (x, y): 1 beside it, less far off barnOwl(x, y, t, look)        the eastern barn owl: perched, flying past (fly: "side") or gliding to us (fly: "front") atlasMoth(x, y, t, look)      the atlas moth, fluttering, its wing tips the heads of snakes batStream(t, look)            a stream of bats far off, flying away over the hills, smaller and fading as they go farFireflies(t, look)         fireflies seen from far away: tiny short flashes, low over the fields and the slopes  Why these (owner, 2026-10-21: "Research nocturnal creatures of northern thailand in notebooklm. I want to add some creatures to the credits and the lannamation framework", then "do the moth, the fireflie

### `nightPalette(colours, lit, black)`

```
A palette's every colour taken toward the night by (1 - lit), or all of it black for a silhouette.
"colours" is a palette, an object of name: "#rrggbb" (OWL, MOTH); "lit" 0 to 1; "black" true for the
silhouette. Returns a new object with the same names. Draws nothing.
e.g. nightPalette(OWL, 0.4)
```

### `nightMoon(x, y, r)`

```
---------- the moon ----------
The full moon about (x, y), r in radius, in pixels of the sheet, with its glow out to 4.5 r and its grey
seas. Returns {x, y, r}: hand it to barnOwl() as look.moon and to moonLight(). It draws with pen, and leaves
pen's fillStyle set.
e.g. var moon = nightMoon(1500, 220, 70);
```

### `moonLight(x, y, moon)`

```
"moon" is what nightMoon() returned. Returns a number, 0.3 to 1: 1 within two moon-radii of its middle,
falling to 0.3 at nine and beyond; for look.lit. Draws nothing.
e.g. barnOwl(ox, oy, clock, {fly: "side", lit: moonLight(ox, oy, moon), moon: moon})
```

### `owlFace(r, P)`

```
---------- the eastern barn owl ----------
About (0, 0), r its half-width in pixels of pen's frame; P the owl's palette (OWL, through nightPalette()).
Returns nothing: it draws with pen.
e.g. owlFace(26, nightPalette(OWL, 1))
the heart-shaped white disc, rimmed, its dark eyes and pale beak
```

### `owlPerched(t, P, look)`

```
t the second; P the palette; look.turn and look.seed turn the head. Drawn in the frame nbBegin() made.
Returns nothing: it draws with pen.
e.g. owlPerched(clock, nightPalette(OWL, 1), {turn: 0.3})
on a branch at (0, 0), facing us three-quarter, the head turning
```

### `owlWingSide(lift, P)`

```
"lift" from 1, raised, to -1, lowered (nbLift()); P the palette. Returns nothing: it draws with pen;
pen is restored.
e.g. owlWingSide(Math.cos(clock * 7), nightPalette(OWL, 1))
one broad round wing, from the shoulder, as it beats seen from the side
```

### `owlSide(t, P)`

```
t the second (a beat every 0.9 s); P the palette. It moves pen's frame up and down with the beat and
does not restore it: call it inside nbBegin() and nbEnd(), as barnOwl() does. Returns nothing.
e.g. owlSide(clock, nightPalette(OWL, 1))
flying past, slow deep beats, the face turned to us; (0, 0) the body
```

### `owlFront(t, P)`

```
t the second (a beat every 1.6 s); P the palette. Returns nothing: it draws with pen.
e.g. owlFront(clock, nightPalette(OWL, 1))
gliding toward us, wings wide, a slow beat now and then; (0, 0) the body
```

### `barnOwl(x, y, t, look)`

```
The eastern barn owl, at second t: perched with its feet on (x, y) (a branch), or flying with (x, y) the
middle of its body; in pixels of the sheet.
  look   OWL_KEYS, and it may be left out: size (1), face (1 right, -1 left), fly ("side": flying past;
         "front": gliding toward us; else perched), turn (perched: the head turns half of it, in radians),
         lit (0 to 1, 1 when left out: the light on it), moon (nightMoon()'s: a silhouette where it
         crosses the disc), seed (seconds added to its beat, so two do not beat together)
Returns nothing: it draws with pen; pen and LINE are as they were after.
e.g. barnOwl(300 + 150 * clock, 260, clock, {fly: "side", size: 1.3, lit: 0.5, moon: moon})
```

### `mothWings(P)`

```
---------- the atlas moth ----------
P the moth's palette (MOTH, through nightPalette()). Returns nothing: it draws with pen, and leaves pen's
colours and line width set.
e.g. mothWings(nightPalette(MOTH, 1))
the right wings, seen from above; drawn again mirrored for the left
```

### `atlasMoth(x, y, t, look)`

```
(x, y) the middle of its body; look.turn tilts it (radians); look.flutter, how often its wings beat in a second (2.2)
The atlas moth seen from above, at second t, (x, y) in pixels of the sheet.
  look   MOTH_KEYS, and it may be left out: size (1: about 380 across, wings open), face, turn, lit (0 to
         1, 1 when left out), flutter
Returns nothing: it draws with pen; pen and LINE are as they were after.
e.g. atlasMoth(900, 420, clock, {size: 0.6, turn: 0.2, lit: 0.8})
```

### `batStream(t, look)`

```
---------- bats going out ----------
look: from, to ([x, y]: where the stream starts and where it goes, into the distance), start (the second the first
bat leaves), long (the seconds each takes, 14), count (40), every (seconds between one bat and the next, 0.25),
size (at the start, 1), far (its size at the end, 0.25), spread (how wide the stream is, 60), colour ("#16131c",
near black: a lighter one, moonlit, shows against a dark sky). Each bat is a
flapping "m", dark against the sky, smaller and fainter as it goes; one drawn before a hill's sheet goes behind it.
t the second. look must be given, with from and to; the rest as said above. Returns nothing: it draws
with pen; pen is restored (its globalAlpha too).
e.g. batStream(clock, {from: [300, 700], to: [1400, 240], start: 1, count: 30, colour: "#2a2636"})
```

### `farFireflies(t, look)`

```
---------- fireflies far off ----------
Far away a firefly is a point, not a glow: a short flash (about a third of a second) that brightens fast and dies
slower, then dark for two to five seconds, each in its own time, drifting a little, and dimmer the farther (higher
on the sheet, nearer the hills). look: box ([x0, y0, x1, y1], where they are), count (60), seed.
t the second. look must be given, with box (pixels of the sheet). Returns nothing: it draws with pen,
and leaves pen's fillStyle set.
e.g. farFireflies(clock, {box: [0, 640, 1920, 900], count: 80})
```

## northbirds.js

northbirds.js - six birds of the north of Thailand, for the Lanna cartoon kit. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="northbirds.js"></script>  and call each from a scene, as the kit's rooster() is called: (x, y) is where its feet are, or, for one in flight, the middle of its body; t is the second; look holds what it does, and a name the bird does not know is warned of.  peafowl(x, y, t, look)      the green peafowl: walks, pecks, calls, and raises its train into a fan and shivers it pheasant(x, y, t, look)     Mrs Hume's pheasant: walks and pecks, its long barred tail swaying; or the brown hen sunbird(x, y, t, look)      the green-tailed sunbird: perches, hovers on blurred wings, sips from a flower blueMagpie(x, y, t, look)   the red-billed blue magpie: perches and flicks its long tail; flies, beating and gliding hornbill(x, y, t, look)     the great hornbill: perches and turns its head; flies on slow, heavy wings egret(x, y, t, look)        the cattle egret: walks behind the plough and pecks; flies off on slow white wings  Why these five (each said in its own words below, with its source): the green peafowl's largest known mainland population i

### `nbEye(x, y, r, colour, e, skin, pupil)`

```
A bird's eye at (x, y), r across: the dot it always was, or with a feeling (e), a small eye of that colour
under a lid of the head's colour ("skin").
"colour" is the eye's; e a feeling (creatureFeel()) or null; pupil, a colour or left out: a pupil in a pale eye
(the hornbill's), a little toward the front, under the lid a feeling brings down and not on an eye it shuts.
Returns nothing: it draws with pen.
e.g. nbEye(45, -104, 1.6, "#141414", null, "#d8302a")
```

### `nbBegin(x, y, look, fine)`

```
Begins drawing a bird: saves pen and moves it to (x, y), scaled by look.size (1) and turned by look.face
(1 right, -1 left), lineCap and lineJoin "round", and sets the kit's LINE so the line is STYLE.line times
"fine" (1) on the sheet at any size. Returns the LINE it found: hand it to nbEnd() when the bird is drawn.
e.g. var keep = nbBegin(x, y, look, 0.45);  /* the bird */  nbEnd(keep);
the pen at the bird, facing its way, at its size; "fine", a thinner pen for a small bird
```

### `nbEnd(keep)`

```
Ends a bird begun with nbBegin(): puts LINE back to "keep", turns the heavy side of the line off (light())
and restores pen. Returns nothing.
e.g. nbEnd(keep)   // keep as nbBegin() returned it
```

### `nbPaint(colour, paint)`

```
Fills pen's current path with "paint" (a colour or a gradient; "colour" when left out) and inks its edge
in inkFor(colour), LINE wide. Returns nothing; it leaves pen's fill and stroke set.
e.g. nbOval(0, -66, 28, 40); nbPaint("#fbf5ea");
the kit's shape(): the paint inside, and a line of the colour's own ink round it
```

### `nbLift(lift)`

```
It squashes pen's frame up and down by "lift" (never thinner than 0.08 of it), so a wing drawn pointing
up beats. Call it inside pen.save() and pen.restore(). Returns nothing.
e.g. pen.save(); nbLift(Math.cos(clock * 6)); /* the wing */ pen.restore();
a wing drawn pointing up, seen from the side as it beats: 1 up, 0 edge on, -1 down
```

### `nbFill(colour)`

```
Fills pen's current path with "colour", with no line. Returns nothing.
e.g. nbOval(3, -2, 1.5, 1.5); nbFill("#101010");
```

### `nbGrad(x0, y0, x1, y1, a, b)`

```
A straight gradient from colour a at (x0, y0) to colour b at (x1, y1), in pen's frame. Returns the
gradient, for nbPaint()'s "paint" or pen.fillStyle. Draws nothing.
e.g. nbPaint("#3a64b8", nbGrad(0, -40, 0, -14, "#6a90d8", "#f4f4ef"))
```

### `nbOval(cx, cy, rx, ry, turn)`

```
Begins a new path on pen: an ellipse about (cx, cy), rx by ry, turned "turn" radians (0). It neither
fills nor strokes it: nbPaint() or nbFill() does. Returns nothing.
e.g. nbOval(0, -26, 22, 21); nbPaint("#d8a458");
```

### `nbLimb(points, width, colour)`

```
"points" is a list of [x, y] (two or more), "width" the leg's width, in pixels of pen's frame. Returns
nothing: it strokes with pen, and leaves pen's stroke colour and line width set.
e.g. nbLimb([[-4, -12], [-6, 0]], 3, "#e8452a")
a leg as a hose is inked: the ink wider, then its colour
```

### `nbScales(rows, cols, x0, y0, dx, dy, r, colour)`

```
rows by cols half-circles, the first about (x0, y0), dx apart across and dy down, r in radius, stroked in
"colour", LINE * 0.7 wide. Returns nothing: it strokes with pen (clip first, or they spill out).
e.g. pen.save(); nbOval(0, -128, 54, 31); pen.clip(); nbScales(6, 12, -60, -150, 10, 8, 4, "#1d5e48"); pen.restore();
the edges of small feathers in rows, each row set half a feather on: call inside a clip
```

### `nbQuad(a, b, c, s)`

```
a, b and c are [x, y]; s 0 to 1. Returns [x, y]. Draws nothing.
e.g. nbQuad([0, 0], [50, -40], [100, 0], 0.5)   // [50, -20]
a point s of the way along a quadratic curve from a by b to c
```

### `nbStrip(a, b, c, w0, w1, from, to)`

```
a, b, c are [x, y] (the curve from a by b to c); w0 and w1 widths in pixels of pen's frame; from and to,
0 to 1. Begins a new closed path on pen and neither fills nor strokes it. Returns nothing.
e.g. nbStrip([0, 0], [-60, 10], [-120, 0], 6, 8, 0, 1); nbPaint("#8090c0");
the outline of a band along a curve, w0 wide at its start and w1 at its end, from "from" to "to" of the way
```

### `peafowlEye(x, y, r, gleam)`

```
r is its half-width in pixels of pen's frame; "gleam" 0 to 1 lights its blue (0 when left out).
Returns nothing: it draws with pen.
e.g. peafowlEye(-300, -40, 8, 0.5)
rule 6: the eye at a train feather's end
```

### `peafowlFeather(base, mid, tip, eye, gleam, colour)`

```
One feather of the train, from "base" by "mid" to "tip" (each [x, y], pen's frame): its vane in
"colour", its shaft, and an eye "eye" across at the tip, lit by "gleam" (0 to 1).
Returns nothing: it draws with pen, and leaves pen's stroke colour and line width set.
e.g. peafowlFeather([-52, -112], [-150, -60], [-330, -20], 8, 0, "#3f8a4a")
```

### `peafowl(x, y, t, look)`

```
The green peafowl (rules above), its feet on (x, y), in pixels of the sheet, at second t.
  look   PEAFOWL_KEYS: size, face, step, peck, display, shiver, call, feel (said above); it may be left out
Returns nothing: it draws with pen (nbBegin() and nbEnd(): pen and LINE as they were).
e.g. peafowl(600, GROUND, clock, {display: between(clock, 2, 4), shiver: 1, size: 0.8})
```

### `pheasant(x, y, t, look)`

```
Mrs Hume's pheasant (rules above), its feet on (x, y), in pixels of the sheet, at second t.
  look   PHEASANT_KEYS: size, face, step, peck, hen, feel (said above); it may be left out
Returns nothing: it draws with pen (nbBegin() and nbEnd(): pen and LINE as they were).
e.g. pheasant(420, GROUND, clock, {step: clock * 1.5, face: -1})
```

### `sunbirdWing(lift, alpha)`

```
"alpha" 0 to 1: how much of it shows (a blurred wing is drawn faint). Returns nothing: it draws with
pen; pen is restored.
e.g. sunbirdWing(undefined, 1)   // folded
one wing, pointed, olive: "lift" undefined, folded on its side; else beating, from 1 up to -1 down
```

### `sunbird(x, y, t, look)`

```
The green-tailed sunbird (rules above), its feet on (x, y), in pixels of the sheet, at second t (hovering,
(x, y) is where its feet would be).
  look   SUNBIRD_KEYS: size, face, hover, sip, feel (said above); it may be left out
Returns nothing: it draws with pen (nbBegin() and nbEnd(): pen and LINE as they were).
e.g. sunbird(880, 520, clock, {hover: 1, sip: 0.6, size: 1.5})
```

### `magpieTail(root, angle, long, t)`

```
From "root" [x, y], the way "angle" (radians), the longest feather "long" pixels of pen's frame; t the
second, for its sway. Returns nothing: it draws with pen.
e.g. magpieTail([-20, -20], 1.95, 118, clock)
rule 4: the graduated tail, the outer feathers first
```

### `magpieHead(x, y, e)`

```
The magpie's head about (x, y), its bill to the right; e a feeling (creatureFeel()) or null.
Returns nothing: it draws with pen.
e.g. magpieHead(25, -5, null)
rules 1 and 2
```

### `blueMagpie(x, y, t, look)`

```
The red-billed blue magpie (rules above), its feet on (x, y) on a branch, or flying with (x, y) the middle
of its body; in pixels of the sheet, at second t.
  look   MAGPIE_KEYS: size, face, fly, bob, feel (said above); it may be left out
Returns nothing: it draws with pen (nbBegin() and nbEnd(): pen and LINE as they were).
e.g. blueMagpie(300 + 200 * clock, 260, clock, {fly: true, size: 1.2})
```

### `hornbillHead(x, y, e)`

```
e a feeling (creatureFeel()) or null. Returns nothing: it draws with pen, and leaves pen's stroke colour
and line width set.
e.g. hornbillHead(70, -4, null)
rules 2 and 3: the head, the bill and the casque, about (x, y)
```

### `hornbillWing(lift, colour)`

```
"colour" is the wing's (the hornbill's black). Returns nothing: it draws with pen; pen is restored.
e.g. hornbillWing(Math.cos(clock * 2), "#1c1c1e")
rules 4 and 6: one broad wing up from the shoulder, fingered at the tip; "lift" from 1, up, to -1, down
```

### `hornbill(x, y, t, look)`

```
The great hornbill (rules above), its feet on (x, y) on a branch, or flying with (x, y) the middle of its
body; in pixels of the sheet, at second t.
  look   HORNBILL_KEYS: size, face, fly, turn, feel (said above); it may be left out
Returns nothing: it draws with pen (nbBegin() and nbEnd(): pen and LINE as they were).
e.g. hornbill(700, 380, clock, {turn: 0.4, face: -1})
```

### `egret(x, y, t, look)`

```
---------- the cattle egret ----------
The cattle egret (นกยางควาย, Bubulcus ibis), the white bird of the rice fields of the north, that walks close behind
a buffalo at the plough for what the plough turns up (the kit's research, the "Lanna village farming" notebook;
drawn for the tale's fields, 2026-10-20: "a crane should fly off from the fields", owner: "Egret"). White, a
yellow beak, dark legs; standing, look.peck (0 to 1) dips its head to the mud; flying (look.fly), its wings beat
with t, look.seed setting where in the beat. Its feet on (x, y), or the middle of its body in flight; look.face.
x, y in pixels of the sheet; t the second; look EGRET_KEYS (size, face, peck, fly, seed), and it may be
left out. Returns nothing: it draws with pen; pen is restored (it does not use nbBegin(): LINE is not touched).
e.g. egret(1100, GROUND - 10, clock, {peck: 0.5 + 0.5 * Math.sin(clock * 3)})
```

## himmaphan.js

himmaphan.js - beings of the Himmaphan, the mythic forest above the world in Thai art, flying, for the Lanna cartoon kit: the thewada (an angel), the kinnari (half woman, half bird) and the hong (the golden swan) on the wing. Load it after the kit:  <script src="oldcartoon.js"></script> <script src="himmaphan.js"></script>  thewada(x, y, t, look)     an angel flying as the murals paint them: one knee forward, the other leg swept up behind, the sole to the sky; a lotus held up, the other hand before the chest kinnari(x, y, t, look)     a kinnari in flight: a woman crowned to the waist, a bird below, her wings spread hongFlight(x, y, t, look)  the hong on the wing, its neck long, its tail a flame of plumes  (x, y) is the middle of the figure; each flies to the right (look.face -1 to the left); t is the second; look.size, 1 being about 220 from crown to the lowest point; look.seed sets each one's own time, so a flight of them do not move as one; look.scarves (the thewada's and the kinnari's): two long scarves streaming behind; look.gift: what the thewada holds up, "lotus" (the default) or "garland"; look.light (0 to 1, 0.6 unless told): the low sun on them, gilding their edges; look.s

### `himmaFill(fill, line, width)`

```
Fills the path now on pen with "fill" (a colour or a gradient) and strokes it with "line" (a colour), "width" pixels
wide (1.4 when left out). Returns nothing. It leaves pen's fillStyle, strokeStyle and lineWidth as it set them, and so
do the helpers below that draw through it; thewada(), kinnari() and hongFlight() save pen and restore it.
e.g. pen.beginPath(); pen.arc(0, 0, 5, 0, Math.PI * 2); himmaFill(HIMMA.gold, HIMMA.goldLine);
the kit's way: the paint, then a fine line of the colour's own ink
```

### `himmaSkin(x0, y0, x1, y1, light)`

```
Returns a gradient (it draws nothing) along the line from (x0, y0) to (x1, y1) in pen's place now: skinLit blended in
by "light" (0 to 1) at the start, skinShade at the end. For himmaFill().
e.g. himmaFill(himmaSkin(-8, -10, 10, 10, 0.6), HIMMA.skinLine);
gilded skin: lit toward the sun (the upper right), shaded away
```

### `himmaHand(x, y, turn, size, light)`

```
A hand of Thai dance at (x, y), its wrist turned "turn" (radians), the four fingers together and bent far back,
the thumb apart: the hand the murals give every thewada.
size: 1 is about 22 pixels from wrist to fingertips; light: 0 to 1, as himmaSkin's. Returns nothing: it draws with pen.
e.g. himmaHand(-3, -22, -0.6, 0.95, 0.6);
```

### `himmaCrown(x, y, light)`

```
The tall crown of the thewada (chada): a band of jewels at the brow, tiers narrowing to a spire that flicks back at
its tip, and the flame of gold behind each ear (kanchiak).
(x, y): the middle of the brow band; the spire rises about 70 pixels above it. light: 0 to 1, the gold's shine.
Returns nothing: it draws with pen.
e.g. himmaCrown(4, -74, 0.6);
```

### `himmaHead(x, y, light, tilt)`

```
The face, turned a little to us: brows arched high, the eyes long and lowered, a fine nose, a small red mouth, an
earring hanging from the long lobe.
(x, y): the middle of the face, about 20 pixels across and 25 high, facing right; light: 0 to 1; tilt: radians, 0
when left out. Returns nothing: it draws with pen.
e.g. himmaHead(4, -66, 0.6, 0.08);
```

### `himmaScarves(t, seed, from, length)`

```
Two scarves from the shoulders, streaming back and waving slowly: each a band that narrows, its border gold.
t: the second; seed: shifts their wave in time; from: [x, y], the shoulders; length: the pixels they stream back
(to the left), falling about 40 pixels by their ends. Returns nothing: it draws with pen.
e.g. himmaScarves(t, 0, [0, -42], 210);
```

### `himmaCloth(t, seed, light)`

```
The cloth wrapped at the hips: red with rows of gold diamonds, a green under-layer showing at its edge, a gold
border, its ends flaring back in curling flames that ripple as it flies.
Drawn in the thewada's own place: the belt across about x -14 to 19 at y 0, the flames out to about 80 pixels behind
and 76 below. t: the second; seed: shifts its ripple in time; light: 0 to 1, the sheen. Returns nothing: it draws
with pen.
e.g. himmaCloth(t, 0, 0.6);
```

### `thewada(x, y, t, look)`

```
A thewada, an angel, flying, as the top of this file says: (x, y) about the middle of the figure, pixels of the
sheet; t: the second; look: its keys are HIMMA_KEYS above, the thewada reading size (1 when left out: about 220
pixels tall), face (1, to the right; -1 to the left), seed (0), scarves (none), gift ("lotus", or "garland") and
light (0 to 1; 0.6). Returns nothing: it draws with pen and leaves pen as it found it.
e.g. thewada(250, 330, t, {size: 1.9, scarves: true, gift: "garland", seed: 1.5});
```

### `himmaPlume(root, a, len, wide, colour, curl)`

```
One plume of a tail from its root, out at angle "a" for "len", "wide" across at its fullest, its tip curling by
"curl" (radians): a leaf of gold, its rib, and a red eye near its end.
root: [x, y]; a and curl: radians (curl 0 when left out); len and wide: pixels; colour: its fill. Returns nothing: it
draws with pen.
e.g. himmaPlume([-24, 28], 3.1, 100, 9, HIMMA.gold, 0.05);
```

### `himmaWing(lift, light, size)`

```
A wing spread for gliding, from its root (0, 0) out to the left (behind a figure flying right): coverts in rows and
long flight feathers, white with buff edges, gilded along its leading edge by the low sun. "lift" (-1 to 1) beats it.
light: 0 to 1, the gilt on the coverts; size: its scale, 1 about 120 pixels from root to tip. It draws at pen's
(0, 0), so translate there first. Returns nothing: it draws with pen and leaves its place as it found it.
e.g. pen.save(); pen.translate(-4, -40); himmaWing(Math.sin(t), 0.6, 1.05); pen.restore();
```

### `kinnari(x, y, t, look)`

```
A kinnari flying, as the top of this file says, her wings beating slowly (one beat about every 7 seconds): (x, y)
about the middle of the figure, pixels of the sheet; t: the second; look: its keys are HIMMA_KEYS above, the kinnari
reading size (1), face (1 or -1), seed (0), scarves and light (0 to 1; 0.6). Returns nothing: it draws with pen and
leaves pen as it found it.
e.g. kinnari(1230, 330, t, {size: 1.8, seed: 0.7});
```

### `himmaFeather(root, tip, wide, deep, lit)`

```
A feather as a leaf from its root to its tip, "wide" across, shaded from its root's deep gold to its tip's light.
root and tip: [x, y], pixels; wide: how far its one side swells (the other 0.7 of that); deep and lit: "#rrggbb"
colours (blend() reads deep). Returns nothing: it draws with pen.
e.g. himmaFeather([0, 0], [-60, 10], 13, HIMMA.gold, HIMMA.goldLit);
```

### `hongWing(up, rate, light, far)`

```
The hong's wing from its shoulder (0, 0), seen from the side as it beats: long primaries fanned from the wrist, the
secondaries along the trailing edge, rows of scalloped coverts over the arm, gilt along the leading edge. "up" (-1
down to 1 up) is where the stroke is, "rate" how fast it is rising (+) or falling (-). The arm swings about the
shoulder and is seen shorter as it comes toward us; the hand bends at the wrist and trails the stroke, higher than
the arm on the way down and lower on the way up; the primaries spread on the downstroke and close on the upstroke;
the secondaries always trail back (owner, 2026-10-21: "Make the golden bird's wing flap like a natural wing instead
of rotating"). "far" darkens it.
up: -1 to 1; rate: about -1 to 1; light: 0 to 1; far: true for the wing behind the body. It draws at pen's (0, 0).
Returns nothing: it draws with pen and leaves its place as it found it.
e.g. hongWing(Math.sin(t), Math.cos(t), 0.6, false);
```

### `hongChain(rise, t)`

```
The way each joint of the hong's spine faces, by the rule of procedural_animation.html, as nagaChain's: the head
leads, each joint turns to face the one in front, no more than HONG_BEND from it, and keeps its own gap behind it.
The head flies on at HONG_AIR and rises and falls as "rise" says (in drawn pixels, a function of the time). A chain
remembers where it has been and a film must not, so the chain is laid out straight as it was four seconds ago and
led from then until now, in every frame. Returns the angle each joint faces (0 is level, to the right).
rise: a function of the second giving the head's height, drawn pixels; t: the second. Returns HONG_SPINE.length
angles in radians, the head's first. It changes nothing outside itself; each call leads the chain 120 steps.
e.g. var angles = hongChain(function (s) { return 6 * Math.sin(s * 0.45); }, t);
```

### `hongFlight(x, y, t, look)`

```
The hong flying, about the middle of its body, to the right (look.face -1 left). Its spine moves as
procedural_animation.html's does (owner, 2026-10-21: "Can you use the spine logic from procedural_animation on the
bird so it's neck and head and body move more fluidly?"): the head leads and the neck and body follow it a joint at
a time (hongChain), so as it rises the head tips up first, then the neck bends, then the body comes round; each
piece of the drawing turns with its joint, so the S of the neck is kept. The wings lift the body under a steady
head, so the neck flexes with every beat.
(x, y): pixels of the sheet; t: the second; look: its keys are HIMMA_KEYS above, the hong reading size (1, as the
top of this file says), face (1 or -1), seed (0), light (0 to 1; 0.6), soar, beats ([second, how many], with soar;
HONG_BEAT seconds each) and trail (a function of the second giving [x, y], the path the page moves it on; only its
y is read, for the rise). Returns nothing: it draws with pen and leaves pen as it found it.
e.g. hongFlight(1660, 300, t, {size: 1.6, seed: 2.1, soar: true, beats: [3, 2]});
```

### `hongNeck(spine, light)`

```
The hong's neck through the first six joints of its spine (the head's end first), as wide as HONG_NECK says at
each: a smooth band, gold deepening down to the breast, its fine feathers in ticks, the jewelled collar at its root.
spine: [[x, y], ...], at least six joints, drawn pixels (hongFlight()'s, turned and lifted); light: 0 to 1.
Returns nothing: it draws with pen.
e.g. hongNeck(spine, 0.6);
```

## paperdoll.js

paperdoll.js - paperdolls on top of oldcartoon.js: one character each, made without changing the kit.  A paperdoll is a cast member (CAST.x), the clothes the kit does not draw, and the cloth that moves on its own, in a file of its own (fonlep.js, apsara.js). This file is what those files share. Load it after oldcartoon.js and before the dolls' own files; a doll's file then says function fonlep(x, y, more) { paperdoll(FONLEP_DOLL, x, y, more); } and a scene draws her as it draws anyone, with the same keys for changes.  The kit's arm(), follow() and ladyFace() are wrapped here, not changed: person() calls them at known moments, so a doll's style can draw between the kit's layers and learn where her joints are on the sheet. A style is an object with a name (its CAST entry) and any of these: costume(doll, farX, farY)   in the waist's frame, after the body and the head, before either arm (at the far arm's call: the near shoulder is put where it was, measured from the far one, in the frame before) onArm(doll, side, ex, ey, wx, wy)   after an arm is drawn and before its hand, in the waist's frame, with its elbow and wrist; "A" is the near arm, "B" the far one ornament(doll)              i

### `paperdoll(style, x, y, more)`

```
Draw a doll: what hangs behind her first, then the kit's person() with the
wrappers listening, then the chains are moved to where her joints are now.
Without an id, the n-th paperdoll drawn in a frame is the same one in the
next, as the kit takes its people.
```

### `floorOf(doll, below)`

```
Where a doll's chains stop falling: "below" under her feet in the frame she was drawn in, on the sheet, as the
chains' points are. doll.y alone is the sheet's only when nothing is scaled or moved: a doll woven into the sabai
is drawn at (0, 0) in a small tile, and a floor of 0 there pinned every point of its chains to the tile's top
edge (the pu man's red cloth, up from his hip in the hero film's cloth, 2026-10-21). Asked while the chains are
moved, at the end of paperdoll(), when the pen is in the caller's frame again.
```

### `xy(p)`

```
a point as [x, y], whichever way it was given
p: [x, y], or {x, y} (as person()'s joints are), or nothing. Returns a new [x, y], or null when p is
missing or neither shape.
e.g. var hip = xy(doll.joints.hip);
```

### `lineOf(doll)`

```
the kit's pen for this figure, on the sheet
doll: a doll that has been drawn once (doll.scale is set by the arm wrapper, below; before that the
answer is NaN). Returns the pen's width in pixels of the sheet: STYLE.line, thinner for a larger
figure as person() makes FINE, times the doll's scale.
e.g. scarfEnd(doll.chains.scarf.points, doll.scale, lineOf(doll), FONLEP_CLOTH);
```

### `onScreen(lx, ly)`

```
Where a point of the pen's frame now is on the sheet. lx, ly: pixels in the pen's current frame (the
waist's or the head's, inside a style). Returns [x, y], pixels of the sheet.
e.g. doll.tailLead = onScreen(26, 8);
```

### `scaleNow()`

```
How large the pen's current frame draws: how many pixels of the sheet one pixel of the frame is (the
square root of the frame's area scale, so a turn or a lean does not change it). Takes nothing.
e.g. doll.scale = scaleNow();
```

### `nearShoulder(doll, farX, farY)`

```
the near shoulder in the waist's frame, as costume() needs it: where it
was, measured from the far one, in the frame before
doll: the doll; farX, farY: the far shoulder, in the waist's frame (costume()'s own arguments).
Returns [x, y] in the waist's frame; in her first frame, before both shoulders are known, 80 to the
right of the far one.
e.g. var near = nearShoulder(doll, farX, farY);
```

### `dist(a, b)`

```
how far apart two points [x, y] are, in their own pixels
e.g. var far = dist(doll.rootB, doll.leave);
```

### `angleTo(start, end)`

```
the direction from one point [x, y] to another, in radians (0 to the right, PI / 2 straight down)
e.g. var a = angleTo(wrist, elbow);
```

### `walk(start, angle, far)`

```
the point "far" pixels from "start" [x, y] in the direction "angle" (radians): a new [x, y]
e.g. var leave = walk(wrist, angleTo(wrist, elbow), 30 * doll.scale);
```

### `limit(angle, middle, most)`

```
an angle kept within "most" of "middle", the short way round
All three in radians. Returns "angle" when it is near enough, else middle + most or middle - most.
e.g. a = limit(a, chain.angles[n - 1], Math.PI / 7);
```

### `chainOf(doll, name, count, gap, bend, sink, keep)`

(no comment)

### `chainStep(chain, lead, dt, floor)`

```
One frame of a chain whose first point is "lead". Every other point keeps
"keep" of its speed, sinks "sink" pixels a second, and is then put back one
gap behind the point before it, bent no more than "bend" from that one's
direction. A cut, or the clock gone back, hangs it again from the lead.
  chain   what chainOf() gives back (its count, gap and sink in pixels of the sheet, bend in radians,
          keep 0 to 1)
  lead    [x, y], pixels of the sheet: where the first point is this frame
  dt      seconds since the last frame (paperdoll() hands it to advance()); 0, below 0 or over a
          quarter of a second hangs the chain straight down from the lead
  floor   y on the sheet no point goes below: floorOf(doll), or floorOf(doll, 2)
Returns nothing. It moves chain.points (and fills chain.points, chain.was and chain.angles the
first time), so the style's behind() draws them the next frame.
e.g. chainStep(chainOf(doll, "scarf", 17, 14 * s, Math.PI / 7, 220 * s, 0.9), doll.leave, dt, floorOf(doll, 2));
```

### `headings(P)`

```
the direction of the cloth at each point: between the gap before and the gap after
P: two or more points [x, y]. Returns a list of angles in radians, one for each point.
e.g. var A = headings(chain.points);
```

### `through(points, closeTo)`

```
a path through points, bending between them, in the current pen path
points: two or more [x, y]; closeTo: [x, y] to end the path with a straight line to, or nothing.
Returns nothing and draws nothing: it adds to the pen's path (moveTo first), for the caller to fill
or stroke. Call pen.beginPath() before it.
e.g. pen.beginPath(); through(strand.points); pen.stroke();
```

### `clothStrip(P, wide, colour, fold, crease, line, decorate)`

```
A strip of cloth along a chain: "wide" is its half-width at each point.
Painted in the order the thangka sources give: the flat colour, then the
shade (a flat darker band on the inside of each bend, with a crease line),
then the gold work, then the dark line round the whole.
  decorate(left, right, P, A)   draws the pattern and the gold, given both edges
  P                    the strip's middle line: two or more [x, y], pixels of the pen's frame
  wide                 its half-width at each point, one number for each, in the same pixels
  colour, fold, crease the cloth, its shade and its crease lines (CSS colours)
  line                 the pen's width for the outline (lineOf(doll)); the crease is 0.8 of it
  decorate             as above, or nothing; drawn clipped to the cloth
Returns nothing: it draws with pen, and leaves its fill, stroke, width, cap and join as it set them.
e.g. clothStrip(P, wide, FONLEP.scarf, FONLEP.fold, FONLEP.crease, line);
```

### `shadeEdge(edge, P, A, wide, from, to, colour, side)`

```
a flat darker band along one edge of a strip: the side away from the light
edge: the strip's left or right edge, as decorate() is given them; P, A, wide: its middle line, its
headings and its half-widths; from, to: the points it runs between (to not included); colour: the
shade; side: 1 to lay the band inward from a left edge, -1 from a right one. The band is 0.3 of the
half-width deep. Returns nothing: it fills with pen. Used inside a decorate(), where it is clipped.
e.g. shadeEdge(left, Q, A, wide, 1, count - 2, cloth.fold, 1);
```

### `scarfEnd(P, s, line, cloth)`

```
The hanging end of a scarf, from a chain. "cloth" says what it is made of:
  colour, fold, crease    the cloth, its shade and its crease lines
  wide                    its half-width, in the kit's units (gathered where it leaves the arm)
  pleats                  true for folds down its length from the gather
  tip                     "flame": narrowing to a point that curls outward; "fringe": cut straight, with threads
  pattern(left, right, Q, A, wide, s, line, panelAt)   its own pattern, drawn inside the cloth
  panel                   {colour, dark} for a panel of another cloth over the last six points, or nothing
P: a chain's points (chain.points, at least four; six with a panel), pixels of the sheet; s: the doll's scale
(doll.scale); line: lineOf(doll). The cloth ripples with the clock. Returns nothing: it draws with
pen, on the sheet (call it with the pen's frame set to the sheet, as behind() is).
e.g. scarfEnd(doll.chains.scarf.points, s, line, FONLEP_CLOTH);
```

### `drape(from, to, long, s, line, cloth, arch)`

```
A drape: a length of cloth between two points she holds it at, as a
strip. "long" is the cloth's length, in the kit's units; when the two
points part it pulls straight. "arch" is how its slack hangs: 1 sags down,
as cloth left alone does; -1 rises in a loop, as the paintings draw cloth
thrown over a raised arm; between, between.
from, to: [x, y], pixels of the sheet; s: the doll's scale; line: lineOf(doll); cloth: as scarfEnd()
takes it (only colour, fold and crease are read); arch: 1 when left out. Returns nothing: it draws
with pen, through clothStrip().
e.g. drape(doll.rootB, doll.leave, 300, s, line, FONLEP_CLOTH, -0.5);
```

### `beads(P, s, line, gold, dark)`

```
A strand of beads from a chain: a thread with a bead at every point and
between, and a tassel at the end.
P: a chain's points (two or more), pixels of the sheet; s: the doll's scale; line: lineOf(doll);
gold: the beads; dark: the thread and the tassel. Returns nothing: it draws with pen.
e.g. beads(doll.chains.bead0.points, s, line, FONLEP.gold, FONLEP.goldDark);
```

### `leaveOf(doll, side, up)`

```
the point where a cloth leaves a forearm, "up" units above the wrist
doll: a doll drawn at least once; side: "A" (the near arm) or "B" (the far one); up: the kit's
units, toward the elbow. Returns [x, y], pixels of the sheet, or null before the arm is known.
e.g. doll.leave = leaveOf(doll, "A", 30);
```

### `hipsOf(doll)`

```
The hips' line and the skirt's sway, as person() and tier() find them, so
that a band drawn on the skirt lies on the cloth: [phase, hipTip]
doll: the doll being drawn (doll.look, doll.x and the clock are read). Returns [phase, hipTip]:
the skirt's sway in radians, for bandCorners() and band(), and the slant of the hips' line, for
pen.transform(1, hipTip, 0, 1, 0, 0). It must be kept to person()'s own sums when those change.
e.g. var hips = hipsOf(doll); pen.save(); pen.transform(1, hips[1], 0, 1, 0, 0); fonlepSilverBelt(hips); pen.restore();
```

### `bandCorners(top, bottom, halfTop, halfBottom, phase)`

```
the corners of a band across the skirt from "top" to "bottom" below the
waist: at a fraction u down the cloth the edge drifts -36 * u^1.3 *
sin(phase - 1.6u), and one side swells 0.16 * u * cos while the other tucks in
top, bottom: below the waist, in the waist's frame (the skirt is 158 long); halfTop, halfBottom:
half the band's width at each; phase: hipsOf(doll)[0]. Returns {tl, tr, bl, br} (each [x, y]) and
driftTop, driftBottom (how far each edge has drifted sideways), all in the waist's frame.
e.g. var c = bandCorners(4, 10, 36, 38, hips[0]);
```

### `band(top, bottom, halfTop, halfBottom, phase, colour, pattern)`

```
A band across the hips, filled, then handed to "pattern(corners, middle,
wide)" inside its own clip, and outlined.
top, bottom, halfTop, halfBottom, phase: as bandCorners() takes them; colour: the band's;
pattern(corners, middle, wide): bandCorners()' answer, the band's middle y, and a half-width to
draw out to; or nothing. In the waist's frame, slanted by hipsOf(). Returns nothing: it draws with
pen (outlined in 0.9 LINE before the pattern goes on).
e.g. band(-4, 8, 28, 36, hips[0], FONLEP.silver, null);
```

### `sleeveBand(ex, ey, wx, wy, from, to, halfFrom, halfTo, colour, swell)`

```
a band round a forearm, "from" to "to" units above the wrist (wx, wy), toward the elbow (ex, ey)
The four points are onArm()'s, in the waist's frame; halfFrom, halfTo: half its width at each end;
colour: its fill; swell: how far its sides curve out (bone()'s, 0.5 when left out). Returns [ux, uy],
the unit step from the wrist toward the elbow, to place more on the band; it draws with pen.
e.g. var u = sleeveBand(ex, ey, wx, wy, 5, 19, 9.4, 10.2, FONLEP.green);
```

## puman.js

puman.js - the whisperer: a paperdoll on the kit (see paperdoll.js).  Read from the Lanna mural of the whispering couple (Wat Phumin, Nan, as photographed in a reference the owner gave) on 2026-10-12, with the men of its neighbouring scene for the shoulder cloth. Nothing of the mural is copied: these are what it shows, as rules, with the numbers measured on it (a 1280 by 960 photograph; the man 540 px from his knot to his feet). 1. An ochre wall behind him (#d89143), with the mural's thin dark-brown line round everything and colour flat or softly shaded inside it. 2. Pale warm skin (#ebc8ab, shade #d9ad8e); cropped black hair (#2a1f22) with a small round knot on the crown and a low, smooth hairline. 3. A long face with a pointed chin; narrow eyes that look sideways, to the listener; a thin brow; a small nose; a small closed smile. 4. A bare chest and long thin arms; a red-orange shoulder cloth (#c9573a) with purple dots (#72519a) over one shoulder, its end hanging behind. 5. From the waist to just above the knee one dark region: a short loincloth of black-indigo cloth (#1f1b2b) with a pale pattern, and below it the tattooed thighs, the same black-indigo filled with pale scrollwork 

### `thighTattoo(from, to, s, line, reach)`

```
a thigh's tattoo: the dark ground along the bone, pale scrolls inside it, and the band above the knee.
"reach" is "long" for the sak kha yao, from the waist to the knee and a little below; otherwise the
sak kha kom, which stops short of the knee
from: the thigh's top, to: the knee, each [x, y] in pixels of the sheet (the pen's frame must be the
sheet's); s: the doll's scale; line: lineOf(doll). Returns nothing: it draws with pen.
e.g. thighTattoo([hip[0] + 20 * s, hip[1]], xy(J.kneeA), s, line, "long");
```

### `puman(x, y, more)`

```
puman(x, y, more) draws the pu man, the whisperer of the Wat Phumin mural, standing on (x, y), at the
clock's second, with his shoulder cloth and the red cloth end at his hip moving on their own.
  x, y   where his feet stand, pixels of the sheet
  more   any of person()'s look keys (the list above person() in oldcartoon.js), over CAST.puman
         (size 1.35, smile 0.7, turn 0.3, tilt -0.04 when left out): size, step (walking), at (where
         he looks), handA, handB, turn, smile, mouth, id, or a pose from poseAt(); and his own key
         tattoo   "long": the tattoo to the knee and a little below (sak kha yao); left out, to
                  mid-thigh (sak kha kom)
         Nothing when left out: he stands as CAST.puman is.
Returns nothing: it draws with pen. It keeps his chains and joints in DOLLS[id] from frame to frame
(id: more.id, or "puman" and his number among the paperdolls drawn this frame, from 0), so draw him
every frame, in the same order or with an id; a cut (the clock jumping) hangs the cloth again.
Needs oldcartoon.js and paperdoll.js loaded before this file.
e.g. puman(760, 820, {size: 1.85, step: t * 1.1, at: [1400, 300], smile: 0.5, tattoo: "long"});
```

## fonlep.js

fonlep.js - the fingernail dancer: a paperdoll on the kit (see paperdoll.js).  Read from a painting of a fon lep dancer (ฟ้อนเล็บ, the Lanna fingernail dance) on 2026-10-12. Nothing of the painting is copied: these are what it shows, as rules, with the numbers measured on it (1080 px square, the head 220 px from chin to crown). 1. Flat colour inside a fine dark line, 2 to 3 px: about 1/90 of the head. (The kit's pen is 1/50 of the head at film size and 1/100 at size 2.) Shade is a flat darker band on the far side of a fold, never a gradient. 2. The palette is the thangka's, as the notebook's sources name it: vermilion, a darker red in the folds, malachite green, gold, lamp black, pale skin. Measured: blouse #e84f37 (shade #a9232b), scarf #cd262b (folds #a42324), green #3d7a3e (dark #1f4a24), gold #d9b24a (dark #8a6a2a), black #07080c, skin #ecddd4, hair #26252c. 3. A vermilion blouse with a gold-trimmed V neck; the sleeves end in a green cuff with gold edges, and gold bangles over it. 4. A long red scarf: over the far shoulder, across the body, gathered on the raised forearm, and hanging from there down the back to the knee; its last quarter a green panel with gold bands; its ends 

### `fonlepStageBelt(hips)`

```
the painting's belt and hip band, in the waist's frame, on the stage dress
hips: hipsOf(doll), with the pen already slanted by it. Returns nothing: it draws with pen.
e.g. fonlepStageBelt(hipsOf(doll));
```

### `fonlepSilverBelt(hips)`

```
a silver plate belt (tai aeo), as Lanna women wore over the sin's head:
square links hooked one to the next, in the waist's frame
hips: hipsOf(doll), with the pen already slanted by it. Returns nothing: it draws with pen.
e.g. fonlepSilverBelt(hipsOf(doll));
```

### `fonlepTube(ex, ey, wx, wy)`

```
a tube sleeve over the forearm: from 4 above the wrist (the bangles show) to
the elbow, 10 wide all the way; filled, then lined along its edges and its
hem only, so no seam crosses the elbow
(ex, ey) the elbow and (wx, wy) the wrist, as onArm() is given them, in the waist's frame. Returns
nothing: it draws with pen.
e.g. fonlepTube(ex, ey, wx, wy);
```

### `fonlep(x, y, more)`

```
stage: true dresses her as the painting does, over the cast member and under the scene's own keys
fonlep(x, y, more) draws the fon lep dancer standing on (x, y), at the clock's second: in profile,
the long brass nails, the bun ringed with flowers, tube sleeves and a silver plate belt; on the
stage dress, the scarf, the bead strands and the belt move on their own.
  x, y   where her feet stand, pixels of the sheet
  more   any of person()'s look keys (the list above person() in oldcartoon.js), over CAST.fonlep
         (size 1.3, turn -1, tilt -0.45, smile 0.6 when left out): size, step, at (where she
         looks), handA, handB, wristA, wristB, turn, tilt, mouth, id, or a pose from poseAt()
         (TRACK in dance_track.js, FINGER_DANCE in finger_dance.js); and her own key
         stage  true: the painting's dress (FONLEP_STAGE, above) laid over the cast member before
                "more": the long scarf from the forearm, green cuffs, bead strands, the hair tail,
                the black skirt with its belt and hip band. Left out, the dress the sources give
         Nothing when left out: she stands as CAST.fonlep is.
Returns nothing: it draws with pen. It keeps her chains and joints in DOLLS[id] from frame to frame
(id: more.id, or "fonlep" and her number among the paperdolls drawn this frame, from 0), so draw her
every frame, in the same order or with an id. "more" is not changed. Needs oldcartoon.js and
paperdoll.js loaded before this file.
e.g. fonlep(300, 820, Object.assign({size: 1.85, at: [700, 60], stage: true}, poseAt(t, TRACK, 0)));
```

## apsara.js

apsara.js - the celestial dancer of the Siamese stage: a paperdoll on the kit (see paperdoll.js).  Read from a second painting of a Thai dancer on 2026-10-12, seen from the front and a little to one side. Nothing of the painting is copied: these are what it shows, as rules, with the numbers measured on it (a 477 by 597 screenshot; the face 83 px from hairline to chin, 55 px wide).  She is not Lanna (2026-10-13): the strapless bodice, the crown with its finial, the hip cloth and the chain belt are the Central Thai or Khmer celestial dancer of the classical stage. The Lanna murals draw their celestials in a tall pointed crown with ear flanges, a fitted long-sleeved jacket, a collar piece and a pha nung with a tail; that figure is still to be built (docs/kit/paperdolls.md, "the characters still to build"). 1. A flat orange ground (#cd6a3c), and the figure on it alone: the manner of a thangka's red ground. Flat colour inside a fine dark line. 2. White skin (#f8f7fb), black hair (#1e1b24) pulled smooth under the crown; gold (#d9b045, dark #9a6a1e) for everything that shines. 3. The face, three-quarter: the eyes at the middle of the face's height, each a third of its width long, the far 

### `tongue(P, s, line, face)`

```
The white hip cloth, from its chain: a tongue that hangs from the near hip
to mid-thigh and curls up and outward at its end, as the painting folds it,
with a gold edge along both sides and a fold down its middle. "face" is the
way she faces, so the curl turns away from her body.
P: the "tongue" chain's points, sheet pixels; s: doll.scale; line: lineOf(doll). Draws with pen.
e.g. tongue(doll.chains.tongue.points, doll.scale, lineOf(doll), 1);
```

### `apsara(x, y, more)`

```
apsara(x, y, more) draws the celestial dancer of the Siamese stage (not Lanna) standing on (x, y), at
the clock's second: crown, bodice, chain belt; the two ends of her sabai, the white hip cloth and the
six bead strands from the crown move on their own.
  x, y   where her feet stand, pixels of the sheet
  more   any of person()'s look keys (the list above person() in oldcartoon.js), over CAST.apsara
         (size 1.3, turn 0.4, tilt -0.05, sit 0.25, smile 0.5 when left out): size, step, at (where
         she looks), handA, handB, turn, mouth, id, or a pose from poseAt() (TRACK in dance_track.js).
         She has no keys of her own. Nothing when left out: she stands as CAST.apsara is.
Returns nothing: it draws with pen. It keeps her chains and joints in DOLLS[id] from frame to frame
(id: more.id, or "apsara" and her number among the paperdolls drawn this frame, from 0), so draw her
every frame, in the same order or with an id. Needs oldcartoon.js and paperdoll.js loaded first.
e.g. apsara(760, 820, Object.assign({size: 1.85, at: [560, 120]}, poseAt(t + 20, TRACK, 0)));
```

## finger_dance.js

finger_dance.js - the fingernail dance of the north, ฟ้อนเล็บ (fon lep), for the kit: its poses as numbers, the order they come in, and fingerDancer(), one of the kit's people dancing it. Load it after oldcartoon.js:  <script src="oldcartoon.js"></script> <script src="finger_dance.js"></script>  Read by eye (owner, 2026-10-16: "Look at that video and see if you can animate some finger dancers to move like that") from a performance of some hundreds of dancers at the Three Kings Monument, Chiang Mai, in 2015: YouTube WGAjuI6bNhw, "Incredible Lanna Style traditional dance performance in Chiang Mai Thailand 2015", by 55Secrets Travel. The video is not here and nothing of it is copied: only what the dancers do, written down as numbers.  It was first read by machine, as dance_track.py read a dancer before: MediaPipe's pose model, the full one and then the heavy one, whole frames and a crop that followed one dancer. It could not read these dancers: silk sashes over white sleeves, arms held out stiff and rows of dancers in the same colours behind. Their arms came out hanging at their sides, or a wrist above a shoulder where it was plainly below, and a follow slid onto the half-hidden dance

### `fingerDancer(x, y, dress, more, late)`

```
One dancer at (x, y), the ground under her, dancing at the kit's second "clock". "dress" is one of
FINGER_DRESSES' names; "more" is any of a person's look keys (size, face, id ...), over the dance's.
"late" is seconds added to her clock, so a troupe is together but not one figure copied.
Gives back where person() drew her joints.
  x, y   where her feet stand, pixels of the sheet
  dress  "blue", "pink" or "cream" (FINGER_DRESSES); anything else is "blue"
  more   look keys over the dance's own (the pose, step, sit, sway): size, id, face ...; or nothing
  late   seconds, 0 when left out; the dance goes round every 32 seconds
Returns person()'s joints ({shoulderA, wristA, hip, kneeA, ...}, pixels of the film). She is the
kit's "dancer" cast member, not a paperdoll: it needs only oldcartoon.js. A troupe needs an id each.
e.g. fingerDancer(400, 900, "pink", {size: 1.2, id: "dancer-0-1"}, -0.05);
```

## dance_track.js

The dancer's moves, read from the reference video by dance_track.py (MediaPipe Pose), 804 frames at 10 a second: [second, pose] for the kit's poseAt().

# Tools (Python, from the command line)

## kit/api_index.py

```
api_index.py - docs/api.md: every function of the kit and every tool, with what its comments say, on one page.

    python kit/api_index.py            # from the repository: writes docs/api.md

For an AI agent (or anyone) using the kit as a set of tools: each module beside the kit (kit/*.js), what its first
comment says it is, then each of its top-level functions, as it is called (its signature) with the comment written
above it; each command-line tool (kit/*.py, kit/checks/*.py, maker/cartoon_maker_assets/film.py) with its own
description, the docstring at its top, and each of its functions with the first line of its docstring. The comments
are the source: this page is made from them, so run this again after a function or its comment changes. Needs
only Python 3.
```

- `head_comment(lines)`: The file's first block of // lines: what the module is.
- `functions_of(lines)`: Each top-level function: its signature line and the // block right above it.
- `js_section(path)`: (no docstring)
- `py_section(path)`: (no docstring)
- `main()`: (no docstring)

## kit/caption.py

```
caption.py - a line in the kit's subtitle style, alone on a clear 1920 x 1080 picture, to lay over a video.

    python caption.py thanks.png "ขอบคุณเป๋นพิเศษเจ้า Jing's Kitchen" "特别感谢 Jing's Kitchen" "Special thanks to Jing's Kitchen"
    python chain.py series.mp4 a.mp4 b.mp4 tale.mp4 --over thanks.png,890.5,897.3

For words that come after a film is rendered: drawn by the kit's own subtitle() (oldcartoon.js: the big line, and
the small one under it), in Chrome as render.py draws, onto a clear sheet, so it is the same as the film's own
subtitles. Given more than two lines, every line but the last is a big one, stacked up from the subtitles' place
(a line in each of three languages: Kam Mueang, Chinese, then English small under them), and the last is the small
one. chain.py --over lays it over the joined film from one second to another, fading in and out, as the films are
encoded again: nothing of the film is rendered again.

It needs Google Chrome (through Playwright). It writes the PNG where it is named (clear but for the
words) and a page out/caption_page.html beside this file while it draws, removed after. It ends with
exit code 0; with fewer than two arguments it prints this and ends with exit code 1.
```

- `main()`: The command line: caption.py OUT LINE [LINE...]: draws the lines with the kit's subtitle() and saves them.

## kit/chain.py

```
chain.py - join whole films one after another into one video: a series' opening, a studio's card, a tale.

    python chain.py series.mp4 lanna_sash.mp4 sls_intro.mp4 maeng.mp4
    python chain.py series.mp4 lanna_sash.mp4 sls_intro.mp4 maeng_silent.mp4+maeng.wav    # a film and its sound
    python chain.py series.mp4 a.mp4 b.mp4 c.mp4 --over thanks.png,893.2,899.5   # a picture laid over, seconds of the whole
    python chain.py series.mp4 a.mp4 b.mp4 c.mp4 --fade 1,0.75   # a fade through black where a meets b

Films made at different times are encoded differently, and a video joined from them without encoding it again can
stop playing where one meets the next: so they are encoded again, once, as render.py encodes (each film 1920 x 1080
at 30 frames a second, as render.py makes them). A film given as VIDEO+SOUND takes its sound from the WAV, as
scenes.py lays a film's sound over it. Each film's sound is kept as it was mastered (the kit's films are all brought
to -14 LUFS); a film with no sound gets silence. It says where each film starts in the joined one: what a page needs
to know to do something during one of them (lanna_cartoon's fireflies, over the studio's card). --over PICTURE,FROM,TO
lays a clear picture (caption.py's words, in the kit's subtitle style) over the joined film from one second of it
to another, fading in and out over 0.4 s (or PICTURE,FROM,TO,FADE: 0, none): words added after the films were
rendered, without rendering them again; or one frame put right, with the frame after it laid over it, unfaded.
--fade JOIN,SECONDS fades through black where two films meet (JOIN 1 is where the first meets the second): the
last SECONDS of the one before fade out, picture and sound, and the first SECONDS of the one after fade in (owner,
2026-10-20: "When switching from the intro to the SLS scene fade out and back in over a second or two to give the
scenes a transition"). The fades are taken from the films' own ends, so nothing in the joined film moves.

It needs ffmpeg and ffprobe on the PATH. It writes the joined film where it is named, and prints the
second each film starts at in it. It ends with exit code 0; 1 with a message when ffmpeg stops; with
fewer than two films it prints this and ends with exit code 1. ffprobe failing on a
film stops it with a CalledProcessError.
```

- `probe(path, what)`: What ffprobe says of a file, as a dict: path, and what the list of ffprobe's words what asks for.
- `main()`: The command line: chain.py OUT FILM [FILM...] [--over PICTURE,FROM,TO[,FADE]] [--fade JOIN,SECONDS].

## kit/dance_track.py

```
dance_track.py - read a dancer's moves from a video with MediaPipe Pose, and write them as the
kit's poses: dance_track.js, a TRACK of [second, pose] the dance film plays.

    python -P dance_track.py dance.webm pose_landmarker_full.task dance_track.js 10 face_landmarker.task hand_landmarker.task

The model file is Google's pose_landmarker_full.task (storage.googleapis.com/mediapipe-models/
pose_landmarker/pose_landmarker_full/float16/latest/). The video is the reference the owner gave;
neither is in the repo. With a hand model as well (hand_landmarker.task, from the same place), each
hand's fingers: how far each is curled, read from the 21 points of the hand nearest each wrist.

Each frame gives the joints of the dancer. From them, for the kit's person():
  handA, handB   each wrist as a direction from its shoulder, in the person's units: A is the
                 arm on the picture's right (the dancer's left), B the one on the picture's left
                 (the torso, hip to shoulder, is 112 in the kit)
  bend           how far the torso leans from upright
  tilt           how far the head tilts from the torso
  sit            how bent the knees are (0 straight, 1 a deep half-sit)
  raise          [leg, how high, how far forward] when one foot is well above the other
  turn           how square to the camera the shoulders are (1 face on)
  shoulders      how far the line of the shoulders is tipped: above 0 when its end on the
                 picture's right is the lower one. (The kit tips the line of the hips the other
                 way by rule. Measured, this dancer's hips tipped the same way as her shoulders
                 more often than not: 36 of 115 clearly tipped poses were opposite.)
  fingersA, fingersB
                 five curls, 0 straight to 1 curled: the first finger, the middle, the next,
                 the little finger, then the thumb (from the hand model)
With a face model as well (face_landmarker.task, from the same place), the eyes: where the
irises look, blinks, raised brows, a smile, an open mouth, read from a crop round the face.
Also a few frames with the joints and irises drawn on them, to check the tracking by eye.

It needs opencv-python, mediapipe and numpy; run it with python -P, as above (-P keeps this folder off
the module path). Arguments: VIDEO POSE_MODEL OUT.js FPS [FACE_MODEL [HAND_MODEL]] (FPS: the frames a second
read from the video). It writes OUT.js, and check_N.jpg and face_N.jpg (frames marked to check by eye) in the
folder it is run from. It ends with exit code 0, or 1 when no dancer is found in any frame.
```

- `angle(a, b, c)`: the angle at b, in degrees
- `line_tip(pts, left, right, shoulder_max)`: How far a line across the body is tipped, in radians: above 0 when its end on the picture's
- `pose_of(pts, width, height, shoulder_max)`: the kit's pose from one frame's landmarks (x, y in pixels)
- `curl_of(pts, chain, full)`: 0 straight to 1 curled: the bends at the two outer joints, added
- `hands_of(hander, frame, pts, width, height)`: the curls of each hand: {"A": [...] or None, "B": [...] or None}. A hand is small in a
- `face_box(pts, width, height)`: a square round the face, from the pose's nose and ears
- `face_of(facer, frame, box)`: the kit's face fields from one frame, or None when no face is found
- `main()`: The command line (see this file's docstring): track the dancer frame by frame, smooth the joints over

## kit/howl.py

```
howl.py - a creature's howl, synthesized from nothing but numbers: no recording goes into it.

    python howl.py outline.json howl.wav

The outline (JSON) says how the howl goes:
    "seconds"   how long it lasts
    "pitch"     [[second, hz], ...]: the voice's pitch, point to point (a howl rises, holds, and falls away)
    "loud"      [[second, 0 to 1], ...]: how loud, point to point
    "vowel"     [[second, 0 to 1], ...]: the mouth, from "oo" (0, nearly shut) to "ah" (1, wide open)
    "growl"     0 to 1: a rough voice under the tone, half its pitch (a big throat)
    "breath"    0 to 1: breath through it
    "wobble"    [hz, depth in semitones]: the voice's waver
    "size"      1, or more for a bigger throat: the vowel's resonances lower by that much
    "cave"      [seconds, 0 to 1]: an echo, how long it rings and how much of it is heard
    "seed"      for the small unevenness of a living voice

Or, for several howling together (a wolf pack round a creature), the outline is {"voices": [...], "cave": ...}:
each voice an outline as above, with "at" (the second it starts) and "gain" (how loud, 0 to 1; a far wolf is
quieter), all mixed and then echoed by the one "cave".

It writes a mono 44.1 kHz WAV. Each part is a plain rule: a train of pulses glides along the pitch (a voice); a
pulse train at half the pitch, mixed in by "growl", roughens it; noise is breath; three resonances move between the
"oo" and the "ah" (formants); an echo of decaying noise rings after it (a cave). Needs numpy and scipy.

It writes the WAV where it is named and prints its length in seconds; exit code 0. A missing outline
key that has no default ("seconds", "pitch", "loud") stops it with a KeyError.
```

- `track(points, times)`: A value at every sample, from [[second, value], ...], joined smoothly (eased between the points).
- `pulses(hz, rng, jitter)`: A voice's pulses along a pitch: a sawtooth softened to a glottal shape, its period a little uneven.
- `resonance(signal, centre, width)`: One resonance (a two-pole band filter) that moves: filtered in blocks of 256 samples, each with its own
- `cave(signal, seconds, amount, rng)`: An echo: the sound once more through a ring of decaying noise, darker as it fades.
- `howl(outline, echo)`: One voice from its outline (the keys in this file's docstring): its samples, a numpy array.
- `chorus(outline)`: Several voices mixed, each from its own second at its own loudness, then the one echo over them all.
- `main()`: The command line: howl.py OUTLINE.json OUT.wav; a pack ("voices") goes through chorus(), one voice through howl().

## kit/lanna_music.py

```
lanna_music.py - a Thai-style tune for lanna.html, saved as lanna.wav.

    python lanna_music.py

The instruments of a small Thai band, each made from sine waves: a ranat
(a wooden xylophone) plays the tune, small cymbals (ching) keep the time,
a drum marks the beat, and a low string holds the chord. The tune is written
out by hand below, one letter for one beat. lanna_sing.py adds the voice.

It needs numpy. It writes lanna.wav in the folder it is run from (mono, 16-bit, 44.1 kHz), prints its
length, and ends with exit code 0.
```

- `tone(frequency, seconds)`: A sine wave: (the time of each sample in seconds, its value from -1 to 1), as two numpy arrays.
- `ranat(frequency)`: One note of the ranat, the wooden xylophone: a knock and a note that dies within a second.
- `ching(open_sound)`: One stroke of the small cymbals: a ringing "ching" when open_sound is true, a damped "chap" when not.
- `string(frequency)`: A low plucked string that holds the chord: frequency in hz; the samples, 1.8 beats long.
- `drum(noise, deep)`: One stroke of the drum: a thump with a little hiss on top of it, 0.22 s.
- `add(track, sound, at_second)`: Add sound into track from at_second on, cut where the track ends. Changes track; gives back nothing.
- `compose()`: The whole tune as one numpy array of samples, from TUNE, BARS and CHORDS, faded at the end, peaking at 0.8.
- `save(track, name)`: Write track (samples from -1 to 1) as a mono 16-bit WAV file called name. Gives back nothing.
- `main()`: The command line: compose the tune, save it as lanna.wav, print its length.

## kit/lanna_sing.py

```
lanna_sing.py - sing the Thai words over lanna.wav, saved as lanna_song.wav.

    python lanna_music.py
    python lanna_sing.py

No singer is recorded, and no music model is used. A Thai computer voice
says each syllable once. singer.py then sings each syllable on the note it
should be sung on, for nearly one beat, and this file lays it on the music.

The lines of the song are not written here. They are the film's own list,
CUES in lanna.html, which also moves the mouths and writes the words under
the picture: one list, so the voice and the picture cannot drift apart.

It needs the internet for the voice (edge-tts), librosa to read the voice's
sound, pyworld, which singer.py sings with, and Google Chrome with
playwright, to read the list out of the film's page.

Run it in the folder that holds lanna.html and lanna.wav (lanna_music.py writes it there). It writes
lanna_song.wav there (mono, 16-bit, 44.1 kHz) and keeps each syllable the voice said in spoken/, and ends
with exit code 0. When the voice service fails eight times for a syllable, librosa cannot read the missing
file and it stops with that exception.
```

- `cues_of(page_file)`: The lines of the song, from the film's own list: for each line, the
- `note_on(beat)`: the note the tune plays on a beat, or the last one before a rest
- `spoken(syllable)`: The voice saying one syllable, as a list of numbers.
- `sung(syllable, frequency, before)`: One syllable, sung on the note for nearly one beat: a little short of
- `main()`: The command line: read the CUES of lanna.html, sing each syllable over lanna.wav, save lanna_song.wav.

## kit/music.py

```
music.py - compose 32 seconds of calm music and save it as lanterns.wav.

    python music.py

No instrument is recorded. Every sound is a sine wave that this file adds up:
a soft chord under everything, and a plucked tune on top of it.

It needs numpy. It writes lanterns.wav in the folder it is run from (mono, 16-bit, 44.1 kHz), prints
its length, and ends with exit code 0.
```

- `tone(frequency, seconds)`: A sine wave: (the time of each sample in seconds, its value from -1 to 1), as two numpy arrays.
- `pad(frequency, seconds)`: A soft, slow note that swells in and fades away: the samples, a numpy array "seconds" long.
- `pluck(frequency)`: A note like a plucked string, loud at once and dying away: the samples, 2.4 s.
- `add(track, sound, at_second)`: Add sound into track from at_second on, cut where the track ends. Changes track; gives back nothing.
- `compose()`: The whole 32 seconds as one numpy array of samples: the chords, the tune (always the same, from a seeded
- `save(track, name)`: Write track (samples from -1 to 1) as a mono 16-bit WAV file called name. Gives back nothing.
- `main()`: The command line: compose the music, save it as lanterns.wav, print its length.

## kit/peek.py

```
peek.py - full-size crops of one figure on a kit page, beside the reference.

    python peek.py fonlep.html out.jpg --box 340 60 460 720 --ref reference_523.jpg 1 3.2 5.5

Each second named is drawn (the page pre-rolls the cloth itself), the box
(x y w h, screen pixels) is cut out at full size, and all the cuts stand in a
row after the reference, scaled to the same height.

It needs Google Chrome (through Playwright) and Pillow. --box is x y w h in screen pixels of the
1920 x 1080 picture (default 340 60 460 720); --ref-box crops the reference first. It writes one JPEG
where it is named and prints its size and the page's errors; exit code 1 when the page reported an error
(0 until 2026-10-21), else 0. It waits up to 180 s for the page to load (the hero film paints its forests as it loads), and for its web fonts.
```

- `shots(page_file, seconds, box)`: The box cut from the page's picture at each second named: (cuts, errors).
- `main()`: The command line: peek.py PAGE OUT [--box X Y W H] [--ref FILE [--ref-box X Y W H]] SECONDS...

## kit/render.py

```
render.py - turn a page that has draw(t) into a video file.

    python render.py hello.html hello.mp4
    python render.py lanterns.html lanterns.mp4 --audio lanterns.wav
    python render.py lanna.html scene.mp4 --from 12 --to 20     # only seconds 12 to 20

It opens the page in Chrome with no window, asks for one frame at a time,
takes a picture of each, and hands the pictures to ffmpeg. Then it says
what the page said: an error, or a warning from the kit (a name it does
not know, which changes nothing).

It needs Google Chrome (Playwright drives it: channel "chrome") and ffmpeg on the PATH. The page must
have draw(t), the switch rendering, and LENGTH or DURATION (the film's seconds), as every kit page does.
It writes the video where it is named, 1920 x 1080 at 30 frames a second (H.264; AAC sound with --audio),
and prints how many frames it made and how long that took. It ends with exit code 0; 1 when the page
reported an error (the video is made all the same) or when ffmpeg stopped (no video); 2 for arguments
argparse does not take. From Python: render.render(page, video, audio, start, end, fast, sets).
```

- `ffmpeg_command(video, audio, start, fast)`: The ffmpeg command that reads frames on its stdin and encodes them as render.py does: a list of words.
- `render(page_file, video, audio, start, end, fast, sets)`: Render a kit page to a video file, frame by frame, in Chrome with no window: gives back nothing.
- `main()`: The command line: read the arguments, check that ffmpeg and the sound file are there, render.

## kit/sash_music.py

```
sash_music.py - 82 seconds of music for sash.html, saved as sash.wav.

    python sash_music.py

Three seconds of silence first, for the still close-up before the music begins; then a soft chord under
everything and a plucked pentatonic tune on top; from the twentieth second a low drum on every beat and a
small ching on the strong ones, for the dancing scenes; an echo, a room, a fade at the end.

The tune is drawn beat by beat from one seeded chooser, so it is the same every time: a longer film adds
beats at the end and leaves the ones before as they were. sash_narrate.py lays the Kam Mueang voice over it.

The instruments (2026-10-16; the owner asked for a better-quality sound for the film, and said "it's good"
of this one): until then every sound was a sine wave added up, as in music.py, and the music had nothing
above 3 kHz, which is what made it sound like a toy. Now the tune is a plucked string (Karplus-Strong: a
burst of noise going round a delay line that averages as it goes), two strings a few cents apart as a
sueng's paired strings are; the chord a soft bowed tone with overtones and a slow vibrato; the drum has a
skin as well as a body; the ching is inharmonic partials that ring and fade. In stereo, with the echo bounced
between the ears and a room (noise dying away, darker as it dies). The notes and beats are the old ones.
Needs numpy, scipy and soundfile. sash.wav is 32-bit float, so sash_narrate.py mixes it without rounding.

It writes sash.wav in the folder it is run from (stereo, 32-bit float, 44.1 kHz), prints its length,
and ends with exit code 0. score.py imports its instruments (string, pad, drum, ching, room, place, lowpass).
```

- `lowpass(x, hz, order)`: x with what is above hz taken away (a Butterworth low-pass of the given order): a numpy array.
- `string(frequency, seconds, brightness, decay, seed)`: A plucked string (Karplus-Strong): a burst of noise going round a delay line that averages as it goes.
- `pluck(frequency, seed)`: One note of the tune, on two strings a few cents apart.
- `pad(frequency, seconds, detune)`: A soft bowed tone with overtones and a slow vibrato, swelling in and out.
- `drum()`: A low drum: a body falling in pitch, and the slap of its skin. The samples, 0.45 s.
- `ching()`: The small cymbals: inharmonic partials that ring and fade. The samples, 0.9 s.
- `room(seconds, seed)`: A room: noise dying away, darker as it dies, one impulse response per ear (sash_narrate.py uses it too).
- `place(track, sound, at_second, pan)`: Add a mono sound to a stereo track at a second, panned from -1 (left) to 1 (right).
- `tune()`: The tune, beat by beat, from one seeded chooser: for each beat, the
- `compose()`: The music as two rows, left and right, peaking at 0.8.
- `main()`: The command line: compose the music and write it as sash.wav (32-bit float), print its length.

## kit/sash_narrate.py

```
sash_narrate.py - tell the story of sash.html in Kam Mueang over sash.wav, saved as sash_voice.wav.

    python sash_music.py
    python sash_narrate.py --voice assistant --takes 4      # the Kam Mueang assistant's voice (since 2026-10-18)
    python sash_narrate.py <the Kam Mueang Voice extension's model folder> --takes 4    # or the extension's
    python render.py sash.html sash.mp4 --audio sash_voice.wav
    python sash_narrate.py --page maeng/film.html --music out/maeng_music/film.wav --spoken <folder> --out maeng.wav

The words are the film's own: the page is opened in Chrome with no window, as render.py opens it,
and asked for its WORDS: for each line, the seconds it shows, what the voice says and what is
written. Each line is spoken by the voice of the Kam Mueang Voice extension (say.mjs: Meta's MMS
Northern Thai, run by transformers.js as the extension runs it) once, and kept in spoken_km/ under a
name made from its words, so a line is spoken again only when its words change. With --voice assistant
the same model speaks as the Kam Mueang assistant speaks it (owner, 2026-10-18: "use the new assistant
voice"): in PyTorch (transformers' VitsModel, facebook/mms-tts-nod, its own settings), the line in pieces
of up to 150 letters with a quarter of a second between them; its takes are kept in spoken_km_assistant/.
The assistant also respells its answers by its speaker's rules: those are in the film's words themselves
(WORDS in sash.html), not here. Either voice draws its
timing from noise, and the same line is never quite the same twice. With --takes N each new line is
spoken N times and the take a speech recogniser (faster-whisper, medium, Thai) hears closest to the
words is kept: the takes differ, and one can be much clearer than another (four takes of one line
scored 0.57 to 0.72 of its letters heard back, the first take 0.47). Delete spoken_km/ to speak every
line again. Each line starts at its second.
The music is lowered while the voice speaks and comes back between lines, and fades over the film's
last two seconds. Then it says, line by line, how long the voice took and whether the line is over
before its words leave the screen.
With --spoken the lines were spoken already, elsewhere, one file a line: the page's WORDS give each line its id
as a sixth item (or, with no ids, 01.wav, 02.wav ... in order), and the folder has ID.wav for each (the film of the creature with four ears and five eyes:
Pan's voice, from her toolset's voice service, each line heard back by the voice project's listener first).

The voice's treatment and the mix (2026-10-16; the owner asked for a better-quality sound for the film,
and said "it's good" of this one). The voice speaks at 16 kHz, so it had nothing above 8 kHz, and the old
mix was mono at -17.5 LUFS. Now each line is resampled to 44.1 kHz (soxr), goes through VOICE_CHAIN (ffmpeg:
the mud at 260 Hz taken down, presence at 3.2 kHz lifted, harmonics above the voice's 8 kHz edge from
aexciter, gentle compression) and a touch of sash_music.py's room; the voice stays in the middle of the
stereo music; the whole is brought to -14 LUFS with true peaks under -1 dBTP (ffmpeg loudnorm, measured
first, then applied linearly) and written 24-bit stereo. Needs soundfile, soxr and ffmpeg besides.

The model folder is model/ in the extension (krueng.ai/downloads/kammuang_voice_chrome.zip,
unzipped); say.mjs needs "npm install" in this folder first.

What it writes: the mix where --out says (default sash_voice.wav beside this file: 24-bit stereo, 44.1 kHz,
-14 LUFS), each new line's take in spoken_km/ (or spoken_km_assistant/) beside this file, and prints a table of
the lines: when each starts, how long the voice takes, and "fits" or "TOO LONG by". It needs Google Chrome
(through Playwright) to read WORDS; node for say.mjs, or torch and transformers for --voice assistant;
faster-whisper for --takes above 1. It ends with exit code 0; 1 with a message when a --spoken file is missing;
2 when neither a model folder nor --voice assistant (nor --spoken) is given; ffmpeg or node failing stops it
with a CalledProcessError.
```

- `words_of(page_file, sets)`: The film's lines and its length, asked of the page itself; given the values render.py --set gave it.
- `voice_line(path, scratch)`: One spoken line at 44.1 kHz, through VOICE_CHAIN, with a touch of the room, peaking at VOICE.
- `master(track, out, scratch)`: -14 LUFS integrated, true peaks under -1 dBTP: ffmpeg loudnorm, measured first, then applied linearly.
- `file_of(text)`: Where a line's kept take is: SPOKEN/ the first 12 letters of the SHA-1 of its words .wav (a Path; makes nothing).
- `heard(text, sound_file, listener)`: how much of a line's letters the recogniser hears back, 0 to 1
- `say_as_assistant(jobs)`: Each [name, text] spoken as the Kam Mueang assistant speaks (its server.py, speak()): MMS Northern Thai in
- `say(jobs, model)`: [name, text] jobs, each spoken to SPOKEN/name.wav: by say.mjs in one run, or the assistant's way.
- `line_id(line, n)`: A line's name for --spoken: its id, WORDS' sixth item, or for a page whose WORDS have none its number, 01 on.
- `seconds_of(sound_file)`: How long a sound file lasts, in seconds (read from its header).
- `speak(lines, model, takes, fit)`: Every line not spoken yet, "takes" times; the clearest take is kept. lines: [text, room], room the seconds
- `main()`: The command line: read the page's WORDS, speak the lines not spoken yet (or take them from --spoken),

## kit/scenes.py

```
scenes.py - render a film one scene at a time, and join the scenes into one video.

    python scenes.py sash.html sash.mp4 --audio sash_voice.wav            # every scene not made yet, then the film
    python scenes.py sash.html sash.mp4 --audio sash_voice.wav --scene 3  # scene 3 again, then the film
    python scenes.py sash.html --list                                     # the scenes and their videos
    python scenes.py sash.html sash.mp4 --all --jobs 3                    # three scenes at a time

A page that lists its scenes in SCENES ([from, to, scene], as the kit's
film() takes them) is rendered one scene at a time, each scene into a video
of its own in a folder beside the page (sash_scenes/ for sash.html). A scene
whose video is there already is not rendered again. So after a change to one
scene, render that scene again with --scene and the film is joined from it
and the scenes made before: minutes, where the whole film takes half an hour.

Which scenes a change touches is for you to say. A change to one scene's
function touches that scene; a change to the kit, or to a set two scenes
share, can touch several, and --all renders every scene again. --list shows
each scene's video, and says which were made before the page, or a script
file it loads, last changed.

The pictures of each scene are rendered by render.py, from a jump of the
clock to the scene's first second, as a still is (the kit's settled() lets
what hangs and swings come to rest first). The scenes are joined without
encoding them again, and the sound is laid over the whole film at once, so
it has no seam where the scenes meet.

With --jobs, that many scenes are rendered at once, each by render.py in a
process and a Chrome of its own: about that many times sooner, while the
computer has the cores and the memory (a Chrome drawing the hero film holds
1 to 2 GB). Each scene is rendered as it is alone. A render's first frame
forgets what the page drew live while it loaded (the kit's settled() and
forget()), so a scene comes out the same each time it is rendered, alone or
not, but for Chrome's own drawing on the graphics card, which now and then
puts a dozen pixels of a frame a shade apart (village.html, 2026-10-21: 5 of
120 frames, 1 to 12 pixels each; before, 225 of 300 frames differed).

It needs Google Chrome and ffmpeg, as render.py does. It writes each scene's video in the folder
beside the page (PAGE_scenes/, or PAGE_scenes_fast/ with --fast, named NN_scene_FROM-TO.mp4), a list
scenes.txt for ffmpeg there, and the film where it is named. It ends with exit code 0, or 1 with a
message when the page has no SCENES, a scene number is not one of them, a scene was not made, or
ffmpeg could not join them.
```

- `scenes_of(page_file)`: The page's scenes, each [from, to, the name of its function] (seconds): opens the page in Chrome.
- `clip_of(folder, number, scene)`: The Path of one scene's video in folder: NN_name_FROM-TO.mp4 (makes nothing).
- `last_changed(page_file)`: When the page, or a script file it loads, last changed: the latest modification time, in seconds
- `show(scenes, clips, changed)`: Print one line for each scene: its number, name, seconds, video and whether that video is made, or made
- `join(clips, video, audio, folder)`: Join the scenes' videos into one film without encoding the pictures again, the sound laid over the
- `render_scene(page_file, part, start, end, fast)`: One scene into its file, in a process of its own (--jobs): what went wrong, or None.
- `main()`: The command line: list the scenes, or render those wanted and join the film.

## kit/score.py

```
score.py - music that follows a story's feelings: cues in, music out, in the hero film's sound.

    from score import compose, FEELINGS
    track = compose([[0, "wonder"], [9.4, "sad"], [21.0, "joy"]], seconds=30)

A film says what each moment feels (a cue: a second and a feeling's name, each until the next), and the music
turns with it: a moment before each cue it crosses over, in a second and a half, to that feeling's music. It is
the hero film's music (sash_music.py: its plucked sueng strings, its bowed chords, its drum and ching, its echo
and its room, imported from there, not copied), and "calm" is that film's own: its pentatonic tune on A, its four
chords. Every other feeling changes what that music does, by plain rules (FEELINGS below): which notes it plays,
how high, how often a string is plucked and whether its line climbs or falls, its chords, its drum and ching, how
long its notes ring, how loud it is.

Each feeling's notes are its own set of five (or four), and a set of feelings that are alike share theirs: the
calm and the gentle (A C D E G, the hero film's), the glad (G A B D E: a B), the royal (D E F# A B: an F#), the
wondering (A B C# E F#: a C#), the mysterious (A B C# D# F: whole tones), the sad (D F G A C: an F), the tense and the afraid (a
B flat against the A). So the notes of the music under a moment say which feeling it carries, and a check can hear
it (checks/score_check.py). Needs numpy, scipy and soundfile, as sash_music.py does.
```

- `hz(semitones)`: A note's frequency in hz, from semitones above (or below, when less than 0) the A of 220 hz.
- `chords(notes)`: A set's four chords, as frequencies.
- `feeling_music(name, seconds, seed)`: One feeling's music, "seconds" long: a stereo track, its tune, chords and drum by the feeling's rules.
- `compose(cues, seconds, seed)`: The music of a stretch of film "seconds" long whose feelings are "cues" ([[second, feeling], ...], each

## kit/sing_check.py

```
sing_check.py - hear the song's old voice and singer.py's, line by line.

    python sing_check.py                       # the lanna song, voices heard by the medium model
    python sing_check.py --model large-v3      # a better listener, slower
    python sing_check.py --out ../../../scratch   # where the sound files go (default: sing_check_out/)

For every line of lanna_sing.py it sings the syllables twice - the old way
(librosa, as lanna_sing.sung does) and the new way (singer.sing, WORLD) -
lays both voices on their own, and both over the band, and then:
  - hears each line of each voice with faster-whisper (Thai), and prints the
    words written beside the words heard, with the share of characters wrong
    (the listener is part of the measurement: Whisper's Thai is imperfect, so
    read the side by side, and trust a difference more than a number);
  - measures the pitch of every sung syllable against its note, in cents.
It writes the four sound files, so the owner can listen as well.

It needs what lanna_sing.py needs, and faster-whisper. Run it in the folder that holds lanna.wav. It
writes voice_old.wav, voice_new.wav, song_old.wav and song_new.wav into --out, and what it printed into
sing_check_output.txt in the folder it is run from. The song's lines are the film's own, lanna.html's CUES,
read as lanna_sing.py reads them (lanna_sing.cues_of: Chrome with no window); it read a list lanna_sing.py no
longer has, and stopped, until 2026-10-21.
```

- `sung_old(syllable, frequency)`: The old tuning, kept here as the "before": librosa's pitch_shift to the
- `character_error(written, heard)`: The share of the written characters that are wrong in what was heard.
- `cents_off(sound, frequency)`: How far the sung pitch is from the note, in cents, by its median.
- `build(method, length, lines)`: The voice alone, as long as the band, and the cents off for each
- `hear(model, sound, start, stop)`: What the listener hears in one stretch of a sound: the Thai text it writes down.
- `say(line)`: Print line and keep it in SAID, for sing_check_output.txt. Gives back nothing.
- `main()`: The command line: make --out, run the check, and write sing_check_output.txt even when it fails.
- `run(args, out)`: Build both voices, save the four sound files into out, then hear each line of each and print the share wrong.

## kit/singer.py

```
singer.py - a better singing voice for the songs: a spoken syllable taken
apart with the WORLD vocoder and put together again on the note.

    from singer import sing
    sound = sing(spoken("บ้าน"), 293.66, 0.475)      # one syllable, on G, one beat long

village_sing.py tunes a spoken syllable with librosa's pitch_shift and
time_stretch, as lanna_sing.py did until it took this file (2026-10-12).
Both have a cost: pitch_shift moves the
formants with the pitch, so a voice raised ten semitones sounds like a small
creature, and time_stretch stretches the consonant as much as the vowel, so
the start of every word smears. WORLD (Morise 2016; pyworld) splits a voice
into three things - the pitch (f0), the shape of the mouth (the spectral
envelope) and the breath in it (aperiodicity) - and puts them back together
with any pitch at all, and the mouth's shape kept. So this file:
  1. keeps the consonant at its own speed, and stretches only the vowel to
     fill the beat (the voiced frames, less the first 40 ms and the last 30);
  2. sings the vowel on the note, with a share of the syllable's own tone
     kept (Thai tones rise and fall; a singer bends toward them: "tone" is
     how much, 0 for a flat note), the way the old Thai recordings sing:
     the note is held nearly straight, with a vibrato of an eighth of a
     semitone at 6 Hz that grows in after 120 ms; a new note is reached by
     a slide from the note before it over the first 90 ms ("glide_from", the
     last note's frequency; without it, a scoop from a semitone below over
     45 ms); and every syllable is let go with a fall of a whole semitone
     over its last 120 ms ("release", the default; false gives half a
     semitone over 40 ms);
  3. fades the two ends shortly (8 ms in, 35 ms out), so the words are not
     clipped and the beats do not click.
The numbers in 2 were read from three public recordings of Thai singing
(a royal anthem sung in 1907 and in the 1950s, an Uttaradit folk song):
their sustained notes wobble 0.09 to 0.16 semitones at 5 to 7 Hz, their
notes are joined by slides of up to seven semitones over most of a second,
and their phrase ends fall. The result is still the computer voice, only
sung; sing_check.py hears the old voice and this one with a recogniser and
measures the pitch of both.
```

- `analyse(sound)`: A syllable as WORLD hears it: the pitch of each frame (0 where there is
- `between(frames, positions)`: Frames read at fractional positions, each a mix of the two it lies between.
- `sing(sound, frequency, seconds, tone, vibrato, glide_from, release, vibrato_hz)`: One spoken syllable sung on "frequency" (Hz) for "seconds", as a list of

## kit/sls_sound.py

```
sls_sound.py - the sounds of the Slow Life Studios card, high over the mountains at dawn: its music with the
wind under it (the kit's own, made by sounds.py), a red-billed blue magpie calling early on, and a flock of birds
passing softly in the middle (owner, 2026-10-21: the card became a misty mountain at dawn with the beings of the
Himmaphan flying; "Drop" the fireflies and the night's crickets and tokay, for wind and birdsong), and at its end a
white-rumped shama singing twice, where the tokay called before ("At the end of the video do two bird calls like the
way the tokay calls were but with a nice sounding bird call from a northern thai bird").

    python sounds.py wind magpie flock shama             # the kit's sounds, into out/sounds/ (once)
    python sls_sound.py music.wav sls_intro.mp4 out.mp4  # the card's music and video in, the card with its new sound out

The card's picture is copied as it is (no render); only its sound is mixed. The wind lies under the whole card,
faded in and out; the magpie (CC0, iNaturalist) at MAGPIE_AT, the flock (Gunter Koenigsmann, CC BY 4.0) at FLOCK_AT,
the shama (Utain Pummarin, CC BY 4.0) so its second song ends SHAMA_END before the card does; the music lowered
under the calls.

It needs ffmpeg on the PATH, numpy and soundfile, and wind.wav, magpie.wav, flock.wav and shama.wav in
out/sounds/ (sounds.py makes them). It writes the third file named (the second's picture, AAC sound) and prints
when each call comes in. Exit code 0; 1 with this text when it is not given three files, or when ffmpeg stops
(CalledProcessError) or a sound is missing.
```

- `mono(path, rate)`: A sound file read as one channel (the ears averaged) at "rate" samples a second, a numpy array.
- `place(mixed, sound, at, rate)`: Adds a one-channel sound into both ears of "mixed" from second "at"; what runs past its end is cut off.
- `main()`: The script (the module's text says how): reads sys.argv, writes the card with its new sound, prints a line.

## kit/sounds.py

```
sounds.py - the kit's sounds: voices for its creatures, each made by howl.py from an outline, never recorded.

    python sounds.py                       # every sound, into out/sounds/: NAME.wav and NAME.json, all.wav, list.js
    python sounds.py maeng-angry           # one sound (or several names)
    python sounds.py --list                # the names, what each is for

Each made sound is an outline: how the pitch, the loudness and the mouth go over time (see howl.py), written here
as numbers, so it is the kit's own, free to use as the kit is. A few are fetched instead (FETCHED): recordings
their makers gave to everyone, each named with where it is from and its licence, downloaded by this file and
never kept in the repository.
Open sounds.html after making them to hear each one beside what it is for.

The creature with four ears and five eyes (myth.js, the film in maeng/) has one voice of many throats (the owner,
2026-10-19: "The pack and voice should be one thing"): its own low, rough howl with a pack's voices inside it,
higher and smoother, that start with it, follow its rise and fall a few notes above, and keep a little out of step
with it and with one another, so that they sound as one wild voice and not as wolves answering. Its moods are the
story's: the night on the mountain, the snare, the crowd, the pen at night, the embers, the way home.

It needs numpy, scipy and soundfile; the internet, for a fetched sound not downloaded yet (each is kept
in out/sounds/ after); ffmpeg, for one soundfile cannot read (m4a, mpga). It writes into out/sounds/ beside this
file: NAME.wav (mono, 16-bit, 44.1 kHz) for each sound, NAME.json for each made by howl.py, all.wav (every sound,
1.2 s apart, only when no name is given) and list.js (SOUND_LIST, read by sounds.html). It ends with exit code 0,
or 1 with a message for a name it does not know; a download or ffmpeg that fails stops it with an exception.
```

- `creature(seconds, pitch, loud, vowel)`: One outline of the creature's own voice (CREATURE's growl, breath, wobble and size), for howl.py.
- `many(lead, pack, rough)`: One voice of many throats: the creature's own (lead), and the pack's within it, each following the lead's
- `maeng_base()`: The creature's howl on the night mountain: a chorus outline (for howl.chorus), 4.6 s.
- `maeng_angry()`: Caught in the snare: three short roars, the last the biggest: a chorus outline.
- `maeng_afraid()`: The crowd round its pen: four yelps breaking upward, then a thin wavering cry: a chorus outline.
- `maeng_sad()`: Alone in the pen at night: a slow falling howl that catches like a sob: a chorus outline, 5.4 s.
- `maeng_happy()`: Eating the embers: three quick bouncing howls that rise at the end: a chorus outline.
- `maeng_home()`: Running home into its cave: one long howl that starts low and lifts: a chorus outline, 6 s.
- `crickets()`: Field crickets in the grass at night, a chorus of seven: each sings chirps of three or four pulses (a pulse
- `wind()`: Wind high on a mountain at dawn: noise made soft and low (through low-passes at 350 Hz and 1100 Hz, mixed
- `mouse_squeak()`: A mouse's squeaks: three short whistles, each rising then falling between 3.5 and 6.5 kHz, 50 to 80 ms.
- `fetch(name, out)`: A fetched sound: the recording downloaded once (kept in out/sounds/ under its own name), cut, as a WAV.
- `make(name, out)`: Make one sound by its name and write it into out: its samples, a numpy array at RATE.
- `main()`: The command line: sounds.py [NAME...] | --list. Makes the sounds named (every one when none is), writes

## kit/stills.py

```
stills.py - look at single frames of a film before rendering all of it.

    python stills.py village.html sheet.jpg 2 10.25 17.8 28

It opens the page in Chrome with no window, asks for the picture of each
second you name, and saves them all on one sheet. Six frames show most
mistakes, and they take seconds, not minutes.

It needs Google Chrome (through Playwright) and Pillow. The page must have draw(t) and the switch
rendering. It writes one JPEG where it is named: two frames a row, each 960 x 540, in the order the
seconds are given; then prints the kit's warnings and the page's errors. It ends with exit code 1 when
the page reported an error, as render.py does (0 until 2026-10-21), else 0.
```

- `frames(page_file, seconds)`: The page's picture at each second named: (pictures, errors, warnings).
- `sheet(pictures)`: One picture with all of pictures on it, two a row, each scaled to 960 x 540: a PIL image.
- `main()`: The command line: stills.py PAGE OUT SECONDS...; saves the sheet and prints what it found.

## kit/village_music.py

```
village_music.py - a Thai-style tune for village.html, saved as village.wav.

    python village_music.py

The instruments of a small Thai band, each made from sine waves: a ranat
(a wooden xylophone) plays the tune, small cymbals (ching) keep the time,
a drum marks the beat, and a low string holds the chord. The tune is written
out by hand below, one letter for one beat. village_sing.py adds the voice.

It needs numpy. It writes village.wav in the folder it is run from (mono, 16-bit, 44.1 kHz), prints its
length, and ends with exit code 0.
```

- `tone(frequency, seconds)`: A sine wave: (the time of each sample in seconds, its value from -1 to 1), as two numpy arrays.
- `ranat(frequency)`: One note of the ranat, the wooden xylophone: a knock and a note that dies within a second.
- `ching(open_sound)`: One stroke of the small cymbals: a ringing "ching" when open_sound is true, a damped "chap" when not.
- `string(frequency)`: A low plucked string that holds the chord: frequency in hz; the samples, 1.8 beats long.
- `drum(noise, deep)`: One stroke of the drum: a thump with a little hiss on top of it, 0.22 s.
- `add(track, sound, at_second)`: Add sound into track from at_second on, cut where the track ends. Changes track; gives back nothing.
- `compose()`: The whole tune as one numpy array of samples, from TUNE, BARS and CHORDS, faded at the end, peaking at 0.8.
- `save(track, name)`: Write track (samples from -1 to 1) as a mono 16-bit WAV file called name. Gives back nothing.
- `main()`: The command line: compose the tune, save it as village.wav, print its length.

## kit/village_sing.py

```
village_sing.py - sing the Thai words over village.wav, saved as village_song.wav.

    python village_music.py
    python village_sing.py

No singer is recorded, and no music model is used. A Thai computer voice
says each syllable once. This file then tunes each syllable to the note it
should be sung on, makes it one beat long, and lays it on the music.

It needs the internet for the voice (edge-tts), and librosa to tune it.

Run it in the folder that holds village.wav (village_music.py writes it there). It writes
village_song.wav there (mono, 16-bit, 44.1 kHz), keeps each syllable the voice said in spoken/, and ends with
exit code 0. When the voice service fails eight times for a syllable, librosa cannot read the missing file and
it stops with that exception.
```

- `spoken(syllable)`: The voice saying one syllable, as a list of numbers.
- `sung(syllable, frequency)`: One syllable, moved to the note and made one beat long.
- `main()`: The command line: sing each syllable of LINES over village.wav, save village_song.wav.

## kit/checks/arms_check.py

```
arms_check.py page.html [from to]  - check a film's arms, frame by frame at 30 a second, as render.py draws it.

    python checks/arms_check.py lanna.html

It draws every frame with no window and notes, for every arm, where the elbow and the wrist are, measured from the
shoulder. Then it counts what an arm cannot do, by the kit's own rules (SHOULDER, ELBOW, bendOf in oldcartoon.js):
  flips     an elbow that moves more than 40 units between two frames while its hand moved less than 12 (an arm
            is followed from frame to frame by the name arm() is given, so the order arms are drawn in may change)
  inward    an upper arm pointing into the inward arc toward the spine: between 30 degrees in from straight down and
            20 degrees in past straight up (angles from straight down, growing toward the arm's own side)
  folded    a forearm folded more than 150 degrees from straight
  sweeps    the most any upper arm turns in one frame, in degrees, while its hand moved less than 12 units
An upper arm drawn shorter than 25 units (its bone is 62) is pointing at us, not across the picture: it is left out of
"inward", "folded" and "sweeps". A film is clean when the first three are 0. kit_check.py runs this on every page.

It needs Google Chrome (through Playwright). The page is named from the folder it is run in; "from" and
"to" are seconds (default the whole page). It prints the counts and up to three of each fault, and ends with
exit code 1 when a film is not clean (a flip, an inward or a folded arm) or the page reported an error, else 0
(0 whatever it found, until 2026-10-21; kit_check.py imports measure() and fails a page on its own KNOWN).
```

- `turn_of(ex, ey, outward)`: the upper arm's angle: 0 straight down, 90 out to its own side, 180 up, below 0 in toward the spine
- `measure(page, start, end)`: Draw an open page from "start" to "end" (its whole length unless told) and count its arms' faults.
- `report(name, found, errors)`: Print what measure() found on one page: the counts, the faults by second, and the first three of each.
- `main()`: The command line: arms_check.py PAGE [FROM TO]: open the page, measure its arms, print what was found.

## kit/checks/floor_check.py

```
floor_check.py [page.html]  - does the seat of one who sits stay on the ground?

    python checks/floor_check.py                 # floor.html

A look's floor seats a figure on the ground. The page keeps, in SEATS, where each figure's hips, a knee and its
neck came to on the sheet in the frame just drawn. Every frame of the page is drawn. For each figure it prints how
far each of the three travelled over the page, in pixels of the sheet: the hips and the knee should hardly move,
and the neck should, because the beat moves what is above the seat. Hips that travel more than SEAT pixels, a
knee that travels more than KNEE, or a neck that travels less than the hips, is a failure (exit code 1).

It needs Google Chrome (through Playwright). The page is named from the kit's folder (kit/), not from the
folder it is run in, and must keep SEATS. It prints one line a figure; a kit warning or a page error is a
failure too.
```

- `travel(b)`: How far a point travelled over the page: the larger side of its box [min x, min y, max x, max y], in pixels.
- `main()`: The command line: floor_check.py [PAGE]: draw every frame, print how far each figure's seat travelled.

## kit/checks/frame_time.py

```
frame_time.py - where a frame's time goes, and how many figures lie off the sheet.

    python checks/frame_time.py lanna.html            one frame a second
    python checks/frame_time.py lanna.html --step 0.5 two a second

It opens the page like stills.py, wraps person() and crowd() to time them and to
count the figures whose place, through the pen's transform, lies outside the
sheet by more than their own height, then calls draw(t) across the film and
prints, per second, the frame's milliseconds, the share spent in figures, and
the figures drawn and off the sheet. Run it before and after a speed change:
the numbers are the reason for the change, or the reason not to make it.

It needs Google Chrome (through Playwright). The page must have DURATION. It writes nothing, and ends with
exit code 0; the times are of this computer's Chrome, so compare runs on one computer only.
```

- `measure(page_file, step)`: Time the page's frames: one row for each second drawn, [second, frame ms, figures ms, crowd ms, figures, off].
- `main()`: The command line: frame_time.py PAGE [--step S]: print each frame's times and the means.

## kit/checks/frames.py

```
frames.py - what the checks share: a page's frames as pictures, and whether two pictures are the same.

    from frames import open_page, frame_at, differ

open_page(browser, page_file) loads a kit page as the checks do (rendering on, so it draws only when asked);
frame_at(page, t) draws second t and gives back the film's own sheet as an array (height, width, 3), at the
picture's size (1920 x 1080 for a film of FILM_STYLE wide 1920, whatever its pixels); differ(a, b) compares two
such pictures by kit_check.py's rule for "same": a pixel differs when a colour is more than 24 apart, and it
counts when its colour lies outside what the other picture has within one pixel of it by more than 24 (a line
lying a part of a pixel aside changes the pixels along its edge, and nobody sees it). It gives back (differ,
counted). kit_check.py's own "same" works it out in the page, in JavaScript; this is the same rule in numpy.
```

- `open_page(browser, page_file, errors)`: A new tab in browser with the kit page loaded as the checks load it: the page (Playwright's).
- `frame_at(page, t)`: Second t of the page, as the film's sheet shows it, at the picture's size.
- `differ(a, b)`: (how many pixels differ by more than 24 in a colour, how many of those a shift of one pixel does not explain).

## kit/checks/ghost.py

```
ghost.py page.html out.png --from A --to B [--every S] [--box X Y W H]  - one picture of how things move.

    python checks/ghost.py maeng/s04.html s04_ghost.png --from 2 --to 33
    python checks/ghost.py maeng/s03.html s03_walk.png --from 0 --to 12 --every 0.5 --box 0 500 1300 500

From second A to second B the page is drawn every S seconds (a sixteenth of the stretch unless told); what does
not move (each pixel's middle colour over all of them) is the picture behind, and what moves is laid over it at
every one of those seconds, the earliest faintest, the last whole. So the spacing of the ghosts is the speed:
evenly spaced is an even pace, bunched is a slowing or a stop, far apart is a dash, and a foot that should stand
still on the ground and does not shows as a smear (the idea from HyperFrames' ghosted motion frames, 2026-10-19;
nothing of its code). A scene decorated with life (decorate.js) also has each animal's course drawn over it, in
its own colour: a dot where it was at each second drawn, the seconds written at every fourth, and its name.
A scene whose camera moves over the stretch has no picture behind that holds still: it says so, and the ghosts
are of everything. Keep the stretch short there, or within one shot.

It needs Google Chrome (through Playwright), numpy and Pillow. The page is named from the folder it is run
in. It writes the PNG named (the box cut from it with --box: x y w h in pixels of the picture), prints how
many moments and courses it drew and the first page error, and ends with exit code 0. It runs main() as it
is loaded: do not import it.
```

- `main()`: The command line (see this file's docstring): draw the stretch, find the picture behind, lay the ghosts and

## kit/checks/heads_tall.py

```
heads_tall.py [build ...]  - how many heads tall each of the kit's cast stands, at each build.

    python checks/heads_tall.py              # builds 0, 0.5 and 1
    python checks/heads_tall.py 0 0.25 1

A figure's height is measured in its own heads: from the ground to the crown of the skull, over the crown to the
chin. person() gives back where the crown and the chin came to. Each of the cast is drawn standing straight
(up: 1), with each build in turn, on build.html, which needs nothing but the kit.

It needs Google Chrome (through Playwright) and build.html in the kit's folder. It prints a table, one row
for each of CAST, and ends with exit code 0.
```

- `main()`: The command line: heads_tall.py [BUILD ...]: draw each of the cast at each build and print how many heads tall.

## kit/checks/kit_check.py

```
kit_check.py [page.html ...] [--quick]  - one check of the kit: every page that uses it still draws, and draws right.

    python checks/kit_check.py                 # every page beside the kit that loads oldcartoon.js
    python checks/kit_check.py lanna.html      # one page
    python checks/kit_check.py --quick         # without the arms, which take the longest
    python checks/kit_check.py model.html --quick --settle 30     # "same" as it would be with a pre-roll of 30 frames
    python checks/kit_check.py --changed       # only the pages that something they load has changed since they passed

Every item it checks is written down, PASS or FAIL with what was found, in out/checks/kit_check.txt (and .json),
and the run's summary is added to out/checks/history.log (report.py). With --changed, a page is checked only when
the page, a script it loads, or this check's own code has changed since the page last passed (out/checks/
kit_check_passed.json keeps what each passed with; a --quick pass does not stand for a full one), and the look
keys and the names only when a script has; what is left out is written down as SKIP, with why.

Run it after any change to oldcartoon.js. First the kit's own list: every key of a "look" that the kit reads must be
written down in the comment above person(), and every key written there must be read. Then the names: no top-level
name may be defined in two script files beside the kit, or in the folder of a film's scenes beside it (maeng/), or by
the cartoon maker's own script and a script it loads, since the one loaded last silently replaces the other. Then
for each page, in Chrome with no window:
  draws     the page loads, and draws 24 frames spread over its length, with no error
  same      a still shows what the film shows. A frame come to by a jump of the clock, as a still comes to it, is
            compared with the same frame come to by running the four seconds before it, pixel by pixel on the film's
            own sheet, at two places in the page. Two numbers, each the worse of the two places: how many pixels
            differ by more than 24 in a colour, and how many of those a shift of one pixel does not explain (a line
            lying a part of a pixel aside changes the pixels along its edge, and nobody sees it; a pixel counts when
            its colour is outside what the other picture has within one pixel of it). A page passes with fewer than
            SAME_LIMIT of the second. The kit's settled() is what brings a jump that near: a page whose draw() does
            not use it shows what hangs at rest, and fails here.
  arms      what arms_check.py counts over the whole page: elbows that flip, upper arms that point in toward the
            spine, forearms folded past 150 degrees. A page passes with none, or with no more than KNOWN allows.
  ms        how long one frame takes to draw, after a warm-up (whatever is timed first comes out about five times
            too slow)
  cues      only for a page with a cue sheet (CUES): every line of the song is sung inside one scene (a cut
            in the middle of a line fails), and has ended before the next line begins. A line sung a syllable to
            the beat ends after its syllables; a spoken line gives its own end, in seconds, as the cue's fifth
            entry. One more line is printed under the page's.
A page that needs a file which is not on this computer (a page's pictures are not kept in git) is left out, and said
so. It prints one line a page, then what failed, and ends with exit code 1 if anything did.

It needs Google Chrome (through Playwright). Pages are named from the kit's folder (kit/). The time a page
may take to load is KIT_CHECK_LOAD_SECONDS from the environment (180 unless set).
```

- `fingerprint(page_file, quick)`: What a page's check depends on: the page, every script it loads, and this check's own code; and whether the
- `scripts_fingerprint()`: Every script beside the kit and in its films' folders: what the look keys and the names are read from.
- `pages_of(names)`: The pages to check: those named (from the kit's folder), or every page beside the kit that loads oldcartoon.js.
- `keys_of(kit)`: The look keys the kit reads, the ones written down in the comment above person(), and the ones in LOOK_KEYS,
- `maker_file()`: The cartoon maker: maker/ beside the kit in lannamation, the page beside the kit's folder on krueng.ai.
- `shared_names()`: Top-level names that two script files beside the kit both define. The files share one page, so the one loaded
- `missing_of(page_file)`: The script files a page asks for that are not on this computer.
- `check(browser, page_file, quick, settle)`: One page: what was found, and a list of what failed.
- `line_of(name, found)`: What was found on one page, as one line of the table.
- `main()`: The command line (see this file's docstring): check the look keys and the names, then each page; write

## kit/checks/person_same.py

```
person_same.py [--against REV] [--cases N] [--harvest]  - person() before and after a change, drawn alike.

    python checks/person_same.py                    # this oldcartoon.js against the one last committed (HEAD)
    python checks/person_same.py --against 0a15826  # against the one of any commit
    python checks/person_same.py --harvest          # read the looks from the pages again first

For a change to oldcartoon.js that should move no pixel of a person: taking person() apart, renaming inside it,
tidying. It draws the same cases with the two oldcartoon.js, each in a page of its own with the cartoon maker's
modules, in the same order, and compares for each case the sheet's pixels, the joints person() gives back, the
error if one was thrown, the warnings, and what person() puts back after itself (the skin, hair, body, pen ...).

The cases are the looks the kit's own pages give person(): every page that loads the kit, and a film's scenes
(*/s*.html), drawn at six moments with person() listening, kept in out/checks/person_looks.json (--harvest makes
it again, after new pages or looks; it takes some minutes). A case is one of those looks, as it was or with one to
four of its keys given a value seen for that key elsewhere, at a random second and place; a dozen people are
followed from case to case, as in a film, so what lags and swings is compared too. The random choices are seeded:
the same cases every time.

Before the person() split (2026-10-21) this compared 1500 cases at each of its eight steps: none differed, and a
change of one number in the kit made 631 of them differ. A planted change is how to check this check.

Prints each case that differs (up to five), writes PASS or FAIL in out/checks/person_same.txt (report.py), and
exits 1 if any differs.

It needs Google Chrome (through Playwright) and git (the old oldcartoon.js is read with git show). It writes
out/checks/person_looks.json (the looks, once), and while it runs person_same_old.js and two pages in
out/checks/, removed after. It stops with exit code 1 and a message when git has no oldcartoon.js at REV or
a kit's page throws an error of its own.
```

- `harvest(browser)`: The looks the kit's pages give person(), and for each key the values seen (only what JSON can carry).
- `cases_of(count)`: count cases for person(), the same every time (seeded): each a look from person_looks.json, perhaps with
- `drawn(browser, kit_file, cases)`: Each case's answer, drawn with this oldcartoon.js and the maker's modules beside the kit.
- `main()`: The command line: person_same.py [--against REV] [--cases N] [--harvest]: draw the cases with both kits,

## kit/checks/reach_check.py

```
reach_check.py [page.html]  - does a wrist sent to a point of the scene come to it?

    python checks/reach_check.py                 # together.html

A look's reachA or reachB sends a wrist to a point. The page keeps, in MISSED, how far each such wrist came to
rest from its point in the frame just drawn, and whether the point was within the arm's length. Every frame of
the page is drawn. For each reach it prints the worst miss while the point was within reach, and the worst
while it was not. A wrist more than LIMIT pixels from a point it could reach is a failure (exit code 1).

It needs Google Chrome (through Playwright). The page is named from the kit's folder (kit/), not from the
folder it is run in, and must keep MISSED. It prints one line a reach; a kit warning or a page error is a
failure too.
```

- `main()`: The command line: reach_check.py [PAGE]: draw every frame, print each reach's worst miss.

## kit/checks/report.py

```
report.py - what every check writes when it is done: a success or a failure, item by item, to a file.

    from report import Report
    report = Report("kit_check")
    report.record("lanna.html: draws", True, "24 frames, no error")
    report.record("lanna.html: same", False, "312 pixels past a pixel's shift")
    report.finish()            # writes the files, and gives back whether all of it passed

Each check's last run is out/checks/NAME.txt (one line an item: PASS or FAIL, what was checked, what was found;
then the summary) and out/checks/NAME.json (the same, for a program), and every run adds one line to
out/checks/history.log: when, which check, how many passed and failed, and which failed. An item that was left
out because nothing it checks has changed is recorded as SKIP, with why. out/ is not kept in the repository.
```

- `fingerprint(paths, extra)`: One mark for the files a check's item depends on: when none of them has changed, an item that passed

## kit/checks/same_kit.py

```
same_kit.py other_kit.js page.html [page.html ...]  - do two copies of the kit draw the same pictures?

Each page is drawn at twelve seconds spread over its length (one frame each, as a page watched live) with the kit in
the repo and with the other kit, and the film's own sheet is compared pixel for pixel. Prints how many of the twelve
frames differ, and for those the count of pixels that differ at all.

Not for a page whose cloth is a chain (the paperdoll sheets, apsara.html, fonlep.html, puman.html). Such a page
does not draw the same picture twice: the kit against an exact copy of itself differs there in every frame
(measured 2026-10-13: 7,000 to 12,000 pixels a frame on apsara.html), and it still does when each frame is come to
through the kit's settled(). For those pages use kit_check.py, whose "same" allows for a line that lies a part of
a pixel aside.

It needs Google Chrome (through Playwright), numpy and Pillow. The other kit is named from the folder it is
run in; the pages from the kit's folder (kit/). It prints one line a page and ends with exit code 1 when a frame
of a page differs between the two kits, else 0 (0 whatever it found, until 2026-10-21).
```

- `frames(browser, page_file, kit)`: The page's twelve frames as PNG data URLs, each come to by a jump from elsewhere, as a page watched live.
- `pixels(url)`: A PNG data URL as a numpy array (height, width, 3) of int16.
- `main()`: The command line: same_kit.py OTHER_KIT PAGE [PAGE ...]: print how many of each page's twelve frames differ.

## kit/checks/score_check.py

```
score_check.py - does the music under every line carry that line's feeling? And a plot of it, scene by scene.

    python checks/score_check.py            # after python maeng/feelings.py: every scene in out/maeng_music/

It listens to the music, not to the cue sheet. Under each line, from the moment its feeling's music has fully come
in (score.py turns EARLY before the line, over CROSS seconds) to the moment the next line's begins to come in,
it measures which notes sound (how much of the music's energy is in each of the twelve notes), and which of
score.py's sets of notes holds most of it: that set must be the line's feeling's. A line too short to hear on
its own (under a second of its feeling alone) is measured over what there is, and said so. It also measures how
loud the music is, how bright (where the middle of its energy lies) and how busy (how many notes begin a
second), and draws all of it, one scene to a row, into out/maeng_music/plot.html: every sentence a block in its
feeling's colour, under it the set the music was heard in, and the music's loudness and busyness along the time.
Each line is written down, PASS or FAIL, in out/checks/score_check.txt (report.py). With --changed, it is left out
when the music (out/maeng_music/), score.py, feelings.py and the scene files have not changed since it passed.
Exits 1 if any line's music is heard in another feeling's notes.

It needs numpy and soundfile, and out/maeng_music/ (cues.json and a WAV for each scene, made by
maeng/feelings.py) and maeng/words.js. It runs main() as it is loaded: do not import it.
```

- `notes_heard(piece, rate)`: How strongly each of the twelve notes (A first) sounds, as an ear picks a note out: every note from 100 to
- `set_heard(energy)`: The set of notes that holds the most of the music's energy, and how much it holds.
- `busy(piece, rate)`: How many notes begin a second: rises in the energy above 300 Hz, in 20 ms steps.
- `english()`: Each line's English, from words.js.
- `main()`: The command line: score_check.py [--changed]: hear each line's music, print and record each, draw the plot,
- `plot(rows)`: Every scene a row: its sentences as blocks in their feelings' colours, the set heard under each, and the

## kit/checks/seek_check.py

```
seek_check.py [page.html ...]  - is every frame worked out from its second alone, as a still and a render need?

    python checks/seek_check.py                    # the lint, and the back test on every film scene (*/s*.html)
    python checks/seek_check.py maeng/s04.html     # the lint, and one page

The kit's rule is that a still is the film's own frame: render.py, stills.py and scenes.py ask a page for any
second in any order, so nothing a page draws may hang on the clock of the computer or on what it drew before.
Two checks (the idea from HyperFrames' seekable timelines, 2026-10-19; nothing of its code):

  lint   no script of the kit, of a film's scenes or of a page reads the computer's time or keeps it going by
         itself: Date.now, new Date, performance.now, setTimeout, setInterval, Math.random (unseeded: the kit's
         dice() is seeded). A page's play() is let off: it is what plays the page live, and it hands draw() the
         time it is given.
  back   a frame come to after a later one is the same as the frame come to first: second 0.3 of the page's
         length is drawn on a fresh page, then 0.85 of it, then 0.3 again, and the two pictures of 0.3 compared
         by kit_check.py's rule (frames.py: a pixel counts when a shift of one pixel does not explain it). A page
         passes with fewer than kit_check's SAME_LIMIT. kit_check's "same" comes to a frame forward, by a jump and
         by a run; this comes back to one, which is where a creature that remembers where it was goes wrong.
Each item is written down, PASS or FAIL (or SKIP), in out/checks/seek_check.txt (report.py). With --changed, a page
is come back to only when it or a script it loads has changed since it last passed. Exits 1 if either finds anything.

It needs Google Chrome (through Playwright), numpy, scipy and Pillow. Pages are named from the kit's folder
(kit/). It runs main() as it is loaded: do not import it.
```

- `without_play(text)`: A page's script with its play() taken out (the one place that is given the computer's time).
- `lint()`: Every line of the kit's scripts and pages that reads the computer's clock (CLOCKS), a page's play() let off.
- `page_files(page_file)`: A page and every script it loads: what its back test depends on.
- `back(browser, page_file)`: The back test on one page: draw 0.3 of its length, then 0.85, then 0.3 again, and compare the two pictures.
- `main()`: The command line: seek_check.py [PAGE ...] [--changed]: run the lint, then the back test on each page.

## kit/checks/sheet_pair.py

```
sheet_pair.py other_kit.js out.png page.html second [x y w h]  - one frame of a page with the repo's kit (left) and another kit (right).

The frame is come to by a jump with the page being rendered, as a still is. The box is the part of the 1440 x 1080
sheet to keep (all of it unless told).

It needs Google Chrome (through Playwright) and Pillow. The other kit is named from the folder it is run in;
the page from the kit's folder (kit/). It writes out.png (the two crops side by side, 8 pixels apart) and
prints its size; exit code 0. The default box is the whole sheet, 1440 or 1920 wide.
```

- `frame(browser, page_file, kit, second)`: The page's sheet at second, come to by a jump with rendering on: a PIL image (the sheet's own size).
- `main()`: The command line: sheet_pair.py OTHER_KIT OUT PAGE SECOND [X Y W H]: save the frame with both kits side by side.

## kit/checks/snapshot.py

```
snapshot.py save|compare [--exact] [page.html ...]  - stills of a film's key moments, kept, and compared after a change.

    python checks/snapshot.py save                  # every page that loads the kit: its stills into out/snapshots/
    python checks/snapshot.py compare               # draw them again and compare with what was saved
    python checks/snapshot.py compare --exact       # a change meant to move no pixel (a refactor): any pixel counts
    python checks/snapshot.py save maeng/s04.html   # one page

The pages are a film's scenes (*/s*.html) and the kit's own sheets (every page beside the kit that loads
oldcartoon.js, as kit_check.py finds them); a page that needs a script which is not on this computer is left out,
and said so.

Before a change to the kit, save; after it, compare. A film's scenes load the kit's shared files (beasts.js,
pieces.js, myth.js, oldcartoon.js), and a change made for one film can move something in another nobody is
looking at: this shows which page, at which second, and how much (the idea from HyperFrames' golden snapshots,
2026-10-19; nothing of its code). The stills of a page are its key moments: its first frame, a second into each
of its lines (a scene's SNN_LINES, or any LINES the page has), and its last frame; a page with no lines gets six
seconds spread over it. They are kept at half size (960 x 540), outside the repository (out/ is not kept), and
compared by kit_check.py's rule (frames.py), at half size both. A moment where a shift of one pixel does not
explain HALF_LIMIT pixels or more is a change, and is saved beside its still as NAME_now.png, with NAME_diff.png
showing where it differs, to look at. With --exact, a moment changes when any pixel of its still differs at all:
for a change that should move nothing, such as person() taken apart into its stages, on the same computer and
Chrome as the stills were saved with. Each moment compared is written down, PASS or FAIL, in out/checks/
snapshot.txt (report.py). Exits 1 if anything changed, or a still is missing.

It needs Google Chrome (through Playwright), numpy, scipy and Pillow. Pages are named from the kit's folder
(kit/). Each page's stills are in out/snapshots/PATH__NAME/ (000.05.png ... and moments.json). The report is
written as out/checks/snapshot_save.txt or snapshot_compare.txt, one for each. save ends with exit code 0
even when a page errs; with neither save nor compare it prints this and ends with exit code 1. It runs
main() as it is loaded: do not import it.
```

- `half(picture)`: A picture (height, width, 3) at half of 1920 x 1080: 960 x 540, as a numpy array of int16.
- `folder_of(page_file)`: Where a page's stills are kept: out/snapshots/ and its path from the kit's folder, "/" as "__" (a Path).
- `main()`: The command line: snapshot.py save|compare [--exact] [PAGE ...] (see this file's docstring).

## kit/checks/sound_check.py

```
sound_check.py - one check of the kit's sounds: every sound in sounds.py is made, and comes out right.

    python checks/sound_check.py

For each sound: it is made at all; it is as long as its outline says (the echo may ring on after it, no more
than its "cave" seconds and the latest voice's start); nothing in it is not a number; it is loud enough and does
not clip (its peak between 0.5 and 0.95); it is not silent through its middle; and it is not the same as any
other sound (two moods that sound alike are one mood too many). Prints one line a sound, writes each down, PASS or
FAIL, in out/checks/sound_check.txt (report.py), and exits 1 if any fails. With --changed, it is left out when
sounds.py and howl.py have not changed since it passed.

It needs numpy and scipy, and imports howl.py and sounds.py from the kit's folder. It runs main() as it is
loaded: do not import it. It makes each sound by howl.py from its outline; the sounds sounds.py makes from
numbers (MADE: crickets, mouse-squeak, wind) give no outline but the sound itself, and are checked as they are
(until 2026-10-21 it stopped on the first of them).
```

- `longest(outline)`: How long a sound may be: its latest voice's end, and the echo's ring after it.
- `main()`: The command line: sound_check.py [--changed]: make and check every sound, exit 1 if any fails.

## kit/checks/strip.py

```
strip.py page out.png t0 dt n x y w h  - n crops of frames t0, t0+dt, ... side by side, one browser.

    python checks/strip.py lanna.html walk.png 2 0.25 8 300 400 400 600

It draws the page at t0, t0 + dt ... (n frames; seconds), cuts the box (x y w h, screen pixels of the
1920 x 1080 picture) from each, and saves them in a row as out.png; it prints its name and size. Each frame is
saved as out.png.K.png first and removed after. The page is named from the folder it is run in. Needs Google
Chrome (through Playwright) and Pillow. Exit code 0.
```

- `main()`: The command line: strip.py PAGE OUT T0 DT N X Y W H (see this file's docstring): draw, crop, save the row.

## kit/checks/where_differ.py

```
where_differ.py other_kit.js page.html second out.png  - where do two kits draw one frame differently?

Draws the frame (a jump from elsewhere, as a page watched live) with the repo's kit and with the other kit, prints the
boxes that hold the pixels which differ, and saves the two versions of the largest box side by side, three times size.

It needs Google Chrome (through Playwright), numpy, scipy and Pillow. The other kit is named from the folder
it is run in; the page from the kit's folder (kit/). It writes out.png only when some pixel differs, and ends
with exit code 0. The box saved is held inside the sheet, 1440 or 1920 wide (until 2026-10-21 inside 1440: a box past x 1440 was cut
there, and one wholly past it failed).
```

- `frame(browser, page_file, kit, second)`: The page's sheet at second, come to by a jump from elsewhere with rendering off: a PIL image.
- `main()`: The command line: where_differ.py OTHER_KIT PAGE SECOND OUT: print the boxes that differ, save the largest.

## maker/cartoon_maker_assets/film.py

```
film.py - a cartoon from the command line: a film as JSON in; a page, stills and a video out.

    python film.py vocabulary                       the names the kit knows, the JSON shape and the rules
    python film.py page film.json out.html          the film as a page of the Lanna cartoon kit
    python film.py stills film.json 2 6 10          one picture per second named: stills/film_2.0s.png ...
    python film.py render film.json out.mp4         the video (add --from 2 --to 8 for a part of it)
    python film.py write "a story" film.json --base http://127.0.0.1:11434/v1 --model qwen2.5:3b
                                                    a model writes the JSON (--key KEY for OpenAI)
    python film.py skill claude_code                give the skill to an agent: claude_code, codex or opencode

The JSON is the same data that krueng.ai/cartoon_maker.html makes with its
palette, and this program uses that page itself, open in a browser with no
window, to check the film and to write its code. So the page and this program
can never disagree. The page is the one beside this program when there is one
(in a copy of the lannamation repository, or of the site), else the site's;
--maker gives another address.

A page it writes carries the kit inside it, so the film draws the same for
good and plays with no internet; --local writes one that loads the kit from
files beside it instead.

Needs: Python 3, playwright (pip install playwright) with Chrome installed,
and ffmpeg on the PATH for a video.

Each command prints what the maker kept of the film and the kit's warnings. It ends with exit code 0;
1 with a message when the maker refuses the film or the model's server answers with an error; render ends
with render.py's own exit code. page writes OUT; stills and render write FILM.html beside the film's JSON
first, and stills its pictures into --folder (default stills/).
```

- `open_maker(url)`: The maker page in a browser with no window: its functions are ours to call.
- `close_maker(playwright, browser)`: Close the browser and stop Playwright, as open_maker() started them. Gives back nothing.
- `take(page, film)`: Hand the film to the page: it checks every name and number, and says what it kept.
- `vocabulary(args)`: film.py vocabulary: print the maker's own instructions (filmPrompt()): the names, the JSON shape, the rules.
- `read_film(path)`: The film's JSON file at path, as a dict. Fails with json's error when it is not JSON.
- `page_code(page, local)`: The page of the film the maker holds, as HTML text: the kit inside it, or loaded from files beside it.
- `make_page(args)`: film.py page FILM OUT [--local]: write the film as a page of the kit. Gives back nothing.
- `report(what, summary, warnings)`: Print what was made, what the maker kept of the film, and the kit's warnings (or that there were none).
- `stills(args)`: One picture per second named, from the film's own page: draw(t), then a photograph of the stage.
- `find_render()`: The kit's render.py: beside the kit (kit/ in lannamation, js_animation_assets/ in the site's folder), or
- `render(args)`: film.py render FILM OUT [--from S] [--to S] [--audio WAV]: write FILM.html beside the film, then run
- `write(args)`: Ask a model for the film, with the page's own instructions, and keep what the page accepts.
- `skill(args)`: Put SKILL.md where the agent finds it, so that "make a cartoon of ..." reaches this tool.
- `main()`: The command line: film.py [--maker URL] COMMAND ...; each command's function does the work.

