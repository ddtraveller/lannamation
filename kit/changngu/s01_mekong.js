// s01_mekong.js - scene 1 of the film of Chang Ngu: the Mae Khong at Chiang Saen, at dawn (30 s). Out of the dark,
// the wide brown river in the dry season, mist on the far bank's hills, a sandbar with its khrai nam and its birds,
// ducks on the water; the title; the voice begins the tale; the camera pans slowly left along the river to Yonok on its
// bank, its roofs, its great chedi and, far off, its north rampart running down to the water (no wall along the river:
// the Mae Khong was the city's moat on that side).
var C01_LONG = 33.3;
// Its sounds (sounds.py, laid in by the film's music as a life's calls are): the river's birds at dawn.
var C01_SOUND = {calls: [[0, "crickets", 0.25, 8]]};
var C01_LINES = [[9.0, 13.92, "C001"], [14.12, 20.82, "C002"], [21.02, 26.28, "C003"], [26.48, 31.81, "C004"]];
// Its life (decorate.js; owner, 2026-10-25: "decorate it with birds, animals, fish ..."), before the voice begins at
// 9 s: a flock high across the dawn from the right, an egret low over the water from the left, a barb that leaps by
// the sandbar. The sky's are on the frame (C01_SKY_LIFE, drawn with the clouds), the river's on the pan (C01_LIFE).
var C01_SKY_LIFE = [
  {name: "flock at dawn", kind: "flock", layer: "back", course: [[1.5, 2150, 230], [8.8, -320, 170]]}
];
var C01_LIFE = [                                         // over the water, so drawn after the river (the pan is still at 0)
  {name: "egret over the river", kind: "egret", layer: "back", look: {fly: true, size: 0.8, seed: 2}, course: [[1.0, -120, 700], [8.6, 2100, 670]]},
  {name: "barb", kind: "fish", layer: "back", look: {size: 1.1},
   course: [[3.0, 640, 712, "hide"], [5.0, 640, 712], [5.8, 760, 712, "hide"], [6.6, 760, 712], [7.3, 680, 712, "hide"], [40, 680, 712, "hide"]]}
];

// The titles over the river (as maeng/s01_doi.js's): the series, Lanna Tales (นิทานล้านนา), in the Lanna script, gold;
// then the tale's name, ตำนานช้างงู, in the Lanna script, with its English small beneath. Both written by the Kam
// Mueang alphabet's own reader (watdonchan HTML/kammuang_alphabet_assets/alphabet.js, KMA.lanna(), 2026-10-23), which
// gives the series exactly as the first tale has it; not yet checked by a native speaker or a reader of the script.
var C01_SERIES = "ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ";                     // นิทานล้านนา, Lanna Tales
var C01_STORY = "ᨲᩣᩴᨶᩣ᩠ᨶᨩ᩶ᩣ᩠ᨦᨦᩪ";                   // ตำนานช้างงู, the tale of Chang Ngu

// t: the scene's second (seen from 1.6 s to 8.2 s). Gives back nothing: it writes the titles with pen over the whole
// sheet, with no camera. e.g. c01Title(t);
function c01Title(t) {
  var series = between(t, 1.6, 2.8) * (1 - between(t, 7.2, 8.2)), story = between(t, 3.6, 4.8) * (1 - between(t, 7.2, 8.2));
  if (series <= 0) { return; }
  pen.save();
  pen.textAlign = "center";
  pen.shadowColor = "rgba(255, 196, 90, 0.7)";
  var gold = pen.createLinearGradient(0, 180, 0, 440);
  gold.addColorStop(0, "#fff1c0");
  gold.addColorStop(0.5, "#e8b84a");
  gold.addColorStop(1, "#b07a22");
  pen.fillStyle = gold;
  pen.globalAlpha = series;
  pen.shadowBlur = 22;
  pen.font = "700 92px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
  pen.fillText(C01_SERIES, WIDE / 2, 250);
  pen.shadowBlur = 8;
  pen.strokeStyle = "rgba(255, 230, 170, 0.8)";
  pen.lineWidth = 2;
  var reach = 260 * between(t, 2.2, 3.8);
  pen.beginPath();
  pen.moveTo(WIDE / 2 - reach, 312); pen.quadraticCurveTo(WIDE / 2, 322, WIDE / 2 + reach, 312);
  pen.stroke();
  if (story > 0) {
    pen.globalAlpha = story;
    pen.shadowBlur = 26;
    pen.font = "700 124px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
    pen.fillText(C01_STORY, WIDE / 2, 440);
    pen.shadowBlur = 0;
    pen.font = "italic 42px " + LETTERS_LATIN + ", 'Times New Roman', serif";
    pen.fillStyle = "#fff6dc";
    pen.fillText("Chang Ngu, the Snake that Became an Elephant", WIDE / 2, 530);
  }
  pen.restore();
}

// Scene 1, the entry the film calls (SCENES): t, its own second, 0 to C01_LONG (30 s). Gives back nothing: it draws the
// whole sheet with pen and leaves it as it found it. From sets.js: cngSky("dawn"), CNG_CLOUDS.dawn, cngRiver(),
// cngRiverLife(), cngTown(). Its words are C01_LINES (C001 to C004), written under it by the page (cngSubtitles).
// Its z plan: nothing stands on the ground; the set is painted from the back to the front, the river's life on it.
function cngSceneMekong(t) {
  var light = between(t, 0, C01_LONG), pan = Math.pow(between(t, 12, 24), 1.4);   // the pan: the river, then the town
  var ease = pan * pan * (3 - 2 * pan);
  pen.save();
  pen.translate(WIDE * ease, 0);
  pen.drawImage(cngSky("dawn"), -WIDE, 0);
  pen.drawImage(cngSky("dawn"), 0, 0);
  pen.globalAlpha = 0.3 + 0.7 * light;
  pen.drawImage(cngSky("day"), -WIDE, 0);
  pen.drawImage(cngSky("day"), 0, 0);
  pen.globalAlpha = 1;
  pen.restore();                                         // the clouds on the frame, not on the pan: far off, they hardly
  cumulus(pen, t + 20, CNG_CLOUDS.dawn);                 // move as the land goes by, and none is cut where the two panels
  decorate(t, C01_SKY_LIFE, "back");
  pen.save();                                            // meet (cumulus draws on one sheet's width; found 2026-10-25)
  pen.translate(WIDE * ease, 0);
  var river = cngRiver();
  pen.drawImage(river.back, 0, 0);
  cngRiverLife(t, {});
  decorate(t, C01_LIFE, "back");
  pen.drawImage(river.near, 0, 0);
  pen.drawImage(cngTown(), -WIDE, 0);
  var bank = -WIDE + WIDE * CNG_TOWN_EDGE + 80;          // the water off the town's bank moves as the river's does
  waves(pen, bank, CNG_WATER + 6, -bank, CNG_BANK - CNG_WATER, "rgba(250, 238, 210, 0.22)", t);
  mistDrift(pen, t, {left: -WIDE, right: WIDE, top: 560, bottom: 680, count: 6, drift: 9, seed: 5, alpha: 0.5 * (1 - light)});
  pen.restore();
  c01Title(t);
  cngFadeIn(t, 2);
}
