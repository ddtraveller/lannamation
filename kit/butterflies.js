// butterflies.js - four butterflies and four dragonflies of the north (dragonfly(), at its end), for films made with
// oldcartoon.js. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="butterflies.js"></script>
//
// and call butterfly(kind, x, y, t, look) from a scene: (x, y) is the middle of its body, seen from above, its head
// toward "turn" (0 is up). Flying, its wings beat; resting on a flower (look.rest), they open and close slowly. The
// kinds are the keys of BUTTERFLIES: the golden birdwing (Troides aeacus) of Doi Suthep's forests, black forewings
// and gold hindwings, the largest of them and protected in Thailand; the leopard lacewing (Cethosia cyane), orange
// and black with a white band, common in Chiang Mai's gardens; the common bluebottle (Graphium sarpedon), black with
// a band of see-through blue-green, quick over the flowers; and the common grass yellow (Eurema hecabe), small and
// bright, everywhere in the grass. Drawn from what each is, in flat colour inside a fine dark line.
//
// butterflyDrift(t, x, y, look) gives where a butterfly is at second t as it wanders: a course that dips and lifts
// with its wingbeats and turns as it goes.
//
//     var b = butterflyDrift(clock, 300, 500, {vx: 60, seed: 2});
//     butterfly("lacewing", b.x, b.y, clock, {turn: b.turn, size: 0.8});
//
// The names a look may have (butterfly() warns about any other):
//   size   1 is as large as it is beside the cast at their own sizes (a birdwing about 70 across, a grass yellow 26)
//   turn   radians its head is turned from up
//   rest   true: it sits on a flower, wings opening and closing slowly; else it flies
//   flap   wingbeats a second when flying (its kind's own when left out)
//   seed   a number, so that two of a kind do not beat as one
var BUTTERFLY_KEYS = {size: true, turn: true, rest: true, flap: true, seed: true};

// Each kind: its span at size 1, its wingbeats a second, the colours of its body and wings, and the painter of
// the markings on one side's two wings. thai: its Thai name; say: how that is said.
var BUTTERFLIES = {
  birdwing: {span: 70, flap: 3.2, body: "#1c1712", belly: "#e8c23a", fore: "#1f1a16", hind: "#f2c21e", line: "#120e0a",
             thai: "ผีเสื้อถุงทองป่าสูง", say: "phi suea thung thong pa sung", marks: butterflyBirdwingMarks},
  lacewing: {span: 46, flap: 5, body: "#3a2416", belly: "#d8742a", fore: "#e8742a", hind: "#ef8a34", line: "#2a1a10",
             thai: "ผีเสื้อหนอนใบกระทกรก", say: "phi suea non bai krathok rok", marks: butterflyLacewingMarks},
  bluebottle: {span: 40, flap: 7, body: "#1a1a1a", belly: "#5a5a5a", fore: "#232220", hind: "#232220", line: "#0e0e0e",
               thai: "ผีเสื้อสะพายฟ้า", say: "phi suea saphai fa", marks: butterflyBluebottleMarks},
  grassyellow: {span: 26, flap: 8, body: "#4a4020", belly: "#e8d24a", fore: "#f6d82a", hind: "#f8e04a", line: "#4a3a10",
                thai: "ผีเสื้อเหลืองหนามธรรมดา", say: "phi suea lueang nam thammada", marks: butterflyGrassYellowMarks}
};

// The outline of one forewing, on the right side of the body, its root at (0, 0) and its tip up and out.
// span: the half-span it reaches; pointed: 0 (round, the grass yellow) to 1 (the bluebottle's long point).
// Returns nothing: it begins a new path on pen and closes it, unfilled.
// e.g. butterflyForePath(35, 0.4); pen.fill();
function butterflyForePath(span, pointed) {
  pen.beginPath();
  pen.moveTo(0, -2);
  pen.bezierCurveTo(span * 0.3, -span * 0.62, span * (0.78 + pointed * 0.2), -span * (0.86 + pointed * 0.1), span * (1.08 + pointed * 0.1), -span * (0.7 + pointed * 0.12));
  pen.bezierCurveTo(span * 1.16, -span * 0.48, span * (1.02 - pointed * 0.15), -span * 0.16, span * 0.7, span * 0.04);
  pen.quadraticCurveTo(span * 0.34, span * 0.1, 0, 2);
  pen.closePath();
}

// The outline of one hindwing, on the right side, its root at (0, 0), rounded and hanging below the forewing;
// "tail" gives it a swallowtail's point (none of the four has one), "scallop" waves its edge (the lacewing's).
// span: as butterflyForePath(); tail, scallop: 0 to 1. Returns nothing: it begins a path on pen and closes it.
// e.g. butterflyHindPath(35, 0, 0.6); pen.fill();
function butterflyHindPath(span, tail, scallop) {
  var n, a, r, points = [];
  for (n = 0; n <= 16; n++) {
    a = -0.15 + n / 16 * 1.75;                     // from out along the body's side, round to below the body
    r = span * (0.62 - 0.2 * Math.max(0, (n - 10) / 6)) * (1 + scallop * 0.07 * Math.cos(n * 2.2));
    if (tail && n === 12) { r += span * 0.3 * tail; }
    points.push([Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.9 + span * 0.06]);
  }
  pen.beginPath();
  pen.moveTo(0, 0);
  for (n = 0; n <= 16; n++) { pen.lineTo(points[n][0], points[n][1]); }
  pen.lineTo(0, span * 0.3);
  pen.closePath();
}

// Fills and inks the path pen holds: "paint" (a colour or a gradient), its line "line" at the kit's LINE.
// Returns nothing. e.g. butterflyFill("#f2c21e", "#120e0a");
function butterflyFill(paint, line) {
  pen.fillStyle = paint;
  pen.fill();
  pen.strokeStyle = line;
  pen.lineWidth = LINE * 0.7;
  pen.lineJoin = "round";
  pen.stroke();
}

// The golden birdwing's markings on one side (span its half-span): pale streaks between the forewing's black
// veins; on the gold hindwing, black veins, a black border and a row of black spots inside it.
// Returns nothing: it draws with pen, inside the wing shapes already painted.
// e.g. butterflyBirdwingMarks(35, kind);
function butterflyBirdwingMarks(span, kind) {
  var n;
  pen.save();
  butterflyForePath(span, 0.35);
  pen.clip();
  pen.strokeStyle = "rgba(200, 200, 190, 0.35)";
  pen.lineWidth = span * 0.035;
  pen.beginPath();
  for (n = 0; n < 6; n++) {
    var a = -1.25 + n * 0.17;
    pen.moveTo(Math.cos(a) * span * 0.25, Math.sin(a) * span * 0.25);
    pen.lineTo(Math.cos(a) * span * 0.95, Math.sin(a) * span * 0.95);
  }
  pen.stroke();
  pen.restore();
  pen.save();
  butterflyHindPath(span, 0, 0.3);
  pen.clip();
  pen.strokeStyle = "#1a140c";                      // the border
  pen.lineWidth = span * 0.16;
  butterflyHindPath(span, 0, 0.3);
  pen.stroke();
  pen.lineWidth = span * 0.03;                      // the veins
  pen.beginPath();
  for (n = 0; n < 6; n++) {
    var b = 0.05 + n * 0.25;
    pen.moveTo(0, span * 0.05);
    pen.lineTo(Math.cos(b) * span * 0.7, Math.sin(b) * span * 0.62 + span * 0.06);
  }
  pen.stroke();
  pen.fillStyle = "#1a140c";                        // the spots inside the border
  for (n = 0; n < 5; n++) {
    var c = 0.2 + n * 0.28;
    pen.beginPath();
    pen.arc(Math.cos(c) * span * 0.48, Math.sin(c) * span * 0.44 + span * 0.06, span * 0.045, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// The leopard lacewing's markings on one side: the forewing's outer half black with a white band across it, the
// hindwing's scalloped border black with white points, and black spots on the orange.
// Returns nothing: it draws with pen. e.g. butterflyLacewingMarks(23, kind);
function butterflyLacewingMarks(span, kind) {
  var n;
  pen.save();
  butterflyForePath(span, 0.2);
  pen.clip();
  pen.fillStyle = "#1e140e";                        // the black outer half
  pen.beginPath();
  pen.moveTo(span * 0.45, -span * 1.2);
  pen.lineTo(span * 1.4, -span * 1.2);
  pen.lineTo(span * 1.4, span * 0.3);
  pen.lineTo(span * 0.62, span * 0.1);
  pen.quadraticCurveTo(span * 0.42, -span * 0.4, span * 0.45, -span * 1.2);
  pen.fill();
  pen.strokeStyle = "#fbf6ea";                      // the white band
  pen.lineWidth = span * 0.13;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(span * 0.6, -span * 0.82);
  pen.quadraticCurveTo(span * 0.78, -span * 0.45, span * 0.74, -span * 0.12);
  pen.stroke();
  pen.restore();
  pen.save();
  butterflyHindPath(span, 0, 1);
  pen.clip();
  pen.strokeStyle = "#1e140e";
  pen.lineWidth = span * 0.2;
  butterflyHindPath(span, 0, 1);
  pen.stroke();
  pen.fillStyle = "#fbf6ea";
  for (n = 0; n < 7; n++) {
    var a = 0.0 + n * 0.24;
    pen.beginPath();
    pen.arc(Math.cos(a) * span * 0.6, Math.sin(a) * span * 0.55 + span * 0.06, span * 0.03, 0, 7);
    pen.fill();
  }
  pen.fillStyle = "#1e140e";
  for (n = 0; n < 4; n++) {
    var b = 0.3 + n * 0.32;
    pen.beginPath();
    pen.arc(Math.cos(b) * span * 0.36, Math.sin(b) * span * 0.33 + span * 0.06, span * 0.04, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// The common bluebottle's markings on one side: a band of pale blue-green across both wings from the forewing's
// tip to the hindwing's edge, and a red spot by the hindwing's border. Returns nothing: it draws with pen.
// e.g. butterflyBluebottleMarks(20, kind);
function butterflyBluebottleMarks(span, kind) {
  var band = pen.createLinearGradient(span * 0.7, -span * 0.8, span * 0.2, span * 0.5);
  band.addColorStop(0, "#9fe0d8");
  band.addColorStop(1, "#4fb8c8");
  pen.save();
  butterflyForePath(span, 0.9);
  pen.clip();
  pen.fillStyle = band;
  pen.beginPath();                                  // a chain of panes, wide at the body, small toward the tip
  for (var n = 0; n < 5; n++) {
    var u = n / 5, cx = mix(span * 0.22, span * 0.72, u), cy = mix(-span * 0.08, -span * 0.66, u), r = span * (0.12 - u * 0.06);
    pen.moveTo(cx + r, cy);
    pen.ellipse(cx, cy, r, r * 0.8, -0.8, 0, 7);
  }
  pen.fill();
  pen.restore();
  pen.save();
  butterflyHindPath(span, 0, 0.4);
  pen.clip();
  pen.fillStyle = band;
  pen.beginPath();
  pen.ellipse(span * 0.18, span * 0.12, span * 0.2, span * 0.13, 0.6, 0, 7);
  pen.fill();
  pen.fillStyle = "#d8402a";
  pen.beginPath();
  pen.arc(span * 0.28, span * 0.52, span * 0.045, 0, 7);
  pen.fill();
  pen.restore();
}

// The grass yellow's markings on one side: the forewing's outer edge bordered black. Returns nothing.
// e.g. butterflyGrassYellowMarks(13, kind);
function butterflyGrassYellowMarks(span, kind) {
  pen.save();
  butterflyForePath(span, 0);
  pen.clip();
  pen.strokeStyle = "#3a2c10";
  pen.lineWidth = span * 0.22;
  pen.beginPath();
  pen.moveTo(span * 0.55, -span * 0.95);
  pen.bezierCurveTo(span * 1.05, -span * 0.75, span * 1.05, -span * 0.3, span * 0.75, 0);
  pen.stroke();
  pen.restore();
}

// One side's two wings, at root (0, 0) on the body's right, painted and marked. kind: an entry of BUTTERFLIES.
// span: the half-span. Returns nothing: it draws with pen.
// e.g. butterflyWings(BUTTERFLIES.lacewing, 23);
function butterflyWings(kind, span) {
  var pointed = {birdwing: 0.35, lacewing: 0.2, bluebottle: 0.9, grassyellow: 0}[kind.name] || 0.3;
  var tail = 0, scallop = kind.name === "lacewing" ? 1 : kind.name === "birdwing" ? 0.3 : 0;
  butterflyHindPath(span, tail, scallop);
  butterflyFill(kind.hind, kind.line);
  butterflyForePath(span, pointed);
  var fade = pen.createLinearGradient(0, 0, span, -span * 0.6);
  fade.addColorStop(0, blend(kind.fore, "#000000", 0.15));
  fade.addColorStop(1, kind.fore);
  butterflyFill(fade, kind.line);
  kind.marks(span, kind);
  butterflyHindPath(span, tail, scallop);            // the lines again over the markings
  pen.strokeStyle = kind.line;
  pen.lineWidth = LINE * 0.7;
  pen.stroke();
  butterflyForePath(span, pointed);
  pen.stroke();
}

// A butterfly of "kind" (a key of BUTTERFLIES), seen from above, (x, y) the middle of its body, at second t.
//   look   BUTTERFLY_KEYS (at the top of this file); it may be left out
// Returns nothing: it draws with pen, and leaves pen, LINE and FINE as they were.
// e.g. butterfly("birdwing", 700, 400, clock, {turn: 0.4, size: 1.2})
function butterfly(kind, x, y, t, look) {
  look = look || {};
  checkNames("A butterfly's look", look, BUTTERFLY_KEYS);
  if (!BUTTERFLIES[kind]) { checkName("The butterfly", kind, BUTTERFLIES); return; }
  var k = Object.assign({name: kind}, BUTTERFLIES[kind]), size = look.size || 1, span = k.span / 2, seed = look.seed || 0;
  var open;
  if (look.rest) {                                  // perched: open, then slowly shut and open again
    var slow = 0.5 + 0.5 * Math.cos(t * 1.3 + seed * 2.1);
    open = 0.25 + 0.75 * Math.pow(slow, 0.6);
  } else {
    open = 0.12 + 0.88 * Math.abs(Math.cos((t + seed * 0.37) * Math.PI * (look.flap || k.flap)));
  }
  var keepLine = LINE;
  LINE = STYLE.line * Math.min(1, 0.4 + 0.3 * size) / size;
  pen.save();
  pen.translate(x, y);
  pen.rotate(look.turn || 0);
  pen.scale(size, size);
  pen.save();                                       // its shadow on what lies under it, when it sits
  if (look.rest) {
    pen.fillStyle = "rgba(30, 40, 20, 0.12)";
    pen.beginPath();
    pen.ellipse(2, 3, span * open * 0.8, span * 0.5, 0, 0, 7);
    pen.fill();
  }
  pen.restore();
  for (var side = -1; side <= 1; side += 2) {
    pen.save();
    pen.scale(side * open, 1);
    butterflyWings(k, span);
    pen.restore();
  }
  pen.beginPath();                                  // the body: head, thorax, the long abdomen
  pen.ellipse(0, span * 0.22, span * 0.07, span * 0.42, 0, 0, 7);
  butterflyFill(k.belly, k.line);
  pen.beginPath();
  pen.ellipse(0, -span * 0.08, span * 0.1, span * 0.17, 0, 0, 7);
  butterflyFill(k.body, k.line);
  pen.beginPath();
  pen.arc(0, -span * 0.3, span * 0.07, 0, 7);
  butterflyFill(k.body, k.line);
  pen.strokeStyle = k.line;                         // the feelers, clubbed at their ends
  pen.lineWidth = Math.max(0.8, span * 0.03);
  pen.beginPath();
  pen.moveTo(-span * 0.03, -span * 0.34);
  pen.quadraticCurveTo(-span * 0.12, -span * 0.6, -span * 0.22, -span * 0.75);
  pen.moveTo(span * 0.03, -span * 0.34);
  pen.quadraticCurveTo(span * 0.12, -span * 0.6, span * 0.22, -span * 0.75);
  pen.stroke();
  pen.fillStyle = k.line;
  pen.beginPath();
  pen.arc(-span * 0.22, -span * 0.75, span * 0.035 + 0.5, 0, 7);
  pen.arc(span * 0.22, -span * 0.75, span * 0.035 + 0.5, 0, 7);
  pen.fill();
  pen.restore();
  LINE = keepLine;
}

// Where a wandering butterfly is at second t: it drifts from (x, y) at (vx, vy) pixels a second, dipping and
// lifting with its wingbeats and weaving to each side; it faces the way it goes.
//   look   {vx, vy (pixels a second, 0 when left out), weave (pixels, 40), seed}
// Returns {x, y, turn}: pixels of the sheet, and radians from up. Changes nothing.
// e.g. var b = butterflyDrift(clock, 300, 500, {vx: 60, seed: 2});
function butterflyDrift(t, x, y, look) {
  look = look || {};
  var seed = look.seed || 0, weave = look.weave === undefined ? 40 : look.weave, vx = look.vx || 0, vy = look.vy || 0;
  function at(s) {
    return [x + vx * s + weave * Math.sin(s * 0.9 + seed) + weave * 0.4 * Math.sin(s * 2.3 + seed * 3),
            y + vy * s + weave * 0.6 * Math.sin(s * 1.3 + seed * 2) + 6 * Math.sin(s * 9 + seed)];
  }
  var now = at(t), soon = at(t + 0.15);
  return {x: now[0], y: now[1], turn: Math.atan2(soon[0] - now[0], -(soon[1] - now[1])) * 0.6};
}

// ---------- dragonflies (แมลงปอ) ----------
// The owner, 2026-11-07, of the White Eel: "Go through the scenes and add dragonflies and birds as appropriate." Four
// dragonflies common over the rice fields, ponds and marshes of the north, seen from above as the butterflies are: the
// scarlet skimmer (Crocothemis servilia), all red; the wandering glider (Pantala flavescens), gold, that comes in swarms
// before the rains; the green marsh hawk (Orthetrum sabina), green banded with black, its abdomen swollen at the root;
// and the grasshawk (Neurothemis fluctuans), red, its wings stained amber to their middles. Each is drawn from what it
// is: a round head that is nearly all eye, a short thorax, four long clear wings with a dark spot near each tip, and a
// long thin abdomen in rings. At size 1 one is 30 long and 34 across, twice as large beside the cast as it would be,
// as the butterflies are, so that it reads on a sheet 1920 wide.
//
//     var d = dragonflyDart(clock, [300, 600, 700, 760], {seed: 3});
//     dragonfly("scarlet", d.x, d.y, clock, {turn: d.turn, size: 0.8});
//
// dragonfly(kind, x, y, t, look): (x, y) the middle of its thorax; its head toward "turn" (0 is up). Flying, its wings
// shimmer, a blur at their beat; resting (look.rest), they lie still, flat out to the sides.
//   size   1 is 30 long; turn: radians its head is turned from up; rest: true, it sits with its wings still;
//   seed   a number, so that two do not shimmer as one
var DRAGONFLY_KEYS = {size: true, turn: true, rest: true, seed: true};
var DRAGONFLIES = {
  scarlet: {body: "#c8281e", tail: "#d8301e", eye: "#a01814", wing: "rgba(236, 242, 246, 0.34)", base: null, spot: "#7a2a18", line: "#4a1410"},
  glider: {body: "#a8742a", tail: "#d8a23a", eye: "#8a3a1e", wing: "rgba(246, 240, 214, 0.36)", base: null, spot: "#c8a24a", line: "#4a3014"},
  marshhawk: {body: "#6a8a2a", tail: "#9ab83a", eye: "#3a5a2a", wing: "rgba(236, 244, 240, 0.32)", base: null, spot: "#2a2a1e", line: "#1e2a12", bands: "#1e2016", swollen: true},
  grasshawk: {body: "#9a2a1e", tail: "#b8341e", eye: "#7a1e14", wing: "rgba(240, 232, 226, 0.3)", base: "rgba(176, 74, 30, 0.55)", spot: "#6a2414", line: "#3a1410"}
};

// One wing, from its root at (0, 0) out along +x: long and narrow, its trailing edge fuller near the body on a hind
// wing; the dark spot (pterostigma) near the tip; a stain over its inner half if the kind has one.
function dragonflyWing(k, long, chord, hind, alpha) {
  var wing = new Path2D();
  wing.moveTo(0, -chord * 0.25);
  wing.quadraticCurveTo(long * 0.5, -chord * 0.62, long * 0.96, -chord * 0.2);
  wing.quadraticCurveTo(long * 1.02, chord * 0.1, long * 0.9, chord * 0.34);
  wing.quadraticCurveTo(long * 0.45, chord * (hind ? 0.9 : 0.55), 0, chord * (hind ? 0.75 : 0.3));
  wing.closePath();
  pen.save();
  pen.globalAlpha *= alpha;
  pen.fillStyle = k.wing;
  pen.fill(wing);
  if (k.base) {
    pen.save(); pen.clip(wing);
    pen.fillStyle = k.base;
    pen.fillRect(0, -chord, long * 0.55, chord * 2);
    pen.restore();
  }
  pen.strokeStyle = "rgba(60, 50, 40, 0.45)";        // its edge, and the long vein near its front
  pen.lineWidth = 0.5;
  pen.stroke(wing);
  pen.beginPath(); pen.moveTo(1, -chord * 0.18); pen.quadraticCurveTo(long * 0.5, -chord * 0.5, long * 0.9, -chord * 0.22); pen.stroke();
  pen.fillStyle = k.spot;
  pen.beginPath(); pen.ellipse(long * 0.84, -chord * 0.3, long * 0.045, chord * 0.12, -0.12, 0, 7); pen.fill();
  pen.restore();
}

function dragonfly(kind, x, y, t, look) {
  look = look || {};
  checkNames("A dragonfly's look", look, DRAGONFLY_KEYS);
  if (!DRAGONFLIES[kind]) { checkName("The dragonfly", kind, DRAGONFLIES); return; }
  var k = DRAGONFLIES[kind], size = look.size || 1, seed = look.seed || 0;
  pen.save();
  pen.translate(x, y);
  pen.rotate(look.turn || 0);
  pen.scale(size, size);
  // the wings: still when it rests; flying, each pair sweeps a little forward and back at its beat, and a faint blur
  // shows where they have been
  var beat = look.rest ? 0 : Math.sin((t + seed * 0.13) * Math.PI * 2 * 26), blur = look.rest ? 0 : 1;
  [[-2.4, 16.5, 3.4, false, -0.12], [0.4, 15.5, 4.4, true, 0.1]].forEach(function (w) {   // fore, hind: root, long, chord, hind, lean
    for (var side = -1; side <= 1; side += 2) {
      pen.save();
      pen.translate(side * 1.6, w[0]);
      pen.scale(side, 1);
      if (blur) {                                    // the blur of the beat: the wing at both ends of its sweep, faint
        [-1, 1].forEach(function (end) {
          pen.save(); pen.rotate(w[4] + end * 0.22); dragonflyWing(k, w[1], w[2], w[3], 0.35); pen.restore();
        });
      }
      pen.rotate(w[4] + beat * 0.22 * blur);
      dragonflyWing(k, w[1], w[2], w[3], blur ? 0.75 : 1);
      pen.restore();
    }
  });
  pen.lineWidth = 0.7;                               // the abdomen: ten rings, thin, from the thorax back; swollen at its root on the marsh hawk
  pen.strokeStyle = k.line;
  for (var n = 0; n < 10; n++) {
    var y0 = 2.6 + n * 1.85, wide = (k.swollen && n < 2 ? 1.5 : 1.05) - n * 0.035;
    pen.beginPath();
    pen.ellipse(0, y0 + 0.9, wide, 1.05, 0, 0, 7);
    pen.fillStyle = k.bands && n % 2 ? k.bands : k.tail;
    pen.fill(); pen.stroke();
  }
  pen.beginPath(); pen.moveTo(-0.5, 21.6); pen.lineTo(-0.9, 23.4); pen.moveTo(0.5, 21.6); pen.lineTo(0.9, 23.4); pen.stroke();   // the claspers
  pen.beginPath();                                   // the thorax
  pen.ellipse(0, -0.6, 2.2, 3.4, 0, 0, 7);
  pen.fillStyle = k.body; pen.fill(); pen.stroke();
  pen.beginPath();                                   // the head: two great eyes that meet on top
  pen.ellipse(-1.25, -5.2, 1.6, 1.8, 0, 0, 7); pen.ellipse(1.25, -5.2, 1.6, 1.8, 0, 0, 7);
  pen.fillStyle = k.eye; pen.fill(); pen.stroke();
  pen.fillStyle = "rgba(255, 255, 255, 0.55)";
  pen.beginPath(); pen.arc(-1.6, -5.8, 0.45, 0, 7); pen.arc(0.9, -5.8, 0.45, 0, 7); pen.fill();
  pen.restore();
}

// Where a dragonfly is at second t as it hunts over a patch of water or grass: it hangs in the air at a spot, bobbing
// a little, then darts in a quarter of a second to another spot in the box, and hangs there; it faces where it darted.
//   box    [x0, y0, x1, y1] in pixels of the sheet, where its spots are
//   look   {seed (which spots and when), hold (seconds it hangs, 1.4 on average)}
// Returns {x, y, turn}: pixels of the sheet, and radians from up. Changes nothing.
// e.g. var d = dragonflyDart(clock, [300, 600, 700, 760], {seed: 3});
function dragonflyDart(t, box, look) {
  look = look || {};
  var seed = look.seed || 0, hold = look.hold || 1.4, dart = 0.25;
  function spot(n) {
    return [mix(box[0], box[2], dice(seed * 31 + n * 2 + 1)), mix(box[1], box[3], dice(seed * 31 + n * 2 + 2))];
  }
  function stay(n) { return hold * (0.5 + dice(seed * 17 + n + 5)); }
  var n = 0, from = -dice(seed + 3) * hold;          // the legs, from before the film begins: hang, then dart
  while (n < 10000) {
    var end = from + stay(n) + dart;
    if (t < end) { break; }
    from = end; n += 1;
  }
  var a = spot(n), b = spot(n + 1), u = clamp((t - (from + stay(n))) / dart), e = u * u * (3 - 2 * u);
  var last = n > 0 ? spot(n - 1) : [a[0] - 1, a[1]];
  var toward = u > 0 ? Math.atan2(b[0] - a[0], -(b[1] - a[1])) : Math.atan2(a[0] - last[0], -(a[1] - last[1]));
  return {x: mix(a[0], b[0], e) + 1.5 * Math.sin(t * 7 + seed), y: mix(a[1], b[1], e) + 2 * Math.sin(t * 5.3 + seed * 2), turn: toward};
}
