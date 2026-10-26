// s11_morning.js - scene 11 of the film of the creature with four ears and five eyes: the king's morning (40.78 s;
// 40 s until 2026-10-24, when the narrator's own words for M064 came in longer: 0.78 s inserted at 5.0 s, as he rubs
// his eyes, every moment after it moved with it, film_relayout.py in the voice project).
// Morning at the palace: the king comes out of his hall, rubbing his eyes, and sees the golden trough that has come
// right up to his stair. "Whose is this? Follow it!" His man follows it out across the city and the fields, along
// the path, to a little hut, and to Thukkhata, who says he built it, and there is more gold in his garden.
var S11_LONG = 44.28;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the rooster of the king's morning, and the cicadas.
var S11_SOUND = {calls: [[0, "cicadas", 0.5, 44.28], [0.8, "rooster-crow", 0.28]]};
var S11_LINES = [[1.5, 7.51, "M064"], [7.71, 12.24, "M065"], [13.86, 19.01, "M066"], [20.54, 26.98, "M067"], [34.31, 40.5, "M068"]];
var S11_SHOTS = [19.04, 32.81];                       // the palace; the yard, the king's man following the trough; at the garden
var S11_KING = [13.86, 18.62];                         // when the king speaks
var S11_LAD = [34.31, 40.12];                         // when Thukkhata speaks
var S11_CAMERA = [1234, 690, 1.4];                  // the last shot, close on the pen and the garden, as scene 8's
var S11_SUN = [130, 250];                           // the morning's sun, low at the left (pixels of the sheet, without a camera)
var S11_SUN_LOOK = MAENG_MORNING_SUN;               // low and warm, as a morning's (sets.js)

// Its life: the blue magpie back on the palace roof's finial as the king wakes; by the hut the rooster crowing, it
// is morning, as the king's man follows the trough there; hens in the garden.
var S11_LIFE = [
  {name: "blue magpie", kind: "magpie", z: "set", look: {size: 0.6},     // perched on the palace: of the set
   course: [[0, MAENG_FINIAL[0], MAENG_FINIAL[1] + 4], [19.04, MAENG_FINIAL[0], MAENG_FINIAL[1] + 4]]},
  {name: "rooster", kind: "rooster", look: {feel: "happy"}, course: [[19.04, 250, 958], [32.81, 250, 958]]},
  // The hen pecks in front of the trough (nearer than it): her feet are lower than its nearest point, so drawByZ draws
  // her after it (owner, 2026-10-20: "fix the chickens in the story re their z layer"; she was once drawn between the
  // trough's far and near sides, under it).
  {name: "hen", kind: "hen", course: [[32.81, 700, 966, "peck"], [37.27, 700, 966], [38.75, 780, 968, "peck"], [44.28, 780, 968]]}
];

// Scene 11, the entry the film calls (SCENES): t, its own second, 0 to S11_LONG (40.78 s), in three shots cut through
// black at S11_SHOTS: s11Palace() to 14.28 s, s11Follow() to 27.28 s, s11Garden() after. Gives back nothing: it draws
// the whole sheet with pen. From sets.js: maengDark(), and through its shots the city, the palace, the yard, the trough
// and the garden (see each). Its life is S11_LIFE; its words S11_LINES (M064 to M068), written under it by the page.
// e.g. sceneMorning(10);
function sceneMorning(t) {
  if (t < S11_SHOTS[0]) { s11Palace(t); }
  else if (t < S11_SHOTS[1]) { s11Follow(t); }
  else { s11Garden(t); }
  maengAir(t, "morning", "day");                   // the morning's air (sets.js)
  maengDark(t, S11_SHOTS[0] - 1.2, S11_SHOTS[0]);
  maengDark(t, S11_SHOTS[1] - 1.2, S11_SHOTS[1]);
  maengDark(t, S11_LONG - 1.2, S11_LONG + 10);
  maengDark(t, -10, 0);
}

// t: seconds; when: [from, to] in seconds (S11_KING, S11_LAD). Gives back a mouth for a look, or undefined outside
// it. e.g. maengPerson("boy", MAENG_LAD, {id: "lad", mouth: s11Speaking(t, S11_LAD)});
function s11Speaking(t, when) {                     // a mouth that moves while its owner speaks
  return t > when[0] && t < when[1] ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8)), wide: 0.5, round: 0.15} : undefined;
}

// The first shot (t, the scene's second, 0 to 14.28 s): he rubs his eyes to 5.78 s, sees, speaks (S11_KING) and
// points; his man sets off at 11.98 s. Gives back nothing: it draws with pen. From sets.js: maengCity(), maengSky("day"),
// maengPalace(), MAENG_PALACE, MAENG_STAIR, maengPerson() with MAENG_KING and MAENG_HERALD.
// Its z plan (oldcartoon.js, Z): the sky, the city and the palace as painted first, the king in the hall between its
// back and its front; then by drawByZ the magpie in "set" (on the finial), and in "people" the trough by its line
// (s11PalaceLine) and the king's man before it. e.g. s11Palace(10);
// x in pixels of the sheet; gives back the y of the trough at the palace there (its row, 880, falling 4 to the stair),
// or null where it does not reach. e.g. s11PalaceLine(500)   // about 878
function s11PalaceLine(x) {
  return x < -40 || x > MAENG_STAIR ? null : 880 - 4 * (x + 40) / (MAENG_STAIR + 40);
}

function s11Palace(t) {                             // the king wakes, and the trough is at his stair
  var city = maengCity(), p = MAENG_PALACE, row = 880, floor = hoKhamFloor(p[1], p[2]), x = p[0] - 60;
  pen.drawImage(maengSky("day"), 0, 0);
  maengClouds(t + 120, "day");
  scenerySun(t, S11_SUN[0], S11_SUN[1], 30, S11_SUN_LOOK);   // the morning's sun, low at the left, through the clouds
  pen.drawImage(city.back, 0, 0);
  pen.drawImage(city.front, 0, 0);
  softMist(t, 850, 90, 0.45 * (1 - between(t, 3, 16)), 43, "252, 238, 222");   // the dawn's mist still on the court, going
  maengPalace(t, "back");
  var waking = t < 7.51, sees = t >= 7.51;
  var king = maengPerson("noble", MAENG_KING, {id: "king", face: -1, feel: waking ? "sleepy" : t < 13.86 ? "surprised" : "concerned",
                                               at: sees ? [MAENG_STAIR - 300, row - 30] : undefined, mouth: s11Speaking(t, S11_KING)});
  // Rubbing his eyes, a fist at each; then a hand up in wonder; then pointing along the trough: follow it! Each
  // change eased (poseSteps; they once came in one frame, a pop: checks/pop_check.py).
  var rub = 4 * Math.sin(t * 9);
  Object.assign(king, poseSteps(t, [
    [0, {reachA: [x - 8 + rub, floor - 196], reachB: [x + 14 - rub, floor - 196], fingersA: [0.8, 0.85, 0.9, 0.9, 0.6], fingersB: [0.8, 0.85, 0.9, 0.9, 0.6]}],
    [7.51, {reachB: [x + 40, floor - 210]}],
    [S11_KING[0], {reachA: [x - 130, floor - 150]}]
  ], 0.35));
  person(x, floor, king);
  maengPalace(t, "front");
  var man = maengPerson("fellow", MAENG_HERALD, {id: "herald", face: 1, feel: t > 8.54 ? "surprised" : "neutral", at: [x, floor - 180]});
  var walks = {x: 920, look: man};
  if (t > 16.31) { walks = stroll(t, 920, -200, 16.31, man); }   // off he goes, along the trough
  drawByZ(lifeSprites(t, S11_LIFE).concat([
    {name: "trough", kind: "trough", line: s11PalaceLine, draw: function () {
      linKham(pen, [[-40, row], [MAENG_STAIR, row - 4]], 1, {size: 1.2});
      maengGlint(t, [[MAENG_STAIR, row - 4], [-40, row]], 46 * 1.2, 0, 4);   // the sun on its gold, running out from the stair
    }},
    {name: "herald", kind: "person", x: walks.x, y: row + 40, draw: function () { person(walks.x, row + 40, walks.look); }}
  ]));
  maengMorningLight(S11_SUN[0], S11_SUN[1], 1);
}

// The z plan of the yard's two shots, drawn by the kit's drawByZ() (oldcartoon.js, Z): the set first, as painted (the
// yard's sheets, the trough's far part across the fields, the garden); then, in the band "people", by their feet:
// the pen (with the creature in it) at its foot, 930; the lad, the king's man, the rooster and the hen at theirs;
// and the trough's near part, a long thing, by its line, s11TroughLine(): drawn before whoever stands in front of
// it where they stand (the king's man on the path, the lad, the hen), after the pen behind it.
// x in pixels of the sheet; gives back the y of the trough's near part there, or null where it does not reach.
// e.g. s11TroughLine(700)   // about 960
function s11TroughLine(x) {
  return x < maengTroughRoute().near[0][0] || x > MAENG_TROUGH_TURN ? null : maengTroughAt(x)[1];
}

// The pen of the yard with the creature in it, its back, the creature and its front: one sprite of the yard's z plan.
// feel: the creature's feeling. Gives back nothing: it draws with pen. e.g. s11Pen("happy");
function s11Pen(feel) {
  var k = MAENG_PEN;
  kok(pen, k[0], k[1], k[2], 1, {fine: true, part: "back"});
  maengSiHuHaTa(k[0] - 60, k[1] - 22, {size: 0.45, face: 1, feel: feel});
  kok(pen, k[0], k[1], k[2], 1, {fine: true, part: "front"});
}

// The second shot (t, the scene's second, 14.28 s to 27.28 s): the king's man walks in along the path to the hut.
// Gives back nothing: it draws with pen. From sets.js: maengYardAt(), maengYardTrough(), maengGarden(), MAENG_PEN,
// maengWay(), maengPerson() with MAENG_LAD and MAENG_HERALD. e.g. s11Follow(20);
// The yard's morning: its sun low at the left, over the far hills (maengYardAt()'s heavens), and the mist low over the
// rice fields behind the hut (its behind), thinning through the two shots. t: the scene's second. Gives back nothing.
function s11Yard(t) {
  // the yard's clock 5 s back: its rice planters step back to their start every 30 s, (t * 2) % 60 in sets.js, and at
  // 30 s that jump fell in this shot (19.04 s to 32.81 s; the pop check, 2026-10-27); the shot comes in through black,
  // so nothing else of the yard can be seen to differ, as in scene 2
  maengYardAt(t - 5, 0, 0, function () {
    mistDrift(pen, t, {left: 0, right: WIDE, top: 755, bottom: 872, count: 6, wide: 560, drift: 6, seed: 23,
                       alpha: 0.6 * (1 - 0.6 * between(t, S11_SHOTS[0], S11_LONG))});
  }, undefined, undefined, function () { scenerySun(t, S11_SUN[0] + 630, S11_SUN[1] + 50, 28, S11_SUN_LOOK); });
}
// The trough's whole line in the yard, from the hut out and across the fields, for its glint (maengGlint()).
function s11YardLine() { var route = maengTroughRoute(); return route.near.concat(route.far.slice(1)); }

function s11Follow(t) {                             // the yard by day: the king's man follows the trough to the hut
  s11Yard(t);
  maengYardTrough(1, "far");
  maengGarden(t, 6, 0, null);
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad", face: 1, feel: t > 27.31 ? "surprised" : "happy"});
  var man = stroll(t, 2050, 820, S11_SHOTS[0] + 0.3, maengPerson("fellow", MAENG_HERALD, {id: "herald", feel: "concerned",
                                                                                           at: [600, 900]}));
  if (t > man.arrives) { man.look.feel = "surprised"; }
  var walks = maengWay(man.x) + 18;
  drawByZ(lifeSprites(t, S11_LIFE).concat([
    {name: "pen", kind: "kok", x: MAENG_PEN[0], y: MAENG_PEN[1], draw: function () { s11Pen("happy"); }},
    {name: "trough", kind: "trough", line: s11TroughLine, draw: function () {
      maengYardTrough(1, "near");
      maengGlint(t, s11YardLine(), 46 * 0.9, S11_SHOTS[0], 4);   // the sun on its gold, running along it toward the hut
    }},
    {name: "lad", kind: "person", x: 640, y: 962, draw: function () { person(640, 962, lad); }},
    {name: "herald", kind: "person", x: man.x, y: walks, draw: function () { person(man.x, walks, man.look); }}
  ]));
  maengMorningLight(S11_SUN[0] + 630, S11_SUN[1] + 50, 0.8);
}

// The last shot (t, the scene's second, 27.28 s to 40.78 s), under the camera S11_CAMERA: he speaks (S11_LAD) and
// points to the garden 31.28 s to 34.78 s. Gives back nothing: it draws with pen. From sets.js: maengYardAt(), maengYardTrough(),
// maengGarden(), MAENG_PEN, MAENG_GARDEN, maengPerson() with MAENG_LAD and MAENG_HERALD. e.g. s11Garden(31);
function s11Garden(t) {                             // "I built it, and there is more gold in my garden"
  var speaks = t > S11_LAD[0] && t < S11_LAD[1];
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(S11_CAMERA[2], S11_CAMERA[2]);
  pen.translate(-S11_CAMERA[0], -S11_CAMERA[1]);
  s11Yard(t);
  maengYardTrough(1, "far");
  maengGarden(t, 6, 0, null);                       // new mounds: the creature's gold, every day since
  drawByZ(lifeSprites(t, S11_LIFE).concat([          // the yard's z plan (above s11TroughLine): the hen in front of the trough
    {name: "pen", kind: "kok", x: MAENG_PEN[0], y: MAENG_PEN[1], draw: function () { s11Pen(speaks ? "satiated" : "happy"); }},
    {name: "trough", kind: "trough", line: s11TroughLine, draw: function () { maengYardTrough(1, "near"); }},
    {name: "lad", kind: "person", x: MAENG_GARDEN[0] + 60, y: 948, draw: function () {
      person(MAENG_GARDEN[0] + 60, 948, maengPerson("boy", MAENG_LAD, {id: "lad", face: 1, feel: "happy", mouth: s11Speaking(t, S11_LAD),
                                                                        reachA: poseSteps(t, [[0, {}], [36.16, {reachA: [MAENG_GARDEN[0] + 200, 860]}], [38.75, {}]], 0.35).reachA}));
    }},
    {name: "herald", kind: "person", x: 1820, y: 958, draw: function () {
      person(1820, 958, maengPerson("fellow", MAENG_HERALD, {id: "herald", face: -1, feel: t > 36.53 ? "surprised" : "happy"}));
    }}
  ]));
  pen.restore();
  maengMorningLight(0, 0, 0.8);                     // from the left, past the picture's edge under the camera
}
