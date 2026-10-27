// thicket.js - plants painted as a painter of Ghibli's backgrounds paints them, in layers a camera moves through; made
// for "Through the flowers" (thicket/) and used by the hero film too (sash_maeng.html). What its scenes share: a
// camera that moves through layers of plants, each
// layer as far as its depth says (parallax), pushed in, swaying in the air and soft when it is far or very near;
// pictures painted once (sprites) of the bushes, flowers and grass the layers hold; the falling petals, the shafts of
// light and the pollen in them. Load it after the kit, flora.js, butterflies.js and northbirds.js.
//
// A scene builds its layers once, the first time it is drawn (thkOnce()), and then draws them with
// thkLayers(t, layers, cam) and its animals between them.

// The quality of a sprite: how many device pixels it keeps for one film pixel, over the sheet's own (PIX), so that a
// near layer pushed in to twice its size stays sharp enough.
var THK_SHARP = 1.6;

// A picture painted once: a canvas "wide" by "high" film pixels, (ox, oy) of it the point it is placed by (the foot
// of a plant, the middle of a bush's base). paint() draws with pen at film pixels, (0, 0) at that point.
// wide, high, ox, oy: film pixels; paint: a function; sharp: device pixels to a film pixel (PIX * THK_SHARP).
// Returns {canvas, wide, high, ox, oy}. It points pen at the canvas while it paints and puts pen, LINE and FINE back.
// e.g. var bush = thkSprite(400, 260, 200, 250, function () { thkBush(400, 240, 3, THK_GREENS, []); });
function thkSprite(wide, high, ox, oy, paint, sharp) {
  sharp = sharp || PIX * THK_SHARP;
  var canvas = document.createElement("canvas"), keep = pen, keepLine = LINE;
  canvas.width = Math.ceil(wide * sharp);
  canvas.height = Math.ceil(high * sharp);
  pen = canvas.getContext("2d");
  pen.setTransform(sharp, 0, 0, sharp, ox * sharp, oy * sharp);
  paint();
  pen = keep;
  LINE = keepLine;
  FINE = 1;
  return {canvas: canvas, wide: wide, high: high, ox: ox, oy: oy};
}

// Places a sprite: its point at (x, y), scaled by "size", turned by "sway" radians about that point.
// sprite: thkSprite()'s; x, y: pixels of the layer; size: a number; sway: radians. Returns nothing: it draws with pen.
// e.g. thkPlace(bush, 600, 900, 1.2, 0.01);
function thkPlace(sprite, x, y, size, sway) {
  pen.save();
  pen.translate(x, y);
  if (sway) { pen.rotate(sway); }
  pen.scale(size, size);
  pen.drawImage(sprite.canvas, -sprite.ox, -sprite.oy, sprite.wide, sprite.high);
  pen.restore();
}

// The air that sways a plant at second t: a slow swell and a quicker flutter, each plant at its own phase, the
// taller it is (reach, 0 to 1) the further. Returns radians. e.g. thkSway(clock, 3.1, 0.8)
function thkSway(t, phase, reach) {
  return (Math.sin(t * 0.9 + phase) * 0.6 + Math.sin(t * 2.3 + phase * 1.7) * 0.25) * 0.035 * reach;
}

// Draws the layers of a scene at second t, far to near. Each layer: {depth, blur, haze, items, live}:
//   depth  how fast it passes as the camera moves (0 the sky, 1 the plane the camera looks at, more is nearer)
//   blur   pixels of softness (a far layer, or a near one the eye does not hold), 0 when left out
//   haze   0 to 1, how much of the air's colour lies over it (far layers fade into the light)
//   items  [{sprite, x, y, size, phase, reach}], placed by thkPlace(), swaying by thkSway() (reach 0 holds still)
//   live   a function (t) drawn after the items in the layer's own frame: an animal, a flower that moves
// cam: {x, z, y}: how far the camera has gone along (pixels at depth 1), pushed in (0 none, 0.5 halfway to the
// plane at depth 2) and risen (pixels at depth 1). air: the haze's colour. Returns nothing: it draws with pen.
// e.g. thkLayers(t, LAYERS, {x: 40 * t, z: 0.03 * t, y: 0}, "#e8f0d0");
function thkLayers(t, layers, cam, air) {
  layers.forEach(function (layer) {
    var p = layer.depth, grow = 1 / Math.max(0.12, 1 - (cam.z || 0) * p);
    pen.save();
    pen.translate(WIDE / 2, 560);
    pen.scale(grow, grow);
    pen.translate(-WIDE / 2 - cam.x * p, -560 - (cam.y || 0) * p);
    var soft = (layer.blur || 0) * Math.max(1, grow * 0.8);
    if (soft > 0.3) { pen.filter = "blur(" + soft.toFixed(1) + "px)"; }
    (layer.items || []).forEach(function (it) {
      thkPlace(it.sprite, it.x, it.y, it.size || 1, it.reach === 0 ? 0 : thkSway(t, it.phase || it.x * 0.01, it.reach || 0.5));
    });
    if (layer.live) { layer.live(t); }
    pen.filter = "none";
    pen.restore();
    if (layer.haze) {
      pen.save();
      pen.globalAlpha = layer.haze;
      pen.fillStyle = air || "#eef2d8";
      pen.fillRect(0, 0, WIDE, 1080);
      pen.restore();
    }
  });
}

// --- the bushes ---

// The greens of a bush, deep in its shade to light where the sun is on it; and others for a bush in deep shade
// and one in bright sun.
var THK_GREENS = ["#163a24", "#22502e", "#2f6a38", "#3f7f3e", "#5a9a48", "#86b85a", "#b4d47a"];
var THK_SHADE = ["#0e2a1c", "#173a26", "#21502f", "#2c6236", "#3c7840", "#5a944c", "#7cae5c"];
var THK_SUN = ["#2a5a2a", "#3a7034", "#4f8a3e", "#68a24a", "#86b85a", "#a8cc6a", "#d2e48a"];

// One small leaf of a bush, its foot at (x, y), "long" long, turned "turn" from up, filled with "colour", a fine
// darker line round it. Returns nothing: it draws with pen.
// e.g. thkLeaf(10, -40, 16, 0.4, "#5a9a48");
function thkLeaf(x, y, long, turn, colour) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  leafPath(pen, long, long * 0.38, 0.12);
  pen.fillStyle = colour;
  pen.fill();
  pen.strokeStyle = "rgba(14, 36, 22, 0.45)";
  pen.lineWidth = 0.7;
  pen.stroke();
  pen.restore();
}

// The single blooms a bush can carry: each a function (x, y, r, turn, colour, seed) that draws one flower of radius
// about r with pen, by flora.js's own painters. A name here is a key of FLORA. The marigold and the jasmine are drawn
// with a finer pen than the bush's: a marigold's forty petals each inked at the bush's line, at the size of a bloom on
// a bush, came out brown, and jasmine's small stars grey (2026-10-27, the Maeng film's beauty pass).
function thkFine(share, paint) { var keep = LINE; LINE = keep * share; paint(); LINE = keep; }
var THK_BLOOMS = {
  hibiscus: function (x, y, r, turn, colour) { floraHibiscusBloom(x, y, r, colour || "#d93a2e", turn); },
  frangipani: function (x, y, r, turn, colour) { floraFrangipaniBloom(x, y, r, colour || FLORA_WHITE, turn); },
  jasmine: function (x, y, r, turn) { thkFine(0.45, function () { floraJasmineBloom(x, y, r, turn); }); },
  orchid: function (x, y, r, turn, colour) { floraOrchidBloom(x, y, r, colour || "#b64fb3", turn); },
  marigold: function (x, y, r, turn, colour) { thkFine(0.2, function () { floraPompom(x, y, r, colour || "#f08a1e", blend(colour || "#f08a1e", "#ffe27a", 0.45)); }); },
  bougainvillea: function (x, y, r, turn, colour, seed) { thkScaled(x, y, r / 18, function () { floraBractCluster(0, 0, colour || "#d8338a", seed); }); },
  thongkwao: function (x, y, r, turn, colour, seed) { thkScaled(x, y, r / 16, function () { floraFlameCluster(0, 0, colour || "#f0581e", seed); }); },
  sarapee: function (x, y, r, turn) { floraSarapeeBloom(x, y, r, turn); },
  dokkaew: function (x, y, r, turn) { floraDokkaewBloom(x, y, r, turn); },
  phayasuea: function (x, y, r, turn, colour) { floraSueaBloom(x, y, r, turn, colour || "#ec6c9c"); },
  kettawa: function (x, y, r, turn) { floraKettawaBloom(x, y, r, turn); },
  miang: function (x, y, r, turn) { floraMiangBloom(x, y, r, turn); },
  ueang: function (x, y, r, turn) { floraUeangBloom(x, y, r, turn); },
  buatong: function (x, y, r, turn) { floraBuatongHead(x, y, r, 1, turn); },
  tahern: function (x, y, r, turn) { floraTahernBloom(x, y, r, turn); },
  hom: function (x, y, r, turn) { floraHomBloom(x, y, r * 2, turn); },
  // a tree's flowers and fruit that hang: the golden shower's racemes, a bunch of longan, a mango on its stalk
  ratchaphruek: function (x, y, r, turn, colour, seed) { thkScaled(x, y, r / 30, function () { floraRaceme(0, 0, 80, seed); }); },
  longan: function (x, y, r, turn, colour, seed) { thkScaled(x, y, r / 40, function () { FLORA.longan.hang(seed); }); },
  mango: function (x, y, r, turn, colour, seed) { thkScaled(x, y, r / 40, function () { FLORA.mango.hang(seed); }); },
  // not a flower: a few leaves turned yellow or russet, as the deciduous forest of the north turns in the cool, dry
  // months before it drops them (2026-10-27, the Maeng film's beauty pass); colour the turn ("#d4a83e" when left out)
  turning: function (x, y, r, turn, colour, seed) {
    for (var n = 0; n < 5; n++) {
      thkLeaf(x + (dice(seed * 3 + n) - 0.5) * r * 1.6, y + (dice(seed * 5 + n) - 0.5) * r, r * (0.9 + 0.5 * dice(seed + n)),
              turn + (n - 2) * 0.5, blend(colour || "#d4a83e", "#7a5a24", 0.25 * dice(seed * 7 + n)));
    }
  }
};

// Draws paint() with the pen moved to (x, y) and scaled by "size". Returns nothing.
// e.g. thkScaled(10, 20, 0.5, function () { floraBractCluster(0, 0, "#d8338a", 1); });
function thkScaled(x, y, size, paint) {
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  paint();
  pen.restore();
}

// A bush, its base's middle at (0, 0): a lumpy mound "wide" across and "high", made of clumps (rounds of shade) and,
// over them, hundreds of small leaves, each clump lit on its upper left and dark below as the whole bush is, with a
// fringe of leaves standing out from its edge; and in it "blooms": [[name, count, r, colour], ...], flowers of
// THK_BLOOMS in clusters over its sunny face. It stays inside wide by high (paint it in a sprite with room round it).
// wide, high: film pixels; seed: a number; greens: seven colours, deep to light (THK_GREENS); blooms: as said.
// Returns nothing: it draws with pen. Paint it into a sprite (thkSprite()) once.
// e.g. thkBush(400, 240, 3, THK_GREENS, [["jasmine", 30, 6], ["hibiscus", 4, 16]]);
function thkBush(wide, high, seed, greens, blooms) {
  var n, k, x, y, c, rounds = [], count = Math.round(wide * high / 60);
  var keepLine = LINE;
  LINE = STYLE.line * 0.55;
  var size = Math.min(wide, high);
  for (n = 0; n < 18; n++) {                        // the clumps: a dome, lumpy, its top uneven
    var u = n / 17 - 0.5 + (dice(seed + n * 5) - 0.5) * 0.06, r = size * (0.16 + 0.12 * dice(seed + n * 3));
    var top = high * (0.62 + 0.38 * Math.cos(Math.PI * u * 0.95)) * (0.85 + 0.15 * dice(seed + n * 7));
    x = u * (wide - 2 * r);
    y = -Math.min(top - r, high - r) * (0.55 + 0.45 * dice(seed + n * 11));
    rounds.push([x, Math.max(-(high - r - 6), Math.min(-r * 0.5, y)), r]);
  }
  for (n = 0; n < 7; n++) {                         // and the crown of the dome, so its top is full
    var w2 = (n / 6 - 0.5) * wide * 0.75, r2 = size * (0.2 + 0.08 * dice(seed + n * 13));
    var h2 = high * (0.7 + 0.3 * Math.cos(Math.PI * w2 / wide)) * (0.88 + 0.12 * dice(seed + n * 17));
    w2 = Math.max(-(wide / 2 - r2 - 6), Math.min(wide / 2 - r2 - 6, w2));   // inside the bush's width
    rounds.push([w2, -(h2 - r2), r2]);
  }
  function nearest(px, py) {
    var best = null, d = 1e9;
    for (var m = 0; m < rounds.length; m++) {
      var dx = px - rounds[m][0], dy = py - rounds[m][1], q = (dx * dx + dy * dy) / (rounds[m][2] * rounds[m][2]);
      if (q < d) { d = q; best = rounds[m]; }
    }
    return d < 1 ? best : null;
  }
  pen.fillStyle = greens[0];
  pen.beginPath();
  rounds.forEach(function (c) { pen.moveTo(c[0] + c[2], c[1]); pen.arc(c[0], c[1], c[2], 0, 7); });
  pen.fill();
  var leaves = [];
  for (n = 0, k = 0; n < count && k < count * 5; k++) {
    x = (dice(seed * 7 + k * 1.3) - 0.5) * wide;
    y = -dice(seed * 11 + k * 2.1) * high * 1.2 + high * 0.2;   // a little below the base too: a crown in the air shows it
    c = nearest(x, y);
    if (!c) { continue; }
    leaves.push([x, y, k, c]);
    n++;
  }
  rounds.forEach(function (c, m) {                  // the fringe: leaves standing out round each clump's upper edge
    for (var f = 0; f < 10; f++) {
      var a = -Math.PI * (0.05 + 0.9 * dice(seed + m * 31 + f)), ex = c[0] + Math.cos(a) * c[2] * 0.92, ey = c[1] + Math.sin(a) * c[2] * 0.92;
      if (ey > -2 || Math.abs(ex) > wide / 2 - 12 || ey < -high + 12) { continue; }
      leaves.push([ex, ey, m * 97 + f, c, a + Math.PI / 2]);
    }
  });
  leaves.sort(function (p, q) { return p[1] - q[1]; });   // from the top down: the lower leaves lie in front
  leaves.forEach(function (l) {
    var c = l[3], up = -l[1] / high, side = -l[0] / wide;
    var local = clamp(0.5 - (l[1] - c[1]) / c[2] * 0.6 - (l[0] - c[0]) / c[2] * 0.3);   // the clump's own light
    var lit = clamp(0.1 + up * 0.35 + side * 0.25 + local * 0.55 + (dice(seed + l[2] * 0.7) - 0.5) * 0.3);
    var turn = l[4] !== undefined ? l[4] + (dice(seed + l[2]) - 0.5) * 0.6 : Math.atan2(l[0] - c[0], -(l[1] - c[1])) + (dice(seed + l[2] * 1.9) - 0.5) * 1.4;
    thkLeaf(l[0], l[1], 10 + dice(seed + l[2] * 2.7) * 9, turn, greens[Math.min(6, Math.floor(lit * 6.99))]);
  });
  (blooms || []).forEach(function (b, bn) {          // the flowers come in clusters, on the sunny upper faces
    var made = 0;
    for (var tries = 0; made < b[1] && tries < b[1] * 10; tries++) {
      var cx = (dice(seed * 13 + bn * 101 + tries * 1.7) - 0.5) * wide * 0.9, cy = -dice(seed * 17 + bn * 103 + tries * 2.3) * high;
      var home = nearest(cx, cy);
      if (!home || cy - home[1] > home[2] * 0.4) { continue; }
      var many = Math.min(b[1] - made, 3 + Math.floor(dice(seed + tries * 5) * 5));
      for (var m = 0; m < many; m++) {
        var a = dice(seed + tries * 7 + m) * 6.3, d = b[2] * (0.6 + 1.6 * dice(seed + tries * 9 + m));
        x = cx + Math.cos(a) * d;
        y = cy + Math.sin(a) * d * 0.8;
        if (!nearest(x, y)) { continue; }
        THK_BLOOMS[b[0]](x, y, b[2] * (0.8 + 0.4 * dice(seed + tries + m)), dice(seed + tries * 3 + m) * 6.3, b[3], seed + tries + m);
        made++;
      }
    }
  });
  LINE = keepLine;
}

// A tree's trunk, its foot at (0, 0) and "high" tall, "wide" across: bark lit on its left and dark on its right,
// furrowed, mossy, its roots flaring at the foot. seed: a number. Returns nothing: it draws with pen.
// e.g. thkTrunk(1200, 120, 3);
function thkTrunk(high, wide, seed) {
  pen.beginPath();
  pen.moveTo(-wide * 0.9, 0);
  pen.quadraticCurveTo(-wide * 0.5, -wide * 0.3, -wide * 0.5, -wide * 0.9);
  pen.lineTo(-wide * 0.42, -high);
  pen.lineTo(wide * 0.42, -high);
  pen.lineTo(wide * 0.5, -wide * 0.9);
  pen.quadraticCurveTo(wide * 0.5, -wide * 0.3, wide * 0.95, 0);
  pen.closePath();
  var bark = pen.createLinearGradient(-wide * 0.5, 0, wide * 0.5, 0);
  bark.addColorStop(0, "#6e6250");
  bark.addColorStop(0.3, "#8e8068");
  bark.addColorStop(1, "#3a3226");
  pen.fillStyle = bark;
  pen.fill();
  pen.strokeStyle = "rgba(30, 24, 16, 0.8)";
  pen.lineWidth = 2;
  pen.stroke();
  pen.save();
  pen.clip();
  pen.strokeStyle = "rgba(30, 24, 16, 0.35)";       // the furrows of the bark
  pen.lineWidth = 2.2;
  pen.beginPath();
  for (var n = 0; n < 9; n++) {
    var x = (n / 8 - 0.5) * wide * 0.8;
    pen.moveTo(x, 0);
    for (var y = 0; y > -high; y -= 60) { pen.lineTo(x + 6 * Math.sin(y * 0.02 + n + seed), y - 60); }
  }
  pen.stroke();
  for (n = 0; n < 7; n++) {                         // moss in soft patches, on the shaded side, low down
    var mx = wide * (0.05 + 0.35 * dice(seed + n)), my = -dice(seed + n * 3) * high * 0.45, mr = 30 + 40 * dice(n + seed);
    var moss = pen.createRadialGradient(mx, my, 2, mx, my, mr);
    moss.addColorStop(0, "rgba(120, 156, 72, 0.45)");
    moss.addColorStop(1, "rgba(120, 156, 72, 0)");
    pen.fillStyle = moss;
    pen.beginPath();
    pen.ellipse(mx, my, mr * 0.6, mr * 1.4, 0, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// A tree painted as the bushes are, its foot at (0, 0): a trunk "high" tall and "wide" across, and on it a crown, a
// bush "crown" across and "deep" high whose middle stands at the trunk's top, with "blooms" in it (as thkBush()
// takes them: flowers, or the racemes and fruit that hang). seed: a number; greens: as thkBush() takes them.
// Returns nothing: it draws with pen. e.g. thkTree(420, 50, 640, 380, 3, THK_GREENS, [["longan", 30, 14]]);
function thkTree(high, wide, crown, deep, seed, greens, blooms) {
  thkTrunk(high, wide, seed);
  pen.save();
  pen.translate(0, -high + deep * 0.55);
  thkBush(crown, deep, seed + 1, greens, blooms);
  pen.restore();
}

// A painted tree on a set's sheet ("brush"), as the kit's tree() and floraTree() are painted: its foot at (x, base),
// "size" its scale (1 is a trunk 420 tall and a crown 640 across). Returns nothing: it points pen at the brush while
// it paints and puts pen back. e.g. thkTreeOn(brush, 200, 900, 1, 7, [["longan", 30, 14]]);
function thkTreeOn(brush, x, base, size, seed, blooms, greens) {
  var keep = pen, keepLine = LINE;
  pen = brush;
  pen.save();
  pen.translate(x, base);
  pen.scale(size, size);
  thkTree(420, 54, 640, 380, seed, greens || THK_GREENS, blooms);
  pen.restore();
  pen = keep;
  LINE = keepLine;
  FINE = 1;
}

// A clump of tall grass, its foot at (0, 0): "count" long blades rising and bending over, "high" tall, in the
// greens, the outer ones leaning further. Returns nothing: it draws with pen.
// e.g. thkGrass(420, 14, 2, THK_GREENS);
function thkGrass(high, count, seed, greens) {
  for (var n = 0; n < count; n++) {
    var lean = (n / (count - 1) - 0.5) * 1.1 + (dice(seed + n) - 0.5) * 0.4, tall = high * (0.6 + 0.4 * dice(seed + n * 3));
    floraRibbon((dice(seed + n * 5) - 0.5) * 30, 0, tall, 5 + dice(seed + n * 7) * 4, lean, 0.15 + Math.abs(lean) * 0.35,
                greens[1 + Math.floor(dice(seed + n * 9) * 3)], greens[4 + Math.floor(dice(seed + n * 11) * 3)]);
  }
}

// --- the air ---

// Shafts of sunlight slanting down from the upper left, faint and moving a little, and specks of pollen drifting in
// them. t: seconds; strength: 0 to 1; seed: a number. Returns nothing: it draws with pen over the whole sheet.
// e.g. thkLight(clock, 0.6, 2);
function thkLight(t, strength, seed) {
  pen.save();
  pen.globalCompositeOperation = "screen";
  for (var n = 0; n < 5; n++) {
    var x = 200 + n * 380 + 60 * Math.sin(t * 0.2 + n), w = 70 + 60 * dice(seed + n), a = strength * (0.10 + 0.08 * Math.sin(t * 0.5 + n * 2));
    var ray = pen.createLinearGradient(x, 0, x - 500, 1080);
    ray.addColorStop(0, "rgba(255, 246, 200, " + a.toFixed(3) + ")");
    ray.addColorStop(1, "rgba(255, 246, 200, 0)");
    pen.fillStyle = ray;
    pen.beginPath();
    pen.moveTo(x, -10);
    pen.lineTo(x + w, -10);
    pen.lineTo(x + w - 560, 1090);
    pen.lineTo(x - 560 - w * 0.6, 1090);
    pen.closePath();
    pen.fill();
  }
  pen.fillStyle = "rgba(255, 250, 220, " + (0.55 * strength).toFixed(3) + ")";
  for (n = 0; n < 60; n++) {                        // pollen in the light, drifting and rising
    var px = (dice(seed * 3 + n) * WIDE + t * (8 + 10 * dice(n)) + 30 * Math.sin(t * 0.7 + n)) % WIDE;
    var py = ((dice(seed * 5 + n) * 1080 - t * (6 + 8 * dice(n + 9))) % 1080 + 1080) % 1080;
    pen.beginPath();
    pen.arc(px, py, 1 + dice(n * 7) * 1.6, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// Petals falling, turning as they fall and drifting with the air: "count" of them in the colour, each coming round
// again from the top. t: seconds; count: a whole number; colour: "#rrggbb"; seed: a number; size: 1 about 12 long.
// Returns nothing: it draws with pen. e.g. thkPetals(clock, 40, "#f6b8cc", 3, 1);
function thkPetals(t, count, colour, seed, size) {
  for (var n = 0; n < count; n++) {
    var fall = 40 + 40 * dice(seed + n), drift = 30 + 30 * dice(seed + n * 2);
    var y = ((dice(seed * 7 + n) * 1300 + t * fall) % 1300) - 110;
    var x = ((dice(seed * 9 + n) * (WIDE + 300) + t * drift + 40 * Math.sin(t * 1.1 + n)) % (WIDE + 300)) - 150;
    pen.save();
    pen.translate(x, y);
    pen.rotate(t * (1 + dice(n)) + n);
    pen.scale((size || 1) * (0.7 + 0.5 * dice(n * 3)) * Math.max(0.25, Math.abs(Math.cos(t * 2 + n))), size || 1);
    pen.beginPath();
    pen.ellipse(0, 0, 6, 4, 0, 0, 7);
    pen.fillStyle = blend(colour, "#ffffff", 0.25 * dice(n * 5));
    pen.fill();
    pen.strokeStyle = blend(colour, "#7a2040", 0.5);
    pen.lineWidth = 0.6;
    pen.stroke();
    pen.restore();
  }
}

// A soft darkening at the sheet's edges, warm, as an old lens and a painter both give a scene. Returns nothing.
// e.g. thkVignette(0.35);
function thkVignette(strength) {
  var shade = pen.createRadialGradient(WIDE / 2, 540, 420, WIDE / 2, 540, 1150);
  shade.addColorStop(0, "rgba(40, 30, 10, 0)");
  shade.addColorStop(1, "rgba(30, 24, 10, " + strength + ")");
  pen.fillStyle = shade;
  pen.fillRect(0, 0, WIDE, 1080);
}

// Calls build() the first time and gives back what it built ever after: a scene's layers are painted once.
// key: a name; build: a function returning the layers. Returns what build() returned.
// e.g. var LAYERS = thkOnce("pink", buildPink);
var THK_BUILT = {};
function thkOnce(key, build) {
  if (!THK_BUILT[key]) { THK_BUILT[key] = build(); }
  return THK_BUILT[key];
}
