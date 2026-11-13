// s07_swan.js - scene 7 of the film of Hong Hin: the stone swan (55 s). In heaven Indra speaks over a golden boulder; it
// glows, and in a flash it is a swan of stone plates, its wings opening. He gives the boy, thirteen, the sword Kanchai.
// The boy climbs on, takes the red reins, and they dive down through the clouds toward the world.
var H07_LONG = 55;
var H07_SOUND = {calls: [[0.0, "wind", 0.15, 55.0]]};
var H07_LINES = [[2, 8.86, "H027"], [9.06, 16.14, "H028"], [18.4, 24.16, "H029"], [28, 35.04, "H030"]];
// The lines as the scene was drawn to them; it plays to H07_LINES, Pan's voice (sets.js hhClock()).
var H07_PLAN = [[2, 7.6, "H027"], [9, 16.6, "H028"], [18.4, 26.4, "H029"], [28, 34.4, "H030"]];
var H07_CUTS = [36];
var H07_SWAN = [1180, 620];                            // where the swan wakes beside Indra

// Scene 7, the entry the film calls. From sets.js: hhHeaven(), hhBoulder(), hhBoy(); himmaphan.js indra(), hongHin(),
// hongHinReins(); honghin.js kanchai().
function hhSceneSwan(t) {
  var said = t; t = hhClock(t, H07_PLAN, H07_LINES, H07_LONG);
  if (t < H07_CUTS[0]) {
    var glow = between(t, 8, 14), made = between(t, 14, 16.5), sword = between(t, 28.5, 30.5);
    hhCamera(0.5, 1000, 640, 1.2);
    hhHeaven(t, 1060);
    if (made < 1) {                                      // the boulder sits in the cloud, its foot hidden in it (owner, 2026-11-12)
      pen.save(); pen.globalAlpha = 1 - made; hhBoulder(H07_SWAN[0], 908, glow); pen.restore();   // 8 lower: its foot all in the cloud (owner, 2026-11-13)
    }
    hhCloudFeet(H07_SWAN[0], 900, t, 520, 16);
    if (made > 0) {
      pen.save(); pen.globalAlpha = made;
      hongHin(H07_SWAN[0], H07_SWAN[1] + 40 * Math.sin(t * 0.8), t, {size: 2.4, face: -1});
      pen.restore();
    }
    var ij = indra(1640, 940, t, {pose: "stand", id: "indra", face: -1, feel: made > 0 ? "happy" : "thinking", at: [H07_SWAN[0], 760], ground: false});
    hhCloudFeet(1640, 940, t, 360, 17);
    // Kanchai comes from Indra's hand to the boy's, and he holds it: his hand closed round the grip, the blade up, drawn
    // before him so his fist is over the hilt (owner, 2026-11-13: "show the prince holding the sword and stop him from
    // waving hello at it").
    var bx = 640, by = 940, boy = hhBoy(13, {face: 1, feel: made > 0 ? "awe" : "surprised", at: made > 0 ? [H07_SWAN[0], 560] : [H07_SWAN[0], 800],
                                             reachA: sword > 0.5 ? [bx + 90, by - 250] : undefined, grip: sword >= 1, ground: false});
    if (sword > 0) {
      var bj = hhJointsOf(function () { return person(bx, by, boy); });
      var from = himmaJoint(ij.wristA), held = sword >= 1;
      if (held) { hhSword(bj, 0.15, 0.55); }
      else {
        var to = himmaJoint(bj.wristA);
        kanchai(mix(from[0], to[0], sword), mix(from[1], to[1], sword) + 48 * 0.55 * sword, {size: 0.55, angle: mix(-0.6, 0.15, sword)});
      }
    }
    person(bx, by, boy);
    hhCloudFeet(bx, by, t, 260, 18);
    if (made > 0 && made < 1) {                          // the flash as it wakes
      pen.save(); pen.globalCompositeOperation = "lighter";
      var f = pen.createRadialGradient(H07_SWAN[0], H07_SWAN[1], 10, H07_SWAN[0], H07_SWAN[1], 600);
      f.addColorStop(0, "rgba(255, 250, 220, " + (0.9 * (1 - Math.abs(made - 0.4) * 2)) + ")"); f.addColorStop(1, "rgba(255, 250, 220, 0)");
      pen.fillStyle = f; pen.fillRect(0, 0, WIDE, 1080); pen.restore();
    }
    hhCameraEnd();
  } else {                                               // the dive: down through the clouds, the world coming up
    var s = t - H07_CUTS[0], down = between(s, 0, 19);
    var g = pen.createLinearGradient(0, 0, 0, 1080);
    g.addColorStop(0, mix(0, 1, down) > 0.5 ? "#8ccfc6" : "#7a98d0"); g.addColorStop(1, "#f4ecd2");
    pen.fillStyle = g; pen.fillRect(0, 0, WIDE, 1080);
    if (down > 0.45) {                                   // the world below: the hills and the city's fields
      pen.save(); pen.globalAlpha = between(down, 0.45, 0.8);
      pen.translate(0, mix(500, 0, between(down, 0.45, 1)));
      pen.drawImage(hhFields(), 0, 0); cngGateWall(0, t);
      pen.restore();
    }
    var sx = mix(1500, 900, between(s, 0, 8)), sy = 420 + 30 * Math.sin(t * 1.2);
    var h = hongHin(sx, sy, t, {size: 1.9, face: -1, rider: true});
    var hands = [h.seat[0] - 50, h.seat[1] - 55];
    person(h.seat[0], h.seat[1], hhBoy(13, {floor: "astride", shin: 0.75, face: -1, feel: "happy", reachA: hands, reachB: [hands[0] + 10, hands[1] + 6],
                                            grip: true, at: [h.beak[0] - 80, h.beak[1]]}));   // the shin swung back, clear of the wing (owner, 2026-11-13)
    hongHinReins(h, hands);
    h.near();                                            // the near wing over the boy's leg (owner, 2026-11-12)
    for (var c = 0; c < 4; c++) {                        // clouds rushing up past them, in front: they fly through them (owner, 2026-11-13)
      var cy = ((c * 420 - s * 260) % 1680 + 1680) % 1680 - 300;
      sceneryCloudBank(t, c % 2 ? 420 : 1500, cy, 1000, {seed: 3 + c, light: "day"});   // soft, the kit's (2026-11-13)
    }
  }
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H07_CUTS, H07_PLAN, H07_LINES, H07_LONG));
}
