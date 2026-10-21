// decorate.js - the life of a scene: animals and birds on courses, for films made with oldcartoon.js.
// Load it after the kit and after the files of the animals a scene uses (beasts.js, northbirds.js, ...):
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
// along, what, points, speed}: on is false while it hides; x, y in pixels of the scene; face 1
// (right) or -1; moving true or false; along the pixels it has come; what the stop's word while it
// stands (else null); points the route [[x, y], ...]; speed in pixels a second.
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
  }
};

// lifePeck(at, t) gives back a peck, 0 to 1 (down and up twice a second), when at.what is "peck",
// and undefined otherwise. at: what courseAt() gives back; t: seconds.
// e.g. var at = courseAt(t, [[0, 300, 950, "peck"], [9, 300, 950]]); rooster(at.x, at.y, t, {peck: lifePeck(at, t)});
function lifePeck(at, t) {                           // a peck: down and up again, twice a second, at a stop marked "peck"
  return at.what === "peck" ? Math.max(0, Math.sin(t * Math.PI * 4)) : undefined;
}

// lifeFowl(at, look, t, hen) draws the kit's rooster (hen true: a hen) where courseAt() has it,
// walking as far as it goes and pecking at a "peck" stop. at: courseAt()'s answer; look: the
// rooster's look (look.size, 1 when left out, sizes only the box and the stride: the kit's rooster
// has one size); t: seconds. Returns the box it was drawn in, [left, top, right, bottom], pixels of the scene.
// e.g. var box = lifeFowl(courseAt(t, [[1, 300, 950], [5, 700, 950]]), {}, t, true);   // a hen, as LIFE_KINDS.hen draws one
function lifeFowl(at, look, t, hen) {
  var size = look.size || 1;
  var own = Object.assign({}, look);
  delete own.size;                                   // the kit's rooster has one size (a hen is drawn smaller of itself)
  rooster(at.x, at.y, t, Object.assign(own, {hen: hen, face: at.face, step: at.moving ? at.along / (70 * size) : undefined,
                                             peck: lifePeck(at, t)}));
  return [at.x - 90 * size, at.y - 150 * size, at.x + 90 * size, at.y];
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
// on (x, base) by its kind's painter (THING_KINDS: the household things of pieces.js, the water jar, the lantern),
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
  khom: function (one, look) { khom(one.x, one.base, Object.assign({size: one.size || 1}, look)); }   // hung from (x, base)
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
