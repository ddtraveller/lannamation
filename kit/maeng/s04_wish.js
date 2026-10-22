// s04_wish.js - scene 4 of the film of the creature with four ears and five eyes: the father's wish (60 s).
// The cold season, at night, inside the hut by one oil lamp: the father, very ill, sits on his sleeping mat
// against the bamboo wall with a cloth over his knees; Thukkhata sits by him, his legs folded to one side as
// one sits before an elder. The father speaks his wish. The boy takes his hand. The lamp burns low and goes
// out; nothing more is shown.
var S04_LONG = 60;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets outside the hut, low; a squeak as each mouse comes in.
var S04_SOUND = {calls: [[0, "crickets", 0.22, 60], [3.4, "mouse-squeak", 0.15], [20.4, "mouse-squeak", 0.13]]};
var S04_LINES = [[1.5, 5.48, "M015"], [6.0, 8.6, "M016"], [10.0, 15.16, "M017"], [15.4, 20.1, "M018"], [20.4, 26.08, "M019"],
                 [26.4, 30.5, "M020"], [31.0, 35.96, "M021"], [38.0, 41.66, "M022"], [44.0, 49.1, "M023"]];
var S04_SPEAKS = [[10.0, 14.76], [15.4, 19.06], [20.4, 25.68], [26.4, 30.1], [31.0, 35.56]];   // the lines the father says himself:
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
            [14.6, 1250, 707], [17.2, 2010, 703, "hide"], [24.2, 2010, 703], [26.8, 1300, 705, "up"], [30.4, 1300, 705],
            [33.0, 2010, 703, "hide"], [33.2, 2010, 703, "hide"]]},
  // The field mouse: in along the floor from the far post during the wish (M019), it sniffs at the mat's edge,
  // then hurries back, and hides.
  {name: "field mouse", kind: "mouse", look: {kind: "field", size: 0.8},
   course: [[19.5, 1780, 790, "hide"], [20.0, 1780, 790], [23.4, 1500, 822, "sniff"], [27.6, 1500, 822], [28.0, 1475, 828, "sniff"],
            [29.6, 1475, 828], [30.6, 1790, 792, "hide"], [31.0, 1790, 792, "hide"]]},
  // The tokay: down the wall from the beam, to rest above the boy; in the quiet after "look after it" (M021 ends
  // 35.6, M022 begins 38.0) it calls once, to-kay; then it climbs back up as the lamp burns low, and stays there at
  // the top of the wall, under the beam. Its way keeps left of the doorway (x 1440 to 1650 from y 230), on the
  // woven wall: it crossed the door's top corner before, over the night (owner, 2026-10-20: "crawls over empty air
  // when moving over the door frame ... make it stop and stay where it is at the top of the wall").
  {name: "tokay", kind: "gecko", z: "set", look: {size: 1.0},     // on the wall: of the set
   // Back up, it turns wide: on down a little, round to the right and up on its own line, no corner sharper than
   // about 60 degrees, where it went straight back up the way it came and folded over itself (owner, 2026-10-21: "When
   // it walks up the wall it folds over itself"; the kit's gecko() also bends no more than GECKO_BEND a joint now).
   course: [[0, 1400, 104], [9.0, 1380, 200], [13.0, 1350, 260], [21.0, 1290, 350], [24.0, 1250, 390, "rest"], [39.5, 1250, 390],
            [40.6, 1222, 425], [41.6, 1225, 470], [42.5, 1262, 492], [43.3, 1305, 470], [44.3, 1330, 400], [45.6, 1328, 260],
            [47.0, 1320, 112, "rest"], [60.0, 1320, 112]],
   calls: [[36.0, "tokay", 0.5]]}
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
  }
  b.fillStyle = "#8a6a40";                          // the rail, and the rattan ties at each post
  b.fillRect(0, 300, WIDE, 14);
  b.strokeStyle = "#5a3a1e";
  b.lineWidth = 4;
  [107, 1807].forEach(function (px) { b.beginPath(); b.moveTo(px - 22, 294); b.lineTo(px + 22, 320); b.moveTo(px + 22, 294); b.lineTo(px - 22, 320); b.stroke(); });
  b.fillStyle = "#6e4c30";                          // posts at the corners of the room, and the beam under the roof
  b.fillRect(90, 0, 34, 710);
  b.fillRect(1790, 0, 34, 710);
  b.fillRect(0, 70, WIDE, 26);
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
  b.strokeStyle = "rgba(70, 48, 28, 0.55)";
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
// Its z plan (oldcartoon.js, Z): the room as painted first; then by drawByZ the tokay in "set" (on the wall), and in
// "people" by their feet or bases: the mice at the wall's foot and the mat's edge (703 to 828), the hut's things (the
// hearth's pot, the baskets, 748 to 770: the house mouse runs behind the pot on its way to the post), the corner
// post at the right drawn again at its foot (710), so the house mouse goes behind it, the father under his blanket
// (900), the boy (905), the lamp on the floor between them (925).
// e.g. sceneWish(25);
function sceneWish(t) {
  var flame = 1 - between(t, 46, 50.5);             // the lamp burns low, and goes out
  pen.drawImage(s04Room(), 0, 0);
  var speaking = S04_SPEAKS.some(function (s) { return t >= s[0] && t < s[1]; });
  var holding = t >= 37.5;                          // from the line "he held his father's hand"
  var meet = [960, 770];
  var father = maengPerson("fellow", MAENG_FATHER, {id: "father", floor: "cross", face: 1, feel: t < 9.5 ? "sleepy" : "concerned",
                                                    mouth: speaking ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8.5)), wide: 0.5, round: 0.15} : null,
                                                    at: [1150, 600], size: MAENG_FATHER.size * S04_NEAR});
  var lad = maengPerson("boy", MAENG_LAD, {id: "lad", floor: "side", face: -1, feel: t > 33 ? "sad" : "concerned", at: [700, 560],
                                           tears: between(t, 37.5, 38.5),   // he cries, as the words say he does (M022, 38.0) (owner: "Add some tears for when the boy cries")
                                           size: MAENG_LAD.size * S04_NEAR});
  if (holding) { father.reachA = meet; lad.reachA = meet; }
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
  // The room is lit by the lamp alone: dark round the edges, and darker as the lamp burns low.
  var reach = 160 + 420 * flame, dark = pen.createRadialGradient(S04_LAMP[0], S04_LAMP[1] - 80, 40, S04_LAMP[0], S04_LAMP[1] - 80, reach + 300);
  dark.addColorStop(0, "rgba(12, 8, 22, " + (0.04 + 0.62 * (1 - flame)).toFixed(3) + ")");
  dark.addColorStop(1, "rgba(12, 8, 22, " + (0.88 + 0.1 * (1 - flame)).toFixed(3) + ")");
  pen.fillStyle = dark;
  pen.fillRect(0, 0, WIDE, 1080);
  if (flame > 0.01) {                               // and warm where it reaches
    var warm = pen.createRadialGradient(S04_LAMP[0], S04_LAMP[1] - 40, 10, S04_LAMP[0], S04_LAMP[1] - 40, 520 * flame);
    warm.addColorStop(0, "rgba(255, 180, 90, " + (0.22 * flame).toFixed(3) + ")");
    warm.addColorStop(1, "rgba(255, 180, 90, 0)");
    pen.fillStyle = warm;
    pen.fillRect(0, 0, WIDE, 1080);
  }
  if (t > 55) {                                     // and the scene goes to black
    pen.fillStyle = "rgba(0, 0, 0, " + between(t, 55, 59).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
