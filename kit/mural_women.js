// mural_women.js - the mural figure's women, each her own (2026-10-30), over mural.js, mural_luxe.js and
// mural_thangka.js (load it after them). The owner gave five Royal Thai Art paintings of women: "Use each of those as a
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
// e.g. STYLE.figure = "mural"; person(700, GROUND, castWoman("dancer", {size: 1.5}));
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
//   blouse   its finish: "flowers" (mural_thangka.js's), "clouds", "plain", "lue" (the Tai Lue jacket), ["dots", colour],
//            ["lace", colour]
//   scarf    [outside, lining, curve, width]: a long cloth from the far hand to the near hand and on (curve(farW, nearW)
//            gives [[a, c1, c2, b, width, turn], ...] cubic pieces)
//   holds    in the near hand: "lotus", "garland", "khan" (a bowl of flowers), "fan", "lantern", "parasol" (parasol:
//            [paper, flowers]); between both: "cloth" (cloth: a SABAI_WEAVES name)
//   jok      [town, palette, taller]: her sin's foot a woven teen jok (weaving.js teenJok: "maechaem", "nan" or "long";
//            one of WEAVE_PALETTES), "taller" times the sin's own foot band
// Her woven sabai is painted once and laid along the band (not thread by thread); she sways slowly about her feet,
// and her gold and her stones catch the light as she does.

var WM = null, WM_W = {};                           // the woman being drawn, and where her wrists went
var WM_A = -0.028, WM_B = 0.07, WM_Y0 = -430, WM_CHIN = -600;   // mural.js's lady: her shear and her chin
var WM_UPPER = 95, WM_FORE = 86;                    // the lady's arm bones, measured off mural.js's own arm

var WM_KIT = {muralPerson: muralPerson, muArm: muArm, muHand: muHand, muBunGold: muBunGold, muEarring: muEarring,
              muCollar3q: muCollar3q, muArmlet: muArmlet, muBelt: muBelt, thLongChain: thLongChain, thGoldWork: thGoldWork,
              muGold: muGold, muBead: muBead, muJewel: muJewel, sabaiThreads: sabaiThreads, sabaiBackThreads: sabaiBackThreads};

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
var WM_ARM = null, WM_LATE = null;
muArm = function (S, E, W, wide, sleeve, skin, look, outward, bend, lady) {
  var side = outward > 0 ? "far" : "near", p = WM && WM.pose && WM.pose[side];
  if (!p) { WM_W[side] = W; return WM_KIT.muArm(S, E, W, wide, sleeve, skin, look, outward, bend, lady); }
  var w = p.w, e = wmElbow(S, w, p.elbow);
  WM_W[side] = w;
  var go = function () {
    WM_ARM = p;
    try { WM_KIT.muArm(S, e, w, wide, sleeve, skin, look, outward, p.fingers !== undefined ? p.fingers : bend, lady); }
    finally { WM_ARM = null; }
    if (side === "near" && WM.scarf) { wmScarf(); }
  };
  if (p.late) { WM_LATE = go; } else { go(); }
};
muHand = function (x, y, angle, back, bend, skin, lady) {
  var p = WM_ARM;
  if (p && p.wrist) { angle += p.wrist * back; }
  if (WM && WM.hands === "normal") { wmHandNormal(x, y, angle, back, bend, skin, lady); }
  else { WM_KIT.muHand(x, y, angle, back, bend, skin, lady); }
  if (WM && WM.nails) { wmNails(x, y, angle, back, bend); }
};
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
    var b = bend * f[1], L = f[0], tip = [f[2] + L * Math.sin(b) * 0.8 + i * 0.3, f[3] + L * Math.cos(b * 0.8)];
    var mid = [f[2] + L * Math.sin(b * 0.25) * 0.3, f[3] + L * 0.52], dx = tip[0] - mid[0], dy = tip[1] - mid[1], l = Math.hypot(dx, dy) || 1;
    dx /= l; dy /= l;
    var long = 30 + i * 2, curl = -9 - 3 * i;       // each nail runs on from the tip and curls back, as brass does
    var end = [tip[0] + dx * long - dy * curl, tip[1] + dy * long + dx * curl];
    var c1 = [tip[0] + dx * long * 0.55, tip[1] + dy * long * 0.55];
    var nail = new MPath().M(tip[0] - dy * 2.4, tip[1] + dx * 2.4).Q(c1[0] - dy * 1.4, c1[1] + dx * 1.4, end[0], end[1])
      .Q(c1[0] + dy * 1.2, c1[1] - dx * 1.2, tip[0] + dy * 2.4, tip[1] - dx * 2.4).Z();
    muInGold(function () { muGold(nail); });
  });
  pen.restore();
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
  if (WM_LATE) { var go = WM_LATE; WM_LATE = null; go(); }   // an arm across the body: over the sabai, under the belt
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
    var size = teenJok(brush, 0, 0, w, {town: town, palette: WEAVE_PALETTES[palette], cell: 7});
    WM_JOK[key] = {canvas: got, w: size.w, h: size.h};
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

// ---------- what she holds, over everything ----------
// lotus, garland, khan: a bowl of flowers (the near hand); cloth: a length of her own weaving hung from
// both hands (wm.cloth, a SABAI_WEAVES name); parasol: a Bo Sang paper parasol over her shoulder (wm.parasol colours);
// fan: a red lacquer fan with gold; lantern: a paper lantern (khom) hung from a stick, lit
function wmHolds(look) {
  var h = WM.holds, w = WM_W.near, f = WM_W.far;
  if (!h || !w) { return; }
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
muHead = function (look, lady, skin) {
  var fc = WM && WM.face;
  if (!fc) { return WM_HEAD.muHead(look, lady, skin); }
  var was = {};
  Object.keys(fc.mu || {}).forEach(function (k) { was[k] = MU[k]; MU[k] = fc.mu[k]; });
  WM_FACE = fc;
  try { wmHead(look, lady, skin, fc); }
  finally { WM_FACE = null; Object.keys(was).forEach(function (k) { MU[k] = was[k]; }); }
};
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

// muHead (mural.js), a lady's, with her own outline, hairline, brows and eyes; chin at (0, 0), crown at (0, -100)
function wmHead(look, lady, skin, fc) {
  var hair = look.hair || MU.hair;
  var hd = fc.hairdo || (look.bun === "wong" ? "wong" : "mural"), K = WM_KNOTS[hd];
  if (fc.tail) { wmTail(K, hair); }                 // behind everything of the head
  if (hd === "wong" || hd === "lue") { if (!WM.crown) { wmWongLoop(K, hair); } muBun(K[0], K[1], K[2], hair, look); }
  var mass = new MPath().M(30, -88).C(14, -106, -32, -108, -48, -80).C(-58, -60, -54, -34, -38, -18).C(-30, -12, -20, -14, -14, -22).L(30, -60).Z();
  mShape(mass, hair, 5, 1.3);
  if (hd !== "wong" && hd !== "lue") {
    muBun(K[0], K[1], K[2], hair, look);
    if (hd === "high") { wmComb(K, "gold"); }
    if (hd === "low") { wmComb(K, "ivory"); }
    muBunGold(K[0], K[1], K[2]);
  }
  var k = MU.tara || 0, J = fc.jaw || {}, cw = J.cheek || 0, co = J.corner || [0, 0], ch = J.chin || [0, 0], fw = J.far || 0;
  var face = new MPath().M(-26, -73)
    .C(-33 - 3 * k - cw, -52, -32 - 3 * k - cw, -20 + co[1] * 0.5, -14 - 2 * k + co[0], -6 + k + co[1])
    .C(-5 + ch[0] * 0.4, 1 + 1.5 * k + ch[1], 11 + ch[0] * 0.8, 2.5 + 1.5 * k + ch[1], 19.5 + k + ch[0], -2 + k + ch[1])
    .C(29 + 2 * k + fw, -7 + ch[1] * 0.5, 35.5 + 2 * k + fw, -22, 36 + 1.2 * k + fw * 0.5, -38)
    .C(37, -46, 34, -52, 35.5, -59)
    .C(38.5, -70, 37, -86, 27, -92)
    .C(12, -98, -14, -94, -26, -73).Z();
  mFill(face, skin, 7);
  pen.save(); pen.clip(face.path);
  var paint = lady ? muMakeup(look) : null, feel = muFeelOf(look);
  muCheeks(lady, paint, feel);
  muFaceLines(look, feel);
  if (fc.dimple) {                                  // the dimple: a short soft crease beside the near corner
    var up = 1.6 * Math.max(feel.smile || 0, feel.laugh || 0);
    muGlow(7.6, -15.6 - up, 2.2, 3, "150, 70, 55", 0.18);
    mLine(new MPath().M(8.6, -18.4 - up).Q(7.4, -16.2 - up, 8.2, -13.8 - up), "rgba(130, 60, 48, 0.45)", 0.55);
  }
  if (fc.mole) { muGlow(fc.mole[0], fc.mole[1], 1.1, 1.1, "60, 30, 22", 0.85); }
  pen.restore();
  mBrush(face, muInk(muColour(skin)), 1.3);
  var fh = Math.max(-3, Math.min(2, fc.forehead || 0));   // the hairline: up or down in its middle, its ends where they were
  var edge = new MPath().M(-28, -70).C(-18, -89 - fh, 8, -97 - fh, 28, -91).C(16, -104, -24, -106, -40, -86).L(-42, -50).L(-28, -47).C(-31, -56, -31, -64, -28, -70).Z();
  mShape(edge, hair, 3, 1.2);
  var strands = new MPath(), sheen = muColour(blend(hair, MU.sheen, 0.4));
  for (var s = 0; s < 12; s++) {
    var u = s / 11;
    strands.M(24 - u * 40, -92 + u * 8).C(4 - u * 30, -100 + u * 2, -30 - u * 10, -94 + u * 14, -46 - u * 2, -70 + u * 26);
  }
  pen.save(); pen.clip(mass.path); mLine(strands, sheen, 1.1); pen.restore();
  if (hd === "ipun") { wmIpun(hair); }
  if (hd === "wong") { muBunGold(K[0], K[1], K[2]); }   // a knot on the crown: what hangs from it hangs down the back, over the hair
  if (hd === "lue") { wmLueWrap(fc.wrap || ["#f4f0e6", "#e88aa8"]); }
  if (fc.jon) { wmJon(hair); }
  var lobe = MU.ear !== null ? muEarPainted(skin, MU.ear) : [-25, -34];
  muEarring(lobe[0], lobe[1]);
  var E = fc.eyes || {};
  wmEye([-4, -50 + (E.y || 0)], 16 * (E.long || 1), -1, lady, paint, feel, E);
  wmEye([25, -51 + (E.y || 0)], 10.5 * (E.long || 1), 1, lady, paint, feel, E);
  // the brows: her own arch, length and fall, then the feeling's turn as mural.js gives it
  var B = fc.brows || {}, bl = B.lift || 0, ba = B.arch || 0, bo = B.long || 0, bf = B.fall || 0;
  var painted = MU.nose === "exact" || MU.nose === "exactink";
  pen.save(); muBrowTurn(feel, -7, -67 - bl, 1);
  mLine(new MPath().M(8, -62 - bl).Q(-4, -71 - bl - ba, -22 - bo, -65 - bl + bf), muColour(hair), 1.6 * (B.thick || 1));
  pen.restore();
  pen.save(); muBrowTurn(feel, 28.4, -62.2 - bl, -1);
  if (painted) { pen.translate(0, -bl); muInkLine(NOSE_LANNA.brow, NOSE_PAINT.brow); }
  else { mLine(new MPath().M(17, -62 - bl).Q(26, -69 - bl - ba * 0.7, 35 + bo * 0.4, -65 - bl + bf * 0.7), muColour(hair), 1.6 * (B.thick || 1)); }
  pen.restore();
  muNose(MU.nose || "now", skin, lady);
  if (MU.tara) {
    muGlow(21.5, -27.6, 5, 2.4, "140, 70, 60", 0.14 * MU.tara);
    muInkLine([[18.6, -31.2, 0.25], [19.6, -29.4, 0.35], [21.4, -28.6, 0.4], [23.2, -29.2, 0.35], [24.2, -30.8, 0.25]].map(function (q) { return [q[0], q[1], q[2] * MU.tara]; }), NOSE_PAINT.nostril);
  }
  muLipsPainted(lady, skin, MU.mouth, paint, feel);
}

// muEye (mural.js) with her own eye (E: wm.face.eyes): its tilt, its opening, its crease, where it looks, its wing
function wmEye(c, long, way, lady, paint, f, E) {
  pen.save();
  pen.translate(c[0], c[1]); pen.rotate(-way * (E.tilt || 0)); pen.translate(-c[0], -c[1]);
  var inner = [c[0] - way * long / 2, c[1] + 1], outer = [c[0] + way * long / 2, c[1] - 0.6];
  var v = function (k) { return f[k] || 0; };
  var wide = Math.max(v("wonder"), v("fear"), 0.6 * v("rapt")), down = Math.max(v("lids") * (1 - v("laugh")), 0.3 * v("sad"));
  var open = E.open || 0;
  var upIn = Math.max(-0.6, 4 + open + 1.8 * wide - 4.4 * down - 2.6 * v("anger") - 0.4 * v("worry"));
  var upOut = Math.max(-0.6, 4 + open + 1.8 * wide - 4.4 * down - 1.2 * v("anger") - 1.8 * v("sad") - 1.2 * v("worry"));
  var low = 2.6 + 0.9 * wide - 2.4 * Math.max(0.7 * v("smile"), 0.6 * v("full")), gaze = -1.6 * v("rapt") + 0.9 * v("sad");
  var g = E.gaze || [0, 0], flick = E.flick === undefined ? 1 : E.flick;
  if (paint && MU.cheek === "dancer") {
    muGlow(c[0] + way * long * 0.1, c[1] - 4.5, long * 0.62, 5.5, paint.lid, 0.34);
    muGlow(outer[0], outer[1] - 2.5, long * 0.3, 3.4, paint.lidDeep, 0.32, -way * 0.35);
  }
  if (v("laugh") > 0.5) {
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
  var ix = c[0] + long * 0.22 + g[0], iy = c[1] - 1.2 + gaze + g[1], ir = (long * 0.15 + 0.9) * (E.iris || 1);
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
  WM = wm; WM_W = {}; WM_LATE = null;
  // her sway: slow, about her feet, in her own time; the gold follows it (WM_TILT)
  var own = ownTime(look.id || "w");
  WM_TILT = 0.006 * Math.sin(2 * Math.PI * (clock + own) / 4.6) + 0.002 * Math.sin(2 * Math.PI * (clock + own) / 1.9);
  pen.save(); pen.translate(x, y); pen.rotate(WM_TILT); pen.translate(-x, -y);
  if (wm.holds === "parasol" && wm.pose && wm.pose.near) {
    pen.save(); pen.translate(x, y); pen.scale(px, px); muUpper(WM_A, WM_B, WM_Y0);
    wmParasol(wm.pose.near.w, wm.parasol || ["#c8402e", "#f2c36a"]); pen.restore();
  }
  try {
    WM_KIT.muralPerson(x, y, look, opts);
    pen.save();                                     // the figure's frame again, for what is over everything
    pen.translate(x, y); pen.scale(MU_PX, MU_PX);
    pen.save(); muUpper(WM_A, WM_B, WM_Y0); wmHolds(look); pen.restore();
    if (wm.crown) {
      var neckX = (WM_A - WM_B) * WM_Y0 + WM_B * WM_CHIN;
      pen.save(); pen.translate(8 + neckX, WM_CHIN + NECK_DROP[0]); pen.rotate(-0.05); wmCrown(); pen.restore();
    }
    pen.restore();
  } finally { pen.restore(); WM = null; WM_LATE = null; WM_TILT = 0; }
}

// ---------- three more sin ----------
// The dancer's black with red, green and a gold braid; a gold sin with maroon and a maroon foot; maroon with green and a
// gold zigzag. Pushed onto the kit's SINS; WM_SIN names where each went.
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
                                   [0.84, "#e0b23a", 1.8, "braid"], [0.94, "#e0b23a", 1.4, "diamonds"]]])
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
              woman: {face: WM_FACES.celestial, jok: ["long", "long", 1.6], blouse: "clouds", hair: [], crown: true, armlet: true, earring: "dokhu",
                      pose: {far: {w: [64, -770], elbow: [1, -0.3], wrist: -0.5, fingers: -0.3}, near: {w: [-128, -425], elbow: [-0.4, 1], wrist: 0.2, fingers: 0.3}},
                      scarf: ["#2a2433", "#c8a24a", function (f, n) {
                        return [[f, wmAdd2(f, [-90, 30]), wmAdd2(n, [60, -140]), n, 1.5, 0], [n, wmAdd2(n, [-30, 90]), wmAdd2(n, [40, 230]), wmAdd2(n, [0, 410]), 2, 0.6]];
                      }, 9]}},
  maiden: {cast: "maiden", say: "a maiden with a lotus bud",
           look: {shirt: "#f1d3cf", sin: 0, sabai: sabaiLook("nan"), jewels: "silver", skin: "#eec2a4", hair: "#1d1410", makeup: "rose"},
           woman: {face: WM_FACES.maiden, jok: ["nan", "nanIndigo", 1.6], blouse: ["dots", "#fbf3ee"], hair: ["jasmine", "gardenia"], earring: "pearl", neck: "pearls",
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
             woman: {face: WM_FACES.princess, jok: ["nan", "nan", 1.6], blouse: ["dots", "#ffffff"], hair: ["maiwai", "gardenia", "yong"], earring: "dokhu", neck: "sangwan",
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
          woman: {face: WM_FACES.court, jok: ["nan", "maechaem", 1.6], blouse: ["lace", "#d8ccb8"], hair: ["gardenia"], earring: "pearl", neck: "pearls", belt: "panneng", chain: false,
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
                  chain: true, blouse: true, scarf: true, holds: true, cloth: true, parasol: true, jok: true, hands: true};
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
