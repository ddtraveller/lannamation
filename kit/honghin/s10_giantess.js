// s10_giantess.js - scene 10 of the film of Hong Hin: the giantess under the palm (60 s). Outside the south gate at noon:
// the great old sugar palm, the hollow at its foot, bones; no one on the road. The red giantess comes out; the boy
// walks up to the tree; she springs; he speaks; he draws Kanchai: the stroke, then a cut to her fallen under the palm
// (the owner, 2026-11-11). The six brothers creep up, beat the body with sticks and the butt of a musket, smear its
// blood on their clothes, and press a bag of gold into the boy's hands.
var H10_LONG = 60;
var H10_SOUND = {calls: [[0, "cicadas", 0.2, 34], [27, "roar", 0.35], [34.6, "swish", 0.4], [37, "cicadas", 0.15, 23]]};
var H10_LINES = [[2, 7.6, "H042"], [9, 16.6, "H043"], [18, 22.2, "H044"], [23.6, 29.6, "H045"], [31, 34.4, "H046"], [38, 46.6, "H047"], [48, 55.2, "H048"]];
var H10_CUTS = [17.4, 35.2];
var H10_PALM = [1420, 905];
var H10_FALLEN = [1180, 960];                          // where she lies, under the palm

// The road outside the south gate at noon, the palm. t: seconds.
function h10Gate(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 70, "day");
  pen.drawImage(cngFields(), 0, 0);
  cngGateWall(0.3, t);
  sugarPalm(H10_PALM[0], H10_PALM[1], t, {tall: 560});
  pen.fillStyle = "rgba(255, 236, 190, 0.12)"; pen.fillRect(0, 0, WIDE, 1080);   // the noon glare
}

// Scene 10, the entry the film calls. From sets.js: hhBoy(), hhSon(), hhCamera(), hhCuts(); ogre.js ogre() kind
// "giantess"; honghin.js sugarPalm(), kanchai(), musket(); himmaphan.js himmaJoint().
function hhSceneGiantess(t) {
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
    var hand = stroke > 0 ? [bx + 140, H10_PALM[1] - 160] : [bx + 30, H10_PALM[1] - 330];
    person(bx, H10_PALM[1] + 30, hhBoy(13, {face: 1, feel: spring > 0 ? "angry" : "neutral", step: walk > 0 && walk < 1 ? s * 0.8 : 0,
                                            mouth: welTalk(t, welSays(t, H10_LINES, ["H045"])), at: [gx, H10_PALM[1] - 360],
                                            reachA: draw > 0 ? hand : undefined}));
    if (draw > 0) { kanchai(hand[0], hand[1], {size: 0.42, angle: stroke > 0 ? mix(0.2, 2.4, stroke) : 0.2}); }
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
    person(780, H10_PALM[1] + 40, hhBoy(13, {face: 1, feel: "concerned", at: [H10_FALLEN[0], H10_FALLEN[1] - 60],
                                             reachA: pay > 0.5 ? [880, H10_PALM[1] - 220] : undefined}));
    if (pay > 0.5) { pen.fillStyle = "#c8a050"; pen.beginPath(); pen.ellipse(882, H10_PALM[1] - 210, 26, 30, 0, 0, 7); pen.fill(); pen.strokeStyle = "#6e4612"; pen.stroke(); }
    for (var k = 0; k < 6; k++) {
      var x = mix(-200 - k * 90, 960 + k * 110, come), y = H10_PALM[1] + 30 + (k % 2) * 40, beat = Math.sin(t * 6 + k) > 0;
      var j = person(x, y, hhSon(k, {face: k < 3 ? 1 : 1, step: come > 0 && come < 1 ? t * 0.9 + k : 0, feel: c > 14 ? "happy" : "angry",
                                     id: "son" + k, at: [H10_FALLEN[0], H10_FALLEN[1] - 40],
                                     reachA: come >= 1 && smear < 1 ? [x + 90, y - (beat ? 330 : 200)] : undefined}));
      if (come >= 1 && smear < 1 && k % 2 === 0) {        // a stick, beating
        var w = himmaJoint(j.wristA);
        pen.strokeStyle = "#6a4420"; pen.lineWidth = 7; pen.beginPath(); pen.moveTo(w[0], w[1]); pen.lineTo(w[0] + 80, w[1] + (beat ? -60 : 70)); pen.stroke();
      }
      if (k === 1 && come >= 1) { var mw = himmaJoint(j.wristA); musket(mw[0] + 60, mw[1] + 10); }
      if (smear > 0 && j.shoulderA) {                     // the giantess's blood smeared on their clothes
        var sh = himmaJoint(j.shoulderA);
        pen.fillStyle = "rgba(150, 20, 24, " + (0.75 * smear).toFixed(3) + ")";
        pen.beginPath(); pen.ellipse(sh[0] + 6, sh[1] + 70, 18, 30, 0.3, 0, 7); pen.ellipse(sh[0] + 20, sh[1] + 150, 14, 22, -0.4, 0, 7); pen.fill();
      }
    }
    hhCameraEnd();
  }
  welFadeIn(t, 1.5);
  hhCuts(t, H10_CUTS);
}
