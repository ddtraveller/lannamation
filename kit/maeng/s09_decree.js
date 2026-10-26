// s09_decree.js - scene 9 of the film of the creature with four ears and five eyes: the king's test (55.54 s; 55 s
// until 2026-10-24: 0.54 s inserted at 18.22 s for the narrator's own words, every moment after it moved with it,
// film_relayout.py in the voice project).
// The city of Phanthumati: King Phanthumati on the dais of his palace, Princess Sima beside him. Princes come from
// many cities to marry her. A herald strikes the gong, and the king says: whoever builds a golden trough from his
// own house to my daughter's palace shall marry the princess. One after another the princes' troughs come in from
// their houses (off to the left) toward the palace: one runs out halfway, one sags to the ground, one humps up;
// not one of them can do it. She laughs at each. They go.
var S09_LONG = 68.8;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the cicadas in the palace's trees, low.
var S09_SOUND = {calls: [[0, "cicadas", 0.35, 68.8]]};
var S09_LINES = [[1.5, 5.99, "M050"], [7.78, 17.35, "M051"], [17.56, 23.57, "M052"], [23.79, 27.36, "M053"], [27.63, 35.06, "M054"], [35.32, 40.05, "M055"], [44.12, 51.91, "M056"]];
var S09_KING = [[27.63, 34.72], [35.32, 39.66]];        // what the king says himself: his mouth moves
var S09_GONG = [1800, 900];
// Where each prince stands, his row, how far his trough gets, and how it goes wrong; each trough is laid from 27.54 s,
// one 3 s after another, for 3.5 s.
var S09_BUILDS = [{at: 200, row: 850, built: 0.55, look: {}},
                  {at: 340, row: 875, built: 1, look: {sag: [0.55, 55]}},
                  {at: 480, row: 900, built: 0.8, look: {sag: [0.66, -110]}}];
// n: 0, 1 or 2, which prince (S09_BUILDS); gives back the second his trough is done failing.
// e.g. if (t > s09Fails(0)) { feel = "sad"; }
function s09Fails(n) { return 27.54 + n * 3 + 3.5; }
// The y of prince n's trough at x (pixels of the sheet), from his house (x -40) to the palace's stair, or null where it
// does not reach. e.g. s09TroughLine(1, 500)   // about 873
function s09TroughLine(n, x) {
  var row = S09_BUILDS[n].row;
  return x < -40 || x > MAENG_STAIR ? null : row - 4 * (x + 40) / (MAENG_STAIR + 40);
}

// Its life: a red-billed blue magpie perched on the tip of the palace roof's golden finial, that flies off as the
// herald strikes the gong; a flock over as the princes come.
var S09_LIFE = [
  {name: "blue magpie", kind: "magpie", z: "set", look: {size: 0.6},     // on the palace's finial: of the set
   course: [[0, MAENG_FINIAL[0], MAENG_FINIAL[1] + 4], [20.96, MAENG_FINIAL[0], MAENG_FINIAL[1] + 4], [28.79, 2160, 110]]},
  {name: "flock", kind: "flock", z: "sky", course: [[12.19, -150, 230], [28.25, 2150, 170]]}
];

// Scene 9, the entry the film calls (SCENES): t, its own second, 0 to S09_LONG (55.54 s): the princes come in from
// 10.4 s, the gong at 16.3 s, the king speaks (S09_KING), the troughs are laid from 27.54 s and fail (s09Fails), the
// princes go from 40.54 s; out of black over 1.5 s, into it from 53.54 s. Gives back nothing: it draws the whole sheet with
// pen. From sets.js: maengCity(), maengSky("day"), MAENG_CLOUDS.day, maengPalace(), MAENG_PALACE, MAENG_STAIR,
// MAENG_FINIAL, maengPerson() with MAENG_KING, MAENG_SIMA, MAENG_HERALD and MAENG_PRINCES. Its life is S09_LIFE; its
// words S09_LINES (M050 to M056), written under it by the page.
// Its z plan (oldcartoon.js, Z): the sky and the city as painted first; then by drawByZ the flock in "sky", and in
// "set" by height the magpie on the finial, the palace's back, the king and Sima on its dais and the palace's front, so
// the birds fly behind the palace (owner, 2026-10-22: "In 9 the birds should fly behind the palace"); and in
// "people" by their feet: the herald with his gong, each prince on his row (850, 875, 900), and each prince's trough,
// a long thing, by its line (s09TroughLine): drawn just before whoever stands in front of it where they stand.
// e.g. sceneDecree(20);
function sceneDecree(t) {
  var city = maengCity(), p = MAENG_PALACE;
  pen.drawImage(maengSky("day"), 0, 0);
  maengClouds(t + 90, "day");
  pen.drawImage(city.back, 0, 0);
  pen.drawImage(city.front, 0, 0);
  var dais = hoKhamDais(p[1], p[2]), speaking = S09_KING.some(function (s) { return t >= s[0] && t < s[1]; });
  var laughs = [0, 1, 2].some(function (n) { return t > s09Fails(n) && t < s09Fails(n) + (n === 2 ? 4 : 1.8); });
  // The herald at his gong; he strikes it as the king begins.
  var struck = t - 16.3, swing = struck > -0.5 && struck < 0.4, boss = gongAt(S09_GONG[0], S09_GONG[1], 0.9);
  var sprites = lifeSprites(t, S09_LIFE).concat([   // on the roof, and in the sky
    {name: "palace, back", kind: "palace", z: "set", y: dais - 1, draw: function () { maengPalace(t, "back"); }},
    {name: "king", kind: "person", z: "set", x: p[0] - 70, y: dais, draw: function () {
      person(p[0] - 70, dais, maengPerson("noble", MAENG_KING, {id: "king", floor: "cross", face: -1, at: [p[0] - 700, 860],
                                                                feel: t > s09Fails(0) ? "concerned" : undefined,
                                                                mouth: speaking ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8)), wide: 0.5, round: 0.15} : undefined}));
    }},
    {name: "sima", kind: "person", z: "set", x: p[0] + 80, y: dais, draw: function () {
      person(p[0] + 80, dais, maengPerson("lady", MAENG_SIMA, {id: "sima", floor: "side", face: -1, at: [p[0] - 700, 860],
                                                               feel: laughs ? "laughing" : "happy"}));
    }},
    {name: "palace, front", kind: "palace", z: "set", y: dais + 1, draw: function () { maengPalace(t, "front"); }},
    {name: "herald", kind: "person", x: S09_GONG[0] - 110, y: S09_GONG[1], draw: function () {
      gong(pen, S09_GONG[0], S09_GONG[1], 0.9, {struck: struck >= 0 ? struck : undefined});
      person(S09_GONG[0] - 110, S09_GONG[1], maengPerson("fellow", MAENG_HERALD, {id: "herald", face: 1,
                                                              reachA: swing ? [boss[0] - 20, boss[1]] : undefined}));
    }}
  ]);
  // The princes: in, then watching their troughs come toward the palace, and away.
  MAENG_PRINCES.forEach(function (own, n) {
    var build = S09_BUILDS[n], fails = s09Fails(n), feel = t > fails ? "sad" : t > fails - 3.5 ? "concerned" : undefined;
    var look = maengPerson("noble", own, {id: "prince" + n, feel: feel, smile: feel ? undefined : 0.5}), walk;
    if (t > fails - 3.5) {                          // his trough, from his house toward the palace; left there when he goes
      var lay = between(t, fails - 3.5, fails) * build.built;
      sprites.push({name: "trough" + n, kind: "trough", line: function (x) { return s09TroughLine(n, x); }, draw: function () {
        linKham(pen, [[-40, build.row], [MAENG_STAIR, build.row - 4]], lay, Object.assign({size: 1.2}, build.look));
      }});
    }
    if (t < 53.8) {
      walk = stroll(t, -200 - n * 60, build.at, 14.01 + n * 0.6, look);
      walk.look.face = 1;
    } else {
      walk = stroll(t, build.at, -300, 53.8 + n * 0.4, look);
    }
    sprites.push({name: "prince" + n, kind: "person", x: walk.x, y: build.row, draw: function () { person(walk.x, build.row, walk.look); }});
  });
  drawByZ(sprites);
  maengAir(t, "decree", "palace");                 // the city's air, blossom hanging into the corner (sets.js)
  if (t < 1.5 || t > 66.8) {
    pen.fillStyle = "rgba(0, 0, 0, " + Math.max(1 - t / 1.5, between(t, 66.8, 68.8)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
