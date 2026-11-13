// sets.js - what the scenes of the film of Hong Hin, the stone swan (หงส์หิน), share: the cast, the places, the titles and
// the narration's subtitles. Each scene is a file of its own (sNN_*.js) with a page of its own (sNN.html) that plays only
// that scene; the film's page loads them all. Every page loads this after the kit's files, words.js, and the sets of the
// Chang Ngu and White Eel films (changngu/sets.js, whiteeel/sets.js), whose places and helpers this film shares: the
// city wall and gate, the palace court, the skies, welPerson(), welFadeIn(). The scenes draw on the film's 1920 sheet
// (style.js) on their own clock, from 0. BEAT is set by each page, before this file.
// The tale is told as Chao Suriyawong's khao so tells it (story.py); its beings and things are the kit's (himmaphan.js
// hongHin and indra, ogre.js's ghouls, giantess and daughters, myth.js hemmarat, honghin.js), the owner's picks.

// ---------- the cast ----------
// The king of Varanasi, Purantapa: young (scene 1, twenty) and grown; his mother, the old queen the ghouls steal (the
// kit's old woman, in a queen's gold); Vimala, his chief queen (a painted princess); the six wives (painted women, each
// her own); their six sons (nobles, each his own cloth); the boy, the prince (a noble boy); the old gardeners.
var HH_KING = {regalia: true, turban: "#b8294a", pins: true, bangles: 5, sarong: ["#8a2a3a", BROCADE], smile: 0.4};
var HH_KING_YOUNG = Object.assign({}, HH_KING, {size: 0.8, eyes: 1.04});
var HH_OLD_QUEEN = {shirt: "#f2e2c4", sin: 2, sabai: ["#c9962a", "#8a2a3a"], earplug: "#d9b24a", bangles: 4, hair: "#ece7dd",
                    age: 1, bend: 0.16, size: 0.72, smile: 0.3};
// The old queen as the ghouls kept her twenty years: thin, bent, in a grey blouse, no gold (scenes 14 to 18).
var HH_GRAN = Object.assign({}, HH_OLD_QUEEN, {shirt: "#8a8478", sabai: false, sin: 1, bend: 0.3, earplug: undefined, bangles: 0, size: 0.68});
var HH_VIMALA = {size: 0.78};                         // castWoman("princess"), her own size in the film
var HH_WIVES = [3, 8, 12, 17, 30, 18];                // the six, each a woman of castMix(): her own face (six different painted faces, none Vimala's princess: 21, 26 until 2026-11-13), hair and dress
var HH_SONS = [["#24335e", "#e0b23a"], ["#2f5a4a", "#d0a040"], ["#5a2a4a", "#e0b23a"], ["#3a3a6a", "#c8a050"],
               ["#6a3a24", "#e8c060"], ["#24485a", "#d8b050"]];   // each son's cloth and its gold
// The boy grows up poor, a gardener's grandson (the brothers in brocade and gold): bare, a plain indigo cloth, a white
// head-cloth, no gold, until he is crowned (HH_BOY_CROWNED).
var HH_BOY = {bare: true, regalia: false, turban: "#f2ead6", pins: false, bangles: 0, sarong: "#2f4a6a", patoi: 0.75,
              skin: "#f1d2b4", smile: 0.7, eyes: 1.14};
var HH_BOY_CROWNED = {bare: true, regalia: true, turban: "#b8294a", pins: true, bangles: 4, sarong: ["#8a2a3a", BROCADE],
                      skin: "#f1d2b4", smile: 0.7, eyes: 1.1};

// Each son his own face and frame (owner, 2026-11-13: "Give the 6 brothers distinct faces. Make one a little smaller and
// fatter and one a little taller and thinner. Give one a few wrinkles and change the shapes of their faces and sizes of
// their lips and eyes just a bit"): a face of the north's shape, eyes and lips a little larger or smaller, and scale, a
// factor on the size the scene gives.
var HH_SON_FACES = [                                    // and their skin, head shape and hair their own (owner, 2026-11-13, again)
  {north: "square", age: 0.45, eyes: 0.95, lips: 1.1, skin: "#e9c39e", head: 1.08, beard: "#2a1e16", scale: 1},   // the eldest, lined, a moustache
  {north: "full", body: "fat", eyes: 1.05, lips: 1.18, skin: "#d9a87e", head: 1.15, scale: 0.92},                 // shorter and stouter
  {build: 0.45, head: 0.86, eyes: 0.9, lips: 0.85, skin: "#f0d2b0", hair: "#3a2a1e", scale: 1.08},                // taller and thinner
  {north: "broad", eyes: 1.1, lips: 1, lid: "crease", skin: "#c8956a", head: 1.0, hair: "#1a1410", scale: 1},
  {north: "soft", eyes: 0.88, lips: 1.22, skin: "#e2b48c", head: 0.94, hair: "#2e2218", scale: 0.98},
  {north: "round", eyes: 1.14, lips: 0.9, head: 1.05, skin: "#f4dcc0", scale: 0.96}];                             // the youngest             // the youngest
// One of the six sons (k 0 to 5), as welPerson() gives a look: a noble in his own cloth, his own face and frame (scale
// multiplies the size given, 0.8 unless told). e.g. person(x, y, hhSon(2, {size: 0.8}));
// Three of the six drawn new, from scratch, after the northern temple murals (honghin.js muralMan(); the owner,
// 2026-11-13: "Redraw the fat brother from scratch. Redraw the 2 brothers to the far right from scratch as well"):
// the stout one (1) and the two at the far right of the lane (4, 5). Their looks carry mural: true, and person() below
// draws them with muralMan().
var HH_MURAL_SONS = {1: {body: "stout", skin: "#d9a87e", faceShape: "round"},
                     4: {body: "slim", skin: "#e2b48c", faceShape: "long"},
                     5: {body: "tall", skin: "#f0d2b0", faceShape: "oval"}};
function hhSon(k, extra) {
  var c = HH_SONS[k % 6], f = Object.assign({}, HH_SON_FACES[k % 6]), scale = f.scale;
  if (HH_MURAL_SONS[k % 6]) {
    var m = HH_MURAL_SONS[k % 6], size0 = (extra && extra.size !== undefined ? extra.size : 0.8) * scale;
    return Object.assign({mural: true, cloth: [c[0], c[1]], band: c[0]}, m, extra || {}, {size: size0 * 1.4});   // as tall as the kit-drawn brothers beside them
  }
  delete f.scale;
  var size = (extra && extra.size !== undefined ? extra.size : 0.8) * scale;
  return welPerson("noble", Object.assign({sarong: [c[0], BROCADE], turban: c[0], smile: 0.3}, f), Object.assign({}, extra, {size: size}));
}

// person() as the kit has it, but a look marked mural: true (Hong Hin's mural brothers) is drawn by muralMan().
var HH_PERSON = person;
person = function (x, y, look) { return look && look.mural ? muralMan(x, y, look) : HH_PERSON(x, y, look); };

// ---------- the words ----------
// The narration's subtitles, as the White Eel's (welSubtitles), from this film's words (words.js).
function hhSubtitles(t, lines) {
  lines.forEach(function (line) {
    if (t < line[0] || t >= line[1]) { return; }
    var words = HONGHIN_WORDS[line[2]], halves = welHalves(words[1]);
    var big = halves.length < 2 ? words[1] : t < mix(line[0], line[1], halves[0].length / words[1].length) ? halves[0] : halves[1];
    subtitle(big, words[2]);
  });
}

// The titles: the series, Lanna Tales (นิทานล้านนา), and the tale's name, หงส์หิน, in the Lanna script (the Kam Mueang
// alphabet's own reader, KMA.lanna(), with its word list: the series as the first three films spell it), the English
// small beneath. from: the second they begin to show; they go at to. e.g. hhTitle(t, 36, 45);
var HH_SERIES = "ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ";
var HH_STORY = "ᩉᩫ᩠ᨦᩈ᩺ᩉᩥ᩠ᨶ";
function hhTitle(t, from, to) {
  var series = between(t, from, from + 1.2) * (1 - between(t, to - 1, to)), story = between(t, from + 1.6, from + 2.8) * (1 - between(t, to - 1, to));
  if (series <= 0) { return; }
  pen.save();
  pen.textAlign = "center";
  pen.shadowColor = "rgba(255, 196, 90, 0.7)";
  var gold = pen.createLinearGradient(0, 180, 0, 440);
  gold.addColorStop(0, "#fff1c0"); gold.addColorStop(0.5, "#e8b84a"); gold.addColorStop(1, "#b07a22");
  pen.fillStyle = gold;
  pen.globalAlpha = series;
  pen.shadowBlur = 22;
  pen.font = "700 92px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
  pen.fillText(HH_SERIES, WIDE / 2, 250);
  pen.shadowBlur = 8;
  pen.strokeStyle = "rgba(255, 230, 170, 0.8)"; pen.lineWidth = 2;
  var reach = 260 * between(t, from + 0.6, from + 2.2);
  pen.beginPath(); pen.moveTo(WIDE / 2 - reach, 312); pen.quadraticCurveTo(WIDE / 2, 322, WIDE / 2 + reach, 312); pen.stroke();
  if (story > 0) {
    pen.globalAlpha = story;
    pen.shadowBlur = 26;
    pen.font = "700 136px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
    pen.fillText(HH_STORY, WIDE / 2, 450);
    pen.shadowBlur = 0;
    pen.font = "italic 42px " + LETTERS_LATIN + ", 'Times New Roman', serif";
    pen.fillStyle = "#fff6dc";
    pen.fillText("Hong Hin, the Stone Swan", WIDE / 2, 540);
  }
  pen.restore();
}

// ---------- Varanasi by night ----------
// The city from the fields at night (scene 1): the night sky, its stars and the moon, the far hills, the plain, the
// palace's roofs over the wall, the wall and its gate (Chang Ngu's, changngu/sets.js), all darkened under the night,
// lamps on the gate and in the palace. HH_NIGHT_LAMPS: [x, y, the ground under it].
var HH_NIGHT_LAMPS = [[905, 560, 700], [1015, 560, 700], [1310, 460, 560], [1460, 470, 560]];
var HH_MOON = [1560, 170, 44];
function hhCityNight(t) {
  pen.drawImage(welSky("clear"), 0, 0);
  sceneryStars(t, {band: null, horizon: 600, count: 1800, bright: 18, glow: null, seed: 41, alpha: 1});
  sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
  pen.drawImage(hhFields(), 0, 0);
  hoKham(pen, 1390, 620, 0.42, {part: "back", fine: true});
  hoKham(pen, 1390, 620, 0.42, {part: "front", fine: true, pediment: "peacock"});
  cngGateWall(0, t);
  sceneryBeds(t, hhWallBeds());                         // flowering bushes at the wall's foot, in front of it
  pen.drawImage(hhGateTree(), 0, 0);                    // a frangipani in flower by the gate
  sceneryBeds(t, hhLaneBeds());                          // and bushes along the lane to the gate
  hhNight(0.62, t);
  sceneryClouds(t, {light: "night", count: 4, top: 70, bottom: 300, alpha: 0.75, seed: 9});   // moonlit clouds drifting
  sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
  batStream(t, {from: [520, 520], to: [1250, 140], start: 1, count: 24, every: 0.45, long: 12, colour: "#6e6a86"});   // moonlit, so they show on the dark sky
  HH_NIGHT_LAMPS.forEach(function (l, i) { sceneryLampLight(t, l[0], l[1], l[2], {reach: 120, strength: 0.8, seed: i}); });
}

// ---------- the scenery pass, the places of scenes 2 to 21 ----------
// The court of Chang Ngu (changngu/sets.js cngCourt(): the rampart, its trees in flower, the brick paving) under Hong
// Hin's own mountains. Painted once.
var HH_COURT = null;
function hhCourtSheet() {
  if (HH_COURT) { return HH_COURT; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d"), n;
  b.drawImage(hhRangeAt(560), 0, 0);
  cngRampart(b, 512, 710);
  [["ratchaphruek", 30, 14], ["frangipani", 30, 12], ["mango", 22, 14], ["ratchaphruek", 26, 14], ["frangipani", 26, 12], ["mango", 20, 14]].forEach(function (bloom, i) {
    thkTreeOn(b, 120 + i * 330 + 60 * dice(i + 20), 720, 0.3 + 0.08 * dice(i + 8), 51 + i, [bloom]);
  });
  csBand(b, 0, 700, WIDE, 380, "#c98a62", "#a8704e");
  b.strokeStyle = "rgba(110, 60, 40, 0.3)";
  var rows = [];
  for (n = 0; n < 16; n++) { rows.push(712 + n * n * 1.6 + n * 8); }
  rows.forEach(function (py, r) {
    b.beginPath(); b.moveTo(0, py); b.lineTo(WIDE, py); b.stroke();
    if (r + 1 >= rows.length) { return; }
    var brick = 30 + r * 7, low = rows[r + 1];
    for (var bx = (r % 2) * brick / 2; bx < WIDE + brick; bx += brick) {
      var lean = (bx - WIDE / 2) * 0.04;
      b.beginPath(); b.moveTo(bx, py); b.lineTo(bx + lean * (low - py) / 40, low); b.stroke();
    }
  });
  HH_COURT = paper;
  return paper;
}
// A glazed jar of water with lotus in it, its foot at (x, y), size 1 about 90 tall.
function hhLotusJar(x, y, size, seed) {
  var s = size || 1;
  pen.save(); pen.translate(x, y); pen.scale(s, s);
  pen.beginPath(); pen.moveTo(-34, 0); pen.bezierCurveTo(-56, -30, -50, -70, -30, -78); pen.lineTo(30, -78);
  pen.bezierCurveTo(50, -70, 56, -30, 34, 0); pen.closePath();
  var g = pen.createLinearGradient(-50, 0, 50, 0); g.addColorStop(0, "#3a5a6a"); g.addColorStop(0.4, "#6a94a0"); g.addColorStop(1, "#24363e");
  pen.fillStyle = g; pen.fill(); pen.strokeStyle = "#1a262c"; pen.lineWidth = 2; pen.stroke();
  pen.strokeStyle = "rgba(230, 200, 120, 0.8)"; pen.lineWidth = 2;   // a band of gold dragons' scales round its shoulder
  pen.beginPath(); pen.moveTo(-44, -54); pen.quadraticCurveTo(0, -48, 44, -54); pen.stroke();
  pen.fillStyle = "#3e6a8a"; pen.beginPath(); pen.ellipse(0, -78, 30, 6, 0, 0, 7); pen.fill();
  pen.fillStyle = "#4e8a44"; pen.strokeStyle = "#2a4a24"; pen.lineWidth = 1.2;   // the leaves, and the flowers on their stalks
  [[-18, -84, 0.2], [14, -86, -0.3], [-2, -96, 0.1]].forEach(function (l) { pen.beginPath(); pen.ellipse(l[0], l[1], 16, 6, l[2], 0, 7); pen.fill(); pen.stroke(); });
  [[-10, -150, "#f4a6c0"], [16, -132, "#ffffff"]].forEach(function (f, k) {
    pen.strokeStyle = "#4e7a3a"; pen.lineWidth = 2.4; pen.beginPath(); pen.moveTo(f[0] * 0.3, -84); pen.quadraticCurveTo(f[0], (f[1] - 84) / 2, f[0], f[1]); pen.stroke();
    pen.fillStyle = f[2]; pen.strokeStyle = "#b85a7a";
    pen.beginPath(); pen.moveTo(f[0], f[1] - 22); pen.quadraticCurveTo(f[0] + 12, f[1] - 6, f[0], f[1] + 2); pen.quadraticCurveTo(f[0] - 12, f[1] - 6, f[0], f[1] - 22);
    pen.fill(); pen.lineWidth = 1; pen.stroke();
  });
  pen.restore();
}
// The court's royal things (the owner's "yes", 2026-11-12): two tall gold parasols (honghin.js chatra()) on the dais
// either side of the throne, behind who sits there, and two lotus jars at the foot of the steps; drawByZ sprites.
function hhCourtThings(t) {
  var p = CNG_PALACE, s = p[2], dais = hoKhamDais(p[1], p[2]);
  return [[-205, "chatra"], [205, "chatra"], [-120, "jar"], [120, "jar"]].map(function (d, k) {
    var x = p[0] + d[0] * s, y = d[1] === "chatra" ? dais : p[1] + 12;
    var one = {name: d[1] + " " + k, kind: "thing", x: x, y: d[1] === "chatra" ? dais - 0.5 : y, draw: function () {
      if (d[1] === "chatra") { chatra(x, y, 300 * s, t); } else { hhLotusJar(x, y, 0.62, k); }
    }};
    if (d[1] === "chatra") { one.z = "set"; }           // on the dais, among the hall's parts
    return one;
  });
}
// The flowering trees round a giant king's hall, behind it, in its kingdom's colours: the flame of the forest in the red
// city, the golden shower in the green, the frangipani in the blue. Painted once each.
var HH_GIANT_TREES = {};
function hhGiantTrees(kingdom) {
  if (HH_GIANT_TREES[kingdom]) { return HH_GIANT_TREES[kingdom]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d"), bloom = {red: ["thongkwao", 26, 12], green: ["ratchaphruek", 28, 14], blue: ["frangipani", 28, 12]}[kingdom];
  [[230, 0.3], [520, 0.26], [1400, 0.27], [1690, 0.31]].forEach(function (tr, i) { thkTreeOn(b, tr[0], 705, tr[1], 71 + i, [bloom]); });
  HH_GIANT_TREES[kingdom] = paper;
  return paper;
}

// ---------- each place's air and framing ----------
// A scene's place says what it is as it is drawn (hhPlace(name), the first in a frame wins: heaven over the orchard seen
// through its clouds); at the scene's end hhPlaceAir(t) lays that place's air (light, petals, fireflies, a butterfly)
// and its framing (blossom hanging into a top corner, grass at the bottom corners, out of focus) over the picture, in
// the frame's own place, not the camera's (docs/kit/places.md, points 5 and 7).
var HH_PLACE = null;
function hhPlace(name) { if (!HH_PLACE) { HH_PLACE = name; } }
var HH_FRAMES = {};
function hhFrameOf(name, make) { return HH_FRAMES[name] || (HH_FRAMES[name] = make()); }
function hhCorners(seed, greens) {
  return [{sprite: sceneryGrass(260, 16, seed, greens), x: 60, y: 1110}, {sprite: sceneryGrass(240, 14, seed + 2, greens), x: WIDE - 50, y: 1110}];
}
var HH_AIR = {
  court: function (t) {
    sceneryBeds(t, hhFrameOf("court", function () {
      return [{sprite: sceneryHanging(520, 220, 501, THK_GREENS, [["ratchaphruek", 26, 14]]), x: WIDE - 180, y: -30}];
    }), {blur: 5, sway: 0.4});
    sceneryAir(t, {butterfly: null, petals: [14, "#f2c94c", 7, 0.9], light: [0.55, 3]});
  },
  fields: function (t) {
    sceneryBeds(t, hhFrameOf("fields", function () { return hhCorners(511); }), {blur: 5, sway: 0.4});
    sceneryAir(t, {butterfly: null, petals: null, light: [0.8, 5]});
  },
  "orchard-day": function (t) {
    sceneryBeds(t, hhFrameOf("orchard-day", function () {
      return [{sprite: sceneryHanging(500, 210, 521, THK_GREENS, [["frangipani", 24, 12]]), x: 160, y: -30}].concat(hhCorners(523));
    }), {blur: 5, sway: 0.4});
    sceneryAir(t, {butterfly: {kind: "lacewing", x: 1500, y: 560, vx: -70, weave: 50, seed: 4, size: 1.2, turn: 0.4, wing: 3},
                   petals: [12, "#f6b8cc", 9, 1.0], light: [0.6, 4]});
  },
  "orchard-dusk": function (t) {
    var dusk = THK_SHADE.map(function (g) { return blend(g, "#3a2430", 0.35); });
    sceneryBeds(t, hhFrameOf("orchard-dusk", function () {
      return [{sprite: sceneryHanging(500, 210, 531, dusk, [["frangipani", 22, 12, "#f4e2d0"]]), x: 160, y: -30}].concat(hhCorners(533, dusk));
    }), {blur: 5, sway: 0.4});
    sceneryFireflies(t, {far: [[[0, 760, WIDE, 1000], 24, 6]], near: 4});
  },
  "orchard-night": function (t) {
    var dark = THK_SHADE.map(function (g) { return blend(g, "#0c1124", 0.78); });
    sceneryBeds(t, hhFrameOf("orchard-night", function () { return hhCorners(541, dark); }), {blur: 5, sway: 0.4});
    sceneryFireflies(t, {far: [[[0, 700, WIDE, 1000], 40, 7]], near: 8});
  },
  heaven: function (t) { sceneryAir(t, {butterfly: null, petals: [18, "#ffe08a", 13, 0.8], light: [0.9, 2]}); },
  giant: function (t) {
    sceneryBeds(t, hhFrameOf("giant", function () {
      return [{sprite: sceneryHanging(480, 200, 551, THK_GREENS, [["bougainvillea", 30, 12, "#d8338a"]]), x: 150, y: -30}];
    }), {blur: 5, sway: 0.4});
    sceneryAir(t, {butterfly: null, petals: [10, "#e85a7a", 11, 1.0], light: [0.5, 6]});
    sceneryBeds(t, hhBottomPlants(553, {tall: 46, at: 1094}), {sway: 0.3});   // the second line, along the picture's foot
  },
  ghouls: function (t) {
    var dark = THK_SHADE.map(function (g) { return blend(g, "#0e1612", 0.6); });
    sceneryBeds(t, hhFrameOf("ghouls", function () {
      return [{sprite: sceneryHanging(520, 220, 561, dark, []), x: 140, y: -40}, {sprite: sceneryHanging(460, 200, 563, dark, []), x: WIDE - 150, y: -40}];
    }), {blur: 5, sway: 0.3});
    softMist(t, 990, 60, 0.3, 19, "190, 204, 190");
    sceneryBeds(t, hhBottomPlants(563, {tall: 50, at: 1094, greens: dark}), {sway: 0.3});   // the second line, along the picture's foot
  },
  "river-day": function (t) {
    sceneryBeds(t, hhFrameOf("river-day", function () { return hhCorners(571); }), {blur: 5, sway: 0.4});
    sceneryAir(t, {butterfly: null, petals: null, light: [0.5, 7]});
  },
  "river-dusk": function (t) {
    var dusk = THK_SHADE.map(function (g) { return blend(g, "#3a2430", 0.35); });
    sceneryBeds(t, hhFrameOf("river-dusk", function () { return hhCorners(573, dusk); }), {blur: 5, sway: 0.4});
    sceneryFireflies(t, {far: [[[0, 700, WIDE, 980], 20, 8]], near: 3});
  },
  "river-night": function (t) { sceneryFireflies(t, {far: [[[0, 650, WIDE, 980], 40, 9]], near: 8}); },
  lane: function (t) {
    sceneryBeds(t, hhFrameOf("lane", function () {
      return [{sprite: sceneryHanging(500, 210, 581, THK_GREENS, [["bougainvillea", 30, 12, "#e86a2a"]]), x: WIDE - 170, y: -30}];
    }), {blur: 5, sway: 0.4});
    sceneryAir(t, {butterfly: null, petals: [12, "#f6b8cc", 15, 1.0], light: [0.6, 8]});
  }
};
// Each place's life, as fits it (owner, 2026-11-13: "add birds, flowers, plants, animals, fish, etc. as appropriate"): on
// courses of the picture's own pixels (decorate.js), a scene's seconds from 0; drawn with the place's air, in front,
// at the edges where it hides no one. Birds go home at dusk; nothing walks the night but the fireflies and the bats.
var HH_LIFE = {
  court: [{name: "flock", kind: "flock", course: [[3, -100, 150], [15, WIDE + 300, 90]]},
          {name: "sunbird", kind: "sunbird", look: {size: 0.9}, course: [[6, WIDE + 40, 420], [9, WIDE - 210, 300, "sip"], [12, WIDE - 210, 300], [15, WIDE - 380, 260, "hover"], [17, WIDE + 60, 200]]}],
  fields: [{name: "flock", kind: "flock", course: [[2, WIDE + 200, 120], [16, -300, 200]]},
           {name: "egret", kind: "egret", look: {size: 0.8, fly: true}, course: [[10, -120, 300], [24, WIDE + 160, 220]]},
           {name: "magpie", kind: "magpie", look: {size: 0.8}, course: [[20, WIDE + 60, 860], [22, WIDE - 160, 1000], [26, WIDE - 160, 1000, "peck"], [30, WIDE - 160, 1000], [33, WIDE + 80, 820]]}],
  "orchard-day": [{name: "hen", kind: "hen", look: {size: 0.7}, course: [[0, 160, 1050], [6, 300, 1048, "peck"], [10, 300, 1048], [18, 120, 1056, "peck"], [24, 120, 1056], [40, 380, 1050, "peck"], [60, 380, 1050]]},
                  {name: "chick 1", kind: "chick", look: {size: 0.7}, course: [[0, 200, 1062], [8, 330, 1060, "peck"], [14, 330, 1060], [22, 160, 1066], [60, 400, 1064, "peck"]]},
                  {name: "chick 2", kind: "chick", look: {size: 0.7}, course: [[0, 240, 1070], [9, 360, 1070, "peck"], [15, 360, 1070], [23, 190, 1074], [60, 430, 1072]]},
                  {name: "flock", kind: "flock", course: [[12, WIDE + 200, 140], [28, -300, 90]]},
                  {name: "deer far", kind: "deer", look: {size: 0.22}, course: [[0, 1400, 492], [8, 1300, 494, "graze"], [20, 1300, 494], [23, 1280, 494, "alert"], [28, 1280, 494], [44, 1320, 494, "graze"], [60, 1420, 492]]},
                  {name: "fawn far", kind: "deer", look: {size: 0.22, fawn: true}, course: [[0, 1460, 496], [9, 1360, 498, "graze"], [22, 1360, 498], [45, 1380, 498, "graze"], [60, 1480, 496]]},
                  {name: "deer far 2", kind: "deer", look: {size: 0.24}, course: [[0, 560, 490], [14, 470, 492, "graze"], [40, 470, 492], [60, 560, 490]]},
                  {name: "hornbill", kind: "hornbill", look: {size: 0.5}, course: [[10, -120, 300], [24, WIDE + 140, 240]]},
                  {name: "magpie", kind: "magpie", look: {size: 0.6}, course: [[2, -60, 300], [6, 300, 560, "perch"], [16, 300, 560], [20, WIDE + 80, 260]]},
                  {name: "sunbird", kind: "sunbird", look: {size: 0.8}, course: [[18, WIDE + 60, 420], [23, 1500, 760, "sip"], [30, 1500, 760], [32, 1380, 700, "hover"], [36, -60, 520]]}],
  // and far off at the jungle's edge, small with distance, deer come out to graze (owner, 2026-11-13)
  "orchard-dusk": [{name: "flock home", kind: "flock", course: [[1, -200, 260], [14, WIDE + 300, 160]]},
                   {name: "flock home 2", kind: "flock", course: [[18, -200, 200], [32, WIDE + 300, 120]]}],
  lane: [{name: "hen", kind: "hen", look: {size: 0.6}, course: [[0, WIDE - 160, 1030], [8, WIDE - 330, 1028, "peck"], [14, WIDE - 330, 1028], [26, WIDE - 200, 1034, "peck"], [60, WIDE - 200, 1034]]},
         {name: "chick", kind: "chick", look: {size: 0.6}, course: [[0, WIDE - 120, 1046], [10, WIDE - 290, 1044, "peck"], [20, WIDE - 290, 1044], [60, WIDE - 160, 1050]]},
         {name: "rooster", kind: "rooster", look: {size: 0.62}, course: [[0, 70, 1036], [12, 70, 1036, "peck"], [20, 160, 1040], [60, 160, 1040]]},
         {name: "flock", kind: "flock", course: [[4, -200, 120], [18, WIDE + 300, 60]]}],
  giant: [{name: "hornbill", kind: "hornbill", look: {size: 0.7}, course: [[2, WIDE + 160, 220], [14, -160, 170]]},
          {name: "flock", kind: "flock", course: [[20, -200, 140], [34, WIDE + 300, 90]]}],
  ghouls: [{name: "hornbill", kind: "hornbill", look: {size: 0.6}, course: [[4, -160, 260], [16, WIDE + 160, 200]]},
           {name: "magpie", kind: "magpie", look: {size: 0.7}, course: [[1, WIDE + 60, 300], [5, 1500, 700, "perch"], [12, 1500, 700], [16, -80, 260]]},
           {name: "sunbird", kind: "sunbird", look: {size: 0.8}, course: [[6, -40, 650], [9, 380, 700, "sip"], [13, 380, 700], [15, 520, 660, "hover"], [17, -60, 600]]},
           {name: "flock", kind: "flock", course: [[18, -200, 160], [32, WIDE + 300, 100]]},
           {name: "pheasant", kind: "pheasant", look: {size: 0.7}, course: [[8, WIDE + 80, 820], [12, WIDE - 160, 830, "peck"], [18, WIDE - 160, 830], [22, WIDE + 100, 816]]}],
  "river-day": [{name: "kite", kind: "kite", look: {size: 0.7, seed: 1}, course: [[1, -160, 220], [10, 700, 160], [18, 1300, 240], [30, WIDE + 160, 170]]},
                {name: "egret", kind: "egret", look: {size: 0.8, fly: true}, course: [[3, WIDE + 160, 260], [18, -160, 190]]},
                {name: "flock", kind: "flock", course: [[22, -200, 150], [36, WIDE + 300, 100]]}],
  "river-dusk": [{name: "flock home", kind: "flock", course: [[2, WIDE + 200, 220], [16, -300, 150]]}]
};
function hhLife(t, place) { if (HH_LIFE[place]) { decorate(t, HH_LIFE[place], "front"); } }
// The river's near bank planted on a wandering line, reeds, grass and a bush in flower here and there, so its edge is
// not ruled (owner, 2026-11-13): sceneryBeds() items, drawn after the water. e.g. sceneryBeds(t, hhRiverBank());
function hhRiverBank() {
  if (HH_BEDS.riverBank) { return HH_BEDS.riverBank; }
  var line = hhWander(WEL_KOK_BANK + 4, 6, 12), list = [], x, k = 0;
  for (x = -30; x < WIDE + 40; k++) {
    var high = 30 + 26 * dice(k + 801), wide = high * (1.4 + dice(k + 803));
    list.push(k % 4 === 3 ? {sprite: sceneryBush(wide, high, 811 + k, THK_GREENS, [[["jasmine", 10, 5], ["marigold", 6, 6], ["hibiscus", 4, 8, "#e8508a"]][k % 3]]), x: x, y: line(x) + 6}
                          : {sprite: sceneryGrass(high, 9, 821 + k), x: x, y: line(x) + 3});
    x += wide * (0.5 + 0.3 * dice(k + 807));
  }
  return (HH_BEDS.riverBank = list);
}
// A fish of the river that leaps once at second at, from x (the water's face at WEL_KOK + 50), in the place's light.
function hhFishLeap(t, at, x) {
  var leap = {at: at, from: [x, WEL_KOK + 56], to: [x + 130, WEL_KOK + 60], high: 70, air: 0.9, size: 0.6};
  sceneryLeap(t, "rings", leap); sceneryLeap(t, "air", leap);
}
function hhPlaceAir(t) {
  var place = HH_PLACE;
  HH_PLACE = null;
  if (place) { hhLife(t, place); }                       // its life first, the framing over it
  if (place && HH_AIR[place]) { HH_AIR[place](t); }
}

// ---------- the scenery pass (docs/kit/places.md, "Painting the scenery") ----------
// The owner, 2026-11-12, "yes" to scene 1's plan. Hong Hin's own far mountains (a film has its own, not another's): a far
// ridge and a second between, a limestone peak at the left, a range clothed in forest with pines, painted once.
var HH_RANGE = {peak: 420 + SIDE, ridges: 2, pines: 18, seed: 23};
function hhRange() { return farRange("#9ab0c4", "214, 222, 236", 580, HH_RANGE); }
// The same mountains with their foot at foot (pixels of the sheet), in the light of the hour: "day" (unless told),
// "dusk" (rose and violet) or "night". e.g. pen.drawImage(hhRangeAt(600, "dusk"), 0, 0);
var HH_RANGE_LIGHT = {day: ["#9ab0c4", "214, 222, 236"], dusk: ["#a08aa8", "240, 196, 168"], night: ["#4a5670", "60, 70, 100"]};
function hhRangeAt(foot, light) { var c = HH_RANGE_LIGHT[light || "day"]; return farRange(c[0], c[1], foot, HH_RANGE); }
// Varanasi's fields before the wall (as changngu/sets.js cngFields(), the plain, the meadow and the road where they lie
// there), under Hong Hin's own mountains. Painted once.
var HH_FIELDS = {};
function hhFields(light) {                              // light: the mountains' hour, "day" unless told ("dusk")
  light = light || "day";
  if (HH_FIELDS[light]) { return HH_FIELDS[light]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d");
  b.drawImage(light === "day" ? hhRange() : hhRangeAt(580, light), 0, 0);
  csBand(b, 0, 540, WIDE, 540, "#a9c97a", "#86a85a");
  sceneryMeadow(b, 0, WIDE, 560, 1080, {seed: 5, haze: "#b4cfa0", many: 1.5});
  b.fillStyle = "#c9b285";                               // the road from the near fields to the gate, and along the wall
  b.beginPath(); b.moveTo(CNG_GATE[0] - 50, 790); b.lineTo(CNG_GATE[0] + 50, 790);
  b.lineTo(CNG_GATE[0] + 260, 1080); b.lineTo(CNG_GATE[0] - 260, 1080); b.closePath(); b.fill();
  // the road along the wall with wandering edges, not ruled (owner, 2026-11-13), worn and textured
  var top = hhWander(CNG_ROAD - 26, 6, 4), bot = hhWander(CNG_ROAD + 26, 7, 8), x;
  b.beginPath(); b.moveTo(0, top(0)); for (x = 0; x <= WIDE; x += 20) { b.lineTo(x, top(x)); }
  for (x = WIDE; x >= 0; x -= 20) { b.lineTo(x, bot(x)); } b.closePath(); b.fill();
  hhGroundTexture(b, 0, CNG_ROAD - 34, WIDE, CNG_ROAD + 34, "#c9b285", 41, {many: 1.4});
  hhGroundTexture(b, CNG_GATE[0] - 260, 790, CNG_GATE[0] + 260, 1080, "#c9b285", 43, {many: 0.8});
  [[260, 760, 0.55, 3], [1520, 770, 0.6, 5]].forEach(function (c) { bamboo(b, c[0], c[1], c[2], c[3]); });
  HH_FIELDS[light] = paper;
  return paper;
}
// The wall's foot by day planted along a wandering line, clear of the gate's road (owner, 2026-11-13: no ruled edge where
// the moat's bank meets the fields): sceneryBeds() items, drawn after cngGateWall(). e.g. sceneryBeds(t, hhFieldsEdge());
function hhFieldsEdge() {
  if (HH_BEDS.fieldsEdge) { return HH_BEDS.fieldsEdge; }
  var line = hhWander(784, 8, 5), list = [], x, k = 0;
  var blooms = [["bougainvillea", 16, 10, "#d8338a"], ["jasmine", 22, 6], ["hibiscus", 7, 11, "#d93a2e"], ["marigold", 10, 8], ["tahern", 8, 8]];
  for (x = -30; x < WIDE + 40; k++) {
    var high = 46 + 34 * dice(k + 701), wide = high * (1.6 + dice(k + 703));
    if (Math.abs(x - CNG_GATE[0]) > 120) {
      list.push(k % 3 === 2 ? {sprite: sceneryGrass(high, 10, 711 + k), x: x, y: line(x) + 4}
                            : {sprite: sceneryBush(wide, high, 721 + k, THK_GREENS, [blooms[k % blooms.length]]), x: x, y: line(x) + 8});
    }
    x += wide * (0.55 + 0.25 * dice(k + 707));
  }
  return (HH_BEDS.fieldsEdge = list);
}
// The frangipani by the gate, white in flower (a temple's and a palace's tree at night), on a sheet of its own.
var HH_GATE_TREE = null;
function hhGateTree() {
  if (HH_GATE_TREE) { return HH_GATE_TREE; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  thkTreeOn(paper.getContext("2d"), 700, 735, 0.24, 91, [["frangipani", 30, 12]]);
  HH_GATE_TREE = paper;
  return paper;
}
// The flowering beds: bougainvillea and jasmine at the wall's foot, clear of the gate; hibiscus along the lane.
var HH_BEDS = {};
function hhWallBeds() {
  return HH_BEDS.wall || (HH_BEDS.wall = [
    {sprite: sceneryBush(300, 120, 401, THK_SHADE, [["bougainvillea", 30, 12, "#d8338a"]]), x: 180, y: 712},
    {sprite: sceneryBush(260, 110, 403, THK_SHADE, [["jasmine", 40, 7]]), x: 470, y: 708},
    {sprite: sceneryBush(280, 120, 405, THK_SHADE, [["bougainvillea", 28, 12, "#e86a2a"]]), x: 1260, y: 712},
    {sprite: sceneryBush(320, 130, 407, THK_SHADE, [["jasmine", 44, 7]]), x: 1620, y: 710}]);
}
function hhLaneBeds() {
  return HH_BEDS.lane || (HH_BEDS.lane = [
    {sprite: sceneryBush(220, 110, 411, THK_GREENS, [["hibiscus", 14, 14, "#d93a2e"]]), x: CNG_GATE[0] - 240, y: 900},
    {sprite: sceneryBush(240, 120, 413, THK_GREENS, [["hibiscus", 16, 14, "#f0a030"]]), x: CNG_GATE[0] + 250, y: 905}]);
}
// The picture framed at night: frangipani hanging into the top left, grass at the bottom corners, out of focus, in the
// dark of the night. Drawn last, in the frame's own place (not the camera's). e.g. sceneryBeds(t, hhNightFrame(), {blur: 5, sway: 0.4});
function hhNightFrame() {
  if (HH_BEDS.frame) { return HH_BEDS.frame; }
  var dark = THK_SHADE.map(function (g) { return blend(g, "#0c1124", 0.78); });
  HH_BEDS.frame = [{sprite: sceneryHanging(420, 170, 481, dark, [["frangipani", 18, 11, "#8a8ea0"]]), x: 120, y: -40},
                   {sprite: sceneryGrass(260, 16, 451, dark), x: 120, y: 1100},
                   {sprite: sceneryGrass(240, 14, 453, dark), x: 1800, y: 1100}];
  return HH_BEDS.frame;
}

// The bananas forest() draws at a wood's foot (highlands.js, the same dice), only those whose x which(x) chooses: so some
// can be drawn before the wood (behind its crowns) and the rest after. e.g. hhForestBananas(b, 0, 800, 820, 420, 11, f);
function hhForestBananas(brush, left, right, base, tall, seed, which) {
  for (var x = left + 40 * dice(seed * 127), n = 0; x < right; n++) {
    if (which(x)) {
      brush.save();
      brush.translate(x, base);
      var scale = tall / 420 * (0.8 + 0.4 * dice(seed * 131 + n));
      brush.scale(scale * (dice(seed * 137 + n) < 0.5 ? -1 : 1), scale);
      banana(brush, 0, 0);
      brush.restore();
    }
    x += 180 + 260 * dice(seed * 139 + n);
  }
}
// The forest's edge by the city wall at night (scenes 1): the dark forest on the left, the wall running off to the
// right, the moon. HH_EDGE_WALL: the wall's left end, its foot, its size; the wall's top is HH_EDGE_TOP.
var HH_EDGE_WALL = [980, 760, 1.6];
var HH_EDGE_TOP = HH_EDGE_WALL[1] - 150 * HH_EDGE_WALL[2];
var HH_EDGE = null;
function hhEdge() {
  if (HH_EDGE) { return HH_EDGE; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d");
  b.drawImage(hhRange(), 0, 0);                          // the film's own mountains (scenery pass, 2026-11-12)
  csBand(b, 0, 540, WIDE, 540, "#7e9a5c", "#5e7a44");
  sceneryMeadow(b, 0, WIDE, 760, 1080, {seed: 41, haze: "#9ab48a", many: 1.1, depth: [0.4, 1]});   // grass where they walk
  b.fillStyle = "#a8926a";                               // the path out of the forest to the wall's foot
  b.beginPath(); b.moveTo(160, 868); b.quadraticCurveTo(560, 852, HH_EDGE_WALL[0] + 40, 866);
  b.lineTo(HH_EDGE_WALL[0] + 40, 902); b.quadraticCurveTo(560, 896, 160, 914); b.closePath(); b.fill();
  forest(b, -60, 1000, 640, {tall: 300, seed: 7, far: 0.3});
  // The bananas at the wood's foot as forest() sets them, but the one by the middle drawn before the wood, behind the
  // crown it overlapped (owner, 2026-11-13: "put the banana tree near the center behind the bush it overlaps with").
  hhForestBananas(b, -120, 860, 820, 420, 11, function (x) { return x > 600; });
  forest(b, -120, 860, 820, {tall: 420, seed: 11, front: false});
  hhForestBananas(b, -120, 860, 820, 420, 11, function (x) { return x <= 600; });
  // the forest's foot planted on a wandering line, the field below it textured (owner, 2026-11-13: the straight-line
  // and texture rules in scene 1)
  hhGroundTexture(b, 0, 760, WIDE, 1080, "#6e8a50", 61, {grass: true, many: 1.6, weeds: 20});
  hhEdgePlants(b, hhWander(826, 10, 17), -60, 900, 63, {tall: 70});
  HH_EDGE = paper;
  return paper;
}
function hhEdgeNight(t) {
  pen.drawImage(welSky("clear"), 0, 0);
  sceneryStars(t, {band: null, horizon: 600, count: 1800, bright: 18, glow: null, seed: 43, alpha: 1});
  sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
  pen.drawImage(hhEdge(), 0, 0);
  cityWall(pen, HH_EDGE_WALL[0], HH_EDGE_WALL[1], WIDE - HH_EDGE_WALL[0] + 200, HH_EDGE_WALL[2], {gate: false, t: t});
  pen.drawImage(hhEdgeRampart(), 0, 0);                 // its earth face textured, its foot planted (owner, 2026-11-13)
  hhWallLamp(t, 1560, HH_EDGE_TOP);
}
// The rampart of the forest's edge (s01) on a sheet of its own: its earth face grass-grown in tufts and stones (a plain
// face of one colour no more), and its foot planted on a wandering line, no ruled edge where it meets the field.
var HH_EDGE_RAMPART = null;
function hhEdgeRampart() {
  if (HH_EDGE_RAMPART) { return HH_EDGE_RAMPART; }
  var paper = document.createElement("canvas"); paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d"), s = HH_EDGE_WALL[2], x0 = HH_EDGE_WALL[0], base = HH_EDGE_WALL[1], top = HH_EDGE_TOP;
  b.save(); b.beginPath(); b.moveTo(x0, base); b.lineTo(x0 + 30 * s, top + 26 * s); b.lineTo(WIDE + 200, top + 26 * s); b.lineTo(WIDE + 200, base); b.closePath(); b.clip();
  hhGroundTexture(b, x0, top + 26 * s, WIDE, base, "#828a4e", 67, {grass: true, many: 2.4});
  b.restore();
  hhEdgePlants(b, hhWander(base + 8, 6, 19), x0 - 20, WIDE + 40, 69, {tall: 52});
  HH_EDGE_RAMPART = paper;
  return paper;
}
// The wall of the forest's edge alone, in the night's tint (hhNight(0.6)), on a clear sheet: drawn again over someone
// standing on it, clipped to the parapet, so the battlements stand in front of them (s01's young king).
var HH_EDGE_WALL_NIGHT = null;
function hhEdgeWallNight() {
  if (HH_EDGE_WALL_NIGHT) { return HH_EDGE_WALL_NIGHT; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d");
  cityWall(b, HH_EDGE_WALL[0], HH_EDGE_WALL[1], WIDE - HH_EDGE_WALL[0] + 200, HH_EDGE_WALL[2], {gate: false, t: 0});
  b.globalCompositeOperation = "source-atop";
  b.fillStyle = "rgba(10, 16, 46, 0.6)"; b.fillRect(0, 0, WIDE, 1080);
  HH_EDGE_WALL_NIGHT = paper;
  return paper;
}
// A lamp on the wall's top: a post, a little roof, the flame (its light is laid after the night: HH_EDGE_LAMP).
var HH_EDGE_LAMP = [1560, HH_EDGE_TOP - 64];
function hhWallLamp(t, x, top) {
  pen.fillStyle = "#3a2414"; pen.fillRect(x - 4, top - 60, 8, 60);
  pen.beginPath(); pen.moveTo(x - 20, top - 70); pen.lineTo(x, top - 86); pen.lineTo(x + 20, top - 70); pen.closePath(); pen.fill();
  pen.fillStyle = "#ffd27a"; pen.beginPath(); pen.ellipse(x, top - 63 + Math.sin(t * 9) * 0.6, 4, 6, 0, 0, 7); pen.fill();
}
// The night laid over all that is drawn (the hills, the trees, the wall), then the stars and the moon again over it,
// clear. e.g. hhNight(0.6, t);
function hhNight(alpha, t) {
  pen.fillStyle = "rgba(10, 16, 46, " + alpha + ")";
  pen.fillRect(-WIDE, -200, 3 * WIDE, 1500);
  hhStarsMoon(t, 0.85);
}
function hhStarsMoon(t, alpha) {
  pen.save();
  pen.beginPath(); pen.rect(-WIDE, -200, 3 * WIDE, 560); pen.clip();   // above the hills only
  sceneryStars(t, {band: null, horizon: 600, count: 1800, bright: 18, glow: null, seed: 41, alpha: alpha});
  pen.restore();
  sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
}

// A ghoul's eyes glinting in the dark, from its joints (person()'s, pixels of the sheet). e.g. hhGlint(j, t, 2);
function hhGlint(j, t, seed) {
  var cr = himmaJoint(j.crown), ch = himmaJoint(j.chin);
  var cx = (cr[0] + ch[0]) / 2, cy = (cr[1] + ch[1]) / 2, h = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]);
  var blink = Math.sin(t * 0.7 + seed * 1.9) > 0.97 ? 0.1 : 1;
  [-0.24, 0.24].forEach(function (dx) {
    var g = pen.createRadialGradient(cx + dx * h, cy - 0.08 * h, 0, cx + dx * h, cy - 0.08 * h, 0.22 * h);
    g.addColorStop(0, "rgba(255, 236, 140, " + (0.9 * blink) + ")"); g.addColorStop(1, "rgba(255, 200, 80, 0)");
    pen.fillStyle = g; pen.beginPath(); pen.arc(cx + dx * h, cy - 0.08 * h, 0.22 * h, 0, 7); pen.fill();
  });
}

// A person lying as they are carried (the old queen, scene 1): the look drawn turned on its side about its middle, at
// (x, y), tall pixels from head to foot. e.g. hhCarried(800, 500, 160, HH_OLD_QUEEN_LOOK, 1);
function hhCarried(x, y, tall, look, face) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(-Math.PI / 2 * face);
  person(0, tall / 2, Object.assign({}, look, {face: face}));
  pen.restore();
}

// ---------- the palace of Varanasi, by day ----------
// The court and the hall (Chang Ngu's: changngu/sets.js cngCourt(), cngPalace(), CNG_PALACE), the scene's people among
// them by drawByZ. onDais: [[x offset from the hall's middle, look], ...] seated on the dais; sprites: drawByZ's, the
// rest of the scene's people. e.g. hhCourt(t, [[-60, kingLook]], []);
function hhCourt(t, onDais, sprites) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]);
  hhPlace("court");
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 50, "day");
  pen.drawImage(hhCourtSheet(), 0, 0);
  cngBeds(t, "court", "back");
  var list = [{name: "hall, back", kind: "palace", z: "set", y: dais - 1, draw: function () { cngPalace("back"); }},
              {name: "hall, front", kind: "palace", z: "set", y: dais + 1, draw: function () { cngPalace("front"); }}];
  hhCourtThings(t).forEach(function (s) { list.push(s); });   // the parasols and the lotus jars by the steps
  (onDais || []).forEach(function (d, k) {
    list.push({name: "dais " + k, kind: "person", z: "set", x: p[0] + d[0], y: dais, draw: function () { person(p[0] + d[0], dais, d[1]); }});
  });
  drawByZ(list.concat(sprites || []));
  cngBeds(t, "court", "frame");
}

// A camera: the sheet seen zoom times nearer, about the point (x, y) of the set, which comes to the middle of the
// picture as u goes 0 to 1. Call hhCameraEnd() after. e.g. hhCamera(between(t, 20, 24), 500, 760, 1.6); ...; hhCameraEnd();
function hhCamera(u, x, y, zoom) {
  var z = mix(1, zoom, u), cx = mix(960, x, u), cy = mix(540, y, u);
  if (z >= 1) {                                          // the view stays on the set (past its edge is black)
    cx = Math.max(960 / z, Math.min(WIDE - 960 / z, cx));
    cy = Math.max(540 / z, Math.min(1080 - 540 / z, cy));
  }
  pen.save();
  pen.translate(960, 540); pen.scale(z, z); pen.translate(-cx, -cy);
}
function hhCameraEnd() { pen.restore(); }

// A scene's clock, as it was drawn. Each scene was drawn to its plan's lines (HNN_PLAN); Pan's voice says them at
// HNN_LINES (retimed to her takes). hhClock() turns the film's second into the drawing's: each line's start, and the
// end of its voice (its end less 0.4 s), come at the same moment in both, the time between in step; so what is shown
// keeps with what is said. hhSaid() is the other way (a cut drawn at the plan's second: said when?).
// e.g. var said = t; t = hhClock(t, H02_PLAN, H02_LINES, H02_LONG); ... hhCuts(said, hhSaidAll(H02_CUTS, ...));
function hhClockMarks(lines, long, hold) {
  var marks = [0];
  lines.forEach(function (l) { marks.push(l[0], l[1] - hold); });
  marks.push(long);
  return marks;
}
function hhWarp(t, from, to) {
  for (var k = 1; k < from.length; k++) {
    if (t <= from[k] || k === from.length - 1) {
      var u = from[k] > from[k - 1] ? clamp((t - from[k - 1]) / (from[k] - from[k - 1])) : 1;
      return to[k - 1] + (to[k] - to[k - 1]) * u;
    }
  }
  return t;
}
function hhClock(t, plan, said, long) { return hhWarp(t, hhClockMarks(said, long, 0.4), hhClockMarks(plan, long, 0)); }
function hhSaid(t, plan, said, long) { return hhWarp(t, hhClockMarks(plan, long, 0), hhClockMarks(said, long, 0.4)); }
function hhSaidAll(times, plan, said, long) { return times.map(function (c) { return hhSaid(c, plan, said, long); }); }

// A cut through black at each of cuts (seconds), half a second each side. e.g. hhCuts(t, [14.5, 27]);
function hhCuts(t, cuts) {
  cuts.forEach(function (cut) {
    var d = Math.abs(t - cut);
    if (d < 0.6) { pen.fillStyle = "rgba(0, 0, 0, " + (1 - d / 0.6).toFixed(3) + ")"; pen.fillRect(0, 0, WIDE, 1080); }
  });
}
// A painted wife of the six (k 0 to 5). e.g. person(x, y, hhWife(2, {face: -1, feel: "worry"}));
// young and pretty, their hair dark (owner, 2026-11-13: castMix() makes one woman in eight old and grey)
var HH_WIFE_HAIR = ["#17110e", "#1d1410", "#24150e", "#120e14", "#1a1214", "#1d1410"];
function hhWife(k, extra) { return welPerson(HH_WIVES[k % 6], {size: 0.72, hair: HH_WIFE_HAIR[k % 6], age: 0}, Object.assign({id: "wife" + k}, extra || {})); }
// Vimala, the chief queen. e.g. person(x, y, hhVimala({floor: "side"}));
function hhVimala(extra) { return welPerson("woman:princess", HH_VIMALA, Object.assign({id: "vimala"}, extra || {})); }
// An astrologer's chart, propped on the floor before him (x, y its foot's middle), after the owner's references
// (2026-11-13): kind 0 a palm-leaf page with a circle of nine cells and their numerals, the animals of the year below it;
// kind 1 a horoscope wheel of the twelve signs, coloured, in a rim of gold kranok flames.
function hhChart(x, y, kind, t) {
  pen.save(); pen.translate(x, y); pen.scale(1, 0.62);   // propped back, seen a little from above
  var k, n;
  if (kind === 0) {
    pen.fillStyle = "#efe2c0"; pen.strokeStyle = "#7a5a30"; pen.lineWidth = 2;
    pen.beginPath(); pen.rect(-72, -150, 144, 150); pen.fill(); pen.stroke();
    pen.strokeStyle = "#3a2a1a"; pen.lineWidth = 2;
    pen.beginPath(); pen.arc(0, -98, 38, 0, 7); pen.stroke();
    pen.lineWidth = 1.4;
    [-13, 13].forEach(function (d) { pen.beginPath(); pen.moveTo(d, -134); pen.lineTo(d, -62); pen.moveTo(-36, -98 + d); pen.lineTo(36, -98 + d); pen.stroke(); });
    var thai = ["๔", "๙", "๒", "๓", "๕", "๗", "๑", "๖", "๘"];
    pen.fillStyle = "#3a2a1a"; pen.font = "12px serif"; pen.textAlign = "center"; pen.textBaseline = "middle";
    for (k = 0; k < 9; k++) { pen.fillText(thai[k], -26 + (k % 3) * 26, -124 + Math.floor(k / 3) * 26); }
    ["#b8806a", "#d8d4cc", "#c08a5a"].forEach(function (c, i) {   // the animals of the year, a dog after another, in a column
      pen.fillStyle = c; pen.beginPath(); pen.ellipse(-36, -46 + i * 18, 16, 6, 0, 0, 7); pen.fill();
      pen.beginPath(); pen.arc(-20, -50 + i * 18, 5, 0, 7); pen.fill();
      pen.strokeStyle = "#5a3a2a"; pen.lineWidth = 0.8; pen.beginPath(); pen.moveTo(0, -46 + i * 18); pen.lineTo(56, -46 + i * 18); pen.stroke();
    });
  } else {
    pen.fillStyle = "#f4dce0"; pen.strokeStyle = "#a8707a"; pen.lineWidth = 2;
    pen.beginPath(); pen.rect(-76, -156, 152, 156); pen.fill(); pen.stroke();
    var cx = 0, cy = -80;
    for (k = 0; k < 16; k++) {                          // the rim of gold flames
      var a = k / 16 * Math.PI * 2;
      pen.save(); pen.translate(cx + Math.cos(a) * 60, cy + Math.sin(a) * 60); pen.rotate(a + Math.PI / 2);
      pen.beginPath(); pen.moveTo(-9, 4); pen.quadraticCurveTo(-6, -12, 0, -16); pen.quadraticCurveTo(6, -12, 9, 4); pen.closePath();
      pen.fillStyle = "#f0cc5a"; pen.fill(); pen.strokeStyle = "#a8781e"; pen.lineWidth = 1; pen.stroke(); pen.restore();
    }
    pen.beginPath(); pen.arc(cx, cy, 52, 0, 7); pen.fillStyle = "#ffffff"; pen.fill(); pen.strokeStyle = "#a8707a"; pen.lineWidth = 1.5; pen.stroke();
    var tints = ["#f2b8c0", "#bcd8f0", "#d0c8d8", "#ffffff"];
    for (k = 0; k < 12; k++) {                          // the twelve houses, coloured by turns, a mark of writing in each
      var a0 = k / 12 * Math.PI * 2 - Math.PI / 2, a1 = (k + 1) / 12 * Math.PI * 2 - Math.PI / 2;
      pen.beginPath(); pen.moveTo(cx, cy); pen.arc(cx, cy, 42, a0, a1); pen.closePath();
      pen.fillStyle = tints[k % 4]; pen.fill(); pen.strokeStyle = "#8a6a7a"; pen.lineWidth = 0.8; pen.stroke();
      var am = (a0 + a1) / 2; pen.fillStyle = "#3a2a3a";
      for (n = 0; n < 3; n++) { pen.fillRect(cx + Math.cos(am) * (18 + n * 7) - 1.5, cy + Math.sin(am) * (18 + n * 7) - 0.8, 3, 1.6); }
    }
    pen.beginPath(); pen.rect(cx - 9, cy - 9, 18, 18); pen.fillStyle = "#f6e27a"; pen.fill(); pen.stroke();
    pen.fillStyle = "#f4b8c0"; pen.fillRect(-64, -18, 60, 14); pen.fillStyle = "#c8c0e0"; pen.fillRect(4, -18, 60, 14);   // the tables below
  }
  pen.restore();
}
// A long goatee from the chin of someone person() drew (j its joints), grey, a little swinging. e.g. hhGoatee(j, t);
function hhGoatee(j, t) {
  var cr = himmaJoint(j.crown), ch = himmaJoint(j.chin), h = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]), d = cr[0] < ch[0] ? 1 : 1;
  var x = ch[0] + 0.08 * h, y = ch[1] - 0.02 * h, sw = 0.04 * h * Math.sin(t * 1.3);
  pen.save();
  pen.beginPath(); pen.moveTo(x - 0.1 * h, y); pen.quadraticCurveTo(x - 0.06 * h, y + 0.35 * h, x + sw, y + 0.62 * h);
  pen.quadraticCurveTo(x + 0.04 * h, y + 0.3 * h, x + 0.1 * h, y); pen.closePath();
  pen.fillStyle = "#d8d2c8"; pen.fill(); pen.strokeStyle = "#8a8478"; pen.lineWidth = 1; pen.stroke();
  pen.strokeStyle = "rgba(120, 112, 100, 0.6)";
  for (var k = -1; k <= 1; k++) { pen.beginPath(); pen.moveTo(x + k * 0.04 * h, y + 0.04 * h); pen.quadraticCurveTo(x + k * 0.03 * h, y + 0.3 * h, x + sw * 0.8, y + 0.56 * h); pen.stroke(); }
  pen.restore();
}
// Strings of beads hanging from someone's headband over the eyes, no lower than the nose (j: person()'s joints).
function hhBeadVeil(j, t) {
  var cr = himmaJoint(j.crown), ch = himmaJoint(j.chin), h = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]);
  var top = mix(cr[1], ch[1], 0.3), low = mix(cr[1], ch[1], 0.66), mx = mix(cr[0], ch[0], 0.5) + 0.06 * h;
  pen.save();
  for (var k = -4; k <= 4; k++) {
    var x = mx + k * 0.075 * h, sway = 0.01 * h * Math.sin(t * 1.6 + k), end = low - Math.abs(k) * 0.02 * h;
    pen.strokeStyle = "rgba(60, 40, 20, 0.6)"; pen.lineWidth = 0.6; pen.beginPath(); pen.moveTo(x, top); pen.lineTo(x + sway, end); pen.stroke();
    for (var y = top + 0.03 * h; y <= end; y += 0.045 * h) {
      pen.fillStyle = ["#c8302a", "#e0b23a", "#2e6a8a", "#f4eee0"][(k + 8 + Math.round(y)) % 4];
      pen.beginPath(); pen.arc(x + sway * (y - top) / (end - top), y, 0.017 * h, 0, 7); pen.fill();
    }
  }
  pen.restore();
}
// An astrologer's board (a slate of black lacquer, its reckoning in chalk), lying before him at (x, y).
function hhBoard(x, y, seed) {
  pen.save();
  pen.translate(x, y);
  pen.fillStyle = "#1e1a18"; pen.strokeStyle = "#8a6a3a"; pen.lineWidth = 3;
  pen.beginPath(); pen.moveTo(-60, 0); pen.lineTo(50, 0); pen.lineTo(64, -22); pen.lineTo(-46, -22); pen.closePath(); pen.fill(); pen.stroke();
  pen.fillStyle = "rgba(240, 236, 220, 0.85)";
  for (var k = 0; k < 14; k++) { pen.fillRect(-44 + (k % 7) * 14 + (dice(seed + k) * 4), -17 + Math.floor(k / 7) * 8, 6, 2); }
  pen.restore();
}

// ---------- the orchard at the city's edge ----------
// Where the old gardeners live and Vimala with them (scenes 5, 8, 9, 20): the far hills, a meadow, their bamboo house
// on posts among fruit trees in flower (mango, banana), beds of vegetables before it, a fence of split bamboo. Painted
// once; a scene lays the hour over it. HH_ORCHARD_HOUSE: [x, base, size]; HH_ORCHARD_GROUND: where people stand.
var HH_ORCHARD = {};
var HH_ORCHARD_HOUSE = [1250, 840, 0.95];
var HH_ORCHARD_GROUND = 930;
function hhOrchard(light) {                             // light: the mountains' hour ("day" unless told: "dusk")
  light = light === "dusk" ? "dusk" : "day";
  if (HH_ORCHARD[light]) { return HH_ORCHARD[light]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d"), k;
  b.drawImage(hhRangeAt(600, light), 0, 0);             // the film's own mountains (scenery pass, 2026-11-12)
  sceneryMeadow(b, 0, WIDE, 590, 1080, {seed: 21, haze: "#b4cfa0", many: 1.2});
  // the meadow's far edge, where it met the hills in a ruled line, planted on a wandering line, small with distance
  // (owner, 2026-11-13: the two-line way)
  // behind the garden the jungle's edge (owner, 2026-11-13, twice: "more of a on the edge of the jungle feel"): a belt of
  // forest with palms and bamboo, its foot planted on a wandering line
  forest(b, -80, WIDE + 80, 640, {tall: 210, seed: 33, far: 0.25, palms: 4, bamboo: 4, front: false});
  hhEdgePlants(b, hhWander(642, 8, 11), -40, WIDE + 40, 31, {tall: 46, trees: true});
  thkTreeOn(b, 260, 760, 0.34, 81, [["mango", 22, 14]]);
  thkTreeOn(b, 1700, 770, 0.3, 83, [["frangipani", 26, 12]]);
  floraTree(b, 760, 800, 0.8, "mango", 3);
  for (k = 0; k < 4; k++) { banana(b, 560 + k * 70, 820 + 6 * (k % 2)); }
  // the garden full (owner, 2026-11-13): fruit trees and bushes, herbs and flowers in clumps, before and beside the hut
  var keep = pen; pen = b;
  try {
    [["pineapple", 470, 900, 0.4], ["sugarcane", 1880, 840, 0.6]].forEach(function (f) { flora(f[0], f[1], f[2], {size: f[3], ground: false}); });
    [[1300, 800, 0.18, "longan"], [1560, 790, 0.16, "mango"], [110, 805, 0.2, "longan"]].forEach(function (f, k) {   // small fruit trees
      thkTreeOn(b, f[0], f[1], f[2], 141 + k, [[f[3], 22, 12]]);
    });
    [["phlu", 330, 935], ["hom", 400, 945], ["makhwaen", 1180, 935], ["miang", 1420, 945], ["tahern", 1500, 950],
     ["marigold", 1600, 955], ["dokkaew", 1680, 945], ["sompoi", 1760, 950], ["kettawa", 1840, 945], ["orchid", 1100, 940],
     ["hibiscus", 210, 950], ["buatong", 1060, 955]].forEach(function (f, k) { flora(f[0], f[1], f[2], {size: 0.36 + 0.06 * (k % 3), ground: false}); });
    // the garden full (owner, again): flowering bushes round the hut and along the beds, banana and herbs in clumps, more
    // fruit trees, rows of herbs in the beds
    [[960, 860, 200, 90, "bougainvillea", "#d8338a"], [1520, 870, 180, 80, "hibiscus", "#f0a030"], [1640, 880, 220, 96, "jasmine"],
     [700, 880, 170, 80, "marigold"], [1810, 890, 200, 90, "hibiscus", "#d93a2e"], [60, 900, 220, 100, "bougainvillea", "#e86a2a"],
     [380, 880, 160, 70, "tahern"], [1150, 905, 150, 66, "dokkaew"]].forEach(function (u, k) {
      thkPlace(sceneryBush(u[2], u[3], 161 + k, THK_GREENS, [[u[4], 18, 10, u[5]]]), u[0], u[1], 1, 0);
    });
    [[860, 800, 0.22, "mango"], [1880, 790, 0.2, "longan"]].forEach(function (f, k) { thkTreeOn(b, f[0], f[1], f[2], 171 + k, [[f[3], 22, 12]]); });
    for (var bn = 0; bn < 3; bn++) { banana(b, 1080 + bn * 46, 860 + 6 * (bn % 2)); }
    for (var hb = 0; hb < 18; hb++) {                     // rows of herbs and greens in the beds
      flora(["phlu", "hom", "makhwaen", "miang", "tahern", "sompoi"][hb % 6], 260 + (hb % 6) * 150 + 30 * Math.floor(hb / 6), 975 - 8 * Math.floor(hb / 6), {size: 0.3, ground: false});
    }
  } finally { pen = keep; }
  ruenPhuk(b, HH_ORCHARD_HOUSE[0], HH_ORCHARD_HOUSE[1], HH_ORCHARD_HOUSE[2], {});
  for (k = 0; k < 5; k++) {                              // the vegetable beds, rows of green
    b.fillStyle = "#7a5a3a"; b.fillRect(240 + k * 150, 960, 120, 28);
    b.fillStyle = "#5e8a3a";
    for (var p = 0; p < 6; p++) { b.beginPath(); b.ellipse(252 + k * 150 + p * 19, 958, 9, 6, 0, 0, 7); b.fill(); }
  }
  b.strokeStyle = "#c8b080"; b.lineWidth = 4;            // the split-bamboo fence along the front
  for (k = 0; k < 40; k++) { b.beginPath(); b.moveTo(k * 50, 1040); b.lineTo(k * 50 + 4, 990); b.stroke(); }
  b.lineWidth = 3; b.beginPath(); b.moveTo(0, 1008); b.lineTo(WIDE, 1004); b.stroke();
  HH_ORCHARD[light] = paper;
  return paper;
}
// The orchard at an hour: "day", "dusk" (a warm low sun) or "night" (the moon, darkened). e.g. hhOrchardAt(t, "dusk");
function hhOrchardAt(t, hour) {
  hhPlace("orchard-" + hour);
  pen.drawImage(welSky(hour === "night" ? "clear" : hour === "dusk" ? "sunset" : "day"), 0, 0);
  if (hour === "day") { welClouds(t, "day", 1); }
  if (hour === "dusk") { scenerySun(t, 420, 470, 36, {glow: 10, colour: "255, 196, 130"}); }
  pen.drawImage(hhOrchard(hour), 0, 0);
  if (hour === "dusk") { pen.fillStyle = "rgba(160, 80, 60, 0.25)"; pen.fillRect(0, 0, WIDE, 1080); }
  if (hour === "night") { hhNight(0.62, t); }
}
// Something held in the arms at a person's chest (x, y the person's feet; size the look's): drawn by draw(cx, cy).
function hhAtChest(x, y, size, face, draw) { draw(x + 14 * face * size, y - 250 * size); }

// ---------- heaven ----------
// Indra's heaven (Tavatimsa): a bright sky, gold light, the clouds of Thai painting (honghin.js thaiCloud), a palace
// far off on its cloud (vimana). t: seconds; low: the clouds' line (1000 unless told). e.g. hhHeaven(t);
function hhHeaven(t, low) {
  hhPlace("heaven");
  var g = pen.createLinearGradient(0, 0, 0, 1080);
  g.addColorStop(0, "#5a78b8"); g.addColorStop(0.6, "#c8d8f0"); g.addColorStop(1, "#fbe8c8");
  pen.fillStyle = g; pen.fillRect(-WIDE, -400, 3 * WIDE, 2000);
  var glow = pen.createRadialGradient(960, 420, 40, 960, 420, 700);
  glow.addColorStop(0, "rgba(255, 244, 200, 0.6)"); glow.addColorStop(1, "rgba(255, 244, 200, 0)");
  pen.fillStyle = glow; pen.fillRect(-WIDE, -400, 3 * WIDE, 2000);
  vimana(1560, 420, t, {kind: "prasat", size: 0.3});
  vimana(300, 360, t + 4, {kind: "hall", size: 0.22});
  // heaven's floor of soft cloud, the kit's clouds (owner, 2026-11-13: "Replace the clouds in the video with the new
  // style clouds"), a sea of it across the foot and a bank on each side
  sceneryCloudBank(t, 960, (low || 1000) + 120, 2600, {seed: 2, dense: 2});
  sceneryCloudBank(t, 300, (low || 1000) + 10, 1000, {seed: 3});
  sceneryCloudBank(t, 1500, (low || 1000) + 30, 1100, {seed: 5});
}
// A tuft of cloud in front of what stands in heaven (x, y its foot), its tops over the feet, so they stand in the cloud
// (the owner, 2026-11-12: "Put their feet behind the tops of a cloud"). Those standing there have ground: false (no
// shadow). wide: the tuft's width (280 unless told). e.g. person(x, y, {..., ground: false}); hhCloudFeet(x, y, t);
function hhCloudFeet(x, y, t, wide, seed) { sceneryCloudBank(t, x, y + 0.06 * (wide || 280) + 24, (wide || 280) * 1.15, {seed: seed || 11, dense: 4, drift: 4}); }
// The golden boulder Indra makes the swan from: a rounded stone of gold, flecked, glowing as he speaks over it.
// (x, y): its foot; glow 0 to 1. e.g. hhBoulder(900, 900, between(t, 8, 12));
function hhBoulder(x, y, glow) {
  if (glow > 0) {
    var g = pen.createRadialGradient(x, y - 90, 10, x, y - 90, 320);
    g.addColorStop(0, "rgba(255, 236, 160, " + (0.7 * glow) + ")"); g.addColorStop(1, "rgba(255, 236, 160, 0)");
    pen.fillStyle = g; pen.beginPath(); pen.arc(x, y - 90, 320, 0, 7); pen.fill();
  }
  pen.beginPath();
  pen.moveTo(x - 150, y); pen.bezierCurveTo(x - 170, y - 120, x - 60, y - 190, x + 30, y - 180);
  pen.bezierCurveTo(x + 150, y - 160, x + 170, y - 60, x + 150, y); pen.closePath();
  var gold = pen.createLinearGradient(x - 120, y - 190, x + 120, y);
  gold.addColorStop(0, "#f6dc8a"); gold.addColorStop(0.5, "#d6a84a"); gold.addColorStop(1, "#8a6420");
  pen.fillStyle = gold; pen.fill(); pen.strokeStyle = "#5a3e12"; pen.lineWidth = 2.5; pen.stroke();
  for (var k = 0; k < 60; k++) {
    pen.fillStyle = k % 2 ? "rgba(255, 246, 210, 0.7)" : "rgba(90, 60, 20, 0.4)";
    pen.beginPath(); pen.arc(x - 120 + dice(k + 300) * 250, y - 150 + dice(k + 400) * 140, 1.5 + 2 * dice(k + 500), 0, 7); pen.fill();
  }
}
// Kanchai in a hand: its grip in the wrist person() gave back (j.wristA, or j.wristB with hand "B"), the blade at angle
// (radians, 0 upright, + forward for face 1). The owner, 2026-11-12: "Make sure he is holding the sword" (drawn at the
// hand's goal, it floated where the arm did not reach). e.g. hhSword(person(...), -0.7, 0.42);
function hhSword(j, angle, size, hand) {
  var w = himmaJoint(hand === "B" ? j.wristB : j.wristA), grip = 48 * size;
  kanchai(w[0] - Math.sin(angle) * grip, w[1] + Math.cos(angle) * grip, {size: size, angle: angle});
}
// What draw() gives back (person()'s joints), drawn on a sheet that is thrown away: where a figure's mouth or hands will
// be before it is drawn for the film (the giants at the feast bring their meat to their mouths). e.g.
// var j = hhJointsOf(function () { return ogre(x, y, t, look); });
var HH_SCRAP = null;
function hhJointsOf(draw) {
  if (!HH_SCRAP || HH_SCRAP.width !== pen.canvas.width) {
    HH_SCRAP = document.createElement("canvas"); HH_SCRAP.width = pen.canvas.width; HH_SCRAP.height = pen.canvas.height;
  }
  var scrap = HH_SCRAP.getContext("2d"), keep = pen;
  scrap.setTransform(keep.getTransform());
  pen = scrap;
  try { return draw(); } finally { pen = keep; }
}
// A tree a ghoul throws, torn up by the roots: at (x, y) its middle, turned by turn radians, size 1 about 200 long.
function hhThrownTree(x, y, turn, size) {
  pen.save(); pen.translate(x, y); pen.rotate(turn); pen.scale(size, size);
  pen.strokeStyle = "#5a3a1e"; pen.lineWidth = 4; pen.lineCap = "round";
  [[-80, -6, -104, -22], [-80, 0, -110, 4], [-80, 6, -100, 24]].forEach(function (r) { pen.beginPath(); pen.moveTo(r[0], r[1]); pen.lineTo(r[2], r[3]); pen.stroke(); });
  pen.fillStyle = "#6a4424"; pen.beginPath(); pen.moveTo(-84, -9); pen.lineTo(40, -6); pen.lineTo(40, 6); pen.lineTo(-84, 9); pen.closePath(); pen.fill();
  pen.fillStyle = "#3e6a34"; pen.strokeStyle = "#24401e"; pen.lineWidth = 2;
  [[50, -20, 34], [78, 4, 36], [52, 22, 30], [96, -18, 26], [30, 0, 26]].forEach(function (c) { pen.beginPath(); pen.arc(c[0], c[1], c[2], 0, 7); pen.fill(); pen.stroke(); });
  pen.fillStyle = "rgba(160, 200, 110, 0.5)"; pen.beginPath(); pen.arc(60, -26, 14, 0, 7); pen.arc(88, -6, 12, 0, 7); pen.fill();
  pen.restore();
}
// Shackles round both wrists of someone person() drew (j its joints): an iron cuff round each, across the forearm, and a
// short chain hanging between (owner, 2026-11-13: "Make sure there are shackles around each wrist"). size: 1 at a
// grown person's. e.g. hhShackles(person(x, y, look), 0.8);
function hhShackles(j, size) {
  if (!j || !j.wristA || !j.wristB) { return; }
  var u = size || 1, cuffs = [["A"], ["B"]].map(function (w) {
    var wr = himmaJoint(j["wrist" + w[0]]), el = himmaJoint(j["elbow" + w[0]]), a = Math.atan2(wr[1] - el[1], wr[0] - el[0]);
    return [wr[0] - Math.cos(a) * 4 * u, wr[1] - Math.sin(a) * 4 * u, a];
  });
  pen.save();
  var c0 = cuffs[0], c1 = cuffs[1], sag = 14 * u + 0.25 * Math.abs(c0[0] - c1[0]);   // the chain, sagging, in oval links
  for (var k = 0; k <= 6; k++) {
    var q = k / 6, x = mix(c0[0], c1[0], q), y = mix(c0[1], c1[1], q) + sag * 4 * q * (1 - q);
    pen.save(); pen.translate(x, y); pen.rotate(k % 2 ? 1.2 : 0.2);
    pen.strokeStyle = "#2e3034"; pen.lineWidth = 2.4 * u; pen.beginPath(); pen.ellipse(0, 0, 4.2 * u, 2.6 * u, 0, 0, 7); pen.stroke();
    pen.restore();
  }
  cuffs.forEach(function (c) {                        // each cuff: a band of iron round the wrist, lit on its edge
    pen.save(); pen.translate(c[0], c[1]); pen.rotate(c[2]);
    pen.fillStyle = "#4a4c52"; pen.strokeStyle = "#1a1b1e"; pen.lineWidth = 1.4 * u;
    pen.beginPath(); pen.rect(-4 * u, -9 * u, 8 * u, 18 * u); pen.fill(); pen.stroke();
    pen.fillStyle = "rgba(220, 225, 235, 0.45)"; pen.fillRect(-3 * u, -8 * u, 2 * u, 16 * u);
    pen.fillStyle = "#1a1b1e"; pen.beginPath(); pen.arc(0, 9 * u, 2 * u, 0, 7); pen.fill();   // its rivet
    pen.restore();
  });
  pen.restore();
}
// The other way round from hhArmOver(): someone drawn again whole except one forearm (from mid upper arm to the hand),
// so that forearm stays behind what was drawn over it (an embrace: his far arm behind her). e.g. hhArmUnder(sj, "B", 22, son);
function hhArmUnder(j, which, wide, draw) {
  var sh = himmaJoint(j["shoulder" + which]), el = himmaJoint(j["elbow" + which]);
  var pts = [[mix(sh[0], el[0], 0.5), mix(sh[1], el[1], 0.5)], el, himmaJoint(j["wrist" + which]), himmaJoint(j["hand" + which])];
  pen.save();
  pen.beginPath(); pen.rect(-2 * WIDE, -2000, 5 * WIDE, 5000);
  pts.forEach(function (q, k) {
    if (k === 0) { return; }
    var a = pts[k - 1], len = Math.hypot(q[0] - a[0], q[1] - a[1]) || 1, nx = -(q[1] - a[1]) / len * wide, ny = (q[0] - a[0]) / len * wide;
    var ex = (q[0] - a[0]) / len * wide, ey = (q[1] - a[1]) / len * wide;
    pen.moveTo(a[0] + nx, a[1] + ny); pen.lineTo(q[0] + nx + ex, q[1] + ny + ey); pen.lineTo(q[0] - nx + ex, q[1] - ny + ey); pen.lineTo(a[0] - nx, a[1] - ny); pen.closePath();
  });
  pen.clip("evenodd");
  try { draw(); } finally { pen.restore(); }
}
// A torch: a wooden brand held in the fist of j (person()'s joints, the near hand), leaning by lean radians (0 upright, -
// toward a figure facing left's front), drawn before the figure so the fist closes over it. Gives back the point of its
// head, where hhFlame() burns. e.g. var top = hhBrand(hhJointsOf(function () { return person(x, y, look); }), -0.2);
function hhBrand(j, lean) {
  var w = himmaJoint(j.wristA), h = himmaJoint(j.handA), grip = [mix(w[0], h[0], 0.55), mix(w[1], h[1], 0.55)];
  var up = [Math.sin(lean), -Math.cos(lean)], foot = [grip[0] - up[0] * 46, grip[1] - up[1] * 46], top = [grip[0] + up[0] * 96, grip[1] + up[1] * 96];
  pen.save();
  pen.lineCap = "round";
  pen.strokeStyle = "#3a2410"; pen.lineWidth = 11;   // the stick, dark-edged
  pen.beginPath(); pen.moveTo(foot[0], foot[1]); pen.lineTo(top[0], top[1]); pen.stroke();
  pen.strokeStyle = "#7a5230"; pen.lineWidth = 7;
  pen.beginPath(); pen.moveTo(foot[0], foot[1]); pen.lineTo(top[0], top[1]); pen.stroke();
  pen.strokeStyle = "rgba(40, 24, 10, 0.55)"; pen.lineWidth = 1.2;   // its grain and a knot
  pen.beginPath(); pen.moveTo(foot[0] + 1.5, foot[1]); pen.lineTo(top[0] + 1.5, top[1]); pen.stroke();
  pen.fillStyle = "#4a2e14"; pen.beginPath(); pen.ellipse(mix(foot[0], top[0], 0.3) - 2, mix(foot[1], top[1], 0.3), 2.5, 4, lean, 0, 7); pen.fill();
  pen.translate(top[0], top[1]); pen.rotate(lean);   // the head: cloth bound round it, charred
  pen.fillStyle = "#4a3a2a"; pen.beginPath(); pen.ellipse(0, 8, 9, 16, 0, 0, 7); pen.fill();
  pen.strokeStyle = "#2a1c10"; pen.lineWidth = 1.5;
  for (var k = 0; k < 4; k++) { pen.beginPath(); pen.moveTo(-9, k * 7); pen.lineTo(9, k * 7 + 4); pen.stroke(); }
  pen.restore();
  return [top[0], top[1] - 6];
}
// A flame at (x, y) (its foot), flickering at second t, alpha a: the torch's. e.g. hhFlame(500, 600, t, 1);
function hhFlame(x, y, t, a) {
  var tall = 34 * (0.9 + 0.12 * Math.sin(t * 11) + 0.06 * Math.sin(t * 23));
  pen.save(); pen.globalAlpha *= a; pen.translate(x, y);
  [["rgba(255, 120, 40, 0.75)", 15, tall], ["#ffb440", 10, tall * 0.78], ["#fff2b0", 5, tall * 0.5]].forEach(function (f, k) {
    var sway = 3 * Math.sin(t * 7 + k);
    pen.fillStyle = f[0]; pen.beginPath(); pen.moveTo(-f[1], 0);
    pen.quadraticCurveTo(-f[1], -f[2] * 0.5, sway, -f[2]); pen.quadraticCurveTo(f[1], -f[2] * 0.5, f[1], 0);
    pen.quadraticCurveTo(0, f[1] * 0.6, -f[1], 0); pen.fill();
  });
  pen.restore();
}
// A throw, as the owner's reference (a jump shot, 2026-11-13: "cock his arm back and fold it and then extend the arm and
// rotate it forward and take the wrist from a cocked back position to a follow through flex"). j: the thrower's joints
// (person()'s, from hhJointsOf() before drawing), face: 1 or -1, p: 0 to 1 through the throw (0.6 the release). Gives
// back {reach, wrist, held, release}: reachA and wristA for the look, held true while the thing is still in the hand,
// release where it leaves it. e.g. var th = hhThrow(probe, 1, p); look.reachA = th.reach; look.wristA = th.wrist;
function hhThrow(j, face, p) {
  var sh = himmaJoint(j.shoulderA), cr = himmaJoint(j.crown), ch = himmaJoint(j.chin), u = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]) / 100;
  function at(dx, dy) { return [sh[0] + dx * u * face, sh[1] + dy * u]; }
  var rest = at(40, 60), cocked = at(16, -140), out = at(70, -232), through = at(100, -196);   // cocked above the brow, clear of the face
  var hand, wrist;
  if (p < 0.4) { var a = between(p, 0, 0.4); hand = [mix(rest[0], cocked[0], a), mix(rest[1], cocked[1], a)]; wrist = mix(0, -1.1, a); }
  else if (p < 0.6) { var b = between(p, 0.4, 0.6); hand = [mix(cocked[0], out[0], b), mix(cocked[1], out[1], b)]; wrist = mix(-1.1, -0.5, b); }
  else if (p < 0.78) { var c = between(p, 0.6, 0.78); hand = [mix(out[0], through[0], c), mix(out[1], through[1], c)]; wrist = mix(-0.5, 1.6, c); }
  else { var d = between(p, 0.78, 1); hand = [mix(through[0], rest[0], d * d), mix(through[1], rest[1], d * d)]; wrist = mix(1.6, 0, d); }
  return {reach: hand, wrist: wrist, held: p < 0.6, release: out};
}
// One forearm of someone already drawn, laid again over what was drawn after them: draw() draws them again, clipped to
// a band round j's elbow, wrist and hand (which "A" near or "B" far, wide pixels of the film each side). So in an
// embrace her near arm lies over him while her far arm stays behind him. e.g. hhArmOver(vj, "A", 30, function () { person(...); });
function hhArmOver(j, which, wide, draw) {
  var pts = [j["elbow" + which], j["wrist" + which], j["hand" + which]].map(himmaJoint);
  pen.save();
  pen.beginPath();
  pts.forEach(function (q, k) {
    if (k === 0) { return; }
    var a = pts[k - 1], len = Math.hypot(q[0] - a[0], q[1] - a[1]) || 1, nx = -(q[1] - a[1]) / len * wide, ny = (q[0] - a[0]) / len * wide;
    var ex = (q[0] - a[0]) / len * wide, ey = (q[1] - a[1]) / len * wide;   // past each end a little, round the hand
    pen.moveTo(a[0] + nx, a[1] + ny); pen.lineTo(q[0] + nx + ex, q[1] + ny + ey); pen.lineTo(q[0] - nx + ex, q[1] - ny + ey); pen.lineTo(a[0] - nx, a[1] - ny); pen.closePath();
  });
  pen.clip();
  try { draw(); } finally { pen.restore(); }
}
// Tears running down a face, from the joints person() gave back (j.crown, j.chin): a wet line from each eye and a drop
// sliding down it, again and again (t: seconds). The painted women's faces draw no tears of their own (Vimala's happy
// tears, the owner 2026-11-12, were not seen). face: the way the head turns (1 right). e.g. hhTears(vj, -1, t);
function hhTears(j, face, t) {
  var cr = himmaJoint(j.crown), ch = himmaJoint(j.chin), h = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]);
  [[-0.17, 0], [0.14, 0.5]].forEach(function (e) {
    var x = mix(cr[0], ch[0], 0.55) + (e[0] + 0.12) * h * face, y = mix(cr[1], ch[1], 0.58), run = (t * 0.6 + e[1]) % 1;
    pen.strokeStyle = "rgba(170, 215, 245, 0.75)"; pen.lineWidth = Math.max(1, 0.025 * h); pen.lineCap = "round";
    pen.beginPath(); pen.moveTo(x, y); pen.quadraticCurveTo(x + 0.02 * h * face, y + 0.12 * h, x + 0.01 * h * face, y + 0.24 * h); pen.stroke();
    var dy = y + 0.24 * h * run, r = Math.max(1.2, 0.035 * h);
    pen.fillStyle = "rgba(190, 230, 255, 0.95)"; pen.strokeStyle = "rgba(70, 130, 180, 0.8)"; pen.lineWidth = 0.8;
    pen.beginPath(); pen.moveTo(x, dy - 1.6 * r); pen.quadraticCurveTo(x + r, dy, x, dy + r); pen.quadraticCurveTo(x - r, dy, x, dy - 1.6 * r);
    pen.fill(); pen.stroke();
  });
}
// The boy at an age (years), as the film's prince: HH_BOY at the size of his years. e.g. person(x, y, hhBoy(13, {face: 1}));
function hhBoy(years, extra) {
  return welPerson("fellow", Object.assign({}, HH_BOY, {size: 0.3 + 0.028 * years, sabai: false}), Object.assign({id: "boy"}, extra || {}));
}

// ---------- the giant kingdoms ----------
// A giant king's palace (scenes 12, 13): the hall (pieces.js hoKham, fine) in the colours of his kingdom under a sky of
// its own, its court of red earth, far hills. kingdom: "red" (Wassawaro's), "green" (Kumbhanda's, in the forest) or
// "blue" (Anumat's). HH_GIANT_HALL: [x, base, size]. who: [[x offset, look or painter (x, y)], ...] seated on the dais.
var HH_GIANT_HALL = [960, 900, 1.0];
var HH_GIANT_SKY = {red: ["#6a2a3a", "#e8905a", "#f6d0a0"], green: ["#2a5a4a", "#9ac8a0", "#e8f0d0"], blue: ["#2a3a6a", "#8aa0d8", "#e0e4f0"]};
// Each kingdom's own far mountains in its air: [colour, air, seed] for farRange() (scenery pass, 2026-11-12).
var HH_GIANT_FAR = {red: ["#a8869a", "236, 196, 170", 31], green: ["#8aa898", "226, 238, 220", 33], blue: ["#8e9ac0", "220, 226, 244", 35]};
// A giant city's court, painted once for each kingdom, WIDE + 400 across from x -200: its earth (blue-grey in Anumat's
// city, red elsewhere) textured, and where it meets the far hills an undulating line planted thick with flowering
// bushes, grass and small trees, so no ruled edge shows (the owner, 2026-11-13, of the big brown field at 11:26).
var HH_GIANT_GROUND = {};
function hhGiantGround(kingdom) {
  if (HH_GIANT_GROUND[kingdom]) { return HH_GIANT_GROUND[kingdom]; }
  var paper = document.createElement("canvas"); paper.width = WIDE + 400; paper.height = 1080;
  var b = paper.getContext("2d"), blue = kingdom === "blue", seed = {red: 3, green: 5, blue: 7}[kingdom];
  b.translate(200, 0);
  csBand(b, -200, 640, WIDE + 400, 700, blue ? "#8a8aa0" : "#b8784e", blue ? "#6a6a84" : "#8a5236");
  hhGroundTexture(b, -200, 640, WIDE + 200, 1080, blue ? "#7c7c94" : "#a86a44", seed * 11, {many: 2.2, weeds: 34});
  hhEdgePlants(b, hhWander(652, 10, seed), -200, WIDE + 200, seed * 13, {tall: 70, trees: true,
    greens: kingdom === "green" ? THK_SHADE : THK_GREENS});
  HH_GIANT_GROUND[kingdom] = paper;
  return paper;
}
function hhGiantCity(t, kingdom, who, sprites) {
  var c = HH_GIANT_SKY[kingdom], g = pen.createLinearGradient(0, 0, 0, 900);
  g.addColorStop(0, c[0]); g.addColorStop(0.55, c[1]); g.addColorStop(1, c[2]);
  pen.fillStyle = g; pen.fillRect(-WIDE, -400, 3 * WIDE, 2000);
  hhPlace("giant");
  pen.drawImage(farRange(HH_GIANT_FAR[kingdom][0], HH_GIANT_FAR[kingdom][1], 660, {peak: false, ridges: 2, pines: 12, seed: HH_GIANT_FAR[kingdom][2]}), 0, 0);
  if (kingdom === "green") { forest(pen, -100, WIDE + 100, 700, {tall: 320, seed: 13, far: 0.4}); }
  pen.drawImage(hhGiantGround(kingdom), -200, 0);       // the court textured, its far edge planted (owner, 2026-11-13)
  pen.drawImage(hhGiantTrees(kingdom), 0, 0);           // trees in flower round the hall (scenery pass, 2026-11-12)
  var h = HH_GIANT_HALL, dais = hoKhamDais(h[1], h[2]);
  var list = [{name: "hall back", kind: "palace", z: "set", y: dais - 1, draw: function () { hoKham(pen, h[0], h[1], h[2], {part: "back", fine: true}); }},
              {name: "hall front", kind: "palace", z: "set", y: dais + 1, draw: function () { hoKham(pen, h[0], h[1], h[2], {part: "front", fine: true, pediment: "peacock"}); }}];
  (who || []).forEach(function (w, k) {
    list.push({name: "dais " + k, kind: "person", z: "set", x: h[0] + w[0], y: dais, draw: function () {
      if (typeof w[1] === "function") { w[1](h[0] + w[0], dais); } else { person(h[0] + w[0], dais, w[1]); }   // a look, or a painter (x, y)
    }});
  });
  drawByZ(list.concat(sprites || []));
}

// A giant king's daughter (ogre.js ogreDaughter()) with her arms down: her mural's pose let go (Culakantha's is the
// celestial's, an arm raised to the sky; the owner, 2026-11-12: "put their princess's arm down").
// e.g. hhGiantCity(t, "green", [[0, hhDaughter("culakantha", {size: 0.8, floor: "side"})]]);
function hhDaughter(name, more) {
  var look = ogreDaughter(name, more);
  if (look.woman && typeof look.woman === "object") { look.woman = Object.assign({}, look.woman, {pose: undefined, holds: undefined}); }
  return look;
}

// A giant king's daughter drawn at (x, y), facing the way more.face says. ogreDaughter()'s painted women face right
// whatever their face (found 2026-11-12: Mukhawadi turned to her father, away from the boy, though told face -1), so one
// facing left is drawn mirrored about x, the point she looks at mirrored with her. Culakantha with her arms down
// (hhDaughter()). Gives back person()'s joints. e.g. hhPrincessAt(900, dais, "mukhawadi", {floor: "side", face: -1, at: [500, 700]});
function hhPrincessAt(x, y, name, more) {
  var left = more.face === -1, own = Object.assign({}, more, {face: 1});
  if (left && own.at) { own.at = [2 * x - own.at[0], own.at[1]]; }
  var look = name === "culakantha" ? hhDaughter(name, own) : ogreDaughter(name, own);
  if (left) { pen.save(); pen.translate(x, 0); pen.scale(-1, 1); pen.translate(-x, 0); }
  try { var j = person(x, y, look); hhFangs(j, HH_FANG_AT[name]); return j; } finally { if (left) { pen.restore(); } }
}
// A giant princess's two small fangs (owner, 2026-11-13: "The princess giants should have little fangs sticking out like
// the reference image but otherwise be the same"): white, rising from the corners of the lower lip, on a face turned to
// the right (hhPrincessAt() mirrors one facing left). j: person()'s joints.
// at: [how far down the crown-to-chin line her mouth is, how far forward], by her painted face (HH_FANG_AT)
var HH_FANG_AT = {mukhawadi: [1.22, 0.19], culakantha: [1.22, 0.19], salicanta: [1.22, 0.19]};   // measured on the painted faces drawn large (2026-11-13)
function hhFangs(j, at) {
  if (!j || !j.crown || !j.chin) { return; }
  var cr = himmaJoint(j.crown), ch = himmaJoint(j.chin), h = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]);
  at = at || [1.22, 0.19];
  var m = [mix(cr[0], ch[0], at[0]) + at[1] * h, mix(cr[1], ch[1], at[0])];   // the painted face's mouth: below the joints' chin (measured 2026-11-13)
  // a mouth a little larger than the painted one, drawn over it and fitted round the tusks (owner, 2026-11-13)
  pen.save();
  var mw = 0.075 * h, mh = 0.018 * h;
  pen.beginPath(); pen.moveTo(m[0] - mw, m[1] + 0.012 * h); pen.quadraticCurveTo(m[0] - mw * 0.4, m[1] - mh, m[0], m[1] - mh * 0.4);
  pen.quadraticCurveTo(m[0] + mw * 0.4, m[1] - mh, m[0] + mw, m[1] + 0.012 * h);
  pen.quadraticCurveTo(m[0], m[1] + 0.012 * h + mh * 2.6, m[0] - mw, m[1] + 0.012 * h); pen.closePath();
  pen.fillStyle = "#b8404a"; pen.fill(); pen.strokeStyle = "rgba(90, 30, 30, 0.8)"; pen.lineWidth = Math.max(0.6, h * 0.006); pen.stroke();
  pen.strokeStyle = "rgba(60, 10, 10, 0.9)"; pen.beginPath(); pen.moveTo(m[0] - mw * 0.9, m[1] + 0.012 * h); pen.quadraticCurveTo(m[0], m[1] + 0.02 * h, m[0] + mw * 0.9, m[1] + 0.012 * h); pen.stroke();
  pen.fillStyle = "rgba(255, 220, 220, 0.35)"; pen.beginPath(); pen.ellipse(m[0], m[1] + 0.026 * h, mw * 0.35, mh * 0.4, 0, 0, 7); pen.fill();
  pen.restore();
  pen.save(); pen.fillStyle = "#fffaf0"; pen.strokeStyle = "rgba(90, 60, 50, 0.8)"; pen.lineWidth = Math.max(0.6, h * 0.008);
  [-1, 1].forEach(function (d) {                    // tiny tusks as her father's (owner, 2026-11-13): from the lower lip's
    var x = m[0] + d * 0.055 * h, y = m[1] + 0.03 * h;   // from the lower lip at its corners   // corners: the base under the lower lip, the point up
    pen.beginPath(); pen.moveTo(x - 0.014 * h, y); pen.lineTo(x + 0.014 * h, y);
    pen.quadraticCurveTo(x + d * 0.012 * h, y - 0.03 * h, x + d * 0.016 * h, y - 0.07 * h);
    pen.quadraticCurveTo(x - d * 0.006 * h, y - 0.035 * h, x - 0.014 * h, y); pen.closePath(); pen.fill(); pen.stroke();
  });
  pen.restore();
}

// ---------- ground: no flat field, no ruled edge (the owner, 2026-11-13) ----------
// "Check for large fields of a single color and give them texture and decoration" and the two-line way: "make an
// undulating invisible line along the straight line where the green and brown fields meet. Then add vegetation,
// bushes, grasses, trees, flowers, etc. ... then make a second invisible line along the bottom of the canvas and add
// more decoration." docs/kit/places.md, "Painting the scenery", 10.

// Texture on a field of one colour, painted on b once: specks of lighter and darker earth, dry tufts, pebbles, fallen
// leaves and petals, a paler worn patch or two; smaller far (y0) than near (y1). base: the field's colour; seed: a
// number; look: {grass: green tufts instead of dry, many: how thick, 1}. e.g. hhGroundTexture(b, 0, 660, WIDE, 1080, "#b9a070", 3);
function hhGroundTexture(b, x0, y0, x1, y1, base, seed, look) {
  look = look || {};
  var many = look.many || 1, w = x1 - x0, h = y1 - y0, k, x, y, near, n;
  b.save();
  b.beginPath(); b.rect(x0, y0, w, h); b.clip();
  for (k = 0; k < 3; k++) {                         // worn patches, paler, soft-edged
    x = x0 + w * dice(seed * 7 + k); y = y0 + h * (0.3 + 0.6 * dice(seed * 11 + k)); near = (y - y0) / h;
    var g = b.createRadialGradient(x, y, 0, x, y, 160 + 160 * near);
    var pale = blend(base, "#f4ead0", 0.3), rgb = [1, 3, 5].map(function (i) { return parseInt(pale.slice(i, i + 2), 16); }).join(", ");
    g.addColorStop(0, "rgba(" + rgb + ", 0.8)"); g.addColorStop(1, "rgba(" + rgb + ", 0)");   // to clear in its own colour (to clear black darkened it)
    b.fillStyle = g; b.save(); b.translate(x, y); b.scale(1, 0.32); b.translate(-x, -y);
    b.beginPath(); b.arc(x, y, 160 + 160 * near, 0, 7); b.fill(); b.restore();
  }
  for (k = 0; k < 2600 * many * w / WIDE; k++) {    // specks of earth
    x = x0 + w * dice(seed * 13 + k); y = y0 + h * Math.sqrt(dice(seed * 17 + k)); near = (y - y0) / h;
    b.fillStyle = dice(seed * 19 + k) < 0.5 ? blend(base, "#5a4024", 0.35) : blend(base, "#fff4dc", 0.35);
    b.globalAlpha = 0.7; b.fillRect(x, y, 1.5 + 3 * near, 1 + 2 * near);
  }
  b.globalAlpha = 1;
  for (k = 0; k < 90 * many * w / WIDE; k++) {      // pebbles, a light on each
    x = x0 + w * dice(seed * 23 + k); y = y0 + h * dice(seed * 29 + k); near = 0.4 + 0.6 * (y - y0) / h;
    b.fillStyle = blend("#8a8070", base, 0.3 * dice(k));
    b.beginPath(); b.ellipse(x, y, (2 + 4 * dice(seed * 31 + k)) * near, (1.4 + 2.4 * dice(seed * 37 + k)) * near, 0, 0, 7); b.fill();
    b.fillStyle = "rgba(255, 250, 235, 0.5)"; b.beginPath(); b.ellipse(x - near, y - near, 1.2 * near, 0.8 * near, 0, 0, 7); b.fill();
  }
  for (k = 0; k < 160 * many * w / WIDE; k++) {     // tufts: short blades in a fan
    x = x0 + w * dice(seed * 41 + k); y = y0 + h * dice(seed * 43 + k); near = 0.35 + 0.65 * (y - y0) / h;
    var green = look.grass || dice(seed * 47 + k) < 0.35;
    b.strokeStyle = green ? blend("#6a8a3a", base, 0.2 + 0.3 * dice(k)) : blend("#a08850", base, 0.3);
    b.lineWidth = 1.1 * near + 0.3;
    for (n = 0; n < 5; n++) {
      var a = -Math.PI / 2 + (n - 2) * 0.28 + 0.2 * (dice(k * 5 + n) - 0.5), len = (7 + 9 * dice(k * 7 + n)) * near;
      b.beginPath(); b.moveTo(x + n - 2, y); b.quadraticCurveTo(x + n - 2 + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.6, x + n - 2 + Math.cos(a) * len, y + Math.sin(a) * len); b.stroke();
    }
  }
  if (look.weeds) {                                 // low weeds in flower here and there, on the ground's own sheet
    var keep = pen; pen = b;
    try {
      for (k = 0; k < look.weeds; k++) {
        x = x0 + w * dice(seed * 71 + k); y = y0 + h * (0.08 + 0.92 * dice(seed * 73 + k)); near = 0.35 + 0.65 * (y - y0) / h;
        var bl = [["marigold", 5, 6], ["jasmine", 8, 4], ["dokkaew", 6, 4], ["tahern", 4, 5]][k % 4];
        thkPlace(k % 3 ? sceneryGrass(34 * near + 10, 7, seed * 79 + k) : sceneryBush(60 * near + 20, 30 * near + 12, seed * 83 + k, THK_GREENS, [bl]), x, y, 1, 0);
      }
    } finally { pen = keep; }
  }
  var leaf = ["#8a6a2a", "#a8742a", "#6a7a3a", "#c88a3a", "#f3a6c0", "#fbf6ee"];
  for (k = 0; k < 70 * many * w / WIDE; k++) {      // fallen leaves and petals
    x = x0 + w * dice(seed * 53 + k); y = y0 + h * dice(seed * 59 + k); near = 0.4 + 0.6 * (y - y0) / h;
    b.fillStyle = leaf[Math.floor(dice(seed * 61 + k) * leaf.length)];
    b.beginPath(); b.ellipse(x, y, 4 * near, 1.8 * near, dice(seed * 67 + k) * 3, 0, 7); b.fill();
  }
  b.restore();
}
// An undulating line: y at x, wandering about base by amp (two waves, seed sets their phase). e.g. hhWander(660, 14, 3)(400);
function hhWander(base, amp, seed) {
  return function (x) { return base + amp * (0.6 * Math.sin(x / 173 + seed) + 0.4 * Math.sin(x / 61 + seed * 2.3)); };
}
// The first line planted, on b once: along line(x) from x0 to x1, thick with flowering bushes, grass and, if look.trees,
// small trees in flower behind them; look.skip: [[from, to], ...] stretches left clear (a house's front); look.tall: the
// bushes' height (90); look.greens; look.blooms ([[name, count, r, colour]] choices); seed. Its plants' feet are on the
// line, the line itself hidden under them. e.g. hhEdgePlants(b, hhWander(660, 12, 2), 0, WIDE, 7, {trees: true});
function hhEdgePlants(b, line, x0, x1, seed, look) {
  look = look || {};
  var tall = look.tall || 90, greens = look.greens || THK_GREENS, keep = pen, x, k = 0;
  var blooms = look.blooms || [["bougainvillea", 18, 10, "#d8338a"], ["hibiscus", 8, 12, "#d93a2e"], ["jasmine", 26, 6],
                                 ["ixora", 0, 0], ["marigold", 12, 9], ["tahern", 10, 9], ["dokkaew", 14, 7]];
  blooms = blooms.filter(function (bl) { return THK_BLOOMS[bl[0]]; });
  function clear(x) { return !(look.skip || []).some(function (s) { return x > s[0] && x < s[1]; }); }
  pen = b;
  try {
    if (look.trees) {                               // small trees in flower, behind the bushes
      for (x = x0 + 60 * dice(seed); x < x1; x += 260 + 200 * dice(seed * 3 + x)) {
        var tb = [["ratchaphruek", 28, 14], ["mango", 20, 14], ["frangipani", 28, 12], ["longan", 24, 14]][Math.floor(dice(x + seed) * 4)];
        if (clear(x)) { thkTreeOn(b, x, line(x) - 6, 0.16 + 0.08 * dice(seed * 5 + x), seed * 7 + Math.round(x), [tb]); }
      }
    }
    for (x = x0 - 40; x < x1 + 40; k++) {           // bushes and grass, close, overlapping
      var wide = tall * (1.4 + 1.2 * dice(seed * 11 + k)), high = tall * (0.7 + 0.6 * dice(seed * 13 + k));
      if (clear(x)) {
        if (k % 3 === 2) { thkPlace(sceneryGrass(high * 0.9, 10, seed * 17 + k, greens), x, line(x) + 4, 1, 0); }
        else { thkPlace(sceneryBush(wide, high, seed * 19 + k, greens, [blooms[k % blooms.length]]), x, line(x) + 6, 1, 0); }
      }
      x += wide * (0.45 + 0.25 * dice(seed * 23 + k));
    }
  } finally { pen = keep; }
}
// The second line: along the bottom of the picture, low grass, flowers and leaves, as sceneryBeds() items (they sway),
// drawn after the people (their feet stand above it). seed; look: {greens, tall: (70), at: the line's y (1086)}.
// e.g. var front = hhBottomPlants(5); ... sceneryBeds(t, front, {sway: 0.3});
var HH_BOTTOM = {};
function hhBottomPlants(seed, look) {
  look = look || {};
  var key = seed + ":" + (look.tall || 70) + ":" + (look.at || 1086);
  if (HH_BOTTOM[key]) { return HH_BOTTOM[key]; }
  var tall = look.tall || 70, greens = look.greens || THK_GREENS, line = hhWander(look.at || 1086, 8, seed), list = [], x, k = 0;
  var blooms = [["marigold", 8, 8], ["jasmine", 14, 5], ["hibiscus", 4, 9, "#e8508a"], ["dokkaew", 10, 6], ["tahern", 6, 7]];
  blooms = blooms.filter(function (bl) { return THK_BLOOMS[bl[0]]; });
  for (x = -30; x < WIDE + 60; k++) {
    var high = tall * (0.6 + 0.7 * dice(seed * 29 + k)), wide = high * (1.5 + dice(seed * 31 + k));
    list.push(k % 2 ? {sprite: sceneryGrass(high, 9, seed * 37 + k, greens), x: x, y: line(x)}
                    : {sprite: sceneryBush(wide, high, seed * 41 + k, greens, [blooms[k % blooms.length]]), x: x, y: line(x) + 10});
    x += wide * (0.5 + 0.3 * dice(seed * 43 + k));
  }
  HH_BOTTOM[key] = list;
  return list;
}
// The White Eel's lane (welLane()) dressed for Hong Hin: its ground textured, the wall's foot planted between the
// houses along a wandering line (owner, 2026-11-13). e.g. pen.drawImage(hhLane("day"), 0, 0);
function hhLane(kind) {
  return welLane(kind, ["hh", function (b) {
    hhGroundTexture(b, 0, 660, WIDE, 1080, "#b9a070", 9, {many: 2.2, weeds: 26});
    hhEdgePlants(b, hhWander(668, 7, 3), 0, WIDE, 9, {tall: 64});   // the houses are drawn after: they stand before it
  }]);
}
// A ghoul's hut (scene 14), detailed and shaded (owner, 2026-11-13: "give the huts and water pots more detail and
// shading"): its shadow on the ground, the kit's fieldHut(), then the thatch in strands, a ragged eave, the shade under
// it on the posts, the floor's slats, the posts' grain, a charm of bones hanging from the eave. (x, base, size) as fieldHut.
function hhGhoulHut(x, base, size) {
  var k, keep = pen;
  pen.save();
  pen.fillStyle = "rgba(10, 8, 4, 0.35)"; pen.beginPath(); pen.ellipse(x + 6 * size, base, 58 * size, 9 * size, 0, 0, 7); pen.fill();
  fieldHut(pen, x, base, size);
  pen.translate(x, base); pen.scale(size, size);
  pen.save();                                       // within the roof: its strands of thatch and its shade
  pen.beginPath(); pen.moveTo(-50, -46); pen.lineTo(-22, -78); pen.lineTo(22, -78); pen.lineTo(50, -46); pen.closePath(); pen.clip();
  for (k = 0; k < 140; k++) {
    var sx = -50 + 100 * dice(k + 901), sy = -78 + 32 * dice(k + 907), lean = sx < -20 ? -0.7 : sx > 20 ? 0.7 : 0;
    pen.strokeStyle = dice(k + 911) < 0.5 ? "rgba(110, 76, 34, 0.55)" : "rgba(246, 222, 160, 0.5)"; pen.lineWidth = 0.7;
    pen.beginPath(); pen.moveTo(sx, sy); pen.lineTo(sx + lean * 6, sy + 7 + 4 * dice(k + 913)); pen.stroke();
  }
  var shade = pen.createLinearGradient(-50, 0, 50, 0);
  shade.addColorStop(0, "rgba(255, 240, 200, 0.18)"); shade.addColorStop(0.5, "rgba(0, 0, 0, 0)"); shade.addColorStop(1, "rgba(40, 24, 8, 0.35)");
  pen.fillStyle = shade; pen.fillRect(-50, -80, 100, 36);
  pen.restore();
  pen.fillStyle = "#c8a462"; pen.strokeStyle = "rgba(90, 60, 25, 0.9)"; pen.lineWidth = 0.8;   // the ragged eave
  pen.beginPath(); pen.moveTo(-51, -47);
  for (k = 0; k <= 20; k++) { pen.lineTo(-51 + k * 5.1, -46 + (k % 2 ? 4 + 3 * dice(k + 921) : 0)); }
  pen.lineTo(51, -47); pen.closePath(); pen.fill(); pen.stroke();
  pen.fillStyle = "rgba(20, 12, 4, 0.4)"; pen.fillRect(-36, -45, 72, 8);   // the shade under the eaves
  pen.strokeStyle = "rgba(60, 40, 20, 0.5)"; pen.lineWidth = 0.6;          // the floor's slats, the posts' grain
  for (k = -34; k < 36; k += 5) { pen.beginPath(); pen.moveTo(k, -24); pen.lineTo(k + 1, -18); pen.stroke(); }
  [[-17, 46], [17, 46], [-30, 52], [30, 52]].forEach(function (p) { pen.beginPath(); pen.moveTo(p[0] - 0.8, -p[1] + 2); pen.lineTo(p[0] - 0.4, -4); pen.stroke(); });
  pen.strokeStyle = "#5a4024"; pen.lineWidth = 0.7;   // a charm of bones on a cord from the eave
  pen.beginPath(); pen.moveTo(30, -44); pen.lineTo(30, -32); pen.stroke();
  pen.fillStyle = "#efe6d2";
  [[30, -31], [28, -27], [32, -25]].forEach(function (b, n) { pen.save(); pen.translate(b[0], b[1]); pen.rotate(0.6 * n - 0.4); pen.fillRect(-3, -0.8, 6, 1.6); pen.beginPath(); pen.arc(-3, 0, 1.1, 0, 7); pen.arc(3, 0, 1.1, 0, 7); pen.fill(); pen.restore(); });
  pen.restore();
  pen = keep;
}
// A hut smashed (owner, 2026-11-13: "make the wrecked huts look rough textured like piles of hay and broken wood"): a
// heap of its thatch in strands, its posts and floor slats broken and thrown across it, splintered ends, straw scattered.
function hhWreckedHut(x, base, size) {
  var k, s = size;
  pen.save();
  pen.fillStyle = "rgba(10, 8, 4, 0.35)"; pen.beginPath(); pen.ellipse(x, base - 4 * s, 62 * s, 10 * s, 0, 0, 7); pen.fill();
  pen.fillStyle = "#6a4c24"; pen.beginPath();       // the heap's dark body
  pen.moveTo(x - 58 * s, base - 4 * s); pen.quadraticCurveTo(x - 40 * s, base - 30 * s, x - 6 * s, base - 34 * s);
  pen.quadraticCurveTo(x + 30 * s, base - 30 * s, x + 56 * s, base - 4 * s); pen.closePath(); pen.fill();
  [[-40, -12, 1.2], [26, -10, -0.9], [-6, -26, 0.3], [40, -6, 2.6]].forEach(function (p) {   // posts, broken, splintered
    pen.save(); pen.translate(x + p[0] * s, base + p[1] * s); pen.rotate(p[2]);
    pen.fillStyle = "#5a3e22"; pen.strokeStyle = "#2a1c0c"; pen.lineWidth = 1;
    pen.beginPath(); pen.moveTo(-24 * s, -2.5 * s); pen.lineTo(18 * s, -2.5 * s); pen.lineTo(22 * s, -1 * s); pen.lineTo(19 * s, 0); pen.lineTo(24 * s, 1.5 * s);
    pen.lineTo(18 * s, 2.5 * s); pen.lineTo(-24 * s, 2.5 * s); pen.closePath(); pen.fill(); pen.stroke();
    pen.restore();
  });
  for (k = 0; k < 340; k++) {                       // the thatch in strands, rough, every way
    var a = dice(k + 931) * Math.PI, r = Math.sqrt(dice(k + 937)), px = x + (dice(k + 941) - 0.5) * 108 * s, top = base - 34 * s * (1 - Math.pow((px - x) / (56 * s), 2));
    var py = base - 2 * s - (base - 2 * s - top) * r * dice(k + 947);
    pen.strokeStyle = ["#e2c27a", "#b48a46", "#c9a96e", "#8a6a3a", "#f0d898"][k % 5]; pen.lineWidth = 0.6 * s + 0.4;
    pen.beginPath(); pen.moveTo(px, py); pen.lineTo(px + Math.cos(a) * 9 * s, py - Math.sin(a) * 4 * s); pen.stroke();
  }
  [[-18, -18, -0.3], [14, -22, 0.4], [-34, -8, 0.15]].forEach(function (p) {   // floor slats thrown across
    pen.save(); pen.translate(x + p[0] * s, base + p[1] * s); pen.rotate(p[2]);
    pen.fillStyle = "#c9a96e"; pen.strokeStyle = "#5a4024"; pen.lineWidth = 0.8; pen.fillRect(-16 * s, -1.4 * s, 32 * s, 2.8 * s); pen.strokeRect(-16 * s, -1.4 * s, 32 * s, 2.8 * s);
    pen.restore();
  });
  for (k = 0; k < 40; k++) {                        // straw scattered about it on the ground
    var gx = x + (dice(k + 951) - 0.5) * 170 * s, gy = base + (dice(k + 953) - 0.3) * 14 * s, ga = (dice(k + 957) - 0.5) * 1.2;
    pen.strokeStyle = k % 2 ? "#e2c27a" : "#b48a46"; pen.lineWidth = 0.6 * s;
    pen.beginPath(); pen.moveTo(gx, gy); pen.lineTo(gx + Math.cos(ga) * 7 * s, gy + Math.sin(ga) * 2 * s); pen.stroke();
  }
  pen.restore();
}
// A water pot of earthenware (s: 1 about 60 tall), its foot at (x, y): its shadow, the body lit from the upper left, an
// incised band of zigzag round its shoulder, a flared rim and its dark mouth, a highlight. e.g. hhWaterPot(640, 930, 1);
function hhWaterPot(x, y, s) {
  pen.save();
  pen.fillStyle = "rgba(10, 8, 4, 0.4)"; pen.beginPath(); pen.ellipse(x + 4 * s, y, 30 * s, 6 * s, 0, 0, 7); pen.fill();
  pen.beginPath(); pen.moveTo(x - 12 * s, y - 52 * s); pen.bezierCurveTo(x - 40 * s, y - 40 * s, x - 34 * s, y - 2 * s, x - 10 * s, y);
  pen.lineTo(x + 10 * s, y); pen.bezierCurveTo(x + 34 * s, y - 2 * s, x + 40 * s, y - 40 * s, x + 12 * s, y - 52 * s); pen.closePath();
  var body = pen.createRadialGradient(x - 12 * s, y - 36 * s, 4 * s, x, y - 26 * s, 40 * s);
  body.addColorStop(0, "#c88a5a"); body.addColorStop(0.55, "#9a5a32"); body.addColorStop(1, "#5a2e16");
  pen.fillStyle = body; pen.fill(); pen.strokeStyle = "#3a1c0a"; pen.lineWidth = 1.4; pen.stroke();
  pen.strokeStyle = "rgba(60, 28, 10, 0.75)"; pen.lineWidth = 1;   // the incised band round the shoulder
  pen.beginPath(); pen.moveTo(x - 27 * s, y - 38 * s); pen.quadraticCurveTo(x, y - 33 * s, x + 27 * s, y - 38 * s); pen.stroke();
  pen.beginPath();
  for (var k = 0; k <= 10; k++) { var zx = x - 26 * s + k * 5.2 * s, zy = y - 35 * s + (k % 2 ? 4 * s : 0) + 2.5 * s * Math.sin(k / 10 * Math.PI); if (k) { pen.lineTo(zx, zy); } else { pen.moveTo(zx, zy); } }
  pen.stroke();
  pen.beginPath(); pen.ellipse(x, y - 53 * s, 15 * s, 4.5 * s, 0, 0, 7); pen.fillStyle = "#b07040"; pen.fill(); pen.strokeStyle = "#3a1c0a"; pen.stroke();   // the rim
  pen.beginPath(); pen.ellipse(x, y - 53 * s, 10 * s, 2.6 * s, 0, 0, 7); pen.fillStyle = "#1e0e06"; pen.fill();                                     // its mouth
  pen.fillStyle = "rgba(255, 230, 200, 0.35)"; pen.beginPath(); pen.ellipse(x - 13 * s, y - 34 * s, 4 * s, 9 * s, 0.4, 0, 7); pen.fill();
  pen.restore();
}
// A pot smashed (owner, 2026-11-13: "Show the smashed bottoms of the pots"): its bottom standing, its broken top edge
// jagged and the dark inside seen, the shards about it (curved, the outside and the inside's colour), the water's stain.
function hhSmashedPot(x, y, s, seed) {
  var k;
  pen.save();
  pen.fillStyle = "rgba(20, 14, 8, 0.45)"; pen.beginPath(); pen.ellipse(x + 10 * s, y + 2 * s, 46 * s, 9 * s, 0, 0, 7); pen.fill();   // the spilled water
  pen.beginPath(); pen.moveTo(x - 26 * s, y - 16 * s);   // the bottom: the pot's lower half, its top edge broken
  for (k = 0; k <= 8; k++) { pen.lineTo(x - 26 * s + k * 6.5 * s, y - 16 * s - (k % 2 ? 8 + 6 * dice(seed + k) : 2 * dice(seed + k + 9)) * s); }
  pen.lineTo(x + 26 * s, y - 16 * s); pen.bezierCurveTo(x + 30 * s, y - 4 * s, x + 18 * s, y, x + 10 * s, y); pen.lineTo(x - 10 * s, y);
  pen.bezierCurveTo(x - 18 * s, y, x - 30 * s, y - 4 * s, x - 26 * s, y - 16 * s); pen.closePath();
  var body = pen.createLinearGradient(x - 28 * s, 0, x + 28 * s, 0); body.addColorStop(0, "#b07040"); body.addColorStop(1, "#5a2e16");
  pen.fillStyle = body; pen.fill(); pen.strokeStyle = "#3a1c0a"; pen.lineWidth = 1.2; pen.stroke();
  pen.fillStyle = "#2a140a"; pen.beginPath(); pen.ellipse(x, y - 17 * s, 21 * s, 4 * s, 0, 0, 7); pen.fill();   // the dark inside
  for (k = 0; k < 6; k++) {                         // the shards
    var sx = x + (dice(seed * 3 + k) - 0.5) * 120 * s, sy = y - 2 * s + dice(seed * 5 + k) * 10 * s, r = (6 + 7 * dice(seed * 7 + k)) * s, a = dice(seed * 11 + k) * 6;
    pen.beginPath(); pen.arc(sx, sy, r, a, a + 1.6); pen.arc(sx, sy, r * 0.6, a + 1.6, a, true); pen.closePath();
    pen.fillStyle = k % 2 ? "#9a5a32" : "#c88a5a"; pen.fill(); pen.strokeStyle = "#3a1c0a"; pen.lineWidth = 0.8; pen.stroke();
  }
  pen.restore();
}
// ---------- the ghouls' place ----------
// Thatched huts in the deep forest (scene 14): dark trees close round, shafts of light, the huts, bones, water pots.
// HH_GHOUL_HUTS: [x, base, size]; HH_GHOUL_POTS: [x, y]. broken: 0 to 1, the huts and pots smashed.
var HH_GHOUL_HUTS = [[360, 900, 3.0], [980, 870, 2.4], [1580, 910, 3.2]];
var HH_GHOUL_POTS = [[640, 930], [700, 940], [1250, 925], [1310, 945]];
var HH_GHOUL_FOREST = null;
function hhGhoulForest() {
  if (HH_GHOUL_FOREST) { return HH_GHOUL_FOREST; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d"), k;
  b.fillStyle = "#24302a"; b.fillRect(0, 0, WIDE, 1080);
  forest(b, -100, WIDE + 100, 520, {tall: 420, seed: 17, far: 0.6});
  forest(b, -100, WIDE + 100, 760, {tall: 560, seed: 19, far: 0.2});
  // the ground's far edge follows the line the jungle is planted on, not a ruled one (owner, 2026-11-13, twice)
  var edge = hhWander(770, 14, 6), x;
  b.fillStyle = "#463c2e"; b.beginPath(); b.moveTo(0, 1080);
  for (x = 0; x <= WIDE; x += 12) { b.lineTo(x, edge(x) - 18); }
  b.lineTo(WIDE, 1080); b.closePath(); b.fill();
  csBand(b, 0, 800, WIDE, 280, "#463c2e", "#3a3024");
  hhGroundTexture(b, 0, 750, WIDE, 1080, "#443a2c", 23, {many: 2, weeds: 30, grass: true});
  var jungle = THK_SHADE.map(function (g) { return blend(g, "#16241a", 0.25); });
  var keep = pen; pen = b;
  try {                                                  // behind the bushes: tall plants of the forest floor, of many kinds
    for (x = -20, k = 0; x < WIDE + 40; k++) {
      var kind = ["kettawa", "tahern", "hom", "phlu", "orchid", "miang"][k % 6];
      thkPlace(k % 3 === 2 ? sceneryGrass(150 + 40 * dice(k + 901), 12, 911 + k, jungle) : sceneryPlant(kind, 0.7 + 0.3 * dice(k + 903)), x, edge(x) - 10, 1, 0);
      x += 90 + 70 * dice(k + 907);
    }
  } finally { pen = keep; }
  hhEdgePlants(b, edge, -40, WIDE + 40, 29, {tall: 120, greens: jungle,
    blooms: [["orchid", 10, 8], ["hibiscus", 6, 11, "#c8302a"], ["jasmine", 14, 6], ["kettawa", 8, 8]]});
  pen = b;
  try {                                                  // and before them, low ferns, herbs and flowers in their own line
    var front = hhWander(812, 10, 9);
    for (x = 10, k = 0; x < WIDE; k++) {
      thkPlace(k % 2 ? sceneryGrass(46 + 20 * dice(k + 921), 9, 931 + k, jungle) : sceneryPlant(["dokkaew", "marigold", "buatong", "sompoi"][k % 4], 0.38), x, front(x), 1, 0);
      x += 110 + 90 * dice(k + 927);
    }
  } finally { pen = keep; }
  HH_GHOUL_FOREST = paper;
  return paper;
}
function hhGhoulPlace(t, broken) {
  hhPlace("ghouls");
  pen.drawImage(hhGhoulForest(), 0, 0);
  pen.fillStyle = "rgba(12, 22, 16, 0.45)"; pen.fillRect(0, 0, WIDE, 1080);   // the shade under the canopy
  pen.save(); pen.globalCompositeOperation = "lighter";  // shafts of light through the canopy
  [[420, 0.12], [1180, 0.1], [1620, 0.08]].forEach(function (s) {
    pen.fillStyle = "rgba(255, 240, 190, " + s[1] + ")";
    pen.beginPath(); pen.moveTo(s[0] - 40, 0); pen.lineTo(s[0] + 40, 0); pen.lineTo(s[0] + 160, 1080); pen.lineTo(s[0] + 20, 1080); pen.closePath(); pen.fill();
  });
  pen.restore();
  HH_GHOUL_HUTS.forEach(function (h, k) {
    if (broken > 0.5 && k !== 1) { hhWreckedHut(h[0], h[1], h[2]); }   // a heap of hay and broken wood (owner, 2026-11-13)
    else { hhGhoulHut(h[0], h[1], h[2]); }
  });
  HH_GHOUL_POTS.forEach(function (p, k) {
    if (broken > 0.5) { hhSmashedPot(p[0], p[1], 1, k * 17 + 3); } else { hhWaterPot(p[0], p[1], 1); }
  });
  pen.fillStyle = "#efe6d2";                             // bones about the huts
  [[520, 960, 0.3], [880, 975, -0.4], [1440, 965, 0.9], [1700, 980, 0.2]].forEach(function (b) {
    pen.save(); pen.translate(b[0], b[1]); pen.rotate(b[2]); pen.beginPath(); pen.rect(-16, -3, 32, 6); pen.arc(-17, -3, 4, 0, 7); pen.arc(-17, 3, 4, 0, 7); pen.arc(17, -3, 4, 0, 7); pen.arc(17, 3, 4, 0, 7); pen.fill(); pen.restore();
  });
}

// ---------- the high pass ----------
// A high mountain pass at dusk (scene 15): a sunset sky, the ranges, mist lying in the valleys below. t: seconds.
function hhPass(t) {
  pen.drawImage(welSky("sunset"), 0, 0);
  scenerySun(t, 1500, 560, 40, {glow: 10, colour: "255, 170, 110"});
  pen.drawImage(hhRangeAt(640, "dusk"), 0, 0);          // the film's own mountains (scenery pass, 2026-11-12)
  mistSea(pen, t, {level: 700, layers: 1, glow: "#f3b27a"});
  pen.drawImage(farRange("#8a6a84", "240, 180, 150", 920, {peak: false, ridges: 1, pines: 10, seed: 39}), 0, 0);
  mistSea(pen, t + 7, {level: 950, layers: 1, glow: "#f0a070"});
}
// A point of the scene as person() gives its joints (through the pen's present transform), for the kit's painters that
// take a joint (ogreMeat). e.g. ogreMeat(hhDevice([900, 1020]), 0.2);
function hhDevice(p) {
  var m = pen.getTransform();
  return [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f];
}

// ---------- the fair ----------
// The high pavilion the king builds at the fair (scene 18): a small palace hall raised on four tall teak posts, a stair
// up to it, banners (tung) on poles. Drawn in two parts as hoKham, so who sits in it is inside: part "back" or "front".
// (x, base): the posts' feet; size: 1 is posts 420 high. Gives back the y of its floor. e.g. var f = hhPavilion(...);
function hhPavilion(x, base, size, part) {
  var s = size, top = base - 420 * s, hall = 0.42 * s;
  if (part !== "front") {
    pen.fillStyle = "#6a3a20"; pen.strokeStyle = "#3a1e10"; pen.lineWidth = 2;
    [-150, -60, 60, 150].forEach(function (dx) { pen.beginPath(); pen.rect(x + dx * s - 10 * s, top, 20 * s, 420 * s); pen.fill(); pen.stroke(); });
    pen.strokeStyle = "#6a3a20"; pen.lineWidth = 8 * s;          // the cross braces
    pen.beginPath(); pen.moveTo(x - 150 * s, base - 60 * s); pen.lineTo(x + 150 * s, top + 60 * s); pen.moveTo(x + 150 * s, base - 60 * s); pen.lineTo(x - 150 * s, top + 60 * s); pen.stroke();
    pen.fillStyle = "#8a5a30"; pen.beginPath(); pen.rect(x - 190 * s, top - 10 * s, 380 * s, 22 * s); pen.fill();   // its floor
    pen.strokeStyle = "#8a5a30"; pen.lineWidth = 6 * s;          // the stair
    pen.beginPath(); pen.moveTo(x + 190 * s, top); pen.lineTo(x + 330 * s, base); pen.moveTo(x + 220 * s, top); pen.lineTo(x + 360 * s, base); pen.stroke();
    for (var k = 1; k < 10; k++) { var u = k / 10; pen.beginPath(); pen.moveTo(x + (190 + 140 * u) * s, top + 420 * s * u); pen.lineTo(x + (220 + 140 * u) * s, top + 420 * s * u); pen.stroke(); }
    hoKham(pen, x, top + 150 * hall, hall, {part: "back", fine: true});
  } else {
    hoKham(pen, x, top + 150 * hall, hall, {part: "front", fine: true, pediment: "peacock"});
  }
  return top;
}
