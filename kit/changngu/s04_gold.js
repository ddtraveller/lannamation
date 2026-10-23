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
function c04Panning(t) {
  var village = cngVillage();
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 30, CNG_CLOUDS.day);
  pen.drawImage(village.back, 0, 0);
  csBand(pen, 0, 950, WIDE, 130, "#86aca8", "#5f8a86");    // the Mae Sai, close, across the near ground
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
  pen.fillStyle = "rgba(127, 166, 162, 0.9)";             // the stream over their shins
  pen.fillRect(0, C04_STREAM[1] - 26, WIDE, 1080 - C04_STREAM[1] + 26);
  waves(pen, 0, C04_STREAM[1] - 24, WIDE, 90, "rgba(240, 250, 245, 0.45)", t);
}

// Close: on a woven tray, four lumps of gold beside a small bael fruit on its twig.
function c04Tuang(t) {
  csBand(pen, 0, 0, WIDE, 1080, "#c9b48a", "#a8926a");
  pen.fillStyle = "#b08850";                               // the woven bamboo tray
  pen.beginPath(); pen.ellipse(WIDE / 2, 660, 720, 250, 0, 0, 7); pen.fill();
  pen.strokeStyle = "rgba(110, 70, 30, 0.35)"; pen.lineWidth = 3;
  for (var k = -14; k <= 14; k++) {
    pen.beginPath(); pen.moveTo(WIDE / 2 + k * 48, 420); pen.lineTo(WIDE / 2 + k * 48 + 30, 900); pen.stroke();
  }
  flora("bael", 560, 720, {size: 3.2});
  var shown = between(t, 13.6, 17);                       // the lumps come one after another as the line counts them
  [[880, 690], [1110, 740], [1320, 680], [1520, 750]].forEach(function (p, i) {
    if (shown * 4 > i) { c04Lump(p[0], p[1], 2.4); }
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
  cumulus(pen, t + 60, CNG_CLOUDS.day);
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
