# How the kit was made: the rounds of matching, the quality round, a puppet of a Spark drawing

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

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
