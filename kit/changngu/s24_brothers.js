// s24_brothers.js - scene 24 of the film of Chang Ngu: two brothers (40 s). Three shots, through black: in Yonok's hall
// King Phang sits on the dais again, the queen beside him (the chronicle: Phangkharat king once more); he holds out his
// hand to Phrom in the courtyard, to make him uparaja; Phrom gives it to his elder brother, and Thukkhita goes forward
// and makes a wai before the king (the chronicle: Phrom would not take it, "ยกให้ทุกขิตผู้พี่"); at dusk in the same hall
// the wedding, Phrom and Nang Kaeo Supha on the dais, the king by them, the band of the north playing below (as the
// first tale's wedding, maeng/s12); and on the Kok, Wiang Chai Prakan going up, a town of earth and timber (cityWall
// plain: a new frontier town, its ramparts of earth, as the ruins of the Lanna frontier towns are), people carrying
// earth in at its gate, Phrom and his wife on the bank watching; its name comes up in gold.
var C24_LONG = 40;
var C24_SOUND = {calls: []};
var C24_LINES = [[1.4, 5.76, "C115"], [6.0, 10.44, "C116"], [10.64, 15.48, "C117"], [16.8, 20.78, "C118"], [25.0, 33.04, "C119"]];
// Its life (decorate.js; owner, 2026-10-25): two egrets over the fields of the new city once the words are done.
var C24_LIFE = [
  {name: "egret", kind: "egret", layer: "back", look: {fly: true, size: 0.8, seed: 1}, course: [[33.4, -150, 380], [40.5, 2100, 330]]},
  {name: "egret, behind", kind: "egret", layer: "back", look: {fly: true, size: 0.7, seed: 3}, course: [[34.0, -260, 430], [41.0, 2000, 360]]}
];
var C24_CUTS = [15.8, 24.2];
var C24_PHANG = Object.assign({}, CNG_KING, {age: 0.45});              // Phang, the boys' father, older now
var C24_GROOM = Object.assign({}, CNG_PHROM, {sarong: ["#5a3f32", BROCADE], smile: 0.8});
var C24_WALL = [620, 0.9];                                             // Wiang Chai Prakan's rampart: its foot, its size
var C24_KOK = [770, 80];                                               // the Kok before it: its far edge, how wide

// Yonok's hall by day: the king and queen on the dais, the brothers in the courtyard; Thukkhita goes forward.
function c24Court(t) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]);
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 30, CNG_CLOUDS.day);
  pen.drawImage(cngCourt(), 0, 0);
  var go = between(t, 11.6, 13.8), tx = mix(420, 760, go), wai = between(t, 13.9, 14.6);
  function kingAt(s) {                                                  // the king's look at second s: his hand out to Phrom
    var offers = between(s, 6.2, 7.2) * (1 - between(s, 10.4, 11.2)), going = between(s, 11.6, 13.8);
    return cngPerson("noble", C24_PHANG, {id: "phangagain", floor: "cross", face: -1, feel: "happy",
                                          reachA: offers > 0 ? [mix(p[0] - 110, p[0] - 230, offers), dais - 120 + 20 * offers] : undefined,
                                          at: [going > 0 ? mix(420, 760, going) : 560, 700]});
  }
  function phromAt(s) {                                                 // Phrom's at s: his hand toward his brother, then a wai
    var gives = s > 10.6 && s < 12.4, going = between(s, 11.6, 13.8), out = between(s, 10.6, 11.1) * (1 - between(s, 11.9, 12.4));
    return cngPerson("boy", CNG_PHROM, {id: "phromcourt", size: cngAgeSize(16), face: gives || going > 0 ? -1 : 1, feel: "happy",
                                        reachA: gives ? [470, 760, out] : undefined, wai: going >= 1 ? between(s, 13.9, 14.6) : undefined});
  }
  drawByZ([
    {name: "hall, back", kind: "palace", z: "set", y: dais - 1, draw: function () { cngPalace("back"); }},
    {name: "king", kind: "person", z: "set", x: p[0] - 60, y: dais, draw: function () {
      person(p[0] - 60, dais, poseEased(t, kingAt));          // eased wherever his look steps (poseEased)
    }},
    {name: "queen", kind: "person", z: "set", x: p[0] + 90, y: dais, draw: function () {
      person(p[0] + 90, dais, cngPerson("maiden", CNG_QUEEN, {id: "thewiagain", floor: "side", face: -1, feel: "happy", age: 0.4}));
    }},
    {name: "hall, front", kind: "palace", z: "set", y: dais + 1, draw: function () { cngPalace("front"); }},
    {name: "phrom", kind: "person", x: 560, y: 900, draw: function () {
      person(560, 900, poseEased(t, phromAt));
    }},
    {name: "thukkhita", kind: "person", x: tx, y: 905, draw: function () {
      person(tx, 905, cngPerson("boy", CNG_THUKKHITA, {id: "thukkhitacourt", size: cngAgeSize(16), face: 1,
                                                       step: go > 0 && go < 1 ? t / BEAT / 2 : 0, feel: "happy",
                                                       wai: wai > 0 ? wai : undefined}));
    }},
    {name: "guard 1", kind: "person", x: 300, y: 890, draw: function () { person(300, 890, cast("soldier", {size: 0.7, id: "courtguard1", face: 1})); }},
    {name: "guard 2", kind: "person", x: 1700, y: 890, draw: function () { person(1700, 890, cast("soldier", {size: 0.7, id: "courtguard2", face: -1})); }}
  ]);
}

// The wedding, at dusk in the same hall: the king, the groom and the bride on the dais; the band in the courtyard.
function c24Wedding(t) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]), dusk = ["#e8682e", 0.22];
  pen.drawImage(cngSky("dusk"), 0, 0);
  cumulus(pen, t + 80, CNG_CLOUDS.dusk);
  pen.drawImage(cngCourt(), 0, 0);
  pen.fillStyle = "rgba(200, 90, 50, 0.22)";                           // the court in the dusk's light
  pen.fillRect(0, 0, WIDE, 1080);
  var sprites = [
    {name: "hall, back", kind: "palace", z: "set", y: dais - 1, draw: function () { cngPalace("back", dusk); }},
    {name: "king", kind: "person", z: "set", x: p[0] - 200, y: dais, draw: function () {
      person(p[0] - 200, dais, cngPerson("noble", C24_PHANG, {id: "phangwed", floor: "cross", face: 1, feel: "happy", at: [p[0], dais - 100]}));
    }},
    {name: "groom", kind: "person", z: "set", x: p[0] - 50, y: dais, draw: function () {
      person(p[0] - 50, dais, cngPerson("boy", C24_GROOM, {id: "groom", size: cngAgeSize(16), floor: "cross", face: 1, feel: "happy",
                                                         at: [p[0] + 80, dais - 90]}));
    }},
    {name: "bride", kind: "person", z: "set", x: p[0] + 80, y: dais, draw: function () {
      person(p[0] + 80, dais, cngPerson("lady", CNG_KAEO_SUPHA, {id: "kaeosupha", floor: "side", face: -1, feel: "happy", at: [p[0] - 50, dais - 90]}));
    }},
    {name: "hall, front", kind: "palace", z: "set", y: dais + 1, draw: function () { cngPalace("front", dusk); }}
  ];
  [["salo", "fellow", 300], ["sueng", "farmer", 450], ["pichum", "elder", 600]].forEach(function (player, n) {
    sprites.push({name: "player" + n, kind: "person", x: player[2], y: 862, draw: function () {
      musician(player[2], 862, player[0], cast(player[1], {size: 0.68, face: 1, id: "wedplayer" + n}), n * 0.3);
    }});
  });
  drawByZ(sprites);
}

// Wiang Chai Prakan on the Kok: the far hills, its rampart of earth and its timber gate, the bank, the river nearest;
// porters carry earth in at the gate; Phrom and Kaeo Supha on the bank; the town's name in gold.
function c24Town(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 110, CNG_CLOUDS.day);
  cngSkyline(pen, 0, 600, 200, "#a9bca6", 9);
  csBand(pen, 0, 560, WIDE, 520, "#a9c97a", "#86a85a");
  cityWall(pen, -100, C24_WALL[0], WIDE + 200, C24_WALL[1], {plain: true, open: 1});
  csBand(pen, 0, C24_KOK[0], WIDE, C24_KOK[1], "#7fa9a4", "#5f8e8a");   // the Kok
  waves(pen, 0, C24_KOK[0] + 6, WIDE, C24_KOK[1] - 10, "rgba(240, 250, 240, 0.35)", t * 30);
  csBand(pen, 0, C24_KOK[0] + C24_KOK[1], WIDE, 1080 - C24_KOK[0] - C24_KOK[1], "#b9a070", "#9a8058");   // the near bank
  var bank = C24_WALL[0] + 110, sprites = [];
  for (var k = 0; k < 4; k++) {
    (function (k) {
      var u = ((t - C24_CUTS[1]) * 0.07 + k * 0.25) % 1, x = mix(-100, 960, u);   // along the bank to the gate, and in
      sprites.push({name: "porter " + k, kind: "person", x: x, y: bank, draw: function () {
        pen.save(); pen.globalAlpha = 1 - between(u, 0.9, 1);
        cngPorter(x, bank, cngPerson("villager", {size: 0.42, id: "wcporter" + k, face: 1, step: t / BEAT / 2 + k, sabai: false}));
        pen.restore();
      }});
    })(k);
  }
  sprites.push({name: "phrom", kind: "person", x: 1440, y: bank + 6, draw: function () {
    person(1440, bank + 6, cngPerson("boy", CNG_PHROM, {id: "phromtown", size: 0.46, face: -1, feel: "happy", at: [960, 520]}));
  }});
  sprites.push({name: "kaeo supha", kind: "person", x: 1530, y: bank + 2, draw: function () {
    person(1530, bank + 2, cngPerson("lady", CNG_KAEO_SUPHA, {id: "kaeotown", size: 0.44, face: -1, feel: "happy", at: [960, 520]}));
  }});
  decorate(t, C24_LIFE, "back");
  drawByZ(sprites);
  var a = between(t, 33.2, 34.2) * (1 - between(t, 38.6, 39.6));      // the town's name
  cngGoldName("เวียงไชยปราการ", "Wiang Chai Prakan, on the Kok", 960, 220, a);
}

// Scene 24, the entry the film calls (SCENES): t, its own second, 0 to C24_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngCourt(), cngPalace(), CNG_PALACE, cngSkyline(), cngPorter(), cngPerson() with
// CNG_KING, CNG_QUEEN, CNG_PHROM, CNG_THUKKHITA and CNG_KAEO_SUPHA, cngAgeSize(), cngCutsOver(); from chiangsaen.js cityWall(); from
// band.js musician(). Its words are C24_LINES (C115 to C119). Its z plan: each shot's set; by drawByZ the hall's back,
// who sits on the dais and the hall's front in "set", then the people in the courtyard or on the bank by their feet.
function cngSceneBrothers(t) {
  if (t < C24_CUTS[0]) { c24Court(t); }
  else if (t < C24_CUTS[1]) { c24Wedding(t); }
  else { c24Town(t); }
  cngCutsOver(t, C24_CUTS);
}
