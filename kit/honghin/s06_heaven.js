// s06_heaven.js - scene 6 of the film of Hong Hin: the boy in heaven (45 s). Indra's queens hold the crying baby; they
// have no milk for him. Years pass: the boy, grown, asks Indra who his mother is; Indra tells him, and the clouds part
// on a small hut in an orchard far below.
var H06_LONG = 45;
var H06_SOUND = {calls: [[0.0, "wind", 0.15, 45.0]]};
var H06_LINES = [[2, 9.84, "H024"], [12.4, 19.28, "H025"], [19.48, 29.58, "H026"]];
// The lines as the scene was drawn to them; it plays to H06_LINES, Pan's voice (sets.js hhClock()).
var H06_PLAN = [[2, 9.6, "H024"], [12.4, 16.2, "H025"], [19, 27.4, "H026"]];
var H06_CUTS = [11.2];

// Scene 6, the entry the film calls. From sets.js: hhHeaven(), hhBoy(), hhOrchardAt(); himmaphan.js indra().
function hhSceneHeaven(t) {
  var said = t; t = hhClock(t, H06_PLAN, H06_LINES, H06_LONG);
  if (t < H06_CUTS[0]) {                                // the queens of heaven and the crying child
    hhCamera(0.7, 900, 700, 1.3);
    hhHeaven(t);
    [[700, 1, "celestial"], [1120, -1, "celestial"]].forEach(function (q, i) {
      person(q[0], 960, welPerson("woman:" + q[2], {size: 0.8}, {id: "queen" + i, face: q[1], feel: "concerned", at: [900, 760], free: true,
                                                                reachA: i === 0 ? [880, 760] : undefined, reachB: i === 0 ? [900, 770] : undefined}));
    });
    swaddledBaby(pen, 900, 770, 0.7);
    if (Math.sin(t * 5) > 0) {                          // his crying, little lines over him
      pen.strokeStyle = "rgba(90, 60, 40, 0.7)"; pen.lineWidth = 2;
      [-1, 0, 1].forEach(function (d) { pen.beginPath(); pen.moveTo(900 + d * 18, 730); pen.lineTo(900 + d * 26, 712); pen.stroke(); });
    }
    hhCameraEnd();
  } else {                                               // the boy grown, asking; Indra telling; the clouds parting below
    var s = t - H06_CUTS[0], part = between(s, 16, 22);
    hhHeaven(t, 1060);
    if (part > 0) {                                      // a gap in the clouds, the orchard far below in it
      pen.save();
      pen.beginPath(); pen.ellipse(960, 960, 360 * part, 120 * part, 0, 0, 7); pen.clip();
      pen.translate(960, 960); pen.scale(0.42, 0.42); pen.translate(-HH_ORCHARD_HOUSE[0], -HH_ORCHARD_HOUSE[1] + 40);
      hhOrchardAt(t, "day");
      pen.restore();
      pen.strokeStyle = "rgba(255, 255, 255, 0.9)"; pen.lineWidth = 10;
      pen.beginPath(); pen.ellipse(960, 960, 360 * part, 120 * part, 0, 0, 7); pen.stroke();
    }
    var asking = welSays(t, H06_PLAN, ["H025"]), telling = welSays(t, H06_PLAN, ["H026"]);
    person(640, 900, hhBoy(10, {face: 1, feel: telling ? "surprised" : "concerned", mouth: welTalk(t, asking),
                                at: part > 0.5 ? [960, 960] : [1240, 640]}));
    indra(1240, 900, t, {pose: "stand", id: "indra", face: -1, feel: "concerned", at: part > 0.5 ? [960, 960] : [640, 700]});
  }
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H06_CUTS, H06_PLAN, H06_LINES, H06_LONG));
}
