// s04_wish.js - scene 4 of the film of the creature with four ears and five eyes: the father's wish (60 s).
// The cold season, at night, inside the hut by one oil lamp: the father, very ill, sits on his sleeping mat
// against the bamboo wall with a cloth over his knees; Thukkhata sits by him, his legs folded to one side as
// one sits before an elder. The father speaks his wish. The boy takes his hand. The lamp burns low and goes
// out; nothing more is shown.
var S04_LONG = 62.39;   // 60 until 2026-10-24: 2.39 s inserted for the narrator's own reading (scene_retime.py)
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets outside the hut, low; a squeak as each mouse comes in.
var S04_SOUND = {calls: [[0, "crickets", 0.22, 62.39], [3.4, "mouse-squeak", 0.15], [21.67, "mouse-squeak", 0.13]]};
var S04_LINES = [[1.5, 5.99, "M015"], [6.19, 9.75, "M016"], [10.0, 15.78, "M017"], [15.98, 21.47, "M018"], [21.67, 27.54, "M019"],
                 [27.74, 33.19, "M020"], [33.39, 38.79, "M021"], [40.39, 45.64, "M022"], [46.39, 51.39, "M023"]];
var S04_SPEAKS = [[10.0, 15.38], [15.98, 21.07], [21.67, 27.14], [27.74, 32.79], [33.39, 38.39]];   // the lines the father says himself:
// his mouth moves through them, a shape as mouthAt() gives one (the voice is the narrator's; the film's words are
// timed to it later)
var S04_LAMP = [930, 925];                          // the lamp on the floor between them
var S04_POST = [1790, 710, 34];                     // the room's corner post at the right: its left, its foot, its width (s04Room)
var S04_NEAR = 2;                                   // the two are drawn this much larger than in the yard: the room is close
var S04_ROOM = null;

// Its life: two mice creep through the hut, and a tokay comes down the wall.
// They are drawn a little larger than life, as a cartoon draws small animals, so that they read in the room.
// Each keeps to the right of the room, in the lamp's reach, away from the father and his son; each is still while
// the father speaks his wish; the mice are gone before the grief (38 s on), and the tokay stays high on the wall.
var S04_LIFE = [
  // The house mouse: in from the dark at the room's edge, out from behind the corner post (S04_POST) and across the
  // doorway's sill, along the foot of the wall; it sniffs as the father calls his son close (M016), sits up while he
  // speaks (M017, M018), and away the way it came, across the sill, behind the post and out past the picture's edge;
  // in again to sit up at "set a snare" (M020), and away the same way before the grief. It is never put out where it is
  // seen (owner, 2026-10-22: "Have the mouse go to the far edge of the door so it looks like it's walking outside", then
  // "Walk on behind the post", when the blink check still saw it go at the doorway's edge).
  {name: "house mouse", kind: "mouse", look: {kind: "house", size: 0.8},
   course: [[2.5, 2010, 703, "hide"], [2.6, 2010, 703], [5.8, 1330, 705, "sniff"], [9.4, 1330, 705], [10.6, 1250, 707, "up"],
            [14.6, 1250, 707], [17.78, 2010, 703, "hide"], [25.47, 2010, 703], [28.07, 1300, 705, "up"], [31.67, 1300, 705],
            [35.39, 2010, 703, "hide"], [35.59, 2010, 703, "hide"]]},
  // The field mouse: in along the floor from the far post during the wish (M019), it sniffs at the mat's edge,
  // then hurries back, and hides.
  {name: "field mouse", kind: "mouse", look: {kind: "field", size: 0.8},
   course: [[20.08, 1780, 790, "hide"], [20.58, 1780, 790], [24.67, 1500, 822, "sniff"], [28.87, 1500, 822], [29.27, 1475, 828, "sniff"],
            [30.87, 1475, 828], [31.87, 1790, 792, "hide"], [33.39, 1790, 792, "hide"]]},
  // The tokay: down the wall from the beam, to rest above the boy; in the quiet after "look after it" (M021 ends
  // 35.6, M022 begins 38.0) it calls once, to-kay; then it climbs back up as the lamp burns low, and stays there at
  // the top of the wall, under the beam. Its way keeps left of the doorway (x 1440 to 1650 from y 230), on the
  // woven wall: it crossed the door's top corner before, over the night (owner, 2026-10-20: "crawls over empty air
  // when moving over the door frame ... make it stop and stay where it is at the top of the wall").
  {name: "tokay", kind: "gecko", z: "set", look: {size: 1.0},     // on the wall: of the set
   // Back up, it turns wide: on down a little, round to the right and up on its own line, no corner sharper than
   // about 60 degrees, where it went straight back up the way it came and folded over itself (owner, 2026-10-21: "When
   // it walks up the wall it folds over itself"; the kit's gecko() also bends no more than GECKO_BEND a joint now).
   course: [[0, 1400, 104], [9.0, 1380, 200], [13.0, 1350, 260], [22.27, 1290, 350], [25.27, 1250, 390, "rest"], [41.89, 1250, 390],
            [42.99, 1222, 425], [43.99, 1225, 470], [44.89, 1262, 492], [45.69, 1305, 470], [46.69, 1330, 400], [47.99, 1328, 260],
            [49.39, 1320, 112, "rest"], [62.39, 1320, 112]],
   calls: [[38.39, "tokay", 0.5]]}
];

// Gives back a canvas, WIDE by 1080, painted on the first call and kept in S04_ROOM after.
// e.g. pen.drawImage(s04Room(), 0, 0);
function s04Room() {                                // the inside of the hut, painted once: the wall, the floor, the door
  if (S04_ROOM) { return S04_ROOM; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), k, n;
  // The back wall of flattened split bamboo (ฟาก), the strips upright, a rail across bound to the posts with rattan:
  // the wall of the bamboo house outside (ruenPhuk; the kit's research, 2026-10-20).
  b.fillStyle = "#cdb47a";
  b.fillRect(0, 0, WIDE, 700);
  for (k = 0; k < WIDE; k += 26) {
    b.fillStyle = (k / 26) % 2 ? "#c7ad72" : "#d3bb82";
    b.fillRect(k, 0, 24, 700);
    b.strokeStyle = "#a48a54";
    b.lineWidth = 2;
    b.beginPath(); b.moveTo(k + 25, 0); b.lineTo(k + 25, 700); b.stroke();
    b.strokeStyle = "rgba(140, 110, 60, 0.6)";      // the node, split open, in a ragged line across
    b.lineWidth = 4;
    var nodeY = 330 + 24 * Math.sin(k * 0.13);
    b.beginPath(); b.moveTo(k + 2, nodeY); b.lineTo(k + 22, nodeY + 2); b.stroke();
    // the strip's fine grain: its fibres, a split or two, its nodes as ridges (scenery.js; owner, 2026-10-26: "Look at
    // the bamboo or wood and see if you can give it fine grained detail as well as the floor")
    sceneryBambooGrain(b, k, 0, 24, 700, {along: "y", nodes: [nodeY, nodeY - 250 + 30 * Math.sin(k * 0.07), nodeY + 260], seed: k / 26 + 1});
  }
  b.fillStyle = "#8a6a40";                          // the rail, and the rattan ties at each post
  b.fillRect(0, 300, WIDE, 14);
  sceneryWoodGrain(b, 0, 300, WIDE, 14, {along: "x", seed: 31, knots: 0});
  b.strokeStyle = "#5a3a1e";
  b.lineWidth = 4;
  [107, 1807].forEach(function (px) { b.beginPath(); b.moveTo(px - 22, 294); b.lineTo(px + 22, 320); b.moveTo(px + 22, 294); b.lineTo(px - 22, 320); b.stroke(); });
  b.fillStyle = "#6e4c30";                          // posts at the corners of the room, and the beam under the roof
  b.fillRect(90, 0, 34, 710);
  b.fillRect(1790, 0, 34, 710);
  b.fillRect(0, 70, WIDE, 26);
  sceneryWoodGrain(b, 90, 0, 34, 710, {along: "y", seed: 32});   // their grain and knots
  sceneryWoodGrain(b, 1790, 0, 34, 710, {along: "y", seed: 33});
  sceneryWoodGrain(b, 0, 70, WIDE, 26, {along: "x", seed: 34, knots: 3});
  b.fillStyle = "#0e1230";                          // the doorway, open on the night: stars, and the ladder's top
  b.fillRect(1440, 230, 210, 470);
  for (n = 0; n < 26; n++) {
    b.fillStyle = "rgba(255, 250, 220, " + (0.4 + 0.6 * dice(n + 5)) + ")";
    b.beginPath();
    b.arc(1450 + dice(n + 30) * 190, 240 + dice(n + 60) * 380, 1.4 + dice(n + 90) * 1.2, 0, 7);
    b.fill();
  }
  b.strokeStyle = "#5a4630";
  b.lineWidth = 8;
  b.beginPath(); b.moveTo(1500, 700); b.lineTo(1496, 640); b.moveTo(1590, 700); b.lineTo(1594, 640); b.stroke();
  b.strokeStyle = "#4a3422";
  b.lineWidth = 6;
  b.strokeRect(1440, 230, 210, 470);
  b.fillStyle = "#8a6a44";                          // the floor of split bamboo, its slats running back
  b.fillRect(0, 700, WIDE, 380);
  for (k = -1; k < 9; k++) {                        // each slat its own tone and fine grain
    var y0 = k < 0 ? 700 : 708 + k * (12 + k * 4.5), y1 = 708 + (k + 1) * (12 + (k + 1) * 4.5);
    b.fillStyle = k % 2 ? "rgba(255, 236, 200, 0.05)" : "rgba(60, 40, 20, 0.06)";
    b.fillRect(0, y0, WIDE, y1 - y0);
    for (var seg = 0; seg < WIDE; seg += 640) {
      sceneryBambooGrain(b, seg, y0, 640, y1 - y0, {along: "x", nodes: [120 + 200 * dice(k * 3 + seg), 420 + 150 * dice(k * 5 + seg)], seed: 50 + k * 7 + seg / 640});
    }
  }
  b.strokeStyle = "rgba(70, 48, 28, 0.55)";         // the gaps between the slats, dark
  b.lineWidth = 2;
  for (k = 0; k < 9; k++) {
    var fy = 708 + k * (12 + k * 4.5);
    b.beginPath(); b.moveTo(0, fy); b.lineTo(WIDE, fy); b.stroke();
  }
  b.fillStyle = "#7a5234";                          // the hearth: a wooden tray of packed earth, three stones in it, under the pot
  b.fillRect(1600, 722, 200, 34);
  b.fillStyle = "#9a7650";
  b.fillRect(1608, 726, 184, 22);
  b.fillStyle = "#6e6a62";
  [[1668, 738], [1700, 734], [1732, 738]].forEach(function (st) { b.beginPath(); b.ellipse(st[0], st[1], 14, 9, 0, 0, 7); b.fill(); });
  b.fillStyle = "#d9c48c";                          // the sleeping mat of reed, a plain weave, under the father
  b.beginPath();
  b.moveTo(250, 800); b.lineTo(1390, 800); b.lineTo(1470, 960); b.lineTo(170, 960);
  b.closePath();
  b.fill();
  b.save();
  b.clip();
  b.strokeStyle = "rgba(150, 120, 60, 0.6)";
  b.lineWidth = 3;
  for (k = 170; k < 1480; k += 18) { b.beginPath(); b.moveTo(k, 800); b.lineTo(k - 34, 960); b.stroke(); }
  for (k = 808; k < 960; k += 15) { b.beginPath(); b.moveTo(150, k); b.lineTo(1480, k); b.stroke(); }
  b.restore();
  b.fillStyle = "#e4dcc8";                          // his pillow, a hard roll at the wall's foot
  b.beginPath();
  b.ellipse(330, 800, 120, 32, -0.05, 0, 7);
  b.fill();
  S04_ROOM = paper;
  return paper;
}

// x, y: its middle, in pixels of the sheet; size: 1 as drawn. Gives back nothing: it draws with pen.
// e.g. s04Blanket(770, 905, 1.25);
function s04Blanket(x, y, size) {                   // a cloth of faded checks over the father's knees
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  pen.translate(-x, -y);
  pen.beginPath();
  pen.moveTo(x - 112, y - 6);                       // low and soft over the knees, falling to the mat
  pen.quadraticCurveTo(x - 60, y - 40, x, y - 38);
  pen.quadraticCurveTo(x + 60, y - 40, x + 112, y - 6);
  pen.quadraticCurveTo(x + 124, y + 10, x + 104, y + 14);
  pen.quadraticCurveTo(x, y + 20, x - 104, y + 14);
  pen.quadraticCurveTo(x - 124, y + 10, x - 112, y - 6);
  pen.closePath();
  shape("#7d6a8a");
  pen.clip();
  pen.strokeStyle = "rgba(220, 200, 170, 0.35)";
  pen.lineWidth = 6;
  for (var k = -140; k < 140; k += 22) {
    pen.beginPath(); pen.moveTo(x + k, y - 90); pen.lineTo(x + k, y + 30); pen.stroke();
    pen.beginPath(); pen.moveTo(x - 140, y - 70 + (k + 140) * 0.4); pen.lineTo(x + 140, y - 70 + (k + 140) * 0.4); pen.stroke();
  }
  pen.restore();
}

// Scene 4, the entry the film calls (SCENES): t, its own second, 0 to S04_LONG (60 s): the father speaks (S04_SPEAKS,
// 10 s to 35.6 s), the boy holds his hand from 37.5 s, the lamp goes out 46 s to 50.5 s, black from 55 s. Gives back
// nothing: it draws the whole sheet with pen. From sets.js: MAENG_HUT_THINGS, maengPerson() with MAENG_FATHER and
// MAENG_LAD. Its life is S04_LIFE; its words S04_LINES (M015 to M023), written under it by the page.
// The night through the open doorway, drawn after the room's dark, for the lamp does not light it: the night sky with
// its fine stars, a few twinkling, and the moon low in the corner (scenery.js), Doi Khao Khwai dark against it with a
// rim of moonlight, then the ladder's top and the door's frame. t: the scene's second. Gives back nothing: it draws
// with pen. e.g. s04Night(20);
var S04_DOOR = [1440, 230, 210, 470];                // the doorway: its left, top, width and height (s04Room() paints it)
function s04Night(t) {
  var d = S04_DOOR, x;
  pen.save();
  pen.beginPath();
  pen.rect(d[0], d[1], d[2], d[3]);
  pen.clip();
  var sky = pen.createLinearGradient(0, d[1], 0, d[1] + d[3]);
  sky.addColorStop(0, "#070b24");
  sky.addColorStop(1, "#262a58");
  pen.fillStyle = sky;
  pen.fillRect(d[0], d[1], d[2], d[3]);
  sceneryStars(t, {band: null, horizon: 700, count: 1600, bright: 30, glow: null});
  sceneryMoon(t, d[0] + d[2] - 34, d[1] + 70, 20, {glow: 5});
  pen.beginPath();                                  // the mountain, dark, its top lit by the moon
  pen.moveTo(d[0], d[1] + d[3]);
  for (x = d[0]; x <= d[0] + d[2]; x += 6) { pen.lineTo(x, d[1] + 330 - 110 * Math.exp(-Math.pow((x - d[0] - 140) / 70, 2)) - 6 * Math.sin(x * 0.09)); }
  pen.lineTo(d[0] + d[2], d[1] + d[3]);
  pen.closePath();
  pen.fillStyle = "#0b0e22";
  pen.fill();
  pen.strokeStyle = "rgba(120, 132, 180, 0.5)";
  pen.lineWidth = 2;
  pen.stroke();
  pen.strokeStyle = "#5a4630";                      // the ladder's top
  pen.lineWidth = 8;
  pen.beginPath(); pen.moveTo(1500, 700); pen.lineTo(1496, 640); pen.moveTo(1590, 700); pen.lineTo(1594, 640); pen.stroke();
  pen.restore();
  pen.strokeStyle = "#2a1e14";                      // the frame, in the dark of the room
  pen.lineWidth = 6;
  pen.strokeRect(d[0], d[1], d[2], d[3]);
}

// Its z plan (oldcartoon.js, Z): the room as painted first; then by drawByZ the tokay in "set" (on the wall), and in
// "people" by their feet or bases: the mice at the wall's foot and the mat's edge (703 to 828), the hut's things (the
// hearth's pot, the baskets, 748 to 770: the house mouse runs behind the pot on its way to the post), the corner
// post at the right drawn again at its foot (710), so the house mouse goes behind it, the father under his blanket
// (900), the boy (905), the lamp on the floor between them (925).
// e.g. sceneWish(25);
function sceneWish(t) {
  var flame = 1 - between(t, 48.39, 52.89);             // the lamp burns low, and goes out
  pen.drawImage(s04Room(), 0, 0);
  var speaking = S04_SPEAKS.some(function (s) { return t >= s[0] && t < s[1]; });
  var holding = t >= 39.89;                          // from the line "he held his father's hand"
  var meet = [960, 770];
  var father = maengPerson("fellow", MAENG_FATHER, {id: "father", floor: "cross", face: 1, feel: t < 9.5 ? "sleepy" : "concerned",
                                                    mouth: speaking ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8.5)), wide: 0.5, round: 0.15} : null,
                                                    at: [1150, 600], size: MAENG_FATHER.size * S04_NEAR});
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad", floor: "side", face: -1, feel: t > 35.39 ? "sad" : "concerned", at: [700, 560],
                                           tears: between(t, 39.89, 40.89),   // he cries, as the words say he does (M022, 38.0) (owner: "Add some tears for when the boy cries")
                                           size: MAENG_LAD.size * S04_NEAR});
  if (holding) {                                    // the two hands come together over 0.6 s (a reach's third number: they once met in one frame, a pop)
    father.reachA = lad.reachA = meet.concat(between(t, 39.89, 40.49));
  }
  drawByZ(lifeSprites(t, S04_LIFE).concat(MAENG_HUT_THINGS.map(function (one) {   // the hearth, cold at night, and the baskets
    return {name: one.name, kind: one.kind, x: one.x, y: one.base, draw: function () { dress(t, [one], "back"); }};
  }), [                                               // the mice and the tokay, in the room's own light
    {name: "post", kind: "post", x: S04_POST[0], y: S04_POST[1], draw: function () {   // as s04Room() paints it, over its tie
      pen.fillStyle = "#6e4c30";
      pen.fillRect(S04_POST[0], 0, S04_POST[2], S04_POST[1]);
    }},
    {name: "father", kind: "person", x: 770, y: 900, draw: function () { person(770, 900, father); s04Blanket(770, 905, 1.25); }},
    {name: "lad", kind: "person", x: 1110, y: 905, draw: function () { person(1110, 905, lad); }},
    {name: "lamp", kind: "lamp", x: S04_LAMP[0], y: S04_LAMP[1], draw: function () {
      pratheep(pen, S04_LAMP[0], S04_LAMP[1], 2.6 * Math.max(0.15, flame), t, 3);
    }}
  ]));
  // The room is lit by the lamp alone: dark round the edges, and darker as the lamp burns low; the light breathing
  // with the flame (owner, 2026-10-26: "ok, continue", the lamp's flicker among what was offered).
  var flicker = 1 + 0.035 * Math.sin(t * 13.1) + 0.025 * Math.sin(t * 23.7 + 1.3) + 0.015 * Math.sin(t * 41.3 + 2.1);
  var reach = (160 + 420 * flame) * flicker, dark = pen.createRadialGradient(S04_LAMP[0], S04_LAMP[1] - 80, 40, S04_LAMP[0], S04_LAMP[1] - 80, reach + 300);
  dark.addColorStop(0, "rgba(12, 8, 22, " + (0.04 + 0.62 * (1 - flame)).toFixed(3) + ")");
  dark.addColorStop(1, "rgba(12, 8, 22, " + (0.88 + 0.1 * (1 - flame)).toFixed(3) + ")");
  pen.fillStyle = dark;
  pen.fillRect(0, 0, WIDE, 1080);
  if (flame > 0.01) {                               // and warm where it reaches
    var warm = pen.createRadialGradient(S04_LAMP[0], S04_LAMP[1] - 40, 10, S04_LAMP[0], S04_LAMP[1] - 40, 520 * flame);
    warm.addColorStop(0, "rgba(255, 180, 90, " + (0.22 * flame * flicker).toFixed(3) + ")");
    warm.addColorStop(1, "rgba(255, 180, 90, 0)");
    pen.fillStyle = warm;
    pen.fillRect(0, 0, WIDE, 1080);
  }
  s04Night(t);                                      // the night through the doorway, which the lamp does not light
  if (t > 57.39) {                                     // and the scene goes to black
    pen.fillStyle = "rgba(0, 0, 0, " + between(t, 57.39, 61.39).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
