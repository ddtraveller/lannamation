// s02_family.js - scene 2 of the film of the creature with four ears and five eyes: the poor family (55 s).
// Morning: a father, a mother and their little son come out of their hut and walk the path toward the city,
// the mother with a bowl, to ask for food. Night: the hut's lamp glows in its door, and slowly goes out (his
// mother passes away; nothing more is shown). The next morning: only the father and the boy walk the path.
var S02_LONG = 55;
var S02_LINES = [[1.5, 5.5, "M005"], [6.0, 9.2, "M006"], [9.6, 12.6, "M007"], [13.0, 16.2, "M008"], [16.6, 21.4, "M009"],
                 [27.5, 32.5, "M010"], [42.0, 45.6, "M011"]];

function s02Bowl(joints) {                          // a small wooden bowl in the mother's near hand
  var hand = joints.handA, wrist = joints.wristA;
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);              // the joints are in the film's own pixels
  pen.translate(hand[0] + (hand[0] - wrist[0]) * 0.2, hand[1] + 6 * PIX);
  pen.scale(PIX, PIX);
  pen.beginPath();
  pen.moveTo(-16, -4);
  pen.quadraticCurveTo(0, 18, 16, -4);
  pen.closePath();
  shape("#8a5a36");
  pen.beginPath();
  pen.ellipse(0, -4, 16, 4, 0, 0, 7);
  shape("#5e3a22");
  pen.restore();
}

function s02Walk(t, start, names) {                 // the family on the path from the hut, out to the right
  var spots = names.length === 2 ? {father: 860, boy: 760} : {father: 1000, boy: 860, mother: 720};   // in a line, the father first
  names.forEach(function (name) {
    var from = spots[name], begin = start;
    var kind = {father: "fellow", mother: "weaver", boy: "boy"}[name];
    var own = {father: MAENG_FATHER, mother: MAENG_MOTHER, boy: MAENG_BOY}[name];
    var feel = names.length === 2 ? {father: "concerned", boy: "sad"}[name] : "neutral";
    var go = stroll(t, from, from + 1400, begin, maengPerson(kind, own, {id: name, feel: feel, stride: names.length === 2 ? 0.8 : 1}));
    var joints = person(go.x, maengWay(go.x) + 12, go.look);    // on the worn middle of the path
    if (name === "mother") { s02Bowl(joints); }
  });
}

function sceneFamily(t) {
  if (t < 24.5) {                                   // morning: the three go to the city
    maengYardAt(t, 0, 0);
    s02Walk(t, 3, ["boy", "mother", "father"]);
    maengDark(t, 23, 99);
  } else if (t < 39.5) {                            // night: the lamp in the door, and it goes out
    var glow = 1 - between(t, 33, 36.5);
    maengYardAt(t, 1, glow * (0.9 + 0.1 * Math.sin(t * 6.3)));
    maengDark(t, 38, 24.5);
  } else {                                          // the next morning: the father and the boy
    maengYardAt(t, 0, 0);
    s02Walk(t, 41.5, ["boy", "father"]);
    maengDark(t, 99, 39.5);
  }
}
