// honghin.js - the things and places of the tale of Hong Hin, the stone swan (หงส์หิน), for the Lanna cartoon kit, as
// mangrai.js and chiangsaen.js hold their tales'. Load it after the kit, pieces.js (vimanaHall draws the palace hall),
// and, for vimanaLotus's princess, people.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="pieces.js"></script>
//     <script src="honghin.js"></script>
//
// The beings of the tale are in the kit's own files (2026-11-11): the stone swan and Indra in himmaphan.js (hongHin,
// indra), the ghouls, the giantess and the giants' daughters in ogre.js, the Hemmarat in myth.js. Here, each the
// owner's pick of two or three candidates (2026-11-11; sheet honghin.html):
//   sugarPalm(x, base, t, look)    the old sugar palm at Varanasi's south gate, the giantess's home: dead fans hanging
//                                  under its head, a hollow at its foot, shaded, and bones before it
//   swanLog(x, base, t)            the stone swan folded and hidden: a log under creepers, the red saddle cloth showing
//   sabaBean(x, y), redSeed(x, y), seedPouch(x, base)
//                                  the six brothers' gold saba pieces (the beans of the saba vine, in gold), the red
//                                  seeds with a black eye (มะกล่ำตาแดง) the prince wins with, and his mother's pouch
//   puppy(x, y, t, look)           the spotted puppy put in place of the baby: the kit's dog, small, tan, dark patches
//   kanchai(x, y, look)            Indra's sword Kanchai (ดาบกัญไจย): a flame-edged blade that shines, a gold hilt
//   crossbow, musket, fetters      the brothers' crossbow (หน้าไม้) and matchlock, the iron fetters of the trial
//   vimana(x, base, t, look)       the giant princesses' floating palaces (วิมานลอย), on a cloud, streamers flying:
//                                  "prasat" the white prasat with a gold roof of tiers (after the owner's pictures of
//                                  Khuang Phra Chao Lanna, Mae Rim), "hall" a palace hall crowned with a gold spire,
//                                  parasols at its corners, "lotus" an open gold pavilion on a lotus, its princess within
//   thaiCloud, streamer, chatra    a cloud of Thai painting, a forked streamer in the wind, a tiered parasol (ฉัตร)
//   baiSri(x, base, size, t)       the bai si su khwan (บายศรีสู่ขวัญ) of the crowning, and conch(x, y, size), its conch
// Each draws with pen in film pixels (a joint person() gave back is divided by PIX first) and leaves pen as it found it.

// ---------- small helpers ----------
function hhInk(fill, ink, w) { pen.fillStyle = fill; pen.fill(); pen.strokeStyle = ink; pen.lineWidth = w || 2; pen.stroke(); }
function hhRandom(seed) {                            // a repeatable random: the same moss and spots every frame
  var s = Math.floor(seed * 9973) % 2147483647 || 1;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
var HH_SHEET = null;                                 // a sheet of the film's size, for a drawing painted over (puppy)
function hhOver(draw, over) {                        // draw() on the sheet, then over(ctx) on what it drew only, then onto the film
  if (!HH_SHEET || HH_SHEET.width !== pen.canvas.width || HH_SHEET.height !== pen.canvas.height) {
    HH_SHEET = document.createElement("canvas");
    HH_SHEET.width = pen.canvas.width;
    HH_SHEET.height = pen.canvas.height;
  }
  var ctx = HH_SHEET.getContext("2d"), keep = pen;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, HH_SHEET.width, HH_SHEET.height);
  ctx.setTransform(keep.getTransform());
  pen = ctx;
  try { draw(); } finally { pen = keep; }
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  over(ctx);
  ctx.restore();
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.drawImage(HH_SHEET, 0, 0);
  pen.restore();
}

// ---------- gold, white, light from the upper left ----------
function hhGold(x0, y0, x1, y1) {
  var g = pen.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, "#fbe7a2"); g.addColorStop(0.35, "#e9be5a"); g.addColorStop(0.75, "#c88f2c"); g.addColorStop(1, "#9a6a1e");
  return g;
}
function hhWhite(x0, x1) {
  var g = pen.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, "#ffffff"); g.addColorStop(0.6, "#f2efe8"); g.addColorStop(1, "#cfc8bc");
  return g;
}
var HH_GOLD_INK = "#6e4612", HH_WHITE_INK = "#8a8070";

// A kranok flame (the curling flame of Thai ornament), rising from (x, y), h tall, leaning lean; filled with fill.
function kranokFlame(x, y, h, lean, fill) {
  pen.beginPath();
  pen.moveTo(x - h * 0.18, y);
  pen.bezierCurveTo(x - h * 0.3, y - h * 0.4, x + lean * h * 0.2, y - h * 0.7, x + lean * h * 0.45, y - h);
  pen.quadraticCurveTo(x + lean * h * 0.05, y - h * 0.82, x + lean * h * 0.15, y - h * 0.62);
  pen.bezierCurveTo(x + h * 0.1, y - h * 0.4, x + h * 0.22, y - h * 0.2, x + h * 0.18, y);
  pen.closePath();
  hhInk(fill || hhGold(x - h * 0.3, y - h, x + h * 0.3, y), HH_GOLD_INK, 1.2);
}

// A redented box (ย่อมุม): the corners stepped in twice, from (x - w, y0) to (x + w, y1), filled.
function redentBox(x, w, y0, y1, fill, ink, step) {
  var d = step || Math.min(10, w * 0.08);
  pen.beginPath();
  pen.moveTo(x - w + 2 * d, y0); pen.lineTo(x - w + 2 * d, y0 + d); pen.lineTo(x - w + d, y0 + d); pen.lineTo(x - w + d, y0 + 2 * d);
  pen.lineTo(x - w, y0 + 2 * d); pen.lineTo(x - w, y1); pen.lineTo(x + w, y1); pen.lineTo(x + w, y0 + 2 * d); pen.lineTo(x + w - d, y0 + 2 * d);
  pen.lineTo(x + w - d, y0 + d); pen.lineTo(x + w - 2 * d, y0 + d); pen.lineTo(x + w - 2 * d, y0); pen.closePath();
  hhInk(fill, ink, 1.4);
  pen.strokeStyle = "rgba(0, 0, 0, 0.12)"; pen.lineWidth = 1;   // the stepped corners' shadow lines
  pen.beginPath(); pen.moveTo(x + w - d, y0 + 2 * d); pen.lineTo(x + w - d, y1); pen.moveTo(x + w - 2 * d, y0 + d); pen.lineTo(x + w - 2 * d, y1); pen.stroke();
}

// An arched niche or door with its flame-edged gold frame (ซุ้มโขง): its foot's middle at (x, y), w wide, h tall.
function flameArch(x, y, w, h, dark) {
  pen.beginPath();                                   // the frame, a little wider, its top a pointed ogee with flames
  pen.moveTo(x - w * 0.75, y); pen.lineTo(x - w * 0.75, y - h * 0.62);
  pen.bezierCurveTo(x - w * 0.75, y - h * 0.95, x - w * 0.2, y - h * 1.0, x, y - h * 1.28);
  pen.bezierCurveTo(x + w * 0.2, y - h * 1.0, x + w * 0.75, y - h * 0.95, x + w * 0.75, y - h * 0.62);
  pen.lineTo(x + w * 0.75, y); pen.closePath();
  hhInk(hhGold(x - w, y - h * 1.3, x + w, y), HH_GOLD_INK, 1.4);
  for (var k = 0; k < 5; k++) {                      // flames along the frame's two shoulders
    var u = 0.15 + k * 0.17;
    kranokFlame(x - w * 0.75 + u * w * 0.7, y - h * (0.66 + u * 0.55), h * 0.16, -1);
    kranokFlame(x + w * 0.75 - u * w * 0.7, y - h * (0.66 + u * 0.55), h * 0.16, 1);
  }
  kranokFlame(x, y - h * 1.22, h * 0.3, 0.2);
  pen.beginPath();                                   // the opening
  pen.moveTo(x - w * 0.45, y); pen.lineTo(x - w * 0.45, y - h * 0.6);
  pen.bezierCurveTo(x - w * 0.45, y - h * 0.82, x - w * 0.1, y - h * 0.86, x, y - h * 1.02);
  pen.bezierCurveTo(x + w * 0.1, y - h * 0.86, x + w * 0.45, y - h * 0.82, x + w * 0.45, y - h * 0.6);
  pen.lineTo(x + w * 0.45, y); pen.closePath();
  var g = pen.createLinearGradient(0, y - h, 0, y);
  g.addColorStop(0, dark || "#3a1a10"); g.addColorStop(1, "#7a2a1a");
  hhInk(g, HH_GOLD_INK, 1.2);
  if (!dark) {                                        // the door's leaves, red lacquer with gold
    pen.strokeStyle = "rgba(240, 200, 100, 0.8)"; pen.lineWidth = 1.4;
    pen.beginPath(); pen.moveTo(x, y); pen.lineTo(x, y - h * 0.8); pen.stroke();
    for (k = 0; k < 4; k++) { pen.beginPath(); pen.arc(x - w * 0.22, y - h * (0.15 + k * 0.17), w * 0.06, 0, 7); pen.arc(x + w * 0.22, y - h * (0.15 + k * 0.17), w * 0.06, 0, 7); pen.stroke(); }
  }
}

// A spire of rings (ปล้องไฉน) on a lotus bell, from (x, y) up h, its width w at the foot, a little umbrella near the top.
function ringSpire(x, y, w, h) {
  pen.beginPath(); pen.moveTo(x - w, y); pen.quadraticCurveTo(x - w * 1.1, y - h * 0.14, x - w * 0.5, y - h * 0.2);
  pen.lineTo(x + w * 0.5, y - h * 0.2); pen.quadraticCurveTo(x + w * 1.1, y - h * 0.14, x + w, y); pen.closePath();
  hhInk(hhGold(x - w, y - h * 0.2, x + w, y), HH_GOLD_INK, 1.3);   // the bell
  for (var k = 0; k < 9; k++) {                      // the rings, each smaller
    var y0 = y - h * 0.2 - k * h * 0.06, r = w * 0.5 * (1 - k * 0.09);
    pen.beginPath(); pen.ellipse(x, y0 - h * 0.03, r, h * 0.03, 0, 0, 7);
    hhInk(hhGold(x - r, y0 - h * 0.06, x + r, y0), HH_GOLD_INK, 1);
  }
  var top = y - h * 0.74;
  pen.beginPath(); pen.moveTo(x - w * 0.08, top); pen.lineTo(x, y - h); pen.lineTo(x + w * 0.08, top); pen.closePath();
  hhInk(hhGold(x - 4, y - h, x + 4, top), HH_GOLD_INK, 1);
  pen.beginPath(); pen.moveTo(x - w * 0.3, top - h * 0.05); pen.quadraticCurveTo(x, top - h * 0.1, x + w * 0.3, top - h * 0.05);
  pen.closePath(); pen.strokeStyle = HH_GOLD_INK; pen.lineWidth = 2; pen.stroke();   // the little umbrella
  pen.fillStyle = "#fff6d0"; pen.beginPath(); pen.arc(x, y - h, 2.5, 0, 7); pen.fill();
}

// The stepped gold roof: n tiers from width w0 to w1, each th tall, from y up; small arched niches on each tier's front,
// a flame at each tier's corners. Returns the top's y.
function goldTiers(x, y, w0, w1, n, th, gold) {
  for (var k = 0; k < n; k++) {
    var w = w0 + (w1 - w0) * k / (n - 1), y1 = y - k * th, y0 = y1 - th;
    redentBox(x, w, y0, y1, gold || hhGold(x - w, y0, x + w, y1), HH_GOLD_INK, Math.max(3, w * 0.06));
    pen.strokeStyle = "rgba(255, 246, 214, 0.7)"; pen.lineWidth = 1.2;   // the moulding's lit edge
    pen.beginPath(); pen.moveTo(x - w, y1 - 3); pen.lineTo(x + w, y1 - 3); pen.stroke();
    var niches = Math.max(1, Math.round(w / 40));
    for (var m = 0; m < niches; m++) {               // the small arched niches (บันแถลง) along its front
      var nx = x - w + (m + 0.5) * 2 * w / niches;
      pen.beginPath(); pen.moveTo(nx - th * 0.22, y1 - 4); pen.lineTo(nx - th * 0.22, y1 - th * 0.5);
      pen.quadraticCurveTo(nx, y1 - th * 1.05, nx + th * 0.22, y1 - th * 0.5); pen.lineTo(nx + th * 0.22, y1 - 4); pen.closePath();
      hhInk(m === Math.floor(niches / 2) ? "#2a1610" : "#7a4a1a", HH_GOLD_INK, 1);
    }
    kranokFlame(x - w + 2, y0 + 2, th * 0.8, -1);
    kranokFlame(x + w - 2, y0 + 2, th * 0.8, 1);
  }
  return y - n * th;
}

// Thai painting's cloud: round lobes heaped in rows into one billow, white lit from above, blue in its underside,
// the lobes' upper edges inked, a gold line on the lit side, and a scroll curling at each end.
function thaiCloud(x, y, w, t, seed) {
  var r = hhRandom(seed || 3), lobes = [], k;
  for (var row = 0; row < 3; row++) {
    var n = 7 - row * 2, rw = w * (1 - row * 0.28);
    for (k = 0; k < n; k++) {
      var u = n === 1 ? 0.5 : k / (n - 1), rr = (w / 14) * (1.25 - Math.abs(u - 0.5) * 0.7) * (0.9 + r() * 0.25);
      lobes.push([x - rw / 2 + u * rw + 5 * Math.sin(t * 0.5 + k + row), y - row * w * 0.06 - Math.sin(u * Math.PI) * w * 0.05, rr]);
    }
  }
  pen.save();
  pen.beginPath();
  lobes.forEach(function (c) { pen.moveTo(c[0] + c[2], c[1]); pen.arc(c[0], c[1], c[2], 0, Math.PI * 2); });
  pen.moveTo(x - w / 2, y); pen.rect(x - w / 2, y - 2, w, w * 0.06);
  var g = pen.createLinearGradient(0, y - w * 0.22, 0, y + w * 0.07);
  g.addColorStop(0, "#ffffff"); g.addColorStop(0.6, "#eef2fa"); g.addColorStop(1, "#b8c6e4");
  pen.fillStyle = g; pen.fill();
  pen.strokeStyle = "#7a8ab0"; pen.lineWidth = 1.4;  // the lobes' upper edges only, so they read as one heap
  lobes.forEach(function (c) { pen.beginPath(); pen.arc(c[0], c[1], c[2], Math.PI * 1.08, Math.PI * 1.92); pen.stroke(); });
  pen.strokeStyle = "rgba(222, 172, 70, 0.8)"; pen.lineWidth = 2;
  lobes.forEach(function (c) { pen.beginPath(); pen.arc(c[0], c[1], c[2] - 4, Math.PI * 1.2, Math.PI * 1.5); pen.stroke(); });
  [-1, 1].forEach(function (d) {                     // a scroll at each end
    var cx = x + d * (w / 2 + 10), cy = y + 4;
    pen.beginPath();
    for (var a = 0; a <= 14; a++) { var ang = a * 0.45, rad = 30 - a * 1.9; pen.lineTo(cx + d * Math.cos(ang) * rad, cy - Math.sin(ang) * rad); }
    pen.lineWidth = 9; pen.strokeStyle = "#f4f6fc"; pen.stroke();
    pen.lineWidth = 1.4; pen.strokeStyle = "#7a8ab0"; pen.stroke();
  });
  pen.restore();
}

// A streamer (a tung's tail or a ribbon) from (x, y), long, rippling in the wind behind (to the left: dir -1).
function streamer(x, y, long, wide, colour, t, dir, phase) {
  pen.beginPath();
  var n = 24, top = [], bot = [];
  for (var k = 0; k <= n; k++) {
    var u = k / n, px = x + dir * u * long, wave = Math.sin(u * 5 - t * 2.4 + phase) * 30 * (0.25 + u), py = y + wave + u * 40;
    var ww = wide * (1 - u * 0.6);
    top.push([px, py - ww / 2]); bot.push([px, py + ww / 2]);
  }
  pen.moveTo(top[0][0], top[0][1]);
  top.forEach(function (p) { pen.lineTo(p[0], p[1]); });
  pen.lineTo(bot[n][0] + dir * 14, bot[n][1] + 8);    // a forked end
  for (k = n; k >= 0; k--) { pen.lineTo(bot[k][0], bot[k][1]); }
  pen.closePath();
  hhInk(colour, "rgba(60, 30, 10, 0.6)", 1);
  pen.strokeStyle = "rgba(240, 200, 90, 0.9)"; pen.lineWidth = 1.6;  // a gold edge
  pen.beginPath(); top.forEach(function (p, i) { if (i) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } }); pen.stroke();
}

// A tiered parasol (ฉัตร) on its pole, its foot at (x, y), h tall.
function chatra(x, y, h) {
  pen.strokeStyle = "#8a5a1a"; pen.lineWidth = 4; pen.beginPath(); pen.moveTo(x, y); pen.lineTo(x, y - h); pen.stroke();
  for (var k = 0; k < 5; k++) {
    var w = h * (0.22 - k * 0.035), yy = y - h * 0.45 - k * h * 0.11;
    pen.beginPath(); pen.moveTo(x - w, yy); pen.quadraticCurveTo(x, yy - h * 0.09, x + w, yy); pen.lineTo(x + w * 0.9, yy + h * 0.035);
    pen.lineTo(x - w * 0.9, yy + h * 0.035); pen.closePath();
    hhInk(k % 2 ? "#ffffff" : hhGold(x - w, yy - 10, x + w, yy), HH_GOLD_INK, 1.1);
    pen.fillStyle = "#e0b23a"; for (var f = -2; f <= 2; f++) { pen.beginPath(); pen.arc(x + f * w * 0.42, yy + h * 0.045, 2.2, 0, 7); pen.fill(); }
  }
}


// ---------- A: the white prasat ----------
function vimanaPrasat(x, base, s, t) {
  pen.save(); pen.translate(x, base); pen.scale(s, s); pen.translate(-x, -base);
  var k;
  [[-230, 1], [230, -1]].forEach(function (c) {      // small spires at the plinth's front corners
    redentBox(x + c[0], 22, base - 110, base - 40, hhWhite(x + c[0] - 22, x + c[0] + 22), HH_WHITE_INK, 4);
    goldTiers(x + c[0], base - 110, 18, 8, 3, 14);
    ringSpire(x + c[0], base - 152, 8, 90);
  });
  for (k = 0; k < 3; k++) {                          // the plinth, three steps, a lotus band on each
    var pw = 250 - k * 22, py1 = base - k * 26, py0 = py1 - 26;
    redentBox(x, pw, py0, py1, hhWhite(x - pw, x + pw), HH_WHITE_INK, 7);
    pen.fillStyle = "rgba(224, 178, 58, 0.9)";
    for (var p = -pw + 10; p < pw - 6; p += 14) { pen.beginPath(); pen.moveTo(x + p, py0 + 8); pen.quadraticCurveTo(x + p + 7, py0 - 2, x + p + 14, py0 + 8); pen.fill(); }
  }
  pen.beginPath(); pen.moveTo(x - 48, base); pen.lineTo(x - 34, base - 78); pen.lineTo(x + 34, base - 78); pen.lineTo(x + 48, base); pen.closePath();
  hhInk("#efe9de", HH_WHITE_INK, 1.2);              // the stair
  pen.strokeStyle = "rgba(138, 128, 112, 0.6)"; for (k = 1; k < 6; k++) { pen.beginPath(); pen.moveTo(x - 48 + k * 2.4, base - k * 13); pen.lineTo(x + 48 - k * 2.4, base - k * 13); pen.stroke(); }
  [-1, 1].forEach(function (d) {                     // gold naga balustrades, their heads raised at the foot
    pen.beginPath(); pen.moveTo(x + d * 50, base - 4); pen.quadraticCurveTo(x + d * 46, base - 50, x + d * 36, base - 80);
    pen.lineWidth = 9; pen.strokeStyle = "#d8a63c"; pen.stroke(); pen.lineWidth = 1.2; pen.strokeStyle = HH_GOLD_INK; pen.stroke();
    kranokFlame(x + d * 52, base - 2, 34, d);
  });
  redentBox(x, 150, base - 260, base - 78, hhWhite(x - 150, x + 150), HH_WHITE_INK, 9);   // the walls
  pen.strokeStyle = "rgba(224, 178, 58, 0.9)"; pen.lineWidth = 3;                             // gold bands top and foot
  pen.beginPath(); pen.moveTo(x - 150, base - 92); pen.lineTo(x + 150, base - 92); pen.moveTo(x - 150, base - 248); pen.lineTo(x + 150, base - 248); pen.stroke();
  flameArch(x, base - 78, 70, 120);
  [-1, 1].forEach(function (d) { flameArch(x + d * 104, base - 130, 30, 60, "#5a3a20"); });   // the side niches
  pen.fillStyle = "#e0b23a";                        // gold rosettes on the walls
  [[-104, -210], [104, -210], [-104, -110], [104, -110]].forEach(function (q) {
    for (var a = 0; a < 8; a++) { pen.beginPath(); pen.ellipse(x + q[0] + Math.cos(a * 0.785) * 7, base + q[1] + Math.sin(a * 0.785) * 7, 4, 2.4, a * 0.785, 0, 7); pen.fill(); }
  });
  var top = goldTiers(x, base - 260, 170, 70, 6, 30);
  pen.beginPath(); pen.ellipse(x, top - 8, 60, 16, 0, 0, 7); hhInk(hhGold(x - 60, top - 24, x + 60, top), HH_GOLD_INK, 1.2);
  ringSpire(x, top - 12, 48, 300);
  pen.restore();
}

// ---------- B: a palace hall with a spire ----------
function vimanaHall(x, base, s, t) {
  hoKham(pen, x, base, s, {part: "back", fine: true});
  hoKham(pen, x, base, s, {part: "front", fine: true, pediment: "peacock"});
  var ridge = base - 560 * s;                        // a gold spire rising from the middle of the ridge
  var top = goldTiers(x, ridge, 70 * s, 30 * s, 4, 26 * s);
  ringSpire(x, top, 26 * s, 260 * s);
  [-1, 1].forEach(function (d) { chatra(x + d * 360 * s, base - 140 * s, 260 * s); });
}

// ---------- C: an open gold pavilion on a lotus ----------
function vimanaLotus(x, base, s, t, who) {
  pen.save(); pen.translate(x, base); pen.scale(s, s); pen.translate(-x, -base);
  var k;
  for (k = -7; k <= 7; k++) {                        // the great lotus: petals in two rings
    var ang = k * 0.2;
    pen.save(); pen.translate(x + k * 30, base + 10); pen.rotate(ang * 0.4);
    pen.beginPath(); pen.moveTo(-24, 0); pen.bezierCurveTo(-30, 50, -6, 90, 0, 96); pen.bezierCurveTo(6, 90, 30, 50, 24, 0); pen.closePath();
    var lg = pen.createLinearGradient(0, 0, 0, 96); lg.addColorStop(0, "#fde2ea"); lg.addColorStop(1, "#e87a9a");
    hhInk(lg, "#a84a6a", 1.3); pen.restore();
  }
  redentBox(x, 220, base - 40, base + 4, hhGold(x - 220, base - 40, x + 220, base), HH_GOLD_INK, 8);   // the floor
  pen.beginPath(); pen.rect(x - 190, base - 300, 380, 260);                                                // inside, red lacquer
  var ig = pen.createLinearGradient(0, base - 300, 0, base - 40); ig.addColorStop(0, "#5a1410"); ig.addColorStop(1, "#9a2a1e");
  hhInk(ig, "#3a0a08", 1.2);
  pen.fillStyle = "rgba(240, 190, 80, 0.55)";        // gold stencilled flowers (lai kham) on the red
  for (k = 0; k < 40; k++) { var fx = x - 175 + (k % 8) * 50, fy = base - 280 + Math.floor(k / 8) * 50; for (var a = 0; a < 4; a++) { pen.beginPath(); pen.ellipse(fx + Math.cos(a * 1.57) * 6, fy + Math.sin(a * 1.57) * 6, 5, 3, a * 1.57, 0, 7); pen.fill(); } }
  if (who) { who(x, base - 40); }
  [-190, -95, 95, 190].forEach(function (px) {       // gold pillars, a lotus capital on each
    pen.beginPath(); pen.rect(x + px - 12, base - 300, 24, 260); hhInk(hhGold(x + px - 12, 0, x + px + 12, 0), HH_GOLD_INK, 1.2);
    pen.strokeStyle = "rgba(122, 70, 18, 0.5)"; for (var b = 0; b < 6; b++) { pen.beginPath(); pen.moveTo(x + px - 12, base - 280 + b * 44); pen.lineTo(x + px + 12, base - 266 + b * 44); pen.stroke(); }
    pen.beginPath(); pen.ellipse(x + px, base - 300, 20, 9, 0, 0, 7); hhInk(hhGold(x + px - 20, base - 310, x + px + 20, base - 290), HH_GOLD_INK, 1);
  });
  [[-190, -95], [95, 190]].forEach(function (pair) { // garlands hung between the pillars, jasmine white and marigold
    for (var g = 0; g < 2; g++) {
      pen.strokeStyle = g ? "#f2ead6" : "#e89a2a"; pen.lineWidth = 7;
      pen.beginPath(); pen.moveTo(x + pair[0], base - 280 + g * 14); pen.quadraticCurveTo(x + (pair[0] + pair[1]) / 2, base - 220 + g * 14 + 6 * Math.sin(t), x + pair[1], base - 280 + g * 14); pen.stroke();
    }
  });
  pen.beginPath(); pen.moveTo(x - 240, base - 300); pen.lineTo(x + 240, base - 300); pen.lineTo(x + 210, base - 330); pen.lineTo(x - 210, base - 330); pen.closePath();
  hhInk(hhGold(x - 240, base - 330, x + 240, base - 300), HH_GOLD_INK, 1.3);   // the eaves
  for (k = -5; k <= 5; k++) { pen.beginPath(); pen.moveTo(x + k * 44 - 10, base - 300); pen.quadraticCurveTo(x + k * 44, base - 284, x + k * 44 + 10, base - 300); hhInk("#e9be5a", HH_GOLD_INK, 1); }   // a gold fringe
  var top = goldTiers(x, base - 330, 200, 60, 7, 30, null);
  ringSpire(x, top, 44, 280);
  pen.restore();
}


// ---------- the bai si in detail ----------
// A bai si su khwan: a gold footed bowl (khan); on it a cone of banana leaves folded into points (nom maeo), tier on
// tier, a band of jasmine and marigold between the tiers, a cone of flowers at the top with a candle, white threads
// (sai sin) hanging from the top in loops; round its foot the offerings: a hand of bananas, a boiled egg, sticky rice
// in a banana-leaf parcel, a cup of water.
function baiSri(x, base, s, t) {
  pen.save(); pen.translate(x, base); pen.scale(s, s);
  var k, f;
  pen.beginPath(); pen.moveTo(-70, 0); pen.lineTo(-44, -60); pen.lineTo(44, -60); pen.lineTo(70, 0); pen.closePath();
  hhInk(hhGold(-70, -60, 70, 0), HH_GOLD_INK, 1.6);  // the foot
  for (k = 0; k < 3; k++) { pen.strokeStyle = "rgba(122, 70, 18, 0.55)"; pen.lineWidth = 1.2; pen.beginPath(); pen.moveTo(-60 + k * 6, -14 - k * 16); pen.lineTo(60 - k * 6, -14 - k * 16); pen.stroke(); }
  pen.beginPath(); pen.moveTo(-170, -60); pen.quadraticCurveTo(0, -34, 170, -60); pen.lineTo(150, -100); pen.quadraticCurveTo(0, -84, -150, -100); pen.closePath();
  hhInk(hhGold(-170, -100, 170, -60), HH_GOLD_INK, 1.6);   // the bowl
  pen.fillStyle = "rgba(255, 240, 190, 0.8)"; for (k = -6; k <= 6; k++) { pen.beginPath(); pen.arc(k * 22, -76, 3, 0, 7); pen.fill(); }
  var tiers = 5, base0 = -100;
  for (k = 0; k < tiers; k++) {                      // the tiers of folded banana leaf points
    var w = 120 - k * 20, y = base0 - k * 62;
    var n = 9 - Math.floor(k / 2);
    for (f = 0; f < n; f++) {
      var fx = -w + (f + 0.5) * 2 * w / n, fw = w / n * 1.05, depth = Math.abs(fx) / w;
      pen.beginPath(); pen.moveTo(fx - fw, y); pen.quadraticCurveTo(fx - fw * 0.6, y - 40, fx, y - 74); pen.quadraticCurveTo(fx + fw * 0.6, y - 40, fx + fw, y); pen.closePath();
      var lg = pen.createLinearGradient(fx - fw, 0, fx + fw, 0);
      lg.addColorStop(0, "#9ac85a"); lg.addColorStop(0.5, "#5a9a32"); lg.addColorStop(1, "#2e6a20");
      hhInk(lg, "#1e3a12", 1.2);
      pen.strokeStyle = "rgba(230, 250, 200, 0.75)"; pen.lineWidth = 1.2;   // the fold down its middle, and the leaf's veins
      pen.beginPath(); pen.moveTo(fx, y - 4); pen.lineTo(fx, y - 70); pen.stroke();
      pen.strokeStyle = "rgba(30, 58, 18, 0.35)"; pen.lineWidth = 0.8;
      for (var v = 1; v < 5; v++) { pen.beginPath(); pen.moveTo(fx - fw * 0.8, y - v * 12); pen.lineTo(fx, y - v * 12 - 8); pen.lineTo(fx + fw * 0.8, y - v * 12); pen.stroke(); }
    }
    pen.beginPath(); pen.rect(-w - 4, y - 8, 2 * w + 8, 16);                  // the band of flowers round the tier
    hhInk("#f6f2e6", "#8a8a7a", 1);
    for (f = -w; f <= w; f += 11) {
      pen.fillStyle = (Math.round(f / 11) % 3 === 0) ? "#f0a020" : "#fffdf6";
      pen.beginPath(); pen.arc(f, y, 5, 0, 7); pen.fill();
      pen.fillStyle = "rgba(200, 160, 60, 0.9)"; pen.beginPath(); pen.arc(f, y, 1.6, 0, 7); pen.fill();
    }
  }
  var ty = base0 - tiers * 62;
  pen.beginPath(); pen.moveTo(-30, ty); pen.quadraticCurveTo(-26, ty - 60, 0, ty - 100); pen.quadraticCurveTo(26, ty - 60, 30, ty); pen.closePath();
  hhInk("#fffdf6", "#9a9a8a", 1.2);                  // the cone of jasmine at the top
  for (k = 0; k < 30; k++) { var cy = ty - 6 - (k % 10) * 9, cx = (Math.floor(k / 10) - 1) * (14 - (k % 10)); pen.fillStyle = k % 7 ? "#ffffff" : "#f28fa8"; pen.beginPath(); pen.arc(cx, cy, 3.6, 0, 7); pen.fill(); pen.strokeStyle = "#c8c0a8"; pen.lineWidth = 0.6; pen.stroke(); }
  pen.beginPath(); pen.rect(-4, ty - 150, 8, 50); hhInk("#f6e7b0", "#a08a40", 1);   // the candle and its flame
  var fl = 1 + 0.12 * Math.sin(t * 9);
  pen.beginPath(); pen.moveTo(0, ty - 150); pen.quadraticCurveTo(-7, ty - 160, 0, ty - 150 - 22 * fl); pen.quadraticCurveTo(7, ty - 160, 0, ty - 150);
  pen.fillStyle = "#ffcc44"; pen.fill();
  pen.strokeStyle = "#ffffff"; pen.lineWidth = 1.6;   // the white threads, from the top in loops over the tiers
  for (k = -4; k <= 4; k++) {
    if (!k) { continue; }
    pen.beginPath(); pen.moveTo(0, ty - 40);
    pen.bezierCurveTo(k * 18, ty + 40, k * 30, base0 - 120, k * 28 + 4 * Math.sin(t + k), base0 + 10);
    pen.stroke();
    pen.strokeStyle = "rgba(160, 150, 130, 0.5)"; pen.lineWidth = 0.6; pen.stroke(); pen.strokeStyle = "#ffffff"; pen.lineWidth = 1.6;
  }
  // the offerings round the foot, on the table before it
  pen.translate(0, 0);
  [[-230, 0], [230, 0]].forEach(function (o, i) {
    if (i === 0) {                                   // a hand of bananas
      for (var b = 0; b < 5; b++) {
        pen.beginPath(); pen.moveTo(o[0] - 40 + b * 14, o[1] - 6); pen.quadraticCurveTo(o[0] - 60 + b * 14, o[1] - 60, o[0] - 30 + b * 14, o[1] - 90);
        pen.quadraticCurveTo(o[0] - 34 + b * 14, o[1] - 50, o[0] - 26 + b * 14, o[1] - 6); pen.closePath();
        hhInk(b % 2 ? "#f2d24a" : "#e8c43a", "#7a5a10", 1.2);
      }
      pen.beginPath(); pen.ellipse(o[0] + 40, o[1] - 20, 18, 22, 0, 0, 7); hhInk("#fbf8f0", "#a09a88", 1.2);   // a boiled egg
    } else {                                         // sticky rice in a banana-leaf parcel, and a cup of water
      pen.beginPath(); pen.moveTo(o[0] - 60, o[1]); pen.lineTo(o[0] - 50, o[1] - 50); pen.lineTo(o[0] + 10, o[1] - 56); pen.lineTo(o[0] + 14, o[1]); pen.closePath();
      hhInk("#5a8a32", "#1e3a12", 1.2);
      pen.strokeStyle = "#c8b080"; pen.lineWidth = 3; pen.beginPath(); pen.moveTo(o[0] - 56, o[1] - 26); pen.lineTo(o[0] + 12, o[1] - 30); pen.stroke();
      pen.beginPath(); pen.moveTo(o[0] + 30, o[1]); pen.lineTo(o[0] + 26, o[1] - 40); pen.lineTo(o[0] + 70, o[1] - 40); pen.lineTo(o[0] + 66, o[1]); pen.closePath();
      hhInk(hhGold(o[0] + 26, o[1] - 40, o[0] + 70, o[1]), HH_GOLD_INK, 1.2);
    }
  });
  pen.restore();
}


function redSeed(x, y) {                             // a red seed with its black eye (มะกล่ำตาแดง, Abrus)
  pen.beginPath(); pen.ellipse(x, y, 9, 7, 0, 0, 7); hhInk("#d0201e", "#5a0a0a", 1.2);
  pen.beginPath(); pen.ellipse(x + 5, y - 1, 3.5, 4.5, 0, 0, 7); pen.fillStyle = "#141010"; pen.fill();
  pen.fillStyle = "rgba(255, 230, 220, 0.8)"; pen.beginPath(); pen.arc(x - 3, y - 3, 2, 0, 7); pen.fill();
}

// crossbow(x, y): a crossbow (หน้าไม้), its stock's middle at (x, y), tipped up a little, a bolt on it, about 260 long.
function crossbow(x, y) {
  pen.save(); pen.translate(x, y); pen.rotate(-0.2);
  pen.beginPath(); pen.rect(-110, -8, 220, 16); hhInk("#8a5a2a", "#3a2410", 1.6);          // the stock
  pen.beginPath(); pen.moveTo(90, -90); pen.quadraticCurveTo(140, 0, 90, 90); pen.lineWidth = 9; pen.strokeStyle = "#6a4420"; pen.stroke();   // the bow
  pen.beginPath(); pen.moveTo(90, -90); pen.lineTo(20, 0); pen.lineTo(90, 90); pen.lineWidth = 1.5; pen.strokeStyle = "#e8e0c8"; pen.stroke();   // the string
  pen.beginPath(); pen.moveTo(10, -4); pen.lineTo(150, -4); pen.lineWidth = 3; pen.strokeStyle = "#2a2a2a"; pen.stroke();   // a bolt
  pen.restore();
}

// musket(x, y): a matchlock musket (ปืนคาบศิลา), its middle at (x, y), tipped up a little, about 320 long.
function musket(x, y) {
  pen.save(); pen.translate(x, y); pen.rotate(-0.15);
  pen.beginPath(); pen.moveTo(-140, -6); pen.lineTo(-60, -10); pen.lineTo(-40, 6); pen.lineTo(-140, 30); pen.closePath(); hhInk("#7a4a24", "#3a2410", 1.6);   // the butt
  pen.beginPath(); pen.rect(-60, -10, 150, 14); hhInk("#7a4a24", "#3a2410", 1.6);
  pen.beginPath(); pen.rect(-60, -16, 240, 8); hhInk("#4a4e54", "#1a1c20", 1.4);              // the barrel
  pen.beginPath(); pen.moveTo(-50, -16); pen.lineTo(-56, -30); pen.lineTo(-44, -30); pen.closePath(); hhInk("#4a4e54", "#1a1c20", 1.2);   // the lock
  pen.beginPath(); pen.moveTo(-40, 4); pen.quadraticCurveTo(-30, 22, -20, 4); pen.lineWidth = 2.4; pen.strokeStyle = "#2a2a2a"; pen.stroke();
  pen.restore();
}

// fetters(x, y): iron fetters, two rings and a chain between, their middle at (x, y), about 190 wide.
function fetters(x, y) {
  pen.save(); pen.translate(x, y);
  pen.strokeStyle = "#3a3c40"; pen.lineWidth = 9;
  pen.beginPath(); pen.ellipse(-70, 0, 26, 16, 0, 0, 7); pen.stroke();
  pen.beginPath(); pen.ellipse(70, 0, 26, 16, 0, 0, 7); pen.stroke();
  pen.lineWidth = 4;
  for (var k = 0; k < 6; k++) { pen.beginPath(); pen.ellipse(-36 + k * 14.4, 8 + 6 * Math.sin(k), 8, 5, k % 2 ? 0 : 1.5, 0, 7); pen.stroke(); }
  pen.restore();
}

function conch(x, y, s) {                         // a conch for pouring water, a gold cap and a gold stand
  pen.save(); pen.translate(x, y); pen.scale(s, s);
  pen.beginPath(); pen.moveTo(-60, 10); pen.bezierCurveTo(-80, -40, -10, -60, 40, -30); pen.bezierCurveTo(70, -14, 80, 10, 60, 18);
  pen.bezierCurveTo(20, 30, -30, 30, -60, 10); pen.closePath();
  var g = pen.createLinearGradient(0, -60, 0, 30); g.addColorStop(0, "#fffaf0"); g.addColorStop(1, "#d8c8b0");
  hhInk(g, "#7a6a50", 1.8);
  pen.strokeStyle = "rgba(122, 106, 80, 0.7)"; pen.lineWidth = 1.4;
  for (var k = 0; k < 4; k++) { pen.beginPath(); pen.moveTo(-50 + k * 22, 10); pen.quadraticCurveTo(-40 + k * 22, -30, -20 + k * 22, -40); pen.stroke(); }
  pen.beginPath(); pen.moveTo(52, -26); pen.lineTo(76, -14); pen.lineTo(70, 8); pen.lineTo(56, 14); pen.closePath(); hhInk("#e0b23a", "#6e4612", 1.4);
  pen.beginPath(); pen.moveTo(-40, 26); pen.lineTo(-30, 50); pen.lineTo(30, 50); pen.lineTo(40, 26); pen.closePath(); hhInk("#e0b23a", "#6e4612", 1.4);
  pen.restore();
}

// ---------- the sugar palm at the south gate ----------
// sugarPalm(x, base, t, look): a sugar palm (Borassus, ตาล), the old one at Varanasi's south gate under which the giantess
// lives: a straight grey trunk ringed with leaf scars, dead fans hanging brown under a round head of green fans, dark
// fruit; at its foot a hollow, dark inside, its rim lit on the left and shadowed under, its mouth worn; bones before it.
// (x, base): the trunk's foot; look: tall (600), lean (-30), dry (true), hollow (true). The owner's pick (C), "but give
// the hollow some shading so it's more clear what it is".
// e.g. sugarPalm(1500, GROUND, t, {});
function sugarPalm(x, base, t, look) {
  look = look || {};
  var tall = look.tall || 600, lean = look.lean === undefined ? -30 : look.lean, k;
  var top = [x + lean, base - tall];
  pen.save();
  pen.beginPath();                                   // the trunk, a little wider at the foot
  pen.moveTo(x - 30, base); pen.quadraticCurveTo(x - 18 + lean * 0.4, base - tall * 0.5, top[0] - 15, top[1]);
  pen.lineTo(top[0] + 15, top[1]); pen.quadraticCurveTo(x + 18 + lean * 0.4, base - tall * 0.5, x + 30, base); pen.closePath();
  var g = pen.createLinearGradient(x - 30, 0, x + 30, 0);
  g.addColorStop(0, "#8a8274"); g.addColorStop(0.4, "#9a9284"); g.addColorStop(1, "#4a443c");
  hhInk(g, "#2e2a24", 2);
  pen.strokeStyle = "rgba(40, 34, 28, 0.55)"; pen.lineWidth = 1.5;   // the rings of leaf scars
  for (k = 1; k < 28; k++) {
    var u = k / 28, cx = x + lean * u * u, cy = base - tall * u, w = 25 - 10 * u;
    pen.beginPath(); pen.moveTo(cx - w, cy); pen.quadraticCurveTo(cx, cy + 5, cx + w, cy); pen.stroke();
  }
  if (look.hollow !== false) {
    var hx = x + 2, hy = base - 34;
    pen.beginPath(); pen.ellipse(hx, hy + 8, 36, 50, 0, 0, Math.PI * 2);   // the worn mouth round it, lighter wood
    var lip = pen.createRadialGradient(hx - 8, hy - 10, 10, hx, hy + 8, 50);
    lip.addColorStop(0, "#b8a888"); lip.addColorStop(1, "rgba(120, 104, 80, 0)");
    pen.fillStyle = lip; pen.fill();
    pen.beginPath(); pen.moveTo(hx - 22, base); pen.bezierCurveTo(hx - 26, hy - 30, hx - 6, hy - 46, hx + 2, hy - 46);
    pen.bezierCurveTo(hx + 12, hy - 46, hx + 26, hy - 28, hx + 22, base); pen.closePath();
    var dark = pen.createRadialGradient(hx + 4, hy + 12, 2, hx, hy, 46);   // dark at its depth, brown toward the rim
    dark.addColorStop(0, "#050302"); dark.addColorStop(0.6, "#1a120a"); dark.addColorStop(1, "#4a3a28");
    hhInk(dark, "#1a1208", 2);
    pen.strokeStyle = "rgba(230, 216, 186, 0.85)"; pen.lineWidth = 3;      // its rim lit on the left
    pen.beginPath(); pen.moveTo(hx - 22, base - 2); pen.bezierCurveTo(hx - 25, hy - 28, hx - 7, hy - 44, hx + 2, hy - 44); pen.stroke();
    pen.strokeStyle = "rgba(20, 14, 8, 0.7)"; pen.lineWidth = 4;            // in shadow on the right
    pen.beginPath(); pen.moveTo(hx + 4, hy - 44); pen.bezierCurveTo(hx + 14, hy - 42, hx + 25, hy - 26, hx + 21, base - 2); pen.stroke();
    pen.fillStyle = "rgba(10, 6, 2, 0.35)";                                 // its shadow on the ground before it
    pen.beginPath(); pen.ellipse(hx + 10, base + 4, 46, 8, 0, 0, Math.PI * 2); pen.fill();
    pen.fillStyle = "#efe6d2"; pen.strokeStyle = "#8a7a5a"; pen.lineWidth = 1.2;
    [[-70, 4, 0.3], [-44, 8, -0.4], [52, 6, 0.2], [80, 2, 1.2]].forEach(function (b) {   // bones on the ground
      pen.save(); pen.translate(x + b[0], base + b[1]); pen.rotate(b[2]);
      pen.beginPath(); pen.rect(-14, -2.5, 28, 5); pen.arc(-15, -3, 4, 0, 7); pen.arc(-15, 3, 4, 0, 7); pen.arc(15, -3, 4, 0, 7); pen.arc(15, 3, 4, 0, 7);
      pen.fill(); pen.stroke(); pen.restore();
    });
  }
  if (look.dry !== false) {                          // dead fans hanging under the head, brown
    for (k = 0; k < 9; k++) {
      var a = -1.2 + k * 0.3, dx = top[0] + Math.sin(a) * 50, dy = top[1] + 10;
      pen.beginPath(); pen.moveTo(dx, dy); pen.quadraticCurveTo(dx + Math.sin(a) * 60, dy + 70, dx + Math.sin(a) * 40 - 20, dy + 150);
      pen.lineTo(dx + Math.sin(a) * 40 + 24, dy + 140); pen.quadraticCurveTo(dx + Math.sin(a) * 30 + 10, dy + 60, dx + 8, dy); pen.closePath();
      hhInk(k % 2 ? "#8a6a3a" : "#a07a44", "#4a3418", 1.4);
    }
  }
  for (k = 0; k < 15; k++) {                         // the fans, each on its stalk, round the head, stirring
    var ang = -Math.PI + 0.1 + k * (Math.PI - 0.2) / 14 + 0.04 * Math.sin(t * 0.8 + k);
    var len = 120 + 30 * Math.sin(k * 1.7), fx = top[0] + Math.cos(ang) * len, fy = top[1] + Math.sin(ang) * len * 0.85;
    pen.strokeStyle = "#5a6a2a"; pen.lineWidth = 4;
    pen.beginPath(); pen.moveTo(top[0], top[1]); pen.lineTo(fx, fy); pen.stroke();
    pen.save(); pen.translate(fx, fy); pen.rotate(ang + Math.PI / 2);
    pen.beginPath(); pen.moveTo(0, 0);               // a fan: a half round, pleated
    for (var p = 0; p <= 12; p++) { var pa = -Math.PI / 2 - 1.3 + p * 2.6 / 12, pr = p % 2 ? 62 : 74; pen.lineTo(Math.cos(pa) * pr, Math.sin(pa) * pr); }
    pen.closePath();
    hhInk(k % 3 === 0 ? "#3e6a2a" : k % 3 === 1 ? "#4e7a32" : "#5e8a3a", "#203a14", 1.4);
    pen.strokeStyle = "rgba(32, 58, 20, 0.6)"; pen.lineWidth = 1;
    for (p = 0; p <= 12; p += 2) { var qa = -Math.PI / 2 - 1.3 + p * 2.6 / 12; pen.beginPath(); pen.moveTo(0, 0); pen.lineTo(Math.cos(qa) * 66, Math.sin(qa) * 66); pen.stroke(); }
    pen.restore();
  }
  pen.fillStyle = "#3a2a1a";                         // a cluster of dark fruit under the head
  for (k = 0; k < 7; k++) { pen.beginPath(); pen.arc(top[0] - 18 + (k % 4) * 12, top[1] + 18 + Math.floor(k / 4) * 12, 7, 0, 7); pen.fill(); }
  pen.restore();
}

// ---------- the swan hidden ----------
// swanLog(x, base, t): the stone swan folded to look like a log (ซ่อนไว้เหมือนขอน) in the thicket by the orchard: a log
// lying, its bark in lines and its cut end ringed, moss on it, creepers over it, and the red saddle cloth with its gold
// border showing through. (x, base): its middle, on the ground; about 500 long. The owner's pick (C).
function swanLog(x, base, t) {
  var r = hhRandom(74), k;
  pen.save();
  pen.beginPath(); pen.moveTo(x - 240, base - 10); pen.quadraticCurveTo(x - 250, base - 120, x - 210, base - 128);
  pen.lineTo(x + 200, base - 118); pen.quadraticCurveTo(x + 250, base - 70, x + 210, base - 4); pen.closePath();
  hhInk("#7a5a3a", "#3a2614", 2.4);
  pen.strokeStyle = "rgba(40, 26, 14, 0.6)"; pen.lineWidth = 1.6;
  for (k = 0; k < 9; k++) { pen.beginPath(); pen.moveTo(x - 220 + r() * 40, base - 20 - k * 11); pen.quadraticCurveTo(x, base - 26 - k * 11 + r() * 8, x + 200 - r() * 40, base - 16 - k * 11); pen.stroke(); }
  pen.beginPath(); pen.ellipse(x + 214, base - 62, 24, 56, 0, 0, Math.PI * 2); hhInk("#b08a5a", "#3a2614", 2);   // the cut end, ringed
  pen.strokeStyle = "rgba(60, 40, 20, 0.6)"; for (k = 1; k < 4; k++) { pen.beginPath(); pen.ellipse(x + 214, base - 62, 6 * k, 14 * k, 0, 0, 7); pen.stroke(); }
  for (k = 0; k < 90; k++) {                         // moss
    pen.fillStyle = "rgba(" + (70 + r() * 30 | 0) + ", " + (110 + r() * 30 | 0) + ", 46, " + (0.5 + r() * 0.4) + ")";
    pen.beginPath(); pen.ellipse(x - 200 + r() * 380, base - 120 + r() * 50, 8 + r() * 18, 4 + r() * 8, r() * 3, 0, 7); pen.fill();
  }
  pen.beginPath(); pen.moveTo(x - 30, base - 124); pen.lineTo(x + 40, base - 122); pen.lineTo(x + 34, base - 96); pen.lineTo(x - 26, base - 98); pen.closePath();
  hhInk("#a8322a", "#e3b04a", 3);                    // the saddle cloth showing
  pen.strokeStyle = "#3e6a2a"; pen.lineWidth = 3;
  for (k = 0; k < 5; k++) {                          // creepers over it, their leaves stirring
    pen.beginPath(); pen.moveTo(x - 220 + k * 100, base); pen.bezierCurveTo(x - 200 + k * 100, base - 160, x - 120 + k * 100, base - 140, x - 100 + k * 100, base - 20); pen.stroke();
    for (var lf = 0; lf < 4; lf++) {
      pen.beginPath(); pen.ellipse(x - 196 + k * 100 + lf * 22, base - 110 + lf * 14, 9, 5, 0.6 + 0.15 * Math.sin((t || 0) * 1.3 + k + lf), 0, 7);
      hhInk("#4e7a32", "#203a14", 1);
      pen.strokeStyle = "#3e6a2a"; pen.lineWidth = 3;
    }
  }
  pen.restore();
}

// ---------- saba ----------
// sabaBean(x, y): one of the six brothers' gold saba pieces, the bean of the saba vine cast in gold, lying at (x, y) (its
// foot); about 52 wide. redSeed(x, y): a red seed with its black eye (มะกล่ำตาแดง, Abrus), the prince's pieces, at its
// middle; seedPouch(x, base): his mother's pouch of them, its foot at (x, base). The owner's picks (B, the beans).
function sabaBean(x, y) {
  pen.save(); pen.translate(x, y);
  pen.beginPath(); pen.ellipse(0, -18, 26, 18, 0, 0, 7);
  var g = pen.createLinearGradient(-20, -40, 20, 0); g.addColorStop(0, "#f6d47a"); g.addColorStop(1, "#b8862a");
  hhInk(g, "#6e4612", 1.6);
  pen.strokeStyle = "rgba(255, 246, 214, 0.8)"; pen.lineWidth = 2;
  pen.beginPath(); pen.ellipse(-6, -24, 14, 7, 0, 3.4, 5.4); pen.stroke();
  pen.restore();
}
function seedPouch(x, base) {
  pen.beginPath(); pen.moveTo(x - 70, base - 100); pen.quadraticCurveTo(x - 90, base - 10, x, base); pen.quadraticCurveTo(x + 90, base - 10, x + 70, base - 100);
  pen.quadraticCurveTo(x, base - 130, x - 70, base - 100); hhInk("#c8b080", "#5a4a20", 2);
  for (var n = 0; n < 5; n++) { redSeed(x - 40 + n * 20, base - 108 + (n % 2) * 6); }
}

// ---------- the puppy ----------
// puppy(x, y, t, look): the spotted puppy the six wives put in the baby's place: the kit's dog() at three quarters its
// size, tan with dark patches (the owner's pick, B). (x, y): where its feet stand; look: as dog()'s how ({feel}).
function puppy(x, y, t, look) {
  hhOver(function () {
    pen.save(); pen.translate(x, y); pen.scale(0.75, 0.75); dog(0, 0, t, look || {feel: "sad"}); pen.restore();
  }, function (c) {
    var r = hhRandom(9);
    c.fillStyle = "rgba(196, 150, 96, 0.7)";
    c.fillRect(x - 120, y - 140, 240, 150);
    c.fillStyle = "#3a2414";
    for (var k = 0; k < 6; k++) { c.beginPath(); c.ellipse(x - 60 + r() * 120, y - 80 + r() * 50, 6 + r() * 18, 5 + r() * 7, r() * 3, 0, 7); c.fill(); }
  });
}

// ---------- Kanchai ----------
// kanchai(x, y, look): Indra's sword Kanchai, point up, the pommel's foot at (x, y): a flame-edged blade with a glow along
// it, a gold guard and hilt with a red stone, about 490 long at size 1. look: size (1), angle (radians, 0 upright),
// glow (0 to 1; 1). The owner's pick (C). For a hand, put (x, y) at the wrist, divided by PIX.
function kanchai(x, y, look) {
  look = look || {};
  var s = look.size || 1, glow = look.glow === undefined ? 1 : look.glow, k;
  pen.save(); pen.translate(x, y); pen.rotate(look.angle || 0); pen.scale(s, s);
  var gold = pen.createLinearGradient(-10, 0, 10, 0); gold.addColorStop(0, "#f6d47a"); gold.addColorStop(1, "#b8862a");
  if (glow > 0) {                                    // the glow round the divine blade
    pen.strokeStyle = "rgba(255, 236, 160, " + (0.45 * glow) + ")"; pen.lineWidth = 16;
    pen.beginPath(); pen.moveTo(0, -120); pen.lineTo(0, -470); pen.stroke();
  }
  pen.beginPath();                                   // the blade, its edges in flames
  pen.moveTo(-10, -110);
  for (k = 0; k < 7; k++) { pen.quadraticCurveTo(-20, -140 - k * 46, -10, -156 - k * 46); }
  pen.lineTo(0, -480); pen.lineTo(10, -436);
  for (k = 6; k >= 0; k--) { pen.quadraticCurveTo(20, -140 - k * 46, 10, -110 - k * 46); }
  pen.closePath();
  var steel = pen.createLinearGradient(-12, 0, 12, 0); steel.addColorStop(0, "#e8ecf0"); steel.addColorStop(1, "#8a929a");
  hhInk(steel, "#3a4048", 1.6);
  pen.beginPath(); pen.moveTo(-30, -96); pen.quadraticCurveTo(0, -122, 30, -96); pen.lineTo(26, -86); pen.quadraticCurveTo(0, -104, -26, -86); pen.closePath();
  hhInk(gold, "#6e4612", 1.6);                       // the guard
  pen.beginPath(); pen.rect(-8, -88, 16, 80); hhInk(gold, "#3a2410", 1.6);   // the hilt, bound
  pen.strokeStyle = "#8a5a1a"; pen.lineWidth = 2;
  for (k = 0; k < 7; k++) { pen.beginPath(); pen.moveTo(-8, -82 + k * 11); pen.lineTo(8, -78 + k * 11); pen.stroke(); }
  pen.beginPath(); pen.moveTo(-10, -8); pen.quadraticCurveTo(0, 18, 10, -8); pen.closePath(); hhInk(gold, "#6e4612", 1.4);   // the pommel
  pen.fillStyle = "#c8303a"; pen.beginPath(); pen.arc(0, -100, 5, 0, 7); pen.fill();
  pen.restore();
}

// ---------- the floating palaces ----------
// vimana(x, base, t, look): a giant princess's floating palace (วิมานลอย) on a cloud of Thai painting, bobbing, streamers
// flying behind it. look.kind: "prasat", "hall" or "lotus" (the owner, 2026-11-11: one each); size (1: the palace about
// 900 tall, its cloud 900 wide); face (1: the streamers fly to the left, behind it as it goes right); who (for
// "lotus": a function (x, y) drawing the princess seated within, e.g. person(x, y, ogreDaughter("culakantha",
// {floor: "side", size: 0.9}))). (x, base): the palace's foot, on the cloud.
// e.g. vimana(400, 600, t, {kind: "prasat", size: 0.36});
var VIMANA_STREAMERS = {prasat: ["#c8303a", "#e0b23a", "#2e8a6a"], hall: ["#e0b23a", "#c8303a"], lotus: ["#e0b23a", "#c8303a"]};
function vimana(x, base, t, look) {
  look = look || {};
  var kind = look.kind || "prasat", s = look.size || 1, d = -(look.face || 1), bob = 10 * s * Math.sin(t * 0.8 + x * 0.01);
  if (!VIMANA_STREAMERS[kind]) { checkName("The palace's kind", kind, VIMANA_STREAMERS); kind = "prasat"; }
  var y = base + bob, cols = VIMANA_STREAMERS[kind];
  pen.save();
  pen.translate(x, y); pen.scale(s, s); pen.translate(-x, -y);
  cols.forEach(function (c, i) { streamer(x + d * 240, y - 40 + i * 30, 520 - i * 40, 32 - i * 6, c, t, d, i * 1.3); });
  thaiCloud(x, y + 40, 900, t, kind === "hall" ? 5 : kind === "lotus" ? 7 : 3);
  if (kind === "prasat") { vimanaPrasat(x, y, 0.95, t); }
  if (kind === "hall") { vimanaHall(x, y + 30, 0.78, t); }
  if (kind === "lotus") { vimanaLotus(x, y - 50, 0.85, t, look.who); }
  pen.restore();
}
