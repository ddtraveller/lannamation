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

function pratheep(brush, x, y, size, t, seed) {   // the dish on (x, y); the flame flickers with t
  var s = size || 1, clock = t || 0, k = seed || 0;
  var flick = 1 + 0.25 * Math.sin(clock * 11 + k * 1.7) * Math.sin(clock * 7.3 + k), lean = Math.sin(clock * 4 + k * 2.1) * 2;
  brush.save();
  brush.translate(x, y);
  brush.scale(s, s);
  var glow = brush.createRadialGradient(0, -6, 0, 0, -6, 34);   // the warm glow on the ground
  glow.addColorStop(0, "rgba(255, 190, 90, 0.45)");
  glow.addColorStop(1, "rgba(255, 170, 60, 0)");
  brush.fillStyle = glow;
  brush.beginPath();
  brush.ellipse(0, -2, 34, 14, 0, 0, 7);
  brush.fill();
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

function pratheepRow(brush, x, y, count, gap, size, t) {   // a row of lamps from (x, y) to the right
  for (var n = 0; n < count; n++) { pratheep(brush, x + n * gap, y, size, t, n); }
}

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
