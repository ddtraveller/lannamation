// s19_truth.js - scene 19 of the film of Hong Hin: the truth (55 s). The throne hall: the boy before the king tells it
// all; the six wives deny it; a palace maid is brought in and swears to her spotted puppy taken that night; the six
// wives and their sons in fetters; the king's judgement: they were punished severely (the owner: said, not shown). The
// hall empties; the king alone, his head bowed.
var H19_LONG = 55;
var H19_SOUND = {calls: [[30.0, "plate-ting", 0.3]]};
var H19_LINES = [[2, 13.2, "H084"], [13.4, 22.18, "H085"], [23, 28.81, "H086"], [30, 33.02, "H087"]];
// The lines as the scene was drawn to them; it plays to H19_LINES, Pan's voice (sets.js hhClock()).
var H19_PLAN = [[2, 11.2, "H084"], [12.6, 21.6, "H085"], [23, 28.6, "H086"], [30, 34.2, "H087"]];
var H19_CUTS = [12.2, 22.6, 36];

// Scene 19, the entry the film calls. From sets.js: hhCourt(), hhBoy(), hhWife(), hhSon(), hhCamera(), hhCuts();
// honghin.js fetters(), puppy().
function hhSceneTruth(t) {
  var said = t; t = hhClock(t, H19_PLAN, H19_LINES, H19_LONG);
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]), floor = hoKhamFloor(p[1], p[2]);
  var king = function (feel) { return [[0, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, feel: feel, at: [p[0] - 300, 900]})]]; };
  if (t < H19_CUTS[0]) {                                // the boy tells it all
    hhCamera(0.6, p[0] - 120, 760, 1.4);
    hhCourt(t, king("surprised"), [
      {name: "boy", kind: "person", x: p[0] - 300, y: 1010, draw: function () {
        person(p[0] - 300, 1010, hhBoy(13, {face: 1, feel: "neutral", floor: "cross", mouth: welTalk(t, t > 2 && t < 11), at: [p[0], dais - 120]}));
      }},
      {name: "grandmother", kind: "person", x: p[0] - 560, y: 1000, draw: function () {
        person(p[0] - 560, 1000, welPerson("grandmother", HH_OLD_QUEEN, {id: "oldqueen", floor: "side", face: 1, feel: "happy", at: [p[0] - 300, 900]}));
      }}]);
    hhCameraEnd();
  } else if (t < H19_CUTS[1]) {                          // the six deny it; the maid with her puppy's story
    var wives = [];
    for (var k = 0; k < 6; k++) {
      (function (k) {
        var x = p[0] + 260 + (k % 3) * 120, y = 990 + Math.floor(k / 3) * 40;
        wives.push({name: "wife " + k, kind: "person", x: x, y: y, draw: function () {
          person(x, y, hhWife(k, {face: -1, feel: t > 18 ? "fear" : "angry", at: [p[0] - 300, 900], mouth: welTalk(t, t > 13 && t < 16 && k === 0)}));
        }});
      })(k);
    }
    wives.push({name: "maid", kind: "person", x: p[0] - 220, y: 1010, draw: function () {
      person(p[0] - 220, 1010, welPerson(40, {size: 0.66}, {id: "maid", face: 1, feel: "concerned", mouth: welTalk(t, t > 17 && t < 21.4),
                                                           at: [p[0], dais - 120]}));
      pen.save(); pen.translate(p[0] - 140, 1010); pen.scale(0.4, 0.4); puppy(0, 0, t, {feel: "happy", still: true}); pen.restore();
    }});
    hhCamera(0.8, p[0] + 60, 780, 1.4);
    hhCourt(t, king("angry"), wives);
    hhCameraEnd();
  } else if (t < H19_CUTS[2]) {                          // in fetters; the judgement
    hhCamera(0.8, p[0] + 80, 800, 1.35);
    var bound = [];
    for (var n = 0; n < 6; n++) {
      (function (n) {
        var x = p[0] - 520 + n * 200, y = 1010;
        bound.push({name: "bound " + n, kind: "person", x: x, y: y, draw: function () {
          // shackles round each wrist, the hands brought together before them (owner, 2026-11-13)
          var d = x < p[0] ? 1 : -1;
          hhShackles(person(x, y, hhWife(n, {face: d, floor: "side", feel: "sad", at: [p[0], dais - 100],
                                             reachA: [x + 44 * d, y - 52], reachB: [x + 58 * d, y - 48]})), 0.8);
          hhShackles(person(x + 80, y + 30, hhSon(n, {face: d, floor: "cross", feel: "sad", id: "son" + n, at: [p[0], dais - 100],
                                                     reachA: [x + 80 + 40 * d, y - 30], reachB: [x + 80 + 54 * d, y - 26]})), 0.8);
        }});
      })(n);
    }
    hhCourt(t, king("angry"), bound);
    hhCameraEnd();
  } else {                                               // the hall empty; the king alone, his head bowed
    hhCamera(1, p[0], dais - 80, 2.0 + 0.15 * between(t, H19_CUTS[2], H19_LONG));
    hhCourt(t, [[0, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, feel: "sad", tears: 1, bend: 0.25})]], []);
    hhCameraEnd();
  }
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H19_CUTS, H19_PLAN, H19_LINES, H19_LONG));
}
