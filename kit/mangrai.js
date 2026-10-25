// mangrai.js - the animals of the tale of Phaya Mangrai, for the Lanna cartoon kit: the white sambar of the first of
// Chiang Mai's seven signs, and the three shapes Phra Ruang took as he fled Phaya Ngam Mueang (the Ngoen Yang chronicle,
// ประชุมพงศาวดาร ภาคที่ ๖๑): a hill myna, a red ox and a bamboo rat. Load it after oldcartoon.js and beasts.js (the
// sambar and the ox walk on beastLegs()):
//
//     <script src="oldcartoon.js"></script>
//     <script src="beasts.js"></script>
//     <script src="mangrai.js"></script>
//
// and call each from a scene: (x, y) is the ground under it, t the second, look what it does; a name it does not know
// is warned of. Each was drawn as candidates from photographs and picked by the owner, 2026-10-25 (the sambar and the
// shapes: "Whatever is most historically accurate", "Research what is most historically accurate"). The white barking
// deer of the second sign and the white mice of the third are taleanimals.js's.
//
//   sambar(x, y, t, look)       the sambar deer (กวางป่า): white (look.white, the sign's กวางเผือก) or wild brown;
//                               a hind or a calf; standing, walking, grazing
//   hillMyna(x, y, t, look)     the hill myna (นกขุนทอง), the chronicle's นกเอี้ยง: hopping, or its wings opening
//   banteng(x, y, t, look)      the banteng, the red ox (วัวแดง) of Nong Wua Daeng: standing or walking
//   bambooRat(x, y, t, look)    the hoary bamboo rat (ตุ่น) of Ban Tun: standing or digging

// A smooth closed shape through points (mid-point quadratics), ready to fill and stroke. Draws nothing yet.
// e.g. mgSmooth([[0, 0], [20, -10], [30, 10]]);
function mgSmooth(points) {
  var n = points.length;
  pen.beginPath();
  pen.moveTo((points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2);
  for (var k = 1; k <= n; k++) {
    var p = points[k % n], q = points[(k + 1) % n];
    pen.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
  }
  pen.closePath();
}

// Fills the shape just made and lines it: fill a colour or a gradient, ink the line's colour, width its width
// (the kit's LINE unless told). e.g. mgPaint("#f6efe2", "#8a7458");
function mgPaint(fill, ink, width) {
  pen.fillStyle = fill;
  pen.fill();
  pen.strokeStyle = ink;
  pen.lineWidth = width || LINE;
  pen.stroke();
}

// ---------- the sambar ----------
// The sambar (Rusa unicolor, กวางป่า), read from photographs: the largest deer of the north, a hind about 1.1 m at the
// shoulder; a deep barrel of a body on long legs; a thick neck with a shaggy mane; a long head with a broad muzzle;
// large round ears held out; a long tail, dark-tipped. A calf has no spots. The first of Chiang Mai's seven signs:
// "two white sambar deer, a mother and her young, came out of the great forest to the north and stayed in this place"
// (กวางเผือกสองตัวแม่ลูก: ตำนานพื้นเมืองเชียงใหม่, as the Thai Wikipedia page on ชัยมงคล 7 ประการ quotes it).
// White (เผือก) is drawn by the white elephant's seven marks, written into the Wild Elephant Act of 2464 (1921): white
// eyes, palate, nails, hair, tail hair, and skin white "or like a new clay pot" (หม้อใหม่, a pale pinkish red), as Daily
// News and Silpa Wattanatham describe them; the white cattle of Lamphun, the north's own white breed, are told the
// same way, with pink rims to the eyes. So: white hair, pale hooves, a pale eye, pink skin where it shows.
var SAMBARS = {
  white: {coat: "#faf6f0", shade: "#ece0d6", line: "#b4948c", ear: "#f0bcb8", eye: "#b89870", muzzle: "#eab8b0", hoof: "#e6d6c8", rim: "#e8a8a4"},
  wild:  {coat: "#6a4a30", shade: "#4a3220", line: "#2a1a10", ear: "#8a6448", eye: "#1a1210", muzzle: "#3a2a20", hoof: "#2a2018", rim: null}
};
var SAMBAR_KEYS = {white: true, calf: true, size: true, face: true, step: true, graze: true, seed: true};

// sambar(x, y, t, look): its feet on (x, y). look: white (true: the white sambar of the sign), calf (true: a young
// one, smaller, longer-legged for its size), size (1: a hind, about 235 at the shoulder), face, step (grows while it
// walks), graze (0 to 1), seed. Returns {nose, seat}: points of the sheet. It draws with pen.
// e.g. sambar(600, GROUND, t, {white: true, step: t * 0.8}); sambar(760, GROUND, t, {white: true, calf: true});
function sambar(x, y, t, look) {
  checkNames("The sambar's name", look, SAMBAR_KEYS);
  var c = SAMBARS[look.white ? "white" : "wild"], calf = !!look.calf, size = (look.size || 1) * (calf ? 0.58 : 1), face = look.face || 1;
  var own = t + (look.seed || 0), graze = clamp(look.graze || 0), walking = look.step !== undefined;
  var keepLine = LINE, keepFine = FINE;
  FINE = Math.min(1, Math.pow(size, -0.7));
  LINE = 2.2 * FINE;
  pen.fillStyle = "rgba(70, 45, 30, 0.16)";
  pen.beginPath(); pen.ellipse(x, y + 4, 170 * size, 13 * size, 0, 0, 7); pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  var leg = calf ? 1.12 : 1;                          // a calf stands taller on its legs for its size
  var legs = [[-116, -196 * leg, 0, -1, false], [104, -192 * leg, 0.25, 1, false], [-100, -198 * leg, 0.5, -1, true], [120, -194 * leg, 0.75, 1, true]];
  var bones = [96 * leg, 92 * leg, 12];
  function hoof(ax, ay, skin, lifted) {
    pen.save(); pen.translate(ax, ay); pen.rotate(lifted ? 0.45 : 0);
    pen.beginPath(); pen.moveTo(-8, -4); pen.lineTo(-10, 10); pen.lineTo(11, 10); pen.lineTo(8, -4); pen.closePath();
    mgPaint(c.hoof, c.line, 1.6 * FINE);
    pen.strokeStyle = c.line; pen.lineWidth = 1.2; pen.beginPath(); pen.moveTo(1, 0); pen.lineTo(1, 10); pen.stroke();   // cloven
    pen.restore();
  }
  var gait = {step: walking ? look.step : undefined, slope: 0};
  beastLegs(legs, true, gait, bones, [17, 10, 7], c.shade, 70, 26, hoof);
  var top = -196 * leg;
  pen.save();                                       // the tail: long, raised a little, its tip darker
  pen.translate(-176, top - 6);
  pen.rotate(0.5 + 0.12 * Math.sin(own * 2.1));
  mgSmooth([[0, -8], [30, -6], [70, -2], [86, 6], [72, 12], [30, 8], [0, 8]]);
  mgPaint(c.coat, c.line);
  mgSmooth([[62, -2], [86, 6], [72, 12], [60, 9]]);
  pen.fillStyle = c.shade; pen.fill();
  pen.restore();
  var breathe = Math.sin(own * 1.8) * 1.2;
  mgSmooth([[150, top - 20], [90, top - 34 - breathe], [0, top - 30 - breathe], [-110, top - 36], [-178, top - 18], [-190, top + 40],   // the body: a deep barrel
               [-150, top + 92], [-60, top + 104], [40, top + 106], [120, top + 92], [168, top + 40]]);
  var g = pen.createLinearGradient(0, top - 36, 0, top + 106);
  g.addColorStop(0, c.coat); g.addColorStop(1, c.shade);
  mgPaint(g, c.line);
  beastLegs(legs, false, gait, bones, [17, 10, 7], c.coat, 70, 26, hoof);
  pen.save();                                       // the neck, thick, with its shaggy mane; down to graze
  pen.translate(126, top - 4);
  var nod = walking ? 0.05 * Math.sin(look.step * Math.PI * 4) : 0.03 * Math.sin(own * 0.9);
  pen.rotate(0.3 + graze * 1.1 + nod);              // the neck leans forward, the head carried a little above the back
  mgSmooth([[-36, 24], [-40, -24], [-16, -84], [22, -110], [60, -100], [58, -46], [44, 12], [8, 34]]);
  mgPaint(c.coat, c.line);
  pen.strokeStyle = c.shade; pen.lineWidth = 2.4;   // the mane: a ruff of strokes down the front of the neck
  pen.beginPath();
  for (var m = 0; m < 9; m++) {
    var u = m / 8, mx = mix(54, 34, u), my = mix(-90, 10, u);
    pen.moveTo(mx, my); pen.lineTo(mx + 12 + 4 * Math.sin(own * 2 + m), my + 14);
  }
  pen.stroke();
  pen.translate(40, -104);
  pen.rotate(0.15 - graze * 0.15);
  [[-1, 0.25], [1, 0]].forEach(function (ear) {      // the ears: large, round, held out
    pen.save();
    pen.translate(-6 + ear[0] * 6, -18);
    pen.rotate(-2.3 + 0.12 * Math.sin(own * 1.3 + ear[0]) + ear[1]);
    mgSmooth([[0, -10], [26, -18], [52, -12], [58, 0], [46, 12], [16, 12], [0, 8]]);
    mgPaint(ear[0] < 0 ? c.shade : c.coat, c.line);
    if (ear[0] > 0) { mgSmooth([[10, -6], [32, -10], [46, -2], [32, 6], [12, 4]]); pen.fillStyle = c.ear; pen.fill(); }
    pen.restore();
  });
  mgSmooth([[-14, -22], [24, -30], [70, -20], [104, 0], [108, 20], [92, 30], [50, 26], [6, 22], [-18, 8]]);   // the head: long, the muzzle broad
  mgPaint(c.coat, c.line);
  mgSmooth([[84, 2], [104, 0], [110, 18], [96, 30], [80, 22]]);   // the muzzle and nostril
  pen.fillStyle = c.muzzle; pen.fill();
  oval(102, 8, 3, 2.2, c.line);
  pen.strokeStyle = c.line; pen.lineWidth = 1.6; pen.beginPath(); pen.moveTo(78, 24); pen.quadraticCurveTo(90, 28, 102, 24); pen.stroke();
  if (c.rim) { oval(30, -8, 9.5, 8.5, c.rim); }     // a white one's pink rim round the eye
  oval(30, -8, 7.5, 6.5, "#fffaf2");                // the large eye, soft lashes over it, and the gland below it
  oval(31.5, -8, 5, 5.4, c.eye);
  oval(33, -10, 1.6, 1.6, "#ffffff");
  pen.strokeStyle = c.line; pen.lineWidth = 1.4;
  pen.beginPath(); pen.moveTo(22, -14); pen.quadraticCurveTo(30, -17, 40, -13); pen.stroke();
  pen.beginPath(); pen.moveTo(36, 4); pen.quadraticCurveTo(44, 7, 50, 5); pen.stroke();
  var nose = pen.getTransform().transformPoint(new DOMPoint(108, 14));
  pen.restore();
  pen.restore();
  LINE = keepLine; FINE = keepFine;
  return {nose: [nose.x, nose.y], seat: [x - 10 * size * face, y + top * size]};
}

// ---------- the hill myna ----------
// The hill myna (Gracula religiosa, นกขุนทอง), the bird of the chronicle: Phra Ruang "จำแลงเพศเป็นนกขุนทอง คือนกเอี้ยง"
// and fell into the pond that is Nong Ian (เอี้ยง is the north's word for the mynas; the chronicle also says "นกสาลิกา
// คือนกเอี้ยง"). Read from photographs: glossy black all over with a purple and green sheen, bare bright yellow wattles
// behind the eye and down the nape, a stout orange-yellow bill, a white patch in the wing, yellow legs, a short tail;
// it hops along a branch more than it walks.
var MYNA_KEYS = {size: true, face: true, step: true, flap: true};

// hillMyna(x, y, t, look): its feet on (x, y). look: size (1: about 50 tall), face, step (grows while it hops), flap
// (0 to 1: its wings opening). Returns nothing: it draws with pen.
// e.g. hillMyna(500, 820, t, {size: 1.2, step: t});
function hillMyna(x, y, t, look) {
  checkNames("The myna's name", look, MYNA_KEYS);
  var s = look.size || 1, face = look.face || 1, flap = clamp(look.flap || 0), walk = look.step !== undefined;
  var hop = walk ? Math.max(0, Math.sin(look.step * Math.PI * 2)) * 6 : 0, keepLine = LINE;
  pen.save();
  pen.translate(x, y);
  pen.scale(s * face, s);
  LINE = 1.7 / s;
  pen.lineCap = "round";
  pen.strokeStyle = "#8a6a10"; pen.lineWidth = 3 / s + 1.4;   // the legs, yellow
  pen.beginPath(); pen.moveTo(-1, -13 - hop); pen.lineTo(-2, -hop); pen.moveTo(5, -13 - hop); pen.lineTo(5, -hop); pen.stroke();
  pen.strokeStyle = "#e8c030"; pen.lineWidth = 1.6; pen.stroke();
  pen.translate(0, -hop);
  mgSmooth([[-18, -24], [-36, -14], [-36, -9], [-14, -15]]);   // the short tail
  mgPaint("#14121a", "#050408");
  mgSmooth([[-22, -22], [-12, -38], [6, -44], [20, -40], [26, -26], [16, -13], [0, -10], [-16, -13]]);   // the body, glossy black
  var gloss = pen.createLinearGradient(-20, -44, 20, -10);
  gloss.addColorStop(0, "#2a1e3a"); gloss.addColorStop(0.45, "#14121a"); gloss.addColorStop(1, "#16241e");   // its purple and green sheen
  mgPaint(gloss, "#050408");
  pen.save();                                       // the wing, its white patch
  pen.translate(10, -35);
  pen.rotate(-1.3 * flap);
  mgSmooth([[2, -2], [-14, -6], [-30, -2], [-24, 6], [-4, 8]]);
  mgPaint("#1a1622", "#050408");
  mgSmooth([[-11, -1], [-18, 0], [-15, 4], [-8, 3]]);
  pen.fillStyle = "#f4f0e8"; pen.fill();
  pen.restore();
  mgSmooth([[12, -42], [15, -56], [26, -61], [36, -55], [37, -44], [29, -37], [18, -37]]);   // the head and neck
  mgPaint("#14121a", "#050408");
  mgSmooth([[20, -55], [25, -58], [24, -50], [20, -44], [17, -48]]);   // the yellow wattle behind the eye, down the nape
  pen.fillStyle = "#f2c81e"; pen.fill();
  mgSmooth([[26, -47], [31, -46], [30, -42], [26, -43]]);   // and the bare patch under the eye
  pen.fillStyle = "#f2c81e"; pen.fill();
  oval(29, -51.5, 2, 2, "#3a1a10"); oval(29.6, -52, 0.7, 0.7, "#ffffff");
  pen.beginPath(); pen.moveTo(35, -55); pen.quadraticCurveTo(46, -52, 47, -47); pen.lineTo(35, -45); pen.closePath();   // the stout bill, orange-yellow
  mgPaint("#f29a1a", "#8a4a08", 1 / s + 0.4);
  LINE = keepLine;
  pen.restore();
}

// ---------- the banteng ----------
// The banteng (Bos javanicus), the red ox (วัวแดง): the chronicle says Phra Ruang "กลับเป็นโคแดง" and fell into the
// pool that is Nong Wua Daeng. Which cattle a red ox was, the chronicle does not say; วัวแดง is the banteng's name in
// Thai, so a child hearing it pictures this one (the north's small humped village cattle are the other reading).
// Read from photographs: a wild ox of the dry forests, the cow chestnut red, white stockings on all four legs below the
// knee, a white patch on the rump, the muzzle pale, no hump, short horns curving up and in, a small dewlap.
var BANTENG_KEYS = {size: true, face: true, step: true};

// banteng(x, y, t, look): its feet on (x, y). look: size (1: about 300 at the shoulder), face, step. Returns nothing.
// e.g. banteng(900, GROUND, t, {size: 0.6, step: t * 0.7});
function banteng(x, y, t, look) {
  checkNames("The banteng's name", look, BANTENG_KEYS);
  var s = look.size || 1, face = look.face || 1, walking = look.step !== undefined;
  var keepLine = LINE, keepFine = FINE;
  FINE = Math.min(1, Math.pow(s, -0.7));
  LINE = 2.2 * FINE;
  pen.fillStyle = "rgba(70, 45, 30, 0.16)";
  pen.beginPath(); pen.ellipse(x, y + 4, 200 * s, 15 * s, 0, 0, 7); pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(s * face, s);
  var coat = "#a8482a", shade = "#7a3020", ink = "#3a1a10";
  var legs = [[-130, -206, 0, -1, false], [118, -204, 0.25, 1, false], [-112, -208, 0.5, -1, true], [134, -206, 0.75, 1, true]];
  function hoof(ax, ay, skin, lifted) {
    pen.save(); pen.translate(ax, ay); pen.rotate(lifted ? 0.4 : 0);
    pen.beginPath(); pen.moveTo(-10, -4); pen.lineTo(-12, 10); pen.lineTo(13, 10); pen.lineTo(10, -4); pen.closePath();
    mgPaint("#2a2420", "#100c0a", 1.6);
    pen.restore();
  }
  function stocking(far) {                          // the white stockings: the lower legs painted white over the coat
    return far ? "#e4dcd0" : "#f6f0e6";
  }
  var gait = {step: walking ? look.step : undefined, slope: 0};
  beastLegs(legs, true, gait, [104, 96, 12], [24, 15, 11], stocking(true), 74, 22, hoof);
  mgSmooth([[-190, -200], [-206, -170], [-188, -134], [-120, -118], [0, -112], [104, -120], [160, -146], [168, -196],   // the body: deep, no hump
               [144, -244], [60, -250], [-60, -246], [-164, -236]]);
  var g = pen.createLinearGradient(0, -250, 0, -112); g.addColorStop(0, coat); g.addColorStop(1, shade);
  mgPaint(g, ink);
  mgSmooth([[-190, -200], [-204, -174], [-188, -144], [-160, -156], [-162, -200], [-176, -224]]);   // the white rump patch
  pen.fillStyle = "#f6f0e6"; pen.fill();
  beastLegs(legs, false, gait, [104, 96, 12], [24, 15, 11], stocking(false), 74, 22, hoof);
  pen.save();                                       // the near legs' upper halves again over the stockings: coat to the knee
  [[-130, -206], [118, -204]].forEach(function (l) { mgSmooth([[l[0] - 22, l[1] + 40], [l[0] + 22, l[1] + 40], [l[0] + 12, l[1] + 100], [l[0] - 12, l[1] + 100]]); mgPaint(coat, ink); });
  pen.restore();
  pen.save();                                       // the neck, the dewlap and the head, carried low
  pen.translate(150, -214);
  var nod = walking ? 0.05 * Math.sin(look.step * Math.PI * 4) : 0.03 * Math.sin(t * 0.8);
  pen.rotate(0.25 + nod);
  mgSmooth([[-30, -30], [20, -44], [70, -34], [96, 6], [60, 40], [20, 60], [-10, 50], [-34, 20]]);
  mgPaint(coat, ink);
  mgSmooth([[20, 40], [50, 46], [40, 76], [16, 70]]);   // the dewlap
  mgPaint(shade, ink);
  pen.translate(80, -10);
  pen.rotate(0.35);
  [[-1, "#d8d0b0"], [1, "#efe6c8"]].forEach(function (h) {   // the horns: short, curving up and in
    pen.beginPath(); pen.moveTo(-6 + h[0] * 4, -26); pen.quadraticCurveTo(-26 + h[0] * 6, -62, -2 + h[0] * 10, -78);
    pen.lineTo(4 + h[0] * 10, -72); pen.quadraticCurveTo(-14 + h[0] * 6, -58, 8 + h[0] * 4, -26); pen.closePath();
    mgPaint(h[1], ink, 1.6);
  });
  mgSmooth([[-18, -30], [30, -34], [72, -10], [84, 24], [70, 40], [36, 34], [-10, 20], [-22, -6]]);   // the head
  mgPaint(coat, ink);
  mgSmooth([[56, 6], [84, 14], [84, 34], [66, 40], [50, 28]]);   // the pale muzzle
  pen.fillStyle = "#e8d8c0"; pen.fill();
  oval(76, 18, 3, 2.4, ink);
  mgSmooth([[-8, -26], [-30, -30], [-40, -20], [-24, -14]]);   // the ear
  mgPaint(shade, ink);
  oval(22, -8, 7, 6, "#fff6ea"); oval(23.5, -8, 4.6, 5, "#1f1410"); oval(25, -9.6, 1.4, 1.4, "#ffffff");
  pen.restore();
  pen.restore();
  LINE = keepLine; FINE = keepFine;
}

// ---------- the bamboo rat ----------
// The hoary bamboo rat (Rhizomys pruinosus, ตุ่น), Phra Ruang's last shape: he burrowed into the ground until hard rock
// at the foot of a hill stopped him, at Ban Tun, and Ngam Mueang's spade dug the channel that is Mae Tun. Read from
// photographs: a stout burrower of the bamboo, grey-brown frosted with pale tips, a blunt head, tiny eyes, small round
// ears, great orange gnawing teeth, short strong legs with digging claws, a short nearly bare tail.
var BAMBOO_RAT_KEYS = {size: true, face: true, dig: true};

// bambooRat(x, y, t, look): its feet on (x, y). look: size (1: about 40 long), face, dig (0 to 1: its head down and
// its fore feet scrabbling, earth flying). Returns nothing: it draws with pen.
// e.g. bambooRat(700, GROUND, t, {size: 2, dig: 1});
function bambooRat(x, y, t, look) {
  checkNames("The bamboo rat's name", look, BAMBOO_RAT_KEYS);
  var s = look.size || 1, face = look.face || 1, dig = clamp(look.dig || 0);
  pen.fillStyle = "rgba(60, 40, 30, 0.18)";
  pen.beginPath(); pen.ellipse(x, y + 2, 40 * s, 5 * s, 0, 0, 7); pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(s * face, s);
  var keepLine = LINE;
  LINE = 1.7 / s;
  var scrabble = dig * Math.sin(t * 22);
  pen.strokeStyle = "#5a4636"; pen.lineWidth = 4.4; pen.lineCap = "round";   // the legs, short and strong
  pen.beginPath(); pen.moveTo(-20, -10); pen.lineTo(-22, 0); pen.moveTo(18, -10); pen.lineTo(24 + 8 * scrabble, -2 * Math.abs(scrabble)); pen.stroke();
  pen.strokeStyle = "#e8d8c8"; pen.lineWidth = 1.4;
  pen.beginPath(); pen.moveTo(24 + 8 * scrabble, 0); pen.lineTo(30 + 8 * scrabble, 1); pen.stroke();   // the claws
  pen.beginPath(); pen.moveTo(-38, -10); pen.quadraticCurveTo(-50, -8, -54, -2);   // the short bare tail
  pen.strokeStyle = "#c8a8a0"; pen.lineWidth = 3.4; pen.stroke();
  pen.rotate(dig * 0.25);
  mgSmooth([[-40, -10], [-36, -28], [-10, -36], [18, -32], [36, -22], [40, -8], [20, -4], [-20, -4]]);   // the body: stout
  var g = pen.createLinearGradient(0, -36, 0, -4); g.addColorStop(0, "#9a8c80"); g.addColorStop(1, "#6a5a4c");
  mgPaint(g, "#2e241c");
  pen.strokeStyle = "rgba(240, 234, 226, 0.7)"; pen.lineWidth = 1;   // the frosted tips of its fur
  pen.beginPath();
  for (var k = 0; k < 14; k++) { var fx = -32 + k * 4.6, fy = -30 + 3 * Math.sin(k); pen.moveTo(fx, fy); pen.lineTo(fx + 2, fy - 3); }
  pen.stroke();
  mgSmooth([[26, -26], [44, -26], [56, -16], [54, -6], [40, -4], [28, -10]]);   // the head, blunt
  mgPaint("#8a7c70", "#2e241c");
  mgSmooth([[24, -28], [30, -32], [34, -26]]);   // the small round ear
  mgPaint("#7a6a5c", "#2e241c", 1.2);
  oval(43, -19, 1.6, 1.6, "#120c0a");               // the tiny eye
  pen.fillStyle = "#e88a2a"; pen.strokeStyle = "#6a3a10"; pen.lineWidth = 0.8;   // the great orange teeth
  pen.beginPath(); pen.rect(51, -8, 3, 7); pen.fill(); pen.stroke();
  oval(56, -13, 2, 1.6, "#d8a0a0");
  LINE = keepLine;
  pen.restore();
  if (dig > 0) {                                    // earth flying back from its scrabbling feet
    for (var n = 0; n < 6; n++) {
      var u = (t * 2 + n / 6) % 1;
      oval(x + face * s * (20 - u * 70), y - s * (6 + 30 * Math.sin(u * Math.PI)), 2.4 * s, 2 * s, "#7a5a38");
    }
  }
}
