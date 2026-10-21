// food.js - a dozen Thai dishes, drawn small, for films made with
// oldcartoon.js. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="food.js"></script>
//
// and call food(name, x, y, look) from a scene. (x, y) is the middle of what
// the dish stands on: a mat, a table, the ground. The names are the keys of
// FOODS below; each has its Thai name beside it, and how that is said.
//
//     food("khaosoi", 700, 900, {size: 2});
//
// They are drawn in the kit's manner: flat colour inside a fine dark line,
// seen from the side and a little from above, as the paintings show a tray.
// What each is, in rules, is the comment above its painter. The dishes are
// the ones a northern Thai household and market have: sticky rice in its
// basket, khao soi, a mortar of som tam, mango and sticky rice, the coiled
// sausage sai ua, a chilli dip with vegetables and pork crackling, a curry, a
// tom yam, phat thai, pork on skewers, coconut cakes in their pan, and the
// khantok, the low round table that a meal is set on.
//
// The names a food's look may have (food() warns about any other):
//   size       how large it is drawn: 1 is as large as it is beside the cast at
//              their own sizes (a bowl is about 64 across)
//   colour     the curry's: the colour of the curry (green unless told)
//   steam      false: no steam over a hot dish
var FOOD_KEYS = {size: true, colour: true, steam: true};

var FOOD_WHITE = "#f4efe2", FOOD_LEAF = "#5f9a4a", FOOD_RICE = "#fbf6e8", FOOD_RED = "#d2452e", FOOD_GREEN = "#5f9a3e";

// A bowl, seen from the side and a little from above: its rim is an ellipse
// "wide" to each side, "deep" above the ground. "band" is the colour of the
// line painted under the rim, or nothing. "inside" paints what is in it: it
// is called with the pen kept to the rim, and (0, 0) at the rim's middle.
// wide, deep: pixels of the pen's frame (the dish's own frame, before food()'s size); colour, band:
// "#rrggbb" (band may be left out); inside(wide, flat): a function that paints the bowl's contents.
// Returns nothing: it draws with pen at (0, 0), the ground under the bowl's middle, and leaves pen's
// fill and line as shape() leaves them.
// e.g. foodBowl(52, 40, FOOD_WHITE, "#b23a3a", function (wide, flat) { pen.fillStyle = "#9db656"; pen.fillRect(-wide, -flat, wide * 2, flat * 2); });
function foodBowl(wide, deep, colour, band, inside) {
  var flat = wide * 0.3;
  pen.beginPath();                                  // the foot
  pen.ellipse(0, -3, wide * 0.4, 5, 0, 0, 7);
  shape(blend(colour, "#3a2418", 0.25));
  pen.beginPath();                                  // the wall
  pen.moveTo(-wide, -deep);
  pen.bezierCurveTo(-wide * 0.96, -deep * 0.3, -wide * 0.62, -4, -wide * 0.36, -4);
  pen.lineTo(wide * 0.36, -4);
  pen.bezierCurveTo(wide * 0.62, -4, wide * 0.96, -deep * 0.3, wide, -deep);
  pen.closePath();
  shape(colour);
  if (band) {
    pen.save();
    pen.clip();
    pen.strokeStyle = band;
    pen.lineWidth = 5;
    pen.beginPath();
    pen.ellipse(0, -deep, wide, flat + 9, 0, 0, Math.PI);
    pen.stroke();
    pen.restore();
  }
  pen.beginPath();                                  // the rim, and what is in the bowl
  pen.ellipse(0, -deep, wide, flat, 0, 0, 7);
  shape(blend(colour, "#ffffff", 0.3));
  pen.save();
  pen.beginPath();
  pen.ellipse(0, -deep, wide - 4, flat - 3, 0, 0, 7);
  pen.clip();
  pen.translate(0, -deep);
  inside(wide - 4, flat - 3);
  pen.restore();
}

// A plate: a rim "wide" to each side, and a well in it.
// wide: pixels of the pen's frame; colour: "#rrggbb". Returns nothing: it draws with pen, its middle
// on (0, 0).
// e.g. foodPlate(64, FOOD_WHITE);
function foodPlate(wide, colour) {
  pen.beginPath();
  pen.ellipse(0, -6, wide, wide * 0.3, 0, 0, 7);
  shape(colour);
  pen.beginPath();
  pen.ellipse(0, -7, wide * 0.72, wide * 0.2, 0, 0, 7);
  pen.fillStyle = blend(colour, "#3a2418", 0.08);
  pen.fill();
}

// A piece of banana leaf to lay food on: green, with its rib and its veins.
// wide, deep: pixels of the pen's frame, to each side and up and down from (0, 0). Returns nothing:
// it draws with pen, and leaves its strokeStyle and lineWidth set.
// e.g. foodLeaf(74, 34);
function foodLeaf(wide, deep) {
  pen.beginPath();
  pen.moveTo(-wide, -deep * 0.4);
  pen.quadraticCurveTo(-wide * 0.2, -deep * 1.5, wide * 0.94, -deep * 0.9);
  pen.quadraticCurveTo(wide * 1.06, -deep * 0.3, wide * 0.86, deep * 0.2);
  pen.quadraticCurveTo(0, deep * 0.6, -wide * 0.9, deep * 0.24);
  pen.closePath();
  shape(FOOD_LEAF);
  pen.strokeStyle = blend(FOOD_LEAF, "#1f3a1a", 0.45);
  pen.lineWidth = 1.4;
  pen.beginPath();
  pen.moveTo(-wide * 0.94, -deep * 0.1);
  pen.quadraticCurveTo(0, -deep * 0.5, wide * 0.96, -deep * 0.36);
  for (var v = -4; v <= 4; v++) {
    pen.moveTo(v * wide * 0.2, -deep * 0.36);
    pen.lineTo(v * wide * 0.2 + 8, -deep * 1.02);
    pen.moveTo(v * wide * 0.2, -deep * 0.36);
    pen.lineTo(v * wide * 0.2 - 8, deep * 0.3);
  }
  pen.stroke();
}

// Steam over a hot dish: three wisps that rise, fade, and begin again.
// x, y: the foot of the steam, pixels of the pen's frame; look: the dish's look (look.steam false
// draws none); seed: a number that sets the wisps apart from another dish's. Reads the kit's clock.
// Returns nothing: it draws with pen, and leaves its line set (round caps).
// e.g. foodSteam(0, -84, {}, 0.5);
function foodSteam(x, y, look, seed) {
  if (look.steam === false) { return; }
  pen.lineCap = "round";
  for (var pass = 0; pass < 2; pass++) {            // a faint brown edge, so that steam shows on pale paper, then the white of it
    for (var w = -1; w <= 1; w++) {
      var rise = (clock * 0.3 + (w + 1) * 0.33 + seed) % 1, seen = Math.sin(rise * Math.PI);
      pen.strokeStyle = pass ? "rgba(255, 255, 255, " + (0.8 * seen) + ")" : "rgba(120, 90, 60, " + (0.16 * seen) + ")";
      pen.lineWidth = pass ? 4 : 7;
      pen.beginPath();
      for (var s = 0; s <= 10; s++) {
        var up = rise * 34 + s * 5;
        pen.lineTo(x + w * 20 + 7 * Math.sin(up * 0.13 + w * 2 + clock * 1.4), y - up);
      }
      pen.stroke();
    }
  }
}

// A wedge of lime: a half circle of rind, and the pale flesh in it.
// x, y: pixels of the pen's frame; turn: radians. Returns nothing: it draws with pen, and leaves pen
// as it found it.
// e.g. foodLime(-42, -46, 2.6);
function foodLime(x, y, turn) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.beginPath();
  pen.arc(0, 0, 13, 0, Math.PI);
  pen.closePath();
  shape("#7fae3c");
  pen.beginPath();
  pen.arc(0, 1.5, 9, 0, Math.PI);
  pen.closePath();
  pen.fillStyle = "#dcea9c";
  pen.fill();
  pen.restore();
}

// A cooked prawn: a curled body in bands, a fan of a tail.
// x, y: pixels of the pen's frame; turn: radians; scale: its size (1 is 60 long). Returns nothing:
// it draws with pen, and leaves pen as it found it.
// e.g. foodPrawn(-4, -56, -0.2, 0.8);
function foodPrawn(x, y, turn, scale) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(scale, scale);
  pen.beginPath();                                  // the tail's fan
  pen.moveTo(-22, 6);
  pen.lineTo(-36, -2);
  pen.lineTo(-33, 12);
  pen.closePath();
  shape("#e8623a");
  pen.beginPath();                                  // the body, curled
  pen.moveTo(-24, 8);
  pen.bezierCurveTo(-26, -18, 8, -26, 22, -8);
  pen.bezierCurveTo(28, 2, 20, 12, 12, 8);
  pen.bezierCurveTo(8, -6, -8, -6, -12, 10);
  pen.closePath();
  shape("#f39468");
  pen.strokeStyle = "#d2552e";
  pen.lineWidth = 1.6;
  pen.beginPath();
  for (var band = 0; band < 4; band++) {
    var a = 3.5 + band * 0.55;
    pen.moveTo(Math.cos(a) * 8, -2 + Math.sin(a) * 8);
    pen.lineTo(Math.cos(a) * 20, -2 + Math.sin(a) * 18);
  }
  pen.stroke();
  pen.restore();
}

// Sticky rice in its basket (a kratip): woven bamboo on a small foot, the lid
// lifted on one side so that the rice shows, and a cord to carry it by.
// One of FOODS' painters ("stickyrice"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("stickyrice", 700, 900, {size: 1.5});
function foodStickyRice(look, seed) {
  var cane = "#dcb673", dark = "#a9803c";
  pen.beginPath();                                  // the foot
  pen.moveTo(-30, 0);
  pen.lineTo(30, 0);
  pen.lineTo(24, -11);
  pen.lineTo(-24, -11);
  pen.closePath();
  shape("#8a5e2c");
  function body() {
    pen.beginPath();
    pen.moveTo(-40, -10);
    pen.bezierCurveTo(-52, -32, -52, -60, -42, -78);
    pen.lineTo(42, -78);
    pen.bezierCurveTo(52, -60, 52, -32, 40, -10);
    pen.closePath();
  }
  function weave(left, right, top, bottom) {        // strips of bamboo that cross
    pen.strokeStyle = dark;
    pen.lineWidth = 1.5;
    pen.beginPath();
    for (var k = left - (bottom - top); k < right + (bottom - top); k += 11) {
      pen.moveTo(k, bottom);
      pen.lineTo(k + (bottom - top), top);
      pen.moveTo(k + (bottom - top), bottom);
      pen.lineTo(k, top);
    }
    pen.stroke();
  }
  pen.strokeStyle = "#8a5e2c";                      // the cord
  pen.lineWidth = 2.5;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(-46, -62);
  pen.bezierCurveTo(-84, -112, -62, -150, -34, -134);
  pen.stroke();
  body();
  shape(cane);
  pen.save();
  pen.clip();
  weave(-54, 54, -78, -10);
  pen.fillStyle = dark;
  pen.fillRect(-56, -28, 112, 6);
  pen.fillRect(-56, -72, 112, 6);
  pen.restore();
  pen.beginPath();                                  // the rice, heaped
  pen.moveTo(-38, -78);
  pen.bezierCurveTo(-32, -106, 36, -108, 40, -78);
  pen.closePath();
  shape(FOOD_RICE);
  pen.strokeStyle = "#cfc4a4";
  pen.lineWidth = 1.2;
  pen.beginPath();
  for (var g = 0; g < 14; g++) {
    var gx = -26 + dice(g + 3) * 58, gy = -82 - dice(g + 9) * 16;
    pen.moveTo(gx, gy);
    pen.lineTo(gx + 5, gy - 2);
  }
  pen.stroke();
  pen.save();                                       // the lid, lifted on one side
  pen.translate(-16, -92);
  pen.rotate(-0.42);
  pen.beginPath();
  pen.moveTo(-46, 6);
  pen.bezierCurveTo(-44, -30, -22, -46, 0, -46);
  pen.bezierCurveTo(22, -46, 44, -30, 46, 6);
  pen.closePath();
  shape(cane);
  pen.save();
  pen.clip();
  weave(-48, 48, -48, 6);
  pen.fillStyle = dark;
  pen.fillRect(-50, -4, 100, 6);
  pen.restore();
  oval(0, -48, 7, 5, "#8a5e2c");
  pen.restore();
}

// Khao soi: a bowl of curry broth with a nest of crisp noodles on it, a leg
// of chicken, shallot, a wedge of lime, and chopsticks across the rim.
// One of FOODS' painters ("khaosoi"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (look.steam false: no steam); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("khaosoi", 700, 900, {size: 1.5});
function foodKhaoSoi(look, seed) {
  foodBowl(52, 44, FOOD_WHITE, "#3d5f9a", function (wide, flat) {
    pen.fillStyle = "#e39a2e";
    pen.fillRect(-wide, -flat, wide * 2, flat * 2);
    pen.strokeStyle = "#c8522a";                    // the red oil on the broth
    pen.lineWidth = 2.5;
    pen.beginPath();
    pen.ellipse(-12, 3, 26, 5, 0.1, 0.4, 2.6);
    pen.moveTo(34, -2);
    pen.ellipse(20, -2, 14, 4, 0, 0, 2);
    pen.stroke();
  });
  pen.beginPath();                                  // the leg of chicken, and its bone
  pen.ellipse(-20, -48, 20, 12, -0.3, 0, 7);
  shape("#a9662c");
  hose(-36, -42, -52, -32, 0, 5, "#f3ead2");
  pen.lineCap = "round";                            // the nest of crisp noodles: loops, a dark line and a light one
  for (var pass = 0; pass < 2; pass++) {
    pen.strokeStyle = pass ? "#f6cb5a" : "#b9812a";
    pen.lineWidth = pass ? 3 : 5.5;
    pen.beginPath();
    for (var n = 0; n < 9; n++) {
      var nx = 6 + (dice(n + 2) - 0.5) * 40, ny = -56 - dice(n + 7) * 16;
      pen.moveTo(nx - 14, ny + 4);
      pen.bezierCurveTo(nx - 8, ny - 16, nx + 6, ny + 12, nx + 14, ny - 6);
    }
    pen.stroke();
  }
  pen.strokeStyle = "#a04a7a";                      // rings of shallot
  pen.lineWidth = 2;
  pen.beginPath();
  pen.arc(28, -48, 5, 0, 7);
  pen.moveTo(40, -44);
  pen.arc(36, -44, 4, 0, 7);
  pen.stroke();
  oval(-2, -72, 5, 3, FOOD_GREEN, 0.5);             // a leaf of coriander on top
  oval(8, -74, 5, 3, FOOD_GREEN, -0.4);
  foodLime(-42, -46, 2.6);
  hose(8, -44, 92, -78, 0, 3.5, "#7a4a22");         // the chopsticks
  hose(14, -40, 96, -70, 0, 3.5, "#7a4a22");
  foodSteam(0, -84, look, seed);
}

// Som tam: a clay mortar heaped with shreds of green papaya, tomato, long
// beans, chilli and peanuts, with the wooden pestle standing in it.
// One of FOODS' painters ("somtam"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("somtam", 700, 900, {size: 1.5});
function foodSomTam(look, seed) {
  hose(14, -86, 60, -156, 0, 12, "#b98a54");        // the pestle, behind the heap
  oval(62, -160, 9, 7, "#b98a54", -0.6);
  pen.beginPath();                                  // the mortar: tall, of dark clay
  pen.moveTo(-40, -72);
  pen.bezierCurveTo(-42, -34, -28, -10, -24, 0);
  pen.lineTo(24, 0);
  pen.bezierCurveTo(28, -10, 42, -34, 40, -72);
  pen.closePath();
  shape("#7a4a34");
  pen.strokeStyle = "#5a3424";
  pen.lineWidth = 1.5;
  pen.beginPath();
  pen.ellipse(0, -36, 36, 8, 0, 0.2, Math.PI - 0.2);
  pen.stroke();
  oval(0, -72, 40, 12, "#8f5a40");
  pen.beginPath();                                  // the heap
  pen.moveTo(-36, -72);
  pen.bezierCurveTo(-34, -112, 34, -112, 36, -72);
  pen.quadraticCurveTo(0, -62, -36, -72);
  pen.closePath();
  shape("#ece6ae");
  pen.lineCap = "round";                            // the shreds of papaya
  for (var pass = 0; pass < 2; pass++) {
    pen.strokeStyle = pass ? "#fbf7d6" : "#c2c06c";
    pen.lineWidth = 1.8;
    pen.beginPath();
    for (var s = 0; s < 16; s++) {
      var sx = -28 + dice(s + pass * 20) * 56, sy = -76 - dice(s + 5 + pass * 20) * 24;
      pen.moveTo(sx - 12, sy + 3);
      pen.quadraticCurveTo(sx, sy - 8 + dice(s) * 10, sx + 12, sy + 2);
    }
    pen.stroke();
  }
  oval(-18, -84, 9, 6, FOOD_RED, 0.3);              // tomato
  oval(14, -92, 9, 6, FOOD_RED, -0.4);
  oval(26, -78, 8, 5, FOOD_RED, 0.2);
  hose(-30, -92, -8, -100, 0.2, 4, FOOD_GREEN);     // long beans
  hose(-4, -82, 14, -78, -0.2, 4, FOOD_GREEN);
  hose(0, -104, 14, -110, 0.3, 3, "#c22a22");       // a chilli
  pen.fillStyle = "#c99a5a";                        // peanuts
  for (var p = 0; p < 6; p++) {
    pen.beginPath();
    pen.arc(-24 + dice(p + 31) * 50, -78 - dice(p + 41) * 22, 2.6, 0, 7);
    pen.fill();
  }
  foodLime(-34, -74, 2.9);
}

// Mango and sticky rice: slices of ripe mango laid in a fan, a mound of
// rice with coconut cream over it and yellow beans on the cream.
// One of FOODS' painters ("mangorice"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("mangorice", 700, 900, {size: 1.5});
function foodMangoRice(look, seed) {
  foodPlate(64, FOOD_WHITE);
  pen.beginPath();                                  // the rice
  pen.moveTo(-50, -10);
  pen.bezierCurveTo(-50, -48, 2, -50, 4, -10);
  pen.quadraticCurveTo(-22, -2, -50, -10);
  pen.closePath();
  shape(FOOD_RICE);
  pen.beginPath();                                  // the cream, running down it
  pen.moveTo(-40, -30);
  pen.bezierCurveTo(-34, -46, -10, -48, -2, -30);
  pen.bezierCurveTo(-6, -18, -12, -24, -16, -14);
  pen.bezierCurveTo(-22, -26, -30, -18, -40, -30);
  pen.closePath();
  shape("#ffffff", 1.2);
  pen.fillStyle = "#e2b23a";
  for (var b = 0; b < 6; b++) {
    pen.beginPath();
    pen.arc(-32 + b * 5.5, -36 - (b % 2) * 3, 1.8, 0, 7);
    pen.fill();
  }
  for (var k = 0; k < 5; k++) {                     // the mango, in slices
    pen.save();
    pen.translate(14 + k * 9.5, -14 - k * 1.5);
    pen.rotate(-0.95 + k * 0.05);
    pen.beginPath();
    pen.ellipse(0, 0, 24, 8, 0, 0, 7);
    shape("#f5bf36");
    pen.beginPath();
    pen.ellipse(-2, -2, 16, 3, 0, 0, 7);
    pen.fillStyle = "#fbdc7a";
    pen.fill();
    pen.restore();
  }
  oval(-6, -44, 9, 4, FOOD_GREEN, -0.5);            // a leaf
}

// Sai ua: the sausage of the north, in a coil on a banana leaf, flecked with
// herbs and chilli, and two slices cut from its end.
// One of FOODS' painters ("saiua"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("saiua", 700, 900, {size: 1.5});
function foodSaiUa(look, seed) {
  foodLeaf(74, 34);
  function coil() {
    pen.beginPath();
    for (var a = 0; a <= 60; a++) {
      var turn = a / 60 * Math.PI * 4.6, r = 56 - 44 * a / 60;
      pen.lineTo(-8 + r * Math.cos(turn), -26 + r * 0.56 * Math.sin(turn));
    }
  }
  pen.lineCap = "round";
  pen.lineJoin = "round";
  coil();
  pen.strokeStyle = inkFor("#8f4f2c");
  pen.lineWidth = 8.5 + 2 * LINE;
  pen.stroke();
  coil();
  pen.strokeStyle = "#9a5630";
  pen.lineWidth = 8.5;
  pen.stroke();
  coil();                                           // a line of light along it
  pen.strokeStyle = "rgba(226, 150, 96, 0.7)";
  pen.lineWidth = 2;
  pen.setLineDash([9, 7]);
  pen.stroke();
  pen.setLineDash([]);
  for (var f = 0; f < 26; f++) {                    // the herbs and the chilli in it
    var turn = dice(f + 3) * Math.PI * 4.6, r = 56 - 44 * turn / (Math.PI * 4.6) + (dice(f + 13) - 0.5) * 5;
    pen.fillStyle = f % 3 ? "#3f6a2e" : "#c2412a";
    pen.beginPath();
    pen.arc(-8 + r * Math.cos(turn), -26 + r * 0.56 * Math.sin(turn), 1.5, 0, 7);
    pen.fill();
  }
  for (var s = 0; s < 2; s++) {                     // two slices
    oval(58 + s * 13, -2 + s * 6, 8, 6, "#b56e44");
    pen.fillStyle = "#3f6a2e";
    pen.beginPath();
    pen.arc(57 + s * 13, -3 + s * 6, 1.5, 0, 7);
    pen.arc(61 + s * 13, 0 + s * 6, 1.3, 0, 7);
    pen.fill();
  }
}

// Nam phrik num: a small bowl of green chilli dip on a plate, with what is
// eaten with it: slices of cucumber, a wedge of cabbage, long beans, and
// pieces of pork crackling.
// One of FOODS' painters ("namphrik"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("namphrik", 700, 900, {size: 1.5});
function foodNamPhrik(look, seed) {
  foodPlate(68, FOOD_WHITE);
  pen.beginPath();                                  // the cabbage, at the back
  pen.moveTo(-58, -14);
  pen.bezierCurveTo(-54, -46, -22, -52, -10, -18);
  pen.closePath();
  shape("#cfe0a0");
  pen.strokeStyle = "#8fae5a";
  pen.lineWidth = 1.4;
  pen.beginPath();
  for (var c = 1; c < 4; c++) {
    pen.moveTo(-54 + c * 5, -16);
    pen.bezierCurveTo(-50 + c * 5, -42 + c * 6, -28, -46 + c * 7, -14 - c * 2, -18);
  }
  pen.stroke();
  hose(8, -34, 56, -22, -0.12, 4.5, FOOD_GREEN);    // long beans
  hose(4, -28, 54, -15, -0.1, 4.5, FOOD_GREEN);
  for (var k = 0; k < 4; k++) {                     // cucumber
    oval(26 + k * 9, -6 - k * 1.5, 10, 6, "#dcebb4", 0.2);
    pen.fillStyle = "#b9d08a";
    pen.beginPath();
    pen.ellipse(26 + k * 9, -6 - k * 1.5, 5, 2.6, 0.2, 0, 7);
    pen.fill();
  }
  for (var m = 0; m < 3; m++) {                     // pork crackling: puffed, curled pieces
    pen.save();
    pen.translate(-34 + m * 15, -2 + (m % 2) * 4);
    pen.rotate(-0.3 + m * 0.3);
    pen.beginPath();
    pen.moveTo(-11, 2);
    pen.bezierCurveTo(-12, -10, 8, -13, 12, -3);
    pen.bezierCurveTo(8, 3, -2, -2, -11, 2);
    pen.closePath();
    shape("#e9bd6e");
    pen.restore();
  }
  pen.save();                                       // the dip, in its own small bowl
  pen.translate(-4, -8);
  foodBowl(24, 20, "#f1dfb8", "#8a5e2c", function (wide, flat) {
    pen.fillStyle = "#8ea43e";
    pen.fillRect(-wide, -flat, wide * 2, flat * 2);
    pen.fillStyle = "#4f6a22";
    for (var d = 0; d < 7; d++) {
      pen.beginPath();
      pen.arc(-14 + dice(d + 61) * 28, -3 + dice(d + 71) * 6, 1.6, 0, 7);
      pen.fill();
    }
  });
  pen.restore();
}

// A curry: a bowl of it, green unless its colour is told, with coconut cream
// turned through it, round eggplants, slices of red chilli and leaves of basil.
// One of FOODS' painters ("curry"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (look.colour: the curry's colour, green when left out; look.steam false: no steam); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("curry", 700, 900, {size: 1.5});
function foodCurry(look, seed) {
  var curry = look.colour || "#9db656";
  foodBowl(52, 40, FOOD_WHITE, "#b23a3a", function (wide, flat) {
    pen.fillStyle = curry;
    pen.fillRect(-wide, -flat, wide * 2, flat * 2);
    pen.strokeStyle = "rgba(255, 252, 240, 0.85)";  // the cream
    pen.lineWidth = 3;
    pen.lineCap = "round";
    pen.beginPath();
    pen.ellipse(-6, 2, 30, 6, 0.05, 0.5, 3.4);
    pen.moveTo(26, -4);
    pen.ellipse(12, -3, 14, 3.5, 0, 0, 2.4);
    pen.stroke();
  });
  oval(-22, -42, 9, 7, "#b9d98a");                  // eggplants, half under
  oval(18, -38, 9, 7, "#b9d98a");
  oval(-22, -47, 4, 2.4, "#4f7a2e");
  oval(18, -43, 4, 2.4, "#4f7a2e");
  oval(-2, -36, 6, 3, FOOD_RED, 0.4);               // chilli
  oval(32, -44, 6, 3, FOOD_RED, -0.3);
  pen.save();                                       // basil
  pen.translate(2, -46);
  pen.rotate(-0.5);
  leafPath(pen, 20, 8, 0.1);
  shape("#3f7a36");
  pen.rotate(1.1);
  leafPath(pen, 18, 7, -0.1);
  shape("#3f7a36");
  pen.restore();
  foodSteam(0, -62, look, seed);
}

// Tom yam kung: a bowl of red broth with prawns, straw mushrooms, a stalk of
// lemongrass and lime leaves.
// One of FOODS' painters ("tomyum"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (look.steam false: no steam); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("tomyum", 700, 900, {size: 1.5});
function foodTomYum(look, seed) {
  foodBowl(54, 46, FOOD_WHITE, "#e0902e", function (wide, flat) {
    pen.fillStyle = "#e0622c";
    pen.fillRect(-wide, -flat, wide * 2, flat * 2);
    pen.fillStyle = "#f3a83c";                      // beads of chilli oil
    for (var o = 0; o < 9; o++) {
      pen.beginPath();
      pen.arc(-40 + dice(o + 81) * 80, -5 + dice(o + 91) * 10, 2.2, 0, 7);
      pen.fill();
    }
  });
  hose(-44, -42, 30, -70, 0.06, 5, "#cfdc9a");      // lemongrass
  for (var m = 0; m < 2; m++) {                     // mushrooms, cut in half
    pen.save();
    pen.translate(-26 + m * 40, -46 + m * 4);
    pen.beginPath();
    pen.arc(0, 0, 10, Math.PI, 0);
    pen.closePath();
    shape("#eadfc6");
    pen.beginPath();
    pen.rect(-3.5, 0, 7, 8);
    shape("#f6eeda");
    pen.restore();
  }
  pen.save();                                       // lime leaves: two lobes each
  pen.translate(30, -50);
  pen.rotate(0.9);
  leafPath(pen, 14, 7, 0);
  shape("#2f6a34");
  pen.translate(0, -13);
  leafPath(pen, 13, 6, 0);
  shape("#2f6a34");
  pen.restore();
  foodPrawn(-4, -56, -0.2, 0.8);
  foodPrawn(22, -44, 0.5, 0.66);
  oval(-34, -40, 5, 2.6, "#c22a22", 0.5);           // a chilli
  foodSteam(0, -76, look, seed);
}

// Phat thai: a plate of fried noodles with a prawn on them, bean sprouts and
// chives beside, crushed peanuts, and a wedge of lime.
// One of FOODS' painters ("padthai"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("padthai", 700, 900, {size: 1.5});
function foodPadThai(look, seed) {
  foodPlate(66, FOOD_WHITE);
  pen.beginPath();                                  // the noodles
  pen.moveTo(-44, -10);
  pen.bezierCurveTo(-46, -44, 30, -48, 34, -12);
  pen.quadraticCurveTo(-4, -2, -44, -10);
  pen.closePath();
  shape("#e2a24e");
  pen.lineCap = "round";
  for (var pass = 0; pass < 2; pass++) {
    pen.strokeStyle = pass ? "#f4ca84" : "#b9772c";
    pen.lineWidth = 2;
    pen.beginPath();
    for (var n = 0; n < 12; n++) {
      var nx = -34 + dice(n + pass * 30 + 2) * 58, ny = -14 - dice(n + pass * 30 + 12) * 22;
      pen.moveTo(nx - 12, ny + 2);
      pen.bezierCurveTo(nx - 6, ny - 9, nx + 4, ny + 7, nx + 12, ny - 3);
    }
    pen.stroke();
  }
  pen.fillStyle = "#f2d04a";                        // egg
  pen.beginPath();
  pen.ellipse(-24, -22, 7, 4, 0.3, 0, 7);
  pen.ellipse(8, -16, 6, 3.4, -0.2, 0, 7);
  pen.fill();
  pen.strokeStyle = "#fbf6e8";                      // bean sprouts
  pen.lineWidth = 2.4;
  pen.beginPath();
  for (var s = 0; s < 6; s++) {
    pen.moveTo(36 + s * 3, -20 + s * 2);
    pen.quadraticCurveTo(46 + s * 2, -28 + s * 3, 58, -16 + s * 2.2);
  }
  pen.stroke();
  hose(34, -28, 60, -24, 0.1, 2.6, FOOD_GREEN);     // chives
  hose(32, -24, 58, -19, 0.1, 2.6, FOOD_GREEN);
  pen.fillStyle = "#c99a5a";                        // peanuts, in a small heap
  for (var p = 0; p < 12; p++) {
    pen.beginPath();
    pen.arc(-52 + dice(p + 51) * 16, -6 - dice(p + 61) * 8, 2.2, 0, 7);
    pen.fill();
  }
  foodPrawn(-4, -36, -0.1, 0.72);
  foodLime(44, -6, 0.3);
}

// Mu ping: pork grilled on skewers of bamboo, three of them on a leaf, each
// piece glazed and marked by the fire.
// One of FOODS' painters ("muping"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (not read); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("muping", 700, 900, {size: 1.5});
function foodMuPing(look, seed) {
  foodLeaf(74, 34);
  for (var k = 2; k >= 0; k--) {                    // the one at the back first
    pen.save();
    pen.translate(-4 + k * 5, -6 - k * 19);
    pen.rotate(-0.14 + k * 0.09);
    hose(-70, 2, 62, -2, 0, 2.6, "#d9b673");        // the skewer
    for (var m = 0; m < 4; m++) {                   // the pieces of pork
      pen.save();
      pen.translate(-34 + m * 24, 0);
      pen.rotate((dice(k * 5 + m) - 0.5) * 0.3);
      pen.beginPath();
      pen.moveTo(-11, -6);
      pen.quadraticCurveTo(0, -10, 11, -6);
      pen.quadraticCurveTo(14, 0, 11, 7);
      pen.quadraticCurveTo(0, 10, -11, 7);
      pen.quadraticCurveTo(-14, 0, -11, -6);
      pen.closePath();
      shape("#a35c2c");
      pen.fillStyle = "#d08a3e";                    // the glaze
      pen.beginPath();
      pen.ellipse(-2, -3, 6, 2, 0, 0, 7);
      pen.fill();
      pen.strokeStyle = "#4a2a18";                  // the marks of the fire
      pen.lineWidth = 1.6;
      pen.beginPath();
      pen.moveTo(-6, 3);
      pen.lineTo(-2, 6);
      pen.moveTo(3, 2);
      pen.lineTo(7, 5);
      pen.stroke();
      pen.restore();
    }
    pen.restore();
  }
}

// Khanom khrok: small cakes of coconut cream, cooked in the round iron pan
// with seven hollows, each white with a browned edge and a little green onion.
// One of FOODS' painters ("khanomkrok"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (look.steam false: no steam); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line changed: call food() instead.
// e.g. food("khanomkrok", 700, 900, {size: 1.5});
function foodKhanomKrok(look, seed) {
  var iron = "#4a4a50";
  hose(-64, -18, -82, -22, 0, 7, iron);             // the pan's two ears
  hose(64, -18, 82, -22, 0, 7, iron);
  pen.beginPath();                                  // its side
  pen.moveTo(-66, -22);
  pen.bezierCurveTo(-62, 4, 62, 4, 66, -22);
  pen.closePath();
  shape(blend(iron, "#000000", 0.25));
  oval(0, -22, 66, 24, iron);
  var holes = [[0, -22], [-36, -22], [36, -22], [-18, -33], [18, -33], [-18, -11], [18, -11]];
  for (var h = 0; h < 7; h++) {
    oval(holes[h][0], holes[h][1], 15, 8.5, "#d9a85a");   // the browned edge
    pen.beginPath();
    pen.ellipse(holes[h][0], holes[h][1] - 1.5, 11.5, 6, 0, 0, 7);
    pen.fillStyle = "#fdfaf0";
    pen.fill();
    pen.fillStyle = FOOD_GREEN;
    pen.beginPath();
    pen.arc(holes[h][0] - 3, holes[h][1] - 2, 1.5, 0, 7);
    pen.arc(holes[h][0] + 3, holes[h][1] - 1, 1.3, 0, 7);
    pen.fill();
  }
  foodSteam(0, -40, look, seed);
}

// A khantok: the low round table of the north, red lacquer on a ring of
// turned legs, set with small bowls and a basket of sticky rice.
// One of FOODS' painters ("khantoke"): food() calls it with the pen moved to the dish's foot and scaled.
// look: food()'s look (passed to the basket); seed: a number for the steam (food() passes x * 0.013).
// Returns nothing: it draws with pen at (0, 0) and may leave pen's fill, line and scale changed: call food() instead.
// e.g. food("khantoke", 700, 900, {size: 1.5});
function foodKhantoke(look, seed) {
  var lac = "#a9302a", deep = "#7a1f1a";
  pen.scale(1.35, 1.35);                            // a khantok is more than twice as wide as a bowl
  oval(0, -6, 66, 15, deep);                        // the ring it stands on
  for (var k = -3; k <= 3; k++) {                   // the turned legs
    var lx = k * 19;
    hose(lx, -10, lx * 1.12, -50, 0, 6.5, lac);
    oval(lx * 1.06, -30, 5.5, 4, lac);
  }
  oval(0, -56, 100, 30, lac);                       // the top, and its raised edge
  oval(0, -58, 88, 24, deep);
  pen.fillStyle = STYLE.gold;                       // gold on the edge
  for (var g = 0; g < 26; g++) {
    var ga = g / 26 * Math.PI * 2;
    pen.beginPath();
    pen.arc(94 * Math.cos(ga), -57 + 27 * Math.sin(ga), 1.8, 0, 7);
    pen.fill();
  }
  function small(x, y, colour, more) {              // one small bowl on the table
    pen.save();
    pen.translate(x, y);
    foodBowl(22, 17, "#f1dfb8", "#8a5e2c", function (wide, flat) {
      pen.fillStyle = colour;
      pen.fillRect(-wide, -flat, wide * 2, flat * 2);
      pen.fillStyle = more;
      for (var d = 0; d < 5; d++) {
        pen.beginPath();
        pen.arc(-12 + dice(d + x) * 24, -2 + dice(d + x + 9) * 5, 2.2, 0, 7);
        pen.fill();
      }
    });
    pen.restore();
  }
  pen.save();                                       // the basket of rice, at the back
  pen.translate(4, -66);
  pen.scale(0.42, 0.42);
  foodStickyRice(look, seed);
  pen.restore();
  small(-52, -54, "#9db656", "#fdfaf0");            // a green curry
  small(54, -54, "#b8452e", "#e9a03a");             // nam phrik ong
  small(-24, -44, "#8a4a2a", "#c98232");            // hang le
  small(28, -44, "#8ea43e", "#4f6a22");             // nam phrik num
}

// The dishes: each name, its painter, how far it reaches to each side (for
// its shadow), its name in Thai, and how that is said.
var FOODS = {
  stickyrice: {draw: foodStickyRice, wide: 50, thai: "ข้าวเหนียว", say: "khao niao"},
  khaosoi: {draw: foodKhaoSoi, wide: 56, thai: "ข้าวซอย", say: "khao soi"},
  somtam: {draw: foodSomTam, wide: 44, thai: "ส้มตำ", say: "som tam"},
  mangorice: {draw: foodMangoRice, wide: 66, thai: "ข้าวเหนียวมะม่วง", say: "khao niao mamuang"},
  saiua: {draw: foodSaiUa, wide: 76, thai: "ไส้อั่ว", say: "sai ua"},
  namphrik: {draw: foodNamPhrik, wide: 70, thai: "น้ำพริกหนุ่ม", say: "nam phrik num"},
  curry: {draw: foodCurry, wide: 56, thai: "แกงเขียวหวาน", say: "kaeng khiao wan"},
  tomyum: {draw: foodTomYum, wide: 58, thai: "ต้มยำกุ้ง", say: "tom yam kung"},
  padthai: {draw: foodPadThai, wide: 68, thai: "ผัดไทย", say: "phat thai"},
  muping: {draw: foodMuPing, wide: 76, thai: "หมูปิ้ง", say: "mu ping"},
  khanomkrok: {draw: foodKhanomKrok, wide: 80, thai: "ขนมครก", say: "khanom khrok"},
  khantoke: {draw: foodKhantoke, wide: 135, thai: "ขันโตก", say: "khantok"}
};

// One dish, standing on (x, y). "name" is a key of FOODS.
// food(name, x, y, look) draws one dish with a soft shadow under it.
//   name   a key of FOODS: stickyrice, khaosoi, somtam, mangorice, saiua, namphrik, curry, tomyum,
//          padthai, muping, khanomkrok, khantoke; another name is reported by checkName() and nothing is drawn
//   x, y   the middle of what it stands on, pixels of the sheet
//   look   optional; its keys: FOOD_KEYS above (size 1, colour for the curry, steam false)
// Returns nothing: it draws with pen, and leaves pen as it found it. It sets the kit's LINE and FINE
// while it draws, and puts them back to STYLE.line and 1 after.
// e.g. food("khaosoi", 700, 900, {size: 2});
function food(name, x, y, look) {
  look = look || {};
  checkNames("The food's name", look, FOOD_KEYS);
  if (!FOODS[name]) { checkName("The food", name, FOODS); return; }
  var size = (look.size || 1) * 0.64;
  LINE = STYLE.line * Math.max(0.5, Math.min(1, 0.4 + 0.4 * size)) / size;   // a small dish is not inked with a thick pen
  FINE = LINE / STYLE.line;
  pen.fillStyle = "rgba(70, 45, 30, 0.18)";         // a soft shadow under it
  pen.beginPath();
  pen.ellipse(x, y + 2 * size, FOODS[name].wide * 1.06 * size, 9 * size, 0, 0, 7);
  pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  FOODS[name].draw(look, x * 0.013);
  pen.restore();
  FINE = 1;
  LINE = STYLE.line;
}
