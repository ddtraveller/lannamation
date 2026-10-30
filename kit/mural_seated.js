// mural_seated.js - the mural figure seated (2026-10-30), over mural_women.js (load it after mural.js, mural_luxe.js,
// mural_thangka.js, mural_women.js and, if the page has it, mural_men.js). The owner, of the hero film's yard redrawn
// with the mural women: "yes" to seated mural figures for its two weavers, then "go ahead and put them in".
//
// A woman of the mural figure sits when her look has "floor", as the kit's own figure does (oldcartoon.js): true,
// "side" or "cross" on the floor, her legs folded to one side as a woman sits politely (phap phiap): the thighs forward
// along the floor, the lower legs folded back, a foot showing behind her; "astride" on a seat (the frame loom's bench):
// the thighs forward, the shins down, the feet on the floor 190 of her units below it. (x, y) is what she sits on: the
// floor, or the seat's top. reachB and reachA are the points her near and far hands go to, in the same space. Her upper
// body is mural.js's own, clipped at the waist and set down onto the seat; below it a seated shape of her sin, in its
// colours and with its foot band. A man of the mural figure with "floor" stands as before (no seated man yet); a page
// without this file draws everyone standing, as before.
// muralSeated(x, y, look, size, kind, reach) draws one: kind "side" or "bench"; reach {near: [x, y], far: [x, y]} or null.
// e.g. STYLE.figure = "mural"; person(600, GROUND, castWoman("grandmother", {floor: true, size: 1.2}))

var SIT_WAIST = 52;                                  // how high her waist is above what she sits on, in her units
// a point P (film pixels) as her pose's wrist, in the frame mural_women.js poses in (her upper frame, standing at
// (x, y + drop)); the lady's shear muUpper(-0.028, 0.07, -430)
function sitWrist(P, x, yStand, px) {
  var u = (P[0] - x) / px, v = (P[1] - yStand) / px;
  return [u - 0.07 * v - (-0.098) * (-430), v];
}
function muralSeated(x, y, look, size, kind, reach) {
  var px = 59 * size / 100, drop = (430 - SIT_WAIST) * px, yStand = y + drop, cut = y - SIT_WAIST * px + 6 * px;
  var named = typeof look.woman === "string" && MURAL_WOMEN[look.woman] ? MURAL_WOMEN[look.woman].woman : null;
  var settings = Object.assign({}, named || (look.woman && typeof look.woman === "object" ? look.woman : {}));
  if (reach) {                                       // her hands to the points given, and nothing else in them
    var pose = {};
    settings.holds = undefined;
    if (reach.near) { pose.near = {w: sitWrist(reach.near, x, yStand, px), elbow: [-0.3, 1], wrist: -0.3, fingers: 0.8, late: true}; }
    if (reach.far) { pose.far = {w: sitWrist(reach.far, x, yStand, px), elbow: [0.4, 1], wrist: 0.3, fingers: 0.6}; }
    settings.pose = pose;
  }
  var seatedLook = Object.assign({}, look, {woman: settings, floor: undefined, reachA: undefined, reachB: undefined});   // (seated once: drawn standing below)
  pen.save();                                        // what is below her waist, seated: before her upper body
  pen.translate(x, y); pen.scale(px, px);
  sitLower(seatedLook, kind);
  pen.restore();
  pen.save();                                        // her upper body, down onto the seat, clipped at the waist
  pen.beginPath(); pen.rect(x - 4000, cut - 8000, 8000, 8000); pen.clip();
  SIT_KIT.muralPerson(x, yStand, seatedLook, {head: 59 * size});
  pen.restore();
}
// her seated legs in her sin, in her units, the seat's top or the floor at y 0, her waist at y -SIT_WAIST
function sitLower(look, kind) {
  var skin = look.skin || STYLE.skin, design = SINS[(look.sin || 0) % SINS.length], body = design[0];
  var foot = design[1].reduce(function (a, b) { return b[2] > a[2] ? b : a; });   // its broadest band: the foot
  skin = blend(skin, "#f6ead8", MU.skinLady);
  var W = -SIT_WAIST, sin, hemLine, stripes = [];
  if (kind === "bench") {
    var floor = 190;
    muFoot(150, floor, 56, skin);                    // her feet on the floor below the knees, the far one a little ahead
    muFoot(118, floor - 4, 54, skin);
    sin = new MPath().M(-40, W).C(-58, W + 14, -62, -4, -50, 6)          // her back, down over the hip to the seat
      .C(10, 14, 90, 12, 132, 14)                                        // under the thigh, along the seat
      .C(128, 60, 126, 120, 128, floor - 24)                             // the back of the shin
      .L(186, floor - 26)                                                // the hem
      .C(190, 120, 196, 50, 196, 4)                                      // the front of the shin, up to the knee
      .C(196, -22, 180, -34, 156, -34)                                   // round the knee
      .C(100, -34, 50, -40, 34, W).Z();                                  // the top of the thigh, back to the waist's front
    hemLine = [[126, floor - 24], [188, floor - 26]];
    for (var k = 1; k < 6; k++) { var yy = W + 12 + k * 7; stripes.push([[-46, yy + 30 - k * 4], [60, yy], [160, -30 + k * 6]]); }
  } else {
    muFoot(-128, -2, 50, skin);                      // a foot showing behind her, its sole up, folded under
    sin = new MPath().M(-40, W).C(-60, W + 20, -70, -20, -96, -22)       // her back, down to the folded legs behind her
      .C(-130, -22, -150, -12, -146, 0)                                  // the lower legs folded back, on the floor
      .L(150, 0)                                                         // along the floor to the knees
      .C(176, 0, 184, -18, 176, -30)                                     // round the knees
      .C(150, -46, 80, -50, 34, W).Z();                                  // the top of the thighs, back to the waist's front
    hemLine = [[-146, 0], [-96, -4]];
    for (var j = 1; j < 6; j++) { var y2 = W + 8 + j * 7; stripes.push([[-60, y2 + 10], [60, y2 + 4], [170, -40 + j * 6]]); }
  }
  mFill(sin, body, 12);
  pen.save(); pen.clip(sin.path);
  stripes.forEach(function (s, i) {                  // the cloth's fine stripes, along the legs
    mLine(new MPath().M(s[0][0], s[0][1]).Q(s[1][0], s[1][1], s[2][0], s[2][1]), blend(body, i % 2 ? "#f2e6c8" : "#1a1210", 0.35), 1.4);
  });
  design[1].forEach(function (b) {                   // its bands, round the thighs where they are broad enough to show
    if (b[2] >= 3 && b !== foot && b[0] > 0.15 && b[0] < 0.8) {
      var yb = W + (b[0] - 0.15) * 90;
      mLine(new MPath().M(-70, yb + 20).Q(60, yb - 4, 200, yb - 30), b[1], b[2] * 1.2);
    }
  });
  var a = hemLine[0], c = hemLine[1];               // the foot band, along the hem
  mLine(new MPath().M(a[0] - 6, a[1] - 9).L(c[0] + 6, c[1] - 9), foot[1], 16);
  if (kind === "bench") { mLine(new MPath().M(a[0] - 6, a[1] - 22).L(c[0] + 6, c[1] - 24), "#e0b23a", 2.2); }
  pen.restore();
  mBrush(sin, muInk(muColour(body)), 1.5);
}

// mural_women.js's figure, seated when a woman's look has "floor" (and she is not already being drawn)
var SIT_KIT = {muralPerson: muralPerson};
muralPerson = function (x, y, look, opts) {
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun;
  if (!look.floor || !lady || WM) { return SIT_KIT.muralPerson(x, y, look, opts); }
  var kind = look.floor === "astride" ? "bench" : "side", reach = look.reachA || look.reachB ? {near: look.reachB, far: look.reachA} : null;
  muralSeated(x, y, look, (opts && opts.head || 70) / 59, kind, reach);
};
