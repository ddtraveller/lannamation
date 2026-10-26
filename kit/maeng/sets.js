// sets.js - what the scenes of the film of the creature with four ears and five eyes share: the beat, the
// skies, the places and the narration's subtitles. Each scene is a file of its own (sNN_*.js) with a page of
// its own (sNN.html) that plays only that scene, and the film's page (../maeng.html) loads them all; every
// page loads this after the kit's files and before its scenes. The scenes draw on the film's 1920 sheet (see
// style.js) on their own clock, from 0.
var BEAT = 0.5;

// ---------- the skies ----------
// A sky, painted once: "night" with its stars, "dawn" (deep blue to the colour of the sun not yet up),
// "day", "dusk". The clouds are not on it: a scene drifts them over it (cumulus.js).
var MAENG_SKY = {};

// "sunset" and "sunrise" (owner, 2026-10-26, of scene 10: "yes", to a painted sunset and dawn): the sky of the hour
// the sun is down at the hills, violet overhead going through rose to gold at them, a scene drawing the sun itself
// (scenery.js scenerySun()) and the clouds of the hour over it.
// "clear": the night's sky with no stars painted on it, for the fine ones of scenery.js (the credits).
// maengSky(kind): kind "night", "clear", "dawn", "day", "dusk", "sunset" or "sunrise". Gives back the sky's canvas (WIDE by 1080 pixels of the
// sheet), painted on the first call and kept in MAENG_SKY after.
// e.g. pen.drawImage(maengSky("dawn"), 0, 0);
function maengSky(kind) {
  if (MAENG_SKY[kind]) { return MAENG_SKY[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var brush = paper.getContext("2d"), n, sky = brush.createLinearGradient(0, 0, 0, 1080);
  var stops = {night: [[0, "#070b24"], [0.6, "#1b2350"], [1, "#40336b"]], clear: [[0, "#070b24"], [0.6, "#1b2350"], [1, "#40336b"]],
               dawn: [[0, "#232a5a"], [0.5, "#6a5a8e"], [0.78, "#e3a07f"], [1, "#f6d39c"]],
               day: [[0, "#8ccfc6"], [0.6, "#f4ecd2"], [1, "#f1d3bd"]],
               dusk: [[0, "#f0642a"], [0.5, "#f2a23c"], [1, "#7fb89a"]],
               sunset: [[0, "#463c78"], [0.12, "#8a5488"], [0.24, "#d8707a"], [0.33, "#f29a5a"], [0.42, "#f8c070"], [1, "#f8d898"]],
               sunrise: [[0, "#2a3470"], [0.14, "#5a5c98"], [0.26, "#c08aa4"], [0.38, "#f2b48a"], [0.52, "#fbdca6"], [1, "#fbe8c0"]]}[kind];
  stops.forEach(function (s) { sky.addColorStop(s[0], s[1]); });
  brush.fillStyle = sky;
  brush.fillRect(0, 0, WIDE, 1080);
  if (kind === "night") {
    for (n = 0; n < 90; n++) {
      brush.fillStyle = "rgba(255, 250, 220, " + (0.4 + 0.6 * dice(n + 70)) + ")";
      brush.beginPath();
      brush.arc(dice(n) * WIDE, dice(n + 90) * 640, 1.5 + dice(n + 20) * 1.5, 0, 7);
      brush.fill();
    }
  }
  MAENG_SKY[kind] = paper;
  return paper;
}

// The clouds of each sky, for cumulus().
var MAENG_CLOUDS = {dawn: {count: 6, lit: "#f2c3a6", shade: "#7a6a96", below: false},
                    day: {count: 6, lit: "#fff8ec", shade: "#c9c4d4", below: false},
                    night: {count: 4, lit: "#59608e", shade: "#2a2f55", below: false}};

// ---------- Doi Khao Khwai ----------
// The mountain of the tale: one tall peak clothed in forest, its top at x 1150, with a lower shoulder to the
// left, far ranges behind it; on its right flank, among rocks, the cave (MAENG_CAVE, drawn live by a scene:
// caveMouth() of highlands.js). Scenes 1, 5, 6 and 13.
var MAENG_CAVE = [1300, 600];

// x in pixels of the sheet; gives back the y of the mountain's top edge there (forestSlope() takes it as a ridge).
// e.g. var top = maengPeak(MAENG_CAVE[0]);
function maengPeak(x) {                            // how high Doi Khao Khwai stands at x
  var main = 690 * Math.exp(-Math.pow((x - 1150) / 430, 2)), shoulder = 300 * Math.exp(-Math.pow((x - 560) / 300, 2));
  return 1040 - Math.max(main, shoulder) - 18 * Math.sin(x * 0.013) - 9 * Math.sin(x * 0.031);
}

// base: the y the ridge stands on; tall: how high it rises, in pixels; shape: the phase hills() was given. Gives back
// a function of x (pixels of the sheet) that gives the ridge's y there, read from a table made once.
// e.g. forestSlope(brush, maengRange(700, 360, 1.7), 0, WIDE, 780, {far: 0.8, small: 3, large: 6, haze: "#a9cfc9", seed: 41});
function maengRange(base, tall, shape) {           // the ridge of hills(brush, WIDE, base, tall, shape, colour), at every x
  var tops = [];
  for (var x = 0; x < WIDE; x++) {
    tops.push(base - tall * (0.5 + 0.3 * Math.sin(x * 0.004 + shape) + 0.2 * Math.sin(x * 0.011 + shape * 3)));
  }
  return function (at) { return tops[Math.max(0, Math.min(WIDE - 1, Math.round(at)))]; };
}

var MAENG_MOUNTAIN = null;
// The flowers and fruit of the mountain's near slopes, a little colour in its green (owner, 2026-10-26: "Add some
// flowers/fruits, etc. on the near part of the mountain"): for each band of bushes (hazy top, middle, near foot), three
// mixes of THK_BLOOMS as the forests of the north have them: tiger's claw (phayasuea) and jasmine, the flame of the
// forest, the golden shower, longan in fruit, golden orchids.
var MAENG_DOI_BLOOMS = [[[], [], []],
                        [[["orchid", 3, 5, "#e8c23a"]], [], [["phayasuea", 3, 5, "#ec6c9c"]]],
                        [[["phayasuea", 22, 8, "#f07aa8"], ["jasmine", 18, 6]], [["thongkwao", 24, 9]], [["ratchaphruek", 6, 20], ["longan", 6, 12]]]];

// Doi Khao Khwai on a sheet (brush), painted as the new places are (owner, 2026-10-26, of a still: "I like the
// direction"): its body along its own ridge (maengPeak()) clothed in rows of small bushes as pinewoods.js
// forestHill() clothes a hill, each lower row nearer and larger, hazier toward the top, flowers and fruit near its foot
// (MAENG_DOI_BLOOMS); pines standing out of the canopy along the ridge. Gives back nothing: it paints on brush (pen
// points at it while it paints, and is put back).
// e.g. maengDoi(front.getContext("2d"));
function maengDoi(brush) {
  maengForest(brush, maengPeak, {blooms: MAENG_DOI_BLOOMS, pines: 34});
}

// A slope of the mountain clothed in forest, as scene 1's Doi Khao Khwai is (and scenes 5, 6 and 13's hillside, the
// same mountain near: owner, 2026-10-26, "Can you reuse any of scene 1 stuff for scene 5?"): the shade under the
// canopy, pines standing along the ridge, and row on row of small bushes down from it, each lower row nearer and
// larger, hazier toward the top. brush: a 2D context; ridge: a function of x giving the slope's top y; look: {blooms:
// three bands' mixes as MAENG_DOI_BLOOMS (none when left out), pines (how many: 34), top, foot (the y where the bushes
// are smallest and largest: 360 and 1080), seed}. Gives back nothing: it paints on brush (pen points at it while it
// paints, and is put back). e.g. maengForest(b, maengHillside, {pines: 12, top: 220});
function maengForest(brush, ridge, look) {
  look = look || {};
  var keep = pen, haze = "#a9cfc9", x, r, n, top = look.top === undefined ? 360 : look.top, foot = look.foot || 1080, seed = look.seed || 0;
  var blooms = look.blooms || [[[], [], []], [[], [], []], [[], [], []]];
  pen = brush;
  brush.beginPath();                                 // the shade under the canopy
  brush.moveTo(0, 1080);
  for (x = 0; x <= WIDE; x += 8) { brush.lineTo(x, ridge(x) + 24); }
  brush.lineTo(WIDE, 1080);
  brush.closePath();
  brush.fillStyle = "#1e3a2c";
  brush.fill();
  var pools = [0, 1, 2].map(function (k) {           // three bands of bushes, hazy near the top to deep near the foot
    var greens = THK_SHADE.map(function (g) { return blend(g, haze, [0.45, 0.22, 0.05][k]); });
    return [0, 1, 2].map(function (m) {
      var pal = m === 1 ? greens.map(function (g) { return blend(g, "#7a8a3a", 0.12); }) : m === 2 ? greens.map(function (g) { return blend(g, "#1e3c44", 0.1); }) : greens;
      return natBush(200, 110, 300 + seed + k * 7 + m, pal, blooms[k][m], PIX);
    });
  });
  var pines = [0, 1, 2].map(function (m) { return pineSprite(220, m === 1 ? "old" : "forest", 400 + m, PIX); });
  for (n = 0; n < (look.pines === undefined ? 34 : look.pines); n++) {   // pines along the ridge, their feet in the canopy
    var px = 120 + 1760 * dice(n * 1.7 + 5 + seed), crest = ridge(px);
    if (crest > 1000) { continue; }
    thkPlace(pines[n % 3], px, crest + 34 + 20 * dice(n + 2), 0.45 + 0.35 * dice(n + 9), 0);
  }
  for (r = 0; r < 30; r++) {                         // row on row down from the ridge, each lower one nearer and larger
    for (x = -60 - 120 * dice(r + 1); x < WIDE + 120; ) {
      var y = ridge(x) + 22 + r * 30 + (dice(x * 0.01 + r * 3.1) - 0.3) * 18;
      if (y > 1120) { x += 120; continue; }
      var near = clamp((y - top) / (foot - top)), size = 0.45 + 0.75 * near, band = near < 0.3 ? 0 : near < 0.6 ? 1 : 2;
      thkPlace(pools[band][Math.floor(dice(x * 0.03 + r * 7) * 3)], x, y, size * (0.85 + 0.3 * dice(x * 0.02 + r)), 0);
      x += 200 * size * (0.45 + 0.3 * dice(x * 0.011 + r));
    }
  }
  pen = keep;
}

// One bush of the slope's forest where a scene had a round crown (scenes 5 and 6: the forest's own over and beside
// the cave), painted as the slope's are (maengForest()). x, y: the crown's middle; r: its radius; seed: a number; tint:
// [colour, amount], the light of the hour, or nothing. Gives back nothing: it draws with pen.
// e.g. maengBush(1300, 600, 30, 4, [MAENG_DUSK[0], 0.3]);
var MAENG_BUSHES = {};
function maengBush(x, y, r, seed, tint) {
  var key = seed % 6;
  var b = MAENG_BUSHES[key] || (MAENG_BUSHES[key] = {sprite: natBush(200, 110, 700 + key, key % 2 ? THK_SHADE : THK_GREENS, [], PIX), tints: {}});
  var size = r * 2.4 / 200;
  thkPlace(b.sprite, x, y + r * 0.6, size, 0);
  if (tint && tint[1] > 0) {
    var tinted = b.tints[tint[0]] || (b.tints[tint[0]] = sceneryTinted(b.sprite, tint[0]));
    pen.globalAlpha = Math.min(1, tint[1]);
    thkPlace(tinted, x, y + r * 0.6, size, 0);
    pen.globalAlpha = 1;
  }
}

// The cave on the slope is the same in every scene that comes to it (5, 6 and 13; owner, 2026-10-26: "Make sure to
// reuse what you did in scene 5 with the bush, etc."): the forest's bushes over and beside it (MAENG_CAVE_BEHIND,
// drawn before it) and before its foot (MAENG_CAVE_BEFORE, after it), each [x and y from MAENG_SLOPE_CAVE, radius];
// and the bush that grows up from the slope before the snare's spot, where the boy bends (maengSnareBush()).
var MAENG_CAVE_BEHIND = [[-86, -58, 13], [-64, -82, 14], [-36, -92, 13], [-6, -96, 14], [24, -94, 13], [52, -88, 14], [80, -70, 13], [94, -40, 12]];
var MAENG_CAVE_BEFORE = [[-80, 10, 12], [-52, 14, 13], [74, 12, 12], [96, 4, 11]];
// list: MAENG_CAVE_BEHIND or MAENG_CAVE_BEFORE; size: the cave's size times 1.6; seed: a number; tint: [colour, amount]
// or nothing; shake: pixels they sway by the kit's clock (the near ones while the creature struggles), 0 for still.
// Gives back nothing: it draws with pen. e.g. maengCaveBushes(MAENG_CAVE_BEHIND, MAENG_SLOPE_CAVE[2] * 1.6, 3);
function maengCaveBushes(list, size, seed, tint, shake) {
  list.forEach(function (c, n) {
    maengBush(MAENG_SLOPE_CAVE[0] + c[0] * size + (shake || 0) * Math.sin(clock * 31 + n), MAENG_SLOPE_CAVE[1] + c[1] * size, c[2] * size, seed + n, tint);
  });
}
// The bush before the snare's spot, growing up from the slope below the ledge (owner, 2026-10-26: "Add a small bush so
// it hides the boy's hand when bending down ... but leave enough room to see the snare", "Make the bush extend all the
// way to the ground", "Keep going down with the bush because it's floating"). MAENG_SNARE_BUSH: its x, the y of its
// foot, its radius. tint: [colour, amount] or nothing. Gives back nothing: it draws with pen. e.g. maengSnareBush();
function maengSnareBush(tint) {
  maengBush(MAENG_SNARE_BUSH[0], MAENG_SNARE_BUSH[1] - 0.6 * MAENG_SNARE_BUSH[2], MAENG_SNARE_BUSH[2], 3, tint);
}

// The bushes before the cave's foot on the mountain, so it sits in the forest; with their colour at night (scene 1).
// Painted once. Gives back {day: [...], night: [...]} for sceneryBeds().
function maengCaveBushesBuild() {
  var day = [{sprite: natBush(200, 110, 501, THK_SHADE, [], PIX), x: MAENG_CAVE[0] - 120, y: MAENG_CAVE[1] + 78, size: 0.9},
             {sprite: natBush(200, 110, 502, THK_GREENS, [["phayasuea", 6, 5, "#ec6c9c"]], PIX), x: MAENG_CAVE[0] + 150, y: MAENG_CAVE[1] + 84, size: 0.95}];
  return {day: day, dawn: day.map(function (it) { return Object.assign({}, it, {sprite: sceneryTinted(it.sprite, MAENG_DAWN[0])}); })};
}
// The film's far mountains (scenery.js farRange()): ridge behind ridge, rounded, no limestone peak, few pines; not the
// hero film's (owner, 2026-10-26: "Don't reuse the same background mountain as the hero video").
var MAENG_FAR = {peak: false, ridges: 2, pines: 12, seed: 7};

// The light before the sun is up: a set is painted by day and this laid over it (MAENG_DAWN[1] of it), and
// whatever a scene draws live on the set is blended toward it by as much.
var MAENG_DAWN = ["#28285a", 0.4];

// paper: a canvas; colour: a CSS colour; amount: 0 to 1. Gives back a new canvas of paper's size; paper is not
// changed, and what is clear on it stays clear.
// e.g. var night = maengTinted(yard.front, MAENG_NIGHT[0], MAENG_NIGHT[1]);
function maengTinted(paper, colour, amount) {     // a copy of a sheet, with one colour laid over what is painted on it
  var copy = document.createElement("canvas");
  copy.width = paper.width;
  copy.height = paper.height;
  var brush = copy.getContext("2d");
  brush.drawImage(paper, 0, 0);
  brush.globalCompositeOperation = "source-atop";
  brush.globalAlpha = amount;
  brush.fillStyle = colour;
  brush.fillRect(0, 0, copy.width, copy.height);
  return copy;
}

// The mountain on two clear sheets: "back", the far ranges under the air between them, and "front", Doi
// Khao Khwai; and each again in the light before dawn ("backDawn", "frontDawn").
// Gives back {back, front, backDawn, frontDawn}, canvases WIDE by 1080, painted on the first call and kept in
// MAENG_MOUNTAIN after.
// e.g. var mountain = maengMountain(); pen.drawImage(mountain.frontDawn, 0, 0);
function maengMountain() {
  if (MAENG_MOUNTAIN) { return MAENG_MOUNTAIN; }
  function sheet() {
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    return paper;
  }
  var back = sheet(), front = sheet(), brush = back.getContext("2d"), x;
  var far = ["#a9cfc9", "#8dbfa9", "#79ad84", "#5f9a66"];
  // the far mountains, painted as the hero film's are (scenery.js farRange(); owner, 2026-10-26: "make sure the process
  // of beautification of scenery occurs following the same process as for the hero video") but the film's own, not the
  // hero's ("Don't reuse the same background mountain as the hero video"): ridge behind ridge, no limestone peak
  brush.drawImage(farRange(far[0], "226, 238, 240", 700, MAENG_FAR), 0, 0);
  hills(brush, WIDE, 800, 260, 3.9, far[1]);
  forestSlope(brush, maengRange(800, 260, 3.9), 0, WIDE, 860, {far: 0.5, small: 4, large: 9, haze: far[1], seed: 42});
  var veil = "226, 238, 240", haze = brush.createLinearGradient(0, 560, 0, 880);
  haze.addColorStop(0, "rgba(" + veil + ", 0)");
  haze.addColorStop(0.2, "rgba(" + veil + ", 0.45)");
  haze.addColorStop(1, "rgba(" + veil + ", 0)");
  brush.fillStyle = haze;
  brush.fillRect(0, 560, WIDE, 320);
  maengDoi(front.getContext("2d"));                 // Doi Khao Khwai, painted as the new places are
  // the light before dawn: the night's blue, as deep as in the still the owner approved (2026-10-26, "good")
  MAENG_MOUNTAIN = {back: back, front: front, backDawn: maengTinted(back, MAENG_NIGHT[0], 0.7),
                    frontDawn: maengTinted(front, MAENG_NIGHT[0], 0.5)};
  return MAENG_MOUNTAIN;
}

// ---------- the clouds ----------
// Soft clouds in the light of the hour (scenery.js sceneryClouds(); owner, 2026-10-26: "Refine the clouds so they look
// more natural"), where the film had the kit's cartoon cumulus: "day", "dawn", "dusk" or "night"; t, the scene's clock
// (each scene gave its own start, kept). Gives back nothing: it draws with pen. e.g. maengClouds(t + 40, "day");
function maengClouds(t, light) {
  sceneryClouds(t, {light: light, count: 5, top: 70, bottom: 360, wide: [300, 540], seed: 4});
}

// ---------- the people ----------
// A very poor family: the kit's people in plain cloth, faded. Thukkhata small (scenes 2 and 3) and grown
// (from scene 4); his father and mother.
var MAENG_FATHER = {turban: "#8a6a58", sabai: ["#9a8a66", "#6a5a44", "check"], sarong: "#4f3e30", size: 0.8, smile: 0.6};
var MAENG_MOTHER = {shirt: "#5d6e82", size: 0.78, smile: 0.6, earplug: "#b8a060"};
var MAENG_BOY = {turban: "#9a6a58", sabai: ["#a2946e", "#6a5a44", "check"], sarong: "#4f3e30", size: 0.42};
var MAENG_LAD = Object.assign({}, MAENG_BOY, {size: 0.58});   // Thukkhata older, from scene 3
// The city (from scene 9): King Phanthumati, older, with a moustache, in a ruler's head-cloth of silk wound over his
// head, gold along its turns; Princess Sima in a sin of the paintings with a gold shoulder cloth, her hair in the high
// e-pun knot with gold pins and a gold flower. As Lanna dressed its rulers and princesses (the kit's research,
// 2026-10-20: the spired chada was the Siamese court's, and a crown of silver flowers is a costume of today; owner:
// "Historical Lanna", "K1 silk head-cloth", "P2 the e-pun knot"). The princes who come to marry her, each in his own
// colours.
var MAENG_KING = {turban: null, wrap: "#6a2a5a", sarong: ["#5a2a6a", BROCADE], size: 0.82, age: 0.45, beard: "#2a2220", smile: 0.6};
var MAENG_SIMA = {skirt: false, sin: 0, sabai: ["#e0b23a", "#8a2a3a"], bun: "ipun", pins: true, flower: "#f2cf5a", dance: false,
                  bangles: 5, earplug: "#e0b23a", size: 0.78, smile: 0.8};
var MAENG_PRINCES = [{turban: "#2a5a8a", sarong: ["#2a5a8a", BROCADE], size: 0.78},
                     {turban: "#3a7a4a", sarong: ["#3a7a4a", BROCADE], size: 0.8},
                     {turban: "#c8452f", sarong: ["#6a3a7a", BROCADE], size: 0.76}];
// Thukkhata grown, in a noble's dress of his own colours (the film's lad, now a man); as king, a ruler's head-cloth
// (scene 12, and the credits' cast).
var MAENG_GROOM = {turban: "#e8d8a0", sarong: ["#2a6a5a", BROCADE], size: 0.8, smile: 0.7};
var MAENG_KING_THUKKHATA = Object.assign({}, MAENG_GROOM, {turban: null, wrap: "#8a2a3a", size: 0.82});   // the new king, in a ruler's head-cloth

// A look of the film's cast: the kit's cast (kind), the film's colours, the scene's own. A feeling given by the
// scene takes the place of the cast's own smile and wonder (the kit's boy smiles, and a smile given in the look
// outweighs the feeling's own: a sad boy smiled), unless the scene gives those too.
// kind: a name of the kit's cast ("fellow", "weaver", "boy", ...); own: the film's look (MAENG_BOY, MAENG_KING, ...);
// extra: the scene's keys (id, face, feel, step, ...), or left out. Gives back a look for person(); changes nothing.
// e.g. person(800, maengWay(800) + 12, maengPerson("boy", MAENG_LAD, {id: "lad", face: 1, feel: "happy"}));
function maengPerson(kind, own, extra) {
  var look = cast(kind, Object.assign({}, own, extra || {}));
  if (extra && extra.feel !== undefined) {
    if (extra.smile === undefined) { delete look.smile; }
    if (extra.wonder === undefined) { delete look.wonder; }
  }
  return look;
}

// Where a person's joints are, in the scene, without drawing them where they are seen: the kit's way
// (sabai.js reads a figure so), on a scratch sheet with no camera, under an id of its own so that what hangs
// and swings on the one seen is not moved twice. For a thing a scene puts on a person: a bundle on a shoulder.
var MAENG_SCRATCH = null;

// x, y and look as person() takes them. Gives back the joints person() would (in the film's own pixels), drawn on a
// scratch sheet (MAENG_SCRATCH, made on the first call); nothing is seen, and pen is given back as it was.
// e.g. var shoulder = maengMeasure(go.x, S03_GROUND, go.look).shoulderB;
function maengMeasure(x, y, look) {
  if (!MAENG_SCRATCH) {
    MAENG_SCRATCH = document.createElement("canvas");
    MAENG_SCRATCH.width = WIDE;
    MAENG_SCRATCH.height = 1080;
  }
  var keep = pen, joints;
  pen = MAENG_SCRATCH.getContext("2d");
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.clearRect(0, 0, WIDE, 1080);
  joints = person(x, y, Object.assign({}, look, {id: (look.id || "someone") + "/measure"}));
  pen = keep;
  return joints;
}

// ---------- the light at night ----------
var MAENG_NIGHT = ["#14183a", 0.55];

// ---------- the yard ----------
// Thukkhata's yard north of the city: far ranges in forest, and low on the horizon at the right the city of
// Phanthumati, a brick wall and roofs behind it; rice fields across the middle; the yard of beaten earth at the
// front, a path from the hut (MAENG_HUT, drawn live: its lamp changes) out to the right, toward the city; a
// banana and a clump of bamboo by the hut. Scenes 2, 3, 4, 7, 8, 10 and 11. Two sheets, "back" and "front", and
// each again at night (backNight, frontNight).
var MAENG_HUT = [470, 905, 2.6];
var MAENG_YARD = null;

// x in pixels of the sheet; gives back the y there. e.g. person(go.x, maengWay(go.x) + 12, go.look);
function maengWay(x) {                             // where the path's middle is at x: from the hut's foot out to the right edge
  return 958 - 18 * between(x, 600, WIDE) - 10 * Math.sin(x * 0.006);
}

// Gives back {back, front, backNight, frontNight}, canvases WIDE by 1080, painted on the first call and kept in
// MAENG_YARD after (the rice fields by maengFields() on back). Most scenes draw it by maengYardAt().
// e.g. var yard = maengYard(); pen.drawImage(yard.front, 0, 0);
function maengYard() {
  if (MAENG_YARD) { return MAENG_YARD; }
  function sheet() {
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    return paper;
  }
  var back = sheet(), front = sheet(), brush = back.getContext("2d"), x, n;
  brush.drawImage(farRange("#a9cfc9", "226, 238, 240", 720, MAENG_FAR), 0, 0);   // the far mountains (scenery.js)
  hills(brush, WIDE, 790, 200, 0.8, "#8dbfa9");
  forestSlope(brush, maengRange(790, 200, 0.8), 0, WIDE, 830, {far: 0.55, small: 4, large: 8, haze: "#8dbfa9", seed: 52});
  brush.fillStyle = "#b07a58";                      // the city on the horizon: roofs behind its wall, the wall, a gate
  for (n = 0; n < 9; n++) {
    var rx = 1330 + n * 64 + 14 * Math.sin(n * 2.3), rw = 36 + 10 * dice(n + 3), rh = 22 + 16 * dice(n + 9);
    brush.fillStyle = blend("#7a4f3a", "#a9cfc9", 0.35);
    brush.beginPath();
    brush.moveTo(rx - rw / 2, 802);
    brush.lineTo(rx, 802 - rh);
    brush.lineTo(rx + rw / 2, 802);
    brush.fill();
  }
  brush.fillStyle = blend("#a8603e", "#a9cfc9", 0.3);
  brush.fillRect(1290, 798, 600, 16);
  for (x = 1290; x < 1890; x += 16) { brush.fillRect(x, 792, 9, 7); }
  brush.fillRect(1560, 780, 40, 34);
  brush.fillStyle = blend("#3a2a22", "#a9cfc9", 0.3);
  brush.fillRect(1572, 796, 16, 18);
  maengFields(brush);                               // the rice fields: plots, bunds, water, rice (below)
  var air = brush.createLinearGradient(0, 640, 0, 840);   // the air between, so the far things sit far
  air.addColorStop(0, "rgba(226, 238, 240, 0)");
  air.addColorStop(0.4, "rgba(226, 238, 240, 0.35)");
  air.addColorStop(1, "rgba(226, 238, 240, 0)");
  brush.fillStyle = air;
  brush.fillRect(0, 640, WIDE, 200);
  brush = front.getContext("2d");
  var yard = brush.createLinearGradient(0, 900, 0, 1080);   // the yard of beaten earth
  yard.addColorStop(0, "#c9a878");
  yard.addColorStop(1, "#b48f62");
  brush.fillStyle = yard;
  brush.beginPath();
  brush.moveTo(0, 1080);
  brush.lineTo(0, 930);
  brush.quadraticCurveTo(500, 880, 900, 915);
  brush.quadraticCurveTo(1400, 950, WIDE, 930);
  brush.lineTo(WIDE, 1080);
  brush.closePath();
  brush.fill();
  brush.strokeStyle = "rgba(150, 115, 70, 0.6)";    // the path, worn paler, out to the right
  brush.lineWidth = 34;
  brush.lineCap = "round";
  brush.beginPath();
  for (x = 600; x <= WIDE + 20; x += 20) { brush.lineTo(x, maengWay(x) + 8); }
  brush.stroke();
  brush.strokeStyle = "rgba(226, 204, 160, 0.55)";
  brush.lineWidth = 22;
  brush.stroke();
  var keep = pen;                                   // the banana and the bamboo are drawn on "pen"
  pen = brush;
  // The bamboo behind the hut, its foot behind the hut's posts and small enough that its leaves show under the
  // floor; a second clump beside it, at the hut's corner. Owner, 2026-10-23: "The bamboo behind the house appears in
  // front of some items it should be behind ... Move it up without moving horizontally and shrink it so the leaves
  // can still be seen. Think about adding another one beside it." (It stood at 925, 1.1: its foot in front of the
  // posts at 905, so the hut and its firewood, drawn after, cut into a bamboo nearer than they are.)
  bamboo(brush, 250, 893, 0.7, 7);
  bamboo(brush, 105, 899, 0.62, 4);
  // The banana by the house, right of the ladder's foot and behind it, before the pen (owner, 2026-10-23: "Move the
  // banana tree out of the rice field ... put it to the right and above the base of the ladder so it looks like its
  // near to the house"; it stood at 1200, 850, among the plots). A patch of the yard's earth under its foot.
  brush.fillStyle = "#c4a272";
  brush.beginPath();
  brush.ellipse(916, 899, 34, 7, 0, 0, 7);
  brush.fill();
  banana(brush, 916, 898);
  // Wild bushes in flower along the back of the yard where it meets the fields, clear of the hut, the path, the pen and
  // the garden (docs/kit/places.md, "Painting the scenery", 4; owner, 2026-10-26: "continue with planned upgrades"): a
  // poor family's yard, so the flowers of the hedgerow, tiger's claw, jasmine, the white dok kaew, not a garden's.
  // (the two further right, on their banks out over the fields, taken away: owner, 2026-10-26, "Get rid of the 2
  // hedgerows on mounds")
  [[700, 900, 220, 80, 601, [["phayasuea", 14, 7, "#ec6c9c"], ["jasmine", 12, 6]]]].forEach(function (b) {
    // each on a low bank of earth with grass on its top, as a hedgerow grows on a bund (owner, 2026-10-26: "Put the
    // hedgerows on the ground instead of floating")
    var half = b[2] * 0.56, bank = brush.createLinearGradient(0, b[1] - 8, 0, b[1] + 16);
    bank.addColorStop(0, "#8a9a52");
    bank.addColorStop(0.3, "#a08058");
    bank.addColorStop(1, "#8a6c48");
    brush.fillStyle = "rgba(60, 44, 28, 0.25)";    // its shadow on the ground
    brush.beginPath();
    brush.ellipse(b[0] + 10, b[1] + 15, half * 1.05, 7, 0, 0, 7);
    brush.fill();
    brush.fillStyle = bank;
    brush.beginPath();
    brush.moveTo(b[0] - half, b[1] + 14);
    brush.quadraticCurveTo(b[0] - half * 0.85, b[1] - 8, b[0], b[1] - 8);
    brush.quadraticCurveTo(b[0] + half * 0.85, b[1] - 8, b[0] + half, b[1] + 14);
    brush.closePath();
    brush.fill();
    thkPlace(sceneryBush(b[2], b[3], b[4], THK_GREENS, b[5]), b[0], b[1], 1, 0);
  });
  pen = keep;
  MAENG_YARD = {back: back, front: front, backNight: maengTinted(back, MAENG_NIGHT[0], MAENG_NIGHT[1] + 0.1),
                frontNight: maengTinted(front, MAENG_NIGHT[0], MAENG_NIGHT[1])};
  return MAENG_YARD;
}

// The yard of second t, by day or at night (night 0 to 1): the sky, its clouds, the sets, and the hut with its
// lamp (glow).
// The yard's things, a very poor family's, few (the household notebook, 2026-10-19: what a Tai Yuan yard has):
// a wooden mortar under the hut, an open basket at the ladder's foot, and a ta laew on its post where the path
// leaves the yard, against bad fortune. Drawn with the hut, in its light.
var MAENG_YARD_THINGS = [
  {name: "mortar", kind: "mortar", x: 300, base: 905, size: 0.55},
  {name: "basket", kind: "krabung", x: 705, base: 912, size: 0.5},
  {name: "ta laew", kind: "taLaew", x: 1060, base: 918, size: 0.7}   // beside the path, behind it: people walk before it
];
// The hut's things, inside (scene 4): the hearth in the corner by the door, its pot and the huad on it, cold at
// night; the one basket that keeps the rice, by the post at his pillow's end; an open basket by the hearth.
var MAENG_HUT_THINGS = [
  {name: "hearth", kind: "huad", x: 1700, base: 748, size: 1.0},
  {name: "basket", kind: "krabung", x: 1590, base: 752, size: 0.8},
  {name: "rice basket", kind: "kongKhao", x: 180, base: 770, size: 0.95}
];

// t: the scene's second (the clouds drift by it, the fields' life moves by it); night: 0 by day to 1 at night;
// glow: the hut's lamp, 0 (out) to 1, 0 when left out; behind: a function of no arguments, or left out; fliers: a
// function of no arguments drawn over the fields before their water, so the water mirrors what it draws (birds
// flying over), or left out; heavens: a function of no arguments drawn in the sky after its stars and its clouds
// (a sun under the soft clouds was greyed by them) and before the hills, so what it draws sets behind them (scene
// 8's sun and moon), or left out; sky: the sky under the night, a kind of maengSky() ("day" when left out; "sunset"
// for a dusk's afterglow, its clouds lit as a dusk's: scene 14); away: 0 to 1,
// how far the folk of the fields have gone home, when the scene says (left out: by the night, as below). Gives back
// nothing: it draws with pen, the whole picture behind the people (life in the fields only while night < 0.5).
// e.g. maengYardAt(t, 1, 0.9, function () { s02Mist(t); });
function maengYardAt(t, night, glow, behind, away, fliers, heavens, sky) {   // behind: drawn after the far sheet, before the yard and the hut (mist over the fields)
  var yard = maengYard();
  pen.drawImage(maengSky(sky || "day"), 0, 0);
  if (night > 0) {
    pen.globalAlpha = night;
    pen.drawImage(maengSky("night"), 0, 0);
    pen.globalAlpha = 1;
    // the night's stars and the moon over the yard, as scenes 1 and 4 have them (scenery.js; owner, 2026-10-26: "yes",
    // to the stars and the moon wherever the yard is seen at night)
    sceneryStars(t, {band: null, horizon: 760, count: 1600, bright: 30, alpha: night});
    sceneryMoon(t, 1560, 150, 40, {alpha: night});
  }
  maengClouds(t + 10, night > 0.5 ? "night" : sky === "sunset" ? "dusk" : "day");
  if (heavens) { heavens(); }
  pen.drawImage(yard.back, 0, 0);
  if (night > 0) { pen.globalAlpha = night; pen.drawImage(yard.backNight, 0, 0); pen.globalAlpha = 1; }
  if (fliers) { fliers(); }                         // what flies over the fields, before the water that mirrors it
  maengFieldWater(t);                              // the flooded plots, mirroring the hills, the sky and the fliers
  var home = away !== undefined ? clamp(away) : clamp((night - 0.4) / 0.2);   // the farmers, the buffalo and the egrets: they fade out
  if (home < 1) {                                  // through dusk and back in at dawn, where they were there or not at half
    pen.save();                                    // dark and blinked on and off as scene 8's days went by (the blink check,
    pen.globalAlpha *= 1 - home;                   // 2026-10-22); a day (0), a night (1) and a dusk short of 0.4 draw as before
    maengFieldLife(t);
    pen.restore();
  }
  if (behind) { behind(); }
  pen.drawImage(yard.front, 0, 0);
  if (night > 0) { pen.globalAlpha = night; pen.drawImage(yard.frontNight, 0, 0); pen.globalAlpha = 1; }
  ruenPhuk(pen, MAENG_HUT[0], MAENG_HUT[1], MAENG_HUT[2] * 0.92, {fine: true, ladder: "in", glow: glow || 0, tint: night > 0 ? [MAENG_NIGHT[0], MAENG_NIGHT[1] * night] : null});
  dress(t, MAENG_YARD_THINGS, "back", night > 0 ? [MAENG_NIGHT[0], MAENG_NIGHT[1] * night] : null);
}

// ---------- the meadow ----------
// Where Thukkhata grazes the headman's buffalo and gathers firewood: the yard's far hills and city behind,
// a meadow of long grass, a great tree at the right whose fallen wood lies under it (MAENG_TREE), and far off
// at the left the headman's house, a fine teak house as a headman's is. Scene 3.
var MAENG_TREE = [1560, 905];
var MAENG_MEADOW = null;

// Gives back {front}, a canvas WIDE by 1080 (clear above the grass: a scene draws the yard's sky and far sheet
// first), painted on the first call and kept in MAENG_MEADOW after.
// e.g. pen.drawImage(maengMeadow().front, 0, 0);
function maengMeadow() {
  if (MAENG_MEADOW) { return MAENG_MEADOW; }
  var front = document.createElement("canvas");
  front.width = WIDE;
  front.height = 1080;
  var brush = front.getContext("2d"), n;
  var grass = brush.createLinearGradient(0, 840, 0, 1080);
  grass.addColorStop(0, "#9cc66a");
  grass.addColorStop(1, "#6f9e48");
  brush.fillStyle = grass;
  brush.beginPath();
  brush.moveTo(0, 1080);
  brush.lineTo(0, 870);
  brush.quadraticCurveTo(700, 830, 1300, 860);
  brush.quadraticCurveTo(1650, 878, WIDE, 850);
  brush.lineTo(WIDE, 1080);
  brush.closePath();
  brush.fill();
  house(brush, 250, 872, 0.42);                     // the headman's house, far off
  var keep = pen;
  pen = brush;
  // The meadow's grass as the kit paints it now (pinewoods.js grassBank(), in clumps, larger toward us) and small
  // flowers in it, the field flowers of the north (owner, 2026-10-26: "add some little flower, see if there is better
  // grass in the kit"), the nearer drawn after the further.
  var grass = [0, 1, 2].map(function (k) { return sceneryGrassBank(120 + 40 * dice(k + 61), 71 + k * 5); }), lawn = [];
  var little = ["dokkaew", "jasmine", "buatong", "phayasuea", "marigold"];
  for (n = 0; n < 70; n++) {
    var gy = 872 + dice(n * 3 + 2) * 205, near = (gy - 860) / 220;
    lawn.push({y: gy, draw: function (x, y, d) { return function () { thkPlace(grass[Math.floor(d * 3)], x, y, 0.1 + 0.26 * ((y - 860) / 220), 0); }; }(dice(n * 3 + 1) * WIDE, gy, dice(n * 3 + 3))});
  }
  for (n = 0; n < 46; n++) {
    var fy = 878 + dice(n * 5 + 7) * 195;
    lawn.push({y: fy + 0.5, draw: function (x, y, name) { return function () {
      flora(name, x, y, {size: 0.16 + 0.16 * ((y - 860) / 220), ground: false});
    }; }(dice(n * 5 + 6) * WIDE, fy, little[n % little.length])});
  }
  lawn.sort(function (a, b) { return a.y - b.y; }).forEach(function (one) { one.draw(); });
  thkTreeOn(brush, MAENG_TREE[0], MAENG_TREE[1], 1.2, 31, []);   // the great tree, painted as the hero film's trees are
  // a limb out of its trunk's left side, for the magpie to sit on (S03_LIFE's course stands it at 1520, 588; owner,
  // 2026-10-26: "make a branch for the bird to sit on"), and a few leaves at its tip
  var limb = brush.createLinearGradient(0, 580, 0, 650);
  limb.addColorStop(0, "#8a765e");
  limb.addColorStop(1, "#4f4033");
  brush.fillStyle = limb;
  brush.beginPath();
  brush.moveTo(MAENG_TREE[0] - 6, 668);
  brush.quadraticCurveTo(1530, 640, 1482, 598);
  brush.quadraticCurveTo(1458, 584, 1430, 586);
  brush.quadraticCurveTo(1456, 594, 1478, 606);
  brush.quadraticCurveTo(1524, 632, MAENG_TREE[0] - 6, 642);
  brush.closePath();
  brush.fill();
  brush.strokeStyle = "rgba(50, 38, 28, 0.6)";
  brush.lineWidth = 1.4;
  brush.stroke();
  thkPlace(natBush(80, 40, 621, THK_GREENS, [], PIX), 1428, 594, 1, 0);
  // wild bushes in flower at the meadow's far edge, behind the buffalo and the boy (docs/kit/places.md, "Painting the
  // scenery", 4): the golden bua tong of the cool season's hills, tiger's claw
  [[900, 866, 260, 90, 611, [["buatong", 16, 9]]], [1220, 870, 220, 80, 612, [["phayasuea", 12, 7, "#ec6c9c"]]]].forEach(function (b) {
    thkPlace(sceneryBush(b[2], b[3], b[4], THK_GREENS, b[5]), b[0], b[1], 1, 0);
  });
  pen = keep;
  MAENG_MEADOW = {front: front};
  return MAENG_MEADOW;
}

// ---------- the slope of Doi Khao Khwai, close ----------
// The mountain's side near: the hillside rising from the lower left to the upper right under its forest, far
// ranges beyond; a worn path climbing it to the cave (MAENG_SLOPE_CAVE, drawn live) and its ledge; before it all,
// a rock and bushes at the lower left that the path passes behind. Scenes 5 (at dusk) and 6 (by day). Three
// sheets, "back" (sky to the hillside), "front" (the path) and "fore" (drawn after the people), and each at dusk.
var MAENG_SLOPE_CAVE = [1380, 660, 1.15];
var MAENG_SNARE_BUSH = [MAENG_SLOPE_CAVE[0] - 90, MAENG_SLOPE_CAVE[1] + 42, 52];   // the bush at the snare's spot (maengSnareBush())
var MAENG_DUSK = ["#5a2a46", 0.34];
var MAENG_SLOPE = null;

// x in pixels of the sheet; gives back the y there. e.g. var top = maengHillside(900);
function maengHillside(x) {                        // the top edge of the hillside, rising to the right
  return 600 - 380 * (x / WIDE) - 26 * Math.sin(x * 0.006);
}

// x in pixels of the sheet (40 to the ledge); gives back the y there. e.g. person(x, maengTrail(x), go.look);
function maengTrail(x) {                           // where the path is at x: up from the lower left to the cave's ledge
  var u = between(x, 40, MAENG_SLOPE_CAVE[0] - 60);
  return mix(1010, MAENG_SLOPE_CAVE[1] + 4, u * u * (3 - 2 * u)) + 22 * Math.sin(u * Math.PI * 3) * (1 - u);
}

// Gives back {back, front, fore, backDusk, frontDusk, foreDusk}, canvases WIDE by 1080, painted on the first call and
// kept in MAENG_SLOPE after.
// e.g. var slope = maengSlope(); pen.drawImage(slope.backDusk, 0, 0);
function maengSlope() {
  if (MAENG_SLOPE) { return MAENG_SLOPE; }
  function sheet() {
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    return paper;
  }
  var back = sheet(), front = sheet(), fore = sheet(), b = back.getContext("2d"), x, n;
  b.drawImage(farRange("#a9cfc9", "226, 238, 240", 640, MAENG_FAR), 0, 0);   // the far mountains (scenery.js)
  maengForest(b, maengHillside, {pines: 10, top: 200, seed: 40});   // the hillside, clothed as scene 1's mountain
  b = front.getContext("2d");
  // The path: a band of worn earth up the slope, narrowing as it climbs away, and running in under the cave's
  // ledge (no end of it shows); its edges soft, a few stones on it.
  var edge = [[], []], last = MAENG_SLOPE_CAVE[0] - 20;
  for (x = -40; x <= last; x += 10) {
    var half = mix(34, 13, between(x, -40, last));
    edge[0].push([x, maengTrail(x) + 6 - half]);
    edge[1].push([x, maengTrail(x) + 6 + half]);
  }
  b.beginPath();
  edge[0].forEach(function (p, k) { if (k) { b.lineTo(p[0], p[1]); } else { b.moveTo(p[0], p[1]); } });
  for (n = edge[1].length - 1; n >= 0; n--) { b.lineTo(edge[1][n][0], edge[1][n][1]); }
  b.closePath();
  b.fillStyle = "#a8865a";
  b.fill();
  b.strokeStyle = "rgba(90, 64, 40, 0.5)";
  b.lineWidth = 3;
  b.stroke();
  for (n = 0; n < 26; n++) {                        // stones in the path
    var sx = -20 + dice(n * 5 + 1) * (last + 10), sy = maengTrail(sx) + 6 + (dice(n * 5 + 2) - 0.5) * mix(50, 18, between(sx, -40, last));
    b.fillStyle = dice(n * 5 + 3) > 0.5 ? "#8a7058" : "#c4a880";
    b.beginPath();
    b.ellipse(sx, sy, 3 + 3 * dice(n * 5 + 4), 2 + 1.5 * dice(n * 5 + 4), 0, 0, 7);
    b.fill();
  }
  var tufts = [0, 1, 2].map(function (k) { return sceneryGrassBank(110 + 30 * dice(k + 81), 91 + k * 5); }), keepTufts = pen;
  pen = b;                                          // grass along both edges of the path, so it lies in the slope
  for (n = 0; n < 60; n++) {
    var gx = -20 + (n / 60) * (last + 20) + 12 * dice(n * 3 + 81), half = mix(34, 13, between(gx, -40, last)), side = n % 2 ? 1 : -1;
    thkPlace(tufts[n % 3], gx, maengTrail(gx) + 6 + side * half * (0.9 + 0.3 * dice(n + 82)) + (side > 0 ? 6 : 2), mix(0.16, 0.07, between(gx, -40, last)), 0);
  }
  pen = keepTufts;
  b = fore.getContext("2d");                        // the rock and the bushes before it all, at the lower left: mossy
  var keepPen = pen;                                // limestone as the cave's (scenery.js), the bushes as the slope's
  pen = b;
  // the two bushes up the slope behind the rock, then the rock, then the two before it (owner, 2026-10-26: "Looks like a
  // bush and boulder have a z order issue": all four were drawn over it)
  [[40, 930, 0.9, 42], [210, 905, 0.8, 43]].forEach(function (c) { thkPlace(natBush(200, 110, c[3], THK_SHADE, [], PIX), c[0], c[1], c[2], 0); });
  thkPlace(rockSprite(330, 230, 41, {stone: "#7a7468", moss: 0.45, jag: 0.5}, PIX), 140, 1100, 1, 0);
  [[330, 1010, 1.0, 44], [420, 1090, 1.15, 45]].forEach(function (c) { thkPlace(natBush(200, 110, c[3], THK_SHADE, [], PIX), c[0], c[1], c[2], 0); });
  pen = keepPen;
  MAENG_SLOPE = {back: back, front: front, fore: fore,
                 backDusk: maengTinted(back, MAENG_DUSK[0], MAENG_DUSK[1]), frontDusk: maengTinted(front, MAENG_DUSK[0], MAENG_DUSK[1]),
                 foreDusk: maengTinted(fore, MAENG_DUSK[0], MAENG_DUSK[1])};
  return MAENG_SLOPE;
}

// ---------- the garden ----------
// Thukkhata's garden by the pen: a patch of tilled earth in rows, a few seedlings; and the mounds where he buries
// the gold, one more each day (MAENG_MOUNDS, in the order he digs them), a glint of gold at some of them. Scenes 8
// and 10 (where he digs it all up again).
var MAENG_GARDEN = [1400, 905, 470, 70];            // its left, its top, its width and depth
var MAENG_MOUNDS = [];
(function () {                                      // the places of the mounds: rows across the patch, in an order that is not a row
  for (var row = 0; row < 3; row++) {
    for (var k = 0; k < 6; k++) {
      MAENG_MOUNDS.push([MAENG_GARDEN[0] + 34 + k * 78 + row * 18, MAENG_GARDEN[1] + 14 + row * 22, dice(row * 6 + k + 40)]);
    }
  }
  MAENG_MOUNDS.sort(function (a, b) { return a[2] - b[2]; });
})();

// The garden's earth, painted once (owner, 2026-10-26, of scene 8: "go with your plans for 8"): the tilled patch
// lit from above and darker toward us, its furrows each a ridge lit on its top and shaded below, clods and small
// stones, and the seedlings in the rows, two or four leaves each, lit on one side. Its point is the patch's top left
// (MAENG_GARDEN). Gives back {earth: a sprite, tints: {}}.
function maengGardenBuild() {
  var g = MAENG_GARDEN, n, k;
  var earth = thkSprite(g[2] + 100, g[3] + 60, 50, 30, function () {
    var soil = pen.createLinearGradient(0, 0, 0, g[3]);
    soil.addColorStop(0, "#94704a");
    soil.addColorStop(1, "#7a5838");
    pen.fillStyle = soil;
    pen.beginPath();
    pen.moveTo(0, 0);
    pen.lineTo(g[2], 0);
    pen.quadraticCurveTo(g[2] + 14, g[3] * 0.5, g[2] + 24, g[3]);
    pen.lineTo(-24, g[3]);
    pen.quadraticCurveTo(-12, g[3] * 0.5, 0, 0);
    pen.closePath();
    pen.fill();
    pen.save();
    pen.clip();
    for (n = 0; n < 900; n++) {                     // the soil's grain: crumbs a little lighter and darker
      var cx = -24 + dice(n * 3 + 501) * (g[2] + 48), cy = dice(n * 3 + 502) * g[3];
      pen.fillStyle = dice(n * 3 + 503) > 0.5 ? "rgba(176, 138, 96, 0.5)" : "rgba(84, 58, 34, 0.45)";
      pen.fillRect(cx, cy, 1 + dice(n + 504) * 1.6, 1 + dice(n + 505) * 1.2);
    }
    for (k = 0; k < 4; k++) {                       // the furrows: a ridge lit on its top, its shade in the trough below
      var fy = (k + 0.5) * g[3] / 4, spread = 6 * k;
      for (n = 0; n < 2; n++) {
        pen.strokeStyle = n ? "rgba(70, 46, 26, 0.55)" : "rgba(190, 152, 108, 0.6)";
        pen.lineWidth = n ? 3.4 : 2.2;
        pen.beginPath();
        for (var x = -20 - spread; x <= g[2] + 20 + spread; x += 12) {
          var y = fy + (n ? 4 : -1) + 1.3 * Math.sin(x * 0.05 + k * 2) + (dice(k * 97 + x) - 0.5) * 1.2;
          if (x === -20 - spread) { pen.moveTo(x, y); } else { pen.lineTo(x, y); }
        }
        pen.stroke();
      }
    }
    for (n = 0; n < 70; n++) {                      // clods and small stones, each lit on its top
      var kx = -16 + dice(n * 5 + 601) * (g[2] + 32), ky = 3 + dice(n * 5 + 602) * (g[3] - 6), kr = 1.6 + dice(n * 5 + 603) * 3.4;
      var stone = dice(n * 5 + 604) > 0.8;
      pen.fillStyle = stone ? "#8e8676" : "#6e4e30";
      pen.beginPath(); pen.ellipse(kx, ky, kr, kr * 0.65, 0, 0, 7); pen.fill();
      pen.fillStyle = stone ? "rgba(214, 206, 188, 0.7)" : "rgba(184, 146, 102, 0.75)";
      pen.beginPath(); pen.ellipse(kx - kr * 0.2, ky - kr * 0.25, kr * 0.6, kr * 0.3, 0, 0, 7); pen.fill();
    }
    pen.restore();
    for (n = 0; n < 9; n++) {                       // the seedlings in the rows, where they stood (the garden's own)
      var sx = 20 + n * 52, sy = 8 + (n % 3) * 22, leaves = n % 2 ? 4 : 2, high = 7 + 3 * dice(n + 701);
      pen.strokeStyle = "#5c7a32";
      pen.lineWidth = 1.6;
      pen.beginPath(); pen.moveTo(sx, sy); pen.lineTo(sx, sy - high); pen.stroke();
      pen.fillStyle = "rgba(60, 40, 22, 0.35)";      // its shadow on the soil
      pen.beginPath(); pen.ellipse(sx + 3, sy + 1, 7, 1.8, 0, 0, 7); pen.fill();
      for (k = 0; k < leaves; k++) {
        var side = k % 2 ? 1 : -1, up = k < 2 ? 0 : 4, lx = sx + side * 6, ly = sy - high + up + 1;
        var leaf = pen.createLinearGradient(sx, ly - 4, sx + side * 12, ly + 3);
        leaf.addColorStop(0, side < 0 ? "#a6d468" : "#7fae48");
        leaf.addColorStop(1, side < 0 ? "#6f9e3c" : "#4f7a2c");
        pen.fillStyle = leaf;
        pen.beginPath();
        pen.ellipse(lx, ly, 6.5 - up * 0.4, 2.8, side * (0.35 + 0.1 * dice(n * 4 + k)), 0, 7);
        pen.fill();
      }
    }
  }, PIX);
  return {earth: earth, tints: {}};
}

// The garden at second t: "count" mounds (a part of one rising while he heaps it), "dug" how many have been
// opened again (scene 10), the gold glinting at the open ones; tint as the hut's.
// t: seconds (the glints shine by it); count: how many mounds, 0 to MAENG_MOUNDS.length (a fraction: the last one
// rising); dug: how many of them are open holes; tint: [colour, 0 to 1] as the hut's, or null. Gives back nothing:
// it draws with pen.
// e.g. maengGarden(t, 6, 0, null);
function maengGarden(t, count, dug, tint) {
  function tone(c) { return tint ? blend(c, tint[0], tint[1]) : c; }
  var g = MAENG_GARDEN, n, k, built = thkOnce("maeng-garden", maengGardenBuild);
  thkPlace(built.earth, g[0], g[1], 1, 0);          // the tilled earth, its furrows, clods and seedlings (painted once)
  sceneryCaveTint(built, "earth", tint, g[0], g[1]);            // and the hour's light over it, as the cave's
  for (n = 0; n < MAENG_MOUNDS.length; n++) {
    var m = MAENG_MOUNDS[n], rise = clamp(count - n);
    if (rise <= 0) { break; }
    var open = n < dug;
    pen.fillStyle = "rgba(60, 40, 22, 0.3)";   // its shadow on the soil
    pen.beginPath(); pen.ellipse(m[0] + 3, m[1] + 2, 25, 4, 0, 0, 7); pen.fill();
    pen.beginPath();                                // a mound of fresh earth, darker and moist, lit on its top; or a hole
    if (open) { pen.ellipse(m[0], m[1] + 2, 20, 7, 0, 0, 7); pen.fillStyle = tone("#3e2a1a"); }
    else {
      pen.ellipse(m[0], m[1], 22, 11 * rise, 0, Math.PI, 0);
      var heap = pen.createLinearGradient(m[0] - 10, m[1] - 11 * rise, m[0] + 8, m[1]);
      heap.addColorStop(0, tone("#a47c52"));
      heap.addColorStop(1, tone("#5e3e24"));
      pen.fillStyle = heap;
    }
    pen.fill();
    pen.strokeStyle = tone("#4e3420");
    pen.lineWidth = 1.2;
    pen.stroke();
    for (k = 0; k < 7; k++) {                       // loose crumbs of it thrown round its foot
      var a = dice(n * 13 + k) * Math.PI, d = 22 + 8 * dice(n * 13 + k + 5);
      pen.fillStyle = tone(k % 2 ? "#6a4628" : "#8e6a44");
      pen.beginPath(); pen.ellipse(m[0] - Math.cos(a) * d, m[1] + 1 - Math.sin(a) * 3, 2.2 * rise, 1.4 * rise, 0, 0, 7); pen.fill();
    }
    if (!open && m[2] > 0.55 && rise >= 1) { goldNugget(pen, m[0] + 6, m[1] - 6, 0.75, t, {shine: 0.9, seed: n}); }   // a glint of gold not quite buried
  }
}

// Someone leading a beast on a rope: Thukkhata the buffalo by the rope through its nose (scenes 3 and 8), a Haw
// trader his pack horse by its halter (scene 10). The beast (kind, "buffalo" unless told) where amble() has it
// ("ox", set off from "from"), on "ground"; the leader ahead of its head at its pace, his feet planted by the
// ground it has covered, the rope in his back hand, sagging a little to the nose. "lad" is his look, "size" the
// beast's. Gives back where he is and his joints.
var MAENG_AHEAD = {buffalo: 380 / 0.62, horse: 420};  // how far ahead of the beast's middle the leader walks, at size 1
// ox: what amble() gave back for the beast; from: the x it set off from; ground: the y it walks on; lad: the
// leader's look; size: the beast's size; kind: "buffalo" (left out) or "horse". It draws the beast, the leader and
// the rope with pen, and gives back {x, joints}.
// e.g. var ox = amble("buffalo", t, 2300, 900, 27, {size: 0.55, rope: true}); maengLead(ox, 2300, 975, lad, 0.55);
function maengLead(ox, from, ground, lad, size, kind) {
  kind = kind || "buffalo";
  var drawn = (kind === "horse" ? horse : buffalo)(ox.x, ground - 6, ox.look), way = ox.look.face;
  var ahead = MAENG_AHEAD[kind] * size, x = ox.x + way * ahead;
  var look = Object.assign({}, lad, {face: way, handB: [-56, 26], fingersB: [0.75, 0.85, 0.9, 0.95, 0.7], stride: 1.4});
  if (ox.look.step !== undefined) { look.step = Math.abs(x - (from + way * ahead)) / (136 * 1.4 * 0.82 * look.size); }   // his feet keep to the ground covered
  var joints = person(x, ground, look);
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);               // the joints and the nose are in the film's own pixels
  var s = size * GAITS.buffalo[0] * PIX, at = drawn.nose || [drawn.head[0] + way * 104 * s, drawn.head[1] + 92 * s];
  pen.strokeStyle = "#c9a878";
  pen.lineWidth = 3 * PIX;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(joints.wristB[0], joints.wristB[1]);
  pen.quadraticCurveTo((joints.wristB[0] + at[0]) / 2, Math.max(joints.wristB[1], at[1]) + 26 * PIX, at[0], at[1]);
  pen.stroke();
  pen.restore();
  return {x: x, joints: joints};
}

// A point of the film's own pixels (a joint, as person() gives it) back in the scene's own measure, where the
// scene draws now (under its camera): for a thing put in a hand.
// p: [x, y] in the film's own pixels. Gives back [x, y] under pen's transform as it is now.
// e.g. var hand = maengAt(joints.handA); goldNugget(pen, hand[0], hand[1] - 10, 2.1, t, {seed: 3});
function maengAt(p) {
  var q = pen.getTransform().inverse().transformPoint(new DOMPoint(p[0], p[1]));
  return [q.x, q.y];
}

// ---------- the city of Phanthumati ----------
// The palace's courtyard: far hills; the city's brick wall behind, with roofs and trees over it; a courtyard paved
// with brick before the palace (MAENG_PALACE, drawn live in two parts: who sits in it is inside). Scenes 9, 11, 12.
var MAENG_PALACE = [1320, 860, 0.8];
// The palace dressed as a Lanna ruler's hall is (the household notebook's sources): a peacock carved in its gable,
// and lanterns of gold-patterned paper hung from its eaves, as before a ruler's hall to show his rank. Scenes 9-11.
var MAENG_PALACE_THINGS = [
  {name: "lantern, left", kind: "khom", x: MAENG_PALACE[0] - 300, base: MAENG_PALACE[1] - 430, size: 0.26, look: {lit: 0, late: 0.7}},
  {name: "lantern, right", kind: "khom", x: MAENG_PALACE[0] + 300, base: MAENG_PALACE[1] - 430, size: 0.26, look: {lit: 0, late: 2.1}}
];
// t: seconds; part: "back" (drawn before who sits in it) or "front" (after, with its lanterns); tint: [colour, 0 to
// 1], or left out; lit: left out keeps the lanterns dark. Gives back nothing: it draws with pen.
// e.g. maengPalace(t, "back", MAENG_DAWN); person(...); maengPalace(t, "front", MAENG_DAWN);
function maengPalace(t, part, tint, lit) {          // the palace hall, back or front, dressed; lit (0 to 1): its lanterns' candles
  var p = MAENG_PALACE;
  hoKham(pen, p[0], p[1], p[2], {fine: true, part: part, tint: tint, pediment: "peacock"});
  if (part === "front") {
    dress(t, lit ? MAENG_PALACE_THINGS.map(function (one) { return Object.assign({}, one, {look: Object.assign({}, one.look, {lit: lit})}); })
                 : MAENG_PALACE_THINGS, "back");
    var pots = thkOnce("maeng-pots", maengPotsBuild);   // the pots of flowers at the stair's foot, in the hour's light
    MAENG_POTS.forEach(function (one, n) {
      thkPlace(pots["pot" + n], one[0], one[1], 1, 0);
      sceneryCaveTint(pots, "pot" + n, tint, one[0], one[1]);
    });
  }
}
// Pots of flowers at the foot of the palace's stair (owner, 2026-10-26: "yes", to flowers by the palace, so the court
// is not bare): glazed jars of the north, jasmine and marigolds, each [x, y of its foot, flora's name, size].
var MAENG_POTS = [[MAENG_PALACE[0] - 128, MAENG_PALACE[1] + 10, "jasmine", 0.62], [MAENG_PALACE[0] + 128, MAENG_PALACE[1] + 10, "marigold", 0.6],
                  [MAENG_PALACE[0] - 330, MAENG_PALACE[1] + 8, "marigold", 0.56], [MAENG_PALACE[0] + 330, MAENG_PALACE[1] + 8, "jasmine", 0.58]];
// Gives back {pot0, pot1, ..., tints: {}}: each pot with its plant, a sprite whose point is the pot's foot.
function maengPotsBuild() {
  var built = {tints: {}};
  MAENG_POTS.forEach(function (one, n) {
    built["pot" + n] = thkSprite(160, 220, 80, 200, function () {
      pen.fillStyle = "rgba(60, 40, 24, 0.3)";       // its shadow on the brick
      pen.beginPath(); pen.ellipse(6, 2, 30, 6, 0, 0, 7); pen.fill();
      [[-9, 0.85], [9, 0.9], [0, 1]].forEach(function (f) { flora(one[2], f[0], -44, {size: one[3] * f[1], ground: false}); });   // a full pot: three plants
      var jar = pen.createLinearGradient(-26, 0, 26, 0);   // the jar, glazed, lit on its left
      jar.addColorStop(0, "#6f8a6a");
      jar.addColorStop(0.35, "#4e6a52");
      jar.addColorStop(1, "#2a3a2e");
      pen.fillStyle = jar;
      pen.beginPath();
      pen.moveTo(-16, 0);
      pen.bezierCurveTo(-30, -14, -30, -34, -20, -44);
      pen.lineTo(20, -44);
      pen.bezierCurveTo(30, -34, 30, -14, 16, 0);
      pen.closePath();
      pen.fill();
      pen.strokeStyle = "rgba(20, 30, 22, 0.6)";
      pen.lineWidth = 1.2;
      pen.stroke();
      pen.strokeStyle = "rgba(200, 180, 120, 0.55)";   // a band round its shoulder
      pen.lineWidth = 1.6;
      pen.beginPath(); pen.moveTo(-26, -32); pen.quadraticCurveTo(0, -27, 26, -32); pen.stroke();
      pen.fillStyle = "rgba(255, 255, 240, 0.35)";   // the glaze's light
      pen.beginPath(); pen.ellipse(-14, -26, 3, 9, 0.2, 0, 7); pen.fill();
      pen.fillStyle = "#3a4a3c";                     // its rim, and the earth in it
      pen.beginPath(); pen.ellipse(0, -44, 21, 4.5, 0, 0, 7); pen.fill();
      pen.fillStyle = "#4a3422";
      pen.beginPath(); pen.ellipse(0, -44, 17, 3, 0, 0, 7); pen.fill();
    }, PIX);
  });
  return built;
}
var MAENG_FINIAL = [MAENG_PALACE[0] + 196 * MAENG_PALACE[2], MAENG_PALACE[1] - 810 * MAENG_PALACE[2]];   // the tip of the roof's right cho fa, where a bird perches
var MAENG_STAIR = 1100;                             // where a trough laid to the palace meets its stair (x)
var MAENG_HERALD = {size: 0.78, smile: 0.5};       // the king's man: he strikes the gong (scene 9), cries the news (10), follows the trough (11)
var MAENG_CITY = null;

// Gives back {back, front}, canvases WIDE by 1080 (clear above the hills: a scene draws its sky first), painted on
// the first call and kept in MAENG_CITY after.
// e.g. var city = maengCity(); pen.drawImage(city.back, 0, 0);
function maengCity() {
  if (MAENG_CITY) { return MAENG_CITY; }
  function sheet() {
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    return paper;
  }
  var back = sheet(), front = sheet(), b = back.getContext("2d"), x, n;
  b.drawImage(farRange("#a9cfc9", "226, 238, 240", 700, MAENG_FAR), 0, 0);   // the far mountains (scenery.js)
  var keep = pen;                                   // the roofs of the city over its wall, and its trees
  pen = b;
  [[160, 0.55], [430, 0.5], [700, 0.58], [1750, 0.52]].forEach(function (h) { house(b, h[0], 790, h[1]); });
  // the city's trees painted as the hero film's are (thicket.js thkTreeOn()), in flower and fruit as a royal city's:
  // the frangipani, the golden shower, a longan, the flame of the forest
  [[300, 0.72, [["frangipani", 30, 14]]], [560, 0.8, [["ratchaphruek", 24, 28]]], [1650, 0.76, [["longan", 22, 14]]],
   [1880, 0.68, [["thongkwao", 36, 14]]]].forEach(function (tr, k) { thkTreeOn(b, tr[0], 790, tr[1], 21 + k, tr[2]); });
  pen = keep;
  b.fillStyle = "#b5704e";                          // the wall of brick, its top stepped
  b.fillRect(0, 760, WIDE, 70);
  for (x = 0; x < WIDE; x += 34) { b.fillRect(x, 744, 20, 18); }
  // laid brick by brick, no two quite one red, the courses' mortar between them; the steps of its top lit, their
  // right sides in shade; streaks down it from the rains and moss at its foot (owner, 2026-10-26: "yes", to the
  // city's wall and court brick by brick)
  for (n = 0; n < 5; n++) {
    for (x = -(n % 2) * 16; x < WIDE; x += 32) {
      var hue = dice(n * 131 + x) - 0.5;
      b.fillStyle = blend("#b5704e", hue > 0 ? "#d08a62" : "#8a4c34", Math.abs(hue) * 0.6);
      b.fillRect(x + 1, 761 + n * 14, 30, 12);
    }
  }
  b.fillStyle = "rgba(90, 40, 24, 0.4)";
  for (n = 0; n < 5; n++) { b.fillRect(0, 760 + n * 14, WIDE, 1.2); }
  for (x = 0; x < WIDE; x += 34) {
    b.fillStyle = "#d89a72"; b.fillRect(x, 744, 20, 3);
    b.fillStyle = "rgba(70, 30, 18, 0.35)"; b.fillRect(x + 15, 747, 5, 15);
  }
  b.fillStyle = "#d89a72";
  b.fillRect(0, 760, WIDE, 2);
  for (n = 0; n < 60; n++) {
    var sx = dice(n * 3 + 901) * WIDE, len = 20 + 45 * dice(n * 3 + 902), rain = b.createLinearGradient(0, 762, 0, 762 + len);
    rain.addColorStop(0, "rgba(60, 40, 34, " + (0.1 + 0.12 * dice(n + 903)).toFixed(3) + ")");
    rain.addColorStop(1, "rgba(60, 40, 34, 0)");
    b.fillStyle = rain;
    b.fillRect(sx, 762, 3 + 7 * dice(n + 904), len);
  }
  for (n = 0; n < 140; n++) {
    b.fillStyle = "rgba(96, 120, 64, " + (0.25 + 0.3 * dice(n + 905)).toFixed(3) + ")";
    b.beginPath(); b.ellipse(dice(n * 3 + 906) * WIDE, 826 - 9 * dice(n + 907), 5 + 9 * dice(n + 908), 2.5 + 2 * dice(n + 909), 0, 0, 7); b.fill();
  }
  b = front.getContext("2d");
  b.fillStyle = "#cdb48a";                          // the courtyard, paved with brick
  b.fillRect(0, 830, WIDE, 250);
  for (n = 0; n < 12; n++) {                        // each brick its own tone, worn a little lighter at its middle
    var top = 836 + n * (8 + n * 1.6), deep = 8 + n * 1.6;
    for (x = (n % 2) * 20 - 40; x < WIDE; x += 40 + n * 3) {
      var hue2 = dice(n * 211 + x * 3) - 0.5;
      b.fillStyle = blend("#cdb48a", hue2 > 0 ? "#e2cca2" : "#a88a62", Math.abs(hue2) * 0.7);
      b.fillRect(x + 1, top + 1, 38 + n * 3, deep - 1);
      b.fillStyle = "rgba(255, 246, 220, 0.18)";
      b.fillRect(x + 4, top + 2, 30 + n * 3, Math.max(1, deep * 0.3));
    }
  }
  b.strokeStyle = "rgba(130, 90, 60, 0.45)";
  b.lineWidth = 1.6;
  for (n = 0; n < 12; n++) {
    var y = 836 + n * (8 + n * 1.6);
    b.beginPath(); b.moveTo(0, y); b.lineTo(WIDE, y); b.stroke();
    for (x = (n % 2) * 20; x < WIDE; x += 40 + n * 3) { b.beginPath(); b.moveTo(x, y); b.lineTo(x, y + 8 + n * 1.6); b.stroke(); }
  }
  for (n = 0; n < 260; n++) {                       // moss and grass in the joints, more toward the wall and the edges
    var my = 836 + Math.pow(dice(n * 3 + 921), 1.8) * 240, mx = dice(n * 3 + 922) * WIDE;
    if (Math.abs(mx - MAENG_PALACE[0]) < 420 && dice(n + 923) > 0.25) { continue; }   // the way to the palace is kept clear
    b.fillStyle = "rgba(100, 128, 66, " + (0.25 + 0.3 * dice(n + 924)).toFixed(3) + ")";
    b.beginPath(); b.ellipse(mx, my, 3 + 5 * dice(n + 925), 1.2 + 1.2 * dice(n + 926), 0, 0, 7); b.fill();
  }
  b.save();                                         // the palace's shade on the court before it, flattened
  b.translate(MAENG_PALACE[0], MAENG_PALACE[1] + 6);
  b.scale(1, 0.08);
  var under = b.createRadialGradient(0, 0, 40, 0, 0, 420);
  under.addColorStop(0, "rgba(70, 50, 30, 0.3)");
  under.addColorStop(1, "rgba(70, 50, 30, 0)");
  b.fillStyle = under;
  b.fillRect(-440, -440, 880, 880);
  b.restore();
  MAENG_CITY = {back: back, front: front};
  return MAENG_CITY;
}

// ---------- the air, and the picture framed ----------
// As the hero film's scenes (scenery.js; docs/kit/places.md, "Painting the scenery", 5 and 7; owner, 2026-10-26: "make
// sure the process of beautification of scenery occurs following the same process as for the hero video"): by day the
// light coming through, a few petals and one butterfly at most, crossing the picture and leaving; at dusk the
// fireflies coming out over the fields; and soft grass and blossom at the picture's edges, out of focus. Only where the
// line's feeling allows: none through the father's dying (scenes 2 and 4), the climb at dusk (5), the cold night of the
// embers (7), the days and nights of the gold (8), the night of the trough (10), or the creature's going home (13).
// MAENG_AIR: each scene's, as sceneryAir() takes it ("goodbye": fireflies, as sceneryFireflies() does).
var MAENG_AIR = {
  work: {butterfly: {kind: "grassyellow", x: 1500, y: 620, vx: -70, weave: 50, seed: 4, size: 1.2, turn: -1.2, wing: 3},
         petals: [8, "#f2e2a0", 5, 0.9], light: [0.55, 3]},
  creature: {butterfly: {kind: "lacewing", x: 260, y: 420, vx: 60, weave: 60, seed: 6, size: 1.3, turn: 1.2, wing: 2}, light: [0.6, 4]},
  decree: {petals: [14, "#f6b8cc", 7, 1.0], light: [0.5, 5]},
  morning: {butterfly: {kind: "bluebottle", x: 1600, y: 520, vx: -80, weave: 55, seed: 9, size: 1.2, turn: -1.2, wing: 4},
            petals: [12, "#f6b8cc", 6, 1.0], light: [0.7, 6]},
  gold: {butterfly: {kind: "grassyellow", x: 1420, y: 640, vx: 0, weave: 120, seed: 13, size: 1.1, turn: 0, wing: 8}, light: [0.45, 8]},
  wedding: {butterfly: {kind: "birdwing", x: 200, y: 380, vx: 70, weave: 60, seed: 11, size: 1.3, turn: 1.2, wing: 5},
            petals: [40, "#f6b8cc", 8, 1.1], light: [0.6, 7]},
  goodbye: {far: [[[0, 700, WIDE, 880], 50, 5]], near: 12}
};
// The picture's edges, soft: grass at the bottom corners, and over a royal place blossom hanging into a top corner.
// Painted once. Returns {day: [...], palace: [...]} for sceneryBeds().
function maengFrameBuild() {
  return {day: [{sprite: sceneryGrass(420, 14, 501), x: -20, y: 1120}, {sprite: sceneryGrass(380, 12, 502), x: 1950, y: 1120}],
          palace: [{sprite: sceneryHanging(520, 240, 503, THK_SHADE, [["frangipani", 10, 14], ["jasmine", 20, 8]]), x: 140, y: -40},
                   {sprite: sceneryGrass(380, 12, 504), x: 1950, y: 1120}]};
}
// The air of scene "kind" (a key of MAENG_AIR) and its frame ("day", "palace" or none) at second t, over everything and
// under the scene's fade. Gives back nothing: it draws with pen, in the film's pixels (after a camera is put back).
// e.g. maengAir(t, "work", "day");
function maengAir(t, kind, frame) {
  if (frame) { sceneryBeds(t, thkOnce("maeng-frame", maengFrameBuild)[frame], {sway: 0.4, blur: 5}); }
  var air = MAENG_AIR[kind];
  if (air.far) { sceneryFireflies(t, air); return; }
  sceneryAir(t, air);
}

// ---------- a fade, the pen, the Haw traders, the trough in the yard ----------
// Black over the picture: out to it from "out" (over 1.2 s, held until "back" when that comes later), and back from it
// from "back" (the scenes' fades to and from black). It used to take the larger of "going out" and "not yet back",
// which is already 1 before "back": the picture snapped to black at "out", a scene opened on 1.2 s of black that then
// cut to the picture, and a call with "back" before "out" drew nothing (owner, 2026-10-21, of the cuts: "Some scenes
// hard cut but there is one with a smooth transition"; found at the creature's run, s13).
// t, out and back: seconds of the scene's clock (99, past the scene's end, for "never"). Gives back nothing: it lays
// the black over the whole sheet with pen; call it last.
// e.g. maengDark(t, 23, 99);   // fades out at 23 s, and does not come back
function maengDark(t, out, back) {
  var going = t >= out && (back <= out || t < back) ? between(t, out, out + 1.2) : 0;
  var coming = t >= back ? 1 - between(t, back, back + 1.2) : 0;
  var dark = Math.max(going, coming);
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}

// The creature's pen in the yard (kok, kok.js): where it stands, its ground, its width. Scenes 7, 8 and 10.
var MAENG_PEN = [1120, 930, 380];

// The Haw traders (scene 10): men of the Yunnan caravans in jackets buttoned down the front and trousers, a
// head-cloth wound round the head, white or black; the one in black has a moustache.
var MAENG_TRADERS = [{shirt: "#2e3a5a", legs: "#3a3a44", turban: "#efe9dc", size: 0.8, skin: "#e2b68e", smile: 0.6},
                     {shirt: "#2a2a2e", legs: "#2e3a5a", turban: "#2a2a2e", beard: "#2a2220", size: 0.82, skin: "#d9a878", smile: 0.6},
                     {shirt: "#4a5a6a", legs: "#3a3a44", turban: "#efe9dc", size: 0.78, skin: "#e6bd95", smile: 0.6, age: 0.4}];
// n: 0, 1 or 2, which of MAENG_TRADERS; extra: the scene's keys, or left out. Gives back a look for person().
// e.g. person(x, y, maengTrader(1, {face: 1, feel: "happy"}));
function maengTrader(n, extra) {                    // a trader's look, with the scene's own (a feeling takes the place of his smile)
  var look = Object.assign({id: "trader" + n}, MAENG_TRADERS[n], extra || {});
  if (extra && extra.feel !== undefined && extra.smile === undefined) { delete look.smile; }
  return look;
}

// The golden trough in the yard: from the hut's foot out along the path, and before the garden it turns off the
// path and goes up across the rice fields toward the city, behind the garden. Scenes 10 (it grows in the night)
// and 11 (the king's man follows it). It is drawn in two parts, as it lies: "near", along the path in front of the
// pen, and "far", across the fields behind the garden and the pen (a scene draws it before them); "built" of the
// way (0 to 1) the whole of it.
var MAENG_TROUGH_TURN = 1240;                       // where it leaves the path (x)
var MAENG_TROUGH = null;
// Gives back {near, far, nearLong, farLong}: the two parts' points ([x, y], pixels of the sheet) and their lengths,
// made on the first call and kept in MAENG_TROUGH after.
// e.g. var route = maengTroughRoute();
function maengTroughRoute() {
  if (MAENG_TROUGH) { return MAENG_TROUGH; }
  var near = [], far = [], x, n, from = [MAENG_TROUGH_TURN, maengWay(MAENG_TROUGH_TURN) - 6], bend = [1340, 870], to = [1990, 838];
  for (x = 600; x < MAENG_TROUGH_TURN; x += 40) { near.push([x, maengWay(x) - 6]); }
  near.push(from);
  for (n = 0; n <= 16; n++) {
    var u = n / 16, w = 1 - u;
    far.push([w * w * from[0] + 2 * w * u * bend[0] + u * u * to[0], w * w * from[1] + 2 * w * u * bend[1] + u * u * to[1]]);
  }
  function long(points) {
    for (var k = 1, sum = 0; k < points.length; k++) { sum += Math.hypot(points[k][0] - points[k - 1][0], points[k][1] - points[k - 1][1]); }
    return sum;
  }
  MAENG_TROUGH = {near: near, far: far, nearLong: long(near), farLong: long(far)};
  return MAENG_TROUGH;
}
// x in pixels of the sheet; gives back [x, y], y on the trough's line there. e.g. var y = maengTroughAt(1500)[1] - 8;
function maengTroughAt(x) {                         // the ground under the trough at x: where someone works beside it
  var route = maengTroughRoute(), points = x < MAENG_TROUGH_TURN ? route.near : route.far;
  for (var k = 1; k < points.length - 1 && points[k][0] < x; k++) { }
  var a = points[k - 1], b = points[k], u = clamp((x - a[0]) / ((b[0] - a[0]) || 1));
  return [x, mix(a[1], b[1], u)];
}
// The trough of the yard, one part of it: built 0 to 1 (how much of the whole is laid, near part first); part "near"
// or "far"; tint as linKham() takes it, or left out. Gives back nothing: it draws with pen.
// e.g. maengYardTrough(1, "far"); maengGarden(t, 6, 0, null); maengYardTrough(1, "near");
function maengYardTrough(built, part, tint) {
  var route = maengTroughRoute(), all = built * (route.nearLong + route.farLong);
  // The far part starts on the near one's end: its first post there has no forked top, which poked out over the near
  // part's gold where the trough turns up (2026-10-23).
  if (part === "far") { linKham(pen, route.far, clamp((all - route.nearLong) / route.farLong), {size: 0.9, tint: tint, joined: true}); }
  else { linKham(pen, route.near, clamp(all / route.nearLong), {size: 0.9, tint: tint}); }
}

// The sun on the trough's gold (owner, 2026-10-26: "yes", to the trough catching the first light, scenes 10 and 11): a
// glint running along it from its far end, once every "period" seconds from second "from". t: seconds; points: the
// line it lies on ([x, y], pixels of the sheet, as linKham() takes them); lift: how high its top is over that line
// (linKham's 46 times its size). Gives back nothing: it draws with pen.
// e.g. maengGlint(t, [[-40, 880], [MAENG_STAIR, 876]], 55, 56.07, 3.5);
function maengGlint(t, points, lift, from, period) {
  var u = (((t - from) / period) % 1 + 1) % 1, total = 0, k, lengths = [];
  for (k = 1; k < points.length; k++) { lengths.push(Math.hypot(points[k][0] - points[k - 1][0], points[k][1] - points[k - 1][1])); total += lengths[k - 1]; }
  var go = u * total;
  for (k = 0; k < lengths.length - 1 && go > lengths[k]; k++) { go -= lengths[k]; }
  var a = points[k], b = points[k + 1], f = clamp(go / (lengths[k] || 1));
  var x = mix(a[0], b[0], f), y = mix(a[1], b[1], f) - lift, shine = Math.sin(Math.PI * u);
  pen.save();
  pen.globalCompositeOperation = "lighter";
  pen.translate(x, y);
  pen.scale(1.8, 0.4);
  var glint = pen.createRadialGradient(0, 0, 0, 0, 0, 34);
  glint.addColorStop(0, "rgba(255, 250, 225, " + (0.9 * shine).toFixed(3) + ")");
  glint.addColorStop(0.3, "rgba(255, 224, 150, " + (0.35 * shine).toFixed(3) + ")");
  glint.addColorStop(1, "rgba(255, 210, 120, 0)");
  pen.fillStyle = glint;
  pen.fillRect(-34, -34, 68, 68);
  pen.restore();
}

// The morning's sun as scenerySun() takes it: low and warm, gold where a white one is lost in a pale sky (scenes 11, 13).
var MAENG_MORNING_SUN = {glow: 10, colour: "255, 214, 150", disc: ["#fff6d8", "#ffe09a", "#ffcf78"]};
// The morning's light (owner, 2026-10-26, of scene 11: "yes", to its morning light): the sun low at the left warming
// the whole picture a little, laid on with "lighter". x, y: the sun, in the pixels the pen draws in; strength: 0 to 1.
// Gives back nothing: it draws with pen over the whole sheet. e.g. maengMorningLight(120, 200, 1);
function maengMorningLight(x, y, strength) {
  pen.save();
  pen.globalCompositeOperation = "lighter";
  var warm = pen.createRadialGradient(x, y, 0, x, y, 1900);   // none on the sun's own disc, which it washed to a ring
  warm.addColorStop(0, "rgba(255, 214, 150, 0)");
  warm.addColorStop(0.04, "rgba(255, 214, 150, " + (0.2 * strength).toFixed(3) + ")");
  warm.addColorStop(0.4, "rgba(255, 214, 150, " + (0.08 * strength).toFixed(3) + ")");
  warm.addColorStop(1, "rgba(255, 214, 150, 0)");
  pen.fillStyle = warm;
  pen.fillRect(0, 0, WIDE, 1080);
  pen.restore();
}

// ---------- the narration ----------
// A scene names its lines as [from, to, id] on its own clock; the words are MAENG_WORDS (words.js). The line
// of second t, if there is one, is put under the picture: the Kam Mueang, and the English under it.
// t: seconds of the scene's clock; lines: a scene's LINES (S02_LINES, ...). Gives back nothing: it writes with
// subtitle(). The film's pages call it for each scene, so a scene never does.
// e.g. maengSubtitles(t, S02_LINES);
function maengSubtitles(t, lines) {
  lines.forEach(function (line) {
    if (t >= line[0] && t < line[1]) { subtitle(MAENG_WORDS[line[2]][1], MAENG_WORDS[line[2]][2]); }
  });
}

// ---------- the rice fields ----------
// The rice fields behind the poor family's house (2026-10-20). Owner: "Increase the quality of
// the background fields behind the home of the poor family and the fields as well. A few of the fields should be
// flooded and a few farmers and buffalo, etc. should be working the fields and a crane should fly off from the
// fields"; the bird is the cattle egret (นกยางควาย) that walks behind the plough (the kit's research; owner: "Egret").
// maengFields(brush) paints the plots once, onto the yard's far sheet; maengFieldLife(t) draws what moves on them.

var FIELD_ROWS = 6;
var FIELD_TOP = 812;
// r: 0 (the far row) to FIELD_ROWS - 1. Gives back [top, depth] in pixels of the sheet. e.g. var row = fieldRow(3);
function fieldRow(r) {                             // a row of plots: its top and its depth, nearer rows deeper
  return [FIELD_TOP + r * 16 + r * r * 1.6, 16 + r * 4];
}
// Each plot: [row, from x, to x, kind]: "water" flooded and new-planted (the sky in it, rows of seedlings), "rice"
// green and grown, "mud" ploughed and wet. Laid out by hand, so the ploughing and the planting have their places.
var FIELD_PLOTS = [
  [0, 0, 420, "rice"], [0, 420, 900, "water"], [0, 900, 1500, "rice"], [0, 1500, 1920, "water"],
  [1, 0, 300, "water"], [1, 300, 1330, "rice"], [1, 1330, 1580, "mud"], [1, 1580, 1920, "rice"],
  [2, 0, 520, "rice"], [2, 520, 1100, "water"], [2, 1100, 1640, "rice"], [2, 1640, 1920, "water"],
  [3, 0, 380, "mud"], [3, 380, 980, "rice"], [3, 980, 1560, "water"], [3, 1560, 1920, "rice"],
  [4, 0, 700, "rice"], [4, 700, 1300, "rice"], [4, 1300, 1920, "water"],
  [5, 0, 1000, "rice"], [5, 1000, 1920, "rice"]
];
// The row and the stretch the buffalo ploughs, back and forth, 9 a second: right of the pen in the yard's close views
// and clear of the family's path in its wide one, so that it is seen.
var FIELD_PLOUGH = [1, 1350, 1550];
// At each end of its furrow the buffalo turns round (buffalo()'s turn), FIELD_TURN seconds long; its first turn,
// from facing left to facing right, begins FIELD_TURN_FIRST seconds into a scene, so that a short scene has one
// (owner, 2026-10-22: "Animate it turning from facing left to facing right").
var FIELD_TURN = 3.5, FIELD_TURN_FIRST = 3;
var FIELD_LED = [1, 1000, 5];                       // the led buffalo: its row, where it is at a scene's start, how fast it goes
var FIELD_PLANTERS = [[3, 1060], [3, 1180], [3, 1320]];   // women planting rice in the flooded plot, bent over

// The plots of FIELD_PLOTS and their bunds, painted with brush (a 2D context: the yard's far sheet); the flooded
// plots' seedlings and glints on a sheet of their own (maengFieldOver()), their water drawn live (maengFieldWater()).
// Gives back nothing. e.g. maengFields(back.getContext("2d"));
function maengFields(brush) {
  var n, k;
  FIELD_PLOTS.forEach(function (p, i) {
    var row = fieldRow(p[0]), top = row[0], deep = row[1], x0 = p[1], x1 = p[2];
    if (p[3] === "water") {                         // the water is drawn live (maengFieldWater()); here its glints and seedlings,
      var keepBrush = brush;                        // on their own sheet laid over it
      brush = maengFieldOver();
      brush.strokeStyle = "rgba(255, 255, 255, 0.55)";
      brush.lineWidth = 1;
      for (k = 0; k < 5; k++) {
        var ry = top + 3 + dice(i * 7 + k) * (deep - 4), rx = x0 + dice(i * 11 + k) * (x1 - x0 - 60);
        brush.beginPath(); brush.moveTo(rx, ry); brush.lineTo(rx + 30 + 30 * dice(i + k), ry); brush.stroke();
      }
      brush.strokeStyle = "rgba(100, 150, 60, 0.75)";   // rows of seedlings, short green ticks
      brush.lineWidth = 1.4;
      for (var sy = top + 4; sy < top + deep - 1; sy += 5 + p[0] * 1.4) {
        for (var sx = x0 + 8 + (sy % 11); sx < x1 - 6; sx += 16 + p[0] * 3) {
          brush.beginPath(); brush.moveTo(sx, sy + 2); brush.lineTo(sx + 0.6, sy - 1 - p[0] * 0.3); brush.stroke();
        }
      }
      brush = keepBrush;
    } else if (p[3] === "mud") {                    // ploughed: wet earth, furrows along it
      brush.fillStyle = "#8a6a48";
      brush.fillRect(x0, top, x1 - x0, deep + 2);
      brush.strokeStyle = "rgba(60, 40, 24, 0.45)";
      brush.lineWidth = 1.2;
      for (k = top + 3; k < top + deep; k += 3) { brush.beginPath(); brush.moveTo(x0, k); brush.lineTo(x1, k + 1); brush.stroke(); }
      brush.fillStyle = "rgba(190, 215, 220, 0.5)";  // a little water lying in it
      brush.fillRect(x0 + (x1 - x0) * 0.6, top + 2, (x1 - x0) * 0.3, deep * 0.4);
    } else {                                        // grown rice: green, in two shades, the blades catching the light
      brush.fillStyle = i % 2 ? "#86b852" : "#78ac48";
      brush.fillRect(x0, top, x1 - x0, deep + 2);
      brush.strokeStyle = i % 2 ? "#9ac862" : "#6a9c3e";
      brush.lineWidth = 1.2;
      for (k = x0 + 3; k < x1; k += 5 + p[0]) {
        var h = 3 + p[0] * 0.8;
        brush.beginPath(); brush.moveTo(k, top + deep); brush.lineTo(k + 1, top + deep - h); brush.stroke();
      }
    }
  });
  for (n = 0; n < FIELD_ROWS; n++) {                // the bunds: a line of earth and grass along each row, and across it
    var row = fieldRow(n);
    brush.fillStyle = "#a08058";
    brush.fillRect(0, row[0] - 1, WIDE, 2.5 + n * 0.5);
    brush.fillStyle = "#7f9a48";
    brush.fillRect(0, row[0] - 2, WIDE, 1.2);
  }
  FIELD_PLOTS.forEach(function (p) {
    if (p[1] === 0) { return; }
    var row = fieldRow(p[0]);
    brush.fillStyle = "#a08058";
    brush.fillRect(p[1] - 1, row[0], 2 + p[0] * 0.5, row[1] + 2);
  });
}

// The flooded plots' water as the hero film's pond (owner, 2026-10-26: "redo the water in scene 2 to look like the
// pond scene water in the hero", then "Make the water reflective"): the hills, the sky and whatever flies over the
// fields mirrored in it about the fields' far edge (pinewoods.js natReflect()), still, so the mirror holds, little of
// the water's own colour over it and its light glinting; then the rows of seedlings and the glints over it
// (MAENG_FIELD_OVER). Drawn live in each flooded plot, after the yard's far
// sheet (by day or night: what it mirrors is already on the picture). t: the scene's second. Gives back nothing: it
// draws with pen. e.g. maengFieldWater(t);
var MAENG_FIELD_OVER = null;
function maengFieldOver() {                         // the seedlings' sheet: a clear canvas WIDE by 1080, its 2D context
  if (!MAENG_FIELD_OVER) {
    MAENG_FIELD_OVER = document.createElement("canvas");
    MAENG_FIELD_OVER.width = WIDE;
    MAENG_FIELD_OVER.height = 1080;
  }
  return MAENG_FIELD_OVER.getContext("2d");
}
function maengFieldWater(t) {
  maengYard();                                      // the plots and their seedlings' sheet are painted with the yard
  var foot = fieldRow(FIELD_ROWS - 1)[0] + fieldRow(FIELD_ROWS - 1)[1];
  pen.save();
  pen.beginPath();
  FIELD_PLOTS.forEach(function (p) {
    if (p[3] !== "water") { return; }
    var row = fieldRow(p[0]);
    pen.rect(p[1] + 1, row[0] + 2, p[2] - p[1] - 2, row[1]);
  });
  pen.clip();
  natReflect(t, FIELD_TOP, {left: 0, right: WIDE, foot: foot, ripple: 0.12, tint: "40, 78, 80", deep: 0.12, sheen: 80, line: 0});
  pen.drawImage(MAENG_FIELD_OVER, 0, 0);
  pen.restore();
}

// Where the ploughing buffalo is at second t: {x, face, turn}: along FIELD_PLOUGH at 9 a second, facing the way it
// goes; at an end, turning round in its place (turn 0 to 1, from face to the other way), and since, the seconds
// since its last turn began (below 0 before its first). e.g. var p = fieldPloughAt(t);
function fieldPloughAt(t) {
  var span = FIELD_PLOUGH[2] - FIELD_PLOUGH[1], leg = span / 9, lap = 2 * (leg + FIELD_TURN);
  var u = ((t - FIELD_TURN_FIRST + 2 * leg + FIELD_TURN) % lap + lap) % lap;   // 0 as it sets off going right
  var since = t < FIELD_TURN_FIRST ? t - FIELD_TURN_FIRST : (t - FIELD_TURN_FIRST) % (leg + FIELD_TURN);
  if (u < leg) { return {x: FIELD_PLOUGH[1] + 9 * u, face: 1, turn: 0, since: since}; }
  if (u < leg + FIELD_TURN) { return {x: FIELD_PLOUGH[2], face: 1, turn: (u - leg) / FIELD_TURN, since: since}; }
  u -= leg + FIELD_TURN;
  if (u < leg) { return {x: FIELD_PLOUGH[2] - 9 * u, face: -1, turn: 0, since: since}; }
  return {x: FIELD_PLOUGH[1], face: -1, turn: (u - leg) / FIELD_TURN, since: since};
}

// What moves in the fields at second t: the buffalo ploughing FIELD_PLOUGH, the farmer, the egrets, a buffalo led
// along the fields with two children on its back, the women planting at FIELD_PLANTERS. Gives back nothing: it
// draws with pen (maengYardAt() calls it).
// The ploughing buffalo turns round at each end of its furrow (owner, 2026-10-22: "Have the plow farmer move in front
// of the buffalo as he follows and it turns"): the ploughman lets the plough swing round with it and walks round in
// front of it, nearer us, to take it up again behind; and the egrets that walk behind the plough for what it turns up
// fly up and away as it turns ("they should fly up and away when the buffalo turns around"), out past the picture's
// edge, and come gliding back in to land behind it again. And a man leads a buffalo along the same row, slowly, two
// small children astride its back ("animate 2 small kids on a buffalo being led at the same distance").
// e.g. maengFieldLife(t);
function maengFieldLife(t) {
  var row = fieldRow(FIELD_PLOUGH[0]), y = row[0] + row[1] - 2, p = fieldPloughAt(t), bx = p.x, face = p.face;
  var round = Math.cos(Math.PI * fowlEase((p.turn - 0.45) / 0.55));   // which way its body faces through a turn: 1 as it was, -1 round
  buffalo(bx, y, {size: 0.055, face: face, step: t * 1.4, turn: p.turn});   // the buffalo, at its slow walk; it steps round as it turns
  var fx = bx - face * round * 18;                  // the plough behind it, swinging round with it in a turn
  pen.strokeStyle = "#5a3a22";
  pen.lineWidth = 1.1;
  pen.beginPath();
  pen.moveTo(bx - face * round * 6, y - 9);
  pen.lineTo(fx + face * round * 3, y - 5);
  pen.lineTo(fx + face * round * 1, y);
  pen.stroke();
  // The ploughman: behind the plough; in a turn he walks round in front of the buffalo, a step nearer us, from behind
  // it as it was to behind it as it will be.
  var go = fowlEase(p.turn), mx = p.turn > 0 ? mix(bx - face * 21, bx + face * 21, go) : fx - face * 3;
  person(mx, y + 1 + 5 * Math.sin(Math.PI * go), cast("farmer", {size: 0.085, face: face, id: "ploughman",
         step: t * 1.6, turban: null, hat: false, shirt: "#2f3a5a", legs: "#2f3a5a", sarong: undefined}));   // in indigo cotton (the research)
  // The egrets: behind the plough, pecking, until a turn; then up and away for 5 s, out past the picture's edge;
  // gone 4 s; and back in 5 s, gliding down to land where they would be walking now.
  [0, 1, 2].forEach(function (k) {
    var dir = p.turn > 0.5 ? -face : face, rear = bx - dir * 18;
    var ex = rear - dir * (14 + k * 12 + 3 * Math.sin(t + k)), peck = 0.5 + 0.5 * Math.sin(t * 2.3 + k * 2);
    var s = p.since - k * 0.25;                     // one after another
    if (s < 0 || s >= 14) {
      egret(ex, y + 1, t, {size: 0.086, peck: peck, face: dir});   // northbirds.js
      return;
    }
    var was = p.turn > 0 ? face : -face, end = was > 0 ? FIELD_PLOUGH[2] : FIELD_PLOUGH[1];   // where it took off: behind the plough as the turn began
    var from = end - was * 18 - was * (14 + k * 12 + 3 * Math.sin(t - p.since + k)), way = k === 1 ? 1 : -1, u;
    var reach = way < 0 ? from + 150 : WIDE - from + 150;
    if (s < 5) {                                    // up and away
      u = s / 5;
      egret(from + way * reach * u, y - 4 - 230 * u - 30 * Math.sin(u * 3) - k * 14 * u, t, {size: (0.32 + 0.2 * u) / 2.8, fly: true, face: way, seed: 3 + k});
    } else if (s >= 9) {                            // back in, gliding down to where it would be walking
      u = fowlEase((s - 9) / 5);
      egret(ex + way * reach * (1 - u), y + 1 - (230 + k * 14) * (1 - u), t, {size: (0.32 + 0.2 * (1 - u)) / 2.8 * (1 - u) + 0.086 * u,
            fly: u < 0.95, face: -way, seed: 3 + k});
    }
  });
  // The led buffalo, two children astride it, and the man leading it by its nose rope a few steps ahead.
  var led = fieldRow(FIELD_LED[0]), ly = led[0] + led[1] - 2, lx = FIELD_LED[1] + FIELD_LED[2] * t;
  var ride = buffalo(lx, ly, {size: 0.055, step: t * 1.2, rope: true});
  person(ride.seat[0] + 2, ride.seat[1], cast("boy", {size: 0.042, floor: "astride", id: "rider one", late: 0, spring: 0.3, smile: 1}));
  person(ride.seat[0] - 3, ride.seat[1] + 1, cast("girl", {size: 0.038, floor: "astride", id: "rider two", late: 0.3, spring: 0.3, smile: 1}));
  pen.strokeStyle = "#c9a878";                      // the lead, from its nose to his hand
  pen.lineWidth = 0.9;
  pen.beginPath();
  pen.moveTo(lx + 13, ly - 8);
  pen.quadraticCurveTo(lx + 20, ly - 3, lx + 26, ly - 9);
  pen.stroke();
  person(lx + 29, ly + 1, cast("farmer", {size: 0.085, id: "leads the buffalo", step: t * 1.2 * 1.3, turban: "#c4654f", hat: false,
         shirt: "#c9b28a", legs: "#3d4f78", sarong: undefined, handB: [-30, 40]}));
  FIELD_PLANTERS.forEach(function (w, k) {          // women planting rice, bent, stepping slowly back along the row
    var r = fieldRow(w[0]), px = w[1] - (t * 2) % 60;
    person(px, r[0] + r[1] - 1, cast("villager", {size: 0.095, face: -1, id: "planter" + k, bend: 0.7, bun: "low", lady: true, turban: null,
                                                  shirt: "#2f3a5a", legs: "#3a3a5a", reachA: [px + 8, r[0] + r[1] - 1], late: k * 0.3}));
  });
}
