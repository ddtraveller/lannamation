// s01_pink.js - scene 1 of "Through the flowers": the camera pushes slowly forward through a thicket in pink flower
// (bougainvillea, hibiscus, the wild cherry), the near bushes parting to each side as it goes, toward an opening of
// light; a leopard lacewing sits on a hibiscus opening and closing its wings, a golden birdwing crosses, petals fall.
// As the reference the owner gave (2026-10-25): the flowering shrubs of Spirited Away, with no one in them.

var PINK_LONG = 12;

// The pinks of the thicket's flowers.
var S01_PINKS = {bract: "#d8338a", hibiscus: "#e65a7a", cherry: "#ec6c9c", pale: "#f3a6c0"};

// Builds the scene's layers, once: far pale bushes in the light, pink bushes behind, the big pink bushes that
// frame the opening, and the nearest blossom at the edges, soft. Returns the layers for thkLayers().
// e.g. var layers = s01Build();
function s01Build() {
  var pinkBlooms = [["bougainvillea", 90, 20, S01_PINKS.bract], ["hibiscus", 14, 16, S01_PINKS.hibiscus], ["phayasuea", 60, 10, S01_PINKS.cherry]];
  var paleBlooms = [["phayasuea", 30, 8, S01_PINKS.pale], ["jasmine", 20, 6]];
  function bush(wide, high, seed, greens, blooms, sharp) {
    return thkSprite(wide + 80, high + 60, wide / 2 + 40, high + 20, function () { thkBush(wide, high, seed, greens, blooms); }, sharp);
  }
  var wall = [], far = [], back = [], main = [], near = [], n;
  for (n = 0; n < 6; n++) {                         // the tall soft wall of leaves behind, a gap of light in its middle
    var side = n < 3 ? n * 260 - 120 : WIDE - (n - 3) * 260 + 120;
    wall.push({sprite: bush(760, 760, 70 + n, THK_SHADE, [["phayasuea", 30, 9, S01_PINKS.pale]], PIX), x: side, y: 860, size: 1, reach: 0.15});
  }
  for (n = 0; n < 7; n++) {
    far.push({sprite: bush(420, 260, 10 + n, THK_SUN, paleBlooms, PIX), x: 120 + n * 300 + 60 * dice(n), y: 760 + 20 * dice(n + 4), size: 1, reach: 0.3});
  }
  for (n = 0; n < 6; n++) {
    back.push({sprite: bush(520, 380, 30 + n, THK_GREENS, pinkBlooms, PIX), x: 60 + n * 380, y: 960 + 30 * dice(n + 9), size: 1, reach: 0.4});
  }
  main.push({sprite: bush(900, 680, 51, THK_GREENS, [["bougainvillea", 170, 22, S01_PINKS.bract], ["hibiscus", 20, 18, S01_PINKS.hibiscus], ["phayasuea", 90, 11, S01_PINKS.cherry]]),
             x: 260, y: 1120, size: 1, reach: 0.25});
  main.push({sprite: bush(860, 720, 52, THK_GREENS, [["hibiscus", 40, 19, S01_PINKS.hibiscus], ["bougainvillea", 120, 22, S01_PINKS.bract], ["phayasuea", 70, 11, S01_PINKS.cherry]]),
             x: 1700, y: 1120, size: 1, reach: 0.25});
  near.push({sprite: bush(800, 620, 61, THK_SHADE, [["bougainvillea", 90, 18, S01_PINKS.bract], ["phayasuea", 50, 10, S01_PINKS.cherry]], PIX), x: -60, y: 1180, size: 1.2, reach: 0.2});
  near.push({sprite: bush(800, 620, 62, THK_SHADE, [["hibiscus", 16, 18, S01_PINKS.hibiscus], ["bougainvillea", 80, 18, S01_PINKS.bract]], PIX), x: 1980, y: 1180, size: 1.2, reach: 0.2});
  near.push({sprite: bush(700, 420, 63, THK_SHADE, [["phayasuea", 60, 10, S01_PINKS.pale], ["bougainvillea", 40, 16, S01_PINKS.bract]], PIX), x: 960, y: 1260, size: 1.3, reach: 0.15});
  return [
    {depth: 0.18, blur: 4, haze: 0.4, items: wall},
    {depth: 0.3, blur: 2.5, haze: 0.3, items: far},
    {depth: 0.6, blur: 1, haze: 0.12, items: back},
    {depth: 1, blur: 0, items: main, live: function (t) {
      butterfly("lacewing", 1400, 520, t, {rest: true, turn: -0.5, size: 1.5, seed: 2});
      if ((t > 1 && t < 1.2) || (t > 7 && t < 7.2)) { hear("shama", clock, 1200, 300); }   // a shama sings in the thicket
      var b = butterflyDrift(t, 420, 560, {vx: 70, vy: -10, weave: 50, seed: 1.3});
      butterfly("birdwing", b.x, b.y, t, {turn: b.turn + 1.2, size: 1.3, seed: 1});
    }},
    {depth: 1.5, blur: 4, items: near}
  ];
}

// The scene at its own second t (0 to PINK_LONG). Returns nothing: it draws with pen.
// e.g. s01Pink(4);
function s01Pink(t) {
  var layers = thkOnce("pink", s01Build);
  var sky = pen.createLinearGradient(0, 0, 0, 1080);
  sky.addColorStop(0, "#fbf3d8");
  sky.addColorStop(0.55, "#e9f0c8");
  sky.addColorStop(1, "#b8d48a");
  pen.fillStyle = sky;
  pen.fillRect(0, 0, WIDE, 1080);
  var go = between(t, 0, PINK_LONG);
  thkLayers(t, layers, {x: 30 * t, z: 0.42 * go, y: -20 * go}, "#f6f2d6");
  thkPetals(t, 36, S01_PINKS.pale, 3, 1.2);
  thkLight(t, 0.7, 1);
  thkVignette(0.3);
}
