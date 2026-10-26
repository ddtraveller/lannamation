// decorate.js - the life of a scene: animals and birds on courses, for films made with oldcartoon.js.
// Load it after the kit and after the files of the animals a scene uses (beasts.js, northbirds.js, butterflies.js,
// lannabirds.js, taleanimals.js, forestanimals.js, mangrai.js; offerings.js and thicket.js for those things):
//
//     <script src="oldcartoon.js"></script>
//     <script src="decorate.js"></script>
//
// A scene that is built is decorated in passes (docs/kit/places.md, "Decorating a scene"): its place (flora and mist,
// painted on its sheets or drawn live), its things (what a home or a hall of that place has: dress(), at the end of
// this file), its life (what lives there, at that hour, each on a course: decorate()), and a check of it
// (checks/ghost.py plots every course; checks/seek_check.py; kit_check.py).
//
// A course is a row of stops, [[second, x, y, what], ...]: where the animal is at each second, and what it does
// there ("sniff", "up", "rest", "peck", "hide", or nothing). From the first stop's second to the last stop's it
// is drawn; between two stops it goes from one to the other at an even pace, facing the way it goes, its feet
// or wings going as far as it goes; at a stop whose "what" is "hide" it is not drawn until the next stop (gone
// into a hole, into the thatch, behind the trees). Every frame is worked out from the second alone, as the kit's
// things are, so a still is the film's own frame.
//
// A scene's life is a list: [{name, kind, look, course, layer}, ...]. kind is one of LIFE_KINDS (below), look
// the animal's own look, layer "back" (drawn before the people, as a scene calls decorate(t, life, "back")) or
// "front" (after them), and calls its sounds: [[second, sound, loudness], ...], a sound of sounds.py's by name
// (the film's sound is mixed from them when its scenes are joined); a fourth number makes it a bed, laid end to end
// under the scene for that many seconds (cicadas, crickets, frogs: maeng/feelings.py's bed()). decorate(t, life, layer) draws every one of that layer at second t.
// A scene that draws by the kit's drawByZ() takes its life from lifeSprites() instead, which reads z (the band, as
// zOf() takes it; left out for its kind's own) and not layer: a bird, which can be anywhere, must then be given one.
var LIFE_KEYS = {};
["name", "kind", "look", "course", "layer", "calls", "z"].forEach(function (name) { LIFE_KEYS[name] = true; });

// courseAt(t, course) gives back where an animal on a course of stops is at second t:
// {on: false} before the first stop's second and after the last's; else {on, x, y, face, moving,
// along, what, mark, since, part, leg, points, speed}: on is false while it hides; x, y in pixels of
// the scene; face 1 (right) or -1; moving true or false; along the pixels it has come; what the
// stop's word while it stands (else null); mark the word of the stop it stands at or set out from
// (a creep that leaves a "stalk"); since the seconds since it came to that stop or set out from it;
// part how far along the way to the next stop (0 while it stands); leg how long that way is, in
// pixels; points the route [[x, y], ...]; speed in pixels a second.
// course: [[second, x, y, what], ...] in order of the seconds (see the top of this file).
// Changes nothing outside itself.
// e.g. var at = courseAt(t, [[2, 300, 900], [6, 700, 900, "sniff"], [8, 700, 900]]);
function courseAt(t, course) {
  // where an animal is at t along its course: {on, x, y, face, moving, along, what, points, speed}
  var n = course.length, k, along = 0, face = 1;
  if (t < course[0][0] || t > course[n - 1][0]) { return {on: false}; }
  for (k = 1; k < n && course[k][0] <= t; k++) {
    var dx = course[k][1] - course[k - 1][1], dy = course[k][2] - course[k - 1][2];
    along += Math.hypot(dx, dy);
    if (Math.abs(dx) > 0.5) { face = dx > 0 ? 1 : -1; }
  }
  var from = course[k - 1], to = course[Math.min(k, n - 1)];
  var u = k < n ? clamp((t - from[0]) / ((to[0] - from[0]) || 1)) : 0;
  var x = mix(from[1], to[1], u), y = mix(from[2], to[2], u), stretch = Math.hypot(to[1] - from[1], to[2] - from[2]);
  var moving = k < n && stretch > 0.5;
  if (moving && Math.abs(to[1] - from[1]) > 0.5) { face = to[1] > from[1] ? 1 : -1; }
  along += moving ? stretch * u : 0;
  var points = [];
  course.forEach(function (stop) {                   // the route its stops make (for a gecko's spine)
    var last = points[points.length - 1];
    if (!last || Math.hypot(stop[1] - last[0], stop[2] - last[1]) > 0.5) { points.push([stop[1], stop[2]]); }
  });
  return {on: from[3] !== "hide" || moving, x: x, y: y, face: face, moving: moving, along: along, what: moving ? null : from[3],
          mark: from[3] || null, since: t - from[0], part: moving ? u : 0, leg: moving ? stretch : 0,
          points: points, speed: moving ? stretch / ((to[0] - from[0]) || 1) : 0};
}

// The kinds of life, each a function (where, look, t) that draws one where courseAt() has it and gives back the
// box it was drawn in [left, top, right, bottom], in the scene. Every kind's own look goes through as it is.
var LIFE_KINDS = {
  mouse: function (at, look, t) {
    var size = look.size || 1, stride = 22 * size;  // a mouse's stride: its feet go as far as it goes
    mouse(at.x, at.y, Object.assign({}, look, {face: at.face, step: at.moving ? at.along / stride : undefined,
                                               sniff: at.what === "sniff" ? 1 : look.sniff, up: at.what === "up" ? 1 : look.up}));
    return [at.x - 70 * size, at.y - 34 * size, at.x + 40 * size, at.y + 4];
  },
  gecko: function (at, look, t) {                    // its spine keeps to the course's route; its head is at the course's point
    var size = look.size || 1, head = gecko(at.points, at.along, Object.assign({}, look, {t: t}));
    return [head.head[0] - 160 * size, head.head[1] - 160 * size, head.head[0] + 160 * size, head.head[1] + 160 * size];
  },
  flock: function (at, look, t) {                    // the kit's flock of small birds in flight (birds()), its leader at the point
    birds(t, at.x, at.y);
    return [at.x - 260, at.y - 40, at.x + 20, at.y + 40];
  },
  // the fowl of a yard and the birds of the north: walking (step, as far as they go), pecking at a stop marked "peck"
  // (a dip and a rise, twice a second), flying while they move (fly), the sunbird hovering ("hover") and sipping ("sip")
  rooster: function (at, look, t) { return lifeFowl(at, look, t, false); },
  hen: function (at, look, t) { return lifeFowl(at, look, t, true); },
  pheasant: function (at, look, t) {
    var size = look.size || 1;
    pheasant(at.x, at.y, t, Object.assign({}, look, {face: at.face, step: at.moving ? at.along / (60 * size) : undefined, peck: lifePeck(at, t)}));
    return [at.x - 120 * size, at.y - 110 * size, at.x + 60 * size, at.y];
  },
  peafowl: function (at, look, t) {
    var size = look.size || 1;
    peafowl(at.x, at.y, t, Object.assign({}, look, {face: at.face, step: at.moving ? at.along / (80 * size) : undefined, peck: lifePeck(at, t)}));
    return [at.x - 200 * size, at.y - 260 * size, at.x + 80 * size, at.y];
  },
  hornbill: function (at, look, t) {
    var size = look.size || 1;
    hornbill(at.x, at.y, t, Object.assign({}, look, {face: at.face, fly: at.moving}));
    return [at.x - 160 * size, at.y - 120 * size, at.x + 160 * size, at.y + 120 * size];
  },
  magpie: function (at, look, t) {
    var size = look.size || 1;
    blueMagpie(at.x, at.y, t, Object.assign({}, look, {face: at.face, fly: at.moving}));
    return [at.x - 140 * size, at.y - 60 * size, at.x + 60 * size, at.y + 40 * size];
  },
  sunbird: function (at, look, t) {
    var size = look.size || 1;
    sunbird(at.x, at.y, t, Object.assign({}, look, {face: at.face, hover: at.moving || at.what === "hover" || at.what === "sip",
                                                    sip: at.what === "sip"}));
    return [at.x - 30 * size, at.y - 20 * size, at.x + 30 * size, at.y + 20 * size];
  },
  chick: function (at, look, t) { return lifeChick(at, look, t); },
  // a grasshopper (oldcartoon.js): it sits at a stop, its feelers stirring, and goes from stop to stop in hops, an
  // arc higher the further it goes, its hind legs kicked out behind; at a "caught" stop it is snapped up, into the
  // beak over its spot in a tenth of a second (the hen's "caught" shows it there after); then "hide"
  grasshopper: function (at, look, t) {
    var size = (look.size || 0.9) * (at.what === "caught" ? 1 - clamp(at.since / 0.12) : 1);
    var arc = at.moving ? Math.sin(Math.PI * at.part) * (0.35 * at.leg + 18) : 0;
    if (size < 0.02) { return [at.x, at.y - 2, at.x + 1, at.y]; }
    grasshopper(at.x, at.y - arc, t, Object.assign({}, look, {face: at.face, size: size, leap: clamp(Math.sin(Math.PI * at.part) * 3)}));
    return [at.x - 40 * size, at.y - arc - 45 * size, at.x + 30 * size, at.y - arc + 4];
  },
  // the cattle egret (northbirds.js egret()): it walks between stops, pecks at a "peck" stop, and flies when look.fly
  // is true (it flies from stop to stop then, its feet at the course's point taken as the middle of its body)
  egret: function (at, look, t) {
    var size = look.size || 1;
    egret(at.x, at.y, t, Object.assign({}, look, {face: at.face, fly: !!look.fly, peck: lifePeck(at, t)}));
    return look.fly ? [at.x - 90 * size, at.y - 50 * size, at.x + 90 * size, at.y + 50 * size]
                    : [at.x - 50 * size, at.y - 110 * size, at.x + 50 * size, at.y];
  },
  // a fish of the river (oldcartoon.js nativeFish(), look.kind, "barb" unless told) that leaps: from one stop to the
  // next it jumps out of the water in an arc, higher the further it goes, nose up then down, a ring on the water where
  // it leaves and where it goes back in; give its stops "hide" so that it is unseen in the water between leaps
  fish: function (at, look, t) {
    var size = look.size || 1, rise = Math.sin(Math.PI * at.part) * (0.45 * at.leg + 30 * size);
    var tilt = -Math.cos(Math.PI * at.part) * 0.9 * at.face;
    if (at.part < 0.15 || at.part > 0.85) {                // the ring where it leaves the water or goes back in
      var near = at.part < 0.5 ? at.part / 0.15 : (1 - at.part) / 0.15, rx = at.part < 0.5 ? at.x - at.face * 0 : at.x;
      pen.strokeStyle = "rgba(255, 252, 238, " + (0.7 * (1 - near * 0.5)).toFixed(3) + ")";
      pen.lineWidth = 2;
      pen.beginPath(); pen.ellipse(rx, at.y + 4, 30 * size * (1.2 - near * 0.4), 6 * size, 0, 0, 7); pen.stroke();
    }
    pen.save();
    pen.translate(at.x, at.y - rise);
    pen.rotate(tilt);
    nativeFish(pen, 0, 0, size, at.face, look.kind || "barb", t);
    pen.restore();
    return [at.x - 40 * size, at.y - rise - 20 * size, at.x + 40 * size, at.y + 6];
  },

  // The animals of 2026-10-26 (butterflies.js, lannabirds.js, taleanimals.js, forestanimals.js, mangrai.js; load the
  // file of each a scene uses), each going as far as its feet go, the strides living_scenes.html measured for them.
  // A bird that can walk flies a way that sets out from a stop marked "fly" (or every way, look.fly), up off the
  // course by its own height; one of the trees and the air (kingfisher, parakeet) flies whenever it moves.
  // a butterfly (look.kind, a key of BUTTERFLIES: lacewing unless told): it flutters from stop to stop, lifting and
  // dipping as it goes and facing the way it goes; at a "sip" stop it sits on the flower, its wings opening and
  // shutting slowly. Few are better than many: one or two to a scene, on courses that cross it and leave
  // (owner, 2026-10-26, of the hero film: "a bit too many butterflies")
  butterfly: function (at, look, t) {
    var size = look.size || 1, sits = !at.moving && at.what === "sip", seed = look.seed || 0, own = Object.assign({}, look);
    var lift = sits ? 0 : 12 * Math.sin(t * 5 + seed) + 8 * Math.sin(t * 1.3 + seed);
    delete own.kind;
    butterfly(look.kind || "lacewing", at.x, at.y - lift, t, Object.assign(own, {size: size, rest: sits || undefined,
              turn: sits ? 0 : at.face * Math.PI / 2 * (at.moving ? 1 : 0.3) + 0.25 * Math.sin(t * 2.6 + seed)}));
    return [at.x - 40 * size, at.y - lift - 40 * size, at.x + 40 * size, at.y - lift + 40 * size];
  },
  // the large-billed crow (look.colour "white": the white crow of the tale, shining a little): it walks with its
  // swagger, pecks at "peck", caws at "call"
  crow: function (at, look, t) {
    var size = look.size || 1, air = lifeFlies(at, look);
    whiteCrow(at.x, at.y - (air ? 40 * size : 0), t, Object.assign({colour: "black", glow: look.colour === "white" ? 0.5 : 0}, look,
              {face: at.face, fly: air || undefined, step: !air && at.moving ? at.along / (30 * size) : undefined,
               peck: lifePeck(at, t), caw: at.what === "call" ? 1 : look.caw}));
    return [at.x - 90 * size, at.y - 130 * size, at.x + 90 * size, at.y];
  },
  // the spotted dove: walks, pecks at "peck", coos at "call", fluffs up at "rest"
  dove: function (at, look, t) {
    var size = look.size || 1, air = lifeFlies(at, look);
    spottedDove(at.x, at.y - (air ? 40 * size : 0), t, Object.assign({}, look, {face: at.face, fly: air || undefined,
                step: !air && at.moving ? at.along / (22 * size) : undefined, peck: lifePeck(at, t),
                coo: at.what === "call" ? 1 : look.coo, fluff: at.what === "rest" ? 0.5 : look.fluff}));
    return [at.x - 70 * size, at.y - 90 * size, at.x + 70 * size, at.y];
  },
  // the hill myna: hops along, flaps up when it flies
  myna: function (at, look, t) {
    var size = look.size || 1, air = lifeFlies(at, look), own = Object.assign({}, look);
    delete own.fly;                                  // the myna's own look has flap, not fly
    hillMyna(at.x, at.y - (air ? 30 * size : 0), t, Object.assign(own, {face: at.face,
             step: !air && at.moving ? at.along / (18 * size) : undefined, flap: air ? 1 : look.flap}));
    return [at.x - 60 * size, at.y - 80 * size, at.x + 60 * size, at.y];
  },
  // a kingfisher (look.kind "whitethroat" or "common"): on a perch it watches the water ("watch") or calls ("call");
  // it flies while it moves, and at a "dive" stop hovers with a fish
  kingfisher: function (at, look, t) {
    var size = look.size || 1;
    kingfisher(at.x, at.y, t, Object.assign({}, look, {face: at.face, fly: at.moving || undefined,
               hover: at.what === "dive" || undefined, fish: at.what === "dive" || look.fish,
               watch: at.what === "watch" ? 1 : look.watch, call: at.what === "call" ? 1 : look.call}));
    return [at.x - 70 * size, at.y - 80 * size, at.x + 70 * size, at.y + 30 * size];
  },
  // a parakeet (look.kind "redbreast" or "blossom"): it flies while it moves; on a branch it eats ("eat"), preens
  // ("preen") or calls ("call")
  parakeet: function (at, look, t) {
    var size = look.size || 1;
    parakeet(at.x, at.y, t, Object.assign({}, look, {face: at.face, fly: at.moving || undefined,
             eat: at.what === "eat" ? 1 : look.eat, preen: at.what === "preen" ? 1 : look.preen, call: at.what === "call" ? 1 : look.call}));
    return [at.x - 80 * size, at.y - 90 * size, at.x + 80 * size, at.y + 40 * size];
  },
  // a toad (look.kind "frog": a rice-field frog): it hops from stop to stop, calls at "call", its throat swelling
  toad: function (at, look, t) {
    var size = look.size || 1;
    toad(at.x, at.y, t, Object.assign({}, look, {face: at.face, hop: at.moving ? at.along / (30 * size) : undefined,
         call: at.what === "call" ? 1 : look.call}));
    return [at.x - 40 * size, at.y - 40 * size, at.x + 40 * size, at.y];
  },
  // a rhinoceros beetle: it creeps, lifts its horn at "lift", flies a way that sets out from a "fly" stop
  beetle: function (at, look, t) {
    var size = look.size || 1, air = lifeFlies(at, look);
    rhinoBeetle(at.x, at.y - (air ? 50 * size : 0), t, Object.assign({}, look, {face: at.face, fly: air || undefined,
                step: !air && at.moving ? at.along / (10 * size) : undefined, lift: at.what === "lift" ? 1 : look.lift}));
    return [at.x - 50 * size, at.y - (air ? 90 : 40) * size, at.x + 50 * size, at.y];
  },
  // a pond turtle (look.gold 1: the golden turtle of the tale): it paddles, and comes up to breathe at "breathe"
  turtle: function (at, look, t) {
    var size = look.size || 1;
    goldTurtle(at.x, at.y, t, Object.assign({swim: true}, look, {face: at.face, breathe: at.what === "breathe" ? 1 : look.breathe}));
    return [at.x - 70 * size, at.y - 40 * size, at.x + 70 * size, at.y + 10 * size];
  },
  // a barking deer (look.white: Chiang Mai's white one; look.fawn): walks, grazes ("graze"), stands with its tail
  // flagged ("alert"), barks ("call")
  deer: function (at, look, t) {
    var size = look.size || 1, pace = GAITS.deer[1] / 0.62 * size * (look.fawn ? 0.55 : 1);
    barkingDeer(at.x, at.y, t, Object.assign({}, look, {face: at.face, step: at.moving ? at.along / pace : undefined,
                graze: at.what === "graze" ? 1 : look.graze, alert: at.what === "alert" ? 1 : look.alert, bark: at.what === "call" ? 1 : look.bark}));
    return [at.x - 110 * size, at.y - 150 * size, at.x + 110 * size, at.y];
  },
  // a sambar (look.white: the white one of Chiang Mai's first sign; look.calf): walks, grazes ("graze")
  sambar: function (at, look, t) {
    var size = look.size || 1;
    sambar(at.x, at.y, t, Object.assign({}, look, {face: at.face, step: at.moving ? at.along / (160 * size) : undefined,
           graze: at.what === "graze" ? 1 : look.graze}));
    return [at.x - 160 * size, at.y - 260 * size, at.x + 160 * size, at.y];
  },
  banteng: function (at, look, t) {                  // the red ox of the forest: it walks
    var size = look.size || 1;
    banteng(at.x, at.y, t, Object.assign({}, look, {face: at.face, step: at.moving ? at.along / (150 * size) : undefined}));
    return [at.x - 170 * size, at.y - 230 * size, at.x + 170 * size, at.y];
  },
  // a goral of the limestone: it walks, grazes ("graze"), stands alert ("alert"); a way that sets out from a
  // "leap" stop it bounds up in one arc
  goral: function (at, look, t) {
    var size = look.size || 1, bound = at.moving && at.mark === "leap";
    goral(at.x, at.y - (bound ? 50 * size * Math.sin(Math.PI * at.part) : 0), t, Object.assign({}, look, {face: at.face,
          leap: bound ? at.part : undefined, step: at.moving && !bound ? at.along / (GAITS.goral[1] / 0.62 * 1.15 * size) : undefined,
          graze: at.what === "graze" ? 1 : look.graze, alert: at.what === "alert" ? 1 : look.alert}));
    return [at.x - 100 * size, at.y - 150 * size, at.x + 100 * size, at.y];
  },
  bambooRat: function (at, look, t) {                // the hoary bamboo rat: it stands, and digs at "dig"
    var size = look.size || 1;
    bambooRat(at.x, at.y, t, Object.assign({}, look, {face: at.face, dig: at.what === "dig" ? 1 : look.dig}));
    return [at.x - 60 * size, at.y - 50 * size, at.x + 60 * size, at.y];
  },
  // the white mouse and her four young of the tale: they scurry in a line as far as they go
  whiteMice: function (at, look, t) {
    var size = look.size || 1;
    whiteMice(at.x, at.y, t, Object.assign({}, look, {face: at.face, along: at.moving ? at.along / (24 * size) : look.along}));
    return [at.x - 160 * size, at.y - 30 * size, at.x + 60 * size, at.y];
  },
  // a white-handed gibbon (look.dark: a dark one): from stop to stop it swings arm over arm (gibbon() travels by its
  // own swings, so it is drawn from where it set out); at a "call" stop it sings
  gibbon: function (at, look, t) {
    var size = look.size || 1, own = Object.assign({}, look, {face: at.face, sing: at.what === "call" ? 1 : look.sing});
    if (at.moving) {
      var swing = at.along / (120 * size);
      own.swing = swing;
      own.sing = 0;
      gibbon(at.x - at.face * swing * 120 * size, at.y, t, own);
    } else {
      gibbon(at.x, at.y, t, own);
    }
    return [at.x - 120 * size, at.y - 40 * size, at.x + 120 * size, at.y + 200 * size];
  },
  // a Bengal slow loris, on a branch: it creeps from stop to stop, looks round ("look"), curls up ("curl"); give it
  // look.shine at night, its eyes catching the light
  loris: function (at, look, t) {
    var size = look.size || 1;
    slowLoris(at.x, at.y, t, Object.assign({}, look, {face: at.face, creep: at.moving ? at.along / (40 * size) : look.creep,
              look: at.what === "look" ? 1 : 0.2, curl: at.what === "curl" ? 1 : look.curl}));
    return [at.x - 70 * size, at.y - 70 * size, at.x + 70 * size, at.y + 20 * size];
  },
  catfish: function (at, look, t) {                  // a Mekong giant catfish, gliding under the water from stop to stop
    var size = look.size || 1;
    giantCatfish(at.x, at.y, t, Object.assign({}, look, {face: at.face}));
    return [at.x - 260 * size, at.y - 60 * size, at.x + 260 * size, at.y + 60 * size];
  }
};

// lifeFlies(at, look) says whether a bird that walks flies where courseAt() has it: on the way out from a stop
// marked "fly", or on every way when look.fly is true. at: courseAt()'s answer; look: the bird's look.
// Changes nothing. e.g. lifeFlies(courseAt(t, [[0, 300, 950, "fly"], [2, 900, 500]]), {})   // true at t 1
function lifeFlies(at, look) {
  return at.moving && (!!look.fly || at.mark === "fly");
}

// lifePeck(at, t) gives back a peck, 0 to 1 (down and up twice a second), when at.what is "peck",
// and undefined otherwise. at: what courseAt() gives back; t: seconds.
// e.g. var at = courseAt(t, [[0, 300, 950, "peck"], [9, 300, 950]]); rooster(at.x, at.y, t, {peck: lifePeck(at, t)});
function lifePeck(at, t) {                           // a peck: down and up again, twice a second, at a stop marked "peck"
  return at.what === "peck" ? Math.max(0, Math.sin(t * Math.PI * 4)) : undefined;
}

// lifeFowl(at, look, t, hen) draws the kit's rooster (hen true: a hen) where courseAt() has it,
// walking as far as it goes (rooster()'s walk, two steps to 56 of the ground, a hen's to 48), and at a
// "peck" stop foraging where it stands (roosterPeck(), roam 0: a few pecks at spots of their own, then
// a look about or, a rooster, a crow). Its hunt, by the words of its stops: "stalk", crouched with its head low and
// forward, frozen, and a slow creep on the way from there; "pounce", a lunge with the beak to the ground; "missed",
// its head up and cocked one way and the other ("look": the same, a look about); "caught", up with a grasshopper kicking in its beak, gulped down
// in 1.6 s (the grasshopper's own course is "caught" as the beak comes down, then "hide"). At a "crow" stop a
// rooster crows once, from the stop's first second. at: courseAt()'s answer; look: the rooster's look (look.size, 1 when left out, sizes
// only the box and the stride: the kit's rooster has one size); t: seconds. Returns the box it was
// drawn in, [left, top, right, bottom], pixels of the scene.
// e.g. var box = lifeFowl(courseAt(t, [[1, 300, 950], [5, 700, 950]]), {}, t, true);   // a hen, as LIFE_KINDS.hen draws one
function lifeFowl(at, look, t, hen) {
  var size = look.size || 1, x = at.x, since = at.since, act = {}, stride = 1;
  var own = Object.assign({}, look);
  delete own.size;                                   // the kit's rooster has one size (a hen is drawn smaller of itself)
  if (at.what === "peck") {
    act = roosterPeck(t, {seed: Math.round(at.x * 7 + at.y), roam: 0, hen: hen, face: at.face}).look;
  } else if (at.mark === "stalk") {                  // crouched, its head low and forward: frozen at the stop, a slow creep away from it
    act = {sink: 0.35, peck: 0.4, reach: 1};
    stride = 0.6;
    if (at.moving) { act.stride = stride; }
  } else if (at.what === "pounce") {                 // a lunge, the beak to the ground, the wings flicking out; then it draws back
    var lunge = fowlEase(since / 0.18) * (1 - fowlEase((since - 0.5) / 0.4));
    act = {peck: mix(0.4, 1, fowlEase(since / 0.18)), reach: 1, wings: since < 0.35 ? 0.4 : undefined};
    x += at.face * 10 * lunge * size;
  } else if (at.what === "missed" || at.what === "look") {   // its head up, cocked one way and the other: where did it go?
    act = {peck: 0, cock: Math.sin(since * 3.2) * 0.8};
  } else if (at.what === "crow") {                   // a crow, once, two beats long; then it stands
    var crowLong = 2 * (typeof BEAT === "number" ? BEAT : 0.5);
    act = since < crowLong ? {crow: since / crowLong} : {peck: 0};
  } else if (at.what === "caught") {                 // up with it kicking in its beak, a moment, and it is gulped down
    act = since < 1.6 ? {peck: 1 - fowlEase(since / 0.3), holding: "grasshopper", cock: 0.25 * fowlEase((since - 0.3) / 0.3),
                         gulp: clamp((since - 1.2) / 0.4)} : {peck: 0};
  }
  rooster(x, at.y, t, Object.assign(own, {hen: hen, face: at.face,
                                          walk: at.moving ? at.along / (4 * ROOSTER_WALK.reach * (hen ? 0.85 : 1) * size * stride) : undefined}, act));
  return [x - 90 * size, at.y - 150 * size, x + 90 * size, at.y];
}

// lifeChick(at, look, t) draws a chick (oldcartoon.js) where courseAt() has it: walking as far as it goes, foraging
// where it stands at a "peck" stop (roosterPeck(), roam 0: its pecks, its looks about), and at a "worm" stop the
// story of a worm it pulls out of the ground (chickWorm(), about 7.6 s; then it forages). at: courseAt()'s answer;
// look: the chick's look (size 1 unless told); t: seconds. Returns the box it was drawn in, pixels of the scene.
// e.g. lifeChick(courseAt(t, [[0, 400, 960, "worm"], [10, 400, 960]]), {}, t);
function lifeChick(at, look, t) {
  var size = look.size || 1, own = Object.assign({}, look, {face: at.face, size: size}), story = null;
  if (at.moving) { own.walk = at.along / (4 * CHICK_WALK.reach * size); }
  if (at.what === "worm") { story = chickWorm(at.since); }
  if (at.what === "peck" || (story && story.done)) {
    var forage = roosterPeck(t, {seed: Math.round(at.x * 11 + at.y), roam: 0, hen: true, face: at.face}).look;
    own.peck = forage.peck;
    own.reach = forage.reach;
    own.cock = forage.cock;
  } else if (story) {
    Object.assign(own, story.look);
  }
  var x = at.x + (story ? at.face * story.x * size : 0), beak = chick(x, at.y, t, own).beak;
  if (story && !story.done) { chickWormDrawn(at.x, at.y, at.face, size, story.worm, beak, t); }
  return [x - 40 * size, at.y - 45 * size, x + 40 * size, at.y];
}

// decorate(t, life, layer) draws every animal of a scene's life in that layer at second t.
//   t      the time in seconds
//   life   [{name, kind, look, course, layer, calls}, ...]: its keys are LIFE_KEYS, kind one of LIFE_KINDS
//          (above), course courseAt()'s, layer "back" or "front" ("front" when left out); calls is read
//          by the film's sound tools, not here
//   layer  "back" (call it before the people) or "front" (after them)
// Returns nothing: it draws with pen. An unknown key or kind is reported by the kit's checkNames() and
// checkName(). It tells the kit where each one is (sighted(), for eyes that watch), and pushes
// {name, kind, t, box} onto window.LIFE_SEEN when a check has set that list.
// e.g. decorate(t, [{name: "mouse", kind: "mouse", course: [[1, 200, 950], [5, 600, 950, "sniff"], [7, 600, 950]]}], "front");
function decorate(t, life, layer) {
  life.forEach(function (one) {
    checkNames("A scene's life", one, LIFE_KEYS);
    if ((one.layer || "front") !== layer) { return; }
    var at = courseAt(t, one.course);
    if (at.on) { lifeDrawn(t, one, at); }
  });
}

// lifeSprites(t, life) gives back the animals of a scene's life that are out at second t as sprites for the kit's
// drawByZ(): [{name, kind, z, x, y, draw}, ...], x and y where its feet are (its course's), z its own (the life's z key)
// or left out for its kind's (Z_KINDS). Its layer is not read: the band and the feet say where it goes.
//   t     the time in seconds
//   life  as decorate() takes it
// Changes nothing until a sprite's draw() is called, which draws it as decorate() does.
// e.g. drawByZ(people.concat(lifeSprites(t, S11_LIFE)));
function lifeSprites(t, life) {
  var out = [];
  life.forEach(function (one) {
    checkNames("A scene's life", one, LIFE_KEYS);
    var at = courseAt(t, one.course);
    if (at.on) { out.push({name: one.name, kind: one.kind, z: one.z, x: at.x, y: at.y, draw: function () { lifeDrawn(t, one, at); }}); }
  });
  return out;
}

// lifeDrawn(t, one, at) draws one animal of a scene's life where courseAt() has it, for decorate() and lifeSprites().
//   t: the time in seconds; one: an entry of the life; at: courseAt(t, one.course), out (at.on)
// Returns nothing: it draws with pen, tells the kit where it is (sighted()) and pushes it onto window.LIFE_SEEN
// when a check has set that list.
// e.g. lifeDrawn(t, S11_LIFE[2], courseAt(t, S11_LIFE[2].course));
function lifeDrawn(t, one, at) {
  checkName("A kind of life", one.kind, LIFE_KINDS);
  var box = LIFE_KINDS[one.kind](at, one.look || {}, t);
  if (box) {                                       // where it is, for eyes that watch (SIGHTS, oldcartoon.js)
    var mid = pen.getTransform().transformPoint(new DOMPoint((box[0] + box[2]) / 2, (box[1] + box[3]) / 2));
    sighted(mid.x, mid.y);
  }
  if (window.LIFE_SEEN && box) {                   // a check is watching: where it was, and in what measure
    var m = pen.getTransform(), a = m.transformPoint(new DOMPoint(box[0], box[1])), b = m.transformPoint(new DOMPoint(box[2], box[3]));
    window.LIFE_SEEN.push({name: one.name, kind: one.kind, t: t, box: [a.x / PIX, a.y / PIX, b.x / PIX, b.y / PIX]});
  }
}

// ---------- things: what a place has ----------
// A place's things are a list too: [{name, kind, x, base, size, look, layer, from, to}, ...], each drawn standing
// on (x, base) by its kind's painter (THING_KINDS: the household things of pieces.js, the water jar, the lantern,
// the offerings of offerings.js, a flower of flora.js, a flowering bush of thicket.js),
// "back" or "front" of the people as decorate()'s life is, and only from "from" to "to" (seconds) when given: a
// pot that is on the fire in one scene and not in another. dress(t, things, layer, tint) draws one layer of them,
// tint (a set's [colour, amount], at night) over every one that takes one. What is the same in every scene of a
// place is listed once, with its set (the film's sets.js), and dressed there.
var THING_KEYS = {};
["name", "kind", "x", "base", "size", "look", "layer", "from", "to"].forEach(function (name) { THING_KEYS[name] = true; });
var THING_KINDS = {
  huad: function (one, look, t) { huad(pen, one.x, one.base, one.size || 1, t, look); },
  kongKhao: function (one, look) { kongKhao(pen, one.x, one.base, one.size || 1, look); },
  krabung: function (one, look) { krabung(pen, one.x, one.base, one.size || 1, look); },
  mortar: function (one, look) { mortar(pen, one.x, one.base, one.size || 1, look); },
  taLaew: function (one, look) { taLaew(pen, one.x, one.base, one.size || 1, look); },
  namton: function (one) { namton(pen, one.x, one.base, one.size || 1); },
  khom: function (one, look) { khom(one.x, one.base, Object.assign({size: one.size || 1}, look)); },  // hung from (x, base)
  // the offerings of Lanna's rites (offerings.js): the flower cone, the footed bowl of flowers, the jasmine garland
  // (hung from (x, base): at a spirit house, a post, a doorway)
  swaiDok: function (one, look, t) { swaiDok(pen, one.x, one.base, one.size || 1, t); },
  khanDok: function (one, look, t) { khanDok(pen, one.x, one.base, one.size || 1, t); },
  malai: function (one, look, t) { malai(pen, one.x, one.base, one.size || 1, t); },
  // one flower or plant of flora.js standing at (x, base): look.flower, a key of FLORA, and its own look (colour)
  flora: function (one, look) {
    var own = Object.assign({size: one.size || 1}, look);
    delete own.flower;
    delete own.tint;
    flora(look.flower, one.x, one.base, own);
  },
  // a bed of flowering bushes, as the hero film's garden has them (thicket.js thkBush(), painted once and swaying in
  // the air): look {wide, high, seed, greens ("sun", "shade", or THK_GREENS when left out), blooms: [[name, count, r,
  // colour], ...] of THK_BLOOMS}; its base's middle at (x, base)
  bush: function (one, look, t) {
    var wide = look.wide || 400, high = look.high || 220, seed = look.seed || 1;
    var greens = {sun: THK_SUN, shade: THK_SHADE}[look.greens] || THK_GREENS;
    var sprite = thkOnce("bush " + JSON.stringify([wide, high, seed, look.greens, look.blooms]), function () {
      return thkSprite(wide + 80, high + 60, wide / 2 + 40, high + 20, function () { thkBush(wide, high, seed, greens, look.blooms || []); }, PIX);
    });
    thkPlace(sprite, one.x, one.base, one.size || 1, thkSway(t, one.x * 0.01, 0.35));
  }
};

// dress(t, things, layer, tint) draws one layer of a place's things at second t.
//   t       the time in seconds
//   things  [{name, kind, x, base, size, look, layer, from, to}, ...]: its keys are THING_KEYS, kind one of
//           THING_KINDS (above); x, base in pixels of the scene (base: the ground it stands on, or the
//           point a khom hangs from); size 1 when left out; layer "back" ("back" when left out) or "front";
//           from, to: the seconds it is there, always when left out
//   layer   "back" or "front"
//   tint    optional: a set's [colour, amount], laid over every thing except the namton and the khom
// Returns nothing: it draws with pen.
// e.g. dress(t, [{name: "jar", kind: "namton", x: 820, base: 940}], "back");
function dress(t, things, layer, tint) {
  things.forEach(function (one) {
    checkNames("A place's thing", one, THING_KEYS);
    if ((one.layer || "back") !== layer) { return; }
    if ((one.from !== undefined && t < one.from) || (one.to !== undefined && t > one.to)) { return; }
    checkName("A kind of thing", one.kind, THING_KINDS);
    var look = Object.assign({}, one.look || {});
    if (tint && one.kind !== "namton" && one.kind !== "khom") { look.tint = tint; }
    THING_KINDS[one.kind](one, look, t);
  });
}
