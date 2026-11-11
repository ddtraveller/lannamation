// s01_ghouls.js - scene 1 of the film of Hong Hin: the ghouls come (45 s). Night over Varanasi, a Lanna city: the stars
// and the moon, the wall and its gate, the palace's roofs over it, lamps; the camera drifting along. At the forest's edge
// the ghouls come out of the dark, three kinds, their eyes glinting, and climb the wall; back they come over it with
// the old queen held high and carry her into the forest; the young king on the wall with a lamp, looking after them;
// then the forest under the moon, and the titles. Owner, 2026-11-11: "Yes, and keep going" (the seven-step plan).
var H01_LONG = 45;
// Its sounds (sounds.py names): night insects, an owl, the ghouls' growls, a cry far off, an alarm gong.
var H01_SOUND = {calls: [[0, "crickets", 0.25, 45], [5, "owl", 0.25], [18, "roar", 0.15], [27.5, "crowd", 0.15], [31, "gong", 0.3]]};
// The narration, [from, to, id] in the scene's own seconds: placeholders until Pan's voice (docs/kit/films.md, step 4).
var H01_LINES = [[1.5, 7.2, "H001"], [8.5, 13.6], [15.6, 22.2], [28.2, 33.8], [37.2, 41.8]];
["H001", "H002", "H003", "H004", "H005"].forEach(function (id, k) { H01_LINES[k][2] = id; });

// The horde: [kind, size, how far behind the first (seconds), seed]. They come out of the forest at the left, cross
// to the wall, climb it and go over (shot 2); four of them come back over it carrying the queen (shot 3).
var H01_HORDE = [["ghoul", 1.25, 0, 1], ["ghoulDark", 1.32, 0.9, 2], ["ghoulPale", 1.18, 1.7, 3], ["ghoul", 1.3, 2.5, 4],
                 ["ghoulDark", 1.2, 3.2, 5], ["ghoulPale", 1.28, 4.0, 6], ["ghoul", 1.22, 4.7, 7], ["ghoulDark", 1.3, 5.4, 8]];
var H01_SHOTS = [0, 14.5, 27, 35.5, H01_LONG];          // the city; the horde comes; the queen carried off; the titles

// Where a ghoul of the horde is at second s of shot 2 (0 when the first comes out of the trees): [x, feet y, phase]:
// phase "walk" on the ground, "climb" up the wall's face, "over" going over its top, "gone".
function h01Way(s) {
  if (s < 0) { return null; }
  var walkTo = HH_EDGE_WALL[0] - 40, x = 260 + 150 * s;
  if (x < walkTo) { return [x, 880, "walk"]; }
  var c = (x - walkTo) / 150;                           // seconds since it reached the wall
  if (c < 1.6) { return [walkTo + 20 * c, 880 - (880 - HH_EDGE_TOP + 20) * c / 1.6, "climb"]; }
  if (c < 2.6) { return [walkTo + 32 + 90 * (c - 1.6), HH_EDGE_TOP - 20 + 40 * (c - 1.6), "over"]; }
  return [0, 0, "gone"];
}

// Scene 1, the entry the film calls (SCENES): t, its own second. Draws the whole sheet with pen and leaves it as it found
// it. From sets.js: hhCityNight(), hhEdgeNight(), hhNight(), hhGlint(), hhCarried(), hhTitle(); welFadeIn().
function hhSceneGhouls(t) {
  var shot = t < H01_SHOTS[1] ? 0 : t < H01_SHOTS[2] ? 1 : t < H01_SHOTS[3] ? 2 : 3, s = t - H01_SHOTS[shot];
  pen.save();
  if (shot === 0) {                                     // the sleeping city, the camera drifting left to right
    var drift = between(t, 0, H01_SHOTS[1]);
    pen.translate(960, 600); pen.scale(1.12, 1.12); pen.translate(-960 - 90 + 180 * drift, -600);
    hhCityNight(t);
    sceneryFireflies(t, {far: [[[0, 640, WIDE, 1000], 70, 2]], near: 10});
  }
  if (shot === 1 || shot === 2) {
    hhEdgeNight(t);
    hhNight(0.6, t);
    var drawn = [];
    if (shot === 1) {                                   // out of the trees, across the field, up the wall and over
      H01_HORDE.forEach(function (g) {
        var w = h01Way(s - 1 - g[2]);
        if (!w || w[2] === "gone") { return; }
        pen.save();
        if (w[2] === "over") { pen.beginPath(); pen.rect(-100, -100, WIDE + 200, HH_EDGE_TOP + 112); pen.clip(); }
        var j = ogre(w[0], w[1], t, {kind: g[0], size: g[1] * 0.62, id: "gh" + g[3], face: 1, step: w[2] === "walk" ? t * 0.9 + g[3] : 0,
                                      bend: w[2] === "walk" ? 0.2 : 0.05,
                                      reachA: w[2] === "climb" ? [w[0] + 60, w[1] - 300] : undefined,
                                      reachB: w[2] === "climb" ? [w[0] + 40, w[1] - 250] : undefined});
        pen.restore();
        drawn.push([j, g[3]]);
      });
    } else {                                             // back over the wall, the queen held high, into the forest
      var back = between(s, 0.5, 7.5), x = mix(HH_EDGE_WALL[0] + 60, 120, back), y = s < 2 ? mix(HH_EDGE_TOP, 880, between(s, 0.5, 2)) : 880;
      var four = H01_HORDE.slice(0, 4);
      four.forEach(function (g, k) {
        var gx = x + (k - 1.5) * 70;
        var j = ogre(gx, y + (k % 2) * 6, t, {kind: g[0], size: g[1] * 0.62, id: "gc" + g[3], face: -1, step: t * 1.1 + k, bend: 0.1,
                                             reachA: [gx, y - 300], reachB: [gx - 20, y - 290]});
        drawn.push([j, g[3]]);
      });
      hhCarried(x, y - 320, 170, welPerson("grandmother", HH_OLD_QUEEN, {id: "oldqueen", feel: "fear"}), -1);
      if (s > 3.5) {                                     // the young king on the wall, a lamp held out, looking after them
        var kx = HH_EDGE_WALL[0] + 220, ky = HH_EDGE_TOP + 24;
        person(kx, ky, welPerson("noble", HH_KING_YOUNG, {id: "kingyoung", face: -1, feel: "fear", reachA: [kx - 70, ky - 190], at: [x, y - 300]}));
        sceneryLampLight(t, kx - 74, ky - 200, ky, {reach: 200, strength: 0.9, seed: 3});
        pen.fillStyle = "#ffd27a"; pen.beginPath(); pen.arc(kx - 74, ky - 200, 6, 0, 7); pen.fill();
      }
    }
    drawn.forEach(function (d) { hhGlint(d[0], t, d[1]); });
  }
  if (shot === 3) {                                      // the forest under the moon, mist, the titles
    hhEdgeNight(t);
    hhNight(0.7, t);
    softMist(t, 820, 70, 0.4, 13, "200, 210, 240");
    sceneryFireflies(t, {far: [[[0, 640, 1000, 980], 50, 5]], near: 6});
  }
  pen.restore();
  if (shot === 3) { hhTitle(t, H01_SHOTS[3] + 0.5, H01_LONG); }
  welFadeIn(t, 2);
  [H01_SHOTS[1], H01_SHOTS[2], H01_SHOTS[3]].forEach(function (cut) {   // each cut through black
    var d = Math.abs(t - cut);
    if (d < 0.6) { pen.fillStyle = "rgba(0, 0, 0, " + (1 - d / 0.6).toFixed(3) + ")"; pen.fillRect(0, 0, WIDE, 1080); }
  });
}
