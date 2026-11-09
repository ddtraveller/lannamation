// people.js - the twenty painted people, drawn by person() and named in cast(), and the generator that mixes new women.
// The owner, 2026-11-01: "Some new sprites were created. I want them moved to the old model system and to get rid of the
// new system", then of what to keep: the figure itself, its faces, hair and hands, and "a system that could generate these
// kind of women figures". A look with `woman`, `man` or `child` is painted by the painters below (load this file last, after
// oldcartoon.js, weaving.js and, for a worn cloth, sabai.js and sabai_finish.js); any other
// look is person()'s own, so both can share a scene. person() works out the arms: handA, handB, reachA and reachB go
// through its rig on a sheet nobody sees, and the painted arm takes the place the rig gives. A walk (step, stride, so
// stroll()), a wai, a seat (floor) and a look (at) are taken by the figure; face -1 mirrors it. It is always drawn in
// three-quarter view: turn, twist, the hop and a lean (bend) are not read. Returns joints as person() does, where the painted figure has them.
// e.g. person(700, GROUND, cast("naildancer", {size: 1.4}));
//      var w = stroll(t, 200, 1500, 0, cast("princess")); person(w.x, GROUND, w.look);
//      person(700, GROUND, castMix(17, {size: 1.4}));
//
// In the parts below, a name such as mural_women.js in a comment is the part so headed: until 2026-11-01 each was a file of its own.

// ========== the figure (until 2026-11-01, mural.js) ==========
// The figure as the Wat Phumin mural paints people, at the references' finish (2026-10-29; in the kit 2026-10-30, the
// owner: "Just like with the old kit style; hair, faces, outfits, jewelry should be swappable"). The owner, of set 6:
// "Go in the direction of V but recognize the quality difference in the images. Upgrade the image quality until it is
// as high as the quality in the reference images." person() draws a look with woman, man or child this way. A person is dressed from her look
// as the kit's are (hair, bun, shirt, sin, sabai, sarong, scarf, flower, bangles, collar, earplug, turban, age, feel),
// and her makeup and her jewellery are matched to what she wears (muMakeup, muJewels): change her clothes and they
// change with them. Not yet: arms that move and hold, walking, the faces of the north (look.north).
// What the paintings have that a flat drawing lacks, and how each is drawn here:
//   a brush line      every outline is a ribbon whose width swells on the side away from the light and wavers a
//                     little; a detail line tapers at both ends (mBrush)
//   pigment           each colour mottled, as paint on plaster is (a noise pattern multiplied in), and darker in a
//                     soft band inside its edge, so a limb or a face reads round with no modelled shade (mFill)
//   cloth             a sin of many fine stripes over its bands, woven figures in the bands, folds that the stripes
//                     follow; a sabai with folds, a patterned border and a fringe; a shirt creased at the elbow
//   the face          a long oval, a high forehead, a heavy upper lid with its crease and tail, a brow like a thread,
//                     a long nose line, a small mouth with its corners, rings on the neck, an ear with its plug
//   hair              a smooth dark mass drawn through with strands toward the knot
// Units: a head is 100 tall; the figure stands at (0, 0), three-quarter, facing right.
// muralPerson(x, y, look, opts): look a cast look; opts {head: pixels a head is tall}. person() calls it.

var MU = {nose: "exact", mouth: "ours", ear: 12, hair: "#1d1410", sheen: "#a08060", ink: "#4a1c12", line: 1.5, mute: 0.3, flush: 0.1, lips: "#b23c34", skinLady: 0.3, cheek: "dancer", feelLines: "brows", ageLines: "fall", tara: 0.5, fuller: 0.18, round: 0.8};
var MU_PX = 1;                                      // pixels per unit, while a figure is drawn
// The keys of a look that only this figure reads (the kit's own are LOOK_KEYS, written down above person()):
//   makeup   a grown woman's makeup, "red", "coral", "rose" or "berry" (MU_MAKEUP); left out, the one that goes with
//            her clothes (muMakeup()): lipstick, rouge and eye shadow
//   jewels   the metal of the jewellery, "gold" or "silver"; left out, the one that goes with the clothes (muJewels())
//   stones   the two colours of the stones in the jewellery; left out, those that go with the clothes (muJewels())
//   scarf    [colour, lining]: a long scarf of two colours looped over the arms and falling to the ground in curls, as a
//            thangka paints a lady's (thScarf(), mural_thangka.js)
var MURAL_LOOK_KEYS = {makeup: true, jewels: true, stones: true, scarf: true};

// ---------- paths that remember their points ----------
function MPath() { this.path = new Path2D(); this.subs = []; this.cur = null; this.at = [0, 0]; }
MPath.prototype.M = function (x, y) { this.cur = {pts: [[x, y]], closed: false}; this.subs.push(this.cur); this.path.moveTo(x, y); this.at = [x, y]; return this; };
MPath.prototype.L = function (x, y) { this.cur.pts.push([x, y]); this.path.lineTo(x, y); this.at = [x, y]; return this; };
MPath.prototype.C = function (a, b, c, d, x, y) {
  var p = this.at;
  for (var k = 1; k <= 14; k++) {
    var t = k / 14, u = 1 - t;
    this.cur.pts.push([u * u * u * p[0] + 3 * u * u * t * a + 3 * u * t * t * c + t * t * t * x, u * u * u * p[1] + 3 * u * u * t * b + 3 * u * t * t * d + t * t * t * y]);
  }
  this.path.bezierCurveTo(a, b, c, d, x, y); this.at = [x, y]; return this;
};
MPath.prototype.Q = function (a, b, x, y) {
  var p = this.at;
  for (var k = 1; k <= 10; k++) { var t = k / 10, u = 1 - t; this.cur.pts.push([u * u * p[0] + 2 * u * t * a + t * t * x, u * u * p[1] + 2 * u * t * b + t * t * y]); }
  this.path.quadraticCurveTo(a, b, x, y); this.at = [x, y]; return this;
};
MPath.prototype.Z = function () { this.cur.closed = true; this.path.closePath(); return this; };
MPath.prototype.E = function (x, y, rx, ry, turn) {
  var c = Math.cos(turn || 0), s = Math.sin(turn || 0), pts = [];
  for (var k = 0; k < 40; k++) { var a = k / 40 * Math.PI * 2, ex = Math.cos(a) * rx, ey = Math.sin(a) * ry; pts.push([x + ex * c - ey * s, y + ex * s + ey * c]); }
  this.poly(pts, true); return this;
};
MPath.prototype.poly = function (pts, closed) {
  this.M(pts[0][0], pts[0][1]);
  for (var k = 1; k < pts.length; k++) { this.L(pts[k][0], pts[k][1]); }
  if (closed) { this.Z(); }
  return this;
};

// ---------- colour ----------
function muColour(c) {                              // the mural's muted pigment: toward a warm grey of the same lightness
  if (!/^#[0-9a-f]{6}$/i.test(c)) { return c; }
  var v = parseInt(c.slice(1), 16), r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
  var grey = Math.round(0.3 * r + 0.59 * g + 0.11 * b);
  return blend(c, muHex(grey + 16, grey + 4, grey - 12), MU.mute);
}
function muHex(r, g, b) { return "#" + [r, g, b].map(function (n) { return ("0" + Math.max(0, Math.min(255, Math.round(n))).toString(16)).slice(-2); }).join(""); }
function muPattern(scale) {                        // the grain, turned off the square and scaled, so it shows no tiles
  var pat = pen.createPattern(muGrain(), "repeat");
  pat.setTransform(new DOMMatrix().rotate(23).scale(scale));
  return pat;
}
function muInk(c) { return /^#[0-9a-f]{6}$/i.test(c) ? blend(c, MU.ink, 0.86) : MU.ink; }
function muShade(c) { return /^#[0-9a-f]{6}$/i.test(c) ? blend(c, "#4a2418", 0.45) : "#4a2418"; }

// the plaster's mottle, made once: soft blotches over a fine grain
var MU_GRAIN = null;
function muGrain() {
  if (MU_GRAIN) { return MU_GRAIN; }
  var size = 512, can = document.createElement("canvas");
  can.width = can.height = size;
  var g = can.getContext("2d"), img = g.createImageData(size, size);
  function hash(x, y) { var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); }
  function smooth(x, y, cell) {
    var gx = x / cell, gy = y / cell, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0, n = size / cell;
    function at(i, j) { return hash(((i % n) + n) % n, ((j % n) + n) % n); }
    var sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    return mix(mix(at(x0, y0), at(x0 + 1, y0), sx), mix(at(x0, y0 + 1), at(x0 + 1, y0 + 1), sx), sy);
  }
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      var v = 0.42 * smooth(x, y, 128) + 0.26 * smooth(x, y, 32) + 0.16 * smooth(x, y, 8) + 0.08 * smooth(x, y, 2) + 0.08 * hash(x, y);
      var k = 255 - Math.round(80 * Math.pow(v, 1.8)), i = (y * size + x) * 4;
      img.data[i] = k; img.data[i + 1] = Math.round(k * 0.985); img.data[i + 2] = Math.round(k * 0.96); img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  MU_GRAIN = can;
  return can;
}

// ---------- paint and line ----------
// Paint a shape: its colour, the mottle, and the soft darker band inside its edge (deeper on the side away from the
// light, below and to the right). round: how wide that band is, in units (0 for none).
function mFill(rec, colour, round) {
  var c = muColour(colour);
  pen.fillStyle = c;
  pen.fill(rec.path);
  pen.save();
  pen.clip(rec.path);
  pen.globalCompositeOperation = "multiply";
  pen.globalAlpha = 0.6;
  pen.fillStyle = muPattern(0.6);
  pen.fillRect(-2000, -2000, 4000, 4000);
  pen.globalCompositeOperation = "source-over";
  pen.globalAlpha = 1;
  if (round !== 0) {
    var w = round || 10, dark = muShade(c);
    pen.translate(w * 0.25, w * 0.35);
    pen.strokeStyle = dark;
    pen.lineJoin = "round";
    [[w * 2.6, 0.07], [w * 1.7, 0.08], [w * 0.9, 0.1], [w * 0.35, 0.12]].forEach(function (b) {
      pen.globalAlpha = b[1];
      pen.lineWidth = b[0];
      pen.stroke(rec.path);
    });
  }
  pen.restore();
}
// Ink a path with the brush: each outline a ribbon, fuller on the side away from the light and wavering a little; an
// open line tapering to its ends. weight: pixels at its fullest (default MU.line).
function mBrush(rec, colour, weight) {
  var base = (weight || MU.line) * (0.55 + 0.55 * MU_PX) / MU_PX, light = [0.55, 0.83];
  pen.fillStyle = colour;
  rec.subs.forEach(function (sub, si) {
    var p = sub.pts, n = p.length;
    if (n < 2) { return; }
    var area = 0;
    for (var k = 0; k < n; k++) { var q = p[(k + 1) % n]; area += p[k][0] * q[1] - q[0] * p[k][1]; }
    var flip = sub.closed && area > 0 ? -1 : 1;
    var left = [], right = [];
    for (k = 0; k < n; k++) {
      var a = p[sub.closed ? (k - 1 + n) % n : Math.max(0, k - 1)], b = p[sub.closed ? (k + 1) % n : Math.min(n - 1, k + 1)];
      var tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1, nx = -ty / l * flip, ny = tx / l * flip;
      var away = sub.closed ? Math.max(0, nx * light[0] + ny * light[1]) : 0.5;
      var taper = sub.closed ? 1 : Math.max(0.12, Math.pow(Math.sin(Math.PI * k / (n - 1)), 0.55));
      var w = base * (0.55 + 0.75 * away) * taper * (1 + 0.12 * Math.sin(k * 0.83 + si * 2.1)) / 2;
      left.push([p[k][0] + nx * w, p[k][1] + ny * w]);
      right.push([p[k][0] - nx * w, p[k][1] - ny * w]);
    }
    var ribbon = new Path2D();
    if (sub.closed) {
      ribbon.moveTo(left[0][0], left[0][1]); left.forEach(function (q) { ribbon.lineTo(q[0], q[1]); }); ribbon.closePath();
      ribbon.moveTo(right[0][0], right[0][1]); right.forEach(function (q) { ribbon.lineTo(q[0], q[1]); }); ribbon.closePath();
      pen.fill(ribbon, "evenodd");
    } else {
      ribbon.moveTo(left[0][0], left[0][1]); left.forEach(function (q) { ribbon.lineTo(q[0], q[1]); });
      for (k = n - 1; k >= 0; k--) { ribbon.lineTo(right[k][0], right[k][1]); }
      ribbon.closePath();
      pen.fill(ribbon);
    }
  });
}
function mShape(rec, colour, round, weight) { mFill(rec, colour, round); mBrush(rec, muInk(muColour(colour)), weight); }
function mLine(rec, colour, weight) { mBrush(rec, colour, weight); }

// ---------- tubes, limbs ----------
function muBent(A, J, B) {
  var C = [2 * J[0] - (A[0] + B[0]) / 2, 2 * J[1] - (A[1] + B[1]) / 2];
  return function (t) { var a = 1 - t; return [a * a * A[0] + 2 * a * t * C[0] + t * t * B[0], a * a * A[1] + 2 * a * t * C[1] + t * t * B[1]]; };
}
function muTube(at, wide, from, to) {
  from = from || 0; to = to === undefined ? 1 : to;
  var N = 40, left = [], right = [];
  function tangent(t) { var a = at(Math.max(0, t - 0.01)), b = at(Math.min(1, t + 0.01)), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; }
  for (var n = 0; n <= N; n++) {
    var t = from + (to - from) * n / N, p = at(t), T = tangent(t);
    left.push([p[0] - T[1] * wide(t, 1), p[1] + T[0] * wide(t, 1)]);
    right.push([p[0] + T[1] * wide(t, -1), p[1] - T[0] * wide(t, -1)]);
  }
  function cap(t, sign) {
    var p = at(t), T = tangent(t), nx = -T[1], ny = T[0], w = (wide(t, 1) + wide(t, -1)) / 2, out = [];
    for (var k = 1; k < 12; k++) { var th = Math.PI * k / 12, c = Math.cos(th) * sign, s = Math.sin(th) * sign; out.push([p[0] + w * (nx * c + T[0] * s), p[1] + w * (ny * c + T[1] * s)]); }
    return out;
  }
  var pts = left.concat(cap(to, 1), right.reverse(), cap(from, -1));
  return new MPath().poly(pts, true);
}
function muEase(a, b, u) { u = clamp(u); return a + (b - a) * u * u * (3 - 2 * u); }
function muBump(t, at, spread) { var u = (t - at) / spread; return Math.exp(-u * u); }
function muLimbWide(w, bellies) {
  return function (t, side) {
    var base = t < 0.5 ? muEase(w[0], w[1], t / 0.5) : muEase(w[1], w[2], (t - 0.5) / 0.5);
    return base + bellies[0] * muBump(t, 0.22, 0.13) * (side > 0 ? 1.2 : 0.7) + bellies[1] * muBump(t, 0.66, 0.12) * (side > 0 ? 0.6 : 1.3);
  };
}

// MU_FINGERS: how long the dancer's fingers are, of mural.js's 36 to 48 on a palm of 35 (the owner, 2026-11-09: "Make the
// fingers shorter and more normal looking on the painted women"; the women who do not dance have hands "normal")
var MU_FINGERS = 0.72;
// a hand from the thumb's edge, its long fingers bending back from the knuckles, each nail a pale crescent
function muHand(x, y, angle, back, bend, skin, lady) {
  // Seen from the thumb's edge the fingers lie nearly one behind the other, bending back together from the knuckles in
  // one long curve, the tips most; the thumb along the palm's side, a little out. The whole hand is one shape in one
  // line (every part inked, then every part painted over the inside lines), with a fine line between the fingers.
  pen.save();
  pen.translate(x, y);
  pen.rotate(angle - Math.PI / 2);
  pen.scale(back, 1);
  var parts = [], gaps = new MPath();
  [[36, 1.08, 1.6, 28.5], [45, 1.04, 0.8, 30], [48, 1, 0, 30.5], [44, 0.96, -1, 30]].forEach(function (f, i) {   // little, ring, middle, first
    var b = bend * f[1], root = [f[2], f[3]], L = f[0] * MU_FINGERS;
    var tip = [root[0] + L * Math.sin(b) * 0.8 + i * 0.3, root[1] + L * Math.cos(b * 0.8)];
    var mid = [root[0] + L * Math.sin(b * 0.25) * 0.3, root[1] + L * 0.52];
    var at = muBent(root, mid, tip);
    parts.push(muTube(at, function (t) { return 3 - 1.1 * t; }));
    if (i > 0) {                                    // where this finger lies over the one behind it
      var g0 = at(0.45), g1 = at(0.97);
      gaps.M(g0[0] + 1.6, g0[1]).Q(at(0.75)[0] + 2.2, at(0.75)[1], g1[0] + 1.4, g1[1]);
    }
  });
  parts.push(new MPath().M(4.8, -4).C(6.5, 8, 6.8, 20, 5.2, 31).C(2.5, 35, -4, 35, -6, 31).C(-10.5, 22, -10, 8, -6, -4).Z());
  parts.push(muTube(muBent([-6, 6], [-12, 17], [-12.5, 29]), function (t) { return 3.6 - 1.2 * t; }));
  var ink = muInk(muColour(skin));
  parts.forEach(function (part) { mBrush(part, ink, 1.1); });
  parts.forEach(function (part) { mFill(part, skin, 1.5); });
  var thumbLine = parts[parts.length - 1];          // the thumb lies over the palm: its own line
  mBrush(new MPath().poly(thumbLine.subs[0].pts.slice(0, 30), false), ink, 0.9);
  mLine(gaps, ink, 0.7);
  mLine(new MPath().M(-6, 15).Q(-2, 22, -4, 29), muShade(muColour(skin)), 0.7);   // the crease of the palm
  pen.restore();
}
// a bare foot, three-quarter, toes to the right, heel at (x, y)
function muFoot(x, y, long, skin) {
  var s = long / 60, f = new MPath();
  f.M(x - 2 * s, y - 26 * s).C(x - 8 * s, y - 14 * s, x - 10 * s, y - 2 * s, x, y)
   .C(x + 20 * s, y + 2 * s, x + 44 * s, y + 2 * s, x + 56 * s, y - 1 * s)
   .C(x + 61 * s, y - 3 * s, x + 60 * s, y - 8 * s, x + 54 * s, y - 9 * s)
   .C(x + 38 * s, y - 12 * s, x + 22 * s, y - 20 * s, x + 14 * s, y - 30 * s).Z();
  mShape(f, skin, 4, 1.3);
  var toes = new MPath();
  [44, 49, 53].forEach(function (tx) { toes.M(x + tx * s, y - 2 * s).Q(x + (tx + 1) * s, y - 5 * s, x + (tx - 1) * s, y - 8 * s); });
  toes.M(x - 1 * s, y - 20 * s).Q(x + 3 * s, y - 17 * s, x + 2 * s, y - 13 * s);   // the ankle's bone
  mLine(toes, muInk(muColour(skin)), 0.8);
}

// ---------- the head ----------
// three-quarter to the right, chin at (0, 0), crown at (0, -100)
function muHead(look, lady, skin) {
  var hair = look.hair || MU.hair;
  if (lady && look.bun === "wong") { muBun(-14, -106, 17, hair, look); }
  var mass = new MPath().M(30, -88).C(14, -106, -32, -108, -48, -80).C(-58, -60, -54, -34, -38, -18).C(-30, -12, -20, -14, -14, -22).L(30, -60).Z();
  mShape(mass, hair, 5, 1.3);
  if (lady && look.bun === "wong" && typeof muBunGold !== "undefined") { muBunGold(-14, -106, 17); }
  if (lady && look.bun !== "wong") { muBun(-52, -40, 17, hair, look); if (typeof muBunGold !== "undefined") { muBunGold(-52, -40, 17); } }
  if (!lady) { muBun(-6, -108, 13, hair, look); }
  var jaw = lady ? 0 : 4, k = MU.tara || 0;            // k: the thangka's fuller cheeks and rounder chin (MU.tara)
  var face = new MPath().M(-26, -73)
    .C(-33 - jaw - 3 * k, -52, -32 - jaw - 3 * k, -20, -14 - jaw * 0.5 - 2 * k, -6 + k)
    .C(-5, 1 + 1.5 * k, 11, 2.5 + 1.5 * k, 19.5 + k, -2 + k)
    .C(29 + jaw * 0.5 + 2 * k, -7, 35.5 + jaw * 0.5 + 2 * k, -22, 36 + 1.2 * k, -38)
    .C(37, -46, 34, -52, 35.5, -59)
    .C(38.5, -70, 37, -86, 27, -92)
    .C(12, -98, -14, -94, -26, -73).Z();
  mFill(face, skin, 7);
  pen.save(); pen.clip(face.path);                  // the cheek's warmth, and the shadow the hair throws on the temple
  var paint = lady ? muMakeup(look) : null;           // a grown woman's rouge, lids and lipstick, from her clothes
  var feel = muFeelOf(look);                          // the feeling's numbers: brows, lids, mouth and cheeks move with them
  muCheeks(lady, paint, feel);
  muFaceLines(look, feel);                            // the creases of age, and on an old face a feeling's too
  pen.restore();
  mBrush(face, muInk(muColour(skin)), 1.3);
  // the hair's edge over the forehead and the temple, drawn through with strands toward the knot
  var edge = new MPath().M(-28, -70).C(-18, -89, 8, -97, 28, -91).C(16, -104, -24, -106, -40, -86).L(-42, -50).L(-28, -47).C(-31, -56, -31, -64, -28, -70).Z();
  mShape(edge, hair, 3, 1.2);
  var strands = new MPath(), sheen = muColour(blend(hair, MU.sheen, 0.4));
  for (var k = 0; k < 12; k++) {
    var u = k / 11;
    strands.M(24 - u * 40, -92 + u * 8).C(4 - u * 30, -100 + u * 2, -30 - u * 10, -94 + u * 14, -46 - u * 2, -70 + u * 26);
  }
  pen.save(); pen.clip(mass.path); mLine(strands, sheen, 1.1); pen.restore();
  // the ear, its fold, its plug
  var lobe = [-25, -34];
  if (MU.ear !== null) { lobe = muEarPainted(skin, MU.ear); }       // the painting's ear, MU.ear units further back
  else {
    var ear = new MPath().M(-22, -54).C(-30, -58, -33, -44, -30, -36).C(-28, -30, -24, -30, -22, -34).Z();
    mShape(ear, skin, 2, 1.1);
    mLine(new MPath().M(-24, -51).Q(-29, -46, -26, -40), muInk(muColour(skin)), 0.8);
  }
  if (lady && typeof muEarring !== "undefined") { muEarring(lobe[0], lobe[1]); }
  else if (look.earplug) {
    var plug = new MPath().E(lobe[0], lobe[1], 4, 4);
    mShape(plug, look.earplug, 1.2, 1);
    mLine(new MPath().E(lobe[0], lobe[1], 1.8, 1.8), muInk(muColour(look.earplug)), 0.6);
  }
  // the eyes
  muEye([-4, -50], 16, -1, lady, paint, feel);
  muEye([25, -51], 10.5, 1, lady, paint, feel);
  // the brows, like threads, high
  var brow = new MPath(), moved = MU.feelLines === "brows";
  if (moved) { pen.save(); muBrowTurn(feel, -7, -67, 1); }
  brow.M(8, -62).Q(-4, lady ? -71 : -68, -22, lady ? -65 : -63);
  var paintedBrow = MU.nose === "exact" || MU.nose === "exactink";
  if (!paintedBrow) { brow.M(17, -62).Q(26, lady ? -69 : -67, 35, lady ? -65 : -63); }
  mLine(brow, muColour(hair), lady ? 1.6 : 2.4);
  if (moved) { pen.restore(); }
  if (paintedBrow) {                                  // the far brow as the painting has it, curling to the nose
    if (moved) { pen.save(); muBrowTurn(feel, 28.4, -62.2, -1); }
    muInkLine(NOSE_LANNA.brow, NOSE_PAINT.brow);
    if (moved) { pen.restore(); }
  }
  // the nose: a long line down the far side, the curl of the nostril, a tick for the near one
  muNose(MU.nose || "now", skin, lady);
  if (MU.tara) {
    muGlow(21.5, -27.6, 5, 2.4, "140, 70, 60", 0.14 * MU.tara);
    muInkLine([[18.6, -31.2, 0.25], [19.6, -29.4, 0.35], [21.4, -28.6, 0.4], [23.2, -29.2, 0.35], [24.2, -30.8, 0.25]].map(function (q) { return [q[0], q[1], q[2] * MU.tara]; }), NOSE_PAINT.nostril);
  }
  // the mouth: the line where the lips meet, with its bow and its corners; the lips a little red
  if (MU.mouth) { muLipsPainted(lady, skin, MU.mouth, paint, feel); }
  else {
  var lipsColour = lady ? MU.lips : blend(skin, "#8a4036", 0.4);
  var lips = new MPath().M(11.5, -15).C(14, -17.6, 16.5, -17.6, 18, -16.4).C(19.6, -17.6, 22, -17.6, 24.5, -15.3).C(21, -11, 15, -11, 11.5, -15).Z();
  mFill(lips, lipsColour, 0);
  var up = (look.smile || 0) * 1.2;
  mLine(new MPath().M(10.5, -14.8 - up).C(13, -15.2, 16, -14, 18, -14.6).C(20, -14, 23, -15.2, 25.5, -15.4 - up), muInk(muColour(lipsColour)), 1.2);
  mLine(new MPath().M(14, -8).Q(18, -6.5, 22, -8), muShade(muColour(skin)), 0.7);   // under the lower lip
  }
  if (look.turban) {
    // the head-cloth goes all the way round: drawn past the head and cut to the head's own outline (face, hair), so it
    // ends where the head turns away; its edge there inked along that outline
    var head = new Path2D(); head.addPath(face.path); head.addPath(mass.path); head.addPath(edge.path);
    var band = new MPath().M(-48, -78).C(-20, -96, 18, -100, 48, -88).L(48, -72).C(14, -88, -22, -84, -46, -62).Z();
    pen.save(); pen.clip(head);
    mShape(band, look.turban, 3, 1.2);
    mLine(new MPath().M(-38, -76).C(-14, -88, 12, -90, 44, -82).M(-40, -68).C(-16, -80, 10, -82, 44, -77), muShade(muColour(look.turban)), 0.8);
    pen.restore();
    pen.save(); pen.clip(band.path); pen.beginPath(); pen.rect(24, -110, 30, 50); pen.clip();
    mBrush(face, muInk(muColour(look.turban)), 1.2);
    pen.restore();
    var knot = new MPath().M(-44, -72).C(-60, -82, -66, -70, -62, -58).C(-58, -60, -52, -62, -46, -62).Z();
    mShape(knot, look.turban, 2, 1.2);
  }
}
// The nose, three-quarter to the right. "now": the long straight line from the brow. The Thai nose is small and low:
//   soft    a short faint bridge from below the eyes, a small round tip, the wing's curl
//   low     no bridge at all: only the round tip and the nostrils, under the eyes
//   button  a short bridge, a fuller round tip with a soft shadow under it, broad wings
// The nose of the owner's reference (royalthaiart.com, Thai Lanna dancing woman, 524), measured in the painting: along
// each line [x, y, ink], ink the line's width in units were it painted at full strength in its own colour; with the
// far brow, which in the painting curls down at its inner end toward the nose's line.
// Mirrored and set onto this head by the irises (mural_traced/nose_exact.py).
var NOSE_LANNA = {
  bridge: [[21.17,-54.14,0.276],[21.11,-53.94,0.292],[21.04,-53.75,0.301],[20.92,-53.35,0.339],[20.80,-52.95,0.354],[20.70,-52.54,0.358],[20.62,-52.13,0.360],[20.58,-51.77,0.356],[20.55,-51.40,0.344],[20.52,-51.03,0.325],[20.50,-50.66,0.312],[20.51,-50.30,0.300],[20.53,-49.88,0.287],[20.58,-49.46,0.281],[20.64,-49.10,0.274],[20.72,-48.75,0.259],[20.81,-48.39,0.249],[20.93,-48.04,0.249],[21.04,-47.69,0.249],[21.18,-47.29,0.250],[21.33,-46.90,0.241],[21.50,-46.52,0.235],[21.68,-46.13,0.234],[21.86,-45.76,0.234],[22.05,-45.39,0.231],[22.24,-45.02,0.241],[22.42,-44.64,0.244],[22.60,-44.28,0.231],[22.80,-43.91,0.221],[22.99,-43.55,0.217],[23.18,-43.18,0.207],[23.40,-42.81,0.194],[23.61,-42.46,0.185],[23.82,-42.10,0.174],[24.02,-41.77,0.160],[24.23,-41.44,0.151],[24.42,-41.11,0.162],[24.60,-40.76,0.183],[24.77,-40.41,0.189],[24.97,-40.04,0.195],[25.13,-39.65,0.202],[25.29,-39.26,0.193],[25.44,-38.87,0.175],[25.59,-38.47,0.181],[25.71,-38.09,0.197],[25.82,-37.71,0.217],[25.93,-37.33,0.274],[26.02,-36.95,0.388],[26.08,-36.56,0.532],[26.12,-36.19,0.668],[26.13,-35.82,0.803],[26.08,-35.45,0.887],[25.99,-35.10,0.916],[25.84,-34.76,0.898],[25.65,-34.43,0.873],[25.41,-34.13,0.843],[25.12,-33.89,0.844],[24.80,-33.69,0.859],[24.45,-33.53,0.841],[24.06,-33.37,0.799],[23.67,-33.23,0.765],[23.29,-33.05,0.741],[22.93,-32.85,0.731],[22.59,-32.60,0.774],[22.30,-32.32,0.798],[22.04,-32.00,0.794],[21.83,-31.65,0.758],[21.69,-31.26,0.685],[21.62,-30.86,0.577],[21.59,-30.41,0.502],[21.59,-30.19,0.471],[21.60,-29.95,0.431]],
  brow: [[23.30,-59.85,0.132],[23.48,-60.14,0.199],[23.66,-60.42,0.276],[24.04,-60.96,0.427],[24.45,-61.50,0.584],[24.87,-62.02,0.721],[25.33,-62.50,0.802],[25.83,-62.95,0.848],[26.36,-63.36,0.846],[26.92,-63.72,0.838],[27.52,-64.03,0.845],[28.14,-64.28,0.879],[28.79,-64.46,0.931],[29.45,-64.57,0.974],[30.13,-64.61,1.013],[30.80,-64.59,1.057],[31.47,-64.54,1.096],[32.15,-64.48,1.021],[32.82,-64.42,0.876],[33.15,-64.38,0.828],[33.49,-64.36,0.719]],
  nostril: [[20.51,-33.63,0.867],[20.30,-33.59,0.892],[20.11,-33.55,0.898],[19.71,-33.47,0.910],[19.31,-33.36,0.879],[18.92,-33.24,0.804],[18.73,-33.18,0.763],[18.53,-33.11,0.711]],
  wing: [[16.86,-37.83,0.063],[16.63,-37.85,0.073],[16.42,-37.81,0.092],[16.00,-37.72,0.115],[15.62,-37.54,0.144],[15.29,-37.26,0.161],[15.00,-36.92,0.181],[14.76,-36.54,0.199],[14.59,-36.21,0.214],[14.46,-35.85,0.225],[14.36,-35.49,0.243],[14.29,-35.11,0.253],[14.26,-34.74,0.245],[14.28,-34.35,0.239],[14.36,-33.96,0.217],[14.50,-33.60,0.190],[14.74,-33.30,0.173],[15.04,-33.06,0.167],[15.38,-32.84,0.166],[15.76,-32.71,0.181],[16.17,-32.65,0.205],[16.58,-32.66,0.250],[16.79,-32.66,0.265],[17.00,-32.68,0.285]]
};

// The lips of the same painting, measured column by column (mural_traced/lips_exact.py), where the painting has them;
// "ours" moves them down to this head's own mouth, the painting's face being shorter below the nose.
var LIPS_LANNA = {
  upper: [[27.79,-27.29],[26.78,-27.66],[26.36,-27.75],[25.97,-27.97],[25.57,-28.18],[25.17,-28.40],[24.76,-28.53],[24.35,-28.58],[23.93,-28.58],[23.49,-28.47],[23.03,-28.14],[22.58,-27.90],[22.15,-27.82],[21.72,-27.78],[21.31,-27.87],[20.89,-27.96],[20.48,-28.05],[20.07,-28.14],[19.66,-28.23],[19.25,-28.32],[18.83,-28.37],[18.41,-28.38],[17.98,-28.35],[17.55,-28.31],[17.12,-28.23],[16.67,-27.95],[16.20,-27.58],[15.76,-27.46],[15.32,-27.30],[14.86,-26.97],[13.97,-26.53],[13.11,-26.42],[11.62,-26.38],[11.62,-26.38],[13.49,-26.08],[14.73,-25.85],[15.56,-25.71],[15.97,-25.58],[16.38,-25.45],[16.78,-25.27],[17.17,-25.02],[17.58,-24.88],[18.00,-24.84],[18.41,-24.79],[18.82,-24.70],[19.24,-24.65],[19.66,-24.60],[20.08,-24.59],[20.50,-24.59],[20.93,-24.62],[21.36,-24.66],[21.79,-24.73],[22.19,-24.56],[22.63,-24.68],[23.06,-24.80],[23.49,-24.83],[23.92,-24.87],[24.35,-24.94],[24.76,-24.81],[25.17,-24.72],[25.61,-24.92],[26.10,-25.50],[26.61,-26.24],[27.79,-27.29]],
  lower: [[27.79,-27.29],[26.61,-26.24],[26.10,-25.50],[25.61,-24.92],[25.17,-24.72],[24.76,-24.81],[24.35,-24.94],[23.92,-24.87],[23.49,-24.83],[23.06,-24.80],[22.63,-24.68],[22.19,-24.56],[21.79,-24.73],[21.36,-24.66],[20.93,-24.62],[20.50,-24.59],[20.08,-24.59],[19.66,-24.60],[19.24,-24.65],[18.82,-24.70],[18.41,-24.79],[18.00,-24.84],[17.58,-24.88],[17.17,-25.02],[16.78,-25.27],[16.38,-25.45],[15.97,-25.58],[15.56,-25.71],[14.73,-25.85],[13.49,-26.08],[11.62,-26.38],[11.62,-26.38],[12.99,-25.37],[13.79,-24.99],[14.60,-24.72],[14.81,-22.92],[15.16,-22.29],[15.57,-22.12],[15.97,-21.98],[16.37,-21.73],[16.75,-21.35],[17.14,-21.13],[17.55,-21.00],[17.96,-20.87],[18.36,-20.73],[18.75,-20.44],[19.13,-20.05],[19.53,-19.88],[19.94,-19.75],[20.38,-19.91],[20.80,-19.86],[21.25,-20.06],[21.70,-20.35],[22.14,-20.47],[22.60,-20.79],[23.05,-21.08],[23.49,-21.20],[23.94,-21.44],[24.43,-22.02],[24.88,-22.26],[25.33,-22.50],[25.82,-23.04],[26.31,-23.62],[27.04,-26.28],[27.56,-27.11],[27.79,-27.29]],
  seam: [[27.79,-27.29],[26.61,-26.24],[26.10,-25.50],[25.61,-24.92],[25.17,-24.72],[24.76,-24.81],[24.35,-24.94],[23.92,-24.87],[23.49,-24.83],[23.06,-24.80],[22.63,-24.68],[22.19,-24.56],[21.79,-24.73],[21.36,-24.66],[20.93,-24.62],[20.50,-24.59],[20.08,-24.59],[19.66,-24.60],[19.24,-24.65],[18.82,-24.70],[18.41,-24.79],[18.00,-24.84],[17.58,-24.88],[17.17,-25.02],[16.78,-25.27],[16.38,-25.45],[15.97,-25.58],[15.56,-25.71],[14.73,-25.85],[13.49,-26.08],[11.62,-26.38]],
  rim: [[25.38,-22.91],[24.94,-22.78],[24.50,-22.64],[24.05,-22.36],[23.60,-22.16],[23.16,-21.95],[22.72,-21.84],[22.28,-21.72],[21.85,-21.60],[21.41,-21.48],[20.97,-21.36],[20.54,-21.24],[20.11,-21.21],[19.68,-21.17],[19.27,-21.22],[18.85,-21.27],[18.44,-21.40],[18.03,-21.53],[17.63,-21.67],[17.23,-21.88],[16.83,-22.10],[16.43,-22.31],[16.04,-22.53],[15.63,-22.70],[15.23,-22.82]],
  tickL: [[28.64,-27.36],[27.79,-27.29],[26.92,-27.05]],
  tickR: [[15.35,-25.69],[14.31,-25.81],[13.06,-26.00],[11.63,-26.42]],
  px: 0.420
};
// A lady's in the painting's colours, multiplied over the skin as they darkened its white skin: the upper lip rose,
// the lower pale with a darker rim, the seam and the corners' ticks dark. A man's in his own muted lip colours.
// With a feeling (f: muFeelOf()'s numbers, or nothing) the painting's lips move: their corners up in a smile and down
// in sadness, anger and worry; pressed thin in anger and worry; open as the kit's feeling opens a mouth (f.open: how far,
// how wide, how round), the lower lip dropping in the middle while the corners stay, the mouth dark between them.
function muLipsPainted(lady, skin, at, paint, f) {
  var P = LIPS_LANNA, u = P.px, c = muColour(skin);
  f = f || {};
  var v = function (k) { return f[k] || 0; };
  var grin = Math.max(-1, Math.min(1, v("smile") + 0.6 * v("full") + 0.4 * v("laugh") - (v("sad") + 0.6 * v("anger") + 0.45 * v("worry"))));
  var press = Math.max(0.6 * v("anger"), 0.5 * v("worry"));
  var open = f.open ? f.open : [0, 0, 0], drop = 7 * open[0];
  var xs = P.seam.map(function (p) { return p[0]; }), mx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2;
  var hw = (Math.max.apply(null, xs) - Math.min.apply(null, xs)) / 2;
  var my = P.seam.reduce(function (a, p) { return a + p[1]; }, 0) / P.seam.length;
  var sx = 1 + 0.15 * open[1] * open[0] - 0.3 * open[2] * open[0] + 0.05 * Math.max(0, grin);
  function warp(pts, lower) {
    return pts.map(function (p) {
      var k = Math.max(-1, Math.min(1, (p[0] - mx) / hw)), full = 1 + (MU.fuller || 0) * (p[1] < my ? 0.5 : 1);
      var y = my + (p[1] - my) * (1 - 0.35 * press) * full;
      return [mx + (p[0] - mx) * sx, y - grin * 2.4 * k * k + (lower ? drop * (1 - k * k) : 0)];
    });
  }
  if (MU.round) { P = muLipRounder(P, MU.round); }
  P = {upper: warp(P.upper), lower: warp(P.lower, true), seam: warp(P.seam), low: warp(P.seam, true), rim: warp(P.rim, true),
       tickL: warp(P.tickL), tickR: warp(P.tickR)};
  function poly(pts) { pen.beginPath(); pts.forEach(function (p, i) { if (i) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } }); }
  pen.save();
  if (at === "ours") { pen.translate(-2.1, 10.2 - 2 * (MU.tara || 0)); }
  pen.globalCompositeOperation = lady ? "multiply" : "source-over";
  var col = paint ? muLipTones(paint.lips)
    : lady && MU.cheek !== "now" ? muLipTones([226, 152, 150])                // a child's own lips, no paint
    : lady ? {upper: "rgb(230, 108, 141)", lower: "rgb(251, 196, 216)", rim: "rgb(223, 155, 183)", seam: "rgb(195, 82, 110)", tick: "rgb(154, 71, 85)"}
    : {upper: blend(c, "#8a4036", 0.4), lower: blend(c, "#8a4036", 0.18), rim: blend(c, "#8a4036", 0.3), seam: blend(c, "#5a2416", 0.5), tick: blend(c, "#5a2416", 0.6)};
  pen.lineJoin = "round"; pen.lineCap = "round";
  if (drop > 0.3) {                                               // the mouth open: dark, the upper teeth under the lip
    pen.save(); pen.globalCompositeOperation = "source-over";
    poly(P.seam.concat(P.low.slice().reverse())); pen.closePath(); pen.fillStyle = "rgb(92, 34, 36)"; pen.fill();
    pen.clip(); pen.translate(0, 1.6 * open[1] + 0.6); poly(P.seam.concat(P.seam.slice().reverse().map(function (p) { return [p[0], p[1] - 3]; })));
    pen.closePath(); pen.fillStyle = "#f2ebe0"; pen.fill();
    pen.restore();
  }
  poly(P.lower); pen.closePath(); pen.fillStyle = col.lower; pen.fill();
  pen.save(); pen.clip();                                         // the rim, inside the lower lip's edge
  poly(P.rim); pen.strokeStyle = col.rim; pen.lineWidth = 3.6 * u; pen.stroke();
  pen.restore();
  poly(P.upper); pen.closePath(); pen.fillStyle = col.upper; pen.fill();
  poly(P.seam); pen.strokeStyle = col.seam; pen.lineWidth = 1.6 * u; pen.stroke();
  [P.tickL, P.tickR].forEach(function (t) { poly(t); pen.strokeStyle = col.tick; pen.lineWidth = 2 * u; pen.stroke(); });
  pen.restore();
}
// The lower lip rounder at the bottom (owner, 2026-10-30: "a little rounder at the bottom instead of the v shape"): its
// lower edge's depth below the line from corner to corner, which the painting draws as a V to its deepest point, drawn
// toward a U, deepest - deepest * u * u (u 0 at the deepest point, 1 at each corner), by "round" (0 to 1); the darker
// rim inside the edge goes down with it. P: LIPS_LANNA or its like. Returns a new P; the corners stay where they were.
// e.g. muLipRounder(LIPS_LANNA, 0.8)
function muLipRounder(P, round) {
  var n = P.seam.length, bottom = P.lower.slice(n), A = bottom[bottom.length - 1], B = bottom[0];   // its corners
  function base(x) { return A[1] + (x - A[0]) / (B[0] - A[0]) * (B[1] - A[1]); }
  var deep = 0, at = (A[0] + B[0]) / 2;
  bottom.forEach(function (q) { if (q[1] - base(q[0]) > deep) { deep = q[1] - base(q[0]); at = q[0]; } });
  function moved(x, y) {
    var u = x < at ? (at - x) / (at - Math.min(A[0], B[0])) : (x - at) / (Math.max(A[0], B[0]) - at);
    u = Math.max(0, Math.min(1, u));
    var d = y - base(x), want = deep * (1 - u * u);
    return d + (want - d) * round - d;            // how far the edge goes down here
  }
  var lower = P.lower.slice(0, n).concat(bottom.map(function (q) { return [q[0], q[1] + moved(q[0], q[1])]; }));
  var rim = P.rim.map(function (q) {               // the rim follows the edge nearest it across
    var near = bottom.reduce(function (a, b) { return Math.abs(b[0] - q[0]) < Math.abs(a[0] - q[0]) ? b : a; });
    return [q[0], q[1] + moved(near[0], near[1])];
  });
  return Object.assign({}, P, {lower: lower, rim: rim});
}
// The ear of the same painting (mural_traced/ear_exact.py): its edge against the hair, its front (unlined: it runs into
// the face), the lobe where an earring hangs, and its two fold lines [x, y, ink] in their pinkish mauve.
var EAR_LANNA = {
  edge: [[-18.06,-48.50],[-19.00,-49.09],[-19.98,-49.70],[-21.03,-50.24],[-22.13,-50.70],[-23.33,-50.93],[-24.55,-50.91],[-25.69,-50.52],[-26.71,-49.86],[-27.57,-48.99],[-28.33,-48.13],[-28.92,-47.17],[-29.36,-46.19],[-29.63,-45.20],[-29.80,-44.23],[-29.85,-43.28],[-29.84,-42.36],[-29.71,-41.49],[-29.56,-40.64],[-29.35,-39.81],[-29.14,-38.98],[-28.84,-38.16],[-28.58,-37.24],[-28.19,-36.35],[-27.74,-35.38],[-27.09,-34.44],[-26.31,-33.57],[-25.38,-32.50],[-24.25,-31.46],[-22.92,-30.29],[-21.31,-29.57],[-19.55,-29.07]],
  front: [[-18.70,-30.91],[-18.69,-34.71],[-18.47,-40.18],[-18.10,-45.21]],
  lobe: [-18.18,-30.01],
  loop: [[-24.52,-41.96,0.207],[-24.56,-42.26,0.234],[-24.62,-42.84,0.280],[-24.63,-43.43,0.308],[-24.57,-44.02,0.362],[-24.43,-44.59,0.362],[-24.13,-45.11,0.386],[-23.74,-45.56,0.450],[-23.13,-45.74,0.521],[-22.53,-45.44,0.589],[-21.97,-44.86,0.567],[-21.62,-44.17,0.553],[-21.34,-43.66,0.521],[-21.09,-43.12,0.560],[-20.89,-42.58,0.677],[-20.77,-42.00,0.727],[-20.71,-41.42,0.652],[-20.74,-40.81,0.511],[-20.85,-40.23,0.436],[-21.00,-39.65,0.404],[-21.11,-39.07,0.372],[-21.11,-38.47,0.333],[-20.88,-37.93,0.259],[-20.32,-37.61,0.252],[-19.59,-37.73,0.195],[-19.24,-38.54,0.248],[-19.47,-39.50,0.223],[-19.77,-40.10,0.266]],
  fold: [[-22.92,-35.35,0.271],[-23.14,-35.55,0.284],[-23.57,-35.96,0.298],[-23.99,-36.37,0.323],[-24.40,-36.80,0.337],[-24.82,-37.23,0.369],[-25.22,-37.68,0.383],[-25.57,-38.15,0.394],[-25.85,-38.66,0.401],[-26.07,-39.21,0.422],[-26.26,-39.76,0.489],[-26.43,-40.32,0.606],[-26.59,-40.89,0.652],[-26.69,-41.48,0.652],[-26.75,-42.07,0.613],[-26.74,-42.66,0.677],[-26.71,-43.25,0.755],[-26.63,-43.85,0.801],[-26.48,-44.42,0.791],[-26.19,-45.04,0.649],[-25.84,-45.57,0.443],[-25.63,-45.88,0.287]]
};
// The painting's ear, moved back (to the left) by "back" units: the painting's head is shallower behind the ear than
// this one, so the ear sits as far back on this head as the owner wants. Returns where its lobe is.
function muEarPainted(skin, back) {
  var E = EAR_LANNA, k = MU.tara || 0, mid = -41;
  pen.save(); pen.translate(-back, 0);
  if (k) { pen.translate(-19, mid); pen.scale(1 + 0.08 * k, 1 + 0.45 * k); pen.translate(19, -mid); }   // longer, from its front
  var shape = new MPath().poly(E.edge.concat(E.front), true);
  mFill(shape, skin, 2);
  mBrush(new MPath().poly(E.edge, false), muInk(muColour(skin)), 1);     // the edge against the hair; the front unlined
  ["loop", "fold"].forEach(function (k) { muInkLine(E[k], "185, 147, 171"); });
  pen.restore();
  return [E.lobe[0] - back, mid + (E.lobe[1] - mid) * (1 + 0.45 * k)];
}
// A painted line from measured points [x, y, ink]: each step a strip as wide as its ink, at full strength; where that
// is under a pixel on the screen, a pixel wide and paler by as much, so the line carries the same paint at any size.
// Multiplied over the skin, its colour as it darkened the painting's white skin: the same contrast on any skin.
var NOSE_PAINT = {bridge: "169, 152, 161", nostril: "169, 152, 161", wing: "169, 152, 161", brow: "74, 71, 80"};
function muInkLine(pts, rgb) {
  pen.save(); pen.globalCompositeOperation = "multiply";
  var least = 0.9 / MU_PX;
  for (var i = 0; i < pts.length - 1; i++) {
    var p = pts[i], q = pts[i + 1], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    var ink = (p[2] + q[2]) / 2, w = Math.max(ink, least) / 2;
    pen.fillStyle = "rgba(" + rgb + ", " + Math.min(1, ink / (w * 2)).toFixed(3) + ")";
    pen.beginPath();
    pen.moveTo(p[0] + nx * w, p[1] + ny * w); pen.lineTo(q[0] + nx * w, q[1] + ny * w);
    pen.lineTo(q[0] - nx * w, q[1] - ny * w); pen.lineTo(p[0] - nx * w, p[1] - ny * w);
    pen.fill();
  }
  pen.restore();
}
function muRgb(c) { return [1, 3, 5].map(function (i) { return parseInt(c.slice(i, i + 2), 16); }).join(", "); }
// a soft spot of colour, fading from its middle to its edge: rx, ry its radii
function muGlow(x, y, rx, ry, rgb, alpha, turn) {
  pen.save(); pen.translate(x, y); if (turn) { pen.rotate(turn); } pen.scale(1, ry / rx);
  var g = pen.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, "rgba(" + rgb + ", " + alpha + ")"); g.addColorStop(1, "rgba(" + rgb + ", 0)");
  pen.fillStyle = g; pen.beginPath(); pen.arc(0, 0, rx, 0, 7); pen.fill();
  pen.restore();
}
function muNose(kind, skin, lady) {
  var ink = muInk(muColour(skin)), shade = muShade(muColour(skin));
  if (kind === "now") {
    var nose = new MPath().M(18, -60).C(22, -48, 28, -36, 30.5, -30).C(30, -26.5, 27, -25.5, 23.5, -26.5);
    nose.M(13, -27).Q(15, -25, 17.5, -26);
    mLine(nose, ink, 1.2);
    return;
  }
  if (kind === "exact" || kind === "exactink") {    // the reference's own lines, measured pixel by pixel (NOSE_LANNA)
    ["wing", "bridge", "nostril"].forEach(function (k) { muInkLine(NOSE_LANNA[k], kind === "exact" ? NOSE_PAINT[k] : muRgb(ink)); });
    return;
  }
  if (kind === "lanna" || kind === "lannalight") {   // traced from the owner's reference (royalthaiart.com, Thai Lanna
    // dancing woman, 524), mirrored and set by her irises onto ours: one fine line from between the eyes curving down to
    // a round tip and on under it, the nostril a short dark stroke, the near wing a faint loop.
    var line = kind === "lanna" ? ink : blend(ink, muColour(skin), 0.3), faint = blend(ink, muColour(skin), 0.45);
    mLine(new MPath().M(20.47, -48.6)                 // (her line starts at her far eye; ours reaches further in: start below it)
      .C(20.79, -47.25, 21.53, -45.97, 22.17, -44.77).C(22.81, -43.57, 23.71, -42.33, 24.32, -41.13)
      .C(24.93, -39.93, 25.46, -38.53, 25.81, -37.58).C(26.16, -36.62, 26.49, -36.06, 26.41, -35.4)
      .C(26.33, -34.74, 25.83, -34.09, 25.35, -33.62).C(24.87, -33.15, 24.14, -32.88, 23.54, -32.56)
      .C(22.94, -32.24, 22.19, -32.19, 21.75, -31.71).C(21.31, -31.23, 21.02, -30.04, 20.88, -29.7), line, 0.75);
    mLine(new MPath().M(20.93, -33.71).C(20.68, -33.63, 19.88, -33.43, 19.4, -33.25).C(18.92, -33.07, 18.28, -32.75, 18.06, -32.65), line, 0.95);
    mLine(new MPath().M(17.35, -37.5).C(17.03, -37.43, 15.95, -37.42, 15.4, -37.1).C(14.85, -36.78, 14.23, -36.12, 14.04, -35.56)
      .C(13.85, -35.0, 13.97, -34.2, 14.25, -33.72).C(14.53, -33.24, 15.21, -32.92, 15.74, -32.7).C(16.27, -32.48, 17.12, -32.48, 17.4, -32.43), faint, 0.6);
    return;
  }
  if (kind === "thai" || kind === "thaisoft") {   // the owner's references: the pin (a lady), the goddess, the bodhisattva
    var under = blend(muColour(skin), "#7a3426", 0.55);
    if (lady) {                                   // the pin: no line on the bridge, only shade and light; one line under
      muGlow(15.2, -41, 3.2, 9.5, "170, 80, 70", 0.16);                           // the shade on the bridge's near side
      muGlow(21, -41, 1.8, 7.5, "255, 246, 232", 0.35);                           // the light down the bridge
      muGlow(21.5, -25.6, 7, 2.2, "130, 60, 48", 0.16);                           // the shadow under the tip
      if (kind === "thai") {                      // the goddess: a fine line out of the far brow, curving to the tip
        mLine(new MPath().M(17.2, -61).C(15.8, -52, 21, -42, 26, -35.5), blend(muColour(skin), "#7a3426", 0.35), 0.6);
      }
      mLine(new MPath().M(15.8, -34).C(12.2, -32.6, 12.3, -28.6, 15.8, -27.5)    // the near wing,
        .C(18.8, -25.8, 24.2, -25.9, 26.8, -27.6)                                  // under the tip,
        .C(29, -29.2, 28.9, -32.2, 27.3, -34), under, 0.85);                       // and up the tip's far side
      pen.fillStyle = "rgba(110, 50, 40, 0.3)";
      pen.beginPath(); pen.ellipse(18.6, -27.4, 1.4, 0.6, 0.15, 0, 7); pen.fill();
      pen.beginPath(); pen.ellipse(24.4, -27.6, 1.2, 0.55, -0.15, 0, 7); pen.fill();
      return;
    }
    muGlow(15, -42, 3.4, 10, "150, 70, 55", 0.14);                                // a man: the bodhisattva's line
    muGlow(21.5, -25.4, 7.5, 2.4, "130, 60, 48", 0.16);
    var bridge = new MPath().M(17.2, -61).C(15.6, -51, 22.5, -41, 26.6, -34.4)    // out of the far brow, curving,
      .C(29.6, -31.6, 29.6, -27.6, 26.6, -27).Q(23.4, -26.2, 20.8, -27.4);          // round the tip and under it
    mLine(bridge, kind === "thai" ? ink : under, kind === "thai" ? 0.95 : 0.85);
    mLine(new MPath().M(15.4, -33.4).C(12, -32, 12.2, -28.4, 15.4, -27.6), under, 0.85);   // the near wing
    pen.fillStyle = "rgba(90, 40, 30, 0.45)";
    pen.beginPath(); pen.ellipse(18.4, -27.4, 1.5, 0.65, 0.15, 0, 7); pen.fill();
    return;
  }
  if (kind === "rosy" || kind === "between") {    // the owner's second reference: no line at all, a small rosy tip
    if (kind === "between") {                     // ...with the photo's round wings, faint
      mLine(new MPath().M(16, -35).C(12.4, -33.6, 12.4, -29, 16, -27.8).M(27.6, -34.6).C(30, -33, 29.8, -29.6, 27.8, -28.2),
        blend(muColour(skin), "#a2483a", 0.5), 0.8);
    }
    muGlow(16, -40, 2.6, 7, "150, 70, 55", 0.1);                                  // the bridge, a breath of shade
    muGlow(22, -30.5, 6, 4.4, "214, 112, 96", 0.3);                               // the tip, blushed
    mLine(new MPath().M(17.5, -27.4).Q(22, -25.4, 26.5, -27.8), blend(muColour(skin), "#a2483a", 0.45), 0.85);   // under it
    pen.fillStyle = "rgba(110, 50, 40, 0.4)";                                     // the nostrils, barely
    pen.beginPath(); pen.ellipse(19.6, -27.3, 1.3, 0.6, 0.15, 0, 7); pen.fill();
    pen.beginPath(); pen.ellipse(24.8, -27.7, 1.1, 0.55, -0.15, 0, 7); pen.fill();
    muGlow(22.6, -32, 2.4, 1.7, "255, 246, 232", 0.45);                           // the light on the tip
    return;
  }
  if (kind === "ref") {                           // the owner's reference: no bridge line, a broad round tip, round wings
    pen.save();
    muGlow(21.5, -25.4, 9, 2.8, "150, 70, 55", 0.2);                             // the warm shadow under the nose
    var side = pen.createLinearGradient(11, 0, 18, 0);                          // the bridge only as a shade beside the near eye
    side.addColorStop(0, "rgba(150, 70, 55, 0)"); side.addColorStop(0.6, "rgba(150, 70, 55, 0.13)"); side.addColorStop(1, "rgba(150, 70, 55, 0)");
    pen.fillStyle = side; pen.beginPath(); pen.ellipse(15, -40, 3.5, 8, 0.12, 0, 7); pen.fill();
    muGlow(22.5, -31.5, 4, 3, "255, 244, 228", 0.4);                             // the light on the tip
    pen.restore();
    var wings = new MPath().M(15.5, -36).C(11, -34.5, 11, -28.5, 15.2, -27.2)    // the near wing (
      .M(28.2, -35.5).C(31.2, -33.5, 31, -29.5, 28.4, -27.8);                    // the far wing )
    mLine(wings, ink, 1.05);
    mLine(new MPath().M(16.5, -26.6).Q(21.5, -24.6, 27.4, -27.2), shade, 0.8);   // under the tip, soft
    pen.fillStyle = blend(ink, "#1c110c", 0.5);                                  // the nostrils
    pen.beginPath(); pen.ellipse(18.4, -27.4, 1.9, 0.9, 0.15, 0, 7); pen.fill();
    pen.beginPath(); pen.ellipse(25.6, -27.8, 1.5, 0.8, -0.15, 0, 7); pen.fill();
    return;
  }
  if (kind === "button") {                        // the shadow under the tip, then the lines
    pen.save(); pen.fillStyle = "rgba(150, 70, 55, 0.16)";
    pen.beginPath(); pen.ellipse(21, -26, 7, 2.6, 0, 0, 7); pen.fill(); pen.restore();
  }
  var tip = kind === "button" ? 4.4 : 3.6, tx = kind === "low" ? 25 : 26, ty = -31;
  var t = new MPath().M(tx - 1.5, ty - tip * 1.1).Q(tx + tip * 0.9, ty + tip * 0.1, tx - 1, ty + tip * 0.95);   // the round tip, open
  t.M(14, ty + 1.5).Q(12.6, ty + 4.6, 15.6, ty + 5.2);                                       // the near wing
  mLine(t, ink, 1.1);
  pen.fillStyle = blend(ink, "#1c110c", 0.5);                                                 // the nostrils, two small darks
  pen.beginPath(); pen.ellipse(tx - 5.2, ty + tip * 0.85, 2, 0.9, -0.15, 0, 7); pen.fill();
  pen.beginPath(); pen.ellipse(17.2, ty + 4.6, 1.2, 0.7, 0.2, 0, 7); pen.fill();
  if (kind !== "low") {                           // the bridge, faint, from below the eyes
    var from = kind === "button" ? -42 : -46;
    mLine(new MPath().M(19.5, from).Q(21.5, (from + ty) / 2, tx - 1.5, ty - tip - 1), shade, 0.75);
  }
  }
function muBun(x, y, r, hair, look) {
  mShape(new MPath().E(x, y, r * 1.1, r), hair, 4, 1.2);
  var wind = new MPath();
  for (var k = 0; k < 3; k++) { wind.M(x - r * 0.8, y - r * 0.2 + k * 5).Q(x, y - r * 0.9 + k * 6, x + r * 0.8, y - r * 0.1 + k * 5); }
  pen.save(); pen.clip(new MPath().E(x, y, r * 1.1, r).path);
  mLine(wind, muColour(blend(hair, MU.sheen, 0.4)), 0.9);
  pen.restore();
  // a gold pin through the knot: only its ends show, outside the knot; where it goes into the hair, a little shadow
  var pin = new MPath().M(x - r * 1.5, y - r * 0.5).L(x + r * 1.4, y - r * 1.1).L(x + r * 1.45, y - r * 0.85).L(x - r * 1.45, y - r * 0.3).Z();
  pen.save();
  pen.beginPath(); pen.rect(x - r * 4, y - r * 4, r * 8, r * 8); pen.ellipse(x, y, r * 1.1, r, 0, 0, Math.PI * 2);
  pen.clip("evenodd");
  mShape(pin, MU_METAL.base, 0, 0.8);
  pen.restore();
  var was = null;
  for (var s = 0; s <= 100; s++) {                  // where its middle line crosses the knot's edge
    var u = s / 100, px = x - r * 1.475 + r * 2.9 * u, py = y - r * 0.4 - r * 0.575 * u;
    var inside = Math.pow((px - x) / (r * 1.1), 2) + Math.pow((py - y) / r, 2) < 1;
    if (was !== null && inside !== was) {
      pen.save(); pen.fillStyle = "rgba(0, 0, 0, 0.4)";
      pen.beginPath(); pen.ellipse(px + (inside ? 1 : -1) * r * 0.06, py, r * 0.14, r * 0.11, -0.2, 0, Math.PI * 2); pen.fill();
      pen.restore();
    }
    was = inside;
  }
  if (look.flower) {
    for (var p = 0; p < 6; p++) {
      var a = p / 6 * Math.PI * 2;
      mShape(new MPath().E(x + r * 0.95 + Math.cos(a) * 4.4, y - r * 0.7 + Math.sin(a) * 4.4, 3.6, 2.3, a), look.flower, 0, 0.8);
    }
    mShape(new MPath().E(x + r * 0.95, y - r * 0.7, 2, 2), MU_METAL.base, 0, 0.6);
  }
}
// A woman's makeup, to go with what she wears: the first warm colour of her clothes, nearest the face first (her scarf,
// her sabai, her collar, the flower in her hair, her blouse, her skirt, her sin or sarong and their wider bands; gold
// and yellow left to the jewellery) picks the lipstick's
// family, and the rouge and the lids follow it: copper with red and coral, mauve with rose and berry. A child (build
// below 0) wears none. look.makeup names a family instead.
var MU_MAKEUP = {
  red:   {lips: [214, 62, 72],   rouge: "212, 96, 96",   lid: "160, 84, 62", lidDeep: "122, 56, 44"},
  coral: {lips: [232, 112, 90],  rouge: "224, 116, 92",  lid: "164, 92, 62", lidDeep: "126, 62, 44"},
  rose:  {lips: [230, 108, 141], rouge: "210, 100, 108", lid: "150, 64, 92", lidDeep: "120, 48, 70"},
  berry: {lips: [190, 72, 112],  rouge: "204, 92, 112",  lid: "140, 60, 96", lidDeep: "108, 42, 72"}
};
function muHue(hex) {                                   // [hue in degrees, saturation, lightness] of "#rrggbb", or null
  if (typeof hex !== "string" || !/^#[0-9a-f]{6}$/i.test(hex)) { return null; }
  var r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  var hi = Math.max(r, g, b), lo = Math.min(r, g, b), d = hi - lo, l = (hi + lo) / 2;
  if (d === 0) { return [0, 0, l]; }
  var h = hi === r ? (g - b) / d : hi === g ? 2 + (b - r) / d : 4 + (r - g) / d;
  return [(h * 60 + 360) % 360, d / (1 - Math.abs(2 * l - 1)), l];
}
// The colours of what a person wears, nearest the face first: her scarf, her sabai, her collar, the flower in her hair,
// her blouse, her skirt, her sin or sarong and their wider bands (3 or more: a fine stripe is not what the cloth looks
// like). look: the person's look. Returns a list of CSS colours. e.g. muClothes(cast("sinuan"))
function muClothes(look) {
  var clothes = [].concat(look.scarf || [], Array.isArray(look.sabai) ? look.sabai.slice(0, 2) : [], look.collar || [], look.flower || [],
                          look.shirt || [], look.skirt ? look.legs || [] : []);
  var tube = look.sin !== undefined && typeof SINS !== "undefined" ? SINS[look.sin] : Array.isArray(look.sarong) ? look.sarong : [look.sarong, []];
  if (tube) { clothes.push(tube[0]); (tube[1] || []).forEach(function (band) { if (band[2] >= 3) { clothes.push(band[1]); } }); }
  return clothes.filter(function (c) { return typeof c === "string"; });
}
function muMakeup(look) {
  if ((look.build || 0) < 0) { return null; }
  if (look.makeup) { return MU_MAKEUP[look.makeup]; }
  var clothes = muClothes(look);
  for (var i = 0; i < clothes.length; i++) {
    var h = muHue(clothes[i]);
    if (!h || h[1] < 0.25 || h[2] < 0.2 || h[2] > 0.85 || (h[0] >= 35 && h[0] <= 290)) { continue; }   // dull, dark, pale, gold or cool
    if (h[0] >= 290 && h[0] < 345) { return MU_MAKEUP[h[2] > 0.6 ? "rose" : "berry"]; }
    return MU_MAKEUP[h[0] >= 10 && h[0] < 35 ? "coral" : "red"];
  }
  return MU_MAKEUP.rose;                                // cool or plain clothes: the painting's own rose
}
// the lipstick's five tones as the painting's lips have them: the upper lip its colour, the lower paler, the rim
// between, the seam and the corners' ticks darker (multiply: they darken the skin by as much as the paint did)
function muLipTones(c) {
  function mix(k) { return "rgb(" + c.map(function (v) { return Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)); }).join(", ") + ")"; }
  return {upper: mix(0), lower: mix(0.6), rim: mix(0.35), seam: mix(-0.15), tick: mix(-0.35)};
}
// The creases a feeling makes, and the face's fall with age, inside the face (the kit's feelingOf() and ageFall(), on
// this head). A feeling's creases only on an old face (owner, 2026-10-30: with lines "they just look old when they have
// emotions"), growing from age 0.3 to full at 0.8; a young face shows it by its brows, lids and mouth (muEye,
// muLipsPainted, muBrowTurn). On an old face:
//   the fold between the brows   worry, anger (as frownFold()), and anger's crease across the top of the nose
//   lines across the forehead    wonder, fear, awe: the whole brow; sadness and worry: short, over the inner brows
//   the smile's folds            from beside the nose round the corners of the mouth, a crease under the near eye,
//                                a dimple at the corner; laughing, crow's feet too
//   sadness                      the corners pulled down, the chin pressed up under the lower lip
// Age (look.age, 0 to 1), MU.ageLines:
//   fall    the kit's Lanna face (ageFall()): a hollow temple, bags under the eyes, the fold from the nose a soft shade
//           with a fine line, jowls, two faint lines across the brow, crow's feet
//   lines   fall, and firmer: three lines across the brow, lines from the corners of the mouth down to the jaw, a crease
//           under the lower lip, the fold between the brows
// look: the person's look; f: muFeelOf()'s numbers.
// A feeling as the kit gives it (feelingOf(): by name, look.feel, or by its numbers), with only the feeling's own smile
// (a cast member's resting smile is no feeling here). Returns feelingOf()'s numbers.
function muFeelOf(look) {
  var f = typeof feelingOf === "function" ? feelingOf(look) : {};
  var named = typeof FEELINGS !== "undefined" ? FEELINGS[FEELING_WAS[look.feel] || look.feel] : null;
  f.smile = named && named.smile || 0;
  return f;
}
function muFaceLines(look, f) {
  var age = clamp(look.age || 0), firm = MU.ageLines === "lines" ? age : 0;
  var old = clamp((age - 0.3) / 0.5);                 // a young face shows a feeling by its features, not by lines
  var w = function (k) { return (f[k] || 0) * old; };
  function crease(alpha, width, draw) {
    if (alpha <= 0.01) { return; }
    pen.save(); pen.lineCap = "round"; pen.strokeStyle = "rgba(120, 66, 48, " + Math.min(0.8, alpha) + ")";
    pen.lineWidth = width; pen.beginPath(); draw(); pen.stroke(); pen.restore();
  }
  // age's fall: hollows and fullness first, under the lines
  if (age > 0) {
    muGlow(-27, -58, 8, 11, "140, 80, 60", 0.14 * age);                        // the hollow temple
    muGlow(-4, -44.2, 7.5, 2.6, "140, 75, 60", 0.22 * age);                    // the bags under the eyes
    muGlow(25, -45.2, 4.5, 2.2, "140, 75, 60", 0.18 * age);
    muGlow(4, -5, 8, 5, "140, 75, 55", 0.2 * age);                             // the jowls
    muGlow(29, -6, 6, 5, "140, 75, 55", 0.15 * age);
    crease(0.3 * age, 0.6, function () { pen.moveTo(-10.5, -44.6); pen.quadraticCurveTo(-4, -41.8, 2, -44.4);
                                         pen.moveTo(21.5, -45.6); pen.quadraticCurveTo(25, -43.6, 28.8, -45.6); });
  }
  // the fold from beside the nose round the mouth: a smile's, and age's
  var fold = Math.max(w("smile"), w("laugh"), 0.8 * w("full")), naso = Math.max(fold, age);
  if (naso > 0) {
    var nasoPath = function () { pen.moveTo(13.6, -33.5); pen.bezierCurveTo(10.6, -28, 8.2, -21.5, 7.6, -13.5); };
    crease(0.07 * naso, 2.6, nasoPath);                                         // its soft shade
    crease(0.2 * naso + 0.12 * firm, 0.6, nasoPath);
    crease(0.16 * fold + 0.12 * age, 0.55, function () { pen.moveTo(26.4, -32); pen.quadraticCurveTo(28.6, -24, 27.6, -15.5); });
  }
  crease(0.32 * fold, 0.6, function () { pen.moveTo(-10, -45.2); pen.quadraticCurveTo(-4, -42.6, 1.5, -45.2); });   // the cheek up
  crease(0.4 * fold, 0.6, function () { pen.moveTo(8.8, -17); pen.quadraticCurveTo(8, -15.6, 8.4, -14.2); });       // a dimple
  // crow's feet: laughing, and age
  var feet = Math.max(w("laugh"), 0.4 * w("smile"), 0.8 * age);
  crease(0.32 * feet + 0.12 * firm, 0.55, function () {
    pen.moveTo(-14.6, -50.6); pen.lineTo(-19.4, -52.4);
    pen.moveTo(-14.8, -48.8); pen.lineTo(-19.6, -48.6);
    if (feet > 0.6) { pen.moveTo(-14.2, -47.2); pen.lineTo(-18.4, -45); }
  });
  // the fold between the brows
  var knit = Math.max(clamp(1.25 * Math.max(w("worry"), w("anger")) - 0.25), 0.6 * firm);
  crease(0.5 * knit, 0.7, function () {
    pen.moveTo(13.6, -61); pen.quadraticCurveTo(12.6, -58, 13.8, -54.6);
    pen.moveTo(17.6, -61.4); pen.quadraticCurveTo(18.6, -58, 17.4, -55);
  });
  crease(0.35 * w("anger"), 0.6, function () { pen.moveTo(13.4, -54.2); pen.quadraticCurveTo(15.8, -53, 18.4, -54.2); });
  // lines across the forehead: the whole brow raised (wonder, fear, awe), or only its inner ends (sadness, worry)
  var whole = clamp(1.5 * Math.max(w("wonder"), w("fear"), 0.7 * w("rapt")) - 0.5), inner = Math.max(0.8 * w("sad"), w("worry")) * (1 - whole);
  var brow = Math.max(whole, inner, 0.5 * age);
  if (brow > 0) {
    var half = 8 + 14 * Math.max(whole, 0.5 * age) / brow, rows = brow > 0.55 || firm > 0.5 ? 3 : 2;
    crease(0.36 * brow + 0.12 * firm, 0.6, function () {
      for (var n = 0; n < rows; n++) {
        var y = -73.5 - n * 4.6, cx = 13 - n * 0.5, h = half * (1 - n * 0.12), bend = 1.6 + 2.4 * inner;
        pen.moveTo(cx - h, y + 0.8); pen.quadraticCurveTo(cx, y - bend, cx + h, y + 0.8);
      }
    });
  }
  // sadness: the corners pulled down, the chin pressed up; age (firm): the lines from the corners to the jaw
  crease(0.36 * w("sad") + 0.3 * firm, 0.6, function () { pen.moveTo(9.0, -14.6); pen.quadraticCurveTo(7.6, -10.5, 7.2, -6 - 2 * firm); });
  crease(0.3 * Math.max(w("sad"), w("worry")) + 0.25 * firm, 0.6, function () { pen.moveTo(13, -6.6); pen.quadraticCurveTo(17.5, -5.2, 22, -6.8); });
}
// A brow lifted and turned with the feeling (MU.feelLines "brows"), about its middle (x, y): up in wonder, fear, awe
// and sadness; its inner end down in anger, up in sadness and worry. side: 1 the near brow (inner end to the right),
// -1 the far one (inner end to the left). Changes pen's transform: the caller saves and restores.
function muBrowTurn(f, x, y, side) {
  var w = function (k) { return f[k] || 0; };
  var lift = 4 * w("wonder") + 3 * w("fear") + 2.5 * w("rapt") + 1 * w("sad") + 0.8 * w("worry") - 1.6 * w("anger");
  var turn = side * (0.26 * w("anger") - 0.2 * Math.max(w("sad"), w("worry")) - 0.06 * w("fear"));
  pen.translate(x, y - lift); pen.rotate(turn); pen.translate(-x, -y);
}
// The cheeks and the temple, inside the face (MU.cheek):
//   now     a flat warm oval on the near cheek, a flat shade at the temple: both edges show
//   soft    the same places, each fading out from its middle: no edge anywhere
//   swept   a lady's rouge on the cheekbone, swept up and back toward the ear, a touch on the far cheek
//   dancer  swept, and a wash on the lids, deepest at the outer corner, as dancers paint them
// Its colours are muMakeup's. A man or a child keeps soft warmth whichever: no rouge.
function muCheeks(lady, paint, f) {
  var lift = f ? Math.max(f.smile || 0, f.laugh || 0, 0.8 * (f.full || 0)) : 0;   // a smile lifts the cheeks: the rouge goes up with them
  var kind = MU.cheek || "now";
  if (kind === "now") {
    pen.fillStyle = "rgba(200, 90, 80, " + MU.flush + ")";
    pen.beginPath(); pen.ellipse(-8, -30, 12, 8, 0, 0, 7); pen.fill();
    pen.fillStyle = "rgba(80, 40, 30, 0.12)";
    pen.beginPath(); pen.ellipse(-30, -60, 10, 22, 0, 0, 7); pen.fill();
    return;
  }
  muGlow(-31, -58, 13, 26, "80, 40, 30", 0.13);                      // the temple, under the hair
  pen.save(); pen.translate(0, -2.5 * lift);
  if (!lady || !paint || kind === "soft") {
    muGlow(-8, -31, 15, 10, "200, 90, 80", (lady ? 0.2 : 0.14) * (1 + 0.3 * lift));
    pen.restore();
    return;
  }
  muGlow(-11, -35, 16, 9, paint.rouge, 0.24, 0.45);             // the near cheekbone, rising toward the ear
  muGlow(-5, -31, 8, 6, paint.rouge, 0.12 + 0.12 * lift);      // the apple of the cheek, lighter; rounder in a smile
  muGlow(31.5, -34, 4.5, 6.5, paint.rouge, 0.16);                // the far cheek, between the nose and the edge
  pen.restore();
}
// The eye with a feeling (f: muFeelOf()'s numbers, or nothing): wide in wonder, fear and awe; the upper lid down in
// sleep, fullness and sadness, low and flat at the inner end in anger, at the outer end in sadness and worry; the
// lower lid up in a smile; shut and bowed up in a laugh; the look up in awe, down in sadness.
function muEye(c, long, way, lady, paint, f) {
  var inner = [c[0] - way * long / 2, c[1] + 1], outer = [c[0] + way * long / 2, c[1] - 0.6];
  f = f || {};
  var v = function (k) { return f[k] || 0; };
  var wide = Math.max(v("wonder"), v("fear"), 0.6 * v("rapt")), down = Math.max(v("lids") * (1 - v("laugh")), 0.3 * v("sad"));
  var upIn = Math.max(-0.6, 4 + 1.8 * wide - 4.4 * down - 2.6 * v("anger") - 0.4 * v("worry"));
  var upOut = Math.max(-0.6, 4 + 1.8 * wide - 4.4 * down - 1.2 * v("anger") - 1.8 * v("sad") - 1.2 * v("worry"));
  var low = 2.6 + 0.9 * wide - 2.4 * Math.max(0.7 * v("smile"), 0.6 * v("full")), gaze = -1.6 * v("rapt") + 0.9 * v("sad");
  var shut = v("laugh") > 0.5;
  if (paint && MU.cheek === "dancer") {                            // the lid's colour, under the white and the lid's line
    muGlow(c[0] + way * long * 0.1, c[1] - 4.5, long * 0.62, 5.5, paint.lid, 0.34);
    muGlow(outer[0], outer[1] - 2.5, long * 0.3, 3.4, paint.lidDeep, 0.32, -way * 0.35);
  }
  if (shut) {                                                       // a laughing eye: shut, bowed up, its lashes' line
    mLine(new MPath().M(inner[0], inner[1]).Q(c[0], c[1] - 5, outer[0], outer[1])
      .Q(outer[0] + way * long * 0.25, outer[1] - 1.4, outer[0] + way * long * (lady ? 0.45 : 0.25), outer[1] - (lady ? 3 : 1.8)), "#1c110c", 2.2);
    mLine(new MPath().M(inner[0] + way * long * 0.2, c[1] + 0.6).Q(c[0], c[1] - 2.2, outer[0] - way * long * 0.1, c[1] - 0.2), "rgba(70, 35, 25, 0.45)", 0.8);
    return;
  }
  var white = new MPath().M(inner[0], inner[1])
    .C(inner[0] + way * long * 0.3, c[1] - upIn, outer[0] - way * long * 0.25, c[1] - upOut, outer[0], outer[1])
    .C(outer[0] - way * long * 0.3, c[1] + low, inner[0] + way * long * 0.25, c[1] + low, inner[0], inner[1]).Z();
  pen.fillStyle = muColour("#f6efe2");
  pen.fill(white.path);
  pen.save(); pen.clip(white.path);
  var ix = c[0] + long * 0.22, iy = c[1] - 1.2 + gaze, ir = long * 0.15 + 0.9;
  pen.fillStyle = "#2a1a12"; pen.beginPath(); pen.arc(ix, iy, ir, 0, 7); pen.fill();
  pen.fillStyle = "#0e0806"; pen.beginPath(); pen.arc(ix, iy, ir * 0.5, 0, 7); pen.fill();
  if ((MU.cheek || "now") === "now") { pen.fillStyle = "rgba(60, 30, 20, 0.25)"; }   // the lid's shadow on the eye
  else {                                                          // fading down the white, not a band with an edge
    var lidTop = c[1] - 0.75 * Math.max(upIn, upOut), lidShade = pen.createLinearGradient(0, lidTop, 0, lidTop + 3.5);
    lidShade.addColorStop(0, "rgba(60, 30, 20, 0.34)"); lidShade.addColorStop(1, "rgba(60, 30, 20, 0)");
    pen.fillStyle = lidShade;
  }
  pen.fillRect(c[0] - long, c[1] - 8, long * 2, (MU.cheek || "now") === "now" ? 4.6 : 12);
  pen.restore();
  var lid = new MPath().M(inner[0], inner[1])
    .C(inner[0] + way * long * 0.3, c[1] - upIn - 0.4, outer[0] - way * long * 0.25, c[1] - upOut - 0.4, outer[0], outer[1])
    .Q(outer[0] + way * long * 0.25, outer[1] - 1.4, outer[0] + way * long * (lady ? 0.55 : 0.32), outer[1] - (lady ? 4 : 2.4));
  mLine(lid, "#1c110c", 2.2);
  var cr = 1.6 * wide;                                            // the crease goes up with a wide eye
  var crease = new MPath().M(inner[0] + way * long * 0.15, c[1] - 5 - cr).C(c[0] - way * long * 0.1, c[1] - 8.5 - cr, outer[0] - way * long * 0.2, c[1] - 8.2 - cr, outer[0] + way * long * 0.05, c[1] - 5 - cr);
  mLine(crease, "rgba(70, 35, 25, 0.6)", 0.9);
  var under = new MPath().M(inner[0] + way * long * 0.2, c[1] + low - 0.2).Q(c[0], c[1] + low + 1.2, outer[0] - way * long * 0.05, c[1] + 1);
  mLine(under, "rgba(70, 35, 25, " + (0.5 + 0.2 * (2.6 - Math.min(2.6, low))) + ")", 0.8);
}

// ---------- cloth ----------
// The woven figures of a band, along a line at height y: small diamonds, a zigzag, a braid, roundels, dots.
function muFigures(kind, y, w, colour, x0, x1, sag) {
  var path = new MPath(), step = Math.max(6, w * 1.6);
  function yy(x) { return y + sag * (1 - Math.pow((x - (x0 + x1) / 2) / ((x1 - x0) / 2), 2)); }
  if (kind === "zigzag") {
    path.M(x0, yy(x0));
    for (var x = x0, up = 1; x <= x1; x += step / 2, up = -up) { path.L(x, yy(x) + up * w * 0.6); }
    mLine(path, colour, 1.1);
    return;
  }
  if (kind === "braid") {
    for (x = x0; x <= x1; x += step) {
      path.M(x, yy(x) - w * 0.6).Q(x + step * 0.5, yy(x), x + step, yy(x) - w * 0.6);
      path.M(x, yy(x) + w * 0.6).Q(x + step * 0.5, yy(x), x + step, yy(x) + w * 0.6);
    }
    mLine(path, colour, 1);
    return;
  }
  for (x = x0 + step / 2; x <= x1; x += step) {
    var cy = yy(x);
    if (kind === "dots") { path.E(x, cy, w * 0.35, w * 0.35); }
    else if (kind === "roundels") { path.E(x, cy, w * 0.7, w * 0.7); path.E(x, cy, w * 0.25, w * 0.25); }
    else { path.M(x, cy - w * 0.8).L(x + w * 0.8, cy).L(x, cy + w * 0.8).L(x - w * 0.8, cy).Z(); }
  }
  pen.fillStyle = colour;
  if (kind === "roundels") { mLine(path, colour, 1); } else { pen.fill(path.path); }
}
// The pha sin: a straight tube from the waist to the ankle. Its own bands (SINS), and between them the fine stripes
// of the cloth in its body's own tones, every one bowed a little round the body, bent where the cloth folds; the
// folds' shadows; the woven figures; the foot band.
function muSin(top, hem, waistX, hipX, hemX, design) {
  var body = design[0], bands = design[1];
  var sin = new MPath().M(waistX[0], top)
    .C(hipX[0] - 4, top + 40, hipX[0], top + 90, hipX[0] + 4, top + 160)
    .C(hipX[0] + 8, top + 260, hemX[0] + 2, hem - 60, hemX[0], hem)
    .Q((hemX[0] + hemX[1]) / 2, hem + 8, hemX[1], hem)
    .C(hemX[1] - 2, hem - 60, hipX[1] - 6, top + 260, hipX[1] - 4, top + 160)
    .C(hipX[1], top + 90, hipX[1] + 2, top + 40, waistX[1], top).Z();
  mFill(sin, body, 12);
  pen.save(); pen.clip(sin.path);
  var long = hem - top, k = long / 196, x0 = hipX[0] - 10, x1 = hipX[1] + 10;
  var folds = [[-18, 0.35], [14, 0.55], [34, 0.45]];          // where the cloth folds: across, and from how far down
  function bow(x, y) {                                          // a stripe's height at x: bowed round the body, bent at a fold
    var b = 7 * (1 - Math.pow((x - (x0 + x1) / 2) / ((x1 - x0) / 2), 2));
    folds.forEach(function (f) { if ((y - top) / long > f[1]) { b += 3 * Math.exp(-Math.pow((x - f[0]) / 6, 2)); } });
    return y + b;
  }
  function stripe(y, w, colour) {
    var s = new Path2D(), n, x;
    s.moveTo(x0, bow(x0, y) - w / 2);
    for (x = x0; x <= x1; x += 4) { s.lineTo(x, bow(x, y) - w / 2); }
    for (x = x1; x >= x0; x -= 4) { s.lineTo(x, bow(x, y) + w / 2); }
    s.closePath();
    pen.fillStyle = muColour(colour);
    pen.fill(s);
  }
  var light = blend(body, "#f2e6c8", 0.4), dark = blend(body, "#1a1210", 0.4);
  for (var y = top + 30; y < hem - 70; y += 7) { stripe(y, 1.4, (Math.round((y - top) / 7) % 3) ? dark : light); }   // the cloth's fine stripes
  var luxe = typeof muTinJok !== "undefined";
  if (luxe) { pen.restore(); thGoldWork(sin, 19); pen.save(); pen.clip(sin.path); }
  bands.forEach(function (b) {
    if (luxe && b[2] * k > 30 && b[0] > 0.5) { muTinJok(top + b[0] * long - b[2] * k / 2, top + b[0] * long + b[2] * k / 2, x0, x1, b[1]); }
    else { stripe(top + b[0] * long, b[2] * k, b[1]); }
  });
  bands.forEach(function (b) { if (b[3]) { muFigures(b[3], top + b[0] * long, Math.max(2.4, b[2] * k), muColour(b[1] === "#e0b23a" ? "#7a2a22" : b[1]), x0, x1, 7); } });
  bands.forEach(function (b) {                                   // a broad band carries a woven figure of its own, in gold
    if (b[2] * k > 30 && !luxe) { muFigures("diamonds", top + b[0] * long, 5, muColour("#e0b23a"), x0, x1, 7); }
  });
  pen.globalAlpha = 0.16;                                        // the shadow in each fold
  folds.forEach(function (f) {
    var g = pen.createLinearGradient(f[0] - 8, 0, f[0] + 8, 0);
    g.addColorStop(0, "rgba(40, 20, 15, 0)"); g.addColorStop(0.6, "rgba(40, 20, 15, 1)"); g.addColorStop(1, "rgba(40, 20, 15, 0)");
    pen.fillStyle = g; pen.fillRect(f[0] - 8, top + f[1] * long, 16, long);
  });
  pen.globalAlpha = 1;
  var foldLines = new MPath();
  folds.forEach(function (f) { foldLines.M(f[0] + 2, top + f[1] * long).C(f[0] + 3, top + f[1] * long + 60, f[0] + 1, hem - 80, f[0] + 3, hem); });
  mLine(foldLines, muInk(muColour(body)), 1);
  pen.restore();
  mBrush(sin, muInk(muColour(body)), 1.5);
}

// An arm: a sleeve to the wrist (creased at the elbow) or bare, bangles, the hand.
function muArm(S, E, W, wide, sleeve, skin, look, outward, bend, lady) {
  var at = muBent(S, E, W);
  var dir = Math.atan2(W[1] - at(0.96)[1], W[0] - at(0.96)[0]);
  muHand(W[0], W[1], dir - outward * 0.3, outward, bend, skin, lady);
  var shape = muTube(at, muLimbWide(wide, [lady ? 1.2 : 2.4, lady ? 1.3 : 2.6]));
  mShape(shape, sleeve || skin, 6, 1.4);
  var marks = new MPath();
  if (sleeve) {                                     // creases at the elbow, the cuff's edge
    [0.44, 0.5, 0.56].forEach(function (t, i) {
      var p = at(t), q = at(t + 0.01), nx = -(q[1] - p[1]), ny = q[0] - p[0], l = Math.hypot(nx, ny) || 1, w = wide[1] * (i === 1 ? 0.9 : 0.6);
      marks.M(p[0] + nx / l * w, p[1] + ny / l * w).Q(p[0] + 3, p[1] + 2, p[0] - nx / l * w * 0.3, p[1] - ny / l * w * 0.3);
    });
    var c0 = at(0.965), c1 = at(0.95), cx = -(c0[1] - c1[1]), cy = c0[0] - c1[0], cl = Math.hypot(cx, cy) || 1;
    marks.M(c0[0] + cx / cl * wide[2] * 1.2, c0[1] + cy / cl * wide[2] * 1.2).L(c0[0] - cx / cl * wide[2] * 1.2, c0[1] - cy / cl * wide[2] * 1.2);
    pen.save(); pen.clip(shape.path); mLine(marks, muInk(muColour(sleeve)), 1); pen.restore();
  }
  if (typeof muBangles !== "undefined") {
    if (lady || !sleeve) { muArmlet(at, 0.27, wide[0] * 0.95); }
    muBangles(at, 0.92, (look.bangles || 0) + (lady ? 3 : 1), wide[2]);
  } else {
    for (var k = 0; k < (look.bangles || 0); k++) {
      var b = at(0.9 - k * 0.026), c = at(0.91 - k * 0.026), ang = Math.atan2(c[1] - b[1], c[0] - b[0]);
      mShape(new MPath().E(b[0], b[1], 2.3, wide[2] + 2.6, ang), MU_METAL.base, 1, 0.9);
    }
  }
}

// ---------- round the neck ----------
// A ring round the neck as a three-quarter view sees it: the neck a cylinder, centre c, radius r, at height y0; th the
// angle round it from the side facing us (its ends, th = +-pi/2, are the neck's edges, where the ring goes behind it).
// Seen a little from above, its near side lies lower (MU_RING_E); it hangs lowest at the body's front, turned toward
// the face (MU_RING_TURN), by "drop". Necklines, collars and chains all follow such rings, so they sit on the neck.
var MU_RING_E = 0.22, MU_RING_TURN = 0.6;
function muRing(c, y0, r, drop) {
  return function (th) { return [c + r * Math.sin(th), y0 + MU_RING_E * r * Math.cos(th) + drop * (1 + Math.cos(th - MU_RING_TURN)) / 2]; };
}
// the ring's front from one edge of the neck to the other (or back), n steps
function muRingArc(ring, from, to, n) {
  var out = [];
  for (var k = 0; k <= (n || 24); k++) { out.push(ring(from + (to - from) * k / (n || 24))); }
  return out;
}
// A collar of gold round the neck, three-quarter: a band between the ring at the neck (inner) and a wider, lower one
// lying on the shoulders (outer), flames hanging from its outer edge, beads along it, a pendant at the front.
function muCollar3q(c, y0, r, wide, drop) {
  var inner = muRing(c, y0, r, drop * 0.6), outer = muRing(c, y0 + 4, r + wide, drop);
  var H = Math.PI / 2, band = new MPath().poly(muRingArc(outer, -H, H).concat(muRingArc(inner, H, -H)), true);
  for (var k = 1; k < 12; k++) {                    // the flames, hanging from the outer edge
    var th = -H + Math.PI * k / 12, p = outer(th), q = outer(th + 0.01), a = Math.atan2(q[1] - p[1], q[0] - p[0]);
    muFlame(p[0], p[1], 6 + (k % 2) * 2, 2.2, 1, a + Math.PI / 2 + Math.PI);
  }
  muGold(band);
  var mid = muRing(c, y0 + 2, r + wide * 0.45, drop * 0.8);
  muBeads(function (t) { return mid(-H * 0.96 + Math.PI * 0.96 * t); }, 3.2, 1.1);
  var f = outer(MU_RING_TURN);                      // the pendant, at the front
  muGold(new MPath().M(f[0], f[1] - 2).C(f[0] + 7, f[1] + 4, f[0] + 5, f[1] + 13, f[0], f[1] + 18).C(f[0] - 5, f[1] + 13, f[0] - 7, f[1] + 4, f[0], f[1] - 2).Z());
  muJewel(f[0], f[1] + 7, 2.8, MU_STONE[0]);
}

// The part of a sabai (or a man's sash) that goes over the shoulder: from the band's end on the chest (a, b: its upper
// and lower corners) up over the shoulder's top and down the back to where it hangs (c: the back's outer edge, d: where
// the fold across the upper arm meets it), drawn over the arm; the gold borders run on round it.
function muOverShoulder(a, b, c, d, colour, luxe) {
  var top = [(a[0] + c[0]) / 2 - 6, Math.min(a[1], c[1]) - 8];        // the crown of the shoulder, the cloth over it
  var piece = new MPath().M(a[0], a[1]).C(top[0] + 10, top[1], top[0] - 6, top[1] + 2, c[0], c[1])
    .C(c[0] - 4, c[1] + 12, d[0] - 4, d[1] - 6, d[0], d[1])
    .C(d[0] + 5, d[1] - 8, b[0] - 4, b[1] + 6, b[0], b[1]).Z();
  mShape(piece, colour, 6, 1.3);
  if (luxe) {
    muSilk(piece, colour, [[a[0] - 6, a[1] - 2, c[0] + 4, c[1] + 6]], [[a[0] - 10, a[1] - 4, c[0] + 2, c[1] + 2]]);
    muBrocade(muCurve([a[0] + 1, a[1] + 3], [top[0] + 10, top[1] + 4], [top[0] - 4, top[1] + 6], [c[0] + 3, c[1] + 2]), 3.1, colour);
    muBrocade(muCurve([b[0] + 1, b[1] + 2], [b[0] - 5, b[1] + 6], [d[0] + 6, d[1] - 6], [d[0] + 2, d[1] - 1]), 3.1, colour);
  }
  mLine(new MPath().M(d[0] + 1, d[1] - 2).C(d[0] + 8, d[1] - 14, b[0] - 2, b[1] + 2, b[0] + 2, b[1] - 1), muShade(muColour(colour)), 0.9);   // the fold
}

// ---------- the woven sabai ----------
// A person's sabai woven as the kit weaves it (weaving.js: look.sabai[2] a weave of SABAI_WEAVES, [3] its colours), along
// one strip: from the end tucked in at the waist, across the chest, over the shoulder (gathered narrower, as the kit's
// is) and on, and its end hanging down the back with its woven end and fringe. Its parts are drawn apart so each lies
// where it should: "back" before the body (only what is past its edge is seen), "chest" after the body, "over" after
// the arm, on the shoulder.
// The strip: "chest" and "over" two cubic curves [p0, c1, c2, p3] end to end, "half" its half-width at the waist, at
// the chest's top and over the shoulder; "crown" how far along "over" it passes the shoulder's outer edge and goes
// behind (the part to there is drawn on the arm, the rest behind the body); or "edge", the x of the arm's outer edge:
// the whole of "over" then drawn behind, and again on the arm cut at that edge, so it goes behind along the arm's line; "back" the hanging end: its inner and outer edge at the top and the foot.
var MU_SABAI = {
  lady: {chest: [[28, -434], [18, -494], [-16, -548], [-49, -568]], over: [[-49, -568], [-57, -573], [-63, -567], [-66, -550]],
         half: [12.5, 15, 11], crown: 0.5, back: {top: -556, foot: -312, inner: [-50, -52], outer: [-76, -84], half: 13}},
  man: {chest: [[36, -435], [20, -495], [-24, -558], [-63, -581]], over: [[-63, -581], [-74, -583], [-86, -579], [-97, -568]],
        half: [12, 13.5, 10], edge: -86, back: {top: [-561, -575], foot: -440, inner: [-90, -91], outer: [-104, -107], half: 9}}   // its top on the band's slanted end
};
function muWeaveOf(look) { return typeof sabaiWeave === "function" && look.sabai && look.sabai[2] ? sabaiWeave(look.sabai[2], look.sabai[3]) : null; }
// the strip's middle line: [x, y, tangent x, tangent y] a distance along it, its length, where the chest part ends, and "crown",
// where it turns over the shoulder's top to go down behind
function muStrip(spec) {
  var pts = [], marks = [0], len = 0, chestEnd = 0;
  [spec.chest, spec.over].forEach(function (b, k) {
    for (var n = k ? 1 : 0; n <= 30; n++) {
      var s = n / 30, v = 1 - s;
      var q = [v * v * v * b[0][0] + 3 * v * v * s * b[1][0] + 3 * v * s * s * b[2][0] + s * s * s * b[3][0],
               v * v * v * b[0][1] + 3 * v * v * s * b[1][1] + 3 * v * s * s * b[2][1] + s * s * s * b[3][1]];
      if (pts.length) { len += Math.hypot(q[0] - pts[pts.length - 1][0], q[1] - pts[pts.length - 1][1]); marks.push(len); }
      pts.push(q);
    }
    if (!k) { chestEnd = len; }
  });
  function at(along) {
    along = Math.max(0, Math.min(len, along));
    var i = 1; while (i < marks.length - 1 && marks[i] < along) { i++; }
    var a = pts[i - 1], b = pts[i], w = (along - marks[i - 1]) / (marks[i] - marks[i - 1] || 1), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w, (b[0] - a[0]) / l, (b[1] - a[1]) / l];
  }
  function half(along) {                            // wider up the chest, gathered over the shoulder
    var h = spec.half;
    return along <= chestEnd ? h[0] + (h[1] - h[0]) * along / chestEnd : h[1] + (h[2] - h[1]) * Math.min(1, (along - chestEnd) / ((len - chestEnd) * 0.5));
  }
  return {at: at, half: half, length: len, chestEnd: chestEnd, crown: chestEnd + (len - chestEnd) * (spec.crown || 0.5)};
}
function muSabaiWoven(spec, part, look) {
  var weave = muWeaveOf(look), S = muStrip(spec), H = Math.max.apply(null, spec.half), ink = muInk(weave.ground);
  if (part === "back") {                            // the end down the back: the kit's own, woven end and fringe at the foot
    var B = spec.back;
    var P = sabaiBackThreads(pen, function (u, v, push) {
      var xi = B.inner[0] + (B.inner[1] - B.inner[0]) * v, xo = B.outer[0] + (B.outer[1] - B.outer[0]) * v;
      var top = B.top.length ? B.top[0] + (B.top[1] - B.top[0]) * u : B.top;   // a top level, or slanted inner to outer
      return [xi + (xo - xi) * u + push[0], top + (B.foot - top) * v + push[1]];
    }, B.foot - (B.top.length ? B.top[0] : B.top), B.half, look.sabai[2], clock, look.sabai[3], 0.4);
    var rim = P.map(function (r) { return r[0]; }).concat(P[P.length - 1], P.map(function (r) { return r[r.length - 1]; }).reverse());
    var shape = new MPath().poly(rim.map(function (q) { return [q[0], q[1]]; }), true);
    pen.save(); pen.fillStyle = "rgba(20, 0, 10, 0.22)"; pen.fill(shape.path); pen.restore();   // the back of a cloth, in shadow
    mBrush(shape, ink, 1.1);
    return;
  }
  function spot(along, across) {
    var p = S.at(along), k = S.half(along) / H;
    return [p[0] - p[3] * across * k, p[1] + p[2] * across * k];
  }
  // "chest" to the shoulder; "over" to the crown, on the shoulder; "behind" from the crown down the back, behind it
  var span = {chest: [0, S.chestEnd], over: [S.chestEnd - 0.5, S.crown], behind: [S.crown - 0.5, S.length]}[part];
  if (spec.edge !== undefined && part !== "chest") { span = [S.chestEnd - 0.5, S.length]; }
  var from = span[0], to = span[1];
  pen.save();
  if (spec.edge !== undefined && part === "over") { pen.beginPath(); pen.rect(spec.edge, -800, 400, 800); pen.clip(); }
  sabaiThreads(pen, spot, from, to, H, look.sabai[2], clock, look.sabai[3]);
  var edge = new MPath(), a, k;                     // its long edges inked; where one part meets the next, no line
  [-H, H].forEach(function (side) {
    for (k = 0; k <= 40; k++) { a = from + (to - from) * k / 40; var q = spot(a, side); if (k) { edge.L(q[0], q[1]); } else { edge.M(q[0], q[1]); } }
  });
  if (part === "chest") { var e0 = spot(0, -H), e1 = spot(0, H); edge.M(e0[0], e0[1]).L(e1[0], e1[1]); }   // the end tucked in at the waist
  mBrush(edge, ink, 1.2);
  pen.restore();
}

// ---------- the figure ----------
// The shadow the jaw throws on the neck: dark under the chin, fading down, inside the neck's (or the body's) shape.
function muUnderJaw(rec, chinY, skin) {
  pen.save(); pen.clip(rec.path);
  var g = pen.createLinearGradient(0, chinY - 30, 0, chinY + 16), c = muShade(muColour(skin));   // from up under the jaw's
  g.addColorStop(0, c); g.addColorStop(0.6, c); g.addColorStop(1, "rgba(0, 0, 0, 0)");             // sides, where it rises
  pen.globalAlpha = 0.28; pen.fillStyle = g; pen.fillRect(-60, chinY - 30, 120, 46);
  pen.restore();
}
function muLower(A) { pen.transform(1, 0, A, 1, 0, 0); }
// MU_BEND: the upper body tipped about the waist (radians, forward above 0), MU_NOD: the head turned about the chin, both
// while a painted figure is drawn, from person()'s own figure in the same moves (peopleMoves(); the owner, 2026-11-09:
// "The painted women need to move like the other model figures"). 0 when nothing is being drawn.
var MU_BEND = 0, MU_NOD = 0;
function muUpper(A, B, Y0) {
  if (MU_BEND) { pen.translate(0, Y0); pen.rotate(MU_BEND); pen.translate(0, -Y0); }
  pen.transform(1, 0, B, 1, (A - B) * Y0, 0);
}

var NECK_DROP = [2, 16];                              // where the chin sits below "chin": a lady's, a man's (was -4, 8)
// A man's two legs now, each [hip x, y, knee x, y, ankle x, y]: standing, or in the walk of mural_women.js (wmWalk): each foot goes
// 40 before and behind him, lifted as it comes through, the knee ahead of it. Returns the list.
// e.g. muManLegs()[0][4];   // 36 at rest
function muManLegs() {
  var legs = [[24, -376, 30, -198, 36, -36], [-26, -380, -24, -200, -16, -34]], walk = typeof wmWalk === "function" ? wmWalk() : null;
  if (walk === null) { return legs; }
  return legs.map(function (L, n) {
    var at = walk + (n ? Math.PI : 0), out = Math.sin(at), lift = Math.max(0, Math.cos(at));
    return [L[0] + 4 * out, L[1], L[2] + 18 * out + 12 * lift, L[3] - 10 * lift, L[4] + 40 * out, L[5] - 26 * lift];
  });
}

function muralPerson(x, y, look, opts) {
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun;
  MU_PX = (opts.head || 70) / 100;
  muDress(look);                                    // her jewellery's metal and stones, from her clothes
  var skin = look.skin || STYLE.skin;
  if (lady) { skin = blend(skin, "#f6ead8", MU.skinLady); }
  if (typeof TH_SKINS !== "undefined") { TH_SKINS[muColour(skin)] = true; }
  var luxe = typeof muGold !== "undefined", thangka = typeof thScarf !== "undefined";
  var A = lady ? -0.028 : -0.012, B = lady ? 0.07 : 0.03, Y0 = lady ? -430 : -440;
  pen.save();
  pen.translate(x, y);
  pen.scale(MU_PX, MU_PX);
  var tall = lady ? 700 : 720, chin = -tall + 100;
  if (lady) {
    var design = SINS[(look.sin || 0) % SINS.length], shirt = look.shirt || skin;
    pen.save(); muUpper(A, B, Y0);
    muArm([28, -548], [46, -456], [44, -372], [12, 8.5, 6], look.shirt, skin, look, 1, 0.55, true);
    pen.restore();
    pen.save(); muLower(A);
    muFoot(6, -6, 52, skin);
    muFoot(-22, 0, 56, skin);
    muSin(-432, -16, [-40, 32], [-64, 54], [-50, 46], design);
    if (thangka) { thSwags(-418, -58, 50, 4, 20); }
    pen.restore();
    pen.save(); muUpper(A, B, Y0);
    var neck = muTube(function (t) { return [6 - 6 * t, -610 + 42 * t]; }, function (t) { return 14 + 3 * t; });
    mShape(neck, skin, 5, 1.3);
    muUnderJaw(neck, chin + NECK_DROP[0] - 4, skin);
    var lneck = muRing(2.57, -586, 15.7, 4), H = Math.PI / 2;   // the neck's foot (its tube at y -586: centre 2.57, half 15.7)
    var lL = lneck(-H), lR = lneck(H);
    var blouse = new MPath().M(lL[0], lL[1])
      .C(-30, -582, -50, -578, -60, -562).C(-68, -548, -66, -520, -60, -498).C(-54, -476, -42, -458, -40, -436)
      .L(-40, -424).L(32, -424)
      .C(28, -440, 30, -458, 40, -474).C(54, -490, 62, -506, 56, -524).C(52, -540, 40, -552, 34, -562)
      .C(28, -574, 22, -580, lR[0], lR[1]);
    muRingArc(lneck, H, -H).forEach(function (q) { blouse.L(q[0], q[1]); });   // the opening, round the neck's front
    blouse.Z();
    var woven = muWeaveOf(look);
    if (woven) { muSabaiWoven(MU_SABAI.lady, "back", look); muSabaiWoven(MU_SABAI.lady, "behind", look); }   // down her back, behind her
    mShape(blouse, shirt, 12, 1.5);
    if (thangka) { thGoldWork(blouse, 15, "flowers"); }
    var creases = new MPath().M(30, -478).Q(40, -487, 50, -484)                 // under the bust, and the cloth drawn to the waist
      .M(-30, -470).Q(-22, -450, -28, -432).M(-10, -476).Q(-8, -456, -14, -434).M(14, -470).Q(18, -452, 12, -434);
    mLine(creases, muInk(muColour(shirt)), 0.9);
    if (look.sabai && !woven) {
      var sb = look.sabai;
      var tail = new MPath().M(-60, -560).C(-82, -500, -86, -410, -80, -310).Q(-66, -300, -50, -316).C(-54, -410, -48, -500, -38, -580).Z();
      mShape(tail, sb[0], 8, 1.4);
      if (luxe) {
        muSilk(tail, sb[0], [[-66, -540, -72, -330], [-58, -520, -62, -330]], [[-74, -520, -74, -330]]);
        muTassels(function (t) { return [-80 + 30 * t, -310 + 10 * t * t - 4 * t]; }, 0.18, 9);
      } else {
        var fringe = new MPath();
        for (var fx = -79; fx <= -51; fx += 3.5) { fringe.M(fx, -312 + (fx + 66) * (fx + 66) * 0.012).L(fx - 1, -298 + (fx + 66) * (fx + 66) * 0.012); }
        mLine(fringe, muColour(sb[1]), 1);
      }
      var cloth = new MPath().M(-38, -580).C(-6, -560, 30, -500, 40, -438).L(16, -430).C(6, -488, -26, -536, -60, -556).Z();
      mShape(cloth, sb[0], 8, 1.4);
      if (luxe) {
        muSilk(cloth, sb[0], [[-30, -560, 24, -446], [-18, -566, 32, -450], [-44, -556, 10, -440]], [[-24, -566, 30, -452]]);
        muBrocade(muCurve([-37, -577], [-6, -557], [29, -497], [38, -440]), 3.2, sb[0]);
        muBrocade(muCurve([-59, -553], [-26, -533], [6, -486], [18, -432]), 3.2, sb[0]);
        muBrocade(muCurve([-58, -556], [-80, -500], [-83, -410], [-77, -318]), 3.2, sb[0]);
        muBeads(muCurve([-48, -566], [-16, -546], [14, -490], [26, -436]), 3.4, 1.3);   // the gold chain along the cloth
      }
      var trim = new MPath();
      trim.M(-37, -577).C(-6, -557, 29, -497, 38, -440);
      trim.M(-59, -553).C(-26, -533, 6, -486, 18, -432);
      trim.M(-58, -556).C(-80, -500, -83, -410, -77, -318);
      if (!luxe) { mLine(trim, muColour(sb[1]), 2.6); }
      var drape = new MPath().M(-20, -560).C(0, -530, 16, -490, 24, -446).M(-70, -480).C(-72, -430, -70, -380, -66, -320);
      mLine(drape, muShade(muColour(sb[0])), 1);
    }
    mLine(new MPath().poly(muRingArc(muRing(2.57, -584, 15.2, 4), -H * 0.92, H * 0.92), false), muInk(muColour(shirt)), 1.1);
    muArm([-50, -550], [-72, -458], [-48, -374], [12.5, 8.5, 6], look.shirt, skin, look, -1, 0.55, true);
    if (woven) {                                     // the sabai over the arm and the shoulder: across the chest, over the top
      muSabaiWoven(MU_SABAI.lady, "chest", look);
      muSabaiWoven(MU_SABAI.lady, "over", look);
    }
    if (luxe) {
      muBelt(-428, -42, 34, -2);
      muCollar3q(2.57, -589, 16.2, 7, 8);            // round the neck, on its ring
    }
    if (thangka) { var cr = muRing(2.57, -586, 16.4, 6); thLongChain(cr(-H), cr(H), [6, -500]); }   // from behind the neck
    else if (look.sabai) { muOverShoulder([-38, -580], [-60, -556], [-74, -560], [-73, -524], look.sabai[0], luxe); }
    if (thangka && look.scarf) {                     // its two falls, over the forearms and down to the ground in a curl
      var sw = Math.sin(clock * 0.9) * 6;
      thScarf(muCurve([-62, -452], [-104, -400], [-70 + sw, -230], [-112 + sw, -40]), 12, look.scarf[0], look.scarf[1], 1, -1.1);
      thScarf(muCurve([46, -446], [86, -380], [62 - sw, -220], [96 - sw, -50]), 10, look.scarf[0], look.scarf[1], 1, -1.0);
    }
    pen.restore();
  } else {
    var legsOut = look.patoi ? -262 : -60, legW = [24, 15, 8.5];
    pen.save(); muLower(A);
    muManLegs().forEach(function (L) {
      var leg = muTube(muBent([L[0], L[1]], [L[2], L[3]], [L[4], L[5]]), muLimbWide(legW, [1.5, 5]));
      muFoot(L[4] - 10, -2, 62, skin);
      mFill(leg, skin, 8);
      if (look.tattoo) {                            // the tattoo of the north, from the cloth to above the knee: dense dark blue
        pen.save(); pen.clip(leg.path);
        var ink = muColour("#27324f"), bottom = L[3] - 16, band = new Path2D();
        band.moveTo(L[0] - 40, legsOut - 4);
        band.lineTo(L[0] + 40, legsOut - 4);
        for (var bx = 40; bx >= -40; bx -= 5) { band.lineTo(L[0] + bx, bottom + 4 * Math.sin(bx * 0.9) + (bx % 10 ? 3 : 0)); }
        band.closePath();
        pen.globalAlpha = 0.42; pen.fillStyle = ink; pen.fill(band); pen.globalAlpha = 1;
        var tat = new MPath(), rows = Math.floor((bottom - legsOut) / 13);
        for (var z = 0; z <= rows; z++) {
          var ty = legsOut + 4 + z * 13;
          tat.M(L[0] - 40, ty - 6).Q(L[0], ty - 3, L[0] + 40, ty - 6);   // the frame of each row
          for (var tx = L[0] - 34 + (z % 2) * 5; tx < L[0] + 34; tx += 11) {
            var r = 3.4 + dice(z * 31 + tx) * 1.6;
            tat.M(tx - r, ty + r * 0.6).C(tx - r, ty - r, tx + r, ty - r, tx + r, ty).C(tx + r, ty + r * 0.8, tx - r * 0.2, ty + r * 0.8, tx - r * 0.1, ty);   // a scroll
          }
        }
        mLine(tat, blend(ink, "#0c1020", 0.5), 1.2);
        pen.restore();
      }
      mBrush(leg, muInk(muColour(skin)), 1.4);
      var knee = muBent([L[0], L[1]], [L[2], L[3]], [L[4], L[5]])(0.5);
      mLine(new MPath().M(knee[0] - 4, knee[1] - 4).Q(knee[0] + 2, knee[1], knee[0] + 6, knee[1] - 3), muShade(muColour(skin)), 0.8);
    });
    var cloth2 = new MPath().M(-50, -442).C(-62, -410, -64, -330, -62, legsOut + 6).Q(-30, legsOut + 14, -4, legsOut - 6)
      .L(2, legsOut - 26).L(8, legsOut - 6).Q(36, legsOut + 14, 60, legsOut + 4).C(62, -330, 58, -410, 44, -442).Z();
    var printed = WM && Array.isArray(WM.trousers), sarong = printed ? WM.trousers[0] : look.sarong || "#3a4660";
    mFill(cloth2, sarong, 12);
    if (printed) { mnPrint(cloth2, WM.trousers); }   // the cloth over his hips, printed as his knee trousers
    pen.save(); pen.clip(cloth2.path);
    var stripes = new MPath();
    for (var sy = -432; sy < legsOut + 10; sy += 9) { stripes.M(-80, sy).Q(0, sy + 12, 80, sy); }
    mLine(stripes, muColour(blend(sarong, "#e9dcc0", (Math.round(sy) % 2) ? 0.3 : 0.2)), 1.1);
    var wrap = new MPath().M(-40, -430).C(-10, -380, 10, -330, 4, legsOut - 20).M(-50, -400).C(-40, -360, -36, -320, -40, legsOut).M(46, -400).C(36, -350, 34, -310, 40, legsOut);
    mLine(wrap, muInk(muColour(sarong)), 1.1);
    pen.restore();
    if (thangka) { thGoldWork(cloth2, 17); }
    mBrush(cloth2, muInk(muColour(sarong)), 1.5);
    pen.restore();
    pen.save(); muUpper(A, B, Y0);
    var sleeve = look.bare ? null : look.shirt;
    muArm([44, -560], [60, -462], [56, -376], [15, 10.5, 7.5], sleeve, skin, look, 1, 0.22, false);
    var chest, H2 = Math.PI / 2;
    var mneck = look.bare ? muRing(0.5, -599, 27.3, 6) : muRing(0.9, -594, 28.4, 5);   // the neck's foot (bare: its edges at y -599, where it meets the shoulders)
    if (look.bare) {                                // the neck's sides flow into the shoulders: one outline
      chest = new MPath().M(-17, -634).C(-20, -614, -24, -600, -40, -594).C(-58, -590, -72, -584, -80, -570)
        .C(-90, -552, -84, -520, -74, -498).C(-62, -474, -50, -456, -48, -436)
        .L(-48, -424).L(40, -424)
        .C(38, -440, 40, -460, 48, -486).C(58, -504, 64, -526, 58, -546).C(54, -566, 44, -580, 30, -590)
        .C(26, -598, 29, -616, 33, -634).Z();
    } else {
      var neck2 = muTube(function (t) { return [8 - 8 * t, -626 + 36 * t]; }, function (t) { return 24 + 5 * t; });
      mShape(neck2, skin, 6, 1.3);
      muUnderJaw(neck2, chin + NECK_DROP[1] + 4, skin);
      var mL = mneck(-H2), mR = mneck(H2);
      chest = new MPath().M(mL[0], mL[1])            // the opening: the ring at the neck's foot (its tube: centre 0.9, half 28.4)
      .C(-44, -592, -66, -588, -80, -570).C(-90, -552, -84, -520, -74, -498).C(-62, -474, -50, -456, -48, -436)
      .L(-48, -424).L(40, -424)
      .C(38, -440, 40, -460, 48, -486).C(58, -504, 64, -526, 58, -546).C(54, -566, 44, -580, mR[0], mR[1]);
      muRingArc(mneck, H2, -H2).forEach(function (q) { chest.L(q[0], q[1]); });
      chest.Z();
    }
    var mwoven = look.bare && muWeaveOf(look);
    if (mwoven) { muSabaiWoven(MU_SABAI.man, "behind", look); muSabaiWoven(MU_SABAI.man, "back", look); }   // the hanging end over the cut
    else if (look.bare && look.sabai) {             // the sash's end, hanging down his back behind the arm
      var hang = new MPath().M(-92, -566).C(-100, -530, -102, -490, -99, -452).L(-84, -450).C(-86, -490, -84, -530, -78, -566).Z();
      mShape(hang, look.sabai[0], 6, 1.3);
      if (luxe) { muBrocade(muCurve([-92, -564], [-99, -530], [-101, -490], [-98, -454]), 3, look.sabai[0]); }
    }
    mShape(chest, look.bare ? skin : look.shirt, 14, 1.5);
    if (look.bare) {
      muUnderJaw(chest, chin + NECK_DROP[1] + 4, skin);
      // the chain on the bare neck's foot, out along the shoulders and down to the chest (just right of its middle,
      // x 16 in three-quarter, so the pendant clears the sash, which is drawn over the chain)
      if (thangka) { thLongChain(mneck(-H2), mneck(H2), [22, -540], [12, 5]); }
    }
    var lines = new MPath();
    if (look.bare) {
      lines.M(14, -522).Q(36, -506, 56, -520).M(30, -470).Q(34, -460, 32, -448)
        .M(-30, -584).Q(-44, -586, -58, -581).M(22, -586).Q(32, -588, 42, -582);   // the collarbones, out from the neck
      mLine(lines, muShade(muColour(skin)), 0.9);
      if (look.sabai && !mwoven) {
        var sash = new MPath().M(-50, -590).C(-14, -568, 30, -500, 48, -440).L(24, -430).C(10, -490, -34, -548, -76, -572).Z();
        mShape(sash, look.sabai[0], 6, 1.3);
        if (luxe) {
          muSilk(sash, look.sabai[0], [[-40, -574, 30, -450], [-56, -574, 18, -440]], [[-34, -580, 36, -452]]);
          muBrocade(muCurve([-50, -590], [-14, -568], [30, -500], [48, -440]), 3, look.sabai[0]);
          muBrocade(muCurve([-76, -572], [-34, -548], [10, -490], [24, -430]), 3, look.sabai[0]);
        }
        mLine(new MPath().M(-30, -572).C(0, -540, 22, -490, 34, -444), muShade(muColour(look.sabai[0])), 0.9);
      }
    } else {
      var band = muRingArc(muRing(0.9, -591, 28.4, 5), -H2 * 0.95, H2 * 0.95), fr = mneck(MU_RING_TURN);
      lines.M(fr[0] + 2, fr[1]).C(16, -530, 18, -480, 18, -430);   // the placket, from the opening's front
      band.forEach(function (q, i) { if (i) { lines.L(q[0], q[1]); } else { lines.M(q[0], q[1]); } });
      lines.M(-40, -520).Q(-30, -500, -36, -470).M(36, -500).Q(30, -480, 34, -456);
      mLine(lines, muInk(muColour(look.shirt)), 1);
      [-560, -520, -480].forEach(function (by) {
        if (luxe) { muBead(18 - (by + 560) * 0.02, by, 2.8); }
        else { mShape(new MPath().E(18 - (by + 560) * 0.02, by, 2.6, 2.6), blend(look.shirt, "#000000", 0.4), 0, 0.7); }
      });
      if (luxe) { var bring = muRing(0.9, -592.5, 28.4, 5); muBrocade(function (t) { return bring(-H2 * 0.97 + Math.PI * 0.97 * t); }, 2.6, look.shirt); }
    }
    function waistband() {                          // the check belt and, on a bare man, the gold belt over it
    var belt = new MPath().M(-50, -446).Q(0, -436, 44, -446).L(46, -418).Q(0, -408, -52, -418).Z();
    mFill(belt, "#efc9b0", 4);
    pen.save(); pen.clip(belt.path);
    pen.fillStyle = muColour("#c8463c");
    for (var cx = -56; cx < 50; cx += 7) { for (var cy = -448; cy < -408; cy += 7) { if ((Math.round((cx + cy) / 7) % 2 + 2) % 2 === 0) { pen.fillRect(cx, cy, 3.5, 3.5); } } }
    pen.restore();
    mBrush(belt, muInk(muColour("#efc9b0")), 1.3);
    if (luxe) {
      if (look.bare) { muBelt(-432, -50, 44, 0); } else { muJewel(0, -430, 4, MU_STONE[0]); }
    }
    }
    if (!mwoven) { waistband(); }
    if (thangka && !look.bare) { thLongChain(mneck(-H2), mneck(H2), [-8, -540]); }   // from behind the neck, at its edges
    muArm([-70, -562], [-88, -462], [-64, -378], [15, 10.5, 7.5], sleeve, skin, look, -1, 0.22, false);
    if (mwoven) {                                   // the sash over the arm and the shoulder, then the belt over its end
      muSabaiWoven(MU_SABAI.man, "chest", look);
      muSabaiWoven(MU_SABAI.man, "over", look);
      waistband();
    }
    else if (look.bare && look.sabai) { muOverShoulder([-50, -590], [-76, -572], [-93, -570], [-92, -536], look.sabai[0], luxe); }
    pen.restore();
  }
  var neckX = (A - B) * Y0 + B * chin;
  pen.save();
  if (MU_BEND) { pen.translate(0, Y0); pen.rotate(MU_BEND); pen.translate(0, -Y0); }   // on the bent upper body (muUpper)
  pen.translate(8 + neckX, chin + NECK_DROP[lady ? 0 : 1]);
  pen.rotate(lady ? -0.05 : -0.02);
  muHead(look, lady, skin);
  pen.restore();
  pen.restore();
}

// A plaster wall, as the mural is painted on: a warm ground, mottled, a few hairline cracks.
function muWall(x, y, w, h) {
  pen.save();
  pen.beginPath(); pen.rect(x, y, w, h); pen.clip();
  pen.fillStyle = "#cdb08a"; pen.fillRect(x, y, w, h);
  pen.globalCompositeOperation = "multiply"; pen.globalAlpha = 0.55;
  pen.fillStyle = muPattern(1.4); pen.fillRect(x, y, w, h);
  pen.globalCompositeOperation = "source-over"; pen.globalAlpha = 1;
  pen.strokeStyle = "rgba(90, 60, 40, 0.25)"; pen.lineWidth = 0.8;
  for (var k = 0; k < 9; k++) {
    var cx = x + dice(k * 13 + 1) * w, cy = y + dice(k * 13 + 2) * h;
    pen.beginPath(); pen.moveTo(cx, cy);
    for (var s = 0; s < 6; s++) { cx += (dice(k * 13 + s * 3 + 4) - 0.5) * 50; cy += (dice(k * 13 + s * 3 + 5) - 0.3) * 40; pen.lineTo(cx, cy); }
    pen.stroke();
  }
  pen.restore();
}

// ========== its jewellery and makeup (until 2026-11-01, mural_luxe.js) ==========
// Gold, silver, jewels and silk for the mural figure (2026-10-29; in the kit 2026-10-30). The owner, with four more
// references (a Royal Thai Art thewada in a gold frame, the dancer, women in silk sabai and gold): "Look how rich these
// images are in terms of the detail. Keep going farther in making them detailed and really luxurious and beautiful."
// Over mural.js: every piece here is drawn in that file's units (a head is 100) and with its line and grain.
// The jewellery matches the outfit (owner, 2026-10-30: "There should be a jewelry function that similarly matches
// jewelry for the outfit"; of the ways offered, "metal and stones"): muJewels() picks the metal and two stones from
// what a person wears, muDress() puts them on, and every piece of jewellery here (muGold, muBead, muJewel) is drawn in
// them. The gold thread woven into cloth (brocade, tassels, the foot of a sin) stays gold: it is the cloth's.

// ---------- the metal and the stones ----------
// The metals: the five steps of a piece's light from the lit side to the turned-away side and back (the fourth the
// deep one), a bead's three, the fine line round a piece, the ticks between a belt's plates, and one flat colour.
var MU_METALS = {
  gold:   {light: ["#fbe8a6", "#e4b54c", "#b98226", "#9a6418", "#d9a640", "#f2d27a"], bead: ["#fff4c8", "#e2b04a", "#8a5a16"],
           line: "#5a3410", tick: "#6a4012", base: "#d4a63a"},
  silver: {light: ["#ffffff", "#d8dade", "#9ea2aa", "#80848c", "#c6c9ce", "#eef0f2"], bead: ["#ffffff", "#c8cbd0", "#6c7078"],
           line: "#3a3e46", tick: "#4a4e56", base: "#c6c9ce"}
};
// The stones: a stone for each colour of cloth (its hue, the colour it is).
var MU_GEMS = {ruby: "#b0202a", garnet: "#7a1a3a", carnelian: "#c0461e", amber: "#d08a1a", emerald: "#1f6a4a", jade: "#4a8a5a",
               turquoise: "#2aa39a", sapphire: "#2a4a9a", amethyst: "#6a3a8a", tourmaline: "#c8487a"};
var MU_METAL = MU_METALS.gold, MU_STONE = [MU_GEMS.ruby, MU_GEMS.emerald];    // what is being worn, while a person is drawn
// The jewellery that goes with what a person wears:
//   metal   gold with finery: a dancer's, a celestial's, regalia, or clothes with gold in them (a gold border, a gold
//           sin); silver, the north's own silverwork, with everyday clothes, plain or dark or indigo
//   stones  the first stone the stone nearest the colour of her clothes (the first strong colour, nearest the face
//           first: muClothes); the second its partner: turquoise with coral, brick and orange, emerald with the other
//           reds and pinks, ruby with blue, indigo, green and purple; ruby and emerald with clothes of no colour
// look.jewels ("gold" or "silver") and look.stones (two CSS colours) choose instead.
// look: the person's look. Returns {metal: "gold" or "silver", stones: [colour, colour]}.
// e.g. muJewels(cast("sinuan"))   // {metal: "silver", stones: [carnelian, turquoise]}
function muJewels(look) {
  var clothes = typeof muClothes === "function" ? muClothes(look) : [], hues = clothes.map(muHue);
  var golden = hues.some(function (h) { return h && h[0] >= 35 && h[0] <= 60 && h[1] >= 0.4 && h[2] >= 0.35 && h[2] <= 0.8; });
  var metal = look.jewels || (look.dance || look.halo || look.regalia || golden ? "gold" : "silver");
  if (look.stones) { return {metal: metal, stones: look.stones}; }
  var main = null;
  for (var i = 0; i < hues.length && !main; i++) {
    var h = hues[i];
    if (h && h[1] >= 0.25 && h[2] >= 0.2 && h[2] <= 0.85 && !(h[0] >= 35 && h[0] <= 60)) { main = h; }
  }
  if (!main) { return {metal: metal, stones: [MU_GEMS.ruby, MU_GEMS.emerald]}; }
  var best = null, gap = 999;
  for (var name in MU_GEMS) {                        // the stone nearest her colour, round the colour wheel
    var g = muHue(MU_GEMS[name]), d = Math.abs(g[0] - main[0]);
    d = Math.min(d, 360 - d) + 40 * Math.abs(g[2] - main[2]);
    if (d < gap) { gap = d; best = name; }
  }
  var warm = main[0] < 60 || main[0] >= 290;
  var partner = !warm ? "ruby" : main[0] >= 10 && main[0] < 35 ? "turquoise" : "emerald";
  if (partner === best) { partner = warm ? "turquoise" : "amber"; }
  return {metal: metal, stones: [MU_GEMS[best], MU_GEMS[partner]]};
}
// Put on a person's jewellery (muJewels) before she is drawn: muralPerson() does; a page drawing a head alone
// (muHead) does it first. look: the person's look. Returns what muJewels gave. e.g. muDress(cast("buakham"))
function muDress(look) {
  var j = muJewels(look);
  MU_METAL = MU_METALS[j.metal] || MU_METALS.gold;
  MU_STONE = j.stones;
  return j;
}
// draw() with gold for the metal, whatever the person wears: the gold thread of a cloth
function muInGold(draw) {
  var was = MU_METAL;
  MU_METAL = MU_METALS.gold;
  try { draw(); } finally { MU_METAL = was; }
}

// ---------- the metal ----------
// Metal reads as metal by its light: pale where it faces the light, deep (amber in gold) where it turns away, a fine
// dark line. In the metal being worn (MU_METAL).
function muGold(rec, deep) {
  var xs = [], ys = [];
  rec.subs.forEach(function (s) { s.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  var g = pen.createLinearGradient(x0, y0, x1 + (y1 - y0) * 0.3, y1);
  var L = MU_METAL.light;
  g.addColorStop(0, L[0]); g.addColorStop(0.3, L[1]); g.addColorStop(0.62, deep ? L[3] : L[2]); g.addColorStop(0.85, L[4]); g.addColorStop(1, L[5]);
  pen.fillStyle = g;
  pen.fill(rec.path);
  if ((x1 - x0) * (y1 - y0) > 900) {                // the grain only on a large piece of gold
    pen.save(); pen.clip(rec.path);
    pen.globalCompositeOperation = "multiply"; pen.globalAlpha = 0.35;
    pen.fillStyle = muPattern(0.3); pen.fillRect(x0 - 5, y0 - 5, x1 - x0 + 10, y1 - y0 + 10);
    pen.restore();
  }
  mBrush(rec, MU_METAL.line, 0.75);
}
// a bead of the metal: its light a point near the top
function muBead(x, y, r) {
  var g = pen.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, MU_METAL.bead[0]); g.addColorStop(0.35, MU_METAL.bead[1]); g.addColorStop(1, MU_METAL.bead[2]);
  pen.fillStyle = g;
  pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill();
}
// a jewel: a deep colour with a spark
function muJewel(x, y, r, colour) {
  muGold(new MPath().E(x, y, r * 1.45, r * 1.45));
  var g = pen.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, blend(colour, "#ffffff", 0.6)); g.addColorStop(0.5, colour); g.addColorStop(1, blend(colour, "#000000", 0.5));
  pen.fillStyle = g; pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill();
  pen.fillStyle = "rgba(255, 255, 255, 0.85)"; pen.beginPath(); pen.arc(x - r * 0.35, y - r * 0.35, r * 0.22, 0, 7); pen.fill();
}
// beads along a curve: at(t) for t 0 to 1, every "step" units
function muBeads(at, step, r) {
  var len = 0, prev = at(0), N = 80, k, marks = [];
  for (k = 1; k <= N; k++) { var p = at(k / N); len += Math.hypot(p[0] - prev[0], p[1] - prev[1]); marks.push([len, p]); prev = p; }
  for (var d = 0, i = 0; d <= len; d += step) { while (i < marks.length - 1 && marks[i][0] < d) { i++; } muBead(marks[i][1][0], marks[i][1][1], r); }
}
function muCurve(a, c1, c2, b) {
  return function (t) { var u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]]; };
}
// the flame of a kranok: a point that rises from a base and curls over at its tip; way 1 curls right, -1 left
function muFlame(x, y, h, w, way, turn) {
  pen.save(); pen.translate(x, y); pen.rotate(turn || 0); pen.scale(way || 1, 1);
  var f = new MPath().M(-w, 0).C(-w * 0.9, -h * 0.45, -w * 0.2, -h * 0.75, w * 0.35, -h).C(w * 0.1, -h * 0.75, w * 0.55, -h * 0.55, w * 0.4, -h * 0.4).C(w * 0.9, -h * 0.3, w, -h * 0.1, w, 0).Z();
  muGold(f);
  pen.restore();
}
// a small gold flower: petals round a jewel
function muGoldFlower(x, y, r, jewel) {
  for (var k = 0; k < 6; k++) {
    var a = k / 6 * Math.PI * 2;
    muGold(new MPath().E(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5, r * 0.3, a));
  }
  muJewel(x, y, r * 0.3, jewel || MU_STONE[0]);
}

// ---------- jewellery ----------
// The bun dressed: a ring of gold flowers round its front, a pin, and strands of gold beads hanging from it, swaying.
function muBunGold(x, y, r, swayAt) {
  for (var k = 0; k < 7; k++) {
    var a = -Math.PI * 0.95 + k / 6 * Math.PI * 0.95;
    muGoldFlower(x + Math.cos(a) * r * 1.05, y + Math.sin(a) * r * 0.95, 5.2, MU_STONE[k % 2 ? 0 : 1]);
  }
  [-1, 0, 1].forEach(function (s, i) {
    var sway = Math.sin(clock * 1.6 + i) * 3 + (swayAt || 0), long = 52 + i * 14, top = [x - r * 0.4 + s * 5, y + r * 0.7];
    var at = muCurve(top, [top[0] - 4, top[1] + long * 0.3], [top[0] - 8 + sway, top[1] + long * 0.7], [top[0] - 6 + sway * 1.6, top[1] + long]);
    muBeads(at, 3.6, 1.6);
    var end = at(1);
    muGold(new MPath().M(end[0] - 3, end[1] + 1).Q(end[0], end[1] + 12, end[0] + 3, end[1] + 1).Q(end[0], end[1] - 2, end[0] - 3, end[1] + 1).Z());   // a gold leaf at the end
  });
}
// a drop earring: the stud, three beads, a jewelled drop with a kranok point under it
function muEarring(x, y) {
  muJewel(x, y, 2.6, MU_STONE[0]);
  var sway = Math.sin(clock * 2.1) * 1.2;
  muBead(x + sway * 0.3, y + 6, 1.5); muBead(x + sway * 0.6, y + 9.5, 1.5);
  var dx = x + sway, dy = y + 13;
  muGold(new MPath().M(dx, dy).C(dx + 6, dy + 4, dx + 5, dy + 12, dx, dy + 17).C(dx - 5, dy + 12, dx - 6, dy + 4, dx, dy).Z());
  muJewel(dx, dy + 8, 2, MU_STONE[1]);
}
// a collar of gold in tiers, round the base of the neck, with points hanging from it and a pendant
function muCollar(cx, cy, half, drop) {
  var outer = new MPath().M(cx - half, cy).C(cx - half * 0.6, cy + drop, cx + half * 0.6, cy + drop, cx + half, cy)
    .L(cx + half - 3, cy - 4).C(cx + half * 0.55, cy + drop - 7, cx - half * 0.55, cy + drop - 7, cx - half + 3, cy - 4).Z();
  var edge = muCurve([cx - half, cy], [cx - half * 0.6, cy + drop], [cx + half * 0.6, cy + drop], [cx + half, cy]);
  for (var k = 1; k < 12; k++) {                     // the points, hanging from the lower edge
    var p = edge(k / 12), q = edge(k / 12 + 0.01), a = Math.atan2(q[1] - p[1], q[0] - p[0]);
    muFlame(p[0], p[1], 6 + (k % 2) * 2, 2.2, 1, a + Math.PI / 2 + Math.PI);
  }
  muGold(outer);
  muBeads(muCurve([cx - half + 2, cy - 2], [cx - half * 0.6, cy + drop - 4], [cx + half * 0.6, cy + drop - 4], [cx + half - 2, cy - 2]), 3.2, 1.1);
  var m = edge(0.5);
  muGold(new MPath().M(m[0], m[1] - 2).C(m[0] + 7, m[1] + 4, m[0] + 5, m[1] + 13, m[0], m[1] + 18).C(m[0] - 5, m[1] + 13, m[0] - 7, m[1] + 4, m[0], m[1] - 2).Z());
  muJewel(m[0], m[1] + 7, 2.8, MU_STONE[0]);
}
// an armlet round the upper arm: a band of gold with a flame rising from it; at(t) the arm's middle line, wide its
// half-width there
function muArmlet(at, t, wide) {
  var p = at(t), q = at(t + 0.01), a = Math.atan2(q[1] - p[1], q[0] - p[0]);
  pen.save(); pen.translate(p[0], p[1]); pen.rotate(a - Math.PI / 2);
  muFlame(0, -2, 13, 4.5, 1, Math.PI);
  muGold(new MPath().M(-wide - 1, -3).Q(0, 1, wide + 1, -3).L(wide + 1, 3).Q(0, 7, -wide - 1, 3).Z());
  muJewel(0, 2, 2, MU_STONE[1]);
  pen.restore();
}
// the belt: a band of gold plates round the waist and its buckle, a jewelled lozenge edged with flames
function muBelt(y, x0, x1, buckleX) {
  var band = new MPath().M(x0, y - 5).Q((x0 + x1) / 2, y + 2, x1, y - 5).L(x1, y + 5).Q((x0 + x1) / 2, y + 12, x0, y + 5).Z();
  muGold(band);
  var ticks = new MPath();
  for (var x = x0 + 6; x < x1; x += 7) { var yy = y + 3.5 * (1 - Math.pow((x - (x0 + x1) / 2) / ((x1 - x0) / 2), 2)); ticks.M(x, yy - 4).L(x, yy + 4); }
  mLine(ticks, MU_METAL.tick, 0.7);
  var by = y + 3;
  [[-1, 0], [1, 0]].forEach(function (s) { muFlame(buckleX + s[0] * 13, by, 8, 3, s[0], s[0] * Math.PI / 2); });
  muGold(new MPath().M(buckleX - 13, by).Q(buckleX - 6, by - 11, buckleX, by - 12).Q(buckleX + 6, by - 11, buckleX + 13, by).Q(buckleX + 6, by + 11, buckleX, by + 12).Q(buckleX - 6, by + 11, buckleX - 13, by).Z(), true);
  muJewel(buckleX, by, 4.2, MU_STONE[0]);
  [-7, 7].forEach(function (dx) { muJewel(buckleX + dx, by, 1.6, MU_STONE[1]); });
}
// bangles: gold rings at the wrist, each with its light
function muBangles(at, from, n, wide) {
  for (var k = 0; k < n; k++) {
    var b = at(from - k * 0.022), c = at(from - k * 0.022 + 0.01), ang = Math.atan2(c[1] - b[1], c[0] - b[0]);
    muGold(new MPath().E(b[0], b[1], 2, wide + 2.4, ang));
  }
}

// ---------- silk ----------
// Silk's sheen: soft long lights where the cloth turns to the light, and the fine pleats of a draped cloth, inside a
// shape. lines: [[x0, y0, x1, y1] ...] the pleats; lights: the same, for the sheen.
function muSilk(rec, colour, pleats, lights) {
  pen.save(); pen.clip(rec.path);
  lights.forEach(function (l) {
    pen.strokeStyle = blend(muColour(colour), "#fff6e6", 0.55);
    pen.lineCap = "round";
    [[14, 0.08], [8, 0.1], [3, 0.14]].forEach(function (b) {
      pen.globalAlpha = b[1]; pen.lineWidth = b[0];
      pen.beginPath(); pen.moveTo(l[0], l[1]); pen.quadraticCurveTo((l[0] + l[2]) / 2 + 4, (l[1] + l[3]) / 2, l[2], l[3]); pen.stroke();
    });
  });
  pen.globalAlpha = 1;
  var p = new MPath();
  pleats.forEach(function (l) { p.M(l[0], l[1]).Q((l[0] + l[2]) / 2 + 3, (l[1] + l[3]) / 2, l[2], l[3]); });
  mLine(p, muShade(muColour(colour)), 0.8);
  pen.restore();
}
// a brocade border along a curve: a band of gold thread with small lozenges in the cloth's colour
function muBrocade(at, wide, colour) { muInGold(function () { muBrocadeGold(at, wide, colour); }); }
function muBrocadeGold(at, wide, colour) {
  var N = 60, left = [], right = [];
  for (var k = 0; k <= N; k++) {
    var p = at(k / N), q = at(Math.min(1, k / N + 0.01)), r = at(Math.max(0, k / N - 0.01)), tx = q[0] - r[0], ty = q[1] - r[1], l = Math.hypot(tx, ty) || 1;
    left.push([p[0] - ty / l * wide, p[1] + tx / l * wide]); right.push([p[0] + ty / l * wide, p[1] - tx / l * wide]);
  }
  muGold(new MPath().poly(left.concat(right.reverse()), true));
  for (k = 2; k < N; k += 3) {
    var c = at(k / N), d = at(k / N + 0.01), a = Math.atan2(d[1] - c[1], d[0] - c[0]);
    pen.save(); pen.translate(c[0], c[1]); pen.rotate(a);
    pen.fillStyle = muColour(colour);
    pen.beginPath(); pen.moveTo(-2.4, 0); pen.lineTo(0, -wide * 0.6); pen.lineTo(2.4, 0); pen.lineTo(0, wide * 0.6); pen.closePath(); pen.fill();
    pen.restore();
  }
}
// gold tassels hanging from an edge, every "step" along at(t)
function muTassels(at, step, long) { muInGold(function () { muTasselsGold(at, step, long); }); }
function muTasselsGold(at, step, long) {
  for (var t = 0.05; t <= 0.96; t += step) {
    var p = at(t), sway = Math.sin(clock * 1.4 + t * 9) * 1.5;
    muBeads(function (u) { return [p[0] + sway * u, p[1] + long * u]; }, 3, 1.1);
    muGold(new MPath().M(p[0] + sway - 2, p[1] + long).L(p[0] + sway + 2, p[1] + long).L(p[0] + sway + 1, p[1] + long + 7).L(p[0] + sway - 1, p[1] + long + 7).Z());
  }
}
// The tin jok, the woven foot of a sin: a broad band of gold thread holding rows of lozenges and hooks in red, green
// and the cloth's dark, between borders of small teeth.
function muTinJok(y0, y1, x0, x1, ground) { muInGold(function () { muTinJokGold(y0, y1, x0, x1, ground); }); }
function muTinJokGold(y0, y1, x0, x1, ground) {
  var h = y1 - y0;
  var band = new MPath().M(x0, y0).L(x1, y0).L(x1, y1).L(x0, y1).Z();
  muGold(band);
  pen.save(); pen.clip(band.path);
  var teeth = new Path2D();
  for (var x = x0; x < x1; x += 5) { teeth.moveTo(x, y0 + 4); teeth.lineTo(x + 2.5, y0 + 9); teeth.lineTo(x + 5, y0 + 4); teeth.moveTo(x, y1 - 4); teeth.lineTo(x + 2.5, y1 - 9); teeth.lineTo(x + 5, y1 - 4); }
  pen.strokeStyle = muColour(ground); pen.lineWidth = 1.4; pen.stroke(teeth);
  var mid = (y0 + y1) / 2, s = (h - 22) / 2, k = 0;
  for (x = x0 - s; x < x1 + s; x += s * 2, k++) {
    var loz = new Path2D();
    loz.moveTo(x - s, mid); loz.lineTo(x, mid - s); loz.lineTo(x + s, mid); loz.lineTo(x, mid + s); loz.closePath();
    pen.fillStyle = muColour(k % 2 ? "#8a1e26" : "#1f5a40"); pen.fill(loz);
    pen.strokeStyle = "#4a2a0c"; pen.lineWidth = 0.8; pen.stroke(loz);
    var inner = new Path2D();
    inner.moveTo(x - s * 0.5, mid); inner.lineTo(x, mid - s * 0.5); inner.lineTo(x + s * 0.5, mid); inner.lineTo(x, mid + s * 0.5); inner.closePath();
    pen.fillStyle = "#e9c25a"; pen.fill(inner);
    pen.fillStyle = muColour(ground); pen.beginPath(); pen.arc(x, mid, s * 0.16, 0, 7); pen.fill();
    var hooks = new Path2D();                       // the hooks between the lozenges, curling up and down
    hooks.moveTo(x + s, mid); hooks.quadraticCurveTo(x + s * 1.3, mid - s * 0.9, x + s * 1.05, mid - s * 0.7);
    hooks.moveTo(x + s, mid); hooks.quadraticCurveTo(x + s * 1.3, mid + s * 0.9, x + s * 1.05, mid + s * 0.7);
    pen.strokeStyle = muColour(ground); pen.lineWidth = 1.6; pen.stroke(hooks);
  }
  pen.restore();
}
// the woven figure over the body of a sin: a lattice of small diamonds in a paler and a deeper tone of its colour
function muSinFigure(rec, colour, y0, y1, x0, x1) {
  pen.save(); pen.clip(rec.path);
  var pale = muColour(blend(colour, "#f3e2b0", 0.35)), deep = muColour(blend(colour, "#120a08", 0.35)), row = 0;
  for (var y = y0; y < y1; y += 9, row++) {
    for (var x = x0 + (row % 2) * 5; x < x1; x += 10) {
      pen.fillStyle = row % 3 ? deep : pale;
      pen.beginPath(); pen.moveTo(x, y - 2.6); pen.lineTo(x + 2.6, y); pen.lineTo(x, y + 2.6); pen.lineTo(x - 2.6, y); pen.closePath(); pen.fill();
    }
  }
  pen.restore();
}

// ========== as a thangka paints (until 2026-11-01, mural_thangka.js) ==========
// The thangka's way of painting, over mural.js and mural_luxe.js (2026-10-29; in the kit 2026-10-30). The owner: "Look at the thangka
// paintings though and really get the style." What the thangka painters do, and how each is drawn here:
//   the ground        cotton sized smooth, not plaster: almost no grain; mineral colours at full strength
//   skin              shaded by fine graded steps from the edge inward, warm red in the shadow; a fine red-brown line
//   silk              covered in gold line work (small flowers and cloud scrolls), shaded in bands along each fold
//   scarves           long scarves of two colours, their lining shown where they twist, looping over the arms and
//                     falling to the ground in curls
//   jewels            gold set with turquoise, coral and ruby: a short collar and a long chain to the waist, swags of
//                     jewel strings across the hips, armlets, bangles, anklets, earrings
//   hair              blue-black, its strands blue
// TH_GROUND, TH_SHADE: the grain's strength and the shading's; muFill reads them.

MU.mute = 0.06;
MU.ink = "#5a2416";
MU.hair = "#141827";
MU.sheen = "#6a80b0";
var TH_GROUND = 0.22;

// A thangka's ground behind a figure: a sky of azurite, deep at the top and paling to the horizon, over green hills,
// with the cloth's faint grain.
function thGround(x, y, w, h) {
  pen.save();
  pen.beginPath(); pen.rect(x, y, w, h); pen.clip();
  var sky = pen.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, "#1c3266"); sky.addColorStop(0.55, "#5f8fb8"); sky.addColorStop(0.75, "#cfe0d6"); sky.addColorStop(0.78, "#7fa86a"); sky.addColorStop(1, "#3f6a3c");
  pen.fillStyle = sky; pen.fillRect(x, y, w, h);
  pen.globalCompositeOperation = "multiply"; pen.globalAlpha = 0.25;
  pen.fillStyle = muPattern(1.2); pen.fillRect(x, y, w, h);
  pen.restore();
}

// Paint, as the thangka paints it: the colour, a breath of the cloth's grain, and the shadow in fine graded steps
// from the edge inward, warm in skin and deep in cloth.
mFill = function (rec, colour, round) {
  var c = muColour(colour);
  pen.fillStyle = c;
  pen.fill(rec.path);
  pen.save();
  pen.clip(rec.path);
  var box = muBox(rec);                             // the grain only over the shape's own box, and none on a small piece
  if ((box[2] - box[0]) * (box[3] - box[1]) > 900) {
    pen.globalCompositeOperation = "multiply";
    pen.globalAlpha = TH_GROUND;
    pen.fillStyle = muPattern(0.5);
    pen.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
    pen.globalCompositeOperation = "source-over";
  }
  if (round !== 0) {
    var w = round || 10, warm = muIsSkin(c);
    var dark = warm ? blend(c, "#a2483a", 0.55) : blend(c, "#140a06", 0.55);
    pen.translate(w * 0.22, w * 0.3);
    pen.strokeStyle = dark;
    pen.lineJoin = "round";
    for (var k = 4; k >= 1; k--) {                  // fine steps, the outer ones faint: a smooth fall of shade to the edge
      pen.globalAlpha = 0.075;
      pen.lineWidth = w * 0.8 * k;
      pen.stroke(rec.path);
    }
  }
  pen.restore();
};
var TH_SKINS = {};
// the box round a path's points: [x0, y0, x1, y1]
function muBox(rec) {
  var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  rec.subs.forEach(function (s) { s.pts.forEach(function (p) { if (p[0] < x0) { x0 = p[0]; } if (p[0] > x1) { x1 = p[0]; } if (p[1] < y0) { y0 = p[1]; } if (p[1] > y1) { y1 = p[1]; } }); });
  return [x0, y0, x1, y1];
}
function muIsSkin(c) { return !!TH_SKINS[c]; }

// ---------- gold line work on silk ----------
// Small flowers and cloud scrolls in gold, scattered over a cloth in a staggered lattice; step: units apart.
function thGoldWork(rec, step, kind) {
  var xs = [], ys = [];
  rec.subs.forEach(function (s) { s.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  pen.save(); pen.clip(rec.path);
  var lines = new MPath(), dots = [], row = 0;
  for (var y = y0 + step / 2; y < y1; y += step * 0.86, row++) {
    for (var x = x0 + (row % 2) * step / 2; x < x1 + step; x += step) {
      var r = step * 0.18;
      if ((row + Math.round(x / step)) % 3 === 0 && kind !== "flowers") {        // a cloud scroll: two curls joined
        lines.M(x - r * 2, y + r * 0.4).C(x - r * 2.2, y - r * 1.4, x - r * 0.4, y - r * 1.4, x - r * 0.5, y - r * 0.2)
             .C(x - r * 0.6, y + r * 0.6, x - r * 1.3, y + r * 0.4, x - r * 1.2, y - r * 0.3);
        lines.M(x - r * 0.5, y - r * 0.2).C(x + r * 0.2, y - r * 1.8, x + r * 2.2, y - r * 1.2, x + r * 1.8, y + r * 0.2)
             .C(x + r * 1.5, y + r * 0.9, x + r * 0.7, y + r * 0.6, x + r, y);
      } else {                                      // a small flower: four petals and a dot
        for (var p = 0; p < 4; p++) {
          var a = p * Math.PI / 2 + 0.4, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
          lines.M(x, y).Q(px + Math.cos(a + 1.2) * r * 0.8, py + Math.sin(a + 1.2) * r * 0.8, px + Math.cos(a) * r * 0.5, py + Math.sin(a) * r * 0.5)
               .Q(px + Math.cos(a - 1.2) * r * 0.8, py + Math.sin(a - 1.2) * r * 0.8, x, y);
        }
        dots.push([x, y]);
      }
    }
  }
  mLine(lines, "#d9aa3e", 0.6);
  dots.forEach(function (d) { muBead(d[0], d[1], 0.8); });
  pen.restore();
}
// Shade a cloth in bands along its folds: each fold a line from a to b, darkest on it and fading either side, and a
// paler ridge beside it, as the thangka shades silk.
function thFolds(rec, colour, folds) {
  pen.save(); pen.clip(rec.path);
  pen.lineCap = "round";
  folds.forEach(function (f) {
    var mx = (f[0] + f[2]) / 2 + (f[4] || 0), my = (f[1] + f[3]) / 2;
    [[16, 0.07], [10, 0.08], [5, 0.1], [2, 0.14]].forEach(function (b) {
      pen.strokeStyle = blend(muColour(colour), "#140a06", 0.6); pen.globalAlpha = b[1]; pen.lineWidth = b[0];
      pen.beginPath(); pen.moveTo(f[0], f[1]); pen.quadraticCurveTo(mx, my, f[2], f[3]); pen.stroke();
      pen.strokeStyle = blend(muColour(colour), "#fff4dc", 0.5); pen.globalAlpha = b[1] * 0.8; pen.lineWidth = b[0] * 0.8;
      pen.beginPath(); pen.moveTo(f[0] + 9, f[1]); pen.quadraticCurveTo(mx + 9, my, f[2] + 9, f[3]); pen.stroke();
    });
  });
  pen.restore();
}

// ---------- the scarf ----------
// A long scarf of two colours along a curve: it twists as it goes ("turns" half-turns), and where its face turns away
// the lining shows; the two faces meet at a point in each twist. at(t) its middle line, wide its half-width.
function thScarf(at, wide, outside, lining, turns, phase) {
  var N = 90, pts = [];
  for (var n = 0; n <= N; n++) {
    var t = n / N, p = at(t), q = at(Math.min(1, t + 0.01)), r = at(Math.max(0, t - 0.01));
    var tx = q[0] - r[0], ty = q[1] - r[1], l = Math.hypot(tx, ty) || 1;
    var h = wide * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.4))) * Math.cos(Math.PI * turns * t + (phase || 0));
    pts.push([p, [-ty / l, tx / l], h]);
  }
  var run = [], face = pts[0][2] >= 0;
  function flush() {
    if (run.length < 2) { return; }
    var left = run.map(function (e) { return [e[0][0] + e[1][0] * e[2], e[0][1] + e[1][1] * e[2]]; });
    var right = run.map(function (e) { return [e[0][0] - e[1][0] * e[2], e[0][1] - e[1][1] * e[2]]; });
    var rec = new MPath().poly(left.concat(right.reverse()), true), colour = face ? outside : lining;
    mFill(rec, colour, 5);
    if (face) { thGoldWork(rec, 16, "flowers"); }
    mBrush(rec, muInk(muColour(colour)), 1.1);
  }
  pts.forEach(function (e) {
    var now = e[2] >= 0;
    if (now !== face && run.length) { var last = run[run.length - 1]; run.push([last[0], last[1], 0]); flush(); run = [[last[0], last[1], 0]]; face = now; }
    run.push(e);
  });
  flush();
}

// ---------- jewels ----------
// A long chain from both sides of the neck down to a pendant at the breast, and on to the waist. out (optional): how
// far each strand first runs out along the shoulder before it falls, [left, right] (a bare neck: it rests on its foot).
function thLongChain(l, r, low, out) {
  var o = out || [2, 2], fall = out ? 8 : 40;
  muBeads(muCurve(l, [l[0] - o[0], l[1] + fall], [low[0] - 10, low[1] - 30], low), 3.4, 1.3);
  muBeads(muCurve(r, [r[0] + o[1], r[1] + fall], [low[0] + 10, low[1] - 30], low), 3.4, 1.3);
  muGold(new MPath().M(low[0], low[1] - 2).C(low[0] + 8, low[1] + 4, low[0] + 6, low[1] + 14, low[0], low[1] + 20).C(low[0] - 6, low[1] + 14, low[0] - 8, low[1] + 4, low[0], low[1] - 2).Z());
  muJewel(low[0], low[1] + 8, 3.4, MU_STONE[1]);
  muBeads(muCurve([low[0], low[1] + 20], [low[0] + 1, low[1] + 30], [low[0], low[1] + 40], [low[0] + 1, low[1] + 48]), 3.4, 1.2);
  muJewel(low[0] + 1, low[1] + 52, 2.2, MU_STONE[0]);
}
// Swags of jewel strings across the hips from the belt, each with a drop at its lowest point.
function thSwags(y, x0, x1, n, sag) {
  for (var k = 0; k < n; k++) {
    var a = x0 + (x1 - x0) * k / n, b = x0 + (x1 - x0) * (k + 1) / n, s = sag * (0.8 + 0.4 * (k % 2));
    muBeads(muCurve([a, y], [a + (b - a) * 0.2, y + s], [a + (b - a) * 0.8, y + s], [b, y]), 3, 1.1);
    var m = [(a + b) / 2, y + s * 0.75];
    muBeads(function (u) { return [m[0], m[1] + 10 * u]; }, 3, 1);
    muJewel(m[0], m[1] + 13, 1.8, MU_STONE[k % 2 ? 1 : 0]);
  }
}
// gold rings and beads round an ankle
function thAnklet(x, y) {
  muBeads(muCurve([x - 10, y], [x - 6, y + 5], [x + 6, y + 5], [x + 10, y]), 2.6, 1.3);
  muGold(new MPath().E(x, y - 2, 10, 2.4));
}

// ========== the women (until 2026-11-01, mural_women.js) ==========
// mural_women.js - the mural figure's women, each her own (2026-10-30), over the figure above. The owner gave five Royal Thai Art paintings of women: "Use each of those as a
// reference for a sprite in the kit but localize it for the project"; then "now on to the unique faces", "give the gems
// some transparency and sparkle", "make the gold flash in the light as the models move", "Add more faces and hair
// styles" (the old kit's Lanna ways with the hair, converted), "Give them poses and outfits and new foot bands", and
// "All good. Keep them all." Localized by the Lanna royal dress notebook: Lanna women wore no tall crowns and no
// upper-arm bands (central Thai); they dressed their own knot with fresh jasmine, gardenia and dok ueang orchids, gold
// sprays on springs that quiver (dok mai wai) and spiral pins (yong); dok hu drop earrings, many bangles (kamlai),
// pearls, the cross-body chains of rank (sai sangwan), a link belt and its buckle (pan neng); long brass nails to
// dance. The celestial keeps a crown: she is of the murals' heaven, not of the court.
//
// A woman is drawn so when her look has "woman" (MURAL_LOOK_KEYS): the name of one of MURAL_WOMEN, or her own settings
// as below. castWoman(name, more) gives the look of one of MURAL_WOMEN, as cast() gives the cast's. Everything here
// acts only while such a woman is drawn: a person without "woman" is drawn by mural.js as before, pixel for pixel.
// e.g. person(700, GROUND, castWoman("dancer", {size: 1.5}));
// Her settings (look.woman as an object; WOMAN_KEYS):
//   face     her own face (WM_FACE_KEYS, "her own face" below): its outline, brows, eyes, mouth, resting look, and the
//            way she wears her hair (hairdo: the old kit's high, wong, low, ipun, and lue; tail)
//   pose     {far: arm, near: arm}; an arm {w: [x, y] the wrist, elbow: [x, y] the way the elbow goes, wrist: radians
//            the hand turns from the forearm, fingers: their curl (below 0 bent back), late: true to draw it over the sabai}
//   hair     what is set in her knot, a list of WM_HAIR names: "fan", "maiwai", "ueang", "jasmine", "gardenia", "yong",
//            "pins", "loop", "flower"
//   crown    true: a celestial's crown
//   earring  "dokhu", "pearl" or "tube"; neck: "pendant", "pearls", "sangwan"; belt: "panneng", "chains"
//   nails    true: gold nails; armlet: true to keep the armlets; chain: false to leave off the long chain
//   hands    "normal": an ordinary hand (wmHandNormal), not the mural's dancer's
//   sway     false: she stands still, not swaying about her feet (the woven sabai of sabai_finish.js lies on her so); her
//            gold still catches the light in time with the sway she would have
//   alive    true, or 0 to 1: she is never quite still: in her own time her head drifts and tips a very little about
//            her chin, and she blinks now and then (owner, 2026-10-31: "animate the face and body so it looks like she
//            is moving ever so slightly"); a breath of the whole body is the scene's to give, with what she wears
//   front    0 to 1: how far her face has turned from the mural's three-quarter to straight on, looking at whoever
//            watches; her body stays as it is (owner, 2026-10-31: "have her turn to face the camera straight on before
//            she winks"); change it over the frames for the turn
//   swish    true, or 0 to 1: her sin sways ever so gently about her waist, in her own time, her feet still (owner,
//            2026-10-31: "Can you have her dress sway ever so gently?")
//   wink     0 to 1: how far her near eye is shut, the other open (1: shut as a laughing eye is, bowed); change it over
//            the frames for a wink (owner, 2026-10-31: "she smiles and winks before giving a wai"; her smile is the
//            look's own smile, 0 to 1, as for any of the kit's faces)
//   blouse   its finish: "flowers" (mural_thangka.js's), "clouds", "plain", "lue" (the Tai Lue jacket), ["dots", colour],
//            ["lace", colour]
//   scarf    [outside, lining, curve, width]: a long cloth from the far hand to the near hand and on (curve(farW, nearW)
//            gives [[a, c1, c2, b, width, turn], ...] cubic pieces)
//   holds    in the near hand: "lotus", "garland", "khan" (a bowl of flowers), "fan", "lantern", "parasol" (parasol:
//            [paper, flowers]); between both: "cloth" (cloth: a SABAI_WEAVES name); on her shoulder: "pots", a carrying
//            pole with a water pot at each end (with hands: "normal" and pose: {near: WM_POTS.hand})
//   jok      [town, palette, taller]: her sin's foot a woven teen jok (weaving.js teenJok: "maechaem", "nan" or "long";
//            one of WEAVE_PALETTES), "taller" times the sin's own foot band; or her whole sin woven, with sin
//            WM_SIN.chevron, .teal or .namLai: ["chevron", "chevron", 1], ["teal", "teal", 1], ["namLai", "lueLac", 1]
// Her woven sabai is painted once and laid along the band (not thread by thread); she sways slowly about her feet,
// and her gold and her stones catch the light as she does. Standing, she walks with the kit's own look.step (a stride a 1, as
// person() takes it): her feet step under her sin, its foot swinging with them, her arms swinging the other way (owner,
// 2026-10-31: "animate the main icon of the woman so it looks like she is walking like the other icons").

var WM = null, WM_W = {};                           // the woman being drawn, and where her wrists went
var WM_A = -0.028, WM_B = 0.07, WM_Y0 = -430, WM_CHIN = -600;   // mural.js's lady: her shear and her chin
var WM_UPPER = 95, WM_FORE = 86;                    // the lady's arm bones, measured off mural.js's own arm

var WM_KIT = {muralPerson: muralPerson, muArm: muArm, muHand: muHand, muBunGold: muBunGold, muEarring: muEarring,
              muCollar3q: muCollar3q, muArmlet: muArmlet, muBelt: muBelt, thLongChain: thLongChain, thGoldWork: thGoldWork,
              muGold: muGold, muBead: muBead, muJewel: muJewel, sabaiThreads: sabaiThreads, sabaiBackThreads: sabaiBackThreads,
              muSin: muSin, muFoot: muFoot};

// ---------- the woven sabai, painted once (not thread by thread) ----------
// The owner: "Make sure the version of the sabai isn't the animate every thread version." A weave is woven once on a
// sheet (weaveGrid over sabaiGrid's end and body), and the sheet is laid along the band in thin slices, each bent to
// the band; the cloth moves as a whole, not by its threads.
var WM_TEX = {};
function wmTexture(name, colours) {
  var key = name + "|" + (colours || "own");
  if (WM_TEX[key]) { return WM_TEX[key]; }
  var weave = sabaiWeave(name, colours), cells = SABAI_WARPS, cell = 6, tall = cell * 0.62;
  var end = sabaiGrid(name, "end", cells), body = sabaiGrid(name, "body", cells);
  var copies = Math.max(3, Math.ceil(3000 / (body.length * tall)));   // long enough for the end down the back, ~2300 px
  var can = document.createElement("canvas");
  can.width = cells * cell;
  can.height = Math.ceil((end.length + body.length * copies) * tall);
  var b = can.getContext("2d"), palette = {ground: weave.ground, threads: weave.threads};
  b.fillStyle = weave.ground; b.fillRect(0, 0, can.width, can.height);   // solid under the picks: they leave gaps between
  weaveGrid(b, end, 0, 0, cell, palette, {seed: 3});
  for (var k = 0; k < copies; k++) { weaveGrid(b, body, 0, (end.length + body.length * k) * tall, cell, palette, {seed: 5 + k}); }
  WM_TEX[key] = {canvas: can, w: can.width, endH: end.length * tall, bodyH: body.length * tall, warp: weave.warp, ground: weave.ground};
  return WM_TEX[key];
}
// one slice of the sheet, rows sy to sy + sh, laid on the parallelogram from o along u (across) and v (down the sheet)
function wmSlice(tex, sy, sh, o, u, v) {
  if (sh <= 0) { return; }
  sy = Math.max(0, Math.min(tex.canvas.height - sh - 1, sy));
  pen.save();
  pen.transform(u[0] / tex.w, u[1] / tex.w, v[0] / sh, v[1] / sh, o[0], o[1]);
  pen.drawImage(tex.canvas, 0, sy, tex.w, sh * 1.25, 0, 0, tex.w, sh * 1.25);
  pen.restore();
}
// the band across the chest and over the shoulder, as mural.js's muSabaiWoven asks it of the kit (same arguments)
sabaiThreads = function (brush, spot, from, to, half, name, t, colours) {
  if (!WM) { return WM_KIT.sabaiThreads(brush, spot, from, to, half, name, t, colours); }
  var tex = wmTexture(name, colours), s = 2 * half / tex.w, step = 1.6, a;
  for (a = from; a < to; a += step) {
    var p0 = spot(a, -half), p1 = spot(a, half), q0 = spot(Math.min(to, a + step), -half);
    var sy = tex.endH + ((a / s) % (tex.bodyH * Math.max(1, Math.floor((tex.canvas.height - tex.endH - 200) / tex.bodyH))));
    wmSlice(tex, sy, step / s, p0, [p1[0] - p0[0], p1[1] - p0[1]], [q0[0] - p0[0], q0[1] - p0[1]]);
  }
  var band = new MPath(), k;                        // the cloth's light and its folds, and the plaster's grain over it
  for (k = 0; k <= 30; k++) { a = from + (to - from) * k / 30; var e = spot(a, -half); if (k) { band.L(e[0], e[1]); } else { band.M(e[0], e[1]); } }
  for (k = 30; k >= 0; k--) { a = from + (to - from) * k / 30; e = spot(a, half); band.L(e[0], e[1]); }
  band.Z();
  wmClothLight(band, function (u) { return spot(from + (to - from) * u, half * 0.5); }, function (u) { return spot(from + (to - from) * u, -half * 0.35); }, half);
};
// the end hanging down the back: the woven end at its foot, a fringe, swaying as one cloth in the breeze
sabaiBackThreads = function (brush, where, long, half, name, t, colours, breeze) {
  if (!WM) { return WM_KIT.sabaiBackThreads(brush, where, long, half, name, t, colours, breeze); }
  var tex = wmTexture(name, colours), s = 2 * half / tex.w, R = 24, C = 7, P = [], r, c;
  for (r = 0; r <= R; r++) {
    var v = r / R, row = [], sway = (breeze || 0) * v * v * (9 * Math.sin(clock * 1.3 + v * 2.4) + 4 * Math.sin(clock * 2.9 + 1));
    for (c = 0; c < C; c++) { row.push(where(c / (C - 1), v, [sway, -Math.abs(sway) * 0.15])); }
    P.push(row);
  }
  for (r = 0; r < R; r++) {                         // the foot is the cloth's end: the sheet's first row there
    var lo = P[r + 1], hi = P[r], y0 = (1 - (r + 1) / R) * long / s, y1 = (1 - r / R) * long / s;
    wmSlice(tex, y0, y1 - y0, lo[0], [lo[C - 1][0] - lo[0][0], lo[C - 1][1] - lo[0][1]], [hi[0][0] - lo[0][0], hi[0][1] - lo[0][1]]);
  }
  var fringe = new MPath(), foot = P[R];
  for (c = 0; c <= 12; c++) {
    var f = c / 12, x = foot[0][0] + (foot[C - 1][0] - foot[0][0]) * f, y = foot[0][1] + (foot[C - 1][1] - foot[0][1]) * f;
    fringe.M(x, y).Q(x + 1, y + 6, x - 0.5 + Math.sin(clock * 2 + c) * 1.5, y + 11);
  }
  mLine(fringe, blend(tex.warp, "#2a1a10", 0.25), 0.8);
  return P;
};
// light on a woven cloth: a soft shade along its lower part, a sheen along its upper, the grain of the paint over all
function wmClothLight(rec, shadeAt, sheenAt, half) {
  pen.save();
  pen.clip(rec.path);
  [[shadeAt, "rgba(40, 12, 16, 0.16)", half * 0.9], [sheenAt, "rgba(255, 244, 222, 0.13)", half * 0.35]].forEach(function (l) {
    var line = new MPath();
    for (var k = 0; k <= 30; k++) { var q = l[0](k / 30); if (k) { line.L(q[0], q[1]); } else { line.M(q[0], q[1]); } }
    pen.strokeStyle = l[1]; pen.lineWidth = l[2]; pen.lineCap = "round"; pen.stroke(line.path);
  });
  pen.globalCompositeOperation = "multiply"; pen.globalAlpha = 0.4;
  pen.fillStyle = muPattern(0.6); pen.fillRect(-2000, -2000, 4000, 4000);
  pen.restore();
}

// ---------- arms in a pose ----------
// the elbow of a two-bone arm from shoulder S to wrist W, on the side nearer "toward" (a direction)
function wmElbow(S, W, toward) {
  var dx = W[0] - S[0], dy = W[1] - S[1], far = Math.hypot(dx, dy) || 1, reach = Math.min(far, WM_UPPER + WM_FORE - 2);
  var ux = dx / far, uy = dy / far, along = (WM_UPPER * WM_UPPER - WM_FORE * WM_FORE + reach * reach) / (2 * reach);
  var out = Math.sqrt(Math.max(0, WM_UPPER * WM_UPPER - along * along));
  var one = [S[0] + ux * along - uy * out, S[1] + uy * along + ux * out], two = [S[0] + ux * along + uy * out, S[1] + uy * along - ux * out];
  var t = toward || [0, 1];
  return (one[0] - S[0]) * t[0] + (one[1] - S[1]) * t[1] >= (two[0] - S[0]) * t[0] + (two[1] - S[1]) * t[1] ? one : two;
}
// The wai (owner, 2026-10-31: "She should wai like the old model with both hands over the heart. Add that kind of
// animation to the kit for all humans"): the kit's own pose key, look.wai (true, or 0 to 1 over the frames, as
// person() takes it), on every mural human. Both wrists come from where her pose (or her resting arm) has them to her
// chest's middle over the heart, the palms pressed together, the fingers straight and up, and both arms are drawn over
// her body and over a sabai (late), the near hand last. WM_WAI: where the hands meet, in the upper units of a lady and
// of a man (mural.js's arms), and each arm's elbow, the turn of its hand and its fingers.
// aim: the way the fingers point in the wai (up, leaning a little toward her face), whichever way the forearm comes in.
var WM_WAI = {lady: [-4, -506], man: [-14, -516], aim: -Math.PI / 2 + 0.12,
              near: {dx: -2, dy: 0, elbow: [-0.45, 1], fingers: -0.15},
              far: {dx: 2, dy: -2, elbow: [0.45, 1], fingers: -0.15}};
function wmWaiOf(look) {                             // how far into the wai, eased: 0 none, 1 the hands together
  var v = look && look.wai === true ? 1 : clamp(look && typeof look.wai === "number" ? look.wai : 0);
  return v * v * (3 - 2 * v);
}
function wmWaiArm(S, E, W, p, side, lady, e) {       // her arm's pose on the way into the wai, e of the way there
  var at = WM_WAI[lady ? "lady" : "man"], k = WM_WAI[side], to = [at[0] + k.dx, at[1] + k.dy];
  var from = p ? p.w : W, mid = [(S[0] + W[0]) / 2, (S[1] + W[1]) / 2];
  var bendFrom = p ? p.elbow || [0, 1] : [E[0] - mid[0], E[1] - mid[1]];
  return {w: [mix(from[0], to[0], e), mix(from[1], to[1], e)], elbow: [mix(bendFrom[0], k.elbow[0], e), mix(bendFrom[1], k.elbow[1], e)],
          wrist: (p && p.wrist || 0) * (1 - e), fingers: mix(p && p.fingers !== undefined ? p.fingers : 0.55, k.fingers, e),
          aim: WM_WAI.aim, aimBy: e, late: true};
}
var WM_OVER = null;                               // what is drawn over all of her, before what she holds (the far forearm in a sabai)
var WM_ARM = null, WM_LATE = null, WM_OWN = 0;   // WM_OWN: her own time's offset, while she is drawn                   // WM_LATE: the arms drawn late, in turn (over the sabai, under the belt)
muArm = function (S, E, W, wide, sleeve, skin, look, outward, bend, lady) {
  var side = outward > 0 ? "far" : "near", p = WM && WM.pose && WM.pose[side];
  var wai = WM ? wmWaiOf(look) : 0, walk = WM ? wmWalk() : null;
  if (wai > 0) { p = wmWaiArm(S, E, W, p, side, lady, wai); }
  else if (walk !== null) {                         // walking: the near arm forward as the far foot is, the far arm back
    var swing = 30 * Math.sin(walk + (side === "near" ? 0 : Math.PI)), from = p ? p.w : W;
    p = Object.assign({}, p || {}, {w: [from[0] + swing, from[1] - Math.abs(swing) * 0.3],
                                    elbow: p && p.elbow || [E[0] - (S[0] + W[0]) / 2, E[1] - (S[1] + W[1]) / 2]});
  }
  if (!p) { WM_W[side] = W; return WM_KIT.muArm(S, E, W, wide, sleeve, skin, look, outward, bend, lady); }
  var w = p.w, e = wmElbow(S, w, p.elbow);
  WM_W[side] = w;
  var go = function () {
    WM_ARM = p;
    try { WM_KIT.muArm(S, e, w, wide, sleeve, skin, look, outward, p.fingers !== undefined ? p.fingers : bend, lady); }
    finally { WM_ARM = null; }
    if (side === "near" && WM.scarf) { wmScarf(); }
  };
  if (p.late) {                                     // later, in the frame it would have been drawn in now
    var frame = pen.getTransform();
    (WM_LATE = WM_LATE || []).push(function () { pen.save(); try { pen.setTransform(frame); go(); } finally { pen.restore(); } });
  } else { go(); }
};
muHand = function (x, y, angle, back, bend, skin, lady) {
  var p = WM_ARM;
  if (p && p.wrist) { angle += p.wrist * back; }
  if (p && p.aim !== undefined) { var turn = p.aim - angle; angle += Math.atan2(Math.sin(turn), Math.cos(turn)) * p.aimBy; }   // a wai's hand: fingers up
  if (p && p.aim !== undefined && p.aimBy >= 0.5) { wmHandWai(x, y, angle, skin, lady, WM && WM.hands === "normal" ? 1 : 1.45 * MU_FINGERS); }
  else if (WM && WM.hands === "normal") { wmHandNormal(x, y, angle, back, bend, skin, lady); }
  else { WM_KIT.muHand(x, y, angle, back, bend, skin, lady); }
  if (WM && WM.nails && !(p && p.aim !== undefined && p.aimBy >= 0.5)) { wmNails(x, y, angle, back, bend); }
};
// ---------- the hands of a wai ----------
// The owner (2026-10-31, of her wai): "The woman puts the backs of her hands together. Review the hand, finger model the
// old kit uses and see if you can implement something like that to bring the palms together." The old kit's hand in
// the round (hand() in oldcartoon.js) stands upright in a wai, the four fingers straight and together (WAI), each
// thumb lying along them on the chest's side, the near hand turned to show its back a little from the side (palm 0.25),
// the far hand behind it, palm to palm, its fingers showing past the near ones. muHand draws a hand from the thumb's
// edge, mirrored on the far arm, so pressed together the two fanned apart, back to back. From halfway into a wai (where
// the old kit's fingers go to WAI), both hands are drawn the old kit's way: from the back, a little turned, the fingers
// side by side and straight, the thumb on the chest's side; the far hand a little forward of the near one (WM_WAI).
// Arguments as muHand's, less back and bend; long: the fingers' length (1 a normal hand's, more a dancer's).
var WM_WAI_FINGERS = [[-6.3, 25], [-2.1, 28], [2.1, 26], [6.1, 21]];   // first, middle, ring, little: across the back, and long
function wmHandWai(x, y, angle, skin, lady, long) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(angle - Math.PI / 2);
  pen.scale(-0.8, 1);                               // the thumb toward her chest (as the near hand's is); seen a little from the side
  var wide = lady ? 0.92 : 1, ink = muInk(muColour(skin)), parts = [], gaps = new MPath(), knuckles = new MPath(), tips = [];
  parts.push(muTube(muBent([-7.5 * wide, 5], [-11.5 * wide, 16], [-9.8 * wide, 27]), function (t) { return (3.3 - 0.9 * t) * wide; }));   // the thumb, along the first finger
  parts.push(new MPath().M(-7 * wide, -4).C(-10 * wide, 8, -10.5 * wide, 20, -8.8 * wide, 31).L(8.4 * wide, 31)
    .C(9.6 * wide, 20, 8.6 * wide, 8, 6.4 * wide, -4).Z());   // the back of the hand
  WM_WAI_FINGERS.forEach(function (f, i) {
    var L = f[1] * long * (lady ? 0.94 : 1), root = [f[0] * wide, 28], tip = [f[0] * wide * 0.8, 28 + L];   // together, a little closer at the tips
    parts.push(muTube(muBent(root, [mix(root[0], tip[0], 0.5) + 0.3, 28 + L * 0.5], tip), function (t) { return (2.45 - 0.45 * t) * wide; }));
    tips.push(tip);
    knuckles.M(root[0] - 1.3 * wide, 31.5).Q(root[0], 33.3, root[0] + 1.3 * wide, 31.5);
  });
  for (var i = 0; i < 3; i++) {                     // the fine line between two fingers, to the shorter one's tip
    var a = WM_WAI_FINGERS[i], b = WM_WAI_FINGERS[i + 1], top = 28 + Math.min(a[1], b[1]) * long * (lady ? 0.94 : 1) - 2.5;
    gaps.M((a[0] + b[0]) / 2 * wide, 34).L((a[0] + b[0]) / 2 * wide * 0.8, top);
  }
  parts.forEach(function (part) { mBrush(part, ink, 1.1); });
  parts.forEach(function (part) { mFill(part, skin, 1.5); });
  mLine(gaps, ink, 0.7);
  mLine(knuckles, muShade(muColour(skin)), 0.5);
  mLine(new MPath().M(-7.6 * wide, 8).Q(-8.6 * wide, 18, -7.4 * wide, 27), muShade(muColour(skin)), 0.7);   // where the thumb lies along the hand
  if (WM && WM.nails) { tips.forEach(function (tip, k) { wmNail(tip, 0, 1, k); }); }
  pen.restore();
}
// ---------- ordinary hands ----------
// The owner (2026-10-30, of the men and children): "Change the hands to be like normal hands", then of the women who do
// not dance, "Yes, normal". mural.js draws every hand as a Thai dancer holds hers: fingers 36 to 48 long on a palm of
// 35, slender, sweeping back from the knuckles. wm.hands "normal": fingers 0.62 as long (a little shorter than the palm,
// as a real hand's are), thicker, the palm broader; each finger an arc turning toward the palm and the thumb, a little
// at rest and round in a grip (bend 0 to 1: at rest to a fist). Drawn in mural.js's way: one shape in one line, a fine
// line between the fingers, the thumb over the palm. Arguments as muHand's.
function wmHandNormal(x, y, angle, back, bend, skin, lady) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(angle - Math.PI / 2);
  pen.scale(back, 1);
  var parts = [], gaps = new MPath(), turn = 0.3 + 2.45 * Math.pow(Math.max(0, Math.min(1, bend)), 1.6), wide = lady ? 0.9 : 1;   // bend 0 to 1: at rest to a fist
  [[22, 1.1, 2.2, 28.5], [27, 1.04, 0.9, 30], [29, 1, 0, 30.5], [26, 0.96, -1.2, 30]].forEach(function (f, i) {   // little, ring, middle, first
    // each finger an arc turning toward the palm and the thumb (-x): a little at rest, round in a grip
    var th = Math.max(0.05, turn * f[1]), root = [f[2] * wide, f[3]], L = f[0] * (lady ? 0.94 : 1), R = L / th;
    function on(u) { var a = th * u; return [root[0] - R * (1 - Math.cos(a)) + i * 0.3 * u, root[1] + R * Math.sin(a)]; }
    var at = muBent(root, on(0.5), on(1));
    parts.push(muTube(at, function (t) { return (3.7 - 0.9 * t) * wide; }));
    if (i > 0) { var g0 = at(0.4), g1 = at(0.95); gaps.M(g0[0] + 1.9, g0[1]).Q(at(0.7)[0] + 2.4, at(0.7)[1], g1[0] + 1.6, g1[1]); }
  });
  parts.push(new MPath().M(6 * wide, -4).C(8 * wide, 8, 8.4 * wide, 20, 6.6 * wide, 31).C(3.6, 35.5, -5, 35.5, -7.4 * wide, 31)
    .C(-12 * wide, 22, -11.4 * wide, 8, -7 * wide, -4).Z());
  var cl = Math.min(1, turn / 2.75);                // the thumb comes round over the fingers as they close
  parts.push(muTube(muBent([-6.5 * wide, 6], [-12.5 * wide, 14 + 3 * cl], [-11.5 * wide + 7 * cl, 22 + 5 * cl]), function (t) { return (3.3 - 0.9 * t) * wide; }));
  var ink = muInk(muColour(skin));
  parts.forEach(function (part) { mBrush(part, ink, 1.1); });
  parts.forEach(function (part) { mFill(part, skin, 1.5); });
  mBrush(new MPath().poly(parts[parts.length - 1].subs[0].pts.slice(0, 30), false), ink, 0.9);
  mLine(gaps, ink, 0.7);
  mLine(new MPath().M(-6, 14).Q(-2, 21, -4, 28), muShade(muColour(skin)), 0.7);
  var knuckles = new MPath();                       // the knuckles' small creases
  [[-1, 31], [1, 31.5], [2.6, 30]].forEach(function (k) { knuckles.M(k[0] - 1.2, k[1] - 1).Q(k[0], k[1] + 0.6, k[0] + 1.2, k[1] - 1); });
  mLine(knuckles, muShade(muColour(skin)), 0.5);
  pen.restore();
}
// the long curved brass nails of the fingernail dance (leb fon), on the four fingers, as muHand lays them
function wmNails(x, y, angle, back, bend) {
  pen.save();
  pen.translate(x, y); pen.rotate(angle - Math.PI / 2); pen.scale(back, 1);
  [[36, 1.08, 1.6, 28.5], [45, 1.04, 0.8, 30], [48, 1, 0, 30.5], [44, 0.96, -1, 30]].forEach(function (f, i) {
    var b = bend * f[1], L = f[0] * MU_FINGERS, tip = [f[2] + L * Math.sin(b) * 0.8 + i * 0.3, f[3] + L * Math.cos(b * 0.8)];
    var mid = [f[2] + L * Math.sin(b * 0.25) * 0.3, f[3] + L * 0.52], dx = tip[0] - mid[0], dy = tip[1] - mid[1], l = Math.hypot(dx, dy) || 1;
    wmNail(tip, dx / l, dy / l, i);
  });
  pen.restore();
}
// one brass nail of finger i, from its tip on the way (dx, dy) the finger points
function wmNail(tip, dx, dy, i) {
  var long = 30 + i * 2, curl = -9 - 3 * i;         // each nail runs on from the tip and curls back, as brass does
  var end = [tip[0] + dx * long - dy * curl, tip[1] + dy * long + dx * curl];
  var c1 = [tip[0] + dx * long * 0.55, tip[1] + dy * long * 0.55];
  var nail = new MPath().M(tip[0] - dy * 2.4, tip[1] + dx * 2.4).Q(c1[0] - dy * 1.4, c1[1] + dx * 1.4, end[0], end[1])
    .Q(c1[0] + dy * 1.2, c1[1] - dx * 1.2, tip[0] + dy * 2.4, tip[1] - dx * 2.4).Z();
  muInGold(function () { muGold(nail); });
}

// ---------- the long cloth over the arms ----------
function wmScarf() {
  var sc = WM.scarf, pieces = sc[2](WM_W.far, WM_W.near);
  pieces.forEach(function (c, k) {
    var flutter = Math.sin(clock * 1.1 + k) * 5;
    thScarf(muCurve(c[0], [c[1][0] + flutter, c[1][1]], [c[2][0] - flutter, c[2][1]], c[3]), sc[3] || 10, sc[0], sc[1], c[4] || 1, (c[5] || 0) + Math.sin(clock * 0.7 + k) * 0.25);
  });
}

// ---------- the hair ----------
var WM_HAIR = {
  // dok mai wai: gold flowers and leaves on fine wire springs, fanned out behind the bun, quivering as she moves
  maiwai: function (x, y, r) {
    for (var k = 0; k < 7; k++) {
      var a = -Math.PI * (0.92 - k * 0.1) + 0.06 * Math.sin(clock * 6.5 + k * 1.7) + 0.03 * Math.sin(clock * 11 + k), long = r * (1.9 + 0.35 * (k % 3));
      var tip = [x + Math.cos(a) * long, y + Math.sin(a) * long];
      mLine(new MPath().M(x, y).Q(x + Math.cos(a - 0.15) * long * 0.6, y + Math.sin(a - 0.15) * long * 0.6, tip[0], tip[1]), MU_METAL.line, 0.6);
      if (k % 2) { muGoldFlower(tip[0], tip[1], 4.6, MU_STONE[k % 3 ? 0 : 1]); }
      else { muFlame(tip[0], tip[1] + 2, 9, 3, 1, a + Math.PI / 2); }
    }
  },
  // the fan of gold leaves round the bun (the dancer's of the reference, made as the north's dok mai wai): long leaves
  // on springs, radiating, each quivering on its own
  fan: function (x, y, r) {
    for (var k = 0; k < 11; k++) {
      var a = -Math.PI * 1.05 + k * 0.105 * Math.PI + 0.05 * Math.sin(clock * 7 + k * 2.1), inner = r * 0.9, long = r * (2.2 + 0.25 * Math.sin(k * 1.9));
      pen.save(); pen.translate(x + Math.cos(a) * inner, y + Math.sin(a) * inner); pen.rotate(a + Math.PI / 2);
      var leaf = new MPath().M(0, 0).C(-5.5, -long * 0.3, -3.5, -long * 0.75, 0, -long).C(3.5, -long * 0.75, 5.5, -long * 0.3, 0, 0).Z();
      muGold(leaf);
      mLine(new MPath().M(0, -2).L(0, -long * 0.85), MU_METAL.tick, 0.5);
      pen.restore();
    }
    for (var j = 0; j < 5; j++) { var b = -Math.PI * 0.95 + j * 0.2 * Math.PI; muGoldFlower(x + Math.cos(b) * r * 0.95, y + Math.sin(b) * r * 0.9, 5.4, MU_STONE[j % 2]); }
  },
  // dok ueang sae: the north's fragrant orchid, white with a yellow lip, in long sprays hanging from the bun
  ueang: function (x, y, r) {
    [[-0.9, 120], [-0.3, 150], [0.3, 132], [0.85, 104]].forEach(function (s, i) {
      var sway = Math.sin(clock * 1.5 + i * 0.9) * 6, top = [x - r * 0.3 + s[0] * r * 0.6, y + r * 0.6];
      var at = muCurve(top, [top[0] - 6, top[1] + s[1] * 0.3], [top[0] - 12 + sway, top[1] + s[1] * 0.7], [top[0] - 8 + sway * 1.7, top[1] + s[1]]);
      for (var d = 0.04; d <= 1; d += 0.075) { var p = at(d); wmOrchid(p[0], p[1], 4.4 - d * 1.2, (d * 13 + i) % 2 ? 1 : -1); }
    });
  },
  // jasmine: a ring of buds round the bun and strands of buds (malai) hanging from it, a red bud at each end
  jasmine: function (x, y, r) {
    for (var k = 0; k < 16; k++) { var a = k / 16 * Math.PI * 2; wmBud(x + Math.cos(a) * r * 1.08, y + Math.sin(a) * r * 0.98, a); }
    [-1, 0, 1].forEach(function (s, i) {
      var sway = Math.sin(clock * 1.7 + i) * 4, top = [x - r * 0.5 + s * 6, y + r * 0.8], long = 70 + i * 16;
      var at = muCurve(top, [top[0] - 3, top[1] + long * 0.3], [top[0] - 7 + sway, top[1] + long * 0.7], [top[0] - 5 + sway * 1.6, top[1] + long]);
      for (var d = 0; d <= 1; d += 0.06) { var p = at(d), q = at(Math.min(1, d + 0.02)); wmBud(p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0])); }
      var end = at(1);
      mShape(new MPath().E(end[0], end[1] + 3, 3.2, 4), "#b8283a", 1, 0.6);
    });
  },
  // a gardenia (dok ket thawa) and a pink one tucked in by the bun
  gardenia: function (x, y, r) {
    wmBloom(x + r * 0.7, y - r * 0.75, 9, "#f8f4e6");
    wmBloom(x + r * 0.15, y - r * 1.05, 6.5, "#f0a8b8");
  },
  // yong: the spiral pin of the north, gold, through the bun
  yong: function (x, y, r) {
    var coil = new MPath();
    for (var k = 0; k <= 60; k++) { var a = k / 60 * Math.PI * 6, rr = 1 + k / 60 * 6; var px = x + r * 0.6 + Math.cos(a) * rr, py = y - r * 1.05 + Math.sin(a) * rr * 0.8; if (k) { coil.L(px, py); } else { coil.M(px, py); } }
    mLine(coil, MU_METAL.base, 1.6);
    mLine(new MPath().M(x + r * 0.6, y - r * 1.05).L(x - r * 0.9, y + r * 0.2), MU_METAL.base, 1.5);
  }
};
function wmOrchid(x, y, s, way) {
  pen.save(); pen.translate(x, y); pen.scale(way, 1);
  [-1.2, -0.4, 0.4, 1.2, 2.2].forEach(function (a) {
    mShape(new MPath().E(Math.cos(a - Math.PI / 2) * s * 0.9, Math.sin(a - Math.PI / 2) * s * 0.9, s * 0.8, s * 0.32, a), "#fbf6ea", 0, 0.45);
  });
  mShape(new MPath().E(s * 0.5, s * 0.6, s * 0.62, s * 0.5, 0.4), "#f2c21c", 0, 0.45);   // the yellow lip
  pen.fillStyle = "#b23a1e"; pen.beginPath(); pen.arc(s * 0.45, s * 0.5, s * 0.14, 0, 7); pen.fill();
  pen.restore();
}
function wmBud(x, y, a) {
  mShape(new MPath().E(x, y, 3, 1.9, a), "#fbfaf2", 0, 0.45);
  pen.fillStyle = "#7fa860"; pen.beginPath(); pen.arc(x - Math.cos(a) * 2.6, y - Math.sin(a) * 2.6, 0.9, 0, 7); pen.fill();
}
function wmBloom(x, y, r, colour) {
  for (var k = 0; k < 6; k++) { var a = k / 6 * Math.PI * 2 + 0.3; mShape(new MPath().E(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.55, r * 0.36, a), colour, 1, 0.6); }
  mShape(new MPath().E(x, y, r * 0.3, r * 0.3), blend(colour, "#e8c040", 0.6), 0, 0.5);
}
muBunGold = function (x, y, r, swayAt) {
  if (!WM || !WM.hair) { return WM_KIT.muBunGold(x, y, r, swayAt); }
  WM.hair.forEach(function (name) { WM_HAIR[name](x, y, r); });
};

// ---------- the jewellery ----------
muEarring = function (x, y) {
  var kind = WM && WM.earring;
  if (!kind) { return WM_KIT.muEarring(x, y); }
  var sway = Math.sin(clock * 2.1) * 1.4;
  if (kind === "tube") {                            // lan hu: a gold tube through the lobe, its end a flower
    muGold(new MPath().E(x, y, 4.2, 5.4)); muJewel(x, y, 2.2, MU_STONE[0]);
    return;
  }
  if (kind === "pearl") {
    muJewel(x, y, 2.2, MU_STONE[0]);
    muBead(x + sway * 0.3, y + 5, 1.3);
    wmPearl(x + sway, y + 11, 4);
    return;
  }
  // dok hu: a long filigree drop, a gold bell of a flower, three small drops under it
  muJewel(x, y, 2.4, MU_STONE[0]);
  [5, 8.5, 12].forEach(function (d, i) { muBead(x + sway * (0.2 + i * 0.15), y + d, 1.4); });
  var bx = x + sway * 0.8, by = y + 16;
  muGold(new MPath().M(bx, by).C(bx + 7, by + 2, bx + 8, by + 12, bx + 6, by + 16).L(bx - 6, by + 16).C(bx - 8, by + 12, bx - 7, by + 2, bx, by).Z(), true);
  mLine(new MPath().M(bx - 4, by + 10).Q(bx, by + 6, bx + 4, by + 10).M(bx - 5, by + 14).Q(bx, by + 11, bx + 5, by + 14), MU_METAL.tick, 0.5);
  muJewel(bx, by + 8, 1.8, MU_STONE[1]);
  [-4, 0, 4].forEach(function (dx, i) {
    var sx = bx + dx + sway * 0.5, sy = by + 17;
    muBead(sx, sy + 2, 1); muBead(sx + sway * 0.2, sy + 5, 1);
    muGold(new MPath().M(sx, sy + 7).C(sx + 2.6, sy + 9, sx + 2, sy + 13, sx, sy + 15).C(sx - 2, sy + 13, sx - 2.6, sy + 9, sx, sy + 7).Z());
  });
};
function wmPearl(x, y, r) {
  var g = pen.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, "#ffffff"); g.addColorStop(0.45, "#efe9e0"); g.addColorStop(1, "#a9a299");
  pen.fillStyle = g; pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill();
}
muCollar3q = function (c, y0, r, wide, drop) {
  var kind = WM && WM.neck, H = Math.PI / 2;
  if (!kind) { return WM_KIT.muCollar3q(c, y0, r, wide, drop); }
  if (kind === "pearls" || kind === "sangwan") {     // a choker of pearls, two strands
    [0, 6].forEach(function (dy, i) {
      var ring = muRing(c, y0 + dy, r + 1 + i * 2, drop * (0.5 + i * 0.4));
      var arc = muRingArc(ring, -H * 0.95, H * 0.95, 40);
      for (var k = 0; k < arc.length; k += 1) { wmPearl(arc[k][0], arc[k][1], 1.6); }
    });
    if (kind === "pearls") {
      var f = muRing(c, y0 + 8, r + 3, drop * 0.9)(MU_RING_TURN);
      wmPearl(f[0], f[1] + 6, 3.4);
    }
  }
  if (kind === "sangwan") {                         // sai sangwan: three gold chains over the near shoulder to the far hip
    [0, 1, 2].forEach(function (i) {
      var sway = Math.sin(clock * 1.2 + i) * 1.5;
      muBeads(muCurve([-44 - i * 4, -572 + i * 3], [-20, -520 + i * 6], [10 + sway, -470 + i * 6], [36, -432 + i * 4]), 2.6, 1.05);
    });
    muJewel(-6, -510, 4.2, MU_STONE[0]);             // where the chains are caught: a jewelled plaque
    [-1, 1].forEach(function (s) { muFlame(-6 + s * 7, -510, 7, 2.4, s, s * Math.PI / 2); });
  }
  if (kind === "pendant") {                         // a gold chain and a pendant of kranok flames round a stone
    var ring2 = muRing(c, y0 + 4, r + 3, drop * 1.6), arc2 = muRingArc(ring2, -H * 0.95, H * 0.95, 40);
    muBeads(function (t) { return arc2[Math.min(arc2.length - 1, Math.round(t * (arc2.length - 1)))]; }, 2.6, 1.1);
    var p = ring2(MU_RING_TURN);
    muGold(new MPath().M(p[0], p[1]).C(p[0] + 10, p[1] + 6, p[0] + 8, p[1] + 20, p[0], p[1] + 27).C(p[0] - 8, p[1] + 20, p[0] - 10, p[1] + 6, p[0], p[1]).Z(), true);
    muJewel(p[0], p[1] + 12, 3.6, MU_STONE[0]);
    [-1, 1].forEach(function (s) { muFlame(p[0] + s * 8, p[1] + 10, 8, 2.6, s, s * 0.6); });
    muBead(p[0], p[1] + 30, 1.6);
  }
};
// each blouse its own finish (wm.blouse): "flowers" (the kit's), "clouds" (cloud scrolls among them), "plain", or
// ["dots", colour], a fine scatter of dots. Only the blouse's call is changed (mural.js asks it at step 15; the scarf at 16).
thGoldWork = function (rec, step, kind) {
  var b = WM && step === 15 ? WM.blouse : null;
  if (!b) { return WM_KIT.thGoldWork(rec, step, kind); }
  if (b === "plain") { return; }
  if (b === "clouds" || b === "flowers") { return WM_KIT.thGoldWork(rec, step * 1.15, b); }
  var box = [1e9, 1e9, -1e9, -1e9];
  rec.subs.forEach(function (sub) { sub.pts.forEach(function (p) { box = [Math.min(box[0], p[0]), Math.min(box[1], p[1]), Math.max(box[2], p[0]), Math.max(box[3], p[1])]; }); });
  if (b === "lue") {                                // the Tai Lue jacket (suea pat): its front crossing over, edged in strips, silver buttons
    pen.save(); pen.clip(rec.path);
    var P = [box[0] + (box[2] - box[0]) * 0.66, box[1]], Q = [box[0] + (box[2] - box[0]) * 0.3, box[3]];
    var dx = Q[0] - P[0], dy = Q[1] - P[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
    ["#b8323a", "#3f7a46", "#f2ead6", "#d79a2a"].forEach(function (c, i) {
      var o = i * 5;
      mLine(new MPath().M(P[0] + nx * o, P[1] + ny * o).L(Q[0] + nx * o, Q[1] + ny * o), c, 5.2);
      mLine(new MPath().M(box[0], box[3] - 4 - o).L(box[2], box[3] - 4 - o), c, 5.2);
    });
    pen.restore();
    for (var t = 0.12; t < 0.95; t += 0.14) { muBead(P[0] + dx * t - nx * 4, P[1] + dy * t - ny * 4, 2.2); }
    return;
  }
  if (b[0] === "lace") {                            // a lace blouse, as the court wore it in 1914: rows of small scallops, little flowers
    pen.save(); pen.clip(rec.path); pen.strokeStyle = b[1]; pen.fillStyle = b[1]; pen.lineWidth = 0.6;
    for (var ly = box[1], lr = 0; ly < box[3]; ly += 8, lr++) {
      pen.beginPath();
      for (var lx = box[0] + (lr % 2) * 3; lx < box[2]; lx += 6) { pen.moveTo(lx + 3, ly); pen.arc(lx, ly, 3, 0, Math.PI); }
      pen.stroke();
      if (lr % 2) { for (lx = box[0] + 7; lx < box[2]; lx += 14) { for (var q = 0; q < 4; q++) { var qa = q * Math.PI / 2; pen.beginPath(); pen.arc(lx + Math.cos(qa) * 1.6, ly - 4 + Math.sin(qa) * 1.6, 0.9, 0, 7); pen.fill(); } } }
    }
    pen.restore();
    return;
  }
  pen.save(); pen.clip(rec.path); pen.fillStyle = b[1];
  for (var y = box[1], row = 0; y < box[3]; y += 6, row++) {
    for (var x = box[0] + (row % 2) * 3; x < box[2]; x += 6) { pen.beginPath(); pen.arc(x, y, 0.9, 0, 7); pen.fill(); }
  }
  pen.restore();
};
muArmlet = function (at, t, wide) { if (!WM || WM.armlet) { WM_KIT.muArmlet(at, t, wide); } };
thLongChain = function (l, r, low, out) { if (!WM || WM.chain !== false) { WM_KIT.thLongChain(l, r, low, out); } };
muBelt = function (y, x0, x1, buckleX) {
  if (WM_LATE) { var gos = WM_LATE; WM_LATE = null; gos.forEach(function (go) { go(); }); }   // arms across the body: over the sabai, under the belt
  var kind = WM && WM.belt;
  if (!kind) { return WM_KIT.muBelt(y, x0, x1, buckleX); }
  // khemkhat: a belt of linked plates, and its buckle (pan neng), an oval of repoussé gold with a stone
  var band = new MPath().M(x0, y - 4).Q((x0 + x1) / 2, y + 3, x1, y - 4).L(x1, y + 4).Q((x0 + x1) / 2, y + 11, x0, y + 4).Z();
  muGold(band);
  var links = new MPath();
  for (var x = x0 + 4; x < x1; x += 5) { var yy = y + 3.5 * (1 - Math.pow((x - (x0 + x1) / 2) / ((x1 - x0) / 2), 2)); links.M(x, yy - 3.5).L(x + 2, yy + 3.5); }
  mLine(links, MU_METAL.tick, 0.6);
  var by = y + 4;
  muGold(new MPath().E(buckleX, by, 14, 9), true);
  muGold(new MPath().E(buckleX, by, 10, 6));
  for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; muBead(buckleX + Math.cos(a) * 12, by + Math.sin(a) * 7.6, 1); }
  muJewel(buckleX, by, 3.6, MU_STONE[0]);
  if (kind === "chains") {                          // swags of chain under it, and drops hanging from them
    [[x0 + 2, buckleX - 4, 16], [buckleX + 4, x1 - 2, 14], [x0 + 10, x1 - 10, 30]].forEach(function (s, i) {
      var sway = Math.sin(clock * 1.4 + i) * 2;
      var at = muCurve([s[0], y + 6], [s[0] + (s[1] - s[0]) * 0.25, y + s[2]], [s[0] + (s[1] - s[0]) * 0.75 + sway, y + s[2]], [s[1], y + 6]);
      muBeads(at, 2.6, 1);
      [0.25, 0.5, 0.75].forEach(function (u) {
        var p = at(u);
        muGold(new MPath().M(p[0], p[1]).C(p[0] + 3, p[1] + 3, p[0] + 2.4, p[1] + 9, p[0] + sway * 0.3, p[1] + 12).C(p[0] - 2.4, p[1] + 9, p[0] - 3, p[1] + 3, p[0], p[1]).Z());
      });
    });
  }
};

// ---------- the foot of her sin: a woven teen jok of her own ----------
// The owner: "new foot bands". mural_luxe.js gives every sin the same gold band (muTinJok); a woman with wm.jok
// [town, palette, taller] wears the kit's own woven teen jok (weaving.js teenJok: the rows of Mae Chaem, Nan or Mueang
// Long, in one of WEAVE_PALETTES), woven once onto a sheet and laid round her in thin upright strips, each bowed down
// as muSin bows its stripes round the body; "taller" its height over the sin's own foot band, from the hem up.
var WM_JOK = {}, WM_JOK_KIT = muTinJok;
function wmJokSheet(town, palette, w) {
  var key = town + "|" + palette + "|" + Math.round(w);
  if (!WM_JOK[key]) {
    var got = null, brush = {drawImage: function (img) { got = img; }};
    teenJok(brush, 0, 0, w / 2, {town: town, palette: WEAVE_PALETTES[palette], cell: 7});
    WM_JOK[key] = {canvas: got, w: got.width, h: got.height};     // its size as the sheet is: weaveKept weaves at twice
  }
  return WM_JOK[key];
}
muTinJok = function (y0, y1, x0, x1, ground) {
  var j = WM && WM.jok;
  if (!j) { return WM_JOK_KIT(y0, y1, x0, x1, ground); }
  var tall = (y1 - y0) * (j[2] || 1.5), top = y1 - tall;
  var high = wmJokSheet(j[0], j[1], 100).h;          // its height in the sheet's pixels does not change with its width
  var narrow = 0.72;                                 // its floats narrower than the sheet's: more of the pattern round her
  var sheet = wmJokSheet(j[0], j[1], (x1 - x0) * high / tall / narrow), s = tall / sheet.h * narrow;
  var mid = (x0 + x1) / 2, half = (x1 - x0) / 2, step = 2.5;
  for (var x = x0; x < x1; x += step) {
    var u = (x + step / 2 - mid) / half, bow = 7 * (1 - u * u);
    pen.drawImage(sheet.canvas, Math.min(sheet.w - 1, (x - x0) / s), 0, step / s + 1, sheet.h, x, top + bow, step + 0.4, tall);
  }
  var round = pen.createLinearGradient(x0, 0, x1, 0);   // the tube turning away at its sides
  round.addColorStop(0, "rgba(30, 15, 10, 0.4)"); round.addColorStop(0.3, "rgba(30, 15, 10, 0)");
  round.addColorStop(0.75, "rgba(30, 15, 10, 0)"); round.addColorStop(1, "rgba(30, 15, 10, 0.35)");
  pen.fillStyle = round; pen.fillRect(x0, top, x1 - x0, tall + 10);
};

// ---------- the water carrier ----------
// holds "pots" (owner, 2026-11-05, after a photograph of a woman carrying water and the mural beside it: "W1 but cut the
// pot off at the bottom so it looks more like the image and is smaller"): a bamboo carrying pole on her near shoulder,
// her near hand on it before her (pose near: WM_POTS.hand, with hands "normal"), and a black clay water pot hung on
// cords from each end, round and wide-mouthed, cut off flat below its widest; the pot behind her is drawn before her
// body (wmWoman), the pole and the pot before her over it (wmHolds). The pots swing a little, each in its own time.
var WM_POTS = {back: [-215, -536], front: [150, -590], drop: 205, r: 40,
               hand: {w: [62, -566], elbow: [-0.2, 1], wrist: -0.6, fingers: 0.9, late: true}};
// the pole from "from" to "to": a cane of even width, lit along its top, three nodes
function wmPole(from, to) {
  var dx = to[0] - from[0], dy = to[1] - from[1], l = Math.hypot(dx, dy), nx = -dy / l * 5.5, ny = dx / l * 5.5;
  var cane = new MPath().M(from[0] + nx, from[1] + ny).L(to[0] + nx, to[1] + ny).Q(to[0] + dx / l * 4, to[1] + dy / l * 4, to[0] - nx, to[1] - ny)
    .L(from[0] - nx, from[1] - ny).Q(from[0] - dx / l * 4, from[1] - dy / l * 4, from[0] + nx, from[1] + ny).Z();
  mShape(cane, "#b08a4a", 3, 1.1);
  pen.save(); pen.clip(cane.path);
  pen.strokeStyle = "rgba(240, 214, 160, 0.8)"; pen.lineWidth = 2.6; pen.beginPath();
  pen.moveTo(from[0] - nx * 0.45, from[1] - ny * 0.45); pen.lineTo(to[0] - nx * 0.45, to[1] - ny * 0.45); pen.stroke();
  pen.restore();
  var nodes = new MPath();
  [0.2, 0.48, 0.76].forEach(function (u) { var x = from[0] + dx * u, y = from[1] + dy * u; nodes.M(x + nx, y + ny).L(x - nx, y - ny); });
  mLine(nodes, "#6a4a24", 1.2);
}
// a pot hung from the pole's end P: way 1 before her, -1 behind
function wmPot(P, way) {
  var r = WM_POTS.r, h = r * 0.92, sway = Math.sin(clock * 1.3 + (way > 0 ? 0 : 1.7)) * 5, c = [P[0] + sway, P[1] + WM_POTS.drop];
  var top = c[1] - h, mouth = r * 0.7, rim = top - r * 0.08, foot = c[1] + h * 0.6;
  mLine(new MPath().M(P[0], P[1]).L(c[0] - mouth - 2, rim + 4).M(P[0], P[1]).L(c[0] + mouth + 2, rim + 4).M(P[0], P[1]).L(c[0] - 2, rim + 2), "#c9a46a", 1.1);
  var body = new MPath().M(c[0] - mouth, top).C(c[0] - r * 1.08, top + h * 0.15, c[0] - r * 1.18, c[1] + h * 0.3, c[0] - r * 0.72, foot)
    .Q(c[0], foot + 2.5, c[0] + r * 0.72, foot).C(c[0] + r * 1.18, c[1] + h * 0.3, c[0] + r * 1.08, top + h * 0.15, c[0] + mouth, top).Z();
  mShape(body, "#2a2220", 8, 1.3);
  pen.save(); pen.clip(body.path);
  var g = pen.createRadialGradient(c[0] + r * 0.35, c[1] - h * 0.35, 2, c[0] + r * 0.3, c[1] - h * 0.3, r * 0.9);   // the shine of fired clay
  g.addColorStop(0, "rgba(122, 106, 98, 0.85)"); g.addColorStop(0.5, "rgba(122, 106, 98, 0)");
  pen.fillStyle = g; pen.fillRect(c[0] - r * 1.2, top, r * 2.4, h * 2.2);
  pen.restore();
  mShape(new MPath().M(c[0] - mouth, top + 1).L(c[0] - mouth * 0.85, rim + 3).L(c[0] + mouth * 0.85, rim + 3).L(c[0] + mouth, top + 1).Z(), "#2a2220", 4, 1);
  mShape(new MPath().E(c[0], rim + 2, mouth * 1.05, 4.5), "#3a302c", 3, 1.1);       // the rolled lip
  mShape(new MPath().E(c[0], rim + 1.5, mouth * 0.7, 2.4), "#141010", 1, 0.6);      // the mouth
  mLine(new MPath().M(c[0] - mouth * 0.8, rim + 6).L(c[0] + mouth * 0.8, rim + 6), "#c9a46a", 2);   // the cord tied under the lip
}

// ---------- what she holds, over everything ----------
// lotus, garland, khan: a bowl of flowers (the near hand); cloth: a length of her own weaving hung from
// both hands (wm.cloth, a SABAI_WEAVES name); parasol: a Bo Sang paper parasol over her shoulder (wm.parasol colours);
// fan: a red lacquer fan with gold; lantern: a paper lantern (khom) hung from a stick, lit; pots: a carrying pole and
// water pots (above)
function wmHolds(look) {
  var h = WM.holds, w = WM_W.near, f = WM_W.far;
  if (!h || !w) { return; }
  if (h === "pots") { wmPole(WM_POTS.back, WM_POTS.front); wmPot(WM_POTS.front, 1); }
  if (h === "khan") { wmKhan([w[0] + 4, w[1] - 16]); }
  if (h === "cloth" && f) { wmCloth(w, f, WM.cloth); }
  if (h === "fan") { wmFan(w); }
  if (h === "lantern") { wmLantern(w); }
  if (h === "lotus") {                              // a lotus bud on its stem, held up to her face
    var top = [w[0] + 30, w[1] - 62], stem = muCurve([w[0] + 2, w[1] + 14], [w[0] + 8, w[1] - 10], [top[0] - 6, top[1] + 24], top);
    var sp = []; for (var k = 0; k <= 20; k++) { sp.push(stem(k / 20)); }
    mLine(new MPath().poly(sp, false), "#4f7a3c", 2.2);
    pen.save(); pen.translate(top[0], top[1]); pen.rotate(0.35);
    var g = pen.createLinearGradient(0, 8, 0, -24); g.addColorStop(0, "#f6eef0"); g.addColorStop(0.55, "#f2a6bf"); g.addColorStop(1, "#d8487a");
    [[-1, 0.9], [1, 0.9], [0, 1.1]].forEach(function (pp) {
      var petal = new MPath().M(0, 6).C(pp[0] * 11, -2, pp[0] * 8, -16 * pp[1], pp[0] * 1.5, -25 * pp[1]).C(pp[0] * 1 - 2, -15, pp[0] * 0.5 - 3, -2, 0, 6).Z();
      if (!pp[0]) { petal = new MPath().M(0, 6).C(8, -4, 6, -18, 0, -27).C(-6, -18, -8, -4, 0, 6).Z(); }
      pen.fillStyle = g; pen.fill(petal.path);
      mBrush(petal, "#a8325a", 0.8);
      mLine(new MPath().M(0, 3).Q(pp[0] * 2, -10, pp[0] * 1.2, -20), "rgba(168, 50, 90, 0.5)", 0.5);
    });
    pen.restore();
  }
  if (h === "garland") {                            // phuang malai: a loop of jasmine, a red rose, tassels of buds
    var sway = Math.sin(clock * 1.6) * 3, loop = muCurve([w[0] - 4, w[1] + 4], [w[0] - 26, w[1] + 46], [w[0] + 22 + sway, w[1] + 52], [w[0] + 8, w[1] + 4]);
    for (var d = 0; d <= 1; d += 0.035) { var p = loop(d), q = loop(Math.min(1, d + 0.01)); wmBud(p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2); }
    var low = loop(0.5);
    wmBloom(low[0], low[1] + 4, 7, "#c8283c");
    [-4, 0, 4].forEach(function (dx, i) {
      for (var e = 0; e < 7; e++) { wmBud(low[0] + dx + sway * e * 0.12, low[1] + 12 + e * 4.4, Math.PI / 2); }
      mShape(new MPath().E(low[0] + dx + sway, low[1] + 44, 2.4, 3.2), i === 1 ? "#c8283c" : "#f2c21c", 0, 0.5);
    });
  }
}

// khan dok: a footed bowl of her metal, heaped with marigolds, jasmine and a rose, two candles, on her palm at c
function wmKhan(c) {
  var x = c[0], y = c[1];
  var foot = new MPath().M(x - 10, y + 14).L(x + 10, y + 14).L(x + 15, y + 24).Q(x, y + 27, x - 15, y + 24).Z();
  muGold(foot, true);
  var heap = [[-16, -4, "#f2a01c"], [12, -6, "#f2a01c"], [-2, -12, "#e8801a"], [-24, 2, "#f6f2e6"], [22, 1, "#f6f2e6"], [4, -2, "#d84860"]];
  mLine(new MPath().M(x - 7, y - 4).L(x - 9, y - 40).M(x + 6, y - 4).L(x + 8, y - 36), "#f2e2a0", 2.6);   // the candles
  muGlow(x - 9, y - 43, 3, 5, "255, 200, 90", 0.6 + 0.2 * Math.sin(clock * 9)); muGlow(x + 8, y - 39, 3, 5, "255, 200, 90", 0.6 + 0.2 * Math.sin(clock * 8 + 1));
  heap.forEach(function (p) { wmBloom(x + p[0], y + p[1], 9, p[2]); });
  var bowl = new MPath().M(x - 30, y - 2).C(x - 28, y + 10, x - 14, y + 15, x, y + 15).C(x + 14, y + 15, x + 28, y + 10, x + 30, y - 2)
    .C(x + 20, y + 3, x - 20, y + 3, x - 30, y - 2).Z();
  muGold(bowl);
  var bands = new MPath();
  for (var k = -24; k <= 24; k += 6) { bands.M(x + k, y + 2 + Math.abs(k) * 0.05).L(x + k * 0.9, y + 11 - Math.abs(k) * 0.12); }
  mLine(bands, MU_METAL.tick, 0.5);                // the repoussé lobes round its side
}
// a length of her weaving held up between her hands, its woven end down, hanging in folds, its fringe
function wmCloth(nw, fw, name) {
  var tex = wmTexture(name), A = [nw[0] + 4, nw[1] - 2], B = [fw[0] - 4, fw[1] - 2], L = 250, n = 36;
  var sway = Math.sin(clock * 0.9) * 6, across = Math.hypot(B[0] - A[0], B[1] - A[1]), Lpx = L * tex.w / across;
  function left(v) { return [A[0] - 8 * v + sway * v * v, A[1] + L * v]; }
  function right(v) { return [B[0] + 6 * v + sway * v * v, B[1] + (L - 12) * v]; }
  for (var i = 0; i < n; i++) {
    var v0 = i / n, v1 = (i + 1) / n, l0 = left(v0), l1 = left(v1), r1 = right(v1);
    wmSlice(tex, (1 - v1) * Lpx, Lpx / n, l1, [r1[0] - l1[0], r1[1] - l1[1]], [l0[0] - l1[0], l0[1] - l1[1]]);
  }
  var edge = [], k;
  for (k = 0; k <= 12; k++) { edge.push(left(k / 12)); }
  for (k = 12; k >= 0; k--) { edge.push(right(k / 12)); }
  var outline = new MPath().poly(edge, true);
  pen.save(); pen.clip(outline.path);                // its folds, hanging from the hands
  var folds = pen.createLinearGradient(A[0], A[1], B[0], B[1]);
  for (k = 0; k <= 8; k++) { folds.addColorStop(k / 8, k % 2 ? "rgba(255, 245, 225, 0.12)" : "rgba(30, 15, 10, 0.28)"); }
  pen.fillStyle = folds; pen.fillRect(Math.min(A[0], B[0]) - 20, Math.min(A[1], B[1]) - 10, across + 60, L + 30);
  pen.restore();
  mBrush(outline, "#3a2418", 1);
  var fringe = new MPath();
  for (k = 0; k <= 30; k++) { var p = left(1), q = right(1), u = k / 30, fx = p[0] + (q[0] - p[0]) * u, fy = p[1] + (q[1] - p[1]) * u; fringe.M(fx, fy).L(fx + sway * 0.2, fy + 10 + (k % 3)); }
  mLine(fringe, tex.ground, 0.8);
}
// a Bo Sang paper parasol: its shaft from her hand, its canopy tipped back over her shoulder, ribs and painted flowers.
// Behind her: wmWoman draws it before her body, at the wrist her pose gives, and her hand closes over the shaft.
function wmParasol(w, c) {
  var C = [w[0] - 95, w[1] - 140];
  mLine(new MPath().M(w[0] + 6, w[1] + 22).L(C[0], C[1]), "#6a4a2c", 2.6);
  pen.save(); pen.translate(C[0], C[1]); pen.rotate(-0.5 + 0.02 * Math.sin(clock * 0.8)); pen.scale(1.12, 1.12);
  var canopy = new MPath().M(-125, 0).C(-110, -58, 110, -58, 125, 0).C(80, 26, -80, 26, -125, 0).Z();
  mFill(canopy, c[0], 6);
  pen.save(); pen.clip(canopy.path);
  var ribs = new MPath();
  for (var k = 0; k <= 16; k++) { var u = k / 16 * 2 - 1; ribs.M(0, -44).Q(u * 70, -40, u * 125, 20 * (1 - u * u)); }
  mLine(ribs, muShade(muColour(c[0])), 0.8);
  for (k = 0; k < 7; k++) { var a = (k + 0.5) / 7 * 2 - 1; wmBloom(a * 92, 6 * (1 - a * a) - 8, 9, c[1]); }   // the painted flowers
  mLine(new MPath().M(-125, 0).C(-80, 26, 80, 26, 125, 0), blend(c[0], "#2a1008", 0.4), 3.4);
  pen.restore();
  mBrush(canopy, muInk(muColour(c[0])), 1.2);
  muGold(new MPath().E(0, -44, 4, 3));
  pen.restore();
}
// a fan of red lacquer, gold round its edge and a gold flower in its middle, held up before her
function wmFan(w) {
  var F = [w[0] + 22, w[1] - 46];
  muGold(new MPath().M(w[0] + 1, w[1] + 8).L(w[0] + 4, w[1] + 10).L(F[0] + 2, F[1] + 2).L(F[0] - 1, F[1]).Z());
  pen.save(); pen.translate(F[0], F[1]); pen.rotate(0.3 + 0.03 * Math.sin(clock * 1.2));
  muGold(new MPath().E(0, -14, 25, 30));
  mFill(new MPath().E(0, -14, 21.5, 26.5), "#9a1f24", 4);
  for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; muFlame(Math.cos(a) * 15, -14 + Math.sin(a) * 19, 7, 2.2, 1, a + Math.PI / 2); }
  muGoldFlower(0, -14, 9, MU_STONE[0]);
  pen.restore();
}
// a khom: a paper lantern hung from a bamboo stick, lit inside; its ribs, its caps, its paper fringe swinging
function wmLantern(w) {
  var T = [w[0] + 80, w[1] - 120], sway = Math.sin(clock * 1.3) * 5, top = [T[0] + sway * 0.4, T[1] + 18], c = [top[0] + sway * 0.3, top[1] + 30];
  mLine(new MPath().M(w[0] - 6, w[1] + 8).L(T[0], T[1]), "#8a6a3a", 2.4);
  mLine(new MPath().M(T[0], T[1]).L(top[0], top[1]), "#3a2418", 0.6);
  var glow = 0.28 + 0.06 * Math.sin(clock * 7) + 0.04 * Math.sin(clock * 13);
  muGlow(c[0], c[1], 70, 70, "255, 190, 90", glow);
  var body = new MPath().E(c[0], c[1], 21, 26);
  var g = pen.createRadialGradient(c[0], c[1] + 4, 2, c[0], c[1], 26);
  g.addColorStop(0, "#fff2b0"); g.addColorStop(0.45, "#f4a640"); g.addColorStop(1, "#c8402e");
  pen.fillStyle = g; pen.fill(body.path);
  pen.save(); pen.clip(body.path);
  var ribs = new MPath();
  for (var k = -3; k <= 3; k++) { ribs.M(c[0], c[1] - 26).Q(c[0] + k * 9.5, c[1], c[0], c[1] + 26); }
  mLine(ribs, "rgba(140, 40, 20, 0.55)", 0.7);
  pen.restore();
  mBrush(body, "#7a2014", 0.9);
  muGold(new MPath().M(c[0] - 9, c[1] - 24).L(c[0] + 9, c[1] - 24).L(c[0] + 6, c[1] - 30).L(c[0] - 6, c[1] - 30).Z());
  muGold(new MPath().M(c[0] - 9, c[1] + 24).L(c[0] + 9, c[1] + 24).L(c[0] + 6, c[1] + 29).L(c[0] - 6, c[1] + 29).Z());
  var fringe = new MPath();
  for (k = -5; k <= 5; k++) { var fx = c[0] + k * 1.6; fringe.M(fx, c[1] + 29).L(fx + sway * 0.8 + Math.sin(clock * 3 + k) * 1.2, c[1] + 52 + (k % 2) * 4); }
  mLine(fringe, "#c8283c", 0.9);
}

// ---------- the crown of a celestial (the murals' heaven, not the court) ----------
function wmCrown() {
  // a band over the head's top and a tall spire of tiers over the knot, flames along the band; in the head's frame
  var band = new MPath().M(-48, -76).C(-40, -98, 4, -110, 30, -96).L(29, -88).C(4, -101, -36, -92, -42, -70).Z();
  muGold(band, true);
  for (var k = 0; k < 7; k++) { var u = k / 6, p = [-44 + u * 72, -86 - Math.sin(u * Math.PI) * 18]; muFlame(p[0], p[1], 14 - Math.abs(u - 0.5) * 10, 3.4, u < 0.5 ? -1 : 1, (u - 0.5) * 0.9); }
  [0, 1, 2, 3].forEach(function (i) {               // the spire over the knot: tiers narrowing to a point
    var y = -112 - i * 15, w = 17 - i * 3.6;
    muGold(new MPath().M(-14 - w, y + 8).Q(-14, y + 2, -14 + w, y + 8).L(-14 + w * 0.7, y - 6).Q(-14, y - 10, -14 - w * 0.7, y - 6).Z(), true);
    muJewel(-14, y, 1.8, MU_STONE[i % 2]);
  });
  muFlame(-14, -168, 22, 4, 1, 0.1);
  muJewel(-34, -84, 2.2, MU_STONE[0]); muJewel(8, -100, 2.2, MU_STONE[1]);
}

// ---------- her own face ----------
// mural.js draws one head for every woman. Here the head is drawn as mural.js's muHead draws it (the same painters, in
// the same order), with what makes a face her own as numbers (wm.face); a woman with no face gets mural.js's head.
//   mu       mural.js's switches for her (MU): nose, cheek, tara (fuller cheeks, rounder chin), fuller and round (lips)
//   jaw      {cheek: the near cheek out (+), corner: [x, y] the jaw's corner moved, chin: [x, y] the chin moved,
//            far: the far cheek out}
//   forehead the hairline up (+, units; at most 2) or down
//   brows    {lift, arch, long, fall: the outer ends down (+), thick}
//   eyes     {long: 1 the mural's, y: down (+), tilt: radians the outer corners go up, open: the upper lid up (+) or
//            down, crease: 0 (none) to 1, gaze: [x, y] where the irises look, iris: their size, flick: the lash's
//            flick, liner: 0 to 1 a dancer's painted wing past the outer corner}
//   mouth    [wide, tall] her lips about their middle
//   feel     her resting face in the kit's feeling numbers: lids (down), smile, wonder
//   jon      a lock of hair down in front of the ear (Siamese and Lanna girls kept one)
//   dimple   true: a dimple at the near corner of her mouth; mole: [x, y] a beauty spot
var WM_FACE = null;
var WM_HEAD = {muHead: muHead, muLipsPainted: muLipsPainted, muFeelOf: muFeelOf};
// alive (her settings): how much, 0 to 1; her blink now, 0 open to 1 shut (one of 0.18 s every 4.6 s, in her own time);
// her head's drift now, radians about a point a little above her chin (two slow waves, at most 0.031)
function wmAlive() { return WM && WM.alive ? (WM.alive === true ? 1 : clamp(WM.alive)) : 0; }
function wmBlink() {
  if (!wmAlive()) { return 0; }
  var p = ((clock + WM_OWN * 1.7) % 4.6 + 4.6) % 4.6;
  return p < 0.18 ? Math.sin(Math.PI * p / 0.18) : 0;
}
function wmDrift() {
  var t = clock + WM_OWN;
  return wmAlive() * (0.022 * Math.sin(2 * Math.PI * t / 5.3) + 0.009 * Math.sin(2 * Math.PI * t / 2.3 + 1));
}
muHead = function (look, lady, skin) {
  var drift = wmDrift();
  pen.save(); pen.translate(0, -12); pen.rotate(drift + MU_NOD); pen.translate(0, 12);   // alive: the head drifts about the chin; MU_NOD as person()'s tips
  try { wmFaceHead(look, lady, skin); } finally { pen.restore(); }
};
function wmFaceHead(look, lady, skin) {
  var fc = WM && WM.face;
  if (!fc) { return WM_HEAD.muHead(look, lady, skin); }
  var was = {};
  Object.keys(fc.mu || {}).forEach(function (k) { was[k] = MU[k]; MU[k] = fc.mu[k]; });
  WM_FACE = fc;
  try { wmHead(look, lady, skin, fc); }
  finally { WM_FACE = null; Object.keys(was).forEach(function (k) { MU[k] = was[k]; }); }
}
muFeelOf = function (look) {
  var f = WM_HEAD.muFeelOf(look);
  if (WM_FACE && WM_FACE.feel) { Object.keys(WM_FACE.feel).forEach(function (k) { f[k] = Math.max(f[k] || 0, WM_FACE.feel[k]); }); }
  return f;
};
muLipsPainted = function (lady, skin, at, paint, f) {
  var m = WM_FACE && WM_FACE.mouth;
  if (!m) { return WM_HEAD.muLipsPainted(lady, skin, at, paint, f); }
  pen.save();
  pen.translate(17.6, -16); pen.scale(m[0], m[1]); pen.translate(-17.6, 16);
  WM_HEAD.muLipsPainted(lady, skin, at, paint, f);
  pen.restore();
};

// ---------- her face turned to us ----------
// front (her settings, 0 to 1): her face turns from the mural's three-quarter, to the right, to straight on, looking at
// whoever watches (owner, 2026-10-31: "As the camera pulls out have her turn to face the camera straight on before she
// winks"; the head and face only, her body as it was). Her face's outline and hair go over to an oval about the middle
// line WM_FRONT_X (over her neck), her eyes to the same length either side of it, the iris to the middle of the eye;
// her nose and mouth to that line, her brows and her cheeks' colour with her eyes, her far ear and its earring (and her
// lock, jon) come out from behind her cheek. Her own jaw's numbers (wm.face.jaw) go with her into the oval.
var WM_FRONT_X = 0;
function wmFront() {
  var v = WM && WM.front ? (WM.front === true ? 1 : clamp(WM.front)) : 0;
  return v * v * (3 - 2 * v);
}
// a closed path of one piece in three-quarter (pts) on the way to straight on (front(p, i): where point i goes), e of the way
function wmToward(pts, front, e) {
  return new MPath().poly(pts.map(function (p, i) { var q = front(p, i); return [mix(p[0], q[0], e), mix(p[1], q[1], e)]; }), true);
}
// The head straight on (owner, 2026-11-04: "redraw the shape of the face for the frontal view of the woman. Her jaw and
// the shape of her head look a little off", then "Trace the first reference image from ear to ear passing through the
// chin ... Take inspiration from that shape"). The jaw is traced from that painting (an oil portrait of a Thai woman in
// gold silk, facing us): WM_FRONT_TRACE, from her cheekbones (1: their height above the chin, their width) to her chin
// (0), each row how high above the chin as a share of the cheekbones' height, and how wide as a share of their width:
// her cheeks fall almost straight to the tip of her nose, then come in steadily to a narrow, rounded chin. Ours is
// "wide" across at "at" (her cheekbones), the chin at "chin"; above, the forehead a dome up to "top" under the hair,
// narrowing at the temples by "temples"; the hair's dome "temple" wide and up to "crown"; her eyes "eyes" either side of
// her middle (the painting's nearly reach the edge of her face).
// (the owner, of the traced face at today's width: "Round T3's chin a little more": its last three rows fuller)
var WM_FRONT_TRACE = [[1, 1], [0.69, 0.93], [0.51, 0.85], [0.33, 0.7], [0.19, 0.56], [0.08, 0.4], [0.03, 0.26], [0, 0]];
// The owner picked the traced face at the width hers had been ("T3"), 2026-11-04. Her eyes straight on go over to the
// painting's (eye: wmEye's own numbers, as far as she has turned): level, more open, no flick at the corner, no
// wing, longer and a larger iris, the fold of the lid showing ("redo the nostrils and eyes to be more like the reference image").
var WM_FRONT_HEAD = {wide: 30.5, at: -47, top: -97, temples: 0.12, chin: 1, temple: 35.5, crown: -112, brow: [27.5, -55, -84], nape: -38,
  eyes: 14.5, eye: {tilt: 0, open: 2.2, flick: 0, liner: 0, iris: 1.15, crease: 1, long: 1.1},
  nose: -33.5, mouth: {y: -21.5, half: 13.5, upper: 3.2, lower: 4.8}};
var WM_FRONT_JAW = {key: null, pts: null, run: null};
function wmJawFront(W, chin) {                       // the traced jaw at this width and chin, sampled evenly along its length
  var H = WM_FRONT_HEAD, key = [W, chin, H.at].join(" ");
  if (WM_FRONT_JAW.key === key) { return WM_FRONT_JAW; }
  var T = WM_FRONT_TRACE.map(function (r) { return [W * r[1], chin + (H.at - chin) * r[0]]; }), pts = [], run = [0];
  for (var i = 0; i < T.length - 1; i++) {           // through each row smoothly (Catmull-Rom), the chin met flat
    var p0 = T[Math.max(0, i - 1)], p1 = T[i], p2 = T[i + 1], p3 = i + 2 < T.length ? T[i + 2] : [-T[i][0], T[i][1]];
    for (var k = 0; k < 12; k++) {
      var t = k / 12, t2 = t * t, t3 = t2 * t;
      pts.push([0, 1].map(function (d) {
        return 0.5 * (2 * p1[d] + (p2[d] - p0[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * t3);
      }));
    }
  }
  pts.push(T[T.length - 1]);
  for (i = 1; i < pts.length; i++) { run.push(run[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); }
  WM_FRONT_JAW = {key: key, pts: pts, run: run};
  return WM_FRONT_JAW;
}
// the face's outline straight on: the point of the three-quarter outline (about its own middle) at the same turn on it.
// Her own jaw (J: wm.face.jaw) goes on both sides alike: her cheek fuller or leaner, her chin longer or shorter
function wmFaceFront(p, J) {
  var H = WM_FRONT_HEAD, a = Math.atan2((p[1] + 46) / 49, (p[0] - 2) / 35), c = Math.cos(a), s = Math.sin(a);
  J = J || {};
  var ch = J.chin || [0, 0], W = H.wide + 0.5 * (J.cheek || 0);
  if (s < 0) { return [WM_FRONT_X + W * c * (1 - H.temples * s * s), H.at + (H.at - H.top) * s]; }
  var jaw = wmJawFront(W, H.chin + 0.6 * ch[1]), want = Math.acos(Math.min(1, Math.abs(c))) / (Math.PI / 2) * jaw.run[jaw.run.length - 1];
  var i = 1;
  while (i < jaw.run.length - 1 && jaw.run[i] < want) { i++; }
  var f = (want - jaw.run[i - 1]) / ((jaw.run[i] - jaw.run[i - 1]) || 1), q = [mix(jaw.pts[i - 1][0], jaw.pts[i][0], f), mix(jaw.pts[i - 1][1], jaw.pts[i][1], f)];
  return [WM_FRONT_X + (c < 0 ? -1 : 1) * q[0], q[1]];
}
// the hair's mass straight on: over the crown and down both sides to the ears
function wmHairFront(p) {
  var H = WM_FRONT_HEAD, a = Math.atan2((p[1] + 58) / 46, (p[0] + 8) / 45), c = Math.cos(a), s = Math.sin(a);
  return s < 0 ? [WM_FRONT_X + H.temple * c, -57 + (-57 - H.crown) * s] : [WM_FRONT_X + H.temple * c * (1 - 0.15 * s), -57 + 24 * s];
}
// the hair over the brow straight on, point for point as the three-quarter edge is drawn (45 points: its line over the
// brow from the near temple, its outer edge back over the crown, and the short way down and back at the near temple).
// Its line comes down over both temples alike to the tops of her ears (WM_FRONT_HEAD.brow: [half its width there, how
// low, its middle]), so the hair frames her face as an oval, as the references the owner sent have it
function wmEdgeFront(fh) {
  var H = WM_FRONT_HEAD, x = WM_FRONT_X, S = H.brow[0], sy = H.brow[1], mid = H.brow[2] - fh, out = [[x - S, sy]], k;
  for (k = 1; k <= 14; k++) { var a = Math.PI * (1 + k / 14); out.push([x + S * Math.cos(a), sy + (sy - mid) * Math.sin(a)]); }
  for (k = 1; k <= 14; k++) { var b = -Math.PI * (k - 1) / 13; out.push([x + H.temple * Math.cos(b), sy + 6 + (sy + 6 - H.crown) * Math.sin(b)]); }
  out.push([x - H.temple + 1, sy + 4], [x - S - 2, sy + 2]);
  for (k = 1; k <= 14; k++) { out.push([x - S - 2 + 2 * k / 14, sy + 2 - 2 * k / 14]); }
  return out;
}
// the colour of her cheeks straight on: the near cheek's, either side
function wmCheeksFront(lady, paint, f) {
  var lift = f ? Math.max(f.smile || 0, f.laugh || 0, 0.8 * (f.full || 0)) : 0, x = WM_FRONT_X, k = WM_FRONT_HEAD.wide / 31;
  [-1, 1].forEach(function (side) {
    muGlow(x + k * side * 31, -58, 9, 24, "80, 40, 30", 0.1);   // the temple, under the hair
    pen.save(); pen.translate(0, -2.5 * lift);
    if (!lady || !paint || MU.cheek === "soft") { muGlow(x + k * side * 15, -31, 11, 9, "200, 90, 80", (lady ? 0.2 : 0.14) * (1 + 0.3 * lift)); }
    else {
      muGlow(x + k * side * 17, -35, 12, 8, paint.rouge, 0.22, -side * 0.35);
      muGlow(x + k * side * 12, -31, 7, 5.5, paint.rouge, 0.12 + 0.12 * lift);
    }
    pen.restore();
  });
}
// The nose straight on, after the same painting: no line down the bridge but a soft shade down either side of it and
// light down its middle; a round lit tip with a soft shadow under it; each wing a round, drawn by a line that comes
// round its side and runs level under the nostril; the nostrils two dark slots, long, thin and nearly level
// (WM_FRONT_HEAD.nose: how high its tip is)
function wmNoseFront(skin) {
  var X = WM_FRONT_X, y = WM_FRONT_HEAD.nose;
  var DARK = "95, 38, 42", SHADE = "165, 82, 72", LIGHT = "255, 246, 232", INK = "140, 105, 110";
  muGlow(X - 3.6, y - 9, 1.8, 9, SHADE, 0.15); muGlow(X + 3.6, y - 9, 1.8, 9, SHADE, 0.13);   // the bridge's sides
  muGlow(X, y - 8, 1.6, 8, LIGHT, 0.32);                                                    // the light down its middle
  muGlow(X, y + 1.8, 7.5, 1.8, SHADE, 0.24);                                                // the shadow under the nose
  [-1, 1].forEach(function (s) {
    muGlow(X + s * 5.3, y - 0.2, 2.4, 2.2, SHADE, 0.3);                                     // the wing's round
    muGlow(X + s * 3.1, y + 1.1, 2.6, 0.5, DARK, 0.72, -s * 0.045);                         // the nostril
    muInkLine([[X + s * 5.4, y - 2.4, 0.15], [X + s * 6.6, y - 0.6, 0.7], [X + s * 6.2, y + 0.9, 0.8], [X + s * 4.6, y + 1.35, 0.6], [X + s * 2.8, y + 1.45, 0.3]], INK);
  });
  muGlow(X, y - 1.2, 3.2, 2.6, LIGHT, 0.5);                                                 // the tip
}
// The lips straight on, after the same painting, shaped as LIPS_LANNA is so that muLipsPainted paints them, smiles them
// and opens them: wider than the three-quarter mouth slid to the middle had been, the upper lip a bow with its two peaks
// either side of the middle, the lower fuller (WM_FRONT_HEAD.mouth: where the seam is, half its width, how high the upper
// lip is and how deep the lower)
function wmLipsFront() {
  var M = WM_FRONT_HEAD.mouth, X = WM_FRONT_X, y0 = M.y, w = M.half, n = 25, seam = [], top = [], bottom = [], rim = [], k;
  function bow(u) { return u < 0.25 ? 0.8 + 0.2 * u / 0.25 : 1 - Math.pow((u - 0.25) / 0.75, 1.7); }
  for (k = 0; k < n; k++) {
    var x = w * (1 - 2 * k / (n - 1)), u = Math.abs(x) / w;
    seam.push([X + x, y0 - 0.2 + 0.6 * (1 - u * u)]);
    top.push([X + x, y0 - 0.2 - M.upper * bow(u)]);
    bottom.unshift([X + x, y0 - 0.2 + M.lower * Math.pow(1 - u * u, 0.7)]);
    if (u < 0.78) { rim.unshift([X + x, y0 - 0.2 + M.lower * Math.pow(1 - u * u, 0.7) - 1.1]); }
  }
  return {upper: top.concat(seam.slice().reverse()), lower: seam.concat(bottom), seam: seam, rim: rim,
          tickL: [[X + w + 0.9, y0 - 0.7], [X + w, y0 - 0.2], [X + w - 0.9, y0 + 0.1]],
          tickR: [[X - w - 0.9, y0 - 0.7], [X - w, y0 - 0.2], [X - w + 0.9, y0 + 0.1]], px: LIPS_LANNA.px};
}
// the head's own lines, built for her jaw (cw, co, ch, fw) and k (MU.tara)
function wmFaceLine(k, cw, co, ch, fw) {
  return new MPath().M(-26, -73)
    .C(-33 - 3 * k - cw, -52, -32 - 3 * k - cw, -20 + co[1] * 0.5, -14 - 2 * k + co[0], -6 + k + co[1])
    .C(-5 + ch[0] * 0.4, 1 + 1.5 * k + ch[1], 11 + ch[0] * 0.8, 2.5 + 1.5 * k + ch[1], 19.5 + k + ch[0], -2 + k + ch[1])
    .C(29 + 2 * k + fw, -7 + ch[1] * 0.5, 35.5 + 2 * k + fw, -22, 36 + 1.2 * k + fw * 0.5, -38)
    .C(37, -46, 34, -52, 35.5, -59)
    .C(38.5, -70, 37, -86, 27, -92)
    .C(12, -98, -14, -94, -26, -73).Z();
}
// draw(), moved as a feature at "from" goes to "to" straight on, its width times "wide" there, e of the way
function wmMoved(from, to, wide, e, draw) {
  if (!e) { return draw(); }
  pen.save();
  pen.translate(mix(from[0], to[0], e), mix(from[1], to[1], e)); pen.scale(mix(1, wide, e), 1); pen.translate(-from[0], -from[1]);
  try { draw(); } finally { pen.restore(); }
}

// muHead (mural.js), a lady's, with her own outline, hairline, brows and eyes; chin at (0, 0), crown at (0, -100)
function wmHead(look, lady, skin, fc) {
  var hair = look.hair || MU.hair, e = wmFront(), X = WM_FRONT_X;
  var hd = fc.hairdo || (look.bun === "wong" ? "wong" : "mural"), K = WM_KNOTS[hd];
  // a knot on the crown to her middle; one at the nape behind her head, out past her cheek on its own side (WM_FRONT_HEAD.nape)
  var nape = e > 0 && hd !== "wong" && hd !== "lue" && K[1] >= -80;
  if (e) { K = [K[1] < -80 ? mix(K[0], X, e) : mix(K[0], X + WM_FRONT_HEAD.nape, e), K[1], K[2]]; }
  if (fc.tail) { wmTail(K, hair); }                 // behind everything of the head
  if (hd === "wong" || hd === "lue") { if (!WM.crown) { wmWongLoop(K, hair); } muBun(K[0], K[1], K[2], hair, look); }
  var knot = function () {
    muBun(K[0], K[1], K[2], hair, look);
    if (hd === "high") { wmComb(K, "gold"); }
    if (hd === "low") { wmComb(K, "ivory"); }
    muBunGold(K[0], K[1], K[2]);
  };
  if (nape) { knot(); }                             // straight on, a knot at the nape is behind her head
  var mass = new MPath().M(30, -88).C(14, -106, -32, -108, -48, -80).C(-58, -60, -54, -34, -38, -18).C(-30, -12, -20, -14, -14, -22).L(30, -60).Z();
  if (e) { mass = wmToward(mass.subs[0].pts, wmHairFront, e); }
  mShape(mass, hair, 5, 1.3);
  if (hd !== "wong" && hd !== "lue") {
    if (!nape) { knot(); }
    else if (e < 1) { pen.save(); pen.globalAlpha *= 1 - e; knot(); pen.restore(); }   // over the hair as it was, fading as she turns
  }
  var inEar = e * (31 - WM_FRONT_HEAD.wide - 0.5 * ((fc.jaw || {}).cheek || 0));   // straight on, her ears in with her cheeks
  if (e) {                                          // her far ear, its earring and her lock, coming out from behind her cheek
    pen.save(); pen.translate(2 * X - 14 * (1 - e) - inEar, 0); pen.scale(-1, 1);
    var far = MU.ear !== null ? muEarPainted(skin, MU.ear) : [-25, -34];
    muEarring(far[0], far[1]);
    if (fc.jon) { wmJon(hair); }
    pen.restore();
  }
  var k = MU.tara || 0, J = fc.jaw || {}, cw = J.cheek || 0, co = J.corner || [0, 0], ch = J.chin || [0, 0], fw = J.far || 0;
  var face = wmFaceLine(k, cw, co, ch, fw);
  if (e) {                                          // each point of the plain head's to where it is straight on, her own jaw on both sides
    var plain = wmFaceLine(k, 0, [0, 0], [0, 0], 0).subs[0].pts;
    face = wmToward(face.subs[0].pts, function (p, i) { return wmFaceFront(plain[i], J); }, e);
  }
  mFill(face, skin, 7);
  pen.save(); pen.clip(face.path);
  var paint = lady ? muMakeup(look) : null, feel = muFeelOf(look);
  if (e < 1) {
    pen.globalAlpha = 1 - e;
    muCheeks(lady, paint, feel);
    wmMoved([0, 0], [X - 6, 0], 1, e, function () { muFaceLines(look, feel); });
    pen.globalAlpha = 1;
  }
  if (e > 0) { pen.globalAlpha = e; wmCheeksFront(lady, paint, feel); pen.globalAlpha = 1; }
  var mouthAt = [19.7, -24], mouthTo = [X, -24];   // the middle of her lips, and of her mouth straight on
  wmMoved(mouthAt, mouthTo, 1, e, function () {
    if (fc.dimple) {                                // the dimple: a short soft crease beside the near corner
      var up = 1.6 * Math.max(feel.smile || 0, feel.laugh || 0);
      muGlow(7.6, -15.6 - up, 2.2, 3, "150, 70, 55", 0.18);
      mLine(new MPath().M(8.6, -18.4 - up).Q(7.4, -16.2 - up, 8.2, -13.8 - up), "rgba(130, 60, 48, 0.45)", 0.55);
    }
    if (fc.mole) { muGlow(fc.mole[0], fc.mole[1], 1.1, 1.1, "60, 30, 22", 0.85); }
  });
  pen.restore();
  mBrush(face, muInk(muColour(skin)), 1.3);
  var fh = Math.max(-3, Math.min(2, fc.forehead || 0));   // the hairline: up or down in its middle, its ends where they were
  var edge = new MPath().M(-28, -70).C(-18, -89 - fh, 8, -97 - fh, 28, -91).C(16, -104, -24, -106, -40, -86).L(-42, -50).L(-28, -47).C(-31, -56, -31, -64, -28, -70).Z();
  if (e) { var front = wmEdgeFront(fh); edge = wmToward(edge.subs[0].pts, function (p, i) { return front[i]; }, e); }
  mShape(edge, hair, 3, 1.2);
  var strands = new MPath(), sheen = muColour(blend(hair, MU.sheen, 0.4));
  for (var s = 0; s < 12; s++) {
    var u = s / 11;
    strands.M(24 - u * 40, -92 + u * 8).C(4 - u * 30, -100 + u * 2, -30 - u * 10, -94 + u * 14, -46 - u * 2, -70 + u * 26);
  }
  pen.save(); pen.clip(mass.path);
  if (e < 1) { pen.globalAlpha = 1 - e; mLine(strands, sheen, 1.1); }
  if (e > 0) {                                      // straight on, combed up from her hairline on both sides to the crown
    var FB = WM_FRONT_HEAD.brow, up = new MPath(), mid = FB[2] - fh;
    for (s = 0; s < 9; s++) {
      var ang = Math.PI * (1.08 + 0.84 * s / 8), hx = X + FB[0] * Math.cos(ang), hy = FB[1] + (FB[1] - mid) * Math.sin(ang) - 3;
      up.M(hx, hy).Q(X + 1.25 * (hx - X), mix(hy, WM_FRONT_HEAD.crown, 0.8), X + 0.25 * (hx - X), WM_FRONT_HEAD.crown + 5);
    }
    pen.globalAlpha = 0.5 * e; mLine(up, sheen, 1.1);
  }
  pen.restore();
  if (hd === "ipun") { wmIpun(hair); }
  if (hd === "wong") { muBunGold(K[0], K[1], K[2]); }   // a knot on the crown: what hangs from it hangs down the back, over the hair
  if (hd === "lue") { wmLueWrap(fc.wrap || ["#f4f0e6", "#e88aa8"]); }
  if (fc.jon) { wmJon(hair); }
  pen.save(); pen.translate(inEar, 0);
  var lobe = MU.ear !== null ? muEarPainted(skin, MU.ear) : [-25, -34];
  muEarring(lobe[0], lobe[1]);
  pen.restore();
  var E = fc.eyes || {};
  if (e) {                                          // straight on, the painting's eyes (WM_FRONT_HEAD.eye)
    var FE = WM_FRONT_HEAD.eye, own = {tilt: 0, open: 0, flick: 1, liner: 0, iris: 1, crease: 1, long: 1};
    E = Object.assign({}, E);
    Object.keys(FE).forEach(function (key) { E[key] = mix(E[key] === undefined ? own[key] : E[key], FE[key], e); });
  }
  var ey = E.y || 0, el = E.long || 1;
  var EX = WM_FRONT_HEAD.eyes, nearEye = [mix(-4, X - EX, e), -50 + ey - 0.5 * e], farEye = [mix(25, X + EX, e), -51 + ey + 0.5 * e];
  wmEye(nearEye, mix(16, 14, e) * el, -1, lady, paint, feel, E);
  wmEye(farEye, mix(10.5, 14, e) * el, 1, lady, paint, feel, E);
  // the brows: her own arch, length and fall, then the feeling's turn as mural.js gives it; straight on, each over its
  // eye, the two as long
  var B = fc.brows || {}, bl = B.lift || 0, ba = B.arch || 0, bo = B.long || 0, bf = B.fall || 0;
  var painted = MU.nose === "exact" || MU.nose === "exactink";
  wmMoved([-7, -66], [X - EX, -66], 0.82, e, function () {
    pen.save(); muBrowTurn(feel, -7, -67 - bl, 1);
    mLine(new MPath().M(8, -62 - bl).Q(-4, -71 - bl - ba, -22 - bo, -65 - bl + bf), muColour(hair), 1.6 * (B.thick || 1));
    pen.restore();
  });
  wmMoved([26, -64], [X + EX, -66], painted ? 2.3 : 1.38, e, function () {
    pen.save(); muBrowTurn(feel, 28.4, -62.2 - bl, -1);
    if (painted) { pen.translate(0, -bl); muInkLine(NOSE_LANNA.brow, NOSE_PAINT.brow); }
    else { mLine(new MPath().M(17, -62 - bl).Q(26, -69 - bl - ba * 0.7, 35 + bo * 0.4, -65 - bl + bf * 0.7), muColour(hair), 1.6 * (B.thick || 1)); }
    pen.restore();
  });
  // the nose and the mouth: as drawn three-quarter, sliding to her middle as she turns; straight on, the painting's
  // (wmNoseFront, wmLipsFront), sliding with them from where the three-quarter ones were, taking over from them over the
  // middle of the turn (so the two are never seen apart)
  var kind = MU.nose || "now", FH = WM_FRONT_HEAD, fe = clamp((e - 0.3) / 0.4);
  fe = fe * fe * (3 - 2 * fe);
  if (fe < 1) {
    pen.save(); pen.globalAlpha *= 1 - fe;
    wmMoved([22, -31], [X, -31], 1, e, function () {
      muNose(kind, skin, lady);
      if (MU.tara) {
        muGlow(21.5, -27.6, 5, 2.4, "140, 70, 60", 0.14 * MU.tara);
        muInkLine([[18.6, -31.2, 0.25], [19.6, -29.4, 0.35], [21.4, -28.6, 0.4], [23.2, -29.2, 0.35], [24.2, -30.8, 0.25]].map(function (q) { return [q[0], q[1], q[2] * MU.tara]; }), NOSE_PAINT.nostril);
      }
    });
    wmMoved(mouthAt, mouthTo, 1.1, e, function () { muLipsPainted(lady, skin, MU.mouth, paint, feel); });
    pen.restore();
  }
  if (fe > 0) {
    pen.save(); pen.globalAlpha *= fe;
    pen.save(); pen.translate((1 - e) * (22 - X), (1 - e) * (-29 - FH.nose)); wmNoseFront(skin); pen.restore();
    pen.translate((1 - e) * (mouthAt[0] - X), (1 - e) * (mouthAt[1] - FH.mouth.y));
    var three = LIPS_LANNA; LIPS_LANNA = wmLipsFront();
    try { muLipsPainted(lady, skin, null, paint, feel); } finally { LIPS_LANNA = three; }
    pen.restore();
  }
}

// muEye (mural.js) with her own eye (E: wm.face.eyes): its tilt, its opening, its crease, where it looks, its wing
function wmEye(c, long, way, lady, paint, f, E) {
  pen.save();
  pen.translate(c[0], c[1]); pen.rotate(-way * (E.tilt || 0)); pen.translate(-c[0], -c[1]);
  var inner = [c[0] - way * long / 2, c[1] + 1], outer = [c[0] + way * long / 2, c[1] - 0.6];
  var v = function (k) { return f[k] || 0; };
  var wink = Math.max(way < 0 && WM && WM.wink ? clamp(WM.wink) : 0, wmBlink());   // her near eye shutting in a wink; both in a blink
  var wide = Math.max(v("wonder"), v("fear"), 0.6 * v("rapt")) * (1 - wink);
  var down = Math.max(v("lids") * (1 - v("laugh")), 0.3 * v("sad"), wink);
  var open = E.open || 0;
  var upIn = Math.max(-0.6, 4 + open + 1.8 * wide - 4.4 * down - 2.6 * v("anger") - 0.4 * v("worry"));
  var upOut = Math.max(-0.6, 4 + open + 1.8 * wide - 4.4 * down - 1.2 * v("anger") - 1.8 * v("sad") - 1.2 * v("worry"));
  var low = 2.6 + 0.9 * wide - 2.4 * Math.max(0.7 * v("smile"), 0.6 * v("full"), wink), gaze = -1.6 * v("rapt") + 0.9 * v("sad");
  var g = E.gaze || [0, 0], flick = E.flick === undefined ? 1 : E.flick, ahead = 1 - wmFront();   // straight on, she looks at us
  g = [g[0] * ahead, g[1] * ahead]; gaze *= ahead;
  if (paint && MU.cheek === "dancer") {
    muGlow(c[0] + way * long * 0.1, c[1] - 4.5, long * 0.62, 5.5, paint.lid, 0.34);
    muGlow(outer[0], outer[1] - 2.5, long * 0.3, 3.4, paint.lidDeep, 0.32, -way * 0.35);
  }
  if (v("laugh") > 0.5 || wink > 0.85) {           // shut and bowed: laughing, or winking
    mLine(new MPath().M(inner[0], inner[1]).Q(c[0], c[1] - 5, outer[0], outer[1])
      .Q(outer[0] + way * long * 0.25, outer[1] - 1.4, outer[0] + way * long * 0.45 * flick, outer[1] - 3 * flick), "#1c110c", 2.2);
    pen.restore();
    return;
  }
  var white = new MPath().M(inner[0], inner[1])
    .C(inner[0] + way * long * 0.3, c[1] - upIn, outer[0] - way * long * 0.25, c[1] - upOut, outer[0], outer[1])
    .C(outer[0] - way * long * 0.3, c[1] + low, inner[0] + way * long * 0.25, c[1] + low, inner[0], inner[1]).Z();
  pen.fillStyle = muColour("#f6efe2");
  pen.fill(white.path);
  pen.save(); pen.clip(white.path);
  var ix = c[0] + long * 0.22 * ahead + g[0], iy = c[1] - 1.2 + gaze + g[1], ir = (long * 0.15 + 0.9) * (E.iris || 1);
  pen.fillStyle = E.irisColour || "#2a1a12"; pen.beginPath(); pen.arc(ix, iy, ir, 0, 7); pen.fill();
  pen.fillStyle = "#0e0806"; pen.beginPath(); pen.arc(ix, iy, ir * 0.5, 0, 7); pen.fill();
  pen.fillStyle = "rgba(255, 250, 240, 0.85)"; pen.beginPath(); pen.arc(ix + ir * 0.35, iy - ir * 0.35, ir * 0.18, 0, 7); pen.fill();   // the light in it
  var lidTop = c[1] - 0.75 * Math.max(upIn, upOut), lidShade = pen.createLinearGradient(0, lidTop, 0, lidTop + 3.5);
  lidShade.addColorStop(0, "rgba(60, 30, 20, 0.34)"); lidShade.addColorStop(1, "rgba(60, 30, 20, 0)");
  pen.fillStyle = lidShade;
  pen.fillRect(c[0] - long, c[1] - 8, long * 2, 12);
  pen.restore();
  var lid = new MPath().M(inner[0], inner[1])
    .C(inner[0] + way * long * 0.3, c[1] - upIn - 0.4, outer[0] - way * long * 0.25, c[1] - upOut - 0.4, outer[0], outer[1])
    .Q(outer[0] + way * long * 0.25, outer[1] - 1.4, outer[0] + way * long * 0.55 * flick, outer[1] - 4 * flick);
  mLine(lid, "#1c110c", 2.2);
  if (E.liner) {                                    // the wing: on from the lid's flick, thinning to a point
    var o = outer, w = E.liner;
    var wing = new MPath().M(o[0] - way * long * 0.12, o[1] - 0.6)
      .Q(o[0] + way * long * 0.3, o[1] - 1.6 - 1.2 * w, o[0] + way * long * (0.55 + 0.35 * w), o[1] - 4.2 - 2.6 * w)
      .Q(o[0] + way * long * 0.3, o[1] - 0.2, o[0] - way * long * 0.12, o[1] + 0.9).Z();
    pen.fillStyle = "rgba(28, 17, 12, " + (0.55 + 0.35 * w) + ")"; pen.fill(wing.path);
  }
  var crease = E.crease === undefined ? 1 : E.crease, cr = 1.6 * wide + 0.5 * open;
  if (crease > 0) {
    mLine(new MPath().M(inner[0] + way * long * 0.15, c[1] - 5 - cr).C(c[0] - way * long * 0.1, c[1] - 8.5 - cr, outer[0] - way * long * 0.2, c[1] - 8.2 - cr, outer[0] + way * long * 0.05, c[1] - 5 - cr),
      "rgba(70, 35, 25, " + (0.6 * crease) + ")", 0.9);
  }
  var under = new MPath().M(inner[0] + way * long * 0.2, c[1] + low - 0.2).Q(c[0], c[1] + low + 1.2, outer[0] - way * long * 0.05, c[1] + 1);
  mLine(under, "rgba(70, 35, 25, " + (0.5 + 0.2 * (2.6 - Math.min(2.6, low))) + ")", 0.8);
  pen.restore();
}

// the lock before the ear: from the temple's hairline down over the ear's front, its end turned forward in a curl
function wmJon(hair) {
  var lock = new MPath().M(-27.6, -69).C(-30.4, -60, -31.4, -50, -30.4, -42).C(-29.8, -37.5, -27.6, -34.6, -25, -35.4)
    .C(-24.2, -35.8, -24.6, -37, -25.6, -36.8).C(-27.4, -36.8, -28.6, -39.4, -28.8, -42.6).C(-29.2, -51, -28.2, -60, -25.8, -69).Z();
  mShape(lock, hair, 1, 0.7);
  mLine(new MPath().M(-27.6, -64).C(-29.4, -56, -29.8, -48, -29.2, -42), muColour(blend(hair, MU.sheen, 0.45)), 0.5);
}

// ---------- the ways she wears her hair ----------
// The old kit's ways (oldcartoon.js BUN_STYLES, from the hair notebook), drawn on the mural head (fc.hairdo):
//   mural  mural.js's own: the knot low at the back of the head
//   high   the kit's own high bun at the back of the head, a gold comb across it, stones on the comb
//   wong   klao wit wong: a round knot on the crown, a lock looped up standing in its middle, a pin through it
//          (the murals of Wat Phumin and Wat Phra Singh)
//   low    kao phom, the everyday bun at the nape, an ivory comb (wi sap) set across its top
//   ipun   klao i-pun, Princess Dara Rasami's from 1914: the hair over the brow raised on a cushion into a high
//          smooth frame, the knot behind it, a jewelled pin at its top
//   lue    the wong knot under a Tai Lue woman's long head-cloth wound high round the head (fc.wrap: [cloth, stripe])
// fc.tail: a tail of hair hanging straight from the knot down the back, as the murals paint it.
var WM_KNOTS = {mural: [-52, -40, 17], high: [-40, -90, 18], wong: [-14, -108, 15], low: [-50, -27, 16], ipun: [-44, -88, 15], lue: [-14, -106, 15]};
function wmWongLoop(K, hair) {
  var x = K[0] - 1, y = K[1] - K[2] + 4;
  pen.save(); pen.translate(x, y); pen.rotate(-0.12 + 0.04 * Math.sin(clock * 1.3));
  var loop = new MPath().M(-9, 0).C(-10, -21, 10, -23, 9, 0).L(4.5, 0).C(5, -14, -5, -13, -4.5, 0).Z();
  mShape(loop, hair, 2, 1.1);
  mLine(new MPath().M(-6.8, -3).C(-7, -16, 6, -18, 6.8, -3), muColour(blend(hair, MU.sheen, 0.45)), 0.7);
  pen.restore();
}
function wmComb(K, kind) {                          // a comb set across the top of the knot: gold with stones, or ivory
  var x = K[0], y = K[1], r = K[2], R = r * 1.16, w = r * 0.3, out = [], inn = [];
  for (var s = 0; s <= 16; s++) {
    var a = Math.PI * (1.06 + 0.68 * s / 16);
    out.push([x + Math.cos(a) * (R + w / 2), y + 2 + Math.sin(a) * (R + w / 2)]);
    inn.unshift([x + Math.cos(a) * (R - w / 2), y + 2 + Math.sin(a) * (R - w / 2)]);
  }
  var band = new MPath().poly(out.concat(inn), true);
  if (kind === "gold") {
    muGold(band);
    [0.2, 0.5, 0.8].forEach(function (u, i) {
      var a = Math.PI * (1.06 + 0.68 * u);
      muJewel(x + Math.cos(a) * R, y + 2 + Math.sin(a) * R, i === 1 ? 2.6 : 2, MU_STONE[i === 1 ? 0 : 1]);
    });
    return;
  }
  mShape(band, "#efe3c4", 1, 0.8);
  var teeth = new MPath();
  for (s = 1; s < 16; s++) {
    var b = Math.PI * (1.06 + 0.68 * s / 16);
    teeth.M(x + Math.cos(b) * (R - w * 0.1), y + 2 + Math.sin(b) * (R - w * 0.1)).L(x + Math.cos(b) * (R - w * 0.45), y + 2 + Math.sin(b) * (R - w * 0.45));
  }
  mLine(teeth, "#a8987a", 0.45);
}
function wmTail(K, hair) {                          // from under the knot, straight down the back, its end swinging
  var x = K[0] - K[2] * 0.7, y = K[1] + K[2] * 0.5, long = 190, sw = 7 * Math.sin(clock * 1.1 + 0.5);
  var tail = new MPath().M(x - 7, y).C(x - 12, y + long * 0.35, x - 8 + sw * 0.4, y + long * 0.75, x - 2 + sw, y + long)
    .C(x + 1 + sw, y + long * 0.8, x + 6 + sw * 0.3, y + long * 0.4, x + 7, y).Z();
  mShape(tail, hair, 3, 1.1);
  mLine(new MPath().M(x - 2, y + 6).C(x - 5, y + long * 0.4, x - 3 + sw * 0.4, y + long * 0.7, x - 1 + sw, y + long * 0.92), muColour(blend(hair, MU.sheen, 0.4)), 0.7);
  muGold(new MPath().M(x - 7.5, y + 8).L(x + 7.5, y + 8).L(x + 7, y + 13).L(x - 7, y + 13).Z());   // the gold tie
}
function wmIpun(hair) {                             // the raised frame over the brow, its light, its lines; the jewelled pin
  var frame = new MPath().M(-43, -76).C(-47, -100, -22, -116, 4, -116).C(24, -116, 36, -106, 30.5, -90)
    .C(16, -96, -4, -98, -18, -93).C(-30, -89, -38, -84, -43, -76).Z();
  mShape(frame, hair, 3, 1.2);
  pen.save(); pen.clip(frame.path);
  muGlow(6, -110, 26, 9, "255, 235, 210", 0.22);
  var lines = new MPath();
  for (var k = 0; k < 6; k++) { lines.M(28 - k * 3, -92 - k * 3.4).C(16 - k * 4, -110 + k * 1.4, -20 - k * 2, -108 + k * 3, -40 + k, -82 - k * 1.5); }
  mLine(lines, muColour(blend(hair, MU.sheen, 0.4)), 0.7);
  pen.restore();
  mLine(new MPath().M(-2, -106).L(1.5, -122), MU_METAL.base, 1.4);
  for (var s = 0; s < 7; s++) { var a = s / 7 * Math.PI * 2; muJewel(1.5 + Math.cos(a) * 5.6, -124 + Math.sin(a) * 4.6, 1.5, "#d8e6f2"); }
  muJewel(1.5, -124, 2.1, MU_STONE[0]);
}
function wmLueWrap(c) {                             // the head-cloth: high and round, wound in folds, its striped edge, its end tucked
  var wrap = new MPath().M(-47, -58).C(-62, -88, -46, -128, -12, -131).C(20, -133, 41, -112, 33.5, -89)
    .C(14, -95, -12, -93, -28, -81).C(-37, -73, -43, -65, -47, -58).Z();
  mShape(wrap, c[0], 4, 1.2);
  pen.save(); pen.clip(wrap.path);
  var folds = new MPath();
  for (var k = 0; k < 7; k++) { folds.M(-56 + k * 6, -60 - k * 9).C(-30 + k * 4, -86 - k * 7, 6 + k * 3, -100 - k * 5, 40, -96 - k * 6); }
  mLine(folds, muShade(muColour(c[0])), 0.9);
  mLine(new MPath().M(-44, -61).C(-38, -72, -30, -82, -16, -90).C(-2, -96, 18, -96, 34, -92), c[1], 3.2);   // the stripe along its edge
  mLine(new MPath().M(-45, -66).C(-38, -77, -28, -86, -14, -94).C(0, -100, 18, -100, 35, -97), c[1], 0.9);
  pen.restore();
  var end = new MPath().M(8, -127).C(18, -138, 30, -134, 32, -122).C(24, -126, 16, -124, 8, -118).Z();   // the tucked end
  mShape(end, c[0], 2, 1);
  mLine(new MPath().M(10, -124).C(18, -131, 26, -130, 30, -124), c[1], 1.4);
}
WM_HAIR.pins = function (x, y, r) {                 // the old kit's pins: strands of small gold flowers hanging from the knot
  [0, 1, 2].forEach(function (i) {
    var back = y < -100 ? r * 1.9 : 0;              // from a knot on the crown they hang down the back of the head
    var sway = Math.sin(clock * 1.6 + i * 0.7) * (3 + i * 1.5), top = [x - r * 0.55 - back + i * 6, y + r * 0.75 + back * 0.4], long = 42 + i * 9 + back;
    var at = muCurve(top, [top[0] - 2, top[1] + long * 0.35], [top[0] - 4 + sway, top[1] + long * 0.7], [top[0] - 3 + sway * 1.5, top[1] + long]);
    var chain = new MPath(); for (var d = 0; d <= 1; d += 0.1) { var p = at(d); if (d) { chain.L(p[0], p[1]); } else { chain.M(p[0], p[1]); } }
    mLine(chain, MU_METAL.line, 0.5);
    for (d = 0.22; d < 0.95; d += 0.22) { var q = at(d); muBead(q[0], q[1], 1.9); }
    var e = at(1); muGoldFlower(e[0], e[1] + 2, 4.2, MU_STONE[i % 2]);
  });
};
WM_HAIR.loop = function (x, y, r) {                 // the old kit's garland: a loop of jasmine buds hanging under the knot
  var sag = 20 + 3 * Math.sin(clock * 1.4), back = y < -100 ? r * 1.6 : 0;
  for (var k = 0; k <= 16; k++) {
    var u = k / 16, gx = x - r * 1.1 - back + u * r * 1.9, gy = y + r * 0.55 + back * 0.6 + Math.sin(u * Math.PI) * sag;
    wmBud(gx, gy, Math.cos(u * Math.PI) * 1.2);
  }
};
WM_HAIR.flower = function (x, y, r) { wmBloom(x + r * 0.9, y - r * 0.55, 7.5, "#f28fa8"); };   // a flower at the knot's side
// betel: what the grandmothers chew, the lips and gums stained a deep red
MU_MAKEUP.betel = {lips: [132, 34, 40], rouge: "190, 110, 100", lid: "130, 90, 70", lidDeep: "100, 66, 50"};

// ---------- gold that catches the light, stones you see into ----------
// The owner: "give the gems some transparency and sparkle", "make the gold flash in the light as the models move".
// The light is fixed; what moves is the piece. Its phase: how far it has turned (the canvas's rotation where it is
// drawn: an earring swinging, the body swaying, WM_TILT) and where it is (so a flash rolls across a chain, not all at
// once). Near the phase's peak a band of light crosses the gold and a star flares on it.
var WM_TILT = 0;                                    // the woman's sway now, radians
function wmLightPhase(cx, cy) {
  var m = pen.getTransform(), p = m.transformPoint(new DOMPoint(cx, cy)), k = 1920 / pen.canvas.width;
  return 220 * WM_TILT + 6 * Math.atan2(m.b, m.a) + 0.01 * p.x * k + 0.007 * p.y * k;
}
function wmFlash(phase) { return Math.pow(0.5 + 0.5 * Math.cos(phase), 6); }
// a star of light: two thin rays and a glow, added to what is under it
function wmStar(x, y, size, alpha, turn) {
  if (alpha < 0.03) { return; }
  pen.save(); pen.globalCompositeOperation = "lighter"; pen.translate(x, y); pen.rotate(turn || 0);
  var g = pen.createRadialGradient(0, 0, 0, 0, 0, size * 0.45);
  g.addColorStop(0, "rgba(255, 252, 235, " + alpha.toFixed(3) + ")"); g.addColorStop(1, "rgba(255, 240, 200, 0)");
  pen.fillStyle = g; pen.beginPath(); pen.arc(0, 0, size * 0.45, 0, 7); pen.fill();
  pen.fillStyle = "rgba(255, 250, 230, " + alpha.toFixed(3) + ")";
  [0, Math.PI / 2].forEach(function (a) {
    pen.save(); pen.rotate(a); pen.beginPath();
    pen.moveTo(-size, 0); pen.quadraticCurveTo(0, -size * 0.06, size, 0); pen.quadraticCurveTo(0, size * 0.06, -size, 0); pen.fill();
    pen.restore();
  });
  pen.restore();
}
// mural_luxe.js's muGold, with the light's band and its flash
muGold = function (rec, deep) {
  if (!WM) { return WM_KIT.muGold(rec, deep); }
  var xs = [], ys = [];
  rec.subs.forEach(function (s) { s.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  var g = pen.createLinearGradient(x0, y0, x1 + (y1 - y0) * 0.3, y1), L = MU_METAL.light;
  g.addColorStop(0, L[0]); g.addColorStop(0.3, L[1]); g.addColorStop(0.62, deep ? L[3] : L[2]); g.addColorStop(0.85, L[4]); g.addColorStop(1, L[5]);
  pen.fillStyle = g; pen.fill(rec.path);
  if ((x1 - x0) * (y1 - y0) > 900) {
    pen.save(); pen.clip(rec.path); pen.globalCompositeOperation = "multiply"; pen.globalAlpha = 0.35;
    pen.fillStyle = muPattern(0.3); pen.fillRect(x0 - 5, y0 - 5, x1 - x0 + 10, y1 - y0 + 10); pen.restore();
  }
  // the light's band across the piece, where its turn puts it; bright at the flash
  var phase = wmLightPhase((x0 + x1) / 2, (y0 + y1) / 2), fl = wmFlash(phase), u = 0.5 + 0.55 * Math.sin(phase);
  var ax = x0 - 2, ay = y0 - 2, bx = x1 + 2, by = y1 + 2, px = ax + (bx - ax) * u, py = ay + (by - ay) * u;
  var band = pen.createLinearGradient(ax, ay, bx, by), w = 0.22, a = 0.18 + 0.62 * fl;
  function at(v) { return Math.max(0, Math.min(1, v)); }
  band.addColorStop(at(u - w), "rgba(255, 246, 210, 0)");
  band.addColorStop(at(u), "rgba(255, 250, 225, " + a.toFixed(3) + ")");
  band.addColorStop(at(u + w), "rgba(255, 246, 210, 0)");
  pen.save(); pen.clip(rec.path); pen.globalCompositeOperation = "screen"; pen.fillStyle = band;
  pen.fillRect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4); pen.restore();
  mBrush(rec, MU_METAL.line, 0.75);
  var big = Math.max(x1 - x0, y1 - y0);
  if (fl > 0.45 && big > 5) {                       // the flash: a star where the band crosses the piece, if that is on it
    var d = pen.getTransform().transformPoint(new DOMPoint(px, py));
    if (pen.isPointInPath(rec.path, d.x, d.y)) { wmStar(px, py, Math.min(8, 2 + big * 0.18), (fl - 0.45) / 0.55, 0.3); }
  }
};
// mural_luxe.js's muBead, its point of light rolling as it turns, and at the flash a star
muBead = function (x, y, r) {
  if (!WM) { return WM_KIT.muBead(x, y, r); }
  var phase = wmLightPhase(x, y), fl = wmFlash(phase), s = Math.sin(phase);
  var hx = x - r * (0.35 - 0.25 * s), hy = y - r * (0.4 - 0.12 * Math.cos(phase));
  var g = pen.createRadialGradient(hx, hy, r * 0.1, x, y, r);
  g.addColorStop(0, MU_METAL.bead[0]); g.addColorStop(0.35, MU_METAL.bead[1]); g.addColorStop(1, MU_METAL.bead[2]);
  pen.fillStyle = g; pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill();
  var few = (Math.sin(x * 12.99 + y * 78.23) * 43758.5) % 1;   // only a few beads of a strand flare, not all at once
  if (fl > 0.8 && Math.abs(few) < 0.3) { wmStar(hx, hy, r * 2.4, (fl - 0.8) / 0.2, 0.3); }
};
// a stone in its gold: the foil behind it shows through the colour; the table and the facets; the light that comes
// out of it at the far side; the point of light on it, its rim lit, and now and then its sparkle
muJewel = function (x, y, r, colour) {
  if (!WM) { return WM_KIT.muJewel(x, y, r, colour); }
  muGold(new MPath().E(x, y, r * 1.45, r * 1.45));
  var foil = pen.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
  foil.addColorStop(0, "#f8e2a4"); foil.addColorStop(1, MU_METAL.light[1]);
  pen.fillStyle = foil; pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill();
  var body = pen.createRadialGradient(x + r * 0.15, y + r * 0.2, r * 0.05, x, y, r);
  body.addColorStop(0, blend(colour, "#ffffff", 0.08)); body.addColorStop(0.55, colour); body.addColorStop(1, blend(colour, "#000000", 0.6));
  pen.save(); pen.globalAlpha = 0.86; pen.fillStyle = body; pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill(); pen.restore();
  var phase = wmLightPhase(x, y) + clock * 1.3 + x * 0.37 + y * 0.21, tw = Math.pow(Math.max(0, Math.sin(phase)), 10);
  if (r * MU_PX > 2.2) {                            // the cut, where it can be seen: the table, and lines out to the girdle
    var T = [], R = [];
    for (var k = 0; k < 8; k++) {
      var an = Math.PI / 8 + k * Math.PI / 4;
      T.push([x + Math.cos(an) * r * 0.52, y + Math.sin(an) * r * 0.52]); R.push([x + Math.cos(an) * r * 0.97, y + Math.sin(an) * r * 0.97]);
    }
    pen.save(); pen.lineWidth = r * 0.05;
    pen.beginPath(); T.forEach(function (p, i) { if (i) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } }); pen.closePath();
    pen.fillStyle = "rgba(255, 255, 255, " + (0.1 + 0.15 * tw).toFixed(3) + ")"; pen.fill();
    pen.strokeStyle = "rgba(255, 255, 255, 0.4)"; pen.stroke();
    T.forEach(function (p, i) {
      pen.beginPath(); pen.moveTo(p[0], p[1]); pen.lineTo(R[i][0], R[i][1]);
      pen.strokeStyle = i % 2 ? "rgba(255, 255, 255, 0.28)" : "rgba(0, 0, 0, 0.22)"; pen.stroke();
    });
    pen.restore();
  }
  pen.save(); pen.globalCompositeOperation = "screen";   // the light out of its far side
  var out = pen.createRadialGradient(x + r * 0.38, y + r * 0.42, 0, x + r * 0.38, y + r * 0.42, r * 0.55);
  out.addColorStop(0, blend(colour, "#ffffff", 0.45)); out.addColorStop(1, "rgba(0, 0, 0, 0)");
  pen.fillStyle = out; pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill(); pen.restore();
  pen.fillStyle = "rgba(255, 255, 255, 0.9)"; pen.beginPath(); pen.ellipse(x - r * 0.38, y - r * 0.4, r * 0.24, r * 0.15, -0.6, 0, 7); pen.fill();
  pen.save(); pen.beginPath(); pen.arc(x, y, r * 0.86, Math.PI * 1.05, Math.PI * 1.45);
  pen.strokeStyle = "rgba(255, 255, 255, 0.55)"; pen.lineWidth = r * 0.08; pen.lineCap = "round"; pen.stroke(); pen.restore();
  wmStar(x - r * 0.3, y - r * 0.35, r * (1.4 + 2.6 * tw), tw, 0.25);
};

// ---------- her walk, and her sin's sway ----------
// WM_STEP: the look's step while she is drawn (null standing); WM_FEET: her feet drawn so far (the far one, then the near)
var WM_STEP = null, WM_FEET = 0;
function wmWalk() { return WM_STEP === null ? null : WM_STEP * Math.PI * 2; }
function wmSinSway() {                              // how far her sin leans now about her waist: its sway (swish), her walk
  var k = 0, w = wmWalk(), t = clock + WM_OWN;
  if (WM && WM.swish) { k += (WM.swish === true ? 1 : clamp(WM.swish)) * (0.009 * Math.sin(2 * Math.PI * t / 3.7) + 0.004 * Math.sin(2 * Math.PI * t / 1.7 + 2)); }
  if (w !== null) { k += 0.03 * Math.sin(w); }      // its foot after the far foot
  return k;
}
muSin = function (top, hem, waistX, hipX, hemX, design) {
  var k = WM ? wmSinSway() : 0;
  if (!k) { return WM_KIT.muSin(top, hem, waistX, hipX, hemX, design); }
  pen.save(); pen.transform(1, 0, k, 1, -k * top, 0);   // leaning about its top: x by k for each unit down
  try { return WM_KIT.muSin(top, hem, waistX, hipX, hemX, design); } finally { pen.restore(); }
};
muFoot = function (x, y, long, skin) {
  var w = WM ? wmWalk() : null;
  if (w === null) { return WM_KIT.muFoot(x, y, long, skin); }
  var at = w + Math.PI * (WM_FEET++ % 2);           // a foot forward as it lifts, back as it pushes off
  return WM_KIT.muFoot(x + 22 * Math.sin(at), y - 12 * Math.max(0, Math.cos(at)), long, skin);
};

// ---------- the woman ----------
// her sin with a woven foot: the design without the thin bands that cross its foot (the woven hem is their place)
var WM_JOK_SIN = {};
function wmJokSin(n) {
  if (WM_JOK_SIN[n] === undefined) {
    var d = SINS[n], foot = d[1].reduce(function (a, b) { return b[2] > a[2] ? b : a; });
    SINS.push([d[0], d[1].filter(function (b) { return b === foot || b[0] < 0.68; })]);
    WM_JOK_SIN[n] = SINS.length - 1;
  }
  return WM_JOK_SIN[n];
}
// one woman (muralPerson below, for a look with "woman"): her sway, her parasol behind her, mural.js's figure in her
// settings, then what she holds and her crown over everything. opts: as muralPerson takes them.
function wmWoman(x, y, look, wm, opts) {
  var px = (opts && opts.head || 70) / 100;
  if (wm.jok && look.sin !== undefined) { look = Object.assign({}, look, {sin: wmJokSin(look.sin)}); }
  WM = wm; WM_W = {}; WM_LATE = null; WM_OVER = null; WM_FEET = 0;
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun;   // a woman standing walks (a man's legs and one seated, not yet)
  WM_STEP = !look.floor && typeof look.step === "number" ? look.step : null;
  // her sway: slow, about her feet, in her own time; the gold follows it (WM_TILT), also when she stands still (sway false)
  var own = ownTime(look.id || "w");
  WM_OWN = own;
  WM_TILT = 0.006 * Math.sin(2 * Math.PI * (clock + own) / 4.6) + 0.002 * Math.sin(2 * Math.PI * (clock + own) / 1.9);
  pen.save(); pen.translate(x, y); pen.rotate(wm.sway === false ? 0 : WM_TILT); pen.translate(-x, -y);
  if (WM_STEP !== null) { pen.translate(0, -3 * px * (1 + Math.cos(4 * Math.PI * WM_STEP))); }   // walking, she rises as each foot passes under her
  if (wm.holds === "parasol" && wm.pose && wm.pose.near) {
    pen.save(); pen.translate(x, y); pen.scale(px, px); muUpper(WM_A, WM_B, WM_Y0);
    wmParasol(wm.pose.near.w, wm.parasol || ["#c8402e", "#f2c36a"]); pen.restore();
  }
  if (wm.holds === "pots") {                        // the pot behind her, before her body
    pen.save(); pen.translate(x, y); pen.scale(px, px); muUpper(WM_A, WM_B, WM_Y0); wmPot(WM_POTS.back, -1); pen.restore();
  }
  try {
    WM_KIT.muralPerson(x, y, look, opts);
    if (WM_LATE) { var gos = WM_LATE; WM_LATE = null; gos.forEach(function (go) { go(); }); }   // arms still to draw (no belt drew them)
    if (WM_OVER) { var overs = WM_OVER; WM_OVER = null; overs.forEach(function (go) { go(); }); }
    pen.save();                                     // the figure's frame again, for what is over everything
    pen.translate(x, y); pen.scale(MU_PX, MU_PX);
    pen.save(); muUpper(WM_A, WM_B, WM_Y0); wmHolds(look); pen.restore();
    if (wm.crown) {
      var neckX = (WM_A - WM_B) * WM_Y0 + WM_B * WM_CHIN;
      pen.save(); if (MU_BEND) { pen.translate(0, WM_Y0); pen.rotate(MU_BEND); pen.translate(0, -WM_Y0); }
      pen.translate(8 + neckX, WM_CHIN + NECK_DROP[0]); pen.rotate(-0.05); wmCrown(); pen.restore();
    }
    pen.restore();
  } finally { pen.restore(); WM = null; WM_LATE = null; WM_OVER = null; WM_TILT = 0; WM_STEP = null; }
}

// ---------- three more sin ----------
// The dancer's black with red, green and a gold braid; a gold sin with maroon and a maroon foot; maroon with green and a
// gold zigzag. Pushed onto the kit's SINS; WM_SIN names where each went. Then three woven from waist to foot (chevron,
// teal, namLai): the head and its band, then one broad band that her woven jok of the same name covers (wm.jok, taller 1).
function wmAdd(arr, item) { arr.push(item); return arr.length - 1; }
var WM_SIN = {
  braid: wmAdd(SINS, ["#1e1b24", [[0.05, SIN_HEAD, 20], [0.11, SIN_HEAD_BAND, 2.5], [0.24, "#c8303a", 6], [0.3, "#e0b23a", 1.6, "braid"],
                                  [0.42, "#2f7a3e", 9], [0.49, "#e0b23a", 1.6, "roundels"], [0.6, "#c8303a", 5], [0.89, "#c9a23a", 34],
                                  [0.84, "#1e1b24", 2, "braid"], [0.94, "#7a1f2a", 1.6, "diamonds"]]]),
  gold: wmAdd(SINS, ["#d6a446", [[0.05, SIN_HEAD, 20], [0.11, "#7a1f2a", 2.5], [0.2, "#7a1f2a", 3], [0.26, "#f6e3a1", 1.2, "dots"], [0.36, "#7a1f2a", 3],
                                 [0.5, "#f3ead8", 1.4], [0.6, "#7a1f2a", 3], [0.66, "#f6e3a1", 1.2, "zigzag"], [0.89, "#7a1f2a", 34],
                                 [0.83, "#e0b23a", 2, "diamonds"], [0.92, "#e0b23a", 1.6, "roundels"]]]),
  zigzag: wmAdd(SINS, ["#6e1f2a", [[0.05, SIN_HEAD, 20], [0.11, SIN_HEAD_BAND, 2.5], [0.22, "#3f6a3a", 5], [0.28, "#e0b23a", 1.4, "zigzag"], [0.38, "#3f6a3a", 5],
                                   [0.5, "#e9c44a", 1.4], [0.6, "#3f6a3a", 5], [0.66, "#e0b23a", 1.4, "zigzag"], [0.89, "#2a3a2a", 34],
                                   [0.84, "#e0b23a", 1.8, "braid"], [0.94, "#e0b23a", 1.4, "diamonds"]]]),
  chevron: wmAdd(SINS, ["#c23b2e", [[0.05, SIN_HEAD, 20], [0.11, SIN_HEAD_BAND, 2.5], [0.585, "#c23b2e", 163]]]),
  teal: wmAdd(SINS, ["#2c8c8e", [[0.05, SIN_HEAD, 20], [0.11, SIN_HEAD_BAND, 2.5], [0.585, "#2c8c8e", 163]]]),
  namLai: wmAdd(SINS, ["#b8323a", [[0.05, SIN_HEAD, 20], [0.11, SIN_HEAD_BAND, 2.5], [0.585, "#b8323a", 163]]])
};

// ---------- the ten women ----------
// Their faces, each her own head, eyes, brows, nose, mouth and resting look, and her way with her hair.
var WM_FACES = {
  // long and serene, the murals' heaven: a narrow oval, a long chin, high fine brows, long eyes lowered, no crease
  celestial: {mu: {nose: "exact", tara: 0.15, cheek: "swept"}, jaw: {cheek: -2.5, corner: [1.5, 2], chin: [0.5, 4.5], far: -1},
              brows: {lift: 2.5, arch: 2, long: 3, thick: 0.85}, eyes: {long: 1.12, tilt: 0.12, open: -0.6, crease: 0, gaze: [-0.6, 1.4], flick: 1.3},
              mouth: [0.88, 0.92], feel: {lids: 0.45, smile: 0.3}},
  // round and young, shy: full cheeks, a short chin, big round eyes looking down and away, low soft brows, the lock
  maiden:    {mu: {nose: "rosy", tara: 0.95, fuller: 0.32, round: 1, cheek: "swept"}, jaw: {cheek: 3, corner: [-2.5, -1.5], chin: [-1, -1.5], far: 1.5},
              forehead: -1.5, brows: {lift: -1.5, arch: -1.5, long: -2, fall: 1.5, thick: 0.9},
              eyes: {long: 1.1, y: 1, tilt: -0.02, open: 1, crease: 1, gaze: [-1.6, 1.3], iris: 1.2, flick: 0.6},
              mouth: [0.86, 1], feel: {lids: 0.22, smile: 0.12}, jon: true},
  // the dancer: a heart, high cheekbones to a pointed chin, almond eyes winged, sharp brows, looking up at her hand
  dancer:    {mu: {nose: "lanna", tara: 0.3, fuller: 0.26, cheek: "dancer"}, jaw: {cheek: 1.5, corner: [3.5, 1], chin: [2.5, 2.5], far: -0.5},
              brows: {lift: 2, arch: 3, long: 4, fall: -2, thick: 1.15},
              eyes: {long: 1.05, tilt: 0.2, open: 0.3, crease: 0.5, gaze: [1.4, -1.6], liner: 1, flick: 1.4},
              mouth: [1.02, 1.06], feel: {smile: 0.3}, mole: [5.5, -20]},
  // the orchid dancer: round and square, bright, smiling at whoever watches, a dimple
  orchid:    {mu: {nose: "between", tara: 0.7, fuller: 0.2, cheek: "dancer"}, jaw: {cheek: 1.5, corner: [-3, 0], chin: [-0.5, 0.5], far: 1},
              brows: {lift: 1, arch: 1.5, long: 0, thick: 1.05},
              eyes: {long: 1, tilt: 0.08, open: 0.6, crease: 1, gaze: [-2.4, 0], iris: 1.1, liner: 0.45},
              mouth: [1.08, 1], feel: {smile: 0.7, wonder: 0.15}, dimple: true},
  // the princess: long and composed, a high brow, level long brows, heavy lids, looking straight ahead
  princess:  {mu: {nose: "thaisoft", tara: 0.4, fuller: 0.14, round: 0.6, cheek: "swept"}, jaw: {cheek: -1, corner: [0.5, 2], chin: [1, 3], far: 0},
              forehead: 2, brows: {lift: 0.5, arch: -1, long: 5, fall: 0.5, thick: 1.25},
              eyes: {long: 0.98, y: -0.4, tilt: 0.06, open: -0.4, crease: 0.8, gaze: [0.6, 0.2], iris: 0.95, flick: 1.1},
              mouth: [0.94, 0.94], feel: {lids: 0.25, smile: 0.08}},
  // the grandmother: the low knot and its ivory comb, heavy lids, thin falling brows, a gentle smile
  grandmother: {hairdo: "low", mu: {nose: "between", tara: 0.6, fuller: 0.1, round: 1, cheek: "soft"}, jaw: {cheek: 1, corner: [-1, 2.5], chin: [0, 1.5], far: 0.5},
                forehead: 1.5, brows: {lift: 0.5, arch: 0.5, long: -1, fall: 2.5, thick: 0.8},
                eyes: {long: 0.92, y: 0.6, tilt: -0.04, open: -0.9, crease: 1, gaze: [-0.8, 0.4], iris: 0.95, flick: 0.4},
                mouth: [0.95, 0.9], feel: {smile: 0.55, lids: 0.15}},
  // the weaver: the high knot, its comb, a tail; a broad face, a wide smile and a dimple, strong brows
  weaver: {hairdo: "high", tail: true, mu: {nose: "button", tara: 0.75, fuller: 0.22, round: 0.9, cheek: "soft"}, jaw: {cheek: 2.5, corner: [-3, 0.5], chin: [0, 0.5], far: 1.5},
           brows: {lift: 1, arch: 1, long: 1, fall: 0, thick: 1.3},
           eyes: {long: 0.98, tilt: 0.04, open: 0, crease: 1, gaze: [-1, -0.4], iris: 1.05, flick: 0.7},
           mouth: [1.12, 1.05], feel: {smile: 0.9, wonder: 0.1}, dimple: true},
  // the Tai Lue woman: her head-cloth; high cheekbones, long narrow eyes with no crease, level brows
  lue: {hairdo: "lue", wrap: ["#f6f1e6", "#e07a98"], mu: {nose: "low", tara: 0.55, fuller: 0.2, round: 0.8, cheek: "swept"}, jaw: {cheek: 2, corner: [1, 0], chin: [1, 1], far: 0},
        brows: {lift: 0, arch: -0.5, long: 2, fall: 0, thick: 1},
        eyes: {long: 1.06, tilt: 0.12, open: -0.4, crease: 0, gaze: [0.4, 0], iris: 1, flick: 0.9},
        mouth: [0.98, 1], feel: {smile: 0.25}},
  // the lady of the court, 1914: klao i-pun; a narrow oval, thin high brows, a small composed mouth
  court: {hairdo: "ipun", mu: {nose: "lanna", tara: 0.25, fuller: 0.12, round: 0.7, cheek: "swept"}, jaw: {cheek: -2, corner: [1.5, 1.5], chin: [1.5, 2.5], far: -1},
          brows: {lift: 2.5, arch: 2.5, long: 2, fall: 0.5, thick: 0.75},
          eyes: {long: 1, y: -0.2, tilt: 0.05, open: 0.2, crease: 1, gaze: [1, 0], iris: 0.95, flick: 1},
          mouth: [0.84, 0.92], feel: {smile: 0.18}},
  // the girl at the festival: klao wit wong; round and young, big bright eyes looking up
  festival: {hairdo: "wong", mu: {nose: "rosy", tara: 0.85, fuller: 0.28, round: 1, cheek: "swept"}, jaw: {cheek: 1.5, corner: [-1.5, -1], chin: [-0.5, -1], far: 1},
             forehead: -1, brows: {lift: 2, arch: 2, long: -1, fall: -0.5, thick: 0.95},
             eyes: {long: 1.14, tilt: 0.06, open: 1.2, crease: 1, gaze: [-0.8, -1.2], iris: 1.2, flick: 0.9},
             mouth: [0.92, 1.05], feel: {smile: 0.5, wonder: 0.3}}
};
function wmAdd2(a, d) { return [a[0] + d[0], a[1] + d[1]]; }
// The ten: which of the cast each is dressed from (cast), her colours and cloth (look), and her settings (woman).
var MURAL_WOMEN = {
  celestial: {cast: "celestial", say: "a celestial of the murals",
              look: {bun: "wong", shirt: "#f4ecdc", sin: 2, sabai: sabaiLook("chiangKham"), jewels: "gold", bangles: 3, skin: "#e8bf80", hair: "#17110e", makeup: "rose"},
              woman: {face: WM_FACES.celestial, hands: "normal", jok: ["long", "long", 1.6], blouse: "clouds", hair: [], crown: true, armlet: true, earring: "dokhu",
                      pose: {far: {w: [64, -770], elbow: [1, -0.3], wrist: -0.5, fingers: -0.3}, near: {w: [-128, -425], elbow: [-0.4, 1], wrist: 0.2, fingers: 0.3}},
                      scarf: ["#2a2433", "#c8a24a", function (f, n) {
                        return [[f, wmAdd2(f, [-90, 30]), wmAdd2(n, [60, -140]), n, 1.5, 0], [n, wmAdd2(n, [-30, 90]), wmAdd2(n, [40, 230]), wmAdd2(n, [0, 410]), 2, 0.6]];
                      }, 9]}},
  maiden: {cast: "maiden", say: "a maiden with a lotus bud",
           look: {shirt: "#f1d3cf", sin: 0, sabai: sabaiLook("nan"), jewels: "silver", skin: "#eec2a4", hair: "#1d1410", makeup: "rose"},
           woman: {face: WM_FACES.maiden, hands: "normal", jok: ["nan", "nanIndigo", 1.6], blouse: ["dots", "#fbf3ee"], hair: ["jasmine", "gardenia"], earring: "pearl", neck: "pearls",
                   belt: "panneng", chain: false, holds: "lotus", pose: {near: {w: [40, -545], elbow: [-0.2, 1], wrist: -0.25, fingers: 0.75, late: true}}}},
  dancer: {cast: "dancer", say: "a fingernail dancer",
           look: {shirt: "#d4502e", sin: WM_SIN.braid, sabai: sabaiLook("tuapDaeng"), jewels: "gold", bangles: 4, skin: "#c98a5e", hair: "#24150e", makeup: "red"},
           woman: {face: WM_FACES.dancer, jok: ["maechaem", "maechaem", 1.6], blouse: "plain", hair: ["fan", "jasmine"], earring: "dokhu", neck: "pendant", nails: true, chain: false,
                   pose: {far: {w: [72, -780], elbow: [1, -0.1], wrist: -0.9, fingers: -0.5}, near: {w: [-34, -452], elbow: [-1, -0.4], wrist: 0.9, fingers: -0.4}},
                   scarf: ["#2f7a3e", "#b8303a", function (f, n) {
                     return [[wmAdd2(n, [-70, -110]), wmAdd2(n, [-120, 0]), wmAdd2(n, [-40, 200]), wmAdd2(n, [-100, 452]), 1.3, 0.3]];
                   }, 11]}},
  orchid: {cast: "dancer", say: "a dancer with orchids",
           look: {shirt: "#f0c75a", sin: WM_SIN.zigzag, sabai: sabaiLook("lueBands"), jewels: "gold", bangles: 4, skin: "#d9a06c", hair: "#1d1410", makeup: "coral"},
           woman: {face: WM_FACES.orchid, jok: ["maechaem", "maechaemRed", 1.6], blouse: "flowers", hair: ["maiwai", "ueang"], earring: "dokhu", belt: "chains", nails: true, chain: false,
                   pose: {far: {w: [150, -600], elbow: [0.4, 1], wrist: 0.7, fingers: -0.6}, near: {w: [-168, -600], elbow: [-0.4, 1], wrist: 0.7, fingers: -0.6}}}},
  princess: {cast: "lady", say: "a princess of the north",
             look: {shirt: "#f2e2c4", sin: WM_SIN.gold, sabai: sabaiLook("haeOn"), jewels: "gold", bangles: 5, skin: "#e6bd96", hair: "#120e14", makeup: "berry"},
             woman: {face: WM_FACES.princess, hands: "normal", jok: ["nan", "nan", 1.6], blouse: ["dots", "#ffffff"], hair: ["maiwai", "gardenia", "yong"], earring: "dokhu", neck: "sangwan",
                     belt: "panneng", chain: false, holds: "garland", pose: {near: {w: [6, -472], elbow: [-0.6, 1], wrist: 0.5, fingers: 0.5, late: true}}}},
  grandmother: {cast: "grandmother", say: "a grandmother",
                look: {shirt: "#f3efe6", sin: 2, sabai: sabaiLook("maeChaemPat"), jewels: "silver", bangles: 2, skin: "#d4a07a", hair: "#d8d2c8", makeup: "betel", age: 0.7},
                woman: {face: WM_FACES.grandmother, hands: "normal", jok: ["long", "khit", 1.3], blouse: "plain", hair: [], earring: "tube", chain: false, holds: "khan",
                        pose: {near: {w: [34, -468], elbow: [-0.4, 1], wrist: -1, fingers: 0.3, late: true}}}},
  weaver: {cast: "weaver", say: "a weaver",
           look: {shirt: "#34507a", sin: 1, sabai: sabaiLook("khit"), jewels: "silver", bangles: 2, skin: "#d29a6c", hair: "#1d1410", makeup: "coral"},
           woman: {face: WM_FACES.weaver, hands: "normal", jok: ["long", "maechaemRed", 1.7], blouse: "plain", hair: ["flower"], earring: "dokhu", chain: false, holds: "cloth", cloth: "dokLoi",
                   pose: {near: {w: [-30, -540], elbow: [-1, 0.6], wrist: -0.2, fingers: 1, late: true}, far: {w: [120, -560], elbow: [1, 0.6], wrist: 0.9, fingers: 1}}}},
  lue: {cast: "maiden", say: "a Tai Lue woman",
        look: {shirt: "#2e3448", sin: WM_SIN.zigzag, sabai: sabaiLook("lueKhit"), jewels: "silver", bangles: 3, skin: "#dcae84", hair: "#1a1214", makeup: "red"},
        woman: {face: WM_FACES.lue, hands: "normal", jok: ["nan", "lue", 1.6], blouse: "lue", hair: [], earring: "tube", neck: "pendant", chain: false, holds: "parasol", parasol: ["#c8402e", "#f2c36a"],
                pose: {near: {w: [-20, -600], elbow: [-0.3, 1], wrist: -0.6, fingers: 1, late: true}}}},
  court: {cast: "lady", say: "a lady of the court, 1914",
          look: {shirt: "#fbf7ef", sin: WM_SIN.gold, sabai: sabaiLook("yuanChet"), jewels: "gold", bangles: 3, skin: "#ecc8a4", hair: "#141014", makeup: "rose"},
          woman: {face: WM_FACES.court, hands: "normal", jok: ["nan", "maechaem", 1.6], blouse: ["lace", "#d8ccb8"], hair: ["gardenia"], earring: "pearl", neck: "pearls", belt: "panneng", chain: false,
                  holds: "fan", pose: {near: {w: [20, -520], elbow: [-0.5, 1], wrist: 0.2, fingers: 0.6, late: true}}}},
  festival: {cast: "sinuan", say: "a girl at the festival",
             look: {shirt: "#2e2f3e", sin: 2, sabai: sabaiLook("taSaeng"), jewels: "gold", bangles: 4, skin: "#dcae84", hair: "#1d1410", makeup: "rose"},
             woman: {face: WM_FACES.festival, hands: "normal", jok: ["maechaem", "nan", 1.6], blouse: "flowers", hair: ["pins", "flower", "loop"], earring: "dokhu", neck: "pendant", chain: false,
                     holds: "lantern", pose: {near: {w: [50, -470], elbow: [-0.3, 1], wrist: -0.2, fingers: 1, late: true}}}}
};
// The look of one of MURAL_WOMEN, as cast() gives the cast's: name, and more to change or add to it.
// e.g. person(700, GROUND, castWoman("weaver", {size: 1.5, id: "weaver"}))
function castWoman(name, more) {
  var w = MURAL_WOMEN[name];
  if (!w) { checkName("A mural woman", name, MURAL_WOMEN); return cast("lady", more); }
  return cast(w.cast, Object.assign({}, w.look, {woman: name}, more));
}

// ---------- the look's "woman" ----------
var WOMAN_KEYS = {face: true, pose: true, hair: true, crown: true, earring: true, neck: true, belt: true, nails: true, armlet: true,
                  chain: true, blouse: true, scarf: true, holds: true, cloth: true, parasol: true, jok: true, hands: true, sway: true,
                  wink: true, alive: true, front: true, swish: true};
var WM_FACE_KEYS = {mu: true, jaw: true, forehead: true, brows: true, eyes: true, mouth: true, feel: true, jon: true, dimple: true,
                    mole: true, hairdo: true, tail: true, wrap: true};
MURAL_LOOK_KEYS.woman = true;
// mural.js's figure, and a woman (look.woman: a name of MURAL_WOMEN, or her settings) as this file draws her
muralPerson = function (x, y, look, opts) {
  if (!look.woman || WM) { return WM_KIT.muralPerson(x, y, look, opts); }
  var wm = look.woman;
  if (typeof wm === "string") {
    if (!MURAL_WOMEN[wm]) { checkName("A mural woman", wm, MURAL_WOMEN); return WM_KIT.muralPerson(x, y, look, opts); }
    wm = MURAL_WOMEN[wm].woman;
  }
  checkNames("A mural woman's setting", wm, WOMAN_KEYS);
  if (wm.face) { checkNames("A mural woman's face", wm.face, WM_FACE_KEYS); }
  wmWoman(x, y, look, wm, opts);
};

// ========== the men and children (until 2026-11-01, mural_men.js) ==========
// mural_men.js - the mural figure's men and children, each his or her own (2026-10-30), over the women above. The owner: "start on men and children updates to
// the kit", then of the first round, "Change the hands to be like normal hands", "Keep all the characters though", and
// "do it". Dressed by the kit's own record of the north (docs/kit/figures.md, "The dress of the north, by the record")
// and by a notebook of sources on Lanna men and children (docs/kit/figures.md, "The mural men and children").
//
// A man is drawn so when his look has "man", a child when it has "child" (MURAL_LOOK_KEYS): the name of one of
// MURAL_MEN or MURAL_CHILDREN, or the settings themselves, which are mural_women.js's (face, pose, holds, hands, ...)
// and these:
//   face.hairdo  a man's or child's way with the hair: "knot" (the kit's, the hair gathered up at the crown), "cut"
//                ("evenly cut and stands up from his head", Curtis, 1903), "lue" (the Tai Lue turban), and a child's
//                on a shaven head: "juk" (the topknot on the crown), "kae" (a small knot at each side), "pia" (a plait
//                from the topknot), "poy" (the Poy Sang Long boy's headdress), "shaved"; face.moustache, face.stubble
//                (0 to 1), face.pin (a juk's pin: "silver" or "gold"), face.makeup (a name of MU_MAKEUP: a prince's);
//                "flattop": the mural's men, the sides shaven, a short flat top
//   holds        what a man carries: "pole" (khan haap, a basket before and one behind him), "drum" (klong yao),
//                "dap" (a sword in each hand), "stick", "sueng" (the lute); or a woman's (lotus, garland, ...)
//   bag          [cloth, stripes]: the woven shoulder bag (thung yaam)
//   trousers     a colour: tieo sado, wide trousers to the calf; [cloth, flowers]: the mural's knee trousers, printed
//                with flowers, a yellow and a red band at the knee (with patoi: true and tattoo: false)
//   khaoma       [ground, lines]: a checked pha khao ma round his neck, its ends down his chest
//   child        -1 to 0: a child's measure (a child's settings have -1 unless they say)
// castMan(name, more) and castChild(name, more) give the look of one of the ten, as cast() gives the cast's.
// A person without "man", "child" or "woman" is drawn as before.
// e.g. person(700, GROUND, castMan("farmer", {size: 1.4})); person(900, GROUND, castChild("boy", {size: 0.86}))

var MN_LADY = {A: -0.028, B: 0.07, Y0: -430, CHIN: -600, UPPER: 95, FORE: 86};
var MN_MAN = {A: -0.012, B: 0.03, Y0: -440, CHIN: -620, UPPER: 101.6, FORE: 87.4};
var MN_KIT = {muralPerson: muralPerson, wmHead: wmHead};

// the measure of whoever is drawn, for wmWoman's frame and wmElbow's bones
// a look's "man" or "child" given to mural_women.js as its settings; and the measure of whoever is drawn, for
// wmWoman's frame and wmElbow's bones
muralPerson = function (x, y, look, opts) {
  if ((look.man !== undefined || look.child !== undefined) && !look.woman && !WM) {
    var s = mnSettings(look);
    if (s) { look = Object.assign({}, look, {woman: s}); }
  }
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun, m = lady ? MN_LADY : MN_MAN;
  WM_A = m.A; WM_B = m.B; WM_Y0 = m.Y0; WM_CHIN = m.CHIN; WM_UPPER = m.UPPER; WM_FORE = m.FORE;
  var wm = look.woman && typeof look.woman === "object" ? look.woman : null;
  if (wm && !lady) { mnBehind(wm, x, y, (opts && opts.head || 70) / 100); }
  try {
    if (wm && wm.child) { return mnChild(x, y, look, opts, wm.child); }
    return MN_KIT.muralPerson(x, y, look, opts);
  }
  finally { WM_A = MN_LADY.A; WM_B = MN_LADY.B; WM_Y0 = MN_LADY.Y0; WM_CHIN = MN_LADY.CHIN; WM_UPPER = MN_LADY.UPPER; WM_FORE = MN_LADY.FORE; }
};

wmHead = function (look, lady, skin, fc) {
  var grow = WM && WM.child ? 1 + 0.28 * Math.max(0, -WM.child) : 1;     // a child's head, larger on the same chin
  var form = PEOPLE_GROW && lady ? PEOPLE_GROW : null;       // a grown painted woman's head, as PEOPLE_FORM asks
  pen.save(); pen.scale(grow, grow);
  if (form) { pen.scale(form.head / form.wide, form.head); }
  try {
    if (lady && !MN_CHILD_HAIR[fc.hairdo]) { return MN_KIT.wmHead(look, lady, skin, fc); }
    return mnHead(look, lady, skin, fc);
  } finally { pen.restore(); }
};
// the mural's men (owner, 2026-11-05, of a Lanna procession in a temple painting, after five tries: wings, wings turned
// down, a flared cap, combed up, parted): hairdo "flattop", the sides shaven, a short flat top over them; where the hair
// comes out of the head a line, and from it along the side of the head (not over the forehead) short strokes up, about
// 9 units ("make up lines that start from around the temple and go up maybe 10 pixels"; "along the sides and not along
// the forehead"). Drawn after the face and the brows, in place of "kae"'s knots.
function mnFlatTop(hair) {
  var root = muCurve([-50, -80], [-36, -94], [8, -98], [32, -86]);
  var top = new MPath().M(-50, -80).C(-52, -98, -44, -118, -20, -120).C(2, -122, 28, -112, 34, -100)
    .C(35, -94, 34, -90, 32, -86).C(8, -98, -36, -94, -50, -80).Z();
  mShape(top, hair, 4, 1.2);
  pen.save(); pen.clip(top.path);
  var ups = new MPath();
  for (var u = 0; u <= 0.48 + 1e-6; u += 0.08) { var r0 = root(u); ups.M(r0[0], r0[1]).Q(r0[0] - 0.6, r0[1] - 5, r0[0] - 1.8, r0[1] - 9); }
  mLine(ups, muColour(blend(hair, MU.sheen, 0.3)), 0.7);
  pen.restore();
  var pts = []; for (var k = 0; k <= 20; k++) { pts.push(root(k / 20)); }
  mLine(new MPath().poly(pts, false), muInk(muColour(hair)), 1.3);
}
var MN_CHILD_HAIR = {juk: true, kae: true, pia: true, shaved: true, poy: true};
function mnHead(look, lady, skin, fc) {
  var hair = look.hair || MU.hair, hd = fc.hairdo || "knot", jaw = lady || WM.child ? 0 : 4;
  if (hd === "knot" || hd === "lue") { muBun(-6, -108, 13, hair, look); }
  if (hd === "juk" || hd === "pia") { mnJuk(hair, fc.jukFlowers !== false, fc.pin); }
  var shaven = hd === "juk" || hd === "shaved" || hd === "kae" || hd === "pia" || hd === "poy" || hd === "flattop";
  var mass = hd === "cut" ? new MPath().M(32, -86).C(18, -112, -34, -114, -50, -82).C(-58, -62, -54, -40, -40, -30).L(-20, -36).L(30, -64).Z()
    : new MPath().M(30, -88).C(14, -106, -32, -108, -48, -80).C(-58, -60, -54, -34, -38, -18).C(-30, -12, -20, -14, -14, -22).L(30, -60).Z();
  if (shaven) { mFill(mass, blend(skin, hair, 0.22), 5); }   // the shaven scalp, its shadow of hair: one head with the face, no line between
  else { mShape(mass, hair, 5, 1.3); }
  if (hd === "pia") { mnPlait(hair); }                // over the shaven scalp, down the back of the head
  var k = MU.tara || 0, J = fc.jaw || {}, cw = J.cheek || 0, co = J.corner || [0, 0], ch = J.chin || [0, 0], fw = J.far || 0;
  var face = new MPath().M(-26, -73)
    .C(-33 - jaw - 3 * k - cw, -52, -32 - jaw - 3 * k - cw, -20 + co[1] * 0.5, -14 - jaw * 0.5 - 2 * k + co[0], -6 + k + co[1])
    .C(-5 + ch[0] * 0.4, 1 + 1.5 * k + ch[1], 11 + ch[0] * 0.8, 2.5 + 1.5 * k + ch[1], 19.5 + k + ch[0], -2 + k + ch[1])
    .C(29 + jaw * 0.5 + 2 * k + fw, -7 + ch[1] * 0.5, 35.5 + jaw * 0.5 + 2 * k + fw, -22, 36 + 1.2 * k + fw * 0.5, -38)
    .C(37, -46, 34, -52, 35.5, -59)
    .C(38.5, -70, 37, -86, 27, -92)
    .C(12, -98, -14, -94, -26, -73).Z();
  mFill(face, skin, 7);
  pen.save(); pen.clip(face.path);
  var feel = muFeelOf(look), paint = fc.makeup ? MU_MAKEUP[fc.makeup] : null;   // the Poy Sang Long boy is made up as a prince
  muCheeks(!!paint, paint, feel);
  muFaceLines(look, feel);
  if (fc.mole) { muGlow(fc.mole[0], fc.mole[1], 1.1, 1.1, "60, 30, 22", 0.85); }
  if (fc.stubble) { muGlow(14, -10, 22, 12, "70, 50, 40", 0.12 * fc.stubble); }
  pen.restore();
  if (shaven) {                                     // each outline only where it is the head's edge
    mnOutside(mass, function () { mBrush(face, muInk(muColour(skin)), 1.3); });
    mnOutside(face, function () { mBrush(mass, muInk(muColour(skin)), 1.2); });
  } else { mBrush(face, muInk(muColour(skin)), 1.3); }
  if (!shaven) {
    var fh = Math.max(-3, Math.min(2, fc.forehead || 0));
    var edge = hd === "cut"
      ? new MPath().M(-28, -70).C(-18, -92 - fh, 8, -100 - fh, 30, -92).L(32, -100).C(16, -116, -26, -116, -42, -90).L(-44, -56).L(-30, -50).C(-32, -58, -31, -65, -28, -70).Z()
      : new MPath().M(-28, -70).C(-18, -89 - fh, 8, -97 - fh, 28, -91).C(16, -104, -24, -106, -40, -86).L(-42, -50).L(-28, -47).C(-31, -56, -31, -64, -28, -70).Z();
    mShape(edge, hair, 3, 1.2);
    var strands = new MPath(), sheen = muColour(blend(hair, MU.sheen, 0.4)), s, u;
    if (hd === "cut") {                               // short hair standing up: its top edge in small upright strokes
      var top = muCurve([32, -86], [18, -112], [-34, -114], [-50, -82]);
      for (s = 1; s < 30; s++) { var p = top(s / 30), q = top(s / 30 + 0.01), nx = q[1] - p[1], ny = -(q[0] - p[0]), l = Math.hypot(nx, ny) || 1;
        strands.M(p[0] - nx / l * 2, p[1] - ny / l * 2).L(p[0] + nx / l * 2.6, p[1] + ny / l * 2.6); }
      mLine(strands, hair, 1.4);
    } else {
      for (s = 0; s < 12; s++) { u = s / 11; strands.M(24 - u * 40, -92 + u * 8).C(4 - u * 30, -100 + u * 2, -30 - u * 10, -94 + u * 14, -46 - u * 2, -70 + u * 26); }
      pen.save(); pen.clip(mass.path); mLine(strands, sheen, 1.1); pen.restore();
    }
  }
  var lobe = MU.ear !== null ? muEarPainted(skin, MU.ear) : [-25, -34];
  if (lady && !WM.child) { muEarring(lobe[0], lobe[1]); }
  if (look.earplug) { mShape(new MPath().E(lobe[0], lobe[1], 4, 4), look.earplug, 1.2, 1); mLine(new MPath().E(lobe[0], lobe[1], 1.8, 1.8), muInk(muColour(look.earplug)), 0.6); }
  var E = Object.assign({flick: 0.58}, fc.eyes);     // a man's lash runs on less far past the corner
  wmEye([-4, -50 + (E.y || 0)], 16 * (E.long || 1), -1, false, null, feel, E);
  wmEye([25, -51 + (E.y || 0)], 10.5 * (E.long || 1), 1, false, null, feel, E);
  if (hd !== "shaved") {                            // his brows: lower and heavier than a woman's
    var B = fc.brows || {}, bl = B.lift || 0, ba = B.arch || 0, bo = B.long || 0, bf = B.fall || 0;
    pen.save(); muBrowTurn(feel, -7, -65 - bl, 1);
    mLine(new MPath().M(8, -62 - bl).Q(-4, -68 - bl - ba, -22 - bo, -63 - bl + bf), muColour(hair), 2.4 * (B.thick || 1));
    pen.restore();
    pen.save(); muBrowTurn(feel, 28.4, -62.2 - bl, -1);
    mLine(new MPath().M(17, -62 - bl).Q(26, -67 - bl - ba * 0.7, 35 + bo * 0.4, -63 - bl + bf * 0.7), muColour(hair), 2.4 * (B.thick || 1));
    pen.restore();
  }
  muNose(MU.nose || "now", skin, false);
  if (fc.moustache) {                               // a fine moustache, as the murals give some men
    mLine(new MPath().M(9, -19).Q(16, -23, 22, -20.5).Q(26, -22.5, 28.5, -19.5), muColour(hair), 1.4 * fc.moustache);
  }
  muLipsPainted(!!paint || (lady && !WM.child), skin, MU.mouth, paint, feel);
  if (hd === "kae") { mnKae(hair); }
  if (hd === "flattop") { mnFlatTop(hair); }
  if (hd === "lue") { wmLueWrap(fc.wrap || ["#f6f1e6", "#c8303a"]); }
  if (hd === "poy") { mnPoy(fc.poy || ["#e8508a", "#f2c33a"]); }
  if (look.turban && !shaven && hd !== "lue") { mnTurban(look.turban, face, mass, edge); }
}
// the head-cloth wound round below the knot, as mural.js draws it, its fringed ends at the back
function mnTurban(colour, face, mass, edge) {
  var head = new Path2D(); head.addPath(face.path); head.addPath(mass.path); if (edge) { head.addPath(edge.path); }
  var band = new MPath().M(-48, -78).C(-20, -96, 18, -100, 48, -88).L(48, -72).C(14, -88, -22, -84, -46, -62).Z();
  pen.save(); pen.clip(head);
  mShape(band, colour, 3, 1.2);
  mLine(new MPath().M(-38, -76).C(-14, -88, 12, -90, 44, -82).M(-40, -68).C(-16, -80, 10, -82, 44, -77), muShade(muColour(colour)), 0.8);
  pen.restore();
  var knot = new MPath().M(-44, -72).C(-60, -82, -66, -70, -62, -58).C(-58, -60, -52, -62, -46, -62).Z();
  mShape(knot, colour, 2, 1.2);
  var sway = Math.sin(clock * 1.3) * 3, ends = new MPath();      // its two ends hanging, fringed
  ends.M(-58, -64).C(-66, -48, -70 + sway * 0.5, -30, -66 + sway, -12).L(-58 + sway, -14).C(-60, -32, -56, -48, -52, -62).Z();
  mShape(ends, colour, 2, 1);
  var fr = new MPath();
  for (var f = 0; f <= 5; f++) { var fx = -66 + sway + f * 1.6; fr.M(fx, -13).L(fx + sway * 0.2, -6); }
  mLine(fr, colour, 0.7);
}
// a child's topknot on a shaven head: a small knot at the crown, tied, with a ring of jasmine buds round it
function mnJuk(hair, flowers, pin) {
  mShape(new MPath().E(-2, -104, 9, 8), hair, 2, 1.1);
  if (pin) { var was = MU_METAL; MU_METAL = MU_METALS[pin] || MU_METALS.silver; mLine(new MPath().M(-16, -106).L(12, -112), MU_METAL.base, 1.6); muBead(13, -112, 1.8); MU_METAL = was; }
  mShape(new MPath().M(-6, -112).C(-4, -124, 6, -124, 6, -112).Z(), hair, 1, 1);
  mLine(new MPath().M(-9, -100).Q(-2, -97, 6, -100), muColour("#c8303a"), 1.6);   // the red cord it is tied with
  if (flowers && !pin) { for (var k = 0; k < 10; k++) { var a = Math.PI * (1.05 + 0.9 * k / 9); wmBud(-2 + Math.cos(a) * 11, -103 + Math.sin(a) * 9, a); } }
}

// his face's own names, known to the check of a face (mural_women.js WM_FACE_KEYS)
["moustache", "stubble", "jukFlowers"].forEach(function (k) { WM_FACE_KEYS[k] = true; });
// draw() with the pen kept outside "rec" (a path): what it draws shows only off it
function mnOutside(rec, draw) {
  pen.save(); var p = new Path2D(); p.rect(-400, -400, 800, 800); p.addPath(rec.path); pen.clip(p, "evenodd"); draw(); pen.restore();
}

// ---------- what a man carries ----------
// wm.holds for a man (MN_HOLDS), drawn as wmHolds draws a woman's, in his upper frame; "pole" hangs one basket behind
// him (mnBehind, before his body). wm.bag: the woven shoulder bag (thung yaam) across him, its strap over the far shoulder.
// the pha khao ma round his neck (wm.khaoma [ground, lines], owner, 2026-11-05, "Round the neck"): a check of lines
// every 9 and a fine white line every 27, slung round the neck below it, its two ends down his chest, a short fringe
function mnCheck(shape, ground, line) {
  mFill(shape, ground, 3);
  pen.save(); pen.clip(shape.path);
  pen.globalAlpha = 0.55; pen.fillStyle = line;
  for (var x = -120; x < 120; x += 9) { pen.fillRect(x, -700, 2.4, 400); }
  for (var y = -700; y < -300; y += 9) { pen.fillRect(-120, y, 240, 2.4); }
  pen.globalAlpha = 0.5; pen.fillStyle = "#f2ead6";
  for (x = -116; x < 120; x += 27) { pen.fillRect(x, -700, 1.2, 400); }
  for (y = -696; y < -300; y += 27) { pen.fillRect(-120, y, 240, 1.2); }
  pen.globalAlpha = 1; pen.restore();
  mBrush(shape, muInk(muColour(ground)), 1.1);
}
function mnKhaoMa(c) {
  mnCheck(new MPath().M(-76, -574).C(-60, -548, 20, -546, 50, -570).L(46, -556).C(14, -532, -54, -534, -70, -556).Z(), c[0], c[1]);
  mnCheck(new MPath().M(-58, -556).C(-56, -520, -50, -480, -52, -452).L(-36, -450).C(-36, -480, -40, -520, -42, -550).Z(), c[0], c[1]);
  mnCheck(new MPath().M(20, -548).C(22, -520, 28, -496, 30, -470).L(44, -474).C(40, -500, 36, -526, 36, -556).Z(), c[0], c[1]);
  var fr = new MPath();
  for (var k = 0; k < 6; k++) { fr.M(-52 + k * 3, -452).L(-53 + k * 3, -442).M(30 + k * 2.6, -471).L(31 + k * 2.6, -461); }
  mLine(fr, c[1], 0.8);
}
var MN_SHOULDER = {near: [-70, -562], far: [44, -560]};
var MN_KIT_HOLDS = wmHolds;
wmHolds = function (look) {
  if (WM.khaoma) { mnKhaoMa(WM.khaoma); }
  if (WM.bag) { mnBag(WM.bag); }
  var h = WM.holds, w = WM_W.near, f = WM_W.far;
  if (MN_HOLDS[h]) { MN_HOLDS[h](w, f); return; }
  MN_KIT_HOLDS(look);
};
// the forearm's way from its elbow to the wrist (side "near" or "far"), from the pose: a blade or a shaft goes on along it
function mnForearm(side) {
  var p = WM.pose && WM.pose[side], w = WM_W[side];
  if (!p || !w) { return [0, -1]; }
  var e = wmElbow(MN_SHOULDER[side], p.w, p.elbow), l = Math.hypot(w[0] - e[0], w[1] - e[1]) || 1;
  return [(w[0] - e[0]) / l, (w[1] - e[1]) / l];
}
var MN_HOLDS = {
  // khan haap: the carrying pole on his near shoulder, a basket at each end on three cords, swinging
  pole: function (w) {
    var A = [-175, -552], B = [150, -598];
    mLine(new MPath().M(A[0], A[1]).L(B[0], B[1]), "#8a6a3a", 7);
    mLine(new MPath().M(A[0], A[1] - 2.5).L(B[0], B[1] - 2.5), "#c09a5a", 1.6);
    mnBasket(B, 1);
  },
  // klong yao: the long drum slung before him, its head forward under his hands, its foot flaring behind
  drum: function (w, f) {
    var head = [118, -478], foot = [-130, -420], sway = Math.sin(clock * 2) * 2;
    mLine(new MPath().M(MN_SHOULDER.far[0], MN_SHOULDER.far[1] + 6).Q(-10, -470, foot[0] + 40, foot[1] - 6), "#7a2a22", 3);   // its strap
    var body = new MPath().M(head[0], head[1] - 26).C(60, -505 + sway, 0, -462, foot[0] + 30, foot[1] - 10)
      .C(foot[0] + 8, foot[1] - 26, foot[0] - 6, foot[1] - 30, foot[0] - 8, foot[1] - 30).L(foot[0] - 4, foot[1] + 28)
      .C(foot[0] + 10, foot[1] + 22, foot[0] + 26, foot[1] + 14, foot[0] + 34, foot[1] + 12).C(0, -430, 60, -448 + sway, head[0], head[1] + 26).Z();
    mShape(body, "#a8462a", 8, 1.3);
    var bands = new MPath();
    [0.15, 0.3, 0.55].forEach(function (u) { var x = head[0] + (foot[0] + 30 - head[0]) * u, r = 26 - 14 * u; bands.M(x, head[1] + (foot[1] - head[1]) * u - r).L(x, head[1] + (foot[1] - head[1]) * u + r); });
    mLine(bands, "#e0b23a", 2.2);
    mShape(new MPath().E(head[0], head[1], 9, 27), "#e8d8b0", 2, 1.2);    // the skin of its head
    var lace = new MPath();
    for (var k = 0; k < 7; k++) { var a = -1.2 + k * 0.4; lace.M(head[0] + Math.cos(a) * 9, head[1] + Math.sin(a) * 27).L(head[0] - 34, head[1] + Math.sin(a) * 20); }
    mLine(lace, "#5a3a20", 0.8);
  },
  // fon dap: a sword in each hand, the blade on along the forearm, curved a little at its tip
  dap: function (w, f) {
    [["near", w], ["far", f]].forEach(function (s) {
      if (!s[1]) { return; }
      var d = mnForearm(s[0]), nx = -d[1], ny = d[0], p = s[1], L = 150;
      var tip = [p[0] + d[0] * L + nx * 10, p[1] + d[1] * L + ny * 10];
      mLine(new MPath().M(p[0] - d[0] * 18, p[1] - d[1] * 18).L(p[0] + d[0] * 14, p[1] + d[1] * 14), "#3a2418", 6);   // the hilt
      muGold(new MPath().E(p[0] + d[0] * 16, p[1] + d[1] * 16, 5, 5));
      var blade = new MPath().M(p[0] + d[0] * 18 + nx * 3, p[1] + d[1] * 18 + ny * 3)
        .Q(p[0] + d[0] * L * 0.6 + nx * 6, p[1] + d[1] * L * 0.6 + ny * 6, tip[0], tip[1])
        .Q(p[0] + d[0] * L * 0.6 - nx * 2, p[1] + d[1] * L * 0.6 - ny * 2, p[0] + d[0] * 18 - nx * 3, p[1] + d[1] * 18 - ny * 3).Z();
      muInGold(function () { var was = MU_METAL; MU_METAL = MU_METALS.silver; muGold(blade); MU_METAL = was; });
    });
  },
  // a walking stick from his near hand to the ground
  stick: function (w) { mLine(new MPath().M(w[0] - 2, w[1] - 16).Q(w[0] + 8, w[1] + 200, w[0] + 26, -6), "#6a4a2c", 4.4); },
  // sueng: the Lanna lute across his body, its round body at his hip, the neck up to his far hand
  sueng: function (w, f) {
    var c = [w[0] + 6, w[1] + 6], top = f ? [f[0] + 30, f[1] - 40] : [c[0] + 150, c[1] - 170];
    mLine(new MPath().M(c[0], c[1]).L(top[0], top[1]), "#6a3a1c", 7);
    mShape(new MPath().M(top[0] - 6, top[1] + 4).C(top[0] + 4, top[1] - 16, top[0] + 18, top[1] - 22, top[0] + 26, top[1] - 16).L(top[0] + 4, top[1] + 8).Z(), "#6a3a1c", 1, 1);
    mShape(new MPath().E(c[0], c[1], 30, 30), "#a8622a", 6, 1.3);
    mShape(new MPath().E(c[0] + 4, c[1] - 2, 9, 9), "#3a2010", 1, 0.8);
    mLine(new MPath().M(c[0] + 8, c[1] - 6).L(top[0], top[1]).M(c[0] + 4, c[1] - 8).L(top[0] - 3, top[1] - 2), "#e8dcc0", 0.6);
  }
};
// a woven basket on three cords from the pole's end at P; way 1 before him, -1 behind
function mnBasket(P, way) {
  var sway = Math.sin(clock * 1.4 + (way > 0 ? 0 : 1.6)) * 6, b = [P[0] + sway, P[1] + 70];
  mLine(new MPath().M(P[0], P[1]).L(b[0] - 26, b[1]).M(P[0], P[1]).L(b[0], b[1] - 4).M(P[0], P[1]).L(b[0] + 26, b[1]), "#5a4028", 0.9);
  var basket = new MPath().M(b[0] - 30, b[1]).L(b[0] + 30, b[1]).C(b[0] + 30, b[1] + 40, b[0] + 22, b[1] + 56, b[0], b[1] + 58).C(b[0] - 22, b[1] + 56, b[0] - 30, b[1] + 40, b[0] - 30, b[1]).Z();
  mShape(basket, "#c8a060", 6, 1.2);
  pen.save(); pen.clip(basket.path);
  var weave = new MPath();
  for (var y = b[1] + 6; y < b[1] + 58; y += 6) { weave.M(b[0] - 32, y).Q(b[0], y + 4, b[0] + 32, y); }
  for (var x = b[0] - 28; x < b[0] + 30; x += 7) { weave.M(x, b[1]).L(x * 0.8 + b[0] * 0.2, b[1] + 58); }
  mLine(weave, "#8a6a3a", 0.7);
  pen.restore();
  mShape(new MPath().E(b[0], b[1], 30, 6), "#a8804a", 2, 1);
}
// the thung yaam: a woven cloth bag hanging at his near hip from a strap over the far shoulder, its fringe, its stripes
function mnBag(c) {
  mLine(new MPath().M(36, -572).C(10, -540, -30, -480, -58, -432), c[0], 5);
  var bag = new MPath().M(-82, -436).L(-36, -432).L(-38, -366).L(-84, -370).Z();
  mShape(bag, c[0], 6, 1.2);
  pen.save(); pen.clip(bag.path);
  var st = new MPath(); for (var y = -428; y < -366; y += 9) { st.M(-90, y).L(-30, y + 2); }
  mLine(st, c[1], 2.4);
  pen.restore();
  var fr = new MPath(); for (var x = -82; x <= -38; x += 3.4) { fr.M(x, -368 + (x + 60) * 0.06).L(x + Math.sin(clock * 2 + x) * 0.8, -356 + (x + 60) * 0.06); }
  mLine(fr, c[1], 0.8);
}
// before his body: the basket at the pole's far end, behind him
function mnBehind(wm, x, y, px) {
  if (wm.holds !== "pole") { return; }
  pen.save(); pen.translate(x, y); pen.scale(px, px); muUpper(MN_MAN.A, MN_MAN.B, MN_MAN.Y0);
  mnBasket([-175, -552], -1); pen.restore();
}
["bag", "khaoma"].forEach(function (k) { WOMAN_KEYS[k] = true; });

// ---------- children ----------
// A child's measure on the mural figure, as the old figure has it at build -1 (docs/kit/figures.md, "A little boy and a
// little girl"): the head 1.28 of its size on the same chin, the legs 0.85 as long, all above the waist 0.88. The figure
// is drawn twice through clips: below the waist line squashed about the feet, above it scaled about the waist and set
// on the shorter legs; the two meet at the waist. build: -1 to 0.
var MN_WAIST = -430;
function mnChild(x, y, look, opts, build) {
  var b = Math.max(0, -build), legs = 1 - 0.15 * b, trunk = 1 - 0.12 * b, px = (opts && opts.head || 70) / 100, W = MN_WAIST * px;
  var seam = y + W * legs;
  pen.save(); pen.beginPath(); pen.rect(x - 4000, seam - 1, 8000, 8000); pen.clip();         // the legs
  pen.translate(x, y); pen.scale(trunk, legs); pen.translate(-x, -y);
  MN_KIT.muralPerson(x, y, look, opts); pen.restore();
  pen.save(); pen.beginPath(); pen.rect(x - 4000, seam - 8000, 8000, 8000); pen.clip();      // all above the waist
  pen.translate(x, seam); pen.scale(trunk, trunk); pen.translate(-x, -(y + W));
  MN_KIT.muralPerson(x, y, look, opts); pen.restore();
}
// A girl's blouse without a woman's bust: mural.js's blouse (mShape(blouse, shirt, 12, 1.5)) drawn with its front
// straight from the waist to the shoulder. (The sources say nothing of what small girls wore over the chest: this is the
// kit's girl's blouse made a child's, not a record.)
var MN_KIT_SHAPE = mShape;
mShape = function (rec, colour, grain, width) {
  if (WM && WM.child && grain === 12 && width === 1.5 && rec.subs.length === 1 && rec.subs[0].pts.length > 20) {
    var lneck = muRing(2.57, -586, 15.7, 4), H = Math.PI / 2, lL = lneck(-H), lR = lneck(H);
    var flat = new MPath().M(lL[0], lL[1])
      .C(-30, -582, -50, -578, -58, -562).C(-64, -548, -62, -520, -58, -498).C(-52, -476, -42, -458, -40, -436)
      .L(-40, -424).L(32, -424)
      .C(30, -444, 32, -470, 36, -496).C(40, -522, 38, -546, 32, -562)
      .C(26, -574, 22, -580, lR[0], lR[1]);
    muRingArc(lneck, H, -H).forEach(function (q) { flat.L(q[0], q[1]); });
    flat.Z();
    return MN_KIT_SHAPE(flat, colour, grain, width);
  }
  return MN_KIT_SHAPE(rec, colour, grain, width);
};
// kae: a small round knot of hair at each side of the shaven head, tied with red
function mnKae(hair) {
  [[-36, -76, 6.5], [24, -94, 5]].forEach(function (t) {   // a small round knot at each side of the head, tied with red under it
    mShape(new MPath().E(t[0], t[1], t[2], t[2] * 0.9), hair, 1, 1);
    mLine(new MPath().M(t[0] - t[2] * 0.7, t[1] + t[2] * 0.75).Q(t[0], t[1] + t[2] * 1.05, t[0] + t[2] * 0.7, t[1] + t[2] * 0.75), muColour("#c8303a"), 1.3);
  });
}
// pia: a plait from the topknot down the back of the head, tied with red at its end
function mnPlait(hair) {
  var sw = Math.sin(clock * 1.2) * 3;
  for (var k = 0; k < 9; k++) { mShape(new MPath().E(-14 - k * 3.5 + sw * k / 9, -100 + k * 9, 5, 5.5, 0.4), hair, 1, 0.8); }
  mLine(new MPath().M(-46 + sw, -20).L(-44 + sw, -12), muColour("#c8303a"), 2.2);
}
// the Poy Sang Long boy's headdress: a tall wrapped turban of bright silk, its end standing up and curling back, a gold
// band, flowers and gold flames on it
function mnPoy(c) {
  var wrap = new MPath().M(-50, -60).C(-64, -96, -44, -130, -10, -134).C(22, -136, 42, -116, 34, -88)
    .C(14, -94, -14, -92, -30, -80).C(-40, -72, -46, -66, -50, -60).Z();
  mShape(wrap, c[0], 4, 1.2);
  pen.save(); pen.clip(wrap.path);
  var folds = new MPath();
  for (var k = 0; k < 6; k++) { folds.M(-60 + k * 7, -64 - k * 10).C(-28 + k * 5, -92 - k * 7, 8 + k * 3, -104 - k * 5, 44, -98 - k * 6); }
  mLine(folds, muShade(muColour(c[0])), 0.9);
  pen.restore();
  mShape(new MPath().M(-24, -128).C(-34, -170, -8, -196, 4, -186).C(-6, -174, -10, -150, -2, -132).Z(), c[0], 2, 1.1);
  muInGold(function () { muGold(new MPath().M(-44, -80).C(-20, -96, 14, -100, 34, -92).L(34, -86).C(14, -94, -20, -90, -42, -74).Z()); });
  [[-36, -112, "#f6f1e6"], [-20, -124, "#e8508a"], [-4, -128, "#f2c33a"], [12, -122, "#f6f1e6"], [-30, -96, "#c8303a"]].forEach(function (f) { wmBloom(f[0], f[1], 7, f[2]); });
  for (var s = 0; s < 4; s++) { var a = -2.2 + s * 0.35; muFlame(-10 + Math.cos(a) * 30, -150 + Math.sin(a) * 10, 14, 3, 1, a + 1.7); }
}
// ---------- trousers ----------
// tieo sado: wide trousers to the calf (wm.trousers, a colour). mural.js draws each leg as its foot (muFoot) and then
// its tube (mFill); after the tube, a wide leg of the trousers from the cloth's hem to the calf. trousers [cloth,
// flowers]: the mural's knee trousers (owner, 2026-11-05, "Yes, pink + blue"), small five-petalled flowers over the
// cloth and a yellow and a red band at the knee; with patoi the cloth hitched over his hips is the same, printed alike
// (and tattoo false: the tattoo is drawn after the leg).
var MN_LEG = false, MN_KIT_FOOT = muFoot, MN_KIT_FILL = mFill;
muFoot = function (x, y, len, skin) { var r = MN_KIT_FOOT(x, y, len, skin); MN_LEG = !!(WM && WM.trousers); return r; };   // the leg's tube is the next fill after its foot
// small flowers over a shape in t[1], a row at a time, every other row shifted, each placed by a hash (the same each frame)
function mnPrint(rec, t) {
  var xs = [], ys = [];
  rec.subs.forEach(function (sub) { sub.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), n = 0;
  pen.save(); pen.clip(rec.path);
  for (var y = y0 + 8; y < y1; y += 22) {
    for (var x = x0 - 6 + (n % 2) * 11; x < x1 + 6; x += 22) {
      var k = weaveHash(Math.round(x), Math.round(y), 3), fx = x + (k - 0.5) * 6, fy = y + (weaveHash(Math.round(y), Math.round(x), 4) - 0.5) * 6;
      for (var p = 0; p < 5; p++) { var a = p * 1.2566 + k * 3; muGlow(fx + Math.cos(a) * 3.2, fy + Math.sin(a) * 3.2, 2.4, 2.4, muRgb(t[1]), 0.95); }
      muGlow(fx, fy, 1.4, 1.4, "240, 200, 80", 1);
    }
    n++;
  }
  pen.restore();
}
mFill = function (rec, colour, grain) {
  MN_KIT_FILL(rec, colour, grain);
  if (!MN_LEG) { return; }
  MN_LEG = false;
  var t = WM.trousers, printed = Array.isArray(t), cloth = printed ? t[0] : t, w = printed ? 2 : 0;
  var xs = [], ys = [];
  rec.subs.forEach(function (sub) { sub.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), top = Math.min.apply(null, ys), hem = printed ? -215 : -150, mid = (x0 + x1) / 2;
  var leg = new MPath().M(mid - 24, top).L(mid + 24, top).C(mid + 30, top + 80, mid + 30 + w, hem - 30, mid + 28 + w, hem)
    .Q(mid, hem + 6, mid - 28 - w, hem).C(mid - 30 - w, hem - 30, mid - 30, top + 80, mid - 24, top).Z();
  MN_KIT_SHAPE(leg, cloth, 8, 1.3);
  if (printed) { mnPrint(leg, t); }
  pen.save(); pen.clip(leg.path);
  if (printed) {                                    // the bands at the knee
    pen.fillStyle = "#e8b62e"; pen.fillRect(mid - 40, hem - 16, 80, 8);
    pen.fillStyle = "#c23b2e"; pen.fillRect(mid - 40, hem - 8, 80, 12);
  }
  mLine(new MPath().M(mid - 6, top + 10).C(mid - 2, top + 80, mid - 8, hem - 40, mid - 4, hem).M(mid + 14, top + 30).C(mid + 16, top + 90, mid + 12, hem - 30, mid + 16, hem), muShade(muColour(cloth)), 1);
  pen.restore();
};
["child", "trousers"].forEach(function (k) { WOMAN_KEYS[k] = true; });
["makeup", "poy", "pin"].forEach(function (k) { WM_FACE_KEYS[k] = true; });

// ---------- the six men and the four children ----------
// Each: which of the cast he or she is dressed from (cast), what is said of them (say), colours and cloth (look), and
// the settings (as look.woman's: face, pose, holds, bag, trousers, hands, child).
var MN_BARE = {bare: true, turban: "#b8294a", sabai: ["#f2ead6", "#e8dcc0", "tuapSaeng", "own"], sarong: "#5a3f32", patoi: 0.75, tattoo: true};
var MURAL_MEN = {
  farmer: {cast: "farmer", say: "a farmer with his baskets", look: {skin: "#b97e54"},
           man: {hands: "normal", face: {hairdo: "knot", mu: {nose: "now", tara: 0.2}, jaw: {cheek: 1, corner: [2, 2], chin: [1, 2]}, brows: {lift: 0, arch: 0.5, thick: 1.1}, eyes: {gaze: [1.2, 0.2]}, feel: {smile: 0.25}},
                 holds: "pole", pose: {near: {w: [60, -588], elbow: [-0.2, 1], wrist: -0.6, fingers: 1, late: true}}}},
  drummer: {cast: "farmer", say: "a long-drum player", look: Object.assign({}, MN_BARE, {skin: "#c48a5c", turban: "#c8303a", sarong: "#2f3f6e"}),
            man: {hands: "normal", face: {hairdo: "knot", mu: {nose: "ref", tara: 0.4}, jaw: {cheek: 2, corner: [-2, 1], chin: [0, 1]}, brows: {lift: 1, arch: 1.5, thick: 1.2}, eyes: {gaze: [-1.2, -0.4], open: 0.6}, feel: {smile: 0.8}},
                  holds: "drum", pose: {far: {w: [112, -482], elbow: [0.2, 1], wrist: 0.4, fingers: 0.2}, near: {w: [86, -452], elbow: [-0.3, 1], wrist: 0.3, fingers: 0.2, late: true}}}},
  swordsman: {cast: "farmer", say: "the sword dance (fon dap)", look: Object.assign({}, MN_BARE, {skin: "#b07a50", turban: "#f2ead6", sarong: "#1e1a20"}),
              man: {hands: "normal", face: {hairdo: "knot", mu: {nose: "lanna", tara: 0.1}, jaw: {cheek: -1, corner: [3, 2], chin: [2, 3]}, brows: {lift: 1, arch: 2.5, long: 3, fall: -2, thick: 1.3}, eyes: {gaze: [1.6, -0.8], tilt: 0.12, open: 0.3}, feel: {smile: 0.05}, moustache: 0.7},
                    holds: "dap", pose: {far: {w: [86, -760], elbow: [1, 0.2], wrist: -0.3, fingers: 0.9}, near: {w: [-176, -600], elbow: [-0.6, 1], wrist: 0.2, fingers: 0.9, late: true}}}},
  townsman: {cast: "inta", say: "a man of the town", look: {shirt: "#25304e", sarong: "#22304c", patoi: true, tattoo: false, skin: "#d29a6c", sabai: undefined},
             man: {hands: "normal", face: {hairdo: "cut", mu: {nose: "between", tara: 0.5}, jaw: {cheek: 1.5, corner: [-1, 1], chin: [0, 0.5]}, brows: {lift: 0, arch: 1, thick: 1.15}, eyes: {gaze: [-2, 0], open: 0.3}, feel: {smile: 0.5}, stubble: 0.6},
                   trousers: "#22304c", bag: ["#b8323a", "#e0b23a"]}},
  elder: {cast: "elder", say: "an elder", look: {shirt: "#f0ebe0", sarong: "#5a4636", tattoo: false, turban: undefined, hair: "#d8d2c8", age: 0.75, skin: "#c8946a"},
          man: {hands: "normal", face: {hairdo: "knot", mu: {nose: "between", tara: 0.5}, jaw: {cheek: 0.5, corner: [0, 2.5], chin: [0, 1]}, brows: {lift: 0.5, fall: 2, thick: 0.9}, eyes: {open: -0.8, gaze: [-0.6, 0.4]}, moustache: 1, feel: {smile: 0.45}},
                holds: "stick", bag: ["#4a5a3a", "#e8dcc0"], pose: {near: {w: [70, -430], elbow: [-0.2, 1], wrist: -0.4, fingers: 1, late: true}}}},
  lue: {cast: "villager", say: "a Tai Lue man", look: {bare: false, shirt: "#1e2438", sarong: "#1e2438", patoi: true, tattoo: false, skin: "#d4a07a", sabai: sabaiLook("lueKhit"), turban: undefined},
        man: {hands: "normal", face: {hairdo: "lue", wrap: ["#f6f1e6", "#c8303a"], mu: {nose: "low", tara: 0.5}, jaw: {cheek: 2, corner: [1, 0], chin: [1, 1]}, brows: {arch: -0.5, long: 2, thick: 1.1}, eyes: {long: 1.06, tilt: 0.1, open: -0.3, crease: 0}, feel: {smile: 0.2}},
              trousers: "#1e2438"}}
};
var MURAL_CHILDREN = {
  boy: {cast: "boy", say: "a boy, his topknot pinned in silver", look: {shirt: "#25304e", skin: "#d6a272"},
        child: {child: -1, hands: "normal", face: {hairdo: "juk", pin: "silver", mu: {nose: "rosy", tara: 0.9}, jaw: {cheek: 2, corner: [-3, -2], chin: [-1, -2]}, brows: {lift: 1, thick: 0.8}, eyes: {long: 1.12, iris: 1.2, open: 1, gaze: [-1.2, -0.6]}, feel: {smile: 0.6, wonder: 0.2}},
                pose: {far: {w: [70, -700], elbow: [1, 0.2], wrist: -0.4, fingers: -0.2}}}},
  tufts: {cast: "girl", say: "a girl, her side tufts (kae)", look: {shirt: "#f4ecdc", sin: 2, skin: "#e2b48c"},
          child: {child: -1, hands: "normal", face: {hairdo: "kae", mu: {nose: "rosy", tara: 0.95}, jaw: {cheek: 2.5, corner: [-3, -2], chin: [-1, -2]}, brows: {lift: 1.5, thick: 0.75}, eyes: {long: 1.14, iris: 1.25, open: 1.2, gaze: [-1.6, 0.6]}, feel: {smile: 0.35}},
                  blouse: "plain", earring: "pearl", chain: false, hair: []}},
  plait: {cast: "girl", say: "a girl, her plait (pia)", look: {shirt: "#e8a8b8", sin: 0, skin: "#dcac80"},
          child: {child: -0.7, hands: "normal", face: {hairdo: "pia", mu: {nose: "rosy", tara: 0.85}, jaw: {cheek: 1.5, corner: [-2, -1], chin: [-0.5, -1]}, brows: {lift: 1, thick: 0.8}, eyes: {long: 1.1, iris: 1.15, open: 0.6, gaze: [1, -0.8]}, feel: {smile: 0.5}},
                  blouse: ["dots", "#fbf3ee"], earring: "pearl", chain: false, hair: [], holds: "lotus", pose: {near: {w: [40, -545], elbow: [-0.2, 1], wrist: -0.25, fingers: 0.75, late: true}}}},
  prince: {cast: "boy", say: "a Poy Sang Long boy, dressed as a prince", look: {shirt: "#e8508a", bare: false, sarong: "#f2c33a", skin: "#e6b890", jewels: "gold", bangles: 4, sabai: sabaiLook("haeOn")},
           child: {child: -0.8, hands: "normal", face: {hairdo: "poy", makeup: "red", mu: {nose: "rosy", tara: 0.8}, jaw: {cheek: 1.5, corner: [-2, -1], chin: [-1, -1]}, brows: {lift: 1.5, arch: 2, thick: 0.9}, eyes: {long: 1.1, liner: 0.7, open: 0.4, gaze: [-1, 0]}, feel: {smile: 0.3}}}}
};
// The look of one of MURAL_MEN or MURAL_CHILDREN, as cast() gives the cast's: name, and more to change or add to it.
// A child keeps the cast's own size for a child (a boy 0.8, where a man is 1.3): more.size changes it.
// e.g. person(700, GROUND, castMan("elder", {size: 1.4})); person(820, GROUND, castChild("boy"))
function castMan(name, more) {
  var m = MURAL_MEN[name];
  if (!m) { checkName("A mural man", name, MURAL_MEN); return cast("fellow", more); }
  return cast(m.cast, Object.assign({}, m.look, {man: name}, more));
}
function castChild(name, more) {
  var c = MURAL_CHILDREN[name];
  if (!c) { checkName("A mural child", name, MURAL_CHILDREN); return cast("boy", more); }
  return cast(c.cast, Object.assign({}, c.look, {child: name}, more));
}
// the settings of a look's "man" or "child" (a name, or the settings themselves), as wmWoman takes them; a child's
// build -1 unless they say
function mnSettings(look) {
  var s = look.man !== undefined ? look.man : look.child, kind = look.man !== undefined ? "man" : "child";
  var known = kind === "man" ? MURAL_MEN : MURAL_CHILDREN;
  if (typeof s === "string") {
    if (!known[s]) { checkName(kind === "man" ? "A mural man" : "A mural child", s, known); return null; }
    s = known[s][kind];
  }
  return kind === "child" && s.child === undefined ? Object.assign({child: -1}, s) : s;
}
MURAL_LOOK_KEYS.man = true;
MURAL_LOOK_KEYS.child = true;
MURAL_LOOK_KEYS.poses = true;

// ========== seated (until 2026-11-01, mural_seated.js) ==========
// mural_seated.js - the mural figure seated (2026-10-30), over the women above. The owner, of the hero film's yard redrawn
// with the mural women: "yes" to seated mural figures for its two weavers, then "go ahead and put them in".
//
// A woman of the mural figure sits when her look has "floor", as the kit's own figure does (oldcartoon.js): true,
// "side" or "cross" on the floor, her legs folded to one side as a woman sits politely (phap phiap): the thighs forward
// along the floor, the lower legs folded back, a foot showing behind her; "astride" on a seat (the frame loom's bench):
// the thighs forward, the shins down, the feet on the floor 190 of her units below it. (x, y) is what she sits on: the
// floor, or the seat's top. reachB and reachA are the points her near and far hands go to, in the same space. Her upper
// body is mural.js's own, clipped at the waist and set down onto the seat; below it a seated shape of her sin, in its
// colours and with its foot band. A man of the mural figure with "floor" stands (no seated man yet).
// muralSeated(x, y, look, size, kind, reach) draws one: kind "side" or "bench"; reach {near: [x, y], far: [x, y]} or null.
// e.g. person(600, GROUND, castWoman("grandmother", {floor: true, size: 1.2}))

var SIT_WAIST = 52;                                  // how high her waist is above what she sits on, in her units
// a point P (film pixels) as her pose's wrist, in the frame mural_women.js poses in (her upper frame, standing at
// (x, y + drop)); the lady's shear muUpper(-0.028, 0.07, -430)
function sitWrist(P, x, yStand, px) {
  var u = (P[0] - x) / px, v = (P[1] - yStand) / px;
  return [u - 0.07 * v - (-0.098) * (-430), v];
}
function muralSeated(x, y, look, size, kind, reach) {
  var px = 59 * size / 100, drop = (430 - SIT_WAIST) * px, yStand = y + drop, cut = y - SIT_WAIST * px + 6 * px;
  var named = typeof look.woman === "string" && MURAL_WOMEN[look.woman] ? MURAL_WOMEN[look.woman].woman : null;
  var settings = Object.assign({}, named || (look.woman && typeof look.woman === "object" ? look.woman : {}));
  if (reach) {                                       // her hands to the points given, and nothing else in them
    var pose = {};
    settings.holds = undefined;
    if (reach.near) { pose.near = {w: sitWrist(reach.near, x, yStand, px), elbow: [-0.3, 1], wrist: -0.3, fingers: 0.8, late: true}; }
    if (reach.far) { pose.far = {w: sitWrist(reach.far, x, yStand, px), elbow: [0.4, 1], wrist: 0.3, fingers: 0.6}; }
    settings.pose = pose;
  }
  var seatedLook = Object.assign({}, look, {woman: settings, floor: undefined, reachA: undefined, reachB: undefined});   // (seated once: drawn standing below)
  pen.save();                                        // what is below her waist, seated: before her upper body
  pen.translate(x, y); pen.scale(px, px);
  sitLower(seatedLook, kind);
  pen.restore();
  pen.save();                                        // her upper body, down onto the seat, clipped at the waist
  pen.beginPath(); pen.rect(x - 4000, cut - 8000, 8000, 8000); pen.clip();
  SIT_KIT.muralPerson(x, yStand, seatedLook, {head: 59 * size});
  pen.restore();
}
// her seated legs in her sin, in her units, the seat's top or the floor at y 0, her waist at y -SIT_WAIST
function sitLower(look, kind) {
  var skin = look.skin || STYLE.skin, design = SINS[(look.sin || 0) % SINS.length], body = design[0];
  var foot = design[1].reduce(function (a, b) { return b[2] > a[2] ? b : a; });   // its broadest band: the foot
  skin = blend(skin, "#f6ead8", MU.skinLady);
  var W = -SIT_WAIST, sin, hemLine, stripes = [];
  if (kind === "bench") {
    var floor = 190;
    muFoot(150, floor, 56, skin);                    // her feet on the floor below the knees, the far one a little ahead
    muFoot(118, floor - 4, 54, skin);
    sin = new MPath().M(-40, W).C(-58, W + 14, -62, -4, -50, 6)          // her back, down over the hip to the seat
      .C(10, 14, 90, 12, 132, 14)                                        // under the thigh, along the seat
      .C(128, 60, 126, 120, 128, floor - 24)                             // the back of the shin
      .L(186, floor - 26)                                                // the hem
      .C(190, 120, 196, 50, 196, 4)                                      // the front of the shin, up to the knee
      .C(196, -22, 180, -34, 156, -34)                                   // round the knee
      .C(100, -34, 50, -40, 34, W).Z();                                  // the top of the thigh, back to the waist's front
    hemLine = [[126, floor - 24], [188, floor - 26]];
    for (var k = 1; k < 6; k++) { var yy = W + 12 + k * 7; stripes.push([[-46, yy + 30 - k * 4], [60, yy], [160, -30 + k * 6]]); }
  } else {
    muFoot(-128, -2, 50, skin);                      // a foot showing behind her, its sole up, folded under
    sin = new MPath().M(-40, W).C(-60, W + 20, -70, -20, -96, -22)       // her back, down to the folded legs behind her
      .C(-130, -22, -150, -12, -146, 0)                                  // the lower legs folded back, on the floor
      .L(150, 0)                                                         // along the floor to the knees
      .C(176, 0, 184, -18, 176, -30)                                     // round the knees
      .C(150, -46, 80, -50, 34, W).Z();                                  // the top of the thighs, back to the waist's front
    hemLine = [[-146, 0], [-96, -4]];
    for (var j = 1; j < 6; j++) { var y2 = W + 8 + j * 7; stripes.push([[-60, y2 + 10], [60, y2 + 4], [170, -40 + j * 6]]); }
  }
  mFill(sin, body, 12);
  pen.save(); pen.clip(sin.path);
  stripes.forEach(function (s, i) {                  // the cloth's fine stripes, along the legs
    mLine(new MPath().M(s[0][0], s[0][1]).Q(s[1][0], s[1][1], s[2][0], s[2][1]), blend(body, i % 2 ? "#f2e6c8" : "#1a1210", 0.35), 1.4);
  });
  design[1].forEach(function (b) {                   // its bands, round the thighs where they are broad enough to show
    if (b[2] >= 3 && b !== foot && b[0] > 0.15 && b[0] < 0.8) {
      var yb = W + (b[0] - 0.15) * 90;
      mLine(new MPath().M(-70, yb + 20).Q(60, yb - 4, 200, yb - 30), b[1], b[2] * 1.2);
    }
  });
  var a = hemLine[0], c = hemLine[1];               // the foot band, along the hem
  mLine(new MPath().M(a[0] - 6, a[1] - 9).L(c[0] + 6, c[1] - 9), foot[1], 16);
  if (kind === "bench") { mLine(new MPath().M(a[0] - 6, a[1] - 22).L(c[0] + 6, c[1] - 24), "#e0b23a", 2.2); }
  pen.restore();
  mBrush(sin, muInk(muColour(body)), 1.5);
}

// mural_women.js's figure, seated when a woman's look has "floor" (and she is not already being drawn)
var SIT_KIT = {muralPerson: muralPerson};
muralPerson = function (x, y, look, opts) {
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun;
  if (!look.floor || !lady || WM) { return SIT_KIT.muralPerson(x, y, look, opts); }
  var kind = look.floor === "astride" ? "bench" : "side", reach = look.reachA || look.reachB ? {near: look.reachB, far: look.reachA} : null;
  muralSeated(x, y, look, (opts && opts.head || 70) / 59, kind, reach);
};

// ========== wearing the woven sabai (until 2026-11-01, mural_sabai.js) ==========
// mural_sabai.js - the woven sabai of sabai.js worn by a woman of the mural figure (mural_women.js), as the kit's own
// figure wears it. A page wearing it loads sabai.js (and sabai_finish.js, for a finished cloth). The owner
// (2026-10-31): "Can you put the sabai on one of the new model sprites and keep it from rocking or shaking?", then "Use
// one of the new models and stop the sway if possible". Notes: docs/kit/things.md, "The sabai on a mural woman".
//
// She wears the cloth whole (sabaiWorn()): its back hanging from her shoulder, her far arm (her left) over it, her body,
// then its front over her shoulder and upper arm, and her left forearm and hand over everything (owner, 2026-11-03). Her own band is left off (sabai: false);
// she stands still (woman: sway false), so the cloth lies on her as she is; SABAI_MURAL_ARMS lays her near arm hanging
// over the cloth's lower end. A steady cloth's figures do not bob or rock.
// e.g. var look = castWoman("maiden", {sabai: false, id: "maiden"});
//      look.woman = Object.assign({}, MURAL_WOMEN.maiden.woman, {sway: false, holds: undefined, pose: SABAI_MURAL_ARMS});
//      var where = sabaiOfMural(t, 720, 1010, look), cloth = {finish: true, steady: true, cloth: SABAI_FINISH_GROUND};
//      person(720, 1010, sabaiWorn(look, t, where, cloth));

// Her near arm hanging at her side, drawn after the cloth's front so it lies over its lower end; the far arm as hers.
var SABAI_MURAL_ARMS = {near: {w: [-48, -374], elbow: [-1, 0.1], late: true}};

// Where the cloth lies on a mural woman standing at (x, y): sabai.js's sabaiOf() on her own body, not the kit figure's
// joints. Over the shoulder on the right of the picture and across her to the left: from the right side of her neck's
// foot (her neck ring) down to her belt on the left, under her near arm, tucked in at the waist (owner, 2026-10-30: "the
// sabai should extend all the way across the sprites body"; 2026-10-31: "From her belt, up to the point where the sabai
// extends to the point of her torso should all be covered by the sabai"); past her side there it is cut along her
// torso's line (MS_TORSO), so her outline keeps its curve in the cloth's colour; its back hanging behind the shoulder
// past the hip. Her points are read in her own units as mural.js draws a lady: a unit is 59 * size / 100 pixels
// (person()'s head), her upper body sheared by muUpper(-0.028, 0.07, -430). The middle line is a quadratic in 97
// points, its heading the curve's own tangent (smooth, no facets up close).
// t: seconds (the back's edge waves with it); look: hers (its size). Returns what sabaiOf() returns, for sabai(),
// sabaiWorn() and sabaiCamera().
// e.g. var where = sabaiOfMural(t, 720, 1010, look);
function sabaiOfMural(t, x, y, look) {
  var form = look.woman && look.woman.child ? {tall: 1, wide: 1} : PEOPLE_FORM;   // her form (PEOPLE_FORM): the cloth on her as she is drawn
  var px = 59 * (look.size || 1) * form.tall / 100, n, k;
  function onHer(u, v, upper) { return [x + (u + (upper ? 0.07 * v + 42.14 : -0.028 * v)) * px * form.wide, y + v * px]; }
  var neck = onHer(18.3, -583, true), hip = onHer(-6, -380, false), waistY = onHer(0, -430, false)[1];
  var half = 36;                                     // half the band's width
  var end = onHer(-58, -404, true);                  // the middle of its lower end: under the belt, left of her middle
  var mid = onHer(-6, -490, true);                   // the curve's pull, a little to her front
  var slope = Math.atan2(neck[1] - mid[1], neck[0] - mid[0]);   // its heading at the top: up to her neck
  var top = [neck[0] - Math.sin(slope) * half, neck[1] + Math.cos(slope) * half];   // the middle of its upper end: its upper corner beside the neck
  var start = 0;                                     // cut square at its lower end, under the belt (the tuck and her torso's line hide it)
  var points = [], marks = [0], length = 0;
  for (n = 0; n <= 96; n++) {
    var s = n / 96, v = 1 - s;
    points.push([v * v * end[0] + 2 * v * s * mid[0] + s * s * top[0], v * v * end[1] + 2 * v * s * mid[1] + s * s * top[1]]);
    if (n) { length += Math.hypot(points[n][0] - points[n - 1][0], points[n][1] - points[n - 1][1]); marks.push(length); }
  }
  function seek(along) {                             // which piece a distance along falls in, and how far through it
    along = Math.max(0, Math.min(length, along));
    var lo = 0, hi = marks.length - 1;
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (marks[m] <= along) { lo = m; } else { hi = m; } }
    return [lo, (along - marks[lo]) / (marks[hi] - marks[lo] || 1)];
  }
  function pointAt(along) {
    var w = seek(along), p = points[w[0]], q = points[w[0] + 1] || p;
    return [p[0] + (q[0] - p[0]) * w[1], p[1] + (q[1] - p[1]) * w[1]];
  }
  function headingAt(along) {                        // the curve's tangent a distance along
    var w = seek(along), s = (w[0] + w[1]) / 96, v = 1 - s;
    return Math.atan2(v * (mid[1] - end[1]) + s * (top[1] - mid[1]), v * (mid[0] - end[0]) + s * (top[0] - mid[0]));
  }
  function side(along, across) {                     // a point "across" from the middle line, as sabaiAt() has it
    var q = pointAt(along), g = headingAt(along);
    return [q[0] - Math.sin(g) * across, q[1] + Math.cos(g) * across];
  }
  var upper = side(start, -half), lower = side(start, half);
  var vx = lower[0] - upper[0], vy = lower[1] - upper[1], vl = Math.hypot(vx, vy) || 1, g = headingAt(start);
  var startCap = {N: [(upper[0] + lower[0]) / 2, (upper[1] + lower[1]) / 2], c: Math.cos(g), s: Math.sin(g), kx: -vy / vl, ky: vx / vl};
  // the back, from the top end's corner at the shoulder down past the hip: its outer edge leaning out 32 by the foot and
  // waving 5 either way, its hem curving to the inner edge
  var corner = side(length, half), foot = hip[1] + 54, outer = [], hem = [];
  for (k = 0; k <= 16; k++) {
    outer.push([corner[0] + 32 * k / 16 + Math.sin(k / 16 * Math.PI * 2.5 + t * 0.8) * 5, corner[1] + (foot - corner[1]) * k / 16]);
  }
  var innerX = hip[0] + 24, last = outer[16];
  for (k = 0; k <= 8; k++) { hem.push([last[0] + (innerX - last[0]) * k / 8, foot + Math.sin(k / 8 * Math.PI) * 10 - k]); }
  return {at: function (u) { return pointAt(u * length); }, angle: function (u) { return headingAt(u * length); },
          uAt: function (along) { return Math.max(0, Math.min(1, along / length)); }, length: length, start: start,
          fold: length, top: length, squeeze: function () { return 1; }, middle: pointAt(0.4 * length), tilt: headingAt(0.4 * length),
          startCap: startCap, endCap: {bulge: 26}, tuck: waistY + 8, tail: {outer: outer, hem: hem, inner: [innerX, corner[1] + 16]}};
}

// Her torso's line on the left, as mural.js draws her blouse (her upper units): from her neck ring's left edge round her
// side down to the belt, then straight down. The cloth's front is cut along it (owner, 2026-10-31: "recut the woman's
// torso line as before so it has the same curve as before but it's just the sabai color"): it keeps to the right of it.
var MS_TORSO = "M -13.13 -586 C -30 -582 -50 -578 -60 -562 C -68 -548 -66 -520 -60 -498 C -54 -476 -42 -458 -40 -436 " +
               "L -40 -300 L 2000 -300 L 2000 -2000 L -13.13 -2000 Z";

// A mural woman wearing the cloth (sabaiWorn()'s "worn"): its front is drawn after her body and her necklace (owner,
// 2026-10-31: "It should probably go over the necklace"), before an arm drawn late (so her hanging near arm lies over
// it) and the belt (which holds it at the waist). mural.js draws the belt and then the necklace (muCollar3q), so the
// belt (with the late arm, mural_women.js draws it there) waits until the cloth is on. The chains of rank (neck
// "sangwan") are worn over the cloth: below the choker they are drawn again after it. For one with neither, after her.
// It is cut along her torso's line (MS_TORSO).
// Her far arm, her left, the cloth's shoulder (owner, 2026-11-03: "Fix the woman's left arm. It should be in front of the
// back part of the sabai and her forearm and hand should be in front of everything. Her bicep and shoulder should be
// behind the front side of the sabai"; until then the back hung over the whole arm, owner 2026-10-31): the cloth's back
// is drawn first, then that arm, which mural.js draws first of her, so her body and the cloth's front lie over its
// shoulder and upper arm; then the same arm again from the elbow down (cut along the elbow's bisector), over all of her
// (WM_OVER). Never late: in a wai its forearm goes where the late arms go (over the cloth, before her near arm, so her
// near hand stays in front of it, as the far hand is seen in three-quarter view).
var MURAL_SABAI_KIT = {muralPerson: muralPerson, muBelt: muBelt, muCollar3q: muCollar3q, muArm: muArm}, MS_WORN = null;
muralPerson = function (x, y, look, opts) {
  if (!look.worn || !look.woman) { return MURAL_SABAI_KIT.muralPerson(x, y, look, opts); }
  var keep = MS_WORN;
  MS_WORN = {worn: look.worn, frame: pen.getTransform(), x: x, y: y, px: (opts.head || 70) / 100, done: false, belt: null, back: !look.worn.back};
  try {
    MURAL_SABAI_KIT.muralPerson(x, y, look, opts);
    msBack();
    msWear();
    msBelt();
  } finally { MS_WORN = keep; }
};
function msBack() {                                  // the cloth's back, once
  var wear = MS_WORN;
  if (wear.back) { return; }
  wear.back = true;
  pen.save();
  try { wear.worn.back(); } finally { pen.restore(); }
}
muArm = function (S, E, W, wide, sleeve, skin, look, outward, bend, lady) {
  var wear = MS_WORN;
  if (!wear || wear.far || outward <= 0) { return MURAL_SABAI_KIT.muArm(S, E, W, wide, sleeve, skin, look, outward, bend, lady); }
  wear.far = true;
  msBack();                                          // the cloth's back under the arm
  var late = WM_LATE ? WM_LATE.length : 0, base = WM_KIT.muArm, seen = null;
  WM_KIT.muArm = function () { seen = {args: arguments, frame: pen.getTransform(), arm: WM_ARM}; return base.apply(null, arguments); };
  try {
    MURAL_SABAI_KIT.muArm(S, E, W, wide, sleeve, skin, look, outward, bend, lady);
    if (WM_LATE && WM_LATE.length > late) { WM_LATE.splice(late, 1)[0](); }   // now, not late: under her body and the cloth's front
  } finally { WM_KIT.muArm = base; }
  if (!seen) { return; }
  var fore = function () { msForearm(seen, base); };
  if (seen.arm && seen.arm.aim !== undefined) { WM_LATE = WM_LATE || []; WM_LATE.splice(late, 0, fore); }   // a wai: before her near arm
  else { (WM_OVER = WM_OVER || []).push(fore); }
};
// The far arm drawn again from the elbow down: clipped to the side of the elbow's bisector that holds the wrist.
function msForearm(seen, base) {
  var S = seen.args[0], E = seen.args[1], W = seen.args[2];
  var lu = Math.hypot(S[0] - E[0], S[1] - E[1]) || 1, lv = Math.hypot(W[0] - E[0], W[1] - E[1]) || 1;
  var b = [(S[0] - E[0]) / lu + (W[0] - E[0]) / lv, (S[1] - E[1]) / lu + (W[1] - E[1]) / lv], lb = Math.hypot(b[0], b[1]);
  b = lb < 1e-3 ? [-(S[1] - E[1]) / lu, (S[0] - E[0]) / lu] : [b[0] / lb, b[1] / lb];   // a straight arm: across it
  var n = [-b[1], b[0]], L = 5000;
  if (n[0] * (W[0] - E[0]) + n[1] * (W[1] - E[1]) < 0) { n = [-n[0], -n[1]]; }
  pen.save();
  try {
    pen.setTransform(seen.frame);
    pen.beginPath();
    pen.moveTo(E[0] + b[0] * L, E[1] + b[1] * L); pen.lineTo(E[0] - b[0] * L, E[1] - b[1] * L);
    pen.lineTo(E[0] - b[0] * L + n[0] * L, E[1] - b[1] * L + n[1] * L); pen.lineTo(E[0] + b[0] * L + n[0] * L, E[1] + b[1] * L + n[1] * L);
    pen.closePath(); pen.clip();
    WM_ARM = seen.arm;
    base.apply(null, seen.args);
  } finally { WM_ARM = null; pen.restore(); }
}
function msWear() {                                  // the cloth's front, once
  var wear = MS_WORN;
  if (wear.done) { return; }
  wear.done = true;
  pen.save();
  try {
    pen.setTransform(wear.frame); pen.translate(wear.x, wear.y); pen.scale(wear.px, wear.px); muUpper(-0.028, 0.07, -430);
    pen.clip(new Path2D(MS_TORSO));                  // in her upper units, as mural.js draws her blouse
    wear.worn();
  } finally { pen.restore(); }
}
function msBelt() {                                  // the belt that waited for the cloth, where it was to be drawn
  var belt = MS_WORN.belt;
  if (!belt) { return; }
  MS_WORN.belt = null;
  pen.save();
  try { pen.setTransform(belt.at); MURAL_SABAI_KIT.muBelt.apply(null, belt.args); } finally { pen.restore(); }
}
muBelt = function (y, x0, x1, buckleX) {
  if (MS_WORN && !MS_WORN.done) { MS_WORN.belt = {at: pen.getTransform(), args: [y, x0, x1, buckleX]}; return; }
  return MURAL_SABAI_KIT.muBelt(y, x0, x1, buckleX);
};
muCollar3q = function (c, y0, r, wide, drop) {
  if (!MS_WORN || MS_WORN.done) { return MURAL_SABAI_KIT.muCollar3q(c, y0, r, wide, drop); }
  MURAL_SABAI_KIT.muCollar3q(c, y0, r, wide, drop);  // the necklace
  msWear();                                          // the cloth over it
  if (WM && WM.neck === "sangwan") {                 // the chains of rank over the cloth, below the choker
    pen.save(); pen.beginPath(); pen.rect(-1000, y0 + 18, 2000, 2000); pen.clip();
    try { MURAL_SABAI_KIT.muCollar3q(c, y0, r, wide, drop); } finally { pen.restore(); }
  }
  msBelt();
};

// ========== person() on the painters, and the generator ==========
var PEOPLE_PERSON = person, PEOPLE_SINK = null;
// each new name, its kind and its mural name: new names, as the films' own cast has a maiden, a farmer and a boy
var PEOPLE_CAST = {
  heavenly: ["woman", "celestial"], lotusmaiden: ["woman", "maiden"], naildancer: ["woman", "dancer"], orchiddancer: ["woman", "orchid"], princess: ["woman", "princess"],
  khangran: ["woman", "grandmother"], clothweaver: ["woman", "weaver"], luewoman: ["woman", "lue"], courtlady: ["woman", "court"], festivalgirl: ["woman", "festival"],
  polefarmer: ["man", "farmer"], longdrummer: ["man", "drummer"], swordsman: ["man", "swordsman"], townsman: ["man", "townsman"], whiteelder: ["man", "elder"], lueman: ["man", "lue"],
  jukboy: ["child", "boy"], kaegirl: ["child", "tufts"], piagirl: ["child", "plait"], poyprince: ["child", "prince"]
};
// where each arm hangs when nothing is asked of it, in the figure's units: as mural.js draws it. "far" is the rig's arm A, the shoulder in front.
var PEOPLE_ARMS = {
  lady: {far: {S: [28, -548], E: [46, -456], W: [44, -372]}, near: {S: [-50, -550], E: [-72, -458], W: [-48, -374]}},
  man: {far: {S: [44, -560], E: [60, -462], W: [56, -376]}, near: {S: [-70, -562], E: [-88, -462], W: [-64, -378]}}
};

Object.keys(PEOPLE_CAST).forEach(function (name) {
  var who = PEOPLE_CAST[name];
  CAST[name] = who[0] === "woman" ? castWoman(who[1]) : who[0] === "man" ? castMan(who[1]) : castChild(who[1]);
});

// The kit's own young women and girls are painted too (the owner, 2026-11-07, of the old drawing's long-necked women:
// "remove those from the kit", and the whole kit, not one film): each of the cast's women and girls takes the settings
// of one of the ten or the four children, her own clothes and colours kept, her hands empty unless she dances (what the
// mural woman holds and the pose for it are hers, not the kind's). The old (age 0.5 and more: grandmother, devotee)
// keep person()'s own drawing. Each: [kind, a name of MURAL_WOMEN or MURAL_CHILDREN, true to keep her pose].
var PEOPLE_KIND_PAINTED = {lady: ["woman", "court"], celestial: ["woman", "celestial", true], dancer: ["woman", "dancer", true],
  maiden: ["woman", "maiden"], weaver: ["woman", "weaver"], luagirl: ["woman", "weaver"], luawife: ["woman", "grandmother"],
  buakham: ["woman", "maiden"], sinuan: ["woman", "festival"], girl: ["child", "tufts"], dokkham: ["child", "plait"]};
Object.keys(PEOPLE_KIND_PAINTED).forEach(function (name) {
  var k = PEOPLE_KIND_PAINTED[name], known = k[0] === "woman" ? MURAL_WOMEN : MURAL_CHILDREN;
  CAST[name] = Object.assign({}, CAST[name]);
  CAST[name][k[0]] = k[2] ? k[1] : Object.assign({}, known[k[1]][k[0]], {holds: undefined, pose: undefined});
});

// A look of person()'s own that draws a young woman (a lady's face, so look.lady or her hair in a knot, and under 0.5
// of age), with no woman, man or child of its own: painted settings mixed for her (castMix()'s), the same for the same
// id (or, with none, the same clothes), her hands empty. Gives back the settings, or null when the look is not one.
// e.g. peopleYoung({bun: true, shirt: "#f4efe2", id: "seller"}).face.hairdo
var PEOPLE_YOUNG = {};
function peopleYoung(look) {
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun;
  if (!lady || look.age >= 0.5) { return null; }
  var key = look.id !== undefined ? "id " + look.id : JSON.stringify([look.shirt, look.sin, look.sarong, look.skin, look.hair, look.size]);
  if (!PEOPLE_YOUNG[key]) {
    var seed = 0;
    for (var n = 0; n < key.length; n++) { seed = (seed * 31 + key.charCodeAt(n)) >>> 0; }
    PEOPLE_YOUNG[key] = Object.assign({}, castMix(seed).woman, {holds: undefined, pose: undefined, hands: "normal", nails: false});
  }
  return PEOPLE_YOUNG[key];
}

// A look's painted settings (a name of the twenty's, or the settings themselves; a young woman's of person()'s own:
// peopleYoung()), or null for one of person()'s own.
// e.g. peopleSettings(cast("princess")).neck;   // "sangwan"
function peopleSettings(look) {
  if (look.woman) {
    if (typeof look.woman !== "string") { return look.woman; }
    if (MURAL_WOMEN[look.woman]) { return MURAL_WOMEN[look.woman].woman; }
    checkName("A painted woman", look.woman, MURAL_WOMEN);
    return null;
  }
  return look.man !== undefined || look.child !== undefined ? mnSettings(look) : peopleYoung(look);
}

// person()'s joints for this frame on a sheet nobody sees, for the arms asked of it. Returns the joints; pen as it was.
function peopleRig(x, y, look, way, lady) {
  if (!PEOPLE_SINK) { var sheet = document.createElement("canvas"); sheet.width = 1; sheet.height = 1; PEOPLE_SINK = sheet.getContext("2d"); }
  var rig = {size: look.size || 1, lady: lady, bun: lady, plain: true, sabai: false, shirt: "#888888", legs: "#888888", id: "rig/" + (look.id || "n")};
  if (look.handA) { rig.handA = look.handA; }
  if (look.handB) { rig.handB = look.handB; }
  ["reachA", "reachB"].forEach(function (k) { if (look[k]) { rig[k] = [x + (look[k][0] - x) * way, look[k][1], look[k][2]]; } });
  var was = pen, frame = pen.getTransform();
  pen = PEOPLE_SINK;
  pen.setTransform(frame);
  try { return PEOPLE_PERSON(x, y, rig); }
  finally { pen.setTransform(1, 0, 0, 1, 0, 0); pen = was; }
}

// person()'s joints for a seat on a sheet nobody sees: the same seat (floor), wai, facing, lean and reaches as the look's,
// on a plain figure. Returns the joints; pen as it was. e.g. peopleSeat(400, 960, cast("maiden", {floor: true, wai: true}), true).wristA
function peopleSeat(x, y, look, lady) {
  if (!PEOPLE_SINK) { var sheet = document.createElement("canvas"); sheet.width = 1; sheet.height = 1; PEOPLE_SINK = sheet.getContext("2d"); }
  var rig = {size: look.size || 1, lady: lady, bun: lady, plain: true, sabai: false, shirt: "#888888", legs: "#888888", id: "seat/" + (look.id || "n")};
  ["floor", "wai", "face", "bend", "reachA", "reachB", "handA", "handB"].forEach(function (k) { if (look[k] !== undefined) { rig[k] = look[k]; } });
  var was = pen, frame = pen.getTransform();
  pen = PEOPLE_SINK;
  pen.setTransform(frame);
  try { return PEOPLE_PERSON(x, y, rig); }
  finally { pen.setTransform(1, 0, 0, 1, 0, 0); pen = was; }
}

// How a painted figure moves, from person()'s own plain figure in the same moves (the owner, 2026-11-09: "The painted women
// need to move like the other model figures"): the rig is drawn twice on the unseen sheet, once in the look's moves (its hop
// on the beat, a kick, a half-sit, a bend, a sway, a tilt, a walk) and once at rest (the same walk, no hop, nothing else),
// and the two are compared. Gives back {dy, lean, bend, nod} in the scene's units and radians, forward (the way the figure
// faces) above 0: dy how far its hips are below rest (a hop is below 0), lean the whole figure about its feet, bend the
// upper body about the waist, nod the head about the chin; or null when the figure is to keep still (nothing moves it).
// A painted figure's walk and wai are its own; its arms are the rig's only where the look puts them (peoplePainted).
// e.g. peopleMoves(400, 960, castWoman("maiden", {bend: 0.3}), true).bend
var PEOPLE_MOVED = ["step", "stride", "bend", "twist", "sway", "tilt", "sit", "up", "late", "raise", "spring", "shoulders", "dance"];
function peopleMoves(x, y, look, lady) {
  var moved = PEOPLE_MOVED.some(function (k) { return look[k] !== undefined && k !== "step" && k !== "stride"; });
  if (!STYLE.hop && !moved) { return null; }
  if (!PEOPLE_SINK) { var sheet = document.createElement("canvas"); sheet.width = 1; sheet.height = 1; PEOPLE_SINK = sheet.getContext("2d"); }
  var way = look.face || 1, base = {size: look.size || 1, lady: lady, bun: lady, plain: true, sabai: false, shirt: "#888888", legs: "#888888", face: way};
  var now = Object.assign({}, base, {id: "move/" + (look.id || "n")}), rest = Object.assign({}, base, {id: "rest/" + (look.id || "n")});
  PEOPLE_MOVED.forEach(function (k) { if (look[k] !== undefined) { now[k] = look[k]; } });
  ["step", "stride"].forEach(function (k) { if (look[k] !== undefined) { rest[k] = look[k]; } });
  var was = pen, frame = pen.getTransform(), hop = STYLE.hop, a, b;
  pen = PEOPLE_SINK;
  try {
    pen.setTransform(frame); a = PEOPLE_PERSON(x, y, now);
    STYLE.hop = false;
    pen.setTransform(frame); b = PEOPLE_PERSON(x, y, rest);
  } finally { STYLE.hop = hop; pen.setTransform(1, 0, 0, 1, 0, 0); pen = was; }
  var scene = frame.inverse();
  function at(j) { var p = scene.transformPoint(new DOMPoint(j[0], j[1])); return [p.x, p.y]; }
  function turn(from, to) { var p = at(from), q = at(to); return Math.atan2((q[0] - p[0]) * way, p[1] - q[1]); }
  var lean = turn(a.stand, a.waist) - turn(b.stand, b.waist), bend = turn(a.waist, a.neck) - turn(b.waist, b.neck) - lean;
  var nod = turn(a.chin, a.crown) - turn(b.chin, b.crown) - bend - lean;
  return {dy: at(a.hip)[1] - at(b.hip)[1], lean: lean, bend: bend, nod: nod};
}

// The figure's measure of a child: the point of the upper body (the units of the shear's frame) where a grown figure has it,
// to where it is drawn (forward true), or back. c: the settings' child, a negative number, or 0 for anyone grown.
function peopleChild(p, c, forward) {
  var b = Math.max(0, -c), legs = 1 - 0.15 * b, trunk = 1 - 0.12 * b;
  if (forward) { return [p[0] * trunk, MN_WAIST * legs + trunk * (p[1] - MN_WAIST)]; }
  return [p[0] / trunk, (p[1] - MN_WAIST * legs) / trunk + MN_WAIST];
}

// How a grown painted woman stands beside person()'s own figures (the owner, 2026-11-07, of the White Eel: "Reconcile the
// painted woman figures so their heads and bodies are similar size to the old rig"): tall, her whole figure's scale; head,
// her head's, about her chin; wide, her body's width, her head kept round. At 1, 1, 1 she is as mural.js paints her: at
// size 1 she stood 413 tall, her head 60 from chin to crown, her shoulders 46 apart; the rig's people 360 to 390, 85 to 88
// and 66. The kit's form was {0.85, 1.69, 1.5} (386 / 86 / 59) from 2026-11-07 to 11-09; then the owner turned it the other
// way: "Can you resize the male figures so their heads and bodies have the same proportions as the painted women?", the
// mural's own shape: she is 1, 1, 1 again and the men take the paintings' build (STYLE.men, menBuilt() in oldcartoon.js),
// which also ended the arms that the wide form stretched sideways ("Some have fingers that are too long").
// PEOPLE_GROW: the one being drawn now, for wmHead().
var PEOPLE_FORM = {tall: 1, head: 1, wide: 1}, PEOPLE_GROW = null;
// draw() with a grown painted woman's form: her body widened about x, her head grown (wmHead reads PEOPLE_GROW).
function peopleFormed(form, x, draw) {
  if (form.wide !== 1) { pen.translate(x, 0); pen.scale(form.wide, 1); pen.translate(-x, 0); }
  PEOPLE_GROW = form;
  try { draw(); } finally { PEOPLE_GROW = null; }
}

// The painted figure on person()'s arms. x, y: where they stand; look: as person()'s; wm: peopleSettings(look). Returns joints.
function peoplePainted(x, y, look, wm) {
  checkNames("The look's name", look, Object.assign({}, LOOK_KEYS, MURAL_LOOK_KEYS));
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun, way = look.face || 1, size = look.size || 1, px = 59 * size / 100;
  var measure = lady ? MN_LADY : MN_MAN, arms = PEOPLE_ARMS[lady ? "lady" : "man"], kid = wm.child || 0, long = measure.UPPER + measure.FORE;
  var form = lady && !kid ? PEOPLE_FORM : {tall: 1, head: 1, wide: 1};
  px *= form.tall;
  var plain = Object.assign({}, look, {woman: wm, man: undefined, child: undefined, face: undefined});
  if (look.floor && lady) {                          // a seat is the figure's own, with its reaches
    pen.save();
    try { peopleFormed(form, x, function () { muralPerson(x, y, plain, {head: 59 * size * form.tall}); }); } finally { pen.restore(); }
    // her joints are the rig's in the same seat (wrists, elbows, chin...), so a page can put a thing in her hands, as
    // offerings.html puts the cone of flowers between them in her wai (2026-11-07: a seat gave back none, and it broke);
    // the rig at her height (PEOPLE_FORM's tall), its width its own
    return Object.assign({}, peopleSeat(x, y, Object.assign({}, look, {size: size * form.tall}), lady), {size: size * 0.82, face: way, stand: spotOf(x, y)});
  }
  plain.reachA = plain.reachB = plain.handA = plain.handB = undefined;
  var settings = Object.assign({}, wm), pose = Object.assign({}, wm.pose || {});
  var moves = peopleMoves(x, y, look, lady) || {dy: 0, lean: 0, bend: 0, nod: 0};   // her hop, lean, bend and nod: person()'s
  function turned(p, about, by) {                    // p turned about a point by an angle
    var c = Math.cos(by), s = Math.sin(by), dx = p[0] - about[0], dy = p[1] - about[1];
    return [about[0] + dx * c - dy * s, about[1] + dx * s + dy * c];
  }
  function upperOf(unit) {                           // a point in the figure's units, into the upper body's frame (its shear)
    var q = turned([unit[0], (unit[1] - Math.min(0, moves.dy) / px) / (1 - Math.max(0, moves.dy) / ((lady ? 700 : 720) * px))], [0, 0], -moves.lean);   // her hop and lean undone,
    q = turned(q, [0, measure.Y0], -moves.bend);                                  // and her bend
    var p = kid ? peopleChild(q, kid, false) : q;
    return [p[0] - measure.B * p[1] - (measure.A - measure.B) * measure.Y0, p[1]];
  }
  var scene = pen.getTransform().inverse();
  function inScene(j) { var p = scene.transformPoint(new DOMPoint(j[0], j[1])); return [p.x, p.y]; }
  if (look.reachA || look.reachB || look.handA || look.handB) {
    var joints = peopleRig(x, y, look, way, lady), rate = long / (120 * joints.size);   // the rig's pixels to the figure's units
    [["A", "far", joints.shoulderA, joints.elbowA, joints.wristA], ["B", "near", joints.shoulderB, joints.elbowB, joints.wristB]].forEach(function (arm) {
      var reach = look["reach" + arm[0]], hand = look["hand" + arm[0]];
      if (!reach && !hand) { return; }
      var S = arms[arm[1]].S, s = inScene(arm[2]), e = inScene(arm[3]), w = inScene(arm[4]), to;
      if (reach) {
        var target = upperOf([(reach[0] - x) * way / px / form.wide, (reach[1] - y) / px]), rest = arms[arm[1]].W, u = reach[2] === undefined ? 1 : clamp(reach[2]);
        to = [rest[0] + (target[0] - rest[0]) * u, rest[1] + (target[1] - rest[1]) * u];
      } else {
        to = [S[0] + (w[0] - s[0]) * rate, S[1] + (w[1] - s[1]) * rate];
      }
      var gap = Math.hypot(to[0] - S[0], to[1] - S[1]), most = long - 2;   // an arm goes no further than it is long
      if (gap > most) { to = [S[0] + (to[0] - S[0]) * most / gap, S[1] + (to[1] - S[1]) * most / gap]; }
      pose[arm[1]] = Object.assign({wrist: 0, fingers: 0.3}, reach || hand ? {} : pose[arm[1]], {w: to, elbow: [e[0] - (s[0] + w[0]) / 2, e[1] - (s[1] + w[1]) / 2]});
    });
    settings.holds = undefined;                      // the hand that was holding is doing something else
  }
  if (look.at && wm.face) {                          // the eyes on a thing in the scene
    var eyes = Object.assign({}, wm.face.eyes || {}, {gaze: [Math.max(-2.6, Math.min(2.6, (look.at[0] - x) / 120 * way)), Math.max(-1.8, Math.min(1.8, (look.at[1] - (y - 620 * px)) / 120))]});
    settings.face = Object.assign({}, wm.face, {eyes: eyes});
  }
  settings.pose = pose;
  plain.woman = settings;
  pen.save();
  if (moves.dy < 0) { pen.translate(0, moves.dy); }   // her hop on the beat, a kick: off the ground
  else if (moves.dy > 0) {                          // her knees bent under her sin, the hips down: her feet stay on the ground
    pen.translate(0, y); pen.scale(1, 1 - moves.dy / ((lady ? 700 : 720) * px)); pen.translate(0, -y);
  }
  if (way < 0) { pen.translate(x, 0); pen.scale(-1, 1); pen.translate(-x, 0); }
  if (moves.lean) { pen.translate(x, y); pen.rotate(moves.lean); pen.translate(-x, -y); }   // the whole of her, about her feet
  MU_BEND = moves.bend; MU_NOD = moves.nod;          // her upper body about the waist, her head about the chin (muUpper, muHead)
  try { peopleFormed(form, x, function () { muralPerson(x, y, plain, {head: 59 * size * form.tall}); }); }
  finally { MU_BEND = 0; MU_NOD = 0; }
  function at(unit, upper) {                         // a point of the figure, in the sheet's pixels, as person()'s joints are
    var p = upper ? [unit[0] + measure.B * unit[1] + (measure.A - measure.B) * measure.Y0, unit[1]] : unit;
    if (kid) { p = peopleChild(p, kid, true); }
    if (upper && moves.bend) { p = turned(p, [0, measure.Y0], moves.bend); }
    var d = pen.getTransform().transformPoint(new DOMPoint(x + p[0] * px, y + p[1] * px));
    return [d.x, d.y];
  }
  var out = {size: size * 0.82, face: way, stand: spotOf(x, y)};
  out.waist = at([0, measure.Y0], true);
  out.hip = at([0, measure.Y0 + 60], false);
  out.neck = at([4, measure.CHIN + 20], true);
  out.chin = at([8, measure.CHIN], true);
  out.crown = at([0, measure.CHIN - 100 * form.head], true);
  out.rest = out.crown;
  [["A", "far"], ["B", "near"]].forEach(function (arm) {
    var hangs = arms[arm[1]], w = (WM_W && WM_W[arm[1]]) || hangs.W;
    var last = pose[arm[1]] ? wmElbowOf(hangs.S, w, pose[arm[1]].elbow, measure) : hangs.E;
    var along = Math.hypot(w[0] - last[0], w[1] - last[1]) || 1;
    out["shoulder" + arm[0]] = at(hangs.S, true);
    out["elbow" + arm[0]] = at(last, true);
    out["wrist" + arm[0]] = at(w, true);
    out["hand" + arm[0]] = at([w[0] + (w[0] - last[0]) / along * 40, w[1] + (w[1] - last[1]) / along * 40], true);
  });
  pen.restore();
  sighted((out.crown[0] + out.chin[0]) / 2, (out.crown[1] + out.chin[1]) / 2);
  return out;
}

// (x, y) of the scene in the sheet's pixels.
function spotOf(x, y) {
  var d = pen.getTransform().transformPoint(new DOMPoint(x, y));
  return [d.x, d.y];
}

// wmElbow() with the bones of who is drawn (it reads them while the figure is being drawn).
function wmElbowOf(S, W, toward, measure) {
  var upper = WM_UPPER, fore = WM_FORE;
  WM_UPPER = measure.UPPER; WM_FORE = measure.FORE;
  try { return wmElbow(S, W, toward); } finally { WM_UPPER = upper; WM_FORE = fore; }
}

// ---------- a walk painted once ----------
// look.poses: N, for a painted figure walking in a crowd or far off: one stride of hers is painted N times onto sheets the first
// time it is asked for (8 is plenty: the owner saw no difference from 16, or from painting her live, 2026-11-02), and stamped after,
// about 2 ms a figure against 100 to 200. Her gold repeats with the stride and her cloth moves only with her walk: the clock is held
// on the sheets, or the stride would not close. Painted as ever: one standing, reaching, holding a hand out, looking at something,
// seated, in the wai, winking, turning or alive. Another size, or anything else about the look, is another set of sheets: 8 poses
// take about 2 to 7 MB and a second or more, so call peoplePoses(look) before the film begins. bend goes by twentieths.
// e.g. person(x, GROUND, cast("princess", {poses: 8, step: t, stride: 1, size: 0.8, id: "p1"}));
var PEOPLE_POSES = {}, PEOPLE_POSES_MADE = 0, PEOPLE_POSES_MOST = 64, PEOPLE_POSES_PEN = null;
var PEOPLE_POSES_LIVE = ["wai", "wink", "front", "alive"], PEOPLE_POSES_HELD = 1.1;

function peopleBendOf(look) { return Math.round((look.bend || 0) * 20) / 20 || undefined; }

function peopleCanStamp(look, wm) {
  if (!look.poses || !look.step || look.reachA || look.reachB || look.handA || look.handB || look.at || look.floor) { return false; }
  return PEOPLE_POSES_LIVE.every(function (k) { return !look[k] && !wm[k]; });
}

// The sheets of this look: [{canvas, x, y, w, h, joints}, ...], painted if they are not yet; null past PEOPLE_POSES_MOST sets
// (a look that changes every frame would make a set a frame: that one is painted live).
// e.g. peoplePoses(cast("princess", {poses: 8, size: 0.8, stride: 1}));
function peoplePoses(look) {
  var key = JSON.stringify(look, function (k, v) { return k === "id" || k === "step" || k === "face" || k === "bend" ? undefined : v; }) + "|" + peopleBendOf(look) + "|" + PIX;
  if (PEOPLE_POSES[key]) { return PEOPLE_POSES[key]; }
  if (PEOPLE_POSES_MADE >= PEOPLE_POSES_MOST) { warn("More than " + PEOPLE_POSES_MOST + " sets of poses: is something in the look changing every frame? Painting her live."); return null; }
  var size = look.size || 1, wide = FILM.width, high = Math.max(FILM.height, Math.ceil((size * 480 + 200) * PIX));
  var foot = high / PIX - 120, mid = wide / PIX / 2, poses = [], real = pen, held = clock, seen = SIGHTS.on, hop = STYLE.hop;
  if (!PEOPLE_POSES_PEN) { PEOPLE_POSES_PEN = document.createElement("canvas").getContext("2d"); }
  var sheet = PEOPLE_POSES_PEN.canvas, small = document.createElement("canvas").getContext("2d", {willReadFrequently: true}), SHRINK = 4;
  sheet.width = wide; sheet.height = high;           // as wide as the film's: the gold's light goes by it
  small.canvas.width = Math.ceil(wide / SHRINK); small.canvas.height = Math.ceil(high / SHRINK);
  pen = PEOPLE_POSES_PEN; clock = PEOPLE_POSES_HELD; SIGHTS.on = false; STYLE.hop = false;   // painted at rest: her hop goes on as she is stamped
  try {
    for (var i = 0; i < look.poses; i++) {
      pen.setTransform(1, 0, 0, 1, 0, 0);
      pen.clearRect(0, 0, wide, high);
      pen.setTransform(PIX, 0, 0, PIX, 0, 0);
      var joints = peoplePainted(mid, foot, Object.assign({}, look, {poses: undefined, face: undefined, bend: peopleBendOf(look), id: "poses/" + PEOPLE_POSES_MADE, step: 1 + i / look.poses}), peopleSettings(look));
      small.clearRect(0, 0, small.canvas.width, small.canvas.height);
      small.drawImage(sheet, 0, 0, small.canvas.width, small.canvas.height);
      var a = small.getImageData(0, 0, small.canvas.width, small.canvas.height), x0 = wide, x1 = 0, y0 = high, y1 = 0;
      for (var n = 3, at = 0; n < a.data.length; n += 4, at++) {
        if (a.data[n]) {
          var px = at % a.width, py = (at - px) / a.width;
          x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
        }
      }
      x0 = Math.max(0, (x0 - 4) * SHRINK); y0 = Math.max(0, (y0 - 4) * SHRINK);
      var w = Math.min(wide - x0, (x1 + 5) * SHRINK - x0), h = Math.min(high - y0, (y1 + 5) * SHRINK - y0), crop = document.createElement("canvas");
      crop.width = w; crop.height = h;
      crop.getContext("2d").drawImage(sheet, x0, y0, w, h, 0, 0, w, h);
      var rel = {};
      Object.keys(joints).forEach(function (k) { rel[k] = Array.isArray(joints[k]) ? [joints[k][0] / PIX - mid, joints[k][1] / PIX - foot] : joints[k]; });
      poses.push({canvas: crop, x: x0 / PIX - mid, y: y0 / PIX - foot, w: w / PIX, h: h / PIX, joints: rel});
    }
  } finally { pen = real; clock = held; SIGHTS.on = seen; STYLE.hop = hop; }
  PEOPLE_POSES_MADE++;
  PEOPLE_POSES[key] = poses;
  return poses;
}

// The pose for this step, stamped with her feet at (x, y). Returns her joints, as peoplePainted() does.
function peopleStamp(x, y, look, poses) {
  var n = poses.length, pose = poses[((Math.round(look.step * n) % n) + n) % n], way = look.face || 1, out = {};
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun;
  var moves = peopleMoves(x, y, Object.assign({}, look, {bend: undefined}), lady);   // her hop and lean as person()'s (her bend is painted)
  pen.save();
  if (moves && moves.dy < 0) { pen.translate(0, moves.dy); }
  else if (moves && moves.dy > 0) { pen.translate(0, y); pen.scale(1, 1 - moves.dy / (pose.h || 500)); pen.translate(0, -y); }
  if (way < 0) { pen.translate(x, 0); pen.scale(-1, 1); pen.translate(-x, 0); }
  if (moves && moves.lean) { pen.translate(x, y); pen.rotate(moves.lean); pen.translate(-x, -y); }
  pen.drawImage(pose.canvas, x + pose.x, y + pose.y, pose.w, pose.h);
  Object.keys(pose.joints).forEach(function (k) {
    var j = pose.joints[k];
    out[k] = Array.isArray(j) ? spotOf(x + j[0], y + j[1]) : j;
  });
  pen.restore();
  out.face = way;
  sighted((out.crown[0] + out.chin[0]) / 2, (out.crown[1] + out.chin[1]) / 2);
  return out;
}

// PEOPLE_WOMEN: "painted" (the kit's way since 2026-11-07) or "rig": a page that sets "rig" after people.js has every woman
// and girl drawn by person()'s own figure in her own look, what the look has for a painted figure (woman, child, and the
// painted keys) left out (the owner, 2026-11-09, of the hero film: "Use the old rig style women but adjust their
// measurements to be like the painted women and new style men": with STYLE.women 1). Men and boys stay as they are.
var PEOPLE_WOMEN = "painted";
function peopleRigLook(look) {
  var own = {};
  Object.keys(look).forEach(function (k) { if (LOOK_KEYS[k] && look[k] !== undefined) { own[k] = look[k]; } });
  return own;
}

person = function (x, y, look) {
  var wm = peopleSettings(look);
  if (wm && PEOPLE_WOMEN === "rig" && (look.lady !== undefined ? !!look.lady : !!look.bun)) { return PEOPLE_PERSON(x, y, peopleRigLook(look)); }
  if (wm && peopleCanStamp(look, wm)) {
    var poses = peoplePoses(look);
    if (poses) { return peopleStamp(x, y, look, poses); }
  }
  return wm ? peoplePainted(x, y, look, wm) : PEOPLE_PERSON(x, y, look);
};

// ---------- the generator ----------
// A draw of its own: rnd() 0 to 1, pick(list), chance(p), between(a, b), the same for the same seed (mulberry32).
// e.g. peopleDraw(17).pick(["high", "wong"]);
function peopleDraw(seed) {
  var s = seed >>> 0;
  function rnd() {
    s = (s + 0x6D2B79F5) >>> 0;
    var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  return {rnd: rnd, pick: function (list) { return list[Math.floor(rnd() * list.length)]; },
          chance: function (p) { return rnd() < p; }, between: function (a, b) { return a + (b - a) * rnd(); }};
}

var MIX_HOLDS = {lotus: "maiden", garland: "princess", khan: "grandmother", fan: "court", lantern: "festival", parasol: "lue", cloth: "weaver"};
var MIX_SHIRTS = ["#f4ecdc", "#f1d3cf", "#d4502e", "#f0c75a", "#f2e2c4", "#34507a", "#2e3448", "#fbf7ef", "#2e2f3e", "#6a3f52", "#3f6a4a", "#8a2a3a"];
var MIX_SKINS = ["#e8bf80", "#eec2a4", "#c98a5e", "#d9a06c", "#e6bd96", "#d4a07a", "#d29a6c", "#dcae84", "#ecc8a4"];
var MIX_HAIRS = ["#17110e", "#1d1410", "#24150e", "#120e14", "#1a1214"];
var MIX_WRAPS = [["#f6f1e6", "#e07a98"], ["#f2b8c6", "#f6f1e6"], ["#b8294a", "#e0b23a"], ["#f6f1e6", "#3f6a4a"]];
var MIX_PARASOLS = [["#c8402e", "#f2c36a"], ["#2f6a8a", "#f6f1e6"], ["#e0b23a", "#c8402e"], ["#3f7a46", "#f2c36a"]];

// A new woman, mixed from the kit's pieces: a face from the ten's, changed a little; a way with the hair and what is set in it;
// earrings, a necklace, a belt; a blouse's finish; one of the woven sabai; a sin and a woven teen jok at its foot; what she
// holds and the pose that goes with it; her skin, hair, lipstick and metal. seed: any number, the same woman for the same
// number; more: the look's keys to change. Returns a look for person().
// e.g. person(700, GROUND, castMix(17, {size: 1.4, id: "mix17"}));
function castMix(seed, more) {
  var m = peopleDraw(seed), names = Object.keys(MURAL_WOMEN), face = JSON.parse(JSON.stringify(WM_FACES[m.pick(names)]));
  face.jaw = {cheek: m.between(-2.5, 3), corner: [m.between(-3, 3.5), m.between(-1.5, 2.5)], chin: [m.between(-1, 2.5), m.between(-1.5, 4)], far: m.between(-1, 1.5)};
  face.brows = Object.assign({}, face.brows, {lift: m.between(-1.5, 2.5), arch: m.between(-1.5, 3), long: m.between(-2, 5), thick: m.between(0.8, 1.3)});
  face.eyes = Object.assign({}, face.eyes, {gaze: [m.between(-2.4, 1.4), m.between(-1.6, 1.4)], tilt: m.between(-0.02, 0.2), open: m.between(-0.8, 1.2), liner: m.chance(0.3) ? m.between(0.4, 1) : 0});
  face.mu = Object.assign({}, face.mu, {nose: m.pick(["exact", "lanna", "rosy", "between", "thaisoft", "button", "low"]), tara: m.between(0.15, 0.95), cheek: m.pick(["swept", "dancer", "soft"])});
  face.feel = {smile: m.between(0, 0.8), lids: m.chance(0.3) ? m.between(0.1, 0.45) : 0, wonder: m.chance(0.2) ? 0.25 : 0};
  face.dimple = m.chance(0.25); face.jon = m.chance(0.2); face.mole = m.chance(0.15) ? [m.between(3, 8), m.between(-24, -18)] : undefined;
  face.hairdo = m.pick(["mural", "high", "wong", "low", "ipun", "lue"]); face.tail = face.hairdo !== "lue" && face.hairdo !== "wong" && m.chance(0.2);
  face.wrap = m.pick(MIX_WRAPS);
  var hair = [], ornaments = Object.keys(WM_HAIR);
  if (face.hairdo !== "lue") { var k = Math.floor(m.between(0, 3.4)); while (hair.length < k) { var o = m.pick(ornaments); if (hair.indexOf(o) < 0) { hair.push(o); } } }
  var holds = m.chance(0.7) ? m.pick(Object.keys(MIX_HOLDS)) : null, poseOf = holds ? MIX_HOLDS[holds] : m.pick([null, null, "dancer", "orchid"]);
  var woman = {face: face, hair: hair, earring: m.pick(["dokhu", "pearl", "tube"]), neck: m.pick([undefined, "pendant", "pearls", "sangwan"]),
               belt: m.pick([undefined, "panneng", "chains"]), chain: false, nails: !holds && m.chance(0.4),
               blouse: m.pick(["flowers", "clouds", "plain", "lue", ["dots", "#fbf3ee"], ["lace", "#d8ccb8"]]),
               jok: [m.pick(["maechaem", "nan", "long"]), m.pick(Object.keys(WEAVE_PALETTES)), m.between(1.3, 1.7)],
               holds: holds || undefined, cloth: m.pick(Object.keys(SABAI_WEAVES)), parasol: m.pick(MIX_PARASOLS),
               pose: poseOf ? MURAL_WOMEN[poseOf].woman.pose : undefined};
  if (poseOf !== "dancer" && poseOf !== "orchid" && !woman.nails) { woman.hands = "normal"; }   // a dancer keeps the dancer's hand
  var old = m.chance(0.12), sabaiName = m.pick(Object.keys(SABAI_WEAVES));
  return cast(m.pick(["lady", "maiden", "dancer", "weaver", "sinuan"]), Object.assign({shirt: m.pick(MIX_SHIRTS), sin: m.pick([0, 1, 2, WM_SIN.braid, WM_SIN.gold, WM_SIN.zigzag]), sabai: sabaiLook(sabaiName),
    jewels: m.pick(["gold", "silver"]), bangles: Math.floor(m.between(2, 6)), skin: m.pick(MIX_SKINS), hair: old ? "#d8d2c8" : m.pick(MIX_HAIRS),
    makeup: old ? "betel" : m.pick(Object.keys(MU_MAKEUP)), age: old ? 0.65 : 0, woman: woman}, more || {}));
}
