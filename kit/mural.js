// The figure as the Wat Phumin mural paints people, at the references' finish (2026-10-29; in the kit 2026-10-30, the
// owner: "Just like with the old kit style; hair, faces, outfits, jewelry should be swappable"). The owner, of set 6:
// "Go in the direction of V but recognize the quality difference in the images. Upgrade the image quality until it is
// as high as the quality in the reference images." With STYLE.figure "mural", person() draws people this way: the page
// loads weaving.js, mural.js, mural_luxe.js and mural_thangka.js after oldcartoon.js. A person is dressed from her look
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
    var b = bend * f[1], root = [f[2], f[3]], L = f[0];
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
function muUpper(A, B, Y0) { pen.transform(1, 0, B, 1, (A - B) * Y0, 0); }

var NECK_DROP = [2, 16];                              // where the chin sits below "chin": a lady's, a man's (was -4, 8)
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
    [[24, -376, 30, -198, 36, -36], [-26, -380, -24, -200, -16, -34]].forEach(function (L) {
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
    var sarong = look.sarong || "#3a4660";
    mFill(cloth2, sarong, 12);
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
