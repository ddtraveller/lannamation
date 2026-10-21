// s05_climb.js - scene 5 of the film of the creature with four ears and five eyes: up the mountain (45 s).
// Dusk. Thukkhata, older, climbs the path up Doi Khao Khwai, pulling a rope behind him; it runs back out of
// sight behind the rock at the foot of the path, and nothing of what it pulls is shown. At the cave's mouth the
// rope catches and will not come. He lets it go, sets his snare there as his father asked, and goes home.
var S05_LONG = 45;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets of dusk on the mountain.
var S05_SOUND = {calls: [[0, "crickets", 0.3, 45]]};
var S05_LINES = [[3.0, 6.68, "M024"], [8.0, 13.0, "M025"], [21.5, 27.44, "M026"], [32.0, 36.82, "M027"]];
var S05_TOP = MAENG_SLOPE_CAVE[0] - 140;            // where he stops, below the cave's ledge
var S05_SNARE = [MAENG_SLOPE_CAVE[0] - 60, MAENG_SLOPE_CAVE[1] + 8];
var S05_CLOUDS = {count: 5, lit: "#f6b07a", shade: "#9a5a6a", below: true};
var S05_BEHIND = [[-86, -58, 13], [-64, -82, 14], [-36, -92, 13], [-6, -96, 14], [24, -94, 13], [52, -88, 14], [80, -70, 13], [94, -40, 12]];
var S05_BEFORE = [[-80, 10, 12], [-52, 14, 13], [74, 12, 12], [96, 4, 11]];

// list: S05_BEHIND or S05_BEFORE, each [x and y from MAENG_SLOPE_CAVE, radius] at size 1; size: how much larger;
// seed: picks their greens; tint: [colour, 0 to 1] (MAENG_DUSK). Gives back nothing: it draws with pen.
// e.g. s05Crowns(S05_BEHIND, MAENG_SLOPE_CAVE[2] * 1.6, 3, MAENG_DUSK);
function s05Crowns(list, size, seed, tint) {          // the forest's own crowns over and beside the cave, at its size
  list.forEach(function (c, n) {
    var green = blend(blend(FOREST_GREENS[(n + seed) % FOREST_GREENS.length], "#79ad84", 0.05), tint[0], tint[1]);
    crown(pen, MAENG_SLOPE_CAVE[0] + c[0] * size, MAENG_SLOPE_CAVE[1] + c[1] * size, c[2] * size, green, seed + n);
  });
}

// Its life: a band of mist drifting across the slope at dusk, below the cave; and a great hornbill crossing the
// sky on its slow heavy wings, in the quiet between "pulling the rope behind him" (M025) and the rope catching (M026).
var S05_LIFE = [
  {name: "great hornbill", kind: "hornbill", layer: "back", look: {size: 0.5}, course: [[13.6, 2150, 230], [21.0, -260, 150]]},
  // the creature, unseen in its cave, howls once as the snare is set and dusk comes on (sounds.py, maeng-base)
  {name: "the creature's howl", kind: "flock", layer: "back", course: [[0, -999, -999], [0.1, -999, -999]],
   calls: [[38.0, "maeng-base", 0.87]]}
];

// Scene 5, the entry the film calls (SCENES): t, its own second, 0 to S05_LONG (45 s): he climbs to 21 s, the rope
// catches to 27 s, he sets the snare 29 s to 33 s, and goes down from 38 s; out of black over 2 s, into it from 43 s.
// Gives back nothing: it draws the whole sheet with pen. From sets.js: maengSlope() (its dusk sheets), maengSky("dusk"),
// MAENG_SLOPE_CAVE, MAENG_DUSK, maengTrail(), maengPerson() with MAENG_LAD. Its life is S05_LIFE; its words
// S05_LINES (M024 to M027), written under it by the page. e.g. sceneClimb(30);
function sceneClimb(t) {
  var slope = maengSlope(), tint = MAENG_DUSK, size = MAENG_SLOPE_CAVE[2];
  pen.drawImage(maengSky("dusk"), 0, 0);
  cumulus(pen, t + 70, S05_CLOUDS);
  pen.drawImage(slope.backDusk, 0, 0);
  pen.drawImage(slope.frontDusk, 0, 0);             // the path, under the cave's ledge
  mistDrift(pen, t, {left: 0, right: WIDE, top: 640, bottom: 790, count: 5, wide: 520, drift: 8, seed: 31, colour: "#eadcea",
                     glow: "#f2b8a0", alpha: 0.55});   // dusk mist across the slope, below the cave
  decorate(t, S05_LIFE, "back");
  s05Crowns(S05_BEHIND, size * 1.6, 3, tint);
  caveMouth(pen, MAENG_SLOPE_CAVE[0], MAENG_SLOPE_CAVE[1], size, {t: t, rock: "#5f574f", tint: tint});
  s05Crowns(S05_BEFORE, size * 1.6, 9, tint);
  var set = between(t, 29, 33);                     // the snare: he bends the pole down and sets it
  if (t > 28.5) { snare(pen, S05_SNARE[0], S05_SNARE[1], 0.62, {sprung: 1 - set, t: t, tint: tint}); }
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad", feel: t < 21 ? "concerned" : t < 27 ? "surprised" : "concerned"});
  var go, x, ground, roping = t < 27;
  if (t < 21) {                                     // up the path, leaning into the pull
    go = stroll(t, 110, S05_TOP, 2, Object.assign(lad, {stride: 0.62}));   // slow, up the hill
    lad = Object.assign(go.look, {bend: 0.16});
  } else if (t < 38) {                              // at the top: the rope will not come; then the snare
    go = {x: S05_TOP, look: lad};
    if (t < 27) {
      var tug = Math.max(0, Math.sin((t - 21) * 3.2));
      lad = Object.assign(lad, {face: -1, bend: -0.12 * tug});
    } else if (t < 34) {
      lad = Object.assign(lad, {face: 1, sit: 1, bend: 0.7, reachA: [S05_SNARE[0] - 10, S05_SNARE[1] - 30]});
    } else {
      lad = Object.assign(lad, {face: 1, smile: 0.2});
    }
  } else {                                          // home again, down the path
    go = stroll(t, S05_TOP, -200, 38, lad);
    lad = go.look;
  }
  x = go.x;
  ground = maengTrail(x) + 8;
  if (roping) {                                     // the rope from his back hand, down the path behind him, out of sight behind the rock
    lad.reachB = [x - 120 * (lad.face || 1), ground - 70];
    var joints = person(x, ground, lad), end = pen.getTransform().transformPoint(new DOMPoint(210, 960));   // behind the rock
    pen.save();
    pen.setTransform(1, 0, 0, 1, 0, 0);             // the joints are in the film's own pixels
    pen.strokeStyle = blend("#e2c896", tint[0], tint[1] * 0.6);
    pen.lineWidth = 4.2 * PIX;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(joints.wristB[0], joints.wristB[1]);
    var tight = t > 21 ? 0.15 : 0.6;                // pulled taut when it catches
    pen.quadraticCurveTo((joints.wristB[0] + end.x) / 2, Math.max(joints.wristB[1], end.y) + 40 * PIX * tight, end.x, end.y);
    pen.stroke();
    pen.restore();
  } else {
    person(x, ground, lad);
  }
  pen.drawImage(slope.foreDusk, 0, 0);              // the rock before it all: the rope goes behind it
  var dark = Math.max(1 - between(t, 0, 2), between(t, 43, 45));
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
