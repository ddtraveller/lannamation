// s09_decree.js - scene 9 of the film of the creature with four ears and five eyes: the king's test (55 s).
// The city of Phanthumati: King Phanthumati on the dais of his palace, Princess Sima beside him. Princes come from
// many cities to marry her. A herald strikes the gong, and the king says: whoever builds a golden trough from his
// own house to my daughter's palace shall marry the princess. One after another the princes' troughs come in from
// their houses (off to the left) toward the palace: one runs out halfway, one sags to the ground, one humps up;
// not one of them can do it. She laughs at each. They go.
var S09_LONG = 55;
var S09_LINES = [[1.5, 5.0, "M050"], [5.6, 10.0, "M051"], [10.6, 14.4, "M052"], [14.8, 16.8, "M053"], [17.2, 23.0, "M054"],
                 [23.4, 26.0, "M055"], [32.0, 37.0, "M056"]];
var S09_KING = [[17.2, 23.0], [23.4, 26.0]];        // what the king says himself: his mouth moves
var S09_GONG = [1800, 900];
// Where each prince stands, his row, how far his trough gets, and how it goes wrong; each trough is laid from 27 s,
// one 3 s after another, for 3.5 s.
var S09_BUILDS = [{at: 200, row: 850, built: 0.55, look: {}},
                  {at: 340, row: 875, built: 1, look: {sag: [0.55, 55]}},
                  {at: 480, row: 900, built: 0.8, look: {sag: [0.66, -110]}}];
function s09Fails(n) { return 27 + n * 3 + 3.5; }

function sceneDecree(t) {
  var city = maengCity(), p = MAENG_PALACE;
  pen.drawImage(maengSky("day"), 0, 0);
  cumulus(pen, t + 90, MAENG_CLOUDS.day);
  pen.drawImage(city.back, 0, 0);
  pen.drawImage(city.front, 0, 0);
  hoKham(pen, p[0], p[1], p[2], {part: "back"});
  var dais = hoKhamDais(p[1], p[2]), speaking = S09_KING.some(function (s) { return t >= s[0] && t < s[1]; });
  var laughs = [0, 1, 2].some(function (n) { return t > s09Fails(n) && t < s09Fails(n) + (n === 2 ? 4 : 1.8); });
  person(p[0] - 70, dais, maengPerson("noble", MAENG_KING, {id: "king", floor: "cross", face: -1, at: [p[0] - 700, 860],
                                                            feel: t > s09Fails(0) ? "concerned" : undefined,
                                                            mouth: speaking ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8)), wide: 0.5, round: 0.15} : undefined}));
  person(p[0] + 80, dais, maengPerson("lady", MAENG_SIMA, {id: "sima", floor: "side", face: -1, at: [p[0] - 700, 860],
                                                           feel: laughs ? "laughing" : "happy"}));
  hoKham(pen, p[0], p[1], p[2], {part: "front"});
  // The herald at his gong; he strikes it as the king begins.
  var struck = t - 14.8, swing = struck > -0.5 && struck < 0.4, boss = gongAt(S09_GONG[0], S09_GONG[1], 0.9);
  gong(pen, S09_GONG[0], S09_GONG[1], 0.9, {struck: struck >= 0 ? struck : undefined});
  person(S09_GONG[0] - 110, S09_GONG[1], maengPerson("fellow", MAENG_HERALD, {id: "herald", face: 1,
                                                          reachA: swing ? [boss[0] - 20, boss[1]] : undefined}));
  // The princes: in, then watching their troughs come toward the palace, and away.
  MAENG_PRINCES.forEach(function (own, n) {
    var build = S09_BUILDS[n], fails = s09Fails(n), feel = t > fails ? "sad" : t > fails - 3.5 ? "concerned" : undefined;
    var look = maengPerson("noble", own, {id: "prince" + n, feel: feel, smile: feel ? undefined : 0.5}), walk;
    if (t > fails - 3.5) {                          // his trough, from his house toward the palace; left there when he goes
      var lay = between(t, fails - 3.5, fails) * build.built;
      linKham(pen, [[-40, build.row], [MAENG_STAIR, build.row - 4]], lay, Object.assign({size: 1.2}, build.look));
    }
    if (t < 40) {
      walk = stroll(t, -200 - n * 60, build.at, 10.4 + n * 0.6, look);
      walk.look.face = 1;
    } else {
      walk = stroll(t, build.at, -300, 40 + n * 0.4, look);
    }
    person(walk.x, build.row, walk.look);
  });
  if (t < 1.5 || t > 53) {
    pen.fillStyle = "rgba(0, 0, 0, " + Math.max(1 - t / 1.5, between(t, 53, 55)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
