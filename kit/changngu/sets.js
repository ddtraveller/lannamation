// sets.js - what the scenes of the film of Chang Ngu share: the beat, the skies, the cast's looks, the places and the
// narration's subtitles. Each scene is a file of its own (sNN_*.js) with a page of its own (sNN.html) that plays only
// that scene, and the film's page (film.html) loads them all; every page loads this after the kit's files (with
// ../chiangsaen.js) and words.js, and before its scenes. The scenes draw on the film's 1920 sheet (style.js) on their
// own clock, from 0. The places follow what is known of them (owner, 2026-10-23: "try to be accurate"): Chiang Saen's
// wall, the Mae Khong's sandbars and birds, the karst of the north (chiangsaen.js says each source).
// BEAT (the film's half-second beat, which the kit reads) is set by each page, before this file: two films'
// sets.js both defining it would be one name in two script files (checks/kit_check.py).

// ---------- the skies ----------
// A sky, painted once: "night" with its stars, "dawn", "day", "dusk", and "dream" (pale lilac and gold, for the queen's
// dream). The clouds are not on it: a scene drifts them over it (cumulus.js, CNG_CLOUDS).
var CNG_SKY = {};

// kind: one of the five. Gives back the sky's canvas (WIDE by 1080 pixels of the sheet), painted on the first call and
// kept in CNG_SKY after. e.g. pen.drawImage(cngSky("dawn"), 0, 0);
function cngSky(kind) {
  if (CNG_SKY[kind]) { return CNG_SKY[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var brush = paper.getContext("2d"), n, sky = brush.createLinearGradient(0, 0, 0, 1080);
  var stops = {night: [[0, "#070b24"], [0.6, "#1b2350"], [1, "#40336b"]],
               dawn: [[0, "#2c3466"], [0.45, "#7a6a9a"], [0.75, "#e8a882"], [1, "#f6d9a8"]],
               day: [[0, "#8ccfc6"], [0.6, "#f4ecd2"], [1, "#f1d3bd"]],
               dusk: [[0, "#e8682e"], [0.5, "#f2a84a"], [1, "#8fbf9e"]],
               dream: [[0, "#c9b4dc"], [0.6, "#f2e2ee"], [1, "#f6e2b8"]]}[kind];
  stops.forEach(function (s) { sky.addColorStop(s[0], s[1]); });
  brush.fillStyle = sky;
  brush.fillRect(0, 0, WIDE, 1080);
  if (kind === "night") {
    for (n = 0; n < 90; n++) {
      brush.fillStyle = "rgba(255, 250, 220, " + (0.4 + 0.6 * dice(n + 70)) + ")";
      brush.beginPath();
      brush.arc(dice(n) * WIDE, dice(n + 90) * 620, 1.5 + dice(n + 20) * 1.5, 0, 7);
      brush.fill();
    }
  }
  CNG_SKY[kind] = paper;
  return paper;
}

// The clouds of each sky, for cumulus().
var CNG_CLOUDS = {dawn: {count: 6, lit: "#f2c3a6", shade: "#7a6a96", below: false},
                  day: {count: 6, lit: "#fff8ec", shade: "#c9c4d4", below: false},
                  dusk: {count: 5, lit: "#f8c890", shade: "#b0607a", below: false},
                  night: {count: 4, lit: "#59608e", shade: "#2a2f55", below: false}};

// ---------- the cast ----------
// The looks of the tale's people over the kit's cast (cast()), the film's colours. The Khom are told from the Tai by
// dress only (the kit's rule for khomsoldier: "the people of the tale's enemy are real people's ancestors").
var CNG_KING = {regalia: true, turban: "#b8294a", pins: true, bangles: 5, sarong: ["#8a2a3a", BROCADE], size: 0.8,
                age: 0.1, smile: 0.6};                       // King Phang, eighteen, on Yonok's throne (scene 2)
var CNG_HEADMAN = {turban: "#8a6a58", sabai: ["#9a8a66", "#6a5a44", "check"], sarong: "#4f3e30", size: 0.8, age: 0.25,
                   smile: 0.5};                                // the same man as Si Tuang's headman (from scene 3)
var CNG_QUEEN = {shirt: "#f4efe2", sin: 0, sabai: ["#c9962a", "#8a2a3a"], earplug: "#d9b24a", size: 0.76, smile: 0.6,
                 collar: ["#8a2a3a", "#e0b23a"], bangles: 3};   // Queen Thewi
var CNG_KHOM_KING = {turban: "#1e1e24", cap: "#1e1e24", sabai: ["#8a1e24", "#1e1e24"], sarong: "#26262c", shirt: "#26262c",
                     regalia: true, beard: "#2a2220", smile: 0, age: 0.35, bangles: 3, size: 0.82,
                     holding: null};                           // the Black Khom king: the owner's pick C, 2026-10-23
var CNG_SEER = {shirt: "#f4efe2", sarong: "#efe6d2", sabai: ["#f4efe2", "#d8cfbf"], holding: null, age: 0.8,
                size: 0.78};                                   // the seer (หมอ): the owner's pick A, an old man in white
var CNG_NOVICE = {size: 0.66, smile: 0.4};                    // the novice of Si Tuang, nineteen (kit only: cast "monk")
var CNG_THUKKHITA = {turban: "#2a5a8a", sabai: ["#7aa0c0", "#2a5a8a", "check"], sarong: "#4a3a2a"};   // the elder brother
var CNG_PHROM = {turban: "#b8294a", sabai: ["#e0b23a", "#b8294a", "check"], sarong: "#5a3f32", skin: "#f6dcc0",
                 eyes: 1.06};                                  // Phrom: "fair, as if washed clean", "like a Brahma"
var CNG_KAEO_SUPHA = {skirt: false, sin: 0, sabai: ["#e9c45c", "#2a5a8a"], bun: "ipun", pins: true, flower: "#f2cf5a",
                      bangles: 5, earplug: "#e0b23a", size: 0.62, smile: 0.8};   // Phrom's wife, of Wiang Chai Narai (scene 24)
var CNG_SMITH = {bare: true, turban: "#5a4a3a", sabai: false, sarong: "#3a2e24", size: 0.78, tattoo: true};
// The village children (Phrom's fifty): a few looks, told apart by their cloths.
var CNG_CHILDREN = [
  {kind: "boy", look: {turban: "#b8294a", sarong: "#5a3f32"}}, {kind: "girl", look: {}},
  {kind: "boy", look: {turban: "#2a6a5a", sarong: "#3a3a5a"}}, {kind: "girl", look: {shirt: "#e9c45c"}},
  {kind: "boy", look: {turban: "#c9962a", sarong: "#6a2a2a"}}, {kind: "boy", look: {turban: "#6a4aa0", sarong: "#2a4a3a"}}
];
// Phrom's and Thukkhita's size at an age in years (a child of 7 is 0.4 of the kit's man, 13 is 0.55, 16 is 0.66).
// e.g. var size = cngAgeSize(13);
function cngAgeSize(years) { return years <= 7 ? 0.3 + years * 0.014 : Math.min(0.78, 0.4 + (years - 7) * 0.026); }

// A look of the film's cast: the kit's cast (kind), the film's look (own), the scene's keys (extra). A feeling given
// by the scene takes the place of the cast's own smile and wonder, as maeng/sets.js's maengPerson. Gives back a look
// for person(); changes nothing. e.g. person(800, 900, cngPerson("boy", CNG_PHROM, {size: cngAgeSize(13), id: "phrom"}));
function cngPerson(kind, own, extra) {
  var look = cast(kind, Object.assign({}, own, extra || {}));
  if (extra && extra.feel !== undefined) {
    if (extra.smile === undefined) { delete look.smile; }
    if (extra.wonder === undefined) { delete look.wonder; }
  }
  return look;
}

// The narration's words under the picture: t, the scene's second; lines, its sNN_LINES ([from, to, id]). Writes the
// line being said (CHANGNGU_WORDS[id]: its Kam Mueang, then its English). e.g. cngSubtitles(t, S01_LINES);
function cngSubtitles(t, lines) {
  lines.forEach(function (line) {
    if (t >= line[0] && t < line[1]) { subtitle(CHANGNGU_WORDS[line[2]][1], CHANGNGU_WORDS[line[2]][2]); }
  });
}

// A place's name in gold over the picture as the voice says it, its English under it in italic; dark-edged so it reads
// over a bright sky. a: how much it shows, 0 to 1 (nothing at 0). e.g. cngGoldName("ดอยช้างงู", "Doi Chang Ngu", 560, 220, a);
function cngGoldName(name, english, x, y, a) {
  if (a <= 0) { return; }
  pen.save();
  pen.globalAlpha = a;
  pen.textAlign = "center";
  pen.lineJoin = "round";
  pen.font = "700 80px 'Noto Serif Thai', 'Leelawadee UI', serif";
  pen.strokeStyle = "rgba(90, 52, 14, 0.85)"; pen.lineWidth = 8;
  pen.strokeText(name, x, y);
  pen.shadowColor = "rgba(255, 196, 90, 0.7)"; pen.shadowBlur = 16;
  pen.fillStyle = "#f2d27a";
  pen.fillText(name, x, y);
  pen.shadowBlur = 0;
  pen.font = "italic 38px " + LETTERS_LATIN + ", serif";
  pen.strokeStyle = "rgba(40, 30, 20, 0.7)"; pen.lineWidth = 5;
  pen.strokeText(english, x, y + 56);
  pen.fillStyle = "#fff6dc";
  pen.fillText(english, x, y + 56);
  pen.restore();
}

// A fade through black at a scene's two ends (the kit's scene cuts fade through black: film()'s cutFade does it for
// the film page; a scene's own first seconds out of the dark, as Maeng's first). t, long: the scene's second and length.
// e.g. cngFadeIn(t, 1.5);
function cngFadeIn(t, seconds) {
  if (t < seconds) {
    pen.fillStyle = "rgba(0, 0, 0, " + (1 - t / seconds).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}

// ---------- the Mae Khong, from the west bank ----------
// The river at Chiang Saen as it is in the dry season (chiangsaen.js): the far bank's hills (Laos) in mist, the wide
// brown river, a bar of sand and gravel mid-river under khrai nam scrub, the near bank's sand where the children stand.
// Painted once: "back" (the sky's band of hills to the river's far half) and "near" (the near bank), WIDE by 1080. What
// moves (the water's sparkle, the birds, the ducks, the scrub) a scene draws live: cngRiverLife(t, look).
var CNG_RIVER = null;
var CNG_WATER = 540;                                   // the water's top, the far bank's foot
var CNG_BANK = 790;                                    // the near bank's edge, where the water laps the sand (people
                                                       // on the bank stand above the words under the picture)
var CNG_BAR = [880, 640, 760, 50];                     // the sandbar: x, top, wide, tall

// Gives back {back, near}. e.g. var river = cngRiver(); pen.drawImage(river.back, 0, 0);
function cngRiver() {
  if (CNG_RIVER) { return CNG_RIVER; }
  var back = document.createElement("canvas"), near = document.createElement("canvas");
  back.width = near.width = WIDE;
  back.height = near.height = 1080;
  var b = back.getContext("2d"), n;
  cngSkyline(b, 0, CNG_WATER - 6, 210, "#aebfae", 1);   // Laos's hills across the river, far and pale
  cngSkyline(b, 0, CNG_WATER, 120, "#8aa48c", 2);
  b.fillStyle = "rgba(240, 236, 222, 0.5)";             // the mist lying on the far bank
  b.fillRect(0, CNG_WATER - 40, WIDE, 46);
  csBand(b, 0, CNG_WATER, WIDE, 1080 - CNG_WATER, "#ab926c", "#7a6244");
  b.strokeStyle = "rgba(250, 236, 206, 0.25)";          // the current's long lines
  b.lineWidth = 2;
  for (n = 0; n < 40; n++) {
    var cy = CNG_WATER + 12 + dice(n + 3) * (CNG_BANK - CNG_WATER - 20), cx = dice(n + 9) * WIDE;
    b.beginPath(); b.moveTo(cx, cy); b.lineTo(cx + 60 + 80 * dice(n), cy + 2); b.stroke();
  }
  sandbar(b, CNG_BAR[0], CNG_BAR[1], CNG_BAR[2], CNG_BAR[3], 3);
  var nb = near.getContext("2d");
  nb.fillStyle = "#cdb688";                              // the near bank's sand, and its wet edge
  nb.beginPath(); nb.moveTo(0, 1080); nb.lineTo(0, CNG_BANK + 10);
  nb.quadraticCurveTo(WIDE * 0.4, CNG_BANK - 14, WIDE, CNG_BANK + 4); nb.lineTo(WIDE, 1080); nb.closePath(); nb.fill();
  nb.fillStyle = "#a99064";
  nb.beginPath(); nb.moveTo(0, CNG_BANK + 10); nb.quadraticCurveTo(WIDE * 0.4, CNG_BANK - 14, WIDE, CNG_BANK + 4);
  nb.lineTo(WIDE, CNG_BANK + 14); nb.quadraticCurveTo(WIDE * 0.4, CNG_BANK - 2, 0, CNG_BANK + 22); nb.closePath(); nb.fill();
  for (n = 0; n < 120; n++) {                            // pebbles
    nb.fillStyle = ["#9a8a70", "#b0a088", "#7d7060"][n % 3];
    nb.beginPath(); nb.arc(dice(n + 40) * WIDE, CNG_BANK + 30 + dice(n + 80) * 150, 2 + 2 * dice(n), 0, 7); nb.fill();
  }
  CNG_RIVER = {back: back, near: near};
  return CNG_RIVER;
}

// The river's life at second t, drawn with pen: the water's sparkle, the khrai nam on the bar, the birds on it (they
// rise and fly when look.flushed is 0 to 1: the snakes' coming), the ducks. look: birds (true), flushed (0).
// e.g. cngRiverLife(t, {flushed: between(t, 10, 12)});
function cngRiverLife(t, look) {
  look = look || {};
  waves(pen, 0, CNG_WATER + 6, WIDE, CNG_BANK - CNG_WATER, "rgba(250, 238, 210, 0.22)", t);
  khraiNam(pen, CNG_BAR[0] + CNG_BAR[2] * 0.72, CNG_BAR[1] + 30, 0.7, t, 1);
  khraiNam(pen, CNG_BAR[0] + CNG_BAR[2] * 0.84, CNG_BAR[1] + 34, 0.6, t, 4);
  khraiNam(pen, CNG_BAR[0] + CNG_BAR[2] * 0.12, CNG_BAR[1] + 36, 0.5, t, 7);
  if (look.birds === false) { return; }
  var up = look.flushed || 0;
  [[0.3, 1], [0.36, -1], [0.42, 1], [0.48, 1], [0.55, -1]].forEach(function (b, i) {
    var x = CNG_BAR[0] + CNG_BAR[2] * b[0] + 160 * up * (i - 2), y = CNG_BAR[1] + 26 - 260 * up - 20 * Math.sin(t * 3 + i) * up;
    pratincole(pen, x, y, 1.3, {face: up > 0 ? 1 : b[1], fly: up > 0.05, t: t + i, peck: up > 0 ? 0 : Math.max(0, Math.sin(t * 1.3 + i * 2)) * 0.6});
  });
  riverLapwing(pen, CNG_BAR[0] + CNG_BAR[2] * 0.62 + 300 * up, CNG_BAR[1] + 28 - 200 * up, 1.4, {face: -1, fly: up > 0.05, t: t});
  ringedPlover(pen, CNG_BAR[0] + CNG_BAR[2] * 0.2, CNG_BAR[1] + 32 - 220 * up, 1.3, {face: 1, fly: up > 0.05, t: t, peck: up > 0 ? 0 : Math.max(0, Math.sin(t * 2))});
  spotbill(pen, 300 - 30 * t * up, CNG_WATER + 150, 1.3, {face: 1, t: t});
  spotbill(pen, 380 - 30 * t * up, CNG_WATER + 168, 1.2, {face: 1, t: t + 1});
}

// ---------- Yonok on its bank ----------
// The city beside the river, on the west bank (the river to the right of it): its roofs among palms and great trees
// on the higher ground, a gilded chedi among them, and at the far left the north rampart (cityWall, its gate out of
// sight) running down to the water. No wall along the river: Chiang Saen had none there, the Mae Khong was its east
// moat (Penth 1975). Painted once, WIDE by 1080, clear where it shows the river panel's sky; a scene draws it to the
// left of cngRiver()'s panel and pans between them. e.g. pen.drawImage(cngTown(), -WIDE, 0);
var CNG_TOWN = null;
var CNG_TOWN_EDGE = 0.66;                              // where the town's bank meets the river, a share of the panel
function cngTown() {
  if (CNG_TOWN) { return CNG_TOWN; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), n, edge = WIDE * CNG_TOWN_EDGE;
  cngSkyline(b, -WIDE, CNG_WATER - 6, 210, "#aebfae", 1);   // the far hills, the same line as the river panel's
  cngSkyline(b, -WIDE, CNG_WATER, 120, "#8aa48c", 2);
  b.fillStyle = "rgba(240, 236, 222, 0.5)";
  b.fillRect(0, CNG_WATER - 40, WIDE, 46);
  csBand(b, 0, CNG_WATER, WIDE, CNG_BANK - CNG_WATER + 30, "#ab926c", "#8a7050");   // the river, as the river panel's
  b.fillStyle = "#cdb688";                               // the near bank's sand, as the river panel's
  b.fillRect(0, CNG_BANK + 8, WIDE, 1080 - CNG_BANK);
  b.fillStyle = "#93ab5e";                               // the town's higher ground, its bank sloping down to the water
  b.beginPath(); b.moveTo(0, 1080); b.lineTo(0, CNG_WATER - 10);
  b.lineTo(edge - 120, CNG_WATER - 10); b.quadraticCurveTo(edge, CNG_WATER + 40, edge + 60, 1080); b.closePath(); b.fill();
  b.fillStyle = "#b8a070";                               // the bank's earth face at the water
  b.beginPath(); b.moveTo(edge - 120, CNG_WATER - 10); b.quadraticCurveTo(edge, CNG_WATER + 40, edge + 60, 1080);
  b.lineTo(edge + 100, 1080); b.quadraticCurveTo(edge + 30, CNG_WATER + 60, edge - 100, CNG_WATER - 6); b.closePath(); b.fill();
  cityWall(b, 20, CNG_WATER - 10, 640, 0.5, {gate: false, outer: false});   // the north rampart, far, toward the river
  var keep = pen;
  pen = b;
  for (n = 0; n < 5; n++) { tree(b, 100 + n * 240 + 40 * dice(n), CNG_WATER + 70 + 20 * dice(n + 3), 0.5 + 0.15 * dice(n + 5)); }
  bdChedi(b, 760, CNG_WATER + 110, 1.0);                  // the great chedi of the city
  [[150, 900, 0.62], [430, 940, 0.68], [700, 990, 0.6], [980, 920, 0.64]].forEach(function (h) { house(b, h[0], h[1], h[2]); });
  for (n = 0; n < 3; n++) { palm(b, 300 + n * 330 + 30 * dice(n + 11), CNG_WATER + 160, 300 + 60 * dice(n + 2)); }
  pen = keep;
  CNG_TOWN = paper;
  return paper;
}

// A far line of hills across one panel of the sheet, drawn from where that panel lies in the world (worldX: -WIDE for
// the panel left of the river's), so panels side by side share one unbroken skyline. base: its foot; tall: its height.
// e.g. cngSkyline(brush, 0, 630, 200, "#aebfae", 1);
function cngSkyline(brush, worldX, base, tall, colour, seed) {
  brush.fillStyle = colour;
  brush.beginPath();
  brush.moveTo(0, base);
  for (var px = 0; px <= WIDE; px += 12) {
    var u = (px + worldX) / WIDE;
    var h = tall * (0.55 + 0.25 * Math.sin(u * 5.3 + seed) + 0.15 * Math.sin(u * 13.1 + seed * 2.1) + 0.05 * Math.sin(u * 31 + seed));
    brush.lineTo(px, base - h);
  }
  brush.lineTo(WIDE, base);
  brush.closePath();
  brush.fill();
}

// ---------- Yonok's palace ----------
// The ruler's hall in its courtyard (pieces.js hoKham, as the first tale's palace): far hills, the rampart's inner face
// behind it (brick on the town's side, as Hosseus saw Chiang Saen's in 1904), roofs and trees over it, a courtyard
// paved with brick. CNG_PALACE: [x, base, size] of the hall, drawn live in two parts (who sits in it is inside).
// Scenes 2, 6, 20 and 24.
var CNG_PALACE = [1180, 900, 0.82];
var CNG_COURT = null;

// Gives back the courtyard's canvas (WIDE by 1080, clear above the far hills), painted once.
// e.g. pen.drawImage(cngSky("day"), 0, 0); pen.drawImage(cngCourt(), 0, 0);
function cngCourt() {
  if (CNG_COURT) { return CNG_COURT; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), n;
  cngSkyline(b, 0, 640, 180, "#a9bca6", 3);
  csBand(b, 0, 560, WIDE, 150, "#b5664a", "#9a5440");    // the rampart's inner face of brick, behind the town
  b.fillStyle = "#b5664a";
  for (n = 0; n < WIDE; n += 34) { b.fillRect(n, 540, 20, 22); }
  b.strokeStyle = "rgba(70, 30, 20, 0.3)";
  b.lineWidth = 1;
  for (n = 570; n < 710; n += 12) { b.beginPath(); b.moveTo(0, n); b.lineTo(WIDE, n); b.stroke(); }
  var keep = pen;
  pen = b;
  for (n = 0; n < 6; n++) { tree(b, 120 + n * 330 + 60 * dice(n + 20), 720, 0.5 + 0.15 * dice(n + 8)); }
  pen = keep;
  csBand(b, 0, 700, WIDE, 380, "#c98a62", "#a8704e");    // the courtyard's brick paving
  b.strokeStyle = "rgba(110, 60, 40, 0.3)";
  for (n = 0; n < 16; n++) { var py = 712 + n * n * 1.6 + n * 8; b.beginPath(); b.moveTo(0, py); b.lineTo(WIDE, py); b.stroke(); }
  CNG_COURT = paper;
  return paper;
}

// The hall, "back" (before who sits in it) or "front" (after). e.g. cngPalace("back"); person(...); cngPalace("front");
function cngPalace(part, tint) {
  hoKham(pen, CNG_PALACE[0], CNG_PALACE[1], CNG_PALACE[2], {part: part, tint: tint, pediment: "peacock"});
}

// ---------- Yonok's gate, from outside ----------
// The city's west side from the fields: the far hills, the double wall as Chiang Saen's (cityWall: the outer bank,
// the moat, the rampart behind its palisade, the brick parapet), its gate in the middle of the sheet with a bridge over
// the moat, and the road across the paddies to it. CNG_GATE: [x of the gate, the rampart's foot, size]. Scenes 2, 21.
var CNG_GATE = [960, 700, 1.25];
var CNG_ROAD = 960;                                    // the road's y where people walk to the gate, nearest
var CNG_FIELDS = null;

// Gives back the fields' canvas (WIDE by 1080, clear above the far hills), painted once; the wall is drawn live by
// cngGateWall(open) so its gate can open. e.g. pen.drawImage(cngFields(), 0, 0); cngGateWall(0.4);
function cngFields() {
  if (CNG_FIELDS) { return CNG_FIELDS; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), n;
  cngSkyline(b, 0, 560, 200, "#a9bca6", 5);
  csBand(b, 0, 540, WIDE, 540, "#a9c97a", "#86a85a");    // the paddies
  b.strokeStyle = "rgba(90, 120, 50, 0.35)";
  b.lineWidth = 1.5;
  for (n = 0; n < 14; n++) { var by = 800 + n * 22 + n * n * 1.2; b.beginPath(); b.moveTo(0, by); b.lineTo(WIDE, by + 4 * Math.sin(n)); b.stroke(); }
  b.fillStyle = "#c9b285";                               // the road from the near fields to the gate's bridge
  b.beginPath(); b.moveTo(CNG_GATE[0] - 50, 790); b.lineTo(CNG_GATE[0] + 50, 790);
  b.lineTo(CNG_GATE[0] + 260, 1080); b.lineTo(CNG_GATE[0] - 260, 1080); b.closePath(); b.fill();
  b.fillRect(0, CNG_ROAD - 26, WIDE, 52);                // and the road along the wall, across the sheet
  CNG_FIELDS = paper;
  return paper;
}

// The wall with its gate, open 0 (shut) to 1, drawn with pen. e.g. cngGateWall(between(t, 3, 6));
function cngGateWall(open) {
  var s = CNG_GATE[2], wide = WIDE + 200;
  cityWall(pen, -100, CNG_GATE[1], wide, s, {open: open});
}

// ---------- Si Tuang and the valley of the Mae Sai ----------
// Where the Khom sent King Phang: a village of Lua and Tai under the mountains, by the Mae Sai, north-west of Yonok (the
// chronicle: เวียงลวะ ศรีทวง, by the Mae Sai). Behind it Doi Nang Non, the range above Mae Sai whose ridge is a woman
// lying on her back (her head, her breast, her knees), clothed in forest. Two panels side by side, 2 x WIDE by 1080:
// the left the valley, the path along the stream; the right the village, its houses on posts, the headman's house,
// a granary, fences and banana trees. The headman's house is CNG_HOUSE ([x, base, size], in the two panels' pixels).
// Scenes 3, 4, 5, 8, 9, 11, 13, 17, 19, 20.
var CNG_VILLAGE = null;
var CNG_GROUND = 930;                                  // where people stand in the village and on the path
var CNG_HOUSE = [WIDE + 1220, 900, 0.9];               // the headman's house
var CNG_STREAM = [80, 760];                            // the Mae Sai: from x, its far end's y (it runs to the near left)

// Doi Nang Non's ridge at x (pixels of the two panels): her head at the left, the hollow of her neck, her breast, her
// belly, her knees, her feet; gives back the y of the ridge. e.g. var y = cngNangNon(1200);
function cngNangNon(x) {
  var u = x / (2 * WIDE), bump = function (c, w, h) { return h * Math.exp(-Math.pow((u - c) / w, 2)); };
  return 720 - (bump(0.14, 0.05, 210) + bump(0.3, 0.07, 250) + bump(0.48, 0.12, 200) + bump(0.7, 0.07, 290) +
                bump(0.86, 0.08, 170) + 60) - 10 * Math.sin(x * 0.02);
}

// Gives back {back, front}: each 2 x WIDE by 1080, painted once. back: the mountains, the paddies, the stream, the far
// houses; front: the near ground and its fences. e.g. var v = cngVillage(); pen.drawImage(v.back, -pan, 0);
function cngVillage() {
  if (CNG_VILLAGE) { return CNG_VILLAGE; }
  var back = document.createElement("canvas"), front = document.createElement("canvas");
  back.width = front.width = 2 * WIDE;
  back.height = front.height = 1080;
  var b = back.getContext("2d"), f = front.getContext("2d"), n, keep = pen;
  cngSkyline(b, 0, 600, 160, "#b6c6b2", 7);              // the far ranges, one line through both panels
  b.save(); b.translate(WIDE, 0); cngSkyline(b, WIDE, 600, 160, "#b6c6b2", 7); b.restore();
  pen = b;
  forestSlope(b, cngNangNon, 0, 2 * WIDE, 760, {});     // Doi Nang Non, clothed in forest
  pen = keep;
  csBand(b, 0, 740, 2 * WIDE, 340, "#a9c97a", "#86a85a"); // the paddies and the village ground
  b.strokeStyle = "rgba(90, 120, 50, 0.3)";
  b.lineWidth = 1.5;
  for (n = 0; n < 10; n++) { var by = 760 + n * 14 + n * n; b.beginPath(); b.moveTo(0, by); b.lineTo(WIDE * 1.3, by + 3 * Math.sin(n)); b.stroke(); }
  b.fillStyle = "#7fa6a2";                                // the Mae Sai, winding from the far hills to the near left
  b.beginPath(); b.moveTo(CNG_STREAM[0] + 500, CNG_STREAM[1]); b.quadraticCurveTo(CNG_STREAM[0] + 240, 880, CNG_STREAM[0] - 80, 1080);
  b.lineTo(CNG_STREAM[0] + 260, 1080); b.quadraticCurveTo(CNG_STREAM[0] + 380, 880, CNG_STREAM[0] + 540, CNG_STREAM[1]); b.closePath(); b.fill();
  b.fillStyle = "#d9c89a";                                // the path along it to the village
  b.beginPath(); b.moveTo(0, CNG_GROUND - 30); b.quadraticCurveTo(WIDE, CNG_GROUND - 50, 2 * WIDE, CNG_GROUND - 30);
  b.lineTo(2 * WIDE, CNG_GROUND + 40); b.quadraticCurveTo(WIDE, CNG_GROUND + 20, 0, CNG_GROUND + 40); b.closePath(); b.fill();
  pen = b;
  for (n = 0; n < 8; n++) { tree(b, 160 + n * 420 + 80 * dice(n + 30), 790 + 20 * dice(n), 0.45 + 0.2 * dice(n + 31)); }
  [[WIDE + 260, 860, 0.55], [WIDE + 560, 840, 0.5], [WIDE + 1640, 850, 0.55]].forEach(function (h) { house(b, h[0], h[1], h[2]); });
  tub(b, WIDE + 820, 870, 0.7, {});
  longKhao(b, WIDE + 420, 900, 0.55, true);              // a granary
  house(b, CNG_HOUSE[0], CNG_HOUSE[1], CNG_HOUSE[2]);    // the headman's house
  for (n = 0; n < 5; n++) { banana(b, WIDE + 100 + n * 360, 905 + 10 * dice(n + 40)); }
  pen = keep;
  f.strokeStyle = "#8a6a44";                              // the village's bamboo fences along the near ground
  f.lineWidth = 3;
  for (n = 0; n < 2; n++) {
    var fx = WIDE + 40 + n * 1000, fy = 1010;
    f.beginPath(); f.moveTo(fx, fy - 30); f.lineTo(fx + 640, fy - 30); f.moveTo(fx, fy - 12); f.lineTo(fx + 640, fy - 12); f.stroke();
    for (var p = 0; p <= 16; p++) { f.beginPath(); f.moveTo(fx + p * 40, fy); f.lineTo(fx + p * 40, fy - 44); f.stroke(); }
  }
  CNG_VILLAGE = {back: back, front: front};
  return CNG_VILLAGE;
}

// ---------- a person measured, and a person carrying ----------
// Where a person's joints are, without drawing them where they are seen (maeng/sets.js's maengMeasure, the kit's way):
// on a scratch sheet, under an id of its own. x, y, look as person() takes them; gives back person()'s joints.
// e.g. var shoulder = cngMeasure(700, 930, look).shoulderB;
var CNG_SCRATCH = null;
function cngMeasure(x, y, look) {
  if (!CNG_SCRATCH) {
    CNG_SCRATCH = document.createElement("canvas");
    CNG_SCRATCH.width = WIDE;
    CNG_SCRATCH.height = 1080;
  }
  var keep = pen, joints;
  pen = CNG_SCRATCH.getContext("2d");
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.clearRect(0, 0, WIDE, 1080);
  joints = person(x, y, Object.assign({}, look, {id: (look.id || "someone") + "/measure"}));
  pen = keep;
  return joints;
}

// Someone walking with a carrying pole on the far shoulder, a basket before and behind, the near hand on the pole in
// front: the pole measured onto the shoulder (cngMeasure), drawn before them. look: person()'s, with its face; gold:
// the tribute's gold showing in the baskets. Gives back nothing: it draws with pen. e.g. cngPorter(600, 930, look, true);
function cngPorter(x, y, look, gold) {
  var face = look.face || 1, shoulder = cngMeasure(x, y, look).shoulderB, size = look.size || 1.3;
  pen.save();
  pen.translate(shoulder[0], shoulder[1] - 6 * size);
  pen.rotate(Math.PI / 2 * 0);
  carryPole(pen, 0, 0, size * 0.85, {gold: gold});
  pen.restore();
  person(x, y, Object.assign({}, look, {reachA: [shoulder[0] + 70 * size * face, shoulder[1] - 4 * size]}));
}

// How dark the sheet is at second t from a scene's cuts between its shots: 1 at a cut, 0 half a second either side.
// cuts: the seconds where the shots change, through black. e.g. cngDark(12.2, [12, 26]) is 0.6
function cngDark(t, cuts) {
  return cuts.reduce(function (most, at) { return Math.max(most, 1 - Math.abs(t - at) / 0.5); }, 0);
}

// The sheet darkened by cngDark(t, cuts), and the scene's first second out of the dark. e.g. cngCutsOver(t, [12, 26]);
function cngCutsOver(t, cuts) {
  var dark = cngDark(t, cuts);
  if (dark > 0) {
    pen.fillStyle = "rgba(0, 0, 0, " + dark.toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
  cngFadeIn(t, 1);
}

// ---------- inside the headman's house ----------
// The room of a northern house on posts: walls of teak boards, the roof's beams and rafters over it, a floor of planks,
// a window open on the village and Doi Nang Non; by night the window dark and a clay lamp burning on the floor. The
// cradle hangs from the beam (CNG_BEAM). Scenes 5, 8, 10, 12. Painted once for "day" and "night".
var CNG_ROOM = {};
var CNG_FLOOR = 900;                                   // the floor, where people sit and stand
var CNG_BEAM = 300;                                    // the beam the cradle hangs from
var CNG_WINDOW = [1240, 330, 420, 300];                // x, y, wide, tall

// kind: "day" or "night". Gives back the room's canvas, WIDE by 1600: its floor goes on below the sheet, so a scene that
// comes in close on the floor never sees past it. e.g. pen.drawImage(cngRoom("day"), 0, 0);
function cngRoom(kind) {
  if (CNG_ROOM[kind]) { return CNG_ROOM[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1600;
  var b = paper.getContext("2d"), n, night = kind === "night";
  var w = CNG_WINDOW;
  b.drawImage(cngSky(night ? "night" : "day"), 0, 0);    // through the window: the sky, the mountain, the village's trees
  cngSkyline(b, 0, w[1] + w[3] - 40, 120, night ? "#2a3550" : "#7aa070", 7);
  b.fillStyle = night ? "#1e2a3a" : "#9cbf6e";
  b.fillRect(w[0], w[1] + w[3] - 40, w[2], 40);
  b.save();                                              // the walls round the window: boards of teak
  b.beginPath(); b.rect(0, 0, WIDE, CNG_FLOOR); b.rect(w[0] + w[2], w[1], -w[2], w[3]); b.clip("evenodd");
  csBand(b, 0, 0, WIDE, CNG_FLOOR, night ? "#4a3222" : "#a8784a", night ? "#3a2618" : "#8a5c36");
  b.strokeStyle = night ? "rgba(20, 10, 4, 0.5)" : "rgba(70, 40, 20, 0.45)";
  b.lineWidth = 2;
  for (n = 0; n < WIDE; n += 64) { b.beginPath(); b.moveTo(n + 6 * dice(n), 0); b.lineTo(n + 6 * dice(n + 1), CNG_FLOOR); b.stroke(); }
  b.restore();
  b.strokeStyle = night ? "#2a1a10" : "#6a4626"; b.lineWidth = 10;   // the window's frame and its bars
  b.strokeRect(w[0], w[1], w[2], w[3]);
  b.lineWidth = 5;
  for (n = 1; n < 6; n++) { b.beginPath(); b.moveTo(w[0] + n * w[2] / 6, w[1]); b.lineTo(w[0] + n * w[2] / 6, w[1] + w[3]); b.stroke(); }
  b.fillStyle = night ? "#2a1a10" : "#6a4626";            // the beam across, and the rafters over it
  b.fillRect(0, CNG_BEAM - 22, WIDE, 30);
  for (n = 0; n < WIDE; n += 180) {
    b.beginPath(); b.moveTo(n, 0); b.lineTo(n + 40, 0); b.lineTo(n + 120, CNG_BEAM - 22); b.lineTo(n + 80, CNG_BEAM - 22); b.closePath(); b.fill();
  }
  csBand(b, 0, CNG_FLOOR, WIDE, 1600 - CNG_FLOOR, night ? "#5a3e28" : "#b88a58", night ? "#2a1a10" : "#7a5430");   // the floor
  b.strokeStyle = night ? "rgba(20, 10, 4, 0.4)" : "rgba(80, 50, 24, 0.35)"; b.lineWidth = 2;
  for (n = 0; n < 8; n++) { var fy = CNG_FLOOR + 8 + n * n * 3 + n * 6; b.beginPath(); b.moveTo(0, fy); b.lineTo(WIDE, fy); b.stroke(); }
  b.fillStyle = night ? "#6a5a3a" : "#c9b07a";            // a mat of woven reed on the floor
  b.beginPath(); b.ellipse(760, CNG_FLOOR + 70, 420, 54, 0, 0, 7); b.fill();
  if (night) {                                            // the dark of the room's corners
    var dark = b.createRadialGradient(760, CNG_FLOOR, 200, 760, CNG_FLOOR, 1200);
    dark.addColorStop(0, "rgba(0, 0, 0, 0)"); dark.addColorStop(1, "rgba(0, 0, 10, 0.6)");
    b.fillStyle = dark; b.fillRect(0, 0, WIDE, 1080);
  }
  CNG_ROOM[kind] = paper;
  return paper;
}

// ---------- a lane of Yonok ----------
// A lane inside the city at dawn or by day: the rampart's inner face of brick far behind with trees over it, houses on
// posts along the lane, their ladders down to it, and the lane itself of beaten earth. Scenes 6 and 20.
var CNG_LANE = {};
var CNG_LANE_Y = 950;                                  // where people walk in the lane

// kind: "dawn" or "day". Gives back the lane's canvas, WIDE by 1080, clear above the far hills. e.g. pen.drawImage(cngLane("dawn"), 0, 0);
function cngLane(kind) {
  if (CNG_LANE[kind]) { return CNG_LANE[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), n, keep = pen;
  cngSkyline(b, 0, 600, 160, "#a9bca6", 9);
  csBand(b, 0, 540, WIDE, 120, "#b5664a", "#9a5440");    // the rampart's inner face, far behind
  b.fillStyle = "#b5664a";
  for (n = 0; n < WIDE; n += 34) { b.fillRect(n, 522, 20, 20); }
  pen = b;
  for (n = 0; n < 7; n++) { tree(b, 60 + n * 300 + 50 * dice(n + 60), 680, 0.45 + 0.15 * dice(n + 61)); }
  csBand(b, 0, 660, WIDE, 420, "#b9a070", "#9a8058");    // the ground
  [[260, 880, 0.7], [760, 870, 0.66], [1300, 880, 0.72], [1760, 870, 0.64]].forEach(function (h) { house(b, h[0], h[1], h[2]); });
  pen = keep;
  b.fillStyle = "#c9b285";                               // the lane
  b.beginPath(); b.moveTo(0, CNG_LANE_Y - 40); b.lineTo(WIDE, CNG_LANE_Y - 50); b.lineTo(WIDE, CNG_LANE_Y + 70); b.lineTo(0, CNG_LANE_Y + 80); b.closePath(); b.fill();
  if (kind === "dawn") {
    b.fillStyle = "rgba(240, 170, 120, 0.18)";           // the first light, warm and low
    b.fillRect(0, 0, WIDE, 1080);
  }
  CNG_LANE[kind] = paper;
  return paper;
}

// ---------- Doi Ku Kaeo ----------
// The hill above Yonok where the great relic is kept in its chedi (the chronicle: ดอยกู่แก้ว, its มหาธาตุ): a hill
// in forest, a path climbing it, the gilded chedi on its top, a great tree at its foot. A temple may stand in a film
// (the kit's respect rule); nothing here is in the maker. CNG_CHEDI: [x, base, size] of the chedi; CNG_KUKAEO_TREE the
// great tree's foot. Scene 7. Painted once.
var CNG_KUKAEO = null;
var CNG_CHEDI = [1060, 470, 0.95];
var CNG_KUKAEO_TREE = [420, 960];

// The hill's top edge at x: gives back y. e.g. var y = cngKuKaeoRidge(1060);
function cngKuKaeoRidge(x) {
  return 490 + 0.0009 * Math.pow(x - 1060, 2) - 12 * Math.sin(x * 0.015);
}
function cngKuKaeo() {
  if (CNG_KUKAEO) { return CNG_KUKAEO; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), keep = pen, n;
  cngSkyline(b, 0, 700, 180, "#a3a6b8", 11);             // far ranges
  pen = b;
  forestSlope(b, cngKuKaeoRidge, -100, WIDE + 100, 1000, {});
  pen = keep;
  b.strokeStyle = "#c9b285";                             // the path up to the chedi
  b.lineWidth = 16;
  b.lineCap = "round";
  b.beginPath(); b.moveTo(200, 1080); b.quadraticCurveTo(700, 820, 820, 680); b.quadraticCurveTo(940, 560, CNG_CHEDI[0] - 30, CNG_CHEDI[1] + 10); b.stroke();
  b.lineCap = "butt";
  b.fillStyle = "#c9b285";                               // the clearing round the chedi
  b.beginPath(); b.ellipse(CNG_CHEDI[0], CNG_CHEDI[1] + 6, 170, 26, 0, 0, 7); b.fill();
  bdChedi(b, CNG_CHEDI[0], CNG_CHEDI[1], CNG_CHEDI[2]);
  csBand(b, 0, 960, WIDE, 120, "#93ab5e", "#6f8c44");    // the ground at the hill's foot
  pen = b;
  tree(b, CNG_KUKAEO_TREE[0], CNG_KUKAEO_TREE[1], 1.3);
  pen = keep;
  CNG_KUKAEO = paper;
  return paper;
}

// A point that person() gave back (its joints are in the canvas's own pixels: the film draws at two pixels to one)
// in the scene's coordinates under whatever camera pen has now. e.g. var hand = cngLocal(person(...).wristA);
function cngLocal(point) {
  var q = pen.getTransform().inverse().transformPoint(new DOMPoint(point[0], point[1]));
  return [q.x, q.y];
}

// A smith's hammer in his hand (scenes 9 and 17): a short wooden haft along the hand's line, an iron head across its end.
// joints: what person() gave back. e.g. cngHammer(joints);
function cngHammer(joints) {
  var w = cngLocal(joints.wristA), h = cngLocal(joints.handA), a = Math.atan2(h[1] - w[1], h[0] - w[0]);
  pen.save();
  pen.translate(w[0], w[1]);
  pen.rotate(a);
  pen.fillStyle = "#7a5432"; pen.fillRect(-6, -3, 64, 6);
  pen.fillStyle = "#3a3a40"; pen.fillRect(52, -14, 18, 28);
  pen.restore();
}

// The golden plate (scenes 17, 18, 21: the kit's kangsadan without its frame, as it is carried and struck), flat,
// plain, rings engraved on its face, hung from a red cord: at (x, y), its middle.
function cngPlate(x, y, size, t) {
  var g = pen.createRadialGradient(x - 18 * size, y - 18 * size, 4 * size, x, y, 70 * size);
  g.addColorStop(0, "#fff2b0"); g.addColorStop(0.5, "#e8b83a"); g.addColorStop(1, "#a8782a");
  pen.fillStyle = g;
  pen.beginPath(); pen.arc(x, y, 64 * size, 0, 7); pen.fill();
  pen.strokeStyle = "rgba(120, 80, 20, 0.55)"; pen.lineWidth = 2 * size;
  [46, 30, 14].forEach(function (r) { pen.beginPath(); pen.arc(x, y, r * size, 0, 7); pen.stroke(); });
  var shine = 0.5 + 0.5 * Math.sin((t || 0) * 3);
  pen.fillStyle = "rgba(255, 255, 240, " + (0.35 * shine).toFixed(3) + ")";
  pen.beginPath(); pen.ellipse(x - 22 * size, y - 24 * size, 16 * size, 8 * size, -0.6, 0, 7); pen.fill();
}

// ---------- the elephant's stable ----------
// The house the headman built for the elephant (the chronicle: "แปงโรงให้เป็นที่ช้างมงคลอยู่"): a high open shed of
// timber posts under a steep roof of grass thatch, a floor of beaten earth. Drawn with brush, in two parts: "back" (the
// roof and the back posts, before the elephant) and "front" (the near posts, after it). Scene 19.
// e.g. cngStable(pen, 900, 880, 1, "back"); elephant(...); cngStable(pen, 900, 880, 1, "front");
function cngStable(brush, x, base, size, part) {
  var s = size, wide = 760 * s, tall = 470 * s;
  if (part === "back") {
    brush.fillStyle = "#c9b07a";                           // the beaten floor
    brush.beginPath(); brush.ellipse(x, base, wide / 2 + 40 * s, 40 * s, 0, 0, 7); brush.fill();
    brush.fillStyle = "#6a4a2a";
    [-1, -0.33, 0.33, 1].forEach(function (k) { brush.fillRect(x + k * wide / 2 - 10 * s, base - tall - 40 * s, 20 * s, tall); });
    brush.fillStyle = "#b8975a";                           // the thatch, its ragged eaves
    brush.beginPath(); brush.moveTo(x - wide / 2 - 70 * s, base - tall + 30 * s); brush.lineTo(x, base - tall - 210 * s);
    brush.lineTo(x + wide / 2 + 70 * s, base - tall + 30 * s); brush.closePath(); brush.fill();
    brush.strokeStyle = "#8a6a3a"; brush.lineWidth = 2;
    for (var k = 0; k < 40; k++) {
      var ex = x - wide / 2 - 70 * s + k * (wide + 140 * s) / 40;
      brush.beginPath(); brush.moveTo(ex, base - tall + 30 * s); brush.lineTo(ex + 3, base - tall + 44 * s); brush.stroke();
    }
  } else {
    brush.fillStyle = "#7a5432";
    [-1, 1].forEach(function (k) { brush.fillRect(x + k * (wide / 2 + 30 * s) - 12 * s, base - tall + 30 * s, 24 * s, tall + 10 * s); });
  }
}

// The ring of light and the spray where the snake becomes the elephant, or the elephant the snake (scenes 15 and 23),
// at (x, y), from change[0] to change[1] seconds. e.g. cngBurst(t, 1100, 700, [31, 34]);
function cngBurst(t, x, y, change) {
  var u = between(t, change[0], change[1]);
  if (u <= 0 || u >= 1) { return; }
  var r = 40 + 520 * u, a = Math.sin(Math.PI * u);
  pen.save();
  var glow = pen.createRadialGradient(x, y, 0, x, y, r);
  glow.addColorStop(0, "rgba(255, 252, 230, " + (0.95 * a).toFixed(3) + ")");
  glow.addColorStop(0.7, "rgba(255, 240, 190, " + (0.6 * a).toFixed(3) + ")");
  glow.addColorStop(1, "rgba(255, 240, 190, 0)");
  pen.fillStyle = glow; pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill();
  pen.strokeStyle = "rgba(255, 250, 220, " + (0.9 * a).toFixed(3) + ")"; pen.lineWidth = 8;
  pen.beginPath(); pen.ellipse(x, y + 40, r * 0.9, r * 0.25, 0, 0, 7); pen.stroke();
  pen.fillStyle = "rgba(240, 250, 248, " + (0.85 * a).toFixed(3) + ")";
  for (var d = 0; d < 40; d++) {                           // the spray thrown up
    var ang = dice(d) * Math.PI, far = (0.3 + 0.7 * dice(d + 7)) * r * 0.8;
    pen.beginPath(); pen.arc(x + Math.cos(ang) * far * 1.4, y + 40 - Math.sin(ang) * far, 6 + 6 * dice(d + 3), 0, 7); pen.fill();
  }
  pen.restore();
}
