// northbirds.js - five birds of the north of Thailand, for the Lanna cartoon kit.
// Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="northbirds.js"></script>
//
// and call each from a scene, as the kit's rooster() is called: (x, y) is where
// its feet are, or, for one in flight, the middle of its body; t is the second;
// look holds what it does, and a name the bird does not know is warned of.
//
//   peafowl(x, y, t, look)      the green peafowl: walks, pecks, calls, and raises its train into a fan and shivers it
//   pheasant(x, y, t, look)     Mrs Hume's pheasant: walks and pecks, its long barred tail swaying; or the brown hen
//   sunbird(x, y, t, look)      the green-tailed sunbird: perches, hovers on blurred wings, sips from a flower
//   blueMagpie(x, y, t, look)   the red-billed blue magpie: perches and flicks its long tail; flies, beating and gliding
//   hornbill(x, y, t, look)     the great hornbill: perches and turns its head; flies on slow, heavy wings
//
// Why these five (each said in its own words below, with its source): the
// green peafowl's largest known mainland population is in Phayao; Mrs Hume's
// pheasant lives in Thailand only in the far north, and birders go to Doi
// Chiang Dao to see it; the green-tailed sunbird has a form of its own,
// angkanensis, named from Doi Inthanon; the red-billed blue magpie goes in
// small parties through the hill forests; and the great hornbill, gone
// from the northern wild for more than twenty years, is being brought home:
// two were set free in Lampang's Chae Son National Park, two on Doi Chiang
// Dao. Each is drawn from rules read from photographs on Wikimedia Commons
// under free licences, kept with their credits outside the repository;
// nothing of them is copied.
//
// At size 1 a bird is as large as it would be beside the cast at their own
// sizes: a peafowl's head stands about 250 high, a sunbird is about 36 long.
// The kit's rules for its drawing hold: a fine line round each shape, darker
// than what it holds, and colour that changes inside a shape and nowhere else.

var PEAFOWL_KEYS = {}, PHEASANT_KEYS = {}, SUNBIRD_KEYS = {}, MAGPIE_KEYS = {}, HORNBILL_KEYS = {};
["size", "face", "step", "peck", "display", "shiver", "call", "feel"].forEach(function (n) { PEAFOWL_KEYS[n] = true; });
["size", "face", "step", "peck", "hen", "feel"].forEach(function (n) { PHEASANT_KEYS[n] = true; });
["size", "face", "hover", "sip", "feel"].forEach(function (n) { SUNBIRD_KEYS[n] = true; });
["size", "face", "fly", "bob", "feel"].forEach(function (n) { MAGPIE_KEYS[n] = true; });
["size", "face", "fly", "turn", "feel"].forEach(function (n) { HORNBILL_KEYS[n] = true; });
// Every bird also takes feel, a feeling as a person's (creatureFeel() in the kit): its eye shuts, bows or
// slants under a lid of its head's colour; the peafowl's and the pheasant's heads are carried high or low
// and the peafowl's bill opens. A bird's eye is small: at a film's sizes it shows most in the head and the bill.

// A bird's eye at (x, y), r across: the dot it always was, or with a feeling (e), a small eye of that colour
// under a lid of the head's colour ("skin").
function nbEye(x, y, r, colour, e, skin) {
  if (!e) {
    nbOval(x, y, r, r);
    nbFill(colour);
    return;
  }
  creatureEye(x, y, r * 1.35, r * 1.35, e, {ball: colour, skin: skin, ink: inkFor(skin)});
}

// ---------- shared ----------

function nbBegin(x, y, look, fine) {               // the pen at the bird, facing its way, at its size; "fine", a thinner pen for a small bird
  var size = look.size || 1, keep = LINE;
  pen.save();
  pen.translate(x, y);
  pen.scale(size * (look.face || 1), size);
  pen.lineCap = "round";
  pen.lineJoin = "round";
  LINE = STYLE.line * (fine || 1) / size;
  return keep;
}

function nbEnd(keep) {
  LINE = keep;
  light();
  pen.restore();
}

function nbPaint(colour, paint) {                   // the kit's shape(): the paint inside, and a line of the colour's own ink round it
  var ink = inkFor(colour);
  pen.fillStyle = paint || colour;
  pen.fill();
  pen.strokeStyle = ink;
  pen.lineWidth = LINE;
  heavy(ink);
  pen.stroke();
  light();
}

function nbLift(lift) {                             // a wing drawn pointing up, seen from the side as it beats: 1 up, 0 edge on, -1 down
  pen.scale(1, Math.abs(lift) < 0.08 ? (lift < 0 ? -0.08 : 0.08) : lift);
}

function nbFill(colour) { pen.fillStyle = colour; pen.fill(); }

function nbGrad(x0, y0, x1, y1, a, b) {
  var g = pen.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  return g;
}

function nbOval(cx, cy, rx, ry, turn) {
  pen.beginPath();
  pen.ellipse(cx, cy, rx, ry, turn || 0, 0, 2 * Math.PI);
}

function nbLimb(points, width, colour) {           // a leg as a hose is inked: the ink wider, then its colour
  pen.beginPath();
  points.forEach(function (p, i) { if (i) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } });
  pen.strokeStyle = inkFor(colour);
  pen.lineWidth = width + 2 * LINE;
  pen.stroke();
  pen.strokeStyle = colour;
  pen.lineWidth = width;
  pen.stroke();
}

function nbScales(rows, cols, x0, y0, dx, dy, r, colour) {   // the edges of small feathers in rows, each row set half a feather on: call inside a clip
  pen.strokeStyle = colour;
  pen.lineWidth = LINE * 0.7;
  pen.beginPath();
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cx = x0 + col * dx + (row % 2) * dx / 2, cy = y0 + row * dy;
      pen.moveTo(cx + r, cy);
      pen.arc(cx, cy, r, 0, Math.PI);
    }
  }
  pen.stroke();
}

function nbQuad(a, b, c, s) {                       // a point s of the way along a quadratic curve from a by b to c
  return [(1 - s) * (1 - s) * a[0] + 2 * (1 - s) * s * b[0] + s * s * c[0], (1 - s) * (1 - s) * a[1] + 2 * (1 - s) * s * b[1] + s * s * c[1]];
}

function nbStrip(a, b, c, w0, w1, from, to) {       // the outline of a band along a curve, w0 wide at its start and w1 at its end, from "from" to "to" of the way
  var left = [], right = [], n;
  for (n = 0; n <= 16; n++) {
    var s = mix(from, to, n / 16), p = nbQuad(a, b, c, s), q = nbQuad(a, b, c, Math.min(1, s + 0.01)), r = nbQuad(a, b, c, Math.max(0, s - 0.01));
    var dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy) || 1, w = mix(w0, w1, s) / 2;
    left.push([p[0] - dy / l * w, p[1] + dx / l * w]);
    right.push([p[0] + dy / l * w, p[1] - dx / l * w]);
  }
  pen.beginPath();
  left.forEach(function (p, i) { if (i) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } });
  for (n = right.length - 1; n >= 0; n--) { pen.lineTo(right[n][0], right[n][1]); }
  pen.closePath();
}

// ---------- the green peafowl ----------
// The green peafowl (Pavo muticus, นกยูงไทย): Thailand's own peafowl. Its largest
// known population in mainland Southeast Asia lives in the forests of Phayao, in
// four protected areas that join (Saridnirun and others, Global Ecology and
// Conservation, 2021).
// Read from photographs of the bird of Indochina (imperator):
//   1. It stands tall on long grey legs, its neck slender and upright.
//   2. Neck and breast are green, scaled: each small feather edged darker, as a
//      fish's scales are; not the smooth blue of the Indian peafowl.
//   3. On its crown a narrow upright tuft, a few thin plumes with small tips,
//      not a fan.
//   4. Its face is bare skin, yellow over the cheek and blue round the eye.
//   5. The shoulders are blue-black; the folded wing green, scaled, with a patch
//      of cinnamon where the flight feathers lie.
//   6. The train is very long and lies back along the ground, green with a
//      bronze sheen, and every feather of it ends in an eye: a dark heart, blue,
//      green, and a bronze rim.
//   7. In display it raises the train into a fan behind it and shivers it, so
//      the eyes tremble (the shiver is the train-rattling of peacocks).
// The look's names: size, face (1 right, -1 left), step (a number that grows a
// step at a time while it walks), peck (0 to 1: the head down to the ground), call
// (0 to 1: the head up, the bill open), display (0 to 1: the train from lying to
// a fan) and shiver (0 to 1: the fan rattling, while it is up).

var PEAFOWL = {neck: "#2f8f5a", neckLight: "#46a874", scale: "#1d5e48", bronze: "#c8a040", shoulder: "#2a4a8a", shoulderDeep: "#1a2a4a",
               wing: "#3d8a58", primaries: "#c8844a", crest: "#2a5a8a", crestTip: "#3f8ab0", cheek: "#f2d24a", eyeskin: "#5aa0d8", bill: "#8a8478",
               leg: "#8a8a86", quill: "#7a6a3a", vane: "#3f8a4a", eyeBlue: "#2a5ab8", eyeHeart: "#10203a"};

function peafowlEye(x, y, r, gleam) {               // rule 6: the eye at a train feather's end
  nbOval(x, y, r, r * 1.25);
  nbPaint(PEAFOWL.bronze);
  nbOval(x, y + r * 0.1, r * 0.72, r * 0.95);
  nbFill(PEAFOWL.neck);
  nbOval(x, y + r * 0.2, r * 0.46, r * 0.6);
  nbFill(blend(PEAFOWL.eyeBlue, "#9fd0ff", gleam || 0));
  nbOval(x, y + r * 0.25, r * 0.22, r * 0.3);
  nbFill(PEAFOWL.eyeHeart);
}

function peafowlFeather(base, mid, tip, eye, gleam, colour) {
  nbStrip(base, mid, tip, eye * 0.6, eye * 2.3, 0.2, 0.95);    // the vane, widening toward the eye
  pen.fillStyle = colour;
  pen.fill();
  pen.strokeStyle = inkFor(colour);
  pen.lineWidth = LINE * 0.5;
  pen.stroke();
  pen.strokeStyle = PEAFOWL.quill;                   // the shaft
  pen.lineWidth = LINE * 0.8;
  pen.beginPath();
  pen.moveTo(base[0], base[1]);
  pen.quadraticCurveTo(mid[0], mid[1], tip[0], tip[1]);
  pen.stroke();
  peafowlEye(tip[0], tip[1], eye, gleam);
}

function peafowl(x, y, t, look) {
  look = look || {};
  var mood = look.feel !== undefined ? creatureFeel(look, t) : null;   // a feeling: the eye, and where it has them the head and the bill
  checkNames("The peafowl's name", look, PEAFOWL_KEYS);
  var keep = nbBegin(x, y, look);
  var walking = look.step !== undefined, step = look.step || 0, d = clamp(look.display || 0), e = d * d * (3 - 2 * d);
  var shiver = clamp(look.shiver || 0) * e, peck = clamp(look.peck || 0), call = clamp(look.call || 0), i;
  var rump = [-52, -112], centre = [-36, -124];
  var tiers = [[1, 30, 6], [0.8, 28, 13], [0.6, 24, 14], [0.42, 18, 10]];   // rule 6: four lengths of feather, the longest laid first, so the eyes lie in rows
  tiers.forEach(function (tier, row) {
    var reach = tier[0], count = tier[1], spread = tier[2];
    for (var n = 0; n < count; n++) {                // rules 6 and 7: the train, lying or raised into a fan
      var u = (n + 0.5) / count, lie = 340 * reach, fan = 310 * reach;
      var lieTip = [rump[0] - lie * 0.96, Math.min(-8, rump[1] + lie * 0.9) - u * spread];   // lying, the tips rest on the ground, a little apart
      var lieAngle = Math.atan2(lieTip[1] - rump[1], lieTip[0] - rump[0]), lieLength = Math.hypot(lieTip[0] - rump[0], lieTip[1] - rump[1]);
      var fanAngle = Math.PI + 0.1 + (Math.PI - 0.2) * u;   // from back, through upright, to forward: the way a train rises, not through the bird
      var jitter = shiver * 0.02 * Math.sin(t * Math.PI * 2 * 22 + n * 1.7 + row);
      var a = mix(lieAngle, fanAngle, e) + jitter, length = mix(lieLength, fan, e), kx = mix(1, 0.62, e);   // the fan is seen a little from the side
      var base = [mix(rump[0], centre[0], e), mix(rump[1], centre[1], e)];
      var tip = [base[0] + Math.cos(a) * length * kx, base[1] + Math.sin(a) * length];
      var bend = [base[0] + (tip[0] - base[0]) * 0.3, tip[1] + 4];   // lying, a feather falls from the rump and runs along the ground
      var mid = [mix(bend[0], (base[0] + tip[0]) / 2, e), mix(bend[1], (base[1] + tip[1]) / 2, e)];
      peafowlFeather(base, mid, tip, mix(7, 10, e) * (0.8 + 0.2 * reach), shiver * (0.5 + 0.5 * Math.sin(t * 31 + n)), blend(PEAFOWL.vane, PEAFOWL.bronze, 0.1 + 0.12 * row));
    }
  });
  for (i = 0; i < 2; i++) {                          // rule 1: long grey legs, the heel bent back
    var swing = walking ? Math.sin(step * Math.PI * 2 + i * Math.PI) : 0, lift = Math.max(0, swing) * 10;
    var hip = -10 + i * 12, foot = hip + swing * 22;
    nbLimb([[hip, -100], [mix(hip, foot, 0.4) - 7, -52 - lift * 0.5], [foot, -4 - lift]], 6, PEAFOWL.leg);
    nbLimb([[foot - 13, -lift], [foot, -4 - lift], [foot + 15, -lift]], 3.5, PEAFOWL.leg);
  }
  pen.save();
  pen.translate(0, Math.sin(t * 2.2) * 0.8);         // breathing
  nbOval(-14, -128, 54, 31, -0.18);                  // rule 5: the body, blue-black at the shoulder
  nbPaint(PEAFOWL.shoulder, nbGrad(0, -160, 0, -98, PEAFOWL.shoulder, PEAFOWL.shoulderDeep));
  pen.beginPath();                                   // the folded wing, green and scaled
  pen.moveTo(24, -146);
  pen.bezierCurveTo(0, -158, -40, -150, -64, -122);
  pen.bezierCurveTo(-42, -104, -6, -108, 18, -122);
  pen.closePath();
  nbPaint(PEAFOWL.wing);
  pen.save();
  pen.clip();
  nbScales(9, 12, -66, -158, 8, 6, 3.5, PEAFOWL.scale);
  pen.restore();
  pen.beginPath();                                   // the cinnamon of the flight feathers
  pen.moveTo(-18, -114);
  pen.bezierCurveTo(-34, -106, -52, -108, -66, -116);
  pen.bezierCurveTo(-52, -121, -34, -122, -16, -121);
  pen.closePath();
  nbPaint(PEAFOWL.primaries);
  pen.restore();
  pen.save();                                        // the neck and head turn down to peck, up to call, about the neck's foot
  pen.translate(14, -150);
  pen.rotate(peck * 1.05 - call * 0.18 + (mood ? 0.5 * mood.nod - 0.2 * mood.raise : 0));   // and a feeling carries it high or low
  pen.translate(-14, 150);
  if (walking) { pen.translate(5 * Math.sin(step * Math.PI * 4), 0); }   // the head bobs forward and back with the steps
  pen.beginPath();                                   // rules 1 and 2: the neck, slender, green, scaled
  pen.moveTo(30, -146);
  pen.bezierCurveTo(46, -172, 30, -206, 50, -234);
  pen.lineTo(36, -242);
  pen.bezierCurveTo(16, -208, 30, -176, -2, -150);
  pen.closePath();
  nbPaint(PEAFOWL.neck, nbGrad(0, -242, 0, -146, PEAFOWL.neckLight, PEAFOWL.neck));
  pen.save();
  pen.clip();
  nbScales(16, 8, -4, -240, 7, 6, 3, PEAFOWL.scale);
  pen.restore();
  for (i = 0; i < 7; i++) {                          // rule 3: the crest, a narrow tuft of thin plumes, spread a little at the top
    var c = -Math.PI / 2 + 0.1 + (i - 3) * 0.075 + 0.03 * Math.sin(t * 3 + i), long = 30 - Math.abs(i - 3) * 2;
    var top = [40 + Math.cos(c) * long, -252 + Math.sin(c) * long];
    pen.strokeStyle = PEAFOWL.crest;
    pen.lineWidth = 1.4;
    pen.beginPath();
    pen.moveTo(40, -252);
    pen.lineTo(top[0], top[1]);
    pen.stroke();
    nbOval(top[0], top[1], 2, 3.6, c + Math.PI / 2);
    nbFill(PEAFOWL.crestTip);
  }
  nbOval(44, -245, 11.5, 10);                        // the head
  nbPaint("#2a6a6a");
  nbOval(40, -242, 6, 8, 0.2);                       // rule 4: the bare face, yellow on the cheek, blue round the eye
  nbFill(PEAFOWL.cheek);
  nbOval(48, -247, 5, 3.8);
  nbFill(PEAFOWL.eyeskin);
  nbEye(48.5, -247, 1.9, "#141414", mood, PEAFOWL.eyeskin);
  var open = call * 6 + (mood ? 8 * mood.open : 0);        // the bill, open as it calls (and in a laugh, a yawn, a fright)
  pen.beginPath();
  pen.moveTo(53, -249);
  pen.lineTo(68, -244 - open * 0.3);
  pen.lineTo(54, -243);
  pen.closePath();
  nbPaint(PEAFOWL.bill);
  pen.beginPath();
  pen.moveTo(54, -243);
  pen.lineTo(66, -241 + open);
  pen.lineTo(53, -239);
  pen.closePath();
  nbPaint(PEAFOWL.bill);
  pen.restore();
  nbEnd(keep);
}

// ---------- Mrs Hume's pheasant ----------
// Mrs Hume's pheasant (Syrmaticus humiae, ไก่ฟ้าหางลายขวาง, the bar-tailed
// pheasant): in Thailand only in the far north, in old pine and oak forest, and
// one of the birds people go to Doi Chiang Dao to see (BirdLife: Vulnerable,
// 2023). Read from
// photographs and a painting of the cock and the hen:
//   1. The cock's face is bare and bright red round the eye, on a grey head,
//      with a pale, ivory bill.
//   2. His neck is a glossy dark blue.
//   3. His body is chestnut and maroon, scaled darker, and two white bars
//      cross his folded wing.
//   4. His tail is very long, held out behind and a little raised, pale grey
//      crossed by dark bars all along it, its edges chestnut: the bars give him
//      his Thai name.
//   5. The hen is brown, mottled darker, with a short barred tail.
// The look's names: size, face, step (walking, as for the peafowl), peck (0 to
// 1), hen (true: the hen).

var PHEASANT = {body: "#8a2e24", deep: "#5a1e22", scale: "#3a1418", bar: "#f4f0e6", neck: "#26366a", neckLight: "#3a5a9a", head: "#77777e",
                face: "#d8302a", bill: "#e8e2c8", leg: "#9a9a94", tail: "#d8d4ca", band: "#3a3430", edge: "#8a3a24",
                hen: "#9a7a52", henDeep: "#6a5236", henMark: "#4a3624", henTail: "#b89a6a"};

function pheasant(x, y, t, look) {
  look = look || {};
  var e = look.feel !== undefined ? creatureFeel(look, t) : null;   // a feeling: the eye, and where it has them the head and the bill
  checkNames("The pheasant's name", look, PHEASANT_KEYS);
  var keep = nbBegin(x, y, look);
  var walking = look.step !== undefined, step = look.step || 0, peck = clamp(look.peck || 0), hen = !!look.hen, i;
  for (i = 0; i < 2; i++) {                          // the legs, grey
    var swing = walking ? Math.sin(step * Math.PI * 2 + i * Math.PI) : 0, lift = Math.max(0, swing) * 6;
    var hip = -8 + i * 10, foot = hip + swing * 12;
    nbLimb([[hip, -38], [mix(hip, foot, 0.5) - 4, -20 - lift * 0.5], [foot, -3 - lift]], 4, PHEASANT.leg);
    nbLimb([[foot - 9, -lift], [foot, -3 - lift], [foot + 10, -lift]], 2.5, PHEASANT.leg);
  }
  pen.save();                                        // the body and all above the legs tip forward about the hips to peck
  pen.translate(-4, -38);
  pen.rotate(peck * 0.35);
  pen.translate(4, 38);
  pen.save();                                        // the tail stays low as the body tips
  pen.translate(-40, -62);
  pen.rotate(-peck * 0.3);
  pen.translate(40, 62);
  var long = hen ? 72 : 150, sway = (walking ? Math.sin(step * Math.PI * 2) * 5 : 0) + Math.sin(t * 1.3) * 2;   // rule 4: the tail sways with the steps
  var a = [-40, -62], b = [-40 - long * 0.5, -80 + (hen ? 6 : 0)], c = [-40 - long, -66 + sway];
  nbStrip(a, b, c, hen ? 11 : 13, hen ? 5 : 4, 0, 1);
  nbPaint(hen ? PHEASANT.henTail : PHEASANT.tail);
  pen.save();
  pen.clip();
  pen.strokeStyle = hen ? PHEASANT.henMark : PHEASANT.band;   // the bars across it
  pen.lineWidth = hen ? 2.5 : 4;
  pen.beginPath();
  for (var s = 0.1; s < 0.98; s += hen ? 0.12 : 0.07) {
    var p = nbQuad(a, b, c, s), q = nbQuad(a, b, c, s + 0.01), dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1;
    pen.moveTo(p[0] - dy / l * 9, p[1] + dx / l * 9);
    pen.lineTo(p[0] + dy / l * 9, p[1] - dx / l * 9);
  }
  pen.stroke();
  if (!hen) {                                        // its edges chestnut
    nbStrip(a, b, c, 13, 4, 0, 1);
    pen.strokeStyle = PHEASANT.edge;
    pen.lineWidth = 3;
    pen.stroke();
  }
  pen.restore();
  pen.restore();
  nbOval(-6, -58, 40, 24, -0.1);                     // rule 3 (5): the body, scaled
  nbPaint(hen ? PHEASANT.hen : PHEASANT.body, nbGrad(0, -82, 0, -34, hen ? PHEASANT.hen : PHEASANT.body, hen ? PHEASANT.henDeep : PHEASANT.deep));
  pen.save();
  pen.clip();
  nbScales(8, 12, -46, -80, 7.5, 6, 3.2, hen ? PHEASANT.henMark : PHEASANT.scale);
  pen.restore();
  if (!hen) {                                        // the two white bars across the folded wing
    pen.lineWidth = 4.5;
    pen.strokeStyle = PHEASANT.bar;
    pen.beginPath();
    pen.moveTo(8, -68);
    pen.quadraticCurveTo(-12, -62, -34, -58);
    pen.moveTo(4, -56);
    pen.quadraticCurveTo(-14, -50, -30, -46);
    pen.stroke();
  }
  pen.save();                                        // the neck bends down to bring the bill to the ground
  pen.translate(12, -76);
  pen.rotate(peck * 1.4 + (e ? 0.5 * e.nod - 0.2 * e.raise : 0));   // and a feeling carries the head high or low
  pen.translate(-12, 76);
  pen.beginPath();                                   // rule 2: the neck
  pen.moveTo(18, -74);
  pen.bezierCurveTo(30, -82, 32, -92, 44, -100);
  pen.lineTo(34, -106);
  pen.bezierCurveTo(24, -96, 18, -86, 6, -78);
  pen.closePath();
  nbPaint(hen ? PHEASANT.hen : PHEASANT.neck, nbGrad(0, -106, 0, -74, hen ? PHEASANT.hen : PHEASANT.neckLight, hen ? PHEASANT.henDeep : PHEASANT.neck));
  nbOval(41, -103, 9.5, 8.5);                        // rule 1: the head, the red face, the pale bill
  nbPaint(hen ? PHEASANT.hen : PHEASANT.head);
  if (!hen) {
    nbOval(44, -103, 6.5, 5.5, 0.1);
    nbFill(PHEASANT.face);
  }
  nbEye(45, -104, 1.6, "#141414", e, hen ? PHEASANT.hen : PHEASANT.face);
  pen.beginPath();
  pen.moveTo(49, -106);
  pen.quadraticCurveTo(57, -104, 58, -99);
  pen.lineTo(49, -100);
  pen.closePath();
  nbPaint(PHEASANT.bill);
  pen.restore();
  pen.restore();
  nbEnd(keep);
}

// ---------- the green-tailed sunbird ----------
// The green-tailed sunbird (Aethopyga nipalensis, นกกินปลีหางยาวเขียว): the high
// mountains of the north of Thailand have a form of their own, angkanensis, named
// in 1929 from a bird taken on Doi Ang Ka, as Doi Inthanon was called; it alone
// has the scarlet across its breast (Riley 1929; birdforum's Opus). Read from
// photographs of the male:
//   1. It is small, with a long, thin bill curved down, to reach into flowers.
//   2. Its head and throat are dark, glossed green and blue.
//   3. Its breast is bright yellow, and on the birds of the north an
//      orange-red patch spreads over it.
//   4. Its back and wings are olive; its tail long and dark green, the middle
//      two feathers longer than the rest.
//   5. It feeds at flowers perched or hanging beside them, and for a moment
//      hovers in front of one, its wings a blur.
// The look's names: size, face, hover (0 to 1: in the air, level, the wings a
// blur, the legs drawn up), sip (0 to 1: the bill reaching into a flower ahead).

var SUNBIRD = {head: "#2a8a8a", gloss: "#3a5ab8", red: "#e8562a", yellow: "#f2c230", back: "#6a7a3a", wing: "#4a5a2a", tail: "#2a5a4a", bill: "#1a1a1a", leg: "#3a3a3a"};

function sunbirdWing(lift, alpha) {                  // one wing, pointed, olive: "lift" undefined, folded on its side; else beating, from 1 up to -1 down
  pen.save();
  pen.globalAlpha *= alpha;
  pen.translate(2, -18);
  pen.beginPath();
  if (lift === undefined) {
    pen.moveTo(0, 0);
    pen.quadraticCurveTo(-8, -10, -24, -4);
    pen.quadraticCurveTo(-12, 2, 0, 4);
  } else {
    nbLift(lift);
    pen.moveTo(3, 0);
    pen.quadraticCurveTo(2, -14, -6, -26);
    pen.quadraticCurveTo(-12, -12, -8, 0);
  }
  pen.closePath();
  nbPaint(SUNBIRD.wing, nbGrad(0, 0, -16, -16, SUNBIRD.back, SUNBIRD.wing));
  pen.restore();
}

function sunbird(x, y, t, look) {
  look = look || {};
  var e = look.feel !== undefined ? creatureFeel(look, t) : null;   // a feeling: the eye, and where it has them the head and the bill
  checkNames("The sunbird's name", look, SUNBIRD_KEYS);
  var keep = nbBegin(x, y, look, 0.45);
  pen.scale(0.6, 0.6);                               // it is drawn 60 long: at size 1, as small as it is beside the cast
  LINE /= 0.6;
  var hover = clamp(look.hover || 0), sip = clamp(look.sip || 0);
  var tilt = mix(-0.35, 0.12, hover) + sip * 0.22 + hover * 0.05 * Math.sin(t * 9);
  pen.translate(0, -14);
  pen.rotate(tilt);
  pen.translate(0, 14);
  if (hover < 0.5) {                                 // perched: thin legs to the twig
    nbLimb([[-2, -8], [-4, 0]], 1.6, SUNBIRD.leg);
    nbLimb([[3, -8], [3, 0]], 1.6, SUNBIRD.leg);
  }
  var fan = hover * 0.25 * (1 + Math.sin(t * 7)), i;  // rule 4: the tail, fanning as it hovers
  for (i = 2; i >= 0; i--) {
    var ang = Math.PI * 0.94 + (i - 1) * 0.12 * (1 + fan), long = i === 1 ? 34 : 24;
    pen.beginPath();
    pen.moveTo(-10, -10);
    pen.lineTo(-10 + Math.cos(ang) * long, -10 + Math.sin(ang) * long + 2);
    pen.lineTo(-10 + Math.cos(ang + 0.05) * (long - 3), -10 + Math.sin(ang + 0.05) * (long - 3) + 4);
    pen.closePath();
    nbPaint(SUNBIRD.tail);
  }
  var beat = Math.cos(t * Math.PI * 2 * 13);         // rule 5: hovering, the wings a blur between up and down
  if (hover > 0) {
    sunbirdWing(1, 0.25 * hover);
    sunbirdWing(-0.7, 0.25 * hover);
  }
  nbOval(-2, -14, 12, 7.5, -0.1);                    // the body: olive back, yellow breast with the red patch
  nbPaint(SUNBIRD.back, nbGrad(0, -21, 0, -7, SUNBIRD.back, SUNBIRD.yellow));
  nbOval(4, -11, 6.5, 4.5, -0.3);
  nbFill(SUNBIRD.red);
  if (hover < 1) { sunbirdWing(undefined, 1 - hover); }   // perched: the wing folded on its side
  if (hover > 0) { sunbirdWing(0.15 + 0.85 * beat, 0.6 * hover); }
  nbOval(9, -22, 6.5, 6);                            // rule 2: the head, glossed
  nbPaint(SUNBIRD.head, nbGrad(4, -28, 14, -16, SUNBIRD.gloss, SUNBIRD.head));
  nbEye(11, -23, 1.2, "#101010", e, SUNBIRD.head);
  pen.strokeStyle = SUNBIRD.bill;                    // rule 1: the bill, long, thin, curved down
  pen.lineWidth = 2.2;
  pen.beginPath();
  pen.moveTo(14, -23);
  pen.quadraticCurveTo(23, -26, 30, -17);
  pen.stroke();
  nbEnd(keep);
}

// ---------- the red-billed blue magpie ----------
// The red-billed blue magpie (Urocissa erythroryncha, นกขุนแผน): in small
// parties through the hill forests of the north, up to 2,200 m; one of the
// longest tails of any crow (Thai National Parks). Read from a photograph:
//   1. Its bill and legs are bright orange-red.
//   2. Its head, throat and breast are black, and a pale blue-white patch lies
//      over the back of its head.
//   3. Its belly is white; its back and wings blue.
//   4. Its tail is very long and graduated: the middle feathers longest, the
//      others each shorter, every feather blue-grey with a black band and a
//      white tip, so the tail is barred black and white down both sides.
//   5. Perched, it flicks the tail up now and then and lets it sink; it flies
//      beating and gliding by turns, the long tail streaming behind.
// The look's names: size, face, fly (true: in flight; (x, y) is then the
// middle of its body), bob (false: a perched one keeps its tail still).

var MAGPIE = {blue: "#3a64b8", light: "#6a90d8", black: "#151820", white: "#f4f4ef", nape: "#dfe8f4", red: "#e8452a", tail: "#8090c0"};

function magpieTail(root, angle, long, t) {          // rule 4: the graduated tail, the outer feathers first
  for (var k = 4; k >= 0; k--) {
    for (var side = -1; side <= 1; side += 2) {
      if (k === 0 && side > 0) { continue; }
      var a = angle + side * k * 0.012, l = long * (1 - 0.17 * k), wave = Math.sin(t * 3 - k) * 0.02;
      var off = side * k * 2.2, base = [root[0] - Math.sin(angle) * off, root[1] + Math.cos(angle) * off];   // each pair a little out to the side, so its tip shows
      var tip = [base[0] + Math.cos(a + wave) * l, base[1] + Math.sin(a + wave) * l], mid = [(base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2];
      nbStrip(base, mid, tip, 6, 8, 0, 1);
      nbPaint(MAGPIE.tail);
      nbStrip(base, mid, tip, 6, 8, 0.72, 0.86);
      nbFill(MAGPIE.black);
      nbStrip(base, mid, tip, 6, 8, 0.86, 1);
      nbFill(MAGPIE.white);
    }
  }
}

function magpieHead(x, y, e) {                      // rules 1 and 2
  nbOval(x, y, 10, 9.5);
  nbPaint(MAGPIE.black);
  nbOval(x - 6, y - 4, 7, 5, -0.3);
  nbFill(MAGPIE.nape);
  nbEye(x + 3, y - 1, 1.8, "#ffcc66", e, MAGPIE.black);
  pen.beginPath();
  pen.moveTo(x + 8, y - 3);
  pen.lineTo(x + 19, y + 1);
  pen.lineTo(x + 8, y + 4);
  pen.closePath();
  nbPaint(MAGPIE.red);
}

function blueMagpie(x, y, t, look) {
  look = look || {};
  var e = look.feel !== undefined ? creatureFeel(look, t) : null;   // a feeling: the eye, and where it has them the head and the bill
  checkNames("The magpie's name", look, MAGPIE_KEYS);
  var keep = nbBegin(x, y, look);
  if (!look.fly) {                                   // perched on a branch at (x, y)
    var flick = look.bob === false ? 0 : Math.max(0, Math.sin((t % 2.6) / 2.6 * Math.PI * 2)) * Math.exp(-(t % 2.6) * 1.4);   // rule 5: up quickly, sinking slowly
    nbLimb([[-4, -12], [-6, 0]], 3, MAGPIE.red);
    nbLimb([[4, -12], [5, 0]], 3, MAGPIE.red);
    magpieTail([-20, -20], 1.95 - flick * 0.6, 118, t);
    nbOval(-4, -27, 23, 13.5, -0.3);                 // rule 3: blue back, white belly
    nbPaint(MAGPIE.blue, nbGrad(0, -40, 0, -14, MAGPIE.light, MAGPIE.white));
    pen.beginPath();                                 // the folded wing
    pen.moveTo(10, -36);
    pen.bezierCurveTo(-6, -40, -24, -32, -30, -20);
    pen.bezierCurveTo(-16, -22, -2, -26, 8, -28);
    pen.closePath();
    nbPaint(MAGPIE.blue, nbGrad(10, -36, -30, -20, MAGPIE.blue, MAGPIE.light));
    pen.beginPath();                                 // the black breast, down from the throat
    pen.moveTo(8, -40);
    pen.quadraticCurveTo(18, -32, 12, -22);
    pen.quadraticCurveTo(6, -30, 2, -36);
    pen.closePath();
    nbPaint(MAGPIE.black);
    magpieHead(14, -44, e);
  } else {                                           // in flight: rule 5, beating three times and gliding, rising and sinking with it
    var cycle = (t % 1.4) / 1.4, flapping = cycle < 0.5;
    var lift = flapping ? 0.2 + 0.8 * Math.cos(cycle / 0.5 * Math.PI * 2 * 3) : 0.12;   // gliding, the wings held out level, seen edge on
    pen.translate(0, flapping ? -4 * Math.sin(cycle / 0.5 * Math.PI) : 5 * Math.sin((cycle - 0.5) / 0.5 * Math.PI));
    function wingAt(colour) {
      pen.save();
      pen.translate(2, -6);
      nbLift(lift);
      pen.beginPath();
      pen.moveTo(10, 0);
      pen.bezierCurveTo(10, -30, 4, -54, -8, -66);
      pen.bezierCurveTo(-24, -54, -30, -24, -20, 0);
      pen.closePath();
      nbPaint(colour, nbGrad(0, 0, -8, -66, colour, MAGPIE.light));
      pen.save();
      pen.clip();
      pen.strokeStyle = MAGPIE.white;                // the flight feathers tipped white
      pen.lineWidth = 5;
      pen.beginPath();
      pen.moveTo(-8, -66);
      pen.bezierCurveTo(-24, -54, -30, -24, -20, 0);
      pen.stroke();
      pen.restore();
      pen.restore();
    }
    pen.save();
    pen.translate(-6, -3);
    wingAt(blend(MAGPIE.blue, MAGPIE.black, 0.35));  // the far wing, behind
    pen.restore();
    magpieTail([-20, 2], Math.PI + 0.08, 118, t);
    nbOval(0, 0, 23, 11);
    nbPaint(MAGPIE.blue, nbGrad(0, -11, 0, 11, MAGPIE.light, MAGPIE.white));
    magpieHead(25, -5, e);
    wingAt(MAGPIE.blue);
  }
  nbEnd(keep);
}

// ---------- the great hornbill ----------
// The great hornbill (Buceros bicornis, นกกก): gone from the wild of the northern
// provinces for more than twenty years, and being brought home: two were set free
// in Lampang's Chae Son National Park in October 2022 (Thai PBS World), and two
// more on Doi Chiang Dao in January 2023 (Chiang Mai City Life). Read from
// photographs of it perched and in flight:
//   1. It is big and black, its neck and nape cream, stained yellow.
//   2. Its bill is huge and curved down, yellow, and on it a broad yellow casque,
//      hollowed on top with a horn forward at each side, edged black.
//   3. Its eye is red in a black face.
//   4. Its wings are black with a broad pale yellow band across them and white
//      at the trailing edge; in flight the long flight feathers spread like
//      fingers at the tips.
//   5. Its tail is long and white, with one broad black band.
//   6. It flies with slow, heavy beats, its neck stretched forward.
// The look's names: size, face, fly (true: in flight; (x, y) is the middle of
// its body), turn (-1 to 1: perched, how far its head turns down or up).

var HORNBILL = {black: "#1c1c1e", blackLight: "#34343c", cream: "#efe2a8", creamDeep: "#d8c070", bill: "#f2c230", billPale: "#f8e6a0",
                band: "#f0e6b8", white: "#f6f4ee", eye: "#d8302a", leg: "#3a3a3a"};

function hornbillHead(x, y, e) {                        // rules 2 and 3: the head, the bill and the casque, about (x, y)
  pen.beginPath();                                   // the bill, curved down
  pen.moveTo(x + 10, y - 8);
  pen.quadraticCurveTo(x + 58, y - 4, x + 96, y + 30);
  pen.quadraticCurveTo(x + 56, y + 10, x + 10, y + 8);
  pen.closePath();
  nbPaint(HORNBILL.bill, nbGrad(x + 10, 0, x + 96, 0, HORNBILL.bill, HORNBILL.billPale));
  pen.beginPath();                                   // the casque: hollowed on top, a horn forward
  pen.moveTo(x + 8, y - 8);
  pen.lineTo(x + 10, y - 26);
  pen.quadraticCurveTo(x + 36, y - 20, x + 60, y - 26);
  pen.lineTo(x + 70, y - 14);
  pen.quadraticCurveTo(x + 40, y - 10, x + 8, y - 8);
  pen.closePath();
  nbPaint(HORNBILL.bill, nbGrad(0, y - 26, 0, y - 8, HORNBILL.bill, HORNBILL.creamDeep));
  pen.strokeStyle = HORNBILL.black;                  // its black edges, at the front and the back
  pen.lineWidth = 3;
  pen.beginPath();
  pen.moveTo(x + 60, y - 26);
  pen.lineTo(x + 70, y - 14);
  pen.moveTo(x + 10, y - 26);
  pen.lineTo(x + 9, y - 10);
  pen.stroke();
  nbOval(x, y, 15, 14);                             // the head, cream, the face black, the eye red
  nbPaint(HORNBILL.cream);
  nbOval(x + 4, y + 1, 10, 9);
  nbFill(HORNBILL.black);
  nbEye(x + 5, y - 1, 3.5, HORNBILL.eye, e, HORNBILL.black);
  nbOval(x + 5.5, y - 1, 1.5, 1.5);
  nbFill("#101010");
}

function hornbillWing(lift, colour) {               // rules 4 and 6: one broad wing up from the shoulder, fingered at the tip; "lift" from 1, up, to -1, down
  pen.save();
  pen.translate(10, -10);
  nbLift(lift);
  pen.beginPath();
  pen.moveTo(18, 0);
  pen.bezierCurveTo(16, -50, 12, -90, 4, -118);      // the leading edge, to the wrist
  for (var f = 0; f < 6; f++) {                      // the fingers: the long flight feathers, each a tip of its own
    var a = -1.45 - f * 0.2, r = 64 - f * 4, fx = -6 + Math.cos(a) * r * 0.6 - f * 8, fy = -118 + Math.sin(a) * r;
    pen.quadraticCurveTo(fx + 4, fy - 4, fx - 3, fy + 2);
    pen.lineTo(-8 - f * 11, -122 + f * 6);
  }
  pen.bezierCurveTo(-78, -80, -76, -30, -56, 2);      // the trailing edge, back down to the body
  pen.closePath();
  nbPaint(colour);
  pen.save();
  pen.clip();
  pen.strokeStyle = HORNBILL.band;                   // the pale band along the wing
  pen.lineWidth = 22;
  pen.beginPath();
  pen.moveTo(-14, 4);
  pen.quadraticCurveTo(-20, -60, -22, -118);
  pen.stroke();
  pen.strokeStyle = HORNBILL.white;                  // and white along its trailing edge
  pen.lineWidth = 14;
  pen.beginPath();
  pen.moveTo(-58, 4);
  pen.bezierCurveTo(-78, -30, -80, -80, -68, -116);
  pen.stroke();
  pen.restore();
  pen.restore();
}

function hornbill(x, y, t, look) {
  look = look || {};
  var e = look.feel !== undefined ? creatureFeel(look, t) : null;   // a feeling: the eye, and where it has them the head and the bill
  checkNames("The hornbill's name", look, HORNBILL_KEYS);
  var keep = nbBegin(x, y, look);
  if (!look.fly) {                                   // perched on a branch at (x, y)
    nbLimb([[-6, -24], [-8, 0]], 5, HORNBILL.leg);
    nbLimb([[8, -24], [8, 0]], 5, HORNBILL.leg);
    pen.beginPath();                                 // rule 5: the tail, long and white, hanging below the branch, a black band across it
    pen.moveTo(-30, -40);
    pen.lineTo(-58, 46);
    pen.lineTo(-86, 40);
    pen.lineTo(-52, -50);
    pen.closePath();
    nbPaint(HORNBILL.white);
    pen.beginPath();
    pen.moveTo(-40, -8);
    pen.lineTo(-48, 16);
    pen.lineTo(-76, 10);
    pen.lineTo(-64, -16);
    pen.closePath();
    nbFill(HORNBILL.black);
    nbOval(-10, -62, 42, 30, -0.6);                 // rule 1: the body, black
    nbPaint(HORNBILL.black, nbGrad(0, -96, 0, -30, HORNBILL.blackLight, HORNBILL.black));
    pen.beginPath();                                 // the folded wing: the pale band, white at its lower edge
    pen.moveTo(10, -80);
    pen.bezierCurveTo(-20, -84, -46, -60, -52, -30);
    pen.bezierCurveTo(-30, -36, -6, -52, 8, -64);
    pen.closePath();
    nbPaint(HORNBILL.black);
    pen.save();
    pen.clip();
    pen.strokeStyle = HORNBILL.band;
    pen.lineWidth = 12;
    pen.beginPath();
    pen.moveTo(4, -76);
    pen.quadraticCurveTo(-24, -70, -40, -46);
    pen.stroke();
    pen.restore();
    pen.beginPath();                                 // the neck, cream
    pen.moveTo(14, -84);
    pen.bezierCurveTo(28, -96, 26, -110, 34, -118);
    pen.lineTo(22, -126);
    pen.bezierCurveTo(10, -110, 0, -100, -6, -88);
    pen.closePath();
    nbPaint(HORNBILL.cream, nbGrad(0, -126, 0, -84, HORNBILL.cream, HORNBILL.creamDeep));
    pen.save();                                      // the head turns, as it looks about
    pen.translate(30, -122);
    pen.rotate((look.turn || 0) * 0.35 + 0.06 * Math.sin(t * 0.9));
    hornbillHead(0, 0, e);
    pen.restore();
  } else {                                           // rule 6: in flight, slow beats, the neck stretched forward
    var phase = t * Math.PI * 2 / 1.1, lift = 0.15 + 0.85 * Math.cos(phase);   // up, and down, and up: about once a second
    pen.translate(0, -6 * Math.sin(phase));           // the body rises as the wings come down
    pen.save();
    pen.translate(-10, -4);
    hornbillWing(lift, blend(HORNBILL.black, "#000000", 0.3));   // the far wing
    pen.restore();
    pen.beginPath();                                 // the tail, spread, white with its black band
    pen.moveTo(-40, -8);
    pen.lineTo(-140, -26);
    pen.lineTo(-146, 18);
    pen.lineTo(-40, 8);
    pen.closePath();
    nbPaint(HORNBILL.white);
    pen.beginPath();
    pen.moveTo(-82, -15);
    pen.lineTo(-110, -20);
    pen.lineTo(-113, 13);
    pen.lineTo(-84, 9);
    pen.closePath();
    nbFill(HORNBILL.black);
    nbOval(0, 0, 52, 20);
    nbPaint(HORNBILL.black, nbGrad(0, -20, 0, 20, HORNBILL.blackLight, HORNBILL.black));
    pen.beginPath();                                 // the neck, forward
    pen.moveTo(36, -12);
    pen.quadraticCurveTo(54, -16, 66, -12);
    pen.lineTo(66, 6);
    pen.quadraticCurveTo(52, 6, 36, 10);
    pen.closePath();
    nbPaint(HORNBILL.cream);
    hornbillHead(70, -4, e);
    hornbillWing(lift, HORNBILL.black);
  }
  nbEnd(keep);
}
