// offerings.js - the offerings and the thread of Lanna's rites, for the Lanna cartoon kit: for blessings, weddings, the
// temple and the soul-calling (สู่ขวัญ) in any tale. Load it after oldcartoon.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="offerings.js"></script>
//
// Each is a painter on a brush, as pieces.js's are; t is the second where something moves. The owner's pick,
// 2026-10-26 ("Yes, all four"), drawn from what the north uses:
//   swaiDok(brush, x, y, size, t)          the flower cone (สวยดอก): a cone of folded banana leaf, flowers, a beeswax
//                                          candle and three sticks of incense; carried to the temple, held in a wai
//                                          (put it between the wrists person() gives back, joints.wristA and wristB)
//   khanDok(brush, x, base, size, t)       the footed bowl of flowers (ขันดอก), lacquered red and black, heaped with
//                                          flowers and flower cones; offered at the temple, set out at a blessing
//   malai(brush, x, y, size, t)            the jasmine garland (พวงมาลัย), hanging from (x, y): at a spirit house, in
//                                          the hand of one who gives it to an elder
//   saiSinWrist(brush, x, y, angle, size)  the white thread (สายสิญจน์) tied round a wrist (joints.wristA)
//   saiSinLine(brush, points, t)           the white thread strung round a gathering or a house
// offFlowers(brush, x, y, r, seed) heaps the flowers (marigolds, jasmine buds, red roses) any of them may hold.

// Fills the path just made and lines it. Returns nothing.
function offFill(brush, fill, ink, width) { brush.fillStyle = fill; brush.fill(); brush.strokeStyle = ink; brush.lineWidth = width || 1.4; brush.stroke(); }

// Flowers for an offering, heaped about (x, y) within radius r: marigolds (ดาวเรือง), jasmine buds, a few red
// roses; seed: the same heap for the same seed.
function offFlowers(brush, x, y, r, seed) {
  for (var k = 0; k < 14; k++) {
    var a = dice(seed + k * 1.7) * Math.PI, d = r * Math.sqrt(dice(seed + k * 2.9)), fx = x + Math.cos(a) * d * 1.1, fy = y - Math.sin(a) * d * 0.7;
    var kind = dice(seed + k * 4.3);
    if (kind < 0.5) {                               // a marigold: a ball of ruffled orange petals
      brush.beginPath(); brush.arc(fx, fy, r * 0.28, 0, 7); offFill(brush, kind < 0.25 ? "#f2a81e" : "#e87a1a", "#9a4a0a", 1);
      brush.strokeStyle = "rgba(150, 70, 10, 0.5)"; brush.lineWidth = 0.8;
      brush.beginPath(); for (var p = 0; p < 6; p++) { var pa = p * 1.05; brush.moveTo(fx, fy); brush.lineTo(fx + Math.cos(pa) * r * 0.24, fy + Math.sin(pa) * r * 0.24); } brush.stroke();
    } else if (kind < 0.85) {                       // a jasmine bud, white, pointed
      brush.beginPath(); brush.ellipse(fx, fy, r * 0.09, r * 0.16, a, 0, 7); offFill(brush, "#fffaf0", "#b8b0a0", 0.8);
    } else {                                        // a red rose, its petals in a spiral
      brush.beginPath(); brush.arc(fx, fy, r * 0.22, 0, 7); offFill(brush, "#c8203a", "#6a0a1a", 1);
      brush.strokeStyle = "#8a1028"; brush.lineWidth = 1; brush.beginPath(); brush.arc(fx, fy, r * 0.11, 0.5, 5.5); brush.stroke();
    }
  }
}

// swaiDok(brush, x, y, size, t): the flower cone (สวยดอก): a cone of folded banana leaf, its point down at (x, y),
// filled with flowers, a small candle of beeswax and three sticks of incense standing in it, their smoke rising;
// carried to the temple and held in a wai. About 70 tall at size 1.
function swaiDok(brush, x, y, size, t) {
  brush.save(); brush.translate(x, y); brush.scale(size, size);
  brush.beginPath(); brush.moveTo(0, 0); brush.lineTo(-24, -52); brush.quadraticCurveTo(0, -60, 24, -52); brush.closePath();   // the leaf cone
  offFill(brush, "#5a9a3a", "#24461a");
  brush.strokeStyle = "rgba(30, 70, 20, 0.6)"; brush.lineWidth = 1;   // the folds of the leaf
  brush.beginPath(); brush.moveTo(0, 0); brush.lineTo(-8, -55); brush.moveTo(0, 0); brush.lineTo(9, -55); brush.stroke();
  brush.strokeStyle = "#d8c8a0"; brush.lineWidth = 1.8;   // a stick of incense, three, and the candle
  brush.beginPath(); for (var k = -1; k <= 1; k++) { brush.moveTo(k * 5, -50); brush.lineTo(k * 9, -92); } brush.stroke();
  brush.fillStyle = "#c8282a"; for (k = -1; k <= 1; k++) { brush.beginPath(); brush.arc(k * 9, -92, 1.6, 0, 7); brush.fill(); }
  brush.beginPath(); brush.rect(10, -76, 5, 22); offFill(brush, "#e8c860", "#8a6a20", 1);
  brush.beginPath(); brush.ellipse(12.5, -81 + Math.sin(t * 9) * 0.6, 2.2, 4, 0, 0, 7); brush.fillStyle = "#ffcc44"; brush.fill();
  offFlowers(brush, 0, -54, 20, 3);
  for (k = 0; k < 3; k++) {                         // the incense smoke, curling up and fading
    var u = (t * 0.35 + k / 3) % 1;
    brush.strokeStyle = "rgba(220, 220, 225, " + (0.5 * (1 - u)) + ")"; brush.lineWidth = 1.4;
    brush.beginPath(); brush.moveTo(k * 9 - 9, -94); brush.quadraticCurveTo(k * 9 - 9 + 8 * Math.sin(t + k), -110 - 40 * u, k * 9 - 9 - 6 * Math.sin(t * 1.3 + k), -120 - 60 * u); brush.stroke();
  }
  brush.restore();
}

// khanDok(brush, x, base, size, t): the bowl of flowers (ขันดอก): a lacquered bowl, red within and black without,
// on a tall foot, heaped with flowers and flower cones, standing on (x, base); offered at the temple, set out at a
// blessing or a wedding. About 110 wide at size 1.
function khanDok(brush, x, base, size, t) {
  brush.save(); brush.translate(x, base); brush.scale(size, size);
  brush.beginPath(); brush.moveTo(-26, 0); brush.lineTo(-16, -34); brush.lineTo(16, -34); brush.lineTo(26, 0); brush.closePath();   // the foot
  offFill(brush, "#2a1a16", "#0a0606");
  brush.strokeStyle = "#c8962a"; brush.lineWidth = 2; brush.beginPath(); brush.moveTo(-22, -10); brush.lineTo(22, -10); brush.stroke();
  brush.beginPath(); brush.moveTo(-56, -64); brush.quadraticCurveTo(-50, -34, 0, -32); brush.quadraticCurveTo(50, -34, 56, -64); brush.closePath();   // the bowl
  offFill(brush, "#2a1a16", "#0a0606");
  brush.strokeStyle = "#c8962a"; brush.lineWidth = 2.4; brush.beginPath(); brush.moveTo(-54, -56); brush.quadraticCurveTo(0, -44, 54, -56); brush.stroke();   // a gold line round it
  brush.beginPath(); brush.ellipse(0, -64, 56, 8, 0, 0, 7); offFill(brush, "#a8282e", "#4a0a10");   // its red lacquered mouth
  offFlowers(brush, 0, -66, 46, 11);
  brush.restore();
  [-26, 0, 24].forEach(function (dx, k) { swaiDok(brush, x + dx * size, base - 78 * size, size * 0.6, t + k); });
}

// malai(brush, x, y, size, t): the jasmine garland (พวงมาลัย), hanging from (x, y): a loop of strung jasmine buds, a
// knot of red rose and marigold at its foot, a pendant of jasmine and two ribbon tails swinging; hung at a spirit
// house, given to an elder. About 90 long at size 1.
function malai(brush, x, y, size, t) {
  var sway = 0.08 * Math.sin(t * 1.6);
  brush.save(); brush.translate(x, y); brush.rotate(sway); brush.scale(size, size);
  for (var k = 0; k <= 26; k++) {                   // the loop of jasmine buds
    var a = Math.PI * 2 * k / 26, bx = 16 * Math.sin(a), by = 26 - 26 * Math.cos(a);
    brush.beginPath(); brush.ellipse(bx, by, 3.4, 4.6, a, 0, 7); offFill(brush, "#fffaf0", "#b8b0a0", 0.7);
  }
  brush.beginPath(); brush.arc(0, 54, 8, 0, 7); offFill(brush, "#c8203a", "#6a0a1a", 1);   // the rose at the knot
  brush.beginPath(); brush.arc(-9, 58, 5, 0, 7); offFill(brush, "#f2a81e", "#9a4a0a", 0.8);
  brush.beginPath(); brush.arc(9, 58, 5, 0, 7); offFill(brush, "#f2a81e", "#9a4a0a", 0.8);
  for (k = 0; k < 6; k++) { brush.beginPath(); brush.ellipse(0, 64 + k * 5, 2.6, 3.4, 0, 0, 7); offFill(brush, "#fffaf0", "#b8b0a0", 0.6); }   // the pendant
  [[-1, "#e0b23a"], [1, "#c8203a"]].forEach(function (r) {   // the ribbon tails
    var w = 3 * Math.sin(t * 2.2 + r[0]);
    brush.strokeStyle = r[1]; brush.lineWidth = 3;
    brush.beginPath(); brush.moveTo(r[0] * 4, 60); brush.quadraticCurveTo(r[0] * 10 + w, 80, r[0] * 7 + w * 1.5, 98); brush.stroke();
  });
  brush.restore();
}

// saiSinWrist(brush, x, y, angle, size): the white thread (สายสิญจน์) tied round a wrist at (x, y), the hand's way
// angle: a few turns of white cotton and the knot, its two short ends; for the soul-calling, a wedding, a goodbye.
function saiSinWrist(brush, x, y, angle, size) {
  brush.save(); brush.translate(x, y); brush.rotate(angle); brush.scale(size, size);
  brush.strokeStyle = "#fbf8f0"; brush.lineWidth = 1.6;
  for (var k = -1; k <= 1; k++) { brush.beginPath(); brush.ellipse(k * 2, 0, 2.5, 8, 0, 0, 7); brush.stroke(); }
  brush.strokeStyle = "rgba(120, 110, 100, 0.7)"; brush.lineWidth = 0.6;
  for (k = -1; k <= 1; k++) { brush.beginPath(); brush.ellipse(k * 2, 0, 3.2, 8.8, 0, 0, 7); brush.stroke(); }
  brush.strokeStyle = "#fbf8f0"; brush.lineWidth = 1.4;
  brush.beginPath(); brush.moveTo(0, 8); brush.lineTo(-3, 16); brush.moveTo(0, 8); brush.lineTo(4, 15); brush.stroke();
  brush.restore();
}

// saiSinLine(brush, points, t): the white thread strung round a gathering or a house, from point to point, sagging
// between them and stirring a little.
function saiSinLine(brush, points, t) {
  brush.strokeStyle = "#fbf8f0"; brush.lineWidth = 1.4;
  brush.beginPath();
  points.forEach(function (p, k) {
    if (!k) { brush.moveTo(p[0], p[1]); return; }
    var q = points[k - 1], sag = 14 + 3 * Math.sin(t * 1.2 + k);
    brush.quadraticCurveTo((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + sag, p[0], p[1]);
  });
  brush.stroke();
}
