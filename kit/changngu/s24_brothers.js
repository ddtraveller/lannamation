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
// Its life (decorate.js; owner, 2026-10-25): two egrets over the fields of the new city once the words are done; and
// over the wild bank, butterflies (2026-10-27).
var C24_LIFE = [
  {name: "butterfly", kind: "butterfly", layer: "back", look: {size: 0.8, seed: 5},
   course: [[24.2, 300, 990], [27, 520, 1000, "sip"], [30, 520, 1000], [35, 900, 980, "sip"], [37, 900, 980], [40, 1300, 990]]},
  {name: "butterfly, right", kind: "butterfly", layer: "back", look: {kind: "birdwing", size: 0.7, seed: 6},
   course: [[24.2, 1800, 960], [28, 1610, 990, "sip"], [31, 1610, 990], [40, 1100, 970]]},
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
  cngClouds(t + 30, "day");
  pen.drawImage(cngCourt(), 0, 0);
  cngBeds(t, "court", "back");
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
  pen.drawImage(cngSky("sunset"), 0, 0);                  // a sunset of its own (the scenery pass, 2026-10-26)
  cngClouds(t + 80, "dusk");
  pen.drawImage(cngCourt(), 0, 0);
  cngBeds(t, "court", "back");
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

// Wiang Chai Prakan on the Kok, painted (the scenery pass, 2026-10-26): its back once (Chang Ngu's range, the plain,
// the rampart of earth and its timber gate), the Kok a water mirroring them (scenery.js), its near bank once (grass
// along the water's edge).
var C24_TOWN = null;
var C24_WATER = {edge: [[-300, C24_KOK[0] + C24_KOK[1] + 40], [-300, C24_KOK[0]], [WIDE / 2, C24_KOK[0] + 1], [WIDE + 300, C24_KOK[0]],
                        [WIDE + 300, C24_KOK[0] + C24_KOK[1] + 40]],
                 top: [[-300, C24_KOK[0]], [WIDE / 2, C24_KOK[0] + 1], [WIDE + 300, C24_KOK[0]]], line: C24_KOK[0], left: 0, right: WIDE,
                 foot: C24_KOK[0] + C24_KOK[1] + 10, depths: ["#7fa9a4", "#5f8e8a"], mirror: [[C24_KOK[0], 0.95], [C24_KOK[0] + 40, 0.7]],
                 tint: "40, 84, 80", rings: [[400, C24_KOK[0] + 40, 34.5], [1300, C24_KOK[0] + 50, 37.2]], mist: null};
function c24TownSet() {
  if (C24_TOWN) { return C24_TOWN; }
  var back = document.createElement("canvas"), near = document.createElement("canvas");
  back.width = near.width = WIDE;
  back.height = near.height = 1080;
  var b = back.getContext("2d"), n = near.getContext("2d"), keep = pen, k, x;
  cngFar(b, 0, 600);
  csBand(b, 0, 560, WIDE, 520, "#a9c97a", "#86a85a");
  cityWall(b, -100, C24_WALL[0], WIDE + 200, C24_WALL[1], {plain: true, open: 1});
  // The land about the new town grassy and wild (the owner, 2026-10-27: "Add some vegetation to scene 24. make it
  // grassy and wild but beautiful"): from the outer rampart's crest to the Kok a meadow in flower, the porters' track
  // worn through it to the gate, bamboo and a flame of the forest at its ends; the near bank tall grass in plume,
  // reeds at the water, flowering bushes and wild flowers, a strip of sand left at the water's edge.
  sceneryMeadow(b, 0, WIDE, 672, C24_KOK[0] + 2, {seed: 24, haze: "#b4cfa0", many: 1.6, depth: [0.15, 0.42]});
  b.fillStyle = "rgba(196, 172, 122, 0.85)";            // the porters' track along the bank and up to the bridge
  b.beginPath(); b.moveTo(-20, C24_WALL[0] + 100); b.quadraticCurveTo(600, C24_WALL[0] + 98, 900, C24_WALL[0] + 82);
  b.lineTo(930, C24_WALL[0] + 50); b.lineTo(990, C24_WALL[0] + 50); b.lineTo(1000, C24_WALL[0] + 92);
  b.quadraticCurveTo(600, C24_WALL[0] + 124, -20, C24_WALL[0] + 122); b.closePath(); b.fill();
  bamboo(b, 120, C24_WALL[0] + 92, 0.5, 7);
  bamboo(b, 1820, C24_WALL[0] + 96, 0.55, 9);
  thkTreeOn(b, 1700, C24_WALL[0] + 104, 0.24, 77, [["thongkwao", 30, 14]]);
  var foot = C24_KOK[0] + C24_KOK[1];
  csBand(n, 0, foot, WIDE, 1080 - foot, "#b9a070", "#9a8058");   // the near bank: sand at the water's edge
  sceneryMeadow(n, 0, WIDE, foot + 26, 1080, {seed: 241, haze: "#b4cfa0", many: 1.6, depth: [0.5, 1]});
  pen = n;
  for (k = 0, x = 10; x < WIDE; k++) {                  // reeds and grass along the water, over the sand's edge, in clumps
    thkPlace(sceneryGrass(40 + 90 * dice(k), 9 + Math.floor(6 * dice(k + 1)), 541 + k), x, foot + 28 + 10 * dice(k + 7), 0.8 + 0.5 * dice(k + 2), 0);
    x += dice(k + 5) < 0.3 ? 150 + 120 * dice(k + 6) : 30 + 40 * dice(k + 6);
  }
  [[150, 1000, 1.5], [620, 1012, 1.3], [1020, 996, 1.2], [1380, 1006, 1.45], [1840, 1004, 1.4]].forEach(function (g, k) {   // tall grass in plume
    thkPlace(sceneryGrassBank(170, 300 + k), g[0], g[1], g[2], 0);
  });
  [[430, 1050, ["phayasuea", 26, 9, "#ec6c9c"]], [1110, 1056, ["jasmine", 30, 7]], [1610, 1046, ["hibiscus", 10, 10, "#d93a2e"]]].forEach(function (bush, k) {
    thkPlace(sceneryBush(220, 100, 611 + k, THK_GREENS, [bush[2]]), bush[0], bush[1], 1, 0);   // flowering bushes
  });
  pen = keep;
  C24_TOWN = {back: back, near: near};
  return C24_TOWN;
}
// porters carry earth in at the gate; Phrom and Kaeo Supha on the bank; the town's name in gold.
function c24Town(t) {
  var town = c24TownSet();
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 110, "day");
  pen.drawImage(town.back, 0, 0);
  sceneryWaterDepths(C24_WATER);                        // the Kok
  sceneryWaterSurface(t, C24_WATER);
  pen.drawImage(town.near, 0, 0);
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
  cngBeds(t, "fields", "frame");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.45, 35]});
}

// Scene 24, the entry the film calls (SCENES): t, its own second, 0 to C24_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngCourt(), cngPalace(), CNG_PALACE, cngFar(), cngPorter(), cngPerson() with
// CNG_KING, CNG_QUEEN, CNG_PHROM, CNG_THUKKHITA and CNG_KAEO_SUPHA, cngAgeSize(), cngCutsOver(); from chiangsaen.js cityWall(); from
// band.js musician(). Its words are C24_LINES (C115 to C119). Its z plan: each shot's set; by drawByZ the hall's back,
// who sits on the dais and the hall's front in "set", then the people in the courtyard or on the bank by their feet.
function cngSceneBrothers(t) {
  if (t < C24_CUTS[0]) { c24Court(t); }
  else if (t < C24_CUTS[1]) { c24Wedding(t); }
  else { c24Town(t); }
  cngCutsOver(t, C24_CUTS);
}
