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
  giantess:  {skin: "#a8452f", dark: "#5a2414", crown: null, hair: "#e8e3da", eye: "#2a8a4a"}
};

function ogFill(fill, ink, width) { pen.fillStyle = fill; pen.fill(); pen.strokeStyle = ink; pen.lineWidth = width || 2; pen.stroke(); }

// ogreHead(j, kind, face, t): the head drawn over the person's, j what person() gave back.
// person() gives its joints in pixels of the sheet, through all the pen's turns and scales (PIX to a film pixel, and a
// scene's camera); the head is drawn with the pen as it is now, so each joint is taken back through the pen's
// transform (ogJoint). Until 2026-11-11 they were used as they came: on a film's page, at two pixels, the head was drawn
// at twice its place and size, off the body.
function ogJoint(p) {
  var m = pen.getTransform().inverse();
  return [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f];
}
function ogreHead(j, kind, face, t) {
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
  var open = 0.5 + 0.5 * Math.sin(t * 1.3);
  pen.beginPath();                                  // the mouth: the width of the face, open, a row of teeth
  pen.moveTo(-36, 32); pen.quadraticCurveTo(0, 40 + 10 * open, 36, 32); pen.quadraticCurveTo(0, 54 + 10 * open, -36, 32); pen.closePath();
  ogFill("#6a1a1a", ink, 2);
  pen.fillStyle = "#fffaf0"; pen.fillRect(-26, 33, 52, 5);
  [[-32, 1], [32, -1]].forEach(function (f) {       // the fangs rising from the corners
    pen.beginPath(); pen.moveTo(f[0] - 4 * f[1], 36); pen.lineTo(f[0] + 4 * f[1] * 0.2, 14); pen.lineTo(f[0] + 4 * f[1], 36); pen.closePath();
    ogFill("#fffaf0", ink, 1.4);
  });
  if (c.crown === "spire") {                        // the spire crown (ชฎา) of gold, in tiers, the flames at the ears
    pen.beginPath(); pen.moveTo(-52, -42); pen.quadraticCurveTo(0, -70, 52, -42); pen.lineTo(46, -58); pen.quadraticCurveTo(0, -80, -46, -58); pen.closePath();
    ogFill("#e0b23a", "#7a4a10");
    for (var tier = 0; tier < 4; tier++) {
      var w = 40 - tier * 9, y0 = -66 - tier * 24;
      pen.beginPath(); pen.moveTo(-w, y0); pen.lineTo(-w + 5, y0 - 24); pen.lineTo(w - 5, y0 - 24); pen.lineTo(w, y0); pen.closePath();
      ogFill(tier % 2 ? "#e0b23a" : "#d8a02e", "#7a4a10", 1.6);
      oval(0, y0 - 12, 3, 3, "#c8202a");
    }
    pen.beginPath(); pen.moveTo(-6, -162); pen.lineTo(0, -196); pen.lineTo(6, -162); pen.closePath(); ogFill("#e0b23a", "#7a4a10", 1.4);
    [-1, 1].forEach(function (side) {               // the gold flames flaring behind the ears
      pen.beginPath(); pen.moveTo(side * 56, -30); pen.quadraticCurveTo(side * 96, -50, side * 90, -90); pen.quadraticCurveTo(side * 76, -56, side * 58, -46); pen.closePath();
      ogFill("#e0b23a", "#7a4a10", 1.4);
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
// told. Returns the joints person() gives back.
// e.g. var j = ogre(1300, GROUND, t, {kind: "forest", face: -1, step: t * 0.5, at: [600, 700]});
function ogre(x, y, t, look) {
  look = look || {};
  var kind = OGRES[look.kind] ? look.kind : "mural";
  if (look.kind && !OGRES[look.kind]) { checkName("The ogre's kind", look.kind, OGRES); }
  var given = Object.assign({}, look);
  delete given.kind;
  var j = person(x, y, Object.assign({size: 1.75, skin: OGRES[kind].skin, hidden: ["hair"], buttons: false, feel: "angry"}, OGRE_LOOKS[kind], given));
  ogreHead(j, kind, given.face || 1, t);
  return j;
}
