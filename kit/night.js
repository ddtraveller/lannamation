// night.js - the night of the north, for the Lanna cartoon kit: a moon, the eastern barn owl, the atlas moth, bats
// going out at dusk, and fireflies far off. Load it after the kit and northbirds.js (it draws with their helpers):
//
//     <script src="oldcartoon.js"></script>
//     <script src="northbirds.js"></script>
//     <script src="night.js"></script>
//
//   nightMoon(x, y, r)            the full moon, its glow round it; returns {x, y, r} to hand to the owl and moonLight()
//   moonLight(x, y, moon)         how much of the moon's light falls at (x, y): 1 beside it, less far off
//   barnOwl(x, y, t, look)        the eastern barn owl: perched, flying past (fly: "side") or gliding to us (fly: "front")
//   atlasMoth(x, y, t, look)      the atlas moth, fluttering, its wing tips the heads of snakes
//   batStream(t, look)            a stream of bats far off, flying away over the hills, smaller and fading as they go
//   farFireflies(t, look)         fireflies seen from far away: tiny short flashes, low over the fields and the slopes
//
// Why these (owner, 2026-10-21: "Research nocturnal creatures of northern thailand in notebooklm. I want to add some
// creatures to the credits and the lannamation framework", then "do the moth, the fireflies, the owl, maybe a common
// bat"): the research notebook "Nocturnal creatures of northern Thailand" (44 sources) put the barn owl (นกแสก) first,
// the night bird every Thai house knows by its screech; the atlas moth (ผีเสื้อหนอนใบกระท้อน) is the largest moth of the
// forests; fireflies (หิ่งห้อย) blink over the rice fields; and bats go out from the hills at dusk in streams. Each is
// drawn from rules read from photographs on Wikimedia Commons under free licences (Nikhil More's eastern barn owl;
// a barn owl in flight by Dannymoore1973 and one by Charlie Marshall; Quartl's atlas moth; Jonathan Curley's house
// bats; Bernard Dupont's free-tailed bats in flight; Manoj Karingamadathil's firefly), kept with their credits outside
// the repository; nothing of them is copied. The owner chose among candidates: all three looks of the owl, the moth
// with the bolder bands, the bats far off ("Instead of leaving a cave just have them fly behind hills or get smaller
// and fade out"), and fireflies "subtle and distant in the background ... a realistic look at fireflies from far away".
//
// The owl in the moonlight (owner: "Add a Moon and clouds and change the color of the owl when it is in or out of
// moon light and show its silouette as it crosses the moon"): look.lit (0 to 1) is how much light is on it: at 1 its
// own colours, white and gold; less, they go toward the blue of the night. look.moon (what nightMoon() returned): where
// the owl is in front of the moon's disc it is drawn again, black, so it crosses the moon as a silhouette.

var OWL_KEYS = {}, MOTH_KEYS = {};
["size", "face", "fly", "turn", "lit", "moon", "seed"].forEach(function (n) { OWL_KEYS[n] = true; });
["size", "face", "turn", "lit", "flutter"].forEach(function (n) { MOTH_KEYS[n] = true; });

var OWL = {face: "#f8f3ea", rim: "#c38f52", back: "#d8a458", grey: "#a7a3a0", belly: "#fbf5ea", under: "#f4ecdc",
           spot: "#4a3a2c", eye: "#1a1210", beak: "#e7cdbb", talon: "#5a4a40", light: "#fffaf0"};
var MOTH = {rust: "#b8562a", deep: "#7a3418", band: "#f1e2c4", window: "#faf4e2", tip: "#e8b278", pink: "#d98a7a",
            body: "#d07a3a", ant: "#8a5a30", line: "#1a1210"};
var NIGHT_SHADE = "#1e2440";                         // what an unlit thing goes toward at night
var NIGHT_BLACK = "#0b0c14";                         // a thing against the moon

// A palette's every colour taken toward the night by (1 - lit), or all of it black for a silhouette.
// "colours" is a palette, an object of name: "#rrggbb" (OWL, MOTH); "lit" 0 to 1; "black" true for the
// silhouette. Returns a new object with the same names. Draws nothing.
// e.g. nightPalette(OWL, 0.4)
function nightPalette(colours, lit, black) {
  var out = {};
  Object.keys(colours).forEach(function (k) {
    out[k] = black ? NIGHT_BLACK : blend(colours[k], NIGHT_SHADE, 0.72 * (1 - clamp(lit)));
  });
  return out;
}

// ---------- the moon ----------
// The full moon about (x, y), r in radius, in pixels of the sheet, with its glow out to 4.5 r and its grey
// seas. Returns {x, y, r}: hand it to barnOwl() as look.moon and to moonLight(). It draws with pen, and leaves
// pen's fillStyle set.
// e.g. var moon = nightMoon(1500, 220, 70);
function nightMoon(x, y, r) {
  var glow = pen.createRadialGradient(x, y, r * 0.9, x, y, r * 4.5);
  glow.addColorStop(0, "rgba(255, 246, 214, 0.35)");
  glow.addColorStop(1, "rgba(255, 246, 214, 0)");
  pen.fillStyle = glow;
  pen.fillRect(x - r * 4.5, y - r * 4.5, r * 9, r * 9);
  var face = pen.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  face.addColorStop(0, "#fffbea");
  face.addColorStop(1, "#efe2bc");
  pen.fillStyle = face;
  pen.beginPath();
  pen.arc(x, y, r, 0, Math.PI * 2);
  pen.fill();
  pen.fillStyle = "rgba(190, 176, 140, 0.35)";       // its seas, soft grey
  [[-0.3, -0.2, 0.28], [0.22, -0.32, 0.18], [0.1, 0.25, 0.24], [-0.35, 0.3, 0.12]].forEach(function (m) {
    pen.beginPath();
    pen.arc(x + m[0] * r, y + m[1] * r, m[2] * r, 0, Math.PI * 2);
    pen.fill();
  });
  return {x: x, y: y, r: r};
}

// "moon" is what nightMoon() returned. Returns a number, 0.3 to 1: 1 within two moon-radii of its middle,
// falling to 0.3 at nine and beyond; for look.lit. Draws nothing.
// e.g. barnOwl(ox, oy, clock, {fly: "side", lit: moonLight(ox, oy, moon), moon: moon})
function moonLight(x, y, moon) {
  var d = Math.hypot(x - moon.x, y - moon.y) / moon.r;
  return 0.3 + 0.7 * (1 - between(d, 2, 9));
}

// ---------- the eastern barn owl ----------
// About (0, 0), r its half-width in pixels of pen's frame; P the owl's palette (OWL, through nightPalette()).
// Returns nothing: it draws with pen.
// e.g. owlFace(26, nightPalette(OWL, 1))
function owlFace(r, P) {                             // the heart-shaped white disc, rimmed, its dark eyes and pale beak
  pen.beginPath();
  pen.moveTo(0, -r * 0.72);
  pen.bezierCurveTo(r * 0.5, -r * 1.15, r * 1.15, -r * 0.6, r * 0.85, r * 0.15);
  pen.bezierCurveTo(r * 0.68, r * 0.62, r * 0.22, r * 0.94, 0, r * 1.05);
  pen.bezierCurveTo(-r * 0.22, r * 0.94, -r * 0.68, r * 0.62, -r * 0.85, r * 0.15);
  pen.bezierCurveTo(-r * 1.15, -r * 0.6, -r * 0.5, -r * 1.15, 0, -r * 0.72);
  pen.closePath();
  pen.fillStyle = P.face;
  pen.fill();
  pen.strokeStyle = P.rim;
  pen.lineWidth = r * 0.12;
  pen.stroke();
  pen.strokeStyle = blend(P.face, P.rim, 0.45);      // the ridge down the middle, to the beak
  pen.lineWidth = r * 0.06;
  pen.beginPath();
  pen.moveTo(0, -r * 0.62);
  pen.lineTo(0, r * 0.12);
  pen.stroke();
  [-1, 1].forEach(function (s) {
    nbOval(s * r * 0.36, -r * 0.06, r * 0.13, r * 0.16);
    nbFill(P.eye);
    nbOval(s * r * 0.36 - r * 0.04, -r * 0.11, r * 0.035, r * 0.035);
    nbFill(P.light);
  });
  pen.beginPath();
  pen.moveTo(-r * 0.07, r * 0.14);
  pen.quadraticCurveTo(0, r * 0.1, r * 0.07, r * 0.14);
  pen.lineTo(0, r * 0.44);
  pen.closePath();
  nbPaint(P.beak);
}

// t the second; P the palette; look.turn and look.seed turn the head. Drawn in the frame nbBegin() made.
// Returns nothing: it draws with pen.
// e.g. owlPerched(clock, nightPalette(OWL, 1), {turn: 0.3})
function owlPerched(t, P, look) {                    // on a branch at (0, 0), facing us three-quarter, the head turning
  [-1, 1].forEach(function (s) {                     // long legs, feathered white, dark talons
    nbLimb([[s * 9, -34], [s * 10, -4]], 7, P.belly);
    nbLimb([[s * 10, -3], [s * 16, 0]], 2.5, P.talon);
    nbLimb([[s * 10, -3], [s * 4, 1]], 2.5, P.talon);
  });
  nbOval(0, -66, 28, 40);                            // the white breast, finely specked
  nbPaint(P.belly);
  for (var k = 0; k < 9; k++) { nbOval(-14 + dice(k + 3) * 28, -88 + dice(k + 40) * 44, 1.3, 1.3); nbFill(P.spot); }
  [-1, 1].forEach(function (s) {                     // the folded wings, golden with grey mottling, over each side to the tail
    pen.beginPath();
    pen.moveTo(s * 10, -102);
    pen.bezierCurveTo(s * 34, -100, s * 40, -60, s * 22, -26);
    pen.quadraticCurveTo(s * 12, -10, s * 4, -8);
    pen.bezierCurveTo(s * 16, -36, s * 20, -66, s * 18, -92);
    pen.closePath();
    nbPaint(P.back, nbGrad(0, -100, 0, -10, P.back, blend(P.back, P.grey, 0.5)));
    pen.save();
    pen.clip();
    for (var m = 0; m < 14; m++) { nbOval(s * (14 + dice(m + 60) * 22), -96 + dice(m + 80) * 80, 3, 1.6); nbFill(m % 4 ? P.grey : P.spot); }
    pen.restore();
  });
  pen.save();
  pen.translate(0, -112);
  pen.rotate((look.turn || 0) * 0.5 + 0.25 * Math.sin(t * 0.8 + (look.seed || 0)));
  nbOval(0, 0, 30, 28);                              // the head, golden behind the disc
  nbPaint(P.back);
  owlFace(26, P);
  pen.restore();
}

// "lift" from 1, raised, to -1, lowered (nbLift()); P the palette. Returns nothing: it draws with pen;
// pen is restored.
// e.g. owlWingSide(Math.cos(clock * 7), nightPalette(OWL, 1))
function owlWingSide(lift, P) {                      // one broad round wing, from the shoulder, as it beats seen from the side
  pen.save();
  nbLift(lift);
  pen.beginPath();
  pen.moveTo(16, 0);
  pen.bezierCurveTo(20, -60, 6, -110, -16, -128);    // the leading edge, round
  for (var f = 0; f < 6; f++) {                      // a soft fringe of feather tips along the trailing edge
    var fx = -20 - f * 9, fy = -126 + f * 18;
    pen.quadraticCurveTo(fx - 6, fy + 2, fx - 4, fy + 12);
  }
  pen.bezierCurveTo(-70, -10, -52, 4, -36, 4);
  pen.closePath();
  var up = lift > 0;                                 // raised, its pale underside shows; lowered, its golden top
  nbPaint(P.under, up ? nbGrad(0, 0, 0, -128, P.under, P.light) : nbGrad(0, 0, 0, -128, P.back, blend(P.back, P.grey, 0.4)));
  pen.save();
  pen.clip();
  pen.strokeStyle = blend(up ? P.under : P.back, P.spot, 0.3);   // faint bars across the flight feathers
  pen.lineWidth = 2;
  for (var b = 0; b < 5; b++) {
    pen.beginPath();
    pen.moveTo(-80, -30 - b * 22);
    pen.lineTo(30, -40 - b * 22);
    pen.stroke();
  }
  pen.restore();
  pen.restore();
}

// t the second (a beat every 0.9 s); P the palette. It moves pen's frame up and down with the beat and
// does not restore it: call it inside nbBegin() and nbEnd(), as barnOwl() does. Returns nothing.
// e.g. owlSide(clock, nightPalette(OWL, 1))
function owlSide(t, P) {                             // flying past, slow deep beats, the face turned to us; (0, 0) the body
  var phase = t * Math.PI * 2 / 0.9, lift = 0.1 + 0.9 * Math.cos(phase);
  pen.translate(0, -5 * Math.sin(phase));
  pen.save();
  pen.translate(-6, -4);
  owlWingSide(lift * 0.9, P);                        // the far wing
  pen.restore();
  pen.beginPath();                                   // the short tail
  pen.moveTo(-36, -6);
  pen.lineTo(-66, -10);
  pen.lineTo(-64, 8);
  pen.lineTo(-36, 8);
  pen.closePath();
  nbPaint(P.back);
  nbOval(0, 0, 44, 19);                              // the body: golden above, white below
  nbPaint(P.belly, nbGrad(0, -19, 0, 19, P.back, P.belly));
  nbLimb([[10, 14], [2, 26]], 6, P.belly);           // the legs trailing
  nbOval(38, -8, 20, 19);                            // the head, the disc turned to us
  nbPaint(P.back);
  pen.save();
  pen.translate(41, -6);
  owlFace(17, P);
  pen.restore();
  owlWingSide(lift, P);
}

// t the second (a beat every 1.6 s); P the palette. Returns nothing: it draws with pen.
// e.g. owlFront(clock, nightPalette(OWL, 1))
function owlFront(t, P) {                            // gliding toward us, wings wide, a slow beat now and then; (0, 0) the body
  var beat = Math.sin(t * Math.PI * 2 / 1.6), tip = -26 * beat;
  [-1, 1].forEach(function (s) {
    pen.beginPath();
    pen.moveTo(s * 14, -18);
    pen.bezierCurveTo(s * 70, -40 + tip * 0.5, s * 130, -46 + tip, s * 178, -20 + tip);   // the leading edge
    for (var f = 0; f < 7; f++) {                    // the fringed trailing edge, back in toward the body
      var fx = s * (176 - f * 22), fy = -12 + tip * (1 - f / 7) + 12 * Math.sin(f / 7 * Math.PI);
      pen.quadraticCurveTo(fx - s * 6, fy + 18, fx - s * 14, fy + 10);
    }
    pen.lineTo(s * 12, 10);
    pen.closePath();
    nbPaint(P.under, nbGrad(0, -40, 0, 20, P.light, P.under));
    pen.save();
    pen.clip();
    pen.strokeStyle = P.back;                        // the golden leading edge
    pen.lineWidth = 10;
    pen.beginPath();
    pen.moveTo(s * 14, -22);
    pen.bezierCurveTo(s * 70, -44 + tip * 0.5, s * 130, -50 + tip, s * 178, -24 + tip);
    pen.stroke();
    pen.restore();
  });
  [-1, 1].forEach(function (s) { nbLimb([[s * 7, 22], [s * 9, 46]], 6, P.belly); });
  nbOval(0, 6, 20, 26);
  nbPaint(P.belly);
  nbOval(0, -26, 22, 21);
  nbPaint(P.back);
  pen.save();
  pen.translate(0, -24);
  owlFace(19, P);
  pen.restore();
}

// The eastern barn owl, at second t: perched with its feet on (x, y) (a branch), or flying with (x, y) the
// middle of its body; in pixels of the sheet.
//   look   OWL_KEYS, and it may be left out: size (1), face (1 right, -1 left), fly ("side": flying past;
//          "front": gliding toward us; else perched), turn (perched: the head turns half of it, in radians),
//          lit (0 to 1, 1 when left out: the light on it), moon (nightMoon()'s: a silhouette where it
//          crosses the disc), seed (seconds added to its beat, so two do not beat together)
// Returns nothing: it draws with pen; pen and LINE are as they were after.
// e.g. barnOwl(300 + 150 * clock, 260, clock, {fly: "side", size: 1.3, lit: 0.5, moon: moon})
function barnOwl(x, y, t, look) {
  look = look || {};
  checkNames("The barn owl's name", look, OWL_KEYS);
  var lit = look.lit === undefined ? 1 : look.lit;
  function paint(P) {
    var keep = nbBegin(x, y, look);
    if (look.fly === "side") { owlSide(t + (look.seed || 0), P); }
    else if (look.fly === "front") { owlFront(t + (look.seed || 0), P); }
    else { owlPerched(t, P, look); }
    nbEnd(keep);
  }
  paint(nightPalette(OWL, lit));
  if (look.moon) {                                   // in front of the moon: the same owl again, black, inside its disc
    pen.save();
    pen.beginPath();
    pen.arc(look.moon.x, look.moon.y, look.moon.r, 0, Math.PI * 2);
    pen.clip();
    paint(nightPalette(OWL, 0, true));
    pen.restore();
  }
}

// ---------- the atlas moth ----------
// P the moth's palette (MOTH, through nightPalette()). Returns nothing: it draws with pen, and leaves pen's
// colours and line width set.
// e.g. mothWings(nightPalette(MOTH, 1))
function mothWings(P) {                              // the right wings, seen from above; drawn again mirrored for the left
  pen.beginPath();                                   // the hind wing, round
  pen.moveTo(6, 6);
  pen.bezierCurveTo(60, 4, 120, 20, 126, 62);
  pen.bezierCurveTo(130, 96, 90, 112, 60, 104);
  pen.bezierCurveTo(30, 96, 14, 60, 6, 26);
  pen.closePath();
  nbPaint(P.rust, nbGrad(0, 0, 130, 100, P.deep, P.rust));
  pen.beginPath();                                   // its window, a clear triangle edged black
  pen.moveTo(52, 40); pen.lineTo(80, 36); pen.lineTo(66, 62); pen.closePath();
  pen.fillStyle = P.window; pen.fill(); pen.strokeStyle = P.line; pen.lineWidth = LINE * 1.2; pen.stroke();
  pen.strokeStyle = P.band; pen.lineWidth = 5;       // the pale band near the edge
  pen.beginPath(); pen.moveTo(26, 86); pen.quadraticCurveTo(80, 104, 116, 70); pen.stroke();
  pen.beginPath();                                   // the fore wing, long, its tip hooked down like a snake's head
  pen.moveTo(6, -8);
  pen.bezierCurveTo(50, -40, 110, -76, 160, -78);
  pen.bezierCurveTo(186, -76, 192, -52, 176, -40);    // the hooked tip
  pen.bezierCurveTo(166, -32, 150, -36, 140, -26);
  pen.bezierCurveTo(110, -4, 60, 10, 8, 8);
  pen.closePath();
  nbPaint(P.rust, nbGrad(0, 0, 170, -60, P.deep, P.rust));
  pen.save();
  pen.clip();
  pen.fillStyle = P.tip;                             // the tip: pale, a dark eye and a pink lip, the snake's head
  nbOval(170, -58, 22, 16, 0.3); pen.fill();
  nbOval(176, -60, 4, 4); nbFill(P.line);
  pen.strokeStyle = P.pink; pen.lineWidth = 4;
  pen.beginPath(); pen.moveTo(160, -44); pen.quadraticCurveTo(176, -40, 186, -50); pen.stroke();
  pen.strokeStyle = P.band; pen.lineWidth = 6;       // the pale zigzag across the wing
  pen.beginPath(); pen.moveTo(60, -40); pen.lineTo(78, -18); pen.lineTo(96, -36); pen.lineTo(112, -14); pen.lineTo(130, -42); pen.stroke();
  pen.restore();
  pen.beginPath();                                   // its window
  pen.moveTo(70, -34); pen.lineTo(104, -50); pen.lineTo(96, -20); pen.closePath();
  pen.fillStyle = P.window; pen.fill(); pen.strokeStyle = P.line; pen.lineWidth = LINE * 1.2; pen.stroke();
}

// (x, y) the middle of its body; look.turn tilts it (radians); look.flutter, how often its wings beat in a second (2.2)
// The atlas moth seen from above, at second t, (x, y) in pixels of the sheet.
//   look   MOTH_KEYS, and it may be left out: size (1: about 380 across, wings open), face, turn, lit (0 to
//          1, 1 when left out), flutter
// Returns nothing: it draws with pen; pen and LINE are as they were after.
// e.g. atlasMoth(900, 420, clock, {size: 0.6, turn: 0.2, lit: 0.8})
function atlasMoth(x, y, t, look) {
  look = look || {};
  checkNames("The atlas moth's name", look, MOTH_KEYS);
  var P = nightPalette(MOTH, look.lit === undefined ? 1 : look.lit);
  var keep = nbBegin(x, y, look);
  pen.rotate(look.turn || 0);
  var open = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(t * Math.PI * 2 * (look.flutter || 2.2)));   // the wings fold up and open again
  [-1, 1].forEach(function (s) {
    pen.save();
    pen.scale(s * open, 1);
    mothWings(P);
    pen.restore();
  });
  nbOval(0, 4, 9, 34);                               // the furry body, ringed
  nbPaint(P.body, nbGrad(-9, 0, 9, 0, P.deep, P.body));
  pen.strokeStyle = blend(P.body, P.deep, 0.5); pen.lineWidth = 1.6;
  for (var r = 0; r < 5; r++) { pen.beginPath(); pen.moveTo(-8, 4 + r * 7); pen.lineTo(8, 4 + r * 7); pen.stroke(); }
  [-1, 1].forEach(function (s) {                     // the feathery feelers
    pen.strokeStyle = P.ant; pen.lineWidth = 2.4;
    pen.beginPath(); pen.moveTo(s * 3, -28); pen.quadraticCurveTo(s * 12, -46, s * 22, -52); pen.stroke();
    pen.lineWidth = 1;
    for (var k = 0; k < 6; k++) { var u = k / 6, ax = s * (3 + 19 * u), ay = -28 - 24 * u; pen.beginPath(); pen.moveTo(ax, ay); pen.lineTo(ax + s * 5, ay + 3); pen.stroke(); }
  });
  nbEnd(keep);
}

// ---------- bats going out ----------
// look: from, to ([x, y]: where the stream starts and where it goes, into the distance), start (the second the first
// bat leaves), long (the seconds each takes, 14), count (40), every (seconds between one bat and the next, 0.25),
// size (at the start, 1), far (its size at the end, 0.25), spread (how wide the stream is, 60), colour ("#16131c",
// near black: a lighter one, moonlit, shows against a dark sky). Each bat is a
// flapping "m", dark against the sky, smaller and fainter as it goes; one drawn before a hill's sheet goes behind it.
// t the second. look must be given, with from and to; the rest as said above. Returns nothing: it draws
// with pen; pen is restored (its globalAlpha too).
// e.g. batStream(clock, {from: [300, 700], to: [1400, 240], start: 1, count: 30, colour: "#2a2636"})
function batStream(t, look) {
  var from = look.from, to = look.to, long = look.long || 14, every = look.every || 0.25, count = look.count || 40;
  var size = look.size || 1, far = look.far || 0.25, spread = look.spread || 60, start = look.start || 0;
  pen.save();
  pen.lineCap = "round";
  for (var n = 0; n < count; n++) {
    var u = (t - start - n * every) / long;
    if (u <= 0 || u >= 1) { continue; }
    var side = (dice(n + 101) - 0.5) * spread * (1 - 0.6 * u), wob = 10 * Math.sin(t * 2.3 + n * 1.7) * (1 - u);
    var dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1;
    var bx = from[0] + dx * u - dy / len * side, by = from[1] + dy * u + dx / len * side + wob;
    var s = size * mix(1, far, Math.sqrt(u)), w = 9 * s * (0.85 + 0.3 * dice(n + 103));
    var flap = 6 * s * Math.sin(t * 34 + n * 1.7);
    pen.globalAlpha = (1 - between(u, 0.55, 1)) * clamp(u * 20);
    pen.strokeStyle = look.colour || "#16131c";
    pen.lineWidth = Math.max(0.8, 2.4 * s);
    pen.beginPath();
    pen.moveTo(bx - w, by - flap);
    pen.quadraticCurveTo(bx - w / 2, by + 2 * s, bx, by);
    pen.quadraticCurveTo(bx + w / 2, by + 2 * s, bx + w, by - flap);
    pen.stroke();
  }
  pen.restore();
}

// ---------- fireflies far off ----------
// Far away a firefly is a point, not a glow: a short flash (about a third of a second) that brightens fast and dies
// slower, then dark for two to five seconds, each in its own time, drifting a little, and dimmer the farther (higher
// on the sheet, nearer the hills). look: box ([x0, y0, x1, y1], where they are), count (60), seed.
// t the second. look must be given, with box (pixels of the sheet). Returns nothing: it draws with pen,
// and leaves pen's fillStyle set.
// e.g. farFireflies(clock, {box: [0, 640, 1920, 900], count: 80})
function farFireflies(t, look) {
  var box = look.box, count = look.count || 60, seed = look.seed || 0;
  for (var n = 0; n < count; n++) {
    var k = n + seed * 1000, gap = 2 + 3 * dice(k + 201), at = (t + dice(k + 202) * gap) % gap;
    var flash = at < 0.08 ? at / 0.08 : Math.max(0, 1 - (at - 0.08) / 0.3);
    if (flash <= 0.01) { continue; }
    var x = box[0] + dice(k + 203) * (box[2] - box[0]) + 14 * Math.sin(t * 0.3 + n);
    var y = box[1] + dice(k + 204) * (box[3] - box[1]) + 5 * Math.sin(t * 0.5 + n * 2);
    var near = 0.45 + 0.55 * (y - box[1]) / Math.max(1, box[3] - box[1]);   // the lower, the nearer: a little brighter and larger
    var a = flash * near * 0.85, r = 1 + 1.2 * near;
    var glow = pen.createRadialGradient(x, y, 0, x, y, r * 4);
    glow.addColorStop(0, "rgba(214, 255, 130, " + (0.45 * a).toFixed(3) + ")");
    glow.addColorStop(1, "rgba(214, 255, 130, 0)");
    pen.fillStyle = glow;
    pen.beginPath(); pen.arc(x, y, r * 4, 0, Math.PI * 2); pen.fill();
    pen.fillStyle = "rgba(244, 255, 200, " + a.toFixed(3) + ")";
    pen.beginPath(); pen.arc(x, y, r, 0, Math.PI * 2); pen.fill();
  }
}
