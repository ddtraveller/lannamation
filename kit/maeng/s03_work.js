// s03_work.js - scene 3 of the film of the creature with four ears and five eyes: Thukkhata at work (35 s).
// Older now, he leads the headman's buffalo out to the meadow on a rope; while it grazes he gathers the fallen
// wood under the great tree and binds it; and he carries the bundle home on his shoulder, tired, and he does
// not complain.
var S03_LONG = 35;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the cicadas of the meadow by day, and the buffalo's call as he leads it out.
var S03_SOUND = {calls: [[0, "cicadas", 0.55, 35], [4, "buffalo", 0.45]]};
var S03_LINES = [[1.5, 5.22, "M012"], [5.6, 11.2, "M013"], [25.5, 29.5, "M014"]];
var S03_STAND = 760, S03_GROUND = 968;              // where the buffalo stops to graze, and the ground the two walk on
var S03_PILE = MAENG_TREE[0] - 90;                  // where the fallen wood lies
// Its life: a red-billed blue magpie perched on the great tree's left limb, flicking its long tail; as he sets off
// home with the wood it flies off over the meadow. A flock goes over, high, while he leads the buffalo out.
var S03_LIFE = [
  {name: "blue magpie", kind: "magpie", look: {size: 0.8},
   course: [[0, 1520, 588], [26.0, 1520, 588], [33.0, -220, 260]]},
  {name: "flock", kind: "flock", course: [[3.0, 2150, 230], [14.0, -150, 170]]}
];

function s03From() {                                // where the buffalo sets off, so that it stops by 12 s
  var g = GAITS.buffalo, pace = g[1] / 0.62 * g[0] * 0.62;
  return S03_STAND - pace * (11.5 / (g[2] * BEAT));
}

function s03Ox(t) {
  return amble("buffalo", t, s03From(), S03_STAND, 0.5, {size: 0.62, rope: true});
}

function sceneWork(t) {
  pen.drawImage(maengSky("day"), 0, 0);
  cumulus(pen, t + 40, MAENG_CLOUDS.day);
  pen.drawImage(maengYard().back, 0, 0);
  pen.drawImage(maengMeadow().front, 0, 0);
  decorate(t, S03_LIFE, "front");                   // on the tree and in the sky: before the buffalo and the lad
  var ox = s03Ox(t), lad = maengPerson("boy", MAENG_LAD, {id: "lad"}), go;
  var gathered = between(t, 16, 21.5);              // how much of the wood he has picked up
  if (t < ox.arrives + 1) {                         // leading the buffalo: ahead of it at its pace, the rope in his back hand
    maengLead(ox, s03From(), S03_GROUND, lad, 0.62);
    return;
  }
  buffalo(ox.x, S03_GROUND - 6, ox.look);           // it grazes where it stopped
  if (t < 24) {                                     // to the tree, and down to gather the wood
    go = stroll(t, S03_STAND + 380, S03_PILE - 50, ox.arrives + 1.2, lad);
    lad = go.look;
    if (t > 16 && t < 22) {                         // stooping to the wood, a hand to the ground
      Object.assign(lad, {sit: 1, bend: 0.9, reachA: [go.x + 40, S03_GROUND - 10], feel: "concerned"});
    }
    firewood(pen, S03_PILE, S03_GROUND - 4, 0.55, {loose: t < 22, count: 2 + Math.round(5 * gathered)});
    person(go.x, S03_GROUND, lad);
  } else {                                          // home with the bundle on his shoulder
    go = stroll(t, S03_PILE - 50, -260, 24, lad);
    // The bundle lies on his far shoulder, behind his head, its ends out before and behind him; his near hand is
    // up at its front end. Measured first, drawn before him.
    var face = go.look.face, shoulder = maengMeasure(go.x, S03_GROUND, go.look).shoulderB;
    firewood(pen, shoulder[0] + 22 * face, shoulder[1] - 10, 0.78, {turn: -0.2 * face});
    person(go.x, S03_GROUND, Object.assign(go.look, {reachA: [shoulder[0] + 62 * face, shoulder[1] - 22], fingersA: [0.8, 0.85, 0.9, 0.95, 0.7], smile: 0.4}));
  }
}
