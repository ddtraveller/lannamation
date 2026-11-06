// sets.js - what the scenes of the film of the White Eel share: the skies, the places and the narration's subtitles.
// Each scene is a file of its own (sNN_*.js) with a page of its own (sNN.html) that plays only that scene, and the
// film's page will load them all; every page loads this after the kit's files and words.js, and before its scenes.
// The scenes draw on the film's 1920 sheet (style.js) on their own clock, from 0. The places follow what is known of
// them (story.py, and the research notes it names): the Nong Lom marsh today, a wide freshwater marsh between Mae Chan
// and Chiang Saen with reeds, lotus and water lilies, low green hills round it, and buffalo herds out on it at morning.
// BEAT (the film's half-second beat, which the kit reads) is set by each page, before this file.

// ---------- the skies ----------
// A sky, painted once: "sunrise" (deep blue overhead through lilac and rose to gold low down, as the Chang Ngu film's),
// "day", "sunset", "night" (with its stars) and "clear" (the night's sky with no stars, for scenery.js
// sceneryStars()). The clouds are not on it: a scene drifts them over it (welClouds()).
var WEL_SKY = {};

// kind: one of them. Gives back the sky's canvas, WIDE by 1080, painted on the first call and kept in WEL_SKY after.
// e.g. pen.drawImage(welSky("sunrise"), 0, 0);
function welSky(kind) {
  if (WEL_SKY[kind]) { return WEL_SKY[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var brush = paper.getContext("2d"), sky = brush.createLinearGradient(0, 0, 0, 1080);
  var stops = {sunrise: [[0, "#2c3672"], [0.16, "#5e5a96"], [0.3, "#c48ca2"], [0.42, "#f4b688"], [0.55, "#fbdba4"], [1, "#f8e6c0"]],
               day: [[0, "#8ccfc6"], [0.6, "#f4ecd2"], [1, "#f1d3bd"]],
               sunset: [[0, "#3e3a74"], [0.14, "#7e5288"], [0.26, "#d4707a"], [0.36, "#f0965a"], [0.46, "#f8be6c"], [1, "#f6d696"]],
               night: [[0, "#070b24"], [0.6, "#1b2350"], [1, "#40336b"]],
               clear: [[0, "#070b24"], [0.6, "#1b2350"], [1, "#40336b"]]}[kind];
  stops.forEach(function (s) { sky.addColorStop(s[0], s[1]); });
  brush.fillStyle = sky;
  brush.fillRect(0, 0, WIDE, 1080);
  if (kind === "night") {
    for (var n = 0; n < 90; n++) {
      brush.fillStyle = "rgba(255, 250, 220, " + (0.4 + 0.6 * dice(n + 70)) + ")";
      brush.beginPath();
      brush.arc(dice(n) * WIDE, dice(n + 90) * 620, 1.5 + dice(n + 20) * 1.5, 0, 7);
      brush.fill();
    }
  }
  WEL_SKY[kind] = paper;
  return paper;
}

// Soft clouds in the light of the hour (scenery.js sceneryClouds()). light: "day", "dawn", "dusk" or "night"; alpha:
// 0 to 1 (a scene going from one light to the next draws both). e.g. welClouds(t, "dawn", 1 - light);
function welClouds(t, light, alpha) {
  sceneryClouds(t, {light: light, count: 5, top: 60, bottom: 330, wide: [300, 560], seed: 17, alpha: alpha === undefined ? 1 : alpha});
}

// ---------- the marsh's hills ----------
// The White Eel's own far hills (a film has mountains of its own: scenery.js farRange()): low, round and green, as the
// hills round Nong Lom are, no peak; farRange()'s sheet made small about its foot (WEL_FAR.scale) and laid side by
// side, every other copy mirrored so no join shows; under them, along the far shore, clumps of bushes, uneven, the
// water showing between some of them (a single forest strip read as a clipped hedge, 2026-11-06). Painted once
// for each foot. light: a key of WEL_FAR_LIGHT laid over the day's (source-atop), or none for the day.
var WEL_FAR = {colour: "#7f9c7c", air: "222, 232, 226", scale: 0.5, veil: 0.3, look: {peak: false, ridges: 2, pines: 3, seed: 71}};
var WEL_FAR_LIGHT = {dawn: "rgba(112, 92, 138, 0.45)", dusk: "rgba(150, 76, 104, 0.45)"};
var WEL_FAR_SHEET = {};

// brush: where to draw; foot: the far shore's y; light: as above. e.g. welFar(pen, WEL_WATER, "dawn");
function welFar(brush, foot, light) {
  var key = foot + " " + (light || "day");
  if (!WEL_FAR_SHEET[key]) {
    var f = WEL_FAR, sheet = farRange(f.colour, f.air, 700, f.look), tile = WIDE * f.scale, top = foot - 700 * f.scale;
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    var b = paper.getContext("2d");
    for (var i = -1; i * tile < WIDE; i++) {
      b.save();
      if (Math.abs(i) % 2) { b.translate((i + 1) * tile, 0); b.scale(-1, 1); } else { b.translate(i * tile, 0); }
      b.drawImage(sheet, 0, top, tile, 1080 * f.scale);
      b.restore();
    }
    b.globalCompositeOperation = "source-atop";          // more air over it: it is far
    b.fillStyle = "rgba(" + f.air + ", " + f.veil + ")";
    b.fillRect(0, 0, WIDE, 1080);
    if (light) { b.fillStyle = WEL_FAR_LIGHT[light]; b.fillRect(0, 0, WIDE, 1080); }
    b.globalCompositeOperation = "source-over";
    var greens = THK_SHADE.map(function (g) { return blend(g, "#6f8a64", 0.4); }), keep = pen, n = 0;
    pen = b;                                              // thkPlace() draws with pen
    for (var x = -60; x < WIDE + 60; n++) {
      if (dice(n * 3 + 7) < 0.16) { x += 60 + 90 * dice(n + 2); continue; }   // a gap, the water reaching the hills' foot
      var wide = 140 + 160 * dice(n * 5 + 1), high = 50 + 90 * Math.pow(dice(n * 7 + 3), 2), size = 0.38 + 0.2 * dice(n + 11);
      thkPlace(natBush(wide, high, 900 + n, n % 3 ? greens : greens.map(function (g) { return blend(g, "#3e5a48", 0.2); }), [], PIX),
               x, foot + 3, size, 0);
      x += wide * size * (0.55 + 0.3 * dice(n * 2 + 5));
    }
    pen = keep;
    if (light) {                                          // the shore's trees in the hour's light too
      b.globalCompositeOperation = "source-atop";
      b.fillStyle = WEL_FAR_LIGHT[light];
      b.fillRect(0, foot - 60, WIDE, 80);
    }
    WEL_FAR_SHEET[key] = paper;
  }
  brush.drawImage(WEL_FAR_SHEET[key], 0, 0);
}

// A thread of smoke from a hut's fire: soft puffs rising from (x, y), widening, leaning with the air and fading.
// look: {rise (pixels: 160), lean (pixels it drifts by the top: 50), wide (a puff's size at the top: 26), alpha (0.4),
// colour ("214, 212, 220"), count (puffs at once: 9)}; t: seconds. Draws with pen. e.g. welSmoke(t, 1560, 560, {});
function welSmoke(t, x, y, look) {
  var rise = look.rise || 160, lean = look.lean === undefined ? 50 : look.lean, wide = look.wide || 26;
  var alpha = look.alpha === undefined ? 0.4 : look.alpha, colour = look.colour || "214, 212, 220", count = look.count || 9;
  pen.save();
  for (var n = 0; n < count; n++) {
    var u = (t / 7 + n / count) % 1, px = x + lean * u * u + 4 * Math.sin(t * 0.7 + n * 1.9) * u, py = y - rise * u;
    var r = 3 + wide * u, a = alpha * Math.min(1, u * 6) * (1 - u);
    var g = pen.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, "rgba(" + colour + ", " + a.toFixed(3) + ")");
    g.addColorStop(1, "rgba(" + colour + ", 0)");
    pen.fillStyle = g;
    pen.beginPath();
    pen.arc(px, py, r, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// ---------- the marsh ----------
// The Nong Lom marsh from its south shore: still water from the far shore (WEL_WATER) to the foot of the picture,
// greener than a river, the far shore and its hills mirrored strongly across the far water and fading toward us
// (scenery.js's water, as the hero film's pond's). Lotus and water lilies stand in it in clumps; reeds grow in beds.
var WEL_WATER = 590;                                   // the far shore's line, where the water meets it
var WEL_MARSH_WATER = null;

// Gives back the marsh as scenery.js takes a water (sceneryWaterDepths(), sceneryWaterSurface()); made once. Its mist
// is left to the scene (it lifts as the sun comes up). e.g. sceneryWaterDepths(welMarshWater());
function welMarshWater() {
  if (WEL_MARSH_WATER) { return WEL_MARSH_WATER; }
  var top = [];
  for (var k = 0; k <= 10; k++) { top.push([-300 + k * (WIDE + 600) / 10, WEL_WATER + (k % 2 ? 1.5 : 0)]); }
  WEL_MARSH_WATER = {edge: [[-300, 1200]].concat(top, [[WIDE + 300, 1200]]), top: top, line: WEL_WATER, left: 0, right: WIDE,
                     foot: 1120, depths: ["#7a968a", "#3c5a4e"], mirror: [[WEL_WATER, 1], [660, 0.85], [760, 0.6], [880, 0.4]],
                     tint: "70, 96, 84", rings: [[420, 700, 1.6], [1320, 760, 4.1], [880, 660, 6.9], [1620, 690, 9.4]], mist: null};
  return WEL_MARSH_WATER;
}

// A herd's beast wading in the marsh: a scene draws it twice, whole before the water's face (so the marsh's own face
// lies over its legs) and then again over the face above its waterline only (welAbove()), and last the rings its legs
// make where they meet the water (welWadeRings()). waterline: the y where the water meets its legs.
// e.g. buffalo(x, y, look); ... sceneryWaterSurface(t, water); ... welAbove(y - 40, function () { buffalo(x, y, look); });
//      welWadeRings(x, y - 40, 150, t);
function welAbove(waterline, draw) {
  pen.save();
  pen.beginPath();
  pen.rect(-WIDE, -1080, 3 * WIDE, waterline + 1080);
  pen.clip();
  draw();
  pen.restore();
}
// x: the beast's middle; waterline: as above; wide: about its length; t: seconds. Draws with pen.
function welWadeRings(x, waterline, wide, t) {
  pen.save();
  pen.strokeStyle = "rgba(236, 244, 236, 0.55)";
  pen.lineWidth = 1.4;
  for (var n = 0; n < 3; n++) {
    var v = (t * 0.5 + n / 3) % 1, r = wide * (0.35 + 0.4 * v);
    pen.globalAlpha = 0.75 * (1 - v);
    pen.beginPath();
    pen.ellipse(x, waterline + 1, r, r * 0.07, 0, 0, 7);
    pen.stroke();
  }
  pen.restore();
}

// ---------- the people ----------
// The looks of the tale's people over the kit's cast (cast()), the film's colours; the owner's picks from the candidate
// sheet of 2026-11-06. A scene draws one with person(x, y, welPerson(kind, WEL_..., {id, face, ...})). The Brahman's
// shoulder cloth is woven (weaving.js's Hat Siao sabai, with its naga): a page that draws him loads sabai.js and
// sabai_finish.js after weaving.js, or the cloth comes out plain.
// The Brahman, who is the naga Phanthu: old, all in white, his white hair in a knot (lady: false keeps a man's face
// under it), a white beard, a staff, and the naga woven in his shoulder cloth (the owner: "A with the naga in his
// sash"). Kind "elder".
var WEL_BRAHMAN = {lady: false, turban: null, bun: "low", hair: "#ece7dd", beard: "#f4f0e6", age: 0.7, bend: 0.05, bare: true,
                   tattoo: false, sabai: ["#f2ead6", "#2f6a5a", "phuanHatSiao", "own"], sarong: "#f2ede2", patoi: false,
                   shirt: "#f4efe2", legs: "#f2ede2", holding: "stick", smile: 0.5, skin: "#d9a87c", size: 0.78};
// The old widow: a cloth tied round her head, a faded indigo blouse, a black wrap over her shoulders, a stick; no gold
// (a palm-leaf ear plug and a strand of seed beads, where a well-off woman wears gold). Kind "grandmother".
var WEL_WIDOW = {turban: "#7a5a6a", shirt: "#4a5a78", sin: 0, bun: "low", earplug: "#b8a060", beads: ["#7a5a3a"], bangles: 0,
                 bend: 0.16, holding: "stick", smile: 0.3, sabai: ["#2a2a30", "#2a2a30", "tuapDam", "own"], size: 0.68};
// The young man: a little too fine for the village, a white shirt and a long jade cloth to the ankle, no tattoo showing,
// head bare. Kind "inta".
var WEL_YOUNG = {shirt: "#f4efe2", sarong: "#2f5a4a", patoi: false, tattoo: false, legs: "#2f5a4a",
                 sabai: ["#f2ead6", "#3f7a6a", "check"], smile: 0.3, north: "soft", size: 0.8};
// The village heads, as the Chang Ngu film's headman: head-cloths and checked shoulder cloths. Each [kind, look].
var WEL_HEADS = [["villager", {turban: "#8a6a58", sabai: ["#9a8a66", "#6a5a44", "check"], sarong: "#4f3e30", age: 0.4, smile: 0.4, size: 0.8}],
                 ["elder", {turban: "#2a4a6a", hair: "#ece7dd", beard: "#f4f0e6", sabai: ["#a8b8c8", "#2a4a6a", "check"], smile: 0.4, size: 0.76}],
                 ["farmer", {turban: "#6a3a2a", age: 0.6, hair: "#a9a39a", smile: 0.4, size: 0.8}]];

// Prince Singhanavati (scenes 2, 3): the kit's noble, bare-chested with the gold of the murals' princes, as the Chang
// Ngu film's King Phang, his descendant, in a blue brocade (pick A; the owner, 2026-11-06: "Do what you think is most
// historically accurate"). Kind "noble".
var WEL_PRINCE = {sarong: ["#24335e", BROCADE], smile: 0.6, size: 0.82};
// The people who walked with him from far away: two soldiers with spears, men, women and a boy. Each [kind, look].
var WEL_FOLK = [["soldier", {size: 0.78}], ["maiden", {size: 0.74}], ["soldier", {turban: "#2a4a6a", size: 0.78}], ["farmer", {size: 0.78}],
                ["weaver", {size: 0.72}], ["villager", {turban: "#c9962a", size: 0.78}], ["boy", {size: 0.5}]];

// King Mahachaichana, the last of Yonok's forty-five kings, seventy (the chronicle): white hair and beard, the lines of
// age, a little bent (scenes 4, 7). Kind "noble".
var WEL_OLD_KING = {sarong: ["#8a2a3a", BROCADE], hair: "#ece7dd", beard: "#f4f0e6", age: 1, bend: 0.1, smile: 0.4};

// A mouth that talks while on is true: t, the scene's second. Gives back person()'s mouth, or undefined.
// e.g. person(x, y, welPerson("elder", WEL_BRAHMAN, {mouth: welTalk(t, t > 16 && t < 22)}));
function welTalk(t, on) { return on ? {open: 0.06 + 0.24 * Math.abs(Math.sin(t * 8)), wide: 0.5, round: 0.15} : undefined; }

// A look of the film's cast: the kit's cast (kind), the film's look (own), the scene's keys (extra). A feeling given by
// the scene takes the place of the cast's own smile and wonder, as changngu/sets.js's cngPerson. Gives back a look for
// person(); changes nothing. e.g. person(900, 880, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: -1}));
function welPerson(kind, own, extra) {
  var look = cast(kind, Object.assign({}, own, extra || {}));
  if (extra && extra.feel !== undefined) {
    if (extra.smile === undefined) { delete look.smile; }
    if (extra.wonder === undefined) { delete look.wonder; }
  }
  return look;
}

// ---------- the Kok river and its plain ----------
// The Kok as it runs past the plain where the city was founded (scenes 2, 3, 6, 9): slow, wide, greener than the
// Mekong, between low banks; the film's hills and a bushy far bank (welFar()) behind it; on the near side a wide plain
// of grass (scenery.js sceneryMeadow()). WEL_KOK: the far bank's line; WEL_KOK_BANK: the near bank's, at its middle.
var WEL_KOK = 600, WEL_KOK_BANK = 712;
var WEL_KOK_WATER = null, WEL_PLAIN = null;

// Gives back the river as scenery.js takes a water (sceneryWaterDepths(), sceneryWaterSurface()); made once.
// e.g. var kok = welKokWater(); sceneryWaterDepths(kok);
function welKokWater() {
  if (WEL_KOK_WATER) { return WEL_KOK_WATER; }
  var top = [], near = [];
  for (var k = 0; k <= 10; k++) { top.push([-300 + k * (WIDE + 600) / 10, WEL_KOK + (k % 2 ? 1.5 : 0)]); }
  for (k = 10; k >= 0; k--) { near.push([-300 + k * (WIDE + 600) / 10, WEL_KOK_BANK + 10 * Math.sin(k * 1.7) + 6 * dice(k + 40)]); }
  WEL_KOK_WATER = {edge: [[-300, WEL_KOK_BANK]].concat(top, near), top: top, line: WEL_KOK, left: 0, right: WIDE,
                   foot: WEL_KOK_BANK + 20, depths: ["#86a294", "#4e6e60"], mirror: [[WEL_KOK, 1], [640, 0.8], [690, 0.55]],
                   tint: "84, 112, 96", rings: [[520, 660, 2.2], [1240, 690, 7.5], [300, 680, 15.0], [1500, 650, 26.0]], mist: null};
  return WEL_KOK_WATER;
}

// The plain on the near side, painted once, WIDE by 1080: grass from the near bank to the foot of the picture, with
// two trees in flower at its sides. Drawn before the water (the water's near edge lies over its top).
function welPlain() {
  if (WEL_PLAIN) { return WEL_PLAIN; }
  var paper = document.createElement("canvas");
  paper.width = WIDE * PIX;
  paper.height = 1080 * PIX;
  var b = paper.getContext("2d");
  b.scale(PIX, PIX);
  sceneryMeadow(b, -40, WIDE + 40, WEL_KOK_BANK - 30, 1080, {seed: 7});
  WEL_PLAIN = paper;
  return paper;
}
// The plain's trees, drawn after the water: a flame of the forest at the left and a golden shower at the right, small
// on the near bank. Painted once. e.g. pen.drawImage(welPlainTrees(), 0, 0, WIDE, 1080);
var WEL_PLAIN_TREES = null;
function welPlainTrees() {
  if (WEL_PLAIN_TREES) { return WEL_PLAIN_TREES; }
  var paper = document.createElement("canvas");
  paper.width = WIDE * PIX;
  paper.height = 1080 * PIX;
  var b = paper.getContext("2d");
  b.scale(PIX, PIX);
  thkTreeOn(b, 140, WEL_KOK_BANK + 40, 0.34, 51, [["thongkwao", 30, 14]]);
  thkTreeOn(b, 1810, WEL_KOK_BANK + 30, 0.3, 57, [["ratchaphruek", 26, 12]]);
  WEL_PLAIN_TREES = paper;
  return paper;
}

// ---------- the widow's house ----------
// Her house at the edge of the city (scenes 5, 7 to 13): the kit's northern house on posts (oldcartoon.js house():
// its veranda, its ladder at the right, its crossed roof ends), old: its wood greyed by the weather, a patch on its roof.
// Painted once as a sprite. At size 1 it is 380 across and 440 tall; its floor is 112 over the ground, the ladder's
// foot at 82 right of its middle, its top at the veranda (WEL_HOUSE_TOP).
var WEL_HOUSE = null, WEL_HOUSE_TOP = 112, WEL_LADDER = 82;

// brush: where to draw; x, base: the middle of its foot; size: as house(). e.g. welWidowHouse(pen, 1250, 840, 1);
function welWidowHouse(brush, x, base, size) {
  if (!WEL_HOUSE) {
    WEL_HOUSE = document.createElement("canvas");
    WEL_HOUSE.width = 440 * PIX;
    WEL_HOUSE.height = 480 * PIX;
    var b = WEL_HOUSE.getContext("2d");
    b.scale(PIX, PIX);
    house(b, 220, 455, 1);
    b.globalCompositeOperation = "source-atop";        // the weather on its wood
    b.fillStyle = "rgba(128, 118, 104, 0.3)";
    b.fillRect(0, 0, 440, 480);
    b.fillStyle = "rgba(60, 50, 40, 0.18)";             // streaks down the boards
    for (var n = 0; n < 14; n++) { b.fillRect(90 + n * 19 + 6 * dice(n + 3), 225, 2 + 2 * dice(n), 90 + 30 * dice(n + 9)); }
    b.fillStyle = "#6e5a48";                            // a patch of other tiles on the roof
    b.beginPath(); b.moveTo(120, 214); b.lineTo(178, 176); b.lineTo(196, 200); b.lineTo(140, 236); b.closePath(); b.fill();
    b.globalCompositeOperation = "source-over";
  }
  brush.drawImage(WEL_HOUSE, x - 220 * size, base - 455 * size, 440 * size, 480 * size);
}

// The yard at the edge of the city, by day, painted once (scenes 5, 7, 8): the far range, Yonok's rampart away to the
// left with roofs over it, grass and flowers, a path of beaten earth across the front, the widow's house on the right
// with bushes in flower round it and a tamarind over it. WEL_YARD: [x, base, size] of her house; WEL_PATH: the path's y.
var WEL_YARD = [1360, 812, 1.6], WEL_PATH = 878, WEL_YARD_SHEET = {};
function welYard(kind) {
  kind = kind || "day";
  if (WEL_YARD_SHEET[kind]) { return WEL_YARD_SHEET[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE * PIX;
  paper.height = 1080 * PIX;
  var b = paper.getContext("2d"), keep = pen;
  b.scale(PIX, PIX);
  cngFar(b, 0, 560, kind === "dusk" ? "dusk" : undefined);
  sceneryMeadow(b, -40, WIDE + 40, 560, 1080, {seed: 11, haze: "#b4cfa0"});
  b.save();                                             // the city's rampart, far off at the left, and roofs over it
  b.beginPath(); b.rect(0, 0, 820, 1080); b.clip();
  cngRampart(b, 560, 640);
  b.restore();
  [[160, 0.34], [420, 0.3], [640, 0.32]].forEach(function (h) { house(b, h[0], 662, h[1]); });
  b.fillStyle = "#c9b285";                              // the path across the front
  b.beginPath(); b.moveTo(-20, WEL_PATH - 30); b.quadraticCurveTo(900, WEL_PATH - 50, WIDE + 20, WEL_PATH - 20);
  b.lineTo(WIDE + 20, WEL_PATH + 40); b.quadraticCurveTo(900, WEL_PATH + 20, -20, WEL_PATH + 46); b.closePath(); b.fill();
  thkTreeOn(b, 1760, WEL_YARD[1] - 20, 0.5, 91, [["mango", 14, 14]]);   // a tree over her house
  pen = b;
  [[930, 826, 140, 80, 401, [["hibiscus", 14, 8]]], [1690, 830, 160, 90, 407, [["jasmine", 10, 8]]], [840, 834, 110, 70, 409, []]].forEach(function (k) {
    thkPlace(natBush(k[2], k[3], k[4], THK_SUN, k[5], PIX), k[0], k[1], 1, 0);
  });
  pen = keep;
  welWidowHouse(b, WEL_YARD[0], WEL_YARD[1], WEL_YARD[2]);
  WEL_YARD_SHEET[kind] = paper;
  return paper;
}

// ---------- the narration ----------
// The words under the picture: t, the scene's second; lines, its WNN_LINES ([from, to, id]). Writes the line being
// said (WHITEEEL_WORDS[id]: its Kam Mueang, then its English). The kit's subtitle() writes one line and does not wrap: a
// Kam Mueang line wider than the picture is cut at the space nearest its middle, and its halves are shown one after
// the other over the line's time, the English under both. e.g. welSubtitles(t, W01_LINES);
function welSubtitles(t, lines) {
  lines.forEach(function (line) {
    if (t < line[0] || t >= line[1]) { return; }
    var words = WHITEEEL_WORDS[line[2]], halves = welHalves(words[1]);
    var big = halves.length < 2 ? words[1] : t < mix(line[0], line[1], halves[0].length / words[1].length) ? halves[0] : halves[1];
    subtitle(big, words[2]);
  });
}
// A Kam Mueang line as it fits under the picture: [the line], or its two halves cut at the space nearest its middle
// when it is wider than 1800 in the subtitle's letters.
function welHalves(text) {
  screen.save();
  screen.font = "bold 58px " + LETTERS_THAI + ", 'Noto Sans Thai', Tahoma, sans-serif";
  var wide = screen.measureText(text).width;
  screen.restore();
  if (wide <= 1800) { return [text]; }
  var best = -1;
  for (var k = 0; k < text.length; k++) {
    if (text[k] === " " && (best < 0 || Math.abs(k - text.length / 2) < Math.abs(best - text.length / 2))) { best = k; }
  }
  return best < 0 ? [text] : [text.slice(0, best), text.slice(best + 1)];
}

// A scene's first seconds out of the dark (the film page's own cuts fade through black). e.g. welFadeIn(t, 2);
function welFadeIn(t, seconds) {
  if (t < seconds) {
    pen.fillStyle = "rgba(0, 0, 0, " + (1 - t / seconds).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
