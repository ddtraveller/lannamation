// s03_work.js - scene 3 of the film of the creature with four ears and five eyes: Thukkhata at work (35 s).
// Older now, he leads the headman's buffalo out to the meadow on a rope; while it grazes he gathers the fallen
// wood under the great tree and binds it; and he carries the bundle home on his shoulder, tired, and he does
// not complain.
var S03_LONG = 36.48;   // 35 until 2026-10-24: 1.48 s inserted for the narrator's own reading (scene_retime.py)
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the cicadas of the meadow by day, and the buffalo's call as he leads it out.
var S03_SOUND = {calls: [[0, "cicadas", 0.55, 36.48], [4, "buffalo", 0.45]]};
var S03_LINES = [[1.5, 6.88, "M012"], [7.08, 13.5, "M013"], [26.98, 32.68, "M014"]];
var S03_STAND = 760, S03_GROUND = 968;              // where the buffalo stops to graze, and the ground the two walk on
var S03_PILE = MAENG_TREE[0] - 90;                  // where the fallen wood lies
var S03_LIFT = [23.78, 24.38, 25.48];                  // he bends to the bound bundle, lifts it to his shoulder, and sets off home
// Its life: a red-billed blue magpie perched on the great tree's left limb, flicking its long tail; as he sets off
// home with the wood it flies off over the meadow. A flock goes over, high, while he leads the buffalo out.
var S03_LIFE = [
  {name: "blue magpie", kind: "magpie", z: "set", look: {size: 0.8},     // on the tree, then over the meadow: of the set
   course: [[0, 1520, 588], [27.48, 1520, 588], [34.48, -220, 260]]},
  {name: "flock", kind: "flock", z: "sky", course: [[3.0, 2150, 230], [15.48, -150, 170]]}
];

// Gives back an x in pixels of the sheet (left of the picture), from the kit's GAITS.buffalo and BEAT.
// e.g. amble("buffalo", t, s03From(), S03_STAND, 0.5, {size: 0.62, rope: true});
function s03From() {                                // where the buffalo sets off, so that it stops by 12 s
  var g = GAITS.buffalo, pace = g[1] / 0.62 * g[0] * 0.62;
  return S03_STAND - pace * (11.5 / (g[2] * BEAT));
}

// The buffalo at the scene's second t: what amble() gives back ({x, look, arrives, ...}); it draws nothing.
// e.g. var ox = s03Ox(t);
function s03Ox(t) {
  return amble("buffalo", t, s03From(), S03_STAND, 0.5, {size: 0.62, rope: true});
}

// Tufts of grass on the meadow, [x, y, size], and the buffalo grazing them once it has stopped (owner, 2026-10-21:
// "Add a buffalo eating grass behavior and show the buffalo eating. Add some grass tufts"): its head goes down a
// second after it stops, comes up for a moment every 6 s, and the tuft under its muzzle is cropped as the scene goes.
var S03_TUFTS = [[300, 952, 0.9], [520, 990, 1.1], [1130, 958, 0.8], [1290, 1012, 1.2], [1700, 970, 1.0], [180, 1030, 1.3]];
// How far down its head is at second t, 0 (up) to 1 (grazing); ox: what s03Ox() gave back.
// e.g. buffalo(ox.x, S03_GROUND - 6, Object.assign({}, ox.look, {graze: s03Graze(t, ox)}));
function s03Graze(t, ox) {
  var down = between(t, ox.arrives + 1, ox.arrives + 2.4), cycle = (t - ox.arrives - 2.4) % 6;
  var lift = t > ox.arrives + 2.4 && cycle > 4.4 ? Math.sin(Math.PI * (cycle - 4.4) / 1.6) : 0;
  return down * (1 - 0.8 * lift);
}
// ox: what s03Ox() gave back; gives back an x in pixels of the sheet. e.g. var x = s03Muzzle(ox);
function s03Muzzle(ox) {                             // where its muzzle meets the ground when it grazes
  return ox.x + 195 * 0.62 * GAITS.buffalo[0] * (ox.look.face || 1);
}
// The tufts of S03_TUFTS as sprites for drawByZ(), each by its base (a plant is compared by its base), and with an ox
// (what s03Ox() gave back, or null) the one it eats, under its muzzle. e.g. drawByZ(s03Tufts(t, null));
function s03Tufts(t, ox) {
  var out = S03_TUFTS.map(function (tuft) {
    return {name: "tuft", kind: "tuft", x: tuft[0], y: tuft[1], draw: function () { grassTuft(pen, tuft[0], tuft[1], tuft[2], {t: t}); }};
  });
  if (ox) {                                          // the one it eats, over its muzzle
    var x = s03Muzzle(ox);
    out.push({name: "eaten tuft", kind: "tuft", x: x, y: S03_GROUND - 2, draw: function () {
      grassTuft(pen, x, S03_GROUND - 2, 1.0, {t: t, eaten: between(t, ox.arrives + 2.4, S03_LONG)});
    }});
  }
  return out;
}

// Scene 3, the entry the film calls (SCENES): t, its own second, 0 to S03_LONG (35 s): he leads the buffalo out
// until it stops (about 12 s), gathers the wood (16 s to 22 s), goes home with it from 24 s. Gives back nothing: it
// draws the whole sheet with pen. From sets.js: maengSky("day"), MAENG_CLOUDS.day, maengYard().back,
// maengMeadow(), MAENG_TREE, maengPerson() with MAENG_LAD, maengLead(), maengMeasure(). Its life is S03_LIFE; its
// words S03_LINES (M012 to M014), written under it by the page. e.g. sceneWork(20);
//
// The lad lifting the bound bundle at second t (S03_LIFT), go: what stroll() gave back for him, stood by the pile. Down
// to it (S03_LIFT[0] to [1]), then up with it to his shoulder ([1] to [2]), where the walk home has it from 24 s; where
// it lay on the ground and was on his shoulder the next frame (the blink check, 2026-10-22; owner: "Show him lift it").
// Gives back his sprite for drawByZ(), the bundle with him. e.g. drawByZ([s03Lift(23.5, go)]);
function s03Lift(t, go) {
  var down = s03Ease(between(t, S03_LIFT[0], S03_LIFT[1])), up = s03Ease(between(t, S03_LIFT[1], S03_LIFT[2]));
  var face = -1, shoulder = maengMeasure(go.x, S03_GROUND, Object.assign({}, go.look, {face: -1})).shoulderB;   // where the walk home carries it
  var stand = Object.assign({}, go.look, {face: up < 0.5 ? 1 : -1});   // turned to the bundle, on his right, to bend for it; back as he lifts it
  // Turned for home, the bundle behind him, his hand and the bundle dip as they swing past his side and up: straight
  // from the ground to the shoulder the hand passed through the shoulder itself, and the elbow swung across in a
  // frame (arms_check, 23.73 s).
  var dip = 60 * Math.sin(Math.PI * clamp((up - 0.5) / 0.5));
  var bx = mix(S03_PILE, shoulder[0] + 22 * face, up), by = mix(S03_GROUND - 4, shoulder[1] - 10, up) + dip;
  var look = Object.assign({}, stand, {sit: down * (1 - up), bend: 0.9 * down * (1 - up), feel: "concerned",
                                       reachA: [mix(S03_PILE + 10, shoulder[0] + 62 * face, up), mix(S03_GROUND - 30, shoulder[1] - 22, up) + dip]});
  return {name: "lad", kind: "person", x: go.x, y: S03_GROUND, draw: function () {
    if (up > 0) { firewood(pen, bx, by, mix(0.55, 0.78, up), {turn: -0.2 * face * up}); }
    else { firewood(pen, S03_PILE, S03_GROUND - 4, 0.55, {loose: false, count: 7}); }   // still on the ground as he bends to it
    person(go.x, S03_GROUND, look);
  }};
}
// u: 0 to 1; gives back 0 to 1, eased in and out. e.g. s03Ease(0.5)   // 0.5
function s03Ease(u) { u = clamp(u); return u * u * (3 - 2 * u); }

// Its z plan (oldcartoon.js, Z): the sky and the yard as painted first; then by drawByZ the flock in "sky", so it flies
// behind the great tree (owner, 2026-10-22: "the birds flying by ... should fly behind the tree"); in "set" the meadow
// with the tree (a painted sheet, at the back of its band) and the magpie (on the tree's limb, then over the meadow),
// and in "people" by their feet or bases: the
// tufts, the buffalo (S03_GROUND - 6), the pile of wood (- 4), the eaten tuft (- 2), the lad (S03_GROUND), so a tuft
// nearer than his feet is in front of his legs as he walks home past it.
// The rope falling from his hand as he lets go: from his wrist to the buffalo's nose, its end going down to the
// grass by the muzzle. wrist, nose: [x, y] in the film's own pixels; u: 0 (held) to 1 (on the grass). Gives back
// nothing: it draws with pen.
function s03Slack(wrist, nose, u) {
  var end = [mix(wrist[0], nose[0] + 40 * PIX, u), mix(wrist[1], nose[1] + 70 * PIX, u)];
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.strokeStyle = "#c9a878";
  pen.lineWidth = 3 * PIX;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(end[0], end[1]);
  pen.quadraticCurveTo((end[0] + nose[0]) / 2, Math.max(end[1], nose[1]) + 26 * PIX * (1 - u), nose[0], nose[1]);
  pen.stroke();
  pen.restore();
}

function sceneWork(t) {
  pen.drawImage(maengSky("day"), 0, 0);
  maengClouds(t + 40, "day");
  pen.drawImage(maengYard().back, 0, 0);
  var ox = s03Ox(t), lad = maengPerson("boy", MAENG_LAD, {id: "lad"}), go;
  var gathered = between(t, 17.48, 22.98);              // how much of the wood he has picked up
  var sprites = [{name: "meadow", kind: "meadow", z: "set", y: 0, draw: function () { pen.drawImage(maengMeadow().front, 0, 0); }}]
    .concat(lifeSprites(t, S03_LIFE));
  if (t < ox.arrives + 1) {                         // leading the buffalo: ahead of it at its pace, the rope in his back hand
    drawByZ(sprites.concat(s03Tufts(t, null), [
      {name: "lad and buffalo", kind: "person", x: ox.x, y: S03_GROUND, draw: function () { maengLead(ox, s03From(), S03_GROUND, lad, 0.62); }}
    ]));
    return;
  }
  // He lets go of the rope over 0.6 s, his back hand coming down from where it held it and the rope falling slack
  // from the buffalo's nose to the grass (the render's look-over, 2026-10-26: "lad and buffalo blinked out at 13.02
  // s": the arm dropped and the rope was gone in one frame, where the lead gave way to the two of them apart).
  var letGo = between(t, ox.arrives + 1, ox.arrives + 1.6), nose = null;
  sprites = sprites.concat(s03Tufts(t, ox), [       // it grazes where it stopped
    {name: "buffalo", kind: "buffalo", x: ox.x, y: S03_GROUND - 6, draw: function () {
      var drawn = buffalo(ox.x, S03_GROUND - 6, Object.assign({}, ox.look, {graze: s03Graze(t, ox)}));
      var s = 0.62 * GAITS.buffalo[0] * PIX;     // where the rope goes through its nose, as maengLead() finds it
      nose = [drawn.head[0] + ox.look.face * 104 * s, drawn.head[1] + 92 * s];
    }}
  ]);
  if (t < 25.48) {                                     // to the tree, and down to gather the wood
    go = stroll(t, S03_STAND + 380, S03_PILE - 50, ox.arrives + 1.2, lad);
    lad = go.look;
    // Stooping to the wood, a hand to the ground, from 16 s; up again before he bends to the bundle (S03_LIFT). Each
    // eased over half a second (poseSteps; it once came in one frame, a pop: checks/pop_check.py).
    Object.assign(lad, poseSteps(t, [[0, {}], [17.48, {sit: 1, bend: 0.9, reachA: [go.x + 40, S03_GROUND - 10], feel: "concerned"}], [23.18, {}]], 0.5));
    if (letGo < 1) {                                // the hand that held the rope, as maengLead() held it, easing down
      Object.assign(lad, poseSteps(t, [[0, {handB: [-56, 26], fingersB: [0.75, 0.85, 0.9, 0.95, 0.7]}], [ox.arrives + 1, {}]], 0.6));
    }
    if (t >= S03_LIFT[0]) {                         // the lift: down to the bound bundle, and up with it to his shoulder
      sprites.push(s03Lift(t, go));
    } else {
      sprites.push({name: "wood", kind: "firewood", x: S03_PILE, y: S03_GROUND - 4, draw: function () {
        firewood(pen, S03_PILE, S03_GROUND - 4, 0.55, {loose: t < 23.48, count: 2 + Math.round(5 * gathered)});
      }});
    }
    drawByZ(sprites.concat(t >= S03_LIFT[0] ? [] : [
      {name: "lad", kind: "person", x: go.x, y: S03_GROUND, draw: function () {
        var joints = person(go.x, S03_GROUND, lad);
        if (letGo < 1 && nose) { s03Slack(joints.wristB, nose, letGo); }
      }}
    ]));
  } else {                                          // home with the bundle on his shoulder
    go = stroll(t, S03_PILE - 50, -260, 25.48, lad);
    // The bundle lies on his far shoulder, behind his head, its ends out before and behind him; his near hand is
    // up at its front end. Measured first, drawn before him, with him.
    var face = go.look.face, shoulder = maengMeasure(go.x, S03_GROUND, go.look).shoulderB;
    drawByZ(sprites.concat([
      {name: "lad", kind: "person", x: go.x, y: S03_GROUND, draw: function () {
        firewood(pen, shoulder[0] + 22 * face, shoulder[1] - 10, 0.78, {turn: -0.2 * face});
        person(go.x, S03_GROUND, Object.assign(go.look, {reachA: [shoulder[0] + 62 * face, shoulder[1] - 22], fingersA: [0.8, 0.85, 0.9, 0.95, 0.7], smile: 0.4}));
      }}
    ]));
  }
  maengAir(t, "work", "day");                     // the meadow's air, and its grass soft at the corners (sets.js)
}
