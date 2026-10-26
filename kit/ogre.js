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
// Its face: round white eyes that bulge and roll, a ring round each, thick curled brows, a broad nose, a mouth the
// width of the face with a row of teeth and a fang rising from each corner, big ears with gold rings.
//   ogre(x, y, t, look)        draws the whole ogre and gives back the person's joints; look: kind (one of OGRES), and
//                              any of person()'s keys (size, face, step, at, feel, reachA...), which win over the
//                              kind's own
//   ogreHead(j, kind, face, t) the head alone, over a person drawn by the scene (j what person() gave back)

var OGRES = {
  mural:  {skin: "#2f7f4e", dark: "#1a4a2e", crown: "spire", hair: null, eye: "#3a5fae"},
  forest: {skin: "#4a5a6a", dark: "#2a323c", crown: null, hair: "#1a1a1e", eye: "#c8302a"},
  king:   {skin: "#c8452f", dark: "#7a2414", crown: "spire", hair: null, eye: "#2a8a4a"}
};

function ogFill(fill, ink, width) { pen.fillStyle = fill; pen.fill(); pen.strokeStyle = ink; pen.lineWidth = width || 2; pen.stroke(); }

// ogreHead(j, kind, face, t): the head drawn over the person's, j what person() gave back.
function ogreHead(j, kind, face, t) {
  var c = OGRES[kind], cx = (j.crown[0] + j.chin[0]) / 2, cy = (j.crown[1] + j.chin[1]) / 2;
  var h = Math.hypot(j.chin[0] - j.crown[0], j.chin[1] - j.crown[1]), s = h / 100;
  var tilt = Math.atan2(j.chin[0] - j.crown[0], j.chin[1] - j.crown[1]);
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
  king:   {bare: true, regalia: true, sarong: ["#1e2a5a", BROCADE], turban: "#c8452f"}
};

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
