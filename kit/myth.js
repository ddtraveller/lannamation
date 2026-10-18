// myth.js - three creatures of the myths of Lanna, the north of Thailand, for
// films made with oldcartoon.js: the Mom, the Luang and the Hatsadiling
// bird. They stand on the beasts' legs and the Naga's body, so load it after
// both:
//
//     <script src="oldcartoon.js"></script>
//     <script src="naga.js"></script>
//     <script src="beasts.js"></script>
//     <script src="myth.js"></script>
//
// and call mom(x, y, look), luang(x, y, look) or hatsadiling(x, y, look)
// from a scene.
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
//              jaw and the head's carriage (the Mom's and the Luang's)
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
var MYTH_KEYS = {};

["size", "face", "late", "mouth", "colour", "gold", "belly", "step", "eyes", "trail", "depth", "sing", "horns", "wings", "fly", "head", "trunk", "feel"
].forEach(function (name) { MYTH_KEYS[name] = true; });

// How the two that walk do it, for amble() of beasts.js: [how large it is
// drawn, how far a foot goes back along the ground in one stride, how many
// beats a stride takes].
GAITS.mom = [0.9, 70, 2];
GAITS.hatsadiling = [1, 90, 2];

// Scales, inside the shape that "shapeOf" makes: rows of small round scales,
// each row sitting between the scales of the row above, their round edges
// downward. They are all one colour and one stroke.
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
// tip is bent to one side.
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
// joint points forward and -1 for one whose joint points back.
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
function hatsadiling(x, y, look) {
  checkNames("The bird's name", look, MYTH_KEYS);
  var size = (look.size || 1) * GAITS.hatsadiling[0], face = look.face || 1, seed = x * 0.011, n, k;
  var c = {body: look.colour || "#2f6f9a", belly: look.belly || "#bfe0e6", crest: look.gold || "#e0b23a", fire: "#d8423a",
           head: look.head || "#27305a", wing: look.wings || "#d8423a"};
  var ink = inkFor(c.body), edge = blend(c.crest, c.body, 0.35), fly = !!look.fly;
  var walk = look.step !== undefined && !fly, bob = walk ? 5 * Math.abs(Math.sin(look.step * Math.PI * 2)) : fly ? 10 * Math.sin(clock * 6) : 0;
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0, lift = clamp(look.trunk || 0);
  var flap = fly ? Math.sin(clock * 6) : 0;
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
  pen.rotate(nodding - 0.12 * lift);
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
  elephantEye(dusk === INK ? "#f6dc8a" : blend(c.head, "#ffffff", 0.55), blink);
  pen.restore();
  var crown = pen.getTransform().transformPoint(new DOMPoint(0, -84));
  pen.restore();
  if (fly) { wing(true); }
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
  return {seat: [x - 30 * size * face, y - (300 + bob) * size], head: [crown.x, crown.y]};
}
