// ogre.js - a living ogre (ยักษ์), for the Lanna cartoon kit: the ogres of the tales (Hong Hin's three ogre kings, the
// jataka tales' ogres of the forest). Load it after oldcartoon.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="ogre.js"></script>
//
// An ogre is a person's body at a giant's size, in a skin of its own, with an ogre's head drawn over the person's head,
// at the place and the size person() gives back (joints.crown, joints.chin). The owner's pick, 2026-10-26, all three:
//   "mural"   the murals' green yaksha, the gold spire crown (ชฎา) and the flames at the ears: the kit's temple-gate
//             yak() alive
//   "forest"  a forest ogre: dark blue-grey, wild hair, tusks, no crown
//   "king"    a red ogre king, crowned and in gold
// And for the tale of Hong Hin (2026-11-11, the owner's picks): the ghouls (ยักษ์ผีดิบ) "ghoul" (grey-green, wild black
// hair, yellow eyes), "ghoulPale" (bone-pale, white matted hair, stooped) and "ghoulDark" (dark, bone beads, orange
// eyes), one horde; and the old giantess under the palm, "giantess" (red, white hair, an old woman's blouse and sin).
// Their meat is ogreMeat(); the three giant kings' daughters are ogreDaughter() (people.js).
// Its face: round white eyes that bulge and roll, a ring round each, thick curled brows, a broad nose, a mouth the
// width of the face with a row of teeth and a fang rising from each corner, big ears with gold rings.
//   ogre(x, y, t, look)        draws the whole ogre and gives back the person's joints; look: kind (one of OGRES), and
//                              any of person()'s keys (size, face, step, at, feel, reachA...), which win over the
//                              kind's own
//   ogreHead(j, kind, face, t) the head alone, over a person drawn by the scene (j what person() gave back)

var OGRES = {
  mural:  {skin: "#2f7f4e", dark: "#1a4a2e", crown: "spire", hair: null, eye: "#3a5fae"},
  forest: {skin: "#4a5a6a", dark: "#2a323c", crown: null, hair: "#1a1a1e", eye: "#c8302a"},
  king:   {skin: "#c8452f", dark: "#7a2414", crown: "spire", hair: null, eye: "#2a8a4a"},
  // Hong Hin's ghouls (ยักษ์ผีดิบ), the ogres of the forest who eat their meat raw: one horde of three kinds (the owner's
  // pick, 2026-11-11, all three)
  ghoul:     {skin: "#7d8a6a", dark: "#3e4a34", crown: null, hair: "#2a2620", eye: "#d8c040", yaksha: true},
  ghoulPale: {skin: "#cfc6b4", dark: "#8a8070", crown: null, hair: "#e6e0d4", eye: "#c8302a", yaksha: true},
  ghoulDark: {skin: "#4a3230", dark: "#241614", crown: null, hair: "#151010", eye: "#e8862a", yaksha: true},
  // the old giantess under the palm at Varanasi's south gate (ย่ายักษ์เถ้า), red, her hair white (the owner's pick, C)
  giantess:  {skin: "#a8452f", dark: "#5a2414", crown: null, hair: "#e8e3da", eye: "#2a8a4a", long: true,
              statue: true, band: "#e07a28", flowerSide: 0, collar: "#e07a28", tusk: 0.9},
  // the guests at Wassawaro's feast (the owner, 2026-11-13: "make sure the giants are unique at the feast and not the
  // ones he will visit in the next 2 scenes"): giants of the court, each its own skin, a beaded band, no crown
  violet:    {skin: "#7a4a8a", dark: "#3a1e48", crown: null, hair: "#1a1020", eye: "#e0b23a", statue: true, band: "#e0b23a",
              flowerSide: 1, collar: "#e0b23a"},
  ochre:     {skin: "#c8902a", dark: "#6a4410", crown: null, hair: "#2a1a0c", eye: "#2a6a8a", statue: true, band: "#b8282e",
              flowerSide: 0, collar: "#b8282e"},
  teal:      {skin: "#2f7a7a", dark: "#144040", crown: null, hair: "#0c1a1a", eye: "#e8862a", statue: true, band: "#e07a28",
              flowerSide: 1, collar: "#e07a28"},
  ash:       {skin: "#5a5650", dark: "#2a2824", crown: null, hair: "#e6e0d4", eye: "#c8302a", statue: true, band: "#d8a63c",
              flowerSide: 0, collar: "#d8a63c", tusk: 1.15}
};
// The giant kings after the owner's reference statue too (2026-11-13): its face, a beaded collar and an arm band.
["mural", "forest", "king"].forEach(function (k) { Object.assign(OGRES[k], {statue: true, collar: "#e0a030"}); });

function ogFill(fill, ink, width) { pen.fillStyle = fill; pen.fill(); pen.strokeStyle = ink; pen.lineWidth = width || 2; pen.stroke(); }
// A glint of light on gold: a four-pointed star at (x, y), r long, alpha 0 to 1.
function ogGlint(x, y, r, alpha) {
  if (r < 0.5 || alpha <= 0) { return; }
  pen.save();
  pen.globalAlpha *= alpha;
  var g = pen.createRadialGradient(x, y, 0, x, y, r * 1.2);
  g.addColorStop(0, "rgba(255, 255, 240, 0.95)"); g.addColorStop(1, "rgba(255, 240, 180, 0)");
  pen.fillStyle = g; pen.beginPath(); pen.arc(x, y, r * 1.2, 0, 7); pen.fill();
  pen.fillStyle = "#fffef4"; pen.beginPath();
  pen.moveTo(x, y - r); pen.quadraticCurveTo(x, y, x + r, y); pen.quadraticCurveTo(x, y, x, y + r);
  pen.quadraticCurveTo(x, y, x - r, y); pen.quadraticCurveTo(x, y, x, y - r); pen.closePath(); pen.fill();
  pen.restore();
}

// ogreHead(j, kind, face, t): the head drawn over the person's, j what person() gave back.
// person() gives its joints in pixels of the sheet, through all the pen's turns and scales (PIX to a film pixel, and a
// scene's camera); the head is drawn with the pen as it is now, so each joint is taken back through the pen's
// transform (ogJoint). Until 2026-11-11 they were used as they came: on a film's page, at two pixels, the head was drawn
// at twice its place and size, off the body.
function ogJoint(p) {
  var m = pen.getTransform().inverse();
  return [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f];
}
// The face after the owner's reference (2026-11-13, the sea giantess's statue): a full round face, a heavy brow ridge
// knit in a frown, round eyes under heavy lids, a broad flat nose with flared nostrils, thick lips shut (open to eat), and
// two tusks rising from the lower jaw at the mouth's corners, curving up and out past the upper lip. Drawn in the head's
// own measure (100 from crown to chin), the pen already there.
function ogreStatueFace(c, t, jaw, ink) {
  var deep = blend(c.skin, c.dark, 0.45), lip = blend(c.skin, "#4a0e0e", 0.35);
  pen.beginPath();                                  // the face: full, round, the jaw heavy
  pen.moveTo(-54, -44); pen.quadraticCurveTo(0, -68, 54, -44); pen.quadraticCurveTo(72, 6, 50, 48);
  pen.quadraticCurveTo(0, 78, -50, 48); pen.quadraticCurveTo(-72, 6, -54, -44); pen.closePath();
  ogFill(c.skin, ink, 2.4);
  var cheek = pen.createRadialGradient(0, 4, 20, 0, 4, 74);   // rounded: the cheeks lit, the sides in shade
  cheek.addColorStop(0, "rgba(255, 230, 210, 0.16)"); cheek.addColorStop(0.6, "rgba(0, 0, 0, 0)"); cheek.addColorStop(1, "rgba(0, 0, 0, 0.22)");
  pen.fillStyle = cheek; pen.fill();
  pen.beginPath();                                  // the brow ridge, heavy, knit over the nose
  pen.moveTo(-50, -16); pen.quadraticCurveTo(-30, -40, -6, -26); pen.lineTo(0, -20); pen.lineTo(6, -26);
  pen.quadraticCurveTo(30, -40, 50, -16); pen.quadraticCurveTo(28, -26, 6, -16); pen.lineTo(0, -12); pen.lineTo(-6, -16);
  pen.quadraticCurveTo(-28, -26, -50, -16); pen.closePath();
  ogFill(deep, ink, 1.6);
  pen.strokeStyle = "rgba(255, 235, 215, 0.35)"; pen.lineWidth = 2;   // its lit upper edge
  pen.beginPath(); pen.moveTo(-46, -20); pen.quadraticCurveTo(-28, -40, -8, -28); pen.moveTo(46, -20); pen.quadraticCurveTo(28, -40, 8, -28); pen.stroke();
  pen.strokeStyle = ink; pen.lineWidth = 1.4;      // the frown's creases
  pen.beginPath(); pen.moveTo(-4, -40); pen.lineTo(-2, -28); pen.moveTo(4, -40); pen.lineTo(2, -28); pen.stroke();
  [-23, 23].forEach(function (ex) {                 // the eyes: round, whites and a dark iris, the heavy lid over the top
    var roll = 2.5 * Math.sin(t * 0.9);
    pen.beginPath(); pen.ellipse(ex, -4, 13, 11, 0, 0, 7); ogFill("#fbf6ea", ink, 1.6);
    oval(ex + 2 + roll, -3, 7, 7, c.eye); oval(ex + 2 + roll, -3, 4, 4, "#120a08"); oval(ex + roll, -6, 1.6, 1.6, "#ffffff");
    pen.beginPath(); pen.moveTo(ex - 15, -4); pen.quadraticCurveTo(ex, -22, ex + 15, -4); pen.quadraticCurveTo(ex, -11, ex - 15, -4); pen.closePath();
    ogFill(deep, ink, 1.4);
    pen.strokeStyle = "rgba(0, 0, 0, 0.35)"; pen.lineWidth = 1.2;   // the bag under it
    pen.beginPath(); pen.moveTo(ex - 10, 9); pen.quadraticCurveTo(ex, 13, ex + 11, 8); pen.stroke();
  });
  pen.beginPath();                                  // the nose: broad and flat, the nostrils flared
  pen.moveTo(-6, -12); pen.quadraticCurveTo(-8, 8, -20, 16); pen.quadraticCurveTo(-22, 26, -10, 26);
  pen.quadraticCurveTo(0, 30, 10, 26); pen.quadraticCurveTo(22, 26, 20, 16); pen.quadraticCurveTo(8, 8, 6, -12);
  ogFill(c.skin, ink, 1.8);
  oval(-9, 22, 4.5, 2.6, "#2a1210"); oval(9, 22, 4.5, 2.6, "#2a1210");
  pen.fillStyle = "rgba(255, 235, 215, 0.3)"; pen.beginPath(); pen.ellipse(0, 12, 4, 7, 0, 0, 7); pen.fill();
  var open = jaw === undefined ? 0.12 + 0.12 * Math.sin(t * 1.3) : jaw;   // shut, breathing; jaw 1 wide (to eat)
  var gap = 16 * open;
  if (gap > 1.5) {                                  // the mouth open between the lips, its teeth
    pen.beginPath(); pen.ellipse(0, 38 + gap / 2, 22, 3 + gap / 2, 0, 0, 7); ogFill("#4a1010", ink, 1.4);
    pen.fillStyle = "#fffaf0"; pen.fillRect(-16, 36, 32, Math.min(5, gap / 2));
  }
  pen.beginPath();                                  // the upper lip, thick, its bow
  pen.moveTo(-26, 37); pen.quadraticCurveTo(-12, 29, 0, 33); pen.quadraticCurveTo(12, 29, 26, 37); pen.quadraticCurveTo(0, 41, -26, 37); pen.closePath();
  ogFill(lip, ink, 1.6);
  pen.beginPath();                                  // the lower lip, fuller
  pen.moveTo(-24, 39 + gap); pen.quadraticCurveTo(0, 37 + gap, 24, 39 + gap); pen.quadraticCurveTo(0, 54 + gap, -24, 39 + gap); pen.closePath();
  ogFill(lip, ink, 1.6);
  pen.fillStyle = "rgba(255, 220, 210, 0.3)"; pen.beginPath(); pen.ellipse(0, 45 + gap, 9, 2.5, 0, 0, 7); pen.fill();
  [-1, 1].forEach(function (d) {                    // the tusks from the lower jaw, curving up and out past the upper lip
    var bx = d * 22, by = 46 + gap, size = c.tusk || 1;
    pen.beginPath();
    pen.moveTo(bx - d * 5 * size, by);
    pen.quadraticCurveTo(bx - d * 2 * size, by - 18 * size, bx + d * 12 * size, by - 34 * size);
    pen.quadraticCurveTo(bx + d * 8 * size, by - 16 * size, bx + d * 5 * size, by);
    pen.closePath();
    ogFill("#fbf6e8", ink, 1.4);
    pen.strokeStyle = "rgba(160, 140, 110, 0.6)"; pen.lineWidth = 1;
    pen.beginPath(); pen.moveTo(bx + d * 2 * size, by - 2); pen.quadraticCurveTo(bx + d * 3 * size, by - 18 * size, bx + d * 10 * size, by - 30 * size); pen.stroke();
  });
}
// The beaded collar and the arm band of the statue (c: a kind of OGRES with a collar), over the body person() drew: a
// broad band round the neck and over the chest, a row of beads on it and points hanging; a band round the near upper arm.
function ogreCollar(j, c) {
  var sa = ogJoint(j.shoulderA), sb = ogJoint(j.shoulderB), cr = ogJoint(j.crown), ch = ogJoint(j.chin);
  var u = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]) / 100, mid = [(sa[0] + sb[0]) / 2, (sa[1] + sb[1]) / 2];
  var wide = Math.max(Math.abs(sa[0] - sb[0]) * 0.62, 40 * u), dip = mid[1] + 34 * u, k;
  pen.save();
  pen.beginPath(); pen.moveTo(mid[0] - wide, mid[1] - 6 * u); pen.quadraticCurveTo(mid[0], dip + 24 * u, mid[0] + wide, mid[1] - 6 * u);
  pen.lineTo(mid[0] + wide * 0.8, mid[1] - 16 * u); pen.quadraticCurveTo(mid[0], dip, mid[0] - wide * 0.8, mid[1] - 16 * u); pen.closePath();
  ogFill(c.collar, "#6a3410", 1.4);
  for (k = 0; k <= 12; k++) {                      // its row of beads and its hanging points
    var q = k / 12, x = mix(mid[0] - wide * 0.9, mid[0] + wide * 0.9, q), y = mid[1] - 10 * u + (1 - Math.pow(2 * q - 1, 2)) * 26 * u;
    oval(x, y, 2.2 * u, 2.2 * u, "#fff3d6");
    if (k % 2 === 0) { pen.beginPath(); pen.moveTo(x - 3 * u, y + 4 * u); pen.lineTo(x, y + 11 * u); pen.lineTo(x + 3 * u, y + 4 * u); pen.closePath(); ogFill(c.collar, "#6a3410", 0.8); }
  }
  var ea = ogJoint(j.elbowA), at = [mix(sa[0], ea[0], 0.42), mix(sa[1], ea[1], 0.42)], ang = Math.atan2(ea[1] - sa[1], ea[0] - sa[0]);
  pen.translate(at[0], at[1]); pen.rotate(ang);    // the band on the near upper arm, across it
  pen.beginPath(); pen.rect(-7 * u, -13 * u, 14 * u, 26 * u); ogFill(c.collar, "#6a3410", 1.2);
  for (k = -2; k <= 2; k++) { oval(0, k * 5 * u, 2 * u, 2 * u, "#fff3d6"); }
  pen.restore();
}
// The ghouls' face after the owner's reference (2026-11-13, a temple mural's yaksha): turned three quarters toward the
// way it faces, a long face with a great hooked nose, one bulging eye under a heavy brow curling up like a flame, the
// mouth drawn back in a grimace baring both rows of teeth, fangs up from the lower jaw and down from the upper, the
// lower jaw a shade darker; its hair drawn up in a topknot in a gold band, a gold ring in the long ear. In the head's own
// measure (crown to chin 100), facing +x.
function ogreYakshaFace(c, t, jaw, ink) {
  var deep = blend(c.skin, c.dark, 0.5), open = jaw === undefined ? 0.35 + 0.25 * Math.sin(t * 1.7) : jaw, gap = 10 * open;
  pen.beginPath();                                  // the topknot: hair drawn up, a bun on the crown
  pen.ellipse(-8, -72, 20, 16, -0.2, 0, 7); ogFill(c.hair, "#000000", 1.6);
  pen.beginPath(); pen.moveTo(-50, -40); pen.quadraticCurveTo(-30, -70, 10, -66); pen.quadraticCurveTo(40, -62, 46, -40);
  pen.lineTo(-50, -40); pen.closePath(); ogFill(c.hair, "#000000", 1.6);
  pen.beginPath();                                  // the long ear, behind the cheek, a gold ring in its lobe
  pen.moveTo(-40, -14); pen.bezierCurveTo(-64, -20, -66, 20, -50, 34); pen.quadraticCurveTo(-40, 30, -38, 12); pen.closePath();
  ogFill(c.skin, ink, 1.8);
  oval(-52, 36, 6, 6, "#e0b23a");
  pen.beginPath();                                  // the face: long, its jaw jutting, the cheek full under the eye
  pen.moveTo(-40, -42); pen.quadraticCurveTo(10, -58, 40, -38);
  pen.quadraticCurveTo(52, -18, 50, 2);              // the brow's ridge forward, down to the nose's root
  pen.lineTo(60, 26); pen.quadraticCurveTo(54, 34, 44, 32);   // the great hooked nose
  pen.lineTo(52, 48 + gap); pen.quadraticCurveTo(46, 70 + gap, 10, 72 + gap);   // the jutting lower jaw
  pen.quadraticCurveTo(-30, 72, -44, 40); pen.quadraticCurveTo(-52, 0, -40, -42); pen.closePath();
  ogFill(c.skin, ink, 2.4);
  pen.beginPath(); pen.moveTo(52, 46 + gap); pen.quadraticCurveTo(46, 70 + gap, 10, 72 + gap); pen.quadraticCurveTo(-14, 70, -24, 56);
  pen.quadraticCurveTo(14, 58 + gap, 52, 46 + gap); pen.closePath(); ogFill(deep, ink, 1.4);   // the lower jaw, a shade darker
  pen.beginPath();                                  // the grimace: the mouth drawn back, both rows of teeth bared
  pen.moveTo(52, 38); pen.quadraticCurveTo(20, 34, -6, 44); pen.quadraticCurveTo(20, 52 + gap, 52, 46 + gap); pen.closePath();
  ogFill("#4a1414", ink, 1.6);
  pen.fillStyle = "#fffaf0";
  for (var k = 0; k < 6; k++) {                     // the teeth, upper and lower
    var tx = 46 - k * 8;
    pen.beginPath(); pen.rect(tx - 3, 38 + k * 0.6, 6, 5); pen.fill();
    pen.beginPath(); pen.rect(tx - 3, 42 + gap + k * 0.4, 6, 4); pen.fill();
  }
  [[40, 1], [14, 1], [32, -1]].forEach(function (f) {   // fangs: up from the lower jaw, down from the upper
    var base = f[1] > 0 ? 46 + gap : 38, tip = base - f[1] * 14;
    pen.beginPath(); pen.moveTo(f[0] - 3.5, base); pen.lineTo(f[0], tip); pen.lineTo(f[0] + 3.5, base); pen.closePath(); ogFill("#fffaf0", ink, 1);
  });
  pen.strokeStyle = ink; pen.lineWidth = 1.6;       // the cheek's fold beside the mouth and the nostril
  pen.beginPath(); pen.moveTo(30, 8); pen.quadraticCurveTo(14, 26, 22, 38); pen.stroke();
  pen.beginPath(); pen.ellipse(48, 24, 4, 2.6, 0.4, 0, 7); pen.fillStyle = "#1a0e0a"; pen.fill();
  pen.beginPath(); pen.ellipse(-12, -10, 10, 10, 0, 0, 7); ogFill("#fbf6ea", ink, 1.8);   // the far eye, past the nose's root (owner: two eyes)
  pen.strokeStyle = c.eye; pen.lineWidth = 2.4; pen.beginPath(); pen.arc(-12, -10, 8, 0, 7); pen.stroke();
  oval(-9 + 1.5 * Math.sin(t * 0.9), -10, 3.6, 3.6, "#120a08");
  pen.beginPath(); pen.moveTo(-26, -20); pen.quadraticCurveTo(-14, -30, 0, -24); pen.quadraticCurveTo(-12, -24, -26, -16); pen.closePath(); ogFill(c.dark, "#000000", 1);
  pen.beginPath(); pen.ellipse(22, -10, 15, 12, 0, 0, 7); ogFill("#fbf6ea", ink, 2);   // the eye, bulging, ringed
  pen.strokeStyle = c.eye; pen.lineWidth = 3; pen.beginPath(); pen.arc(22, -10, 12, 0, 7); pen.stroke();
  oval(27 + 2 * Math.sin(t * 0.9), -10, 5, 5, "#120a08");
  pen.beginPath();                                  // the heavy brow, curling up at its end like a flame (kranok)
  pen.moveTo(2, -20); pen.quadraticCurveTo(20, -34, 44, -26); pen.quadraticCurveTo(52, -36, 46, -46);
  pen.quadraticCurveTo(40, -38, 36, -36); pen.quadraticCurveTo(18, -40, 2, -26); pen.closePath();
  ogFill(c.dark, "#000000", 1.2);
  pen.beginPath();                                  // the gold band at the hairline, its point over the brow
  pen.moveTo(-46, -36); pen.quadraticCurveTo(0, -56, 44, -36); pen.lineTo(42, -28); pen.quadraticCurveTo(0, -46, -44, -28); pen.closePath();
  ogFill("#e0b23a", "#7a4a10", 1.4);
  pen.beginPath(); pen.moveTo(-4, -50); pen.lineTo(4, -62); pen.lineTo(12, -50); pen.closePath(); ogFill("#e0b23a", "#7a4a10", 1.2);
  oval(4, -44, 3, 3, "#c8202a");
}
// The ghouls' bodies, bony and thin, their muscles drawn (owner, 2026-11-13): over the body person() drew, the ribs and
// the breastbone, the collarbones, the hollow belly, the long muscles of the upper arm and forearm, the knees' knobs.
function ogreBones(j, c) {
  var sa = ogJoint(j.shoulderA), sb = ogJoint(j.shoulderB), cr = ogJoint(j.crown), ch = ogJoint(j.chin), w = j.waist ? ogJoint(j.waist) : null;
  var u = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]) / 100, ink = blend(c.skin, "#000000", 0.55), lit = blend(c.skin, "#ffffff", 0.3), k;
  var mx = (sa[0] + sb[0]) / 2, my = (sa[1] + sb[1]) / 2, half = Math.max(16 * u, Math.abs(sa[0] - sb[0]) * 0.42), down = w ? w[1] - my : 120 * u;
  pen.save(); pen.lineCap = "round";
  pen.strokeStyle = ink; pen.lineWidth = 1.6 * u;
  pen.beginPath(); pen.moveTo(mx - half, my + 6 * u); pen.quadraticCurveTo(mx, my + 14 * u, mx + half, my + 6 * u); pen.stroke();   // the collarbones
  pen.beginPath(); pen.moveTo(mx, my + 14 * u); pen.lineTo(mx, my + down * 0.5); pen.stroke();                                     // the breastbone
  for (k = 0; k < 5; k++) {                         // the ribs, curving round each side
    var ry = my + down * (0.22 + 0.09 * k), rw = half * (0.95 - 0.04 * k);
    pen.beginPath(); pen.moveTo(mx - 3 * u, ry); pen.quadraticCurveTo(mx - rw * 0.7, ry - 4 * u, mx - rw, ry + 6 * u); pen.stroke();
    pen.beginPath(); pen.moveTo(mx + 3 * u, ry); pen.quadraticCurveTo(mx + rw * 0.7, ry - 4 * u, mx + rw, ry + 6 * u); pen.stroke();
  }
  pen.strokeStyle = lit; pen.lineWidth = 1.2 * u;  // the light on the ribs' upper edges
  for (k = 0; k < 4; k++) { var ly = my + down * (0.2 + 0.09 * k); pen.beginPath(); pen.moveTo(mx - half * 0.2, ly - 2 * u); pen.quadraticCurveTo(mx - half * 0.6, ly - 6 * u, mx - half * 0.85, ly + 2 * u); pen.stroke(); }
  pen.strokeStyle = ink; pen.lineWidth = 1.3 * u;   // the hollow belly under them
  pen.beginPath(); pen.moveTo(mx - half * 0.5, my + down * 0.72); pen.quadraticCurveTo(mx, my + down * 0.8, mx + half * 0.5, my + down * 0.72); pen.stroke();
  ["A", "B"].forEach(function (s) {                 // the long muscles of the arms: a line down the upper arm, two down the forearm
    if (!j["elbow" + s] || !j["wrist" + s]) { return; }
    var sh = ogJoint(j["shoulder" + s]), el = ogJoint(j["elbow" + s]), wr = ogJoint(j["wrist" + s]);
    pen.beginPath(); pen.moveTo(mix(sh[0], el[0], 0.2), mix(sh[1], el[1], 0.2)); pen.quadraticCurveTo(mix(sh[0], el[0], 0.5) + 3 * u, mix(sh[1], el[1], 0.5), mix(sh[0], el[0], 0.85), mix(sh[1], el[1], 0.85)); pen.stroke();
    pen.beginPath(); pen.moveTo(mix(el[0], wr[0], 0.1), mix(el[1], wr[1], 0.1)); pen.quadraticCurveTo(mix(el[0], wr[0], 0.4) - 2 * u, mix(el[1], wr[1], 0.4), mix(el[0], wr[0], 0.8), mix(el[1], wr[1], 0.8)); pen.stroke();
    pen.beginPath(); pen.arc(el[0], el[1], 3 * u, 0, 7); pen.stroke();   // the elbow's knob
  });
  ["A", "B"].forEach(function (s) {                 // the knees' knobs
    if (!j["knee" + s]) { return; }
    var kn = ogJoint(j["knee" + s]); pen.beginPath(); pen.arc(kn[0], kn[1], 4.5 * u, 0, 7); pen.stroke();
  });
  pen.restore();
}
function ogreHead(j, kind, face, t, jaw) {
  var crown = ogJoint(j.crown), chin = ogJoint(j.chin);
  var c = OGRES[kind], cx = (crown[0] + chin[0]) / 2, cy = (crown[1] + chin[1]) / 2;
  var h = Math.hypot(chin[0] - crown[0], chin[1] - crown[1]), s = h / 100;
  var tilt = Math.atan2(chin[0] - crown[0], chin[1] - crown[1]);
  pen.save();
  pen.translate(cx, cy);
  pen.rotate(-tilt);
  pen.scale(s * face, s);
  var ink = "#1a1210";
  if (c.yaksha) { ogreYakshaFace(c, t, jaw, ink, face); pen.restore(); return; }   // the ghouls: the mural yaksha (2026-11-13)
  if (c.hair) {                                     // B: wild hair, standing out in locks
    pen.beginPath();
    for (var k = 0; k <= 16; k++) { var a = Math.PI + k / 16 * Math.PI, r = k % 2 ? 78 : 64; pen.lineTo(Math.cos(a) * r, -10 + Math.sin(a) * r * 0.9 + 6 * Math.sin(t * 2 + k)); }
    pen.closePath();
    ogFill(c.hair, "#000000");
  }
  if (c.long) {                                     // long matted hair, white, hanging in clumps past the shoulders
    for (var lock = 0; lock < 9; lock++) {           // (the owner, 2026-11-12: "long matted white hair")
      var side = lock < 5 ? -1 : 1, i = lock < 5 ? lock : lock - 5;
      var x0 = side * (40 + i * 7), len = 150 + 40 * Math.sin(lock * 2.7) + i * 14, sway = 5 * Math.sin(t * 1.1 + lock);
      pen.beginPath();
      pen.moveTo(x0 - 9, -30);
      pen.bezierCurveTo(x0 + side * 18 - 10, 40, x0 + side * 6 - 14 + sway, len - 60, x0 + side * 10 - 6 + sway, len);
      pen.lineTo(x0 + side * 10 + 2 + sway, len - 14); pen.lineTo(x0 + side * 10 + 8 + sway, len + 6);
      pen.bezierCurveTo(x0 + side * 6 + 14 + sway, len - 60, x0 + side * 18 + 12, 40, x0 + 9, -30);
      pen.closePath();
      ogFill(lock % 2 ? c.hair : "#d6cfc2", "#6a6258", 1.6);
      pen.strokeStyle = "rgba(110, 100, 88, 0.6)"; pen.lineWidth = 1.2;   // the strands matted together
      for (var m = 1; m < 4; m++) {
        pen.beginPath(); pen.moveTo(x0, 10 + m * 20); pen.quadraticCurveTo(x0 + side * 8 + sway * 0.5, 30 + m * (len / 5), x0 + side * 6 + sway, 40 + m * (len / 4)); pen.stroke();
      }
    }
  }
  pen.beginPath();                                  // the ears, big, with gold rings
  pen.ellipse(-62, 0, 14, 24, -0.2, 0, 7); ogFill(c.skin, ink);
  pen.beginPath(); pen.ellipse(62, 0, 14, 24, 0.2, 0, 7); ogFill(c.skin, ink);
  oval(-64, 26, 7, 7, "#e0b23a"); oval(64, 26, 7, 7, "#e0b23a");
  if (c.statue) { ogreStatueFace(c, t, jaw, ink); } else {
    pen.beginPath();                                  // the face: broad, the jaw heavy
    pen.moveTo(-56, -40); pen.quadraticCurveTo(0, -66, 56, -40); pen.quadraticCurveTo(66, 10, 48, 44);
    pen.quadraticCurveTo(0, 70, -48, 44); pen.quadraticCurveTo(-66, 10, -56, -40); pen.closePath();
    ogFill(c.skin, ink, 2.4);
    pen.strokeStyle = c.dark; pen.lineWidth = 6;      // the thick curled brows
    pen.beginPath(); pen.moveTo(-44, -22); pen.quadraticCurveTo(-26, -40, -6, -24); pen.moveTo(6, -24); pen.quadraticCurveTo(26, -40, 44, -22); pen.stroke();
    [-24, 24].forEach(function (ex) {                 // the eyes: round, white, bulging, ringed
      var roll = 3 * Math.sin(t * 0.9);
      oval(ex, -8, 14, 13, "#ffffff");
      pen.strokeStyle = c.eye; pen.lineWidth = 3; pen.beginPath(); pen.arc(ex, -8, 13, 0, 7); pen.stroke();
      oval(ex + 3 + roll, -7, 5.5, 5.5, "#1a1010");
    });
    pen.beginPath();                                  // the nose: broad, its nostrils flared
    pen.moveTo(-8, -4); pen.quadraticCurveTo(-16, 18, -12, 22); pen.quadraticCurveTo(0, 28, 12, 22); pen.quadraticCurveTo(16, 18, 8, -4);
    ogFill(c.skin, ink, 1.8);
    var open = jaw === undefined ? 0.5 + 0.5 * Math.sin(t * 1.3) : 2.2 * jaw - 0.6;   // jaw 0 shut, 1 wide (to eat)
    pen.beginPath();                                  // the mouth: the width of the face, open, a row of teeth
    pen.moveTo(-36, 32); pen.quadraticCurveTo(0, 40 + 10 * open, 36, 32); pen.quadraticCurveTo(0, 54 + 10 * open, -36, 32); pen.closePath();
    ogFill("#6a1a1a", ink, 2);
    pen.fillStyle = "#fffaf0"; pen.fillRect(-26, 33, 52, 5);
    [[-32, 1], [32, -1]].forEach(function (f) {       // the fangs rising from the corners
      pen.beginPath(); pen.moveTo(f[0] - 4 * f[1], 36); pen.lineTo(f[0] + 4 * f[1] * 0.2, 14); pen.lineTo(f[0] + 4 * f[1], 36); pen.closePath();
      ogFill("#fffaf0", ink, 1.4);
    });
  }
  if (c.band && !c.crown) {                         // a beaded band at the hairline, a frangipani behind one ear
    pen.beginPath(); pen.moveTo(-58, -36); pen.quadraticCurveTo(0, -62, 58, -36); pen.lineTo(56, -26); pen.quadraticCurveTo(0, -50, -56, -26); pen.closePath();
    ogFill(c.band, "#6a3410", 1.6);
    for (var bd = -5; bd <= 5; bd++) { oval(bd * 10, -38 - (25 - bd * bd) * 0.42, 2.6, 2.6, "#fff6e0"); }
    var fx = (c.flowerSide ? 1 : -1) * 62, fy = -24;
    for (var pt = 0; pt < 5; pt++) { var pa = pt / 5 * Math.PI * 2; oval(fx + Math.cos(pa) * 6, fy + Math.sin(pa) * 6, 5.5, 4, "#fffaf2"); }
    oval(fx, fy, 3.2, 3.2, "#f2c040");
  }
  if (c.crown === "spire") {                        // the spire crown (ชฎา) of gold, in tiers, the flames at the ears
    var lit = "#f6d47a", gold = "#e0b23a", deep = "#c8901e", line = "#7a4a10";
    [-1, 1].forEach(function (side) {               // behind each ear a flame of gold in three tongues, curling back and down
      pen.save(); pen.translate(side * 52, -44); pen.scale(0.7, 0.62); pen.translate(-side * 52, 44);
      for (var f = 2; f >= 0; f--) {                // (kranok; the owner, 2026-11-12: a new crown, more detailed)
        pen.beginPath(); pen.moveTo(side * 50, -50 + f * 4);
        pen.bezierCurveTo(side * (84 + f * 8), -50 + f * 6, side * (98 + f * 8), -10 + f * 10, side * (90 + f * 6), 30 + f * 14);
        pen.quadraticCurveTo(side * (104 + f * 6), 26 + f * 14, side * (106 + f * 6), 12 + f * 14);
        pen.quadraticCurveTo(side * (110 + f * 6), 44 + f * 14, side * (84 + f * 4), 46 + f * 14);
        pen.bezierCurveTo(side * (80 + f * 4), 10 + f * 8, side * 72, -24, side * 56, -34); pen.closePath();
        ogFill(f % 2 ? lit : gold, line, 1.6);
      }
      pen.restore();
      oval(side * 64, -40, 5, 5, "#2e8a6a");
    });
    pen.beginPath(); pen.moveTo(-54, -40); pen.quadraticCurveTo(0, -70, 54, -40); pen.lineTo(48, -60); pen.quadraticCurveTo(0, -84, -48, -60); pen.closePath();
    ogFill(gold, line);                             // the band over the brow, set with a row of stones and a great red one
    for (var n = -4; n <= 4; n++) { oval(n * 10, -52 - (16 - n * n) * 0.6, 3.2, 3.2, n % 2 ? "#2e8a6a" : "#c8202a"); }
    pen.beginPath(); pen.moveTo(-10, -62); pen.lineTo(0, -80); pen.lineTo(10, -62); pen.lineTo(0, -54); pen.closePath(); ogFill("#c8202a", line, 1.4);
    for (var tier = 0; tier < 5; tier++) {           // five tiers, each edged with lotus petals, a stone at its middle
      var w = 40 - tier * 7.5, y0 = -66 - tier * 21, y1 = y0 - 21;
      pen.beginPath(); pen.moveTo(-w, y0); pen.lineTo(-w + 4, y1); pen.lineTo(w - 4, y1); pen.lineTo(w, y0); pen.closePath();
      var g = pen.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, lit); g.addColorStop(0.5, tier % 2 ? gold : deep); g.addColorStop(1, "#9a6a1e");
      ogFill(g, line, 1.5);
      var petals = Math.max(3, Math.round(w / 7));
      for (var q = 0; q < petals; q++) {
        var px = -w + (q + 0.5) * 2 * w / petals, pr = w / petals;
        pen.beginPath(); pen.moveTo(px - pr, y0); pen.quadraticCurveTo(px, y0 - 2.4 * pr, px + pr, y0); ogFill(q % 2 ? lit : gold, line, 0.9);
      }
      oval(0, y0 - 13, 3.4, 3.4, tier % 2 ? "#2e8a6a" : "#c8202a");
    }
    pen.beginPath(); pen.moveTo(-7, -171); pen.quadraticCurveTo(-3, -196, 0, -214); pen.quadraticCurveTo(3, -196, 7, -171); pen.closePath(); ogFill(lit, line, 1.4);
    oval(0, -176, 3, 3, "#c8202a");
    [[0, -70], [-30, -50], [30, -50], [-20, -100], [20, -120], [0, -150], [0, -206], [-74, -20], [74, -20]].forEach(function (q, i) {
      var on = Math.max(0, Math.sin(t * 2.4 + i * 2.1));   // the sparkles: small stars that flash in turn
      ogGlint(q[0], q[1], 14 * on * on, on);
    });
  }
  pen.restore();
}

// The body each kind wears unless the look says otherwise: bare, a giant's size, its skin; the king and the yaksha in
// a noble's gold and brocade, the forest ogre in a hitched dark cloth.
var OGRE_LOOKS = {
  mural:  {bare: true, regalia: true, sarong: ["#8a2a3a", BROCADE], turban: "#2f7f4e"},
  forest: {bare: true, sarong: "#3a2a1e", patoi: 0.75, tattoo: true, turban: "#1a1a1e"},
  king:   {bare: true, regalia: true, sarong: ["#1e2a5a", BROCADE], turban: "#c8452f"},
  // thin and bony, longer in the limb than a giant (owner, 2026-11-13: "bony and skinny"); the ribs drawn by ogreBones()
  ghoul:     {bare: true, sarong: "#4a3a24", patoi: 0.6, turban: "#2a2620", bend: 0.12, nails: "long", build: 0.55},
  ghoulPale: {bare: true, sarong: "#6a6458", patoi: 0.6, turban: "#e6e0d4", bend: 0.24, age: 0.7, nails: "long", build: 0.6},
  ghoulDark: {bare: true, sarong: "#2a1c18", patoi: 0.75, tattoo: false, turban: "#151010", bend: 0.08, nails: "long", build: 0.5,
              beads: ["#efe6d2", "#d8ccb0", "#efe6d2"]},          // a string of bone beads
  // an old woman's body at the build of the paintings (build 1: the kit's old women are short, and the head looked too big)
  // in rags (owner, 2026-11-13: "Give the giantess ... ragged clothes. Her skin should be entirely red"): a torn
  // cloth of faded brown, her skin red everywhere (ivory: false), the rags drawn over by ogreRags()
  giantess:  {lady: true, shirt: "#6a5440", sin: 2, age: 1, bend: 0.2, build: 1, nails: "long", ivory: false},
  violet:    {bare: true, regalia: true, sarong: ["#3a1e48", BROCADE], turban: "#1a1020"},
  ochre:     {bare: true, regalia: true, sarong: ["#6a2410", BROCADE], turban: "#2a1a0c"},
  teal:      {bare: true, regalia: true, sarong: ["#143a4a", BROCADE], turban: "#0c1a1a"},
  ash:       {bare: true, sarong: ["#2a2824", BROCADE], turban: "#e6e0d4", age: 0.6}
};

// ogreMeat(p, turn): a raw haunch of meat, the bone's end showing, held at p (a joint person() gave back, in pixels of
// the sheet, as wristA) and turned by turn radians (size: a scale, 1 unless told): what the ghouls carry and eat. Returns nothing; it draws with pen.
// e.g. var j = ogre(600, GROUND, t, {kind: "ghoul", reachA: [660, GROUND - 330]}); ogreMeat(j.wristA, -0.6);
function ogreMeat(p, turn, size) {
  pen.save();
  var at = ogJoint(p);
  pen.translate(at[0], at[1]);
  pen.rotate(turn || 0);
  if (size) { pen.scale(size, size); }        // the eater's size (a small ogre's meat, 2026-11-13)
  pen.beginPath(); pen.ellipse(26, 0, 34, 18, 0, 0, Math.PI * 2); ogFill("#b8343a", "#5a1416", 2);
  pen.fillStyle = "#e8848a"; pen.beginPath(); pen.ellipse(18, -4, 18, 7, 0.1, 0, Math.PI * 2); pen.fill();
  pen.beginPath(); pen.rect(-22, -5, 26, 10); ogFill("#f2ead6", "#7a6a50", 1.4);
  pen.beginPath(); pen.arc(-24, -5, 6, 0, Math.PI * 2); pen.arc(-24, 5, 6, 0, Math.PI * 2); ogFill("#f2ead6", "#7a6a50", 1.4);
  pen.restore();
}

// The three giant kings' daughters of Hong Hin, each in a skin of her father's kingdom (the owner's pick, 2026-11-11: "C,
// but give them individual jewelry and clothing and faces"): painted women of people.js (load it), each from a different
// painted woman (her face), in her own blouse, sin, shoulder cloth, hair flowers, earrings, necklace and metal.
//   mukhawadi   the first kingdom's (Wassawaro's), rose: the princess's face, gold and rubies, a crown
//   culakantha  the second's (Kumbhanda's), pale green, as the khao so has her, her eyes black as gems: the
//               celestial's face, silver and jade
//   salicanta   the third's (Anumat's), blue: the court lady's face, gold and sapphires, pearls
// ogreDaughter(name, more): her look, for person(); more: any of a look's keys, which win.
// e.g. person(900, GROUND, ogreDaughter("culakantha", {size: 1.3, id: "cula"}));
var OGRE_DAUGHTERS = {
  mukhawadi:  {from: "princess", look: {skin: "#e8a8a0", shirt: "#f6dcd0", sabai: "haeOn", jewels: "gold",
                                        stones: ["#c8202a", "#e0b23a"], makeup: "berry"},
               woman: {crown: true, earring: "dokhu", neck: "sangwan", hair: ["maiwai", "gardenia"], blouse: ["dots", "#ffffff"]}},
  culakantha: {from: "celestial", look: {skin: "#b8d4a8", shirt: "#eef2e0", sabai: "chiangKham", jewels: "silver",
                                         stones: ["#2e8a6a", "#e8f0e8"], makeup: "rose", hair: "#0c0a0e"},
               woman: {crown: true, earring: "pearl", neck: "pendant", hair: ["jasmine"], blouse: "clouds", scarf: undefined}},
  salicanta:  {from: "court", look: {skin: "#a8b8e0", shirt: "#f4f0f8", sabai: "yuanChet", jewels: "gold",
                                     stones: ["#2a4aa8", "#e0b23a"], makeup: "coral"},
               woman: {crown: true, earring: "dokhu", neck: "pearls", hair: ["ueang", "flower"], blouse: ["lace", "#c8c0d8"], holds: "fan"}}
};
function ogreDaughter(name, more) {
  var d = OGRE_DAUGHTERS[name];
  if (!d) { checkName("A giant king's daughter", name, OGRE_DAUGHTERS); d = OGRE_DAUGHTERS.mukhawadi; }
  var w = MURAL_WOMEN[d.from], woman = Object.assign({}, w.woman, d.woman);
  var own = Object.assign({}, d.look, {sabai: sabaiLook(d.look.sabai)});   // the cloth's weave, by name (weaving.js loads after)
  Object.keys(woman).forEach(function (k) { if (woman[k] === undefined) { delete woman[k]; } });
  return cast(w.cast, Object.assign({}, w.look, own, {woman: woman}, more));
}

// The giantess's rags: the cloth person() drew, torn: a ragged hem at the blouse's foot by the waist and at the skirt's
// by the ankles, strips hanging from each, a patch and a tear. j: person()'s joints; t: seconds (the strips sway).
function ogreRags(j, t) {
  var w = ogJoint(j.waist), aa = ogJoint(j.ankleA), ab = ogJoint(j.ankleB), cr = ogJoint(j.crown), ch = ogJoint(j.chin);
  var u = Math.hypot(ch[0] - cr[0], ch[1] - cr[1]) / 100, k;
  pen.save();
  function hem(cx, cy, wide, cloth, seed) {
    pen.beginPath(); pen.moveTo(cx - wide, cy - 6 * u);
    for (k = 0; k <= 10; k++) { pen.lineTo(cx - wide + k * wide / 5, cy + (k % 2 ? 10 + 8 * dice(seed + k) : 2) * u); }
    pen.lineTo(cx + wide, cy - 6 * u); pen.closePath();
    ogFill(cloth, "#2a1c10", 1.2);
    for (k = 0; k < 3; k++) {
      var sx = cx - wide * 0.7 + k * wide * 0.7, len = (16 + 14 * dice(seed + 20 + k)) * u, sway = 3 * Math.sin(t * 1.7 + k + seed);
      pen.beginPath(); pen.moveTo(sx - 3 * u, cy + 6 * u); pen.lineTo(sx + 3 * u, cy + 6 * u); pen.lineTo(sx + u + sway, cy + 6 * u + len); pen.closePath();
      ogFill(cloth, "#2a1c10", 0.8);
    }
  }
  hem(w[0], w[1] + 6 * u, 44 * u, "#5a4634", 3);
  // a skirt of bones over her rags (owner, 2026-11-13: "Give the giantess a skirt made of bones"): a cord at the waist,
  // long bones hanging from it close round the hips, knobbed at both ends, a skull at her side
  pen.strokeStyle = "#3a2a1a"; pen.lineWidth = 3 * u;
  pen.beginPath(); pen.moveTo(w[0] - 50 * u, w[1] + 4 * u); pen.quadraticCurveTo(w[0], w[1] + 14 * u, w[0] + 50 * u, w[1] + 4 * u); pen.stroke();
  for (k = 0; k < 11; k++) {
    var q = k / 10, bx = w[0] - 46 * u + q * 92 * u, by = w[1] + 6 * u + 8 * u * Math.sin(q * Math.PI), len = (70 + 22 * dice(k + 61)) * u;
    var lean = (q - 0.5) * 0.35 + 0.04 * Math.sin(t * 1.5 + k);
    pen.save(); pen.translate(bx, by); pen.rotate(lean);
    pen.fillStyle = k % 3 === 1 ? "#e4dac4" : "#f2ead6"; pen.strokeStyle = "#7a6a50"; pen.lineWidth = 1.2 * u;
    pen.beginPath(); pen.rect(-3 * u, 0, 6 * u, len); pen.fill(); pen.stroke();
    [0, len].forEach(function (e) { pen.beginPath(); pen.arc(-3.5 * u, e, 4 * u, 0, 7); pen.arc(3.5 * u, e, 4 * u, 0, 7); pen.fill(); pen.stroke(); });
    pen.restore();
  }
  pen.save(); pen.translate(w[0] + 46 * u, w[1] + 30 * u);   // a small skull tied at her hip
  pen.fillStyle = "#f2ead6"; pen.strokeStyle = "#7a6a50"; pen.lineWidth = 1.2 * u;
  pen.beginPath(); pen.arc(0, 0, 11 * u, Math.PI, 0); pen.lineTo(7 * u, 9 * u); pen.lineTo(-7 * u, 9 * u); pen.closePath(); pen.fill(); pen.stroke();
  pen.fillStyle = "#3a2a1a"; pen.beginPath(); pen.arc(-4 * u, -1 * u, 2.8 * u, 0, 7); pen.arc(4 * u, -1 * u, 2.8 * u, 0, 7); pen.fill();
  pen.restore();
  hem((aa[0] + ab[0]) / 2, Math.max(aa[1], ab[1]) - 22 * u, 52 * u, "#4a3a2c", 9);
  pen.fillStyle = "#7a6650"; pen.strokeStyle = "#2a1c10"; pen.lineWidth = 1;   // a patch sewn on, and a tear
  pen.beginPath(); pen.rect(w[0] - 20 * u, w[1] + 40 * u, 16 * u, 14 * u); pen.fill(); pen.stroke();
  pen.lineWidth = 1.6;
  pen.beginPath(); pen.moveTo(w[0] + 12 * u, w[1] - 60 * u); pen.lineTo(w[0] + 18 * u, w[1] - 44 * u); pen.lineTo(w[0] + 12 * u, w[1] - 30 * u); pen.stroke();
  pen.restore();
}

// ogre(x, y, t, look): the ogre standing on (x, y) at second t (see the top of this file). look.kind: "mural" unless
// told; look.jaw: how far its mouth is open, 0 shut to 1 wide (to eat), else it opens and closes on its own. Returns the joints person() gives back.
// e.g. var j = ogre(1300, GROUND, t, {kind: "forest", face: -1, step: t * 0.5, at: [600, 700]});
function ogre(x, y, t, look) {
  look = look || {};
  var kind = OGRES[look.kind] ? look.kind : "mural";
  if (look.kind && !OGRES[look.kind]) { checkName("The ogre's kind", look.kind, OGRES); }
  var given = Object.assign({}, look), jaw = look.jaw;
  delete given.kind;
  delete given.jaw;
  var j = person(x, y, Object.assign({size: 1.75, skin: OGRES[kind].skin, hidden: ["hair"], buttons: false, feel: "angry"}, OGRE_LOOKS[kind], given));
  if (OGRES[kind].collar && j.shoulderA && j.elbowA) { ogreCollar(j, OGRES[kind]); }
  if (OGRES[kind].yaksha && j.shoulderA) { ogreBones(j, OGRES[kind]); }
  if (kind === "giantess" && j.waist && j.ankleA) { ogreRags(j, t); }
  ogreHead(j, kind, given.face || 1, t, jaw);
  return j;
}
