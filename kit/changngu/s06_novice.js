// s06_novice.js - scene 6 of the film of Chang Ngu: the novice (40 s). Told gently (the owner's choice, 2026-10-22):
// nothing of his death is ever shown. A novice of nineteen from Si Tuang in Yonok at dawn, walking the lane with his
// alms bowl; at a house a woman puts rice in it (the chronicle: he "received rice at three houses"). Then in the Black
// Khom king's courtyard he stands waiting with his bowl; the king, on the step of his hall, speaks and points him out;
// his people turn their backs; the novice turns and walks away. The novice is the kit's monk at a novice's age, kit
// only: never in the maker.
var C06_LONG = 42;
var C06_SOUND = {calls: []};
var C06_LINES = [[1.4, 9.1, "C021"], [9.3, 15.28, "C022"], [17.0, 23.16, "C023"], [23.36, 29.26, "C024"], [29.46, 32.4, "C025"], [32.6, 36.56, "C026"]];
var C06_CUTS = [16.2];
var C06_SPEAKS = [[23.36, 28.86], [29.46, 32.0]];         // the Khom king's words (the narrator says them over him)

// The novice at (x, y) with his bowl at his waist, held in both hands; look: the scene's keys (face, step, feel).
function c06Novice(x, y, look) {
  var size = CNG_NOVICE.size, face = look.face || 1, bowl = [x + 34 * size * face, y - 236 * size];
  person(x, y, cngPerson("monk", CNG_NOVICE, Object.assign({id: "novice", reachA: [bowl[0] - 22 * size * face, bowl[1] + 10 * size],
                                                            reachB: [bowl[0] + 24 * size * face, bowl[1] + 10 * size]}, look)));
  almsBowl(pen, bowl[0], bowl[1], size * 0.8);
}

// The lane at dawn: the novice walks to a house where a woman waits with rice, stops, and she puts rice in his bowl.
function c06Lane(t) {
  pen.drawImage(cngSky("dawn"), 0, 0);
  cumulus(pen, t + 30, CNG_CLOUDS.dawn);
  pen.drawImage(cngLane("dawn"), 0, 0);
  var walk = between(t, 0.5, 8), x = mix(200, 900, walk), step = walk > 0 && walk < 1 ? (t - 0.5) / BEAT / 2 : 0;
  var giving = between(t, 9.5, 11) * (1 - between(t, 12.5, 13.5));   // her hand to his bowl and back
  var leaves = between(t, 14, 16), xn = x + 500 * leaves;
  decorate(t, cngYard(1650, 905, 8), "back");                 // the yard's fowl (owner, 2026-10-25)
  drawByZ([
    {name: "novice", kind: "person", x: xn, y: CNG_LANE_Y, draw: function () {
      c06Novice(xn, CNG_LANE_Y, {face: 1, step: leaves > 0 ? (t - 14) / BEAT / 2 : step});
    }},
    {name: "woman", kind: "person", x: 1090, y: CNG_LANE_Y + 10, draw: function () {
      person(1090, CNG_LANE_Y + 10, cngPerson("weaver", {size: 0.72, id: "giver", face: -1, feel: "happy",
                                                       reachA: [mix(1060, 960, giving), mix(CNG_LANE_Y - 130, CNG_LANE_Y - 165, giving)],   // from rest to his bowl and back: no jump (pop_check)
                                                       at: [x, CNG_LANE_Y - 200]}));
      pen.fillStyle = "#f6f0e2";                           // a ball of sticky rice in her hand
      pen.beginPath(); pen.arc(mix(1060, 960, giving), mix(CNG_LANE_Y - 132, CNG_LANE_Y - 168, giving), 8, 0, 7); pen.fill();
    }}
  ]);
}

// The Khom king's courtyard: the novice waiting; the king on the step of his hall speaks and points at him; his people
// turn their backs; the novice turns and goes.
function c06Court(t) {
  var p = CNG_PALACE, floor = hoKhamFloor(p[1], p[2]);
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 70, CNG_CLOUDS.day);
  pen.drawImage(cngCourt(), 0, 0);
  var speaking = C06_SPEAKS.some(function (s) { return t >= s[0] && t < s[1]; });
  var rest = [p[0] - 150, floor - 55], points = [p[0] - 330, floor - 160];   // his hand at his side; pointing at the novice
  var arm = poseSteps(t, [[0, {reachA: rest}], [23.56, {reachA: points}], [32.0, {reachA: rest}]], 0.35);   // eased, not switched (pop_check)
  var turned = t > 30.7, goes = between(t, 32.2, 41.2), nx = mix(620, -200, goes);
  drawByZ([
    {name: "hall, back", kind: "palace", z: "set", y: floor - 1, draw: function () { cngPalace("back"); }},
    {name: "hall, front", kind: "palace", z: "set", y: floor, draw: function () { cngPalace("front"); }},
    {name: "khom king", kind: "person", x: p[0] - 120, y: floor + 60, draw: function () {
      person(p[0] - 120, floor + 60, cngPerson("khomsoldier", CNG_KHOM_KING, {id: "khomking", face: -1, feel: speaking || t > 22 ? "angry" : undefined,
                                                                             reachA: arm.reachA,
                                                                             mouth: speaking ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8)), wide: 0.5, round: 0.15} : undefined,
                                                                             at: [nx, CNG_LANE_Y - 200]}));
    }},
    {name: "khom 1", kind: "person", x: p[0] - 360, y: floor + 120, draw: function () {
      person(p[0] - 360, floor + 120, cast("khomsoldier", {size: 0.76, id: "kc1", face: turned ? 1 : -1, holding: null}));
    }},
    {name: "khom 2", kind: "person", x: p[0] + 120, y: floor + 130, draw: function () {
      person(p[0] + 120, floor + 130, cast("khomsoldier", {size: 0.76, id: "kc2", face: turned ? 1 : -1, holding: null}));
    }},
    {name: "novice", kind: "person", x: nx, y: 1000, draw: function () {
      c06Novice(nx, 1000, {face: goes > 0 ? -1 : 1, step: goes > 0 && goes < 1 ? (t - 32.2) / BEAT / 2 : 0,
                           feel: t > 24 ? "sad" : undefined});
    }}
  ]);
}

// Scene 6, the entry the film calls (SCENES): t, its own second, 0 to C06_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngLane("dawn"), CNG_LANE_Y, cngCourt(), cngPalace(), CNG_PALACE, cngPerson()
// with CNG_NOVICE and CNG_KHOM_KING, cngCutsOver(); from chiangsaen.js almsBowl(). Its words are C06_LINES (C021 to
// C026). Its z plan: each shot's set first, then by drawByZ the hall in "set" and the people by their feet.
// e.g. cngSceneNovice(20);
function cngSceneNovice(t) {
  if (t < C06_CUTS[0]) { c06Lane(t); } else { c06Court(t); }
  cngCutsOver(t, C06_CUTS);
}
