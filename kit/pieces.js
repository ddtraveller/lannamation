// Pieces of the north for the Lanna cartoon kit: the inanimate things of a
// village and a temple yard that the kit did not draw. Each is a painter on
// a brush, as house() and banana() are, standing on (x, base) or set at
// (x, y), with a size (1 is the kit's own scale) and, where it moves, the
// second t. Load this file after oldcartoon.js.
//
// What each one is, and what the photographs it was drawn from do (Wikimedia
// Commons, free licences; nothing copied, only what they show):
//   hong       the hamsa, the sacred swan that crowns the tall tung poles of
//              a northern temple: a swan's body, the neck curved up and back,
//              a crest and a pointed beak, one wing swept up behind with
//              feather notches, and a tail that curls up in a flame scroll;
//              gold. tung(brush, x, base, t, true) sets one on the pole.
//   namton     the water jar at the gate, Lanna hospitality: a round brown
//              clay pot with a lid on a small wooden stand of four posts
//              under a little roof, and a coconut-shell dipper on a hook.
//   chediSai   a Songkran sand pagoda: a cone of pale sand, smoothed, with
//              small paper flags (tung chai) on sticks pushed into it, each
//              a triangle of a bright colour that flutters.
//   pratheep   a phang pratheep, the clay lamp of Yi Peng: a shallow round
//              dish of terracotta, a small flame above its rim that leans and
//              flickers, and a warm glow on the ground round it. Rows of them
//              line the walls and paths at night: pratheepRow().
//   tub        the tub (ตูบ), the small hut of a poor family of the north, as
//              the tales have it: short stilts, walls of woven bamboo (fa khat
//              tae), a doorway with a short bamboo ladder, a steep roof of
//              grass thatch ragged at the eaves; a lamp's glow in the door.
//   firewood   a bundle of firewood (หลัว), as a child carries it home: sticks of
//              a length, their cut ends pale, bound round in two places with
//              a vine; or loose on the ground, gathered but not yet bound.
//   krathong   a krathong to float at Yi Peng: a slice of banana trunk, a ring
//              of folded banana-leaf points round it, marigolds and an orchid,
//              a candle with a flame and three incense sticks; on water it
//              bobs and its flame flickers.
//   oxcart     the two-wheeled cart of the north (kwian): two tall wheels of
//              twelve spokes with an iron tyre and a thick hub, a plank bed on
//              the axle, a slatted rail each side whose ends sweep up and out
//              in a horn, and a long shaft forward to the yoke. Its wheels
//              turn with "turn" (radians); the shaft runs to "yoke", a point
//              of the scene on the ox's withers, when one is given. Drawn
//              before the beast, so the beast stands over the shaft.
//   drumCart   the great drum of the north on its cart: a long barrel drum
//              laced with rope through rings of wooden pegs, three small
//              drums at its head, a cart of two tall gold-spoked wheels, a
//              long pole with a small wheel at its end, a gold finial.
var PIECES_KIT = ["hong", "namton", "chediSai", "pratheep", "pratheepRow", "krathong", "oxcart", "drumCart"];

// hong(brush, x, y, size, colour) draws the golden hamsa (see the list above), about 70 long and 66 tall
// at size 1. brush: a canvas 2D context (pen, or a set's sheet); x, y: its feet, pixels of the sheet;
// size: 1 when left out; colour: its gold ("#e0b23a" when left out). Returns nothing: it draws with
// brush, and leaves brush as it found it.
// e.g. hong(pen, 600, 400, 1.2);
function hong(brush, x, y, size, colour) {        // standing on (x, y), facing right
  var gold = colour || "#e0b23a", line = "#7a5218";
  brush.save();
  brush.translate(x, y);
  brush.scale(size || 1, size || 1);
  brush.lineJoin = "round";
  brush.fillStyle = gold;
  brush.strokeStyle = line;
  brush.lineWidth = 1.6;
  brush.beginPath();                                // the tail: a flame scroll that curls up and back
  brush.moveTo(-14, -10);
  brush.bezierCurveTo(-30, -14, -40, -30, -34, -46);
  brush.bezierCurveTo(-31, -54, -22, -54, -22, -46);
  brush.bezierCurveTo(-26, -36, -20, -28, -12, -22);
  brush.closePath();
  brush.fill();
  brush.stroke();
  brush.beginPath();                                // the body: a swan's, deep at the breast
  brush.ellipse(0, -14, 18, 10, 0, 0, 7);
  brush.fill();
  brush.stroke();
  brush.beginPath();                                // the wing, swept up and back: four feathers, each a rounded lobe, the longest highest
  brush.moveTo(-8, -20);
  brush.bezierCurveTo(-6, -36, 2, -48, 14, -56);
  brush.quadraticCurveTo(20, -58, 18, -52);
  brush.quadraticCurveTo(14, -47, 12, -44);
  brush.quadraticCurveTo(14, -40, 10, -38);
  brush.quadraticCurveTo(6, -36, 6, -32);
  brush.quadraticCurveTo(6, -28, 2, -26);
  brush.quadraticCurveTo(-2, -24, -2, -20);
  brush.closePath();
  brush.fill();
  brush.stroke();
  brush.beginPath();                                // the feathers' lines
  brush.moveTo(-4, -22); brush.lineTo(14, -50);
  brush.moveTo(-2, -22); brush.lineTo(10, -40);
  brush.moveTo(0, -22); brush.lineTo(5, -30);
  brush.stroke();
  brush.lineWidth = 7;                              // the neck, up and curving back
  brush.strokeStyle = gold;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(12, -20);
  brush.quadraticCurveTo(26, -30, 22, -48);
  brush.stroke();
  brush.lineWidth = 1.6;
  brush.strokeStyle = line;
  brush.beginPath();
  brush.moveTo(15, -19);
  brush.quadraticCurveTo(30, -31, 25, -49);
  brush.moveTo(9, -22);
  brush.quadraticCurveTo(22, -30, 19, -47);
  brush.stroke();
  brush.beginPath();                                // the head, the crest, the beak
  brush.ellipse(21, -52, 6.5, 5.5, 0, 0, 7);
  brush.fill();
  brush.stroke();
  brush.beginPath();
  brush.moveTo(17, -56);
  brush.lineTo(13, -64);
  brush.lineTo(19, -59);
  brush.lineTo(18, -66);
  brush.lineTo(22, -58);
  brush.closePath();
  brush.fill();
  brush.stroke();
  brush.beginPath();
  brush.moveTo(26, -53);
  brush.lineTo(36, -50);
  brush.lineTo(26, -48);
  brush.closePath();
  brush.fill();
  brush.stroke();
  brush.fillStyle = "#2a1a0a";
  brush.beginPath();
  brush.ellipse(22, -53, 1.3, 1.3, 0, 0, 7);
  brush.fill();
  brush.restore();
}

// namton(brush, x, base, size) draws the water jar on its stand, about 60 wide and 116 tall at size 1.
// brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out. Returns nothing:
// it draws with brush, and leaves brush as it found it.
// e.g. namton(pen, 820, 940, 1.2);
function namton(brush, x, base, size) {          // standing on (x, base)
  var s = size || 1;
  brush.save();
  brush.translate(x, base);
  brush.scale(s, s);
  brush.lineJoin = "round";
  brush.strokeStyle = "#5a3d2a";                    // the stand: four posts, a shelf, a little roof
  brush.lineWidth = 5;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(-24, 0); brush.lineTo(-22, -92);
  brush.moveTo(24, 0); brush.lineTo(22, -92);
  brush.moveTo(-16, -4); brush.lineTo(-14, -88);
  brush.moveTo(16, -4); brush.lineTo(14, -88);
  brush.stroke();
  brush.fillStyle = "#8a6240";
  brush.fillRect(-30, -44, 60, 6);
  brush.fillStyle = "#6e4b33";
  brush.beginPath();
  brush.moveTo(-36, -92);
  brush.lineTo(0, -116);
  brush.lineTo(36, -92);
  brush.closePath();
  brush.fill();
  brush.strokeStyle = "#4a3222";
  brush.lineWidth = 2;
  brush.stroke();
  brush.fillStyle = "#9a5a38";                      // the jar: round, brown clay, a lid with a knob
  brush.beginPath();
  brush.ellipse(0, -62, 19, 17, 0, 0, 7);
  brush.fill();
  brush.strokeStyle = "#5a3220";
  brush.lineWidth = 1.8;
  brush.stroke();
  brush.fillStyle = "rgba(255, 230, 200, 0.25)";    // a light down one side
  brush.beginPath();
  brush.ellipse(-7, -66, 5, 9, 0.3, 0, 7);
  brush.fill();
  brush.fillStyle = "#7a4a2a";
  brush.beginPath();
  brush.ellipse(0, -78, 11, 4, 0, 0, 7);
  brush.fill();
  brush.stroke();
  brush.beginPath();
  brush.ellipse(0, -82, 3, 2.5, 0, 0, 7);
  brush.fill();
  brush.strokeStyle = "#5a3d2a";                    // the dipper: a coconut shell on a stick, hung from the post
  brush.lineWidth = 2;
  brush.beginPath();
  brush.moveTo(30, -84);
  brush.lineTo(30, -60);
  brush.stroke();
  brush.fillStyle = "#5c3a22";
  brush.beginPath();
  brush.ellipse(30, -56, 6, 4, 0, 0, Math.PI);
  brush.closePath();
  brush.fill();
  brush.restore();
}

// chediSai(brush, x, base, size, t, seed) draws a sand pagoda with five flags, 92 wide and about 110
// tall at size 1. brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out;
// t: seconds (0 when left out: still flags); seed: a whole number that sets the flags (0). Returns
// nothing: it draws with brush, and leaves brush as it found it.
// e.g. chediSai(pen, 700, 920, 1, t, 2);
function chediSai(brush, x, base, size, t, seed) { // standing on (x, base); the flags flutter with t
  var s = size || 1, n, clock = t || 0, k = seed || 0;
  var colours = ["#d8423a", "#f28c28", "#f4c542", "#3f8f5a", "#2f6fb5", "#f2ead8"];
  brush.save();
  brush.translate(x, base);
  brush.scale(s, s);
  brush.fillStyle = "#d9c296";                      // the sand: a cone, darker at its foot, a lighter cap
  brush.beginPath();
  brush.moveTo(-46, 0);
  brush.quadraticCurveTo(-20, -40, 0, -70);
  brush.quadraticCurveTo(20, -40, 46, 0);
  brush.closePath();
  brush.fill();
  brush.fillStyle = "#c7ad7c";
  brush.beginPath();
  brush.moveTo(-46, 0);
  brush.quadraticCurveTo(0, -8, 46, 0);
  brush.quadraticCurveTo(0, 8, -46, 0);
  brush.fill();
  brush.fillStyle = "#e8d6ae";
  brush.beginPath();
  brush.moveTo(-8, -52);
  brush.quadraticCurveTo(0, -70, 8, -52);
  brush.quadraticCurveTo(0, -46, -8, -52);
  brush.fill();
  for (n = 0; n < 5; n++) {                         // the flags: sticks pushed in, a bright triangle on each that flutters
    var fx = -24 + n * 12 + (dice(k * 7 + n) - 0.5) * 6, fy = -22 - Math.abs(fx) * 0.8 - dice(k * 7 + n + 3) * 14, tall = 34 + dice(k * 7 + n + 5) * 12;
    brush.strokeStyle = "#f3eee2";
    brush.lineWidth = 1.4;
    brush.beginPath();
    brush.moveTo(fx, fy);
    brush.lineTo(fx, fy - tall);
    brush.stroke();
    var wave = Math.sin(clock * 5 + n * 1.3) * 3, lift = Math.sin(clock * 7 + n) * 1.5;
    brush.fillStyle = colours[(n + k) % colours.length];
    brush.beginPath();
    brush.moveTo(fx, fy - tall);
    brush.lineTo(fx + 16 + wave, fy - tall + 6 + lift);
    brush.lineTo(fx, fy - tall + 12);
    brush.closePath();
    brush.fill();
  }
  brush.restore();
}

// pratheep(brush, x, y, size, t, seed, look) draws one clay lamp, 20 across, its flame about 17 tall at
// size 1. brush: a canvas 2D context; x, y: pixels of the sheet; size: 1 when left out; t: seconds
// (0); seed: a number that sets this flame apart (0); look: optional, {glow: false} for no light.
// Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. pratheep(pen, 400, 900, 1.5, t, 3);
function pratheep(brush, x, y, size, t, seed, look) {   // the dish on (x, y); the flame flickers with t; look.glow false: no light on the ground
  var s = size || 1, clock = t || 0, k = seed || 0, lit = !(look && look.glow === false);
  var flick = 1 + 0.25 * Math.sin(clock * 11 + k * 1.7) * Math.sin(clock * 7.3 + k), lean = Math.sin(clock * 4 + k * 2.1) * 2;
  brush.save();
  brush.translate(x, y);
  brush.scale(s, s);
  if (lit) {
    var glow = brush.createRadialGradient(0, -6, 0, 0, -6, 34);   // the warm glow on the ground
    glow.addColorStop(0, "rgba(255, 190, 90, 0.45)");
    glow.addColorStop(1, "rgba(255, 170, 60, 0)");
    brush.fillStyle = glow;
    brush.beginPath();
    brush.ellipse(0, -2, 34, 14, 0, 0, 7);
    brush.fill();
  }
  brush.fillStyle = "#a8603c";                      // the dish: shallow terracotta, a rim
  brush.beginPath();
  brush.ellipse(0, -4, 10, 3.5, 0, 0, Math.PI);
  brush.closePath();
  brush.fill();
  brush.fillStyle = "#c27a50";
  brush.beginPath();
  brush.ellipse(0, -4, 10, 3.5, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "#7a4028";
  brush.beginPath();
  brush.ellipse(0, -4, 7, 2.2, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "#ffb03a";                      // the flame, and its white heart
  brush.beginPath();
  brush.moveTo(-3, -5);
  brush.quadraticCurveTo(-4 + lean, -12 * flick, lean * 1.5, -17 * flick);
  brush.quadraticCurveTo(4 + lean, -12 * flick, 3, -5);
  brush.closePath();
  brush.fill();
  brush.fillStyle = "#fff3c0";
  brush.beginPath();
  brush.moveTo(-1.5, -5);
  brush.quadraticCurveTo(-1.5 + lean * 0.5, -9 * flick, lean * 0.8, -11 * flick);
  brush.quadraticCurveTo(1.5 + lean * 0.5, -9 * flick, 1.5, -5);
  brush.closePath();
  brush.fill();
  brush.restore();
}

// pratheepRow(brush, x, y, count, gap, size, t) draws count lamps, gap pixels apart, the first at
// (x, y), pixels of the sheet, each with its own flicker. Returns nothing: it draws with brush.
// e.g. pratheepRow(pen, 200, 900, 12, 60, 1, t);
function pratheepRow(brush, x, y, count, gap, size, t) {   // a row of lamps from (x, y) to the right
  for (var n = 0; n < count; n++) { pratheep(brush, x + n * gap, y, size, t, n); }
}

// krathong(brush, x, y, size, t, afloat) draws a krathong, 52 wide and about 60 tall with its flame
// at size 1. brush: a canvas 2D context; x, y: pixels of the sheet; size: 1 when left out; t:
// seconds (0); afloat: true to bob. Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. krathong(pen, 640, 880, 1.4, t, true);
function krathong(brush, x, y, size, t, afloat) { // set at (x, y), the middle of its base; afloat, it bobs on the water
  var s = size || 1, clock = t || 0, bob = afloat ? Math.sin(clock * 1.7) * 2 : 0, tilt = afloat ? Math.sin(clock * 1.3) * 0.05 : 0, n;
  brush.save();
  brush.translate(x, y + bob);
  brush.rotate(tilt);
  brush.scale(s, s);
  brush.fillStyle = "#e9dcb0";                      // the base: a slice of banana trunk
  brush.beginPath();
  brush.ellipse(0, 0, 26, 8, 0, 0, Math.PI);
  brush.lineTo(-26, -10);
  brush.ellipse(0, -10, 26, 8, 0, Math.PI, 0);
  brush.closePath();
  brush.fill();
  brush.strokeStyle = "#b9a675";
  brush.lineWidth = 1.2;
  brush.stroke();
  brush.fillStyle = "#3f8f4a";                      // the ring of folded leaf points round the rim
  brush.strokeStyle = "#245a2c";
  for (n = 0; n < 12; n++) {
    var a = n / 12 * Math.PI * 2, px = Math.cos(a) * 26, py = -10 + Math.sin(a) * 8;
    brush.beginPath();
    brush.moveTo(px - Math.sin(a) * 5, py + Math.cos(a) * 1.5);
    brush.lineTo(px * 1.3, py - 9 + Math.sin(a) * 2);
    brush.lineTo(px + Math.sin(a) * 5, py - Math.cos(a) * 1.5);
    brush.closePath();
    brush.fill();
    brush.stroke();
  }
  brush.fillStyle = "#f2a51c";                      // marigolds, an orchid
  [[-12, -16], [8, -14], [-2, -20]].forEach(function (m) {
    brush.beginPath();
    brush.ellipse(m[0], m[1], 7, 6, 0, 0, 7);
    brush.fill();
    brush.fillStyle = "#d8841a";
    brush.beginPath();
    brush.ellipse(m[0], m[1], 3, 2.5, 0, 0, 7);
    brush.fill();
    brush.fillStyle = "#f2a51c";
  });
  brush.fillStyle = "#b65aa8";
  for (n = 0; n < 5; n++) {
    var oa = n / 5 * Math.PI * 2;
    brush.beginPath();
    brush.ellipse(14 + Math.cos(oa) * 5, -22 + Math.sin(oa) * 4, 3.5, 2, oa, 0, 7);
    brush.fill();
  }
  brush.fillStyle = "#f7e9f4";
  brush.beginPath();
  brush.ellipse(14, -22, 2, 2, 0, 0, 7);
  brush.fill();
  brush.strokeStyle = "#8a6a4a";                    // three incense sticks
  brush.lineWidth = 1.3;
  brush.beginPath();
  for (n = -1; n <= 1; n++) {
    brush.moveTo(-14 + n * 2, -18);
    brush.lineTo(-18 + n * 4, -52);
  }
  brush.stroke();
  brush.fillStyle = "#f2d16a";                      // the candle, and its flame
  brush.fillRect(0, -40, 4, 22);
  var flick = 1 + 0.3 * Math.sin(clock * 12) * Math.sin(clock * 7.7);
  brush.fillStyle = "#ffb03a";
  brush.beginPath();
  brush.moveTo(-0.5, -40);
  brush.quadraticCurveTo(-3, -46 * flick, 2, -52 * flick);
  brush.quadraticCurveTo(6, -46 * flick, 4.5, -40);
  brush.closePath();
  brush.fill();
  brush.restore();
}

// oxcart(brush, x, base, size, turn, facing, yoke) draws the kwian, its wheels 124 across and its
// rail's horns 206 above base at size 1, its shaft out about 260 ahead of the axle.
//   brush    a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out
//   turn     the wheels' turn, radians (0); the ground covered divided by 62 x size rolls them true
//   facing   1 (right, the default) or -1; yoke: optional [x, y], pixels of the sheet
// Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. oxcart(pen, 500, 940, 1, t * 120 / 62, 1, [760, 820]);   // rolling 120 pixels a second
function oxcart(brush, x, base, size, turn, facing, yoke) {   // the axle over (x, base), the wheels' feet on base; facing 1 goes right
  var s = size || 1, f = facing || 1, R = 62, spin = turn || 0, n;
  var wood = "#8a7156", dark = "#4e3b2a", iron = "#5a4a40";
  function wheel(cx, cy, shade) {
    brush.save();
    brush.translate(cx, cy);
    brush.rotate(spin * f);
    brush.strokeStyle = shade ? "#6a5a48" : wood;
    brush.lineWidth = 5;
    brush.lineCap = "round";
    brush.beginPath();
    for (n = 0; n < 12; n++) {
      var a = n * Math.PI / 6;
      brush.moveTo(0, 0);
      brush.lineTo(Math.cos(a) * (R - 5), Math.sin(a) * (R - 5));
    }
    brush.stroke();
    brush.strokeStyle = shade ? "#5c4c40" : "#9a8060";    // the felloe, and the iron tyre outside it
    brush.lineWidth = 9;
    brush.beginPath();
    brush.ellipse(0, 0, R - 4, R - 4, 0, 0, 2 * Math.PI);
    brush.stroke();
    brush.strokeStyle = iron;
    brush.lineWidth = 4;
    brush.beginPath();
    brush.ellipse(0, 0, R + 1, R + 1, 0, 0, 2 * Math.PI);
    brush.stroke();
    brush.fillStyle = shade ? "#3e2e22" : dark;              // the hub
    brush.beginPath();
    brush.ellipse(0, 0, 12, 12, 0, 0, 2 * Math.PI);
    brush.fill();
    brush.fillStyle = "#2a1e16";
    brush.beginPath();
    brush.ellipse(0, 0, 4, 4, 0, 0, 2 * Math.PI);
    brush.fill();
    brush.restore();
  }
  function rail(dy, shade) {                      // a slatted rail with horned ends, from the back of the bed to its front
    brush.strokeStyle = shade ? "#6a5a48" : wood;
    brush.lineCap = "round";
    brush.lineWidth = 5;
    brush.beginPath();
    brush.moveTo(-104, -100 + dy);
    brush.quadraticCurveTo(-118, -112 + dy, -124, -144 + dy);    // the horn at the back, up and out
    brush.moveTo(-104, -100 + dy);
    brush.lineTo(96, -100 + dy);
    brush.quadraticCurveTo(112, -112 + dy, 118, -144 + dy);      // and at the front
    brush.moveTo(-104, -50 + dy);
    brush.lineTo(96, -50 + dy);
    brush.stroke();
    brush.lineWidth = 3.5;
    brush.beginPath();
    for (n = -90; n <= 90; n += 18) {
      brush.moveTo(n, -50 + dy);
      brush.lineTo(n + 2, -100 + dy);
    }
    brush.stroke();
  }
  brush.save();
  brush.translate(x, base - R);
  brush.scale(s * f, s);
  wheel(16, 0, true);                              // the far wheel, a little behind the near one in the picture
  rail(-16, true);                                 // the far rail
  brush.fillStyle = "#6e5840";                     // the bed on its axle beam
  brush.fillRect(-110, -50, 220, 12);
  brush.fillStyle = dark;
  brush.fillRect(-40, -38, 80, 10);
  brush.strokeStyle = dark;                        // the shaft forward, to the yoke on the ox's withers
  brush.lineWidth = 7;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(60, -44);
  if (yoke) { brush.lineTo((yoke[0] - x) / (s * f), (yoke[1] - (base - R)) / s); } else { brush.lineTo(260, -88); }
  brush.stroke();
  rail(0, false);                                  // the near rail
  wheel(0, 0, false);                              // the near wheel
  brush.restore();
}

// drumCart(brush, x, base, size, facing) draws the great drum on its cart, about 450 long and 240
// tall at size 1. brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out;
// facing: 1 (the head to the right, the default) or -1. Returns nothing: it draws with brush, and
// leaves brush as it found it.
// e.g. drumCart(pen, 900, 940, 0.6, -1);
function drumCart(brush, x, base, size, facing) { // the axle over (x, base); the drum's head toward the way it faces
  var s = size || 1, f = facing || 1, n;
  brush.save();
  brush.translate(x, base);
  brush.scale(s * f, s);
  function wheel(cx, cy, r, shade) {
    brush.save();
    brush.translate(cx, cy);
    brush.strokeStyle = shade ? "#8a7a3a" : "#c9a53a";   // gold-painted spokes
    brush.lineWidth = 4;
    brush.beginPath();
    for (n = 0; n < 16; n++) { brush.moveTo(0, 0); brush.lineTo(Math.cos(n * Math.PI / 8) * (r - 4), Math.sin(n * Math.PI / 8) * (r - 4)); }
    brush.stroke();
    brush.strokeStyle = shade ? "#5a4a30" : "#7a6a40";
    brush.lineWidth = 8;
    brush.beginPath();
    brush.ellipse(0, 0, r - 3, r - 3, 0, 0, 2 * Math.PI);
    brush.stroke();
    brush.fillStyle = "#c9a53a";
    brush.beginPath();
    brush.ellipse(0, 0, 11, 11, 0, 0, 2 * Math.PI);
    brush.fill();
    brush.restore();
  }
  wheel(20, -70, 70, true);                        // the far wheel
  brush.strokeStyle = "#4a3a2a";                   // the frame: the axle beam under the drum, and from its tail the long
  brush.lineWidth = 8;                             // pole back to a small wheel, with a handle bar above the pole
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(-100, -78);
  brush.lineTo(130, -78);
  brush.moveTo(-60, -78);
  brush.lineTo(-300, -66);
  brush.moveTo(-120, -110);
  brush.lineTo(-300, -92);
  brush.stroke();
  brush.fillStyle = "#4a3a2a";
  brush.beginPath();
  brush.ellipse(-300, -30, 14, 14, 0, 0, 2 * Math.PI);
  brush.fill();
  brush.lineWidth = 6;
  brush.beginPath();
  brush.moveTo(-300, -92);
  brush.lineTo(-300, -30);
  brush.stroke();
  brush.fillStyle = "#b5683a";                     // the barrel drum: long, a little narrower at its tail
  brush.beginPath();
  brush.moveTo(-118, -206);
  brush.quadraticCurveTo(-40, -238, 60, -232);
  brush.lineTo(60, -72);
  brush.quadraticCurveTo(-40, -66, -118, -98);
  brush.closePath();
  brush.fill();
  brush.strokeStyle = "#5a2e18";
  brush.lineWidth = 2;
  brush.stroke();
  brush.fillStyle = "#9a5530";                     // the tail's skin, seen edge-on
  brush.beginPath();
  brush.ellipse(-118, -152, 14, 54, 0, 0, 2 * Math.PI);
  brush.fill();
  brush.stroke();
  brush.fillStyle = "#d9a06a";                     // the head: a skin stretched in a ring of pegs
  brush.beginPath();
  brush.ellipse(62, -152, 22, 80, 0, 0, 2 * Math.PI);
  brush.fill();
  brush.stroke();
  brush.fillStyle = "#6a3a1a";
  for (n = 0; n < 14; n++) {
    var a = n / 14 * Math.PI * 2;
    brush.beginPath();
    brush.ellipse(62 + Math.cos(a) * 24, -152 + Math.sin(a) * 86, 5, 5, 0, 0, 2 * Math.PI);
    brush.fill();
  }
  brush.strokeStyle = "rgba(240, 220, 180, 0.7)"; // the lacing
  brush.lineWidth = 1.5;
  brush.beginPath();
  for (n = 0; n < 7; n++) {
    brush.moveTo(40, -232 + n * 24);
    brush.lineTo(-106, -204 + n * 17);
  }
  brush.stroke();
  for (n = 0; n < 3; n++) {                        // three small drums at the head, their faces forward
    var dy = -236 + n * 54;
    brush.fillStyle = "#a85a30";
    brush.fillRect(66, dy, 46, 42);
    brush.fillStyle = "#e0b47a";
    brush.beginPath();
    brush.ellipse(112, dy + 21, 8, 21, 0, 0, 2 * Math.PI);
    brush.fill();
    brush.strokeStyle = "#5a2e18";
    brush.lineWidth = 1.5;
    brush.stroke();
  }
  brush.fillStyle = "#e0b23a";                     // the gold finial on the beam, ahead of the head
  brush.beginPath();
  brush.moveTo(128, -88);
  brush.lineTo(152, -78);
  brush.lineTo(128, -68);
  brush.closePath();
  brush.fill();
  wheel(0, -70, 70, false);                        // the near wheel
  brush.restore();
}

// ---------- The farmstead, two tung, and the red truck (2026-10-16) ----------
// From the NotebookLM notebook "Lanna material culture" and the photographs
// named with each (Wikimedia Commons, free licences; nothing copied):
//   sawian     the great basket the north keeps its rice in: bamboo woven
//              into a tall round basket and coated with cow dung and resin,
//              so the rice keeps for a long time, dry and free of insects
//              (the CMU Lanna Traditional House Museum, on its granary).
//   longKhao   the granary of a Lanna farm (หลองข้าว): a small house of
//              timber on six posts, its floor raised high off the damp and
//              the animals, under a steep roof of its own. The museum's,
//              built in 2009 on the Mae Kai model, has no wall: the rice is
//              in sawian on its floor. With "walls", it has walls of boards,
//              as a granary photographed by มะเดื่อ แสลงหลวง (CC BY 3.0,
//              File:ยุ้งข้าว - panoramio.jpg) does. Its ladder is not in the
//              sources: a ladder of bamboo stands against it, as one can be
//              taken away from a granary.
//   tungSaiMu  the cluster tung of Songkran, planted on the sand pagodas:
//              tiers of small triangular flags on one stick, five or seven
//              tiers, every colour (Chang Puak Magazine, "Lanna Tung", April
//              2026). No free photograph was found.
//   tungYai    the web tung: threads of cotton woven like a spider's web,
//              tied over strips of bamboo that give it its shape, with
//              frills and flowers (Tamarind Village, on Lanna tung). Hung
//              from a pole as the kit's tung() is. No free photograph was
//              found.
//   rotDaeng   the rot daeng, Chiang Mai's red truck: a pickup with a roof
//              over its bed, two benches along the sides facing each other,
//              a step at the back that people stand on holding the rails,
//              roll-down curtains (Wikipedia, "Songthaew"); the roof runs on
//              over the cab and rises at the front in a peak, a rack on top,
//              windows along the side over a red panel, as the red cars of
//              Chiang Mai photographed by Patiparn.Nice2002bkk show (CC BY-SA
//              4.0, File:Red Car Chiang Mai (1).jpg and (2).jpg). Its wheels
//              turn with "turn" (radians: the ground covered divided by the
//              wheel's radius, 46 x size), and its body rides on its springs
//              as they turn. "inside", a function, is called after the inside
//              is painted and before the near side, with the points where
//              people sit on the far bench, so a film can seat people there
//              (person() with floor "cross" and size 0.66 x the truck's,
//              twist 1 to face us): the side hides their legs.
PIECES_KIT.push("sawian", "longKhao", "tungSaiMu", "tungYai", "rotDaeng");

// brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out. Returns nothing:
// it draws with brush, and leaves brush as it found it.
// e.g. sawian(pen, 300, 920, 1.2);
function sawian(brush, x, base, size) {          // standing on (x, base): 64 wide, 76 tall at size 1
  var s = size || 1;
  function outline() {                             // a path is not kept by save(): made again for the line
    brush.beginPath();
    brush.moveTo(-30, -2);
    brush.quadraticCurveTo(-34, -40, -30, -72);
    brush.ellipse(0, -72, 30, 7, 0, Math.PI, 0);
    brush.quadraticCurveTo(34, -40, 30, -2);
    brush.ellipse(0, -2, 30, 6, 0, 0, Math.PI);
    brush.closePath();
  }
  brush.save();
  brush.translate(x, base);
  brush.scale(s, s);
  outline();
  brush.fillStyle = "#7a6a52";                    // the woven bamboo under its coat of dung and resin
  brush.fill();
  brush.save();
  brush.clip();
  brush.strokeStyle = "rgba(50, 38, 24, 0.35)";   // the weave, a slant each way
  brush.lineWidth = 1.4;
  brush.beginPath();
  for (var k = -110; k < 60; k += 9) {
    brush.moveTo(k, 0);
    brush.lineTo(k + 60, -80);
    brush.moveTo(k + 50, 0);
    brush.lineTo(k - 10, -80);
  }
  brush.stroke();
  brush.fillStyle = "rgba(255, 240, 210, 0.16)";  // a light down one side
  brush.fillRect(-22, -76, 10, 76);
  brush.restore();
  outline();
  brush.strokeStyle = "#3e3020";
  brush.lineWidth = 1.8;
  brush.stroke();
  brush.beginPath();                               // the rim, bound
  brush.ellipse(0, -72, 30, 7, 0, 0, 7);
  brush.fillStyle = "#5a4a36";
  brush.fill();
  brush.stroke();
  brush.restore();
}

// brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out; walls: true for
// walls of boards, else open with two sawian inside. Returns nothing: it draws with brush, and leaves
// brush as it found it.
// e.g. longKhao(pen, 1100, 900, 0.8, true);
function longKhao(brush, x, base, size, walls) { // standing on (x, base): 250 across its eaves, 270 to its ridge at size 1
  var s = size || 1, n;
  brush.save();
  brush.translate(x, base);
  brush.scale(s, s);
  brush.lineJoin = "round";
  brush.fillStyle = "rgba(60, 40, 30, 0.22)";     // its shadow
  brush.beginPath();
  brush.ellipse(0, 0, 120, 10, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "#4e3324";                    // the three posts at the back, set in and darker
  [-74, 4, 82].forEach(function (px) { brush.fillRect(px, -108, 11, 104); });
  var under = brush.createLinearGradient(0, -108, 0, 0);
  under.addColorStop(0, "rgba(30, 20, 14, 0.5)");
  under.addColorStop(1, "rgba(30, 20, 14, 0)");
  brush.fillStyle = under;
  brush.fillRect(-92, -108, 184, 108);
  [-90, -7, 76].forEach(function (px) {           // the three at the front: heavy, a lit side, a stone under each
    brush.fillStyle = "#7a5236";
    brush.fillRect(px, -112, 16, 112);
    brush.fillStyle = "#5a3a26";
    brush.fillRect(px + 10, -112, 6, 112);
    brush.fillStyle = "#8a8478";
    brush.fillRect(px - 4, -7, 24, 7);
  });
  brush.fillStyle = "#6a4630";                    // the beam the floor lies on
  brush.fillRect(-104, -122, 208, 14);
  brush.strokeStyle = "#3e2a1c";
  brush.lineWidth = 1.6;
  brush.strokeRect(-104, -122, 208, 14);
  if (walls) {                                     // walls of boards, leaning out a little toward the eaves
    for (n = 0; n < 10; n++) {
      var b0 = -96 + n * 19.2, b1 = b0 + 19.2;
      brush.beginPath();
      brush.moveTo(b0 * 1.0, -122);
      brush.lineTo(b0 * 1.08, -206);
      brush.lineTo(b1 * 1.08, -206);
      brush.lineTo(b1 * 1.0, -122);
      brush.closePath();
      brush.fillStyle = ["#8e6444", "#86603f", "#93694a", "#8a6242"][n % 4];
      brush.fill();
      brush.strokeStyle = "rgba(60, 32, 18, 0.55)";
      brush.lineWidth = 1.4;
      brush.stroke();
    }
  } else {                                         // no wall: the frame, and the sawian on the floor between its posts
    brush.fillStyle = "rgba(40, 26, 18, 0.55)";
    brush.fillRect(-96, -206, 192, 84);
    sawian(brush, -46, -122, 1.05);
    sawian(brush, 44, -122, 1.0);
    brush.fillStyle = "#6a4630";
    [-100, -6, 88].forEach(function (px) { brush.fillRect(px, -206, 12, 86); });
    brush.fillRect(-104, -170, 208, 6);            // a rail across the open side
  }
  brush.fillStyle = "#5a3c28";                    // the plate under the eaves
  brush.fillRect(-112, -212, 224, 9);
  brush.beginPath();                               // the gable, boarded
  brush.moveTo(-96, -212);
  brush.lineTo(0, -262);
  brush.lineTo(96, -212);
  brush.closePath();
  brush.fillStyle = "#7e5638";
  brush.fill();
  brush.strokeStyle = "rgba(60, 32, 18, 0.5)";
  brush.lineWidth = 1.2;
  brush.beginPath();
  for (n = -80; n <= 80; n += 16) { brush.moveTo(n, -212); brush.lineTo(n, -212 - 50 * (1 - Math.abs(n) / 96)); }
  brush.stroke();
  [-1, 1].forEach(function (side) {               // the two slopes of the roof, thick, of wooden shingles, past the walls
    brush.beginPath();
    brush.moveTo(side * 128, -196);
    brush.lineTo(0, -272);
    brush.lineTo(side * 4, -258);
    brush.lineTo(side * 114, -190);
    brush.closePath();
    brush.fillStyle = "#4a3426";
    brush.fill();
    brush.strokeStyle = "#2e2018";
    brush.lineWidth = 1.6;
    brush.stroke();
    brush.strokeStyle = "rgba(160, 120, 80, 0.35)";
    brush.lineWidth = 1.2;
    brush.beginPath();
    for (var k = 1; k < 7; k++) {                  // rows of shingles down the slope
      var u = k / 7;
      brush.moveTo(side * mix(4, 121, u), mix(-264, -193, u));
      brush.lineTo(side * mix(0, 128, u) + side * 2, mix(-272, -196, u) + 4);
    }
    brush.stroke();
  });
  brush.strokeStyle = "#9a7a4a";                  // a ladder of bamboo against it, to the floor
  brush.lineWidth = 4;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(112, 0);
  brush.lineTo(92, -128);
  brush.moveTo(136, 0);
  brush.lineTo(116, -128);
  for (n = 1; n < 6; n++) {
    var ry = -n * 22;
    brush.moveTo(112 - n * 3.4, ry);
    brush.lineTo(136 - n * 3.4, ry);
  }
  brush.stroke();
  brush.restore();
}

// The cluster tung, planted at (x, base): a stick 170 tall at size 1, "tiers"
// (5 or 7) of small triangular flags on its upper part, widest at the
// bottom; every flag flutters with t.
// brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when left out; t: seconds, or left
// out for still flags; seed: a whole number (0); tiers: how many rows, 2 or more (7). Returns nothing:
// it draws with brush, and leaves brush as it found it.
// e.g. tungSaiMu(pen, 700, 860, 1.3, t, 2, 5);
function tungSaiMu(brush, x, base, size, t, seed, tiers) {
  var s = size || 1, rows = tiers || 7, colours = ["#d8423a", "#f4c542", "#3f8f7a", "#2d5da6", "#e98aa8", "#f08a2a", "#f2ead8"];
  brush.save();
  brush.translate(x, base);
  brush.scale(s, s);
  brush.strokeStyle = "#a88a5a";
  brush.lineWidth = 2.4;
  brush.beginPath();
  brush.moveTo(0, 0);
  brush.lineTo(0, -172);
  brush.stroke();
  for (var r = 0; r < rows; r++) {
    var y = -164 + r * (96 / (rows - 1)), wide = 10 + r * (34 / (rows - 1)), count = 3 + Math.round(r * 4 / (rows - 1));
    brush.strokeStyle = "rgba(90, 70, 40, 0.6)";  // the thread the tier hangs on
    brush.lineWidth = 0.8;
    brush.beginPath();
    brush.moveTo(-wide, y);
    brush.lineTo(wide, y);
    brush.stroke();
    for (var k = 0; k < count; k++) {
      var fx = -wide + (k + 0.5) * (2 * wide / count), half = wide / count * 0.95;
      var flap = t === undefined ? 0 : 2.6 * Math.sin(t * 4 + r * 0.9 + k * 1.7 + (seed || 0) * 2.3);
      brush.beginPath();
      brush.moveTo(fx - half, y);
      brush.lineTo(fx + half, y);
      brush.lineTo(fx + flap, y + half * 1.9);
      brush.closePath();
      brush.fillStyle = colours[(r * 3 + k + (seed || 0)) % colours.length];
      brush.fill();
      brush.strokeStyle = "rgba(60, 40, 20, 0.45)";
      brush.lineWidth = 0.7;
      brush.stroke();
    }
  }
  brush.restore();
}

// The web tung, on a pole planted at (x, base) as the kit's tung() is: the
// pole 470 tall at size 1, the tung hanging from its top, five cells of
// woven thread between six strips of bamboo, a frill and a flower at each
// strip's ends; it sways in the breeze with t, more toward its foot.
// brush: a canvas 2D context; x, base: the pole's foot, pixels of the sheet; size: 1 when left out;
// t: seconds, or left out for a still tung; colour: the thread's CSS colour ("#c8402e"). Returns
// nothing: it draws with brush, and leaves brush as it found it.
// e.g. tungYai(pen, 300, 940, 0.8, t, "#f2ead8");
function tungYai(brush, x, base, size, t, colour) {   // "colour": the thread's (red unless given; white shows at night)
  var s = size || 1, thread = colour || "#c8402e", cells = 5, CELL = 52, HALF = 26;
  brush.save();
  brush.translate(x, base);
  brush.scale(s, s);
  brush.strokeStyle = "#8a6a4a";                  // the pole, bending over at the top
  brush.lineWidth = 7;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(0, 0);
  brush.quadraticCurveTo(10, -300, 70, -470);
  brush.stroke();
  function sway(v) { return t === undefined ? 0 : (6 * Math.sin(t * 1.6 - v * 1.2) + 2 * Math.sin(t * 3.1 + v)) * v; }
  var strips = [];
  for (var k = 0; k <= cells; k++) {
    var v = k / cells;
    strips.push([70 + sway(v), -462 + k * CELL]);
  }
  brush.strokeStyle = thread;                     // the threads of each cell, woven to its middle as a web
  brush.lineWidth = 1.1;
  for (k = 0; k < cells; k++) {
    var a = strips[k], b = strips[k + 1], cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
    var corners = [[a[0] - HALF, a[1]], [a[0] + HALF, a[1]], [b[0] + HALF, b[1]], [b[0] - HALF, b[1]]];
    brush.beginPath();
    corners.forEach(function (c) { brush.moveTo(c[0], c[1]); brush.lineTo(cx, cy); });   // the spokes, corner to middle
    brush.moveTo(a[0], a[1]); brush.lineTo(b[0], b[1]);
    brush.moveTo(a[0] - HALF, cy); brush.lineTo(a[0] + HALF, cy);
    for (var ring = 1; ring <= 3; ring++) {        // the rings of the web, a diamond each, closer to the middle
      var q = ring / 4;
      brush.moveTo(mix(cx, a[0], q), mix(cy, a[1], q));
      brush.lineTo(mix(cx, corners[1][0], q), mix(cy, cy, q) + 0 * q);
      brush.lineTo(mix(cx, b[0], q), mix(cy, b[1], q));
      brush.lineTo(mix(cx, corners[0][0], q), cy);
      brush.closePath();
    }
    brush.stroke();
  }
  brush.strokeStyle = "#c8a060";                  // the strips of bamboo across it
  brush.lineWidth = 3.4;
  brush.beginPath();
  strips.forEach(function (p) { brush.moveTo(p[0] - HALF - 4, p[1]); brush.lineTo(p[0] + HALF + 4, p[1]); });
  brush.stroke();
  strips.forEach(function (p, i) {                // a frill of paper at each end, and a flower
    [-1, 1].forEach(function (side) {
      var fx = p[0] + side * (HALF + 5);
      brush.fillStyle = i % 2 ? "#d8423a" : "#f4c542";
      brush.beginPath();
      brush.moveTo(fx - 4, p[1]);
      brush.lineTo(fx + 4, p[1]);
      brush.lineTo(fx + side * 3, p[1] + 14);
      brush.closePath();
      brush.fill();
      brush.fillStyle = "#e98aa8";
      brush.beginPath();
      brush.arc(fx, p[1] - 1, 3.4, 0, 7);
      brush.fill();
    });
  });
  var foot = strips[cells];                        // a tassel of thread from its foot
  brush.strokeStyle = thread;
  brush.lineWidth = 1.2;
  brush.beginPath();
  for (k = -3; k <= 3; k++) {
    brush.moveTo(foot[0] + k * 3, foot[1]);
    brush.lineTo(foot[0] + k * 4 + sway(1.2) - sway(1), foot[1] + 34);
  }
  brush.stroke();
  brush.restore();
}

// The red truck, its middle over (x, base): 650 long, 344 to its peak at size
// 1; facing 1 drives to the right. "turn" rolls the wheels; "inside" is
// called with the far bench's seats (see above). Draw it on "pen" to seat
// people: a set painted once has nobody in it.
//   brush    a canvas 2D context (pen, to seat people); x, base: pixels of the sheet; size: 1 when left out
//   turn     the wheels' turn, radians (0: still, and the body does not ride)
//   facing   1 (the default) or -1
//   inside   optional: a function (seats), seats a list of 4 [x, y], pixels of the sheet, called with
//            brush back in the caller's frame
// Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. rotDaeng(pen, 720, 960, 1, t * 200 / 46, 1, function (seats) { person(seats[0][0], seats[0][1], cast("boy", {floor: "cross", size: 0.66, twist: 1})); });
function rotDaeng(brush, x, base, size, turn, facing, inside) {
  var s = size || 1, f = facing || 1, spin = turn || 0, R = 46;
  var red = "#c8262a", dark = "#8e1a1e", trim = "#e8e2d6";
  var ride = spin ? 2.2 * Math.sin(spin * 1.3) + 1.2 * Math.sin(spin * 2.9 + 1) : 0;   // the body on its springs, over the road
  function wheel(cx) {
    brush.save();
    brush.translate(cx, -R);
    brush.rotate(spin);
    brush.fillStyle = "#262626";
    brush.beginPath();
    brush.arc(0, 0, R, 0, 7);
    brush.fill();
    brush.fillStyle = "#c8ccd0";                   // the hubcap, and its nuts
    brush.beginPath();
    brush.arc(0, 0, 25, 0, 7);
    brush.fill();
    brush.fillStyle = "#8a9096";
    for (var k = 0; k < 5; k++) {
      brush.beginPath();
      brush.arc(13 * Math.cos(k * 1.2566), 13 * Math.sin(k * 1.2566), 3, 0, 7);
      brush.fill();
    }
    brush.strokeStyle = "#e6e8ea";
    brush.lineWidth = 2;
    brush.beginPath();
    brush.arc(0, 0, 21, 0.4, 1.6);
    brush.stroke();
    brush.restore();
  }
  function outline(path, fill, line) {
    path();
    brush.fillStyle = fill;
    brush.fill();
    brush.strokeStyle = line || "#4a1012";
    brush.lineWidth = 2;
    brush.lineJoin = "round";
    brush.stroke();
  }
  brush.save();
  brush.translate(x, base);
  brush.scale(s * f, s);
  brush.fillStyle = "rgba(40, 30, 25, 0.25)";      // its shadow on the road
  brush.beginPath();
  brush.ellipse(0, 0, 330, 12, 0, 0, 7);
  brush.fill();
  brush.save();
  brush.translate(0, ride);
  outline(function () {                             // the inside, seen through the windows: the far wall and its bench
    brush.beginPath();
    brush.rect(-300, -304, 404, 144);
  }, "#5a2420");
  brush.fillStyle = "#7a3a2a";
  brush.fillRect(-296, -128, 396, 14);              // the far bench
  var seats = [];
  for (var k = 0; k < 4; k++) {
    var sx = -250 + k * 92;
    seats.push([x + sx * s * f, base + (ride - 118) * s]);
  }
  brush.restore();
  if (inside) {                                     // the people, drawn in the caller's own frame, as the seats are given
    brush.restore();
    inside(seats);
    brush.save();
    brush.translate(x, base);
    brush.scale(s * f, s);
  }
  brush.save();
  brush.translate(0, ride);
  outline(function () {                             // the bed's side under the windows, and the cab, in one red
    brush.beginPath();
    brush.moveTo(-306, -70);
    brush.lineTo(-306, -176);
    brush.lineTo(110, -176);
    brush.lineTo(116, -244);
    brush.quadraticCurveTo(126, -256, 150, -256);
    brush.lineTo(196, -256);
    brush.quadraticCurveTo(214, -254, 228, -186);
    brush.quadraticCurveTo(290, -180, 304, -158);
    brush.lineTo(312, -104);
    brush.lineTo(312, -70);
    brush.lineTo(238, -70);
    brush.arc(190, -70, 48, 0, Math.PI, true);      // the front wheel's arch
    brush.lineTo(-122, -70);
    brush.arc(-170, -70, 48, 0, Math.PI, true);     // the back wheel's arch
    brush.closePath();
  }, red);
  brush.fillStyle = dark;                           // a shade along the bottom of the side
  brush.fillRect(-306, -92, 92, 22);
  brush.fillRect(-122, -92, 264, 22);
  brush.fillStyle = trim;                           // a pale line along the side
  brush.fillRect(-306, -150, 416, 5);
  outline(function () {                             // the cab's window
    brush.beginPath();
    brush.moveTo(128, -176);
    brush.lineTo(132, -236);
    brush.quadraticCurveTo(136, -244, 150, -244);
    brush.lineTo(192, -244);
    brush.quadraticCurveTo(204, -242, 214, -190);
    brush.lineTo(214, -176);
    brush.closePath();
  }, "#9ec4d4", "#3a2a2a");
  brush.fillStyle = "rgba(255, 255, 255, 0.35)";    // a gleam on the glass
  brush.beginPath();
  brush.moveTo(150, -238);
  brush.lineTo(166, -238);
  brush.lineTo(150, -190);
  brush.lineTo(138, -190);
  brush.closePath();
  brush.fill();
  outline(function () { brush.beginPath(); brush.rect(170, -150, 22, 6); }, "#3a2a2a");   // the door's handle
  outline(function () { brush.beginPath(); brush.arc(296, -134, 13, 0, 7); }, "#fff2c0", "#5a4a2a");   // the headlamp
  outline(function () { brush.beginPath(); brush.rect(298, -98, 22, 18); }, "#c8ccd0", "#4a4a4a");    // the bumper
  outline(function () { brush.beginPath(); brush.rect(-312, -104, 10, 34); }, "#f4c542", "#6a5a2a");  // the plate at the back
  brush.strokeStyle = "#3a1012";                    // the posts that hold up the roof, and a rail along the windows
  brush.lineWidth = 7;
  brush.beginPath();
  [-302, -206, -114, -22, 70, 106].forEach(function (px) { brush.moveTo(px, -176); brush.lineTo(px, -302); });
  brush.stroke();
  brush.strokeStyle = "#d8d4c8";
  brush.lineWidth = 3;
  brush.beginPath();
  brush.moveTo(-300, -232);
  brush.lineTo(106, -232);
  brush.stroke();
  outline(function () {                             // the roof over the bed, on over the cab down to its roof, its front raised in a peak
    brush.beginPath();
    brush.moveTo(-312, -300);
    brush.lineTo(-312, -324);
    brush.lineTo(150, -324);
    brush.quadraticCurveTo(212, -326, 238, -344);
    brush.lineTo(248, -328);
    brush.quadraticCurveTo(240, -294, 220, -262);
    brush.lineTo(112, -262);
    brush.lineTo(106, -300);
    brush.closePath();
  }, red);
  brush.fillStyle = dark;
  brush.fillRect(-312, -306, 418, 6);
  brush.fillStyle = "#3a2a2a";                      // a grille across the peak's face, as the red cars have
  brush.fillRect(150, -318, 70, 7);
  brush.strokeStyle = "#5a5a5a";                    // the rack on the roof
  brush.lineWidth = 2.5;
  brush.beginPath();
  brush.moveTo(-290, -338);
  brush.lineTo(120, -338);
  for (k = 0; k < 7; k++) { brush.moveTo(-290 + k * 68, -338); brush.lineTo(-290 + k * 68, -324); }
  brush.stroke();
  brush.fillStyle = "#6a6a6a";                      // the step at the back, and its rail
  brush.fillRect(-340, -74, 36, 6);
  brush.strokeStyle = "#c8ccd0";
  brush.lineWidth = 4;
  brush.beginPath();
  brush.moveTo(-318, -170);
  brush.lineTo(-318, -296);
  brush.stroke();
  brush.restore();
  wheel(-170);
  wheel(190);
  brush.restore();
}

// A tub (ตูบ): the small hut of a poor family of the north, standing on (x, base). Four short stilts and a
// floor of beams; walls of woven bamboo (fa khat tae), a plain weave of pale and darker strips across; a
// doorway at the right, dark inside, with a short ladder of bamboo down from it; a steep roof of grass
// thatch, its eaves ragged with straw. 250 wide and 225 high at size 1.
// look: glow, 0 to 1: a lamp's light in the doorway and on the ground before it, at night; tint, [colour,
// amount]: every colour blended toward one light, as caveMouth()'s.
// brush: a canvas 2D context; x, base: pixels of the sheet; size: needed (1 is 250 wide); look:
// optional, glow and tint as above. Returns nothing: it draws with brush (the lamp's pool of light
// on the ground too, when glow is over 0.01), and leaves its fill and line set.
// e.g. tub(pen, 900, 900, 1.2, {glow: 0.8, tint: ["#2a3a6a", 0.35]});
function tub(brush, x, base, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var wood = tone("#7a5234"), bamboo = tone("#d2b67c"), strip = tone("#a98a52"), straw = tone("#c9a75e"), dry = tone("#8f6c35");
  var line = 2.2 / Math.max(0.6, size), glow = look.glow || 0, n, k;
  function fillInk(colour) {
    brush.fillStyle = colour;
    brush.fill();
    brush.strokeStyle = inkFor(/^#[0-9a-f]{6}$/i.test(colour) ? colour : "#7a5234");
    brush.lineWidth = line;
    brush.lineJoin = "round";
    brush.stroke();
  }
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.fillStyle = "rgba(60, 40, 30, 0.2)";        // its shadow
  brush.beginPath();
  brush.ellipse(4, 2, 135, 12, 0, 0, 7);
  brush.fill();
  [-96, -46, 46, 96].forEach(function (px) {        // the stilts
    brush.beginPath();
    brush.rect(px - 5, -46, 10, 46);
    fillInk(wood);
  });
  brush.beginPath();                                // the floor's beam
  brush.rect(-108, -54, 216, 10);
  fillInk(wood);
  brush.beginPath();                                // the walls of woven bamboo
  brush.rect(-100, -138, 200, 84);
  fillInk(bamboo);
  brush.save();
  brush.beginPath();
  brush.rect(-100, -138, 200, 84);
  brush.clip();
  brush.strokeStyle = strip;
  brush.lineWidth = 3.2;
  for (k = -300; k < 300; k += 14) {                // the weave: strips one way, and the other, over and under
    brush.beginPath();
    brush.moveTo(k, -138);
    brush.lineTo(k + 84, -54);
    brush.stroke();
  }
  brush.strokeStyle = blend(strip, bamboo, 0.45);
  for (k = -300; k < 300; k += 14) {
    brush.beginPath();
    brush.moveTo(k + 84, -138);
    brush.lineTo(k, -54);
    brush.stroke();
  }
  brush.restore();
  brush.beginPath();                                // the doorway
  brush.rect(22, -126, 44, 72);
  if (glow > 0.01) {
    var lit = brush.createRadialGradient(44, -66, 4, 44, -80, 60);
    lit.addColorStop(0, "rgba(255, 196, 110, " + (0.95 * glow).toFixed(3) + ")");
    lit.addColorStop(1, "rgba(120, 60, 20, " + (0.6 * glow).toFixed(3) + ")");
    brush.fillStyle = "#24170f";
    brush.fill();
    brush.fillStyle = lit;
  } else {
    brush.fillStyle = "#24170f";
  }
  brush.fill();
  brush.strokeStyle = inkFor(wood);
  brush.lineWidth = line;
  brush.stroke();
  brush.strokeStyle = tone("#9a8150");              // the ladder: two poles and three rungs
  brush.lineWidth = 4;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(30, -54); brush.lineTo(38, 0);
  brush.moveTo(58, -54); brush.lineTo(66, 0);
  for (n = 1; n <= 3; n++) { brush.moveTo(30 + 2 * n, -54 + 14 * n); brush.lineTo(58 + 2 * n, -54 + 14 * n); }
  brush.stroke();
  brush.beginPath();                                // the roof of thatch: steep, the eaves wide
  brush.moveTo(-132, -126);
  brush.lineTo(-30, -222);
  brush.lineTo(30, -222);
  brush.lineTo(132, -126);
  brush.closePath();
  fillInk(straw);
  brush.save();
  brush.clip();
  brush.strokeStyle = dry;                          // rows of straw, one over another
  brush.lineWidth = 1.6;
  for (k = 0; k < 6; k++) {
    var rowY = -214 + k * 16;
    for (n = -140; n < 140; n += 7) {
      brush.beginPath();
      brush.moveTo(n, rowY);
      brush.lineTo(n + 2, rowY + 13);
      brush.stroke();
    }
  }
  brush.restore();
  brush.fillStyle = straw;                          // the ragged eaves: straw hanging below the roof's edge
  brush.strokeStyle = inkFor(straw);
  brush.lineWidth = line * 0.7;
  brush.beginPath();
  brush.moveTo(-132, -126);
  for (n = 0; n <= 24; n++) {
    var ex = -132 + n * 11;
    brush.lineTo(ex + 4, -126 + 6 + 4 * dice(n + 7));
    brush.lineTo(ex + 11, -126);
  }
  brush.closePath();
  brush.fill();
  brush.stroke();
  brush.restore();
  if (glow > 0.01) {                                // the lamp's light on the ground before the door
    var pool = brush.createRadialGradient(x + 48 * size, base, 4, x + 48 * size, base, 120 * size);
    pool.addColorStop(0, "rgba(255, 190, 100, " + (0.35 * glow).toFixed(3) + ")");
    pool.addColorStop(1, "rgba(255, 190, 100, 0)");
    brush.fillStyle = pool;
    brush.fillRect(x - 80 * size, base - 120 * size, 260 * size, 160 * size);
  }
}

// A bundle of firewood, its middle at (x, y): "count" sticks (7 unless told) 120 long at size 1, their cut ends
// pale, bound round in two places with a vine; look.turn turns it (radians, 0 lying along x); look.loose: the
// sticks lie apart on the ground, not yet bound; look.tint as the hut's.
// brush: a canvas 2D context; x, y: its middle, pixels of the sheet; size: needed (1 is 120 long);
// look: optional, count (7), turn (radians, 0), loose (true or false), tint. Returns nothing: it
// draws with brush, and leaves brush as it found it.
// e.g. firewood(pen, 400, 930, 1, {turn: 0.2});
function firewood(brush, x, y, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var count = look.count || 7, bark = tone("#7d5a3a"), cut = tone("#dcbf8e"), vine = tone("#5d6a2e"), n;
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  brush.rotate(look.turn || 0);
  for (n = 0; n < count; n++) {                     // the sticks: one a little longer, one a little bent, as wood is
    var lift = look.loose ? 0 : (n - (count - 1) / 2) * 5.5, slide = look.loose ? (n - (count - 1) / 2) * 16 : 0;
    var long = 112 + 16 * dice(n * 3 + 1), turn = look.loose ? (dice(n * 5 + 2) - 0.5) * 0.9 : (dice(n * 5 + 2) - 0.5) * 0.06;
    brush.save();
    brush.translate(slide, lift + (look.loose ? 6 * dice(n + 9) : 0));
    brush.rotate(turn);
    brush.beginPath();
    brush.moveTo(-long / 2, -2.6);
    brush.quadraticCurveTo(0, -3.6 + 2 * dice(n + 4), long / 2, -2.4);
    brush.lineTo(long / 2, 2.4);
    brush.quadraticCurveTo(0, 3.2, -long / 2, 2.6);
    brush.closePath();
    brush.fillStyle = blend(bark, "#3a2a1a", 0.25 * dice(n + 6));
    brush.fill();
    brush.strokeStyle = inkFor(bark);
    brush.lineWidth = 1.2;
    brush.stroke();
    brush.beginPath();                              // the cut ends
    brush.ellipse(long / 2, 0, 1.6, 2.6, 0, 0, 7);
    brush.ellipse(-long / 2, 0, 1.6, 2.6, 0, 0, 7);
    brush.fillStyle = cut;
    brush.fill();
    brush.restore();
  }
  if (!look.loose) {                                // the vine bound round it in two places
    var half = (count - 1) / 2 * 5.5 + 4;
    [-28, 30].forEach(function (bx) {
      brush.beginPath();
      brush.rect(bx - 3, -half, 6, half * 2);
      brush.fillStyle = vine;
      brush.fill();
      brush.strokeStyle = inkFor(vine);
      brush.lineWidth = 1;
      brush.stroke();
    });
  }
  brush.restore();
}

// ---------- pieces for a tale: the creature with four ears and five eyes ----------
// Things of the tale of Maeng Si Hu Ha Ta (the film in maeng/), each a painter on a brush as the others are: kok, a
// pen of bamboo for an animal, in two parts so that what is kept in it stands inside; snare, a noose of rope on a
// bent sapling, set or sprung; campfire, a yard's fire in a ring of stones, its flames moving with t, and ember and
// emberFlight, a coal and a coal flying on an arc (thrown to a creature that eats them); goldNugget, a nugget of
// gold that glints; hoKham, a hall of a Lanna palace (ho kham), open at the front, in two parts so that whoever
// sits in it is inside; gong, a gong on its stand that swings and rings when struck; linKham, a trough of gold on
// forked posts along a row of points on the ground, drawn as far as it is built.
PIECES_KIT.push("tub", "firewood", "kok", "snare", "campfire", "ember", "emberFlight", "goldNugget", "hoKham", "gong", "linKham");

// A pen (คอก) of bamboo for an animal, its front's middle on (x, base), "wide" across and two-thirds as deep:
// posts at its corners and along its sides, two rails of split bamboo round it, bound at each post. A pen is
// drawn in two parts, so that what is kept in it stands inside: look.part "back" (the far fence, before the
// animal) and "front" (the near fence, after it). 110 high at size 1. look.tint as the hut's.
// brush: a canvas 2D context; x, base: the front's middle, pixels of the sheet; wide: pixels of the
// sheet (not scaled by size); size: the posts' and the rails' scale (1 is 110 high); look: part
// ("back" when left out, or "front"), tint. Returns nothing: it draws with brush, and leaves its
// fill and line set.
// e.g. kok(pen, 700, 930, 380, 1, {part: "back"}); pig(700, 900, {}); kok(pen, 700, 930, 380, 1, {part: "front"});
function kok(brush, x, base, wide, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var cane = tone("#b49a5e"), dark = tone("#7e6a3e"), tie = tone("#5d6a2e"), front = look.part === "front";
  var deep = wide * 0.22, rise = 110 * size, half = wide / 2, n;
  var yBack = base - deep, posts = Math.max(3, Math.round(wide / (70 * size)));
  function fence(y, slant) {                        // one side: its posts, then two rails across them, bound
    for (n = 0; n <= posts; n++) {
      var px = x - half + n * wide / posts + slant * n / posts;
      brush.fillStyle = n % 2 ? cane : dark;
      brush.fillRect(px - 4 * size, y - rise, 8 * size, rise);
      brush.strokeStyle = inkFor(cane);
      brush.lineWidth = 1.4;
      brush.strokeRect(px - 4 * size, y - rise, 8 * size, rise);
    }
    [0.32, 0.72].forEach(function (u) {
      brush.fillStyle = cane;
      brush.fillRect(x - half - 6, y - rise * u - 4 * size, wide + 12, 8 * size);
      brush.strokeStyle = inkFor(cane);
      brush.strokeRect(x - half - 6, y - rise * u - 4 * size, wide + 12, 8 * size);
      for (n = 0; n <= posts; n++) {
        brush.fillStyle = tie;
        brush.fillRect(x - half + n * wide / posts - 5 * size, y - rise * u - 5 * size, 10 * size, 10 * size);
      }
    });
  }
  if (!front) {
    fence(yBack, 0);                                // the far side
    brush.fillStyle = "rgba(90, 70, 40, 0.25)";     // the trodden ground inside
    brush.beginPath();
    brush.ellipse(x, base - deep / 2, half, deep / 2 + 6, 0, 0, 7);
    brush.fill();
  } else {
    fence(base, 0);                                 // the near side
  }
}

// A snare (แร้ว) as the north set one for a small animal, its foot's middle on (x, base): a pole of bamboo
// pushed into the ground and bent over, held down by a cord to a trigger peg; from the pole's tip a noose of
// rattan lies open on the ground under it. look.sprung (0 to 1): the trigger let go, the pole flies up
// straight and the noose with it, closed; look.caught: a point of the scene (a foot, a paw) the noose holds,
// so that it closes round it there instead of in the air; look.t stirs the cord; look.tint as the hut's.
// Stout, and drawn 1.3 times its size (owner, 2026-10-20: "Increase the size of the snare and make it look a little
// stronger"; of the snare as it was and this, "Stout, 1.3x larger"): a thick pole, a cord of twisted rattan, a
// thick noose, a trigger of a hooked peg and a crossbar under the hook, and a stake at the pole's root, lashed to it.
// About 210 wide and 260 high at size 1.
// brush: a canvas 2D context; x, base: pixels of the sheet; size: needed (drawn 1.3 times it); look:
// optional, sprung (0 to 1), caught ([x, y], pixels of the sheet), t (seconds), tint. Returns nothing:
// it draws with brush, and leaves brush as it found it.
// e.g. snare(pen, 900, 940, 0.8, {sprung: between(t, 4, 4.4), t: t});
function snare(brush, x, base, size, look) {
  look = look || {};
  size *= 1.3;
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var sprung = clamp(look.sprung || 0), cane = tone("#a8883e"), rattan = tone("#7a5a2e"), peg = tone("#6a4a2a");
  var ease = sprung * sprung * (3 - 2 * sprung), n;
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  var root = [-70, 0];
  // The pole: from its root at the left, bent over to the right and down (set), or straight up and swaying (sprung).
  var tipSet = [62, -36], tipSprung = [-48, -196 - 6 * Math.sin((look.t || 0) * 9) * (1 - ease) * ease * 4];
  var tip = [mix(tipSet[0], tipSprung[0], ease), mix(tipSet[1], tipSprung[1], ease)];
  var bow = [mix(-40, -76, ease), mix(-150, -110, ease)];
  brush.strokeStyle = inkFor(cane);
  brush.lineWidth = 13.5;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(root[0], root[1]);
  brush.quadraticCurveTo(bow[0], bow[1], tip[0], tip[1]);
  brush.stroke();
  brush.strokeStyle = cane;
  brush.lineWidth = 10.5;
  brush.stroke();
  {                                                 // the stake at the root, and the lashing that holds the pole to it
    brush.fillStyle = peg;
    brush.strokeStyle = inkFor(peg);
    brush.lineWidth = 1.6;
    brush.beginPath();
    brush.moveTo(-82, 4); brush.lineTo(-78, -46); brush.lineTo(-71, -50); brush.lineTo(-68, 4);
    brush.closePath(); brush.fill(); brush.stroke();
    brush.strokeStyle = rattan;
    brush.lineWidth = 2.6;
    for (n = 0; n < 3; n++) { brush.beginPath(); brush.moveTo(-82, -12 - n * 9); brush.lineTo(-64, -8 - n * 9); brush.stroke(); }
  }
  brush.strokeStyle = blend(cane, "#3a2a1a", 0.3);   // its joints
  brush.lineWidth = 7;
  [0.35, 0.68].forEach(function (u) {
    var v = 1 - u, jx = v * v * root[0] + 2 * v * u * bow[0] + u * u * tip[0], jy = v * v * root[1] + 2 * v * u * bow[1] + u * u * tip[1];
    brush.beginPath();
    brush.arc(jx, jy, 1.2, 0, 7);
    brush.stroke();
  });
  if (sprung < 0.05) {                              // a stout trigger: a hooked peg, and a crossbar caught under its hook
    brush.fillStyle = peg;
    brush.strokeStyle = inkFor(peg);
    brush.lineWidth = 1.6;
    brush.beginPath();
    brush.moveTo(56, 4); brush.lineTo(57, -26); brush.lineTo(68, -26); brush.lineTo(68, -21); brush.lineTo(62, -21); brush.lineTo(63, 4);
    brush.closePath(); brush.fill(); brush.stroke();
    brush.beginPath();                              // the crossbar
    brush.moveTo(40, -20); brush.lineTo(74, -17); brush.lineTo(74, -13); brush.lineTo(40, -16);
    brush.closePath(); brush.fill(); brush.stroke();
  }
  if (sprung < 0.05) {                              // set: the trigger peg in the ground, the cord from the tip down to it
    brush.fillStyle = peg;
    brush.strokeStyle = rattan;
    brush.lineWidth = 4.2;
    brush.beginPath();
    brush.moveTo(tip[0], tip[1]);
    brush.lineTo(61, -14);
    brush.stroke();
  }
  var loop, hold = look.caught ? [(look.caught[0] - x) / size, (look.caught[1] - base) / size] : null;
  if (sprung < 0.05) { loop = {x: 34, y: -2, rx: 30, ry: 7}; }              // the noose open on the ground under the tip
  else if (hold) { loop = {x: hold[0], y: hold[1], rx: 9, ry: 5}; }        // closed round what it caught
  else { loop = {x: tip[0] + 4, y: tip[1] + 40, rx: 6, ry: 10}; }          // closed on nothing, hanging from the tip
  brush.strokeStyle = rattan;                       // the line from the tip to the noose, and the noose
  brush.lineWidth = 4.8;
  brush.beginPath();
  brush.moveTo(tip[0], tip[1]);
  brush.quadraticCurveTo(mix(tip[0], loop.x, 0.5) + 6, mix(tip[1], loop.y, 0.5) - 4 * (1 - ease), loop.x, loop.y - loop.ry);
  brush.stroke();
  brush.lineWidth = 5.6;
  brush.beginPath();
  brush.ellipse(loop.x, loop.y, loop.rx, loop.ry, 0, 0, 7);
  brush.stroke();
  {                                                 // the rattan's twist, along the noose
    brush.strokeStyle = blend(rattan, "#e0c080", 0.35);
    brush.lineWidth = 1.2;
    brush.setLineDash([3, 4]);
    brush.stroke();
    brush.setLineDash([]);
  }
  for (n = 0; n < 3; n++) {                         // a few leaves laid over the noose, to hide it
    if (sprung > 0.05) { break; }
    brush.fillStyle = tone(["#6f8f3a", "#8a7a3a", "#5f7f34"][n]);
    brush.beginPath();
    brush.ellipse(18 + n * 16, -3 + (n % 2) * 3, 9, 3.4, 0.3 * (n - 1), 0, 7);
    brush.fill();
  }
  brush.restore();
}

// A campfire on the ground of a yard, its middle on (x, base): a ring of stones, sticks laid crossed and
// charred at their ends, flames that leap and flicker with t (the second), coals glowing red under them, and
// a warm light round it. look.low (0 to 1) burns it down to coals; look.light (0 to 1, 1 unless told) is how
// strong the light round it is. 150 wide and, with its flames, 170 high at size 1.
// brush: a canvas 2D context; x, base: pixels of the sheet; size: needed (1 is 150 wide); t: seconds
// (needed); look: optional, low (0 to 1, 0), light (0 to 1, 1). Returns nothing: it draws with brush,
// and leaves brush as it found it.
// e.g. campfire(pen, 720, 960, 1, t, {low: 0.3});
function campfire(brush, x, base, size, t, look) {
  look = look || {};
  var low = clamp(look.low || 0), light = look.light === undefined ? 1 : look.light, n;
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  if (light > 0.01) {                               // the light it throws, flickering
    var flick = 0.9 + 0.1 * Math.sin(t * 13) * Math.sin(t * 7.3);
    var warm = brush.createRadialGradient(0, -40, 10, 0, -40, 380 * (1 - 0.5 * low) * flick);
    warm.addColorStop(0, "rgba(255, 170, 80, " + (0.42 * light).toFixed(3) + ")");
    warm.addColorStop(1, "rgba(255, 150, 60, 0)");
    brush.fillStyle = warm;
    brush.fillRect(-420, -440, 840, 560);
  }
  [[-62, -2], [-38, 8], [0, 12], [40, 8], [64, -2]].forEach(function (s, k) {   // the stones round it
    brush.beginPath();
    brush.ellipse(s[0], s[1], 17, 10, 0, 0, 7);
    brush.fillStyle = ["#7a7268", "#8a8276", "#6e665c", "#857d71", "#766e63"][k];
    brush.fill();
    brush.strokeStyle = inkFor("#7a7268");
    brush.lineWidth = 1.6;
    brush.stroke();
  });
  [[-46, -4, 40, -22], [44, -6, -38, -24], [-10, 2, 6, -30]].forEach(function (s) {   // the sticks, crossed, charred
    brush.strokeStyle = "#5a3e26";
    brush.lineWidth = 9;
    brush.lineCap = "round";
    brush.beginPath();
    brush.moveTo(s[0], s[1]);
    brush.lineTo(s[2], s[3]);
    brush.stroke();
    brush.strokeStyle = "#2a1c14";
    brush.lineWidth = 9;
    brush.beginPath();
    brush.moveTo(mix(s[0], s[2], 0.6), mix(s[1], s[3], 0.6));
    brush.lineTo(s[2], s[3]);
    brush.stroke();
  });
  for (n = 0; n < 9; n++) {                         // the coals, glowing and dimming
    var cx = -34 + n * 8.5, cy = -10 + 5 * Math.sin(n * 2.7), glow = 0.6 + 0.4 * Math.sin(t * (3 + n % 3) + n);
    brush.fillStyle = "rgba(255, " + Math.round(90 + 90 * glow) + ", 40, 0.95)";
    brush.beginPath();
    brush.ellipse(cx, cy, 5, 3.4, 0, 0, 7);
    brush.fill();
  }
  var tall = (1 - low) * (1 - low);                 // the flames: tongues that leap, flicker and lean
  for (n = 0; n < 5; n++) {
    var h = (90 + 50 * Math.sin(t * (5.1 + n * 0.7) + n * 1.9) * Math.sin(t * 2.3 + n)) * tall * (n === 2 ? 1.25 : 0.8 + 0.06 * n);
    if (h < 4) { continue; }
    var fx = -36 + n * 18, lean = 10 * Math.sin(t * 3.1 + n * 1.3), wide = 15 + 4 * Math.sin(n * 2.2);
    [["#e8502a", 1], ["#f7a43a", 0.68], ["#ffe08a", 0.36]].forEach(function (layer) {
      var hh = h * layer[1], ww = wide * (0.5 + 0.5 * layer[1]);
      brush.beginPath();
      brush.moveTo(fx - ww, -14);
      brush.quadraticCurveTo(fx - ww * 0.9, -14 - hh * 0.55, fx + lean * layer[1], -14 - hh);
      brush.quadraticCurveTo(fx + ww * 0.9, -14 - hh * 0.55, fx + ww, -14);
      brush.closePath();
      brush.fillStyle = layer[0];
      brush.fill();
    });
  }
  brush.restore();
}

// An ember, a coal red-hot, its middle on (x, y): dark red with a bright core and a glow about it, sparks
// leaving it. "t" flickers it. 10 across at size 1.
// brush: a canvas 2D context; x, y: pixels of the sheet; size: needed; t: seconds. Returns nothing:
// it draws with brush, and leaves brush as it found it.
// e.g. ember(pen, 700, 940, 1.2, t);
function ember(brush, x, y, size, t) {
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  var halo = brush.createRadialGradient(0, 0, 2, 0, 0, 24);
  halo.addColorStop(0, "rgba(255, 170, 60, 0.6)");
  halo.addColorStop(1, "rgba(255, 140, 40, 0)");
  brush.fillStyle = halo;
  brush.fillRect(-24, -24, 48, 48);
  brush.beginPath();
  brush.ellipse(0, 0, 6, 5, 0.4, 0, 7);
  brush.fillStyle = "#a8261a";
  brush.fill();
  brush.beginPath();
  brush.ellipse(-0.6, -0.6, 3.6, 2.8, 0.4, 0, 7);
  brush.fillStyle = "rgba(255, " + Math.round(170 + 60 * Math.sin(t * 17)) + ", 70, 1)";
  brush.fill();
  brush.restore();
}

// An ember flying from "from" to "to" (points of the scene) on an arc "high" above the straight line, u of
// the way (0 to 1), with a few sparks trailing behind it.
// brush: a canvas 2D context; from, to: [x, y], pixels of the sheet; u: 0 to 1 (nothing is drawn at 0
// or 1 and outside); size: the ember's; high: pixels the arc rises; t: seconds. Returns nothing: it
// draws with brush, and leaves its fillStyle set.
// e.g. emberFlight(pen, [700, 940], [980, 820], between(t, 5, 6.2), 1, 140, t);
function emberFlight(brush, from, to, u, size, high, t) {
  if (u <= 0 || u >= 1) { return; }
  function at(v) { return [mix(from[0], to[0], v), mix(from[1], to[1], v) - high * 4 * v * (1 - v)]; }
  for (var k = 1; k <= 4; k++) {
    var back = at(Math.max(0, u - k * 0.035));
    brush.fillStyle = "rgba(255, 200, 90, " + (0.6 - k * 0.13).toFixed(2) + ")";
    brush.beginPath();
    brush.arc(back[0], back[1], (3.2 - k * 0.6) * size, 0, 7);
    brush.fill();
  }
  var here = at(u);
  ember(brush, here[0], here[1], size, t);
}

// A nugget of gold, its middle on (x, y): a lump of no shape, gold lit from the upper left with a bright edge,
// and now and then a star of light that twinkles on it (t, the second; look.shine 0 to 1, 1 unless told).
// 16 across at size 1.
// brush: a canvas 2D context; x, y: pixels of the sheet; size: needed; t: seconds; look: optional,
// shine (0 to 1, 1), seed (1). Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. goldNugget(pen, 760, 930, 1.5, t, {seed: 2});
function goldNugget(brush, x, y, size, t, look) {
  look = look || {};
  var shine = look.shine === undefined ? 1 : look.shine, seed = (look.seed || 1) * 1.7;
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  brush.beginPath();                                // the lump: a ring of points pushed in and out
  for (var n = 0; n <= 9; n++) {
    var a = n / 9 * Math.PI * 2, r = 8 * (0.75 + 0.3 * Math.sin(a * 3 + seed) + 0.12 * Math.sin(a * 5 + seed * 2));
    var px = Math.cos(a) * r * 1.15, py = Math.sin(a) * r * 0.8;
    if (n) { brush.lineTo(px, py); } else { brush.moveTo(px, py); }
  }
  brush.closePath();
  var lit = brush.createLinearGradient(-8, -7, 8, 7);
  lit.addColorStop(0, "#fff2a8");
  lit.addColorStop(0.45, "#f0c23a");
  lit.addColorStop(1, "#a8761a");
  brush.fillStyle = lit;
  brush.fill();
  brush.strokeStyle = "#7a5410";
  brush.lineWidth = 1.2;
  brush.stroke();
  var twinkle = shine * Math.max(0, Math.sin(t * 2.6 + seed * 3));   // the star of light, on and off
  if (twinkle > 0.05) {
    brush.translate(-3, -4);
    brush.rotate(t * 0.8);
    brush.fillStyle = "rgba(255, 255, 230, " + twinkle.toFixed(3) + ")";
    brush.beginPath();
    for (var k = 0; k < 8; k++) {
      var rr = k % 2 ? 2 : 11 * twinkle, ang = k / 8 * Math.PI * 2;
      brush.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
    }
    brush.closePath();
    brush.fill();
  }
  brush.restore();
}

// A hall of a Lanna palace (หอคำ, ho kham), open at the front, its plinth's foot's middle on (x, base): a white
// plinth with a stair up its middle; a floor of teak; posts of dark red teak banded with gold; behind, a wall of
// red with gold patterns (lai kham) and a gilded dais against it where a king sits; a roof in two tiers of dark
// wooden shingles, their eaves trimmed with gold, a golden gable with rays, and a golden finial (cho fa) curling
// up at each end of the ridge. Drawn in two parts, so that who sits in it is inside: look.part "back" (the wall,
// the floor, the dais) and "front" (the posts and the roof). 800 wide and 700 high at size 1; the floor is 150 up,
// the dais's top 190 (hoKhamFloor() and hoKhamDais() give where). look.tint as the hut's. look.pediment "peacock":
// a peacock carved in the gable among leaf scrolls, as the Lanna halls' gables have it (the household notebook's
// sources: the pediment of the old Ho Kham at Wat Phan Tao, "a peacock surrounded by foliate ornament").
// hoKhamFloor(base, size) gives back the y, pixels of the sheet, of the hall's floor: base - 150 x size.
// e.g. person(560, hoKhamFloor(980, 0.9), cast("noble"));
function hoKhamFloor(base, size) { return base - 150 * size; }
// hoKhamDais(base, size) gives back the y, pixels of the sheet, of the dais's top: base - 190 x size.
// e.g. person(720, hoKhamDais(980, 0.9), cast("noble", {floor: "cross"}));
function hoKhamDais(base, size) { return base - 190 * size; }

// brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look: part ("back" when left
// out, or "front"), pediment ("peacock" or none), tint. Returns nothing: it draws with brush, and
// leaves brush as it found it.
// e.g. hoKham(pen, 720, 980, 0.9, {part: "back"}); person(720, hoKhamDais(980, 0.9), cast("noble")); hoKham(pen, 720, 980, 0.9, {part: "front"});
function hoKham(brush, x, base, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var teak = tone("#6a2e1e"), red = tone("#9a2a22"), gold = tone("#e0b23a"), shingle = tone("#4a3226"), white = tone("#efe6d4");
  var line = 2.2 / Math.max(0.6, size), n, k;
  function fillInk(colour) {
    brush.fillStyle = colour;
    brush.fill();
    brush.strokeStyle = inkFor(/^#[0-9a-f]{6}$/i.test(colour) ? colour : "#6a2e1e");
    brush.lineWidth = line;
    brush.lineJoin = "round";
    brush.stroke();
  }
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  if (look.part !== "front") {
    brush.beginPath();                              // the plinth, and the stair up its middle
    brush.rect(-380, -150, 760, 150);
    fillInk(white);
    brush.fillStyle = tone("#d8cdb8");
    for (n = 0; n < 6; n++) { brush.fillRect(-90 + n * 4, -150 + n * 25, 180 - n * 8, 25); }
    brush.strokeStyle = inkFor(white);
    brush.lineWidth = 1.2;
    for (n = 0; n < 6; n++) { brush.strokeRect(-90 + n * 4, -150 + n * 25, 180 - n * 8, 25); }
    brush.beginPath();                              // the back wall: red, with gold patterns, under the roof
    brush.rect(-330, -520, 660, 370);
    fillInk(red);
    brush.save();
    brush.clip();
    brush.fillStyle = gold;
    for (k = 0; k < 7; k++) {                       // rows of gold flowers and diamonds, stencilled
      for (n = 0; n < 12; n++) {
        var px = -310 + n * 56 + (k % 2) * 28, py = -500 + k * 52;
        brush.beginPath();
        brush.moveTo(px, py - 10); brush.lineTo(px + 8, py); brush.lineTo(px, py + 10); brush.lineTo(px - 8, py);
        brush.closePath();
        brush.fill();
        brush.beginPath();
        brush.arc(px, py, 3, 0, 7);
        brush.fillStyle = tone("#fff2b0");
        brush.fill();
        brush.fillStyle = gold;
      }
    }
    brush.restore();
    brush.beginPath();                              // the floor of teak
    brush.rect(-370, -160, 740, 12);
    fillInk(tone("#7a4a2a"));
    brush.beginPath();                              // the dais, gilded, against the wall
    brush.rect(-150, -190, 300, 32);
    fillInk(gold);
    brush.fillStyle = tone("#b8862a");
    for (n = 0; n < 10; n++) { brush.fillRect(-140 + n * 30, -180, 14, 14); }
  } else {
    [-300, -170, 170, 300].forEach(function (px) {  // the posts, banded with gold
      brush.beginPath();
      brush.rect(px - 13, -560, 26, 410);
      fillInk(teak);
      brush.fillStyle = gold;
      brush.fillRect(px - 15, -190, 30, 12);
      brush.fillRect(px - 15, -548, 30, 12);
    });
    function tier(wide, low, high, overhang) {      // one tier of the roof: a slope of shingles, gold along its eave
      brush.beginPath();
      brush.moveTo(-wide / 2 - overhang, low);
      brush.lineTo(-wide / 2 + 60, high);
      brush.lineTo(wide / 2 - 60, high);
      brush.lineTo(wide / 2 + overhang, low);
      brush.closePath();
      fillInk(shingle);
      brush.save();
      brush.clip();
      brush.strokeStyle = tone("#6a4a3a");
      brush.lineWidth = 2;
      for (var r = high + 12; r < low; r += 14) {    // rows of shingles
        brush.beginPath();
        for (var s = -wide; s < wide; s += 16) { brush.moveTo(s, r); brush.arc(s + 8, r, 8, Math.PI, 0); }
        brush.stroke();
      }
      brush.restore();
      brush.fillStyle = gold;                       // the eave's gold trim, and the little flames along it
      brush.fillRect(-wide / 2 - overhang, low - 4, wide + 2 * overhang, 9);
      for (var f = -wide / 2 - overhang + 12; f < wide / 2 + overhang; f += 26) {
        brush.beginPath();
        brush.moveTo(f - 5, low + 5); brush.lineTo(f, low + 18); brush.lineTo(f + 5, low + 5);
        brush.fill();
      }
    }
    tier(780, -540, -640, 40);
    tier(560, -630, -720, 24);
    brush.beginPath();                              // the gable over the upper tier, gold with rays
    brush.moveTo(-170, -712); brush.lineTo(0, -800); brush.lineTo(170, -712);
    brush.closePath();
    fillInk(gold);
    brush.strokeStyle = tone("#b8862a");
    brush.lineWidth = 2.4;
    if (look.pediment === "peacock") {              // a peacock carved in the gable, among leaf scrolls
      var relief = tone("#9a6e1a");
      [-1, 1].forEach(function (side) {             // the scrolls, curling out to each side
        brush.strokeStyle = relief;
        brush.lineWidth = 3;
        brush.beginPath();
        brush.moveTo(side * 26, -730);
        brush.bezierCurveTo(side * 60, -722, side * 92, -738, side * 104, -726);
        brush.arc(side * 96, -728, 8, side > 0 ? 0 : Math.PI, side > 0 ? Math.PI * 1.6 : -Math.PI * 0.6, side < 0);
        brush.stroke();
      });
      brush.beginPath();                            // its tail, falling in a fan to each side
      brush.moveTo(0, -738);
      brush.quadraticCurveTo(-34, -728, -44, -716);
      brush.lineTo(44, -716);
      brush.quadraticCurveTo(34, -728, 0, -738);
      brush.closePath();
      thingFill(brush, relief, 1.2);
      brush.beginPath();                            // its body and neck, and the head with its crest
      brush.ellipse(0, -742, 9, 11, 0, 0, 7);
      thingFill(brush, relief, 1.2);
      brush.strokeStyle = relief;
      brush.lineWidth = 4;
      brush.beginPath(); brush.moveTo(0, -750); brush.quadraticCurveTo(4, -762, 1, -770); brush.stroke();
      brush.beginPath(); brush.arc(1, -772, 4, 0, 7); brush.fillStyle = relief; brush.fill();
      brush.lineWidth = 1.4;
      brush.beginPath();
      for (var c = -1; c <= 1; c++) { brush.moveTo(1, -775); brush.lineTo(1 + c * 4, -784); }
      brush.stroke();
    } else {
      for (n = -4; n <= 4; n++) { brush.beginPath(); brush.moveTo(0, -722); brush.lineTo(n * 34, -712); brush.stroke(); }
    }
    [-1, 1].forEach(function (side) {               // the cho fa: a golden finial curling up at each end of the ridge, and one at the top
      brush.save();
      brush.scale(side, 1);
      brush.beginPath();
      brush.moveTo(150, -718);
      brush.quadraticCurveTo(196, -730, 204, -790);
      brush.quadraticCurveTo(206, -810, 190, -812);
      brush.quadraticCurveTo(200, -770, 150, -730);
      brush.closePath();
      fillInk(gold);
      brush.restore();
    });
    brush.beginPath();
    brush.moveTo(-8, -798); brush.quadraticCurveTo(0, -850, 14, -862); brush.quadraticCurveTo(4, -830, 8, -798);
    brush.closePath();
    fillInk(gold);
  }
  brush.restore();
}

// A gong (ฆ้อง) on its stand, the stand's foot's middle on (x, base): two posts and a beam of wood, the gong of
// bronze hanging from the beam by a cord, a raised boss in its middle. look.struck: the seconds since it was struck
// (it swings a little and rings: rings of sound go out from it for a second and a half). 110 wide, 170 high at
// size 1; gongAt() gives the boss's middle, where a mallet strikes.
// gongAt(x, base, size) gives back [x, y], pixels of the sheet: the boss's middle, where a mallet strikes.
// e.g. var boss = gongAt(900, 940, 1);
function gongAt(x, base, size) { return [x, base - 96 * size]; }

// brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, struck
// (seconds since the stroke; left out, it hangs still and silent). Returns nothing: it draws with
// brush, and leaves brush as it found it.
// e.g. gong(pen, 900, 940, 1, {struck: 0.4});   // struck 0.4 seconds ago
function gong(brush, x, base, size, look) {
  look = look || {};
  var since = look.struck === undefined ? 99 : look.struck, swing = since < 2 ? 0.08 * Math.sin(since * 9) * (1 - since / 2) : 0;
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.strokeStyle = "#5a3a22";
  brush.lineWidth = 7;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(-52, 0); brush.lineTo(-48, -168);
  brush.moveTo(52, 0); brush.lineTo(48, -168);
  brush.moveTo(-60, -166); brush.lineTo(60, -166);
  brush.stroke();
  brush.save();
  brush.translate(0, -166);
  brush.rotate(swing);
  brush.strokeStyle = "#8a6a3a";
  brush.lineWidth = 2;
  brush.beginPath();
  brush.moveTo(-14, 0); brush.lineTo(-8, 30); brush.moveTo(14, 0); brush.lineTo(8, 30);
  brush.stroke();
  var disc = brush.createRadialGradient(-10, 60, 6, 0, 70, 44);   // the gong: bronze, its boss lit
  disc.addColorStop(0, "#f2cf6a");
  disc.addColorStop(0.6, "#c08a2a");
  disc.addColorStop(1, "#7a5418");
  brush.fillStyle = disc;
  brush.beginPath();
  brush.arc(0, 70, 42, 0, 7);
  brush.fill();
  brush.strokeStyle = "#5a3e10";
  brush.lineWidth = 2;
  brush.stroke();
  brush.beginPath();
  brush.arc(0, 70, 14, 0, 7);
  brush.fillStyle = "#e8b84a";
  brush.fill();
  brush.stroke();
  brush.restore();
  if (since < 1.5) {                                // its ringing, in rings that go out and fade
    for (var r = 0; r < 3; r++) {
      var u = since / 1.5 + r * 0.18;
      if (u > 1) { continue; }
      brush.strokeStyle = "rgba(240, 200, 110, " + ((1 - u) * 0.6).toFixed(3) + ")";
      brush.lineWidth = 3;
      brush.beginPath();
      brush.arc(0, -96, 50 + u * 110, -0.9, 0.9);
      brush.stroke();
      brush.beginPath();
      brush.arc(0, -96, 50 + u * 110, Math.PI - 0.9, Math.PI + 0.9);
      brush.stroke();
    }
  }
  brush.restore();
}

// A trough of gold (ลินคำ, lin kham) on posts, as a house's rainwater runs along one to a jar: a half-pipe of
// gold, lit along its upper lip, raised "high" (46 unless told) above the ground on forked posts of wood, one
// every "gap" (80). It runs along "ground", a row of points of the scene on the ground (the first at its start),
// and is drawn only "built" of the way along it (0 to 1): a trough as it grows. look.sag: [where (0 to 1 of
// the way), how far (px)] for a trough that bends down in its middle; look.size scales its width and its posts;
// look.tint as the hut's.
// brush: a canvas 2D context; ground: a list of two or more [x, y], pixels of the sheet; built: 0 to 1;
// look: optional, high (46), gap (80), sag ([where, pixels]), size (1), tint. Returns nothing: it
// draws with brush, and leaves its fill and line set.
// e.g. linKham(pen, [[200, 940], [700, 930], [1100, 945]], between(t, 2, 12), {sag: [0.5, 12]});
function linKham(brush, ground, built, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var size = look.size || 1, high = (look.high || 46) * size, gap = (look.gap || 80) * size, n, k;
  var marks = [0];                                  // the distance along at each point
  for (n = 1; n < ground.length; n++) { marks.push(marks[n - 1] + Math.hypot(ground[n][0] - ground[n - 1][0], ground[n][1] - ground[n - 1][1])); }
  var total = marks[marks.length - 1], upTo = total * clamp(built);
  if (upTo < 1) { return; }
  function groundAt(d) {                            // the point of the ground a distance along
    for (k = 1; k < ground.length && marks[k] < d; k++) { }
    k = Math.min(k, ground.length - 1);
    var u = (d - marks[k - 1]) / ((marks[k] - marks[k - 1]) || 1);
    return [mix(ground[k - 1][0], ground[k][0], u), mix(ground[k - 1][1], ground[k][1], u)];
  }
  function at(d) {                                  // the trough's point a distance along: on its posts, bent where it sags
    var p = groundAt(d), sag = look.sag ? look.sag[1] * Math.max(0, 1 - Math.abs(d / total - look.sag[0]) / 0.25) : 0;
    return [p[0], p[1] - high + sag];
  }
  for (var d = 0; d <= upTo; d += gap) {            // the posts, from the ground up to the trough, forked at the top
    var top = at(d), foot = groundAt(d);
    brush.strokeStyle = tone("#6a4a2a");
    brush.lineWidth = 6 * size;
    brush.lineCap = "round";
    brush.beginPath();
    brush.moveTo(foot[0], foot[1]);
    brush.lineTo(top[0], top[1] + 4 * size);
    brush.moveTo(top[0], top[1] + 4 * size); brush.lineTo(top[0] - 7 * size, top[1] - 4 * size);
    brush.moveTo(top[0], top[1] + 4 * size); brush.lineTo(top[0] + 7 * size, top[1] - 4 * size);
    brush.stroke();
  }
  var pts = [];
  for (d = 0; d <= upTo; d += 6) { pts.push(at(d)); }
  pts.push(at(upTo));
  [[19, "#9a6e1a"], [14, "#e0b23a"], [4.5, "#fff0a0"]].forEach(function (band, i) {   // the half-pipe: its body, its gold, the light on its lip
    brush.strokeStyle = tone(band[1]);
    brush.lineWidth = band[0] * size;
    brush.lineCap = i === 0 ? "butt" : "round";
    brush.beginPath();
    pts.forEach(function (p, j) { var y = p[1] - (i === 2 ? 5 * size : 0); if (j) { brush.lineTo(p[0], y); } else { brush.moveTo(p[0], y); } });
    brush.stroke();
  });
  var end = at(upTo);                               // its open end, where it is still being built
  brush.fillStyle = tone("#7a5414");
  brush.beginPath();
  brush.ellipse(end[0], end[1], 5 * size, 9 * size, 0, 0, 7);
  brush.fill();
}

// ---------- the things of a Lanna home ----------
// Read from the household notebook's sources (the Lanna Traditional House Museum, the Ministry of Education's
// book of Thai basketry, Tai Yuan house studies; 2026-10-19): what a Tai Yuan home has, drawn in the kit's
// manner. Each a painter on a brush, standing on (x, base), with a size and a look.tint as the hut's.
//   huad(brush, x, base, size, t, look)   the sticky-rice steamer: a cone of woven bamboo set in the mouth of a
//                                          round clay pot on three hearth stones, a cloth over its top, and with
//                                          look.fire (0 to 1) a fire under the pot and steam (t) going up
//   kongKhao(brush, x, base, size, look)  the kong khao, the lidded basket that keeps the steamed rice: a round
//                                          body of fine woven bamboo on a squared foot, a domed lid, a cord to
//                                          carry it by
//   krabung(brush, x, base, size, look)   an open basket of woven bamboo, round, a little wider at the mouth, its
//                                          rim bound, for crops and the kitchen's things
//   mortar(brush, x, base, size, look)    the wooden mortar and its long pestle, kept under the house: a block of
//                                          wood hollowed at its top, the pestle leaning against it (look.pound, a
//                                          second: it is pounded, up and down, as the second runs)
//   taLaew(brush, x, base, size, look)    the ta laew, a star of woven bamboo strips on a post, at a yard's way in,
//                                          against bad fortune: look.points 6 (or 8, the great one)
// thingTone(look) gives back a function (colour) -> colour: "#rrggbb" blended toward look.tint[0] by
// look.tint[1], or the colour as it is when look or look.tint is missing.
// e.g. var tone = thingTone({tint: ["#2a3a6a", 0.3]}); brush.fillStyle = tone("#8a4a2e");
function thingTone(look) { return function (c) { return look && look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }; }

// brush: a canvas 2D context holding a path; colour: "#rrggbb"; line: pixels (1.8 when left out).
// Returns nothing; it leaves brush's fill and line set.
// e.g. brush.beginPath(); brush.rect(-16, -14, 32, 14); thingFill(brush, "#8a6a3a");
function thingFill(brush, colour, line) {           // the kit's manner: flat colour inside a fine dark line
  brush.fillStyle = colour;
  brush.fill();
  brush.strokeStyle = inkFor(colour);
  brush.lineWidth = line || 1.8;
  brush.lineJoin = "round";
  brush.stroke();
}

// brush: a canvas 2D context; left, top, wide, high, step: pixels of the brush's frame; colour: a CSS
// colour. Returns nothing; it leaves brush's line set.
// e.g. brush.save(); brush.clip(); thingWeave(brush, -40, -78, 80, 66, "rgba(110, 78, 36, 0.5)", 5); brush.restore();
function thingWeave(brush, left, top, wide, high, colour, step) {   // a plain weave of strips, clipped by the caller
  brush.strokeStyle = colour;
  brush.lineWidth = 1.2;
  for (var k = -high; k < wide + high; k += step) {
    brush.beginPath(); brush.moveTo(left + k, top); brush.lineTo(left + k + high * 0.6, top + high); brush.stroke();
    brush.beginPath(); brush.moveTo(left + k + high * 0.6, top); brush.lineTo(left + k, top + high); brush.stroke();
  }
}

// huad(brush, x, base, size, t, look) draws the sticky-rice steamer on its pot and stones (see the list
// above), about 90 wide and 146 tall at size 1. brush: a canvas 2D context; x, base: pixels of the
// sheet; size: needed; t: seconds; look: optional, fire (0 to 1, 0), tint. Returns nothing: it draws
// with brush, and leaves brush as it found it.
// e.g. huad(pen, 640, 940, 1, t, {fire: 1});
function huad(brush, x, base, size, t, look) {
  look = look || {};
  var tone = thingTone(look), fire = clamp(look.fire || 0), n;
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  if (fire > 0.01) {                                // the fire under the pot, between the stones
    for (n = 0; n < 3; n++) {
      var lick = 0.75 + 0.25 * Math.sin(t * 11 + n * 2.1);
      brush.beginPath();
      brush.moveTo(-14 + n * 14, -6);
      brush.quadraticCurveTo(-18 + n * 14, -22 * lick * fire, -7 + n * 14, -34 * lick * fire);
      brush.quadraticCurveTo(-2 + n * 14, -18 * lick * fire, 0 + n * 14, -6);
      brush.fillStyle = n === 1 ? "#ffd04a" : "#f07a2a";
      brush.fill();
    }
  }
  [[-30, 0], [30, 0], [0, 6]].forEach(function (s) { // three hearth stones
    brush.beginPath();
    brush.ellipse(s[0], -8 + s[1] * 0.2, 13, 10, 0, 0, 7);
    thingFill(brush, tone("#8a8378"));
  });
  brush.beginPath();                                // the pot: round clay, a short neck
  brush.moveTo(-26, -66);
  brush.bezierCurveTo(-52, -60, -50, -18, -24, -14);
  brush.lineTo(24, -14);
  brush.bezierCurveTo(50, -18, 52, -60, 26, -66);
  brush.closePath();
  thingFill(brush, tone("#8a4a2e"));
  brush.beginPath();
  brush.ellipse(0, -66, 26, 6, 0, 0, 7);
  thingFill(brush, tone("#6a3622"));
  brush.save();                                     // the huad: a cone of woven bamboo, its point down in the pot's mouth
  brush.beginPath();
  brush.moveTo(-8, -64);
  brush.lineTo(-38, -128);
  brush.quadraticCurveTo(0, -136, 38, -128);
  brush.lineTo(8, -64);
  brush.closePath();
  thingFill(brush, tone("#d2b06e"));
  brush.clip();
  thingWeave(brush, -40, -136, 80, 74, tone("rgba(120, 88, 40, 0.55)"), 7);
  brush.restore();
  brush.beginPath();                                // the cloth over its top
  brush.moveTo(-38, -128);
  brush.quadraticCurveTo(0, -146, 38, -128);
  brush.quadraticCurveTo(0, -132, -38, -128);
  thingFill(brush, tone("#e8e0cc"), 1.4);
  if (fire > 0.01) {                                // steam rising from it, curling as it goes
    for (n = 0; n < 3; n++) {
      var u = ((t * 0.5 + n / 3) % 1), sx = -16 + n * 16 + 8 * Math.sin(t * 2 + n * 2);
      brush.strokeStyle = "rgba(255, 255, 255, " + (0.5 * (1 - u) * fire).toFixed(3) + ")";
      brush.lineWidth = 5;
      brush.lineCap = "round";
      brush.beginPath();
      brush.moveTo(sx, -140 - u * 40);
      brush.quadraticCurveTo(sx + 10, -150 - u * 60, sx, -160 - u * 80);
      brush.stroke();
    }
  }
  brush.restore();
}

// kongKhao(brush, x, base, size, look) draws the lidded rice basket, about 60 wide and 100 tall at size
// 1. brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, tint.
// Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. kongKhao(pen, 560, 930, 1.1);
function kongKhao(brush, x, base, size, look) {
  var tone = thingTone(look);
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.beginPath();                                // the squared foot
  brush.rect(-16, -14, 32, 14);
  thingFill(brush, tone("#8a6a3a"));
  brush.save();
  brush.beginPath();                                // the body: round, of fine woven bamboo
  brush.moveTo(-14, -14);
  brush.bezierCurveTo(-40, -22, -40, -68, -16, -76);
  brush.lineTo(16, -76);
  brush.bezierCurveTo(40, -68, 40, -22, 14, -14);
  brush.closePath();
  thingFill(brush, tone("#c9a35e"));
  brush.clip();
  thingWeave(brush, -40, -78, 80, 66, tone("rgba(110, 78, 36, 0.5)"), 5);
  brush.restore();
  brush.beginPath();                                // the domed lid
  brush.moveTo(-19, -76);
  brush.quadraticCurveTo(0, -100, 19, -76);
  brush.closePath();
  thingFill(brush, tone("#b8904e"));
  brush.strokeStyle = tone("#5a3a22");              // the cord to carry it by
  brush.lineWidth = 2;
  brush.beginPath();
  brush.moveTo(-24, -58); brush.quadraticCurveTo(0, -122, 24, -58);
  brush.stroke();
  brush.restore();
}

// krabung(brush, x, base, size, look) draws an open basket, 68 wide and 54 tall at size 1. brush: a
// canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, tint. Returns
// nothing: it draws with brush, and leaves brush as it found it.
// e.g. krabung(pen, 480, 930, 1.1);
function krabung(brush, x, base, size, look) {
  var tone = thingTone(look);
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.save();
  brush.beginPath();
  brush.moveTo(-26, 0);
  brush.lineTo(-34, -48);
  brush.lineTo(34, -48);
  brush.lineTo(26, 0);
  brush.closePath();
  thingFill(brush, tone("#c4a05a"));
  brush.clip();
  thingWeave(brush, -36, -50, 72, 52, tone("rgba(110, 78, 36, 0.5)"), 8);
  brush.restore();
  brush.beginPath();                                // its bound rim
  brush.ellipse(0, -48, 34, 6, 0, 0, 7);
  thingFill(brush, tone("#8a6a3a"));
  brush.restore();
}

// mortar(brush, x, base, size, look) draws the wooden mortar and its pestle, the block 56 wide and 60
// tall at size 1. brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look:
// optional, pound (seconds: pounding), tint. Returns nothing: it draws with brush, and leaves brush
// as it found it.
// e.g. mortar(pen, 820, 940, 1.1, {pound: t});
function mortar(brush, x, base, size, look) {
  look = look || {};
  var tone = thingTone(look), lift = look.pound === undefined ? 0 : 40 * Math.max(0, Math.sin(look.pound * Math.PI * 2.4));
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.beginPath();                                // the block, hollowed at the top
  brush.moveTo(-28, 0);
  brush.lineTo(-24, -54);
  brush.lineTo(24, -54);
  brush.lineTo(28, 0);
  brush.closePath();
  thingFill(brush, tone("#7a5232"));
  brush.beginPath();
  brush.ellipse(0, -54, 24, 6, 0, 0, 7);
  thingFill(brush, tone("#4a2e1a"));
  brush.save();                                     // the long pestle: leaning against it, or up and down
  if (look.pound === undefined) { brush.translate(22, -48); brush.rotate(0.35); }
  else { brush.translate(0, -50 - lift); }
  brush.beginPath();
  brush.rect(-4, -120, 8, 124);
  thingFill(brush, tone("#9a7048"));
  brush.restore();
  brush.restore();
}

// taLaew(brush, x, base, size, look) draws the ta laew on its post, about 210 tall at size 1. brush:
// a canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, points (6), tint.
// Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. taLaew(pen, 200, 940, 1.1, {points: 8});
function taLaew(brush, x, base, size, look) {
  look = look || {};
  var tone = thingTone(look), points = look.points || 6, r = 30, k;
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.strokeStyle = tone("#6a4a2a");               // the post
  brush.lineWidth = 6;
  brush.lineCap = "round";
  brush.beginPath(); brush.moveTo(0, 0); brush.lineTo(0, -150); brush.stroke();
  brush.translate(0, -170);
  // The star, woven, not a figure of lines: narrow pointed petals of strip radiating from a small open lattice
  // at its middle, where the strips cross over and under one another.
  var strip = tone("#d8bc7a");
  for (k = 0; k < points; k++) {                    // the points: each a narrow diamond of two strips
    brush.save();
    brush.rotate(k * Math.PI * 2 / points);
    brush.beginPath();
    brush.moveTo(10, 0);
    brush.lineTo(22, -5);
    brush.lineTo(r + 8, 0);
    brush.lineTo(22, 5);
    brush.closePath();
    thingFill(brush, strip, 1.6);
    brush.restore();
  }
  brush.beginPath();                                // the open lattice at the middle: a ring of strip
  for (k = 0; k <= points; k++) {
    var a = k * Math.PI * 2 / points;
    if (k) { brush.lineTo(Math.cos(a) * 12, Math.sin(a) * 12); } else { brush.moveTo(12, 0); }
  }
  brush.closePath();
  brush.strokeStyle = inkFor(strip);
  brush.lineWidth = 5.4;
  brush.stroke();
  brush.strokeStyle = strip;
  brush.lineWidth = 3.4;
  brush.stroke();
  for (k = 0; k < points / 2; k++) {                // and the strips crossing it, over and under
    a = k * Math.PI * 2 / points + Math.PI / points;
    brush.strokeStyle = inkFor(strip);
    brush.lineWidth = 3.4;
    brush.beginPath(); brush.moveTo(Math.cos(a) * 12, Math.sin(a) * 12); brush.lineTo(-Math.cos(a) * 12, -Math.sin(a) * 12); brush.stroke();
    brush.strokeStyle = strip;
    brush.lineWidth = 1.8;
    brush.stroke();
  }
  brush.restore();
}
PIECES_KIT.push("huad", "kongKhao", "krabung", "mortar", "taLaew");

// Things a person holds out, to feed an animal (owner, 2026-10-20: "Make grass and a banana for the kit"), drawn with
// their middle on (x, y), so a hand can hold them: grassBundle() an armful of cut grass, look.tied (true: a band of
// twisted grass round the middle, the blades fanned above and below it; false: loose blades, drooping);
// bananas() a hand of short, plump bananas (kluai nam wa, the north's everyday banana), look.count (1 to 6),
// look.ripe (0 green to 1 yellow, brown-flecked), look.angle. Each about 90 long at size 1.
// brush: a canvas 2D context; x, y: its middle, pixels of the sheet; size: needed; look: optional,
// tied (true), angle (radians, 0), tint. Returns nothing: it draws with brush, and leaves brush as it
// found it.
// e.g. var j = person(600, 950, cast("boy")); grassBundle(pen, j.handA[0], j.handA[1], 1, {angle: -0.4});
function grassBundle(brush, x, y, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var greens = ["#6f9a3a", "#86ad44", "#5c8432", "#9bbf55", "#76a03c"], n, tied = look.tied !== false;
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  brush.rotate(look.angle || 0);
  brush.lineCap = "round";
  for (n = 0; n < 26; n++) {                        // the blades, each a thin curve from the stems' ends to its tip
    var u = n / 25 - 0.5, sway = Math.sin(n * 2.3) * 6, lenUp = 44 + 10 * Math.sin(n * 1.7), lenDown = 30 + 8 * Math.cos(n * 1.3);
    brush.strokeStyle = tone(greens[n % greens.length]);
    brush.lineWidth = 2.2 + (n % 3) * 0.6;
    brush.beginPath();
    if (tied) {                                     // fanned up from the band, and the cut stems below it
      brush.moveTo(u * 10, 0);
      brush.quadraticCurveTo(u * 30 + sway, -lenUp * 0.6, u * 52 + sway, -lenUp);
      brush.moveTo(u * 10, 0);
      brush.lineTo(u * 18, lenDown * 0.6);
    } else {                                        // loose: an armful, the blades drooping over both ends
      brush.moveTo(-34, u * 14);
      brush.quadraticCurveTo(0, u * 18 - 6 + sway * 0.5, 38 + Math.abs(u) * 10, u * 22 + 10 + sway);
      brush.moveTo(-34, u * 14);
      brush.quadraticCurveTo(-46, u * 16 + 4, -52 - Math.abs(sway), u * 20 + 16);
    }
    brush.stroke();
  }
  if (tied) {                                       // the band of twisted grass
    brush.fillStyle = tone("#b89a4a");
    brush.strokeStyle = inkFor(tone("#b89a4a"));
    brush.lineWidth = 1.4;
    brush.beginPath();
    brush.ellipse(0, 2, 13, 5, 0, 0, 7);
    brush.fill();
    brush.stroke();
    brush.strokeStyle = tone("#8a7230");
    for (n = -2; n <= 2; n++) { brush.beginPath(); brush.moveTo(n * 5 - 2, -2); brush.lineTo(n * 5 + 2, 6); brush.stroke(); }
  }
  brush.restore();
}
// brush: a canvas 2D context; x, y: the crown where they meet, pixels of the sheet; size: needed;
// look: optional, count (1 to 6, 1), ripe (0 to 1, 1), angle (radians, 0), tint. Returns nothing:
// it draws with brush, and leaves brush as it found it.
// e.g. bananas(pen, 640, 900, 1, {count: 4, ripe: 0.8});
function bananas(brush, x, y, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var count = Math.max(1, Math.min(6, Math.round(look.count || 1))), ripe = clamp(look.ripe === undefined ? 1 : look.ripe), n;
  var skin = tone(blend("#8fae3a", "#f2cf4a", ripe)), shade = tone(blend("#6a8a2a", "#c99a2a", ripe));
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  brush.rotate(look.angle || 0);
  for (n = count - 1; n >= 0; n--) {                // fanned from the crown, the back ones first
    var a = (n - (count - 1) / 2) * 0.22;
    brush.save();
    brush.rotate(a);
    brush.beginPath();                              // one banana: short, plump, curved up, its ends blunt
    brush.moveTo(-2, -4);
    brush.quadraticCurveTo(20, -20, 50, -14);
    brush.quadraticCurveTo(62, -10, 64, -2);
    brush.quadraticCurveTo(46, 10, 18, 8);
    brush.quadraticCurveTo(2, 6, -2, 3);
    brush.closePath();
    brush.fillStyle = skin;
    brush.fill();
    brush.strokeStyle = inkFor(skin);
    brush.lineWidth = 1.8;
    brush.stroke();
    brush.strokeStyle = shade;                      // a ridge along it
    brush.lineWidth = 1.4;
    brush.beginPath();
    brush.moveTo(4, -1);
    brush.quadraticCurveTo(28, -10, 58, -6);
    brush.stroke();
    brush.fillStyle = tone("#4a3a22");              // the dark tip
    brush.beginPath();
    brush.ellipse(63, -5, 3, 2.4, 0.4, 0, 7);
    brush.fill();
    if (ripe > 0.7) {                               // a few brown flecks on a ripe one
      brush.fillStyle = "rgba(110, 70, 30, 0.55)";
      [[22, -6], [36, -9], [44, -2]].forEach(function (q) { brush.beginPath(); brush.arc(q[0], q[1], 1.3, 0, 7); brush.fill(); });
    }
    brush.restore();
  }
  brush.fillStyle = tone("#6a5a2a");                // the crown where they meet the stalk
  brush.strokeStyle = inkFor(tone("#6a5a2a"));
  brush.lineWidth = 1.4;
  brush.beginPath();
  brush.ellipse(-4, 0, 6, 7, 0, 0, 7);
  brush.fill();
  brush.stroke();
  brush.restore();
}
PIECES_KIT.push("grassBundle", "bananas");

// A tuft of grass growing (owner, 2026-10-21: "Add some grass tufts", for the buffalo to eat): blades from one root at
// (x, y), the ground, up and out, swaying a little with look.t (the second); look.eaten (0 to 1) crops them short, as a
// buffalo leaves a tuft; look.tint as a set's pieces take it. About 50 tall at size 1.
// brush: a canvas 2D context; x, y: its root, pixels of the sheet; size: needed; look: optional, t
// (seconds, 0), eaten (0 to 1, 0), tint. Returns nothing: it draws with brush, and leaves brush as it
// found it.
// e.g. grassTuft(pen, 520, 960, 1, {t: t, eaten: between(t, 3, 8)});
function grassTuft(brush, x, y, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var greens = ["#5f8a34", "#78a23f", "#4f7a2e", "#8db54d"], t = look.t || 0, left = 1 - 0.7 * clamp(look.eaten || 0);
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  brush.lineCap = "round";
  for (var n = 0; n < 11; n++) {                    // each blade a curve from the root, leaning out the more the further from the middle
    var u = n / 10 - 0.5, tall = (36 + 16 * Math.sin(n * 2.1 + 1)) * left, lean = u * 46 + 3 * Math.sin(t * 1.3 + n);
    brush.strokeStyle = tone(greens[n % greens.length]);
    brush.lineWidth = 2.6 + (n % 2);
    brush.beginPath();
    brush.moveTo(u * 10, 0);
    brush.quadraticCurveTo(u * 14 + lean * 0.3, -tall * 0.6, u * 10 + lean, -tall);
    brush.stroke();
  }
  brush.restore();
}
PIECES_KIT.push("grassTuft");

// A fire stick (owner, 2026-10-20: "When he's feeding the monster coals, have the boy flip them up with a stick"): a
// thin length of split bamboo from a hand (from) out to its far end (to), the far end charred, and glowing while it
// is in the fire (look.hot, 0 to 1). Pass a person's hand joint as from, and the point in the coals, or up in the
// air at the top of a flick, as to; emberFlight() then throws the ember from the stick's end.
// brush: a canvas 2D context; from, to: [x, y], pixels of the sheet; look: optional, hot (0 to 1, 0),
// tint. Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. fireStick(pen, person(600, 950, cast("boy")).handA, [760, 930], {hot: 0.6});
function fireStick(brush, from, to, look) {
  look = look || {};
  var hot = clamp(look.hot || 0), cane = look.tint ? blend("#b0904a", look.tint[0], look.tint[1]) : "#b0904a";
  var dx = to[0] - from[0], dy = to[1] - from[1], long = Math.sqrt(dx * dx + dy * dy) || 1;
  var back = [from[0] - dx / long * 14, from[1] - dy / long * 14];   // a little of it shows behind the hand
  brush.save();
  brush.lineCap = "round";
  brush.strokeStyle = inkFor(cane);
  brush.lineWidth = 7.5;
  brush.beginPath(); brush.moveTo(back[0], back[1]); brush.lineTo(to[0], to[1]); brush.stroke();
  brush.strokeStyle = cane;
  brush.lineWidth = 4.5;
  brush.beginPath(); brush.moveTo(back[0], back[1]); brush.lineTo(to[0], to[1]); brush.stroke();
  var char = [to[0] - dx / long * 22, to[1] - dy / long * 22];       // the charred end
  brush.strokeStyle = "#2a1a12";
  brush.lineWidth = 5;
  brush.beginPath(); brush.moveTo(char[0], char[1]); brush.lineTo(to[0], to[1]); brush.stroke();
  if (hot > 0) {                                    // the end glowing from the coals
    var glow = brush.createRadialGradient(to[0], to[1], 0, to[0], to[1], 16);
    glow.addColorStop(0, "rgba(255, 190, 80, " + (0.9 * hot) + ")");
    glow.addColorStop(1, "rgba(255, 120, 40, 0)");
    brush.fillStyle = glow;
    brush.beginPath(); brush.arc(to[0], to[1], 16, 0, 7); brush.fill();
    brush.fillStyle = "rgba(255, 210, 120, " + hot + ")";
    brush.beginPath(); brush.arc(to[0], to[1], 2.6, 0, 7); brush.fill();
  }
  brush.restore();
}
PIECES_KIT.push("fireStick");

// The poor family's house of the north, a bamboo house (เรือนเครื่องผูก), drawn 2026-10-20. Owner: "research traditional Lanna housing
// and redo the poor house like this" (a picture of the bamboo house at Chiang Mai University's Lanna Traditional House
// Museum). From the kit's research ("Lanna houses" notebook): the เรือนเครื่องผูก, a house tied together, not nailed:
// bamboo posts with bracing, the floor raised; walls and floor of flattened split bamboo (ฟาก), bound with bamboo
// strips and rattan; one steep gable roof (45 degrees and more) with low sweeping eaves, laid in rows of tong tueng
// leaf panels (ตับ), a plain ridge with crossed bamboo tips (no carved kalae: that is a rich house's); an open veranda
// (ชาน) with a low railing and a water-pot shelf under its own little roof; the ladder recessed under the eaves, a
// water jar at its foot to wash the feet; hardly any windows; under the house, firewood and tools.
// ruenPhuk(brush, x, base, size, look): standing on (x, base); about 290 wide and 240 high at size 1; the door at the
// right, the veranda and the ladder right of it, where the tub's door and ladder were. look: glow (0 to 1, a lamp in
// the doorway at night), tint ([colour, amount]).
// brush: a canvas 2D context; x, base: pixels of the sheet; size: needed; look: optional, glow (0 to
// 1, 0), tint. Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. ruenPhuk(pen, 900, 900, 1.2, {glow: 0.7});
function ruenPhuk(brush, x, base, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var post = tone("#b49a5a"), postDark = tone("#8a7240"), fak = tone("#d8c48a"), fakDark = tone("#b8a066"),
      leaf = tone("#8a5a34"), leafLight = tone("#a8744a"), leafDark = tone("#5e3a22"), tie = tone("#6a4a26"),
      glow = look.glow || 0, n, k;
  var floorY = -96, wallTop = -170, roomL = -128, roomR = 52, chanR = 136;
  function ink(c) { brush.strokeStyle = inkFor(c); brush.lineWidth = 1.8; brush.lineJoin = "round"; brush.stroke(); }
  function rect(x0, y0, x1, y1, c) { brush.beginPath(); brush.rect(x0, y0, x1 - x0, y1 - y0); brush.fillStyle = c; brush.fill(); ink(c); }
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.lineCap = "round";
  // under the house: its shade, firewood stacked, a hoe leaning
  brush.fillStyle = "rgba(60, 40, 20, 0.18)";
  brush.beginPath(); brush.ellipse(0, -4, 160, 12, 0, 0, 7); brush.fill();
  for (n = 0; n < 7; n++) {
    brush.fillStyle = tone(n % 2 ? "#8a6a42" : "#9a7a4a");
    brush.beginPath(); brush.ellipse(-70 + (n % 4) * 9, -6 - Math.floor(n / 4) * 7, 22, 3.6, 0, 0, 7); brush.fill(); ink(tone("#8a6a42"));
  }
  brush.strokeStyle = tie; brush.lineWidth = 2.4;
  brush.beginPath(); brush.moveTo(-10, -2); brush.lineTo(4, -56); brush.stroke();
  brush.fillStyle = tone("#6a6a6a"); brush.beginPath(); brush.moveTo(-14, -2); brush.lineTo(-4, -2); brush.lineTo(-8, 4); brush.closePath(); brush.fill();
  // the posts of bamboo, the floor beams on them, and the braces, tied
  [roomL + 6, -40, roomR - 6, chanR - 6].forEach(function (px, i) {
    var top = i === 3 ? floorY + 6 : floorY;
    rect(px - 5, top, px + 5, 0, post);
    brush.strokeStyle = postDark; brush.lineWidth = 1.4;  // its nodes
    for (k = top + 22; k < -6; k += 26) { brush.beginPath(); brush.moveTo(px - 5, k); brush.lineTo(px + 5, k); brush.stroke(); }
  });
  brush.strokeStyle = post; brush.lineWidth = 4;     // a brace between the posts
  brush.beginPath(); brush.moveTo(roomL + 6, -24); brush.lineTo(-40, floorY + 8); brush.moveTo(roomR - 6, -24); brush.lineTo(-40, floorY + 8); brush.stroke();
  rect(roomL - 6, floorY - 2, chanR + 4, floorY + 8, postDark);   // the floor's edge: flattened bamboo on the joists
  // the room: walls of flattened bamboo, strips upright, bound by a rail at the top and the middle
  rect(roomL, wallTop, roomR, floorY - 2, fak);
  brush.strokeStyle = fakDark; brush.lineWidth = 1.1;
  for (k = roomL + 7; k < roomR; k += 7) { brush.beginPath(); brush.moveTo(k, wallTop + 2); brush.lineTo(k + 0.6, floorY - 3); brush.stroke(); }
  brush.strokeStyle = fakDark; brush.lineWidth = 1.6;   // the nodes, in a ragged line across
  for (k = roomL + 3; k < roomR; k += 7) { var ny = -134 + 6 * Math.sin(k * 0.7); brush.beginPath(); brush.moveTo(k, ny); brush.lineTo(k + 5, ny); brush.stroke(); }
  [wallTop + 6, -128].forEach(function (ry) {
    rect(roomL - 2, ry - 3, roomR + 2, ry + 3, post);
    brush.strokeStyle = tie; brush.lineWidth = 1.6;    // rattan ties where the rail crosses the posts
    [roomL + 6, -40, roomR - 6].forEach(function (px) { brush.beginPath(); brush.moveTo(px - 4, ry - 4); brush.lineTo(px + 4, ry + 4); brush.moveTo(px + 4, ry - 4); brush.lineTo(px - 4, ry + 4); brush.stroke(); });
  });
  // the door, at the right of the room, dark inside, a lamp's light at night
  brush.beginPath(); brush.rect(20, -160, 26, 62); brush.fillStyle = tone("#2a1c12"); brush.fill(); ink(tone("#6a4a26"));
  if (glow > 0) {
    var g = brush.createRadialGradient(33, -126, 2, 33, -126, 40);
    g.addColorStop(0, "rgba(255, 200, 110, " + glow + ")"); g.addColorStop(1, "rgba(255, 160, 60, 0)");
    brush.fillStyle = g; brush.fillRect(20, -160, 26, 62);
  }
  brush.fillStyle = tone("#2a1c12");                 // a slit for air (ป่อง), the one opening in the wall
  brush.fillRect(-92, -150, 18, 4);
  // the veranda: open, a low railing, the water-pot shelf at its end under its own small roof
  rect(roomR, floorY + 4, chanR, floorY + 10, post);
  brush.strokeStyle = post; brush.lineWidth = 3;
  brush.beginPath(); brush.moveTo(roomR + 4, floorY - 26); brush.lineTo(chanR - 22, floorY - 26); brush.stroke();
  for (k = roomR + 8; k < chanR - 20; k += 9) { brush.beginPath(); brush.moveTo(k, floorY + 4); brush.lineTo(k, floorY - 26); brush.stroke(); }
  rect(chanR - 22, floorY - 30, chanR - 2, floorY + 4, post);   // the shelf's frame
  brush.fillStyle = tone("#a0603a"); brush.beginPath(); brush.ellipse(chanR - 12, floorY - 36, 8, 9, 0, 0, 7); brush.fill(); ink(tone("#a0603a"));   // the water pot
  brush.beginPath(); brush.moveTo(chanR - 30, floorY - 46); brush.lineTo(chanR - 12, floorY - 64); brush.lineTo(chanR + 6, floorY - 46); brush.closePath();
  brush.fillStyle = leaf; brush.fill(); ink(leaf);   // its little roof of leaves
  // the ladder, down from the veranda's end, under the eaves; a water jar at its foot
  brush.strokeStyle = post; brush.lineWidth = 4;
  brush.beginPath(); brush.moveTo(chanR - 2, floorY + 6); brush.lineTo(chanR + 26, 0); brush.moveTo(chanR + 12, floorY + 6); brush.lineTo(chanR + 40, 0); brush.stroke();
  brush.lineWidth = 2.6;
  for (k = 1; k < 5; k++) { var u = k / 5; brush.beginPath(); brush.moveTo(chanR - 2 + 28 * u, floorY + 6 - (floorY + 6) * u); brush.lineTo(chanR + 12 + 28 * u, floorY + 6 - (floorY + 6) * u); brush.stroke(); }
  brush.fillStyle = tone("#8a4a2a"); brush.beginPath(); brush.ellipse(chanR + 2, -8, 7, 8, 0, 0, 7); brush.fill(); ink(tone("#8a4a2a"));   // beside the ladder's foot
  // the roof: one steep gable, its long side to us, low eaves, rows of leaf panels, the ridge, crossed tips
  var eaveY = -150, ridgeY = -248, eaveL = roomL - 26, eaveR = roomR + 34, ridgeL = roomL + 4, ridgeR = roomR + 6;
  brush.beginPath();
  brush.moveTo(eaveL, eaveY); brush.lineTo(ridgeL, ridgeY); brush.lineTo(ridgeR, ridgeY); brush.lineTo(eaveR, eaveY); brush.closePath();
  brush.fillStyle = leaf; brush.fill(); ink(leafDark);
  brush.save(); brush.clip();
  for (n = 0; n < 9; n++) {                          // the rows of panels, from the eaves up, each a ragged edge of leaves
    var ry2 = eaveY - n * 11.5;
    brush.fillStyle = n % 2 ? leafLight : leaf;
    brush.beginPath(); brush.moveTo(eaveL - 20, ry2 - 12);
    for (k = eaveL - 20; k < eaveR + 20; k += 5 + 6 * dice(k + n * 31)) { brush.quadraticCurveTo(k + 3, ry2 + 2 + 5 * dice(k * 3 + n), k + 6, ry2 - 2 + 3 * dice(k + 7 * n)); }   // leaves, not tiles: each its own length
    brush.lineTo(eaveR + 20, ry2 - 12); brush.closePath(); brush.fill();
    brush.strokeStyle = leafDark; brush.lineWidth = 1; brush.stroke();
    brush.strokeStyle = "rgba(60, 36, 20, 0.35)";   // the leaves' veins, a few strokes down each row
    brush.lineWidth = 0.8;
    for (k = eaveL; k < eaveR; k += 11) { var vx = k + 6 * dice(k + n * 13); brush.beginPath(); brush.moveTo(vx, ry2 - 10); brush.lineTo(vx + 2, ry2 - 1); brush.stroke(); }
  }
  brush.restore();
  brush.strokeStyle = leafDark; brush.lineWidth = 2.2;   // the eaves' ragged leaf ends
  brush.beginPath();
  for (k = eaveL; k <= eaveR; k += 7) { brush.moveTo(k, eaveY); brush.lineTo(k + 2 + 2 * Math.sin(k), eaveY + 5 + 2 * Math.cos(k * 1.7)); }
  brush.stroke();
  rect(ridgeL - 6, ridgeY - 5, ridgeR + 6, ridgeY + 3, postDark);   // the ridge pole, and the bamboo tips crossed at each end
  brush.strokeStyle = post; brush.lineWidth = 3.4;
  [ridgeL - 6, ridgeR + 6].forEach(function (rx) { brush.beginPath(); brush.moveTo(rx - 10, ridgeY - 16); brush.lineTo(rx + 8, ridgeY + 6); brush.moveTo(rx + 10, ridgeY - 16); brush.lineTo(rx - 8, ridgeY + 6); brush.stroke(); });
  brush.restore();
}
PIECES_KIT.push("ruenPhuk");
