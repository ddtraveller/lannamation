// khom.js - the hanging paper lantern of Lanna (โคมล้านนา, the khom hung up
// for Yi Peng), for films made with oldcartoon.js. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="khom.js"></script>
//
// and call khom(x, y, look) from a scene: (x, y) is where its string is
// tied, and the lantern hangs below it. It is drawn on the kit's sheet,
// "pen", at the kit's second, "clock", and it is a plain function of time:
// nothing is kept between frames, so a still is the film's own frame.
//
// Nothing is copied. It was read by eye from a drawing of three such
// lanterns, red, blue and green, each worked in gold, and this file keeps
// what the lanterns do, as rules, and draws its own in the kit's manner,
// flat colour inside a fine line:
//   1. A crown of three paper points on top: the middle one tallest, the
//      two beside it shorter and leaning out.
//   2. A body of eight sides in three rings: sloping panels above, upright
//      panels in the middle, where it is widest, sloping panels below. The
//      front panel faces us, and the panels beside it are seen aslant.
//   3. Every edge of the paper is bound in a gold ribbon with a toothed
//      edge, and a band of gold rings the top and the foot.
//   4. A gold flower in every panel: the one on the front panel sits in a
//      diamond frame, the others are stars.
//   5. Under the body a long tail, as wide as the foot of the body, with
//      three flowers down it and a point at its end; and behind it, to each
//      side, a narrow streamer, a little shorter, ending in a point.
//   6. The paper is one colour; all the work on it is gold.
//
// What moves, all of it from "clock" and none of it kept:
//   - it swings on its string, slowly, as a breeze takes it, and turns a
//     little on the string, so the side panels come and go;
//   - the tail and the streamers sway in the breeze, more toward their ends,
//     the end trailing the root;
//   - lit, a candle inside it flickers: the front of the body glows and a
//     warm light lies round it, which shows on a dark backdrop;
//   - carried along a course, it hangs back against the way it goes: the
//     film gives it that as "lean".
//
// The look (every name is in KHOM_KEYS below):
//   size    1 is a lantern about 430 tall and 110 wide, from the tie down
//   colour  the paper: KHOM_RED, KHOM_BLUE, KHOM_GREEN or any "#rrggbb"
//   gold    the gold of the ribbons and the flowers
//   lit     0 to 1: how bright the candle inside it is (0 by day, 1 at night)
//   sway    0 to 1: how far it swings in the breeze (1 is about 7 degrees)
//   spin    0 to 1: how far it turns on its string
//   wind    0 to 1: how far the tail and the streamers sway
//   lean    radians: a lean the film gives it over the swing; positive takes
//           the foot to the left, as a lantern carried to the right hangs
//   late    seconds added to its clock, so two lanterns do not swing as one
//   tail    false leaves off the two streamers behind the tail
var KHOM_KEYS = {};

["size", "colour", "gold", "lit", "sway", "spin", "wind", "lean", "late", "tail"].forEach(function (name) { KHOM_KEYS[name] = true; });

var KHOM_RED = "#b8362f", KHOM_BLUE = "#2d5da6", KHOM_GREEN = "#2f8a46", KHOM_GOLD = "#e8b63a";

// A gold ribbon along the path the pen holds: a fine dark line, the gold
// over it, and teeth of gold along both its edges.
function khomRibbon(gold) {
  pen.lineJoin = "round";
  pen.lineCap = "round";
  pen.strokeStyle = "rgba(60, 35, 15, 0.55)";
  pen.lineWidth = 3.6;
  pen.stroke();
  pen.strokeStyle = gold;
  pen.lineWidth = 2.2;
  pen.stroke();
  pen.setLineDash([1.6, 2.6]);
  pen.lineWidth = 4.2;
  pen.stroke();
  pen.setLineDash([]);
}

// A gold flower: eight petals round a hole where the paper shows through.
// "across" squashes it sideways, for a panel seen aslant; "turn" tilts it.
function khomFlower(cx, cy, long, gold, hole, across, turn) {
  pen.save();
  pen.translate(cx, cy);
  pen.rotate(turn || 0);
  pen.scale(across === undefined ? 1 : across, 1);
  pen.fillStyle = gold;
  pen.beginPath();
  for (var p = 0; p < 8; p++) {
    var a = p * Math.PI / 4, b = a + Math.PI / 2, w = long * 0.32;
    var tx = Math.sin(a) * long, ty = -Math.cos(a) * long;             // the petal's tip, and a point either side of its middle
    var mx = Math.sin(a) * long * 0.55, my = -Math.cos(a) * long * 0.55;
    pen.moveTo(0, 0);
    pen.quadraticCurveTo(mx + Math.sin(b) * w, my - Math.cos(b) * w, tx, ty);
    pen.quadraticCurveTo(mx - Math.sin(b) * w, my + Math.cos(b) * w, 0, 0);
  }
  pen.fill();
  pen.fillStyle = hole;
  pen.beginPath();
  pen.arc(0, 0, long * 0.2, 0, Math.PI * 2);
  pen.fill();
  pen.fillStyle = gold;
  pen.beginPath();
  pen.arc(0, 0, long * 0.08, 0, Math.PI * 2);
  pen.fill();
  pen.restore();
}

// The diamond frame round the front panel's flower, with a dot in each corner.
function khomDiamond(cx, cy, half, gold, across) {
  pen.save();
  pen.translate(cx, cy);
  pen.scale(across, 1);
  pen.strokeStyle = gold;
  pen.lineWidth = 1.6;
  pen.lineJoin = "round";
  pen.beginPath();
  pen.moveTo(0, -half);
  pen.lineTo(half * 0.78, 0);
  pen.lineTo(0, half);
  pen.lineTo(-half * 0.78, 0);
  pen.closePath();
  pen.stroke();
  pen.fillStyle = gold;
  [[0, -half], [half * 0.78, 0], [0, half], [-half * 0.78, 0]].forEach(function (c) {
    pen.beginPath();
    pen.arc(c[0], c[1], 1.8, 0, Math.PI * 2);
    pen.fill();
  });
  pen.restore();
}

// The breeze at second t: a slow pressure that comes and goes, never twice
// alike, between about -1.7 and 1.7.
function khomBreeze(t) {
  return Math.sin(t * 0.9) + 0.5 * Math.sin(t * 1.7 + 1.1) + 0.25 * Math.sin(t * 2.9 + 0.4);
}

// A ribbon of paper hanging from (cx, top), "half" wide each side, "long"
// down, that sways in the breeze: the whole of it drifts to one side and
// back, more toward its end, and its end trails its root by most of a
// second, with only a faint flutter over that. "at" is its own second.
// "end" is "point" for a streamer or "fish" for the tail's three points. It
// gives back the places of its middle every twelfth of the way, for the
// flowers.
function khomStrip(cx, top, half, long, colour, gold, wind, at, end) {
  var N = 12, left = [], right = [], mids = [], n, v, off;
  function sideways(v) {
    return wind * (18 * khomBreeze(at - v * 0.9) * Math.pow(v, 1.4) + 3 * Math.sin(v * 3.2 - at * 1.1) * v * v);
  }
  for (n = 0; n <= N; n++) {
    v = n / N;
    off = sideways(v);
    left.push([cx - half + off, top + v * long]);
    right.push([cx + half + off, top + v * long]);
    mids.push([cx + off, top + v * long, Math.atan2(sideways(Math.min(1, v + 0.04)) - sideways(Math.max(0, v - 0.04)), 0.08 * long)]);
  }
  pen.beginPath();
  pen.moveTo(left[0][0], left[0][1]);
  for (n = 1; n <= N; n++) { pen.lineTo(left[n][0], left[n][1]); }
  var foot = top + long, fo = left[N][0] + half;        // the middle of the end
  if (end === "fish") {
    pen.lineTo(fo - half * 0.5, foot - half * 0.45);
    pen.lineTo(fo, foot + half * 0.5);
    pen.lineTo(fo + half * 0.5, foot - half * 0.45);
  } else {
    pen.lineTo(fo, foot + half * 1.6);
  }
  for (n = N; n >= 0; n--) { pen.lineTo(right[n][0], right[n][1]); }
  pen.closePath();
  pen.fillStyle = colour;
  pen.fill();
  khomRibbon(gold);
  return mids;
}

function khom(x, y, look) {
  look = look || {};
  checkNames("The khom's name", look, KHOM_KEYS);
  var size = look.size === undefined ? 1 : look.size;
  var colour = look.colour || KHOM_RED, gold = look.gold || KHOM_GOLD;
  var lit = look.lit === undefined ? 0 : look.lit;
  var sway = look.sway === undefined ? 1 : look.sway, spin = look.spin === undefined ? 1 : look.spin;
  var wind = look.wind === undefined ? 1 : look.wind, late = look.late || 0, lean = look.lean || 0;
  var t = clock + late;
  // where things are, for a lantern of size 1, measured down from the tie
  var STRING = 30, TOP = STRING + 60, MID = TOP + 36, LOW = MID + 54, FOOT = LOW + 36;
  var R = 55, r = 24, TAIL = 214, STREAM = 195;        // half-widths at the middle, and at the top and foot; the tail and the streamers
  var flicker = 0.8 + 0.2 * Math.sin(t * 23 + x) * Math.sin(t * 7.3 + x * 0.5);
  var swing = sway * 0.12 * (Math.sin(t * 1.3) + 0.3 * Math.sin(t * 2.9 + 1)) + lean;
  var turn = 3 * Math.PI / 8 + spin * 0.4 * Math.sin(t * 0.55 + 0.7);    // the front panel faces us when the turn is 3pi/8
  var pale = blend(colour, "#fff6e0", 0.08), dark = blend(colour, "#2a1810", 0.35), warm = blend(colour, "#ffd070", 0.6);
  var shade = blend(colour, "#2a1810", 0.25);
  pen.save();
  pen.translate(x, y);
  pen.rotate(swing);
  pen.scale(size, size);
  if (lit > 0) {                                      // the candle's soft light round it, on whatever is behind: wide, and fading slowly
    var glowY = (MID + LOW) / 2, glow = pen.createRadialGradient(0, glowY, 0, 0, glowY, R * 5);
    glow.addColorStop(0, "rgba(255, 210, 120, " + (0.5 * lit * flicker) + ")");
    glow.addColorStop(0.25, "rgba(255, 195, 100, " + (0.26 * lit * flicker) + ")");
    glow.addColorStop(0.55, "rgba(255, 180, 90, " + (0.09 * lit * flicker) + ")");
    glow.addColorStop(1, "rgba(255, 170, 80, 0)");
    pen.fillStyle = glow;
    pen.fillRect(-R * 5, glowY - R * 5, R * 10, R * 10);
  }
  pen.strokeStyle = "rgba(60, 35, 15, 0.8)";          // the string
  pen.lineWidth = 1.4;
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.lineTo(0, STRING);
  pen.stroke();
  // the streamers first, behind the tail, then the tail, behind the body
  if (look.tail !== false) {
    khomStrip(-(r + 7), FOOT - 2, 7, STREAM, shade, gold, wind * 0.7, t + 0.35, "point");   // lighter paper: a little ahead of the tail
    khomStrip(r + 7, FOOT - 2, 7, STREAM, shade, gold, wind * 0.7, t + 0.2, "point");
  }
  var mids = khomStrip(0, FOOT - 2, r, TAIL, colour, gold, wind, t, "fish");
  [3, 6, 9].forEach(function (n) { khomFlower(mids[n][0], mids[n][1], 13, gold, colour, 1, mids[n][2]); });
  if (lit > 0) {                                      // the candle lights the top of the tail, under the body
    var fall = pen.createLinearGradient(0, FOOT, 0, FOOT + 90);
    fall.addColorStop(0, "rgba(255, 215, 130, " + (0.4 * lit * flicker) + ")");
    fall.addColorStop(1, "rgba(255, 215, 130, 0)");
    pen.fillStyle = fall;
    pen.fillRect(-r - 16, FOOT - 2, 2 * r + 32, 92);
  }
  // the body: eight sides, those that face us, each in three panels
  var k, faces = [];
  for (k = 0; k < 8; k++) {
    var a = turn + k * Math.PI / 4, b = a + Math.PI / 4, facing = Math.sin(a + Math.PI / 8);
    if (facing > 0.02) { faces.push({xa: Math.cos(a), xb: Math.cos(b), facing: facing}); }
  }
  faces.sort(function (p, q) { return p.facing - q.facing; });
  var front = faces[faces.length - 1];
  faces.forEach(function (f) {
    var across = Math.abs(f.xb - f.xa) / (2 * Math.sin(Math.PI / 8)), paper = blend(blend(dark, colour, f.facing), pale, Math.max(0, (f.facing - 0.8) * 5));   // darker aslant, a touch lighter facing us
    var glowing = blend(paper, warm, lit * flicker * f.facing * 0.3);
    var rings = [[r, TOP, R, MID, blend(glowing, "#fff6e0", 0.12), 9], [R, MID, R, LOW, glowing, 17], [R, LOW, r, FOOT, blend(glowing, "#2a1810", 0.12), 9]];
    rings.forEach(function (ring, i) {
      pen.beginPath();
      pen.moveTo(f.xa * ring[0], ring[1]);
      pen.lineTo(f.xb * ring[0], ring[1]);
      pen.lineTo(f.xb * ring[2], ring[3]);
      pen.lineTo(f.xa * ring[2], ring[3]);
      pen.closePath();
      pen.fillStyle = ring[4];
      pen.fill();
      khomRibbon(gold);
      var cx = (f.xa * ring[0] + f.xb * ring[0] + f.xa * ring[2] + f.xb * ring[2]) / 4, cy = (ring[1] + ring[3]) / 2;
      if (i === 1 && f === front) { khomDiamond(cx, cy, 22, gold, across); }
      pen.save();
      if (i !== 1) { pen.translate(cx, cy); pen.scale(1, 0.8); pen.translate(-cx, -cy); }   // the sloping panels are seen foreshortened
      khomFlower(cx, cy, ring[5], gold, ring[4], across, 0);
      pen.restore();
    });
  });
  // the crown: two points leaning out from the rim's edges, then the tallest in the middle
  var edge = faces.reduce(function (m, f) { return [Math.min(m[0], f.xa, f.xb), Math.max(m[1], f.xa, f.xb)]; }, [0, 0]);
  var cx0 = (front.xa + front.xb) / 2 * r;
  [[edge[0] * r, -1], [edge[1] * r, 1]].forEach(function (side) {
    pen.beginPath();
    pen.moveTo(side[0], TOP + 1);
    pen.lineTo(side[0] - side[1] * 10, TOP + 1);
    pen.lineTo(side[0] + side[1] * 6, TOP - 42);
    pen.closePath();
    pen.fillStyle = shade;
    pen.fill();
    khomRibbon(gold);
  });
  pen.beginPath();
  pen.moveTo(cx0 - 13, TOP + 1);
  pen.lineTo(cx0 + 13, TOP + 1);
  pen.lineTo(cx0 * 0.3, STRING);
  pen.closePath();
  pen.fillStyle = blend(colour, "#fff6e0", 0.18);
  pen.fill();
  khomRibbon(gold);
  pen.restore();
}

// ---------- More lanterns of Lanna (2026-10-16) ----------
// Four more of the north's lanterns, beside the hanging khom above; khom()
// is as it was. Each is drawn on "pen" at the kit's second, from (x, y), and
// is a plain function of time, as khom() is. What each is, from what is
// written of it (the NotebookLM notebook "Lanna material culture"): Polyglot
// Petra's "Lanna Lanterns" (the four kinds by use, tabletop, floating,
// handheld and hanging, and the shapes: cylinder, spinning, Dharmachakra,
// octagon, sixteen-angled, stars), Soodprod of Bangkok Bank on the khom
// phat, Wikipedia on Yi Peng (the khom phat that told the Vessantara Jataka,
// raised on pulleys, so also called khom lo) and the CMU Lanna Information
// Center on the lanterns of Yi Peng. No free photograph of any of the four
// was found on Wikimedia Commons: they are drawn from those words, in the
// manner of khom() (paper in one colour, every edge in a toothed gold
// ribbon), and each is to be checked against a photograph when one turns up.
//   khomPhat   the spinning lantern: a cylinder of white mulberry or kite
//              paper; inside it a frame that turns, strung with threads and
//              hung with figures cut from black paper; a little wheel of
//              vanes on top that the candle's heat turns, so the figures'
//              shadows go round the paper. Here the figures are of the
//              village (an elephant, a horse and its rider, a deer, a
//              carrier with two baskets on a pole, a buffalo, a dancer), not
//              the stories of the temple.
//   khomThue   the handheld lantern of the parades: a small lantern with a
//              handle underneath, "quite like a giant candle", in coloured
//              paper with gold, carried upright.
//   khomDao    a star lantern: a star of five points, each point a low
//              pyramid of paper, hung from its top point, with paper tails
//              from its lower points.
//   khomBua    a lotus lantern: a lotus of paper with open petals, hung
//              from above, a paper tail under it.
// The look of each (names it does not know are reported, as khom() does):
//   size, colour, gold, lit    as for khom(): 1 is the size the comments give
//   sway, late, lean           as for khom()
//   spin       khomPhat: how fast the inner frame turns (1, about a turn in
//              fourteen seconds; 0 still, as an unlit one is). khomDao: how
//              far it turns on its string, as for khom()
//   turn       khomPhat: the inner frame's angle, for a film that turns it
//              itself (a frame that starts still and gathers speed); it
//              stands in for spin times the clock
//   figures    khomPhat: the figures that go round, a list of functions, each
//              drawing one figure on "pen", standing on (0, 0) and facing
//              right, about 44 to 100 tall, given a step to walk by; the
//              black-paper cut-outs of KHOM_CUTOUTS unless a film gives its own
//   light      khomPhat: true for figures of light: the frame inside is a
//              dark drum with the figures cut out of it, so the paper is dim
//              and each figure glows on it in the candle's colour (drawn on a
//              layer of its own, whatever the figure is made of)
//   wind, tail khomDao and khomBua: as for khom()
// khomThue's (x, y) is where a hand holds its handle: draw it after the one
// who carries it, so the handle goes up through the fist (person() gives
// back the hand as joints.handA).
function khomKeys(names) {
  var keys = {};
  names.forEach(function (name) { keys[name] = true; });
  return keys;
}

var KHOM_PHAT_KEYS = khomKeys(["size", "colour", "gold", "lit", "sway", "spin", "lean", "late", "turn", "figures", "light"]);
// A sheet for the figures of light of a khom phat (see khomPhat()), made once
// at the size of the sheet it goes onto, on the CPU: a layer on the GPU drawn
// onto a sheet that is read back changes how the sheet draws (oldcartoon.js,
// WAI_LAYER).
var KHOM_LAYER = null;
var KHOM_THUE_KEYS = khomKeys(["size", "colour", "gold", "lit", "lean", "late"]);
var KHOM_DAO_KEYS = khomKeys(["size", "colour", "gold", "lit", "sway", "spin", "wind", "lean", "late", "tail"]);
var KHOM_BUA_KEYS = khomKeys(["size", "colour", "gold", "lit", "sway", "wind", "lean", "late", "tail"]);

// The candle's soft light round a lantern, centred on (0, cy) of the pen.
function khomGlow(cy, radius, lit, flicker) {
  var glow = pen.createRadialGradient(0, cy, 0, 0, cy, radius);
  glow.addColorStop(0, "rgba(255, 210, 120, " + (0.5 * lit * flicker) + ")");
  glow.addColorStop(0.25, "rgba(255, 195, 100, " + (0.26 * lit * flicker) + ")");
  glow.addColorStop(0.55, "rgba(255, 180, 90, " + (0.09 * lit * flicker) + ")");
  glow.addColorStop(1, "rgba(255, 170, 80, 0)");
  pen.fillStyle = glow;
  pen.fillRect(-radius, cy - radius, 2 * radius, 2 * radius);
}

function khomFlickerAt(t, x) { return 0.8 + 0.2 * Math.sin(t * 23 + x) * Math.sin(t * 7.3 + x * 0.5); }

// One figure cut from black paper, for the khom phat, standing on (0, 0) and
// facing right, about 44 tall; "step" swings its legs.
function khomCutout(kind, step) {
  var leg = 5 * Math.sin(step), k;
  function legs(xs, top, long) {
    pen.lineWidth = 4;
    pen.lineCap = "round";
    pen.beginPath();
    xs.forEach(function (lx, i) {
      var swing = i % 2 ? leg : -leg;
      pen.moveTo(lx, top);
      pen.lineTo(lx + swing, top + long);
    });
    pen.stroke();
  }
  pen.beginPath();
  if (kind === "elephant") {
    pen.ellipse(-2, -24, 20, 13, 0, 0, 7);
    pen.moveTo(26, -26);
    pen.arc(17, -27, 10, 0, 7);
    pen.fill();
    pen.lineWidth = 5;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(24, -24);
    pen.quadraticCurveTo(31, -14, 27, -4 + leg * 0.4);          // the trunk
    pen.moveTo(-21, -27);
    pen.lineTo(-27, -16);                                     // the tail
    pen.stroke();
    legs([-14, -6, 6, 13], -14, 14);
  } else if (kind === "rider") {
    pen.ellipse(0, -22, 17, 8, 0, 0, 7);
    pen.fill();
    pen.lineWidth = 5;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(13, -25);
    pen.lineTo(21, -36);                                      // the neck, and the head
    pen.lineTo(28, -33);
    pen.moveTo(-16, -24);
    pen.quadraticCurveTo(-24, -20, -23, -12);                 // the tail
    pen.moveTo(-2, -28);
    pen.lineTo(-1, -42);                                      // the rider, sitting up
    pen.stroke();
    pen.beginPath();
    pen.arc(-1, -47, 5, 0, 7);
    pen.fill();
    legs([-11, -6, 7, 12], -16, 16);
  } else if (kind === "deer") {
    pen.ellipse(0, -24, 15, 7, 0, 0, 7);
    pen.fill();
    pen.lineWidth = 4;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(12, -27);
    pen.lineTo(18, -40);
    pen.lineTo(24, -38);                                      // the neck and the head
    pen.moveTo(18, -41);
    pen.lineTo(14, -52);
    pen.moveTo(16, -47);
    pen.lineTo(10, -50);                                      // the antlers
    pen.moveTo(19, -41);
    pen.lineTo(24, -51);
    pen.stroke();
    legs([-10, -5, 6, 10], -19, 19);
  } else if (kind === "carrier") {
    pen.arc(0, -40, 5, 0, 7);
    pen.fill();
    pen.lineWidth = 4.5;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(0, -34);
    pen.lineTo(1, -16);                                       // the body
    pen.moveTo(-26, -32);
    pen.quadraticCurveTo(0, -36 + leg * 0.2, 26, -32);        // the pole on the shoulder, bending
    pen.stroke();
    [-24, 24].forEach(function (bx) {                         // a basket at each end, on its cords
      pen.lineWidth = 1.2;
      pen.beginPath();
      pen.moveTo(bx, -32);
      pen.lineTo(bx - 5, -16);
      pen.moveTo(bx, -32);
      pen.lineTo(bx + 5, -16);
      pen.stroke();
      pen.beginPath();
      pen.moveTo(bx - 7, -16);
      pen.lineTo(bx + 7, -16);
      pen.lineTo(bx + 5, -6);
      pen.lineTo(bx - 5, -6);
      pen.closePath();
      pen.fill();
    });
    legs([0, 2], -17, 17);
  } else if (kind === "buffalo") {
    pen.ellipse(-2, -21, 20, 11, 0, 0, 7);
    pen.moveTo(25, -22);
    pen.ellipse(19, -21, 7, 6, 0.4, 0, 7);
    pen.fill();
    pen.lineWidth = 3;
    pen.beginPath();
    pen.arc(19, -26, 9, Math.PI * 1.05, Math.PI * 1.85);       // the horns, a wide curve back
    pen.stroke();
    legs([-14, -7, 6, 12], -12, 12);
  } else {                                                    // a dancer, her hands up and turned back
    pen.arc(0, -42, 5, 0, 7);
    pen.fill();
    pen.lineWidth = 4;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(0, -36);
    pen.lineTo(0, -18);
    k = 0.4 * Math.sin(step * 0.5);
    pen.moveTo(0, -32);
    pen.lineTo(-10, -38 + 4 * k);
    pen.lineTo(-13, -48 + 4 * k);
    pen.moveTo(0, -32);
    pen.lineTo(10, -30 - 4 * k);
    pen.lineTo(16, -36 - 4 * k);
    pen.stroke();
    pen.beginPath();                                          // the skirt to the ankle
    pen.moveTo(-5, -20);
    pen.lineTo(5, -20);
    pen.lineTo(7, 0);
    pen.lineTo(-7, 0);
    pen.closePath();
    pen.fill();
  }
}

var KHOM_CUTOUTS = ["elephant", "rider", "deer", "carrier", "buffalo", "dancer"];

// The spinning lantern, hung by its string from (x, y): 150 wide and about
// 245 from the tie to the foot of its fringe, at size 1.
function khomPhat(x, y, look) {
  look = look || {};
  checkNames("The khom phat's name", look, KHOM_PHAT_KEYS);
  var size = look.size === undefined ? 1 : look.size;
  var colour = look.colour || KHOM_RED, gold = look.gold || KHOM_GOLD;
  var lit = look.lit === undefined ? 0 : look.lit, sway = look.sway === undefined ? 1 : look.sway;
  var spin = look.spin === undefined ? 1 : look.spin, t = clock + (look.late || 0);
  var flicker = khomFlickerAt(t, x), turn = look.turn !== undefined ? look.turn : 0.45 * spin * t;
  var figures = look.figures || KHOM_CUTOUTS.map(function (kind) { return function (step) { khomCutout(kind, step); }; });
  var R = 72, TOP = 46, BAND = 64, FOOT = 202, HEM = 218;
  pen.save();
  pen.translate(x, y);
  pen.rotate(sway * 0.06 * (Math.sin(t * 1.1) + 0.3 * Math.sin(t * 2.3 + 1)) + (look.lean || 0));
  pen.scale(size, size);
  if (lit > 0) { khomGlow((BAND + FOOT) / 2, R * 4.5, lit, flicker); }
  pen.strokeStyle = "rgba(60, 35, 15, 0.8)";                  // the string, to the axle of the vanes
  pen.lineWidth = 1.4;
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.lineTo(0, TOP - 14);
  pen.stroke();
  var paper = look.light ? blend("#4a3524", "#8a5c34", lit * flicker * 0.6)   // the drum inside keeps most of the light from the paper
                         : blend("#f1ebdc", "#ffe2a0", lit * flicker * 0.75);
  pen.beginPath();                                            // the cylinder of paper, its foot seen a little from below
  pen.moveTo(-R, BAND);
  pen.lineTo(-R, FOOT);
  pen.ellipse(0, FOOT, R, 11, 0, Math.PI, 0, true);
  pen.lineTo(R, BAND);
  pen.closePath();
  pen.fillStyle = paper;
  pen.fill();
  if (lit > 0) {                                              // brightest in the middle, where the candle is nearest
    var inside = pen.createRadialGradient(0, 140, 4, 0, 140, R * 1.2);
    inside.addColorStop(0, "rgba(255, 245, 210, " + ((look.light ? 0.2 : 0.6) * lit * flicker) + ")");
    inside.addColorStop(1, "rgba(255, 245, 210, 0)");
    pen.fillStyle = inside;
    pen.fill();
  }
  pen.save();                                                 // the figures, going round: shadows, or light
  pen.clip();
  var sheet = pen, glowing = look.light && pen.canvas, frame = pen.getTransform(), box = null;
  if (glowing) {                                              // each figure is drawn whole on a layer of its own, then lit, then faded
    if (!KHOM_LAYER || KHOM_LAYER.canvas.width !== pen.canvas.width || KHOM_LAYER.canvas.height !== pen.canvas.height) {
      var layerSheet = document.createElement("canvas");
      layerSheet.width = pen.canvas.width;
      layerSheet.height = pen.canvas.height;
      KHOM_LAYER = layerSheet.getContext("2d", {willReadFrequently: true});
    }
    var corners = [[-R, BAND], [R, BAND], [-R, FOOT + 12], [R, FOOT + 12]].map(function (c) { return frame.transformPoint(new DOMPoint(c[0], c[1])); });
    var left = Math.max(0, Math.floor(Math.min.apply(null, corners.map(function (p) { return p.x; }))));
    var top = Math.max(0, Math.floor(Math.min.apply(null, corners.map(function (p) { return p.y; }))));
    var right = Math.min(pen.canvas.width, Math.ceil(Math.max.apply(null, corners.map(function (p) { return p.x; }))));
    var bottom = Math.min(pen.canvas.height, Math.ceil(Math.max.apply(null, corners.map(function (p) { return p.y; }))));
    if (right > left && bottom > top) { box = [left, top, right - left, bottom - top]; }   // the paper on the sheet: all the layer's work is inside it
  }
  sheet.fillStyle = sheet.strokeStyle = "rgba(26, 18, 12, " + (0.22 + 0.68 * lit) + ")";
  figures.forEach(function (figure, k) {
    var a = turn + k * 2 * Math.PI / figures.length, front = Math.cos(a), fade = Math.min(1, front * 2.5);
    if (front < 0.05 || (glowing && !box)) { return; }
    if (glowing) {                                            // a figure drawn at a part of its strength shows its own overlaps: draw it whole
      KHOM_LAYER.setTransform(1, 0, 0, 1, 0, 0);
      KHOM_LAYER.clearRect(box[0], box[1], box[2], box[3]);
      KHOM_LAYER.setTransform(frame);
      pen = KHOM_LAYER;
    }
    pen.save();
    pen.translate(R * 0.86 * Math.sin(a), 180);
    pen.scale(front * 0.85 + 0.15, 1);
    if (!glowing) { pen.globalAlpha = fade; }
    figure(t * 5 + k);
    pen.restore();
    if (glowing) {                                            // in the candle's colour, then onto the paper, faded at the side, with its glow
      pen.save();
      pen.setTransform(1, 0, 0, 1, 0, 0);
      pen.globalCompositeOperation = "source-in";
      pen.fillStyle = blend("#ffe6a8", "#fff8e4", lit * flicker);
      pen.fillRect(box[0], box[1], box[2], box[3]);
      pen.restore();
      pen = sheet;
      pen.save();
      pen.setTransform(1, 0, 0, 1, 0, 0);
      pen.globalAlpha = fade;
      pen.shadowColor = "rgba(255, 214, 130, " + (0.9 * lit) + ")";
      pen.shadowBlur = 6 * Math.hypot(frame.a, frame.b);    // the glow keeps its size against the figure's, near or far
      pen.drawImage(KHOM_LAYER.canvas, box[0], box[1], box[2], box[3], box[0], box[1], box[2], box[3]);
      pen.restore();
    }
  });
  pen.restore();
  pen.strokeStyle = "rgba(110, 80, 40, 0.5)";                // the frame's posts of bamboo, through the paper
  pen.lineWidth = 1.6;
  pen.beginPath();
  [-R + 3, -R * 0.45, R * 0.45, R - 3].forEach(function (px) { pen.moveTo(px, BAND); pen.lineTo(px, FOOT + 6); });
  pen.stroke();
  pen.beginPath();                                            // the paper's outline
  pen.moveTo(-R, BAND);
  pen.lineTo(-R, FOOT);
  pen.ellipse(0, FOOT, R, 11, 0, Math.PI, 0, true);
  pen.lineTo(R, BAND);
  pen.strokeStyle = "rgba(90, 60, 30, 0.6)";
  pen.lineWidth = 1.5;
  pen.stroke();
  pen.beginPath();                                            // the band of coloured paper at the top, with its flowers
  pen.ellipse(0, TOP, R, 11, 0, Math.PI, 0);
  pen.lineTo(R, BAND);
  pen.ellipse(0, BAND, R, 11, 0, 0, Math.PI);
  pen.closePath();
  pen.fillStyle = blend(colour, "#ffd070", lit * flicker * 0.25);
  pen.fill();
  khomRibbon(gold);
  [-48, -16, 16, 48].forEach(function (fx) { khomFlower(fx, (TOP + BAND) / 2 + 5, 7, gold, colour, 1 - Math.abs(fx) / 110, 0); });
  pen.beginPath();                                            // the band at the foot, and a fringe of cut paper under it
  pen.ellipse(0, FOOT, R, 11, 0, 0, Math.PI);
  pen.lineTo(-R, FOOT + 9);
  pen.ellipse(0, FOOT + 9, R, 11, 0, Math.PI, 0, true);
  pen.closePath();
  pen.fillStyle = colour;
  pen.fill();
  khomRibbon(gold);
  pen.fillStyle = blend(colour, "#2a1810", 0.2);
  pen.beginPath();
  for (var k = 0; k < 14; k++) {
    var fx = -R + 4 + k * (2 * R - 8) / 13, fy = FOOT + 9 + 11 * Math.sqrt(Math.max(0, 1 - fx * fx / (R * R)));
    var flap = 2.5 * Math.sin(t * 2.2 + k * 0.8);
    pen.moveTo(fx - 5, fy);
    pen.lineTo(fx + flap, fy + HEM - FOOT);
    pen.lineTo(fx + 5, fy);
  }
  pen.fill();
  pen.save();                                                 // the vanes on top, turning with the frame
  pen.translate(0, TOP - 8);
  pen.strokeStyle = "#7a5a32";
  pen.lineWidth = 2;
  pen.beginPath();
  pen.moveTo(0, -6);
  pen.lineTo(0, 10);
  pen.stroke();
  for (k = 0; k < 6; k++) {
    var va = turn * 2 + k * Math.PI / 3, vx = 22 * Math.cos(va), vz = Math.sin(va);
    pen.beginPath();
    pen.moveTo(0, 0);
    pen.lineTo(vx, 3 * vz - 3);
    pen.lineTo(vx * 0.9, 3 * vz + 4);
    pen.closePath();
    pen.fillStyle = vz > 0 ? "#f6efdc" : "#d8cdb4";
    pen.fill();
    pen.strokeStyle = "rgba(90, 60, 30, 0.6)";
    pen.lineWidth = 1;
    pen.stroke();
  }
  pen.restore();
  pen.restore();
}

// The front of a small lantern of six sides, upright, from its foot at
// (0, foot) up to the point of its crown; "R" its half-width at the middle.
function khomUpright(foot, R, colour, gold, lit, flicker) {
  var r = R * 0.45, LOW = foot - 18, HIGH = LOW - 44, TOP = HIGH - 18;
  var faces = [[-1, -0.5, 0.62], [-0.5, 0.5, 1], [0.5, 1, 0.72]];     // three faces seen: from x, to x, how much they face us
  faces.forEach(function (f, i) {
    var paper = blend(blend(colour, "#2a1810", 0.3 * (1 - f[2])), "#ffd070", lit * flicker * 0.3 * f[2]);
    [[r, foot, R, LOW], [R, LOW, R, HIGH], [R, HIGH, r, TOP]].forEach(function (ring, j) {
      pen.beginPath();
      pen.moveTo(f[0] * ring[0], ring[1]);
      pen.lineTo(f[1] * ring[0], ring[1]);
      pen.lineTo(f[1] * ring[2], ring[3]);
      pen.lineTo(f[0] * ring[2], ring[3]);
      pen.closePath();
      pen.fillStyle = j === 1 ? paper : blend(paper, "#2a1810", 0.12);
      pen.fill();
      khomRibbon(gold);
      if (j === 1) { khomFlower((f[0] + f[1]) / 2 * R, (LOW + HIGH) / 2, 9, gold, paper, Math.abs(f[1] - f[0]), 0); }
    });
  });
  pen.beginPath();                                            // the crown: three points
  pen.moveTo(-r, TOP);
  pen.lineTo(0, TOP - 30);
  pen.lineTo(r, TOP);
  pen.moveTo(-r, TOP);
  pen.lineTo(-r - 6, TOP - 18);
  pen.lineTo(-r * 0.3, TOP);
  pen.moveTo(r * 0.3, TOP);
  pen.lineTo(r + 6, TOP - 18);
  pen.lineTo(r, TOP);
  pen.fillStyle = blend(colour, "#fff6e0", 0.15);
  pen.fill();
  khomRibbon(gold);
}

// The handheld lantern, its handle held at (x, y): the lantern stands 104
// above the hand and the handle goes 64 below it, at size 1.
function khomThue(x, y, look) {
  look = look || {};
  checkNames("The khom thue's name", look, KHOM_THUE_KEYS);
  var size = look.size === undefined ? 1 : look.size;
  var colour = look.colour || KHOM_BLUE, gold = look.gold || KHOM_GOLD;
  var lit = look.lit === undefined ? 0 : look.lit, t = clock + (look.late || 0);
  var flicker = khomFlickerAt(t, x);
  pen.save();
  pen.translate(x, y);
  pen.rotate((look.lean || 0) + 0.03 * Math.sin(t * 2.1));
  pen.scale(size, size);
  if (lit > 0) { khomGlow(-128, 200, lit, flicker); }
  pen.beginPath();                                            // the handle
  pen.moveTo(-3, 64);
  pen.lineTo(-3.5, -104);
  pen.lineTo(3.5, -104);
  pen.lineTo(3, 64);
  pen.closePath();
  pen.fillStyle = "#7a5230";
  pen.fill();
  pen.strokeStyle = "#4a3020";
  pen.lineWidth = 1.2;
  pen.stroke();
  pen.fillStyle = gold;                                       // the cup it stands in
  pen.beginPath();
  pen.moveTo(-14, -104);
  pen.lineTo(14, -104);
  pen.lineTo(6, -94);
  pen.lineTo(-6, -94);
  pen.closePath();
  pen.fill();
  pen.fillStyle = blend(colour, "#2a1810", 0.25);             // tassels of paper round the cup
  pen.beginPath();
  for (var k = -2; k <= 2; k++) {
    var tx = k * 9, flap = 2 * Math.sin(t * 3 + k);
    pen.moveTo(tx - 4, -100);
    pen.lineTo(tx + flap + k * 3, -64 + Math.abs(k) * 6);
    pen.lineTo(tx + 4, -100);
  }
  pen.fill();
  khomUpright(-104, 34, colour, gold, lit, flicker);
  pen.restore();
}

// The star lantern, hung by its string from (x, y): 150 across its points,
// the star 145 tall below a string of 30, at size 1.
function khomDao(x, y, look) {
  look = look || {};
  checkNames("The khom dao's name", look, KHOM_DAO_KEYS);
  var size = look.size === undefined ? 1 : look.size;
  var colour = look.colour || KHOM_RED, gold = look.gold || KHOM_GOLD;
  var lit = look.lit === undefined ? 0 : look.lit, sway = look.sway === undefined ? 1 : look.sway;
  var spin = look.spin === undefined ? 1 : look.spin, wind = look.wind === undefined ? 1 : look.wind;
  var t = clock + (look.late || 0), flicker = khomFlickerAt(t, x);
  var STRING = 30, OUT = 76, IN = 32, CY = STRING + OUT;
  var turn = spin * 0.45 * Math.sin(t * 0.55 + 0.7), across = Math.cos(turn) * 0.3 + 0.7, deep = 14 * Math.sin(turn);
  function point(k, radius) {
    var a = -Math.PI / 2 + k * Math.PI / 5;
    return [Math.cos(a) * radius * across, CY + Math.sin(a) * radius];
  }
  pen.save();
  pen.translate(x, y);
  pen.rotate(sway * 0.12 * (Math.sin(t * 1.3) + 0.3 * Math.sin(t * 2.9 + 1)) + (look.lean || 0));
  pen.scale(size, size);
  if (lit > 0) { khomGlow(CY, OUT * 4, lit, flicker); }
  pen.strokeStyle = "rgba(60, 35, 15, 0.8)";
  pen.lineWidth = 1.4;
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.lineTo(0, CY - OUT);
  pen.stroke();
  var shade = blend(colour, "#2a1810", 0.3);
  if (look.tail !== false) {                                  // a tail from each of the two lower points (the top point is 0)
    [4, 6].forEach(function (k) {
      var p = point(k, OUT);
      khomStrip(p[0], p[1] - 4, 7, 120, shade, gold, wind * 0.8, t + k * 0.1, "point");
    });
  }
  pen.beginPath();                                            // the star's thickness, behind its face
  for (var k = 0; k < 10; k++) {
    var q = point(k, k % 2 ? IN : OUT);
    pen.lineTo(q[0] + deep, q[1] + 3);
  }
  pen.closePath();
  pen.fillStyle = blend(colour, "#2a1810", 0.45);
  pen.fill();
  khomRibbon(gold);
  for (k = 0; k < 10; k++) {                                  // the face: each point a low pyramid, its two halves lit apart
    var tip = point(k, k % 2 ? IN : OUT), next = point(k + 1, (k + 1) % 2 ? IN : OUT);
    pen.beginPath();
    pen.moveTo(0, CY);
    pen.lineTo(tip[0], tip[1]);
    pen.lineTo(next[0], next[1]);
    pen.closePath();
    var paper = blend(k % 2 ? colour : blend(colour, "#fff6e0", 0.22), "#ffd070", lit * flicker * 0.3);
    pen.fillStyle = paper;
    pen.fill();
    khomRibbon(gold);
  }
  khomFlower(0, CY, 14, gold, colour, across, 0);
  pen.restore();
}

// The lotus lantern, hung by its strings from (x, y): the flower 150 across
// its open petals, its foot 150 below the tie, at size 1.
function khomBua(x, y, look) {
  look = look || {};
  checkNames("The khom bua's name", look, KHOM_BUA_KEYS);
  var size = look.size === undefined ? 1 : look.size;
  var colour = look.colour || "#e98aa8", gold = look.gold || KHOM_GOLD;
  var lit = look.lit === undefined ? 0 : look.lit, sway = look.sway === undefined ? 1 : look.sway;
  var wind = look.wind === undefined ? 1 : look.wind, t = clock + (look.late || 0), flicker = khomFlickerAt(t, x);
  var FOOT = 150, RIM = 86;
  var pale = blend(colour, "#fff4f6", 0.7), warm = "#ffd890";
  pen.save();
  pen.translate(x, y);
  pen.rotate(sway * 0.1 * (Math.sin(t * 1.2) + 0.3 * Math.sin(t * 2.7 + 1)) + (look.lean || 0));
  pen.scale(size, size);
  if (lit > 0) { khomGlow(115, 300, lit, flicker); }
  pen.strokeStyle = "rgba(60, 35, 15, 0.8)";                  // three strings, from the tie to the rim
  pen.lineWidth = 1.2;
  pen.beginPath();
  [-46, 0, 46].forEach(function (sx) { pen.moveTo(0, 0); pen.lineTo(sx, RIM + 6); });
  pen.stroke();
  if (look.tail !== false) {
    var mids = khomStrip(0, FOOT - 6, 12, 130, blend(colour, "#2a1810", 0.2), gold, wind, t, "fish");
    khomFlower(mids[6][0], mids[6][1], 9, gold, colour, 1, mids[6][2]);
  }
  function petal(angle, long, wide, fill) {                   // a pointed petal from the foot, leaning out by "angle"
    pen.save();
    pen.translate(0, FOOT);
    pen.rotate(angle);
    pen.beginPath();
    pen.moveTo(0, 0);
    pen.bezierCurveTo(-wide, -long * 0.35, -wide * 0.8, -long * 0.75, 0, -long);
    pen.bezierCurveTo(wide * 0.8, -long * 0.75, wide, -long * 0.35, 0, 0);
    pen.fillStyle = blend(fill, warm, lit * flicker * 0.35);
    pen.fill();
    khomRibbon(gold);
    pen.restore();
  }
  [-1.15, 1.15, -0.78, 0.78].forEach(function (a) { petal(a, 82, 28, blend(colour, "#2a1810", 0.12)); });   // the outer petals, open wide
  [-0.42, 0.42].forEach(function (a) { petal(a, 86, 27, colour); });
  [-0.2, 0.2, 0].forEach(function (a) { petal(a, 72, 22, pale); });                                       // the inner petals, closer
  pen.beginPath();                                            // the cup at the foot
  pen.ellipse(0, FOOT - 2, 18, 8, 0, 0, 7);
  pen.fillStyle = blend("#8aa64a", warm, lit * 0.2);
  pen.fill();
  khomRibbon(gold);
  pen.restore();
}
