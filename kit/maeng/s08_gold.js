// s08_gold.js - scene 8 of the film of the creature with four ears and five eyes: gold (45.12 s; 40 s until
// 2026-10-24, when the narrator's own words for M045 and M046 came in longer: 4.9 s inserted at 6.0 s, 0.22 s at
// 10.9 s, every moment after them moved with them, film_relayout.py in the voice project).
// Morning by the pen: something glints on its floor. Thukkhata picks it up, and it is gold: the creature's
// droppings have turned to gold, and it looks very pleased with itself. He buries the gold in his garden, and
// day after day there is another mound, until the garden is full. And he still leads the headman's buffalo
// out, as he always did.
var S08_LONG = 50.49;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the morning's rooster and hens, the cicadas, the buffalo as he leads it out.
var S08_SOUND = {calls: [[0, "cicadas", 0.5, 50.49], [1, "rooster-crow", 0.28], [3.61, "hens", 0.55], [38.8, "buffalo", 0.45]]};
var S08_LINES = [[2.0, 9.23, "M045"], [11.1, 17.74, "M046"], [17.95, 24.59, "M047"], [30.44, 37.55, "M048"], [39.3, 45.49, "M049"]];
var S08_CAMERA = [1234, 690, 1.4];                  // close on the pen and the garden (the view stays on the sheet)
var S08_DAYS = [23.18, 30.44];                            // the days going by: the sky turns, a mound each day

// Its life: the rooster and a hen in the yard by morning, and a flock over; nothing while the days go by (they
// would flicker); after them, as he leads the buffalo out, a hen where it has passed.
var S08_LIFE = [
  // The two roosters walk back off to the left before the days go by, where they had vanished on the spot (owner,
  // 2026-10-21: "some chickens disappear. They should walk back to the left"); x 380 is past the frame's left edge
  // under S08_CAMERA. The hen stays, walking across the yard while the days go by, in front of the pen (owner: "The
  // remaining chicken needs to be in front of the bamboo cage but looks to be behind it"): her feet are nearer than its.
  {name: "rooster", kind: "rooster", look: {feel: "satiated"},
   course: [[0, 620, 958], [4.42, 660, 962, "peck"], [18.62, 660, 962], [22.65, 380, 962], [22.92, 380, 962, "hide"], [23.18, 380, 962, "hide"]]},
  {name: "hen", kind: "hen", course: [[0, 720, 966, "peck"], [10.38, 720, 966], [13.59, 790, 970, "peck"], [22.92, 790, 970, "hide"],
                                                    [48.49, 1880, 958], [48.89, 1880, 958, "peck"], [50.49, 1880, 958]]},
  {name: "black rooster", kind: "rooster", look: {black: true, feel: "happy"},   // a black-boned rooster (ไก่ดำ)
   course: [[0, 650, 964], [3.61, 690, 968, "peck"], [19.02, 690, 968], [22.78, 400, 968], [22.92, 400, 968, "hide"], [23.18, 400, 968, "hide"]]},
  {name: "flock", kind: "flock", z: "sky", course: [[1.0, 2150, 200], [19.16, -150, 160]]}
];

// The sun and the moon crossing the sky as the days go by (owner, 2026-10-26: "go with your plans for 8"): each day
// the sun comes up from behind the hills at the left of the view, climbs over them and goes down behind them at the
// right, and the moon after it by night; on a plain day the sun stands at its noon. days: the days gone by (0 at
// noon of the first, a whole number at each noon after). Gives back nothing: it draws with pen, in the sheet's pixels,
// before the clouds and the hills (maengYardAt()'s heavens).
var S08_ARC = [1380, 2050, 440, 95];               // where it rises and sets (x), the y it rises from, how high it climbs
function s08Heavens(days) {
  var s = ((days % 1) + 0.25) % 1, day = s < 0.5, u = (day ? s : s - 0.5) * 2;
  var x = S08_ARC[0] + (S08_ARC[1] - S08_ARC[0]) * u, y = S08_ARC[2] - S08_ARC[3] * Math.sin(Math.PI * u);
  if (day) { scenerySun(0, x, y, 20, {alpha: 1}); }
  else { sceneryMoon(0, x, y, 14, {alpha: 1, glow: 5}); }
}

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
  maengSeason("stubble");                           // the dry months: stubble and a dry-season plot (sets.js; NATURE.md)
  var turning = between(t, S08_DAYS[0], S08_DAYS[1]), days = turning * 7;
  var night = turning > 0 && turning < 1 ? 0.5 - 0.5 * Math.cos(days * Math.PI * 2) : 0;   // the days and nights going by, fast
  var mounds = t < 20.1 ? 0 : t < S08_DAYS[0] ? between(t, 20.1, 22.78) : 1 + days * 1.6 + (turning >= 1 ? 6 : 0);
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(S08_CAMERA[2], S08_CAMERA[2]);
  pen.translate(-S08_CAMERA[0], -S08_CAMERA[1]);
  // The folk of the fields go home as the days begin to race (fading out over 0.8 s) and come back as they end: at a day a
  // second they blinked on and off with every night (the blink check, 2026-10-22).
  maengYardAt(t, night, 0, undefined, between(t, S08_DAYS[0], S08_DAYS[0] + 0.8) * (1 - between(t, S08_DAYS[1], S08_DAYS[1] + 0.8)),
              undefined, function () { s08Heavens(days); });
  var tint = night > 0 ? [MAENG_NIGHT[0], MAENG_NIGHT[1] * night] : null;
  maengGarden(t, Math.min(MAENG_MOUNDS.length, mounds), 0, tint);
  var pleased = t > 11.1 && t < 20.1;
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
    kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {fine: true, part: "back", tint: tint});
    maengSiHuHaTa(MAENG_PEN[0] - 60, MAENG_PEN[1] - 22, {size: 0.45, face: 1, feel: pleased ? "satiated" : t < 10.38 ? "sleepy" : "happy"});
    if (t < 11.38) { goldNugget(pen, MAENG_PEN[0] + 70, MAENG_PEN[1] - 30, 0.9, t, {seed: 3}); }   // on the pen's floor
    kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {fine: true, part: "front", tint: tint});
  }});
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad"}), x, y = 948;
  if (t < 17.95) {                                 // at the pen: the gold picked up, held up, a wonder
    x = MAENG_PEN[0] + 240;
    var held = t > 11.1;
    lad = Object.assign(lad, {face: -1, feel: held ? "surprised" : "concerned", reachA: [x - 70, y - 130 - 45 * between(t, 11.1, 11.65)],   // held up over 0.4 s (once in one frame, a pop)
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
  } else if (t < 38.3) {                           // the garden full: he stands back and looks at it
    x = MAENG_GARDEN[0] - 40;
    sprites.push({name: "lad", kind: "person", x: x, y: y, draw: function () { person(x, y, Object.assign(lad, {face: 1, feel: "happy"})); }});
  } else {                                          // and he leads the buffalo out again, as he always did
    var ox = amble("buffalo", t, 2300, 900, 38.3, {size: 0.55, rope: true});
    sprites.push({name: "lad and buffalo", kind: "person", x: ox.x, y: 975, draw: function () { maengLead(ox, 2300, 975, lad, 0.55); }});
  }
  drawByZ(sprites);
  pen.restore();
  // the plain days' air, a little light and a butterfly over the garden (sets.js MAENG_AIR.gold), gone while the days
  // race and back after them
  var calm = 1 - between(t, S08_DAYS[0] - 1, S08_DAYS[0]) + between(t, S08_DAYS[1], S08_DAYS[1] + 1);
  if (calm > 0) { pen.save(); pen.globalAlpha = calm; maengAir(t, "gold"); pen.restore(); }
  // A short dip to dark between him standing back from the full garden and leading the buffalo out, where he blinked
  // out of the garden and into the edge of the picture at 32.12 s (the blink check, 2026-10-22): the picture is black
  // at 32.12 s, when the lead begins, and back by 33.32 s, before "But he still herded buffalo" (M049).
  maengDark(t, 37.06, 38.3);
  if (t < 1.5 || t > 48.49) {
    pen.fillStyle = "rgba(0, 0, 0, " + Math.max(1 - t / 1.5, between(t, 48.49, 50.49)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
