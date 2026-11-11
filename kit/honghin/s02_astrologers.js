// s02_astrologers.js - scene 2 of the film of Hong Hin: the astrologers (45 s). Years later, by day, the palace of
// Varanasi: King Purantapa grown, on the dais with Vimala, his chief queen, heavy with child; his six other wives in
// the court. Two astrologers on the floor before the hall read the stars on their boards and speak; then the six wives,
// near, look at one another.
var H02_LONG = 45;
var H02_SOUND = {calls: [[0, "birds", 0.2, 45]]};
var H02_LINES = [[2, 8.4, "H006"], [9.8, 13.6, "H007"], [15, 20.6, "H008"], [22, 30.6, "H009"], [32.5, 39.5, "H010"]];
var H02_CUTS = [21, 31.5];

// The court's people. t: seconds; near: the six wives' feeling (scene's end) or none.
function h02People(t, feel) {
  var p = CNG_PALACE, floor = hoKhamFloor(p[1], p[2]), list = [];
  for (var k = 0; k < 6; k++) {                          // the six, standing in the court at the right, in two rows
    (function (k) {
      var x = 1480 + (k % 3) * 150 + (k > 2 ? 70 : 0), y = k > 2 ? 1010 : 960;
      list.push({name: "wife " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, hhWife(k, {face: -1, feel: feel || "neutral", at: feel ? [x - 600 + 300 * (k % 2), 700] : [p[0], 600]}));
      }});
    })(k);
  }
  [[-330, 1, 31], [-170, 1, 37]].forEach(function (a, i) {   // the two astrologers, their boards before them
    var x = p[0] + a[0] - 300, y = floor + 70;
    list.push({name: "astrologer " + i, kind: "person", x: x, y: y, draw: function () {
      hhBoard(x + 150, y + 34, a[2]);
      var talking = welSays(t, H02_LINES, ["H009"]) && i === 0;
      person(x, y, welPerson("elder", CNG_SEER, {id: "seer" + i, floor: "cross", face: 1, size: 0.66, feel: "thinking",
                                                 at: [p[0], 600], mouth: welTalk(t, talking)}));
    }});
  });
  return list;
}

// Scene 2, the entry the film calls. From sets.js: hhCourt(), hhCamera(), hhCuts(), hhWife(), hhVimala(), hhBoard().
function hhSceneAstrologers(t) {
  var p = CNG_PALACE;
  var onDais = [[-70, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, at: [p[0] + 60, 600]})],
                [70, hhVimala({floor: "side", face: -1, feel: t < H02_CUTS[0] ? "happy" : "concerned"})]];
  if (t < H02_CUTS[0]) {                                // the court, wide, the camera easing in on the dais
    hhCamera(0.6 * between(t, 0, H02_CUTS[0]), p[0], 640, 1.35);
    hhCourt(t, onDais, h02People(t));
    hhCameraEnd();
  } else if (t < H02_CUTS[1]) {                         // the astrologers at their boards
    hhCamera(1, p[0] - 520, 860, 1.9);
    hhCourt(t, onDais, h02People(t));
    hhCameraEnd();
  } else {                                              // the six wives, near, looking at one another
    hhCamera(1, 1620, 820, 2.0 + 0.1 * between(t, H02_CUTS[1], H02_LONG));
    hhCourt(t, onDais, h02People(t, t < 36 ? "surprised" : "concerned"));
    hhCameraEnd();
  }
  welFadeIn(t, 1.5);
  hhCuts(t, H02_CUTS);
}
