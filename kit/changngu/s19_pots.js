// s19_pots.js - scene 19 of the film of Chang Ngu: golden pots (40 s). Three shots, through black: in the village Phrom,
// the elephant behind him, tells his father to send no more gold to the Khom (the chronicle: "อย่าได้ส่งส่วยแก่พระยาขอม
// ตนนั้นต่อไป ... จงไว้ธุระแก่ลูกเทอญ"); in the stable his father built, the elephant eats grass from a golden salung, and
// then, behind it, a man of the house holds a golden pot for its dung, wrinkling his nose (the chronicle: its vessels
// "for its grass, and even for its dung and its water, all of gold"; the owner's "a quick laugh"); and round the village
// men dig a moat and set up gates of timber in a bank of earth: Wiang Phan.
var C19_LONG = 42;
var C19_SOUND = {calls: []};
var C19_LINES = [[1.4, 5.96, "C087"], [6.16, 14.64, "C088"], [15.8, 18.56, "C089"], [19.0, 21.68, "C090"], [23.0, 26.96, "C091"], [30.0, 35.12, "C092"]];
var C19_CUTS = [15.2, 29.4];

// The yard: Phrom speaks to his father, the elephant standing behind him.
function c19Yard(t) {
  var village = cngVillage(), cam = WIDE * 0.62;
  pen.drawImage(cngSky("day"), 0, 0);
  pen.save(); pen.translate(-cam, 0); pen.drawImage(village.back, 0, 0); pen.restore();
  csBand(pen, 0, 820, WIDE, 260, "#b9a070", "#9a8058");
  var speaks = t > 6.2 && t < 14.2;
  elephant(1420, 830, {size: 0.5, face: -1, colour: "#f1ddd3", cloth: "#c9962a", trunk: 0.2 + 0.2 * Math.sin(t)});
  drawByZ([
    {name: "phrom", kind: "person", x: 980, y: 870, draw: function () {
      person(980, 870, poseEased(t, function (s) {           // his hand out while he speaks, eased in and out (poseEased)
        var speaking = s > 6.2 && s < 14.2;
        return cngPerson("boy", CNG_PHROM, {id: "phrom", size: cngAgeSize(14), face: -1, feel: "happy",
                                            reachA: speaking ? [900, 640 + 20 * Math.sin(s * 2)] : undefined,
                                            mouth: speaking ? {open: 0.06 + 0.24 * Math.abs(Math.sin(s * 7)), wide: 0.5, round: 0.2} : undefined,
                                            at: [680, 600]});
      }));
    }},
    {name: "headman", kind: "person", x: 680, y: 860, draw: function () {
      person(680, 860, cngPerson("noble", Object.assign({}, CNG_HEADMAN, {sarong: CNG_KING.sarong, age: 0.45}),
                                 {id: "phang", face: 1, feel: t > 8 ? "happy" : "surprised", at: [980, 620]}));
    }}
  ]);
}

// The stable: the elephant at its golden salung of grass; then the man with the golden pot behind it.
function c19Stable(t) {
  var village = cngVillage(), cam = WIDE * 0.75, sx = 900, base = 880;
  pen.drawImage(cngSky("day"), 0, 0);
  pen.save(); pen.translate(-cam, 0); pen.drawImage(village.back, 0, 0); pen.restore();
  csBand(pen, 0, 820, WIDE, 260, "#b9a070", "#9a8058");
  cngStable(pen, sx, base, 1, "back");
  var eats = t < 21 ? Math.max(0, Math.sin((t - 15) * 1.4)) : 0;
  salung(pen, sx - 300, base - 4, 0.9, {grass: true});
  elephant(sx + 30, base, {size: 0.55, face: -1, colour: "#f1ddd3", cloth: "#c9962a", trunk: 0.15 + 0.45 * eats, mouth: 0.3 * eats});
  var pot = t > 22.6, plop = between(t, 25.2, 26.0);
  if (pot) {
    var px = sx + 300;
    person(px + 60, base + 10, cngPerson("villager", {size: 0.66, id: "potman", face: -1, sabai: false, feel: t > 25.2 ? "surprised" : "concerned",
                                                      reachA: [px, base - 70], reachB: [px + 20, base - 290]}));   // his other hand at his nose
    goldPot(pen, px, base - 10, 0.8);
    if (plop > 0 && plop < 1) {                            // a small dark ball dropping into the pot
      pen.fillStyle = "#5a4630";
      pen.beginPath(); pen.arc(px - 10, mix(base - 200, base - 70, plop * plop), 9, 0, 7); pen.fill();
    }
  }
  cngStable(pen, sx, base, 1, "front");
}

// Wiang Phan: men dig the moat; the bank of earth with its palisade and a timber gate, opening and shutting.
function c19Moat(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 40, CNG_CLOUDS.day);
  pen.drawImage(cngVillage().back, -WIDE * 0.5, 0);
  cityWall(pen, -60, 760, WIDE + 120, 0.9, {plain: true, open: 0.5 + 0.5 * Math.sin((t - 29.4) * 0.8), outer: true});
  var sprites = [];
  [[300, 1], [520, -1], [1350, 1], [1600, -1]].forEach(function (d, k) {
    var dig = Math.max(0, Math.sin(t * 2.4 + k));
    sprites.push({name: "digger " + k, kind: "person", x: d[0], y: 930, draw: function () {
      var j = person(d[0], 930, cngPerson("villager", {size: 0.66, id: "digger" + k, face: d[1], sabai: false, bend: 0.3 + 0.3 * dig,
                                                      reachA: [d[0] + 60 * d[1], 930 - 200 + 140 * dig]}));
      var w = cngLocal(j.wristA);                          // a hoe (chok) in his hands
      pen.strokeStyle = "#7a5432"; pen.lineWidth = 5;
      pen.beginPath(); pen.moveTo(w[0] - 30 * d[1], w[1] - 50); pen.lineTo(w[0] + 20 * d[1], w[1] + 60); pen.stroke();
      pen.fillStyle = "#4a4a50"; pen.fillRect(w[0] + 10 * d[1] - 6, w[1] + 56, 26 * d[1], 10);
    }});
  });
  drawByZ(sprites);
}

// Scene 19, the entry the film calls (SCENES): t, its own second, 0 to C19_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), cngStable(), cngPerson() with CNG_PHROM and CNG_HEADMAN, cngAgeSize(),
// cngLocal(), cngCutsOver(); from chiangsaen.js salung(), goldPot(), cityWall(); from beasts.js elephant(). Its words are
// C19_LINES (C087 to C092). Its z plan: each shot's set, the stable's back, the elephant, the people by their feet, the
// stable's front.
function cngScenePots(t) {
  if (t < C19_CUTS[0]) { c19Yard(t); }
  else if (t < C19_CUTS[1]) { c19Stable(t); }
  else { c19Moat(t); }
  cngCutsOver(t, C19_CUTS);
}
