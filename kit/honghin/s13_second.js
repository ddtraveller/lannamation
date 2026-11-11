// s13_second.js - scene 13 of the film of Hong Hin: the second and the third (60 s). A green palace in the forest: King
// Kumbhanda, a green yaksha, gives the boy his daughter Culakantha, pale green, her eyes black as gems. A blue city: King
// Anumat comes at the boy in a rage, sees the wheel on the soles of his feet, kneels, gives him Salicanta, and points
// the way south to the ghouls' city; the swan flies off that way.
var H13_LONG = 60;
var H13_SOUND = {calls: [[0, "birds", 0.2, 12], [13, "roar", 0.3], [36, "wind", 0.2, 24]]};
var H13_LINES = [[2, 11.2, "H058"], [13, 21.2, "H059"], [22.6, 28.4, "H060"], [30, 35.2, "H061"]];
var H13_CUTS = [12.4, 36.2];

// Scene 13, the entry the film calls. From sets.js: hhGiantCity(), hhBoy(); ogre.js ogre(), ogreDaughter(); himmaphan.js
// hongHin().
function hhSceneSecond(t) {
  var h = HH_GIANT_HALL;
  if (t < H13_CUTS[0]) {                                // the green palace: Kumbhanda gives Culakantha
    hhCamera(0.7, h[0], 780, 1.3);
    hhGiantCity(t, "green", [[0, ogreDaughter("culakantha", {size: 0.8, id: "culakantha", floor: "side", face: -1, at: [h[0] - 360, 760]})]], [
      {name: "boy", kind: "person", x: h[0] - 360, y: 1000, draw: function () { person(h[0] - 360, 1000, hhBoy(13, {face: 1, feel: "happy", at: [h[0], 700]})); }},
      {name: "kumbhanda", kind: "person", x: h[0] + 320, y: 1010, draw: function () {
        ogre(h[0] + 320, 1010, t, {kind: "mural", id: "kumbhanda", face: -1, size: 1.25, feel: t > 6 ? "happy" : "angry", at: [h[0] - 360, 700],
                                   wai: t > 7 ? 1 : undefined});
      }}]);
    hhCameraEnd();
  } else if (t < H13_CUTS[1]) {                          // the blue city: Anumat's rage, the wheel, his bow, Salicanta
    var see = between(t, 24.5, 26), kneel = between(t, 26, 28);
    hhCamera(0.8, h[0], 780, 1.3);
    var bx = h[0] - 340, ax = mix(WIDE + 100, h[0] + 260, between(t, 13, 16));
    hhGiantCity(t, "blue", [[0, ogreDaughter("salicanta", {size: 0.8, id: "salicanta", floor: "side", face: -1, at: [bx, 760]})]], [
      {name: "boy", kind: "person", x: bx, y: 1000, draw: function () {
        person(bx, 1000, hhBoy(13, {face: 1, feel: kneel > 0 ? "happy" : "neutral", at: [ax, 700]}));
        if (see > 0) {                                     // the wheel on the soles of his feet, glowing
          pen.save(); pen.globalCompositeOperation = "lighter";
          var g = pen.createRadialGradient(bx, 990, 2, bx, 990, 70);
          g.addColorStop(0, "rgba(255, 220, 120, " + (0.8 * see) + ")"); g.addColorStop(1, "rgba(255, 220, 120, 0)");
          pen.fillStyle = g; pen.beginPath(); pen.arc(bx, 990, 70, 0, 7); pen.fill(); pen.restore();
          pen.strokeStyle = "rgba(200, 150, 40, " + see + ")"; pen.lineWidth = 3;
          pen.beginPath(); pen.arc(bx, 990, 22, 0, 7); pen.stroke();
          for (var k = 0; k < 8; k++) { pen.beginPath(); pen.moveTo(bx, 990); pen.lineTo(bx + 22 * Math.cos(k * 0.785), 990 + 22 * Math.sin(k * 0.785)); pen.stroke(); }
        }
      }},
      {name: "anumat", kind: "person", x: ax, y: 1010, draw: function () {
        ogre(ax, 1010, t, {kind: "forest", id: "anumat", face: -1, size: 1.25, feel: kneel > 0 ? "awe" : "angry", floor: kneel > 0.5 ? "cross" : undefined,
                           wai: kneel > 0.8 ? 1 : undefined, at: see > 0 ? [bx, 990] : [bx, 700],
                           reachA: kneel <= 0 && t > 16 ? [ax - 180, 760] : t > 30 ? [ax - 260, 600] : undefined});
      }}]);
    hhCameraEnd();
  } else {                                               // south: the swan flies off over the blue city
    var s = t - H13_CUTS[1];
    hhGiantCity(t, "blue", [], []);
    var hs = hongHin(mix(1500, -300, between(s, 0, 18)), 380 + 30 * Math.sin(t), t, {size: 1.4, face: -1});
    person(hs.seat[0], hs.seat[1], hhBoy(13, {floor: "astride", face: -1, feel: "neutral"}));
  }
  welFadeIn(t, 1.5);
  hhCuts(t, H13_CUTS);
}
