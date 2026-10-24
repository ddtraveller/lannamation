// s08_gold.js - scene 8 of the film of the creature with four ears and five eyes: gold (45.12 s; 40 s until
// 2026-10-24, when the narrator's own words for M045 and M046 came in longer: 4.9 s inserted at 6.0 s, 0.22 s at
// 10.9 s, every moment after them moved with them, film_relayout.py in the voice project).
// Morning by the pen: something glints on its floor. Thukkhata picks it up, and it is gold: the creature's
// droppings have turned to gold, and it looks very pleased with itself. He buries the gold in his garden, and
// day after day there is another mound, until the garden is full. And he still leads the headman's buffalo
// out, as he always did.
var S08_LONG = 45.12;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the morning's rooster and hens, the cicadas, the buffalo as he leads it out.
var S08_SOUND = {calls: [[0, "cicadas", 0.5, 45.12], [1, "rooster-crow", 0.28], [4, "hens", 0.55], [32.62, "buffalo", 0.45]]};
var S08_LINES = [[2.0, 10.9, "M045"], [11.1, 16.02, "M046"], [16.22, 21.3, "M047"], [27.12, 31.38, "M048"], [33.12, 40.12, "M049"]];
var S08_CAMERA = [1234, 690, 1.4];                  // close on the pen and the garden (the view stays on the sheet)
var S08_DAYS = [20.12, 27.12];                            // the days going by: the sky turns, a mound each day

// Its life: the rooster and a hen in the yard by morning, and a flock over; nothing while the days go by (they
// would flicker); after them, as he leads the buffalo out, a hen where it has passed.
var S08_LIFE = [
  // The two roosters walk back off to the left before the days go by, where they had vanished on the spot (owner,
  // 2026-10-21: "some chickens disappear. They should walk back to the left"); x 380 is past the frame's left edge
  // under S08_CAMERA. The hen stays, walking across the yard while the days go by, in front of the pen (owner: "The
  // remaining chicken needs to be in front of the bamboo cage but looks to be behind it"): her feet are nearer than its.
  {name: "rooster", kind: "rooster", look: {feel: "satiated"},
   course: [[0, 620, 958], [5.0, 660, 962, "peck"], [16.72, 660, 962], [19.72, 380, 962], [19.92, 380, 962, "hide"], [20.12, 380, 962, "hide"]]},
  {name: "hen", kind: "hen", course: [[0, 720, 966, "peck"], [10.9, 720, 966], [12.9, 790, 970, "peck"], [19.92, 790, 970, "hide"],
                                                    [43.12, 1880, 958, "hide"], [43.52, 1880, 958, "peck"], [45.12, 1880, 958]]},
  {name: "black rooster", kind: "rooster", look: {black: true, feel: "happy"},   // a black-boned rooster (ไก่ดำ)
   course: [[0, 650, 964], [4.0, 690, 968, "peck"], [17.02, 690, 968], [19.82, 400, 968], [19.92, 400, 968, "hide"], [20.12, 400, 968, "hide"]]},
  {name: "flock", kind: "flock", z: "sky", course: [[1.0, 2150, 200], [17.12, -150, 160]]}
];

// Scene 8, the entry the film calls (SCENES): t, its own second, 0 to S08_LONG (45.12 s): the gold on the pen's floor,
// picked up at 11.1 s; the first mound from 17.82 s; the days go by at S08_DAYS (20.12 s to 27.12 s), a mound each;
// the full garden; from 32.12 s he leads the buffalo out; out of black over 1.5 s, into it from 43.12 s. Gives back nothing: it draws
// the whole sheet with pen, under the camera S08_CAMERA. From sets.js: maengYardAt(), maengGarden(), MAENG_MOUNDS,
// MAENG_GARDEN, MAENG_PEN, MAENG_NIGHT, maengAt(), maengLead(), maengPerson() with MAENG_LAD. Its life is S08_LIFE;
// its words S08_LINES (M045 to M049), written under it by the page.
// Its z plan (oldcartoon.js, Z): the yard and the garden as painted first; then by drawByZ the flock in "sky", and in
// "people" by their feet: the roosters (left of the pen), the pen with the creature and the gold on its floor (one
// sprite, at its foot, MAENG_PEN), the lad, the hen (her feet nearer than the pen's; while the nights go by she is
// drawn as dark as the yard), and the lad leading the buffalo. e.g. sceneGold(18);
function sceneGold(t) {
  var turning = between(t, S08_DAYS[0], S08_DAYS[1]), days = turning * 7;
  var night = turning > 0 && turning < 1 ? 0.5 - 0.5 * Math.cos(days * Math.PI * 2) : 0;   // the days and nights going by, fast
  var mounds = t < 17.82 ? 0 : t < S08_DAYS[0] ? between(t, 17.82, 19.82) : 1 + days * 1.6 + (turning >= 1 ? 6 : 0);
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(S08_CAMERA[2], S08_CAMERA[2]);
  pen.translate(-S08_CAMERA[0], -S08_CAMERA[1]);
  // The folk of the fields go home as the days begin to race (fading out over 0.8 s) and come back as they end: at a day a
  // second they blinked on and off with every night (the blink check, 2026-10-22).
  maengYardAt(t, night, 0, undefined, between(t, S08_DAYS[0], S08_DAYS[0] + 0.8) * (1 - between(t, S08_DAYS[1], S08_DAYS[1] + 0.8)));
  var tint = night > 0 ? [MAENG_NIGHT[0], MAENG_NIGHT[1] * night] : null;
  maengGarden(t, Math.min(MAENG_MOUNDS.length, mounds), 0, tint);
  var pleased = t > 11.1 && t < 17.82;
  var sprites = lifeSprites(t, S08_LIFE).map(function (one) {
    if (one.name !== "hen" || night <= 0) { return one; }
    var drawn = one.draw;                           // the hen, as dark as the yard while the nights go by
    one.draw = function () {
      pen.filter = "brightness(" + (1 - 0.65 * night).toFixed(3) + ") saturate(" + (1 - 0.4 * night).toFixed(3) + ")";
      drawn();
      pen.filter = "none";
    };
    return one;
  });
  sprites.push({name: "pen", kind: "kok", x: MAENG_PEN[0], y: MAENG_PEN[1], draw: function () {
    kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {part: "back", tint: tint});
    maengSiHuHaTa(MAENG_PEN[0] - 60, MAENG_PEN[1] - 22, {size: 0.45, face: 1, feel: pleased ? "satiated" : t < 10.9 ? "sleepy" : "happy"});
    if (t < 11.3) { goldNugget(pen, MAENG_PEN[0] + 70, MAENG_PEN[1] - 30, 0.9, t, {seed: 3}); }   // on the pen's floor
    kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {part: "front", tint: tint});
  }});
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad"}), x, y = 948;
  if (t < 16.22) {                                 // at the pen: the gold picked up, held up, a wonder
    x = MAENG_PEN[0] + 240;
    var held = t > 11.1;
    lad = Object.assign(lad, {face: -1, feel: held ? "surprised" : "concerned", reachA: [x - 70, y - 130 - 45 * between(t, 11.1, 11.5)],   // held up over 0.4 s (once in one frame, a pop)
                              fingersA: held ? [0.5, 0.55, 0.6, 0.65, 0.4] : undefined});
    sprites.push({name: "lad", kind: "person", x: x, y: y, draw: function () {
      var joints = person(x, y, lad);
      if (held) { var hand = maengAt(joints.handA); goldNugget(pen, hand[0] - 4, hand[1] - 10, 2.1, t, {seed: 3}); }   // in his hand, held up
    }});
  } else if (t < S08_DAYS[1]) {                     // in the garden: down on his knees, heaping a mound over it
    x = MAENG_MOUNDS[Math.min(MAENG_MOUNDS.length - 1, Math.floor(Math.max(0, mounds - 1)))][0] - 50;
    lad = Object.assign(lad, {face: 1, sit: 1, bend: 0.75, feel: "concerned",
                              reachA: [x + 46, MAENG_GARDEN[1] + 10 + 6 * Math.sin(t * 9)]});
    sprites.push({name: "lad", kind: "person", x: x, y: y - 10, draw: function () { person(x, y - 10, lad); }});
  } else if (t < 32.12) {                           // the garden full: he stands back and looks at it
    x = MAENG_GARDEN[0] - 40;
    sprites.push({name: "lad", kind: "person", x: x, y: y, draw: function () { person(x, y, Object.assign(lad, {face: 1, feel: "happy"})); }});
  } else {                                          // and he leads the buffalo out again, as he always did
    var ox = amble("buffalo", t, 2300, 900, 32.12, {size: 0.55, rope: true});
    sprites.push({name: "lad and buffalo", kind: "person", x: ox.x, y: 975, draw: function () { maengLead(ox, 2300, 975, lad, 0.55); }});
  }
  drawByZ(sprites);
  pen.restore();
  // A short dip to dark between him standing back from the full garden and leading the buffalo out, where he blinked
  // out of the garden and into the edge of the picture at 32.12 s (the blink check, 2026-10-22): the picture is black
  // at 32.12 s, when the lead begins, and back by 33.32 s, before "But he still herded buffalo" (M049).
  maengDark(t, 30.92, 32.12);
  if (t < 1.5 || t > 43.12) {
    pen.fillStyle = "rgba(0, 0, 0, " + Math.max(1 - t / 1.5, between(t, 43.12, 45.12)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
