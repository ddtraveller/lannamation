// s21_sanchai.js - scene 21 of the film of Chang Ngu: Thung San Chai (55 s). Three shots, through black: the Tai march out,
// Phrom on the white elephant's back and the mahout on its neck before him striking the golden plate (the chronicle:
// "มีหมอควานขี่พร้อมสรรพถือพานคำตีนำหน้า"), the men behind with their spears; on the open field of Thung San Chai the
// Black Khom stand ready, their king on a grey elephant; he sees the white elephant, shakes all over, turns his elephant
// and runs, and his men scatter (the chronicle; his own elephants trampling his men is left out: no one is hurt on
// screen); and at Yonok's shut gate the white elephant comes up the road and breaks through it, the doors bursting open
// (the chronicle: "ไสช้างพานคำเข้าแทงประตูเวียงทะลุ").
var C21_LONG = 55;
var C21_SOUND = {calls: []};
var C21_LINES = [[1.4, 4.7, "C099"], [5.4, 13.26, "C100"], [14.4, 18.26, "C101"], [18.46, 25.1, "C102"], [25.3, 29.23, "C103"], [37.0, 44.45, "C104"]];
var C21_CUTS = [13.8, 36.0];
var C21_STRIKES = 0.7;                                 // seconds between the mahout's strokes on the plate

// The white elephant with Phrom on its back and the mahout on its neck striking the plate; at (x, y), its size and
// facing; walking: its step. Gives back the elephant's {seat, head}.
function c21War(t, x, y, size, face, walking) {
  var e = elephant(x, y, {size: size, face: face, colour: "#f1ddd3", cloth: "#c9962a", step: walking ? t / BEAT / 2.4 : 0,
                          trunk: 0.5 + 0.3 * Math.sin(t * 2)});
  var back = [e.seat[0] - face * 130 * size, e.seat[1] + 14 * size];   // Phrom further back, the mahout on the neck
  person(back[0], back[1], cngPerson("boy", CNG_PHROM, {id: "phromwar", size: cngAgeSize(16) * size / 0.6, face: face, floor: "astride",
                                                       feel: "happy", handA: liftHand(0.5)}));
  var hit = Math.max(0, Math.sin((t % C21_STRIKES) / C21_STRIKES * Math.PI));
  var j = person(e.seat[0], e.seat[1], cngPerson("villager", {size: 0.66 * size / 0.6, id: "mahout", face: face, floor: "astride", sabai: false,
                                                              reachA: [e.seat[0] + face * 90 * size, e.seat[1] - 150 * size],
                                                              reachB: [e.seat[0] + face * (60 + 30 * hit) * size, e.seat[1] - 120 * size]}));
  var hand = cngLocal(j.wristA);
  pen.strokeStyle = "#b8294a"; pen.lineWidth = 3;
  pen.beginPath(); pen.moveTo(hand[0], hand[1]); pen.lineTo(hand[0], hand[1] + 26 * size); pen.stroke();
  cngPlate(hand[0], hand[1] + 70 * size, 0.42 * size / 0.6, t);
  return e;
}

// The march: the Tai cross the field from the left to the right behind the white elephant.
function c21March(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 10, "day");
  pen.drawImage(cngFields(), 0, -120);
  crowd(t, 820, t * 40, false);
  var go = t * 70, sprites = [];
  sprites.push({name: "white elephant", kind: "elephant", x: 700 + go, y: 900, draw: function () { c21War(t, 700 + go, 900, 0.6, 1, true); }});
  for (var k = 0; k < 9; k++) {
    (function (k) {
      var x = 420 + go - (k % 5) * 150 - Math.floor(k / 5) * 70, y = 960 + Math.floor(k / 5) * 40;
      sprites.push({name: "tai " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, cast("soldier", {size: 0.62, id: "tai" + k, face: 1, step: t / BEAT / 2 + k}));
      }});
    })(k);
  }
  drawByZ(sprites);
  cngBeds(t, "fields", "frame");
}

// Thung San Chai: the Khom ready on the right, their king on a grey elephant; the white elephant comes on from the left;
// he shakes, turns his elephant and runs; his men scatter.
function c21Field(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 50, "day");
  pen.drawImage(cngFields(), 0, -120);
  var come = between(t, 14.0, 19.4), wx = mix(-300, 520, come);
  var shake = t > 19.4 && t < 25.6 ? 8 * Math.sin(t * 50) : 0, flee = between(t, 25.8, 34);
  var kx = mix(1380, WIDE + 600, flee * flee), kface = t > 25.8 ? 1 : -1;
  var sprites = [];
  sprites.push({name: "white elephant", kind: "elephant", x: wx, y: 900, draw: function () { c21War(t, wx, 900, 0.6, 1, come < 1); }});
  sprites.push({name: "khom elephant", kind: "elephant", x: kx + shake, y: 880, draw: function () {
    var e = elephant(kx + shake, 880, {size: 0.55, face: kface, colour: "#8a8a8a", cloth: "#1e1e24", step: flee > 0 ? t / BEAT / 2 : 0,
                                       trunk: flee > 0 ? 0.7 : 0.2, mouth: flee > 0 ? 0.4 : 0});
    person(e.seat[0], e.seat[1], cngPerson("khomsoldier", CNG_KHOM_KING, {id: "khomkingrides", size: 0.6, face: kface, floor: "astride",
                                                                          feel: t > 19.4 ? "fear" : "angry"}));
  }});
  for (var k = 0; k < 10; k++) {
    (function (k) {
      var x0 = 1150 + (k % 5) * 150 + Math.floor(k / 5) * 60, y = 930 + Math.floor(k / 5) * 46;
      var away = between(t, 26.4 + k * 0.15, 33), dir = k % 3 === 0 ? -0.4 : 1, x = x0 + dir * 1100 * away;
      sprites.push({name: "khom " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, cast("khomsoldier", {size: 0.6, id: "khom" + k, face: away > 0 ? (dir > 0 ? 1 : -1) : -1,
                                          step: away > 0 ? t / BEAT * 1.4 + k : 0, feel: t > 19 ? "fear" : undefined}));
      }});
    })(k);
  }
  drawByZ(sprites);
  cngBeds(t, "fields", "frame");
}

// Yonok's gate, shut; the white elephant comes up the road and breaks it open, the doors bursting, dust thrown up.
function c21Gate(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 70, "day");
  pen.drawImage(cngFields(), 0, 0);
  var up = between(t, 36.4, 42.6), hit = 42.6;
  cngGateWall(t < hit ? 0 : Math.min(1, (t - hit) * 4));
  if (t >= hit && t < hit + 1.6) {                         // the dust of the doors bursting
    var u = (t - hit) / 1.6;
    pen.fillStyle = "rgba(200, 180, 140, " + (0.7 * (1 - u)).toFixed(3) + ")";
    for (var d = 0; d < 18; d++) {
      pen.beginPath(); pen.arc(CNG_GATE[0] + (dice(d) - 0.5) * 300 * (0.4 + u), CNG_GATE[1] - 60 * u - 80 * dice(d + 3), 30 + 40 * u, 0, 7); pen.fill();
    }
  }
  if (t < hit + 0.6) {
    var x = mix(300, CNG_GATE[0] - 20, up), y = mix(1080, CNG_GATE[1] + 80, up), size = mix(0.6, 0.32, up);
    c21War(t, x, y, size, 1, up < 1);
  }
  cngBeds(t, "fields", "frame");
}

// Scene 21, the entry the film calls (SCENES): t, its own second, 0 to C21_LONG (55 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngFields(), cngGateWall(), CNG_GATE, cngPerson() with CNG_PHROM and CNG_KHOM_KING,
// cngAgeSize(), cngLocal(), cngPlate(), cngCutsOver(); from beasts.js elephant(); from oldcartoon.js crowd(). Its words
// are C21_LINES (C099 to C104). Its z plan: each shot's set, then by drawByZ the elephants and the people by their feet.
function cngSceneSanchai(t) {
  if (t < C21_CUTS[0]) { c21March(t); }
  else if (t < C21_CUTS[1]) { c21Field(t); }
  else { c21Gate(t); }
  cngCutsOver(t, C21_CUTS);
}
