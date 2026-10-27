// myth.js - four creatures of the myths of Lanna, the north of Thailand, for
// films made with oldcartoon.js: the Mom, the Luang, the Hatsadiling bird
// and the creature with four ears and five eyes. They stand on the beasts'
// legs and the Naga's body, so load it after both:
//
//     <script src="oldcartoon.js"></script>
//     <script src="naga.js"></script>
//     <script src="beasts.js"></script>
//     <script src="myth.js"></script>
//
// and call mom(x, y, look), luang(x, y, look), hatsadiling(x, y, look) or
// maengSiHuHaTa(x, y, look) from a scene. A fifth, Chang Ngu, the
// snake-elephant of Chiang Saen, is at the file's end: changNgu(x, y, look).
//
// Nothing is copied. Each was read by eye from one photograph of a work in
// the north (all on Wikimedia Commons) and from what is written of it, and
// this file keeps what the work does, as rules, and draws its own creature in
// the kit's manner: flat colour inside a fine dark line.
//
//   The Mom (ตัวมอม). A creature the craftsmen of the north made up, seen as
//   sculpture at the temples of the upper north, at the foot of a stair or
//   by a gate, where it keeps watch. It is told that it is the mount of
//   Pajjunna, the god of rain, and that it was carried in a procession to
//   ask for rain. Writers on it say it is mixed of a lion, a cat, a dog, a
//   monkey, a gecko and a lizard, with long arms and a long body, and that
//   no two craftsmen make it alike. Read from the Mom at the stair of Wat
//   Phra That Doi Suthep, Chiang Mai (photograph: Photo Dharma, CC BY 2.0):
//     1. Low and stout, on four bent legs with claws, the fore legs longer.
//     2. Scales all over, each with a pale edge.
//     3. A broad head, a great round eye under a heavy brow that curls, a
//        wide mouth full of teeth, a fin behind the cheek.
//     4. A row of small flames down the back, and a tail that ends in one.
//
//   The Luang (พญาลวง, ตัวลวง). The dragon of the Tai Lue and of Lanna,
//   often taken for a Naga. It has four legs, wings, ears and horns, and it
//   is mixed of five animals: an elephant, a horse, a deer, a swan and a
//   fish. The north calls lightning that plays in the clouds without thunder
//   "luang len fa", the Luang playing in the sky. Read from the gilded
//   carving in the museum of Wat Phra Kaeo, Chiang Rai (photograph:
//   Iudexvivorum, CC0):
//     1. A long body in scales, as a fish's, that narrows to the tail.
//     2. The tail turns up and ends in a tall flame.
//     3. Four legs, each ending in a hoof with a tuft over it, as a horse's.
//     4. A wing of long feathers at the shoulder, as a swan's.
//     5. The head: a snout that turns up at its tip as an elephant's trunk
//        does, a deer's antlers, long whiskers, an open mouth with teeth,
//        and a flame of a crest behind it.
//
//   The Hatsadiling bird (นกหัสดีลิงค์). A great bird of the Himavanta
//   forest with the head of an elephant, said to have the strength of
//   several elephants. In the north a tower in its shape carries the body at
//   the cremation of a revered monk or a ruler, and in the legend of Lamphun
//   it brought the conch shell by which the city was laid out. Read from the
//   bird made at Wat Chedi Luang, Chiang Mai, in 2010 (photograph: Takeaway,
//   CC BY-SA 3.0); here it is the bird alone, and it carries nothing:
//     1. A great round body in scales of feathers, on a bird's two legs.
//     2. A thick neck with a collar, and on it a dark elephant's head: a
//        trunk, two white tusks, and a tall flame of gold on its crown.
//     3. A wing folded along its side, with a round flower at the shoulder.
//     4. A tail that stands up in a fan of great flames, each with a border.
//
//   The creature with four ears and five eyes (แมงสี่หูห้าตา, Maeng Si Hu Ha
//   Ta). In the tale of Lanna an orphan catches it in a snare at a cave on
//   Doi Khao Khwai, Chiang Rai; it eats nothing but red-hot embers, and what
//   it leaves behind is gold (the palm-leaf Tham Si Hu Ha Ta, and the shrine
//   at Wat Phra That Doi Khao Khwai Kaeo, where people still bring it
//   charcoal). Read from the shrine's statue (photograph: Chainwit., CC BY-SA
//   4.0) and the older statue and amulets in its style (Big HDV, CC BY-SA
//   3.0), all on Wikimedia Commons; then, from three candidates, the owner's
//   (2026-10-19): "Like C but longer, with a big grin and 2 big tusks and
//   oversized feet and claws", the tusks up, "Make the mouth bigger":
//     1. A long heavy body like a bear's, in short dark grey fur, a little
//        shaggy at its edge, on four short legs.
//     2. A big round head turned to whoever looks at it, a heavy jaw.
//     3. Five eyes, as the points of a star: one high in the middle of the
//        brow, two above at the sides, two lower and nearer the middle; each
//        in a ring, as the statue's are carved; green.
//     4. Four round ears, two on each side, high on the head.
//     5. A small blunt nose, and a grin from cheek to cheek, a row of small
//        teeth, and two great tusks that rise from the lower jaw.
//     6. Paws too big for it, with long pale claws hooked down to the ground.
//
// And they move. The Mom walks one foot at a time, as the kit's beasts do,
// blinks, and opens its mouth. The Luang flies: its body follows its head as
// a chain (the Naga's rule), its wings beat, its legs paddle and its
// whiskers stream. The bird walks on two legs or flies, and its trunk sways.

// The names a look may have (each of the three warns about any other):
//   size       how large it is drawn (1 is the Mom about 330 long and 260 high, the Luang
//              about 900 long, the bird about 480 high)
//   face       1 looks right, -1 looks left
//   late       the timing of the beat, as hop(t, late) takes it: the head keeps it
//   mouth      0 to 1: how far the mouth is open, if the scene says (the Mom's and the Luang's)
//   feel       a feeling, as a person's (creatureFeel() in the kit): the eye, the brow, the
//              jaw and the head's carriage (the Mom's and the Luang's); the Hatsadiling's eye,
//              its head, and its trunk raised in wonder and gladness
//   colour     the colour of the scales, or of the bird's feathers
//   gold       the colour of the flames, the frills, the brows and the borders
//   belly      the colour of the underside
// for the Mom and the bird:
//   step       a number that grows while walking; without it the creature stands
// for the Mom:
//   eyes       the colour of its eyes
// for the Luang:
//   trail      a function of the time that gives [x, y], where its head is at that time
//              (the function the film itself moves it with): the body follows as a chain
//   depth      0 far from the screen to 1 near, as the dragon's
//   sing       true to open the mouth on every beat
//   horns      the colour of its antlers
//   wings      the colour of its wings (the bird's wing too)
// for the bird:
//   fly        true: it flies. The wings beat and the legs are drawn up
//   head       the colour of its elephant's head
//   trunk      0 to 1: how high the trunk is lifted
// for the creature with four ears and five eyes (maengSiHuHaTa), with size, face, step, mouth, colour,
// eyes and feel:
//   glow       0 to 1: how far its five eyes light up, as they do when it has eaten an ember
//   wake       0 to 5: how many of its five eyes are open (5 unless told), so that they open one by one: the two
//              low ones first, then the two at the sides, then the one at the top; a part is an eye opening
//   watch      false: its five eyes look straight out together. Else, in a film (film()), three watch the nearest
//              one drawn in the frame, one stares out at the viewer and then scans slowly side to side, and one
//              wanders; every ten seconds the staring and the wandering eye change to others (maengEyes())
//   eyeFeel    the feeling of two of its eyes, the other three having "feel" (else MAENG_EYE_FEEL's for it)
//   id         a name of its own, so that which three eyes share its feeling is its own (else "maeng")
//   slope      the ground under the feet, as the beasts take it (beastLegs() reads it: until 2026-10-21 it worked here
//              and warned it was not known)
var MYTH_KEYS = {};

["size", "face", "late", "mouth", "colour", "gold", "belly", "step", "eyes", "trail", "depth", "sing", "horns", "wings", "fly", "head", "trunk", "feel",
 "glow", "wake", "watch", "eyeFeel", "id", "slope"
].forEach(function (name) { MYTH_KEYS[name] = true; });

// How the two that walk do it, for amble() of beasts.js: [how large it is
// drawn, how far a foot goes back along the ground in one stride, how many
// beats a stride takes].
GAITS.mom = [0.9, 70, 2];
GAITS.hatsadiling = [1, 90, 2];
GAITS.maengSiHuHaTa = [1, 60, 2];

// Scales, inside the shape that "shapeOf" makes: rows of small round scales,
// each row sitting between the scales of the row above, their round edges
// downward. They are all one colour and one stroke.
//   shapeOf   a function that makes the shape's path on pen (it need not fill it)
//   left, top, right, bottom   the box the scales are laid in, in pixels of pen's frame
//   r         a scale's radius, in the same pixels
//   colour    the scales' line
// Returns nothing: it draws with pen, clipped to the shape; pen is restored.
// e.g. mythScales(function () { pen.beginPath(); pen.ellipse(0, -150, 120, 60, 0, 0, 7); }, -120, -210, 120, -90, 9, "#e0b23a")
function mythScales(shapeOf, left, top, right, bottom, r, colour) {
  pen.save();
  shapeOf();
  pen.clip();
  pen.strokeStyle = colour;
  pen.lineWidth = 1.3 * FINE;
  pen.beginPath();
  for (var row = 0, y = top; y < bottom + r; row++, y += r * 0.95) {
    for (var x = left - (row % 2) * r; x < right + r; x += r * 2) {
      pen.moveTo(x - r, y);
      pen.arc(x, y, r, Math.PI, 0, true);           // the lower half of a circle
    }
  }
  pen.stroke();
  pen.restore();
}

// One great feather of a wing or a tail, from (0, 0) out along x: a flame of
// a leaf with a border of another colour and a rib. "curl" is how far its
// tip is bent to one side. long, wide and curl are in pixels of pen's frame;
// "colour" fills the middle and "border" the edge round it.
// Returns nothing: it draws with pen, and leaves pen's stroke colour, line
// width and lineCap set.
// e.g. mythFeather(176, 36, -8, "#f6dc8a", "#e0b23a")
function mythFeather(long, wide, curl, colour, border) {
  function leaf() {
    pen.beginPath();
    pen.moveTo(0, -wide * 0.22);
    pen.bezierCurveTo(long * 0.3, -wide * 0.95, long * 0.78, -wide * 0.55, long, curl);
    pen.bezierCurveTo(long * 0.72, wide * 0.5 + curl * 0.3, long * 0.3, wide * 0.85, 0, wide * 0.22);
    pen.closePath();
  }
  leaf();
  shape(border);
  pen.save();                                       // the same leaf again, smaller, inside it
  pen.translate(long * 0.08, 0);
  pen.scale(0.76, 0.6);
  leaf();
  pen.fillStyle = colour;
  pen.fill();
  pen.restore();
  pen.strokeStyle = inkFor(border);
  pen.lineWidth = 1.2 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(long * 0.06, 0);
  pen.quadraticCurveTo(long * 0.5, -wide * 0.08, long * 0.86, curl * 0.8);
  pen.stroke();
}

// A tube along a row of points, as a tail or a neck: wide at its first point
// and "thin" at its last, with one line round it.
// "points" is a list of [x, y]; wide and thin are half-widths, in pixels of
// pen's frame; "colour" fills it. Returns its two edges, as beastTube()
// gives them. It draws with pen.
// e.g. mythTube([[0, 0], [-60, -20], [-110, -80]], 22, 6, "#8d6f9b")
function mythTube(points, wide, thin, colour) {
  var edges = beastTube(points, function (u) { return mix(wide, thin, u); }), last = points.length - 1, n;
  pen.beginPath();
  for (n = 0; n <= last; n++) { pen.lineTo(edges[0][n][0], edges[0][n][1]); }
  for (n = last; n >= 0; n--) { pen.lineTo(edges[1][n][0], edges[1][n][1]); }
  pen.closePath();
  shape(colour);
  return edges;
}

// ---------- the Mom ----------
// A Mom, standing on (x, y): see the top of this file. It gives back
// {seat, head}, points of the scene, as the kit's beasts do.
//   x, y   the ground under its middle, in pixels of the sheet
//   look   an object, never left out ({} gives a purple Mom standing, size 1,
//          facing right): its keys are MYTH_KEYS above (the Mom reads size,
//          face, colour, gold, belly, eyes, step, late, mouth, feel)
// Returns {seat: [x, y], head: [x, y]}, points of the sheet. It draws with
// pen; it sets FINE and LINE while it draws and leaves them at 1 and STYLE.line.
// e.g. var walk = amble("mom", clock, 200, 900, 1, {size: 0.8});
//      mom(walk.x, GROUND, walk.look);
function mom(x, y, look) {
  checkNames("The Mom's name", look, MYTH_KEYS);
  var size = (look.size || 1) * GAITS.mom[0], face = look.face || 1, seed = x * 0.013, n, k;
  var c = {body: look.colour || "#8d6f9b", belly: look.belly || "#eadcb8", crest: look.gold || "#e0b23a", fire: "#f6dc8a"};
  var edge = blend(c.crest, c.body, 0.3), ink = inkFor(c.body);
  var walk = look.step !== undefined, bob = walk ? 3 * Math.abs(Math.sin(look.step * Math.PI * 2)) : 0;
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0;
  var open = clamp(look.mouth === undefined ? 0.14 + 0.1 * Math.sin(clock * 1.4 + seed) : look.mouth);
  var e = look.feel !== undefined ? creatureFeel(look, clock + seed) : null;
  if (e) { open = e.jaw(open); }
  var hind = [[-100, -112, 0, -1, false], [-80, -116, 0.5, -1, true]], fore = [[92, -128, 0.25, 1, false], [112, -132, 0.75, 1, true]];
  FINE = Math.min(1, Math.pow(Math.max(0.5, size), -0.7));
  LINE = STYLE.line * FINE / Math.max(0.45, Math.min(1, size * 1.3));
  pen.fillStyle = "rgba(70, 45, 30, 0.2)";          // its shadow on the ground
  pen.beginPath();
  pen.ellipse(x + 10 * size * face, y + 4 * size, 210 * size, 18 * size, 0, 0, 7);
  pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  function paw(ax, ay, skin, lifted) {              // a paw: round, with three claws
    pen.save();
    pen.translate(ax, ay);
    pen.rotate(lifted ? 0.45 : 0);
    pen.beginPath();
    pen.ellipse(8, 1, 23, 11, 0, 0, 7);
    shape(skin);
    pen.fillStyle = "#fff6ea";
    pen.strokeStyle = inkFor(skin);
    pen.lineWidth = 1.2 * FINE;
    for (var claw = 0; claw < 3; claw++) {
      pen.beginPath();
      pen.moveTo(8 + claw * 9, -2);
      pen.lineTo(22 + claw * 8, 12);
      pen.lineTo(13 + claw * 9, 8);
      pen.closePath();
      pen.fill();
      pen.stroke();
    }
    pen.restore();
  }
  function legs(far) {                              // the hind legs, and the fore legs, which are longer: a Mom has long arms
    beastLegs(hind, far, look, [66, 62, 12], [27, 18, 13], c.body, GAITS.mom[1], 20, paw);
    beastLegs(fore, far, look, [76, 70, 12], [24, 16, 12], c.body, GAITS.mom[1], 20, paw);
  }
  function bodyShape() {                            // a stout barrel: a round rump, a back that rises to the shoulders, a low belly
    pen.beginPath();
    pen.moveTo(-150, -128);
    pen.bezierCurveTo(-170, -196, -110, -226, -30, -222);
    pen.bezierCurveTo(40, -220, 96, -232, 128, -206);
    pen.bezierCurveTo(160, -180, 158, -120, 126, -96);
    pen.bezierCurveTo(70, -62, -70, -60, -124, -84);
    pen.bezierCurveTo(-144, -94, -150, -110, -150, -128);
    pen.closePath();
  }
  function backAt(u) {                              // a place along the top of the back, from the neck (0) to the rump (1)
    return [mix(104, -148, u), -223 + 46 * Math.pow(Math.max(0, (u - 0.55) / 0.45), 2)];
  }
  legs(true);
  pen.translate(0, -bob);
  var sway = 0.5 * Math.sin(clock * 1.7 + seed) + 0.5 * beat;   // the tail: it rises in a curve, sways, and ends in a flame
  var tail = [[-138, -150], [-186, -136], [-226, -160], [-244, -206], [-232, -252], [-204, -276]];
  for (n = 1; n < tail.length; n++) { tail[n] = [tail[n][0] + sway * n * 2.5, tail[n][1] + sway * n * 1.2]; }
  var bone = nagaLine(tail, 10), tip = bone[bone.length - 1], before = bone[bone.length - 3];
  pen.save();
  pen.translate(tip[0], tip[1]);
  pen.rotate(Math.atan2(tip[1] - before[1], tip[0] - before[0]));
  nagaFlame(66, 26, [[-0.5, 0.6, -1], [0.45, 0.65, 1], [0, 1, 1]], seed, c);
  pen.restore();
  mythTube(bone, 17, 7, c.body);
  for (n = 0; n < 9; n++) {                         // the row of small flames down the back, under the body's edge
    var at = backAt(n / 8), tall = 22 + 8 * Math.sin(n * 2.1) + 5 * Math.sin(clock * 6 + n * 1.3);
    pen.beginPath();
    pen.moveTo(at[0] + 15, at[1] + 10);
    pen.quadraticCurveTo(at[0] + 6, at[1] - 18, at[0] - 14, at[1] - 22 - tall);
    pen.quadraticCurveTo(at[0] - 8, at[1] - 6, at[0] - 18, at[1] + 10);
    pen.closePath();
    shape(c.crest);
  }
  bodyShape();
  shape(c.body);
  pen.save();                                       // the pale underside, and scales over all the rest
  bodyShape();
  pen.clip();
  pen.fillStyle = c.belly;
  pen.beginPath();
  pen.ellipse(-4, -62, 150, 34, 0, 0, 7);
  pen.fill();
  pen.restore();
  mythScales(function () {
    pen.beginPath();
    pen.rect(-180, -240, 360, 144);
    pen.clip();
    bodyShape();
  }, -176, -232, 164, -96, 11, edge);
  bodyShape();                                      // the body's own shape again, for its line: the scales have crossed it
  pen.strokeStyle = ink;
  pen.lineWidth = LINE;
  pen.lineJoin = "round";
  pen.stroke();
  pen.translate(0, bob);
  legs(false);
  pen.translate(0, -bob);
  pen.save();                                       // the head, big and broad, before the shoulders
  pen.translate(140, -198);
  pen.rotate(0.04 * Math.sin(clock * 1.6 + seed) + 0.07 * beat + (walk ? 0.03 * Math.sin(look.step * Math.PI * 4) : 0) - 0.1 * open +
             (e ? 0.6 * e.nod - 0.1 * e.raise + 0.05 * e.shake : 0));
  var blink = Math.sin(clock * 0.9 + seed * 3) > 0.985, flop = 0.08 * Math.sin(clock * 2.1 + seed) + 0.2 * beat;
  function ear(dx, dy, skin) {                      // a small round ear
    pen.save();
    pen.translate(-22 + dx, -76 + dy);
    pen.rotate(-0.35 + flop);
    pen.beginPath();
    pen.moveTo(-15, 8);
    pen.quadraticCurveTo(-20, -30, 4, -42);
    pen.quadraticCurveTo(24, -22, 17, 8);
    pen.closePath();
    shape(skin);
    pen.beginPath();
    pen.moveTo(-7, 4);
    pen.quadraticCurveTo(-9, -20, 4, -30);
    pen.quadraticCurveTo(13, -16, 9, 4);
    pen.closePath();
    pen.fillStyle = "#d98f8f";
    pen.fill();
    pen.restore();
  }
  function skull() {                                // the skull and the muzzle. It has no chin: the lower jaw is a piece of its own
    pen.beginPath();
    pen.moveTo(-58, 30);
    pen.bezierCurveTo(-88, -30, -52, -92, 14, -88);
    pen.bezierCurveTo(48, -86, 70, -64, 84, -42);
    pen.bezierCurveTo(104, -42, 130, -36, 134, -14);
    pen.quadraticCurveTo(138, 8, 118, 12);
    pen.lineTo(40, 20);
    pen.quadraticCurveTo(-10, 44, -58, 30);
    pen.closePath();
  }
  for (n = 0; n < 5; n++) {                         // a mane of five curls round the back of the head, each a round of gold with a turn in it
    var round = Math.PI * (0.62 + n * 0.2), cx = -24 + 66 * Math.cos(round), cy = -22 - 66 * Math.sin(round);
    oval(cx, cy, 25, 25, c.crest);
    pen.strokeStyle = inkFor(c.crest);
    pen.lineWidth = 1.4 * FINE;
    pen.beginPath();
    for (k = 0; k <= 16; k++) { pen.lineTo(cx + (15 - k * 0.8) * Math.cos(k * 0.45 + n), cy + (15 - k * 0.8) * Math.sin(k * 0.45 + n)); }
    pen.stroke();
  }
  ear(-22, -2, blend(c.body, "#1c1c22", 0.25));
  pen.save();                                       // the lower jaw, behind the skull: it turns about the corner of the mouth
  pen.translate(34, 22);
  pen.rotate(0.55 * open);
  if (open > 0.03) {                                // the inside of the mouth shows above it
    pen.beginPath();
    pen.moveTo(-8, -2);
    pen.lineTo(86, -6);
    pen.lineTo(84, 6);
    pen.closePath();
    pen.fillStyle = "#a8322c";
    pen.fill();
  }
  pen.fillStyle = "#fff6ea";                        // its teeth stand up along it
  pen.strokeStyle = "rgba(60, 40, 30, 0.7)";
  pen.lineWidth = FINE;
  for (n = 0; n < 5; n++) {
    pen.beginPath();
    pen.moveTo(22 + n * 13, 2);
    pen.lineTo(28 + n * 13, n === 4 ? -15 : -9);
    pen.lineTo(34 + n * 13, 2);
    pen.closePath();
    pen.fill();
    pen.stroke();
  }
  pen.beginPath();
  pen.moveTo(-22, -2);
  pen.quadraticCurveTo(40, -5, 88, 0);
  pen.quadraticCurveTo(98, 12, 80, 18);
  pen.quadraticCurveTo(26, 30, -22, 16);
  pen.closePath();
  shape(c.belly);
  pen.restore();
  if (open > 0.03) {                                // and under the muzzle, where the jaw has left it
    pen.beginPath();
    pen.moveTo(38, 18);
    pen.lineTo(118, 10);
    pen.lineTo(34 + 86 * Math.cos(0.55 * open), 22 + 86 * Math.sin(0.55 * open) - 6);
    pen.closePath();
    pen.fillStyle = "#a8322c";
    pen.fill();
  }
  skull();
  shape(c.body);
  mythScales(function () {
    pen.beginPath();
    pen.rect(-90, -94, 150, 140);                   // the back of the head has scales; the muzzle is smooth
    pen.clip();
    skull();
  }, -90, -90, 62, 44, 9, edge);
  skull();
  pen.strokeStyle = ink;
  pen.lineWidth = LINE;
  pen.stroke();
  pen.beginPath();                                  // the fin on the cheek: a fan with a toothed edge and three ribs
  pen.moveTo(24, 16);
  pen.quadraticCurveTo(2, -16, -34, -12);
  pen.lineTo(-46, 2);
  pen.lineTo(-34, 8);
  pen.lineTo(-44, 20);
  pen.lineTo(-30, 24);
  pen.lineTo(-36, 38);
  pen.lineTo(-18, 36);
  pen.quadraticCurveTo(8, 36, 24, 16);
  pen.closePath();
  shape(c.crest);
  pen.strokeStyle = inkFor(c.crest);
  pen.lineWidth = 1.2 * FINE;
  pen.beginPath();
  pen.moveTo(18, 16);
  pen.lineTo(-40, 0);
  pen.moveTo(18, 16);
  pen.lineTo(-38, 20);
  pen.moveTo(18, 16);
  pen.lineTo(-28, 34);
  pen.stroke();
  pen.fillStyle = "#fff6ea";                        // the upper teeth, and a fang
  pen.strokeStyle = "rgba(60, 40, 30, 0.7)";
  pen.lineWidth = FINE;
  for (n = 0; n < 6; n++) {
    var tx = 50 + n * 12, ty = 19 - n * 1.3, fang = n === 4;
    pen.beginPath();
    pen.moveTo(tx, ty);
    pen.lineTo(tx + 6, ty + (fang ? 17 : 9));
    pen.lineTo(tx + 12, ty - 1.3);
    pen.closePath();
    pen.fill();
    pen.stroke();
  }
  pen.strokeStyle = ink;                            // the nostril: a curl
  pen.lineWidth = 2 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.arc(120, -16, 6, 0.6, 5.2);
  pen.stroke();
  oval(54, -44, 20, 20, c.crest);                   // the eye: great and round, in a ring of gold
  if (e) {                                          // a feeling's eye, its lid the gold of the ring
    creatureEye(54, -44, 13, 13, e, {skin: c.crest, iris: look.eyes || "#1f1a1a", ink: ink, shut: blink});
  } else if (blink) {
    pen.strokeStyle = ink;
    pen.lineWidth = 2.4 * FINE;
    pen.beginPath();
    pen.moveTo(40, -44);
    pen.quadraticCurveTo(54, -36, 68, -44);
    pen.stroke();
  } else {
    pen.fillStyle = "#fff6ea";
    pen.beginPath();
    pen.arc(54, -44, 13, 0, 7);
    pen.fill();
    pen.fillStyle = look.eyes || "#1f1a1a";
    pen.beginPath();
    pen.arc(58, -44, 7, 0, 7);
    pen.fill();
    pen.fillStyle = "#fff6ea";
    pen.beginPath();
    pen.arc(60.5, -47, 2.2, 0, 7);
    pen.fill();
  }
  pen.save();                                       // the brow: heavy, and curled at its end (a feeling raises it, or turns it)
  if (e) {
    pen.translate(58, -64 - 7 * e.brow[0] + 7 * e.brow[1]);
    pen.rotate(0.8 * e.brow[1]);
    pen.translate(-58, 64);
  }
  pen.beginPath();
  pen.moveTo(26, -60);
  pen.quadraticCurveTo(54, -90, 88, -62);
  pen.quadraticCurveTo(94, -52, 84, -50);
  pen.quadraticCurveTo(56, -72, 32, -52);
  pen.closePath();
  shape(c.crest);
  pen.restore();
  ear(0, 0, c.body);
  var crown = pen.getTransform().transformPoint(new DOMPoint(0, -92));
  pen.restore();
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
  return {seat: [x - 20 * size * face, y - (228 + bob) * size], head: [crown.x, crown.y]};
}

// ---------- the Luang ----------
// One leg of a Luang, from the shoulder (sx, sy) to the foot at (px, py): a
// horse's leg, with a tuft over a dark hoof. "knee" is 1 for a leg whose
// joint points forward and -1 for one whose joint points back. All in
// pixels of pen's frame; "skin" is the leg's colour, "c" the Luang's colours
// (crest and fire, for the tuft).
// Returns nothing (unlike dragonLeg()): it draws with pen.
// e.g. luangLeg(0, 20, 30, 112, -1, "#2f8f6a", {crest: "#e0b23a", fire: "#e8632c"})
function luangLeg(sx, sy, px, py, knee, skin, c) {
  var leg = limb(sx, sy, px, py, 62, 56, [22, 15, 10], skin, function (joint) { return knee * joint[0]; }, 0.25);
  pen.save();
  pen.translate(leg[0], leg[1]);
  pen.rotate(Math.atan2(leg[1] - leg[3], leg[0] - leg[2]) - Math.PI / 2);   // so that "down the leg" is down
  pen.save();                                       // the tuft, behind the leg and over the hoof
  pen.translate(-7, -6);
  pen.rotate(Math.PI * 0.72);
  nagaFlame(30, 13, [[-0.3, 0.7, -1], [0.3, 1, 1]], sx * 0.1, c);
  pen.restore();
  pen.beginPath();                                  // the hoof
  pen.moveTo(-11, -2);
  pen.lineTo(11, -2);
  pen.lineTo(15, 18);
  pen.lineTo(-14, 18);
  pen.closePath();
  shape("#3a2a22");
  pen.restore();
}

// A Luang's head in profile, looking along x, its neck joining at (0, 0).
// "open" is how far the mouth is open, 0 to 1.
// "c" the Luang's colours (body, belly, crest, fire, horn, edge, as luang()
// makes them); "e" a feeling (creatureFeel()), or null.
// Returns nothing: it draws with pen, and leaves pen's colours and line width set.
// e.g. luangHead(0.4, c, null)   // c as luang() makes it
function luangHead(open, c, e) {
  var ink = inkFor(c.body), n, k;
  function skull() {                                // the skull, and a snout whose tip turns up as a trunk's does. No chin: the jaw is its own piece
    pen.beginPath();
    pen.moveTo(-34, 34);
    pen.bezierCurveTo(-60, -10, -40, -68, 10, -72);
    pen.bezierCurveTo(40, -74, 62, -58, 78, -42);
    pen.bezierCurveTo(100, -40, 122, -38, 136, -50);
    pen.bezierCurveTo(146, -60, 148, -76, 140, -90);
    pen.bezierCurveTo(150, -98, 168, -96, 176, -84);
    pen.bezierCurveTo(192, -60, 186, -34, 162, -16);
    pen.lineTo(46, 12);
    pen.quadraticCurveTo(0, 42, -34, 34);
    pen.closePath();
  }
  function antler(dx, dy, colour) {                 // a deer's antler: a beam that leans back, and four points
    var beams = [[[18, -60], [6, -110], [-18, -152]], [[13, -92], [28, -108], [44, -130]], [[1, -126], [12, -144], [28, -166]],
                 [[-18, -152], [-28, -166], [-40, -182]], [[-18, -152], [-12, -170], [-2, -188]]];
    for (var pass = 0; pass < 2; pass++) {          // as a hose is drawn: fat in ink, then in colour
      pen.strokeStyle = pass ? colour : inkFor(colour);
      pen.lineWidth = pass ? 7 : 7 + 2 * LINE;
      pen.lineCap = "round";
      pen.lineJoin = "round";
      pen.beginPath();
      for (var b = 0; b < beams.length; b++) {
        pen.moveTo(beams[b][0][0] + dx, beams[b][0][1] + dy);
        pen.quadraticCurveTo(beams[b][1][0] + dx, beams[b][1][1] + dy, beams[b][2][0] + dx, beams[b][2][1] + dy);
      }
      pen.stroke();
    }
  }
  pen.save();                                       // the crest: a flame that leans back from the crown
  pen.translate(-18, -44);
  pen.rotate(-2.35);
  nagaFlame(130, 38, [[-0.42, 0.6, -1], [0.36, 0.7, 1], [0, 1, 1]], 3, c);
  pen.restore();
  antler(-16, 4, blend(c.horn, "#1c1c22", 0.3));    // the far antler, then the ear, then the near one after the skull
  pen.save();                                       // the lower jaw, behind the skull: it turns about the corner of the mouth
  pen.translate(42, 14);
  pen.rotate(0.5 * open);
  if (open > 0.03) {
    pen.beginPath();
    pen.moveTo(-8, -2);
    pen.lineTo(112, -8);
    pen.lineTo(110, 8);
    pen.closePath();
    pen.fillStyle = "#a8322c";
    pen.fill();
    pen.save();                                     // its tongue
    pen.translate(20, 2);
    pen.rotate(-0.12);
    nagaTongue(86, 12, -10 - 6 * Math.sin(clock * 5), "#e8632c", 1.2 * FINE);
    pen.restore();
  }
  pen.fillStyle = "#fff6ea";
  pen.strokeStyle = "rgba(60, 40, 30, 0.7)";
  pen.lineWidth = FINE;
  for (n = 0; n < 6; n++) {
    pen.beginPath();
    pen.moveTo(26 + n * 14, 3);
    pen.lineTo(32 + n * 14, -8);
    pen.lineTo(38 + n * 14, 3);
    pen.closePath();
    pen.fill();
    pen.stroke();
  }
  pen.beginPath();
  pen.moveTo(-16, -2);
  pen.quadraticCurveTo(50, -4, 112, 4);
  pen.quadraticCurveTo(122, 16, 102, 20);
  pen.quadraticCurveTo(40, 34, -16, 18);
  pen.closePath();
  shape(c.belly);
  pen.save();                                       // a small beard under the chin
  pen.translate(60, 26);
  pen.rotate(1.9);
  nagaFlame(36, 14, [[-0.3, 0.7, -1], [0.3, 1, 1]], 5, c);
  pen.restore();
  pen.restore();
  if (open > 0.03) {
    pen.beginPath();
    pen.moveTo(44, 12);
    pen.lineTo(160, -16);
    pen.lineTo(42 + 112 * Math.cos(0.5 * open), 14 + 112 * Math.sin(0.5 * open) - 6);
    pen.closePath();
    pen.fillStyle = "#a8322c";
    pen.fill();
  }
  pen.save();                                       // the ear: a cow's, behind the eye
  pen.translate(-4, -46);
  pen.rotate(-2.5 + 0.1 * Math.sin(clock * 2.3));
  paintLeaf(pen, 46, 14, 0.15, blend(c.body, "#1c1c22", 0.2), c.belly, ink, "rgba(0, 0, 0, 0)");
  pen.restore();
  skull();
  shape(c.body);
  mythScales(function () {
    pen.beginPath();
    pen.rect(-64, -76, 130, 124);                   // the back of the head has scales; the snout is smooth
    pen.clip();
    skull();
  }, -64, -72, 70, 46, 9, c.edge);
  skull();
  pen.strokeStyle = ink;
  pen.lineWidth = LINE;
  pen.lineJoin = "round";
  pen.stroke();
  pen.fillStyle = "#fff6ea";                        // the upper teeth
  pen.strokeStyle = "rgba(60, 40, 30, 0.7)";
  pen.lineWidth = FINE;
  for (n = 0; n < 7; n++) {
    var tx = 56 + n * 14, ty = 10 - n * 3.5;
    pen.beginPath();
    pen.moveTo(tx, ty);
    pen.lineTo(tx + 7, ty + (n === 5 ? 18 : 10));
    pen.lineTo(tx + 14, ty - 3.5);
    pen.closePath();
    pen.fill();
    pen.stroke();
  }
  pen.strokeStyle = ink;                            // the nostril, on the turn of the snout
  pen.lineWidth = 2 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.arc(164, -70, 6, 0.4, 4.8);
  pen.stroke();
  for (k = 0; k < 2; k++) {                         // two long whiskers that stream back from the snout
    var wave = 14 * Math.sin(clock * 2.6 + k * 1.7);
    for (n = 0; n < 2; n++) {
      pen.strokeStyle = n ? c.crest : inkFor(c.crest);
      pen.lineWidth = (n ? 3 : 5) * FINE;
      pen.beginPath();
      pen.moveTo(160, -34 - k * 8);
      pen.bezierCurveTo(214, -60 + wave, 196 - k * 26, -128 + wave, 112 - k * 40, -150 - k * 10 + wave);
      pen.stroke();
    }
  }
  if (e) {                                          // a feeling's eye, under a brow of gold raised or turned by it
    creatureEye(54, -36, 13, 12, e, {turn: -0.1, skin: c.body, iris: c.crest, pupil: "#1f1a1a", ink: inkFor(c.body)});
  } else {
    pen.beginPath();                                // the eye, under a brow of gold
    pen.ellipse(54, -36, 13, 12, -0.1, 0, 7);
    shape("#fff6ea", 1.4 * FINE);
    oval(57, -36, 7, 8, c.crest);
    pen.fillStyle = "#1f1a1a";
    pen.beginPath();
    pen.arc(58, -36, 3.6, 0, 7);
    pen.fill();
  }
  pen.save();
  if (e) {
    pen.translate(57, -54 - 7 * e.brow[0] + 7 * e.brow[1]);
    pen.rotate(0.8 * e.brow[1]);
    pen.translate(-57, 54);
  }
  pen.beginPath();
  pen.moveTo(32, -50);
  pen.quadraticCurveTo(56, -68, 82, -48);
  pen.quadraticCurveTo(58, -58, 36, -44);
  pen.closePath();
  shape(c.crest);
  pen.restore();
  antler(0, 0, c.horn);
}

// A Luang, its head at (x, y). Everything about it is in "look" (see
// MYTH_KEYS above). Without a trail it hangs in the air and its body waves.
//   x, y   where its head is, in pixels of the sheet; the body runs back from
//          it, about 900 long at size 1. With look.trail, (x, y) should be
//          where trail(clock) puts the head
//   look   an object, never left out ({} gives a green Luang at size 1,
//          facing right): the Luang reads size, face, colour, gold, belly,
//          horns, wings, trail, depth, late, sing, mouth, feel
// Returns nothing (unlike the dragon). It draws with pen at the film's clock;
// it sets FINE and LINE while it draws and leaves them at 1 and STYLE.line.
// e.g. luang(760, 300, {size: 0.5, face: -1, trail: function (t) { return [1400 - 120 * t, 300 + 40 * Math.sin(t)]; }})
function luang(x, y, look) {
  checkNames("The Luang's name", look, MYTH_KEYS);
  var size = (look.size || 1) * (look.depth === undefined ? 1 : 0.35 + 1.25 * look.depth), face = look.face || 1, n;
  var c = {body: look.colour || "#2f8f6a", belly: look.belly || "#f1d58a", crest: look.gold || "#e0b23a", fire: "#e8632c",
           horn: look.horns || "#d9c7a0", wing: look.wings || "#f6dc8a"};
  c.bars = blend(c.belly, "#7a4a1a", 0.4);          // the lines between the belly's bars
  c.edge = blend(c.crest, c.body, 0.35);            // the pale edge of a scale on the head
  FINE = Math.min(1, Math.pow(size, -0.7));
  LINE = STYLE.line * FINE;
  pen.save();
  if (look.depth !== undefined) { pen.globalAlpha *= 0.55 + 0.45 * look.depth; }
  pen.translate(x, y);
  pen.scale(size * face, size);
  // The spine. One that is led follows its head as a chain. One that stays
  // has a wave that travels down it, small behind the head and full further back.
  var spine = [];
  if (look.trail) { spine = nagaChain(look.trail, x, y, size, face).slice(0, 58); }
  else {
    for (n = 0; n < 16; n++) { spine.push([-n * 52, 48 * Math.min(1, n / 3) * Math.sin(n * 0.8 - clock * 2.2)]); }
  }
  var line = nagaLine(spine, 9), last = line.length - 1;
  function wide(u) { return mix(40, 9, Math.pow(u, 1.2)) - 12 * Math.pow(1 - Math.min(1, u / 0.1), 2); }
  function along(u) {                               // a point of the spine: where it is, the way to the tail, and half its width
    var k = Math.max(1, Math.min(last - 1, Math.round(u * last)));
    var far = Math.sqrt(Math.pow(line[k + 1][0] - line[k - 1][0], 2) + Math.pow(line[k + 1][1] - line[k - 1][1], 2)) || 1;
    return {x: line[k][0], y: line[k][1], tx: (line[k + 1][0] - line[k - 1][0]) / far, ty: (line[k + 1][1] - line[k - 1][1]) / far, w: wide(u)};
  }
  var hooves = [[0.2, -1, 0], [0.62, 1, 1.6]], dark = blend(c.body, "#1c1c22", 0.25);
  function legs(near) {                             // the two legs of one side: the far ones are behind the body, and darker
    for (var k = 0; k < 2; k++) {
      var s = along(hooves[k][0]), beat = clock * 2.4 + hooves[k][2] + (near ? 0 : Math.PI);
      var sx = s.x + (near ? 0 : -22), sy = s.y + s.w * 0.4 + (near ? 0 : -8);
      luangLeg(sx, sy, sx + 30 + 20 * Math.sin(beat), sy + 92 + 12 * Math.cos(beat), hooves[k][1], near ? c.body : dark, c);
    }
  }
  function wing(near) {                             // a wing of five long feathers at the shoulder: it beats
    var s = along(0.13), flap = Math.sin(clock * 5.2 + (near ? 0 : 0.6));
    pen.save();
    pen.translate(s.x + (near ? 0 : -18), s.y - s.w * 0.5 + (near ? 0 : -6));
    pen.rotate(-0.28 * flap);
    for (var k = 4; k >= 0; k--) {                  // the lowest and shortest first, the longest over them
      pen.save();
      pen.rotate(Math.PI + 0.95 - k * 0.2);
      mythFeather(176 - k * 22, 36, -8, near ? c.wing : blend(c.wing, "#1c1c22", 0.25), near ? c.crest : blend(c.crest, "#1c1c22", 0.25));
      pen.restore();
    }
    oval(0, 0, 21, 17, near ? c.crest : blend(c.crest, "#1c1c22", 0.25));
    pen.restore();
  }
  legs(false);
  wing(false);
  var tip = along(1);                               // the tail's flame: tall, as the carving's is
  pen.save();
  pen.translate(tip.x, tip.y);
  pen.rotate(Math.atan2(tip.ty, tip.tx) - 0.5);
  nagaFlame(210, 62, [[-0.5, 0.55, -1], [0.42, 0.62, 1], [-0.2, 0.8, -1], [0, 1, 1]], 7, c);
  pen.restore();
  nagaStrip(line, wide, c, [0.3]);
  legs(true);
  wing(true);
  var neck = along(0.03), nod = Math.max(-0.5, Math.min(0.5, Math.atan2(-neck.ty, -neck.tx)));
  var up = look.late !== undefined ? hop(clock, look.late) : 0;
  var open = look.mouth !== undefined ? look.mouth : look.sing ? 1 - up : 0.3 + 0.14 * Math.sin(clock * 1.3);
  var e = look.feel !== undefined ? creatureFeel(look, clock) : null;
  if (e) { open = e.jaw(open); }
  pen.save();
  pen.translate(line[0][0], line[0][1]);
  pen.rotate(0.3 * nod + (e ? 0.6 * e.nod - 0.12 * e.raise + 0.06 * e.shake : 0));   // the head keeps nearly level, whatever the neck does; a feeling lifts it or hangs it
  pen.scale(1.1, 1.1);
  luangHead(clamp(open), c, e);
  pen.restore();
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
}

// ---------- the Hatsadiling bird ----------
// A Hatsadiling bird, standing on (x, y): see the top of this file. It gives
// back {seat, head}, points of the scene, as the kit's beasts do. One that
// flies has (x, y) under it as one that stands has: the place it would stand.
//   x, y   the ground under it, in pixels of the sheet
//   look   an object, never left out ({} gives a blue bird with a dark
//          elephant's head, standing, size 1, facing right): it reads size,
//          face, colour, gold, belly, head, wings, step, fly, trunk, late, feel
//          (MYTH_KEYS above)
// Returns {seat: [x, y], head: [x, y]}, points of the sheet. It draws with
// pen; it sets FINE and LINE while it draws and leaves them at 1 and STYLE.line.
// e.g. hatsadiling(640, GROUND - 200, {fly: true, size: 0.7, trunk: 0.6})
function hatsadiling(x, y, look) {
  checkNames("The bird's name", look, MYTH_KEYS);
  var size = (look.size || 1) * GAITS.hatsadiling[0], face = look.face || 1, seed = x * 0.011, n, k;
  var c = {body: look.colour || "#2f6f9a", belly: look.belly || "#bfe0e6", crest: look.gold || "#e0b23a", fire: "#d8423a",
           head: look.head || "#27305a", wing: look.wings || "#d8423a"};
  var ink = inkFor(c.body), edge = blend(c.crest, c.body, 0.35), fly = !!look.fly;
  var walk = look.step !== undefined && !fly, bob = walk ? 5 * Math.abs(Math.sin(look.step * Math.PI * 2)) : fly ? 10 * Math.sin(clock * 6) : 0;
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0, lift = clamp(look.trunk || 0);
  var flap = fly ? Math.sin(clock * 6) : 0;
  var e = look.feel !== undefined ? creatureFeel(look, clock + x * 0.013) : null;   // a feeling: the eye, the trunk, the head
  if (e && look.trunk === undefined) { lift = clamp(0.7 * e.f.wonder + 0.4 * e.f.smile + 0.5 * e.f.laugh); }   // the trunk raised in wonder and gladness
  FINE = Math.min(1, Math.pow(Math.max(0.5, size), -0.7));
  LINE = STYLE.line * FINE;
  if (!fly) {
    pen.fillStyle = "rgba(70, 45, 30, 0.2)";        // its shadow on the ground
    pen.beginPath();
    pen.ellipse(x - 10 * size * face, y + 4 * size, 190 * size, 18 * size, 0, 0, 7);
    pen.fill();
  }
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  function bodyShape() {                            // a great round body: a high back, a full breast, and it narrows to the tail
    pen.beginPath();
    pen.moveTo(-150, -214);
    pen.bezierCurveTo(-120, -292, 0, -306, 76, -270);
    pen.bezierCurveTo(128, -244, 150, -196, 128, -150);
    pen.bezierCurveTo(104, -100, 10, -84, -70, -104);
    pen.bezierCurveTo(-126, -120, -160, -166, -150, -214);
    pen.closePath();
  }
  function leg(hip, phase, skin) {                  // a bird's leg: a short thigh in feathers, a thin shank, and three toes with claws
    var at = fly ? [-104, 30] : walk ? beastFoot(look.step + phase, GAITS.hatsadiling[1], 30) : [phase ? 12 : -8, 0];   // one that flies trails its legs behind it
    var foot = fly ? [hip[0] + at[0], hip[1] + at[1]] : [hip[0] + at[0], -8 - at[1]];
    var bones = limb(hip[0], hip[1], foot[0], foot[1], 58, 62, [17, 7, 5], skin, function (joint) { return -joint[0]; }, 0.3);
    pen.save();
    pen.translate(bones[0], bones[1]);
    pen.rotate(fly ? 2.6 : at[1] > 2 ? 0.5 : 0);
    pen.strokeStyle = inkFor(skin);
    pen.lineWidth = 1.2 * FINE;
    for (var toe = 0; toe < 3; toe++) {
      pen.save();
      pen.rotate(-0.5 + toe * 0.45);
      pen.beginPath();
      pen.moveTo(-3, -3);
      pen.lineTo(30, -3);
      pen.lineTo(40, 3);
      pen.lineTo(30, 5);
      pen.lineTo(-3, 5);
      pen.closePath();
      shape(skin);
      pen.beginPath();
      pen.moveTo(34, -1);
      pen.lineTo(46, 5);
      pen.lineTo(34, 5);
      pen.closePath();
      pen.fillStyle = "#fff6ea";
      pen.fill();
      pen.stroke();
      pen.restore();
    }
    pen.restore();
  }
  function wing(near) {                             // the wing: long feathers that lie back along the side, or are lifted and beat
    var tone = near ? 0 : 0.25, gold = blend(c.crest, "#1c1c22", tone);
    pen.save();
    pen.translate(56 + (near ? 0 : 18), -238 + (near ? 0 : -8));
    pen.rotate(fly ? 1.0 + 0.5 * flap : -0.04 * Math.sin(clock * 1.4 + seed));
    pen.scale(fly ? 1.25 : 1, fly ? 1.25 : 1);
    for (var f = 3; f >= 0; f--) {                  // the lowest and shortest first
      pen.save();
      pen.rotate(Math.PI - 0.06 - f * 0.17);
      mythFeather(214 - f * 30, 46, 10, blend([c.wing, "#3f6fb8", c.wing, "#3f8f6a"][f], "#1c1c22", tone), gold);
      pen.restore();
    }
    oval(-6, 4, 40, 34, gold);                      // the round flower at the shoulder
    oval(-6, 4, 26, 22, blend(c.wing, "#1c1c22", tone));
    oval(-6, 4, 12, 10, blend("#fff6ea", "#1c1c22", tone));
    pen.restore();
  }
  var legSkin = blend(c.crest, "#c8641a", 0.35);
  leg([44, -112], 0.5, blend(legSkin, "#1c1c22", 0.25));   // the far leg, then the far wing if it flies
  if (fly) { wing(false); }
  pen.translate(0, -bob);
  var order = [0, 4, 1, 3, 2], inner = ["#d8423a", "#3f6fb8", "#f6dc8a", "#3f8f6a", "#d8423a"];
  for (n = 0; n < 5; n++) {                         // the tail: a fan of five great flames, the middle one tallest and last
    k = order[n];
    pen.save();
    pen.translate(-142, -222);
    pen.rotate(-2.2 + (k - 2) * 0.3 + 0.04 * Math.sin(clock * 1.5 + k) + 0.05 * beat - 0.12 * flap);
    mythFeather(250 - Math.abs(k - 2) * 34, 70, 14 * (k < 2 ? -1 : 1), inner[k], c.crest);
    pen.restore();
  }
  bodyShape();
  shape(c.body);
  pen.save();                                       // the pale underside
  bodyShape();
  pen.clip();
  pen.fillStyle = c.belly;
  pen.beginPath();
  pen.ellipse(20, -92, 150, 44, -0.1, 0, 7);
  pen.fill();
  pen.restore();
  mythScales(function () {
    pen.beginPath();
    pen.rect(-170, -310, 330, 176);
    pen.clip();
    bodyShape();
  }, -166, -302, 156, -134, 13, edge);
  bodyShape();                                      // the body's own shape again, for its line
  pen.strokeStyle = ink;
  pen.lineWidth = LINE;
  pen.lineJoin = "round";
  pen.stroke();
  pen.translate(0, bob);
  leg([-6, -116], 0, legSkin);
  pen.translate(0, -bob);
  var nodding = 0.03 * Math.sin(clock * 1.5 + seed) + 0.05 * beat;
  var neck = nagaLine([[86, -246], [120, -298 + 6 * nodding * 20], [138, -350], [142, -402]], 10);
  function neckShape() {
    var sides = beastTube(neck, function (u) { return mix(34, 22, u); }), last = neck.length - 1, p;
    pen.beginPath();
    for (p = 0; p <= last; p++) { pen.lineTo(sides[0][p][0], sides[0][p][1]); }
    for (p = last; p >= 0; p--) { pen.lineTo(sides[1][p][0], sides[1][p][1]); }
    pen.closePath();
  }
  neckShape();
  shape(c.body);
  mythScales(neckShape, 50, -420, 180, -236, 10, edge);
  pen.save();                                       // a collar of three bands where the neck leaves the body
  neckShape();
  pen.clip();
  pen.lineCap = "butt";
  for (n = 0; n < 3; n++) {
    pen.strokeStyle = n === 1 ? c.fire : c.crest;
    pen.lineWidth = 11;
    pen.beginPath();
    pen.moveTo(52, -244 - n * 12);
    pen.quadraticCurveTo(96, -262 - n * 12, 142, -276 - n * 12);
    pen.stroke();
  }
  pen.restore();
  neckShape();
  pen.strokeStyle = ink;
  pen.lineWidth = LINE;
  pen.stroke();
  if (!fly) { wing(true); }
  pen.save();                                       // the head: an elephant's, dark, with a flame of gold on its crown
  pen.translate(146, -424);
  pen.rotate(nodding - 0.12 * lift + (e ? 0.5 * e.nod - 0.1 * e.raise + 0.04 * e.shake : 0));
  var dusk = inkFor(c.head), blink = Math.sin(clock * 0.8 + seed * 3) > 0.985, flop = 0.1 * Math.sin(clock * 1.9 + seed) + 0.2 * beat;
  function dome() {
    pen.beginPath();
    pen.moveTo(-46, 32);
    pen.bezierCurveTo(-72, -8, -54, -64, -10, -70);
    pen.bezierCurveTo(8, -86, 38, -82, 46, -62);
    pen.bezierCurveTo(68, -50, 76, -20, 66, 6);
    pen.quadraticCurveTo(40, 44, -46, 32);
    pen.closePath();
  }
  function tusk(dx, dy, tone) {                     // a tusk: white, out from under the trunk and up at its point
    pen.beginPath();
    pen.moveTo(34 + dx, 14 + dy);
    pen.quadraticCurveTo(82 + dx, 50 + dy, 124 + dx, 12 + dy);
    pen.quadraticCurveTo(84 + dx, 36 + dy, 44 + dx, 2 + dy);
    pen.closePath();
    shape(blend("#fff6ea", "#1c1c22", tone));
  }
  pen.save();                                       // the flame on the crown
  pen.translate(-2, -66);
  pen.rotate(-1.75);
  nagaFlame(120, 38, [[-0.45, 0.6, -1], [0.4, 0.65, 1], [0, 1, 1]], seed, c);
  pen.restore();
  tusk(14, -4, 0.2);
  pen.save();                                       // the ear: small, and shaped as a flame
  pen.translate(-34, -18);
  pen.rotate(Math.PI + 0.5 + flop);
  mythFeather(74, 44, -10, blend(c.head, "#ffffff", 0.12), c.crest);
  pen.restore();
  dome();
  shape(c.head);
  pen.strokeStyle = c.crest;                        // a band of gold across the brow
  pen.lineWidth = 7;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(-30, -58);
  pen.quadraticCurveTo(20, -52, 58, -30);
  pen.stroke();
  var hang = [[54, -8], [80, 22], [88, 66], [80, 112], [62, 146], [64, 174], [84, 186]];
  var held = [[54, -8], [92, -8], [126, -34], [140, -74], [130, -108], [108, -120], [92, -108]], trunk = [];
  for (n = 0; n < hang.length; n++) {               // the trunk: it hangs in a curve and sways, or is lifted
    trunk.push([mix(hang[n][0], held[n][0], lift) + (1 - lift) * n * 1.8 * Math.sin(clock * 1.3 + seed + n * 0.5),
                mix(hang[n][1], held[n][1], lift)]);
  }
  elephantTrunk(nagaLine(trunk, 12), 21, 8, c.head, true);
  tusk(0, 0, 0);
  pen.save();
  pen.translate(30, -24);
  elephantEye(dusk === INK ? "#f6dc8a" : blend(c.head, "#ffffff", 0.55), blink, e, c.head);
  pen.restore();
  var crown = pen.getTransform().transformPoint(new DOMPoint(0, -84));
  pen.restore();
  if (fly) { wing(true); }
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
  return {seat: [x - 30 * size * face, y - (300 + bob) * size], head: [crown.x, crown.y]};
}

// ---------- the creature with four ears and five eyes ----------
// Its outline as points: from "start", along cubic curves [c1x, c1y, c2x, c2y, x, y], "steps" points each.
// "start" is [x, y]. Returns a list of [x, y]: start, then steps points for each curve. Draws nothing.
// e.g. maengOutline([0, 0], [[20, -40, 80, -40, 100, 0]], 12)   // 13 points
function maengOutline(start, curves, steps) {
  var points = [start], at = start;
  curves.forEach(function (c) {
    for (var n = 1; n <= steps; n++) {
      var u = n / steps, v = 1 - u;
      points.push([v * v * v * at[0] + 3 * v * v * u * c[0] + 3 * v * u * u * c[2] + u * u * u * c[4],
                   v * v * v * at[1] + 3 * v * v * u * c[1] + 3 * v * u * u * c[3] + u * u * u * c[5]]);
    }
    at = [c[4], c[5]];
  });
  return points;
}

// The outline as a path; with "shag" each stretch of it bows out from "middle" a little, a tuft of fur.
// "points" as maengOutline() gives them; "shag" 0 (straight) to about 1, a tuft then about 7 to 11 pixels;
// "middle" [x, y], the point the tufts bow away from; "seed" any number, so two outlines tuft apart.
// Returns nothing: it makes a closed path on pen (pen.beginPath() first) and neither fills nor strokes it.
// e.g. maengPath(body, 0.45, [0, -154], seed); shape("#46424c");
function maengPath(points, shag, middle, seed) {
  pen.beginPath();
  pen.moveTo(points[0][0], points[0][1]);
  for (var n = 1; n < points.length; n++) {
    var a = points[n - 1], b = points[n];
    if (!shag) { pen.lineTo(b[0], b[1]); continue; }
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ox = mx - middle[0], oy = my - middle[1], far = Math.sqrt(ox * ox + oy * oy) || 1;
    var out = shag * (7 + 4 * Math.sin(n * 2.3 + seed));
    pen.quadraticCurveTo(mx + ox / far * out, my + oy / far * out, b[0], b[1]);
  }
  pen.closePath();
}

// A paw too big for it, at the ankle (ax, ay): broad, with four long pale claws hooked down to the ground.
// "skin" is the fur's colour. It is the "foot" beastLegs() is given (the other arguments it passes are not
// used). Returns nothing: it draws with pen; pen's frame is kept.
// e.g. maengPaw(92, -12, "#46424c")
function maengPaw(ax, ay, skin) {
  pen.save();
  pen.translate(ax, ay);
  pen.scale(1.7, 1.7);
  pen.translate(6, -4.2);
  pen.beginPath();
  pen.ellipse(6, 2, 26, 13, 0, 0, 7);
  shape(skin);
  pen.fillStyle = "#efe6d2";
  pen.strokeStyle = inkFor("#efe6d2");
  pen.lineWidth = 1.2 * FINE;
  for (var claw = 0; claw < 4; claw++) {
    var cx = -8 + claw * 10;
    pen.beginPath();
    pen.moveTo(cx - 2, 4);                          // thick at the root, hooked down to a tip that rests on the ground
    pen.quadraticCurveTo(cx + 12.5, -1, cx + 16, 15);
    pen.quadraticCurveTo(cx + 9, 9, cx + 5, 13);
    pen.closePath();
    pen.fill();
    pen.stroke();
  }
  pen.restore();
}

// One of its eyes, about (x, y), r across: the carved ring, the white, a green iris, the pupil and a light. A
// feeling (e, from creatureFeel()) brings the lid down, low at the corner by the nose in anger, at the outer
// corner in sadness; shut, or laughing, the eye is a line, bowed up in a laugh. "glow" lights the iris and the
// air about it. "gaze" [-1 to 1, -1 to 1] is where it looks: [0, 0] out at the viewer, 1 to the eye's edge.
// e must be given (an object with lid, wide, slant, bowed: creatureFeel()'s, or maengSiHuHaTa()'s calm one);
// "c" the colours: c.eyes the iris, c.fur and c.lit the skin round it; "shut" true for a blink; "glow" 0 to 1;
// gaze null looks straight out. r and (x, y) are in pixels of pen's frame (the head's own).
// Returns nothing: it draws with pen.
// e.g. maengEye(0, -54, 14.4, e, {fur: "#46424c", lit: "#6a6672", eyes: "#7cc25a"}, false, 0.5, [0.3, 0])
function maengEye(x, y, r, e, c, shut, glow, gaze) {
  var gx = gaze ? gaze[0] * r * 0.36 : 0, gy = gaze ? gaze[1] * r * 0.3 : 0;
  var closed = Math.max(e.lid, shut ? 1 : 0), ry = r * e.wide, inward = x < -1 ? 1 : x > 1 ? -1 : 0;
  pen.save();
  pen.translate(x, y);
  if (glow > 0.01) {
    var halo = pen.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.6);
    halo.addColorStop(0, "rgba(214, 255, 120, " + (0.55 * glow).toFixed(3) + ")");
    halo.addColorStop(1, "rgba(214, 255, 120, 0)");
    pen.fillStyle = halo;
    pen.fillRect(-r * 2.6, -r * 2.6, r * 5.2, r * 5.2);
  }
  pen.beginPath();
  pen.arc(0, 0, r + 4.5, 0, 7);
  pen.fillStyle = blend(c.fur, "#000000", 0.35);
  pen.fill();
  pen.strokeStyle = inkFor(c.fur);
  pen.lineCap = "round";
  if (closed > 0.9 || (e.bowed && closed > 0.5)) {   // shut: the lid in the fur's colour, and a line across it
    pen.beginPath();
    pen.arc(0, 0, r, 0, 7);
    pen.fillStyle = c.lit;
    pen.fill();
    pen.lineWidth = Math.max(1.8, r * 0.3) * FINE;
    pen.beginPath();
    pen.moveTo(-r, 0);
    pen.quadraticCurveTo(0, (e.bowed ? -1.1 : 0.8) * r, r, 0);
    pen.stroke();
    pen.restore();
    return;
  }
  var ball = new Path2D();
  ball.ellipse(0, 0, r, ry, 0, 0, Math.PI * 2);
  pen.fillStyle = "#fbf6e8";
  pen.fill(ball);
  pen.save();
  pen.clip(ball);
  [[gx, 1 + gy, 0.66, blend(c.eyes, "#e6ff8a", glow)], [gx * 1.15, 1.5 + gy * 1.15, 0.34, "#16131a"],
   [-0.28 * r + gx * 0.4, -0.26 * ry + gy * 0.4, 0.2, "#ffffff"]].forEach(function (dot) {
    pen.beginPath();                                // the iris, the pupil and the light, filled with no line round them
    pen.ellipse(dot[0], dot[1], r * dot[2], (dot[3] === "#ffffff" ? r : ry) * dot[2], 0, 0, 7);
    pen.fillStyle = dot[3];
    pen.fill();
  });
  var a = Math.max(0, e.slant), sad = Math.max(0, -e.slant), base = -ry + 2 * ry * 0.9 * closed;
  var near = base + ry * (1.3 * a + 0.3 * sad), outer = base + ry * (1.1 * sad + 0.2 * a);
  if (closed > 0.02 || a > 0.02 || sad > 0.02) {   // the lid, in the fur's colour, down to a line
    var left = inward > 0 ? outer : inward < 0 ? near : (near + outer) / 2, right = inward > 0 ? near : inward < 0 ? outer : (near + outer) / 2;
    pen.beginPath();
    pen.moveTo(-r * 1.2, -ry * 1.3);
    pen.lineTo(r * 1.2, -ry * 1.3);
    pen.lineTo(r * 1.2, right);
    pen.lineTo(-r * 1.2, left);
    pen.closePath();
    pen.fillStyle = c.fur;
    pen.fill();
    pen.lineWidth = Math.max(1.4, ry * 0.26) * FINE;
    pen.stroke();
  }
  pen.restore();
  pen.lineWidth = Math.max(1.2, r * 0.14) * FINE;
  pen.stroke(ball);
  pen.restore();
}

// The face, turned to the viewer, about its middle: 172 across the cheeks. "open" is how far the jaw has dropped;
// e the feeling (creatureFeel()).
//   c      the colours, {fur, lit, eyes}, as maengSiHuHaTa() makes them
//   e      must be given (ears, grin, lid, wide, slant, bowed are read)
//   open   0 to 1; shut true for a blink of all five; glow 0 to 1
//   seed   any number, for the fur's tufts
//   wake   0 to 5: how many eyes are open (MAENG_EYES gives the order)
//   eyes   what maengEyes() gives, one for each eye; null: all five have e
//          and look straight out
// Returns nothing: it draws with pen about (0, 0).
// e.g. maengFace(c, e, 0.3, false, 0, 1, 5, null)   // c and e as maengSiHuHaTa() makes them
function maengFace(c, e, open, shut, glow, seed, wake, eyes) {
  var ears = e.ears, low = Math.max(0, -ears) * 14, up = Math.max(0, ears) * 6, flat = 1 - 0.3 * Math.max(0, -ears);
  [[-50, -70, 23], [50, -70, 23], [-80, -34, 20], [80, -34, 20]].forEach(function (one) {   // the four round ears, behind the head
    pen.save();
    pen.translate(one[0] * (1 + 0.08 * Math.max(0, -ears)), one[1] + low - up);
    pen.scale(1, flat);                             // in fear and sadness they lie back, low and flat
    pen.beginPath();
    pen.arc(0, 0, one[2], 0, 7);
    shape(c.fur);
    pen.beginPath();
    pen.arc(one[0] * 0.02, 2, one[2] * 0.56, 0, 7);
    pen.fillStyle = blend(c.fur, "#c99a9a", 0.35);
    pen.fill();
    pen.restore();
  });
  var head = maengOutline([0, -80], [[52, -80, 88, -50, 86, -8], [86, 38, 54, 74, 0, 74],
                                     [-54, 74, -86, 38, -86, -8], [-88, -50, -52, -80, 0, -80]], 10);
  maengPath(head, 0.45, [0, -6], seed + 3);
  shape(c.fur);
  pen.save();                                       // the light from the upper left, and the pale snout
  maengPath(head, 0, [0, 0], 0);
  pen.clip();
  var light = pen.createRadialGradient(-34, -46, 6, -20, -20, 110);
  light.addColorStop(0, c.lit);
  light.addColorStop(1, c.fur);
  pen.fillStyle = light;
  pen.fillRect(-100, -100, 200, 190);
  pen.beginPath();
  pen.ellipse(0, 38, 66, 40, 0, 0, 7);
  pen.fillStyle = blend(c.lit, "#9a8f86", 0.45);
  pen.fill();
  pen.restore();
  MAENG_EYES.forEach(function (one, n) {             // the five eyes, as the points of a star; the order they open in
    var own = eyes ? eyes[n].e : e, lid = Math.max(1 - clamp(wake - one[2]), eyes ? eyes[n].narrow : 0);   // shut until its turn, then opening
    maengEye(one[0], one[1], 14.4, lid > 0 ? Object.assign({}, own, {lid: Math.max(own.lid, lid)}) : own, c, shut || lid >= 1, glow,
             eyes ? maengGaze(one, eyes[n]) : null);
  });
  pen.beginPath();                                  // the nose: a small rounded triangle
  pen.moveTo(-11, 13);
  pen.quadraticCurveTo(0, 8, 11, 13);
  pen.quadraticCurveTo(4, 25, 0, 26);
  pen.quadraticCurveTo(-4, 25, -11, 13);
  shape("#221e24");
  // The grin, from cheek to cheek. A smile lifts its corners, a frown or fear draws it in and drops them, and the
  // jaw drops "open": the lower lip, the tongue and the tusks with it.
  var g = e.grin, wide = 64 * mix(0.72, 1, clamp(g + 0.6)), corner = 26 + 16 * Math.max(0, -g) - 6 * Math.max(0, g);
  var drop = 64 * open, lip = 50 - 8 * Math.max(0, g);
  pen.beginPath();
  pen.moveTo(-wide, corner);
  pen.quadraticCurveTo(0, 104 + drop, wide, corner);
  pen.quadraticCurveTo(0, lip, -wide, corner);
  pen.closePath();
  pen.fillStyle = "#6a2a2a";
  pen.fill();
  pen.save();
  pen.clip();
  oval(0, 62 + drop * 0.75, 26, 11, "#c2575a");     // the tongue, low in the mouth
  pen.fillStyle = "#f6efdc";
  for (var tooth = -5; tooth <= 5; tooth++) {       // a row of small blunt teeth under the upper lip
    var tx = tooth * 10 * wide / 64;
    pen.fillRect(tx - 4, mix(corner, lip, 1 - Math.pow(tx / wide, 2)) * 0.5 + corner * 0.5 - 2, 8, 10);
  }
  pen.restore();
  pen.strokeStyle = inkFor(c.lit);
  pen.lineWidth = 2 * FINE;
  pen.lineJoin = "round";
  pen.stroke();
  [-1, 1].forEach(function (side) {                 // the two great tusks, from the lower jaw, curving up and out past the lip
    pen.save();
    pen.scale(side, 1);
    pen.translate(wide - 64, drop * 0.7);
    pen.beginPath();
    pen.moveTo(34, 62);
    pen.quadraticCurveTo(62, 46, 66, 0);
    pen.quadraticCurveTo(50, 34, 22, 56);
    pen.closePath();
    shape("#f4ead2", 1.6 * FINE);
    pen.restore();
  });
}

// The creature with four ears and five eyes, standing on (x, y), its body side on and its face turned to the
// viewer: see the top of this file. 470 long and 290 high at size 1. It walks (step, as amble() gives it), blinks,
// feels (feel), opens its jaw (mouth, 0 to 1), lights its eyes (glow) and opens them one by one (wake). Gives
// back {head, mouth, paw, shin, neck}, points of the scene: the middle of its face; of its mouth, where an ember
// goes in; its near fore paw on the ground; that leg just over the paw, [x, y, wide, lean], where a snare holds it;
// and its neck under the head, where a vine is tied.
// ---------- its eyes, each its own ----------
// Where the five are on its face (the head's own pixels) and the order they open in: the top, the two upper, the
// two lower, as the points of a star.
var MAENG_EYES = [[0, -54, 4], [-41, -31, 2], [41, -31, 3], [-21, -6, 0], [21, -6, 1]];
var MAENG_EYE_TURN = 10;                           // seconds before the staring eye and the wandering one change to others
// The second feeling, of the two eyes that do not share the creature's own: wary, or the feeling's neighbour.
var MAENG_EYE_FEEL = {neutral: "concerned", happy: "surprised", laughing: "happy", sad: "concerned", concerned: "fear",
                      angry: "concerned", sleepy: "neutral", satiated: "sleepy", surprised: "happy", fear: "concerned"};

// A number from 0 to 1 that stays the same for the same whole number n (the kit's dice()): the creature's
// own choices, made again the same in every frame.
// e.g. maengHash(12)
function maengHash(n) { return dice(Math.floor(n) * 7.31 + 3.7); }

// What each of its five eyes does at second t, as a list of {role, e, narrow, look}: three watch the nearest one
// in the frame (SIGHTS, oldcartoon.js), one stares out at the viewer and then scans slowly from side to side,
// narrowed in suspicion, and one wanders; every MAENG_EYE_TURN seconds the staring one and the wandering one
// change to two others. Three eyes, chosen once for this creature, have its own feeling and the other two a
// second (look.eyeFeel, or MAENG_EYE_FEEL's). From the second alone, as everything in a frame is.
//   look   the creature's look (id, feel, eyeFeel and the feeling's numbers are read)
//   at     the creature's own time in seconds, for the second feeling (the turns go by the film's clock)
//   own    the creature's own feeling, as creatureFeel() gives it
// Returns five {role: "watch", "stare" or "wander", e: a feeling, narrow: 0 to 1, look: [x, y] or null (a
// watcher: maengGaze() finds where)}, in the order of MAENG_EYES. Draws nothing.
// e.g. maengEyes({feel: "happy"}, clock, creatureFeel({feel: "happy"}, clock))
function maengEyes(look, at, own) {
  var id = 0, key = look.id || "maeng", n;
  for (n = 0; n < key.length; n++) { id = (id * 31 + key.charCodeAt(n)) % 997; }
  var order = [0, 1, 2, 3, 4].sort(function (a, b) { return maengHash(id + a * 11) - maengHash(id + b * 11); });
  var second = look.eyeFeel || MAENG_EYE_FEEL[FEELING_WAS[look.feel] || look.feel || "neutral"] || "concerned";
  var other = creatureFeel(Object.assign({}, look, {feel: second}), at, (own.key || "maeng") + "/second");   // eased under a name of its own
  var turn = Math.floor(clock / MAENG_EYE_TURN), stare = Math.floor(maengHash(turn * 13 + id) * 5);
  var wander = (stare + 1 + Math.floor(maengHash(turn * 17 + id + 5) * 4)) % 5, into = clock - turn * MAENG_EYE_TURN;
  return MAENG_EYES.map(function (place, k) {
    var e = order.indexOf(k) < 3 ? own : other;
    if (k === stare) {                               // out at the viewer, then scanning slowly side to side, narrowed
      var scan = between(into, 4, 5) * Math.sin((into - 4) * Math.PI * 2 / 6);
      return {role: "stare", e: e, narrow: 0.15 + 0.2 * between(into, 3.5, 4.5), look: [0.95 * scan, 0]};
    }
    if (k === wander) {                              // aimless: slow and never the same way twice
      var p = k * 1.7 + id;
      return {role: "wander", e: e, narrow: 0, look: [0.85 * Math.sin(clock * 0.41 + p) * Math.cos(clock * 0.17 + p * 2),
                                                      0.7 * Math.sin(clock * 0.29 + p * 3)]};
    }
    return {role: "watch", e: e, narrow: 0, look: null};
  });
}

// Where one eye looks, in its own -1 to 1: the nearest one in the frame for a watcher (the sheet's pixels, brought
// into the head's own), straight out when there is none, or what maengEyes() gave it.
// "place" is the eye's [x, y] in the head's own pixels (a row of MAENG_EYES); "eye" one of maengEyes()'s. It
// reads pen's frame as it is now, so call it with pen in the head's frame. Returns [x, y], each -1 to 1, as
// maengEye() takes "gaze". Draws nothing.
// e.g. maengGaze(MAENG_EYES[0], eyes[0])   // eyes from maengEyes()
function maengGaze(place, eye) {
  if (eye.look) { return eye.look; }
  var m = pen.getTransform(), here = m.transformPoint(new DOMPoint(place[0], place[1])), best = null, far = Infinity;
  sightsNow().forEach(function (one) {
    if (one[0] < 0 || one[1] < 0 || one[0] > pen.canvas.width || one[1] > pen.canvas.height) { return; }   // off the sheet
    var d = Math.hypot(one[0] - here.x, one[1] - here.y);
    if (d < far) { far = d; best = one; }
  });
  if (!best) { return [0, 0.1]; }
  var there = m.inverse().transformPoint(new DOMPoint(best[0], best[1])), dx = there.x - place[0], dy = there.y - place[1];
  var long = Math.hypot(dx, dy) || 1, reach = Math.min(1, long / 60);
  return [dx / long * reach, dy / long * reach * 0.8];
}

// maengSiHuHaTa(x, y, look): the creature with four ears and five eyes (described above, before "its eyes").
//   x, y   the ground under its middle, in pixels of the sheet
//   look   an object, never left out ({} gives the dark grey creature standing, size 1, facing right, five eyes
//          open and watching): it reads size, face, colour, eyes, step, mouth, glow, wake, watch, eyeFeel, id,
//          feel (MYTH_KEYS above)
// Returns {head, mouth, paw, shin, neck}, each [x, y] (shin [x, y, wide, lean], as snare()'s look.caught takes it),
// points of the sheet. It draws with pen at the film's clock;
// it sets FINE and LINE while it draws and leaves them at 1 and STYLE.line. Its watching eyes look at what
// the film has drawn in the frame (sightsNow() in the kit).
// e.g. var m = maengSiHuHaTa(700, GROUND, {size: 0.9, glow: 0.6, wake: 3.5, feel: "happy"});
function maengSiHuHaTa(x, y, look) {
  checkNames("The name of the creature with four ears and five eyes", look, MYTH_KEYS);
  var size = (look.size || 1) * GAITS.maengSiHuHaTa[0], face = look.face || 1, seed = x * 0.013;
  var c = {fur: look.colour || "#46424c", eyes: look.eyes || "#7cc25a"};
  c.lit = blend(c.fur, "#a8a0b4", 0.3);
  var e = look.feel !== undefined ? creatureFeel(look, clock + seed)
                                  : {lid: 0, bowed: false, slant: 0, wide: 1, grin: 0.5, ears: 0, raise: 0, wag: 0, startle: 0};
  var open = clamp(look.mouth || 0), glow = clamp(look.glow || 0), blink = Math.sin(clock * 0.8 + seed) > 0.97;
  if (e.jaw) { open = e.jaw(open); }
  FINE = Math.min(1, Math.pow(Math.max(0.5, size), -0.7));
  LINE = STYLE.line * FINE / Math.max(0.45, Math.min(1, size * 1.3));
  var legY = -88, top = -220, headAt = [152, top + 23 - 4 * e.raise];
  pen.fillStyle = "rgba(60, 40, 30, 0.22)";          // its shadow on the ground
  pen.beginPath();
  pen.ellipse(x, y + 4 * size, 215 * size, 17 * size, 0, 0, 7);
  pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  var hind = [[-130, legY, 0, -1, false], [-106, legY - 4, 0.5, -1, true]];
  var fore = [[92, legY, 0.25, 1, false], [117, legY - 4, 0.75, 1, true]];
  var shin = null;                                  // the near fore leg just over its paw, where a snare's noose holds it
  function legs(far) {
    var skin = far ? blend(c.fur, "#1c1c22", 0.2) : c.fur;
    beastLegs(hind, far, look, [46, 42, 12], [34, 27, 21], skin, GAITS.maengSiHuHaTa[1], 16, maengPaw);
    beastLegs(fore, far, look, [46, 42, 12], [34, 27, 21], skin, GAITS.maengSiHuHaTa[1], 16, far ? maengPaw : function (ax, ay, skin, lifted, kx, ky) {
      shin = [mix(ax, kx, 0.62), mix(ay, ky, 0.62), Math.atan2(ky - ay, kx - ax)];   // above the paw's top (it is 26 high at the ankle)
      maengPaw(ax, ay, skin);
    });
  }
  legs(true);
  var bob = look.step !== undefined ? 2.5 * Math.abs(Math.sin(look.step * Math.PI * 2)) : 0;
  pen.translate(0, -bob - 10 * e.startle);
  pen.save();                                       // a short tail, that wags
  pen.translate(-200, -150);
  pen.rotate(-0.5 + 0.35 * e.wag * Math.sin(clock * 14));
  pen.beginPath();
  pen.ellipse(0, 0, 18, 13, 0, 0, 7);
  shape(c.fur);
  pen.restore();
  var body = maengOutline([-194, -118], [[-205, top + 10, -110, top - 4, -22, top], [66, top + 2, 154, top + 6, 174, -140],
                                         [187, -96, 143, legY + 14, 77, legY + 10], [11, legY + 22, -99, legY + 22, -154, legY + 12],
                                         [-187, legY + 4, -194, -100, -194, -118]], 12);
  maengPath(body, 0.45, [0, (top + legY) / 2], seed);
  shape(c.fur);
  pen.save();
  maengPath(body, 0, [0, 0], 0);
  pen.clip();
  var sheen = pen.createLinearGradient(0, top, 0, legY + 20);   // lit from above, darker under the belly
  sheen.addColorStop(0, c.lit);
  sheen.addColorStop(0.55, c.fur);
  sheen.addColorStop(1, blend(c.fur, "#000000", 0.25));
  pen.fillStyle = sheen;
  pen.fillRect(-240, top - 20, 480, legY - top + 60);
  pen.strokeStyle = blend(c.fur, "#000000", 0.3);   // strokes of fur down the flank
  pen.lineWidth = 2 * FINE;
  for (var s = 0; s < 14; s++) {
    var sx = -165 + s * 24, sy = top + 30 + 18 * Math.sin(s * 1.7);
    pen.beginPath();
    pen.moveTo(sx, sy);
    pen.quadraticCurveTo(sx - 6, sy + 24, sx - 2, sy + 44);
    pen.stroke();
  }
  pen.restore();
  legs(false);
  pen.save();                                       // the head on the shoulders, turned to the viewer
  pen.translate(headAt[0], headAt[1]);
  pen.scale(1.24, 1.24);
  maengFace(c, e, open, blink, glow, seed, look.wake === undefined ? 5 : look.wake,
            look.watch === false ? null : maengEyes(look, clock + seed, e));
  pen.restore();
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
  var lift = bob + 10 * e.startle;
  return {head: [x + headAt[0] * size * face, y + (headAt[1] - lift) * size],
          mouth: [x + headAt[0] * size * face, y + (headAt[1] + 1.24 * (44 + 40 * open) - lift) * size],
          paw: [x + 92 * size * face, y - 6 * size],                    // the near fore paw, on the ground
          shin: [x + shin[0] * size * face, y + (shin[1] - lift) * size,   // the near fore leg over its paw, as it is now (it steps):
                 49 * size, Math.atan2(Math.sin(shin[2]), Math.cos(shin[2]) * face)],   // its middle, how wide it is there, which way it runs up
          neck: [x + 110 * size * face, y + (-110 - lift) * size]};      // under its head, where a vine is tied
}

// ---------- Chang Ngu, the snake-elephant of Chiang Saen ----------
// Chang Ngu (ช้างงู). In the tale (ตำนานช้างงู; the Lanna Folktales tellings of Chang Ngu and of Phra Chao Phrom
// Maharat), the third giant snake of the Mekong becomes a white elephant when Prince Phrom grabs its neck, carries
// him to win back Chiang Saen from the Khom, and at the end walks into a ravine and becomes a snake again: the
// mountain is still called Doi Chang Ngu (Doi Sa-ngop, Si Don Mun, Chiang Saen). Chiang Saen keeps it as a statue
// at the roundabout before the town, "ลำตัวเป็นงู หัวเป็นช้าง ๓ เศียร" (a snake's body, three elephant heads;
// m-culture.in.th, Chiang Rai). No photograph of the statue was looked at; it is built the kit's way:
//   1. The Naga's body and its fan of necks (naga.js: nagaLine, nagaStrip, the same S and loop).
//   2. On each neck, the kit's own elephant's head (beasts.js), its ear over the place where the neck goes in.
//   3. Heads and body one colour, white, with gold scales' edges, belly and spikes, as a temple statue is
//      painted. The owner chose this of three, 2026-10-22, and asked for the heads in the body's colour.
// The names its look may have (changNgu() warns about any other):
//   size     how large it is drawn: 1 is about 750 across and 560 high, as the Naga
//   face     1 looks right, -1 left
//   heads    how many heads: 1, 3 or 5 (3 unless told)
//   body     the colour of its scales and of its elephant heads (white unless told)
//   belly, bars, crest   as the Naga's: the belly band, its bars, the spikes
//   trunk    0 to 1: how far the trunks are raised (they swing a little unless told)
var CHANG_NGU_KEYS = {};

["size", "face", "heads", "body", "belly", "bars", "crest", "trunk"].forEach(function (name) { CHANG_NGU_KEYS[name] = true; });

// One of Chang Ngu's heads: the kit's elephant() with only its head drawn (only: "head"), the neck's top at the
// pen's (0, 0). At size 1 the head of elephant(0, 0) runs from x 130 to 720 and y -820 to -40, and the back of its
// head behind the ear, where the neck goes in, is at about (230, -560). Until 2026-10-27 the whole elephant was
// drawn and cut to its head by a clip, whose corner cut a step into the jaw and whose top and side cut off a
// lifted trunk (the owner: "a right angle cut out of them near the jaw", "the trunks get cut off").
// skin: the colour; s: the size of the head (0.52 on Chang Ngu's necks); trunk: 0 to 1.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. changNguHead("#efe6d6", 0.52, 0.3);
function changNguHead(skin, s, trunk) {
  pen.save();
  pen.scale(s, s);
  pen.translate(-230, 560);
  elephant(0, 0, {size: 1, face: 1, colour: skin, trunk: trunk, ground: false, only: "head"});
  pen.restore();
}

// changNgu(x, y, look): Chang Ngu, the snake-elephant (described above), its chest standing on (x, y).
//   x, y   where the chest stands, pixels of the sheet, as the Naga's
//   look   an object, never left out ({} gives the white three-headed Chang Ngu, size 1, facing right): its keys
//          are CHANG_NGU_KEYS above
// Returns nothing: it draws with pen at the film's clock (the body waves, the heads sway one after another). It
// sets FINE and LINE while it draws and leaves them at 1 and STYLE.line.
// e.g. changNgu(900, 960, {size: 0.62, face: -1});
function changNgu(x, y, look) {
  checkNames("Chang Ngu's name", look, CHANG_NGU_KEYS);
  var size = look.size || 1, face = look.face || 1, count = look.heads || 3, skin = look.body || "#efe6d6";
  var c = {body: skin, belly: look.belly || "#e6c86a", bars: look.bars || "#b8892a", crest: look.crest || "#d9a83a",
           fire: "#c8382c"};
  FINE = Math.min(1, Math.pow(size, -0.7));
  LINE = STYLE.line * FINE;
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  pen.fillStyle = "rgba(70, 45, 30, 0.2)";          // a soft shadow under the chest and the first bend
  pen.beginPath();
  pen.ellipse(-70, 26, 150, 14, 0, 0, 7);
  pen.fill();
  var middle = nagaLine(NAGA_PATH, 9), body = [], n;
  for (n = 0; n < middle.length; n++) {             // the wave down the body, the tail swinging most
    var u = n / (middle.length - 1), a = middle[Math.max(0, n - 1)], b = middle[Math.min(middle.length - 1, n + 1)];
    var far = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, swing = 13 * Math.pow(u, 1.3) * Math.sin(u * 16 - clock * 2.4);
    body.push([middle[n][0] - (b[1] - a[1]) / far * swing, middle[n][1] + (b[0] - a[0]) / far * swing]);
  }
  nagaStrip(body, function (v) { return mix(41, 11, Math.pow(v, 0.8)); }, c, [0.045, 0.2, -0.33, 0.47, -0.6, 0.74]);
  var hub = body[0];
  for (var head = 0; head < count; head++) {        // the necks fan out of the chest, as the Naga's do
    var place = count === 1 ? 0 : head / (count - 1) * 2 - 1;
    var lean = count === 1 ? 0.3 : 0.05 + place * 0.8;
    var long = 290 - 60 * Math.pow(Math.abs(place), 1.5);
    var sway = Math.sin(clock * 1.3 + head * 1.1);
    var top = [hub[0] + Math.sin(lean) * long + 7 * sway, hub[1] - Math.cos(lean) * long + 5 * Math.sin(clock * 1.7 + head)];
    var foot = [hub[0] + place * 15, hub[1] + 30], dense = [];
    for (n = 0; n <= 24; n++) {                     // from the head down into the chest
      var t = n / 24, w = 1 - t;
      var c1 = [top[0] - 0.42 * long, top[1] + 0.1 * long];
      var c2 = [foot[0] + Math.sin(lean * 0.6) * long * 0.5, foot[1] - Math.cos(lean * 0.6) * long * 0.5];
      dense.push([w * w * w * top[0] + 3 * w * w * t * c1[0] + 3 * w * t * t * c2[0] + t * t * t * foot[0],
                  w * w * w * top[1] + 3 * w * w * t * c1[1] + 3 * w * t * t * c2[1] + t * t * t * foot[1]]);
    }
    nagaStrip(nagaWalk(dense, 9), function (v) { return mix(16, 26, v); }, c, [0.14]);
    pen.save();
    pen.translate(top[0] - 12, top[1] + 8);
    pen.rotate(-0.08 + 0.04 * sway);
    changNguHead(skin, 0.52, look.trunk !== undefined ? clamp(look.trunk) : 0.25 + 0.2 * Math.sin(clock + head));
    pen.restore();
    FINE = Math.min(1, Math.pow(size, -0.7));       // elephant() puts them back to 1 when it is done
    LINE = STYLE.line * FINE;
  }
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
}
