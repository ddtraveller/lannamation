// s06_eel.js - scene 6 of the film of the White Eel: the white eel (45 s). Three shots, through black, on the Kok on a
// bright day: people fishing from the bank, a pole and line, and under the water a long pale shape going by; then the
// eel rises, swimming at the surface, as thick as a sugar palm and seven fathoms long (the kit's whiteEel(),
// chiangsaen.js), and the people gather, shouting, and two throw ropes over it; then on the plain, the eel lying
// caught (its killing is not shown), and a line of people hauling it on ropes toward the city, its body cutting a long
// groove in the ground behind it (the groove that will be the Mae Nam Lak, scene 12).
var W06_LONG = 46.39;
var W06_SOUND = {calls: [[0, "wind", 0.1, 46.39], [2.63, "plover", 0.18], [11.0, "kingfisher", 0.18], [15.0, "egret", 0.14]]};
var W06_LINES = [[1.4, 7.01, "W019"], [11.0, 15.99, "W020"], [25.0, 31.15, "W021"]];
var W06_CUTS = [9.45, 22.0];
var W06_BANK_Y = 790;                                  // where the people stand on the near bank
var W06_FISHERS = [["farmer", {size: 0.74}, 620], ["villager", {size: 0.74, turban: "#2a6a5a"}, 860], ["boy", {size: 0.48}, 980],
                   [3, {size: 0.7, free: true}, 1180], ["fellow", {size: 0.74}, 1420]];
var W06_HAULERS = [["soldier", {size: 0.74, holding: null}], ["farmer", {size: 0.74}], ["villager", {size: 0.74, turban: "#c9962a"}],
                   ["fellow", {size: 0.74}], ["khammun", {size: 0.74}], ["villager", {size: 0.74, turban: "#2a4a6a"}], ["inta", {size: 0.74}]];

// The Kok's set: the sky, the hills, the plain, the river and its face; what (a function) is drawn in the water,
// under its face, and over (a function), drawn on it. Shared by the three shots.
function w06River(t, under, over) {
  pen.drawImage(welSky("day"), -60, 0, WIDE + 120, 1080);
  welClouds(t + 200, "day");
  welFlocks(t, [[-300, 210, 52]]);
  welFar(pen, WEL_KOK);
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok);
  if (under) { under(); }
  welFish(t, [["barb", 520, 680, 200, 0.6, 3], ["gourami", 1180, 692, 160, 0.6, 4]]);
  sceneryWaterSurface(t, kok);
  if (over) { over(); }
  natGlitter(t, 1300, WEL_KOK, WEL_KOK_BANK, 0.5, "255, 250, 230");
}

// A fishing pole from his hand at (hx, hy), out over the water, and its line down to it.
function w06Pole(hx, hy, t) {
  var tipX = hx + 210, tipY = hy - 120 + 4 * Math.sin(t * 1.3);
  pen.save();
  pen.strokeStyle = "#8a6a3a"; pen.lineWidth = 3; pen.lineCap = "round";
  pen.beginPath(); pen.moveTo(hx, hy); pen.quadraticCurveTo(hx + 110, hy - 80, tipX, tipY); pen.stroke();
  pen.strokeStyle = "rgba(240, 240, 230, 0.7)"; pen.lineWidth = 1;
  pen.beginPath(); pen.moveTo(tipX, tipY); pen.lineTo(tipX + 6, WEL_KOK + 70); pen.stroke();
  pen.restore();
}

// The people on the bank: fishing, then staring and pointing as the shape goes by (shot 1), or gathered, shouting, two
// throwing ropes (shot 2). Pushes their sprites.
function w06Bank(t, sprites, shot, eelHead) {
  W06_FISHERS.forEach(function (f, k) {
    var x = f[2] + (shot ? 60 * between(t, 9.45, 13) * (k < 2 ? 1 : -1) : 0), y = W06_BANK_Y + (k % 2) * 18;
    var seen = shot ? true : t > 4.64, pointing = (k === 1 || k === 3) && seen;
    var roping = shot && (k === 0 || k === 4) && t > 17.5;
    sprites.push({name: "fisher " + k, kind: "person", x: x, y: y, draw: function () {
      var look = {id: "fisher" + k, face: 1, feel: seen ? "surprised" : undefined, at: seen ? (eelHead || [1300, 660]) : [x + 200, 660],
                  mouth: welTalk(t + k, shot && Math.sin(t * 1.4 + k) > 0)};
      if (pointing) { look.reachA = [x + 170, y - 200, between(t, shot ? 10 : 5.6, (shot ? 10 : 5.6) + 0.5)]; }
      if (roping) { look.reachA = [x + 120, y - 200, between(t, 17.5, 18)]; }
      var j = person(x, y, welPerson(f[0], f[1], look));
      if (!shot && k === 0) { var w = cngLocal(j.wristA); w06Pole(w[0], w[1], t); }
      if (roping && eelHead) {                          // the rope, thrown out over the eel
        var r = cngLocal(j.wristA), out = between(t, 17.6, 19.4);
        pen.save(); pen.strokeStyle = "#b89a5a"; pen.lineWidth = 3;
        pen.beginPath(); pen.moveTo(r[0], r[1]);
        pen.quadraticCurveTo(mix(r[0], eelHead[0], 0.5), Math.min(r[1], eelHead[1]) - 120 * out, mix(r[0], eelHead[0] + (k ? 120 : -60), out), mix(r[1], eelHead[1] + 10, out));
        pen.stroke(); pen.restore();
      }
    }});
  });
}

// Shot 1: fishing; the pale shape under the water.
function w06Fishing(t) {
  w06River(t, null, function () {                    // the shape, seen through the water's face
    var x = mix(1900, 700, between(t, 2.63, 9.45)), a = between(t, 2.63, 3.79) * 0.5;
    var g = pen.createRadialGradient(x, 668, 6, x, 668, 220);
    g.addColorStop(0, "rgba(246, 240, 236, " + a.toFixed(3) + ")");
    g.addColorStop(1, "rgba(246, 240, 236, 0)");
    pen.save(); pen.fillStyle = g; pen.translate(x, 668); pen.scale(1, 0.12); pen.translate(-x, -668);
    pen.beginPath(); pen.arc(x, 668, 220, 0, 7); pen.fill(); pen.restore();
  });
  var sprites = [];
  w06Bank(t, sprites, 0, null);
  sprites.push.apply(sprites, welPlainTreeSprites());   // the trees by their feet, among the people
  drawByZ(sprites);
}

// Shot 2: the eel rises and swims at the surface; they gather, shouting; two throw ropes.
function w06Rises(t) {
  var hx = mix(1560, 1080, between(t, 9.45, 21)), up = between(t, 9.76, 12.2), head = null;
  w06River(t);
  pen.save();
  pen.beginPath(); pen.rect(0, 0, WIDE, WEL_KOK_BANK + 8); pen.clip();   // only the river shows it
  pen.translate(0, 30 * (1 - up));
  head = whiteEel(hx, 668, t, {size: 0.82, face: -1});
  pen.restore();
  ripples(pen, [[hx - 40, 670, 10.3], [hx + 300, 676, 10.8], [hx + 620, 672, 11.4]], t);
  var sprites = [];
  w06Bank(t, sprites, 1, head);
  sprites.push.apply(sprites, welPlainTreeSprites());   // the trees by their feet, among the people
  drawByZ(sprites);
}

// Shot 3: the eel caught, hauled across the plain toward the city; the groove behind it.
function w06Haul(t) {
  var u = between(t, W06_CUTS[1], W06_LONG), hx = mix(1200, 420, u), y = 846;
  w06River(t);
  pen.save();                                          // the groove it cuts in the ground: from the river's edge, round
  var groove = new Path2D();                           // and along behind it, turned earth with a dark wet middle
  groove.moveTo(WIDE + 80, WEL_KOK_BANK + 14);
  groove.bezierCurveTo(1700, WEL_KOK_BANK + 30, 1600, y + 4, hx + 560, y + 4);
  pen.lineCap = "round";
  [[44, "#a8865a"], [30, "#7a5a3a"], [12, "#5a4028"]].forEach(function (band) {
    pen.strokeStyle = band[1]; pen.lineWidth = band[0]; pen.stroke(groove);
  });
  pen.restore();
  var head = [hx, y - 20], sprites = [{name: "eel", kind: "beast", x: hx + 250, y: y + 6, draw: function () {
    whiteEel(hx, y, t, {caught: true, size: 0.72, face: -1});
  }}];
  W06_HAULERS.forEach(function (h, k) {
    var x = hx - 150 - k * 105, py = y + (k % 2 ? 22 : -8);
    sprites.push({name: "hauler " + k, kind: "person", x: x, y: py, draw: function () {
      var j = person(x, py, welPerson(h[0], h[1], {id: "hauler" + k, face: -1, step: t / BEAT * 0.6 + k, bend: 0.22, feel: "happy",
                                                   reachB: [x + 50, py - 170], reachA: [x + 40, py - 150], mouth: welTalk(t + k, k % 3 === 0 && Math.sin(t + k) > 0.3)}));
      var w = cngLocal(j.wristB);
      pen.save(); pen.strokeStyle = "#b89a5a"; pen.lineWidth = 3;          // the rope over the shoulder, back to the eel
      pen.beginPath(); pen.moveTo(w[0], w[1]); pen.lineTo(head[0] + 10, head[1] + 4); pen.stroke(); pen.restore();
    }});
  });
  sprites.push.apply(sprites, welPlainTreeSprites());   // the trees by their feet, among the people
  drawByZ(sprites);
}

// Scene 6, the entry the film calls (SCENES): t, its own second, 0 to W06_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: the Kok and its plain (welKokWater(), welPlain(), welPlainTreeSprites(), WEL_KOK, WEL_KOK_BANK), welPerson(),
// welTalk(); from chiangsaen.js whiteEel(); from changngu/sets.js cngLocal(), cngCutsOver(). Its words are W06_LINES.
function welSceneEel(t) {
  if (t < W06_CUTS[0]) { w06Fishing(t); }
  else if (t < W06_CUTS[1]) { w06Rises(t); }
  else { w06Haul(t); }
  welDragonflies(t, [["glider", [1280, 750, 1800, 850], 5, 1.8]]);
  sceneryBeds(t, thkOnce("wel-plain-frame", function () {
    return [{sprite: sceneryGrass(300, 18, 621), x: 40, y: 1110}, {sprite: sceneryGrass(280, 16, 627), x: WIDE - 20, y: 1110}];
  }), {blur: 5, sway: 0.4});
  sceneryAir(t, {butterfly: null, petals: null, light: [0.4, 12]});
  cngCutsOver(t, W06_CUTS);
  welFadeIn(t, 1.5);
}
