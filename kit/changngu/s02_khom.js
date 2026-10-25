// s02_khom.js - scene 2 of the film of Chang Ngu: the Black Khom take Yonok (40 s). Three shots, a fade through black
// between each: Yonok's courtyard, young King Phang on the dais of his hall, two courtiers on the floor before him;
// outside the city, its gate opening and a column of the Black Khom marching up the road and in at it (no fighting:
// the chronicle has the city simply taken); and the courtyard again, the Khom king on the dais, and King Phang led
// away across the courtyard between two Khom soldiers, his head down.
var C02_LONG = 40;
var C02_SOUND = {calls: []};
var C02_LINES = [[1.2, 7.8, "C005"], [13.2, 19.22, "C006"], [19.42, 24.92, "C007"], [27.4, 31.32, "C008"]];
var C02_CUTS = [12, 26];                               // where the shots change, through black
var C02_COLUMN = 9;                                    // the Khom soldiers in the column

// How dark the sheet is at second t from the cuts: 1 at a cut, 0 half a second either side. e.g. c02Dark(12.2)
function c02Dark(t) {
  return C02_CUTS.reduce(function (most, at) { return Math.max(most, 1 - Math.abs(t - at) / 0.5); }, 0);
}

// The court: the sky, the courtyard and the hall, someone on the dais (who: a look, drawn seated), two courtiers on the
// floor before it, and the scene's walkers (draw, drawn last, in the courtyard). t: seconds.
function c02Court(t, who, walkers) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]), floor = hoKhamFloor(p[1], p[2]);
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 50, CNG_CLOUDS.day);
  pen.drawImage(cngCourt(), 0, 0);
  drawByZ([
    {name: "hall, back", kind: "palace", z: "set", y: dais - 1, draw: function () { cngPalace("back"); }},
    {name: "on the dais", kind: "person", z: "set", x: p[0], y: dais, draw: function () { person(p[0], dais, who); }},
    {name: "hall, front", kind: "palace", z: "set", y: dais + 1, draw: function () { cngPalace("front"); }},
    {name: "courtier, left", kind: "person", x: p[0] - 230, y: floor + 40, draw: function () {
      person(p[0] - 230, floor + 40, cngPerson("fellow", {size: 0.62, sabai: ["#9a8a66", "#6a5a44", "check"], floor: "cross",
                                                          id: "courtier1", face: 1, at: [p[0], dais - 80]}));
    }},
    {name: "courtier, right", kind: "person", x: p[0] + 230, y: floor + 40, draw: function () {
      person(p[0] + 230, floor + 40, cngPerson("fellow", {size: 0.62, sabai: ["#7a9ab0", "#3a4a6a", "check"], floor: "cross",
                                                          id: "courtier2", face: -1, at: [p[0], dais - 80]}));
    }}
  ].concat(walkers || []));
}

// The gate: the fields, the wall with its gate opening, the column of Khom marching up the road and in. t: seconds.
function c02Gate(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 80, CNG_CLOUDS.day);
  pen.drawImage(cngFields(), 0, 0);
  cngGateWall(between(t, 12.5, 15.5));
  var sprites = [];
  [1, -1].forEach(function (side) {                       // two columns, one from the near left and its mirror from the
    var late = side > 0 ? 0 : 0.55, tag = side > 0 ? "" : "r";   // near right (owner, 2026-10-25), a half step behind
    for (var n = 0; n < C02_COLUMN; n++) {
      var u = between(t, 13.5 + late + n * 1.1, 21 + late + n * 1.1);   // each soldier up the road to the bridge
      if (u <= 0 || u >= 1) { continue; }
      var x = WIDE / 2 - side * mix(WIDE / 2 - 140, WIDE / 2 - CNG_GATE[0] + 10, u), y = mix(1070, CNG_GATE[1] + 70, u);
      var size = mix(0.7, 0.36, u);
      (function (x, y, size, u, n, step) {
        sprites.push({name: "khom " + tag + n, kind: "person", x: x, y: y, draw: function () {
          pen.save();
          pen.globalAlpha = 1 - between(u, 0.86, 1);     // they pass in at the gate
          person(x, y, cast("khomsoldier", {size: size, face: side, step: step, id: "khom" + tag + n}));
          pen.restore();
        }});
      })(x, y, size, u, n, (t - 13.5 - late - n * 1.1) / BEAT / 2);
    }
  });
  drawByZ(sprites);
}

// Scene 2, the entry the film calls (SCENES): t, its own second, 0 to C02_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngSky("day"), CNG_CLOUDS.day, cngCourt(), cngPalace(), CNG_PALACE, cngFields(),
// cngGateWall(), CNG_GATE, cngPerson() with CNG_KING, CNG_KHOM_KING. Its words are C02_LINES (C005 to C009).
// Its z plan: in the courtyard, by drawByZ the hall's back, who sits on the dais and the hall's front in "set", and
// in "people" by their feet the courtiers and those who walk; at the gate the set first, then the soldiers by their
// feet, nearer lower. e.g. cngSceneKhom(20);
function cngSceneKhom(t) {
  var p = CNG_PALACE;
  if (t < C02_CUTS[0]) {
    c02Court(t, cngPerson("noble", CNG_KING, {id: "phang", floor: "cross", face: -1, at: [p[0] - 600, 900]}));
  } else if (t < C02_CUTS[1]) {
    c02Gate(t);
  } else {
    var lead = between(t, 28, 39);                       // King Phang led away to the left between two Khom soldiers
    var x = mix(p[0] - 40, -260, lead), y = 1000;
    var step = (t - 28) / BEAT / 2;
    var walkers = [
      {name: "phang, led away", kind: "person", x: x, y: y, draw: function () {
        person(x, y, cngPerson("noble", CNG_KING, {id: "phang2", face: -1, step: lead > 0 && lead < 1 ? step : 0, feel: "sad",
                                                   regalia: false, pins: false}));
      }},
      {name: "khom, behind", kind: "person", x: x + 150, y: y - 30, draw: function () {
        person(x + 150, y - 30, cast("khomsoldier", {size: 0.78, face: -1, step: lead > 0 && lead < 1 ? step : 0, id: "guard1"}));
      }},
      {name: "khom, beside", kind: "person", x: x + 90, y: y + 30, draw: function () {
        person(x + 90, y + 30, cast("khomsoldier", {size: 0.8, face: -1, step: lead > 0 && lead < 1 ? step + 0.5 : 0, id: "guard2"}));
      }}
    ];
    c02Court(t, cngPerson("khomsoldier", CNG_KHOM_KING, {id: "khomking", floor: "cross", face: -1, at: [x, y - 200]}), walkers);
  }
  var dark = c02Dark(t);
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
  cngFadeIn(t, 1);
}
