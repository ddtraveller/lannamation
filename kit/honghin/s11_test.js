// s11_test.js - scene 11 of the film of Hong Hin: the king's test (50 s). The palace: the king commands his six "heroes"
// to bring back his mother or die. By night at the orchard the six offer the boy more gold. Then the march: three
// thousand men to a great river, where the six sit down on the bank; the stone swan rises over the army and is gone into
// the clouds, and the soldiers go down on their knees.
var H11_LONG = 50;
var H11_SOUND = {calls: [[0.0, "shama", 0.15, 11.38], [12.27, "crickets", 0.2, 7.39], [19.66, "frogs", 0.25, 30.34]]};
var H11_LINES = [[2, 10.36, "H049"], [12.8, 19.03, "H050"], [20, 26.16, "H051"], [29.4, 34.72, "H052"]];
// The lines as the scene was drawn to them; it plays to H11_LINES, Pan's voice (sets.js hhClock()).
var H11_PLAN = [[2, 11.2, "H049"], [12.8, 18, "H050"], [20, 27.8, "H051"], [29.4, 35.4, "H052"]];
var H11_CUTS = [12.2, 19.4];

// The river camp: the Kok's plain (whiteeel/sets.js) by day, the army along the bank, the six sitting. t: seconds;
// kneel: 0 to 1, the soldiers going down on their knees.
function h11Camp(t, kneel) {
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 10, "day");
  welFar(pen, WEL_KOK);
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok);
  sceneryWaterSurface(t, kok);
  var list = [];
  for (var n = 0; n < 14; n++) {                         // the soldiers, in ranks along the bank
    (function (n) {
      var x = 120 + (n % 7) * 150 + (n > 6 ? 70 : 0), y = WEL_KOK_BANK + 120 + (n > 6 ? 120 : 0);
      list.push({name: "soldier " + n, kind: "person", x: x, y: y, draw: function () {
        person(x, y, welPerson("soldier", {size: 0.62 + (n > 6 ? 0.06 : 0)}, {id: "sol" + n, face: 1, floor: kneel > 0.5 ? "cross" : undefined,
                                                                             wai: kneel > 0.7 ? 1 : undefined, feel: kneel > 0 ? "awe" : "neutral",
                                                                             at: kneel > 0 ? [1300, 200] : [1500, 800]}));
      }});
    })(n);
  }
  for (var k = 0; k < 6; k++) {                          // the six, sitting on the bank, afraid of the water
    (function (k) {
      var x = 1240 + k * 105, y = WEL_KOK_BANK + 110 + (k % 2) * 30;
      list.push({name: "son " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, hhSon(k, {face: k % 2 ? -1 : 1, floor: "cross", feel: kneel > 0 ? "awe" : "fear", id: "son" + k,
                               at: kneel > 0 ? [1300, 200] : [1400, WEL_KOK]}));
      }});
    })(k);
  }
  drawByZ(list);
}

// Scene 11, the entry the film calls. From sets.js: hhCourt(), hhSon(), hhBoy(), hhOrchardAt(); whiteeel/sets.js welFar(),
// welPlain(), welKokWater(); himmaphan.js hongHin(), hongHinReins().
function hhSceneTest(t) {
  var said = t; t = hhClock(t, H11_PLAN, H11_LINES, H11_LONG);
  var p = CNG_PALACE;
  if (t < H11_CUTS[0]) {                                // the king commands
    var sons = [];
    for (var k = 0; k < 6; k++) {
      (function (k) {
        var x = p[0] - 360 + k * 140, y = 1010 + (k % 2) * 20;
        sons.push({name: "son " + k, kind: "person", x: x, y: y, draw: function () {
          person(x, y, hhSon(k, {face: x < p[0] ? 1 : -1, floor: "cross", wai: 1, feel: t > 8 ? "fear" : "concerned", id: "son" + k, at: [p[0], 620]}));
        }});
      })(k);
    }
    hhCamera(0.6, p[0], 760, 1.35);
    hhCourt(t, [[0, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, feel: "angry", at: [p[0], 1000],
                                                 mouth: welTalk(t, t > 6 && t < 11)})]], sons);
    hhCameraEnd();
  } else if (t < H11_CUTS[1]) {                          // by night at the orchard: more gold for the boy
    hhCamera(0.9, HH_ORCHARD_HOUSE[0] - 300, 820, 1.6);
    hhOrchardAt(t, "night");
    var bx = HH_ORCHARD_HOUSE[0] - 160;
    person(bx, 990, hhBoy(13, {face: -1, feel: "thinking", at: [bx - 300, 700]}));
    for (var s2 = 0; s2 < 3; s2++) {
      person(bx - 260 - s2 * 120, 1000 + (s2 % 2) * 20, hhSon(s2, {face: 1, feel: "concerned", id: "son" + s2, at: [bx, 700],
                                                                   reachA: s2 === 0 ? [bx - 140, 820] : undefined}));
    }
    pen.fillStyle = "#c8a050"; pen.beginPath(); pen.ellipse(bx - 130, 830, 26, 30, 0, 0, 7); pen.fill(); pen.strokeStyle = "#6e4612"; pen.stroke();
    sceneryLampLight(t, bx - 40, 760, 990, {reach: 260, strength: 0.7, seed: 6});
    hhCameraEnd();
  } else {                                               // the camp; the swan rises over the army; they kneel
    var s = t - H11_CUTS[1], rise = between(t, 30, 38), kneel = between(t, 33, 36);
    hhCamera(0.5, 960, 700, 1.15);
    h11Camp(t, kneel);
    if (rise > 0) {
      var sx = mix(300, 1800, rise), sy = mix(820, 120, rise);
      var h = hongHin(sx, sy, t, {size: 1.6});
      var hands = [h.seat[0] + 50, h.seat[1] - 55];
      person(h.seat[0], h.seat[1], hhBoy(13, {floor: "astride", face: 1, feel: "happy", reachA: hands, reachB: [hands[0] - 10, hands[1] + 6]}));
      hongHinReins(h, hands);
    }
    hhCameraEnd();
  }
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H11_CUTS, H11_PLAN, H11_LINES, H11_LONG));
}
