// s02_family.js - scene 2 of the film of the creature with four ears and five eyes: the poor family (55 s).
// Morning: a father, a mother and their little son come out of their hut and walk the path toward the city,
// the mother with a bowl, to ask for food. Night: the hut's lamp glows in its door, and slowly goes out (his
// mother passes away; nothing more is shown). The next morning: only the father and the boy walk the path.
// Its life: the first morning, mist low over the rice fields behind, thinning as the sun climbs; a hen and a
// rooster pecking in the yard left of the hut, away from the path; a flock across the sky. The night, nothing:
// it is the mother's. The next morning, one hen alone, and no flock: the line is a sad one.
var S02_LONG = 62.74;   // 55 until 2026-10-24: 7.74 s inserted for the narrator's own reading (scene_retime.py)
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the morning's rooster and hens and the cicadas; the crickets of the night; the next morning's
// rooster.
var S02_SOUND = {calls: [[0, "cicadas", 0.5, 32.14], [1, "rooster-crow", 0.28], [6, "hens", 0.6], [32.34, "crickets", 0.35, 14.8], [47.34, "cicadas", 0.5, 15.4], [48.24, "rooster-crow", 0.25]]};
var S02_LINES = [[1.5, 8.5, "M005"], [8.7, 15.09, "M006"], [15.29, 19.45, "M007"], [19.65, 24.2, "M008"], [24.4, 30.04, "M009"],
                 [35.24, 41.63, "M010"], [49.74, 54.37, "M011"]];

var S02_LIFE = [
  {name: "hen", kind: "hen",
   course: [[0, 260, 958, "peck"], [4.0, 260, 958], [8.9, 340, 962, "peck"], [15.79, 340, 962], [17.79, 300, 956, "peck"], [32.24, 300, 956]]},
  {name: "rooster", kind: "rooster", look: {feel: "satiated"},
   course: [[0, 130, 950], [9.4, 210, 954, "peck"], [12.4, 210, 954], [16.79, 180, 962, "peck"], [32.24, 180, 962]]},
  // Her two chicks (owner, 2026-10-22: "have a chick struggle pulling a worm out of the ground"; the chick, the
  // worm and the grasshopper picked of three candidates each). One forages at her heels as she goes; the other
  // finds a worm and pulls (decorate.js "worm": chickWorm()): it stretches, gives, and the chick sits down hard,
  // stars round its head; up again, a harder pull, and it pops out; the chick tumbles back with the worm dangling
  // from its beak, gulps it down, and goes back to foraging. All of it left of the words, under the house, the
  // worm's chick a step nearer than the hen's walk so that she does not stand in front of it.
  {name: "chick", kind: "chick", look: {size: 1.3},
   course: [[0, 200, 984, "peck"], [2.5, 200, 984], [3.6, 240, 986, "worm"], [15.99, 240, 986, "peck"], [17.79, 240, 986],
            [20.53, 215, 984, "peck"], [32.24, 215, 984]]},
  {name: "chick at her heels", kind: "chick", look: {size: 1.3},
   course: [[0, 225, 964, "peck"], [4.4, 225, 964], [9.3, 370, 966, "peck"], [16.19, 370, 966], [18.19, 335, 962, "peck"], [32.24, 335, 962]]},
  // a black-boned hen of the north (ไก่ดำ), pecking under the house (owner, 2026-10-20: "add a black chicken and rooster")
  {name: "black hen", kind: "hen", look: {black: true}, course: [[0, 430, 962, "peck"], [11.4, 430, 962], [15.79, 470, 966, "peck"], [32.24, 470, 966]]},
  {name: "flock", kind: "flock", z: "sky", course: [[2.0, -100, 270], [17.79, 2150, 210]]},
  // she pecks, walks a little, pecks, and walks back the other way (owner, 2026-10-21: "should switch between 3
  // behaviors like pecking walking pecking and then walking back the other way"; she only pecked on one spot)
  {name: "hen, alone", kind: "hen",
   course: [[47.24, 330, 958, "peck"], [50.74, 330, 958], [53.24, 440, 962, "peck"], [57.24, 440, 962], [59.74, 330, 958, "peck"], [62.74, 330, 958]]}
];

// t: the scene's second (gone by 25.74 s). Gives back nothing: it draws with pen. e.g. maengYardAt(t, 0, 0, function () { s02Mist(t); });
function s02Mist(t) {                               // low over the rice fields behind the hut, thinning as the sun climbs
  var thin = 1 - between(t, 2, 25.74);
  if (thin > 0) { mistDrift(pen, t, {left: 0, right: WIDE, top: 755, bottom: 872, count: 6, wide: 560, drift: 6, seed: 21, alpha: 0.8 * thin}); }
}

// joints: what person() gave back for the mother (the film's own pixels). Gives back nothing: it draws with pen,
// with no camera. e.g. s02Bowl(person(x, y, look));
function s02Bowl(joints) {                          // a small wooden bowl in the mother's near hand
  var hand = joints.handA, wrist = joints.wristA;
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);              // the joints are in the film's own pixels
  pen.translate(hand[0] + (hand[0] - wrist[0]) * 0.2, hand[1] + 6 * PIX);
  pen.scale(PIX, PIX);
  pen.beginPath();
  pen.moveTo(-16, -4);
  pen.quadraticCurveTo(0, 18, 16, -4);
  pen.closePath();
  shape("#8a5a36");
  pen.beginPath();
  pen.ellipse(0, -4, 16, 4, 0, 0, 7);
  shape("#5e3a22");
  pen.restore();
}

// t: the scene's second; start: the second they set off; names: "boy", "mother", "father" (all three: neutral; the
// boy and the father alone: sad and concerned, slower). Each walks 1400 pixels of the sheet from his place in the
// line. Gives back their sprites for drawByZ(), each on the worn middle of the path where its feet are; the mother's
// draws her bowl in her hand. e.g. drawByZ(s02Walk(t, 3, ["boy", "mother", "father"]));
function s02Walk(t, start, names) {                 // the family on the path from the hut, out to the right
  var spots = names.length === 2 ? {father: 860, boy: 760} : {father: 1000, boy: 860, mother: 720};   // in a line, the father first
  return names.map(function (name) {
    var from = spots[name], begin = start;
    var kind = {father: "fellow", mother: "weaver", boy: "boy"}[name];
    var own = {father: MAENG_FATHER, mother: MAENG_MOTHER, boy: MAENG_BOY}[name];
    var feel = names.length === 2 ? {father: "concerned", boy: "sad"}[name] : "neutral";
    var go = stroll(t, from, from + 1400, begin, maengPerson(kind, own, {id: name, feel: feel, stride: names.length === 2 ? 0.8 : 1}));
    var feet = maengWay(go.x) + 12;                // on the worn middle of the path
    return {name: name, kind: "person", x: go.x, y: feet, draw: function () {
      var joints = person(go.x, feet, go.look);
      if (name === "mother") { s02Bowl(joints); }
    }};
  });
}

// Scene 2, the entry the film calls (SCENES): t, its own second, 0 to S02_LONG (62.74 s): the morning to 32.24 s, the
// night to 47.24 s, the next morning after. Gives back nothing: it draws the whole sheet with pen. From sets.js:
// maengYardAt() (the yard, MAENG_HUT's lamp), maengWay(), maengPerson() with MAENG_FATHER, MAENG_MOTHER and
// MAENG_BOY, maengDark(). Its life is S02_LIFE; its words S02_LINES (M005 to M011), written under it by the page.
// Its z plan (oldcartoon.js, Z): the yard as painted first (maengYardAt), then by drawByZ the flock in "sky", and in
// "people" the hens and the family by their feet: the hens peck left of the hut, away from the path, so no one passes
// in front of another. e.g. sceneFamily(30);
function sceneFamily(t) {
  if (t < 32.24) {                                   // morning: the three go to the city
    // the yard's clock a tenth slower, so its rice planters' step back to their start (every 30 s of it, sets.js) comes at
    // 33.3 s, after the fade at 30.74 s, not in view at 30 s (the pop check, 2026-10-24: 3 s back made it negative at
    // the start, and the field folk's feet jumped); the next morning's is 15 s back, below
    maengYardAt(t * 0.9, 0, 0, function () { s02Mist(t); });
    drawByZ(lifeSprites(t, S02_LIFE).concat(s02Walk(t, 19.5, ["boy", "mother", "father"])));   // 3 until 2026-10-24: they stand
    // while she named them, and walked on until the fade (owner: "follow the family for a few seconds longer")
    maengDark(t, 30.74, 99);
  } else if (t < 47.24) {                            // night: the lamp in the door, and it goes out
    var glow = 1 - between(t, 40.74, 44.24);
    maengYardAt(t, 1, glow * (0.9 + 0.1 * Math.sin(t * 6.3)));
    maengDark(t, 45.74, 32.24);
  } else {                                          // the next morning: the father and the boy
    // the yard's own clock 15 s back: its rice planters step back to their start every 30 s, (t * 2) % 60 in sets.js,
    // and at 60 s that jump fell in this shot once the scene ran to 62.74 s (the pop check, 2026-10-24); the shot comes
    // in through black, so nothing else of the yard can be seen to differ
    maengYardAt(t - 15, 0, 0);
    drawByZ(lifeSprites(t, S02_LIFE).concat(s02Walk(t, 49.24, ["boy", "father"])));
    maengDark(t, 99, 47.24);
  }
}
