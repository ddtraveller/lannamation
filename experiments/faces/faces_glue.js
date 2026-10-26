// faces_glue.js - the experiment's way into person() without changing the kit: for a look with `mesh`, personHead()'s
// parts draw the traced face instead of the kit's; every other look draws exactly as before. Load it after the kit
// and faces.js. (Were the faces ever taken into the kit, this would become one branch in personHead().)
var KIT_HEAD = {headSkull: headSkull, headLadyHair: headLadyHair, headNearEar: headNearEar, headFarEar: headFarEar,
                headEarring: headEarring, ladyFace: ladyFace, manFace: manFace};

headSkull = function (h) {
  if (!h.look.mesh) { FACE_NOW = null; KIT_HEAD.headSkull(h); return; }
  faceSkin(h);
};
headNearEar = function (h) { if (!h.look.mesh) { KIT_HEAD.headNearEar(h); } };
headFarEar = function (h) { if (!h.look.mesh) { KIT_HEAD.headFarEar(h); } };
headEarring = function (h) { if (!h.look.mesh) { KIT_HEAD.headEarring(h); } };
headLadyHair = function (h) {
  if (!h.look.mesh) { KIT_HEAD.headLadyHair(h); return; }
  if (!FACE_NOW.knot) {                                           // meshHair "kit": the kit's own hair over the traced face,
    pen.save();                                                   // fitted to its skull: narrowed from the kit's (about 58 to a
    pen.translate(0, -316);                                       // side) to the traced skull's width, about the kit's hairline
    pen.scale(FACE_NOW.skull.rx * 1.08 / 58, 1);
    pen.translate(0, 316);
    KIT_HEAD.headLadyHair(h);
    pen.restore();
  } else {
  faceHairline(FACE_NOW);                                         // the hairline, over the face's top edge
  var knot = FACE_NOW.knot, kx = knot[0], ky = knot[1], r = knot[2];   // the hair itself is drawn with the skin (faceSkin)
  h.joints.bun = h.spot(kx, ky);
  headKnotFan(h, kx, ky);
  pen.strokeStyle = STYLE.gold;                                   // the gold comb across the knot, and its stones, as the kit's high bun has them
  pen.lineWidth = 3;
  pen.lineCap = "round";
  pen.beginPath();
  pen.arc(kx, ky + 2, r * 1.1, Math.PI * 1.05, Math.PI * 1.75);
  pen.stroke();
  oval(kx - 2, ky - r * 1.08, 3.4, 3.4, "#d9533a");
  oval(kx - r * 0.78, ky - r * 0.72, 2.6, 2.6, "#3f8f7a");
  oval(kx + r * 0.62, ky - r * 0.85, 2.6, 2.6, "#3f8f7a");
  headKnotFlowers(h, kx, ky);
  headKnotDress(h, kx, ky, [r, r * 0.9]);
  }
  var lobe = faceEar(h, "near");
  if (lobe && h.lady) {
    h.earX = lobe[0];
    pen.save();
    pen.translate(0, lobe[1] + 272);
    KIT_HEAD.headEarring(h);
    pen.restore();
  }
};
ladyFace = function (shut, mouth, glance, V, feel) {
  if (FACE_NOW) { faceFeatures(shut, mouth, glance, V, feel); return; }
  KIT_HEAD.ladyFace(shut, mouth, glance, V, feel);
};
manFace = function (shut, mouth, glance, V, feel) {
  if (FACE_NOW) { faceFeatures(shut, mouth, glance, V, feel); return; }
  KIT_HEAD.manFace(shut, mouth, glance, V, feel);
};
