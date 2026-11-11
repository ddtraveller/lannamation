// s03_puppy.js - scene 3 of the film of Hong Hin: the puppy (55 s). Night, the queen's room, a lamp: the six wives
// crowd round Vimala; she faints. Their hands: a spotted puppy laid beside her; the baby carried to a hole in the floor.
// Far above, Indra on his stone throne: it glows; he looks down. In the clouds the falling child is caught by Indra and
// Witsanukam and carried up.
var H03_LONG = 55;
var H03_SOUND = {calls: [[0.0, "crickets", 0.2, 28.73], [30.04, "wind", 0.2, 24.96]]};
var H03_LINES = [[1.5, 10.0, "H011"], [10.2, 15.1, "H012"], [17, 23.5, "H013"], [24.2, 29.84, "H014"], [30.04, 38.58, "H015"], [44.6, 51.2, "H016"]];
// The lines as the scene was drawn to them; it plays to H03_LINES, Pan's voice (sets.js hhClock()).
var H03_PLAN = [[1.5, 7.4, "H011"], [8.6, 11.8, "H012"], [17, 23.2, "H013"], [24.2, 28.6, "H014"], [30, 37.4, "H015"], [44.6, 51.6, "H016"]];
var H03_CUTS = [16.5, 29.2, 43.6];
var H03_MAT = [860, CNG_FLOOR + 40];                    // where Vimala lies on the mat
var H03_HOLE = [1180, CNG_FLOOR + 70];                  // the hole in the floor

// The room by night, its lamp, Vimala and the six. t: seconds; part: "crowd" (they come round her) or "hands".
function h03Room(t, part) {
  pen.drawImage(cngRoom("night"), 0, 0);
  sceneryLampLight(t, 520, CNG_FLOOR - 40, CNG_FLOOR + 20, {reach: 420, strength: 0.9, seed: 5});
  var faint = part === "hands" || t > 9.5, list = [];
  list.push({name: "vimala", kind: "person", x: H03_MAT[0], y: H03_MAT[1], draw: function () {
    person(H03_MAT[0], H03_MAT[1], hhVimala({floor: "side", face: 1, feel: faint ? "sleepy" : "concerned", blink: faint ? 1 : undefined}));
  }});
  for (var k = 0; k < 6; k++) {
    (function (k) {
      var x = 560 + k * 130 + (k > 2 ? 300 : 0), y = CNG_FLOOR + 10 + (k % 2) * 40;
      if (part === "hands" && k === 4) { return; }       // she has gone to the hole with the child
      list.push({name: "wife " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, hhWife(k, {face: x < H03_MAT[0] ? 1 : -1, feel: "concerned", at: [H03_MAT[0], H03_MAT[1] - 140]}));
      }});
    })(k);
  }
  if (part === "hands") {                               // the puppy beside her; one wife at the hole with the child
    var gone = between(t, 25.5, 27.5);
    list.push({name: "puppy", kind: "dog", x: H03_MAT[0] + 120, y: H03_MAT[1] + 20, draw: function () {
      pen.save(); pen.translate(H03_MAT[0] + 120, H03_MAT[1] + 20); pen.scale(0.55, 0.55);
      puppy(0, 0, t, {feel: "sad"}); pen.restore();
    }});
    list.push({name: "wife at the hole", kind: "person", x: H03_HOLE[0] + 120, y: H03_HOLE[1], draw: function () {
      var hx = H03_HOLE[0] + 40, hy = H03_HOLE[1] - 120 + 120 * gone;
      person(H03_HOLE[0] + 120, H03_HOLE[1], hhWife(4, {face: -1, feel: "angry", reachA: [hx, hy], reachB: [hx + 20, hy + 6], at: [H03_HOLE[0], H03_HOLE[1]]}));
      if (gone < 1) { swaddledBaby(pen, hx, hy, 0.5); }
    }});
  }
  pen.fillStyle = "#0a0806";                            // the hole in the floor boards
  pen.fillRect(H03_HOLE[0] - 40, H03_HOLE[1] - 14, 80, 22);
  drawByZ(list);
}

// Scene 3, the entry the film calls. From sets.js: hhVimala(), hhWife(), hhCamera(), hhCuts(); changngu/sets.js cngRoom().
function hhScenePuppy(t) {
  var said = t; t = hhClock(t, H03_PLAN, H03_LINES, H03_LONG);
  if (t < H03_CUTS[0]) {
    hhCamera(0.5 + 0.3 * between(t, 0, H03_CUTS[0]), 900, 760, 1.35);
    h03Room(t, "crowd");
    hhCameraEnd();
  } else if (t < H03_CUTS[1]) {
    hhCamera(1, 1000, 820, 1.7);
    h03Room(t, "hands");
    hhCameraEnd();
  } else if (t < H03_CUTS[2]) {                          // Indra on his throne; it glows red; he looks down
    hhHeaven(t);
    var hot = between(t, 31, 35);
    var jx = 960, jy = 900;
    indra(jx, jy, t, {pose: "throne", id: "indraThrone", feel: hot > 0.5 ? "surprised" : "neutral", at: hot > 0.8 ? [jx, 1400] : [jx + 400, 400]});
    pen.save();
    pen.globalCompositeOperation = "lighter";
    pen.fillStyle = "rgba(255, 70, 30, " + (0.45 * hot * (0.85 + 0.15 * Math.sin(t * 9))).toFixed(3) + ")";
    pen.fillRect(jx - 182, jy - 212, 364, 212);
    pen.restore();
  } else {                                               // the child falling through the clouds, caught, carried up
    var s = t - H03_CUTS[2], caught = between(s, 2.6, 3.4), up = between(s, 3.6, 11);
    hhHeaven(t + 20);
    var bx = 900, by = s < 3 ? mix(-60, 520, between(s, 0, 3)) : mix(520, 300, up);
    indra(bx + 130 - 40 * caught, by + 20 + mix(260, 0, between(s, 0, 2.8)), t, {pose: "fly", size: 1.3, face: -1, seed: 1});
    thewada(bx - 150, by + 40 + mix(220, 0, between(s, 0, 2.8)), t, {size: 1.2, seed: 2.2, scarves: true});
    if (caught > 0) {                                    // a soft light round him, behind him
      var g = pen.createRadialGradient(bx, by, 4, bx, by, 160);
      g.addColorStop(0, "rgba(255, 236, 170, " + (0.5 * caught) + ")"); g.addColorStop(1, "rgba(255, 236, 170, 0)");
      pen.fillStyle = g; pen.beginPath(); pen.arc(bx, by, 160, 0, 7); pen.fill();
    }
    swaddledBaby(pen, bx, by, 0.85);
    thaiCloud(960, 1060, 1500, t, 9);
  }
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H03_CUTS, H03_PLAN, H03_LINES, H03_LONG));
}
