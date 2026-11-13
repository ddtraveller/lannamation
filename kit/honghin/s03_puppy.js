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
var H03_LIE = [1040, CNG_FLOOR + 40, 300];                 // Vimala lying on the mat: her middle, and her length (square on it, 2026-11-13)

// A pillow of the north (mon), its ends banded in gold, under her head: (x, y) its middle.
function h03Pillow(x, y) {
  pen.save();
  pen.beginPath(); pen.moveTo(x - 46, y - 14); pen.quadraticCurveTo(x, y - 22, x + 46, y - 14); pen.lineTo(x + 48, y + 14);
  pen.quadraticCurveTo(x, y + 20, x - 48, y + 14); pen.closePath();
  var g = pen.createLinearGradient(0, y - 20, 0, y + 18); g.addColorStop(0, "#d8484a"); g.addColorStop(1, "#8a1e24");
  pen.fillStyle = g; pen.fill(); pen.strokeStyle = "#4a1010"; pen.lineWidth = 1.5; pen.stroke();
  pen.fillStyle = "#e0b23a";
  [-1, 1].forEach(function (d) { pen.fillRect(x + d * 40 - 4, y - 15, 8, 30); });   // the gold bands at its ends
  pen.strokeStyle = "rgba(255, 220, 180, 0.4)"; pen.beginPath(); pen.moveTo(x - 30, y - 10); pen.quadraticCurveTo(x, y - 16, x + 30, y - 10); pen.stroke();
  pen.restore();
}
// A blanket of woven cotton over her from the waist to past the feet, from x0 to x1, her middle's height y: its top in
// soft folds over her, its hem down on the mat, bands of weave across it.
function h03Blanket(x0, x1, y) {
  pen.save();
  pen.beginPath(); pen.moveTo(x0, y + 26);
  pen.bezierCurveTo(x0 - 6, y - 4, x0 + 10, y - 30, x0 + 40, y - 30);
  for (var k = 1; k <= 6; k++) { var xx = mix(x0 + 40, x1 - 20, k / 6); pen.quadraticCurveTo(xx - 20, y - 36 + (k % 2) * 6, xx, y - 28 - (k === 6 ? -6 : 0)); }
  pen.quadraticCurveTo(x1 + 10, y - 10, x1 + 6, y + 26); pen.closePath();
  var g = pen.createLinearGradient(0, y - 34, 0, y + 26); g.addColorStop(0, "#5a7aa8"); g.addColorStop(1, "#2e4470");
  pen.fillStyle = g; pen.fill(); pen.strokeStyle = "#1a2440"; pen.lineWidth = 1.5; pen.stroke();
  pen.save(); pen.clip();
  [[0.25, "#e0b23a"], [0.5, "#c8303a"], [0.75, "#e0b23a"]].forEach(function (b) {   // bands of weave across it
    var bx = mix(x0, x1, b[0]); pen.fillStyle = b[1]; pen.fillRect(bx - 5, y - 40, 10, 70);
    pen.fillStyle = "#f4eee0"; for (var d = 0; d < 6; d++) { pen.fillRect(bx - 1.5, y - 30 + d * 10, 3, 4); }
  });
  pen.strokeStyle = "rgba(10, 16, 40, 0.35)"; pen.lineWidth = 1.2;   // its folds
  for (k = 1; k < 5; k++) { var fx = mix(x0 + 30, x1 - 10, k / 5); pen.beginPath(); pen.moveTo(fx, y - 26); pen.quadraticCurveTo(fx + 6, y, fx - 2, y + 24); pen.stroke(); }
  pen.restore();
  // its head end folded back on itself, the lining showing, and the end draped over her arm and hanging down before her
  // (owner, 2026-11-13)
  pen.beginPath(); pen.moveTo(x0 + 2, y + 26); pen.bezierCurveTo(x0 - 4, y - 4, x0 + 8, y - 34, x0 + 34, y - 36);
  pen.lineTo(x0 + 70, y - 30); pen.quadraticCurveTo(x0 + 60, y - 6, x0 + 66, y + 30); pen.quadraticCurveTo(x0 + 30, y + 34, x0 + 2, y + 26); pen.closePath();
  var lining = pen.createLinearGradient(x0, 0, x0 + 70, 0); lining.addColorStop(0, "#efe4c8"); lining.addColorStop(1, "#d4c6a4");
  pen.fillStyle = lining; pen.fill(); pen.strokeStyle = "#1a2440"; pen.lineWidth = 1.5; pen.stroke();
  pen.fillStyle = "#c8303a"; pen.fillRect(x0 + 20, y - 34, 6, 62);   // a band of the weave on the lining's edge
  pen.strokeStyle = "rgba(60, 50, 30, 0.35)"; pen.lineWidth = 1;    // the fold's crease, and the lining's own folds
  pen.beginPath(); pen.moveTo(x0 + 66, y - 30); pen.quadraticCurveTo(x0 + 58, y, x0 + 64, y + 28); pen.stroke();
  pen.beginPath(); pen.moveTo(x0 + 40, y - 30); pen.quadraticCurveTo(x0 + 44, y, x0 + 38, y + 28); pen.stroke();
  pen.beginPath(); pen.moveTo(x0 + 6, y + 20); pen.quadraticCurveTo(x0 - 10, y + 34, x0 - 4, y + 52); pen.lineTo(x0 + 18, y + 50);   // the end, hanging down off her arm
  pen.quadraticCurveTo(x0 + 16, y + 34, x0 + 24, y + 26); pen.closePath();
  pen.fillStyle = "#3a5a8a"; pen.fill(); pen.strokeStyle = "#1a2440"; pen.stroke();
  pen.fillStyle = "#e0b23a"; for (k = 0; k < 4; k++) { pen.fillRect(x0 - 2 + k * 5, y + 48, 2, 7); }   // its fringe
  pen.restore();
}
var H03_FACES = [{feel: "concerned"}, {feel: "neutral"}, {feel: "thinking"}, {feel: "neutral", anger: 0.4},
                 {feel: "angry", smile: 0.35}, {feel: "angry"}];   // worried, neutral, serious, stern, mean (a cold smile), angry
// The room by night, its lamp, Vimala and the six. t: seconds; part: "crowd" (they come round her) or "hands".
function h03Room(t, part) {
  pen.drawImage(cngRoom("night"), 0, 0);
  sceneryLampLight(t, 520, CNG_FLOOR - 40, CNG_FLOOR + 20, {reach: 420, strength: 0.9, seed: 5});
  var faint = part === "hands" || t > 9.5, list = [];
  var down = part === "hands" ? 1 : between(t, 9.5, 10.3);   // she faints and lies down on the mat, her eyes shut
  list.push({name: "vimala", kind: "person", x: H03_MAT[0], y: mix(H03_MAT[1], H03_LIE[1], down), draw: function () {   // (owner, 2026-11-12)
    if (down < 1) {
      pen.save(); pen.globalAlpha = 1 - down;
      person(H03_MAT[0], H03_MAT[1], hhVimala({floor: "side", face: 1, feel: "concerned"}));
      pen.restore();
    }
    if (down > 0) {                                     // on the mat, her head on a pillow, a blanket over her (owner, 2026-11-13)
      pen.save(); pen.globalAlpha = down;
      if (part === "hands") { h03Pillow(H03_LIE[0] - H03_LIE[2] / 2 + 24, H03_LIE[1] + 14); }
      hhCarried(H03_LIE[0], H03_LIE[1], H03_LIE[2], hhVimala({feel: "sleepy", blink: 1}), 1);
      if (part === "hands") { h03Blanket(H03_LIE[0] - H03_LIE[2] / 2 + 62, H03_LIE[0] + H03_LIE[2] / 2 + 14, H03_LIE[1]); }   // neck to feet (2026-11-13)
      pen.restore();
    }
  }});
  for (var k = 0; k < 6; k++) {
    (function (k) {
      var x = 560 + k * 130 + (k > 2 ? 300 : 0), y = CNG_FLOOR + 10 + (k % 2) * 40;
      if (part === "hands" && k === 4) { return; }       // she has gone to the hole with the child
      list.push({name: "wife " + k, kind: "person", x: x, y: y, draw: function () {
        // their faces from worried through neutral and serious to mean and angry (owner, 2026-11-13)
        person(x, y, hhWife(k, Object.assign({face: x < H03_MAT[0] ? 1 : -1, at: [H03_MAT[0], H03_MAT[1] - 140]}, H03_FACES[k])));
      }});
    })(k);
  }
  if (part === "hands") {                               // the puppy beside her; one wife at the hole with the child
    var gone = between(t, 25.5, 27.5);
    list.push({name: "puppy", kind: "dog", x: H03_LIE[0] + 60, y: H03_LIE[1] + 40, draw: function () {
      pen.save(); pen.translate(H03_LIE[0] + 60, H03_LIE[1] + 40); pen.scale(0.55, 0.55);
      puppy(0, 0, t, {feel: "sad", still: true}); pen.restore();
    }});
    list.push({name: "wife at the hole", kind: "person", x: H03_HOLE[0] + 120, y: H03_HOLE[1], draw: function () {
      var hx = H03_HOLE[0] + 40, hy = H03_HOLE[1] - 120 + 220 * gone;   // down through the hole and gone (owner, 2026-11-13)
      person(H03_HOLE[0] + 120, H03_HOLE[1], hhWife(4, {face: -1, feel: "angry", reachA: [hx, hy], reachB: [hx + 20, hy + 6], at: [H03_HOLE[0], H03_HOLE[1]]}));
      if (gone < 1) {                                    // the baby, only what is still above the floor
        pen.save(); pen.beginPath(); pen.rect(-WIDE, -2000, 3 * WIDE, H03_HOLE[1] - 14 + 2000); pen.rect(-WIDE, H03_HOLE[1] - 14, H03_HOLE[0] - 40 + WIDE, 3000);
        pen.rect(H03_HOLE[0] + 40, H03_HOLE[1] - 14, 3 * WIDE, 3000); pen.clip();
        pen.translate(H03_HOLE[0], hy); pen.rotate(Math.PI / 2 * between(gone, 0, 0.25));   // turned feet down over the hole, then down it
        swaddledBaby(pen, 10, 0, 0.5); pen.restore();
      }
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
    hhCloudFeet(jx, jy, t, 560, 19);                     // the throne's foot in the cloud (scenery pass)
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
    sceneryCloudBank(t, 960, 1090, 1700, {seed: 9});      // soft cloud, the kit's (2026-11-13)
  }
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H03_CUTS, H03_PLAN, H03_LINES, H03_LONG));
}
