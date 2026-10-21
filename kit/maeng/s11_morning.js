// s11_morning.js - scene 11 of the film of the creature with four ears and five eyes: the king's morning (40 s).
// Morning at the palace: the king comes out of his hall, rubbing his eyes, and sees the golden trough that has come
// right up to his stair. "Whose is this? Follow it!" His man follows it out across the city and the fields, along
// the path, to a little hut, and to Thukkhata, who says he built it, and there is more gold in his garden.
var S11_LONG = 40;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the rooster of the king's morning, and the cicadas.
var S11_SOUND = {calls: [[0, "cicadas", 0.5, 40], [0.8, "rooster-crow", 0.28]]};
var S11_LINES = [[1.5, 4.54, "M064"], [5.2, 8.6, "M065"], [9.2, 13.6, "M066"], [15.0, 20.92, "M067"], [28.0, 34.8, "M068"]];
var S11_SHOTS = [13.5, 26.5];                       // the palace; the yard, the king's man following the trough; at the garden
var S11_KING = [9.2, 12.52];                         // when the king speaks
var S11_LAD = [28.0, 34.4];                         // when Thukkhata speaks
var S11_CAMERA = [1234, 690, 1.4];                  // the last shot, close on the pen and the garden, as scene 8's

// Its life: the blue magpie back on the palace roof's finial as the king wakes; by the hut the rooster crowing, it
// is morning, as the king's man follows the trough there; hens in the garden.
var S11_LIFE = [
  {name: "blue magpie", kind: "magpie", layer: "back", look: {size: 0.6},
   course: [[0, MAENG_FINIAL[0], MAENG_FINIAL[1] + 4], [13.5, MAENG_FINIAL[0], MAENG_FINIAL[1] + 4]]},
  {name: "rooster", kind: "rooster", layer: "back", look: {feel: "happy"}, course: [[13.5, 250, 958], [26.5, 250, 958]]},
  // The hen pecks in front of the trough (nearer than it): drawn after its near side (owner, 2026-10-20: "fix the
  // chickens in the story re their z layer"; she was drawn between the trough's far and near sides, under it).
  {name: "hen", kind: "hen", layer: "front", course: [[26.5, 700, 966, "peck"], [32.0, 700, 966], [34.0, 780, 968, "peck"], [40.0, 780, 968]]}
];

// Scene 11, the entry the film calls (SCENES): t, its own second, 0 to S11_LONG (40 s), in three shots cut through
// black at S11_SHOTS: s11Palace() to 13.5 s, s11Follow() to 26.5 s, s11Garden() after. Gives back nothing: it draws
// the whole sheet with pen. From sets.js: maengDark(), and through its shots the city, the palace, the yard, the trough
// and the garden (see each). Its life is S11_LIFE; its words S11_LINES (M064 to M068), written under it by the page.
// e.g. sceneMorning(10);
function sceneMorning(t) {
  if (t < S11_SHOTS[0]) { s11Palace(t); }
  else if (t < S11_SHOTS[1]) { s11Follow(t); }
  else { s11Garden(t); }
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

// The first shot (t, the scene's second, 0 to 13.5 s): he rubs his eyes to 5 s, sees, speaks (S11_KING) and points;
// his man sets off at 11.2 s. Gives back nothing: it draws with pen. From sets.js: maengCity(), maengSky("day"),
// maengPalace(), MAENG_PALACE, MAENG_STAIR, maengPerson() with MAENG_KING and MAENG_HERALD. e.g. s11Palace(10);
function s11Palace(t) {                             // the king wakes, and the trough is at his stair
  var city = maengCity(), p = MAENG_PALACE, row = 880, floor = hoKhamFloor(p[1], p[2]), x = p[0] - 60;
  pen.drawImage(maengSky("day"), 0, 0);
  cumulus(pen, t + 120, MAENG_CLOUDS.day);
  pen.drawImage(city.back, 0, 0);
  pen.drawImage(city.front, 0, 0);
  maengPalace(t, "back");
  var waking = t < 5, sees = t >= 5;
  var king = maengPerson("noble", MAENG_KING, {id: "king", face: -1, feel: waking ? "sleepy" : t < 9.2 ? "surprised" : "concerned",
                                               at: sees ? [MAENG_STAIR - 300, row - 30] : undefined, mouth: s11Speaking(t, S11_KING)});
  if (waking) {                                     // rubbing his eyes, a fist at each
    var rub = 4 * Math.sin(t * 9);
    king.reachA = [x - 8 + rub, floor - 196];
    king.reachB = [x + 14 - rub, floor - 196];
    king.fingersA = king.fingersB = [0.8, 0.85, 0.9, 0.9, 0.6];
  } else if (t > S11_KING[0]) {                     // pointing along the trough: follow it!
    king.reachA = [x - 130, floor - 150];
  }
  if (sees && t < S11_KING[0] && king.feel === "surprised") { king.reachB = [x + 40, floor - 210]; }   // a hand up in wonder
  person(x, floor, king);
  maengPalace(t, "front");
  decorate(t, S11_LIFE, "back");
  linKham(pen, [[-40, row], [MAENG_STAIR, row - 4]], 1, {size: 1.2});
  var man = maengPerson("fellow", MAENG_HERALD, {id: "herald", face: 1, feel: t > 5.6 ? "surprised" : "neutral", at: [x, floor - 180]});
  if (t > 11.2) {                                   // off he goes, along the trough
    var off = stroll(t, 920, -200, 11.2, man);
    person(off.x, row + 40, off.look);
  } else {
    person(920, row + 40, man);
  }
}

// The second shot (t, the scene's second, 13.5 s to 26.5 s): the king's man walks in along the path to the hut.
// Gives back nothing: it draws with pen. From sets.js: maengYardAt(), maengYardTrough(), maengGarden(), MAENG_PEN,
// maengWay(), maengPerson() with MAENG_LAD and MAENG_HERALD. e.g. s11Follow(20);
function s11Follow(t) {                             // the yard by day: the king's man follows the trough to the hut
  var k = MAENG_PEN;
  maengYardAt(t, 0, 0);
  maengYardTrough(1, "far");
  maengGarden(t, 6, 0, null);
  decorate(t, S11_LIFE, "back");
  kok(pen, k[0], k[1], k[2], 1, {part: "back"});
  maengSiHuHaTa(k[0] - 60, k[1] - 22, {size: 0.45, face: 1, feel: "happy"});
  kok(pen, k[0], k[1], k[2], 1, {part: "front"});
  maengYardTrough(1, "near");
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad", face: 1, feel: t > 21 ? "surprised" : "happy"});
  person(640, 962, lad);
  var man = stroll(t, 2050, 820, S11_SHOTS[0] + 0.3, maengPerson("fellow", MAENG_HERALD, {id: "herald", feel: "concerned",
                                                                                           at: [600, 900]}));
  if (t > man.arrives) { man.look.feel = "surprised"; }
  person(man.x, maengWay(man.x) + 18, man.look);
}

// The last shot (t, the scene's second, 26.5 s to 40 s), under the camera S11_CAMERA: he speaks (S11_LAD) and points
// to the garden 30.5 s to 34 s. Gives back nothing: it draws with pen. From sets.js: maengYardAt(), maengYardTrough(),
// maengGarden(), MAENG_PEN, MAENG_GARDEN, maengPerson() with MAENG_LAD and MAENG_HERALD. e.g. s11Garden(31);
function s11Garden(t) {                             // "I built it, and there is more gold in my garden"
  var k = MAENG_PEN, speaks = t > S11_LAD[0] && t < S11_LAD[1];
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(S11_CAMERA[2], S11_CAMERA[2]);
  pen.translate(-S11_CAMERA[0], -S11_CAMERA[1]);
  maengYardAt(t, 0, 0);
  maengYardTrough(1, "far");
  maengGarden(t, 6, 0, null);                       // new mounds: the creature's gold, every day since
  decorate(t, S11_LIFE, "back");
  kok(pen, k[0], k[1], k[2], 1, {part: "back"});
  maengSiHuHaTa(k[0] - 60, k[1] - 22, {size: 0.45, face: 1, feel: speaks ? "satiated" : "happy"});
  kok(pen, k[0], k[1], k[2], 1, {part: "front"});
  maengYardTrough(1, "near");
  person(MAENG_GARDEN[0] + 60, 948, maengPerson("boy", MAENG_LAD, {id: "lad", face: 1, feel: "happy", mouth: s11Speaking(t, S11_LAD),
                                                                    reachA: t > 30.5 && t < 34 ? [MAENG_GARDEN[0] + 200, 860] : undefined}));
  person(1820, 958, maengPerson("fellow", MAENG_HERALD, {id: "herald", face: -1, feel: t > 31 ? "surprised" : "happy"}));
  decorate(t, S11_LIFE, "front");                   // the hen, in front of the trough
  pen.restore();
}
