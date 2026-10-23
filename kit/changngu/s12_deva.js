// s12_deva.js - scene 12 of the film of Chang Ngu: the deva (45 s). Night, the headman's house: Phrom, thirteen, asleep
// on his mat; near dawn a deva comes in its own light, floating over him (himmaphan.js thewada), and speaks (the
// chronicle: "cut a hook of wood, wash your face in the Mae Khong; three white elephants will float down"); as it
// tells of the three elephants a vision opens over the sleeper, a soft round of river with white elephants floating
// down it, one, then two, then three, the third brightest (it wins Lanna and the Black Khom).
var C12_LONG = 45;
var C12_SOUND = {calls: []};
var C12_LINES = [[1.6, 7.82, "C050"], [8.02, 11.94, "C051"], [12.14, 17.14, "C052"], [18.4, 23.12, "C053"], [23.6, 28.66, "C054"], [29.4, 33.9, "C055"], [35.2, 42.7, "C056"]];
var C12_MAT = [780, CNG_FLOOR + 70];
var C12_VISION = [880, 520, 300, 150];                 // the vision's middle, and its half width and height
var C12_COUNT = [23.6, 29.4, 35.2];                    // when each elephant comes into the vision

// The vision: a soft round of the Mae Khong with the white elephants floating down it, how many by t. e.g. c12Vision(30);
function c12Vision(t) {
  var open = between(t, 18.4, 20) * (1 - between(t, 42, 44)), v = C12_VISION;
  if (open <= 0) { return; }
  pen.save();
  pen.globalAlpha = open;
  pen.beginPath(); pen.ellipse(v[0], v[1], v[2], v[3], 0, 0, 7); pen.clip();
  csBand(pen, v[0] - v[2], v[1] - v[3], 2 * v[2], v[3], "#c9b4dc", "#f2e2ee");   // a dream's sky
  csBand(pen, v[0] - v[2], v[1], 2 * v[2], v[3], "#b8a07a", "#8a7250");           // the river
  waves(pen, v[0] - v[2], v[1] + 6, 2 * v[2], v[3], "rgba(250, 238, 210, 0.35)", t);
  C12_COUNT.forEach(function (at, k) {
    var shown = between(t, at, at + 1.2);
    if (shown <= 0) { return; }
    var x = v[0] - 200 + k * 200 + 30 * Math.sin(t * 0.6 + k), y = v[1] + 60 + 6 * Math.sin(t * 1.5 + k);
    pen.save();
    pen.globalAlpha = open * shown * (k === 2 ? 1 : 0.8);
    elephant(x, y, {size: 0.18, face: -1, colour: "#f1ddd3", cloth: k === 2 ? "#c9962a" : undefined, trunk: 0.3});
    if (k === 2) {                                         // the third, in a light of its own
      var g = pen.createRadialGradient(x, y - 40, 4, x, y - 40, 90);
      g.addColorStop(0, "rgba(255, 240, 180, 0.6)"); g.addColorStop(1, "rgba(255, 240, 180, 0)");
      pen.fillStyle = g; pen.beginPath(); pen.arc(x, y - 40, 90, 0, 7); pen.fill();
    }
    pen.restore();
  });
  pen.restore();
  pen.save();
  pen.globalAlpha = open * 0.8;
  pen.strokeStyle = "#f6e6b8"; pen.lineWidth = 4;
  pen.beginPath(); pen.ellipse(v[0], v[1], v[2], v[3], 0, 0, 7); pen.stroke();
  pen.restore();
}

// Scene 12, the entry the film calls (SCENES): t, its own second, 0 to C12_LONG (45 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngRoom("night"), CNG_FLOOR, cngPerson() with CNG_PHROM, cngAgeSize(); from
// himmaphan.js thewada(); from pieces.js pratheep(). Its words are C12_LINES (C050 to C056). Its z plan: the room, the
// sleeper, the deva in its light, the vision over all.
function cngSceneDeva(t) {
  pen.save();                                              // the room framed higher and closer, all of it above the words
  pen.translate(WIDE / 2, 600);
  pen.scale(1.25, 1.25);
  pen.translate(-960, -(CNG_FLOOR - 60));
  pen.drawImage(cngRoom("night"), 0, 0);
  pratheep(pen, 330, CNG_FLOOR + 30, 2.0, t, 2, {});
  var size = cngAgeSize(13);
  pen.save();                                              // Phrom asleep on his side on the mat, a cloth over him
  pen.translate(C12_MAT[0] + 120, C12_MAT[1] - 18);
  pen.rotate(-Math.PI / 2);
  person(0, 0, cngPerson("boy", CNG_PHROM, {id: "phromasleep", size: size, face: -1, feel: "sleepy", blink: 1}));
  pen.restore();
  pen.fillStyle = "#5a4a7a";
  var breath = 2 * Math.sin(t * 1.3);
  pen.beginPath(); pen.moveTo(C12_MAT[0] - 40, C12_MAT[1] - 6);
  pen.quadraticCurveTo(C12_MAT[0] + 40, C12_MAT[1] - 54 - breath, C12_MAT[0] + 130, C12_MAT[1] - 30);
  pen.lineTo(C12_MAT[0] + 150, C12_MAT[1] - 4); pen.closePath(); pen.fill();
  var come = between(t, 4, 7.5) * (1 - between(t, 42.5, 44.5));
  if (come > 0) {                                          // the deva, coming in its own light and floating over him
    var dx = 1360, dy = 640 + 12 * Math.sin(t * 1.2);
    var light = pen.createRadialGradient(dx, dy, 20, dx, dy, 420);
    light.addColorStop(0, "rgba(255, 244, 200, " + (0.55 * come).toFixed(3) + ")"); light.addColorStop(1, "rgba(255, 230, 160, 0)");
    pen.fillStyle = light; pen.fillRect(0, 0, WIDE, 1080);
    pen.save();
    pen.globalAlpha = come;
    thewada(dx, dy, t, {size: 1.3, face: -1, scarves: true, light: 0.9});
    pen.restore();
  }
  c12Vision(t);
  pen.restore();
  cngFadeIn(t, 1);
}
