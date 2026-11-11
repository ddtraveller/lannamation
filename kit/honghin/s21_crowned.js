// s21_crowned.js - scene 21 of the film of Hong Hin: Hong Hin is crowned (60 s). The three floating palaces settle inside
// the palace walls; the princesses bow. Seven nights of festival: lanterns rising, lamps, dancers. The crowning by day:
// water poured from a conch over the boy, the bai si beside him, white threads; on the dais the boy, Vimala beside him,
// his three wives, his grandmother and the old gardeners in new clothes; the stone swan on the palace roof folds its wings.
var H21_LONG = 60;
var H21_SOUND = {calls: [[0, "birds", 0.2, 9], [9, "crowd", 0.25, 14], [23, "gong", 0.3], [40, "birds", 0.2, 20]]};
var H21_LINES = [[2, 7.6, "H092"], [9, 13.2, "H093"], [14.6, 22.2, "H094"], [23.6, 29.2, "H095"], [31, 40.2, "H096"]];
var H21_CUTS = [8.6, 14.2];
var HH_GRAN_HOME = Object.assign({}, HH_OLD_QUEEN, {size: 0.62});

// The palace court with the three palaces come down inside its walls, behind the hall. t: seconds; land: 0 to 1.
function h21Court(t, land, onDais, sprites) {
  var p = CNG_PALACE;
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 50, "day");
  pen.drawImage(cngCourt(), 0, 0);
  vimana(260, mix(300, 640, land), t, {kind: "prasat", size: 0.3});
  vimana(1700, mix(260, 620, land), t + 2, {kind: "lotus", size: 0.3});
  vimana(560, mix(200, 600, land), t + 4, {kind: "hall", size: 0.26});
  cngBeds(t, "court", "back");
  hhCourt2(t, onDais, sprites);
}
// hhCourt's people and hall over a court already drawn.
function hhCourt2(t, onDais, sprites) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]);
  var list = [{name: "hall, back", kind: "palace", z: "set", y: dais - 1, draw: function () { cngPalace("back"); }},
              {name: "hall, front", kind: "palace", z: "set", y: dais + 1, draw: function () { cngPalace("front"); }}];
  (onDais || []).forEach(function (d, k) {
    list.push({name: "dais " + k, kind: "person", z: "set", x: p[0] + d[0], y: dais, draw: function () { person(p[0] + d[0], dais, d[1]); }});
  });
  drawByZ(list.concat(sprites || []));
}

// Scene 21, the entry the film calls. From sets.js: hhBoy(), HH_BOY_CROWNED, hhVimala(), HH_KING; ogre.js ogreDaughter();
// honghin.js vimana(), baiSri(), conch(); himmaphan.js hongHin().
function hhSceneCrowned(t) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]);
  var wives = function (feel, wai) {
    return [["mukhawadi", p[0] - 420], ["culakantha", p[0] + 360], ["salicanta", p[0] + 520]].map(function (d, k) {
      return {name: d[0], kind: "person", x: d[1], y: 1000 + (k % 2) * 20, draw: function () {
        person(d[1], 1000 + (k % 2) * 20, ogreDaughter(d[0], {size: 0.74, id: d[0], face: d[1] < p[0] ? 1 : -1, floor: wai ? "side" : undefined,
                                                              wai: wai ? 1 : undefined, feel: feel, at: [p[0], dais - 100]}));
      }};
    });
  };
  if (t < H21_CUTS[0]) {                                // the palaces come down; the princesses bow
    hhCamera(0.3, p[0], 700, 1.15);
    h21Court(t, between(t, 0, 6), [[-70, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, feel: "happy"})],
                                    [70, hhVimala({floor: "side", face: -1, feel: "happy"})]], wives("happy", t > 5));
    hhCameraEnd();
  } else if (t < H21_CUTS[1]) {                          // the festival nights: lanterns, lamps, dancers
    pen.drawImage(welSky("clear"), 0, 0);
    sceneryStars(t, {band: null, horizon: 600, count: 1800, bright: 18, glow: null, seed: 47, alpha: 1});
    pen.drawImage(cngCourt(), 0, 0);
    hhCourt2(t, [], []);
    hhNight(0.55, t);
    for (var n = 0; n < 5; n++) {
      var dx = 300 + n * 330;
      person(dx, 1000, welPerson("woman:dancer", {size: 0.7}, {id: "dancer" + n, face: n % 2 ? -1 : 1, dance: true, feel: "happy"}));
      sceneryLampLight(t, dx + 120, 900, 1000, {reach: 200, strength: 0.8, seed: n});
    }
    for (var l = 0; l < 9; l++) { lantern(150 + l * 200 + 30 * Math.sin(l * 2), 700 - ((t - H21_CUTS[0]) * 40 + l * 60) % 700, 34); }
  } else {                                               // the crowning by day
    var pour = between(t, 15, 18) * (1 - between(t, 22, 23));
    hhCamera(0.75, p[0], 720, 1.3);
    var sprites = wives("happy", true).concat([
      {name: "grandmother", kind: "person", x: p[0] - 260, y: 1010, draw: function () {
        person(p[0] - 260, 1010, welPerson("grandmother", HH_GRAN_HOME, {id: "oldqueen", floor: "side", face: 1, feel: "happy", at: [p[0], dais - 100]}));
      }},
      {name: "gardeners", kind: "person", x: p[0] + 220, y: 1030, draw: function () {
        person(p[0] + 220, 1030, welPerson("elder", {size: 0.66, shirt: "#f4efe2", sabai: ["#f4efe2", "#c8a050"]}, {id: "oldman", floor: "cross", face: -1, feel: "happy", at: [p[0], dais - 100]}));
        person(p[0] + 120, 1040, welPerson("grandmother", {size: 0.62, shirt: "#f4efe2"}, {id: "oldwoman", floor: "side", face: -1, feel: "happy", at: [p[0], dais - 100]}));
      }},
      {name: "brahman", kind: "person", x: p[0] + 150, y: dais + 4, draw: function () {
        person(p[0] + 150, dais + 4, welPerson("elder", WEL_BRAHMAN, {id: "brahman", face: -1, size: 0.62, reachA: pour > 0 ? [p[0] + 40, dais - 230] : undefined}));
        if (pour > 0) {
          conch(p[0] + 40, dais - 236, 0.45);
          pen.strokeStyle = "rgba(200, 230, 255, " + (0.8 * pour) + ")"; pen.lineWidth = 4;
          pen.beginPath(); pen.moveTo(p[0] + 20, dais - 230); pen.quadraticCurveTo(p[0] - 10, dais - 200, p[0] - 30, dais - 150); pen.stroke();
        }
      }}
    ]);
    h21Court(t, 1, [[-30, hhBoy(16, Object.assign({}, HH_BOY_CROWNED, {size: 0.72, floor: "cross", face: 1, feel: "happy", id: "king2"}))],
                    [-160, hhVimala({floor: "side", face: 1, feel: "happy", size: 0.7})]], sprites);
    baiSri(p[0] + 260, dais + 2, 0.32, t);
    var roof = between(t, 40, 46);                        // the stone swan on the palace roof, folding its wings
    hongHin(p[0] + 20, dais - 420 + 10 * Math.sin(t * 0.6), t, {size: 0.9, soar: roof > 0, seed: 2});
    hhCameraEnd();
    if (t > 46) { pen.fillStyle = "rgba(0, 0, 0, " + between(t, 54, 60).toFixed(3) + ")"; pen.fillRect(0, 0, WIDE, 1080); }
  }
  welFadeIn(t, 1.5);
  hhCuts(t, H21_CUTS);
}
