// people.js - the twenty painted people, drawn by person() and named in cast(), and the generator that mixes new women.
// The owner, 2026-11-01: "Some new sprites were created. I want them moved to the old model system and to get rid of the
// new system", then of what to keep: the figure itself, its faces, hair and hands, and "a system that could generate these
// kind of women figures". A look with `woman`, `man` or `child` is painted by the mural painters (load this file last,
// after weaving.js, mural.js, mural_luxe.js, mural_thangka.js, mural_women.js, mural_men.js and mural_seated.js); any other
// look is person()'s own, so both can share a scene. person() works out the arms: handA, handB, reachA and reachB go
// through its rig on a sheet nobody sees, and the painted arm takes the place the rig gives. A walk (step, stride, so
// stroll()), a wai, a seat (floor) and a look (at) are taken by the figure; face -1 mirrors it. It is always drawn in
// three-quarter view: turn, twist, the hop and a lean (bend) are not read. Returns joints as person() does, where the painted figure has them.
// e.g. person(700, GROUND, cast("naildancer", {size: 1.4}));
//      var w = stroll(t, 200, 1500, 0, cast("princess")); person(w.x, GROUND, w.look);
//      person(700, GROUND, castMix(17, {size: 1.4}));

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

// A look's painted settings (a name of the twenty's, or the settings themselves), or null for one of person()'s own.
// e.g. peopleSettings(cast("princess")).neck;   // "sangwan"
function peopleSettings(look) {
  if (look.woman) {
    if (typeof look.woman !== "string") { return look.woman; }
    if (MURAL_WOMEN[look.woman]) { return MURAL_WOMEN[look.woman].woman; }
    checkName("A painted woman", look.woman, MURAL_WOMEN);
    return null;
  }
  return look.man !== undefined || look.child !== undefined ? mnSettings(look) : null;
}

// person()'s joints for this frame on a sheet nobody sees, for the arms asked of it. Returns the joints; pen as it was.
function peopleRig(x, y, look, way, lady) {
  if (!PEOPLE_SINK) { var sheet = document.createElement("canvas"); sheet.width = 1; sheet.height = 1; PEOPLE_SINK = sheet.getContext("2d"); }
  var rig = {size: look.size || 1, lady: lady, bun: lady, plain: true, sabai: false, shirt: "#888888", legs: "#888888", id: "rig/" + (look.id || "n")};
  if (look.handA) { rig.handA = look.handA; }
  if (look.handB) { rig.handB = look.handB; }
  ["reachA", "reachB"].forEach(function (k) { if (look[k]) { rig[k] = [x + (look[k][0] - x) * way, look[k][1], look[k][2]]; } });
  var was = pen, figure = STYLE.figure, frame = pen.getTransform();
  pen = PEOPLE_SINK;
  pen.setTransform(frame);
  STYLE.figure = "kit";
  try { return PEOPLE_PERSON(x, y, rig); }
  finally { STYLE.figure = figure; pen.setTransform(1, 0, 0, 1, 0, 0); pen = was; }
}

// The figure's measure of a child: the point of the upper body (the units of the shear's frame) where a grown figure has it,
// to where it is drawn (forward true), or back. c: the settings' child, a negative number, or 0 for anyone grown.
function peopleChild(p, c, forward) {
  var b = Math.max(0, -c), legs = 1 - 0.15 * b, trunk = 1 - 0.12 * b;
  if (forward) { return [p[0] * trunk, MN_WAIST * legs + trunk * (p[1] - MN_WAIST)]; }
  return [p[0] / trunk, (p[1] - MN_WAIST * legs) / trunk + MN_WAIST];
}

// The painted figure on person()'s arms. x, y: where they stand; look: as person()'s; wm: peopleSettings(look). Returns joints.
function peoplePainted(x, y, look, wm) {
  checkNames("The look's name", look, Object.assign({}, LOOK_KEYS, MURAL_LOOK_KEYS));
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun, way = look.face || 1, size = look.size || 1, px = 59 * size / 100;
  var measure = lady ? MN_LADY : MN_MAN, arms = PEOPLE_ARMS[lady ? "lady" : "man"], kid = wm.child || 0, long = measure.UPPER + measure.FORE;
  var plain = Object.assign({}, look, {woman: wm, man: undefined, child: undefined, face: undefined});
  if (look.floor && lady) {                          // a seat is the figure's own, with its reaches
    muralPerson(x, y, plain, {head: 59 * size});
    return {size: size * 0.82, face: way, stand: spotOf(x, y)};
  }
  plain.reachA = plain.reachB = plain.handA = plain.handB = undefined;
  var settings = Object.assign({}, wm), pose = Object.assign({}, wm.pose || {});
  function upperOf(unit) {                           // a point in the figure's units, into the upper body's frame (its shear)
    var p = kid ? peopleChild(unit, kid, false) : unit;
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
        var target = upperOf([(reach[0] - x) * way / px, (reach[1] - y) / px]), rest = arms[arm[1]].W, u = reach[2] === undefined ? 1 : clamp(reach[2]);
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
  if (way < 0) { pen.translate(x, 0); pen.scale(-1, 1); pen.translate(-x, 0); }
  muralPerson(x, y, plain, {head: 59 * size});
  function at(unit, upper) {                         // a point of the figure, in the sheet's pixels, as person()'s joints are
    var p = upper ? [unit[0] + measure.B * unit[1] + (measure.A - measure.B) * measure.Y0, unit[1]] : unit;
    if (kid) { p = peopleChild(p, kid, true); }
    var d = pen.getTransform().transformPoint(new DOMPoint(x + p[0] * px, y + p[1] * px));
    return [d.x, d.y];
  }
  var out = {size: size * 0.82, face: way, stand: spotOf(x, y)};
  out.waist = at([0, measure.Y0], true);
  out.hip = at([0, measure.Y0 + 60], false);
  out.neck = at([4, measure.CHIN + 20], true);
  out.chin = at([8, measure.CHIN], true);
  out.crown = at([0, measure.CHIN - 100], true);
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

person = function (x, y, look) {
  var wm = peopleSettings(look);
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
