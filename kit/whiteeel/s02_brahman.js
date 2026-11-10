// s02_brahman.js - scene 2 of the film of the White Eel: the Brahman (45 s). Long ago, at midday on the wide plain by
// the Kok: Prince Singhanavati walks in from the left at the head of his people, after months on the road; a Brahman
// in white comes along the bank from the right and stops before him; he points out over the land ("Build your city
// here"), lays a hand on his heart ("have a heart that loves people and animals"), and the prince makes him a wai; he
// bows, and walks away toward the reeds at the water, two of the prince's men after him; among the reeds he is gone,
// and a long ripple runs out across the river (the only sign of the naga he is: the chronicle, story.py).
var W02_LONG = 53.95;
var W02_SOUND = {calls: [[0, "wind", 0.1, 53.95], [7.31, "magpie", 0.2], [25.61, "plover", 0.18], [42.05, "magpie", 0.18]]};
var W02_LINES = [[1.0, 9.89, "W004"], [11.36, 17.25, "W005"], [20.74, 27.57, "W006"], [30.02, 37.19, "W007"], [42.05, 50.64, "W008"]];

var W02_GROUND = 850;                                  // where the prince stands
var W02_PRINCE_AT = 760;                               // his x when they stop
var W02_MEET = 1080;                                   // the Brahman's x when he stops before him
var W02_REEDS = [[1520, 742, 0.75], [1640, 736, 0.9], [1760, 744, 0.7], [1420, 748, 0.55]];
var W02_GONE = [1600, 745];                            // where he walks to among the reeds, and is gone
var W02_WAKE = 48.57;                                   // when the ripple sets out

// The prince's people: where each stands behind him when they stop ([x, y] of the feet).
function w02FolkAt(k) { return [W02_PRINCE_AT - 150 - k * 115, W02_GROUND - 18 + (k % 3) * 22]; }

// The party walking in: how far along, 0 to 1 (they walk 0.4 to 8.6 s and stop).
function w02Arrive(t) { return between(t, 0.4, 10.36); }

// The Brahman at second t: {x, y, face, size, step, alpha} of his walk in, his stand, and his walk away.
function w02Brahman(t) {
  var come = between(t, 11.16, 19.34), go = between(t, 43.63, 49.16), x, y;
  if (go <= 0) { x = mix(WIDE + 140, W02_MEET, come); y = W02_GROUND - 6; }
  else { x = mix(W02_MEET, W02_GONE[0], go); y = mix(W02_GROUND - 6, W02_GONE[1], go); }
  var size = mix(1, 0.72, go);                        // smaller as he goes back toward the water
  var moving = (come > 0 && come < 1) || (go > 0 && go < 1);
  var face = go > 0 ? 1 : t > 21.01 && t < 28.42 ? 1 : -1;   // he turns to point out over the land, and back
  return {x: x, y: y, face: face, size: size, step: moving ? t / BEAT * 0.9 : 0, alpha: 1 - between(t, 47.78, 49.16)};
}

// His staff stood in the ground before him, where his hand held it as he faced the prince (the kit's stick: about 52
// in front of his feet, its top at the height of his hand).
function w02Staff() {
  var x = W02_MEET - 52, foot = W02_GROUND + 2;
  pen.save();
  pen.strokeStyle = "#5a3a24";
  pen.lineWidth = 5.5;
  pen.lineCap = "round";
  pen.beginPath(); pen.moveTo(x, foot); pen.lineTo(x - 2, foot - 166); pen.stroke();
  pen.strokeStyle = "#7a5234";
  pen.lineWidth = 3.5;
  pen.beginPath(); pen.moveTo(x, foot); pen.lineTo(x - 2, foot - 166); pen.stroke();
  pen.restore();
}

// The ripple that runs out across the river after he is gone: a long V from a point moving right, and a pale shine
// under the water at its head, faint (never a tail or a head).
function w02Wake(t) {
  var u = t - W02_WAKE;
  if (u < 0) { return; }
  var hx = W02_GONE[0] + 40 + 150 * u, hy = 668 - 6 * u, fade = 1 - between(t, 52.45, 53.95), spread = Math.min(1, u / 2);
  pen.save();
  pen.globalAlpha = 0.6 * fade;
  pen.strokeStyle = "rgba(240, 248, 240, 0.9)";
  pen.lineWidth = 1.6;
  for (var side = -1; side <= 1; side += 2) {
    pen.beginPath();
    pen.moveTo(hx, hy);
    pen.quadraticCurveTo(hx - 140 * spread, hy + side * 10 * spread, hx - 320 * spread, hy + side * 22 * spread);
    pen.stroke();
  }
  var glow = pen.createRadialGradient(hx - 60, hy + 6, 4, hx - 60, hy + 6, 120);
  glow.addColorStop(0, "rgba(236, 244, 236, 0.35)");
  glow.addColorStop(1, "rgba(236, 244, 236, 0)");
  pen.fillStyle = glow;
  pen.beginPath();
  pen.ellipse(hx - 60, hy + 6, 120, 10, 0, 0, 7);
  pen.fill();
  pen.restore();
}

// Scene 2, the entry the film calls (SCENES): t, its own second, 0 to W02_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welClouds(), welFar(), welKokWater(), welPlain(), welPlainTrees(),
// welPerson() with WEL_PRINCE, WEL_FOLK, WEL_BRAHMAN, welTalk(), welFadeIn(). Its words are W02_LINES (W004 to W008).
// Its z plan: the sky, the hills and the far bank, the plain, the river and the ripple on it, the reeds' back, the trees,
// then by drawByZ the people by their feet with each clump of reeds' front (12 below its foot, so he is among them only
// at the water), the soft grass in front.
function welSceneBrahman(t) {
  var drift = between(t, 0, W02_LONG), pan = -40 * drift;   // the camera drifts a little with them
  pen.save();
  pen.translate(pan, 0);
  pen.drawImage(welSky("day"), -60, 0, WIDE + 120, 1080);
  welClouds(t + 60, "day");
  welFar(pen, WEL_KOK);
  welFlocks(t, [[-300, 200, 50]]);
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok);
  welFish(t, [["barb", 760, 676, 220, 0.6, 1], ["gourami", 1420, 690, 170, 0.6, 2]]);
  sceneryWaterSurface(t, kok);
  w02Wake(t);                                           // on the water: behind the reeds, the trees and the people (owner, 2026-11-10)
  welKingfisher(t, 1640, 540, {water: 664, face: -1, seed: 1, size: 0.5, once: 41.0});   // one fish, and away
  W02_REEDS.forEach(function (r) { sceneryReeds(r[0], r[1], r[2], t, "back"); });
  pen.drawImage(welPlainTrees(), 0, 0, WIDE, 1080);

  var arrive = w02Arrive(t), walking = arrive > 0 && arrive < 1, b = w02Brahman(t);
  var pointing = t > 21.28 && t < 28.42, onHeart = t > 30.38 && t < 39.45, bowing = between(t, 41.65, 42.45) * (1 - between(t, 43.24, 43.83));
  var wai = between(t, 34.55, 35.99) * (1 - between(t, 40.25, 41.05));
  var pointAt = [b.x + 200, b.y - 215];             // his free hand out over the plain, upriver                         // out over the plain, upriver
  var lookAt = t < 11.16 ? null : pointing ? [b.x + 500, 640] : t < 47.78 ? [b.x, b.y - 300] : [W02_GONE[0], W02_GONE[1] - 60];
  var sprites = [];
  var px = mix(-180, W02_PRINCE_AT, arrive);
  sprites.push({name: "prince", kind: "person", x: px, y: W02_GROUND, draw: function () {
    person(px, W02_GROUND, welPerson("noble", WEL_PRINCE, {id: "prince", face: 1, step: walking ? t / BEAT * 0.9 : 0,
      feel: pointing ? "awe" : t > 48.57 ? "surprised" : undefined, at: lookAt || undefined, wai: wai || undefined,
      bend: 0.12 * wai}));
  }});
  WEL_FOLK.forEach(function (f, k) {
    var end = w02FolkAt(k), x = mix(end[0] - 940, end[0], arrive), y = end[1];
    var follow = (k === 0 || k === 2) ? between(t, 35.6 + k * 0.3, 39.4) : 0;   // the two soldiers go after the Brahman, and stop
    if (follow > 0) { x = mix(end[0], W02_GONE[0] - 260 + k * 30, follow); y = mix(end[1], W02_GONE[1] + 40 + k * 8, follow); }
    var size = f[1].size * mix(1, 0.8, follow);
    sprites.push({name: "folk " + k, kind: "person", x: x, y: y, draw: function () {
      person(x, y, welPerson(f[0], f[1], {id: "folk" + k, size: size, face: 1,
        step: walking || (follow > 0 && follow < 1) ? t / BEAT * 0.9 + k : 0,
        feel: pointing ? "awe" : t > 48.77 ? "surprised" : undefined, at: lookAt || undefined}));
    }});
  });
  if (b.alpha > 0 && t > 11.16) {
    var planted = t > 20.74 && t < 43.63;                 // he stands his staff in the ground while he speaks, freeing his hands
    sprites.push({name: "brahman", kind: "person", x: b.x, y: b.y, draw: function () {
      pen.save();
      pen.globalAlpha = b.alpha;
      if (planted && b.face > 0) { w02Staff(); }        // behind him while he faces the land
      person(b.x, b.y, welPerson("elder", WEL_BRAHMAN, {id: "brahman", face: b.face, size: WEL_BRAHMAN.size * b.size, step: b.step,
        holding: planted ? null : "stick", mouth: welTalk(t, welSays(t, W02_LINES, ["W006", "W007"])),
        reachA: pointing ? [pointAt[0], pointAt[1], between(t, 21.28, 22.09)] : undefined,
        reachB: onHeart ? [b.x + 4 * b.face, b.y - 182 * b.size, between(t, 30.38, 31.47)] : undefined,
        wai: bowing || undefined, bend: 0.05 + 0.25 * bowing, at: t < 43.63 ? [px, W02_GROUND - 300] : undefined}));
      if (planted && b.face < 0) { w02Staff(); }        // before him while he faces the prince
      pen.restore();
    }});
  }
  W02_REEDS.forEach(function (r, k) {                   // each clump's front by its foot: he walks before them, then in among them
    sprites.push({name: "reeds " + k, kind: "person", x: r[0], y: r[1] + 12, draw: function () { sceneryReeds(r[0], r[1], r[2], t, "front"); }});
  });
  drawByZ(sprites);
  welDragonflies(t, [["marshhawk", [180, 700, 640, 800], 3, 1.2], ["scarlet", [1260, 720, 1760, 820], 4, 1.2]]);
  sceneryBeds(t, thkOnce("wel-plain-frame", function () {
    return [{sprite: sceneryGrass(300, 18, 621), x: 40, y: 1110}, {sprite: sceneryGrass(280, 16, 627), x: WIDE - 20, y: 1110}];
  }), {blur: 5, sway: 0.4});
  sceneryAir(t, {butterfly: null, petals: null, light: [0.4, 12]});
  pen.restore();
  welFadeIn(t, 1.5);
}
