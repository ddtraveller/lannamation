// s05_widow.js - scene 5 of the film of the White Eel: the old widow (35 s). Three shots, through black, in her yard at
// the edge of the city on an afternoon: she sweeps the yard by her old house on posts; close, she squats at a little
// fire at the ladder's foot and cooks a pot of rice for one; then, her stick in her hand, she watches her neighbours
// go by along the path, talking among themselves, and none of them looks her way (story.py: "watches neighbours pass
// without a word").
var W05_LONG = 35;
var W05_SOUND = {calls: [[0, "birds", 0.16, 35], [12, "fire", 0.15, 12]]};
var W05_LINES = [[1.2, 6.6, "W016"], [13.0, 17.6, "W017"], [25.2, 32.2, "W018"]];
var W05_CUTS = [12.0, 24.0];
var W05_SWEEP = [1080, 846];                           // where she sweeps
var W05_FIRE = [1300, 848];                            // the little fire by the ladder's foot

// A broom of grass stems (ไม้กวาดดอกหญ้า) from her hand at (hx, hy) to the ground at (gx, gy): a short handle, the head
// spreading where it meets the ground.
function w05Broom(hx, hy, gx, gy) {
  pen.save();
  pen.strokeStyle = "#8a6a3a";
  pen.lineWidth = 3.5;
  pen.lineCap = "round";
  var mx = mix(hx, gx, 0.45), my = mix(hy, gy, 0.45);
  pen.beginPath(); pen.moveTo(hx, hy); pen.lineTo(mx, my); pen.stroke();
  pen.strokeStyle = "#c8a85a";
  pen.lineWidth = 1.4;
  for (var k = -5; k <= 5; k++) { pen.beginPath(); pen.moveTo(mx, my); pen.lineTo(gx + k * 4.5, gy + Math.abs(k) * 0.4); pen.stroke(); }
  pen.restore();
}

// The little fire: three stones, a flicker of flame, a small black pot on them, its lid, and the steam and smoke.
function w05Fire(t) {
  var x = W05_FIRE[0], y = W05_FIRE[1];
  [[-16, 0], [16, 0], [0, 6]].forEach(function (s) { oval(x + s[0], y + s[1], 9, 6, "#7a7266"); });
  for (var f = 0; f < 4; f++) {                         // the flames
    var h = 14 + 8 * Math.abs(Math.sin(t * 9 + f * 1.7)), fx = x - 9 + f * 6;
    pen.fillStyle = f % 2 ? "rgba(255, 196, 80, 0.9)" : "rgba(240, 110, 40, 0.85)";
    pen.beginPath(); pen.moveTo(fx - 4, y - 2); pen.quadraticCurveTo(fx, y - h, fx + 4, y - 2); pen.fill();
  }
  pen.fillStyle = "#2a2622";                            // the pot
  pen.beginPath(); pen.ellipse(x, y - 22, 20, 15, 0, 0, 7); pen.fill();
  pen.fillStyle = "#3e3832";
  pen.beginPath(); pen.ellipse(x, y - 34, 15, 4, 0, 0, 7); pen.fill();
  welSmoke(t, x + 2, y - 40, {rise: 120, lean: 40, wide: 18, alpha: 0.35, colour: "236, 234, 238", count: 10});
}

// Her neighbours on the path: a mother with her little girl, two men with baskets on a pole, a woman; they talk as
// they go and look ahead, not at her. u: seconds since the shot began.
var W05_NEIGHBOURS = [["maiden", {size: 0.72}, -40], ["girl", {size: 0.42}, -120], ["farmer", {size: 0.76}, -420], ["villager", {size: 0.76, turban: "#2a6a5a"}, -530],
                      ["weaver", {size: 0.7}, -900]];
function w05Neighbours(t, u, sprites) {
  W05_NEIGHBOURS.forEach(function (n, k) {
    var x = n[2] + 120 * u, y = WEL_PATH + (k % 2) * 16;
    if (x < -150 || x > WIDE + 150) { return; }
    sprites.push({name: "neighbour " + k, kind: "person", x: x, y: y, draw: function () {
      person(x, y, welPerson(n[0], n[1], {id: "neighbour" + k, face: 1, step: t / BEAT * 0.9 + k,
                                          mouth: welTalk(t + k, k !== 1 && Math.sin(t * 0.9 + k * 2) > 0.2), at: [x + 400, y - 260]}));
    }});
  });
}

// Scene 5, the entry the film calls (SCENES): t, its own second, 0 to W05_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welClouds(), welYard(), WEL_YARD, WEL_PATH, welPerson() with WEL_WIDOW,
// welSmoke(), welTalk(); from changngu/sets.js: cngLocal(), cngCutsOver(). Its words are W05_LINES (W016 to W018).
function welSceneWidow(t) {
  var shot = t < W05_CUTS[0] ? 0 : t < W05_CUTS[1] ? 1 : 2, zoom = [1, 1.7, 1.12][shot], about = [[960, 640], [1260, 900], [1000, 880]][shot];
  pen.save();
  pen.translate(about[0], about[1]); pen.scale(zoom, zoom); pen.translate(-about[0], -about[1]);
  pen.drawImage(welSky("day"), 0, 0);
  welClouds(t + 120, "day");
  pen.drawImage(welYard("day"), 0, 0, WIDE, 1080);
  var sprites = [];
  if (shot === 0) {                                     // she sweeps the yard
    var swing = Math.sin(t * 3.2), hand = [W05_SWEEP[0] - 70 + 26 * swing, W05_SWEEP[1] - 96];
    sprites.push({name: "widow", kind: "person", x: W05_SWEEP[0], y: W05_SWEEP[1], draw: function () {
      var j = person(W05_SWEEP[0], W05_SWEEP[1], welPerson("grandmother", WEL_WIDOW, {id: "widow", face: -1, holding: null, bend: 0.3,
                                                                                      reachA: hand, reachB: [hand[0] + 18, hand[1] + 22]}));
      var w = cngLocal(j.wristA);
      w05Broom(w[0], w[1], w[0] - 46 + 20 * swing, W05_SWEEP[1] + 4);
    }});
  } else if (shot === 1) {                              // she cooks a little rice for one at her fire
    w05Fire(t);
    var stir = Math.sin(t * 1.6);
    sprites.push({name: "widow", kind: "person", x: W05_FIRE[0] - 80, y: W05_FIRE[1] + 4, draw: function () {
      person(W05_FIRE[0] - 80, W05_FIRE[1] + 4, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: 1, holding: null, floor: "side",
                                                                                   reachA: [W05_FIRE[0] - 18 + 6 * stir, W05_FIRE[1] - 38], at: [W05_FIRE[0], W05_FIRE[1] - 30],
                                                                                   feel: "concerned"}));
    }});
  } else {                                              // she watches them go by, and none of them looks her way
    var u = t - W05_CUTS[1];
    w05Fire(t);
    sprites.push({name: "widow", kind: "person", x: 1150, y: 846, draw: function () {
      person(1150, 846, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: -1, feel: u > 6 ? "sad" : undefined,
                                                            at: [mix(200, 1000, between(u, 0, 9)), WEL_PATH - 240]}));
    }});
    w05Neighbours(t, u, sprites);
  }
  drawByZ(sprites);
  sceneryBeds(t, thkOnce("wel-yard-frame", function () {
    return [{sprite: sceneryGrass(300, 18, 631), x: 40, y: 1110}, {sprite: sceneryGrass(280, 16, 637), x: WIDE - 20, y: 1110}];
  }), {blur: 5, sway: 0.4});
  sceneryAir(t, {butterfly: null, light: [0.4, 10]});
  pen.restore();
  cngCutsOver(t, W05_CUTS);
  welFadeIn(t, 1.5);
}
