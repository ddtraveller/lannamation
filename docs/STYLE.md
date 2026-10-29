# The 1930s cartoon style, in JavaScript — how to make the next film

**Why this file exists.** On 2026-10-11 the owner gave a 1935 cartoon as a reference and asked for
a film about a northern Thai village in its manner, then for round after round of matching: the
bodies, the bottom of a dress, the hair, the eyes, lips and noses, the hands and feet. Then: *"Focus
on capturing the math/javascript for future videos as well so you can simply apply this style."*
This is that capture. The style is a kit, `kit/oldcartoon.js`; a film is a
short page of scenes on top of it; `village.html` is the first one. No model draws anything: every
frame is code, rendered by `render.py` (see `krueng.ai/js_animation.html`, which teaches the method).

Nothing of the reference film is copied: no character, drawing, music or joke. What is taken is
the common manner of cartoons of that decade, written down as rules.

## The style rules, from the paintings, the murals and the thangkas

Written down from nine Thai paintings, Lanna murals and Wat Phumin photographs, and three thangkas
the owner gave on 2026-10-11. Nothing of any picture is copied; these are what they have in common.

1. **Flat colour inside a fine dark line.** Every shape has a contour; shading is a flat darker
   band on the side away from the light, never a soft gradient across a face. (A face, since
   2026-10-29, is shaded as a thangka shades one: very soft bands only where the form turns away,
   the forehead and cheeks left flat, and its line a fine lac-brown. See "Faces with more realism".)
2. **Gold is the ornament.** Jewellery, combs, crowns, hems, halos and trims are gold (`STYLE.gold`);
   gold never fills a large area.
3. **Pattern fills the cloth.** A pha sin is bands: diamonds, dots, zigzags, lines, between gold
   lines; a sabai has a woven border; nothing is plain that could be woven.
4. **Faces are calm and long-eyed.** One heavy upper lid line with a flick, thin high brows, a
   fine straight nose, a small bow mouth, a long neck, pale skin. No big round cartoon eyes.
   (That is the murals' face, `STYLE.face = "painted"`. The kit's own since 2026-10-29 keeps the
   calm and the long eye and takes the rest from the thangka and the photographs: white on both
   sides of a brown iris, each person's own lid, a modelled nose, lips of the skin's own rose,
   brows of hairs, the face in three equal parts.)
5. **Hair is pulled back.** A lady's into one high bun at the back with a comb, flowers and
   strands; a man's cropped at the sides with a brush on top, or wrapped in a cloth. Nothing curls.
6. **Hands speak.** Slender fingers, together and curving; the dance hand bends back with the
   thumb to the first finger; nail extensions on a dancer. Everyone is barefoot.
7. **Crowds are rows.** Many small figures, further rows higher and smaller, each with a face.
8. **The sky is drawn, not blurred.** Clouds are scroll clouds with outlined lobes and curled
   ends; the sun is a disc ringed with flame scrolls; a halo is a ring with marks on its rim.
9. **Flowers everywhere there is room.** The lotus: five petals in a fan, white tips, a gold pod;
   in a hand, along a path, in the corners of a card.
10. **Buildings have texture.** Tiled roofs, board walls, gold trim on a temple, a chedi, guardians
    at the gate, big round-canopied trees.

The 1930s cartoon rules (white gloves, big shoes, the smiling sun, soft clouds) stay in the kit
behind `gloves`, `shoes`, `STYLE.sun = "face"` and `STYLE.clouds = "soft"`.

**Character models** in `CAST`: `lady`, `fellow`, `child`, `scientist`, `drummer`, and from the
paintings `celestial` (crown, halo, gold sabai, a lotus in the hand), `dancer` (orange-red blouse,
black-and-gold sin, green sabai, straight tail, pins, nails), `villager` (sarong, head-cloth) and
`monk` (saffron, shaved, no waist cloth). A head-cloth (`turban: colour`) is a Lanna band tied low on the brow, knotted at the back with two ends, the hair showing above it; the kit's `hat` is no longer used in the village film. `starter.html` shows four of them.

## The movement guide, from a dancer

Read from a video of a classical (Bharatanatyam) dancer the owner gave on 2026-10-11, as a guide for
a stick figure; `dance.html` draws the stick figure and the `dancer` model from the same poses.

| Part | What it does |
|---|---|
| Head | tilts toward the leading hand; slides side to side on the neck on the counts; the eyes follow the hand |
| Neck | upright; the head moves on it while the shoulders stay still |
| Shoulders | level, held down and back; they do not rise with the arms |
| Arms | straight lines and right angles: one curved over the head, one straight out at shoulder height, or both in one diagonal; a position is hit sharply and held for a beat |
| Hands | a flat open palm facing out, or the fingers spread like a lotus; the wrist flicks on the beat |
| Torso | upright, tilted a little away from the raised arm, turned toward the gesture |
| Hips | the half-sit: hips lowered, knees turned out; level while travelling |
| Legs | knees bent outward; one lifts with the knee bent and the foot flexed |
| Feet | flat stamps on the beat, heel and toe together; the standing foot turned out; the weight shifts side to side |

**The whole dance, read by a pose model.** `kit/dance_track.py` runs MediaPipe Pose
(1.1, the Tasks API, `pose_landmarker_full.task`) over the video ten times a second and writes `dance_track.js`,
a `TRACK` of `[second, pose]`: hands = (wrist − shoulder) × 112 / torso, `bend` = the torso's lean from upright,
`tilt` = nose from the shoulders minus the bend, `sit` = (172° − the smaller knee angle) / 70°, `raise` when one
ankle is 18+ above the other, `turn` = shoulder width over its 95th percentile; joints are median-smoothed over
five frames. 982 frames, 803 found (82%), 94 s of track. `poseAt(t, TRACK, 0)` plays it (hold 0: smooth);
the eight-pose guide keeps hold 0.5. Install: `pip install mediapipe opencv-python`; run with `python -P`.

In the kit: `sit` (0 to 1) lowers the hips 40 and sets the feet 24 wider; `tilt` turns the head; `raise`
`[leg, high, forward]` lifts a foot on purpose; `poseAt(t, keys)` plays `[second, pose]` keys, holding
each for the first half of the way to the next and easing into the next; `stick(x, y, look)` draws the
same pose as joints and bones, with `jointOf` giving the elbows and knees that `limb` draws. The village
film's dancers take the arms, head and torso of the dance while they walk; the evening's women take all
of it, each a second behind the other.

## The framework

| File | What it is |
|---|---|
| `oldcartoon.js` | the kit: `STYLE` (the look as numbers), the clock and the beat, ink and paint, faces, cloth, hair, hands, limbs, `person`, `CAST` and `cast()`, animals, the painted sets, the lens, cuts and subtitles, singing, the cue sheet (`CUES`, `cueAt`, `words`) |
| `render.py`, `stills.py` | a page to a video; six frames to look at first. `render.py --from 12 --to 20` renders one part (the sound is cut to match). Both print the kit's warnings and the page's errors |
| `scenes.py` | a film that lists its `SCENES`, rendered one scene at a time into `<page>_scenes/` beside the page and joined without a second encode, the sound laid over the whole: `--scene N` renders one scene again after a change to it, `--all` every scene, `--list` shows which videos are older than the page or a script file it loads (owner, 2026-10-16: "Break the video up into scenes so that when one needs a change it can be changed and then assembled with the other prebuilt scenes") |
| `checks/kit_check.py` | one command after any change to the kit: every page that loads it still draws, a still shows what the film shows, no arm breaks its rules, the list of `look` keys is true, and the kit warned about nothing (see "The kit's own checks") |
| `checks/arms_check.py` | one page's arms, frame by frame; `kit_check.py` runs it on every page |
| `checks/same_kit.py`, `sheet_pair.py`, `where_differ.py` | a changed copy of the kit against the one beside the pages (develop in the copy; the pages load it through `page.route`): how many of 12 frames differ, one frame side by side, and where two kits differ, the largest place three times size. `same_kit.py` is not for the paperdoll sheets: their chain cloth does not draw the same picture twice, so the kit against a copy of itself differs there in every frame (7,000 to 12,000 pixels on `apsara.html`). `kit_check.py`'s `same` is the check for those |
| `checks/strip.py` | `n` crops of frames `t0, t0 + dt, …` side by side: one movement as a strip |
| `checks/heads_tall.py` | how many heads tall each of the cast stands, at each `build` |
| `build.html` | the build sheet: the lady and the fellow at four builds, with their height in heads |
| `walk.html` | the sheet for the style with no hop and for the walk: people who stand still, people who walk from place to place and back with `stroll()`, and animals that do the same with `amble()` (see "Standing still, and a walk from place to place") |
| `buildings.html` | the sheet for the buildings: the house, the temple, and the hall and the stupa of the backdrops, each large, and the first two at a film's sizes (see "Buildings with depth") |
| `looks.html` | a picture for every name a look can have: 76 figures in six parts of five seconds (what is worn, the head, the face, the arms, the hands and what they hold, the body and how it moves), each with its name and the value it was given. It warns about a name the kit knows and it does not show, so `kit_check.py` fails until a new name is added to it |
| `beasts.js`, `beasts.html`, `elephant.html`, `felines.html`, `pig.html` | an elephant and a water buffalo that walk, each with a place on its back where someone can ride; a Siamese cat and a tiger that walk and sit; a pig; and the four sheets (see "An elephant and a water buffalo", "A cat and a tiger" and "A pig") |
| `food.js`, `food.html` | a dozen Thai dishes drawn small, in a file of their own on top of the kit, and their sheet (see "A dozen Thai dishes") |
| `butterflies.js`, `butterflies.html` | four butterflies of the north (the golden birdwing, the leopard lacewing, the common bluebottle, the grass yellow), flying or resting, and their sheet (see "Four butterflies of the north" in `docs/kit/creatures.md`) |
| `thicket/` | the film "Through the flowers": the camera moving through dense flowering plants with no one in it, four scenes and `film.html`; its layers, sprites, bushes and painted trees are `thicket.js`, beside the kit, which the hero film (sash_maeng.html) uses too (see "Through the flowers" in `docs/kit/films.md`) |
| `flora.js`, `flora.html` | eight flowers and thirteen fruits of Thailand drawn small, and sixteen flowers and plants of Lanna, in a file of their own on top of the kit, trees that bear them, and their sheet (see "The flowers and fruits of Thailand" and "The flowers and plants of Lanna" in `docs/kit/things.md`) |
| `sabai.js`, `sabai.html` | a shoulder cloth woven with figures that walk, the sash film's cloth as a file of its own on top of the kit, with its camera, and its sheet (see "A sabai woven with figures that walk") |
| `weaving.js`, `weaving.html` | Lanna weaving thread by thread: 57 motifs of jok and khit as grids of threads (`LAI`), woven by `weaveGrid()`; a swatch, the teen jok of Mae Chaem, Nan and Mueang Long, a whole sin, a sabai with khit ends; the Tai Lue's flowing water with every thread a line, in the wind (`threadCloth()`); a woman at the frame loom and a woman at the spinning wheel; and their sheet (see `kit/things.md`, "Lanna weaving") |
| `dragon.js`, `dragon.html` | a dragon of the Himalayan paintings, built on the Naga's spine and body painter (load it after `naga.js`), and its sheet (see "A dragon") |
| `dragon_flight.html` | the dragon's three manners of flight, glide, hover and fast, on one sheet (see "A dragon") |
| `dragon_china.html` | the Chinese painters' dragon, `dragon()` with `kind: "chinese"`: scales, a long antlered head, eagle's feet and the flaming pearl it chases (see "The Chinese dragon") |
| `myth.js`, `myth.html`, `fiveeyes.html` | four creatures of the myths of Lanna, on the beasts' legs and the Naga's body (load it after `naga.js` and `beasts.js`): the Mom, the Luang and the Hatsadiling bird, and their sheet (see "Three creatures of the myths of Lanna"); the creature with four ears and five eyes, and its sheet (see "The creature with four ears and five eyes") |
| `band.js`, `band.html` | the band of the north, the salo, the sueng, the pi chum and the phin phia, each a painter of its own, and `musician(x, y, kind, look)`, a person who sits cross-legged and plays one on the beat; and its sheet (see "The band, more lanterns, the farmstead and the red truck") |
| `finger_dance.js`, `finger_dance.html` | the fingernail dance of the north: its six poses read by eye from a performance, the 32-second phrase for `poseAt()`, three dresses, and `fingerDancer()`, the kit's dancer dancing it walking; and a troupe of fifteen dancing it (see "The fingernail dance, read from a performance") |
| `khom_kinds.html` | the sheet for the four lanterns `khom.js` gained on 2026-10-16 (not `lanterns.html`: krueng.ai keeps a lesson of that name beside the kit): the spinning `khomPhat`, the handheld `khomThue`, the star `khomDao` and the lotus `khomBua`, by day and lit at night |
| `dance_hands.html` | the hands of classical dance (2026-10-16): the four forms of `HAND_FORMS` large and a dancer whose lifted hands change over from wong to jeeb, then every name of `GESTURES` (Thai and Khmer) on a lady with both hands raised (see "The hands of classical dance") |
| `chickens.html` | the rooster and the hen (2026-10-17): every name of a rooster's look on its own (crowing, pecking about, a hen, a fright, a crouch, facing left), the run, the hop, the scurry and a hen running in place, and the whole of `roosterBolt()` with its falling feather (see "The rooster and the hen") |
| `hairdos.html` | a lady's hair (2026-10-17): from 0 s the four ways of `BUN_STYLES` large, each head turning slowly from profile to full face, with its Thai name and how it is called (the high bun with `maiwai`, the knot on the crown with its loop under a Tai Lue maiden's pink head-cloth, the low bun with `ueang`, Dara Rasami's raised frame with `malai`); from 8 s at the film's size, three women walk across and a dancer wears all three ornaments (see "A lady's hair") |
| `gesture_dancer.html` | one fingernail dancer through every name of `GESTURES` in turn at the pace of the owner's reference (1.4 s held, 1.4 s to the next, the arms drifting a little, the knees dipping once a step), ending in a wai held 3 s: her wrists go round her shoulders down the outside to where the kit's wai puts them (a straight path passed so close to a shoulder that an elbow flipped), bending until the hands stand upright and flattening to `WAI`, and then the kit's wai holds (owner, 2026-10-16: "Show me a finger dancer going through each motion. Just that", "finish with the wai") |
| `highlands.html` | the uplands of the north (2026-10-17): from 0 s a valley at sunrise made of `highlands.js`'s parts (far ranges in forest with a sea of mist between them, a mountain with rice terraces and a hut, bands of mist drifting across it, the forest near), and from 8 s the parts on paper with how each is called (see "The highlands") |
| `northbirds.html` | five birds of the north (2026-10-17): from 0 s each large on paper with its Thai name and how it is called (the peafowl raising its train into a fan, shivering it and calling; the pheasant walking and pecking beside his hen; the magpie on a branch; the hornbill flying and perched; the sunbird leaving a twig to hover at a thong kwao flower), and from 8 s all of them at their own sizes on a mountain, with a girl come to see the peafowl display (see "Five birds of the north") |
| `lannabirds.html` | four birds Lanna tells of (2026-10-25): from 0 s each on paper going through its moves, the move's name under it (the white crow and a black one, her nest, the spotted dove, the two kingfishers, the two parakeets; then the fliers); from 12 s all at their own sizes by a pond under a cluster fig (see "Twelve animals of Lanna's tales, rites and forests") |
| `taleanimals.html` | five animals of Lanna's tales (2026-10-25): from 0 s on paper (the toad and the frog, the beetles and their fight on the log, the golden turtle and a plain one, the white barking deer, her fawn and a red buck, the white mice); from 12 s two of Chiang Mai's signs: the white deer drive off the dogs, the white mouse leads her four young into the earth under a fig |
| `forestanimals.html` | four animals of the north's forests (2026-10-25): from 0 s on paper (the slow loris, the gibbon, the goral, the giant catfish); from 12 s dawn on a limestone cliff with gorals and singing gibbons; from 20 s night on the Mekong, a loris over the water and the lord's fish below |
| `farmstead.html` | the sheet for what `pieces.js` gained on 2026-10-16: the granary `longKhao` (open, and with walls), the `sawian` basket, `tungSaiMu` planted on a sand pagoda, `tungYai` on its pole, and `rotDaeng` driving across with three riders |
| `tale_pieces.html` | the sheet for the pieces the film of the creature with four ears and five eyes needed (2026-10-19): the poor family's hut `tub` (`pieces.js`) by day and with a lamp in its door at night, and a cave's mouth `caveMouth` (`highlands.js`) close up and at a film's size before dawn, among the forest's crowns (see "Pieces for a tale") |
| `naga.js`, `naga.html` | a Naga, the many-headed serpent, as a creature in a file of its own on top of the kit, and its sheet (see "A Naga") |
| `landscape.html` | the sheet for the painters of nature read from a thangka: peaks, fan plants, tassel trees, rocks, foam and clouds with a foot of another colour (see "Mountains and plants from a thangka") |
| `backdrops.js`, `backdrops.html` | nineteen backgrounds to start a film from: seven places of the north of Thailand in the kit's own manner, and twelve in the manner of the thangka painters; and the sheet that shows them (see "A dozen backdrops to start from" and "Seven places of the north, and the backdrops of the cartoon maker") |
| `cumulus.js` | puffy clouds that drift, in a file of its own on top of the kit: `cumulus(brush, t, CLOUD_LOOKS.day\|dusk\|night)` paints them each frame over a sky sheet and under the land. Each cloud is a pile of discs on a flat base, taller in the middle, each puff one of three flat tones by its height (lit on top, in shade below, lit from below at dusk), a line round the outside drawn as the kit draws a hose (every disc first in ink and larger, then in its tone) and inner lines where every third puff rounds over the next; a cloud is drawn whole and opaque on a scratch sheet and laid on the sky at one transparency; its depth (1 near to 0.3 far) sets its size, its speed across the sky (40 px/s at depth 1), how low it hangs, how much it fades and how fine its line is; a look may name its own `ink`. Nothing is kept between frames. Not the kit's `clouds()`, which paints the flat scroll clouds of the murals |
| `motion.js`, `motion.html` | timing and travel, in a file of its own on top of the kit, every function a plain function of the time: `ease(name, u)` and `ramp(t, a, b, name)` with linear, smooth, in, out, back, bounce, elastic, wobble, anticipate (a pull back, then the rush) and spring, and the form of any as `"back in"`, `"bounce out"`, `"elastic inout"`; `tween(t, [[second, value], ...], name)` for a value through points in time (a number, a colour `#rrggbb` by the kit's `blend()`, or a list of numbers), held before the first and after the last, one ease or one a step; `springTween(t, points, look)` for a number pulled to each new value at its second on one spring (a spring is linear, so the answer is the first value plus one `springAt` swing per change, nothing kept between frames; checked against a frame-integrated spring: the gap is the integrator's, 17.7 px at 10 substeps a frame, 0.18 at 1000); `cycle(t, seconds, look)` for a repeat, 0 to 1 again and again, going back by `kind: "reverse"` (the ease traced backwards) or `"mirror"` (the same ease forwards), with a `rest` between; eases made from numbers, `"spring 0.8 0.5"` (seconds, bounce), `"steps 4"`, `"bezier .4 0 .2 1"`; `span(v, from, to, name)` reads a value of one range as a value of another (a lean that grows with the speed; to may be numbers, colours or lists); `glide(t, from, speed, look)` is a thing thrown or let go, slowing in proportion to its speed and stopping on its own (`seconds`) or at a bound (`min`, `max`), in closed form; `held(t, frames)` for a motion drawn on twos; `springAt(t, look)` and `springTime(look)`, a damped spring in closed form (stiffness 80, damping 10, mass 1, a starting push), or asked for in a film's words, `{seconds: 0.8, bounce: 0.5}` (bounce 0 just stops, below 0 creeps in); `stagger(n, count, look)` for how late the n-th of a crowd starts, from the first, last, centre or an index; and a course, `where(keys, t)` → `[x, y, moving, facing, depth, angle, distance, reached]` (the distance along the curve so far, so a walker's `step` is counted from the ground covered, `p[6] / (112 × size)`, and the feet do not slide; and which key it has reached, for what happens on arriving; `p[8]` its speed in pixels a second, for a lean into a run), one centripetal Catmull-Rom curve through `[[second, x, y, depth?], ...]` that passes the points between without stopping, eases at a walk's ends, waits where two points share a place, and faces by the curve's tangent. The ideas are the ones every animation library offers; the sheet shows each in a row |
| `elders.html` | the sheet for the four old people of the cast: an elder with a beard and a stick, an old farmer, a grandmother, and an old woman in white |
| `children.html` | the sheet for the little boy and the little girl of the cast: large, at their own size beside the grown-ups, and what they do |
| `northfaces.html` | the six people with faces of the north (2026-10-18): each face large, then all six at their own size beside the kit's lady and fellow; three-quarter from 0 s, full face from 4 s, from profile round to full face from 8 s, four feelings from 12 s (see "Faces of the north, from a photograph") |
| `floor.html`, `checks/floor_check.py` | the sheet for sitting on the floor (legs to one side, cross-legged, in trousers and in cloth), and the check that draws every frame of it and measures how far each seat, knee and neck travels |
| `together.html`, `checks/reach_check.py` | the sheet for hands that go to a place (two children holding hands, a wai, a wrist that follows a lotus), and the check that draws every frame of it and measures how far each wrist is from its point |
| `lanna_music.py`, `lanna_sing.py` | the pattern for a song: `TUNE` one letter a beat in the band's file, and the lines of the song in the film's own page, as `CUES`; the singer's file reads them from the page (see "One list for the song"). Copy these two for a new film |
| `village_music.py`, `village_sing.py` | the first film's song, the older way: `LINES` `[beat, syllables, notes]` in the Python and the same lines a second time in the page |
| `village.html` | the first film: scenes, a song's syllables for the mouths, words for the subtitles |
| `model.html` | the model sheet, where the character model is judged on its own: the lady walking in place and dancing (the tracked dance), her head at 4.4 times, the rest of the cast in a row, on a plain ground with no lens |

**The style sheet.** Before the kit loads, a film may set `window.FILM_STYLE = {ink: "#1a1a2a", line: 2.8, lens: "blur(0.4px)"}`; every key of `STYLE` can be overridden (`ink`, `skin`, `line`, `hold`, `sway`, `hop`, `gold`, `hair`, `clouds`, `sun`, `lens`). `hop: false` is the other way to move: nobody hops (see "Standing still, and a walk from place to place").

**The cast.** `CAST` holds `lady`, `fellow`, `child`, `scientist`, `drummer`, `celestial`, `dancer`, `villager`, `monk`, `maiden`, `weaver`, a little `boy` and a little `girl` (see "A little boy and a little girl"), four old people, `elder`, `oldfarmer`, `grandmother` and `devotee` (see "Two old men and two old women"), and six with faces of the north, `inta`, `khammun`, `buakham`, `sinuan`, `bunma` and `dokkham` (see "Faces of the north, from a photograph"); `person(x, y, cast("lady", {late: 0.5, mouth: mouthAt(SUNG)}))` takes one with changes; `CAST.monk = {shirt: "#e07a1f", legs: "#c8641a"}` adds one. `kit/starter.html` is a separate eight-second film made this way, with a monk and a darker ink, to prove it: `python stills.py starter.html sheet.jpg 1.2` shows it.

## Make a new film

1. Copy this skeleton to `<film>.html`, beside a copy of `oldcartoon.js`,
   `render.py` and `stills.py` (or work in `kit/`):

```html
<!doctype html>
<html><head><meta charset="utf-8"><title>my film</title>
<style>html, body { margin: 0; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; object-fit: contain; }</style></head>
<body>
<canvas id="stage" width="1920" height="1080"></canvas>
<script src="oldcartoon.js"></script>
<script>
var DURATION = 12;
var BEAT = 0.5;                      // seconds for one beat of the music

var PLACE = (function () {           // a background is painted once, not in every frame
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var brush = paper.getContext("2d");
  brush.fillStyle = "#8ccfc6"; brush.fillRect(0, 0, WIDE, 1080);
  clouds(brush, WIDE);
  brush.filter = "blur(3px)";
  hills(brush, WIDE, 780, 300, 2.6, "#8dbfa9");
  brush.filter = "blur(1px)";
  brush.fillStyle = "#efd2b4"; brush.fillRect(0, 850, WIDE, 230);
  house(brush, 400, 850, 1);
  pathside(brush, WIDE);
  wash(brush, WIDE);
  return paper;
})();

function sceneHello(t) {             // t starts at 0 in every scene
  pen.drawImage(PLACE, 0, 0);
  person(720, GROUND + 60, {shirt: "#3b5b92", legs: "#2f4470", size: 1.3, sing: true,
                            up: hop(t, 0), handA: [44, -84 - hop(t, 0) * 24]});
}

var SCENES = [[0, 12, sceneHello]];
function draw(t) { film(t, SCENES); }

var rendering = false;
function play(now) { if (!rendering) { draw((now / 1000) % DURATION); } requestAnimationFrame(play); }
requestAnimationFrame(play);
</script></body></html>
```

2. Look before you render: `python stills.py <film>.html sheet.jpg 1 4 8 11`. Six frames take
   seconds and show a figure off the ground, a hand through a head, people too small.
3. Render: `python render.py <film>.html <film>.mp4 --audio <sound>`.

## The rules, and the numbers that make them

Each rule is a function in `oldcartoon.js`. Change the number, not the idea.

| Rule | Where | The math |
|---|---|---|
| **Mouths follow the words** | `sungBeats`, `vowelOf`, `mouthAt` | a film lists its syllables as `[beat, "syl la ble"]` lines; `mouthAt(sung)` returns the mouth at `clock`: open for `0.07 s`, held, shut `0.14 s` before the beat ends, `wide` for ิ ี ึ ื เ, `round` for โ อ ู ุ or no written vowel, open otherwise. A person given `mouth` sings the words; `sing: true` only opens on the beat |
| **Squash and stretch** | `person` | given `late` (the hop's timing) the kit finds `up` and the speed itself; `land` is the time to the nearest beat. `squash = clamp(1 − land / 0.07)`, `stretch = clamp(|speed| / 10) · (1 − squash)`, height `× (1 + 0.07 · stretch − 0.09 · squash)`, width by the inverse square root. Dust puffs at the feet while `land < 0.1`; the drum rings while `land < 0.08` |
| **The head turns** | `view`, `blend3`, `HEAD_*`, `HAIR_*`, `person`, `ladyFace`, `manFace` | `turn` runs from −1 (profile, the face pointing the way the figure faces) through 0 (the three-quarter view everything was drawn in) to 1 (full face). `view(turn)` blends every feature's place and width between three keyed views on a curve through the three (`blend3`: `q + t · (f − p) / 2 + t² · (f − 2q + p) / 2`): the head's outline (14 points: in profile the cheek curve bulges to 78 and becomes the nose), the hair's mass and hairline (12 points each for a lady and a fellow), the bun (back → top), the near eye (x 30 / 2 / −19, half-width 9 / 15 / 15), the far eye (40 / 37 / 19, width 0 / 12.5 / 15: behind the nose in profile), the nose's bridge and tip (52→58 / 24→30 / 0→0; its lines fade toward profile, where the outline is the nose, and a second nostril and the tip's straightening come in toward the front), the mouth's middle and read width (48 / 24 / 0; × 0.55 / 1 / 1.15), the cheeks, the ear (−24 / −52 / −50; toward profile it is drawn after the hair, standing before it) and the far ear, which shows from `turn` 0.2 on. Before this, `turn` slid the face `16 · turn` and scaled the far eye. (Owner's ranked list, 2026-10-11: turning was the first gap against the references) |
| **Eyes look, faces feel** | `person`, `eye`, `ladyFace`, `manFace`, `FEELINGS`, `feelingOf` | `at: [x, y]` points both irises (`glance` is `[across, down]`). Eight numbers, 0 to 1 each, or a feeling by name (`feel: "surprised"`; the names are in "Nine feelings", below): `wonder` lifts the brows 7–8 and opens the lids 30%; `fear` lifts them 6–7, knits them a little and opens the lids 45%; `anger` lowers them 4–5, turns their inner ends down (`knit` 0.35–0.4 rad) and narrows the lids; `sad` turns the inner ends up (0.3), half-closes the lids (−30%) and drops the corners of a shut mouth (`frown` = sad + 0.6 · anger: 4 px on a lady's bow, 6 on a fellow's line); `smile` turns a shut mouth up; `worry` turns the inner ends up (0.38–0.4), draws the brows 3 toward the nose with a fold between them, and presses the mouth small; `sleepy` hangs the lids, nods and yawns; `full` makes the lids heavy and the cheeks pinker. A slanted lid (`slant` in `eye()`) carries anger, sadness and worry where a head-cloth hides the brows. A named feeling also opens the mouth (surprised: round, 0.7; fear: wide, 0.6) when nothing else does, and leans the body and tilts the head (surprised back, angry forward, sad down, satiated back) unless the scene sets `bend` or `tilt`. A lady's eye is rotated `0.13` rad so its outer corner lifts |
| **A pose is hit with a snap** | `poseAt`, `snap` | a key written `[time, look, "snap"]` is reached the way the reference cartoons hit a pose: for the first 22% of the way a small move the other way (`−0.1 · sin`), then fast (`1 − (1 − v)³`) and `0.15 · sin(π v) · √(1 − v)` past the pose, settling by the end. Other keys ease as before (`u² (3 − 2u)`) |
| **Dress from the paintings** | `person`, `tier`, `bangles` | a `tier` takes `stripes` `[down, colour, width, "zigzag"?]` that bend with the cloth; the foot band of a pha sin is dark red and blue with gold zigzags; the sabai is five strokes of one curve (20 dark red, 15 cream, 9, 6, 1.6 gold); ladies get a gold comb over the knot, three strands of gold flowers that swing `sin(late − 0.3 − 0.4n)`, a necklace, two bangles, an anklet; men a mo hom collar and pocket, a checked pha khao ma, one bangle, and `turban: colour` for a wrapped head-cloth. `dance: true` makes a lifted hand the Thai dance hand: `open = 1.6`, past 1 the fingers bend back `0.95 · (open − 1)` and the thumb comes round |
| **Woven bands** | `tier` stripes | a stripe is `[down, colour, width, kind]`; `kind` is nothing (a line), `"zigzag"`, `"diamonds"` (12 rhombi 2.8 × 3.2 along the band) or `"dots"` (16 dots r 1.4); each is placed along the band's own curve (`along(u)`), so the pattern bends with the cloth. A pha sin tier: a dark line at 0.66, gold diamonds 0.73, dark line 0.8, cream dots 0.87, gold line 0.93; the foot band: dark red 14 wide at 0.76 with diamonds and dots on it, blue 5 at 0.86 with a gold zigzag, dark red 2.5 at 0.93, gold 1.2 at 0.97. The sabai gets 11 gold dots along each border, the necklace two strands and three drops, the bangles three rings 2.2 × 10, the comb three stones, the bun a loop of 15 jasmine dots |
| **Crowds from the murals** | `crowd` | three rows, the far ones higher (−74, −38, 0) and smaller (0.6, 0.78, 0.95), every face with two dots and a mouth, every fifth near one under a red umbrella, every sixth middle man with a gong, lanterns in the evening |
| **Sets from the murals** | `house`, `temple`, `tree`, `leafClump`, `pathside` | tiled roofs (rows of tiles clipped to the roof, each lying over the one below: `roofTiles`, see "Buildings with depth"), vertical boards, eave shadow, shutters, a veranda rail; gold trim on the temple roofs and a white chedi with a gold spire; a round-canopied tree behind each house; outlined leaf clumps in the front strip of the path, which slides faster than the houses (`ROAD_FRONT`) |
| **The beat moves everything, and the dip is gentle** | `hop(t, late)`, `HOLD` | 0 on the beat, 1 half way to the next. The body rests at the bottom for `HOLD = 0.06` of a beat either side of the beat (a tiny pause), and across the rest the height is `sin(π u)^1.5`: the power above 1 slows it into the low point and out of it, so the fastest movement is through the middle. (The owner asked for the settle at the bottom; before it, `sin^0.7` left the ground fast and hung at the top.) `late` (0 to 1) shifts a person so a row does not hop as one |
| **Hips drop, knees bend** | `person` | `dip = 30 · (1 − up)` and `hipY = −190 + dip` under a skirt; `24 · (1 − up)` and `−216 + dip` in trousers, so a fellow stands taller. The feet do not move, so the knee has to bend more the lower the hips are: nothing sets the knee's angle, it falls out of the two bones |
| **The body rocks** | `person` | `rock = 0.05 · sin(π · t / BEAT + x / 100)` radians, once every two beats; hips shift `240 · rock`, the chest turns `1.4 · rock`, the head counter-turns `2.4 · rock` |
| **Cloth is a wave, not a board** | `tier` | `phase = π · t / BEAT + x / 100` (the rock's own clock). At a fraction `u` down the cloth (0 waist, 1 hem): `late = phase − 1.6u`; the edge drifts `−reach · u^1.3 · sin(late)`; half-width is `30 + (wide − 30) · u^0.75`, times `1 ∓ 0.16 · u · cos(late)` so one side swells while the other tucks in. A skirt is three tiers, lengths 1, 0.76 and 0.4 of the hem, reach 36, 27 and 14; a coat is one tier, reach 26; a man's shirt hem is a tier 60 long, reach 17. Cloth widens by `1 + dip / 280` as the body drops |
| **A hem breathes** | `tier` | six scallops; scallop `n` is `deep · (1 + 0.5 · sin(5t + 1.3n + long / 20))` deep, with `deep` 14 for a skirt, 9 for a coat, 5 for a shirt |
| **Rubber hoses** | `hose` | one quadratic curve drawn twice: `width + 2 · LINE` in ink, then `width` in colour. Control point = midpoint moved sideways by `bend ×` the length. Used for sashes, tails, the dog's legs and the microscope's arm; people's limbs are bones (next row) |
| **Limbs are two bones** | `bone`, `paintBone`, `limb`, `arm`, `legOf` | a limb is two bones of fixed length from a start to an end. The joint is found, not set: with `reach = min(distance, upper + lower − 1)`, it lies `along = (upper² − lower² + reach²) / (2 · reach)` down the line and `out = √(upper² − along²)` to one side. Of the two sides, a `prefer` function picks: a knee takes the larger x (forward); an elbow of a hanging arm goes back and down, of a lifted arm out to the side. Arm 62 + 58, half-widths 12, 10, 8.5; leg 106 + 102 (15, 12, 9.5), or 86 + 84 (9, 7.5, 6) under a skirt. A scene gives a hand as a direction; the arm reaches `clamp(1.3 · distance, 74, 116)`. Both arms are drawn last, after the body and the head (owner, 2026-10-11: "the arms stay on top of the head layer"), so an arm crossing the chest, or a hand raised before the face, is never hidden (the far arm used to go behind the body, and both went behind the head). Each bone is a shape whose sides bulge 3 past the mean width, inked by drawing it `LINE` fatter first. An arm is `open` for its first 0.4: no ink line there, so the arm runs into the chest (a line would draw a ball on the chest that turns like a wheel), and the shoulder lifts `7 · clamp(−handY / 80)` with a raised arm |
| **A hand follows its forearm** | `person`, `limb` | `limb` returns `[end, joint]`; the hand's angle is `atan2(wrist − elbow)` plus `wristA`/`wristB` (a bend at the wrist, about 1 rad for a hand laid flat on a drum head or a stone) plus the beat's flex. `grip: true` closes both hands (`open` 0.12) round a thing. Before this the hand took the shoulder-to-hand line, and a bent arm carried a hand pointing the wrong way. The hand has a heel below the thumb, a knuckle curve at each finger's base, a swell at the middle joint, and nails on bare fingertips |
| **Fingers from a hand model** | `glove`, `person`, `poseAt`, `dance_track.py` | with Google's `hand_landmarker.task` as its sixth argument, the tracker looks for each hand in a crop round its wrist, pushed on 0.45 of the forearm past it and 1.7 forearms wide, scaled up to 256 px (in the full frame it found hands in 189 of 804 frames; in the crops, 559), takes the hand whose own wrist is nearest, and reads five curls: at each finger the bends of the two outer joints, added, over 135° (the thumb over 100°), 0 straight to 1 curled; the median over five frames, and a straight line across gaps of up to ten. `fingersA`/`fingersB` then ride on 735 and 694 of the 804 poses; `poseAt` eases any list of numbers; `glove` gives each finger `0.08 + 1.3 · curl` of bend instead of one curl for all, and the thumb turns `1.15 − 1.1 · curl`. Without them a hand is the kit's own (open, loose, a fist, or the dance hand) |
| **Eyes from a face model** | `person`, `dance_track.py` | `glance: [across, down]` and `blink` may be given straight (a track reads them from the Face Landmarker's blendshapes: gaze from eyeLookIn/Out/Up/Down, blink from eyeBlink, `wonder` from browInnerUp and eyeWide, `smile` from mouthSmile, the mouth from jawOpen past 0.12); otherwise the eyes wander and blink on their own clock |
| **What hangs, follows** | `follow` | an earring, the ends of a sabai or a pha khao ma, the jasmine loop, the pin strands, a tail of hair and the drum on its strap each hang from a pivot. Every frame `follow(key, lx, ly, stiff, damp, limit)` reads where that pivot is on the screen (`pen.getTransform()`), its speed and its acceleration, and moves a free end on a damped spring thrown the other way: `s += (−stiff · d − damp · s − a) · h`, `d += s · h`, in four steps of `h = dt / 4`, the up-and-down acceleration counted at 0.35, the lag capped at `limit` screen pixels and given back in local pixels. Sabai ends 60 / 7 / 40, waist cloth 60 / 7 / 30, earrings 200 / 8 / 10, garland 150 / 9 / 8, pins 120 / 7 / 10, tail 50 / 6 / 40, drum 40 / 5 / 30. The state is kept under `key` from frame to frame: `look.id`, or else the n-th person drawn in the frame; a key that jumps across the screen (a cut), or whose clock runs backward or stops for longer than 0.25 s, starts again at rest. The head itself follows: `follow` on the neck (90 / 7 / 30), turned into a tilt of 0.004 rad per pixel of lag, so the head lags the body and overshoots as it stops. (The Follow rig of Willett et al., UIST 2017, written for the kit.) Before this, everything that hung swung on the beat clock, whatever the body did |
| **A knee pushes the cloth** | `tier`, `person` | `tier` takes `pushes`, `[x, y, reach]` points measured from the waist; `person` hands the skirt and the sarong both knees as `limb` found them, reach 44. At a level within the reach of a push on its own side, the edge moves out to `|x| + 12` of cloth, by `1 − (dy / reach)²`, so a raised knee makes a bulge over itself and the shin shows below the hem; a standing knee is inside the cloth and changes nothing. Before this a raised leg came out from under the side of the pha sin |
| **A walker's arms, hips and breath** | `person` | with `step` and no hands given, `swing = cos(2π · step)`: the near hand is `[18 + 12 · swing, 94 − 20 · max(0, swing) − 4 · max(0, −swing)]` (hanging at the hip, the arm nearly straight), the far hand its mirror, so each arm goes with the leg on the other side, the forward hand lifts with the elbow bent, and the two never meet in front of the body (a sideways swing of 34 did meet, in a figure seen from the front). The hips rise as a leg passes under them, `hipY += 4 · cos(4π · step)`, and sway with the stride, `hipX += 5 · sin(2π · step)` (and the spine's own sway on top: next row). Everyone breathes: the chest and all above it scale `1 + 0.007 · sin(1.5t + 0.02x)` tall and `1 + 0.004` wide |
| **The spine bends and sways** | `spine`, `swayAt`, `outline`, `CHEST_LADY`, `CHEST_MAN`, `STYLE.sway`, `person` | the torso was a plank that turned about the waist (owner, 2026-10-11: "Spine is stiff for the model. Introduce some sway"). Now `spine(y)` says how far across the middle of the torso is at height y, with `u` 0 at the waist and 1 at the shoulders: `−arc · 136 · u · (1 − u) + 136 · u^1.5 · swayAt(0.7 · u)`. The first part makes a lean an arc: `arc = 0.6 ×` the turn of the frame (bend + rock + a walker's lean), kept within ±0.22, so the waist stays nearer upright, the chest carries on, and the side leaned toward folds. The second is the sway, a wave up the spine: `swayAt(late) = STYLE.sway · (0.08 · sin(π t / (2 · BEAT) + x / 100 − 0.6 − late) − 0.08 · sin(2π · step − late) in a walk) + look.sway`, once every four beats when standing, later the higher up. The hips go the other way (`hipX −= 45 · swayAt(0)`), so a walker's hips swing under shoulders that stay nearly still; the head is reached last (`+0.6 · swayAt(1.3)` on its tilt). The chest's outline is a list of points (`CHEST_LADY`, `CHEST_MAN`) and `outline(points, spine)` moves each across by its height before drawing, so the bent torso is one curve drawn once; the sabai's three points, each button, the collar, the pocket, the pendant, the neck, the head, the arms' roots and the drum's strap take `spine()` at their own heights. `STYLE.sway` scales the kit's part (0 for none); `look.sway` adds a scene's own lean. Tried first and dropped: drawing the torso in ten flat bands, each slid and slanted (it bends anything, but the model sheet went from 61 ms a frame to 106; moving the points left it at 56) |
| **An arm keeps to its joints** | `SHOULDER`, `ELBOW`, `armJoints`, `bendOf`, `arm`, `checks/arms_check.py` | (owner, 2026-10-12: "Arms rotate at the shoulder 360. They shouldn't do that. Make a rule so that upper arms never rotate to point in an inward arc towards the spine. Make a forearm rotation rule as well.") An arm's angles are measured from straight down, growing toward the arm's own side: 90 is out to that side, 180 straight up, below 0 in toward the spine. **The shoulder rule:** `SHOULDER = [−30, 200]`: the upper arm keeps to the arc from 30° in as it hangs, round the outside, to 20° past straight up, and never points into the 130° between; a hand that asks for that gets the upper arm at the nearer end of the arc and the forearm does the rest. **The forearm rule:** `ELBOW = 150`: a forearm folds at most 150° from straight, to either side, so it never lies flat along the upper arm. `armJoints()` makes each of the two elbows that reach a wrist keep both rules, then takes the one the arm likes better (back and down when it hangs, out and down when lifted, less `6 ×` how far the rules left the wrist from where it was asked). **Neither joint jumps:** `bendOf(key, gain)` remembers each arm's bend under `who + "/armA"`: of two elbows as good as each other it keeps the one it has (the other must be better by 2), and a change takes a fifth of a second, the elbow going by way of the shoulder (the upper arm draws in until it points at us, 12 out) instead of sweeping across the chest. A hand lying on its own shoulder points nowhere in particular: within 25 of the shoulder the arm leans on the way it pointed the frame before. The first complaint was the sister at the door, whose elbow flipped: her far hand was set at `[−30, 40]`, exactly along the line the old rule decided by, so its two elbows scored the same and rounding picked one or the other each frame. `python checks/arms_check.py lanna.html` draws every frame and counts what an arm cannot do. Before and after, by that one measure: `lanna.html` 240 flips, 1,503 inward arms, 108° the biggest turn in a frame → 0, 0, 36°; `village.html` 0, 600, 13° → 0, 0, 26°; `model.html` 7, 400, 107° → 0, 0, 33°; `dance.html` 69, 2,188, 168° → 7, 0, 70° (the seven are frames where the dancer's wrist is tracked within 12 units of her shoulder) |
| **A track's arms on their own shoulders** | `dance_track.py` | the same check showed why the dancer's arms crossed her body most of the time: the tracker gave the kit's arm A (hung from the shoulder on the picture's right) the dancer's right arm, which is on the picture's left. 69% of her right hand's readings pointed away from the shoulder they were drawn from. Now A is her left arm and B her right, the lifted leg is counted from the picture's left as the kit counts, and each hand's fingers go with it; after the change 77% and 69% of the readings point to their own side |
| **The shoulders tip one way, the hips the other** | `shoulderTip`, `hipTip`, `chest`, `person`, `dance_track.py` | (owner, 2026-10-12: "If a character moves right, the right shoulder should dip a bit and the left should rise and vice versa. The line joining the hips should act opposite the shoulder line.") `moved = hipX / 12` is how far to one side the hips have gone (about 1 at the end of a rock). A line's tip is an angle, above 0 when its right end is the lower: `shoulderTip = 0.05 · moved` and `hipTip = −0.13 · moved`, both on top of the lean the body already has (which is `1.4 · rock`, so the lines come out about +0.12 and −0.06 at the end of a rock to the right). `chest(px, py)` puts each point of the chest where the spine has bent it and tips it by `hipTip` at the waist to `shoulderTip` at the shoulders, so the side the body has moved to folds and the other stretches; the arms hang from the tipped shoulders; the skirt, the shirt's hem and the waist cloth are drawn sheared by `hipTip`; each leg starts from its own end of the hips' line. A walker's hips now go over the foot on the ground (they went the other way: `hipX −= 5 · sin` and the sway's sign), so the standing side's hip is the high one and its shoulder the low one, as a body stands. A track gives `shoulders`, the dancer's shoulder line as the pose model found it (never taken shorter across than half the widest her shoulders get, kept within ±0.35), and the hips answer `−0.6 ×` it. Her own hip line was measured and not used: of 115 poses with both lines clearly tipped, they went opposite ways in 36 |
| **An arm that hangs is almost straight, and its hand is at rest** | `arm`, `REST_A`, `REST_B`, `person`, `glove` | (owner, 2026-10-12: "their arms are bent at the elbow unnaturally. They should be more straight and they're holding their hands in an unnatural way as well.") Two causes. The film gave its walkers fixed hands close to the shoulder (`[30, 60]`, `[−20, 70]`), and a hand given close bends the elbow to reach it: 87° there, with no swing. And every hand that hung was the half-closed hand with its fingers curled toward the thumb's side, which on a hanging arm is forward and up: a cupped hand held out as if to carry something. Now an arm reaches `min(119, 1.3 · far)` of its 120 (it was 116): an elbow of 15° where it was 30°. With no hand given an arm hangs at `[±12, 97]`, and a walker's swings from the shoulder with the leg on the other side, `[12 + 16 · swing, 97 − 12 · max(0, swing)]`: an elbow of 22° going forward, 15° going back. A bare hand below its shoulder, holding nothing and with no reading of its fingers, is at rest: `REST_A = [−0.17, −0.2, −0.23, −0.29, 0.55]` and `REST_B = [0.05, 0.08, 0.11, 0.17, 0.55]` as `curls` (the fingers together, bent 14° to 29° toward the body, the little one most, the thumb lying 28° off them; A's fingers bend away from the thumb's side and B's toward it, because the palm faces the leg), spread 0.06, the wrist's flex 0.3 of what a busy hand has, each finger's own wobble 0.03 instead of 0.1. In a film where nobody hops (`hop: false`) a hand at rest has neither: no flex and no life in its fingers (`pose.still`), so it hangs still (owner, 2026-10-19: "the woman's hands are shaking. Can you make them still?": in the sash film's pull-back each hand turned ±3.7° against its forearm twice a second, up to 6 px a frame on the screen; now 0). In `lanna.html` the walkers and every free arm are given no hand at all |
| **A step rolls through the foot** | `person`, `foot`, `shoe` | a walking foot used to land flat and leave flat. Now, with `ball` the distance from the heel to the ball of the foot (0.72 of the foot's length: 48, or 40 for a lady, 66 and 50 in shoes): on the ground (the first half of its stride, going back at the walk's speed) it lands on the heel with the toes up 0.3 rad, is flat by 15% of the way, and from 65% the heel rises as the foot turns about its ball, to `0.55 · ((s − 0.65) / 0.35)^1.3` rad, the heel `ball · sin` up and `ball · (1 − cos)` forward; in the air it eases from that turn to toes-up 0.3 again, lifted `ball · sin(0.55) · (1 − w)² + 16 · sin(π w)`. A turned foot carries its ankle round the heel (the ankle is 6 forward and 22 up from the heel), so the leg still meets it, and the knee answers through the two bones. A foot lifted on purpose (`raise`) is as it was |
| **A pen does not grow with the picture** | `FINE`, `LINE`, `person` | every stroke was scaled with its figure, so the 4.4-times head was inked 8 px thick, where a hand-drawn close-up keeps nearly the same pen. `person()` sets `FINE = min(1, (size / 1.3)^−0.7)` and `LINE = STYLE.line · FINE` while it draws, and puts both back: the usual pen up to the film's usual size, 0.74 of it at size 2 (2.8 px on the film where it was 3.8), 0.43 at 4.4 (3.5 px where it was 8.3). Thirty-four pen lines written as numbers take `· FINE` as well (lids, lashes, lip lines, creases, toe lines, comb lines, the hair's outline, the ear, folds); widths that are the thickness of a thing do not (a sabai's bands, a collar, a necklace, the lips, a hose's body). Never heavier: a first try let small figures have a heavier pen, and their eyes filled in |
| **Consonants shape the mouth** | `onsetOf`, `ONSETS`, `mouthAt`, `ladyFace`, `manFace` | `onsetOf` reads the consonant a syllable starts with from its Thai spelling (passing over a leading เ แ โ ใ ไ and a silent ห or อ): `lips` for ม บ ป พ ผ ภ, `teeth` for ฟ ฝ, `tongue` for ล ร น ด ต ถ ท ธ ณ, `hiss` for ส ซ ศ ษ, nothing for the rest. For the syllable's first 0.05 s the mouth is that shape (lips shut at 0.02 open; teeth on the lip at 0.16; the tongue up at 0.38; a wide hiss at 0.14), gone by 0.08 s as the vowel opens from 0.05 s. A lady's open mouth is `(1.5 + 7.5 · open · (1 − 0.3 · wide)) · (1 − 0.25 · round)` tall and `7 + 5 · wide − 2.5 · round + 3 · open · (1 − round)` across, so "ah" is wider than tall (it was 11 tall by 8 across and read as shock), with teeth at the top and a tongue at the bottom past 6 tall. The tongue is a `Path2D` of its own: drawn as the current path it replaced the mouth's, and the lips (a lady's red, a fellow's ink line) were drawn round the tongue instead of round the mouth; every singing fellow had that ring since the mouths were first made |
| **Lids, lashes, a smile, a sheen** | `eye`, `ladyFace`, `person` | `eye` takes `shut` as 0 to 1 and lowers the upper lid's arch by `0.85 · shut` (past 0.9 the eye is a line); the upper lid throws a shadow on the white and the iris (a stroke `0.55 · tall` wide along the lid in `rgba(90, 50, 50, 0.22)`, clipped to the eye, so only its lower half shows); in a blink the brows drop `2 · shut`; a lady's lid carries two more lashes on its outer half (at 0.74 and 0.86 of the lid's curve, 5.5 and 4 long, leaving the lid along its normal and leaning 0.6 outward), besides the flick; a smiling mouth has a bow in the upper lip (peaks at 21 and 27, the middle at −246), the line where the lips meet, and a light `5 × 1.5` on the lower lip; the hair takes a radial sheen (`rgba(255, 235, 210, 0.3)` to nothing over 48, at (14, −350)) clipped inside its mass, and five comb lines instead of three |
| **Hands in the manner of the paintings** | `glove` | (round 22) bare on everyone unless `gloves: true`: four slender fingers 2.5 half-wide and 12.5 long (× 1.02, 1.16, 1.08, 0.84 from the thumb), 5.2 apart, palm 9.5, wrist 6.5; the little finger curls `0.1 · n` more than the first; the dance hand (`open` 1.6) bends back `0.5 · 0.6` at the knuckle, then 0.3 and 0.1 of that at the next joints, fans `0.22 · 0.6` more, and turns the thumb `1.3 · 0.6` to the first finger (it used to bend back `1.15 · 0.6` at every joint, into a C, and fan `0.35 · 0.6`: a sea anemone). Fellows' hands are 1.1 times a lady's 0.95; gloves 1.25 |
| **A hand is one shape** | `glove` | never ovals round a ball: that reads as a paw. A palm (narrow at the wrist), fingers of three joints (lengths 0.8, 0.62 and 0.5, each bending more than the one before, so a closing finger rolls up) and a thumb of two are painted in three steps: the whole hand in ink, `LINE` fat (the outline); then one finger at a time, a thin line of ink (0.55 of `LINE`) and its colour, so the line between two fingers runs their whole length; then the palm in colour last, so no line crosses where a finger begins. No two fingers are the same length (from the thumb: 0.98, 1.12, 1.04, 0.8), and a bare finger narrows to 0.7 at its tip. `open` (0 fist, 1 spread): `spread = 0.04 + 0.2 · open` between fingers, times `0.6 + 0.4 · |place|`, so the outer fingers part more than the middle two; `curl = 0.12 + 1.0 · (1 − open)`, of which the joints take 0.4, 0.75 and 0.55 in turn, toward the thumb's side, and each finger adds `0.1 · sin(7t + 1.7n)` of its own; a bare finger's sides bulge only 0.3 of a glove's, so the knuckle barely swells. A lifted hand is `0.7 + 0.3 · up` open, a hanging one 0.35. The wrist bends `0.22 · sin(2 · phase − 1.1)` after the arm. Fellows: white glove, three fingers 7 wide, a rolled cuff across the wrist, three lines on the back, 1.25 times. Ladies (`bun`): `bare`, four fingers 3.1 wide, no cuff, 0.95 times. The thumb's side is given: a raised hand turns its thumb to the head |
| **A bare hand runs into its wrist** | `person` (`drawHand`), `hand` (`pose.wrist`), `hull` | (owner, 2026-10-27: "no line between hand and wrist ... connect seamlessly to the wrist") the palm reaches 13 back over the forearm and its outline drew a ring there. On a bare arm the hand and the forearm's end are painted as one shape, as a limb's two bones are: all the ink (the hand's outline, and the wrist: the hull of the forearm's round end and the palm 4 past the wrist), then the colour (the forearm's end painted again over the hand's line, the wrist, the hand); the hand's thin lines only past the wrist. A sleeve keeps its edge and a glove its cuff. Notes: `docs/kit/figures.md`, "A bare hand runs into its wrist" |
| **Fingers run into the palm** | `hand` (`roots`) | (owner, 2026-10-27: "Do the same thing for finger / hands") no line where a finger or the thumb begins: the thin line of a finger's first bone and the thumb's first is left out round its root and fades in along its sides; the palm's line fades out toward the knuckles; the heel is one unit with the palm. Lines elsewhere stay (a curled finger over the palm, a finger over its neighbour). Notes: `docs/kit/figures.md`, "The fingers and the thumb run into the palm" |
| **Bare feet** | `foot` | the default since round 25: heel at the ankle, the top of the foot sloping to the toes, the big toe first of four, three toe lines, a nail, a shadow in the arch; 48 long for a fellow, 40 for a lady (with an anklet). `shoes: true` brings the 1930s shoe back. A `sarong: colour` on a man is one 196-long striped tier over bare legs; `yak(brush, x, base, facing)` is the temple's painted guardian, placed in pairs by `temple` |
| **Feet (1930s)** | `shoe` | heel at the ankle, toe toward the way the person faces, sole line, heel front; a lifted foot tips by `0.5 · lifted` radians |
| **Proportions** | `person` | about four and a half heads tall. Lady: shoe 0, hip −190, shoulder −316, head centre −390. Fellow: hip −216, shoulder −342, head centre −416. All before `size × 0.82`. A neck 44 tall joins chest and head. The head is one path with a brow, a cheek, a jaw and a chin, turned a little to the side, scaled 0.84 × 0.92; the jaw drops up to 11 when a fellow sings, 4 for a lady |
| **Faces with more realism, from the thangka, Khmer and Lanna faces** | `STYLE.lids`, `STYLE.face`, `realEye`, `lidLine`, `LIDS`, `lidOf`, `REAL_HEAD`, `featherBrow`, `skinBands`, `realNose`, `realShutMouth`, `realLip`, `softSpot`, `softStroke`, `headSkull`, `realfaces.html` | (owner, 2026-10-29: "suggestions for redrawing the humans, particularly the faces to give more realism"; of three candidates beside the kit's face, "A for everyone", "Yes, take B" and all of C. Research and pictures: `docs/kit/figures.md`, "Faces with more realism".) Both are the kit's own now; `FILM_STYLE = {lids: "folded", face: "painted"}` draws the faces of before, pixel for pixel but for the comb lines below. **The eye** (`STYLE.lids "real"`, `realEye`): the inner corner `0.05 ·` the half-width `w` lower than the corner, the outer `0.02 · w` higher, and the eye turned 0.08 rad more; the upper lid a cubic through controls 0.15 and 0.6 of the way from the inner corner, `1.3` and `1.33 ·` the lid's height up, the lower through 0.35 and 0.8, `1.33 · 0.17 w` down, so the upper lid peaks nearer the nose and the lower is lowest nearer the outer corner; the white `#f2e9df`, greying to 0.38 at the corners; the iris `0.43 w` across the half, never more than `0.3 w` from the middle (the kit's iris had no limit, and in three-quarter it sat in the outer corner: a sly look on every face), its foot `0.1 r` under the lower lid, brown `#7c5434` to `#160c05` with its foot lit, a pupil `0.4 r`, one light; the upper lid's shadow over it, blurred; a pink inner corner. The lid line (`lidLine`) is a filled shape, `LINE · (0.3 + 1.45 u^1.2)` thick at a fraction `u` from the inner corner (a fellow's 1.15), thinning in its last tenth, a lady's carried `0.14 w` past the corner. Above it the lid of `look.lid` (`LIDS`): a crease `0.62 ·` the lid's height above it from 0.2 of the way, a hooded fold `0.32 ·` from 0.35, lowest over the outer corner, or none; unless told (`lidOf`) a lady's creased, a fellow's and an old person's hooded, a child's none. The lid's height is `0.46 w` times the feeling's opening; a fellow's eye is `0.76 ·` his view's width where it was `0.93 ·` (as wide as a lady's). Shut, a laugh, a slanted lid (`slantedLid` at `0.8 ·` the lid's height) and tears are as before. **The head** (`STYLE.face "real"`, `REAL_HEAD`, in `view()`): the skull's top points 4 to 9 lower, the hair's top 6 to 9 lower and its hairline 3 to 6 higher, the knots on the head 8 lower; the brows 2 higher and a fellow's down to 20 above his eyes (they were set high for a head-cloth, 30 above); the nose's base at −258 (−253) and the shut mouth's middle at −248 (−244): measured on a lady in three-quarter, the forehead, nose and lower face were 0.28, 0.45 and 0.28 of the face, where the thangka's are a third each. Each comes back to the painted profile's place as the head turns to profile (`· (1 − side)`). **The paint**: the face's line `blend(SKIN, "#6b3022", 0.7)` at `0.85 · LINE`, with no heavier side (a thangka outlines in lac or indigo, not black); `skinBands`: blurred shade in the hollow of each eye toward the nose (0.1), the far cheek turning away in three-quarter (0.2, gone at profile and full face), under the jaw (0.12, which takes back the owner's "no shadow on the chin" of 2026-10-12 at his word), a light on the near cheekbone; the rouge 0.13 and up on the cheekbone; `realNose`: a shadow down the near side of the bridge, a light down it and on the tip, a shadow under the base, the nostrils and their wings, the near nostril staying in profile; `realShutMouth`: lips of `realLip()`, the skin blended 0.68 toward `#b9525c` (a child's or an old woman's 0.45, a fellow's 0.42 toward `#a85a56`), the upper lip darker with its bow, the lower with a gleam, the line where they meet deepest at the corners, the groove above, the shadow under; an open mouth keeps its shape, its lips the same rose; `featherBrow`: a soft mass and 44 hairs standing up at the inner end and lying along the brow toward the tail, as wide as it would be with the kit's eyes (a child's `eyes: 1.4` made them meet). Soft is painted with gradients (`softSpot`, a spot strongest at its middle) and strokes laid three times, wide and faint to narrow (`softStroke`), never a blur: the first version blurred (`pen.filter`), and on a sheet Chrome draws in software, as kit_check and the Spark's renders do, a face was 12 to 14 times as slow (`northfaces.html` 1,698 ms a frame against 121 before the faces; 211 with the gradients). Found and mended with it: a fellow's comb lines ran out of his hair onto his brow; they are clipped to the hair and the space above it, where they rise to the knot |
| **A lady's face, by the painting** | `ladyFace`, `eye` (`lashes === 1`), `blush`, `person` (`head`) | (owner, 2026-10-12, of the three-quarter face: "The 3/4 face looks funny"; set beside the three-quarter face of a Royal Thai Art painting it was a wide oval with large round eyes set high and far apart, brows up at the hairline, a shaded nose with a hook, a wide mouth and two discs of blush.) The face runs from the hairline at −316 to the chin at −229. **Eyes** at −277, the middle of it: half-widths `0.77 ×` and `0.78 ×` the view's (11.6 and 9.8 at three-quarter: each about a third of the face across, the far one 0.85 of the near), 4.6 and 4.4 tall (they were 7.2), 4 and 3 nearer the nose. A painted eye (`lashes === 1`) has a lid line `0.95 · LINE` with a flick as long as the eye is, a dark iris `1.15 ×` the eye's height that touches the lid, one light, no lashes, and its shadow at 0.07. **Brows** thin arcs (1.1 heavy, arch 9, `1.3 ×` the eye's half-width) at −292, one eye-height above the eyes (they were at −312). **Nose**: one faint line (0.3, `0.5 · LINE`) from beside the eye to the tip at −259, a small curve round the tip to −253 and a nostril curve beside it; no shading, no hook. **Mouth** drawn `0.76 × 0.82` its old size about (24, −244). **Blush** `0.2` strong (it was 0.42), radius 15, low on the cheek. **Head** `look.head`, 0.9 for a lady unless told and 1 for anyone else: the head is scaled `0.84 · head` wide and `0.92 + 0.3 · (1 − head)` tall, lifted 12 on a neck 11.5 by 34, its jaw drawn in by 3 to 4, and its skin left nearly flat (the shade at the back 0.12 for 0.3). There is no shade under the jaw, on anyone: the owner, 2026-10-12, of a man's face, "Take the shadow off the chin" (it was an ellipse 40 by 9 at 0.16, 0.05 on a lady). A child with a bun is given `head: 1` and keeps the round head |
| **A lady's profile, by the painting** | `view(turn, lady)`, `HEAD_SIDE`, `HAIR_LADY_SIDE`, `profilePiece`, `NOSE_TIP`, `strokeOutside`, `ladyFace` | (owner, 2026-10-12, of the side view on the fon lep doll: "The side view of the face looks weird." It was a round head with a bulge where a nose is, a dot of a mouth, a chin that fell away and a large ear in the middle of the cheek.) **The painting**, measured by the other session on the profile of a painted fon lep dancer, as parts of the head: the forehead slopes back from the brow; the brow runs into the nose with a dip of 1/80; the nose is one straight line 0.3 long, 25 degrees forward of the face, with no bump and no ball; the lips stand 0.055 behind the tip and the chin 0.045 behind the lips; the jaw is a straight line 20 degrees off level, to under the ear; the eye is 0.19 long, its front corner 0.045 behind the bridge; the ear is small, its front edge 0.55 behind the tip. **In the kit** (in the head's own units, which are drawn 0.756 as wide and 0.95 as tall): the skull keeps its fourteen points, with a flat front at x 52 to 57. Before it stands a piece of its own (`profilePiece`; curves are given by their control points): out of the forehead at (56.2, −304), along its slope; the brow by (58.2, −296.5) to (56.3, −291); the dip by (55.5, −288.6) to (57.5, −286.3); one straight line to (72, −262.2); a small round tip by (74.5, −260.4), (74.5, −258.2) and (74.5, −255.4) to (71.8, −254.6); back under it to (62.8, −253.6); the upper lip by (67, −247.3); the lips meeting at (63.8, −243.6); the lower lip by (67, −242) to (65, −239.2); the hollow under it by (59.5, −237); a small round chin by (62.5, −229) to (54, −226.8); and back along the jaw. On the film that is a nose 0.30 of the skull's height long, at 25 degrees (from the dip at (56.1, −289.6) to the tip at (74.5, −258.2); the skull is 117 tall, from −346 to the chin at −229). The eye sits at 37 with a half-width of 11.9 and its iris 2.2 forward; the brow is 3 lower than at three-quarter; the mouth is the same bow, 1.45 as wide, with its middle at 64.5, on the edge of the face, and it is cut by that edge (`V.face`), so only the near half of it shows; the ear is at −17 and 7.5 by 9.5 (it was 11 by 14, at −24, half on the hair); the hairline meets the forehead at −329 (it was −316) and passes just behind the ear; the nostril's curve stays and the nose's other inner lines fade. **How it comes on**: a weight `side = a²(3 − 2a)`, where `a` is how far the turn is below 0, moves every key from where the old blend has it to the profile. From three-quarter to full face nothing moves: the kit before and after was drawn on eight pages, twelve frames each, and a frame differed by 0 to 6 pixels, which is what two loads of one kit differ by. The piece slides: its tip is always at `V.tip`, where the face draws the tip of the nose, so the nose is the first of it to leave the face, and its chin is held up inside the jaw by `5 · (1 − side)` until the profile has come. **One line round two shapes**: `strokeOutside` inks each only where the other is not. The earring is now painted after the ear when the ear stands before the hair; it was painted before the head, and the head hid it in profile. A fellow's profile is the row below |
| **A fellow's profile, of the same build** | `view(turn, lady)`, `HEAD_SIDE`, `HAIR_MAN_SIDE`, `profilePiece` (`lady` false), `manFace` | After the lady's, a fellow's side view was still the round head with a bulge. No painting was measured for him (the murals' men are drawn three-quarter); his profile is the lady's build with his own face's measure, as his three-quarter face is hers "drawn bigger and broader". The skull is the same one. His piece (`profilePiece`, control points again): out of the forehead at (56.4, −306); a heavier brow by (59.6, −298.5) to (56.6, −292); the dip by (55.6, −289.4) to (57.8, −287); a straight line to (71, −266.5); a blunt round tip by (75.6, −263.6), (75.8, −260.4) and (76, −256.6) to (71, −255.6); back under it to (63, −255.4); the upper lip by (66.4, −248.6) to (63.2, −246.4); the mouth at (62.4, −245.6); the lower lip by (66.4, −244) to (64.4, −240.4); the hollow by (60, −238.6); a fuller chin by (65, −228.8) to (55.5, −226.2). On the film (his head is drawn 0.84 wide and 0.92 tall) that is a nose 0.30 of the skull's height long at 31 degrees, where hers is at 25: as long, further forward, and blunt. His eye sits at 36 with a half-width of 12.1 and its iris 2.5 forward; his mouth is the same smile line, as wide as at three-quarter, with its middle on the edge of the face and cut by it, so the line runs from its near corner to the silhouette, and an open mouth is a wedge at the edge with its teeth and tongue; the wing of the nostril and the nostril stay, the bridge and the tip fade into the outline; the ear is at −20 and 9.6 by 12.2 (it was 11 by 14 at −24); the hair meets the forehead at (44, −332) (it was at (56, −330), which would now stand in the air before the forehead). The head-cloth, the hat, the shaved head and a child's head sit on the same skull and were looked at in profile. With it: a shaved head no longer has the curl of hair at the nape that every fellow has (it showed on the monk in every view) |
| **What hangs, hangs straight down** | `person`: `tilted`, `upright`, `hung` | A pose or a feeling tilts the head (`tilt`), and the head's own frame turns with it. So did the tail of hair, the pin strands, the garland and the earrings: at a tilt of −0.45 the tail swung in across the neck. Each now hangs along the film's own down. `upright = −atan(tan(tilt) · tall / wide)` is the turn that takes the tilted frame's "down" back to the film's (the frame is 0.756 wide and 0.95 tall, which is why the ratio is there), and `hung(x0, y0, across, along)` places a point of a hanging thing by it. The tail is drawn in a frame turned by `upright`; the strands, the garland's sag and the earrings are placed point by point. The head's small rock and sway still carry them, and `follow` still lags them. With no tilt, `upright` is 0 and nothing changes |
| **Faces in the manner of the murals** (a fellow's still; a lady's is the row above) | `eye`, `brow`, `ladyFace`, `manFace` | (round 22, from the Wat Phumin photographs) a lady's eye is 15 × 7.2 and 12.5 × 6.8, rotated 0.17 rad so the outer corner lifts, its upper line 3 wide running on past the corner in a flick (`quadraticCurveTo(wide + 4, −3, wide + 8, −7)`), no separate lashes; brows 1.6 and 1.5 heavy, 15 and 13 long, arch 12 and 11, at −312; nose line `0.85 · LINE`; shut mouth a bow 19 wide with two peaks and a fuller lower lip in `#c8303f`. A fellow's eye 14 × 8.5 and 12 × 8, brows 2.8/2.5, mouth 26 wide. Necks: 28 tall for a lady, 24 for a fellow; the head sits 8 (lady) or 3 higher. Men and children wear a topknot with a gold pin. Skin `#f4d6b8` |
| **Two faces (before round 22)** | `eye`, `brow`, `ladyFace`, `manFace` | an eye is an almond: upper lid a high arch (control point `1.9 · tall` up), lower lid nearly flat, a brown iris clipped by the lids so the upper lid hides its top, two lights, a fold above; the far eye is smaller. Lady: 12 × 8.5 and 10 × 8, three lashes at the outer corner, thin brows, a nose with a bridge, a tip and one nostril, heart lips, rouge as a soft radial `blush`, never a hard circle. Fellow: 13 × 11 and 11 × 10, no lashes, thick brows, the lady's nose drawn bigger and broader (never a ball stuck on the face), a mouth 34 wide under the nose (not a grin from ear to ear): shut, one line that turns up at the corners; singing, it opens `6 + 12 · (1 − up)` downward from the upper lip, with teeth at the top and a tongue below, both clipped to the mouth |
| **Blink, sing, glance** | `person`, `saccade` | a blink every 3.3 s, at `(t + 0.013x) mod 3.3`: the lid drops over 0.08 s and lifts over 0.16 s; a track's `blink` score sets the lid as `(blink − 0.15) / 0.55`. Mouth open while `up < 0.55`. The eyes hold and jump (`saccade`): the clock is cut into 0.55 s cells, a cell with `dice(7n + 3) < 0.45` is a jump, done in 0.05 s, to a spot `±3` across and `±1.2` down from `dice`. (Before: shut for 0.13 s, pupils drifting `3 · sin(1.3t + x)`) |
| **Hair is a mass, and locks** | `lock`, `curl`, `combed` | never a pile of balls. One filled shape with a wavy hairline and comb lines, plus locks. A lock is 8 slices from root to tip; at a fraction `down`, its middle is `x + 0.3 · wide · sin(3.4 · down) + swing · down² · sin(phase − 2.4 · down)`: the root is fixed, the tip swings furthest and latest. It ends in a `curl`, a filled oval with a spiral line. Hair runs 0.9 behind the body's rock; `swing = 9 + 9 · up` and length `× (1 − 0.1 · up)`, so it spreads and floats at the top of a hop. A lady has two locks down the back (112 and 96 long), one before the ear, a wisp at the brow, and a knot of three curls that sinks `5 · (1 − up)`. A fellow has a quiff whose tip drops `12 · (1 − up)`, and a tuft at the nape |
| **Paint follows the form** | `paintBone`, `person` | light comes from the front and above. A bone is filled, then darkened all over at 22% inside its own outline, then filled again moved `0.4 · width` toward the light: what is left is a shadow down the far side. The chest gets a gradient from 34% at the back to nothing by x = 14, and the head's shadow on the shoulders; the head gets one from 30% at the back, and one under the jaw. No white highlight ovals: they read as stickers. Cloth (`tier`) gets the same back-to-front gradient at 30%, and a band of shadow under the tier above |
| **The line** | `LINE`, `inkFor`, `heavy`, `shape` | one weight everywhere, `LINE = 2.3` (finer on a figure larger than the film's usual size: see "A pen does not grow with the picture"), about a third of what looks right at first. Its colour comes from the paint inside it: `inkFor` mixes the fill 84% toward the ink, so the line round a red skirt is dark red. It is heavier below and to the left, away from the light: `heavy` sets a canvas shadow of the ink colour at (−1.1, +1.1) with no blur while the line is drawn, which draws the line twice |
| **Sets are watercolour** | `hills`, `house`, `palm`, `banana`, `clouds`, `pathside`, `wash` | no ink on backgrounds except a thin brown line on ridges and houses; `blur(3px)` far, `blur(1px)` near; `wash` lays ~1 soft blob per 9 px of width at 5 to 7% |
| **A chest has a front and a back** | `person` | seen a little from one side: the back edge runs nearly straight to the shoulder blade, the front swells, and the shoulders slope from the neck. Lady (`bun`): shoulders ±45, a bust at y −62, waist ±25. Fellow: shoulders −52 to 56, fuller low down, waist ±30. An egg with a head on it is what to avoid |
| **One line round a whole animal** | `dog` | body, neck, tail and two-bone legs go into one list of bones, all painted in ink and then all in colour, as a hand is: no line cuts a leg off from the body. Legs trot in crossed pairs, and a lifted paw pulls its knee up |
| **A light has a source** | `lantern` | a khom loi is brightest low down, by its flame, and darker at its closed top: a gradient up the paper, a white glow clipped inside it, two bamboo hoops and two seams, a ring at the mouth and a flame below. It leans `0.09 · sin(1.4t)` and its glow flickers on two sines multiplied |
| **Animals act in three parts** | `rooster` | one crow every two beats: sink first (`stretch` to −0.35 for the first fifth), then the neck up 20, head back 0.55 rad, beak open, wing lifted and shaking, tail fan raised; then settle. Tail feathers each swing 0.6 rad of phase after the one before |
| **Far people** | `crowd` | no outline, body + head + hair cap, bobbing `9 · hop` each with their own `late` |
| **Old film** | `film` | scenes are painted on a hidden 1440 × 1080 sheet, then copied to the screen with `blur(0.6px) saturate(1.08) sepia(0.1)`, shaken ±1.5 px, under grain (3 sheets in turn), 3 to 7% flicker, 4 dust specks, a scratch in 6% of frames, dark corners |
| **Words of a song** | `subtitle(big, small)` | drawn on the screen after the lens, grain and shake, so they stay sharp: the sung line at 58 px, its meaning at 36 px italic, both with a dark outline. A film with a cue sheet calls `words(t, CUES)` after `film()`: the line is on the screen from its first beat until half a beat after its last syllable. (`village.html` keeps the older list `[from, to, line, meaning]` in seconds, worked out by hand from the beats) |
| **Cuts** | `iris`, `curtain`, `card` | **between scenes, a fade through black**: the last 0.75 s of a scene fade out to black and the first 0.75 s of the next fade in from it (`film()`: `cutFade`, `CUT_FADE` 0.75, eased; inside a film the music and the voice carry on through it; where two films meet, `chain.py` fades their sound too), as `chain.py --fade 1,0.75` joins the hero film's night of dancing to the studio's card (owner, 2026-10-21: "change between scenes like between the night dancers and SLS scene rather than without a transition between scenes"; of the films then, "Some scenes hard cut but there is one with a smooth transition": the round iris that closed and opened over 0.5 s at every cut read as a hard cut beside that fade). The fade is taken from the scenes' own seconds, so no scene grows longer and no line of words moves. `iris()` stays in the kit for a film that asks for it. A red curtain parts over 1.6 s; cards are cream with a double red rule |
| **The camera** | `film` | every scene is scaled from 1 to 1.06 about (720, 620) over its length |
| **Same frame, same picture** | everywhere | no `Math.random()`, no clock: `dice(n)` is `frac(sin(127.1 n) · 43758.5453)`, and `clock` is set by `film(t)` |

Colours that carry the look: ink `#3a2418` (brown, not black), skin `#f2c9a0`, sky `#8ccfc6` to
`#f4ecd2`, ground `#f3dcc0`, wood `#b9774a`, straw `#e9c76b`, lips `#d2283a`.

## `person(x, y, look)`

`(x, y)` is where the feet stand. `look` holds everything else; leave out what you do not need.
These are the keys a film uses most. The whole list, 74 keys, is the comment above `person()` in
`oldcartoon.js`, and it is kept true by a check: `kit_check.py` fails when the kit reads a key that
is not written there, or when a key written there is read nowhere (that is how `crown` was found:
written down, set on the celestial, and drawn by nothing). A film that gives a key not on the list
(or a `FILM_STYLE` entry not in `STYLE`) still draws, but the kit warns, once, in the console and in
`WARNINGS`, with the nearest name: `The look's name "handa" is not a name the kit knows, so it changes
nothing. Did you mean "handA"?` `kit_check.py` fails a page that warns. To see what a key does, open
`looks.html`: every one of the 74 is there, 73 of them on a figure (`python stills.py looks.html sheet.jpg 2 7 12
17 22 27` is its six parts).

| key | meaning |
|---|---|
| `shirt`, `legs` | colours |
| `skirt` | a three-tier *pha sin*; `legs` is its colour |
| `coat` | a long white coat with a flowing hem |
| `bun` | a lady: an updo with a flower and long locks, a lady's face, bare hands; without it, short hair with a quiff, a fellow's face, white gloves |
| `hat` | a woven hat (hides the hair) |
| `face` | 1 looks right, −1 looks left |
| `size` | 1.25 to 1.5 fills the frame for three to five people |
| `up` | 0 to 1, usually `hop(t, late)` |
| `step` | grows while walking: `t / BEAT / 2` is one stride for every two beats. `stroll()` works it out for a walk from one place to another |
| `stride` | how long the steps are: 1, or left out, is the cartoon's short step. `stroll()` sets it |
| `bend` | radians the chest leans forward |
| `handA`, `handB` | the hand at the picture's right and the one at its left, measured from the shoulder: `[44, -84]` is up. Leave one out and that arm hangs, almost straight, with its hand at rest, and swings when the person walks. A hand given nearer than about 90 bends the elbow to reach it: `[30, 60]` is an elbow at a right angle, not a hanging arm |
| `sing` | open the mouth on every beat |
| `skin`, `eyes`, `lips`, `head` | this figure's own skin colour; how large its eyes and how wide its mouth (1 is the kit's); how wide its head (0.9 for a lady unless told: a longer oval on a neck) |
| `lid` | the upper lid of the eye: `"crease"`, `"hooded"` or `"none"`; unless told a lady's creased, a fellow's and an old person's hooded, a child's none |
| `sin`, `collar`, `fan`, `bangles`, `nails` | a tube skirt (0 to 2); a wrap blouse's band `[band, pattern]`; a fan of gold leaves at the bun; how many bangles; `"long"` for the nails of fon lep |
| `drum` | carry a long drum |
| `reachA`, `reachB` | `[x, y]`, a point of the scene: the wrist of that arm goes to it (see "Hands that go to a place") |
| `wai` | true: both wrists together before the chest, the hands upright, palm to palm |
| `floor` | true: sitting on the floor, `(x, y)` being the ground under the seat. One with a `bun` folds her legs to one side, anyone else sits cross-legged; `"side"` or `"cross"` says which, and `"astride"` is for one who rides (see "Sitting on the floor") |
| `build` | 0 to 1: from the cartoon's build (0, or left out: about four and a half heads tall) to the paintings' (1: about six and a half), a smaller head and longer legs (see "The build"). Below 0, down to -1, is a child's build: a larger head on legs a little shorter, about three and a half heads tall |
| `hair`, `age`, `beard` | for an old person: this figure's own hair colour; 0 to 1, the lines of age on the face; a colour, for a moustache and a tuft on the chin |
| `holding` | `"lotus"`, a lotus in the near hand, or `"stick"`, a walking stick from that hand to the ground |
| `id` | a name, so what hangs from the person follows them from frame to frame; without one, the n-th person drawn in a frame is taken to be the same person in the next |

## The kit, file by file

What each part of the kit is and how it was built is in a file of its own in `docs/kit/`, each section as it
was first written here, word for word (moved 2026-10-21). A new part's notes go in its file there.

| File | What it holds | Its sections |
|---|---|---|
| [`kit/figures.md`](kit/figures.md) | People: the figure, its dress, body, face and hair | The model on its own; Each figure its own; The dress of the north, by the record (2026-10-13); The torso turns, the shoulders work, a hand in the round (2026-10-15); Legs, ankles and feet, measured from photographs (2026-10-15); A lady's hair: four ways and three ornaments (2026-10-17); Faces of the north, from a photograph (2026-10-18); The Thai face, bodies, and the lady apart from her hair (2026-10-20) |
| [`kit/feelings.md`](kit/feelings.md) | Feelings, speech and thought bubbles, and eyes that watch | Eyes that watch, and who is where (2026-10-19); Nine feelings (2026-10-18); The pond's feelings, and the assistant's voice (2026-10-18); Feelings on the creatures (2026-10-18); Speech and thought bubbles (2026-10-18) |
| [`kit/creatures.md`](kit/creatures.md) | Creatures: the naga, the dragons, the beasts, the birds and the night | A Naga: a creature in a file of its own; A dragon, on the Naga's spine; An elephant and a water buffalo; A cat and a tiger; A pig; A beast's feet on a slope (2026-10-15); Three creatures of the myths of Lanna; The creature with four ears and five eyes; The Chinese dragon (2026-10-15); The rooster and the hen (2026-10-17); Five birds of the north (2026-10-17); The night: a moon, the barn owl, the atlas moth, bats and fireflies (2026-10-21); The beings of the Himmaphan, flying (2026-10-21); The tokay's spine, a buffalo grazing, the farmer's nose rope (2026-10-21) |
| [`kit/things.md`](kit/things.md) | Things: food, the woven sabai, flowers and fruits, pieces of the north, lanterns and the band | A dozen Thai dishes; A sabai woven with figures that walk; The flowers and fruits of Thailand; Pieces of the north (2026-10-15); Pieces for a tale: a cave's mouth, a poor family's hut; The things of a Lanna home, and the things pass (2026-10-19); The band, more lanterns, the farmstead and the red truck (2026-10-16); The spinning lantern (2026-10-16); Grass tufts (2026-10-21); Lanna weaving: the patterns, the cloths and the looms (2026-10-24) |
| [`kit/places.md`](kit/places.md) | Places: nature, buildings, backdrops, and decorating a scene | Nature rules; Buildings with depth; A dozen backdrops to start from; Seven places of the north, and the backdrops of the cartoon maker; Decorating a scene (2026-10-19); What is drawn over what: z (2026-10-21); What hangs, sways (2026-10-16); The highlands: terraces, forest and mist (2026-10-17) |
| [`kit/sound.md`](kit/sound.md) | Sound: songs, music, sounds and voices | A song for the film, in code; The hero film's sound (2026-10-16); The kit's sounds: voices made from outlines (2026-10-19); Music that follows the story's feelings (2026-10-19); A voice and its subtitles, aligned (2026-10-19, evening); The story told in Kam Mueang (2026-10-16) |
| [`kit/films.md`](kit/films.md) | The films: putting a tale together, its titles and its credits | The studio's card, and the tale's titles (2026-10-19); Putting a tale together: its voice, its sound and its scenes (2026-10-19); The credits (2026-10-19); The band and an old couple at the night of dancing (2026-10-16); Every figure its own, the village's sounds, the credits' bows (2026-10-20) |
| [`kit/dance.md`](kit/dance.md) | Dance: the fingernail dance and the hands of classical dance | The fingernail dance, read from a performance (2026-10-16); The hands of classical dance (2026-10-16) |
| [`kit/paperdolls.md`](kit/paperdolls.md) | Paperdolls: one character each, on top of the kit | Paperdolls: one character each, on top of the kit |
| [`kit/making_of.md`](kit/making_of.md) | How the kit was made: the rounds of matching, the quality round, a puppet of a Spark drawing | What a round of matching looked like; A puppet of a Spark drawing; The quality round (2026-10-14) |

## A film made scene by scene

The owner (2026-10-19), for the film of the creature with four ears and five eyes: "When you make the
scenes, make them seperately and then wire them together at the end." So the film's scenes live in a folder
beside the kit, `maeng/`, each a file of its own:

| File | What it is |
|---|---|
| `maeng/style.js` | the film's style (`FILM_STYLE`), loaded first by every page of the film, so all of them draw alike |
| `maeng/sets.js` | what the scenes share: `BEAT`, the skies, the places (Doi Khao Khwai and its cave), the light before dawn and `maengTinted()`, and `maengSubtitles()` |
| `maeng/words.js` | the narration in Kam Mueang, line by line (`MAENG_WORDS[id]` = what the voice says, the subtitle, the English), made by the film's words tool and not edited by hand |
| `maeng/sNN_name.js` | one scene: its function, on its own clock from 0, its length (`SNN_LONG`) and its lines (`SNN_LINES`, [from, to, id] on that clock) |
| `maeng/sNN.html` | that scene's own page: `SCENES = [[0, SNN_LONG, sceneName]]` and its subtitles, so stills, `kit_check.py maeng/sNN.html` and `render.py` work on one scene alone |

Each scene is finished and shown on its own. Only at the end does the film's page load every scene file,
list them in `SCENES` with their places on the film's clock, lay the lines over the whole, and let
`scenes.py` render and join them. What two scenes share goes into `sets.js` or into the kit, never into a
scene file. `kit_check.py`'s names check reads the scripts of such a folder too (`*/*.js`, not
`node_modules`), since they share a page with the kit.

## Every check writes its result down (2026-10-19)

The owner: "change the kit test so each test outputs a success or failure message to a file. If it's practical
break it up some so parts don't run if the thing the test didn't change." `checks/report.py` is what every check
writes with: `out/checks/NAME.txt` (a line an item, PASS, FAIL or SKIP, and what was found; then SUCCESS or FAILURE
and the counts), `NAME.json` for a program, and a dated line in `out/checks/history.log`. With `--changed`,
kit_check, seek_check, sound_check and score_check leave out what nothing it depends on has changed since it passed:
a page is marked by its own file, every script it loads and the check's own code, so a change to the kit's shared
files or to the check runs it again, and a `--quick` pass does not stand for a full one. snapshot.py is about change,
and always runs. Measured: a second kit_check on two pages took 1 s against 14, and wrote what it left out and why.

## Three checks taken from HyperFrames (2026-10-19)

The owner asked what lannamation could learn from HyperFrames (github.com/heygen-com/hyperframes, Apache 2.0),
a framework that renders HTML pages to video. Its model is lannamation's own: every frame is sought from the
clock in headless Chrome and encoded by FFmpeg. Three of its methods were worth taking, as methods; none of its
code is in the kit. All three share `checks/frames.py`: a page's frame as a picture, and kit_check.py's rule for
"same" in numpy (a pixel counts when a shift of one pixel does not explain it; a real one-pixel shift of a
whole scene, measured, counts 0 to 4 pixels of some 20,000 to 33,000 that change).

| Check | What it finds |
|---|---|
| `checks/seek_check.py` | a lint: no script of the kit, a film's scenes or a page reads the computer's clock or keeps itself going (Date.now, new Date, performance.now, timers, unseeded Math.random), a page's play() let off; and a back test: a frame come to after a later one is the frame come to first. kit_check's "same" comes to a frame forward; this comes back to one, where a creature that remembers where it was goes wrong (a test page that did: 19,615 pixels past the limit of 50) |
| `checks/snapshot.py save` / `compare` | stills of every film scene's key moments (its first frame, a second into each line, its last frame), kept outside the repository, and compared after a change to the kit, which the films' scenes share: which page, which second, how much, with a picture of where |
| `checks/ghost.py` | one picture of how things move over a stretch: what holds still behind, every moment's moving parts over it, the earliest faintest; the spacing is the speed. A decorated scene has each animal's course drawn on it with its seconds |

```
python checks/seek_check.py                       # the lint, and every film scene come back to
python checks/snapshot.py save                    # before a change to the kit
python checks/snapshot.py compare                 # after it
python checks/ghost.py maeng/s04.html s04_ghost.png --from 2 --to 33
```

The fourth method, music carved under the voice in the voice's own band rather than turned down whole, is for
when the film's narration is laid over its music (`score.py`); the fifth, renders spread over machines, is
`scenes.py` rendering scenes on the laptop and on the Spark at once.

## The kit's own checks

**One command after any change to the kit**, from `kit/`:

```
python checks/kit_check.py            # every page that loads oldcartoon.js (several minutes: it draws every frame of every page)
python checks/kit_check.py --quick    # without the arms
python checks/kit_check.py --jobs 1   # one page at a time (4 at once unless told, each in a Chrome of its own)
```

It ends with exit code 1 if anything failed. What it checks, and why each is there:

| Check | What it does | What it caught when it was written |
|---|---|---|
| look keys | every `look.<key>` the kit reads must be in the comment above `person()`, and every key there must be read | `crown`: written down, set on the celestial, drawn by nothing. `size`: read everywhere, written down nowhere |
| names | no top-level name (`function`, `var`, `let`, `const`) may be defined in two of the script files beside the kit: they share one page, and the one loaded last silently replaces the other's | `ribbon()`: paperdoll.js's (2026-10-12) was replaced by the kit's new one of the same name (2026-10-14, the sash's cloth ends), and `apsara.html` and `fonlep.html` stopped drawing; `tattoo()`: puman.js's replaced the kit's thigh tattoo and nothing said so. Both renamed in the module (`clothStrip`, `thighTattoo`) |
| draws | loads the page and draws 24 frames spread over its length; an error is a failure, not a traceback | |
| same | a still must show what the film shows (below) | a pre-roll of 30 frames was too short; `village.html` needed 60 |
| arms | `arms_check.py` over the whole page: elbows that flip, upper arms that point in toward the spine, forearms folded past 150 degrees. A known fault is listed in `KNOWN` with its reason, and a page may have those and no more | |
| ms/frame | how long a frame takes to draw, after a warm-up. Not a pass or a fail | |
| `checks/frame_time.py <film>.html` | not in `kit_check.py`: where a frame's time goes, a frame a second across a film (`--step 0.5` for two). It wraps `person()` and `crowd()` to time them, and counts the figures whose place, through the pen's transform, lies off the sheet by more than their height | that two speed changes proposed after the PixiJS review were not worth building (below) |
| `checks/z_check.py <page>.html` | not in `kit_check.py`: what on the ground is drawn over what stands nearer it (people, and a scene's animals by `decorate.js`), each pair with the seconds it is seen at; exit code 1 when there is one. See `kit/places.md`, "What is drawn over what: z" | written with the kit's z (2026-10-21); a hen on the "back" layer under a boy she stands in front of |
| `checks/vanish_check.py <page>.html` | not in `kit_check.py`: what blinks out of a film, drawn in one frame and gone in the next while it could be seen (people, a scene's animals, `drawByZ()`'s sprites that give an x), with the first second it did; exit code 1 when something did. `render.py` runs the same look before its first frame and tells it. See `kit/films.md`, "Nothing blinks out" | written 2026-10-22 (owner: "Sprites shouldn't just blink off the canvas"); the house mouse of s04 going into the gap by the door post |
| `checks/pop_check.py <page>.html` | not in `kit_check.py`: who pops in a film, a joint (elbow, hand, knee, ankle, crown) that jumps a third of a torso or more in one frame and twice as far as the frame before, with the first second it did; exit code 1 when someone did. `render.py` runs the same look. Mend with `poseSteps()`. See `kit/films.md`, "Nothing pops" | written 2026-10-22 (owner: "I want to improve"); `village.html`'s arms thrown up in one frame |
| `checks/lai_check.py` | not in `kit_check.py`: every weaving motif (`LAI`) has its meaning's fields, `means`, `realm` and `meansFrom`, with a source for any meaning or realm; then the realms down each town's teen jok, only reported (the sources give that order for Tai Lue cloth). See things.md, "What the motifs mean" | the three meanings in no source, found before the check, by reading the sources (2026-10-28) |
| warnings | the kit warned about nothing while the page drew: a name in a `look`, in `stick()` or in `FILM_STYLE` that the kit does not know (see "`person(x, y, look)`") | |
| cues | only for a page with a cue sheet: every line of the song is sung inside one scene, and has ended before the next begins. One more line is printed under the page's | moving line 1 of `lanna.html` one second early put the cut at 8 s inside it and ran it into line 2: two failures, as it should |

A page that asks for a script which is not on the computer is left out and named (`puppet.html`
needs `rig_lady/rig.js`, which is media and not in git).

**A still shows what the film shows: `settled()`.** What hangs from a figure (`follow()`) and which
elbow an arm has (`bendOf()`) come from the frames before. A frame reached by a jump of the clock
(a still, a scrub, a render that starts part of the way in) would show them at rest. So
`settled(t, paint)` paints the frame at `t`, and when the page is being rendered and the clock has
jumped, it first paints the `SETTLE` frames before it, unseen. `film()` goes through it; a page
with a `draw` of its own does the same:

```js
function draw(t) {
  settled(t, function (at) { clock = at; sheet(at); });
  screen.drawImage(FILM, 240, 0);
}
```

`SETTLE` is 60 frames, two seconds, and the number is derived, not guessed. A damped spring forgets
how it started at the rate of its `damp`: its swing shrinks as `e^(-damp · t / 2)`. The kit's
slowest (the drum on its strap, damp 5) halves every 0.28 s, so a twelfth of a wrong start is left
after one second and less than a hundredth after two. Measured, with
`python checks/kit_check.py model.html dance.html village.html lanna.html --quick --settle N`: a
frame reached by a jump against the same frame reached by running the 120 frames before it. Each
cell is two numbers: the pixels of the 1440 by 1080 sheet that differ by more than 24 in a colour,
then how many of those a shift of one pixel does not explain (the worse of two places in a page):

| frames painted first | model.html | dance.html | village.html | lanna.html |
|---|---|---|---|---|
| 0 | 63,536 / 42,114 | 4,833 / 2,551 | 18,911 / 8,099 | 10,943 / 6,712 |
| 15 | 13,078 / 2,897 | 3,237 / 727 | 8,876 / 4,231 | 2,986 / 273 |
| 30 | 8,027 / 65 | 248 / 32 | 4,344 / 3,655 | 642 / 9 |
| **60** | 45 / 0 | 10 / 0 | 927 / 3 | 3 / 0 |
| 90 | 6 / 0 | 1 / 0 | 62 / 0 | 0 / 0 |

The second number is the one a page must keep under 50. The first counts every line that lies a
part of a pixel aside, which nobody sees: on `village.html` at 60 frames, 927 pixels differ and 3
of them by more than a pixel's shift. A page watched live is left alone (its clock runs by itself,
and a slow computer must not paint sixty frames for one), and so is a whole render, which starts at
0 and has no frames before it.

**The run of 2026-10-12**, every page, with the kit as it stood after both profiles were redrawn
(65 look keys read, 65 written down; `lanna.html` was run again after its hopscotch was laid on
the ground, and gave the same):

| page | same | arms: flips, inward, folded |
|---|---|---|
| `lanna.html` | 3 / 0 | 0, 0, 0 |
| `village.html` | 928 / 3 | 0, 0, 0 |
| `model.html` | 41 / 0 | 0, 0, 0 |
| `dance.html` | 24 / 1 | 7, 0, 0 (known: the tracked wrist lies within 12 units of its shoulder in those frames) |
| `starter.html` | 12 / 2 | 0, 0, 0 |
| `puppet.html` | 25 / 0 | 0, 0, 0 |
| `nature.html` | 0 / 0 | 0, 0, 0 |
| `apsara.html`, `fonlep.html`, `puman.html` | 0 / 0 each | 0, 0, 0 |

The three paperdoll sheets failed `same` the first time the check ran (34,125 / 30,114,
24,779 / 20,533 and 436 / 206): they had a pre-roll of their own, of 30 frames, and cloth that is
a chain remembers longer than a spring does. The session that builds them moved them onto
`settled()` and found that 60 frames were still too few for a scarf (`apsara.html` 17,229 / 15,473
at 60, 0 / 0 at 150), so each of those pages sets `SETTLE = 150` before it draws. A page may do
that: `SETTLE` is the kit's, and 60 is what the kit's own springs need.

**Two things the check taught about checking.** It first sampled a page at a part of its length
(0.78 of 94.9 s), which is between two frames, and compared that with a frame: every page failed
by tens of thousands of pixels, and none of it was true. Sample on the frame grid. And two loads
of the same page with the same kit can differ by 2 to 8 pixels in one frame of twelve (measured
by drawing twelve frames twice), so a comparison that demands 0 would fail at random: the limit
is 50.

**Where a frame's time goes (2026-10-14).** A review of PixiJS v8 proposed two of its ideas for
the kit: paint a set once and keep it (PixiJS's `cacheAsTexture`), and skip the figures the lens
cannot see (its `Culler`). `checks/frame_time.py` was written to measure before building either,
one frame a second, with `draw(t - 1/30)` called first so `settled()` does not pre-roll:

| film | frames | ms a frame | in figures | figures drawn | off the sheet |
|---|---|---|---|---|---|
| `lanna.html` | 60 | 3 to 17 | 4 to 12% | 211 | 0 |
| `village.html` | 36 | 9.5 | 22% | 115 | 0 |
| `sash.html` | 57 | 14.5 | 9% | 116 | 0 |
| `starter.html` | 8 | 2.9 | 77% | 32 | 0 |

Neither was built. The sets are already painted once (`backdrop()` keeps a canvas per name;
`lanna.html` draws its DAWN, HOUSE and INSIDE canvases), `crowd()` already skips a figure past the
right edge, and the camera pushes in by 6% at most, so no figure of any film was ever off the
sheet. Culling would also be unsafe: `follow()` keeps its springs by `look.id`, and a figure skipped
for a frame comes back with them stale. One run of `lanna.html` showed three frames of 300 ms at
seconds 17, 53 and 59; drawn again, each took 3 ms, so they were the computer, not the kit. The
cost of a render is elsewhere: `render.py` takes about 130 ms a frame (3.9 s for a second of film),
of which the drawing is 3 to 17, and the rest is the screenshot and its trip to Python.

## Limits, said plainly

- Checked in Chrome only. `pen.filter`, `roundRect` and the lens filter need a recent browser.
- The words on cards use system fonts; another computer may draw them a little differently.
- A head turns from profile through three-quarter to full face (`turn`). A lady's profile is the
  paintings'; a fellow's is the same build with his own measure, and no painting was measured for
  it. There is no back view. In profile the neck is a thin column under the middle of the head,
  as it is from the front: no throat runs on from the chin.
- Render time is about two to three seconds for each second of film on the laptop (36 s in 75 to
  130 s, depending on what else was running). Drawing is the smaller part of that: one lady takes
  6.4 to 8.2 ms with the heavier line and 4.6 to 5.4 ms without it, and the whole model sheet of
  eighteen figures 68 ms (headless Chrome on the laptop, 2026-10-12, thirty draws each, with a
  read-back to force the paint). **Warm up before timing anything:** whatever is timed first comes
  out five times too slow (29 to 35 ms for the same lady), and that once made the heavier line look
  like four fifths of a figure's cost. It is about a quarter.
- The song is a tuned computer voice over sine-wave instruments. It is in time and partly clear;
  it is not a singer.
- It is not the reference. Those films were drawn by hand, picture by picture: every pose is a
  new drawing, and ours are one figure with numbers changed. Two people can hold hands now
  (`reachA`) and a figure can sit on the floor (`floor`), but poses that overlap two bodies, turn
  a head away, kneel, or get down and up are still out of reach of `person`.
