// s06_creature.js - scene 6 of the film of the creature with four ears and five eyes: the creature (60 s).
// Two days later, by day, close to the cave. Thukkhata climbs back up the path: the snare has sprung and holds
// something by the foot, behind the bushes at the cave's mouth. It comes out into the light: short, fat, in
// long dark fur like a bear; four ears; and its eyes open one after another, five. It is afraid, and so is he
// for a moment; he wonders if it is his father, come back; he ties a vine round its neck, gently, and it
// follows him home.
var S06_LONG = 60;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the forest's cicadas by day at the cave.
var S06_SOUND = {calls: [[0, "cicadas", 0.6, 60]]};
var S06_LINES = [[1.5, 6.1, "M028"], [6.2, 8.5, "M029"], [10.5, 17.28, "M030"], [17.48, 19.54, "M031"], [19.74, 22.34, "M032"],
                 [24.0, 28.6, "M033"], [32.0, 37.7, "M034"], [44.0, 48.1, "M035"]];
var S06_NEAR = 1.55;                                // the camera's nearness to the cave: the set is seen this much larger
var S06_SPOT = [MAENG_SLOPE_CAVE[0] - 20, MAENG_SLOPE_CAVE[1] + 14];   // where the creature stands, at the cave's mouth
var S06_SNARE = [MAENG_SLOPE_CAVE[0] - 60, MAENG_SLOPE_CAVE[1] + 8];
var S06_VINE = 250;                                 // how far behind him it walks home, on the vine (from where they stood, 190): the vine short, and seen
var S06_BEHIND = [[-86, -58, 13], [-64, -82, 14], [-36, -92, 13], [-6, -96, 14], [24, -94, 13], [52, -88, 14], [80, -70, 13], [94, -40, 12]];
var S06_BEFORE = [[-80, 10, 12], [-52, 14, 13], [74, 12, 12], [96, 4, 11]];

// list: S06_BEHIND or S06_BEFORE, as s05Crowns() takes; size, seed as there; shake: pixels they sway by the kit's
// clock, 0 for still. Gives back nothing: it draws with pen. e.g. s06Crowns(S06_BEFORE, MAENG_SLOPE_CAVE[2] * 1.6, 9, 3);
function s06Crowns(list, size, seed, shake) {        // the forest's own crowns over and beside the cave; the near ones shake while it struggles
  list.forEach(function (c, n) {
    var green = blend(FOREST_GREENS[(n + seed) % FOREST_GREENS.length], "#79ad84", 0.05);
    crown(pen, MAENG_SLOPE_CAVE[0] + c[0] * size + shake * Math.sin(clock * 31 + n), MAENG_SLOPE_CAVE[1] + c[1] * size, c[2] * size, green, seed + n);
  });
}

// Its life: morning mist on the slope, thinning as he climbs; and once all is calm, as he wonders if it is his
// father (M033) and ties the vine (M034), a green-tailed sunbird hovering at the ferns over the cave's mouth.
var S06_LIFE = [
  {name: "sunbird", kind: "sunbird", z: "set", look: {size: 1.0},     // at the ferns of the slope: of the set
   course: [[22.0, 1720, 300], [24.0, 1310, 470, "sip"], [29.0, 1310, 470], [31.5, 1680, 260]]},
  // its roar as it tugs at the snare (sounds.py, maeng-angry)
  {name: "the creature's roar", kind: "flock", z: "sky", course: [[0, -999, -999], [0.1, -999, -999]],
   calls: [[5.3, "maeng-angry", 3.7]]}
];

// Scene 6, the entry the film calls (SCENES): t, its own second, 0 to S06_LONG (60 s): he climbs to the snare, the
// creature tugs (5.2 s to 9.5 s) and comes out (to 12.5 s), its eyes open from 19.5 s, he ties the vine at about 34 s,
// and from 39.5 s it follows him down; out of black over 1.5 s, into it from 56 s. Gives back nothing: it draws the
// whole sheet with pen, under a camera S06_NEAR times near. From sets.js: maengSlope(), maengSky("day"),
// MAENG_SLOPE_CAVE, maengTrail(), maengAt(), maengPerson() with MAENG_LAD. Its life is S06_LIFE; its words
// S06_LINES (M028 to M035), written under it by the page.
// Its z plan (oldcartoon.js, Z): the sky, the slope, the mist, the crowns behind the cave and its mouth as painted
// first; then by drawByZ the sunbird in "set" (at the ferns), and in "people" by their feet: the creature with the
// snare on its paw (one sprite: the snare holds the paw it is drawn with), the crowns before the cave just in front of
// where it stands at the mouth, the lad, and the vine just in front of the nearest of them (it runs from his hand to
// its neck, over both); last, as painted, the slope's foreground. e.g. sceneCreature(20);
function sceneCreature(t) {
  var slope = maengSlope(), size = MAENG_SLOPE_CAVE[2];
  pen.save();                                       // close to the cave: everything seen S06_NEAR times larger about it
  pen.translate(WIDE / 2 + 80, 600);
  pen.scale(S06_NEAR, S06_NEAR);
  pen.translate(-MAENG_SLOPE_CAVE[0] + 60, -MAENG_SLOPE_CAVE[1] + 20);
  pen.drawImage(maengSky("day"), -400, -300, WIDE + 800, 1080 + 600);
  pen.drawImage(slope.back, 0, 0);
  pen.drawImage(slope.front, 0, 0);
  var mist = 1 - between(t, 0, 12);                 // the morning's mist, thinning as he climbs
  if (mist > 0) { mistDrift(pen, t, {left: -200, right: WIDE + 200, top: 560, bottom: 780, count: 5, wide: 520, drift: 7, seed: 33, alpha: 0.6 * mist}); }
  var struggle = t > 5.2 && t < 9.5 ? 1 : 0;        // something tugs at the snare
  s06Crowns(S06_BEHIND, size * 1.6, 3, 0);
  caveMouth(pen, MAENG_SLOPE_CAVE[0], MAENG_SLOPE_CAVE[1], size, {t: t, rock: "#5f574f"});
  // The creature: hidden in the cave's dark at first (only its pull on the snare shows), then out into the
  // light; its four ears first, then its eyes opening one after another; afraid, then calm, then it follows.
  var out = between(t, 9.5, 12.5), wake = t < 17.5 ? 0 : Math.min(5, (t - 19.5) / 0.45 + 1), leave = t > 37;
  var feel = t < 22 ? "fear" : t < 30 ? "concerned" : "neutral";
  var where = [mix(S06_SPOT[0] + 40, S06_SPOT[0] - 40, out), S06_SPOT[1]], step;
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad"}), x;
  if (leave) {                                      // following him down the path, on the vine, a short vine's length behind him
    // (owner, 2026-10-20: "The vine becomes very long. Have the boy stay closer to the monster as they walk away": the
    // two had walked off each at its own pace and the gap grew). Its steps are the ground it has covered, as amble's are.
    var off = S06_SPOT[0] - 40, ahead = stroll(t, S06_SPOT[0] - 230, S06_SPOT[0] - 1300, 39.5, lad).x;
    var gait = GAITS.maengSiHuHaTa, pace = gait[1] / 0.62 * gait[0] * 0.5;
    var behind = Math.min(off, ahead + mix(190, S06_VINE, between(t, 39.5, 41.5)));
    where = [behind, maengTrail(behind) + 8];
    step = off - behind > 0.5 ? (off - behind) / pace : undefined;
  }
  var beast, joints, crowns = S06_SPOT[1] + 1;      // the crowns before the cave: just in front of its mouth
  var sprites = lifeSprites(t, S06_LIFE).concat([
    {name: "creature", kind: "maengSiHuHaTa", x: where[0], y: where[1], draw: function () {
      beast = maengSiHuHaTa(where[0], where[1], {size: 0.5, face: -1, feel: feel, wake: t < 17.5 ? 0 : wake,
                                                 step: step !== undefined ? step : (t > 9.5 && t < 12.5 ? (t - 9.5) * 1.2 : undefined)});
      snare(pen, S06_SNARE[0], S06_SNARE[1], 0.62, {sprung: 1, t: t, caught: t < 34 ? beast.shin : null});   // tight round its shin
    }},
    {name: "crowns before", kind: "trees", x: MAENG_SLOPE_CAVE[0], y: crowns, draw: function () {
      s06Crowns(S06_BEFORE, size * 1.6, 9, struggle * 3);
    }}
  ]);
  // Thukkhata: up the path into view, then still before it; he ties the vine, and leads it home.
  if (t < 30) {
    var come = stroll(t, S06_SPOT[0] - 700, S06_SPOT[0] - 230, 0.5, lad);
    x = come.x;
    lad = Object.assign(come.look, {feel: t < 9.5 ? "concerned" : t < 22 ? "surprised" : "concerned", face: 1});
  } else if (t < 39.5) {
    x = S06_SPOT[0] - 230;
    lad = Object.assign(lad, {face: 1, feel: "happy",   // his hand out to tie the vine, and back, each eased (poseSteps; once in one frame, a pop)
                              reachA: poseSteps(t, [[0, {}], [30, {reachA: [where[0] - 26, where[1] - 120]}], [37, {}]], 0.4).reachA});
  } else {
    var home = stroll(t, S06_SPOT[0] - 230, S06_SPOT[0] - 1300, 39.5, lad);
    x = home.x;
    lad = Object.assign(home.look, {feel: "happy"});
  }
  var feet = maengTrail(x) + 8;
  sprites.push({name: "lad", kind: "person", x: x, y: feet, draw: function () { joints = person(x, feet, lad); }});
  if (t > 33.5) {                                   // the vine, from his hand to the creature's neck, sagging a little: a
    // real creeper with its leaves, its end round the neck (owner, 2026-10-23: "Change ... the vine to look more like
    // the snare rope and a real vine"; it was a green line)
    sprites.push({name: "vine", kind: "vine", y: Math.max(feet, where[1], crowns) + 0.01, draw: function () {
      var wrist = maengAt(joints.wristB), neck = beast.neck;   // his wrist in the film's pixels, back in the scene's
      vine(pen, wrist, neck, 30, {round: 44, seed: 3});
    }});
  }
  drawByZ(sprites);
  pen.drawImage(slope.fore, 0, 0);
  pen.restore();
  var dark = Math.max(1 - between(t, 0, 1.5), between(t, 56, 59.5));
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
