// mural_sabai.js - the woven sabai of sabai.js worn by a woman of the mural figure (mural_women.js), as the kit's own
// figure wears it. Load it after sabai.js and mural_women.js (and sabai_finish.js, for a finished cloth). The owner
// (2026-10-31): "Can you put the sabai on one of the new model sprites and keep it from rocking or shaking?", then "Use
// one of the new models and stop the sway if possible". Notes: docs/kit/things.md, "The sabai on a mural woman".
//
// As for the kit's figure: the cloth's back before her, then her wearing its front. Her own band is left off
// (sabai: false); she stands still (woman: sway false), so the cloth lies on her as she is; SABAI_MURAL_ARMS lays her
// near arm hanging over the cloth's lower end. A steady cloth's figures do not bob or rock.
// e.g. var look = castWoman("maiden", {sabai: false, id: "maiden"});
//      look.woman = Object.assign({}, MURAL_WOMEN.maiden.woman, {sway: false, holds: undefined, pose: SABAI_MURAL_ARMS});
//      var where = sabaiOfMural(t, 720, 1010, look), cloth = {finish: true, steady: true, cloth: SABAI_FINISH_GROUND};
//      sabai(t, where, cloth, "back"); person(720, 1010, sabaiWorn(look, t, where, cloth));

// Her near arm hanging at her side, drawn after the cloth's front so it lies over its lower end; the far arm as hers.
var SABAI_MURAL_ARMS = {near: {w: [-48, -374], elbow: [-1, 0.1], late: true}};

// Where the cloth lies on a mural woman standing at (x, y): sabai.js's sabaiOf() on her own body, not the kit figure's
// joints. Over the shoulder on the right of the picture and across her to the left: from the right side of her neck's
// foot (her neck ring) down to her belt on the left, under her near arm, tucked in at the waist (owner, 2026-10-30: "the
// sabai should extend all the way across the sprites body"; 2026-10-31: "From her belt, up to the point where the sabai
// extends to the point of her torso should all be covered by the sabai"); past her side there it is cut along her
// torso's line (MS_TORSO), so her outline keeps its curve in the cloth's colour; its back hanging behind the shoulder
// past the hip. Her points are read in her own units as mural.js draws a lady: a unit is 59 * size / 100 pixels
// (person()'s head), her upper body sheared by muUpper(-0.028, 0.07, -430). The middle line is a quadratic in 97
// points, its heading the curve's own tangent (smooth, no facets up close).
// t: seconds (the back's edge waves with it); look: hers (its size). Returns what sabaiOf() returns, for sabai(),
// sabaiWorn() and sabaiCamera().
// e.g. var where = sabaiOfMural(t, 720, 1010, look);
function sabaiOfMural(t, x, y, look) {
  var px = 59 * (look.size || 1) / 100, n, k;
  function onHer(u, v, upper) { return [x + (u + (upper ? 0.07 * v + 42.14 : -0.028 * v)) * px, y + v * px]; }
  var neck = onHer(18.3, -583, true), hip = onHer(-6, -380, false), waistY = onHer(0, -430, false)[1];
  var half = 36;                                     // half the band's width
  var end = onHer(-58, -404, true);                  // the middle of its lower end: under the belt, left of her middle
  var mid = onHer(-6, -490, true);                   // the curve's pull, a little to her front
  var slope = Math.atan2(neck[1] - mid[1], neck[0] - mid[0]);   // its heading at the top: up to her neck
  var top = [neck[0] - Math.sin(slope) * half, neck[1] + Math.cos(slope) * half];   // the middle of its upper end: its upper corner beside the neck
  var start = 0;                                     // cut square at its lower end, under the belt (the tuck and her torso's line hide it)
  var points = [], marks = [0], length = 0;
  for (n = 0; n <= 96; n++) {
    var s = n / 96, v = 1 - s;
    points.push([v * v * end[0] + 2 * v * s * mid[0] + s * s * top[0], v * v * end[1] + 2 * v * s * mid[1] + s * s * top[1]]);
    if (n) { length += Math.hypot(points[n][0] - points[n - 1][0], points[n][1] - points[n - 1][1]); marks.push(length); }
  }
  function seek(along) {                             // which piece a distance along falls in, and how far through it
    along = Math.max(0, Math.min(length, along));
    var lo = 0, hi = marks.length - 1;
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (marks[m] <= along) { lo = m; } else { hi = m; } }
    return [lo, (along - marks[lo]) / (marks[hi] - marks[lo] || 1)];
  }
  function pointAt(along) {
    var w = seek(along), p = points[w[0]], q = points[w[0] + 1] || p;
    return [p[0] + (q[0] - p[0]) * w[1], p[1] + (q[1] - p[1]) * w[1]];
  }
  function headingAt(along) {                        // the curve's tangent a distance along
    var w = seek(along), s = (w[0] + w[1]) / 96, v = 1 - s;
    return Math.atan2(v * (mid[1] - end[1]) + s * (top[1] - mid[1]), v * (mid[0] - end[0]) + s * (top[0] - mid[0]));
  }
  function side(along, across) {                     // a point "across" from the middle line, as sabaiAt() has it
    var q = pointAt(along), g = headingAt(along);
    return [q[0] - Math.sin(g) * across, q[1] + Math.cos(g) * across];
  }
  var upper = side(start, -half), lower = side(start, half);
  var vx = lower[0] - upper[0], vy = lower[1] - upper[1], vl = Math.hypot(vx, vy) || 1, g = headingAt(start);
  var startCap = {N: [(upper[0] + lower[0]) / 2, (upper[1] + lower[1]) / 2], c: Math.cos(g), s: Math.sin(g), kx: -vy / vl, ky: vx / vl};
  // the back, from the top end's corner at the shoulder down past the hip: its outer edge leaning out 32 by the foot and
  // waving 5 either way, its hem curving to the inner edge
  var corner = side(length, half), foot = hip[1] + 54, outer = [], hem = [];
  for (k = 0; k <= 16; k++) {
    outer.push([corner[0] + 32 * k / 16 + Math.sin(k / 16 * Math.PI * 2.5 + t * 0.8) * 5, corner[1] + (foot - corner[1]) * k / 16]);
  }
  var innerX = hip[0] + 24, last = outer[16];
  for (k = 0; k <= 8; k++) { hem.push([last[0] + (innerX - last[0]) * k / 8, foot + Math.sin(k / 8 * Math.PI) * 10 - k]); }
  return {at: function (u) { return pointAt(u * length); }, angle: function (u) { return headingAt(u * length); },
          uAt: function (along) { return Math.max(0, Math.min(1, along / length)); }, length: length, start: start,
          fold: length, top: length, squeeze: function () { return 1; }, middle: pointAt(0.4 * length), tilt: headingAt(0.4 * length),
          startCap: startCap, endCap: {bulge: 26}, tuck: waistY + 8, tail: {outer: outer, hem: hem, inner: [innerX, corner[1] + 16]}};
}

// Her torso's line on the left, as mural.js draws her blouse (her upper units): from her neck ring's left edge round her
// side down to the belt, then straight down. The cloth's front is cut along it (owner, 2026-10-31: "recut the woman's
// torso line as before so it has the same curve as before but it's just the sabai color"): it keeps to the right of it.
var MS_TORSO = "M -13.13 -586 C -30 -582 -50 -578 -60 -562 C -68 -548 -66 -520 -60 -498 C -54 -476 -42 -458 -40 -436 " +
               "L -40 -300 L 2000 -300 L 2000 -2000 L -13.13 -2000 Z";

// A mural woman wearing the cloth (sabaiWorn()'s "worn"): its front is drawn after her body and her necklace (owner,
// 2026-10-31: "It should probably go over the necklace"), before an arm drawn late (so her hanging near arm lies over
// it) and the belt (which holds it at the waist). mural.js draws the belt and then the necklace (muCollar3q), so the
// belt (with the late arm, mural_women.js draws it there) waits until the cloth is on. The chains of rank (neck
// "sangwan") are worn over the cloth: below the choker they are drawn again after it. For one with neither, after her.
// It is cut along her torso's line (MS_TORSO).
var MURAL_SABAI_KIT = {muralPerson: muralPerson, muBelt: muBelt, muCollar3q: muCollar3q}, MS_WORN = null;
muralPerson = function (x, y, look, opts) {
  if (!look.worn || !look.woman) { return MURAL_SABAI_KIT.muralPerson(x, y, look, opts); }
  var keep = MS_WORN;
  MS_WORN = {worn: look.worn, frame: pen.getTransform(), x: x, y: y, px: (opts.head || 70) / 100, done: false, belt: null};
  try {
    MURAL_SABAI_KIT.muralPerson(x, y, look, opts);
    msWear();
    msBelt();
  } finally { MS_WORN = keep; }
};
function msWear() {                                  // the cloth's front, once
  var wear = MS_WORN;
  if (wear.done) { return; }
  wear.done = true;
  pen.save();
  try {
    pen.setTransform(wear.frame); pen.translate(wear.x, wear.y); pen.scale(wear.px, wear.px); muUpper(-0.028, 0.07, -430);
    pen.clip(new Path2D(MS_TORSO));                  // in her upper units, as mural.js draws her blouse
    wear.worn();
  } finally { pen.restore(); }
}
function msBelt() {                                  // the belt that waited for the cloth, where it was to be drawn
  var belt = MS_WORN.belt;
  if (!belt) { return; }
  MS_WORN.belt = null;
  pen.save();
  try { pen.setTransform(belt.at); MURAL_SABAI_KIT.muBelt.apply(null, belt.args); } finally { pen.restore(); }
}
muBelt = function (y, x0, x1, buckleX) {
  if (MS_WORN && !MS_WORN.done) { MS_WORN.belt = {at: pen.getTransform(), args: [y, x0, x1, buckleX]}; return; }
  return MURAL_SABAI_KIT.muBelt(y, x0, x1, buckleX);
};
muCollar3q = function (c, y0, r, wide, drop) {
  if (!MS_WORN || MS_WORN.done) { return MURAL_SABAI_KIT.muCollar3q(c, y0, r, wide, drop); }
  MURAL_SABAI_KIT.muCollar3q(c, y0, r, wide, drop);  // the necklace
  msWear();                                          // the cloth over it
  if (WM && WM.neck === "sangwan") {                 // the chains of rank over the cloth, below the choker
    pen.save(); pen.beginPath(); pen.rect(-1000, y0 + 18, 2000, 2000); pen.clip();
    try { MURAL_SABAI_KIT.muCollar3q(c, y0, r, wide, drop); } finally { pen.restore(); }
  }
  msBelt();
};
