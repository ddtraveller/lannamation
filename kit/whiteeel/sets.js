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

// The marsh's water with a near shore of grass at shore (its edge's y), its far edge at top (WEL_WATER unless told), as
// scenery.js takes a water (scenes 12, 14). Made once for each. e.g. var lake = welLake(860); sceneryWaterDepths(lake);
var WEL_LAKES = {};
function welLake(shore, top) {
  var far = top || WEL_WATER, key = shore + " " + far;
  if (WEL_LAKES[key]) { return WEL_LAKES[key]; }
  var line = [], near = [];
  for (var k = 0; k <= 10; k++) { line.push([-400 + k * (WIDE + 800) / 10, far + (k % 2 ? 1.5 : 0)]); }
  for (k = 10; k >= 0; k--) { near.push([-400 + k * (WIDE + 800) / 10, shore + 8 * Math.sin(k * 1.9) + 5 * dice(k + 60)]); }
  WEL_LAKES[key] = {edge: [[-400, shore]].concat(line, near), top: line, line: far, left: -200, right: WIDE + 200, foot: shore + 20,
                     depths: ["#7a968a", "#3c5a4e"], mirror: [[far, 1], [far + 70, 0.85], [far + 170, 0.6]], tint: "70, 96, 84", rings: [], mist: null};
  return WEL_LAKES[key];
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
// The people who walked with him from far away: two soldiers with spears, men, two painted women (one with a parasol
// for the road), a farmer with his baskets on a pole and a boy. Each [kind, look] (welPerson()'s kinds). The woman with
// the parasol holds it with her hand at her hair, still as she walks (still: welPerson()).
var WEL_FOLK = [["soldier", {size: 0.78}], [11, {size: 0.74, still: "near"}], ["soldier", {turban: "#2a4a6a", size: 0.78}], ["man:farmer", {size: 0.78}],
                [4, {size: 0.72}], ["villager", {turban: "#c9962a", size: 0.78}], ["child:boy", {size: 0.5}]];

// King Mahachaichana, the last of Yonok's forty-five kings, seventy (the chronicle): white hair and beard, the lines of
// age, a little bent (scenes 4, 7). Kind "noble".
var WEL_OLD_KING = {sarong: ["#8a2a3a", BROCADE], hair: "#ece7dd", beard: "#f4f0e6", age: 1, bend: 0.1, smile: 0.4};

// Whether one of the lines named in ids ("W027", ...) is being said at second t of a scene whose lines are lines
// (its WNN_LINES), so a mouth moves with the voice wherever the lines are retimed to. e.g. welSays(t, W08_LINES, ["W027"])
function welSays(t, lines, ids) { return lines.some(function (l) { return ids.indexOf(l[2]) >= 0 && t > l[0] && t < l[1] - 0.3; }); }

// A mouth that talks while on is true: t, the scene's second. Gives back person()'s mouth, or undefined.
// e.g. person(x, y, welPerson("elder", WEL_BRAHMAN, {mouth: welTalk(t, t > 16 && t < 22)}));
function welTalk(t, on) { return on ? {open: 0.06 + 0.24 * Math.abs(Math.sin(t * 8)), wide: 0.5, round: 0.15} : undefined; }

// A look of the film's cast: the kit's cast (kind), the film's look (own), the scene's keys (extra). A feeling given by
// the scene takes the place of the cast's own smile and wonder, as changngu/sets.js's cngPerson. Gives back a look for
// person(); changes nothing. e.g. person(900, 880, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: -1}));
// kind can also be one of people.js's painted people (the owner, 2026-11-07: the long-necked women out of the film, "use
// those [the new women models] and the other models from the other movies"): a number, a woman of castMix(); "woman:name",
// "man:name", "child:name", one of MURAL_WOMEN, MURAL_MEN or MURAL_CHILDREN. extra.free: true empties a painted
// person's hands (what she holds and the pose for it), for a scene that gives her something to carry (own.free the same).
// e.g. person(x, y, welPerson(17, {size: 0.72}, {id: "lane3", face: 1})); welPerson("child:tufts", {size: 0.42}, {id: "girl"})
function welPerson(kind, own, extra) {
  var more = Object.assign({}, own, extra || {}), painted = typeof kind === "string" ? kind.split(":") : null, look;
  var still = more.still;
  delete more.free; delete more.still;
  if (typeof kind === "number") { look = castMix(kind, more); }
  else if (painted.length === 2) { look = {woman: castWoman, man: castMan, child: castChild}[painted[0]](painted[1], more); }
  else { look = cast(kind, more); }
  if ((extra && extra.free) || (own && own.free)) {
    ["woman", "man", "child"].forEach(function (k) {
      var s = look[k], known = {woman: MURAL_WOMEN, man: MURAL_MEN, child: MURAL_CHILDREN}[k];
      if (s === undefined) { return; }
      if (typeof s === "string") { s = known[s][k]; }
      look[k] = Object.assign({}, s, {holds: undefined, pose: undefined});
    });
  }
  // still: "near" or "far", a painted woman's posed arm that keeps its place while she walks. The kit swings a walking
  // woman's wrists (people.js, muArm: 30 * sin of her step, the far arm half a stride after), and an arm folded up to her
  // hair, swung, flips its elbow from one bend to the other (the owner, 2026-11-10, of the woman with the parasol at 2:58:
  // "Just have her arm stay folded with her hand on her hair so her elbow doesn't flip around"). The swing is taken out
  // of her pose beforehand, so her wrist stays where the pose has it and her elbow keeps the bend it has standing.
  var pose = still && look.woman && typeof look.woman === "object" && look.woman.pose;
  if (pose && pose[still] && typeof more.step === "number") {
    var swing = 30 * Math.sin(more.step * Math.PI * 2 + (still === "near" ? 0 : Math.PI)), arm = pose[still];
    pose = Object.assign({}, pose);
    pose[still] = Object.assign({}, arm, {w: [arm.w[0] - swing, arm.w[1] + Math.abs(swing) * 0.3]});
    look.woman = Object.assign({}, look.woman, {pose: pose});
  }
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

// The same two trees as sprites, each on its own sheet, for drawByZ: by its foot among the people, so someone nearer
// than its foot walks in front of it (the owner, 2026-11-07, of scene 6: "men are walking behind a tree but they should
// be in front of it"). e.g. sprites.push.apply(sprites, welPlainTreeSprites());
var WEL_PLAIN_TREE_AT = [[140, 40, 0.34, 51, [["thongkwao", 30, 14]]], [1810, 30, 0.3, 57, [["ratchaphruek", 26, 12]]]];   // x, foot below the bank, size, seed, flowers
var WEL_PLAIN_TREE_SHEETS = [];
function welPlainTreeSprites() {
  return WEL_PLAIN_TREE_AT.map(function (a, k) {
    if (!WEL_PLAIN_TREE_SHEETS[k]) {
      var paper = document.createElement("canvas");
      paper.width = WIDE * PIX;
      paper.height = 1080 * PIX;
      var b = paper.getContext("2d");
      b.scale(PIX, PIX);
      thkTreeOn(b, a[0], WEL_KOK_BANK + a[1], a[2], a[3], a[4]);
      WEL_PLAIN_TREE_SHEETS[k] = paper;
    }
    return {name: "tree " + k, kind: "person", x: a[0], y: WEL_KOK_BANK + a[1], draw: function () {
      pen.drawImage(WEL_PLAIN_TREE_SHEETS[k], 0, 0, WIDE, 1080);
    }};
  });
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
    b.save();                                          // the big jar under the floor cracked (the owner, 2026-11-10)
    b.beginPath(); b.ellipse(150, 431, 22, 26, 0, 0, 7); b.clip();
    var crack = [[143, 405], [147, 414], [142, 421], [149, 430], [145, 438], [152, 446], [150, 458]];
    [["rgba(255, 196, 150, 0.35)", 1.0, 1], ["rgba(46, 18, 8, 0.9)", 1.4, 0]].forEach(function (ink) {
      b.strokeStyle = ink[0]; b.lineWidth = ink[1]; b.lineJoin = "round";
      b.beginPath(); crack.forEach(function (c, i) { if (i) { b.lineTo(c[0] + ink[2], c[1]); } else { b.moveTo(c[0] + ink[2], c[1]); } });
      b.moveTo(149 + ink[2], 430); b.lineTo(157 + ink[2], 426); b.lineTo(163 + ink[2], 431);   // a branch off it
      b.stroke();
    });
    b.restore();
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
// The old sum kai (pieces.js sumKai()) by her house, right of her ladder, torn at its foot, where her one small black
// hen goes in and out (the owner, 2026-11-10: "it should look old and have a torn part in it from which a small black
// chicken should sometimes come out to peck around for food"): [x, base, size]; WEL_HEN: the hen's size.
var WEL_KAI = [1600, 842, 1.15], WEL_HEN = 0.62;
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
  sumKai(b, WEL_KAI[0], WEL_KAI[1], WEL_KAI[2], {old: true, torn: true});   // her hen's basket, old and torn
  WEL_YARD_SHEET[kind] = paper;
  return paper;
}

// The widow's small black hen (the kit's rooster(), a hen, black) comes out of the tear in her sum kai, pecks about
// by it (roosterPeck()), and goes back in. outs: [[from, to], ...], the seconds she is out (each more than 3 s);
// drawn over the yard, so she is in front of the basket. e.g. welYardHen(t, [[6, 13]]);
function welYardHen(t, outs) {
  outs.forEach(function (o, k) {
    if (t < o[0] || t > o[1]) { return; }
    var tear = sumKaiTear(WEL_KAI[0], WEL_KAI[1], WEL_KAI[2]), u = t - o[0], left = o[1] - t, walk = 1.2, reach = 46;
    var stay = o[1] - o[0] - 2 * walk, home = reach + roosterPeck(stay, {seed: k + 3, hen: true, roam: 40}).x * WEL_HEN;
    var x, look, alpha = 1;
    if (u < walk) {                                   // out through the tear
      var e = u / walk; x = reach * e; look = {face: 1, walk: reach * e / WEL_HEN / 48};
      alpha = Math.min(1, e / 0.2);
    } else if (left < walk) {                         // and back in
      var e2 = left / walk; x = home * e2; look = {face: -1, walk: home * (1 - e2) / WEL_HEN / 48};
      alpha = Math.min(1, e2 / 0.2);
    } else {
      var p = roosterPeck(u - walk, {seed: k + 3, hen: true, roam: 40}); x = reach + p.x * WEL_HEN; look = p.look;
    }
    pen.save();
    pen.globalAlpha *= alpha;
    pen.translate(tear[0] - 8 + x, WEL_KAI[1] + 5); pen.scale(WEL_HEN, WEL_HEN);
    rooster(0, 0, t, Object.assign({}, look, {hen: true, black: true}));
    pen.restore();
  });
}

// The night laid over a set drawn in the day's colours: dark blue, none over the sky (already the night's) down to
// from, full (alpha) from to down. e.g. welNightOver(300, 470, 0.66);
function welNightOver(from, to, alpha) {
  var g = pen.createLinearGradient(0, from, 0, to);
  g.addColorStop(0, "rgba(10, 16, 46, 0)");
  g.addColorStop(1, "rgba(10, 16, 46, " + alpha + ")");
  pen.fillStyle = g;
  pen.fillRect(-WIDE, 0, 3 * WIDE, 1600);
}

// The Kok at night under the moon (scenes 3, 9): the night sky and the moon, the hills, the plain and the river
// darkened, the stars and the moon clear of the dark, the moon's path on the water, fireflies over the plain.
// under: what is drawn in the river under its face (a function), or none. e.g. welKokNight(t);
var WEL_MOON = [1480, 170, 46];
function welKokNight(t, under) {
  pen.drawImage(welSky("night"), 0, 0);
  welFar(pen, WEL_KOK);
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok);
  if (under) { under(); }
  sceneryWaterSurface(t, kok);
  welNightOver(WEL_KOK - 440, WEL_KOK - 220, 0.62);
  sceneryMoon(t, WEL_MOON[0], WEL_MOON[1], WEL_MOON[2], {});
  natGlitter(t, WEL_MOON[0], WEL_KOK, WEL_KOK_BANK, 0.5, "220, 230, 255");
}

// The widow's yard at night (scenes 9, 10): the night sky and the moon, the yard darkened, a lamp's warm light in her
// window if lit. e.g. welYardNight(t, true);
function welYardNight(t, lit) {
  pen.drawImage(welSky("night"), 0, 0);
  sceneryMoon(t, 420, 150, 40, {});
  pen.drawImage(welYard("dusk"), 0, 0, WIDE, 1080);
  welNightOver(130, 340, 0.68);
  sceneryMoon(t, 420, 150, 40, {});
  if (lit) {
    var wx = WEL_YARD[0], wy = WEL_YARD[1] - 172 * WEL_YARD[2], flick = 0.85 + 0.15 * Math.sin(t * 7);
    var g = pen.createRadialGradient(wx, wy, 2, wx, wy, 70);
    g.addColorStop(0, "rgba(255, 200, 120, " + (0.75 * flick).toFixed(3) + ")");
    g.addColorStop(1, "rgba(255, 200, 120, 0)");
    pen.fillStyle = g;
    pen.fillRect(wx - 70, wy - 70, 140, 140);
  }
}

// ---------- a lane of Yonok, its homes each its own ----------
// Chang Ngu's lane (changngu/sets.js cngLane(): the range, the rampart, trees in flower, the lane of beaten earth, its
// grass), but no two homes alike (the owner, 2026-11-07: "make the people in the village and homes look more unique"):
// a teak house with its crossed roof ends (house()), a bamboo house tied together (pieces.js ruenPhuk()), a small house
// with its granary beside it (longKhao()), a bamboo house gone grey with weather, each with flowers of its own at its
// feet. WEL_LANE_HOMES: [x, base, size, kind ("teak" or "bamboo"), [x, y] of its kitchen's smoke, [x, y] of its lamp]
// for scenes that smoke and light them. Scenes 4 and 7.
var WEL_LANE = {};
var WEL_LANE_HOMES = [[250, 880, 0.7, "teak", [222, 670], [187, 775]], [720, 878, 1.0, "bamboo", [690, 660], [800, 770]],
                      [1240, 884, 0.6, "teak", [1216, 704], [1186, 794]], [1740, 874, 0.92, "bamboo", [1712, 666], [1812, 776]]];

// kind: "day" or "dusk" (the bamboo houses' doorways lit). Gives back the lane's canvas, WIDE by 1080, clear above the
// far hills; painted once for each. e.g. pen.drawImage(welLane("dusk"), 0, 0);
function welLane(kind) {
  if (WEL_LANE[kind]) { return WEL_LANE[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), n, keep = pen, dusk = kind === "dusk";
  cngFar(b, 0, 560);
  cngRampart(b, 504, 660);
  var blooms = [["ratchaphruek", 28, 14], ["mango", 20, 14], ["frangipani", 28, 12], ["longan", 24, 14]];
  for (n = 0; n < 7; n++) { thkTreeOn(b, 60 + n * 300 + 50 * dice(n + 60), 680, 0.26 + 0.07 * dice(n + 61), 81 + n, [blooms[n % 4]]); }
  csBand(b, 0, 660, WIDE, 420, "#b9a070", "#9a8058");    // the ground
  pen = b;
  var feet = [["hibiscus", "marigold"], ["dokkaew", "tahern"], ["jasmine", "marigold"], ["tahern", "hibiscus"]];
  WEL_LANE_HOMES.forEach(function (h, k) {
    if (k === 2) { longKhao(b, h[0] + 210, h[1] - 4, 0.42, true); }   // the granary beside the small house
    if (h[3] === "teak") { house(b, h[0], h[1], h[2]); }
    else { ruenPhuk(b, h[0], h[1], h[2], {fine: true, glow: dusk ? 0.6 : 0, tint: k === 3 ? ["#8a8a80", 0.28] : undefined}); }
    [[-0.36, feet[k][0]], [0.38, feet[k][1]]].forEach(function (f) {
      flora(f[1], h[0] + f[0] * 380 * h[2], h[1] + 4, {size: 0.42 * h[2], ground: false});
    });
  });
  pen = keep;
  b.fillStyle = "#c9b285";                               // the lane
  b.beginPath(); b.moveTo(0, CNG_LANE_Y - 40); b.lineTo(WIDE, CNG_LANE_Y - 50); b.lineTo(WIDE, CNG_LANE_Y + 70); b.lineTo(0, CNG_LANE_Y + 80); b.closePath(); b.fill();
  b.fillStyle = "rgba(140, 116, 70, 0.25)";              // its ruts
  [CNG_LANE_Y - 12, CNG_LANE_Y + 30].forEach(function (y) { b.fillRect(0, y, WIDE, 4); });
  pen = b;                                               // grass along its edges
  for (n = 0; n < 16; n++) {
    thkPlace(sceneryGrass(30 + 30 * dice(n), 8, 521 + n), 60 + n * 120 + 40 * dice(n + 3), CNG_LANE_Y - 40 + (n % 2 ? 0 : 124), 1, 0);
  }
  pen = keep;
  WEL_LANE[kind] = paper;
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

// ---------- the life of the place: birds, dragonflies, fish ----------
// The owner, 2026-11-07, of the film: "Go through the scenes and add dragonflies and birds as appropriate", then "Add
// fish as well". By day over the plain and the water: far flocks crossing the sky, egrets flying low over the marsh, a
// kingfisher hanging over the river and dropping on a fish, dragonflies hunting over the grass and the water's edge,
// fish under the water's face; at dusk the flocks and the egrets go home; by night none of them (the fireflies are out).
// Each takes the scene's second t and a list, so a scene says where they are and nothing else.

// Far birds crossing the sky in a loose line (the kit's birds(): six in ink, the first leading): each flock
// [x at 0 s, y, pixels a second]. Drawn after the sky and the far hills, before the near things.
// e.g. welFlocks(t, [[-300, 210, 45], [2100, 160, -30]]);
function welFlocks(t, flocks) {
  flocks.forEach(function (f, n) {
    var x = f[0] + f[2] * t;
    if (x < -400 || x > WIDE + 400) { return; }
    pen.save();
    if (f[2] < 0) { pen.translate(x, 0); pen.scale(-1, 1); pen.translate(-x, 0); }   // flying left, the leader on the left
    birds(t + n * 3.1, x, f[1]);
    pen.restore();
  });
}

// Cattle egrets flying low and slow, white: each [x at 0 s, y, pixels a second, size, seed]. They bob as they beat.
// e.g. welEgretsFlying(t, [[-120, 420, 70, 0.55, 1]]);
function welEgretsFlying(t, list) {
  list.forEach(function (e) {
    var x = e[0] + e[2] * t;
    if (x < -200 || x > WIDE + 200) { return; }
    egret(x, e[1] + 6 * Math.sin(t * 1.4 + e[4]), t, {fly: true, face: e[2] < 0 ? -1 : 1, size: e[3], seed: e[4]});
  });
}

// A kingfisher over the river: it hangs in the air at (x, y) on fast wings, and every so often drops straight down
// to the water and is back with a fish, then hangs again. look: {size, face, seed, every (seconds between dives, 9),
// water (the y of the water's face under it), once (a second: it dives that once, and flies away out of the picture
// with its fish, the way it faces; the owner, 2026-11-10: "the bird that catches a fish should only catch one fish
// then fly away", and only in one scene, scene 2)}. e.g. welKingfisher(t, 1500, 520, {water: 660, face: -1});
function welKingfisher(t, x, y, look) {
  if (look.once !== undefined) {
    var sz = look.size || 0.55, fc = look.face || 1, dp = look.water - y, v = t - look.once;
    if (v < 0) { kingfisher(x, y, t, {hover: true, size: sz, face: fc}); return; }
    if (v < 0.77) { kingfisher(x, y + dp * Math.pow(v / 0.77, 1.6), t, {dive: 1, size: sz, face: fc}); return; }
    if (v < 1.1) { ripples(pen, [[x, look.water, t - (v - 0.77)]], t); return; }
    if (v < 4) { ripples(pen, [[x, look.water, t - (v - 0.77)]], t); }
    var up = Math.min(1, (v - 1.1) / 1.1), away = Math.max(0, v - 1.6);   // up out of the water, then off and away
    var fx = x + fc * 420 * away * away * 0.5 + fc * 260 * away, fy = look.water - dp * up - 40 * away;
    if (fx < -200 || fx > WIDE + 200) { return; }
    kingfisher(fx, fy, t, {fly: true, fish: true, size: sz, face: fc});
    return;
  }
  var every = look.every || 9, at = (t + (look.seed || 0) * 2.3) % every, size = look.size || 0.55, face = look.face || 1;
  var drop = look.water - y;
  if (at < every - 2.2) { kingfisher(x, y, t, {hover: true, size: size, face: face}); return; }
  var u = (at - (every - 2.2)) / 2.2;                // down in 0.5 of it, under for 0.15, up in the rest with the fish
  if (u < 0.35) { kingfisher(x, y + drop * Math.pow(u / 0.35, 1.6), t, {dive: 1, size: size, face: face}); return; }
  if (u < 0.5) { ripples(pen, [[x, look.water, t - (u - 0.35) * 2.2]], t); return; }
  ripples(pen, [[x, look.water, t - (u - 0.35) * 2.2]], t);
  kingfisher(x, look.water - drop * (u - 0.5) / 0.5, t, {fly: true, fish: true, size: size, face: face});
}

// Dragonflies hunting: each [kind of DRAGONFLIES, box [x0, y0, x1, y1] it darts about in, seed, size]. Seen from the
// side (the owner, 2026-11-10: "change the dragonflies so they look like they are being seen from a side view rather
// than a top view. They should be a little smaller, too": the film's sizes 1.8 to 1.2).
// e.g. welDragonflies(t, [["scarlet", [200, 760, 700, 900], 1, 1.2]]);
function welDragonflies(t, list) {
  list.forEach(function (d) {
    var at = dragonflyDart(t, d[1], {seed: d[2]});
    dragonfly(d[0], at.x, at.y, t, {turn: at.turn, size: d[3] || 1.2, seed: d[2], side: true});
  });
}

// Fish under the water's face, swimming slowly across and turning back at the ends of their reach: each
// [kind of NATIVE_FISH, x, y, reach (pixels to each side), size, seed]. Draw them after sceneryWaterDepths() and
// before sceneryWaterSurface(), so the face lies over them. e.g. welFish(t, [["barb", 600, 760, 220, 0.7, 1]]);
function welFish(t, list) {
  list.forEach(function (f) {
    var u = t * 0.07 + f[5] * 0.37, phase = u - Math.floor(u), out = phase < 0.5;   // across one way, then back
    var s = out ? phase * 2 : (1 - phase) * 2, e = s * s * (3 - 2 * s);
    pen.save();
    pen.globalAlpha *= 0.75;
    nativeFish(pen, f[1] + f[3] * (2 * e - 1), f[2] + 5 * Math.sin(t * 0.8 + f[5]), f[4], out ? 1 : -1, f[0], t);
    pen.restore();
  });
}
