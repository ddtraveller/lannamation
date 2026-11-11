// s18_speaks.js - scene 18 of the film of Hong Hin: the grandmother speaks (55 s). The palace: the six bring the old queen
// home as heroes; a feast made ready. She weeps at a window; the king asks; she turns on him: those six never saved me.
// The fair: a high pavilion, the whole city coming in by one gate; from the pavilion she sees a boy at the gate and cries
// out to her grandson.
var H18_LONG = 55;
var H18_SOUND = {calls: [[38.6, "plate-ting", 0.25]]};
var H18_LINES = [[2, 11.9, "H079"], [12.1, 18.46, "H080"], [18.66, 24.82, "H081"], [25.6, 32.02, "H082"], [35, 39.86, "H083"]];
// The lines as the scene was drawn to them; it plays to H18_LINES, Pan's voice (sets.js hhClock()).
var H18_PLAN = [[2, 8.6, "H079"], [10, 15.6, "H080"], [17, 24.2, "H081"], [25.6, 33.2, "H082"], [35, 41.2, "H083"]];
var H18_CUTS = [9.6, 25.2];
var H18_PAV = [1380, 960, 0.9];

// Scene 18, the entry the film calls. From sets.js: hhCourt(), hhSon(), HH_OLD_QUEEN, hhPavilion(), hhBoy().
function hhSceneSpeaks(t) {
  var said = t; t = hhClock(t, H18_PLAN, H18_LINES, H18_LONG);
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]);
  if (t < H18_CUTS[0]) {                                // the six bring her home as heroes
    var sons = [];
    for (var k = 0; k < 6; k++) {
      (function (k) {
        var x = p[0] - 500 + k * 110 + (k > 2 ? 560 : 0), y = 1000 + (k % 2) * 24;
        sons.push({name: "son " + k, kind: "person", x: x, y: y, draw: function () {
          person(x, y, hhSon(k, {face: x < p[0] ? 1 : -1, feel: "happy", id: "son" + k, at: [p[0], 620]}));
        }});
      })(k);
    }
    hhCamera(0.5, p[0], 760, 1.3);
    hhCourt(t, [[-80, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, feel: "happy", at: [p[0] + 80, 640]})],
                [80, welPerson("grandmother", HH_OLD_QUEEN, {id: "oldqueen", floor: "side", face: -1, feel: "sad", at: [p[0] - 80, 640]})]], sons);
    hhCameraEnd();
  } else if (t < H18_CUTS[1]) {                          // in the hall: she weeps; the king asks; she speaks
    hhCamera(1, p[0], 640, 2.1);
    hhCourt(t, [[-80, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, feel: t > 17 ? "surprised" : "concerned",
                                                   at: [p[0] + 80, dais - 120], mouth: welTalk(t, t > 10 && t < 13)})],
                [80, welPerson("grandmother", HH_OLD_QUEEN, {id: "oldqueen", floor: "side", face: -1, feel: t > 15 ? "angry" : "sad", tears: t < 15 ? 1 : 0,
                                                             mouth: welTalk(t, welSays(t, H18_PLAN, ["H080", "H081"])), at: [p[0] - 80, dais - 120]})]], []);
    hhCameraEnd();
  } else {                                               // the fair: the pavilion, the one gate, the city coming in
    var s = t - H18_CUTS[1], seen = t > 36;
    pen.drawImage(cngSky("day"), 0, 0);
    cngClouds(t + 30, "day");
    pen.drawImage(cngFields(), 0, 0);
    cngGateWall(1, t);
    for (var b = 0; b < 5; b++) { tung(pen, 200 + b * 360, 900, t, b % 2 === 0); }
    var top = hhPavilion(H18_PAV[0], H18_PAV[1], H18_PAV[2], "back");
    person(H18_PAV[0], top + 4, welPerson("grandmother", HH_OLD_QUEEN, {id: "oldqueen", face: -1, size: 0.46, feel: seen ? "surprised" : "neutral",
                                                                         mouth: welTalk(t, t > 36 && t < 41), at: seen ? [CNG_GATE[0], 820] : [600, 900],
                                                                         reachA: seen ? [H18_PAV[0] - 80, top - 120] : undefined}));
    hhPavilion(H18_PAV[0], H18_PAV[1], H18_PAV[2], "front");
    person(H18_PAV[0] + 60, top + 4, welPerson("noble", HH_KING, {id: "king", size: 0.5, face: -1, feel: seen ? "surprised" : "neutral"}));
    var walkers = [];
    for (var n = 0; n < 10; n++) {                        // the city walking up the road to the gate, in a line
      var u = ((s * 0.04 + n * 0.1) % 1), wx = mix(400 + n * 30, CNG_GATE[0], u), wy = mix(1060, 820, u);
      walkers.push([wx, wy, mix(0.72, 0.4, u), n]);
    }
    walkers.sort(function (a, c) { return a[1] - c[1]; }).forEach(function (w) {
      person(w[0], w[1], welPerson(4 + w[3] * 3, {size: w[2]}, {id: "walker" + w[3], face: 1, step: t * 0.7 + w[3]}));
    });
    var bu = between(t, 30, 36), bx = mix(600, CNG_GATE[0] - 60, bu), by = mix(1040, 860, bu);
    person(bx, by, hhBoy(13, {face: 1, step: bu < 1 ? t * 0.7 : 0, size: mix(0.62, 0.48, bu), feel: seen ? "surprised" : "neutral",
                              at: seen ? [H18_PAV[0], top - 60] : [CNG_GATE[0], 700]}));
  }
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H18_CUTS, H18_PLAN, H18_LINES, H18_LONG));
}
