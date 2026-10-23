// credits.js - a film's closing credits, for the kit's long films (the Lanna Tales): the words rolling up the frame,
// row by row (creditRow(): a title, a heading, a line, small print, a pair of the cast or of the things drawn, each
// over where it was drawn from, names four or five across, and the end, held); beside each pair its figures coming
// out from the frame's edges to take a bow (creditBow()); and last the thanks, three pandas in Teacher Piggy's
// manner dressed as Lanna princesses, rising and making a wai (creditThanks()). Made for the first tale (maeng/
// s15_credits.js), whose owner's words it keeps; each film keeps its own rows, its figures and the night behind.
// It needs oldcartoon.js (pen, WIDE, mix, clamp) and, for the bows, sabai.js (sabaiTile()).

// The three pandas' dress (the first tale's thanks to its voice, the owner's "Can you do 3?").
var CREDIT_PANDAS = [
  {bun: true, blouse: "#f7efe6", blouseDot: "#eadccb", sabai: "#d65a8a",
   flowers: [[78, 24, 8, "#f2cf5a"], [122, 24, 8, "#f2cf5a"], [100, 8, 6, "#fffaf0"]]},
  {bun: true, garland: true, blouse: "#e8f0e2", blouseDot: "#d0dfc4", sabai: "#7a4a9a", flowers: [[124, 22, 9, "#f6a6c0"]]},
  {bun: false, blouse: "#fbe9d4", blouseDot: "#f0d4b4", sabai: "#a8243a", flowers: [[150, 56, 13, "#f2cf5a"], [136, 48, 8, "#fffaf0"]]}
];

var CREDIT_TALL = {title: 150, head: 92, line: 52, small: 38, pair: 74, names4: 40, names5: 32, gap: 70, end: 300};

var CREDIT_END_ROOM = 170;                              // from the row before the end to the end's middle: its name stands above that
var CREDIT_GOLD = "#e0b23a", CREDIT_INK = "#f4ecd2", CREDIT_SOFT = "#c9c2dc";

// names: an array of strings (MAENG_THANKED, MAENG_SCHOLARS); across: 4 or 5 (CREDIT_TALL and creditRow() know only
// those). Gives back rows ["names4" or "names5", [up to "across" names]]. e.g. creditNames(MAENG_THANKED, 4);
function creditNames(names, across) {                  // a long list of names as rows of "across" (thanks.js)
  var rows = [];
  for (var n = 0; n < names.length; n += across) { rows.push(["names" + across, names.slice(n, n + across)]); }
  return rows;
}

// text at x, y (pixels of the sheet, its middle line at y), in a CSS font and colour; align "center" when left out;
// wide in pixels, or left out for no limit. Gives back nothing: it writes with pen and leaves pen's font, fill,
// textAlign and textBaseline set. e.g. creditText("Lanna Tales", WIDE / 2, 540, "italic 38px Georgia", CREDIT_INK);
function creditText(text, x, y, font, colour, align, wide) {   // wide: the most it may take across (squeezed to it)
  pen.font = font;
  pen.textAlign = align || "center";
  pen.textBaseline = "middle";
  pen.fillStyle = colour;
  if (wide) { pen.fillText(text, x, y, wide); } else { pen.fillText(text, x, y); }
}

// row: one of the film's rows (creditRoll()); y: its middle, in pixels of the sheet. Gives back nothing: it writes with pen (creditText()).
// e.g. creditRow(["head", "ตัวละคร", "The cast"], 540);
function creditRow(row, y) {                            // one row, its middle at y
  var serif = "'Noto Serif Thai', 'Leelawadee UI', serif", lanna = "'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
  if (row[0] === "title") {
    creditText(row[1], WIDE / 2, y - 26, "700 72px " + lanna, CREDIT_GOLD);
    creditText(row[2], WIDE / 2, y + 44, "italic 38px " + LETTERS_LATIN + ", 'Times New Roman', serif", CREDIT_INK);
  } else if (row[0] === "head") {
    creditText(row[1] + "  ·  " + row[2], WIDE / 2, y + 10, "600 40px " + serif, CREDIT_GOLD);
  } else if (row[0] === "line") {
    creditText(row[1], WIDE / 2, y, "500 38px " + serif, CREDIT_INK);
  } else if (row[0] === "names4" || row[0] === "names5") {   // names, evenly across
    var across = row[0] === "names4" ? 4 : 5, font = across === 4 ? "500 27px " + serif : "500 22px " + serif;
    var span = WIDE * 0.78;                          // inside the frame's middle: the camera's slow push and the film's gate take its edges
    row[1].forEach(function (name, k) {
      creditText(name, WIDE / 2 + (k + 0.5 - across / 2) * span / across, y, font, across === 4 ? CREDIT_INK : CREDIT_SOFT, "center", span / across - 24);
    });
  } else if (row[0] === "small") {
    creditText(row[1], WIDE / 2, y, "italic 25px " + LETTERS_LATIN + ", " + serif, CREDIT_SOFT);
  } else if (row[0] === "pair") {                    // two of the maker's things, each over where it was drawn from
    [row[1], row[2]].forEach(function (one, side) {
      if (!one) { return; }
      var at = WIDE / 2 + (side ? 1 : -1) * 470;
      creditText(one[0] + "  ·  " + one[1], at, y - 14, "500 29px " + serif, CREDIT_INK);
      creditText(one[2], at, y + 20, "italic 23px " + LETTERS_LATIN + ", " + serif, CREDIT_SOFT);
    });
  } else if (row[0] === "end") {
    creditText(row[1], WIDE / 2, y - 70, "700 96px " + lanna, CREDIT_GOLD);
    creditText(row[2], WIDE / 2, y + 30, "italic 44px " + LETTERS_LATIN + ", 'Times New Roman', serif", CREDIT_INK);
    creditText(row[3], WIDE / 2, y + 110, "500 36px " + serif, CREDIT_SOFT);
    creditText(row[4], WIDE / 2, y + 180, "500 30px " + serif, CREDIT_GOLD);
  }
}

// ---------- the pandas ----------
// A panda in Teacher Piggy's manner, 200 by 240 of its own points with its waist at the bottom edge, drawn about
// (x, base) "scale" times that, dressed by "look" (CREDIT_PANDAS), bowing into its wai by "bow" (0 to 1): the head and
// body go down, and at the deepest its eyes close in two smiling curves.
var CREDIT_PLUM = "#4a2a3a";

// Begins a path of one ellipse (radii rx, ry; turn in radians, 0 when left out), in the panda's own points; it
// fills nothing. e.g. creditEll(100, 184, 3, 5); pen.fill();
function creditEll(x, y, rx, ry, turn) { pen.beginPath(); pen.ellipse(x, y, rx, ry, turn || 0, 0, Math.PI * 2); }

// Fills pen's path with fill and strokes it in CREDIT_PLUM, width 2.2 when left out. Gives back nothing.
// e.g. creditEll(100, 120, 20, 20); creditInked("#ffffff");
function creditInked(fill, width) {
  pen.fillStyle = fill;
  pen.fill();
  pen.lineWidth = width || 2.2;
  pen.strokeStyle = CREDIT_PLUM;
  pen.lineJoin = "round";
  pen.stroke();
}

// A radial gradient about x, y out to r; stops: [[0 to 1, colour], ...]. Gives back the gradient, for pen.fillStyle.
// e.g. pen.fillStyle = creditGlow(84, 80, 110, [[0, "#ffffff"], [1, "#e6dfe2"]]);
function creditGlow(x, y, r, stops) {
  var g = pen.createRadialGradient(x, y, 0, x, y, r);
  stops.forEach(function (one) { g.addColorStop(one[0], one[1]); });
  return g;
}

// x, y: its middle, r its radius, in the panda's own points; petal: a CSS colour. Gives back nothing: it draws with
// pen. e.g. creditFlower(78, 24, 8, "#f2cf5a");
function creditFlower(x, y, r, petal) {                 // five petals and an orange heart
  for (var k = 0; k < 5; k++) {
    var a = k * Math.PI * 2 / 5 - Math.PI / 2;
    creditEll(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.5, r * 0.36, a);
    creditInked(petal, 1.2);
  }
  creditEll(x, y, r * 0.28, r * 0.28);
  creditInked("#e08a2a", 1);
}

// path: a function that makes pen's path (no arguments); base, gold: CSS colours; diamonds: true for diamonds,
// false for dots. The motifs are laid from y 150 down, in the panda's own 200 by 240. Gives back nothing: it fills
// and inks the path with pen. e.g. creditCloth(torso, look.blouse, look.blouseDot, false);
function creditCloth(path, base, gold, diamonds) {      // a cloth: its colour, small gold motifs in rows, inside the path
  pen.save();
  path();
  pen.clip();
  pen.fillStyle = base;
  pen.fillRect(0, 0, 200, 240);
  pen.fillStyle = gold;
  for (var y = 150; y < 240; y += 9) {
    for (var x = -10; x < 210; x += 9) {
      var ox = x + (Math.floor(y / 9) % 2) * 4.5;
      pen.beginPath();
      if (diamonds) { pen.moveTo(ox, y - 2.4); pen.lineTo(ox + 2.4, y); pen.lineTo(ox, y + 2.4); pen.lineTo(ox - 2.4, y); }
      else { pen.arc(ox, y, 1.3, 0, 7); }
      pen.fill();
    }
  }
  pen.restore();
  path();
  pen.lineWidth = 2.2;
  pen.strokeStyle = CREDIT_PLUM;
  pen.stroke();
}

// x, base: the middle of its waist, in pixels of the sheet; scale: 1 for 200 by 240; look: one of CREDIT_PANDAS (bun,
// garland, blouse, blouseDot, sabai, flowers); bow: 0 to 1. Gives back nothing: it draws with pen.
// e.g. creditPanda(WIDE / 2, 1080, 2.5, CREDIT_PANDAS[0], 0);
function creditPanda(x, base, scale, look, bow) {
  var fur = "#2b2630";
  pen.save();
  pen.translate(x - 100 * scale, base - 240 * scale + 14 * scale * bow);
  pen.scale(scale, scale);
  function torso() {
    pen.beginPath();
    pen.moveTo(18, 240); pen.quadraticCurveTo(14, 186, 44, 172); pen.quadraticCurveTo(100, 156, 156, 172);
    pen.quadraticCurveTo(186, 186, 182, 240); pen.closePath();
  }
  creditCloth(torso, look.blouse, look.blouseDot, false);   // the blouse, with a round collar edged in gold
  pen.save();
  torso();
  pen.clip();
  creditEll(100, 166, 30, 12);
  pen.fillStyle = "#f8f3ee";
  pen.fill();
  pen.lineWidth = 2.4;
  pen.strokeStyle = "#e0b23a";
  pen.stroke();
  pen.restore();
  function sabai() {                                 // over the left shoulder (our right), across the chest to the other side
    pen.beginPath();
    pen.moveTo(150, 166); pen.quadraticCurveTo(176, 174, 184, 196); pen.lineTo(186, 240); pen.lineTo(120, 240);
    pen.quadraticCurveTo(84, 214, 44, 206); pen.quadraticCurveTo(40, 194, 50, 188); pen.quadraticCurveTo(96, 196, 150, 166);
    pen.closePath();
  }
  creditCloth(sabai, look.sabai, "#f2cf5a", true);
  pen.beginPath();                                   // its gold border, and a gold necklace with its pendant
  pen.moveTo(50, 190); pen.quadraticCurveTo(96, 198, 150, 168);
  pen.lineWidth = 3.4;
  pen.strokeStyle = "#e0b23a";
  pen.stroke();
  pen.beginPath();
  pen.moveTo(74, 170); pen.quadraticCurveTo(100, 192, 126, 170);
  pen.lineWidth = 2;
  pen.stroke();
  creditEll(100, 184, 4, 5);
  creditInked("#f2cf5a", 1.2);
  pen.save();                                        // the head nods deeper than the body bows
  pen.translate(0, 8 * bow);
  [-1, 1].forEach(function (side) {                  // the black ears
    creditEll(100 + side * 62, 40, 22, 21);
    creditInked(fur, 2.4);
    creditEll(100 + side * 62, 42, 11, 10);
    pen.fillStyle = "#4a4250";
    pen.fill();
  });
  creditEll(100, 104, 82, 72);                          // the round white face
  pen.fillStyle = creditGlow(84, 80, 110, [[0, "#ffffff"], [0.7, "#f6f2f0"], [1, "#e6dfe2"]]);
  pen.fill();
  pen.lineWidth = 2.6;
  pen.strokeStyle = CREDIT_PLUM;
  pen.stroke();
  if (look.bun) {                                    // a princess's bun of black fur, its gold pins hung with pearls
    creditEll(100, 30, 26, 18); creditInked(fur, 2.4);
    creditEll(100, 16, 18, 13); creditInked(fur, 2.2);
    pen.strokeStyle = "rgba(255, 255, 255, 0.25)";
    pen.lineWidth = 1.5;
    pen.beginPath(); pen.arc(94, 26, 14, 3.6, 4.6); pen.stroke();
    [-1, 1].forEach(function (side) {
      pen.beginPath(); pen.moveTo(100 + side * 8, 24); pen.lineTo(100 + side * 40, 8);
      pen.lineWidth = 2.4; pen.strokeStyle = "#e0b23a"; pen.stroke();
      creditEll(100 + side * 40, 8, 3.4, 3.4); creditInked("#f2cf5a", 1);
      for (var k = 1; k <= 3; k++) { creditEll(100 + side * 40, 8 + k * 5, 1.6, 1.6); creditInked("#fffaf0", 0.8); }
    });
  }
  if (look.garland) {                                // a garland of jasmine round the bun
    for (var g = -4; g <= 4; g++) { creditEll(100 + g * 6.4, 40 - 8 * Math.cos(g / 4 * 1.2), 3.6, 3.6); creditInked(g % 2 ? "#fffaf0" : "#f6e9b0", 0.9); }
  }
  look.flowers.forEach(function (one) { creditFlower(one[0], one[1], one[2], one[3]); });
  [-1, 1].forEach(function (side) {                  // the eye patches, tipped outward and down
    creditEll(100 + side * 32, 104, 20, 26, side * -0.5);
    pen.fillStyle = fur;
    pen.fill();
  });
  [-1, 1].forEach(function (side) {                  // the eyes: big and glossy, with lashes; shut in two smiles at the deepest bow
    var ex = 100 + side * 31, ey = 101;
    if (bow > 0.6) {
      pen.beginPath(); pen.moveTo(ex - 10, ey + 2); pen.quadraticCurveTo(ex, ey - 9, ex + 10, ey + 2);
      pen.lineWidth = 3; pen.lineCap = "round"; pen.strokeStyle = "#f4ecd2"; pen.stroke();
      return;
    }
    creditEll(ex, ey, 12, 13);
    pen.fillStyle = creditGlow(ex, ey + 4, 14, [[0, "#6b4a5a"], [0.6, "#3a2230"], [1, "#160c12"]]);
    pen.fill();
    pen.fillStyle = "#ffffff";
    creditEll(ex - side - 3.5, ey - 5, 4.2, 4.6); pen.fill();
    creditEll(ex + 4, ey + 5, 2, 2); pen.fill();
    pen.strokeStyle = "#160c12"; pen.lineWidth = 1.8; pen.lineCap = "round";
    for (var k = 0; k < 3; k++) {
      var a = -Math.PI / 2 + side * (0.6 + k * 0.32);
      pen.beginPath(); pen.moveTo(ex + Math.cos(a) * 12, ey + Math.sin(a) * 13); pen.lineTo(ex + Math.cos(a) * 18, ey + Math.sin(a) * 18 - 2); pen.stroke();
    }
  });
  [-1, 1].forEach(function (side) { creditEll(100 + side * 54, 134, 15, 10); pen.fillStyle = "rgba(246, 120, 150, 0.45)"; pen.fill(); });   // blush
  creditEll(100, 136, 26, 19); pen.fillStyle = "#fbf7f4"; pen.fill();     // the muzzle, the nose, the smile
  pen.beginPath();
  pen.moveTo(91, 128); pen.quadraticCurveTo(100, 124, 109, 128); pen.quadraticCurveTo(104, 137, 100, 138); pen.quadraticCurveTo(96, 137, 91, 128);
  creditInked(fur, 1.6);
  pen.beginPath(); pen.moveTo(88, 145); pen.quadraticCurveTo(100, 160, 112, 145); pen.quadraticCurveTo(100, 150, 88, 145);
  creditInked("#8c2a48", 1.8);
  creditEll(100, 151, 5, 2.6); pen.fillStyle = "#ff8aa5"; pen.fill();
  [-1, 1].forEach(function (side) { creditEll(100 + side * 76, 118, 4.5, 4.5); creditInked("#f2cf5a", 1.2); });   // gold ear plugs
  pen.restore();
  pen.lineCap = "round";                             // the wai: each arm down to the elbow and up, the paws palm to palm
  [-1, 1].forEach(function (side) {
    pen.beginPath(); pen.moveTo(100 + side * 62, 190); pen.quadraticCurveTo(100 + side * 58, 230, 100 + side * 34, 228);
    pen.quadraticCurveTo(100 + side * 16, 226, 100 + side * 9, 206 - 6 * bow);
    pen.lineWidth = 25; pen.strokeStyle = CREDIT_PLUM; pen.stroke();
    pen.lineWidth = 20.5; pen.strokeStyle = fur; pen.stroke();
  });
  pen.save();
  pen.translate(0, -6 * bow);                        // the paws come up to the bowed face
  [-1, 1].forEach(function (side) {
    pen.beginPath(); pen.moveTo(100, 212); pen.quadraticCurveTo(100 + side * 15, 206, 100 + side * 12, 184);
    pen.quadraticCurveTo(100 + side * 8, 168, 100, 164); pen.closePath();
    creditInked(fur, 2.2);
    creditEll(100 + side * 6, 184, 3, 5); pen.fillStyle = "#5a4a58"; pen.fill();
  });
  pen.strokeStyle = "#6a5a68"; pen.lineWidth = 1.2;
  pen.beginPath(); pen.moveTo(100, 167); pen.lineTo(100, 210); pen.stroke();
  pen.restore();
  pen.restore();
}

// t: the scene's second; at: [when the words of the roll go and the light comes, when the pandas are up]; wais: when
// each of the three bows, [[first, second, third], ...] (1.8 s a bow); words: [Kam Mueang, English], the thank-you.
// Nothing before at[0]; then the warm light, the words and the three pandas (CREDIT_PANDAS) rising. Gives back
// nothing: it draws with pen. e.g. creditThanks(185, [177.5, 179], [[180, 181, 182]], ["ขอบคุณหลาย ๆ เจ้า", "Thank you"]);
function creditThanks(t, at, wais, words) {             // the three pandas and the thank-you, from at[0] on
  var come = clamp((t - at[0]) / (at[1] - at[0]));
  if (come <= 0) { return; }
  var rise = 1 - Math.pow(1 - come, 3);
  pen.save();
  pen.globalAlpha = come;
  pen.fillStyle = creditGlow(WIDE / 2, 980, 900, [[0, "rgba(255, 236, 190, 0.22)"], [1, "rgba(255, 236, 190, 0)"]]);   // a warm light behind them
  pen.fillRect(0, 0, WIDE, 1080);
  creditText(words[0], WIDE / 2, 150, "600 64px 'Noto Serif Thai', 'Leelawadee UI', serif", CREDIT_GOLD);
  creditText(words[1], WIDE / 2, 232, "italic 42px " + LETTERS_LATIN + ", 'Times New Roman', serif", CREDIT_INK);
  pen.globalAlpha = 1;                               // the pandas rise in whole: one seen through shows its own layers
  CREDIT_PANDAS.forEach(function (look, n) {
    var bow = 0;
    wais.forEach(function (wai) { var u = (t - wai[n]) / 1.8; if (u > 0 && u < 1) { bow = Math.max(bow, Math.sin(Math.PI * u)); } });
    creditPanda(WIDE / 2 + (n - 1) * 600, 1080 + 320 * (1 - rise), 2.5, look, bow);
  });
  pen.restore();
}

// ---------- the bows ----------
// Owner, 2026-10-20: "When the credits role have all the sprites use come out and take a bow when they are listed".
// Each name of the cast and of the maker's list has its figure (the film's figures, by its English name). As its row comes
// up the frame, the figure comes out from the frame's edge beside it (the left one's on the left, the right one's on
// the right, each facing in), bows as the row passes the middle (a person over a wai, a creature or a thing tipping
// forward from its feet), and goes back out as the roll goes on. Each is drawn once onto a tile (sabai.js's
// sabaiTile(), as the woven figures are), so the roll stays quick to draw; one that moves has its cycle.
var CREDIT_BOW_TILE = 256;                               // a tile's side
var CREDIT_BOW_TALL = 150;                               // the figure's height (or width, if wider) on the screen
var CREDIT_BOW_EDGE = 112;                               // its middle from the frame's edge when it is out
var CREDIT_BOW_AT = [680, 610, 520, 450];                // the row's height on the screen: it comes out from the first to the second, goes back from the third to
                                                      // the fourth, so one is coming out as the one before goes back (a row is 74 below the one before)
var CREDIT_BOW_DEEP = [610, 520];                        // and bows while the row goes from the one to the other
var CREDIT_TILES = {};

// u: 0 to 1 (held there outside it); gives back 0 to 1, eased in and out. e.g. var out = creditEase(0.4);
function creditEase(u) { u = clamp(u); return u * u * (3 - 2 * u); }


// list: [[offset across, in the painter's own pixels, painter], ...]. Gives back one painter (b, u) that draws them
// all. e.g. creditMany([[-60, function () { person(0, 0, cast("inta", {wai: true})); }], [60, function () { person(0, 0, cast("khammun", {wai: true})); }]])
function creditMany(list) {                              // a few side by side, each painter at its offset across
  return function (b, u) { list.forEach(function (one) { b.save(); b.translate(one[0], 0); one[1](b, u); b.restore(); }); };
}
// size: how much smaller (0.5, half); painter: (b) for a still one, (b, u) for one that moves. Gives back a painter
// of the same kind. e.g. "Temple": creditSmall(0.5, function (b) { temple(b, 0, 0); })
function creditSmall(size, painter) {                    // a big thing drawn smaller, so its tile can hold it
  var moving = painter.length >= 2;
  return moving ? function (b, u) { b.save(); b.scale(size, size); painter(b, u); b.restore(); }
                : function (b) { b.save(); b.scale(size, size); painter(b); b.restore(); };
}

// row: a "pair" row; y: its middle, in pixels of the sheet; t: seconds (a moving figure's frame, 7.5 a second). Each
// side's figure in figures (the film's: {English name: painter}), if it has one, is drawn from its tile. It fills
// CREDIT_TILES on a figure's first call (sabaiTile()). Gives back nothing: it draws with pen.
// e.g. creditBow(rows[n], 560, t, {"Boy": function () { person(0, 0, cast("boy", {wai: true})); }});
function creditBow(row, y, t, figures) {                 // the figures of a row whose middle is at y
  [row[1], row[2]].forEach(function (one, side) {
    var painter = one && figures[one[1]];
    if (!painter) { return; }
    var out = creditEase((CREDIT_BOW_AT[0] - y) / (CREDIT_BOW_AT[0] - CREDIT_BOW_AT[1])) * creditEase((y - CREDIT_BOW_AT[3]) / (CREDIT_BOW_AT[2] - CREDIT_BOW_AT[3]));
    if (out <= 0) { return; }
    var frames = CREDIT_TILES[one[1]] || (CREDIT_TILES[one[1]] = sabaiTile(painter, CREDIT_BOW_TILE));
    var frame = frames[Math.floor(t * 7.5) % frames.length];
    var bow = Math.sin(Math.PI * clamp((CREDIT_BOW_DEEP[0] - y) / (CREDIT_BOW_DEEP[0] - CREDIT_BOW_DEEP[1])));
    var shown = CREDIT_BOW_TALL / 0.86, face = side ? -1 : 1;   // the tile's picture fills 0.86 of it
    var x = side ? WIDE - mix(-shown / 2, CREDIT_BOW_EDGE, out) : mix(-shown / 2, CREDIT_BOW_EDGE, out);
    pen.save();
    pen.translate(x, y + shown * 0.43 + 6 * bow);      // about its feet, at the foot of the tile
    pen.rotate(face * 0.3 * bow);                      // tipping forward, toward the middle of the frame
    pen.scale(face, 1);
    pen.drawImage(frame, -shown / 2, -shown, shown, shown);
    pen.restore();
  });
}

// ---------- the roll ----------
// t: the scene's second; rows: what rolls (creditRow()'s kinds), the "end" row last; roll: [when the first row comes
// in at the foot of the frame, when the end's middle reaches the frame's middle and stays]; gone: when the words
// go (over 0.8 s), for the thanks; figures: the film's bowing figures for its "pair" rows (creditBow()), or left out.
// Gives back nothing: it writes with pen. e.g. creditRoll(t, rows, [3, 174], 177.5, figures);
function creditRoll(t, rows, roll, gone, figures) {
  var tall = 0, n;
  for (n = 0; n < rows.length - 1; n++) { tall += CREDIT_TALL[rows[n][0]]; }
  var from = 1080 + 60, to = 540 - CREDIT_END_ROOM - tall, top = mix(from, to, clamp((t - roll[0]) / (roll[1] - roll[0])));
  var y = top;
  pen.save();
  pen.globalAlpha = 1 - clamp((t - gone) / 0.8);    // the words go before the thanks
  for (n = 0; n < rows.length; n++) {                // the end is held with its middle in the frame's
    var middle = rows[n][0] === "end" ? y + CREDIT_END_ROOM : y + CREDIT_TALL[rows[n][0]] / 2;
    if (middle > -160 && middle < 1240) { creditRow(rows[n], middle); if (figures && rows[n][0] === "pair") { creditBow(rows[n], middle, t, figures); } }
    y += CREDIT_TALL[rows[n][0]];
  }
  pen.restore();
}
