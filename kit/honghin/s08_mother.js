// s08_mother.js - scene 8 of the film of Hong Hin: mother (55 s). Dusk at the orchard: the swan comes down by the thicket
// and folds itself into an old log under creepers. At the hut the boy tells Vimala he is her son; she turns away. He
// raises his hands in a vow of truth; her milk streams to his mouth, as the khao so tells it (the owner, 2026-11-11:
// "Show it"); she knows him, holds him and weeps; she names him.
var H08_LONG = 55;
var H08_SOUND = {calls: [[0, "crickets", 0.2, 55], [3, "wind", 0.15, 6]]};
var H08_LINES = [[2, 8.6, "H031"], [10.4, 13.2, "H032"], [14.6, 20.4, "H033"], [21.8, 29.2, "H034"], [31, 37.4, "H035"], [39.4, 46.6, "H036"]];
var H08_CUTS = [10];
var H08_LOG = [420, 1000];                             // where the swan lands and lies as a log

// Scene 8, the entry the film calls. From sets.js: hhOrchardAt(), HH_ORCHARD_HOUSE, hhVimala(), hhBoy(); himmaphan.js
// hongHin(); honghin.js swanLog().
function hhSceneMother(t) {
  if (t < H08_CUTS[0]) {                                // the swan comes down and folds into a log
    var land = between(t, 0.5, 5), fold = between(t, 5.5, 8);
    hhCamera(0.6, 700, 820, 1.3);
    hhOrchardAt(t, "dusk");
    if (fold > 0) { pen.save(); pen.globalAlpha = fold; swanLog(H08_LOG[0], H08_LOG[1], t); pen.restore(); }
    if (fold < 1) {
      pen.save(); pen.globalAlpha = 1 - fold;
      var sx = mix(1300, H08_LOG[0] + 60, land), sy = mix(300, H08_LOG[1] - 140, land);
      var h = hongHin(sx, sy, t, {size: 1.6, face: -1});
      if (land < 1) { person(h.seat[0], h.seat[1], hhBoy(13, {floor: "astride", face: -1})); }
      pen.restore();
    }
    if (land >= 1) { person(H08_LOG[0] + 260, 1000, hhBoy(13, {face: 1, feel: "happy", at: [HH_ORCHARD_HOUSE[0], 700]})); }
    hhCameraEnd();
  } else {                                               // at the hut: the vow, the milk, the embrace
    var s = t - H08_CUTS[0], vow = t > 21.6 && t < 31, milk = between(t, 26, 28) * (1 - between(t, 32, 33.5));
    var knows = t > 29, embrace = between(t, 33, 36);
    hhCamera(1, HH_ORCHARD_HOUSE[0] - 240, 820, 1.75);
    hhOrchardAt(t, "dusk");
    sceneryLampLight(t, HH_ORCHARD_HOUSE[0] - 40, 760, 960, {reach: 300, strength: 0.7, seed: 4});
    var vx = HH_ORCHARD_HOUSE[0] - 120, bx = mix(HH_ORCHARD_HOUSE[0] - 430, HH_ORCHARD_HOUSE[0] - 250, embrace), g = 990;
    var turned = t > 13 && t < 21;
    var vj = person(vx, g, hhVimala({face: turned ? 1 : -1, feel: knows ? "sad" : turned ? "concerned" : "surprised", tears: knows ? 1 : 0,
                                     at: [bx, g - 380], free: true,
                                     reachA: embrace > 0 ? [bx + 40, g - 300] : undefined, reachB: embrace > 0 ? [bx + 20, g - 260] : undefined}));
    var bj = person(bx, g + 10, hhBoy(13, {face: 1, feel: knows ? "happy" : "concerned", wai: vow ? 1 : undefined,
                                           mouth: welTalk(t, welSays(t, H08_LINES, ["H032"])), at: [vx, g - 400]}));
    if (milk > 0 && vj && bj && bj.chin) {               // her milk streaming to his mouth, a thin bright arc
      var sh = vj.shoulderA ? himmaJoint(vj.shoulderA) : null;
      var from = sh ? [sh[0] - 14, sh[1] + 22] : [vx - 20, g - 300];
      var chin = himmaJoint(bj.chin), to = [chin[0] + 6, chin[1] - 8];
      pen.save();
      pen.strokeStyle = "rgba(255, 252, 240, " + (0.9 * milk).toFixed(3) + ")"; pen.lineWidth = 3.5; pen.lineCap = "round";
      var reach = Math.min(1, milk * 1.4);
      pen.beginPath(); pen.moveTo(from[0], from[1]);
      pen.quadraticCurveTo((from[0] + to[0]) / 2, Math.min(from[1], to[1]) - 50, mix(from[0], to[0], reach), mix(from[1], to[1], reach));
      pen.stroke();
      pen.globalCompositeOperation = "lighter";
      var gl = pen.createRadialGradient(to[0], to[1], 2, to[0], to[1], 60);
      gl.addColorStop(0, "rgba(255, 240, 200, " + (0.5 * milk) + ")"); gl.addColorStop(1, "rgba(255, 240, 200, 0)");
      pen.fillStyle = gl; pen.beginPath(); pen.arc(to[0], to[1], 60, 0, 7); pen.fill();
      pen.restore();
    }
    hhCameraEnd();
  }
  welFadeIn(t, 1.5);
  hhCuts(t, H08_CUTS);
}
