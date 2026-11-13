// s10_giantess.js - scene 10 of the film of Hong Hin: the giantess under the palm (60 s). Outside the south gate at noon:
// the great old sugar palm, the hollow at its foot, bones; no one on the road. The red giantess comes out; the boy
// walks up to the tree; she springs; he speaks; he draws Kanchai: the stroke, then a cut to her fallen under the palm
// (the owner, 2026-11-11). The six brothers creep up, beat the body with sticks and the butt of a musket, smear its
// blood on their clothes, and press a bag of gold into the boy's hands.
var H10_LONG = 60;
var H10_SOUND = {calls: [[0.0, "cicadas", 0.2, 40.32], [32.21, "roar", 0.35], [41.32, "cicadas", 0.15, 18.68]]};
var H10_LINES = [[2, 14.92, "H042"], [15.12, 22.7, "H043"], [22.9, 27.83, "H044"], [28.03, 35.81, "H045"], [36.01, 41.29, "H046"], [41.49, 51.23, "H047"], [51.43, 58.31, "H048"]];
// The lines as the scene was drawn to them; it plays to H10_LINES, Pan's voice (sets.js hhClock()).
var H10_PLAN = [[2, 7.6, "H042"], [9, 16.6, "H043"], [18, 22.2, "H044"], [23.6, 29.6, "H045"], [31, 34.4, "H046"], [38, 46.6, "H047"], [48, 55.2, "H048"]];
var H10_CUTS = [17.4, 35.2];
var H10_PALM = [1420, 905];
var H10_FALLEN = [1180, 960];                          // where she lies, under the palm

// The road outside the south gate at noon, the palm. t: seconds.
function h10Gate(t) {
  hhPlace("fields");
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 70, "day");
  pen.drawImage(hhFields(), 0, 0);
  cngGateWall(0.3, t);
  sceneryBeds(t, hhFieldsEdge());                       // the wall's foot planted on a wandering line (owner, 2026-11-13)
  sugarPalm(H10_PALM[0], H10_PALM[1], t, {tall: 560});
  pen.fillStyle = "rgba(255, 236, 190, 0.12)"; pen.fillRect(0, 0, WIDE, 1080);   // the noon glare
}

// Scene 10, the entry the film calls. From sets.js: hhBoy(), hhSon(), hhCamera(), hhCuts(); ogre.js ogre() kind
// "giantess"; honghin.js sugarPalm(), kanchai(), musket(); himmaphan.js himmaJoint().
// The giantess's blood on the ground where she lies: a dark pool and spatter, grown to u (0 to 1). e.g. h10Blood(1180, 970, 1);
// A two-handed swing as the owner's reference: p 0 to 1 through it, j the beater's joints (from hhJointsOf()). Gives back
// {hands: [near, far], grip, angle, u}: where the hands are and the stick's angle (radians from pointing forward).
function h10Swing(j, p) {
  // the arms near straight all the way round (owner, 2026-11-13: "all have arm positions similar to the brother to the far
  // right. Relatively straight arms"): the hands on a circle of the arm's own length about the shoulder, from overhead
  // and a little back, forward and down to low, and up again
  var sh = himmaJoint(j.shoulderA), el = himmaJoint(j.elbowA), wr = himmaJoint(j.wristA), cr = himmaJoint(j.crown), ch = himmaJoint(j.chin);
  var u = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]) / 100, arm = 0.94 * (Math.hypot(el[0] - sh[0], el[1] - sh[1]) + Math.hypot(wr[0] - el[0], wr[1] - el[1]));
  var keys = [[0, -1.75, -2.5], [0.35, -1.45, -1.7], [0.6, -0.35, -0.2], [0.8, 0.55, 0.6], [1, -1.75, -2.5]], k;   // [p, the arm's angle, the stick's]
  for (k = 1; k < keys.length - 1 && keys[k][0] < p; k++) { }
  var a = keys[k - 1], b = keys[k], q = clamp((p - a[0]) / ((b[0] - a[0]) || 1));
  q = q * q * (3 - 2 * q);
  var aa = mix(a[1], b[1], q), hx = sh[0] + Math.cos(aa) * arm, hy = sh[1] + Math.sin(aa) * arm, ang = mix(a[2], b[2], q);
  return {hands: [[hx, hy], [hx - Math.cos(ang) * 22 * u, hy - Math.sin(ang) * 22 * u]], grip: [hx, hy], angle: ang, u: u};
}
// The stick of a swing (h10Swing()): from behind the hands out past them along its angle.
function h10Stick(sw) {
  var g = sw.grip, a = sw.angle, u = sw.u;
  pen.save(); pen.lineCap = "round";
  pen.strokeStyle = "#3a2410"; pen.lineWidth = 9 * u; pen.beginPath(); pen.moveTo(g[0] - Math.cos(a) * 40 * u, g[1] - Math.sin(a) * 40 * u);
  pen.lineTo(g[0] + Math.cos(a) * 150 * u, g[1] + Math.sin(a) * 150 * u); pen.stroke();
  pen.strokeStyle = "#7a5230"; pen.lineWidth = 6 * u; pen.stroke();
  pen.restore();
}
function h10Blood(x, y, u) {
  if (u <= 0) { return; }
  pen.save(); pen.globalAlpha *= 0.85 * u;
  pen.fillStyle = "#6a0e12"; pen.beginPath(); pen.ellipse(x - 60, y, 150 * u, 22 * u, 0, 0, 7); pen.ellipse(x + 90, y + 6, 70 * u, 14 * u, 0.05, 0, 7); pen.fill();
  pen.fillStyle = "#8a1418"; pen.beginPath(); pen.ellipse(x - 70, y - 2, 110 * u, 14 * u, 0, 0, 7); pen.fill();
  pen.fillStyle = "rgba(255, 200, 200, 0.25)"; pen.beginPath(); pen.ellipse(x - 90, y - 5, 40 * u, 4 * u, 0, 0, 7); pen.fill();   // its wet shine
  pen.fillStyle = "#7a1014";
  for (var k = 0; k < 14; k++) { pen.beginPath(); pen.ellipse(x - 300 + dice(k + 31) * 560, y - 10 + dice(k + 47) * 36, 3 + 7 * dice(k + 59), 2 + 3 * dice(k + 61), 0, 0, 7); pen.fill(); }
  pen.restore();
}
// A bag of gold: a cloth pouch, its neck tied, gold pieces showing at its mouth, (x, y) its middle. e.g. h10GoldBag(850, 720);
function h10GoldBag(x, y) {
  pen.save();
  pen.beginPath(); pen.moveTo(x - 14, y - 30); pen.quadraticCurveTo(x - 46, y + 4, x - 30, y + 34); pen.quadraticCurveTo(x, y + 46, x + 30, y + 34);
  pen.quadraticCurveTo(x + 46, y + 4, x + 14, y - 30); pen.closePath();
  var cloth = pen.createLinearGradient(x - 40, y, x + 40, y); cloth.addColorStop(0, "#c89a5a"); cloth.addColorStop(1, "#7a5228");
  pen.fillStyle = cloth; pen.fill(); pen.strokeStyle = "#4a2e14"; pen.lineWidth = 2; pen.stroke();
  pen.strokeStyle = "rgba(74, 46, 20, 0.5)"; pen.lineWidth = 1.2;   // its folds
  pen.beginPath(); pen.moveTo(x - 8, y - 22); pen.quadraticCurveTo(x - 20, y + 8, x - 14, y + 34); pen.moveTo(x + 8, y - 22); pen.quadraticCurveTo(x + 18, y + 10, x + 12, y + 36); pen.stroke();
  pen.strokeStyle = "#b8282e"; pen.lineWidth = 4; pen.beginPath(); pen.moveTo(x - 16, y - 26); pen.lineTo(x + 16, y - 26); pen.stroke();   // the cord
  [[-8, -36], [6, -38], [0, -42]].forEach(function (g) {            // the gold at its mouth
    pen.beginPath(); pen.ellipse(x + g[0], y + g[1], 8, 4, 0.1, 0, 7); pen.fillStyle = "#e9c25a"; pen.fill(); pen.strokeStyle = "#8a6420"; pen.lineWidth = 1; pen.stroke();
  });
  pen.restore();
}

function hhSceneGiantess(t) {
  var said = t; t = hhClock(t, H10_PLAN, H10_LINES, H10_LONG);
  if (t < H10_CUTS[0]) {                                // the palm, the empty road, the giantess in its shade
    hhCamera(0.3 + 0.4 * between(t, 0, H10_CUTS[0]), H10_PALM[0] - 100, 760, 1.3);
    h10Gate(t);
    var out = between(t, 6, 12);
    ogre(mix(H10_PALM[0] + 10, H10_PALM[0] - 120, out), H10_PALM[1] + 10, t, {kind: "giantess", id: "giantess", face: -1, size: 1.25,
                                                                               step: out > 0 && out < 1 ? t * 0.6 : 0, at: [700, 800]});
    hhCameraEnd();
  } else if (t < H10_CUTS[1]) {                          // the boy walks up; she springs; he speaks; he draws Kanchai
    var s = t - H10_CUTS[0], walk = between(s, 0, 6), spring = between(t, 26.5, 28.5), draw = between(t, 32, 33.5), stroke = between(t, 34.2, 35);
    hhCamera(1, H10_PALM[0] - 380, 800, 1.55);
    h10Gate(t);
    var gx = mix(H10_PALM[0] - 120, H10_PALM[0] - 230, spring), bx = mix(860, H10_PALM[0] - 520, walk);
    ogre(gx, H10_PALM[1] + 10, t, {kind: "giantess", id: "giantess", face: -1, size: 1.25, feel: "angry",
                                    reachA: spring > 0 ? [gx - 200, H10_PALM[1] - 300] : undefined, reachB: spring > 0 ? [gx - 180, H10_PALM[1] - 260] : undefined});
    var g = H10_PALM[1] + 30;                            // the sword held up to chop, then brought down (owner, 2026-11-12)
    var hand = [mix(bx + 40, bx + 150, stroke), mix(g - 400, g - 230, stroke)];
    var bj = person(bx, g, hhBoy(13, {face: 1, feel: spring > 0 ? "angry" : "neutral", step: walk > 0 && walk < 1 ? s * 0.8 : 0,
                                      mouth: welTalk(t, welSays(t, H10_PLAN, ["H045"])), at: [gx, H10_PALM[1] - 360],
                                      reachA: draw > 0 ? hand : undefined}));
    if (draw > 0) { hhSword(bj, mix(-0.9, 2.2, stroke), 0.42); }
    if (stroke > 0) {                                    // the stroke: a flash across the picture
      pen.save(); pen.globalCompositeOperation = "lighter";
      pen.strokeStyle = "rgba(255, 246, 210, " + (0.9 * (1 - stroke)).toFixed(3) + ")"; pen.lineWidth = 26; pen.lineCap = "round";
      pen.beginPath(); pen.arc(bx + 40, H10_PALM[1] - 200, 260, -1.4, -1.4 + 2.6 * stroke); pen.stroke(); pen.restore();
    }
    hhCameraEnd();
  } else {                                               // she lies fallen; the six beat the body and take the credit
    var c = t - H10_CUTS[1], come = between(c, 2, 7), smear = between(c, 9, 12), pay = between(t, 47, 51);
    hhCamera(0.9, H10_FALLEN[0] - 100, 820, 1.4);
    h10Gate(t);
    pen.save();                                          // the giantess lying on her back on the ground
    pen.translate(H10_FALLEN[0], H10_FALLEN[1] - 20); pen.rotate(-Math.PI / 2);
    ogre(0, 300, 0, {kind: "giantess", id: "fallen", face: 1, size: 1.25, feel: "sleepy", blink: 1});
    pen.restore();
    // Her blood on the ground about her, pooled and spattered, under everyone (owner, 2026-11-13: "place the blood stains
    // more properly and make sure z order is correct").
    if (come > 0) { h10Blood(H10_FALLEN[0], H10_FALLEN[1] + 10, between(c, 3, 9)); }
    // The bag of gold pressed into his hands: held before his belly in both, his near hand over it, still (no wave).
    var boyLook = hhBoy(13, {face: 1, feel: "concerned", at: [H10_FALLEN[0], H10_FALLEN[1] - 60]}), bag = null;
    if (pay > 0.5) {
      var probe = hhJointsOf(function () { return person(780, H10_PALM[1] + 40, boyLook); });
      var wa = himmaJoint(probe.waist), nk = himmaJoint(probe.neck);
      bag = [wa[0] + 34, mix(nk[1], wa[1], 0.75)];
      boyLook = hhBoy(13, {face: 1, feel: "concerned", at: [H10_FALLEN[0], H10_FALLEN[1] - 60], grip: true,
                           reachA: [bag[0] - 14, bag[1] + 6], reachB: [bag[0] + 18, bag[1] - 2]});
    }
    var boyJ = person(780, H10_PALM[1] + 40, boyLook);
    if (bag) {
      h10GoldBag(bag[0], bag[1]);
      hhArmOver(boyJ, "A", 18, function () { person(780, H10_PALM[1] + 40, boyLook); });
    }
    var order = [0, 2, 4, 1, 3, 5];                       // the back row (even, nearer the wall) before the front row
    for (var o = 0; o < 6; o++) {
      var k = order[o];
      var x = mix(-200 - k * 90, 960 + k * 110, come), y = H10_PALM[1] + 30 + (k % 2) * 40, beat = Math.sin(t * 6 + k) > 0;
      // the beating: a stick in both hands, swung from overhead down through the front to low (owner, 2026-11-13, a
      // reference of a two-handed sword's swing); the musket a stick too
      var beating = come >= 1 && smear < 1, sw = (t * 0.9 + [0, 0.5, 0.25, 0.75, 0.12, 0.62][k]) % 1, swing = null;   // out of step
      var look = {face: 1, step: come > 0 && come < 1 ? t * 0.9 + k : 0, feel: c > 14 ? "happy" : "angry", id: "son" + k,
                  at: [H10_FALLEN[0], H10_FALLEN[1] - 40]};
      if (beating) {
        var probe = hhJointsOf(function () { return person(x, y, hhSon(k, look)); });
        swing = h10Swing(probe, sw);
        Object.assign(look, {reachA: swing.hands[0], reachB: swing.hands[1], grip: true});
        h10Stick(swing);                                 // the stick behind the hands that hold it
      }
      var j = person(x, y, hhSon(k, look));
      if (smear > 0 && j.waist && j.hip) {                // the giantess's blood smeared on their cloth: spatter and a wiped streak, inside the body
        var wa = himmaJoint(j.waist), hp = himmaJoint(j.hip), u = Math.abs(hp[1] - wa[1]) + 30;
        pen.save(); pen.fillStyle = "rgba(120, 14, 18, " + (0.75 * smear).toFixed(3) + ")";
        pen.beginPath(); pen.moveTo(wa[0] - 0.1 * u, wa[1] + 0.2 * u); pen.quadraticCurveTo(wa[0] + 0.05 * u, wa[1] + 0.6 * u, wa[0] - 0.02 * u, wa[1] + 1.1 * u);
        pen.lineTo(wa[0] + 0.06 * u, wa[1] + 1.05 * u); pen.quadraticCurveTo(wa[0] + 0.12 * u, wa[1] + 0.55 * u, wa[0] - 0.02 * u, wa[1] + 0.18 * u); pen.closePath(); pen.fill();
        for (var d = 0; d < 7; d++) {
          pen.beginPath(); pen.arc(wa[0] + (dice(k * 13 + d) - 0.4) * 0.35 * u, wa[1] + (0.3 + dice(k * 17 + d) * 1.1) * u, (0.015 + 0.03 * dice(k * 19 + d)) * u, 0, 7); pen.fill();
        }
        pen.restore();
      }
    }
    hhCameraEnd();
  }
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H10_CUTS, H10_PLAN, H10_LINES, H10_LONG));
}
