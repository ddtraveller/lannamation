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
// the Khom's tribute of gold in the tale of Chang Ngu.
//
// The names a look may have (flora() warns about any other):
//   size       how large it is drawn: 1 is as large as it is beside the cast
//              at their own sizes (a mango is about 68 long, a durian 130)
//   colour     the flower's colour, for the ones that come in more than one:
//              thongkwao, frangipani, orchid, hibiscus, bougainvillea, marigold
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

// The flowers and the fruits: each name, its painter standing on the
// ground, its painter hanging from a point of a tree (or none), how far it
// reaches to each side (for its shadow), its Thai name and how that is said.
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
  bael: {kind: "fruit", draw: fruitBael, wide: 34, thai: "มะตูม", say: "matum", hang: fruitBaelHang}
};

// The names a tree can bear: the ones with a hanging painter.
var FLORA_TREES = {};
Object.keys(FLORA).forEach(function (name) { if (FLORA[name].hang) { FLORA_TREES[name] = true; } });

// One flower or fruit at (x, y). "name" is a key of FLORA.
// flora(name, x, y, look) draws one flower or fruit, with a soft shadow under it unless look.ground is false.
//   name   a key of FLORA: ratchaphruek, thongkwao, frangipani, orchid, hibiscus, bougainvillea, jasmine,
//          marigold, mango, durian, mangosteen, rambutan, longan, lychee, papaya, coconut, pineapple,
//          jackfruit, dragonfruit, pomelo, bael; another is reported by checkName() and nothing is drawn
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
  LINE = STYLE.line * Math.max(0.5, Math.min(1, 0.4 + 0.4 * size)) / size;   // a small thing is not inked with a thick pen
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
// on the trunk; a papaya has a tree of its own; a coconut is on the kit's
// palm already, and a pineapple grows on the ground.
//   brush    a canvas 2D context: a set's sheet, painted once
//   x, base  its foot, pixels of the sheet; size: as the kit's tree() takes it
//   name     a key of FLORA that has a hang (FLORA_TREES): ratchaphruek, thongkwao, frangipani,
//            bougainvillea, mango, durian, mangosteen, rambutan, longan, lychee, papaya, jackfruit;
//            another is reported by checkName() and nothing is drawn
//   seed     a number, 0 when left out; colour: the flower's "#rrggbb", for the ones that take one
// Returns nothing: it draws with brush. It points pen at brush while it draws and puts pen and LINE
// back after; FINE is left at 1.
// e.g. floraTree(pen, 240, 900, 1.0, "mango", 1);
function floraTree(brush, x, base, size, name, seed, colour) {
  seed = seed || 0;
  var what = FLORA[name], n;
  if (!what || !what.hang) { checkName("A tree of", name, FLORA_TREES); return; }
  var keep = pen, keepLine = LINE;
  pen = brush;
  if (name === "papaya") {
    LINE = STYLE.line / size;
    floraPapayaTree(x, base, size, seed);
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
