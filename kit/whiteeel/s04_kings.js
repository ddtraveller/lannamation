// s04_kings.js - scene 4 of the film of the White Eel: forty-five kings (35 s). Three shots, through black: a lane of
// Yonok by day, busy, people coming and going and petals on the air (the city grown rich); the court, the hall's dais,
// where king after king sits, each a moment, the light of the seasons turning over them (forty-five reigns, a few of
// them seen); and last, King Mahachaichana, seventy, white-haired, on the same dais in the late gold light, his
// courtiers before him. The city's places are the Chang Ngu film's (changngu/sets.js: cngCourt, cngPalace; the lane is sets.js welLane()).
var W04_LONG = 38.95;
var W04_SOUND = {calls: [[0.5, "hens", 0.16], [3.1, "dog", 0.1], [28.24, "dove", 0.14]]};
var W04_LINES = [[1.0, 5.43, "W013"], [7.59, 17.22, "W014"], [21.68, 30.22, "W015"]];
var W04_CUTS = [6.69, 20.28];

// The kings who sit one after another (a few of the forty-five): each a look over the kit's noble, the brocade and the
// head-cloth told apart, the age going up and down as one reign follows another. Kind "noble".
var W04_KINGS = [
  {sarong: ["#24335e", BROCADE], age: 0.1},
  {sarong: ["#5a2a3a", BROCADE], age: 0.4, beard: "#2a2220"},
  {sarong: ["#2f5a4a", BROCADE], age: 0.2},
  {sarong: ["#6a4a1a", BROCADE], age: 0.6, hair: "#a9a39a", beard: "#a9a39a"},
  {sarong: ["#3a2a5a", BROCADE], age: 0.15},
  {sarong: ["#8a2a3a", BROCADE], age: 0.5, beard: "#2a2220"},
  {sarong: ["#24335e", BROCADE], age: 0.3}
];
var W04_SEASONS = ["rgba(255, 200, 220, 0.12)", "rgba(80, 110, 150, 0.2)", "rgba(255, 190, 90, 0.16)", "rgba(200, 230, 255, 0.12)"];

// The lane by day: people coming and going both ways, petals on the air.
function w04Lane(t) {
  pen.drawImage(welSky("day"), 0, 0);
  welClouds(t + 20, "day");
  welFlocks(t, [[-200, 180, 55]]);
  pen.drawImage(welLane("day"), 0, 0);
  var sprites = [], walkers = [[8, {}, 1], ["villager", {turban: "#2a6a5a"}, -1], [12, {}, 1], ["farmer", {}, -1],
                                ["boy", {size: 0.5}, 1], ["child:plait", {size: 0.46}, -1], ["oldfarmer", {}, 1], ["woman:lue", {}, -1]];
  walkers.forEach(function (w, k) {
    var speed = 70 + 14 * (k % 3), span = WIDE + 400, along = (k * 290 + speed * t) % span;   // round and round, so the lane is never empty
    var x = w[2] > 0 ? along - 200 : WIDE + 200 - along, y = CNG_LANE_Y - 20 + (k % 3) * 24;
    sprites.push({name: "walker " + k, kind: "person", x: x, y: y, draw: function () {
      person(x, y, welPerson(w[0], Object.assign({size: w[0] === "boy" ? 0.5 : 0.72}, w[1]), {id: "lane" + k, face: w[2], step: t / BEAT * 0.9 + k}));
    }});
  });
  drawByZ(sprites);
  sceneryAir(t, {butterfly: null, light: [0.4, 9]});
}

// The court: the sky, the courtyard, the hall, who on the dais (a look, seated), two courtiers bowing on the floor
// before it. tint: the light over it all ("rgba(...)"), or none.
function w04Court(t, who, tint) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]), floor = hoKhamFloor(p[1], p[2]);
  pen.drawImage(welSky("day"), 0, 0);
  welClouds(t + 50, "day");
  welFlocks(t, [[2200, 160, -45]]);
  pen.drawImage(cngCourt(), 0, 0);
  cngBeds(t, "court", "back");
  drawByZ([
    {name: "hall, back", kind: "palace", z: "set", y: dais - 1, draw: function () { cngPalace("back"); }},
    {name: "on the dais", kind: "person", z: "set", x: p[0], y: dais, draw: who},
    {name: "hall, front", kind: "palace", z: "set", y: dais + 1, draw: function () { cngPalace("front"); }},
    {name: "courtier, left", kind: "person", x: p[0] - 230, y: floor + 40, draw: function () {
      person(p[0] - 230, floor + 40, welPerson("fellow", {size: 0.62, sabai: ["#9a8a66", "#6a5a44", "check"]}, {floor: "cross", id: "courtier1",
                                                                                                            face: 1, wai: 1, at: [p[0], dais - 80]}));
    }},
    {name: "courtier, right", kind: "person", x: p[0] + 230, y: floor + 40, draw: function () {
      person(p[0] + 230, floor + 40, welPerson("fellow", {size: 0.62, sabai: ["#7a9ab0", "#3a4a6a", "check"]}, {floor: "cross", id: "courtier2",
                                                                                                            face: -1, wai: 1, at: [p[0], dais - 80]}));
    }}
  ]);
  cngBeds(t, "court", "frame");
  if (tint) { pen.fillStyle = tint; pen.fillRect(0, 0, WIDE, 1080); }
}

// King after king on the dais, each for a moment, one fading into the next, the season's light turning.
function w04Reigns(t) {
  var u = t - W04_CUTS[0], each = (W04_CUTS[1] - W04_CUTS[0]) / W04_KINGS.length, k = Math.min(W04_KINGS.length - 1, Math.floor(u / each));
  var into = between(u - k * each, each - 0.6, each), p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]);
  function king(n, alpha) {
    return function () {
      pen.save();
      pen.globalAlpha = alpha;
      person(p[0], dais, welPerson("noble", Object.assign({size: 0.8}, W04_KINGS[n]), {id: "king" + n, floor: "cross", face: -1, at: [p[0] - 600, 900]}));
      pen.restore();
    };
  }
  w04Court(t, k + 1 < W04_KINGS.length && into > 0 ? function () { king(k, 1 - into)(); king(k + 1, into)(); } : king(k, 1), W04_SEASONS[k % W04_SEASONS.length]);
}

// The old king on the dais in the late gold light.
function w04OldKing(t) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]);
  w04Court(t, function () {
    person(p[0], dais, welPerson("noble", Object.assign({size: 0.8}, WEL_OLD_KING), {id: "mahachaichana", floor: "cross", face: -1,
                                                                                     at: [p[0] - 600, 900], blink: Math.sin(t * 1.3) > 0.97 ? 1 : 0}));
  }, "rgba(255, 180, 90, 0.14)");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.5, 15]});
}

// Scene 4, the entry the film calls (SCENES): t, its own second, 0 to W04_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welClouds(), welPerson(), welLane(); from changngu/sets.js: CNG_LANE_Y,
// cngCourt(), cngPalace(), CNG_PALACE, cngBeds(), cngCutsOver(); from chiangsaen.js hoKhamDais(), hoKhamFloor().
// Its words are W04_LINES (W013 to W015).
function welSceneKings(t) {
  if (t < W04_CUTS[0]) { w04Lane(t); }
  else if (t < W04_CUTS[1]) { w04Reigns(t); }
  else { w04OldKing(t); }
  cngCutsOver(t, W04_CUTS);
  welFadeIn(t, 1.5);
}
