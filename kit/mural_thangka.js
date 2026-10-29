// The thangka's way of painting, over mural.js and mural_luxe.js (2026-10-29; in the kit 2026-10-30). The owner: "Look at the thangka
// paintings though and really get the style." What the thangka painters do, and how each is drawn here:
//   the ground        cotton sized smooth, not plaster: almost no grain; mineral colours at full strength
//   skin              shaded by fine graded steps from the edge inward, warm red in the shadow; a fine red-brown line
//   silk              covered in gold line work (small flowers and cloud scrolls), shaded in bands along each fold
//   scarves           long scarves of two colours, their lining shown where they twist, looping over the arms and
//                     falling to the ground in curls
//   jewels            gold set with turquoise, coral and ruby: a short collar and a long chain to the waist, swags of
//                     jewel strings across the hips, armlets, bangles, anklets, earrings
//   hair              blue-black, its strands blue
// TH_GROUND, TH_SHADE: the grain's strength and the shading's; muFill reads them.

MU.mute = 0.06;
MU.ink = "#5a2416";
MU.hair = "#141827";
MU.sheen = "#6a80b0";
var TH_GROUND = 0.22;

// A thangka's ground behind a figure: a sky of azurite, deep at the top and paling to the horizon, over green hills,
// with the cloth's faint grain.
function thGround(x, y, w, h) {
  pen.save();
  pen.beginPath(); pen.rect(x, y, w, h); pen.clip();
  var sky = pen.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, "#1c3266"); sky.addColorStop(0.55, "#5f8fb8"); sky.addColorStop(0.75, "#cfe0d6"); sky.addColorStop(0.78, "#7fa86a"); sky.addColorStop(1, "#3f6a3c");
  pen.fillStyle = sky; pen.fillRect(x, y, w, h);
  pen.globalCompositeOperation = "multiply"; pen.globalAlpha = 0.25;
  pen.fillStyle = muPattern(1.2); pen.fillRect(x, y, w, h);
  pen.restore();
}

// Paint, as the thangka paints it: the colour, a breath of the cloth's grain, and the shadow in fine graded steps
// from the edge inward, warm in skin and deep in cloth.
mFill = function (rec, colour, round) {
  var c = muColour(colour);
  pen.fillStyle = c;
  pen.fill(rec.path);
  pen.save();
  pen.clip(rec.path);
  var box = muBox(rec);                             // the grain only over the shape's own box, and none on a small piece
  if ((box[2] - box[0]) * (box[3] - box[1]) > 900) {
    pen.globalCompositeOperation = "multiply";
    pen.globalAlpha = TH_GROUND;
    pen.fillStyle = muPattern(0.5);
    pen.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
    pen.globalCompositeOperation = "source-over";
  }
  if (round !== 0) {
    var w = round || 10, warm = muIsSkin(c);
    var dark = warm ? blend(c, "#a2483a", 0.55) : blend(c, "#140a06", 0.55);
    pen.translate(w * 0.22, w * 0.3);
    pen.strokeStyle = dark;
    pen.lineJoin = "round";
    for (var k = 4; k >= 1; k--) {                  // fine steps, the outer ones faint: a smooth fall of shade to the edge
      pen.globalAlpha = 0.075;
      pen.lineWidth = w * 0.8 * k;
      pen.stroke(rec.path);
    }
  }
  pen.restore();
};
var TH_SKINS = {};
// the box round a path's points: [x0, y0, x1, y1]
function muBox(rec) {
  var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  rec.subs.forEach(function (s) { s.pts.forEach(function (p) { if (p[0] < x0) { x0 = p[0]; } if (p[0] > x1) { x1 = p[0]; } if (p[1] < y0) { y0 = p[1]; } if (p[1] > y1) { y1 = p[1]; } }); });
  return [x0, y0, x1, y1];
}
function muIsSkin(c) { return !!TH_SKINS[c]; }

// ---------- gold line work on silk ----------
// Small flowers and cloud scrolls in gold, scattered over a cloth in a staggered lattice; step: units apart.
function thGoldWork(rec, step, kind) {
  var xs = [], ys = [];
  rec.subs.forEach(function (s) { s.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  pen.save(); pen.clip(rec.path);
  var lines = new MPath(), dots = [], row = 0;
  for (var y = y0 + step / 2; y < y1; y += step * 0.86, row++) {
    for (var x = x0 + (row % 2) * step / 2; x < x1 + step; x += step) {
      var r = step * 0.18;
      if ((row + Math.round(x / step)) % 3 === 0 && kind !== "flowers") {        // a cloud scroll: two curls joined
        lines.M(x - r * 2, y + r * 0.4).C(x - r * 2.2, y - r * 1.4, x - r * 0.4, y - r * 1.4, x - r * 0.5, y - r * 0.2)
             .C(x - r * 0.6, y + r * 0.6, x - r * 1.3, y + r * 0.4, x - r * 1.2, y - r * 0.3);
        lines.M(x - r * 0.5, y - r * 0.2).C(x + r * 0.2, y - r * 1.8, x + r * 2.2, y - r * 1.2, x + r * 1.8, y + r * 0.2)
             .C(x + r * 1.5, y + r * 0.9, x + r * 0.7, y + r * 0.6, x + r, y);
      } else {                                      // a small flower: four petals and a dot
        for (var p = 0; p < 4; p++) {
          var a = p * Math.PI / 2 + 0.4, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
          lines.M(x, y).Q(px + Math.cos(a + 1.2) * r * 0.8, py + Math.sin(a + 1.2) * r * 0.8, px + Math.cos(a) * r * 0.5, py + Math.sin(a) * r * 0.5)
               .Q(px + Math.cos(a - 1.2) * r * 0.8, py + Math.sin(a - 1.2) * r * 0.8, x, y);
        }
        dots.push([x, y]);
      }
    }
  }
  mLine(lines, "#d9aa3e", 0.6);
  dots.forEach(function (d) { muBead(d[0], d[1], 0.8); });
  pen.restore();
}
// Shade a cloth in bands along its folds: each fold a line from a to b, darkest on it and fading either side, and a
// paler ridge beside it, as the thangka shades silk.
function thFolds(rec, colour, folds) {
  pen.save(); pen.clip(rec.path);
  pen.lineCap = "round";
  folds.forEach(function (f) {
    var mx = (f[0] + f[2]) / 2 + (f[4] || 0), my = (f[1] + f[3]) / 2;
    [[16, 0.07], [10, 0.08], [5, 0.1], [2, 0.14]].forEach(function (b) {
      pen.strokeStyle = blend(muColour(colour), "#140a06", 0.6); pen.globalAlpha = b[1]; pen.lineWidth = b[0];
      pen.beginPath(); pen.moveTo(f[0], f[1]); pen.quadraticCurveTo(mx, my, f[2], f[3]); pen.stroke();
      pen.strokeStyle = blend(muColour(colour), "#fff4dc", 0.5); pen.globalAlpha = b[1] * 0.8; pen.lineWidth = b[0] * 0.8;
      pen.beginPath(); pen.moveTo(f[0] + 9, f[1]); pen.quadraticCurveTo(mx + 9, my, f[2] + 9, f[3]); pen.stroke();
    });
  });
  pen.restore();
}

// ---------- the scarf ----------
// A long scarf of two colours along a curve: it twists as it goes ("turns" half-turns), and where its face turns away
// the lining shows; the two faces meet at a point in each twist. at(t) its middle line, wide its half-width.
function thScarf(at, wide, outside, lining, turns, phase) {
  var N = 90, pts = [];
  for (var n = 0; n <= N; n++) {
    var t = n / N, p = at(t), q = at(Math.min(1, t + 0.01)), r = at(Math.max(0, t - 0.01));
    var tx = q[0] - r[0], ty = q[1] - r[1], l = Math.hypot(tx, ty) || 1;
    var h = wide * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.4))) * Math.cos(Math.PI * turns * t + (phase || 0));
    pts.push([p, [-ty / l, tx / l], h]);
  }
  var run = [], face = pts[0][2] >= 0;
  function flush() {
    if (run.length < 2) { return; }
    var left = run.map(function (e) { return [e[0][0] + e[1][0] * e[2], e[0][1] + e[1][1] * e[2]]; });
    var right = run.map(function (e) { return [e[0][0] - e[1][0] * e[2], e[0][1] - e[1][1] * e[2]]; });
    var rec = new MPath().poly(left.concat(right.reverse()), true), colour = face ? outside : lining;
    mFill(rec, colour, 5);
    if (face) { thGoldWork(rec, 16, "flowers"); }
    mBrush(rec, muInk(muColour(colour)), 1.1);
  }
  pts.forEach(function (e) {
    var now = e[2] >= 0;
    if (now !== face && run.length) { var last = run[run.length - 1]; run.push([last[0], last[1], 0]); flush(); run = [[last[0], last[1], 0]]; face = now; }
    run.push(e);
  });
  flush();
}

// ---------- jewels ----------
// A long chain from both sides of the neck down to a pendant at the breast, and on to the waist. out (optional): how
// far each strand first runs out along the shoulder before it falls, [left, right] (a bare neck: it rests on its foot).
function thLongChain(l, r, low, out) {
  var o = out || [2, 2], fall = out ? 8 : 40;
  muBeads(muCurve(l, [l[0] - o[0], l[1] + fall], [low[0] - 10, low[1] - 30], low), 3.4, 1.3);
  muBeads(muCurve(r, [r[0] + o[1], r[1] + fall], [low[0] + 10, low[1] - 30], low), 3.4, 1.3);
  muGold(new MPath().M(low[0], low[1] - 2).C(low[0] + 8, low[1] + 4, low[0] + 6, low[1] + 14, low[0], low[1] + 20).C(low[0] - 6, low[1] + 14, low[0] - 8, low[1] + 4, low[0], low[1] - 2).Z());
  muJewel(low[0], low[1] + 8, 3.4, MU_STONE[1]);
  muBeads(muCurve([low[0], low[1] + 20], [low[0] + 1, low[1] + 30], [low[0], low[1] + 40], [low[0] + 1, low[1] + 48]), 3.4, 1.2);
  muJewel(low[0] + 1, low[1] + 52, 2.2, MU_STONE[0]);
}
// Swags of jewel strings across the hips from the belt, each with a drop at its lowest point.
function thSwags(y, x0, x1, n, sag) {
  for (var k = 0; k < n; k++) {
    var a = x0 + (x1 - x0) * k / n, b = x0 + (x1 - x0) * (k + 1) / n, s = sag * (0.8 + 0.4 * (k % 2));
    muBeads(muCurve([a, y], [a + (b - a) * 0.2, y + s], [a + (b - a) * 0.8, y + s], [b, y]), 3, 1.1);
    var m = [(a + b) / 2, y + s * 0.75];
    muBeads(function (u) { return [m[0], m[1] + 10 * u]; }, 3, 1);
    muJewel(m[0], m[1] + 13, 1.8, MU_STONE[k % 2 ? 1 : 0]);
  }
}
// gold rings and beads round an ankle
function thAnklet(x, y) {
  muBeads(muCurve([x - 10, y], [x - 6, y + 5], [x + 6, y + 5], [x + 10, y]), 2.6, 1.3);
  muGold(new MPath().E(x, y - 2, 10, 2.4));
}
