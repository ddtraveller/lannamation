// lannabirds.js - four birds of the north that Lanna tells of, for the Lanna cartoon kit.
// Load it after the kit and northbirds.js (it draws with that file's helpers):
//
//     <script src="oldcartoon.js"></script>
//     <script src="northbirds.js"></script>
//     <script src="lannabirds.js"></script>
//
// and call each from a scene as the kit's rooster() is called: (x, y) is where its feet are, or, for one in
// flight, the middle of its body; t is the second; look holds what it does, and a name the bird does not know is
// warned of.
//
//   whiteCrow(x, y, t, look)    the white crow, แม่กาเผือก: walks, hops, pecks, caws, broods, flies; or a black crow
//   crowNest(x, y, t, look)     her nest of sticks in a fig tree's fork, with up to five eggs, rocking in the wind
//   spottedDove(x, y, t, look)  the spotted dove, นกเขาใหญ่: walks nodding, pecks, bows and coos, flies, claps and glides
//   kingfisher(x, y, t, look)   the white-throated kingfisher, นกกระเต็นอกขาว: bobs, calls, hovers, dives, beats a fish;
//                               or the small common kingfisher, นกกระเต็นน้อยธรรมดา (kind: "common")
//   parakeet(x, y, t, look)     the red-breasted parakeet, นกแขกเต้า: perches, climbs by its bill, eats from its foot,
//                               preens, calls, flies; or the blossom-headed parakeet, นกแก้วหัวแพร (kind: "blossom")
//
// Why these (each said again above its bird, with its source; the research is the NotebookLM notebook "Birds and
// animals of Lanna", 52 sources, checked claim by claim against the sources other than its own report):
//   - the white crow is the mother of the five Buddhas of this age in the Lanna tale of กาเผือก: she laid five eggs in
//     a fig tree by the river; a storm swept them away, and a hen, a naga, a turtle, a cow and a lion each raised one.
//     At Yi Peng the north lights clay lamps (ผางประทีป) with a three-pronged wick twisted like a crow's foot (ตีนกา)
//     for her (Silpa Wattanatham; Creative Knowledge CMU; the National Library at Chiang Mai, Fine Arts Department).
//   - a spotted dove that comes to nest at a house is a good sign: of a household at peace and the end of sorrow
//     (U.LEK, "นกเขาใหญ่").
//   - the parakeet: the red-breasted one, แขกเต้า, "its wings bright green", flies in the northern verse that the
//     study of the Hatsadiling bier quotes (ปราสาทศพนกหัสดีลิงค์ในล้านนา). The blossom-headed is the north's other.
//   - the kingfisher: no Lanna text about it was found; it is here because it is the bird of the north's paddies and
//     ponds that everyone sees, the white-throated all year and the common one in the cold season.
// Each is drawn from rules read from photographs on Wikimedia Commons under free licences, kept with their credits
// outside the repository; nothing of them is copied.
//
// At size 1 a bird is as large as it would be beside the cast (340 px is 160 cm): a crow about 105 long, a dove
// about 64, a kingfisher about 60, a parakeet about 80 with its tail. The kit's rules for its drawing hold: a fine
// line round each shape, darker than what it holds, and colour that changes inside a shape and nowhere else. Every
// feather of a wing or a tail is its own shape (lbFeather), with its shaft, laid in rows as a bird's are.

var CROW_KEYS = {}, NEST_KEYS = {}, DOVE_KEYS = {}, KINGFISHER_KEYS = {}, PARAKEET_KEYS = {};
["size", "face", "colour", "step", "hop", "peck", "caw", "turn", "brood", "fly", "glide", "glow", "seed", "feel"].forEach(function (n) { CROW_KEYS[n] = true; });
["size", "eggs", "wind", "gold", "tree"].forEach(function (n) { NEST_KEYS[n] = true; });
["size", "face", "step", "peck", "coo", "fluff", "fly", "glide", "clap", "seed", "feel"].forEach(function (n) { DOVE_KEYS[n] = true; });
["size", "face", "kind", "bob", "call", "watch", "hover", "dive", "fly", "fish", "beat", "seed", "feel"].forEach(function (n) { KINGFISHER_KEYS[n] = true; });
["size", "face", "kind", "hen", "climb", "eat", "preen", "call", "shake", "fly", "seed", "feel"].forEach(function (n) { PARAKEET_KEYS[n] = true; });

// ---------- shared: feathers, wings, tails ----------

// Begins drawing a bird designed "unit" times its size: nbBegin(), then the pen scaled by unit so that the bird can
// be drawn in round numbers, and LINE kept fine. Returns what nbBegin() returns: hand it to nbEnd().
// e.g. var keep = lbBegin(x, y, look, 0.5, 0.8);   /* drawn 200 long, 100 on the sheet */   nbEnd(keep);
function lbBegin(x, y, look, unit, fine) {
  var keep = nbBegin(x, y, look, fine);
  pen.scale(unit, unit);
  LINE /= unit;
  return keep;
}

// A smooth step from 0 to 1 as s goes from 0 to 1 (clamped). Returns a number.
// e.g. lbEase(0.5)   // 0.5
function lbEase(s) { s = clamp(s); return s * s * (3 - 2 * s); }

// A pulse that rises and falls once every "every" seconds, lasting "long" of them, from "at" seconds into its
// round; seed shifts it. Returns 0 to 1 (a smooth hump), 0 between pulses.
// e.g. lbPulse(clock, 3, 0.6, 0)   // a hump of 0.6 s every 3 s
function lbPulse(t, every, long, seed) {
  var u = ((t + (seed || 0)) % every + every) % every;
  if (u > long) { return 0; }
  return Math.sin(u / long * Math.PI);
}

// One feather: from root [x, y] to tip [x, y], "wide" across at its widest, bowed by "bow" (a fraction of its length,
// to the left of the way it points), its tip "round" (0 pointed, 1 round). It is filled from "colour" at the root
// to "tipColour" (colour when left out), inked round, a shaft down it in "shaft" (none when false), and a sheen
// along its outer vane ("sheen" 0 to 1). "band" ([from, to, colour]): a band across it, from and to of the way out.
// Returns nothing: it draws with pen.
// e.g. lbFeather([0, 0], [-60, -20], 9, {colour: "#3a8ac8", tipColour: "#1a3a6a", sheen: 0.5});
function lbFeather(root, tip, wide, how) {
  var dx = tip[0] - root[0], dy = tip[1] - root[1], long = Math.hypot(dx, dy) || 1;
  var ux = dx / long, uy = dy / long, nx = -uy, ny = ux, w = wide / 2, bow = (how.bow || 0) * long, round = how.round === undefined ? 0.6 : how.round;
  function at(s, side) {                             // a point s of the way along, "side" of its half-width out (1 left)
    var bend = bow * 4 * s * (1 - s), half = w * (s < 0.7 ? 0.55 + 0.45 * Math.sin(s / 0.7 * Math.PI / 2) : 1 - (1 - round * 0.6) * Math.pow((s - 0.7) / 0.3, 1.6));
    return [root[0] + ux * long * s + nx * (bend + side * half), root[1] + uy * long * s + ny * (bend + side * half)];
  }
  var n, p, shape = new Path2D();                    // the feather's outline, kept to fill, to cut a band with and to ink
  for (n = 0; n <= 10; n++) { p = at(n / 10, 1); if (n) { shape.lineTo(p[0], p[1]); } else { shape.moveTo(p[0], p[1]); } }
  var tipAt = at(1, 0), out = [tipAt[0] + ux * w * round * 0.8, tipAt[1] + uy * w * round * 0.8];
  shape.quadraticCurveTo(out[0] + nx * w * 0.7, out[1] + ny * w * 0.7, out[0], out[1]);
  shape.quadraticCurveTo(out[0] - nx * w * 0.7, out[1] - ny * w * 0.7, at(1, -1)[0], at(1, -1)[1]);
  for (n = 10; n >= 0; n--) { p = at(n / 10, -1); shape.lineTo(p[0], p[1]); }
  shape.closePath();
  var colour = how.colour, tipColour = how.tipColour || colour;
  var g = pen.createLinearGradient(root[0], root[1], out[0], out[1]);
  g.addColorStop(0, colour);
  g.addColorStop(1, tipColour);
  pen.fillStyle = g;
  pen.fill(shape);
  pen.save();                                        // only a band needs the feather's own shape to cut it; the sheen lies inside it
  if (how.band) { pen.clip(shape); }
  if (how.band) {                                    // a band across the feather
    var b0 = at(how.band[0], 0), b1 = at(how.band[1], 0);
    pen.strokeStyle = how.band[2];
    pen.lineWidth = Math.hypot(b1[0] - b0[0], b1[1] - b0[1]);
    pen.beginPath();
    var m = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2];
    pen.moveTo(m[0] + nx * w * 2, m[1] + ny * w * 2);
    pen.lineTo(m[0] - nx * w * 2, m[1] - ny * w * 2);
    pen.stroke();
  }
  if (how.sheen) {                                   // a sheen along the outer vane: the light on a feather's curve
    pen.strokeStyle = how.sheenColour ? how.sheenColour.replace("A", 0.5 * how.sheen) : "rgba(255, 255, 255, " + (0.32 * how.sheen) + ")";
    pen.lineWidth = w * 0.7;
    pen.beginPath();
    for (n = 1; n <= 9; n++) { p = at(n / 10, 0.45); if (n > 1) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } }
    pen.stroke();
  }
  pen.restore();
  pen.strokeStyle = inkFor(/^#/.test(tipColour) ? tipColour : colour);
  pen.lineWidth = LINE * (how.ink || 0.75);
  pen.stroke(shape);
  if (how.shaft !== false) {                         // the shaft, from the root most of the way out
    pen.strokeStyle = how.shaft || "rgba(255, 255, 255, 0.35)";
    pen.lineWidth = LINE * 0.5;
    pen.beginPath();
    for (n = 0; n <= 8; n++) { p = at(n / 10, 0); if (n) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } }
    pen.stroke();
  }
}

// A tail of n feathers from "root" [x, y], pointing "angle" (radians), the middle one "long" and the outer ones
// "outer" times as long (graduated below 1), each "wide", fanned "spread" radians from side to side. The far half
// is drawn first and darker, so that a tail fanned shows its feathers one over the next. "how" is lbFeather()'s
// (colour, tipColour, band, sheen), and "edges" ([colour, from]) colours the outer pair's tips (a dove's white).
// Returns nothing: it draws with pen.
// e.g. lbTail([-40, -30], Math.PI * 0.9, 7, 70, 0.7, 12, 0.3, {colour: "#8a7a6a"});
function lbTail(root, angle, n, long, outer, wide, spread, how, wave) {
  var order = [], k;
  for (k = 0; k < n; k++) { order.push(k); }
  order.sort(function (a, b) { return Math.abs(b - (n - 1) / 2) - Math.abs(a - (n - 1) / 2) || b - a; });   // the outer ones first
  order.forEach(function (k) {
    var off = n > 1 ? k / (n - 1) - 0.5 : 0, side = off * 2;
    var a = angle + off * spread + (wave || 0) * Math.sin(k * 1.7), l = long * mix(1, outer, Math.abs(side));
    var r = [root[0] + Math.cos(angle + Math.PI / 2) * side * wide * 0.25, root[1] + Math.sin(angle + Math.PI / 2) * side * wide * 0.25];
    var far = k > (n - 1) / 2, h = Object.assign({}, how, {round: how.round === undefined ? 0.8 : how.round});
    if (far) { h.colour = blend(how.colour, "#20202a", 0.18); h.tipColour = blend(how.tipColour || how.colour, "#20202a", 0.18); }
    if (how.edges && Math.abs(side) >= how.edges[1]) { h.band = [0.76, 1.4, how.edges[0]]; }
    lbFeather(r, [r[0] + Math.cos(a) * l, r[1] + Math.sin(a) * l], wide, h);
  });
}

// A row of small feathers laid like tiles along a curve from "a" by "b" to "c" ([x, y] each), "count" of them, each
// "long" and "wide", pointing "angle" (radians; the way the row's feathers lie, back over the ones behind).
// Returns nothing: it draws with pen.
// e.g. lbRow([20, -60], [0, -64], [-30, -52], 7, 16, 9, Math.PI * 0.85, {colour: "#6a5a4a", tipColour: "#c8a878"});
function lbRow(a, b, c, count, long, wide, angle, how) {
  for (var k = 0; k < count; k++) {
    var p = nbQuad(a, b, c, count > 1 ? k / (count - 1) : 0.5);
    lbFeather(p, [p[0] + Math.cos(angle) * long, p[1] + Math.sin(angle) * long], wide * 1.25, Object.assign({shaft: false, round: 1, ink: 0.45}, how));
  }
}

// A wing folded against the side, from the shoulder "s" to the tip "tip" ([x, y] each), "deep" from its top line to
// its lower edge at the wrist: the primaries laid one over the next toward the tip, the secondaries and tertials
// over them, then the greater coverts in a row and the small coverts over the shoulder. "c" names the colours:
// primary, primaryTip, secondary, secondaryTip, covert, covertTip, small (and band, a band across the coverts'
// tips, as a crow's has none and a kingfisher's black). "lift" (0 to 1) raises the wing a little off the body
// (a caw, a shake). Returns nothing: it draws with pen.
// e.g. lbFolded([30, -86], [-72, -40], 34, {primary: "#202024", secondary: "#2a2a30", covert: "#303038", small: "#34343c"});
function lbFolded(s, tip, deep, c, lift) {
  lift = lift || 0;
  var dx = tip[0] - s[0], dy = tip[1] - s[1], long = Math.hypot(dx, dy), ux = dx / long, uy = dy / long, nx = -uy, ny = ux;
  if (ny < 0) { nx = -nx; ny = -ny; }                // n points down, toward the belly
  function P(along, down) { return [s[0] + ux * long * along + nx * deep * down, s[1] + uy * long * along + ny * deep * down - lift * 6 * along]; }
  var k, way = Math.atan2(uy, ux);
  var outline = [P(0, 0.02), P(0.3, -0.06), P(0.66, 0), P(0.9, 0.16), P(1, 0.3), P(0.9, 0.42), P(0.7, 0.56), P(0.5, 0.78), P(0.3, 0.96), P(0.13, 0.9), P(0.02, 0.6)];
  var ink = inkFor(c.covert);
  lbSmooth(outline);                                 // the wing's whole shape, its colour running from the coverts to the primaries' tips
  var whole = nbGrad(P(0.15, 0.4)[0], P(0.15, 0.4)[1], P(1, 0.3)[0], P(1, 0.3)[1], c.covert, c.primaryTip || c.primary);
  pen.fillStyle = whole;
  pen.fill();
  pen.save();
  pen.clip();
  for (k = 0; k < 6; k++) {                          // the primaries, the longest under: each tip a little short of the one before
    lbFeather(P(0.3 + k * 0.03, 0.62 - k * 0.05), P(1.03 - k * 0.075, 0.3 + k * 0.05), deep * 0.34,
              {colour: c.primary, tipColour: c.primaryTip || c.primary, sheen: c.sheen || 0.4, sheenColour: c.sheenColour, round: 0.45, shaft: c.shaft});
  }
  for (k = 0; k < 6; k++) {                          // the secondaries, broad and round-tipped, along the lower edge
    lbFeather(P(0.1 + k * 0.04, 0.36 + k * 0.02), P(0.66 - k * 0.065, 0.62 + k * 0.06), deep * 0.4,
              {colour: c.secondary, tipColour: c.secondaryTip || c.secondary, sheen: c.sheen || 0.4, sheenColour: c.sheenColour, round: 1, shaft: c.shaft});
  }
  for (k = 0; k < 3; k++) {                          // the tertials, the innermost, long, along the back
    lbFeather(P(0.08 + k * 0.03, 0.08 + k * 0.1), P(0.58 - k * 0.07, 0.16 + k * 0.12), deep * 0.46,
              {colour: c.tertial || c.secondary, tipColour: c.tertialTip || c.secondaryTip || c.secondary, sheen: c.sheen || 0.4, sheenColour: c.sheenColour, round: 0.9, shaft: c.shaft});
  }
  lbRow(P(0.04, 0.3), P(0.16, 0.6), P(0.34, 0.66), 7, deep * 0.42, deep * 0.3, way + 0.15,     // the greater coverts, a row over the flight feathers' roots
        {colour: c.covert, tipColour: c.band || c.covertTip || c.covert, sheen: c.sheen || 0.3, sheenColour: c.sheenColour});
  lbRow(P(0.02, 0.16), P(0.09, 0.4), P(0.2, 0.48), 6, deep * 0.32, deep * 0.26, way + 0.2,      // the median coverts
        {colour: c.small, tipColour: c.smallTip || c.small, sheen: c.sheen || 0.3, sheenColour: c.sheenColour});
  lbRow(P(-0.02, 0.04), P(0.03, 0.2), P(0.1, 0.3), 5, deep * 0.26, deep * 0.24, way + 0.3,      // the lesser coverts at the shoulder
        {colour: c.lesser || c.small, tipColour: c.lesserTip || c.smallTip || c.lesser || c.small, sheen: c.sheen || 0.3, sheenColour: c.sheenColour});
  pen.restore();
  lbSmooth(outline);                                 // its outline again, over the feathers, so the wing is one clear shape
  pen.strokeStyle = ink;
  pen.lineWidth = LINE;
  heavy(ink);
  pen.stroke();
  light();
}

// A wing spread in flight, drawn pointing up from the shoulder (0, 0) and squeezed by lift (nbLift) as a side
// view sees it beat: the secondaries along the arm's trailing edge, the primaries fanned from the wrist (spread 0
// to 1: closed on the upstroke, parted on the downstroke), the coverts over their roots in two rows, and the
// leading edge. "w": span, chord (the arm's depth), n (primaries), fingers (0 to 1: a crow's or an eagle's
// separated tips; 0 a pointed wing), and colours as lbFolded's, with patch [from, to, colour] (a white or
// a pale patch across the primaries' bases, the kingfisher's) and lining (the colour under the coverts).
// Returns nothing: it draws with pen.
// e.g. pen.save(); nbLift(0.8); lbWingOpen({span: 120, chord: 46, n: 9, fingers: 0.6, primary: "#222"}, 0.5); pen.restore();
function lbWingOpen(w, spread) {
  var span = w.span, chord = w.chord, n = w.n || 9, fingers = w.fingers || 0, k;
  var wrist = [chord * 0.18, -span * 0.44], hand = [chord * 0.02, -span * 0.62];
  for (k = n - 1; k >= 0; k--) {                     // the primaries, the outermost first: it lies under the next
    var s = k / (n - 1), root = [mix(wrist[0], hand[0], s), mix(wrist[1], hand[1], s)];
    var ang = mix(-Math.PI * 0.8, -Math.PI * 0.5, Math.pow(s, 0.8)) + (spread || 0) * (s - 0.5) * 0.35;
    var len = span * mix(0.46, 0.4, s) * (fingers ? mix(1, 0.92, s * s) : mix(1, 0.78, s * s * s));
    var tip = [root[0] + Math.cos(ang) * len, root[1] + Math.sin(ang) * len];
    var h = {colour: w.primary, tipColour: w.primaryTip || w.primary, sheen: 0.45, sheenColour: w.sheenColour, round: fingers ? 0.7 : 0.35, shaft: w.shaft};
    if (w.patch) { h.band = [w.patch[0], w.patch[1], w.patch[2]]; }
    lbFeather(root, tip, chord * mix(0.34, fingers ? 0.24 : 0.3, s) * (fingers && s > 0.55 ? 0.8 : 1), h);
  }
  for (k = 0; k < 8; k++) {                          // the secondaries along the arm, pointing back
    var u = k / 7, r2 = [mix(chord * 0.32, wrist[0], u), mix(-span * 0.04, wrist[1] + span * 0.02, u)];
    var a2 = -Math.PI * mix(0.93, 0.82, u), l2 = chord * mix(0.78, 0.72, u);
    lbFeather(r2, [r2[0] + Math.cos(a2) * l2, r2[1] + Math.sin(a2) * l2], chord * 0.3,
              {colour: w.secondary, tipColour: w.secondaryTip || w.secondary, sheen: 0.4, sheenColour: w.sheenColour, round: 0.9, shaft: w.shaft});
  }
  var lead = [[chord * 0.42, 0], [chord * 0.5, -span * 0.3], [wrist[0] + chord * 0.12, wrist[1]]];
  lbRow(lead[0], [chord * 0.2, -span * 0.26], [wrist[0] - chord * 0.05, wrist[1] + span * 0.04], 8, chord * 0.42, chord * 0.22, -Math.PI * 0.9,
        {colour: w.covert, tipColour: w.covertTip || w.covert, sheen: 0.35, sheenColour: w.sheenColour});
  lbRow([wrist[0], wrist[1] + 4], [mix(wrist[0], hand[0], 0.5) - 4, mix(wrist[1], hand[1], 0.5)], [hand[0] - 2, hand[1]], 5, chord * 0.36, chord * 0.2, -Math.PI * 0.72,
        {colour: w.covert, tipColour: w.covertTip || w.covert, sheen: 0.35, sheenColour: w.sheenColour});
  pen.beginPath();                                   // the leading edge: a slim band of the smallest coverts, inked on its front
  pen.moveTo(chord * 0.44, 2);
  pen.quadraticCurveTo(chord * 0.54, -span * 0.24, wrist[0] + chord * 0.1, wrist[1]);
  pen.quadraticCurveTo(hand[0] + chord * 0.1, (wrist[1] + hand[1]) / 2, hand[0] + 1, hand[1]);
  pen.quadraticCurveTo(hand[0] + chord * 0.04, (wrist[1] + hand[1]) / 2 + 3, wrist[0] + chord * 0.02, wrist[1] + span * 0.02);
  pen.quadraticCurveTo(chord * 0.42, -span * 0.22, chord * 0.34, 2);
  pen.closePath();
  pen.fillStyle = nbGrad(chord * 0.4, 0, chord * 0.1, -span * 0.4, w.small || w.covert, w.smallTip || w.small || w.covert);
  pen.fill();
  pen.strokeStyle = inkFor(w.small || w.covert);
  pen.lineWidth = LINE;
  heavy(inkFor(w.small || w.covert));
  pen.beginPath();
  pen.moveTo(chord * 0.44, 2);
  pen.quadraticCurveTo(chord * 0.54, -span * 0.24, wrist[0] + chord * 0.1, wrist[1]);
  pen.quadraticCurveTo(hand[0] + chord * 0.1, (wrist[1] + hand[1]) / 2, hand[0] + 1, hand[1]);
  pen.stroke();
  light();
}

// A wing seen beating: lbWingOpen() on its side, squeezed by lift, the far one darker and a little behind; the
// primaries parted as it comes down (rate below 0) and closed as it goes up. "beat" is the wing's phase in turns;
// gives back the lift (1 up to -1 down), for the body to rise and fall against it. Returns a number.
// e.g. var lift = lbBeat(w, clock * 3, [4, -8], darker);
function lbBeat(w, beat, at, tone, far) {
  var a = beat * Math.PI * 2, lift = Math.cos(a), rate = -Math.sin(a);
  pen.save();
  pen.translate(at[0] + (far ? -w.chord * 0.18 : 0), at[1] - (far ? 4 + 4 * lift : 0));
  if (far) { pen.globalAlpha *= 0.95; }
  nbLift(lift * (far ? 0.92 : 1));
  var c = tone ? Object.assign({}, w, {primary: blend(w.primary, tone, 0.3), primaryTip: blend(w.primaryTip || w.primary, tone, 0.3),
          secondary: blend(w.secondary, tone, 0.3), secondaryTip: blend(w.secondaryTip || w.secondary, tone, 0.3),
          covert: blend(w.covert, tone, 0.3), covertTip: blend(w.covertTip || w.covert, tone, 0.3),
          small: blend(w.small || w.covert, tone, 0.3), smallTip: blend(w.smallTip || w.small || w.covert, tone, 0.3)}) : w;
  lbWingOpen(c, Math.max(0, -rate));
  pen.restore();
  return lift;
}

// Begins a new path on pen: a smooth closed curve through every point of "pts" ([[x, y], ...], three or more), as
// a Catmull-Rom spline does it, so an outline read off a photograph point by point is drawn without corners. It
// neither fills nor strokes. Returns nothing.
// e.g. lbSmooth([[0, -20], [20, 0], [0, 20], [-20, 0]]); nbPaint("#c8a8a8");
function lbSmooth(pts) {
  var n = pts.length, k;
  pen.beginPath();
  pen.moveTo(pts[0][0], pts[0][1]);
  for (k = 0; k < n; k++) {
    var p0 = pts[(k - 1 + n) % n], p1 = pts[k], p2 = pts[(k + 1) % n], p3 = pts[(k + 2) % n];
    pen.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  pen.closePath();
}

// The same curve, open: through the points from the first to the last, for a line along an edge (a neck's back,
// a collar). Begins a new path; neither strokes nor fills. Returns nothing.
// e.g. lbSmoothLine([[0, 0], [10, -6], [20, -4]]); pen.stroke();
function lbSmoothLine(pts) {
  var n = pts.length, k;
  pen.beginPath();
  pen.moveTo(pts[0][0], pts[0][1]);
  for (k = 0; k < n - 1; k++) {
    var p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(n - 1, k + 2)];
    pen.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
}

// A bird's short leg and foot standing on the ground at (fx, fy), from the hip (hx, hy): the shin "thick", the
// toes "toe" long, three forward and one back (zygodactyl: two forward, two back, as a parrot's), in "colour".
// lifted (0 to 1) folds the toes as the foot leaves the ground. Returns nothing: it draws with pen.
// e.g. lbFoot(0, -14, 3, 0, 4, 9, "#d0505a", 0, false);
function lbFoot(hx, hy, fx, fy, thick, toe, colour, lifted, zygo) {
  nbLimb([[hx, hy], [fx, fy - 2]], thick, colour);
  var curl = (lifted || 0) * 0.9;
  if (zygo) {                                        // a parrot's: two toes forward, two back, gripping
    nbLimb([[fx, fy - 1], [fx + toe * Math.cos(curl), fy + toe * Math.sin(curl) * 0.5]], thick * 0.6, colour);
    nbLimb([[fx, fy - 1], [fx + toe * 0.8 * Math.cos(curl + 0.3), fy + 1 + toe * 0.8 * Math.sin(curl + 0.3) * 0.5]], thick * 0.55, colour);
    nbLimb([[fx, fy - 1], [fx - toe * 0.8, fy + 1]], thick * 0.6, colour);
    nbLimb([[fx, fy - 1], [fx - toe * 0.6, fy + 2]], thick * 0.55, colour);
    return;
  }
  nbLimb([[fx, fy - 1], [fx + toe * Math.cos(curl), fy + toe * Math.sin(curl)]], thick * 0.55, colour);
  nbLimb([[fx, fy - 1], [fx + toe * 0.75 * Math.cos(curl + 0.25), fy + 1 + toe * 0.75 * Math.sin(curl + 0.25)]], thick * 0.5, colour);
  nbLimb([[fx, fy - 1], [fx - toe * 0.6, fy + (curl ? 2 : 0)]], thick * 0.55, colour);
}

// ---------- the white crow ----------
// The white crow (กาเผือก), แม่กาเผือก in the Lanna tale: a crow born white, who laid five eggs in a fig tree (ต้น
// มะเดื่อ) by the river; a great storm blew the nest down and the eggs floated away, and she searched until her
// heart broke and she was born again as a Brahma. The eggs were found and raised by a hen, a naga, a turtle, a cow
// and a lion; the boys grew up, became hermits, met, and were told by their mother, come down as a white crow,
// that each would be a Buddha of this age. She asked them to light lamps with a wick twisted into a crow's foot
// for her: the ตีนกา of the ผางประทีป lit at Yi Peng ("ตำนานกาเผือก", Silpa Wattanatham; Creative Knowledge CMU;
// ผางประทีป, the National Library at Chiang Mai). The crow of the north is the large-billed crow (Corvus
// macrorhynchos); she is drawn as one, white. Read from photographs of it:
//   1. A heavy bill, deep at the base, its top arched to a hooked point; bristles over the nostrils, lying forward.
//   2. A steep forehead rising from the bill to a peaked crown; a dark eye.
//   3. A shaggy throat: pointed feathers that stand out when it calls.
//   4. It stands tall on long strong legs, the shins scaled, the toes long, one behind.
//   5. The folded wings reach two thirds down the tail; the tail is long and rounded, its middle feathers longest.
//   6. In flight the wings are broad, the five outer primaries separate like fingers, the beats steady.
//   7. It walks with a swagger, the head forward at each step, and hops two-footed when in a hurry; it caws with
//      its head down and forward, the tail and the wings flicking at each caw.
// A black crow (colour: "black") is the same bird as the north sees it every day, glossed blue and purple.
// The look's names: size, face (1 right, -1 left), colour ("white", the default, or "black"), step (grows a step
// at a time while it walks), hop (grows a hop at a time while it hops), peck (0 to 1), caw (0 to 1: the head down,
// the bill open, the throat puffed, the tail flicked), turn (-1 to 1: the head turned down or up), brood (0 to 1: it
// settles down on its eggs, the wings a little out over them), fly (true: in flight; (x, y) the middle of its
// body), glide (0 to 1: in flight, the wings held out still), glow (0 to 1: she shines, a ring of light behind her,
// as the mother come down from heaven), seed (its own time), feel.

var CROW = {
  white: {body: "#f8f6f0", shade: "#b4b8cc", light: "#fffef9", throat: "#fbf9f4",
          primary: "#ecebe8", primaryTip: "#a9abc0", secondary: "#f1efeb", secondaryTip: "#bfc0d0", covert: "#f6f4ef", covertTip: "#d6d6e0",
          bill: "#ecdcd0", billDeep: "#b89888", leg: "#d8bfb6", eye: "#2a1e1a", ring: "#eadbd0", mouth: "#e89a9a",
          gloss: 0.5, sheenColour: null},
  black: {body: "#20212c", shade: "#08080c", light: "#3c4260", throat: "#262733",
          primary: "#1b1c26", primaryTip: "#0b0b10", secondary: "#1e1f2a", secondaryTip: "#0e0e14", covert: "#252736", covertTip: "#14141c",
          bill: "#22222a", billDeep: "#0c0c10", leg: "#1e1e24", eye: "#3a2a20", ring: "#2a2a32", mouth: "#5a2a3a",
          gloss: 0.9, sheenColour: "rgba(120, 140, 255, A)"}};

// The crow's head and neck, from the neck's root "base" to the middle of the head "head" ([x, y] each), the bill
// pointing "aim" radians (0 right), opened "open" (0 to 1), the throat's feathers standing out "puff" (0 to 1).
// c a CROW palette; e a feeling or null. The head is drawn first and the neck over its back, so the two are one
// line; only the neck's back is inked, and where it meets the body nothing is. Returns [x, y], the bill's tip on
// the sheet.
// e.g. crowHead([30, -96], [50, -128], 0, CROW.white, 0.4, 0.6, null)
function crowHead(base, head, aim, c, open, puff, e) {
  var k, hx = head[0], hy = head[1];
  var dx = hx - base[0], dy = hy - base[1], long = Math.hypot(dx, dy) || 1, nx = dy / long, ny = -dx / long;   // n: toward the back of the neck
  pen.save();
  pen.translate(hx, hy);
  pen.rotate(aim);
  pen.beginPath();                                   // rule 2: the head: a steep forehead from the bill up to a peaked crown, the nape round
  pen.moveTo(14, -8);
  pen.bezierCurveTo(14, -15, 8, -21, -2, -21);
  pen.bezierCurveTo(-14, -21, -22, -12, -22, 0);
  pen.bezierCurveTo(-22, 12, -10, 18, 4, 17);
  pen.bezierCurveTo(12, 16, 16, 10, 16, 4);
  pen.closePath();
  nbPaint(c.body, nbGrad(0, -21, 0, 18, c.light, blend(c.body, c.shade, 0.25)));
  if (c.sheenColour) {                               // the black crow's gloss over its crown
    pen.strokeStyle = c.sheenColour.replace("A", 0.35);
    pen.lineWidth = 5;
    pen.beginPath(); pen.arc(-3, 0, 14, -2.6, -1.0); pen.stroke();
  }
  pen.restore();
  var ux = dx / long, uy = dy / long;
  pen.beginPath();                                   // the neck, thick, from the body up to the back of the head
  pen.moveTo(base[0] + nx * 17, base[1] + ny * 17);
  pen.quadraticCurveTo(mix(base[0], hx, 0.55) + nx * 15, mix(base[1], hy, 0.55) + ny * 15, hx + nx * 16 - ux * 6, hy + ny * 16 - uy * 6);
  pen.lineTo(hx - nx * 12, hy - ny * 12);
  pen.quadraticCurveTo(mix(base[0], hx, 0.5) - nx * 16, mix(base[1], hy, 0.5) - ny * 16, base[0] - nx * 20, base[1] - ny * 20);
  pen.closePath();
  pen.fillStyle = nbGrad(base[0], base[1], hx, hy, c.body, c.light);
  pen.fill();
  pen.strokeStyle = inkFor(c.body);
  pen.lineWidth = LINE;
  pen.beginPath();                                   // inked along its back only: the front is under the throat's feathers
  pen.moveTo(base[0] + nx * 17, base[1] + ny * 17);
  pen.quadraticCurveTo(mix(base[0], hx, 0.55) + nx * 15, mix(base[1], hy, 0.55) + ny * 15, hx + nx * 16 - ux * 6, hy + ny * 16 - uy * 6);
  pen.stroke();
  var chin = [hx - nx * 6 + ux * 12, hy - ny * 6 + uy * 12], root = [base[0] - nx * 16, base[1] - ny * 16];
  pen.beginPath();                                   // rule 3: the shaggy throat, one ragged beard of pointed feathers; they stand out as it calls
  pen.moveTo(chin[0] + nx * 8, chin[1] + ny * 8);
  for (k = 0; k <= 9; k++) {
    var s = k / 9, px = mix(chin[0], root[0], s), py = mix(chin[1], root[1], s);
    var reach = (3 + puff * 13) * Math.sin(Math.PI * (0.15 + 0.85 * s)) * (k % 2 ? 0.7 : 1), down = (2 + puff * 6) * (k % 2 ? 0.6 : 1);
    pen.lineTo(px - nx * reach + ux * -down, py - ny * reach + uy * -down);
    pen.lineTo(px + (root[0] - chin[0]) / 18, py + (root[1] - chin[1]) / 18);
  }
  pen.lineTo(root[0] + nx * 10, root[1] + ny * 10);
  pen.closePath();
  pen.fillStyle = nbGrad(chin[0], chin[1], chin[0] - nx * 16, chin[1] - ny * 16, c.throat, blend(c.throat, c.shade, 0.45));
  pen.fill();
  pen.strokeStyle = inkFor(c.throat);
  pen.lineWidth = LINE * (0.5 + 0.3 * puff);
  pen.stroke();
  pen.save();
  pen.translate(hx, hy);
  pen.rotate(aim);
  var gape = open * 0.45;
  if (open > 0.03) {                                 // the mouth inside, as the bill opens
    pen.beginPath();
    pen.moveTo(10, 2);
    pen.lineTo(52, -2);
    pen.lineTo(10 + 44 * Math.cos(gape), 6 + 44 * Math.sin(gape));
    pen.closePath();
    nbFill(c.mouth);
  }
  pen.save();                                        // rule 1: the lower bill, swinging down from the gape
  pen.translate(10, 4);
  pen.rotate(gape);
  pen.beginPath();
  pen.moveTo(0, -1);
  pen.quadraticCurveTo(24, 1, 44, -1);
  pen.quadraticCurveTo(24, 8, 0, 8);
  pen.closePath();
  nbPaint(c.billDeep, nbGrad(0, 0, 44, 4, c.bill, c.billDeep));
  pen.restore();
  pen.beginPath();                                   // the upper bill: deep at the base, its top arched, hooked over at the tip
  pen.moveTo(10, -13);
  pen.bezierCurveTo(28, -15, 46, -10, 55, 1);
  pen.quadraticCurveTo(55, 6, 51, 4);
  pen.quadraticCurveTo(32, 2, 11, 5);
  pen.closePath();
  nbPaint(c.bill, nbGrad(10, -14, 54, 4, c.bill, c.billDeep));
  pen.strokeStyle = "rgba(255, 255, 255, 0.5)";      // the light along its ridge
  pen.lineWidth = LINE * 1.1;
  pen.beginPath();
  pen.moveTo(16, -12);
  pen.quadraticCurveTo(36, -12, 49, -3);
  pen.stroke();
  pen.strokeStyle = inkFor(c.bill);                  // the nostril, a short slit
  pen.lineWidth = LINE * 0.6;
  pen.beginPath(); pen.moveTo(17, -7); pen.lineTo(22, -6.5); pen.stroke();
  for (k = 0; k < 7; k++) {                          // rule 1: the bristles over the nostril, fine, lying forward
    pen.strokeStyle = blend(c.body, c.shade, 0.55);
    pen.lineWidth = LINE * 0.45;
    pen.beginPath();
    pen.moveTo(6 + k * 0.6, -14 + k * 2.2);
    pen.quadraticCurveTo(14 + k, -15 + k * 2.2, 21 + k * 0.7, -11 + k * 1.6);
    pen.stroke();
  }
  nbOval(1, -6, 5.6, 5.4);                           // the eye's ring of bare skin, and the eye
  nbFill(c.ring);
  nbEye(1.2, -6, 3.8, c.eye, e, c.body);
  if (!e) { nbOval(2.4, -7.4, 1.2, 1.2); nbFill("rgba(255, 255, 255, 0.9)"); }
  var tip = pen.getTransform().transformPoint(new DOMPoint(54, 3));
  pen.restore();
  return [tip.x, tip.y];
}

// The crow's wing, for lbFolded() and lbWingOpen(), from a CROW palette c, "dark" (0 to 1) toward its shade for
// the far wing. Returns an object.
// e.g. lbFolded(s, tip, 34, crowWing(CROW.white, 0));
function crowWing(c, dark) {
  var d = function (colour) { return blend(colour, c.shade, dark || 0); };
  return {span: 152, chord: 62, n: 10, fingers: 1, primary: d(c.primary), primaryTip: d(c.primaryTip), secondary: d(c.secondary),
          secondaryTip: d(c.secondaryTip), covert: d(c.covert), covertTip: d(c.covertTip), small: d(c.body), smallTip: d(c.covert),
          sheen: c.gloss, sheenColour: c.sheenColour, shaft: c.sheenColour ? "rgba(90, 100, 160, 0.35)" : "rgba(160, 160, 190, 0.45)"};
}

// The white crow (rules above), its feet on (x, y), or flying with (x, y) the middle of its body; at second t.
//   look   CROW_KEYS: size, face, colour, step, hop, peck, caw, turn, brood, fly, glide, glow, seed, feel
// Returns {bill: [x, y]}, the tip of its bill on the sheet. It draws with pen (nbBegin() and nbEnd(): pen and LINE
// as they were).
// e.g. whiteCrow(700, GROUND, clock, {step: clock * 2, caw: lbPulse(clock, 2.5, 0.5, 0)})
function whiteCrow(x, y, t, look) {
  look = look || {};
  checkNames("The crow's name", look, CROW_KEYS);
  var e = look.feel !== undefined ? creatureFeel(look, t) : null;
  var c = look.colour === "black" ? CROW.black : CROW.white, own = t + (look.seed || 0), size = look.size || 1;
  var glow = clamp(look.glow || 0), keep, bill;
  if (glow > 0) {                                    // the mother come down from heaven: a soft light, and a ring of it with marks on its rim
    pen.save();
    var gy = look.fly ? y : y - 62 * size, r = 92 * size;
    var halo = pen.createRadialGradient(x, gy, r * 0.1, x, gy, r * 1.7);
    halo.addColorStop(0, "rgba(255, 248, 222, " + (0.8 * glow) + ")");
    halo.addColorStop(0.45, "rgba(255, 228, 156, " + (0.32 * glow) + ")");
    halo.addColorStop(1, "rgba(255, 220, 140, 0)");
    pen.fillStyle = halo;
    pen.fillRect(x - r * 1.8, gy - r * 1.8, r * 3.6, r * 3.6);
    pen.strokeStyle = "rgba(226, 176, 64, " + (0.9 * glow) + ")";
    pen.lineWidth = 2.2 * Math.sqrt(size);
    pen.beginPath();
    pen.arc(x, gy, r, 0, Math.PI * 2);
    pen.stroke();
    pen.lineCap = "round";
    for (var m = 0; m < 32; m++) {                   // the marks on the halo's rim, turning slowly
      var a = m / 32 * Math.PI * 2 + own * 0.12, mark = (m % 2 ? 6 : 12) * Math.sqrt(size);
      pen.beginPath();
      pen.moveTo(x + Math.cos(a) * (r + 3), gy + Math.sin(a) * (r + 3));
      pen.lineTo(x + Math.cos(a) * (r + 3 + mark), gy + Math.sin(a) * (r + 3 + mark));
      pen.stroke();
    }
    pen.restore();
  }
  keep = lbBegin(x, y, look, 0.5, 0.8);
  if (look.fly) {                                    // rule 6: in flight, broad fingered wings, steady beats
    var glide = clamp(look.glide || 0), beat = own * 2.3, a2 = beat * Math.PI * 2;
    var lift = Math.cos(a2) * (1 - glide) + 0.12 * glide, opening = Math.max(0, Math.sin(a2)) * (1 - glide);
    pen.translate(0, 7 * lift * (1 - glide) + 4 * Math.sin(own * 1.1) * glide);
    pen.save();                                      // the far wing, darker, behind and above the body
    pen.translate(-4, -16 - 6 * Math.max(0, lift));
    nbLift(lift * 0.9);
    lbWingOpen(crowWing(c, 0.45), opening);
    pen.restore();
    lbTail([-50, 0], Math.PI + 0.04, 10, 70, 0.84, 16, 0.42 + 0.25 * glide, {colour: c.primary, tipColour: c.primaryTip, sheen: c.gloss, sheenColour: c.sheenColour}, 0.015 * Math.sin(own * 3));
    pen.beginPath();                                 // the body: the breast deep, tapering to the tail
    pen.moveTo(44, -16);
    pen.bezierCurveTo(20, -24, -24, -20, -54, -6);
    pen.bezierCurveTo(-60, -1, -58, 6, -50, 8);
    pen.bezierCurveTo(-20, 16, 22, 22, 44, 12);
    pen.bezierCurveTo(54, 6, 54, -10, 44, -16);
    pen.closePath();
    nbPaint(c.body, nbGrad(0, -24, 0, 20, c.light, blend(c.body, c.shade, 0.6)));
    pen.save();
    pen.clip();
    nbScales(3, 9, -44, 4, 10, 6, 4, blend(c.body, c.shade, 0.55));
    pen.restore();
    lbFeather([-10, 10], [-30, 18], 12, {colour: c.body, tipColour: c.shade, shaft: false, ink: 0.4});   // the legs tucked under the tail's coverts
    bill = crowHead([38, -2], [64, -4], 0.06 * Math.sin(own * 1.7), c, 0, 0, e);
    pen.save();                                      // the near wing, over the body
    pen.translate(10, -12);
    nbLift(lift);
    lbWingOpen(crowWing(c, 0), opening);
    pen.restore();
  } else {
    var walking = look.step !== undefined, hopping = look.hop !== undefined;
    var step = look.step || 0, hop = look.hop || 0, peck = clamp(look.peck || 0), caw = clamp(look.caw || 0), brood = clamp(look.brood || 0);
    var air = hopping ? Math.max(0, Math.sin((hop % 1) * Math.PI)) : 0, breathe = Math.sin(own * 2.1);
    pen.translate(0, -air * 30);
    var leg = function (side, late) {                // rule 4: a leg, its shin scaled, three toes forward and one back
      var ph = walking ? (step + late) % 1 : 0, swing = walking ? Math.cos(ph * Math.PI * 2) : 0, up = walking ? Math.max(0, Math.sin(ph * Math.PI * 2)) * 9 : 0;
      var fx = 4 + side * 4 + swing * 13, fy = -up - air * 8, kx = 10 + swing * 5, ky = -26 - air * 6;
      var col = side < 0 ? blend(c.leg, c.shade, 0.4) : c.leg;
      nbLimb([[8, -46], [kx, ky], [fx, fy - 3]], 5.5, col);
      var toe = air > 0.2 ? 0.7 : 0;                 // in a hop the toes hang
      nbLimb([[fx, fy - 2], [fx + 14 * Math.cos(toe), fy + 14 * Math.sin(toe)]], 2.8, col);
      nbLimb([[fx, fy - 2], [fx + 10 * Math.cos(toe + 0.25), fy + 1 + 10 * Math.sin(toe + 0.25)]], 2.5, col);
      nbLimb([[fx, fy - 2], [fx - 10, fy + (toe ? 4 : 0)]], 2.8, col);
      pen.strokeStyle = blend(col, "#000000", 0.3);
      pen.lineWidth = LINE * 0.45;
      pen.beginPath();
      for (var s = 1; s < 5; s++) {
        var px = mix(kx, fx, s / 5), py = mix(ky, fy - 3, s / 5);
        pen.moveTo(px - 3, py + 0.5); pen.lineTo(px + 3, py - 0.5);
      }
      pen.stroke();
    };
    if (brood < 0.6) { leg(-1, 0); }
    var bob = walking ? Math.abs(Math.sin(step * Math.PI * 2)) * 3 : 0;
    pen.translate(0, -bob + brood * 34);
    pen.translate(8, -46);                           // the body turns about the hip: tipping forward to peck and to caw
    pen.rotate(peck * 0.75 + caw * 0.16 + brood * 0.12);
    pen.translate(-8, 46);
    var flick = caw * 0.3 * (0.6 + 0.4 * lbPulse(own, 0.5, 0.5, 0)) + 0.2 * lbPulse(own, 4.3, 0.4, 0);
    lbTail([-48, -58], Math.PI - 0.42 + flick, 10, 64, 0.8, 15, 0.14 + 0.1 * flick, {colour: c.primary, tipColour: c.primaryTip, sheen: c.gloss, sheenColour: c.sheenColour}, 0.008 * Math.sin(own * 2));
    var puffUp = brood * 4;
    pen.beginPath();                                 // the body: the back sloping to the rump, a deep breast, round belly
    pen.moveTo(32, -102 - puffUp);
    pen.bezierCurveTo(6, -104 - puffUp, -34, -88 - puffUp, -58, -64);
    pen.bezierCurveTo(-62, -58, -56, -48, -44, -46);
    pen.bezierCurveTo(-24, -36 + breathe * 0.4, 18, -34 + breathe * 0.4, 38, -50);
    pen.bezierCurveTo(52, -62 - breathe * 0.6, 54, -86, 44, -98);
    pen.closePath();
    nbPaint(c.body, nbGrad(0, -104, 0, -34, c.light, blend(c.body, c.shade, 0.55)));
    pen.save();                                      // the small feathers of the breast and the flank, in rows
    pen.clip();
    nbScales(6, 9, -40, -78, 11, 7, 4.5, blend(c.body, c.shade, 0.45));
    pen.restore();
    if (brood < 0.6) { leg(1, 0.5); }
    pen.beginPath();                                 // the thigh's loose feathers over the top of the leg, their lower edge ragged
    pen.moveTo(-6, -58);
    pen.quadraticCurveTo(-8, -44, -2, -36);
    for (var b = 0; b < 4; b++) { pen.lineTo(1 + b * 4.5, -32 - (b % 2) * 4); pen.lineTo(3 + b * 4.5, -37); }
    pen.quadraticCurveTo(22, -46, 20, -58);
    pen.closePath();
    nbPaint(c.body, nbGrad(0, -58, 0, -32, c.body, blend(c.body, c.shade, 0.55)));
    lbFolded([30, -96 - puffUp], [-90, -50 - brood * 6], 36, crowWing(c, 0), caw * 0.5 + brood * 1.5);
    var looking = (look.turn || 0) * 0.3 + 0.14 * Math.sin(own * 0.8) * (1 - peck) * (1 - caw) * (1 - brood);
    var thrust = walking ? 5 * Math.sin(step * Math.PI * 4) : 0;
    var nod = e ? 0.4 * e.nod - 0.25 * e.raise : 0;
    var hx = 52 + thrust + peck * 18 + caw * 10, hy = -128 + peck * 30 + caw * 12 + brood * 10 + nod * 20;
    bill = crowHead([30, -94 - puffUp], [hx, hy], peck * 0.9 + caw * 0.3 - looking + nod, c, caw * (0.35 + 0.65 * lbPulse(own, 0.5, 0.42, 0)), caw, e);
  }
  nbEnd(keep);
  return {bill: bill};
}

// The crow's nest in the fork of a fig tree (ต้นมะเดื่อ): a cup of sticks crossing every way, lined with fibre, and
// in it up to five eggs, pale blue-green speckled brown (a crow's; gold: true, golden, as a tale may want them).
// (x, y) is the middle of the nest's rim. look: size (1 about 70 across, a crow's), eggs (0 to 5, how many lie in
// it), wind (0 to 1: the branch and the nest rocking, as in the storm that blew it down), gold, tree (false: no fork
// of the tree under it). Returns {eggs: [[x, y], ...]}, where each egg lies on the sheet.
// e.g. crowNest(900, 400, clock, {eggs: 5, wind: 0.2});
function crowNest(x, y, t, look) {
  look = look || {};
  checkNames("The nest's name", look, NEST_KEYS);
  var size = look.size || 1, wind = clamp(look.wind || 0), n = look.eggs === undefined ? 5 : look.eggs, k;
  var sway = wind * (0.08 * Math.sin(t * 2.3) + 0.05 * Math.sin(t * 5.1 + 1));
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  pen.translate(0, 60);
  pen.rotate(sway);
  pen.translate(0, -60);
  pen.lineCap = "round";
  var keepLine = LINE;
  LINE = STYLE.line / size;
  if (look.tree !== false) {                         // the fork: a fig's pale grey bark, smooth
    [[-6, 140, -60, 30, 18], [8, 140, 70, 24, 15], [0, 220, 0, 140, 24]].forEach(function (br) {
      nbLimb([[br[0], br[1]], [br[2], br[3]]], br[4], "#a8a294");
    });
    pen.strokeStyle = "rgba(255, 255, 255, 0.25)";
    pen.lineWidth = 3 / size;
    pen.beginPath(); pen.moveTo(-2, 210); pen.lineTo(-4, 150); pen.lineTo(-52, 40); pen.stroke();
  }
  function stick(k, front) {                         // one twig of the nest, curved, its own length and shade
    var a = (k * 2.399 + (front ? 0.4 : 0)) % (Math.PI * 2), r = 36 + (k * 7 % 11), long = 22 + (k * 13 % 26);
    var cx = Math.cos(a) * r * 1.05, cy = Math.sin(a) * r * 0.36 + (front ? 12 : 2) + (k * 5 % 9);
    var ang = a + 1.4 + ((k * 3) % 5) * 0.22, bend = ((k % 3) - 1) * 5;
    var p0 = [cx - Math.cos(ang) * long / 2, cy - Math.sin(ang) * long * 0.3], p1 = [cx + Math.cos(ang) * long / 2, cy + Math.sin(ang) * long * 0.3];
    pen.beginPath();
    pen.moveTo(p0[0], p0[1]);
    pen.quadraticCurveTo(cx + bend, cy - bend * 0.4, p1[0], p1[1]);
    var colour = ["#6e4c30", "#8c6c46", "#5a3c24", "#9a7a52", "#7a5638"][k % 5];
    pen.strokeStyle = inkFor(colour);
    pen.lineWidth = (k % 4 ? 2.2 : 3) + 1.2 / size;
    pen.stroke();
    pen.strokeStyle = colour;
    pen.lineWidth = k % 4 ? 2.2 : 3;
    pen.stroke();
  }
  pen.beginPath();                                   // the cup's mass, under its sticks: a bowl of twigs and bark
  pen.moveTo(-50, -2);
  pen.bezierCurveTo(-50, 30, -24, 40, 0, 40);
  pen.bezierCurveTo(24, 40, 50, 30, 50, -2);
  pen.closePath();
  nbPaint("#6a4a30", nbGrad(0, -2, 0, 40, "#8a6a46", "#4a3220"));
  pen.beginPath();                                   // the hollow, lined with fibre, behind the eggs
  pen.ellipse(0, 0, 42, 11, 0, 0, Math.PI * 2);
  nbFill(nbGrad(0, -11, 0, 11, "#2a1c12", "#6a5034"));
  for (k = 0; k < 26; k++) { stick(k, false); }      // the back rim's twigs, behind the eggs
  var eggs = [];
  for (k = 0; k < Math.min(5, n); k++) {             // the eggs, the back ones higher
    var ex = [-20, 2, 22, -9, 13][k], ey = [-1, -4, -1, 4, 4][k];
    var rock = wind * 0.12 * Math.sin(t * 6 + k * 1.3);
    pen.save();
    pen.translate(ex, ey);
    pen.rotate(-0.5 + k * 0.25 + rock);
    nbOval(0, 0, 9, 6.4);
    var shell = look.gold ? "#e2ac3a" : "#a9cbbd";
    nbPaint(shell, nbGrad(-6, -5, 6, 5, look.gold ? "#fff2c0" : "#eaf4ee", shell));
    pen.save();
    pen.clip();
    for (var d = 0; d < 11; d++) {                   // the speckles, more at the round end
      nbOval(((d * 37) % 14) - 4 + (d % 3), ((d * 23) % 9) - 4.5, 0.9 + (d % 2) * 0.7, 0.7 + (d % 3) * 0.35);
      nbFill(look.gold ? "rgba(160, 100, 30, 0.45)" : "rgba(100, 70, 40, 0.65)");
    }
    nbOval(-3, -2.5, 3, 1.6, -0.3);                  // the light on the shell
    nbFill("rgba(255, 255, 255, 0.6)");
    pen.restore();
    pen.restore();
    var p = pen.getTransform().transformPoint(new DOMPoint(ex, ey));
    eggs.push([p.x, p.y]);
  }
  for (k = 0; k < 44; k++) { stick(k, true); }       // the front's twigs, crossing every way, below the eggs
  LINE = keepLine;
  pen.restore();
  return {eggs: eggs};
}

// ---------- the spotted dove ----------
// The spotted dove (Spilopelia chinensis, นกเขาใหญ่, นกเขาหลวง): a dove that comes to nest at a house is a good
// sign in the north, of a family at peace with one another and of sorrow come to an end (U.LEK, "นกเขาใหญ่").
// Read from photographs of it:
//   1. A small round head, grey on the crown, the face, the neck and the breast a soft pinkish fawn.
//   2. On the sides and the back of the neck a broad black collar thick with white spots, like lace.
//   3. A slim dark bill with a soft pale swelling at its base; a red-orange eye in a thin ring.
//   4. The back and the wings brown, each feather dark in its middle with a pale rufous edge, so the wing is scaled.
//   5. The breast plump; the belly paler, the vent whitish; short red legs.
//   6. The tail long and graduated, the middle feathers brown; the outer ones dark with broad white tips that show
//      when it is fanned.
//   7. It walks with its head nodding: the head held still while the body catches up, then thrust forward. It bows
//      to coo, the neck swelling, the head down, the tail raised; it flies up steeply with a clap of its wings and
//      glides down on spread wings, the tail fanned.
// The look's names: size, face, step (grows a step at a time while it walks), peck (0 to 1), coo (0 to 1: it bows
// and coos, three bows to a phrase), fluff (0 to 1: its feathers puffed up, the head sunk, as at rest or in the
// cold), fly (true: in flight; (x, y) the middle of its body), glide (0 to 1: in flight, the wings held still and
// the tail fanned, as in its display), clap (0 to 1: the wings clap together at the top of each beat), seed, feel.

var DOVE = {crown: "#a3a3ad", face: "#cdb0aa", breast: "#d2aea6", belly: "#eadcd6", vent: "#f3eeea", back: "#8e7464",
            fringe: "#c9a17c", centre: "#6a5446", primary: "#6a5c56", primaryTip: "#3e3632", tail: "#8a7464", tailDark: "#5e4c40",
            collar: "#1e1a1c", spot: "#f6f2ee", bill: "#4a4040", cere: "#c8a8a8", leg: "#d0505a", eye: "#e0642e", ring: "#b89090",
            under: "#a8a0a4"};

// The dove's wing, for lbFolded() and lbWingOpen(); dark (0 to 1) toward its shade, for the far wing. Returns an object.
// e.g. lbFolded([22, -52], [-56, -34], 24, doveWing(0));
function doveWing(dark) {
  var d = function (colour) { return blend(colour, "#2a2226", dark || 0); };
  return {span: 106, chord: 40, n: 10, fingers: 0, primary: d(DOVE.primary), primaryTip: d(DOVE.primaryTip), secondary: d(DOVE.back),
          secondaryTip: d(DOVE.centre), tertial: d(DOVE.back), tertialTip: d(DOVE.fringe), covert: d(DOVE.centre), covertTip: d(DOVE.fringe),
          band: d(DOVE.fringe), small: d(DOVE.back), smallTip: d(DOVE.fringe), lesser: d(DOVE.crown), sheen: 0.3, shaft: "rgba(240, 220, 200, 0.3)"};
}

// The dove's head about (hx, hy), the bill pointing "aim" (radians), the neck from "base"; swell (0 to 1) the
// throat puffed to coo; e a feeling or null. Returns nothing: it draws with pen.
// e.g. doveHead([24, -50], [40, -68], 0, 0, null)
function doveHead(base, head, aim, swell, e) {
  var hx = head[0], hy = head[1], dx = hx - base[0], dy = hy - base[1], long = Math.hypot(dx, dy) || 1, nx = dy / long, ny = -dx / long;
  var k;
  pen.beginPath();                                   // the neck, its back inked, the throat swelling as it coos
  pen.moveTo(base[0] + nx * 13, base[1] + ny * 13);
  pen.quadraticCurveTo(mix(base[0], hx, 0.5) + nx * 10, mix(base[1], hy, 0.5) + ny * 10, hx + nx * 9, hy + ny * 9);
  pen.lineTo(hx - nx * 8, hy - ny * 8);
  pen.quadraticCurveTo(mix(base[0], hx, 0.5) - nx * (11 + 9 * swell), mix(base[1], hy, 0.5) - ny * (11 + 9 * swell), base[0] - nx * 14, base[1] - ny * 14);
  pen.closePath();
  pen.fillStyle = nbGrad(base[0] + nx * 12, base[1] + ny * 12, base[0] - nx * 12, base[1] - ny * 12, DOVE.face, DOVE.breast);
  pen.fill();
  pen.save();                                        // rule 2: the collar of lace on the side and the back of the neck
  pen.clip();
  lbSmooth([[base[0] + nx * 14, base[1] + ny * 14], [mix(base[0], hx, 0.75) + nx * 10, mix(base[1], hy, 0.75) + ny * 10],
            [mix(base[0], hx, 0.62) + nx * 2, mix(base[1], hy, 0.62) + ny * 2], [mix(base[0], hx, 0.18) + nx * 1, mix(base[1], hy, 0.18) + ny * 1]]);
  nbFill(DOVE.collar);
  pen.clip();
  for (k = 0; k < 60; k++) {                         // the white spots, two at the end of each black feather
    var s = (k % 10) / 9, r = Math.floor(k / 10) / 5;
    var px = mix(base[0], hx, 0.1 + s * 0.7) + nx * mix(-6, 12, r) + ((k * 7) % 3 - 1), py = mix(base[1], hy, 0.1 + s * 0.7) + ny * mix(-6, 12, r) + ((k * 5) % 3 - 1);
    nbOval(px, py, 0.95, 0.75);
    nbFill(DOVE.spot);
  }
  pen.restore();
  pen.strokeStyle = inkFor(DOVE.face);
  pen.lineWidth = LINE;
  pen.beginPath();
  pen.moveTo(base[0] + nx * 13, base[1] + ny * 13);
  pen.quadraticCurveTo(mix(base[0], hx, 0.5) + nx * 10, mix(base[1], hy, 0.5) + ny * 10, hx + nx * 9, hy + ny * 9);
  pen.moveTo(hx - nx * 8, hy - ny * 8);
  pen.quadraticCurveTo(mix(base[0], hx, 0.5) - nx * (11 + 9 * swell), mix(base[1], hy, 0.5) - ny * (11 + 9 * swell), base[0] - nx * 14, base[1] - ny * 14);
  pen.stroke();
  pen.save();
  pen.translate(hx, hy);
  pen.rotate(aim);
  lbSmooth([[10, -5], [3, -11], [-7, -10], [-11, -1], [-5, 8], [6, 7], [11, 1]]);   // rule 1: the small round head
  nbPaint(DOVE.face, nbGrad(0, -11, 0, 8, DOVE.crown, DOVE.face));
  pen.beginPath();                                   // rule 3: the slim bill, its soft pale base
  pen.moveTo(9, -3);
  pen.quadraticCurveTo(16, -3.5, 21, 0);
  pen.quadraticCurveTo(16, 2.2, 9, 2);
  pen.closePath();
  nbPaint(DOVE.bill);
  nbOval(11.5, -2, 2.8, 1.8, 0.1);
  nbFill(DOVE.cere);
  nbOval(2, -2.5, 3.1, 3.1);                         // the eye in its thin ring
  nbFill(DOVE.ring);
  nbEye(2, -2.5, 2.3, DOVE.eye, e, DOVE.face, "#1a1010");
  if (!e) { nbOval(2.8, -3.3, 0.7, 0.7); nbFill("rgba(255, 255, 255, 0.9)"); }
  pen.restore();
}

// The spotted dove (rules above), its feet on (x, y), or flying with (x, y) the middle of its body; at second t.
//   look   DOVE_KEYS: size, face, step, peck, coo, fluff, fly, glide, clap, seed, feel
// Returns nothing: it draws with pen (nbBegin() and nbEnd(): pen and LINE as they were).
// e.g. spottedDove(700, GROUND, clock, {step: clock * 3});
function spottedDove(x, y, t, look) {
  look = look || {};
  checkNames("The dove's name", look, DOVE_KEYS);
  var e = look.feel !== undefined ? creatureFeel(look, t) : null, own = t + (look.seed || 0);
  var keep = lbBegin(x, y, look, 0.42, 0.7);
  var tailHow = {colour: DOVE.tail, tipColour: DOVE.tailDark, sheen: 0.25, edges: [DOVE.spot, 0.45]};
  if (look.fly) {                                    // rule 7: quick beats; the clap at the top; the glide on spread wings, the tail fanned
    var glide = clamp(look.glide || 0), clap = clamp(look.clap || 0), beat = (own * 4.2) % 1;
    var raw = Math.cos(beat * Math.PI * 2), up = mix(raw, raw > 0 ? Math.pow(raw, 0.4) : raw, clap);   // a clap holds the wings high a moment
    var lift = up * (1 - glide) + 0.3 * glide, opening = Math.max(0, Math.sin(beat * Math.PI * 2)) * (1 - glide);
    pen.translate(0, 5 * lift * (1 - glide));
    pen.save();
    pen.translate(-3, -12 - 5 * Math.max(0, lift));
    nbLift(lift * 0.92);
    lbWingOpen(doveWing(0.4), opening);
    pen.restore();
    lbTail([-40, 2], Math.PI + 0.02, 10, 62, 0.62, 12, 0.25 + 1.1 * glide, tailHow, 0.01 * Math.sin(own * 4));
    lbSmooth([[38, -12], [14, -18], [-18, -14], [-42, -4], [-40, 6], [-14, 12], [16, 14], [36, 8]]);
    nbPaint(DOVE.breast, nbGrad(0, -18, 0, 14, DOVE.back, DOVE.belly));
    doveHead([30, -4], [46, -6], 0.04 * Math.sin(own * 2), 0, e);
    pen.save();
    pen.translate(6, -10);
    nbLift(lift);
    lbWingOpen(doveWing(0), opening);
    pen.restore();
  } else {
    var walking = look.step !== undefined, step = look.step || 0, peck = clamp(look.peck || 0), coo = clamp(look.coo || 0), fluff = clamp(look.fluff || 0);
    var bow = coo * Math.pow(Math.max(0, Math.sin(((own * 1.9) % 3 < 2.4 ? (own * 1.9) % 1 : 0) * Math.PI)), 1.5);   // three bows, then a pause
    [[-1, 0], [1, 0.5]].forEach(function (L, i) {    // rule 5: short red legs
      var ph = walking ? (step + L[1]) % 1 : 0, swing = walking ? Math.cos(ph * Math.PI * 2) : 0, upF = walking ? Math.max(0, Math.sin(ph * Math.PI * 2)) * 5 : 0;
      if (i === 0) { lbFoot(2, -18 + fluff * 4, -1 + L[0] * 3 + swing * 8, -upF, 3.4, 9, blend(DOVE.leg, "#3a2020", 0.3), upF / 5, false); }
    });
    var bob = walking ? Math.abs(Math.sin(step * Math.PI * 2)) * 1.5 : 0;
    pen.translate(0, -bob + fluff * 4);
    pen.translate(2, -20);
    pen.rotate(peck * 0.45 + bow * 0.38);
    pen.translate(-2, 20);
    lbTail([-40, -36], Math.PI - 0.3 - bow * 0.35, 10, 58, 0.6, 12, 0.14 + bow * 0.5, tailHow, 0.006 * Math.sin(own * 2));
    var puff = 1 + 0.12 * fluff, breathe = 0.6 * Math.sin(own * 2.4);
    pen.save();
    pen.translate(0, -36);
    pen.scale(puff, puff);
    pen.translate(0, 36);
    lbSmooth([[30, -56], [12, -62 - breathe], [-14, -57], [-38, -44], [-46, -36], [-40, -28], [-20, -18], [2, -15 + breathe * 0.3], [24, -20], [37, -34], [38, -46]]);
    nbPaint(DOVE.breast, nbGrad(0, -60, 0, -16, DOVE.back, DOVE.belly));
    pen.save();
    pen.clip();
    var under = pen.createLinearGradient(0, -40, 0, -16);   // the pale belly and vent
    under.addColorStop(0, "rgba(243, 238, 234, 0)");
    under.addColorStop(1, "rgba(243, 238, 234, 0.85)");
    pen.fillStyle = under;
    pen.fillRect(-50, -40, 90, 26);
    nbScales(4, 8, -30, -42, 9, 6, 3.6, "rgba(160, 120, 110, 0.35)");
    pen.restore();
    pen.restore();
    lbFoot(4, -18 + fluff * 4, 4 + (walking ? Math.cos((step + 0.5) * Math.PI * 2) * 8 : 4), walking ? -Math.max(0, Math.sin((step + 0.5) * Math.PI * 2)) * 5 : 0, 3.6, 9, DOVE.leg, 0, false);
    lbFolded([24, -54 - fluff * 3], [-60, -38], 26 + fluff * 3, doveWing(0), bow * 0.3 + fluff * 0.4);
    var thrust = 0;                                  // rule 7: the nod; still while the body catches up, then thrust forward, twice a stride
    if (walking) { var u = (step * 2) % 1; thrust = u < 0.3 ? mix(-6, 6, lbEase(u / 0.3)) : mix(6, -6, (u - 0.3) / 0.7); }
    var nod = e ? 0.4 * e.nod - 0.25 * e.raise : 0, looking = 0.12 * Math.sin(own * 0.7) * (1 - peck) * (1 - coo);
    var hx = 40 + thrust + peck * 10 + bow * 8 - fluff * 6, hy = -76 + peck * 56 + bow * 26 + fluff * 12 + nod * 14;
    doveHead([22, -50 + fluff * 2], [hx, hy], peck * 0.9 + bow * 0.7 - looking + nod, coo * (0.4 + 0.6 * bow), e);
  }
  nbEnd(keep);
}

// ---------- the kingfisher ----------
// The white-throated kingfisher (Halcyon smyrnensis, นกกระเต็นอกขาว): the kingfisher of the north's paddies,
// ponds and ditches all year, sitting on a wire or a stake over the water; and the small common kingfisher (Alcedo
// atthis, นกกระเต็นน้อยธรรมดา), that comes to the streams in the cold season (kind: "common"). No Lanna text about
// a kingfisher was found; it is here as the bird everyone sees. Read from photographs of each:
//   1. A big head on a short neck, and a huge straight bill, a dagger: red on the white-throated, black on the
//      common one.
//   2. The white-throated: the head and the belly chocolate brown; the throat and a bib down the middle of the
//      breast white; the back, the wings and the tail a shining turquoise blue.
//   3. On its shoulder a patch of chestnut, and under it a band of black; the flight feathers blue, their tips
//      dark; in flight a big white patch at the base of the primaries.
//   4. The common one: the crown and the wing blue-green spotted pale blue, a bright cobalt stripe down the back,
//      an orange cheek and a white patch behind it, a white throat, the breast and the belly orange.
//   5. It sits upright, the short tail hanging, small red feet; it bobs its head and pumps its tail; it calls
//      with its head up and its bill open, a loud laughing rattle.
//   6. It hovers on quick wings, the body tilted, the head still, and plunges head first, the wings swept back;
//      it comes up with a fish crosswise in its bill and beats it against its perch before swallowing it.
// The look's names: size, face, kind ("whitethroat" or "common"), bob (false: it does not bob), call (0 to 1),
// watch (0 to 1: the head down, looking into the water), hover (true: in the air on blurred wings; (x, y) the
// middle of its body), dive (0 to 1: from level to straight down, the wings swept back to folded), fly (true: in
// level flight, fast), fish (true: a fish crosswise in its bill), beat (0 to 1: it beats the fish on the perch,
// swinging its head), seed, feel.

var KINGFISHER = {
  whitethroat: {unit: 0.42, head: "#6c3420", headLight: "#8e4a2c", belly: "#7c3c24", bellyLight: "#9a5030", throat: "#f8f6f0",
                back: "#16a2dc", backLight: "#5ad0f4", wing: "#1488c8", primary: "#1a5ea8", primaryTip: "#16223a", shoulder: "#8a4224",
                band: "#16161c", tail: "#1680c4", tailTip: "#165a96", bill: "#d8262a", billTip: "#8e1416", leg: "#d6362a", eye: "#2a1a14",
                patch: "#f6f6f2", cheek: null, spots: null},
  common: {unit: 0.27, head: "#14727e", headLight: "#2aa2b0", belly: "#e2782e", bellyLight: "#f09a4a", throat: "#fbf6ea",
           back: "#22c2e6", backLight: "#8ef0ff", wing: "#167a86", primary: "#145a6a", primaryTip: "#12242a", shoulder: "#167a86",
           band: "#167a86", tail: "#1a7896", tailTip: "#165270", bill: "#1c1c22", billTip: "#0c0c10", leg: "#e0503a", eye: "#1a1414",
           patch: null, cheek: "#e2782e", spots: "#8ae4ff"}};

// The kingfisher's wing, for lbFolded() and lbWingOpen(), from a KINGFISHER palette k; dark (0 to 1) for the far
// wing. Returns an object.
// e.g. lbFolded([8, -74], [-20, -30], 20, kfWing(KINGFISHER.whitethroat, 0));
function kfWing(k, dark) {
  var d = function (colour) { return blend(colour, "#0a1420", dark || 0); };
  return {span: 84, chord: 34, n: 10, fingers: 0, primary: d(k.primary), primaryTip: d(k.primaryTip), secondary: d(k.wing), secondaryTip: d(k.primary),
          tertial: d(k.wing), tertialTip: d(k.back), covert: d(k.wing), covertTip: d(k.back), band: d(k.band), small: d(k.shoulder),
          smallTip: d(k.shoulder), lesser: d(k.shoulder), sheen: 0.7, sheenColour: "rgba(160, 240, 255, A)",
          patch: k.patch ? [0.05, 0.45, d(k.patch)] : null, shaft: "rgba(200, 250, 255, 0.35)"};
}

// A small fish crosswise in a bill, its middle at (x, y), "long" from head to tail, its tail flapping on t.
// Returns nothing: it draws with pen.
// e.g. kfFish(56, 2, 26, clock);
function kfFish(x, y, long, t) {
  var flap = Math.sin(t * 13) * 0.35;
  pen.save();
  pen.translate(x, y);
  pen.rotate(Math.PI / 2 - 0.25);
  lbSmooth([[long / 2, 0], [long * 0.2, -long * 0.17], [-long * 0.25, -long * 0.12], [-long * 0.42, 0], [-long * 0.25, long * 0.12], [long * 0.2, long * 0.16]]);
  nbPaint("#b8c4b0", nbGrad(0, -long * 0.17, 0, long * 0.16, "#5a7a68", "#eef2e6"));
  pen.save();
  pen.translate(-long * 0.42, 0);
  pen.rotate(flap);
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.lineTo(-long * 0.22, -long * 0.14);
  pen.quadraticCurveTo(-long * 0.16, 0, -long * 0.22, long * 0.14);
  pen.closePath();
  nbPaint("#8aa088");
  pen.restore();
  nbOval(long * 0.34, -long * 0.03, long * 0.04, long * 0.04);
  nbFill("#141414");
  pen.restore();
}

// The kingfisher's head about (hx, hy), the bill pointing "aim" (radians), opened "open" (0 to 1); k a palette;
// fish, true for a fish held crosswise; e a feeling or null. Returns nothing: it draws with pen.
// e.g. kfHead(14, -92, 0.15, KINGFISHER.whitethroat, 0, false, clock, null);
function kfHead(hx, hy, aim, k, open, fish, t, e) {
  pen.save();
  pen.translate(hx, hy);
  pen.rotate(aim);
  var gape = open * 0.35;
  if (open > 0.03) {                                 // the inside of the mouth as it calls
    pen.beginPath();
    pen.moveTo(12, 2);
    pen.lineTo(52, 0);
    pen.lineTo(12 + 42 * Math.cos(gape), 4 + 42 * Math.sin(gape));
    pen.closePath();
    nbFill("#e8806a");
  }
  pen.save();                                        // rule 1: the lower half of the dagger
  pen.translate(12, 3);
  pen.rotate(gape);
  pen.beginPath();
  pen.moveTo(0, -1);
  pen.lineTo(44, -1);
  pen.quadraticCurveTo(22, 7, 0, 7);
  pen.closePath();
  nbPaint(k.bill, nbGrad(0, 0, 44, 0, k.bill, k.billTip));
  pen.restore();
  lbSmooth([[15, -9], [6, -17], [-6, -18], [-16, -13], [-19, -2], [-15, 9], [-4, 15], [8, 13], [15, 6]]);   // the big head
  nbPaint(k.head, nbGrad(0, -18, 0, 15, k.headLight, k.head));
  pen.save();
  pen.clip();
  if (k.spots) {                                     // rule 4: the common one's crown spotted pale blue
    for (var s = 0; s < 22; s++) {
      nbOval(-14 + (s * 7) % 26, -15 + ((s * 5) % 9), 1.3, 0.9, 0.3);
      nbFill(k.spots);
    }
    lbSmooth([[10, 0], [2, -4], [-10, -2], [-14, 6], [-4, 9], [8, 6]]);   // its orange cheek, and the white patch behind it
    nbFill(k.cheek);
    nbOval(-15, 5, 4.5, 3.6);
    nbFill(k.throat);
    nbOval(2, 8, 12, 4);                             // the dark stripe from the bill under the cheek
    nbFill(blend(k.head, "#000000", 0.2));
  }
  lbSmooth([[16, 2], [15, 10], [8, 16], [-1, 17], [3, 10], [10, 4]]);   // the white throat, under the bill
  nbFill(k.throat);
  pen.restore();
  pen.beginPath();                                   // rule 1: the upper half, a straight dagger from the brow, deep at its base
  pen.moveTo(11, -7);
  pen.quadraticCurveTo(32, -6, 58, 2);
  pen.quadraticCurveTo(32, 4, 11, 4);
  pen.closePath();
  nbPaint(k.bill, nbGrad(11, -7, 58, 2, k.bill, k.billTip));
  pen.strokeStyle = "rgba(255, 255, 255, 0.45)";
  pen.lineWidth = LINE;
  pen.beginPath(); pen.moveTo(16, -5.5); pen.quadraticCurveTo(34, -5, 50, -1); pen.stroke();
  nbEye(5, -5, 2.8, k.eye, e, k.head);
  if (!e) { nbOval(5.8, -5.9, 0.9, 0.9); nbFill("rgba(255, 255, 255, 0.9)"); }
  if (fish) { kfFish(34, 3, 30, t); }
  pen.restore();
}

// The kingfisher (rules above), its feet on (x, y) on a perch, or in the air with (x, y) the middle of its body;
// at second t.
//   look   KINGFISHER_KEYS: size, face, kind, bob, call, watch, hover, dive, fly, fish, beat, seed, feel
// Returns nothing: it draws with pen (nbBegin() and nbEnd(): pen and LINE as they were).
// e.g. kingfisher(900, 420, clock, {watch: 1});
function kingfisher(x, y, t, look) {
  look = look || {};
  checkNames("The kingfisher's name", look, KINGFISHER_KEYS);
  var k = KINGFISHER[look.kind || "whitethroat"] || KINGFISHER.whitethroat;
  var e = look.feel !== undefined ? creatureFeel(look, t) : null, own = t + (look.seed || 0);
  var keep = lbBegin(x, y, look, k.unit, 0.7);
  var tailHow = {colour: k.tail, tipColour: k.tailTip, sheen: 0.6, sheenColour: "rgba(160, 240, 255, A)"};
  var airborne = look.hover || look.fly || look.dive;
  if (airborne) {                                    // rule 6: the body level (fly), tilted up (hover) or turned head down (dive)
    var dive = clamp(look.dive || 0), hover = look.hover ? 1 : 0, rate = hover ? 9 : 7;
    var beat = (own * rate) % 1, lift = Math.cos(beat * Math.PI * 2), opening = Math.max(0, Math.sin(beat * Math.PI * 2));
    pen.rotate(dive * Math.PI * 0.5 - hover * 0.55);
    if (!hover) { pen.translate(0, 3 * lift * (1 - dive)); }
    var tuck = lbEase(dive * 1.4);                   // diving, the wings sweep back and fold
    if (tuck < 0.95) {
      pen.save();
      pen.translate(-4, -8);
      pen.rotate(-tuck * 1.1);
      nbLift(mix(hover ? 0.5 + 0.5 * lift : lift, 0.15, tuck) * 0.92);
      if (hover) { pen.globalAlpha *= 0.55; }
      lbWingOpen(kfWing(k, 0.4), opening * (1 - tuck));
      pen.restore();
    }
    lbTail([-28, 2], Math.PI + 0.1 + hover * 0.5, 8, 34, 0.86, 10, 0.2 + hover * 0.7, tailHow);
    lbSmooth([[30, -10], [10, -16], [-14, -12], [-30, -2], [-24, 8], [0, 12], [22, 10], [32, 2]]);
    nbPaint(k.belly, nbGrad(0, -16, 0, 12, k.back, k.belly));
    pen.save();
    pen.clip();
    lbSmooth([[30, -10], [10, -17], [-14, -13], [-30, -3], [-10, -6], [12, -8]]);   // rule 2: the bright back
    nbFill(nbGrad(0, -17, 0, -4, k.backLight, k.back));
    pen.restore();
    kfHead(40, -6, hover * 0.75 - dive * 0.1, k, 0, look.fish, own, e);
    if (tuck > 0.5) { lbFolded([18, -10], [-30, -4], 14, kfWing(k, 0)); }
    else {
      pen.save();
      pen.translate(6, -10);
      pen.rotate(-tuck * 1.1);
      nbLift(mix(hover ? 0.5 + 0.5 * lift : lift, 0.15, tuck));
      if (hover) {                                   // hovering, a blur: two faint wings and one beating
        pen.save(); pen.globalAlpha *= 0.25; nbLift(1); lbWingOpen(kfWing(k, 0), 0); pen.restore();
      }
      lbWingOpen(kfWing(k, 0), opening * (1 - tuck));
      pen.restore();
    }
  } else {
    var call = clamp(look.call || 0), watch = clamp(look.watch || 0), beatFish = clamp(look.beat || 0);
    var bobbing = look.bob === false ? 0 : lbPulse(own, 2.6, 0.5, 0);
    var whack = beatFish * Math.sin(own * 6.5);       // rule 6: the fish swung down hard on one side, then the other
    lbFoot(-2, -14, -3, 0, 3.4, 8, blend(k.leg, "#2a1010", 0.3), 0, false);
    pen.translate(0, bobbing * 3);
    pen.translate(0, -16);
    pen.rotate(-0.18 + watch * 0.12 + bobbing * 0.12 + whack * 0.12);
    pen.translate(0, 16);
    var pump = bobbing * 0.4 + call * (0.25 + 0.2 * Math.sin(own * 16)) - 0.05;   // rule 5: the tail pumped
    lbTail([-10, -26], Math.PI * 0.6 - pump, 8, 44, 0.86, 11, 0.08 + call * 0.4, tailHow, 0.01 * Math.sin(own * 3));
    lbSmooth([[10, -84], [-8, -76], [-18, -52], [-16, -30], [-4, -17], [11, -20], [21, -36], [25, -56], [23, -76]]);
    nbPaint(k.belly, nbGrad(-10, -60, 20, -40, blend(k.belly, "#000000", 0.15), k.bellyLight));
    pen.save();
    pen.clip();
    lbSmooth([[24, -88], [10, -82], [6, -62], [11, -44], [22, -46], [27, -66]]);   // rule 2: the white bib down the breast's middle
    nbFill(k.throat);
    lbSmooth([[10, -84], [-6, -74], [-16, -50], [-12, -50], [-2, -70]]);   // the bright back, over the wing's top
    nbFill(nbGrad(0, -84, -14, -50, k.backLight, k.back));
    pen.restore();
    lbFoot(2, -14, 3, 0, 3.6, 9, k.leg, 0, false);
    lbFolded([6, -78], [-24, -24], 25, kfWing(k, 0), call * 0.4);
    var aim = watch * 0.7 - call * 0.55 + bobbing * 0.25 + whack * 0.9 + (e ? 0.4 * e.nod - 0.25 * e.raise : 0) + 0.06 * Math.sin(own * 0.9) * (1 - watch);
    kfHead(12, -92 + call * -3, aim, k, call * (0.3 + 0.7 * Math.abs(Math.sin(own * 18))), look.fish, own, e);
  }
  nbEnd(keep);
}

// ---------- the parakeet ----------
// The red-breasted parakeet (Psittacula alexandri, นกแขกเต้า): "แขกเต้าปีกเขียวขจี", the parakeet "with wings of
// bright green", flies in the northern verse quoted by the study of the Hatsadiling bier (ปราสาทศพนกหัสดีลิงค์
// ในล้านนา); and the blossom-headed parakeet (Psittacula roseata, นกแก้วหัวแพร), the north's other (kind:
// "blossom"). Read from photographs of each:
//   1. A big round head and a short hooked bill, the upper half curved down over the lower; the eye pale.
//   2. The red-breasted: the head soft lavender grey, a thin black line from the bill to the eye, a broad black
//      band from under the bill back along the jaw; the breast rosy salmon; the nape and the belly green. The
//      cock's upper bill red, tipped yellow, the lower black; the hen's both black.
//   3. The blossom-headed: the head rose on the face, plum and blue toward the nape, a black chin and a thin black
//      collar, a pale green ring behind it; the body yellowish green, a small maroon patch on the shoulder; the
//      upper bill yellow. The hen's head grey-mauve, with no patch.
//   4. The wings green, a yellowish patch on the coverts (the red-breasted), the flight feathers darker, bluer.
//   5. The tail very long and graduated, the two middle feathers longest: blue, tipped pale yellow.
//   6. It grips with two toes forward and two back; it climbs using its bill as a third foot; it holds its food in
//      one foot and bites from it; it preens, shakes its feathers out, and calls with its head bobbing, loud.
//   7. It flies fast and straight, the wings pointed, the long tail streaming.
// The look's names: size, face, kind ("redbreast" or "blossom"), hen (true), climb (a number that grows while it
// climbs up a branch; without it, it sits), eat (0 to 1: a fruit held in its foot to its bill, nibbled), preen (0
// to 1: its head turned back into its wing), call (0 to 1), shake (0 to 1: it shakes its feathers out), fly (true:
// in flight; (x, y) the middle of its body), seed, feel.

var PARAKEET = {
  redbreast: {head: "#a6a4c2", headLight: "#c4c4dc", cap: "#a6a4c2", band: "#18181c", breast: "#e9917c", breastLight: "#f4b2a0",
              nape: "#58b852", body: "#6cc25a", bodyLight: "#9adc7c", wing: "#4aa844", wingTip: "#2a7a3a", patch: "#c4c650",
              primary: "#2e7c60", primaryTip: "#1c4a42", tail: "#4a94cc", tailTip: "#e4e09a", tailOuter: "#5ab45a",
              bill: "#d8303a", billTip: "#f0c840", lower: "#1a1a1c", eye: "#efe6a8", leg: "#808890", shoulder: null, ring: null},
  blossom: {head: "#e46e9e", headLight: "#f496bc", cap: "#8a74c8", band: "#18181c", breast: "#9ad648", breastLight: "#c0ea70",
            nape: "#7ad8b0", body: "#94d044", bodyLight: "#c0ea70", wing: "#78bc3a", wingTip: "#3e8a3a", patch: null,
            primary: "#3a8a5e", primaryTip: "#1e4a40", tail: "#3a9ab8", tailTip: "#ece69a", tailOuter: "#6abc4a",
            bill: "#f0c048", billTip: "#f6dc86", lower: "#2a2620", eye: "#efe6a8", leg: "#8a9098", shoulder: "#8a2a3a", ring: "#9ae0c0"}};

// The parakeet's palette for its kind and sex. Returns an object.
// e.g. var p = parakeetPalette({kind: "blossom", hen: true});
function parakeetPalette(look) {
  var p = Object.assign({}, PARAKEET[look.kind === "blossom" ? "blossom" : "redbreast"]);
  if (look.hen) {
    if (look.kind === "blossom") { p.head = "#9e96aa"; p.headLight = "#bcb4c6"; p.cap = "#8a84a0"; p.shoulder = null; p.bill = "#e8d290"; p.billTip = "#f4e6b0"; }
    else { p.bill = "#1c1c1e"; p.billTip = "#3a3a3c"; }
  }
  return p;
}

// The parakeet's wing, for lbFolded() and lbWingOpen(); dark (0 to 1) for the far wing. Returns an object.
// e.g. lbFolded([12, -86], [-12, -30], 22, parakeetWing(p, 0));
function parakeetWing(p, dark) {
  var d = function (colour) { return blend(colour, "#10241a", dark || 0); };
  return {span: 100, chord: 36, n: 10, fingers: 0, primary: d(p.primary), primaryTip: d(p.primaryTip), secondary: d(p.wing), secondaryTip: d(p.wingTip),
          tertial: d(p.wing), tertialTip: d(p.wing), covert: d(p.patch || p.wing), covertTip: d(p.wing), small: d(p.shoulder || p.wing),
          smallTip: d(p.wing), lesser: d(p.shoulder || p.body), sheen: 0.5, shaft: "rgba(230, 255, 210, 0.3)"};
}

// The parakeet's head about (hx, hy), the bill pointing "aim" (radians), opened "open"; p a palette; e a feeling
// or null. Returns [x, y], the tip of the bill on the sheet.
// e.g. parakeetHead(14, -104, 0, p, 0, null);
function parakeetHead(hx, hy, aim, p, open, e) {
  pen.save();
  pen.translate(hx, hy);
  pen.rotate(aim);
  lbSmooth([[14, -8], [6, -16], [-6, -17], [-15, -9], [-16, 4], [-8, 14], [6, 15], [14, 8]]);   // rule 1: the big round head
  nbPaint(p.head, nbGrad(-4, -17, 6, 15, p.headLight, p.head));
  pen.save();
  pen.clip();
  if (p.cap !== p.head) {                            // rule 3: plum and blue toward the nape
    var g = pen.createLinearGradient(6, -6, -16, 4);
    g.addColorStop(0, "rgba(0, 0, 0, 0)");
    g.addColorStop(0.6, p.cap);
    g.addColorStop(1, p.cap);
    pen.fillStyle = g;
    pen.fillRect(-18, -18, 34, 34);
  }
  if (p.ring) {                                      // rule 3: the black collar and the pale ring behind it
    pen.strokeStyle = p.band;
    pen.lineWidth = 2.4;
    pen.beginPath(); pen.moveTo(-17, -2); pen.quadraticCurveTo(-12, 12, 2, 16); pen.stroke();
    pen.strokeStyle = p.ring;
    pen.lineWidth = 2.2;
    pen.beginPath(); pen.moveTo(-19, -4); pen.quadraticCurveTo(-14, 13, 0, 19); pen.stroke();
  }
  pen.fillStyle = p.band;                            // rule 2: the broad black band from under the bill along the jaw (the blossom-headed's, a black chin)
  lbSmooth(p.ring ? [[13, 6], [6, 12], [0, 14], [8, 9]] : [[13, 4], [8, 11], [-4, 13], [-10, 10], [-2, 8], [8, 6]]);
  pen.fill();
  pen.restore();
  if (!p.ring) {                                     // the thin line from the bill to the eye
    pen.strokeStyle = p.band;
    pen.lineWidth = 1.6;
    pen.beginPath(); pen.moveTo(12, -6); pen.quadraticCurveTo(8, -7, 6, -5.5); pen.stroke();
  }
  var gape = open * 0.4;
  pen.save();                                        // the lower bill, short and deep
  pen.translate(12, 3);
  pen.rotate(gape);
  lbSmooth([[0, -2], [7, -2], [10, 2], [6, 6], [0, 5]]);
  nbPaint(p.lower);
  pen.restore();
  pen.beginPath();                                   // rule 1: the upper bill, curved down over the lower to a hook
  pen.moveTo(10, -8);
  pen.bezierCurveTo(20, -10, 25, -2, 23, 8);
  pen.quadraticCurveTo(21, 12, 19, 9);
  pen.quadraticCurveTo(19, 3, 12, 2);
  pen.closePath();
  nbPaint(p.bill, nbGrad(10, -8, 22, 10, p.bill, p.billTip));
  pen.strokeStyle = "rgba(255, 255, 255, 0.5)";
  pen.lineWidth = LINE;
  pen.beginPath(); pen.moveTo(13, -7.5); pen.quadraticCurveTo(19, -7, 21, -1); pen.stroke();
  nbOval(3.5, -5, 3.6, 3.6);                         // the pale eye in a fine ring
  nbFill("#e8e4dc");
  nbEye(3.5, -5, 2.8, p.eye, e, p.head, "#1a1410");
  if (!e) { nbOval(4.4, -6, 0.8, 0.8); nbFill("rgba(255, 255, 255, 0.95)"); }
  var tip = pen.getTransform().transformPoint(new DOMPoint(21, 9));
  pen.restore();
  return [tip.x, tip.y];
}

// A small red fig (มะเดื่อ), held: about (x, y), r across. Returns nothing: it draws with pen.
// e.g. parakeetFig(30, -80, 6);
function parakeetFig(x, y, r) {
  nbOval(x, y, r, r * 1.1);
  nbPaint("#c8384a", nbGrad(x - r, y - r, x + r, y + r, "#f07a6a", "#8a1a34"));
  nbOval(x - r * 0.35, y - r * 0.4, r * 0.3, r * 0.2);
  nbFill("rgba(255, 255, 255, 0.6)");
  nbLimb([[x, y - r], [x + 1, y - r - 3]], 1.2, "#6a7a3a");
}

// The parakeet (rules above), its feet on (x, y) gripping a branch, or flying with (x, y) the middle of its body;
// at second t.
//   look   PARAKEET_KEYS: size, face, kind, hen, climb, eat, preen, call, shake, fly, seed, feel
// Returns {bill: [x, y]}, the tip of its bill on the sheet. It draws with pen (nbBegin() and nbEnd(): pen and LINE
// as they were).
// e.g. parakeet(900, 420, clock, {eat: 1});
function parakeet(x, y, t, look) {
  look = look || {};
  checkNames("The parakeet's name", look, PARAKEET_KEYS);
  var p = parakeetPalette(look), e = look.feel !== undefined ? creatureFeel(look, t) : null, own = t + (look.seed || 0), bill;
  var keep = lbBegin(x, y, look, 0.45, 0.75);
  var tailHow = {colour: p.tailOuter, tipColour: blend(p.tailOuter, p.tail, 0.5), sheen: 0.5};
  function tail(root, angle, spread, wave) {         // rule 5: the outer feathers green, the two middle ones long, blue tipped pale yellow
    lbTail(root, angle, 8, 60, 0.5, 11, spread, tailHow, wave);
    lbFeather(root, [root[0] + Math.cos(angle + 0.02) * 100, root[1] + Math.sin(angle + 0.02) * 100], 12,
              {colour: p.tail, tipColour: blend(p.tail, "#10305a", 0.3), sheen: 0.5, round: 0.2, band: [0.84, 1.3, p.tailTip]});
    lbFeather(root, [root[0] + Math.cos(angle - 0.03) * 96, root[1] + Math.sin(angle - 0.03) * 96], 12,
              {colour: p.tail, tipColour: blend(p.tail, "#10305a", 0.3), sheen: 0.6, round: 0.2, band: [0.84, 1.3, p.tailTip]});
  }
  if (look.fly) {                                    // rule 7: fast, the wings pointed, the tail streaming
    var beat = (own * 5.5) % 1, lift = Math.cos(beat * Math.PI * 2), opening = Math.max(0, Math.sin(beat * Math.PI * 2));
    pen.translate(0, 4 * lift);
    pen.save(); pen.translate(-3, -10 - 4 * Math.max(0, lift)); nbLift(lift * 0.92); lbWingOpen(parakeetWing(p, 0.4), opening); pen.restore();
    tail([-30, 2], Math.PI + 0.03, 0.12, 0.03 * Math.sin(own * 6));
    lbSmooth([[30, -10], [10, -16], [-16, -12], [-32, -2], [-26, 8], [0, 12], [22, 10], [32, 2]]);
    nbPaint(p.body, nbGrad(0, -16, 0, 12, p.nape, p.breast));
    bill = parakeetHead(38, -6, 0.05 * Math.sin(own * 2), p, 0, e);
    pen.save(); pen.translate(6, -10); nbLift(lift); lbWingOpen(parakeetWing(p, 0), opening); pen.restore();
  } else {
    var climbing = look.climb !== undefined, climb = look.climb || 0, eat = clamp(look.eat || 0), preen = clamp(look.preen || 0);
    var call = clamp(look.call || 0), shake = clamp(look.shake || 0);
    var reach = climbing ? Math.max(0, Math.sin((climb % 1) * Math.PI * 2)) : 0;   // rule 6: climbing, it reaches up with its bill, then pulls its feet after
    var jitter = shake * Math.sin(own * 38) * 0.12;
    var hop = climbing ? Math.max(0, -Math.sin((climb % 1) * Math.PI * 2)) : 0;
    lbFoot(-2, -16, -4 + hop * 4, -hop * 6, 3.6, 8, blend(p.leg, "#202428", 0.3), hop, true);
    pen.translate(0, -16);
    pen.rotate(-0.08 + reach * 0.5 + jitter + call * 0.08 * Math.sin(own * 9));
    pen.translate(0, 16);
    tail([-6, -30], Math.PI * 0.56 + 0.04 * Math.sin(own * 0.9) - reach * 0.3, 0.1 + shake * 0.4, 0.02 * Math.sin(own * 2) + shake * 0.05 * Math.sin(own * 30));
    var fluffy = 1 + shake * 0.14 * Math.abs(Math.sin(own * 19)), breathe = 0.6 * Math.sin(own * 2.6);
    pen.save();
    pen.translate(4, -56);
    pen.scale(fluffy, fluffy);
    pen.translate(-4, 56);
    lbSmooth([[10, -94], [-6, -82], [-14, -58], [-12, -34], [-4, -22], [8, -20], [16, -36], [21 + breathe * 0.4, -58], [21, -78], [16, -92]]);
    nbPaint(p.body, nbGrad(0, -90, 0, -20, p.nape, p.bodyLight));
    pen.save();
    pen.clip();
    lbSmooth([[24, -92], [8, -88], [3, -66], [7, -44], [22, -38], [27, -66]]);   // rule 2: the rosy breast (the blossom-headed's green)
    nbFill(nbGrad(10, -86, 24, -42, p.breastLight, p.breast));
    nbScales(6, 5, -10, -86, 8, 7, 3.6, "rgba(40, 80, 30, 0.22)");
    pen.restore();
    pen.restore();
    lbFoot(4, -16, 4 + (eat > 0.5 ? 0 : hop * 3), eat > 0.5 ? 0 : -hop * 4, 3.8, 9, p.leg, eat > 0.5 ? 0 : hop, true);
    if (eat > 0) {                                   // rule 6: the near foot raised with the fig to the bill
      var hold = [mix(8, 26, eat), mix(-16, -90, eat) + 2 * Math.sin(own * 5) * eat];
      nbLimb([[6, -40], [mix(10, 22, eat), mix(-30, -70, eat)], hold], 3.8, p.leg);
      parakeetFig(hold[0] + 3, hold[1] - 6, 6.5);
      nbLimb([[hold[0], hold[1]], [hold[0] + 6, hold[1] - 4]], 2.4, p.leg);
      nbLimb([[hold[0], hold[1]], [hold[0] + 5, hold[1] + 2]], 2.4, p.leg);
    }
    lbFolded([6, -86], [-14, -28], 19, parakeetWing(p, 0), shake * 0.8 + call * 0.3);
    var nibble = eat * 0.15 * Math.max(0, Math.sin(own * 7)), tilt = 0.25 * Math.sin(own * 0.6) * (1 - eat) * (1 - preen) * (1 - call);
    var aim = -tilt + eat * 0.55 + nibble - call * 0.3 * (0.5 + 0.5 * Math.sin(own * 9)) + reach * -0.3 + (e ? 0.4 * e.nod - 0.25 * e.raise : 0);
    var hx = 12 + reach * 10, hy = -104 - reach * 10 + call * 4 * Math.sin(own * 9);
    if (preen > 0) {                                 // rule 6: preening, the head turned back over the shoulder into the wing
      hx = mix(hx, -2, preen); hy = mix(hy, -84, preen);
      aim = mix(aim, 2.5 + 0.12 * Math.sin(own * 8), preen);
    }
    bill = parakeetHead(hx, hy, aim, p, call * Math.abs(Math.sin(own * 9)) + eat * 0.25 * Math.max(0, Math.sin(own * 7)), e);
  }
  nbEnd(keep);
  return {bill: bill};
}
