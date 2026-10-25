// s23_doi.js - scene 23 of the film of Chang Ngu: Doi Chang Ngu (40 s). Two shots, through black: home at Wiang Phan Kham
// the white elephant kneels, Phrom climbs down and takes off its harness (the chronicle: "ลงจากหลังเปลื้องเครื่องแต่ง"),
// and it walks away alone; and on the plain the people follow it at a distance, out to a lone hill of limestone in the
// paddies (chiangsaen.js karstHill, the owner's pick), where in a burst of light, as at the river, it becomes the pearl
// snake again and slides into the cave at the hill's foot (the chronicle: "กลับกลายเป็นงูไปดังเก่าก็หนีเข้าสู่ดอย");
// the hill's name comes up in gold.
var C23_LONG = 40;
var C23_SOUND = {calls: []};
var C23_LINES = [[1.4, 9.34, "C110"], [9.54, 14.78, "C111"], [16.0, 21.41, "C112"], [21.61, 25.07, "C113"], [26.0, 31.67, "C114"]];
var C23_CUTS = [15.3];
var C23_HILL = [1360, 820, 1.7];                       // the hill: x, foot, size
var C23_CHANGE = [21.4, 23.4];                         // the burst: the elephant becomes the snake

// Home: the elephant kneels; Phrom climbs down; its harness off; it rises and goes.
function c23Home(t) {
  var village = cngVillage(), cam = WIDE * 0.66;
  pen.drawImage(cngSky("day"), 0, 0);
  pen.save(); pen.translate(-cam, 0); pen.drawImage(village.back, 0, 0); pen.restore();
  decorate(t, cngYard(300, 884, 7), "back");                 // the yard's fowl (owner, 2026-10-25)
  csBand(pen, 0, 820, WIDE, 260, "#b9a070", "#9a8058");
  var kneel = between(t, 1, 3) * (1 - between(t, 8, 9.5)), off = t > 6.2, go = between(t, 9, 15.3);
  var ex = mix(980, WIDE + 400, go * go);
  var e = elephant(ex, 860, {size: 0.55, face: 1, colour: "#f1ddd3", cloth: off ? null : "#c9962a", sit: kneel,
                             step: go > 0 ? t / BEAT / 2.4 : 0, trunk: 0.3});
  var down = between(t, 3.2, 5.2), px = mix(e.seat[0], 620, down), py = mix(e.seat[1], 880, down);
  if (down < 1) {
    person(px, py, cngPerson("boy", CNG_PHROM, {id: "phromdown", size: cngAgeSize(16), face: -1, floor: down < 0.3 ? "astride" : undefined, feel: "happy"}));
    if (down > 0) {                                         // he slides down its far side to the ground clear of it: its body before
                                                            // him all the way, so his legs'
      elephant(ex, 860, {size: 0.55, face: 1, colour: "#f1ddd3", cloth: off ? null : "#c9962a", sit: kneel,   // change from astride
                         step: go > 0 ? t / BEAT / 2.4 : 0, trunk: 0.3});                                 // to standing is not seen
    }
  } else {
    var lifts = t > 5.4 && t < 6.6;                         // he lifts the harness off, then stands watching it go
    person(620, 880, cngPerson("boy", CNG_PHROM, {id: "phromdown", size: cngAgeSize(16), face: 1, feel: go > 0 ? "sad" : "happy",
                                                 handA: lifts ? liftHand(0.8) : undefined, at: [ex, 640]}));
    if (off) {
      pen.fillStyle = "#c9962a"; pen.fillRect(480, 860, 120, 22);   // the harness, folded on the ground beside him
      pen.strokeStyle = "#8a5a1a"; pen.lineWidth = 2; pen.strokeRect(480, 860, 120, 22);
    }
  }
}

// The plain: the elephant goes out to the hill, the people far behind; the burst; the snake slides into the cave.
function c23Hill(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 50, CNG_CLOUDS.day);
  cngSkyline(pen, 0, 760, 160, "#b3c4ae", 4);
  csBand(pen, 0, 740, WIDE, 340, "#b3cf82", "#8fb060");
  pen.strokeStyle = "rgba(90, 120, 50, 0.35)"; pen.lineWidth = 1.5;
  for (var b = 1; b < 8; b++) { var by = 760 + b * 22 + b * b * 2; pen.beginPath(); pen.moveTo(0, by); pen.lineTo(WIDE, by + 4 * Math.sin(b)); pen.stroke(); }
  karstHill(pen, C23_HILL[0], C23_HILL[1], C23_HILL[2], {});
  var cave = [C23_HILL[0] + 16 * C23_HILL[2], C23_HILL[1]];
  var walk = between(t, 15.5, C23_CHANGE[0]), ex = mix(200, cave[0] - 120, walk), changed = t > (C23_CHANGE[0] + C23_CHANGE[1]) / 2;
  if (!changed) {
    elephant(ex, 860, {size: 0.42, face: 1, colour: "#f1ddd3", step: walk < 1 ? t / BEAT / 2.4 : 0, trunk: 0.3});
  } else {                                                  // the snake, sliding into the cave: only what is outside shows
    var slide = between(t, C23_CHANGE[1], C23_CHANGE[1] + 6.5);
    pen.save();
    pen.beginPath(); pen.rect(0, 0, cave[0] + 10, 1080); pen.clip();
    riverSnake(mix(cave[0] - 120, cave[0] + 620, slide), cave[1] + 4, {size: 0.6, face: 1, kind: "pearl"});
    pen.restore();
  }
  var people = between(t, 16, 26);                          // the people, far behind, following, then stopping to look
  for (var k = 0; k < 7; k++) {
    var x = mix(-200, 640, people) - k * 52, y = 856 + (k % 3) * 14;
    person(x, y, cngPerson(k % 2 ? "villager" : "weaver", {size: 0.42, id: "follower" + k, face: 1, step: people < 1 ? t / BEAT / 2 + k : 0,
                                                           feel: changed ? "surprised" : undefined, sabai: false}));
  }
  cngBurst(t, cave[0] - 80, 760, C23_CHANGE);
  var a = between(t, 26.2, 27.2) * (1 - between(t, 33, 34));   // the hill's name
  cngGoldName("ดอยช้างงู", "Doi Chang Ngu, the hill of the snake elephant", 560, 220, a);
}

// Scene 23, the entry the film calls (SCENES): t, its own second, 0 to C23_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), cngSkyline(), cngPerson() with CNG_PHROM, cngAgeSize(), cngCutsOver();
// cngBurst(); from chiangsaen.js karstHill();
// from beasts.js elephant(); from naga.js riverSnake(). Its words are C23_LINES (C110 to C114). Its z plan: each shot's
// set, the elephant or the snake, the people, the burst and the name over all.
function cngSceneDoi(t) {
  if (t < C23_CUTS[0]) { c23Home(t); } else { c23Hill(t); }
  cngCutsOver(t, C23_CUTS);
}
