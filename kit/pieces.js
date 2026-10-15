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
