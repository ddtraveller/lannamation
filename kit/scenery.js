// scenery.js - a scene's place painted as the hero film's is (sash_maeng.html, 2026-10-25 and 26), for any film of
// the kit: flowering beds behind the people and soft blossom framing the picture in front, the air of the day (its
// light, falling petals, one butterfly) or of the night (fireflies near and far), far mountains, and still water that
// mirrors its banks, with plants at its edges, lotus rising out of it and a fish that leaps. The owner, of the hero:
// "Go C all the way and redo the pond scene so it seems like the viewer is coming through a beautiful garden into the
// pond area", then "update the pond scene with the pine lake style of water and mist", "see if you can use the new
// kit to make better background mountains"; and of the Maeng film: "make sure the process of beautification of
// scenery occurs following the same process as for the hero video ... Make sure new videos will be generated with
// this process!" The process is docs/kit/places.md, "Painting the scenery"; this file is its painters.
// Load it after the kit and the files it paints with:
//
//     <script src="oldcartoon.js"></script>
//     <script src="flora.js"></script>
//     <script src="butterflies.js"></script>
//     <script src="night.js"></script>
//     <script src="thicket.js"></script>
//     <script src="pinewoods.js"></script>
//     <script src="wildplaces.js"></script>
//     <script src="scenery.js"></script>
//
// Everything is painted once into a sprite (thicket.js thkSprite()) and placed every frame, swaying in the air.

// --- the garden's pictures ---

// A flowering bush as a sprite, its base's middle its point: thkBush() painted once. wide, high: film pixels; seed: a
// number; greens: seven colours (THK_GREENS, THK_SHADE, THK_SUN); blooms: [[name, count, r, colour], ...] of
// THK_BLOOMS. Returns thkSprite()'s.
// e.g. var bed = sceneryBush(520, 280, 401, THK_GREENS, [["bougainvillea", 50, 16, "#d8338a"]]);
function sceneryBush(wide, high, seed, greens, blooms) {
  return thkSprite(wide + 80, high + 60, wide / 2 + 40, high + 20, function () { thkBush(wide, high, seed, greens, blooms); }, PIX);
}

// A flowering bush upside down, its top's middle its point: blossom hanging into the picture from above, for a top
// corner. As sceneryBush(). Returns thkSprite()'s.
// e.g. var hanging = sceneryHanging(560, 260, 481, THK_SHADE, [["phayasuea", 40, 10, "#f3a6c0"]]);
function sceneryHanging(wide, high, seed, greens, blooms) {
  return thkSprite(wide + 80, high + 60, wide / 2 + 40, 40, function () { pen.scale(1, -1); thkBush(wide, high, seed, greens, blooms); }, PIX);
}

// One plant of flora.js as a sprite, the foot of its stem its point. name: a key of FLORA; size: flora()'s; look:
// flora()'s (colour). Returns thkSprite()'s.
// e.g. var tahern = sceneryPlant("tahern", 1.5);
function sceneryPlant(name, size, look) {
  return thkSprite(300 * size, 320 * size, 150 * size, 300 * size, function () {
    flora(name, 0, 0, Object.assign({size: size, ground: false}, look || {}));
  }, PIX);
}

// A tuft of grass as a sprite, its foot's middle its point: thkGrass() painted once. high: film pixels; count: blades;
// seed: a number; greens: seven colours (THK_GREENS when left out). Returns thkSprite()'s.
// e.g. var grass = sceneryGrass(420, 14, 451);
function sceneryGrass(high, count, seed, greens) {
  return thkSprite(high * 1.6, high + 40, high * 0.8, high + 10, function () { thkGrass(high, count, seed, greens || THK_GREENS); }, PIX);
}

// A bank of grass as a sprite, its foot's middle its point: pinewoods.js grassBank() painted once (620 across), to be
// placed small. high: film pixels; seed: a number; greens: GRASS_GREEN when left out. Returns thkSprite()'s.
// e.g. var tuft = sceneryGrassBank(130, 31);
function sceneryGrassBank(high, seed, greens) {
  return thkSprite(700, 320, 350, 290, function () { grassBank(620, high, seed, greens || GRASS_GREEN, 0); }, PIX);
}

// Places a list of pictures at second t, each swaying in the air: [{sprite, x, y, size}, ...] (size 1 when left out).
// look: {sway: how far they sway, 0 to 1 (0.35); blur: pixels, for what is so near it is out of focus (the soft
// blossom framing the picture: 5)}. Returns nothing: it draws with pen.
// e.g. sceneryBeds(t, [{sprite: bed, x: 40, y: 925}]);   sceneryBeds(t, frame, {sway: 0.4, blur: 5});
function sceneryBeds(t, items, look) {
  look = look || {};
  var sway = look.sway === undefined ? 0.35 : look.sway;
  pen.save();
  if (look.blur) { pen.filter = "blur(" + look.blur + "px)"; }
  items.forEach(function (it) { thkPlace(it.sprite, it.x, it.y, it.size || 1, thkSway(t, it.x * 0.01, sway)); });
  pen.filter = "none";
  pen.restore();
}

// --- the meadow ---

// The wild flowers of a meadow (sceneryMeadow()): small, in drifts, the colours of a painted meadow's sweet peas and
// clover, pink and violet, white, yellow. Each [a THK_BLOOMS name, or "five" (five round petals and a heart), its
// colour (null: the flower's own)].
var SCENERY_MEADOW_FLOWERS = [["five", "#ec6c9c"], ["five", "#a879d8"], ["jasmine", null], ["five", "#f4cf3a"],
                              ["five", "#f6b4cb"], ["five", "#fbf6ee"], ["five", "#e8508a"]];

// A flat meadow painted on a sheet: the owner, 2026-10-27, of the grass before Wiang Si Tuang and before Yonok's
// gate: "make the flat grassy area rich with flowers and birds, and animals", after a painted film's meadow (grass
// in drifts of many greens, low leafy clumps, small flowers dotted through all of it). Its green deepens and grows
// richer toward the near edge; drifts of lighter and darker grass lie across it; grass in short blades grows taller
// near; low clumps of leaves and tall grass with white plumes stand here and there; wild flowers in drifts, dots far
// off and open flowers on their stalks near. Its life (birds, deer, butterflies) is the scene's, on courses
// (decorate.js). b: a canvas's context; left, right, top (far), bottom (near): its edges in the sheet's pixels;
// look: {seed: a number, greens: seven colours (THK_SUN unless told), haze: the far air's colour ("#c4d6c8"),
// flowers: [[name, colour], ...] (SCENERY_MEADOW_FLOWERS), many: how thick the flowers are, 0 to 2 (1), fade: [left,
// right], pixels over which its left and its right edge fade into what is under it ([0, 0]), depth: [far, near], how
// near its top and its bottom edge are, 0 (the far distance) to 1 (at our feet) ([0, 1]: a strip of meadow far off is
// [0.1, 0.4], one at our feet [0.5, 1])}.
// Returns nothing: it paints on b, once, with the set it is part of. e.g. sceneryMeadow(b, 0, 2400, 760, 1080, {seed: 7});
function sceneryMeadow(b, left, right, top, bottom, look) {
  look = look || {};
  var seed = look.seed || 0, g = look.greens || THK_SUN, haze = look.haze || "#c4d6c8", flowers = look.flowers || SCENERY_MEADOW_FLOWERS;
  var many = look.many === undefined ? 1 : look.many, wide = right - left, tall = bottom - top, keep = pen, n, k, x, y, d;
  var fade = look.fade || [0, 0], sheet = b, layer = null;
  if (fade[0] || fade[1]) {                                        // soft edges: painted on a layer of its own, its edges
    layer = document.createElement("canvas");                      // faded, and laid on the sheet
    layer.width = sheet.canvas.width;
    layer.height = sheet.canvas.height;
    b = layer.getContext("2d");
    b.setTransform(sheet.getTransform());
  }
  var span = look.depth || [0, 1];
  function depth(at) { return mix(span[0], span[1], clamp((at - top) / tall)); }   // 0 far, 1 near
  function far(colour, at) { return blend(colour, haze, 0.55 * (1 - depth(at))); }
  b.save();
  b.beginPath(); b.rect(left, top, wide, tall); b.clip();
  var ground = b.createLinearGradient(0, top, 0, bottom);         // the ground: hazy far, a deep rich green near
  ground.addColorStop(0, far(g[4], top)); ground.addColorStop(0.45, g[3]); ground.addColorStop(1, blend(g[2], g[1], 0.5));
  b.fillStyle = ground;
  b.fillRect(left, top, wide, tall);
  for (n = 0; n < Math.round(wide / 50); n++) {                   // drifts of lighter and darker grass, long and low far off
    y = top + tall * Math.pow(dice(seed + n * 7.1), 1.3);
    d = depth(y);
    x = left + wide * dice(seed + n * 3.3);
    var rx = (120 + 380 * dice(seed + n * 5.7)) * (0.5 + d), ry = (5 + 34 * d) * (0.6 + dice(seed + n * 9.1));
    var tone = far(n % 3 === 0 ? g[2] : n % 3 === 1 ? g[5] : g[6], y), soft = b.createRadialGradient(x, y, 0, x, y, rx);
    soft.addColorStop(0, tone + "99");
    soft.addColorStop(1, tone + "00");
    b.save();
    b.translate(x, y); b.scale(1, ry / rx); b.translate(-x, -y);
    b.fillStyle = soft;
    b.beginPath(); b.arc(x, y, rx, 0, 7); b.fill();
    b.restore();
  }
  b.lineCap = "round";                                             // blades, row by row from far to near, taller and
  for (y = top + 2; y < bottom + 24; y += 2 + 7 * depth(y)) {      // further apart near
    d = depth(y);
    var high = 3 + 30 * d * d + 4 * d, gap = 3 + 6 * d;
    b.lineWidth = 0.6 + 1.6 * d;
    for (x = left - 10; x < right + 10; x += gap * (0.6 + 0.8 * dice(seed + x * 0.37 + y * 1.3))) {
      var r = dice(x * 0.13 + y * 0.71 + seed), lean = (dice(x * 0.31 + y + seed) - 0.5) * high * 0.7;
      b.strokeStyle = far(g[1 + Math.floor(r * 6)], y);
      b.beginPath(); b.moveTo(x, y + 2); b.quadraticCurveTo(x + lean * 0.3, y - high * 0.5, x + lean, y - high * (0.7 + 0.5 * r)); b.stroke();
    }
  }
  for (n = 0; n < Math.round(wide / 40); n++) {                   // the undergrowth: patches of small round leaves, clover
    y = top + tall * (0.15 + 0.85 * Math.pow(dice(seed + n * 2.3 + 70), 0.8));   // and vetch, among the blades
    d = depth(y);
    x = left + wide * dice(seed + n * 5.9 + 70);
    var patch = (30 + 90 * dice(seed + n + 70)) * (0.3 + d), leaves = Math.round(12 + 40 * d);
    for (k = 0; k < leaves; k++) {
      var lx = x + (dice(seed + n * 13 + k * 1.7) - 0.5) * patch * 2, ly = y + (dice(seed + n * 11 + k * 2.3) - 0.5) * patch * 0.35;
      var lr = (1 + 5 * depth(ly)) * (0.7 + 0.6 * dice(n + k * 3.1));
      b.fillStyle = far(g[[1, 2, 3, 4, 5][(n + k) % 5]], ly);
      b.beginPath(); b.ellipse(lx, ly, lr * 1.3, lr, dice(n * 7 + k) * 3, 0, 7); b.fill();
    }
  }
  pen = b;                                                         // what stands in it, far to near: low clumps of
  var standing = [];                                               // leaves, tall grass in plume
  for (n = 0; n < Math.round(wide / 260); n++) { standing.push([left + wide * dice(seed + n * 4.3 + 90), top + tall * (0.3 + 0.7 * dice(seed + n * 6.1 + 90)), n]); }
  standing.sort(function (p, q) { return p[1] - q[1]; }).forEach(function (s) {
    var at = depth(s[1]), size = 0.25 + 0.75 * at;
    b.save();
    b.translate(s[0], s[1]);
    b.scale(size, size);
    if (s[2] % 3 === 2) { grassBank(260, 90 + 40 * dice(s[2]), seed + s[2], GRASS_GREEN, 3); }
    else { thkBush(150, 60, seed + s[2] * 3, g, [s[2] % 2 ? ["jasmine", 8, 5] : ["phayasuea", 8, 5, "#ec6c9c"]]); }
    b.restore();
  });
  var bloom = [];                                                  // the wild flowers in drifts
  for (n = 0; n < Math.round(wide / 45 * many); n++) {
    var cy = top + tall * Math.pow(dice(seed + n * 1.7 + 50), 1.1), cx = left + wide * dice(seed + n * 2.9 + 50);
    var kind = flowers[n % flowers.length], spread = (40 + 160 * dice(seed + n + 50)) * (0.4 + depth(cy));
    var count = Math.round((8 + 20 * dice(seed + n * 4.4 + 50)) * (0.6 + depth(cy)));
    for (k = 0; k < count; k++) {
      bloom.push([cx + (dice(seed + n * 31 + k * 1.3) - 0.5) * spread * 2, cy + (dice(seed + n * 17 + k * 2.1) - 0.5) * spread * 0.25, kind, k + n * 40]);
    }
  }
  bloom.sort(function (p, q) { return p[1] - q[1]; }).forEach(function (f) {
    d = depth(f[1]);
    var r = 2 + 3.5 * d + 4 * d * d;
    if (d < 0.3) {                                                // far: a dot of its colour
      b.fillStyle = blend(f[2][1] || "#fbf6ee", haze, 0.3 * (1 - d));
      b.beginPath(); b.arc(f[0], f[1] - 1, r, 0, 7); b.fill();
      return;
    }
    b.strokeStyle = g[2];                                          // near: a stalk, a leaf, an open flower
    b.lineWidth = 0.8 + d;
    b.beginPath(); b.moveTo(f[0], f[1] + 3); b.lineTo(f[0] + (dice(f[3]) - 0.5) * 4, f[1] - r); b.stroke();
    b.fillStyle = g[3];
    b.beginPath(); b.ellipse(f[0] + 3 * d, f[1] - 2, 4 * d, 1.6 * d + 0.5, -0.5, 0, 7); b.fill();
    if (f[2][0] !== "five") {                                      // a flower of the kit's, its ink thin as a small one's
      var line = LINE;
      LINE = STYLE.line * Math.min(0.55, r / 24);
      THK_BLOOMS[f[2][0]](f[0], f[1] - r * 1.5, r, dice(f[3] * 3) * 6, f[2][1] || undefined, f[3]);
      LINE = line;
      return;
    }
    var turn = dice(f[3] * 3) * 6;                                 // five round petals and a yellow heart
    b.fillStyle = f[2][1];
    for (k = 0; k < 5; k++) {
      b.beginPath(); b.arc(f[0] + Math.cos(turn + k * 1.2566) * r * 0.55, f[1] - r * 1.5 + Math.sin(turn + k * 1.2566) * r * 0.55, r * 0.5, 0, 7); b.fill();
    }
    b.fillStyle = "#f6d24a";
    b.beginPath(); b.arc(f[0], f[1] - r * 1.5, r * 0.25, 0, 7); b.fill();
  });
  pen = keep;
  b.restore();
  if (layer) {
    var edge = b.createLinearGradient(left, 0, right, 0);
    edge.addColorStop(0, "rgba(0, 0, 0, " + (fade[0] ? 0 : 1) + ")");
    edge.addColorStop(fade[0] / wide, "rgba(0, 0, 0, 1)");
    edge.addColorStop(1 - fade[1] / wide, "rgba(0, 0, 0, 1)");
    edge.addColorStop(1, "rgba(0, 0, 0, " + (fade[1] ? 0 : 1) + ")");
    b.globalCompositeOperation = "destination-in";
    b.fillStyle = edge;
    b.fillRect(left - 20, top - 80, wide + 40, tall + 160);
    sheet.save();
    sheet.setTransform(1, 0, 0, 1, 0, 0);
    sheet.drawImage(layer, 0, 0);
    sheet.restore();
  }
}

// --- the air ---

// The air of a day over a scene at second t, in front of everything: one butterfly at most, drifting across and away
// (owner, 2026-10-26, of the hero: "a bit too many butterflies"), falling petals, and the light coming through.
// look: {butterfly: {kind (a key of BUTTERFLIES), x, y (where it is at second 0), vx, vy, weave, seed, size, turn
// (radians added to its heading), wing (its own seed)} or null; petals: [count, colour, seed, size] or null; light:
// [strength, seed] or null}. Returns nothing: it draws with pen.
// e.g. sceneryAir(t, {butterfly: {kind: "lacewing", x: 300, y: 520, vx: 90, weave: 60, seed: 3, size: 1.4, turn: 1.2, wing: 2},
//                     petals: [26, "#f6b8cc", 3, 1.1], light: [0.7, 2]});
function sceneryAir(t, look) {
  var b = look.butterfly;
  if (b) {
    var at = butterflyDrift(t, b.x, b.y, {vx: b.vx || 0, vy: b.vy || 0, weave: b.weave, seed: b.seed});
    butterfly(b.kind, at.x, at.y, t, {turn: at.turn + (b.turn || 0), size: b.size || 1, seed: b.wing || 0});
  }
  if (look.petals) { thkPetals(t, look.petals[0], look.petals[1], look.petals[2], look.petals[3]); }
  if (look.light) { thkLight(t, look.light[0], look.light[1]); }
}

// The fireflies of a night at second t: far ones in their many (night.js farFireflies(), in look.far: [[box, count,
// seed], ...]) and near ones in the air over the people, larger, each glowing and fading on its own (look.near: how
// many, 70 in the hero's dance). Returns nothing: it draws with pen.
// e.g. sceneryFireflies(t, {far: [[[0, 420, WIDE, 1000], 160, 0], [[0, 560, WIDE, 1060], 60, 3]], near: 70});
function sceneryFireflies(t, look) {
  (look.far || []).forEach(function (f, k) { farFireflies(t * (1 + 0.1 * k), {box: f[0], count: f[1], seed: f[2]}); });
  for (var f = 0; f < (look.near || 0); f++) {
    var side = f % 3 === 0 ? 120 + 1680 * dice(f + 3) : f % 3 === 1 ? WIDE - 420 * dice(f + 3) : 420 * dice(f + 3), fy = (f % 3 === 0 ? 260 : 520) + 480 * dice(f + 7);
    var fx = side + 40 * Math.sin(t * 0.4 + f), gy = fy + 25 * Math.sin(t * 0.6 + f * 2), glow = Math.pow(0.5 + 0.5 * Math.sin(t * (1.3 + dice(f)) + f * 2.1), 3);
    if (glow < 0.04) { continue; }
    var halo = pen.createRadialGradient(fx, gy, 0, fx, gy, 30);
    halo.addColorStop(0, "rgba(246, 255, 190, " + (0.95 * glow).toFixed(3) + ")");
    halo.addColorStop(0.18, "rgba(220, 255, 140, " + (0.6 * glow).toFixed(3) + ")");
    halo.addColorStop(1, "rgba(214, 255, 130, 0)");
    pen.fillStyle = halo;
    pen.beginPath();
    pen.arc(fx, gy, 30, 0, 7);
    pen.fill();
    pen.fillStyle = "rgba(255, 255, 220, " + glow.toFixed(3) + ")";
    pen.beginPath();
    pen.arc(fx, gy, 2.6, 0, 7);
    pen.fill();
  }
}

// --- the mountains ---

// The far mountains: far off a ridge pale with the air (wildplaces.js ridgeLayer()); standing up out of it a
// limestone peak, as Doi Luang Chiang Dao stands to the north of Chiang Mai (peakSprite()); and in front a range
// clothed in forest, row on row of small bushes with pines standing out of it (pinewoods.js forestHill()); each hazed
// by the air between it and us, laid over what is painted and nowhere else. colour: the set's far colour, "#rrggbb";
// air: the haze's "r, g, b"; base: the far range's foot, y; look: {peak: the peak's x (560 + SIDE), seed}. Painted once
// for each colour and look (thkOnce()), as a sheet of its own. Returns the sheet, a canvas WIDE by 1080, clear where
// there is sky: draw it on a set's back sheet first. A film has mountains of its own, not another's (owner,
// 2026-10-26, of the Maeng film: "Don't reuse the same background mountain as the hero video"): look.peak false for
// none, look.ridges 2 for a second far ridge between (rounder, lower), look.pines how many pines (40), look.seed.
// e.g. back.drawImage(farRange("#a9cfc9", "226, 238, 240", 720), 0, 0);
//      back.drawImage(farRange("#a9cfc9", "226, 238, 240", 720, {peak: false, ridges: 2, pines: 12, seed: 7}), 0, 0);
function farRange(colour, air, base, look) {
  look = look || {};
  var peakX = look.peak === undefined ? 560 + SIDE : look.peak, seed = look.seed || 0, ridges = look.ridges || 1;
  var pines = look.pines === undefined ? 40 : look.pines;
  return thkOnce("far-range " + colour + " " + base + " " + peakX + " " + seed + " " + ridges + " " + pines, function () {
    var greens = THK_SHADE.map(function (g) { return blend(g, colour, 0.5); });
    var ridge = ridgeLayer(blend(colour, "#ffffff", 0.18), {tall: 380, seed: 5 + seed, jag: ridges > 1 ? 0.1 : 0.3, deep: 260, foot: colour});
    // the second ridge clothed in forest too, far off and small, so it is not a plain face (owner, 2026-10-26: "continue
    // with planned upgrades", the Maeng film's pale far ridges among them)
    var second = ridges > 1 ? forestHill({seed: 13 + seed, tall: 240, deep: 140, gap: 20, sizes: ["small"], pines: 0,
                                          greens: THK_SHADE.map(function (g) { return blend(g, colour, 0.72); })}) : null;
    var peak = peakX === false ? null : peakSprite(560, 420, {seed: 3 + seed, sun: 1, lit: blend("#e4dccb", colour, 0.35), shade: blend("#7e93a4", colour, 0.35), greens: greens, forest: 0.4});
    var hill = forestHill({seed: 9 + seed, tall: 300, deep: 160, gap: 24, sizes: ["small"], greens: greens, pines: pines, pineHigh: 130});
    var paper = document.createElement("canvas");
    paper.width = WIDE;
    paper.height = 1080;
    var brush = paper.getContext("2d"), keep = pen;
    function veil(alpha) {
      brush.save();
      brush.globalCompositeOperation = "source-atop";
      brush.fillStyle = "rgba(" + air + ", " + alpha + ")";
      brush.fillRect(0, 0, WIDE, 1080);
      brush.restore();
    }
    pen = brush;                                     // thkPlace() draws with pen
    thkPlace(ridge.sprite, 0, base - 40, 1, 0);
    veil(0.3);
    if (second) { thkPlace(second.sprite, 0, base - 20, 1, 0); veil(0.22); }
    if (peak) { thkPlace(peak, peakX, base - 20, 1, 0); veil(0.25); }
    thkPlace(hill.sprite, 0, base + 20, 1, 0);
    veil(0.15);
    pen = keep;
    return paper;
  });
}

// A mountain of a tale clothed in forest, as the Maeng film's Doi Khao Khwai and its slopes are (moved here from
// maeng/sets.js maengForest(), 2026-10-26, for the Chang Ngu film's Doi Nang Non): the shade under the canopy, pines
// standing along the ridge, and row on row of small bushes down from it, each lower row nearer and larger, hazier toward
// the top. brush: a 2D context; ridge: a function of x giving the slope's top y; look: {blooms: three bands' mixes,
// near the top, the middle and the foot, each three mixes of THK_BLOOMS ([[[], [], []], ...]: none when left out),
// pines (how many: 34), top, foot (the y where the bushes are smallest and largest: 360 and 1080), seed, left, right
// (the extent across the sheet: 0 and WIDE), haze (the air's colour toward the top: "#a9cfc9")}. Gives back nothing: it
// paints on brush (pen points at it while it paints, and is put back).
// e.g. sceneryForest(b, ridge, {pines: 12, top: 220});   sceneryForest(b, ridge, {right: 2 * WIDE, haze: "#b6c6c2"});
function sceneryForest(brush, ridge, look) {
  look = look || {};
  var keep = pen, haze = look.haze || "#a9cfc9", x, r, n, top = look.top === undefined ? 360 : look.top, foot = look.foot || 1080, seed = look.seed || 0;
  var left = look.left || 0, right = look.right === undefined ? WIDE : look.right;
  var blooms = look.blooms || [[[], [], []], [[], [], []], [[], [], []]];
  pen = brush;
  brush.beginPath();                                 // the shade under the canopy
  brush.moveTo(left, 1080);
  for (x = left; x <= right; x += 8) { brush.lineTo(x, ridge(x) + 24); }
  brush.lineTo(right, 1080);
  brush.closePath();
  brush.fillStyle = "#1e3a2c";
  brush.fill();
  var pools = [0, 1, 2].map(function (k) {           // three bands of bushes, hazy near the top to deep near the foot
    var greens = THK_SHADE.map(function (g) { return blend(g, haze, [0.45, 0.22, 0.05][k]); });
    return [0, 1, 2].map(function (m) {
      var pal = m === 1 ? greens.map(function (g) { return blend(g, "#7a8a3a", 0.12); }) : m === 2 ? greens.map(function (g) { return blend(g, "#1e3c44", 0.1); }) : greens;
      return natBush(200, 110, 300 + seed + k * 7 + m, pal, blooms[k][m], PIX);
    });
  });
  var pines = [0, 1, 2].map(function (m) { return pineSprite(220, m === 1 ? "old" : "forest", 400 + m, PIX); });
  for (n = 0; n < (look.pines === undefined ? 34 : look.pines); n++) {   // pines along the ridge, their feet in the canopy
    var px = left + 120 + 1760 * ((right - left) / WIDE) * dice(n * 1.7 + 5 + seed), crest = ridge(px);
    if (crest > 1000) { continue; }
    thkPlace(pines[n % 3], px, crest + 34 + 20 * dice(n + 2), 0.45 + 0.35 * dice(n + 9), 0);
  }
  for (r = 0; r < 30; r++) {                         // row on row down from the ridge, each lower one nearer and larger
    for (x = left - 60 - 120 * dice(r + 1); x < right + 120; ) {
      var y = ridge(x) + 22 + r * 30 + (dice(x * 0.01 + r * 3.1) - 0.3) * 18;
      if (y > 1120) { x += 120; continue; }
      var near = clamp((y - top) / (foot - top)), size = 0.45 + 0.75 * near, band = near < 0.3 ? 0 : near < 0.6 ? 1 : 2;
      thkPlace(pools[band][Math.floor(dice(x * 0.03 + r * 7) * 3)], x, y, size * (0.85 + 0.3 * dice(x * 0.02 + r)), 0);
      x += 200 * size * (0.45 + 0.3 * dice(x * 0.011 + r));
    }
  }
  pen = keep;
}

// --- still water ---
// A pond or a pool is a "water": {edge: its bank, points round it, smoothed (from the near left, below the foot of the
// picture, up the left side, along the far bank, down the right), top: the far bank's points (part of edge), line: the
// far bank's line, that the mirror turns about, left, right, foot: its extent, depths: [colour at the line, colour at
// the foot], mirror: [[from y, how strong], ...] (strong across the water, fading toward the near bank, so what swims
// in it shows near at hand), tint: the water's "r, g, b", rings: [[x, y, second], ...] of drops (oldcartoon.js
// ripples()), mist: "r, g, b" or null}. Nothing is drawn round it: the water meets the grass, and plants grow at its
// edges (sceneryWaterPlants()). The hero's pond (sash_maeng.html POND) is the example.

// The water's outline as a path, for its fill and as a clip: a smooth line through water.edge. Returns nothing: it
// makes a path on pen. e.g. sceneryWaterShape(POND); pen.clip();
function sceneryWaterShape(water) {
  var p = water.edge, n = p.length;
  pen.beginPath();
  pen.moveTo((p[n - 1][0] + p[0][0]) / 2, (p[n - 1][1] + p[0][1]) / 2);
  for (var k = 0; k < n; k++) {
    var next = p[(k + 1) % n];
    pen.quadraticCurveTo(p[k][0], p[k][1], (p[k][0] + next[0]) / 2, (p[k][1] + next[1]) / 2);
  }
  pen.closePath();
}

// The far bank's height at x, read off water.top (a little below the points, as the smooth line runs inside them).
// Returns a y. e.g. sceneryBankAt(POND, 800)
function sceneryBankAt(water, x) {
  var top = water.top;
  for (var k = 1; k < top.length; k++) {
    if (x <= top[k][0]) { return mix(top[k - 1][1], top[k][1], clamp((x - top[k - 1][0]) / (top[k][0] - top[k - 1][0]))) + 3; }
  }
  return top[top.length - 1][1] + 3;
}

// The deep of the water, under what swims in it: still water, its colour going from water.depths[0] at the far bank to
// water.depths[1] at the foot. Returns nothing: it draws with pen. e.g. sceneryWaterDepths(POND);
function sceneryWaterDepths(water) {
  pen.save();
  sceneryWaterShape(water);
  var g = pen.createLinearGradient(0, water.line, 0, water.foot);
  g.addColorStop(0, water.depths[0]);
  g.addColorStop(1, water.depths[1]);
  pen.fillStyle = g;
  pen.fill();
  pen.restore();
}

// The water's face at second t, over what swims in it: what stands behind it mirrored (pinewoods.js natReflect(), with
// no shore line), in water.mirror's bands; then mirrored(), if given (a flier's reflection: sceneryMirrored()); the
// water darker than what it mirrors; the drops' rings; the mist lying on it and strands of it rising, inside the water;
// and a few wisps over the far bank. Returns nothing: it draws with pen.
// e.g. sceneryWaterSurface(t, POND, function () { sceneryMirrored(t, flier, 50, "bluebottle", {size: 1.3}); });
function sceneryWaterSurface(t, water, mirrored) {
  var x = water.left, wide = water.right - water.left, mist = water.mist;
  pen.save();
  sceneryWaterShape(water);
  pen.clip();
  water.mirror.forEach(function (band, n) {
    var to = n + 1 < water.mirror.length ? water.mirror[n + 1][0] : water.foot;
    pen.save();
    pen.beginPath();
    pen.rect(x - 20, band[0], wide + 40, to - band[0]);
    pen.clip();
    pen.globalAlpha = band[1];
    natReflect(t, water.line, {left: x - 20, right: x + wide + 20, foot: water.foot, ripple: 0.5, tint: water.tint, deep: 0.6, sheen: 36, line: 0});
    pen.restore();
  });
  if (mirrored) { mirrored(); }
  pen.fillStyle = "rgba(8, 20, 18, 0.18)";         // still water is darker than what it mirrors
  pen.fillRect(x - 20, water.line - 40, wide + 40, water.foot - water.line + 40);
  if (water.rings) { ripples(pen, water.rings, t); }
  if (mist) {
    softMist(t, water.line + 10, 30, 0.32, 9, mist);
    natSteam(t, x, x + wide, water.line + 40, {count: 26, rise: 60, wide: 150, life: 9, lean: 90, alpha: 0.22, flat: 0.22, patch: 0.85, colour: mist, seed: 3});
    natSteam(t, x, x + wide, water.line + 120, {count: 60, rise: 90, wide: 120, life: 8, lean: 120, alpha: 0.32, flat: 0.05, patch: 0.85, colour: mist, seed: 5});   // the strands
  }
  pen.restore();
  if (mist) { natSteam(t, x + 120, x + wide - 120, water.line + 4, {count: 10, rise: 70, wide: 120, life: 10, lean: 60, alpha: 0.09, flat: 0.3, patch: 0.7, colour: mist, seed: 11}); }
}

// A flier's reflection on still water (a butterfly, a bird low over it): upside down, as far below the water under
// it as it is above it ("high"), drawn with the water's face (sceneryWaterSurface()'s mirrored). at: where the flier is
// ({x, y, turn}, butterflyDrift()'s), in the water's own pixels; kind: a key of BUTTERFLIES; look: butterfly()'s
// (turn added to at.turn). Returns nothing: it draws with pen.
// e.g. sceneryMirrored(t, {x: 900, y: 830, turn: 0.3}, 50, "bluebottle", {size: 1.3, seed: 5, turn: -1.2});
function sceneryMirrored(t, at, high, kind, look) {
  look = look || {};
  pen.save();
  pen.globalAlpha = 0.55;
  pen.translate(at.x, at.y + 2 * high);
  pen.scale(1, -1);
  butterfly(kind, 0, 0, t, Object.assign({}, look, {turn: at.turn + (look.turn || 0)}));   // the flip turns it as the water does
  pen.restore();
}

// A clump of reeds at the water's edge, its blades swaying; part "back" the ones behind what stands in them, "front"
// the ones before it. x, base: its foot; size: 1 is about 160 tall; t: seconds. Returns nothing: it draws with pen.
// e.g. sceneryReeds(445, 1010, 0.9, t, "back"); sceneryReeds(445, 1010, 0.9, t, "front");
function sceneryReeds(x, base, size, t, part) {
  pen.save();
  pen.translate(x, base);
  pen.scale(size, size);
  pen.lineCap = "round";
  for (var n = 0; n < 14; n++) {
    var front = n % 2 === 1;
    if ((part === "front") !== front) { continue; }
    var at = (n - 7) * 11 + 6 * Math.sin(n * 2.1), tall = 130 + 70 * dice(n + 3), lean = 0.18 * Math.sin(n * 1.3) + 0.04 * Math.sin(t * 1.4 + n);
    pen.strokeStyle = front ? "#5f8a34" : "#3f6a24";
    pen.lineWidth = 4;
    pen.beginPath();
    pen.moveTo(at, 0);
    pen.quadraticCurveTo(at + lean * tall * 0.3, -tall * 0.6, at + lean * tall, -tall);
    pen.stroke();
    if (n % 4 === 0) {                              // a seed head here and there
      pen.fillStyle = "#8a6a3a";
      pen.beginPath(); pen.ellipse(at + lean * tall, -tall - 4, 3, 8, lean, 0, 7); pen.fill();
    }
  }
  pen.restore();
}

// The plants along the far bank: low bushes (natBush()), green grass and now and then one in flower, standing on the
// bank's line from x0 to x1; drawn before the water's face, so the water mirrors them. Returns [{sprite, x, y, size},
// ...] for sceneryBeds(); painted once (call it inside thkOnce()). seed: a number.
// e.g. var bank = thkOnce("pond-bank", function () { return sceneryBankPlants(POND, 470, 1200, 70); });
function sceneryBankPlants(water, x0, x1, seed) {
  var out = [], grass = [];
  for (var g = 0; g < 3; g++) { grass.push(sceneryGrassBank(120 + 40 * dice(g + 4), 31 + g * 5)); }
  for (var x = x0, n = 0; x < x1; n++) {
    var s = seed + n * 7;
    if (n % 3 === 1) {
      out.push({sprite: grass[n % 3], x: x, y: sceneryBankAt(water, x) + 2, size: 0.22 + 0.06 * dice(s)});
      x += 70 + 30 * dice(s + 1);
    } else {
      var wide = 110 + 70 * dice(s), high = 50 + 30 * dice(s + 2);
      var blooms = n % 4 === 0 ? [["jasmine", 10, 5]] : n % 5 === 0 ? [["phayasuea", 8, 5, "#ec6c9c"]] : [];
      out.push({sprite: natBush(wide, high, s, n % 2 ? THK_GREENS : THK_SHADE, blooms, PIX), x: x, y: sceneryBankAt(water, x) + 6, size: 1});
      x += wide * 0.7;
    }
  }
  return out;
}

// Small plants standing in the water's top edge, close along it from x0 to x1, over the line where it meets the far
// bank: tufts of grass and short reeds. Returns [[kind ("grass" or "reeds"), x, y, size, seed], ...] for
// sceneryWaterPlants(). seed: a number.
// e.g. var edge = sceneryEdgePlants(POND, 440, 1230, 200);
function sceneryEdgePlants(water, x0, x1, seed) {
  var edge = [];
  for (var x = x0, n = 0; x < x1; n++) {
    var s = seed + n * 3;
    edge.push([n % 3 === 2 ? "reeds" : "grass", x, sceneryBankAt(water, x) + 6 + 6 * dice(s), n % 3 === 2 ? 0.28 + 0.1 * dice(s + 1) : 0.1 + 0.05 * dice(s + 2), s]);
    x += 28 + 26 * dice(s + 3);
  }
  return edge;
}

// Draws plants of the water's edges at second t: [[kind ("grass" or "reeds"), x, y, size, seed], ...], as
// sceneryEdgePlants() gives them or a scene lists them (reeds and grass over the near sides of its water).
// Returns nothing: it draws with pen.
// e.g. sceneryWaterPlants(t, [["reeds", 470, 1062, 1.0, 1], ["grass", 410, 1040, 0.34, 2]]);
var SCENERY_GRASS = null;
function sceneryWaterPlants(t, list) {
  SCENERY_GRASS = SCENERY_GRASS || [0, 1, 2].map(function (k) { return sceneryGrassBank(110 + 40 * dice(k + 9), 41 + k * 5); });
  list.forEach(function (one) {
    if (one[0] === "reeds") { sceneryReeds(one[1], one[2], one[3], t + one[4], "back"); sceneryReeds(one[1], one[2], one[3], t + one[4], "front"); }
    else { thkPlace(SCENERY_GRASS[one[4] % 3], one[1], one[2], one[3], thkSway(t, one[1] * 0.01, 0.15)); }
  });
}

// A clump of lotus rising out of the water: its root "deep" below the water line at "line", so the stems come up
// through the water. part "under": the whole clump, to be drawn under the water's face, which lies over what is in the
// water; part "over": only what stands above the water line, crisp, with pads lying on the water round where it comes
// up and a ring round the stems. lotusClump()'s arguments otherwise. Returns nothing: it draws with pen.
// e.g. sceneryLotus("under", 520, 1010, 60, 0.9, 4, "#ee7f9c", t); ... sceneryLotus("over", 520, 1010, 60, 0.9, 4, "#ee7f9c", t);
function sceneryLotus(part, x, line, deep, size, seed, colour, t) {
  if (part === "under") { lotusClump(pen, x, line + deep, size, seed, colour, t); return; }
  pen.save();                                       // the pads, flat on the water, each a round with a notch
  for (var n = 0; n < 4; n++) {
    var px = x + (n - 1.5) * 34 * size + 10 * Math.sin(seed + n * 2.3), py = line + (dice(seed * 3 + n) - 0.4) * 14 * size, r = (20 + 8 * dice(seed + n)) * size;
    pen.save();
    pen.translate(px, py);
    pen.scale(1, 0.32);
    pen.rotate(dice(seed * 7 + n) * 6.28 + 0.05 * Math.sin(t * 0.8 + n));
    pen.beginPath();
    pen.moveTo(0, 0);
    pen.arc(0, 0, r, 0.25, 6.03);
    pen.closePath();
    pen.fillStyle = n % 2 ? "#5f8f4e" : "#4f7f44";
    pen.fill();
    pen.strokeStyle = "rgba(30, 60, 34, 0.7)";
    pen.lineWidth = 1.4;
    pen.stroke();
    pen.restore();
  }
  pen.restore();
  pen.save();
  pen.beginPath();
  pen.rect(x - 400, line - 600, 800, 600);           // above the water line only
  pen.clip();
  lotusClump(pen, x, line + deep, size, seed, colour, t);
  pen.restore();
  pen.save();                                       // a ring on the water where the stems come up
  pen.strokeStyle = "rgba(235, 245, 235, 0.45)";
  pen.lineWidth = 1.2;
  pen.beginPath();
  pen.ellipse(x, line + 2, (26 + 3 * Math.sin(t * 1.4 + seed)) * size, 5 * size, 0, 0, 7);
  pen.stroke();
  pen.restore();
}

// A fish that leaps once: at leap.at seconds it comes up out of the water at leap.from, nose up, arcs leap.high over
// the water in leap.air seconds and goes back in nose down at leap.to, and is gone; a ring spreads where it leaves the
// water and where it goes in, with a splash of drops. leap: {at, from: [x, y], to: [x, y], high, air, size, kind (a
// key of NATIVE_FISH, "barb" when left out)}. part: "air" (the leap, above the water line only) or "rings" (the rings
// and the splash), both over the water's face. t: seconds. Returns nothing: it draws with pen.
// e.g. sceneryLeap(t, "rings", LEAP); sceneryLeap(t, "air", LEAP);
function sceneryLeap(t, part, leap) {
  var L = leap, u = (t - L.at) / L.air;
  if (part === "air") {
    if (u < 0 || u > 1) { return; }
    var x = mix(L.from[0], L.to[0], u), y = L.from[1] - Math.sin(Math.PI * u) * L.high, tilt = -Math.cos(Math.PI * u) * 0.9;
    pen.save();
    pen.beginPath();
    pen.rect(x - 300, 0, 600, L.from[1]);           // only what is out of the water
    pen.clip();
    pen.translate(x, y);
    pen.rotate(tilt);
    nativeFish(pen, 0, 0, L.size, 1, L.kind || "barb", t * 3);
    pen.restore();
    return;
  }
  [[L.from, L.at - 0.05], [L.to, L.at + L.air]].forEach(function (ring) {
    var since = t - ring[1];
    if (since < 0 || since > 1.8) { return; }
    var v = since / 1.8;
    pen.save();
    pen.strokeStyle = "rgba(240, 248, 240, " + (0.8 * (1 - v) * (1 - v)).toFixed(3) + ")";
    pen.lineWidth = 1.6;
    for (var n = 0; n < 2; n++) {
      var r = (10 + 70 * v) * (1 - 0.35 * n);
      pen.beginPath();
      pen.ellipse(ring[0][0], ring[0][1] + 2, r, r * 0.3, 0, 0, 7);
      pen.stroke();
    }
    if (since < 0.45) {                             // the splash: drops thrown up and falling back
      pen.fillStyle = "rgba(245, 250, 245, " + (0.85 * (1 - since / 0.45)).toFixed(3) + ")";
      for (var d = 0; d < 9; d++) {
        var spread = (d - 4) * 7, up = 60 * since - 140 * since * since;
        pen.beginPath();
        pen.arc(ring[0][0] + spread * (1 + since * 3), ring[0][1] - Math.max(0, up * (0.6 + 0.4 * dice(d + 3))), 1.8, 0, 7);
        pen.fill();
      }
    }
    pen.restore();
  });
}

// --- a cave ---

// The mouth of a cave in a mountain's side, its foot's middle on (x, y), painted as the new places are (owner,
// 2026-10-26, of the Maeng film's cave: "Make new cave rocks, too"): a dark arched opening, darkest deep in, framed by
// jagged limestone with moss on it (wildplaces.js natRock()), a lintel of rock over the arch, a flat ledge of stone
// before it and small bushes on its top. The same size and opening as highlands.js caveMouth(), so a scene may take
// either: 250 wide and 135 high at size 1, the opening 120 by 92. look: t (seconds), rock (the stone's colour,
// "#7d786e"), dark (the inside's, "#0f0b0a", not tinted), tint ([colour, amount]: the stone blended that far toward one
// light, a dawn's blue or a dusk's red). The rocks are painted once for each stone colour. Returns nothing: it draws
// with brush and leaves it as it found it.
// e.g. sceneryCave(pen, 1300, 600, 0.62, {t: t, rock: "#6f6a62", tint: ["#28285a", 0.3]});
var SCENERY_CAVES = {};
function sceneryCave(brush, x, y, size, look) {
  look = look || {};
  var rock = look.rock || "#7d786e", dark = look.dark || "#0f0b0a", keep = pen;
  var cave = SCENERY_CAVES[rock] || (SCENERY_CAVES[rock] = sceneryCaveBuild(rock));
  pen = brush;
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  thkPlace(cave.face, 0, 0, 1, 0);                  // the rock face the cave is in
  sceneryCaveTint(cave, "face", look.tint);
  pen.beginPath();                                  // the opening: an arch, dark, darkest deep in
  pen.moveTo(-62, 6);
  pen.bezierCurveTo(-70, -54, -40, -96, 4, -96);
  pen.bezierCurveTo(48, -96, 66, -52, 60, 6);
  pen.closePath();
  var inside = pen.createRadialGradient(4, -26, 6, 0, -40, 92);
  inside.addColorStop(0, dark);
  inside.addColorStop(0.7, blend(dark, rock, 0.12));
  inside.addColorStop(1, blend(dark, rock, 0.35));
  pen.fillStyle = inside;
  pen.fill();
  thkPlace(cave.rocks, 0, 0, 1, 0);
  sceneryCaveTint(cave, "rocks", look.tint);
  pen.restore();
  pen = keep;
}

// The light of the hour over one of the cave's sprites ("face" or "rocks"), or any {part: sprite, tints: {}}: its
// tinted copy at the tint's strength, placed at x, y as the sprite was (0, 0 when left out: the cave draws under a
// translate). cave: sceneryCaveBuild()'s, or the like; tint: [colour, amount] or nothing. Returns nothing: it draws
// with pen. e.g. thkPlace(built.earth, 1400, 905, 1, 0); sceneryCaveTint(built, "earth", tint, 1400, 905);
function sceneryCaveTint(cave, part, tint, x, y) {
  if (!tint || tint[1] <= 0) { return; }
  var key = part + " " + tint[0];
  var tinted = cave.tints[key] || (cave.tints[key] = sceneryTinted(cave[part], tint[0]));
  pen.globalAlpha = Math.min(1, tint[1]);
  thkPlace(tinted, x || 0, y || 0, 1, 0);
  pen.globalAlpha = 1;
}

// The cave's rocks as one sprite, its point at the mouth's foot: the two jambs, the lintel over the arch, the ledge,
// small stones, and two small bushes on the top; and the face of rock behind the opening. rock: the stone's
// colour. Returns {face, rocks, tints: {}}.
function sceneryCaveBuild(rock) {
  var stone = {stone: rock, moss: 0.5, jag: 0.6};
  var parts = [rockSprite(118, 128, 31, stone, PIX), rockSprite(104, 120, 32, Object.assign({}, stone, {stone: blend(rock, "#2a2622", 0.25)}), PIX),
               rockSprite(170, 64, 33, Object.assign({}, stone, {jag: 0.8}), PIX), rockSprite(160, 24, 34, {stone: rock, moss: 0.2, jag: 0.05}, PIX),
               rockSprite(40, 30, 35, stone, PIX), rockSprite(46, 34, 36, stone, PIX)];
  var tufts = [natBush(90, 44, 37, THK_SHADE, [], PIX), natBush(80, 40, 38, THK_GREENS, [["phayasuea", 3, 4, "#ec6c9c"]], PIX)];
  var face = thkSprite(420, 300, 210, 240, function () {   // the face of rock the opening is cut into, behind it all
    thkPlace(rockSprite(270, 150, 39, {stone: blend(rock, "#2a2622", 0.18), moss: 0.35, jag: 0.45}, PIX), 0, 14, 1, 0);
  }, PIX);
  var rocks = thkSprite(420, 300, 210, 240, function () {
    thkPlace(tufts[0], -60, -150, 1, 0);            // bushes on the lintel's top, behind its crest
    thkPlace(tufts[1], 70, -146, 1, 0);
    thkPlace(parts[2], 4, -90, 1, 0);               // the lintel over the arch, its foot at the arch's top, so the arch's curve shows
    thkPlace(parts[0], -118, 10, 1, 0);             // the left jamb, lit, clear of the arch's side
    thkPlace(parts[1], 116, 10, 1, 0);              // the right jamb, in its own shade
    thkPlace(parts[3], 0, 16, 1, 0);                // the ledge before the mouth
    thkPlace(parts[4], -150, 14, 1, 0);
    thkPlace(parts[5], 150, 16, 1, 0);
  }, PIX);
  return {face: face, rocks: rocks, tints: {}};
}

// A copy of a sprite with one colour laid over what is painted on it (to be drawn over the sprite at some
// strength: the light of an hour). sprite: thkSprite()'s; colour: a CSS colour. Returns a sprite like it.
// e.g. var dusk = sceneryTinted(rocks, "#5a2a46");
function sceneryTinted(sprite, colour) {
  var copy = document.createElement("canvas");
  copy.width = sprite.canvas.width;
  copy.height = sprite.canvas.height;
  var brush = copy.getContext("2d");
  brush.drawImage(sprite.canvas, 0, 0);
  brush.globalCompositeOperation = "source-atop";
  brush.fillStyle = colour;
  brush.fillRect(0, 0, copy.width, copy.height);
  return {canvas: copy, wide: sprite.wide, high: sprite.high, ox: sprite.ox, oy: sprite.oy};
}

// --- the night sky ---

// A clear night's sky as the mountains of the north show it (owner, 2026-10-26: "some nice stars to the night", with
// a photograph of the Milky Way over Doi Inthanon's ridges for its look): thousands of fine stars, more of them along
// the Milky Way; the Milky Way itself, a dusty band of light with darker lanes in it; a warm glow low over the
// horizon; and a few bright stars, white and pale cyan, each with a soft glow, twinkling. Over a dark sky and under
// everything else. A sky may have no Milky Way (owner, 2026-10-26, of the Maeng film's night: "get rid of the milky
// way"): band null, the stars spread over the whole sky. t: seconds; look: {band: [x0, y0, x1, y1] (the Milky Way's
// line across the sheet) or null, horizon (the y
// the sky reaches), count (fine stars, 2600), bright (24), glow ("r, g, b" of the horizon's light, or null), seed,
// alpha (0 to 1, how much of the night shows)}. The fine stars and the band are painted once for each look
// (thkOnce()). Returns nothing: it draws with pen.
// e.g. sceneryStars(t, {band: [200, 0, 1500, 760], horizon: 760, glow: "240, 150, 70", alpha: 1});
function sceneryStars(t, look) {
  var milky = look.band !== null, band = look.band || [200, 0, 1600, 760], horizon = look.horizon || 760, seed = look.seed || 1, alpha = look.alpha === undefined ? 1 : look.alpha;
  if (alpha <= 0) { return; }
  var sky = thkOnce("stars " + (milky ? band.join(",") : "none") + " " + horizon + " " + (look.count || 2600) + " " + (look.glow || "") + " " + seed, function () {
    return sceneryStarSheet(milky ? band : null, horizon, look.count || 2600, look.glow, seed);
  });
  pen.save();
  pen.globalAlpha = alpha;
  pen.drawImage(sky, 0, 0, WIDE, 1080);
  var dx = band[2] - band[0], dy = band[3] - band[1];
  for (var n = 0; n < (look.bright === undefined ? 24 : look.bright); n++) {   // the bright stars, twinkling
    var along = dice(seed * 13 + n), off = (dice(seed * 17 + n) - 0.5) * (n % 3 ? 900 : 300);
    var x = band[0] + dx * along - dy / Math.hypot(dx, dy) * off, y = band[1] + dy * along + dx / Math.hypot(dx, dy) * off * 0.6;
    if (!milky) { x = WIDE * dice(seed * 13 + n); y = (horizon - 60) * dice(seed * 17 + n); }   // no band: anywhere in the sky
    if (y < 0 || y > horizon - 30 || x < 0 || x > WIDE) { continue; }
    var tw = 0.75 + 0.25 * Math.sin(t * (1.5 + 2 * dice(n + seed)) + n * 3.1), r = (2 + 3 * dice(n * 3 + seed)) * tw;
    var tint = n % 4 === 0 ? "255, 244, 226" : n % 4 === 1 ? "226, 240, 255" : "190, 248, 246";
    var halo = pen.createRadialGradient(x, y, 0, x, y, r * 5);
    halo.addColorStop(0, "rgba(" + tint + ", " + (0.9 * tw).toFixed(3) + ")");
    halo.addColorStop(0.25, "rgba(" + tint + ", " + (0.35 * tw).toFixed(3) + ")");
    halo.addColorStop(1, "rgba(" + tint + ", 0)");
    pen.fillStyle = halo;
    pen.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
    pen.fillStyle = "rgba(255, 255, 255, " + tw.toFixed(3) + ")";
    pen.beginPath();
    pen.arc(x, y, r * 0.45, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// sceneryStars()'s sheet, painted once: the Milky Way's dusty band and its dark lanes (band null: none, and the stars
// spread evenly), the fine stars, the horizon's glow. Returns a canvas WIDE by 1080 (at PIX), clear where nothing is.
function sceneryStarSheet(band, horizon, count, glow, seed) {
  var milky = !!band;
  band = band || [0, 0, WIDE, horizon];
  var paper = document.createElement("canvas");
  paper.width = Math.round(WIDE * PIX);
  paper.height = Math.round(1080 * PIX);
  var b = paper.getContext("2d"), n;
  b.scale(PIX, PIX);
  var dx = band[2] - band[0], dy = band[3] - band[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  function across() { var s = 0; for (var k = 0; k < 4; k++) { s += Math.random(); } return (s - 2) / 2; }   // a rough bell
  var keep = Math.random;                           // the sheet is the same each time: a seeded random for its stars
  var state = seed * 9301 + 49297;
  Math.random = function () { state = (state * 9301 + 49297) % 233280; return state / 233280; };
  for (n = 0; milky && n < 900; n++) {              // the band: soft clouds of light along its line
    var u = Math.random(), w = across() * 170, x = band[0] + dx * u + nx * w, y = band[1] + dy * u + ny * w, r = 40 + 90 * Math.random();
    var g = b.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(232, 222, 210, 0.06)");
    g.addColorStop(1, "rgba(232, 222, 210, 0)");
    b.fillStyle = g;
    b.fillRect(x - r, y - r, r * 2, r * 2);
  }
  b.globalCompositeOperation = "destination-out";   // its darker lanes, a little off its middle
  for (n = 0; milky && n < 260; n++) {
    var lu = Math.random(), lw = 30 + across() * 50, lx = band[0] + dx * lu + nx * lw, ly = band[1] + dy * lu + ny * lw, lr = 20 + 50 * Math.random();
    var lg = b.createRadialGradient(lx, ly, 0, lx, ly, lr);
    lg.addColorStop(0, "rgba(0, 0, 0, 0.12)");
    lg.addColorStop(1, "rgba(0, 0, 0, 0)");
    b.fillStyle = lg;
    b.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
  }
  b.globalCompositeOperation = "source-over";
  for (n = 0; n < count; n++) {                     // the fine stars, half of them gathered along the band
    var sx, sy;
    if (milky && n % 2) { var su = Math.random(), sw = across() * 260; sx = band[0] + dx * su + nx * sw; sy = band[1] + dy * su + ny * sw; }
    else { sx = Math.random() * WIDE; sy = Math.random() * horizon; }
    if (sy < 0 || sy > horizon) { continue; }
    var size = 0.5 + Math.pow(Math.random(), 3) * 1.4, a = 0.35 + 0.65 * Math.random() * (1 - 0.5 * sy / horizon);
    var hue = Math.random();
    b.fillStyle = "rgba(" + (hue < 0.15 ? "255, 236, 210" : hue < 0.35 ? "214, 232, 255" : "255, 255, 255") + ", " + a.toFixed(3) + ")";
    b.beginPath();
    b.arc(sx, sy, size, 0, 7);
    b.fill();
  }
  Math.random = keep;
  if (glow) {                                       // the warm glow low over the horizon
    var hg = b.createLinearGradient(0, horizon - 260, 0, horizon);
    hg.addColorStop(0, "rgba(" + glow + ", 0)");
    hg.addColorStop(1, "rgba(" + glow + ", 0.45)");
    b.fillStyle = hg;
    b.fillRect(0, horizon - 260, WIDE, 260);
  }
  return paper;
}

// --- the clouds ---

// Soft clouds drifting across a sky (owner, 2026-10-26: "Refine the clouds so they look more natural"): each a
// cluster of flattened puffs with no edge to them, as a cloud has none, piled higher in its middle, its shade laid
// first, then the half light and the lit tops a little above, in the light of the hour (SCENERY_CLOUD_LIGHT's day,
// dawn, dusk or night: [shade, half light, lit tops], or colours of a scene's own); painted once each, drifting on the
// wind and coming round again past the other side. t: seconds; look: {count (5), top, bottom (the band they float in:
// 80 and 380), wide ([smallest, largest]: [260, 520]), light ("day") or colours, alpha (0 to 1), seed}. Returns
// nothing: it draws with pen.
// e.g. sceneryClouds(t, {light: "night", count: 4, top: 100, bottom: 360});
var SCENERY_CLOUD_LIGHT = {day: ["#c9d3e0", "#eef2f6", "#ffffff"], dawn: ["#7a6a96", "#b49ab6", "#f4c9a8"],
                           dusk: ["#8a5a6a", "#d88a6a", "#ffd2a0"], night: ["#2a2f4e", "#454c72", "#8890b8"]};
function sceneryClouds(t, look) {
  look = look || {};
  var count = look.count === undefined ? 5 : look.count, top = look.top === undefined ? 80 : look.top, bottom = look.bottom || 380;
  var wide = look.wide || [260, 520], seed = look.seed || 1, alpha = look.alpha === undefined ? 1 : look.alpha;
  var colours = look.colours || SCENERY_CLOUD_LIGHT[look.light || "day"], span = WIDE + 1000;
  for (var n = 0; n < count; n++) {
    var k = seed * 31 + n * 7, size = Math.round(mix(wide[0], wide[1], dice(k + 1))), v = 3 + 4 * dice(k + 2);
    var sprite = thkOnce("cloud " + size + " " + k + " " + colours.join(","), function () { return sceneryCloud(size, k, colours); });
    var x = ((dice(k + 3) * span + t * v) % span + span) % span - 500, y = mix(top, bottom, dice(k + 4));
    pen.save();
    pen.globalAlpha = alpha * (0.75 + 0.25 * dice(k + 6));
    thkPlace(sprite, x, y, 1 + 0.015 * Math.sin(t * 0.25 + n), 0);
    pen.restore();
  }
}

// One soft cloud as a sprite, its foot's middle its point: puffs of shade, then of half light and of light above
// them, each a round of colour fading to nothing at its edge, the whole flattened. wide: film pixels; seed: a
// number; colours: [shade, half light, lit tops]. Returns thkSprite()'s.
function sceneryCloud(wide, seed, colours) {
  return thkSprite(wide * 1.5, wide * 0.8, wide * 0.75, wide * 0.62, function () {
    pen.scale(1, 0.62);
    var puffs = [], n;
    for (n = 0; n < 18; n++) {
      var u = dice(seed + n * 1.3) - 0.5, middle = Math.max(0, 1 - Math.abs(u) * 1.8);
      puffs.push([u * wide * 0.95, -wide * (0.05 + 0.2 * middle * dice(seed + n * 2.1)), wide * (0.07 + 0.11 * middle + 0.05 * dice(seed + n * 3.7))]);
    }
    function puff(x, y, r, colour, a) {
      var g = pen.createRadialGradient(x, y, 0, x, y, r);
      var rgb = [1, 3, 5].map(function (i) { return parseInt(colour.slice(i, i + 2), 16); }).join(", ");
      g.addColorStop(0, "rgba(" + rgb + ", " + a + ")");
      g.addColorStop(0.55, "rgba(" + rgb + ", " + (a * 0.7).toFixed(3) + ")");
      g.addColorStop(1, "rgba(" + rgb + ", 0)");
      pen.fillStyle = g;
      pen.fillRect(x - r, y - r, r * 2, r * 2);
    }
    puffs.forEach(function (p) { puff(p[0], p[1], p[2] * 1.25, colours[0], 0.75); });                       // the shade
    puffs.forEach(function (p) { puff(p[0] - p[2] * 0.08, p[1] - p[2] * 0.3, p[2] * 1.0, colours[1], 0.65); });  // the half light
    puffs.forEach(function (p) { puff(p[0] - p[2] * 0.15, p[1] - p[2] * 0.55, p[2] * 0.62, colours[2], 0.6); }); // the lit tops
  }, PIX);
}

// --- the moon ---

// The moon (owner, 2026-10-26, of the Maeng film's night: "Maybe re-add the moon"): a pale disc, its seas soft grey
// patches on it, in a wide glow of its light; drawn after the stars and before the clouds, so they drift over it.
// t: seconds; x, y: its middle; r: its radius; look: {alpha (0 to 1, 1), glow (how wide its light: 6 radii), colour
// ("r, g, b" of the light, a cool white), seed}. Returns nothing: it draws with pen.
// e.g. sceneryMoon(t, 1500, 200, 46, {alpha: 1});
function sceneryMoon(t, x, y, r, look) {
  look = look || {};
  var alpha = look.alpha === undefined ? 1 : look.alpha, light = look.colour || "222, 230, 255", seed = look.seed || 1, n;
  if (alpha <= 0) { return; }
  pen.save();
  pen.globalAlpha = alpha;
  var wide = r * (look.glow || 6), halo = pen.createRadialGradient(x, y, r * 0.8, x, y, wide);
  halo.addColorStop(0, "rgba(" + light + ", 0.32)");
  halo.addColorStop(0.3, "rgba(" + light + ", 0.1)");
  halo.addColorStop(1, "rgba(" + light + ", 0)");
  pen.fillStyle = halo;
  pen.fillRect(x - wide, y - wide, wide * 2, wide * 2);
  var disc = pen.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  disc.addColorStop(0, "#fbf8ee");
  disc.addColorStop(1, "#ded8c4");
  pen.fillStyle = disc;
  pen.beginPath();
  pen.arc(x, y, r, 0, 7);
  pen.fill();
  pen.save();
  pen.clip();
  for (n = 0; n < 7; n++) {                         // the seas: soft grey patches
    var mx = x + (dice(seed + n * 3) - 0.45) * r * 1.3, my = y + (dice(seed + n * 5) - 0.5) * r * 1.2, mr = r * (0.18 + 0.22 * dice(seed + n * 7));
    var sea = pen.createRadialGradient(mx, my, 0, mx, my, mr);
    sea.addColorStop(0, "rgba(150, 150, 160, 0.38)");
    sea.addColorStop(1, "rgba(150, 150, 160, 0)");
    pen.fillStyle = sea;
    pen.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
  }
  pen.restore();
  pen.restore();
}

// --- the sun ---

// The sun as the scenery paints it (owner, 2026-10-26, of the Maeng film's days going by: "go with your plans for 8"):
// a soft warm disc, white at its heart, in a wide glow of its light, drawn after the sky and before the clouds and
// the hills, so it sets behind them. (oldcartoon.js sun() is the thangka's sun of flames, or the 1930s sun's face.)
// t: seconds (unused, for the moon's company); x, y: its middle; r: its radius; look: {alpha (0 to 1, 1), glow (how
// wide its light: 8 radii), colour ("r, g, b" of the light, a warm white), disc ([heart, middle, rim] colours: white
// going to a pale gold; a low sun's warmer, as in a pale morning sky, where a white one is lost)}. Returns nothing: it
// draws with pen.
// e.g. scenerySun(t, 1500, 320, 24, {alpha: 1});
function scenerySun(t, x, y, r, look) {
  look = look || {};
  var alpha = look.alpha === undefined ? 1 : look.alpha, light = look.colour || "255, 240, 196";
  if (alpha <= 0) { return; }
  pen.save();
  pen.globalAlpha = alpha;
  var wide = r * (look.glow || 8), halo = pen.createRadialGradient(x, y, r * 0.6, x, y, wide);
  halo.addColorStop(0, "rgba(" + light + ", 0.55)");
  halo.addColorStop(0.25, "rgba(" + light + ", 0.18)");
  halo.addColorStop(1, "rgba(" + light + ", 0)");
  pen.fillStyle = halo;
  pen.fillRect(x - wide, y - wide, wide * 2, wide * 2);
  var disc = pen.createRadialGradient(x, y, 0, x, y, r), colours = look.disc || ["#fffef6", "#fff4cc", "rgba(255, 232, 170, 0.9)"];
  disc.addColorStop(0, colours[0]);
  disc.addColorStop(0.7, colours[1]);
  disc.addColorStop(1, colours[2]);
  pen.fillStyle = disc;
  pen.beginPath();
  pen.arc(x, y, r, 0, 7);
  pen.fill();
  pen.restore();
}

// --- a lamp's light ---

// The light of a lamp or a lantern at night (owner, 2026-10-26, of the Maeng film's night of the trough: "yes", to the
// lanterns lighting the ground and the men): a warm glow round the flame, flickering with it, and a pool of its light
// on the ground below, flattened as the ground lies; laid on with "lighter", so it brightens what is there.
// t: seconds; x, y: the flame; ground: the y of the ground under it; look: {reach (the glow's radius: 240), strength (0
// to 1: 1), colour ("r, g, b": a candle's orange), seed}. Returns nothing: it draws with pen.
// e.g. sceneryLampLight(t, 900, 520, 820, {reach: 260});
function sceneryLampLight(t, x, y, ground, look) {
  look = look || {};
  var reach = look.reach || 240, c = look.colour || "255, 170, 80", seed = look.seed || 0;
  var flicker = (look.strength === undefined ? 1 : look.strength) *
                (1 + 0.07 * Math.sin(t * 11.3 + seed) + 0.04 * Math.sin(t * 19.7 + seed * 2) + 0.03 * Math.sin(t * 31.1 + seed * 3));
  pen.save();
  pen.globalCompositeOperation = "lighter";
  var glow = pen.createRadialGradient(x, y, 4, x, y, reach);
  glow.addColorStop(0, "rgba(" + c + ", " + (0.5 * flicker).toFixed(3) + ")");
  glow.addColorStop(0.3, "rgba(" + c + ", " + (0.14 * flicker).toFixed(3) + ")");
  glow.addColorStop(1, "rgba(" + c + ", 0)");
  pen.fillStyle = glow;
  pen.fillRect(x - reach, y - reach, reach * 2, reach * 2);
  pen.translate(x, ground);                          // its pool on the ground
  pen.scale(1, 0.22);
  var pool = pen.createRadialGradient(0, 0, 0, 0, 0, reach * 0.9);
  pool.addColorStop(0, "rgba(" + c + ", " + (0.45 * flicker).toFixed(3) + ")");
  pool.addColorStop(1, "rgba(" + c + ", 0)");
  pen.fillStyle = pool;
  pen.fillRect(-reach, -reach, reach * 2, reach * 2);
  pen.restore();
}

// --- grain ---

// Fine grain over a strip of split bamboo (ฟาก, flattened, as a hut's wall or floor is), painted once on a sheet
// (owner, 2026-10-26, of the Maeng film's hut: "give it fine grained detail as well as the floor"): fibres along the
// strip, a little lighter and darker, a few long hairline splits, and the nodes, ridges lit on one side and shaded on
// the other. brush: a 2D context; x, y, w, h: the strip; look: {along: "y" (the fibres run up and down; "x" across),
// nodes: [where along the strip, pixels from its start], seed, light, dark ("r, g, b")}. Returns nothing: it draws
// with brush and leaves it as it found it.
// e.g. sceneryBambooGrain(b, 0, 0, 24, 700, {along: "y", nodes: [330], seed: 3});
function sceneryBambooGrain(brush, x, y, w, h, look) {
  look = look || {};
  var vertical = look.along !== "x", seed = look.seed || 1, light = look.light || "255, 240, 200", dark = look.dark || "90, 64, 30";
  var across = vertical ? w : h, along = vertical ? h : w, n, k;
  brush.save();
  brush.beginPath();
  brush.rect(x, y, w, h);
  brush.clip();
  brush.translate(x, y);
  if (!vertical) { brush.transform(0, 1, 1, 0, 0, 0); }   // draw it as if upright, and swap the axes back
  var fibres = Math.max(4, Math.round(across / 2.2));
  for (n = 0; n < fibres; n++) {                     // the fibres, each its own tone, wavering a little
    var fx = (n + dice(seed * 3 + n)) * across / fibres, tone = dice(seed * 7 + n);
    brush.strokeStyle = "rgba(" + (tone > 0.5 ? light : dark) + ", " + (0.1 + 0.25 * Math.abs(tone - 0.5) * 2).toFixed(3) + ")";
    brush.lineWidth = 0.7 + 0.9 * dice(seed * 11 + n);
    brush.beginPath();
    brush.moveTo(fx, 0);
    for (k = 1; k <= 6; k++) { brush.lineTo(fx + 0.7 * Math.sin(k * 1.7 + n + seed), along * k / 6); }
    brush.stroke();
  }
  for (n = 0; n < 3; n++) {                          // long hairline splits
    var sx = across * (0.2 + 0.6 * dice(seed * 13 + n)), s0 = along * dice(seed * 17 + n), s1 = s0 + along * (0.15 + 0.3 * dice(seed * 19 + n));
    brush.strokeStyle = "rgba(" + dark + ", 0.5)";
    brush.lineWidth = 0.9;
    brush.beginPath(); brush.moveTo(sx, s0); brush.lineTo(sx + 0.8, s1); brush.stroke();
  }
  (look.nodes || []).forEach(function (at) {         // the nodes: a ridge across, lit above, shaded below
    brush.fillStyle = "rgba(" + light + ", 0.3)";
    brush.fillRect(0, at - 3, across, 2);
    brush.fillStyle = "rgba(" + dark + ", 0.35)";
    brush.fillRect(0, at, across, 3);
  });
  brush.restore();
}

// Fine grain over a piece of timber (a post, a beam, a plank), painted once on a sheet: grain lines along it that
// wave, a knot or two with the grain bending round it, the edges a little darker. brush: a 2D context; x, y, w, h: the
// piece; look: {along: "y" (a post) or "x" (a beam), seed, dark ("r, g, b"), knots (how many: 1)}. Returns nothing: it
// draws with brush and leaves it as it found it.
// e.g. sceneryWoodGrain(b, 90, 0, 34, 710, {along: "y", seed: 2});
function sceneryWoodGrain(brush, x, y, w, h, look) {
  look = look || {};
  var vertical = look.along !== "x", seed = look.seed || 1, dark = look.dark || "40, 24, 12", n, k;
  var across = vertical ? w : h, along = vertical ? h : w;
  brush.save();
  brush.beginPath();
  brush.rect(x, y, w, h);
  brush.clip();
  brush.translate(x, y);
  if (!vertical) { brush.transform(0, 1, 1, 0, 0, 0); }
  var knots = [];
  for (n = 0; n < (look.knots === undefined ? 1 : look.knots); n++) {
    knots.push([across * (0.3 + 0.4 * dice(seed * 5 + n)), along * (0.15 + 0.7 * dice(seed * 9 + n)), 3 + across * 0.12]);
  }
  var lines = Math.max(5, Math.round(across / 3));
  for (n = 0; n < lines; n++) {                      // the grain, bending round the knots
    var gx = (n + 0.5) * across / lines;
    brush.strokeStyle = "rgba(" + dark + ", " + (0.12 + 0.16 * dice(seed * 3 + n)).toFixed(3) + ")";
    brush.lineWidth = 0.7 + 0.6 * dice(seed * 7 + n);
    brush.beginPath();
    for (k = 0; k <= 40; k++) {
      var gy = along * k / 40, bend = 1.4 * Math.sin(gy * 0.02 + n * 0.9 + seed);
      knots.forEach(function (kn) {
        var d = Math.hypot(gx - kn[0], gy - kn[1]);
        if (d < kn[2] * 3) { bend += (gx < kn[0] ? -1 : 1) * (kn[2] * 3 - d) * 0.35; }
      });
      if (k) { brush.lineTo(gx + bend, gy); } else { brush.moveTo(gx + bend, gy); }
    }
    brush.stroke();
  }
  knots.forEach(function (kn) {                      // the knots: a dark eye, rings round it
    brush.fillStyle = "rgba(" + dark + ", 0.55)";
    brush.beginPath(); brush.ellipse(kn[0], kn[1], kn[2] * 0.5, kn[2], 0, 0, 7); brush.fill();
    brush.strokeStyle = "rgba(" + dark + ", 0.3)";
    brush.lineWidth = 0.8;
    for (var r = 1; r <= 2; r++) { brush.beginPath(); brush.ellipse(kn[0], kn[1], kn[2] * (0.5 + 0.5 * r), kn[2] * (1 + 0.8 * r), 0, 0, 7); brush.stroke(); }
  });
  var edge = brush.createLinearGradient(0, 0, across, 0);   // the edges a little darker, as a round post's are
  edge.addColorStop(0, "rgba(" + dark + ", 0.25)");
  edge.addColorStop(0.25, "rgba(" + dark + ", 0)");
  edge.addColorStop(0.75, "rgba(" + dark + ", 0)");
  edge.addColorStop(1, "rgba(" + dark + ", 0.3)");
  brush.fillStyle = edge;
  brush.fillRect(0, 0, across, along);
  brush.restore();
}
