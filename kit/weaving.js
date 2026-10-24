// Weaving of the north for the Lanna cartoon kit: the patterns of Lanna and northern Thai cloth, drawn thread by
// thread, the cloths made of them, and the women who weave and spin. Load this file after oldcartoon.js.
//
// Everything here follows the NotebookLM notebook "Lanna and Northern Thai weaving: looms, spinning, cloth and the
// women who weave" (2026-10-24, 16 sources): above all the Silpakorn University thesis on the teen jok of Nan
// (การจัดการความรู้ผ้าตีนจกเมืองน่าน, with its graph-paper charts), the study of Mae Chaem teen jok in ThaiJO
// (larts-journal 247740: the 11 master motifs), the Nan teen jok paper in ThaiJO (jica 94252: the parts of the
// hem), SACIT's archive of Kru Pranom Tapang's Khan Dok cloth of Mueang Long, the Lanna Folklife Museum of
// Chiang Mai (pa sin tin jok kham), the Department of Sericulture's page on khit, and the Textile Atlas on Tai
// Yuan teen jok. docs/kit/things.md, "Lanna weaving: the patterns, the cloths and the looms", says which grid
// follows a chart and which was drawn from a source's description of its shape.
//
// The pieces:
//   LAI             the motifs, each a grid of threads with its Thai name, meaning, town and source
//   weaveGrid       one motif as woven cloth: each cell a float of the pattern weft over the ground weave
//   clothSample     a swatch of one motif repeated, its warp ends loose at the top and bottom
//   teenJok         the decorated hem of a sin, in its parts: the yellow nail stripe, the rows above, the main
//                   row of lanterns and offering bowls, the rows below, the hanging tassels, the plain foot
//   sinCloth        a whole tube skirt laid flat: the waist (hua sin), the striped body (tua sin), the teen jok
//   sabaiCloth      a shoulder cloth hung over a bamboo pole, its khit ends and its fringe hanging
//   frameLoom       a woman weaving at the frame loom (huk, ki) under the house: on its bench, her feet on the
//                   treadles, the shuttle thrown and the beater pulled home twice; or picking jok with a quill
//   spinningWheel   a woman spinning cotton at the wheel (phian, la, nai): the right hand turns the rim, the left
//                   draws the cotton out from the spindle

// ---------- the colours of the dyes, as the sources name them ----------
var WEAVE_DYES = {
  black: "#1d1712", red: "#9a1f24", lac: "#b8323a", indigo: "#24335e", deepIndigo: "#1a2442",
  yellow: "#e2b52f", jackfruit: "#d79a2a", green: "#3f7a46", white: "#f2ead6", cream: "#e8dcc0",
  pink: "#d0507a", magenta: "#b0306e", purple: "#5a2f6a", orange: "#d9732c", silver: "#c9cdd2", gold: "#d8b04a",
  brown: "#6a4a2c"
};

// The palettes: a ground and the pattern threads 1 to 4, by the town or people the sources give them to.
//   maechaem  black and red ground, rich yellow cotton (jackfruit heartwood or turmeric), white, dark red, green
//   nan       black or indigo ground, silver paper thread, gold, yellow birds (Nan's signature), white, magenta
//   long      indigo ground, yellow of jackfruit, red of stick lac, green (yellow over indigo), white
//   lue       the Tai Lue nam lai: red, indigo, white, black, yellow, pink and green blocks
//   khit      indigo cotton on a white ground, two colours, raised
var WEAVE_PALETTES = {
  maechaem: {ground: WEAVE_DYES.black, threads: [WEAVE_DYES.yellow, WEAVE_DYES.red, WEAVE_DYES.green, WEAVE_DYES.white]},
  maechaemRed: {ground: WEAVE_DYES.red, threads: [WEAVE_DYES.yellow, WEAVE_DYES.black, WEAVE_DYES.green, WEAVE_DYES.white]},
  nan: {ground: WEAVE_DYES.black, threads: [WEAVE_DYES.silver, WEAVE_DYES.yellow, WEAVE_DYES.magenta, WEAVE_DYES.white]},
  nanIndigo: {ground: WEAVE_DYES.indigo, threads: [WEAVE_DYES.gold, WEAVE_DYES.white, WEAVE_DYES.pink, WEAVE_DYES.yellow]},
  long: {ground: WEAVE_DYES.indigo, threads: [WEAVE_DYES.jackfruit, WEAVE_DYES.lac, WEAVE_DYES.green, WEAVE_DYES.white]},
  lue: {ground: WEAVE_DYES.red, threads: [WEAVE_DYES.indigo, WEAVE_DYES.white, WEAVE_DYES.yellow, WEAVE_DYES.green]},
  khit: {ground: WEAVE_DYES.white, threads: [WEAVE_DYES.indigo, WEAVE_DYES.deepIndigo, WEAVE_DYES.red, WEAVE_DYES.indigo]}
};

// ---------- building grids ----------
// A grid is a list of rows, top to bottom, one character a thread float: "." the ground, "1" to "4" a pattern
// thread of the palette. A pattern is woven a float at a time across the warp, so a cell is wider than it is tall.

// Each row's left half (its middle column last) made whole by its mirror (a figure the sources call symmetric).
// e.g. laiMirror(["..1", ".11", "111"]) is ["..1..", ".111.", "11111"]
function laiMirror(half) {
  return half.map(function (row) { return row + row.slice(0, -1).split("").reverse().join(""); });
}

// The top half (its middle row last) made whole by its mirror below.
// e.g. laiFlipDown([".1.", "111"]) is [".1.", "111", ".1."]
function laiFlipDown(top) { return top.concat(top.slice(0, -1).reverse()); }

// A figure facing right, a centre between, and the figure again facing left: a pair, as birds face their tree.
// e.g. laiPair(LAI.nok.grid, ["1", "1"]) (the two grids as tall as each other)
function laiPair(figure, centre) {
  return figure.map(function (row, k) { return row + (centre[k] || "") + row.split("").reverse().join(""); });
}

// A grid side by side with itself, count times (a running band).
function laiRepeat(grid, count, gap) {
  var space = new Array((gap || 0) + 1).join(".");
  return grid.map(function (row) { var out = row; for (var k = 1; k < count; k++) { out += space + row; } return out; });
}

// A small grid set into a larger one (its threads over the larger one's), its top-left at (row, col).
function laiStamp(grid, small, row, col) {
  var out = grid.map(function (r) { return r.split(""); });
  small.forEach(function (r, i) {
    r.split("").forEach(function (ch, j) { if (ch !== "." && out[row + i] && col + j < out[row + i].length) { out[row + i][col + j] = ch; } });
  });
  return out.map(function (r) { return r.join(""); });
}

// A blank grid of a size.
function laiBlank(rows, cols) { var r = new Array(cols + 1).join("."), out = []; for (var k = 0; k < rows; k++) { out.push(r); } return out; }

// A grid from a rule: rule(row, col) gives "." or a thread.
function laiFrom(rows, cols, rule) {
  var out = [];
  for (var i = 0; i < rows; i++) { var row = ""; for (var j = 0; j < cols; j++) { row += rule(i, j) || "."; } out.push(row); }
  return out;
}

// The stepped diamond (lai nuay, the unit or seed of Nan): one step across for each thread up, round a middle.
// kind: "solid", "hollow", "nested" (a diamond in a diamond), "cross" (a Greek cross inside), "dots" (four dots).
// e.g. laiDiamond(4, "nested")
function laiDiamond(r, kind, thread) {
  var c = thread || "1";
  return laiFrom(2 * r + 1, 2 * r + 1, function (i, j) {
    var d = Math.abs(i - r) + Math.abs(j - r);
    if (kind === "solid") { return d <= r ? c : ""; }
    if (d === r) { return c; }
    if (kind === "nested" && (d === r - 2 || d === 0)) { return c; }
    if (kind === "cross" && ((i === r && Math.abs(j - r) <= r - 2) || (j === r && Math.abs(i - r) <= r - 2))) { return c; }
    if (kind === "dots" && d === Math.round(r / 2) && (i === r || j === r)) { return c; }
    return "";
  });
}

// The stepped triangle (lai kap, the sheath of a bract), point up, w wide (odd). kind: "solid", "outline", "nested".
function laiKap(w, kind) {
  var h = (w + 1) / 2, c = (w - 1) / 2;
  return laiFrom(h, w, function (i, j) {
    var d = Math.abs(j - c);
    if (d > i) { return ""; }
    if (kind === "outline") { return d === i || i === h - 1 ? "1" : ""; }
    if (kind === "nested") { return d === i || i === h - 1 || (d === i - 3 && i >= 3) ? "1" : ""; }
    return "1";
  });
}

// ---------- the motifs ----------
// Each: thai, say (its sound), en (what it is), town (where the sources put it), from (the source), grid, and where
// it was taken from: "chart" (a source's graph-paper chart, described in its text), "rule" (a source's rule of how
// it is drafted), "shape" (drawn here from a source's description of its outline). warp: true for a warp float.
var LAI = {};

LAI.nuay = {thai: "ลายหน่วย", say: "lai nuay", en: "the unit, a seed: a stepped diamond", town: "Nan", from: "Silpakorn thesis, Nan",
            how: "rule", grid: laiDiamond(4, "solid")};
LAI.nuayHollow = {thai: "ลายหน่วย (โปร่ง)", say: "lai nuay", en: "the unit, hollow", town: "Nan", from: "Silpakorn thesis, Nan",
                  how: "rule", grid: laiDiamond(4, "hollow")};
LAI.nuayNested = {thai: "ลายหน่วย (ซ้อน)", say: "lai nuay", en: "the unit, a diamond in a diamond", town: "Nan",
                  from: "Silpakorn thesis, Nan", how: "rule", grid: laiDiamond(5, "nested")};
LAI.nuayCross = {thai: "ลายหน่วย (กากบาทใน)", say: "lai nuay", en: "the unit with a cross inside", town: "Nan",
                 from: "Silpakorn thesis, Nan", how: "rule", grid: laiDiamond(5, "cross")};
LAI.nuayDots = {thai: "ลายหน่วย (สี่จุด)", say: "lai nuay", en: "the unit with four dots", town: "Nan", from: "Silpakorn thesis, Nan",
                how: "rule", grid: laiDiamond(5, "dots")};
LAI.kap = {thai: "ลายกาบ", say: "lai kap", en: "the bract, a stepped triangle", town: "Nan", from: "Silpakorn thesis, Nan",
           how: "rule", grid: laiKap(15, "solid")};
LAI.kapNested = {thai: "ลายกาบ (ซ้อน)", say: "lai kap", en: "the bract, nested chevrons", town: "Nan", from: "Silpakorn thesis, Nan",
                 how: "rule", grid: laiKap(17, "nested")};
LAI.kapPair = {thai: "ลายกาบคู่", say: "lai kap", en: "bracts tip to tip", town: "Nan", from: "Silpakorn thesis, Nan", how: "rule",
               grid: laiKap(11, "solid").concat(laiKap(11, "solid").slice().reverse())};
LAI.kanKho = {thai: "ลายก่านข้อ", say: "lai kan kho", en: "the jointed line: dashes", town: "Nan (Wiang Sa, Na Noi)",
              from: "Silpakorn thesis, Nan", how: "rule", grid: ["111.111.111.111.", "................", "2222..2222..2222"]};
LAI.kho2 = {thai: "ลายข้อ", say: "lai kho", en: "the joint: a dotted line", town: "Nan", from: "Silpakorn thesis, Nan", how: "rule",
            grid: ["1..1..1..1..1..1..", "..................", ".2..2..2..2..2..2."]};
LAI.kai = {thai: "ลายไก", say: "lai kai", en: "the twisted cord of two colours (pan kai)", town: "Nan", from: "Silpakorn thesis, Nan",
           how: "rule", grid: laiFrom(3, 24, function (i, j) { return (j + i) % 4 < 2 ? "1" : "2"; })};
LAI.kakabat = {thai: "ลายกากบาท", say: "lai kakabat", en: "the cross between two posts", town: "Nan", from: "Silpakorn thesis, Nan",
               how: "rule", grid: laiFrom(9, 13, function (i, j) {
                 if (j === 0 || j === 12) { return "1"; }
                 var x = j - 6, y = i - 4;
                 if (Math.abs(x) === Math.abs(y) && Math.abs(x) <= 4) { return "1"; }
                 if ((Math.abs(x) === 4 && y === 0) || (x === 0 && Math.abs(y) === 3)) { return "2"; }
                 return "";
               })};
LAI.fanPla = {thai: "ลายฟันปลา", say: "lai fan pla", en: "the fish's teeth: a stepped zigzag", town: "Nan, Mae Chaem",
              from: "Silpakorn thesis, Nan", how: "rule", grid: laiFrom(5, 24, function (i, j) {
                var p = j % 8, h = p < 4 ? p : 8 - p;
                return 4 - i === h ? "1" : (i === 4 && p === 0 ? "1" : "");
              })};
LAI.fanPlaSolid = {thai: "ลายฟันปลา (ทึบ)", say: "lai fan pla", en: "the fish's teeth, solid, dots between", town: "Nan",
                   from: "Silpakorn thesis, Nan", how: "rule", grid: laiFrom(6, 24, function (i, j) {
                     var p = j % 8, h = p < 4 ? p : 8 - p;
                     if (i <= 4 && 4 - i <= h - 0 && i >= 4 - h) { return i === 0 && h < 4 ? "" : "1"; }
                     if (i === 1 && p === 0) { return "2"; }
                     return "";
                   })};
LAI.buaLoy = {thai: "ลายบัวลอย", say: "lai bua loy", en: "the floating lotus: a stepped cross with brackets", town: "Nan",
              from: "Silpakorn thesis, Nan", how: "chart", grid: laiFlipDown(laiMirror([
                "1.....",
                "11..2.",
                "...222",
                "..2..1",
                ".22.11",
                "2.2111"
              ]))};
LAI.kho = {thai: "ลายขอ", say: "lai kho", en: "the hook: a stepped scroll, holding fast to fortune", town: "Nan, Mae Chaem, khit",
           from: "Silpakorn thesis, Nan", how: "chart", grid: [
             ".111111..",
             ".1....1..",
             ".1.11.1..",
             ".1..1.1..",
             ".1111.1..",
             "......1..",
             "1111111.."
           ]};
LAI.khoS = {thai: "ลายขอคู่", say: "lai kho khu", en: "the double hook: an S of two hooks", town: "Nan", from: "Silpakorn thesis, Nan",
            how: "chart", grid: [
              "1111111....",
              "1.....1....",
              "1.111.1....",
              "1.1.1.1....",
              "1.1...1....",
              "1.11111111.",
              "1.......1..",
              "......1.1..",
              "....111.1..",
              "....1...1..",
              "....11111.."
            ].map(function (r) { return r; })};
LAI.khruaKho = {thai: "ลายเครือขอ", say: "lai khruea kho", en: "a running band of hooks", town: "Nan, Mae Chaem",
                from: "Silpakorn thesis, Nan", how: "chart", grid: laiRepeat([
                  "11111...",
                  "1...1...",
                  "1.1.1...",
                  "1.1.1111",
                  "1.1....1",
                  "...111.1",
                  "...1.1.1",
                  "...1...1",
                  "...11111"
                ], 4, 0)};
LAI.kutKhoBet = {thai: "ลายกุดขอเบ็ด", say: "lai kut kho bet", en: "the cut fishhook: frets ending in blunt hooks", town: "Mae Chaem",
                 from: "ThaiJO larts 247740", how: "shape", grid: laiRepeat([
                   "1111111..",
                   "......1..",
                   ".1111.1..",
                   ".1..1.1..",
                   ".1....1..",
                   ".111111.."
                 ], 4, 0)};
LAI.nok = {thai: "ลายนก", say: "lai nok", en: "a crested bird", town: "Nan (yellow), Mae Chaem", from: "Silpakorn thesis, Nan",
           how: "chart", grid: [
             "........1...",
             ".......11...",
             "......1111..",
             "......11.111",
             "......111...",
             "1....1111...",
             "11..11111...",
             ".1111111....",
             "..11111.....",
             "...1..1.....",
             "..11..11...."
           ]};
LAI.nokKhu = {thai: "ลายนกคู่", say: "lai nok khu", en: "paired birds facing a flower: faithfulness", town: "Nan, Mae Chaem",
              from: "Silpakorn thesis, Nan; SACIT", how: "chart", grid: laiPair(LAI.nok.grid, [
                "..2..", ".222.", "..2..", ".....", "..1..", ".111.", "11111", ".111.", "..1..", "..1..", ".111."
              ])};
LAI.nokKhuTon = {thai: "ลายนกคู่กินน้ำร่วมต้น", say: "lai nok khu kin nam ruam ton", en: "two birds drinking from the same tree",
                 town: "Mueang Long", from: "SACIT (Kru Pranom Tapang)", how: "shape", grid: laiPair(LAI.nok.grid.map(function (r) {
                   return r.slice(0, 11) + ".";
                 }), [".1.1.", "..1..", "11111", "..1..", "1.1.1", ".111.", "..1..", "..1..", ".111.", "11111", ".111."])};
LAI.nokKum = {thai: "ลายนกกูม", say: "lai nok kum", en: "the brooding quail: care of the home", town: "Mae Chaem",
              from: "ThaiJO larts 247740; SACIT", how: "shape", grid: [
                "....11...",
                "...1111..",
                "..11.1111",
                "1111111..",
                "11111111.",
                ".111111..",
                "..1111...",
                "...1.1..."
              ]};
LAI.hongPloi = {thai: "ลายหงส์ปล่อย", say: "lai hong ploi", en: "the free-standing hamsa: its neck up, its tail flared",
                town: "Mae Chaem", from: "ThaiJO larts 247740", how: "shape", grid: [
                  ".......11...",
                  "......1111..",
                  "......11.111",
                  ".......11...",
                  "......11....",
                  ".....11.....",
                  ".....11.....",
                  "1.....11....",
                  "11....111...",
                  ".11..11111..",
                  "..11111111..",
                  "...111111...",
                  "....1111....",
                  ".....11....."
                ]};
LAI.hongBi = {thai: "ลายหงส์บี้", say: "lai hong bi", en: "the pressed hamsa: two swans back to back", town: "Mae Chaem",
              from: "ThaiJO larts 247740", how: "shape", grid: laiPair([
                "...11.....",
                "..1111....",
                "111.11....",
                "....11....",
                "...111..11",
                "..1111111.",
                ".1111111..",
                "..11111..."
              ].map(function (r) { return r.split("").reverse().join(""); }), ["", "", "", "", "", "", "", ""])};
LAI.hongKhu = {thai: "ลายหงส์คู่", say: "lai hong khu", en: "paired hamsa facing a vessel", town: "Mae Chaem, Mueang Long",
               from: "SACIT (Kru Pranom Tapang)", how: "shape", grid: laiPair(LAI.hongPloi.grid, [
                 ".....", "..2..", ".222.", "..2..", ".....", ".....", "..1..", ".111.", "11111", "11111", ".111.", "..1..",
                 ".111.", "11111"
               ])};
LAI.nak = {thai: "ลายนาค", say: "lai nak", en: "the naga, the water serpent: water, fertility, protection",
           town: "Nan, Mae Chaem, khit", from: "Silpakorn thesis, Nan; Department of Sericulture", how: "shape", grid: [
             "....................1.1.",
             "...................11111",
             "..1.......1.......111.11",
             ".111.....111.....111....",
             "11.11...11.11...11......",
             "1...11.11...11.11.......",
             ".....111.....111........",
             "......1.......1........."
           ]};
LAI.nakKum = {thai: "ลายนาคกูม", say: "lai nak kum", en: "the naga curled round a diamond", town: "Mae Chaem",
              from: "ThaiJO larts 247740", how: "shape", grid: laiStamp(laiFrom(13, 13, function (i, j) {
                var d = Math.abs(i - 6) + Math.abs(j - 6);
                if (d === 6 && !(i === 0 && j === 6)) { return "1"; }
                if (i === 0 && (j === 5 || j === 7)) { return "1"; }
                return "";
              }), laiDiamond(2, "solid", "2"), 4, 4)};
LAI.khanSianSam = {thai: "ลายขันเสี้ยนสำ", say: "lai khan sian sam", en: "the offering tray on three tiers", town: "Mae Chaem",
                   from: "ThaiJO larts 247740", how: "shape", grid: [
                     "....1.1.1....",
                     ".....111.....",
                     "1111111111111",
                     ".11111111111.",
                     "...1111111...",
                     ".....111.....",
                     "...1111111...",
                     ".....111.....",
                     "..111111111..",
                     ".....111.....",
                     ".11111111111.",
                     "1111111111111"
                   ]};
LAI.khanSamAew = {thai: "ลายขันสามแอว", say: "lai khan sam aew", en: "the offering tray with three waists", town: "Mae Chaem",
                  from: "ThaiJO larts 247740", how: "shape", grid: [
                    "1111111111111",
                    ".11111111111.",
                    "....11111....",
                    ".....111.....",
                    "....11111....",
                    ".....111.....",
                    "....11111....",
                    ".....111.....",
                    "...1111111...",
                    ".11111111111."
                  ]};
LAI.khanAewOo = {thai: "ลายขันแอวอู", say: "lai khan aew oo", en: "the offering tray with a swollen waist", town: "Mae Chaem",
                 from: "ThaiJO larts 247740", how: "shape", grid: [
                   "1111111111111",
                   ".11111111111.",
                   "....11111....",
                   "...1111111...",
                   "..111111111..",
                   "...1111111...",
                   "....11111....",
                   "...1111111...",
                   ".11111111111."
                 ]};
LAI.khanDok = {thai: "ลายขันดอก", say: "lai khan dok", en: "the bowl of flowers offered at the temple", town: "Mueang Long",
               from: "SACIT (Kru Pranom Tapang)", how: "shape", grid: [
                 "..2.2.1.2.2..",
                 "...2.111.2...",
                 "..2.21.12.2..",
                 "....11111....",
                 "1111111111111",
                 ".11111111111.",
                 "...1111111...",
                 ".....111.....",
                 "...1111111...",
                 ".11111111111."
               ]};
LAI.komHupNok = {thai: "ลายโกมฮูปนก", say: "lai kom hup nok", en: "the lantern with a bird inside", town: "Mae Chaem, Nan",
                 from: "ThaiJO larts 247740; Silpakorn thesis, Nan", how: "shape", grid: laiStamp(laiFrom(19, 19, function (i, j) {
                   var d = Math.abs(i - 9) + Math.abs(j - 9);
                   if (d === 9) { return "1"; }
                   if (d === 7 && (i + j) % 2 === 0) { return "2"; }             // the hooks of its border, as dots of the second thread
                   return "";
                 }), LAI.nokKum.grid, 6, 5)};
LAI.komHuaMon = {thai: "ลายโกมหัวหมอน", say: "lai kom hua mon", en: "the lantern of a pillow's end: rings of diamonds",
                 town: "Mae Chaem", from: "ThaiJO larts 247740", how: "shape", grid: laiFrom(17, 21, function (i, j) {
                   var x = j - 10, y = i - 8, d = Math.abs(x) + Math.abs(y);
                   if (d <= 8 && d % 3 === 2) { return d === 2 ? "2" : "1"; }
                   if (d === 0) { return "2"; }
                   if (Math.abs(y) === 8 && Math.abs(x) >= 7 && Math.abs(x) <= 9) { return "1"; }     // the corner brackets
                   if (Math.abs(x) === 10 && Math.abs(y) <= 1) { return "1"; }
                   return "";
                 })};
LAI.lhakonLuang = {thai: "ลายหละกอนหลวง", say: "lai lha-kon luang", en: "the great Lampang: a big diamond, hooks within, chevrons round",
                   town: "Mae Chaem", from: "ThaiJO larts 247740", how: "shape", grid: laiFrom(19, 23, function (i, j) {
                     var x = j - 11, y = i - 9, d = Math.abs(x) + Math.abs(y);
                     if (d === 9 || d === 6) { return "1"; }
                     if (d === 3) { return "2"; }
                     if (d === 0) { return "2"; }
                     if (Math.abs(x) >= 10 && Math.abs(y) <= 1) { return "1"; }
                     if (d === 8 && Math.abs(y) === 1 && Math.abs(x) === 7) { return "2"; }   // the hooks turning in
                     return "";
                   })};
LAI.chiangSaenNoi = {thai: "ลายเจียงแสนหน้อย", say: "lai chiang saen noi", en: "little Chiang Saen: a lattice of diamonds with hooks",
                     town: "Mae Chaem", from: "ThaiJO larts 247740", how: "shape", grid: laiFrom(13, 26, function (i, j) {
                       var x = j % 13 - 6, y = i - 6, d = Math.abs(x) + Math.abs(y);
                       if (d === 6) { return "1"; }
                       if (d === 2) { return "2"; }
                       if (d === 4 && (x === 0 || y === 0)) { return "1"; }
                       return "";
                     })};
LAI.chanPaetKleeb = {thai: "ลายจันแปดกลีบ", say: "lai chan paet kleeb", en: "the eight-petalled flower", town: "Mueang Long, Nan",
                     from: "SACIT; Silpakorn thesis, Nan", how: "shape", grid: laiFrom(13, 13, function (i, j) {
                       var x = j - 6, y = i - 6, ax = Math.abs(x), ay = Math.abs(y);
                       if (ax + ay <= 1) { return "2"; }
                       if ((x === 0 || y === 0) && ax + ay <= 6 && ax + ay >= 3) { return "1"; }
                       if (ax === ay && ax >= 2 && ax <= 4) { return "1"; }
                       if ((ax === 1 && ay >= 3 && ay <= 5) || (ay === 1 && ax >= 3 && ax <= 5)) { return "1"; }
                       return "";
                     })};
LAI.dokChan = {thai: "ลายดอกจัน", say: "lai dok chan", en: "the nutmeg flower: a four-pointed star", town: "Mueang Long, khit",
               from: "SACIT; Department of Sericulture", how: "shape", grid: laiFrom(11, 11, function (i, j) {
                 var x = Math.abs(j - 5), y = Math.abs(i - 5);
                 if (x + y <= 2) { return "1"; }
                 if ((x === 0 && y <= 5) || (y === 0 && x <= 5)) { return "1"; }
                 if (x === 1 && y === 3 || y === 1 && x === 3) { return "2"; }
                 return "";
               })};
LAI.makNat = {thai: "ลายหมากนัด", say: "lai mak nat", en: "the pineapple: a lattice of diamonds with dots", town: "Mueang Long",
              from: "SACIT", how: "shape", grid: laiFrom(12, 24, function (i, j) {
                var a = (i + j) % 6, b = (j - i + 60) % 6;
                if (a === 0 || b === 0) { return "1"; }
                if (a === 3 && b === 3) { return "2"; }
                return "";
              })};
LAI.mook = {thai: "ลายมุก (ดอกมุก)", say: "lai mook", en: "the pearl flower: small diamonds of warp floats", town: "Mueang Long",
            from: "SACIT; Textile Atlas", how: "rule", warp: true, grid: laiFrom(10, 30, function (i, j) {
              var x = j % 6 - 2.5, y = i % 5 - 2;
              if (Math.abs(x) + Math.abs(y) <= 2 && (i + j) % 2 === 0) { return "1"; }
              return "";
            })};
LAI.sapaoLoiNam = {thai: "ลายสะเภาลอยน้ำ", say: "lai sapao loi nam", en: "the ship of merit afloat, a stupa aboard", town: "Mueang Long",
                   from: "SACIT (Kru Pranom Tapang)", how: "shape", grid: [
                     "......1......",
                     ".....111.....",
                     "......1......",
                     "....11111....",
                     "......1......",
                     "...1111111...",
                     "......1......",
                     "1.....1.....1",
                     "11....1....11",
                     ".11111111111.",
                     "..111111111..",
                     "2.2.2.2.2.2.2"
                   ]};
LAI.hangSapao = {thai: "ลายหางสะเปา", say: "lai hang sapao", en: "the ship's tail: pennants hanging to the hem, the ship to Mount Meru",
                 town: "Mae Chaem, Mueang Long, Nan", from: "Silpakorn thesis, Nan; SACIT", how: "shape", grid: (function () {
                   var top = laiRepeat(["1.....1", "11...11", ".11111.", "..111..", "...1..."], 4, 0);
                   var drops = laiFrom(9, 28, function (i, j) { return j % 7 === 3 ? (i % 2 === 0 ? (Math.floor(j / 7) % 2 ? "3" : "1") : "") : ""; });
                   return top.concat(drops);
                 })()};
LAI.saiYoi1 = {thai: "ลายสายย้อย (ก้ามปูหงายบนเปิด)", say: "lai sai yoi", en: "hanging tassels: an open crab's claw, upright",
               town: "Nan", from: "Silpakorn thesis, Nan", how: "chart", grid: (function () {
                 var top = laiRepeat(["1.....1", "1.....1", ".1...1.", "..111..", "...1..."], 4, 0);
                 return top.concat(laiFrom(6, 28, function (i, j) { return j % 7 === 3 && i % 2 === 1 ? "1" : ""; }));
               })()};
LAI.saiYoi2 = {thai: "ลายสายย้อย (ก้ามปูหงายบนปิด)", say: "lai sai yoi", en: "hanging tassels: a closed claw round a diamond",
               town: "Nan", from: "Silpakorn thesis, Nan", how: "chart", grid: (function () {
                 var top = laiRepeat(["1.....1", "1..2..1", ".12221.", "..121..", "...1..."], 4, 0);
                 return top.concat(laiFrom(6, 28, function (i, j) { return j % 7 === 3 && i % 2 === 1 ? "1" : ""; }));
               })()};
LAI.saiYoi4 = {thai: "ลายสายย้อย (ก้ามปูคว่ำบนปิด)", say: "lai sai yoi", en: "hanging tassels: a bar and hooks pointing down",
               town: "Nan", from: "Silpakorn thesis, Nan", how: "chart", grid: (function () {
                 var top = laiRepeat(["1111111", ".11111.", "1.111.1", "1..1..1", ".......".replace(/./g, ".")], 4, 0);
                 return top.concat(laiFrom(6, 28, function (i, j) { return (j % 7 === 0 || j % 7 === 6) && i % 2 === 0 ? "1" : (j % 7 === 3 && i % 2 === 1 ? "2" : ""); }));
               })()};
LAI.saiYoi5 = {thai: "ลายสายย้อย (รูปเลขสามไทย)", say: "lai sai yoi", en: "hanging tassels: the shape of the Thai figure 3 (๓)",
               town: "Nan", from: "Silpakorn thesis, Nan", how: "chart", grid: (function () {
                 var top = laiRepeat(["1..1..1", "1.1.1.1", ".1...1.", "...1...", "......."], 4, 0);
                 return top.concat(laiFrom(6, 28, function (i, j) { return j % 7 === 3 && i % 2 === 0 ? "1" : ""; }));
               })()};
LAI.kangPla = {thai: "ลายก้างปลา", say: "lai kang pla", en: "the fishbone: herringbone of the Nan river", town: "Nan",
               from: "Silpakorn thesis, Nan", how: "rule", grid: laiFrom(7, 28, function (i, j) {
                 var p = j % 7, y = i - 3;
                 if (y === 0) { return "1"; }
                 return Math.abs(y) === p - 1 && p > 1 ? "1" : "";
               })};
LAI.khruaDok = {thai: "ลายเครือดอก", say: "lai khruea dok", en: "the flowering vine: diamond flowers on a stepped stem",
                town: "Nan", from: "Silpakorn thesis, Nan", how: "chart", grid: laiFrom(9, 32, function (i, j) {
                  var p = j % 16, x = p - 8, stem = p < 8 ? 6 - Math.floor(p * 5 / 8) : 1 + Math.floor((p - 8) * 5 / 8);
                  if (i === stem) { return "1"; }
                  var fx = p < 8 ? 3 : 12, fy = p < 8 ? 3 : 6;
                  var d = Math.abs(p - fx) + Math.abs(i - fy);
                  if (d === 2) { return "2"; }
                  if (d === 0) { return "3"; }
                  return "";
                })};
LAI.maliLueai = {thai: "ลายมะลิเลื้อย", say: "lai mali lueai", en: "the creeping jasmine: a zigzag with a small hook at each turn",
                 town: "Mae Chaem, Mueang Long", from: "Textile Atlas; SACIT", how: "shape", grid: laiFrom(7, 32, function (i, j) {
                   var p = j % 8, h = p < 4 ? p : 8 - p, y = 5 - h;
                   if (i === y) { return "1"; }
                   if (p === 4 && (i === 0 && false)) { return "1"; }
                   if (p === 4 && i === 0) { return "2"; }
                   if ((p === 3 || p === 5) && i === 0) { return "2"; }
                   if (p === 0 && i === 6) { return "2"; }
                   return "";
                 })};
LAI.namLai = {thai: "ลายน้ำไหล", say: "lai nam lai", en: "flowing water: the Tai Lue's rivers, colour blocks stepping 2-3-4-5",
              town: "Tai Lue of Nan, Phayao, Chiang Rai", from: "Silpakorn thesis, Nan; ThaiJO", how: "rule", grid: laiFrom(14, 36, function (i, j) {
                var steps = [2, 3, 4, 5], shift = 0;
                for (var k = 0; k < (i % 7); k++) { shift += steps[k % 4]; }
                var band = Math.floor(i / 7), q = (j + (band % 2 ? -shift : shift) + 360) % 18;
                if (q < 6) { return "1"; }
                if (q < 9) { return "3"; }
                if (q < 15) { return "2"; }
                return "4";
              })};
LAI.phuKhao = {thai: "ลายภูเขา", say: "lai phu khao", en: "the mountains: interlocking peaks", town: "Tai Lue, Nan (Bo Suak)",
               from: "Silpakorn thesis, Nan", how: "shape", grid: laiFrom(8, 32, function (i, j) {
                 var p = j % 16, h = p < 8 ? p : 16 - p;
                 if (7 - i <= h) { return (Math.floor(j / 16) + (7 - i >= h - 1 ? 1 : 0)) % 2 ? "1" : "2"; }
                 return "";
               })};
LAI.that = {thai: "ลายธาตุ", say: "lai that", en: "the relic stupa: tiers to a spire", town: "Tai Lue", from: "Silpakorn thesis, Nan",
            how: "shape", grid: [
              "......1......",
              "......1......",
              ".....111.....",
              "......1......",
              ".....111.....",
              "....11111....",
              ".....111.....",
              "...1111111...",
              "....11111....",
              "..111111111..",
              ".11111111111.",
              "1111111111111"
            ]};
LAI.chang = {thai: "ลายช้าง (ขิด)", say: "lai chang", en: "the elephant, in khit", town: "khit of the north and the Lao",
             from: "Department of Sericulture", how: "shape", grid: [
               "....11111.......",
               "..1111111111.11.",
               ".11111111111111.",
               "1111111111111.11",
               "111111111111111.",
               "1111111111111.11",
               ".111111111111.11",
               ".111..111.....1.",
               ".11...11.....11.",
               ".11...11........",
               ".11...11........"
             ]};
LAI.ma = {thai: "ลายม้า (ขิด)", say: "lai ma", en: "the horse, in khit", town: "khit", from: "Department of Sericulture", how: "shape", grid: [
  "...........1..",
  "..........111.",
  ".........1111.",
  "1........111..",
  ".11111111111..",
  "..111111111...",
  "..11....11....",
  "..1.1...1.1...",
  "..1..1..1..1.."
]};
LAI.dokKaeo = {thai: "ลายดอกแก้ว", say: "lai dok kaeo", en: "the orange jasmine flower", town: "khit, Lamphun", from: "Department of Sericulture",
               how: "shape", grid: laiFlipDown(laiMirror([".....1", "....1.", "..1..1", ".1.111", "1.1111", ".1111.".slice(0, 5) + "1"]))};
LAI.prasat = {thai: "ลายหอปราสาท", say: "lai ho prasat", en: "the palace tower, the preaching throne", town: "khit",
              from: "Department of Sericulture", how: "shape", grid: [
                ".......1.......",
                "......111......",
                ".......1.......",
                ".....11111.....",
                "......1.1......",
                "....1111111....",
                ".....1...1.....",
                "...111111111...",
                "....1.1.1.1....",
                "..11111111111..",
                "..1.1.1.1.1.1..",
                "111111111111111"
              ]};
LAI.maiSin = {thai: "ลายหมายซิ่น", say: "lai mai sin", en: "the weaver's mark: two columns of small birds", town: "Mueang Long",
              from: "SACIT (Kru Pranom Tapang)", how: "shape", grid: (function () {
                var bird = ["..1.", ".111", "111.", ".1.."], out = [];
                for (var k = 0; k < 4; k++) { bird.forEach(function (r) { out.push(r + "..." + r); }); out.push("..........."); }
                return out;
              })()};

// The names, in an order to show them: the units of Nan, the bands, the figures, the lanterns and bowls, the hem.
var LAI_ORDER = ["nuay", "nuayHollow", "nuayNested", "nuayCross", "nuayDots", "kap", "kapNested", "kapPair", "kanKho", "kho2",
                 "kai", "kakabat", "fanPla", "fanPlaSolid", "kangPla", "buaLoy", "dokChan", "chanPaetKleeb", "dokKaeo", "makNat",
                 "mook", "kho", "khoS", "khruaKho", "kutKhoBet", "khruaDok", "maliLueai", "nok", "nokKhu", "nokKhuTon", "nokKum",
                 "hongPloi", "hongBi", "hongKhu", "nak", "nakKum", "chang", "ma", "khanSianSam", "khanSamAew", "khanAewOo",
                 "khanDok", "komHupNok", "komHuaMon", "lhakonLuang", "chiangSaenNoi", "sapaoLoiNam", "that", "prasat",
                 "phuKhao", "namLai", "saiYoi1", "saiYoi2", "saiYoi4", "saiYoi5", "hangSapao", "maiSin"];

// ---------- drawing the weave ----------
// A number in [0, 1) from integers, the same every time (the kit may not use Math.random unseeded).
function weaveHash(a, b, c) {
  var h = (a * 374761393 + b * 668265263 + (c || 0) * 2147483647) | 0;
  h = (h ^ (h >>> 13)) * 1274126177 | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// A colour made lighter (amount > 0) or darker (< 0), as an rgb() string.
function weaveShade(hex, amount) {
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function f(v) { return Math.max(0, Math.min(255, Math.round(amount > 0 ? v + (255 - v) * amount : v * (1 + amount)))); }
  return "rgb(" + f(r) + "," + f(g) + "," + f(b) + ")";
}

// The plain weave of the ground over a box: the ground colour, its weft picks as fine lines a shade apart, the warp
// faintly across them. cell: the width of a pattern float, so the ground's threads are to its scale.
// e.g. weaveGround(pen, 0, 0, 300, 120, WEAVE_DYES.black, 8, 1)
function weaveGround(brush, x, y, w, h, colour, cell, seed) {
  brush.fillStyle = colour;
  brush.fillRect(x, y, w, h);
  var pick = Math.max(1.2, cell * 0.31);
  for (var k = 0, yy = y; yy < y + h; k++, yy += pick) {               // the weft picks
    brush.fillStyle = k % 2 ? weaveShade(colour, 0.07 + 0.04 * weaveHash(k, 1, seed)) : weaveShade(colour, -0.1 * weaveHash(k, 2, seed));
    brush.fillRect(x, yy, w, Math.min(pick * 0.55, y + h - yy));
  }
  brush.globalAlpha = 0.18;                                            // the warp, faint across them
  brush.fillStyle = weaveShade(colour, -0.35);
  for (var xx = x; xx < x + w; xx += Math.max(1.5, cell * 0.34)) { brush.fillRect(xx, y, Math.max(0.5, cell * 0.06), h); }
  brush.globalAlpha = 1;
}

// One grid as woven cloth, its top-left at (x, y): each thread of the pattern a float over the ground, a little
// raised (lit above, shadowed below), not quite the same length or shade as its neighbour, as hand-picked jok is.
// cell: a float's width (its height is 0.62 of it: a pick is thinner than a float is long). palette: {ground,
// threads}; ground false to weave on what is there already. A warp float (look.warp) stands up instead.
// Gives back {w, h}, the size it took.
// e.g. weaveGrid(pen, LAI.nokKhu.grid, 40, 60, 10, WEAVE_PALETTES.maechaem)
function weaveGrid(brush, grid, x, y, cell, palette, look) {
  var o = look || {}, tall = cell * 0.62, rows = grid.length, cols = grid[0].length, seed = o.seed || 0;
  var w = cols * cell, h = rows * tall;
  if (palette.ground !== false && !o.noGround) { weaveGround(brush, x, y, w, h, palette.ground, cell, seed); }
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var ch = grid[i].charAt(j);
      if (ch === "." || ch === "") { continue; }
      var colour = palette.threads[(parseInt(ch, 10) - 1) % palette.threads.length];
      var wobble = weaveHash(i, j, seed), bx = x + j * cell, by = y + i * tall;
      var fw = o.warp ? cell * 0.5 : cell * (0.93 + 0.1 * wobble), fh = o.warp ? tall * 1.9 : tall * 0.8;
      var fx = o.warp ? bx + cell * 0.25 : bx - cell * 0.02 + (wobble - 0.5) * cell * 0.06, fy = o.warp ? by - tall * 0.45 : by + tall * 0.1;
      brush.fillStyle = weaveShade(colour, (wobble - 0.5) * 0.14);
      brush.beginPath();
      if (brush.roundRect) { brush.roundRect(fx, fy, fw, fh, Math.min(fw, fh) * 0.45); } else { brush.rect(fx, fy, fw, fh); }
      brush.fill();
      brush.fillStyle = weaveShade(colour, 0.32);                      // the lit top of the float
      brush.fillRect(fx + fw * 0.12, fy + fh * 0.08, fw * 0.76, Math.max(0.6, fh * 0.2));
      brush.fillStyle = "rgba(0, 0, 0, 0.28)";                         // its shadow on the ground under it
      brush.fillRect(fx + fw * 0.1, fy + fh, fw * 0.8, Math.max(0.5, tall * 0.1));
    }
  }
  return {w: w, h: h};
}

// Woven once and kept: a cloth is many thousands of floats, the same in every frame, so it is drawn on a sheet the
// first time it is asked for, at twice its size, and that sheet is laid down after (key: what makes it what it is).
var WEAVE_SHEETS = {};
function weaveKept(key, w, h, paint) {
  var sheet = WEAVE_SHEETS[key];
  if (!sheet) {
    sheet = document.createElement("canvas");
    sheet.width = Math.ceil(w * 2);
    sheet.height = Math.ceil(h * 2);
    var b = sheet.getContext("2d");
    b.scale(2, 2);
    paint(b);
    WEAVE_SHEETS[key] = sheet;
  }
  return sheet;
}

// The width in cells of a band of one grid repeated across cols, and the grid itself so repeated, centred.
function weaveAcross(grid, cols, gap) {
  var unit = grid[0].length + (gap || 0), count = Math.max(1, Math.floor((cols + (gap || 0)) / unit));
  var band = laiRepeat(grid, count, gap || 0), pad = Math.floor((cols - band[0].length) / 2);
  var left = new Array(Math.max(0, pad) + 1).join("."), right = new Array(Math.max(0, cols - band[0].length - pad) + 1).join(".");
  return band.map(function (r) { return (left + r + right).slice(0, cols); });
}

// ---------- the cloths ----------
// A swatch of one motif, repeated over a piece of its cloth, the warp's ends loose at its top and bottom.
// look: {motif (a key of LAI), palette (a key of WEAVE_PALETTES, or one of its own), cell, across, down (how many
// repeats), seed}. Set at (x, y), its top-left. Gives back {w, h}.
// e.g. clothSample(pen, 100, 100, {motif: "nokKhu", palette: "maechaem", cell: 9, across: 3, down: 2})
function clothSample(brush, x, y, look) {
  var o = look || {}, lai = LAI[o.motif || "nuay"], palette = typeof o.palette === "object" ? o.palette : WEAVE_PALETTES[o.palette || "maechaem"];
  var cell = o.cell || 8, across = o.across || 3, down = o.down || 2, g = lai.grid, gapC = 2, gapR = 2;
  var cols = across * g[0].length + (across + 1) * gapC, rows = down * g.length + (down + 1) * gapR;
  var w = cols * cell, h = rows * cell * 0.62, fringe = cell * 1.6;
  var key = ["sample", o.motif, JSON.stringify(palette), cell, across, down, o.seed || 0].join("|");
  var sheet = weaveKept(key, w, h + fringe * 2, function (b) {
    b.strokeStyle = weaveShade(palette.ground, 0.15);                  // the loose warp ends
    b.lineWidth = Math.max(0.6, cell * 0.08);
    for (var k = 0; k < cols * 3; k++) {
      var wx = (k + 0.5) * cell / 3, len = fringe * (0.55 + 0.45 * weaveHash(k, 9, o.seed || 0));
      b.beginPath(); b.moveTo(wx, fringe); b.lineTo(wx + (weaveHash(k, 3) - 0.5) * cell * 0.3, fringe - len); b.stroke();
      b.beginPath(); b.moveTo(wx, fringe + h); b.lineTo(wx + (weaveHash(k, 4) - 0.5) * cell * 0.3, fringe + h + len); b.stroke();
    }
    weaveGround(b, 0, fringe, w, h, palette.ground, cell, o.seed || 0);
    for (var r = 0; r < down; r++) {
      for (var c = 0; c < across; c++) {
        weaveGrid(b, g, (gapC + c * (g[0].length + gapC)) * cell, fringe + (gapR + r * (g.length + gapR)) * cell * 0.62, cell,
                  {ground: false, threads: palette.threads}, {warp: lai.warp, seed: r * 7 + c});
      }
    }
  });
  brush.drawImage(sheet, x, y - fringe, w, h + fringe * 2);
  return {w: w, h: h};
}

// The rows of a teen jok, top to bottom, by town: each [what, height in cells or a LAI key, palette's thread for a
// plain stripe]. The Nan thesis gives the order: the yellow nail stripe (lep lueang), the upper rows, a thin band,
// the main row of lanterns (kom) and offering bowls (khan) one after the other, a thin band, the lower row, the
// hanging tassels (sai yoi, or the ship's tail, hang sapao), and the plain foot (teen daeng).
var TEEN_JOK_ROWS = {
  maechaem: [["stripe", 2, "1"], ["gap", 1], ["band", "nokKhu"], ["gap", 1], ["band", "fanPla"], ["gap", 1], ["main", ["komHupNok", "khanSianSam"]],
             ["gap", 1], ["band", "fanPla"], ["gap", 1], ["band", "kakabat"], ["gap", 1], ["band", "hangSapao"], ["foot", 6, "red"]],
  nan: [["stripe", 2, "2"], ["gap", 1], ["band", "kap"], ["gap", 1], ["band", "kho2"], ["main", ["komHupNok", "khanSamAew"]], ["band", "kho2"],
        ["gap", 1], ["band", "buaLoy"], ["gap", 1], ["band", "saiYoi2"], ["foot", 6, "red"]],
  long: [["stripe", 2, "1"], ["gap", 1], ["band", "maliLueai"], ["gap", 1], ["main", ["nokKhuTon", "khanDok"]], ["gap", 1], ["band", "chanPaetKleeb"],
         ["gap", 1], ["band", "hangSapao"], ["foot", 5, "red"]]
};

// The decorated hem of a sin (teen jok), across width w, set at (x, y), its top-left: each row of TEEN_JOK_ROWS of
// its town woven across. look: {town: "maechaem", "nan" or "long", palette, cell, seed}. Gives back {w, h}.
// e.g. teenJok(pen, 60, 400, 900, {town: "maechaem", cell: 7})
function teenJok(brush, x, y, w, look) {
  var o = look || {}, town = o.town || "maechaem", cell = o.cell || 7, tall = cell * 0.62;
  var palette = o.palette || WEAVE_PALETTES[town === "long" ? "long" : town === "nan" ? "nan" : "maechaem"];
  var cols = Math.floor(w / cell), rows = TEEN_JOK_ROWS[town], plan = [], total = 0;
  rows.forEach(function (r) {
    var grid;
    if (r[0] === "band") { grid = weaveAcross(LAI[r[1]].grid, cols, 1); }
    else if (r[0] === "main") {                                       // lantern, bowl, lantern, bowl: one row, their middles level
      var a = LAI[r[1][0]].grid, b = LAI[r[1][1]].grid, tallest = Math.max(a.length, b.length);
      function lift(g) { var pad = Math.floor((tallest - g.length) / 2); return laiBlank(pad, g[0].length).concat(g, laiBlank(tallest - g.length - pad, g[0].length)); }
      var unit = laiPair(lift(a).map(function (row) { return row + ".."; }), lift(b).map(function (row) { return row + ".."; }));
      unit = unit.map(function (row) { return row.slice(0, a[0].length + 2 + b[0].length + 2); });
      grid = weaveAcross(unit, cols, 0);
      grid = laiBlank(1, cols).concat(grid, laiBlank(1, cols));
    }
    else if (r[0] === "stripe") { grid = laiFrom(r[1], cols, function () { return r[2]; }); }
    else if (r[0] === "foot") { plan.push({foot: true, rows: r[1]}); total += r[1]; return; }
    else { grid = laiBlank(r[1], cols); }
    plan.push({grid: grid});
    total += grid.length;
  });
  var h = total * tall, key = ["teenjok", town, JSON.stringify(palette), cell, cols, o.seed || 0].join("|");
  var sheet = weaveKept(key, cols * cell, h, function (b) {
    var at = 0;
    plan.forEach(function (p, k) {
      if (p.foot) { weaveGround(b, 0, at * tall, cols * cell, p.rows * tall, WEAVE_DYES.red, cell, 5); at += p.rows; return; }
      weaveGrid(b, p.grid, 0, at * tall, cell, palette, {seed: k});
      at += p.grid.length;
    });
  });
  brush.drawImage(sheet, x, y, cols * cell, h);
  return {w: cols * cell, h: h};
}

// A whole sin, a tube skirt laid flat: its waist (hua sin, white and a band of red), its body (tua sin) in even
// stripes (sin ta) or covered with pearl flowers (mook, Mueang Long's), and the teen jok sewn on below.
// look: {town, w (its width), body ("stripes" or "mook"), cell}. Set at (x, y), its top-left. Gives back {w, h}.
// e.g. sinCloth(pen, 100, 80, {town: "maechaem", w: 420})
function sinCloth(brush, x, y, look) {
  var o = look || {}, w = o.w || 420, cell = o.cell || 4, town = o.town || "maechaem";
  var waist = w * 0.22, body = w * 0.62;
  weaveGround(brush, x, y, w, waist * 0.7, WEAVE_DYES.white, cell, 1);           // the waist: white cotton
  weaveGround(brush, x, y + waist * 0.7, w, waist * 0.3, WEAVE_DYES.red, cell, 2);  // and red below it
  if (o.body === "mook" || (!o.body && town === "long")) {
    var key = ["sinbody", town, w, cell].join("|");
    var cols = Math.floor(w / cell), rows = Math.floor(body / (cell * 0.62));
    var sheet = weaveKept(key, cols * cell, rows * cell * 0.62, function (b) {
      var grid = laiFrom(rows, cols, function (i, j) { return LAI.mook.grid[i % 10].charAt(j % 30); });
      weaveGrid(b, grid, 0, 0, cell, {ground: WEAVE_DYES.indigo, threads: [WEAVE_DYES.cream]}, {warp: true});
    });
    brush.drawImage(sheet, x, y + waist, cols * cell, body);
  } else {
    var stripes = town === "nan" ? [WEAVE_DYES.black, WEAVE_DYES.magenta, WEAVE_DYES.black, WEAVE_DYES.yellow, WEAVE_DYES.indigo]
                                 : [WEAVE_DYES.black, WEAVE_DYES.red, WEAVE_DYES.black, WEAVE_DYES.green, WEAVE_DYES.black, WEAVE_DYES.yellow];
    var band = body / 18;
    for (var k = 0; k < 18; k++) { weaveGround(brush, x, y + waist + k * band, w, band + 0.5, stripes[k % stripes.length], cell, 10 + k); }
    if (town === "nan") { weaveGrid(brush, weaveAcross(LAI.kanKho.grid, Math.floor(w / cell), 1), x, y + waist + body * 0.48, cell, WEAVE_PALETTES.nan, {noGround: true}); }
  }
  var hem = teenJok(brush, x, y + waist + body, w, {town: town, cell: cell * 1.1});
  return {w: w, h: waist + body + hem.h};
}

// A sabai, a shoulder cloth, hung over a bamboo pole: it falls in two layers, the near one longer, each end woven
// with bands of khit and finished with a fringe; it sways a little in the air (t). look: {palette ("khit" for
// indigo on white, or a town's), w (its width), drop (the near layer's length), motifs (the khit bands, keys of
// LAI), body (its plain colour), t}. Standing on the pole at (x, y), the middle of the pole.
// e.g. sabaiCloth(pen, 400, 120, {palette: "khit", motifs: ["kho", "chang"], t: t})
function sabaiCloth(brush, x, y, look) {
  var o = look || {}, w = o.w || 150, drop = o.drop || 420, cell = o.cell || 4.2, t = o.t || 0;
  var palette = typeof o.palette === "object" ? o.palette : WEAVE_PALETTES[o.palette || "khit"];
  var motifs = o.motifs || ["kho", "dokChan"], body = o.body || palette.ground;
  var cols = Math.floor(w / cell), key = ["sabai", JSON.stringify(palette), motifs.join(","), cols, cell, body].join("|");
  var end = weaveKept(key, cols * cell, 400, function (b) {                     // one woven end, kept
    var at = 0;
    weaveGround(b, 0, 0, cols * cell, 400, body, cell, 3);
    motifs.forEach(function (m, k) {
      var band = weaveAcross(LAI[m].grid, cols - 2, 1).map(function (r) { return "." + r + "."; });
      at += 2;
      b.fillStyle = palette.threads[1 % palette.threads.length];
      b.fillRect(0, at * cell * 0.62, cols * cell, cell * 0.62 * 1.2);
      at += 2;
      weaveGrid(b, band, 0, at * cell * 0.62, cell, {ground: false, threads: palette.threads}, {seed: k});
      at += band.length;
    });
    b.fillStyle = palette.threads[1 % palette.threads.length];
    b.fillRect(0, (at + 2) * cell * 0.62, cols * cell, cell * 0.62 * 1.2);
  });
  var endTall = Math.min(end.height / 2, drop * 0.45);
  var sway = Math.sin(t * 1.3) * 0.02;
  function layer(dx, length, shade) {                                           // one layer, hanging, the end at its foot
    brush.save();
    brush.translate(x + dx, y + 4);
    brush.rotate(sway);
    brush.fillStyle = body;
    brush.fillRect(-cols * cell / 2, 0, cols * cell, length - endTall);
    weaveGround(brush, -cols * cell / 2, 0, cols * cell, length - endTall, body, cell, 7);
    brush.drawImage(end, 0, 0, end.width, endTall * 2, -cols * cell / 2, length - endTall, cols * cell, endTall);
    brush.strokeStyle = palette.threads[0];                                    // the fringe
    brush.lineWidth = 1.2;
    for (var k = 0; k <= cols; k += 2) {
      var fx = -cols * cell / 2 + k * cell, fl = cell * (4 + 2 * weaveHash(k, 11)), lean = Math.sin(t * 2 + k) * cell * 0.3;
      brush.beginPath(); brush.moveTo(fx, length); brush.lineTo(fx + lean, length + fl); brush.stroke();
    }
    if (shade) { brush.fillStyle = shade; brush.fillRect(-cols * cell / 2, 0, cols * cell, length); }
    brush.restore();
  }
  layer(cell * 3, drop * 0.78, "rgba(0, 0, 0, 0.22)");                         // the far layer, shorter, in shadow
  layer(0, drop, null);
  brush.strokeStyle = "#8a6a3a";                                                // the bamboo pole, and its joints
  brush.lineWidth = 9;
  brush.lineCap = "round";
  brush.beginPath(); brush.moveTo(x - w * 0.9, y); brush.lineTo(x + w * 0.9, y); brush.stroke();
  brush.strokeStyle = "#6a5028";
  brush.lineWidth = 2;
  [-0.55, 0.1, 0.7].forEach(function (f) { brush.beginPath(); brush.moveTo(x + w * f, y - 4.5); brush.lineTo(x + w * f, y + 4.5); brush.stroke(); });
}

// ---------- a cloth thread by thread, in the wind ----------
// The colour of the weft at warp i of pick j in the Tai Lue's flowing water (lai nam lai), woven by koh luang, the
// interlocking tapestry weave: each colour a block that steps across 2, 3, 4, then 5 warps from one group of picks
// to the next (the Nan thesis), up and then back, so the blocks rise and fall in stepped waves; a few plain picks
// of red between two bands. colours: the blocks' colours in turn; band: how many picks to a band of water.
// e.g. namLaiWeft(40, 12, [WEAVE_DYES.indigo, WEAVE_DYES.white, WEAVE_DYES.yellow, WEAVE_DYES.green], 48)
function namLaiWeft(i, j, colours, band) {
  var b = band || 48, inBand = j % b, which = Math.floor(j / b);
  if (inBand >= b - 4) { return inBand >= b - 3 && inBand < b - 1 ? WEAVE_DYES.white : WEAVE_DYES.red; }   // the stripes between
  var steps = [2, 3, 4, 5], group = Math.floor(inBand / 3), rise = group % 8, shift = 0;
  var climb = rise < 4 ? rise : 8 - rise;                                   // up four steps and down again
  for (var k = 0; k < climb; k++) { shift += steps[k]; }
  var width = 18, q = ((i + (which % 2 ? shift : -shift)) % (width * colours.length) + width * colours.length) % (width * colours.length);
  return colours[Math.floor(q / width)];
}

// A length of cloth hung from a pole, every warp and every weft drawn as a line, the weft going over and under the
// warp as plain weave does, and the wind going through it. The wind is travelling waves, each a sum of sines of
// where a thread is on the cloth and of the second t (the same picture for the same second, whatever came before:
// the kit's films are drawn a frame at a time in any order): nothing moves at the pole, more toward the hem; a gust
// swells and dies; the hem swings. Each patch of cloth is lit by how it faces the light. look: {warps, picks (how
// many threads each way), gap (pixels between threads), weft (a function (i, j) giving the weft's colour: by
// default the flowing water), warp (the warp's colour), wind (0 still, 1 a good breeze)}. Hung at (x, y), the
// middle of the pole. Gives back {w, h}, its size when still.
// e.g. threadCloth(pen, 960, 120, t, {warps: 150, picks: 240, gap: 4, wind: 1})
function threadCloth(brush, x, y, t, look) {
  var o = look || {}, nw = o.warps || 150, np = o.picks || 260, gap = o.gap || 3.2, wind = o.wind === undefined ? 1 : o.wind;
  var colours = o.colours || [WEAVE_DYES.indigo, WEAVE_DYES.white, WEAVE_DYES.yellow, WEAVE_DYES.green, WEAVE_DYES.pink];
  var weft = o.weft || function (i, j) { return namLaiWeft(i, j, colours, 48); };
  var warpColour = o.warp || "#d8ccb0", W = (nw - 1) * gap, H = (np - 1) * gap * 0.7, left = x - W / 2;
  var gust = wind * (0.65 + 0.35 * Math.sin(t * 0.7) * Math.sin(t * 0.23 + 1));
  function place(u, v) {                                                    // u across 0..1, v down 0..1: where it is, and its depth
    var free = Math.pow(v, 1.25);
    var z = free * gust * (40 * Math.sin(2 * Math.PI * (u * 1.1 - v * 0.9) - t * 2.6) + 17 * Math.sin(2 * Math.PI * (u * 2.6 + v * 0.4) - t * 4.1 + 1.3)
                           + 9 * Math.sin(2 * Math.PI * (v * 2.2) - t * 3.3));
    var lean = free * gust * 34, swing = Math.pow(v, 2) * gust * 26 * Math.sin(t * 1.1 + 0.4);   // blown downwind, and swinging
    return [left + u * W + z * 0.45 + lean + swing, y + v * H - Math.abs(z) * 0.16 * v, z];
  }
  var P = [];                                                               // every crossing, placed
  for (var j = 0; j < np; j++) {
    var row = [];
    for (var i = 0; i < nw; i++) { row.push(place(i / (nw - 1), j / (np - 1))); }
    P.push(row);
  }
  brush.save();
  brush.lineCap = "round";
  brush.strokeStyle = weaveShade(warpColour, -0.25);                        // the warp: one line each, top to hem
  brush.lineWidth = gap * 0.42;
  brush.beginPath();
  for (var i2 = 0; i2 < nw; i2++) {
    brush.moveTo(P[0][i2][0], P[0][i2][1]);
    for (var j2 = 1; j2 < np; j2++) { brush.lineTo(P[j2][i2][0], P[j2][i2][1]); }
  }
  brush.stroke();
  var paths = {};                                                           // the weft: a line a pick, a path a colour
  for (var j3 = 0; j3 < np; j3++) {
    for (var i3 = 0; i3 < nw - 1; i3++) {
      var c = weft(i3, j3);
      var p = paths[c] || (paths[c] = new Path2D());
      p.moveTo(P[j3][i3][0], P[j3][i3][1]);
      p.lineTo(P[j3][i3 + 1][0], P[j3][i3 + 1][1]);
    }
  }
  Object.keys(paths).forEach(function (c) {                              // each pick a round yarn: its edges a shade
    brush.lineWidth = gap * 0.86;                                           // darker, its crown a shade lighter
    brush.strokeStyle = weaveShade(c, -0.22);
    brush.stroke(paths[c]);
    brush.lineWidth = gap * 0.42;
    brush.strokeStyle = weaveShade(c, 0.1);
    brush.stroke(paths[c]);
  });
  brush.strokeStyle = warpColour;                                           // and the warp over the weft at every other crossing
  brush.lineWidth = gap * 0.3;
  brush.beginPath();
  for (var j4 = 0; j4 < np - 1; j4++) {
    for (var i4 = (j4 % 2); i4 < nw; i4 += 2) {
      var a = P[j4][i4], b = P[j4 + 1][i4];
      brush.moveTo(a[0] + (b[0] - a[0]) * 0.25, a[1] + (b[1] - a[1]) * 0.25);
      brush.lineTo(a[0] + (b[0] - a[0]) * 0.5, a[1] + (b[1] - a[1]) * 0.5);
    }
  }
  brush.globalAlpha = 0.38;
  brush.stroke();
  brush.globalAlpha = 1;
  var step = 2;                                                             // the light on each patch, by its slope
  for (var j5 = 0; j5 < np - step; j5 += step) {
    for (var i5 = 0; i5 < nw - step; i5 += step) {
      var p00 = P[j5][i5], p10 = P[j5][i5 + step], p01 = P[j5 + step][i5], p11 = P[j5 + step][i5 + step];
      var slope = ((p10[2] - p00[2]) * 0.7 - (p01[2] - p00[2]) * 0.5) / (step * gap);
      var light = Math.max(-1, Math.min(1, slope * 3.2));
      brush.fillStyle = light > 0 ? "rgba(255, 246, 225, " + (light * 0.28).toFixed(3) + ")" : "rgba(20, 12, 30, " + (-light * 0.3).toFixed(3) + ")";
      brush.beginPath();
      brush.moveTo(p00[0], p00[1]); brush.lineTo(p10[0], p10[1]); brush.lineTo(p11[0], p11[1]); brush.lineTo(p01[0], p01[1]);
      brush.closePath();
      brush.fill();
    }
  }
  brush.strokeStyle = weaveShade(warpColour, 0.1);                          // the warp's ends hanging below the hem
  brush.lineWidth = gap * 0.35;
  brush.beginPath();
  for (var i6 = 0; i6 < nw; i6 += 2) {
    var e = P[np - 1][i6], dangle = gap * (5 + 3 * weaveHash(i6, 17));
    brush.moveTo(e[0], e[1]);
    brush.lineTo(e[0] + Math.sin(t * 3 + i6 * 0.3) * gap * gust, e[1] + dangle);
  }
  brush.stroke();
  weaveBeam(brush, left - 40, y - 4, left + W + 40, y - 4, 12, "#8a6a3a");   // the bamboo pole
  brush.fillStyle = "#6a5028";
  for (var k6 = 0; k6 < 9; k6++) { var lx = left + (k6 / 8) * W; brush.beginPath(); brush.ellipse(lx, y - 1, 5, 9, 0, 0, Math.PI * 2); brush.fill(); }   // the loops it hangs by
  brush.restore();
  return {w: W, h: H};
}

// ---------- the women at work ----------
var WEAVE_WOOD = "#7a4f2a", WEAVE_DARK = "#4a2e18", WEAVE_THREAD = "#efe2c2";

function weaveBeam(brush, x1, y1, x2, y2, w, colour) {
  brush.strokeStyle = colour || WEAVE_WOOD;
  brush.lineWidth = w;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(x1, y1);
  brush.lineTo(x2, y2);
  brush.stroke();
}

// The weaver herself, drawn on the brush (person() draws on the kit's pen).
function weavePerson(brush, x, y, look) {
  var keep = pen;
  pen = brush;
  try { return person(x, y, look); } finally { pen = keep; }
}

// A woman weaving at the frame loom (huk, ki) under the house, facing right: she sits on the loom's bench, her feet
// on the treadles (klong klaeng), the cloth she has woven rolled on the breast beam (mai ok ma) at her lap, the warp
// running back to the far beam, the heddles (khao) hung from the top beam on their pulleys. In a second (t) she
// throws the shuttle (krasuai) through, steps to change the shed, and pulls the beater (fuem) home twice. look:
// {work: "jok" to pick a jok pattern by hand with a porcupine quill instead, leaning in, the beater left back;
// weaver: a look for person(); cloth: a town of TEEN_JOK_ROWS for the roll}. Standing on (x, base); size 1 is the
// kit's own scale.
// e.g. frameLoom(pen, 600, 900, 1, t)
function frameLoom(brush, x, base, size, t, look) {
  var o = look || {}, s = size || 1, jok = o.work === "jok";
  var cycle = (t % 2) / 2;                                                       // two seconds a pick
  var beat = jok ? 0 : Math.max(0, Math.cos(cycle * Math.PI * 4)) * (cycle > 0.5 ? 1 : 0);   // struck home twice
  var shuttle = jok ? -1 : (cycle < 0.4 ? cycle / 0.4 : -1);
  var tread = jok ? 0 : (cycle < 0.45 ? 1 : -1);
  brush.save();
  brush.translate(x, base);
  brush.scale(s, s);
  var seat = -112, lap = -150, top = -330, back = 320, reed = 120 - beat * 34;
  weaveBeam(brush, -60, 0, -60, seat + 4, 8); weaveBeam(brush, 30, 0, 30, seat + 4, 8);        // the bench
  weaveBeam(brush, -78, seat, 48, seat, 11);
  weaveBeam(brush, 70, 0, 70, top, 11); weaveBeam(brush, back, 0, back, top, 11);             // the frame
  weaveBeam(brush, 58, top + 4, back + 14, top + 4, 12);
  weaveBeam(brush, 70, -66, back, -66, 6, WEAVE_DARK);
  [0, 1].forEach(function (k) {                                                 // the treadles: one down, one up
    var down = (k === 0 ? tread : -tread) * 7;
    weaveBeam(brush, 175 + k * 18, -6, 45 + k * 10, -26 + down, 5, WEAVE_DARK);
  });
  brush.strokeStyle = WEAVE_THREAD;                                             // the warp, from the reed to the far beam
  brush.lineWidth = 1.6;
  for (var k = 0; k < 6; k++) {
    var open = jok ? 0 : (k % 2 ? 1 : -1) * 6 * (1 - beat);
    brush.beginPath(); brush.moveTo(reed, lap - 6 + k * 1.6 + open * 0.3); brush.lineTo(210, lap - 8 + k * 1.6 + open); brush.lineTo(back - 6, lap - 12 + k * 1.2); brush.stroke();
  }
  brush.fillStyle = WEAVE_DARK; brush.beginPath(); brush.arc(back - 6, lap - 10, 12, 0, Math.PI * 2); brush.fill();   // the far beam
  [200, 226].forEach(function (hx, k) {                                         // the heddles on their pulleys
    var lift = jok ? 0 : (k % 2 ? 1 : -1) * 5 * tread;
    weaveBeam(brush, hx, top + 6, hx, lap - 38 + lift, 2, WEAVE_DARK);
    brush.fillStyle = WEAVE_DARK; brush.beginPath(); brush.arc(hx, top + 14, 6, 0, Math.PI * 2); brush.fill();
    brush.strokeStyle = WEAVE_DARK; brush.lineWidth = 3; brush.strokeRect(hx - 11, lap - 40 + lift, 22, 26);
  });
  var clothKey = o.cloth || "maechaem";                                         // the cloth woven, from the reed to her lap
  var roll = weaveKept("loomcloth|" + clothKey, 120, 40, function (b) {
    teenJok(b, 0, 0, 120, {town: clothKey, cell: 2.6});
  });
  brush.drawImage(roll, 0, 0, roll.width, roll.height * 0.5, 66, lap - 9, reed - 66, 14);
  brush.fillStyle = WEAVE_DYES.red; brush.beginPath(); brush.arc(68, lap + 4, 14, 0, Math.PI * 2); brush.fill();   // its roll
  brush.fillStyle = WEAVE_DYES.yellow; brush.fillRect(56, lap + 1, 24, 3);
  weaveBeam(brush, reed + 12, top + 6, reed, lap + 22, 3, WEAVE_DARK);          // the beater hanging from the top beam
  weaveBeam(brush, reed, lap - 24, reed, lap + 24, 8);
  if (shuttle >= 0) {                                                           // the shuttle, through the shed
    var sx = 150 + Math.sin(shuttle * Math.PI) * 40;
    brush.fillStyle = "#a8743c"; brush.beginPath(); brush.ellipse(sx, lap - 4, 16, 4, 0, 0, Math.PI * 2); brush.fill();
  }
  var who = Object.assign({floor: "astride", size: 1, smile: 0.7, id: o.id}, o.weaver || {});
  if (jok) {                                                                    // picking jok: leaning in, the quill in her near hand
    var pick = 0.5 + 0.5 * Math.sin(t * 3);
    Object.assign(who, {bend: 0.25, reachB: [reed + 22 + pick * 30, lap - 6], reachA: [reed + 14, lap - 2]});
  } else {
    Object.assign(who, {reachA: [reed, lap - 10], reachB: [reed - 2, lap + 6]});
  }
  weavePerson(brush, -10, seat, cast("weaver", who));
  if (jok) {                                                                    // the porcupine quill, black and white
    var px = reed + 22 + (0.5 + 0.5 * Math.sin(t * 3)) * 30;
    weaveBeam(brush, px - 4, lap - 2, px + 26, lap - 16, 2.4, "#2a2420");
    weaveBeam(brush, px + 10, lap - 9, px + 26, lap - 16, 2.4, "#ece6da");
  }
  brush.restore();
}

// A woman spinning cotton at the wheel (phian, la, nai), as the sources tell it: she sits on the floor beside it,
// her right hand turns the big wheel by its rim, and her left hand draws the roll of carded cotton (hang fai) back
// from the tip of the iron spindle (lek nai) toward her body, the thread twisting as it comes; then she lets it wind
// on. Facing right, her right hand the near one. Standing on (x, base); size 1 the kit's own scale; t the second.
// e.g. spinningWheel(pen, 400, 900, 1, t)
function spinningWheel(brush, x, base, size, t, look) {
  var o = look || {}, s = size || 1;
  brush.save();
  brush.translate(x, base);
  brush.scale(s, s);
  var cx = 118, cy = -104, r = 62, turn = t * 2.4;
  var cycle = (t % 3) / 3, draw = cycle < 0.75 ? cycle / 0.75 : 1 - (cycle - 0.75) / 0.25;
  weaveBeam(brush, -14, -4, 200, -4, 11, WEAVE_DARK);                            // the base, on the floor
  weaveBeam(brush, cx, -4, cx, cy, 9); weaveBeam(brush, 26, -4, 26, -34, 7);    // the wheel's post, the spindle's
  brush.strokeStyle = WEAVE_WOOD; brush.lineWidth = 6;
  brush.beginPath(); brush.arc(cx, cy, r, 0, Math.PI * 2); brush.stroke();      // the wheel: a rim of bamboo strips
  brush.lineWidth = 2; brush.beginPath(); brush.arc(cx, cy, r - 6, 0, Math.PI * 2); brush.stroke();
  for (var k = 0; k < 8; k++) {                                                 // its spokes, turning
    var a = turn + k * Math.PI / 4;
    weaveBeam(brush, cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.6);
  }
  brush.strokeStyle = WEAVE_THREAD; brush.lineWidth = 1.4;                      // the band from the wheel to the spindle
  brush.beginPath(); brush.moveTo(cx + 4, cy - r); brush.lineTo(26, -40); brush.lineTo(cx + 4, cy + r); brush.stroke();
  weaveBeam(brush, -6, -40, 44, -40, 3, "#3a3a3a");                             // the iron spindle, its tip toward her
  brush.fillStyle = WEAVE_THREAD; brush.beginPath(); brush.ellipse(32, -40, 9, 5, 0, 0, Math.PI * 2); brush.fill();   // the yarn on it
  var grip = Math.PI + 0.35 * Math.sin(t * 2.4);                                // her right hand on the near edge of the rim, going with it
  var hx = cx + Math.cos(grip) * r, hy = cy + Math.sin(grip) * r;
  var fx = -6 - draw * 40, fy = -42 - draw * 50;                                // her left hand, drawing back toward her
  brush.strokeStyle = WEAVE_THREAD; brush.lineWidth = 1.5;
  brush.beginPath(); brush.moveTo(-6, -40); brush.lineTo(fx, fy); brush.stroke();   // the thread, twisting
  weavePerson(brush, -14, 0, cast("weaver", Object.assign({floor: "side", size: 1, smile: 0.7, reachB: [hx, hy], reachA: [fx - 4, fy], id: o.id}, o.weaver || {})));
  brush.fillStyle = "#fbf8ef";                                                  // the cotton roll in her left hand
  brush.beginPath(); brush.ellipse(fx - 12, fy - 2, 14, 5, -0.5, 0, Math.PI * 2); brush.fill();
  brush.restore();
}
