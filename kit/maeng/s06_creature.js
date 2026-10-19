// s06_creature.js - scene 6 of the film of the creature with four ears and five eyes: the creature (60 s).
// Two days later, by day, close to the cave. Thukkhata climbs back up the path: the snare has sprung and holds
// something by the foot, behind the bushes at the cave's mouth. It comes out into the light: short, fat, in
// long dark fur like a bear; four ears; and its eyes open one after another, five. It is afraid, and so is he
// for a moment; he wonders if it is his father, come back; he ties a vine round its neck, gently, and it
// follows him home.
var S06_LONG = 60;
var S06_LINES = [[1.5, 6.1, "M028"], [6.2, 8.5, "M029"], [10.5, 15.3, "M030"], [15.6, 17.6, "M031"], [18.0, 20.6, "M032"],
                 [24.0, 28.6, "M033"], [32.0, 37.7, "M034"], [44.0, 48.0, "M035"]];
var S06_NEAR = 1.55;                                // the camera's nearness to the cave: the set is seen this much larger
var S06_SPOT = [MAENG_SLOPE_CAVE[0] - 20, MAENG_SLOPE_CAVE[1] + 14];   // where the creature stands, at the cave's mouth
var S06_SNARE = [MAENG_SLOPE_CAVE[0] - 60, MAENG_SLOPE_CAVE[1] + 8];
var S06_BEHIND = [[-86, -58, 13], [-64, -82, 14], [-36, -92, 13], [-6, -96, 14], [24, -94, 13], [52, -88, 14], [80, -70, 13], [94, -40, 12]];
var S06_BEFORE = [[-80, 10, 12], [-52, 14, 13], [74, 12, 12], [96, 4, 11]];

function s06Crowns(list, size, seed, shake) {        // the forest's own crowns over and beside the cave; the near ones shake while it struggles
  list.forEach(function (c, n) {
    var green = blend(FOREST_GREENS[(n + seed) % FOREST_GREENS.length], "#79ad84", 0.05);
    crown(pen, MAENG_SLOPE_CAVE[0] + c[0] * size + shake * Math.sin(clock * 31 + n), MAENG_SLOPE_CAVE[1] + c[1] * size, c[2] * size, green, seed + n);
  });
}

// Its life: morning mist on the slope, thinning as he climbs; and once all is calm, as he wonders if it is his
// father (M033) and ties the vine (M034), a green-tailed sunbird hovering at the ferns over the cave's mouth.
var S06_LIFE = [
  {name: "sunbird", kind: "sunbird", layer: "back", look: {size: 1.0},
   course: [[22.0, 1720, 300], [24.0, 1310, 470, "sip"], [29.0, 1310, 470], [31.5, 1680, 260]]},
  // its roar as it tugs at the snare (sounds.py, maeng-angry)
  {name: "the creature's roar", kind: "flock", layer: "back", course: [[0, -999, -999], [0.1, -999, -999]],
   calls: [[5.3, "maeng-angry", 0.7]]}
];

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
  decorate(t, S06_LIFE, "back");
  var struggle = t > 5.2 && t < 9.5 ? 1 : 0;        // something tugs at the snare
  s06Crowns(S06_BEHIND, size * 1.6, 3, 0);
  caveMouth(pen, MAENG_SLOPE_CAVE[0], MAENG_SLOPE_CAVE[1], size, {t: t, rock: "#5f574f"});
  // The creature: hidden in the cave's dark at first (only its pull on the snare shows), then out into the
  // light; its four ears first, then its eyes opening one after another; afraid, then calm, then it follows.
  var out = between(t, 9.5, 12.5), wake = t < 15.6 ? 0 : Math.min(5, (t - 17.8) / 0.45 + 1), leave = t > 37;
  var feel = t < 22 ? "fear" : t < 30 ? "concerned" : "neutral";
  var where = [mix(S06_SPOT[0] + 40, S06_SPOT[0] - 40, out), S06_SPOT[1]], step;
  if (leave) {                                      // following him down the path, on the vine
    var go = amble("maengSiHuHaTa", t, S06_SPOT[0] - 40, S06_SPOT[0] - 900, 39.5, {size: 0.5, feel: "neutral"});
    where = [go.x, maengTrail(go.x) + 8];
    step = go.look.step;
  }
  var beast = maengSiHuHaTa(where[0], where[1], {size: 0.5, face: -1, feel: feel, wake: t < 15.6 ? 0 : wake,
                                                 step: step !== undefined ? step : (t > 9.5 && t < 12.5 ? (t - 9.5) * 1.2 : undefined)});
  var paw = beast.paw;
  snare(pen, S06_SNARE[0], S06_SNARE[1], 0.62, {sprung: 1, t: t, caught: t < 34 ? paw : null});
  s06Crowns(S06_BEFORE, size * 1.6, 9, struggle * 3);
  // Thukkhata: up the path into view, then still before it; he ties the vine, and leads it home.
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad"}), x;
  if (t < 30) {
    var come = stroll(t, S06_SPOT[0] - 700, S06_SPOT[0] - 230, 0.5, lad);
    x = come.x;
    lad = Object.assign(come.look, {feel: t < 9.5 ? "concerned" : t < 22 ? "surprised" : "concerned", face: 1});
  } else if (t < 39.5) {
    x = S06_SPOT[0] - 230;
    lad = Object.assign(lad, {face: 1, feel: "happy", reachA: t < 37 ? [where[0] - 26, where[1] - 120] : undefined});
  } else {
    var home = stroll(t, S06_SPOT[0] - 230, S06_SPOT[0] - 1300, 39.5, lad);
    x = home.x;
    lad = Object.assign(home.look, {feel: "happy"});
  }
  var joints = person(x, maengTrail(x) + 8, lad);
  if (t > 33.5) {                                   // the vine, from his hand to the creature's neck, sagging a little
    var wrist = maengAt(joints.wristB), neck = beast.neck;   // his wrist in the film's pixels, back in the scene's
    pen.strokeStyle = "#5d7a32";
    pen.lineWidth = 3.2;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(wrist[0], wrist[1]);
    pen.quadraticCurveTo((wrist[0] + neck[0]) / 2, Math.max(wrist[1], neck[1]) + 30, neck[0], neck[1]);
    pen.stroke();
  }
  pen.drawImage(slope.fore, 0, 0);
  pen.restore();
  var dark = Math.max(1 - between(t, 0, 1.5), between(t, 56, 59.5));
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
