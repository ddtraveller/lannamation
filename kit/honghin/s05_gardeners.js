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

// The water pot Vimala pours from in the morning (a mo nam of fired clay: a round belly, a short neck, a flared lip), at
// second t: where it is and how far it tips, and the two places her hands hold it (neck: the far hand at the back of the
// neck; under: the near hand under the belly), in the scene. At her belly, before her: her shoulders are near (620 to
// 655, 737) and a painted woman's arm reaches about 84, no further (people.js), so both grips lie within it. e.g. var pot = h05Pot(t); h05PotDraw(pot, t);
function h05Pot(t) {
  var x = 700, y = 790 + 3 * Math.sin(t * 1.3), tip = 1.05 + 0.12 * Math.sin(t * 1.3);   // radians from upright, the mouth to her front
  function at(u, v) { return [x + u * Math.cos(tip) - v * Math.sin(tip), y + u * Math.sin(tip) + v * Math.cos(tip)]; }
  return {x: x, y: y, tip: tip, at: at, neck: at(-7, -25), under: at(-12, 20), lip: at(12, -31)};
}
// Draws the pot h05Pot() gave, and the water running from its lip down to the bed, at second t.
function h05PotDraw(pot, t) {
  pen.save();
  pen.translate(pot.x, pot.y); pen.rotate(pot.tip);
  pen.lineJoin = "round";
  pen.beginPath();                                       // the body: neck, shoulder, belly, a small flat foot
  pen.moveTo(-9, -24);
  pen.bezierCurveTo(-11, -16, -26, -14, -27, 2);
  pen.bezierCurveTo(-28, 16, -18, 24, -9, 25);
  pen.lineTo(9, 25);
  pen.bezierCurveTo(18, 24, 28, 16, 27, 2);
  pen.bezierCurveTo(26, -14, 11, -16, 9, -24);
  pen.closePath();
  var fill = pen.createRadialGradient(-10, -8, 3, -2, 2, 32);   // the light from the upper left, as the film's
  fill.addColorStop(0, "#d48a5a"); fill.addColorStop(0.55, "#b0603a"); fill.addColorStop(1, "#7a3c22");
  pen.fillStyle = fill; pen.fill();
  pen.save(); pen.clip();
  pen.fillStyle = "rgba(60, 24, 10, 0.25)";             // wet below the lip, where water has run down
  pen.beginPath(); pen.ellipse(8, -6, 9, 20, 0.2, 0, 7); pen.fill();
  pen.strokeStyle = "rgba(70, 30, 14, 0.75)"; pen.lineWidth = 1.2;   // the bands pressed into the clay: a ring at the shoulder,
  pen.beginPath(); pen.moveTo(-26, -6); pen.quadraticCurveTo(0, -1, 26, -6); pen.stroke();   // a wave under it, a row of dots,
  pen.beginPath(); pen.moveTo(-27, 0);                                                      // and a ring round the belly
  for (var k = 0; k <= 12; k++) { pen.lineTo(-27 + k * 4.5, 3 + (k % 2 ? 3 : -1)); }
  pen.stroke();
  pen.fillStyle = "rgba(70, 30, 14, 0.75)";
  for (k = 0; k < 9; k++) { pen.beginPath(); pen.arc(-22 + k * 5.5, 11, 0.9, 0, 7); pen.fill(); }
  pen.beginPath(); pen.moveTo(-25, 15); pen.quadraticCurveTo(0, 20, 25, 15); pen.stroke();
  pen.fillStyle = "rgba(255, 236, 210, 0.35)";          // a shine on the belly
  pen.beginPath(); pen.ellipse(-14, -6, 4, 8, 0.4, 0, 7); pen.fill();
  pen.restore();
  pen.strokeStyle = "#4a200e"; pen.lineWidth = 1.6; pen.stroke();   // its outline
  pen.beginPath(); pen.ellipse(0, -27, 13, 4.5, 0, 0, 7);  // the flared lip, and the dark of the mouth inside it
  pen.fillStyle = "#c27248"; pen.fill(); pen.stroke();
  pen.beginPath(); pen.ellipse(0, -27.5, 9, 2.6, 0, 0, 7); pen.fillStyle = "#3a1a0c"; pen.fill();
  pen.fillStyle = "rgba(160, 200, 220, 0.8)"; pen.beginPath(); pen.ellipse(2, -27.5, 6, 1.6, 0, 0, 7); pen.fill();   // the water in it
  pen.restore();
  var s = pot.lip, ground = 968, run = 22;               // the water: a few strands from the lip, falling, and drops where it lands
  pen.save(); pen.lineCap = "round";
  for (var n = 0; n < 3; n++) {
    var dx = n * 2.5 - 2.5, wob = 1.5 * Math.sin(t * 9 + n * 2);
    pen.strokeStyle = n === 1 ? "rgba(225, 242, 255, 0.85)" : "rgba(170, 210, 235, 0.55)";
    pen.lineWidth = n === 1 ? 2.6 : 1.6;
    pen.beginPath(); pen.moveTo(s[0] + dx * 0.4, s[1]);
    pen.bezierCurveTo(s[0] + 10 + dx, s[1] + 6, s[0] + run + dx + wob, s[1] + 30, s[0] + run + 2 + dx + wob, ground - 4);
    pen.stroke();
  }
  pen.fillStyle = "rgba(210, 236, 255, 0.8)";
  for (n = 0; n < 6; n++) {
    var u = ((t * 1.7 + n / 6) % 1), side = n % 2 ? 1 : -1;
    pen.beginPath(); pen.arc(s[0] + run + 2 + side * (3 + 10 * u), ground - 4 - 12 * u * (1 - u) * 4, 1.4 * (1 - u) + 0.4, 0, 7); pen.fill();
  }
  pen.strokeStyle = "rgba(200, 230, 250, 0.6)"; pen.lineWidth = 1.2;   // a ring where it lands
  pen.beginPath(); pen.ellipse(s[0] + run + 2, ground - 2, 7 + 2 * Math.sin(t * 6), 2, 0, 0, 7); pen.stroke();
  pen.restore();
}

// Scene 5, the entry the film calls. From sets.js: hhOrchardAt(), HH_ORCHARD_HOUSE, HH_ORCHARD_GROUND, hhVimala().
function hhSceneGardeners(t) {
  var said = t; t = hhClock(t, H05_PLAN, H05_LINES, H05_LONG);
  var g = HH_ORCHARD_GROUND, hx = HH_ORCHARD_HOUSE[0];
  if (t < H05_CUTS[0]) {                                // night: the torch, the queen at the gate, taken in
    hhCamera(0.5 + 0.3 * between(t, 0, H05_CUTS[0]), hx - 300, 760, 1.35);
    hhOrchardAt(t, "night");
    var lit = between(t, 3, 5), come = between(t, 4, 11), inside = between(t, 14, 19);
    // she walks well ahead of him, so his torch and the fist round it stand clear of her (owner, 2026-11-16, at 5:41)
    var ox = mix(hx - 60, hx - 330, come), wx = mix(hx - 170, hx - 450, come);
    var vx = mix(hx - 520, hx - 120, inside);
    var torchTop = null;
    drawByZ([
      // a step behind the old couple, so that, taken in, she walks past behind them and not over the old man and his torch
      // (owner, 2026-11-16, at 5:41: he was hidden behind her)
      {name: "vimala", kind: "person", x: vx, y: g - 8, draw: function () {
        person(vx, g - 8, hhVimala({face: 1, feel: inside > 0 ? "sad" : "sad", tears: 1, step: inside > 0 && inside < 1 ? t * 0.7 : 0,
                                    reachA: [vx + 20, g - 8 - 200], reachB: [vx + 30, g - 8 - 190]}));
        pen.save(); pen.translate(vx + 26, g - 8 - 160); pen.scale(0.6, 0.6); puppy(0, 0, t, {feel: "sad", still: true}); pen.restore();
      }},
      {name: "old man", kind: "person", x: ox, y: g, draw: function () {
        // The torch a wooden brand, its head bound with resin-soaked cloth, held in his closed fist at his chest, the
        // hand still (owner, 2026-11-13: "change the torch to look like a wooden stick ... doesn't wave her hand"). In his
        // near hand (B), before him: held in the far hand, the kit drew that whole arm over his chest and the cloth on it,
        // the upper arm too, and his near hand hung open at his back (owner, 2026-11-16: "the z order on his right
        // bicep/arm position and stop his hands from waving"). A fist of fingersB, not grip, so the far arm hangs behind him.
        var man = welPerson("elder", HH_OLD_MAN, {id: "oldman", face: -1, step: come > 0 && come < 1 ? t * 0.6 : 0,
                                                  reachB: [ox - 52, g - 196], fingersB: [0.92, 0.95, 0.97, 0.98, 0.7], holding: null,
                                                  feel: "surprised", at: [vx, g - 200]});
        if (lit > 0) { torchTop = hhBrand(hhJointsOf(function () { return person(ox, g, man); }), -0.12, "B"); }
        person(ox, g, man);
      }},
      {name: "old woman", kind: "person", x: wx, y: g + 16, draw: function () {
        person(wx, g + 16, welPerson("grandmother", HH_OLD_WOMAN, {id: "oldwoman", face: -1, step: come > 0 && come < 1 ? t * 0.6 : 0,
                                                                   feel: "concerned", at: [vx, g - 200]}));
      }}
    ]);
    if (lit > 0 && torchTop) {                           // the torch's flame at the brand's head, and its light
      sceneryLampLight(t, torchTop[0], torchTop[1], g, {reach: 300 * lit, strength: lit, seed: 7});
      hhFlame(torchTop[0], torchTop[1], t, lit);
    }
    hhCameraEnd();
  } else {                                               // morning: she waters the beds; the old woman beside her
    var s = t - H05_CUTS[0];
    hhCamera(0.6, 700, 820, 1.4);
    hhOrchardAt(t, "day");
    drawByZ([
      {name: "vimala", kind: "person", x: 640, y: 990, draw: function () {
        // The water pot in her two hands, tipped forward, pouring on the bed (owner, 2026-11-16: "redraw the water pot with
        // more detail and put it in the woman's hands"). She, then the pot over her and her far hand at its neck (a painted
        // woman's arm A is her far arm), then her near forearm laid again over the pot, its hand under the belly (owner,
        // 2026-11-16: "make sure the z order of the queen's arm and hand are correct").
        var pot = h05Pot(t), look = hhVimala({face: 1, feel: "neutral", reachA: pot.neck, reachB: pot.under});
        var vj = person(640, 990, look);
        h05PotDraw(pot, t);
        if (vj && vj.elbowB) { hhArmOver(vj, "B", 16, function () { person(640, 990, look); }); }
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
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H05_CUTS, H05_PLAN, H05_LINES, H05_LONG));
}
