// s05_climb.js - scene 5 of the film of the creature with four ears and five eyes: up the mountain (45 s).
// Dusk. Thukkhata, older, climbs the path up Doi Khao Khwai, pulling a rope behind him; it runs back out of
// sight behind the rock at the foot of the path, and nothing of what it pulls is shown. At the cave's mouth the
// rope catches and will not come. He lets it go, sets his snare there as his father asked, and goes home.
var S05_LONG = 49.71;   // 45 until 2026-10-24: 0.79 s inserted for the narrator's own reading of M024 (scene_retime.py)
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets of dusk on the mountain.
var S05_SOUND = {calls: [[0, "crickets", 0.3, 49.71]]};
var S05_LINES = [[3.0, 8.53, "M024"], [8.79, 14.48, "M025"], [23.9, 29.95, "M026"], [34.54, 40.37, "M027"]];
var S05_TOP = MAENG_SLOPE_CAVE[0] - 140;            // where he stops, below the cave's ledge
var S05_SNARE = [MAENG_SLOPE_CAVE[0] - 60, MAENG_SLOPE_CAVE[1] + 8];
var S05_CLOUDS = {count: 5, lit: "#f6b07a", shade: "#9a5a6a", below: true};
var S05_BEHIND = MAENG_CAVE_BEHIND, S05_BEFORE = MAENG_CAVE_BEFORE;   // the cave's bushes, the same in every scene (sets.js)

// list: S05_BEHIND or S05_BEFORE, each [x and y from MAENG_SLOPE_CAVE, radius] at size 1; size: how much larger;
// seed: picks their greens; tint: [colour, 0 to 1] (MAENG_DUSK). Gives back nothing: it draws with pen.
// e.g. s05Crowns(S05_BEHIND, MAENG_SLOPE_CAVE[2] * 1.6, 3, MAENG_DUSK);
function s05Crowns(list, size, seed, tint) {          // the forest's own crowns over and beside the cave, at its size
  maengCaveBushes(list, size, seed, tint);           // painted bushes, as the slope's (sets.js)
}

// Its life: a band of mist drifting across the slope at dusk, below the cave; and a great hornbill crossing the
// sky on its slow heavy wings, in the quiet between "pulling the rope behind him" (M025) and the rope catching (M026).
var S05_LIFE = [
  {name: "great hornbill", kind: "hornbill", z: "sky", look: {size: 0.5}, course: [[16, 2150, 230], [23.4, -260, 150]]},
  // egrets flying home to their roost at dusk, a loose line high over the slope after the hornbill has gone (the beauty
  // pass, owner, 2026-10-27; true of the cold season's evenings: nature_research.md)
  {name: "egret home 1", kind: "egret", z: "sky", look: {size: 0.2, fly: true, seed: 0}, course: [[25.0, 2080, 210], [41.0, -140, 170]]},
  {name: "egret home 2", kind: "egret", z: "sky", look: {size: 0.2, fly: true, seed: 1}, course: [[25.7, 2080, 242], [41.7, -140, 202]]},
  {name: "egret home 3", kind: "egret", z: "sky", look: {size: 0.2, fly: true, seed: 2}, course: [[26.4, 2080, 222], [42.4, -140, 182]]},
  {name: "egret home 4", kind: "egret", z: "sky", look: {size: 0.2, fly: true, seed: 3}, course: [[27.1, 2080, 254], [43.1, -140, 214]]},
  {name: "egret home 5", kind: "egret", z: "sky", look: {size: 0.2, fly: true, seed: 4}, course: [[27.8, 2080, 234], [43.8, -140, 194]]},
  // the creature, unseen in its cave, howls once as the snare is set and dusk comes on (sounds.py, maeng-base)
  {name: "the creature's howl", kind: "flock", z: "sky", course: [[0, -999, -999], [0.1, -999, -999]],
   calls: [[42.71, "maeng-base", 0.87]]}
];

// Scene 5, the entry the film calls (SCENES): t, its own second, 0 to S05_LONG (45 s): he climbs to 21 s, the rope
// catches to 27 s, he sets the snare 29 s to 33 s, and goes down from 38 s; out of black over 2 s, into it from 43 s.
// Gives back nothing: it draws the whole sheet with pen. From sets.js: maengSlope() (its dusk sheets), maengSky("dusk"),
// MAENG_SLOPE_CAVE, MAENG_DUSK, maengTrail(), maengPerson() with MAENG_LAD. Its life is S05_LIFE; its words
// S05_LINES (M024 to M027), written under it by the page.
// Its z plan (oldcartoon.js, Z): the sky, the slope and the mist as painted first; then by drawByZ the hornbill in
// "sky", in "set" the crowns behind the cave, the cave's mouth and the crowns before it (in that order), and in
// "people" by their feet the snare and the lad (his rope with him); last, as painted, the rock before it all, which
// the rope goes behind. e.g. sceneClimb(30);
function sceneClimb(t) {
  var slope = maengSlope(), tint = MAENG_DUSK, size = MAENG_SLOPE_CAVE[2];
  pen.drawImage(maengSky("dusk"), 0, 0);
  maengClouds(t + 70, "dusk");
  pen.drawImage(slope.backDusk, 0, 0);
  pen.drawImage(slope.frontDusk, 0, 0);             // the path, under the cave's ledge
  mistDrift(pen, t, {left: 0, right: WIDE, top: 640, bottom: 790, count: 5, wide: 520, drift: 8, seed: 31, colour: "#eadcea",
                     glow: "#f2b8a0", alpha: 0.55});   // dusk mist across the slope, below the cave
  var sprites = lifeSprites(t, S05_LIFE).concat([
    {name: "crowns behind", kind: "trees", z: "set", draw: function () { s05Crowns(S05_BEHIND, size * 1.6, 3, tint); }},
    {name: "cave", kind: "cave", z: "set", draw: function () {
      sceneryCave(pen, MAENG_SLOPE_CAVE[0], MAENG_SLOPE_CAVE[1], size, {t: t, rock: "#5f574f", tint: tint});
    }},
    {name: "crowns before", kind: "trees", z: "set", draw: function () { s05Crowns(S05_BEFORE, size * 1.6, 9, tint); }}
  ]);
  var set = between(t, 31.54, 36.21);                     // the snare: he bends the pole down and sets it
  if (t > 31.04) {
    sprites.push({name: "snare", kind: "snare", x: S05_SNARE[0], y: S05_SNARE[1], draw: function () {
      snare(pen, S05_SNARE[0], S05_SNARE[1], 0.62, {sprung: 1 - set, t: t, tint: tint});
    }});
  }
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad", feel: t < 23.4 ? "concerned" : t < 29.54 ? "surprised" : "concerned"});
  var go, x, ground, roping = t < 29.54;
  if (t < 23.4) {                                     // up the path, leaning into the pull
    go = stroll(t, 110, S05_TOP, 2, Object.assign(lad, {stride: 0.62}));   // slow, up the hill
    lad = Object.assign(go.look, {bend: 0.16});
  } else if (t < 42.71) {                              // at the top: the rope will not come; then the snare
    go = {x: S05_TOP, look: lad};
    if (t < 29.54) {
      var tug = Math.max(0, Math.sin((t - 23.4) * 3.2));
      lad = Object.assign(lad, {face: -1, bend: -0.12 * tug});
    } else {                                        // down to the snare, and up again: each eased over half a second (poseSteps;
      lad = Object.assign(lad, {face: 1}, poseSteps(t, [   // he once stood up in one frame, a pop: checks/pop_check.py)
        [0, {}], [29.54, {sit: 1, bend: 0.7, reachA: [S05_SNARE[0] - 10, S05_SNARE[1] - 30]}], [37.87, {smile: 0.2}]], 0.5));
    }
  } else {                                          // home again, down the path
    go = stroll(t, S05_TOP, -200, 42.71, lad);
    lad = go.look;
  }
  x = go.x;
  ground = maengTrail(x) + 8;
  sprites.push({name: "lad", kind: "person", x: x, y: ground, draw: function () { s05Lad(t, x, ground, lad, roping, tint); }});
  // a small bush before his hand where he bends to the snare, so the hand that does not grip is not seen, the snare's
  // bent pole and its noose left clear to the right of it (owner, 2026-10-26: "Add a small bush so it hides the boy's
  // hand when bending down ... but leave enough room to see the snare"); before him, by its foot
  sprites.push({name: "bush at the snare", kind: "bush", x: S05_SNARE[0] - 30, y: ground + 34, draw: function () {
    maengSnareBush(tint);                           // (sets.js) its foot down on the slope below the ledge
  }});
  drawByZ(sprites);
  pen.drawImage(slope.foreDusk, 0, 0);              // the rock before it all: the rope goes behind it
  var dark = Math.max(1 - between(t, 0, 2), between(t, 47.71, 49.71));
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}

// The lad at (x, ground) with his look; roping: the rope from his back hand, down the path behind him, out of sight
// behind the rock (it catches at 21 s); tint: the dusk's. Gives back nothing: it draws with pen.
// e.g. s05Lad(10, 400, 900, cast("boy"), true, MAENG_DUSK);
function s05Lad(t, x, ground, lad, roping, tint) {
  if (roping) {
    lad.reachB = [x - 120 * (lad.face || 1), ground - 70];
    var joints = person(x, ground, lad), end = pen.getTransform().transformPoint(new DOMPoint(210, 960));   // behind the rock
    pen.save();
    pen.setTransform(1, 0, 0, 1, 0, 0);             // the joints are in the film's own pixels
    // A cord of twisted rattan, as the snare's (owner, 2026-10-23: "Change the rope he pulls up the hill ... to look
    // more like the snare rope"; it was a pale line)
    var tight = t > 23.4 ? 0.15 : 0.6;                // pulled taut when it catches
    var a = joints.wristB, c = [(a[0] + end.x) / 2, Math.max(a[1], end.y) + 40 * PIX * tight], rope = [];
    for (var k = 0; k <= 24; k++) {
      var u = k / 24, v = 1 - u;
      rope.push([v * v * a[0] + 2 * v * u * c[0] + u * u * end.x, v * v * a[1] + 2 * v * u * c[1] + u * u * end.y]);
    }
    cord(pen, rope, 4.2 * PIX, blend("#7a5a2e", tint[0], tint[1] * 0.6));
    pen.restore();
  } else {
    person(x, ground, lad);
  }
}
