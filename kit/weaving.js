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
//   LAI             the motifs, each a grid of threads with its Thai name, shape, town and source, and what it
//                   means where a source says (means, realm, meansFrom: LAI_MEANS, below the motifs)
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
LAI.kho = {thai: "ลายขอ", say: "lai kho", en: "the hook: a stepped scroll", town: "Nan, Mae Chaem, khit",
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
LAI.nokKhu = {thai: "ลายนกคู่", say: "lai nok khu", en: "paired birds facing a flower", town: "Nan, Mae Chaem",
              from: "Silpakorn thesis, Nan; SACIT", how: "chart", grid: laiPair(LAI.nok.grid, [
                "..2..", ".222.", "..2..", ".....", "..1..", ".111.", "11111", ".111.", "..1..", "..1..", ".111."
              ])};
LAI.nokKhuTon = {thai: "ลายนกคู่กินน้ำร่วมต้น", say: "lai nok khu kin nam ruam ton", en: "two birds drinking from the same tree",
                 town: "Mueang Long", from: "SACIT (Kru Pranom Tapang)", how: "shape", grid: laiPair(LAI.nok.grid.map(function (r) {
                   return r.slice(0, 11) + ".";
                 }), [".1.1.", "..1..", "11111", "..1..", "1.1.1", ".111.", "..1..", "..1..", ".111.", "11111", ".111."])};
LAI.nokKum = {thai: "ลายนกกูม", say: "lai nok kum", en: "the brooding quail", town: "Mae Chaem",
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
LAI.nak = {thai: "ลายนาค", say: "lai nak", en: "the naga, the water serpent",
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

// ---------- what the motifs mean ----------
// What a motif means, only where a source says so in its own words: from the NotebookLM notebook "Lanna Thai weaving
// iconography: symbols, archetypes and patterns" (2026-10-28, 25 sources), each meaning then found in the source's
// own text, which docs/sources/weaving_meanings.md quotes (owner, 2026-10-28: the kit carries what its symbols
// mean). Three meanings the kit had before (the hook "holding fast to fortune", paired birds "faithfulness", the
// quail "care of the home") are in none of the sources of either weaving notebook: they were taken out.
// A meaning is said of a people or a town, and the source says which: a Tai Lue reading is not a Tai Yuan one.
// Most of the motifs have none, and that is the sources' own word: the Nan thesis calls the units (the diamond, the
// triangle, the hook, the zigzag) the base of the others, "which may carry no meaning" (อาจไม่มีความหมายใด ๆ); a
// meaning comes with the figures made of them.
//   means      what it stands for, in a sentence, or null
//   realm      where Tai cosmology puts it, as the Tai Lue sources give it: "sky" above (the realm of birds), "earth"
//              in the middle (the Mom, the lion), "underworld" below (snakes and naga); or null
//   meansFrom  the sources of both
var LAI_SOURCES = {
  boSuak: "Silpakorn thesis, Nan: the meanings of the Bo Suak weavers' group",
  lue: "Silpakorn thesis, Tai Lue (Warusa Uttara, 2567)",
  chiangKham: "ThaiJO hspbru 277661: Tai Lue cloth of Chiang Kham, its semiotics",
  maeChaem: "ThaiJO larts 247740 (Mae Chaem)",
  thaiLao: "ThaiJO LiberalJ 1307: symbols of Thai and Lao cloth",
  mueangNgoen: "CMU thesis: the Tai Lue cloth of Mueang Ngoen (ch. 4)",
  banner: "The Buddhist Banner: the Tai Lue tung (ResearchGate 368320260)",
  long: "Department of Sericulture: the jok of Mueang Long",
  chiangRai: "Chiang Rai Database, Mae Fah Luang University: the cloth and dress of the Tai Yuan",
  nanCheck: "Nan identity (nanidentity.com): the cloths of Nan, the ta saeng and ta kong wrap",
  fineArts: "CMU Journal of Fine Arts 1(1): the dress of the Lanna Tai Yuan (Manop Manasaem)",
  damrong: "Damrong Journal 20(2), Silpakorn: the tung jai and the pha chet (Natchanoke Taengtabtim, 2021)",
  hatSiao: "Silpakorn architecture proceedings 2016: the Tai Phuan weaving of Ban Hat Siao",
  mcintosh: "Textiles Asia 4(1), 2012: Tai Yuan textiles of Thailand (Linda S. McIntosh)",
  maeChaemJok: "Department of Sericulture: the jok of Mae Chaem (qsds k_21)"
};
var LAI_MEANS = (function (S) {
  var buddhist = "with the lantern, the bowl, the naga, the hong, the water jar and the ship, a Buddhist sign woven in " +
                 "reverence: Mount Meru, the Sithandon ocean, the blessed beasts of the Himmaphan (Mae Chaem)";
  var pairs = "paired birds: plenty, and worship (the Bo Suak weavers of Nan, of their paired birds and paired chickens)";
  var hong = "the hong, the great bird: " + buddhist + "; with the naga, tied to the ancestors' spirits and the journey " +
             "to the world after death (Tai Lue)";
  var naga = "in the old local meaning a sign of male fertility, the bringer of rain and keeper of rivers; with Buddhism, " +
             "the rainbow that joins the worlds (Thai and Lao cloth); the ancestors' spirits and nature that gives birth " +
             "to all (Tai Lue)";
  var ship = "the ship: " + buddhist + "; the boat carries the castle and the offerings to the world of spirits (Tai Lue)";
  return {
    kap: {means: "a bamboo sheath, some say; others, the gable of a house (Tai Lue)", realm: null, from: [S.lue]},
    khruaKho: {means: "belonging to one's own people, and duty to one's family (the Tai Lue's khruea kho)", realm: null,
               from: [S.chiangKham]},
    buaLoy: {means: "the light of wisdom; flourishing", realm: null, from: [S.boSuak]},
    chanPaetKleeb: {means: "a blessed flower (Nan); on a Tai Lue tung, the eight directions", realm: null,
                    from: [S.boSuak, S.banner]},
    dokKaeo: {means: "a blessed flower; like the ta laew, the woven bamboo sign that marks sacred ground and keeps evil " +
                     "spirits out (Tai Lue)", realm: null, from: [S.boSuak, S.mueangNgoen]},
    nok: {means: "nature, and plenty (the Tai Lue's small bird, often beside the horse)", realm: "sky", from: [S.lue]},
    nokKhu: {means: pairs, realm: "sky", from: [S.boSuak, S.lue]},
    nokKhuTon: {means: pairs, realm: "sky", from: [S.boSuak, S.lue]},
    nokKum: {means: null, realm: "sky", from: [S.lue]},
    hongPloi: {means: hong, realm: "sky", from: [S.maeChaem, S.lue, S.chiangKham]},
    hongBi: {means: hong, realm: "sky", from: [S.maeChaem, S.lue, S.chiangKham]},
    hongKhu: {means: hong, realm: "sky", from: [S.maeChaem, S.lue, S.chiangKham]},
    nak: {means: naga, realm: "underworld", from: [S.thaiLao, S.lue]},
    nakKum: {means: naga, realm: "underworld", from: [S.thaiLao, S.lue]},
    chang: {means: "wisdom, leading, greatness, prosperity, and standing tied to wealth: \"elephants and horses under " +
                   "three houses\" is to be rich (Tai Lue)", realm: null, from: [S.lue, S.chiangKham, S.mueangNgoen]},
    ma: {means: "nature's plenty; with a rider or a bird on its back, a carrier, and endurance (Tai Lue)", realm: null,
         from: [S.lue]},
    khanSianSam: {means: "the bowl: " + buddhist, realm: null, from: [S.maeChaem]},
    khanSamAew: {means: "the bowl: " + buddhist, realm: null, from: [S.maeChaem]},
    khanAewOo: {means: "the bowl: " + buddhist, realm: null, from: [S.maeChaem]},
    khanDok: {means: "the bowl: " + buddhist, realm: null, from: [S.maeChaem]},
    komHupNok: {means: "the lantern: " + buddhist, realm: null, from: [S.maeChaem]},
    komHuaMon: {means: "the lantern: " + buddhist, realm: null, from: [S.maeChaem]},
    sapaoLoiNam: {means: ship, realm: null, from: [S.maeChaem, S.chiangKham]},
    hangSapao: {means: ship, realm: null, from: [S.maeChaem, S.chiangKham]},
    prasat: {means: "the castle at the heart of a Tai Lue tung, which the boat carries to the world of spirits with the " +
                    "offerings", realm: null, from: [S.banner, S.chiangKham]},
    phuKhao: {means: "obstacles, and how tangled things are (the Bo Suak weavers' mountains)", realm: null, from: [S.boSuak]},
    namLai: {means: "the stream, and passing smoothly beyond obstacles (Nan); copied, it is thought, from the Nan river " +
                    "when the Tai Lue were moved from Sipsongpanna", realm: null, from: [S.boSuak, S.lue]},
    maiSin: {means: "the weaver's own mark, to show the cloth is hers or keep it from theft (Mueang Long)", realm: null,
             from: [S.long]}
  };
})(LAI_SOURCES);
Object.keys(LAI).forEach(function (key) {
  var m = LAI_MEANS[key] || {means: null, realm: null, from: []};
  LAI[key].means = m.means;
  LAI[key].realm = m.realm;
  LAI[key].meansFrom = m.from.join("; ") || null;
});

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

// A cloth's threads where they lie. P: its crossings, a row a pick from the top and in each row a point a warp, each
// [x, y, z] (z how far that crossing stands toward the viewer: the light comes from it). Every warp a line from top to
// foot; every pick a round yarn between two warps in its weft's colour, its edges a shade darker and its crown a shade
// lighter; the warp over the weft at every other crossing; each patch lit by how it faces the light. look: {gap (the
// warps' spacing, which sets every thread's width), weft (a function (i, j): the colour of pick j between warps i and
// i + 1), warp (its colour), fringe (true: the warp's ends hang below the foot, swinging with t and gust), soft (the
// light in a few steps over patches twice as wide, each step one path, a run of one colour in a pick one line, and
// the warp's crossings square-ended:
// faster, for a cloth drawn on every person of a frame)}.
// e.g. threadMesh(pen, P, {gap: 3, weft: function (i, j) { return "#9a1f24"; }, warp: "#d8ccb0"})
function threadMesh(brush, P, look) {
  var np = P.length, nw = P[0].length, gap = look.gap, weft = look.weft, warpColour = look.warp;
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
    for (var i3 = 0, was = null; i3 < nw - 1; i3++) {
      var c = weft(i3, j3);
      var p = paths[c] || (paths[c] = new Path2D());
      if (!look.soft || c !== was) { p.moveTo(P[j3][i3][0], P[j3][i3][1]); }   // soft: a run of one colour is one line
      p.lineTo(P[j3][i3 + 1][0], P[j3][i3 + 1][1]);
      was = c;
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
  if (look.soft) { brush.lineCap = "butt"; }                                // (soft: square ends, too small to see)
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
  var step = 2, wide = look.soft ? 4 : 2, steps = {};                      // the light on each patch, by its slope (soft: patches 4 warps wide)
  for (var j5 = 0; j5 < np - step; j5 += step) {
    for (var i5 = 0; i5 < nw - wide; i5 += wide) {
      var p00 = P[j5][i5], p10 = P[j5][i5 + wide], p01 = P[j5 + step][i5], p11 = P[j5 + step][i5 + wide];
      var slope = ((p10[2] - p00[2]) * 0.7 * step / wide - (p01[2] - p00[2]) * 0.5) / (step * gap);
      var light = Math.max(-1, Math.min(1, slope * 3.2));
      if (look.soft) {                                                      // a few steps of light, a path each
        var level = Math.round(light * 5);
        if (!level) { continue; }
        var patch = steps[level] || (steps[level] = new Path2D());
        patch.moveTo(p00[0], p00[1]); patch.lineTo(p10[0], p10[1]); patch.lineTo(p11[0], p11[1]); patch.lineTo(p01[0], p01[1]);
        patch.closePath();
        continue;
      }
      brush.fillStyle = light > 0 ? "rgba(255, 246, 225, " + (light * 0.28).toFixed(3) + ")" : "rgba(20, 12, 30, " + (-light * 0.3).toFixed(3) + ")";
      brush.beginPath();
      brush.moveTo(p00[0], p00[1]); brush.lineTo(p10[0], p10[1]); brush.lineTo(p11[0], p11[1]); brush.lineTo(p01[0], p01[1]);
      brush.closePath();
      brush.fill();
    }
  }
  Object.keys(steps).forEach(function (level) {
    var light = level / 5;
    brush.fillStyle = light > 0 ? "rgba(255, 246, 225, " + (light * 0.28).toFixed(3) + ")" : "rgba(20, 12, 30, " + (-light * 0.3).toFixed(3) + ")";
    brush.fill(steps[level]);
  });
  if (look.fringe) {
    brush.strokeStyle = weaveShade(warpColour, 0.1);                        // the warp's ends hanging below the hem
    brush.lineWidth = gap * 0.35;
    brush.beginPath();
    for (var i6 = 0; i6 < nw; i6 += 2) {
      var e = P[np - 1][i6], dangle = gap * (5 + 3 * weaveHash(i6, 17));
      brush.moveTo(e[0], e[1]);
      brush.lineTo(e[0] + Math.sin(look.t * 3 + i6 * 0.3) * gap * look.gust, e[1] + dangle);
    }
    brush.stroke();
  }
  brush.restore();
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
  threadMesh(brush, P, {gap: gap, weft: weft, warp: warpColour, fringe: true, t: t, gust: gust});
  weaveBeam(brush, left - 40, y - 4, left + W + 40, y - 4, 12, "#8a6a3a");   // the bamboo pole
  brush.fillStyle = "#6a5028";
  for (var k6 = 0; k6 < 9; k6++) { var lx = left + (k6 / 8) * W; brush.beginPath(); brush.ellipse(lx, y - 1, 5, 9, 0, 0, Math.PI * 2); brush.fill(); }   // the loops it hangs by
  brush.restore();
  return {w: W, h: H};
}

// ---------- a sabai, thread by thread ----------
// The shoulder cloths the sources name, as weaves the kit draws a thread at a time: hung in the wind (threadCloth with
// sabaiWeft) or worn (a look's sabai: [cloth, border, a name of SABAI_WEAVES]: the kit's band across the chest drawn
// as its warps and picks by sabaiThreads). Each weave:
//   thai, en   its name
//   ground     the ground weft's colour; warp, the warp's
//   threads    the pattern threads: a grid's "1" is the first
//   edge       the warps along each side, from the selvedge in: a thread's number, or "." the ground
//   body       the rows of its length, repeated: ["gap", picks], ["stripe", picks, thread], or ["lai", figure, ...]: the
//              figures side by side, centred and repeated across, each [a key of LAI, as, mirrored]: "as" the threads
//              the grid's "1", "2", "3" are woven in ("41": its 1 in thread 4, its 2 in thread 1; left out, as the grid
//              has them), mirrored true to face the other way
//              (a last string, a thread's number: the ground of that row is woven in that thread, not the weave's)
//   stripes    left out, or for each warp across the cloth inside its edges in turn a thread's number, or "." the
//              ground: warp stripes, which make a check of the weft's stripes
//   end        the rows of each end, from the end in: the hung cloth has one at its head and one at its foot
//   from       what the sources say of it (by the keys of LAI_SOURCES), and what is the kit's own
var SABAI_WEAVES = {
  nan: {thai: "ผ้าเช็ด (ผ้าพาดบ่า) เมืองน่าน", en: "the shoulder cloth of Nan: trees and flowers, nature's plenty",
        ground: WEAVE_DYES.indigo, warp: WEAVE_DYES.deepIndigo,
        threads: [WEAVE_DYES.gold, WEAVE_DYES.white, WEAVE_DYES.pink, WEAVE_DYES.green], edge: "1.3",
        body: [["gap", 3], ["lai", ["kai", "13"]], ["gap", 3], ["lai", ["dokKaeo", "2"], ["chanPaetKleeb", "31"]], ["gap", 3],
               ["lai", ["kai", "13"]], ["gap", 3], ["lai", ["maliLueai", "41"]], ["gap", 3],
               ["lai", ["kai", "13"]], ["gap", 3], ["lai", ["chanPaetKleeb", "31"], ["dokKaeo", "2"]], ["gap", 3],
               ["lai", ["kai", "13"]], ["gap", 3], ["lai", ["maliLueai", "41", true]]],
        end: [["stripe", 3, 1], ["gap", 2], ["lai", ["nokKhuTon", "1"]], ["gap", 2], ["stripe", 1, 3], ["gap", 2],
              ["lai", ["khruaDok", "412"]], ["gap", 2], ["stripe", 3, 1], ["gap", 3]],
        from: "the Nan thesis (boSuak): woven trees and flowers on the pha chet, the shoulder cloth, show the plenty of " +
              "nature; the birds at the tree are the Bo Suak weavers' paired birds, plenty and worship. Its indigo and " +
              "its threads are the kit's"},
  ngoen: {thai: "ผ้าเช็ด ไทลื้อเมืองเงิน (แบบเดิม)", en: "the Tai Lue shoulder cloth of Mueang Ngoen, as it was: once a man's alone",
          ground: WEAVE_DYES.white, warp: WEAVE_DYES.white,
          threads: [WEAVE_DYES.yellow, WEAVE_DYES.green, WEAVE_DYES.pink, WEAVE_DYES.purple, WEAVE_DYES.lac, WEAVE_DYES.black,
                    WEAVE_DYES.orange], edge: "5.5",
          body: [["lai", ["kap", "2"], ["kap", "2", true], "1"], ["gap", 1], ["lai", ["fanPla", "6"], "5"], ["gap", 1],
                 ["lai", ["nuay", "4"], ["nuay", "4"], ["nuay", "4"], "3"], ["gap", 1],
                 ["lai", ["kho", "7"], ["kho", "7", true], ["kho", "7"], "2"], ["gap", 1], ["lai", ["fanPla", "5"], "6"], ["gap", 1],
                 ["lai", ["nuayHollow", "5"], ["nuay", "1"], ["nuayHollow", "5"], "4"], ["gap", 1]],
          end: [["stripe", 2, 5], ["gap", 2], ["lai", ["kho", "5"], ["nuay", "5"], ["kho", "5", true]], ["gap", 2],
                ["lai", ["fanPla", "5"]], ["gap", 3]],
          from: "the Mueang Ngoen thesis (mueangNgoen): silk of green, pink, purple and yellow, yellow above all, picked " +
                "in jok nearly over the whole cloth, red cotton in diamonds; rows of triangles (dok kap, dok bang), " +
                "diamonds (dok hap) and hooks (dok kho) between white lines or bands of the little snake (ngu noi) in " +
                "black and red, the colours in pairs (black and red, yellow and green, green and orange, purple and " +
                "pink, purple and yellow); small hooks and diamonds on white at the two ends, a zigzag (soi sa) to mark " +
                "them. At first a man's shoulder cloth alone. The little snake and the soi sa are drawn as the kit's " +
                "stepped zigzag: the source does not draw them"},
  ngoenNow: {thai: "ผ้าเช็ด ไทลื้อเมืองเงิน (ปัจจุบัน)", en: "the Mueang Ngoen shoulder cloth of today, its rows spaced apart",
             ground: WEAVE_DYES.white, warp: WEAVE_DYES.white,
             threads: [WEAVE_DYES.yellow, WEAVE_DYES.green, WEAVE_DYES.pink, WEAVE_DYES.purple, WEAVE_DYES.lac, WEAVE_DYES.black,
                       WEAVE_DYES.orange], edge: "5.",
             body: [["gap", 5], ["lai", ["kap", "2"], ["kap", "2", true], "1"], ["gap", 5], ["lai", ["nuay", "4"], ["nuay", "4"], ["nuay", "4"]],
                    ["gap", 5], ["lai", ["kho", "7"], ["kho", "7", true], ["kho", "7"]], ["gap", 5], ["lai", ["fanPla", "5"]]],
             end: [["stripe", 2, 5], ["gap", 3], ["lai", ["nuay", "5"], ["nuay", "5"]], ["gap", 3]],
             from: "the Mueang Ngoen thesis (mueangNgoen): today a woman's sabai in a rite and a scarf in the cold; its " +
                   "patterns spaced apart and plainer than of old, about half the patterned cloth it had, woven of " +
                   "factory cotton or tore yarn"},
  khit: {thai: "สไบขิด", en: "a khit sabai: indigo raised on white",
         ground: WEAVE_DYES.white, warp: WEAVE_DYES.cream, threads: [WEAVE_DYES.indigo, WEAVE_DYES.deepIndigo, WEAVE_DYES.red],
         edge: "1.3",
         body: [["gap", 3], ["lai", ["dokChan", "13"], ["kho", "1"], ["dokChan", "13"]], ["gap", 3], ["stripe", 1, 3],
                ["gap", 3], ["lai", ["chang", "1"], ["chang", "1", true]], ["gap", 3], ["stripe", 1, 3]],
         end: [["stripe", 2, 1], ["gap", 2], ["lai", ["ma", "1"], ["ma", "1", true]], ["gap", 2], ["stripe", 1, 3], ["gap", 2],
               ["lai", ["makNat", "13"]], ["gap", 2], ["stripe", 2, 1], ["gap", 3]],
         from: "SACIT: khit is woven for the sabai, the bag, the tung and the pillow; the elephant (wisdom, leading, " +
               "wealth) and the horse (plenty) are the Tai Lue's (lue)"},
  haeOn: {thai: "ผ้าแห่ออน", en: "pha hae on: the Tai Lue bride's sabai of pink Chinese silk",
          ground: "#e58aa6", warp: "#d97a98", threads: ["#f2b3c6"], edge: "",
          body: [["gap", 6]], end: [["gap", 3]],
          from: "the Mueang Ngoen thesis (mueangNgoen): at a wedding the bride wears pink Chinese silk (ผ้าแพรจีนสีชมพู) " +
                "slanting like a sabai, the pha hae on, mostly handed down from her mother or grandparents; on is the " +
                "Tai Lue word for pink"},
  yuanChet: {thai: "ผ้าเช็ด ไทยวน", en: "the Tai Yuan pha chet: white cotton, jok of the blessed beasts and plants",
             ground: WEAVE_DYES.white, warp: WEAVE_DYES.cream,
             threads: [WEAVE_DYES.yellow, WEAVE_DYES.red, WEAVE_DYES.green, WEAVE_DYES.black], edge: "2.",
             body: [["gap", 4], ["lai", ["chang", "2"], ["chang", "2", true]], ["gap", 4], ["lai", ["khruaDok", "413"]], ["gap", 4],
                    ["lai", ["ma", "1"], ["ma", "1", true]], ["gap", 4], ["lai", ["nak", "2"]], ["gap", 4],
                    ["lai", ["nok", "3"], ["nok", "3", true]]],
             end: [["stripe", 2, 2], ["gap", 2], ["lai", ["maliLueai", "31"]], ["gap", 2], ["stripe", 1, 1], ["gap", 3]],
             from: "the Chiang Rai Database of Mae Fah Luang University (chiangRai): a cloth of white cotton about a hand's " +
                   "span wide and two cubits long, jok of the Tai Yuan's blessed beasts, the elephant, the horse, the naga " +
                   "and the bird, and of plants, over the left shoulder or the right, to the temple and to hear a sermon, " +
                   "and laid under the hands when one bows; McIntosh (mcintosh): a short narrow shoulder cloth a man adds for a " +
                   "great day, cotton, patterned in many colours. The Damrong paper (damrong) holds that the Tai Yuan did " +
                   "not, of old, weave the pha chet worn over the shoulder. Its jok colours are the kit's (the Mae Chaem threads)"},
  chiangKham: {thai: "ผ้าเช็ดพาดบ่าผู้ชาย ไทลื้อเชียงคำ", en: "the Tai Lue men's shoulder cloth of Chiang Kham: elephants and horses",
               ground: WEAVE_DYES.white, warp: WEAVE_DYES.cream, threads: [WEAVE_DYES.red, WEAVE_DYES.black, WEAVE_DYES.yellow],
               edge: "1.2",
               body: [["gap", 3], ["lai", ["chang", "1"], ["chang", "2", true]], ["gap", 3], ["stripe", 1, 2], ["gap", 3],
                      ["lai", ["nok", "3"], ["ma", "1"]], ["gap", 3], ["stripe", 1, 1]],
               end: [["stripe", 3, 1], ["gap", 2], ["lai", ["fanPla", "2"]], ["gap", 2], ["stripe", 1, 2], ["gap", 3]],
               from: "the Chiang Kham paper (chiangKham): the elephant and the horse, 'elephants and horses, three under the " +
                     "house', are often woven on a man's shoulder cloth, and the little bird goes with the horse. Its white, " +
                     "red and black are the kit's, the colours the same paper gives the Chiang Kham pha chet luang"},
  long: {thai: "ผ้าสไบจก เมืองลอง", en: "the jok sabai of Mueang Long, for the great days",
         ground: WEAVE_DYES.indigo, warp: WEAVE_DYES.deepIndigo,
         threads: [WEAVE_DYES.jackfruit, WEAVE_DYES.lac, WEAVE_DYES.green, WEAVE_DYES.white], edge: "1.2",
         body: [["gap", 3], ["lai", ["khanDok", "12"], ["chanPaetKleeb", "24"]], ["gap", 3], ["lai", ["makNat", "14"]], ["gap", 3],
                ["lai", ["chanPaetKleeb", "24"], ["khanDok", "13"]], ["gap", 3], ["lai", ["kai", "12"]]],
         end: [["stripe", 3, 1], ["gap", 2], ["lai", ["khruaKho", "1"]], ["gap", 2], ["stripe", 2, 2], ["gap", 3]],
         from: "the Department of Sericulture (long): the women of Mueang Long weave jok for their own wedding, or as a " +
               "sabai for the great days, and a jok cloth a wife weaves her husband, or a girl her sweetheart, to wear " +
               "over the shoulder. Its motifs and dyes are Mueang Long's own jok (the bowl of flowers, the eight-petalled " +
               "flower, the pineapple): the source does not say which a sabai has"},
  sawaiLaeng: {thai: "ผ้าสะหว้ายแล่ง", en: "pha sawai laeng: the narrow white cloth a woman wraps slanting to go to the temple",
               ground: WEAVE_DYES.white, warp: WEAVE_DYES.cream, threads: [WEAVE_DYES.cream], edge: "",
               body: [["gap", 6]], end: [["gap", 3]],
               from: "the Chiang Rai Database (chiangRai): a white cloth, narrow but long, wrapped about the upper body; the " +
                     "Nan thesis (boSuak): worn slanting (sawai laeng, biang bai) to go into the temple"},
  tuapDam: {thai: "ผ้าตุ๊ม (ผ้าต้วบ) สีดำ", en: "pha tum: a plain black wrap over the shoulders", ground: WEAVE_DYES.black,
            warp: WEAVE_DYES.black, threads: [WEAVE_DYES.black], edge: "", body: [["gap", 6]], end: [["gap", 3]],
            from: "the Chiang Rai Database (chiangRai): women and men of the Tai Yuan lay a large cloth over the shoulders, " +
                  "the pha tum or pha tuap, woven of cotton in one colour, white, black or red"},
  tuapDaeng: {thai: "ผ้าตุ๊ม (ผ้าต้วบ) สีแดง", en: "pha tum: a plain red wrap over the shoulders", ground: WEAVE_DYES.red,
              warp: WEAVE_DYES.red, threads: [WEAVE_DYES.red], edge: "", body: [["gap", 6]], end: [["gap", 3]],
              from: "the Chiang Rai Database (chiangRai): the pha tum or pha tuap, of cotton in one colour, white, black or red"},
  tuapSaeng: {thai: "ผ้าต้วบแซง", en: "pha tuap saeng: white, with a thread of colour every two inches",
              ground: WEAVE_DYES.white, warp: WEAVE_DYES.cream, threads: [WEAVE_DYES.red, WEAVE_DYES.black, WEAVE_DYES.deepIndigo],
              edge: "", body: [["stripe", 1, 1], ["gap", 12], ["stripe", 1, 2], ["gap", 12], ["stripe", 1, 3], ["gap", 12]],
              end: [["gap", 3]],
              from: "the Chiang Rai Database (chiangRai): plain white cotton with stripes about two inches apart, now red, " +
                    "now black, now navy, the pha tuap saeng (which way the stripes run it does not say)"},
  taSaeng: {thai: "ผ้าต้วบตาแสง", en: "pha tuap ta saeng: a check of black, red and white, big squares and small",
            ground: WEAVE_DYES.white, warp: WEAVE_DYES.white, threads: [WEAVE_DYES.black, WEAVE_DYES.red], edge: "",
            stripes: "111111..22..", body: [["stripe", 8, 1], ["gap", 3], ["stripe", 3, 2], ["gap", 3]], end: [["gap", 3]],
            from: "the Chiang Rai Database (chiangRai): a wrap of squares big and small, ta saeng (lai di at Mae Chaem, ta " +
                  "kong at Nan); the Nan text (nanCheck): black, red and white, the colours changing in both the weft and " +
                  "the warp to make squares"},
  taKongDaeng: {thai: "ผ้าต้วบตาโก้ง แดงขาว", en: "pha tuap ta kong: a check of red and white (Nan)",
                ground: WEAVE_DYES.white, warp: WEAVE_DYES.white, threads: [WEAVE_DYES.red], edge: "",
                stripes: "11111.....", body: [["stripe", 7, 1], ["gap", 7]], end: [["gap", 3]],
                from: "the Nan text (nanCheck): some ta kong cloths only red and white"},
  taKongDam: {thai: "ผ้าต้วบตาโก้ง ดำขาว", en: "pha tuap ta kong: a check of black and white (Nan)",
              ground: WEAVE_DYES.white, warp: WEAVE_DYES.white, threads: [WEAVE_DYES.black], edge: "",
              stripes: "1111....", body: [["stripe", 6, 1], ["gap", 6]], end: [["gap", 3]],
              from: "the Nan text (nanCheck): some ta kong cloths black and white"},
  tuapRim: {thai: "ผ้าต้วบ ขาวริมดำ", en: "a white wrap, a black stripe of warp along each edge (Nan)",
            ground: WEAVE_DYES.white, warp: WEAVE_DYES.cream, threads: [WEAVE_DYES.black], edge: "11.1.", body: [["gap", 6]],
            end: [["gap", 3]],
            from: "the Nan text (nanCheck): or all white, black stripes only in the warp along its two edges"},
  thumKhram: {thai: "ผ้าทุ้ม (ผ้าตุ๊ม) ย้อมคราม", en: "pha thum: a thick cotton wrap dyed with indigo, for the cool mornings",
              ground: WEAVE_DYES.indigo, warp: WEAVE_DYES.deepIndigo, threads: [WEAVE_DYES.deepIndigo], edge: "", body: [["gap", 6]],
              end: [["gap", 3]],
              from: "the Lanna dress paper (fineArts): in the cool season women and men wear the pha thum, thick handwoven " +
                    "cotton about two metres long, dyed with plants, indigo, ebony or jackfruit heartwood; the old wear it " +
                    "slanting over the shoulder to the temple"},
  thumKhanun: {thai: "ผ้าทุ้ม (ผ้าตุ๊ม) ย้อมแก่นขนุน", en: "pha thum: a thick cotton wrap dyed with jackfruit heartwood",
               ground: WEAVE_DYES.jackfruit, warp: "#b9801f", threads: ["#b9801f"], edge: "", body: [["gap", 6]], end: [["gap", 3]],
               from: "the Lanna dress paper (fineArts): the pha thum dyed with plants, indigo, ebony or jackfruit heartwood"},
  maeChaemPat: {thai: "ผ้าป้าด (ผ้าพาดบ่า) แม่แจ่ม", en: "the jok shoulder cloth of Mae Chaem: the bowl of flowers, the hong, horse and elephant",
                ground: WEAVE_DYES.black, warp: WEAVE_DYES.black,
                threads: [WEAVE_DYES.yellow, WEAVE_DYES.red, WEAVE_DYES.green, WEAVE_DYES.white], edge: "2.",
                body: [["gap", 3], ["lai", ["khanDok", "12"], ["khanDok", "13"]], ["gap", 3], ["lai", ["hongKhu", "14"]], ["gap", 3],
                       ["lai", ["ma", "1"], ["chang", "2", true]], ["gap", 3], ["lai", ["fanPla", "4"]]],
                end: [["stripe", 2, 2], ["gap", 2], ["lai", ["fanPla", "1"]], ["gap", 2], ["stripe", 1, 2], ["gap", 3]],
                from: "the Department of Sericulture on Mae Chaem jok (maeChaemJok): the pha chet and the pha pat (ผ้าป้าด, " +
                      "a shoulder cloth) are worked in jok, the bowl of flowers and the hong on the pha pat; horses, " +
                      "elephants, chickens, donkeys, the dog's tooth, the fish's teeth and people mostly on the sleeping mat " +
                      "and the pha pat. Its black ground and its threads are Mae Chaem's palette"},
  lueBands: {thai: "ผ้าเช็ดไตลื้อ (จก แถบเรขาคณิต)", en: "a Tai Lue pha chet of jok: narrow bands of small shapes, bright and dark",
             ground: WEAVE_DYES.purple, warp: WEAVE_DYES.purple,
             threads: [WEAVE_DYES.yellow, WEAVE_DYES.green, WEAVE_DYES.white, WEAVE_DYES.black, WEAVE_DYES.orange, WEAVE_DYES.lac],
             edge: "6.",
             body: [["lai", ["kai", "16"]], ["gap", 1], ["lai", ["fanPla", "3"], "4"], ["gap", 1],
                    ["lai", ["nuay", "1"], ["nuay", "5"], ["nuay", "1"]], ["gap", 1], ["lai", ["kai", "23"]], ["gap", 1],
                    ["lai", ["kap", "5"], ["kap", "5", true], "2"], ["gap", 1], ["lai", ["fanPla", "1"]], ["gap", 1]],
             end: [["stripe", 3, 6], ["gap", 2], ["lai", ["kai", "13"]], ["gap", 3]],
             from: "the Damrong paper (damrong): one group of Tai Lue pha chet, of Si Don Chai in Chiang Khong and of Mueang " +
                   "Ngoen, is jok, some with tapestry, of small geometric figures repeated and mirrored into narrow bands " +
                   "one above another, in bright and dark colours on a coloured warp, and no figure on its own. Its purple " +
                   "and its threads are the kit's"},
  lueKhit: {thai: "ผ้าเช็ดไตลื้อ (ขิด แม่ลายเอกเทศ)", en: "a Tai Lue pha chet of khit: the castle, the elephant and the horse on white",
            ground: WEAVE_DYES.white, warp: WEAVE_DYES.cream, threads: [WEAVE_DYES.red, WEAVE_DYES.deepIndigo], edge: "2.",
            body: [["gap", 3], ["lai", ["prasat", "1"], ["prasat", "2", true]], ["gap", 3], ["lai", ["chang", "1"], ["ma", "2", true]],
                   ["gap", 3], ["lai", ["khoS", "1"], ["khoS", "2"], ["khoS", "1"]], ["gap", 2], ["lai", ["khoS", "2"], ["khoS", "1"], ["khoS", "2"]]],
            end: [["stripe", 2, 1], ["gap", 4], ["stripe", 1, 2], ["gap", 3]],
            from: "the Damrong paper (damrong): the other group is khit on a white or raw-cotton warp, figures standing " +
                  "alone, the castle and the beasts, mirrored at the middle of the cloth, the middle sometimes left plain; " +
                  "one repeat a castle lantern, a lion, an elephant, a horse and two rows of hooks; a girl weaves a fine " +
                  "one for her sweetheart to wear over the shoulder to the temple. Its red and blue are the colours the " +
                  "paper gives the Tai Lue tung; the lion the kit does not weave"},
  phuanHatSiao: {thai: "ผ้าสไบ ไทพวนหาดเสี้ยว", en: "the Tai Phuan sabai of Hat Siao: elephants, horses, the naga and flowers",
                 ground: WEAVE_DYES.cream, warp: WEAVE_DYES.white,
                 threads: [WEAVE_DYES.green, WEAVE_DYES.black, WEAVE_DYES.indigo, WEAVE_DYES.red], edge: "4.",
                 body: [["gap", 3], ["lai", ["chang", "1"], ["chang", "1", true]], ["gap", 3],
                        ["lai", ["dokKaeo", "4"], ["dokChan", "34"], ["dokKaeo", "4"]], ["gap", 3], ["lai", ["ma", "2"], ["ma", "2", true]],
                        ["gap", 3], ["lai", ["nak", "3"]]],
                 end: [["stripe", 2, 4], ["gap", 2], ["lai", ["fanPla", "1"]], ["gap", 3]],
                 from: "the Hat Siao paper (hatSiao): the elephant, the horse, the naga, people and flowers of the ritual " +
                       "cloths are woven, plainer, into the sabai too, and the sabai is also worked in yok muk, in green, " +
                       "nil black, indigo and red. Its cream ground is the kit's; the people it does not weave"},
  dokLoi: {thai: "ผ้าลายดอกลอย (จิตรกรรมล้านนา)", en: "the flowered cloth of the Lanna murals: flowers scattered all over, a border",
           ground: WEAVE_DYES.red, warp: WEAVE_DYES.red, threads: [WEAVE_DYES.yellow, WEAVE_DYES.white, WEAVE_DYES.green], edge: "1.3",
           body: [["gap", 5], ["lai", ["dokChan", "12"]], ["gap", 5], ["lai", ["dokKaeo", "2"], ["dokKaeo", "1"]]],
           end: [["stripe", 2, 1], ["gap", 2], ["stripe", 1, 3], ["gap", 3]],
           from: "the Damrong paper (damrong): the shoulder cloths of the Lanna murals of the 19th century (Wat Phra Singh, " +
                 "Wat Buak Khrok Luang, Wat Nong Bua, Wat Phumin) are plain cloths of many colours and mostly flowers " +
                 "printed all over, flowers floating (dok loi), with a border or without: cloth from abroad, not of " +
                 "Lanna's own weave. Its red and its flowers are the kit's"}
};
var SABAI_WARPS = 40;                   // the cells across a sabai between its warps, worn or hung

// The colours a weave may be woven in: its own, or the dyes of a town or people the sources give (WEAVE_PALETTES).
var SABAI_COLOURS = ["own"].concat(Object.keys(WEAVE_PALETTES));

// A weave in a palette's colours: the palette's ground for its ground and its warp, the palette's threads for its
// pattern threads in turn; a weave with more threads than the palette keeps its own after them, made white or black
// where one would be lost on the new ground. name: a key of SABAI_WEAVES; colours: one of SABAI_COLOURS ("own", or
// left out, the weave as the sources give it). Returns the weave to draw (its rows and its colours), made once; null
// for a name that is no weave.
// e.g. sabaiWeave("nan", "long").ground is WEAVE_DYES.indigo
var SABAI_COLOURED = {};
function sabaiWeave(name, colours) {
  var weave = SABAI_WEAVES[name], key = name + "|" + (colours || "own");
  if (!weave) { return null; }
  if (SABAI_COLOURED[key]) { return SABAI_COLOURED[key]; }
  var palette = colours && colours !== "own" ? WEAVE_PALETTES[colours] : null;
  if (colours && colours !== "own" && !palette && typeof warn === "function") { warn("sabai colours: " + colours + " is none of " + SABAI_COLOURS.join(", ")); }
  function apart(a, b) {                                                     // how far two colours are, 0 to 441
    var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
    return Math.hypot((x >> 16) - (y >> 16), ((x >> 8) & 255) - ((y >> 8) & 255), (x & 255) - (y & 255));
  }
  SABAI_COLOURED[key] = !palette ? weave : Object.assign({}, weave, {ground: palette.ground, warp: palette.ground,
    threads: weave.threads.map(function (c, k) {
      if (k < palette.threads.length) { return palette.threads[k]; }
      return apart(c, palette.ground) > 90 ? c : (apart(WEAVE_DYES.white, palette.ground) > 200 ? WEAVE_DYES.white : WEAVE_DYES.black);
    })});
  return SABAI_COLOURED[key];
}

// A look's sabai for a weave: [its ground, the thread at its selvedge (or its warp), the weave's name, its colours], for person()
// (oldcartoon.js draws the band and the back of it thread by thread when its third name is a weave).
// e.g. person(500, 900, cast("lady", {sabai: sabaiLook("nan", "maechaem")}))
function sabaiLook(name, colours) {
  var weave = sabaiWeave(name, colours), edge = weave.edge.charAt(0) || (weave.stripes || ".").charAt(0);   // a check's first stripe, where it has no edge
  return [weave.ground, edge === "." ? weave.warp : weave.threads[parseInt(edge, 10) - 1], name, colours || "own"];
}

// A part of a weave (its "body" or an "end") as a grid "cells" across: each row a pick, each character the weft
// between two warps, "." the ground, "1" to "9" a thread of the weave's threads. Made once and kept.
// e.g. sabaiGrid("nan", "body", 40)
var SABAI_GRIDS = {};
function sabaiGrid(name, part, cells) {
  var key = [name, part, cells].join("|");
  if (SABAI_GRIDS[key]) { return SABAI_GRIDS[key]; }
  var weave = SABAI_WEAVES[name], edge = weave.edge, far = edge.split("").reverse().join(""), inner = cells - 2 * edge.length;
  var rows = [], plain = function (ch) { return new Array(inner + 1).join(ch); };
  weave[part].forEach(function (r) {
    var k;
    if (r[0] === "gap") { for (k = 0; k < r[1]; k++) { rows.push(plain(".")); } return; }
    if (r[0] === "stripe") { for (k = 0; k < r[1]; k++) { rows.push(plain(String(r[2]))); } return; }
    var parts = r.slice(1), on = typeof parts[parts.length - 1] === "string" ? parts.pop() : null;   // a row's own ground thread
    var figures = parts.map(function (f) {                            // each figure in its threads, and turned if it is
      return LAI[f[0]].grid.map(function (row) {
        var out = row.split("").map(function (ch) { return ch === "." || !f[1] ? ch : f[1].charAt(parseInt(ch, 10) - 1) || ch; });
        return (f[2] ? out.reverse() : out).join("");
      });
    });
    var tall = Math.max.apply(null, figures.map(function (g) { return g.length; })), unit = [];
    for (k = 0; k < tall; k++) {                                      // side by side, a ground thread between, each centred up and down
      unit.push(figures.map(function (g) {
        var row = g[k - Math.floor((tall - g.length) / 2)];
        return row === undefined ? new Array(g[0].length + 1).join(".") : row;
      }).join("."));
    }
    if (unit[0].length > inner && typeof warn === "function") { warn("sabai " + name + ": a row " + unit[0].length + " wide in " + inner); }
    weaveAcross(unit, inner, 2).forEach(function (row) { rows.push(on ? row.replace(/\./g, on) : row); });
  });
  if (weave.stripes) {                                                // the warp's stripes, where the weft is the ground
    rows = rows.map(function (row) {
      return row.split("").map(function (ch, c) { return ch === "." ? weave.stripes.charAt(c % weave.stripes.length) : ch; }).join("");
    });
  }
  SABAI_GRIDS[key] = rows.map(function (row) { return edge + row + far; });
  return SABAI_GRIDS[key];
}

// The colour of a cell of a weave's grid.
function sabaiColour(weave, ch) { return ch === "." || ch === "" ? weave.ground : weave.threads[(parseInt(ch, 10) - 1) % weave.threads.length]; }

// The weft's colour at cell i of pick j, as threadCloth's look.weft, for a cloth of "picks" picks hung by one end: its
// end, the body repeated, and the end again, turned, at the foot.
// colours: one of SABAI_COLOURS (left out, the weave's own).
// e.g. threadCloth(pen, 900, 200, t, {warps: 41, picks: 220, warp: SABAI_WEAVES.nan.warp, weft: sabaiWeft("nan", 40, 220)})
function sabaiWeft(name, cells, picks, colours) {
  var weave = sabaiWeave(name, colours), end = sabaiGrid(name, "end", cells), body = sabaiGrid(name, "body", cells);
  return function (i, j) {
    var back = picks - 1 - j, row = j < end.length ? end[j] : back < end.length ? end[back] : body[(j - end.length) % body.length];
    return sabaiColour(weave, row.charAt(i));
  };
}

// A row of a worn cloth's crossings, 0 to cells: the body's map (where(i), the point of crossing i) asked at every
// fourth crossing only, and the three between laid on the straight line between those two: the map bends with the
// spine and the shoulders, but not within four threads, and asking it of every crossing was most of the time a worn
// sabai took.
function sabaiAnchors(where, cells) {
  var out = [], a = where(0);
  for (var i = 4; i <= cells; i += 4) {
    var b = where(i);
    for (var k = 0; k < 4; k++) { out.push([a[0] + (b[0] - a[0]) * k / 4, a[1] + (b[1] - a[1]) * k / 4]); }
    a = b;
  }
  out.push(a);
  return out;
}

// A worn sabai's band across the chest, thread by thread (threadMesh): its picks across the band and its warps along it,
// its body's rows woven in, lit by soft folds where it lies over the breast and gathers to the shoulder, which a
// breath stirs. Draw it clipped to the band. brush: the pen; spot(along, across): where a point of the band lies,
// along it from its lower end and across it from its middle line (positive toward its lower side); from, to: the
// stretch along it to weave; half: half its width; name: a key of SABAI_WEAVES; t: the second; colours: one of
// SABAI_COLOURS (left out, the weave's own). The picks are counted
// from the band's lower end, so the pattern stays where it is on the cloth as the person moves; they are 0.7 of the
// warps' spacing apart, as a float is wider than a pick is tall.
// e.g. sabaiThreads(pen, function (a, c) { return [a, c]; }, 0, 120, 30, "nan", clock)
function sabaiThreads(brush, spot, from, to, half, name, t, colours) {
  var weave = sabaiWeave(name, colours), cells = SABAI_WARPS, gap = 2 * half / cells, pick = gap * 0.7;
  var body = sabaiGrid(name, "body", cells), first = Math.floor(from / pick), P = [];
  for (var j = first; j <= Math.ceil(to / pick); j++) {
    var along = j * pick, row = [], at = sabaiAnchors(function (i) { return spot(along, -half + i * gap); }, cells);
    for (var i = 0; i <= cells; i++) {
      var across = -half + i * gap;
      row.push([at[i][0], at[i][1], 1.6 * Math.sin(along / 11 - across / 26) + 0.9 * Math.sin(along / 6.5 + across / 40 + (t || 0) * 0.9)]);
    }
    P.push(row);
  }
  threadMesh(brush, P, {gap: gap, warp: weave.warp, soft: true, weft: function (i, k) {
    return sabaiColour(weave, body[(((first + k) % body.length) + body.length) % body.length].charAt(i));
  }});
}

// The end of a worn sabai that hangs from the shoulder down the back, thread by thread, in a breeze as threadCloth's
// cloth is in the wind: nothing moves at the shoulder, more toward the foot, and a gust swells and dies; its woven
// end at the foot and the warp's ends hanging from it. brush: the pen; spot(u, v, push): where the cloth's point u
// across (0 by the body, 1 its outer edge) and v down (0 at the shoulder, 1 at the foot) lies when the wind pushes it
// by push ([across, down], in the person's units); long: how long it hangs; half: half the cloth's width; name: a
// key of SABAI_WEAVES; t: the second; colours: one of SABAI_COLOURS (left out, the weave's own); breeze: how hard the
// wind (1, a light breeze; 0, still). Gives back its
// crossings (threadMesh's P), for a shade laid over it.
// e.g. sabaiBackThreads(pen, function (u, v, push) { return [u * 40 + push[0], v * 200 + push[1]]; }, 200, 30, "nan", clock)
function sabaiBackThreads(brush, spot, long, half, name, t, colours, breeze) {
  var weave = sabaiWeave(name, colours), cells = SABAI_WARPS, gap = 2 * half / cells, np = Math.max(8, Math.round(long / (gap * 0.7)));
  var end = sabaiGrid(name, "end", cells), body = sabaiGrid(name, "body", cells), P = [];
  var gust = (breeze === undefined ? 1 : breeze) * (0.65 + 0.35 * Math.sin(t * 0.7) * Math.sin(t * 0.23 + 1));
  for (var j = 0; j < np; j++) {
    var v = j / (np - 1), free = Math.pow(v, 1.25), row = [], zs = [];
    for (var i = 0; i <= cells; i++) {
      var u = i / cells;
      zs.push(free * gust * (9 * Math.sin(2 * Math.PI * (u * 0.6 - v * 0.9) - t * 2.2) + 4 * Math.sin(2 * Math.PI * (u * 1.3 + v * 0.4) - t * 3.4 + 1.3)
                             + 2 * Math.sin(2 * Math.PI * v * 2.2 - t * 2.9)));
    }
    var at = sabaiAnchors(function (i) {
      return spot(i / cells, v, [zs[i] * 0.45 + free * gust * 6 + v * v * gust * 5 * Math.sin(t * 1.1 + 0.4), -Math.abs(zs[i]) * 0.16 * v]);
    }, cells);
    for (i = 0; i <= cells; i++) { row.push([at[i][0], at[i][1], zs[i]]); }
    P.push(row);
  }
  threadMesh(brush, P, {gap: gap, warp: weave.warp, fringe: true, t: t, gust: gust, soft: true, weft: function (i, k) {
    var back = np - 1 - k;
    return sabaiColour(weave, (back < end.length ? end[back] : body[k % body.length]).charAt(i));
  }});
  return P;
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
