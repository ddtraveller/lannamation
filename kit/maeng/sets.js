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

function maengSky(kind) {
  if (MAENG_SKY[kind]) { return MAENG_SKY[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var brush = paper.getContext("2d"), n, sky = brush.createLinearGradient(0, 0, 0, 1080);
  var stops = {night: [[0, "#070b24"], [0.6, "#1b2350"], [1, "#40336b"]],
               dawn: [[0, "#232a5a"], [0.5, "#6a5a8e"], [0.78, "#e3a07f"], [1, "#f6d39c"]],
               day: [[0, "#8ccfc6"], [0.6, "#f4ecd2"], [1, "#f1d3bd"]],
               dusk: [[0, "#f0642a"], [0.5, "#f2a23c"], [1, "#7fb89a"]]}[kind];
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

function maengPeak(x) {                            // how high Doi Khao Khwai stands at x
  var main = 690 * Math.exp(-Math.pow((x - 1150) / 430, 2)), shoulder = 300 * Math.exp(-Math.pow((x - 560) / 300, 2));
  return 1040 - Math.max(main, shoulder) - 18 * Math.sin(x * 0.013) - 9 * Math.sin(x * 0.031);
}

function maengRange(base, tall, shape) {           // the ridge of hills(brush, WIDE, base, tall, shape, colour), at every x
  var tops = [];
  for (var x = 0; x < WIDE; x++) {
    tops.push(base - tall * (0.5 + 0.3 * Math.sin(x * 0.004 + shape) + 0.2 * Math.sin(x * 0.011 + shape * 3)));
  }
  return function (at) { return tops[Math.max(0, Math.min(WIDE - 1, Math.round(at)))]; };
}

var MAENG_MOUNTAIN = null;

// The light before the sun is up: a set is painted by day and this laid over it (MAENG_DAWN[1] of it), and
// whatever a scene draws live on the set is blended toward it by as much.
var MAENG_DAWN = ["#28285a", 0.4];

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
  hills(brush, WIDE, 700, 360, 1.7, far[0]);
  forestSlope(brush, maengRange(700, 360, 1.7), 0, WIDE, 780, {far: 0.8, small: 3, large: 6, haze: far[0], seed: 41});
  hills(brush, WIDE, 800, 260, 3.9, far[1]);
  forestSlope(brush, maengRange(800, 260, 3.9), 0, WIDE, 860, {far: 0.5, small: 4, large: 9, haze: far[1], seed: 42});
  var veil = "226, 238, 240", haze = brush.createLinearGradient(0, 560, 0, 880);
  haze.addColorStop(0, "rgba(" + veil + ", 0)");
  haze.addColorStop(0.2, "rgba(" + veil + ", 0.45)");
  haze.addColorStop(1, "rgba(" + veil + ", 0)");
  brush.fillStyle = haze;
  brush.fillRect(0, 560, WIDE, 320);
  brush = front.getContext("2d");
  brush.beginPath();                                // Doi Khao Khwai: deepest along its ridge
  brush.moveTo(0, 1080);
  for (x = 0; x <= WIDE; x += 8) { brush.lineTo(x, maengPeak(x)); }
  brush.lineTo(WIDE, 1080);
  brush.closePath();
  var body = brush.createLinearGradient(0, 340, 0, 1080);
  body.addColorStop(0, blend(far[2], "#1f3a3a", 0.3));
  body.addColorStop(1, far[3]);
  brush.fillStyle = body;
  brush.fill();
  forestSlope(brush, maengPeak, 0, WIDE, 1080, {far: 0.15, small: 6, large: 15, haze: far[2], seed: 43});
  MAENG_MOUNTAIN = {back: back, front: front, backDawn: maengTinted(back, MAENG_DAWN[0], MAENG_DAWN[1] * 1.15),
                    frontDawn: maengTinted(front, MAENG_DAWN[0], MAENG_DAWN[1])};
  return MAENG_MOUNTAIN;
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
                  bangles: 4, earplug: "#e0b23a", size: 0.78, smile: 0.8};
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

function maengWay(x) {                             // where the path's middle is at x: from the hut's foot out to the right edge
  return 958 - 18 * between(x, 600, WIDE) - 10 * Math.sin(x * 0.006);
}

function maengYard() {
  if (MAENG_YARD) { return MAENG_YARD; }
  function sheet() {
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    return paper;
  }
  var back = sheet(), front = sheet(), brush = back.getContext("2d"), x, n;
  hills(brush, WIDE, 720, 330, 5.2, "#a9cfc9");
  forestSlope(brush, maengRange(720, 330, 5.2), 0, WIDE, 800, {far: 0.8, small: 3, large: 6, haze: "#a9cfc9", seed: 51});
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
  bamboo(brush, 250, 925, 1.1, 7);
  banana(brush, 880, 915);
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

function maengYardAt(t, night, glow, behind) {   // behind: drawn after the far sheet, before the yard and the hut (mist over the fields)
  var yard = maengYard();
  pen.drawImage(maengSky("day"), 0, 0);
  if (night > 0) {
    pen.globalAlpha = night;
    pen.drawImage(maengSky("night"), 0, 0);
    pen.globalAlpha = 1;
  }
  cumulus(pen, t + 10, night > 0.5 ? MAENG_CLOUDS.night : MAENG_CLOUDS.day);
  pen.drawImage(yard.back, 0, 0);
  if (night > 0) { pen.globalAlpha = night; pen.drawImage(yard.backNight, 0, 0); pen.globalAlpha = 1; }
  if (night < 0.5) { maengFieldLife(t); }         // the farmers, the buffalo and the egrets out in the fields
  if (behind) { behind(); }
  pen.drawImage(yard.front, 0, 0);
  if (night > 0) { pen.globalAlpha = night; pen.drawImage(yard.frontNight, 0, 0); pen.globalAlpha = 1; }
  ruenPhuk(pen, MAENG_HUT[0], MAENG_HUT[1], MAENG_HUT[2] * 0.92, {glow: glow || 0, tint: night > 0 ? [MAENG_NIGHT[0], MAENG_NIGHT[1] * night] : null});
  dress(t, MAENG_YARD_THINGS, "back", night > 0 ? [MAENG_NIGHT[0], MAENG_NIGHT[1] * night] : null);
}

// ---------- the meadow ----------
// Where Thukkhata grazes the headman's buffalo and gathers firewood: the yard's far hills and city behind,
// a meadow of long grass, a great tree at the right whose fallen wood lies under it (MAENG_TREE), and far off
// at the left the headman's house, a fine teak house as a headman's is. Scene 3.
var MAENG_TREE = [1560, 905];
var MAENG_MEADOW = null;

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
  brush.strokeStyle = "rgba(70, 110, 40, 0.7)";     // tufts of long grass
  brush.lineWidth = 2;
  for (n = 0; n < 160; n++) {
    var gx = dice(n * 3 + 1) * WIDE, gy = 880 + dice(n * 3 + 2) * 200, gh = 8 + 10 * dice(n * 3 + 3) * (gy - 860) / 220;
    brush.beginPath();
    brush.moveTo(gx - 4, gy); brush.lineTo(gx - 6, gy - gh);
    brush.moveTo(gx, gy); brush.lineTo(gx + 1, gy - gh * 1.2);
    brush.moveTo(gx + 4, gy); brush.lineTo(gx + 7, gy - gh);
    brush.stroke();
  }
  var keep = pen;
  pen = brush;
  tree(brush, MAENG_TREE[0], MAENG_TREE[1], 1.5);   // the great tree
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
var MAENG_DUSK = ["#5a2a46", 0.34];
var MAENG_SLOPE = null;

function maengHillside(x) {                        // the top edge of the hillside, rising to the right
  return 600 - 380 * (x / WIDE) - 26 * Math.sin(x * 0.006);
}

function maengTrail(x) {                           // where the path is at x: up from the lower left to the cave's ledge
  var u = between(x, 40, MAENG_SLOPE_CAVE[0] - 60);
  return mix(1010, MAENG_SLOPE_CAVE[1] + 4, u * u * (3 - 2 * u)) + 22 * Math.sin(u * Math.PI * 3) * (1 - u);
}

function maengSlope() {
  if (MAENG_SLOPE) { return MAENG_SLOPE; }
  function sheet() {
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    return paper;
  }
  var back = sheet(), front = sheet(), fore = sheet(), b = back.getContext("2d"), x, n;
  hills(b, WIDE, 640, 300, 2.4, "#a9cfc9");
  forestSlope(b, maengRange(640, 300, 2.4), 0, WIDE, 760, {far: 0.75, small: 3, large: 7, haze: "#a9cfc9", seed: 61});
  b.beginPath();                                    // the hillside
  b.moveTo(0, 1080);
  for (x = 0; x <= WIDE; x += 8) { b.lineTo(x, maengHillside(x)); }
  b.lineTo(WIDE, 1080);
  b.closePath();
  var earth = b.createLinearGradient(0, 300, 0, 1080);
  earth.addColorStop(0, "#4f7a4c");
  earth.addColorStop(1, "#3f6440");
  b.fillStyle = earth;
  b.fill();
  forestSlope(b, maengHillside, 0, WIDE, 1080, {far: 0.05, small: 10, large: 24, seed: 62});
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
  b = fore.getContext("2d");                        // the rock and the bushes before it all, at the lower left
  b.beginPath();
  b.moveTo(-20, 1080);
  b.quadraticCurveTo(-10, 880, 120, 860);
  b.quadraticCurveTo(250, 850, 300, 930);
  b.quadraticCurveTo(330, 1000, 310, 1080);
  b.closePath();
  var stone = b.createLinearGradient(0, 850, 300, 1080);
  stone.addColorStop(0, "#9a8f80");
  stone.addColorStop(1, "#5e554c");
  b.fillStyle = stone;
  b.fill();
  b.strokeStyle = inkFor("#7a7066");
  b.lineWidth = 2.6;
  b.stroke();
  [[60, 900, 34], [180, 880, 30], [300, 960, 36], [380, 1040, 40]].forEach(function (c, k) {
    crown(b, c[0], c[1], c[2], FOREST_GREENS[(k + 1) % FOREST_GREENS.length], 80 + k);
  });
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

// The garden at second t: "count" mounds (a part of one rising while he heaps it), "dug" how many have been
// opened again (scene 10), the gold glinting at the open ones; tint as the hut's.
function maengGarden(t, count, dug, tint) {
  function tone(c) { return tint ? blend(c, tint[0], tint[1]) : c; }
  var g = MAENG_GARDEN, n;
  pen.fillStyle = tone("#8a6440");                  // the tilled earth
  pen.beginPath();
  pen.moveTo(g[0], g[1]);
  pen.lineTo(g[0] + g[2], g[1]);
  pen.lineTo(g[0] + g[2] + 24, g[1] + g[3]);
  pen.lineTo(g[0] - 24, g[1] + g[3]);
  pen.closePath();
  pen.fill();
  pen.strokeStyle = tone("#6a4a2e");
  pen.lineWidth = 2;
  for (n = 1; n < 4; n++) {                         // the rows
    pen.beginPath();
    pen.moveTo(g[0] - 6 * n, g[1] + n * g[3] / 4);
    pen.lineTo(g[0] + g[2] + 6 * n, g[1] + n * g[3] / 4);
    pen.stroke();
  }
  for (n = 0; n < 9; n++) {                         // a few seedlings, the garden's own
    var sx = g[0] + 20 + n * 52, sy = g[1] + 8 + (n % 3) * 22;
    pen.strokeStyle = tone("#5f8f3a");
    pen.lineWidth = 2;
    pen.beginPath();
    pen.moveTo(sx, sy); pen.quadraticCurveTo(sx - 5, sy - 8, sx - 9, sy - 10);
    pen.moveTo(sx, sy); pen.quadraticCurveTo(sx + 5, sy - 8, sx + 9, sy - 10);
    pen.stroke();
  }
  for (n = 0; n < MAENG_MOUNDS.length; n++) {
    var m = MAENG_MOUNDS[n], rise = clamp(count - n);
    if (rise <= 0) { break; }
    var open = n < dug;
    pen.beginPath();                                // a mound of earth, or a hole where one was opened
    if (open) { pen.ellipse(m[0], m[1] + 2, 20, 7, 0, 0, 7); }
    else { pen.ellipse(m[0], m[1], 22, 11 * rise, 0, Math.PI, 0); }
    pen.fillStyle = tone(open ? "#4a3220" : "#a07a50");
    pen.fill();
    pen.strokeStyle = tone("#5a3e26");
    pen.lineWidth = 1.4;
    pen.stroke();
    if (!open && m[2] > 0.55 && rise >= 1) { goldNugget(pen, m[0] + 6, m[1] - 6, 0.75, t, {shine: 0.9, seed: n}); }   // a glint of gold not quite buried
  }
}

// Someone leading a beast on a rope: Thukkhata the buffalo by the rope through its nose (scenes 3 and 8), a Haw
// trader his pack horse by its halter (scene 10). The beast (kind, "buffalo" unless told) where amble() has it
// ("ox", set off from "from"), on "ground"; the leader ahead of its head at its pace, his feet planted by the
// ground it has covered, the rope in his back hand, sagging a little to the nose. "lad" is his look, "size" the
// beast's. Gives back where he is and his joints.
var MAENG_AHEAD = {buffalo: 380 / 0.62, horse: 420};  // how far ahead of the beast's middle the leader walks, at size 1
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
function maengPalace(t, part, tint, lit) {          // the palace hall, back or front, dressed; lit (0 to 1): its lanterns' candles
  var p = MAENG_PALACE;
  hoKham(pen, p[0], p[1], p[2], {part: part, tint: tint, pediment: "peacock"});
  if (part === "front") {
    dress(t, lit ? MAENG_PALACE_THINGS.map(function (one) { return Object.assign({}, one, {look: Object.assign({}, one.look, {lit: lit})}); })
                 : MAENG_PALACE_THINGS, "back");
  }
}
var MAENG_FINIAL = [MAENG_PALACE[0] + 196 * MAENG_PALACE[2], MAENG_PALACE[1] - 810 * MAENG_PALACE[2]];   // the tip of the roof's right cho fa, where a bird perches
var MAENG_STAIR = 1100;                             // where a trough laid to the palace meets its stair (x)
var MAENG_HERALD = {size: 0.78, smile: 0.5};       // the king's man: he strikes the gong (scene 9), cries the news (10), follows the trough (11)
var MAENG_CITY = null;

function maengCity() {
  if (MAENG_CITY) { return MAENG_CITY; }
  function sheet() {
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    return paper;
  }
  var back = sheet(), front = sheet(), b = back.getContext("2d"), x, n;
  hills(b, WIDE, 700, 300, 4.1, "#a9cfc9");
  forestSlope(b, maengRange(700, 300, 4.1), 0, WIDE, 760, {far: 0.8, small: 3, large: 6, haze: "#a9cfc9", seed: 71});
  var keep = pen;                                   // the roofs of the city over its wall, and its trees
  pen = b;
  [[160, 0.55], [430, 0.5], [700, 0.58], [1750, 0.52]].forEach(function (h) { house(b, h[0], 790, h[1]); });
  [[300, 0.9], [560, 1.0], [1650, 0.95], [1880, 0.85]].forEach(function (tr) { tree(b, tr[0], 790, tr[1]); });
  pen = keep;
  b.fillStyle = "#b5704e";                          // the wall of brick, its top stepped
  b.fillRect(0, 760, WIDE, 70);
  for (x = 0; x < WIDE; x += 34) { b.fillRect(x, 744, 20, 18); }
  b.strokeStyle = "rgba(90, 40, 24, 0.45)";
  b.lineWidth = 1.5;
  for (n = 0; n < 4; n++) {
    b.beginPath(); b.moveTo(0, 774 + n * 15); b.lineTo(WIDE, 774 + n * 15); b.stroke();
  }
  b = front.getContext("2d");
  b.fillStyle = "#cdb48a";                          // the courtyard, paved with brick
  b.fillRect(0, 830, WIDE, 250);
  b.strokeStyle = "rgba(130, 90, 60, 0.45)";
  b.lineWidth = 1.6;
  for (n = 0; n < 12; n++) {
    var y = 836 + n * (8 + n * 1.6);
    b.beginPath(); b.moveTo(0, y); b.lineTo(WIDE, y); b.stroke();
    for (x = (n % 2) * 20; x < WIDE; x += 40 + n * 3) { b.beginPath(); b.moveTo(x, y); b.lineTo(x, y + 8 + n * 1.6); b.stroke(); }
  }
  MAENG_CITY = {back: back, front: front};
  return MAENG_CITY;
}

// ---------- a fade, the pen, the Haw traders, the trough in the yard ----------
// Black over the picture: out to it from "out" (over 1.2 s, held until "back" when that comes later), and back from it
// from "back" (the scenes' fades to and from black). It used to take the larger of "going out" and "not yet back",
// which is already 1 before "back": the picture snapped to black at "out", a scene opened on 1.2 s of black that then
// cut to the picture, and a call with "back" before "out" drew nothing (owner, 2026-10-21, of the cuts: "Some scenes
// hard cut but there is one with a smooth transition"; found at the creature's run, s13).
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
function maengTroughAt(x) {                         // the ground under the trough at x: where someone works beside it
  var route = maengTroughRoute(), points = x < MAENG_TROUGH_TURN ? route.near : route.far;
  for (var k = 1; k < points.length - 1 && points[k][0] < x; k++) { }
  var a = points[k - 1], b = points[k], u = clamp((x - a[0]) / ((b[0] - a[0]) || 1));
  return [x, mix(a[1], b[1], u)];
}
function maengYardTrough(built, part, tint) {
  var route = maengTroughRoute(), all = built * (route.nearLong + route.farLong);
  if (part === "far") { linKham(pen, route.far, clamp((all - route.nearLong) / route.farLong), {size: 0.9, tint: tint}); }
  else { linKham(pen, route.near, clamp(all / route.nearLong), {size: 0.9, tint: tint}); }
}

// ---------- the narration ----------
// A scene names its lines as [from, to, id] on its own clock; the words are MAENG_WORDS (words.js). The line
// of second t, if there is one, is put under the picture: the Kam Mueang, and the English under it.
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
function fieldRow(r) {                             // a row of plots: its top and its depth, nearer rows deeper
  return [FIELD_TOP + r * 16 + r * r * 1.6, 16 + r * 4];
}
// Each plot: [row, from x, to x, kind]: "water" flooded and new-planted (the sky in it, rows of seedlings), "rice"
// green and grown, "mud" ploughed and wet. Laid out by hand, so the ploughing and the planting have their places.
var FIELD_PLOTS = [
  [0, 0, 420, "rice"], [0, 420, 900, "water"], [0, 900, 1500, "rice"], [0, 1500, 1920, "water"],
  [1, 0, 300, "water"], [1, 300, 760, "rice"], [1, 760, 1250, "mud"], [1, 1250, 1920, "rice"],
  [2, 0, 520, "rice"], [2, 520, 1100, "water"], [2, 1100, 1640, "rice"], [2, 1640, 1920, "water"],
  [3, 0, 380, "mud"], [3, 380, 980, "rice"], [3, 980, 1560, "water"], [3, 1560, 1920, "rice"],
  [4, 0, 700, "rice"], [4, 700, 1300, "rice"], [4, 1300, 1920, "water"],
  [5, 0, 1000, "rice"], [5, 1000, 1920, "rice"]
];
var FIELD_PLOUGH = [1, 780, 1230];                 // the row and the stretch the buffalo ploughs, back and forth
var FIELD_PLANTERS = [[3, 1060], [3, 1180], [3, 1320]];   // women planting rice in the flooded plot, bent over

function maengFields(brush) {
  var n, k;
  FIELD_PLOTS.forEach(function (p, i) {
    var row = fieldRow(p[0]), top = row[0], deep = row[1], x0 = p[1], x1 = p[2];
    if (p[3] === "water") {                         // the sky in the water, pale, a little rippled
      var w = brush.createLinearGradient(0, top, 0, top + deep);
      w.addColorStop(0, "#cfe3e6");
      w.addColorStop(1, "#9fc4c6");
      brush.fillStyle = w;
      brush.fillRect(x0, top, x1 - x0, deep + 2);
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

function maengFieldLife(t) {
  var row = fieldRow(FIELD_PLOUGH[0]), y = row[0] + row[1] - 2, span = FIELD_PLOUGH[2] - FIELD_PLOUGH[1];
  var lap = (t * 9) % (2 * span), going = lap < span, along = going ? lap : 2 * span - lap;
  var bx = FIELD_PLOUGH[1] + along, face = going ? 1 : -1;
  buffalo(bx, y, {size: 0.055, face: face, step: t * 1.4});   // the buffalo, at its slow walk
  var fx = bx - face * 18;                          // the plough behind it, and the farmer behind the plough
  pen.strokeStyle = "#5a3a22";
  pen.lineWidth = 1.6;
  pen.lineWidth = 1.1; pen.beginPath(); pen.moveTo(bx - face * 6, y - 9); pen.lineTo(fx + face * 3, y - 5); pen.lineTo(fx + face * 1, y); pen.stroke();
  person(fx - face * 3, y + 1, cast("farmer", {size: 0.085, face: face, id: "ploughman", step: t * 1.6, turban: null, hat: false, shirt: "#2f3a5a", legs: "#2f3a5a", sarong: undefined}));   // in indigo cotton (the research)
  [0, 1, 2].forEach(function (k) {                 // egrets after the plough, for what it turns up
    var ex = fx - face * (14 + k * 12 + 3 * Math.sin(t + k)), peck = 0.5 + 0.5 * Math.sin(t * 2.3 + k * 2);
    egret(ex, y + 1, t, {size: 0.086, peck: peck, face: face});   // northbirds.js
  });
  // and now and then one flies off, up and over to the nearer side of the picture, and out past its edge before the
  // cycle comes round (owner, 2026-10-21: "a bird flying into the sky just disappears. It should continue on to beyond
  // the edge of the screen"; it went 300 to one side and was simply not drawn once its 10 s were up)
  var cycle = t % 24;
  if (cycle > 14) {
    var u = (cycle - 14) / 10, start = fx - face * 14, way = start < WIDE / 2 ? -1 : 1;
    var reach = way < 0 ? start + 120 : WIDE - start + 120;
    egret(start + way * reach * u, y - 4 - 240 * u - 40 * Math.sin(u * 3), t, {size: (0.32 + 0.2 * u) / 2.8, fly: true, face: way, seed: 3});
  }
  FIELD_PLANTERS.forEach(function (w, k) {          // women planting rice, bent, stepping slowly back along the row
    var r = fieldRow(w[0]), px = w[1] - (t * 2) % 60;
    person(px, r[0] + r[1] - 1, cast("villager", {size: 0.095, face: -1, id: "planter" + k, bend: 0.7, bun: "low", lady: true, turban: null,
                                                  shirt: "#2f3a5a", legs: "#3a3a5a", reachA: [px + 8, r[0] + r[1] - 1], late: k * 0.3}));
  });
}
