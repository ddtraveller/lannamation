// tools.js - the tools of the fields, for the Lanna cartoon kit, drawn from photographs of the north's: the hoe (จก,
// chok), the digging spade (เสียม, siam), the sickle (เคียว, khiao), and the ripe rice the sickle cuts. Load it after
// oldcartoon.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="tools.js"></script>
//
// Each is a painter on a brush. The hoe and the spade are drawn along a line of the scene, so a person holds one by
// sending the wrists to points on its handle (look.reachA, reachB, grip: true), as the swords of Chang Ngu are. A
// bent arm may stop short of the point it is sent to: draw a tool held in one hand (the sickle) at the joints person()
// gives back (joints.wristA, handA), not at the point it was sent to. The owner's pick, 2026-10-26 ("Into the kit").
// Lao Chok is named for his hoe (ปู่เจ้าลาวจก); Ngam Mueang dug after Phra Ruang with a spade (the Ngoen Yang chronicle).

function toolWood(brush, ax, ay, bx, by, wide, colour) {   // a wooden handle from (ax, ay) to (bx, by)
  brush.lineCap = "round";
  brush.strokeStyle = blend(colour, "#1a1008", 0.55); brush.lineWidth = wide + 2.4;
  brush.beginPath(); brush.moveTo(ax, ay); brush.lineTo(bx, by); brush.stroke();
  brush.strokeStyle = colour; brush.lineWidth = wide;
  brush.beginPath(); brush.moveTo(ax, ay); brush.lineTo(bx, by); brush.stroke();
  brush.strokeStyle = "rgba(255, 240, 210, 0.35)"; brush.lineWidth = wide * 0.3;   // the grain's light along it
  brush.beginPath(); brush.moveTo(ax, ay - wide * 0.2); brush.lineTo(bx, by - wide * 0.2); brush.stroke();
}
function toolIron(brush, points, colour) {           // a piece of forged iron: dark, its edge ground bright
  brush.beginPath();
  points.forEach(function (p, k) { if (k) { brush.lineTo(p[0], p[1]); } else { brush.moveTo(p[0], p[1]); } });
  brush.closePath();
  brush.fillStyle = colour || "#4a4644"; brush.fill();
  brush.strokeStyle = "#1a1818"; brush.lineWidth = 1.6; brush.stroke();
}

// chok(brush, ax, ay, bx, by, size): the hoe, its handle from the end (ax, ay) to the head (bx, by), the blade at a
// right angle to it, forward: a long straight handle of hard wood about 1.2 m, an iron eye round its head, a blade
// as long as a forearm, narrow and squared at its edge (the north's hoe for breaking ground on a slope).
function chok(brush, ax, ay, bx, by, size, side) {
  side = side || 1;
  var dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy * side, ny = ux * side;
  toolWood(brush, ax, ay, bx + ux * 6 * size, by + uy * 6 * size, 7 * size, "#9a7044");
  var e0 = [bx - ux * 10 * size, by - uy * 10 * size], e1 = [bx + ux * 8 * size, by + uy * 8 * size], blade = 52 * size;
  toolIron(brush, [[e0[0] - nx * 6 * size, e0[1] - ny * 6 * size], [e1[0] - nx * 6 * size, e1[1] - ny * 6 * size],   // the eye, and the blade out of it
                   [e1[0] + nx * blade, e1[1] + ny * blade], [e0[0] + nx * blade * 0.96, e0[1] + ny * blade * 0.96]]);
  brush.strokeStyle = "#b8b4ae"; brush.lineWidth = 2.4;   // the bright ground edge
  brush.beginPath(); brush.moveTo(e1[0] + nx * blade, e1[1] + ny * blade); brush.lineTo(e0[0] + nx * blade * 0.96, e0[1] + ny * blade * 0.96); brush.stroke();
}

// siam(brush, ax, ay, bx, by, size): the digging spade, its handle from the end (ax, ay) down to the blade at (bx, by):
// a long round handle, a narrow flat iron blade in line with it, a little wider at its edge, for digging holes for
// posts and roots out of the ground.
function siam(brush, ax, ay, bx, by, size) {
  var dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  toolWood(brush, ax, ay, bx, by, 6.5 * size, "#a87a48");
  var blade = 46 * size, w0 = 6 * size, w1 = 11 * size;
  toolIron(brush, [[bx - nx * w0, by - ny * w0], [bx + nx * w0, by + ny * w0], [bx + ux * blade + nx * w1, by + uy * blade + ny * w1],
                   [bx + ux * blade - nx * w1, by + uy * blade - ny * w1]]);
  brush.strokeStyle = "#b8b4ae"; brush.lineWidth = 2.2;
  brush.beginPath(); brush.moveTo(bx + ux * blade + nx * w1, by + uy * blade + ny * w1); brush.lineTo(bx + ux * blade - nx * w1, by + uy * blade - ny * w1); brush.stroke();
}

// khiao(brush, x, y, angle, size): the sickle, its handle's end at (x, y) running at angle (radians): a short wooden
// handle and a thin blade curving round like a new moon, its inner edge toothed, for cutting rice by the handful.
function khiao(brush, x, y, angle, size) {
  brush.save();
  brush.translate(x, y); brush.rotate(angle); brush.scale(size, size);
  toolWood(brush, 0, 0, 34, 0, 7, "#9a7044");
  brush.beginPath();                                // the blade: a crescent from the handle's end, curving back
  brush.moveTo(32, -3); brush.quadraticCurveTo(70, -6, 78, -36); brush.quadraticCurveTo(80, -58, 62, -66);
  brush.quadraticCurveTo(72, -50, 64, -30); brush.quadraticCurveTo(54, -10, 32, 3); brush.closePath();
  brush.fillStyle = "#5a5652"; brush.fill(); brush.strokeStyle = "#1a1818"; brush.lineWidth = 1.4; brush.stroke();
  brush.strokeStyle = "#c8c4be"; brush.lineWidth = 1;   // the toothed inner edge, bright
  brush.beginPath(); brush.moveTo(62, -64); brush.quadraticCurveTo(72, -50, 64, -30); brush.quadraticCurveTo(54, -10, 34, 2); brush.stroke();
  brush.restore();
}

// riceClump(brush, x, base, size, t, look): a clump of ripe rice as it stands in the paddy, drawn from photographs:
// a dozen stalks from one root, uneven, leaning a little each its own way, long thin leaves curving out from them,
// and at each tip a head of gold grain that droops on its stalk; the clump stirs in the breeze. look.gather: [x, y],
// the stalks drawn in to a hand there (a reaper holding a handful); look.cut: the stalks cut off below the hand, the
// handful lifted with it (the stubble left standing). Returns nothing.
function riceClump(brush, x, base, size, t, look) {
  look = look || {};
  var n = 12, sway = 6 * Math.sin(t * 1.3 + x * 0.01);
  brush.lineCap = "round";
  for (var k = 0; k < n; k++) {                     // the leaves first, behind the stalks
    var lu = (k - n / 2) / n, lh = (70 + 30 * dice(x + k * 3.1)) * size;
    brush.strokeStyle = "#5a7a2a"; brush.lineWidth = 2.2 * size;
    brush.beginPath(); brush.moveTo(x + k * 2 * size, base);
    brush.quadraticCurveTo(x + lu * 40 * size, base - lh * 0.7, x + lu * 110 * size + sway, base - lh);
    brush.stroke();
  }
  for (k = 0; k < n; k++) {
    var u = (k - n / 2) / n, h = (130 + 40 * dice(x + k * 1.7)) * size, root = [x + (k - n / 2) * 2.5 * size, base];
    var tip = [x + u * 70 * size + sway * (0.6 + dice(k)), base - h];
    if (look.gather) { tip = [mix(tip[0], look.gather[0], 0.85), mix(tip[1], look.gather[1], 0.6)]; }
    var cutAt = look.cut ? base - 26 * size : null;
    brush.strokeStyle = "#8a9a3a"; brush.lineWidth = 2 * size;   // the stalk, yellowing as it ripens
    brush.beginPath();
    if (cutAt) { brush.moveTo(root[0], root[1]); brush.lineTo(mix(root[0], tip[0], 0.15), cutAt); brush.stroke(); continue; }   // stubble
    brush.moveTo(root[0], root[1]);
    brush.quadraticCurveTo(mix(root[0], tip[0], 0.3), mix(root[1], tip[1], 0.6), tip[0], tip[1]);
    brush.stroke();
    var droop = 0.9 + 0.5 * dice(k * 2.3);           // the head of grain, drooping from the tip, its grains along it
    brush.strokeStyle = "#c8a238"; brush.lineWidth = 1.6 * size;
    brush.beginPath(); brush.moveTo(tip[0], tip[1]);
    var hx = tip[0] + Math.cos(-0.6 + droop) * 30 * size * (u < 0 ? -1 : 1), hy = tip[1] + Math.sin(-0.6 + droop) * 30 * size;
    brush.quadraticCurveTo(tip[0] + (hx - tip[0]) * 0.4, tip[1] - 10 * size, hx, hy);
    brush.stroke();
    for (var g = 1; g <= 6; g++) {
      var gu = g / 6, gx = mix(tip[0], hx, gu), gy = mix(tip[1], hy, gu) - 8 * size * Math.sin(gu * Math.PI) * (1 - gu);
      oval(gx, gy, 2.2 * size, 3.2 * size, "#e0b848");
    }
  }
}
