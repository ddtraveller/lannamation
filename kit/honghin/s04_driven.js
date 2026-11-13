// s04_driven.js - scene 4 of the film of Hong Hin: driven out (45 s). The six wives before the king, telling him; the
// king's anger. Then the gate at dusk: Vimala walks out of it alone, the little spotted dog in her arms, along the road
// into the falling dark, weeping.
var H04_LONG = 45;
var H04_SOUND = {calls: [[0.0, "shama", 0.15, 16.73], [17.57, "crickets", 0.2, 27.43]]};
var H04_LINES = [[2, 10.82, "H017"], [11.02, 17.32, "H018"], [20, 25.97, "H019"]];
// The lines as the scene was drawn to them; it plays to H04_LINES, Pan's voice (sets.js hhClock()).
var H04_PLAN = [[2, 8.6, "H017"], [10, 16.2, "H018"], [20, 27, "H019"]];
var H04_CUTS = [17];

// Scene 4, the entry the film calls. From sets.js: hhCourt(), hhWife(), hhVimala(), hhCamera(), hhCuts(), hhAtChest().
function hhSceneDriven(t) {
  var said = t; t = hhClock(t, H04_PLAN, H04_LINES, H04_LONG);
  var p = CNG_PALACE;
  if (t < H04_CUTS[0]) {                                // the six before the king, his anger
    var told = t > 9;
    var wives = [];
    for (var k = 0; k < 6; k++) {
      (function (k) {
        var x = p[0] - 520 + k * 100 + (k > 2 ? 520 : 0), y = 980 + (k % 2) * 30;
        wives.push({name: "wife " + k, kind: "person", x: x, y: y, draw: function () {
          person(x, y, hhWife(k, {face: x < p[0] ? 1 : -1, feel: "concerned", at: [p[0], 620]}));
        }});
      })(k);
    }
    hhCamera(0.4 + 0.4 * between(t, 0, H04_CUTS[0]), p[0], 700, 1.4);
    hhCourt(t, [[0, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, feel: told ? "angry" : "surprised",
                                                 at: [p[0] - 300, 900]})]], wives);
    hhCameraEnd();
  } else {                                               // the gate at dusk, she walks out with the dog in her arms
    // Down the gate's road to the road along the wall, then straight along it to the left and away (owner, 2026-11-13:
    // "have Vimala walk straight to the left once she reaches the road"; on a slant through the field she stuck in it).
    var s = t - H04_CUTS[0], walk = between(s, 1, 26), down = between(s, 1, 8), along = between(s, 8, 28);
    var x = mix(CNG_GATE[0], -160, along), y = mix(830, CNG_ROAD + 6, down);
    pen.drawImage(welSky("sunset"), 0, 0);
    scenerySun(t, 1560, 560, 40, {glow: 10, colour: "255, 180, 120"});
    pen.drawImage(hhFields("dusk"), 0, 0);               // the mountains in the dusk's light (scenery pass)
    cngGateWall(1 - between(s, 3, 6), t);
    sceneryBeds(t, hhFieldsEdge());                       // the wall's foot planted on a wandering line (owner, 2026-11-13)
    pen.fillStyle = "rgba(120, 50, 60, " + (0.2 + 0.3 * walk).toFixed(3) + ")";   // the dusk deepening
    pen.fillRect(0, 0, WIDE, 1080);
    var size = mix(0.5, 0.72, down);
    var vj = person(x, y, hhVimala({size: size, face: -1, feel: "sad", step: s * 0.7, tears: 1,
                                    reachA: [x - 30 * size, y - 250 * size], reachB: [x - 10 * size, y - 240 * size]}));
    if (vj && vj.crown) { hhTears(vj, -1, t); }          // her tears (the painted face draws none)
    hhAtChest(x, y, size, -1, function (cx, cy) {
      pen.save(); pen.translate(cx - 10, cy + 20); pen.scale(0.9 * size, 0.9 * size); puppy(0, 0, t, {feel: "sad", still: true}); pen.restore();
    });
    sceneryAir(t, {butterfly: null, petals: [10, "#f6b8cc", 2, 1], light: null});
  }
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H04_CUTS, H04_PLAN, H04_LINES, H04_LONG));
}
