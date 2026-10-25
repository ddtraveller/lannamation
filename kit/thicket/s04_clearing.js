// s04_clearing.js - scene 4 of "Through the flowers": out of the trees into a clearing. The camera draws back and
// rises over a slope of bua tong in gold, as the hills of Mae Hong Son are in the cold season; the wild cherry stands
// bare and in pink blossom beside a sarapee in flower, the hills lie blue behind, a great hornbill crosses the sky, a
// golden birdwing and grass yellows go over the flowers, and the cherry's petals fall. The film ends here.

var CLEARING_LONG = 12;

// Builds the scene's layers, once. Returns the layers for thkLayers(). e.g. var layers = s04Build();
function s04Build() {
  function plant(name, size, look) {
    return thkSprite(300 * size, 320 * size, 150 * size, 300 * size, function () {
      flora(name, 0, 0, Object.assign({size: size, ground: false}, look || {}));
    });
  }
  function tree(name, size, seed, colour) {
    return thkSprite(700 * size, 620 * size, 350 * size, 590 * size, function () { floraTree(pen, 0, 0, size, name, seed, colour); });
  }
  var hillsFar = thkSprite(3400, 520, 300, 500, function () {
    hills(pen, 3000, 0, 240, 2.1, "#8fb0b8");
  }, PIX);
  var hillsNear = thkSprite(3400, 460, 300, 440, function () {
    hills(pen, 3000, 0, 170, 4.4, "#7fa86a");
  }, PIX);
  function bush(wide, high, seed, greens, blooms, sharp) {
    return thkSprite(wide + 80, high + 60, wide / 2 + 40, high + 20, function () { thkBush(wide, high, seed, greens, blooms); }, sharp);
  }
  // a sarapee tree painted as the bushes are: a trunk, and a crown of leaves in flower
  var sarapeeTree = thkSprite(900, 900, 450, 880, function () {
    thkTrunk(520, 60, 31);
    pen.translate(0, -420);
    thkBush(700, 440, 36, THK_GREENS, [["sarapee", 90, 11]]);
  }, PIX);
  var band = [], meadow = [], slope = [], trees = [], front = [], near = [], n;
  for (n = 0; n < 9; n++) {                         // the forest at the hills' foot, blue in the air
    band.push({sprite: bush(520, 220, 300 + n, THK_SHADE, [], PIX), x: -300 + n * 380, y: 820, size: 1, reach: 0.1});
  }
  for (n = 0; n < 7; n++) {                         // the meadow: mounds of leaves full of bua tong
    meadow.push({sprite: bush(900, 300, 320 + n, THK_SUN, [["buatong", 70, 15]], PIX), x: -350 + n * 480, y: 1010 + 20 * dice(n), size: 1, reach: 0.15});
  }
  for (n = 0; n < 30; n++) {                        // bua tong on their stems before the mounds, row on row
    var row = n % 3, size = 1 + row * 0.3;
    slope.push({sprite: plant("buatong", size), x: -300 + (n * 97) % 2700 + 40 * dice(n), y: 960 + row * 50 + 20 * dice(n + 3), size: 1, reach: 0.5});
  }
  slope.sort(function (a, b) { return a.y - b.y; });
  trees.push({sprite: tree("phayasuea", 1.25, 5), x: 560, y: 860, size: 1, reach: 0.08});
  trees.push({sprite: sarapeeTree, x: 1600, y: 870, size: 0.8, reach: 0.06});
  trees.push({sprite: tree("phayasuea", 0.9, 9, "#f088b0"), x: 2300, y: 840, size: 1, reach: 0.08});
  [["buatong", 2.2, 120], ["marigold", 1.9, 520], ["buatong", 2.4, 900], ["thongkwao", 1.8, 1240], ["buatong", 2.1, 1500],
   ["frangipani", 1.8, 1860], ["buatong", 2.3, 2150], ["ratchaphruek", 1.7, 2450]].forEach(function (s, k) {
    front.push({sprite: plant(s[0], s[1]), x: s[2], y: 1090 + 15 * dice(k), size: 1, reach: 0.6});
  });
  [-120, 1000, 2100].forEach(function (x, k) {
    near.push({sprite: plant("buatong", 3.6), x: x, y: 1320, size: 1, reach: 0.7});
  });
  return [
    {depth: 0.08, blur: 1.5, haze: 0.25, items: [{sprite: hillsFar, x: -300, y: 760, reach: 0}]},
    {depth: 0.15, blur: 1, haze: 0.12, items: [{sprite: hillsNear, x: -300, y: 860, reach: 0}]},
    {depth: 0.3, blur: 2, haze: 0.3, items: band},
    {depth: 0.45, blur: 0.6, items: trees, live: function (t) {
      if (t > 1.5) {                                // the hornbill crosses the sky, slow and heavy
        var f = (t - 1.5) / 10;
        hornbill(-100 + f * 2300, 240 - 50 * f, t, {fly: true, size: 1.1});
        if ((t > 3 && t < 3.2) || (t > 9 && t < 9.2)) { hear("shama", clock, 1000, 500); }
      }
    }},
    {depth: 0.55, blur: 0.5, items: meadow},
    {depth: 0.7, blur: 0.3, items: slope},
    {depth: 1, blur: 0, items: front, live: function (t) {
      var b = butterflyDrift(t, 300, 640, {vx: 90, vy: -5, weave: 70, seed: 6});
      butterfly("birdwing", b.x, b.y, t, {turn: b.turn + 1.2, size: 1.7, seed: 5});
      for (var k = 0; k < 2; k++) {
        var g = butterflyDrift(t, 1300 + k * 500, 760 - k * 80, {vx: -30, weave: 60, seed: 7 + k * 3});
        butterfly("grassyellow", g.x, g.y, t, {turn: g.turn, size: 1.6, seed: 7 + k});
      }
    }},
    {depth: 1.6, blur: 6, items: near}
  ];
}

// The scene at its own second t (0 to CLEARING_LONG). Returns nothing: it draws with pen.
// e.g. s04Clearing(4);
function s04Clearing(t) {
  var layers = thkOnce("clearing", s04Build);
  var sky = pen.createLinearGradient(0, 0, 0, 800);
  sky.addColorStop(0, "#9cc8de");
  sky.addColorStop(0.7, "#e6efe0");
  sky.addColorStop(1, "#f8f0d6");
  pen.fillStyle = sky;
  pen.fillRect(0, 0, WIDE, 1080);
  var go = between(t, 0, CLEARING_LONG);
  thkLayers(t, layers, {x: 40 * t, z: 0.25 * (1 - go), y: -90 * go}, "#eef2e0");
  thkPetals(t, 30, "#f6b8cc", 9, 1.1);
  thkLight(t, 0.45, 11);
  thkVignette(0.25);
}
