// s10_born.js - scene 10 of the film of Chang Ngu: Phrom is born (30 s). Dawn in the headman's house: the queen sits on
// the mat with the newborn in her arms, his skin bright as if washed clean (the chronicle: "เป็นดั่งล้างไว้สะอาดแล้ว"),
// a soft light about him; the headman, little Thukkhita and the household's women come close to look; an old man in
// white (the chronicle: the family's elders and a brahmin named him "for the sign, beautiful as a Brahma come down")
// lifts his hand and names him Phrom Kuman.
var C10_LONG = 30;
var C10_SOUND = {calls: []};
var C10_LINES = [[1.4, 5.28, "C042"], [5.48, 9.22, "C043"], [11.4, 13.4, "C044"], [16.6, 19.74, "C045"]];
var C10_BABY = [930, CNG_FLOOR - 150];                 // the baby in the queen's arms (set from her shoulders as she sits)

// The newborn's light: a soft glow round him, brightest as he is first shown. e.g. c10Glow(5);
function c10Glow(t) {
  var bright = 0.35 + 0.35 * between(t, 5.4, 8) - 0.15 * between(t, 14, 20);
  var g = pen.createRadialGradient(C10_BABY[0], C10_BABY[1], 10, C10_BABY[0], C10_BABY[1], 220);
  g.addColorStop(0, "rgba(255, 244, 210, " + bright.toFixed(3) + ")");
  g.addColorStop(1, "rgba(255, 230, 170, 0)");
  pen.fillStyle = g;
  pen.beginPath(); pen.arc(C10_BABY[0], C10_BABY[1], 220, 0, 7); pen.fill();
}

// Scene 10, the entry the film calls (SCENES): t, its own second, 0 to C10_LONG (30 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngRoom("day"), CNG_FLOOR, cngPerson() with CNG_QUEEN, CNG_HEADMAN, CNG_THUKKHITA,
// CNG_SEER, cngAgeSize(); from chiangsaen.js swaddledBaby(). Its words are C10_LINES (C042 to C045). Its z plan: the
// room, then by drawByZ the people by their feet (the queen with the baby in her arms), the light over the baby.
function cngSceneBorn(t) {
  pen.save();                                              // close on the mat, the people above the words
  pen.translate(WIDE / 2, 560);
  pen.scale(1.4, 1.4);
  pen.translate(-960, -(CNG_FLOOR - 110));
  pen.drawImage(cngRoom("day"), 0, 0);
  pen.fillStyle = "rgba(240, 170, 120, " + (0.2 * (1 - between(t, 0, 12))).toFixed(3) + ")";   // the dawn's warmth
  pen.fillRect(0, 0, WIDE, 1600);
  var names = between(t, 16.4, 17.2) * (1 - between(t, 19.6, 20.6));
  drawByZ([
    {name: "queen and baby", kind: "person", x: 840, y: CNG_FLOOR + 50, draw: function () {
      var look = cngPerson("maiden", CNG_QUEEN, {id: "thewi", floor: "side", face: 1, feel: "happy"});
      var shoulder = cngMeasure(840, CNG_FLOOR + 50, look).shoulderA;   // the baby at her breast, in the crook of her arms
      C10_BABY = [shoulder[0] + 16, shoulder[1] + 62];      // low across her front, on her lap (owner, 2026-10-25: he floated)
      person(840, CNG_FLOOR + 50, Object.assign(look, {reachA: [C10_BABY[0] - 18, C10_BABY[1] + 2], reachB: [C10_BABY[0] + 20, C10_BABY[1] + 4],
                                                      at: C10_BABY}));
      swaddledBaby(pen, C10_BABY[0], C10_BABY[1], 0.55);   // over her hands: they hold him from beneath
    }},
    {name: "headman", kind: "person", x: 1180, y: CNG_FLOOR + 30, draw: function () {
      person(1180, CNG_FLOOR + 30, cngPerson("noble", Object.assign({}, CNG_HEADMAN, {sarong: CNG_KING.sarong}),
                                            {id: "phang", face: -1, feel: "happy", at: C10_BABY}));
    }},
    {name: "thukkhita", kind: "person", x: 1040, y: CNG_FLOOR + 70, draw: function () {
      person(1040, CNG_FLOOR + 70, cngPerson("boy", CNG_THUKKHITA, {id: "thukkhita", size: cngAgeSize(3), face: -1, feel: "surprised",
                                                                   wonder: 1, at: C10_BABY}));
    }},
    {name: "elder in white", kind: "person", x: 600, y: CNG_FLOOR + 20, draw: function () {
      person(600, CNG_FLOOR + 20, cngPerson("elder", CNG_SEER, {id: "namer", face: 1, feel: "happy",
                                                               reachA: [mix(660, 720, names), CNG_FLOOR - 330, names],   // the reach's third number: out and back, no jump
                                                               at: C10_BABY}));
    }},
    {name: "woman", kind: "person", x: 1330, y: CNG_FLOOR + 10, draw: function () {
      person(1330, CNG_FLOOR + 10, cngPerson("weaver", {size: 0.72, id: "aunt", face: -1, feel: "happy", at: C10_BABY}));
    }}
  ]);
  c10Glow(t);
  pen.restore();
  cngFadeIn(t, 1);
}
