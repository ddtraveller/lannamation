// s07_embers.js - scene 7 of the film of the creature with four ears and five eyes: what it eats (55 s).
// By day, in a pen by the hut where no one can see it: Thukkhata holds out grass, then a banana, and the
// creature turns away from each, and sleeps all day. A cold night: he lights a fire to keep warm; pop, an ember
// jumps out of it, and the creature catches it, crunches it, and its five eyes light up. He laughs. From then on
// he feeds it embers every day.
var S07_LONG = 55;
var S07_LINES = [[2.0, 8.3, "M036"], [8.4, 12.6, "M037"], [12.8, 15.9, "M038"], [16.1, 18.22, "M039"], [19.6, 26.2, "M040"],
                 [26.3, 30.16, "M041"], [30.36, 34.5, "M042"], [34.7, 38.38, "M043"], [38.58, 43.2, "M044"]];
var S07_FIRE = [1430, 952];
var S07_CAMERA = [1220, 740, 1.6];                  // the camera close on the pen and the fire: its middle and its nearness (no lower than 1080 - 540 / 1.6, or the sheet's foot shows)
var S07_NIGHT = 18.5;                               // the cut to night
var S07_FEEDS = [29.4, 44.1, 47.1, 50.1];           // the seconds an ember leaves the fire for its mouth: the first on "Pop!", caught as the next line begins

// Its life: by day two hens pecking left of the pen; at night the house mouse creeps out from under the hut
// toward the fire's warmth, sits up to watch it, and bolts back at "crunch, crunch!" (M042).
var S07_LIFE = [
  {name: "hen", kind: "hen", layer: "back", course: [[0, 720, 968, "peck"], [6.0, 720, 968], [8.0, 800, 972, "peck"], [18.4, 800, 972]]},
  {name: "brown hen", kind: "hen", layer: "back", look: {feel: "satiated"}, course: [[0, 660, 960, "peck"], [18.4, 660, 960]]},
  {name: "house mouse", kind: "mouse", layer: "back", look: {kind: "house", size: 0.55},
   course: [[20.5, 600, 978, "hide"], [21.0, 600, 978], [23.6, 860, 982, "sniff"], [25.2, 860, 982, "up"], [30.6, 860, 982],
            [31.6, 560, 978, "hide"], [31.8, 560, 978, "hide"]]},
  // its happy howls once the first ember is eaten and its eyes light (sounds.py, maeng-happy)
  {name: "the creature's joy", kind: "flock", layer: "back", course: [[0, -999, -999], [0.1, -999, -999]],
   calls: [[31.9, "maeng-happy", 0.5]]}
];

function s07Grass(x, y) {                           // a handful of grass
  pen.strokeStyle = "#5f8f3a";
  pen.lineWidth = 2.4;
  pen.lineCap = "round";
  for (var k = -3; k <= 3; k++) {
    pen.beginPath();
    pen.moveTo(x, y);
    pen.quadraticCurveTo(x + k * 4, y - 16, x + k * 7, y - 28 + Math.abs(k) * 3);
    pen.stroke();
  }
}

function s07Banana(x, y) {                          // a banana
  pen.save();
  pen.translate(x, y);
  pen.beginPath();
  pen.moveTo(-4, 0);
  pen.quadraticCurveTo(14, 6, 26, -12);
  pen.quadraticCurveTo(14, -2, -2, -6);
  pen.closePath();
  shape("#f2d24a");
  pen.restore();
}

function sceneEmbers(t) {
  var night = t >= S07_NIGHT ? 1 : 0, dark = Math.max(between(t, S07_NIGHT - 1.4, S07_NIGHT) * (t < S07_NIGHT ? 1 : 0),
                                                      t >= S07_NIGHT ? 1 - between(t, S07_NIGHT, S07_NIGHT + 1.4) : 0);
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(S07_CAMERA[2], S07_CAMERA[2]);
  pen.translate(-S07_CAMERA[0], -S07_CAMERA[1]);
  maengYardAt(t, night, night ? 0.5 : 0);
  var tint = night ? [MAENG_NIGHT[0], MAENG_NIGHT[1]] : null;
  decorate(t, S07_LIFE, "back");
  kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {part: "back", tint: tint});
  // The creature in its pen: by day it turns away from what he holds out, then sleeps; by night it faces the
  // fire, catches each ember, chews, and its eyes light up.
  var feed = null, since = 99;
  S07_FEEDS.forEach(function (s) { if (t >= s && t - s < since) { since = t - s; feed = s; } });
  var flying = since < 1.0, chew = since >= 1.0 && since < 2.4, glow = feed === null ? 0 : clamp(1 - (since - 1.2) / 3.5) * (since > 1.0 ? 1 : 0);
  var away = (t > 9.4 && t < 11.8) || (t > 13.6 && t < 15.4);
  var beastLook = {size: 0.45, face: away ? -1 : 1, mouth: flying ? 0.85 * between(since, 0.2, 0.8) : chew ? 0.2 + 0.2 * Math.abs(Math.sin(since * 11)) : 0,
                   glow: glow, feel: t < 16.1 ? (away ? "concerned" : "neutral") : t < S07_NIGHT ? "sleepy" : feed !== null && since < 6 ? "happy" : "neutral"};
  if (feed === null) { delete beastLook.glow; }
  var beast = maengSiHuHaTa(MAENG_PEN[0] - 20, MAENG_PEN[1] - 22, beastLook);
  kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {part: "front", tint: tint});
  if (night) {                                      // the fire, and Thukkhata by it
    campfire(pen, S07_FIRE[0], S07_FIRE[1], 0.8, t, {light: 1});
    var laughs = t > 34.7 && t < 38.0;
    var lad = maengPerson("boy", MAENG_LAD, {id: "lad", floor: "cross", face: -1, feel: laughs ? "laughing" : t > 26.3 && t < 30.4 ? "surprised" : "happy",
                                             reachA: feed !== null && since < 1.2 && feed > 30 ? [S07_FIRE[0] - 30, S07_FIRE[1] - 40] : undefined});
    person(S07_FIRE[0] + 170, S07_FIRE[1] - 6, lad);
    if (flying) { emberFlight(pen, [S07_FIRE[0] - 10, S07_FIRE[1] - 40], beast.mouth, since / 1.0, 1.2, 150, t); }
  } else {                                          // by day: Thukkhata at the pen, holding out grass, then a banana
    var holding = t > 8.4 && t < 11.8 ? "grass" : t > 12.8 && t < 15.4 ? "banana" : null;
    var hand = [MAENG_PEN[0] + 160, MAENG_PEN[1] - 120];
    var boy = maengPerson("boy", MAENG_LAD, {id: "lad", face: -1, feel: holding && away ? "concerned" : t > 16.1 ? "sad" : "neutral",
                                             reachA: holding ? hand : undefined});
    person(MAENG_PEN[0] + 270, MAENG_PEN[1] + 4, boy);
    if (holding === "grass") { s07Grass(hand[0] - 6, hand[1] + 4); }
    if (holding === "banana") { s07Banana(hand[0] - 14, hand[1] + 2); }
  }
  pen.restore();
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
  if (t < 1.5 || t > 53) {
    pen.fillStyle = "rgba(0, 0, 0, " + Math.max(1 - t / 1.5, between(t, 53, 55)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
