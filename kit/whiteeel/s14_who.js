// s14_who.js - scene 14 of the film of the White Eel: who was he? (55 s). Back at the Nong Lom marsh of today, at sunset
// (scene 1's marsh, the evening's light): buffalo swimming home across the water, only their backs and heads showing;
// the herders' fires along the far shore, smoke going up; the little island in the marsh, Ko Mae Mai, the widow's
// island, with its temple and its shrine under trees. The water goes still, and in the last light on it a long pale
// shimmer passes under its face, as a cloud's reflection passes over it: perhaps the one, perhaps only the other.
// Fireflies come out as the light goes. Then Bua-kham, who tells the kit's tales, comes along the near shore, says what
// the tale teaches, and says goodbye with a wai, as the first two tales' goodbyes (maeng/s14, changngu/s25); into black.
var W14_LONG = 55;
var W14_SOUND = {calls: [[0, "frogs", 0.2, 55], [3.0, "buffalo", 0.25], [20.0, "egret", 0.12], [38.0, "crickets", 0.12, 17]]};
var W14_LINES = [[1.2, 10.7, "W053"], [11.0, 16.17, "W054"], [18.4, 23.95, "W055"], [25.0, 33.36, "W056"], [33.56, 37.58, "W057"], [38.4, 45.3, "W058"]];
var W14_SHORE = 900;                                   // the near shore, where Bua-kham comes
var W14_SUN = [520, 470, 640];                         // the sun going down: x, from y, to y
var W14_ISLAND = [1280, 640, 1];                       // Ko Mae Mai: its middle, its shore's y, size
var W14_FIRES = [[260, WEL_WATER + 4], [700, WEL_WATER + 6], [1760, WEL_WATER + 4]];
var W14_HERD = [[1440, 760, 0.42, 3], [1760, 792, 0.46, 5], [2080, 772, 0.4, 8]];   // [x at 0 s, waterline, size, seed]
var W14_SPEAKS = ["W058"];                            // Bua-kham says the moral herself
var W14_WAI = [47.6, 48.2, 52.0, 52.6];                // the hands come up, are joined, part, are down

// The island, painted once: a low mound with trees, a white and gold chedi among them and a small shrine on its posts.
var W14_ISLE = null;
function w14Island() {
  if (W14_ISLE) { return W14_ISLE; }
  var paper = document.createElement("canvas");
  paper.width = 700 * PIX;
  paper.height = 360 * PIX;
  var b = paper.getContext("2d"), keep = pen;
  b.scale(PIX, PIX);
  b.fillStyle = "#5e7a4a";                              // the mound
  b.beginPath(); b.moveTo(20, 340); b.quadraticCurveTo(350, 250, 680, 340); b.closePath(); b.fill();
  bdChedi(b, 330, 300, 0.42);
  bdHut(b, 480, 318, 0.32);                             // the shrine
  pen = b;
  [[150, 320, 160, 120, 811], [560, 322, 150, 110, 813], [250, 318, 120, 90, 815]].forEach(function (k) {
    thkPlace(natBush(k[2], k[3], k[4], THK_SHADE, [], PIX), k[0], k[1], 1, 0);
  });
  pen = keep;
  W14_ISLE = paper;
  return paper;
}

// A herder's fire on the far shore: a small glow and its smoke.
function w14Fire(t, x, y) {
  var g = pen.createRadialGradient(x, y - 4, 1, x, y - 4, 20);
  g.addColorStop(0, "rgba(255, 200, 110, " + (0.8 + 0.2 * Math.sin(t * 9 + x)).toFixed(3) + ")");
  g.addColorStop(1, "rgba(255, 200, 110, 0)");
  pen.fillStyle = g;
  pen.fillRect(x - 20, y - 24, 40, 40);
  welSmoke(t + x * 0.01, x, y - 8, {rise: 150, lean: 50, wide: 20, alpha: 0.4, colour: "230, 214, 220", count: 12});
}

// The herd swimming home, right to left: each buffalo drawn whole, so the water's face lies over it, and again above
// its waterline (part "under" or "over").
function w14Herd(t, part) {
  W14_HERD.forEach(function (h) {
    var x = h[0] - 22 * t, line = h[1] - 190 * h[2], look = {size: h[2], face: -1, step: t / BEAT * 0.5 + h[3], colour: "#3a3430"};
    if (part === "under") { buffalo(x, h[1], look); return; }
    welAbove(line, function () { buffalo(x, h[1], look); });
    welWadeRings(x, line, 170 * h[2], t + h[3]);
  });
}

// Scene 14, the entry the film calls (SCENES): t, its own second, 0 to W14_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welClouds(), welFar(), welLake(), WEL_WATER, welAbove(), welWadeRings(),
// welSmoke(), welTalk(), welPerson(); from backdrops.js bdChedi(), bdHut(); from beasts.js buffalo(). Its words are
// W14_LINES (W053 to W058).
function welSceneWho(t) {
  var dusk = between(t, 0, 44), night = between(t, 40, W14_LONG);
  pen.drawImage(welSky("sunset"), -200, 0, WIDE + 400, 1080);
  welClouds(t + 300, "dusk");
  scenerySun(t, W14_SUN[0], mix(W14_SUN[1], W14_SUN[2], dusk), 34, {glow: 12, colour: "255, 170, 110"});
  welFar(pen, WEL_WATER, "dusk");
  welFlocks(t, [[2300, 200, -55], [2700, 150, -50]]);   // home to roost
  welEgretsFlying(t, [[2100, 470, -60, 0.5, 4], [2200, 500, -60, 0.45, 6], [2290, 455, -60, 0.45, 8]]);
  var lake = welLake(W14_SHORE);
  sceneryMeadow(pen, -40, WIDE + 40, W14_SHORE - 30, 1080, {seed: 31});
  sceneryWaterDepths(lake);
  pen.drawImage(w14Island(), W14_ISLAND[0] - 350, W14_ISLAND[1] - 330, 700, 360);
  w14Herd(t, "under");
  welFish(t, [["barb", 600, 900, 220, 0.8, 10], ["gourami", 1250, 940, 200, 0.9, 11]]);
  var shimmer = between(t, 25.4, 27.0) * (1 - between(t, 30.0, 31.8)), sx = mix(1700, 400, between(t, 25.4, 31.8));
  sceneryWaterSurface(t, lake, function () {
    if (shimmer > 0) {                                  // the long pale shimmer under the water's face
      var g = pen.createRadialGradient(sx, 760, 6, sx, 760, 300);
      g.addColorStop(0, "rgba(250, 240, 236, " + (0.5 * shimmer).toFixed(3) + ")");
      g.addColorStop(1, "rgba(250, 240, 236, 0)");
      pen.save(); pen.fillStyle = g; pen.translate(sx, 760); pen.scale(1, 0.08); pen.translate(-sx, -760);
      pen.beginPath(); pen.arc(sx, 760, 300, 0, 7); pen.fill(); pen.restore();
    }
  });
  pen.drawImage(w14Island(), W14_ISLAND[0] - 350, W14_ISLAND[1] - 330, 700, 360);   // the island over the water
  natGlitter(t, W14_SUN[0], WEL_WATER, W14_SHORE, 0.8, "255, 190, 130");   // the sun's shine on the water's face: under the herd's backs (the owner, 2026-11-07)
  W14_FIRES.forEach(function (f) { w14Fire(t, f[0], f[1]); });   // the far shore's fires, behind the herd
  w14Herd(t, "over");
  if (night > 0) { pen.fillStyle = "rgba(30, 20, 50, " + (0.4 * night).toFixed(3) + ")"; pen.fillRect(0, 0, WIDE, 1080); }
  if (t > 38) { sceneryFireflies(t, {far: [[[0, WEL_WATER, WIDE, W14_SHORE], 50, 7]], near: Math.round(12 * between(t, 38, 46))}); }
  if (t > 36) {                                         // Bua-kham on the near shore: the moral, and her wai goodbye
    var come = between(t, 36.2, 38.8), x = mix(WIDE + 140, 1660, come), w = W14_WAI;   // in from the right, clear of the words
    var up = between(t, w[0], w[1]) * (1 - between(t, w[2], w[3]));
    person(x, W14_SHORE + 90, welPerson("buakham", {size: 1.05}, {id: "buakham", face: -1, step: come > 0 && come < 1 ? t / BEAT * 0.9 : 0,
      feel: "happy", mouth: welTalk(t, welSays(t, W14_LINES, W14_SPEAKS)), wai: up || undefined, bend: 0.12 * up}));
  }
  sceneryReeds(80, 1110, 1.5, t, "back"); sceneryReeds(80, 1110, 1.5, t, "front");
  if (t < 40) { welDragonflies(t, [["glider", [120, 760, 520, 860], 10, 1.8]]); }
  sceneryReeds(1850, 1100, 1.35, t + 2, "back"); sceneryReeds(1850, 1100, 1.35, t + 2, "front");
  pen.fillStyle = "rgba(0, 0, 0, " + between(t, 53.2, 55).toFixed(3) + ")";   // into black
  pen.fillRect(0, 0, WIDE, 1080);
  welFadeIn(t, 1.5);
}
