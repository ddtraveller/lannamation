// s07_embers.js - scene 7 of the film of the creature with four ears and five eyes: what it eats (57.52 s; 55 s
// until 2026-10-24, when the narrator's own words for M041 and M042 came in longer: 1.32 s inserted at 29.0 s,
// before the first ember jumps, 1.2 s at 34.5 s, before he laughs, every moment after them moved with them,
// film_relayout.py in the voice project).
// By day, in a pen by the hut where no one can see it: Thukkhata holds out grass, then a banana, and the
// creature turns away from each, and sleeps all day. A cold night: he lights a fire to keep warm; pop, an ember
// jumps out of it, and the creature catches it, crunches it, and its five eyes light up. He laughs. From then on
// he feeds it embers every day.
var S07_LONG = 69.74;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the cicadas by day at the pen; the crickets of the cold night.
var S07_SOUND = {calls: [[0, "cicadas", 0.5, 24.06], [24.06, "crickets", 0.35, 45.68]]};
var S07_LINES = [[2.0, 7.24, "M036"], [8.86, 12.5, "M037"], [13.74, 18.23, "M038"], [18.44, 23.95, "M039"], [25.16, 32.15, "M040"], [33.9, 39.83, "M041"], [40.06, 46.89, "M042"], [47.1, 51.75, "M043"], [51.97, 58.14, "M044"]];
var S07_FIRE = [1430, 952];
// The fire's light at night, over the scene under its camera (owner, 2026-10-26: "yes", to firelight and sparks): the
// night deeper away from the fire; a warm light round it, flickering with the flames, on the ground, the boy, the
// pen and the creature's face; and sparks going up out of it, cooling from yellow to red as they rise, and gone.
// t: the scene's second. Gives back nothing: it draws with pen.
// e.g. s07Firelight(40);
function s07Firelight(t) {
  var x = S07_FIRE[0], y = S07_FIRE[1] - 50, n;
  var flicker = 1 + 0.06 * Math.sin(t * 11.3) + 0.04 * Math.sin(t * 19.7 + 1.1) + 0.03 * Math.sin(t * 31.1 + 2.3);
  var deep = pen.createRadialGradient(x, y, 120, x, y, 900);   // the dark away from it
  deep.addColorStop(0, "rgba(8, 10, 30, 0)");
  deep.addColorStop(1, "rgba(8, 10, 30, 0.42)");
  pen.fillStyle = deep;
  pen.fillRect(x - 1400, y - 1000, 2800, 2000);
  pen.save();
  pen.globalCompositeOperation = "lighter";
  var warm = pen.createRadialGradient(x, y, 10, x, y, 430 * flicker);   // the warm light round it
  warm.addColorStop(0, "rgba(255, 150, 60, " + (0.32 * flicker).toFixed(3) + ")");
  warm.addColorStop(0.4, "rgba(220, 110, 40, " + (0.14 * flicker).toFixed(3) + ")");
  warm.addColorStop(1, "rgba(200, 90, 30, 0)");
  pen.fillStyle = warm;
  pen.fillRect(x - 500, y - 500, 1000, 1000);
  for (n = 0; n < 16; n++) {                         // the sparks, each on its own way up, again and again
    var p = ((t * (0.45 + 0.25 * dice(n + 71)) + dice(n + 73)) % 1 + 1) % 1;
    var sx = x + (dice(n + 75) - 0.5) * 50 + 22 * Math.sin(p * 6 + n) * p, sy = y - 10 - p * (220 + 120 * dice(n + 77));
    var a = (1 - p) * (0.6 + 0.4 * Math.sin(t * 17 + n)), green = Math.round(210 - 150 * p);
    pen.fillStyle = "rgba(255, " + green + ", 70, " + Math.max(0, a).toFixed(3) + ")";
    pen.beginPath();
    pen.arc(sx, sy, 2.4 * (1 - p) + 0.6, 0, 7);
    pen.fill();
  }
  pen.restore();
}
var S07_CAMERA = [1220, 740, 1.6];                  // the camera close on the pen and the fire: its middle and its nearness (no lower than 1080 - 540 / 1.6, or the sheet's foot shows)
var S07_NIGHT = 24.06;                               // the cut to night
var S07_FEEDS = [39.05, 58.84, 61.84, 64.84];           // the seconds an ember leaves the fire for its mouth: the first on "Pop!", caught as the next line begins

// Its life: by day two hens left of the pen, and a grasshopper (owner, 2026-10-22: "The grasshopper should be farther
// away and the hen should see it then stalk it and then it should jump away to get eaten by the second hen"): the hen
// sees it, a way off by the pen, crouches, and creeps up on it, slowly, all the way; just as she is near enough to
// pounce it jumps away past her, and lands under the nose of the brown hen, too full to have moved all morning, who
// leans down and gobbles it (decorate.js "look", "stalk", "pounce", "caught"). The hen cocks her head, and goes back
// to her pecking. At night the house mouse creeps out from under the hut toward the fire's warmth, sits up to watch
// it, and bolts back at "crunch, crunch!" (M042).
var S07_LIFE = [
  {name: "hen", kind: "hen", course: [[0, 715, 968, "peck"], [2.44, 715, 968, "look"], [3.77, 715, 968, "stalk"], [4.43, 715, 968, "stalk"],
                                      [9.09, 790, 968, "stalk"], [9.56, 790, 968, "missed"], [12.44, 790, 968, "peck"], [23.96, 790, 968]]},
  {name: "brown hen", kind: "hen", look: {feel: "satiated"},
   course: [[0, 675, 960, "peck"], [10.62, 675, 960, "pounce"], [11.03, 675, 960, "caught"], [12.94, 675, 960, "peck"], [23.96, 675, 960]]},
  {name: "grasshopper", kind: "grasshopper",
   course: [[0, 850, 976], [9.56, 850, 976], [10.27, 720, 966], [10.86, 720, 966, "caught"], [11.03, 720, 966, "hide"], [23.96, 720, 966, "hide"]]},
  {name: "house mouse", kind: "mouse", look: {kind: "house", size: 0.55},
   course: [[26.46, 600, 978, "hide"], [27.19, 600, 978], [30.95, 860, 982, "sniff"], [32.8, 860, 982, "up"], [40.37, 860, 982],
            [41.68, 560, 978, "hide"], [41.94, 560, 978, "hide"]]},
  // its happy howls once the first ember is eaten and its eyes light (sounds.py, maeng-happy)
  // a crow come to the yard by day, walking and pecking by the pen, cawing once, gone before the night (the beauty
  // pass, owner, 2026-10-27; the large-billed crow of the north: nature_research.md)
  {name: "crow", kind: "crow", z: "people", look: {size: 0.36},
   course: [[0, 1500, 978, "peck"], [5, 1500, 978], [8, 1560, 982, "peck"], [14, 1560, 982], [16, 1530, 980, "call"], [19, 1530, 980],
            [21, 1530, 980, "fly"], [23.6, 2100, 700]]},
  {name: "the creature's joy", kind: "flock", z: "sky", course: [[0, -999, -999], [0.1, -999, -999]],
   calls: [[42.07, "maeng-happy", 2.8]]}
];

// point: [x, y] in the film's own pixels; gives back [x, y] under pen's camera now (as maengAt() does).
// e.g. var held = s07Here(boyAt.handA);
function s07Here(point) {                          // a joint (the film's own pixels) where the camera's pen draws it
  var p = pen.getTransform().inverse().transformPoint(new DOMPoint(point[0], point[1]));
  return [p.x, p.y];
}

// Scene 7, the entry the film calls (SCENES): t, its own second, 0 to S07_LONG (55 s): by day the grass (8.4 s) and
// the banana (12.8 s), then sleep; the cut to night at S07_NIGHT (18.5 s), the embers at S07_FEEDS. Gives back
// nothing: it draws the whole sheet with pen, under the camera S07_CAMERA. From sets.js: maengYardAt(), MAENG_NIGHT,
// MAENG_PEN, maengPerson() with MAENG_LAD. Its life is S07_LIFE; its words S07_LINES (M036 to M044), written under it
// by the page.
// Its z plan (oldcartoon.js, Z): the yard as painted first; then by drawByZ in "people" by their feet: the hens and the
// mouse left of the pen, the pen with the creature in it (its back, the creature, its front: one sprite, at its foot,
// MAENG_PEN), and by day the lad at the pen with what he holds out, by night the fire and the lad by it (one sprite: his
// stick lies in its coals); and by night the ember in flight in "front", over them all, to the creature's mouth.
// e.g. sceneEmbers(31);
function sceneEmbers(t) {
  maengSeason("harvest");                           // the cold season: the rice ripe and cut, straw stacks (sets.js; NATURE.md)
  var night = t >= S07_NIGHT ? 1 : 0, dark = Math.max(between(t, S07_NIGHT - 1.4, S07_NIGHT) * (t < S07_NIGHT ? 1 : 0),
                                                      t >= S07_NIGHT ? 1 - between(t, S07_NIGHT, S07_NIGHT + 1.4) : 0);
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(S07_CAMERA[2], S07_CAMERA[2]);
  pen.translate(-S07_CAMERA[0], -S07_CAMERA[1]);
  maengYardAt(t, night, night ? 0.5 : 0);
  var tint = night ? [MAENG_NIGHT[0], MAENG_NIGHT[1]] : null;
  // The creature in its pen: by day it turns away from what he holds out, then sleeps; by night it faces the
  // fire, catches each ember, chews, and its eyes light up.
  var feed = null, since = 99;
  S07_FEEDS.forEach(function (s) { if (t >= s && t - s < since) { since = t - s; feed = s; } });
  var flying = since < 1.0, chew = since >= 1.0 && since < 2.4, glow = feed === null ? 0 : clamp(1 - (since - 1.2) / 3.5) * (since > 1.0 ? 1 : 0);
  var away = (t > 10.03 && t < 12.74) || (t > 14.88 && t < 17.45);
  var beastLook = {size: 0.45, face: away ? -1 : 1, mouth: flying ? 0.85 * between(since, 0.2, 0.8) : chew ? 0.2 + 0.2 * Math.abs(Math.sin(since * 11)) : 0,
                   glow: glow, feel: t < 18.26 ? (away ? "concerned" : "neutral") : t < S07_NIGHT ? "sleepy" : feed !== null && since < 6 ? "happy" : "neutral"};
  if (feed === null) { delete beastLook.glow; }
  var beast;
  var sprites = lifeSprites(t, S07_LIFE).concat([
    {name: "pen", kind: "kok", x: MAENG_PEN[0], y: MAENG_PEN[1], draw: function () {
      kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {fine: true, part: "back", tint: tint});
      beast = maengSiHuHaTa(MAENG_PEN[0] - 20, MAENG_PEN[1] - 22, beastLook);
      kok(pen, MAENG_PEN[0], MAENG_PEN[1], MAENG_PEN[2], 1, {fine: true, part: "front", tint: tint});
    }}
  ]);
  if (night) {                                      // the fire, and Thukkhata by it
    var laughs = t > 47.1 && t < 51.15;
    // From the second ember on he feeds it himself: a fire stick in the coals, and on each feed a flick that throws
    // the ember up from the stick's end (owner, 2026-10-20: "have the boy flip them up with a stick"). The first,
    // on "Pop!", jumps out of the fire by itself, as the words say.
    var stickFrom = t > 51.79, flick = feed !== null && feed > 30 && since < 0.35 ? Math.sin(since / 0.35 * Math.PI) : 0;
    var tip = [S07_FIRE[0] + 12 + 14 * flick, S07_FIRE[1] - 12 - 70 * flick];
    var lad = maengPerson("boy", MAENG_LAD, {id: "lad", floor: "cross", face: -1, feel: laughs ? "laughing" : t > 33.9 && t < 40.11 ? "surprised" : "happy",
                                             reachA: stickFrom ? [S07_FIRE[0] + 96, S07_FIRE[1] - 44 - 16 * flick, between(t, 51.79, 52.27)] : undefined, grip: stickFrom});   // to the stick, eased
    sprites.push({name: "fire and lad", kind: "person", x: S07_FIRE[0] + 170, y: S07_FIRE[1] - 6, draw: function () {
      campfire(pen, S07_FIRE[0], S07_FIRE[1], 0.8, t, {light: 1});
      var ladAt = person(S07_FIRE[0] + 170, S07_FIRE[1] - 6, lad);
      if (stickFrom) { fireStick(pen, s07Here(ladAt.handA), tip, {hot: 1 - 0.5 * flick, tint: tint}); }
    }});
    var from = feed > 30 ? [S07_FIRE[0] + 16, S07_FIRE[1] - 40] : [S07_FIRE[0] - 10, S07_FIRE[1] - 40];
    if (flying) {
      sprites.push({name: "ember", kind: "ember", z: "front", draw: function () { emberFlight(pen, from, beast.mouth, since / 1.0, 1.2, 150, t); }});
    }
  } else {                                          // by day: Thukkhata at the pen, holding out grass, then a banana
    var holding = t > 8.86 && t < 12.74 ? "grass" : t > 13.74 && t < 17.45 ? "banana" : null;
    // His hand goes out with each and back, eased (a reach's third number: it once went in one frame, a pop)
    var out = between(t, 8.86, 9.33) * (1 - between(t, 12.34, 12.74)) + between(t, 13.74, 14.31) * (1 - between(t, 16.88, 17.45));
    var hand = [MAENG_PEN[0] + 160, MAENG_PEN[1] - 120, out];
    var boy = maengPerson("boy", MAENG_LAD, {id: "lad", face: -1, feel: holding && away ? "concerned" : t > 18.26 ? "sad" : "neutral",
                                             reachA: holding ? hand : undefined});
    sprites.push({name: "lad", kind: "person", x: MAENG_PEN[0] + 270, y: MAENG_PEN[1] + 4, draw: function () {
      var boyAt = person(MAENG_PEN[0] + 270, MAENG_PEN[1] + 4, boy);
      // what he holds out, in his hand: a tied bundle of cut grass, then a hand of bananas (the kit's grassBundle()
      // and bananas(); owner, 2026-10-20: "Work on the feeding of grass and the banana")
      var held = holding ? s07Here(boyAt.handA) : null;
      if (holding === "grass") { grassBundle(pen, held[0] - 4, held[1] - 8, 0.7, {tied: true, angle: -0.3}); }
      if (holding === "banana") { bananas(pen, held[0] - 4, held[1] - 2, 0.7, {count: 4, angle: Math.PI + 0.35}); }
    }});
  }
  drawByZ(sprites);
  if (night) { s07Firelight(t); }                   // the fire lights what is round it, and sparks go up
  pen.restore();
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
  if (t < 1.5 || t > 67.74) {
    pen.fillStyle = "rgba(0, 0, 0, " + Math.max(1 - t / 1.5, between(t, 67.74, 69.74)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
