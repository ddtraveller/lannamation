// s05_gardeners.js - scene 5 of the film of Hong Hin: the gardeners (40 s). Late night at the orchard on the city's edge:
// an old man and an old woman wake, the old man lights a torch, they find the queen weeping at their gate with the dog;
// they take her in. Morning: she waters the beds, the old woman beside her; the old man with his hoe.
var H05_LONG = 40;
var H05_SOUND = {calls: [[0.0, "crickets", 0.25, 20.05], [21.02, "rooster-crow", 0.3], [22.0, "shama", 0.2, 18.0]]};
var H05_LINES = [[2, 9.2, "H020"], [10.6, 16.16, "H021"], [22, 29.03, "H022"], [30, 34.42, "H023"]];
// The lines as the scene was drawn to them; it plays to H05_LINES, Pan's voice (sets.js hhClock()).
var H05_PLAN = [[2, 9.2, "H020"], [10.6, 15.6, "H021"], [22, 28.4, "H022"], [30, 36.4, "H023"]];
var H05_CUTS = [20.5];
var HH_OLD_MAN = {size: 0.72};                         // the old gardener, the kit's elder
var HH_OLD_WOMAN = {size: 0.68};                       // his wife, the kit's grandmother

// Scene 5, the entry the film calls. From sets.js: hhOrchardAt(), HH_ORCHARD_HOUSE, HH_ORCHARD_GROUND, hhVimala().
function hhSceneGardeners(t) {
  var said = t; t = hhClock(t, H05_PLAN, H05_LINES, H05_LONG);
  var g = HH_ORCHARD_GROUND, hx = HH_ORCHARD_HOUSE[0];
  if (t < H05_CUTS[0]) {                                // night: the torch, the queen at the gate, taken in
    hhCamera(0.5 + 0.3 * between(t, 0, H05_CUTS[0]), hx - 300, 760, 1.35);
    hhOrchardAt(t, "night");
    var lit = between(t, 3, 5), come = between(t, 4, 11), inside = between(t, 14, 19);
    var ox = mix(hx - 60, hx - 330, come), wx = mix(hx - 120, hx - 380, come);
    var vx = mix(hx - 520, hx - 120, inside);
    drawByZ([
      {name: "vimala", kind: "person", x: vx, y: g + 30, draw: function () {
        person(vx, g + 30, hhVimala({face: 1, feel: inside > 0 ? "sad" : "sad", tears: 1, step: inside > 0 && inside < 1 ? t * 0.7 : 0,
                                     reachA: [vx + 20, g + 30 - 200], reachB: [vx + 30, g + 30 - 190]}));
        pen.save(); pen.translate(vx + 26, g + 30 - 160); pen.scale(0.6, 0.6); puppy(0, 0, t, {feel: "sad"}); pen.restore();
      }},
      {name: "old man", kind: "person", x: ox, y: g, draw: function () {
        person(ox, g, welPerson("elder", HH_OLD_MAN, {id: "oldman", face: -1, step: come > 0 && come < 1 ? t * 0.6 : 0,
                                                      reachA: [ox - 50, g - 230], holding: null, feel: "surprised", at: [vx, g - 200]}));
      }},
      {name: "old woman", kind: "person", x: wx, y: g + 16, draw: function () {
        person(wx, g + 16, welPerson("grandmother", HH_OLD_WOMAN, {id: "oldwoman", face: -1, step: come > 0 && come < 1 ? t * 0.6 : 0,
                                                                   feel: "concerned", at: [vx, g - 200]}));
      }}
    ]);
    if (lit > 0) {                                        // the torch in the old man's hand
      var fx = ox - 54, fy = g - 250;
      sceneryLampLight(t, fx, fy, g, {reach: 300 * lit, strength: lit, seed: 7});
      pen.fillStyle = "#ffcc55"; pen.beginPath(); pen.ellipse(fx, fy - 6, 7, 13 * (0.9 + 0.1 * Math.sin(t * 11)), 0, 0, 7); pen.fill();
    }
    hhCameraEnd();
  } else {                                               // morning: she waters the beds; the old woman beside her
    var s = t - H05_CUTS[0];
    hhCamera(0.6, 700, 820, 1.4);
    hhOrchardAt(t, "day");
    drawByZ([
      {name: "vimala", kind: "person", x: 640, y: 990, draw: function () {
        person(640, 990, hhVimala({face: 1, feel: "neutral", reachA: [720, 860 + 8 * Math.sin(t * 2)], reachB: [700, 870]}));
        pen.fillStyle = "#8a6a4a"; pen.beginPath(); pen.ellipse(735, 872 + 8 * Math.sin(t * 2), 22, 16, 0.3, 0, 7); pen.fill();   // the water jar
        pen.strokeStyle = "rgba(200, 230, 255, 0.7)"; pen.lineWidth = 3;
        pen.beginPath(); pen.moveTo(752, 880); pen.quadraticCurveTo(772, 920, 770, 960); pen.stroke();
      }},
      {name: "old woman", kind: "person", x: 900, y: 1000, draw: function () {
        person(900, 1000, welPerson("grandmother", HH_OLD_WOMAN, {id: "oldwoman", face: -1, feel: "happy", at: [640, 800]}));
      }},
      {name: "old man", kind: "person", x: 360, y: 980, draw: function () {
        person(360, 980, welPerson("elder", HH_OLD_MAN, {id: "oldman", face: 1, feel: "happy", at: [640, 800]}));
      }}
    ]);
    sceneryAir(t, {butterfly: {kind: "lacewing", x: 300, y: 620, vx: 60, weave: 50, seed: 3, size: 1.1, turn: 1.2, wing: 2}, petals: [12, "#f6dce4", 3, 1], light: [0.4, 3]});
    hhCameraEnd();
  }
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H05_CUTS, H05_PLAN, H05_LINES, H05_LONG));
}
