// naga.js - a Naga, the many-headed serpent of the temple stairs, for films
// made with oldcartoon.js. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="naga.js"></script>
//
// and call naga(x, y, look) from a scene, as person() is called. At its end
// are the giant river snakes of the tale of Chang Ngu, riverSnake(x, water,
// look), which swim with their heads up out of a river; the first of them, the
// largest, as a Naga in white and gold (its kind "naga", riverNaga()).
//
// It was read from one drawing the owner gave (2026-10-13): a five-headed
// Naga in black line on gold paper, from Chiang Mai. Nothing of the drawing
// is copied. This file keeps what the drawing does, as rules, and draws its
// own serpent in the kit's manner: flat colour inside a fine dark line.
//
//   1. Several heads, one body. Five necks fan out of one chest, the middle
//      neck the longest, and every head looks the same way. A head that is
//      further forward lies over the neck behind it.
//   2. A head is a profile with a turned-up nose, an open mouth, and a tall
//      flame of a crest that leans back, about one and a half heads high.
//   3. The body is one band that narrows all the way: about a head wide at
//      the chest, a third of that at the tail. It lies in an S and one loop,
//      and where it crosses itself the part nearer the heads is on top.
//   4. Three things run its whole length, and every neck's too: scales, in
//      rows that sit between each other, their round edges toward the tail;
//      a belly band of bars like a ladder, a quarter of the width, always on
//      the same side; and a fringe of small spikes on the other side, the
//      back, each leaning toward the tail.
//   5. Bands and a round flower cross the body here and there, as a belt does.
//   6. The tail ends in a flame of several tongues.
//
// And one thing a drawing cannot show: it moves. A wave runs down the body
// and is widest at the tail, the heads sway one after the other, the flames
// flicker, and on the beat the heads nod and the mouths open.
//
// It can also travel. Give it "trail", the film's own function for where its
// chest is at a time, and the body follows the chest as a chain, by the rule
// of procedural_animation.html (snake.py): each point of the spine stands a
// fixed gap behind the point in front, and a joint bends only so far.

// The names a Naga's look may have (naga() warns about any other):
//   size       how large it is drawn (1 is about 750 across and 500 high)
//   face       1 looks right, -1 looks left
//   heads      how many heads: 1, 3, 5 or 7 (5 unless told)
//   body       the colour of the scales
//   belly      the colour of the belly band; "bars" is the colour of its bars
//   crest      the colour of the crests, the spikes and the tail's flame
//   fire       the colour inside a flame, and of the mouth
//   path       the middle of the body, from the chest to the tip of the tail:
//              a list of [x, y] measured from (x, y), drawn as if looking
//              right, y going down. Without it the body lies in the S and
//              loop of NAGA_PATH
//   trail      a function of the time that gives [x, y], where the chest is
//              at that time (the function the film itself moves it with). The
//              body then follows the chest as a chain, and (x, y) is the chest
//              itself, in the air or the water, not the ground under it
//   late       the timing of the beat, as hop(t, late) takes it: the heads
//              nod on it, one after the other
//   sing       true to open the mouths on every beat
//   mouth      0 to 1: how far the mouths are open, if the scene says
//   feel       a feeling, as a person's (creatureFeel() in the kit): the eyes,
//              the brows, the jaws and how high each head is held
var NAGA_KEYS = {};

["size", "face", "heads", "body", "belly", "bars", "crest", "fire", "path", "trail", "late", "sing", "mouth", "feel"
].forEach(function (name) { NAGA_KEYS[name] = true; });

// The body as the drawing lays it: down from the chest, back along the
// ground, up into one loop, under itself, and up to the tail's flame.
var NAGA_PATH = [[20, -135], [12, -60], [-28, -7], [-117, 0], [-214, -48], [-290, -152], [-345, -248], [-414, -283],
                 [-497, -221], [-518, -131], [-469, -41], [-380, -14], [-297, -62], [-235, -152], [-248, -269],
                 [-317, -324], [-393, -345], [-455, -380]];

// Points every "step" along a line that is given as a list of points.
//   dense   the line, a list of [x, y], close together
//   step    the gap wanted between the points given back, in pixels of the sheet
// Returns a new list of [x, y], the first point of "dense" first; the last
// piece, shorter than a step, is left off. Draws nothing.
// e.g. nagaWalk([[0, 0], [100, 0]], 10)   // 11 points, 10 apart
function nagaWalk(dense, step) {
  var out = [dense[0]], left = step;
  for (var n = 1; n < dense.length; n++) {
    var dx = dense[n][0] - dense[n - 1][0], dy = dense[n][1] - dense[n - 1][1];
    var far = Math.sqrt(dx * dx + dy * dy), at = 0;
    while (far - at >= left) {
      at += left;
      out.push([dense[n - 1][0] + dx * at / far, dense[n - 1][1] + dy * at / far]);
      left = step;
    }
    left -= far - at;
  }
  return out;
}

// A smooth line through a list of points (each piece is a Catmull-Rom
// curve), as points every "step" along it.
//   points  the points it passes through, a list of [x, y] (two or more)
//   step    the gap between the points given back, in pixels of the sheet
// Returns a list of [x, y] (nagaWalk() of the curve). Draws nothing.
// e.g. nagaLine(NAGA_PATH, 9)   // the middle of the body as naga() lays it
function nagaLine(points, step) {
  var dense = [];
  for (var n = 0; n < points.length - 1; n++) {
    var a = points[Math.max(0, n - 1)], b = points[n], c = points[n + 1], d = points[Math.min(points.length - 1, n + 2)];
    for (var k = 0; k < 16; k++) {
      var u = k / 16, u2 = u * u, u3 = u2 * u, p = [0, 0];
      for (var axis = 0; axis < 2; axis++) {
        p[axis] = 0.5 * (2 * b[axis] + (c[axis] - a[axis]) * u + (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * u2
                         + (3 * b[axis] - a[axis] - 3 * c[axis] + d[axis]) * u3);
      }
      dense.push(p);
    }
  }
  dense.push(points[points.length - 1]);
  return nagaWalk(dense, step);
}

// The spine of a Naga that travels, as a chain behind its chest: the rule of
// procedural_animation.html. Each point turns to face the point in front, no
// more than BEND from the way that one faces, and stands GAP behind it.
// A chain remembers where it has been, and a film must not: a frame has to
// come out the same whether the film is played or jumped into. So the chain
// is laid out straight as it was ten seconds ago and led along "trail" from
// then until now, in every frame. The points are given as naga() draws them:
// measured from the chest at (x, y), as if looking right.
//   trail   a function of the time in seconds that gives [x, y], where the chest
//           is then, in pixels of the sheet (look.trail)
//   x, y    where the chest is now, in pixels of the sheet
//   size    the Naga's size (look.size); face 1 looks right, -1 left
// Returns a list of 96 [x, y], the chest first, 14 apart, unscaled. It reads
// the film's clock and calls trail() some 300 times; it draws nothing.
// e.g. nagaChain(function (t) { return [100 + 60 * t, 400]; }, x, y, 0.5, 1)
function nagaChain(trail, x, y, size, face) {
  var GAP = 14, BEND = Math.PI / 14, COUNT = 96, STEPS = 300;
  function was(ago) {                               // where the chest was, so many thirtieths of a second ago
    var p = trail(clock - ago / 30);
    return [(p[0] - x) / (size * face), (p[1] - y) / size];
  }
  var first = was(STEPS), next = was(STEPS - 1), points = [], angles = [], n;
  var facing = first[0] === next[0] && first[1] === next[1] ? 0 : Math.atan2(next[1] - first[1], next[0] - first[0]);
  for (n = 0; n < COUNT; n++) {
    points.push([first[0] - Math.cos(facing) * n * GAP, first[1] - Math.sin(facing) * n * GAP]);
    angles.push(facing);
  }
  for (var ago = STEPS - 1; ago >= 0; ago--) {
    var head = was(ago);
    if (Math.abs(head[0] - points[0][0]) + Math.abs(head[1] - points[0][1]) > 0.01) {
      angles[0] = Math.atan2(head[1] - points[0][1], head[0] - points[0][0]);   // it faces the way it moves
    }
    points[0] = head;
    for (n = 1; n < COUNT; n++) {
      var away = Math.atan2(points[n - 1][1] - points[n][1], points[n - 1][0] - points[n][0]) - angles[n - 1];
      away -= Math.PI * 2 * Math.round(away / (Math.PI * 2));               // the short way round
      angles[n] = angles[n - 1] + Math.max(-BEND, Math.min(BEND, away));
      points[n] = [points[n - 1][0] - Math.cos(angles[n]) * GAP, points[n - 1][1] - Math.sin(angles[n]) * GAP];
    }
  }
  return points;
}

// One length of the Naga, a neck or the body, painted from its far end to
// its near one, so that where it crosses itself the part nearer the heads is
// on top.
//   line     its middle, as points a step apart, the end nearer the heads first
//   wide     wide(u) is half its width at u, 0 at the first point and 1 at the last
//   c        the colours: body, belly, bars, crest. With c.skin "dots" it is painted as
//            dragon.js wants it: dots for scales (c.spots), a band of the crest's colour
//            down the back with taller points, and a belly of plates
//   belts    how far along (0 to 1) a band crosses it; a number below 0 is a round flower there
//            (none when left out)
// Returns nothing: it draws with pen, in pen's own frame, inked as FINE and
// LINE say. It leaves pen's colours, line width, lineJoin and lineCap as it
// last set them. dragon.js draws its body with it too.
// e.g. nagaStrip(nagaLine(NAGA_PATH, 9), function (u) { return mix(37, 11, u); },
//                {body: "#2f7d5c", belly: "#f1dfa0", bars: "#b23a2a", crest: STYLE.gold}, [0.2, -0.5])
function nagaStrip(line, wide, c, belts) {
  var dots = c.skin === "dots";
  var last = line.length - 1, at = [], n, k;
  for (n = 0; n <= last; n++) {                     // each point's way along, its way across, and its two edges
    var a = line[Math.max(0, n - 1)], b = line[Math.min(last, n + 1)];
    var far = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) || 1;
    var tx = (b[0] - a[0]) / far, ty = (b[1] - a[1]) / far, w = wide(n / last);
    at.push({x: line[n][0], y: line[n][1], tx: tx, ty: ty, w: w,
             back: [line[n][0] - ty * w, line[n][1] + tx * w],        // the back is to the right of the way to the tail
             belly: [line[n][0] + ty * w, line[n][1] - tx * w],
             band: [line[n][0] + ty * w * 0.5, line[n][1] - tx * w * 0.5]});
  }
  var marks = (belts || []).map(function (u) { return [Math.round(Math.abs(u) * last), u < 0]; });
  var ink = inkFor(c.body), dark = blend(c.body, "#10241c", 0.55);
  for (var end = last; end > 0; end -= 4) {
    var from = Math.max(0, end - 4), over = Math.min(last, end + 1);
    pen.beginPath();                                // the spikes of the back, under the body's edge
    for (n = from; n < end; n++) {
      var p = at[n], q = at[n + 1], tall = dots ? 0.5 * p.w + 4 : 0.32 * p.w + 3;
      pen.moveTo(p.back[0], p.back[1]);
      pen.lineTo((p.back[0] + q.back[0]) / 2 - p.ty * tall + p.tx * tall * 0.7, (p.back[1] + q.back[1]) / 2 + p.tx * tall + p.ty * tall * 0.7);
      pen.lineTo(q.back[0], q.back[1]);
    }
    pen.fillStyle = c.crest;
    pen.fill();
    pen.strokeStyle = ink;
    pen.lineWidth = 1.2 * FINE;
    pen.lineJoin = "round";
    pen.stroke();
    pen.beginPath();                                // the body itself: this piece, and a little of the one before it
    for (n = from; n <= over; n++) { pen.lineTo(at[n].back[0], at[n].back[1]); }
    for (n = over; n >= from; n--) { pen.lineTo(at[n].belly[0], at[n].belly[1]); }
    pen.closePath();
    pen.fillStyle = c.body;
    pen.fill();
    pen.save();
    pen.clip();                                     // scales, belly and belts stay on the body
    if (dots) {                                     // a band of flame down the back, inside the body's edge
      pen.beginPath();
      for (n = from; n <= over; n++) { pen.lineTo(at[n].back[0], at[n].back[1]); }
      for (n = over; n >= from; n--) { pen.lineTo(at[n].x - at[n].ty * at[n].w * 0.7, at[n].y + at[n].tx * at[n].w * 0.7); }
      pen.closePath();
      pen.fillStyle = c.crest;
      pen.fill();
    }
    pen.beginPath();                                // the scales: rows that sit between each other
    for (n = from; n < end; n++) {
      var s = at[n], rows = n % 2 ? [-0.48, 0] : [-0.72, -0.24, 0.24], r = Math.max(2.4, s.w * 0.27);
      var way = Math.atan2(s.ty, s.tx);             // toward the tail: a scale's round edge points there
      if (dots) { rows = n % 2 ? [-0.36, 0.06] : [-0.56, -0.15, 0.27]; }
      for (k = 0; k < rows.length; k++) {
        var sx = s.x + s.ty * s.w * rows[k], sy = s.y - s.tx * s.w * rows[k];
        if (dots) {                                 // a dot, longer along the body, and larger toward the back
          var fat = Math.max(1.5, s.w * (0.08 - 0.035 * rows[k]));
          pen.moveTo(sx + Math.cos(way) * fat * 1.25, sy + Math.sin(way) * fat * 1.25);
          pen.ellipse(sx, sy, fat * 1.25, fat, way, 0, 7);
        } else {
          pen.moveTo(sx + Math.cos(way - 1.5) * r, sy + Math.sin(way - 1.5) * r);
          pen.arc(sx, sy, r, way - 1.5, way + 1.5);
        }
      }
    }
    if (dots) {
      pen.fillStyle = c.spots;
      pen.fill();
    } else {
      pen.strokeStyle = dark;
      pen.lineWidth = 1.3 * FINE;
      pen.stroke();
    }
    pen.beginPath();                                // the belly band
    for (n = from; n <= over; n++) { pen.lineTo(at[n].band[0], at[n].band[1]); }
    for (n = over; n >= from; n--) { pen.lineTo(at[n].belly[0], at[n].belly[1]); }
    pen.closePath();
    pen.fillStyle = c.belly;
    pen.fill();
    pen.beginPath();                                // and its bars, like the rungs of a ladder
    for (n = from; n < end; n++) {
      if (dots) {                                   // or its plates: a curved line across the belly at every point
        pen.moveTo(at[n].band[0], at[n].band[1]);
        pen.quadraticCurveTo((at[n].band[0] + at[n].belly[0]) / 2 + at[n].tx * 5, (at[n].band[1] + at[n].belly[1]) / 2 + at[n].ty * 5,
                             at[n].belly[0], at[n].belly[1]);
        continue;
      }
      if (n % 2) { continue; }
      pen.moveTo(at[n].band[0], at[n].band[1]);
      pen.lineTo(at[n + 1].band[0], at[n + 1].band[1]);
      pen.lineTo(at[n + 1].belly[0], at[n + 1].belly[1]);
      pen.lineTo(at[n].belly[0], at[n].belly[1]);
      pen.closePath();
    }
    if (dots) {
      pen.strokeStyle = c.bars;
      pen.lineWidth = 1.3 * FINE;
      pen.stroke();
    } else {
      pen.fillStyle = c.bars;
      pen.fill();
    }
    pen.beginPath();
    for (n = from; n <= over; n++) { pen.lineTo(at[n].band[0], at[n].band[1]); }
    pen.strokeStyle = ink;
    pen.lineWidth = 1.2 * FINE;
    pen.stroke();
    for (k = 0; k < marks.length; k++) {            // a belt across the body, or a round flower on it
      var m = marks[k][0];
      if (m < from || m >= end) { continue; }
      var o = at[m], ahead = [o.x + o.tx * 5, o.y + o.ty * 5];
      if (marks[k][1]) {
        pen.beginPath();
        pen.arc(o.x - o.ty * o.w * 0.25, o.y + o.tx * o.w * 0.25, o.w * 0.5, 0, 7);
        pen.fillStyle = c.crest;
        pen.fill();
        pen.strokeStyle = ink;
        pen.lineWidth = 1.2 * FINE;
        pen.stroke();
        pen.beginPath();
        for (var petal = 0; petal < 8; petal++) {
          var turn = petal / 8 * Math.PI * 2;
          pen.moveTo(o.x - o.ty * o.w * 0.25 + Math.cos(turn) * o.w * 0.3 + 1.6, o.y + o.tx * o.w * 0.25 + Math.sin(turn) * o.w * 0.3);
          pen.arc(o.x - o.ty * o.w * 0.25 + Math.cos(turn) * o.w * 0.3, o.y + o.tx * o.w * 0.25 + Math.sin(turn) * o.w * 0.3, 1.6, 0, 7);
        }
        pen.fillStyle = c.bars;
        pen.fill();
      } else {
        stripe(o.back, ahead, o.band, c.crest, 7);
        stripe(o.back, ahead, o.band, c.bars, 1.6, "dots");
      }
    }
    pen.restore();
    pen.beginPath();                                // the line down each side
    for (n = from; n <= end; n++) { pen.lineTo(at[n].back[0], at[n].back[1]); }
    pen.moveTo(at[from].belly[0], at[from].belly[1]);
    for (n = from; n <= end; n++) { pen.lineTo(at[n].belly[0], at[n].belly[1]); }
    pen.strokeStyle = ink;
    pen.lineWidth = LINE;
    pen.lineCap = "round";
    heavy(ink);
    pen.stroke();
    light();
  }
}

// One tongue of flame, from (0, 0) out along x: "long" to its tip, "wide"
// at its foot, and "curl" is how far its tip is bent to one side (all in
// pixels of pen's frame; a curl below 0 bends it up). "colour" fills it;
// "line", a width, inks its edge too (shape()), and without it it is only filled.
// Returns nothing: it draws with pen, and leaves pen's fillStyle set.
// e.g. nagaTongue(60, 20, -8, STYLE.gold, 1.6)
function nagaTongue(long, wide, curl, colour, line) {
  pen.beginPath();
  pen.moveTo(0, -wide / 2);
  pen.quadraticCurveTo(long * 0.45, -wide * 0.9, long, curl);
  pen.quadraticCurveTo(long * 0.5, wide * 0.25 + curl * 0.3, 0, wide / 2);
  pen.closePath();
  if (line) { shape(colour, line); }
  else {
    pen.fillStyle = colour;
    pen.fill();
  }
}

// A flame of several tongues, fanned about the way x points: a crest, a
// beard, or the end of the tail. It flickers with the film's clock.
//   long, wide  the longest tongue's length and every tongue's width at its foot,
//               in pixels of pen's frame
//   tongues     a list of [turn, length, curl]: its angle from x in radians, its
//               length as a part of "long" (0 to 1), and its bend (-1 to 1)
//   seed        any number, so that flames side by side do not flicker together
//   c           the colours: c.crest outside, c.fire inside
// Returns nothing: it draws with pen about (0, 0); pen's frame is kept.
// e.g. nagaFlame(96, 26, [[-0.3, 0.8, -1], [0, 1, 1], [0.3, 0.8, 1]], 5, {crest: STYLE.gold, fire: "#c8382c"})
function nagaFlame(long, wide, tongues, seed, c) {
  for (var k = 0; k < tongues.length; k++) {
    var flick = Math.sin(clock * 7 + seed * 1.7 + k * 2.1);
    pen.save();
    pen.rotate(tongues[k][0] + 0.06 * flick);
    nagaTongue(long * tongues[k][1], wide, long * 0.12 * tongues[k][2] + 3 * flick, c.crest, 1.6 * FINE);
    pen.translate(wide * 0.1, 0);
    nagaTongue(long * tongues[k][1] * 0.6, wide * 0.45, long * 0.07 * tongues[k][2] + 2 * flick, c.fire);
    pen.restore();
  }
}

// A Naga's head in profile, looking along x, its neck joining at (0, 0).
// "open" is how far the mouth is open, 0 to 1; "e" a feeling (creatureFeel()), or none.
// "seed" is any number (naga() gives the head's place), so heads blink and
// flicker apart; "c" the colours (body, crest, fire). Drawn at a size about
// 140 high with its crest, in pen's frame.
// Returns nothing: it draws with pen, and leaves pen's colours and line width
// as it last set them.
// e.g. nagaHead(0.5, 2, {body: "#2f7d5c", crest: STYLE.gold, fire: "#c8382c"}, null)
function nagaHead(open, seed, c, e) {
  var blink = Math.sin(clock * 0.9 + seed * 2.3) > 0.985;
  pen.save();                                       // the crest: a tall flame that leans back, with smaller tongues behind it
  pen.translate(2, -20);
  pen.rotate(-Math.PI / 2 - 0.4);
  nagaFlame(108, 30, [[-1.02, 0.34, -1.6], [-0.78, 0.48, -1.5], [-0.52, 0.64, -1.4], [-0.26, 0.82, -1.2], [0, 1, -1]], seed, c);
  pen.restore();
  pen.beginPath();                                  // the inside of the mouth
  pen.moveTo(2, 2);
  pen.lineTo(58, -2);
  pen.lineTo(46 + 6 * open, 10 + 26 * open);
  pen.closePath();
  pen.fillStyle = c.fire;
  pen.fill();
  pen.save();                                       // the tongue, forked, and it flicks
  pen.translate(30, 4 + 8 * open);
  pen.rotate(0.12 + 0.3 * open + 0.1 * Math.sin(clock * 9 + seed));
  pen.strokeStyle = c.fire;
  pen.lineWidth = 3.4;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.quadraticCurveTo(26, 6, 44, -2);
  pen.moveTo(36, 1);
  pen.lineTo(47, 7);
  pen.stroke();
  pen.restore();
  pen.save();                                       // the lower jaw turns about the corner of the mouth
  pen.translate(4, 6);
  pen.rotate(0.52 * open);
  pen.save();                                       // its beard: a small flame that hangs back
  pen.translate(14, 12);
  pen.rotate(2.2);
  nagaFlame(34, 13, [[0.3, 0.7, 1], [0, 1, 1]], seed + 3, c);
  pen.restore();
  pen.beginPath();
  pen.moveTo(-22, 2);
  pen.quadraticCurveTo(18, -2, 48, 2);
  pen.quadraticCurveTo(56, 8, 44, 12);
  pen.quadraticCurveTo(14, 20, -22, 18);
  pen.closePath();
  shape(c.body);
  pen.beginPath();                                  // two teeth
  pen.moveTo(30, 1);
  pen.lineTo(34, -8);
  pen.lineTo(38, 1);
  pen.moveTo(16, 0);
  pen.lineTo(19, -6);
  pen.lineTo(22, 0);
  pen.fillStyle = "#fff6ea";
  pen.fill();
  pen.restore();
  pen.beginPath();                                  // the skull and the snout, the nose turned up
  pen.moveTo(-24, 14);
  pen.quadraticCurveTo(-30, -16, -6, -26);
  pen.quadraticCurveTo(22, -32, 46, -18);
  pen.quadraticCurveTo(58, -14, 62, -27);
  pen.quadraticCurveTo(76, -12, 62, -1);
  pen.quadraticCurveTo(32, 3, 2, 5);
  pen.closePath();
  shape(c.body);
  pen.beginPath();                                  // the upper teeth
  pen.moveTo(46, 1);
  pen.lineTo(50, 11);
  pen.lineTo(54, 0);
  pen.moveTo(28, 2);
  pen.lineTo(31, 9);
  pen.lineTo(34, 2);
  pen.fillStyle = "#fff6ea";
  pen.fill();
  pen.beginPath();                                  // a band of the crest's colour over the brow, and round the back of the head
  pen.moveTo(-22, 8);
  pen.quadraticCurveTo(-24, -14, -4, -22);
  pen.quadraticCurveTo(18, -27, 38, -19);
  pen.strokeStyle = c.crest;
  pen.lineWidth = 5;
  pen.lineCap = "round";
  pen.stroke();
  if (e) {                                          // a feeling: its eye (shut, slanted, wide) and its brow (raised, turned)
    creatureEye(22, -11, 7, 5.4, e, {turn: -0.15, skin: c.body, ink: inkFor(c.body), shut: blink});
    pen.save();
    pen.translate(23, -19 - 4 * e.brow[0] + 4 * e.brow[1]);
    pen.rotate(e.brow[1]);
    pen.translate(-23, 19);
  } else {
    pen.beginPath();                                // the eye
    pen.ellipse(22, -11, 7, blink ? 0.8 : 5.4, -0.15, 0, 7);
    pen.fillStyle = "#fff6ea";
    pen.fill();
    pen.strokeStyle = inkFor(c.body);
    pen.lineWidth = 1.6 * FINE;
    pen.stroke();
    if (!blink) { oval(24, -11, 2.8, 3.4, "#1f1a1a"); }
  }
  pen.strokeStyle = inkFor(c.body);                 // the brow, drawn down toward the nose
  pen.lineWidth = 2.4 * FINE;
  pen.beginPath();
  pen.moveTo(10, -20);
  pen.quadraticCurveTo(24, -24, 36, -14);
  pen.stroke();
  if (e) { pen.restore(); }
  pen.beginPath();
  pen.moveTo(60, -12);                              // the nostril
  pen.lineTo(64, -14);
  pen.stroke();
}

// A Naga, its chest standing on (x, y). Everything about it is in "look"
// (see NAGA_KEYS above).
//   x, y   where the chest stands, in pixels of the sheet; with look.trail
//          it is the chest itself, where trail(clock) puts it
//   look   an object, never left out ({} gives the green, five-headed Naga
//          at size 1, facing right): its keys are NAGA_KEYS above, and
//          naming another warns (checkNames)
// Returns nothing: it draws with pen at the film's clock (call it from a
// scene's draw, every frame). It sets the kit's FINE and LINE while it
// draws and leaves them at 1 and STYLE.line; pen's frame is restored.
// e.g. naga(640, 560, {size: 0.6, face: -1, heads: 5, late: 0.2, feel: "happy"})
function naga(x, y, look) {
  checkNames("The naga's name", look, NAGA_KEYS);
  var size = look.size || 1, count = look.heads || 5;
  var c = {body: look.body || "#2f7d5c", belly: look.belly || "#f1dfa0", bars: look.bars || "#b23a2a",
           crest: look.crest || STYLE.gold, fire: look.fire || "#c8382c"};
  FINE = Math.min(1, Math.pow(size, -0.7));         // a larger Naga is not inked heavier
  LINE = STYLE.line * FINE;
  pen.save();
  pen.translate(x, y);
  pen.scale(size * (look.face || 1), size);
  if (!look.trail) {                                // a soft shadow where the chest and the first bend lie
    pen.fillStyle = "rgba(70, 45, 30, 0.2)";
    pen.beginPath();
    pen.ellipse(-70, 26, 150, 14, 0, 0, 7);
    pen.fill();
  }

  // The body: its middle, then the wave that runs down it. The chest keeps
  // still and the tail swings the most. One that travels has a chain for
  // its middle, joined to the foot of the necks by a short rise.
  var middle = look.trail ? nagaLine([[26, -112], [22, -66], [9, -24]].concat(nagaChain(look.trail, x, y, size, look.face || 1).slice(2)), 9)
                          : nagaLine(look.path || NAGA_PATH, 9);
  var body = [], n;
  for (n = 0; n < middle.length; n++) {
    var u = n / (middle.length - 1), a = middle[Math.max(0, n - 1)], b = middle[Math.min(middle.length - 1, n + 1)];
    var far = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) || 1;
    var swing = (look.trail ? 5 : 13) * Math.pow(u, 1.3) * Math.sin(u * 16 - clock * 2.4);
    body.push([middle[n][0] - (b[1] - a[1]) / far * swing, middle[n][1] + (b[0] - a[0]) / far * swing]);
  }
  var end = body[body.length - 1], before = body[body.length - 4];
  pen.save();                                       // the tail's flame, under the tail's end
  pen.translate(end[0], end[1]);
  pen.rotate(Math.atan2(end[1] - before[1], end[0] - before[0]));
  nagaFlame(96, 26, [[-0.6, 0.55, -1], [0.6, 0.6, 1], [-0.28, 0.8, -1], [0.3, 0.84, 1], [0, 1, 1]], 5, c);
  pen.restore();
  nagaStrip(body, function (u) { return mix(37, 11, Math.pow(u, 0.8)) + 5 * Math.sin(Math.min(1, u * 9) * Math.PI); },
            c, [0.045, 0.2, -0.33, 0.47, -0.6, 0.74]);

  // The necks fan out of the chest, the one furthest back first, so a head
  // further forward lies over the neck behind it. The middle one is longest.
  var hub = body[0];
  for (var head = 0; head < count; head++) {
    var place = count === 1 ? 0 : head / (count - 1) * 2 - 1;       // -1 the head furthest back, 1 the one furthest forward
    var lean = count === 1 ? 0.35 : 0.11 + place * 0.69;            // its neck's angle from straight up, in radians
    var long = 236 - 56 * Math.pow(Math.abs(place), 1.5);
    var up = look.late !== undefined ? hop(clock, look.late + head * 0.12) : 0;
    var sway = Math.sin(clock * 1.3 + head * 1.1);
    var top = [hub[0] + Math.sin(lean) * long + 7 * sway, hub[1] - Math.cos(lean) * long + 5 * Math.sin(clock * 1.7 + head * 0.7) - 12 * up];
    var foot = [hub[0] + place * 15, hub[1] + 30];  // the necks leave the chest side by side, from inside it
    var dense = [];
    for (n = 0; n <= 24; n++) {                     // from the head down to the chest: out of the head backward, into the chest from above
      var v = n / 24, w = 1 - v;
      var c1 = [top[0] - 0.42 * long, top[1] + 0.1 * long], c2 = [foot[0] + Math.sin(lean * 0.6) * long * 0.5, foot[1] - Math.cos(lean * 0.6) * long * 0.5];
      dense.push([w * w * w * top[0] + 3 * w * w * v * c1[0] + 3 * w * v * v * c2[0] + v * v * v * foot[0],
                  w * w * w * top[1] + 3 * w * w * v * c1[1] + 3 * w * v * v * c2[1] + v * v * v * foot[1]]);
    }
    nagaStrip(nagaWalk(dense, 9), function (u) { return mix(13, 21, u); }, c, [0.14]);
    var open = look.mouth !== undefined ? look.mouth : look.sing ? 1 - up : 0.3 + 0.14 * Math.sin(clock * 1.1 + head * 1.9);
    var e = look.feel !== undefined ? creatureFeel(look, clock + head * 0.4) : null;   // each head a moment after the one before
    if (e) { open = e.jaw(open); }
    pen.save();
    pen.translate(top[0], top[1] - (e ? 14 * e.raise : 0));
    pen.rotate(-0.1 + 0.05 * sway - 0.12 * up + (e ? 0.7 * e.nod + 0.06 * e.shake : 0));
    pen.scale(0.74, 0.74);
    nagaHead(clamp(open), head, c, e);
    pen.restore();
  }
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
}

// ---------- the river snakes of Chang Ngu ----------
// The giant snakes of the tale of Chang Ngu (ตำนานช้างงู, Chiang Saen): Prince Phrom, thirteen, is told in a dream
// to wash his face in the Mekong, where three white elephants will float down. Three giant snakes come instead:
// the first as big as a rice granary, the second as thick as a palm trunk, both so fearsome that everyone runs up
// the bank; the third a little smaller, and he jumps on to its neck, and it becomes a white elephant (the Lanna
// Folktales tellings of Chang Ngu and of Phra Chao Phrom Maharat). Drawn from no picture: the tellings say only
// "patterned" and "shining". The owner chose two kinds of three, 2026-10-22:
//   plain   a smooth band of olive brown with dark blotches along the back and a pale line along the belly, as a
//           python's: the first two
//   pearl   pearl-white, unmarked, a sheen along the back: the third, already the colour of the elephant it becomes
// A snake swims: its head is held up out of the water, and its body goes in and out of the water line in humps
// behind it, a wave running back along it; rings of water where it goes in and out, and a wake before the head.
//   naga, nagaRed, nagaGreen   since 2026-10-27 (the owner: "Look at some of those Thai Naga ... Decorate them
//           beautifully and animate them beautifully"): a Naga, riverNaga() below, in the palettes "gold" (white and
//           gold: the third), "crimson" (red with a python's blotches: the first) and "emerald" (green, shining: the
//           second) of RIVER_NAGA_COLOURS; they read only size, face and late
var RIVER_SNAKES = {
  plain: {body: "#7a6a48", blot: "#3e3424", belly: "#e8dcb0"},
  pearl: {body: "#ece6dc", blot: null, belly: "#fbf6ee", sheen: true},
  naga: {naga: "gold"},
  nagaRed: {naga: "crimson"},
  nagaGreen: {naga: "emerald"}
};

// The names a river snake's look may have (riverSnake() warns about any other):
//   size    how large it is drawn: 1 is as thick as a palm trunk beside the cast (about 80 thick, 860 long);
//           the granary-sized first one is about 1.6
//   face    1 swims to the right, -1 to the left
//   kind    "plain" (unless told), "pearl", "naga", "nagaRed" or "nagaGreen", as RIVER_SNAKES above
//   body, blot, belly   colours instead of the kind's own (blot null: no blotches)
//   late    a part of a second, so that two snakes do not wave together
var RIVER_SNAKE_KEYS = {};

["size", "face", "kind", "body", "blot", "belly", "late"].forEach(function (name) { RIVER_SNAKE_KEYS[name] = true; });

// The middle of a swimming snake, from its head back along the water: it rises and dips across the water line,
// the head held up out of it. x, water: the head's x and the water line, pixels of the sheet; s: the size;
// face: 1 or -1; phase: where the wave is (radians). Returns a list of 61 [x, y], head first. Draws nothing.
// RIVER_SNAKE_LONG is its length at size 1 (owner, 2026-10-25: "a bit longer", 860, was 760); the wave and the neck
// keep the lengths they had at 760.
// e.g. riverSnakeSpine(900, 780, 0.8, 1, clock * 1.6)
var RIVER_SNAKE_LONG = 860;
function riverSnakeSpine(x, water, s, face, phase) {
  var points = [], more = RIVER_SNAKE_LONG / 760;
  for (var n = 0; n <= 60; n++) {
    var u = n / 60, back = u * RIVER_SNAKE_LONG * s;
    var rise = -62 * s * Math.sin(u * 11 * more - phase) * (0.7 + 0.3 * u) + 12 * s;
    var head = Math.pow(Math.max(0, 1 - u * 6 * more), 1.6);   // the neck rises out of the water to the head
    points.push([x - face * back, water + rise * (1 - head) - 96 * s * head]);
  }
  return points;
}

// The snake's band along its middle: filled, its blotches, its pale belly line, its sheen, and its outline.
// line: the middle, a list of [x, y]; wide: a function of the way along (0 at the head, 1 at the tail) giving the
// half-width in pixels; c: {body, blot, belly, sheen}. Returns nothing: it draws with pen.
// e.g. riverSnakeStrip(riverSnakeSpine(900, 780, 1, 1, 0), function (u) { return mix(40, 14, u); }, RIVER_SNAKES.plain);
function riverSnakeStrip(line, wide, c) {
  var left = [], right = [], belly = [], n, last = line.length - 1;
  for (n = 0; n <= last; n++) {
    var a = line[Math.max(0, n - 1)], b = line[Math.min(last, n + 1)];
    var far = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, tx = (b[0] - a[0]) / far, ty = (b[1] - a[1]) / far, w = wide(n / last);
    left.push([line[n][0] - ty * w, line[n][1] + tx * w]);
    right.push([line[n][0] + ty * w, line[n][1] - tx * w]);
    belly.push([line[n][0] + ty * w * 0.62, line[n][1] - tx * w * 0.62]);
  }
  var outline = function () {
    pen.beginPath();
    left.forEach(function (p, k) { if (k) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } });
    for (var m = last; m >= 0; m--) { pen.lineTo(right[m][0], right[m][1]); }
    pen.closePath();
  };
  outline();
  pen.fillStyle = c.body;
  pen.fill();
  pen.save();
  pen.clip();
  for (n = 3; c.blot && n < last; n += 3) {         // the blotches along the back
    var w2 = wide(n / last);
    oval(line[n][0], line[n][1] - 0.15 * w2, 0.55 * w2, 0.42 * w2, c.blot);
  }
  pen.strokeStyle = c.belly;                        // the pale belly line
  pen.lineWidth = 0.35 * wide(0.2);
  pen.beginPath();
  belly.forEach(function (p, k) { if (k) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } });
  pen.stroke();
  if (c.sheen) {                                    // a pearl's sheen along the back
    pen.strokeStyle = "rgba(255, 255, 255, 0.8)";
    pen.lineWidth = 0.18 * wide(0.2);
    pen.beginPath();
    left.forEach(function (p, k) {
      var q = [p[0] * 0.75 + line[k][0] * 0.25, p[1] * 0.75 + line[k][1] * 0.25];
      if (k) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); }
    });
    pen.stroke();
  }
  pen.restore();
  outline();
  pen.strokeStyle = inkFor(c.body);
  pen.lineWidth = 2.4 * FINE;
  pen.stroke();
}

// A river snake's head: long, round-nosed, no crest, the eye high, a pale lip, a slight smile; (hx, hy) its
// middle, s its size, face 1 or -1, c the snake's colours. Returns nothing: it draws with pen.
// e.g. riverSnakeHead(900, 680, 1, 1, RIVER_SNAKES.pearl);
function riverSnakeHead(hx, hy, s, face, c) {
  pen.save();
  pen.translate(hx, hy);
  pen.scale(s * face, s);
  pen.beginPath();
  pen.moveTo(-40, -26);
  pen.bezierCurveTo(10, -40, 62, -26, 74, -6);
  pen.bezierCurveTo(78, 6, 64, 18, 30, 20);
  pen.bezierCurveTo(0, 24, -30, 24, -44, 18);
  pen.closePath();
  pen.fillStyle = c.body;
  pen.fill();
  pen.strokeStyle = inkFor(c.body);
  pen.lineWidth = 2.4;
  pen.stroke();
  pen.beginPath();                                  // the jaw
  pen.moveTo(74, -2);
  pen.quadraticCurveTo(40, 12, 6, 8);
  pen.stroke();
  pen.fillStyle = c.belly;                          // the pale lip under it
  pen.beginPath();
  pen.moveTo(70, 4); pen.quadraticCurveTo(40, 18, 0, 14); pen.lineTo(0, 20); pen.quadraticCurveTo(40, 24, 66, 10);
  pen.fill();
  oval(30, -14, 9, 7.5, "#fff6ea");                 // the eye, and the nostril
  oval(33, -14, 4.2, 5.2, "#1f1a1a");
  pen.beginPath();
  pen.arc(66, -14, 2.4, 0, 7);
  pen.fillStyle = inkFor(c.body);
  pen.fill();
  pen.restore();
}

// riverSnake(x, water, look): a giant snake swimming in a river, as described above.
//   x, water  the head's x, and the water line (the river's surface) it swims along, pixels of the sheet
//   look      an object, never left out ({} gives the plain snake, size 1, swimming right): its keys are
//             RIVER_SNAKE_KEYS above
// Returns {head, neck}, each [x, y], points of the sheet: the head's middle, and the neck where someone who rides
// it holds on. It draws with pen at the film's clock; only what is above the water line shows. It sets FINE and
// LINE while it draws and leaves them at 1 and STYLE.line.
// e.g. var snake = riverSnake(1100, 780, {size: 0.8, face: -1, kind: "pearl"});
function riverSnake(x, water, look) {
  checkNames("The river snake's name", look, RIVER_SNAKE_KEYS);
  var s = look.size || 1, face = look.face || 1, own = RIVER_SNAKES[look.kind || "plain"];
  if (!own) { checkName("The river snake's kind", look.kind, RIVER_SNAKES); own = RIVER_SNAKES.plain; }
  if (own.naga) { return riverNaga(x, water, s, face, look.late, own.naga); }
  var c = {body: look.body || own.body, blot: look.blot !== undefined ? look.blot : own.blot,
           belly: look.belly || own.belly, sheen: own.sheen};
  FINE = Math.min(1, Math.pow(s, -0.7));
  LINE = STYLE.line * FINE;
  var spine = riverSnakeSpine(x, water, s, face, (clock + (look.late || 0)) * 1.6);
  var wide = function (u) { return s * mix(40, 10, Math.pow(u, 0.85)); };   // tapering to the tail
  pen.save();                                       // only what is above the water shows
  pen.beginPath();
  pen.rect(-1e4, -1e4, 2e4, water + 4 + 1e4);
  pen.clip();
  riverSnakeStrip(spine, wide, c);
  var end = spine[spine.length - 1], before = spine[spine.length - 2], r = wide(1);   // the tail ends round (owner,
  var way = Math.atan2(end[1] - before[1], end[0] - before[0]);                      // 2026-10-25: "rounded ends")
  pen.beginPath();
  pen.arc(end[0], end[1], r, way - Math.PI / 2, way + Math.PI / 2);
  pen.closePath();
  pen.fillStyle = c.body;
  pen.fill();
  pen.beginPath();
  pen.arc(end[0], end[1], r, way - Math.PI / 2, way + Math.PI / 2);
  pen.strokeStyle = inkFor(c.body);
  pen.lineWidth = 2.4 * FINE;
  pen.stroke();
  pen.restore();
  pen.strokeStyle = "rgba(255, 252, 238, 0.75)";      // rings where it goes in and out of the water
  pen.lineWidth = 2.5;
  for (var n = 5; n < spine.length - 1; n++) {
    if ((spine[n][1] - water) * (spine[n + 1][1] - water) <= 0) {
      pen.beginPath();
      pen.ellipse(spine[n][0], water + 2, 46 * s, 9 * s, 0, 0, 7);
      pen.stroke();
    }
  }
  pen.strokeStyle = "rgba(255, 252, 238, 0.6)";       // the wake before the head
  pen.lineWidth = 3;
  pen.beginPath();
  pen.ellipse(x + face * 40 * s, water + 4, 90 * s, 14 * s, 0, 0, 7);
  pen.stroke();
  var head = [spine[0][0] + face * 6 * s, spine[0][1] + 6 * s];
  riverSnakeHead(head[0], head[1], 1.25 * s, face, c);
  FINE = 1;
  LINE = STYLE.line;
  return {head: head, neck: spine[6]};
}

// ---------- the first river snake as a Naga ----------
// The owner, 2026-10-27, of the first snake of Chang Ngu (the granary-sized one): "Look at some of those Thai Naga,
// especially the head, and the scales and add detail to the snakes. Decorate them beautifully and animate them
// beautifully." Read from photographs of Thai and Lanna Nagas (the stair Nagas of Chiang Mai, a makara stair end in
// red and gold, the white stucco Nagas); nothing of them is copied. Chosen with the owner a step at a time:
//   colours   white and gold, a little champagne, a touch of purple and green; no red (the owner: "more white than gold",
//             "w/o the red")
//   scales    almonds, pointed at both ends as an eyelid is, white with a gold lid-line, the head scaled as the body is;
//             across each a band of gold and champagne with a near-white glint that slides as the body moves, because
//             where it lies follows the way the scale is turned. No blotches.
//   horns     three, on the snout, the brow and the crown, each from a wide root sweeping back and three quarters of the
//             way up turning forward to a flame point, as on the stair end; bands within (gold, white with gold beads,
//             gold, a white core with gold scrolls and a spiral swirl), white kranok tongues on the outer edge
//   ridge     one crest (the horns): behind them flames over the crown and down the nape, carried on as the back's fins
//   ornament  every curl is kranokCurl() (oldcartoon.js), a curl that branches into smaller curls rolling the other way, as clouds,
//             water or smoke do: on the lips, the cheek, the brow, the beard, the mane, the ridge and the fins
//   mouth     the jaw breathes a little open, fangs with gold collars and rows of small curved teeth, nothing dark
//             between them (what is behind the head shows through), a forked tongue that undulates and flicks out
//   manner    calm and proud, a Buddhist protector of the waters more than a monster: the snout held up, a hiss only
//             about every 20 s
// It is riverSnake()'s kind "naga": the same swim, wave, water line, rings and wake, drawn so.
// Its colours, by name (owner, 2026-10-27), and which snake wears them (the owner: "The story says the first one is
// blotched all over so use the red one and add some python type spots, the second shining so add a glow to that one,
// then use the white one as the last snake"):
//   gold      the third, the last, that becomes the white elephant: white and gold, a little champagne, a touch of
//             purple and green (the first look chosen)
//   crimson   the first, the granary-sized: "red and gold and white", "as red as the green one is green": deep red
//             scales whose shimmer runs crimson, scarlet and orange-gold, white in the ornament; and a python's blotches
//             ("spots": the blotch's colour and its edge's), dark saddles down the back and smaller blotches on the sides
//   emerald   the second, "smooth and shining": "deep green and purple with gold trim", its shimmer in a peacock's
//             colours but none of its pattern (teal, peacock blue and violet as each scale turns, glints of
//             bronze-gold); and it shines ("glow": the light round it), a soft light about it and glints along it
// Each has the colours of the ornament (white: the light one, gold, goldDeep,
// goldLight, ink, and the stones: purple, green), core (the middle of each horn) and fin (every other fin on the back),
// the eye's stone and its light, the belly's plates from shade to light, the shimmer on the water, and the scales' light
// as [hue, saturation, lightness] pairs from shade to light: ground (the scale), band (the colour at the shimmer's
// sides), champagne (its middle), glint (its brightest), rim (the lid-line). A hue goes in a straight line from one to
// the other, so a red that crosses 0 is written past 360 (366 is 6): from 352 to 6 it would go round through blue.
var RIVER_NAGA_COLOURS = {
  gold: {white: "#fbf8f0", gold: "#d6a437", goldDeep: "#a8741e", goldLight: "#f7e2a0", ink: "#3a2814", purple: "#6b3d8f",
         green: "#2f8f6a", core: "#fbf8f0", fin: "#fbf8f0", eye: ["#2f8f6a", "#4fb88c"], belly: ["#d9bf7e", "#fffaf0"],
         mirror: "#f4ead0", ground: [[230, 10, 80], [44, 26, 97]], band: [[32, 78, 48], [46, 86, 60]],
         champagne: [[42, 55, 76], [50, 66, 84]], glint: [[48, 75, 90], [48, 75, 97]], rim: [[40, 75, 42], [40, 75, 62]]},
  crimson: {white: "#fbf6f0", gold: "#d6a437", goldDeep: "#a8741e", goldLight: "#f7e2a0", ink: "#1a0a08", purple: "#6b3d8f",
            green: "#2f8f6a", core: "#b8301e", fin: "#b8301e", eye: ["#d6a437", "#f7e2a0"], belly: ["#d9bf7e", "#fffaf0"],
            mirror: "#4a2a24", spots: ["rgba(40, 8, 6, 0.6)", "#e8c46a"], ground: [[352, 68, 20], [358, 72, 40]], band: [[345, 72, 34], [382, 82, 52]],
            champagne: [[355, 60, 58], [385, 72, 70]], glint: [[45, 80, 82], [48, 86, 92]], rim: [[40, 78, 44], [44, 82, 62]]},
  emerald: {white: "#4a2a6e", gold: "#d6a437", goldDeep: "#a8741e", goldLight: "#f7e2a0", ink: "#140f0a", purple: "#6b3d8f",
            green: "#2f8f6a", core: "#1f5a40", fin: "#4a2a6e", eye: ["#d6a437", "#f7e2a0"], belly: ["#8a6a1e", "#e8c46a"],
            mirror: "#2a3a2c", glow: "rgba(150, 255, 210, 0.85)", ground: [[165, 50, 14], [150, 55, 34]], band: [[168, 62, 30], [290, 55, 46]],
            champagne: [[178, 55, 52], [276, 50, 68]], glint: [[46, 72, 76], [52, 80, 88]], rim: [[40, 78, 44], [44, 82, 62]]}
};
// The colours being drawn with now: riverNaga() sets them from RIVER_NAGA_COLOURS before it draws.
var RIVER_NAGA = RIVER_NAGA_COLOURS.gold;

// A colour between two [hue, saturation, lightness] (a at 0, b at 1), "alpha" (1 unless given), as riverNagaHsl() gives.
// e.g. riverNagaBetween([40, 75, 42], [40, 75, 62], 0.5)
function riverNagaBetween(a, b, u, alpha) {
  return riverNagaHsl(mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u), alpha);
}

// The light, from above and a little in front: [x, y, toward us], one long.
var RIVER_NAGA_LIGHT = (function () {
  var l = [-0.3, -0.85, 0.42], n = Math.hypot(l[0], l[1], l[2]);
  return [l[0] / n, l[1] / n, l[2] / n];
})();

// A CSS colour from hue, saturation and lightness (0 to 360, 0 to 100, 0 to 100) and an alpha (1 unless given).
// e.g. riverNagaHsl(42, 80, 60)
function riverNagaHsl(h, s, l, a) {
  return "hsla(" + h.toFixed(1) + "," + s.toFixed(1) + "%," + l.toFixed(1) + "%," + (a === undefined ? 1 : a) + ")";
}

// The band of a body along a line, to measure places on: for each point its place, its way toward the tail, its way
// toward the belly, its half-width and the length so far. line: a list of [x, y], head first; face: 1 or -1; wide: a
// function of the way along (0 to 1) giving the half-width. Returns {p, t, n, w, len, total}. Draws nothing.
// e.g. var f = riverNagaFrame(nagaLine(spine, 6), -1, function (u) { return mix(64, 16, u); });
function riverNagaFrame(line, face, wide) {
  var f = {p: line, t: [], n: [], w: [], len: [0]}, last = line.length - 1;
  for (var i = 0; i <= last; i++) {
    var a = line[Math.max(0, i - 1)], b = line[Math.min(last, i + 1)];
    var far = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, tx = (b[0] - a[0]) / far, ty = (b[1] - a[1]) / far;
    f.t.push([tx, ty]);
    f.n.push([face * ty, -face * tx]);
    f.w.push(wide(i / last));
    if (i) { f.len.push(f.len[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1])); }
  }
  f.total = f.len[last];
  return f;
}

// A place on a band (riverNagaFrame): "a" along it from the head, in pixels, and "v" across it (-1 the back's edge,
// 1 the belly's). Returns {x, y, turn: the way toward the tail (radians), w: the half-width, n, t}. Draws nothing.
// e.g. var p = riverNagaAt(f, 120, -0.5);
function riverNagaAt(f, a, v) {
  var lo = 0, hi = f.len.length - 1;
  a = Math.max(0, Math.min(f.total, a));
  while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (f.len[mid] <= a) { lo = mid; } else { hi = mid; } }
  var u = (a - f.len[lo]) / ((f.len[hi] - f.len[lo]) || 1);
  var nx = mix(f.n[lo][0], f.n[hi][0], u), ny = mix(f.n[lo][1], f.n[hi][1], u);
  var tx = mix(f.t[lo][0], f.t[hi][0], u), ty = mix(f.t[lo][1], f.t[hi][1], u), w = mix(f.w[lo], f.w[hi], u);
  return {x: mix(f.p[lo][0], f.p[hi][0], u) + nx * w * v, y: mix(f.p[lo][1], f.p[hi][1], u) + ny * w * v,
          turn: Math.atan2(ty, tx), w: w, n: [nx, ny], t: [tx, ty]};
}

// How much light a spot of the round body catches, v across it (-1 to 1) and n its way toward the belly: about -0.3
// in the shade to 1 in full light. e.g. riverNagaLit([0, 1], -0.6)
function riverNagaLit(n, v) {
  var z = Math.sqrt(Math.max(0, 1 - v * v));
  return n[0] * v * RIVER_NAGA_LIGHT[0] + n[1] * v * RIVER_NAGA_LIGHT[1] + z * RIVER_NAGA_LIGHT[2];
}

// The outline of a band (riverNagaFrame) with its tail ending round, as a Path2D. face: 1 or -1. Draws nothing.
// e.g. pen.fill(riverNagaOutline(f, -1));
function riverNagaOutline(f, face) {
  var path = new Path2D(), last = f.p.length - 1, i, p;
  for (i = 0; i <= last; i++) {
    p = [f.p[i][0] - f.n[i][0] * f.w[i], f.p[i][1] - f.n[i][1] * f.w[i]];
    if (i) { path.lineTo(p[0], p[1]); } else { path.moveTo(p[0], p[1]); }
  }
  var n = f.n[last], back = Math.atan2(-n[1], -n[0]);
  path.arc(f.p[last][0], f.p[last][1], f.w[last], back, back + Math.PI * (face > 0 ? -1 : 1), face > 0);
  for (i = last; i >= 0; i--) { path.lineTo(f.p[i][0] + f.n[i][0] * f.w[i], f.p[i][1] + f.n[i][1] * f.w[i]); }
  path.closePath();
  return path;
}

// One scale: an almond from a little before (x, y) to "ra" behind it toward the tail, "rb" its half-width, turned to
// "turn"; white, cool in the shade and warm in the light, with a gold lid-line; across it a band of gold and champagne
// with a near-white glint, which lies where the way the scale is turned and its light put it, so it slides as the body
// moves. lit: riverNagaLit() of its place; shimmer: a little more or less light, running along the body. Draws with pen.
// e.g. riverNagaScale(400, 300, 0, 12, 6, 0.7, 0);
function riverNagaScale(x, y, turn, ra, rb, lit, shimmer) {
  var g = clamp((lit - 0.15) * 1.35 + shimmer);
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  var head = -0.3 * ra, mid = (head + ra) / 2, almond = new Path2D();
  almond.moveTo(head, 0);
  almond.quadraticCurveTo(mid, -rb * 1.9, ra, 0);
  almond.quadraticCurveTo(mid, rb * 1.9, head, 0);
  almond.closePath();
  var C = RIVER_NAGA;
  pen.fillStyle = riverNagaBetween(C.ground[0], C.ground[1], g);
  pen.fill(almond);
  if (ra > 2.5) {
    var o = clamp(0.5 + 0.42 * Math.sin(turn * 3 + lit * 4 + 0.35 * Math.sin(clock * 1.2 + (x + y) * 0.02)));
    var tone = 0.5 + 0.5 * Math.sin(turn * 2 + lit * 3 + clock * 0.5);
    var goldOf = riverNagaHsl(mix(C.band[0][0], C.band[1][0], tone), mix(C.band[0][1], C.band[1][1], tone), mix(C.band[0][2], C.band[1][2], g), 0.9);
    var champagne = riverNagaHsl(mix(C.champagne[0][0], C.champagne[1][0], tone), mix(C.champagne[0][1], C.champagne[1][1], tone),
                                 mix(C.champagne[0][2], C.champagne[1][2], g));
    var sheen = pen.createLinearGradient(head, -rb, ra, rb);
    sheen.addColorStop(clamp(o - 0.3), "rgba(255, 255, 255, 0)");
    sheen.addColorStop(clamp(o - 0.15), goldOf);
    sheen.addColorStop(clamp(o - 0.06), champagne);
    sheen.addColorStop(o, riverNagaBetween(C.glint[0], C.glint[1], g));
    sheen.addColorStop(clamp(o + 0.06), champagne);
    sheen.addColorStop(clamp(o + 0.15), goldOf);
    sheen.addColorStop(clamp(o + 0.3), "rgba(255, 255, 255, 0)");
    pen.globalAlpha = 0.75 + 0.25 * g;
    pen.fillStyle = sheen;
    pen.fill(almond);
    pen.globalAlpha = 1;
  }
  pen.lineJoin = "round";
  pen.strokeStyle = "rgba(70, 46, 20, 0.7)";
  pen.lineWidth = Math.max(0.9, ra * 0.14);
  pen.stroke(almond);
  pen.strokeStyle = riverNagaBetween(C.rim[0], C.rim[1], g);
  pen.lineWidth = Math.max(0.6, ra * 0.08);
  pen.stroke(almond);
  pen.restore();
}

// The body on its band (riverNagaFrame): the fins along the back, the scales from the tail to the head (each one
// nearer the head lies over the root of the one behind), the jewelled collar behind the head, the ivory-gold plates of
// the belly, and its outline. face: 1 or -1. Draws with pen; returns nothing.
// e.g. riverNagaBody(f, -1);
function riverNagaBody(f, face) {
  var w0 = f.w[0], body = riverNagaOutline(f, face), lw = 2.2 * FINE, curlLw = 1.3 * FINE, a, fin = 0;
  for (a = w0; a < f.total - 0.5 * w0; a += 0.5 * riverNagaAt(f, a, 0).w + 3, fin++) {   // the fins: kranok leaves, gold and
    var b = riverNagaAt(f, a, -0.85), lean = 0.8 + 0.2 * Math.sin(clock * 3 - a / 70);   // white in turn, rippling back
    var dir = Math.atan2(-b.n[1] * Math.cos(lean) + b.t[1] * Math.sin(lean), -b.n[0] * Math.cos(lean) + b.t[0] * Math.sin(lean));
    kranokCurl(b.x, b.y, dir, 0.95 * b.w, 0.16 * b.w, -face, 3.8, 0,
                  fin % 2 ? {fill: RIVER_NAGA.fin, vein: RIVER_NAGA.gold, lw: curlLw, leaf: 0.6}
                          : {fill: RIVER_NAGA.gold, vein: RIVER_NAGA.goldLight, lw: curlLw, leaf: 0.6},
                  0.12 * Math.sin(clock * 2.6 - a / 60));
  }
  pen.fillStyle = RIVER_NAGA.white;
  pen.fill(body);
  pen.save();
  pen.clip(body);
  var col = 0, rows = 7, from = -1.08, to = 0.42, dv = (to - from) / rows;
  for (a = f.total; a > -0.2 * w0; col++) {
    var mid = riverNagaAt(f, a, 0), step = Math.max(3, 0.3 * mid.w);
    for (var r = 0; r <= rows; r++) {
      var v = from + (r + (col % 2) * 0.5) * dv;
      if (v > to + 0.05) { continue; }
      var p = riverNagaAt(f, a, v);
      riverNagaScale(p.x, p.y, p.turn, step * 1.15, dv * mid.w * 0.62, riverNagaLit(p.n, v),
                     0.16 * Math.sin(clock * 2.4 - a / 55 + v * 2) + 0.1 * Math.sin(clock * 0.9 + a / 140));
    }
    a -= step;
  }
  if (RIVER_NAGA.spots) {                                       // a python's blotches: saddles down the back, smaller ones
    for (var bk = 0; (bk + 0.6) * 2.3 * w0 < f.total - 0.5 * w0; bk++) {   // on the side between them, each its own
      [[(bk + 0.6) * 2.3 * w0, -0.42, 0.85, 0.6], [(bk + 1.1) * 2.3 * w0, 0.12, 0.42, 0.3]].forEach(function (b, side) {   // shape,
        var ring = [], w = riverNagaAt(f, b[0], 0).w;                                                                       // edged
        for (var th = 0; th < 6.29; th += 0.26) {                                                                           // pale
          var wob = 1 + 0.22 * Math.sin(3 * th + bk * 1.7 + side) + 0.12 * Math.sin(5 * th + bk * 2.3);
          ring.push(riverNagaAt(f, b[0] + b[2] * w * wob * Math.cos(th), b[1] + b[3] * wob * Math.sin(th)));
        }
        pen.beginPath();
        ring.forEach(function (q, k) { if (k) { pen.lineTo(q.x, q.y); } else { pen.moveTo(q.x, q.y); } });
        pen.closePath();
        pen.fillStyle = RIVER_NAGA.spots[0];
        pen.fill();
        pen.strokeStyle = RIVER_NAGA.spots[1];
        pen.lineWidth = Math.max(1, 0.07 * w);
        pen.lineJoin = "round";
        pen.stroke();
      });
    }
  }
  // the collar behind the head: a gold band set with purple and green glass (kracok chuen), a four-petalled flower on it
  var ca = 1.35 * w0, cw = 0.34 * riverNagaAt(f, ca, 0).w, k1 = riverNagaAt(f, ca, -1.2), k2 = riverNagaAt(f, ca, 1.2),
      k3 = riverNagaAt(f, ca + cw, 1.2), k4 = riverNagaAt(f, ca + cw, -1.2);
  pen.beginPath(); pen.moveTo(k1.x, k1.y); pen.lineTo(k2.x, k2.y); pen.lineTo(k3.x, k3.y); pen.lineTo(k4.x, k4.y); pen.closePath();
  pen.fillStyle = RIVER_NAGA.gold;
  pen.fill();
  pen.strokeStyle = RIVER_NAGA.ink;
  pen.lineWidth = lw;
  pen.stroke();
  for (var gem = -0.9, gi = 0; gem <= 0.95; gem += 0.3, gi++) {
    var gp = riverNagaAt(f, ca + cw / 2, gem), gr = cw * 0.24;
    oval(gp.x, gp.y, gr, gr, gi % 2 ? RIVER_NAGA.green : RIVER_NAGA.purple);
    pen.fillStyle = "rgba(255, 255, 240, 0.8)";
    pen.beginPath(); pen.arc(gp.x - gr * 0.35, gp.y - gr * 0.35, gr * 0.3, 0, 7); pen.fill();
  }
  var fl = riverNagaAt(f, ca + cw / 2, 0.15), fr = cw * 0.55;
  for (var pet = 0; pet < 4; pet++) {
    var pa = pet * Math.PI / 2 + fl.turn + Math.PI / 4;
    oval(fl.x + Math.cos(pa) * fr * 0.62, fl.y + Math.sin(pa) * fr * 0.62, fr * 0.5, fr * 0.3, RIVER_NAGA.goldLight, pa);
  }
  oval(fl.x, fl.y, fr * 0.32, fr * 0.32, RIVER_NAGA.purple);
  for (a = f.total; a > -0.2 * w0; ) {                          // the belly's plates, a ladder of ivory-gold bars
    var m = riverNagaAt(f, a, 0), st = Math.max(3, 0.34 * m.w), q1 = riverNagaAt(f, a, 0.4), q2 = riverNagaAt(f, a, 1.05),
        q3 = riverNagaAt(f, a + st * 1.15, 1.05), q4 = riverNagaAt(f, a + st * 1.15, 0.4), lt = riverNagaLit(m.n, 0.75);
    pen.beginPath(); pen.moveTo(q1.x, q1.y); pen.lineTo(q2.x, q2.y); pen.lineTo(q3.x, q3.y); pen.lineTo(q4.x, q4.y); pen.closePath();
    pen.fillStyle = blend(RIVER_NAGA.belly[0], RIVER_NAGA.belly[1], clamp(0.3 + 0.6 * lt + 0.12 * Math.sin(clock * 2.4 - a / 55)));
    pen.fill();
    pen.strokeStyle = "rgba(70, 40, 10, 0.9)";
    pen.lineWidth = Math.max(0.8, 0.07 * st);
    pen.beginPath(); pen.moveTo(q1.x, q1.y); pen.lineTo(q2.x, q2.y); pen.stroke();
    var h1 = riverNagaAt(f, a + st * 0.25, 0.48), h2 = riverNagaAt(f, a + st * 0.25, 0.95);
    pen.strokeStyle = "rgba(255, 248, 220, 0.6)";
    pen.lineWidth = Math.max(0.6, 0.1 * st);
    pen.beginPath(); pen.moveTo(h1.x, h1.y); pen.lineTo(h2.x, h2.y); pen.stroke();
    a -= st;
  }
  pen.beginPath();                                              // the line between the scales and the plates
  for (a = 0; a <= f.total; a += 6) { var e = riverNagaAt(f, a, 0.4); if (a) { pen.lineTo(e.x, e.y); } else { pen.moveTo(e.x, e.y); } }
  pen.strokeStyle = RIVER_NAGA.ink;
  pen.lineWidth = lw;
  pen.stroke();
  pen.restore();
  pen.strokeStyle = RIVER_NAGA.ink;
  pen.lineWidth = lw * 1.1;
  pen.lineJoin = "round";
  pen.stroke(body);
}

// One horn, in the head's units (the head faces +x): from its root, a little down in the snout, it swells back like a
// breaking wave and three quarters of the way up turns forward to a flame point; gold with white kranok tongues on its
// outer edge, round lobes along it, and within it bands one inside the other as on a stair end (white with gold beads,
// gold, a white core with gold scrolls and a spiral swirl at the inside of its bend). root: its foot; size: 1 for the
// front one; lean: radians it is turned back; lw: its line; sway (-1 to 1) bends its tip. Draws with pen.
// e.g. riverNagaHorn(1, 0, [66, -36], 1, 0);
function riverNagaHorn(lw, sway, root, size, lean) {
  var R = [[12, 6], [0, 0], [-30, -22], [-66, -58], [-82, -106], [-68, -148], [-32, -170], [8 + 4 * sway, -178], [40 + 10 * sway, -198 + 3 * sway]];
  var cs = Math.cos(-lean), sn = Math.sin(-lean), i;
  var line = nagaLine(R.map(function (q) { return [root[0] + (q[0] * cs - q[1] * sn) * size, root[1] + (q[0] * sn + q[1] * cs) * size]; }), 5);
  var n = line.length - 1, spine = [], along = [0];
  for (i = 1; i <= n; i++) { along.push(along[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1])); }
  for (i = 0; i <= n; i++) {
    var a = line[Math.max(0, i - 1)], b = line[Math.min(n, i + 1)], far = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, u = along[i] / along[n];
    spine.push({x: line[i][0], y: line[i][1], tx: (b[0] - a[0]) / far, ty: (b[1] - a[1]) / far, u: u,
                w: size * (24 * Math.pow(1 - u, 0.7) + 18 * Math.sin(Math.PI * Math.min(1, u * 1.15))) * Math.min(1, 0.75 + 3 * u) + 0.4});
  }
  function at(u) { return spine[Math.min(n, Math.round(u * n))]; }
  function edge(q, side, k) { return [q.x - side * q.ty * q.w * k, q.y + side * q.tx * q.w * k]; }   // side 1 the front, -1 the outer
  function band(k1, k2) {
    pen.beginPath();
    spine.forEach(function (q, j) { var e = edge(q, 1, k1); if (j) { pen.lineTo(e[0], e[1]); } else { pen.moveTo(e[0], e[1]); } });
    for (var m = n; m >= 0; m--) { var e2 = edge(spine[m], -1, k2); pen.lineTo(e2[0], e2[1]); }
    pen.closePath();
  }
  [0.12, 0.24, 0.36, 0.48, 0.6, 0.71, 0.81].forEach(function (u, j) {   // the tongues on the outer edge, behind it
    var q = at(u), e = edge(q, -1, 0.95);
    kranokCurl(e[0], e[1], Math.atan2(-q.tx * 0.9 - q.ty * 0.25, q.ty * 0.9 - q.tx * 0.25), size * (44 * (1 - u) + 14),
                  size * (6.5 * (1 - u) + 2.2), -1, 3.8, 0, {fill: RIVER_NAGA.white, vein: RIVER_NAGA.gold, lw: lw},
                  0.12 * Math.sin(clock * 1.6 + j * 0.6 + size * 3));
  });
  pen.beginPath();                                              // the gold horn, its front corner down on the nose
  spine.forEach(function (q, j) { var e = edge(q, 1, 1); if (j) { pen.lineTo(e[0], e[1]); } else { pen.moveTo(e[0], e[1] + 4.5 * size); } });
  for (i = n; i >= 1; i--) {                                    // its outer edge in round lobes
    var o1 = edge(spine[i], -1, 1), o2 = edge(spine[i - 1], -1, 1);
    if (i % 4 === 0 && spine[i].u > 0.06 && spine[i].u < 0.92) {
      pen.quadraticCurveTo((o1[0] + o2[0]) / 2 + spine[i].ty * spine[i].w * 0.35, (o1[1] + o2[1]) / 2 - spine[i].tx * spine[i].w * 0.35, o2[0], o2[1]);
    } else { pen.lineTo(o2[0], o2[1]); }
  }
  pen.closePath();
  pen.fillStyle = RIVER_NAGA.gold;
  pen.fill();
  pen.strokeStyle = RIVER_NAGA.ink;
  pen.lineWidth = lw;
  pen.lineJoin = "round";
  pen.stroke();
  [[0.8, 0.74, RIVER_NAGA.white, 0.9], [0.6, 0.52, RIVER_NAGA.gold, 0.6], [0.46, 0.38, RIVER_NAGA.core, 0.6]].forEach(function (k) {
    band(k[0], k[1]);
    pen.fillStyle = k[2];
    pen.fill();
    pen.strokeStyle = RIVER_NAGA.goldDeep;
    pen.lineWidth = lw * k[3];
    pen.stroke();
  });
  [0.1, 0.22, 0.34, 0.46].forEach(function (u, j) {             // gold scrolls in the core, rolling toward the tip
    var q = at(u), c = edge(q, 1, 0.2);
    kranokCurl(c[0], c[1], Math.atan2(q.ty, q.tx) + 0.45, q.w * 1.3, q.w * 0.14, -1, 5.6, 0, {fill: RIVER_NAGA.gold, vein: null, lw: lw * 0.5},
                  0.1 * Math.sin(clock * 1.5 + j));
  });
  var bend = at(0.6), sw = edge(bend, 1, 0.05);                 // the spiral swirl at the inside of the bend
  kranokCurl(sw[0], sw[1], Math.atan2(bend.ty, bend.tx) + 1.4, bend.w * 3.2, bend.w * 0.24, -1, 10, 0,
                {fill: RIVER_NAGA.gold, vein: RIVER_NAGA.goldLight, lw: lw * 0.6}, 0.06 * Math.sin(clock * 1.3 + size * 2));
  for (var bd = 0.08; bd < 0.86; bd += 0.07) {                  // gold beads along the white band
    var qb = at(bd), pb = edge(qb, -1, 0.63);
    pen.fillStyle = RIVER_NAGA.gold;
    pen.beginPath(); pen.arc(pb[0], pb[1], Math.max(0.9, qb.w * 0.075), 0, 7); pen.fill();
  }
}

// A tooth standing on an edge at (x, y), in the head's units: "long" toward "down" (1 hangs, -1 stands), "wide" at its
// root, its point curved back toward the throat; ivory, its throat side a little darker; a fang wears a gold collar.
// lw: its line. Draws with pen. e.g. riverNagaTooth(90, -12, 1, 24, 4, 1, true);
function riverNagaTooth(x, y, down, long, wide, lw, fang) {
  var tip = [x - 0.35 * long, y + down * long], mid = [x + 0.1 * long, y + down * long * 0.55];
  pen.beginPath();
  pen.moveTo(x + wide, y);
  pen.quadraticCurveTo(mid[0] + wide * 0.5, mid[1], tip[0], tip[1]);
  pen.quadraticCurveTo(mid[0] - wide * 0.7, mid[1] - down * long * 0.1, x - wide, y);
  pen.closePath();
  pen.fillStyle = "#fffaf0";
  pen.fill();
  pen.save();
  pen.clip();
  pen.fillStyle = "#e6d8bc";
  pen.fillRect(x - wide * 3, Math.min(y, tip[1]) - 2, wide * 2.6, long + 4);
  pen.restore();
  pen.strokeStyle = RIVER_NAGA.ink;
  pen.lineWidth = lw * 0.7;
  pen.lineJoin = "round";
  pen.stroke();
  if (fang) {
    pen.beginPath(); pen.ellipse(x, y + down * 1.5, wide * 1.15, 2.2, 0, 0, 7);
    pen.fillStyle = RIVER_NAGA.gold;
    pen.fill();
    pen.strokeStyle = RIVER_NAGA.ink;
    pen.lineWidth = lw * 0.5;
    pen.stroke();
  }
}

// The forked tongue, in the lower jaw's units: it lies along the jaw and out past its point, and it undulates, a wave
// running from its root to its tip and growing toward the tip, slow at rest and quick while it flicks out. out (0 to
// 1): how far it is flicked out; lw: its line. Rose with a touch of purple, a pale groove down it. Draws with pen.
// e.g. riverNagaTongue(0, 1);
function riverNagaTongue(out, lw) {
  var reach = 104 + 74 * out, lift = -4 - 10 * out, n = 40, left = [], right = [], mid = [];
  var speed = mix(3.2, 16, out), waves = mix(1.6, 2.4, out);
  function at(u) {
    return [mix(6, reach, u), 2 + lift * u * u + Math.pow(u, 1.3) * mix(5, 11, out) * Math.sin(2 * Math.PI * waves * u - clock * speed)];
  }
  for (var i = 0; i <= n; i++) {
    var q = at(i / n), ahead = at(Math.min(1, i / n + 0.01)), behind = at(Math.max(0, i / n - 0.01));
    q.push(ahead[0] - behind[0], ahead[1] - behind[1]);
    var far = Math.hypot(q[2], q[3]) || 1, w = mix(6.5, 2.4, i / n);
    left.push([q[0] + q[3] / far * w, q[1] - q[2] / far * w]);
    right.push([q[0] - q[3] / far * w, q[1] + q[2] / far * w]);
    mid.push(q);
  }
  var end = mid[n], way = Math.atan2(end[3], end[2]);
  var forkL = [end[0] + Math.cos(way - 0.5) * 16, end[1] + Math.sin(way - 0.5) * 16], forkR = [end[0] + Math.cos(way + 0.5) * 16, end[1] + Math.sin(way + 0.5) * 16];
  pen.beginPath();
  left.forEach(function (p, k) { if (k) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } });
  pen.quadraticCurveTo(forkL[0] - Math.cos(way) * 4, forkL[1] - Math.sin(way) * 4, forkL[0], forkL[1]);
  pen.lineTo(end[0] + Math.cos(way) * 3, end[1] + Math.sin(way) * 3);
  pen.lineTo(forkR[0], forkR[1]);
  pen.quadraticCurveTo(forkR[0] - Math.cos(way) * 4, forkR[1] - Math.sin(way) * 4, right[n][0], right[n][1]);
  for (var m = n; m >= 0; m--) { pen.lineTo(right[m][0], right[m][1]); }
  pen.closePath();
  pen.fillStyle = "#c7588a";
  pen.fill();
  pen.strokeStyle = "#4a1636";
  pen.lineWidth = lw * 0.8;
  pen.lineJoin = "round";
  pen.stroke();
  pen.beginPath();
  for (i = 2; i < n - 2; i++) { if (i > 2) { pen.lineTo(mid[i][0], mid[i][1]); } else { pen.moveTo(mid[i][0], mid[i][1]); } }
  pen.strokeStyle = "rgba(255, 200, 225, 0.75)";
  pen.lineWidth = 1.4;
  pen.lineCap = "round";
  pen.stroke();
}

// The head, about 160 long in its own units, facing +x, at (hx, hy) of the sheet, hs the scale (the snake's size),
// face 1 or -1. Behind it the mane and the ridge; the three horns; the skull scaled as the body is; the teeth, the
// lower jaw on its hinge with the beard, the tongue and its teeth; the lip, the cheek's rosette, the brow and the eye.
// It breathes, the jaw a little open; a hiss about every 20 s opens it wide and lifts the snout; the tongue flicks every
// 3.6 s; the eye blinks every 4.3 s. Draws with pen. e.g. riverNagaHead(900, 600, 1.6, -1);
function riverNagaHead(hx, hy, hs, face) {
  var hiss = Math.pow(Math.max(0, Math.sin(clock * 0.31 - 1.0)), 16), open = clamp(0.24 + 0.07 * Math.sin(clock * 1.1) + 0.45 * hiss);
  var cyc = (clock % 3.6) / 3.6, flick = cyc < 0.22 ? Math.sin(Math.PI * cyc / 0.22) : 0;
  var blink = (clock % 4.3) < 0.16 ? Math.sin(Math.PI * (clock % 4.3) / 0.16) : 0;
  var lw = 2.0 * FINE / hs, sway = Math.sin(clock * 1.3), C = RIVER_NAGA;
  var gold = {fill: C.gold, vein: C.goldLight, lw: lw}, white = {fill: C.white, vein: C.gold, lw: lw}, whiteP = {fill: C.white, vein: C.purple, lw: lw};
  function breath(k) { return 0.1 * Math.sin(clock * 1.5 + k * 0.7); }
  pen.save();
  pen.translate(hx, hy + 5 * hs * Math.sin(clock * 1.7));
  pen.scale(face * hs, hs);
  pen.rotate(-0.14 + 0.03 * sway - 0.04 * hiss);               // the snout held up, proud; the hiss lifts it a little more
  for (var tier = 0; tier < 3; tier++) {                       // the mane: three tiers of curls sweeping back down the neck
    for (var k = 0; k < 4; k++) {
      kranokCurl(-30 + tier * 8 - k * 2, -34 + k * 18 + tier * 5, Math.PI - 0.15 + k * 0.28 - tier * 0.1, 92 - tier * 18 + k * 6,
                    11 - tier * 2, 1, 5.4, 2, [gold, white, whiteP][tier], breath(k + tier * 3));
    }
  }
  // the ridge: from the crown behind the horns, over the back of the head and down the nape, kranok leaves leaning back
  // along it and rolling at their tips, largest at the crown; two rows, gold behind and white in front
  var path = nagaLine([[16, -58], [-12, -60], [-40, -48], [-60, -24], [-72, 6], [-82, 40]], 2), along = [0];
  for (var pi = 1; pi < path.length; pi++) { along.push(along[pi - 1] + Math.hypot(path[pi][0] - path[pi - 1][0], path[pi][1] - path[pi - 1][1])); }
  var total = along[along.length - 1];
  [[0, {fill: C.gold, vein: C.goldLight, lw: lw, leaf: 0.7, sproutFrom: 0.5, sprout: gold}, 1],
   [0.5, {fill: C.white, vein: C.gold, lw: lw, leaf: 0.7, sproutFrom: 0.5, sprout: white}, 0.8]].forEach(function (row) {
    for (var fk = 0; fk < 8; fk++) {
      var u = (fk + row[0]) / 8, at = u * total, j = 0;
      while (j < along.length - 2 && along[j + 1] < at) { j++; }
      var q0 = path[j], q1 = path[j + 1], tl = Math.hypot(q1[0] - q0[0], q1[1] - q0[1]) || 1, tx = (q1[0] - q0[0]) / tl, ty = (q1[1] - q0[1]) / tl;
      var lean = 0.32 + 0.08 * Math.sin(clock * 1.4 - u * 4);   // outward from the head, leaning back along the ridge
      kranokCurl(q0[0] + ty * 4, q0[1] - tx * 4, Math.atan2(tx * Math.cos(lean) + ty * Math.sin(lean), -ty * Math.cos(lean) + tx * Math.sin(lean)),
                    mix(130, 52, u) * row[2], mix(9.5, 5.5, u) * row[2], -1, 4.6, 1, row[1], breath(fk + 7) + 0.05 * row[0]);
    }
  });
  [[[0, -58], 0.62, 1.2, 0.62], [[34, -51], 0.8, 0.6, 0.31], [[66, -36], 1, 0, 0]].forEach(function (h) {   // the horns, fanned
    riverNagaHorn(lw, Math.sin(clock * 1.2 - 0.4 - h[2]), h[0], h[1], h[3]);                           // back, each a beat after
  });
  var skull = new Path2D();                                     // the skull and the upper jaw, scaled as the body is
  skull.moveTo(-44, 14);
  skull.bezierCurveTo(-60, -6, -44, -50, -6, -56);
  skull.bezierCurveTo(18, -60, 36, -50, 46, -40);
  skull.bezierCurveTo(62, -32, 80, -40, 92, -48);
  skull.bezierCurveTo(104, -42, 108, -26, 100, -14);
  skull.bezierCurveTo(74, -6, 40, -2, 8, 4);
  skull.bezierCurveTo(-8, 14, -26, 24, -44, 14);
  skull.closePath();
  pen.fillStyle = C.white;
  pen.fill(skull);
  pen.save();
  pen.clip(skull);
  for (var row = 0; row < 8; row++) {                          // rows of scales, the ones toward the snout last
    for (var x = 96; x > -64; x -= 9) {
      riverNagaScale(x + (row % 2) * 4.5, -58 + row * 8 + ((x / 9) % 2 ? 4 : 0), Math.PI, 6.5, 5.2, 0.95 - row * 0.09,
                     0.12 * Math.sin(clock * 2.4 + x / 18 + row));
    }
  }
  pen.restore();
  pen.strokeStyle = C.ink;
  pen.lineWidth = lw * 1.2;
  pen.lineJoin = "round";
  pen.stroke(skull);
  [[0.07, 24, 4.2, true], [0.16, 8, 2.4], [0.23, 9, 2.6], [0.3, 8, 2.4], [0.38, 15, 3.4, true], [0.47, 7, 2.3], [0.55, 7.5, 2.4],
   [0.63, 6.5, 2.2], [0.71, 6, 2.1], [0.79, 5, 1.9]].forEach(function (t) {   // the upper teeth, a great fang at the front
    var q = riverNagaCubic([100, -14], [74, -6], [40, -2], [8, 4], t[0]);
    riverNagaTooth(q[0], q[1] - 1, 1, t[1], t[2], lw, t[3]);
  });
  var turn = open * 0.75;                                       // the lower jaw on its hinge at (4, 6)
  pen.save();
  pen.translate(4, 6);
  pen.rotate(turn);
  pen.translate(-4, -6);
  var lag = 0.15 * Math.sin(clock * 1.3 - 0.8);                 // the beard, a moment behind the head
  [[70, 22, 1.75, 90, 10, gold], [52, 26, 1.85, 104, 11, white], [34, 26, 1.95, 84, 9, whiteP], [16, 24, 2.1, 62, 8, gold]].forEach(function (b, i) {
    kranokCurl(b[0], b[1], b[2] + lag, b[3], b[4], 1, 5.6, 2, b[5], breath(i + 13));
  });
  riverNagaTongue(flick, lw);
  var jaw = new Path2D();
  jaw.moveTo(4, 4);
  jaw.bezierCurveTo(30, 8, 62, 8, 88, -2);
  jaw.bezierCurveTo(96, -6, 100, 4, 94, 12);
  jaw.bezierCurveTo(74, 30, 30, 34, -6, 28);
  jaw.bezierCurveTo(-20, 24, -26, 16, -24, 10);
  jaw.closePath();
  pen.fillStyle = C.white;
  pen.fill(jaw);
  pen.save();
  pen.clip(jaw);
  for (var jr = 0; jr < 3; jr++) {
    for (var jx = 92; jx > -30; jx -= 9) { riverNagaScale(jx + (jr % 2) * 4.5, 12 + jr * 7, Math.PI, 6, 4.6, 0.55 - jr * 0.12, 0); }
  }
  pen.restore();
  pen.strokeStyle = C.ink;
  pen.lineWidth = lw * 1.2;
  pen.stroke(jaw);
  [[0.88, 18, 3.8, true], [0.79, 7, 2.3], [0.71, 7.5, 2.4], [0.62, 7, 2.3], [0.53, 11, 2.9, true], [0.44, 6.5, 2.2], [0.35, 6, 2.1],
   [0.26, 5.5, 2], [0.17, 5, 1.9]].forEach(function (t) {     // the lower teeth stand on the jaw's edge
    var q = riverNagaCubic([4, 4], [30, 8], [62, 8], [88, -2], t[0]);
    riverNagaTooth(q[0], q[1] + 1, -1, t[1], t[2], lw, t[3]);
  });
  for (var lc = 0; lc < 6; lc++) { kranokCurl(86 - lc * 15, 12 + lc * 1.6, 2.4, 22 - lc, 3.6, 1, 5, 0, gold, breath(lc + 20)); }
  pen.restore();
  pen.strokeStyle = C.gold;                                     // the upper lip: a gold band, gold curls over it rolling back
  pen.lineWidth = 5;
  pen.beginPath(); pen.moveTo(102, -16); pen.bezierCurveTo(74, -9, 40, -4, 8, 0); pen.stroke();
  pen.strokeStyle = C.ink;
  pen.lineWidth = lw * 0.6;
  pen.stroke();
  for (var uc = 0; uc < 6; uc++) { kranokCurl(92 - uc * 15, -14 + uc * 2.2, -2.6, 24 - uc, 4, -1, 5, 0, gold, breath(uc + 26)); }
  pen.beginPath(); pen.arc(96, -28, 3, 0, 7); pen.fillStyle = C.ink; pen.fill();   // the nostril
  for (var rk = 0; rk < 6; rk++) {                              // the cheek: a rosette of curls round a gold boss at the hinge
    var an = rk * Math.PI / 3 + 0.3;
    kranokCurl(-10 + Math.cos(an) * 10, 6 + Math.sin(an) * 9, an + 0.6, 22, 5, 1, 5.2, 0, rk % 2 ? white : gold, breath(rk + 40));
  }
  oval(-10, 6, 10, 8, C.gold);
  oval(-10, 6, 4.5, 3.6, C.purple);
  kranokCurl(10, -38, -0.25, 64, 7, -1, 5.4, 0, gold, breath(50));   // the brow: two curls rolling back over the eye
  kranokCurl(24, -36, -0.45, 40, 5, -1, 5.4, 0, white, breath(51));
  oval(34, -24, 13, 10, C.gold);                                // the eye: a stone (C.eye) in a gold ring, a slit, a glint
  oval(35, -24, 10, 8, C.eye[0]);
  oval(36.5, -22.5, 6.5, 5.2, C.eye[1]);
  oval(36, -24, 3.2, 7.6, "#120a10");
  oval(31, -27.5, 2.8, 2.2, "#ffffff");
  if (blink > 0) {                                              // the lid comes down to blink
    pen.beginPath(); pen.ellipse(34, -24, 14, 11, 0, Math.PI, 2 * Math.PI); pen.lineTo(48, -24 + 22 * blink - 11);
    pen.ellipse(34, -24 - 11 + 22 * blink, 14, 4, 0, 0, Math.PI, false); pen.closePath();
    pen.fillStyle = C.white;
    pen.fill();
    pen.strokeStyle = C.ink;
    pen.lineWidth = lw;
    pen.stroke();
  }
  pen.restore();
}

// A point and its slope on the cubic curve a, b, c, d (each [x, y]) at u (0 to 1): [x, y, dx, dy]. Draws nothing.
// e.g. riverNagaCubic([0, 0], [10, 0], [20, 10], [30, 10], 0.5)
function riverNagaCubic(a, b, c, d, u) {
  var w = 1 - u, out = [], k;
  for (k = 0; k < 2; k++) { out.push(w * w * w * a[k] + 3 * w * w * u * b[k] + 3 * w * u * u * c[k] + u * u * u * d[k]); }
  for (k = 0; k < 2; k++) { out.push(3 * w * w * (b[k] - a[k]) + 6 * w * u * (c[k] - b[k]) + 3 * u * u * (d[k] - c[k])); }
  return out;
}

// riverSnake()'s kind "naga": the snake swimming as riverSnake() lays it (the same spine, water line and wake), drawn as
// a Naga. x, water, s: the head's x, the water line, the size; face: 1 or -1; late: as riverSnake(); colours: the name
// of its palette in RIVER_NAGA_COLOURS ("gold" unless told). Returns {head,
// neck} as riverSnake() does. It sets FINE and LINE while it draws and leaves them at 1 and STYLE.line.
// e.g. riverNaga(1100, 780, 1.6, -1, 0, "gold");
function riverNaga(x, water, s, face, late, colours) {
  RIVER_NAGA = RIVER_NAGA_COLOURS[colours || "gold"];
  FINE = Math.min(1, Math.pow(s, -0.7));
  LINE = STYLE.line * FINE;
  var spine = riverSnakeSpine(x, water, s, face, (clock + (late || 0)) * 1.6);
  var f = riverNagaFrame(nagaLine(spine, 6), face, function (u) { return s * mix(40, 10, Math.pow(u, 0.85)); });
  pen.save();                                                   // only what is above the water shows
  pen.beginPath(); pen.rect(-1e4, -1e4, 2e4, water + 4 + 1e4); pen.clip();
  var shine = RIVER_NAGA.glow ? 0.75 + 0.25 * Math.sin(clock * 2.1) : 0;
  if (shine) {                                                  // one that shines: a soft light about it, breathing
    pen.save();
    pen.shadowColor = RIVER_NAGA.glow;
    pen.shadowBlur = 46 * s * shine;
    pen.fillStyle = RIVER_NAGA.glow;
    pen.fill(riverNagaOutline(f, face));
    var halo = pen.createRadialGradient(f.p[0][0], f.p[0][1], 0, f.p[0][0], f.p[0][1], 190 * s);
    halo.addColorStop(0, RIVER_NAGA.glow.replace(/[\d.]+\)$/, (0.45 * shine).toFixed(2) + ")"));
    halo.addColorStop(1, RIVER_NAGA.glow.replace(/[\d.]+\)$/, "0)"));
    pen.fillStyle = halo;
    pen.fillRect(f.p[0][0] - 200 * s, f.p[0][1] - 300 * s, 400 * s, 500 * s);
    pen.restore();
  }
  riverNagaBody(f, face);
  if (shine) {                                                  // and glints that come and go along it
    for (var gk = 0; gk < 9; gk++) {
      var beat = clock * 1.3 + gk * 0.37, which = Math.floor(beat), life = beat - which;
      var at = riverNagaAt(f, f.total * ((dice(which * 13 + gk * 7) * 0.92 + 0.04)), -0.9 + 1.2 * dice(which * 17 + gk * 3));
      var big = (5 + 5 * dice(which * 5 + gk)) * s * Math.sin(Math.PI * life);
      pen.save();
      pen.translate(at.x, at.y);
      pen.rotate(0.3);
      pen.fillStyle = "rgba(255, 255, 240, " + (0.9 * Math.sin(Math.PI * life)).toFixed(2) + ")";
      pen.beginPath();
      for (var pt = 0; pt < 8; pt++) { var r = pt % 2 ? big * 0.22 : big; pen.lineTo(Math.cos(pt * Math.PI / 4) * r, Math.sin(pt * Math.PI / 4) * r); }
      pen.closePath();
      pen.fill();
      pen.restore();
    }
  }
  pen.restore();
  var mirror = riverNagaOutline(f, face);
  for (var band = 0; band < 8; band++) {                        // its pale shimmer on the water, fading with depth
    pen.save();
    pen.beginPath(); pen.rect(-1e4, water + 4 + band * 5 * s, 2e4, 5 * s); pen.clip();
    pen.globalAlpha = 0.22 * (1 - band / 8);
    pen.translate(0, 2 * (water + 4));
    pen.scale(1, -1);
    pen.beginPath(); pen.rect(-1e4, -1e4, 2e4, water + 4 + 1e4); pen.clip();
    pen.fillStyle = RIVER_NAGA.mirror;
    pen.fill(mirror);
    pen.restore();
  }
  for (var n = 5; n < spine.length - 1; n++) {                  // rings and spray where it goes in and out of the water
    if ((spine[n][1] - water) * (spine[n + 1][1] - water) <= 0) {
      pen.strokeStyle = "rgba(255, 252, 238, 0.75)";
      pen.lineWidth = 2.5;
      for (var ring = 0; ring < 2; ring++) {
        var grow = (clock * 0.8 + ring * 0.5 + n * 0.13) % 1;
        pen.globalAlpha = 1 - grow;
        pen.beginPath(); pen.ellipse(spine[n][0], water + 2, (30 + 40 * grow) * s, (6 + 6 * grow) * s, 0, 0, 7); pen.stroke();
      }
      pen.globalAlpha = 1;
      for (var drop = 0; drop < 6; drop++) {
        var fly = (clock * 1.4 + drop / 6 + n * 0.37) % 1, side = (drop % 2 ? 1 : -1) * (12 + drop * 6) * s;
        pen.fillStyle = "rgba(240, 250, 255, " + (0.85 * (1 - fly)) + ")";
        pen.beginPath(); pen.arc(spine[n][0] + side * fly, water - 34 * s * Math.sin(Math.PI * fly) * (0.6 + 0.1 * drop), 2.2 * s * (1 - 0.5 * fly), 0, 7); pen.fill();
      }
    }
  }
  pen.strokeStyle = "rgba(255, 252, 238, 0.6)";                // the wake: a bow wave folding back from the neck
  pen.lineWidth = 3;
  for (var w = 0; w < 3; w++) {
    var back = (clock * 0.6 + w / 3) % 1;
    pen.globalAlpha = 0.8 * (1 - back);
    pen.beginPath(); pen.ellipse(x - face * (10 - 120 * back) * s, water + 4, (60 + 80 * back) * s, (10 + 6 * back) * s, 0, 0, 7); pen.stroke();
  }
  pen.globalAlpha = 1;
  var head = [spine[0][0] + face * 6 * s, spine[0][1] + 6 * s];
  riverNagaHead(head[0], head[1], s, face);
  FINE = 1;
  LINE = STYLE.line;
  return {head: head, neck: spine[6]};
}
