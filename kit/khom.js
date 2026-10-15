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
