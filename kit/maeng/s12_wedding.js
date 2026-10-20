// s12_wedding.js - scene 12 of the film of the creature with four ears and five eyes: the wedding, and the Righteous
// King (35 s). Dusk at the palace, its lanterns lit: Thukkhata, grown and in a noble's dress, sits on the dais beside
// Princess Sima, the king by them; the band of the north plays in the courtyard, and two guests sit at a khantoke.
// Then by day: he is rich now and has stayed as he was, and at the palace's stair he fills the bowls of the poor
// from a rice basket, as his mother once carried a bowl to the city. Last: later he is king, on the dais, and the
// people sit before him with their hands raised in a wai: the Righteous King, Phaya Thammikarat.
var S12_LONG = 35;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets of the wedding's dusk, low under the band; the cicadas by day.
var S12_SOUND = {calls: [[0, "crickets", 0.22, 12.6], [12.6, "cicadas", 0.5, 22.4]]};
var S12_LINES = [[1.5, 6.34, "M069"], [14.0, 20.78, "M070"], [20.98, 25.7, "M071"], [25.8, 33.0, "M072"]];
var S12_SHOTS = [12.6, 25.0];                       // the wedding at dusk; the rice by day; the Righteous King
// The poor who come to him: in the faded cloth of his own family, each with a bowl.
var S12_POOR = [["fellow", MAENG_FATHER, -170], ["weaver", MAENG_MOTHER, -330], ["boy", MAENG_BOY, -470]];
var S12_PEOPLE = [[420, 940, "inta"], [560, 960, "buakham"], [700, 940, "khammun"], [830, 965, "sinuan"], [960, 945, "bunma"]];
var S12_LIFE = [
  {name: "flock at dusk", kind: "flock", layer: "back", course: [[0.5, 2150, 200], [12.0, -150, 150]]},
  {name: "blue magpie", kind: "magpie", layer: "back", look: {size: 0.6},
   course: [[S12_SHOTS[0], MAENG_FINIAL[0], MAENG_FINIAL[1] + 4], [S12_LONG, MAENG_FINIAL[0], MAENG_FINIAL[1] + 4]]}
];

function s12Bowl(joints, full) {                    // a wooden bowl in a near hand, its rice heaped once it is filled
  var hand = joints.handA, wrist = joints.wristA;
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);               // the joints are in the film's own pixels
  pen.translate(hand[0] + (hand[0] - wrist[0]) * 0.2, hand[1] + 6 * PIX);
  pen.scale(PIX, PIX);
  if (full) {
    pen.beginPath();
    pen.ellipse(0, -6, 13, 8, 0, Math.PI, 0);
    shape("#f4efe2");
  }
  pen.beginPath();
  pen.moveTo(-16, -4);
  pen.quadraticCurveTo(0, 18, 16, -4);
  pen.closePath();
  shape("#8a5a36");
  pen.restore();
}

function s12City(t, tint) {                         // the courtyard, the palace's back, in the scene's light
  var city = maengCity();
  if (tint && !city.backDusk) {
    city.backDusk = maengTinted(city.back, MAENG_DUSK[0], MAENG_DUSK[1]);
    city.frontDusk = maengTinted(city.front, MAENG_DUSK[0], MAENG_DUSK[1]);
  }
  pen.drawImage(maengSky(tint ? "dusk" : "day"), 0, 0);
  cumulus(pen, t + 150, tint ? MAENG_CLOUDS.dawn : MAENG_CLOUDS.day);
  pen.drawImage(tint ? city.backDusk : city.back, 0, 0);
  pen.drawImage(tint ? city.frontDusk : city.front, 0, 0);
  maengPalace(t, "back", tint);
  decorate(t, S12_LIFE, "back");
}

function sceneWedding(t) {
  var p = MAENG_PALACE, dais = hoKhamDais(p[1], p[2]);
  if (t < S12_SHOTS[0]) {                            // the wedding, at dusk
    s12City(t, MAENG_DUSK);
    person(p[0] - 170, dais, maengPerson("noble", MAENG_KING, {id: "king", floor: "cross", face: 1, feel: "happy", at: [p[0], dais - 120]}));
    person(p[0] - 30, dais, maengPerson("noble", MAENG_GROOM, {id: "groom", floor: "cross", face: 1, feel: "happy", at: [p[0] + 90, dais - 120]}));
    person(p[0] + 90, dais, maengPerson("lady", MAENG_SIMA, {id: "sima", floor: "side", face: -1, feel: "happy", at: [p[0] - 30, dais - 120]}));
    maengPalace(t, "front", MAENG_DUSK, 1);
    [["salo", "fellow", 260], ["sueng", "farmer", 400], ["pichum", "elder", 540]].forEach(function (player, n) {
      musician(player[2], 935, player[0], cast(player[1], {size: 0.72, face: 1, id: "player" + n}), n * 0.3);
    });
    food("khantoke", 820, 975, {size: 0.9});        // the guests' khantoke, and two at it
    person(730, 960, cast("buakham", {floor: "side", size: 0.72, face: 1, smile: 1, id: "guest0"}));
    person(915, 960, cast("inta", {floor: "cross", size: 0.74, face: -1, smile: 1, id: "guest1"}));
  } else if (t < S12_SHOTS[1]) {                     // by day, at the palace's stair: rice for the poor
    s12City(t, null);
    maengPalace(t, "front");
    var giver = MAENG_STAIR + 40, gave = 0;
    kongKhao(pen, giver + 70, 902, 0.9);            // the rice basket beside him
    S12_POOR.forEach(function (one, n) {
      var arrive = S12_SHOTS[0] + 0.6 + n * 0.5, walk = stroll(t, 260 - n * 120, giver + one[2], arrive, maengPerson(one[0], one[1], {id: "poor" + n, feel: "concerned"}));
      var filled = t > S12_SHOTS[0] + 8.4 + n * 1.6;
      var look = Object.assign(walk.look, {face: 1, feel: filled ? "happy" : "concerned", reachA: [walk.x + 70, 880 - 80 * one[1].size]});
      if (filled) { gave = n + 1; }
      var joints = person(walk.x, 905, look);
      s12Bowl(joints, filled);
    });
    var serving = S12_POOR.some(function (one, n) { var at = S12_SHOTS[0] + 8.4 + n * 1.6; return t > at - 1.2 && t < at + 0.2; });
    person(giver, 905, maengPerson("noble", MAENG_GROOM, {id: "groom", face: -1, feel: "happy",
                                                         reachA: serving ? [giver - 90, 820] : undefined}));
  } else {                                           // later: the Righteous King on the dais, and the people's wai
    s12City(t, null);
    person(p[0], dais, maengPerson("noble", MAENG_KING_THUKKHATA, {id: "king", floor: "cross", face: -1, feel: "happy", at: [700, 900]}));
    maengPalace(t, "front");
    S12_PEOPLE.forEach(function (one, n) {
      person(one[0], one[1], cast(one[2], {floor: "side", wai: true, size: 0.72, face: 1, smile: 0.8, id: "people" + n}));
    });
  }
  maengDark(t, S12_SHOTS[0] - 1.2, S12_SHOTS[0]);
  maengDark(t, S12_SHOTS[1] - 1.2, S12_SHOTS[1]);
  maengDark(t, S12_LONG - 1.6, S12_LONG + 10);
  maengDark(t, -10, 0);
}
