// s03_trees.js - scene 3 of "Through the flowers": the camera slides on under the trees, where the light comes down
// in shafts. Golden orchids (ueang phueng) grow on the trunks, a tokay crawls up one and an atlas moth rests on
// another; saban nga hangs down from above; on the forest floor ta hern, hom, miang and som poi, and betel on its
// stake; a blue magpie flies through and a bluebottle darts about.

var TREES_LONG = 12;

// Builds the scene's layers, once. Returns the layers for thkLayers(). e.g. var layers = s03Build();
function s03Build() {
  function bush(wide, high, seed, greens, blooms, sharp) {
    return thkSprite(wide + 80, high + 60, wide / 2 + 40, high + 20, function () { thkBush(wide, high, seed, greens, blooms); }, sharp);
  }
  function plant(name, size, look) {
    return thkSprite(300 * size, 320 * size, 150 * size, 300 * size, function () {
      flora(name, 0, 0, Object.assign({size: size, ground: false}, look || {}));
    });
  }
  function trunk(high, wide, seed, sharp) {
    return thkSprite(wide * 2.2, high + 20, wide * 1.1, high + 10, function () { thkTrunk(high, wide, seed); }, sharp);
  }
  var hanging = thkSprite(300, 320, 150, 20, function () {   // saban nga, hanging from a bough above the frame
    pen.save();
    pen.scale(2.2, 2.2);
    hose(-60, 0, 50, 6, 0.1, 5, FLORA_TWIG);
    pen.translate(-20, 4);
    floraSabanngaHang(4, "#e2c636");
    pen.translate(50, 0);
    floraSabanngaHang(9, "#e2c636");
    pen.restore();
  });
  var forest = [], canopy = [], farUnder = [], under = [], trunks = [], floor = [], near = [], n;
  for (n = 0; n < 8; n++) {                         // the understory far off, in the air
    farUnder.push({sprite: bush(520, 300, 240 + n, THK_SUN, [["dokkaew", 20, 7]], PIX), x: -150 + n * 330, y: 1000, size: 1, reach: 0.2});
  }
  var underBlooms = [[["dokkaew", 50, 9]], [["kettawa", 14, 14]], [["miang", 16, 11]], [["hom", 18, 10]], [["sarapee", 30, 10]]];
  for (n = 0; n < 7; n++) {                         // and nearer, bushes in flower between the trunks
    under.push({sprite: bush(600 + 160 * dice(n), 380 + 160 * dice(n + 3), 250 + n, THK_GREENS, underBlooms[n % 5], PIX),
                x: -80 + n * 380, y: 1110, size: 1, reach: 0.25});
  }
  for (n = 0; n < 8; n++) {                         // far trunks, pale in the air
    forest.push({sprite: trunk(1000, 70, 200 + n, PIX), x: -100 + n * 330 + 60 * dice(n), y: 900, size: 1, reach: 0});
  }
  for (n = 0; n < 6; n++) {
    canopy.push({sprite: bush(800, 420, 210 + n, THK_SHADE, [], PIX), x: -200 + n * 520, y: 260, size: 1, reach: 0.15});
  }
  var bigTrunks = [trunk(1300, 150, 220), trunk(1300, 130, 221), trunk(1300, 170, 222)];
  trunks.push({sprite: bigTrunks[0], x: 420, y: 1060, size: 1, reach: 0});
  trunks.push({sprite: bigTrunks[1], x: 1260, y: 1050, size: 1, reach: 0});
  trunks.push({sprite: bigTrunks[2], x: 2050, y: 1070, size: 1, reach: 0});
  trunks.push({sprite: plant("ueang", 1.3), x: 400, y: 640, size: 1, reach: 0.3});
  trunks.push({sprite: plant("ueang", 1.1), x: 1250, y: 520, size: 1, reach: 0.3});
  trunks.push({sprite: plant("ueang", 1.2), x: 2040, y: 700, size: 1, reach: 0.3});
  trunks.push({sprite: bush(2600, 200, 230, THK_SHADE, [["jasmine", 20, 6]], PIX), x: 1100, y: 1110, size: 1, reach: 0.05});
  trunks.push({sprite: hanging, x: 820, y: -10, size: 1, reach: 0.8});
  trunks.push({sprite: hanging, x: 1700, y: -30, size: 0.9, reach: 0.8, phase: 2});
  [["tahern", 2.3, 160], ["hom", 2.1, 640], ["phlu", 2.2, 980], ["miang", 2.1, 1460], ["sompoi", 2, 1800], ["tahern", 2.2, 2300],
   ["hom", 2, 2620], ["kettawa", 1.9, 1240]].forEach(function (s, k) {
    floor.push({sprite: plant(s[0], s[1]), x: s[2], y: 1090, size: 1, reach: 0.5});
  });
  [-260, 2250, 2950].forEach(function (x) {         // the nearest: big leaves of teak at the frame's corners, soft
    near.push({sprite: plant("teak", 3.2), x: x, y: 1330, size: 1, reach: 0.4});
  });
  var bark = [[1240, 1000], [1250, 700], [1262, 420]];   // the tokay's way up the middle trunk
  return [
    {depth: 0.25, blur: 4, haze: 0.45, items: forest},
    {depth: 0.5, blur: 2.5, haze: 0.15, items: canopy},
    {depth: 0.55, blur: 2, haze: 0.18, items: farUnder},
    {depth: 0.72, blur: 0.8, items: under},
    {depth: 0.85, blur: 0, items: trunks, live: function (t) {
      atlasMoth(2075, 420, t, {size: 0.3, turn: 0.1, flutter: 0.4});
      gecko(bark, 60 + 22 * t, {size: 0.9});
      if (t > 3 && t < 10) {                        // the magpie flies through, right to left, under the canopy
        var f = (t - 3) / 7;
        blueMagpie(2300 - f * 2000, 330 + 60 * Math.sin(f * 3), t, {fly: true, size: 1.6, face: -1});
        if (t > 4.5 && t < 4.7) { hear("magpie", clock, 2300 - f * 2000, 330); }
      }
      var b = butterflyDrift(t, 600, 760, {vx: 70, weave: 90, seed: 4});
      butterfly("bluebottle", b.x, b.y, t, {turn: b.turn + 1.2, size: 1.6, seed: 3});
    }},
    {depth: 1, blur: 0, items: floor},
    {depth: 1.6, blur: 6, items: near}
  ];
}

// The scene at its own second t (0 to TREES_LONG). Returns nothing: it draws with pen.
// e.g. s03Trees(4);
function s03Trees(t) {
  var layers = thkOnce("trees", s03Build);
  var air = pen.createLinearGradient(0, 0, 0, 1080);
  air.addColorStop(0, "#dfe8c4");
  air.addColorStop(0.6, "#b8cc98");
  air.addColorStop(1, "#5a7448");
  pen.fillStyle = air;
  pen.fillRect(0, 0, WIDE, 1080);
  thkLayers(t, layers, {x: 35 * t, z: 0.04 * t / TREES_LONG, y: -6 * t}, "#e4ecc8");
  thkLight(t, 1, 7);
  thkVignette(0.42);
}
