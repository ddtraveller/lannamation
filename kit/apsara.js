// apsara.js - the celestial dancer of the Siamese stage: a paperdoll on the
// kit (see paperdoll.js).
//
// Read from a second painting of a Thai dancer on 2026-10-12, seen from the
// front and a little to one side. Nothing of the painting is copied: these
// are what it shows, as rules, with the numbers measured on it (a 477 by 597
// screenshot; the face 83 px from hairline to chin, 55 px wide).
//
// She is not Lanna (2026-10-13): the strapless bodice, the crown with its
// finial, the hip cloth and the chain belt are the Central Thai or Khmer
// celestial dancer of the classical stage. The Lanna murals draw their
// celestials in a tall pointed crown with ear flanges, a fitted long-sleeved
// jacket, a collar piece and a pha nung with a tail; that figure is still to
// be built (docs/kit/paperdolls.md, "the characters still to build").
//  1. A flat orange ground (#cd6a3c), and the figure on it alone: the manner
//     of a thangka's red ground. Flat colour inside a fine dark line.
//  2. White skin (#f8f7fb), black hair (#1e1b24) pulled smooth under the
//     crown; gold (#d9b045, dark #9a6a1e) for everything that shines.
//  3. The face, three-quarter: the eyes at the middle of the face's height,
//     each a third of its width long, the far one 0.85 of the near; a heavy
//     upper lid line running on past the corner, the iris touching it; thin
//     brows an eye's height above; one fine nose line to a tip at 0.72 of the
//     height; a small red bow mouth (#c8303f) at 0.86, 0.3 of the width; a
//     round chin; a long neck (0.6 of the face); a low smooth hairline.
//  4. A strapless gold bodice (#e3b76a) with a pale rolled edge (#f1dfb0);
//     bare arms with five stacked bangles at each wrist; long curved gold
//     nails; a double gold necklace with a pendant; long drop earrings.
//  5. A long sabai of maroon (#7b2c3b) woven with rows of cream motifs
//     (#ead9c2): diamonds, zigzags, dots, between gold borders; over the far
//     shoulder, across the body, over both forearms, and hanging from each to
//     the ground, cut straight with a fringe.
//  6. A double gold chain belt with small drops and a teardrop pendant at the
//     hip, over a white hip cloth (#f5f1ea) that falls to mid-thigh with a
//     gold hem; under it a maroon sin (#7a2a35) in bands of gold and black.
//  7. A crown: a gold band along the hairline, a finial of five pointed gold
//     leaves standing up from the top, a rosette at the side above the ear,
//     and from the rosette six strands of gold beads that sweep down behind
//     the shoulder to the hip.
//  8. The pose: the near hand raised beside the head, the far hand before the
//     chest, the hips in a half-sit so the skirt flares.

var APSARA = {
  ground: "#cd6a3c", skin: "#f8f7fb", hair: "#1e1b24", gold: "#d9b045", goldDark: "#9a6a1e",
  bodice: "#e3b76a", edge: "#f1dfb0", sabai: "#7b2c3b", fold: "#5a1d2a", crease: "#3e1019", motif: "#ead9c2",
  white: "#f5f1ea", sin: "#7a2a35", lips: "#c8303f"
};

// The cast member. The kit's sabai, in the cloth's maroon, is the sabai where
// it crosses her body; the chains are its two hanging ends. turn 0.4 is
// between the three-quarter view and the full face.
CAST.apsara = {skirt: true, bun: true, dance: true, nails: "long", bangles: 6,
               shirt: APSARA.bodice, legs: APSARA.sin, weave: 0, sabai: [APSARA.sabai, APSARA.sabai],
               skin: APSARA.skin, lips: 0.9,                    // the kit's eyes are the painting's measure since d7d06d1d
               size: 1.3, smile: 0.5, turn: 0.4, tilt: -0.05, sit: 0.25};

// the sabai's cloth, for scarfEnd() and drape(): cut straight, with a fringe
var APSARA_CLOTH = {
  colour: APSARA.sabai, fold: APSARA.fold, crease: APSARA.crease, wide: 22, pleats: false, tip: "fringe",
  pattern: function (left, right, Q, A, wide, s, line, panelAt) {
    var count = Q.length, n, k;
    pen.strokeStyle = APSARA.gold;                                // gold borders along both edges
    pen.lineWidth = 1.5 * s;
    pen.beginPath();
    through(left.slice(1, count - 1).map(function (p, i) { return walk(p, A[i + 1] + Math.PI / 2, 2.5 * s); }));
    through(right.slice(1, count - 1).map(function (p, i) { return walk(p, A[i + 1] - Math.PI / 2, 2.5 * s); }));
    pen.stroke();
    for (n = 3; n < count - 1; n++) {                             // rows of cream motifs across the cloth
      var kind = n % 3;
      if (kind === 0) {                                           // three diamonds
        pen.fillStyle = APSARA.motif;
        for (k = -1; k <= 1; k++) {
          var c = walk(Q[n], A[n] + Math.PI / 2, k * wide[n] * 0.5), r = 2.6 * s;
          var ax = Math.cos(A[n]) * r, ay = Math.sin(A[n]) * r, bx = -Math.sin(A[n]) * r * 0.7, by = Math.cos(A[n]) * r * 0.7;
          pen.beginPath();
          pen.moveTo(c[0] + ax, c[1] + ay);
          pen.lineTo(c[0] + bx, c[1] + by);
          pen.lineTo(c[0] - ax, c[1] - ay);
          pen.lineTo(c[0] - bx, c[1] - by);
          pen.closePath();
          pen.fill();
        }
      } else if (kind === 1) {                                    // a zigzag line
        pen.strokeStyle = APSARA.motif;
        pen.lineWidth = Math.max(1, 0.9 * line);
        pen.beginPath();
        for (k = -4; k <= 4; k++) {
          var z = walk(walk(Q[n], A[n] + Math.PI / 2, k * wide[n] * 0.2), A[n], (k % 2 ? 1 : -1) * 2.2 * s);
          if (k === -4) { pen.moveTo(z[0], z[1]); } else { pen.lineTo(z[0], z[1]); }
        }
        pen.stroke();
      } else {                                                    // two dots
        pen.fillStyle = APSARA.motif;
        for (k = -1; k <= 1; k += 2) {
          var d = walk(Q[n], A[n] + Math.PI / 2, k * wide[n] * 0.35);
          pen.beginPath();
          pen.arc(d[0], d[1], 1.6 * s, 0, 7);
          pen.fill();
        }
      }
    }
  }
};

var APSARA_DOLL = {
  name: "apsara",
  arms: "skin",

  // The bare near shoulder and the bodice's rolled edge, then the chain belt
  // with its pendant over the white hip cloth, in the waist's frame.
  costume: function (doll, farX, farY) {
    var near = nearShoulder(doll, farX, farY);
    oval(near[0] - 4, near[1] + 3, 15, 11, SKIN);                 // the near shoulder, bare: the bodice has no strap
    pen.lineCap = "round";
    pen.strokeStyle = APSARA.edge;                                // the rolled edge across the top of the bodice
    pen.lineWidth = 4.5;
    pen.beginPath();
    pen.moveTo(near[0] - 14, near[1] + 15);
    pen.quadraticCurveTo((near[0] + farX) / 2, (near[1] + farY) / 2 + 24, farX + 22, farY + 12);
    pen.stroke();
    pen.strokeStyle = APSARA.gold;
    pen.lineWidth = 1.5 * FINE;
    pen.beginPath();
    pen.moveTo(near[0] - 14, near[1] + 12);
    pen.quadraticCurveTo((near[0] + farX) / 2, (near[1] + farY) / 2 + 21, farX + 22, farY + 9);
    pen.stroke();
    var hips = hipsOf(doll);
    pen.save();
    pen.transform(1, hips[1], 0, 1, 0, 0);
    var hang = doll.chains.tongue;                                // the white hip cloth: a tongue from the near hip, moved as a chain
    if (hang && hang.points) {
      pen.save();
      pen.setTransform(1, 0, 0, 1, 0, 0);
      tongue(hang.points, doll.scale, lineOf(doll), doll.joints ? doll.joints.face : 1);
      pen.restore();
    }
    doll.tongueLead = onScreen(10, 4);                            // where it hangs from, for the chain
    var c = bandCorners(4, 10, 36, 38, hips[0]);
    pen.strokeStyle = APSARA.gold;                                // two chains of gold beads across the hips
    pen.lineWidth = 3;
    pen.lineCap = "round";
    pen.setLineDash([0.1, 4]);
    pen.beginPath();
    pen.moveTo(c.tl[0], 4);
    pen.lineTo(c.tr[0], 4);
    pen.moveTo(c.bl[0], 10);
    pen.quadraticCurveTo((c.bl[0] + c.br[0]) / 2, 15, c.br[0], 10);
    pen.stroke();
    pen.setLineDash([]);
    for (var drop = -1; drop <= 1; drop++) {                      // small drops from the lower chain
      var dx = drop * 18 + c.driftBottom;
      pen.beginPath();
      pen.moveTo(dx, 12);
      pen.quadraticCurveTo(dx + 2.5, 17, dx, 20);
      pen.quadraticCurveTo(dx - 2.5, 17, dx, 12);
      shape(APSARA.gold, 0.7 * LINE);
    }
    var px = 14 + c.driftBottom;                                  // the pendant at the hip: an open gold teardrop
    pen.beginPath();
    pen.moveTo(px, 10);
    pen.quadraticCurveTo(px + 9, 22, px, 30);
    pen.quadraticCurveTo(px - 9, 22, px, 10);
    shape(APSARA.gold, 0.8 * LINE);
    pen.beginPath();
    pen.moveTo(px, 15);
    pen.quadraticCurveTo(px + 4.5, 22, px, 26);
    pen.quadraticCurveTo(px - 4.5, 22, px, 15);
    pen.fillStyle = APSARA.white;
    pen.fill();
    pen.restore();
  },

  // the sabai gathered round each forearm: maroon, with a cream line and the folds
  onArm: function (doll, side, ex, ey, wx, wy) {
    var u = sleeveBand(ex, ey, wx, wy, 21, 41, 11.5, 12.5, APSARA.sabai, 2.5);
    pen.strokeStyle = APSARA.motif;
    pen.lineWidth = Math.max(1, 0.8 * LINE);
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(wx + u[0] * 31 - u[1] * 10, wy + u[1] * 31 + u[0] * 10);
    pen.lineTo(wx + u[0] * 31 + u[1] * 10, wy + u[1] * 31 - u[0] * 10);
    pen.stroke();
    pen.strokeStyle = APSARA.crease;
    pen.lineWidth = 0.9 * LINE;
    for (var fold = 0; fold < 2; fold++) {
      var mid = 25 + fold * 11, lean = fold ? 2 : -2;
      pen.beginPath();
      pen.moveTo(wx + u[0] * (mid - lean) - u[1] * 10, wy + u[1] * (mid - lean) + u[0] * 10);
      pen.quadraticCurveTo(wx + u[0] * (mid + 3), wy + u[1] * (mid + 3), wx + u[0] * (mid + lean) + u[1] * 10, wy + u[1] * (mid + lean) - u[0] * 10);
      pen.stroke();
    }
  },

  // The crown, in the head's frame after the face: a gold band along the
  // hairline, the five-leaf finial standing up from the top of the head, a
  // rosette at the side above the ear, and the place the bead strands hang from.
  onFace: function (doll, V) {
    var HL = V.hairLady, k;
    pen.lineCap = "round";
    pen.lineJoin = "round";
    for (k = 0; k < 2; k++) {                                     // the band: its dark edge, then the gold
      pen.strokeStyle = k ? APSARA.gold : inkFor(APSARA.gold);
      pen.lineWidth = k ? 7 : 7 + 1.6 * LINE;
      pen.beginPath();
      pen.moveTo(HL[2][0] + 6, HL[2][1] + 10);
      pen.quadraticCurveTo(HL[3][0], HL[3][1] + 8, HL[4][0], HL[4][1] + 8);
      pen.quadraticCurveTo(HL[5][0], HL[5][1] + 8, HL[6][0] - 4, HL[6][1] + 2);
      pen.stroke();
    }
    pen.fillStyle = APSARA.goldDark;                              // stones along the band
    for (k = 0; k <= 6; k++) {
      var u = k / 6, bx = (1 - u) * (1 - u) * (HL[2][0] + 6) + 2 * (1 - u) * u * HL[4][0] + u * u * (HL[6][0] - 4);
      var by = (1 - u) * (1 - u) * (HL[2][1] + 10) + 2 * (1 - u) * u * (HL[4][1] + 2) + u * u * (HL[6][1] + 2);
      pen.beginPath();
      pen.arc(bx, by, 1.5, 0, 7);
      pen.fill();
    }
    var topX = HL[4][0] - 6, topY = HL[4][1] + 4;                 // the finial, from the top of the head
    var leans = [-0.62, -0.31, 0, 0.31, 0.62], longs = [34, 48, 62, 48, 34];
    for (k = 0; k < 5; k++) {
      pen.save();
      pen.translate(topX, topY);
      pen.rotate(leans[k]);
      pen.translate(0, -4);
      paintLeaf(pen, longs[k], 7, 0, "#b8862a", "#f8e08a", "rgba(110, 70, 20, 0.9)", "rgba(255, 250, 220, 0.7)");
      pen.restore();
    }
    var rx = HL[2][0] + 14, ry = HL[2][1] + 22;                   // the rosette, at the side above the ear
    oval(rx, ry, 9, 9, APSARA.gold);
    pen.strokeStyle = APSARA.goldDark;
    pen.lineWidth = 1.2 * FINE;
    pen.beginPath();
    for (k = 0; k < 8; k++) {
      pen.moveTo(rx + Math.cos(k * Math.PI / 4) * 3, ry + Math.sin(k * Math.PI / 4) * 3);
      pen.lineTo(rx + Math.cos(k * Math.PI / 4) * 8, ry + Math.sin(k * Math.PI / 4) * 8);
    }
    pen.stroke();
    oval(rx, ry, 2.4, 2.4, APSARA.goldDark);
    doll.crown = onScreen(rx - 2, ry + 8);
  },

  // What hangs behind her: the bead strands from the rosette, the sabai
  // between the two forearms (behind her neck), and its two hanging ends.
  behind: function (doll, s, line) {
    for (var k = 0; k < 6; k++) {
      var strand = doll.chains["bead" + k];
      if (strand && strand.points) { beads(strand.points, s, line, APSARA.gold, APSARA.goldDark); }
    }
    if (doll.leaveA && doll.leaveB) { drape(doll.leaveB, doll.leaveA, 190, s, line, APSARA_CLOTH); }
    var endB = doll.chains.scarfB, endA = doll.chains.scarfA;
    if (endB && endB.points) { scarfEnd(endB.points, s, line, APSARA_CLOTH); }
    if (endA && endA.points) { scarfEnd(endA.points, s, line, APSARA_CLOTH); }
  },

  advance: function (doll, dt, s) {
    doll.leaveA = leaveOf(doll, "A", 30);
    doll.leaveB = leaveOf(doll, "B", 30);
    if (doll.tongueLead) { chainStep(chainOf(doll, "tongue", 7, 16 * s, Math.PI / 8, 500 * s, 0.7), doll.tongueLead, dt, floorOf(doll)); }
    if (doll.leaveA) { chainStep(chainOf(doll, "scarfA", 16, 14 * s, Math.PI / 7, 220 * s, 0.9), doll.leaveA, dt, floorOf(doll, 2)); }
    if (doll.leaveB) { chainStep(chainOf(doll, "scarfB", 16, 14 * s, Math.PI / 7, 220 * s, 0.9), doll.leaveB, dt, floorOf(doll, 2)); }
    if (doll.crown) {                                             // six strands from the rosette, a little apart
      for (var k = 0; k < 6; k++) {
        var lead = [doll.crown[0] + (k - 2.5) * 3 * s, doll.crown[1] + Math.abs(k - 2.5) * 1.5 * s];
        chainStep(chainOf(doll, "bead" + k, 13, 10 * s, Math.PI / 16, 700 * s, 0.55), lead, dt, floorOf(doll));
      }
    }
  }
};

// The white hip cloth, from its chain: a tongue that hangs from the near hip
// to mid-thigh and curls up and outward at its end, as the painting folds it,
// with a gold edge along both sides and a fold down its middle. "face" is the
// way she faces, so the curl turns away from her body.
// P: the "tongue" chain's points, sheet pixels; s: doll.scale; line: lineOf(doll). Draws with pen.
// e.g. tongue(doll.chains.tongue.points, doll.scale, lineOf(doll), 1);
function tongue(P, s, line, face) {
  var count = P.length, drawn = P.slice(), n;
  var a = angleTo(P[count - 2], P[count - 1]), side = face < 0 ? -1 : 1;
  drawn.push(walk(P[count - 1], a - side * 0.9, 12 * s));         // the curl: back and out, then up
  drawn.push(walk(drawn[count], a - side * 1.9, 11 * s));
  var halves = [18, 22, 24, 24, 23, 21, 17, 11, 5], wide = [];
  for (n = 0; n < drawn.length; n++) { wide.push(halves[Math.min(n, halves.length - 1)] * s); }
  clothStrip(drawn, wide, APSARA.white, "#ddd4c6", "#b9ae9f", line, function (left, right, Q, A) {
    pen.strokeStyle = APSARA.gold;                                // the gold edge along both sides
    pen.lineWidth = 1.6 * s;
    pen.lineCap = "round";
    pen.beginPath();
    through(left.slice(1).map(function (p, i) { return walk(p, A[i + 1] + Math.PI / 2, 2.5 * s); }));
    through(right.slice(1).map(function (p, i) { return walk(p, A[i + 1] - Math.PI / 2, 2.5 * s); }));
    pen.stroke();
    pen.strokeStyle = "#c9c0b2";                                  // the fold down the middle
    pen.lineWidth = Math.max(1, 0.7 * line);
    pen.beginPath();
    through(Q.slice(1, count).map(function (p, i) { return walk(p, A[i + 1] + Math.PI / 2, -wide[i + 1] * 0.25); }));
    pen.stroke();
  });
}

// apsara(x, y, more) draws the celestial dancer of the Siamese stage (not Lanna) standing on (x, y), at
// the clock's second: crown, bodice, chain belt; the two ends of her sabai, the white hip cloth and the
// six bead strands from the crown move on their own.
//   x, y   where her feet stand, pixels of the sheet
//   more   any of person()'s look keys (the list above person() in oldcartoon.js), over CAST.apsara
//          (size 1.3, turn 0.4, tilt -0.05, sit 0.25, smile 0.5 when left out): size, step, at (where
//          she looks), handA, handB, turn, mouth, id, or a pose from poseAt() (TRACK in dance_track.js).
//          She has no keys of her own. Nothing when left out: she stands as CAST.apsara is.
// Returns nothing: it draws with pen. It keeps her chains and joints in DOLLS[id] from frame to frame
// (id: more.id, or "apsara" and her number among the paperdolls drawn this frame, from 0), so draw her
// every frame, in the same order or with an id. Needs oldcartoon.js and paperdoll.js loaded first.
// e.g. apsara(760, 820, Object.assign({size: 1.85, at: [560, 120]}, poseAt(t + 20, TRACK, 0)));
function apsara(x, y, more) { paperdoll(APSARA_DOLL, x, y, more); }
