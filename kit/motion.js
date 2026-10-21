// motion.js - timing and travel for films of the Lanna cartoon kit (oldcartoon.js).
//
// Load it after the kit. Everything here is a plain function of the time, with no
// state between frames: a frame drawn alone is the frame the film would show, which
// is what render.py and the maker's scrub bar need.
//
//   ramp(t, a, b, name)        0 at second a, 1 at second b, bent by the ease named
//   tween(t, points, name)     a value through [[second, value], ...]: held before the first, eased between, held after the last;
//                              a value is a number, a colour "#rrggbb", or a list of numbers such as [x, y]
//   springTween(t, points, look)  a number through points in time on a spring: pulled to each new value at its second, and swinging past
//   cycle(t, seconds, look)    a repeat, 0 to 1 over and over: a loop, or back the next time ("reverse", "mirror"), with a rest between
//   span(v, from, to, name)    a value of one range as a value of another: span(speed, [0, 300], [0, 0.2]) is a lean that grows with the speed
//   glide(t, from, speed, look)  a thing thrown or let go: it slows as it goes and stops on its own, or at a bound
//   ease(name, u)              a curve from 0 to 1: "smooth", "in", "out", "back", "bounce", "elastic", "wobble", "anticipate", "spring", "linear";
//                              the form of any: "back in", "bounce out", "elastic inout"; and some take numbers:
//                              "spring 0.8 0.5" (seconds, bounce), "steps 4" (that many drawings), "bezier .4 0 .2 1" (a cubic Bezier)
//   held(t, frames)            the time as a cartoon drawn on twos or threes: t held for that many frames
//   springAt(t, look)          a spring let go at second 0: 0 to 1 with an overshoot that settles
//   springTime(look)           the second by which that spring has settled
//   stagger(n, count, look)    how late the n-th of a crowd of count starts
//   where(keys, t)             where a thing on a course is now (see "a course" below)
//
// The ideas are the ones every animation library offers: named eases and their forms,
// a value through keyframes, a spring that is a formula of the time and is asked for
// in seconds, repeats, staggered starts, motion along a path with its heading and the
// distance it has come. The code is the kit's own.

// ---------- eases ----------
// Each takes u, how far along in time (0 to 1), and gives how far along in the move.
// "smooth" is what the kit's between() does. "back" overshoots and comes back, "bounce"
// lands like a dropped ball, "elastic" swings past and settles, "wobble" is a hand that
// does not draw an even move.
var EASES = {
  linear: function (u) { return u; },
  smooth: function (u) { return u * u * (3 - 2 * u); },
  in: function (u) { return u * u * u; },
  out: function (u) { return 1 - Math.pow(1 - u, 3); },
  back: function (u) { return 1 - (1 - u) * (1 - u) * (1 - 3.4 * u); },
  bounce: function (u) {
    var span = 1 / 1.875, drop = 0.25, x = u;           // the fall, then three bounces each half as long and a quarter as high: together exactly 1
    if (x < span) { return (x / span) * (x / span); }
    for (var n = 0; n < 3; n++) {
      x -= span;
      span *= 0.5;
      if (x <= span || n === 2) { var c = Math.min(1, x / span); return 1 - drop * 4 * c * (1 - c); }
      drop *= 0.25;
    }
    return 1;
  },
  elastic: function (u) { return 1 - Math.pow(2, -8 * u) * Math.cos(u * 6 * Math.PI) * (1 - u); },
  wobble: function (u) { return u + (dice(Math.floor(u * 12) + 3) - 0.5) * 0.32 * u * (1 - u); },
  anticipate: function (u) {                                 // the cartoon's wind-up: a pull back for the first half, then a rush that lands
    return u < 0.5 ? (1 - EASES.back(1 - 2 * u)) / 2 : 1 - Math.pow(2, -10 * (2 * u - 1)) / 2;
  },
  spring: function (u) { return springCurve(SPRING_EASE)(u); }   // a spring's whole swing, 0 to settled, as a curve
};
var SPRING_EASE = {seconds: 1, bounce: 0.4};

// Three eases are made from numbers written after the name: "spring 0.8 0.5" is a spring
// of those seconds and that bounce, "steps 4" moves in that many drawings (each held, the
// last at the end), and "bezier .4 0 .2 1" is the cubic Bezier curve of CSS, by its two
// handles (x1 y1 x2 y2). Without numbers: "spring" is SPRING_EASE, "steps" is 4 drawings,
// "bezier" is the CSS "ease".
// springCurve(look) gives back an ease curve, a function of u (0 to 1) to 0 to 1: the spring's whole
// swing (springAt with that look) squeezed into u, and exactly 1 at u = 1. look is springAt's.
// Changes nothing outside itself.
// e.g. var curve = springCurve({seconds: 0.8, bounce: 0.5}); curve(0.5)
function springCurve(look) {
  var whole = springTime(look);
  return function (u) { return u >= 1 ? 1 : springAt(u * whole, look); };
}

// stepsCurve(count) gives back an ease curve that moves in count held drawings (rounded, at least 1;
// 4 when left out): u = 0.5 with 4 steps gives 0.5, u = 0.6 gives 0.5 too.
// e.g. stepsCurve(4)(0.6)
function stepsCurve(count) {
  count = Math.max(1, Math.round(count || 4));
  return function (u) { return Math.min(1, Math.floor(u * count) / count); };
}

// bezierCurve(x1, y1, x2, y2) gives back an ease curve: the cubic Bezier of CSS's cubic-bezier(),
// by its two handles (x from 0 to 1, y any number). The curve gives 0 at u <= 0 and 1 at u >= 1.
// e.g. bezierCurve(0.4, 0, 0.2, 1)(0.5)
function bezierCurve(x1, y1, x2, y2) {   // the point at s along a cubic Bezier from (0,0) through the handles to (1,1); find the s whose x is u, then read y
  function along(s, a, b) { return 3 * a * s * (1 - s) * (1 - s) + 3 * b * s * s * (1 - s) + s * s * s; }
  return function (u) {
    if (u <= 0) { return 0; }
    if (u >= 1) { return 1; }
    var s = u, n, x, slope, low = 0, high = 1;
    for (n = 0; n < 8; n++) {                                      // Newton's steps: usually enough
      x = along(s, x1, x2) - u;
      if (Math.abs(x) < 1e-6) { return along(s, y1, y2); }
      slope = 3 * x1 * (1 - s) * (1 - 3 * s) + 3 * x2 * s * (2 - 3 * s) + 3 * s * s;
      if (Math.abs(slope) < 1e-6) { break; }
      s -= x / slope;
    }
    for (n = 0; n < 24; n++) {                                     // and when they wander, halving between 0 and 1 always lands
      s = (low + high) / 2;
      if (along(s, x1, x2) < u) { low = s; } else { high = s; }
    }
    return along(s, y1, y2);
  };
}

var MADE = {
  spring: function (n) { return springCurve(n.length ? {seconds: n[0], bounce: n.length > 1 ? n[1] : 0.3} : SPRING_EASE); },
  steps: function (n) { return stepsCurve(n[0]); },
  bezier: function (n) { return n.length === 4 ? bezierCurve(n[0], n[1], n[2], n[3]) : bezierCurve(0.25, 0.1, 0.25, 1); }
};

// Each ease above is a whole move or lands at its end ("out"). A name may ask for a
// form: "back in" is the back curve turned round (the overshoot at the start), "bounce
// out" is bounce as it is, "elastic inout" is the "in" form for the first half and its
// mirror for the second. "in" and "out" themselves are the cubic curves.
var SHAPES = {in: "in", out: "out", back: "out", bounce: "out", elastic: "out", spring: "out", steps: "out"};
var CURVES = {};

// reversed(curve) gives back that ease curve turned round: 1 - curve(1 - u). "back" made "back in".
// e.g. reversed(EASES.back)(0.2)
function reversed(curve) { return function (u) { return 1 - curve(1 - u); }; }
// mirrored(curve) gives back an "inout" curve: curve over the first half of u, its mirror over the second.
// e.g. mirrored(EASES.in)(0.25)
function mirrored(curve) { return function (u) { return u < 0.5 ? curve(2 * u) / 2 : 1 - curve(2 - 2 * u) / 2; }; }

// curveOf(name) gives back the curve, a function of u (0 to 1), for an ease name such as "smooth",
// "back in", "spring 0.8 0.5", "steps 4" or "bezier .4 0 .2 1" (the names: the top of this file).
// An unknown name warns and gives "smooth"; an unknown form warns and uses the ease as it is.
// Fills CURVES, the cache of curves by name.
// e.g. curveOf("bounce out")(0.7)
function curveOf(name) {
  if (CURVES[name]) { return CURVES[name]; }
  var words = String(name).trim().split(/\s+/), base = EASES[words[0]], shape = SHAPES[words[0]], form, numbers = [], curve;
  words.slice(1).forEach(function (word) { if (isNaN(Number(word))) { form = word; } else { numbers.push(Number(word)); } });
  if (MADE[words[0]] && (numbers.length || !base)) { base = MADE[words[0]](numbers); }
  if (!base) { warn("ease: no ease is named " + JSON.stringify(name) + "; using smooth"); return EASES.smooth; }
  if (!form) { curve = base; }
  else if (form === "in") { curve = shape === "out" ? reversed(base) : base; }
  else if (form === "out") { curve = shape === "in" ? reversed(base) : base; }
  else if (form === "inout") { curve = mirrored(shape === "out" ? reversed(base) : base); }
  else { warn("ease: no form is named " + JSON.stringify(form) + " (in, out, inout); using " + words[0]); curve = base; }
  CURVES[name] = curve;
  return curve;
}

// ease(name, u) gives back how far along a move is, usually 0 to 1 ("back" and "elastic" go past),
// u of the way along in time (0 to 1, held there outside). name: an ease name (see curveOf).
// e.g. var x = 100 + 400 * ease("back out", (t - 2) / 1.5);
function ease(name, u) {
  return curveOf(name)(clamp(u));
}

// ramp(t, a, b, name) gives back 0 before second a, 1 after second b and the eased way between.
// t: the film's time in seconds; name: an ease name ("smooth" when left out). a must not equal b.
// e.g. pen.globalAlpha = ramp(t, 4, 5.5, "out");
function ramp(t, a, b, name) {           // 0 before second a, 1 after second b, eased between
  return ease(name || "smooth", (t - a) / (b - a));
}

// mixOf(a, b, u) gives back the value u of the way (0 to 1, or past) from a to b: numbers, colours
// "#rrggbb" (mixed by the kit's blend()) or lists of numbers of one length.
// e.g. mixOf([0, 0], [100, 40], 0.5)
function mixOf(a, b, u) {                // u of the way from a to b: a number, a colour "#rrggbb" (the kit's blend), or a list of numbers
  if (typeof a === "number") { return a + (b - a) * u; }
  if (typeof a === "string") { return blend(a, b, u); }
  return a.map(function (v, j) { return v + (b[j] - v) * u; });
}

// tween(t, points, name) gives back a value through points in time.
// t: the time in seconds. points: [[second, value], ...] in order of the seconds, at least one;
// the values all numbers, all colours "#rrggbb" or all lists of numbers of one length.
// name: one ease name for every step ("smooth" when left out), or a list of names, one for
// each step between two points. Returns the value now. Changes nothing outside itself.
// e.g. var x = tween(t, [[2, 160], [5, 620], [8, 620]], "smooth");  var sky = tween(t, [[0, "#9ad0e8"], [20, "#e8a070"]]);
function tween(t, points, name) {        // a value through points in time, [[second, value], ...]: the first value before
  var last = points.length - 1, i = 0;    // its second, eased between neighbours, the last value after; name is one ease or one a step
  if (t <= points[0][0]) { return points[0][1]; }
  if (t >= points[last][0]) { return points[last][1]; }
  while (t >= points[i + 1][0]) { i++; }
  var a = points[i], b = points[i + 1];
  return mixOf(a[1], b[1], ease((Array.isArray(name) ? name[i] : name) || "smooth", (t - a[0]) / (b[0] - a[0])));
}

// A number through points in time on a spring: at each point's second the spring is
// pulled toward the new value and swings past it, still swinging when the next pull
// comes. A spring is linear, so the answer is the first value plus one swing
// (springAt) for every change, each started at its own second; no frame depends on
// the one before. The look is springAt's (stiffness, damping, mass, velocity; or
// seconds and bounce). A lantern tugged along a line, a kite, a held thing that lags.
// springTween(t, points, look) gives back a number through points in time, on a spring.
// t: the time in seconds. points: [[second, number], ...] in order, at least one. look: springAt's
// ({seconds: 0.6, bounce: 0.4}, or stiffness, damping, mass, velocity; 80, 10, 1, 0 when left out).
// Returns the number now: the first value before the second point's second. Changes nothing outside.
// e.g. var lean = springTween(t, [[0, 0], [3, 0.3], [6, 0]], {seconds: 0.8, bounce: 0.5});
function springTween(t, points, look) {
  var x = points[0][1];
  for (var i = 1; i < points.length; i++) { x += (points[i][1] - points[i - 1][1]) * springAt(t - points[i][0], look); }
  return x;
}

// A repeat: 0 to 1 over "seconds", again and again. look.kind says how it goes back:
// "loop" (the default) starts again from 0; "reverse" runs the same way back, the
// ease traced backwards; "mirror" goes back by the same ease run forwards (a bounce
// up is as quick as the bounce down). look.ease bends each run (linear); look.rest
// is a pause in seconds at the end of each run, held there; look.from is the second
// the first run begins (0, and before it the answer is 0). A wing beat, a flag, a bob.
// cycle(t, seconds, look) gives back where a repeat is now, 0 to 1.
// t: the time in seconds; seconds: how long one run takes. look (all optional): kind "loop",
// "reverse" or "mirror"; ease (an ease name, "linear"); rest (seconds held at each run's end, 0);
// from (the second the first run starts, 0). Returns 0 to 1 (0 before look.from).
// e.g. var flap = cycle(t, 0.4, {kind: "mirror", ease: "smooth"});
function cycle(t, seconds, look) {
  look = look || {};
  var kind = look.kind || "loop", rest = look.rest || 0, span = seconds + rest, gone = t - (look.from || 0);
  if (gone <= 0) { return 0; }
  var n = Math.floor(gone / span), u = Math.min(1, (gone - n * span) / seconds), back = kind !== "loop" && n % 2 === 1;
  if (kind === "reverse") { return ease(look.ease || "linear", back ? 1 - u : u); }
  var v = ease(look.ease || "linear", u);
  return back ? 1 - v : v;
}

// A value of one range read as a value of another: v at from[0] gives to[0], at
// from[1] gives to[1], held at the ends, bent by an ease between. The question
// "how much of this for that much of that" asked once instead of with arithmetic:
// a lean that grows with the speed, a lantern's glow with the dark, a blush with
// the smile. to may be two numbers, two colours, or two lists.
// span(v, from, to, name) gives back v read from one range into another.
// v: the value read; from: [low, high] of its range; to: [first, second], two numbers, colours
// "#rrggbb" or lists; name: an ease name ("linear" when left out). Returns the value in to's range,
// held at to[0] below from[0] and at to[1] above from[1]. Changes nothing outside itself.
// e.g. var bend = span(240, [0, 400], [0, 0.15]);   // the lean for a speed of 240 pixels a second
function span(v, from, to, name) {
  return mixOf(to[0], to[1], ease(name || "linear", (v - from[0]) / (from[1] - from[0])));
}

// A thing thrown or let go at second 0 from "from" with a speed (units a second):
// it slows as it goes, losing speed in proportion to what it has (the way a
// rolled ball or a drifting boat does), and stops on its own. look.seconds is
// how long the slowing takes (1: by then it has lost two thirds of its speed,
// and comes to rest at from + speed x seconds); look.min and look.max are the
// bounds it stops at, a wall or the ground. Written as a formula of the time, so
// a frame does not depend on the one before. A takraw kicked and rolling, a top
// slowing, a boat pushed off.
// glide(t, from, speed, look) gives back where a thing let go is at time t.
// t: seconds since it was let go (from is held before 0); from: where it starts, any unit; speed:
// that unit a second, any sign; look (all optional): seconds (1), min, max. Returns where it is now.
// e.g. var x = glide(t - 4, 300, 500, {seconds: 0.8, max: 1700});
function glide(t, from, speed, look) {
  look = look || {};
  var tau = look.seconds || 1, x = t <= 0 ? from : from + speed * tau * (1 - Math.exp(-t / tau));
  if (look.min !== undefined) { x = Math.max(look.min, x); }
  if (look.max !== undefined) { x = Math.min(look.max, x); }
  return x;
}

// held(t, frames) gives back the time t (seconds) held to a drawing that lasts that many frames of
// a 30-a-second film: 2 is "on twos", 3 "on threes". Pass the result as the time to a drawing.
// e.g. var tt = held(t, 2);
function held(t, frames) {               // a cartoon drawn on twos holds each drawing for two frames (of 30 a second)
  return Math.floor(t * 30 / frames) * frames / 30;
}

// ---------- a spring ----------
// A weight on a spring, let go at second 0 one unit short of its rest, read at second
// t: it goes from 0 to 1, overshoots, and settles. Written as a formula of the time
// (the physics of a damped spring), so a frame does not depend on the one before;
// the kit's follow() integrates frame by frame instead, and needs settled()'s pre-roll.
//   look.stiffness   how hard it pulls (80): higher is quicker
//   look.damping     how soon the swinging dies (10): low swings for a while, high creeps in
//   look.mass        how heavy (1): heavier is slower and swings longer
//   look.velocity    a push at the start (0), in units a second
// or, instead of stiffness and damping, in a film's words:
//   look.seconds     about how long the move takes (the swing after it may go on a little)
//   look.bounce      how bouncy, 0 to 1: 0 just stops, 0.3 a small overshoot, 1 swings for a long while;
//                    below 0 it creeps in without any swing (-1 very slowly)
// springOf(look) gives back the spring's numbers for a look.
// look: springAt's look, or nothing. Returns {k, c, m, push}: stiffness, damping, mass and the
// start push in units a second (from look.seconds and look.bounce when they are given and
// stiffness and damping are not). Changes nothing outside itself.
// e.g. springOf({seconds: 0.6, bounce: 0.3}).k
function springOf(look) {                // the spring's stiffness, damping and mass, from whichever words the look uses
  look = look || {};
  if (look.stiffness || look.damping || !look.seconds) {
    return {k: look.stiffness || 80, c: look.damping || 10, m: look.mass || 1, push: look.velocity || 0};
  }
  var bounce = look.bounce === undefined ? 0.3 : Math.max(-1, Math.min(1, look.bounce)), m = look.mass || 1;
  var z = bounce < 0 ? 1 / Math.max(1 + bounce, 0.05) : Math.max(1 - bounce, 0.05);   // how damped: 1 is just enough to stop swinging
  var w = 2 * Math.PI / (1.2 * look.seconds);                                        // the natural swing: one turn in 1.2 of the seconds
  return {k: w * w * m, c: 2 * z * w * m, m: m, push: look.velocity || 0};
}

// springAt(t, look) gives back where the spring is at second t (0 before, then toward 1, past it
// and back): a number, 1 once settled. look: the keys listed above (stiffness, damping, mass,
// velocity; or seconds and bounce); left out it is stiffness 80, damping 10.
// Changes nothing outside itself.
// e.g. var pop = springAt(t - 3, {seconds: 0.5, bounce: 0.6});  var size = 0.8 + 0.4 * pop;
function springAt(t, look) {
  var sp = springOf(look), k = sp.k, c = sp.c, m = sp.m, push = sp.push;
  if (t <= 0) { return 0; }
  var w = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m)), x;      // the natural swing, and how damped it is (1 is just enough to stop swinging)
  if (z < 1) {
    var wd = w * Math.sqrt(1 - z * z);
    x = Math.exp(-z * w * t) * (-Math.cos(wd * t) + (push - z * w) / wd * Math.sin(wd * t));
  } else if (z < 1.0001) {                                            // just that much: it creeps in without swinging
    x = (-1 + (push - w) * t) * Math.exp(-w * t);
  } else {                                                            // more: two fades, a slow one and a quick one, and no swing at all
    var r = Math.sqrt(z * z - 1), slow = w * (z - r), quick = w * (z + r), F = (push - slow) / (quick - slow);
    x = -((1 - F) * Math.exp(-slow * t) + F * Math.exp(-quick * t));
  }
  return 1 + x;
}

// springTime(look) gives back the second by which a spring has settled.
// look: springAt's look. Returns seconds, a number: how long after its start the spring's swing
// has died to a hundredth of the first. Changes nothing outside itself.
// e.g. var done = 3 + springTime({seconds: 0.5, bounce: 0.6});
function springTime(look) {              // when the swing has died to a hundredth
  var sp = springOf(look), k = sp.k, c = sp.c, m = sp.m, push = sp.push;
  var w = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
  if (z < 1) { return Math.log(100) / (z * w); }                    // the swing's envelope is e^(-zwt)
  if (z >= 1.0001) {                                                // two fades: whichever of them is the last to die to a hundredth
    var r = Math.sqrt(z * z - 1), slow = w * (z - r), quick = w * (z + r), F = (push - slow) / (quick - slow);
    return Math.max(Math.log(100 * Math.abs(1 - F)) / slow, Math.log(100 * Math.abs(F)) / quick, 0);
  }
  var t = Math.log(100) / w;                                        // creeping in, it fades as (1 + (w - push) t) e^(-wt): a few rounds find the t
  for (var n = 0; n < 4; n++) { t = Math.log(100 * (1 + Math.abs(w - push) * t)) / w; }
  return t;
}

// ---------- a crowd ----------
// How late the n-th of count things starts: look.gap seconds (0.3) between neighbours,
// spreading from the "first" (the default), the "last", the "centre", or a number, the
// index it spreads from. An ease name bends the spread: "in" bunches the near ones,
// "out" the far ones.
// stagger(n, count, look) gives back how late the n-th of a crowd starts.
// n: which one (0 is the first); count: how many in all; look (all optional): gap (seconds, 0.3),
// from ("first", "last", "centre" or "center", or an index), ease (an ease name). Returns seconds,
// a number of 0 or more, to take from that one's time. Changes nothing outside itself.
// e.g. for (var n = 0; n < 5; n++) { var u = ramp(t - stagger(n, 5, {gap: 0.2, from: "centre"}), 2, 3); }
function stagger(n, count, look) {
  look = look || {};
  var gap = look.gap === undefined ? 0.3 : look.gap, from = look.from === undefined ? "first" : look.from;
  var at = from === "first" ? 0 : from === "last" ? count - 1 : from === "centre" || from === "center" ? (count - 1) / 2 : from;
  var far = Math.abs(n - at), most = Math.max(Math.abs(at), Math.abs(count - 1 - at)) || 1;
  if (look.ease) { far = ease(look.ease, far / most) * most; }
  return far * gap;
}

// ---------- a course ----------
// A course is points in time, [[second, x, y], ...], and a point may carry a fourth
// number, its depth: 0 far from the screen, 1 near. Between its points a mover travels
// on one smooth curve through all of them, the way a 3D library leads a thing along a
// spline through its waypoints: it passes the points between without stopping, eases
// off at the start of a walk and into its end, holds still between two points at one
// place, and faces the way the curve itself goes. A film writes
//
//   var KEYS = [[3, 160, 960], [9, 620, 950], [14, 620, 950]];
//   var p = where(KEYS, t);                    // [x, y, moving, facing, depth, angle, distance, reached, speed]
//   person(p[0], p[1], cast("boy", {face: p[3], step: p[2] ? p[6] / 130 : 0, bend: span(p[8], [0, 400], [0, 0.15])}));
//
// p[6] is how far along the curve it has come, in pixels, so a walker's steps can be
// counted from the ground covered (one stride cycle per 112 x size pixels in the kit's
// walk, 130 at size 1.2) and the feet do not slide on a slow or a quick leg of the
// course; p[7] is the index of the key it has reached, for what happens on arriving;
// p[8] is its speed now in pixels a second, for a lean into a run or dust at the heels.
// The Naga or the dragon takes the course itself as its "trail":
//   dragon(p[0], p[1], {depth: p[4], trail: function (tt) { return where(KEYS, tt); }})

// spline(p0, p1, p2, p3, u) gives back the point u of the way along the curve from p1 to p2.
// p0, p1, p2, p3: points [x, y] (more numbers are ignored), in pixels of the sheet; u: 0 to 1.
// Returns [x, y, dx, dy]: dx and dy are the change over the whole step from p1 to p2 (pixels per
// whole step, not per second). Changes nothing outside itself.
// e.g. spline([0, 0], [100, 0], [200, 50], [300, 50], 0.5)
function spline(p0, p1, p2, p3, u) {
  // One step of a centripetal Catmull-Rom curve: the point u of the way (0..1) from
  // p1 to p2, bent by p0 before and p3 after, and the direction it is going: [x, y, dx, dy].
  // "Centripetal" (the root of each step's length as its weight) is what keeps the
  // curve from looping or kinking between points that are close together.
  var d0 = Math.sqrt(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]));
  var d1 = Math.sqrt(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]));
  var d2 = Math.sqrt(Math.hypot(p3[0] - p2[0], p3[1] - p2[1]));
  if (d1 < 1e-4) { d1 = 1; }
  if (d0 < 1e-4) { d0 = d1; }
  if (d2 < 1e-4) { d2 = d1; }
  var out = [0, 0, 0, 0];
  for (var k = 0; k < 2; k++) {
    var x0 = p0[k], x1 = p1[k], x2 = p2[k], x3 = p3[k];
    var t1 = ((x1 - x0) / d0 - (x2 - x0) / (d0 + d1) + (x2 - x1) / d1) * d1;   // the slope through p1
    var t2 = ((x2 - x1) / d1 - (x3 - x1) / (d1 + d2) + (x3 - x2) / d2) * d1;   // and through p2
    var c2 = -3 * x1 + 3 * x2 - 2 * t1 - t2, c3 = 2 * x1 - 2 * x2 + t1 + t2;
    out[k] = x1 + t1 * u + c2 * u * u + c3 * u * u * u;
    out[k + 2] = t1 + 2 * c2 * u + 3 * c3 * u * u;
  }
  return out;
}

// leg(keys, i) gives back the i-th step of a course and the points that bend it.
// keys: a course (see "a course" above); i: the index of a step, 0 to keys.length - 2.
// Returns {a, b, first, end, before, after}: the two keys, whether the step starts or ends a walk,
// and the made-up or real points [x, y] behind and ahead. Changes nothing outside itself.
// e.g. leg([[0, 100, 900], [4, 500, 900]], 0).first
function leg(keys, i) {
  // The i-th step of a course, from keys[i] to keys[i + 1]: the point behind and the
  // point ahead that bend its curve (made up straight behind or ahead where a walk
  // starts or ends), and whether it starts a walk or ends one.
  var last = keys.length - 1, a = keys[i], b = keys[i + 1];
  var first = i === 0 || (keys[i - 1][1] === a[1] && keys[i - 1][2] === a[2]);       // this step starts a walk: ease off
  var end = i + 1 === last || (keys[i + 2][1] === b[1] && keys[i + 2][2] === b[2]);  // this step ends one: ease into the stop
  return {a: a, b: b, first: first, end: end,
          before: first ? [2 * a[1] - b[1], 2 * a[2] - b[2]] : [keys[i - 1][1], keys[i - 1][2]],
          after: end ? [2 * b[1] - a[1], 2 * b[2] - a[2]] : [keys[i + 2][1], keys[i + 2][2]]};
}

// How long each step of a course is, measured once along its curve (SAMPLES short
// straight pieces) and kept by the course's numbers, so a frame costs no more than
// before. For each step: the length so far at each sample, 0 for a wait in place.
var SAMPLES = 24, COURSES = {}, COURSES_KEPT = 0;

// lengthsOf(keys) gives back how long each step of a course is, measured along its curve.
// keys: a course. Returns a list, one entry for each step: the length so far, in pixels of the
// sheet, at each of SAMPLES + 1 points along it ([0] for a wait in place). Fills COURSES, a cache
// by the course's numbers, and empties it when 64 courses are kept.
// e.g. var whole = lengthsOf([[0, 100, 900], [4, 500, 900]])[0][SAMPLES];   // 400, the first step's length
function lengthsOf(keys) {
  var name = keys.join(","), table = COURSES[name], i, k, l, p, q, run, sofar;
  if (table) { return table; }
  if (COURSES_KEPT >= 64) { COURSES = {}; COURSES_KEPT = 0; }        // the maker edits courses all day: keep the table small
  table = [];
  for (i = 0; i < keys.length - 1; i++) {
    l = leg(keys, i); run = [0]; sofar = 0;
    if (l.a[1] !== l.b[1] || l.a[2] !== l.b[2]) {
      q = [l.a[1], l.a[2]];
      for (k = 1; k <= SAMPLES; k++) {
        p = spline(l.before, [l.a[1], l.a[2]], [l.b[1], l.b[2]], l.after, k / SAMPLES);
        sofar += Math.hypot(p[0] - q[0], p[1] - q[1]); run.push(sofar); q = p;
      }
    }
    table.push(run);
  }
  COURSES[name] = table; COURSES_KEPT++;
  return table;
}

// where(keys, t) gives back where a thing on a course is at second t, as a list of 9 numbers:
// [x, y, moving, facing, depth, angle, distance, reached, speed] (the comment inside says each;
// p[8], the speed, is pixels of the sheet a second, 0 while it stands). keys: [[second, x, y], ...] or [[second, x, y, depth], ...], in order of the seconds,
// at least one; x and y in pixels of the sheet; t: the time in seconds. Before the first second
// it is at the first key, after the last at the last. Fills the COURSES cache (lengthsOf).
// e.g. var p = where([[3, 160, 960], [9, 620, 950]], t);  person(p[0], p[1], cast("boy", {face: p[3], step: p[2] ? p[6] / 130 : 0}));
function where(keys, t) {
  // Where something on a course is at second t, which way it goes, how near the screen
  // it is, its heading, how far along the curve it has come, and which key it has
  // reached: [x, y, moving, facing, depth, angle, distance, reached]. Depth is 0.5 for
  // a point that has none; the angle (radians, 0 is rightward) is 0 while it stands.
  var last = keys.length - 1, i = 0, facing = 1, n, a, b, da, db, l, u, p, runs, gone, at, k;
  while (i < last && t >= keys[i + 1][0]) { i++; }                 // keys[i] is the point it has reached by second t
  for (n = 1; n <= Math.min(i + 1, last); n++) {                   // which way it faces: the last step that went sideways at all
    if (keys[n][1] !== keys[n - 1][1]) { facing = keys[n][1] > keys[n - 1][1] ? 1 : -1; }
  }
  a = keys[i];
  b = keys[Math.min(i + 1, last)];
  da = typeof a[3] === "number" ? a[3] : 0.5;
  db = typeof b[3] === "number" ? b[3] : 0.5;
  runs = lengthsOf(keys); gone = 0;
  for (n = 0; n < i; n++) { gone += runs[n][runs[n].length - 1]; }  // the steps already taken, in full
  if (t < a[0] || i === last) { return [a[1], a[2], 0, facing, da, 0, gone, i, 0]; }     // not started yet, or arrived
  u = (t - a[0]) / (b[0] - a[0]);
  if (a[1] === b[1] && a[2] === b[2]) { return [a[1], a[2], 0, facing, da + (db - da) * u, 0, gone, i, 0]; }   // waiting in place (coming nearer or going away, maybe)
  l = leg(keys, i);
  var rate = 1;                                                    // how fast the eased u runs, for the speed
  if (l.first && l.end) { rate = 6 * u * (1 - u); u = u * u * (3 - 2 * u); }
  else if (l.first) { rate = u * (4 - 3 * u); u = u * u * (2 - u); }
  else if (l.end) { rate = (1 - u) * (1 + 3 * u); u = 1 - (1 - u) * (1 - u) * (1 + u); }
  p = spline(l.before, [a[1], a[2]], [b[1], b[2]], l.after, u);
  if (Math.abs(p[2]) > 1) { facing = p[2] > 0 ? 1 : -1; }           // on the curve, the curve says which way
  at = u * SAMPLES; k = Math.min(SAMPLES - 1, Math.floor(at));      // this step's length so far, read between two samples
  gone += runs[i][k] + (runs[i][k + 1] - runs[i][k]) * (at - k);
  return [p[0], p[1], 1, facing, da + (db - da) * u, Math.atan2(p[3], p[2]), gone, i,
          Math.hypot(p[2], p[3]) * rate / (b[0] - a[0])];             // p[8]: its speed now, pixels a second
}
