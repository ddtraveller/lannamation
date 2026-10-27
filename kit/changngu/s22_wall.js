// s22_wall.js - scene 22 of the film of Chang Ngu: the stone wall (40 s). Three shots, through black: the road south
// through the forest, the white elephant and the Tai after the fleeing Khom, the days and nights of a month going over
// it (the chronicle: "ไปได้เดือนหนึ่ง"); in heaven, among the clouds, a golden light, and a deva sent down from it (the
// chronicle: Indra, pitying the Khom, "บังคับยังเทวบุตร ให้ลงมาเนรมิตกำแพงหินศิลา", sent a deva to make a wall of stone);
// and on the road the deva comes down in its light and a wall of cut stone rises across the way before the elephant;
// Phrom stops, looks, and turns back; far off, beyond the wall, the Khom go on down the Ping to the sea.
var C22_LONG = 42;
var C22_SOUND = {calls: []};
var C22_LINES = [[1.4, 6.09, "C105"], [10.8, 15.49, "C106"], [16.0, 22.38, "C107"], [29.4, 32.62, "C108"], [33.6, 37.96, "C109"]];
var C22_CUTS = [9.8, 23.0];
var C22_ROAD = 900;

// The road south through the forest, painted once (the scenery pass, 2026-10-26): Chang Ngu's range, the slope
// clothed in forest (scenery.js sceneryForest()), flowers near its foot, the road across with its ruts, grass along it.
var C22_ROAD_SET = null;
function c22RoadSet() {
  if (C22_ROAD_SET) { return C22_ROAD_SET; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), keep = pen, n;
  cngFar(b, 0, 640);
  sceneryForest(b, function (x) { return 700 - 60 * Math.sin(x * 0.004) - 30 * Math.sin(x * 0.011); },
                {left: -50, right: WIDE + 50, blooms: CNG_FOREST_BLOOMS, pines: 16, top: 560, foot: 900, haze: "#b6c4c0", seed: 21});
  csBand(b, 0, 840, WIDE, 240, "#c9b285", "#a8926a");
  b.fillStyle = "rgba(140, 116, 70, 0.3)";               // its ruts
  [880, 940].forEach(function (y) { b.fillRect(0, y, WIDE, 4); });
  pen = b;                                               // grass along its edge
  for (n = 0; n < 18; n++) { thkPlace(sceneryGrass(30 + 34 * dice(n), 8, 531 + n), 50 + n * 110 + 40 * dice(n + 3), 846, 1, 0); }
  pen = keep;
  C22_ROAD_SET = paper;
  return paper;
}

// The road south through the forest; night: how far into the night (fine stars and the moon come out).
function c22Road(t, night) {
  pen.drawImage(cngSky("day"), 0, 0);
  if (night > 0) {
    pen.globalAlpha = night; pen.drawImage(cngSky("night"), 0, 0); pen.globalAlpha = 1;
    sceneryStars(t, {band: null, horizon: 700, count: 1600, bright: 24, glow: null, alpha: night});
    sceneryMoon(t, 1500, 180, 34, {alpha: night});
  }
  cngClouds(t + 30, "day", 1 - night);
  pen.drawImage(c22RoadSet(), 0, 0);
  if (night > 0) { pen.fillStyle = "rgba(10, 14, 40, " + (0.55 * night).toFixed(3) + ")"; pen.fillRect(0, 0, WIDE, 1080); }
}

// The white elephant and Phrom going along the road, its men behind; x: the elephant's place; walking or stopped; face.
function c22Riders(t, x, walking, face) {
  var sprites = [];
  sprites.push({name: "white elephant", kind: "elephant", x: x, y: C22_ROAD, draw: function () {
    var e = elephant(x, C22_ROAD, {size: 0.55, face: face, colour: "#f1ddd3", regalia: true, step: walking ? t / BEAT / 2.4 : 0,
                                   trunk: walking ? 0.3 : 0.8, mouth: walking ? 0 : 0.3});
    person(e.seat[0], e.seat[1], cngPerson("boy", CNG_PHROM, {id: "phromwall", size: cngAgeSize(16), face: face, floor: "astride",
                                                             feel: walking ? "angry" : "surprised"}));
  }});
  for (var k = 0; k < 5; k++) {
    (function (k) {
      var mx = x - face * (380 + k * 130), my = C22_ROAD + 40 + (k % 2) * 30;
      sprites.push({name: "tai " + k, kind: "person", x: mx, y: my, draw: function () {
        person(mx, my, cast("soldier", {size: 0.6, id: "taiwall" + k, face: face, step: walking ? t / BEAT / 2 + k : 0}));
      }});
    })(k);
  }
  drawByZ(sprites);
}

// Heaven: clouds lit gold from within, rays; a deva sets out from the light and goes down.
function c22Heaven(t) {
  csBand(pen, 0, 0, WIDE, 1080, "#f6e6c0", "#c9b4dc");
  var rays = pen.createRadialGradient(WIDE / 2, 300, 20, WIDE / 2, 300, 900);
  rays.addColorStop(0, "rgba(255, 246, 210, 0.95)"); rays.addColorStop(1, "rgba(255, 230, 170, 0)");
  pen.fillStyle = rays; pen.fillRect(0, 0, WIDE, 1080);
  var gold = ["#d9c8e8", "#f2dcc4", "#fff6e0"];             // soft clouds lit gold from within, above and below
  sceneryClouds(t * 3 + 10, {colours: gold, count: 5, top: 60, bottom: 360, wide: [360, 620], seed: 22});
  sceneryClouds(t * 3 + 40, {colours: gold, count: 6, top: 700, bottom: 1040, wide: [420, 720], seed: 23});
  var down = between(t, 16, 20.8);
  if (down > 0) {
    thewada(mix(WIDE / 2, WIDE / 2 + 200, down), mix(320, 1200, down * down), t, {size: 1.1, face: 1, scarves: true, light: 1});
  }
}

// Scene 22, the entry the film calls (SCENES): t, its own second, 0 to C22_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngFar(), cngPerson() with CNG_PHROM, cngAgeSize(), cngCutsOver(); from
// scenery.js sceneryForest(); from himmaphan.js thewada(); from chiangsaen.js risingWall(); from beasts.js elephant().
// Its words are C22_LINES (C105 to C109). Its z plan: each shot's set, the wall, then by drawByZ the elephant and the
// men by their feet, the deva and its light over all.
function cngSceneWall(t) {
  if (t < C22_CUTS[0]) {
    var cycle = 0.5 - 0.5 * Math.cos(t / C22_CUTS[0] * Math.PI * 6);   // three days and nights go over the road
    c22Road(t, cycle);
    c22Riders(t, mix(-200, WIDE + 300, t / C22_CUTS[0]), true, 1);
  } else if (t < C22_CUTS[1]) {
    c22Heaven(t);
  } else {
    c22Road(t, 0);
    var far = between(t, 33.6, 41);                         // beyond, the Ping winding to the south, the Khom far down it
    pen.strokeStyle = "#86aca8"; pen.lineWidth = 14;
    pen.beginPath(); pen.moveTo(1720, 650); pen.quadraticCurveTo(1880, 700, 1840, 780); pen.stroke();
    pen.fillStyle = "#1e1e24";
    for (var k = 0; k < 8; k++) { pen.beginPath(); pen.arc(mix(1730, 1850, far) + k * 7, mix(654, 740, far) + 3 * Math.sin(k), 3, 0, 7); pen.fill(); }
    var rise = between(t, 23.6, 28.4);
    var deva = between(t, 23, 26) * (1 - between(t, 31, 33));
    if (deva > 0) {                                          // the deva over the road, in its light
      var g = pen.createRadialGradient(1420, 280, 20, 1420, 280, 520);
      g.addColorStop(0, "rgba(255, 244, 200, " + (0.6 * deva).toFixed(3) + ")"); g.addColorStop(1, "rgba(255, 230, 160, 0)");
      pen.fillStyle = g; pen.fillRect(0, 0, WIDE, 1080);
      pen.save(); pen.globalAlpha = deva;
      thewada(1420, 280 + 10 * Math.sin(t), t, {size: 1.0, face: -1, scarves: true, light: 1});
      pen.restore();
    }
    risingWall(pen, 1100, C22_ROAD + 20, 560, 380, rise);
    var stop = between(t, 23, 26.5), turn = t > 30.4, back = between(t, 31, 41);
    var ex = turn ? mix(860, -400, back) : mix(-300, 860, stop);
    c22Riders(t, ex, (stop > 0 && stop < 1) || (turn && back < 1), turn ? -1 : 1);
  }
  cngCutsOver(t, C22_CUTS);
}
