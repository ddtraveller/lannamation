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
// dream). The clouds are not on it: a scene drifts them over it (cngClouds()).
var CNG_SKY = {};

// kind: one of them ("clear": the night's sky with no stars painted on it, for scenery.js sceneryStars()). Gives back
// the sky's canvas (WIDE by 1080 pixels of the sheet), painted on the first call and
// kept in CNG_SKY after. e.g. pen.drawImage(cngSky("dawn"), 0, 0);
function cngSky(kind) {
  if (CNG_SKY[kind]) { return CNG_SKY[kind]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var brush = paper.getContext("2d"), n, sky = brush.createLinearGradient(0, 0, 0, 1080);
  var stops = {night: [[0, "#070b24"], [0.6, "#1b2350"], [1, "#40336b"]], clear: [[0, "#070b24"], [0.6, "#1b2350"], [1, "#40336b"]],
               dawn: [[0, "#2c3466"], [0.45, "#7a6a9a"], [0.75, "#e8a882"], [1, "#f6d9a8"]],
               day: [[0, "#8ccfc6"], [0.6, "#f4ecd2"], [1, "#f1d3bd"]],
               dusk: [[0, "#e8682e"], [0.5, "#f2a84a"], [1, "#8fbf9e"]],
               dream: [[0, "#c9b4dc"], [0.6, "#f2e2ee"], [1, "#f6e2b8"]],
               // the sunrise over Laos (2026-10-26, as the Maeng film's "sunrise", not a flat dawn): deep blue overhead
               // going through lilac and rose to gold low down, where the sun comes up behind the far hills
               sunrise: [[0, "#2c3672"], [0.16, "#5e5a96"], [0.3, "#c48ca2"], [0.42, "#f4b688"], [0.55, "#fbdba4"], [1, "#f8e6c0"]],
               // the sunset over the hills (scene 7): violet overhead going through rose and orange to gold low down
               sunset: [[0, "#3e3a74"], [0.14, "#7e5288"], [0.26, "#d4707a"], [0.36, "#f0965a"], [0.46, "#f8be6c"], [1, "#f6d696"]]}[kind];
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

// Beds of flowering bushes at the back of a place, behind its people (the scenery pass, 2026-10-26; flowers of the
// place and the tale's time: hibiscus, orange jasmine (dok kaew), the flame of the forest), and soft grass out of focus
// in the picture's bottom corners. kind: "court" or "fields"; part: "back" (the beds) or "frame" (the grass, last).
// e.g. cngBeds(t, "court", "back"); ... cngBeds(t, "court", "frame");
function cngBeds(t, kind, part) {
  if (part === "frame") {
    sceneryBeds(t, thkOnce("cng-frame-" + kind, function () {
      return [{sprite: sceneryGrass(280, 16, 471), x: 40, y: 1110}, {sprite: sceneryGrass(240, 14, 477), x: WIDE - 30, y: 1110}];
    }), {blur: 5, sway: 0.4});
    return;
  }
  sceneryBeds(t, thkOnce("cng-beds-" + kind, function () {
    if (kind === "court") {
      return [{sprite: sceneryBush(220, 95, 481, THK_GREENS, [["hibiscus", 10, 11, "#d93a2e"]]), x: 220, y: 745},
              {sprite: sceneryBush(190, 85, 483, THK_GREENS, [["dokkaew", 18, 6]]), x: 620, y: 740},
              {sprite: sceneryBush(190, 85, 485, THK_GREENS, [["dokkaew", 18, 6]]), x: WIDE - 420, y: 740},
              {sprite: sceneryBush(220, 95, 487, THK_GREENS, [["hibiscus", 10, 11, "#e8648a"]]), x: WIDE - 160, y: 745}];
    }
    return [{sprite: sceneryBush(380, 170, 491, THK_GREENS, [["thongkwao", 20, 12]]), x: 120, y: 900},
            {sprite: sceneryBush(340, 150, 493, THK_GREENS, [["hibiscus", 14, 12, "#d93a2e"]]), x: WIDE - 120, y: 900}];
  }), {sway: 0.3});
}

// Soft clouds in the light of the hour, in place of the cartoon cumulus (scenery.js sceneryClouds(); the scenery
// pass, 2026-10-26). light: "day", "dawn", "dusk" or "night"; alpha: 0 to 1 (a scene going from one light to the next
// draws both). e.g. cngClouds(t, "dawn", 1 - light); cngClouds(t, "day", light);
function cngClouds(t, light, alpha) {
  sceneryClouds(t, {light: light, count: 5, top: 70, bottom: 340, wide: [300, 540], seed: 6, alpha: alpha === undefined ? 1 : alpha});
}

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
// The fifty children on the bank (owner, 2026-10-25: "3 deep and go off the screen so it seems like there may really be
// 50"): thirty drawn, in three rows of ten, the far end of each row past the frame's left edge. cngWaiting(k): where
// child k waits along the bank, looking at the river (scenes 13, 14); cngHuddle(k): where it huddles back from the
// water (scenes 14, 15). Each gives back [x, y], its feet. e.g. var at = cngHuddle(12);
var CNG_KIDS = 30;
function cngWaiting(k) {
  var col = k % 10, row = Math.floor(k / 10);
  return [1060 - col * 125 - row * 45, CNG_BANK + 40 + row * 40];
}
function cngHuddle(k) {
  var col = k % 10, row = Math.floor(k / 10);
  return [620 - col * 78 + row * 30, CNG_BANK + 90 + row * 30];
}

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

// ---------- the far mountains ----------
// Chang Ngu's own far mountains (owner, 2026-10-26, the pick C of three, beside a photograph of the Lao hills across the
// Mae Khong from Chiang Saen): ridge behind ridge, blue and hazy with the air, a few pines standing out of the forest.
// scenery.js farRange()'s sheet made small (CNG_FAR.scale) about its foot, as hills far across a wide river are, and
// laid side by side along the world, every other copy mirrored so no join shows; under them, along the far bank, the
// Lao bank's low line of trees (every photograph has it). Painted once for each foot, a strip three panels wide (the
// world from -WIDE to 2 WIDE), so panels side by side share one unbroken range.
var CNG_FAR = {colour: "#7890a4", air: "220, 230, 238", scale: 0.72, veil: 0.36, look: {peak: false, ridges: 2, pines: 6, seed: 44}};
var CNG_FAR_STRIP = {};
// The range in another light, laid over the day's (source-atop): at dawn its far ridges are not white against a dark
// sky but lilac in the shadow of the hour (2026-10-26).
var CNG_FAR_LIGHT = {dawn: "rgba(104, 88, 140, 0.5)", dusk: "rgba(150, 76, 104, 0.45)"};

// The far range for one panel, drawn with brush: worldX: where the panel lies in the world (0 the river's, -WIDE the
// town's); foot: the far bank's y; light: a key of CNG_FAR_LIGHT, or none for the day.
// e.g. cngFar(b, 0, CNG_WATER);   pen.globalAlpha = 1 - light; cngFar(pen, 0, CNG_WATER, "dawn");
function cngFar(brush, worldX, foot, light) {
  if (light) {
    var key = foot + " " + light;
    if (!CNG_FAR_STRIP[key]) {
      cngFar(document.createElement("canvas").getContext("2d"), 0, foot);   // the day's strip first
      var lit = document.createElement("canvas");
      lit.width = 3 * WIDE;
      lit.height = 1080;
      var l = lit.getContext("2d");
      l.drawImage(CNG_FAR_STRIP[foot], 0, 0);
      l.globalCompositeOperation = "source-atop";
      l.fillStyle = CNG_FAR_LIGHT[light];
      l.fillRect(0, 0, 3 * WIDE, 1080);
      CNG_FAR_STRIP[key] = lit;
    }
    brush.drawImage(CNG_FAR_STRIP[key], worldX + WIDE, 0, WIDE, 1080, 0, 0, WIDE, 1080);
    return;
  }
  if (!CNG_FAR_STRIP[foot]) {
    var f = CNG_FAR, sheet = farRange(f.colour, f.air, 700, f.look), tile = WIDE * f.scale, top = foot - 720 * f.scale;
    var strip = document.createElement("canvas");
    strip.width = 3 * WIDE;
    strip.height = 1080;
    var b = strip.getContext("2d");
    for (var i = -2; i * tile < 2 * WIDE; i++) {
      b.save();
      if (Math.abs(i) % 2) { b.translate(WIDE + (i + 1) * tile, 0); b.scale(-1, 1); } else { b.translate(WIDE + i * tile, 0); }
      b.drawImage(sheet, 0, top, tile, 1080 * f.scale);
      b.restore();
    }
    b.globalCompositeOperation = "source-atop";          // more air over it: it is far
    b.fillStyle = "rgba(" + f.air + ", " + f.veil + ")";
    b.fillRect(0, 0, 3 * WIDE, 1080);
    b.globalCompositeOperation = "source-over";
    var bank = forestHill({seed: 7, tall: 34, deep: 26, gap: 8, sizes: ["small"], pines: 0,
                           greens: THK_SHADE.map(function (g) { return blend(g, "#5f7a5a", 0.35); })});
    var keep = pen;
    pen = b;                                              // thkPlace() draws with pen
    for (var x = -300; x < 3 * WIDE; x += 1600) { thkPlace(bank.sprite, x, foot + 4, 0.5, 0); }
    pen = keep;
    CNG_FAR_STRIP[foot] = strip;
  }
  brush.drawImage(CNG_FAR_STRIP[foot], worldX + WIDE, 0, WIDE, 1080, 0, 0, WIDE, 1080);
}

// ---------- the Mae Khong, from the west bank ----------
// The river at Chiang Saen as it is in the dry season (chiangsaen.js): the far bank's hills (Laos), the wide brown
// river, a bar of sand and gravel mid-river under khrai nam scrub, the near bank's sand where the children stand.
// Painted once: "back" (the far range and the river, still) and "near" (the near bank), WIDE by 1080. What moves a
// scene draws live: cngRiverLife(t, look), the water first (cngRiverFlow()), then the scrub, the birds, the ducks.
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
  cngFar(b, 0, CNG_WATER);                               // Laos's hills across the river
  var keep = pen;
  pen = b;                                               // the water as it lies still, for a scene that paints it once
  sceneryWaterDepths(cngRiverWater(0, WIDE));
  pen = keep;
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

// The river as scenery.js takes a water (the hero film's pond; owner, 2026-10-26: "Look at the water in the pond scene
// and try to recreate the lazy slow Mae Khong and give it the qualities of water like the pond has"; the pick "Water
// 1"): its far bank a long straight line under the Lao bank's trees, from left to right (x on the sheet), its foot
// under the near bank's sand; the far bank mirrored strongly across the far water, fading toward the near bank; brown.
// Made once for each span. e.g. sceneryWaterDepths(cngRiverWater(0, WIDE));
var CNG_RIVER_WATER = {};
function cngRiverWater(left, right) {
  var key = left + " " + right;
  if (CNG_RIVER_WATER[key]) { return CNG_RIVER_WATER[key]; }
  var top = [], foot = CNG_BANK + 40;
  for (var k = 0; k <= 10; k++) { top.push([left - 300 + k * (right - left + 600) / 10, CNG_WATER + (k % 2 ? 1.5 : 0)]); }
  CNG_RIVER_WATER[key] = {edge: [[left - 300, foot + 80]].concat(top, [[right + 300, foot + 80]]), top: top, line: CNG_WATER,
                          left: left, right: right, foot: foot, depths: ["#a08664", "#7e6446"],
                          mirror: [[CNG_WATER, 1], [600, 0.8], [660, 0.6], [730, 0.45]], tint: "112, 86, 54",
                          rings: [[left + 300, 640, 2.2], [left + 1240, 700, 4.6], [left + 760, 600, 7.1]], mist: null};
  return CNG_RIVER_WATER[key];
}

// The river's face at second t from left to right (x on the sheet; 0 and WIDE when left out): what stands behind it
// mirrored (sceneryWaterSurface()), the silt that keeps it brown whatever it mirrors, a thin mist along the far water,
// the current (slow streaks and flecks of foam drifting downstream, left to right: the river runs south and we look
// east, into Laos; the water parting at the sandbar's upstream end), and the sandbar standing in it with its own soft
// reflection. Draws with pen. e.g. cngRiverFlow(t);  cngRiverFlow(t, -WIDE + 700, WIDE);
function cngRiverFlow(t, left, right) {
  left = left === undefined ? 0 : left;
  right = right === undefined ? WIDE : right;
  var w = cngRiverWater(left, right), n;
  sceneryWaterDepths(w);
  sceneryWaterSurface(t, w);
  pen.save();
  sceneryWaterShape(w);
  pen.clip();
  pen.globalCompositeOperation = "multiply";             // the silt
  pen.fillStyle = "rgba(214, 170, 112, 0.55)";
  pen.fillRect(left, CNG_WATER, right - left, w.foot - CNG_WATER);
  pen.globalCompositeOperation = "source-over";
  pen.translate(left, 0);
  softMist(t, CNG_WATER + 4, 18, 0.16, 9, "244, 238, 226");
  pen.lineCap = "round";
  var span = right - left;
  for (n = 0; n < Math.round(46 * span / WIDE); n++) {   // the current
    var u = dice(n * 2.9 + 4), y = CNG_WATER + 14 + Math.pow(u, 1.3) * (CNG_BANK - CNG_WATER - 20);
    var speed = 6 + 14 * u, len = 60 + 200 * u * dice(n + 11), run = span + len + 200;
    var x = ((dice(n * 5.3) * run + t * speed) % run) - len - 100;
    pen.strokeStyle = "rgba(246, 236, 214, " + ((0.06 + 0.12 * u) * (0.6 + 0.4 * Math.sin(t * 0.4 + n))).toFixed(3) + ")";
    pen.lineWidth = 0.8 + 1.4 * u;
    pen.beginPath(); pen.moveTo(x, y); pen.quadraticCurveTo(x + len / 2, y + 1.5 * Math.sin(t * 0.3 + n), x + len, y); pen.stroke();
  }
  pen.restore();
  if (left < CNG_BAR[0] + CNG_BAR[2] && right > CNG_BAR[0]) {
    var bx = CNG_BAR[0] - 10, by = CNG_BAR[1] + CNG_BAR[3] * 0.6;
    pen.save();                                          // the water parting at the bar's upstream end
    pen.strokeStyle = "rgba(246, 236, 214, 0.28)";
    pen.lineWidth = 1.4;
    [-1, 1].forEach(function (side) {
      for (var v = 0; v < 3; v++) {
        var o = (t * 10 + v * 30) % 90;
        pen.beginPath(); pen.moveTo(bx - 30 + o * 0.2, by + side * (4 + o * 0.18));
        pen.quadraticCurveTo(bx + 40 + o, by + side * (10 + o * 0.25), bx + 120 + o * 2, by + side * (14 + o * 0.3)); pen.stroke();
      }
    });
    pen.globalAlpha = 0.25;                               // the bar's reflection, and the bar
    pen.translate(0, 2 * (CNG_BAR[1] + CNG_BAR[3] * 0.7));
    pen.scale(1, -1);
    sandbar(pen, CNG_BAR[0], CNG_BAR[1], CNG_BAR[2], CNG_BAR[3], 3);
    pen.restore();
    sandbar(pen, CNG_BAR[0], CNG_BAR[1], CNG_BAR[2], CNG_BAR[3], 3);
  }
}

// The near bank's plants at second t, drawn with pen (the scenery pass, 2026-10-26): clumps of reeds and tufts of
// grass along the water's edge, where the sand meets it, and soft grass out of focus in the picture's bottom corners.
// part: "edge" (the reeds and grass at the water, drawn after the near bank) or "frame" (the soft grass, last of all).
// e.g. cngRiverBank(t, "edge"); ... cngRiverBank(t, "frame");
var CNG_BANK_REEDS = [[70, 0.55], [330, 0.4], [1480, 0.5], [1760, 0.62]];
function cngRiverBank(t, part) {
  if (part === "frame") {
    sceneryBeds(t, thkOnce("cng-bank-frame", function () {
      return [{sprite: sceneryGrass(300, 18, 451), x: 40, y: 1110}, {sprite: sceneryGrass(260, 16, 457), x: WIDE - 30, y: 1110}];
    }), {blur: 5, sway: 0.4});
    return;
  }
  sceneryBeds(t, thkOnce("cng-bank-grass", function () {
    var tufts = [], greens = [THK_SHADE, THK_GREENS, THK_SHADE.map(function (g) { return blend(g, "#8a8a5a", 0.3); })];
    for (var n = 0; n < 11; n++) {                         // in clumps, uneven, two or three together, now and then a gap
      var x = 60 + n * 170 + 90 * (dice(n * 3 + 1) - 0.5);
      if (dice(n + 77) < 0.2) { continue; }
      for (var k = 0; k < 1 + Math.floor(3 * dice(n * 5 + 2)); k++) {
        tufts.push({sprite: sceneryGrass(40 + 70 * dice(n * 7 + k), 7 + Math.floor(8 * dice(n + k * 11)), 461 + n * 4 + k, greens[(n + k) % 3]),
                    x: x + (k - 1) * 26 + 10 * dice(k + n), y: CNG_BANK + 12 + 8 * dice(n * 2 + k)});
      }
    }
    return tufts;
  }), {sway: 0.3});
  CNG_BANK_REEDS.forEach(function (r) { sceneryReeds(r[0], CNG_BANK + 16, r[1], t, "back"); sceneryReeds(r[0], CNG_BANK + 16, r[1], t, "front"); });
}

// The river drawn again over whoever is in it (the channel before the bank: the swimming elephant, Phrom and the
// children up to their shoulders), from the y "top" down, as cngRiverFlow() paints it, so the water over them is the
// river's own (2026-10-26; a flat band and waves until then). Draws with pen. e.g. cngRiverOver(t, CNG_BANK - 62);
function cngRiverOver(t, top) {
  pen.save();
  pen.beginPath(); pen.rect(-WIDE, top, 3 * WIDE, 1080 - top); pen.clip();
  cngRiverFlow(t);
  pen.restore();
}

// The river's life at second t, drawn with pen: the water (cngRiverFlow(), unless look.water is false: a scene that
// draws the water over a wider span itself), the khrai nam on the bar, the birds on it (they rise and fly when
// look.flushed is 0 to 1: the snakes' coming), the ducks. look: water (true), birds (true), flushed (0), away (0: the
// seconds since they rose, as they fly on and out of the sheet, each its own way; owner, 2026-10-25: "the birds should
// just fly away", not hang in the sky). e.g. cngRiverLife(t, {flushed: between(t, 10, 12), away: t - 12});
function cngRiverLife(t, look) {
  look = look || {};
  if (look.water !== false) { cngRiverFlow(t); }
  khraiNam(pen, CNG_BAR[0] + CNG_BAR[2] * 0.72, CNG_BAR[1] + 30, 0.7, t, 1);
  khraiNam(pen, CNG_BAR[0] + CNG_BAR[2] * 0.84, CNG_BAR[1] + 34, 0.6, t, 4);
  khraiNam(pen, CNG_BAR[0] + CNG_BAR[2] * 0.12, CNG_BAR[1] + 36, 0.5, t, 7);
  if (look.birds === false) { return; }
  var up = look.flushed || 0, away = Math.max(0, look.away || 0);
  var on = function (dir, speed) { return [dir * speed * away, -(70 + 25 * speed / 200) * away]; };   // flown on, and up
  [[0.3, 1], [0.36, -1], [0.42, 1], [0.48, 1], [0.55, -1]].forEach(function (b, i) {
    var dir = i < 2 ? -1 : 1, go = on(dir, 150 + 40 * i);
    var x = CNG_BAR[0] + CNG_BAR[2] * b[0] + 160 * up * (i - 2) + go[0], y = CNG_BAR[1] + 26 - 260 * up - 20 * Math.sin(t * 3 + i) * up + go[1];
    pratincole(pen, x, y, 1.3, {face: away > 0 ? dir : up > 0 ? 1 : b[1], fly: up > 0.05, t: t + i, peck: up > 0 ? 0 : Math.max(0, Math.sin(t * 1.3 + i * 2)) * 0.6});
  });
  var lap = on(1, 260), plo = on(-1, 220);
  riverLapwing(pen, CNG_BAR[0] + CNG_BAR[2] * 0.62 + 300 * up + lap[0], CNG_BAR[1] + 28 - 200 * up + lap[1], 1.4, {face: away > 0 ? 1 : -1, fly: up > 0.05, t: t});
  ringedPlover(pen, CNG_BAR[0] + CNG_BAR[2] * 0.2 + plo[0], CNG_BAR[1] + 32 - 220 * up + plo[1], 1.3, {face: away > 0 ? -1 : 1, fly: up > 0.05, t: t, peck: up > 0 ? 0 : Math.max(0, Math.sin(t * 2))});
  spotbill(pen, 300 - 30 * t * up, CNG_WATER + 150, 1.3, {face: 1, t: t});
  spotbill(pen, 380 - 30 * t * up, CNG_WATER + 168, 1.2, {face: 1, t: t + 1});
}

// ---------- Yonok on its bank ----------
// The city beside the river, on the west bank (the river to the right of it): its roofs among palms and great trees
// on the higher ground, a gilded chedi among them, and behind them the north rampart (cityWall, its gate out of sight)
// running to the water, turned there and run down the bank to the sheet's foot (cngBankWall). Chiang Saen had no wall
// along the river, the Mae Khong was its east moat (Penth 1975): the bank's wall is the owner's choice for the film
// (2026-10-25). Painted once, two sheets WIDE by 1080: "back", the far range and the river still, clear where it
// shows the sky, and "front", the near sand and the town's ground with all that stands on it, clear over the water,
// so the river's live face (cngRiverFlow()) runs under the town's bank (2026-10-26). A scene draws them to the left of
// cngRiver()'s panel and pans between them. e.g. var town = cngTown(); pen.drawImage(town.back, -WIDE, 0); ...
// cngRiverFlow(t, -WIDE + WIDE * CNG_TOWN_EDGE - 200, WIDE); ... pen.drawImage(town.front, -WIDE, 0);
var CNG_TOWN = null;
var CNG_TOWN_EDGE = 0.66;                              // where the town's bank meets the river, a share of the panel
function cngTown() {
  if (CNG_TOWN) { return CNG_TOWN; }
  var back = document.createElement("canvas"), paper = document.createElement("canvas");
  back.width = paper.width = WIDE;
  back.height = paper.height = 1080;
  var b = back.getContext("2d"), n, edge = WIDE * CNG_TOWN_EDGE;
  cngFar(b, -WIDE, CNG_WATER);                           // the far range, the same line as the river panel's
  var keep = pen;
  pen = b;                                               // the river, still, as the river panel's
  sceneryWaterDepths(cngRiverWater(0, WIDE));
  pen = keep;
  b = paper.getContext("2d");
  b.fillStyle = "#cdb688";                               // the near bank's sand, as the river panel's, and its wet edge
  b.fillRect(0, CNG_BANK + 10, WIDE, 1080 - CNG_BANK);    // running on into it (no step where the two panels meet)
  b.fillStyle = "#a99064";
  b.fillRect(edge, CNG_BANK + 10, WIDE - edge, 12);
  b.fillStyle = "#93ab5e";                               // the town's higher ground, its bank sloping down to the water
  b.beginPath(); b.moveTo(0, 1080); b.lineTo(0, CNG_WATER - 10);
  b.lineTo(edge - 120, CNG_WATER - 10); b.quadraticCurveTo(edge, CNG_WATER + 40, edge + 60, 1080); b.closePath(); b.fill();
  b.fillStyle = "#b8a070";                               // the bank's earth face at the water
  b.beginPath(); b.moveTo(edge - 120, CNG_WATER - 10); b.quadraticCurveTo(edge, CNG_WATER + 40, edge + 60, 1080);
  b.lineTo(edge + 100, 1080); b.quadraticCurveTo(edge + 30, CNG_WATER + 60, edge - 100, CNG_WATER - 6); b.closePath(); b.fill();
  cityWall(b, -40, CNG_WATER + 30, edge - 40, 0.8, {gate: false, outer: false});   // the north rampart, to the river (owner's pick A)
  pen = b;
  // the town's trees painted as the hero film's are (thicket.js thkTreeOn()), in fruit and flower as a town's yards
  // have them: mango, longan, the golden shower, the flame of the forest, a frangipani by the chedi
  [["mango", 22, 14], ["longan", 26, 14], ["ratchaphruek", 30, 14], ["thongkwao", 34, 14], ["frangipani", 30, 12]].forEach(function (bloom, k) {
    thkTreeOn(b, 100 + k * 240 + 40 * dice(k), CNG_WATER + 70 + 20 * dice(k + 3), 0.3 + 0.08 * dice(k + 5), 41 + k, [bloom]);
  });
  bdChedi(b, 760, CNG_WATER + 110, 1.0);                  // the great chedi of the city
  [[130, 900, 0.62], [400, 940, 0.68], [650, 990, 0.6], [880, 920, 0.64]].forEach(function (h, k) {   // clear of the bank's wall
    house(b, h[0], h[1], h[2]);
    [[-0.36, ["hibiscus", "marigold", "dokkaew", "bougainvillea"][k]], [0.38, ["jasmine", "tahern", "hibiscus", "marigold"][k]]].forEach(function (f) {
      flora(f[1], h[0] + f[0] * 380 * h[2], h[1] + 4, {size: 0.42 * h[2], ground: false});   // flowers at the house's feet
    });
  });
  for (n = 0; n < 3; n++) { palm(b, 300 + n * 330 + 30 * dice(n + 11), CNG_WATER + 160, 300 + 60 * dice(n + 2)); }
  pen = keep;
  cngBankWall(b, edge);                                  // and down the bank, nearer than the town
  CNG_TOWN = {back: back, front: paper};
  return CNG_TOWN;
}

// The town's wall along its bank (owner, 2026-10-25, of the pick A: "extend the wall down to the bottom of the
// screen", along the river bank): the north rampart's outer face as cityWall() draws it, turned at the corner and run
// down the bank's curve to the foot of the sheet, nearer and so larger as it comes, the earth face, the teak palisade
// and the crenellated brick parapet. Chiang Saen had no wall on the river (Penth 1975): this is the owner's choice for
// the film, not the sources'. b: the brush; edge: where the bank meets the river (as cngTown()'s). Draws with b.
// e.g. cngBankWall(b, WIDE * CNG_TOWN_EDGE);
function cngBankWall(b, edge) {
  var bank = function (u) {                              // the bank's curve, as cngTown() draws it, a little inland
    var p0 = [edge - 120, CNG_WATER - 10], p1 = [edge, CNG_WATER + 40], p2 = [edge + 60, 1080], v = 1 - u;
    return [v * v * p0[0] + 2 * v * u * p1[0] + u * u * p2[0] - 50 - 70 * u, v * v * p0[1] + 2 * v * u * p1[1] + u * u * p2[1] + 40];
  };
  // A wall running away from us is seen as a road (owner, 2026-10-26, with a photograph of Chiang Saen's own wall: "make
  // the right hand side brick wall look more 3D. have a path for soldiers like a road and then battlements on the right
  // hand side ... What is there now is like a sheet. It just needs to have thickness"): at each step along it, its
  // walkway's two edges (left, the town's side; right, the river's) at its height over the ground, its inner face
  // dropping from the left edge to the ground, the battlements standing on the right edge, and the earth bank falling
  // from them to the water. All of it larger as it comes near.
  var n, steps = 90, size = [], ground = [], left = [], right = [], foot = [];
  for (n = 0; n <= steps; n++) {
    var u = n / steps, p = bank(u), s = mix(0.8, 1.9, u), high = 62 * s, half = 42 * s;
    size.push(s);
    ground.push([p[0] - half - 0.6 * high, p[1]]);       // the inner face's foot on the town's ground, seen a little from the left
    left.push([p[0] - half, p[1] - high]);
    right.push([p[0] + half, p[1] - high]);
    foot.push([p[0] + half + 120 * s, p[1] + 40 * s]);   // the earth bank's foot, toward the water
  }
  var strip = function (a, c) {                          // a band between two lines along the wall, filled
    b.beginPath();
    a.forEach(function (q, k) { b[k ? "lineTo" : "moveTo"](q[0], q[1]); });
    for (var k = c.length - 1; k >= 0; k--) { b.lineTo(c[k][0], c[k][1]); }
    b.closePath();
  };
  var along = function (a, c, f) { return a.map(function (q, k) { return [mix(q[0], c[k][0], f), mix(q[1], c[k][1], f)]; }); };
  var stroke = function (a) { b.beginPath(); a.forEach(function (q, k) { b[k ? "lineTo" : "moveTo"](q[0], q[1]); }); b.stroke(); };
  b.fillStyle = "#8a8f52";                               // the earth bank from the battlements down to the water
  strip(right, foot); b.fill();
  b.fillStyle = "rgba(60, 50, 20, 0.2)";
  strip(along(right, foot, 0.5), foot); b.fill();
  b.fillStyle = "#8e4e36";                               // the inner face, brick, in shade
  strip(left, ground); b.fill();
  b.strokeStyle = "rgba(50, 24, 14, 0.45)";              // its courses, and the joints between bricks
  b.lineWidth = 1;
  var courses = 7;
  for (var c = 1; c < courses; c++) { stroke(along(left, ground, c / courses)); }
  for (n = 0; n < steps; n++) {
    for (c = 0; c < courses; c++) {
      if ((n + c) % 2) { continue; }
      var top = along(left, ground, c / courses)[n], low = along(left, ground, (c + 1) / courses)[n];
      b.beginPath(); b.moveTo(top[0], top[1]); b.lineTo(low[0], low[1]); b.stroke();
    }
  }
  b.fillStyle = "rgba(255, 220, 180, 0.12)";             // the light along its top course
  strip(left, along(left, ground, 0.12)); b.fill();
  b.fillStyle = "#c08a62";                               // the walkway: brick paving, lit from above, worn paler down its middle
  strip(left, right); b.fill();
  b.fillStyle = "rgba(236, 206, 160, 0.35)";
  strip(along(left, right, 0.3), along(left, right, 0.7)); b.fill();
  b.strokeStyle = "rgba(90, 50, 30, 0.35)";              // its joints: across, every brick's length, and along
  for (n = 0; n <= steps; n += 2) { b.beginPath(); b.moveTo(left[n][0], left[n][1]); b.lineTo(right[n][0], right[n][1]); b.stroke(); }
  [0.25, 0.5, 0.75].forEach(function (f) { stroke(along(left, right, f)); });
  b.fillStyle = "rgba(96, 120, 60, 0.5)";                // moss and grass in the joints here and there
  for (n = 2; n < steps; n += 5) {
    var m = along(left, right, 0.15 + 0.7 * dice(n * 13))[n];
    b.beginPath(); b.ellipse(m[0], m[1], 6 * size[n], 2 * size[n], 0, 0, 7); b.fill();
  }
  var rim = 8, wall = 14, merlon = 18;                   // the battlements on the river's edge: a parapet, its merlons
  for (n = 0; n < steps; n++) {                          // far to near, so the nearer stand in front
    var s0 = size[n], s1 = size[n + 1], up = (Math.floor(n / 3) % 2) ? merlon : 0;
    var a0 = [right[n][0] - rim * s0, right[n][1]], a1 = [right[n + 1][0] - rim * s1, right[n + 1][1]];
    var h0 = (wall + up) * s0, h1 = (wall + up) * s1;
    b.fillStyle = "#a35a3e";                             // its inner face, toward the walkway
    b.beginPath(); b.moveTo(a0[0], a0[1]); b.lineTo(a1[0], a1[1]); b.lineTo(a1[0], a1[1] - h1); b.lineTo(a0[0], a0[1] - h0); b.closePath(); b.fill();
    b.fillStyle = "#d6a07a";                             // its top, lit
    b.beginPath(); b.moveTo(a0[0], a0[1] - h0); b.lineTo(a1[0], a1[1] - h1);
    b.lineTo(a1[0] + rim * s1, a1[1] - h1 - 2 * s1); b.lineTo(a0[0] + rim * s0, a0[1] - h0 - 2 * s0); b.closePath(); b.fill();
    if (up && !(Math.floor((n + 1) / 3) % 2)) {          // the near end of a merlon, square to the walkway
      b.fillStyle = "#b8694a";
      b.beginPath(); b.moveTo(a1[0], a1[1] - wall * s1); b.lineTo(a1[0], a1[1] - h1);
      b.lineTo(a1[0] + rim * s1, a1[1] - h1 - 2 * s1); b.lineTo(a1[0] + rim * s1, a1[1] - wall * s1 - 2 * s1); b.closePath(); b.fill();
    }
    b.strokeStyle = "rgba(60, 28, 16, 0.3)";             // a course line along the parapet
    b.beginPath(); b.moveTo(a0[0], a0[1] - h0 * 0.5); b.lineTo(a1[0], a1[1] - h1 * 0.5); b.stroke();
  }
  b.strokeStyle = "rgba(50, 30, 20, 0.5)";               // the walkway's inner edge, and the inner face's foot
  b.lineWidth = 1.5;
  stroke(left);
  stroke(ground);
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
// The rampart behind the town in 3D, as the bank's wall (owner, 2026-10-26, of scene 2: "yes", to the plan), seen from
// inside the town a little from above, on a sheet (b): its battlements on the outer edge, their tops from y "top", the
// walkway along its top, its inner face of brick down to y "foot", courses and joints, in shade at its foot. The court
// (scene 2) and the lane (scene 6). e.g. cngRampart(b, 512, 710);
function cngRampart(b, top, foot) {
  var n, k;
  for (n = 0; n < WIDE; n += 34) {                       // the merlons on the outer edge, their faces toward the town
    b.fillStyle = "#a35a3e"; b.fillRect(n, top + 4, 20, 24);
    b.fillStyle = "#d6a07a"; b.fillRect(n, top, 20, 5);   // their tops, lit
  }
  b.fillStyle = "#a35a3e"; b.fillRect(0, top + 24, WIDE, 12);   // the parapet's inner face
  b.fillStyle = "#d6a07a"; b.fillRect(0, top + 22, WIDE, 3);
  var walk = b.createLinearGradient(0, top + 36, 0, top + 56);   // the walkway, seen from above
  walk.addColorStop(0, "#b8805c"); walk.addColorStop(1, "#c99670");
  b.fillStyle = walk; b.fillRect(0, top + 36, WIDE, 20);
  b.strokeStyle = "rgba(90, 50, 30, 0.3)"; b.lineWidth = 1;
  for (n = 0; n < WIDE; n += 26) { b.beginPath(); b.moveTo(n, top + 36); b.lineTo(n - 4, top + 56); b.stroke(); }
  csBand(b, 0, top + 56, WIDE, foot - top - 56, "#b5664a", "#93503a");   // the inner face of brick
  b.fillStyle = "rgba(255, 226, 190, 0.35)"; b.fillRect(0, top + 56, WIDE, 3);   // the light on its edge
  b.strokeStyle = "rgba(70, 30, 20, 0.32)";
  for (k = 0, n = top + 68; n < foot; n += 12, k++) {    // its courses, and the joints between the bricks
    b.beginPath(); b.moveTo(0, n); b.lineTo(WIDE, n); b.stroke();
    for (var j = (k % 2) * 17; j < WIDE; j += 34) { b.beginPath(); b.moveTo(j, n - 12); b.lineTo(j, n); b.stroke(); }
  }
  var shade = b.createLinearGradient(0, foot - 40, 0, foot);   // shade at its foot
  shade.addColorStop(0, "rgba(40, 20, 12, 0)"); shade.addColorStop(1, "rgba(40, 20, 12, 0.3)");
  b.fillStyle = shade; b.fillRect(0, foot - 40, WIDE, 40);
}

function cngCourt() {
  if (CNG_COURT) { return CNG_COURT; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), n;
  cngFar(b, 0, 560);                                     // the far range over the rampart
  cngRampart(b, 512, 710);                               // the rampart behind the town, in 3D
  // the court's trees painted as the hero film's are (thicket.js thkTreeOn()), in flower and fruit as a royal court's:
  // the golden shower, the frangipani, the mango
  [["ratchaphruek", 30, 14], ["frangipani", 30, 12], ["mango", 22, 14], ["ratchaphruek", 26, 14], ["frangipani", 26, 12], ["mango", 20, 14]].forEach(function (bloom, i) {
    thkTreeOn(b, 120 + i * 330 + 60 * dice(i + 20), 720, 0.3 + 0.08 * dice(i + 8), 51 + i, [bloom]);
  });
  csBand(b, 0, 700, WIDE, 380, "#c98a62", "#a8704e");    // the courtyard's brick paving, laid in courses, their joints
  b.strokeStyle = "rgba(110, 60, 40, 0.3)";              // staggered and closer far off
  var rows = [];
  for (n = 0; n < 16; n++) { rows.push(712 + n * n * 1.6 + n * 8); }
  rows.forEach(function (py, r) {
    b.beginPath(); b.moveTo(0, py); b.lineTo(WIDE, py); b.stroke();
    if (r + 1 >= rows.length) { return; }
    var brick = 30 + r * 7, low = rows[r + 1];
    for (var bx = (r % 2) * brick / 2; bx < WIDE + brick; bx += brick) {
      var lean = (bx - WIDE / 2) * 0.04;                 // the joints lean away from the middle, as a floor going off does
      b.beginPath(); b.moveTo(bx, py); b.lineTo(bx + lean * (low - py) / 40, low); b.stroke();
    }
  });
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
  var b = paper.getContext("2d");
  cngFar(b, 0, 560);                                     // the far range
  csBand(b, 0, 540, WIDE, 540, "#a9c97a", "#86a85a");    // the plain
  // the paddies painted (owner, 2026-10-26, of scene 2: "yes", to the fields as the hero film's paddy), field behind
  // field to the wall
  cngPaddies(b, 560, 14, WIDE);
  b.fillStyle = "#c9b285";                               // the road from the near fields to the gate's bridge
  b.beginPath(); b.moveTo(CNG_GATE[0] - 50, 790); b.lineTo(CNG_GATE[0] + 50, 790);
  b.lineTo(CNG_GATE[0] + 260, 1080); b.lineTo(CNG_GATE[0] - 260, 1080); b.closePath(); b.fill();
  b.fillRect(0, CNG_ROAD - 26, WIDE, 52);                // and the road along the wall, across the sheet
  b.fillStyle = "rgba(120, 100, 60, 0.25)";              // ruts down the road
  [-0.4, 0.4].forEach(function (side) {
    b.beginPath(); b.moveTo(CNG_GATE[0] + side * 60, 790); b.lineTo(CNG_GATE[0] + side * 60 + 3, 790);
    b.lineTo(CNG_GATE[0] + side * 300 + 12, 1080); b.lineTo(CNG_GATE[0] + side * 300, 1080); b.fill();
  });
  [[260, 760, 0.55, 3], [1520, 770, 0.6, 5]].forEach(function (c) { bamboo(b, c[0], c[1], c[2], c[3]); });   // bamboo by the fields
  thkTreeOn(b, 1760, 700, 0.28, 61, [["mango", 16, 14]]);   // a mango on a bund, as one stands at the edge of the fields
  CNG_FIELDS = paper;
  return paper;
}

// The wall with its gate, open 0 (shut) to 1, drawn with pen. e.g. cngGateWall(between(t, 3, 6));
function cngGateWall(open, t) {
  var s = CNG_GATE[2], wide = WIDE + 200;
  cityWall(pen, -100, CNG_GATE[1], wide, s, {open: open, t: t});
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
  // Painted as the scenery pass paints a place (owner, 2026-10-26, of scene 3: "yes" to a plan of 9): Chang Ngu's far
  // range; Doi Nang Non clothed in forest, flowers and fruit near its foot; the paddies in rows behind their bunds; the
  // Mae Sai a water; painted trees in fruit and flower; beds of flowers at the back of the ground; the fences' bamboo
  // grained, its lashings thin.
  cngFar(b, 0, 600);                                     // the far range, one line through both panels
  b.save(); b.translate(WIDE, 0); cngFar(b, WIDE, 600); b.restore();
  sceneryForest(b, cngNangNon, {right: 2 * WIDE, blooms: CNG_FOREST_BLOOMS, pines: 22, top: 380, foot: 900, haze: "#b6c8c4", seed: 5});
  csBand(b, 0, 740, 2 * WIDE, 340, "#a9c97a", "#86a85a"); // the paddies and the village ground
  cngPaddies(b, 748, 9, WIDE * 1.3);                      // the valley's paddies, to the village's edge
  cngStream(b);                                           // the Mae Sai, winding from the far hills to the near left
  b.fillStyle = "#d9c89a";                                // the path along it to the village
  b.beginPath(); b.moveTo(0, CNG_GROUND - 30); b.quadraticCurveTo(WIDE, CNG_GROUND - 50, 2 * WIDE, CNG_GROUND - 30);
  b.lineTo(2 * WIDE, CNG_GROUND + 40); b.quadraticCurveTo(WIDE, CNG_GROUND + 20, 0, CNG_GROUND + 40); b.closePath(); b.fill();
  // the valley's and the village's trees painted as the hero film's are (thicket.js thkTreeOn()), in fruit and flower:
  // longan, mango, the golden shower, the flame of the forest
  var fruit = [["longan", 26, 14], ["mango", 22, 14], ["ratchaphruek", 30, 14], ["thongkwao", 34, 14]];
  for (n = 0; n < 8; n++) { thkTreeOn(b, 160 + n * 420 + 80 * dice(n + 30), 790 + 20 * dice(n), 0.28 + 0.1 * dice(n + 31), 61 + n, [fruit[n % 4]]); }
  pen = b;                                               // beds of flowers at the back of the village's ground, behind
  [[WIDE + 120, 868, 491], [WIDE + 1100, 866, 493], [WIDE + 1480, 870, 495]].forEach(function (bed, k) {   // where people pass
    thkPlace(sceneryBush(200, 80, bed[2], THK_GREENS, [[["hibiscus", 10, 10, "#d93a2e"]], [["dokkaew", 16, 6]], [["phayasuea", 12, 8, "#ec6c9c"]]][k]), bed[0], bed[1], 1, 0);
  });
  pen = keep;
  [[WIDE + 260, 860, 0.55], [WIDE + 560, 840, 0.5], [WIDE + 1640, 850, 0.55]].forEach(function (h) { house(b, h[0], h[1], h[2]); });
  tub(b, WIDE + 820, 870, 0.7, {});
  longKhao(b, WIDE + 420, 900, 0.55, true);              // a granary
  house(b, CNG_HOUSE[0], CNG_HOUSE[1], CNG_HOUSE[2]);    // the headman's house
  pen = b;
  for (n = 0; n < 5; n++) { banana(b, WIDE + 100 + n * 360, 905 + 10 * dice(n + 40)); }
  floraTree(b, WIDE + 980, 880, 0.5, "papaya", 1);       // what grows by the houses (owner, 2026-10-25: "plants,
  thkTreeOn(b, CNG_HOUSE[0] + 260, 880, 0.26, 69, [["frangipani", 30, 12]]);   // flowers"): a papaya, a frangipani, marigolds
  pen = b;                                               // along the headman's house, a hibiscus by the granary
  for (n = 0; n < 6; n++) { flora("marigold", CNG_HOUSE[0] - 130 + n * 48, 906 + 4 * dice(n + 50), {size: 0.55, ground: false}); }
  flora("hibiscus", WIDE + 330, 902, {size: 0.7, ground: false});
  flora("hibiscus", WIDE + 1720, 896, {size: 0.65, ground: false});
  pen = keep;
  for (n = 0; n < 2; n++) {                              // the village's bamboo fences along the near ground: two rails
    var fx = WIDE + 40 + n * 1000, fy = 1010;            // and the posts, the bamboo grained, its nodes, the lashings thin
    [fy - 32, fy - 14].forEach(function (ry) { sceneryBambooGrain(f, fx, ry, 640, 5, {along: "x", nodes: [160, 330, 500], seed: n * 2 + ry}); });
    for (var p = 0; p <= 16; p++) {
      sceneryBambooGrain(f, fx + p * 40 - 3, fy - 46, 6, 46, {along: "y", nodes: [20], seed: p + n * 17});
      f.strokeStyle = "rgba(90, 64, 34, 0.8)";           // the lashing at each rail: a thin wrap or two
      f.lineWidth = 1;
      [fy - 30, fy - 12].forEach(function (ly) {
        f.beginPath(); f.moveTo(fx + p * 40 - 4, ly - 2); f.lineTo(fx + p * 40 + 4, ly + 1);
        f.moveTo(fx + p * 40 - 4, ly + 1); f.lineTo(fx + p * 40 + 4, ly + 4); f.stroke();
      });
    }
  }
  CNG_VILLAGE = {back: back, front: front};
  return CNG_VILLAGE;
}

// The flowers and fruit of the hills about Chiang Saen near a mountain's foot, for scenery.js sceneryForest(): near
// the top none, in the middle a little tiger's claw and golden orchid, near the foot tiger's claw and jasmine, the
// flame of the forest, the golden shower and longan in fruit.
var CNG_FOREST_BLOOMS = [[[], [], []],
                         [[["orchid", 3, 5, "#e8c23a"]], [], [["phayasuea", 3, 5, "#ec6c9c"]]],
                         [[["phayasuea", 18, 8, "#f07aa8"], ["jasmine", 14, 6]], [["thongkwao", 20, 9]], [["ratchaphruek", 6, 20], ["longan", 6, 12]]]];

// Paddies on a sheet (brush), field behind field from the y "top" down, "rows" of them, each a little greener or paler,
// its rice in rows, the bunds between them lit along their tops, all closer together far off; from x 0 to "right".
// Scene 2's fields and the village's valley. e.g. cngPaddies(b, 748, 9, WIDE * 1.3);
function cngPaddies(b, top, rows, right) {
  var lines = [], k;
  for (var n = 0; n <= rows; n++) { lines.push(top + n * 14 + n * n * 1.9); }
  b.save();
  b.beginPath(); b.rect(0, 0, right, 1080); b.clip();
  lines.forEach(function (y, r) {
    if (r + 1 >= lines.length) { return; }
    var low = lines[r + 1], deep = low - y;
    b.fillStyle = ["rgba(150, 190, 90, 0.35)", "rgba(110, 160, 70, 0.3)", "rgba(170, 200, 110, 0.3)"][r % 3];
    b.fillRect(0, y, right, deep);
    b.strokeStyle = "rgba(70, 110, 40, 0.5)";            // the rice in rows: short blades, larger near
    b.lineWidth = 0.6 + r * 0.12;
    for (k = 0; k < 3; k++) {
      var ry = y + deep * (0.3 + 0.25 * k), tall = 2 + r * 0.9, gap = 7 + r * 2.2;
      for (var x = (k % 2) * gap / 2 + 3 * dice(r * 9 + k); x < right; x += gap) {
        b.beginPath(); b.moveTo(x - tall * 0.3, ry - tall); b.lineTo(x, ry); b.lineTo(x + tall * 0.3, ry - tall); b.stroke();
      }
    }
    b.fillStyle = "#b9b07a";                             // the bund, its lit top and its shaded face
    b.fillRect(0, low - 2 - r * 0.25, right, 2 + r * 0.25);
    b.fillStyle = "rgba(70, 80, 40, 0.3)";
    b.fillRect(0, low, right, 1 + r * 0.2);
  });
  b.restore();
}

// The Mae Sai on the village's back sheet (brush), painted as a water (the scenery pass, 2026-10-26): a stream winding
// from the far hills to the near left, the sky pale in it far off and deeper near, the banks' green mirrored along its
// edges, light lying along the current, its banks dark where they are wet, grass and reeds along them.
// e.g. cngStream(b);
function cngStream(b) {
  var s = CNG_STREAM, keep = pen, k;
  function bed() {
    b.beginPath(); b.moveTo(s[0] + 500, s[1]); b.quadraticCurveTo(s[0] + 240, 880, s[0] - 80, 1080);
    b.lineTo(s[0] + 260, 1080); b.quadraticCurveTo(s[0] + 380, 880, s[0] + 540, s[1]); b.closePath();
  }
  var water = b.createLinearGradient(0, s[1], 0, 1080);
  water.addColorStop(0, "#c4dcd4"); water.addColorStop(0.4, "#86b0aa"); water.addColorStop(1, "#4f7f7a");
  b.save();
  bed(); b.fillStyle = water; b.fill();
  b.clip();
  b.lineWidth = 22;                                      // the banks' green mirrored along both edges, and their wet dark
  b.strokeStyle = "rgba(48, 86, 52, 0.35)"; bed(); b.stroke();
  b.lineWidth = 6;
  b.strokeStyle = "rgba(40, 52, 36, 0.4)"; bed(); b.stroke();
  b.lineCap = "round";                                   // the light along the current
  for (k = 0; k < 26; k++) {
    var u = dice(k * 3 + 7), y = s[1] + 10 + u * (1080 - s[1]), mid = s[0] + 520 - 300 * Math.pow(u, 1.1) - 30;
    b.strokeStyle = "rgba(240, 248, 244, " + (0.2 + 0.3 * dice(k)).toFixed(2) + ")";
    b.lineWidth = 0.8 + 2 * u;
    b.beginPath(); b.moveTo(mid - 30 * u - 10, y); b.lineTo(mid + 10 + 50 * u * dice(k + 5), y - 6 * u); b.stroke();
  }
  b.restore();
  pen = b;                                               // grass and reeds along its banks
  for (k = 0; k < 7; k++) {
    var t = k / 6, ly = mix(s[1] + 10, 1060, t), lx = mix(s[0] + 500, s[0] - 80, Math.pow(t, 0.8)), rx = mix(s[0] + 540, s[0] + 260, Math.pow(t, 0.8));
    thkPlace(sceneryGrass(30 + 70 * t, 9, 501 + k), lx - 6, ly, 1, 0);
    thkPlace(sceneryGrass(28 + 60 * t, 8, 511 + k), rx + 6, ly, 1, 0);
  }
  sceneryReeds(s[0] + 330, 1000, 0.55, 0, "back");
  sceneryReeds(s[0] + 330, 1000, 0.55, 0, "front");
  pen = keep;
}

// The life of a village yard by day (owner, 2026-10-25: "decorate it with birds, animals ... as appropriate"; decorate.js):
// a rooster and two hens about (x, y), their feet there, each pecking where it stands, then a few steps and pecking
// again, all through a scene of up to 60 s; seed turns where each goes, so two scenes' yards are not alike. Drawn
// behind the people (decorate(t, yard, "back") before the scene's drawByZ): they are further off, and smaller.
// Gives back a life list for decorate(). e.g. decorate(t, cngYard(1450, 870, 3), "back");
function cngYard(x, y, seed) {
  var bird = function (k, kind, look) {
    var stops = [], at = 0, px = x + (k - 1) * 110 + 30 * dice(seed * 7 + k), py = y + 8 * (k % 2);
    for (var n = 0; at < 60; n++) {
      stops.push([at, px, py, "peck"]);
      at += 2.5 + 3 * dice(seed * 13 + k * 5 + n);
      stops.push([at, px, py]);
      px += (dice(seed * 17 + k * 3 + n) - 0.5) * 140;
      px = Math.max(x - 220, Math.min(x + 220, px));
      at += 1.2 + dice(seed * 19 + k + n);
    }
    stops.push([at, px, py]);
    return {name: kind + " of the yard " + k, kind: kind, layer: "back", look: look, course: stops};
  };
  return [bird(0, "rooster", {}), bird(1, "hen", {}), bird(2, "hen", {})];
}

// ---------- a person measured, and a person carrying ----------
// Where a person's joints are, without drawing them where they are seen (maeng/sets.js's maengMeasure, the kit's way):
// on a scratch sheet, under an id of its own. x, y, look as person() takes them; gives back person()'s joints.
// e.g. var shoulder = cngMeasure(700, 930, look).shoulderB;
// A forge's yard (scenes 9 and 11), painted once for each forge (the scenery pass, 2026-10-26): the beaten earth with
// bits of charcoal, pebbles and the marks of feet in it, dark under the forge at f ([x, base, size], or null for a yard
// with no forge: scene 17's); mat: true for the
// weapons' mat, woven of reed, over and under. Gives back the sheet. e.g. pen.drawImage(cngForgeGround(C09_FORGE, true), 0, 0);
var CNG_FORGE_GROUND = {};
function cngForgeGround(f, mat) {
  var key = (f ? f.join(" ") : "yard") + (mat ? " mat" : "");
  if (CNG_FORGE_GROUND[key]) { return CNG_FORGE_GROUND[key]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), n;
  csBand(b, 0, 800, WIDE, 280, "#b9a070", "#9a8058");   // the beaten ground of the forge's yard
  if (f) {
    var under = b.createRadialGradient(f[0], f[1], 20, f[0], f[1], 420);   // dark with soot under the forge
    under.addColorStop(0, "rgba(50, 36, 24, 0.45)"); under.addColorStop(1, "rgba(50, 36, 24, 0)");
    b.save(); b.translate(f[0], f[1]); b.scale(1, 0.3); b.translate(-f[0], -f[1]);
    b.fillStyle = under; b.fillRect(f[0] - 420, f[1] - 420, 840, 840);
    b.restore();
  }
  for (n = 0; n < 260; n++) {                            // charcoal, pebbles, the marks of feet
    var x = dice(n * 3 + 1) * WIDE, y = 806 + Math.pow(dice(n * 5 + 2), 0.8) * 270, near = (y - 800) / 280;
    var kind = n % 5;
    b.fillStyle = kind === 0 ? "rgba(40, 32, 28, 0.7)" : kind < 3 ? ["#8e826c", "#a89a80"][kind - 1] : "rgba(110, 90, 60, 0.25)";
    b.beginPath();
    if (kind < 3) { b.ellipse(x, y, (1.5 + 2.5 * dice(n)) * (0.6 + near), (1 + 1.5 * dice(n + 7)) * (0.6 + near), 0, 0, 7); }
    else { b.ellipse(x, y, (8 + 4 * dice(n)) * (0.5 + near), (3 + dice(n)) * (0.5 + near), 0.2 * (dice(n + 3) - 0.5), 0, 7); }
    b.fill();
  }
  if (!mat) { CNG_FORGE_GROUND[key] = paper; return paper; }
  b.save();                                              // the mat, woven
  b.beginPath(); b.rect(140, 860, 420, 50); b.clip();
  for (n = 0; n < 24; n++) {
    for (var j = 0; j < 4; j++) {
      b.fillStyle = (n + j) % 2 ? "#d2ba84" : "#b89e68";
      b.fillRect(140 + n * 18, 860 + j * 12.5, 18, 12.5);
    }
  }
  b.restore();
  b.strokeStyle = "#9a7a44"; b.lineWidth = 3; b.strokeRect(140, 860, 420, 50);
  CNG_FORGE_GROUND[key] = paper;
  return paper;
}

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
  var b = paper.getContext("2d"), n, night = kind === "night", keep = pen;
  var w = CNG_WINDOW;
  // Painted as the scenery pass paints a place (owner, 2026-10-26, of scene 5: "yes" to a plan of 6): through the
  // window Chang Ngu's range and Doi Nang Non's forest, a frangipani painted in flower; the teak boards, the beam and
  // the floor each with its grain; the window's light lying on the floor in bars (the moon's at night); the mat woven.
  b.drawImage(cngSky(night ? "night" : "day"), 0, 0);    // through the window: the sky, the mountains, the yard's trees
  cngFar(b, 0, w[1] + w[3] - 60);
  sceneryForest(b, function (x) { return w[1] + w[3] - 120 - 40 * Math.sin(x * 0.006) - 20 * Math.sin(x * 0.017); },
                {left: w[0] - 200, right: w[0] + w[2] + 200, pines: 4, top: w[1] + 120, foot: w[1] + w[3] + 60, haze: "#b6c8c4", blooms: CNG_FOREST_BLOOMS, seed: 9});
  b.fillStyle = "#9cbf6e";
  b.fillRect(w[0], w[1] + w[3] - 40, w[2], 40);
  if (night) {                                           // the night through the window: the same, dark and blue
    b.fillStyle = "rgba(10, 16, 44, 0.72)";
    b.fillRect(w[0], w[1], w[2], w[3]);
  }
  // The yard through the window (owner, 2026-10-25: "outside the house add natural items as decorations"): a
  // frangipani in flower, the ta laew on its post that keeps the house, a bougainvillea at the sill. The walls go over
  // them, so only what is in the window shows.
  thkTreeOn(b, w[0] + 90, w[1] + w[3] - 6, 0.24, 71, [["frangipani", 30, 12]]);
  taLaew(b, w[0] + 260, w[1] + w[3] - 18, 0.6, {points: 8});
  floraTree(b, w[0] + w[2] - 50, w[1] + w[3] + 10, 0.45, "bougainvillea", 3);
  b.save();                                              // the walls round the window: boards of teak, each grained
  b.beginPath(); b.rect(0, 0, WIDE, CNG_FLOOR); b.rect(w[0] + w[2], w[1], -w[2], w[3]); b.clip("evenodd");
  var boards = night ? ["#4a3222", "#44301f", "#503626"] : ["#a8784a", "#9e7044", "#b07e50"];
  for (n = 0; n < WIDE; n += 64) {
    b.fillStyle = boards[(n / 64) % 3];
    b.fillRect(n, 0, 64, CNG_FLOOR);
    sceneryWoodGrain(b, n, 0, 64, CNG_FLOOR, {along: "y", seed: n / 64 + 1, knots: (n / 64) % 5 === 2 ? 1 : 0,   // a knot now and then
                     dark: night ? "20, 10, 4" : undefined});
    b.fillStyle = night ? "rgba(120, 90, 60, 0.18)" : "rgba(255, 220, 170, 0.22)";   // the board's edge lit, and the next
    b.fillRect(n, 0, 3, CNG_FLOOR);                                                  // one's in shade
    b.fillStyle = night ? "rgba(10, 4, 0, 0.5)" : "rgba(60, 34, 16, 0.45)";
    b.fillRect(n + 61, 0, 3, CNG_FLOOR);
  }
  b.restore();
  b.strokeStyle = night ? "#2a1a10" : "#6a4626"; b.lineWidth = 10;   // the window's frame and its bars
  b.strokeRect(w[0], w[1], w[2], w[3]);
  b.lineWidth = 5;
  for (n = 1; n < 6; n++) { b.beginPath(); b.moveTo(w[0] + n * w[2] / 6, w[1]); b.lineTo(w[0] + n * w[2] / 6, w[1] + w[3]); b.stroke(); }
  b.fillStyle = night ? "#2a1a10" : "#6a4626";            // the beam across, grained, and the rafters over it
  b.fillRect(0, CNG_BEAM - 22, WIDE, 30);
  sceneryWoodGrain(b, 0, CNG_BEAM - 22, WIDE, 30, {along: "x", seed: 31, knots: 3});
  for (n = 0; n < WIDE; n += 180) {
    b.fillStyle = night ? "#2a1a10" : "#6a4626";
    b.beginPath(); b.moveTo(n, 0); b.lineTo(n + 40, 0); b.lineTo(n + 120, CNG_BEAM - 22); b.lineTo(n + 80, CNG_BEAM - 22); b.closePath(); b.fill();
    b.fillStyle = night ? "rgba(120, 90, 60, 0.2)" : "rgba(255, 220, 170, 0.25)";   // its lit edge
    b.beginPath(); b.moveTo(n, 0); b.lineTo(n + 6, 0); b.lineTo(n + 86, CNG_BEAM - 22); b.lineTo(n + 80, CNG_BEAM - 22); b.closePath(); b.fill();
  }
  csBand(b, 0, CNG_FLOOR, WIDE, 1600 - CNG_FLOOR, night ? "#5a3e28" : "#b88a58", night ? "#2a1a10" : "#7a5430");   // the floor
  var planks = [];
  for (n = 0; n < 12; n++) { planks.push(CNG_FLOOR + 8 + n * n * 3 + n * 6); }
  planks.forEach(function (fy, k) {                      // plank by plank, grained, their joints
    if (k + 1 < planks.length) { sceneryWoodGrain(b, 0, fy, WIDE, planks[k + 1] - fy, {along: "x", seed: 40 + k, knots: k % 3 === 1 ? 1 : 0, dark: night ? "20, 10, 4" : undefined}); }
    b.strokeStyle = night ? "rgba(20, 10, 4, 0.5)" : "rgba(80, 50, 24, 0.45)"; b.lineWidth = 2;
    b.beginPath(); b.moveTo(0, fy); b.lineTo(WIDE, fy); b.stroke();
  });
  // The window's light lying on the floor (the sun high at the right by day, the moon at night): the window's shape
  // thrown down and to the left, its bars dark across it, and a faint shaft of it in the air.
  var lit = night ? "170, 190, 255" : "255, 222, 160", strength = night ? 0.14 : 0.3;
  var patch = [[w[0] - 380, CNG_FLOOR + 30], [w[0] - 380 + w[2], CNG_FLOOR + 30], [w[0] - 260 + w[2], CNG_FLOOR + 150], [w[0] - 260, CNG_FLOOR + 150]];
  b.save();
  b.globalCompositeOperation = "lighter";
  b.fillStyle = "rgba(" + lit + ", " + (strength * 0.25).toFixed(3) + ")";   // the shaft
  b.beginPath(); b.moveTo(w[0], w[1]); b.lineTo(w[0] + w[2], w[1]); b.lineTo(patch[2][0], patch[2][1]); b.lineTo(patch[3][0], patch[3][1]); b.closePath(); b.fill();
  b.fillStyle = "rgba(" + lit + ", " + strength.toFixed(3) + ")";
  for (n = 0; n < 6; n++) {                              // the light between the bars
    var u0 = n / 6 + 0.012, u1 = (n + 1) / 6 - 0.012;
    var p0 = [mix(patch[0][0], patch[1][0], u0), patch[0][1]], p1 = [mix(patch[0][0], patch[1][0], u1), patch[0][1]];
    var p2 = [mix(patch[3][0], patch[2][0], u1), patch[2][1]], p3 = [mix(patch[3][0], patch[2][0], u0), patch[2][1]];
    b.beginPath(); b.moveTo(p0[0], p0[1]); b.lineTo(p1[0], p1[1]); b.lineTo(p2[0], p2[1]); b.lineTo(p3[0], p3[1]); b.closePath(); b.fill();
  }
  b.restore();
  b.save();                                              // a mat of woven reed on the floor, strips over and under
  b.beginPath(); b.ellipse(760, CNG_FLOOR + 70, 420, 54, 0, 0, 7); b.clip();
  var cell = 18;
  for (n = -60; n < 60; n++) {
    for (var j = -6; j < 6; j++) {
      var over = (n + j) % 2 === 0;
      b.fillStyle = night ? (over ? "#6e5e3e" : "#5e4e32") : (over ? "#d2ba84" : "#b89e68");
      b.fillRect(760 + n * cell, CNG_FLOOR + 70 + j * cell * 0.3, cell, cell * 0.3);
      b.strokeStyle = night ? "rgba(30, 20, 8, 0.35)" : "rgba(120, 90, 40, 0.35)"; b.lineWidth = 0.8;
      b.strokeRect(760 + n * cell, CNG_FLOOR + 70 + j * cell * 0.3, cell, cell * 0.3);
    }
  }
  b.restore();
  b.strokeStyle = night ? "#4a3a22" : "#9a7a44"; b.lineWidth = 4;   // its bound edge
  b.beginPath(); b.ellipse(760, CNG_FLOOR + 70, 420, 54, 0, 0, 7); b.stroke();
  // The house's own things (owner, 2026-10-25: "Add some decorations to the house"): a woven sin hung over a bamboo
  // rail on the far wall, the rice basket and a basket on the floor under the window, bananas hung from the beam.
  b.strokeStyle = night ? "#3a2a14" : "#c9a45a"; b.lineWidth = 8;
  b.beginPath(); b.moveTo(70, 440); b.lineTo(420, 440); b.stroke();   // the rail
  var stripes = night ? ["#5a2a2a", "#2a2a4a", "#4a3a2a"] : ["#b8294a", "#2a4a7a", "#e0b23a", "#5a2a5a"];
  for (n = 0; n < 16; n++) {                             // a sin, a tube skirt, hung to air: stripes, then its hem of jok
    b.fillStyle = stripes[n % stripes.length];
    b.fillRect(120, 446 + n * 14, 250, 14);
  }
  b.fillStyle = night ? "#3a2a1a" : "#2a1a14"; b.fillRect(120, 670, 250, 34);
  b.fillStyle = night ? "#6a5a30" : "#e0b23a";
  for (n = 0; n < 12; n++) { b.beginPath(); b.moveTo(126 + n * 20, 687); b.lineTo(136 + n * 20, 677); b.lineTo(146 + n * 20, 687); b.lineTo(136 + n * 20, 697); b.closePath(); b.fill(); }
  kongKhao(b, 1490, CNG_FLOOR + 14, 0.9);                 // under the window, where the camera sees them
  krabung(b, 1585, CNG_FLOOR + 18, 0.9);
  b.strokeStyle = night ? "#2a1a10" : "#5a3a1e"; b.lineWidth = 3;
  b.beginPath(); b.moveTo(1120, CNG_BEAM + 8); b.lineTo(1120, CNG_BEAM + 70); b.stroke();
  bananas(b, 1120, CNG_BEAM + 70, 1.0, {count: 4, ripe: 0.9});
  if (night) {                                            // the dark of the room's corners
    var dark = b.createRadialGradient(760, CNG_FLOOR, 200, 760, CNG_FLOOR, 1200);
    dark.addColorStop(0, "rgba(0, 0, 0, 0)"); dark.addColorStop(1, "rgba(0, 0, 10, 0.6)");
    b.fillStyle = dark; b.fillRect(0, 0, WIDE, 1080);
  }
  pen = keep;
  CNG_ROOM[kind] = paper;
  return paper;
}

// Motes of dust drifting in the window's light at second t (the scenery pass's air for a room by day, 2026-10-26):
// small specks in the shaft from the window to the floor, drifting slowly down and to the left, catching the light now
// and then. Draws with pen, in the room's own pixels. e.g. cngMotes(t);
function cngMotes(t) {
  var w = CNG_WINDOW;
  pen.save();
  pen.globalCompositeOperation = "lighter";
  for (var n = 0; n < 26; n++) {
    var u = ((dice(n * 3 + 1) + t * (0.01 + 0.01 * dice(n))) % 1), side = dice(n * 7 + 2);
    var x = mix(w[0] + side * w[2], w[0] - 320 + side * w[2], u) + 8 * Math.sin(t * 0.5 + n);
    var y = mix(w[1] + 20, CNG_FLOOR + 60, u);
    var a = 0.55 * Math.max(0, Math.sin(t * (0.6 + 0.5 * dice(n + 4)) + n * 2.3));
    pen.fillStyle = "rgba(255, 236, 200, " + a.toFixed(3) + ")";
    pen.beginPath(); pen.arc(x, y, 1.4 + 1.6 * dice(n + 9), 0, 7); pen.fill();
  }
  pen.restore();
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
  var b = paper.getContext("2d"), n, keep = pen, dawn = kind === "dawn";
  // Painted as the scenery pass paints a place (2026-10-26, scene 6): Chang Ngu's range in the light of the hour, the
  // rampart behind in 3D as the court's, painted trees in flower, flowers at the houses' feet, grass along the lane.
  cngFar(b, 0, 560, dawn ? "dawn" : undefined);
  cngRampart(b, 504, 660);
  var blooms = [["ratchaphruek", 28, 14], ["mango", 20, 14], ["frangipani", 28, 12], ["longan", 24, 14]];
  for (n = 0; n < 7; n++) { thkTreeOn(b, 60 + n * 300 + 50 * dice(n + 60), 680, 0.26 + 0.07 * dice(n + 61), 81 + n, [blooms[n % 4]]); }
  csBand(b, 0, 660, WIDE, 420, "#b9a070", "#9a8058");    // the ground
  pen = b;
  [[260, 880, 0.7], [760, 870, 0.66], [1300, 880, 0.72], [1760, 870, 0.64]].forEach(function (h, k) {
    house(b, h[0], h[1], h[2]);
    [[-0.36, ["hibiscus", "marigold", "dokkaew", "jasmine"][k]], [0.38, ["tahern", "hibiscus", "marigold", "dokkaew"][k]]].forEach(function (f) {
      flora(f[1], h[0] + f[0] * 380 * h[2], h[1] + 4, {size: 0.42 * h[2], ground: false});   // flowers at the house's feet
    });
  });
  pen = keep;
  b.fillStyle = "#c9b285";                               // the lane
  b.beginPath(); b.moveTo(0, CNG_LANE_Y - 40); b.lineTo(WIDE, CNG_LANE_Y - 50); b.lineTo(WIDE, CNG_LANE_Y + 70); b.lineTo(0, CNG_LANE_Y + 80); b.closePath(); b.fill();
  b.fillStyle = "rgba(140, 116, 70, 0.25)";              // its ruts
  [CNG_LANE_Y - 12, CNG_LANE_Y + 30].forEach(function (y) { b.fillRect(0, y, WIDE, 4); });
  pen = b;                                               // grass along its edges
  for (n = 0; n < 16; n++) {
    thkPlace(sceneryGrass(30 + 30 * dice(n), 8, 521 + n), 60 + n * 120 + 40 * dice(n + 3), CNG_LANE_Y - 40 + (n % 2 ? 0 : 124), 1, 0);
  }
  pen = keep;
  if (dawn) {
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
var CNG_KUKAEO = {};                                 // painted once for each light (day, dusk)
var CNG_CHEDI = [1060, 470, 0.95];
var CNG_KUKAEO_TREE = [420, 960];

// The hill's top edge at x: gives back y. Its crown is broad and flat for 220 either side of the chedi, so the whole of
// the clearing round it sits on the hill (owner, 2026-10-25: "make the mountain bigger so the circle the temple sits
// on is on the hill"; it ran past the hill's sides). e.g. var y = cngKuKaeoRidge(1060);
function cngKuKaeoRidge(x) {
  var off = Math.max(0, Math.abs(x - 1060) - 220);
  return 448 + 0.00062 * off * off - 6 * Math.sin(x * 0.015);
}
function cngKuKaeo(light) {
  var key = light || "day";
  if (CNG_KUKAEO[key]) { return CNG_KUKAEO[key]; }
  var paper = document.createElement("canvas");
  paper.width = WIDE;
  paper.height = 1080;
  var b = paper.getContext("2d"), keep = pen, n;
  // Painted as the scenery pass paints a place (2026-10-26, scene 7): Chang Ngu's range in the light of the hour, the
  // hill clothed in forest (scenery.js sceneryForest()), flowers near its foot; the great tree painted; a frangipani in
  // flower by the chedi; the path's edges grassy, stones along it.
  cngFar(b, 0, 700, light === "dusk" ? "dusk" : undefined);
  sceneryForest(b, cngKuKaeoRidge, {left: -100, right: WIDE + 100, blooms: CNG_FOREST_BLOOMS, pines: 10, top: 450, foot: 1000,
                                    haze: "#b6c0c8", seed: 13});
  function path(u) {                                     // a point along the path, u from its foot (0) to the chedi (1)
    var a2 = u < 0.6, v = a2 ? u / 0.6 : (u - 0.6) / 0.4, p0 = a2 ? [200, 1080] : [820, 680], p1 = a2 ? [700, 820] : [940, 560];
    var p2 = a2 ? [820, 680] : [CNG_CHEDI[0] - 30, CNG_CHEDI[1] + 10], w = 1 - v;
    return [w * w * p0[0] + 2 * w * v * p1[0] + v * v * p2[0], w * w * p0[1] + 2 * w * v * p1[1] + v * v * p2[1]];
  }
  b.strokeStyle = "#c9b285";                             // the path up to the chedi
  b.lineWidth = 16;
  b.lineCap = "round";
  b.beginPath(); b.moveTo(200, 1080); b.quadraticCurveTo(700, 820, 820, 680); b.quadraticCurveTo(940, 560, CNG_CHEDI[0] - 30, CNG_CHEDI[1] + 10); b.stroke();
  b.lineCap = "butt";
  for (n = 0; n < 60; n++) {                             // its edges: grass leaning over it, and stones in it
    var q = path(n / 60), wide = 9 * (1 - 0.5 * n / 60);
    b.strokeStyle = "rgba(70, 110, 50, 0.7)"; b.lineWidth = 1.5;
    [-1, 1].forEach(function (side) {
      b.beginPath(); b.moveTo(q[0] + side * wide, q[1] + 2); b.lineTo(q[0] + side * (wide - 4) + 3 * dice(n), q[1] - 6 - 4 * dice(n + side)); b.stroke();
    });
    if (n % 4 === 1) { b.fillStyle = ["#a89a80", "#8e826c"][n % 2]; b.beginPath(); b.ellipse(q[0] + 4 * (dice(n) - 0.5), q[1], 3 * (1 - 0.4 * n / 60), 2, 0, 0, 7); b.fill(); }
  }
  b.fillStyle = "#c9b285";                               // the clearing round the chedi
  b.beginPath(); b.ellipse(CNG_CHEDI[0], CNG_CHEDI[1] + 12, 170, 22, 0, 0, 7); b.fill();
  thkTreeOn(b, CNG_CHEDI[0] + 200, CNG_CHEDI[1] + 16, 0.16, 93, [["frangipani", 30, 12]]);   // a frangipani by the chedi
  bdChedi(b, CNG_CHEDI[0], CNG_CHEDI[1], CNG_CHEDI[2]);
  csBand(b, 0, 960, WIDE, 120, "#93ab5e", "#6f8c44");    // the ground at the hill's foot
  thkTreeOn(b, CNG_KUKAEO_TREE[0], CNG_KUKAEO_TREE[1], 0.75, 91, []);   // the great tree, painted as the hero film's trees are
  if (light === "dusk") {                                // the hill in the dusk's warm light
    b.globalCompositeOperation = "source-atop";
    b.fillStyle = "rgba(240, 130, 80, 0.14)";
    b.fillRect(0, 0, WIDE, 1080);
    b.globalCompositeOperation = "source-over";
  }
  pen = keep;
  CNG_KUKAEO[key] = paper;
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
    [-1, -0.33, 0.33, 1].forEach(function (k, n) {      // the posts, grained (the scenery pass, 2026-10-26)
      brush.fillStyle = "#6a4a2a"; brush.fillRect(x + k * wide / 2 - 10 * s, base - tall - 40 * s, 20 * s, tall);
      sceneryWoodGrain(brush, x + k * wide / 2 - 10 * s, base - tall - 40 * s, 20 * s, tall, {along: "y", seed: 60 + n, knots: n % 2});
    });
    brush.fillStyle = "#b8975a";                           // the thatch, its ragged eaves
    brush.beginPath(); brush.moveTo(x - wide / 2 - 70 * s, base - tall + 30 * s); brush.lineTo(x, base - tall - 210 * s);
    brush.lineTo(x + wide / 2 + 70 * s, base - tall + 30 * s); brush.closePath(); brush.fill();
    brush.save();                                          // laid in rows of bundles, each row's lower edge lit, its strands
    brush.clip();                                          // running down the slope
    for (var r = 0; r < 9; r++) {
      var ry = base - tall - 210 * s + (r + 1) * (240 * s) / 9;
      brush.fillStyle = r % 2 ? "rgba(140, 108, 54, 0.35)" : "rgba(226, 196, 130, 0.3)";
      brush.fillRect(x - wide, ry - 12 * s, 2 * wide, 10 * s);
      brush.strokeStyle = "rgba(120, 90, 44, 0.45)"; brush.lineWidth = 1;
      for (var q = -wide; q < wide; q += 9 * s) {
        brush.beginPath(); brush.moveTo(x + q + 4 * dice(q + r), ry - 26 * s); brush.lineTo(x + q + (q > 0 ? 6 : -6) * s, ry); brush.stroke();
      }
    }
    brush.restore();
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
