// sets.js - what the scenes of the film of Hong Hin, the stone swan (หงส์หิน), share: the cast, the places, the titles and
// the narration's subtitles. Each scene is a file of its own (sNN_*.js) with a page of its own (sNN.html) that plays only
// that scene; the film's page loads them all. Every page loads this after the kit's files, words.js, and the sets of the
// Chang Ngu and White Eel films (changngu/sets.js, whiteeel/sets.js), whose places and helpers this film shares: the
// city wall and gate, the palace court, the skies, welPerson(), welFadeIn(). The scenes draw on the film's 1920 sheet
// (style.js) on their own clock, from 0. BEAT is set by each page, before this file.
// The tale is told as Chao Suriyawong's khao so tells it (story.py); its beings and things are the kit's (himmaphan.js
// hongHin and indra, ogre.js's ghouls, giantess and daughters, myth.js hemmarat, honghin.js), the owner's picks.

// ---------- the cast ----------
// The king of Varanasi, Purantapa: young (scene 1, twenty) and grown; his mother, the old queen the ghouls steal (the
// kit's old woman, in a queen's gold); Vimala, his chief queen (a painted princess); the six wives (painted women, each
// her own); their six sons (nobles, each his own cloth); the boy, the prince (a noble boy); the old gardeners.
var HH_KING = {regalia: true, turban: "#b8294a", pins: true, bangles: 5, sarong: ["#8a2a3a", BROCADE], smile: 0.4};
var HH_KING_YOUNG = Object.assign({}, HH_KING, {size: 0.8, eyes: 1.04});
var HH_OLD_QUEEN = {shirt: "#f2e2c4", sin: 2, sabai: ["#c9962a", "#8a2a3a"], earplug: "#d9b24a", bangles: 4, hair: "#ece7dd",
                    age: 1, bend: 0.16, size: 0.72, smile: 0.3};
// The old queen as the ghouls kept her twenty years: thin, bent, in a grey blouse, no gold (scenes 14 to 18).
var HH_GRAN = Object.assign({}, HH_OLD_QUEEN, {shirt: "#8a8478", sabai: false, sin: 1, bend: 0.3, earplug: undefined, bangles: 0, size: 0.68});
var HH_VIMALA = {size: 0.78};                         // castWoman("princess"), her own size in the film
var HH_WIVES = [3, 8, 12, 17, 21, 26];                // the six, each a woman of castMix(): her own face, hair and dress
var HH_SONS = [["#24335e", "#e0b23a"], ["#2f5a4a", "#d0a040"], ["#5a2a4a", "#e0b23a"], ["#3a3a6a", "#c8a050"],
               ["#6a3a24", "#e8c060"], ["#24485a", "#d8b050"]];   // each son's cloth and its gold
// The boy grows up poor, a gardener's grandson (the brothers in brocade and gold): bare, a plain indigo cloth, a white
// head-cloth, no gold, until he is crowned (HH_BOY_CROWNED).
var HH_BOY = {bare: true, regalia: false, turban: "#f2ead6", pins: false, bangles: 0, sarong: "#2f4a6a", patoi: 0.75,
              skin: "#f1d2b4", smile: 0.7, eyes: 1.14};
var HH_BOY_CROWNED = {bare: true, regalia: true, turban: "#b8294a", pins: true, bangles: 4, sarong: ["#8a2a3a", BROCADE],
                      skin: "#f1d2b4", smile: 0.7, eyes: 1.1};

// One of the six sons (k 0 to 5), as welPerson() gives a look: a noble in his own cloth. e.g. person(x, y, hhSon(2, {size: 0.8}));
function hhSon(k, extra) {
  var c = HH_SONS[k % 6];
  return welPerson("noble", {sarong: [c[0], BROCADE], turban: c[0], size: 0.8, eyes: 1 + 0.03 * k, smile: 0.3}, extra);
}

// ---------- the words ----------
// The narration's subtitles, as the White Eel's (welSubtitles), from this film's words (words.js).
function hhSubtitles(t, lines) {
  lines.forEach(function (line) {
    if (t < line[0] || t >= line[1]) { return; }
    var words = HONGHIN_WORDS[line[2]], halves = welHalves(words[1]);
    var big = halves.length < 2 ? words[1] : t < mix(line[0], line[1], halves[0].length / words[1].length) ? halves[0] : halves[1];
    subtitle(big, words[2]);
  });
}

// The titles: the series, Lanna Tales (นิทานล้านนา), and the tale's name, หงส์หิน, in the Lanna script (the Kam Mueang
// alphabet's own reader, KMA.lanna(), with its word list: the series as the first three films spell it), the English
// small beneath. from: the second they begin to show; they go at to. e.g. hhTitle(t, 36, 45);
var HH_SERIES = "ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ";
var HH_STORY = "ᩉᩫ᩠ᨦᩈ᩺ᩉᩥ᩠ᨶ";
function hhTitle(t, from, to) {
  var series = between(t, from, from + 1.2) * (1 - between(t, to - 1, to)), story = between(t, from + 1.6, from + 2.8) * (1 - between(t, to - 1, to));
  if (series <= 0) { return; }
  pen.save();
  pen.textAlign = "center";
  pen.shadowColor = "rgba(255, 196, 90, 0.7)";
  var gold = pen.createLinearGradient(0, 180, 0, 440);
  gold.addColorStop(0, "#fff1c0"); gold.addColorStop(0.5, "#e8b84a"); gold.addColorStop(1, "#b07a22");
  pen.fillStyle = gold;
  pen.globalAlpha = series;
  pen.shadowBlur = 22;
  pen.font = "700 92px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
  pen.fillText(HH_SERIES, WIDE / 2, 250);
  pen.shadowBlur = 8;
  pen.strokeStyle = "rgba(255, 230, 170, 0.8)"; pen.lineWidth = 2;
  var reach = 260 * between(t, from + 0.6, from + 2.2);
  pen.beginPath(); pen.moveTo(WIDE / 2 - reach, 312); pen.quadraticCurveTo(WIDE / 2, 322, WIDE / 2 + reach, 312); pen.stroke();
  if (story > 0) {
    pen.globalAlpha = story;
    pen.shadowBlur = 26;
    pen.font = "700 136px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
    pen.fillText(HH_STORY, WIDE / 2, 450);
    pen.shadowBlur = 0;
    pen.font = "italic 42px " + LETTERS_LATIN + ", 'Times New Roman', serif";
    pen.fillStyle = "#fff6dc";
    pen.fillText("Hong Hin, the Stone Swan", WIDE / 2, 540);
  }
  pen.restore();
}

// ---------- Varanasi by night ----------
// The city from the fields at night (scene 1): the night sky, its stars and the moon, the far hills, the plain, the
// palace's roofs over the wall, the wall and its gate (Chang Ngu's, changngu/sets.js), all darkened under the night,
// lamps on the gate and in the palace. HH_NIGHT_LAMPS: [x, y, the ground under it].
var HH_NIGHT_LAMPS = [[905, 560, 700], [1015, 560, 700], [1310, 460, 560], [1460, 470, 560]];
var HH_MOON = [1560, 170, 44];
function hhCityNight(t) {
  pen.drawImage(welSky("clear"), 0, 0);
  sceneryStars(t, {band: null, horizon: 600, count: 1800, bright: 18, glow: null, seed: 41, alpha: 1});
  sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
  pen.drawImage(cngFields(), 0, 0);
  hoKham(pen, 1390, 620, 0.42, {part: "back", fine: true});
  hoKham(pen, 1390, 620, 0.42, {part: "front", fine: true, pediment: "peacock"});
  cngGateWall(0, t);
  hhNight(0.62, t);
  HH_NIGHT_LAMPS.forEach(function (l, i) { sceneryLampLight(t, l[0], l[1], l[2], {reach: 120, strength: 0.8, seed: i}); });
}

// The forest's edge by the city wall at night (scenes 1): the dark forest on the left, the wall running off to the
// right, the moon. HH_EDGE_WALL: the wall's left end, its foot, its size; the wall's top is HH_EDGE_TOP.
var HH_EDGE_WALL = [980, 760, 1.6];
var HH_EDGE_TOP = HH_EDGE_WALL[1] - 150 * HH_EDGE_WALL[2];
var HH_EDGE = null;
function hhEdge() {
  if (HH_EDGE) { return HH_EDGE; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d");
  cngFar(b, 0, 560);
  csBand(b, 0, 540, WIDE, 540, "#7e9a5c", "#5e7a44");
  forest(b, -60, 1000, 640, {tall: 300, seed: 7, far: 0.3});
  forest(b, -120, 860, 820, {tall: 420, seed: 11});
  HH_EDGE = paper;
  return paper;
}
function hhEdgeNight(t) {
  pen.drawImage(welSky("clear"), 0, 0);
  sceneryStars(t, {band: null, horizon: 600, count: 1800, bright: 18, glow: null, seed: 43, alpha: 1});
  sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
  pen.drawImage(hhEdge(), 0, 0);
  cityWall(pen, HH_EDGE_WALL[0], HH_EDGE_WALL[1], WIDE - HH_EDGE_WALL[0] + 200, HH_EDGE_WALL[2], {gate: false, t: t});
}
// The night laid over all that is drawn (the hills, the trees, the wall), then the stars and the moon again over it,
// clear. e.g. hhNight(0.6, t);
function hhNight(alpha, t) {
  pen.fillStyle = "rgba(10, 16, 46, " + alpha + ")";
  pen.fillRect(-WIDE, -200, 3 * WIDE, 1500);
  hhStarsMoon(t, 0.85);
}
function hhStarsMoon(t, alpha) {
  pen.save();
  pen.beginPath(); pen.rect(-WIDE, -200, 3 * WIDE, 560); pen.clip();   // above the hills only
  sceneryStars(t, {band: null, horizon: 600, count: 1800, bright: 18, glow: null, seed: 41, alpha: alpha});
  pen.restore();
  sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
}

// A ghoul's eyes glinting in the dark, from its joints (person()'s, pixels of the sheet). e.g. hhGlint(j, t, 2);
function hhGlint(j, t, seed) {
  var cr = himmaJoint(j.crown), ch = himmaJoint(j.chin);
  var cx = (cr[0] + ch[0]) / 2, cy = (cr[1] + ch[1]) / 2, h = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]);
  var blink = Math.sin(t * 0.7 + seed * 1.9) > 0.97 ? 0.1 : 1;
  [-0.24, 0.24].forEach(function (dx) {
    var g = pen.createRadialGradient(cx + dx * h, cy - 0.08 * h, 0, cx + dx * h, cy - 0.08 * h, 0.22 * h);
    g.addColorStop(0, "rgba(255, 236, 140, " + (0.9 * blink) + ")"); g.addColorStop(1, "rgba(255, 200, 80, 0)");
    pen.fillStyle = g; pen.beginPath(); pen.arc(cx + dx * h, cy - 0.08 * h, 0.22 * h, 0, 7); pen.fill();
  });
}

// A person lying as they are carried (the old queen, scene 1): the look drawn turned on its side about its middle, at
// (x, y), tall pixels from head to foot. e.g. hhCarried(800, 500, 160, HH_OLD_QUEEN_LOOK, 1);
function hhCarried(x, y, tall, look, face) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(-Math.PI / 2 * face);
  person(0, tall / 2, Object.assign({}, look, {face: face}));
  pen.restore();
}

// ---------- the palace of Varanasi, by day ----------
// The court and the hall (Chang Ngu's: changngu/sets.js cngCourt(), cngPalace(), CNG_PALACE), the scene's people among
// them by drawByZ. onDais: [[x offset from the hall's middle, look], ...] seated on the dais; sprites: drawByZ's, the
// rest of the scene's people. e.g. hhCourt(t, [[-60, kingLook]], []);
function hhCourt(t, onDais, sprites) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]);
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 50, "day");
  pen.drawImage(cngCourt(), 0, 0);
  cngBeds(t, "court", "back");
  var list = [{name: "hall, back", kind: "palace", z: "set", y: dais - 1, draw: function () { cngPalace("back"); }},
              {name: "hall, front", kind: "palace", z: "set", y: dais + 1, draw: function () { cngPalace("front"); }}];
  (onDais || []).forEach(function (d, k) {
    list.push({name: "dais " + k, kind: "person", z: "set", x: p[0] + d[0], y: dais, draw: function () { person(p[0] + d[0], dais, d[1]); }});
  });
  drawByZ(list.concat(sprites || []));
  cngBeds(t, "court", "frame");
}

// A camera: the sheet seen zoom times nearer, about the point (x, y) of the set, which comes to the middle of the
// picture as u goes 0 to 1. Call hhCameraEnd() after. e.g. hhCamera(between(t, 20, 24), 500, 760, 1.6); ...; hhCameraEnd();
function hhCamera(u, x, y, zoom) {
  var z = mix(1, zoom, u), cx = mix(960, x, u), cy = mix(540, y, u);
  if (z >= 1) {                                          // the view stays on the set (past its edge is black)
    cx = Math.max(960 / z, Math.min(WIDE - 960 / z, cx));
    cy = Math.max(540 / z, Math.min(1080 - 540 / z, cy));
  }
  pen.save();
  pen.translate(960, 540); pen.scale(z, z); pen.translate(-cx, -cy);
}
function hhCameraEnd() { pen.restore(); }

// A scene's clock, as it was drawn. Each scene was drawn to its plan's lines (HNN_PLAN); Pan's voice says them at
// HNN_LINES (retimed to her takes). hhClock() turns the film's second into the drawing's: each line's start, and the
// end of its voice (its end less 0.4 s), come at the same moment in both, the time between in step; so what is shown
// keeps with what is said. hhSaid() is the other way (a cut drawn at the plan's second: said when?).
// e.g. var said = t; t = hhClock(t, H02_PLAN, H02_LINES, H02_LONG); ... hhCuts(said, hhSaidAll(H02_CUTS, ...));
function hhClockMarks(lines, long, hold) {
  var marks = [0];
  lines.forEach(function (l) { marks.push(l[0], l[1] - hold); });
  marks.push(long);
  return marks;
}
function hhWarp(t, from, to) {
  for (var k = 1; k < from.length; k++) {
    if (t <= from[k] || k === from.length - 1) {
      var u = from[k] > from[k - 1] ? clamp((t - from[k - 1]) / (from[k] - from[k - 1])) : 1;
      return to[k - 1] + (to[k] - to[k - 1]) * u;
    }
  }
  return t;
}
function hhClock(t, plan, said, long) { return hhWarp(t, hhClockMarks(said, long, 0.4), hhClockMarks(plan, long, 0)); }
function hhSaid(t, plan, said, long) { return hhWarp(t, hhClockMarks(plan, long, 0), hhClockMarks(said, long, 0.4)); }
function hhSaidAll(times, plan, said, long) { return times.map(function (c) { return hhSaid(c, plan, said, long); }); }

// A cut through black at each of cuts (seconds), half a second each side. e.g. hhCuts(t, [14.5, 27]);
function hhCuts(t, cuts) {
  cuts.forEach(function (cut) {
    var d = Math.abs(t - cut);
    if (d < 0.6) { pen.fillStyle = "rgba(0, 0, 0, " + (1 - d / 0.6).toFixed(3) + ")"; pen.fillRect(0, 0, WIDE, 1080); }
  });
}
// A painted wife of the six (k 0 to 5). e.g. person(x, y, hhWife(2, {face: -1, feel: "worry"}));
function hhWife(k, extra) { return welPerson(HH_WIVES[k % 6], {size: 0.72}, Object.assign({id: "wife" + k}, extra || {})); }
// Vimala, the chief queen. e.g. person(x, y, hhVimala({floor: "side"}));
function hhVimala(extra) { return welPerson("woman:princess", HH_VIMALA, Object.assign({id: "vimala"}, extra || {})); }
// An astrologer's board (a slate of black lacquer, its reckoning in chalk), lying before him at (x, y).
function hhBoard(x, y, seed) {
  pen.save();
  pen.translate(x, y);
  pen.fillStyle = "#1e1a18"; pen.strokeStyle = "#8a6a3a"; pen.lineWidth = 3;
  pen.beginPath(); pen.moveTo(-60, 0); pen.lineTo(50, 0); pen.lineTo(64, -22); pen.lineTo(-46, -22); pen.closePath(); pen.fill(); pen.stroke();
  pen.fillStyle = "rgba(240, 236, 220, 0.85)";
  for (var k = 0; k < 14; k++) { pen.fillRect(-44 + (k % 7) * 14 + (dice(seed + k) * 4), -17 + Math.floor(k / 7) * 8, 6, 2); }
  pen.restore();
}

// ---------- the orchard at the city's edge ----------
// Where the old gardeners live and Vimala with them (scenes 5, 8, 9, 20): the far hills, a meadow, their bamboo house
// on posts among fruit trees in flower (mango, banana), beds of vegetables before it, a fence of split bamboo. Painted
// once; a scene lays the hour over it. HH_ORCHARD_HOUSE: [x, base, size]; HH_ORCHARD_GROUND: where people stand.
var HH_ORCHARD = null;
var HH_ORCHARD_HOUSE = [1250, 840, 0.95];
var HH_ORCHARD_GROUND = 930;
function hhOrchard() {
  if (HH_ORCHARD) { return HH_ORCHARD; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d"), k;
  cngFar(b, 0, 600);
  sceneryMeadow(b, 0, WIDE, 590, 1080, {seed: 21, haze: "#b4cfa0", many: 1.2});
  thkTreeOn(b, 260, 760, 0.34, 81, [["mango", 22, 14]]);
  thkTreeOn(b, 1700, 770, 0.3, 83, [["frangipani", 26, 12]]);
  floraTree(b, 760, 800, 0.8, "mango", 3);
  for (k = 0; k < 4; k++) { banana(b, 560 + k * 70, 820 + 6 * (k % 2)); }
  ruenPhuk(b, HH_ORCHARD_HOUSE[0], HH_ORCHARD_HOUSE[1], HH_ORCHARD_HOUSE[2], {});
  for (k = 0; k < 5; k++) {                              // the vegetable beds, rows of green
    b.fillStyle = "#7a5a3a"; b.fillRect(240 + k * 150, 960, 120, 28);
    b.fillStyle = "#5e8a3a";
    for (var p = 0; p < 6; p++) { b.beginPath(); b.ellipse(252 + k * 150 + p * 19, 958, 9, 6, 0, 0, 7); b.fill(); }
  }
  b.strokeStyle = "#c8b080"; b.lineWidth = 4;            // the split-bamboo fence along the front
  for (k = 0; k < 40; k++) { b.beginPath(); b.moveTo(k * 50, 1040); b.lineTo(k * 50 + 4, 990); b.stroke(); }
  b.lineWidth = 3; b.beginPath(); b.moveTo(0, 1008); b.lineTo(WIDE, 1004); b.stroke();
  HH_ORCHARD = paper;
  return paper;
}
// The orchard at an hour: "day", "dusk" (a warm low sun) or "night" (the moon, darkened). e.g. hhOrchardAt(t, "dusk");
function hhOrchardAt(t, hour) {
  pen.drawImage(welSky(hour === "night" ? "clear" : hour === "dusk" ? "sunset" : "day"), 0, 0);
  if (hour === "day") { welClouds(t, "day", 1); }
  if (hour === "dusk") { scenerySun(t, 420, 470, 36, {glow: 10, colour: "255, 196, 130"}); }
  pen.drawImage(hhOrchard(), 0, 0);
  if (hour === "dusk") { pen.fillStyle = "rgba(160, 80, 60, 0.25)"; pen.fillRect(0, 0, WIDE, 1080); }
  if (hour === "night") { hhNight(0.62, t); }
}
// Something held in the arms at a person's chest (x, y the person's feet; size the look's): drawn by draw(cx, cy).
function hhAtChest(x, y, size, face, draw) { draw(x + 14 * face * size, y - 250 * size); }

// ---------- heaven ----------
// Indra's heaven (Tavatimsa): a bright sky, gold light, the clouds of Thai painting (honghin.js thaiCloud), a palace
// far off on its cloud (vimana). t: seconds; low: the clouds' line (1000 unless told). e.g. hhHeaven(t);
function hhHeaven(t, low) {
  var g = pen.createLinearGradient(0, 0, 0, 1080);
  g.addColorStop(0, "#5a78b8"); g.addColorStop(0.6, "#c8d8f0"); g.addColorStop(1, "#fbe8c8");
  pen.fillStyle = g; pen.fillRect(-WIDE, -400, 3 * WIDE, 2000);
  var glow = pen.createRadialGradient(960, 420, 40, 960, 420, 700);
  glow.addColorStop(0, "rgba(255, 244, 200, 0.6)"); glow.addColorStop(1, "rgba(255, 244, 200, 0)");
  pen.fillStyle = glow; pen.fillRect(-WIDE, -400, 3 * WIDE, 2000);
  vimana(1560, 420, t, {kind: "prasat", size: 0.3});
  vimana(300, 360, t + 4, {kind: "hall", size: 0.22});
  thaiCloud(300, (low || 1000) - 20, 900, t, 3);
  thaiCloud(1500, (low || 1000) + 10, 1000, t, 5);
}
// A tuft of cloud in front of what stands in heaven (x, y its foot), its tops over the feet, so they stand in the cloud
// (the owner, 2026-11-12: "Put their feet behind the tops of a cloud"). Those standing there have ground: false (no
// shadow). wide: the tuft's width (280 unless told). e.g. person(x, y, {..., ground: false}); hhCloudFeet(x, y, t);
function hhCloudFeet(x, y, t, wide, seed) { thaiCloud(x, y + 0.16 * (wide || 280), wide || 280, t, seed || 11); }
// The golden boulder Indra makes the swan from: a rounded stone of gold, flecked, glowing as he speaks over it.
// (x, y): its foot; glow 0 to 1. e.g. hhBoulder(900, 900, between(t, 8, 12));
function hhBoulder(x, y, glow) {
  if (glow > 0) {
    var g = pen.createRadialGradient(x, y - 90, 10, x, y - 90, 320);
    g.addColorStop(0, "rgba(255, 236, 160, " + (0.7 * glow) + ")"); g.addColorStop(1, "rgba(255, 236, 160, 0)");
    pen.fillStyle = g; pen.beginPath(); pen.arc(x, y - 90, 320, 0, 7); pen.fill();
  }
  pen.beginPath();
  pen.moveTo(x - 150, y); pen.bezierCurveTo(x - 170, y - 120, x - 60, y - 190, x + 30, y - 180);
  pen.bezierCurveTo(x + 150, y - 160, x + 170, y - 60, x + 150, y); pen.closePath();
  var gold = pen.createLinearGradient(x - 120, y - 190, x + 120, y);
  gold.addColorStop(0, "#f6dc8a"); gold.addColorStop(0.5, "#d6a84a"); gold.addColorStop(1, "#8a6420");
  pen.fillStyle = gold; pen.fill(); pen.strokeStyle = "#5a3e12"; pen.lineWidth = 2.5; pen.stroke();
  for (var k = 0; k < 60; k++) {
    pen.fillStyle = k % 2 ? "rgba(255, 246, 210, 0.7)" : "rgba(90, 60, 20, 0.4)";
    pen.beginPath(); pen.arc(x - 120 + dice(k + 300) * 250, y - 150 + dice(k + 400) * 140, 1.5 + 2 * dice(k + 500), 0, 7); pen.fill();
  }
}
// Kanchai in a hand: its grip in the wrist person() gave back (j.wristA, or j.wristB with hand "B"), the blade at angle
// (radians, 0 upright, + forward for face 1). The owner, 2026-11-12: "Make sure he is holding the sword" (drawn at the
// hand's goal, it floated where the arm did not reach). e.g. hhSword(person(...), -0.7, 0.42);
function hhSword(j, angle, size, hand) {
  var w = himmaJoint(hand === "B" ? j.wristB : j.wristA), grip = 48 * size;
  kanchai(w[0] - Math.sin(angle) * grip, w[1] + Math.cos(angle) * grip, {size: size, angle: angle});
}
// What draw() gives back (person()'s joints), drawn on a sheet that is thrown away: where a figure's mouth or hands will
// be before it is drawn for the film (the giants at the feast bring their meat to their mouths). e.g.
// var j = hhJointsOf(function () { return ogre(x, y, t, look); });
var HH_SCRAP = null;
function hhJointsOf(draw) {
  if (!HH_SCRAP || HH_SCRAP.width !== pen.canvas.width) {
    HH_SCRAP = document.createElement("canvas"); HH_SCRAP.width = pen.canvas.width; HH_SCRAP.height = pen.canvas.height;
  }
  var scrap = HH_SCRAP.getContext("2d"), keep = pen;
  scrap.setTransform(keep.getTransform());
  pen = scrap;
  try { return draw(); } finally { pen = keep; }
}
// A tree a ghoul throws, torn up by the roots: at (x, y) its middle, turned by turn radians, size 1 about 200 long.
function hhThrownTree(x, y, turn, size) {
  pen.save(); pen.translate(x, y); pen.rotate(turn); pen.scale(size, size);
  pen.strokeStyle = "#5a3a1e"; pen.lineWidth = 4; pen.lineCap = "round";
  [[-80, -6, -104, -22], [-80, 0, -110, 4], [-80, 6, -100, 24]].forEach(function (r) { pen.beginPath(); pen.moveTo(r[0], r[1]); pen.lineTo(r[2], r[3]); pen.stroke(); });
  pen.fillStyle = "#6a4424"; pen.beginPath(); pen.moveTo(-84, -9); pen.lineTo(40, -6); pen.lineTo(40, 6); pen.lineTo(-84, 9); pen.closePath(); pen.fill();
  pen.fillStyle = "#3e6a34"; pen.strokeStyle = "#24401e"; pen.lineWidth = 2;
  [[50, -20, 34], [78, 4, 36], [52, 22, 30], [96, -18, 26], [30, 0, 26]].forEach(function (c) { pen.beginPath(); pen.arc(c[0], c[1], c[2], 0, 7); pen.fill(); pen.stroke(); });
  pen.fillStyle = "rgba(160, 200, 110, 0.5)"; pen.beginPath(); pen.arc(60, -26, 14, 0, 7); pen.arc(88, -6, 12, 0, 7); pen.fill();
  pen.restore();
}
// Tears running down a face, from the joints person() gave back (j.crown, j.chin): a wet line from each eye and a drop
// sliding down it, again and again (t: seconds). The painted women's faces draw no tears of their own (Vimala's happy
// tears, the owner 2026-11-12, were not seen). face: the way the head turns (1 right). e.g. hhTears(vj, -1, t);
function hhTears(j, face, t) {
  var cr = himmaJoint(j.crown), ch = himmaJoint(j.chin), h = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]);
  [[-0.17, 0], [0.14, 0.5]].forEach(function (e) {
    var x = mix(cr[0], ch[0], 0.55) + (e[0] + 0.12) * h * face, y = mix(cr[1], ch[1], 0.58), run = (t * 0.6 + e[1]) % 1;
    pen.strokeStyle = "rgba(170, 215, 245, 0.75)"; pen.lineWidth = Math.max(1, 0.025 * h); pen.lineCap = "round";
    pen.beginPath(); pen.moveTo(x, y); pen.quadraticCurveTo(x + 0.02 * h * face, y + 0.12 * h, x + 0.01 * h * face, y + 0.24 * h); pen.stroke();
    var dy = y + 0.24 * h * run, r = Math.max(1.2, 0.035 * h);
    pen.fillStyle = "rgba(190, 230, 255, 0.95)"; pen.strokeStyle = "rgba(70, 130, 180, 0.8)"; pen.lineWidth = 0.8;
    pen.beginPath(); pen.moveTo(x, dy - 1.6 * r); pen.quadraticCurveTo(x + r, dy, x, dy + r); pen.quadraticCurveTo(x - r, dy, x, dy - 1.6 * r);
    pen.fill(); pen.stroke();
  });
}
// The boy at an age (years), as the film's prince: HH_BOY at the size of his years. e.g. person(x, y, hhBoy(13, {face: 1}));
function hhBoy(years, extra) {
  return welPerson("fellow", Object.assign({}, HH_BOY, {size: 0.3 + 0.028 * years, sabai: false}), Object.assign({id: "boy"}, extra || {}));
}

// ---------- the giant kingdoms ----------
// A giant king's palace (scenes 12, 13): the hall (pieces.js hoKham, fine) in the colours of his kingdom under a sky of
// its own, its court of red earth, far hills. kingdom: "red" (Wassawaro's), "green" (Kumbhanda's, in the forest) or
// "blue" (Anumat's). HH_GIANT_HALL: [x, base, size]. who: [[x offset, look or painter (x, y)], ...] seated on the dais.
var HH_GIANT_HALL = [960, 900, 1.0];
var HH_GIANT_SKY = {red: ["#6a2a3a", "#e8905a", "#f6d0a0"], green: ["#2a5a4a", "#9ac8a0", "#e8f0d0"], blue: ["#2a3a6a", "#8aa0d8", "#e0e4f0"]};
function hhGiantCity(t, kingdom, who, sprites) {
  var c = HH_GIANT_SKY[kingdom], g = pen.createLinearGradient(0, 0, 0, 900);
  g.addColorStop(0, c[0]); g.addColorStop(0.55, c[1]); g.addColorStop(1, c[2]);
  pen.fillStyle = g; pen.fillRect(-WIDE, -400, 3 * WIDE, 2000);
  cngFar(pen, 0, 640, kingdom === "red" ? "dusk" : undefined);
  if (kingdom === "green") { forest(pen, -100, WIDE + 100, 700, {tall: 320, seed: 13, far: 0.4}); }
  csBand(pen, -200, 640, WIDE + 400, 700, kingdom === "blue" ? "#8a8aa0" : "#b8784e", kingdom === "blue" ? "#6a6a84" : "#8a5236");
  var h = HH_GIANT_HALL, dais = hoKhamDais(h[1], h[2]);
  var list = [{name: "hall back", kind: "palace", z: "set", y: dais - 1, draw: function () { hoKham(pen, h[0], h[1], h[2], {part: "back", fine: true}); }},
              {name: "hall front", kind: "palace", z: "set", y: dais + 1, draw: function () { hoKham(pen, h[0], h[1], h[2], {part: "front", fine: true, pediment: "peacock"}); }}];
  (who || []).forEach(function (w, k) {
    list.push({name: "dais " + k, kind: "person", z: "set", x: h[0] + w[0], y: dais, draw: function () {
      if (typeof w[1] === "function") { w[1](h[0] + w[0], dais); } else { person(h[0] + w[0], dais, w[1]); }   // a look, or a painter (x, y)
    }});
  });
  drawByZ(list.concat(sprites || []));
}

// A giant king's daughter (ogre.js ogreDaughter()) with her arms down: her mural's pose let go (Culakantha's is the
// celestial's, an arm raised to the sky; the owner, 2026-11-12: "put their princess's arm down").
// e.g. hhGiantCity(t, "green", [[0, hhDaughter("culakantha", {size: 0.8, floor: "side"})]]);
function hhDaughter(name, more) {
  var look = ogreDaughter(name, more);
  if (look.woman && typeof look.woman === "object") { look.woman = Object.assign({}, look.woman, {pose: undefined, holds: undefined}); }
  return look;
}

// A giant king's daughter drawn at (x, y), facing the way more.face says. ogreDaughter()'s painted women face right
// whatever their face (found 2026-11-12: Mukhawadi turned to her father, away from the boy, though told face -1), so one
// facing left is drawn mirrored about x, the point she looks at mirrored with her. Culakantha with her arms down
// (hhDaughter()). Gives back person()'s joints. e.g. hhPrincessAt(900, dais, "mukhawadi", {floor: "side", face: -1, at: [500, 700]});
function hhPrincessAt(x, y, name, more) {
  var left = more.face === -1, own = Object.assign({}, more, {face: 1});
  if (left && own.at) { own.at = [2 * x - own.at[0], own.at[1]]; }
  var look = name === "culakantha" ? hhDaughter(name, own) : ogreDaughter(name, own);
  if (left) { pen.save(); pen.translate(x, 0); pen.scale(-1, 1); pen.translate(-x, 0); }
  try { return person(x, y, look); } finally { if (left) { pen.restore(); } }
}

// ---------- the ghouls' place ----------
// Thatched huts in the deep forest (scene 14): dark trees close round, shafts of light, the huts, bones, water pots.
// HH_GHOUL_HUTS: [x, base, size]; HH_GHOUL_POTS: [x, y]. broken: 0 to 1, the huts and pots smashed.
var HH_GHOUL_HUTS = [[360, 900, 3.0], [980, 870, 2.4], [1580, 910, 3.2]];
var HH_GHOUL_POTS = [[640, 930], [700, 940], [1250, 925], [1310, 945]];
var HH_GHOUL_FOREST = null;
function hhGhoulForest() {
  if (HH_GHOUL_FOREST) { return HH_GHOUL_FOREST; }
  var paper = document.createElement("canvas");
  paper.width = WIDE; paper.height = 1080;
  var b = paper.getContext("2d");
  b.fillStyle = "#24302a"; b.fillRect(0, 0, WIDE, 1080);
  forest(b, -100, WIDE + 100, 520, {tall: 420, seed: 17, far: 0.6});
  forest(b, -100, WIDE + 100, 760, {tall: 560, seed: 19, far: 0.2});
  csBand(b, 0, 760, WIDE, 320, "#4a4030", "#3a3024");
  HH_GHOUL_FOREST = paper;
  return paper;
}
function hhGhoulPlace(t, broken) {
  pen.drawImage(hhGhoulForest(), 0, 0);
  pen.fillStyle = "rgba(12, 22, 16, 0.45)"; pen.fillRect(0, 0, WIDE, 1080);   // the shade under the canopy
  pen.save(); pen.globalCompositeOperation = "lighter";  // shafts of light through the canopy
  [[420, 0.12], [1180, 0.1], [1620, 0.08]].forEach(function (s) {
    pen.fillStyle = "rgba(255, 240, 190, " + s[1] + ")";
    pen.beginPath(); pen.moveTo(s[0] - 40, 0); pen.lineTo(s[0] + 40, 0); pen.lineTo(s[0] + 160, 1080); pen.lineTo(s[0] + 20, 1080); pen.closePath(); pen.fill();
  });
  pen.restore();
  HH_GHOUL_HUTS.forEach(function (h, k) {
    if (broken > 0.5 && k !== 1) {                       // a smashed hut: its thatch and posts on the ground
      pen.fillStyle = "#8a6a3a"; pen.beginPath(); pen.ellipse(h[0], h[1] - 20, 140 * h[2], 30 * h[2], 0.1, 0, 7); pen.fill();
      pen.strokeStyle = "#4a3418"; pen.lineWidth = 8;
      [[-80, -30, 60, 10], [-20, -60, 90, -10]].forEach(function (p) { pen.beginPath(); pen.moveTo(h[0] + p[0], h[1] + p[1]); pen.lineTo(h[0] + p[2], h[1] + p[3]); pen.stroke(); });
    } else { fieldHut(pen, h[0], h[1], h[2]); }
  });
  HH_GHOUL_POTS.forEach(function (p, k) {
    if (broken > 0.5) {
      pen.fillStyle = "#8a4a2a";
      for (var n = 0; n < 4; n++) { pen.beginPath(); pen.ellipse(p[0] - 30 + n * 20, p[1] + 4, 12, 6, n, 0, 7); pen.fill(); }
    } else {
      pen.beginPath(); pen.ellipse(p[0], p[1] - 26, 26, 30, 0, 0, 7); pen.fillStyle = "#9a5a32"; pen.fill(); pen.strokeStyle = "#4a2410"; pen.lineWidth = 2; pen.stroke();
    }
  });
  pen.fillStyle = "#efe6d2";                             // bones about the huts
  [[520, 960, 0.3], [880, 975, -0.4], [1440, 965, 0.9], [1700, 980, 0.2]].forEach(function (b) {
    pen.save(); pen.translate(b[0], b[1]); pen.rotate(b[2]); pen.beginPath(); pen.rect(-16, -3, 32, 6); pen.arc(-17, -3, 4, 0, 7); pen.arc(-17, 3, 4, 0, 7); pen.arc(17, -3, 4, 0, 7); pen.arc(17, 3, 4, 0, 7); pen.fill(); pen.restore();
  });
}

// ---------- the high pass ----------
// A high mountain pass at dusk (scene 15): a sunset sky, the ranges, mist lying in the valleys below. t: seconds.
function hhPass(t) {
  pen.drawImage(welSky("sunset"), 0, 0);
  scenerySun(t, 1500, 560, 40, {glow: 10, colour: "255, 170, 110"});
  cngFar(pen, 0, 620, "dusk");
  mistSea(pen, t, {level: 700, layers: 1, glow: "#f3b27a"});
  cngFar(pen, 400, 900, "dusk");
  mistSea(pen, t + 7, {level: 950, layers: 1, glow: "#f0a070"});
}
// A point of the scene as person() gives its joints (through the pen's present transform), for the kit's painters that
// take a joint (ogreMeat). e.g. ogreMeat(hhDevice([900, 1020]), 0.2);
function hhDevice(p) {
  var m = pen.getTransform();
  return [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f];
}

// ---------- the fair ----------
// The high pavilion the king builds at the fair (scene 18): a small palace hall raised on four tall teak posts, a stair
// up to it, banners (tung) on poles. Drawn in two parts as hoKham, so who sits in it is inside: part "back" or "front".
// (x, base): the posts' feet; size: 1 is posts 420 high. Gives back the y of its floor. e.g. var f = hhPavilion(...);
function hhPavilion(x, base, size, part) {
  var s = size, top = base - 420 * s, hall = 0.42 * s;
  if (part !== "front") {
    pen.fillStyle = "#6a3a20"; pen.strokeStyle = "#3a1e10"; pen.lineWidth = 2;
    [-150, -60, 60, 150].forEach(function (dx) { pen.beginPath(); pen.rect(x + dx * s - 10 * s, top, 20 * s, 420 * s); pen.fill(); pen.stroke(); });
    pen.strokeStyle = "#6a3a20"; pen.lineWidth = 8 * s;          // the cross braces
    pen.beginPath(); pen.moveTo(x - 150 * s, base - 60 * s); pen.lineTo(x + 150 * s, top + 60 * s); pen.moveTo(x + 150 * s, base - 60 * s); pen.lineTo(x - 150 * s, top + 60 * s); pen.stroke();
    pen.fillStyle = "#8a5a30"; pen.beginPath(); pen.rect(x - 190 * s, top - 10 * s, 380 * s, 22 * s); pen.fill();   // its floor
    pen.strokeStyle = "#8a5a30"; pen.lineWidth = 6 * s;          // the stair
    pen.beginPath(); pen.moveTo(x + 190 * s, top); pen.lineTo(x + 330 * s, base); pen.moveTo(x + 220 * s, top); pen.lineTo(x + 360 * s, base); pen.stroke();
    for (var k = 1; k < 10; k++) { var u = k / 10; pen.beginPath(); pen.moveTo(x + (190 + 140 * u) * s, top + 420 * s * u); pen.lineTo(x + (220 + 140 * u) * s, top + 420 * s * u); pen.stroke(); }
    hoKham(pen, x, top + 150 * hall, hall, {part: "back", fine: true});
  } else {
    hoKham(pen, x, top + 150 * hall, hall, {part: "front", fine: true, pediment: "peacock"});
  }
  return top;
}
