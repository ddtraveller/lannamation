// s12_first.js - scene 12 of the film of Hong Hin: the first giant king (55 s). Over forests to a red-gold city of
// giants: the swan comes down by the palace; in the hall Princess Mukhawadi, rose-skinned, and the boy see each other.
// King Wassawaro, a red ogre king, bursts in roaring; the boy speaks calmly; the king's face changes; a wedding feast of
// roast meat and raw among the giants.
var H12_LONG = 55;
var H12_SOUND = {calls: [[0, "wind", 0.15, 9], [18, "roar", 0.35]]};
var H12_LINES = [[2, 8.2, "H053"], [9.6, 16.6, "H054"], [18.2, 22.2, "H055"], [23.6, 31.2, "H056"], [33, 37.2, "H057"]];
var H12_CUTS = [9.2, 33];

// Scene 12, the entry the film calls. From sets.js: hhGiantCity(), hhBoy(); ogre.js ogre(), ogreDaughter(), ogreMeat();
// himmaphan.js hongHin().
function hhSceneFirst(t) {
  var h = HH_GIANT_HALL, dais = hoKhamDais(h[1], h[2]);
  if (t < H12_CUTS[0]) {                                // the swan comes down by the red city's palace
    var land = between(t, 0.5, 7);
    hhGiantCity(t, "red", [], []);
    var sx = mix(-200, h[0] + 420, land), sy = mix(200, 820, land);
    var hs = hongHin(sx, sy, t, {size: 1.2});
    person(hs.seat[0], hs.seat[1], hhBoy(13, {floor: "astride", face: 1}));
  } else if (t < H12_CUTS[1]) {                          // the princess and the boy; her father roaring in, then won over
    var king = between(t, 17.6, 19.6), won = t > 27;
    hhCamera(0.8, h[0], 760, 1.35);
    var sprites = [
      {name: "boy", kind: "person", x: h[0] - 360, y: 1000, draw: function () {
        person(h[0] - 360, 1000, hhBoy(13, {face: 1, feel: t > 18 && t < 23 ? "surprised" : "happy", at: [h[0], dais - 200],
                                            mouth: welTalk(t, welSays(t, H12_LINES, ["H056"]))}));
      }},
      {name: "the king", kind: "person", x: mix(WIDE + 200, h[0] + 300, king), y: 1010, draw: function () {
        if (king <= 0) { return; }
        var x = mix(WIDE + 200, h[0] + 300, king);
        ogre(x, 1010, t, {kind: "king", id: "wassawaro", face: -1, size: 1.25, feel: won ? "happy" : "angry", step: king < 1 ? t * 0.9 : 0,
                          at: [h[0] - 360, 700], reachA: !won && king >= 1 ? [x - 160, 700] : undefined});
      }}
    ];
    hhGiantCity(t, "red", [[0, ogreDaughter("mukhawadi", {size: 0.8, id: "mukhawadi", floor: "side", face: -1, at: [h[0] - 360, 760]})]], sprites);
    hhCameraEnd();
  } else {                                               // the wedding feast
    hhCamera(0.6, h[0], 800, 1.25);
    var feast = [];
    [[-560, "king", 1], [-380, "mural", 1], [380, "forest", -1], [560, "king", -1]].forEach(function (g, k) {
      feast.push({name: "giant " + k, kind: "person", x: h[0] + g[0], y: 1020, draw: function () {
        var j = ogre(h[0] + g[0], 1020, t, {kind: g[1], id: "guest" + k, face: g[2], size: 1.0, floor: "cross", feel: "happy",
                                            reachA: [h[0] + g[0] + 60 * g[2], 1020 - 200 + 20 * Math.sin(t * 3 + k)]});
        ogreMeat(j.wristA, g[2] > 0 ? -0.4 : 3.5);
      }});
    });
    hhGiantCity(t, "red", [[-70, hhBoy(13, {floor: "cross", face: 1, feel: "happy", at: [h[0] + 70, dais - 120]})],
                           [70, ogreDaughter("mukhawadi", {size: 0.8, id: "mukhawadi", floor: "side", face: -1, at: [h[0] - 70, dais - 140]})]], feast);
    pen.fillStyle = "#8a4a2a";                           // trays of roast meat before them
    [h[0] - 260, h[0] + 260].forEach(function (x) { pen.beginPath(); pen.ellipse(x, 1040, 90, 18, 0, 0, 7); pen.fill(); ogreMeat(hhDevice([x - 30, 1020]), 0.2); });
    hhCameraEnd();
  }
  welFadeIn(t, 1.5);
  hhCuts(t, H12_CUTS);
}
