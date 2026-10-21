// s08_gold.js - scene 8 of the film of the creature with four ears and five eyes: gold (40 s).
// Morning by the pen: something glints on its floor. Thukkhata picks it up, and it is gold: the creature's
// droppings have turned to gold, and it looks very pleased with itself. He buries the gold in his garden, and
// day after day there is another mound, until the garden is full. And he still leads the headman's buffalo
// out, as he always did.
var S08_LONG = 40;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the morning's rooster and hens, the cicadas, the buffalo as he leads it out.
var S08_SOUND = {calls: [[0, "cicadas", 0.5, 40], [1, "rooster-crow", 0.28], [4, "hens", 0.55], [27.5, "buffalo", 0.45]]};
var S08_LINES = [[2.0, 5.8, "M045"], [6.2, 10.9, "M046"], [11.1, 16.18, "M047"], [22.0, 26.38, "M048"], [28.0, 33.0, "M049"]];
var S08_CAMERA = [1234, 690, 1.4];                  // close on the pen and the garden (the view stays on the sheet)
var S08_DAYS = [15, 22];                            // the days going by: the sky turns, a mound each day

// Its life: the rooster and a hen in the yard by morning, and a flock over; nothing while the days go by (they
// would flicker); after them, as he leads the buffalo out, a hen where it has passed.
var S08_LIFE = [
  // The two roosters walk back off to the left before the days go by, where they had vanished on the spot (owner,
  // 2026-10-21: "some chickens disappear. They should walk back to the left"); x 380 is past the frame's left edge
  // under S08_CAMERA. The hen stays, walking across the yard while the days go by, in front of the pen (owner: "The
  // remaining chicken needs to be in front of the bamboo cage but looks to be behind it"): her layer is "front".
  {name: "rooster", kind: "rooster", layer: "back", look: {feel: "satiated"},
   course: [[0, 620, 958], [5.0, 660, 962, "peck"], [11.6, 660, 962], [14.6, 380, 962], [14.8, 380, 962, "hide"], [15.0, 380, 962, "hide"]]},
  {name: "hen", kind: "hen", layer: "front", course: [[0, 720, 966, "peck"], [6.0, 720, 966], [8.0, 790, 970, "peck"], [14.8, 790, 970, "hide"],
                                                    [38.0, 1880, 958, "hide"], [38.4, 1880, 958, "peck"], [40.0, 1880, 958]]},
  {name: "black rooster", kind: "rooster", layer: "back", look: {black: true, feel: "happy"},   // a black-boned rooster (ไก่ดำ)
   course: [[0, 650, 964], [4.0, 690, 968, "peck"], [11.9, 690, 968], [14.7, 400, 968], [14.8, 400, 968, "hide"], [15.0, 400, 968, "hide"]]},
  {name: "flock", kind: "flock", course: [[1.0, 2150, 200], [12.0, -150, 160]]}
];

function sceneGold(t) {
  var turning = between(t, S08_DAYS[0], S08_DAYS[1]), days = turning * 7;
  var night = turning > 0 && turning < 1 ? 0.5 - 0.5 * Math.cos(days * Math.PI * 2) : 0;   // the days and nights going by, fast
  var mounds = t < 12.7 ? 0 : t < S08_DAYS[0] ? between(t, 12.7, 14.7) : 1 + days * 1.6 + (turning >= 1 ? 6 : 0);
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(S08_CAMERA[2], S08_CAMERA[2]);
  pen.translate(-S08_CAMERA[0], -S08_CAMERA[1]);
  maengYardAt(t, night, 0);
  var tint = night > 0 ? [MAENG_NIGHT[0], MAENG_NIGHT[1] * night] : null;
  maengGarden(t, Math.min(MAENG_MOUNDS.length, mounds), 0, tint);
  decorate(t, S08_LIFE, "back");
  kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {part: "back", tint: tint});
  var pleased = t > 6.2 && t < 12.7;
  maengSiHuHaTa(MAENG_PEN[0] - 60, MAENG_PEN[1] - 22, {size: 0.45, face: 1, feel: pleased ? "satiated" : t < 6 ? "sleepy" : "happy"});
  if (t < 6.4) { goldNugget(pen, MAENG_PEN[0] + 70, MAENG_PEN[1] - 30, 0.9, t, {seed: 3}); }   // on the pen's floor
  kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {part: "front", tint: tint});
  if (night > 0) { pen.filter = "brightness(" + (1 - 0.65 * night).toFixed(3) + ") saturate(" + (1 - 0.4 * night).toFixed(3) + ")"; }
  decorate(t, S08_LIFE, "front");                   // the hen, in front of the pen, as dark as the yard while the nights go by
  pen.filter = "none";
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad"}), x, y = 948;
  if (t < 11.1) {                                   // at the pen: the gold picked up, held up, a wonder
    x = MAENG_PEN[0] + 240;
    var held = t > 6.2;
    lad = Object.assign(lad, {face: -1, feel: held ? "surprised" : "concerned", reachA: held ? [x - 70, y - 175] : [x - 70, y - 130],
                              fingersA: held ? [0.5, 0.55, 0.6, 0.65, 0.4] : undefined});
    var joints = person(x, y, lad);
    if (held) { var hand = maengAt(joints.handA); goldNugget(pen, hand[0] - 4, hand[1] - 10, 2.1, t, {seed: 3}); }   // in his hand, held up
  } else if (t < S08_DAYS[1]) {                     // in the garden: down on his knees, heaping a mound over it
    x = MAENG_MOUNDS[Math.min(MAENG_MOUNDS.length - 1, Math.floor(Math.max(0, mounds - 1)))][0] - 50;
    lad = Object.assign(lad, {face: 1, sit: 1, bend: 0.75, feel: "concerned",
                              reachA: [x + 46, MAENG_GARDEN[1] + 10 + 6 * Math.sin(t * 9)]});
    person(x, y - 10, lad);
  } else if (t < 27) {                              // the garden full: he stands back and looks at it
    x = MAENG_GARDEN[0] - 40;
    person(x, y, Object.assign(lad, {face: 1, feel: "happy"}));
  } else {                                          // and he leads the buffalo out again, as he always did
    var ox = amble("buffalo", t, 2300, 900, 27, {size: 0.55, rope: true});
    maengLead(ox, 2300, 975, lad, 0.55);
  }
  pen.restore();
  if (t < 1.5 || t > 38) {
    pen.fillStyle = "rgba(0, 0, 0, " + Math.max(1 - t / 1.5, between(t, 38, 40)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
