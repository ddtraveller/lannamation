// s20_three.js - scene 20 of the film of Chang Ngu: three years (55 s). Four shots, through black: on the field below the
// village Phrom rides the white elephant at a charge, and the men of Si Tuang drill with their spears in rows (the
// chronicle: "หัดช้างมงคลตัวนั้น ... หัดพวกสีนาคและปืนไฟทั้งมวลไปทุกวัน", the elephant and the spearmen and gunmen trained
// every day); at Yonok's gate two men in plain cloth go in among the people, his spies; the years go over the field,
// the light of each season, and Phrom is sixteen; and in Yonok the Black Khom king, three years without his gold,
// shouts for his army (the chronicle: ready "ภายในสามวัน", in three days), and the spies slip out to carry the news.
var C20_LONG = 55;
var C20_SOUND = {calls: []};
var C20_LINES = [[1.4, 8.71, "C093"], [9.8, 14.04, "C094"], [17.0, 25.4, "C095"], [27.4, 32.88, "C096"], [33.08, 38.56, "C097"], [38.76, 42.8, "C098"]];
var C20_CUTS = [9.3, 16.4, 26.6];

// The training field: the elephant charging across with Phrom on it, the spearmen drilling in two rows. age: Phrom's.
// The drill field below the village painted once (the scenery pass, 2026-10-26): grass, worn to the earth in patches
// where the men drill and the elephant runs, tufts standing in it.
var C20_GROUND = null;
function c20Ground() {
  if (C20_GROUND) { return C20_GROUND; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), n;
  csBand(b, 0, 800, WIDE, 280, "#a9c97a", "#86a85a");
  for (n = 0; n < 40; n++) {                             // the worn patches, flattened with the distance
    var x = dice(n * 3 + 1) * WIDE, y = 812 + Math.pow(dice(n * 5 + 2), 0.9) * 260, near = (y - 800) / 280;
    var g = b.createRadialGradient(x, y, 2, x, y, 60 + 120 * near);
    g.addColorStop(0, "rgba(176, 150, 100, 0.5)"); g.addColorStop(1, "rgba(176, 150, 100, 0)");
    b.save(); b.translate(x, y); b.scale(1, 0.28); b.translate(-x, -y);
    b.fillStyle = g; b.fillRect(x - 200, y - 200, 400, 400);
    b.restore();
  }
  b.strokeStyle = "rgba(70, 110, 40, 0.5)";              // the grass's blades, larger near
  for (n = 0; n < 900; n++) {
    var gx = dice(n * 7 + 3) * WIDE, gy = 806 + Math.pow(dice(n * 11 + 5), 0.8) * 274, l = 3 + 9 * (gy - 800) / 280;
    b.lineWidth = 0.6 + (gy - 800) / 280;
    b.beginPath(); b.moveTo(gx, gy); b.lineTo(gx + (dice(n) - 0.5) * l * 0.6, gy - l); b.stroke();
  }
  C20_GROUND = paper;
  return paper;
}

function c20Field(t, age, season) {
  var village = cngVillage();
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 60, "day");
  pen.drawImage(village.back, -WIDE * 0.3, 0);
  pen.drawImage(c20Ground(), 0, 0);
  var lap = (t * 0.09) % 1, ex = mix(-500, WIDE + 500, lap);
  var e = elephant(ex, 840, {size: 0.5, face: 1, colour: "#f1ddd3", regalia: true, step: t / BEAT / 2.2, trunk: 0.6});
  person(e.seat[0], e.seat[1], cngPerson("boy", CNG_PHROM, {id: "phromrides", size: cngAgeSize(age), face: 1, floor: "astride",
                                                           feel: "happy", handA: liftHand(0.7)}));
  var sprites = [], thrust = Math.max(0, Math.sin(t * 2.6));
  for (var k = 0; k < 10; k++) {
    (function (k) {
      var x = 360 + (k % 5) * 260 + Math.floor(k / 5) * 90, y = 930 + Math.floor(k / 5) * 40;
      sprites.push({name: "spearman " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, cast("soldier", {size: 0.62, id: "drill" + k, face: 1, reachA: [x + 90 + 60 * thrust, y - 250 + 10 * thrust]}));
      }});
    })(k);
  }
  drawByZ(sprites);
  if (season !== undefined) {
    pen.fillStyle = ["rgba(60, 120, 60, 0.12)", "rgba(230, 170, 60, 0.16)", "rgba(220, 225, 235, 0.22)"][season];
    pen.fillRect(0, 0, WIDE, 1080);
  }
  cngBeds(t, "village", "frame");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.45, 29]});
}

// Yonok's gate: two men in plain cloth go in among the townspeople; the guards see nothing.
function c20Spies(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 90, "day");
  pen.drawImage(cngFields(), 0, 0);
  cngGateWall(1);
  var sprites = [];
  [["spy", 0], ["spy", 1], ["farmer", 2], ["weaver", 3]].forEach(function (p, i) {
    var u = between(t, 9.5 + i * 0.6, 16.2 + i * 0.6);
    if (u <= 0 || u >= 1) { return; }
    var x = mix(200 + i * 60, CNG_GATE[0] - 10, u), y = mix(1060, CNG_GATE[1] + 70, u), size = mix(0.7, 0.36, u);
    sprites.push({name: "walker " + i, kind: "person", x: x, y: y, draw: function () {
      pen.save(); pen.globalAlpha = 1 - between(u, 0.86, 1);
      person(x, y, cngPerson(p[0] === "spy" ? "villager" : p[0], {size: size, id: "walker" + i, face: 1, step: t / BEAT / 2 + i, sabai: false,
                                                                    turban: p[0] === "spy" ? "#6a5a4a" : undefined}));
      pen.restore();
    }});
  });
  [[CNG_GATE[0] - 170, -1], [CNG_GATE[0] + 170, 1]].forEach(function (g, i) {
    sprites.push({name: "guard " + i, kind: "person", x: g[0], y: CNG_GATE[1] + 60, draw: function () {
      person(g[0], CNG_GATE[1] + 60, cast("khomsoldier", {size: 0.4, id: "guard" + i, face: -g[1]}));
    }});
  });
  drawByZ(sprites);
  cngBeds(t, "fields", "frame");
}

// Yonok: the Khom king on the step of his hall, furious; his soldiers hurry off to gather the army; the two spies at the
// courtyard's edge turn and slip away.
function c20Khom(t) {
  var p = CNG_PALACE, floor = hoKhamFloor(p[1], p[2]);
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 20, "day");
  pen.drawImage(cngCourt(), 0, 0);
  cngBeds(t, "court", "back");
  var shouts = (t > 33.08 && t < 38.16), stamp = t > 27.4 && t < 31 ? Math.abs(Math.sin(t * 6)) : 0;
  var go = between(t, 38.0, 44.0), spies = between(t, 38.76, 45.2);
  drawByZ([
    {name: "hall, back", kind: "palace", z: "set", y: floor - 1, draw: function () { cngPalace("back"); }},
    {name: "hall, front", kind: "palace", z: "set", y: floor, draw: function () { cngPalace("front"); }},
    {name: "khom king", kind: "person", x: p[0] - 100, y: floor + 60 - 6 * stamp, draw: function () {
      person(p[0] - 100, floor + 60 - 6 * stamp, poseEased(t, function (s) {   // his fist up as he stamps and shouts, eased (poseEased)
        var shouting = s > 33.08 && s < 38.16;
        var stamping = between(s, 27.4, 27.9) * (1 - between(s, 30.5, 31)) * (0.5 - 0.5 * Math.cos((s - 27.4) * 7));   // a smooth pump from rest, no corners
        return cngPerson("khomsoldier", CNG_KHOM_KING, {id: "khomking", face: -1, feel: "angry", handA: liftHand(shouting ? 0.9 : 0.4 * stamping),
                                                        mouth: shouting ? {open: 0.2 + 0.3 * Math.abs(Math.sin(s * 8)), wide: 0.7, round: 0.3} : undefined});
      }));
    }},
    {name: "khom 1", kind: "person", x: mix(p[0] - 380, -200, go), y: floor + 130, draw: function () {
      person(mix(p[0] - 380, -200, go), floor + 130, cast("khomsoldier", {size: 0.76, id: "kc1", face: go > 0 ? -1 : 1, step: go > 0 ? t / BEAT / 1.6 : 0}));
    }},
    {name: "khom 2", kind: "person", x: mix(p[0] + 160, -100, go), y: floor + 150, draw: function () {
      person(mix(p[0] + 160, -100, go), floor + 150, cast("khomsoldier", {size: 0.78, id: "kc2", face: go > 0 ? -1 : 1, step: go > 0 ? t / BEAT / 1.6 + 0.5 : 0}));
    }},
    {name: "spy 1", kind: "person", x: mix(1700, WIDE + 200, spies), y: 1000, draw: function () {
      person(mix(1700, WIDE + 200, spies), 1000, cngPerson("villager", {size: 0.74, id: "spy1", face: spies > 0 ? 1 : -1, sabai: false, turban: "#6a5a4a",
                                                                        step: spies > 0 ? t / BEAT / 1.4 : 0, feel: "concerned"}));
    }},
    {name: "spy 2", kind: "person", x: mix(1820, WIDE + 320, spies), y: 1010, draw: function () {
      person(mix(1820, WIDE + 320, spies), 1010, cngPerson("villager", {size: 0.72, id: "spy2", face: spies > 0 ? 1 : -1, sabai: false, turban: "#6a5a4a",
                                                                        step: spies > 0 ? t / BEAT / 1.4 + 0.5 : 0, feel: "concerned"}));
    }}
  ]);
}

// Scene 20, the entry the film calls (SCENES): t, its own second, 0 to C20_LONG (55 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), cngFields(), cngGateWall(), CNG_GATE, cngCourt(), cngPalace(),
// CNG_PALACE, cngPerson() with CNG_PHROM and CNG_KHOM_KING, cngAgeSize(), cngCutsOver(); from beasts.js elephant().
// Its words are C20_LINES (C093 to C098). Its z plan: each shot's set, the elephant, then by drawByZ the people by
// their feet (in the courtyard the hall in "set"), the season's light over the field.
function cngSceneThree(t) {
  if (t < C20_CUTS[0]) { c20Field(t, 14); }
  else if (t < C20_CUTS[1]) { c20Spies(t); }
  else if (t < C20_CUTS[2]) { var y = Math.min(2, Math.floor(between(t, 16.4, 26.6) * 3)); c20Field(t, 14 + y, y); }
  else { c20Khom(t); }
  cngCutsOver(t, C20_CUTS);
}
