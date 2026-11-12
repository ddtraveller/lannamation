// s14_ghouls.js - scene 14 of the film of Hong Hin: the ghoul city (60 s). Thatched huts deep in the forest, bones, water
// pots; the ghouls are out hunting. An old woman sits alone, thin and starving: his grandmother. Twenty years without
// salt, fire or rice, while they eat their meat raw (the ghouls at their kill, far off). He smashes the huts and the
// pots, sets her on the swan, rises; the ghouls come home and fly after them throwing stones and trees; Kanchai
// flashes; a cut to them falling like rain (the owner: the stroke, then a cut).
var H14_LONG = 56;                                     // 60 until 2026-11-12 (owner: end the falling ghouls at 14:15)
var H14_SOUND = {calls: [[0.0, "crickets", 0.15, 28.68], [36.34, "roar", 0.4], [47.84, "wind", 0.3, 8.16]]};
var H14_LINES = [[2, 12.84, "H062"], [13.04, 19.32, "H063"], [19.52, 28.74, "H064"], [28.94, 36.4, "H065"], [36.6, 43.74, "H066"], [43.94, 49.18, "H067"]];
// The lines as the scene was drawn to them; it plays to H14_LINES, Pan's voice (sets.js hhClock()).
var H14_PLAN = [[2, 8.2, "H062"], [9.6, 15.6, "H063"], [17, 25.2, "H064"], [26.6, 33.2, "H065"], [34.6, 39.6, "H066"], [41, 47.2, "H067"]];
var H14_CUTS = [16.6, 26.2, 34.2, 45];

// Scene 14, the entry the film calls. From sets.js: hhGhoulPlace(), hhBoy(), hhGlint(), hhDevice(); ogre.js ogre(),
// ogreMeat(); himmaphan.js hongHin(); honghin.js kanchai().
function hhSceneGhouls2(t) {
  var said = t; t = hhClock(t, H14_PLAN, H14_LINES, H14_LONG);
  if (t < H14_CUTS[0]) {                                // the swan comes down among the huts; the old woman alone
    var land = between(t, 0.5, 6);
    hhCamera(0.5, 960, 800, 1.2);
    hhGhoulPlace(t, 0);
    person(1180, 990, welPerson("grandmother", HH_GRAN, {id: "gran", floor: "side", face: -1, feel: "sad", at: [700, 760]}));
    var hs = hongHin(mix(-200, 620, land), mix(300, 820, land), t, {size: 1.3, rider: true});
    if (land < 1) { person(hs.seat[0], hs.seat[1], hhBoy(13, {floor: "astride", face: 1})); }
    else { person(860, 1000, hhBoy(13, {face: 1, feel: "surprised", at: [1180, 880], step: t > 7 && t < 10 ? t : 0})); }
    hs.near();
    hhCameraEnd();
  } else if (t < H14_CUTS[1]) {                          // her telling; far off, the ghouls at their kill
    hhCamera(1, 1050, 860, 1.6);
    hhGhoulPlace(t, 0);
    person(1180, 990, welPerson("grandmother", HH_GRAN, {id: "gran", floor: "side", face: -1, feel: "sad", tears: 1,
                                                         mouth: welTalk(t, welSays(t, H14_PLAN, ["H064"])), at: [960, 760]}));
    person(960, 1000, hhBoy(13, {face: 1, feel: "sad", at: [1180, 880]}));
    if (t > 20) {                                        // a glimpse: the ghouls far off tearing at raw meat
      pen.save(); pen.globalAlpha = between(t, 20, 21) * (1 - between(t, 24.8, 25.8));
      pen.fillStyle = "rgba(20, 24, 20, 0.85)"; pen.fillRect(1240, 560, 520, 300);
      pen.beginPath(); pen.rect(1240, 560, 520, 300); pen.clip();
      [[1360, "ghoul"], [1500, "ghoulDark"], [1640, "ghoulPale"]].forEach(function (g, k) {
        var j = ogre(g[0], 850, t, {kind: g[1], id: "eat" + k, size: 0.55, face: k % 2 ? -1 : 1, bend: 0.3, feel: "angry",
                                    reachA: [g[0] + 30, 850 - 150 + 10 * Math.sin(t * 6 + k)]});
        ogreMeat(j.wristA, -0.8);
      });
      pen.restore();
      pen.strokeStyle = "#e3b04a"; pen.lineWidth = 3; pen.strokeRect(1240, 560, 520, 300);
    }
    hhCameraEnd();
  } else if (t < H14_CUTS[2]) {                          // he smashes the huts and the pots; she on the swan; up
    var smash = between(t, 27, 29.5), up = between(t, 30.5, 34);
    hhCamera(0.5, 960, 800, 1.2);
    hhGhoulPlace(t, smash);
    var hs2 = hongHin(900, mix(860, 300, up), t, {size: 1.3, rider: true});
    if (up > 0) {
      person(hs2.behind[0], hs2.behind[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: 1, feel: "fear"}));
      person(hs2.seat[0], hs2.seat[1], hhBoy(13, {floor: "astride", face: 1, feel: "angry"}));
    }
    hs2.near();
    if (up <= 0) {
      person(mix(400, 1200, smash), 1000, hhBoy(13, {face: 1, feel: "angry", reachA: [mix(400, 1200, smash) + 60, 1000 - (Math.sin(t * 9) > 0 ? 300 : 160)]}));
      person(1150, 990, welPerson("grandmother", HH_GRAN, {id: "gran", face: -1, feel: "fear"}));
    }
    hhCameraEnd();
  } else if (t < H14_CUTS[3]) {                          // the ghouls fly after them, throwing; Kanchai flashes
    var s = t - H14_CUTS[2];
    pen.drawImage(welSky("sunset"), 0, 0);
    cngFar(pen, 0, 900, "dusk");
    var hs3 = hongHin(1300, 360 + 20 * Math.sin(t), t, {size: 1.5, rider: true});
    person(hs3.behind[0], hs3.behind[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: 1, feel: "fear"}));
    // Kanchai held up, then brought down in an arc through the ghouls, in his hand (owner, 2026-11-12)
    var lift = between(t, 34.4, 35.6), stroke = between(t, 43.8, 44.8);
    var hand = [mix(mix(hs3.seat[0] - 60, hs3.seat[0] - 10, lift), hs3.seat[0] - 180, stroke),
                mix(mix(hs3.seat[1] - 120, hs3.seat[1] - 250, lift), hs3.seat[1] - 90, stroke)];
    var bj3 = person(hs3.seat[0], hs3.seat[1], hhBoy(13, {floor: "astride", face: -1, feel: "angry", reachA: hand}));
    hhSword(bj3, mix(mix(-0.5, 0.35, lift), -2.5, stroke), 0.4);
    hs3.near();
    H14_HORDE_FLY.forEach(function (g, k) {
      var gx = mix(-200 + k * 90, 700 + k * 60, between(s, 0, 8)), gy = 700 - k * 50 + 30 * Math.sin(t * 2 + k);
      var j = ogre(gx, gy, t, {kind: g, id: "fly" + k, size: 0.7, face: 1, bend: -0.1, feel: "angry", reachA: [gx + 60, gy - 280]});
      if ((t * 0.7 + k * 0.37) % 1 < 0.5) {               // a stone thrown, or a tree torn up by the roots (owner, 2026-11-12)
        var u = (t * 0.7 + k * 0.37) % 1 * 2, tx = mix(gx + 60, hs3.seat[0] - 100, u), ty = mix(gy - 280, hs3.seat[1], u) - 80 * Math.sin(u * Math.PI);
        if (k === 1 || k === 4) { hhThrownTree(tx, ty, u * 5 + k, 0.8); }
        else { pen.fillStyle = "#6a6458"; pen.beginPath(); pen.arc(tx, ty, 12, 0, 7); pen.fill(); }
      }
    });
    if (stroke > 0) {
      pen.save(); pen.globalCompositeOperation = "lighter";
      pen.strokeStyle = "rgba(255, 246, 210, " + (0.9 * (1 - stroke)).toFixed(3) + ")"; pen.lineWidth = 30; pen.lineCap = "round";
      pen.beginPath(); pen.arc(hs3.seat[0], hs3.seat[1] - 100, 420, -1.5, -1.5 - 2.1 * stroke, true); pen.stroke(); pen.restore();
    }
  } else {                                               // a cut: they fall from the sky like rain
    var f = t - H14_CUTS[3];
    pen.drawImage(welSky("sunset"), 0, 0);
    cngFar(pen, 0, 900, "dusk");
    forest(pen, -100, WIDE + 100, 1060, {tall: 260, seed: 23, far: 0.3});
    for (var n = 0; n < 12; n++) {
      var fx = 160 + n * 140 + 40 * Math.sin(n * 3), fall = ((f * 0.5 + n * 0.13) % 1.2), fy = mix(-200, 1300, fall);
      pen.save(); pen.translate(fx, fy); pen.rotate(n * 0.9 + f * 2);
      ogre(0, 120, t, {kind: H14_HORDE_FLY[n % H14_HORDE_FLY.length], id: "fall" + n, size: 0.5, face: n % 2 ? 1 : -1, feel: "fear", blink: 1});
      pen.restore();
    }
    var hs4 = hongHin(mix(1200, 2200, between(f, 2, 11)), 300, t, {size: 1.2, rider: true});
    person(hs4.behind[0], hs4.behind[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: 1}));
    person(hs4.seat[0], hs4.seat[1], hhBoy(13, {floor: "astride", face: 1}));
    hs4.near();
  }
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H14_CUTS, H14_PLAN, H14_LINES, H14_LONG));
}
var H14_HORDE_FLY = ["ghoul", "ghoulDark", "ghoulPale", "ghoul", "ghoulDark", "ghoulPale"];
