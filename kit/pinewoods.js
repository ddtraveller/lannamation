// pinewoods.js - the pine woods of the north's high country and a lake among them, for the Lanna cartoon kit, painted
// as thicket.js paints its plants: each thing painted once into a sprite, the sprites in layers a camera moves
// through, the far layers in the air's haze. Read from photographs on Wikimedia Commons: the three-needled pine
// (Pinus kesiya, สนสามใบ) of Doi Pha Hom Pok, the pine woods and the reservoir of Pang Ung (ปางอุ๋ง, Mae Hong Son) at
// dawn, its mist, its mirror. Load it after oldcartoon.js and thicket.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="thicket.js"></script>
//     <script src="pinewoods.js"></script>
//
//   pine(high, kind, seed)                 a pine, "forest", "old" or "young", each its own by its seed (pineSprite)
//   broadleaf(high, seed, greens)          an oak or a chestnut of the pine woods (broadleafSprite)
//   natBush(wide, high, seed, greens, ...) a bush as fine as thkBush() paints one at twice its size
//   forestHill(look)                       a hill clothed in bushes of three sizes along its contours, pines out of it
//   grassBank(wide, high, seed, greens, n) the dry grass of the hills (cogon, หญ้าคา), its white plumes
//   softMist(t, y, tall, alpha, seed, c)   mist lying in a valley, no edge to it
//   natSteam(t, x0, x1, y, look)           mist rising off water in wisps (or steam), in patches and strands
//   natReflect(t, y, look)                 still water mirroring the sheet above the line y, broken by ripples
//   natGlitter(t, x, y, foot, strength, c) a low sun's light on still water
//
// Sheets: pinewoods.html (the three pines on a hillside of the high country), pinelake.html (the lake at dawn in
// gold light). The owner's picks, 2026-10-26: the pines ("Yes, go on", after "make three different sizes [of bush]
// and paint the landscape with them ... more variety to the way the trees look") and the lake's gold light.

// The greens of a pine's needles, deep in a clump to the light on its top: bluer and darker than a bush's.
var PINE_GREENS = ["#0e2418", "#15321f", "#1e4429", "#2a5733", "#3b6c3e", "#56864b", "#7ea25e"];
var PINE_YOUNG = ["#14301a", "#1c4422", "#275a2a", "#367232", "#4e8c40", "#6ea650", "#9cc46a"];

// One clump of needles (a pad), its middle at (x, y), "wide" across and "high" tall: Pinus kesiya holds its long
// needles in bunches at the ends of its twigs, and the bunches of one limb crowd into a clump, its top lit and its
// underside in shade, needles standing up out of its top and hanging from its underside. A lumpy cloud of three to
// five rounds, filled dark; over it the needles, short strokes rising out and away from its middle, lit by their
// height in the clump and by "lit" (0 to 1, the side of the tree the sun is on). Returns nothing: it draws with pen.
function pinePad(x, y, wide, high, lit, greens, seed) {
  var rounds = [], n, k, count = 3 + Math.floor(dice(seed) * 3);
  for (n = 0; n < count; n++) {
    var u = count === 1 ? 0 : n / (count - 1) - 0.5, r = high * (0.42 + 0.18 * dice(seed + n * 3));
    rounds.push([x + u * (wide - 2 * r) * 0.95, y - high * 0.12 * Math.cos(u * Math.PI) + (dice(seed + n * 5) - 0.5) * high * 0.2, r]);
  }
  function inside(px, py) {
    for (var m = 0; m < rounds.length; m++) {
      var dx = px - rounds[m][0], dy = (py - rounds[m][1]) * 1.15;
      if (dx * dx + dy * dy < rounds[m][2] * rounds[m][2]) { return rounds[m]; }
    }
    return null;
  }
  pen.fillStyle = greens[0];
  pen.beginPath();
  rounds.forEach(function (c) { pen.moveTo(c[0] + c[2], c[1]); pen.ellipse(c[0], c[1], c[2], c[2] / 1.15, 0, 0, 7); });
  pen.fill();
  var strokes = [], many = Math.round(wide * high / 14);
  for (n = 0, k = 0; n < many && k < many * 4; k++) {
    var px = x + (dice(seed * 3 + k * 1.31) - 0.5) * wide, py = y + (dice(seed * 5 + k * 2.17) - 0.55) * high * 1.2;
    var home = inside(px, py);
    if (!home) { continue; }
    strokes.push([px, py, home, k]);
    n++;
  }
  rounds.forEach(function (c, m) {                  // needles standing out of the clump's top, and hanging from it
    for (var f = 0; f < 16; f++) {
      var a = Math.PI * (1.05 + 0.9 * dice(seed + m * 37 + f)), top = f < 11;
      if (!top) { a = Math.PI * (0.15 + 0.7 * dice(seed + m * 41 + f)); }
      strokes.push([c[0] + Math.cos(a) * c[2] * 0.9, c[1] + Math.sin(a) * c[2] * 0.78, c, m * 53 + f, top ? 1 : -1]);
    }
  });
  strokes.sort(function (p, q) { return q[1] - p[1]; });   // from the underside up: the lit top lies over all
  pen.lineCap = "round";
  strokes.forEach(function (s) {
    var c = s[2], dy = (s[1] - c[1]) / c[2], dx = (s[0] - x) / (wide / 2);
    var light = clamp(lit * 0.5 + (0.5 - dy * 0.55) * 0.6 - dx * 0.12 + (dice(seed + s[3] * 0.7) - 0.5) * 0.35);
    var turn = -Math.PI / 2 + dx * 0.9 + (s[0] - c[0]) / c[2] * 0.5 + (dice(seed + s[3] * 1.9) - 0.5) * 0.9;
    var long = high * (0.16 + 0.14 * dice(seed + s[3] * 2.3));
    if (s[4] === -1) { turn = Math.PI / 2 + dx * 0.5 + (dice(seed + s[3]) - 0.5) * 0.6; light *= 0.45; long *= 1.2; }
    else if (s[4] === 1) { long *= 1.35; }
    var ex = s[0] + Math.cos(turn) * long, ey = s[1] + Math.sin(turn) * long;
    pen.strokeStyle = greens[Math.min(6, Math.floor(light * 6.99))];
    pen.lineWidth = 1.2 + 0.6 * dice(s[3] + seed);
    pen.beginPath();
    pen.moveTo(s[0], s[1]);
    pen.quadraticCurveTo(s[0] + Math.cos(turn) * long * 0.6 + 2, s[1] + Math.sin(turn) * long * 0.6, ex, ey + long * 0.12);
    pen.stroke();
  });
}

// A limb from (x, y) on the trunk out to "side" (1 right, -1 left), "long" long, rising at "rise" (radians above
// level), "wide" thick where it leaves the trunk: crooked, in three lengths each turned a little, thinning out.
// Gives back the points where its clumps of needles sit: [[x, y, size], ...]. Returns that list; it draws with pen.
function pineLimb(x, y, side, long, rise, wide, seed) {
  var pts = [[x, y]], a = -rise, px = x, py = y, n;
  for (n = 0; n < 3; n++) {
    a += (dice(seed + n * 7) - 0.5) * 0.7 - (n === 2 ? 0.15 : 0);
    var l = long * [0.42, 0.33, 0.25][n];
    px += side * Math.cos(a) * l;
    py += Math.sin(a) * l;
    pts.push([px, py]);
  }
  var fine = [], m;                                 // the limb as one tapering shape along a bending line
  for (n = 0; n < 3; n++) {
    for (m = 0; m < 6; m++) {
      var u = m / 6, q0 = pts[n], q1 = pts[n + 1], sag = Math.sin(u * Math.PI) * long * 0.03 * (n === 0 ? -1 : 1);
      fine.push([mix(q0[0], q1[0], u), mix(q0[1], q1[1], u) + sag, (n + u) / 3]);
    }
  }
  fine.push([pts[3][0], pts[3][1], 1]);
  function edge(k, sideOf) {
    var a0 = fine[Math.max(0, k - 1)], a1 = fine[Math.min(fine.length - 1, k + 1)], dx = a1[0] - a0[0], dy = a1[1] - a0[1], l = Math.hypot(dx, dy) || 1;
    var w = Math.max(0.8, wide * 0.5 * (1 - fine[k][2] * 0.85));
    return [fine[k][0] - dy / l * w * sideOf, fine[k][1] + dx / l * w * sideOf];
  }
  pen.beginPath();
  for (n = 0; n < fine.length; n++) { var e = edge(n, 1); pen.lineTo(e[0], e[1]); }
  for (n = fine.length - 1; n >= 0; n--) { e = edge(n, -1); pen.lineTo(e[0], e[1]); }
  pen.closePath();
  pen.fillStyle = "#3e2e22";
  pen.fill();
  pen.strokeStyle = "rgba(196, 150, 104, 0.55)";    // the light along its upper side
  pen.lineWidth = Math.max(0.8, wide * 0.18);
  pen.lineCap = "round";
  pen.beginPath();
  for (n = 0; n < fine.length * 0.8; n++) { e = edge(n, side > 0 ? -0.55 : 0.55); pen.lineTo(e[0], e[1]); }
  pen.stroke();
  var pads = [[pts[3][0], pts[3][1] - 4, 1]];
  if (long > 60) { pads.push([pts[2][0], pts[2][1] - 6, 0.75]); }
  if (long > 140 && dice(seed + 9) < 0.7) { pads.push([pts[1][0] + side * 10, pts[1][1] - 8, 0.6]); }
  return pads;
}

// The trunk: from its foot at (0, 0) to the top, "high" tall, "wide" at the foot, leaning by "lean" (pixels at the
// top), the bark grey and deeply furrowed below, reddish and flaking above, as Pinus kesiya's is. Returns the
// function giving the trunk's middle at a height up it (0 the foot, 1 the top).
function pineTrunk(high, wide, lean, seed) {
  function at(u) { return [lean * u * u + high * 0.006 * Math.sin(u * 6 + seed), -high * u]; }
  function half(u) { return wide * (0.5 - 0.4 * u) * (1 + 0.5 * Math.max(0, 0.04 - u) / 0.04); }
  pen.beginPath();
  var n, steps = 30;
  for (n = 0; n <= steps; n++) { var p = at(n / steps); pen.lineTo(p[0] - half(n / steps), p[1]); }
  for (n = steps; n >= 0; n--) { p = at(n / steps); pen.lineTo(p[0] + half(n / steps), p[1]); }
  pen.closePath();
  var bark = pen.createLinearGradient(-wide * 0.5, 0, wide * 0.5, 0);
  bark.addColorStop(0, "#857462");
  bark.addColorStop(0.3, "#97846c");
  bark.addColorStop(0.75, "#4a3e32");
  bark.addColorStop(1, "#2a221c");
  pen.fillStyle = bark;
  pen.fill();
  pen.save();
  pen.clip();
  var red = pen.createLinearGradient(0, -high * 0.3, 0, -high);   // the upper bark, reddish where it flakes
  red.addColorStop(0, "rgba(176, 92, 50, 0)");
  red.addColorStop(1, "rgba(176, 92, 50, 0.6)");
  pen.fillStyle = red;
  pen.fillRect(-wide - Math.abs(lean), -high, wide * 2 + Math.abs(lean) * 2, high);
  for (n = 0; n < 110; n++) {                       // the bark's plates: long below, short and flaking above
    var yu = Math.pow(dice(seed + n * 3), 1.4) * 0.92, c = at(yu), cw = half(yu), side = dice(seed + n * 5) * 2 - 1;
    var cx = c[0] + side * cw * 0.85, tall = high * (0.05 - 0.035 * yu) * (0.6 + 0.8 * dice(n + seed));
    pen.strokeStyle = "rgba(24, 18, 12, " + (0.35 + 0.3 * (side > 0 ? 1 : 0)).toFixed(2) + ")";
    pen.lineWidth = 1 + cw * 0.06;
    pen.beginPath();
    pen.moveTo(cx, c[1]);
    pen.quadraticCurveTo(cx + side * 2, c[1] - tall * 0.5, cx + (dice(n) - 0.5) * 3, c[1] - tall);
    pen.stroke();
    if (side < 0.2 && dice(n * 7 + seed) < 0.4) {     // a plate's edge in the light
      pen.strokeStyle = "rgba(220, 196, 160, 0.35)";
      pen.lineWidth = 1;
      pen.beginPath();
      pen.moveTo(cx - 2, c[1] - tall * 0.2);
      pen.lineTo(cx - 2, c[1] - tall * 0.8);
      pen.stroke();
    }
  }
  pen.restore();
  pen.strokeStyle = "rgba(24, 18, 12, 0.85)";
  pen.lineWidth = 1.6;
  pen.stroke();
  return at;
}

// pine(high, kind, seed): a whole pine, its foot at (0, 0), "high" tall, painted with pen (into a sprite, once):
//   "forest"  the tall pine of the pine woods and the lakeshore: a long straight bole, the crown in its top third,
//             open and uneven, sky through it (Pang Ung, Doi Pha Hom Pok)
//   "old"     an old pine standing alone: a heavy trunk, great limbs held out and up, the crown spread flat on top
//             like an umbrella
//   "young"   a young pine: a bushy cone of clumps from near the ground up, bright green
// Returns nothing: it draws with pen.
var PINE_KINDS = {forest: true, old: true, young: true};
function pine(high, kind, seed) {
  if (!PINE_KINDS[kind]) { checkName("The pine's kind", kind, PINE_KINDS); kind = "forest"; }
  var young = kind === "young", old = kind === "old", greens = young ? PINE_YOUNG : PINE_GREENS;
  var wide = high * (old ? 0.07 : young ? 0.045 : 0.042), lean = high * (dice(seed) - 0.5) * (old ? 0.14 : young ? 0.02 : 0.07);
  var from = young ? 0.08 : old ? 0.4 : 0.6, limbs = young ? 20 : old ? 9 : 11;
  var reach = high * (young ? 0.26 : old ? 0.36 : 0.17), pad = high * (young ? 0.13 : old ? 0.075 : 0.07);
  if (!young) {                                     // each its own tree: where its crown starts, its limbs, its clumps
    from += (dice(seed * 3.1) - 0.5) * 0.16;
    limbs += Math.floor((dice(seed * 5.3) - 0.5) * 6);
  }
  pad *= 0.82 + 0.36 * dice(seed * 7.7);
  reach *= 0.78 + 0.5 * dice(seed * 11.3);
  var tint = dice(seed * 13.9);                     // and its green: a little yellower or bluer than the next
  if (tint < 0.33 || tint > 0.66) {
    var toward = tint < 0.33 ? "#7a8a3a" : "#2a4e5e";
    greens = greens.map(function (g) { return blend(g, toward, 0.13); });
  }
  var fork = !young && dice(seed * 17.3) < 0.25;
  var stubs = [], n, list = [];
  var at = pineTrunk(high, wide, lean, seed);
  if (!young) {                                     // dead stubs low on the bole, where the old limbs fell
    for (n = 0; n < 3; n++) {
      var su = 0.3 + (from - 0.35) * dice(seed + n * 41), sp = at(su), ss = dice(seed + n * 43) < 0.5 ? -1 : 1;
      pen.strokeStyle = "#3a2e24";
      pen.lineWidth = Math.max(1.5, wide * 0.07);
      pen.lineCap = "round";
      pen.beginPath();
      pen.moveTo(sp[0] + ss * wide * 0.3, sp[1]);
      pen.lineTo(sp[0] + ss * wide * (0.6 + 0.4 * dice(n + seed)), sp[1] - wide * (0.3 + 0.3 * dice(n * 3 + seed)));
      pen.stroke();
    }
  }
  for (n = 0; n < limbs; n++) {                     // the limbs up the crown, uneven, a gap or two between
    var u = from + (1 - from) * Math.pow((n + 0.2 + 0.6 * dice(seed + n)) / limbs, old ? 0.8 : 1) * 0.97;
    if (!young && dice(seed + n * 19) < 0.15) { continue; }
    var side = dice(seed + n * 23) < 0.5 ? -1 : 1, h = (u - from) / (1 - from);
    var long = reach * (young ? 1.05 - h * 0.9 : old ? 0.55 + 0.45 * Math.sin(Math.min(1, h * 1.2) * Math.PI * 0.6) : 0.5 + 0.5 * Math.sin((1 - h) * Math.PI * 0.7))
                     * (0.7 + 0.55 * dice(seed + n * 29));
    var rise = old ? 0.3 + 0.4 * h : young ? 0.12 + 0.3 * h : 0.02 + 0.35 * h;
    list.push([u, side, long, rise, n]);
  }
  if (fork) { list.push([0.8 + 0.06 * dice(seed), dice(seed * 19) < 0.5 ? -1 : 1, reach * 0.9, 1.15, 77]); }   // a second leader
  var clumps = [];
  list.forEach(function (l) {                       // the limbs, and where their clumps go
    var p = at(l[0]);
    pineLimb(p[0], p[1], l[1], l[2], l[3], wide * (1 - l[0]) * 0.5 + 2, seed * 7 + l[4]).forEach(function (q) {
      clumps.push([q[0], q[1], q[2], l[1], l[0], l[4]]);
    });
  });
  var top = at(1);
  clumps.push([top[0], top[1] - pad * 0.2, 1.05, 0, 1, 99]);   // the leader's clump
  if (old) {                                        // the umbrella: a spread of clumps over the great limbs
    for (n = 0; n < 7; n++) {
      var ou = n / 6 - 0.5;
      clumps.push([top[0] + ou * reach * 1.5, top[1] + pad * 0.5 + Math.abs(ou) * pad * 1.6 + pad * 0.5 * dice(seed + n), 1.1, ou < 0 ? -1 : 1, 0.95, 200 + n]);
    }
  }
  clumps.sort(function (p, q) { return (q[3] > 0) - (p[3] > 0) || q[1] - p[1]; });   // the shaded side first
  clumps.forEach(function (c) {
    var lit = clamp(0.45 + (c[3] < 0 ? 0.25 : c[3] > 0 ? -0.15 : 0.1) + (c[4] - 0.5) * 0.3);
    var size = pad * c[2] * (0.85 + 0.35 * dice(seed + c[5] * 3));
    pinePad(c[0], c[1], size * (young ? 1.5 : 2.1), size, lit, greens, seed * 11 + c[5] * 13);
  });
}

// A pine as a sprite for thicket.js's layers: thkSprite() round pine(), its point at the foot.
function pineSprite(high, kind, seed, sharp) {
  var w = high * (kind === "old" ? 1.0 : kind === "young" ? 0.8 : 0.6);
  return thkSprite(w, high * 1.3, w / 2, high * 1.25, function () { pine(high, kind, seed); }, sharp);
}

// --- the broadleaf trees of the pine woods ---

// broadleaf(high, seed, greens): an oak or a chestnut of the north's pine woods (they stand mixed with the pines),
// its foot at (0, 0), "high" tall: a short trunk forking into crooked limbs that reach up and out, and on each limb's
// end a clump of small leaves (thkBush()'s, painted at twice its size and drawn at half, so they are fine), the
// clumps at their own heights with sky between them, the crown wider than it is tall. Returns nothing: it draws
// with pen (into a sprite, once; see broadleafSprite).
function broadleaf(high, seed, greens) {
  var trunk = high * 0.42, wide = high * 0.07, n, clumps = [];
  thkTrunk(trunk, wide, seed);
  var limbs = 4 + Math.floor(dice(seed * 3) * 3);
  for (n = 0; n < limbs; n++) {                     // the limbs out of the fork, fanning up and out
    var side = n % 2 ? 1 : -1, spread = (n / (limbs - 1) - 0.5) * 2;
    var long = high * (0.32 + 0.22 * dice(seed + n * 5)) * (1 - 0.25 * Math.abs(spread));
    var rise = 0.5 + 0.7 * (1 - Math.abs(spread)) + (dice(seed + n * 7) - 0.5) * 0.3;
    pineLimb(0, -trunk + wide * 0.4 * dice(seed + n), spread < 0 ? -1 : 1, long, rise, wide * 0.55, seed * 13 + n).forEach(function (q, k) {
      clumps.push([q[0], q[1], q[2], spread, n * 5 + k]);
    });
  }
  clumps.push([0, -trunk - high * 0.4, 1.2, 0, 99]);   // the crown's top
  clumps.sort(function (p, q) { return p[1] - q[1]; });
  clumps.forEach(function (c) {                     // the clumps, the high ones first: the low ones lie in front
    var w = high * 0.34 * c[2] * (0.8 + 0.4 * dice(seed + c[4] * 3)), h = w * 0.62;
    pen.save();
    pen.translate(c[0], c[1] + h * 0.45);
    pen.scale(0.5, 0.5);
    thkBush(w * 2, h * 2, seed * 17 + c[4], greens, []);
    pen.restore();
  });
}

// A broadleaf tree as a sprite for thicket.js's layers, its point at the foot.
function broadleafSprite(high, seed, greens, sharp) {
  return thkSprite(high * 1.5, high * 1.25, high * 0.75, high * 1.2, function () { broadleaf(high, seed, greens); }, sharp);
}

// --- the forest on the hills ---

// The three sizes of bush the hills are clothed in, film pixels across and high.
var NAT_BUSH = {small: [200, 110], medium: [330, 180], large: [500, 260]};

// A bush as a sprite, finer than thkBush() paints it at its size: painted at twice the size and drawn at half, so
// its leaves are half as big and four times as many. wide, high: film pixels; seed: a number; greens: seven
// colours; blooms: as thkBush() takes them; sharp: device pixels to a film pixel. Returns thkSprite()'s.
function natBush(wide, high, seed, greens, blooms, sharp) {
  return thkSprite(wide + 60, high + 50, wide / 2 + 30, high + 18, function () {
    pen.scale(0.5, 0.5);
    thkBush(wide * 2, high * 2, seed, greens, blooms);
  }, sharp);
}

// A hill clothed in forest, as a sprite for a layer: its ridge the line ridge(x) (pixels above y = 0, the layer's
// base line, at x across the sprite from -300 to 3100), and down from the ridge row on row of bushes standing on the
// slope, each row a little lower and nearer than the last, so each covers the feet of the one above and no air shows
// under any: dark shade between them, as a forest has. look:
//   seed, greens (seven colours, deep to light), tall (the ridge's height), deep (how far the slope runs below 0),
//   sizes (which of NAT_BUSH, ridge to foot, e.g. ["small", "medium"]), gap (pixels from row to row),
//   pines (how many pines stand out of the canopy), pineHigh (their height), sharp (as thkSprite() takes it)
// Returns {sprite, ridge}: the sprite to place at x = -300, y = the base line, and the ridge's function.
function forestHill(look) {
  var seed = look.seed || 1, tall = look.tall || 200, deep = look.deep || 200, gap = look.gap || 40, greens = look.greens || THK_SHADE;
  var sizes = look.sizes || ["small", "medium"], sharp = look.sharp || PIX;
  function ridge(x) {
    return tall * (0.62 + 0.22 * Math.sin(x * 0.0016 + seed) + 0.11 * Math.sin(x * 0.0047 + seed * 2.3) + 0.05 * Math.sin(x * 0.012 + seed * 3.7));
  }
  var pool = {}, n;
  sizes.forEach(function (name, k) {                // three of each size the hill uses
    pool[name] = [];
    for (n = 0; n < 3; n++) {
      var palette = n === 1 ? greens.map(function (g) { return blend(g, "#7a8a3a", 0.12); }) : n === 2 ? greens.map(function (g) { return blend(g, "#1e3c44", 0.1); }) : greens;
      pool[name].push(natBush(NAT_BUSH[name][0], NAT_BUSH[name][1], seed * 31 + k * 7 + n, palette, [], sharp));
    }
  });
  var pines = [];
  for (n = 0; n < 3; n++) { pines.push(pineSprite(look.pineHigh || 260, "forest", seed * 41 + n, sharp)); }
  var head = tall * 1.25 + (look.pines ? (look.pineHigh || 260) * 1.6 : 0) + 40;
  var sprite = thkSprite(3400, head + deep + 20, 300, head, function () {
    pen.fillStyle = greens[0];                      // the shade under the canopy, where no bush shows
    pen.beginPath();
    pen.moveTo(-300, deep + 20);
    for (var x = -300; x <= 3100; x += 20) { pen.lineTo(x, -ridge(x) + 30); }
    pen.lineTo(3100, deep + 20);
    pen.closePath();
    pen.fill();
    var rows = Math.ceil((deep + tall * 0.3) / gap) + 1, r;
    for (n = 0; n < (look.pines || 0); n++) {      // pines standing out of the canopy, their feet in it
      var px = -250 + 3300 * dice(seed * 3 + n * 1.7), py = -ridge(px) + 40 + gap * Math.floor(dice(seed + n * 5) * 2);
      thkPlace(pines[n % 3], px, py, 0.7 + 0.5 * dice(seed + n * 9), 0);
    }
    for (r = 0; r < rows; r++) {                    // the rows of bushes, the ridge's first, each lower one nearer
      var name = sizes[Math.min(sizes.length - 1, Math.floor(r / rows * sizes.length))], wide = NAT_BUSH[name][0];
      for (x = -300 - wide * dice(seed + r); x < 3100 + wide; ) {
        var sink = r * gap + (dice(seed * 7 + x * 0.01 + r) - 0.3) * gap * 0.7;
        var y = Math.min(deep + 20, -ridge(x) + NAT_BUSH[name][1] * 0.45 + sink);
        thkPlace(pool[name][Math.floor(dice(seed + x * 0.03 + r * 3) * 3)], x, y, 0.8 + 0.4 * dice(seed * 11 + x * 0.02 + r), 0);
        x += wide * (0.45 + 0.3 * dice(seed * 13 + x * 0.01 + r));
      }
    }
  }, sharp);
  return {sprite: sprite, ridge: ridge};
}

// --- the grass of the hills, and the mist ---

// The dry grass of the hills in the cool season: a bank "wide" across and "high" tall of thin blades, close as the
// cogon grass (หญ้าคา) stands on a cleared slope, the far blades darker, the near ones in the light, their tips pale,
// and here and there a plume of white seed (it flowers white at the year's turn). greens: seven colours, deep to
// light; plumes: how many seed heads. Its foot along y = 0, its middle at x = 0. Returns nothing: it draws with pen.
var GRASS_DRY = ["#4a3e1e", "#665626", "#82702e", "#9c8a3a", "#b4a24c", "#cdbc68", "#e6d894"];
var GRASS_GREEN = ["#1e3a1c", "#2a4e22", "#3a6428", "#4e7a30", "#68923c", "#86aa4c", "#aac468"];
function grassBank(wide, high, seed, greens, plumes) {
  var rows = 5, n, r;
  pen.lineCap = "round";
  pen.fillStyle = greens[1];                        // the shade at the grass's foot
  pen.beginPath();
  pen.moveTo(-wide / 2, 0);
  for (n = 0; n <= 40; n++) { pen.lineTo(-wide / 2 + wide * n / 40, -high * (0.35 + 0.2 * dice(seed + n))); }
  pen.lineTo(wide / 2, 0);
  pen.fill();
  for (r = 0; r < rows; r++) {
    var count = Math.round(wide / 3.2), front = r / (rows - 1);
    for (n = 0; n < count; n++) {
      var k = seed * 17 + r * 1000 + n, x = -wide / 2 + wide * dice(k), y = front * high * 0.12;
      var tall = high * (0.45 + 0.55 * dice(k + 1)) * (0.8 + 0.2 * (1 - front)), lean = (dice(k + 2) - 0.5) * 0.7 + 0.15;
      var tipx = x + Math.sin(lean) * tall, tipy = y - Math.cos(lean) * tall;
      var g = pen.createLinearGradient(x, y, tipx, tipy);
      g.addColorStop(0, greens[Math.min(6, 1 + r)]);
      g.addColorStop(1, greens[Math.min(6, 3 + r + (dice(k + 3) < 0.3 ? 1 : 0))]);
      pen.strokeStyle = g;
      pen.lineWidth = 1 + 1.4 * dice(k + 4) * (0.6 + 0.4 * front);
      pen.beginPath();
      pen.moveTo(x, y);
      pen.quadraticCurveTo(x + Math.sin(lean) * tall * 0.3, y - Math.cos(lean) * tall * 0.6, tipx + lean * tall * 0.25, tipy + tall * 0.12);
      pen.stroke();
    }
  }
  for (n = 0; n < (plumes || 0); n++) {             // the plumes of white seed on their thin stems, above the blades
    var px = -wide / 2 + wide * dice(seed * 29 + n), ph = high * (1 + 0.3 * dice(seed + n * 3)), pl = (dice(seed + n * 5) - 0.5) * 0.4;
    var top = [px + Math.sin(pl) * ph, -Math.cos(pl) * ph];
    pen.strokeStyle = greens[3];
    pen.lineWidth = 1;
    pen.beginPath();
    pen.moveTo(px, 0);
    pen.quadraticCurveTo(px, -ph * 0.6, top[0], top[1]);
    pen.stroke();
    for (var f = 0; f < 14; f++) {                  // the plume: fine silky hairs along the top of the stem
      var fu = f / 13, fx = top[0] - Math.sin(pl) * 26 * (1 - fu), fy = top[1] + 26 * (1 - fu), fa = -Math.PI / 2 + pl + (dice(seed + n * 7 + f) - 0.5) * 1.4;
      pen.strokeStyle = "rgba(246, 242, 226, " + (0.35 + 0.4 * fu).toFixed(2) + ")";
      pen.lineWidth = 0.9;
      pen.beginPath();
      pen.moveTo(fx, fy);
      pen.quadraticCurveTo(fx + Math.cos(fa) * 5, fy + Math.sin(fa) * 5, fx + Math.cos(fa) * 9 + 2, fy + Math.sin(fa) * 9);
      pen.stroke();
    }
  }
}

// Mist lying over water or in a valley, soft, as the photographs show it (no edge to it): wide soft clouds along the
// line y, "tall" deep, drifting slowly to the right and swelling, in "colour" ("r, g, b"; white when left out).
// t: seconds; alpha: 0 to 1; seed: a number. Returns nothing: it draws with pen over what is there.
function softMist(t, y, tall, alpha, seed, colour) {
  var c = colour || "255, 255, 255";
  for (var n = 0; n < 14; n++) {
    var w = 300 + 400 * dice(seed + n), x = ((dice(seed * 3 + n) * (WIDE + 2 * w) + t * (6 + 6 * dice(n + seed))) % (WIDE + 2 * w)) - w;
    var h = tall * (0.5 + 0.6 * dice(seed + n * 5)) * (1 + 0.08 * Math.sin(t * 0.3 + n)), yy = y + (dice(seed + n * 7) - 0.5) * tall * 0.6;
    pen.save();
    pen.translate(x, yy);
    pen.scale(1, h / w);
    var g = pen.createRadialGradient(0, 0, 0, 0, 0, w);
    g.addColorStop(0, "rgba(" + c + ", " + (alpha * (0.5 + 0.5 * dice(n * 9 + seed))).toFixed(3) + ")");
    g.addColorStop(1, "rgba(" + c + ", 0)");
    pen.fillStyle = g;
    pen.fillRect(-w, -w, w * 2, w * 2);
    pen.restore();
  }
}

// --- still water ---

// Still water from the line y down to "foot" (1080 when left out): what the sheet already holds above the line,
// mirrored below it, as a lake at dawn mirrors its shore, in strips a film pixel or two deep, each pushed aside by
// the ripples (more of them further from the shore, so the near water breaks the mirror into streaks), darkened and
// tinted by the water, with fine lines of light on the ripples. Draw the sky, the far hills and the shore first, then
// this, then what stands in front of the water. look:
//   ripple   how much the water moves (1 a breath of wind, 0 glass)
//   tint     the water's own colour, "r, g, b", and deep, how much of it lies over the mirror at the foot (0 to 1)
//   sheen    how many lines of light lie on the ripples (60 when left out)
//   left, right: the water's extent across (the whole sheet when left out)
// t: seconds. Returns nothing: it draws with pen, and leaves pen as it found it.
function natReflect(t, y, look) {
  look = look || {};
  var foot = look.foot || 1080, ripple = look.ripple === undefined ? 1 : look.ripple, tint = look.tint || "28, 44, 40";
  var deep = look.deep === undefined ? 0.55 : look.deep, left = look.left || 0, right = look.right === undefined ? WIDE : look.right;
  var canvas = pen.canvas, m = pen.getTransform(), k = m.a, d, strip = 2;
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);
  var Y = Math.round((y * k) + m.f), L = left * k + m.e, R = right * k + m.e, F = foot * k + m.f;
  for (d = 0; Y + d < F; d += strip) {              // the mirror, strip by strip, each strip pushed by the ripples
    var src = Y - d - strip;
    if (src < 0) { break; }
    var far = d / k, amp = ripple * k * (0.6 + far * 0.03), off = amp * (Math.sin(far * 0.09 + t * 1.1) + 0.6 * Math.sin(far * 0.31 - t * 1.9) + 0.3 * Math.sin(far * 0.83 + t * 2.7));
    pen.drawImage(canvas, L, src, R - L, strip, L + off, Y + d, R - L, strip);
  }
  pen.restore();
  pen.save();
  var g = pen.createLinearGradient(0, y, 0, foot);  // the water's own colour, deeper toward the near side
  g.addColorStop(0, "rgba(" + tint + ", " + (deep * 0.35).toFixed(3) + ")");
  g.addColorStop(1, "rgba(" + tint + ", " + deep.toFixed(3) + ")");
  pen.fillStyle = g;
  pen.fillRect(left, y, right - left, foot - y);
  pen.fillStyle = "rgba(10, 18, 16, 0.35)";         // the dark line where the shore meets the water
  pen.fillRect(left, y, right - left, 2.5);
  var lines = look.sheen === undefined ? 60 : look.sheen;
  pen.lineCap = "round";
  for (var n = 0; n < lines; n++) {                 // fine lines of light on the ripples, longer and wider near
    var u = Math.pow(dice(n * 3.7 + 1), 1.6), ly = y + 6 + u * (foot - y - 10), len = 20 + 140 * u * dice(n * 5.1);
    var lx = left + ((dice(n * 7.3) * (right - left) + t * (4 + 6 * dice(n))) % (right - left));
    var a = (0.08 + 0.18 * u) * (0.5 + 0.5 * Math.sin(t * 1.3 + n * 2.1));
    pen.strokeStyle = "rgba(235, 240, 230, " + a.toFixed(3) + ")";
    pen.lineWidth = 0.8 + 1.6 * u;
    pen.beginPath();
    pen.moveTo(lx, ly);
    pen.lineTo(lx + len, ly + 0.5);
    pen.stroke();
  }
  pen.restore();
}

// The light of a low sun laid on still water: a path of glittering bits under the sun at x, from the far shore at y
// to the foot, wider as it comes near, the bits winking. t: seconds; strength: 0 to 1; colour "r, g, b".
// Returns nothing: it draws with pen.
function natGlitter(t, x, y, foot, strength, colour) {
  var c = colour || "255, 236, 190";
  pen.save();
  pen.globalCompositeOperation = "screen";
  for (var n = 0; n < 160; n++) {
    var u = dice(n * 2.3), py = y + 4 + Math.pow(u, 1.3) * (foot - y), spread = 30 + 260 * Math.pow(u, 1.2);
    var px = x + (dice(n * 4.1) - 0.5) * 2 * spread + 10 * Math.sin(t * 0.7 + n), on = Math.max(0, Math.sin(t * (2 + 3 * dice(n)) + n * 7));
    pen.fillStyle = "rgba(" + c + ", " + (strength * on * (0.4 + 0.6 * (1 - u))).toFixed(3) + ")";
    pen.fillRect(px, py, 6 + 30 * u * dice(n * 9), 1 + 2 * u);
  }
  pen.restore();
}

// Mist rising off water in the cold of the morning, or steam off a hot spring: wisps that leave the surface along the
// line y between x0 and x1, rise, swell, lean with the air and thin away, each its own while, one after another, so
// there is always mist; where the low sun is behind them (look.sun, its x) they glow. look:
//   count (wisps), rise (how high one goes, pixels), wide (a wisp's width when it leaves the water), life (seconds),
//   lean (pixels it drifts sideways as it rises; + to the right), alpha (0 to 1), colour ("r, g, b"), sun (x), glow
//   (how much brighter toward the sun), patch (0 to 1: how much it comes in patches), flat (a puff's height to its width: 0.55; mist on a lake lies flatter), seed
// t: seconds. Returns nothing: it draws with pen.
function natSteam(t, x0, x1, y, look) {
  look = look || {};
  var count = look.count || 40, rise = look.rise || 160, wide = look.wide || 70, life = look.life || 8, lean = look.lean === undefined ? 50 : look.lean;
  var alpha = look.alpha === undefined ? 0.35 : look.alpha, c = look.colour || "255, 255, 255", seed = look.seed || 1, n, k;
  for (n = 0; n < count; n++) {
    var at = x0 + (x1 - x0) * dice(seed * 3 + n * 1.7), period = life * (0.7 + 0.6 * dice(seed + n * 5));
    var glow = look.sun === undefined ? 1 : 1 + (look.glow || 1.2) * Math.max(0, 1 - Math.abs(at - look.sun) / 600);
    if (look.patch) {                               // mist comes in patches, with clear water between
      glow *= (1 - look.patch) + look.patch * clamp(0.35 + 0.9 * Math.sin(at * 0.0042 + seed * 2.1 + t * 0.04) * Math.sin(at * 0.0013 + seed));
    }
    for (k = 0; k < 6; k++) {                       // each wisp a trail of soft puffs, the oldest highest
      var phase = ((t / period + dice(seed * 7 + n) - k * 0.05) % 1 + 1) % 1;
      var up = Math.pow(phase, 0.8) * rise, r = wide * (0.5 + 1.3 * phase), a = alpha * Math.sin(phase * Math.PI) * (1 - phase * 0.4) * glow / 2.2;
      var px = at + lean * phase + 18 * Math.sin(phase * 4 + n) * phase, py = y - up;
      if (a < 0.004) { continue; }
      pen.save();
      pen.translate(px, py);
      pen.scale(1, (look.flat || 0.55) * (1 + 0.5 * phase));
      var g = pen.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, "rgba(" + c + ", " + Math.min(1, a).toFixed(3) + ")");
      g.addColorStop(1, "rgba(" + c + ", 0)");
      pen.fillStyle = g;
      pen.fillRect(-r, -r, r * 2, r * 2);
      pen.restore();
    }
  }
}
