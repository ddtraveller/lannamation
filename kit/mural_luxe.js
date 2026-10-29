// Gold, silver, jewels and silk for the mural figure (2026-10-29; in the kit 2026-10-30). The owner, with four more
// references (a Royal Thai Art thewada in a gold frame, the dancer, women in silk sabai and gold): "Look how rich these
// images are in terms of the detail. Keep going farther in making them detailed and really luxurious and beautiful."
// Over mural.js: every piece here is drawn in that file's units (a head is 100) and with its line and grain.
// The jewellery matches the outfit (owner, 2026-10-30: "There should be a jewelry function that similarly matches
// jewelry for the outfit"; of the ways offered, "metal and stones"): muJewels() picks the metal and two stones from
// what a person wears, muDress() puts them on, and every piece of jewellery here (muGold, muBead, muJewel) is drawn in
// them. The gold thread woven into cloth (brocade, tassels, the foot of a sin) stays gold: it is the cloth's.

// ---------- the metal and the stones ----------
// The metals: the five steps of a piece's light from the lit side to the turned-away side and back (the fourth the
// deep one), a bead's three, the fine line round a piece, the ticks between a belt's plates, and one flat colour.
var MU_METALS = {
  gold:   {light: ["#fbe8a6", "#e4b54c", "#b98226", "#9a6418", "#d9a640", "#f2d27a"], bead: ["#fff4c8", "#e2b04a", "#8a5a16"],
           line: "#5a3410", tick: "#6a4012", base: "#d4a63a"},
  silver: {light: ["#ffffff", "#d8dade", "#9ea2aa", "#80848c", "#c6c9ce", "#eef0f2"], bead: ["#ffffff", "#c8cbd0", "#6c7078"],
           line: "#3a3e46", tick: "#4a4e56", base: "#c6c9ce"}
};
// The stones: a stone for each colour of cloth (its hue, the colour it is).
var MU_GEMS = {ruby: "#b0202a", garnet: "#7a1a3a", carnelian: "#c0461e", amber: "#d08a1a", emerald: "#1f6a4a", jade: "#4a8a5a",
               turquoise: "#2aa39a", sapphire: "#2a4a9a", amethyst: "#6a3a8a", tourmaline: "#c8487a"};
var MU_METAL = MU_METALS.gold, MU_STONE = [MU_GEMS.ruby, MU_GEMS.emerald];    // what is being worn, while a person is drawn
// The jewellery that goes with what a person wears:
//   metal   gold with finery: a dancer's, a celestial's, regalia, or clothes with gold in them (a gold border, a gold
//           sin); silver, the north's own silverwork, with everyday clothes, plain or dark or indigo
//   stones  the first stone the stone nearest the colour of her clothes (the first strong colour, nearest the face
//           first: muClothes); the second its partner: turquoise with coral, brick and orange, emerald with the other
//           reds and pinks, ruby with blue, indigo, green and purple; ruby and emerald with clothes of no colour
// look.jewels ("gold" or "silver") and look.stones (two CSS colours) choose instead.
// look: the person's look. Returns {metal: "gold" or "silver", stones: [colour, colour]}.
// e.g. muJewels(cast("sinuan"))   // {metal: "silver", stones: [carnelian, turquoise]}
function muJewels(look) {
  var clothes = typeof muClothes === "function" ? muClothes(look) : [], hues = clothes.map(muHue);
  var golden = hues.some(function (h) { return h && h[0] >= 35 && h[0] <= 60 && h[1] >= 0.4 && h[2] >= 0.35 && h[2] <= 0.8; });
  var metal = look.jewels || (look.dance || look.halo || look.regalia || golden ? "gold" : "silver");
  if (look.stones) { return {metal: metal, stones: look.stones}; }
  var main = null;
  for (var i = 0; i < hues.length && !main; i++) {
    var h = hues[i];
    if (h && h[1] >= 0.25 && h[2] >= 0.2 && h[2] <= 0.85 && !(h[0] >= 35 && h[0] <= 60)) { main = h; }
  }
  if (!main) { return {metal: metal, stones: [MU_GEMS.ruby, MU_GEMS.emerald]}; }
  var best = null, gap = 999;
  for (var name in MU_GEMS) {                        // the stone nearest her colour, round the colour wheel
    var g = muHue(MU_GEMS[name]), d = Math.abs(g[0] - main[0]);
    d = Math.min(d, 360 - d) + 40 * Math.abs(g[2] - main[2]);
    if (d < gap) { gap = d; best = name; }
  }
  var warm = main[0] < 60 || main[0] >= 290;
  var partner = !warm ? "ruby" : main[0] >= 10 && main[0] < 35 ? "turquoise" : "emerald";
  if (partner === best) { partner = warm ? "turquoise" : "amber"; }
  return {metal: metal, stones: [MU_GEMS[best], MU_GEMS[partner]]};
}
// Put on a person's jewellery (muJewels) before she is drawn: muralPerson() does; a page drawing a head alone
// (muHead) does it first. look: the person's look. Returns what muJewels gave. e.g. muDress(cast("buakham"))
function muDress(look) {
  var j = muJewels(look);
  MU_METAL = MU_METALS[j.metal] || MU_METALS.gold;
  MU_STONE = j.stones;
  return j;
}
// draw() with gold for the metal, whatever the person wears: the gold thread of a cloth
function muInGold(draw) {
  var was = MU_METAL;
  MU_METAL = MU_METALS.gold;
  try { draw(); } finally { MU_METAL = was; }
}

// ---------- the metal ----------
// Metal reads as metal by its light: pale where it faces the light, deep (amber in gold) where it turns away, a fine
// dark line. In the metal being worn (MU_METAL).
function muGold(rec, deep) {
  var xs = [], ys = [];
  rec.subs.forEach(function (s) { s.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  var g = pen.createLinearGradient(x0, y0, x1 + (y1 - y0) * 0.3, y1);
  var L = MU_METAL.light;
  g.addColorStop(0, L[0]); g.addColorStop(0.3, L[1]); g.addColorStop(0.62, deep ? L[3] : L[2]); g.addColorStop(0.85, L[4]); g.addColorStop(1, L[5]);
  pen.fillStyle = g;
  pen.fill(rec.path);
  if ((x1 - x0) * (y1 - y0) > 900) {                // the grain only on a large piece of gold
    pen.save(); pen.clip(rec.path);
    pen.globalCompositeOperation = "multiply"; pen.globalAlpha = 0.35;
    pen.fillStyle = muPattern(0.3); pen.fillRect(x0 - 5, y0 - 5, x1 - x0 + 10, y1 - y0 + 10);
    pen.restore();
  }
  mBrush(rec, MU_METAL.line, 0.75);
}
// a bead of the metal: its light a point near the top
function muBead(x, y, r) {
  var g = pen.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, MU_METAL.bead[0]); g.addColorStop(0.35, MU_METAL.bead[1]); g.addColorStop(1, MU_METAL.bead[2]);
  pen.fillStyle = g;
  pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill();
}
// a jewel: a deep colour with a spark
function muJewel(x, y, r, colour) {
  muGold(new MPath().E(x, y, r * 1.45, r * 1.45));
  var g = pen.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, blend(colour, "#ffffff", 0.6)); g.addColorStop(0.5, colour); g.addColorStop(1, blend(colour, "#000000", 0.5));
  pen.fillStyle = g; pen.beginPath(); pen.arc(x, y, r, 0, 7); pen.fill();
  pen.fillStyle = "rgba(255, 255, 255, 0.85)"; pen.beginPath(); pen.arc(x - r * 0.35, y - r * 0.35, r * 0.22, 0, 7); pen.fill();
}
// beads along a curve: at(t) for t 0 to 1, every "step" units
function muBeads(at, step, r) {
  var len = 0, prev = at(0), N = 80, k, marks = [];
  for (k = 1; k <= N; k++) { var p = at(k / N); len += Math.hypot(p[0] - prev[0], p[1] - prev[1]); marks.push([len, p]); prev = p; }
  for (var d = 0, i = 0; d <= len; d += step) { while (i < marks.length - 1 && marks[i][0] < d) { i++; } muBead(marks[i][1][0], marks[i][1][1], r); }
}
function muCurve(a, c1, c2, b) {
  return function (t) { var u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]]; };
}
// the flame of a kranok: a point that rises from a base and curls over at its tip; way 1 curls right, -1 left
function muFlame(x, y, h, w, way, turn) {
  pen.save(); pen.translate(x, y); pen.rotate(turn || 0); pen.scale(way || 1, 1);
  var f = new MPath().M(-w, 0).C(-w * 0.9, -h * 0.45, -w * 0.2, -h * 0.75, w * 0.35, -h).C(w * 0.1, -h * 0.75, w * 0.55, -h * 0.55, w * 0.4, -h * 0.4).C(w * 0.9, -h * 0.3, w, -h * 0.1, w, 0).Z();
  muGold(f);
  pen.restore();
}
// a small gold flower: petals round a jewel
function muGoldFlower(x, y, r, jewel) {
  for (var k = 0; k < 6; k++) {
    var a = k / 6 * Math.PI * 2;
    muGold(new MPath().E(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5, r * 0.3, a));
  }
  muJewel(x, y, r * 0.3, jewel || MU_STONE[0]);
}

// ---------- jewellery ----------
// The bun dressed: a ring of gold flowers round its front, a pin, and strands of gold beads hanging from it, swaying.
function muBunGold(x, y, r, swayAt) {
  for (var k = 0; k < 7; k++) {
    var a = -Math.PI * 0.95 + k / 6 * Math.PI * 0.95;
    muGoldFlower(x + Math.cos(a) * r * 1.05, y + Math.sin(a) * r * 0.95, 5.2, MU_STONE[k % 2 ? 0 : 1]);
  }
  [-1, 0, 1].forEach(function (s, i) {
    var sway = Math.sin(clock * 1.6 + i) * 3 + (swayAt || 0), long = 52 + i * 14, top = [x - r * 0.4 + s * 5, y + r * 0.7];
    var at = muCurve(top, [top[0] - 4, top[1] + long * 0.3], [top[0] - 8 + sway, top[1] + long * 0.7], [top[0] - 6 + sway * 1.6, top[1] + long]);
    muBeads(at, 3.6, 1.6);
    var end = at(1);
    muGold(new MPath().M(end[0] - 3, end[1] + 1).Q(end[0], end[1] + 12, end[0] + 3, end[1] + 1).Q(end[0], end[1] - 2, end[0] - 3, end[1] + 1).Z());   // a gold leaf at the end
  });
}
// a drop earring: the stud, three beads, a jewelled drop with a kranok point under it
function muEarring(x, y) {
  muJewel(x, y, 2.6, MU_STONE[0]);
  var sway = Math.sin(clock * 2.1) * 1.2;
  muBead(x + sway * 0.3, y + 6, 1.5); muBead(x + sway * 0.6, y + 9.5, 1.5);
  var dx = x + sway, dy = y + 13;
  muGold(new MPath().M(dx, dy).C(dx + 6, dy + 4, dx + 5, dy + 12, dx, dy + 17).C(dx - 5, dy + 12, dx - 6, dy + 4, dx, dy).Z());
  muJewel(dx, dy + 8, 2, MU_STONE[1]);
}
// a collar of gold in tiers, round the base of the neck, with points hanging from it and a pendant
function muCollar(cx, cy, half, drop) {
  var outer = new MPath().M(cx - half, cy).C(cx - half * 0.6, cy + drop, cx + half * 0.6, cy + drop, cx + half, cy)
    .L(cx + half - 3, cy - 4).C(cx + half * 0.55, cy + drop - 7, cx - half * 0.55, cy + drop - 7, cx - half + 3, cy - 4).Z();
  var edge = muCurve([cx - half, cy], [cx - half * 0.6, cy + drop], [cx + half * 0.6, cy + drop], [cx + half, cy]);
  for (var k = 1; k < 12; k++) {                     // the points, hanging from the lower edge
    var p = edge(k / 12), q = edge(k / 12 + 0.01), a = Math.atan2(q[1] - p[1], q[0] - p[0]);
    muFlame(p[0], p[1], 6 + (k % 2) * 2, 2.2, 1, a + Math.PI / 2 + Math.PI);
  }
  muGold(outer);
  muBeads(muCurve([cx - half + 2, cy - 2], [cx - half * 0.6, cy + drop - 4], [cx + half * 0.6, cy + drop - 4], [cx + half - 2, cy - 2]), 3.2, 1.1);
  var m = edge(0.5);
  muGold(new MPath().M(m[0], m[1] - 2).C(m[0] + 7, m[1] + 4, m[0] + 5, m[1] + 13, m[0], m[1] + 18).C(m[0] - 5, m[1] + 13, m[0] - 7, m[1] + 4, m[0], m[1] - 2).Z());
  muJewel(m[0], m[1] + 7, 2.8, MU_STONE[0]);
}
// an armlet round the upper arm: a band of gold with a flame rising from it; at(t) the arm's middle line, wide its
// half-width there
function muArmlet(at, t, wide) {
  var p = at(t), q = at(t + 0.01), a = Math.atan2(q[1] - p[1], q[0] - p[0]);
  pen.save(); pen.translate(p[0], p[1]); pen.rotate(a - Math.PI / 2);
  muFlame(0, -2, 13, 4.5, 1, Math.PI);
  muGold(new MPath().M(-wide - 1, -3).Q(0, 1, wide + 1, -3).L(wide + 1, 3).Q(0, 7, -wide - 1, 3).Z());
  muJewel(0, 2, 2, MU_STONE[1]);
  pen.restore();
}
// the belt: a band of gold plates round the waist and its buckle, a jewelled lozenge edged with flames
function muBelt(y, x0, x1, buckleX) {
  var band = new MPath().M(x0, y - 5).Q((x0 + x1) / 2, y + 2, x1, y - 5).L(x1, y + 5).Q((x0 + x1) / 2, y + 12, x0, y + 5).Z();
  muGold(band);
  var ticks = new MPath();
  for (var x = x0 + 6; x < x1; x += 7) { var yy = y + 3.5 * (1 - Math.pow((x - (x0 + x1) / 2) / ((x1 - x0) / 2), 2)); ticks.M(x, yy - 4).L(x, yy + 4); }
  mLine(ticks, MU_METAL.tick, 0.7);
  var by = y + 3;
  [[-1, 0], [1, 0]].forEach(function (s) { muFlame(buckleX + s[0] * 13, by, 8, 3, s[0], s[0] * Math.PI / 2); });
  muGold(new MPath().M(buckleX - 13, by).Q(buckleX - 6, by - 11, buckleX, by - 12).Q(buckleX + 6, by - 11, buckleX + 13, by).Q(buckleX + 6, by + 11, buckleX, by + 12).Q(buckleX - 6, by + 11, buckleX - 13, by).Z(), true);
  muJewel(buckleX, by, 4.2, MU_STONE[0]);
  [-7, 7].forEach(function (dx) { muJewel(buckleX + dx, by, 1.6, MU_STONE[1]); });
}
// bangles: gold rings at the wrist, each with its light
function muBangles(at, from, n, wide) {
  for (var k = 0; k < n; k++) {
    var b = at(from - k * 0.022), c = at(from - k * 0.022 + 0.01), ang = Math.atan2(c[1] - b[1], c[0] - b[0]);
    muGold(new MPath().E(b[0], b[1], 2, wide + 2.4, ang));
  }
}

// ---------- silk ----------
// Silk's sheen: soft long lights where the cloth turns to the light, and the fine pleats of a draped cloth, inside a
// shape. lines: [[x0, y0, x1, y1] ...] the pleats; lights: the same, for the sheen.
function muSilk(rec, colour, pleats, lights) {
  pen.save(); pen.clip(rec.path);
  lights.forEach(function (l) {
    pen.strokeStyle = blend(muColour(colour), "#fff6e6", 0.55);
    pen.lineCap = "round";
    [[14, 0.08], [8, 0.1], [3, 0.14]].forEach(function (b) {
      pen.globalAlpha = b[1]; pen.lineWidth = b[0];
      pen.beginPath(); pen.moveTo(l[0], l[1]); pen.quadraticCurveTo((l[0] + l[2]) / 2 + 4, (l[1] + l[3]) / 2, l[2], l[3]); pen.stroke();
    });
  });
  pen.globalAlpha = 1;
  var p = new MPath();
  pleats.forEach(function (l) { p.M(l[0], l[1]).Q((l[0] + l[2]) / 2 + 3, (l[1] + l[3]) / 2, l[2], l[3]); });
  mLine(p, muShade(muColour(colour)), 0.8);
  pen.restore();
}
// a brocade border along a curve: a band of gold thread with small lozenges in the cloth's colour
function muBrocade(at, wide, colour) { muInGold(function () { muBrocadeGold(at, wide, colour); }); }
function muBrocadeGold(at, wide, colour) {
  var N = 60, left = [], right = [];
  for (var k = 0; k <= N; k++) {
    var p = at(k / N), q = at(Math.min(1, k / N + 0.01)), r = at(Math.max(0, k / N - 0.01)), tx = q[0] - r[0], ty = q[1] - r[1], l = Math.hypot(tx, ty) || 1;
    left.push([p[0] - ty / l * wide, p[1] + tx / l * wide]); right.push([p[0] + ty / l * wide, p[1] - tx / l * wide]);
  }
  muGold(new MPath().poly(left.concat(right.reverse()), true));
  for (k = 2; k < N; k += 3) {
    var c = at(k / N), d = at(k / N + 0.01), a = Math.atan2(d[1] - c[1], d[0] - c[0]);
    pen.save(); pen.translate(c[0], c[1]); pen.rotate(a);
    pen.fillStyle = muColour(colour);
    pen.beginPath(); pen.moveTo(-2.4, 0); pen.lineTo(0, -wide * 0.6); pen.lineTo(2.4, 0); pen.lineTo(0, wide * 0.6); pen.closePath(); pen.fill();
    pen.restore();
  }
}
// gold tassels hanging from an edge, every "step" along at(t)
function muTassels(at, step, long) { muInGold(function () { muTasselsGold(at, step, long); }); }
function muTasselsGold(at, step, long) {
  for (var t = 0.05; t <= 0.96; t += step) {
    var p = at(t), sway = Math.sin(clock * 1.4 + t * 9) * 1.5;
    muBeads(function (u) { return [p[0] + sway * u, p[1] + long * u]; }, 3, 1.1);
    muGold(new MPath().M(p[0] + sway - 2, p[1] + long).L(p[0] + sway + 2, p[1] + long).L(p[0] + sway + 1, p[1] + long + 7).L(p[0] + sway - 1, p[1] + long + 7).Z());
  }
}
// The tin jok, the woven foot of a sin: a broad band of gold thread holding rows of lozenges and hooks in red, green
// and the cloth's dark, between borders of small teeth.
function muTinJok(y0, y1, x0, x1, ground) { muInGold(function () { muTinJokGold(y0, y1, x0, x1, ground); }); }
function muTinJokGold(y0, y1, x0, x1, ground) {
  var h = y1 - y0;
  var band = new MPath().M(x0, y0).L(x1, y0).L(x1, y1).L(x0, y1).Z();
  muGold(band);
  pen.save(); pen.clip(band.path);
  var teeth = new Path2D();
  for (var x = x0; x < x1; x += 5) { teeth.moveTo(x, y0 + 4); teeth.lineTo(x + 2.5, y0 + 9); teeth.lineTo(x + 5, y0 + 4); teeth.moveTo(x, y1 - 4); teeth.lineTo(x + 2.5, y1 - 9); teeth.lineTo(x + 5, y1 - 4); }
  pen.strokeStyle = muColour(ground); pen.lineWidth = 1.4; pen.stroke(teeth);
  var mid = (y0 + y1) / 2, s = (h - 22) / 2, k = 0;
  for (x = x0 - s; x < x1 + s; x += s * 2, k++) {
    var loz = new Path2D();
    loz.moveTo(x - s, mid); loz.lineTo(x, mid - s); loz.lineTo(x + s, mid); loz.lineTo(x, mid + s); loz.closePath();
    pen.fillStyle = muColour(k % 2 ? "#8a1e26" : "#1f5a40"); pen.fill(loz);
    pen.strokeStyle = "#4a2a0c"; pen.lineWidth = 0.8; pen.stroke(loz);
    var inner = new Path2D();
    inner.moveTo(x - s * 0.5, mid); inner.lineTo(x, mid - s * 0.5); inner.lineTo(x + s * 0.5, mid); inner.lineTo(x, mid + s * 0.5); inner.closePath();
    pen.fillStyle = "#e9c25a"; pen.fill(inner);
    pen.fillStyle = muColour(ground); pen.beginPath(); pen.arc(x, mid, s * 0.16, 0, 7); pen.fill();
    var hooks = new Path2D();                       // the hooks between the lozenges, curling up and down
    hooks.moveTo(x + s, mid); hooks.quadraticCurveTo(x + s * 1.3, mid - s * 0.9, x + s * 1.05, mid - s * 0.7);
    hooks.moveTo(x + s, mid); hooks.quadraticCurveTo(x + s * 1.3, mid + s * 0.9, x + s * 1.05, mid + s * 0.7);
    pen.strokeStyle = muColour(ground); pen.lineWidth = 1.6; pen.stroke(hooks);
  }
  pen.restore();
}
// the woven figure over the body of a sin: a lattice of small diamonds in a paler and a deeper tone of its colour
function muSinFigure(rec, colour, y0, y1, x0, x1) {
  pen.save(); pen.clip(rec.path);
  var pale = muColour(blend(colour, "#f3e2b0", 0.35)), deep = muColour(blend(colour, "#120a08", 0.35)), row = 0;
  for (var y = y0; y < y1; y += 9, row++) {
    for (var x = x0 + (row % 2) * 5; x < x1; x += 10) {
      pen.fillStyle = row % 3 ? deep : pale;
      pen.beginPath(); pen.moveTo(x, y - 2.6); pen.lineTo(x + 2.6, y); pen.lineTo(x, y + 2.6); pen.lineTo(x - 2.6, y); pen.closePath(); pen.fill();
    }
  }
  pen.restore();
}
