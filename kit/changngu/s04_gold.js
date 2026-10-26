// s04_gold.js - scene 4 of the film of Chang Ngu: four tuang of gold (45 s). Four shots, through black: the people of Si
// Tuang panning the Mae Sai for gold (another copy of the chronicle reads "หาร่อนคำ", panning for gold, note 63);
// close, four lumps of gold beside a small bael fruit, the size the tribute was counted in (the chronicle: "four tuang,
// the size of small bael fruits", หมากพิน); long ago, in the colour of an old picture, a Lua chief of this place offering
// the same gold to a king of Yonok, which gave the place its name; and now, two men carrying the year's gold away down
// the road to the Khom, the headman and the villagers watching them go.
var C04_LONG = 45.8;
var C04_SOUND = {calls: []};
var C04_LINES = [[1.4, 6.22, "C013"], [13.6, 18.08, "C014"], [20.8, 31.3, "C015"], [31.5, 36.46, "C016"], [37.8, 44.26, "C017"]];
var C04_CUTS = [12.6, 20.2, 37.0];
var C04_STREAM = [760, 1010];                         // where the panners stand in the Mae Sai, close

// A lump of gold, a rough round nugget the size of a small bael fruit, lit from the upper left; at (x, y), its foot.
// e.g. c04Lump(800, 700, 1);
function c04Lump(x, y, size) {
  var g = pen.createRadialGradient(x - 14 * size, y - 30 * size, 4 * size, x, y - 22 * size, 40 * size);
  g.addColorStop(0, "#fff2b0"); g.addColorStop(0.45, "#e8b83a"); g.addColorStop(1, "#9a6a1a");
  pen.fillStyle = g;
  pen.beginPath();
  for (var k = 0; k <= 16; k++) {
    var a = k / 16 * Math.PI * 2, r = 36 * size * (0.86 + 0.14 * Math.sin(a * 3 + x));
    pen.lineTo(x + Math.cos(a) * r, y - 26 * size + Math.sin(a) * r * 0.78);
  }
  pen.closePath();
  pen.fill();
  pen.strokeStyle = "rgba(90, 60, 10, 0.6)"; pen.lineWidth = 2 * size; pen.stroke();
}

// The panners: three people of Si Tuang knee-deep in the Mae Sai, bent over wide pans of wood, swirling them.
// The Mae Sai close is a water (the scenery pass, 2026-10-26: "yes" to the near stream as the hero film's pond): its
// face from the panners' shins down mirrors them and the bank behind (pinewoods.js natReflect()), rings spread round
// their shins as they work, light lies along the current, reeds stand at its edges. C04_WATER: the y of its face.
var C04_WATER = C04_STREAM[1] - 26;
var C04_RINGS = [];                                    // a ring at each panner's shins every 2.2 s, each in its own time
[600, 780, 930].forEach(function (x, i) { for (var k = 0; k < 6; k++) { C04_RINGS.push([x + 20, C04_WATER + 6 + (i % 2) * 24, k * 2.2 + i * 0.7]); } });
function c04Panning(t) {
  var village = cngVillage();
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 30, "day");
  pen.drawImage(village.back, 0, 0);
  csBand(pen, 0, 950, WIDE, 130, "#86aca8", "#4f7f7a");    // the Mae Sai, close, across the near ground
  pen.fillStyle = "#c9b285";
  pen.fillRect(0, 942, WIDE, 10);
  var sprites = [];
  [[0, 1, "villager"], [180, -1, "weaver"], [330, 1, "villager"]].forEach(function (p, i) {
    var x = C04_STREAM[0] - 160 + p[0], y = C04_STREAM[1] + (i % 2) * 24, size = 0.72;
    sprites.push({name: "panner " + i, kind: "person", x: x, y: y, draw: function () {
      var look = cngPerson(p[2], {size: size, id: "panner" + i, face: p[1], sit: 0.6, bend: 0.5, sabai: false,
                                  feel: "concerned"});
      var hands = cngMeasure(x, y, look), tilt = 0.18 * Math.sin(t * 2.2 + i);
      var at = [x + 70 * size * p[1], y - 120 * size];
      person(x, y, Object.assign(look, {reachA: [at[0] - 30 * size * p[1], at[1]], reachB: [at[0] + 30 * size * p[1], at[1]]}));
      goldPan(pen, at[0], at[1] + 4, size * 1.1, {tilt: tilt, gold: i === 1 && t > 8, t: t + i});
      void hands;
    }});
  });
  drawByZ(sprites);
  natReflect(t, C04_WATER, {ripple: 0.7, tint: "40, 80, 76", deep: 0.6, sheen: 40, line: 0});   // the stream over their shins
  ripples(pen, C04_RINGS, t);
  [[50, 0.8, 1], [WIDE - 60, 0.9, 2]].forEach(function (r) {   // reeds at its edges
    sceneryReeds(r[0], 1090, r[1], t, "back"); sceneryReeds(r[0], 1090, r[1], t, "front");
  });
  cngBeds(t, "village", "frame");
}

// Close: on a woven tray, four lumps of gold beside a small bael fruit on its twig. The tray and the floor painted once
// (the scenery pass, 2026-10-26): teak planks with their grain (scenery.js sceneryWoodGrain()), the tray woven of
// bamboo strips over and under, each with its grain, its rim bound round, its shadow on the floor; shadows under the
// bael and the lumps, and glints winking on the gold.
var C04_LUMPS = [[880, 690], [1110, 740], [1320, 680], [1520, 750]];
var C04_CLOSE = null;
function c04Close() {
  if (C04_CLOSE) { return C04_CLOSE; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), k, j;
  for (k = 0; k * 120 < 1080; k++) {                     // the teak floor, plank by plank
    b.fillStyle = ["#8a5a36", "#7e5232", "#94603a"][k % 3];
    b.fillRect(0, k * 120, WIDE, 118);
    sceneryWoodGrain(b, 0, k * 120, WIDE, 118, {along: "x", seed: k + 3, knots: 2});
    b.fillStyle = "rgba(30, 16, 8, 0.6)"; b.fillRect(0, k * 120 + 117, WIDE, 3);
  }
  var shade = b.createRadialGradient(WIDE / 2, 700, 200, WIDE / 2, 700, 820);   // the tray's shadow
  shade.addColorStop(0, "rgba(20, 10, 4, 0.5)"); shade.addColorStop(1, "rgba(20, 10, 4, 0)");
  b.save(); b.translate(0, 700); b.scale(1, 0.36); b.translate(0, -700);
  b.fillStyle = shade; b.fillRect(0, 0, WIDE, 1400);
  b.restore();
  b.save();
  b.beginPath(); b.ellipse(WIDE / 2, 660, 720, 250, 0, 0, 7); b.clip();
  b.fillStyle = "#b08850"; b.fillRect(0, 380, WIDE, 560);
  var cell = 40;                                         // the weave: strips one way and the other, over and under
  for (k = -40; k < 40; k++) {
    for (j = -12; j < 12; j++) {
      var cx = WIDE / 2 + (k - j) * cell * 0.7, cy = 660 + (k + j) * cell * 0.25;
      var over = (k + j) % 2 === 0, one = (k + 2 * j) % 3;
      b.save(); b.translate(cx, cy); b.scale(1, 0.36); b.rotate(Math.PI / 4);
      b.fillStyle = over ? ["#c99a5e", "#c2925a", "#d0a468"][(one + 3) % 3] : ["#a27a46", "#9a7242", "#aa824e"][(one + 3) % 3];
      b.fillRect(-cell / 2, -cell / 2, cell, cell);
      b.strokeStyle = "rgba(110, 76, 36, 0.35)"; b.lineWidth = 1;   // its grain, along the strip that is on top
      for (var g = -3; g <= 3; g++) {
        b.beginPath();
        if (over) { b.moveTo(-cell / 2, g * 5); b.lineTo(cell / 2, g * 5 + 1); } else { b.moveTo(g * 5, -cell / 2); b.lineTo(g * 5 + 1, cell / 2); }
        b.stroke();
      }
      b.strokeStyle = "rgba(70, 44, 18, 0.45)"; b.strokeRect(-cell / 2, -cell / 2, cell, cell);
      b.restore();
    }
  }
  var dish = b.createRadialGradient(WIDE / 2, 640, 100, WIDE / 2, 660, 720);   // its hollow, lit in the middle
  dish.addColorStop(0, "rgba(255, 236, 190, 0.18)"); dish.addColorStop(1, "rgba(60, 36, 12, 0.35)");
  b.fillStyle = dish; b.fillRect(0, 380, WIDE, 560);
  b.restore();
  b.lineWidth = 22; b.strokeStyle = "#7a5530";           // the rim, bound round with a strip
  b.beginPath(); b.ellipse(WIDE / 2, 660, 720, 250, 0, 0, 7); b.stroke();
  b.lineWidth = 4; b.strokeStyle = "rgba(230, 196, 140, 0.6)";
  b.beginPath(); b.ellipse(WIDE / 2, 654, 714, 244, 0, Math.PI * 1.05, Math.PI * 1.95); b.stroke();
  b.strokeStyle = "rgba(60, 36, 14, 0.7)"; b.lineWidth = 2;
  for (k = 0; k < 90; k++) {
    var a = k / 90 * Math.PI * 2;
    b.beginPath(); b.moveTo(WIDE / 2 + Math.cos(a) * 712, 660 + Math.sin(a) * 242); b.lineTo(WIDE / 2 + Math.cos(a + 0.02) * 728, 660 + Math.sin(a + 0.02) * 258); b.stroke();
  }
  C04_CLOSE = paper;
  return paper;
}
// A soft shadow on the tray at (x, y), wide by wide * 0.3. e.g. c04Shadow(560, 724, 150);
function c04Shadow(x, y, wide) {
  var g = pen.createRadialGradient(x, y, 0, x, y, wide);
  g.addColorStop(0, "rgba(40, 22, 6, 0.55)"); g.addColorStop(1, "rgba(40, 22, 6, 0)");
  pen.save(); pen.translate(x, y); pen.scale(1, 0.3); pen.translate(-x, -y);
  pen.fillStyle = g; pen.fillRect(x - wide, y - wide, wide * 2, wide * 2);
  pen.restore();
}
// A glint winking on the gold at (x, y) at second t: a four-pointed star of light. e.g. c04Glint(860, 610, t, 2);
function c04Glint(x, y, t, seed) {
  var on = Math.max(0, Math.sin(t * 2.4 + seed * 1.9)), r = 22 * on;
  if (r < 1) { return; }
  pen.save();
  pen.globalCompositeOperation = "lighter";
  pen.fillStyle = "rgba(255, 246, 210, " + (0.85 * on).toFixed(3) + ")";
  pen.beginPath();
  pen.moveTo(x, y - r); pen.quadraticCurveTo(x, y, x + r, y); pen.quadraticCurveTo(x, y, x, y + r);
  pen.quadraticCurveTo(x, y, x - r, y); pen.quadraticCurveTo(x, y, x, y - r); pen.fill();
  pen.restore();
}
function c04Tuang(t) {
  pen.drawImage(c04Close(), 0, 0);
  c04Shadow(560, 724, 150);
  flora("bael", 560, 720, {size: 3.2});
  var shown = between(t, 13.6, 17);                       // the lumps come one after another as the line counts them
  C04_LUMPS.forEach(function (p, i) {
    if (shown * 4 > i) {
      c04Shadow(p[0] + 10, p[1] + 2, 100);
      c04Lump(p[0], p[1], 2.4);
      c04Glint(p[0] - 30, p[1] - 90, t, i);
    }
  });
}

// Long ago: a king of Yonok on his dais, and before him a Lua chief of this place sitting with a tray of the same gold
// held up; in the colour of an old picture.
function c04Long(t) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]), floor = hoKhamFloor(p[1], p[2]);
  pen.save();
  pen.filter = "sepia(0.75) brightness(1.05)";
  pen.drawImage(cngSky("day"), 0, 0);
  pen.drawImage(cngCourt(), 0, 0);
  cngBeds(t, "court", "back");                           // its beds, as scene 2's court has them, in the old colour
  cngPalace("back");
  person(p[0], dais, cngPerson("noble", CNG_KING, {id: "oldking", floor: "cross", face: -1, age: 0.7, beard: "#e8e2d6",
                                                   at: [p[0] - 300, floor]}));
  cngPalace("front");
  var x = p[0] - 330, y = floor + 70, chief = {size: 0.7, turban: "#2a2a3a", sabai: ["#3a3a5a", "#1e1e2a", "check"],
                                               sarong: "#2a2a3a", id: "luachief", face: 1, floor: "side"};
  var at = [x + 80, y - 150];
  person(x, y, cngPerson("villager", Object.assign(chief, {reachA: [at[0] - 20, at[1]], reachB: [at[0] + 20, at[1]]})));
  pen.fillStyle = "#b08850";
  pen.beginPath(); pen.ellipse(at[0], at[1] - 4, 52, 12, 0, 0, 7); pen.fill();
  [[-26, 0], [-8, -4], [10, 0], [28, -3]].forEach(function (q) { c04Lump(at[0] + q[0], at[1] - 8 + q[1], 0.3); });
  pen.restore();
}

// Now: two men carry the year's gold away along the road out of the village, the headman and villagers watching.
function c04Away(t) {
  var village = cngVillage(), cam = WIDE * 0.5;
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 60, "day");
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  var go = between(t, 37.4, 48.4), x0 = mix(WIDE + 260, WIDE - 1100, go), step = (t - 37.4) / BEAT / 2;
  drawByZ([
    {name: "porter, gold 1", kind: "person", x: x0, y: CNG_GROUND, draw: function () {
      cngPorter(x0, CNG_GROUND, cngPerson("khomsoldier", {size: 0.7, id: "goldman1", face: -1, step: step, holding: null}), true);
    }},
    {name: "porter, gold 2", kind: "person", x: x0 + 180, y: CNG_GROUND + 8, draw: function () {
      cngPorter(x0 + 180, CNG_GROUND + 8, cngPerson("villager", {size: 0.68, id: "goldman2", face: -1, step: step + 0.5, sabai: false}), true);
    }},
    {name: "headman", kind: "person", x: WIDE + 500, y: CNG_GROUND + 30, draw: function () {
      person(WIDE + 500, CNG_GROUND + 30, cngPerson("noble", Object.assign({}, CNG_HEADMAN, {sarong: CNG_KING.sarong}),
                                                    {id: "phang", face: -1, feel: "sad", at: [x0, CNG_GROUND - 200]}));
    }},
    {name: "villager 1", kind: "person", x: WIDE + 640, y: CNG_GROUND + 10, draw: function () {
      person(WIDE + 640, CNG_GROUND + 10, cngPerson("weaver", {size: 0.72, id: "v1", face: -1, feel: "sad"}));
    }},
    {name: "villager 2", kind: "person", x: WIDE + 760, y: CNG_GROUND + 36, draw: function () {
      person(WIDE + 760, CNG_GROUND + 36, cngPerson("farmer", {size: 0.74, id: "v2", face: -1, feel: "sad"}));
    }}
  ]);
  pen.drawImage(village.front, 0, 0);
  pen.restore();
  cngBeds(t, "village", "frame");
}

// Scene 4, the entry the film calls (SCENES): t, its own second, 0 to C04_LONG (45 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), CNG_STREAM, CNG_GROUND, cngCourt(), cngPalace(), CNG_PALACE,
// cngPorter(), cngMeasure(), cngPerson() with CNG_KING and CNG_HEADMAN, cngCutsOver(). Its words are C04_LINES (C013 to
// C017). Its z plan: in each shot the set first, then by drawByZ the people by their feet, then what is before them
// (the stream over the panners' shins, the village's fences). e.g. cngSceneGold(20);
function cngSceneGold(t) {
  if (t < C04_CUTS[0]) { c04Panning(t); }
  else if (t < C04_CUTS[1]) { c04Tuang(t); }
  else if (t < C04_CUTS[2]) { c04Long(t); }
  else { c04Away(t); }
  cngCutsOver(t, C04_CUTS);
}
