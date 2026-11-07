// s01_marsh.js - scene 1 of the film of the White Eel: the Nong Lom marsh today, at dawn (30 s). Out of the dark, the
// wide still marsh under low green hills, the sun coming up behind them; mist lying on the water and lifting as the
// light comes; lotus and water lilies in clumps, beds of reeds; a herd of buffalo wading out from the left to graze, as
// the herds go out every morning (the research notes: "out in the morning, swimming back in the evening"); far off on
// the shore a herder's hut with a thread of smoke; an egret low across the water; the title in the mist; the camera
// pushing in, slowly. Owner, 2026-11-06: "Yes, build it" (the plan of seven steps).
var W01_LONG = 30.8;
// Its sounds (sounds.py, laid in by the film's music as a life's calls are: [second, sound, loudness], and a bed's
// length): frogs at first light, a buffalo's low call, a plover over the water.
var W01_SOUND = {calls: [[0, "frogs", 0.25, 16], [7.5, "buffalo", 0.3], [12.5, "plover", 0.2]]};
// The narration: [from, to, id] in the scene's own seconds. Placeholders from story.py's length until Pan's voice is
// recorded; the scene is timed again to her takes (docs/kit/films.md, step 4).
var W01_LINES = [[9.0, 16.88, "W001"], [17.08, 23.47, "W002"], [23.67, 29.31, "W003"]];

// The titles in the mist (as changngu/s01_mekong.js's): the series, Lanna Tales (นิทานล้านนา), in the Lanna script, as
// the first two films have it; then the tale's name, ตำนานปลาไหลเผือก, in the Lanna script, from the Kam Mueang
// alphabet's own reader (watdonchan HTML/kammuang_alphabet_assets/alphabet.js, KMA.lanna(), 2026-11-06), with its
// English small beneath; not yet checked by a reader of the script.
var W01_SERIES = "ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ";                     // นิทานล้านนา, Lanna Tales (the Maeng and Chang Ngu films' spelling)
var W01_STORY = "ᨲᩣᩴᨶᩣ᩠ᨶᨸᩖᩣᩉᩖᩱᨹᩮᩬᩥᨠ";                // ตำนานปลาไหลเผือก, the tale of the white eel

// The sun coming up behind the far hills (the marsh looks north, the sun on the right): its x, and the y it comes up
// from (behind the hills) to the y it reaches as the scene ends.
var W01_SUN = [1390, 520, 330];
// The herd: [x at second 0, feet y, size, seed]. They wade out to the right (W01_HERD_PACE pixels a second), the
// nearer ones larger; two of them graze as they go.
var W01_HERD = [[-60, 742, 0.36, 0], [150, 716, 0.3, 1], [-250, 770, 0.42, 2], [330, 702, 0.27, 3], [-420, 728, 0.33, 4]];
var W01_HERD_PACE = 14;
// The egret low across the water from the right, and how high over the water it flies (its reflection under it).
var W01_EGRET = {course: [[5.5, 2050, 640], [15.5, -150, 610]], high: 34, look: {fly: true, size: 0.75, seed: 3}};
// The herder's hut on the far shore, and its thread of smoke.
var W01_HUT = [1560, WEL_WATER + 8, 0.26];
// Lotus and water lilies, mid-water and near: [x, line, size, seed, colour]; reeds in beds: [x, base, size].
var W01_LOTUS = [[520, 690, 0.36, 3, "#ee7f9c"], [760, 676, 0.3, 5, "#f4ece6"], [1180, 700, 0.4, 7, "#ee7f9c"],
                 [1460, 684, 0.32, 9, "#f4ece6"], [1720, 712, 0.42, 11, "#ee7f9c"]];
var W01_LOTUS_NEAR = [[330, 1000, 0.95, 13, "#ee7f9c"], [1500, 1020, 1.05, 15, "#f4ece6"], [1080, 1060, 0.8, 17, "#ee7f9c"]];
var W01_REEDS = [[640, 668, 0.32], [700, 672, 0.28], [1010, 660, 0.3], [1270, 668, 0.34], [1610, 662, 0.3], [1880, 674, 0.36]];

// t: the scene's second (seen from 1.6 s to 8.2 s). Gives back nothing: it writes the titles with pen over the whole
// sheet, with no camera. e.g. w01Title(t);
function w01Title(t) {
  var series = between(t, 1.6, 2.8) * (1 - between(t, 7.2, 8.2)), story = between(t, 3.6, 4.8) * (1 - between(t, 7.2, 8.2));
  if (series <= 0) { return; }
  pen.save();
  pen.textAlign = "center";
  pen.shadowColor = "rgba(255, 196, 90, 0.7)";
  var gold = pen.createLinearGradient(0, 180, 0, 440);
  gold.addColorStop(0, "#fff1c0");
  gold.addColorStop(0.5, "#e8b84a");
  gold.addColorStop(1, "#b07a22");
  pen.fillStyle = gold;
  pen.globalAlpha = series;
  pen.shadowBlur = 22;
  pen.font = "700 92px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
  pen.fillText(W01_SERIES, WIDE / 2, 250);
  pen.shadowBlur = 8;
  pen.strokeStyle = "rgba(255, 230, 170, 0.8)";
  pen.lineWidth = 2;
  var reach = 260 * between(t, 2.2, 3.8);
  pen.beginPath();
  pen.moveTo(WIDE / 2 - reach, 312); pen.quadraticCurveTo(WIDE / 2, 322, WIDE / 2 + reach, 312);
  pen.stroke();
  if (story > 0) {
    pen.globalAlpha = story;
    pen.shadowBlur = 26;
    pen.font = "700 124px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
    pen.fillText(W01_STORY, WIDE / 2, 440);
    pen.shadowBlur = 0;
    pen.font = "italic 42px " + LETTERS_LATIN + ", 'Times New Roman', serif";
    pen.fillStyle = "#fff6dc";
    pen.fillText("The White Eel", WIDE / 2, 530);
  }
  pen.restore();
}

// The herd at second t, from the farthest to the nearest, wading (sets.js welAbove()). part "under": each whole,
// before the water's face; "over": each above its waterline, then the rings round its legs. Draws with pen.
function w01Herd(t, part) {
  W01_HERD.slice().sort(function (a, b) { return a[1] - b[1]; }).forEach(function (h) {
    var x = h[0] + W01_HERD_PACE * t, grazing = h[3] % 2 === 1, waterline = h[1] - 100 * h[2];
    if (x < -300 || x > WIDE + 300) { return; }
    var look = {size: h[2], face: 1, step: t * 0.45 + h[3] * 0.3,
                graze: grazing ? 0.5 + 0.5 * Math.sin(t * 0.5 + h[3]) : 0, colour: h[3] === 2 ? "#4c4d55" : "#55565f"};
    if (part === "under") { buffalo(x, h[1], look); return; }
    welAbove(waterline, function () { buffalo(x, h[1], look); });
    welWadeRings(x, waterline, 330 * h[2], t + h[3]);
  });
}

// Scene 1, the entry the film calls (SCENES): t, its own second, 0 to W01_LONG. Gives back nothing: it draws the whole
// sheet with pen and leaves it as it found it. From sets.js: welSky(), welClouds(), welFar(), welSmoke(), welMarshWater(),
// welAbove(), welWadeRings(). Its words are W01_LINES (W001 to W003), written under it by the page (welSubtitles).
// Its z plan: the sky, the sun, the hills and the shore, the water (lotus stems under its face), the mist, then on the
// water from the far side to the near: the reeds and lotus mid-water, the herd, the egret, the near lotus, the framing.
function welSceneMarsh(t) {
  var light = between(t, 0, W01_LONG), dawn = 1 - between(t, 4, W01_LONG - 2), push = between(t, 0, W01_LONG);
  var zoom = 1 + 0.06 * push * push * (3 - 2 * push);
  pen.save();
  pen.translate(960, 640); pen.scale(zoom, zoom); pen.translate(-960, -640);   // the camera pushing in, slowly
  pen.drawImage(welSky("sunrise"), 0, 0);
  pen.globalAlpha = 0.25 + 0.6 * light;
  pen.drawImage(welSky("day"), 0, 0);
  pen.globalAlpha = 1;
  welClouds(t + 30, "dawn", 1 - light);
  welClouds(t + 30, "day", light);
  scenerySun(t, W01_SUN[0], mix(W01_SUN[1], W01_SUN[2], light), 30, {glow: 10, colour: "255, 206, 150"});
  welFar(pen, WEL_WATER);                                 // the hills and the shore, in the dawn's light going as the day comes
  pen.globalAlpha = 1 - light;
  welFar(pen, WEL_WATER, "dawn");
  pen.globalAlpha = 1;
  welFlocks(t, [[-300, 230, 55], [2350, 170, -42]]);   // the day's first birds over the hills
  bdHut(pen, W01_HUT[0], W01_HUT[1], W01_HUT[2]);        // the herder's hut, its thread of smoke
  welSmoke(t, W01_HUT[0] + 10, W01_HUT[1] - 214 * W01_HUT[2] + 6, {rise: 200, lean: 70, wide: 30, alpha: 0.55, colour: "244, 242, 246", count: 22});
  var water = welMarshWater();
  sceneryWaterDepths(water);
  W01_LOTUS.concat(W01_LOTUS_NEAR).forEach(function (l) { sceneryLotus("under", l[0], l[1], 50 * l[2], l[2], l[3], l[4], t); });
  w01Herd(t, "under");                                    // the herd whole, so the water's face lies over their legs
  welFish(t, [["barb", 760, 905, 240, 0.8, 1], ["gourami", 1260, 965, 200, 0.9, 2], ["snakehead", 420, 1015, 170, 0.8, 3]]);
  sceneryWaterSurface(t, water, function () {             // the egret's reflection, under it
    var at = courseAt(t, W01_EGRET.course);
    if (!at.on) { return; }
    pen.save();
    pen.globalAlpha = 0.45;
    pen.translate(0, 2 * (at.y + W01_EGRET.high));
    pen.scale(1, -1);
    egret(at.x, at.y, t, Object.assign({}, W01_EGRET.look, {face: at.face}));
    pen.restore();
  });
  softMist(t, WEL_WATER + 30, 50, 0.5 * dawn, 21, "250, 232, 214");   // the dawn's mist on the marsh, lifting as the day comes
  natSteam(t, -100, WIDE + 100, WEL_WATER + 60, {count: 44, rise: 60, wide: 150, life: 9, lean: 90, alpha: 0.26 * dawn, flat: 0.22, patch: 0.85,
                                                 colour: "250, 236, 222", sun: W01_SUN[0], glow: 0.6, seed: 3});
  natSteam(t, -100, WIDE + 100, WEL_WATER + 170, {count: 56, rise: 90, wide: 120, life: 8, lean: 120, alpha: 0.3 * dawn, flat: 0.05, patch: 0.85,
                                                  colour: "250, 236, 222", sun: W01_SUN[0], glow: 0.6, seed: 5});
  natGlitter(t, W01_SUN[0], WEL_WATER, 1080, 0.8 * (0.5 + 0.5 * dawn), "255, 214, 160");   // the sun's path on the water
  W01_REEDS.forEach(function (r) { sceneryReeds(r[0], r[1], r[2], t, "back"); sceneryReeds(r[0], r[1], r[2], t, "front"); });
  W01_LOTUS.forEach(function (l) { sceneryLotus("over", l[0], l[1], 50 * l[2], l[2], l[3], l[4], t); });
  w01Herd(t, "over");
  var egretAt = courseAt(t, W01_EGRET.course);
  if (egretAt.on) { egret(egretAt.x, egretAt.y, t, Object.assign({}, W01_EGRET.look, {face: egretAt.face})); }
  W01_LOTUS_NEAR.forEach(function (l) { sceneryLotus("over", l[0], l[1], 50 * l[2], l[2], l[3], l[4], t); });
  welDragonflies(t, [["scarlet", [240, 760, 640, 860], 1, 1.8], ["glider", [1240, 740, 1680, 850], 2, 1.8]]);
  sceneryReeds(80, 1110, 1.5, t, "back"); sceneryReeds(80, 1110, 1.5, t, "front");   // reeds and soft grass framing the front
  sceneryReeds(1850, 1100, 1.35, t + 2, "back"); sceneryReeds(1850, 1100, 1.35, t + 2, "front");
  sceneryBeds(t, thkOnce("wel-marsh-frame", function () {
    return [{sprite: sceneryGrass(300, 18, 611), x: 30, y: 1110}, {sprite: sceneryGrass(260, 16, 617), x: WIDE - 40, y: 1110}];
  }), {blur: 5, sway: 0.4});
  sceneryAir(t, {butterfly: null, petals: null, light: [0.5, 4]});
  pen.restore();
  w01Title(t);
  welFadeIn(t, 2);
}
