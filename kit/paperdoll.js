// paperdoll.js - paperdolls on top of oldcartoon.js: one character each, made
// without changing the kit.
//
// A paperdoll is a cast member (CAST.x), the clothes the kit does not draw,
// and the cloth that moves on its own, in a file of its own (fonlep.js,
// apsara.js). This file is what those files share. Load it after
// oldcartoon.js and before the dolls' own files; a doll's file then says
//   function fonlep(x, y, more) { paperdoll(FONLEP_DOLL, x, y, more); }
// and a scene draws her as it draws anyone, with the same keys for changes.
//
// The kit's arm(), follow() and ladyFace() are wrapped here, not changed:
// person() calls them at known moments, so a doll's style can draw between
// the kit's layers and learn where her joints are on the sheet. A style is
// an object with a name (its CAST entry) and any of these:
//   costume(doll, farX, farY)   in the waist's frame, after the body and the
//                               head, before either arm (at the far arm's
//                               call: the near shoulder is put where it was,
//                               measured from the far one, in the frame before)
//   onArm(doll, side, ex, ey, wx, wy)   after an arm is drawn and before its
//                               hand, in the waist's frame, with its elbow and
//                               wrist; "A" is the near arm, "B" the far one
//   ornament(doll)              in the head's frame, before the head and the
//                               hair are drawn (what is behind them); the kit
//                               only asks for it when the look has pins: true
//   onFace(doll, V)             in the head's frame, after the face: what sits
//                               on the head, over the hair (a crown)
//   behind(doll, s, line)       on the sheet, before person(): what hangs
//                               behind her, drawn from the last frame's joints
//   advance(doll, dt, s)        after person(): move the chains to this
//                               frame's joints
//   arms: "skin"                bare arms
//   keys: ["stage"]             the doll's own keys in "more": kept from the
//                               kit's look (which warns about a name it does
//                               not know) and given to the style as doll.own
// "s" is the figure's scale on the sheet (its size times 0.82), so widths in
// the kit's units are multiplied by it; "line" is the kit's pen for this
// figure on the sheet (FINE and the scale already in it). A doll keeps, from
// frame to frame: rootA/rootB (the shoulders), wristA/B, elbowA/B, on the
// sheet; rootAlocal/rootBlocal in the waist's frame; and its chains.
//
// The cloth is a chain, as procedural_animation.html makes its snake: each
// point stays one gap from the point before it (walk), and may not bend more
// than "bend" from the joint before it (limit), so it never folds in half.
// The first point is wherever the cloth leaves her; the rest trail behind
// it, keep most of their speed from the frame before, and sink. When she is
// still the cloth hangs; when she moves it flows, and settles after her.

var DOLLS = {}, DOLLS_DRAWN = 0, DOLLS_AT = -1;      // each paperdoll's chains and joints, by id
var DOLL = null;                                    // the paperdoll person() is drawing, while it draws her
FORGET.push(function () { DOLLS = {}; DOLLS_DRAWN = 0; DOLLS_AT = -1; });   // a render's jump: the chains start at rest (the kit's forget())
var KIT = {arm: arm, follow: follow, ladyFace: ladyFace, manFace: manFace};   // the kit's own functions, kept to call

// Draw a doll: what hangs behind her first, then the kit's person() with the
// wrappers listening, then the chains are moved to where her joints are now.
// Without an id, the n-th paperdoll drawn in a frame is the same one in the
// next, as the kit takes its people.
function paperdoll(style, x, y, more) {
  var own = {}, rest = {};                           // the doll's own keys are kept from the kit, which would not know them
  Object.keys(more || {}).forEach(function (key) { ((style.keys || []).indexOf(key) < 0 ? rest : own)[key] = more[key]; });
  var look = cast(style.name, rest);
  if (clock !== DOLLS_AT) { DOLLS_DRAWN = 0; DOLLS_AT = clock; }
  look.id = look.id || style.name + (DOLLS_DRAWN++);
  var doll = DOLLS[look.id] || (DOLLS[look.id] = {id: look.id, chains: {}});
  doll.style = style;
  doll.look = look;
  doll.own = own;
  doll.x = x;
  doll.y = y;
  // Her chains are drawn where they were last moved, on the sheet: not when she was last drawn at another scale,
  // where those points belong to another picture (a woven doll's full-size measuring, then her tile: a red end of the
  // pu man's cloth left loose by his feet, 2026-10-21). Their points go; chainOf() makes the chains again.
  var called = scaleNow();
  if (!doll.called || Math.abs(Math.log(called / doll.called)) > 0.2) {
    Object.keys(doll.chains).forEach(function (name) { doll.chains[name].points = null; });
  }
  doll.called = called;
  if (doll.scale && style.behind) {
    pen.save();
    pen.setTransform(1, 0, 0, 1, 0, 0);
    style.behind(doll, doll.scale, lineOf(doll));
    pen.restore();
  }
  DOLL = doll;
  var joints = person(x, y, look);
  DOLL = null;
  if (joints) {                                     // person() gives its joints back, on the film: exact, so they win
    doll.joints = joints;
    ["rootA", "rootB", "wristA", "wristB", "elbowA", "elbowB", "bun"].forEach(function (name) {
      var at = xy(joints[name === "rootA" ? "shoulderA" : name === "rootB" ? "shoulderB" : name]);
      if (at) { doll[name] = at; }
    });
  }
  var dt = doll.t === undefined ? 0 : clock - doll.t;
  doll.t = clock;
  if (doll.scale && style.advance) { style.advance(doll, dt, doll.scale); }
}

// Where a doll's chains stop falling: "below" under her feet in the frame she was drawn in, on the sheet, as the
// chains' points are. doll.y alone is the sheet's only when nothing is scaled or moved: a doll woven into the sabai
// is drawn at (0, 0) in a small tile, and a floor of 0 there pinned every point of its chains to the tile's top
// edge (the pu man's red cloth, up from his hip in the hero film's cloth, 2026-10-21). Asked while the chains are
// moved, at the end of paperdoll(), when the pen is in the caller's frame again.
function floorOf(doll, below) {
  return onScreen(doll.x, doll.y + (below || 0))[1];
}

// a point as [x, y], whichever way it was given
// p: [x, y], or {x, y} (as person()'s joints are), or nothing. Returns a new [x, y], or null when p is
// missing or neither shape.
// e.g. var hip = xy(doll.joints.hip);
function xy(p) {
  if (!p) { return null; }
  if (p.length === 2) { return [p[0], p[1]]; }
  return p.x !== undefined ? [p.x, p.y] : null;
}

// the kit's pen for this figure, on the sheet
// doll: a doll that has been drawn once (doll.scale is set by the arm wrapper, below; before that the
// answer is NaN). Returns the pen's width in pixels of the sheet: STYLE.line, thinner for a larger
// figure as person() makes FINE, times the doll's scale.
// e.g. scarfEnd(doll.chains.scarf.points, doll.scale, lineOf(doll), FONLEP_CLOTH);
function lineOf(doll) {
  return STYLE.line * Math.min(1, Math.pow((doll.look.size || 1) / 1.3, -0.7)) * doll.scale;
}

// Where a point of the pen's frame now is on the sheet. lx, ly: pixels in the pen's current frame (the
// waist's or the head's, inside a style). Returns [x, y], pixels of the sheet.
// e.g. doll.tailLead = onScreen(26, 8);
function onScreen(lx, ly) {
  var p = pen.getTransform().transformPoint(new DOMPoint(lx, ly));
  return [p.x, p.y];
}

// How large the pen's current frame draws: how many pixels of the sheet one pixel of the frame is (the
// square root of the frame's area scale, so a turn or a lean does not change it). Takes nothing.
// e.g. doll.scale = scaleNow();
function scaleNow() {
  var m = pen.getTransform();
  return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
}

// ---------- the wrappers ----------

// The far arm is drawn first, so the clothes on her body go on before either
// arm; each arm is then handed to the style with its joints.
// The kit's arm() with the same arguments and the same answer ([wristX, wristY, elbowX, elbowY] in
// the pen's frame); person() calls it, a page does not. When the arm is a doll's ("key" is her id plus
// "/armA" or "/armB"), it paints a bare arm in SKIN for arms: "skin", and sets on the doll: scale,
// rootA/rootB and wristA/B, elbowA/B (pixels of the sheet), rootAlocal/rootBlocal (the waist's
// frame); it calls the style's costume() before the far arm and onArm() after each.
// e.g. arm(root[0], root[1], hand, outward, sleeve, doll.id + "/armA")   (as person() calls it)
arm = function (shoulderX, shoulderY, hand, outward, colour, key) {
  var doll = DOLL, side = doll && (key === doll.id + "/armA" ? "A" : key === doll.id + "/armB" ? "B" : null);
  if (side === "B") {
    doll.scale = scaleNow();
    doll.rootB = onScreen(shoulderX, shoulderY);
    if (doll.style.costume) { doll.style.costume(doll, shoulderX, shoulderY); }
  }
  var paint = side && doll.style.arms === "skin" ? SKIN : colour;
  var drawn = KIT.arm(shoulderX, shoulderY, hand, outward, paint, key);
  if (side) {
    if (side === "A") {
      doll.rootA = onScreen(shoulderX, shoulderY);
      doll.rootAlocal = [shoulderX, shoulderY];
    } else {
      doll.rootBlocal = [shoulderX, shoulderY];
    }
    doll["wrist" + side] = onScreen(drawn[0], drawn[1]);
    doll["elbow" + side] = onScreen(drawn[2], drawn[3]);
    if (doll.style.onArm) { doll.style.onArm(doll, side, drawn[2], drawn[3], drawn[0], drawn[1]); }
  }
  return drawn;
};

// The kit asks follow() where the pin strands hang from, in the head's own
// frame, before it draws the head and the hair: an ornament goes there.
// The kit's follow() with the same arguments and the same answer (the lag, [dx, dy] in the head's
// frame); for a doll's "/pins" key it then calls the style's ornament(doll). Called by person(), not
// by a page.
// e.g. follow(doll.id + "/pins", -36, -340, 120, 7, 10)   (as person() calls it)
follow = function (key, lx, ly, stiff, damp, most) {
  var out = KIT.follow(key, lx, ly, stiff, damp, most);
  if (DOLL && key === DOLL.id + "/pins" && DOLL.style.ornament) { DOLL.style.ornament(DOLL); }
  return out;
};

// After the face, still in the head's frame: what sits on the head. Every
// argument is passed on, however many the kit's face takes.
// The kit's ladyFace(), then the style's onFace(doll, V) while a doll is drawn. Returns nothing.
// Called by person(), not by a page.
// e.g. ladyFace(shut, mouth, glance, V, feel)   (as person() calls it)
ladyFace = function (shut, mouth, glance, V, feel) {
  KIT.ladyFace.apply(null, arguments);
  if (DOLL && DOLL.style.onFace) { DOLL.style.onFace(DOLL, V); }
};

// The same for a man's face (the pu man's knot is drawn here): the kit's manFace(), then onFace().
// e.g. manFace(shut, mouth, glance, V, feel)   (as person() calls it)
manFace = function (shut, mouth, glance, V, feel) {
  KIT.manFace.apply(null, arguments);
  if (DOLL && DOLL.style.onFace) { DOLL.style.onFace(DOLL, V); }
};

// the near shoulder in the waist's frame, as costume() needs it: where it
// was, measured from the far one, in the frame before
// doll: the doll; farX, farY: the far shoulder, in the waist's frame (costume()'s own arguments).
// Returns [x, y] in the waist's frame; in her first frame, before both shoulders are known, 80 to the
// right of the far one.
// e.g. var near = nearShoulder(doll, farX, farY);
function nearShoulder(doll, farX, farY) {
  if (doll.rootAlocal && doll.rootBlocal) {
    return [farX + doll.rootAlocal[0] - doll.rootBlocal[0], farY + doll.rootAlocal[1] - doll.rootBlocal[1]];
  }
  return [farX + 80, farY];
}

// ---------- the chain, from the procedural animation page ----------

// how far apart two points [x, y] are, in their own pixels
// e.g. var far = dist(doll.rootB, doll.leave);
function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

// the direction from one point [x, y] to another, in radians (0 to the right, PI / 2 straight down)
// e.g. var a = angleTo(wrist, elbow);
function angleTo(start, end) { return Math.atan2(end[1] - start[1], end[0] - start[0]); }

// the point "far" pixels from "start" [x, y] in the direction "angle" (radians): a new [x, y]
// e.g. var leave = walk(wrist, angleTo(wrist, elbow), 30 * doll.scale);
function walk(start, angle, far) { return [start[0] + Math.cos(angle) * far, start[1] + Math.sin(angle) * far]; }

// an angle kept within "most" of "middle", the short way round
// All three in radians. Returns "angle" when it is near enough, else middle + most or middle - most.
// e.g. a = limit(a, chain.angles[n - 1], Math.PI / 7);
function limit(angle, middle, most) {
  var full = 2 * Math.PI;
  var away = ((angle - middle + Math.PI) % full + full) % full - Math.PI;
  return away > most ? middle + most : away < -most ? middle - most : angle;
}

function chainOf(doll, name, count, gap, bend, sink, keep) {
  var chain = doll.chains[name];
  // A chain made at another scale is made again: the gap between its points is in the sheet's pixels. A doll woven
  // into the sabai is drawn once at full size to be measured (sabaiTile) and then small in its tile, and kept the
  // full-size chain there, five times too long for her (2026-10-21). The film's slow push-in (6% at the most) keeps it.
  if (!chain || Math.abs(Math.log(gap / chain.gap)) > 0.2) {
    chain = doll.chains[name] = {count: count, gap: gap, bend: bend, sink: sink, keep: keep, points: null};
  }
  return chain;
}

// One frame of a chain whose first point is "lead". Every other point keeps
// "keep" of its speed, sinks "sink" pixels a second, and is then put back one
// gap behind the point before it, bent no more than "bend" from that one's
// direction. A cut, or the clock gone back, hangs it again from the lead.
//   chain   what chainOf() gives back (its count, gap and sink in pixels of the sheet, bend in radians,
//           keep 0 to 1)
//   lead    [x, y], pixels of the sheet: where the first point is this frame
//   dt      seconds since the last frame (paperdoll() hands it to advance()); 0, below 0 or over a
//           quarter of a second hangs the chain straight down from the lead
//   floor   y on the sheet no point goes below: floorOf(doll), or floorOf(doll, 2)
// Returns nothing. It moves chain.points (and fills chain.points, chain.was and chain.angles the
// first time), so the style's behind() draws them the next frame.
// e.g. chainStep(chainOf(doll, "scarf", 17, 14 * s, Math.PI / 7, 220 * s, 0.9), doll.leave, dt, floorOf(doll, 2));
function chainStep(chain, lead, dt, floor) {
  var P = chain.points, n;
  if (!P || dt <= 0 || dt > 0.25) {
    P = chain.points = [];
    chain.was = [];
    chain.angles = [];
    for (n = 0; n < chain.count; n++) {           // hung straight down, and no lower than the floor (until 2026-10-21 a long
      var hang = Math.min(floor, lead[1] + n * chain.gap);   // scarf went through the ground on its first frame)
      P.push([lead[0], hang]);
      chain.was.push([lead[0], hang]);
      chain.angles.push(Math.PI / 2);
    }
    return;
  }
  P[0] = [lead[0], lead[1]];
  for (n = 1; n < P.length; n++) {
    var p = P[n], w = chain.was[n];
    var wish = [p[0] + (p[0] - w[0]) * chain.keep, p[1] + (p[1] - w[1]) * chain.keep + chain.sink * dt];
    w[0] = p[0];
    w[1] = p[1];
    var a = angleTo(P[n - 1], wish);
    if (n > 1) { a = limit(a, chain.angles[n - 1], chain.bend); }
    chain.angles[n] = a;
    P[n] = walk(P[n - 1], a, chain.gap);
    if (P[n][1] > floor) { P[n][1] = floor; }
  }
  chain.angles[0] = chain.angles[1];
}

// the direction of the cloth at each point: between the gap before and the gap after
// P: two or more points [x, y]. Returns a list of angles in radians, one for each point.
// e.g. var A = headings(chain.points);
function headings(P) {
  var A = [], n;
  for (n = 0; n < P.length; n++) {
    var before = n > 0 ? angleTo(P[n - 1], P[n]) : angleTo(P[0], P[1]);
    var after = n < P.length - 1 ? angleTo(P[n], P[n + 1]) : before;
    A.push(Math.atan2(Math.sin(before) + Math.sin(after), Math.cos(before) + Math.cos(after)));
  }
  return A;
}

// a path through points, bending between them, in the current pen path
// points: two or more [x, y]; closeTo: [x, y] to end the path with a straight line to, or nothing.
// Returns nothing and draws nothing: it adds to the pen's path (moveTo first), for the caller to fill
// or stroke. Call pen.beginPath() before it.
// e.g. pen.beginPath(); through(strand.points); pen.stroke();
function through(points, closeTo) {
  var n;
  pen.moveTo(points[0][0], points[0][1]);
  for (n = 1; n < points.length - 1; n++) {
    pen.quadraticCurveTo(points[n][0], points[n][1], (points[n][0] + points[n + 1][0]) / 2, (points[n][1] + points[n + 1][1]) / 2);
  }
  var last = points[points.length - 1];
  pen.lineTo(last[0], last[1]);
  if (closeTo) { pen.lineTo(closeTo[0], closeTo[1]); }
}

// ---------- cloth, drawn ----------

// A strip of cloth along a chain: "wide" is its half-width at each point.
// Painted in the order the thangka sources give: the flat colour, then the
// shade (a flat darker band on the inside of each bend, with a crease line),
// then the gold work, then the dark line round the whole.
//   decorate(left, right, P, A)   draws the pattern and the gold, given both edges
//   P                    the strip's middle line: two or more [x, y], pixels of the pen's frame
//   wide                 its half-width at each point, one number for each, in the same pixels
//   colour, fold, crease the cloth, its shade and its crease lines (CSS colours)
//   line                 the pen's width for the outline (lineOf(doll)); the crease is 0.8 of it
//   decorate             as above, or nothing; drawn clipped to the cloth
// Returns nothing: it draws with pen, and leaves its fill, stroke, width, cap and join as it set them.
// e.g. clothStrip(P, wide, FONLEP.scarf, FONLEP.fold, FONLEP.crease, line);
function clothStrip(P, wide, colour, fold, crease, line, decorate) {
  var A = headings(P), left = [], right = [], n;
  for (n = 0; n < P.length; n++) {
    left.push(walk(P[n], A[n] - Math.PI / 2, wide[n]));
    right.push(walk(P[n], A[n] + Math.PI / 2, wide[n]));
  }
  pen.beginPath();
  through(left);
  through(right.slice().reverse(), left[0]);
  pen.closePath();
  pen.fillStyle = colour;
  pen.fill();
  pen.save();
  pen.clip();                                       // the shade and the gold stay inside the cloth
  for (n = 1; n < P.length - 1; n++) {              // the inside of each bend is in shadow
    var turn = ((A[n + 1] - A[n - 1] + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    if (Math.abs(turn) < 0.12 || wide[n] < 4) { continue; }
    var inner = turn > 0 ? right : left, side = turn > 0 ? 1 : -1;
    var deep = Math.min(1, Math.abs(turn) / 0.5) * 0.55;
    pen.fillStyle = fold;
    pen.beginPath();
    pen.moveTo(inner[n - 1][0], inner[n - 1][1]);
    pen.lineTo(inner[n][0], inner[n][1]);
    pen.lineTo(inner[n + 1][0], inner[n + 1][1]);
    var in1 = walk(P[n + 1], A[n + 1] + side * Math.PI / 2, wide[n + 1] * (1 - deep));
    var in0 = walk(P[n], A[n] + side * Math.PI / 2, wide[n] * (1 - deep * 1.3));
    var inM = walk(P[n - 1], A[n - 1] + side * Math.PI / 2, wide[n - 1] * (1 - deep));
    pen.lineTo(in1[0], in1[1]);
    pen.lineTo(in0[0], in0[1]);
    pen.lineTo(inM[0], inM[1]);
    pen.closePath();
    pen.fill();
    if (Math.abs(turn) > 0.25) {                    // a crease, sharp, from the inner edge toward the middle
      pen.strokeStyle = crease;
      pen.lineWidth = line * 0.8;
      pen.lineCap = "round";
      pen.beginPath();
      pen.moveTo(inner[n][0], inner[n][1]);
      var to = walk(P[n], A[n] + side * Math.PI / 2, -wide[n] * 0.25);
      pen.quadraticCurveTo(in0[0], in0[1] - line, to[0], to[1]);
      pen.stroke();
    }
  }
  if (decorate) { decorate(left, right, P, A); }
  pen.restore();
  var ink = inkFor(colour);
  pen.strokeStyle = ink;
  pen.lineWidth = line;
  pen.lineJoin = "round";
  pen.beginPath();
  through(left);
  through(right.slice().reverse(), left[0]);
  pen.closePath();
  heavy(ink);
  pen.stroke();
  light();
}

// a flat darker band along one edge of a strip: the side away from the light
// edge: the strip's left or right edge, as decorate() is given them; P, A, wide: its middle line, its
// headings and its half-widths; from, to: the points it runs between (to not included); colour: the
// shade; side: 1 to lay the band inward from a left edge, -1 from a right one. The band is 0.3 of the
// half-width deep. Returns nothing: it fills with pen. Used inside a decorate(), where it is clipped.
// e.g. shadeEdge(left, Q, A, wide, 1, count - 2, cloth.fold, 1);
function shadeEdge(edge, P, A, wide, from, to, colour, side) {
  pen.fillStyle = colour;
  pen.beginPath();
  through(edge.slice(from, to));
  through(edge.slice(from, to).map(function (p, i) { return walk(p, A[from + i] + side * Math.PI / 2, wide[from + i] * 0.3); }).reverse(), edge[from]);
  pen.closePath();
  pen.fill();
}

// The hanging end of a scarf, from a chain. "cloth" says what it is made of:
//   colour, fold, crease    the cloth, its shade and its crease lines
//   wide                    its half-width, in the kit's units (gathered where it leaves the arm)
//   pleats                  true for folds down its length from the gather
//   tip                     "flame": narrowing to a point that curls outward; "fringe": cut straight, with threads
//   pattern(left, right, Q, A, wide, s, line, panelAt)   its own pattern, drawn inside the cloth
//   panel                   {colour, dark} for a panel of another cloth over the last six points, or nothing
// P: a chain's points (chain.points, at least four; six with a panel), pixels of the sheet; s: the doll's scale
// (doll.scale); line: lineOf(doll). The cloth ripples with the clock. Returns nothing: it draws with
// pen, on the sheet (call it with the pen's frame set to the sheet, as behind() is).
// e.g. scarfEnd(doll.chains.scarf.points, s, line, FONLEP_CLOTH);
function scarfEnd(P, s, line, cloth) {
  var n, count = P.length;
  var full = cloth.wide || 23, panelAt = cloth.panel ? count - 6 : count;
  var wide = [];
  for (n = 0; n < count; n++) {
    var w = n === 0 ? 9 : n === 1 ? 15 : n === 2 ? 20 : n < panelAt ? full : full + 4;
    if (cloth.tip === "flame" && n >= count - 3) { w = [full * 0.85, full * 0.4, 0][n - (count - 3)]; }
    wide.push(w * s);
  }
  var drawn = [];                                                 // a ripple down the cloth, in the air
  for (n = 0; n < count; n++) {
    var ripple = 4 * s * Math.sin(clock * 3 - n * 0.7) * Math.min(1, n / 4);
    drawn.push([P[n][0] + ripple, P[n][1]]);
  }
  if (cloth.tip === "flame") {                                    // the point curls outward
    var tipTurn = drawn[count - 1][0] > drawn[count - 4][0] ? 1 : -1;
    drawn[count - 1] = walk(drawn[count - 1], angleTo(drawn[count - 2], drawn[count - 1]) + tipTurn * 0.9, 6 * s);
  }
  clothStrip(drawn, wide, cloth.colour, cloth.fold, cloth.crease, line, function (left, right, Q, A) {
    var k, pleat;
    shadeEdge(left, Q, A, wide, 1, count - 2, cloth.fold, 1);
    if (cloth.pleats) {                                           // pleats: folds down the length, from the gather
      pen.strokeStyle = cloth.crease;
      pen.lineWidth = line * 0.7;
      pen.lineCap = "round";
      pen.beginPath();
      for (k = -1; k <= 1; k++) {
        pleat = [];
        for (n = 1; n <= Math.min(panelAt, count - 2); n++) {
          var across = wide[n] * (k * 0.42 + 0.12) * Math.min(1, (n - 0.5) / 3);
          pleat.push(walk(Q[n], A[n] + Math.PI / 2, across));
        }
        through(pleat);
      }
      pen.stroke();
    }
    if (cloth.panel) {                                            // a panel of another cloth over the end
      pen.beginPath();
      through(left.slice(panelAt));
      through(right.slice(panelAt).reverse(), left[panelAt]);
      pen.closePath();
      pen.fillStyle = cloth.panel.colour;
      pen.fill();
      shadeEdge(left, Q, A, wide, panelAt, count - 2, cloth.panel.dark, 1);
    }
    if (cloth.pattern) { cloth.pattern(left, right, Q, A, wide, s, line, panelAt); }
  });
  if (cloth.tip === "fringe") {                                   // threads past the cut end
    var A2 = headings(drawn), end = drawn[count - 1], a = A2[count - 1];
    pen.strokeStyle = inkFor(cloth.colour);
    pen.lineWidth = Math.max(1, line * 0.6);
    pen.lineCap = "round";
    pen.beginPath();
    for (k = -3; k <= 3; k++) {
      var root = walk(end, a + Math.PI / 2, k * wide[count - 1] * 0.3);
      var thread = walk(root, a + 0.12 * k, (7 + 2 * ((k + 7) % 3)) * s);
      pen.moveTo(root[0], root[1]);
      pen.lineTo(thread[0], thread[1]);
    }
    pen.stroke();
  }
}

// A drape: a length of cloth between two points she holds it at, as a
// strip. "long" is the cloth's length, in the kit's units; when the two
// points part it pulls straight. "arch" is how its slack hangs: 1 sags down,
// as cloth left alone does; -1 rises in a loop, as the paintings draw cloth
// thrown over a raised arm; between, between.
// from, to: [x, y], pixels of the sheet; s: the doll's scale; line: lineOf(doll); cloth: as scarfEnd()
// takes it (only colour, fold and crease are read); arch: 1 when left out. Returns nothing: it draws
// with pen, through clothStrip().
// e.g. drape(doll.rootB, doll.leave, 300, s, line, FONLEP_CLOTH, -0.5);
function drape(from, to, long, s, line, cloth, arch) {
  var far = dist(from, to);
  var slack = Math.max(0, long * s - far);
  var lift = (arch === undefined ? 1 : arch) * slack * 0.75;
  var mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + lift];
  var P = [], wide = [], n;
  for (n = 0; n <= 9; n++) {
    var u = n / 9;
    P.push([(1 - u) * (1 - u) * from[0] + 2 * (1 - u) * u * mid[0] + u * u * to[0],
            (1 - u) * (1 - u) * from[1] + 2 * (1 - u) * u * mid[1] + u * u * to[1]]);
    wide.push((13 + 13 * Math.sin(u * Math.PI) - 4 * u) * s);     // narrow at both ends, full between
  }
  clothStrip(P, wide, cloth.colour, cloth.fold, cloth.crease, line);
}

// A strand of beads from a chain: a thread with a bead at every point and
// between, and a tassel at the end.
// P: a chain's points (two or more), pixels of the sheet; s: the doll's scale; line: lineOf(doll);
// gold: the beads; dark: the thread and the tassel. Returns nothing: it draws with pen.
// e.g. beads(doll.chains.bead0.points, s, line, FONLEP.gold, FONLEP.goldDark);
function beads(P, s, line, gold, dark) {
  var n;
  pen.strokeStyle = dark;
  pen.lineWidth = Math.max(1, 0.5 * line);
  pen.lineCap = "round";
  pen.beginPath();
  through(P);
  pen.stroke();
  pen.fillStyle = gold;
  pen.beginPath();
  for (n = 0; n < P.length; n++) {
    pen.moveTo(P[n][0] + 1.9 * s, P[n][1]);
    pen.arc(P[n][0], P[n][1], 1.9 * s, 0, 7);
    if (n < P.length - 1) {
      var mx = (P[n][0] + P[n + 1][0]) / 2, my = (P[n][1] + P[n + 1][1]) / 2;
      pen.moveTo(mx + 1.4 * s, my);
      pen.arc(mx, my, 1.4 * s, 0, 7);
    }
  }
  pen.fill();
  var end = P[P.length - 1], a = angleTo(P[P.length - 2], end);  // the tassel hangs on from the last bead
  var tip = walk(end, a, 9 * s), l = walk(walk(end, a, 4 * s), a - Math.PI / 2, 3 * s), r = walk(walk(end, a, 4 * s), a + Math.PI / 2, 3 * s);
  pen.beginPath();
  pen.moveTo(end[0], end[1]);
  pen.quadraticCurveTo(l[0], l[1], tip[0], tip[1]);
  pen.quadraticCurveTo(r[0], r[1], end[0], end[1]);
  pen.closePath();
  pen.fillStyle = dark;
  pen.fill();
}

// the point where a cloth leaves a forearm, "up" units above the wrist
// doll: a doll drawn at least once; side: "A" (the near arm) or "B" (the far one); up: the kit's
// units, toward the elbow. Returns [x, y], pixels of the sheet, or null before the arm is known.
// e.g. doll.leave = leaveOf(doll, "A", 30);
function leaveOf(doll, side, up) {
  var wrist = doll["wrist" + side], elbow = doll["elbow" + side];
  if (!wrist || !elbow) { return null; }
  return walk(wrist, angleTo(wrist, elbow), up * doll.scale);
}

// ---------- pieces of costume, in the waist's and the head's frames ----------

// a band of trim between two lines of another colour
// From (x1, y1) to (x2, y2) in the pen's frame; colour: the band; edge: its two lines (1.7 FINE wide);
// width: the band's width, in the same pixels. Returns nothing: it strokes with pen. No doll in the kit
// calls it yet.
// e.g. trim(-30, 40, 30, 40, FONLEP.gold, FONLEP.goldDark, 6);
function trim(x1, y1, x2, y2, colour, edge, width) {
  var a = angleTo([x1, y1], [x2, y2]), nx = -Math.sin(a) * width * 0.4, ny = Math.cos(a) * width * 0.4;
  pen.lineCap = "round";
  pen.strokeStyle = colour;
  pen.lineWidth = width;
  pen.beginPath();
  pen.moveTo(x1, y1);
  pen.lineTo(x2, y2);
  pen.stroke();
  pen.strokeStyle = edge;
  pen.lineWidth = 1.7 * FINE;
  pen.beginPath();
  pen.moveTo(x1 + nx, y1 + ny);
  pen.lineTo(x2 + nx, y2 + ny);
  pen.moveTo(x1 - nx, y1 - ny);
  pen.lineTo(x2 - nx, y2 - ny);
  pen.stroke();
}

// The hips' line and the skirt's sway, as person() and tier() find them, so
// that a band drawn on the skirt lies on the cloth: [phase, hipTip]
// doll: the doll being drawn (doll.look, doll.x and the clock are read). Returns [phase, hipTip]:
// the skirt's sway in radians, for bandCorners() and band(), and the slant of the hips' line, for
// pen.transform(1, hipTip, 0, 1, 0, 0). It must be kept to person()'s own sums when those change.
// e.g. var hips = hipsOf(doll); pen.save(); pen.transform(1, hips[1], 0, 1, 0, 0); fonlepSilverBelt(hips); pen.restore();
function hipsOf(doll) {
  var look = doll.look, x = doll.x;
  var phase = clock * Math.PI / BEAT + x * 0.01;
  var rock = Math.sin(phase) * 0.05;
  var sway = STYLE.sway * 0.08 * Math.sin(clock * Math.PI / BEAT / 2 + x * 0.01 - 0.6) + (look.sway || 0);
  var hipX = rock * 240 - 45 * sway, moved = hipX / 12;
  var turned = (look.bend !== undefined ? look.bend : feelingOf(look).bend) + rock * 1.4;
  var hipTip = look.shoulders !== undefined ? -0.6 * Math.max(-0.25, Math.min(0.25, look.shoulders - turned)) : -0.13 * moved;
  return [phase, hipTip];
}

// the corners of a band across the skirt from "top" to "bottom" below the
// waist: at a fraction u down the cloth the edge drifts -36 * u^1.3 *
// sin(phase - 1.6u), and one side swells 0.16 * u * cos while the other tucks in
// top, bottom: below the waist, in the waist's frame (the skirt is 158 long); halfTop, halfBottom:
// half the band's width at each; phase: hipsOf(doll)[0]. Returns {tl, tr, bl, br} (each [x, y]) and
// driftTop, driftBottom (how far each edge has drifted sideways), all in the waist's frame.
// e.g. var c = bandCorners(4, 10, 36, 38, hips[0]);
function bandCorners(top, bottom, halfTop, halfBottom, phase) {
  function edge(y, half) {
    var u = Math.max(0, y) / 158, late = phase - 1.6 * u;
    var drift = -36 * Math.pow(u, 1.3) * Math.sin(late), swell = 0.16 * u * Math.cos(late);
    return [[-half * (1 + swell) + drift, y], [half * (1 - swell) + drift, y], drift];
  }
  var t = edge(top, halfTop), b = edge(bottom, halfBottom);
  return {tl: t[0], tr: t[1], bl: b[0], br: b[1], driftTop: t[2], driftBottom: b[2]};
}

// A band across the hips, filled, then handed to "pattern(corners, middle,
// wide)" inside its own clip, and outlined.
// top, bottom, halfTop, halfBottom, phase: as bandCorners() takes them; colour: the band's;
// pattern(corners, middle, wide): bandCorners()' answer, the band's middle y, and a half-width to
// draw out to; or nothing. In the waist's frame, slanted by hipsOf(). Returns nothing: it draws with
// pen (outlined in 0.9 LINE before the pattern goes on).
// e.g. band(-4, 8, 28, 36, hips[0], FONLEP.silver, null);
function band(top, bottom, halfTop, halfBottom, phase, colour, pattern) {
  var c = bandCorners(top, bottom, halfTop, halfBottom, phase);
  pen.beginPath();
  pen.moveTo(c.tl[0], c.tl[1]);
  pen.lineTo(c.tr[0], c.tr[1]);
  pen.quadraticCurveTo(c.tr[0] + (c.br[0] - c.tr[0]) * 0.35, (top + bottom) / 2, c.br[0], c.br[1]);
  pen.lineTo(c.bl[0], c.bl[1]);
  pen.quadraticCurveTo(c.tl[0] + (c.bl[0] - c.tl[0]) * 0.35, (top + bottom) / 2, c.tl[0], c.tl[1]);
  pen.closePath();
  shape(colour, 0.9 * LINE);
  if (pattern) {
    pen.save();
    pen.clip();
    pattern(c, (top + bottom) / 2, Math.max(halfTop, halfBottom) + 40);
    pen.restore();
  }
}

// a band round a forearm, "from" to "to" units above the wrist (wx, wy), toward the elbow (ex, ey)
// The four points are onArm()'s, in the waist's frame; halfFrom, halfTo: half its width at each end;
// colour: its fill; swell: how far its sides curve out (bone()'s, 0.5 when left out). Returns [ux, uy],
// the unit step from the wrist toward the elbow, to place more on the band; it draws with pen.
// e.g. var u = sleeveBand(ex, ey, wx, wy, 5, 19, 9.4, 10.2, FONLEP.green);
function sleeveBand(ex, ey, wx, wy, from, to, halfFrom, halfTo, colour, swell) {
  var a = angleTo([wx, wy], [ex, ey]), ux = Math.cos(a), uy = Math.sin(a);
  bone(wx + ux * from, wy + uy * from, wx + ux * to, wy + uy * to, halfFrom, halfTo, swell || 0.5);
  shape(colour, 0.9 * LINE);
  return [ux, uy];
}

// a gold leaf from (x, y), pointing the way "angle" says
// In the pen's frame; angle in radians; long: its length; wide: half its width at the belly; gold: its
// fill; dark: its vein. Returns nothing: it draws with pen. No doll in the kit calls it yet.
// e.g. leaf(0, -380, -Math.PI / 2, 30, 6, FONLEP.gold, FONLEP.goldDark);
function leaf(x, y, angle, long, wide, gold, dark) {
  var tip = walk([x, y], angle, long), belly = walk([x, y], angle, long * 0.38);
  var l = walk(belly, angle - Math.PI / 2, wide), r = walk(belly, angle + Math.PI / 2, wide);
  pen.beginPath();
  pen.moveTo(x, y);
  pen.quadraticCurveTo(l[0], l[1], tip[0], tip[1]);
  pen.quadraticCurveTo(r[0], r[1], x, y);
  pen.closePath();
  shape(gold, 0.8 * LINE);
  var vein = walk([x, y], angle, long * 0.8);
  pen.strokeStyle = dark;
  pen.lineWidth = 0.8 * LINE;
  pen.beginPath();
  pen.moveTo(x, y);
  pen.lineTo(vein[0], vein[1]);
  pen.stroke();
}
