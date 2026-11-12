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
  ghoul:     {skin: "#7d8a6a", dark: "#3e4a34", crown: null, hair: "#2a2620", eye: "#d8c040"},
  ghoulPale: {skin: "#cfc6b4", dark: "#8a8070", crown: null, hair: "#e6e0d4", eye: "#c8302a"},
  ghoulDark: {skin: "#4a3230", dark: "#241614", crown: null, hair: "#151010", eye: "#e8862a"},
  // the old giantess under the palm at Varanasi's south gate (ย่ายักษ์เถ้า), red, her hair white (the owner's pick, C)
  giantess:  {skin: "#a8452f", dark: "#5a2414", crown: null, hair: "#e8e3da", eye: "#2a8a4a", long: true}
};

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
  ghoul:     {bare: true, sarong: "#4a3a24", patoi: 0.6, turban: "#2a2620", bend: 0.12, nails: "long"},
  ghoulPale: {bare: true, sarong: "#6a6458", patoi: 0.6, turban: "#e6e0d4", bend: 0.24, age: 0.7, nails: "long"},
  ghoulDark: {bare: true, sarong: "#2a1c18", patoi: 0.75, tattoo: true, turban: "#151010", bend: 0.08, nails: "long",
              beads: ["#efe6d2", "#d8ccb0", "#efe6d2"]},          // a string of bone beads
  // an old woman's body at the build of the paintings (build 1: the kit's old women are short, and the head looked too big)
  giantess:  {lady: true, shirt: "#24335e", sin: 2, age: 1, bend: 0.2, build: 1, nails: "long"}
};

// ogreMeat(p, turn): a raw haunch of meat, the bone's end showing, held at p (a joint person() gave back, in pixels of
// the sheet, as wristA) and turned by turn radians: what the ghouls carry and eat. Returns nothing; it draws with pen.
// e.g. var j = ogre(600, GROUND, t, {kind: "ghoul", reachA: [660, GROUND - 330]}); ogreMeat(j.wristA, -0.6);
function ogreMeat(p, turn) {
  pen.save();
  var at = ogJoint(p);
  pen.translate(at[0], at[1]);
  pen.rotate(turn || 0);
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
  ogreHead(j, kind, given.face || 1, t, jaw);
  return j;
}
