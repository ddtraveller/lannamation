// s02_hedge.js - scene 2 of "Through the flowers": the camera slides slowly along a hedge that fills the frame, green
// and dotted with small flowers (jasmine, dok kaew, sarapee, a purple orchid, the wild cherry), as the second shot of
// the owner's reference does; flowers on their stems stand in front of it, a sunbird hovers to sip from a hibiscus,
// grass yellows flutter, and tall grass slides past near the camera, soft.

var HEDGE_LONG = 12;

// Builds the scene's layers, once. Returns the layers for thkLayers(). e.g. var layers = s02Build();
function s02Build() {
  function bush(wide, high, seed, greens, blooms, sharp) {
    return thkSprite(wide + 80, high + 60, wide / 2 + 40, high + 20, function () { thkBush(wide, high, seed, greens, blooms); }, sharp);
  }
  function plant(name, size, look) {
    return thkSprite(260 * size, 300 * size, 130 * size, 280 * size, function () {
      flora(name, 0, 0, Object.assign({size: size, ground: false}, look || {}));
    });
  }
  function grass(high, count, seed, greens) {
    return thkSprite(high * 1.6, high + 40, high * 0.8, high + 10, function () { thkGrass(high, count, seed, greens); }, PIX);
  }
  var smallBlooms = [["jasmine", 90, 9], ["dokkaew", 70, 10], ["sarapee", 40, 11], ["orchid", 40, 11, "#b25cc0"], ["phayasuea", 60, 9, "#ef7aa6"]];
  var back = [], hedge = [], front = [], tall = [], near = [], n;
  for (n = 0; n < 6; n++) {                         // behind the hedge's top, far leaves in the light
    back.push({sprite: bush(700, 520, 120 + n, THK_SUN, [["jasmine", 20, 6]], PIX), x: -200 + n * 420, y: 420, size: 1, reach: 0.2});
  }
  for (n = 0; n < 7; n++) {                         // the hedge: a wall of bushes from the ground to the frame's top
    hedge.push({sprite: bush(760, 860, 130 + n, THK_GREENS, smallBlooms), x: -260 + n * 400, y: 1140 + 30 * dice(n), size: 1, reach: 0.12});
  }
  var stems = [["hibiscus", 2.1, 980], ["orchid", 1.9, 560, {colour: "#b25cc0"}], ["jasmine", 2, 1420], ["kettawa", 1.9, 260],
               ["marigold", 1.8, 1700], ["tahern", 1.7, 1980], ["orchid", 1.8, 2300, {colour: "#e070b0"}], ["hibiscus", 2, 2600, {colour: "#e86a8a"}]];
  stems.forEach(function (s, k) {
    front.push({sprite: plant(s[0], s[1], s[3]), x: s[2], y: 1080, size: 1, reach: k === 0 ? 0 : 0.6});   // the sunbird's hibiscus holds still
  });
  [-160, 120, 2150, 2480].forEach(function (x, k) {    // tall grass at the left, as the reference has it, and more coming in at the end
    tall.push({sprite: grass(620 + 160 * dice(k), 18, 140 + k, THK_GREENS), x: x, y: 1120, size: 1, reach: 0.9});
  });
  [1350, 3300].forEach(function (x, k) {                 // a blade or two passing right by the camera
    near.push({sprite: grass(760, 10, 160 + k, THK_SHADE), x: x, y: 1220, size: 1.2, reach: 1});
  });
  return [
    {depth: 0.4, blur: 3, haze: 0.3, items: back},
    {depth: 0.75, blur: 0.6, items: hedge, live: function (t) {
      for (var k = 0; k < 3; k++) {
        var b = butterflyDrift(t, 500 + k * 700, 420 + k * 120, {vx: 25 - k * 20, weave: 60, seed: k * 2.3});
        butterfly("grassyellow", b.x, b.y, t, {turn: b.turn, size: 1.4, seed: k});
      }
    }},
    {depth: 1, blur: 0, items: front, live: function (t) {
      // the sunbird hovers before the hibiscus at 980, sipping
      sunbird(1110, 885 + 4 * Math.sin(t * 3), t, {hover: 1, sip: 0.7, size: 4, face: -1});
      if ((t > 2 && t < 2.2) || (t > 8 && t < 8.2)) { hear("sunbird", clock, 1110, 885); }
    }},
    {depth: 1.35, blur: 2.2, items: tall},
    {depth: 2.1, blur: 7, items: near}
  ];
}

// The scene at its own second t (0 to HEDGE_LONG). Returns nothing: it draws with pen.
// e.g. s02Hedge(4);
function s02Hedge(t) {
  var layers = thkOnce("hedge", s02Build);
  var sky = pen.createLinearGradient(0, 0, 0, 600);
  sky.addColorStop(0, "#f6f1d4");
  sky.addColorStop(1, "#d8e8b0");
  pen.fillStyle = sky;
  pen.fillRect(0, 0, WIDE, 1080);
  var go = t / HEDGE_LONG;
  thkLayers(t, layers, {x: 50 * t, z: 0.06 * go, y: 0}, "#f0f2d4");
  thkLight(t, 0.5, 4);
  thkVignette(0.3);
}
