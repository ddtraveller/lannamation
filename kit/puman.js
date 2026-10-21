// puman.js - the whisperer: a paperdoll on the kit (see paperdoll.js).
//
// Read from the Lanna mural of the whispering couple (Wat Phumin, Nan, as
// photographed in a reference the owner gave) on 2026-10-12, with the men of
// its neighbouring scene for the shoulder cloth. Nothing of the mural is
// copied: these are what it shows, as rules, with the numbers measured on it
// (a 1280 by 960 photograph; the man 540 px from his knot to his feet).
//  1. An ochre wall behind him (#d89143), with the mural's thin dark-brown
//     line round everything and colour flat or softly shaded inside it.
//  2. Pale warm skin (#ebc8ab, shade #d9ad8e); cropped black hair (#2a1f22)
//     with a small round knot on the crown and a low, smooth hairline.
//  3. A long face with a pointed chin; narrow eyes that look sideways, to the
//     listener; a thin brow; a small nose; a small closed smile.
//  4. A bare chest and long thin arms; a red-orange shoulder cloth (#c9573a)
//     with purple dots (#72519a) over one shoulder, its end hanging behind.
//  5. From the waist to just above the knee one dark region: a short
//     loincloth of black-indigo cloth (#1f1b2b) with a pale pattern, and
//     below it the tattooed thighs, the same black-indigo filled with pale
//     scrollwork (#b9a98f), ending in a pale patterned band above the knee.
//     A red cloth end hangs from the near hip.
//  6. Bare shins and bare feet, the toes drawn.
//  7. The pose: he leans to the listener, one hand raised beside his mouth
//     with the fingers curled, the other arm round her shoulder.
//
// What the sources say (2026-10-13, Manop Manasaem's history of Tai Yuan
// dress in CMU's Fine Arts Journal, and the descriptions of the Wat Phra
// Singh murals): a man's cloth was pha ta kong, hand-woven cotton in a
// black-and-white check, hitched between the legs (pha toi) or pulled tight
// to show the hips and the tattoos; the tattoos ran from the waist to the
// knee or a little below (sak kha yao), or to mid-thigh (sak kha kom), in
// black ink dense enough that the thigh reads dark, the skin showing between
// the scrolls. So the loincloth is now the check (the kit's "checks" bands)
// and the skin shows through the tattoo; the mural's dark patterned cloth
// was the painter's. The tattoo is the short form unless a scene says
// tattoo: "long", which takes it to the knee and a little below. The knot on the crown is the Burmese fashion the mural
// names him for (ม่าน), not the Tai Yuan crop.

var PUMAN = {
  wall: "#d89143", skin: "#ebc8ab", shade: "#d9ad8e", hair: "#2a1f22",
  cloth: "#c9573a", clothFold: "#a2412a", clothCrease: "#6e2a1a", dot: "#72519a",
  ink: "#1f1b2b", pale: "#b9a98f", band: "#c9b99c", cotton: "#ece3cf"
};

// The cast member. His shirt is his skin: the chest is bare. The kit's sabai,
// in the cloth's red, is the shoulder cloth where it crosses his chest.
CAST.puman = {shirt: PUMAN.skin, legs: PUMAN.skin, plain: true, buttons: false, sabai: [PUMAN.cloth, PUMAN.cloth],
              skin: PUMAN.skin, eyes: 0.9, lips: 0.9,
              size: 1.35, smile: 0.7, turn: 0.3, tilt: -0.04};

// the shoulder cloth and the loincloth's end: red-orange with purple dots, flame-pointed
var PUMAN_CLOTH = {
  colour: PUMAN.cloth, fold: PUMAN.clothFold, crease: PUMAN.clothCrease, wide: 12, pleats: false, tip: "flame",
  pattern: function (left, right, Q, A, wide, s, line, panelAt) {
    pen.fillStyle = PUMAN.dot;
    for (var n = 2; n < Q.length - 2; n++) {
      for (var k = -1; k <= 1; k += 2) {
        var d = walk(Q[n], A[n] + Math.PI / 2, k * wide[n] * 0.45 * ((n + k) % 2 ? 1 : 0.4));
        pen.beginPath();
        pen.arc(d[0], d[1], 1.7 * s, 0, 7);
        pen.fill();
      }
    }
  }
};

// a thigh's tattoo: the dark ground along the bone, pale scrolls inside it, and the band above the knee.
// "reach" is "long" for the sak kha yao, from the waist to the knee and a little below; otherwise the
// sak kha kom, which stops short of the knee
function thighTattoo(from, to, s, line, reach) {
  var a = angleTo(from, to), long = dist(from, to);
  var end = walk(from, a, reach === "long" ? long + 4 * s : long - 10 * s);
  bone(from[0], from[1], end[0], end[1], 15.5 * s, 12.5 * s, 3 * s);
  pen.fillStyle = "rgba(31, 27, 43, 0.78)";                       // dense ink, the skin showing through
  pen.fill();
  pen.save();
  pen.clip();
  pen.strokeStyle = PUMAN.skin;                                   // scrolls: the skin between the ink, small spirals in rows and lines between
  pen.lineWidth = Math.max(1, 0.7 * line);
  pen.lineCap = "round";
  for (var row = 0; row < 4; row++) {
    var u = 0.12 + row * 0.22, c = walk(from, a, long * u);
    for (var k = -1; k <= 1; k++) {
      var at = walk(c, a + Math.PI / 2, k * 8.5 * s);
      pen.beginPath();
      pen.arc(at[0], at[1], 3.2 * s, a + k, a + k + 4.8);
      pen.stroke();
    }
    var l = walk(walk(from, a, long * (u + 0.11)), a + Math.PI / 2, -13 * s), r = walk(walk(from, a, long * (u + 0.11)), a + Math.PI / 2, 13 * s);
    pen.beginPath();
    pen.moveTo(l[0], l[1]);
    pen.quadraticCurveTo((l[0] + r[0]) / 2 + Math.cos(a) * 3 * s, (l[1] + r[1]) / 2 + Math.sin(a) * 3 * s, r[0], r[1]);
    pen.stroke();
  }
  var bandAt = walk(from, a, long - 16 * s);                      // a narrow pale band above the knee, with dark marks
  bone(bandAt[0], bandAt[1], end[0], end[1], 13 * s, 12.8 * s, 0);
  pen.fillStyle = PUMAN.band;
  pen.fill();
  pen.fillStyle = PUMAN.ink;
  for (var m = -2; m <= 2; m++) {
    var mark = walk(walk(from, a, long - 13 * s), a + Math.PI / 2, m * 5 * s);
    pen.beginPath();
    pen.arc(mark[0], mark[1], 1.1 * s, 0, 7);
    pen.fill();
  }
  pen.restore();
  pen.strokeStyle = inkFor(PUMAN.ink);                            // the line round the whole
  pen.lineWidth = line * 0.8;
  bone(from[0], from[1], end[0], end[1], 15.5 * s, 12.5 * s, 3 * s);
  pen.stroke();
}

var PUMAN_DOLL = {
  name: "puman",
  arms: "skin",
  keys: ["tattoo"],                                              // tattoo: "long" reaches the knee

  // In the waist's frame: the tattooed thighs on the sheet, then the
  // loincloth over the hips and the red cloth end hanging from the near hip.
  costume: function (doll, farX, farY) {
    var J = doll.joints, s = doll.scale, line = lineOf(doll);
    if (J && J.hip && J.kneeA && J.kneeB) {
      pen.save();
      pen.setTransform(1, 0, 0, 1, 0, 0);
      var hip = xy(J.hip), face = J.face || 1;
      thighTattoo([hip[0] - 20 * s * face, hip[1]], xy(J.kneeB), s, line, doll.own.tattoo);   // the far thigh first
      thighTattoo([hip[0] + 20 * s * face, hip[1]], xy(J.kneeA), s, line, doll.own.tattoo);
      var tail = doll.chains.tail;
      if (tail && tail.points) { scarfEnd(tail.points, s, line, PUMAN_CLOTH); }
      pen.restore();
    }
    var hips = hipsOf(doll);
    pen.save();
    pen.transform(1, hips[1], 0, 1, 0, 0);
    tier(46, 62, 12, hips[0], PUMAN.cotton, 4,                   // the loincloth: short, the black-and-white check of a pha ta kong, a red hem band
         [[0.1, PUMAN.ink, 6.5, "checks"], [0.25, PUMAN.ink, 6.5, "checks-odd"], [0.4, PUMAN.ink, 6.5, "checks"],
          [0.55, PUMAN.ink, 6.5, "checks-odd"], [0.7, PUMAN.ink, 6.5, "checks"], [0.85, PUMAN.ink, 6.5, "checks-odd"],
          [0.95, PUMAN.cloth, 3]], null);
    doll.tailLead = onScreen(26, 8);                              // where the red end hangs from
    pen.restore();
  },

  // The knot on the crown, in the head's frame after the face.
  onFace: function (doll, V) {
    oval(2, -386, 11, 9, STYLE.hair);
    pen.strokeStyle = "#7a5640";
    pen.lineWidth = 1.6 * FINE;
    pen.beginPath();
    pen.ellipse(2, -386, 7, 5, 0.3, 0, 7);
    pen.stroke();
  },

  // What hangs behind him: the shoulder cloth's end, from the far shoulder.
  behind: function (doll, s, line) {
    var end = doll.chains.cloth;
    if (end && end.points) { scarfEnd(end.points, s, line, PUMAN_CLOTH); }
  },

  advance: function (doll, dt, s) {
    if (doll.rootB) { chainStep(chainOf(doll, "cloth", 10, 12 * s, Math.PI / 7, 260 * s, 0.85), [doll.rootB[0] - 6 * s, doll.rootB[1] + 4 * s], dt, floorOf(doll)); }
    if (doll.tailLead) { chainStep(chainOf(doll, "tail", 6, 11 * s, Math.PI / 8, 420 * s, 0.7), doll.tailLead, dt, floorOf(doll)); }
  }
};

function puman(x, y, more) { paperdoll(PUMAN_DOLL, x, y, more); }
