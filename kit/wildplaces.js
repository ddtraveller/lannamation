// wildplaces.js - the wild places of the north for the Lanna cartoon kit, painted as thicket.js and pinewoods.js
// paint (sprites painted once, in layers a camera moves through, haze in the far ones), read from photographs on
// Wikimedia Commons: the view from the summit of Doi Luang Chiang Dao in the morning, the tiered limestone falls (Huai
// Mae Khamin, Bua Tong's sticky falls), the stream of Mae Sa among its boulders, Boon Ko Ku So's bamboo walkway over the
// paddies at Mae Hong Son and the bamboo rafts of the Pai. Load it after oldcartoon.js, thicket.js and pinewoods.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="thicket.js"></script>
//     <script src="pinewoods.js"></script>
//     <script src="wildplaces.js"></script>
//
//   natRock(wide, high, seed, look)         a boulder in planes of light: worn round, or a crag (jag), mossy, wet, stained
//   natGround(wide, high, look)             ground for a layer: soil, fallen leaves, pebbles; a band or a ragged patch
//   natCloud(t, x, y, wide, seed, alpha)    a soft painted cloud of a fine day
//   ridgeLayer(colour, look)                a far ridge against the light, its crest rimmed by the sun
//   limestonePeak(wide, high, look)         a limestone mountain as Doi Luang Chiang Dao stands, backlit or lit face by face
//   natRays(t, x, y, strength, colour, s)   the rays of a low sun fanning out from behind a peak
//   cascadeSteps/Rock/Foot/Water            a tiered cascade over travertine lips into turquoise pools
//   streamBed(look), streamFlow(...)        a stream coming toward us between boulders, foam on the stones
//   bambooWalk(points, look)                a woven bamboo walkway on posts, along any line
//   bambooRaft(x, y, size, t, facing)       a raft of lashed bamboo, rocking on the water
//
// Sheets: summit.html, cascade.html, stream.html, bamboowalk.html, bambooraft.html. The owner's picks, 2026-10-26: the
// summit's morning light; the cascade ("Finish it, but be careful the base of trees stand on solid ground. Probably
// better to add bushes in front of them"); the stream, the walkway and the raft ("Yes, finish it", "Yes, finish both").

// --- stones and the ground ---

// A stone's outline: a lumpy round, wide by high, its foot's middle at (0, 0) and its foot sunk a little below 0 (the
// ground covers it). Returns the points.
function natRockOutline(wide, high, seed, jag) {
  var pts = [], n, count = jag ? 30 : 18;
  for (n = 0; n < count; n++) {
    var a = n / count * Math.PI * 2, r = 1 + (dice(seed + n * 3) - 0.5) * 0.2 + 0.08 * Math.sin(a * 3 + seed);
    if (jag && Math.sin(a) < -0.2 && dice(seed + n * 5) < 0.45) { r *= 1 + jag * (0.1 + 0.35 * dice(seed + n * 7)); }   // a crag's top, broken into a few points
    var x = Math.cos(a) * wide / 2 * r, y = -high * 0.5 + Math.sin(a) * high * 0.62 * r;
    if (y < -high * 0.6) { y = -high * 0.6 + (y + high * 0.6) * 0.7; }   // the top a little flattened, as a worn stone's is
    pts.push([x, y]);
  }
  return pts;
}

function natPathOf(pts) {
  pen.beginPath();
  var n = pts.length;
  pen.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2);
  for (var k = 0; k < n; k++) {
    var q = pts[(k + 1) % n];
    pen.quadraticCurveTo(pts[k][0], pts[k][1], (pts[k][0] + q[0]) / 2, (pts[k][1] + q[1]) / 2);
  }
  pen.closePath();
}

// A stone, its foot's middle at (0, 0), "wide" across and "high" tall, painted in planes as a background painter
// paints one: a lit top plane facing the sun (upper left), the face in middle tone, the side away from the sun and
// the underside in shade, the edges between them soft; specks of grain, lichen on its top, cracks with a lit lip, a
// shadow where it meets the ground and the ground's grit round its foot. look:
//   stone   its colour (a grey granite when left out)
//   moss    0 to 1, how much moss on its top (a forest stream's stones)
//   stain   a mineral crust where hot water has run over it, "r, g, b" (the rust of Pong Dueat: "186, 94, 42"; the
//           white of a sinter: "232, 226, 208"), running down it in streaks from stainUp (0 to 1) of its height
//   wet     0 to 1, the dark of a stone the water runs over, from its foot up, and its shine
//   jag     0 to 1, a crag's top broken into points (the limestone of the summits) instead of a worn round
// seed: a number. Returns nothing: it draws with pen (into a sprite, once).
function natRock(wide, high, seed, look) {
  look = look || {};
  var stone = look.stone || "#8a8478", n, pts = natRockOutline(wide, high, seed, look.jag);
  var lit = blend(stone, "#fff6e4", 0.38), shade = blend(stone, "#1c1a18", 0.55), deep = blend(stone, "#0e0c0a", 0.75);
  var shadow = pen.createRadialGradient(wide * 0.12, 2, 4, wide * 0.12, 2, wide * 0.65);   // its shadow on the ground
  shadow.addColorStop(0, "rgba(20, 16, 10, 0.55)");
  shadow.addColorStop(1, "rgba(20, 16, 10, 0)");
  pen.fillStyle = shadow;
  pen.beginPath();
  pen.ellipse(wide * 0.12, 2, wide * 0.65, high * 0.16, 0, 0, 7);
  pen.fill();
  pen.save();
  pen.beginPath();
  pen.rect(-wide, -high * 2, wide * 2, high * 2 + 3);   // what is below the ground is not seen
  pen.clip();
  natPathOf(pts);
  pen.fillStyle = stone;
  pen.fill();
  pen.save();
  pen.clip();
  pen.fillStyle = lit;                              // the top plane, facing the sun
  pen.beginPath();
  pen.moveTo(-wide * 0.6, -high * (0.38 + 0.1 * dice(seed)));
  pen.quadraticCurveTo(-wide * 0.05, -high * (0.62 + 0.1 * dice(seed + 1)), wide * (0.25 + 0.15 * dice(seed + 2)), -high * 0.95);
  pen.lineTo(wide * 0.3, -high * 1.3);
  pen.lineTo(-wide * 0.7, -high * 1.3);
  pen.closePath();
  pen.fill();
  pen.fillStyle = blend(lit, "#ffffff", 0.25);      // a facet catching the most light
  pen.beginPath();
  pen.moveTo(-wide * 0.35, -high * 0.7);
  pen.quadraticCurveTo(-wide * 0.15, -high * 0.85, wide * 0.05, -high * 1.05);
  pen.lineTo(-wide * 0.4, -high * 1.1);
  pen.closePath();
  pen.fill();
  pen.fillStyle = shade;                            // the side away from the sun
  pen.beginPath();
  pen.moveTo(wide * (0.12 + 0.1 * dice(seed + 3)), -high * 1.2);
  pen.quadraticCurveTo(wide * 0.18, -high * 0.5, wide * 0.05, 0);
  pen.lineTo(wide * 0.7, 0);
  pen.lineTo(wide * 0.7, -high * 1.2);
  pen.closePath();
  pen.fill();
  var under = pen.createLinearGradient(0, -high * 0.35, 0, 0);   // the underside, in deep shade
  under.addColorStop(0, "rgba(0, 0, 0, 0)");
  under.addColorStop(1, deep);
  pen.fillStyle = under;
  pen.fillRect(-wide, -high * 0.35, wide * 2, high * 0.4);
  var keepT = pen.getTransform();                   // the planes' edges soft, as paint is: the stone blurred onto itself
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.filter = "blur(" + Math.max(1, wide * 0.012 * keepT.a).toFixed(1) + "px)";
  pen.drawImage(pen.canvas, 0, 0);
  pen.restore();
  for (n = 0; n < wide * high / 70; n++) {          // the grain: specks light and dark
    var sx = (dice(seed * 3 + n * 1.3) - 0.5) * wide, sy = -dice(seed * 5 + n * 2.1) * high;
    pen.fillStyle = dice(n + seed) < 0.55 ? "rgba(30, 26, 20, 0.2)" : "rgba(255, 250, 236, 0.16)";
    pen.fillRect(sx, sy, 1 + 2 * dice(n * 7), 1 + 1.5 * dice(n * 9));
  }
  for (n = 0; n < 2 + Math.floor(dice(seed) * 3); n++) {   // cracks, each with a lit lip above it
    var cx = (dice(seed + n * 11) - 0.5) * wide * 0.8, cy = -high * (0.35 + 0.55 * dice(seed + n * 13)), cl = high * (0.25 + 0.3 * dice(n));
    var bend = (dice(seed + n * 17) - 0.5) * wide * 0.2;
    pen.lineCap = "round";
    pen.strokeStyle = "rgba(255, 246, 226, 0.35)";
    pen.lineWidth = 1.2;
    pen.beginPath();
    pen.moveTo(cx - 1.5, cy - 1);
    pen.quadraticCurveTo(cx + bend - 1.5, cy + cl * 0.5 - 1, cx + bend * 1.5 - 1.5, cy + cl - 1);
    pen.stroke();
    pen.strokeStyle = "rgba(20, 16, 12, 0.6)";
    pen.lineWidth = 1.5;
    pen.beginPath();
    pen.moveTo(cx, cy);
    pen.quadraticCurveTo(cx + bend, cy + cl * 0.5, cx + bend * 1.5, cy + cl);
    pen.stroke();
  }
  if (!look.stain && !look.wet) {                   // lichen on a dry stone's top: pale grey-green blotches
    for (n = 0; n < wide / 14; n++) {
      var lx = (dice(seed * 9 + n) - 0.6) * wide * 0.8, ly = -high * (0.6 + 0.35 * dice(seed * 11 + n));
      pen.fillStyle = ["rgba(200, 206, 170, 0.5)", "rgba(226, 222, 196, 0.45)", "rgba(170, 186, 140, 0.45)"][n % 3];
      for (var b = 0; b < 5; b++) { pen.beginPath(); pen.arc(lx + (dice(n * 5 + b) - 0.5) * 9, ly + (dice(n * 7 + b) - 0.5) * 5, 1.5 + 2.5 * dice(n + b), 0, 7); pen.fill(); }
    }
  }
  if (look.stain) {                                 // the mineral crust: streaks running down, and the crust at the foot
    var top = -high * (look.stainUp || 0.5);
    for (n = 0; n < wide / 9; n++) {
      var stx = (dice(seed * 13 + n) - 0.5) * wide, sty = top + (dice(seed + n * 3) - 0.5) * high * 0.25, stl = -sty * (0.6 + 0.4 * dice(n * 5));
      var streak = pen.createLinearGradient(0, sty, 0, sty + stl);
      streak.addColorStop(0, "rgba(" + look.stain + ", 0)");
      streak.addColorStop(0.3, "rgba(" + look.stain + ", 0.55)");
      streak.addColorStop(1, "rgba(" + look.stain + ", 0.85)");
      pen.fillStyle = streak;
      pen.beginPath();
      pen.ellipse(stx, sty + stl / 2, 3 + 6 * dice(n * 7), stl / 2, 0, 0, 7);
      pen.fill();
    }
    pen.fillStyle = "rgba(" + look.stain + ", 0.92)";
    pen.beginPath();
    pen.moveTo(-wide, 4);
    for (var x = -wide / 2 - 10; x <= wide / 2 + 10; x += 6) { pen.lineTo(x, -high * 0.12 - high * 0.1 * dice(seed + x * 0.3)); }
    pen.lineTo(wide, 4);
    pen.closePath();
    pen.fill();
  }
  if (look.wet) {                                   // wet: dark from the foot up, and a shine on its lit side
    var w = pen.createLinearGradient(0, 0, 0, -high * look.wet);
    w.addColorStop(0, "rgba(16, 20, 18, 0.6)");
    w.addColorStop(1, "rgba(16, 20, 18, 0)");
    pen.fillStyle = w;
    pen.fillRect(-wide, -high, wide * 2, high + 4);
    pen.strokeStyle = "rgba(255, 255, 250, 0.55)";
    pen.lineWidth = 2;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(-wide * 0.3, -high * 0.62);
    pen.quadraticCurveTo(-wide * 0.18, -high * 0.72, -wide * 0.02, -high * 0.76);
    pen.stroke();
  }
  pen.restore();
  natPathOf(pts);
  pen.strokeStyle = "rgba(24, 20, 16, 0.55)";
  pen.lineWidth = 1.3;
  pen.stroke();
  pen.restore();
  if (look.moss) {                                  // moss on its top, in soft tufts, lit
    for (n = 0; n < wide * look.moss * 1.5; n++) {
      var u = (dice(seed * 7 + n) - 0.5) * 0.85, mx = u * wide, my = -high * (0.95 - 1.6 * u * u) + 3 + 7 * dice(n);
      var mr = 2 + 3.5 * dice(seed + n * 5);
      pen.fillStyle = ["#2e4a1c", "#43642a", "#5c8034", "#7a9c44"][Math.floor(dice(seed + n * 3) * 4)];
      pen.beginPath();
      pen.arc(mx, my, mr, 0, 7);
      pen.fill();
    }
  }
  for (n = 0; n < wide / 6; n++) {                  // the ground's grit and small stones at its foot
    var gx = (dice(seed * 17 + n) - 0.5) * wide * 1.2, gy = 1 + 4 * dice(n * 3 + seed);
    pen.fillStyle = dice(n * 5) < 0.5 ? "rgba(60, 48, 34, 0.7)" : "rgba(150, 132, 108, 0.6)";
    pen.beginPath();
    pen.ellipse(gx, gy, 1.5 + 3 * dice(n * 9), 1 + 1.5 * dice(n * 11), 0, 0, 7);
    pen.fill();
  }
}

// A stone as a sprite for thicket.js's layers, its point at its foot's middle.
function rockSprite(wide, high, seed, look, sharp) {
  return thkSprite(wide * 1.6 + 40, high * 1.4 + 40, wide * 0.8 + 20, high * 1.3 + 20, function () { natRock(wide, high, seed, look); }, sharp);
}

// Ground for a layer, as a sprite: "wide" across and "high" deep from a wavy top edge at 0, painted with soil, the
// litter lying on it and small stones, darker toward the foot. look: soil (two colours, top and foot), litter
// (colours of the fallen leaves), many (how many times the usual litter: a dry forest's floor), leafSize (their size,
// 1 the usual), pebbles (how many), patch (true: a ragged round patch of it, not a band), seed.
// Returns thkSprite()'s, its point at the top's left end.
function natGround(wide, high, look) {
  look = look || {};
  var seed = look.seed || 1, soil = look.soil || ["#8a6a44", "#5a4028"], litter = look.litter || ["#9a6a34", "#b8863e", "#7a5a2a", "#c89a50"];
  return thkSprite(wide, high + 40, 0, 30, function () {
    function edge(x) { return -14 * Math.sin(x * 0.0031 + seed) - 6 * Math.sin(x * 0.017 + seed * 2); }
    if (look.patch) {                               // a patch, not a band: a ragged round, its edge soft
      var pts = [];
      for (var k = 0; k < 26; k++) {
        var a = k / 26 * Math.PI * 2, r = 1 + 0.12 * (dice(seed + k * 3) - 0.5) + 0.06 * Math.sin(a * 5 + seed);
        pts.push([wide / 2 + Math.cos(a) * wide / 2 * 0.96 * r, high / 2 + Math.sin(a) * high / 2 * 0.9 * r]);
      }
      natPathOf(pts);
      pen.clip();
    }
    var g = pen.createLinearGradient(0, -20, 0, high);
    g.addColorStop(0, soil[0]);
    g.addColorStop(1, soil[1]);
    pen.fillStyle = g;
    pen.beginPath();
    pen.moveTo(0, high);
    for (var x = 0; x <= wide; x += 24) { pen.lineTo(x, edge(x)); }
    pen.lineTo(wide, high);
    pen.fill();
    var n, count = Math.round(wide * high / 90);
    for (n = 0; n < count; n++) {                   // the soil's grain
      var px = dice(seed * 3 + n * 1.1) * wide, py = edge(px) + 4 + dice(seed * 5 + n * 1.7) * (high - 4);
      pen.fillStyle = dice(n) < 0.5 ? "rgba(30, 20, 10, 0.25)" : "rgba(255, 240, 210, 0.14)";
      pen.fillRect(px, py, 1.5 + 2 * dice(n * 3), 1 + dice(n * 5));
    }
    for (n = 0; n < count / 6 * (look.many || 1); n++) {   // fallen leaves, lying flat (foreshortened), turned every way
      px = dice(seed * 7 + n * 1.3) * wide;
      py = edge(px) + 6 + Math.pow(dice(seed * 9 + n * 2.3), 0.8) * (high - 10);
      var near = (py - edge(px)) / high, size = (6 + 9 * near) * (look.leafSize || 1);
      pen.save();
      pen.translate(px, py);
      pen.rotate(dice(n * 11) * 6.3);
      pen.scale(1, 0.45);
      leafPath(pen, size * 2, size * 0.8, 0.1);
      pen.fillStyle = blend(litter[n % litter.length], soil[1], 0.25 + 0.3 * dice(n * 13));
      pen.fill();
      pen.strokeStyle = "rgba(40, 24, 10, 0.4)";
      pen.lineWidth = 0.8;
      pen.stroke();
      pen.restore();
    }
    for (n = 0; n < (look.pebbles || 0); n++) {     // small stones, lit on top
      px = dice(seed * 13 + n * 1.9) * wide;
      py = edge(px) + 8 + dice(seed * 15 + n * 2.9) * (high - 14);
      var r = 3 + 6 * (py - edge(px)) / high * dice(n * 3);
      pen.fillStyle = "rgba(30, 24, 16, 0.4)";
      pen.beginPath(); pen.ellipse(px + 1, py + 2, r * 1.2, r * 0.5, 0, 0, 7); pen.fill();
      pen.fillStyle = ["#8a8478", "#9a9080", "#7a746a"][n % 3];
      pen.beginPath(); pen.ellipse(px, py, r * 1.1, r * 0.7, 0, 0, 7); pen.fill();
      pen.fillStyle = "rgba(255, 248, 230, 0.4)";
      pen.beginPath(); pen.ellipse(px - r * 0.3, py - r * 0.25, r * 0.5, r * 0.25, 0, 0, 7); pen.fill();
    }
  });
}

// --- the sky ---

// A soft cloud of the dry season's sky, painted, its foot's middle at (x, y), "wide" across: lobes piled higher in
// the middle, the shade of each laid first and its lit top over it a little up and to the sun's side, all of it
// softened as a brush leaves a cloud's edge, its foot flat and greyer. t: seconds (it drifts and breathes); seed: a
// number; alpha: 0 to 1. Returns nothing: it draws with pen.
function natCloud(t, x, y, wide, seed, alpha) {
  var n, lobes = 11, list = [];
  x += t * (3 + 3 * dice(seed));
  for (n = 0; n < lobes; n++) {
    var u = n / (lobes - 1) - 0.5, r = wide * (0.13 + 0.13 * (1 - Math.abs(u) * 1.7) + 0.05 * dice(seed + n));
    list.push([x + u * wide * 0.82 + (dice(seed + n * 7) - 0.5) * wide * 0.05,
               y - r * 0.55 - wide * 0.14 * Math.max(0, 1 - Math.abs(u) * 2.2) * (0.6 + 0.8 * dice(seed + n * 3)),
               r * (1 + 0.02 * Math.sin(t * 0.3 + n))]);
  }
  pen.save();
  pen.globalAlpha = alpha;
  pen.filter = "blur(" + (wide * 0.018).toFixed(1) + "px)";
  pen.fillStyle = "#c4cfdc";                        // the shade under every lobe
  pen.beginPath();
  list.forEach(function (l) { pen.moveTo(l[0] + l[2], l[1]); pen.arc(l[0], l[1], l[2], 0, 7); });
  pen.fill();
  pen.fillStyle = "#e8edf2";                        // the half light
  pen.beginPath();
  list.forEach(function (l) { pen.moveTo(l[0] - l[2] * 0.06 + l[2] * 0.9, l[1] - l[2] * 0.12); pen.arc(l[0] - l[2] * 0.06, l[1] - l[2] * 0.12, l[2] * 0.9, 0, 7); });
  pen.fill();
  pen.fillStyle = "#ffffff";                        // the lit tops
  pen.beginPath();
  list.forEach(function (l) { pen.moveTo(l[0] - l[2] * 0.15 + l[2] * 0.68, l[1] - l[2] * 0.3); pen.arc(l[0] - l[2] * 0.15, l[1] - l[2] * 0.3, l[2] * 0.68, 0, 7); });
  pen.fill();
  pen.restore();
}

// --- from the summit ---

// "#rrggbb" as "r, g, b".
function hexRgb(c) { return [1, 3, 5].map(function (k) { return parseInt(c.slice(k, k + 2), 16); }).join(", "); }

// A ridge far off, seen against a low sun, as a sprite for a layer: a silhouette "wide" across along its crest
// ridge(x) (pixels above y = 0), filled with "colour" and paler toward its foot where the air lies thick, its crest
// lit by a thin rim where the sun is behind it. look: tall, seed, jag (0 smooth to 1 sharp: limestone), rim ("r, g,
// b"), deep (pixels below 0 it runs on). Returns {sprite, ridge}, the sprite to place at x = -300, y = the base line.
function ridgeLayer(colour, look) {
  look = look || {};
  var tall = look.tall || 200, seed = look.seed || 1, jag = look.jag || 0, deep = look.deep || 160;
  function ridge(x) {
    var y = 0.55 + 0.25 * Math.sin(x * 0.0019 + seed) + 0.12 * Math.sin(x * 0.0057 + seed * 2.1) + 0.06 * Math.sin(x * 0.014 + seed * 3.3);
    var spike = Math.pow(Math.abs(Math.sin(x * 0.0041 + seed * 1.7)), 6) * 0.35 + Math.pow(Math.abs(Math.sin(x * 0.011 + seed)), 10) * 0.15;
    return tall * (y + jag * spike);
  }
  var sprite = thkSprite(3400, tall * 1.6 + deep + 40, 300, tall * 1.6 + 20, function () {
    var g = pen.createLinearGradient(0, -tall, 0, deep);
    g.addColorStop(0, colour);
    g.addColorStop(1, blend(colour, look.foot || "#f0dcc0", 0.55));
    pen.fillStyle = g;
    pen.beginPath();
    pen.moveTo(-300, deep);
    for (var x = -300; x <= 3100; x += 6) { pen.lineTo(x, -ridge(x)); }
    pen.lineTo(3100, deep);
    pen.closePath();
    pen.fill();
    if (look.rim) {                                 // the sun's rim along the crest
      pen.strokeStyle = "rgba(" + look.rim + ", 0.7)";
      pen.lineWidth = 2;
      pen.beginPath();
      for (x = -300; x <= 3100; x += 6) { if (x === -300) { pen.moveTo(x, -ridge(x) + 1); } else { pen.lineTo(x, -ridge(x) + 1); } }
      pen.stroke();
    }
  }, PIX);
  return {sprite: sprite, ridge: ridge};
}

// A limestone mountain as Doi Luang Chiang Dao stands, its foot's middle at (0, 0), "wide" across and "high" tall:
// two or three sharp peaks, sheer grey cliffs streaked down by the rain, the faces toward the sun (look.sun: 1 the sun
// to the right, -1 to the left) lit warm and the faces away from it blue in shade, forest clothing its lower shoulders
// (bushes in rows, as forestHill's) up to "forest" of its height. look: seed, sun, lit ("#rrggbb"), shade, greens,
// forest (0 to 1). Returns nothing: it draws with pen (into a sprite, once; see peakSprite).
function limestonePeak(wide, high, look) {
  look = look || {};
  var seed = look.seed || 1, sun = look.sun || 1, lit = look.lit || "#e8c890", shade = look.shade || "#5a6680", n, k;
  var peaks = [[-0.18, 1], [0.12, 0.82], [0.32, 0.6]].map(function (q, m) {
    return [q[0] * wide + (dice(seed + m) - 0.5) * wide * 0.06, q[1] * high * (0.9 + 0.1 * dice(seed + m * 3))];
  });
  function crest(x) {                               // the crest: the highest of the peaks' cones, jagged
    var y = 0;
    peaks.forEach(function (q) { y = Math.max(y, q[1] - Math.abs(x - q[0]) * (1.5 + 0.3 * dice(seed)) ); });
    return Math.max(0, y + high * 0.03 * Math.sin(x * 0.09 + seed) + high * 0.02 * Math.sin(x * 0.23));
  }
  pen.beginPath();
  pen.moveTo(-wide / 2, 0);
  for (var x = -wide / 2; x <= wide / 2; x += 3) { pen.lineTo(x, -crest(x)); }
  pen.lineTo(wide / 2, 0);
  pen.closePath();
  pen.fillStyle = shade;
  pen.fill();
  pen.save();
  pen.clip();
  var keepT = pen.getTransform();
  if (look.rim) {                                   // backlit: a rim of the sun along the crest, the rest in shade
    pen.strokeStyle = "rgba(" + look.rim + ", 0.85)";
    pen.lineWidth = 5;
    pen.beginPath();
    for (x = -wide / 2; x <= wide / 2; x += 3) { if (x === -wide / 2) { pen.moveTo(x, -crest(x) + 2); } else { pen.lineTo(x, -crest(x) + 2); } }
    pen.stroke();
  }
  for (x = -wide / 2; x < (look.rim ? -wide : wide / 2); x += 3) {       // each face lit as it turns to the sun: where the crest climbs toward it
    var rise = crest(x + 3) - crest(x - 3), toward = clamp(-rise * sun / 6), top = -crest(x);
    if (toward < 0.05) { continue; }
    var g = pen.createLinearGradient(0, top, 0, top + crest(x) * 0.8);
    g.addColorStop(0, "rgba(" + hexRgb(lit) + ", " + (0.95 * toward).toFixed(3) + ")");
    g.addColorStop(1, "rgba(" + hexRgb(lit) + ", 0)");
    pen.fillStyle = g;
    pen.fillRect(x, top, 3.5, crest(x) * 0.8);
  }
  pen.save();                                       // the faces' edges soft, as paint is
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.filter = "blur(" + (9 * keepT.a).toFixed(1) + "px)";
  pen.drawImage(pen.canvas, 0, 0);
  pen.restore();
  pen.lineCap = "round";
  for (n = 0; n < 0; n++) {                         // (no streaks: at a peak's distance they read as stripes)
    var sx = -wide / 2 + wide * dice(seed * 3 + n * 1.7), top = -crest(sx) + 4, len = (crest(sx)) * (0.2 + 0.5 * dice(seed + n * 5));
    pen.strokeStyle = dice(n * 7 + seed) < 0.5 ? "rgba(30, 30, 40, 0.1)" : "rgba(255, 246, 226, 0.08)";
    pen.lineWidth = 1 + 1.5 * dice(n * 9);
    pen.beginPath();
    pen.moveTo(sx, top);
    pen.lineTo(sx + (dice(n * 11) - 0.5) * 6, top + len);
    pen.stroke();
  }
  for (n = 0; n < 40; n++) {                        // ledges with a little scrub on them, across the cliffs
    var lx = -wide / 2 + wide * dice(seed * 5 + n * 2.3), ly = -crest(lx) * (0.3 + 0.6 * dice(seed + n * 7)), lw = 10 + 30 * dice(n * 3);
    pen.strokeStyle = "rgba(60, 80, 50, 0.6)";
    pen.lineWidth = 3;
    pen.beginPath();
    pen.moveTo(lx, ly);
    pen.lineTo(lx + lw, ly + 3);
    pen.stroke();
  }
  pen.restore();
  var greens = look.greens || THK_SHADE, forest = look.forest === undefined ? 0.4 : look.forest;
  var pool = [natBush(200, 110, seed * 7, greens, [], PIX), natBush(200, 110, seed * 7 + 1, greens.map(function (g) { return blend(g, "#7a8a3a", 0.12); }), [], PIX)];
  for (k = 0; k < 8; k++) {                         // the forest on its lower shoulders, row on row
    var level = high * forest * (1 - k / 8);
    for (x = -wide / 2; x < wide / 2; x += 70 + 50 * dice(seed + k * 31 + x)) {
      if (crest(x) < level * 0.6) { continue; }
      thkPlace(pool[Math.floor(dice(seed + x + k) * 2)], x, -Math.min(crest(x) - 10, level) + 30, 0.55 + 0.25 * (k / 8), 0);
    }
  }
}

// A limestone mountain as a sprite for a layer, its point at its foot's middle.
function peakSprite(wide, high, look, sharp) {
  return thkSprite(wide + 60, high * 1.12 + 40, wide / 2 + 30, high * 1.1 + 20, function () { limestonePeak(wide, high, look); }, sharp || PIX);
}

// Rays of a low sun fanning out from behind something (a peak, a ridge) at (x, y): long faint wedges of light,
// turning very slowly, brightest near the sun. t: seconds; strength: 0 to 1; colour "r, g, b"; seed: a number.
// Returns nothing: it draws with pen, in screen light, over what is there.
function natRays(t, x, y, strength, colour, seed) {
  var c = colour || "255, 230, 180";
  pen.save();
  pen.globalCompositeOperation = "screen";
  for (var n = 0; n < 9; n++) {
    var a = Math.PI * 2 * (n + 0.6 * dice(seed + n * 3)) / 9 + 0.02 * Math.sin(t * 0.1 + n), w = 0.02 + 0.05 * dice(seed + n * 5), long = 1400;
    var g = pen.createRadialGradient(x, y, 20, x, y, long);
    g.addColorStop(0, "rgba(" + c + ", " + (strength * (0.25 + 0.2 * dice(n + seed))).toFixed(3) + ")");
    g.addColorStop(1, "rgba(" + c + ", 0)");
    pen.fillStyle = g;
    pen.beginPath();
    pen.moveTo(x, y);
    pen.lineTo(x + Math.cos(a - w) * long, y + Math.sin(a - w) * long);
    pen.lineTo(x + Math.cos(a + w) * long, y + Math.sin(a + w) * long);
    pen.closePath();
    pen.fill();
  }
  pen.restore();
}

// --- a tiered cascade ---

// The ledges of a tiered cascade, as the north's limestone falls are (Bua Tong's sticky falls, Mae Kampong): "count"
// steps going down toward us, each a lip of travertine the water pours over, built up by the lime into rounded dams,
// so the lip bulges and dips; each lower one a little wider, the whole wandering left and right. Seen from in front
// and a little above. The top step's lip near (0, 0); "wide" the top's width, "drop" how far one step falls, "deep" how
// deep each pool lies behind its lip. Each step has the streams the water pours in: [[from, to], ...] across it, the
// rest wet rock with only a trickle. Returns [{y, left, right, lip(x), pool, streams}, ...], top first.
function cascadeSteps(count, wide, drop, deep, seed) {
  var steps = [], mid = 0;
  for (var n = 0; n < count; n++) {
    var w = wide * (1 + n * 0.28) * (0.85 + 0.3 * dice(seed + n));
    mid += (dice(seed + n * 3) - 0.5) * wide * 0.35;
    var streams = [], at = mid - w / 2, end = mid + w / 2;
    while (at < end) {                              // streams and dry rock in turn across the lip
      var wet = w * (0.12 + 0.3 * dice(seed + n * 7 + at * 0.01)) / (1 + n * 0.15), dry = w * (0.05 + 0.12 * dice(seed + n * 11 + at * 0.01));
      streams.push([at, Math.min(end, at + wet)]);
      at += wet + dry;
    }
    (function (y, left, right, k, list) {
      var lobes = [], tilt = (dice(seed + k * 23) - 0.5) * 50;
      for (var m = 0; m < 9; m++) { lobes.push([left + (right - left) * (m + 0.5 * dice(seed + k * 13 + m)) / 9, 8 + 14 * dice(seed + k * 17 + m)]); }
      steps.push({y: y, left: left, right: right, pool: deep * (1 + k * 0.3), streams: list,
                  lip: function (x) {                // the lip: bulging dams of lime, and lower toward its ends
                    var h = 0;
                    lobes.forEach(function (l) { h = Math.max(h, l[1] * Math.max(0, 1 - Math.pow((x - l[0]) / ((right - left) / 9), 2))); });
                    var u = (x - left) / (right - left), sag = 26 * Math.pow(Math.abs(u - 0.5) * 2, 3);
                    return y - h + sag + tilt * (u - 0.5);
                  }});
    })(steps.length ? steps[steps.length - 1].y + drop * (0.6 + 0.8 * dice(seed + n * 19)) * (1 + n * 0.1) : 0, mid - w / 2, mid + w / 2, n, streams);
  }
  return steps;
}

// The rock of a tiered cascade, painted once: under each lip a face of cream and ochre travertine, rounded in bulges
// as the lime builds it, dark and wet where the water runs; its ends buried in moss and ferns; behind each lip its
// pool, turquoise, the bank's light on it. steps: cascadeSteps()'s. Returns nothing: it draws with pen.
function cascadeRock(steps, drop, seed) {
  var n, k, x;
  for (n = steps.length - 1; n >= 0; n--) {
    var st = steps[n], nx = n + 1 < steps.length ? steps[n + 1] : null, below = nx ? nx.lip((nx.left + nx.right) / 2) - nx.pool * 0.9 : st.y + drop * 1.2;
    var l0 = st.left - 20, r0 = st.right + 20;
    pen.beginPath();                                // the face, from the lip down to the next pool, its sides rounded
    pen.moveTo(st.left + 30, below + 6);
    pen.quadraticCurveTo(l0 - 10, (st.lip(st.left) + below) / 2, st.left, st.lip(st.left));
    for (x = st.left; x <= st.right; x += 6) { pen.lineTo(x, st.lip(x)); }
    pen.quadraticCurveTo(r0 + 10, (st.lip(st.right) + below) / 2, st.right - 30, below + 6);
    pen.closePath();
    var g = pen.createLinearGradient(0, st.y - 20, 0, below);
    g.addColorStop(0, "#d4c096");
    g.addColorStop(0.45, "#a8906a");
    g.addColorStop(1, "#5e4c34");
    pen.fillStyle = g;
    pen.fill();
    pen.save();
    pen.clip();
    for (k = 0; k < (st.right - st.left) / 9; k++) {   // the travertine's bulges, lit on top, shaded under
      var bx = st.left - 20 + (st.right - st.left + 40) * dice(seed + n * 101 + k * 1.7), by = st.y + (below - st.y) * dice(seed + n * 103 + k * 2.3), br = 8 + 20 * dice(seed + k * 5 + n);
      var bg = pen.createRadialGradient(bx - br * 0.3, by - br * 0.45, 1, bx, by, br);
      bg.addColorStop(0, "rgba(240, 228, 198, 0.75)");
      bg.addColorStop(0.6, "rgba(168, 142, 100, 0.3)");
      bg.addColorStop(1, "rgba(60, 46, 28, 0.25)");
      pen.fillStyle = bg;
      pen.beginPath();
      pen.ellipse(bx, by, br, br * 0.7, 0, 0, 7);
      pen.fill();
    }
    st.streams.forEach(function (sm) {              // where the water runs, the rock dark and wet
      var wg = pen.createLinearGradient(sm[0], 0, sm[1], 0);
      wg.addColorStop(0, "rgba(40, 34, 24, 0)");
      wg.addColorStop(0.2, "rgba(40, 34, 24, 0.4)");
      wg.addColorStop(0.8, "rgba(40, 34, 24, 0.4)");
      wg.addColorStop(1, "rgba(40, 34, 24, 0)");
      pen.fillStyle = wg;
      pen.fillRect(sm[0] - 6, st.y - 30, sm[1] - sm[0] + 12, below - st.y + 40);
    });
    pen.restore();
    pen.beginPath();                                // its pool, behind the lip, with a soft shore
    pen.moveTo(st.left, st.lip(st.left));
    for (x = st.left; x <= st.right; x += 6) { pen.lineTo(x, st.lip(x) + 3); }
    for (x = st.right; x >= st.left; x -= 6) { var u = (x - st.left) / (st.right - st.left); pen.lineTo(x, st.lip(x) - st.pool * Math.sin(Math.PI * u) * (0.85 + 0.15 * Math.sin(x * 0.03 + n))); }
    pen.closePath();
    var w = pen.createLinearGradient(0, st.y - st.pool, 0, st.y);
    w.addColorStop(0, "#4e9a94");
    w.addColorStop(0.3, "#327e82");
    w.addColorStop(0.75, "#4c9c98");
    w.addColorStop(1, "#8cc4b6");
    pen.fillStyle = w;
    pen.fill();
    pen.save();
    pen.clip();
    var sky = pen.createLinearGradient(st.left, 0, st.right, 0);   // the sky's light lying on it, in a soft band
    sky.addColorStop(0, "rgba(220, 240, 230, 0)");
    sky.addColorStop(0.5, "rgba(220, 240, 230, 0.35)");
    sky.addColorStop(1, "rgba(220, 240, 230, 0)");
    pen.fillStyle = sky;
    pen.fillRect(st.left, st.y - st.pool * 0.55, st.right - st.left, st.pool * 0.25);
    for (k = 0; k < 12; k++) {                      // foam drifting on it, below the fall above
      var fx = st.left + (st.right - st.left) * dice(seed + n * 51 + k), fy = st.y - st.pool * (0.6 + 0.3 * dice(seed + k * 3 + n));
      pen.fillStyle = "rgba(255, 255, 255, 0.35)";
      pen.beginPath();
      pen.ellipse(fx, fy, 6 + 14 * dice(k + n), 2 + 2 * dice(k * 5), 0, 0, 7);
      pen.fill();
    }
    pen.restore();
    for (k = 0; k < 40; k++) {                      // moss, ferns and wet leaves over its ends
      var side = k % 2 ? st.left : st.right, inward = k % 2 ? 1 : -1, mx = side + inward * (dice(seed + k * 3 + n) - 0.4) * 70;
      var my = st.lip(Math.max(st.left, Math.min(st.right, mx))) + (below - st.y) * dice(seed + k * 11 + n) * 0.9;
      pen.fillStyle = ["#2e4a1c", "#3e6024", "#557a2e", "#6e9238"][k % 4];
      pen.beginPath();
      pen.ellipse(mx, my, 6 + 12 * dice(seed + k * 13 + n), 4 + 8 * dice(seed + k * 17 + n), 0, 0, 7);
      pen.fill();
    }
  }
}

// The pool at a tiered cascade's foot, its back edge at y (where the lowest fall lands), from left to right: deep
// turquoise, the sky's light on it, its near shore of wet stones. Painted once, after cascadeRock(). Returns nothing.
function cascadeFoot(steps, drop, seed) {
  var st = steps[steps.length - 1], y = st.y + drop * 1.1, left = st.left - 60, right = st.right + 60, x, k;
  pen.beginPath();
  pen.moveTo(left, y);
  for (x = left; x <= right; x += 10) { pen.lineTo(x, y - 4 * Math.sin(x * 0.05)); }
  for (x = right; x >= left; x -= 10) { var u = (x - left) / (right - left); pen.lineTo(x, y + 90 * Math.sin(Math.PI * u) + 8 * Math.sin(x * 0.04 + seed)); }
  pen.closePath();
  var w = pen.createLinearGradient(0, y, 0, y + 90);
  w.addColorStop(0, "#2e7a80");
  w.addColorStop(0.5, "#4c9c98");
  w.addColorStop(1, "#9ccfc0");
  pen.fillStyle = w;
  pen.fill();
  for (k = 0; k < 18; k++) {                        // the near shore's wet stones
    var sx = left + (right - left) * (k + dice(seed + k)) / 18, u2 = (sx - left) / (right - left), sy = y + 90 * Math.sin(Math.PI * u2) + 4;
    pen.fillStyle = ["#5e584e", "#6e665a", "#4e4a42"][k % 3];
    pen.beginPath();
    pen.ellipse(sx, sy, 14 + 18 * dice(seed + k * 3), 7 + 6 * dice(seed + k * 5), 0, 0, 7);
    pen.fill();
    pen.fillStyle = "rgba(255, 255, 250, 0.35)";
    pen.beginPath();
    pen.ellipse(sx - 5, sy - 4, 6, 2, 0, 0, 7);
    pen.fill();
  }
}

// The water of a tiered cascade, drawn every frame over its rock: over each stream of each lip a curtain of white
// water, following the lip's bulges, its streaks running down and catching the light; a trickle down the dry rock
// between; a boil of foam at each curtain's foot; ripples going across each pool. t: seconds; steps:
// cascadeSteps()'s; drop: as given to it; seed: a number. Returns nothing: it draws with pen.
function cascadeWater(t, steps, drop, seed) {
  var n, k;
  pen.lineCap = "round";
  steps.forEach(function (st, m) {
    var nx = m + 1 < steps.length ? steps[m + 1] : null, below = nx ? nx.lip((nx.left + nx.right) / 2) - nx.pool * 0.75 : st.y + drop * 1.1;
    st.streams.forEach(function (sm, q) {
      var wide = sm[1] - sm[0];
      for (k = 0; k < wide / 2.6; k++) {            // the curtain
        var x = sm[0] + wide * dice(seed + m * 211 + q * 31 + k * 1.3), edge = Math.min(x - sm[0], sm[1] - x) / (wide / 2);
        var top = st.lip(x), fall = below - top, speed = 200 + 120 * dice(seed + k * 3), len = 14 + 34 * dice(seed + k * 7);
        var a = (0.3 + 0.55 * dice(seed + k * 5 + m)) * Math.min(1, edge * 2.5);
        var bend = (dice(seed + k * 9 + q) - 0.5) * 10;
        pen.strokeStyle = "rgba(255, 255, 255, " + (0.22 * a).toFixed(3) + ")";
        pen.lineWidth = 3.5;
        pen.beginPath();
        pen.moveTo(x, top);
        pen.quadraticCurveTo(x + 3, top + fall * 0.4, x + bend, below);
        pen.stroke();
        for (n = 0; n < 3; n++) {                   // the streaks running down it
          var y = ((t * speed + (n / 3 + dice(seed + k * 11 + m)) * fall) % fall);
          pen.strokeStyle = "rgba(255, 255, 255, " + a.toFixed(3) + ")";
          pen.lineWidth = 1 + 1.6 * dice(k * 13 + n);
          pen.beginPath();
          pen.moveTo(x + bend * y / fall, top + y);
          pen.lineTo(x + bend * Math.min(1, (y + len) / fall), top + Math.min(fall, y + len));
          pen.stroke();
        }
      }
      for (k = 0; k < wide / 10; k++) {             // the foam at its foot, boiling
        var fx = sm[0] + wide * dice(seed + m * 307 + q * 17 + k * 1.9), fr = (8 + 14 * dice(seed + k * 3 + m)) * (1 + 0.25 * Math.sin(t * 4 + k));
        var foam = pen.createRadialGradient(fx, below, 1, fx, below, fr);
        foam.addColorStop(0, "rgba(255, 255, 255, 0.85)");
        foam.addColorStop(1, "rgba(255, 255, 255, 0)");
        pen.fillStyle = foam;
        pen.beginPath();
        pen.ellipse(fx, below, fr, fr * 0.5, 0, 0, 7);
        pen.fill();
      }
      if (q + 1 < st.streams.length) {              // a trickle down the rock to the next stream
        var tx = (sm[1] + st.streams[q + 1][0]) / 2, tt = st.lip(tx);
        pen.strokeStyle = "rgba(255, 255, 255, 0.35)";
        pen.lineWidth = 1.2;
        pen.beginPath();
        pen.moveTo(tx, tt);
        pen.quadraticCurveTo(tx + 4, (tt + below) / 2, tx - 2, below);
        pen.stroke();
      }
    });
    pen.strokeStyle = "rgba(255, 255, 255, 0.4)";   // ripples across the pool behind the lip
    pen.lineWidth = 1.2;
    for (k = 0; k < 6; k++) {
      var px = st.left + ((dice(seed + k * 5 + m) * (st.right - st.left) + t * 18) % (st.right - st.left)), u = (px - st.left) / (st.right - st.left);
      var py = st.lip(px) - st.pool * Math.sin(Math.PI * u) * (0.2 + 0.6 * dice(seed + m * 17 + k));
      pen.beginPath();
      pen.moveTo(px, py);
      pen.lineTo(px + 26 + 30 * dice(k + m), py + 0.5);
      pen.stroke();
    }
  });
}

// --- a stream among boulders ---

// A stream's bed, coming toward us out of the forest as Mae Sa's does: its middle wanders from side to side, it
// widens as it comes near (from "far" pixels wide at y = top to "near" at the foot of the sheet), its water brown-green
// and clear at the edges, darker in its runs, the far reaches paler in the air. look: top, far, near, seed, water
// (three colours: deep, middle, shallow edge). Returns {sprite, mid(y), half(y), top}: the sprite to place at (0, 0) of
// the layer, the stream's middle and half its width at a height.
function streamBed(look) {
  look = look || {};
  var top = look.top || 600, far = look.far || 40, near = look.near || 900, seed = look.seed || 1;
  var water = look.water || ["#2e3e2a", "#56664a", "#a0a87e"];
  function u(y) { return clamp((y - top) / (1080 - top)); }
  function half(y) { var q = u(y); return (far + (near - far) * q * q) / 2; }
  function mid(y) { var q = u(y); return WIDE / 2 + (1 - q) * 160 * Math.sin(q * 5 + seed) + q * 120 * Math.sin(seed * 2); }
  var sprite = thkSprite(WIDE, 1080, 0, 0, function () {
    for (var y = top; y < 1100; y += 2) {           // the water, strip by strip, its edges shallow
      var m = mid(y), h = half(y), g = pen.createLinearGradient(m - h, 0, m + h, 0);
      g.addColorStop(0, water[2]);
      g.addColorStop(0.15, water[1]);
      g.addColorStop(0.42, water[0]);
      g.addColorStop(0.55, blend(water[0], "#c8d4b8", 0.35 * (1 - u(y) * 0.6)));   // the sky's light down the middle of the run
      g.addColorStop(0.68, water[0]);
      g.addColorStop(0.85, water[1]);
      g.addColorStop(1, water[2]);
      pen.fillStyle = g;
      pen.fillRect(m - h, y, h * 2, 2.5);
    }
    for (y = top; y < top + 220; y += 2) {           // the far reach pale in the air, on the water only
      pen.fillStyle = "rgba(220, 228, 210, " + (0.7 * (1 - (y - top) / 220)).toFixed(3) + ")";
      pen.fillRect(mid(y) - half(y), y, half(y) * 2, 2.5);
    }
  }, PIX);
  return {sprite: sprite, mid: mid, half: half, top: top};
}

// The stream's water moving, drawn every frame over its bed: ripples of light drifting toward us down the runs, wider
// as they come near; at each stone in the water (stones: [[x, y, wide], ...]) a white pillow of water heaped against
// its upstream side (part "back", drawn before the stones, which hide its foot) and a tail of white water and bubbles
// below it (part "front", drawn after them). t: seconds; bed: streamBed()'s. Returns nothing: it draws with pen.
function streamFlow(t, bed, stones, seed, part) {
  var n, k;
  pen.lineCap = "round";
  for (n = 0; part !== "front" && n < 60; n++) {   // ripples drifting down the runs toward us: flat arcs of light
    var y0 = bed.top + ((dice(seed + n * 1.3) * (1080 - bed.top) + t * (20 + 40 * dice(n))) % (1080 - bed.top));
    var near = (y0 - bed.top) / (1080 - bed.top), m = bed.mid(y0), h = bed.half(y0), x = m + (dice(seed + n * 3) - 0.5) * 1.6 * h;
    var w = 8 + 70 * near, a = (0.06 + 0.2 * near) * (0.5 + 0.5 * Math.sin(t * 1.7 + n * 2.3));
    pen.strokeStyle = "rgba(236, 242, 226, " + a.toFixed(3) + ")";
    pen.lineWidth = 0.8 + 1.8 * near;
    pen.beginPath();
    pen.moveTo(x - w / 2, y0 - w * 0.06);
    pen.quadraticCurveTo(x, y0 + w * 0.08, x + w / 2, y0 - w * 0.06);
    pen.stroke();
  }
  (stones || []).forEach(function (st, q) {         // white water round each stone in the stream
    var sx = st[0], sy = st[1], w = st[2];
    var pulse = 1 + 0.08 * Math.sin(t * 5 + q);       // the pillow heaped on its upstream side: a white crescent, soft
    if (part !== "front") {
    pen.save();
    pen.filter = "blur(" + (w * 0.04).toFixed(1) + "px)";
    var pg = pen.createRadialGradient(sx, sy - w * 0.08, 0, sx, sy - w * 0.08, w * 0.6 * pulse);   // a low bank of foam behind it
    pg.addColorStop(0, "rgba(255, 255, 255, 0.7)");
    pg.addColorStop(0.6, "rgba(255, 255, 255, 0.35)");
    pg.addColorStop(1, "rgba(255, 255, 255, 0)");
    pen.fillStyle = pg;
    pen.beginPath();
    pen.ellipse(sx, sy - w * 0.08, w * 0.6 * pulse, w * 0.14, 0, 0, 7);
    pen.fill();
    pen.restore();
    }
    if (part === "back") { return; }
    for (k = 0; k < 12; k++) {                      // the tail below it: foam drifting off downstream, spreading and thinning
      var ph = ((t * (0.5 + 0.4 * dice(k + q)) + dice(seed + q * 7 + k)) % 1), side = dice(k * 3 + q) < 0.5 ? -1 : 1;
      var tx = sx + side * w * (0.25 + 0.35 * ph), ty = sy + w * 0.12 + ph * w * 1.2, fr = w * (0.08 + 0.12 * ph);
      var tg = pen.createRadialGradient(tx, ty, 0, tx, ty, fr);
      tg.addColorStop(0, "rgba(255, 255, 255, " + (0.55 * (1 - ph)).toFixed(3) + ")");
      tg.addColorStop(1, "rgba(255, 255, 255, 0)");
      pen.fillStyle = tg;
      pen.beginPath();
      pen.ellipse(tx, ty, fr, fr * 0.4, 0, 0, 7);
      pen.fill();
    }
  });
}

// --- bamboo walkways and rafts ---

// A walkway of bamboo as the north builds them over paddies and rivers (Boon Ko Ku So at Mae Hong Son, the Pai's
// bridges): a deck of split bamboo woven into mats, laid on cross poles, on posts of whole bamboo driven into the
// mud, a pole along each edge and a thin rail on the posts, the whole sagging a little between posts and going off
// along "points" ([[x, y, wide], ...], far to near: the deck's middle and its width there). look:
//   post   how far the posts go down below the deck, at a width of 100 (they are cut by what is drawn after)
//   rail   true for the rails on the posts
//   old    0 to 1, how grey and broken the mats are
// Returns nothing: it draws with pen.
function bambooWalk(points, look) {
  look = look || {};
  var post = look.post === undefined ? 90 : look.post, old = look.old || 0, n, k;
  var cane = blend("#c8a868", "#8a8270", old), dark = blend("#7a5a30", "#4a4640", old);
  pen.lineCap = "round";
  function side(q, s2) { return [q[0] + s2 * q[2] / 2, q[1]]; }
  for (n = 0; n < points.length; n += 2) {          // the posts, every other point, down into the mud or the water
    var q = points[n], sc = q[2] / 100;
    [-1, 1].forEach(function (s2) {
      var pt = side(q, s2);
      pen.strokeStyle = dark;
      pen.lineWidth = 3.5 * sc + 0.8;
      pen.beginPath();
      pen.moveTo(pt[0], pt[1] - (look.rail ? 50 * sc : 0));
      pen.lineTo(pt[0] + 2 * sc, pt[1] + post * sc);
      pen.stroke();
    });
  }
  for (n = 0; n + 1 < points.length; n++) {         // the deck, mat by mat
    var a = points[n], b = points[n + 1], al = side(a, -1), ar = side(a, 1), bl = side(b, -1), br = side(b, 1);
    pen.beginPath();
    pen.moveTo(al[0], al[1]);
    pen.lineTo(ar[0], ar[1]);
    pen.lineTo(br[0], br[1]);
    pen.lineTo(bl[0], bl[1]);
    pen.closePath();
    pen.fillStyle = cane;
    pen.fill();
    var slats = Math.max(3, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / (2 + 4 * b[2] / 100)));
    for (k = 0; k <= slats; k++) {                  // the woven slats across it, light and dark in turn
      var u = k / slats, l = [mix(al[0], bl[0], u), mix(al[1], bl[1], u)], r = [mix(ar[0], br[0], u), mix(ar[1], br[1], u)];
      pen.strokeStyle = k % 2 ? blend(cane, "#fff2d0", 0.25) : blend(cane, "#5a4020", 0.3);
      pen.lineWidth = Math.max(0.6, (b[2] / 100) * 2.2);
      pen.beginPath();
      pen.moveTo(l[0], l[1]);
      pen.lineTo(r[0], r[1]);
      pen.stroke();
      if (old && dice(n * 31 + k) < old * 0.2) {     // a broken slat, a gap
        pen.strokeStyle = "rgba(40, 32, 20, 0.6)";
        pen.beginPath();
        pen.moveTo(mix(l[0], r[0], 0.3), mix(l[1], r[1], 0.3));
        pen.lineTo(mix(l[0], r[0], 0.6), mix(l[1], r[1], 0.6));
        pen.stroke();
      }
    }
    pen.strokeStyle = "rgba(60, 40, 16, 0.25)";     // the weave's lengthwise lines
    pen.lineWidth = 0.7;
    for (k = 1; k < 4; k++) {
      pen.beginPath();
      pen.moveTo(mix(al[0], ar[0], k / 4), mix(al[1], ar[1], k / 4));
      pen.lineTo(mix(bl[0], br[0], k / 4), mix(bl[1], br[1], k / 4));
      pen.stroke();
    }
  }
  [-1, 1].forEach(function (s2) {                   // the edge poles, and the rail on the posts
    pen.strokeStyle = blend(cane, "#3a2a10", 0.35);
    pen.lineWidth = 1;
    pen.beginPath();
    points.forEach(function (q2, m) { var pt = side(q2, s2); pen.lineWidth = Math.max(1, 3 * q2[2] / 100); if (m) { pen.lineTo(pt[0], pt[1]); } else { pen.moveTo(pt[0], pt[1]); } });
    pen.stroke();
    if (look.rail) {
      pen.strokeStyle = blend(cane, "#5a4020", 0.2);
      pen.beginPath();                              // the rail, from post to post, sagging a little between
      for (var m = 0; m + 2 < points.length; m += 2) {
        var p0 = side(points[m], s2), p1 = side(points[m + 1], s2), p2 = side(points[m + 2], s2), h0 = 50 * points[m][2] / 100, h1 = 50 * points[m + 1][2] / 100, h2 = 50 * points[m + 2][2] / 100;
        if (!m) { pen.moveTo(p0[0], p0[1] - h0); }
        pen.quadraticCurveTo(p1[0], p1[1] - h1 + 4 * points[m + 1][2] / 100, p2[0], p2[1] - h2);
      }
      pen.stroke();
    }
  });
}

// A raft of bamboo as the north poles them on its lakes and rivers: a dozen whole bamboos lashed side by side with
// cross poles and rattan, its bow raised a little, seen from the side and a little above, its middle at (x, y) on the
// water, "size" 1 about 360 long; it rocks and rides the ripples, and the water laps along it. facing: 1 the bow to
// the right. t: seconds. Returns the raft's deck at its middle, [x, y], for a person to stand on. It draws with pen.
function bambooRaft(x, y, size, t, facing) {
  facing = facing || 1;
  var long = 360 * size, deep = 46 * size, rock = 0.015 * Math.sin(t * 1.1), bob = 2 * size * Math.sin(t * 1.4);
  pen.save();
  pen.translate(x, y + bob);
  pen.rotate(rock);
  pen.scale(facing, 1);
  var n, poles = 12;
  pen.fillStyle = "rgba(20, 30, 28, 0.35)";         // its shadow on the water
  pen.beginPath();
  pen.ellipse(0, deep * 0.55, long * 0.55, deep * 0.35, 0, 0, 7);
  pen.fill();
  for (n = 0; n < poles; n++) {                     // the bamboos, far first, each lit on top, its nodes ringed
    var v = n / (poles - 1), py = -deep / 2 + v * deep, rise = 10 * size * (1 - v * 0.3);
    var cane = n % 3 === 1 ? "#a8904a" : n % 3 === 2 ? "#c0a860" : "#b49a52";
    pen.strokeStyle = blend(cane, "#3a2a10", 0.5);
    pen.lineWidth = 7 * size;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(-long / 2, py);
    pen.quadraticCurveTo(long * 0.3, py, long / 2, py - rise);
    pen.stroke();
    pen.strokeStyle = cane;
    pen.lineWidth = 5.4 * size;
    pen.stroke();
    pen.strokeStyle = blend(cane, "#fff4d0", 0.35);
    pen.lineWidth = 1.5 * size;
    pen.beginPath();
    pen.moveTo(-long / 2, py - 1.5 * size);
    pen.quadraticCurveTo(long * 0.3, py - 1.5 * size, long / 2, py - rise - 1.5 * size);
    pen.stroke();
    pen.strokeStyle = blend(cane, "#3a2a10", 0.45);
    pen.lineWidth = 1 * size;
    for (var k = -4; k <= 4; k++) {                 // its nodes
      var nx = k * long * 0.11 + 6 * size * dice(n * 7 + k), ny = py - Math.max(0, (nx / (long / 2))) * rise * Math.max(0, nx / (long / 2));
      pen.beginPath();
      pen.moveTo(nx, ny - 2.5 * size);
      pen.lineTo(nx, ny + 2.5 * size);
      pen.stroke();
    }
  }
  [-0.32, 0.05, 0.36].forEach(function (u) {        // the cross poles lashed on top, and the rattan
    pen.strokeStyle = "#8a7038";
    pen.lineWidth = 5 * size;
    pen.beginPath();
    pen.moveTo(u * long - 4 * size, -deep / 2 - 3 * size);
    pen.lineTo(u * long + 4 * size, deep / 2 + 2 * size);
    pen.stroke();
    pen.strokeStyle = "#5a3e1c";
    pen.lineWidth = 1.2 * size;
    for (var k2 = 0; k2 < 6; k2++) {
      var ly = -deep / 2 + (k2 + 0.5) / 6 * deep;
      pen.beginPath();
      pen.moveTo(u * long - 5 * size, ly - 2 * size);
      pen.lineTo(u * long + 5 * size, ly + 2 * size);
      pen.stroke();
    }
  });
  pen.restore();
  for (n = 0; n < 10; n++) {                        // the water lapping along its near side
    var lx = x + (n / 9 - 0.5) * long * 0.95, ph = Math.sin(t * 2.2 + n * 1.3);
    pen.strokeStyle = "rgba(255, 250, 236, " + (0.35 + 0.25 * ph).toFixed(3) + ")";
    pen.lineWidth = 1.5 * size;
    pen.beginPath();
    pen.moveTo(lx - 14 * size, y + bob + deep / 2 + 3 * size);
    pen.quadraticCurveTo(lx, y + bob + deep / 2 + (5 + 2 * ph) * size, lx + 14 * size, y + bob + deep / 2 + 3 * size);
    pen.stroke();
  }
  return [x, y + bob - 4 * size];
}
