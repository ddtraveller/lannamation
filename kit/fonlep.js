// fonlep.js - the fingernail dancer: a paperdoll on the kit (see paperdoll.js).
//
// Read from a painting of a fon lep dancer (ฟ้อนเล็บ, the Lanna fingernail
// dance) on 2026-10-12. Nothing of the painting is copied: these are what it
// shows, as rules, with the numbers measured on it (1080 px square, the head
// 220 px from chin to crown).
//  1. Flat colour inside a fine dark line, 2 to 3 px: about 1/90 of the head.
//     (The kit's pen is 1/50 of the head at film size and 1/100 at size 2.)
//     Shade is a flat darker band on the far side of a fold, never a gradient.
//  2. The palette is the thangka's, as the notebook's sources name it:
//     vermilion, a darker red in the folds, malachite green, gold, lamp black,
//     pale skin. Measured: blouse #e84f37 (shade #a9232b), scarf #cd262b
//     (folds #a42324), green #3d7a3e (dark #1f4a24), gold #d9b24a (dark
//     #8a6a2a), black #07080c, skin #ecddd4, hair #26252c.
//  3. A vermilion blouse with a gold-trimmed V neck; the sleeves end in a
//     green cuff with gold edges, and gold bangles over it.
//  4. A long red scarf: over the far shoulder, across the body, gathered on
//     the raised forearm, and hanging from there down the back to the knee;
//     its last quarter a green panel with gold bands; its ends narrowing to
//     flame points. Where it folds, a sharp dark line and a darker band, and
//     pleats run down its length from the gather.
//  5. A green belt with gold motifs over a gold hip band with a black
//     interlace, over a black sin.
//  6. Hair pulled smooth into a high bun, with a tail to the hip; at the bun a
//     fan of eight gold leaves and five strands of gold beads that hang to the
//     waist and end in tassels; long drop earrings.
//  7. Long curved gold nails on every finger (the kit's short ones, until it
//     has long ones).
//  8. Pale skin, a long neck, the head in profile looking up, the brow and
//     the nose one line.
//
// What a fon lep dancer wore (2026-10-13, from Thai Wikipedia's ฟ้อนเล็บ,
// Indiana University's notes on the brass nails, and Manop Manasaem's history
// of Tai Yuan dress in CMU's Fine Arts Journal): a round-necked blouse with
// tube sleeves; a sabai worn diagonally across the chest; a sin striped
// across with a patterned foot; the high "Japanese" bun that Chao Dara Rasami
// brought north, ringed with orchid, jasmine or lamduan flowers, or with
// trembling brass flower sprays (dok mai wai); a lan hu ear plug, not a drop
// earring; all the hair in the bun, no tail; brass nails on eight fingers,
// never the thumbs (the kit never put one on a thumb). Nothing hangs from the
// arm. The blouse's sleeves are tubes, as wide at the wrist as at the elbow,
// with no cuff. So the doll now wears that, and the painting's dress - the scarf from
// the forearm, the green cuffs, the gold leaves and the bead strands, the
// hair tail, the black sin with the belt and the hip band - is the stage
// dress, asked for with stage: true.

var FONLEP = {
  blouse: "#e84f37", shade: "#a9232b", scarf: "#cd262b", fold: "#a42324", crease: "#7a1518",
  green: "#3d7a3e", greenDark: "#1f4a24", gold: "#d9b24a", goldDark: "#8a6a2a",
  black: "#07080c", skin: "#ecddd4", hair: "#26252c", orchid: "#c98fd0", silver: "#dde0e4", silverDark: "#7c8088"
};

// The cast member, dressed as the sources say: the kit's sabai, in the
// scarf's red, is the sabai across her chest from the far shoulder to the
// near hip; sin 2 is the brick-red sin ta with an indigo tin jok; plain is
// the round neck; the flower, the jasmine garland and the pins are what rings
// the bun; the ear plug is the lan hu. turn -1 is the profile; tilt lifts
// the chin.
CAST.fonlep = {sin: 2, bun: true, dance: true, nails: "long", bangles: 3, plain: true,
               shirt: FONLEP.blouse, legs: FONLEP.black, sabai: [FONLEP.scarf, FONLEP.scarf],
               flower: FONLEP.orchid, garland: true, pins: true, earplug: FONLEP.gold, skin: FONLEP.skin,
               size: 1.3, smile: 0.6, turn: -1, tilt: -0.45};

// the painting's dress, over the cast member, for stage: true
var FONLEP_STAGE = {skirt: true, sin: undefined, weave: 1, tail: true, fan: true, collar: [FONLEP.shade, FONLEP.gold],
                    plain: false, flower: false, garland: false, pins: false, earplug: false};

// the scarf's cloth, for scarfEnd() and drape()
var FONLEP_CLOTH = {
  colour: FONLEP.scarf, fold: FONLEP.fold, crease: FONLEP.crease, wide: 23, pleats: true, tip: "flame",
  panel: {colour: FONLEP.green, dark: FONLEP.greenDark},
  pattern: function (left, right, Q, A, wide, s, line, panelAt) {
    var count = Q.length, band, d, m;
    pen.strokeStyle = FONLEP.gold;                                // gold bands across the panel's start
    pen.lineWidth = 2.2 * s;
    pen.beginPath();
    for (band = 0; band < 2; band++) {
      var at = panelAt + band;
      var l = walk(Q[at], A[at] - Math.PI / 2, wide[at] * 0.96), r = walk(Q[at], A[at] + Math.PI / 2, wide[at] * 0.96);
      pen.moveTo(l[0], l[1]);
      pen.lineTo(r[0], r[1]);
    }
    pen.stroke();
    pen.lineWidth = 1.4 * s;                                      // and along its edges
    pen.beginPath();
    through(left.slice(panelAt, count - 1).map(function (p, k) { return walk(p, A[panelAt + k] + Math.PI / 2, 3 * s); }));
    through(right.slice(panelAt, count - 1).map(function (p, k) { return walk(p, A[panelAt + k] - Math.PI / 2, 3 * s); }));
    pen.stroke();
    pen.fillStyle = FONLEP.gold;                                  // gold diamonds down the panel
    for (d = panelAt + 2; d < count - 3; d++) {
      var c = Q[d], r2 = 3.2 * s;
      pen.beginPath();
      pen.moveTo(c[0], c[1] - r2);
      pen.lineTo(c[0] + r2 * 0.7, c[1]);
      pen.lineTo(c[0], c[1] + r2);
      pen.lineTo(c[0] - r2 * 0.7, c[1]);
      pen.closePath();
      pen.fill();
    }
    pen.fillStyle = FONLEP.crease;                                // the red's small pattern: sparse marks
    for (m = 3; m < panelAt; m += 2) {
      var spot = walk(Q[m], A[m] + (m % 4 === 1 ? 1 : -1) * Math.PI / 2, wide[m] * 0.45);
      pen.beginPath();
      pen.arc(spot[0], spot[1], 1.3 * s, 0, 7);
      pen.fill();
    }
  }
};

// the painting's belt and hip band, in the waist's frame, on the stage dress
function fonlepStageBelt(hips) {
  band(-6, 10, 28, 38, hips[0], FONLEP.green, function (c, middle, wide) {   // gold diamonds along the belt, with dots between
    var k;
    pen.fillStyle = FONLEP.gold;
    for (k = -wide; k <= wide; k += 11) {
      var dx = k + c.driftTop * 0.5;
      pen.beginPath();
      pen.moveTo(dx, middle - 4);
      pen.lineTo(dx + 3, middle);
      pen.lineTo(dx, middle + 4);
      pen.lineTo(dx - 3, middle);
      pen.closePath();
      pen.fill();
      pen.beginPath();
      pen.arc(dx + 5.5, middle, 1.1, 0, 7);
      pen.fill();
    }
    pen.strokeStyle = FONLEP.gold;                              // gold lines along both edges
    pen.lineWidth = 1.6 * FINE;
    pen.beginPath();
    pen.moveTo(-wide, -4);
    pen.lineTo(wide, -4);
    pen.moveTo(-wide, 8);
    pen.lineTo(wide, 8);
    pen.stroke();
  });
  band(10, 38, 38, 52, hips[0], FONLEP.gold, function (c, middle, wide) {   // a black interlace: two waves that cross each other
    var wave, px;
    pen.strokeStyle = FONLEP.black;
    pen.lineWidth = 4.2;
    pen.lineCap = "round";
    for (wave = -1; wave <= 1; wave += 2) {
      pen.beginPath();
      for (px = -wide; px <= wide; px += 2) {
        var py = middle + wave * 6.5 * Math.sin((px + c.driftBottom * 0.5) / 8);
        if (px === -wide) { pen.moveTo(px, py); } else { pen.lineTo(px, py); }
      }
      pen.stroke();
    }
    pen.strokeStyle = FONLEP.goldDark;                          // the band's own edges
    pen.lineWidth = 1.4 * FINE;
    pen.beginPath();
    pen.moveTo(-wide, 13);
    pen.lineTo(wide, 13);
    pen.moveTo(-wide, 35);
    pen.lineTo(wide, 35);
    pen.stroke();
  });
}

// a silver plate belt (tai aeo), as Lanna women wore over the sin's head:
// square links hooked one to the next, in the waist's frame
function fonlepSilverBelt(hips) {
  band(-4, 8, 28, 36, hips[0], FONLEP.silver, function (c, middle, wide) {
    var k;
    pen.strokeStyle = FONLEP.silverDark;
    pen.lineWidth = 1.2 * FINE;
    for (k = -wide + 2; k < wide - 2; k += 9) {                  // a link every 9, with a dot at its heart
      var dx = k + c.driftTop * 0.5;
      pen.strokeRect(dx, middle - 4, 7, 8);
      pen.beginPath();
      pen.arc(dx + 3.5, middle, 1.1, 0, 7);
      pen.stroke();
    }
    pen.beginPath();                                            // the belt's edges
    pen.moveTo(-wide, -3);
    pen.lineTo(wide, -3);
    pen.moveTo(-wide, 7);
    pen.lineTo(wide, 7);
    pen.stroke();
  });
}

// a tube sleeve over the forearm: from 4 above the wrist (the bangles show) to
// the elbow, 10 wide all the way; filled, then lined along its edges and its
// hem only, so no seam crosses the elbow
function fonlepTube(ex, ey, wx, wy) {
  var a = angleTo([wx, wy], [ex, ey]), ux = Math.cos(a), uy = Math.sin(a), half = 10;
  var from = 4, to = dist([wx, wy], [ex, ey]) + 2;
  var hemL = [wx + ux * from - uy * half, wy + uy * from + ux * half], hemR = [wx + ux * from + uy * half, wy + uy * from - ux * half];
  var topL = [wx + ux * to - uy * half, wy + uy * to + ux * half], topR = [wx + ux * to + uy * half, wy + uy * to - ux * half];
  pen.fillStyle = FONLEP.blouse;
  pen.beginPath();
  pen.moveTo(hemL[0], hemL[1]);
  pen.lineTo(topL[0], topL[1]);
  pen.lineTo(topR[0], topR[1]);
  pen.lineTo(hemR[0], hemR[1]);
  pen.closePath();
  pen.fill();
  pen.strokeStyle = inkFor(FONLEP.blouse);
  pen.lineWidth = 0.9 * LINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(topL[0], topL[1]);
  pen.lineTo(hemL[0], hemL[1]);
  pen.lineTo(hemR[0], hemR[1]);
  pen.lineTo(topR[0], topR[1]);
  pen.stroke();
}

var FONLEP_DOLL = {
  name: "fonlep",
  keys: ["stage"],                                               // hers alone, not the kit's

  // The belt, in the waist's frame: the silver plate belt, or the stage dress's belt and hip band.
  costume: function (doll, farX, farY) {
    var hips = hipsOf(doll);
    pen.save();
    pen.transform(1, hips[1], 0, 1, 0, 0);
    if (doll.own.stage) { fonlepStageBelt(hips); } else { fonlepSilverBelt(hips); }
    pen.restore();
  },

  // The sleeve. The dancer's blouse has tube sleeves (แขนกระบอก): a straight
  // sleeve as wide at the wrist as at the elbow, with no cuff, so over the
  // kit's tapering forearm a tube of the blouse's colour is laid from above
  // the bangles to the elbow, its two edges and its hem lined and its elbow
  // end open. On the stage dress: the green cuff on each sleeve, and the
  // scarf gathered round the near forearm.
  onArm: function (doll, side, ex, ey, wx, wy) {
    if (!doll.own.stage) { fonlepTube(ex, ey, wx, wy); return; }
    var u = sleeveBand(ex, ey, wx, wy, 5, 19, 9.4, 10.2, FONLEP.green);
    pen.strokeStyle = FONLEP.gold;                                // a gold edge at both ends of the cuff
    pen.lineWidth = 2;
    pen.lineCap = "round";
    pen.beginPath();
    for (var end = 0; end < 2; end++) {
      var at = end ? 17 : 7, half = end ? 10 : 9.4;
      pen.moveTo(wx + u[0] * at - u[1] * half, wy + u[1] * at + u[0] * half);
      pen.lineTo(wx + u[0] * at + u[1] * half, wy + u[1] * at - u[0] * half);
    }
    pen.stroke();
    if (side !== "A") { return; }
    sleeveBand(ex, ey, wx, wy, 21, 41, 12.5, 13.5, FONLEP.scarf, 2.5);   // the wrap, with the folds across it
    pen.strokeStyle = FONLEP.crease;
    pen.lineWidth = 0.9 * LINE;
    pen.lineCap = "round";
    for (var fold = 0; fold < 3; fold++) {
      var mid = 25 + fold * 6.5, lean = (fold - 1) * 2;
      pen.beginPath();
      pen.moveTo(wx + u[0] * (mid - lean) - u[1] * 11, wy + u[1] * (mid - lean) + u[0] * 11);
      pen.quadraticCurveTo(wx + u[0] * (mid + 3), wy + u[1] * (mid + 3), wx + u[0] * (mid + lean) + u[1] * 11, wy + u[1] * (mid + lean) - u[0] * 11);
      pen.stroke();
    }
  },

  // What hangs behind her on the stage dress: the bead strands from the bun,
  // the drape of the scarf from the far shoulder, and the scarf's hanging end.
  behind: function (doll, s, line) {
    if (!doll.own.stage) { return; }
    for (var k = 0; k < 5; k++) {
      var strand = doll.chains["bead" + k];
      if (strand && strand.points) { beads(strand.points, s, line, FONLEP.gold, FONLEP.goldDark); }
    }
    if (doll.leave) {                                             // thrown over a raised arm the cloth loops up; lowered, it sags
      var raised = clamp((doll.rootB[1] - doll.leave[1]) / (70 * s));   // how far the forearm is above the far shoulder, 0 to 1
      drape(doll.rootB, doll.leave, 300, s, line, FONLEP_CLOTH, 1 - 2.6 * raised);
    }
    var scarf = doll.chains.scarf;
    if (scarf && scarf.points) { scarfEnd(scarf.points, s, line, FONLEP_CLOTH); }
  },

  advance: function (doll, dt, s) {
    if (!doll.own.stage) { doll.leave = null; return; }
    doll.leave = leaveOf(doll, "A", 30);                          // the cloth leaves the forearm inside its wrap
    if (doll.leave) { chainStep(chainOf(doll, "scarf", 17, 14 * s, Math.PI / 7, 220 * s, 0.9), doll.leave, dt, doll.y + 2); }
    if (doll.bun) {                                               // five strands from below the bun, a little apart
      for (var k = 0; k < 5; k++) {
        var lead = [doll.bun[0] - 6 * s + (k - 2) * 3.5 * s, doll.bun[1] + (12 + Math.abs(k - 2) * 2) * s];
        chainStep(chainOf(doll, "bead" + k, 11, 10 * s, Math.PI / 16, 700 * s, 0.55), lead, dt, doll.y);
      }
    }
  }
};

// stage: true dresses her as the painting does, over the cast member and under the scene's own keys
function fonlep(x, y, more) {
  if (more && more.stage) { more = Object.assign({}, FONLEP_STAGE, more); }
  paperdoll(FONLEP_DOLL, x, y, more);
}
