// s10_trough.js - scene 10 of the film of the creature with four ears and five eyes: the golden trough (60 s).
// Day, by the pen: the king's crier goes by on the path, calling the news, and Thukkhata hears it. He digs all his
// gold up from the garden, a heap of it beside him. Dusk: a caravan of Haw traders comes along the path with their
// pack horses; he asks them to help, and he will pay them in gold. Night: under lanterns on poles they kneel along
// the path and hammer, and the golden trough grows from his hut out along the path toward the city. Dawn, at the
// palace: the trough has come all the way across the courtyard to the palace's stair; the last piece is beaten
// in, and it is done.
var S10_LONG = 66.31;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the cicadas by day; the flock going home and a pack horse at dusk; the crickets and the frogs
// of the night; the rooster at dawn.
var S10_SOUND = {calls: [[0, "cicadas", 0.5, 17.26], [17.76, "flock", 0.3], [21.21, "horse", 0.35], [31.95, "crickets", 0.35, 24.12], [31.95, "frogs", 0.45, 24.12], [57.07, "rooster-crow", 0.28]]};
var S10_LINES = [[1.5, 5.33, "M057"], [7.52, 11.7, "M058"], [18.46, 25.11, "M059"], [26.66, 31.8, "M060"], [33.95, 39.83, "M061"], [40.95, 47.84, "M062"], [59.57, 64.06, "M063"]];
var S10_SHOTS = [17.26, 31.95, 56.07];                       // day by the pen; dusk on the path; night; dawn at the palace
var S10_CAMERA = [1234, 690, 1.4];                  // the first shot, close on the pen and the garden, as scene 8's
var S10_HEAP = [1330, 962];                         // where he heaps the gold he digs up
var S10_DIG = [8.14, 15.76];                          // the digging: every mound opened again
var S10_CREW = [[950, 0], [1560, 1], [1830, 2]];    // the traders sitting by the trough at night, each by a lantern
var S10_HORSES = [[1440, "#8a5a3a"], [1700, "#5a4a3a"]];   // unloaded, resting in the field behind the trough
var S10_NIGHT = [820, 1320, 742, 1.6];
var S10_SUN = [880, 395];                           // the dusk shot's sun, going down behind the hills right of the hut (40 px over the shot)
var S10_DAWN_SUN = [1790, 300, 190];                // the dawn shot's sun: its x, and the y it comes up from to the y it reaches             // the night shot's camera: close, panning along the path as the trough grows (x from, to; y; zoom)

// Its life: hens in the garden by day; a flock flying home to roost as the caravan comes at dusk; and at dawn, at
// the palace, mist low over the courtyard and a flock over.
var S10_LIFE = [
  {name: "hen", kind: "hen", course: [[0, 700, 966, "peck"], [7.52, 700, 966], [10.01, 790, 968, "peck"], [17.26, 790, 968]]},
  {name: "flock to roost", kind: "flock", z: "sky", course: [[18.75, -150, 240], [29.7, 2150, 190]]},
  {name: "flock at dawn", kind: "flock", z: "sky", course: [[57.07, 2150, 180], [66.31, -150, 140]]}
];

// x, y: the middle of its foot, in pixels of the sheet; count: how many nuggets; t: seconds (they glint by it). Gives
// back nothing: it draws with pen. e.g. s10Heap(S10_HEAP[0], S10_HEAP[1], 22, t);
function s10Heap(x, y, count, t) {                  // gold heaped on the ground, in rows that narrow upward
  for (var n = 0, row = 0, k = 0; n < count; n++) {
    var across = 6 - row;
    goldNugget(pen, x + (k - (across - 1) / 2) * 15, y - row * 10, 0.9, t, {seed: n, shine: 0.8});
    if (++k >= across) { k = 0; row++; }
  }
}

// joints: what person() gave back for the trader; size: his look's size. Gives back nothing: it draws with pen, in
// the film's own pixels, at the camera's scale. e.g. s10Hammer(person(x, y, maengTrader(1, {face: 1})), MAENG_TRADERS[1].size);
function s10Hammer(joints, size) {                  // a hammer in a trader's near hand: a handle on from the fist, a head of iron
  var h = joints.handA, w = joints.wristA, long = Math.hypot(h[0] - w[0], h[1] - w[1]) || 1;
  var scale = pen.getTransform().a * size;          // the film's pixels to a scene's, under its camera
  var u = [(h[0] - w[0]) / long, (h[1] - w[1]) / long], reach = 46 * scale, end = [h[0] + u[0] * reach, h[1] + u[1] * reach];
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);               // the joints are in the film's own pixels
  pen.lineCap = "round";
  pen.strokeStyle = "#a07a4a";
  pen.lineWidth = 4 * scale;
  pen.beginPath();
  pen.moveTo(h[0], h[1]);
  pen.lineTo(end[0], end[1]);
  pen.stroke();
  pen.strokeStyle = "#8a8a94";
  pen.lineWidth = 12 * scale;
  pen.beginPath();
  pen.moveTo(end[0] - u[1] * 14 * scale, end[1] + u[0] * 14 * scale);
  pen.lineTo(end[0] + u[1] * 14 * scale, end[1] - u[0] * 14 * scale);
  pen.stroke();
  pen.restore();
}

// t: seconds; late: 0 to 1, how far behind the others in its swing (1.6 strikes a second). Gives back {high: 0 to 1,
// spark: 0 to 1 just after it lands, else null}. e.g. var strike = s10Strike(t, 0.37);
function s10Strike(t, late) {                       // 0 to 1: how high a hammer is (it falls fast and rises slow); and a spark as it lands
  var u = (t * 1.6 + late) % 1, high = u < 0.25 ? 1 - u / 0.25 : (u - 0.25) / 0.75;
  return {high: high, spark: u < 0.18 ? u / 0.18 : null};
}

// x, y: where it lands, in pixels of the sheet; u: 0 to 1 since it landed (s10Strike()'s spark); seed: which
// sparks. Gives back nothing: it draws with pen. e.g. if (strike.spark !== null) { s10Sparks(x, y, strike.spark, 3); }
function s10Sparks(x, y, u, seed) {                 // sparks off the gold where a hammer lands: out and up, and gone
  if (u < 0.5) {                                    // the flash where it lands, glowing out
    pen.save();
    pen.globalCompositeOperation = "lighter";
    var flash = pen.createRadialGradient(x, y, 0, x, y, 46);
    flash.addColorStop(0, "rgba(255, 220, 120, " + (0.6 * (1 - 2 * u)).toFixed(3) + ")");
    flash.addColorStop(1, "rgba(255, 200, 90, 0)");
    pen.fillStyle = flash;
    pen.fillRect(x - 46, y - 46, 92, 92);
    pen.restore();
  }
  for (var n = 0; n < 6; n++) {
    var a = -Math.PI * (0.15 + 0.7 * dice(seed * 7 + n)), far = 10 + 34 * u * (0.6 + 0.6 * dice(seed * 3 + n));
    pen.fillStyle = "rgba(255, " + (190 + n * 10) + ", 90, " + (1 - u).toFixed(3) + ")";
    pen.beginPath();
    pen.arc(x + Math.cos(a) * far, y + Math.sin(a) * far + 30 * u * u, 2.6, 0, 7);
    pen.fill();
  }
}

// Scene 10, the entry the film calls (SCENES): t, its own second, 0 to S10_LONG (60 s), in four shots cut through
// black at S10_SHOTS: s10Garden() to 15 s, s10Caravan() to 29 s, s10Night() to 50 s, s10Dawn() after. Gives back
// nothing: it draws the whole sheet with pen. From sets.js: maengDark(), and through its shots the yard, the garden,
// the pen, the trough and the city (see each). Its life is S10_LIFE; its words S10_LINES (M057 to M063), written
// under it by the page. Each shot's z plan is written above it. e.g. sceneTrough(40);
function sceneTrough(t) {
  maengSeason("dry");                               // the hot season: the fields bare and dry (sets.js; NATURE.md)
  if (t < S10_SHOTS[0]) { s10Garden(t); }
  else if (t < S10_SHOTS[1]) { s10Caravan(t); }
  else if (t < S10_SHOTS[2]) { s10Night(t); }
  else { s10Dawn(t); }
  maengDark(t, S10_SHOTS[0] - 1.2, S10_SHOTS[0]);
  maengDark(t, S10_SHOTS[1] - 1.2, S10_SHOTS[1]);
  maengDark(t, S10_SHOTS[2] - 1.2, S10_SHOTS[2]);
  maengDark(t, S10_LONG - 1.2, S10_LONG + 10);
  maengDark(t, -10, 0);
}

// The first shot (t, the scene's second, 0 to 15 s), under the camera S10_CAMERA: the gold dug up over S10_DIG and
// heaped at S10_HEAP. Gives back nothing: it draws with pen. From sets.js: maengYardAt(), maengGarden(), MAENG_MOUNDS,
// MAENG_GARDEN, MAENG_PEN, maengWay(), maengPerson() with MAENG_LAD and MAENG_HERALD.
// Its z plan (oldcartoon.js, Z): the yard and the garden as painted first; then by drawByZ in "people" by their feet:
// the pen with the creature in it (one sprite, at its foot, MAENG_PEN), the lad, the heap of gold, the hen, and the
// crier on the path. e.g. s10Garden(8);
function s10Garden(t) {                             // the crier goes by calling; Thukkhata hears, and digs up his gold
  var dug = between(t, S10_DIG[0], S10_DIG[1]) * MAENG_MOUNDS.length, k = MAENG_PEN;
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(S10_CAMERA[2], S10_CAMERA[2]);
  pen.translate(-S10_CAMERA[0], -S10_CAMERA[1]);
  maengYardAt(t, 0, 0);
  maengGarden(t, MAENG_MOUNDS.length, Math.floor(dug), null);
  var sprites = lifeSprites(t, S10_LIFE).concat([
    {name: "pen", kind: "kok", x: k[0], y: k[1], draw: function () {
      kok(pen, k[0], k[1], k[2], 1, {fine: true, part: "back"});
      maengSiHuHaTa(k[0] - 60, k[1] - 22, {size: 0.45, face: 1, feel: t > 7.52 ? "happy" : "neutral"});
      kok(pen, k[0], k[1], k[2], 1, {fine: true, part: "front"});
    }},
    {name: "heap", kind: "gold", x: S10_HEAP[0], y: S10_HEAP[1], draw: function () { s10Heap(S10_HEAP[0], S10_HEAP[1], Math.floor(dug * 1.2), t); }}
  ]);
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad", feel: t < S10_DIG[0] ? "surprised" : "concerned"}), y = 948, lx, ly;
  if (t < S10_DIG[0]) {                             // in the garden: he looks up at the crier on the path
    lx = MAENG_GARDEN[0] + 120;
    ly = y;
    lad = Object.assign(lad, {face: -1, at: [S10_CAMERA[0] - 300, 760]});
  } else {                                          // down on his knees, opening one mound after another
    var m = MAENG_MOUNDS[Math.min(MAENG_MOUNDS.length - 1, Math.floor(dug))];
    lx = m[0] - 50;
    ly = y - 10;
    lad = Object.assign(lad, {face: 1, sit: 1, bend: 0.75, reachA: [m[0] - 4, MAENG_GARDEN[1] + 10 + 6 * Math.sin(t * 9)]});
  }
  sprites.push({name: "lad", kind: "person", x: lx, y: ly, draw: function () { person(lx, ly, lad); }});
  var crier = stroll(t, 2150, 380, -4, maengPerson("fellow", MAENG_HERALD, {id: "herald"}));   // the king's man crying the news, along the path
  var calling = t > 1.5 && t < 4.99, walks = maengWay(crier.x) + 12;
  if (calling) { crier.look.mouth = {open: 0.1 + 0.3 * Math.abs(Math.sin(t * 7)), wide: 0.5, round: 0.2}; }
  sprites.push({name: "herald", kind: "person", x: crier.x, y: walks, draw: function () { person(crier.x, walks, crier.look); }});
  drawByZ(sprites);
  pen.restore();
}

// The second shot (t, the scene's second, 15 s to 29 s): the horses come from 15.6 s; he asks 24.4 s to 29.3 s. Gives
// back nothing: it draws with pen. From sets.js: maengYard() and its night sheets at 0.4, maengSky("dusk"),
// MAENG_HUT, MAENG_NIGHT, maengGarden(), MAENG_PEN, maengLead() and maengTrader().
// Its z plan (oldcartoon.js, Z): the sky, the yard, the hut and the garden as painted first; then by drawByZ the
// flock in "sky", and in "people" by their feet: the pen with the creature (one sprite, MAENG_PEN), the lad, the heap
// of gold, and the horses on the path, the first two led by their traders: in single file on the path they are at one
// depth (the path's, where they stop), drawn in the line's order, each trader before the horse behind him (by each
// one's own x, the slope of the path put the first horse's hind leg over the second trader). e.g. s10Caravan(25);
function s10Caravan(t) {                            // dusk: the Haw caravan comes along the path; he asks them to help
  var yard = maengYard(), dusk = 0.4, k = MAENG_PEN;
  pen.drawImage(maengSky("sunset"), 0, 0);       // a painted sunset, the sun going down behind the hills at the left
  scenerySun(t, S10_SUN[0], S10_SUN[1] + 40 * between(t, S10_SHOTS[0], S10_SHOTS[1]), 34, {glow: 10, colour: "255, 190, 110"});
  maengClouds(t + 10, "dusk");
  pen.drawImage(yard.back, 0, 0);
  pen.globalAlpha = dusk; pen.drawImage(yard.backNight, 0, 0); pen.globalAlpha = 1;
  pen.drawImage(yard.front, 0, 0);
  pen.globalAlpha = dusk; pen.drawImage(yard.frontNight, 0, 0); pen.globalAlpha = 1;
  var tint = [MAENG_NIGHT[0], MAENG_NIGHT[1] * dusk];
  ruenPhuk(pen, MAENG_HUT[0], MAENG_HUT[1], MAENG_HUT[2] * 0.92, {fine: true, ladder: "in", glow: 0.3, tint: tint});
  maengGarden(t, MAENG_MOUNDS.length, MAENG_MOUNDS.length, tint);
  // asks: his hand out to the heap, to the cut (29.3 s); speaks: his mouth, to the end of the narrator's voice (2026-10-24:
  // the hand once went back with the voice, at 28.46 s, in view: the pop check)
  var asks = t > 26.66 && t < 32.23, speaks = t > 26.66 && t < 31.41, start = 15.6, file = maengWay(1360) + 12;   // the caravan's one depth
  var sprites = lifeSprites(t, S10_LIFE).concat([
    {name: "pen", kind: "kok", x: k[0], y: k[1], draw: function () {
      kok(pen, k[0], k[1], k[2], 1, {fine: true, part: "back", tint: tint});
      maengSiHuHaTa(k[0] - 60, k[1] - 22, {size: 0.45, face: 1, feel: t > 20.23 ? "surprised" : "happy"});
      kok(pen, k[0], k[1], k[2], 1, {fine: true, part: "front", tint: tint});
    }},
    {name: "heap", kind: "gold", x: 820, y: 966, draw: function () { s10Heap(820, 966, 22, t); }},
    {name: "lad", kind: "person", x: 700, y: 962, draw: function () {
      person(700, 962, maengPerson("boy", MAENG_LAD, {id: "lad", face: 1, feel: asks ? "concerned" : "happy",
                                                       reachA: asks ? [820, 780, between(t, 26.66, 27.13)] : undefined,   // out to the heap, eased (once in one frame, a pop)
                                                       mouth: speaks ? {open: 0.08 + 0.26 * Math.abs(Math.sin(t * 8)), wide: 0.5, round: 0.15} : undefined}));
    }}
  ]);
  // Three horses in a line, the first two led; they stop by the pen.
  [[1360, 0], [1730, 1], [2110, null]].forEach(function (h, n) {
    var walk = amble("horse", t, h[0] + 640, h[0], start + n * 0.3, {size: 0.6, pack: ["#c9b48a", "#6a7a8a", "#a8804a"][n],
                                                                         colour: ["#8a5a3a", "#5a4a3a", "#cdb48a"][n]});
    if (h[1] === null) {
      var hoof = maengWay(walk.x) + 6;
      sprites.push({name: "horse" + n, kind: "horse", x: walk.x, y: file, draw: function () { horse(walk.x, hoof, walk.look); }});
      return;
    }
    var feel = t > 29.12 ? "happy" : t > 25.7 ? "concerned" : undefined, feet = maengWay(walk.x) + 12;
    sprites.push({name: "horse" + n, kind: "person", x: walk.x, y: file, draw: function () {
      maengLead(walk, h[0] + 640, feet, maengTrader(h[1], {feel: feel}), 0.6, "horse");
    }});
  });
  drawByZ(sprites);
  pen.save();                                       // the sun's last light, warm from the left, over all of it
  pen.globalCompositeOperation = "lighter";
  var warm = pen.createRadialGradient(S10_SUN[0], S10_SUN[1], 60, S10_SUN[0], S10_SUN[1], 1700);
  warm.addColorStop(0, "rgba(255, 150, 70, 0.16)");
  warm.addColorStop(1, "rgba(255, 150, 70, 0)");
  pen.fillStyle = warm;
  pen.fillRect(0, 0, WIDE, 1080);
  pen.restore();
}

// The third shot (t, the scene's second, 29 s to 50 s), under a camera panning by S10_NIGHT: the trough laid from 0
// to 1 between 29.5 s and 48.5 s, the crew of S10_CREW at it. Gives back nothing: it draws with pen. From sets.js:
// maengYardAt() at night, maengYardTrough(), MAENG_TROUGH_TURN, maengGarden(), MAENG_PEN, MAENG_NIGHT.
// Its z plan (oldcartoon.js, Z): the yard at night as painted first; then by drawByZ, in "back", what is across the
// fields: the resting horses and the traders past the turn; the garden in a band of its own, S10_PLOT, under all that
// stands by it; and in "people" by their feet: the pen with the creature (one sprite, MAENG_PEN), the lad, the traders by
// the path, and the trough, both its parts long things by their lines (s10TroughLine), each before whoever stands in
// front of it: so it runs on along the path in front of the pen and climbs from there to the traders in the fields, in
// one piece (owner, 2026-10-22: "Redo scene 10 so the golden trough is continuous. It should extend past the cage ...
// and then go up to where the workers are"; its far part had been in "back", and the pen's right side hid where the two
// parts meet).
var S10_PLOT = (Z.back + Z.people) / 2;             // the garden's band at night: before the people, after what is across the fields
// part: "near" (along the path, to MAENG_TROUGH_TURN) or "far" (across the fields); x in pixels of the sheet. Gives back
// the y of the yard's trough there, or null where that part does not reach. e.g. s10TroughLine("far", 1500)
function s10TroughLine(part, x) {
  var route = maengTroughRoute();
  if (part === "far") { return x < MAENG_TROUGH_TURN || x > route.far[route.far.length - 1][0] ? null : maengTroughAt(x)[1]; }
  return x < route.near[0][0] || x > MAENG_TROUGH_TURN ? null : maengTroughAt(x)[1];
}

function s10Night(t) {                              // all night under the lanterns: hammering, and the trough grows
  var built = between(t, S10_SHOTS[1] + 0.5, S10_SHOTS[2] - 1.5), k = MAENG_PEN, tint = MAENG_NIGHT, c = S10_NIGHT;
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(c[3], c[3]);
  pen.translate(-mix(c[0], c[1], between(t, S10_SHOTS[1], S10_SHOTS[2])), -c[2]);
  maengYardAt(t, 1, 0.6);
  sceneryFireflies(t, {far: [[[300, 790, 1900, 880], 40, 9]], near: 0});   // fireflies over the fields behind
  var sprites = S10_HORSES.map(function (h, n) {
    return {name: "horse" + n, kind: "horse", z: "back", x: h[0], y: 836, draw: function () {
      horse(h[0], 836, {size: 0.5, colour: blend(h[1], tint[0], tint[1]), face: -1});
    }};
  });
  S10_CREW.forEach(function (c) {                   // across the fields, behind the garden, or by the path
    sprites.push({name: "trader" + c[1], kind: "person", z: c[0] >= MAENG_TROUGH_TURN ? "back" : "people", x: c[0],
                  y: maengTroughAt(c[0])[1] - 8, draw: function () { s10Crew(t, c, built); }});
  });
  sprites.push(
    {name: "trough, far", kind: "trough", line: function (x) { return s10TroughLine("far", x); },
     draw: function () { maengYardTrough(built, "far"); }},
    {name: "garden", kind: "garden", z: S10_PLOT, draw: function () { maengGarden(t, MAENG_MOUNDS.length, MAENG_MOUNDS.length, tint); }},
    {name: "pen", kind: "kok", x: k[0], y: k[1], draw: function () {
      kok(pen, k[0], k[1], k[2], 1, {fine: true, part: "back", tint: tint});
      maengSiHuHaTa(k[0] - 60, k[1] - 22, {size: 0.45, face: 1, feel: "sleepy"});
      kok(pen, k[0], k[1], k[2], 1, {fine: true, part: "front", tint: tint});
    }},
    {name: "lad", kind: "person", x: 640, y: 962, draw: function () { person(640, 962, maengPerson("boy", MAENG_LAD, {id: "lad", face: 1, feel: "happy"})); }},
    {name: "trough, near", kind: "trough", line: function (x) { return s10TroughLine("near", x); },
     draw: function () { maengYardTrough(built, "near"); }}
  );
  drawByZ(sprites);
  S10_CREW.forEach(function (c) {                   // each lantern lights the ground, the man under it and the trough
    var y = maengTroughAt(c[0])[1] - 8;
    sceneryLampLight(t, c[0] + 108, y - 296, y + 4, {reach: 300, seed: c[1] * 3});
  });
  pen.restore();
}

// t: seconds; c: one of S10_CREW, [x, which trader]; built: how much of the trough is laid, 0 to 1 (no sparks
// before it reaches him). Gives back nothing: it draws with pen. e.g. S10_CREW.forEach(function (c) { s10Crew(t, c, 0.5); });
function s10Crew(t, c, built) {                     // a trader sitting behind the trough, by his lantern on its pole, hammering
    var x = c[0], y = maengTroughAt(x)[1] - 8, size = MAENG_TRADERS[c[1]].size;
    pen.strokeStyle = "#3a3226";
    pen.lineWidth = 5;
    pen.beginPath();
    // the pole's foot behind the trough's bar (46 x 0.9 above its line), where it was on the ground and showed under the
    // raised trough as if it stood in front of it (owner, 2026-10-22: "look at the lantern stands. Move where the line for
    // the stand begins up")
    pen.moveTo(x + 70, y - 30); pen.lineTo(x + 70, y - 300);
    pen.quadraticCurveTo(x + 76, y - 312, x + 110, y - 306);
    pen.stroke();
    khom(x + 108, y - 306, {size: 0.3, colour: [KHOM_RED, KHOM_GREEN, KHOM_BLUE][c[1]], lit: 1, late: c[1] * 1.7});
    var strike = s10Strike(t, c[1] * 0.37), anvil = [x + 50, y - 34];   // where the hammer lands: on the trough's lip
    var joints = person(x, y, maengTrader(c[1], {face: 1, floor: "cross", feel: "concerned",
                                                 reachA: [anvil[0] + 20, mix(anvil[1], y - 95, strike.high)]}));
    s10Hammer(joints, size);
    if (strike.spark !== null && built > (x - 600) / (WIDE - 520)) { s10Sparks(anvil[0], anvil[1], strike.spark, c[1] + Math.floor(t * 1.6)); }
}

// The last shot (t, the scene's second, 50 s to 60 s): the last piece beaten in, done at 53.2 s. Gives back nothing:
// it draws with pen. From sets.js: maengCity() (on the first call it adds backDawn and frontDawn to MAENG_CITY, made
// by maengTinted()), maengSky("dawn"), MAENG_CLOUDS.dawn, maengPalace(), MAENG_PALACE, MAENG_STAIR, MAENG_DAWN,
// maengTrader().
// Its z plan (oldcartoon.js, Z): the sky, the city and the mist as painted first; then by drawByZ the flock in "sky"
// (behind the palace), the palace in "set" (its back, then its front), and in "people" by their feet: the trader
// beating in the last piece, the trough by its line (s10DawnLine), and the trader who watches, before it.
// e.g. s10Dawn(52);
// x in pixels of the sheet; gives back the y of the trough at the palace there (its row, 880, falling 4 to the stair), or
// null where it does not reach. e.g. s10DawnLine(500)   // about 878
function s10DawnLine(x) {
  return x < -40 || x > MAENG_STAIR ? null : 880 - 4 * (x + 40) / (MAENG_STAIR + 40);
}

function s10Dawn(t) {                               // dawn at the palace: the trough has come to its stair, and it is done
  var city = maengCity(), p = MAENG_PALACE, row = 880;
  if (!city.backDawn) {
    city.backDawn = maengTinted(city.back, MAENG_DAWN[0], MAENG_DAWN[1]);
    city.frontDawn = maengTinted(city.front, MAENG_DAWN[0], MAENG_DAWN[1]);
  }
  var rise = between(t, S10_SHOTS[2], S10_LONG);   // the sun coming up over the shot, and the city out of the dawn's blue
  pen.drawImage(maengSky("sunrise"), 0, 0);
  scenerySun(t, S10_DAWN_SUN[0], mix(S10_DAWN_SUN[1], S10_DAWN_SUN[2], rise), 30, {glow: 10, colour: "255, 206, 150"});
  maengClouds(t + 90, "dawn");
  pen.drawImage(city.back, 0, 0);
  pen.globalAlpha = 1 - 0.6 * rise; pen.drawImage(city.backDawn, 0, 0); pen.globalAlpha = 1;
  pen.drawImage(city.front, 0, 0);
  pen.globalAlpha = 1 - 0.6 * rise; pen.drawImage(city.frontDawn, 0, 0); pen.globalAlpha = 1;
  softMist(t, 850, 90, 0.55 * (1 - 0.6 * between(t, 60, S10_LONG)), 41, "250, 226, 206");   // the dawn's mist, low over the courtyard, thinning as the sun comes
  var dawnTint = [MAENG_DAWN[0], MAENG_DAWN[1] * (1 - 0.6 * rise)];
  var done = t > 59.27, strike = s10Strike(t, 0), x = MAENG_STAIR - 120;
  drawByZ(lifeSprites(t, S10_LIFE).concat([
    {name: "palace, back", kind: "palace", z: "set", draw: function () { maengPalace(t, "back", dawnTint); }},
    {name: "palace, front", kind: "palace", z: "set", draw: function () { maengPalace(t, "front", dawnTint); }},
    {name: "trader1", kind: "person", x: x, y: row - 8, draw: function () {
      // Done, he gets up over 0.6 s, the hammer still in his hand (he once stood up in one frame, a pop)
      var rise = between(t, 59.27, 59.89);
      var joints = person(x, row - 8, maengTrader(1, {face: 1, sit: 1 - rise, bend: 0.5 * (1 - rise), feel: done ? "happy" : "concerned",
                                                      reachA: rise < 1 ? [x + 40, mix(row - 46, row - 150, strike.high), 1 - rise] : undefined}));
      s10Hammer(joints, MAENG_TRADERS[1].size);
      if (!done && strike.spark !== null) { s10Sparks(x + 46, row - 52, strike.spark, Math.floor(t * 1.6)); }
    }},
    {name: "trough", kind: "trough", line: s10DawnLine, draw: function () {
      linKham(pen, [[-40, row], [MAENG_STAIR, row - 4]], 1, {size: 1.2});
      maengGlint(t, [[-40, row], [MAENG_STAIR, row - 4]], 46 * 1.2, S10_SHOTS[2], 3.5);   // the first light running along its gold (sets.js)
    }},
    {name: "trader0", kind: "person", x: x - 240, y: row + 30, draw: function () {
      person(x - 240, row + 30, maengTrader(0, {face: 1, feel: done ? "laughing" : "happy"}));
    }}
  ]));
}
