# The 1930s cartoon style, in JavaScript — how to make the next film

> 🗺️ **Video docs:** part of the video doc set — see the [doc map](README.md) for all related strategy / packaging / pipeline / reference files.

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
   band on the side away from the light, never a soft gradient across a face.
2. **Gold is the ornament.** Jewellery, combs, crowns, hems, halos and trims are gold (`STYLE.gold`);
   gold never fills a large area.
3. **Pattern fills the cloth.** A pha sin is bands: diamonds, dots, zigzags, lines, between gold
   lines; a sabai has a woven border; nothing is plain that could be woven.
4. **Faces are calm and long-eyed.** One heavy upper lid line with a flick, thin high brows, a
   fine straight nose, a small bow mouth, a long neck, pale skin. No big round cartoon eyes.
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
| `flora.js`, `flora.html` | eight flowers and twelve fruits of Thailand drawn small, in a file of their own on top of the kit, trees that bear them, and their sheet (see "The flowers and fruits of Thailand") |
| `sabai.js`, `sabai.html` | a shoulder cloth woven with figures that walk, the sash film's cloth as a file of its own on top of the kit, with its camera, and its sheet (see "A sabai woven with figures that walk") |
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
| **Bare feet** | `foot` | the default since round 25: heel at the ankle, the top of the foot sloping to the toes, the big toe first of four, three toe lines, a nail, a shadow in the arch; 48 long for a fellow, 40 for a lady (with an anklet). `shoes: true` brings the 1930s shoe back. A `sarong: colour` on a man is one 196-long striped tier over bare legs; `yak(brush, x, base, facing)` is the temple's painted guardian, placed in pairs by `temple` |
| **Feet (1930s)** | `shoe` | heel at the ankle, toe toward the way the person faces, sole line, heel front; a lifted foot tips by `0.5 · lifted` radians |
| **Proportions** | `person` | about four and a half heads tall. Lady: shoe 0, hip −190, shoulder −316, head centre −390. Fellow: hip −216, shoulder −342, head centre −416. All before `size × 0.82`. A neck 44 tall joins chest and head. The head is one path with a brow, a cheek, a jaw and a chin, turned a little to the side, scaled 0.84 × 0.92; the jaw drops up to 11 when a fellow sings, 4 for a lady |
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
| **Cuts** | `iris`, `curtain`, `card` | a round iris closes and opens over 0.5 s at every cut; a red curtain parts over 1.6 s; cards are cream with a double red rule |
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
| `sin`, `collar`, `fan`, `bangles`, `nails` | a tube skirt (0 to 2); a wrap blouse's band `[band, pattern]`; a fan of gold leaves at the bun; how many bangles; `"long"` for the nails of fon lep |
| `drum` | carry a long drum |
| `reachA`, `reachB` | `[x, y]`, a point of the scene: the wrist of that arm goes to it (see "Hands that go to a place") |
| `wai` | true: both wrists together before the chest, the hands upright, palm to palm |
| `floor` | true: sitting on the floor, `(x, y)` being the ground under the seat. One with a `bun` folds her legs to one side, anyone else sits cross-legged; `"side"` or `"cross"` says which, and `"astride"` is for one who rides (see "Sitting on the floor") |
| `build` | 0 to 1: from the cartoon's build (0, or left out: about four and a half heads tall) to the paintings' (1: about six and a half), a smaller head and longer legs (see "The build"). Below 0, down to -1, is a child's build: a larger head on legs a little shorter, about three and a half heads tall |
| `hair`, `age`, `beard` | for an old person: this figure's own hair colour; 0 to 1, the lines of age on the face; a colour, for a moustache and a tuft on the chin |
| `holding` | `"lotus"`, a lotus in the near hand, or `"stick"`, a walking stick from that hand to the ground |
| `id` | a name, so what hangs from the person follows them from frame to frame; without one, the n-th person drawn in a frame is taken to be the same person in the next |

## A song for the film, in code

The band and the singer are two Python files, and the film is cut to their beat, which we know
because we wrote it.

```
python village_music.py      # the band: ranat, ching, drum, low string  -> village.wav
python village_sing.py       # the words, tuned to the tune              -> village_song.wav
python render.py village.html village.mp4 --audio village_song.wav
```

- `village_music.py`: `BEAT` seconds a beat (the same number as in the film's page), five notes
  (`NOTES`), and `TUNE`, one letter for one beat, a dash for a rest.
- `village_sing.py`: `LINES` is a list of (the beat a line begins on, its syllables, a note for
  each). A Thai voice (edge-tts, `th-TH-PremwadeeNeural`, needs the internet) says each syllable
  once into `spoken/`; `librosa.pyin` finds the pitch it was said at; `pitch_shift` moves it to the
  note and `time_stretch` makes it 95% of a beat. Give each syllable the note the tune has on that
  beat, and start each scene on a beat just before its line.
- **One list for the song: the cue sheet** (2026-10-13). `village.html` holds the song three times:
  `LINES` in the Python for the voice, the same lines in the page for the mouths, and `WORDS` in
  seconds for the words under the picture, each second worked out by hand from a beat. Three lists
  can drift apart and nothing says so. `lanna.html` now holds it once:

  ```js
  var CUES = [
    // the beat a line starts on, its syllables (one a beat), the line as written, what it means
    [8, "เพื่อน สาม คน มา หา ที่ บ้าน", "เพื่อนสามคน มาหาที่บ้าน", "Three friends come to the house"],
    [110, "สะ หนุก จัง สะ หนุก จัง", "สนุกจัง สนุกจัง", "What fun, what fun"]
  ];
  var SUNG = sungBeats(CUES);                       // the mouths
  function draw(t) { film(t, SCENES); words(t, CUES); }   // the words under the picture
  ```

  The syllables are spelt as they are sung (`สะ หนุก`) and the written line as it is read (`สนุก`),
  which is why a row has both. `lanna_sing.py` has no list of its own: `cues_of("lanna.html")` opens
  the page in Chrome with no window, as `render.py` does, and asks it for `CUES`. A scene asks
  `cueAt(t, CUES)` which line is being sung (`{line, since, beats}`), so that what people do can
  follow the song and not a number of seconds; the lane of `lanna.html` picks its game this way
  (see 23 under "The model on its own"). Measured when `lanna.html` was moved onto it: the
  list the singer reads is the old `LINES`, row for row; forty frames spread over the film are the
  same as before; the only change is how long a line's words stay. By hand they stayed 3.6, 3.2 and
  2.8 s for lines of seven, six and five syllables; by the rule they stay 3.75, 3.25 and 2.75 s.
  `kit_check.py` reads a page's `CUES` and `SCENES` and fails a line that a change of scene cuts,
  or that is still being sung when the next begins.
- What to expect: a tuned computer voice. A recogniser hearing the finished song got some lines
  right ("แก้วเป็นสีทอง เจอแล้ว เจอแล้ว") and others wrong ("โคมลอย" as "ความร้าย"). Short open
  syllables survive best; syllables with a falling or rising tone lose it, because every syllable
  is flattened onto one note.
- **A better voice: `singer.py`** (2026-10-12; the owner asked for a better singing voice, and
  the session that builds the paperdolls wrote it). The same spoken syllable is taken apart with
  the WORLD vocoder (`pyworld`) and put together again on the note, where `pitch_shift` moved
  the mouth's shape with the pitch and `time_stretch` stretched the consonant as much as the
  vowel. The consonant keeps its own speed and only the vowel is stretched to fill the beat, and
  a share of the syllable's own Thai tone is kept. The owner heard two versions. Of the first
  (a scoop onto each note, a vibrato of a quarter of a semitone): "Switch". Then the owner asked
  that session for public singing to model, and three old Thai recordings gave the second
  manner: a note held nearly straight (a vibrato of an eighth of a semitone at 6 Hz), slid into
  from the note before it over 90 ms, and a fall as it is let go. Of that one: "It sounded good
  to me", and it was chosen for the film. `lanna_sing.py` uses it: `sung(syllable, frequency,
  before)` is one line, `sing(spoken(syllable), frequency, BEAT * 0.95, glide_from=before)`, on
  the same beats, so the mouths in `lanna.html` did not change. The song it writes was compared
  with the file the owner heard: the same, sample for sample.
  `village_sing.py` still tunes the old way. `sing_check.py` sings every line both ways, hears
  each with a recogniser (faster-whisper, medium) and measures each syllable's pitch against
  its note; `sing_check_output.txt` is its run on the chosen voice: 41% of the characters heard
  wrong in the old voice and 23% in the new; the pitch 46 cents off the note on average in the
  old voice and 33 in the new, which slides and falls on purpose, so that number now mostly
  measures the slides. The first version, by that session's earlier run, gave 21% and 10 cents.
  A bug found on the way, and mended without moving the sound: in `sing()` a local variable
  named `release` hid the argument of that name, so every voiced syllable got the fall meant
  for the last of a line. That was in the song the owner heard and chose, so the argument was
  made to say what the code did: `release` is true unless told, and every syllable falls. The
  song written after the mend is still the chosen one, sample for sample.
- A music model is the other way. ACE-Step (`spark/acestep_hf_space.py`) sang six English lines
  well on its second seed; the film was then cut to the song, with `faster_whisper` word
  timestamps giving the second each line began. **It could not sing Thai:** three takes, and the
  recogniser found none of our words in any of them.

## The hero film's sound (2026-10-16)

The owner asked for a better-quality sound for the hero film (`sash.html`) and said "it's good" of this one;
it went live the same day, muxed onto the film's picture unchanged. What was wrong, measured on the old
`sash_voice.wav`: the music was sine waves added up (99% of its energy under 1 kHz, nothing above 3 kHz),
the voice (Meta's MMS Northern Thai, as the Kam Mueang Voice extension speaks it) is made at 16 kHz and had
nothing above 8 kHz, and the mix was mono at -17.5 LUFS. The tune, the spoken lines and their seconds did not
change; how they sound did (`sash_music.py`, `sash_narrate.py`):

| | Before | Now |
|---|---|---|
| The tune | a sine and its octave, dying away | a plucked string (Karplus-Strong: noise going round a delay line that averages as it goes), on two strings 6 cents apart, as a sueng's paired strings |
| The chord | sine waves swelling | a soft bowed tone: eight overtones (1/n^1.6), a 4.8 Hz vibrato, left and right a little apart |
| The drum | a sine falling in pitch | the same body with a second mode, and a skin (noise under 1.4 kHz) |
| New | | a small ching on the strong beats of the dance (inharmonic partials from 3.15 to 11.2 kHz) |
| Space | an echo | the echo bounced between the ears, and a room (noise dying over 1.4 s, darker as it dies) at 0.22; stereo |
| The voice | resampled, peak-normalised | soxr to 44.1 kHz; `VOICE_CHAIN` (ffmpeg: highpass 75 Hz, -2.5 dB at 260 Hz, +3 dB at 3.2 kHz, `aexciter` from 6 kHz, compression 3:1); a touch of the same room |
| The mix | mono, -17.5 LUFS, peaks at -0.5 dB | -14 LUFS, true peaks under -1 dBTP (`loudnorm`, measured, then applied linearly); stereo, 24-bit |

Measured on the voice track, the level of each band against the whole: 3 to 6 kHz -28.6 dB before, -22.6 now;
8 to 12 kHz -59.8, -43.4; 12 to 16 kHz -74.0, -56.9. The music now has 1.66% of its energy between 3 and 8 kHz
(none before). The voice stays MMS's (CC BY-NC 4.0): treat it, never replace it here.

```
python sash_music.py                                        # sash.wav: stereo, 32-bit float
python sash_narrate.py <the extension's model folder> --takes 4   # sash_voice.wav: -14 LUFS, stereo, 24-bit
python scenes.py sash.html sash.mp4 --audio sash_voice.wav  # or mux it onto a film: ffmpeg -c:v copy -c:a aac -b:a 256k
```

Needs soundfile, soxr and scipy besides numpy, and an ffmpeg with `aexciter` and `loudnorm`. The live film's
sound is these two scripts' output, sample for sample (the largest difference from the file that went live is
1.2e-7, rounding). `music.py` and `village_music.py` are unchanged: still sine waves.

## What a round of matching looked like

Each round was the same three steps, and each took minutes: cut close-ups from the reference
(`ffmpeg -ss … -vf crop=…`), write down what is *drawn there* as rules (not "nicer eyes" but
"white almond, brown iris with a light, heavy upper lid, three lashes"), change one function and
look at stills. In order: film treatment and shadows; proportions; body curves (waist, tails,
bowed knees); skirt tiers and hair curls; eyes, lips, noses; hands, feet and joints; cloth that sways
as a wave; heads with a jaw and a chin; almond eyes and noses with a bridge; two-bone limbs with
elbows and knees; hair as a mass with swinging locks, a thinner ink line, a neck and bare hands;
poses, taller men, shading and timing; open shoulders; hands as one shape with three-joint
fingers; the weight and colour of the line; noses. Then twenty-one rounds in one afternoon:
sung mouths, squash and stretch, dress, head turns and looks, expression, cartoon accents, painted
sets, the crowd, depth in the parade, the lab's props, the sky, secondary motion, evening light,
small things, staging, the colours of a print, a walk cycle, and, from three Thai paintings and
three Lanna murals, the ladies' and men's dress and jewellery, the crowd and the buildings.

A side-by-side is the honest test: `ffmpeg` one reference frame and one of ours to the same
height and `hstack` them. What the eye then finds first is rarely the detail being worked on; in
our rounds it was the weight of the ink line, the missing neck, and five people in one pose.

In a scene, no two people should hold the same pose at the same moment: give each a `late` of
its own (`k · 0.5 + k · 0.07` keeps them on the beat but never together), a different pair of
hands, a small `bend`, and draw the further ones first, higher on the ground.

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

## Paperdolls: one character each, on top of the kit

(This section is by the session that builds the paperdolls; its files are `paperdoll.js`,
`fonlep.js`, `apsara.js`, `puman.js` and their sheets.)

A paperdoll is a character made for the kit without changing the kit: a cast member, the clothes the kit does not draw, and cloth that moves on its own, in a file of its own on top of `paperdoll.js`. `fonlep.js` (the fingernail dancer, in profile, with a red scarf that hangs from her raised forearm: since 2026-10-13 her stage dress, `stage: true`, over a dancer dressed as the sources say) and `apsara.js` (the celestial dancer of the Siamese stage, three-quarter, with a patterned sabai hanging from both forearms and a crown) were read from two paintings the owner gave on 2026-10-12; nothing of either painting is copied, and each file opens with what it shows, as numbered rules with the measured numbers. `puman.js` (the whispering man of the Wat Phumin mural, read from the owner's reference photograph: a bare chest, a knot on the crown, a dotted shoulder cloth, a short indigo loincloth and the tattooed thighs, drawn on the sheet over the kit's bare legs) followed on the owner's choice of "a man from the Lanna murals". The owner judged the first two "nice" the same day.

| Rule | Where | The math |
|---|---|---|
| **A doll draws between the kit's layers** | `paperdoll.js`: `paperdoll(style, x, y, more)`, the wrappers round `arm`, `follow`, `ladyFace` | `person()` is not edited; it calls those three at known moments, so a doll's style draws its costume in the waist's frame before either arm (at the far arm's call), a cuff or a wrap after each arm (before its hand), an ornament in the head's frame before the head and hair (at the `/pins` follow, so the look needs `pins: true`), a crown after the face. What hangs behind her is drawn before `person()` from the last frame's joints, which `person()` gives back. Every doll has an id (the n-th drawn in a frame, as the kit numbers its people); a shared id drew one body's scarf over another's face |
| **Cloth is a chain** | `chainStep`, `walk`, `limit` | the snake of procedural_animation.html: each point one gap behind the point before (`walk`), bent no more than `bend` from that one's direction (`limit`), keeping `keep` of its speed from the frame before and sinking `sink` px/s: a scarf is 16-17 points, gap 14, bend π/7, sink 220, keep 0.9, led from 30 units up the forearm; bead strands 11-13 points, gap 10, bend π/16, sink 700, keep 0.55. A cut, or the clock gone back, hangs it again at rest |
| **Cloth is painted in the thangka's order** | `ribbon`, `scarfEnd`, `drape` | the flat colour; a flat darker band on the inside of each bend with a crease line where the bend passes 0.25 rad; pleats down the length from the gather; the gold work; the dark line last (`inkFor`, `heavy`). An end is a flame point that curls outward (`tip: "flame"`) or a straight cut with threads (`"fringe"`); a panel of another cloth may cover the last six points |
| **Bands lie on the skirt's wave** | `band`, `bandCorners`, `hipsOf` | a belt or hip band's corners take `tier()`'s drift, `-36 · u^1.3 · sin(phase - 1.6u)`, and its swell, `0.16 · u · cos`, with the hips' tip from `person()`'s own sums, so the band stays on the cloth |
| **A still shows the cloth in motion** | the sheets' `draw(t)` | a jump in the clock first runs the frames before it (see "The kit's own checks"); `peek.py` cuts one figure at full size beside the reference at the same height (the side-by-side of the matching method, as a tool) |

### What real Lanna dress was, and the characters still to build (2026-10-13)

The owner asked for the dolls to be judged against what Lanna people wore. The sources: Manop
Manasaem, *พัฒนาการเครื่องแต่งกายชาวล้านนา (ไทยวน)*, Fine Arts Journal, Chiang Mai University
(garments, hair, ear ornaments and tattoos, era by era); Linda McIntosh, *Tai Yuan Textiles of
Thailand*, Textiles Asia 4.1 (2012) (the sin's three parts, the breast cloth); Thai Wikipedia
*ฟ้อนเล็บ* and Indiana University's fingernail-extension notes (the dance's dress and its eight
nails); descriptions of the Wat Phra Singh (Lai Kham) and Wat Phumin murals. Two eras matter.
**Before Rama V** (the murals, to about 1890): both sexes bare-chested; a woman in a sin with a
breast band or a sabai thrown over one shoulder, the hair in a bun at the nape with a wire pin,
a rolled palm-leaf or gold ear plug (*lan hu*) in a stretched lobe; a man in a black-and-white
checked cloth (*pha ta kong*) hitched between the legs (*pha toi*), tattooed from the waist to
the knee (*sak kha lai*). **Rama V onward** (1890s to 1930s): round-necked front-opening shirts
for everyone, the mo hom and Chinese-silk trousers for men, the high padded "Japanese" bun that
Chao Dara Rasami brought north, blouses with leg-of-mutton sleeves at court. The kit's village
cast is the second era; the murals are the first; both are real Lanna. A sin's head (*hua sin*)
was white or pale cotton, a hand's span, sometimes with a red or rust band under it; its foot
(*tin sin*) plain black or red, or a *tin jok* for a festival. Lanna monks' robes were dyed with
jackfruit heartwood, an ochre-brown, not Bangkok's orange.

**Not yet built, in the order they are worth building.** Each is documented in those sources, and
none is the painting's or the stage's invention:

| Character | What the sources give | On the kit |
|---|---|---|
| **The whisperer's partner** (Ya Man, the mural woman of the 1870s) | a sabai over one shoulder with the end thrown behind, a striped sin with the pale head showing above the hip, a nape bun with a pin, *lan hu* ear plugs, spiral bangles on the arms; bare shoulders | a paperdoll beside `puman.js`: the kit's `sabai` over a bare torso (`shirt` as skin), `sin` with the pale head, `earplug`, `bangles`. The kit's first woman of the mural era |
| **A court lady of the Dara Rasami era** (1900s to 1920s) | a blouse with leg-of-mutton sleeves and lace, a silk sabai, a *sin tin jok* with gold thread, a silver plate belt (*tai aeo*), the high padded bun with a buffalo-horn comb and a spray of flowers | the real fon lep look; needs puffed sleeves (`onArm`), a plate belt (`band`) and a comb at the bun (`ornament`) |
| **A Tai Lue woman of Nan** | an indigo wrap blouse tied at the side (*seua pat*) with a row of silver buttons, a sin with the water-flow zigzag bands (*lai nam lai*), a head cloth | the kit's `zigzag` band already exists; the wrap blouse and the head cloth are new |
| **A Tai Yuan farmer of the murals** | cropped hair, bare chest, the checked cloth as *pha toi*, tattoos to the knee, a small patterned shoulder cloth (*pha chet*), buffalo-hide sandals (*kwan*) | `puman.js` with the Burmese knot gone, the cloth as `checks` and the hair cropped |
| **A Lanna celestial** of the Lai Kham murals | a tall pointed crown with ear flanges, a fitted long-sleeved jacket, a collar piece, a pha nung with a tail, a halo (my reading of the murals: no source describes them garment by garment) | the kit's `celestial` has the halo and the lotus; the crown and the jacket are new. The true Lanna shape for `apsara.js`, which is the Siamese stage |

Two things were not verified: the whisperer's head is read from the owner's photograph alone, and
the Tai Lue head cloth is attested for later periods than the mural's decade.

**Changed the same day, against those sources** (the owner: "Start the changes to existing
characters"):

| What | Where | Now |
|---|---|---|
| The sin's head was dark | `SINS`, `SIN_HEAD`, `SIN_HEAD_BAND` | a pale cotton band 20 wide at 0.05 of the tube, a rust line 2.5 at 0.11, on all three designs; it shows between the blouse's hem and the hip |
| Nobody wore a *lan hu* | `earplug: colour`, `earplug()` in `person()`, a row in `looks.html` | a disc 5.5 × 6 on the lobe at (earX, −272), smaller in profile, with a curl inside; it replaces the earring on both ears when set |
| The monk was Bangkok orange | `CAST.monk` | `#b8732a` robe, `#9a5e20` under it |
| A man's cloth had no check | `stripe()` kinds `"checks"` and `"checks-odd"` | squares of the band's width, every other one, as many as fit at two widths apart; two bands with the other phase, stacked, make the check |
| `fonlep` wore the painting | `CAST.fonlep`, `FONLEP_STAGE`, `fonlep(x, y, {stage: true})` | by default the dancer of the sources: `sin: 2`, `plain` (a round neck), the sabai across the chest, an orchid, the jasmine garland and the gold strands at the bun, `earplug`, a silver plate belt (`fonlepSilverBelt`: links every 9), no tail, no fan, nothing on the arm. `stage: true` lays the painting's dress over her: the tiered black skirt, the V-neck trim, the green cuffs, the gold-leaf fan, the bead strands, the hair tail, the belt and hip band, the scarf from the forearm. The sheet shows both |
| A doll's own key reached the kit | `paperdoll.js`: `style.keys`, `doll.own` | the keys a style names are kept out of the look (the kit warns about a name it does not know) and handed to the style as `doll.own` |
| `puman`'s cloth was the painter's | `PUMAN.cotton`, the loincloth's `tier` | a *pha ta kong*: pale cotton with six rows of ink checks 6.5 wide, the red hem band kept; the tattoo's ink at 0.78 with the scrolls in his skin colour, so the thigh reads dark and the skin shows between |
| `apsara` was called Lanna | `apsara.js`, `apsara.html` | named the celestial dancer of the Siamese stage; nothing drawn was changed |
| `fonlep`'s sleeves tapered | `fonlepTube` | a tube sleeve (แขนกระบอก): over the kit's forearm a straight tube of the blouse's colour, 10 wide, from 4 above the wrist (the bangles show) to 2 past the elbow, lined along its edges and its hem only, so no seam crosses the elbow; the stage dress keeps its cuffs |
| `puman`'s tattoo had one length | `tattoo(..., reach)`, `tattoo: "long"` | the short form (sak kha kom) stops 10 short of the knee as before; `tattoo: "long"` (the sak kha yao) runs to 4 past it, the band over the knee. The sheet's walker wears the long form |
| The cast's women had no ear plug | `CAST.maiden`, `CAST.weaver`, `CAST.devotee` | gold on the maiden and the devotee; a rolled palm leaf (`#b8a060`) on the weaver, as a village woman wore (Manop Manasaem) |
| The villager's head-cloth | `CAST.villager` | unchanged, with a comment: the head-cloth is Tai Yai, Tai Lue or Burmese wear, not Tai Yuan, so he is a man of those peoples |

The thumbs: the report said the dancer's nails were on all ten fingers. They were not: `glove()`
draws a nail on each of the four fingers and never on the thumb, as fon lep has it. Nothing to
change there.

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

## A dozen Thai dishes

From the same request. `food.js` is a file of its own on top of the kit, loaded after it, and gives
`food(name, x, y, look)`: `(x, y)` is the middle of what the dish stands on. No picture was given:
each is drawn from what the dish is, seen from the side and a little from above, as the paintings
show a tray, in flat colour inside a fine dark line.

| `name` | Thai, and how it is said | What is drawn | Size at 1 |
|---|---|---|---|
| `stickyrice` | ข้าวเหนียว, khao niao | a basket of woven bamboo (a kratip) on a small foot, its lid lifted on one side so that the rice shows, a cord to carry it by | 76 by 92 |
| `khaosoi` | ข้าวซอย, khao soi | a bowl of curry broth with red oil on it, a nest of crisp noodles, a leg of chicken, rings of shallot, a wedge of lime, chopsticks across the rim | 101 by 53 |
| `somtam` | ส้มตำ, som tam | a tall mortar of dark clay heaped with shreds of green papaya, tomato, long beans, a chilli and peanuts, and the wooden pestle standing in it | 77 by 108 |
| `mangorice` | ข้าวเหนียวมะม่วง, khao niao mamuang | slices of ripe mango laid in a fan, a mound of rice with coconut cream running down it and yellow beans on the cream | 82 by 33 |
| `saiua` | ไส้อั่ว, sai ua | the sausage of the north in a coil on a banana leaf, flecked with herbs and chilli, and two slices cut from its end | 93 by 36 |
| `namphrik` | น้ำพริกหนุ่ม, nam phrik num | a small bowl of green chilli dip on a plate with what is eaten with it: cucumber, a wedge of cabbage, long beans, pork crackling | 77 by 27 |
| `curry` | แกงเขียวหวาน, kaeng khiao wan | a bowl of curry with coconut cream turned through it, round eggplants, red chilli and basil. `colour` is the curry's colour: green unless told | 68 by 42 |
| `tomyum` | ต้มยำกุ้ง, tom yam kung | a bowl of red broth with beads of chilli oil, two prawns, straw mushrooms cut in half, a stalk of lemongrass, lime leaves | 72 by 48 |
| `padthai` | ผัดไทย, phat thai | a plate of fried noodles with a prawn on them, egg, bean sprouts and chives beside, a heap of crushed peanuts, a wedge of lime | 78 by 33 |
| `muping` | หมูปิ้ง, mu ping | three skewers of bamboo on a banana leaf, four pieces of pork on each, glazed and marked by the fire | 95 by 35 |
| `khanomkrok` | ขนมครก, khanom khrok | the round iron pan with seven hollows and two ears, a small white cake of coconut cream in each, browned at its edge, with green onion | 114 by 31 |
| `khantoke` | ขันโตก, khantok | the low round table of the north: red lacquer with gold on its edge, on a ring of turned legs, set with four small bowls and a basket of rice | 176 by 109 |

`FOODS` is the table: each name with its painter, its Thai name (`thai`) and how that is said
(`say`), so a page can write the name under the dish, as `food.html` does. A look has three names
(`FOOD_KEYS`): `size`, `colour` (the curry's) and `steam`. The hot dishes (khao soi, curry, tom yam,
khanom khrok) have three wisps of steam that rise, fade and begin again; `steam: false` leaves it
off, and steam has a faint brown edge so that it shows on pale paper. `size: 1` is as large as the
dish is beside the cast at their own sizes: a bowl is about 64 across, and a khantok more than
twice that. A name `food()` does not know draws nothing and the kit warns, with the nearest name.
The shared pieces are `foodBowl` (what is in a bowl is painted by a function, with the pen kept to
the rim), `foodPlate`, `foodLeaf`, `foodSteam`, `foodLime` and `foodPrawn`.

`food.html` is the sheet: the twelve, large, each with its three names; and below, at their own
sizes, a grandmother and the little girl on the floor at a khantok, with a basket of rice, a
mortar of som tam and skewers on the mat, and a pig. Measured (2026-10-13): all twelve take 7.2 ms
to draw, the khantok the most; `kit_check.py`: `food.html` draws, same 2 / 0, 24.8 ms a frame;
the five pages that load `beasts.js` or `food.js`: 5 pages, 0 failures.

**Not done:** nobody holds a dish, eats, or lifts a spoon: a dish stands where it is put. Each is
seen from one side only and has one arrangement. There are no drinks, no fruit on its own, no
market stall, no fire under the pan and no smoke from the skewers. The sizes above are of the ink,
so a pale plate's own edge is what was measured. The dishes are not in the cartoon maker's palette.
Judged from stills only.

## A sabai woven with figures that walk

The owner (2026-10-13): "Add the sash to the framework." The shoulder cloth of the sash film
(`sash.html`, the film at the top of `lanna_cartoon.html`) is `sabai.js`, a file of its own on top
of the kit, loaded after it and after the modules its rows use (`naga.js` and those named below). A scene draws
the back of the cloth, then the person wearing it (since 2026-10-15; before that the front was a third
call, drawn over the person, arms and all):

```
var where = sabaiOf(t, 720, 1010, look);     // where the cloth lies on this person, this frame
sabai(t, where, {from: 3}, "back");          // the end that hangs behind the shoulder, down her back
person(720, 1010, sabaiWorn(look, t, where, {from: 3}));   // the woven band across the chest, under the arm; its rows flow from second 3
```

| What the cloth is | In the code | Numbers |
|---|---|---|
| Rows of woven tiles, each tile one picture of the kit at the size of a woven figure | `sabaiTile(painter)`: the kit's own painter is drawn once on a scratch sheet, measured, and drawn again to fit the tile; `paintWith(brush, action, at)` runs a painter that draws with the kit's pen on another sheet | a tile is 384 square, the picture 0.86 of it |
| In every row the people and the animals walk | a painter that takes `u` (where in its walk, 0 to 1) is drawn at six moments and the tile is that cycle; one that takes no `u` stands | six frames in 0.8 s, a walking pace |
| Twelve rows, top to bottom, of what Lanna life is made of | `SABAI_ROWS` (2026-10-15, owner: "remove some of the repeating sprites like the monk and add the temple guardian, the oxen, a baby pig, and a few of the hanging lanterns"; 2026-10-17, owner: "Replace the fish on the sash with the humingbird type bird and review the items on the sash and replace generic items with special Lanna specific items"): a house, a villager, the long khao (the rice granary), a sow with her piglet behind her (a tile is fitted to its picture, so a piglet alone would be drawn as large as a sow); a kwian, the wooden ox cart (its wheels turn), a child, a bunch of longan with one peeled, a rooster, the nam ton (the water jar at the gate); lotus, a maiden, a green-tailed sunbird hovering to sip at a thong kwao flower; the sunbird hovering, a fellow, the water buffalo, a lotus leaf; a rooster, a weaver, an elephant, a lady; a red khom, a celestial, a blue khom, a khom dao (the star lantern of Yi Peng); a tung, a child, the dok ueang orchid, a dancer; the temple, the temple guardian (`yak`), a green khom, a drummer; two naga with the guardian between them, a maiden; the luang, a player of the sueng (`musician()`), the mom, a lady sitting; the hong (the golden swan), a chedi sai with its flags, a dancer; a thong kwao flower, a child sitting, a krathong, a green peafowl in display. What any land might weave was taken out: two fish, a plain tree, a coconut palm, a banana, a second house, two dogs, three plain blossoms, a paper lantern, the sun and the thangka's cloud, the two dragons of the Himalayan paintings, and a scientist in his white coat (a thong kwao tree and a longan tree in fruit were tried in row 1: at a tile's size both read as the same green tree). No monk; a khom is tied 400 above the tile's middle so it hangs inside it. The cloth needs `beasts.js`, `khom.js`, `myth.js`, `flora.js`, `pieces.js`, `band.js` and `northbirds.js` loaded; a film made before 2026-10-17 that loads no `northbirds.js` (the cartoon maker's exports load the kit from the site with a fixed list) weaves the fish and the dog in the birds' tiles (`sabaiBird()`) | |
| The rows flow along the cloth, each the other way from its neighbour, and the figures face the way their row flows; the cloth is still until a second it is told | `flow` units a second from second `from`; each figure bobs on the beat and rocks a little | 2.5 a second |
| The cloth lies from her left shoulder down to her right hip (owner), and its top "starts from the left side of the woman's neck then follows the shoulder and past that curving gently down": in the kit's three-quarter view, from beside the far hip, bowed by the chest, up to the base of the neck on the near side, where it folds and runs along the top of the shoulder on the shoulder's own outline, past the shoulder, and from there curves gently down behind the arm, mostly hidden, a strip of it trailing down past the arm; it gathers narrower at the fold, and follows a figure who breathes, bends or walks. Owner, 2026-10-15, with three photographs of women in sabai: "so it looks more like it's going over the woman's shoulder", "Look at those models for how the sash shape should be", "The part that goes back behind her should mostly be obscured but have a part tailing down like this", "Follow the curve of the shoulder". The wearer has `sabai: false`, so the kit draws no band of its own on the other diagonal (a kit change the same day: `look.sabai !== false`). Cuts that were wrong on the way: the end curled up at the shoulder's top; the end looped out round the arm like a hoop, with the figures on it walking every way ("a bunch of extra sprites"); the cloth on the far shoulder, which is her right; one band bent round the corner at the neck, whose inner edge crossed itself | `sabaiOf(t, x, y, look)` draws the person once on a scratch sheet to ask for their joints, and reads the shoulder's outline off that drawing, column by column from the neck outward (the first pixel of the person under whatever is opaque at the top and the gap below it; a column with none is inside the neck or past the arm; a drop of 26 is the arm's outer edge; it starts at the outline's highest point and is smoothed over five columns). The line is a list of points: a cubic from the hip to the neck, the outline (6 under it, along its normal), and a cubic tail; `at(u)`, `angle(u)` (of the segment, not blended), `uAt(along)`, `length`, `fold` (the neck), `top` (where the shoulder ends), `squeeze(along)` (0.72 from the fold on, narrowing over the last fifth of the way to it; the tiles shrink with it), `middle` and `tilt` (0.4 of the way to the fold). `sabai()` draws three bands, chest / shoulder / tail, and the chest and shoulder bands are cut to one crease at the fold (a fold reflects the heading across the crease, so the crease's normal is the difference of the headings in and out, taken over 24 each side), as a folded ribbon meets itself; the gold edges run to the crease with bevelled joins | 62 beside the far hip; the strip read is 72 wide from 24 inside the shoulder, 120 tall from 72 above it; the tail to 14 across and 150 below the shoulder; width 72 across the chest, 52 from the fold on |
| A point of the cloth, an edge, a band | `sabaiAt(where, along, across)`, `sabaiEdge`, `sabaiBand`: `along` from the hip end, `across` from the middle line | 24 steps along a curve |
| The cloth, drawn, in two parts so it goes behind the arm | `sabai(t, where, cloth, part)`: the cloth's colour under the weave, the weave's alternate light and dark bands, the rows, and two gold edges. `part` "back" is the whole cloth, drawn before the person; "front" is the hip to the top of the shoulder, drawn over them, and it lies on the back's own pixels, so the two meet at the shoulder with no seam; no part is the whole cloth over the person | 72 wide, as wide as the sabai the kit draws; 3 of edge and 3 of border |
| A camera that opens on one row close up and pulls back | `sabaiCamera(t, where, cloth, start, end)`: one steady logarithmic pull-back from the row (`cloth.row`) to the whole cloth to the person to the whole stage, turning upright, the cloth kept in the middle until the view is wide; call it inside `pen.save()` ... `pen.restore()` before the scene. It holds the cloth at 0.4 of the way to the fold, where `tilt` is read: held at 0.4 of the whole length it sat near the fold once the tail was added, and the rows there lean and flip | a row fills 0.46 of the height at the start |

A cloth is an object with the names `SABAI_KEYS` lists, and `sabai()` warns about any other: `wide`,
`rows` (a list of lists of painters, `SABAI_ROWS` unless given), `tiles` (made once from the rows
and kept on the object), `cloth` (the colour), `flow`, `from`, `row`. `sash.html` keeps its woman
and puts her into row 4 of a copy of `SABAI_ROWS`, in the same look, so the film opens on her own row;
everything else of its cloth is the kit's, and its opening is pixel for pixel what it was.

`sabai.html` is the sheet: ten seconds as the film opens, one row close up, the rows flowing from the
second second and the camera pulling back from 2 to 9; then six seconds of three people, each with
a cloth of her own, six rows on indigo flowing faster, the twelve rows, and six rows still. Measured
(2026-10-13): `kit_check.py --quick`: `sabai.html` draws, same 12 / 0, 18.8 ms a frame; `sash.html`
draws, same 1 / 0, 21.4 ms, its four sung lines each inside one scene.

**Not done:** the cloth is drawn over the person, not as part of the kit's own sabai (the kit's
`sabai` look key still colours the plain one under it); the curve is read from one shoulder, so it
lies over the near shoulder only; a cloth cannot be given to the maker's JSON. Judged from stills only.

### One band, worn under the arm (2026-10-15)

The owner remade the cloth's shape a step at a time from stills of the film's woman at 19.95 s
(`Videos/lanna_sash/sash_shape*.jpg`): "a rectangle from the neck off the shoulder down to the
waist on the opposite side"; its upper corner "where the neck meets the shirt", then "down and to
the side" so it starts beside the neck; "round the top end" curving down over the shoulder; "bend
the two long sides" so it wraps her; "cut it off just past the vertical line of her shirt";
"move it up and to the right just a bit and bend the long sides to the right"; "it shouldn't go
past a few pixels past the vertical line of her body" (the chest-height scan had found the hanging
arm, 18 wider than the torso); "cut it off closer to the body and put it behind the right arm";
"cut the sash off along the line of the woman's shirt on the left side. Just 4 pixels past the
shirt"; "cut it off near where the shirt tucks into the skirt"; "the long left and right side both need
to be shorter", "cut off the yellow lines that run past the long sides", "make sure the top two corners
stay pinned where they are", "the bottom two corners need to move to the right towards the body of the
woman", "the bottom most corner should move to the left until it is just beyond the waist of the woman.
It should not cross into the arm" (a cut on the arm's inner edge down to the waist, which the owner
turned down: "7 was better"), "just move the bottom most corner from image try 7 over to the left about
10 px." Then the back of the cloth, with a photograph of a woman in a red sabai whose end hangs in folds
behind her arm to the ground, fringed: "add a line from the right most corner down to just past the hand
that gently undulates down past the waist and hand and a curved line to the left and fill with the red
sash color and shade it but leave it unmarked. Add tassels to the end of the sash." The fold at the neck, the shoulder band and the tail of the earlier shape are gone from the
film's cloth; `sabai()` keeps them for a `where` that has a fold.

| What it is now | In the code | Numbers |
|---|---|---|
| One band at 45 degrees from beside the base of the neck on the side she faces down across the chest, its middle line bowed the way she faces, the top end rounded, the lower end a slant under the arm: its upper corner 12 inside the sleeve's line, its lower corner 10 further along the lower edge | `sabaiOf()`: `neck` 22 beside and 38 above the near shoulder joint; `top` half a width down the band's normal from it, so the band's upper corner is beside the neck; a quadratic from `end` to `top` whose control is 2 × `bow` to the right of the chord's middle; the band begins `start` along from `end`; `startCap`, the line through the end's two corners (`N` their midpoint, the heading read halfway, the normal square to the corners' line), which `sabai()`'s `corner()` cuts each edge and hem to, so the hems begin at the corners; `endCap {bulge: 26}` (the rounded top); `squeeze` 1, `fold` = `top` = the length. Whatever the cut, the curve is the same, which keeps the top corners pinned | 72 wide, bow 20, bulge 26, start (16 + 36 / √2) · √2 = 59, slant 10 · √2 |
| The curve's far end is read from the drawing: the shirt's line on the far side at the far elbow's height, the sleeve hanging beside the body, 4 outside it | `edgeAt(row)` scans 150 pixels inward from outside the hip toward the body for the first opaque pixel of the person on the scratch sheet; the row is `elbowB`'s. Wrong on the way: a scan at chest height found the arm's outer edge (637 against the shoulder's 656 on the film's woman); a cut on a vertical line 4 outside the sleeve left a sliver past the arm, and its cap line left the hems running past the band's end (they start at the middle line's end, not the cap's corner: a cap must sit at the band's `start`); a clip on the arm's inner edge (the outer edge mirrored about the elbow joint: 669 against the drawn 666-668) down to the waist, which the owner turned down | a guess of 50 inside the hip when no pixel is found |
| The near arm hangs over the cloth's lower end | the kit's `worn` look key: a painter `person()` calls after the body and the head and before the arms, inside `pen.save()`/`restore()`, where the kit draws its own sabai. `sabaiWorn(look, t, where, cloth)` gives back the look with `worn` set to draw the front of the cloth in the frame the pen had when it was called (the scene's, inside the camera), so the film draws `person(x, y, sabaiWorn(look, t, where, CLOTH))` and no longer calls `sabai()` itself. Her right arm is B, the near one in the kit's three-quarter view, drawn last | |
| In a wai the upper arm on the cloth's shoulder is under the cloth, and its forearm over it (owner, 2026-10-16: "redo the sash video so the left arm of the woman in the initial scene stays under the sash when she wais", then "when women wai their biceps are under the sabai and forearms show over it") | `person()`, for a look with `wai` and a cloth (`worn`, or the kit's own `sabai`, kept as `sabaiFront()` with the frame it was drawn in): after both arms, on `WAI_LAYER` (a canvas the size of the sheet, made once), the cloth is drawn again inside arm A's upper arm (`bone()` from the shoulder to the elbow, as `arm()` gives it to `limb()`: half-widths 12 and 10 plus the ink line, swell 3, times `arms`), then the forearm, its ink and its colour as `limb()` draws them, with `source-atop`, so only over that cloth; then the layer onto the sheet, before the hands. Where no cloth lies over the upper arm, the arm stays as `arm()` drew it, with no line across the elbow. Tried first: arm A drawn whole before the cloth (the whole arm under it, only the hand over); then the cloth drawn again inside the upper arm on the sheet itself, which also covered the start of the folded-back forearm and left the band cut off along the arm with no line. The layer is made with `willReadFrequently`, so it is on the CPU: on the GPU, drawn onto a sheet that a check or a still reads back, it changed how that sheet drew every frame after it, and `looks.html` failed `same` (6931 / 496 against 22 / 0) | a wai frame 6 to 7 ms slower (`sash.html` at 20.5 s 27 to 33 ms, at 40 s 93 to 100 ms) |
| Tucked into the skirt at the waist: nothing of the cloth below the waist's line, so its lower corner does not hang over the skirt | `where.tuck`, the waist joint's height + 8; `sabai()` clips the one band to above it | 8 below the waist joint |
| The back of the cloth: the end that hangs behind the shoulder and down the far side of the body, seen past the body's and the arm's edge, plain, in shadow, fringed | `where.tail` {outer, hem, inner} from `sabaiOf()`: the outer edge is 17 points from the top end's corner at the shoulder (the band's lower edge at its top) down to a foot 54 below the hip joint, leaning out 32 by the foot and waving 5 either way (2.5 waves, drifting with `t`); the hem is 9 points curving from the outer edge's foot to an inner edge 24 past the hip, bowing down 10 and rising 8; the inner edge's top is 16 below the corner, behind the body. `sabai()`'s `back()` fills it with the cloth colour, lays a gradient over it, darker toward the body (0.38 to 0.08), strokes three soft folds down it (7 wide, 0.16), a gold hem down the outer edge and along the foot, and nine tassels from the hem's points, 16 long less 1.2 for each point from the middle, fanning 0.7 a point. `sabai(t, where, cloth, "back")` draws it before the person; the hook draws the band; no part draws both. The foot is read from the hip, not the hand, so a hand raised to wave does not lift it | corner to hip + 54; 72 wide at the foot |
| Each end of a band cut one of three ways | `sabai()`'s `shape()`: square, on a line (`corner()`, the mitre at a crease or a cut), or rounded (`bow()`, seven points of a quadratic bulging along the heading); the gold hem follows a rounded end | |

**The kit's own sabai, the same shape (2026-10-15, owner: "make sure all the sashes in the framework
sprites look like what you just made"):** `person()`'s `sabai` look key no longer draws five strokes of
one curve from the far shoulder to the near hip with two ribbon ends behind the hip. `sabaiLine()` lays
the film's band in the chest's space, in the kit's units (the film's woman is 1.19 tall, so the film's
numbers over 1.19): 60 wide, the neck point 18 beside and 32 above the shoulder's root on the side the
figure faces (`blend3(chestTurn, 4, 40, 46)`, the root's own formula, since `rootHalf` is worked out
later), the middle line laid to 33 outside the far root, the band from 50 along it, its lower corner 12
further (the slant), bowed 34, the top's bulge 22, tucked at the waist (y below 7 clipped); every point
goes through `chest()`, so it bends with the spine, and the near arm B, drawn last, hangs over its lower
end. It is filled with the cloth colour, a 6-wide stripe of the border colour inside each long edge, a
gold thread at each edge; `"check"` bars it along the middle line with two threads 14 in from the edges.
`sabaiBack(cloth, border)` draws the back where the two ribbon ends were, before a lady's skirt and
before a man's sarong, under the hips' tilt skew (which it undoes with `pen.transform(1, -hipTip, 0, 1,
0, 0)`, since `chest()` has the tilt already): the outer edge from the top end's corner down to a foot
59 below the waist (8 above the ground for one who sits), leaning out 27, waving 4 with the clock; the
hem to 20 past the middle; the cloth shaded darker toward the body, three folds, the border down the
outer edge and the foot, nine tassels of the border colour. A figure with `sabai: false` now gets
neither (the two cream ends had been drawn behind the hip regardless), so the film's woman loses the
cream ends at her hip. Both helpers sit at function level before the skirt chain: declared inside it,
they were not yet defined when the chain ran ("sabaiBack is not a function"). The maker's generated film
draws the woven cloth the new way too (`sabaiWorn`). `fonlep.html` passes again: the ribbon calls that
hit `paperdoll.js`'s shadowing `ribbon()` are gone.

**A smooth opening, figures that wrap, and a wai (2026-10-15).** The owner, of the film rendered with
the new cloth: "Why is it so choppy to start? It should be smooth. The sprites should walk to the end of
the row and wrap to the other side. Have the woman wai instead of raise her arm and wave."

| What was wrong | Measured | What it is now |
|---|---|---|
| The cut was read off the drawing in whole pixels every frame, so the cloth's lower end jumped a pixel at a time; the figures are laid out from that end, and the opening's camera holds one row about 90 times as large (`rowZoom` = 0.46 · 1080 / 5.5), so a jump threw them about 50 px on screen in one frame | over seconds 0 to 22 at 30 a second: 78 of 660 frames with the lower end jumping more than 0.5 px, the largest 14.5 px at second 20 when the arm went up | the sleeve's line is read once for each build of figure, as a distance from the far elbow joint, from the look itself with the arms hanging and what changes from frame to frame left out (`SABAI_FLEETING`), standing at (400, 1000) at second 0, and kept under that look (`SABAI_SLEEVE`, emptied past 200); every frame the cut is the elbow joint plus that distance. The per-frame drawing on the scratch sheet is also made with the arms hanging (`sabaiHanging`), under an id of its own, so a wai or a wave does not move the cloth. The same 660 frames: none over 0.5 px, the largest 0.19 px, the tilt's largest step 0.0007 degrees (it was 1.46) |
| The figures walked the whole middle line, of which the first 59 is cut away, so each was gone a while before it came back | | they walk from `where.start` to the rounded top, a round of `length − start + step`; one that walks off the cut end comes on at the top with no gap |
| She raised her arm and waved from second 20 | | `wai: true` from second 20, with the beat kept (`late: 0, spring: 0.5`) |

**The wrap without a seam (2026-10-15).** A row's loop placed one or two figures past a whole round of
the row, which landed on the first ones: at one place in every row two figures lay on top of each other
(two temples, two fish, two lanterns), in the live film as well. A row now holds a whole number of its
patterns, `cycles.length · max(1, round(round / (step · cycles.length)))` figures spaced `round / count`
apart (within about 2 per cent of `step`), so at the wrap the pattern goes on unbroken.

**The rows run to both ends (2026-10-16).** The owner, of the hero film: "the sash has rows of
sprites but they don't go all the way to the end of the sash ... go all the way to the end of the sash
on either side." Seen full size at 15 s: at the waist the slanted cut reaches 14 (`slant`) further back
on the lower rows than the round begins (`where.start`), and at the shoulder the rounded end bows 26
(`endCap.bulge`) past the middle line's end, where `sabaiAt()` stops; so the lower rows ended short of
the cut, and every row short of the rounded hem. Each row's pattern is now drawn once more a round
before and a round after itself (`copy` −1 to 1), within `half + step` of the band's ends, at the points
`sabaiOn()` gives (the middle line run on straight along the end's heading), and the cut and the
rounded end clip it. A figure inside the ends is where it was, so the opening's close-up is unchanged.
The tail behind the arm stays plain, as the owner asked on 2026-10-15.

`looks.html` shows the `worn` key as a plain band drawn under the arms. Measured (`kit_check.py
sabai.html sash.html --quick`, 2026-10-15): `sabai.html` draws, same 12 / 0, 17.5 ms a frame;
`sash.html` draws, same 0 / 0, 30.7 ms, its four sung lines each inside one scene. The whole kit's
quick check the same day: 38 pages, the one failure not of this work `fonlep.html`, where
`paperdoll.js`'s own `ribbon(P, wide, ...)` shadows the kit's `ribbon(x1, y1, ...)` that `person()`
now calls for a man's sabai ends (it fails the same at HEAD).
Not done: the tail behind the arm is not in this shape; the old reading of the shoulder's outline is
gone with it (in git before this day's commits).

## The flowers and fruits of Thailand

The owner (2026-10-13): "Add flowers and fruits local to Thailand to the framework." `flora.js` is a
file of its own on top of the kit, loaded after it, and gives `flora(name, x, y, look)`: `(x, y)` is
the foot of a flower's stem, or the ground a fruit lies on. No picture was given: each is drawn
from what the plant is, in flat colour inside a fine dark line. The flowers are the ones of a
northern garden and a temple's offering tray; the fruits the ones of the market and the orchard.

| `name` | Thai, and how it is said | What is drawn | Ink at size 1 |
|---|---|---|---|
| `ratchaphruek` | ราชพฤกษ์ (ดอกคูน), ratchaphruek | the golden shower, the national flower: a twig with its leaves in a fan and two racemes of small yellow five-petal flowers hanging, the buds at their tips | 112 by 178 |
| `thongkwao` | ทองกวาว, thong kwao | the flame of the forest, Chiang Mai's own flower: clusters of orange-red flowers on a bare twig (the tree flowers before it has leaves); one flower is a curved keel like a parrot's beak in a dark velvet calyx. `colour` | 120 by 161 |
| `frangipani` | ลีลาวดี, lilawadi | a thick grey-green twig, long leaves, three blooms of five petals that overlap like a pinwheel, white going to yellow at the heart, and a bud. `colour` | 141 by 167 |
| `orchid` | กล้วยไม้, kluai mai | strap leaves and an arching spray of six blooms: five petals pale at their rims, a darker lip with a yellow throat. `colour` | 121 by 156 |
| `hibiscus` | ชบา, chaba | one big flower of five broad red petals with the long column from its heart, pollen along it and five red tips; leaves and a bud in its calyx. `colour` | 84 by 160 |
| `bougainvillea` | เฟื่องฟ้า, fueang fa | a woody twig crowded with clusters of three papery magenta bracts round tiny white flowers. `colour` | 102 by 142 |
| `jasmine` | มะลิ, mali | thin stems with small dark leaves in pairs, small white flowers of rounded petals, and buds like white grains in a green cup | 87 by 111 |
| `marigold` | ดาวเรือง, dao rueang | two pompoms of many short ruffled petals, orange outside and lighter at the heart, over ferny leaves, and a bud. `colour` | 96 by 152 |
| `mango` | มะม่วง, mamuang | a kidney shape with a beak, green at the stem going to yellow and a blush of orange, lying, with a leaf | 110 by 41 |
| `durian` | ทุเรียน, thurian | a big oval in a coat of spikes, green going to brown, its face marked with small tents, a thick stem | 145 by 111 |
| `mangosteen` | มังคุด, mangkhut | a round fruit of deep purple with a cap of four green lobes round its stem and a rosette under it; beside it the lower half of one opened, white segments in the pink of the rind | 91 by 64 |
| `rambutan` | เงาะ, ngo | three red balls in soft hairs that turn green at the tips, on a twig with a leaf | 125 by 94 |
| `longan` | ลำไย, lamyai | the orchard crop of Lamphun and Chiang Mai: a bunch of small round fruits in thin brown skins hanging from a twig with two leaves, and one peeled, white, its black seed showing | 149 by 127 |
| `lychee` | ลิ้นจี่, linchi | a bunch of red fruits with bumpy skins on a twig with leaves, and one peeled | 149 by 122 |
| `papaya` | มะละกอ, malako | long, narrow at the stem, green going to orange with faint ridges; and one cut lengthwise, its orange flesh round a boat of black seeds | 166 by 60 |
| `coconut` | มะพร้าว, maphrao | a young coconut as the street sells it, the green husk trimmed to a peak of flat cuts with a pale cut on top | 85 by 101 |
| `pineapple` | สับปะรด, sapparot | a crown of stiff leaves on a body netted in diamonds, each with a dark eye, orange going to brown at its foot | 70 by 142 |
| `jackfruit` | ขนุน, khanun | a great oblong, green-yellow, all over small bumps, with a short thick stem | 159 by 112 |
| `dragonfruit` | แก้วมังกร, kaeo mangkon | an oval of magenta in a coat of scales, each a flap that turns green at its tip | 77 by 91 |
| `pomelo` | ส้มโอ, som o | a big round fruit of pale green-yellow with a nub at the top and the pores of its rind; beside it a segment peeled to its pink pulp | 132 by 100 |

`FLORA` is the table: each name with its painter, its `kind` (flower or fruit), its Thai name
(`thai`) and how that is said (`say`), so a page can write the name under the thing, as
`flora.html` does. A look has three names (`FLORA_KEYS`): `size`, `colour` (the flower's, for
the six marked above; the others have one colour) and `ground` (`false`: no shadow under it, for
one that does not stand on the ground, such as the hero film's wild orchids on the trunks of its
pond's trees, 2026-10-17; as `person()` reads the same name). `size: 1` is as large as the thing is beside
the cast at their own sizes. A name `flora()` does not know draws nothing and the kit warns, with
the nearest name. The shared pieces are `floraPaint` (the kit's `shape()` with a gradient as the
paint), `floraLeaf`, `floraBall`, `floraPetals` (petals round a heart, pale at the rim if told)
and `floraBunch` (stalks from one point to round fruits below, the lowest drawn last).

**A tree in flower or in fruit.** `floraTree(brush, x, base, size, name, seed, colour)` paints the
kit's `tree()` on a set's sheet, as `tree()` is painted, and hangs the named flower or fruit in its
boughs: eight at points spread over the canopy (the canopy of `tree()` is an ellipse 160 to each
side and 90 up and down, centred 300 above its foot), each by the thing's own hanging painter
(`hang` in `FLORA`), fruit at 0.55 of the tree's size and blossom at 0.75 so that it reads as
colour from across a set. A jackfruit grows on the trunk, so its three hang there. A papaya has a
tree of its own, `floraPapayaTree`: a slim straight trunk, grey-green and marked where leaves have
fallen, the fruit crowded under a crown of lobed leaves on long stalks. A coconut is on the kit's
`palm()` already and a pineapple grows on the ground, so neither has a tree, nor do the orchid,
hibiscus, jasmine and marigold: `FLORA_TREES` is the list, and a name not in it warns. The pen is
pointed at the sheet for the painting and put back after.

`flora.html` is the sheet, in two parts of six seconds: the twenty, large, each with its three
names; and at their own sizes an orchard, a mango tree in fruit, a papaya, a jackfruit on its trunk
and a ratchaphruek in flower, with a lady on the floor and the little girl at a mat of the market's
fruit. Measured (2026-10-13): all twenty take 10.4 ms to draw at size 1; `kit_check.py`:
`flora.html` draws, same 0 / 0, 18.3 ms a frame, arms 0, 0, 0.

**Not done:** nobody holds a flower or a fruit, picks one or eats one: a thing stands where it is
put. Each is seen from one side and has one arrangement. A tree in flower is the kit's one tree
with blossom hung in it, not the shape of that tree: a ratchaphruek's racemes hang below the
leaves of a tree that is not drawn weeping, and a thong kwao in flower should be bare. There is no
garland (the kit's `garland` is a dress piece), no offering tray, no lotus here (the kit has
`lotus` and `lotusClump`), no basket or stall, and no fruit cut open but the mangosteen, the
papaya and the pomelo. The flowers and fruits are not in the cartoon maker's palette. Judged from
stills only.

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
| `waves(brush, x, y, wide, tall, colour, t)`, `pond(brush, x, y, wide, tall, {t, rings})`, `ripples(brush, rings, t)`, `fish(brush, x, y, size, facing, colour)` | water, still or moving with the second; a pool with a bank line; the rings of a drop; a fish in profile |
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

## Pieces of the north (2026-10-15)

The owner asked for research on "new items specific to Lanna Thai to add to the kit as sprites",
then: "Start with the inanimate objects on the list." The list, ranked, is in the owner's
`Videos/lanna_sash/lanna_sprite_candidates.html` (ox cart, string band, hong, kalae, water jar,
sand pagodas, lamps and fireflies, samlor and red truck, the great drum, small creatures, the
harvest, krathong; Poy Sang Long and spirit things kept out). The inanimate ones are **`pieces.js`**,
loaded after the kit, with its sheet **`pieces.html`**; each drawn from Wikimedia Commons
photographs under free licences (kept in scratch with their credits; nothing copied, only what they
show):

- **`hong(brush, x, y, size, colour)`**: the hamsa that crowns the tall tung poles: a swan's body,
  the neck curved up and back, a crest and a pointed beak, one wing swept up behind in four rounded
  feathers, a tail curling up in a flame scroll; gold. **`tung(brush, x, base, t, true)`** sets one
  on the pole (a fifth argument; every old call draws as before). Reference: the gilded hang hong of
  Wat Chet Yot (CC BY-SA 3.0).
- **`namton(brush, x, base, size)`**: the water jar at the gate: a round brown clay pot with a lid
  on a stand of four posts under a little roof, a coconut dipper on a hook. No Commons photograph
  was found under the Thai names (น้ำต้น, ฮ้านน้ำ); drawn from knowledge of the custom, to be checked
  against a photograph when one turns up.
- **`chediSai(brush, x, base, size, t, seed)`**: a Songkran sand pagoda, a smoothed cone of pale
  sand with five paper flags on sticks pushed in, each a bright triangle that flutters. Reference:
  sand stupas at Wat Pho (CC BY 4.0): the same object, the flags the same.
- **`pratheep(brush, x, y, size, t, seed)`** and **`pratheepRow(brush, x, y, count, gap, size, t)`**:
  the clay lamp of Yi Peng, a shallow terracotta dish, a flame that leans and flickers, a warm glow
  on the ground. Reference: Wat Phan Tao at Yi Peng (CC BY-SA 4.0), rows of them on the ground and
  on the water's edge.
- **`krathong(brush, x, y, size, t, afloat)`**: a slice of banana trunk, a ring of twelve folded
  leaf points, three marigolds and an orchid, a candle with a flickering flame, three incense
  sticks; afloat it bobs and tilts. Reference: a krathong on white (CC0).
- The kalae on the kit's house was already there (two crossed boards): each board now ends in a
  carved tip that curls outward, as a kalae's does (`house()`, every house draws the tips).
- **`oxcart(brush, x, base, size, turn, facing, yoke)`**: the kwian, the wooden cart of the north:
  two tall twelve-spoked wheels with an iron tyre and a dark hub (the far one a little behind the
  near one), the bed on its axle beam, a slatted rail each side that ends in a horn curving up and
  out at the back and the front, and a shaft forward to `yoke`, a point [x, y] on the page (the
  withers of the beast); without a yoke the shaft goes forward on its own. `turn` is how far the
  wheels have rolled, in radians: the ground covered divided by the wheel's radius, 62 x size. The
  axle is over (x, base) and the wheels' feet on base. Draw it before the beast so the beast stands
  over the shaft. Proportions from a weathered teak kwian (CC BY-SA 2.0, Dennis G. Jarvis) and a
  kwian at Wat Phra Sing, Chiang Rai (CC BY-SA 4.0, Jakub Hałun): the wheel's top is about the ox's
  belly, the rails' horns stand above its back. On `pieces.html` the kit's buffalo pulls it:
  `amble("buffalo", ...)` gives the place and the step, the yoke is the withers at (150, -310) in
  the buffalo's own scale (1.25 x its size), the axle 460 behind, the turn is the x covered / 81.
- **`drumCart(brush, x, base, size, facing)`**: the great drum of a temple on its cart, as the
  drum carts of Chiang Rai are: a long barrel drum laced with cord, its head a skin in a ring of
  pegs toward the way it faces, three small drums stacked at the head, two tall wheels with
  gold-painted spokes, the axle beam under the drum with a gold finial ahead of the head, and from
  the tail a long pole back to a small wheel, a handle bar above it. Reference: the drum cart of
  Wat Hiranyawat, Chiang Rai (CC0, Iudexvivorum).

In the maker: `namton` (🏺 น้ำต้น), `tung` (🎏 ตุง, crowned) and `drumcart` (🥁 กลองหลวง) are set
pieces (painted once a scene); `chedisai` (🏖️ เจดีย์ทราย), `pratheep` (🕯️ ผางประทีป, a row of five
about its point), `krathong` (🪷 กระทง, afloat, on a course) and `oxcart` (🐃 เกวียน) are things,
drawn each frame so their flags and flames move; the rules prompt names them. The maker's `oxcart`
is the kit's buffalo (beasts.js) pulling the cart: its point is under the buffalo, the cart's axle
is 288 x scale behind it and the yoke on the withers, the buffalo's step and the wheels' turn are
both read from the ground covered (P[6]) as the mom's step is, and the cart is drawn first.

In the hero film `sash.html` (owner, 2026-10-15: "Add some of the new object types to the sash for
the hero video"): the village set gains the water jar beside the house's ladder and a crowned tung
beyond it (painted once, in `paintSet`); in the rice fields a buffalo (size 0.55) pulls the ox cart
(size 1.3) from the right along the back of the wide bund at y 872, through the rain and on under
the clearing sky, `amble()` placing it and the yoke on its withers, drawn before the women so they
pass in front; at the night of dancing the great drum on its cart stands at the left beside the
drummer, its head toward him. (A row of thirteen Yi Peng lamps along the front edge went in and came
out the same day: the owner, "a bunch of extra sprites at the bottom".) Not
done: the Commons search for the kalae found nothing (the Thai name matches Calais); the band, the
vehicles, the creatures and the harvest tools remain on the list.

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

## Pieces for a tale: a cave's mouth, a poor family's hut

What the film of the creature with four ears and five eyes needed and the kit did not draw (2026-10-19).
Its sheet is `tale_pieces.html`.

| Piece | What it is | Rules |
|---|---|---|
| `caveMouth(brush, x, y, size, look)`, `highlands.js` | the cave of a tale in a mountain's side, (x, y) its foot's middle; 250 wide and 135 high at size 1 | a dark arched opening, darkest deep in; boulders round it lit from the upper left, the right jamb in its own shade; a low lintel of rock over it, a ledge of stone before it; moss on the stones; ferns hanging over the top that stir with `look.t`. `look.rock`, `look.dark`; `look.tint` [colour, amount] blends every colour of it toward one light, as a set painted by day and tinted is |
| `firewood(brush, x, y, size, look)`, `pieces.js` | a bundle of firewood (หลัว), as a child carries it home; (x, y) its middle, 120 long at size 1 | `look.count` sticks (7) of a length, one a little longer, their cut ends pale, bound round in two places with a vine; `look.turn` turns it; `look.loose` lays the sticks apart on the ground, gathered but not bound. Carried on the shoulder it is drawn before the person, behind the head, its ends out before and behind, the near hand closed on its front end (the film measures the shoulder first: `maengMeasure()` in `maeng/sets.js`) |
| `tub(brush, x, base, size, look)`, `pieces.js` | the tub (ตูบ), the small hut of a poor family of the north, as the tales have it; 250 wide and 225 high at size 1 | four short stilts and a floor beam; walls of woven bamboo (fa khat tae), a plain weave of strips across, one way and the other; a dark doorway at the right with a short bamboo ladder; a steep roof of grass thatch in rows of straw, ragged at the eaves. `look.glow` (0 to 1) lights the doorway and the ground before it, a lamp at night; `look.tint` as the cave's |
| `kok(brush, x, base, wide, size, look)`, `pieces.js` | a pen (คอก) of bamboo for an animal, its front's middle on (x, base), `wide` across, two-thirds as deep; 110 high at size 1 | posts at the corners and along the sides, two rails of split bamboo round it, bound at each post. In two parts so that what is kept in it stands inside: `look.part` "back" (before the animal) and "front" (after it); `look.tint` |
| `snare(brush, x, base, size, look)`, `pieces.js` | a snare: a noose of rope on a bent sapling | set (the sapling bent, the noose open on the ground) or `look.sprung` (the sapling up, the noose drawn tight); `look.caught`: a point of the scene the noose holds (a paw), the rope running to it; it shivers with `look.t` while something pulls |
| `campfire(brush, x, base, size, t, look)`, `ember(brush, x, y, size, t)`, `emberFlight(brush, from, to, u, size, high, t)`, `pieces.js` | a yard's fire, and its coals | a ring of stones, sticks crossed and charred at their ends, flames that leap and flicker with `t`, coals red under them, a warm light round it (`look.light`; `look.low` burns it down to coals); 150 wide, 170 high with its flames. An ember glows and sparks; `emberFlight` carries one from `from` to `to` on an arc `high` above them, `u` of the way (0 to 1) |
| `goldNugget(brush, x, y, size, t, look)`, `pieces.js` | a nugget of gold | lumpy, lit from above, a glint that comes and goes with `t` (`look.shine`, `look.seed` so that two do not glint as one) |
| `hoKham(brush, x, base, size, look)`, `hoKhamFloor()`, `hoKhamDais()`, `pieces.js` | a hall of a Lanna palace (หอคำ), open at the front; 800 wide, 700 high at size 1 | a white plinth with a stair up its middle; a floor of teak; posts of dark red teak banded with gold; behind, a red wall stencilled with gold (lai kham) and a gilded dais; a roof in two tiers of dark shingles, their eaves trimmed with gold flames, a golden gable with rays, and a golden finial (cho fa) curling up at each end of the ridge. In two parts, `look.part` "back" and "front", so that whoever sits on the dais is inside; `hoKhamFloor(base, size)` and `hoKhamDais(base, size)` give where the floor and the dais's top are |
| `gong(brush, x, base, size, look)`, `gongAt()`, `pieces.js` | a gong (ฆ้อง) on its stand; 110 wide, 170 high at size 1 | two posts and a beam of wood, the bronze gong hanging from it by a cord, a raised boss in its middle; `look.struck` (seconds since) swings it a little and sends out rings of sound for a second and a half; `gongAt()` is the boss, where a mallet strikes |
| `linKham(brush, ground, built, look)`, `pieces.js` | a trough of gold (ลินคำ) on forked posts, as a house's rainwater runs along one to a jar | a half-pipe of gold, lit along its upper lip, `look.high` (46) above the ground on forked posts, one every `look.gap` (80); it runs along `ground`, a row of points of the scene, and is drawn only `built` of the way along it (0 to 1), so a film grows it; `look.sag` [where, how far] bends it down in the middle (up, below 0); `look.size`, `look.tint` |
| `horse(x, y, look)`, `beasts.js` | the small pack horse of the Yunnan caravans (ม้าต่าง), as the Haw traders led them into the north; about 330 high at the withers at size 1 | short and sturdy, a deep chest, a thick neck, a big head carried low; a short dark mane that stands up in a ragged band, a long dark tail; slim legs darker below the knee, on single hooves. It walks as the other beasts do (`step`, `amble("horse", ...)`, `GAITS.horse`) and feels as they do (`feel`: its eye, its ears, the carriage of its head, its tail). `look.pack`: a pack saddle (two frames of crossed wood) with a load lashed on each side, true or the colour of the load's cloth; `look.mane`: its mane's colour. Gives back `{seat, head, nose, load}`: the nose is where a halter's rope ties (`maengLead(..., "horse")` in `maeng/sets.js` leads one) |

The kit's house (`house()`) is a fine teak house and its huts (`bdHut`, `fieldHut`) are open shelters of the
fields: neither is a poor family's home. A cave at a film's size sits on the forest like a hut until the
forest grows over it: the film draws a few of the forest's own crowns (`crown()`, the slope's sizes, its
haze and the light) behind the cave's top and before its foot (the sheet's second cave), and its lintel is
low, a face of rock, not a dome.

`kit_check.py tale_pieces.html maeng/s01.html`: 2 pages, 0 failures; the sheet draws, same 0 / 0, 9.5 ms a
frame.

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

## The things of a Lanna home, and the things pass (2026-10-19)

The owner: "Use notebooklm to make a notebook about Lanna house hold items. See what you should add to the kit from
there and then add to the decorate process for house hold items and location decoration like for the palace scene."
The notebook ("Lanna household items", 22 sources picked by hand from two deep sweeps, each loaded and of real
length) answered from its sources only, and said which of its sources were not Lanna: a thesis on the Phu Tai of the
north-east (their stove and wok are not the north's) and a page on the Bangkok court's regalia. What the kit did not
draw went into pieces.js, each from what the sources say of it:

| Piece | What it is |
|---|---|
| `huad(brush, x, base, size, t, look)` | the sticky-rice steamer: a cone of woven bamboo in the mouth of a round clay pot on three hearth stones, a cloth over it; `look.fire` lights a fire under it and its steam rises |
| `kongKhao(brush, x, base, size, look)` | the kong khao, the lidded basket that keeps steamed rice: a round body of fine weave on a squared foot, a domed lid, a cord |
| `krabung(brush, x, base, size, look)` | an open basket, round, wider at its mouth, its rim bound |
| `mortar(brush, x, base, size, look)` | the wooden mortar kept under the house and its long pestle, leaning, or pounding (`look.pound`, a second) |
| `taLaew(brush, x, base, size, look)` | the ta laew, a star of woven bamboo on a post that guards a yard: pointed petals of strip round a small open lattice (`look.points` 6 or 8). A star of two crossed triangles is a different sign, and was drawn first and taken out |
| `hoKham(..., {pediment: "peacock"})` | the palace hall's gable carved with a peacock among leaf scrolls, as the old Ho Kham's pediment at Wat Phan Tao has it (the dog under its peacock is one ruler's own, and is left out) |

**The things pass** comes before the life in decorating a scene: `dress(t, things, layer, tint)` in decorate.js
draws a place's things from a list, `[{name, kind, x, base, size, look, layer, from, to}, ...]`, the kinds being the
kit's painters (THING_KINDS). What a place has in every scene is listed once, with its set: the film of the creature
keeps the yard's (a mortar under the hut, a basket at the ladder, a ta laew beside the path), the hut's inside (the
hearth and its huad, one rice basket, one open basket) and the palace's (`maengPalace()`: the peacock gable, two
lanterns of gold-patterned paper hung from its eaves, as before a ruler's hall). A very poor family has few things:
what is not there tells the story too.

## Every check writes its result down (2026-10-19)

The owner: "change the kit test so each test outputs a success or failure message to a file. If it's practical
break it up some so parts don't run if the thing the test didn't change." `checks/report.py` is what every check
writes with: `out/checks/NAME.txt` (a line an item, PASS, FAIL or SKIP, and what was found; then SUCCESS or FAILURE
and the counts), `NAME.json` for a program, and a dated line in `out/checks/history.log`. With `--changed`,
kit_check, seek_check, sound_check and score_check leave out what nothing it depends on has changed since it passed:
a page is marked by its own file, every script it loads and the check's own code, so a change to the kit's shared
files or to the check runs it again, and a `--quick` pass does not stand for a full one. snapshot.py is about change,
and always runs. Measured: a second kit_check on two pages took 1 s against 14, and wrote what it left out and why.

## The studio's card, and the tale's titles (2026-10-19)

The films open on the hero film, then the card of Slow Life Studios, then the tale (the owner). `sls_intro.html`
is the card, 12 s: an evening by a river in the north, a house on its stilts with its lamp lit, a mountain with mist
in its folds, fireflies rising and blinking over the water (`fireflies()`, drawn from the second alone), and the
studio's name coming up in gold in the Lanna script: ᨩᩦᩅᩥ᩠ᨲᨧ᩶ᩣ᩻ ᩈᨲᩪᨯᩥᩋᩰ, ชีวิตจ้า ๆ สตูดิโอ (the Kam Mueang of the
voice project's writer: the north's จ้า for "slow"), with its Thai letters and its English under it. A studio card
of another studio was its only reference, for its calm: nothing of it is taken. The tale's own titles are over
its first seconds, in the fog: the series, Lanna Tales (นิทานล้านนา: ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ), in the Lanna script alone, then the
tale, ᨾᩯ᩠ᨦᩈᩦ᩵ᩉᩪᩉ᩶ᩣᨲᩣ, with its English small under it. Every Lanna spelling was written by the Kam Mueang alphabet's
own rules (krueng.ai's alphabet page, `lanna()`), in Noto Sans Tai Tham, and none is yet checked by a native speaker.

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

## The kit's sounds: voices made from outlines (2026-10-19)

The kit's creatures have voices, and none of them was recorded. `howl.py` makes a voice from an outline of
numbers: how its pitch goes over time, how loud, how open its mouth is (from "oo" to "ah"), how much growl and
breath are in it, how big its throat is, and how long a cave's echo rings after it. Underneath, each part is a
plain rule: a train of pulses that glides along the pitch is the voice; a pulse train at half the pitch,
beating against it, is the growl; noise is the breath; three resonances that move between the "oo" and the
"ah" are the mouth; noise dying away, darker as it dies, is the cave. An outline of `{"voices": [...]}` mixes
several, each from its own second at its own loudness, under the one echo.

`sounds.py` is the library: every sound the kit has, by name, with what it is for. The first are the creature
with four ears and five eyes, in the moods its story asks of it. The owner asked that "the pack and voice
should be one thing", so its voice is one voice of many throats: its own low, rough howl, and four higher,
smoother voices inside it (1.5 to 2.67 times its pitch, each a few hundredths of a second late, each wavering at
its own rate) that follow its rise and fall, so that they sound as one wild voice and not as wolves answering.

| Sound | For | What it does |
|---|---|---|
| `maeng-base` | the night on the mountain | rises, holds high, falls away into the cave (6.9 s) |
| `maeng-angry` | caught in the snare | three short roars, the last the biggest, rough all through (4.2 s) |
| `maeng-afraid` | the crowd round its pen | high yelps that break upward, then a thin, wavering cry (4.5 s) |
| `maeng-sad` | alone in the pen at night | a slow howl that falls, catching like a sob (7.9 s) |
| `maeng-happy` | eating the embers | quick bouncing howls that rise at the end, no growl (3.3 s) |
| `maeng-home` | running home into its cave | one long howl that starts low and lifts, its throats swelling (8.9 s) |

```
python sounds.py                    # every sound into out/sounds/ (NAME.wav, NAME.json), all.wav, list.js
python sounds.py maeng-sad          # one
python sounds.py --list             # the names, and what each is for
python checks/sound_check.py        # each is made, as long as its outline, loud enough, not clipped, not like another
```

Then `sounds.html` plays each one beside what it is for. The sounds are made, not kept: `out/` and `*.wav`
stay out of the repository, and anyone makes the same sounds from the same numbers. A new sound is a new
function in `sounds.py` and a row in `SOUNDS`. A sound is never cut from someone else's recording: the owner
once asked for a howl sampled from a feature film, and the kit made its own instead. Needs numpy and scipy.

## Music that follows the story's feelings (2026-10-19)

The owner: "Plot each scene musically against the emotion of each sentence and make sure the music always
reflects the emotion of the sentence. Start from the hero video for lanna_cartoon's music." `score.py`
does it for any film: it takes cues (a second and a feeling's name, each until the next) and makes music
that turns with them. It begins to turn 0.6 s before each cue and has turned 0.9 s after it; the two
feelings' music cross in that one window and nowhere else. The sound is the hero film's: `sash_music.py`'s
plucked sueng strings, bowed chords, drum, ching, echo and room, imported from there, not copied. "Calm" is
that film's own: its pentatonic tune on A, and its A minor and C chords.

Each feeling is a recipe, `FEELINGS` in `score.py`. The recipe sets its notes, how high its tune lies, how
often a string is plucked and whether the line climbs or falls, how long a note rings, its chords, its drum
and ching, and how loud it is:

| Feeling | Notes | How it goes |
|---|---|---|
| calm, tender, sleepy | A C D E G (the hero film's) | calm: the hero film's plucks; tender: higher, sparser, the chords warmer; sleepy: a note every other beat, quiet |
| wonder | A B C# E F# | two plucks a beat, high, climbing, ringing long |
| mystery | A B C# D# F (whole tones) | low and sparse, ringing long |
| comic, bustle | G A B D E | short, quick notes on a drum; bustle steadier, as hammers |
| joy, hope, triumph | G A B D E | joy: the hero film's dance (drum, ching); hope: climbing, a soft drum; triumph: all of it, and a low gong on the bar |
| royal | D E F# A B | stately, a note a beat, a slow drum |
| sad, grief | D F G A C | a note every other beat, falling, the chords held; grief lower, slower, softer |
| tense, fear | A Bb D E | quick soft repeated notes over a heartbeat drum; fear higher and faster |

Each set of feelings has notes of its own, and every one of its chords holds them (`CHORDS`). Sadness has its
F (the minor third), gladness its B, the royal its F#, wonder its C#, the mystery its whole tones (C#, D#, F), dread
its B flat against the A. That is what makes the music say its feeling. It is also what lets a check hear it.
`checks/score_check.py` listens to the music under every line, not to the cue sheet. It takes the stretch
where only that line's feeling sounds and scores each note the way an ear picks one out: the note itself and
its overtones together. So a bowed G's fifth overtone is not heard as a B, a drum's falling body is not
heard as notes, and an F is not heard because the A's played are its fifth. Then it finds which set holds the
music: its notes must hold the energy, and each of its notes that does not sound counts against it. That set
must be the line's feeling's. The check also draws the plot (`out/maeng_music/plot.html`): every sentence of
every scene as a block in its feeling's colour, under it the notes the music was heard in, and the music's
loudness and how many notes begin a second, along the time.

The film of the creature has its sentences' feelings in `maeng/feelings.py` (`FEEL`: each line's, from what
the sentence says). It takes the lines' seconds from the scene files themselves (`SNN_LINES`), so each scene's
music is made as the scene is, on its own:

```
python maeng/feelings.py            # every scene's music: out/maeng_music/sNN.wav and cues.json
python maeng/feelings.py 4          # one scene's, after a change to it
python checks/score_check.py        # is every line's music in its feeling's notes; the plot
```

What the check found while it was built, each fixed in the music and not in the check: the next feeling came
in a second and a half too early, so two feelings sounded together for three seconds; a feeling's chord only
began to swell as the feeling began, so its first seconds were nearly all strings (now a chord is already
sounding as each feeling comes in); and the chords, stacked from every other note of a set, could leave out
the set's own note: sadness without its F sounded like calm. And two sets shared a chord: an A minor chord is
in both the calm notes and the first mystery notes (A B C E F), so tender music resting on it was heard as
mystery; the mystery's notes are now whole tones, which share only the A with the calm.

## A puppet of a Spark drawing

The owner's answer to the SVG question (2026-10-11 evening): nobody to draw her, "but the Spark can
draw". So the drawing comes from the Spark and the kit moves it, as a cut-out puppet:

1. `python -P rig_draw.py lady.png 47` — one SDXL still (animagine-xl-3.1, through
   `spark_media.t2i()`): full body, facing front, arms out, flat colours, thick outlines, a plain
   ground. Four tries of the first prompt gave kimonos and slit skirts; the second prompt, with
   `(T-pose:1.3)` and the wrong clothes in the negative, gave the one in use at seed 47.
2. `python -P rig_cut.py lady.png rig_lady pose_landmarker_full.task rig_lady_joints.json` — the
   ground goes transparent (a flood fill from the corners); the pose model finds the joints (on this
   drawing it found nobody until the ground was white, and then guessed the legs inside the skirt
   at 0.05, so the legs' joints come from the file, set by hand; `joints.png` shows what was used);
   each part is the figure under a capsule round one bone, the torso a box, the head a disc, the
   skirt everything from the hips to below the ankles. `rig.js` lists the parts with their joints.
3. `puppet.html` loads `rig_lady/rig.js`, calls `rigImages(RIG, "rig_lady/")`, and draws
   `person(x, y, {rig: RIG, ...})` beside the code-drawn lady with the same motion: the same walk,
   the same tracked dance, the same hops and lags.

In the kit, `look.rig` switches six places in `person()`: the feet hang from the ankles as drawn
parts (no legs under a drawn skirt), the skirt hangs from the hips and sways `0.05 · sin(phase − 1)`,
the torso is one part from the hips to the shoulders, the head one part turning about the top of
the neck (the drawing's pivot is put 60 units above its shoulder line, where the kit's is), and
each arm is `rigArm()`: the elbow from the drawing's own bone lengths, the hand turned with the
forearm. The puppet keeps the drawing's proportions: its hips stand `rig.legs` high, the
drawing's hip-to-ankle, so `size` 1.4 matches the kit lady at 2.0. `part()` places one image so its
two joints land on two points: turned to the bone, scaled by `rig.scale` (148 kit units over the
drawing's shoulder-to-hip pixels), stretched along the bone when asked.

**The owner's judgment, the same night: the code-drawn lady is the better model, and she stays the
model.** The puppet is kept as a route the kit can take, documented here and in `puppet.html`, and
is not built on further.

What it did not get to: the face is a still (no blink, no mouth, no glance); there are no legs and
no knee under the skirt; the parts are raster, so the line gets soft when scaled up; and the style
is the Spark's, not the kit's, so a drawn lady among code-drawn children is a visible break unless
the whole cast is drawn the same way. The parts are media and stay out of git: `rig_lady/` is made
by the two commands above (they are the recipe), and the picture goes to S3 if the page uses it.

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

## The quality round (2026-10-14)

The owner asked how the pictures and the animation could be better, took a ranked list, and
said "begin on all of it". What came of it, and the words a film uses:

- **The frame.** `window.FILM_STYLE = {wide: 1920}` before the kit loads fills the 16:9 screen;
  without it the sheet is 1440 with black bars, as before. A film staged on the 1440 sheet goes
  wide the way sash.html did: paint the sets across `WIDE` with what stands on them moved in by
  `SIDE` (the old bar's width), and draw each scene's figures under `pen.translate(SIDE, 0)`, so
  every old coordinate keeps its place while the sky, hills, crowd and lanterns span the frame.
- **The print's wear.** `film: 0.6` in the style shows the grain, flicker, dust, scratches,
  dark corners and the shake at six tenths; 0 is a clean picture, 1 the full 1930s print.
- **The light.** `light: [-0.6, 0.5]` says where it comes from; each figure then throws a
  lozenge of shadow on the ground, sheared away from it, beside the soft pool it always had.
- **The air between.** sash.html lays a veil of the sky's colour over the far ranges (thick at
  the horizon, gone by the near range) before the near hills are painted: the far hills sit off.
- **Cloth, not tubes.** `ribbon()` draws a hanging end of cloth as a flat tapered band with an
  ink edge, a fold line where it turns and, for a checked cloth, bars across it; the ends of a
  sabai, a man's shoulder cloth and the waist cloth use it. `hose()` is still the limbs' line.
- **What lags.** The head-cloth's ends swing after the head on a `follow()` spring, as the
  sabai's ends and the waist cloth's already did.
- **Feet planted.** sash.html's walkers go by `stroll()`; `stride` is set per walker so each
  arrives about when the old `mix()` walk did. Nobody hops but the dancers: `hop: false` in the
  style, and `STYLE.hop = true` set for the dance scene's seconds in draw(t).
- **The acting.** A nod is a `tween` with a small dip back and two bows; wonder rises on a
  tween when something is worth it (the child at the woman's wai, the two at the pond as the
  dragon passes, their eyes `at` its head while it does); the man of the lane has `feel: "joy"`.
- **The encode.** render.py hands ffmpeg PNG frames and `-crf 18 -preset slow -tune animation`;
  `--fast` keeps the old JPEG path. A 57-second film takes about a minute longer.
- **Two device pixels.** `pixels: 2` in the style draws the sheet and the screen at twice the
  size with a base scale on the pen and the screen, and the browser's downscale to the 1920
  picture smooths every ink line; the video stays 1920 x 1080 and the render takes about a
  sixth longer. What is painted once at the sheet's size (sets, clouds, the woven cloth) is
  scaled up as it is drawn, as the lens scales it anyway, so figures and text gain and sets stay
  as they were. A page that draws without `film()` is untouched; paperdoll.js resets the pen's
  transform, so a doll page must not set it.

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

## The story told in Kam Mueang (2026-10-16)

The owner: "When you render the video can you use the kam muang Chrome plugin for the audio to tell the
history of Lanna instead of using the song lyrics? Use notebooklm notebooks on kam muang and create
another on Lanna history to get the text." Asked, they chose to replace the song in the hero film, Kam
Mueang with its English under the picture, and the film's music softly under the voice. Then: "Remove
the title screen from the end of the video"; "Make the words relevant to the cartoon. Like it was for
little kids. In ancient times, life moved more slowly..."; "Then go on explaining the special artifacts
that are uniquely Lanna. Mention that the dragon is actually Chinese just before the man looks up at the
dragon. Have a people's republic of China flag appear in the dragon's claw for a moment and wave back and
forth a few times and then disappear. You may have to extend the scene a bit"; "no facts about china
just a joke about the dragon"; "You can give a fact about Chinese dragon's though".

| What | How it is made |
|---|---|
| The facts | A NotebookLM notebook, "History of Lanna: narration for the Lanna cartoon hero film", of Wikipedia on the Lanna Kingdom (English and Thai), Mangrai, Tilokaraj, Kawila, Chiang Mai, the Burmese–Siamese wars, Bo Sang, Yi Peng, the Chinese dragon, สไบ (the sabai), ตุง (the tung), โคมลอย (khom loi) and เกวียน (the kwian). Thai Wikipedia has no page for the kalae, the Lanna lantern, the water jar at the gate or the great drum (each 404), so the words say nothing of them. Every fact in a line has its citation; a line that only says what is on screen needs none. The joke's fact is the Chinese dragon's: "Many pictures of Chinese dragons show a flaming pearl under their chin or in their claws." |
| The Kam Mueang | A second notebook, "Northern Thai (Kam Mueang): models and language resources, 2026", asked to put each line in Chiang Mai Kam Mueang and name each dialect word's source (`pythainlp/lanna_dict`, the Charatrit KamMuang-Thai-English pairs, a guide to speaking Lanna). Three lines mended by hand: the parasols are Bo Sang's kind, not spun at Bo Sang; "a million fields" without ทุ่งนก ("fields of birds"); ถือ (hold) for คาบ (hold in the mouth). No native speaker has checked it. |
| The voice | The Kam Mueang Voice extension's own model, Meta's MMS Northern Thai (CC BY-NC 4.0) at full precision, run by transformers.js 4.3.1 in Node as the extension runs it: `say.mjs`. It says about 12 to 13 Thai characters a second. It drops ๆ (จ๊าๆ came out as one จ๊า, 1.8 s for the first line), so each line in `WORDS` has a spoken form with the word said twice beside its written one. |
| Takes | The voice draws its timing from noise, so a line is never said the same way twice. `sash_narrate.py --takes 4` speaks each line four times and keeps the take that faster-whisper (medium, Thai) hears closest to its words. Kept takes: 0.59 to 0.93 of the letters heard back, mean 0.78; one take a line had given 0.47 to 0.96, mean 0.74. The recogniser knows Central Thai, so these numbers are a floor for the dialect words, not a grade. |
| The mix | `sash_music.py` makes 152 beats now (79 s of notes; the first 132 are the beats they were). The music plays at 0.7 of its level, goes down to 0.3 of that over 0.35 s before each line and comes back after it; the voice's peak is 0.9; the music fades over the film's last two seconds (the end card had hidden that `render.py` stops the sound at the last frame). Every line ends before its words leave the screen, which the script prints line by line. |
| The film | 79 s, with no end card: the cloth 0–22, the lane 22–35, the pond 35–50, the rice fields 50–70, the dance 70–79. The pond's dragon is the Chinese kind; its course and the look-up come five seconds later in the scene than before, so the voice says "this dragon came from China" (39.8 s) before the two at the pond look up (43 s). The maiden wais from the scene's first second, as the voice says she greets us. The drummer no longer mouths a song. |
| The flag | `dragon()` now gives back `{claw, size}`: its near front foot in the points of the frame it was drawn in, and its size. `chinaFlag()` in `sash.html` draws the flag of the People's Republic of China as its law sets it out (3:2, red, the large star at (5, 5) of a 30 by 20 grid, the four small ones each pointing a tip at it), on a pole in that claw, from 8.8 to 11.6 s of the pond scene: it grows out of the claw, rocks back and forth three times as the cloth ripples, and shrinks away. The pole leans 0.4 forward, so the cloth flies above the head (0.7 and 1.0, drawn side by side, made the flag read as falling); 2.6 times the dragon's size; nearly opaque even far off, or the body showed through it. The dragon's pearl was gone while it held the flag, the joke of line 10, "Chinese dragons usually hold a pearl, not a flag!"; since the owner's "change the dragon so the white thing isn't coming out of its mouth" (2026-10-16) it has no flaming pearl before its snout at all (`chase: false`), and the line still says what such dragons usually hold |
| The tung by the house | Drawn live, not on the village set, by `villageTung(T)` in the cloth and lane scenes, on the film's clock so the sway goes on across the cut: the kit's `tung()` with the hong, its cloth in the shape it had on the set (the kit's wave at 0), leaning `TUNG_SWAY` either way about the pole's foot (owner, 2026-10-16: "the flag with the rooster on the top sways a little bit"). The kit's own wave was tried first: its six panels each wave on their own and came apart, and at its size it flapped rather than swayed | 1.2 degrees either way, `sin(T * 1.3)`: about 10 px at the hong, once in 4.8 s |
| The checks | `kit_check.py sash.html dragon.html dragon_china.html dragon_flight.html`: 4 pages, 0 failures; the 17 lines each inside one scene; the wai whose first frame folds an arm is at 36.0 s now (the pond's maiden, a second into the scene), so the allowance names it there. `kit_check.py`'s cue check takes a cue's own end, as its fifth entry, for a spoken line. `dragon.html`, `dragon_china.html` and `dragon_flight.html` drawn with the old and the new `dragon.js`: 0, 2 and 3 frames of 12 differ, by 1 to 3 pixels, the kit's own spread from one load to the next. |

## The band, more lanterns, the farmstead and the red truck (2026-10-16)

The owner: "Do some research using notebooklm and add some items that are specific to Lanna culture to
the framework." A NotebookLM notebook, "Lanna material culture: new items for the Lanna cartoon kit"
(38 sources), was filled from eight Wikipedia pages and four fast web researches (everyday things and
the granary; the decorations of Yi Peng and the kinds of lantern; the instruments of the north; the
Tai Yai dances and the guardian lions), with the broken and the off-topic sources taken out. Its answer
listed what the north has and the kit did not; asked which to build, the owner chose all four groups
offered: the string band, lanterns that move, the farmstead, and the rot daeng. Each was then asked of
the notebook as a drawing needs it (how the instrument is held, which hand does what, what the parts
are), and its shape read from Wikimedia Commons photographs under free licences, kept in scratch with
their credits; nothing copied. Two of the notebook's answers were checked against the source's own
words: the tung sai mu as "multi-tiered clusters of small triangular flags attached to a single stick
... five or seven layers" is Chang Puak Magazine's wording, kept; the khom thue "hanging from a stick"
was not: the source says a handheld lantern has "a handle underneath, quite like a giant candle", and
it is drawn so.

| What | File and call | What it does, and what it was read from |
|---|---|---|
| The salo | `band.js`: `salo(x, y, size, angle)`, `saloBow()` | a coconut body with a wooden plate, a turned spike, a long dark neck, two great pegs, a cord binding the strings, a turned spire; 214 long at size 1. The bow is apart from the strings, its hair outside them. Jiranee119's photograph (CC BY-SA 4.0) and Purinee Donchai's drawing of its ten parts (CC0) |
| The sueng | `sueng()`, `suengPick()` | a round body with a carved point under it, a flower of red and gold round the hole, a bridge, nine bamboo frets closer as they climb, four strings in two pairs, a flat carved head with four pegs; 190 long. The Chiang Mai artisan's sueng (Leopoldoghost, CC BY-SA 4.0), a wall of them (CC BY 2.0) |
| The pi chum | `piChum()` | a straight pipe of bamboo, two nodes, the brass of the reed near the top, seven finger holes; 126 long, the middle of its five sizes. No photograph of one was found; the hold is the Laplae band's straight pipe (CC BY-SA 3.0): down and forward from the mouth, both hands on it |
| The phin phia | `phinPhia(x, y, size, angle, flip)` | a long stick, a half coconut on a short post a quarter of the way from its two pegs, the far end bent into a curl capped in metal. The Metropolitan Museum's of the 19th century (CC0). `flip` hangs the coconut on the other side of the stick |
| A player | `musician(x, y, kind, look, late)` | below |
| The khom phat | `khom.js`: `khomPhat(x, y, look)` | a cylinder of white paper, a red band with gold flowers above, a band and a fringe of cut paper below, the posts of its frame through the paper, a wheel of six vanes on top; inside, six figures cut from black paper (an elephant, a horse and rider, a deer, a carrier with two baskets on a pole, a buffalo, a dancer) go round with the vanes, `0.45 * spin` radians a second, and their shadows show on the front half of the paper, squeezed toward its edges and fading there, black when it is lit and faint by day. Village figures, not the Jataka of the temple's lanterns. `spin` is given, not taken from `lit`: a turn worked out from a light that comes on during a film would jump |
| The khom thue | `khomThue(x, y, look)` | a small lantern of six sides on a handle, standing in a gold cup with paper tassels round it; (x, y) is where a hand holds the handle, and it is drawn after the person so the handle goes up through the fist (`person()` gives back `joints.handA`). Carried along, `lean` lets its top trail the walk |
| The star and the lotus | `khomDao(x, y, look)`, `khomBua(x, y, look)` | a star of five points, each point two faces lit apart, a thickness behind, a tail from each lower point; a lotus of seven petals in three rows, open, on three strings, a tail under it. Both swing, and glow when `lit`. No photograph found; drawn from Polyglot Petra's list of shapes |
| The sawian | `pieces.js`: `sawian(brush, x, base, size)` | a tall round basket, its weave seen under a coat of dung and resin, a bound rim; the CMU Lanna Traditional House Museum's words |
| The granary | `longKhao(brush, x, base, size, walls)` | a small house of timber on six heavy posts (three seen, three set in behind), its floor 122 up, a boarded gable and a steep roof of shingles past the walls, a ladder of bamboo against it. Open, as the museum's is, with two sawian on its floor; with `walls`, boards that lean out a little toward the eaves (a granary photographed by มะเดื่อ แสลงหลวง, CC BY 3.0). The house is the scale: its floor is at 110 |
| The cluster tung | `tungSaiMu(brush, x, base, size, t, seed, tiers)` | a stick 170 tall, five or seven tiers of small flags of every colour, widest at the bottom, each flag fluttering on its own; planted in a `chediSai` on the sheet |
| The web tung | `tungYai(brush, x, base, size, t, colour)` | the kit's tung pole, and hanging from it five cells of thread woven as a web (spokes from the corners, three diamonds closing on the middle) between six strips of bamboo, a frill and a flower at each strip's ends, a tassel of thread at its foot; it sways, more toward the foot. Red thread unless given (white shows only at night) |
| The red truck | `rotDaeng(brush, x, base, size, turn, facing, inside)` | the Chiang Mai red cars photographed by Patiparn.Nice2002bkk (CC BY-SA 4.0): a pickup's cab, a roof over the bed that runs on over the cab and rises at the front in a peak with a grille, a rack on top, posts and windows over a red panel, a pale line along the side, a step and a rail at the back, a yellow plate. 650 long, 344 to the peak. The wheels turn with `turn` (the ground covered over 46 x size) and the body rides 2 to 3 on its springs as they turn |

**A player: the instrument is worn, the hands reach.** `musician()` seats a person cross-legged
(`floor: "cross"`) and plays on the beat: the salo's bow out on one beat and in on the next while the
fiddle tilts to bring one string or the other to it; the sueng plucked twice a beat; the pi chum
nodding as a finger lifts off a hole; the phin phia pressed to the chest and eased off. Three things
make the hands land on the instrument:

- The instrument is the look's `worn` painter, which the kit calls after the body and the head and
  before the arms, with the pen set back to the scene's own frame (as `sabaiWorn()` does). The arms and
  the hands are drawn over it.
- Each wrist goes to a point on the instrument by `reachA` and `reachB`. The kit works out the wrists
  after it calls `worn`, so the instrument cannot be placed where the hands came to; it is placed where
  they will come to, which works because a reach within the arm's length is touched exactly.
- Where they come to was measured, not guessed: `person()` with `floor: "cross"` at size 1 looking right
  gives its shoulders at (35, -131) near and (-31, -131) far, its chin at (2, -150), its crown at
  (3, -241), and an arm 98 from shoulder to wrist; the numbers scale with `size` and mirror with
  `face`. Every hold in `bandHold()` keeps each wrist within 97 of its shoulder and further than 30 from
  it (nearer than about 26 the forearm would fold past 150 degrees, which `arms_check.py` fails).

The musician also takes a stick and a parasol out of the hands (the `elder` of the cast carries a
stick, which first ran from the piper's hand to the floor), and the phin phia's player has no shirt and
no cloth over the shoulder, as it is played on the bare chest.

**The riders.** `pieces.js` draws on a brush and calls nothing of the people. `rotDaeng()` takes an
`inside` function instead: it paints the inside (the far wall and its bench), gives `inside` the four
seats of the far bench in the caller's own frame, then paints the near side, the posts, the roof and
the wheels over them. People seated there with `floor: "cross"`, `twist: 1` and size 0.66 x the truck's
show their heads and shoulders in the windows; the side hides their legs and the roof clears the
tallest bun. The near bench's people would show their backs, which the kit cannot draw: they are left
out.

**Traps met on the way.**

- A path is not part of what `save()` keeps. The sawian clipped its weave to its outline, restored,
  and stroked "the outline": the pen still held the weave's lines, which were drawn again unclipped,
  a hundred wide each side of every basket. The outline is a function now, made again for the line.
- `inside()` was first called with the truck's own scale and translation still on the pen: the riders
  were drawn far off the sheet. The truck's frame is taken off before it is called and put back after.
- The salo's bow was first laid pointing away from the strings, and its bowing hand's widest stroke
  went 105 from the shoulder, past the arm's reach. A bow held by the far hand points across the
  fiddle; the stroke is 24 wide.
- Riders at 0.72 of the truck first put a bun through the roof.

**The checks.** `kit_check.py band.html khom_kinds.html farmstead.html khom.html pieces.html sabai.html`:
6 pages, 0 failures (band 20.7 ms a frame, khom_kinds 31.7, farmstead 13.2; arms 0, 0, 0 on all six; same
1 / 0 at worst); no top-level name in two script files; no warning. `kit_check.py sash.html --quick`:
draws, same 0 / 0, the 17 lines each inside one scene. The cartoon maker, which loads `khom.js` and
`pieces.js`, loads with every function there and no warning.

**In the maker (owner, same day: "Add them to the palette").** Thirteen buttons: the things 🎻 สะล้อ,
🪕 ซึง, 🎵 ปี่จุม, 🥥 พิณเปี๊ยะ (each a player of the cast sitting cross-legged: the fellow, the farmer,
the elder, the fellow with no shirt; the colours are the player's), 🎠 โคมผัด, ⭐ โคมดาว, 🏵️ โคมบัว
(they hang as the khom does, with its candle switch; the khom phat turns only while lit), 🚶‍♀️ โคมถือ
(a girl who walks her course holding a khom thue up), 🎊 ตุงไส้หมู, 🕸️ ตุงใย (the thread's colour can
be picked) and 🛻 รถแดง (1.1 times the kit's truck, so it stands taller than the people who ride it,
with a girl, a fellow and a grandmother on its far bench); the set pieces 🛖 หลองข้าว and 🧺 เสวียน.
The candle switch belongs to a list now, `CANDLES`, not to the name `khom`. Two things in the page
were mended on the way: `thingCode()` made a thing's code by replacing every capital P with its
place (`p3`), which would have turned `khomPhat` into `khomp3hat`; it replaces only `P[` now, and the
code it writes for every thing that was there before is the same to the character (checked against
the page at HEAD). And the exported page did not load `pieces.js`, which the water jar, the ox cart
and the rest of the pieces of the north need: an exported film with one of them stopped with an
error. It loads `pieces.js` and `band.js` now. Checked in Chrome with the real mouse: each of the
thirteen buttons dragged onto the stage adds its item; the four lanterns show the candle switch; a
film of all thirteen at night taken as a model's JSON draws at three seconds with no error and no
warning; its exported page, put beside the kit, draws with neither: 26 checks, all held.

**Not done.** The pi chum, the khom phat, the star
and lotus lanterns and the two tung are drawn from words, with no photograph: each is to be checked
against one. The players only sit; the salo's tilt and the phin phia's press are small, and the
fingers lift on a beat, not on the notes of a tune; nobody plays the films' songs yet. The khom phat's
figures are seen only on the front half of the paper (the back half's shadows would show through
faintly); it cannot be raised and lowered on its pulley (khom lo). The truck has no curtains and no
one on its back step; its riders sit only on the far bench. The granary's walls are plain boards.

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

## The band and an old couple at the night of dancing (2026-10-16)

The owner: "Add the band members to the night scene", then "Add an old couple to the end scene too". Both
are in `sceneDance()` of `sash.html`, at the right of the picture, clear of the words under it (which end
at about x 1410) and of the khom phat and the children at the left.

- **The band** (`band.js`): four players sitting cross-legged at y 1005, a step nearer than the dancers,
  size 1.0, facing left toward them, each on the beat: the elder on the pi chum (x 1420), a fellow on the
  salo (1570), the farmer on the sueng (1715), a fellow with no shirt on the phin phia (1850). In that
  order each instrument reaches into room of its own: the salo's bow lies across the piper's empty lap,
  the sueng's neck goes behind the next player. (In a first order, the salo's bow cut across the phin
  phia's player, whose instrument could not be read.) It adds about a fifth to the time a frame of the
  dance takes to draw.
- **The old couple**: the cast's grandmother (x 1715, y 950, size 1.0) and elder (1575, 955, 1.1), a step
  behind the band, so the players in front hide only their legs; side by side, turned to us
  (`twist: 1`), their eyes on the dancer, holding hands: one point given to both as `reachA`, swinging
  4 px. The elder leaves his stick (`holding: null`), whose hand it would take. Between the dancers and
  the band, where they were first put, the elder hid half the celestial. **The hands, measured:** at
  hanging height (y 795) the point was 117 to 121 from his shoulder and his arm is 108 long at size
  1.1, so his wrist stopped 5 to 18 px short of hers; at y 772, and with no hop (`spring: 0`: the hop's
  stretch would take his hand from hers), the widest gap between their wrists over every frame of the
  scene is 3.4 px.

## The spinning lantern (2026-10-16)

The owner asked first for a scene of its own: "make a scene like the opening scene but with the
spinning lantern. Start out with a close up on a figure of light the same shape as one of the women
as if it were being cast by the lantern. Then it should start to move as if the lantern were starting
to spin and new shapes of light should appear. Then pull out to reveal it is a lantern and there are
children and people celebrating." It was made (14 s before the dance, the film 93 s), and on seeing
it the owner asked: "Take the spinning lantern and add it to the final scene and remove the scene
with the close up of the lantern. Just add one and a few children looking at it so they are on the
left side of the screen", and "Opposite the band". So `sash.html` is 79 s again, and the khom phat
hangs at the left of the night of dancing; what the scene made for it stays in the kit.

| What it is | In the code | Numbers |
|---|---|---|
| Figures of light | `khomPhat`'s `light: true` (`khom.js`): the frame inside is a dark drum with the figures cut out of it, so the paper is dim and each figure glows. Each figure is drawn whole on `KHOM_LAYER` (a canvas the size of the sheet, on the CPU, as `WAI_LAYER` is), coloured with `source-in` in the candle's colour, then drawn onto the paper, faded at the side of the drum, with a glow (`shadowBlur` in step with the figure's size on the sheet). Only the paper's box on the sheet is cleared, coloured and copied | paper `#4a3524` to `#8a5c34` with the flicker; light `#ffe6a8` to `#fff8e4`; glow 6 × the sheet's scale |
| The film's own figures | `khomPhat`'s `figures`: a list of functions, each drawing one figure standing on (0, 0) and facing right; the black-paper cut-outs of `KHOM_CUTOUTS` unless a film gives its own. The film's `PHAT_FIGURES`: the woman of the cloth (`WOMAN`), an elephant, a child and a dancer, a quarter turn apart, scaled by `PHAT_FIGURE`, walking as the frame turns (`phatWalk`, set before the lantern is drawn) | 0.22 of their size; the frame turns 0.45 a second, khomPhat's own spin |
| No shadow on the ground | the look key `ground: false`, read by `person()` (both its shadows on the ground) and by `elephant()` (`BEAST_KEYS`); `looks.html` has a figure for it. A cut-out is only its shape: the soft shadow, a fifth as dark as ink, came out as a faint oval of light under each figure | 85 look keys |
| A frame the film turns | `khomPhat`'s `turn`: the frame's angle, set by the film, for one that starts still and gathers speed. The scene that was removed used it; the dance does not | |
| At the night of dancing | `spinningLantern()`, called in `sceneDance` before the great drum: the khom phat lit, its figures of light, on an arm from the lantern string's left pole (x 60), opposite the band; three children behind the drum, a girl, a boy and a girl in yellow, their eyes on it in wonder (`at`, `wonder`), the girls reaching up to it (`reachA`), the boy pointing (`fingersA` [0, 1, 1, 1, 0.8]), drawn last so his hand shows | tied at (145, 360), size 1.1; the children at x 55, 140 and 235 |
| Their arms come down | (owner, 2026-10-17: "In the end scene have the kids put their arms down after a few seconds") `spinningLantern(t)` takes the scene's second: from 3 s to 4 s each arm comes down from the lantern to beside the hip, and the boy's pointing finger loosens to the kit's `REST`. Sent straight from up to down (`reachA` mixed), a hand passed over the boy's chin and the mouth of the girl in yellow, and came within a third of an arm of its own shoulder, where the elbow has no side to bend to: one flip at 73.63 s. A sideways bow on that path still flipped. So each girl's hand turns round her shoulder (`child()`: by her right, the girl at the left; by her left, the girl in yellow), the distance dipping to 60 on the sheet, and goes behind the boy, who is drawn last. Swung so, his hand went over the mouth of the girl in yellow, who stands within an arm of him; his wrist goes by a course instead (`BOY_DOWN`, through motion.js's `where()`): up through the gap beside his face, out under her chin at his shoulder's height, and down | no flips (arms_check, 72 to 76 s); in the film's pixels, a hand is never nearer its own face's middle than 90 (the boy's, at 3.1 s, where his pointing pose already held it), nor nearer than 111 to its shoulder; the boy's hand never nearer her face than 123 (74 when swung) |
| Their heads further back | (owner, 2026-10-17: "tilt the girls heads back just a bit so they are looking at the lantern above them more clearly") the girls take `girlGaze`, the children's `gaze` with `tilt: -0.24`; the boy keeps `-0.12`. `tilt` is a roll about the head's middle, so on their three-quarter faces it lifts each face toward the lantern, which hangs between them, more than it nods the head back | `tilt` −0.12 → −0.24 rad (about 7° → 14°) |
| Tried for the children | the kit's `child` (as tall as the drummer); the two girls turned to profile toward the lantern (`turn: -0.8`; their faces met over the boy's); a head tilted back (`tilt`: a roll about the head's middle, which a three-quarter face hardly shows). Eyes alone (`at`) move at most 4 pixels; raised arms are what reads at this size, and a child's arm reaches its forehead | |
| Tried for the scene that was removed | six figures, a sixth of a turn apart (three showed at once in the close-up); the figures faded with `globalAlpha` on one shared layer (a figure drawn at a part of its strength shows its own overlaps, and its insides showed through as a ghost); the layer on the GPU (it changed how the sheet drew every later frame, as `WAI_LAYER` had) | |
| Words | the scene's two lines in Kam Mueang went with it: "ฮ้อนเทียน ยะหื้อรูปภาพหมุนวนๆ เจ้า" (the candle's heat turns it, and the pictures go round and round) and "นี่คือโคมพัด โคมหมุนงานยี่เป็งเจ้า" (this is a khom phat, a spinning lantern for Yi Peng), from the notebooks "Lanna material culture" and the Kam Mueang one; their voice stays in `spoken_km/` for a film that wants them. The dance keeps its two lines | |

## The fingernail dance, read from a performance (2026-10-16)

The owner gave a video of fon lep (ฟ้อนเล็บ), some hundreds of dancers at the Three Kings Monument,
Chiang Mai, in 2015 (YouTube WGAjuI6bNhw, 55Secrets Travel): "Look at that video and see if you can
animate some finger dancers to move like that." `finger_dance.js` is the answer: the dance's poses as
numbers, the order they come in, and `fingerDancer(x, y, dress, more, late)`, the kit's own dancer
(`dance: true`, `nails: "long"`) dancing them; `finger_dance.html` is a troupe of fifteen dancing it.
The video is not in the repository, and nothing of it is copied.

**The machine could not read it.** `dance_track.py` read the classical dancer of `dance.html`; here
MediaPipe read the arms wrong, whatever was tried, on the steady shot from 18.9 to 51.9 s (a front row
in full figure, before the close-ups):

| Tried | What came back |
|---|---|
| `dance_track.py` (the full pose model), the frame with its left edge cut off | a dancer in 99% of the frames, but her wrists almost straight under her shoulders: the median of each wrist across from its shoulder 9 and -1 (kit units; arms held out as the video shows them would be 50 to 70), a hand at the shoulder at 3.2 s, a bow of 0.5 at 26 s. Its own check frames drew the arms down the body |
| the full model on one dancer, cut out and scaled up twice | the arms again inside the body, the shoulders far too narrow |
| the heavy model on that same cut | the arms right: out and down along the sleeves, a little short of the wrists |
| the heavy model following one dancer with a moving cut, 30 to 51.5 s | three seconds true (checked by eye: the wrists some 108 below the shoulders, 17 to 30 across, the body square to us, `turn` 0.92); then the camera zooms (about 33 s), the cut no longer fits her, and it slides onto the dancers of the second row, half hidden, whose arms it reads wrong |
| the heavy model on the whole frame, eight people asked for | two found; hers with one wrist above its shoulder where it is plainly below |

The silk sashes over white sleeves, the arms held out stiff, and rows behind in the same colours are
what defeat it. So the poses are read by eye from the video's frames, a half second apart through the
walk and every two and a half seconds through the close-ups (1:00 to 2:30), and set against a sheet of
the kit's dancer in each until they matched; the three true seconds are the check on the walk.

**The poses** (`FINGER_POSES`, the kit's look keys; arm A is on the picture's right):

| Pose | In the video | Numbers |
|---|---|---|
| `low` | the walk (0:19 to 0:33): arms low and out to the sides, the wrists bent back so the nails fan outward | hands (±62, 100); the wrists bent 0.9 each the other way (A -0.9, B +0.9: the same sign on both curled the left hand down); `twist` 0.8 |
| `highA`, `highB` | one arm curved up above the head, the wrist bent back, the other out at the shoulder with the hand up; the head toward the low hand (1:02 to 1:10, 1:27) | the high hand (±22, -106), the low (∓100, -14); `tilt` ∓0.15; `twist` 0.6 |
| `offer` | both arms forward at the chest, the hands up from the bent wrists, the body turned toward them (1:15 to 1:22) | (100, -22) and (80, 4); `twist` -0.3, the body nearly in profile. Both hands before the chest at `twist` 0.1 bunched there and read as nothing |
| `wings` | both arms spread wide at the shoulders, the hands up and back (1:35 to 1:42) | (±104, -16) |
| `sweep` | not a pose of its own: the way from the offering to the wings, the far arm down and round past the hip | (102, -18) and (-36, 72), a second after the offering |
| `peak` | both hands over the head, the nails meeting above it (2:15 to 2:27) | (∓8, -116), the arms straight up beside the face. The wrists crossing over the head's middle ((∓30, -110) or (∓22, -114)) brought the arms up across her face: the kit picks which way an elbow bends, and the video's elbows open out to the sides |

The kit's dancer gives every lifted hand the shape of Thai dance, the back of the hand toward us and
the long nails curving back, so the poses only place the wrists.

**The phrase** (`FINGER_DANCE`, for `poseAt(t, FINGER_DANCE, 0.35)`): the walk, the hands raised in
turn twice, the offering, the wings, the peak, a hand raised each side, and the walk again: a pose
every two seconds, each held a third of that and then moving to the next, 32 seconds round and round.
The first phrase went straight from the offering to the wings, and the whole check failed it with 11
arm flips: the far arm crossed from before the body to its own side, its wrist passed through its
shoulder (at (-10, -31) from it, at 15.33 s), where an arm has no clean bend, and every dancer's elbow
jumped across in one frame, 69 units. With `sweep` between them the arm goes down and round, and no
elbow of a dancer moves more than 22 units in a frame over the whole phrase (measured on one dancer,
every frame).
Under it the dance is a procession: a step a second (`step` = seconds / 2, `stride` 0.45), a dip at
each step (`sit` up 0.07 as `sin²` of the step), the chest swaying 0.035 with it, whatever the arms do.

**The dresses** (`FINGER_DRESSES`): `blue` a white blouse and a pale blue sabai, `pink` a navy blouse
and a pink one, `cream` a red blouse and a cream one, each with a pha sin and yellow flowers at the
bun, as in the video. The kit has three sins: indigo (`pink`), brick red (`cream`), and green and black
(`blue`, whose sin in the video is yellow and striped).

**The troupe** (`finger_dance.html`, 1920 wide, on the `yipeng` backdrop): three rows, a dress to a
row as the dancers there stood in blocks: six in cream at the back (size 0.82, y 865), five in pink
(0.95, 930), four in blue in front (1.1, 1005), set wide enough apart that the wings of one do not
cross the next (the first spacing, five in front at 1.2, tangled them), each a few hundredths of a
second from her neighbour (`late` -0.05 a row, -0.025 a place). It renders in 952 s for its 32 s on
the laptop: fifteen people at 1920.

**Not done.** The yellow striped sin of the video's front rows is not one of the kit's. The peak's
elbows do not open out round the head. The dancers walk in place; the video's advance, turn about, and
go round in lines. The fingers are not moved: the hand model found hands in too few frames of the
steady shot to read them, and the kit's dance hand stands for them.

## The hands of classical dance (2026-10-16)

The owner sent three pictures, the Thai wong and jeeb (an arm in four positions; a wong over a jeeb)
and the chart "The Meaning of Hands' Gestures in Khmer Dance" (CPA 2010), with "focus on these hand
positions", and chose: every dancer in the kit, and the Khmer gestures too. Nothing of the pictures
is copied; the forms are read from them as rules, and drawn by the kit's own hand in the round.

| What it is | In the code | Numbers |
|---|---|---|
| A finger bent back on its own | `hand()`'s `arch` may be four numbers, one a finger, the first to the little one (one number, as before, bends all four) | |
| The pinch | `hand()`'s `pinch` [finger, amount]: `pinchThumb()` brings the thumb's tip to the pad under the first finger's tip (0) or the middle one's (1): its two bones bend out at their joint, toward the thumb's side and the back of the hand, and its root comes forward, as a thumb's does to meet a finger. Without that a curled finger's tip, well in front of the palm, was out of the thumb's reach, and the thumb stood out straight beside it | the root 2 forward, 5 toward the palm at a full pinch; the thumb 13 + 9.1 long |
| Four forms | `HAND_FORMS`: **wong**, the four fingers together, straight, bent far back, the thumb in; **jeeb**, the first finger curled to meet the thumb, the other three fanned and bent back, the little one most; **fan**, all spread and bent back (the kit's dance hand before); **point**, the first finger out, the thumb to the middle one, the rest curled | wong `arch` 1, spread 0.03; jeeb index curl 0.85, `arch` [0, 0.8, 0.9, 1], spread 0.35 |
| Thirteen names | `GESTURES`: wong, jeeb, jeebDown, fan, point, and the chart's planting (the pointing hand turned down), growing (turned up), youngLeaves (the fan), leaves (the wong), flowering and ripeFruit (the jeeb turned up), fruit (the jeeb, its palm toward us), fallingFruit (the jeeb turned down). Each: a form, the wrist's bend back (above 0) or down, and the hand's turn: the thumb's edge (0.45), the side the forms read from, as in the pictures | wrist from -1 to 0.6 radians |
| A look asks for them | the look keys `gestureA` and `gestureB`: a name, or {from, to, u} for a hand on its way between two (`gestureOf()` mixes the curls, the spread, each finger's bend, the pinch, the wrist and the turn) | 87 look keys |
| Every dancer | `handPose()`: a lifted hand of a figure with `dance` that nothing else shapes (no fingers, grip, wai, or the near hand on a parasol) takes `danceHand()`: one hand in wong, the other in jeeb, changing over every eight seconds, each going from one to the other in the first 1.2 s (0.6 s at first: too quick beside the owner's reference). The two hands mirror each other, each bending back away from the head (the wrist's bend and the turn signed by the thumb's side: with one sign for both, one hand bent out and the other curled in over the head) | |
| Where it shows | the hero film's night dancer and the celestial (who now holds her lotus in a jeeb), the dancers woven into the opening's cloth, `dance.html`, `finger_dance.html`, `fonlep.html`, `apsara.html`, `lanna.html`, `village.html`, and any lady of the cast (whose look has `dance`) who lifts a hand | `finger_dance.html` 219 to 225 ms a frame, as before (196 to 248) |
| The sheet | `dance_hands.html`: the four forms large and a dancer changing over (0–5 s), then every name on a lady with both hands raised (5–10 s); `looks.html` shows `gestureA` and `gestureB` | |
| Turned down | the gestures turned down (jeebDown, planting, fallingFruit) do not bend the wrist toward the palm: a lowered hand's back faces in, so that turned one hand's fingers up; their hands point to the ground, a little out (0.35 from straight down), taking the shorter way round from where the arm puts them | |
| Bangles stay on the arm | `drawHand()` turns `bangles()` by the forearm's angle, from the elbow to the wrist, not by the hand's: with a wrist bent back or down the rings swung out with the hand (owner, 2026-10-16: "the gold bangles on her wrists should stay pinned to the arm"). Every figure wears one or two rings unless told, so every wrist moves a little | |
| Held steady | a hand in a form of dance has no bend of the wrist on the beat (`handPose()` takes `flex` back off its angle) and no little life in its fingers (`hand()`'s `pose.still`, which `roundPose()` sets for a form): with them the held hands shook (owner, 2026-10-16: "stop the hands from shaking") | in a held pose of a solo dancer, the hands' change from frame to frame 12.9 to 2.8 grey levels, its jerky part (the change of the change) 23.1 to 2.75 |
| The pace | the owner's reference, an 8 s short of a Lanna dancer at night in Chiang Mai (YouTube A9_m6vP4tZ0, read by eye at four frames a second; nothing of it is copied or kept): the hands keep their form through every move, the wrists bent back; an arm takes about 1 to 1.5 s to go from one place to the next, eased at both ends; between moves the arms are never quite still and the knees dip slowly; she ends in a wai held 2.5 s. A film moves its dancers' arms at that pace; the kit's own part is the steady hand and the slow change-over | |

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
| Pecking | `peck`: the body tips forward from the hips and the neck reaches down until the beak is at the ground, the tail lifting with the tip. `roosterForage(t, seed)` gives a forager's pecks: the head low, looking; a peck or a few quick ones (down in a tenth of a second, up in a fifth); now and then the head up a while | tip 0.35, the head to (34, −40) and turned down 1.0; a peck in 0.3 s, half the time; the head up in a third of two-second spells |
| A fright and a crouch | `alarm`: the head up 14 and back 5, the body upright, the comb shaking, the eye wide with the white all round it, no blink, the tail up; `sink`: the body down on bent legs and the head drawn in, before a spring and on landing | |
| Facing, and a hen | `face` −1 faces left. `hen: true` draws a brown village hen (`HEN_COAT`): 0.85 of the rooster's size, three short upright tail feathers, a small comb and wattle; a hen never crows | `#c98b4e` |
| The whole flight | `roosterBolt(s, plan)`, s seconds after the fright (`BOLT` holds the times): it starts up (alarm in 0.06 s) with a jump of 10 where it stands, crouches, runs a few steps faster and faster with its wings coming out, hops with its wings beating and leaning back, crouches as it lands, and scurries off with its wings out, faster than it ran. The legs hold the stride they left the ground in through the hop, so the steps go on unbroken. `plan.peck` is where its head was when the fright came, so it comes up from there; `hop: false` runs straight off; `hen`, `face`. It gives back where it is from where it stood, and the look | run from 0.35 s, to 380 a second; hop 1.1 to 1.85 s, 130 high, 340 a second; then to 520 a second; a hen without the hop to 520 in 0.4 s |
| A feather | `feather()` draws one, a vane and a quill; `fallingFeather(x, y, ground, age, seed, colour, drift)` lets one fall as a feather does: slowly, swinging from side to side, quickest through the middle of a swing and tipping up and rising a little at its ends; it carries on `drift` the way it was going, lands, lies flat a moment and fades. Its fall is worked out from the age alone, so a still shows what the film does | 22 long; a swing in 1.1 to 1.4 s, 20 to 32 wide; falls 50 to 65 a second; fades from 0.6 s to 1.6 s after landing |
| The sheet | `chickens.html`: each behaviour on its own above, the run, hop, scurry and a hen running in place in the middle, and the whole of `roosterBolt()` below, with its feather and a hen that only runs | |
| In the lane | `sash.html`'s `COOP`, `chicken()` and `looseFeather()`: the rooster crows, then pecks about (from 3 s); the hen, a little to its right and a step farther back, pecks all along. At `FRIGHT` the rooster bolts, a feather coming loose at the top of its hop; the hen takes fright 0.08 s after it and runs straight off. The dog (`chase()`), from the second the rooster starts to run, eases in half a second from its trot to more than twice that, its legs quicker with it, and follows them out. The rooster stood at 1060, under the words; it stands at 1300 now, so the fright shows | the fright at 6.2 s of the scene (the dog's nose 250 from the rooster's tail); the hen at 1490; the dog 195 to 420 a second |
| Tried | the hen 140 to the rooster's right and 0.25 s later: the running rooster caught up with her tail; folded-size wings beating, which read as two small fins | |

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

## Nine feelings (2026-10-18)

The owner: "Work on adding emotions for each of the sprites. Sad, happy, concerned, angry, sleepy,
satiated, neutral, surprised." Asked how, they chose people first (one face drawing serves the whole
cast, the band's players and the paperdolls) and the creatures after they have looked; the face and how
the body is carried, the hands left to the film; and a picker in the cartoon maker. The sheet is
`feelings.html`: each face close up with all of them, then a lady and a fellow whole. Then, the same
morning: "Add a laugh for each of the sprites, too": laughing is the ninth.

| Name | The numbers | What shows |
|---|---|---|
| neutral | none | the face at rest (a fellow's shut mouth still turns up a little: it is drawn so) |
| happy | smile 1, wonder 0.25; head up 0.04 | the kit's first `joy`, unchanged |
| laughing | laugh 1, smile 1; lean back 0.04, head up 0.08 | the eyes shut and bowed up (`eye()`'s `bowed`: a laugh pushes the cheeks up under them); the mouth open wide, 0.9 wide, and opening again on each "ha", 4.5 a second (a lady's is a D, its top nearly flat and lifted at the corners, its bottom deep; a fellow's was a D already); the head (0.05) and the shoulders (0.03) shake with it; in bursts of 2 s with a breath of 0.6 s, the "ha" at a third; the brows up 3; the cheeks pinker (+0.15, a fellow's +0.12) |
| sad | sad 1; lean 0.05, head down 0.12 | as before, and the lids come down at the outer corners (slant -0.7) |
| concerned | worry 1; lean 0.03, head down 0.06 | the brows up at their inner ends (0.38 to 0.4 rad) and 3 in toward the nose, with a fold between them; the lids 10% wider and down at the outer corners (slant -0.45, a fellow's -0.6); a lady's mouth pressed to 0.82 of its width and 0.75 of its height; a fellow's line wavers, up and then down by 4.5 |
| angry | anger 1; lean 0.1 forward | as before, with a straight lid down over the inner half of each eye (slant 0.9) and the fold between the brows |
| sleepy | sleepy 1; lean 0.04, head down 0.08 | the lids 0.55 shut and the brows up 2.5 against them; every 7 s the head sinks for 4 s (0.22 more) as the eyes close, and comes up in a quarter of a second with the eyes wide; every 11 s a yawn of 2.4 s: the mouth open tall and round, the eyes shut, the brows up 7.5, the head back 0.16. A yawn stops a nod |
| satiated | full 1, smile 0.8; lean back 0.07, head up 0.06 | the lids 0.62 shut over an easy smile, the cheeks pinker (blush 0.2 + 0.22 on a lady, 0.42 + 0.2 on a fellow); every 6 s the eyes close for 1.5 s and the head tips back 0.04 more |
| surprised | wonder 1, the mouth round 0.7; lean back 0.05 | the kit's first `surprise`, unchanged |

- **The first names still work.** `calm`, `joy`, `surprise` and `anger` are neutral, happy, surprised and
  angry (`FEELING_WAS`) with the same numbers; `fear` stays, a tenth.
- **The slanted lid** (`slant` in `eye()`, from -1 to 1; `slantedLid()` gives the part of the eye left open
  under it). Since 2026-10-14 the kit's men wear a head-cloth over the brows, and on the first sheet a
  fellow's angry and concerned faces had nothing to show them. A straight lid across the eye, low at the
  inner corner for anger and at the outer corner for sadness and worry, reads on any face, and is ready
  for the creatures' eyes. The eye is cut under it, and its line is inked twice as wide inside the eye,
  so the half that shows has the lid's weight. The fold of the lid above fades with the slant.
- **A time of their own.** The nod, the yawn and the savouring run on the clock plus `ownTime(who)`, a
  number from the person's `id`, or else from their place in the frame's drawing order, as `follow()`
  keys its springs: a crowd of sleepers do not nod as one. All of it is a function of the clock, so a
  still matches the film.
- **What changes on the pages.** With no feeling given, every number new here is 0, and a page draws as
  before. A face given anger or sadness now has the slanted lid, and anger the fold: `model.html`'s angry
  fellow, the anger and sad rows of `looks.html`. New look names: `sleepy`, `full`, `worry`, `laugh` (94 in all).
- **The rouge stays on the face.** The owner, on the sheet: "clean up the rouge that is outside the
  woman's face". A lady's two washes of pink are clipped to the face's outline (`V.skin`: the skull, and
  the profile piece toward profile). The far cheek's lies by the edge and spilled past it, the more so
  with a full face's stronger pink. Every lady's face changes so, on every page.
- **The maker.** `item.feel`, one of `FEELS`: a row of eight buttons (😐 เฉย ๆ, 😊 ดีใจ, 😢 เศร้า,
  😟 กังวล, 😠 โกรธ, 😪 ง่วง, 😌 อิ่ม, 😮 ประหลาดใจ) where the smile slider was. The owner then: "Add
  the emotions to the cartoon maker and the kids walk through ... set the emotion from a drop down in
  the resizer and then again at each point of movement". So a person's feeling is also a dropdown in
  the bar over a sprite just put in (`#barFeel`), and a point of a person's course may change it from
  there on: a key's sixth entry, `[second, x, y, pose or null, size or null, feeling]` (`feelsOf()`,
  `setKeyFeel()`; the film's code is then `feel: [...][p[7]]`, the feeling of the key reached). Each
  point's row has the dropdown on a second line beside the pose (a feeling of its own, or "〰 the
  same"), and so has the box that opens when a point is placed by a drag (at the first point it is the
  person's own feeling). In the 🧒 guide, each person's turn asks how they feel after where they start
  (a tap shows it on the picture), and, if they walk, how they feel when they get there. A dropdown
  holding the keys no longer lets Delete remove the sprite or the arrows nudge it. The film's JSON has
  `"feel"` and the keys' sixth entries, and the model's prompt lists the eight. A film kept with a smile loads as happy (a smile of 0.5
  or more) or neutral, and the kit's first names are read too (`feelOf()`). `film.py stills` and `render`
  draw with the kit on krueng.ai, so they show the feelings once the site has this kit.
- **Tried first.** Concerned as sad 0.7 and fear 0.5 together: on the lady, at film size, it read as
  neutral. The first sheet had all eight across and four people down at size 1.5: the faces were too
  small to judge.
- **Not done.** The creatures (the next round). Hands for a feeling (the owner chose the face and the
  posture). `paperdoll.js` reads a feeling's lean without the person's own time, so a sleepy doll's skirt
  follows the nod on the clock alone.

## The pond's feelings, and the assistant's voice (2026-10-18)

The owner: "redo the hero video for lanna_cartoon? In the pond scene the man should look surprised when
the dragon appears and then angry when it shows a Chinese flag for a moment and then go back to being
happy. The woman should laugh when the flag comes out and put her hands in her lap. Also, use the new
assistant voice." Asked which voice, they chose the Kam Mueang assistant's: the same MMS model, as the
assistant speaks it, with the assistant's spelling rules.

| What | How |
|---|---|
| The fellow | `feel` by the scene's seconds (`POND_SEEN`, `POND_FLAG`, `POND_CALM` in `sash.html`): happy, then surprised from 7.4 (the dragon's head comes into the picture at 7.2, by `DRAGON_COURSE`), angry from `FLAG[0] + 0.2` (the flag out of the claw), happy again from `FLAG[1] + 0.3`; his eyes on the dragon from the first to the last |
| The woman | her wonder at the dragon as before, then laughing from `FLAG[0] + 0.2` to `FLAG[1] + 0.6`, and happy after; from the flag on her hands lie in her lap, in place of the wai: the kit's own hands for one who sits (no handA or handB given), turned in toward each other. At first they were placed (`POND_LAP`: handA [-20, 100], handB [60, 96]), which crossed the arms and laid the far arm over the cloth; the owner, the same day: "the woman crosses her arms but she should look like she is sitting naturally and her left arm should be below the sash". The far arm (A, the one toward where she faces) is her left, the sabai's shoulder: with its hand on its own side (`handA[0] > -10`) it goes behind the chest and the cloth (behindA) and only its hand shows. Picked from four drawn side by side |
| The voice | `sash_narrate.py --voice assistant`: MMS Northern Thai in PyTorch (transformers' `VitsModel`, `facebook/mms-tts-nod`, its own settings) as the assistant's `speak()` runs it, a line in pieces of up to 150 letters with a quarter of a second between them. The assistant also put one after the last piece; in the film that made each line 0.25 s longer for nothing, so the film's lines have none (the takes already made were trimmed of it) |
| The words | the assistant's spelling rules (its speaker's corrections, kept with the assistant, not here) changed five lines, said and written: บ้าน → เฮือน (23.0 s), บ่ → บะ (28.3 and 44.7 s), และ → ละก่อ (31.0 and 37.4 s). Still unchecked by a native speaker |
| The takes | four of each line, the clearest kept (heard back 0.62 to 0.96 of their letters). With the new voice four lines ran past their words or into the next line (by up to 0.23 s), and the pond scene leaves no room to move them (its last line must end before the cut at 50 s); `--fit` keeps the clearest take that ends in its room, and speaks as many takes again when none does: all 18 lines fit (line 9 needed eight takes) |

## Feelings on the creatures (2026-10-18)

The owner: "start the creatures", after the people's nine feelings. The first round is the six a child
can put in the cartoon maker: the dog, the rooster, the Naga, the dragon (both kinds), the Mom and the
Luang. Each takes `feel` (and the same numbers) in its look, as a person does; with none, it draws as it
did before. The sheet is `creatures.html`: each creature a part, its nine feelings close up, the big ones
placed by where their own drawing puts the eye. The second round ("begin") is the rest of the kit's
creatures with a face: the beasts, the birds of the north, the Hatsadiling and the sun's 1930s face.
The sheet now has 19 parts, 12 seconds each (228 s).

| The kit's part | What it does |
|---|---|
| `creatureFeel(look, at)` | the person's numbers (`feelingOf()`, over time at the creature's own time) as what any face and body can show: `lid`, `bowed`, `slant`, `wide`, `brow` [lift, turn], `open`, `grin`, `raise` (the head high or low), `ears`, `wag`, `tail`, `shake` (each "ha"), `nod`, `startle`, and `jaw(usual)`: a jaw shut for sadness, worry, fullness and sleep, a snarl in anger, the feeling's own opening for a laugh, a yawn or a fright, and as it was otherwise |
| `creatureEye(x, y, rx, ry, e, how)` | a creature's eye looking along +x: the white, an iris toward the front (and a pupil), or a 1930s pie eye; a lid in the colour of the skin, down by `lid`, low at the front in anger and at the back in sadness; shut, a line bowed down, and laughing, bowed up. `how.ball`: an eye that is all one colour (a bird's, a cat's, a pig's), with a round pupil, or with `how.slit` a cat's slit, and a light |

| Creature | Where the feeling shows |
|---|---|
| dog | `dog(x, y, t, how)`, `how.feel`: the pie eye under its lid, a brow, the smile turned to a frown or opened (a tongue in a laugh), the head carried high or low and nodding, the ear up or back, the tail wagging harder or drooping, a laugh's bounce |
| rooster | surprise is its own fright (`alarm`), sleep and fullness its crouch (`sink`); its head sinks when sad, its tail rises or drops, its beak gapes on each "ha" or in a yawn; a brow over the dot of its eye; a lid when it is sleepy, full or laughing; only a happy, a neutral or an angry rooster crows |
| Naga | each head: its eye and its brow, its jaw, and how high it is held (one head a moment after another) |
| dragon, both kinds | the eye (its yellow iris and dark middle), the bushy brow lock raised or turned (its root down in anger), the jaw, the head lifted or hung |
| Mom | the great eye, its lid the gold of its ring; the heavy gold brow; the jaw; the head |
| Luang | the eye under its gold brow, the brow, the jaw, the head |
| elephant, side and front (`beasts.js`) | `elephantEye(ink, shut, e, skin)`: the eye under a lid of its hide, the fold of the brow raised or turned with the brow, the folds under the eye; the trunk raised in wonder and gladness (unless the look sets `trunk`), and the mouth open under it; the head lifted or hung; the ears flare in anger, lie close in sadness and flap faster with a wag; the tail swings harder |
| water buffalo, side and front | the eye (both eyes, each looking toward the middle, from the front); the ear down when it is sad, up in wonder; the head's nod; the tail swings faster and wider with a wag |
| Siamese cat, tiger | `felineHead(kind, open, c, m, seed, e)`: the almond eye in its own colour under a lid of the face's colour (the cat's pupil a slit, the tiger's round); the ears laid back in anger, fear and sadness or pricked; the tiger's heavy brow raised or turned; the corner of the mouth up in a smile, down in a frown; the jaw; the head; the tail up when glad, down when sad, lashing in anger |
| pig | the small dark eye under its lid, and a brow over it raised or turned (its front end down in anger, up in worry); the corner of the mouth up in a smile, down in a frown; the ears flop down when it is sad; the tail wags harder; the head and the jaw; the cheek pinker when it is full or laughing. The owner: "Make sure to include the pig". Its first round had no brow and no corner, and happy and concerned looked neutral. The brow sits close over the eye (12 units above its middle): 21 units up it lay on the edge of the forehead and could not be seen |
| peafowl, pheasant (`northbirds.js`) | the eye (`nbEye()`: the dot it always was, or with a feeling a small eye under a lid of the head's colour); the head and neck carried high or low; the peafowl's bill opens in a laugh, a yawn or a fright |
| sunbird, magpie, hornbill | the eye only. A bird's eye is a few pixels at a film's size: on these three a feeling shows on the sheet, close up, and hardly in a film |
| Hatsadiling (`myth.js`) | the elephant's eye and brow; its trunk raised in wonder and gladness; its head lifted or hung, shaking a little in a laugh |
| the creature with four ears and five eyes (`myth.js`) | all five eyes under lids of its fur (the middle one takes the mean of the two corners), wide or shut and bowed up; the four ears laid back low and flat; the grin narrowed and its corners dropped, or the jaw dropped; the head lifted or hung; the tail wags |
| sun, `sun(x, y, t, how)` with `STYLE.sun = "face"` | `how.feel`: its pie eyes, each looking toward the middle, under lids of its gold; a brow over each; the smile turned (as wide as it is glad) or a frown, or opened in a laugh, a yawn or a fright. The flame sun (`"flames"`, the kit's own) has no face and takes no feeling |

- **The maker.** Its six creatures have the feeling buttons in their panel, the dropdown in the bar over a
  new one, a feeling at any point of a course (a key's sixth entry; the dragon's depth stays its fourth),
  and the box that opens at a new point. The model's prompt says which things take `"feel"`. In the
  second round the ox cart joined them: the feeling is its buffalo's.
- **A name used twice.** The peafowl already had an `e`: how far its train is raised, eased
  (`d * d * (3 - 2 * d)`). A second `var e` for its feeling took that number, so with the train up its bill
  was drawn at `NaN` and did not show (a canvas skips a point that is not a number), and nothing said
  so. The HEAD-against-new pixel comparison found it: 97 pixels in 3 frames of 6 on `northbirds.html`.
  The peafowl's feeling is `mood`.
- **Not done.** The yak (a painted set piece with no face to move); bubbles over creatures. In the
  maker: the beasts and the birds are not in its palette (the ox cart's buffalo is the one beast there),
  the Hatsadiling is kept out of it, and its sun is the flame sun, so none of them has the picker.

## Speech and thought bubbles (2026-10-18)

The owner: "Add a way in the maker to add text that the character will see in a speech or thought
bubble and a way to add subtitles as well. Make sure the kids walk through includes help with this
too." The kit had title cards and subtitles, and nothing over a head. `bubble(at, words, how)` is drawn
in the scene after everyone, so the camera and the lens take it as they take the people. The sheet is
`bubbles.html`.

| What | The rule | In the code |
|---|---|---|
| A speech bubble | a box of paper (#fffaf0) with round corners (34, or half its height), the kit's ink round it; a tail from its foot, over the head, curving down to a point a third of a head over the crown | `body.roundRect`, `tail` |
| A thought bubble | the same box with puffs all round it (one every 1.5 puffs of its edge, every other one 0.8 the size), and three puffs (13, 9, 6) from its foot down to the head; it stands 20 higher | `think`, `many` |
| One outline | every shape inked twice as wide (2.6 lines), then all of them filled: only the outer half of the ink shows, so the tail and the puffs join the box with no line between | `parts` |
| The words | Thai bold 40 (Leelawadee UI, Noto Sans Thai), English italic 26 under it; lines no wider than 420, broken between words: Thai has no spaces, so the browser's word segmenter (`Intl.Segmenter("th")`) finds them | `bubbleLines()` |
| Where | leaning the way the person faces, its foot 50 over the tip; inside what the camera shows (the canvas's corners taken back through the pen's transform), 16 from its edge | `view0`, `view1` |
| It does not hop | the box keeps over where the person stands (`joints.stand`) and at the height of their head with the hop taken out (`joints.rest`: in the figure's own frame, the hips' dip and the head sunk into the shoulders taken off, and none of the lift or the squash); only the tail follows the head. Over a beat of a hopping lady the crown moves 116 pixels and the rest point 1 | `joints.rest` in `person()` |
| It pops in | over a fifth of a second, from 0.55 of its size, a little past, from the head | `how.age` |

- **The first box rocked** with the lady from side to side, 62 pixels in 0.4 s, and dropped 90 with
  each hop. Keeping its height to the head in steps of half a head made it jump instead. The first
  `joints.rest` put the dip back the wrong way (a dip is downward in the figure's frame): the rest point
  moved 81 pixels over a beat; with the sign mended, 1.
- **The maker.** Texts of two more kinds, `say` and `think`, each with `who`, the id of its person:
  💬 คำพูด and 💭 ความคิด beside 🎞️ the card and 🔤 the subtitle (which was 💬 before); 💬 พูด / 💭 คิด in a
  person's own panel make one for them from the second being looked at; a bubble's panel picks its
  person and turns it from said to thought. In the film's code each person who speaks in a scene keeps
  what `person()` gave back (`heads[n]`), and the bubbles are drawn after everyone. A person taken away
  takes their bubbles. In the JSON, `"who"` is the person's place in `items` (or their name); a film
  this page saved keeps its ids, and they are read first. In the 🧒 guide, each person's turn asks if
  they say or think something, and how it shows: 💬 a speech bubble, 💭 a thought bubble, or 🔤 words
  under the picture, with a line for a child on what each one is.
- **Not done.** Bubbles for the creatures (they have no joints to point at yet; an `[x, y]` works
  meanwhile); two bubbles at once can overlap: the kit does not move one out of another's way.

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

## The kit's own checks

**One command after any change to the kit**, from `kit/`:

```
python checks/kit_check.py            # every page that loads oldcartoon.js (several minutes: it draws every frame of every page)
python checks/kit_check.py --quick    # without the arms, which take the longest
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
