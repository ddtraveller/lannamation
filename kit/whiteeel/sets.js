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

// ---------- the narration ----------
// The words under the picture: t, the scene's second; lines, its WNN_LINES ([from, to, id]). Writes the line being
// said (WHITEEEL_WORDS[id]: its Kam Mueang, then its English). e.g. welSubtitles(t, W01_LINES);
function welSubtitles(t, lines) {
  lines.forEach(function (line) {
    if (t >= line[0] && t < line[1]) { subtitle(WHITEEEL_WORDS[line[2]][1], WHITEEEL_WORDS[line[2]][2]); }
  });
}

// A scene's first seconds out of the dark (the film page's own cuts fade through black). e.g. welFadeIn(t, 2);
function welFadeIn(t, seconds) {
  if (t < seconds) {
    pen.fillStyle = "rgba(0, 0, 0, " + (1 - t / seconds).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
