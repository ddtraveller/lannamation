// mural_men.js - the mural figure's men and children, each his or her own (2026-10-30), over mural_women.js (load it
// after mural.js, mural_luxe.js, mural_thangka.js and mural_women.js). The owner: "start on men and children updates to
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
//                (0 to 1), face.pin (a juk's pin: "silver" or "gold"), face.makeup (a name of MU_MAKEUP: a prince's)
//   holds        what a man carries: "pole" (khan haap, a basket before and one behind him), "drum" (klong yao),
//                "dap" (a sword in each hand), "stick", "sueng" (the lute); or a woman's (lotus, garland, ...)
//   bag          [cloth, stripes]: the woven shoulder bag (thung yaam)
//   trousers     a colour: tieo sado, wide trousers to the calf
//   child        -1 to 0: a child's measure (a child's settings have -1 unless they say)
// castMan(name, more) and castChild(name, more) give the look of one of the ten, as cast() gives the cast's.
// A person without "man", "child" or "woman" is drawn as before.
// e.g. STYLE.figure = "mural"; person(700, GROUND, castMan("farmer", {size: 1.4})); person(900, GROUND, castChild("boy", {size: 0.86}))

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
  pen.save(); pen.scale(grow, grow);
  try {
    if (lady && !MN_CHILD_HAIR[fc.hairdo]) { return MN_KIT.wmHead(look, lady, skin, fc); }
    return mnHead(look, lady, skin, fc);
  } finally { pen.restore(); }
};
var MN_CHILD_HAIR = {juk: true, kae: true, pia: true, shaved: true, poy: true};
function mnHead(look, lady, skin, fc) {
  var hair = look.hair || MU.hair, hd = fc.hairdo || "knot", jaw = lady || WM.child ? 0 : 4;
  if (hd === "knot" || hd === "lue") { muBun(-6, -108, 13, hair, look); }
  if (hd === "juk" || hd === "pia") { mnJuk(hair, fc.jukFlowers !== false, fc.pin); }
  var shaven = hd === "juk" || hd === "shaved" || hd === "kae" || hd === "pia" || hd === "poy";
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
var MN_SHOULDER = {near: [-70, -562], far: [44, -560]};
var MN_KIT_HOLDS = wmHolds;
wmHolds = function (look) {
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
["bag"].forEach(function (k) { WOMAN_KEYS[k] = true; });

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
// its tube (mFill); after the tube, a wide leg of the trousers from the cloth's hem to the calf.
var MN_LEG = false, MN_KIT_FOOT = muFoot, MN_KIT_FILL = mFill;
muFoot = function (x, y, len, skin) { var r = MN_KIT_FOOT(x, y, len, skin); MN_LEG = !!(WM && WM.trousers); return r; };   // the leg's tube is the next fill after its foot
mFill = function (rec, colour, grain) {
  MN_KIT_FILL(rec, colour, grain);
  if (!MN_LEG) { return; }
  MN_LEG = false;
  var xs = [], ys = [];
  rec.subs.forEach(function (sub) { sub.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), top = Math.min.apply(null, ys), hem = -150, mid = (x0 + x1) / 2;
  var leg = new MPath().M(mid - 24, top).L(mid + 24, top).C(mid + 30, top + 80, mid + 30, hem - 30, mid + 28, hem)
    .Q(mid, hem + 6, mid - 28, hem).C(mid - 30, hem - 30, mid - 30, top + 80, mid - 24, top).Z();
  MN_KIT_SHAPE(leg, WM.trousers, 8, 1.3);
  pen.save(); pen.clip(leg.path);
  mLine(new MPath().M(mid - 6, top + 10).C(mid - 2, top + 80, mid - 8, hem - 40, mid - 4, hem).M(mid + 14, top + 30).C(mid + 16, top + 90, mid + 12, hem - 30, mid + 16, hem), muShade(muColour(WM.trousers)), 1);
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
