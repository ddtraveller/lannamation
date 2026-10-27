// s12_wedding.js - scene 12 of the film of the creature with four ears and five eyes: the wedding, and the Righteous
// King (35 s). Dusk at the palace, its lanterns lit: Thukkhata, grown and in a noble's dress, sits on the dais beside
// Princess Sima, the king by them; the band of the north plays in the courtyard, and two guests sit at a khantoke.
// Then by day: he is rich now and has stayed as he was, and at the palace's stair he fills the bowls of the poor
// from a rice basket, as his mother once carried a bowl to the city. Last: later he is king, on the dais, and the
// people sit before him with their hands raised in a wai: the Righteous King, Phaya Thammikarat.
var S12_LONG = 45.46;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets of the wedding's dusk, low under the band; the cicadas by day.
var S12_SOUND = {calls: [[0, "crickets", 0.22, 14.26], [14.26, "cicadas", 0.5, 31.2]]};
var S12_LINES = [[1.5, 7.63, "M069"], [15.66, 23.71, "M070"], [25.32, 30.87, "M071"], [32.69, 41.96, "M072"]];
var S12_SHOTS = [14.26, 31.89];                       // the wedding at dusk; the rice by day; the Righteous King
// The poor who come to him: in the faded cloth of his own family, each with a bowl.
var S12_POOR = [["fellow", MAENG_FATHER, -170], ["weaver", MAENG_MOTHER, -330], ["boy", MAENG_BOY, -470]];
var S12_PEOPLE = [[420, 940, "inta"], [560, 960, "buakham"], [700, 940, "khammun"], [830, 965, "sinuan"], [960, 945, "bunma"]];
var S12_LIFE = [
  {name: "flock at dusk", kind: "flock", z: "sky", course: [[0.5, 2150, 200], [13.66, -150, 150]]},
  {name: "blue magpie", kind: "magpie", z: "set", look: {size: 0.6},     // on the palace's finial: of the set
   course: [[S12_SHOTS[0], MAENG_FINIAL[0], MAENG_FINIAL[1] + 4], [S12_LONG, MAENG_FINIAL[0], MAENG_FINIAL[1] + 4]]}
];

// The wedding's dusk (owner, 2026-10-26: "yes", to a painted sunset, lanterns and fireflies): the sun going down
// behind the far hills left of the palace, from S12_SUN[1] to S12_SUN[2]; strings of lit khom across the court, each
// [from, to, sag] (pixels of the sheet), from the trees to the palace's eaves, a lantern every S12_KHOM_GAP along it.
var S12_SUN = [880, 330, 405];
var S12_STRINGS = [[[120, 560], [976, 430], 70], [[1664, 430], [1900, 520], 40]];
var S12_KHOM_GAP = 105;
// The lanterns on the strings: [x, y where each is tied, its colour], made once. e.g. s12Khoms().length
var S12_KHOMS = null;
function s12Khoms() {
  if (S12_KHOMS) { return S12_KHOMS; }
  S12_KHOMS = [];
  S12_STRINGS.forEach(function (s, k) {
    var long = Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]), count = Math.floor(long / S12_KHOM_GAP);
    for (var n = 1; n < count; n++) {
      var u = n / count;
      S12_KHOMS.push([mix(s[0][0], s[1][0], u), mix(s[0][1], s[1][1], u) + s[2] * 4 * u * (1 - u),
                      [KHOM_RED, KHOM_GREEN, KHOM_BLUE][(n + k) % 3]]);
    }
  });
  return S12_KHOMS;
}
// The strings and their lanterns at second t, lit "lit" (0 to 1). Gives back nothing: it draws with pen.
function s12Strings(t, lit) {
  pen.strokeStyle = "#4a3426";
  pen.lineWidth = 1.6;
  S12_STRINGS.forEach(function (s) {
    pen.beginPath();
    pen.moveTo(s[0][0], s[0][1]);
    pen.quadraticCurveTo((s[0][0] + s[1][0]) / 2, (s[0][1] + s[1][1]) / 2 + s[2] * 2, s[1][0], s[1][1]);
    pen.stroke();
  });
  s12Khoms().forEach(function (k, n) { khom(k[0], k[1], {size: 0.13, colour: k[2], lit: lit, late: n * 0.37}); });
}
// The lanterns' light, laid over the court after its people: each string lantern's and the palace's two. lit: 0 to 1.
function s12Glow(t, lit) {
  s12Khoms().forEach(function (k, n) { sceneryLampLight(t, k[0], k[1] + 40, 960, {reach: 170, strength: 0.7 * lit, seed: n}); });
  MAENG_PALACE_THINGS.forEach(function (k, n) { sceneryLampLight(t, k.x, k.base + 70, 880, {reach: 240, strength: lit, seed: 9 + n}); });
}

// joints: what person() gave back for the one who holds it; full: true heaps rice in it. Gives back nothing: it
// draws with pen, in the film's own pixels. e.g. s12Bowl(person(x, 905, look), true);
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

// t: seconds; tint: MAENG_DUSK for dusk, or null for day. On the first call with a tint it adds backDusk and frontDusk
// to MAENG_CITY. Gives back nothing: it draws with pen (the palace's front and the scene's life are left to the
// caller's s12Set()). e.g. s12City(t, MAENG_DUSK);
function s12City(t, tint) {                         // the courtyard, the palace's back, in the scene's light
  var city = maengCity();
  if (tint && !city.backDusk) {
    city.backDusk = maengTinted(city.back, MAENG_DUSK[0], MAENG_DUSK[1]);
    city.frontDusk = maengTinted(city.front, MAENG_DUSK[0], MAENG_DUSK[1]);
  }
  if (tint) {                                        // the wedding: the sunset deepening, the sun going down behind the hills
    var deepen = between(t, 1.5, S12_SHOTS[0] - 1);
    pen.drawImage(maengSky("sunset"), 0, 0);
    pen.globalAlpha = 0.5 * deepen; pen.drawImage(maengSky("night"), 0, 0); pen.globalAlpha = 1;
    maengClouds(t + 150, "dusk");
    scenerySun(t, S12_SUN[0], mix(S12_SUN[1], S12_SUN[2], deepen), 32, {glow: 10, colour: "255, 180, 100", disc: ["#fff2d0", "#ffcf80", "#ffaa5a"]});
  } else {
    pen.drawImage(maengSky("day"), 0, 0);
    maengClouds(t + 150, "day");
  }
  pen.drawImage(tint ? city.backDusk : city.back, 0, 0);
  pen.drawImage(tint ? city.frontDusk : city.front, 0, 0);
  maengPalace(t, "back", tint);
}

// The sprites of the palace for drawByZ(), all in "set": the scene's life (the magpie on the finial, the flock in
// "sky"), whoever sits on the dais (dais: [[name, x, look], ...], each at the dais's height), and the palace's front
// just in front of the dais; t: seconds; tint and lamps as maengPalace() takes them (left out by day).
// e.g. drawByZ(s12Set(t, []));
function s12Set(t, dais, tint, lamps) {
  var top = hoKhamDais(MAENG_PALACE[1], MAENG_PALACE[2]);
  return lifeSprites(t, S12_LIFE).concat(dais.map(function (one) {
    return {name: one[0], kind: "person", z: "set", x: one[1], y: top, draw: function () { person(one[1], top, one[2]); }};
  }), [{name: "palace, front", kind: "palace", z: "set", y: top + 1, draw: function () { maengPalace(t, "front", tint, lamps); }}]);
}

// Scene 12, the entry the film calls (SCENES): t, its own second, 0 to S12_LONG (35 s), in three shots cut through
// black at S12_SHOTS: the wedding at dusk to 12.6 s, the rice for the poor (S12_POOR) to 25 s, the Righteous King and
// the people's wai (S12_PEOPLE) after. Gives back nothing: it draws the whole sheet with pen. From sets.js: maengCity(),
// maengPalace(), MAENG_PALACE, MAENG_STAIR, MAENG_DUSK, maengDark(), maengPerson() with MAENG_KING, MAENG_GROOM,
// MAENG_SIMA, MAENG_KING_THUKKHATA and the family's looks. Its life is S12_LIFE; its words S12_LINES (M069 to M072),
// written under it by the page.
// Its z plan (oldcartoon.js, Z): the sky, the city and the palace's back as painted first (s12City); then by drawByZ
// the flock in "sky"; in "set" (s12Set) the magpie on the finial, whoever sits on the dais in the hall, and the
// palace's front before them; and in "people" by their feet: at the wedding the band (935), the khantoke and the two
// guests who sit at it (960), the tray just behind them, so their knees and hands rest over its rim (owner, 2026-10-22:
// "Keep the old"; by its base, 975, it would cover them); by day the rice basket (902), the poor and the groom (905);
// last, the people's wai (940 to 965). e.g. sceneWedding(18);
function sceneWedding(t) {
  var p = MAENG_PALACE, dais = hoKhamDais(p[1], p[2]);
  if (t < S12_SHOTS[0]) {                            // the wedding, at dusk
    var lit = 0.6 + 0.4 * between(t, 1.5, S12_SHOTS[0] - 1);   // the lanterns brighter as the sky darkens
    s12City(t, MAENG_DUSK);
    s12Strings(t, lit);
    var sprites = s12Set(t, [
      ["king", p[0] - 170, maengPerson("noble", MAENG_KING, {id: "king", floor: "cross", face: 1, feel: "happy", at: [p[0], dais - 120]})],
      ["groom", p[0] - 30, maengPerson("noble", MAENG_GROOM, {id: "groom", floor: "cross", face: 1, feel: "happy", at: [p[0] + 90, dais - 120]})],
      ["sima", p[0] + 90, maengPerson("lady", MAENG_SIMA, {id: "sima", floor: "side", face: -1, feel: "happy", at: [p[0] - 30, dais - 120]})]
    ], MAENG_DUSK, 1);
    [["salo", "fellow", 260], ["sueng", "farmer", 400], ["pichum", "elder", 540]].forEach(function (player, n) {
      sprites.push({name: "player" + n, kind: "person", x: player[2], y: 935, draw: function () {
        musician(player[2], 935, player[0], cast(player[1], {size: 0.72, face: 1, id: "player" + n}), n * 0.3);
      }});
    });
    drawByZ(sprites.concat([                        // the guests' khantoke, and two at it
      {name: "khantoke", kind: "khantoke", x: 820, y: 959, draw: function () { food("khantoke", 820, 975, {size: 0.9}); }},   // behind the guests at it
      {name: "guest0", kind: "person", x: 730, y: 960, draw: function () {
        person(730, 960, cast("buakham", {floor: "side", size: 0.72, face: 1, smile: 1, id: "guest0"}));
      }},
      {name: "guest1", kind: "person", x: 915, y: 960, draw: function () {
        person(915, 960, cast("inta", {floor: "cross", size: 0.74, face: -1, smile: 1, id: "guest1"}));
      }}
    ]));
    s12Glow(t, lit);                                // their light on the band, the guests and the court
    // and egrets going home to their roost over the court as the light goes (the fireflies that were here come only
    // with the rains: the beauty pass, NATURE.md)
    for (var k = 0; k < 6; k++) {
      var ex = WIDE + 140 + k * 80 - 150 * (t - 7 - k * 0.4);
      if (ex > -150 && ex < WIDE + 150) { egret(ex, 230 + 22 * (k % 3) - 8 * k + 6 * Math.sin(t * 1.2 + k), t, {fly: true, face: -1, size: 0.26, seed: k}); }
    }
  } else if (t < S12_SHOTS[1]) {                     // by day, at the palace's stair: rice for the poor
    s12City(t, null);
    var giver = MAENG_STAIR + 40, gave = 0;
    var day = s12Set(t, []).concat([          // the rice basket beside him
      {name: "basket", kind: "kongKhao", x: giver + 70, y: 902, draw: function () { kongKhao(pen, giver + 70, 902, 0.9); }}
    ]);
    S12_POOR.forEach(function (one, n) {
      var arrive = S12_SHOTS[0] + 0.6 + n * 0.5, walk = stroll(t, 260 - n * 120, giver + one[2], arrive, maengPerson(one[0], one[1], {id: "poor" + n, feel: "concerned"}));
      var filled = t > S12_SHOTS[0] + 8.4 + n * 1.6;
      var look = Object.assign(walk.look, {face: 1, feel: filled ? "happy" : "concerned", reachA: [walk.x + 70, 880 - 80 * one[1].size]});
      if (filled) { gave = n + 1; }
      day.push({name: "poor" + n, kind: "person", x: walk.x, y: 905, draw: function () { s12Bowl(person(walk.x, 905, look), filled); }});
    });
    var serving = S12_POOR.some(function (one, n) { var at = S12_SHOTS[0] + 8.4 + n * 1.6; return t > at - 1.2 && t < at + 0.2; });
    day.push({name: "groom", kind: "person", x: giver, y: 905, draw: function () {
      person(giver, 905, maengPerson("noble", MAENG_GROOM, {id: "groom", face: -1, feel: "happy",
                                                           reachA: serving ? [giver - 90, 820] : undefined}));
    }});
    drawByZ(day);
  } else {                                           // later: the Righteous King on the dais, and the people's wai
    s12City(t, null);
    drawByZ(s12Set(t, [["king", p[0], maengPerson("noble", MAENG_KING_THUKKHATA, {id: "king", floor: "cross", face: -1, feel: "happy", at: [700, 900]})]])
      .concat(S12_PEOPLE.map(function (one, n) {
        return {name: "people" + n, kind: "person", x: one[0], y: one[1], draw: function () {
          person(one[0], one[1], cast(one[2], {floor: "side", wai: true, size: 0.72, face: 1, smile: 0.8, id: "people" + n}));
        }};
      })));
  }
  maengAir(t, "wedding", "palace");                // the wedding's air: the golden shower's petals, the light (sets.js)
  maengDark(t, S12_SHOTS[0] - 1.2, S12_SHOTS[0]);
  maengDark(t, S12_SHOTS[1] - 1.2, S12_SHOTS[1]);
  maengDark(t, S12_LONG - 1.6, S12_LONG + 10);
  maengDark(t, -10, 0);
}
