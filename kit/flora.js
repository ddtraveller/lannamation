// flora.js - the flowers and fruits of Thailand, drawn small, for films made
// with oldcartoon.js. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="flora.js"></script>
//
// and call flora(name, x, y, look) from a scene. (x, y) is the foot of a
// flower's stem, or the ground a fruit lies on. The names are the keys of
// FLORA below; each has its Thai name beside it, and how that is said.
//
//     flora("mango", 700, 900, {size: 1.5});
//     flora("orchid", 300, 1000, {colour: "#e86fb0"});
//
// A tree in flower or in fruit is painted on a set's sheet, as the kit's
// tree() is, with the named flower or fruit hanging in its boughs:
//
//     floraTree(brush, 240, 900, 1.0, "mango", 1);
//
// They are drawn in the kit's manner: flat colour inside a fine dark line.
// What each is, in rules, is the comment above its painter. The flowers are
// the ones of a northern garden and a temple's offering tray: ratchaphruek,
// the golden shower that is the national flower; thong kwao, the flame of
// the forest that is Chiang Mai's own; frangipani; an orchid; hibiscus;
// bougainvillea; jasmine; and marigold. The fruits are the ones of the
// market and the orchard: mango, durian, mangosteen, rambutan, the longan
// of Lamphun and Chiang Mai, lychee, papaya, a young coconut, pineapple,
// jackfruit, dragon fruit and pomelo; and the bael (matum), the measure of
// the Khom's tribute of gold in the tale of Chang Ngu. The flowers and
// plants of Lanna are the ones its people wear, offer and use: the golden
// orchid (ueang phueng), sarapee, saban nga, ta hern and ket tha wa of a
// woman's hair knot and the offering tray; dok kaew, whose leaves go under a
// new house's posts; the wild cherry (nang phaya suea khrong) of the high
// hills; bua tong; teak in flower; som poi, whose water washes ill luck away;
// the sugarcane of the forest gate; the bodhi (pho), green or the golden one
// of the tale of Tao Noi Ong Kham; miang, the tea the north chews; makhwaen,
// its pepper; hom, the indigo of Phrae; and phlu and mak, betel and areca.
//
// The names a look may have (flora() warns about any other):
//   size       how large it is drawn: 1 is as large as it is beside the cast
//              at their own sizes (a mango is about 68 long, a durian 130)
//   colour     the flower's colour, for the ones that come in more than one:
//              thongkwao, frangipani, orchid, hibiscus, bougainvillea, marigold,
//              sabannga, phayasuea; a sugarcane's stalks ("#7a3048" is red
//              cane); a pho's leaves ("#e3b341" is the golden bodhi)
//   ground     false: it does not stand on the ground, so no shadow under it
//              (an orchid on a tree's trunk), as person() reads the same name
var FLORA_KEYS = {size: true, colour: true, ground: true};

var FLORA_TWIG = "#6b4a2e", FLORA_STEM = "#6f9a52", FLORA_LEAF = "#3f7c4c", FLORA_PALE = "#8fc46a";
var FLORA_LINE = "rgba(28, 58, 36, 0.85)", FLORA_WHITE = "#fbf7ea";

// The kit's shape(), with a gradient as the paint and the ink taken from "colour".
// colour: "#rrggbb" (the ink is the kit's inkFor() of it); paint: a gradient or colour to fill with
// (colour when left out). Returns nothing: it fills and inks the path pen holds, and leaves pen's
// fill and line as it set them.
// e.g. pen.beginPath(); pen.ellipse(0, -40, 34, 40, 0, 0, 7); floraPaint("#d8306e");
function floraPaint(colour, paint) {
  var ink = inkFor(colour);
  pen.fillStyle = paint || colour;
  pen.fill();
  pen.strokeStyle = ink;
  pen.lineWidth = LINE;
  pen.lineJoin = "round";
  heavy(ink);
  pen.stroke();
  light();
}

// A leaf growing from (x, y), "long" and "wide", turned by "turn" from straight up.
// x, y, long, wide: pixels of the pen's frame; turn: radians, 0 straight up; deep, pale: the leaf's two greens
// (FLORA_LEAF and FLORA_PALE when left out). Returns nothing: it draws with pen (the kit's paintLeaf()).
// e.g. floraLeaf(-40, -14, 40, 14, -1.1);
function floraLeaf(x, y, long, wide, turn, deep, pale) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  paintLeaf(pen, long, wide, 0.12, deep || FLORA_LEAF, pale || FLORA_PALE, FLORA_LINE);
  pen.restore();
}

// A round fruit or bud of radius r, with a light on its upper left unless told not.
// x, y, r: pixels of the pen's frame; colour: "#rrggbb"; shine: false for no light. Returns nothing: it draws with pen.
// e.g. floraBall(-24, -46, 46, "#c9d66a");
function floraBall(x, y, r, colour, shine) {
  pen.beginPath();
  pen.arc(x, y, r, 0, 7);
  shape(colour);
  if (shine !== false) {
    pen.fillStyle = "rgba(255, 250, 235, 0.45)";
    pen.beginPath();
    pen.ellipse(x - r * 0.35, y - r * 0.4, r * 0.3, r * 0.18, -0.6, 0, 7);
    pen.fill();
  }
}

// "count" petals round (x, y), each an ellipse "long" out from the heart and
// "wide" across; pale toward "rim" if a rim colour is given; a heart of "heart".
// x, y, long, wide: pixels of the pen's frame; count: how many; colour, heart, rim: "#rrggbb" (heart and rim may be
// left out); turn: radians, 0 when left out. Returns nothing: it draws with pen.
// e.g. floraPetals(0, -90, 6, 9, 5.4, FLORA_WHITE, "#f2e4a0", 0.3);
function floraPetals(x, y, count, long, wide, colour, heart, turn, rim) {
  var n, a, fade;
  for (n = 0; n < count; n++) {
    a = (turn || 0) + n / count * Math.PI * 2 - Math.PI / 2;
    pen.beginPath();
    pen.ellipse(x + Math.cos(a) * long * 0.55, y + Math.sin(a) * long * 0.55, long * 0.5, wide * 0.5, a, 0, 7);
    if (rim) {
      fade = pen.createRadialGradient(x, y, long * 0.15, x, y, long * 1.05);
      fade.addColorStop(0, colour);
      fade.addColorStop(1, rim);
      floraPaint(colour, fade);
    } else {
      shape(colour);
    }
  }
  if (heart) {
    pen.fillStyle = heart;
    pen.beginPath();
    pen.arc(x, y, long * 0.2, 0, 7);
    pen.fill();
  }
}

// A bunch that hangs from (x, y): "count" stalks to round fruits of radius r
// below, the lowest drawn last so that it lies in front. "dot" marks each
// with a dark speck, "bumps" with the short arcs of a lychee's skin.
// x, y, r, spread: pixels of the pen's frame; count: how many fruits; colour: "#rrggbb"; seed: a number; dot, bumps:
// true or false. Returns nothing: it draws with pen.
// e.g. floraBunch(0, -108, 13, 8, "#c9a060", 4, 68, true, false);
function floraBunch(x, y, count, r, colour, seed, spread, dot, bumps) {
  var n, balls = [];
  for (n = 0; n < count; n++) {
    var bx = x + (dice(seed + n) - 0.5) * spread, by = y + 14 + dice(seed + n + 11) * spread * 0.9;
    balls.push([bx, by]);
    hose(x, y, bx, by, (dice(seed + n + 5) - 0.5) * 0.3, 1.8, "#8a7a4a");
  }
  balls.sort(function (a, b) { return a[1] - b[1]; });
  for (n = 0; n < balls.length; n++) {
    floraBall(balls[n][0], balls[n][1], r, colour, !bumps);
    if (dot) {
      pen.fillStyle = "rgba(60, 40, 20, 0.6)";
      pen.beginPath();
      pen.arc(balls[n][0] + r * 0.25, balls[n][1] + r * 0.25, r * 0.16, 0, 7);
      pen.fill();
    }
    if (bumps) {
      pen.strokeStyle = "rgba(110, 30, 25, 0.6)";
      pen.lineWidth = 1;
      pen.beginPath();
      for (var b = 0; b < 6; b++) {
        var a = dice(seed + n * 7 + b) * Math.PI * 2, d = dice(seed + n * 9 + b + 3) * r * 0.6;
        pen.moveTo(balls[n][0] + Math.cos(a) * d - 1.6, balls[n][1] + Math.sin(a) * d + 1);
        pen.quadraticCurveTo(balls[n][0] + Math.cos(a) * d, balls[n][1] + Math.sin(a) * d - 1.6, balls[n][0] + Math.cos(a) * d + 1.6, balls[n][1] + Math.sin(a) * d + 1);
      }
      pen.stroke();
    }
  }
}

// --- the flowers ---------------------------------------------------------

// Ratchaphruek, the golden shower: a raceme of small yellow five-petal
// flowers that hangs "long" from (x, y), the buds at its tip.
// x, y, long: pixels of the pen's frame; seed: a number.
// Returns nothing: it draws with pen.
// e.g. floraRaceme(-8, -104, 92, 3);
function floraRaceme(x, y, long, seed) {
  var tipX = x + 12 + 10 * dice(seed), tipY = y + long;
  hose(x, y, tipX, tipY, 0.08, 2.4, "#8aa84a");
  for (var n = 0; n < 9; n++) {
    var u = (n + 0.5) / 9, px = mix(x, tipX, u) + Math.sin(u * Math.PI) * 4, py = mix(y, tipY, u), side = n % 2 ? 1 : -1, r = 9.5 - u * 3.5;
    if (u > 0.8) {
      floraBall(px + side * 4, py, 3.2, "#e9c23c", false);
    } else {
      floraPetals(px + side * 7, py, 5, r, r * 0.7, "#f6cf3c", "#d58d1c", n * 0.7);
    }
  }
}

// A sprig of it: a twig with its leaves in a fan, and two racemes hanging.
// FLORA.ratchaphruek.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("ratchaphruek", 700, 900, {size: 1.5});
function floraRatchaphruek(look, seed) {
  hose(0, 0, 4, -120, 0.05, 6, FLORA_TWIG);
  [[-26, -112, -0.9], [30, -108, 0.95], [6, -138, 0.1], [-14, -128, -0.45], [22, -126, 0.5]].forEach(function (leaf) {
    floraLeaf(leaf[0], leaf[1], 34, 11, leaf[2]);
  });
  floraRaceme(-8, -104, 92, seed);
  floraRaceme(16, -98, 78, seed + 3);
}

// Thong kwao, the flame of the forest: one flower is a curved keel like a
// parrot's beak, orange-red, in a dark velvet calyx; they stand in clusters
// on a bare twig, because the tree flowers before it has leaves.
// x, y: pixels of the pen's frame; turn: radians; colour: "#rrggbb".
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraFlame(0, 0, -1.2, "#f0581e");
function floraFlame(x, y, turn, colour) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.beginPath();                                  // the calyx
  pen.ellipse(0, 0, 6, 4.5, 0, 0, 7);
  shape("#4f3b2c");
  pen.beginPath();                                  // the keel, curved
  pen.moveTo(2, -2);
  pen.bezierCurveTo(10, -16, 22, -16, 26, -6);
  pen.bezierCurveTo(18, -8, 10, -2, 4, 3);
  pen.closePath();
  shape(colour);
  pen.beginPath();                                  // the standard behind it, paler
  pen.moveTo(3, -3);
  pen.bezierCurveTo(8, -12, 14, -14, 18, -12);
  pen.bezierCurveTo(12, -8, 8, -4, 4, 0);
  pen.closePath();
  shape(blend(colour, "#ffffff", 0.2));
  pen.restore();
}

// Draws one cluster of six flames round (x, y).
// x, y: pixels of the pen's frame; colour: "#rrggbb"; seed: a number.
// Returns nothing: it draws with pen.
// e.g. floraFlameCluster(12, -118, "#f0581e", 2);
function floraFlameCluster(x, y, colour, seed) {
  for (var n = 0; n < 6; n++) {
    var a = -0.3 + n * 0.5 + (dice(seed + n) - 0.5) * 0.3;
    floraFlame(x + Math.cos(a) * 8, y + Math.sin(a) * 8, a - 1.2, colour);
  }
}

// FLORA.thongkwao.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("thongkwao", 700, 900, {size: 1.5});
function floraThongkwao(look, seed) {
  var colour = look.colour || "#f0581e";
  hose(0, 0, 12, -110, -0.1, 6, "#4a3326");
  hose(8, -70, -30, -112, -0.2, 4, "#4a3326");
  hose(10, -92, 44, -120, 0.15, 4, "#4a3326");
  floraFlameCluster(12, -118, colour, seed);
  floraFlameCluster(-32, -118, colour, seed + 5);
  floraFlameCluster(46, -126, colour, seed + 9);
}

// Frangipani (leelawadee): five petals that overlap like a pinwheel, each
// wider at its tip, white (or the colour told) going to yellow at the heart.
// x, y, r: pixels of the pen's frame; colour: "#rrggbb"; turn: radians (needed).
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraFrangipaniBloom(-18, -108, 22, FLORA_WHITE, 0.2);
function floraFrangipaniBloom(x, y, r, colour, turn) {
  for (var n = 0; n < 5; n++) {
    pen.save();
    pen.translate(x, y);
    pen.rotate(turn + n * Math.PI * 2 / 5);
    pen.beginPath();
    pen.moveTo(0, 0);
    pen.bezierCurveTo(r * 0.1, -r * 0.5, r * 0.55, -r * 1.05, r * 0.95, -r * 0.75);
    pen.bezierCurveTo(r * 1.0, -r * 0.4, r * 0.7, -r * 0.05, 0, 0);
    pen.closePath();
    var fade = pen.createLinearGradient(0, 0, r * 0.8, -r * 0.6);
    fade.addColorStop(0, "#f7d35a");
    fade.addColorStop(0.5, colour);
    fade.addColorStop(1, colour);
    floraPaint(colour, fade);
    pen.restore();
  }
}

// A sprig: a thick grey-green twig, long leaves, three blooms and a bud.
// FLORA.frangipani.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("frangipani", 700, 900, {size: 1.5});
function floraFrangipani(look, seed) {
  var colour = look.colour || FLORA_WHITE;
  hose(0, 0, 2, -84, 0.03, 11, "#9aa07a");
  floraLeaf(-6, -80, 70, 20, -1.1, "#3b7a4a", "#86b86a");
  floraLeaf(8, -82, 74, 20, 1.0, "#3b7a4a", "#86b86a");
  floraLeaf(0, -84, 60, 18, -0.2, "#3b7a4a", "#86b86a");
  hose(-4, -96, -12, -124, 0, 6, blend(colour, "#9aa07a", 0.3));
  floraFrangipaniBloom(-18, -108, 22, colour, 0.2);
  floraFrangipaniBloom(20, -112, 24, colour, 1.1);
  floraFrangipaniBloom(2, -134, 20, colour, 2.0);
}

// FLORA.frangipani.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number; colour: "#rrggbb" (FLORA.frangipani.hang passes FLORA_WHITE when it is given none). Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "frangipani", 1);
function floraFrangipaniHang(seed, colour) {
  floraLeaf(0, 0, 50, 15, 2.6, "#3b7a4a", "#86b86a");
  floraLeaf(0, 0, 50, 15, -2.5, "#3b7a4a", "#86b86a");
  floraFrangipaniBloom(-12, 8, 18, colour, seed);
  floraFrangipaniBloom(14, 4, 17, colour, seed + 1);
}

// An orchid: five petals, pale at their rims, and a darker lip below with a
// yellow throat; the blooms stand along an arching spray over strap leaves.
// x, y, r: pixels of the pen's frame; colour: "#rrggbb"; turn: radians.
// Returns nothing: it draws with pen.
// e.g. floraOrchidBloom(12, -80, 15, "#b64fb3", 0.6);
function floraOrchidBloom(x, y, r, colour, turn) {
  floraPetals(x, y, 5, r, r * 0.55, colour, null, turn, blend(colour, "#ffffff", 0.45));
  pen.beginPath();
  pen.ellipse(x, y + r * 0.38, r * 0.3, r * 0.36, 0, 0, 7);
  shape(blend(colour, "#5a1a60", 0.4));
  pen.fillStyle = "#f7e07a";
  pen.beginPath();
  pen.arc(x, y + r * 0.2, r * 0.1, 0, 7);
  pen.fill();
}

// FLORA.orchid.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("orchid", 700, 900, {size: 1.5});
function floraOrchid(look, seed) {
  var colour = look.colour || "#b64fb3", n, u, p;
  for (n = 0; n < 3; n++) { floraLeaf(0, 0, 70 + n * 10, 12, -0.5 + n * 0.5, "#2f6a48", FLORA_PALE); }
  stemOf(pen, 0, -10, 70, -140, 50, "#7fa84a", false);
  for (n = 0; n < 6; n++) {
    u = 0.3 + n * 0.14;
    p = stemPoint(0, -10, 70, -140, 50, u);
    floraOrchidBloom(p[0] + (n % 2 ? 12 : -12), p[1] - 4, 15 - n * 0.8, colour, n * 0.6);
  }
}

// Hibiscus (chaba): one big flower of five broad petals, paler at their rims,
// with a long column from its heart carrying the pollen and five red tips.
// x, y, r: pixels of the pen's frame; colour: "#rrggbb"; turn: radians.
// Returns nothing: it draws with pen.
// e.g. floraHibiscusBloom(10, -118, 34, "#d93a2e", 0.3);
function floraHibiscusBloom(x, y, r, colour, turn) {
  floraPetals(x, y, 5, r, r * 0.8, colour, null, turn, blend(colour, "#ffffff", 0.35));
  pen.fillStyle = blend(colour, "#3a0a10", 0.5);
  pen.beginPath();
  pen.arc(x, y, r * 0.16, 0, 7);
  pen.fill();
  hose(x, y, x + r * 0.8, y - r * 0.8, -0.1, 3, "#f3d26a");
  pen.fillStyle = "#f3d26a";
  for (var n = 0; n < 7; n++) {
    pen.beginPath();
    pen.arc(x + r * (0.5 + 0.3 * dice(n + 4)), y - r * (0.45 + 0.3 * dice(n + 9)), 1.8, 0, 7);
    pen.fill();
  }
  pen.fillStyle = colour;
  for (n = 0; n < 5; n++) {
    pen.beginPath();
    pen.arc(x + r * 0.8 + Math.cos(n * 1.3) * 3.5, y - r * 0.8 + Math.sin(n * 1.3) * 3.5, 2, 0, 7);
    pen.fill();
  }
}

// FLORA.hibiscus.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("hibiscus", 700, 900, {size: 1.5});
function floraHibiscus(look, seed) {
  var colour = look.colour || "#d93a2e";
  hose(0, 0, 6, -96, 0.04, 5, "#4f6a3a");
  floraLeaf(-2, -40, 44, 20, -1.0);
  floraLeaf(4, -60, 44, 20, 0.9);
  floraLeaf(6, -96, 36, 16, 0.2);
  pen.beginPath();                                  // a bud, in its green calyx
  pen.ellipse(-20, -84, 7, 13, -0.3, 0, 7);
  shape(colour);
  pen.beginPath();
  pen.ellipse(-22, -74, 7, 7, 0, 0, 7);
  shape("#5f8a3e");
  floraHibiscusBloom(10, -118, 34, colour, 0.3);
}

// Bougainvillea (fueang fa): what shows is three papery bracts, magenta,
// round a few tiny white flowers; they crowd a thorny woody twig.
// x, y, long: pixels of the pen's frame; turn: radians; colour: "#rrggbb".
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraBract(0, 0, 22, 1, "#d8338a");
function floraBract(x, y, long, turn, colour) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  leafPath(pen, long, long * 0.5, 0.05);
  floraPaint(colour, colour);
  pen.strokeStyle = "rgba(255, 255, 255, 0.5)";
  pen.lineWidth = 1;
  pen.beginPath();
  pen.moveTo(0, -2);
  pen.lineTo(0, -long * 0.9);
  pen.stroke();
  pen.restore();
}

// Draws three bracts and their white flowers round (x, y).
// x, y: pixels of the pen's frame; colour: "#rrggbb"; seed: a number.
// Returns nothing: it draws with pen.
// e.g. floraBractCluster(50, -122, "#d8338a", 1);
function floraBractCluster(x, y, colour, seed) {
  for (var n = 0; n < 3; n++) { floraBract(x, y, 22, 1 + n * 2.1 + dice(seed + n) * 0.4, colour); }
  pen.fillStyle = FLORA_WHITE;
  pen.beginPath();
  pen.arc(x - 2, y - 1, 1.6, 0, 7);
  pen.arc(x + 2, y + 1, 1.6, 0, 7);
  pen.arc(x, y - 3, 1.4, 0, 7);
  pen.fill();
}

// FLORA.bougainvillea.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("bougainvillea", 700, 900, {size: 1.5});
function floraBougainvillea(look, seed) {
  var colour = look.colour || "#d8338a";
  hose(0, 0, 50, -120, 0.18, 4.5, FLORA_TWIG);
  hose(26, -70, -14, -110, -0.2, 3, FLORA_TWIG);
  floraLeaf(14, -42, 28, 14, -0.9);
  floraLeaf(34, -90, 26, 13, 0.8);
  floraLeaf(-2, -92, 24, 12, -0.6);
  floraBractCluster(50, -122, colour, seed);
  floraBractCluster(-14, -112, colour, seed + 3);
  floraBractCluster(36, -98, colour, seed + 6);
  floraBractCluster(20, -62, colour, seed + 9);
}

// Jasmine (mali): small white flowers of rounded petals, and buds like
// white grains in a green cup, on thin stems with small dark leaves in pairs.
// Draws one jasmine flower of six petals.
// x, y, r: pixels of the pen's frame; turn: radians.
// Returns nothing: it draws with pen.
// e.g. floraJasmineBloom(6, -92, 9, 0.3);
function floraJasmineBloom(x, y, r, turn) {
  floraPetals(x, y, 6, r, r * 0.6, FLORA_WHITE, "#f2e4a0", turn);
}

// Draws a jasmine bud standing from its cup at (x, y).
// x, y: pixels of the pen's frame; turn: radians.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraJasmineBud(18, -84, 0.4);
function floraJasmineBud(x, y, turn) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.beginPath();
  pen.ellipse(0, -7, 3.2, 7, 0, 0, 7);
  shape(FLORA_WHITE);
  pen.beginPath();
  pen.ellipse(0, 0, 3, 3.5, 0, 0, 7);
  shape(FLORA_STEM);
  pen.restore();
}

// FLORA.jasmine.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("jasmine", 700, 900, {size: 1.5});
function floraJasmine(look, seed) {
  hose(0, 0, 6, -80, 0.05, 3, FLORA_STEM);
  hose(3, -40, -30, -84, -0.15, 2.4, FLORA_STEM);
  hose(4, -58, 38, -92, 0.15, 2.4, FLORA_STEM);
  [[-8, -26, -1.0], [12, -30, 1.0], [-16, -62, -1.2], [-26, -72, -0.3], [24, -72, 1.1], [34, -84, 0.3]].forEach(function (leaf) {
    floraLeaf(leaf[0], leaf[1], 22, 11, leaf[2], "#2f6a48", "#6fae5a");
  });
  floraJasmineBloom(6, -92, 9, 0.3);
  floraJasmineBloom(-30, -88, 8, 1);
  floraJasmineBloom(38, -96, 8.5, 2);
  floraJasmineBloom(-12, -70, 7.5, 0.7);
  floraJasmineBud(18, -84, 0.4);
  floraJasmineBud(-22, -58, -0.5);
  floraJasmineBud(30, -72, 0.6);
}

// Marigold (dao rueang): a pompom of many short ruffled petals, orange
// outside and lighter at the heart, on a stem with ferny leaves.
// x, y, r: pixels of the pen's frame; outer, inner: "#rrggbb".
// Returns nothing: it draws with pen.
// e.g. floraPompom(-12, -118, 26, "#f08a1e", "#f8b44c");
function floraPompom(x, y, r, outer, inner) {
  for (var ring = 3; ring >= 0; ring--) {
    var rr = r * (0.4 + ring * 0.2), count = 6 + ring * 4, colour = blend(inner, outer, ring / 3);
    for (var n = 0; n < count; n++) {
      var a = n / count * Math.PI * 2 + ring * 0.3;
      pen.beginPath();
      pen.ellipse(x + Math.cos(a) * rr * 0.72, y + Math.sin(a) * rr * 0.72, rr * 0.36, rr * 0.22, a, 0, 7);
      shape(colour);
    }
  }
}

// FLORA.marigold.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (look.colour is the flower's colour); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("marigold", 700, 900, {size: 1.5});
function floraMarigold(look, seed) {
  var colour = look.colour || "#f08a1e", light = blend(colour, "#ffe27a", 0.45);
  hose(0, 0, -10, -100, -0.05, 4, FLORA_STEM);
  hose(0, -8, 30, -76, 0.1, 3.5, FLORA_STEM);
  [[-4, -40, -1.1], [2, -56, 1.0], [14, -40, 0.9], [-8, -74, -0.9], [24, -62, 1.2]].forEach(function (leaf) {
    floraLeaf(leaf[0], leaf[1], 30, 6, leaf[2], "#3f7c4c", "#7fb860");
  });
  floraBall(10, -70, 6, "#6f9a52", false);
  floraBall(10, -74, 4, colour, false);
  floraPompom(-12, -118, 26, colour, light);
  floraPompom(32, -92, 20, colour, light);
}

// --- the fruits ----------------------------------------------------------

// A mango: a kidney shape with a beak at one end, green at the stem going to
// yellow and a blush of orange, lying on its side, with a leaf.
// x, y: its middle, pixels of the pen's frame; size: 1 is 68 long; turn: radians.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraMango(0, -14, 1, -0.15);
function floraMango(x, y, size, turn) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(size, size);
  pen.beginPath();
  pen.moveTo(-34, 0);
  pen.bezierCurveTo(-36, -22, -10, -30, 10, -26);
  pen.bezierCurveTo(28, -22, 40, -8, 34, 4);
  pen.bezierCurveTo(26, 12, -10, 16, -34, 0);
  pen.closePath();
  var fade = pen.createLinearGradient(-30, -20, 30, 10);
  fade.addColorStop(0, "#c6c84a");
  fade.addColorStop(0.5, "#f5c43a");
  fade.addColorStop(1, "#ef9a3a");
  floraPaint("#f5c43a", fade);
  hose(-34, -2, -42, -12, 0, 3, FLORA_TWIG);
  pen.fillStyle = "rgba(255, 250, 235, 0.4)";
  pen.beginPath();
  pen.ellipse(-8, -16, 12, 4, 0.1, 0, 7);
  pen.fill();
  pen.restore();
}

// FLORA.mango.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("mango", 700, 900, {size: 1.5});
function fruitMango(look, seed) {
  floraMango(0, -14, 1, -0.15);
  floraLeaf(-40, -14, 40, 14, -1.1);
}

// FLORA.mango.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "mango", 1);
function fruitMangoHang(seed) {
  hose(0, 0, 2, 22, 0, 2.5, FLORA_TWIG);
  floraMango(6, 46, 0.8, 1.3);
}

// A bael (มะตูม, matum; Aegle marmelos): a round fruit in a hard shell, grey-green going to yellow, speckled, on a
// short stalk; its leaves come in threes. Read from two photographs on Wikimedia Commons ("Aegle marmelos fruit 06",
// Forestowlet, CC0; "Bael (Aegle marmelos) fruit at Narendrapur", J.M.Garg, CC BY-SA 3.0). Nothing is copied.
// In the north it is the measure of the tribute in the tale of Chang Ngu: the Khom took gold "the size of four
// bael fruits" a year.
// x, y: its middle, pixels of the pen's frame; size: 1 is 52 across; ripe: 0 (green) to 1 (yellow).
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraBael(0, -26, 1, 0.2);
function floraBael(x, y, size, ripe) {
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  pen.beginPath();
  pen.ellipse(0, 0, 26, 27, 0, 0, 7);
  var shell = pen.createRadialGradient(-10, -11, 4, 0, 0, 27);
  shell.addColorStop(0, blend("#c9cf8a", "#e8d27a", ripe));
  shell.addColorStop(1, blend("#7f8a46", "#a8902e", ripe));
  floraPaint(blend("#a4ac66", "#c8b052", ripe), shell);
  pen.fillStyle = "rgba(90, 80, 40, 0.35)";           // the speckles of the shell
  for (var d = 0; d < 14; d++) {
    var far = 16 * ((d % 3) + 1) / 3;
    pen.beginPath();
    pen.arc(Math.cos(d * 2.4) * far, Math.sin(d * 2.4) * far, 1.3, 0, 7);
    pen.fill();
  }
  pen.fillStyle = "rgba(255, 250, 235, 0.35)";        // its shine
  pen.beginPath();
  pen.ellipse(-9, -12, 8, 4, -0.5, 0, 7);
  pen.fill();
  hose(0, -26, 2, -34, 0, 3, FLORA_TWIG);             // the short stalk
  pen.restore();
}

// Three leaflets on one stalk, as the bael's leaves grow: the middle one longest.
// x, y: where the stalk leaves the twig; turn: radians (0 points right); size: 1 is about 50 long.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraBaelLeaves(36, -66, -0.4, 1);
function floraBaelLeaves(x, y, turn, size) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(size, size);
  hose(0, 0, 10, 0, 0, 2, FLORA_TWIG);
  floraLeaf(10, 0, 30, 10, -0.75);
  floraLeaf(10, 0, 30, 10, 0.75);
  floraLeaf(10, 0, 40, 12, 0);
  pen.restore();
}

// FLORA.bael.draw: flora() calls it with the pen moved to the foot and scaled by look.size: the fruit on the
// ground, its stalk and twig still on it, with a spray of leaves in threes.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("bael", 700, 900, {size: 1.5});
function fruitBael(look, seed) {
  hose(2, -60, 40, -84, 0.08, 3.5, FLORA_TWIG);        // the twig it was picked with
  floraBaelLeaves(40, -84, -0.5, 0.9);
  floraBaelLeaves(22, -70, -2.2, 0.75);
  floraBael(0, -27, 1, 0.15 + 0.1 * Math.sin(seed));
}

// FLORA.bael.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "bael", 1);
function fruitBaelHang(seed) {
  hose(0, 0, 2, 20, 0, 2.5, FLORA_TWIG);
  floraBaelLeaves(0, 4, -0.6 + 0.3 * Math.sin(seed), 0.7);
  floraBael(2, 46, 0.8, 0.2 + 0.2 * Math.sin(seed * 3));
}

// A durian: a big oval in a coat of spikes, green going to brown, a thick
// stem at one end; the spikes on its face are marks like small tents.
// x, y: its middle, pixels of the pen's frame; size: 1 is about 130 long; turn: radians; seed: a number.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraDurian(0, -54, 1, 0.1, 2);
function floraDurian(x, y, size, turn, seed) {
  var n;
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(size, size);
  pen.beginPath();                                  // the spikes round the edge, then the body over their roots
  for (n = 0; n < 30; n++) {
    var a = n / 30 * Math.PI * 2, len = 1.16 + 0.1 * dice(seed + n);
    pen.moveTo(Math.cos(a - 0.09) * 56, Math.sin(a - 0.09) * 44);
    pen.lineTo(Math.cos(a) * 56 * len, Math.sin(a) * 44 * len);
    pen.lineTo(Math.cos(a + 0.09) * 56, Math.sin(a + 0.09) * 44);
  }
  shape("#8f9a44");
  pen.beginPath();
  pen.ellipse(0, 0, 56, 44, 0, 0, 7);
  shape("#a7b24e");
  pen.strokeStyle = "rgba(60, 70, 30, 0.7)";
  pen.lineWidth = 1.4;
  pen.beginPath();
  for (n = 0; n < 48; n++) {
    var sx = -46 + dice(seed + n * 3) * 92, sy = -34 + dice(seed + n * 7 + 1) * 68;
    if (sx * sx / 2500 + sy * sy / 1444 > 1) { continue; }
    pen.moveTo(sx - 4, sy + 3);
    pen.lineTo(sx, sy - 4);
    pen.lineTo(sx + 4, sy + 3);
  }
  pen.stroke();
  hose(50, -10, 68, -22, 0, 7, "#7a5a3a");
  pen.restore();
}

// FLORA.durian.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("durian", 700, 900, {size: 1.5});
function fruitDurian(look, seed) {
  floraDurian(0, -54, 1, 0.1, seed);
}

// FLORA.durian.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "durian", 1);
function fruitDurianHang(seed) {
  hose(0, 0, 0, 24, 0, 5, "#7a5a3a");
  floraDurian(0, 78, 0.62, -Math.PI / 2, seed);
}

// A mangosteen: a round fruit of deep purple with a cap of four thick green
// lobes round its stem, and a rosette of marks on its underside; beside it,
// the lower half of one opened, its white segments in the pink of the rind.
// x, y: its foot, pixels of the pen's frame; size: 1 is 44 across.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraMangosteen(-20, 0, 1);
function floraMangosteen(x, y, size) {
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  floraBall(0, -22, 22, "#5a2a52");
  pen.fillStyle = "#3a1a38";
  for (var n = 0; n < 6; n++) {
    pen.beginPath();
    pen.arc(Math.cos(n * 1.05) * 5, -4 + Math.sin(n * 1.05) * 2, 1.6, 0, 7);
    pen.fill();
  }
  [-2.3, -0.9, 0.9, 2.3].forEach(function (a) {
    pen.save();
    pen.translate(0, -40);
    pen.rotate(a);
    leafPath(pen, 16, 9, 0);
    shape("#7fa84a");
    pen.restore();
  });
  hose(0, -40, 0, -52, 0, 4, "#5f7a3a");
  pen.restore();
}

// Draws the opened half of a mangosteen.
// x, y: its foot, pixels of the pen's frame; size: 1 is 40 across.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraMangosteenHalf(26, 0, 1);
function floraMangosteenHalf(x, y, size) {
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  pen.beginPath();
  pen.arc(0, -14, 20, 0, Math.PI);
  pen.closePath();
  shape("#5a2a52");
  pen.beginPath();
  pen.ellipse(0, -14, 20, 7, 0, 0, 7);
  shape("#9a4a8a");
  for (var n = 0; n < 5; n++) {
    var a = n / 5 * Math.PI * 2;
    pen.beginPath();
    pen.ellipse(Math.cos(a) * 9, -15 + Math.sin(a) * 3.2, 6.5, 3.4, a, 0, 7);
    shape("#f7f3e8");
  }
  pen.restore();
}

// FLORA.mangosteen.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("mangosteen", 700, 900, {size: 1.5});
function fruitMangosteen(look, seed) {
  floraMangosteen(-20, 0, 1);
  floraMangosteenHalf(26, 0, 1);
}

// FLORA.mangosteen.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "mangosteen", 1);
function fruitMangosteenHang(seed) {
  hose(0, 0, 0, 14, 0, 2.5, FLORA_TWIG);
  floraMangosteen(0, 64, 1);
}

// A rambutan: a red ball in a coat of soft hairs that turn green at their
// tips; three on a twig, with a leaf.
// x, y, r: its middle and radius, pixels of the pen's frame; seed: a number.
// Returns nothing: it draws with pen.
// e.g. floraRambutan(-2, -50, 15, 6);
function floraRambutan(x, y, r, seed) {
  for (var n = 0; n < 18; n++) {
    var a = n / 18 * Math.PI * 2 + dice(seed + n) * 0.3, len = r * (0.5 + 0.3 * dice(seed + n + 7));
    var x1 = x + Math.cos(a) * r * 0.9, y1 = y + Math.sin(a) * r * 0.9;
    var x2 = x + Math.cos(a + 0.25) * (r + len), y2 = y + Math.sin(a + 0.25) * (r + len);
    hose(x1, y1, x2, y2, 0.15, 2.6, "#d8352e");
    hose(mix(x1, x2, 0.6), mix(y1, y2, 0.6), x2, y2, 0.05, 2.6, "#86bb4e");
  }
  floraBall(x, y, r, "#d8352e");
}

// FLORA.rambutan.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("rambutan", 700, 900, {size: 1.5});
function fruitRambutan(look, seed) {
  hose(-30, -72, 34, -64, 0.05, 3.5, FLORA_TWIG);
  floraLeaf(30, -66, 40, 13, 1.2);
  floraRambutan(-2, -50, 15, seed + 6);
  floraRambutan(-24, -22, 17, seed);
  floraRambutan(14, -20, 18, seed + 3);
}

// FLORA.rambutan.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "rambutan", 1);
function fruitRambutanHang(seed) {
  hose(0, 0, 0, 20, 0, 2.5, FLORA_TWIG);
  floraRambutan(-10, 38, 16, seed);
  floraRambutan(12, 46, 17, seed + 3);
}

// Longan (lamyai), the orchard crop of Lamphun and Chiang Mai: a bunch of
// small round fruits in thin brown skins hanging from a twig with two
// leaves, and one peeled, white, with its black seed showing.
// FLORA.longan.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("longan", 700, 900, {size: 1.5});
function fruitLongan(look, seed) {
  hose(-40, -110, 40, -106, 0.05, 3.5, FLORA_TWIG);
  floraLeaf(-30, -108, 46, 12, -1.3);
  floraLeaf(30, -106, 46, 12, 1.25);
  floraBunch(0, -108, 13, 8, "#c9a060", seed, 68, true, false);
  floraBall(46, -10, 8, "#f3eedd");
  pen.fillStyle = "#2a1a12";
  pen.beginPath();
  pen.arc(47, -9, 3.6, 0, 7);
  pen.fill();
}

// FLORA.longan.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "longan", 1);
function fruitLonganHang(seed) {
  floraLeaf(0, 0, 36, 10, 2.5);
  floraLeaf(0, 0, 36, 10, -2.6);
  floraBunch(0, 0, 13, 8, "#c9a060", seed, 60, true, false);
}

// Lychee (linchi): a bunch of red fruits with a bumpy skin, on a twig with
// leaves, and one peeled to its white flesh.
// FLORA.lychee.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("lychee", 700, 900, {size: 1.5});
function fruitLychee(look, seed) {
  hose(-40, -104, 40, -100, 0.05, 3.5, FLORA_TWIG);
  floraLeaf(-30, -102, 46, 12, -1.3);
  floraLeaf(30, -100, 46, 12, 1.25);
  floraBunch(0, -102, 8, 11, "#d6403a", seed, 62, false, true);
  floraBall(50, -11, 10, "#f7f3e8");
  pen.fillStyle = "rgba(90, 60, 40, 0.5)";
  pen.beginPath();
  pen.arc(52, -9, 4, 0, 7);
  pen.fill();
}

// FLORA.lychee.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "lychee", 1);
function fruitLycheeHang(seed) {
  floraLeaf(0, 0, 36, 10, 2.5);
  floraLeaf(0, 0, 36, 10, -2.6);
  floraBunch(0, 0, 8, 11, "#d6403a", seed, 56, false, true);
}

// A papaya: long, narrow at the stem and full at the far end, green going to
// orange, with faint ridges along it; and one cut lengthwise, its orange
// flesh round a boat of black seeds.
// x, y: its middle, pixels of the pen's frame; size: 1 is about 120 long; turn: radians.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraPapaya(-22, -34, 0.9, -0.08);
function floraPapaya(x, y, size, turn) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(size, size);
  pen.beginPath();
  pen.moveTo(-58, 0);
  pen.bezierCurveTo(-60, -14, -40, -22, -10, -24);
  pen.bezierCurveTo(30, -26, 60, -16, 60, 0);
  pen.bezierCurveTo(60, 16, 30, 26, -10, 24);
  pen.bezierCurveTo(-40, 22, -60, 14, -58, 0);
  pen.closePath();
  var fade = pen.createLinearGradient(-58, 0, 60, 0);
  fade.addColorStop(0, "#9bbb4e");
  fade.addColorStop(0.5, "#e6b23e");
  fade.addColorStop(1, "#f3a03a");
  floraPaint("#e6b23e", fade);
  pen.strokeStyle = "rgba(80, 60, 20, 0.25)";
  pen.lineWidth = 1.2;
  pen.beginPath();
  for (var r = -1; r <= 1; r++) {
    pen.moveTo(-50, r * 7);
    pen.quadraticCurveTo(0, r * 20, 54, r * 6);
  }
  pen.stroke();
  hose(-58, 0, -68, -2, 0, 5, "#8a9a5a");
  pen.restore();
}

// Draws a papaya cut lengthwise.
// x, y: its middle, pixels of the pen's frame; size: 1 is about 120 long.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraPapayaHalf(44, -12, 0.55);
function floraPapayaHalf(x, y, size) {
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  pen.beginPath();
  pen.moveTo(-58, 0);
  pen.bezierCurveTo(-60, -14, -40, -22, -10, -24);
  pen.bezierCurveTo(30, -26, 60, -16, 60, 0);
  pen.bezierCurveTo(60, 16, 30, 26, -10, 24);
  pen.bezierCurveTo(-40, 22, -60, 14, -58, 0);
  pen.closePath();
  shape("#f6a04a");
  pen.beginPath();
  pen.ellipse(8, 0, 36, 11, 0, 0, 7);
  shape("#e8742e");
  pen.fillStyle = "#1e1410";
  for (var n = 0; n < 22; n++) {
    pen.beginPath();
    pen.arc(8 + (dice(n + 2) - 0.5) * 62, (dice(n + 8) - 0.5) * 16, 2.2, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// FLORA.papaya.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("papaya", 700, 900, {size: 1.5});
function fruitPapaya(look, seed) {
  floraPapaya(-22, -34, 0.9, -0.08);
  floraPapayaHalf(44, -12, 0.55);
}

// FLORA.papaya.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "papaya", 1);
function fruitPapayaHang(seed) {
  floraPapaya(0, 58, 1, Math.PI / 2);
}

// A young coconut as the street sells it: the green husk trimmed to a peak
// of flat cuts, with a pale cut at the top to drink from.
// FLORA.coconut.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("coconut", 700, 900, {size: 1.5});
function fruitCoconut(look, seed) {
  pen.beginPath();
  pen.moveTo(-40, -8);
  pen.bezierCurveTo(-46, -50, -30, -84, -8, -92);
  pen.lineTo(8, -92);
  pen.bezierCurveTo(30, -84, 46, -50, 40, -8);
  pen.bezierCurveTo(30, 4, -30, 4, -40, -8);
  pen.closePath();
  shape("#9fc45a");
  pen.strokeStyle = "rgba(50, 80, 30, 0.5)";
  pen.lineWidth = 1.4;
  pen.beginPath();
  for (var n = -2; n <= 2; n++) {
    pen.moveTo(n * 7, -92);
    pen.lineTo(n * 18, -56);
  }
  pen.stroke();
  pen.beginPath();
  pen.ellipse(0, -92, 12, 4.5, 0, 0, 7);
  shape("#f4efdf");
}

// A pineapple: a crown of stiff leaves on a body netted in diamonds, each
// with a dark eye, orange going to brown at its foot.
// FLORA.pineapple.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("pineapple", 700, 900, {size: 1.5});
function fruitPineapple(look, seed) {
  var n;
  for (n = 0; n < 9; n++) {
    var a = -1.3 + n * 0.33;
    pen.save();
    pen.translate(0, -98);
    pen.rotate(a);
    paintLeaf(pen, 46 - Math.abs(a) * 9, 8, a * 0.1, "#3f7c4c", "#8fc46a", FLORA_LINE);
    pen.restore();
  }
  pen.beginPath();
  pen.ellipse(0, -52, 32, 48, 0, 0, 7);
  var fade = pen.createLinearGradient(0, -100, 0, -4);
  fade.addColorStop(0, "#e8a93a");
  fade.addColorStop(1, "#c4862a");
  floraPaint("#e8a93a", fade);
  pen.save();
  pen.beginPath();
  pen.ellipse(0, -52, 31, 47, 0, 0, 7);
  pen.clip();
  pen.strokeStyle = "rgba(120, 70, 20, 0.55)";
  pen.lineWidth = 1.4;
  pen.beginPath();
  for (n = -8; n <= 8; n++) {
    pen.moveTo(n * 11 - 60, -112);
    pen.lineTo(n * 11 + 60, 8);
    pen.moveTo(n * 11 + 60, -112);
    pen.lineTo(n * 11 - 60, 8);
  }
  pen.stroke();
  pen.fillStyle = "#6b4a2e";
  for (var a2 = -6; a2 <= 6; a2++) {
    for (var b = -6; b <= 6; b++) {
      var px = (a2 - b) * 5.5, py = -52 + (a2 + b) * 6;
      if (px * px / 900 + (py + 52) * (py + 52) / 2100 > 1) { continue; }
      pen.beginPath();
      pen.arc(px, py, 1.5, 0, 7);
      pen.fill();
    }
  }
  pen.restore();
}

// A jackfruit: a great oblong, green-yellow, all over small bumps, with a
// short thick stem; it grows from the trunk of its tree.
// x, y: its middle, pixels of the pen's frame; size: 1 is 148 long; turn: radians; seed: a number.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraJackfruit(0, -54, 1, 0.12, 3);
function floraJackfruit(x, y, size, turn, seed) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(size, size);
  pen.beginPath();
  pen.ellipse(0, 0, 74, 54, 0, 0, 7);
  var fade = pen.createLinearGradient(-60, -50, 60, 50);
  fade.addColorStop(0, "#c9c454");
  fade.addColorStop(1, "#9aa43a");
  floraPaint("#b9b84a", fade);
  pen.fillStyle = "rgba(90, 100, 30, 0.45)";
  for (var a = -8; a <= 8; a++) {
    for (var b = -6; b <= 6; b++) {
      var px = a * 9 + (b % 2) * 4.5, py = b * 8;
      if (px * px / 4900 + py * py / 2600 > 1) { continue; }
      pen.beginPath();
      pen.arc(px, py, 1.7, 0, 7);
      pen.fill();
    }
  }
  hose(-66, -22, -82, -38, 0, 8, "#7a5a3a");
  pen.restore();
}

// FLORA.jackfruit.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("jackfruit", 700, 900, {size: 1.5});
function fruitJackfruit(look, seed) {
  floraJackfruit(0, -54, 1, 0.12, seed);
}

// FLORA.jackfruit.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "jackfruit", 1);
function fruitJackfruitHang(seed) {
  hose(0, 0, 0, 16, 0, 6, "#7a5a3a");
  floraJackfruit(10, 70, 0.6, 1.2, seed);
}

// A dragon fruit: an oval of magenta in a coat of scales, each a flap that
// turns green at its tip.
// FLORA.dragonfruit.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("dragonfruit", 700, 900, {size: 1.5});
function fruitDragonfruit(look, seed) {
  pen.beginPath();
  pen.ellipse(0, -40, 34, 40, 0, 0, 7);
  var fade = pen.createLinearGradient(-30, -70, 30, -10);
  fade.addColorStop(0, "#e8468a");
  fade.addColorStop(1, "#c42a62");
  floraPaint("#d8306e", fade);
  for (var n = 0; n < 11; n++) {
    var a = n * 0.95 + 0.3, d = 0.45 + 0.45 * dice(seed + n);
    pen.save();
    pen.translate(Math.cos(a) * 30 * d, -40 + Math.sin(a) * 36 * d);
    pen.rotate(a + Math.PI / 2 + 0.3);
    leafPath(pen, 18, 8, 0.2);
    var tip = pen.createLinearGradient(0, 0, 0, -18);
    tip.addColorStop(0, "#d8306e");
    tip.addColorStop(1, "#8fbb4e");
    floraPaint("#d8306e", tip);
    pen.restore();
  }
}

// A pomelo: a big round fruit of pale green-yellow with a nub at the top
// and the pores of its rind; beside it a segment peeled to its pink pulp.
// FLORA.pomelo.draw: flora() calls it with the pen moved to the foot and scaled by look.size.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("pomelo", 700, 900, {size: 1.5});
function fruitPomelo(look, seed) {
  floraBall(-24, -46, 46, "#c9d66a");
  pen.beginPath();
  pen.ellipse(-24, -92, 10, 5, 0, 0, 7);
  shape("#b9c65a");
  pen.fillStyle = "rgba(90, 110, 40, 0.35)";
  for (var n = 0; n < 34; n++) {
    var a = dice(seed + n) * Math.PI * 2, d = Math.sqrt(dice(seed + n + 40)) * 40;
    pen.beginPath();
    pen.arc(-24 + Math.cos(a) * d, -46 + Math.sin(a) * d, 1.3, 0, 7);
    pen.fill();
  }
  pen.beginPath();                                  // the segment: pith, then pulp
  pen.moveTo(44, -40);
  pen.arc(44, -40, 40, 1.2, 2.3);
  pen.closePath();
  shape("#f7f3e6");
  pen.beginPath();
  pen.moveTo(44, -36);
  pen.arc(44, -36, 32, 1.25, 2.25);
  pen.closePath();
  shape("#f2a08a");
  pen.strokeStyle = "rgba(200, 90, 70, 0.5)";
  pen.lineWidth = 1;
  pen.beginPath();
  for (n = 0; n < 6; n++) {
    var ra = 1.3 + n * 0.17;
    pen.moveTo(44 + Math.cos(ra) * 8, -36 + Math.sin(ra) * 8);
    pen.lineTo(44 + Math.cos(ra) * 30, -36 + Math.sin(ra) * 30);
  }
  pen.stroke();
}

// --- the flowers and plants of Lanna -------------------------------------

// A leaf's outline from its foot at (0, 0) to its tip "long" above: "wide" is its half-width where it is widest,
// at "at" (a share of long); "sharp" over 1 draws the tip out long and thin, under 1 rounds it; "teeth" (pixels)
// saws its edge; "bow" bends its tip aside, as a share of long.
// long, wide, teeth: pixels; at: 0..1; sharp: about 0.5..2; bow: a share of long, 0 when left out.
// Returns nothing: it begins a new path on pen and closes it, unfilled.
// e.g. floraBladePath(62, 20, 0.45, 0.9, 1.6, 0.1); pen.fill();
function floraBladePath(long, wide, at, sharp, teeth, bow) {
  var count = teeth ? 30 : 18, n, u, w, side, points = [];
  for (n = 0; n <= count; n++) {
    u = n / count;
    w = u < at ? wide * Math.pow(Math.sin(Math.PI / 2 * u / at), 0.65) : wide * Math.pow(Math.cos(Math.PI / 2 * (u - at) / (1 - at)), sharp);
    if (teeth && n % 2 && n < count) { w += teeth; }
    points.push([w, -u * long, (bow || 0) * long * u * u]);
  }
  pen.beginPath();
  pen.moveTo(0, 0);
  for (side = -1; side <= 1; side += 2) {
    for (n = side < 0 ? 1 : count - 1; side < 0 ? n <= count : n >= 1; n += side < 0 ? 1 : -1) {
      pen.lineTo(points[n][2] + side * points[n][0], points[n][1]);
    }
  }
  pen.closePath();
}

// A leaf drawn on floraBladePath(): deep at its foot and lighter toward the tip, a rib up its middle and "veins"
// pairs of side veins curving toward the tip, a fine dark line round it.
// x, y: its foot, pixels of the pen's frame; long, wide: pixels; turn: radians, 0 straight up; deep, pale: "#rrggbb";
// shape: {at, sharp, teeth, bow, veins, rib} (at 0.45, sharp 1, teeth 0, bow 0, veins 5, rib a pale gold), or nothing.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraBlade(0, -40, 62, 20, -1.1, "#22553a", "#4f9a56", {teeth: 1.6, veins: 7});
function floraBlade(x, y, long, wide, turn, deep, pale, shape) {
  shape = shape || {};
  var at = shape.at || 0.45, sharp = shape.sharp || 1, bow = shape.bow || 0, veins = shape.veins === undefined ? 5 : shape.veins, n;
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  floraBladePath(long, wide, at, sharp, shape.teeth || 0, bow);
  var fade = pen.createLinearGradient(-wide, 0, wide * 0.6, -long);
  fade.addColorStop(0, deep);
  fade.addColorStop(1, pale);
  pen.fillStyle = fade;
  pen.fill();
  pen.strokeStyle = FLORA_LINE;
  pen.lineWidth = Math.max(0.8, LINE * 0.55);
  pen.lineJoin = "round";
  pen.stroke();
  pen.strokeStyle = shape.rib || "rgba(240, 232, 170, 0.6)";
  pen.lineWidth = 1;
  pen.beginPath();
  pen.moveTo(0, -long * 0.02);
  pen.quadraticCurveTo(bow * long * 0.3, -long * 0.55, bow * long * 0.95, -long * 0.95);
  for (n = 1; n <= veins; n++) {
    var u = n / (veins + 1.2), vy = -u * long, vx = bow * long * u * u, reach = wide * 0.82 * Math.sin(Math.PI * Math.min(1, u * 1.1));
    pen.moveTo(vx, vy);
    pen.quadraticCurveTo(vx - reach * 0.6, vy - long * 0.05, vx - reach, vy - long * 0.13);
    pen.moveTo(vx, vy);
    pen.quadraticCurveTo(vx + reach * 0.6, vy - long * 0.05, vx + reach, vy - long * 0.13);
  }
  pen.stroke();
  pen.fillStyle = "rgba(255, 252, 235, 0.22)";       // the gloss along one half
  floraBladePath(long * 0.8, wide * 0.42, at, sharp, 0, bow * 0.8);
  pen.save();
  pen.translate(-wide * 0.3, -long * 0.08);
  pen.fill();
  pen.restore();
  pen.restore();
}

// A heart-shaped leaf from its foot at (0, 0) to its tip "long" above: two round lobes at the foot and a tip drawn
// out to a point; "drip" is how much of its length the narrow tip is (the bodhi's long drip tip is 0.3).
// long, wide: pixels; drip: 0..0.4. Returns nothing: it begins a new path on pen and closes it, unfilled.
// e.g. floraHeartPath(58, 30, 0.3); pen.fill();
function floraHeartPath(long, wide, drip) {
  var body = long * (1 - drip);
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.bezierCurveTo(-wide * 0.55, wide * 0.42, -wide * 1.12, -body * 0.12, -wide * 0.88, -body * 0.5);
  pen.bezierCurveTo(-wide * 0.7, -body * 0.82, -wide * 0.2, -body * 0.92, -wide * 0.06, -body);
  pen.quadraticCurveTo(-wide * 0.02, -mix(body, long, 0.6), 0, -long);
  pen.quadraticCurveTo(wide * 0.02, -mix(body, long, 0.6), wide * 0.06, -body);
  pen.bezierCurveTo(wide * 0.2, -body * 0.92, wide * 0.7, -body * 0.82, wide * 0.88, -body * 0.5);
  pen.bezierCurveTo(wide * 1.12, -body * 0.12, wide * 0.55, wide * 0.42, 0, 0);
  pen.closePath();
}

// A heart-shaped leaf on floraHeartPath(), deep at its foot and lighter toward its tip, with a fine dark line; its
// veins either run out from the rib to the edge ("pinnate", the bodhi's) or curve up from the foot to the tip
// (the betel's).
// x, y: its foot; long, wide: pixels; turn: radians, 0 straight up; deep, pale: "#rrggbb"; drip: as
// floraHeartPath(); pinnate: true for veins from the rib; vein: a CSS colour, a pale gold when left out.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraHeart(0, -60, 58, 30, 2.6, "#2f6a3a", "#78b45a", 0.3, true);
function floraHeart(x, y, long, wide, turn, deep, pale, drip, pinnate, vein) {
  var body = long * (1 - drip), n;
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  floraHeartPath(long, wide, drip);
  var fade = pen.createLinearGradient(-wide * 0.8, 0, wide * 0.5, -long);
  fade.addColorStop(0, deep);
  fade.addColorStop(1, pale);
  pen.fillStyle = fade;
  pen.fill();
  pen.strokeStyle = FLORA_LINE;
  pen.lineWidth = long < 30 ? 0.9 : Math.max(0.8, LINE * 0.55);
  pen.lineJoin = "round";
  pen.stroke();
  if (long < 30) {                                  // a leaf of a crown: too small for veins
    pen.restore();
    return;
  }
  pen.strokeStyle = vein || "rgba(240, 232, 170, 0.6)";
  pen.lineWidth = 1;
  pen.beginPath();
  pen.moveTo(0, wide * 0.05);
  pen.lineTo(0, -long * 0.96);
  if (pinnate) {
    for (n = 1; n <= 6; n++) {
      var u = n / 7.2, vy = -u * body, reach = wide * 0.86 * Math.sin(Math.PI * (0.25 + u * 0.75));
      pen.moveTo(0, vy);
      pen.quadraticCurveTo(-reach * 0.5, vy - body * 0.04, -reach, vy - body * 0.16);
      pen.moveTo(0, vy);
      pen.quadraticCurveTo(reach * 0.5, vy - body * 0.04, reach, vy - body * 0.16);
    }
  } else {
    for (n = 1; n <= 2; n++) {
      pen.moveTo(0, 0);
      pen.bezierCurveTo(-wide * 0.5 * n, -body * 0.1, -wide * 0.45 * n, -body * 0.6, -wide * 0.04, -body * 0.97);
      pen.moveTo(0, 0);
      pen.bezierCurveTo(wide * 0.5 * n, -body * 0.1, wide * 0.45 * n, -body * 0.6, wide * 0.04, -body * 0.97);
    }
  }
  pen.stroke();
  pen.fillStyle = "rgba(255, 252, 235, 0.2)";        // the gloss on one lobe
  pen.beginPath();
  pen.ellipse(-wide * 0.42, -body * 0.42, wide * 0.24, body * 0.26, 0.25, 0, 7);
  pen.fill();
  pen.restore();
}

// A rounded petal from its foot at (0, 0) to its tip "long" above, "wide" its half-width; "notch" dents its tip.
// long, wide, notch: pixels (notch 0 when left out). Returns nothing: it begins a new path on pen and closes it, unfilled.
// e.g. floraRoundPetalPath(14, 7, 1.5); pen.fill();
function floraRoundPetalPath(long, wide, notch) {
  notch = notch || 0;
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.bezierCurveTo(-wide * 0.75, -long * 0.22, -wide * 1.15, -long * 0.82, -wide * 0.5, -long * 0.98);
  pen.quadraticCurveTo(-wide * 0.18, -long * 1.04, 0, -long + notch);
  pen.quadraticCurveTo(wide * 0.18, -long * 1.04, wide * 0.5, -long * 0.98);
  pen.bezierCurveTo(wide * 1.15, -long * 0.82, wide * 0.75, -long * 0.22, 0, 0);
  pen.closePath();
}

// The kit's shape() for a petal, with a lighter line: the ink of "colour" taken part of the way back toward the
// colour, and thinner, so that a small pale flower is not more line than petal.
// colour: "#rrggbb" (the ink is made from it); paint: a gradient or colour to fill with (colour when left out).
// Returns nothing: it fills and inks the path pen holds.
// e.g. floraRoundPetalPath(14, 7, 0); floraSoft("#fffdf4");
function floraSoft(colour, paint) {
  var p = parseInt(colour.slice(1), 16), red = (p >> 16) & 255, green = (p >> 8) & 255, blue = p & 255;
  pen.fillStyle = paint || colour;
  pen.fill();
  pen.strokeStyle = "rgb(" + Math.round(mix(red, 70, 0.62)) + ", " + Math.round(mix(green, 58, 0.62)) + ", " + Math.round(mix(blue, 40, 0.62)) + ")";
  pen.lineWidth = LINE * 0.6;
  pen.lineJoin = "round";
  pen.stroke();
}

// "count" rounded petals round (x, y), each "long" from the heart and "wide" across its half, coloured from
// "base" at the heart to "tip" at its end, with floraSoft()'s light line.
// x, y, long, wide, notch: pixels of the pen's frame; count: how many; turn: radians; base, tip: "#rrggbb".
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraPetalRing(0, -90, 5, 14, 7, 0.3, "#e0508a", "#f9c2d6", 1.5);
function floraPetalRing(x, y, count, long, wide, turn, base, tip, notch) {
  for (var n = 0; n < count; n++) {
    pen.save();
    pen.translate(x, y);
    pen.rotate(turn + n * Math.PI * 2 / count);
    floraRoundPetalPath(long, wide, notch);
    var fade = pen.createLinearGradient(0, 0, 0, -long);
    fade.addColorStop(0, base);
    fade.addColorStop(1, tip);
    floraSoft(tip, fade);
    pen.restore();
  }
}

// A curved twig or stalk through (x1, y1), (cx, cy), (x2, y2): the kit's hose, bent through a point.
// all: pixels of the pen's frame; width: pixels; colour: "#rrggbb". Returns nothing: it draws with pen.
// e.g. floraCurve(0, 0, 20, -60, 4, -110, 4, FLORA_TWIG);
function floraCurve(x1, y1, cx, cy, x2, y2, width, colour) {
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(x1, y1);
  pen.quadraticCurveTo(cx, cy, x2, y2);
  pen.strokeStyle = inkFor(colour);
  pen.lineWidth = width + LINE * 2;
  heavy(pen.strokeStyle);
  pen.stroke();
  light();
  pen.strokeStyle = colour;
  pen.lineWidth = width;
  pen.stroke();
}

// The point a share u of the way along the curve through (x1, y1), (cx, cy), (x2, y2), as floraCurve() draws it.
// Returns [x, y]. e.g. floraOnCurve(0, 0, 20, -60, 4, -110, 0.5)
function floraOnCurve(x1, y1, cx, cy, x2, y2, u) {
  var v = 1 - u;
  return [v * v * x1 + 2 * v * u * cx + u * u * x2, v * v * y1 + 2 * v * u * cy + u * u * y2];
}

// --- dok ueang phueng, the golden orchid ---

// Dok ueang phueng (ดอกเอื้องผึ้ง; Dendrobium lindleyi), the golden orchid of the northern forests that a Lanna
// woman tucks into her hair knot, and a spirit medium into her headdress: one flower is three narrow sepals and two
// broad petals of gold, and in front of them a round lip of deeper gold, downy, with an orange heart.
// x, y, r: pixels of the pen's frame; turn: radians. Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraUeangBloom(40, -100, 11, 0.2);
function floraUeangBloom(x, y, r, turn) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  [[0, 0.3], [2.25, 0.3], [-2.25, 0.3], [1.15, 0.46], [-1.15, 0.46]].forEach(function (part) {
    pen.save();
    pen.rotate(part[0]);
    floraRoundPetalPath(r, r * part[1], 0);
    var fade = pen.createLinearGradient(0, 0, 0, -r);
    fade.addColorStop(0, "#f4b818");
    fade.addColorStop(1, "#fde06a");
    floraSoft("#f8c81a", fade);
    pen.restore();
  });
  pen.save();                                       // the lip, round and a little notched
  pen.rotate(Math.PI);
  pen.translate(0, -r * 0.08);
  floraRoundPetalPath(r * 1.08, r * 0.78, r * 0.1);
  var lip = pen.createRadialGradient(0, -r * 0.3, r * 0.1, 0, -r * 0.5, r * 0.9);
  lip.addColorStop(0, "#ee9a12");
  lip.addColorStop(0.4, "#f6b81c");
  lip.addColorStop(1, "#fbd040");
  floraSoft("#f6b81c", lip);
  pen.strokeStyle = "rgba(214, 112, 16, 0.6)";     // its down, in fine strokes from the throat
  pen.lineWidth = 0.8;
  pen.beginPath();
  for (var n = -3; n <= 3; n++) {
    pen.moveTo(n * r * 0.05, -r * 0.12);
    pen.lineTo(n * r * 0.11, -r * 0.5);
  }
  pen.stroke();
  pen.restore();
  pen.beginPath();                                  // the column
  pen.ellipse(0, -r * 0.02, r * 0.16, r * 0.22, 0, 0, 7);
  floraSoft("#fbe68a");
  pen.restore();
}

// One pseudobulb of the golden orchid at its foot (x, y): a short spindle, ribbed, yellow-green, with one stiff
// leaf on top. x, y, tall: pixels; lean: radians. Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraUeangBulb(-10, 0, 40, -0.2);
function floraUeangBulb(x, y, tall, lean) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(lean);
  floraBlade(0, -tall * 0.9, tall * 0.85, tall * 0.2, lean * 1.6 + (lean < 0 ? -0.5 : 0.5), "#3c6e3a", "#86b65a", {sharp: 0.6, at: 0.5, veins: 0});
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.bezierCurveTo(-tall * 0.2, -tall * 0.2, -tall * 0.17, -tall * 0.75, 0, -tall);
  pen.bezierCurveTo(tall * 0.17, -tall * 0.75, tall * 0.2, -tall * 0.2, 0, 0);
  pen.closePath();
  var skin = pen.createLinearGradient(-tall * 0.2, 0, tall * 0.2, 0);
  skin.addColorStop(0, "#8e8a3a");
  skin.addColorStop(0.45, "#d2c466");
  skin.addColorStop(1, "#9a9442");
  floraPaint("#b8ac52", skin);
  pen.strokeStyle = "rgba(90, 80, 30, 0.6)";        // its ribs and the rings of its joints
  pen.lineWidth = 1;
  pen.beginPath();
  pen.moveTo(-tall * 0.06, -tall * 0.1);
  pen.quadraticCurveTo(-tall * 0.1, -tall * 0.5, -tall * 0.03, -tall * 0.9);
  pen.moveTo(tall * 0.06, -tall * 0.1);
  pen.quadraticCurveTo(tall * 0.1, -tall * 0.5, tall * 0.03, -tall * 0.9);
  pen.moveTo(-tall * 0.15, -tall * 0.35);
  pen.quadraticCurveTo(0, -tall * 0.31, tall * 0.15, -tall * 0.35);
  pen.moveTo(-tall * 0.13, -tall * 0.62);
  pen.quadraticCurveTo(0, -tall * 0.58, tall * 0.13, -tall * 0.62);
  pen.stroke();
  pen.restore();
}

// A spray of the golden orchid's flowers along the curve from (x1, y1) through (cx, cy) to (x2, y2): the flowers
// smaller toward its end, and two buds there. Drawn from its end back, so the big flowers lie in front.
// all: pixels of the pen's frame; count: how many flowers; r: the first flower's radius; seed: a number.
// Returns nothing: it draws with pen.
// e.g. floraUeangSpray(4, -40, 40, -130, 96, -60, 11, 11, 1);
function floraUeangSpray(x1, y1, cx, cy, x2, y2, count, r, seed) {
  var n, u, p;
  pen.lineCap = "round";
  pen.strokeStyle = "#8a9a3a";
  pen.lineWidth = 1.8;
  pen.beginPath();
  pen.moveTo(x1, y1);
  pen.quadraticCurveTo(cx, cy, x2, y2);
  pen.stroke();
  for (n = count + 1; n >= 0; n--) {
    u = 0.22 + n / (count + 1) * 0.78;
    p = floraOnCurve(x1, y1, cx, cy, x2, y2, u);
    if (n >= count) {
      floraBall(p[0] + 3, p[1] + 3, r * 0.3, "#e9c43a", false);
    } else {
      var side = n % 2 ? 1 : -1, size = r * (1 - n / count * 0.3);
      pen.strokeStyle = "#9aa848";
      pen.lineWidth = 1.2;
      pen.beginPath();
      pen.moveTo(p[0], p[1]);
      pen.lineTo(p[0] + side * size * 0.7, p[1] + size * 0.5);
      pen.stroke();
      floraUeangBloom(p[0] + side * size * 0.75, p[1] + size * 0.75, size, side * 0.25 + (dice(seed + n) - 0.5) * 0.4);
    }
  }
}

// FLORA.ueang.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a clump of four
// pseudobulbs with their silver roots, and an arching spray of eleven flowers. As it grows on a tree's trunk, give
// it ground: false there.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("ueang", 700, 900, {size: 1.5});
function floraUeang(look, seed) {
  [[-22, 8, 0.9], [-8, 14, 1.4], [14, 10, 1.9], [26, 6, 2.6]].forEach(function (root) {
    hose(root[0] * 0.5, -2, root[0], root[1], 0.3, 1.6, "#d8d2bc");
  });
  floraUeangBulb(-16, 0, 36, -0.32);
  floraUeangBulb(16, 0, 34, 0.36);
  floraUeangBulb(-4, 0, 44, -0.08);
  floraUeangBulb(6, 2, 40, 0.14);
  floraUeangSpray(2, -40, 56, -200, 100, -30, 9, 13, seed);
}

// FLORA.ueang.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0):
// the orchid on its bough, its spray hanging. seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "ueang", 1);
function floraUeangHang(seed) {
  floraUeangBulb(-6, 0, 26, -0.3);
  floraUeangBulb(6, 0, 30, 0.25);
  floraUeangSpray(0, 2, 40, 10, 22, 120, 7, 12, seed);
}

// --- sarapee ---

// Sarapee (ดอกสารภี; Mammea siamensis), whose scented blossom comes in the cool season and is worn in a woman's
// coiled hair: four cupped white petals round a ball of gold stamens.
// x, y, r: pixels of the pen's frame; turn: radians. Returns nothing: it draws with pen.
// e.g. floraSarapeeBloom(0, -60, 12, 0.3);
function floraSarapeeBloom(x, y, r, turn) {
  floraPetalRing(x, y, 4, r, r * 0.66, turn, "#e3e8c4", "#fffdf4", 0);
  var n, a, d;
  pen.strokeStyle = "#e3a21c";
  pen.lineWidth = 0.9;
  pen.beginPath();
  for (n = 0; n < 22; n++) {
    a = n * 2.4 + turn;
    d = r * (0.22 + dice(n + turn * 3) * 0.24);
    pen.moveTo(x, y);
    pen.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
  }
  pen.stroke();
  pen.fillStyle = "#f6bd22";
  for (n = 0; n < 22; n++) {
    a = n * 2.4 + turn;
    d = r * (0.22 + dice(n + turn * 3) * 0.24);
    pen.beginPath();
    pen.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.07 + 0.5, 0, 7);
    pen.fill();
  }
  pen.fillStyle = "#8ea044";
  pen.beginPath();
  pen.arc(x, y, r * 0.09 + 0.6, 0, 7);
  pen.fill();
}

// A cluster of sarapee on the bare wood at (x, y): flowers and round buds on short stalks.
// x, y: pixels of the pen's frame; seed: a number; count: how many (3 or 4 when left out).
// Returns nothing: it draws with pen.
// e.g. floraSarapeeCluster(2, -46, 1);
function floraSarapeeCluster(x, y, seed, count) {
  count = count || 3 + Math.floor(dice(seed) * 2);
  for (var n = 0; n < count + 2; n++) {
    var a = -Math.PI / 2 + (n - (count + 1) / 2) * 0.75 + (dice(seed + n) - 0.5) * 0.3, d = 13 + dice(seed + n + 4) * 6;
    var px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * 0.8;
    hose(x, y, px, py, 0.1, 1.2, "#8ea456");
    if (n < count) {
      floraSarapeeBloom(px, py, 11, seed + n);
    } else {
      pen.beginPath();
      pen.arc(px, py, 4.2, 0, 7);
      floraSoft("#f7f4e2");
    }
  }
}

// FLORA.sarapee.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a twig, its long
// thick leaves crowded at the tips, and the flowers in clusters on the bare wood below them.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("sarapee", 700, 900, {size: 1.5});
function floraSarapee(look, seed) {
  hose(0, 0, 8, -124, 0.04, 6, FLORA_TWIG);
  hose(4, -72, -42, -108, -0.12, 4, FLORA_TWIG);
  [-1.5, -0.9, -0.35, 0.25, 0.8, 1.4].forEach(function (turn) {
    floraBlade(8, -124, 60, 13, turn, "#265a3a", "#5f9a52", {at: 0.55, sharp: 0.6, veins: 0});
  });
  [-1.4, -0.75, -0.1, 0.5].forEach(function (turn) {
    floraBlade(-42, -108, 52, 12, turn, "#265a3a", "#5f9a52", {at: 0.55, sharp: 0.6, veins: 0});
  });
  floraSarapeeCluster(2, -40, seed);
  floraSarapeeCluster(6, -82, seed + 3);
  floraSarapeeCluster(-24, -92, seed + 6, 3);
}

// FLORA.sarapee.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "sarapee", 1);
function floraSarapeeHang(seed) {
  floraBlade(0, 0, 44, 10, 2.5, "#265a3a", "#5f9a52", {at: 0.55, sharp: 0.6, veins: 0});
  floraBlade(0, 0, 44, 10, -2.3, "#265a3a", "#5f9a52", {at: 0.55, sharp: 0.6, veins: 0});
  floraSarapeeCluster(0, 22, seed, 4);
}

// --- saban nga ---

// One long petal of saban nga, hanging from its foot at (0, 0) down to its tip "long" below, waving as it goes,
// yellow-green at the foot going to gold, with the maroon spot of a ripe flower inside its foot.
// long, wide: pixels; wave: pixels, the sign picks the side; colour: "#rrggbb", the gold at its tip.
// Returns nothing: it draws with pen.
// e.g. floraSabanngaPetal(44, 4, 3, "#e8cc3a");
function floraSabanngaPetal(long, wide, wave, colour) {
  var n, u, w, cx, left = [], right = [];
  for (n = 0; n <= 16; n++) {
    u = n / 16;
    w = wide * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + u * 0.92)), 0.7) * (1.05 - u * 0.35);
    cx = wave * Math.sin(u * Math.PI * 2.2) * Math.min(1, u * 2);
    left.push([cx - w, u * long]);
    right.push([cx + w, u * long]);
  }
  pen.beginPath();
  pen.moveTo(0, 0);
  for (n = 0; n <= 16; n++) { pen.lineTo(left[n][0], left[n][1]); }
  for (n = 16; n >= 0; n--) { pen.lineTo(right[n][0], right[n][1]); }
  pen.closePath();
  var fade = pen.createLinearGradient(0, 0, 0, long);
  fade.addColorStop(0, "#b8c450");
  fade.addColorStop(0.45, blend(colour, "#c8d050", 0.4));
  fade.addColorStop(1, colour);
  floraSoft(colour, fade);
  pen.fillStyle = "rgba(130, 34, 30, 0.75)";
  pen.beginPath();
  pen.ellipse(0, long * 0.1, wide * 0.55, long * 0.06, 0, 0, 7);
  pen.fill();
}

// One flower of saban nga (ดอกสะบันงา, ylang-ylang; Cananga odorata), which a Lanna woman offers at the temple and
// wears in her hair, and whose shape, a cup with long narrow petals hanging, the khom lanterns copy: six petals,
// twisted and waving, from a little green cup that hangs at (x, y).
// x, y: pixels of the pen's frame; long: the petals' length; turn: radians, 0 hanging straight down; colour:
// "#rrggbb", the gold of the petals' tips; seed: a number. Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraSabanngaBloom(20, -110, 44, 0.1, "#e8cc3a", 1);
function floraSabanngaBloom(x, y, long, turn, colour, seed) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  [-0.85, 0.75, -0.4, 0.35, -0.08, 0.12].forEach(function (a, n) {
    pen.save();
    pen.rotate(a * 0.9 + (dice(seed + n) - 0.5) * 0.15);
    floraSabanngaPetal(long * (0.86 + dice(seed + n + 7) * 0.2), long * 0.075, (n % 2 ? 1 : -1) * long * 0.06, colour);
    pen.restore();
  });
  [-0.9, 0, 0.9].forEach(function (a) {             // the cup's three green sepals
    pen.save();
    pen.rotate(Math.PI + a);
    floraRoundPetalPath(long * 0.12, long * 0.07, 0);
    floraSoft("#6f9a44");
    pen.restore();
  });
  pen.restore();
}

// FLORA.sabannga.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a branch that
// arches over, its leaves hanging, and three flowers hanging under it on their stalks.
// look: flora()'s look (look.colour is the gold of the petals); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("sabannga", 700, 900, {size: 1.5});
function floraSabannga(look, seed) {
  var colour = look.colour || "#e6c832";
  floraCurve(0, 0, 6, -80, -4, -130, 6, FLORA_TWIG);
  floraCurve(-4, -128, 30, -168, 76, -132, 4, FLORA_TWIG);
  [[-4, -96, -1.3], [2, -118, 1.1], [14, -146, -0.5], [30, -150, 0.6], [48, -148, 1.6], [64, -138, 2.2], [76, -132, 1.5]].forEach(function (leaf) {
    floraBlade(leaf[0], leaf[1], 52, 14, leaf[2], "#3a6e3e", "#86b862", {at: 0.4, sharp: 1.5, bow: 0.12, veins: 5});
  });
  [[8, -146, 18, 0.15], [40, -150, 26, -0.1], [-2, -118, 12, 0.35]].forEach(function (hang, n) {
    var end = [hang[0] + 4, hang[1] + hang[2]];
    hose(hang[0], hang[1], end[0], end[1], 0.2, 1.6, "#7a9a48");
    floraSabanngaBloom(end[0], end[1], 46 - n * 4, hang[3], colour, seed + n * 5);
  });
}

// FLORA.sabannga.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number; colour: "#rrggbb" or nothing. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "sabannga", 1);
function floraSabanngaHang(seed, colour) {
  floraBlade(0, 0, 46, 13, 2.2, "#3a6e3e", "#86b862", {at: 0.4, sharp: 1.5, bow: 0.12, veins: 4});
  floraBlade(0, 0, 46, 13, -2.0, "#3a6e3e", "#86b862", {at: 0.4, sharp: 1.5, bow: -0.12, veins: 4});
  hose(0, 0, -6, 14, 0.2, 1.6, "#7a9a48");
  hose(0, 0, 10, 10, -0.2, 1.6, "#7a9a48");
  floraSabanngaBloom(-6, 14, 40, 0.2, colour || "#e6c832", seed);
  floraSabanngaBloom(10, 10, 36, -0.25, colour || "#e6c832", seed + 4);
}

// --- ta hern, the white ginger lily ---

// One flower of ta hern (ดอกต๋าเหิน, the white ginger lily, maha hong; Hedychium coronarium), a scented hair flower of
// the north: like a white moth: two wings above, a broad lip cleft in two below, three thin petals hanging behind,
// and a long stamen standing from its heart. x, y, r: pixels of the pen's frame; turn: radians.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraTahernBloom(-20, -204, 20, -0.2);
function floraTahernBloom(x, y, r, turn) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  [Math.PI - 0.62, Math.PI + 0.62, Math.PI].forEach(function (a) {
    pen.save();
    pen.rotate(a);
    floraRoundPetalPath(r * 1.15, r * 0.13, 0);
    floraSoft("#eef0d6");
    pen.restore();
  });
  [-0.82, 0.82].forEach(function (a) {
    pen.save();
    pen.rotate(a);
    floraRoundPetalPath(r * 0.95, r * 0.42, 0);
    var fade = pen.createLinearGradient(0, 0, 0, -r);
    fade.addColorStop(0, "#f3f0d6");
    fade.addColorStop(1, "#fffef8");
    floraSoft("#fffef8", fade);
    pen.restore();
  });
  pen.save();                                       // the lip, cleft
  pen.rotate(Math.PI);
  floraRoundPetalPath(r * 1.05, r * 0.82, r * 0.34);
  var lip = pen.createLinearGradient(0, 0, 0, -r);
  lip.addColorStop(0, "#f4eeb6");
  lip.addColorStop(0.35, "#fffdf2");
  lip.addColorStop(1, "#fffef8");
  floraSoft("#fffef8", lip);
  pen.restore();
  pen.strokeStyle = "#f2ead0";                      // the stamen and its anther
  pen.lineWidth = 1.6;
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.quadraticCurveTo(r * 0.1, -r * 0.6, r * 0.04, -r * 1.05);
  pen.stroke();
  pen.beginPath();
  pen.ellipse(r * 0.04, -r * 1.1, r * 0.08, r * 0.16, 0, 0, 7);
  floraSoft("#e8c45a");
  pen.restore();
}

// FLORA.tahern.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a reed of a stem,
// long leaves turning out from it to each side in turn, and at its top a cone of green bracts with three flowers
// standing out of it on their tubes.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("tahern", 700, 900, {size: 1.5});
function floraTahern(look, seed) {
  var n;
  hose(0, 0, 4, -168, 0.02, 6, "#7c9c4c");
  for (n = 0; n < 6; n++) {
    var side = n % 2 ? 1 : -1, at = -26 - n * 25;
    floraBlade(side * 2, at, 76 - n * 4, 12, side * (0.95 - n * 0.06), "#2f6a40", "#7cb45a", {at: 0.4, sharp: 1.3, bow: side * 0.14, veins: 0});
  }
  for (n = 0; n < 7; n++) {                         // the cone of bracts, from its foot up
    pen.beginPath();
    pen.ellipse(4 + (n % 2 ? 4 : -4), -166 - n * 5.5, 8 - n * 0.6, 10, (n % 2 ? 0.3 : -0.3), 0, 7);
    shape(blend("#6f9a48", "#a8c46a", n / 7));
  }
  [[-24, -216, 21, -0.35, -10], [26, -210, 20, 0.4, 14], [2, -236, 19, 0.05, 6]].forEach(function (f) {
    hose(f[4], -190, f[0], f[1], 0.1, 2.4, "#f0eed8");
    floraTahernBloom(f[0], f[1], f[2], f[3]);
  });
}

// --- ket tha wa, the gardenia ---

// One double flower of ket tha wa (ดอกเก็ดถะหวา, the double gardenia, phut son), a white hair flower of the north:
// rings of round cream-white petals, each ring smaller and turned from the one under it, round a curled heart.
// x, y, r: pixels of the pen's frame; turn: radians. Returns nothing: it draws with pen.
// e.g. floraKettawaBloom(-18, -112, 26, 0.3);
function floraKettawaBloom(x, y, r, turn) {
  [[1, 6, 0.56], [0.74, 5, 0.6], [0.48, 4, 0.66]].forEach(function (ring, n) {
    floraPetalRing(x, y, ring[1], r * ring[0], r * ring[0] * ring[2], turn + n * 0.6, ["#e4dcb4", "#ece4c2", "#f2ead0"][n], "#fffef8", 0);
  });
  pen.strokeStyle = "rgba(170, 150, 90, 0.7)";
  pen.lineWidth = 1;
  pen.beginPath();
  pen.arc(x, y, r * 0.16, turn, turn + 4.6);
  pen.stroke();
}

// FLORA.kettawa.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a woody stem, glossy
// leaves in threes, two flowers and a bud, twisted shut in its green cup.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("kettawa", 700, 900, {size: 1.5});
function floraKettawa(look, seed) {
  hose(0, 0, 2, -96, 0.03, 5, "#6a6a4a");
  hose(2, -66, 28, -92, 0.15, 3.5, "#6a6a4a");
  hose(2, -88, 8, -128, 0.1, 3, "#6a6a4a");
  [[0, -36, -1.25], [0, -36, 1.2], [0, -36, 0.05], [2, -70, -1.0], [2, -70, 0.7], [26, -90, 1.6], [6, -120, -0.6]].forEach(function (leaf) {
    floraBlade(leaf[0], leaf[1], 44, 15, leaf[2], "#1f5a3a", "#4f9a52", {at: 0.5, sharp: 0.9, veins: 4});
  });
  pen.save();                                       // the bud, twisted shut
  pen.translate(8, -128);
  pen.rotate(0.15);
  pen.beginPath();
  pen.moveTo(-6, 0);
  pen.bezierCurveTo(-8, -12, -2, -22, 2, -28);
  pen.bezierCurveTo(6, -18, 8, -8, 6, 0);
  pen.closePath();
  shape("#f2f0d8");
  pen.strokeStyle = "rgba(150, 150, 90, 0.6)";
  pen.lineWidth = 1;
  pen.beginPath();
  pen.moveTo(-4, -2);
  pen.quadraticCurveTo(2, -12, 1, -24);
  pen.stroke();
  pen.beginPath();
  pen.ellipse(0, 0, 6, 4, 0, 0, 7);
  shape("#5f8a3e");
  pen.restore();
  floraKettawaBloom(30, -98, 22, 1.1);
  floraKettawaBloom(-16, -108, 27, 0.3);
}

// --- dok kaew, the orange jessamine ---

// One flower of dok kaew (ดอกแก้ว, the orange jessamine; Murraya paniculata): five narrow white petals bent back,
// round a little green heart. x, y, r: pixels of the pen's frame; turn: radians. Returns nothing: it draws with pen.
// e.g. floraDokkaewBloom(-6, -114, 9, 0.2);
function floraDokkaewBloom(x, y, r, turn) {
  floraPetalRing(x, y, 5, r, r * 0.34, turn, "#eef0d6", "#fffef6", 0);
  pen.fillStyle = "#c4cf5a";
  pen.beginPath();
  pen.arc(x, y, r * 0.2, 0, 7);
  pen.fill();
  pen.fillStyle = "#f0d260";
  for (var n = 0; n < 5; n++) {
    pen.beginPath();
    pen.arc(x + Math.cos(turn + n * 1.257 + 0.6) * r * 0.3, y + Math.sin(turn + n * 1.257 + 0.6) * r * 0.3, r * 0.07 + 0.4, 0, 7);
    pen.fill();
  }
}

// A leaf of leaflets: a stalk "long" from (x, y), turned by "turn", with leaflets in turn on its two sides and one
// at its tip. x, y, long, leaf, wide: pixels (leaf and wide are a leaflet's); turn: radians; pairs: how many on each
// side; deep, pale: "#rrggbb"; stalk: "#rrggbb", or the leaflets' deep colour. Returns nothing: it draws with pen.
// e.g. floraPinnate(-2, -40, 44, -1.1, 3, 18, 8, "#245c36", "#4e9a4c");
function floraPinnate(x, y, long, turn, pairs, leaf, wide, deep, pale, stalk) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  hose(0, 0, 0, -long, 0.04, 1.5, stalk || deep);
  for (var n = 0; n < pairs * 2; n++) {
    var side = n % 2 ? 1 : -1, at = -long * (0.22 + Math.floor(n / 2) * 0.72 / pairs + (side > 0 ? 0.06 : 0));
    floraBlade(0, at, leaf * (0.82 + n / pairs * 0.1), wide, side * 1.05, deep, pale, {at: 0.6, sharp: 0.9, veins: 0});
  }
  floraBlade(0, -long, leaf * 1.1, wide, 0, deep, pale, {at: 0.6, sharp: 0.9, veins: 0});
  pen.restore();
}

// A head of dok kaew at (x, y): flowers on fine stalks fanning out, and buds among them.
// x, y: pixels of the pen's frame; seed: a number. Returns nothing: it draws with pen.
// e.g. floraDokkaewHead(-6, -114, 1);
function floraDokkaewHead(x, y, seed) {
  var spots = [[-16, -6], [14, -8], [0, -18], [-6, 6], [20, 6], [-22, 8], [8, -2]];
  spots.forEach(function (s, n) {
    hose(x, y + 10, x + s[0], y + s[1], 0.1, 1, "#8aa456");
  });
  spots.forEach(function (s, n) {
    if (n > 4) {
      pen.beginPath();
      pen.arc(x + s[0], y + s[1], 3.4, 0, 7);
      floraSoft("#f4f2de");
    } else {
      floraDokkaewBloom(x + s[0], y + s[1], 9.5, seed + n * 0.7);
    }
  });
}

// FLORA.dokkaew.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a woody stem, leaves
// of small glossy leaflets, two heads of flowers and two red berries.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("dokkaew", 700, 900, {size: 1.5});
function floraDokkaew(look, seed) {
  hose(0, 0, -4, -104, 0.03, 5, "#7b6a52");
  hose(-2, -66, 30, -98, 0.12, 3.5, "#7b6a52");
  floraPinnate(-2, -34, 46, -1.15, 3, 17, 7, "#245c36", "#4e9a4c");
  floraPinnate(0, -52, 50, 1.05, 3, 17, 7, "#245c36", "#4e9a4c");
  floraPinnate(-4, -92, 40, -0.65, 2, 16, 7, "#245c36", "#4e9a4c");
  floraPinnate(28, -96, 40, 0.9, 2, 16, 7, "#245c36", "#4e9a4c");
  hose(14, -76, 20, -58, 0.2, 1.2, "#8aa456");
  hose(14, -76, 8, -56, -0.2, 1.2, "#8aa456");
  [[20, -54], [8, -52]].forEach(function (b) {
    pen.beginPath();
    pen.ellipse(b[0], b[1], 4.4, 6, 0.1, 0, 7);
    shape("#e2442a");
  });
  floraDokkaewHead(-6, -118, seed);
  floraDokkaewHead(32, -110, seed + 3);
}

// FLORA.dokkaew.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "dokkaew", 1);
function floraDokkaewHang(seed) {
  floraPinnate(0, 0, 38, 2.3, 2, 15, 7, "#245c36", "#4e9a4c");
  floraPinnate(0, 0, 38, -2.2, 2, 15, 7, "#245c36", "#4e9a4c");
  floraDokkaewHead(0, 4, seed);
}

// --- nang phaya suea khrong, the wild Himalayan cherry ---

// One open flower of nang phaya suea khrong (นางพญาเสือโคร่ง; Prunus cerasoides), the wild cherry of the high north
// that is pink on bare branches in the cold month: five round petals, deep at the heart and pale at their rims, a
// crimson eye and a ring of fine stamens. x, y, r: pixels of the pen's frame; turn: radians; colour: "#rrggbb".
// Returns nothing: it draws with pen.
// e.g. floraSueaBloom(-6, -62, 13, 0.4, "#ec6c9c");
function floraSueaBloom(x, y, r, turn, colour) {
  floraPetalRing(x, y, 5, r, r * 0.52, turn, blend(colour, "#a01848", 0.3), blend(colour, "#ffffff", 0.5), r * 0.12);
  pen.fillStyle = "#a01848";
  pen.beginPath();
  pen.arc(x, y, r * 0.24, 0, 7);
  pen.fill();
  pen.strokeStyle = blend(colour, "#ffffff", 0.6);
  pen.lineWidth = 0.8;
  pen.beginPath();
  for (var n = 0; n < 14; n++) {
    var a = turn + n * 0.449;
    pen.moveTo(x + Math.cos(a) * r * 0.15, y + Math.sin(a) * r * 0.15);
    pen.lineTo(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55);
  }
  pen.stroke();
  pen.fillStyle = "#f4d36a";
  for (n = 0; n < 14; n++) {
    a = turn + n * 0.449;
    pen.beginPath();
    pen.arc(x + Math.cos(a) * r * 0.57, y + Math.sin(a) * r * 0.57, r * 0.06 + 0.4, 0, 7);
    pen.fill();
  }
}

// One flower of it seen from the side, nodding on its red stalk from (x, y): a cup of petals in its crimson calyx.
// x, y: where its stalk leaves the twig, pixels of the pen's frame; r: its size; turn: radians, 0 hanging straight
// down; colour: "#rrggbb". Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraSueaNod(10, -108, 12, 0.3, "#ec6c9c");
function floraSueaNod(x, y, r, turn, colour) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.strokeStyle = "#a8485a";
  pen.lineWidth = 1.4;
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.quadraticCurveTo(r * 0.2, r * 0.7, 0, r * 1.3);
  pen.stroke();
  pen.translate(0, r * 1.3);
  [-0.55, 0.55, 0].forEach(function (a, n) {
    pen.save();
    pen.rotate(Math.PI + a);
    floraRoundPetalPath(r * 1.05, r * 0.5, r * 0.1);
    var fade = pen.createLinearGradient(0, 0, 0, -r);
    fade.addColorStop(0, blend(colour, "#a01848", 0.3));
    fade.addColorStop(1, blend(colour, "#ffffff", 0.45));
    floraSoft(colour, fade);
    pen.restore();
  });
  pen.beginPath();                                  // the calyx
  pen.ellipse(0, 1, r * 0.3, r * 0.22, 0, 0, 7);
  floraSoft("#b8405a");
  pen.restore();
}

// FLORA.phayasuea.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a bare twig, dark
// red-brown with the pale marks of its bark, and its pink flowers at the joints, open, nodding and in bud.
// look: flora()'s look (look.colour is the flowers' pink); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("phayasuea", 700, 900, {size: 1.5});
function floraPhayasuea(look, seed) {
  var colour = look.colour || "#ec6c9c", bark = "#5a2f2a";
  var twigs = [[0, 0, -6, -62, 5], [-6, -62, 10, -110, 4], [10, -110, -2, -152, 3], [-6, -62, -48, -96, 3], [10, -110, 46, -134, 3]];
  twigs.forEach(function (t) { hose(t[0], t[1], t[2], t[3], 0.06, t[4], bark); });
  pen.strokeStyle = "rgba(220, 190, 170, 0.7)";     // the pale marks across its bark
  pen.lineWidth = 1;
  pen.beginPath();
  twigs.forEach(function (t) {
    for (var u = 0.2; u < 0.9; u += 0.3) {
      var mx = mix(t[0], t[2], u), my = mix(t[1], t[3], u);
      pen.moveTo(mx - t[4] * 0.4, my);
      pen.lineTo(mx + t[4] * 0.4, my);
    }
  });
  pen.stroke();
  floraSueaNod(-6, -62, 11, 0.5, colour);
  floraSueaNod(10, -110, 11, -0.4, colour);
  floraSueaNod(-48, -96, 10, 0.2, colour);
  [[-6, -64, 14, 0.2], [-20, -76, 12, 1.0], [10, -112, 14, 0.7], [24, -120, 12, 1.4], [-2, -154, 13, 0.1], [-48, -98, 13, 0.5],
   [46, -136, 13, 0.9], [-34, -88, 11, 1.7]].forEach(function (f) { floraSueaBloom(f[0], f[1], f[2], f[3], colour); });
  [[-14, -160], [8, -150], [54, -142]].forEach(function (b) { floraBall(b[0], b[1], 4.2, blend(colour, "#a01848", 0.45)); });
}

// FLORA.phayasuea.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number; colour: "#rrggbb" or nothing. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "phayasuea", 1);
function floraPhayasueaHang(seed, colour) {
  colour = colour || "#ec6c9c";
  hose(-20, -4, 24, 6, 0.1, 3, "#5a2f2a");
  floraSueaNod(-6, 0, 10, 0.3, colour);
  floraSueaBloom(-14, 6, 13, seed, colour);
  floraSueaBloom(8, 8, 13, seed + 1, colour);
  floraSueaBloom(22, -2, 11, seed + 2, colour);
}

// --- bua tong ---

// One head of bua tong (บัวตอง, the wild sunflower; Tithonia diversifolia), gold over the hills of Mae Hong Son from
// November to January: a ring of broad gold rays with notched tips round a domed orange-brown heart.
// x, y, r: pixels of the pen's frame; squash: 1 seen from the front, less as it turns away; turn: radians.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraBuatongHead(-10, -160, 28, 1, 0);
function floraBuatongHead(x, y, r, squash, turn) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(1, squash);
  pen.beginPath();                                  // the green cup behind
  pen.arc(0, 0, r * 0.42, 0, 7);
  shape("#5f8a3e");
  for (var layer = 0; layer < 2; layer++) {
    for (var n = 0; n < 7; n++) {
      pen.save();
      pen.rotate(n / 7 * Math.PI * 2 + layer * 0.45);
      floraRoundPetalPath(r * (layer ? 0.95 : 1), r * 0.24, r * 0.09);
      var fade = pen.createLinearGradient(0, 0, 0, -r);
      fade.addColorStop(0, layer ? "#f39a12" : "#e48a10");
      fade.addColorStop(0.5, "#fbbd1a");
      fade.addColorStop(1, layer ? "#fdd040" : "#f7b81c");
      floraPaint("#f9b912", fade);
      pen.restore();
    }
  }
  pen.beginPath();
  pen.arc(0, 0, r * 0.34, 0, 7);
  var disc = pen.createRadialGradient(-r * 0.1, -r * 0.12, r * 0.04, 0, 0, r * 0.36);
  disc.addColorStop(0, "#e8a432");
  disc.addColorStop(1, "#9a5418");
  floraPaint("#c8781c", disc);
  for (n = 0; n < 40; n++) {                        // its florets, in the spiral of a sunflower's
    var d = r * 0.32 * Math.sqrt(n / 40), a = n * 2.4;
    pen.fillStyle = n > 26 ? "#f4c24a" : "#6e3810";
    pen.beginPath();
    pen.arc(Math.cos(a) * d, Math.sin(a) * d, r * 0.028 + 0.4, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// A lobed leaf from (x, y): a long middle lobe and a shorter one to each side, as bua tong's are.
// x, y, long: pixels of the pen's frame; turn: radians. Returns nothing: it draws with pen.
// e.g. floraLobedLeaf(0, -30, 44, -1.2);
function floraLobedLeaf(x, y, long, turn) {
  floraBlade(x, y, long * 0.66, long * 0.2, turn - 0.62, "#3a723a", "#80b45c", {sharp: 1.1, veins: 2});
  floraBlade(x, y, long * 0.66, long * 0.2, turn + 0.62, "#3a723a", "#80b45c", {sharp: 1.1, veins: 2});
  floraBlade(x, y, long, long * 0.24, turn, "#3a723a", "#80b45c", {sharp: 1.1, veins: 4});
}

// FLORA.buatong.draw: flora() calls it with the pen moved to the foot and scaled by look.size: three stems, a head
// facing out, one turned aside and a bud, over lobed leaves; each stem swells under its head.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("buatong", 700, 900, {size: 1.5});
function floraBuatong(look, seed) {
  floraCurve(0, 0, -4, -90, -10, -150, 4, "#6f9a4a");
  floraCurve(0, -40, 30, -70, 44, -112, 3.5, "#6f9a4a");
  floraCurve(-2, -62, -30, -78, -42, -100, 3, "#6f9a4a");
  floraLobedLeaf(0, -26, 46, -1.25);
  floraLobedLeaf(0, -44, 44, 1.2);
  floraLobedLeaf(-4, -96, 36, -0.85);
  floraLobedLeaf(20, -66, 32, 1.0);
  [[-10, -150], [44, -112]].forEach(function (s) {  // the stalk thickens under the head
    pen.beginPath();
    pen.ellipse(s[0], s[1] - 2, 4, 7, 0, 0, 7);
    shape("#7aa44e");
  });
  pen.save();                                       // the bud: green, gold showing at its top
  pen.translate(-42, -102);
  pen.rotate(-0.5);
  pen.beginPath();
  pen.ellipse(0, -8, 6.5, 5.5, 0, 0, 7);
  shape("#f5b416");
  [-0.9, -0.3, 0.3, 0.9].forEach(function (a) {     // its green bracts
    pen.save();
    pen.rotate(a);
    floraRoundPetalPath(10, 3.6, 0);
    shape("#6a9a46");
    pen.restore();
  });
  pen.restore();
  floraBuatongHead(44, -118, 22, 0.62, 0.4);
  floraBuatongHead(-10, -162, 28, 1, seed * 0.1);
}

// --- teak ---

// A spray of teak's flowers, standing up from (x, y): a stalk that branches and branches again, a crowd of tiny
// white flowers and green buds at its ends. x, y, tall: pixels of the pen's frame; seed: a number.
// Returns nothing: it draws with pen.
// e.g. floraTeakSpray(0, -128, 100, 1);
function floraTeakSpray(x, y, tall, seed) {
  var tips = [], n, m;
  floraCurve(x, y, x + 2, y - tall * 0.5, x, y - tall, 2.2, "#b0ae80");
  for (n = 0; n < 6; n++) {
    var u = 0.16 + n * 0.15, side = n % 2 ? 1 : -1, sy = y - tall * u, reach = tall * (0.5 - u * 0.35);
    var ex = x + side * reach, ey = sy - reach * 0.45;
    floraCurve(x, sy, x + side * reach * 0.5, sy - reach * 0.05, ex, ey, 1.4, "#a8a676");
    for (m = 0; m < 3; m++) {
      var fx = mix(x, ex, 0.55 + m * 0.2) + side * 4, fy = mix(sy, ey, 0.55 + m * 0.2) - 6 - dice(seed + n * 4 + m) * 8;
      floraCurve(mix(x, ex, 0.5 + m * 0.2), mix(sy, ey, 0.5 + m * 0.2), fx - side * 2, fy + 3, fx, fy, 1, "#a8a676");
      tips.push([fx, fy]);
    }
    tips.push([ex, ey]);
  }
  tips.push([x, y - tall]);
  tips.forEach(function (t, k) {
    for (m = 0; m < 4; m++) {
      var a = dice(seed + k * 5 + m) * Math.PI * 2, d = 3 + dice(seed + k * 3 + m) * 5, px = t[0] + Math.cos(a) * d, py = t[1] + Math.sin(a) * d;
      pen.beginPath();
      pen.arc(px, py, (k + m) % 3 ? 3.4 : 2, 0, 7);
      floraSoft((k + m) % 3 ? "#fbf8ec" : "#cfd49a");
      if ((k + m) % 3) {
        pen.fillStyle = "#e2c86a";
        pen.beginPath();
        pen.arc(px, py, 1.1, 0, 7);
        pen.fill();
      }
    }
  });
}

// FLORA.teak.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a young stem of teak
// (สัก, sak; Tectona grandis), the timber of the Lanna house, the sueng and the forests of Lampang and Phrae: its huge
// rough leaves in pairs, and the spray of tiny white flowers it holds above them in the rains.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("teak", 700, 900, {size: 1.5});
function floraTeak(look, seed) {
  var big = {at: 0.5, sharp: 0.75, veins: 8};
  hose(0, 0, 0, -132, 0.02, 7, "#8a8a5a");
  floraBlade(0, -52, 92, 40, -1.55, "#4f7d36", "#94b85e", big);
  floraBlade(0, -56, 88, 38, 1.6, "#4a7632", "#8fb35a", big);
  floraTeakSpray(0, -128, 104, seed);
  floraBlade(0, -104, 70, 30, -1.1, "#55843a", "#9cc064", big);
  floraBlade(0, -108, 66, 28, 1.15, "#55843a", "#9cc064", big);
}

// FLORA.teak.hang: floraTree() calls it with the pen moved to a point of the tree: a spray of flowers standing up
// from a pair of leaves. seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "teak", 1);
function floraTeakHang(seed) {
  floraTeakSpray(0, 0, 70, seed);
  floraBlade(0, 0, 54, 24, -1.8, "#4f7d36", "#94b85e", {at: 0.5, sharp: 0.75, veins: 6});
  floraBlade(0, 0, 54, 24, 1.8, "#4f7d36", "#94b85e", {at: 0.5, sharp: 0.75, veins: 6});
}

// --- som poi ---

// A leaf of som poi: a stalk "long" from (x, y), turned by "turn", with "pairs" pairs of feathers, each a fine comb
// of tiny leaflets. x, y, long: pixels of the pen's frame; turn: radians; pairs: a whole number.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraFeatherLeaf(8, -60, 70, 1.1, 5);
function floraFeatherLeaf(x, y, long, turn, pairs) {
  var n, m, side;
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.strokeStyle = "#6a7a3a";
  pen.lineWidth = 1.4;
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.lineTo(0, -long);
  pen.stroke();
  for (n = 0; n < pairs; n++) {
    for (side = -1; side <= 1; side += 2) {
      var py = -long * (0.25 + n * 0.75 / pairs), pl = long * 0.34 * (1 - n * 0.06), a = side * 1.1;
      pen.save();
      pen.translate(0, py);
      pen.rotate(a);
      pen.strokeStyle = "#6a7a3a";
      pen.lineWidth = 0.8;
      pen.beginPath();
      pen.moveTo(0, 0);
      pen.lineTo(0, -pl);
      pen.stroke();
      pen.beginPath();
      for (m = 1; m <= 11; m++) {
        var ly = -pl * m / 11.5;
        pen.moveTo(0, ly);
        pen.ellipse(-2.6, ly - 1.2, 2.8, 1.1, -0.5, 0, 7);
        pen.moveTo(0, ly);
        pen.ellipse(2.6, ly - 1.2, 2.8, 1.1, 0.5, 0, 7);
      }
      pen.fillStyle = (n + side) % 2 ? "#5f9a48" : "#4a8640";
      pen.fill();
      pen.strokeStyle = "rgba(28, 58, 36, 0.5)";
      pen.lineWidth = 0.5;
      pen.stroke();
      pen.restore();
    }
  }
  pen.restore();
}

// A pod of som poi hanging from (x, y): flat, brown, wrinkled, pinched between its seeds, with a beak at its end.
// x, y, long, wide: pixels of the pen's frame; turn: radians, 0 hanging straight down; seeds: how many.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraSompoiPod(-4, -118, 70, 7, 0.2, 7);
function floraSompoiPod(x, y, long, wide, turn, seeds) {
  var n, u, w, bend, left = [], right = [];
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  for (n = 0; n <= 40; n++) {
    u = n / 40;
    w = wide * (0.72 + 0.28 * Math.abs(Math.cos(u * seeds * Math.PI))) * Math.pow(Math.sin(Math.PI * Math.min(1, 0.06 + u * 0.97)), 0.35);
    bend = Math.sin(u * Math.PI * 0.9) * long * 0.1;
    left.push([bend - w, u * long]);
    right.push([bend + w, u * long]);
  }
  pen.beginPath();
  pen.moveTo(0, 0);
  for (n = 0; n <= 40; n++) { pen.lineTo(left[n][0], left[n][1]); }
  pen.lineTo(left[40][0] + wide * 0.6, long + 6);      // the beak
  for (n = 40; n >= 0; n--) { pen.lineTo(right[n][0], right[n][1]); }
  pen.closePath();
  var skin = pen.createLinearGradient(-wide, 0, wide, 0);
  skin.addColorStop(0, "#7a5230");
  skin.addColorStop(0.5, "#b8864a");
  skin.addColorStop(1, "#8a5c34");
  floraPaint("#8a5a34", skin);
  for (n = 0; n < seeds; n++) {                     // a seed under the skin, and a wrinkle beside it
    u = (n + 0.5) / seeds;
    bend = Math.sin(u * Math.PI * 0.9) * long * 0.1;
    pen.fillStyle = "rgba(70, 40, 20, 0.35)";
    pen.beginPath();
    pen.ellipse(bend, u * long, wide * 0.45, long / seeds * 0.32, 0, 0, 7);
    pen.fill();
    pen.fillStyle = "rgba(240, 210, 160, 0.35)";
    pen.beginPath();
    pen.ellipse(bend - wide * 0.15, u * long - 2, wide * 0.18, long / seeds * 0.12, 0, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// FLORA.sompoi.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a sprig of som poi
// (ส้มป่อย; Acacia concinna), the plant that washes ill luck away in Lanna: the water its pods are steeped in, nam som
// poi, is sprinkled at blessings and rites of passage, and washes the hair. A thorny zigzag stem, feathery leaves,
// three dry pods hanging and two pale flower balls.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("sompoi", 700, 900, {size: 1.5});
function floraSompoi(look, seed) {
  var stem = [[0, 0], [8, -58], [-4, -116], [10, -160]], n, k;
  for (n = 0; n < 3; n++) {
    hose(stem[n][0], stem[n][1], stem[n + 1][0], stem[n + 1][1], 0.04, 4, "#7a6a3a");
    for (k = 1; k < 4; k++) {                       // its hooked thorns
      var px = mix(stem[n][0], stem[n + 1][0], k / 4), py = mix(stem[n][1], stem[n + 1][1], k / 4), side = k % 2 ? 1 : -1;
      pen.beginPath();
      pen.moveTo(px + side * 2, py - 3);
      pen.quadraticCurveTo(px + side * 7, py - 2, px + side * 8, py + 3);
      pen.lineTo(px + side * 2, py + 2);
      pen.closePath();
      pen.fillStyle = "#4f3a20";
      pen.fill();
    }
  }
  floraFeatherLeaf(8, -58, 72, 1.15, 5);
  floraFeatherLeaf(-4, -116, 66, -1.05, 5);
  floraFeatherLeaf(10, -160, 58, 0.35, 4);
  floraFeatherLeaf(4, -30, 54, -1.0, 4);
  floraSompoiPod(-4, -116, 78, 7.5, 0.4, 8);
  floraSompoiPod(6, -60, 70, 7, -0.4, 7);
  floraSompoiPod(9, -152, 64, 7, -0.5, 6);
  [[16, -166], [24, -152]].forEach(function (b, m) {   // the flower balls, pale yellow, of fine threads
    hose(10, -158, b[0], b[1], 0.1, 1, "#8a9a4a");
    pen.fillStyle = "#e8d27a";
    pen.beginPath();
    pen.arc(b[0], b[1], 4.5, 0, 7);
    pen.fill();
    pen.lineWidth = 0.8;
    for (k = 0; k < 30; k++) {                      // a ball of fine threads, each tipped with pollen
      var ta = k * 2.4 + m, tl = 6 + dice(k + m * 9) * 3;
      pen.strokeStyle = "#f4e6a6";
      pen.beginPath();
      pen.moveTo(b[0], b[1]);
      pen.lineTo(b[0] + Math.cos(ta) * tl, b[1] + Math.sin(ta) * tl);
      pen.stroke();
      pen.fillStyle = "#f0d060";
      pen.beginPath();
      pen.arc(b[0] + Math.cos(ta) * tl, b[1] + Math.sin(ta) * tl, 0.9, 0, 7);
      pen.fill();
    }
  });
}

// --- sugarcane ---

// A long ribbon of a leaf, from its foot at (x, y), rising at "turn" and drooping as it goes: narrow at its foot,
// widest a third of the way along, to a point; a pale rib down its middle.
// x, y, long, wide: pixels of the pen's frame; turn: radians, 0 straight up; droop: a share of long the tip falls;
// deep, pale: "#rrggbb". Returns nothing: it draws with pen.
// e.g. floraRibbon(0, -300, 150, 7, -0.6, 0.7, "#4f8a3a", "#a8cc6a");
function floraRibbon(x, y, long, wide, turn, droop, deep, pale) {
  var n, u, p, q, nx, ny, w, len, left = [], right = [], mid = [];
  var cx = x + Math.sin(turn) * long * 0.6, cy = y - Math.cos(turn) * long * 0.6;
  var ex = cx + Math.sin(turn) * long * 0.45, ey = cy - Math.cos(turn) * long * 0.45 + droop * long;
  for (n = 0; n <= 20; n++) {
    u = n / 20;
    p = floraOnCurve(x, y, cx, cy, ex, ey, u);
    q = floraOnCurve(x, y, cx, cy, ex, ey, Math.min(1, u + 0.01));
    nx = -(q[1] - p[1]);
    ny = q[0] - p[0];
    len = Math.sqrt(nx * nx + ny * ny) || 1;
    w = wide * (u < 0.3 ? 0.45 + 0.55 * u / 0.3 : Math.pow((1 - u) / 0.7, 0.8));
    left.push([p[0] + nx / len * w, p[1] + ny / len * w]);
    right.push([p[0] - nx / len * w, p[1] - ny / len * w]);
    mid.push(p);
  }
  pen.beginPath();
  pen.moveTo(left[0][0], left[0][1]);
  for (n = 1; n <= 20; n++) { pen.lineTo(left[n][0], left[n][1]); }
  for (n = 20; n >= 0; n--) { pen.lineTo(right[n][0], right[n][1]); }
  pen.closePath();
  var fade = pen.createLinearGradient(x, y, ex, ey);
  fade.addColorStop(0, deep);
  fade.addColorStop(1, pale);
  pen.fillStyle = fade;
  pen.fill();
  pen.strokeStyle = FLORA_LINE;
  pen.lineWidth = Math.max(0.8, LINE * 0.5);
  pen.lineJoin = "round";
  pen.stroke();
  pen.strokeStyle = "rgba(236, 240, 205, 0.75)";
  pen.lineWidth = 1;
  pen.beginPath();
  pen.moveTo(mid[0][0], mid[0][1]);
  for (n = 1; n < 19; n++) { pen.lineTo(mid[n][0], mid[n][1]); }
  pen.stroke();
}

// One stalk of sugarcane standing from (x, 0): joint above joint, shorter toward the top, each a little barrel
// that leans a touch from the one below, in its colour with a blush of red and the waxy white ring under its node, a
// bud at alternate nodes and the dots of the root band at the low ones; a fountain of long leaves from its top
// joints, and dry leaves hanging from the lower ones.
// x: pixels of the pen's frame; tall: pixels; lean: how far its top is to the side, as a share of tall; colour:
// "#rrggbb"; seed: a number. Returns nothing: it draws with pen.
// e.g. floraCaneStalk(-18, 400, -0.04, "#b8b04c", 1);
function floraCaneStalk(x, tall, lean, colour, seed) {
  var y = 0, n = 0, w, len, top, joints = [], bx = x, tx, k;
  while (y > -tall + 40) {
    len = mix(30, 18, -y / tall) + dice(seed + n) * 6;
    top = y - len;
    w = mix(7.5, 5.5, -y / tall);
    tx = bx + lean * len + (n % 2 ? 1.2 : -1.2);
    var tint = blend(colour, "#8a3a4a", dice(seed + n * 3) * 0.35);
    pen.beginPath();
    pen.moveTo(bx - w, y);
    pen.quadraticCurveTo((bx + tx) / 2 - w - 1.8, y - len / 2, tx - w, top);
    pen.lineTo(tx + w, top);
    pen.quadraticCurveTo((bx + tx) / 2 + w + 1.8, y - len / 2, bx + w, y);
    pen.closePath();
    var skin = pen.createLinearGradient(bx - w, 0, bx + w, 0);
    skin.addColorStop(0, blend(tint, "#3a2a1a", 0.35));
    skin.addColorStop(0.35, blend(tint, "#fff8e0", 0.25));
    skin.addColorStop(1, blend(tint, "#3a2a1a", 0.22));
    floraPaint(tint, skin);
    pen.fillStyle = "rgba(244, 240, 226, 0.75)";    // the waxy ring under the node
    pen.beginPath();
    pen.ellipse(tx, top + 4, w - 0.5, 2, 0, 0, 7);
    pen.fill();
    pen.beginPath();                                // the node, a little swollen
    pen.ellipse(tx, top, w + 1.6, 2.4, 0, 0, 7);
    shape(blend(tint, "#4a3020", 0.35));
    if (n < 4) {                                    // the root band's dots, low down
      pen.fillStyle = "rgba(90, 60, 40, 0.55)";
      for (k = -2; k <= 2; k++) {
        pen.beginPath();
        pen.arc(tx + k * w * 0.35, top - 4, 0.9, 0, 7);
        pen.fill();
      }
    }
    if (n % 2 === 0) {
      pen.beginPath();
      pen.ellipse(tx + (n % 4 ? -w : w) * 0.55, top - 5, 2.6, 4, 0, 0, 7);
      shape(blend(colour, "#7a8a3a", 0.5));
    }
    joints.push([tx, top]);
    bx = tx;
    y = top;
    n++;
  }
  [2, 4].forEach(function (j, m) {                  // dry leaves hanging from low joints
    if (joints[j]) { floraRibbon(joints[j][0], joints[j][1], 80, 5, (m ? 1 : -1) * 1.0, 1.3, "#a08a58", "#d8c690"); }
  });
  var crown = joints[joints.length - 1];
  for (k = 0; k < 4; k++) {                         // the sheaths that wrap its top
    var sj = joints[joints.length - 1 - k] || crown;
    floraRibbon(sj[0], sj[1], 26, 5, (k % 2 ? 0.12 : -0.12), 0, blend(colour, "#4a7a36", 0.6), "#8ab45a");
  }
  for (k = 0; k < 9; k++) {                         // a fountain of leaves from its top
    var side = k % 2 ? 1 : -1, spread = Math.floor(k / 2) / 4;
    floraRibbon(crown[0], crown[1] + k * 3, 120 + dice(seed + k * 3) * 70, 5.5, side * (0.15 + spread * 1.1), 0.25 + spread * 0.9,
                k % 3 ? "#3f7a36" : "#4f8a3a", k % 3 ? "#9cc464" : "#b8d478");
  }
}

// FLORA.sugarcane.draw: flora() calls it with the pen moved to the foot and scaled by look.size: three stalks of
// sugarcane (อ้อย, oi), which Lanna ties up beside banana trunks to make the forest gate (sum pratu pa) of Yi Peng
// and the great sermon, and lashes round a ceremony's ground.
// look: flora()'s look (look.colour is the stalks' colour, yellow-green unless told: "#7a3048" is red cane);
// seed: a number (flora() passes x * 0.013). Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("sugarcane", 700, 900, {size: 1.5});
function floraSugarcane(look, seed) {
  var colour = look.colour || "#b8b04c";
  floraCaneStalk(-20, 380, -0.06, blend(colour, "#5a4a2a", 0.12), seed);
  floraCaneStalk(24, 350, 0.07, blend(colour, "#5a4a2a", 0.08), seed + 5);
  floraCaneStalk(2, 420, 0.01, colour, seed + 9);
}

// --- pho, the bodhi ---

// FLORA.pho.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a twig of pho (โพธิ์, the
// bodhi tree; Ficus religiosa), its heart-shaped leaves with their long drip tips on long stalks, so that they
// tremble, one young leaf still bronze. Gold leaves (colour "#e3b341") are the golden bodhi of the tale of Tao Noi
// Ong Kham, which grew from the buried bones of the mother turtle at the city's gate.
// look: flora()'s look (look.colour is the leaves'); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("pho", 700, 900, {size: 1.5, colour: "#e3b341"});
function floraPho(look, seed) {
  var leaf = floraPhoColours(look.colour), bark = look.colour ? blend(look.colour, "#6a5030", 0.45) : "#8b8174";
  floraCurve(0, 0, 4, -60, -4, -112, 5, bark);
  floraCurve(2, -60, 26, -78, 44, -96, 3.5, bark);
  floraCurve(-2, -86, -26, -102, -40, -112, 3, bark);
  [[-4, -112, 0.1, 28], [44, -96, 0.9, 24], [-40, -112, -0.7, 22], [16, -74, 1.9, 26], [-2, -86, -2.1, 26], [30, -86, 0.2, 20]].forEach(function (l, n) {
    var tx = l[0] + Math.sin(l[2]) * l[3], ty = l[1] - Math.cos(l[2]) * l[3];
    hose(l[0], l[1], tx, ty, 0.12, 1.4, leaf.stalk);
    if (n === 5 && !look.colour) {
      floraHeart(tx, ty, 42, 19, l[2] + 0.1, "#a8524a", "#eaa890", 0.32, true, "rgba(255, 220, 200, 0.6)");   // a young leaf, bronze-pink
    } else {
      floraHeart(tx, ty, 58, 30, l[2] + (dice(seed + n) - 0.5) * 0.5, leaf.deep, leaf.pale, 0.3, true, leaf.vein);
    }
  });
}

// The colours of a bodhi leaf: green, or of the colour told (gold for the golden bodhi).
// colour: "#rrggbb" or nothing. Returns {deep, pale, shade, vein, stalk}. e.g. floraPhoColours("#e3b341")
function floraPhoColours(colour) {
  if (!colour) { return {deep: "#2a6236", pale: "#7ab65a", shade: "#163a22", vein: "rgba(230, 240, 180, 0.6)", stalk: "#9a9a5a"}; }
  return {deep: blend(colour, "#6a4210", 0.4), pale: blend(colour, "#fff6c8", 0.45), shade: blend(colour, "#3a2408", 0.6),
          vein: "rgba(255, 246, 200, 0.85)", stalk: blend(colour, "#6a4a20", 0.3)};
}

// FLORA.pho.hang: three bodhi leaves hanging on their stalks from (0, 0). seed: a number; colour: "#rrggbb" or
// nothing. Returns nothing: it draws with pen.
// e.g. floraPhoHang(1, "#e3b341");
function floraPhoHang(seed, colour) {
  var leaf = floraPhoColours(colour);
  [[-0.5, 26], [0.15, 30], [0.75, 22]].forEach(function (l, n) {
    var tx = Math.sin(Math.PI + l[0]) * l[1], ty = -Math.cos(Math.PI + l[0]) * l[1];
    hose(0, 0, tx, ty, 0.15, 1.4, leaf.stalk);
    floraHeart(tx, ty, 50, 26, Math.PI + l[0] * 1.2 + (dice(seed + n) - 0.5) * 0.4, leaf.deep, leaf.pale, 0.3, true, leaf.vein);
  });
}

// A bodhi tree: a fluted grey trunk on spreading roots, boughs that reach out wide, and a broad dome of heart-shaped
// leaves on their trembling stalks, the edge leaves hanging. Gold ("#e3b341") is the golden bodhi of the tale of
// Tao Noi Ong Kham, trunk and all. Drawn with the pen at (x, base), scaled by size.
// x, base: its foot, pixels of the pen's frame; size: 1 is about 470 tall and 520 across; seed: a number; colour:
// "#rrggbb" or nothing. Returns nothing: it draws with pen, and leaves pen as it found it. floraTree(brush, ...,
// "pho") calls it with pen pointed at the brush.
// e.g. floraTree(pen, 300, 900, 1, "pho", 2, "#e3b341");
function floraPhoTree(x, base, size, seed, colour) {
  var leaf = floraPhoColours(colour), bark = colour ? blend(colour, "#7a5a2a", 0.4) : "#8a8273", n;
  pen.save();
  pen.translate(x, base);
  pen.scale(size, size);
  pen.beginPath();                                  // the trunk on its roots
  pen.moveTo(-70, 2);
  pen.bezierCurveTo(-40, -6, -30, -40, -28, -110);
  pen.bezierCurveTo(-26, -150, -34, -180, -40, -200);
  pen.lineTo(40, -204);
  pen.bezierCurveTo(30, -170, 26, -140, 28, -110);
  pen.bezierCurveTo(30, -40, 44, -6, 76, 2);
  pen.closePath();
  var skin = pen.createLinearGradient(-40, 0, 40, 0);
  skin.addColorStop(0, blend(bark, "#2a2018", 0.35));
  skin.addColorStop(0.45, blend(bark, "#ffffff", 0.18));
  skin.addColorStop(1, blend(bark, "#2a2018", 0.25));
  floraPaint(bark, skin);
  pen.strokeStyle = "rgba(50, 40, 30, 0.45)";       // its flutes
  pen.lineWidth = 1.6;
  pen.beginPath();
  [-16, -4, 10, 20].forEach(function (fx, k) {
    pen.moveTo(fx * 1.6, 0);
    pen.bezierCurveTo(fx, -50, fx * 0.8 + k, -130, fx * 0.9, -196);
  });
  pen.stroke();
  [[-30, -196, -190, -300, 16], [0, -200, -60, -370, 16], [10, -200, 80, -380, 15], [30, -196, 200, -296, 16],
   [-120, -260, -230, -260, 8], [130, -258, 240, -250, 8]].forEach(function (b) {
    hose(b[0], b[1], b[2], b[3], 0.08, b[4], bark);
  });
  var masses = [[-200, -270, 70, 50], [200, -268, 70, 50], [-130, -340, 90, 66], [130, -345, 90, 66], [0, -405, 100, 64],
                [-60, -300, 90, 60], [60, -300, 90, 60], [-245, -232, 44, 34], [245, -228, 44, 34], [-70, -385, 70, 50], [70, -388, 70, 50]];
  masses.forEach(function (m) {                     // the shade inside the crown
    pen.fillStyle = leaf.shade;
    pen.beginPath();
    pen.ellipse(m[0], m[1], m[2] * 0.78, m[3] * 0.76, 0, 0, 7);
    pen.fill();
  });
  var leaves = [];
  for (n = 0; n < 720; n++) {
    var m = masses[n % masses.length], a = dice(seed * 13 + n) * Math.PI * 2, r = Math.sqrt(dice(seed * 17 + n + 5)) * 1.05;
    leaves.push([m[0] + Math.cos(a) * m[2] * r, m[1] + Math.sin(a) * m[3] * r, n, a, r]);
  }
  leaves.sort(function (p, q) { return p[1] - q[1]; });
  leaves.forEach(function (l) {                     // the leaves, from the top of the crown down, so the low ones lie in front
    var lit = Math.max(0, Math.min(1, 0.5 - l[0] / 700 - (l[1] + 320) / 300 + (dice(seed * 5 + l[2]) - 0.5) * 0.7));
    // out from its mass's middle, and drooping: a bodhi's leaves tremble on their stalks and hang at the crown's edge
    var out = Math.atan2(Math.sin(l[3]), Math.cos(l[3])) + Math.PI / 2, turn = mix(out, Math.PI, 0.35 + l[4] * 0.2) + (dice(seed + l[2] * 3) - 0.5) * 0.9;
    floraHeart(l[0], l[1], 20, 10.5, turn, blend(leaf.shade, leaf.deep, 0.5 + lit * 0.5), blend(leaf.deep, leaf.pale, 0.25 + lit * 0.75), 0.28, false, leaf.vein);
  });
  if (colour) {                                     // the golden tree glitters
    pen.fillStyle = "rgba(255, 252, 225, 0.9)";
    for (n = 0; n < 34; n++) {
      var sx = (dice(seed * 3 + n) - 0.5) * 480, sy = -230 - dice(seed * 7 + n) * 230, sr = 2.5 + dice(n) * 3.5;
      pen.beginPath();
      pen.moveTo(sx, sy - sr * 2);
      pen.quadraticCurveTo(sx, sy, sx + sr * 2, sy);
      pen.quadraticCurveTo(sx, sy, sx, sy + sr * 2);
      pen.quadraticCurveTo(sx, sy, sx - sr * 2, sy);
      pen.quadraticCurveTo(sx, sy, sx, sy - sr * 2);
      pen.fill();
    }
  }
  pen.restore();
}

// --- miang, the tea of the hills ---

// One flower of miang: six round white petals, cupped and nodding, round a boss of gold stamens.
// x, y, r: pixels of the pen's frame; turn: radians. Returns nothing: it draws with pen.
// e.g. floraMiangBloom(-26, -60, 13, 0.4);
function floraMiangBloom(x, y, r, turn) {
  floraPetalRing(x, y, 6, r, r * 0.62, turn, "#ecefd8", "#fffef6", 0);
  pen.beginPath();
  pen.arc(x, y, r * 0.42, 0, 7);
  pen.fillStyle = "#f3c93a";
  pen.fill();
  pen.fillStyle = "#d89a18";
  for (var n = 0; n < 18; n++) {
    var a = n * 2.4, d = r * 0.38 * Math.sqrt((n + 1) / 18);
    pen.beginPath();
    pen.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.06 + 0.4, 0, 7);
    pen.fill();
  }
  pen.fillStyle = "#fdfae8";
  pen.beginPath();
  pen.arc(x, y, r * 0.1, 0, 7);
  pen.fill();
}

// FLORA.miang.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a twig of miang (เมี่ยง,
// the tea of the hills; Camellia sinensis var. assamica), whose leaves the north steams, ferments and chews, and
// offers to a guest: big glossy leaves with sawn edges, two pale young leaves and a bud at its tip, two flowers in
// the leaves' armpits and a bud. look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("miang", 700, 900, {size: 1.5});
function floraMiang(look, seed) {
  var leaf = {at: 0.42, sharp: 0.95, teeth: 1.4, veins: 7};
  floraCurve(0, 0, 8, -50, 2, -84, 4.5, "#6a5a44");
  floraCurve(2, -84, -8, -118, -4, -150, 3.5, "#7a7a4a");
  floraBlade(4, -34, 64, 21, -1.2, "#22553a", "#4f9a56", leaf);
  floraBlade(6, -60, 66, 22, 1.15, "#22553a", "#4f9a56", leaf);
  floraBlade(0, -96, 58, 19, -0.95, "#285e3c", "#5aa25a", leaf);
  floraBlade(-2, -122, 50, 17, 0.85, "#2f6a40", "#6aae5e", leaf);
  floraBlade(-4, -146, 30, 10, -0.7, "#6aa84e", "#b4dc84", {at: 0.45, teeth: 0.8, veins: 3});   // the two leaves and a bud
  floraBlade(-4, -142, 26, 9, 0.65, "#6aa84e", "#b4dc84", {at: 0.45, teeth: 0.8, veins: 3});
  pen.save();
  pen.translate(-4, -148);
  floraBladePath(16, 3.4, 0.4, 1.2, 0, 0);
  floraSoft("#cfe2b0", "#d8e8bc");
  pen.strokeStyle = "rgba(255, 255, 255, 0.8)";    // the bud's silver down
  pen.lineWidth = 0.8;
  pen.beginPath();
  pen.moveTo(-1, -2);
  pen.lineTo(0, -14);
  pen.stroke();
  pen.restore();
  hose(6, -60, -18, -64, -0.2, 1.4, "#7a8a4a");
  hose(4, -86, 22, -96, 0.2, 1.4, "#7a8a4a");
  floraMiangBloom(-22, -62, 13, 0.4);
  floraMiangBloom(24, -96, 12, 1.1);
  pen.beginPath();
  pen.arc(-2, -78, 5, 0, 7);
  floraSoft("#dfe6c4");
}

// --- makhwaen ---

// A cluster of makhwaen's fruit at (x, y): a branching stalk, and on it a crowd of small round fruits, red going to
// brown, some split to show the shiny black seed. x, y: pixels of the pen's frame; up: 1 standing, -1 hanging;
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraMakhwaenCluster(2, -104, 1, 1);
function floraMakhwaenCluster(x, y, up, seed) {
  var n, m, berries = [];
  for (n = 0; n < 6; n++) {
    var a = -Math.PI / 2 * up + (n - 2.5) * 0.38, d = 14 + dice(seed + n) * 10;
    var bx = x + Math.cos(a) * d, by = y + Math.sin(a) * d;
    floraCurve(x, y, mix(x, bx, 0.5), mix(y, by, 0.5) - 3 * up, bx, by, 1, "#8a5a3a");
    for (m = 0; m < 5; m++) {
      var ba = dice(seed + n * 7 + m) * Math.PI * 2, bd = 3 + dice(seed + n * 5 + m) * 6;
      berries.push([bx + Math.cos(ba) * bd, by + Math.sin(ba) * bd, dice(seed * 3 + n * 5 + m)]);
    }
  }
  berries.sort(function (p, q) { return p[1] - q[1]; });
  berries.forEach(function (b) {
    if (b[2] > 0.82) {                              // split open, the black seed showing
      floraBall(b[0] - 1.6, b[1], 3, "#8a3020", false);
      floraBall(b[0] + 1.6, b[1], 3, "#8a3020", false);
      floraBall(b[0], b[1] - 0.5, 2.1, "#141210");
    } else {
      floraBall(b[0], b[1], 3.6, blend("#d23a2a", "#8a4428", b[2]));
    }
  });
}

// FLORA.makhwaen.draw: flora() calls it with the pen moved to the foot and scaled by look.size: a twig of makhwaen
// (มะแขว่น; Zanthoxylum), the pepper of the north, whose numbing seeds go into larb and nam phrik: a prickly grey
// twig, leaves of narrow leaflets on red stalks, and two standing clusters of its fruit.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("makhwaen", 700, 900, {size: 1.5});
function floraMakhwaen(look, seed) {
  floraCurve(0, 0, 6, -60, 2, -104, 4.5, "#7a7266");
  floraCurve(2, -62, 22, -76, 34, -100, 3.2, "#7a7266");
  pen.fillStyle = "#4a4238";                        // its prickles
  [[2, -20, 1], [5, -44, -1], [4, -80, 1], [14, -72, 1], [26, -88, -1]].forEach(function (p) {
    pen.beginPath();
    pen.moveTo(p[0], p[1] - 3);
    pen.lineTo(p[0] + p[2] * 6, p[1] - 1);
    pen.lineTo(p[0], p[1] + 2);
    pen.closePath();
    pen.fill();
  });
  floraPinnate(2, -36, 64, -1.25, 4, 22, 6, "#2f6236", "#68a650", "#9a4a34");
  floraPinnate(4, -66, 58, 1.2, 4, 20, 6, "#2f6236", "#68a650", "#9a4a34");
  floraPinnate(34, -100, 46, 0.9, 3, 18, 5.5, "#2f6236", "#68a650", "#9a4a34");
  floraMakhwaenCluster(2, -108, 1, seed);
  floraMakhwaenCluster(36, -102, 1, seed + 4);
}

// FLORA.makhwaen.hang: floraTree() calls it with the pen moved to a point of the tree, hanging down from (0, 0).
// seed: a number. Returns nothing: it draws with pen.
// e.g. floraTree(pen, 240, 900, 1.0, "makhwaen", 1);
function floraMakhwaenHang(seed) {
  floraPinnate(0, 0, 44, 2.3, 3, 16, 5, "#2f6236", "#68a650", "#9a4a34");
  floraMakhwaenCluster(0, 6, -1, seed);
}

// --- hom, the indigo of Phrae ---

// One flower of hom: a curved tube, pale lilac, widening to a mouth of five round lobes.
// x, y: its foot, pixels of the pen's frame; long: pixels; turn: radians, 0 straight up.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraHomBloom(0, -150, 30, -0.6);
function floraHomBloom(x, y, long, turn) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.beginPath();
  pen.moveTo(-2, 0);
  pen.bezierCurveTo(-4, -long * 0.4, -long * 0.1, -long * 0.8, -long * 0.02, -long);
  pen.lineTo(long * 0.26, -long * 0.94);
  pen.bezierCurveTo(long * 0.12, -long * 0.7, 3, -long * 0.4, 2, 0);
  pen.closePath();
  var fade = pen.createLinearGradient(0, 0, 0, -long);
  fade.addColorStop(0, "#e6def4");
  fade.addColorStop(1, "#a891dc");
  floraSoft("#b9a6e0", fade);
  for (var n = 0; n < 5; n++) {                     // the mouth's five round lobes
    pen.save();
    pen.translate(long * 0.12, -long * 0.98);
    pen.rotate(-1.3 + n * 0.65 + turn * 0.2);
    floraRoundPetalPath(long * 0.26, long * 0.13, long * 0.02);
    floraSoft("#a48ad8", "#b8a2e4");
    pen.restore();
  }
  pen.fillStyle = "#6a4aa8";
  pen.beginPath();
  pen.arc(long * 0.12, -long * 0.98, long * 0.05, 0, 7);
  pen.fill();
  pen.restore();
}

// FLORA.hom.draw: flora() calls it with the pen moved to the foot and scaled by look.size: hom (ห้อม; Strobilanthes
// cusia), the indigo that dyes the dark blue mo hom shirts of Phrae: a jointed stem, dark blue-green leaves with sawn
// edges in pairs, and at its top a spike of curved lilac flowers among green bracts.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("hom", 700, 900, {size: 1.5});
function floraHom(look, seed) {
  var leaf = {at: 0.45, sharp: 1.1, teeth: 1.5, veins: 6};
  hose(0, 0, 2, -140, 0.03, 4.5, "#5a6a4a");
  [-36, -74, -108].forEach(function (y) {           // the swollen joints
    pen.beginPath();
    pen.ellipse(1, y, 4.2, 3, 0, 0, 7);
    shape("#6a7a52");
  });
  floraBlade(0, -36, 62, 16, -1.3, "#1f4a40", "#4f8a62", leaf);
  floraBlade(0, -36, 60, 15, 1.35, "#1f4a40", "#4f8a62", leaf);
  floraBlade(1, -74, 56, 15, -1.05, "#22504a", "#558f68", leaf);
  floraBlade(1, -74, 56, 15, 1.1, "#22504a", "#558f68", leaf);
  floraBlade(2, -108, 44, 12, -0.75, "#285a4a", "#5c9a6e", leaf);
  floraBlade(2, -108, 44, 12, 0.8, "#285a4a", "#5c9a6e", leaf);
  hose(2, -110, 4, -176, 0.05, 2.6, "#6a7a52");
  [[-128, -1.0, 34], [-136, 1.05, 34], [-148, -0.7, 31], [-156, 0.75, 30], [-166, -0.35, 26], [-172, 0.4, 24]].forEach(function (f) {
    floraBlade(3, f[0] + 2, 13, 5, f[1] * 1.2, "#4f8a52", "#9cc47a", {veins: 0});
    floraHomBloom(3, f[0], f[2], f[1]);
  });
  floraBall(4, -182, 3.6, "#c8b8ec");
}

// --- phlu and mak, the betel and the areca nut ---

// One areca nut lying at (x, y): an egg, orange going to gold, fibrous, with the little star of its cap; or cut in
// half, the marbled brown and cream of its kernel showing in its husk.
// x, y, size: pixels of the pen's frame (size 1 is 20 tall); turn: radians; cut: true for the half.
// Returns nothing: it draws with pen, and leaves pen as it found it.
// e.g. floraArecaNut(40, -14, 1, 0.3, false);
function floraArecaNut(x, y, size, turn, cut) {
  var n;
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(size, size);
  pen.beginPath();
  pen.ellipse(0, 0, 14, 19, 0, 0, 7);
  var husk = pen.createRadialGradient(-5, -6, 2, 0, 0, 20);
  husk.addColorStop(0, "#f8c45a");
  husk.addColorStop(0.6, "#ea8a28");
  husk.addColorStop(1, "#c25e1a");
  floraPaint("#e8892a", husk);
  if (cut) {
    pen.beginPath();
    pen.ellipse(0, 1, 10, 14, 0, 0, 7);
    shape("#ead8b2");
    pen.strokeStyle = "rgba(130, 70, 40, 0.75)";    // the marbling, from the heart out
    pen.lineWidth = 1.1;
    pen.beginPath();
    for (n = 0; n < 14; n++) {
      var a = n / 14 * Math.PI * 2 + dice(n) * 0.3, b = (dice(n + 7) - 0.5) * 1.4;
      pen.moveTo(Math.cos(a) * 1.5, 1 + Math.sin(a) * 2);
      pen.bezierCurveTo(Math.cos(a + b) * 4, 1 + Math.sin(a + b) * 6, Math.cos(a - b) * 7, 1 + Math.sin(a - b) * 9, Math.cos(a) * 9.5, 1 + Math.sin(a) * 13);
    }
    pen.stroke();
  } else {
    pen.strokeStyle = "rgba(150, 70, 20, 0.45)";    // the fibres of the husk
    pen.lineWidth = 0.9;
    pen.beginPath();
    for (n = -2; n <= 2; n++) {
      pen.moveTo(n * 3, -17);
      pen.quadraticCurveTo(n * 6, 0, n * 3, 17);
    }
    pen.stroke();
    for (n = 0; n < 5; n++) {                       // the cap
      pen.save();
      pen.translate(0, -18);
      pen.rotate(n * 1.257);
      floraRoundPetalPath(5, 2.6, 0);
      shape("#7a6a3a");
      pen.restore();
    }
  }
  pen.restore();
}

// FLORA.phlu.draw: flora() calls it with the pen moved to the foot and scaled by look.size: phlu (พลู, the betel
// vine) climbing a bamboo stake, its glossy heart-shaped leaves with veins that curve from the foot to the tip, and
// beside it mak (หมาก, the areca nut), two whole and one cut: the two are chewed together in the north, offered to
// a guest and in the cones of flowers given at the temple.
// look: flora()'s look (not read); seed: a number (flora() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0). Call flora() instead.
// e.g. flora("phlu", 700, 900, {size: 1.5});
function floraPhlu(look, seed) {
  hose(-34, 0, -30, -150, 0, 6, "#c8b070");          // the stake
  pen.strokeStyle = "rgba(120, 90, 40, 0.6)";
  pen.lineWidth = 1.2;
  pen.beginPath();
  [-40, -90, -138].forEach(function (y) { pen.moveTo(-36, y); pen.lineTo(-27, y); });
  pen.stroke();
  var vine = [[-30, 0], [-22, -40], [-38, -80], [-24, -118], [-34, -150]], n;
  for (n = 0; n < 4; n++) {
    hose(vine[n][0], vine[n][1], vine[n + 1][0], vine[n + 1][1], (n % 2 ? 0.2 : -0.2), 2.8, "#5f8a3e");
  }
  [[-22, -40, 1.3, 50], [-38, -80, -1.35, 48], [-24, -118, 1.0, 44], [-34, -150, -0.6, 38], [-28, -20, -1.6, 40]].forEach(function (l, n) {
    floraHeart(l[0], l[1], l[3], l[3] * 0.62, l[2], "#2a7034", "#7cc25a", 0.14, false, "rgba(220, 240, 180, 0.7)");
  });
  floraArecaNut(22, -18, 1, 0.25, false);
  floraArecaNut(48, -16, 0.92, -0.35, false);
  floraArecaNut(36, -12, 0.95, 1.4, true);
}

// The wild cherry in flower, as it stands on the hills in the cold month: no leaves, a dark red-brown trunk that
// forks and forks again into fine twigs, and on every twig a cloud of pink blossom, open, nodding and in bud.
// Drawn with the pen at (x, base), scaled by size.
// x, base: its foot, pixels of the pen's frame; size: 1 is about 450 tall and 420 across; seed: a number; colour:
// the flowers' "#rrggbb", or nothing. Returns nothing: it draws with pen, and leaves pen as it found it.
// floraTree(brush, ..., "phayasuea") calls it with pen pointed at the brush.
// e.g. floraTree(pen, 300, 900, 1, "phayasuea", 2);
function floraSueaTree(x, base, size, seed, colour) {
  colour = colour || "#ec6c9c";
  var bark = "#5a2f2a", tips = [], limbs = [];
  pen.save();
  pen.translate(x, base);
  pen.scale(size, size);
  function limb(x0, y0, a, len, w, depth, key) {
    var x1 = x0 + Math.sin(a) * len, y1 = y0 - Math.cos(a) * len;
    limbs.push([x0, y0, x1, y1, w, (dice(key) - 0.5) * 0.24]);
    if (depth === 0) { tips.push([x1, y1, key]); return; }
    if (depth <= 2) { tips.push([mix(x0, x1, 0.6), mix(y0, y1, 0.6), key + 0.5]); }
    var spread = 0.38 + dice(key * 3 + 1) * 0.22;
    limb(x1, y1, a - spread, len * 0.76, w * 0.64, depth - 1, key * 2 + 1);
    limb(x1, y1, a + spread * 0.9, len * 0.72, w * 0.62, depth - 1, key * 2 + 2);
  }
  limb(0, 0, 0.04, 150, 20, 5, seed + 1);
  limbs.forEach(function (b) { hose(b[0], b[1], b[2], b[3], b[5], b[4], bark); });
  pen.strokeStyle = "rgba(220, 190, 170, 0.6)";     // the pale marks across its bark
  pen.lineWidth = 1.4;
  pen.beginPath();
  for (var n = 1; n < 7; n++) {
    pen.moveTo(-6 + n * 0.3, -n * 20);
    pen.lineTo(6 + n * 0.3, -n * 20 - 1);
  }
  pen.stroke();
  tips.sort(function (p, q) { return p[1] - q[1]; });
  pen.fillStyle = blend(colour, "#ffffff", 0.45);   // a haze of blossom first, one shape, so the clouds read from across a set
  pen.globalAlpha = 0.5;
  pen.beginPath();
  tips.forEach(function (t) {
    pen.moveTo(t[0] + 30, t[1]);
    pen.arc(t[0], t[1], 30, 0, 7);
  });
  pen.fill();
  pen.globalAlpha = 1;
  tips.forEach(function (t, m) {
    for (var k = 0; k < 6; k++) {
      var a = dice(t[2] * 7 + k) * Math.PI * 2, d = dice(t[2] * 5 + k) * 22, px = t[0] + Math.cos(a) * d, py = t[1] + Math.sin(a) * d * 0.8;
      if (k === 5 && m % 3 === 0) {
        floraSueaNod(px, py, 8, (dice(t[2] + k) - 0.5) * 0.8, colour);
      } else if (k === 5) {
        pen.beginPath();
        pen.arc(px, py, 3.2, 0, 7);
        floraSoft(blend(colour, "#a01848", 0.4));
      } else {
        floraSueaBloom(px, py, 9.5 + dice(t[2] + k * 3) * 2.5, a, colour);
      }
    }
  });
  pen.restore();
}

// The flowers, the fruits and the plants: each name, its kind (flower,
// fruit or plant), its painter standing on the ground, its painter hanging
// from a point of a tree (or none), how far it reaches to each side (for its
// shadow), its Thai name and how that is said.
var FLORA = {
  ratchaphruek: {kind: "flower", draw: floraRatchaphruek, wide: 44, thai: "ราชพฤกษ์ (ดอกคูน)", say: "ratchaphruek",
                 hang: function (seed) { floraRaceme(0, 0, 90, seed); floraRaceme(14, -4, 70, seed + 3); }},
  thongkwao: {kind: "flower", draw: floraThongkwao, wide: 54, thai: "ทองกวาว", say: "thong kwao",
              hang: function (seed, colour) { floraFlameCluster(0, 0, colour || "#f0581e", seed); floraFlameCluster(26, 10, colour || "#f0581e", seed + 5); }},
  frangipani: {kind: "flower", draw: floraFrangipani, wide: 44, thai: "ลีลาวดี", say: "lilawadi",
               hang: function (seed, colour) { floraFrangipaniHang(seed, colour || FLORA_WHITE); }},
  orchid: {kind: "flower", draw: floraOrchid, wide: 60, thai: "กล้วยไม้", say: "kluai mai"},
  hibiscus: {kind: "flower", draw: floraHibiscus, wide: 44, thai: "ชบา", say: "chaba"},
  bougainvillea: {kind: "flower", draw: floraBougainvillea, wide: 60, thai: "เฟื่องฟ้า", say: "fueang fa",
                  hang: function (seed, colour) { floraBractCluster(0, 0, colour || "#d8338a", seed); floraBractCluster(22, 14, colour || "#d8338a", seed + 3); floraBractCluster(-18, 12, colour || "#d8338a", seed + 6); }},
  jasmine: {kind: "flower", draw: floraJasmine, wide: 44, thai: "มะลิ", say: "mali"},
  marigold: {kind: "flower", draw: floraMarigold, wide: 48, thai: "ดาวเรือง", say: "dao rueang"},
  mango: {kind: "fruit", draw: fruitMango, wide: 46, thai: "มะม่วง", say: "mamuang", hang: fruitMangoHang},
  durian: {kind: "fruit", draw: fruitDurian, wide: 70, thai: "ทุเรียน", say: "thurian", hang: fruitDurianHang},
  mangosteen: {kind: "fruit", draw: fruitMangosteen, wide: 48, thai: "มังคุด", say: "mangkhut", hang: fruitMangosteenHang},
  rambutan: {kind: "fruit", draw: fruitRambutan, wide: 52, thai: "เงาะ", say: "ngo", hang: fruitRambutanHang},
  longan: {kind: "fruit", draw: fruitLongan, wide: 56, thai: "ลำไย", say: "lamyai", hang: fruitLonganHang},
  lychee: {kind: "fruit", draw: fruitLychee, wide: 60, thai: "ลิ้นจี่", say: "linchi", hang: fruitLycheeHang},
  papaya: {kind: "fruit", draw: fruitPapaya, wide: 78, thai: "มะละกอ", say: "malako", hang: fruitPapayaHang},
  coconut: {kind: "fruit", draw: fruitCoconut, wide: 46, thai: "มะพร้าว", say: "maphrao"},
  pineapple: {kind: "fruit", draw: fruitPineapple, wide: 40, thai: "สับปะรด", say: "sapparot"},
  jackfruit: {kind: "fruit", draw: fruitJackfruit, wide: 80, thai: "ขนุน", say: "khanun", hang: fruitJackfruitHang, on: "trunk"},
  dragonfruit: {kind: "fruit", draw: fruitDragonfruit, wide: 40, thai: "แก้วมังกร", say: "kaeo mangkon"},
  pomelo: {kind: "fruit", draw: fruitPomelo, wide: 76, thai: "ส้มโอ", say: "som o"},
  bael: {kind: "fruit", draw: fruitBael, wide: 34, thai: "มะตูม", say: "matum", hang: fruitBaelHang},
  ueang: {kind: "flower", draw: floraUeang, wide: 54, thai: "เอื้องผึ้ง", say: "ueang phueng", hang: floraUeangHang},
  sarapee: {kind: "flower", draw: floraSarapee, wide: 52, thai: "สารภี", say: "sarapee", hang: floraSarapeeHang},
  sabannga: {kind: "flower", draw: floraSabannga, wide: 56, thai: "สะบันงา", say: "saban nga", hang: floraSabanngaHang},
  tahern: {kind: "flower", draw: floraTahern, wide: 50, thai: "ต๋าเหิน", say: "ta hern"},
  kettawa: {kind: "flower", draw: floraKettawa, wide: 46, thai: "เก็ดถะหวา", say: "ket tha wa"},
  dokkaew: {kind: "flower", draw: floraDokkaew, wide: 50, thai: "ดอกแก้ว", say: "dok kaew", hang: floraDokkaewHang},
  phayasuea: {kind: "flower", draw: floraPhayasuea, wide: 52, thai: "นางพญาเสือโคร่ง", say: "nang phaya suea khrong", hang: floraPhayasueaHang},
  buatong: {kind: "flower", draw: floraBuatong, wide: 50, thai: "บัวตอง", say: "bua tong"},
  teak: {kind: "flower", draw: floraTeak, wide: 90, thai: "สัก", say: "sak", hang: floraTeakHang},
  sompoi: {kind: "plant", draw: floraSompoi, wide: 50, thai: "ส้มป่อย", say: "som poi"},
  sugarcane: {kind: "plant", draw: floraSugarcane, wide: 50, thai: "อ้อย", say: "oi"},
  pho: {kind: "plant", draw: floraPho, wide: 50, thai: "โพธิ์", say: "pho", hang: floraPhoHang},
  miang: {kind: "plant", draw: floraMiang, wide: 56, thai: "เมี่ยง", say: "miang"},
  makhwaen: {kind: "plant", draw: floraMakhwaen, wide: 56, thai: "มะแขว่น", say: "makhwaen", hang: floraMakhwaenHang},
  hom: {kind: "plant", draw: floraHom, wide: 50, thai: "ห้อม", say: "hom"},
  phlu: {kind: "plant", draw: floraPhlu, wide: 66, thai: "พลู หมาก", say: "phlu, mak"}
};

// The names a tree can bear: the ones with a hanging painter.
var FLORA_TREES = {};
Object.keys(FLORA).forEach(function (name) { if (FLORA[name].hang) { FLORA_TREES[name] = true; } });

// One flower or fruit at (x, y). "name" is a key of FLORA.
// flora(name, x, y, look) draws one flower or fruit, with a soft shadow under it unless look.ground is false.
//   name   a key of FLORA: ratchaphruek, thongkwao, frangipani, orchid, hibiscus, bougainvillea, jasmine,
//          marigold, mango, durian, mangosteen, rambutan, longan, lychee, papaya, coconut, pineapple,
//          jackfruit, dragonfruit, pomelo, bael; the flowers and plants of Lanna: ueang, sarapee, sabannga,
//          tahern, kettawa, dokkaew, phayasuea, buatong, teak, sompoi, sugarcane, pho, miang, makhwaen, hom,
//          phlu; another is reported by checkName() and nothing is drawn
//   x, y   the foot of the stem, or the ground the fruit lies on, pixels of the sheet
//   look   optional; its keys: FLORA_KEYS, at the top of this file (size 1, colour, ground)
// Returns nothing: it draws with pen, and leaves pen as it found it. It sets the kit's LINE and FINE
// while it draws, and puts them back to STYLE.line and 1 after.
// e.g. flora("orchid", 300, 1000, {colour: "#e86fb0"});
function flora(name, x, y, look) {
  look = look || {};
  checkNames("The flora's name", look, FLORA_KEYS);
  if (!FLORA[name]) { checkName("The flower or fruit", name, FLORA); return; }
  var size = look.size || 1;
  // a small thing is not inked with a thick pen; below size 0.5 the pen thins faster, or a flower drawn as small as a
  // real one beside the people (size 0.3 or so) is more ink than colour (living_scenes.html, 2026-10-23)
  var weight = size < 0.5 ? 0.6 * Math.pow(size / 0.5, 1.5) : Math.min(1, 0.4 + 0.4 * size);
  LINE = STYLE.line * weight / size;
  FINE = LINE / STYLE.line;
  if (look.ground !== false) {
    pen.fillStyle = "rgba(70, 45, 30, 0.18)";       // a soft shadow under it
    pen.beginPath();
    pen.ellipse(x, y + 2 * size, FLORA[name].wide * 1.06 * size, 8 * size, 0, 0, 7);
    pen.fill();
  }
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  FLORA[name].draw(look, x * 0.013);
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
}

// A papaya tree: a slim straight trunk, grey-green, marked where leaves
// have fallen, its fruit crowded under a crown of big lobed leaves on long
// stalks. Drawn with the pen at (x, base), scaled by size.
// x, base: its foot, pixels of the pen's frame; size: 1 is about 400 tall; seed: a number.
// Returns nothing: it draws with pen, and leaves pen as it found it. floraTree(brush, ..., "papaya")
// calls it with pen pointed at the brush.
// e.g. floraTree(pen, 300, 900, 1, "papaya", 2);
function floraPapayaTree(x, base, size, seed) {
  var n, a;
  pen.save();
  pen.translate(x, base);
  pen.scale(size, size);
  hose(0, 0, 6, -300, 0.02, 24, "#8a9a6a");
  pen.strokeStyle = "rgba(60, 70, 40, 0.5)";
  pen.lineWidth = 1.4;
  pen.beginPath();
  for (n = 1; n < 12; n++) {
    var cy = -n * 24, cx = n * 0.5;
    pen.moveTo(cx - 9, cy);
    pen.quadraticCurveTo(cx, cy + 4, cx + 9, cy - 1);
  }
  pen.stroke();
  for (n = 0; n < 6; n++) {                         // the fruit, under the crown
    pen.save();
    pen.translate(-16 + n * 7 + (n % 2) * 4, -280 + (n % 3) * 7);
    pen.scale(0.5, 0.5);
    floraPapaya(0, 58, 1, Math.PI / 2);
    pen.restore();
  }
  for (n = 0; n < 8; n++) {                         // the crown: stalks out from the top, a lobed leaf on each
    a = -2.4 + n * 0.68 + (dice(seed + n) - 0.5) * 0.2;
    var ex = 6 + Math.sin(a) * 92, ey = -300 - Math.cos(a) * 92 + 10;
    hose(6, -300, ex, ey, 0, 5, "#9fb66a");
    for (var lobe = 0; lobe < 5; lobe++) {
      pen.save();
      pen.translate(ex, ey);
      pen.rotate(a - 0.8 + lobe * 0.4);
      paintLeaf(pen, 56 - Math.abs(lobe - 2) * 12, 13, 0, FLORA_LEAF, FLORA_PALE, FLORA_LINE);
      pen.restore();
    }
  }
  pen.restore();
}

// The kit's tree with the named flower or fruit in its boughs, painted on a
// set's sheet ("brush") as tree() is. Eight hang in the canopy, a jackfruit
// on the trunk; a papaya, a bodhi (pho) and the wild cherry (phayasuea, bare
// and in blossom) have trees of their own; a coconut is on the kit's palm
// already, and a pineapple grows on the ground.
//   brush    a canvas 2D context: a set's sheet, painted once
//   x, base  its foot, pixels of the sheet; size: as the kit's tree() takes it
//   name     a key of FLORA that has a hang (FLORA_TREES): ratchaphruek, thongkwao, frangipani,
//            bougainvillea, mango, durian, mangosteen, rambutan, longan, lychee, papaya, jackfruit, bael,
//            ueang, sarapee, sabannga, dokkaew, phayasuea, teak, pho, makhwaen; another is reported by
//            checkName() and nothing is drawn
//   seed     a number, 0 when left out; colour: the flower's "#rrggbb", for the ones that take one (a
//            pho's is its leaves': "#e3b341" is the golden bodhi)
// Returns nothing: it draws with brush. It points pen at brush while it draws and puts pen and LINE
// back after; FINE is left at 1.
// e.g. floraTree(pen, 240, 900, 1.0, "mango", 1);
function floraTree(brush, x, base, size, name, seed, colour) {
  seed = seed || 0;
  var what = FLORA[name], n;
  if (!what || !what.hang) { checkName("A tree of", name, FLORA_TREES); return; }
  var keep = pen, keepLine = LINE;
  pen = brush;
  if (name === "papaya" || name === "pho" || name === "phayasuea") {
    LINE = STYLE.line / size;
    ({papaya: floraPapayaTree, pho: floraPhoTree, phayasuea: floraSueaTree})[name](x, base, size, seed, colour);
  } else {
    tree(brush, x, base, size);
    var at = what.kind === "flower" ? 0.75 : 0.55, small = at * size;   // blossom is drawn larger than fruit, to read as colour
    LINE = STYLE.line * Math.max(0.5, Math.min(1, 0.4 + 0.4 * small)) / small;
    FINE = LINE / STYLE.line;
    pen.save();
    pen.translate(x, base);
    pen.scale(size, size);
    var spots = [];
    if (what.on === "trunk") {
      spots = [[-8, -118], [12, -150], [-2, -84]];
    } else {
      for (n = 0; n < 8; n++) {
        var a = dice(seed * 7 + n) * Math.PI * 2, r = Math.sqrt(dice(seed * 11 + n + 3));
        spots.push([Math.cos(a) * r * 160, -300 + Math.sin(a) * r * 90]);
      }
    }
    for (n = 0; n < spots.length; n++) {
      pen.save();
      pen.translate(spots[n][0], spots[n][1]);
      pen.scale(at, at);
      what.hang(seed + n, colour);
      pen.restore();
    }
    pen.restore();
  }
  FINE = 1;
  LINE = keepLine;
  pen = keep;
}
