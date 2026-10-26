// s13_home.js - scene 13 of the film of the creature with four ears and five eyes: it goes home (40 s).
// By the pen, by day: word of the gold has gone round, and people come from both sides to see the creature, more and
// more, pressing round its pen and pointing. It cowers, its ears flat, and cries out; then it leaps the back fence
// and is gone. On the mountain's slope it runs up the trail to its cave and in, and from inside comes its long howl
// of home. Last, Doi Khao Khwai in the morning, wide: a small temple stands on its shoulder today, where the tale is
// still told.
var S13_LONG = 46.82;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the cicadas by day at the pen.
var S13_SOUND = {calls: [[0, "cicadas", 0.5, 25.75]]};
var S13_LINES = [[1.5, 5.47, "M073"], [6.61, 12.46, "M074"], [18.62, 23.89, "M075"], [27.95, 33.13, "M076"], [36.83, 44.83, "M077"]];
var S13_SHOTS = [17.52, 35.83];                       // the crowd at the pen; the run home; the mountain today
var S13_CAMERA = [1234, 690, 1.4];                  // close on the pen, as scene 8's
var S13_BOLT = 14.42;                                // when it leaps the fence
var S13_FLEE = 1.1;                                 // and then the seconds it takes to run out of the picture
// The crowd: who comes, from which side, where each stops, and when it sets off.
var S13_CROWD = [["inta", 2.2, 2100, 1560, 948], ["sinuan", 3.03, 2150, 1690, 965], ["khammun", 4.43, -200, 760, 950],
                 ["buakham", 5.21, -260, 880, 968], ["bunma", 6.01, 2120, 1460, 975], ["dokkham", 6.61, -300, 980, 980],
                 ["farmer", 7.59, 2200, 1800, 955], ["villager", 8.33, -320, 660, 962]];
var S13_LIFE = [
  // its cries: afraid in the crowd, and its howl of home from inside the cave (the kit's sounds, sounds.py)
  {name: "the creature's cries", kind: "flock", z: "sky", course: [[0, -999, -999], [0.1, -999, -999]],
   calls: [[13.22, "maeng-afraid", 0.97], [26.15, "maeng-home", 2.95]]},
  {name: "flock over the mountain", kind: "flock", z: "sky", course: [[36.33, 2150, 260], [46.82, -150, 200]]}
];

// t: the scene's second: each of S13_CROWD walks in from its side at its second, turns to the pen, points (every
// other one) until S13_BOLT, then is surprised. Gives back their sprites for drawByZ(), each at its feet (one[4]).
// e.g. drawByZ(s13Crowd(t));
function s13Crowd(t) {                               // people from both sides, pressing round the pen, pointing
  return S13_CROWD.map(function (one, n) {
    var look = cast(one[0], {size: 0.62 * (one[0] === "bunma" || one[0] === "dokkham" ? 0.75 : 1), id: "crowd" + n, smile: 0.8});
    var walk = stroll(t, one[2], one[3], one[1], look), arrived = t > walk.arrives;
    if (arrived) {
      walk.look.face = one[3] < MAENG_PEN[0] ? 1 : -1;   // turned to the pen
      walk.look.feel = t > S13_BOLT ? "surprised" : "happy";
      // Every other one points at it, the arm coming up as they stop and down as it leaps, eased (the reach's third
      // number: it once came in one frame, a pop, checks/pop_check.py).
      var point = between(t - walk.arrives, 0, 0.35) * (1 - between(t, S13_BOLT, S13_BOLT + 0.35));
      if (n % 2 === 0 && point > 0) {
        walk.look.reachA = [walk.x + walk.look.face * 90, one[4] - 150 * look.size, point * point * (3 - 2 * point)];
      }
    }
    return {name: "crowd" + n, kind: "person", x: walk.x, y: one[4], draw: function () { person(walk.x, one[4], walk.look); }};
  });
}

// x in pixels of the sheet; gives back the y of the yard trough's near part there, or null where it does not reach
// (as scene 11's s11TroughLine). e.g. s13TroughLine(700)   // about 960
function s13TroughLine(x) {
  return x < maengTroughRoute().near[0][0] || x > MAENG_TROUGH_TURN ? null : maengTroughAt(x)[1];
}

// Scene 13, the entry the film calls (SCENES): t, its own second, 0 to S13_LONG (40 s), in three shots cut through
// black at S13_SHOTS: the crowd at the pen (S13_CAMERA; it leaps at S13_BOLT, 12.4 s, and runs off) to 15.5 s; the run
// up the trail into the cave to 30 s; the mountain today with its temple after. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: maengYardAt(), maengYardTrough(), maengGarden(), MAENG_PEN, maengSlope(),
// MAENG_SLOPE_CAVE, maengTrail(), maengMountain(), maengPeak(), maengSky("day"), MAENG_CLOUDS.day, maengDark(). Its
// life is S13_LIFE; its words S13_LINES (M073 to M077), written under it by the page.
// Its z plan (oldcartoon.js, Z): at the pen, the yard, the far trough and the garden as painted first; then by drawByZ
// in "people" by their feet: the pen with the creature (its back, the creature, its front: one sprite at its foot,
// MAENG_PEN; it leaps out over the front), the crowd, each at its own feet, and the trough's near part by its line,
// before whoever stands in front of it. On the trail, the slope and the cave as painted, the creature, then the
// slope's foreground. On the mountain, all painted, the temple on its shoulder, then the flock in "sky".
// e.g. sceneHome(20);
function sceneHome(t) {
  var k = MAENG_PEN;
  if (t < S13_SHOTS[0]) {                            // the crowd at the pen
    pen.save();
    pen.translate(WIDE / 2, 540);
    pen.scale(S13_CAMERA[2], S13_CAMERA[2]);
    pen.translate(-S13_CAMERA[0], -S13_CAMERA[1]);
    maengYardAt(t, 0, 0);
    maengYardTrough(1, "far");
    maengGarden(t, 6, 0, null);
    var leap = between(t, S13_BOLT, S13_BOLT + 1.6), at = [mix(k[0] - 60, k[0] + 520, leap), k[1] - 22 - 120 * Math.sin(Math.PI * Math.min(1, leap * 1.4))];
    // Landed, it runs on, out of the picture at the right (owner, 2026-10-21: "have the monster run all the way off
    // the screen"; it vanished where it landed): S13_FLEE seconds from the end of the leap to past the frame's edge.
    var fled = clamp((t - S13_BOLT - 1.6) / S13_FLEE);
    if (leap >= 1) { at = [mix(k[0] + 520, k[0] + 1250, fled), k[1] - 22]; }
    drawByZ(lifeSprites(t, S13_LIFE).concat([
      {name: "pen", kind: "kok", x: k[0], y: k[1], draw: function () {
        kok(pen, k[0], k[1], k[2], 1, {part: "back"});
        if (fled < 1) {
          maengSiHuHaTa(at[0], at[1], {size: 0.45, face: 1, feel: t < 6.61 ? "concerned" : "fear",
                                       step: leap > 0 ? leap * 6 + Math.max(0, t - S13_BOLT - 1.6) * 14 : undefined,
                                       mouth: t > 13.02 && t < 14.22 ? 0.7 : 0});
        }
        kok(pen, k[0], k[1], k[2], 1, {part: "front"});
      }},
      {name: "trough", kind: "trough", line: s13TroughLine, draw: function () { maengYardTrough(1, "near"); }}
    ], s13Crowd(t)));
    pen.restore();
  } else if (t < S13_SHOTS[1]) {                     // the run home, up the trail and into the cave
    var slope = maengSlope(), size = MAENG_SLOPE_CAVE[2];
    pen.drawImage(maengSky("day"), 0, 0);
    maengClouds(t + 70, "day");
    pen.drawImage(slope.back, 0, 0);
    pen.drawImage(slope.front, 0, 0);
    sceneryCave(pen, MAENG_SLOPE_CAVE[0], MAENG_SLOPE_CAVE[1], size, {t: t, rock: "#5f574f"});
    var run = between(t, S13_SHOTS[0] + 0.4, S13_SHOTS[0] + 6.4), x = mix(-160, MAENG_SLOPE_CAVE[0] - 20, run);
    var inside = between(t, S13_SHOTS[0] + 6.4, S13_SHOTS[0] + 7.6);   // it goes in, into the dark, smaller and fainter
    if (inside < 1) {
      pen.save();
      pen.globalAlpha = 1 - inside;
      maengSiHuHaTa(x, maengTrail(x) + 8 - 10 * inside, {size: 0.5 * (1 - 0.3 * inside), face: 1, feel: run < 1 ? "fear" : "neutral",
                                                         step: run > 0 && run < 1 ? run * 30 : undefined});
      pen.restore();
    }
    pen.drawImage(slope.fore, 0, 0);
  } else {                                           // Doi Khao Khwai today, and the temple on its shoulder
    var mountain = maengMountain();
    pen.drawImage(maengSky("day"), 0, 0);
    maengClouds(t + 30, "day");
    pen.drawImage(mountain.back, 0, 0);
    mistDrift(pen, t, {left: 0, right: WIDE, top: 640, bottom: 770, count: 4, drift: 8, seed: 13, alpha: 0.45});
    pen.drawImage(mountain.front, 0, 0);
    // the temple, small and far, on the top of the mountain's shoulder, its base where the ground is lowest under it,
    // so no side of it stands out over the slope (owner, 2026-10-21: "half of it is off the mountain so place it so it
    // is fully on the mountain"; it stood at 640, on the shoulder's fall)
    var templeAt = 560, templeHalf = 90;
    pen.save();
    pen.translate(templeAt, Math.max(maengPeak(templeAt - templeHalf), maengPeak(templeAt), maengPeak(templeAt + templeHalf)) + 6);
    pen.scale(0.22, 0.22);
    temple(pen, 0, 0);
    pen.restore();
    drawByZ(lifeSprites(t, S13_LIFE));
  }
  maengDark(t, S13_SHOTS[0] - 1.2, S13_SHOTS[0]);
  maengDark(t, S13_SHOTS[1] - 1.2, S13_SHOTS[1]);
  maengDark(t, S13_LONG - 1.8, S13_LONG + 10);
  maengDark(t, -10, 0);
}
