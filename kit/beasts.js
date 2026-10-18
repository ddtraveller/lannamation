// beasts.js - an elephant, a water buffalo, a cat, a tiger and a pig, for films
// made with oldcartoon.js. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="beasts.js"></script>
//
// and call elephant(x, y, look), buffalo(x, y, look), cat(x, y, look),
// tiger(x, y, look) or pig(x, y, look) from a scene. (x, y) is the ground
// under the middle of the animal. (The cat, the tiger and the pig are toward
// the end of this file.) Each
// gives back where its back is, in the scene, so that someone can ride:
//
//     var b = buffalo(600, 900, {step: t / BEAT / 4});
//     person(b.seat[0], b.seat[1], cast("boy", {floor: "astride"}));
//
// amble(), at the end of this file, walks one from place to place at an even
// pace, with feet that do not slide:
//
//     var walk = amble("tiger", t, 100, 1300, 2, {size: 0.8});
//     tiger(walk.x, GROUND, walk.look);
//
// They are drawn in the kit's manner: flat colour inside a fine dark line,
// no cast shadow but the soft one on the ground, and nothing that stays
// still. What each is, in rules:
//
//   The elephant is the elephant of this country: a high domed head with two
//   bumps, small ears, a back that is highest in its middle, legs like
//   columns that hardly bend, round feet with pale nails, a trunk that hangs
//   in a long curve and curls at its tip, and tusks. It may wear a cloth.
//   The water buffalo is low and long: a barrel of a body on short legs, its
//   head carried forward and low, two great horns that sweep back in a
//   crescent, cloven hooves, a pale band under the throat, a long tail.
//
//   Both walk as four-legged animals do: one foot at a time, the hind foot of
//   one side, then the fore foot of that side, then the same on the other
//   side. A foot on the ground goes straight back; a foot in the air comes
//   forward along an arc. "step" is a number that grows while walking, as a
//   person's is: one whole stride for every 1 it grows.

// The names a beast's look may have (both warn about any other):
//   size       how large it is drawn (1 is as large as it is beside the cast at their own
//              sizes: an elephant about 750 high, a buffalo about 400 at the back)
//   face       1 looks right, -1 looks left
//   ground     false: no soft shadow on the ground (the elephant's), for a figure cut from
//              paper, as on a khom phat (khom.js)
//   step       a number that grows while walking; without it the animal stands
//   colour     the colour of its hide
//   late       the timing of the beat, as hop(t, late) takes it: the ears and
//              the tail keep it (not in a film whose style has hop: false)
//   front      true: seen from the front, coming toward us
// and for the elephant only:
//   trunk      0 to 1: how high the trunk is lifted (0 hangs, 1 is held up)
//   tusks      false for one without tusks
//   cloth      a colour: it is dressed. A cloth over its back with a gold border and a
//              fringe, a cloth on its brow, and bands of gold on its tusks
//   howdah     true: a seat of wood on its back, with a cushion, a rail and a high
//              back. The seat it gives back is then on the cushion
// and for the buffalo only:
//   rope       true: a rope through its nose, with the end hanging
// and for the cat and the tiger:
//   sit        true: sitting, the fore legs straight and the tail round the feet. The
//              elephant's too: it lies down with its legs folded, so that someone
//              can climb on, and it does not walk
//   mouth      0 to 1: how far the mouth is open (a mew, a roar; the pig's too, and
//              the elephant's, whose mouth also opens as its trunk lifts)
//   eyes       the colour of the eyes (the pig's too)
//   feel       a feeling, as a person's (creatureFeel() in the kit): the eyes, the head's carriage, the
//              ears, the tail; the elephant's trunk rises in wonder and gladness and its ears flare in
//              anger; a jaw opens in a laugh, a yawn or a fright
//   points     the cat's: the colour of its face, ears, legs and tail. A cat given a
//              colour and no points is that colour all over. The pig's: the colour
//              of patches on its back and its head
//   stripes    the tiger's: the colour of its stripes
//   tufts      the tiger's: false for one without the flame tufts at its joints
var BEAST_KEYS = {};

["size", "face", "step", "colour", "late", "front", "trunk", "tusks", "cloth", "rope", "sit", "mouth", "eyes", "points", "stripes", "tufts", "howdah", "slope", "ground", "feel"].forEach(function (name) { BEAST_KEYS[name] = true; });

// Where a walking foot is in its stride: [how far forward of its joint, how
// high off the ground]. "s" is how far through the stride it is; it is on
// the ground for the first 0.62 of it.
function beastFoot(s, reach, lift) {
  var u = s - Math.floor(s);
  if (u < 0.62) { return [reach * (0.5 - u / 0.62), 0]; }
  var v = (u - 0.62) / 0.38, eased = (1 - Math.cos(v * Math.PI)) / 2;
  return [reach * (eased - 0.5), Math.sin(v * Math.PI) * lift];
}

// The four legs of a beast. Each row of "legs" is one leg: [the joint's x and
// y, how far through the stride it is when the hind near foot begins, which
// way its joint bends (1 forward, -1 back), true if it is on the far side].
// "far" says which side to draw now. "foot" draws a foot at an ankle; it is
// also told where the knee and the top of the leg are, for one that paints
// the leg, and how far the pad is turned.
// On a slope (look.slope, radians: above 0 the ground falls away ahead of
// it, as when it walks down the picture; below 0 it climbs), the ground
// under each foot is where the sloped line is at that foot, so the legs
// ahead reach lower or higher than the legs behind, the body staying level
// as a walking animal's does; and each foot is pitched to the ground, toes
// down a fall and up a climb.
function beastLegs(legs, far, look, bones, wide, colour, reach, lift, foot) {
  var tilt = Math.tan(look.slope || 0);
  for (var n = 0; n < legs.length; n++) {
    var leg = legs[n];
    if (!!leg[4] !== far) { continue; }
    var at = look.step !== undefined ? beastFoot(look.step + leg[2], reach, lift) : [leg[4] ? 14 : -6, 0];
    var skin = far ? blend(colour, "#1c1c22", 0.25) : colour, bend = leg[3];
    var toX = leg[0] + at[0], toY = -bones[2] - at[1] + tilt * toX, stretch = 1;
    if (look.slope) {                               // on a slope a foot at the front of its stride is farther than the two bones span: the leg stretches that far, so it reaches the ground
      var need = Math.sqrt((toX - leg[0]) * (toX - leg[0]) + (toY - leg[1]) * (toY - leg[1])), most = bones[0] + bones[1] - 1;
      if (need > most) { stretch = need / most; }
    }
    var ankle = limb(leg[0], leg[1], toX, toY, bones[0] * stretch, bones[1] * stretch, wide, skin,
                     function (joint) { return bend * joint[0]; }, 0.3);
    foot(ankle[0], ankle[1], skin, at[1] > 2, ankle[2], ankle[3], leg[0], leg[1], look.slope ? look.slope + (at[1] > 2 ? 0.2 : 0) : undefined);
  }
}

// The two edges of a tube that runs along a row of points and narrows, as a
// trunk does. "wideAt" gives its half-width from 0 (the first point) to 1.
function beastTube(points, wideAt) {
  var edges = [[], []], last = points.length - 1;
  for (var n = 0; n <= last; n++) {
    var a = points[Math.max(0, n - 1)], b = points[Math.min(last, n + 1)];
    var far = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) || 1, half = wideAt(n / last);
    edges[0].push([points[n][0] - (b[1] - a[1]) / far * half, points[n][1] + (b[0] - a[0]) / far * half]);
    edges[1].push([points[n][0] + (b[1] - a[1]) / far * half, points[n][1] - (b[0] - a[0]) / far * half]);
  }
  return edges;
}

// An elephant's trunk along a row of points: thick at the face, a round tip
// with a small finger on it, and rings across it that bow toward the tip.
// "open" left out: a line goes all round it. Given, there is no line across
// its root: it grows out of the face it is drawn on. true is that and no
// more; a number is how many points of its first edge, counted from the
// root, have no line either (the side of the trunk that is under the cheek).
function elephantTrunk(points, wide, thin, colour, open) {
  var last = points.length - 1, edges = beastTube(points, function (u) { return mix(wide, thin, Math.pow(u, 0.8)); }), n;
  var way = Math.atan2(points[last][1] - points[last - 1][1], points[last][0] - points[last - 1][0]);
  var closed = open === undefined || open === false, bare = closed || open === true ? 0 : open;
  function outline(from) {
    pen.beginPath();
    for (n = from; n <= last; n++) { pen.lineTo(edges[0][n][0], edges[0][n][1]); }
    pen.arc(points[last][0], points[last][1], thin, way + Math.PI / 2, way - Math.PI / 2, true);
    for (n = last; n >= 0; n--) { pen.lineTo(edges[1][n][0], edges[1][n][1]); }
  }
  pen.beginPath();                                  // the finger: a nub on the upper lip of the tip
  pen.ellipse(points[last][0] + Math.cos(way) * thin * 0.9 + Math.cos(way - 1.57) * thin * 0.5,
              points[last][1] + Math.sin(way) * thin * 0.9 + Math.sin(way - 1.57) * thin * 0.5, thin * 0.62, thin * 0.42, way, 0, 7);
  shape(colour);
  if (closed) {
    outline(0);
    pen.closePath();
    shape(colour);
  } else {                                          // colour all of it, and ink only what has a line
    var edge = inkFor(colour);
    outline(0);
    pen.fillStyle = colour;
    pen.fill();
    outline(bare);
    pen.strokeStyle = edge;
    pen.lineWidth = LINE;
    pen.lineJoin = "round";
    heavy(edge);
    pen.stroke();
    light();
  }
  pen.strokeStyle = "rgba(50, 50, 60, 0.42)";
  pen.lineWidth = 1.4 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  for (n = closed ? 1 : Math.max(2, bare); n < last; n++) {
    var a = edges[0][n], b = edges[1][n];
    pen.moveTo(mix(a[0], b[0], 0.07), mix(a[1], b[1], 0.07));
    pen.quadraticCurveTo(points[n][0] + (points[n + 1][0] - points[n][0]) * 0.34, points[n][1] + (points[n + 1][1] - points[n][1]) * 0.34,
                         mix(a[0], b[0], 0.93), mix(a[1], b[1], 0.93));
  }
  pen.stroke();
}

// An elephant's eye, about (0, 0), looking along x: small and dark under a
// heavy lid, with lashes and the folds of old skin round it. "shut" is true
// in a blink. "e", a feeling (creatureFeel()), in the colour "skin": its lid,
// and the fold of the brow raised or turned.
function elephantEye(ink, shut, e, skin) {
  if (e) {
    creatureEye(0, 0, 11, 7.5, e, {turn: -0.12, skin: skin, iris: "#3a2418", ink: ink, shut: shut});
    pen.strokeStyle = ink;
    pen.lineCap = "round";
    pen.lineWidth = 1.4 * FINE;
    pen.save();                                     // the brow's fold, raised or turned with the brow
    pen.translate(0, -15 - 5 * e.brow[0] + 4 * e.brow[1]);
    pen.rotate(0.8 * e.brow[1]);
    pen.beginPath();
    pen.moveTo(-18, 1);
    pen.quadraticCurveTo(0, -9, 18, 3);
    pen.stroke();
    pen.restore();
    pen.beginPath();                                // and the folds under the eye
    pen.moveTo(-12, 9);
    pen.quadraticCurveTo(0, 14, 13, 8);
    pen.moveTo(-8, 15);
    pen.quadraticCurveTo(2, 19, 12, 14);
    pen.stroke();
    return;
  }
  if (!shut) {
    pen.beginPath();
    pen.ellipse(0, 0, 11, 7.5, -0.12, 0, 7);
    shape("#fff6ea", 1.4 * FINE);
    oval(1.5, 0.5, 5.5, 6, "#3a2418");
    pen.fillStyle = "#fff6ea";
    pen.beginPath();
    pen.arc(3.5, -2, 1.6, 0, 7);
    pen.fill();
  }
  pen.strokeStyle = ink;
  pen.lineCap = "round";
  pen.lineWidth = 2.6 * FINE;                       // the lid: down over the eye in a blink
  pen.beginPath();
  pen.moveTo(-14, shut ? 0 : -3);
  pen.quadraticCurveTo(0, shut ? 8 : -12, 14, shut ? 0 : -3);
  pen.stroke();
  pen.lineWidth = 1.4 * FINE;                       // lashes, a brow fold, and folds under the eye
  pen.beginPath();
  pen.moveTo(-10, shut ? 2 : -7);
  pen.lineTo(-15, shut ? 5 : -11);
  pen.moveTo(-5, shut ? 4 : -9);
  pen.lineTo(-8, shut ? 9 : -14);
  pen.moveTo(-18, -14);
  pen.quadraticCurveTo(0, -24, 18, -12);
  pen.moveTo(-12, 9);
  pen.quadraticCurveTo(0, 14, 13, 8);
  pen.moveTo(-8, 15);
  pen.quadraticCurveTo(2, 19, 12, 14);
  pen.stroke();
}

// Two bands of gold across a tusk: the tusk's shape is the pen's path when
// this is called, and each band is a line [x1, y1, x2, y2] across it.
function elephantRings(bands) {
  pen.save();
  pen.clip();
  pen.strokeStyle = STYLE.gold;
  pen.lineWidth = 6;
  pen.beginPath();
  for (var b = 0; b < bands.length; b++) {
    pen.moveTo(bands[b][0], bands[b][1]);
    pen.lineTo(bands[b][2], bands[b][3]);
  }
  pen.stroke();
  pen.restore();
}

// An elephant seen from the front, coming toward us: drawn about the middle
// of the pen's frame, the ground at y = 0. It gives back how high its head
// stands, for a rider. (elephant() calls it for a look with front: true.)
function elephantFront(look, colour) {
  var ink = inkFor(colour), lying = !!look.sit, walk = look.step !== undefined && !lying, turn = (look.step || 0) * Math.PI * 2, n, side;
  var liftL = walk ? Math.max(0, Math.sin(turn)) : 0, liftR = walk ? Math.max(0, -Math.sin(turn)) : 0;
  var bob = walk ? 5 * Math.abs(Math.cos(turn)) : 0, dark = blend(colour, "#1c1c22", 0.25), chest = blend(colour, "#1c1c22", 0.1);
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0;
  var lift = clamp(look.trunk || 0), open = Math.max(clamp(look.mouth || 0), 0.7 * lift), pink = blend(colour, "#d99aa0", 0.6);
  var e = look.feel !== undefined ? creatureFeel(look, clock + 2) : null;   // a feeling: the trunk raised in wonder and gladness, a jaw, the eyes
  if (e) {
    if (look.trunk === undefined) { lift = clamp(0.7 * e.f.wonder + 0.4 * e.f.smile + 0.5 * e.f.laugh); }
    open = Math.max(e.jaw(clamp(look.mouth || 0)), 0.7 * lift);
  }
  var down = lying ? 196 : 0, shut = Math.sin(clock * 0.7 + 2) > 0.985;
  // A leg from the front: a column a little narrower above the foot, where it
  // spreads to a round pad with nails across it. One that is lifted is
  // shorter, and its foot is off the ground. "from" is the colour of the
  // chest for a fore leg, which comes out of the chest with no top to it.
  function leg(lx, top, raised, skin, wide, nails, from) {
    var base = -raised * 46, start = from ? Math.min(top + 96, base - 36) : top;
    pen.beginPath();
    pen.moveTo(lx - wide + (from ? 3 : 0), start);
    pen.bezierCurveTo(lx - wide + 3, start * 0.6, lx - wide + 7, base - 70, lx - wide + 4, base - 36);
    pen.bezierCurveTo(lx - wide + 2, base - 22, lx - wide - 12, base - 16, lx - wide - 8, base - 5);
    pen.quadraticCurveTo(lx, base + 7, lx + wide + 8, base - 5);
    pen.bezierCurveTo(lx + wide + 12, base - 16, lx + wide - 2, base - 22, lx + wide - 4, base - 36);
    pen.bezierCurveTo(lx + wide - 7, base - 70, lx + wide - 3, start * 0.6, lx + wide - (from ? 3 : 0), start);
    if (from) {                                     // above "start" it has no line, and takes the chest's colour
      var edge = inkFor(skin), rise = pen.createLinearGradient(0, top, 0, start + 10);
      rise.addColorStop(0, from);
      rise.addColorStop(1, skin);
      pen.fillStyle = rise;
      pen.fillRect(lx - wide + 2, top, wide * 2 - 4, start - top + 2);
      pen.fillStyle = skin;
      pen.fill();
      pen.strokeStyle = edge;
      pen.lineWidth = LINE;
      pen.lineJoin = "round";
      heavy(edge);
      pen.stroke();
      light();
    } else {
      pen.closePath();
      shape(skin);
    }
    if (top < base - 200) {                         // the folds of the knee, on a leg long enough to show one
      pen.strokeStyle = "rgba(50, 50, 60, 0.36)";
      pen.lineWidth = 1.5 * FINE;
      pen.lineCap = "round";
      pen.beginPath();
      for (var fold = 0; fold < 2; fold++) {
        pen.moveTo(lx - wide + 12, base - 146 + fold * 13);
        pen.quadraticCurveTo(lx, base - 138 + fold * 13, lx + wide - 12, base - 146 + fold * 13);
      }
      pen.stroke();
    }
    for (var nail = 0; nail < nails; nail++) {
      var across = (nail - (nails - 1) / 2) / ((nails - 1) / 2);
      pen.beginPath();
      pen.ellipse(lx + across * (wide - 4), base - 4 - 3 * (1 - across * across) + 2, 8.5, 9, 0, Math.PI, 0);
      pen.closePath();
      pen.fillStyle = "#f1e3c0";
      pen.fill();
      pen.strokeStyle = inkFor(skin);
      pen.lineWidth = 1.2 * FINE;
      pen.stroke();
    }
  }
  if (!lying) {
    leg(-142, -260, liftR * 0.7, dark, 44, 4);      // the hind legs, further out and darker: each steps with the fore leg of the other side
    leg(142, -260, liftL * 0.7, dark, 44, 4);
  }
  pen.save();
  pen.translate(0, down - bob);
  if (look.howdah) {                                // the back of the howdah stands up behind the head
    pen.beginPath();
    pen.moveTo(-96, -560);
    pen.lineTo(-96, -640);
    pen.quadraticCurveTo(0, -712, 96, -640);
    pen.lineTo(96, -560);
    pen.closePath();
    shape("#8a4a2a");
    pen.strokeStyle = STYLE.gold;
    pen.lineWidth = 4;
    pen.beginPath();
    pen.moveTo(-84, -636);
    pen.quadraticCurveTo(0, -698, 84, -636);
    pen.stroke();
  }
  pen.beginPath();                                  // the body, round, behind the head
  pen.ellipse(0, -356, 204, 178, 0, 0, 7);
  shape(chest);
  pen.save();
  pen.clip();
  var under = pen.createLinearGradient(0, -330, 0, -180);
  under.addColorStop(0, "rgba(40, 40, 60, 0)");
  under.addColorStop(1, "rgba(40, 40, 60, 0.3)");
  pen.fillStyle = under;
  pen.fillRect(-220, -340, 440, 180);
  pen.restore();
  if (look.cloth) {                                 // the cloth over the back hangs down each side, behind the ears
    for (side = -1; side <= 1; side += 2) {
      pen.beginPath();
      pen.moveTo(side * 70, -528);
      pen.bezierCurveTo(side * 140, -520, side * 190, -480, side * 202, -420);
      pen.lineTo(side * 206, -330);
      pen.quadraticCurveTo(side * 178, -318, side * 150, -326);
      pen.lineTo(side * 110, -500);
      pen.closePath();
      shape(look.cloth);
      pen.strokeStyle = STYLE.gold;
      pen.lineWidth = 7;
      pen.beginPath();
      pen.moveTo(side * 204, -342);
      pen.quadraticCurveTo(side * 178, -330, side * 152, -338);
      pen.stroke();
      pen.lineWidth = 2;
      pen.beginPath();
      for (n = 0; n < 4; n++) {
        pen.moveTo(side * (156 + n * 15), -328);
        pen.lineTo(side * (156 + n * 15), -306);
      }
      pen.stroke();
    }
  }
  pen.restore();
  if (lying) {                                      // one that lies has its fore legs folded before it: from the front, two short stumps and their pads
    leg(-92, -128, 0, colour, 54, 5, chest);
    leg(92, -128, 0, colour, 54, 5, chest);
  } else {
    leg(-92, -330, liftL, colour, 54, 5, chest);    // the fore legs
    leg(92, -330, liftR, colour, 54, 5, chest);
  }
  pen.save();
  pen.translate(0, down - bob - 6 * beat);
  var flap = 0.1 * Math.sin(clock * 2.6) + 0.22 * beat;
  for (side = -1; side <= 1; side += 2) {           // the ears: wide at the top, narrowing to a lobe that hangs
    pen.save();
    pen.translate(side * 92, -506);
    pen.scale(side * (1 - 0.3 * flap), 1);
    pen.beginPath();
    pen.moveTo(0, -44);
    pen.bezierCurveTo(52, -90, 130, -72, 138, -8);
    pen.bezierCurveTo(144, 54, 112, 122, 64, 150);
    pen.bezierCurveTo(42, 160, 22, 130, 14, 96);
    pen.lineTo(0, 60);
    pen.closePath();
    shape(blend(colour, "#ffffff", 0.08));
    pen.strokeStyle = pink;                         // the edge of the lobe is pink, and freckled
    pen.lineWidth = 5;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(132, 44);
    pen.bezierCurveTo(124, 96, 96, 132, 62, 144);
    pen.stroke();
    pen.fillStyle = pink;
    for (n = 0; n < 7; n++) {
      pen.beginPath();
      pen.arc(60 + dice(n + 5) * 56, 70 + dice(n + 15) * 56, 2.4, 0, 7);
      pen.fill();
    }
    pen.strokeStyle = "rgba(50, 50, 60, 0.36)";     // the fold along its top
    pen.lineWidth = 1.6 * FINE;
    pen.beginPath();
    pen.moveTo(8, -30);
    pen.bezierCurveTo(50, -66, 104, -54, 122, -12);
    pen.stroke();
    pen.restore();
  }
  if (look.tusks !== false) {                       // a tusk at each side of the trunk: out, down, and in again at its point
    for (side = -1; side <= 1; side += 2) {
      pen.beginPath();
      pen.moveTo(side * 44, -376);
      pen.bezierCurveTo(side * 100, -352, side * 116, -252, side * 74, -192);
      pen.bezierCurveTo(side * 90, -262, side * 70, -334, side * 28, -354);
      pen.closePath();
      shape("#fff6ea");
      if (look.cloth) { elephantRings([[side * 60, -318, side * 110, -330], [side * 68, -292, side * 114, -300]]); }   // one that is dressed has gold on its tusks
    }
  }
  if (open > 0.05) {                                // the mouth, under the trunk, when it opens
    pen.beginPath();
    pen.moveTo(-34, -346);
    pen.quadraticCurveTo(0, -330 + 60 * open, 34, -346);
    pen.closePath();
    shape("#b8505a");
  }
  pen.beginPath();                                  // the head: a high dome with two bumps, wide at the cheeks, narrow where the trunk begins
  pen.moveTo(-104, -440);
  pen.bezierCurveTo(-126, -530, -92, -606, -46, -606);
  pen.quadraticCurveTo(-20, -590, 0, -597);
  pen.quadraticCurveTo(20, -590, 46, -606);
  pen.bezierCurveTo(92, -606, 126, -530, 104, -440);
  pen.bezierCurveTo(98, -392, 78, -358, 58, -342);
  pen.lineTo(-58, -342);
  pen.bezierCurveTo(-78, -358, -98, -392, -104, -440);
  pen.closePath();
  shape(colour);
  pen.strokeStyle = "rgba(50, 50, 60, 0.3)";        // the hollow between the two bumps, and the temples
  pen.lineWidth = 1.6 * FINE;
  pen.beginPath();
  pen.moveTo(0, -592);
  pen.quadraticCurveTo(-4, -566, 0, -540);
  pen.moveTo(-88, -520);
  pen.quadraticCurveTo(-70, -500, -84, -470);
  pen.moveTo(88, -520);
  pen.quadraticCurveTo(70, -500, 84, -470);
  pen.stroke();
  if (look.cloth) {                                 // a cloth on the brow, coming to a point between the eyes, with a gold edge, a boss and a tassel
    pen.beginPath();
    pen.moveTo(-60, -600);
    pen.quadraticCurveTo(-20, -586, 0, -593);
    pen.quadraticCurveTo(20, -586, 60, -600);
    pen.bezierCurveTo(56, -540, 26, -496, 0, -476);
    pen.bezierCurveTo(-26, -496, -56, -540, -60, -600);
    pen.closePath();
    shape(look.cloth);
    pen.strokeStyle = STYLE.gold;
    pen.lineWidth = 4;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(-52, -590);
    pen.bezierCurveTo(-48, -544, -22, -504, 0, -488);
    pen.bezierCurveTo(22, -504, 48, -544, 52, -590);
    pen.moveTo(0, -476);
    pen.lineTo(0, -452);
    pen.stroke();
    oval(0, -548, 11, 11, STYLE.gold);
    oval(0, -448, 5, 6, STYLE.gold);
  }
  pen.fillStyle = pink;                             // freckles where the trunk begins
  for (n = 0; n < 9; n++) {
    pen.beginPath();
    pen.arc(-44 + dice(n + 25) * 88, -440 + dice(n + 35) * 44, 2.2, 0, 7);
    pen.fill();
  }
  // The trunk, down the middle, its end curled. Lifted, it swings out to one
  // side and turns up: a row of points, each turned from the one before. It
  // does not go under the ground: what reaches it lies along it.
  var trunk = [[0, -408]], points = 15, way = Math.PI / 2, floor = -down - 18;
  for (n = 1; n <= points; n++) {
    way += 0.035 * Math.sin(n * 0.5 + clock * 1.6) - lift * (n > 3 ? 0.3 : 0.06) + (n > points - 3 ? 0.4 * (1 - lift) : 0);
    var tx = trunk[n - 1][0] + Math.cos(way) * 26, ty = trunk[n - 1][1] + Math.sin(way) * 26;
    if (ty > floor) { ty = floor; way = 0.08; }
    trunk.push([tx, ty]);
  }
  elephantTrunk(trunk, 57, 15, colour, true);
  for (side = -1; side <= 1; side += 2) {           // the eyes
    pen.save();
    pen.translate(side * 62, -470);
    pen.scale(-side, 1);                            // each looks toward the middle
    elephantEye(ink, shut, e, colour);
    pen.restore();
  }
  pen.restore();
  return 606 + bob - down;
}

// A water buffalo seen from the front, coming toward us, drawn the same way.
// (buffalo() calls it for a look with front: true.)
function buffaloFront(look, colour) {
  var ink = inkFor(colour), walk = look.step !== undefined, turn = (look.step || 0) * Math.PI * 2, n, side;
  var liftL = walk ? Math.max(0, Math.sin(turn)) : 0, liftR = walk ? Math.max(0, -Math.sin(turn)) : 0;
  var bob = walk ? 4 * Math.abs(Math.cos(turn)) : 0, dark = blend(colour, "#1c1c22", 0.25);
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0;
  var e = look.feel !== undefined ? creatureFeel(look, clock) : null;   // a feeling: the eyes and the ears
  function leg(lx, top, lift, skin) {               // a leg from the front, and its cloven hoof
    var foot = -16 - lift * 36;
    pen.beginPath();
    pen.moveTo(lx - 24, top);
    pen.lineTo(lx - 15, foot);
    pen.lineTo(lx + 15, foot);
    pen.lineTo(lx + 24, top);
    pen.closePath();
    shape(skin);
    for (var toe = -1; toe <= 1; toe += 2) {
      pen.beginPath();
      pen.moveTo(lx + toe * 1, foot - 2);
      pen.lineTo(lx + toe * 17, foot - 2);
      pen.quadraticCurveTo(lx + toe * 19, foot + 14, lx + toe * 12, foot + 16);
      pen.lineTo(lx + toe * 2, foot + 16);
      pen.closePath();
      shape("#2a2a30");
    }
  }
  leg(-100, -150, liftR * 0.7, dark);
  leg(100, -150, liftL * 0.7, dark);
  pen.beginPath();                                  // the barrel of the body, behind the head
  pen.ellipse(0, -214 - bob, 142, 112, 0, 0, 7);
  shape(blend(colour, "#1c1c22", 0.1));
  pen.strokeStyle = blend(colour, "#e9e2d0", 0.7);  // the pale band across the chest
  pen.lineWidth = 9;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(-44, -150 - bob);
  pen.quadraticCurveTo(0, -128 - bob, 44, -150 - bob);
  pen.stroke();
  leg(-62, -170, liftL, colour);
  leg(62, -170, liftR, colour);
  pen.save();
  pen.translate(0, -bob + 5 * beat);
  for (side = -1; side <= 1; side += 2) {           // the horns: a crescent to each side, sweeping out and up
    pen.beginPath();
    pen.moveTo(side * 40, -318);
    pen.bezierCurveTo(side * 140, -298, side * 240, -340, side * 180, -476);
    pen.bezierCurveTo(side * 198, -380, side * 130, -352, side * 40, -350);
    pen.closePath();
    shape("#a8a294");
    pen.strokeStyle = inkFor("#a8a294");
    pen.lineWidth = 1.3 * FINE;
    pen.beginPath();
    for (n = 0; n < 5; n++) {
      pen.moveTo(side * (66 + n * 22), -316 - n * 3);
      pen.lineTo(side * (64 + n * 22), -346 - n * 4);
    }
    pen.stroke();
    pen.save();                                     // the ear, under the horn
    pen.translate(side * 56, -312);
    pen.scale(side, 1);
    pen.rotate(0.3 + 0.12 * Math.sin(clock * 2.8) - 0.3 * beat - (e ? 0.4 * e.ears : 0));   // down when it is sad, up in wonder
    pen.beginPath();
    pen.moveTo(0, -8);
    pen.quadraticCurveTo(40, -22, 70, 4);
    pen.quadraticCurveTo(36, 22, 0, 10);
    pen.closePath();
    shape(blend(colour, "#000000", 0.12));
    pen.restore();
  }
  pen.beginPath();                                  // the head: long, broad at the brow and narrower at the muzzle
  pen.moveTo(-60, -330);
  pen.quadraticCurveTo(0, -354, 60, -330);
  pen.bezierCurveTo(72, -270, 58, -220, 46, -190);
  pen.quadraticCurveTo(0, -158, -46, -190);
  pen.bezierCurveTo(-58, -220, -72, -270, -60, -330);
  pen.closePath();
  shape(colour);
  pen.beginPath();                                  // the muzzle, paler, with two nostrils
  pen.ellipse(0, -196, 46, 27, 0, 0, 7);
  shape(blend(colour, "#b0a8a0", 0.45));
  oval(-16, -198, 5, 3.5, "#1f1a1a");
  oval(16, -198, 5, 3.5, "#1f1a1a");
  for (side = -1; side <= 1; side += 2) {
    if (e) {                                        // a feeling's eyes, each looking toward the middle
      pen.save();
      pen.translate(side * 46, -296);
      pen.scale(-side, 1);
      creatureEye(0, 0, 8, 7, e, {skin: colour, iris: "#1f1a1a", ink: ink});
      pen.restore();
    } else {
      oval(side * 46, -296, 8, 7, "#fff6ea");
      oval(side * 45, -295, 4.5, 5, "#1f1a1a");
    }
  }
  if (look.rope) {
    pen.strokeStyle = "#c9a878";
    pen.lineWidth = 4;
    pen.beginPath();
    pen.moveTo(16, -198);
    pen.quadraticCurveTo(40, -130, 30 + 10 * Math.sin(clock * 2.4), -40);
    pen.stroke();
  }
  pen.restore();
  return 346 + bob;
}

// An elephant, standing on (x, y). Everything about it is in "look" (see
// BEAST_KEYS above). It gives back {seat, head}: where a rider sits on its
// neck (or in its howdah), and the top of its head, in the scene.
//
// How it is drawn, from the side: the legs are columns that spread to a round
// pad, with no line where the leg ends and the foot begins, and no cap where
// a near leg meets the body: the body's colour is laid back over the top of
// it, so the leg comes out of the shoulder or the hip. The head is carried
// higher than the back. The trunk grows out of the face with no line across
// its root; it is thick there, hangs with its end curled in, and when it is
// lifted it turns up close before the face and its end curls forward; the
// mouth opens with it (or by "mouth"). It blinks, and in a walk its head
// nods and its trunk swings with the steps. "sit" lays it down with its legs
// folded, so that someone can climb on.
function elephant(x, y, look) {
  checkNames("The elephant's name", look, BEAST_KEYS);
  var size = (look.size || 1) * GAITS.elephant[0], face = look.face || 1, colour = look.colour || "#8e9098", ink = inkFor(colour), n;
  var lying = !!look.sit, walk = look.step !== undefined && !lying, bob = walk ? 4 * Math.abs(Math.sin(look.step * Math.PI * 2)) : 0;
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0;
  var lift = clamp(look.trunk || 0), open = Math.max(clamp(look.mouth || 0), 0.7 * lift), seed = x * 0.01;
  var e = look.feel !== undefined ? creatureFeel(look, clock + seed) : null;   // a feeling: the trunk, the head, the ears, the tail, the eye
  if (e) {
    if (look.trunk === undefined) { lift = clamp(0.7 * e.f.wonder + 0.4 * e.f.smile + 0.5 * e.f.laugh); }
    open = Math.max(e.jaw(clamp(look.mouth || 0)), 0.7 * lift);
  }
  var fold = "rgba(50, 50, 60, 0.38)", pink = blend(colour, "#d99aa0", 0.6), wood = "#8a4a2a";
  var rise = bob - (lying ? 196 : 0);               // how far all above the legs is lifted: a little in a walk, and a long way down for one that lies
  FINE = Math.min(1, Math.pow(size, -0.7));
  LINE = STYLE.line * FINE;
  if (look.ground !== false) {
    pen.fillStyle = "rgba(70, 45, 30, 0.2)";        // the soft shadow on the ground
    pen.beginPath();
    pen.ellipse(x + 40 * size * face, y + 6, (lying ? 390 : 340) * size, 26 * size, 0, 0, 7);
    pen.fill();
  }
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  if (look.front) {                                 // seen from the front: another drawing
    var tall = elephantFront(look, colour);
    pen.restore();
    FINE = 1;
    LINE = STYLE.line;
    return {seat: [x, y - (tall + (look.howdah ? 8 : -26)) * size], head: [x, y - tall * size]};   // in a howdah, one sits behind the head and is seen over it
  }
  var legs = [[-168, -300, 0, 1, false], [142, -300, 0.25, 1, false], [-138, -306, 0.5, 1, true], [172, -306, 0.75, 1, true]];
  // On a slope the body pitches with the ground, about a point in its
  // middle, so its weight is over the feet and they stand on the ground
  // firmly; the legs hang from the pitched joints and reach the sloped
  // ground as before. It follows the whole slope: its legs are columns of
  // one length, so with less of a pitch the legs on the low side of the
  // slope stop short of the ground (a third of the slope left the fore
  // feet floating on a fall).
  var pitch = lying ? 0 : (look.slope || 0), PIVOT = -400;
  var legsNow = legs.map(function (leg) {
    var dx = leg[0], dy = leg[1] - PIVOT;
    return [dx * Math.cos(pitch) - dy * Math.sin(pitch), PIVOT + dx * Math.sin(pitch) + dy * Math.cos(pitch)].concat(leg.slice(2));
  });
  function pitched(on) {                            // turn the body's frame with the ground, or back
    pen.translate(0, PIVOT);
    pen.rotate(on ? pitch : -pitch);
    pen.translate(0, -PIVOT);
  }
  var bones = [140, 124, 46], thick = [57, 48, 45];        // the ankle is as high as the leg's round end reaches, so that end stands on the ground
  // A foot: the column of the leg spreads to a round pad. It is filled whole
  // and inked only round its sides and its sole, so no line parts it from
  // the leg. A fore foot shows four nails and a hind foot three. And the
  // knee above it has two folds. "turn" is how the pad is turned, for a leg
  // that lies along the ground.
  function foot(ax, ay, skin, lifted, kx, ky, hx, hy, turn) {
    var edge = inkFor(skin), nails = hx > 0 ? 4 : 3;
    pen.strokeStyle = fold;
    pen.lineWidth = 1.5 * FINE;
    pen.lineCap = "round";
    pen.beginPath();
    for (var w = -1; w <= 1; w += 2) {
      pen.moveTo(kx - 30, ky + w * 8);
      pen.quadraticCurveTo(kx, ky + w * 8 + 6, kx + 30, ky + w * 8 - 1);
    }
    pen.stroke();
    pen.save();
    pen.translate(ax, ay);
    pen.rotate(turn !== undefined ? turn : lifted ? 0.2 : 0);
    pen.beginPath();
    pen.moveTo(-45, -6);
    pen.bezierCurveTo(-47, 16, -61, 30, -55, 41);
    pen.quadraticCurveTo(0, 55, 59, 41);
    pen.bezierCurveTo(65, 30, 49, 16, 46, -6);
    pen.fillStyle = skin;
    pen.fill();
    pen.strokeStyle = edge;
    pen.lineWidth = LINE;
    pen.lineJoin = "round";
    heavy(edge);
    pen.stroke();
    light();
    for (var nail = 0; nail < nails; nail++) {
      pen.beginPath();
      pen.ellipse(51 - nail * 16, 42 + (nail ? 2.5 : 0), 7.5, 8.5, 0, Math.PI, 0);
      pen.closePath();
      pen.fillStyle = "#f1e3c0";
      pen.fill();
      pen.strokeStyle = edge;
      pen.lineWidth = 1.2 * FINE;
      pen.stroke();
    }
    pen.restore();
  }
  // The legs of one that lies, on the far side or the near: the hind leg
  // folded, its knee forward on the ground and its foot out behind; the
  // fore leg down to an elbow on the ground, and stretched out before it.
  function folded(farSide) {
    var skin = farSide ? blend(colour, "#1c1c22", 0.25) : colour, dx = farSide ? 28 : 0, dy = farSide ? -8 : 0;
    var knee = [-62 + dx, -56 + dy], elbow = [196 + dx, -56 + dy];
    var hind = limb(-168 + dx, -108 + dy, -204 + dx, -52 + dy, 120, 146, thick, skin, knee, 0.3);
    foot(hind[0], hind[1], skin, false, knee[0], knee[1], -1, 0, 1.45);
    var fore = limb(142 + dx, -108 + dy, 326 + dx, -52 + dy, 76, 132, thick, skin, elbow, 0.3);
    foot(fore[0], fore[1], skin, false, elbow[0], elbow[1], 1, 0, -1.45);
  }
  function bodyShape() {                            // the body: the back highest in its middle, a deep chest, a belly that hangs a little
    pen.beginPath();
    pen.moveTo(-252, -380);
    pen.bezierCurveTo(-268, -470, -200, -532, -90, -542);
    pen.bezierCurveTo(0, -550, 90, -540, 150, -514);
    pen.bezierCurveTo(204, -492, 236, -450, 238, -400);
    pen.bezierCurveTo(242, -330, 214, -270, 160, -250);
    pen.bezierCurveTo(80, -224, -90, -220, -176, -246);
    pen.bezierCurveTo(-226, -262, -246, -320, -252, -380);
    pen.closePath();
  }
  if (lying) { folded(true); }
  else { beastLegs(legsNow, true, look, bones, thick, colour, GAITS.elephant[1], 26, foot); }
  pen.translate(0, -rise);                          // all above the legs: it rises and falls a little in a walk
  pitched(true);
  var swing = Math.sin(clock * 2.1 + seed) * 16 * (e ? 1 + e.wag : 1) + (walk ? 10 * Math.sin(look.step * Math.PI * 2) : 0);
  hose(-246, -424, -280 + swing, -238, 0.12, 11, colour);     // the tail, and the brush of hair at its end
  pen.save();
  pen.translate(-280 + swing, -238);
  pen.rotate(lying ? 1.15 : -swing * 0.012);        // on one that lies, the brush trails on the ground
  pen.beginPath();
  pen.moveTo(-7, -6);
  pen.quadraticCurveTo(-16, 22, -4, 52);
  pen.quadraticCurveTo(12, 24, 7, -6);
  pen.closePath();
  shape("#3a3a40");
  pen.restore();
  bodyShape();
  shape(colour);
  pitched(false);
  pen.translate(0, rise);                           // the near legs stand on the ground, whatever the body does
  if (lying) { folded(false); }
  else { beastLegs(legsNow, false, look, bones, thick, colour, GAITS.elephant[1], 26, foot); }
  pen.translate(0, -rise);
  pitched(true);
  pen.save();                                       // inside the body's own line: the tops of the near legs, the belly's shade, the folds
  bodyShape();
  pen.clip();
  for (n = 0; n < 2; n++) {                         // a near leg has no cap: where it lies on the body it takes the body's colour
    var over = pen.createLinearGradient(0, -390, 0, -240);
    over.addColorStop(0, colour);
    over.addColorStop(0.62, colour);
    over.addColorStop(1, beastSheer(colour, 0));
    pen.fillStyle = over;
    pen.fillRect(legs[n][0] - 84, -390, 168, 150);
  }
  var shade = pen.createLinearGradient(0, -430, 0, -224);
  shade.addColorStop(0, "rgba(40, 40, 60, 0)");
  shade.addColorStop(1, "rgba(40, 40, 60, 0.3)");
  pen.fillStyle = shade;
  pen.fillRect(-300, -560, 600, 360);
  var glow = pen.createLinearGradient(0, -548, 0, -470);    // a little light along the back
  glow.addColorStop(0, "rgba(255, 255, 255, 0.14)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  pen.fillStyle = glow;
  pen.fillRect(-300, -560, 600, 100);
  pen.strokeStyle = fold;
  pen.lineWidth = 1.6 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(168, -500);                            // the shoulder: a line down from the withers to the fore leg
  pen.bezierCurveTo(110, -470, 78, -390, 92, -300);
  pen.moveTo(-96, -528);                            // the hip, down to the hind leg
  pen.bezierCurveTo(-70, -470, -86, -380, -112, -310);
  for (n = 0; n < 3; n++) {                         // folds of hide on the flank and behind the shoulder
    pen.moveTo(-232 + n * 14, -330 - n * 10);
    pen.quadraticCurveTo(-222 + n * 14, -376 - n * 6, -238 + n * 14, -420 - n * 6);
    pen.moveTo(-20 + n * 26, -250);
    pen.quadraticCurveTo(-10 + n * 26, -278, -24 + n * 26, -304);
  }
  pen.stroke();
  if (look.howdah) {                                // the two girths that hold the howdah, round the belly
    pen.strokeStyle = "#6a4a2a";
    pen.lineWidth = 7;
    pen.beginPath();
    pen.moveTo(-96, -548);
    pen.quadraticCurveTo(-116, -380, -88, -214);
    pen.moveTo(62, -548);
    pen.quadraticCurveTo(88, -390, 70, -216);
    pen.stroke();
  }
  pen.restore();
  if (look.cloth) {                                 // a cloth over the back, with a gold border and a fringe
    pen.beginPath();
    pen.moveTo(-156, -532);
    pen.bezierCurveTo(-60, -556, 64, -552, 132, -522);
    pen.lineTo(140, -372);
    pen.quadraticCurveTo(-10, -350, -164, -372);
    pen.closePath();
    shape(look.cloth);
    pen.strokeStyle = STYLE.gold;
    pen.lineWidth = 7;
    pen.beginPath();
    pen.moveTo(-160, -386);
    pen.quadraticCurveTo(-10, -364, 136, -386);
    pen.stroke();
    pen.lineWidth = 2;
    pen.beginPath();
    pen.moveTo(-159, -400);
    pen.quadraticCurveTo(-10, -378, 135, -400);
    for (n = 0; n <= 15; n++) {
      var hem = -372 + 11 * Math.sin(n / 15 * Math.PI);
      pen.moveTo(-160 + n * 19.8, hem);
      pen.lineTo(-160 + n * 19.8, hem + 22);
    }
    pen.stroke();
  }
  if (look.howdah) {                                // a howdah: a seat of wood on the back, a cushion in it, a rail round it and a high back
    pen.beginPath();                                // the cushion
    pen.moveTo(-122, -560);
    pen.quadraticCurveTo(-20, -574, 88, -556);
    pen.lineTo(88, -590);
    pen.quadraticCurveTo(-20, -606, -122, -594);
    pen.closePath();
    shape("#c8752a");
    pen.beginPath();                                // the high back, behind the one who rides
    pen.moveTo(-136, -556);
    pen.bezierCurveTo(-150, -610, -150, -660, -128, -690);
    pen.bezierCurveTo(-110, -670, -106, -610, -110, -558);
    pen.closePath();
    shape(wood);
    hose(-132, -552, 96, -546, -0.04, 10, wood);    // the sill
    for (n = 1; n < 4; n++) {                       // three posts and the rail on them
      hose(-122 + n * 71, -550, -122 + n * 71, -598, 0, 6, wood);
      oval(-122 + n * 71, -602, 5.5, 5.5, STYLE.gold);
    }
    hose(-118, -604, 94, -598, -0.04, 6, wood);
  }
  var nod = 0.03 * Math.sin(clock * 1.4 + seed) - 0.04 * beat - 0.14 * lift   // the head tips back as the trunk lifts,
            + (walk ? 0.025 * Math.sin(look.step * Math.PI * 4) : 0)         // and nods twice in a stride,
            + (e ? 0.5 * e.nod - 0.1 * e.raise + 0.04 * e.shake : 0);       // and a feeling lifts it or hangs it
  pen.save();                                       // the head, turning a little about the neck
  pen.translate(206, -456);
  pen.rotate(nod);
  var flap = 0.1 * (e ? 1 + e.wag : 1) * Math.sin(clock * 2.6 + seed * 2) + 0.22 * beat + (walk ? 0.06 * Math.sin(look.step * Math.PI * 4 + 1) : 0)
           + (e ? 0.22 * e.f.anger + 0.12 * e.f.wonder - 0.08 * e.f.sad : 0);   // the ears flare in anger, lie close in sadness
  var shut = Math.sin(clock * 0.7 + seed * 5) > 0.985;
  function tusk(dx, dy, ivory, rings) {             // a tusk: forward and down, and up again at its point
    pen.beginPath();
    pen.moveTo(112 + dx, 42 + dy);
    pen.bezierCurveTo(150 + dx, 120 + dy, 230 + dx, 140 + dy, 292 + dx, 86 + dy);
    pen.bezierCurveTo(236 + dx, 116 + dy, 176 + dx, 96 + dy, 134 + dx, 30 + dy);
    pen.closePath();
    shape(ivory);
    if (rings) { elephantRings([[128 + dx, 86 + dy, 172 + dx, 58 + dy], [150 + dx, 110 + dy, 190 + dx, 80 + dy]]); }
  }
  if (look.tusks !== false) { tusk(20, -10, "#e9dcc0", look.cloth); }   // the far tusk, behind the trunk. One that is dressed has gold on its tusks
  // The trunk: a row of points, each turned a little from the one before.
  // Hanging, it turns in slowly and its end curls in. Lifted, it turns up in
  // its first few points, close before the face, and its end curls forward.
  // In a walk it swings. It does not go under the ground: what reaches the
  // ground lies along it, and its end lifts.
  var chain = [[136, 6]], angle = 1.12, count = 17, floor = 456 + rise - 22;
  for (n = 1; n <= count; n++) {
    angle += 0.045 - lift * (n <= 5 ? 0.5 : 0.12) + (n > 12 ? 0.2 * (1 - lift) + 0.42 * lift : 0)
             + 0.004 * n * Math.sin(clock * 1.7 + n * 0.5 + seed) + (walk ? 0.012 * Math.sin(look.step * Math.PI * 4 - n * 0.35) : 0);
    var cx = chain[n - 1][0] + Math.cos(angle) * 26, cy = chain[n - 1][1] + Math.sin(angle) * 26;
    if (cy > floor) { cy = floor; angle = n > 13 ? -0.3 * (n - 13) : 0.06; }
    chain.push([cx, cy]);
  }
  pen.save();                                       // the lower lip, behind the trunk: it drops as the mouth opens
  pen.translate(88, 60);
  pen.rotate(0.55 * open);
  if (open > 0.03) {                                // the inside of the mouth
    pen.beginPath();
    pen.moveTo(-4, -10);
    pen.lineTo(70, -22);
    pen.lineTo(60, 20);
    pen.closePath();
    pen.fillStyle = "#b8505a";
    pen.fill();
  }
  pen.beginPath();
  pen.moveTo(-10, -4);
  pen.quadraticCurveTo(30, 0, 70, 30);
  pen.quadraticCurveTo(28, 34, -12, 14);
  pen.closePath();
  shape(pink);
  pen.restore();
  pen.beginPath();                                  // the skull: a high dome with two bumps, a brow, a cheek. It has no lip: that is the piece above
  pen.moveTo(-44, 68);
  pen.bezierCurveTo(-78, -30, -52, -134, 12, -142);
  pen.quadraticCurveTo(38, -126, 64, -140);
  pen.bezierCurveTo(128, -138, 178, -74, 180, -12);
  pen.bezierCurveTo(182, 30, 150, 64, 112, 74);
  pen.quadraticCurveTo(30, 100, -44, 68);
  pen.closePath();
  shape(colour);
  elephantTrunk(chain, 50, 13, colour, 4);          // over the skull, with no line across its root: the brow runs on into it
  pen.strokeStyle = fold;                           // the hollow of the temple, and a fold where the trunk begins
  pen.lineWidth = 1.6 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(40, -112);
  pen.quadraticCurveTo(66, -92, 60, -62);
  pen.moveTo(160, -4);
  pen.quadraticCurveTo(128, 6, 110, 34);
  pen.stroke();
  pen.fillStyle = pink;                             // freckles on the brow and where the trunk begins
  for (n = 0; n < 11; n++) {
    pen.beginPath();
    pen.arc(104 + dice(n + 45) * 62, -80 + dice(n + 55) * 110, 2.2, 0, 7);
    pen.fill();
  }
  if (look.cloth) {                                 // a cloth on the brow, from the top of the head to where the trunk begins, with a gold edge and a tassel
    pen.beginPath();
    pen.moveTo(40, -141);
    pen.quadraticCurveTo(70, -147, 100, -133);
    pen.bezierCurveTo(150, -119, 181, -70, 182, -18);
    pen.lineTo(158, -12);
    pen.bezierCurveTo(152, -58, 112, -104, 40, -141);
    pen.closePath();
    shape(look.cloth);
    pen.strokeStyle = STYLE.gold;
    pen.lineWidth = 4;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(164, -20);
    pen.bezierCurveTo(158, -60, 122, -102, 60, -132);
    pen.moveTo(160, -12);
    pen.lineTo(158, 12);
    pen.stroke();
    oval(158, 16, 5, 6, STYLE.gold);
  }
  if (look.tusks !== false) { tusk(0, 0, "#fff6ea", look.cloth); }      // the near tusk
  pen.save();                                       // the eye
  pen.translate(112, -40);
  elephantEye(ink, shut, e, colour);
  pen.restore();
  pen.save();                                       // the ear: its top folds over, it narrows to a lobe that hangs, and it flaps
  pen.translate(8, -78);
  pen.rotate(flap);
  pen.beginPath();
  pen.moveTo(12, -8);
  pen.bezierCurveTo(-40, -48, -122, -22, -116, 52);
  pen.bezierCurveTo(-112, 108, -62, 156, -24, 132);
  pen.bezierCurveTo(2, 114, 22, 70, 26, 34);
  pen.quadraticCurveTo(28, 6, 12, -8);
  pen.closePath();
  shape(blend(colour, "#ffffff", 0.08));
  pen.strokeStyle = pink;                           // the edge of the lobe is pink, and freckled
  pen.lineWidth = 5;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(-110, 78);
  pen.bezierCurveTo(-96, 124, -58, 146, -28, 128);
  pen.stroke();
  pen.fillStyle = pink;
  for (n = 0; n < 7; n++) {
    pen.beginPath();
    pen.arc(-92 + dice(n + 65) * 64, 64 + dice(n + 75) * 50, 2.4, 0, 7);
    pen.fill();
  }
  pen.strokeStyle = fold;                           // the fold along its top
  pen.lineWidth = 1.6 * FINE;
  pen.beginPath();
  pen.moveTo(6, 0);
  pen.bezierCurveTo(-36, -30, -96, -14, -100, 36);
  pen.stroke();
  pen.restore();
  var crown = pen.getTransform().transformPoint(new DOMPoint(38, -140));
  pen.restore();
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
  // The seat: in the howdah, on its cushion; or else behind the ears, where a mahout sits.
  return {seat: [x + (look.howdah ? -14 : 84) * size * face, y - ((look.howdah ? 592 : 528) + rise) * size], head: [crown.x, crown.y]};
}

// A water buffalo, standing on (x, y). Everything about it is in "look"
// (see BEAST_KEYS above). It gives back {seat, head}: where a rider sits on
// its back, and the top of its head, in the scene.
function buffalo(x, y, look) {
  checkNames("The buffalo's name", look, BEAST_KEYS);
  var size = (look.size || 1) * GAITS.buffalo[0], face = look.face || 1, colour = look.colour || "#55565f", ink = inkFor(colour), n;
  var walk = look.step !== undefined, bob = walk ? 4 * Math.abs(Math.sin(look.step * Math.PI * 2)) : 0;
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0;
  var e = look.feel !== undefined ? creatureFeel(look, clock + x * 0.01) : null;   // a feeling: the eye, the head, the ear, the tail
  FINE = Math.min(1, Math.pow(size, -0.7));
  LINE = STYLE.line * FINE;
  pen.fillStyle = "rgba(70, 45, 30, 0.2)";
  pen.beginPath();
  pen.ellipse(x + 30 * size * face, y + 5, 250 * size, 20 * size, 0, 0, 7);
  pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  if (look.front) {
    var high = buffaloFront(look, colour);
    pen.restore();
    FINE = 1;
    LINE = STYLE.line;
    return {seat: [x, y - (high - 16) * size], head: [x, y - high * size]};
  }
  var legs = [[-140, -186, 0, -1, false], [118, -186, 0.25, 1, false], [-116, -190, 0.5, -1, true], [142, -190, 0.75, 1, true]];
  function foot(ax, ay, skin, lifted) {             // a cloven hoof: two dark toes
    pen.save();
    pen.translate(ax, ay);
    pen.rotate(lifted ? 0.5 : 0);
    for (var toe = 0; toe < 2; toe++) {
      pen.beginPath();
      pen.moveTo(-12 + toe * 13, -4);
      pen.lineTo(-14 + toe * 13, 14);
      pen.lineTo(6 + toe * 14, 14);
      pen.quadraticCurveTo(6 + toe * 13, 2, 0 + toe * 13, -4);
      pen.closePath();
      shape("#2a2a30");
    }
    pen.restore();
  }
  beastLegs(legs, true, look, [92, 86, 14], [27, 18, 15], colour, GAITS.buffalo[1], 24, foot);
  pen.translate(0, -bob);
  var swing = Math.sin(clock * 2.4 * (e ? 1 + e.wag : 1) + x * 0.01) * 14 * (e ? 1 + e.wag : 1) + 16 * beat;
  hose(-204, -246, -232 + swing, -120, 0.1, 8, colour);       // the tail, and its tuft
  hose(-232 + swing, -120, -236 + swing * 1.3, -84, 0.05, 13, "#2a2a30");
  pen.beginPath();                                  // the body: a barrel, the withers higher than the hips
  pen.moveTo(-205, -230);
  pen.bezierCurveTo(-215, -300, -150, -318, -60, -300);
  pen.bezierCurveTo(20, -286, 80, -330, 150, -310);
  pen.bezierCurveTo(205, -280, 215, -200, 170, -160);
  pen.bezierCurveTo(90, -116, -90, -112, -160, -140);
  pen.bezierCurveTo(-195, -160, -200, -200, -205, -230);
  pen.closePath();
  shape(colour);
  pen.save();
  pen.clip();
  var shade = pen.createLinearGradient(0, -260, 0, -120);
  shade.addColorStop(0, "rgba(20, 20, 30, 0)");
  shade.addColorStop(1, "rgba(20, 20, 30, 0.32)");
  pen.fillStyle = shade;
  pen.fillRect(-240, -340, 480, 240);
  pen.restore();
  pen.translate(0, bob);
  beastLegs(legs, false, look, [92, 86, 14], [27, 18, 15], colour, GAITS.buffalo[1], 24, foot);
  pen.translate(0, -bob);
  var nod = 0.04 * Math.sin(clock * 1.5 + x * 0.01) + 0.06 * beat + (walk ? 0.03 * Math.sin(look.step * Math.PI * 4) : 0)
          + (e ? 0.5 * e.nod - 0.12 * e.raise + 0.04 * e.shake : 0);
  pen.save();                                       // the neck and the head, carried forward and low
  pen.translate(150, -262);
  pen.rotate(nod);
  function horn(dx, dy, pale) {                     // one horn: a crescent that sweeps back and up from the head
    pen.beginPath();
    pen.moveTo(96 + dx, -44 + dy);
    pen.bezierCurveTo(30 + dx, -50 + dy, -66 + dx, -38 + dy, -104 + dx, -122 + dy);   // back along the neck, then up to the tip
    pen.bezierCurveTo(-52 + dx, -78 + dy, 40 + dx, -90 + dy, 112 + dx, -66 + dy);
    pen.closePath();
    shape(pale);
    pen.strokeStyle = inkFor(pale);                 // the rings of the horn
    pen.lineWidth = 1.3 * FINE;
    pen.beginPath();
    for (var ring = 0; ring < 5; ring++) {
      pen.moveTo(72 - ring * 22 + dx, -50 - ring * 2 + dy);
      pen.lineTo(80 - ring * 22 + dx, -72 - ring * 3 + dy);
    }
    pen.stroke();
  }
  horn(14, -8, "#8a857a");                          // the far horn
  pen.beginPath();                                  // the neck: colour first, with no line where it joins the shoulder,
  pen.moveTo(-40, -50);
  pen.quadraticCurveTo(40, -66, 100, -52);
  pen.lineTo(96, 40);
  pen.quadraticCurveTo(30, 72, -40, 84);
  pen.closePath();
  pen.fillStyle = colour;
  pen.fill();
  pen.strokeStyle = ink;                            // then the line along its top and under its throat
  pen.lineWidth = LINE;
  pen.lineCap = "round";
  heavy(ink);
  pen.beginPath();
  pen.moveTo(-30, -51);
  pen.quadraticCurveTo(40, -66, 100, -52);
  pen.moveTo(96, 40);
  pen.quadraticCurveTo(30, 72, -30, 82);
  pen.stroke();
  light();
  pen.strokeStyle = blend(colour, "#e9e2d0", 0.7);  // the pale band under the throat
  pen.lineWidth = 9;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(40, 52);
  pen.quadraticCurveTo(66, 44, 86, 30);
  pen.stroke();
  pen.beginPath();                                  // the head: a long wedge, the muzzle broad
  pen.moveTo(84, -62);
  pen.bezierCurveTo(124, -66, 168, -40, 204, 6);
  pen.bezierCurveTo(226, 32, 216, 62, 188, 64);
  pen.bezierCurveTo(150, 66, 110, 54, 88, 36);
  pen.quadraticCurveTo(70, -10, 84, -62);
  pen.closePath();
  shape(colour);
  pen.beginPath();                                  // the muzzle, paler, with a nostril and the line of the mouth
  pen.ellipse(198, 38, 24, 26, 0.3, 0, 7);
  shape(blend(colour, "#b0a8a0", 0.45));
  oval(206, 30, 5, 3.5, "#1f1a1a");
  pen.strokeStyle = ink;
  pen.lineWidth = 2 * FINE;
  pen.beginPath();
  pen.moveTo(176, 54);
  pen.quadraticCurveTo(196, 62, 214, 50);
  pen.stroke();
  if (e) { creatureEye(136, -22, 8, 7, e, {skin: colour, iris: "#1f1a1a", ink: ink}); }   // a feeling's eye
  else {
    oval(136, -22, 8, 7, "#fff6ea");                // the eye
    oval(138, -21, 4.5, 5, "#1f1a1a");
  }
  pen.save();                                       // the ear, behind the horn, held out to the side
  pen.translate(84, -34);
  pen.rotate(-0.5 + 0.12 * Math.sin(clock * 2.8 + x * 0.02) + 0.3 * beat + (e ? 0.4 * e.ears : 0));   // a feeling droops it, or lifts it
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.quadraticCurveTo(-34, -20, -62, 6);
  pen.quadraticCurveTo(-30, 26, 0, 14);
  pen.closePath();
  shape(blend(colour, "#000000", 0.12));
  pen.restore();
  horn(0, 0, "#a8a294");                            // the near horn
  if (look.rope) {                                  // a rope through the nose, its end hanging and swinging
    pen.strokeStyle = "#c9a878";
    pen.lineWidth = 4;
    pen.beginPath();
    pen.moveTo(206, 32);
    pen.quadraticCurveTo(170, 96, 150 + swing * 0.5, 170);
    pen.stroke();
  }
  var crown = pen.getTransform().transformPoint(new DOMPoint(96, -62));
  pen.restore();
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
  return {seat: [x - 20 * size * face, y - (296 + bob) * size], head: [crown.x, crown.y]};
}

// ---------- a cat and a tiger ----------
// A cat and a tiger are one animal in two sizes, and are drawn by one rule
// with two sets of measures (FELINES). What each is, in rules:
//
//   The cat is the cat of this country, the Siamese: a pale body with dark
//   points, which are the face, the ears, the legs and the tail, and blue
//   eyes. Large pointed ears, a small face, a long thin tail held up. It was
//   read from a picture the owner gave of three cats in a room: one pale with
//   dark points sitting, one white reaching up, one dark and stretching.
//   "colour" and "points" make the other two: a white cat has both white.
//   The tiger was read from a drawing the owner gave, two tigers in black
//   line on gold paper, as Thai drawings have them: stripes that are bold
//   and curved and lie close, each thick at the back and running to a point;
//   a tuft like a small flame at each joint; a long ringed tail whose end
//   curls. Neither picture is copied, and the writing in the drawing is no
//   part of this.
//
//   Both walk as the other beasts do (step), sit (sit: true), swing their
//   tails, and open their mouths (mouth, 0 to 1).
var FELINES = {
  //      how large; body's length; how much lower it stands than a tiger (its legs are that much shorter);
  //      how far its belly hangs; head's size and how far up and forward it is; the ear [half-width, height, pointed];
  //      the legs' half-widths; a paw's half-length;
  //      the tail [points, half-width at its root and tip, the way it leaves, how each point turns, how much more the last three turn]
  cat: {scale: 0.3, long: 0.9, low: 52, belly: 0, head: 1.18, headAt: [236, -350], ear: [30, 70, true], legs: [20, 13, 10], paw: 20,
        tail: [11, 12, 6, Math.PI + 1.0, 0.07, 0.12], reach: 86, lift: 24},
  tiger: {scale: 0.9, long: 1, low: 0, belly: 26, head: 1.15, headAt: [276, -310], ear: [26, 30, false], legs: [36, 26, 20], paw: 30,
          tail: [11, 16, 9, Math.PI - 0.7, 0.13, 0.4], reach: 112, lift: 30}
};

// A colour that can be seen through: "alpha" of it, 0 to 1.
function beastSheer(colour, alpha) {
  var paint = parseInt(colour.slice(1), 16);
  return "rgba(" + ((paint >> 16) & 255) + ", " + ((paint >> 8) & 255) + ", " + (paint & 255) + ", " + alpha + ")";
}

// One tuft like a small flame: three points that lean the way x goes.
function beastTuft(x, y, turn, size, colour) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  for (var n = -1; n <= 1; n++) {
    pen.save();
    pen.rotate(n * 0.5);
    pen.beginPath();
    pen.moveTo(0, -size * 0.22);
    pen.quadraticCurveTo(size * 0.5, -size * 0.36, size * (n ? 0.74 : 1), n * size * 0.1);
    pen.quadraticCurveTo(size * 0.5, size * 0.12, 0, size * 0.22);
    pen.closePath();
    shape(colour, 1.4 * FINE);
    pen.restore();
  }
  pen.restore();
}

// A feline's head in profile, looking along x, about its middle. "open" is
// how far the mouth is open; "c" the colours; "m" the measures (FELINES).
function felineHead(kind, open, c, m, seed, e) {
  var blink = Math.sin(clock * 0.9 + seed) > 0.985, twitch = 0.08 * Math.sin(clock * 3.1 + seed), n;
  if (e) { twitch += 0.6 * Math.min(0, e.ears) + 0.12 * Math.max(0, e.ears); }   // a feeling lays the ears back (anger, fear, sadness) or pricks them
  function ear(dx, dy, skin) {                      // one ear: a tall point for the cat, a low round one for the tiger
    pen.save();
    pen.translate(dx, dy);
    pen.rotate(twitch);
    pen.beginPath();
    pen.moveTo(-m.ear[0], 8);
    if (m.ear[2]) { pen.quadraticCurveTo(-m.ear[0] * 0.5, -m.ear[1] * 0.7, 2, -m.ear[1]); pen.quadraticCurveTo(m.ear[0] * 0.8, -m.ear[1] * 0.5, m.ear[0], 8); }
    else { pen.bezierCurveTo(-m.ear[0] * 1.1, -m.ear[1] * 1.3, m.ear[0] * 1.1, -m.ear[1] * 1.3, m.ear[0], 8); }
    pen.closePath();
    shape(skin);
    pen.beginPath();                                // its inside
    pen.moveTo(-m.ear[0] * 0.45, 4);
    pen.quadraticCurveTo(0, -m.ear[1] * 0.74, m.ear[0] * 0.5, 4);
    pen.closePath();
    pen.fillStyle = kind === "cat" ? blend(skin, "#e9a0a8", 0.45) : c.pale;
    pen.fill();
    pen.restore();
  }
  ear(8, -58, kind === "cat" ? blend(c.points, "#000000", 0.2) : blend(c.body, "#1c1c22", 0.25));   // the far ear
  // The lower jaw is a piece of its own, behind the skull, and it turns about
  // the corner of the mouth. So that there is one jaw and not two, the skull
  // gives up its own chin as the mouth opens ("gape"): its lower edge rises
  // to the upper lip, and the piece that turns is all the jaw there is.
  var gape = clamp(open / 0.15), drop = 0.85 * open;
  if (open > 0.03) {                                // the inside of the mouth, and the lower jaw that drops
    var tipX = 36 + 48 * Math.cos(drop), tipY = 26 + 48 * Math.sin(drop);   // the tip of the jaw
    pen.beginPath();                                // the inside: from the corner of the mouth to the lip, and in a hollow curve to the tip of the jaw
    pen.moveTo(30, 22);
    pen.lineTo(84, 15);
    pen.quadraticCurveTo((84 + tipX) / 2 - 16, (15 + tipY) / 2, tipX, tipY);
    pen.closePath();
    pen.fillStyle = "#a8322c";
    pen.fill();
    pen.beginPath();                                // a tooth above
    pen.moveTo(74, 16);
    pen.lineTo(79, 16 + 16 * open);
    pen.lineTo(84, 15);
    pen.fillStyle = "#fff6ea";
    pen.fill();
    pen.save();
    pen.translate(36, 26);
    pen.rotate(drop);
    pen.beginPath();
    pen.moveTo(-20, 0);
    pen.quadraticCurveTo(20, -4, 50, 0);
    pen.quadraticCurveTo(54, 10, 40, 14);
    pen.quadraticCurveTo(10, 20, -20, 16);
    pen.closePath();
    shape(kind === "cat" ? c.points : c.pale);
    pen.beginPath();
    pen.moveTo(34, -1);
    pen.lineTo(38, -13);
    pen.lineTo(43, -1);
    pen.fillStyle = "#fff6ea";
    pen.fill();
    pen.restore();
  }
  pen.beginPath();                                  // the skull: round, with a short muzzle
  pen.moveTo(-56, 22);
  pen.bezierCurveTo(-78, -40, -30, -78, 20, -68);
  pen.bezierCurveTo(50, -62, 70, -38, 78, -14);
  pen.quadraticCurveTo(98, -8, 96, 8);
  pen.quadraticCurveTo(mix(94, 92, gape), mix(26, 18, gape), 70, mix(34, 17, gape));   // the chin, or with the mouth open the upper lip
  pen.quadraticCurveTo(30, mix(50, 20, gape), -20, 46);                                // and back under the cheek
  pen.quadraticCurveTo(-50, 42, -56, 22);
  pen.closePath();
  shape(c.body);
  pen.save();
  pen.clip();                                       // what is painted on the face stays on it
  if (kind === "cat") {                             // the mask: darkest at the nose, and gone by the ears
    var mask = pen.createRadialGradient(72, 2, 6, 60, -4, 84);
    mask.addColorStop(0, c.points);
    mask.addColorStop(0.55, beastSheer(c.points, 0.85));
    mask.addColorStop(1, beastSheer(c.points, 0));
    pen.fillStyle = mask;
    pen.fillRect(-90, -90, 200, 150);
  } else {                                          // the tiger: a pale muzzle and cheek, and stripes on the brow and the cheek
    pen.fillStyle = c.pale;
    pen.beginPath();
    pen.ellipse(66, 22, 36, 22, 0.2, 0, 7);
    pen.ellipse(-16, 34, 44, 20, 0.1, 0, 7);
    pen.ellipse(44, -34, 16, 8, -0.3, 0, 7);
    pen.fill();
    pen.fillStyle = c.stripes;
    pen.beginPath();
    for (n = 0; n < 4; n++) {                       // on the brow, running back
      pen.moveTo(40 - n * 20, -70 + n * 2);
      pen.quadraticCurveTo(30 - n * 20, -52, 36 - n * 20, -36 + n * 3);
      pen.quadraticCurveTo(24 - n * 20, -52, 28 - n * 20, -72 + n * 2);
      pen.closePath();
    }
    for (n = 0; n < 3; n++) {                       // on the cheek, running back from the eye
      pen.moveTo(8, -2 + n * 14);
      pen.quadraticCurveTo(-24, -8 + n * 14, -60, 6 + n * 12);
      pen.quadraticCurveTo(-24, 0 + n * 14, 8, 6 + n * 14);
      pen.closePath();
    }
    pen.fill();
  }
  pen.restore();
  if (kind === "tiger") {                           // the ruff of the cheek: a tuft that points back and down
    beastTuft(-34, 30, 2.5, 46, c.pale);
  }
  ear(-14, -60, kind === "cat" ? c.points : c.body);   // the near ear
  if (e) {                                          // a feeling's eye: the almond in its own colour, under the lid of the face's colour
    creatureEye(40, -18, 15, kind === "cat" ? 9.5 : 8, e, {turn: -0.18, skin: kind === "cat" ? c.points : c.body, ball: c.eye,
                                                         pupil: "#1f1a1a", slit: kind === "cat", ink: inkFor(kind === "cat" ? c.points : c.body), shut: blink});
  } else {
    pen.beginPath();                                // the eye: an almond, blue for the cat, yellow for the tiger
    pen.ellipse(40, -18, 15, blink ? 1.5 : kind === "cat" ? 9.5 : 8, -0.18, 0, 7);
    shape(c.eye, 1.6 * FINE);
    if (!blink) { oval(42, -18, kind === "cat" ? 3 : 4.5, kind === "cat" ? 7.5 : 5.5, "#1f1a1a"); }
  }
  pen.strokeStyle = kind === "cat" ? inkFor(c.points) : c.stripes;
  pen.lineCap = "round";
  if (kind === "tiger") {                           // a heavy brow, drawn down toward the nose (raised or turned by a feeling)
    pen.save();
    if (e) {
      pen.translate(41, -30 - 5 * e.brow[0] + 5 * e.brow[1]);
      pen.rotate(0.8 * e.brow[1]);
      pen.translate(-41, 30);
    }
    pen.lineWidth = 4 * FINE;
    pen.beginPath();
    pen.moveTo(22, -32);
    pen.quadraticCurveTo(42, -34, 60, -22);
    pen.stroke();
    pen.restore();
  }
  pen.beginPath();                                  // the nose, and the line of the mouth
  pen.moveTo(84, -8);
  pen.lineTo(98, -4);
  pen.lineTo(88, 6);
  pen.closePath();
  pen.fillStyle = kind === "cat" ? "#3a2622" : "#c9706a";
  pen.fill();
  pen.lineWidth = 1.8 * FINE;
  pen.beginPath();
  pen.moveTo(88, 6);
  pen.quadraticCurveTo(84, 18, 68, 18);
  pen.quadraticCurveTo(56, 18, 48, 10 - (e ? 7 * e.grin : 0));   // its corner up in a smile, down in a frown
  pen.stroke();
  pen.strokeStyle = "rgba(255, 250, 240, 0.95)";    // the whiskers
  pen.lineWidth = 1.5 * FINE;
  pen.beginPath();
  for (n = -1; n <= 1; n++) {
    pen.moveTo(72, 14 + n * 3);
    pen.quadraticCurveTo(104, 12 + n * 12, 132, 4 + n * 22 + 3 * Math.sin(clock * 5 + n + seed));
  }
  pen.stroke();
}

// A feline: a cat or a tiger, standing on (x, y). "kind" is "cat" or
// "tiger"; "c" its colours. It gives back {seat, head}, points of the scene.
function feline(kind, x, y, look, c) {
  var m = FELINES[kind], size = (look.size || 1) * m.scale, face = look.face || 1, L = m.long, n;
  var walk = look.step !== undefined && !look.sit, bob = walk ? 5 * Math.abs(Math.sin(look.step * Math.PI * 2)) : 0;
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0, open = clamp(look.mouth || 0);
  var legSkin = kind === "cat" ? c.points : c.body, ink = inkFor(c.body), seed = x * 0.013;
  var e = look.feel !== undefined ? creatureFeel(look, clock + seed) : null;   // a feeling: the head, the ears, the eye, the mouth, the tail
  if (e) { open = e.jaw(open); }
  FINE = Math.min(1, Math.pow(Math.max(0.5, size), -0.7));
  LINE = STYLE.line * FINE / Math.max(0.35, Math.min(1, size * 1.6));   // a small animal is not inked with a thick pen
  pen.fillStyle = "rgba(70, 45, 30, 0.2)";
  pen.beginPath();
  pen.ellipse(x + (look.sit ? 10 : 30) * size * face, y + 5 * size, (look.sit ? 170 : 290) * size, 22 * size, 0, 0, 7);
  pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  function paw(ax, ay, skin, lifted, kx, ky, hx, hy) {   // a paw at an ankle; and, on a tiger, the rings of the leg above it
    if (kind === "tiger" && kx !== undefined) {
      pen.strokeStyle = c.stripes;
      pen.lineWidth = 7;
      pen.lineCap = "round";
      pen.beginPath();
      var bones = [[hx, hy, kx, ky, m.legs[0]], [kx, ky, ax, ay, m.legs[1]]];
      for (var b = 0; b < 2; b++) {
        var far = Math.sqrt(Math.pow(bones[b][2] - bones[b][0], 2) + Math.pow(bones[b][3] - bones[b][1], 2)) || 1;
        var ux = (bones[b][2] - bones[b][0]) / far, uy = (bones[b][3] - bones[b][1]) / far;
        for (var k = 1; k * 26 < far - 8; k++) {
          var px = bones[b][0] + ux * k * 26, py = bones[b][1] + uy * k * 26, half = bones[b][4] * 0.62;
          pen.moveTo(px - uy * half, py + ux * half);
          pen.lineTo(px + uy * half * 0.3, py - ux * half * 0.3);
        }
      }
      pen.stroke();
    }
    pen.save();
    pen.translate(ax, ay);
    pen.rotate(lifted ? 0.5 : 0);
    pen.beginPath();
    pen.ellipse(m.paw * 0.4, 4, m.paw, m.paw * 0.5, 0, 0, 7);
    shape(kind === "tiger" ? blend(skin, c.pale, 0.5) : skin);
    pen.strokeStyle = inkFor(skin);
    pen.lineWidth = 1.3 * FINE;
    pen.beginPath();
    for (var toe = 0; toe < 2; toe++) {
      pen.moveTo(m.paw * (0.7 + toe * 0.3), 0);
      pen.lineTo(m.paw * (0.76 + toe * 0.3), m.paw * 0.36);
    }
    pen.stroke();
    pen.restore();
  }
  function tail(rootX, rootY, leaves, curl, end, sway) {   // the tail: a row of points, each turned from the one before; it sways
    var points = [[rootX, rootY]], angle = leaves, edges = [[], []], count = m.tail[0], k;
    for (k = 1; k <= count; k++) {
      angle += curl + sway * (0.1 * Math.sin(clock * 2.2 + k * 0.55 + seed) * (k / count) + 0.05 * beat)
               + (k > count - 3 ? end : 0);                                       // the end of a tail curls more
      points.push([points[k - 1][0] + Math.cos(angle) * 26, points[k - 1][1] + Math.sin(angle) * 26]);
    }
    for (k = 0; k <= count; k++) {
      var a = points[Math.max(0, k - 1)], b = points[Math.min(count, k + 1)];
      var far = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) || 1, half = mix(m.tail[1], m.tail[2], k / count);
      edges[0].push([points[k][0] - (b[1] - a[1]) / far * half, points[k][1] + (b[0] - a[0]) / far * half]);
      edges[1].push([points[k][0] + (b[1] - a[1]) / far * half, points[k][1] - (b[0] - a[0]) / far * half]);
    }
    var from = Math.atan2(points[1][1] - rootY, points[1][0] - rootX);
    var to = Math.atan2(points[count][1] - points[count - 1][1], points[count][0] - points[count - 1][0]);
    pen.beginPath();
    for (k = 0; k <= count; k++) { pen.lineTo(edges[0][k][0], edges[0][k][1]); }
    pen.arc(points[count][0], points[count][1], m.tail[2], to + Math.PI / 2, to - Math.PI / 2, true);   // a round tip
    for (k = count; k >= 0; k--) { pen.lineTo(edges[1][k][0], edges[1][k][1]); }
    pen.arc(rootX, rootY, m.tail[1], from - Math.PI / 2, from + Math.PI / 2, true);                     // and a round root
    pen.closePath();
    shape(legSkin);
    if (kind === "tiger") {                         // its rings
      pen.fillStyle = c.stripes;
      pen.beginPath();
      for (k = 1; k < count; k += 2) {
        pen.moveTo(edges[0][k][0], edges[0][k][1]);
        pen.lineTo(edges[0][k + 1][0], edges[0][k + 1][1]);
        pen.lineTo(edges[1][k + 1][0], edges[1][k + 1][1]);
        pen.lineTo(edges[1][k][0], edges[1][k][1]);
        pen.closePath();
      }
      pen.fill();
    }
  }
  function stripes(left, right, top, bottom, chest) {   // a tiger's stripes, inside the shape just drawn: thick at the back, running to a point
    pen.fillStyle = c.pale;                         // the belly is pale; or, on one that sits, the chest
    pen.beginPath();
    if (chest) { pen.ellipse(chest[0], chest[1], chest[2], chest[3], 0, 0, 7); }
    else { pen.ellipse((left + right) / 2, bottom + 14, (right - left) * 0.44, (bottom - top) * 0.24, 0, 0, 7); }
    pen.fill();
    pen.fillStyle = c.stripes;
    pen.beginPath();
    for (var sx = left + 14, k = 0; sx < right; sx += 30 + 8 * dice(k + 3), k++) {
      var lean = 14 * Math.sin(k * 1.7), deep = (bottom - top) * (0.5 + 0.22 * dice(k + 9));
      pen.moveTo(sx - 9, top - 12);
      pen.quadraticCurveTo(sx - 20 + lean, top + deep * 0.5, sx + lean * 0.6, top + deep);
      pen.quadraticCurveTo(sx - 2 + lean, top + deep * 0.5, sx + 9, top - 12);
      pen.closePath();
      if (k % 2) {                                  // and a shorter one between, up from the belly
        pen.moveTo(sx + 12, bottom + 14);
        pen.quadraticCurveTo(sx + 22 - lean, bottom - deep * 0.35, sx + 16, bottom - deep * 0.6);
        pen.quadraticCurveTo(sx + 12 - lean, bottom - deep * 0.3, sx + 24, bottom + 14);
        pen.closePath();
      }
    }
    pen.fill();
  }
  var B = m.belly;
  function sitShape() {                             // the outline of one that sits: the haunch on the ground, the back rising to the shoulders
    pen.beginPath();
    pen.moveTo(-112, 0);
    pen.bezierCurveTo(-152, -70, -122, -170, -40, -232);
    pen.bezierCurveTo(10, -282, 60, -302, 100, -292);
    pen.bezierCurveTo(142, -272, 152, -200, 124, -150);
    pen.bezierCurveTo(114, -90, 104, -40, 100, 0);
    pen.closePath();
  }
  function standShape() {                           // the outline of one that stands: a long back, a deep chest, the belly drawn up behind
    pen.beginPath();
    pen.moveTo(-215 * L, -250);
    pen.bezierCurveTo(-225 * L, -315, -150 * L, -326, -60 * L, -316);
    pen.bezierCurveTo(30 * L, -306, 110 * L, -330, 180 * L, -318);
    pen.bezierCurveTo(232 * L, -300, 240 * L, -232 + B * 0.4, 205 * L, -196 + B * 0.7);
    pen.bezierCurveTo(120 * L, -160 + B, -60 * L, -176 + B, -150 * L, -190 + B * 0.5);
    pen.bezierCurveTo(-200 * L, -200, -212 * L, -226, -215 * L, -250);
    pen.closePath();
  }
  // A Siamese is dark only at its ends. Where a dark leg lies on the body,
  // the body's colour is laid back over it: all of it at "top", none by "bottom".
  function bodyOver(outline, left, right, top, bottom) {
    if (kind !== "cat" || c.points === c.body) { return; }
    pen.save();
    outline();
    pen.clip();
    var fade = pen.createLinearGradient(0, top, 0, bottom);
    fade.addColorStop(0, c.body);
    fade.addColorStop(0.4, c.body);
    fade.addColorStop(1, beastSheer(c.body, 0));
    pen.fillStyle = fade;
    pen.fillRect(left, top, right - left, bottom - top);
    pen.restore();
  }
  var headAt, backTop;
  if (look.sit) {
    // Sitting: the haunches on the ground, the back rising to the shoulders,
    // the fore legs straight down before it, the tail lying round the feet.
    limb(128, -170, 136, -12, 84, 76, m.legs, blend(legSkin, "#1c1c22", 0.25), function (joint) { return joint[0]; }, 0.3);
    paw(136, -12, blend(legSkin, "#1c1c22", 0.25), false, 132, -91, 128, -170);
    sitShape();
    shape(c.body);
    pen.save();
    pen.clip();
    if (kind === "tiger") { stripes(-140, 150, -290, -30, [120, -200, 40, 72]); }
    else {                                          // a cat's haunch and back shade toward its points
      var shade = pen.createLinearGradient(-140, 0, 20, 0);
      shade.addColorStop(0, beastSheer(c.points, 0.4));
      shade.addColorStop(1, beastSheer(c.points, 0));
      pen.fillStyle = shade;
      pen.fillRect(-160, -300, 200, 300);
    }
    pen.restore();
    pen.strokeStyle = ink;                          // the line of the thigh, and the hind paw under it
    pen.lineWidth = 1.8 * FINE;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(-30, -150);
    pen.bezierCurveTo(30, -130, 50, -50, 20, -6);
    pen.stroke();
    paw(16, -8, legSkin, false);
    limb(100, -170, 104, -12, 84, 76, m.legs, legSkin, function (joint) { return joint[0]; }, 0.3);
    bodyOver(sitShape, 60, 150, -214, -104);
    paw(104, -12, legSkin, false, 102, -91, 100, -170);
    tail(-104, -14, 0.02, -0.008, -0.3, 0.25);      // the tail lies along the ground, round the feet, and its end lifts
    headAt = [114, -300 - m.head * 30];
    backTop = [-20, -250];
  } else {
    var top = -228 + m.low, shorter = (228 - m.low - 12) / 216;        // a cat's legs are shorter than a tiger's
    var legs = [[-160 * L, top, 0, -1, false], [165 * L, top - 4, 0.25, 1, false], [-136 * L, top - 4, 0.5, -1, true], [189 * L, top - 8, 0.75, 1, true]];
    var bonesOf = [116 * shorter, 110 * shorter, 12];
    beastLegs(legs, true, look, bonesOf, m.legs, legSkin, m.reach, m.lift, paw);
    pen.translate(0, m.low - bob);
    tail(-208 * L, -262, m.tail[3] + (e ? 0.5 * e.tail : 0), m.tail[4], m.tail[5], e ? 1 + 1.5 * e.f.anger + 0.6 * e.wag : 1);   // up when glad, down when sad, lashing in anger
    standShape();
    shape(c.body);
    pen.save();
    pen.clip();
    if (kind === "tiger") { stripes(-215 * L, 235 * L, -322, -180 + B); }
    pen.restore();
    pen.translate(0, bob - m.low);
    beastLegs(legs, false, look, bonesOf, m.legs, legSkin, m.reach, m.lift, paw);
    pen.translate(0, m.low - bob);
    bodyOver(standShape, -160 * L - 46, -160 * L + 50, -252, -186);
    bodyOver(standShape, 165 * L - 50, 165 * L + 50, -252, -184);
    if (kind === "cat") {                           // a cat is a little darker under its belly
      pen.save();
      standShape();
      pen.clip();
      var under = pen.createLinearGradient(0, -260, 0, -170);
      under.addColorStop(0, "rgba(90, 60, 40, 0)");
      under.addColorStop(1, "rgba(90, 60, 40, 0.22)");
      pen.fillStyle = under;
      pen.fillRect(-240, -260, 500, 120);
      pen.restore();
    }
    pen.beginPath();                                // the neck: colour first, then the line over it and under it
    pen.moveTo(110 * L, -324);
    pen.quadraticCurveTo(170 * L, -336, m.headAt[0] - 40, m.headAt[1] - 56 * m.head);
    pen.lineTo(m.headAt[0] - 4, m.headAt[1] + 44 * m.head);
    pen.quadraticCurveTo(226 * L, -236 + B * 0.5, 206 * L, -200 + B * 0.7);
    pen.closePath();
    pen.fillStyle = c.body;
    pen.fill();
    if (kind === "tiger") {                         // a tiger's neck is striped, and pale under the throat
      pen.save();
      pen.clip();
      stripes(100 * L, m.headAt[0] - 20, -352, -226 + B * 0.5);
      pen.restore();
    }
    pen.strokeStyle = ink;
    pen.lineWidth = LINE;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(110 * L, -324);
    pen.quadraticCurveTo(170 * L, -336, m.headAt[0] - 40, m.headAt[1] - 56 * m.head);
    pen.moveTo(m.headAt[0] - 4, m.headAt[1] + 44 * m.head);
    pen.quadraticCurveTo(226 * L, -236 + B * 0.5, 208 * L, -202 + B * 0.7);
    pen.stroke();
    if (kind === "tiger" && look.tufts !== false) { // a tuft like a small flame at each joint
      beastTuft(150 * L, -250, Math.PI + 0.5, 54, c.tuft);
      beastTuft(-170 * L, -250, Math.PI + 0.3, 54, c.tuft);
    }
    headAt = [m.headAt[0], m.headAt[1] + m.low];
    backTop = [0, -320 + m.low];
    pen.translate(0, -m.low);                       // the head is placed from the ground again
  }
  pen.save();                                       // the head
  pen.translate(headAt[0], headAt[1]);
  pen.rotate(0.04 * Math.sin(clock * 1.5 + seed) - 0.05 * beat - 0.2 * open + (e ? 0.5 * e.nod - 0.1 * e.raise + 0.04 * e.shake : 0));
  pen.scale(m.head, m.head);
  felineHead(kind, open, c, m, seed, e);
  var crown = pen.getTransform().transformPoint(new DOMPoint(0, -70));
  pen.restore();
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
  return {seat: [x + backTop[0] * size * face, y + (backTop[1] - (look.sit ? 0 : bob)) * size], head: [crown.x, crown.y]};
}

// A cat, standing on (x, y): the Siamese unless its colours are told.
function cat(x, y, look) {
  checkNames("The cat's name", look, BEAST_KEYS);
  var body = look.colour || "#efe2c8";
  return feline("cat", x, y, look, {body: body, points: look.points || (look.colour ? look.colour : "#4a3226"), eye: look.eyes || "#5fa8d8",
                                    pale: "#fff6ea", stripes: "#1f1a1a"});
}

// A tiger, standing on (x, y).
function tiger(x, y, look) {
  checkNames("The tiger's name", look, BEAST_KEYS);
  return feline("tiger", x, y, look, {body: look.colour || "#e2892b", points: look.colour || "#e2892b", eye: look.eyes || "#f0c23a",
                                      pale: "#f6ead0", stripes: look.stripes || "#1f1a1a", tuft: "#f6c445"});
}

// ---------- a pig ----------
// A pig, standing on (x, y): a barrel of a body low on short legs, a belly
// that hangs, a big head with a flat round snout, a small eye, an ear that
// flops forward, cloven trotters and a tail in a curl. It is pink unless its
// colour is told (the hill villages keep black ones), and "points" is the
// colour of patches on its back. It walks (step), keeps the beat with its
// ears and tail (late), and opens its mouth (mouth, 0 to 1). It gives back
// {seat, head}, points of the scene, as the other animals do.
function pig(x, y, look) {
  checkNames("The pig's name", look, BEAST_KEYS);
  var size = (look.size || 1) * GAITS.pig[0], face = look.face || 1, colour = look.colour || "#eeb2a6", ink = inkFor(colour), n;
  var walk = look.step !== undefined, bob = walk ? 3 * Math.abs(Math.sin(look.step * Math.PI * 2)) : 0;
  var beat = look.late !== undefined && STYLE.hop ? hop(clock, look.late) : 0, open = clamp(look.mouth || 0), seed = x * 0.013;
  var e = look.feel !== undefined ? creatureFeel(look, clock + seed) : null;   // a feeling: the head, the ears, the eye, the jaw, the tail, the cheek
  if (e) { open = e.jaw(open); }
  var deep = blend(colour, "#5a2a2a", 0.3), far = blend(colour, "#1c1c22", 0.25);
  FINE = Math.min(1, Math.pow(Math.max(0.5, size), -0.7));
  LINE = STYLE.line * FINE / Math.max(0.45, Math.min(1, size * 1.3));   // a piglet is not inked with a thick pen
  pen.fillStyle = "rgba(70, 45, 30, 0.2)";
  pen.beginPath();
  pen.ellipse(x + 20 * size * face, y + 4 * size, 230 * size, 18 * size, 0, 0, 7);
  pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  var legs = [[-116, -118, 0, -1, false], [90, -118, 0.25, 1, false], [-94, -122, 0.5, -1, true], [112, -122, 0.75, 1, true]];
  function foot(ax, ay, skin, lifted) {             // a trotter: two small dark toes
    pen.save();
    pen.translate(ax, ay);
    pen.rotate(lifted ? 0.5 : 0);
    for (var toe = 0; toe < 2; toe++) {
      pen.beginPath();
      pen.moveTo(-9 + toe * 10, -4);
      pen.lineTo(-11 + toe * 10, 10);
      pen.lineTo(4 + toe * 11, 10);
      pen.quadraticCurveTo(5 + toe * 10, 1, 0 + toe * 10, -4);
      pen.closePath();
      shape(blend(skin, "#2a1a1a", 0.6));
    }
    pen.restore();
  }
  function patches(shapeOf, spots) {                // patches of another colour, inside the shape just drawn
    if (!look.points) { return; }
    pen.save();
    shapeOf();
    pen.clip();
    pen.fillStyle = look.points;
    pen.beginPath();
    for (var s = 0; s < spots.length; s++) { pen.ellipse(spots[s][0], spots[s][1], spots[s][2], spots[s][3], spots[s][4], 0, 7); }
    pen.fill();
    pen.restore();
  }
  function bodyShape() {                            // a barrel: a round rump, a back that dips a little, a belly that hangs
    pen.beginPath();
    pen.moveTo(-178, -150);
    pen.bezierCurveTo(-198, -228, -130, -264, -36, -258);
    pen.bezierCurveTo(44, -254, 108, -252, 146, -224);
    pen.bezierCurveTo(188, -196, 188, -116, 146, -88);
    pen.bezierCurveTo(84, -44, -74, -42, -140, -76);
    pen.bezierCurveTo(-170, -92, -176, -122, -178, -150);
    pen.closePath();
  }
  beastLegs(legs, true, look, [60, 56, 10], [22, 15, 12], colour, GAITS.pig[1], 18, foot);
  pen.translate(0, -bob);
  // The tail: a curl, one turn and a half, that winds tighter toward its end
  // and wags. It is drawn twice, as a hose is: fat in ink, then in colour.
  var wag = 0.25 * (e ? 1 + 1.5 * e.wag : 1) * Math.sin(clock * 5 * (e ? 1 + e.wag : 1) + seed) + 0.3 * beat;
  function curl() {
    pen.beginPath();
    for (var a = 0; a <= 30; a++) {
      var turn = a / 30 * Math.PI * 3 + wag, wide = 22 - 13 * a / 30;
      pen.lineTo(-190 - wide * Math.sin(turn) - a * 0.5, -206 + wide * Math.cos(turn) - wide);
    }
  }
  pen.lineCap = "round";
  curl();
  pen.strokeStyle = ink;
  pen.lineWidth = 9 + 2 * LINE;
  pen.stroke();
  curl();
  pen.strokeStyle = colour;
  pen.lineWidth = 9;
  pen.stroke();
  bodyShape();
  shape(colour);
  patches(bodyShape, [[-116, -226, 56, 44, 0.3], [24, -250, 50, 28, -0.1], [118, -160, 36, 48, 0.3], [-30, -96, 54, 24, 0]]);
  pen.save();
  bodyShape();
  pen.clip();
  var shade = pen.createLinearGradient(0, -200, 0, -50);
  shade.addColorStop(0, "rgba(90, 30, 30, 0)");
  shade.addColorStop(1, "rgba(90, 30, 30, 0.28)");
  pen.fillStyle = shade;
  pen.fillRect(-220, -260, 440, 220);
  pen.restore();
  pen.translate(0, bob);
  beastLegs(legs, false, look, [60, 56, 10], [22, 15, 12], colour, GAITS.pig[1], 18, foot);
  pen.translate(0, -bob);
  pen.save();                                       // the head, carried low before the shoulders
  pen.translate(150, -168);
  pen.rotate(0.04 * Math.sin(clock * 1.6 + seed) + 0.05 * beat + (walk ? 0.03 * Math.sin(look.step * Math.PI * 4) : 0) - 0.12 * open
             + (e ? 0.5 * e.nod - 0.1 * e.raise + 0.04 * e.shake : 0));
  var blink = Math.sin(clock * 0.8 + seed * 3) > 0.985, flop = 0.1 * Math.sin(clock * 2.3 + seed) + 0.25 * beat - (e ? 0.3 * e.ears : 0);
  function ear(dx, dy, skin) {                      // an ear that flops forward over the eye
    pen.save();
    pen.translate(4 + dx, -66 + dy);
    pen.rotate(flop);
    pen.beginPath();
    pen.moveTo(-22, 4);
    pen.quadraticCurveTo(0, -28, 28, -12);
    pen.quadraticCurveTo(46, 2, 46, 28);
    pen.quadraticCurveTo(18, 22, -6, 26);
    pen.closePath();
    shape(skin);
    pen.restore();
  }
  function skull() {                                // the skull and the snout. It has no chin: the lower jaw is a piece of its own
    pen.beginPath();
    pen.moveTo(-56, 28);
    pen.bezierCurveTo(-84, -34, -44, -88, 18, -80);
    pen.bezierCurveTo(52, -76, 70, -50, 86, -30);
    pen.lineTo(120, -24);
    pen.lineTo(124, 26);
    pen.lineTo(66, 30);
    pen.quadraticCurveTo(6, 52, -56, 28);
    pen.closePath();
  }
  ear(-26, -4, far);
  pen.save();                                       // the lower jaw, behind the skull: it turns about the corner of the mouth
  pen.translate(36, 30);
  pen.rotate(0.6 * open);
  if (open > 0.03) {                                // the inside of the mouth shows above it
    pen.beginPath();
    pen.moveTo(-6, -2);
    pen.lineTo(64, -6);
    pen.lineTo(62, 4);
    pen.closePath();
    pen.fillStyle = "#a8322c";
    pen.fill();
  }
  pen.beginPath();
  pen.moveTo(-20, -2);
  pen.quadraticCurveTo(26, -4, 66, 0);
  pen.quadraticCurveTo(74, 12, 56, 18);
  pen.quadraticCurveTo(16, 26, -20, 14);
  pen.closePath();
  shape(blend(colour, "#ffffff", 0.12));
  pen.restore();
  if (open > 0.03) {                                // and under the snout, where the jaw has left it
    pen.beginPath();
    pen.moveTo(40, 26);
    pen.lineTo(118, 22);
    pen.lineTo(36 + 62 * Math.cos(0.6 * open), 30 + 62 * Math.sin(0.6 * open) - 4);
    pen.closePath();
    pen.fillStyle = "#a8322c";
    pen.fill();
  }
  skull();
  shape(colour);
  patches(skull, [[-30, -40, 44, 40, 0.3]]);
  pen.beginPath();                                  // the flat end of the snout, and its two nostrils
  pen.ellipse(123, 1, 13, 27, -0.06, 0, 7);
  shape(deep);
  pen.fillStyle = blend(deep, "#2a1414", 0.7);
  pen.beginPath();
  pen.ellipse(123, -9, 4, 6.5, 0, 0, 7);
  pen.ellipse(124, 11, 4, 6.5, 0, 0, 7);
  pen.fill();
  pen.strokeStyle = ink;                            // the folds of the snout
  pen.lineWidth = 1.5 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(96, -24);
  pen.quadraticCurveTo(92, -2, 98, 22);
  pen.moveTo(84, -26);
  pen.quadraticCurveTo(80, -6, 84, 20);
  pen.stroke();
  if (e) {
    creatureEye(64, -22, 7.5, 8.5, e, {turn: -0.1, skin: colour, ball: look.eyes || "#2a1a1a", ink: ink, shut: blink});   // a feeling's eye
    pen.strokeStyle = ink;
    pen.lineCap = "round";
    pen.lineWidth = 1.2 * LINE;
    pen.save();                                     // a brow over it, raised, or turned: its front end down in anger, up in worry
    pen.translate(63, -34 - 6 * e.brow[0] + 2 * e.brow[1]);   // close over the eye: the forehead's edge is not far above it
    pen.rotate(1.1 * e.brow[1]);
    pen.beginPath();
    pen.moveTo(-11, 2);
    pen.quadraticCurveTo(0, -4, 11, 0);
    pen.stroke();
    pen.restore();
    pen.lineWidth = LINE;
    pen.beginPath();                                // and the corner of the mouth, up in a smile, down in a frown
    pen.moveTo(44, 29);
    pen.quadraticCurveTo(34, 30 - 2 * e.grin, 24, 29 - 11 * e.grin);
    pen.stroke();
  } else {
    pen.beginPath();                                // the eye: small and dark
    pen.ellipse(64, -22, 7.5, blink ? 1.2 : 8.5, -0.1, 0, 7);
    pen.fillStyle = look.eyes || "#2a1a1a";
    pen.fill();
    if (!blink) { pen.fillStyle = "#fff6ea"; pen.beginPath(); pen.arc(66.5, -25, 2.2, 0, 7); pen.fill(); }
  }
  pen.beginPath();                                  // a cheek
  pen.ellipse(8, 6, 22, 14, 0, 0, 7);
  pen.fillStyle = "rgba(214, 90, 90, " + (0.22 + (e ? 0.2 * e.f.full + 0.15 * e.f.laugh : 0)) + ")";   // pinker when it is full, or laughing
  pen.fill();
  ear(0, 0, colour);
  var crown = pen.getTransform().transformPoint(new DOMPoint(0, -84));
  pen.restore();
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
  return {seat: [x - 20 * size * face, y - (248 + bob) * size], head: [crown.x, crown.y]};
}

// ---------- a walk from one place to another ----------
// How each animal walks: [how large it is drawn, how far a foot goes back
// along the ground in one stride, how many beats a stride takes].
var GAITS = {elephant: [1.35, 120, 4], buffalo: [1.25, 84, 3],
             cat: [FELINES.cat.scale, FELINES.cat.reach, 1], tiger: [FELINES.tiger.scale, FELINES.tiger.reach, 2],
             pig: [0.8, 66, 2]};

// amble() takes an animal along the ground at an even pace, as the kit's
// stroll() takes a person. The feet do not slide: a foot is on the ground
// for 0.62 of a stride (see beastFoot), and in that time the body goes
// forward as far as the foot goes back.
//   kind       "elephant", "buffalo", "cat", "tiger" or "pig"
//   t          the scene's clock
//   from, to   where the walk begins and where it ends (x)
//   start      the second the animal sets off
//   look       its look
// It gives back {x, look, arrives}: where the animal is at t; the look to
// draw it with, which is the one given with face set, and step while it
// walks; and the second it arrives.
function amble(kind, t, from, to, start, look) {
  var gait = GAITS[kind], far = Math.abs(to - from), way = to < from ? -1 : 1;
  var pace = gait[1] / 0.62 * gait[0] * (look.size || 1);   // how far one stride takes it
  var strides = far / pace, done = Math.max(0, Math.min(strides, (t - start) / (gait[2] * BEAT)));
  var given = Object.assign({}, look, {face: way});
  delete given.step;                                // one that has not set off, or has arrived, stands
  if (done > 0 && done < strides) { given.step = done; }
  return {x: from + way * pace * done, look: given, arrives: start + strides * gait[2] * BEAT};
}
