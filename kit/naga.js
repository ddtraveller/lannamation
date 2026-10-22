// naga.js - a Naga, the many-headed serpent of the temple stairs, for films
// made with oldcartoon.js. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="naga.js"></script>
//
// and call naga(x, y, look) from a scene, as person() is called. At its end
// are the giant river snakes of the tale of Chang Ngu, riverSnake(x, water,
// look), which swim with their heads up out of a river.
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
var RIVER_SNAKES = {
  plain: {body: "#7a6a48", blot: "#3e3424", belly: "#e8dcb0"},
  pearl: {body: "#ece6dc", blot: null, belly: "#fbf6ee", sheen: true}
};

// The names a river snake's look may have (riverSnake() warns about any other):
//   size    how large it is drawn: 1 is as thick as a palm trunk beside the cast (about 80 thick, 760 long);
//           the granary-sized first one is about 1.6
//   face    1 swims to the right, -1 to the left
//   kind    "plain" (unless told) or "pearl", as RIVER_SNAKES above
//   body, blot, belly   colours instead of the kind's own (blot null: no blotches)
//   late    a part of a second, so that two snakes do not wave together
var RIVER_SNAKE_KEYS = {};

["size", "face", "kind", "body", "blot", "belly", "late"].forEach(function (name) { RIVER_SNAKE_KEYS[name] = true; });

// The middle of a swimming snake, from its head back along the water: it rises and dips across the water line,
// the head held up out of it. x, water: the head's x and the water line, pixels of the sheet; s: the size;
// face: 1 or -1; phase: where the wave is (radians). Returns a list of 61 [x, y], head first. Draws nothing.
// e.g. riverSnakeSpine(900, 780, 0.8, 1, clock * 1.6)
function riverSnakeSpine(x, water, s, face, phase) {
  var points = [];
  for (var n = 0; n <= 60; n++) {
    var u = n / 60, back = u * 760 * s;
    var rise = -62 * s * Math.sin(u * 11 - phase) * (0.7 + 0.3 * u) + 12 * s;
    var head = Math.pow(Math.max(0, 1 - u * 6), 1.6);        // the neck rises out of the water to the head
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
  var c = {body: look.body || own.body, blot: look.blot !== undefined ? look.blot : own.blot,
           belly: look.belly || own.belly, sheen: own.sheen};
  FINE = Math.min(1, Math.pow(s, -0.7));
  LINE = STYLE.line * FINE;
  var spine = riverSnakeSpine(x, water, s, face, (clock + (look.late || 0)) * 1.6);
  var wide = function (u) { return s * mix(40, 14, Math.pow(u, 0.9)); };
  pen.save();                                       // only what is above the water shows
  pen.beginPath();
  pen.rect(-1e4, -1e4, 2e4, water + 4 + 1e4);
  pen.clip();
  riverSnakeStrip(spine, wide, c);
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
