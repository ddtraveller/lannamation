// s15_hemmarat.js - scene 15 of the film of Hong Hin: the Hemmarat (45 s). A high mountain pass at dusk. The great dark
// winged beast, an elephant in its claws, sees the swan and springs at it; Kanchai flashes; a cut to the beast falling
// into the forest below (the owner: the stroke, then a cut); the swan flies on, the grandmother holding tight.
var H15_LONG = 45;
var H15_SOUND = {calls: [[0.0, "wind", 0.3, 45.0], [15.78, "roar", 0.45]]};
var H15_LINES = [[2, 14.3, "H068"], [14.5, 18.18, "H069"], [18.38, 26.74, "H070"]];
// The lines as the scene was drawn to them; it plays to H15_LINES, Pan's voice (sets.js hhClock()).
var H15_PLAN = [[2, 10.2, "H068"], [11.6, 15.2, "H069"], [16.6, 24.4, "H070"]];
var H15_CUTS = [24.2];

// Scene 15, the entry the film calls. From sets.js: hhPass(), hhBoy(), HH_GRAN (s14_ghouls.js); myth.js hemmarat();
// himmaphan.js hongHin(); honghin.js kanchai().
function hhSceneHemmarat(t) {
  var said = t; t = hhClock(t, H15_PLAN, H15_LINES, H15_LONG);
  if (t < H15_CUTS[0]) {
    var spring = between(t, 15, 21), stroke = between(t, 22.8, 23.8);
    hhPass(t);
    var bx = mix(400, 900, spring), by = mix(560, 420, spring);
    hemmarat(bx, by, {size: 0.9, face: 1, trunk: 0.8, mouth: spring > 0 ? 1 : 0.3});
    var hs = hongHin(mix(2000, 1300, between(t, 0, 12)), 360 + 20 * Math.sin(t), t, {size: 1.4, face: -1, rider: true});
    person(hs.behind[0], hs.behind[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: -1, feel: spring > 0 ? "fear" : "neutral"}));
    var hand = [hs.seat[0] - 60, hs.seat[1] - 190];
    var bj = person(hs.seat[0], hs.seat[1], hhBoy(13, {floor: "astride", face: -1, feel: spring > 0 ? "angry" : "neutral", reachA: spring > 0.5 ? hand : undefined}));
    if (spring > 0.5) { hhSword(bj, mix(0.3, -2.4, stroke), 0.4); }   // in his hand (owner, 2026-11-12)
    hs.near();
    if (stroke > 0) {
      pen.save(); pen.globalCompositeOperation = "lighter";
      pen.strokeStyle = "rgba(255, 246, 210, " + (0.9 * (1 - stroke)).toFixed(3) + ")"; pen.lineWidth = 30; pen.lineCap = "round";
      pen.beginPath(); pen.arc(hs.seat[0], hs.seat[1] - 120, 340, 2.0, 2.0 + 1.8 * stroke); pen.stroke(); pen.restore();
    }
  } else {                                               // the beast falling into the forest; the swan flies on
    var s = t - H15_CUTS[0], fall = between(s, 0, 4);
    hhPass(t);
    forestSlope(pen, function (x) { return 880 - 60 * Math.sin(x * 0.004); }, -100, WIDE + 100, 1080, {seed: 5});
    if (fall < 1) {
      pen.save(); pen.translate(700, mix(400, 1100, fall * fall)); pen.rotate(1.2 * fall);
      hemmarat(0, 0, {size: 0.9, face: 1, trunk: 0.2, prey: false, feel: "fear"});
      pen.restore();
    }
    var hs2 = hongHin(mix(1100, -300, between(s, 3, 20)), 330 + 20 * Math.sin(t), t, {size: 1.3, face: -1, rider: true});
    person(hs2.behind[0], hs2.behind[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: -1, feel: "happy"}));
    person(hs2.seat[0], hs2.seat[1], hhBoy(13, {floor: "astride", face: -1, feel: "happy"}));
    hs2.near();
  }
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H15_CUTS, H15_PLAN, H15_LINES, H15_LONG));
}
