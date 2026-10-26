// faces_parts.js - the features and the hair of a face with a mesh (faces.js). Experimental: not part of the kit.

// What each traced face wears of its own: its lids (one of "hooded", "crease", "low", "single": the research's
// mix), the brown of the iris, the brows, the lips, the hair. A look's own keys (skin, hair) still win.
var FACE_LOOKS = {
  woman: {lids: "hooded", iris: "#5b3820", brows: "#2a1c15", lips: "#b9606a", hair: "#191310", fem: 1, shadow: "#8f6258"}
};

// A face's own colours and lids (FACE_LOOKS), by its name or, for a variant such as "woman_p0.7", its first part.
function faceOwn(name) { return FACE_LOOKS[name] || FACE_LOOKS[String(name).split("_")[0]] || {}; }

// Where a point of the moved face is drawn, with the upper lids let down by "shut" (0 open to 1 shut).
// F: FACE_NOW; n: a landmark number; shut: 0 to 1. Returns [x, y, z] in the head's frame.
function facePoint(F, n, shut) {
  var p = F.moved[n];
  if (shut > 0) {
    ["R", "L"].forEach(function (e) {
      var i = FACE_EYES[e].upper.indexOf(n);
      if (i > 0 && i < FACE_EYES[e].upper.length - 1) {
        var low = F.moved[FACE_EYES[e].lower[i]];
        p = [p[0] + (low[0] - p[0]) * shut, p[1] + (low[1] - p[1] - 0.3) * shut, p[2]];
      }
    });
  }
  return faceTurn(p, F.yaw, F.face.skull);
}

// The face's features over its skin: the cheeks' colour, the eyes, the brows, the nose, the lips.
// shut, mouth, glance, V, feel: as ladyFace() takes them. Reads FACE_NOW (faceSkin() set it). Draws with pen.
function faceFeatures(shut, mouth, glance, V, feel) {
  var F = FACE_NOW, own = faceOwn(F.look.mesh), closed = shut === true ? 1 : shut ? shut : 0;
  closed = Math.max(closed, 0.2 * (F.feel.laugh || 0));
  faceCheeks(F, own);
  pen.save();
  var within = new Path2D(F.facePath);                            // the face, with the holes the mesh leaves at the eyes and the mouth
  [FACE_EYES.R.upper.concat(FACE_EYES.R.lower.slice().reverse()), FACE_EYES.L.upper.concat(FACE_EYES.L.lower.slice().reverse()),
   FACE_LIPS.upperOuter.concat(FACE_LIPS.lowerOuter.slice().reverse())].forEach(function (ring) {
    ring.forEach(function (n, i) { var q = facePoint(F, n, 0); if (i) { within.lineTo(q[0], q[1]); } else { within.moveTo(q[0], q[1]); } });
    within.closePath();
  });
  pen.clip(within);
  ["R", "L"].forEach(function (e) { faceEye(F, e, closed, glance, own); });
  ["R", "L"].forEach(function (e) { faceBrow(F, e, own); });
  faceNose(F, own);
  faceLips(F, own, mouth);
  pen.restore();
}

// The way from an eye's inner corner to its outer, as a unit [x, y]. outer, inner: points [x, y, ...].
function outDirOf(outer, inner) {
  var d = [outer[0] - inner[0], outer[1] - inner[1]], l = Math.hypot(d[0], d[1]) || 1;
  return [d[0] / l, d[1] / l];
}

// A soft rose on the cheeks, the tip of the nose and the chin, where the blood shows through.
function faceCheeks(F, own) {
  var smile = Math.max(F.feel.smile || 0, F.feel.laugh || 0);
  pen.save();
  pen.clip(F.facePath);
  var fem = F.fem || 0;
  if (fem) {                                                      // the hollow under each cheekbone: a soft shade from the face's edge
    var m = pen.getTransform(), unit = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));   // toward the corner of the mouth, two
    var faceWide = Math.abs(F.at[454][0] - F.at[234][0]);                           // thirds of the way (owner, 2026-10-26:
    pen.save();                                                                     // "keep going with the cheeks pinching in")
    pen.filter = "blur(" + (faceWide * 0.05 * unit).toFixed(2) + "px)";
    pen.lineCap = "round";
    [[137, 57], [366, 287]].forEach(function (pair) {
      var a = facePoint(F, pair[0], 0), b = facePoint(F, pair[1], 0);
      var end = [a[0] + (b[0] - a[0]) * 0.62, a[1] + (b[1] - a[1]) * 0.62];
      var shade = pen.createLinearGradient(a[0], a[1], end[0], end[1]);
      shade.addColorStop(0, "rgba(120, 58, 48, " + (0.05 * fem) + ")");   // faint (owner: "go back farther on the cheeks")
      shade.addColorStop(1, "rgba(120, 58, 48, 0)");
      pen.strokeStyle = shade;
      pen.lineWidth = faceWide * 0.1;
      pen.beginPath(); pen.moveTo(a[0], a[1]); pen.lineTo(end[0], end[1]); pen.stroke();
    });
    pen.filter = "none";
    pen.restore();
  }
  [[50, 280, 13, 0.16 + 0.08 * smile + 0.07 * fem], [4, 4, 6, 0.08], [199, 199, 8, 0.05]].forEach(function (spot) {
    [spot[0], spot[1]].forEach(function (n, side) {
      if (side && spot[0] === spot[1]) { return; }
      var p = facePoint(F, n, 0), r = spot[2] * FACE.scale;
      if (spot[0] === 50) { p = [p[0], p[1] - 2.5 * fem * FACE.scale, p[2]]; }   // the colour sits higher, on the cheekbone, above the hollow
      var rose = pen.createRadialGradient(p[0], p[1] - 2, 0, p[0], p[1] - 2, r);
      rose.addColorStop(0, "rgba(222, 92, 88, " + spot[3] + ")");
      rose.addColorStop(1, "rgba(222, 92, 88, 0)");
      pen.fillStyle = rose;
      pen.beginPath();
      pen.arc(p[0], p[1] - 2, r, 0, 7);
      pen.fill();
    });
  });
  pen.restore();
}

// One eye, part by part: the white, shaded at its corners and under the lid; the pink of the inner corner; the
// iris with its dark rim, its fibres, the ring round the pupil, the pupil, and two lights; the lid's edge thick
// with lashes, the lashes one by one; the lower lid and its wet edge; and above, the lid's fold as the face's lids
// have it. F: FACE_NOW; e: "R" or "L"; shut: 0 to 1; glance: across or [across, down]; own: FACE_LOOKS' row.
function faceEye(F, e, shut, glance, own) {
  var E = FACE_EYES[e], style = F.style;
  var upper = E.upper.map(function (n) { return facePoint(F, n, shut); });
  var lower = E.lower.map(function (n) { return facePoint(F, n, 0); });
  var outer = upper[0], inner = upper[upper.length - 1];
  var wide = Math.hypot(inner[0] - outer[0], inner[1] - outer[1]);
  if (wide < 1) { return; }                                       // turned away
  var opening = new Path2D();
  faceSmooth(opening, upper, false);
  faceSmooth(opening, lower.slice().reverse(), false, true);
  opening.closePath();
  var skin = faceRGB(SKIN), ink = faceMix(skin, [20, 10, 8], 0.55 + 0.4 * style.ink);
  var lashTone = faceMix([26, 15, 11], skin, 0.15 * (1 - style.ink));
  if (shut < 0.92) {
    pen.save();
    pen.clip(opening);
    var mid = [(outer[0] + inner[0]) / 2, (outer[1] + inner[1]) / 2];
    var white = pen.createRadialGradient(mid[0], mid[1], 0, mid[0], mid[1], wide * 0.6);   // the white, darker toward its corners
    white.addColorStop(0, "#f6f1ea");
    white.addColorStop(0.65, "#ece2d8");
    white.addColorStop(1, "#c9b2a6");
    pen.fillStyle = white;
    pen.fill(opening);
    var corner = pen.createRadialGradient(inner[0], inner[1], 0, inner[0], inner[1], wide * 0.16);   // the pink at the inner corner
    corner.addColorStop(0, "rgba(214, 120, 118, 0.85)");
    corner.addColorStop(1, "rgba(214, 120, 118, 0)");
    pen.fillStyle = corner;
    pen.fillRect(inner[0] - wide * 0.2, inner[1] - wide * 0.2, wide * 0.4, wide * 0.4);
    // the iris: its middle and size as traced, moved by the glance
    var c = facePoint(F, E.iris, 0), rx = 0, ry = 0;
    E.rim.forEach(function (n) { var q = facePoint(F, n, 0); rx = Math.max(rx, Math.abs(q[0] - c[0])); ry = Math.max(ry, Math.abs(q[1] - c[1])); });
    var gx = (glance.length ? glance[0] : glance) * wide / 26, gy = (glance.length ? glance[1] : 0) * wide / 34;
    var ix = c[0] + gx, iy = c[1] + gy, r = Math.max(rx, ry);
    var brown = faceRGB(own.iris || "#5b3820");
    var iris = pen.createRadialGradient(ix, iy, r * 0.2, ix, iy, r);
    iris.addColorStop(0, faceCSS(faceMix(brown, [150, 100, 55], 0.35)));
    iris.addColorStop(0.55, faceCSS(brown));
    iris.addColorStop(0.86, faceCSS(faceMix(brown, [20, 10, 6], 0.55)));
    iris.addColorStop(1, "rgb(16, 9, 6)");                        // the dark rim (the limbal ring)
    pen.fillStyle = iris;
    pen.beginPath();
    pen.ellipse(ix, iy, rx, ry, 0, 0, 7);
    pen.fill();
    pen.save();                                                   // its fibres: fine lines out from the pupil, light and dark by turns
    pen.lineCap = "round";
    pen.lineWidth = r * 0.045;
    for (var f = 0; f < 44; f++) {
      var a = f / 44 * Math.PI * 2 + faceRandom(f) * 0.08, from = 0.4 + 0.08 * faceRandom(f + 50), to = 0.82 + 0.12 * faceRandom(f + 90);
      pen.strokeStyle = f % 2 ? faceCSS(faceMix(brown, [190, 140, 85], 0.45), 0.45) : faceCSS([20, 11, 7], 0.35);
      pen.beginPath();
      pen.moveTo(ix + Math.cos(a) * rx * from, iy + Math.sin(a) * ry * from);
      pen.quadraticCurveTo(ix + Math.cos(a + 0.06) * rx * (from + to) / 2, iy + Math.sin(a + 0.06) * ry * (from + to) / 2,
                           ix + Math.cos(a) * rx * to, iy + Math.sin(a) * ry * to);
      pen.stroke();
    }
    pen.strokeStyle = faceCSS(faceMix(brown, [200, 150, 90], 0.4), 0.55);   // the ring round the pupil (the collarette), uneven
    pen.lineWidth = r * 0.06;
    pen.beginPath();
    for (f = 0; f <= 36; f++) {
      var b = f / 36 * Math.PI * 2, rr = 0.52 + 0.06 * Math.sin(f * 2.7) * faceRandom(f + 7);
      if (f === 0) { pen.moveTo(ix + Math.cos(b) * rx * rr, iy + Math.sin(b) * ry * rr); }
      else { pen.lineTo(ix + Math.cos(b) * rx * rr, iy + Math.sin(b) * ry * rr); }
    }
    pen.stroke();
    pen.restore();
    pen.fillStyle = "rgb(9, 5, 4)";                               // the pupil
    pen.beginPath();
    pen.ellipse(ix, iy, rx * 0.36, ry * 0.36, 0, 0, 7);
    pen.fill();
    pen.lineWidth = wide * 0.22;                                  // the upper lid's shadow over the white and the iris
    pen.strokeStyle = "rgba(70, 36, 28, 0.38)";
    pen.beginPath();
    faceSmooth(pen, upper, false);
    pen.stroke();
    var light = faceUnit(FACE.light);                             // the lights: the window of the sky, and a small one below
    pen.fillStyle = "rgba(255, 255, 255, 0.92)";
    pen.beginPath();
    pen.ellipse(ix + light[0] * r * 0.55, iy + light[1] * r * 0.5, r * 0.22, r * 0.19, -0.3, 0, 7);
    pen.fill();
    pen.fillStyle = "rgba(255, 255, 255, 0.45)";
    pen.beginPath();
    pen.arc(ix - light[0] * r * 0.45, iy - light[1] * r * 0.55, r * 0.08, 0, 7);
    pen.fill();
    pen.strokeStyle = "rgba(255, 250, 245, 0.55)";                // the wet edge of the lower lid
    pen.lineWidth = wide * 0.025;
    pen.beginPath();
    faceSmooth(pen, lower.slice(1, -1).map(function (q) { return [q[0], q[1] - wide * 0.02]; }), false);
    pen.stroke();
    pen.restore();
  }
  // the lower lid: a fine warm line, gone at the inner corner
  pen.lineCap = "round";
  pen.strokeStyle = faceCSS(faceMix(skin, [90, 40, 30], 0.6), 0.55);
  pen.lineWidth = wide * 0.03;
  pen.beginPath();
  faceSmooth(pen, lower.slice(0, -2), false);
  pen.stroke();
  // the upper lid's edge: a band thickest toward the outer corner, where the lashes grow
  var edge = [], back = [];
  for (var i = 0; i < upper.length; i++) {
    var u = i / (upper.length - 1), q0 = upper[Math.max(0, i - 1)], q1 = upper[Math.min(upper.length - 1, i + 1)];
    var tx = q1[0] - q0[0], ty = q1[1] - q0[1], tl = Math.hypot(tx, ty) || 1;
    var nx = ty / tl, ny = -tx / tl;
    if (ny > 0) { nx = -nx; ny = -ny; }                           // the normal pointing up, off the eye
    var thick = wide * (0.012 + 0.06 * (1 + 0.6 * (F.fem || 0)) * Math.sin(Math.PI * Math.pow(1 - u, 0.8)) * (1 - 0.6 * u));   // with a woman's soft liner
    edge.push([upper[i][0], upper[i][1]]);
    back.push([upper[i][0] + nx * thick, upper[i][1] + ny * thick, nx, ny]);
  }
  // eye shadow on the upper lid (owner, 2026-10-26: "add eye shadow"): a soft wash from the lash line up toward the
  // brow, deepest along the lashes and toward the outer corner, where it sweeps a little out; the face's own colour
  // (FACE_LOOKS: shadow), blurred so it has no edge
  var femE = F.fem || 0;
  if (femE > 0 || own.shadow) {
    var hue = faceRGB(own.shadow || "#8c5e5a"), top = [];
    for (var hs = 0; hs < upper.length; hs++) {
      var hv = hs / (upper.length - 1);                          // 0 at the outer corner
      var rise = wide * (0.16 + 0.26 * Math.sin(Math.PI * (0.12 + 0.8 * hv)));
      top.push([back[hs][0] + back[hs][2] * rise + outDirOf(outer, inner)[0] * wide * 0.12 * (1 - hv) * (1 - hv),
                back[hs][1] + back[hs][3] * rise + outDirOf(outer, inner)[1] * wide * 0.12 * (1 - hv) * (1 - hv)]);
    }
    var lid = new Path2D();
    faceSmooth(lid, back.map(function (q) { return [q[0], q[1]]; }), false);
    faceSmooth(lid, top.slice().reverse(), false, true);
    lid.closePath();
    var mt = pen.getTransform(), unitE = Math.sqrt(Math.abs(mt.a * mt.d - mt.b * mt.c));
    var wash = pen.createLinearGradient(inner[0], inner[1], outer[0], outer[1]);
    wash.addColorStop(0, faceCSS(hue, 0.22 * Math.max(femE, 0.6)));
    wash.addColorStop(1, faceCSS(faceMix(hue, [40, 20, 20], 0.25), 0.42 * Math.max(femE, 0.6)));
    pen.save();
    var notEye = new Path2D();
    notEye.rect(-400, -700, 800, 900);
    notEye.addPath(opening);
    pen.clip(notEye, "evenodd");
    pen.filter = "blur(" + (wide * 0.06 * unitE).toFixed(2) + "px)";
    pen.fillStyle = wash;
    pen.fill(lid);
    pen.filter = "none";
    pen.restore();
  }
  var band = new Path2D();
  faceSmooth(band, edge, false);
  faceSmooth(band, back.slice().reverse(), false, true);
  band.closePath();
  pen.fillStyle = faceCSS(lashTone, 0.92);
  pen.fill(band);
  // the lashes (owner, 2026-10-26: "Eye lashes should narrow at the tip and be fuller"): each a curve full at its root
  // and fine to a point at its tip, filled, not stroked; two rows along the lid, the back row shorter; gathered in
  // clumps of three whose tips lean together, as real lashes clump; longest toward the outer corner and leaning
  // out that way; and a few short fine ones on the lower lid's outer half
  var fem = F.fem || 0, side = e === "R" ? 0 : 999, outDir = [outer[0] - inner[0], outer[1] - inner[1]];
  var outLen = Math.hypot(outDir[0], outDir[1]) || 1;
  outDir = [outDir[0] / outLen, outDir[1] / outLen];
  function lidAt(u) {                                             // a point of the lid's edge (u 0 at the outer corner) and its upward normal
    var a = Math.min(upper.length - 1.001, u * (upper.length - 1)), i0 = Math.floor(a), fr = a - i0;
    return [back[i0][0] + (back[i0 + 1][0] - back[i0][0]) * fr, back[i0][1] + (back[i0 + 1][1] - back[i0][1]) * fr,
            back[i0][2], back[i0][3]];
  }
  function lash(root, dir, len, root_w, curl, tone, alpha) {     // one lash: a tapered curve from root to tip
    var tip = [root[0] + dir[0] * len, root[1] + dir[1] * len - curl * len * 0.25];
    var ctrl = [root[0] + dir[0] * len * 0.55, root[1] + dir[1] * len * 0.55 - curl * len * 0.32];
    var nx = -dir[1], ny = dir[0];
    pen.fillStyle = faceCSS(tone, alpha);
    pen.beginPath();
    pen.moveTo(root[0] + nx * root_w / 2, root[1] + ny * root_w / 2);
    pen.quadraticCurveTo(ctrl[0] + nx * root_w * 0.22, ctrl[1] + ny * root_w * 0.22, tip[0], tip[1]);
    pen.quadraticCurveTo(ctrl[0] - nx * root_w * 0.22, ctrl[1] - ny * root_w * 0.22, root[0] - nx * root_w / 2, root[1] - ny * root_w / 2);
    pen.closePath();
    pen.fill();
  }
  var COUNT = 26 + Math.round(16 * fem), clumpTip = null;
  for (var row = 0; row < 2; row++) {
    for (var l = 0; l < COUNT; l++) {
      var seed = l * 7 + row * 300 + side;
      var lu = 0.04 + 0.92 * (l + 0.5 + (faceRandom(seed) - 0.5) * 0.7) / COUNT;   // 0 at the outer corner
      var at = lidAt(lu), root = [at[0] - at[2] * wide * 0.01 * row, at[1] - at[3] * wide * 0.01 * row];
      var lean = (1 - lu) * 0.85 + 0.12;
      var dx = at[2] * (1 - lean * 0.45) + outDir[0] * lean * 0.75, dy = at[3] * (1 - lean * 0.45) + outDir[1] * lean * 0.75;
      var dl = Math.hypot(dx, dy) || 1;
      var dir = [dx / dl, dy / dl];
      var len = wide * (0.075 + 0.13 * Math.pow(1 - lu, 0.8)) * (0.78 + 0.44 * faceRandom(seed + 1)) * (1 + 0.35 * fem) * (row ? 0.72 : 1);
      if (l % 3 === 0) { clumpTip = [root[0] + dir[0] * len, root[1] + dir[1] * len]; }   // the clump's lashes lean toward its first's tip
      else if (clumpTip) {
        var want = [clumpTip[0] - root[0], clumpTip[1] - root[1]], wl = Math.hypot(want[0], want[1]) || 1;
        dir = [dir[0] * 0.75 + want[0] / wl * 0.25, dir[1] * 0.75 + want[1] / wl * 0.25];
        var dl2 = Math.hypot(dir[0], dir[1]) || 1;
        dir = [dir[0] / dl2, dir[1] / dl2];
      }
      var tone = faceMix(lashTone, [0, 0, 0], 0.25 * faceRandom(seed + 2));
      lash(root, dir, len, wide * (0.022 + 0.008 * faceRandom(seed + 3)) * (row ? 0.8 : 1), 0.9 + 0.5 * faceRandom(seed + 4),
           tone, row ? 0.75 : 0.92);
    }
  }
  for (var w = 0; w < 9; w++) {                                    // the lower lashes: few, short, fine, on the outer half
    var wu = 0.08 + 0.42 * (w + faceRandom(w + 50 + side) * 0.6) / 9;
    var wa = Math.min(lower.length - 1.001, wu * (lower.length - 1)), j0 = Math.floor(wa), wf = wa - j0;
    var wr = [lower[j0][0] + (lower[j0 + 1][0] - lower[j0][0]) * wf, lower[j0][1] + (lower[j0 + 1][1] - lower[j0][1]) * wf];
    var wd = [outDir[0] * 0.45, 0.9];
    var wdl = Math.hypot(wd[0], wd[1]);
    lash(wr, [wd[0] / wdl, wd[1] / wdl], wide * (0.035 + 0.03 * faceRandom(w + 70 + side)), wide * 0.011, -0.4,
         faceMix(lashTone, skin, 0.25), 0.55);
  }
  // the fold above the lid, by the face's lids
  var lids = own.lids || "hooded", fold = [];
  for (i = 0; i < upper.length; i++) {
    var v = i / (upper.length - 1), lift = wide * ({hooded: 0.1, crease: 0.2, low: 0.12, single: 0.08}[lids]) * Math.sin(Math.PI * (0.15 + 0.75 * v));
    fold.push([back[i][0] + back[i][2] * lift, back[i][1] + back[i][3] * lift]);
  }
  pen.save();
  var foldTone = faceMix(skin, [90, 40, 30], 0.55);
  if (lids === "hooded") {                                        // a crease hidden under the skin that hangs over it: a soft shadow, and its line only toward the outer corner
    pen.lineWidth = wide * 0.09;
    pen.strokeStyle = faceCSS(foldTone, 0.16);
    pen.beginPath(); faceSmooth(pen, fold.slice(0, 7), false); pen.stroke();
    pen.lineWidth = wide * 0.022;
    pen.strokeStyle = faceCSS(foldTone, 0.45 * (0.5 + 0.5 * style.ink));
    pen.beginPath(); faceSmooth(pen, fold.slice(0, 5), false); pen.stroke();
  } else if (lids !== "single") {
    pen.lineWidth = wide * 0.022;
    pen.strokeStyle = faceCSS(foldTone, 0.5 * (0.5 + 0.5 * style.ink));
    pen.beginPath(); faceSmooth(pen, fold.slice(1, 8), false); pen.stroke();
  }
  // the fold over the inner corner, short and soft
  pen.lineWidth = wide * 0.02;
  pen.strokeStyle = faceCSS(foldTone, 0.35);
  var ic = upper.length - 1;
  pen.beginPath();
  pen.moveTo(back[ic - 1][0], back[ic - 1][1]);
  pen.quadraticCurveTo(inner[0] + (inner[0] - outer[0]) * 0.03, inner[1] - wide * 0.05, inner[0] + (inner[0] - outer[0]) * 0.02, inner[1] + wide * 0.03);
  pen.stroke();
  pen.restore();
}

// A brow, hair by hair: from its inner end the hairs grow up and a little outward, along its body outward, the
// upper ones leaning down and the lower up to meet in the middle, and at its tail outward and down. Under them, a
// faint wash of the brow's colour. F: FACE_NOW; e: "R" or "L"; own: FACE_LOOKS' row.
function faceBrow(F, e, own) {
  var fem = F.fem || 0;
  var B = FACE_BROWS[e];
  var up = B.upper.map(function (n) { return facePoint(F, n, 0); }), lo = B.lower.map(function (n) { return facePoint(F, n, 0); });
  function line(pts, u) {                                         // a point along a brow line, u 0 at the inner end to 1 at the outer
    var at = (1 - clamp(u)) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(at)), f = at - i;
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
  }
  function spot(u, v) {                                           // v 0 at the lower line to 1 at the upper; the brow is narrower than the band traced
    var a = line(lo, u), b = line(up, u), top = 0.86 - 0.3 * u - 0.14 * fem, bottom = 0.18 + 0.2 * u * u + 0.12 * fem;   // a woman's brow thinner
    var w = bottom + (top - bottom) * v;
    return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w];
  }
  var colour = faceRGB(own.brows || "#2a1c15"), style = F.style;
  var wash = new Path2D();
  var edgeA = [], edgeB = [];
  for (var k = 0; k <= 10; k++) { edgeA.push(spot(k / 10, 0)); edgeB.push(spot(k / 10, 1)); }
  faceSmooth(wash, edgeA, false);
  faceSmooth(wash, edgeB.reverse(), false, true);
  wash.closePath();
  pen.fillStyle = faceCSS(colour, 0.16 + 0.1 * style.ink);
  pen.fill(wash);
  pen.lineCap = "round";
  for (var n = 0; n < 110; n++) {
    var seed = n * 7 + (e === "R" ? 0 : 1000), u = Math.pow(faceRandom(seed), 0.85), v = faceRandom(seed + 1);
    var du, dv;
    if (u < 0.15) { du = 0.04; dv = 0.55; }                       // the head of the brow: up
    else if (u < 0.8) { du = 0.1; dv = (0.5 - v) * 0.5; }         // the body: out, to the middle line
    else { du = 0.09; dv = -0.25; }                               // the tail: out and down
    var len = 0.55 + 0.45 * faceRandom(seed + 2);
    var a = spot(u, v), b = spot(Math.min(1.02, u + du * len), faceBound(v + dv * len, -0.1, 1.1));
    pen.strokeStyle = faceCSS(faceMix(colour, [70, 50, 40], 0.3 * faceRandom(seed + 3)), (0.45 + 0.4 * faceRandom(seed + 4)) * (1 - 0.35 * u));
    pen.lineWidth = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.12 + 0.05;
    pen.beginPath();
    pen.moveTo(a[0], a[1]);
    pen.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.15, b[0], b[1]);
    pen.stroke();
  }
}

// The nose: the light down its bridge and on its tip, the wings' soft line, and the nostrils, dark and soft.
function faceNose(F, own) {
  var skin = faceRGB(SKIN), style = F.style, tip = facePoint(F, 4, 0), light = faceUnit(FACE.light);
  var shine = pen.createRadialGradient(tip[0] + light[0] * 2, tip[1] + light[1] * 2.5, 0, tip[0], tip[1], 5 * FACE.scale);
  shine.addColorStop(0, "rgba(255, 246, 236, " + (0.35 * style.shade) + ")");
  shine.addColorStop(1, "rgba(255, 246, 236, 0)");
  pen.fillStyle = shine;
  pen.beginPath(); pen.arc(tip[0], tip[1], 5 * FACE.scale, 0, 7); pen.fill();
  [[[49, 102, 64, 240], [75, 60, 99, 240]], [[279, 331, 294, 460], [305, 290, 328, 460]]].forEach(function (side) {
    var wing = side[0].map(function (n) { return facePoint(F, n, 0); });
    pen.strokeStyle = faceLine(skin, style, 0.9);
    pen.lineWidth = LINE * 0.4;
    pen.lineCap = "round";
    pen.beginPath(); faceSmooth(pen, wing, false); pen.stroke();
    var hole = side[1].map(function (n) { return facePoint(F, n, 0); }), mid = [0, 0];
    hole.forEach(function (q) { mid[0] += q[0] / hole.length; mid[1] += q[1] / hole.length; });
    var r = 1.7 * FACE.scale, dark = pen.createRadialGradient(mid[0], mid[1], 0, mid[0], mid[1], r * 1.4);
    dark.addColorStop(0, "rgba(60, 22, 20, 0.85)");
    dark.addColorStop(0.6, "rgba(80, 32, 28, 0.45)");
    dark.addColorStop(1, "rgba(80, 32, 28, 0)");
    pen.fillStyle = dark;
    pen.beginPath(); pen.ellipse(mid[0], mid[1], r * 1.4, r * 0.75, 0, 0, 7); pen.fill();
  });
}

// The hairline, painted over the face's top edge (the face is drawn after the hair, and its edge is the hairline): a
// faint shadow of the roots on the skin just below it; a soft dark band where the hair meets the skin; short root
// strands that thin out across the edge, so skin shows between them; baby hairs, fine and curling, most at the
// temples; and a few wisps before each ear. F: FACE_NOW (faceHair() gave it F.hairline). Draws with pen.
function faceHairline(F) {
  var H = F.hairline;
  if (!H) { return; }
  var m = pen.getTransform(), unit = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)), s = FACE.scale;
  var pts = H.front.map(H.turn);
  var onHead = new Path2D(F.facePath);                            // all of it stays on the head: the hair's mass or the face
  onHead.ellipse(H.mass[0], H.mass[1], H.mass[2], H.mass[3], 0, 0, 7);
  function along(u) {                                             // the hairline at u (0 above her left ear, 1 above her right), in 3D
    var a = u * (H.front.length - 1), i = Math.min(H.front.length - 2, Math.floor(a)), f = a - i;
    return [0, 1, 2].map(function (c) { return H.front[i][c] + (H.front[i + 1][c] - H.front[i][c]) * f; });
  }
  pen.save();
  pen.clip(onHead);
  pen.lineCap = "round";
  pen.filter = "blur(" + (1.6 * s * unit).toFixed(2) + "px)";      // the roots' shadow on the skin
  pen.strokeStyle = faceCSS(H.base, 0.14);
  pen.lineWidth = 3.4 * s;
  pen.beginPath(); faceSmooth(pen, pts.map(function (q) { return [q[0], q[1] + 1.4 * s]; }), false); pen.stroke();
  pen.filter = "blur(" + (0.5 * s * unit).toFixed(2) + "px)";      // where the hair meets the skin
  pen.strokeStyle = faceCSS(H.base, 0.55);
  pen.lineWidth = 2.2 * s;
  pen.beginPath(); faceSmooth(pen, pts.map(function (q) { return [q[0], q[1] - 0.9 * s]; }), false); pen.stroke();
  pen.filter = "none";
  var fine = Math.max(0.55, 0.16 * unit) / unit;
  var light = [new Path2D(), new Path2D()], dark = [new Path2D(), new Path2D()];   // roots: [their thin first part, the rest]
  for (var r = 0; r < 320; r++) {
    var u = faceRandom(r * 3 + 1), root = along(u);
    var down = 1.8 * s * Math.pow(faceRandom(r * 3 + 2), 2);      // most begin at the edge, a few below it
    var r3 = [root[0], root[1] + down, root[2]];
    var tip3 = H.onSkull(H.slerp(H.dirOf(root), H.knotDir, 0.05 + 0.05 * faceRandom(r * 3 + 3)));
    var a = H.turn(r3), b = H.turn(tip3), mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    var lane = faceRandom(r + 900) < 0.5 ? 0 : 1;
    light[lane].moveTo(a[0], a[1]); light[lane].lineTo(mid[0], mid[1]);
    dark[lane].moveTo(mid[0], mid[1]); dark[lane].lineTo(b[0], b[1]);
  }
  pen.lineWidth = fine;
  [0, 1].forEach(function (lane) {
    pen.strokeStyle = faceCSS(faceMix(H.base, [255, 255, 255], 0.06 * lane), 0.28);
    pen.stroke(light[lane]);
    pen.strokeStyle = faceCSS(faceMix(H.base, [255, 255, 255], 0.06 * lane), 0.7);
    pen.stroke(dark[lane]);
  });
  for (var b2 = 0; b2 < 70; b2++) {                               // baby hairs: most at the temples, fine, curling up and back
    var bu = faceRandom(b2 * 5 + 11);
    if (Math.abs(bu - 0.5) < 0.28 && faceRandom(b2 * 5 + 12) < 0.6) { bu = bu < 0.5 ? bu * 0.45 : 1 - (1 - bu) * 0.45; }
    var br = along(bu), bd = 2.4 * s * faceRandom(b2 * 5 + 13);
    var b3 = [br[0], br[1] + bd, br[2]];
    var bt3 = H.onSkull(H.slerp(H.dirOf(br), H.knotDir, 0.03 + 0.05 * faceRandom(b2 * 5 + 14)));
    var ba = H.turn(b3), bb = H.turn(bt3);
    var curl = (faceRandom(b2 * 5 + 15) - 0.5) * 3 * s;
    pen.strokeStyle = faceCSS(H.base, 0.3 + 0.2 * faceRandom(b2 * 5 + 16));
    pen.lineWidth = fine * 0.8;
    pen.beginPath();
    pen.moveTo(ba[0], ba[1]);
    pen.quadraticCurveTo((ba[0] + bb[0]) / 2 + curl, (ba[1] + bb[1]) / 2 - Math.abs(curl) * 0.3, bb[0] + curl * 0.4, bb[1]);
    pen.stroke();
  }
  [0, 1].forEach(function (end) {                                 // wisps before each ear, falling a little forward
    var ea = H.turn(along(end ? 0.995 : 0.005));
    for (var w = 0; w < 7; w++) {
      var len = (2.5 + 3 * faceRandom(w * 7 + end * 50)) * s, sway = (end ? -1 : 1) * (0.6 + faceRandom(w * 7 + end * 50 + 1)) * s;
      pen.strokeStyle = faceCSS(H.base, 0.35);
      pen.lineWidth = fine * 0.9;
      pen.beginPath();
      pen.moveTo(ea[0] + (w - 3) * 0.25 * s, ea[1] - 0.5 * s);
      pen.quadraticCurveTo(ea[0] + sway * 0.4, ea[1] + len * 0.6, ea[0] + sway, ea[1] + len);
      pen.stroke();
    }
  });
  pen.restore();
}

// The mouth and the chin, as the light finds them (owner, 2026-10-26: "Work on the lips and chin"):
//   - above the lip, the philtrum: a soft groove from under the nose to the dip of the bow, a lit ridge either side
//   - the lips are the skin flushed rose, not paint: the upper lip faces down and is darker, a fine light along its
//     border (the vermilion's edge) and the bow; the lower lip faces up into the light, fuller, a soft gleam on it,
//     its lower edge melting into the skin rather than outlined
//   - where they meet, a line darkest at the corners, each corner set a little into the cheek
//   - under the lower lip the fold above the chin (the mentolabial groove) holds a soft shadow; the chin's pad
//     catches the light; its underside turns into shadow, and casts a soft one on the neck (faceChinShadow())
// F: FACE_NOW; own: FACE_LOOKS' row; mouth: mouthAt()'s shape or null. Draws with pen in the head's frame.
function faceLips(F, own, mouth) {
  function pts(list) { return list.map(function (n) { return facePoint(F, n, 0); }); }
  function at(n) { return facePoint(F, n, 0); }
  var uo = pts(FACE_LIPS.upperOuter), lo = pts(FACE_LIPS.lowerOuter), ui = pts(FACE_LIPS.upperInner), li = pts(FACE_LIPS.lowerInner);
  var skin = faceRGB(SKIN), style = F.style, light = faceUnit(FACE.light);
  var rose = faceMix(skin, faceRGB(own.lips || "#b9606a"), 0.62);
  var m = pen.getTransform(), unit = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
  var wide = Math.hypot(uo[10][0] - uo[0][0], uo[10][1] - uo[0][1]);      // corner to corner
  var mid = [(ui[5][0] + li[5][0]) / 2, (ui[5][1] + li[5][1]) / 2];
  function soft(paint, blur) {                                     // a soft-edged wash: blur in head units
    pen.save();
    pen.filter = "blur(" + (blur * unit).toFixed(2) + "px)";
    paint();
    pen.filter = "none";
    pen.restore();
  }
  // the philtrum: the groove under the nose, the two ridges beside it
  var under = at(164), bow = at(0), ridgeL = at(37), ridgeR = at(267);
  soft(function () {
    pen.strokeStyle = faceCSS(faceMix(skin, [120, 55, 45], 0.25), 0.5);
    pen.lineWidth = wide * 0.09;
    pen.lineCap = "round";
    pen.beginPath(); pen.moveTo(under[0], under[1] + 1); pen.lineTo(bow[0], bow[1] - 1); pen.stroke();
    pen.strokeStyle = faceCSS(faceMix(skin, [255, 245, 235], 0.45), 0.5 * style.shade);
    pen.lineWidth = wide * 0.035;
    [ridgeL, ridgeR].forEach(function (r) {
      pen.beginPath(); pen.moveTo(under[0] + (r[0] - under[0]) * 0.45, under[1] + 1.5); pen.lineTo(r[0], r[1] - 1); pen.stroke();
    });
  }, wide * 0.035);
  // the fold under the lower lip, and the light on the chin's pad
  var fold = at(18), pad = at(199), tip = at(152);
  soft(function () {
    pen.fillStyle = faceCSS(faceMix(skin, [110, 50, 42], 0.35), 0.55);
    pen.beginPath(); pen.ellipse(fold[0], fold[1] - wide * 0.02, wide * 0.3, wide * 0.07, 0, 0, 7); pen.fill();
    pen.fillStyle = faceCSS(faceMix(skin, [255, 246, 236], 0.5), 0.55 * style.shade);
    pen.beginPath(); pen.ellipse(pad[0] + light[0] * wide * 0.06, pad[1] + light[1] * wide * 0.05, wide * 0.24, wide * 0.13, 0, 0, 7); pen.fill();
    pen.fillStyle = faceCSS(faceMix(skin, [110, 50, 42], 0.3), 0.45);   // the chin turning under, toward the jaw
    pen.beginPath(); pen.ellipse(tip[0], tip[1] - wide * 0.03, wide * 0.32, wide * 0.06, 0, 0, 7); pen.fill();
  }, wide * 0.06);
  // an open mouth: the dark inside, the upper teeth, the tongue
  var open = new Path2D();
  faceSmooth(open, ui, false);
  faceSmooth(open, li.slice().reverse(), false, true);
  open.closePath();
  var gap = Math.hypot(ui[5][0] - li[5][0], ui[5][1] - li[5][1]);
  if (gap > 0.6) {
    pen.fillStyle = "#3a1416";
    pen.fill(open);
    pen.save();
    pen.clip(open);
    pen.fillStyle = "#efe7dc";
    pen.beginPath(); faceSmooth(pen, ui.map(function (q) { return [q[0], q[1] + gap * 0.3]; }), false);
    faceSmooth(pen, ui.slice().reverse().map(function (q) { return [q[0], q[1] - 2]; }), false, true); pen.closePath(); pen.fill();
    pen.fillStyle = "#b9606a";
    pen.beginPath(); pen.ellipse(li[5][0], li[5][1] - gap * 0.15, wide * 0.25, gap * 0.3, 0, 0, 7); pen.fill();
    pen.restore();
  }
  var upperLip = new Path2D();
  faceSmooth(upperLip, uo, false);
  faceSmooth(upperLip, ui.slice().reverse(), false, true);
  upperLip.closePath();
  var lowerLip = new Path2D();
  faceSmooth(lowerLip, lo, false);
  faceSmooth(lowerLip, li.slice().reverse(), false, true);
  lowerLip.closePath();
  // the lower lip: its body soft-edged into the skin, lit from above, a gleam, darker at the corners
  soft(function () {
    var down = pen.createLinearGradient(0, li[5][1], 0, lo[5][1]);
    down.addColorStop(0, faceCSS(faceMix(rose, [70, 20, 26], 0.3)));
    down.addColorStop(0.3, faceCSS(rose));
    down.addColorStop(0.7, faceCSS(faceMix(rose, skin, 0.15)));
    down.addColorStop(1, faceCSS(faceMix(rose, skin, 0.45)));
    pen.fillStyle = down;
    pen.fill(lowerLip);
  }, wide * 0.018);
  pen.save();
  pen.clip(lowerLip);
  [lo[0], lo[10]].forEach(function (c) {                          // the corners sink into shadow
    var dusk = pen.createRadialGradient(c[0], c[1], 0, c[0], c[1], wide * 0.3);
    dusk.addColorStop(0, faceCSS(faceMix(rose, [60, 18, 22], 0.4), 0.7));
    dusk.addColorStop(1, faceCSS(faceMix(rose, [60, 18, 22], 0.4), 0));
    pen.fillStyle = dusk;
    pen.fillRect(c[0] - wide * 0.3, c[1] - wide * 0.3, wide * 0.6, wide * 0.6);
  });
  var gx = mid[0] + light[0] * wide * 0.08, gy = (li[5][1] + lo[5][1]) / 2 + light[1] * (lo[5][1] - li[5][1]) * 0.15;
  var gleam = pen.createRadialGradient(gx, gy, 0, gx, gy, wide * 0.18);
  gleam.addColorStop(0, "rgba(255, 238, 236, " + (0.35 * style.shade + 0.1) + ")");
  gleam.addColorStop(1, "rgba(255, 238, 236, 0)");
  pen.fillStyle = gleam;
  pen.beginPath(); pen.ellipse(gx, gy, wide * 0.18, wide * 0.06, 0, 0, 7); pen.fill();
  pen.restore();
  // the upper lip: crisper at its border, darker toward where the lips meet and at the corners
  soft(function () {
    var up = pen.createLinearGradient(0, uo[5][1] - 1, 0, ui[5][1]);
    up.addColorStop(0, faceCSS(faceMix(rose, skin, 0.1)));
    up.addColorStop(0.5, faceCSS(faceMix(rose, [70, 20, 26], 0.18)));
    up.addColorStop(1, faceCSS(faceMix(rose, [60, 16, 22], 0.38)));
    pen.fillStyle = up;
    pen.fill(upperLip);
  }, wide * 0.008);
  pen.save();                                                     // fine lines across both lips, very faint
  [upperLip, lowerLip].forEach(function (lip, which) {
    pen.save();
    pen.clip(lip);
    pen.strokeStyle = faceCSS(faceMix(rose, [60, 15, 22], 0.4), 0.1);
    pen.lineWidth = wide * 0.006;
    var row = which ? lo : uo, inside = which ? li : ui;
    for (var k = 1; k < 22; k++) {
      var u = k / 22, a = u * (row.length - 1), i = Math.floor(a), f = a - i;
      var p = [row[i][0] + (row[i + 1][0] - row[i][0]) * f, row[i][1] + (row[i + 1][1] - row[i][1]) * f];
      var q = [inside[i][0] + (inside[i + 1][0] - inside[i][0]) * f, inside[i][1] + (inside[i + 1][1] - inside[i][1]) * f];
      pen.beginPath(); pen.moveTo(p[0], p[1]); pen.lineTo(q[0] + (p[0] - q[0]) * 0.25, q[1] + (p[1] - q[1]) * 0.25); pen.stroke();
    }
    pen.restore();
  });
  pen.restore();
  // the light along the upper lip's border and its bow
  pen.lineCap = "round";
  pen.strokeStyle = faceCSS(faceMix(skin, [255, 248, 240], 0.4), 0.25 * style.shade + 0.1);
  pen.lineWidth = wide * 0.01;
  pen.beginPath(); faceSmooth(pen, uo.slice(1, 10).map(function (q) { return [q[0], q[1] - wide * 0.012]; }), false); pen.stroke();
  // where the lips meet: a line that swells toward each corner, and the corners set into the cheek
  var meet = ui.map(function (q, i) { return [(q[0] + li[i][0]) / 2, (q[1] + li[i][1]) / 2]; });
  if (gap <= 0.6) {                                               // one smooth line, and over it each corner's end, darker
    var ink = faceMix(rose, [45, 12, 16], 0.55 + 0.15 * style.ink);
    pen.strokeStyle = faceCSS(ink, 0.6);
    pen.lineWidth = wide * 0.013;
    pen.beginPath(); faceSmooth(pen, meet, false); pen.stroke();
    pen.strokeStyle = faceCSS(ink, 0.45);
    pen.lineWidth = wide * 0.022;
    pen.beginPath(); faceSmooth(pen, meet.slice(0, 3), false); pen.stroke();
    pen.beginPath(); faceSmooth(pen, meet.slice(-3), false); pen.stroke();
  }
  [[uo[0], meet[0], -1], [uo[10], meet[meet.length - 1], 1]].forEach(function (c) {
    var dimple = pen.createRadialGradient(c[0][0], c[0][1], 0, c[0][0], c[0][1], wide * 0.07);
    dimple.addColorStop(0, faceCSS(faceMix(skin, [90, 35, 32], 0.4), 0.45));
    dimple.addColorStop(1, faceCSS(faceMix(skin, [90, 35, 32], 0.4), 0));
    pen.fillStyle = dimple;
    pen.beginPath(); pen.arc(c[0][0], c[0][1], wide * 0.07, 0, 7); pen.fill();
  });
}

// The chin's shadow on the neck: soft, just under the jaw, where the neck is (drawn before the face, so the face
// covers its top). F: FACE_NOW. Draws with pen in the head's frame.
function faceChinShadow(F) {
  var tip = F.at[152], left = F.at[172], right = F.at[397];
  var wide = Math.abs(right[0] - left[0]);
  var m = pen.getTransform(), unit = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
  pen.save();
  pen.beginPath();
  pen.rect(tip[0] - wide * 0.3, tip[1] - wide * 0.2, wide * 0.6, wide * 0.4);
  pen.clip();
  pen.filter = "blur(" + (wide * 0.05 * unit).toFixed(2) + "px)";
  pen.fillStyle = "rgba(110, 55, 45, 0.2)";
  pen.beginPath(); pen.ellipse(tip[0], tip[1] + wide * 0.02, wide * 0.17, wide * 0.06, 0, 0, 7); pen.fill();
  pen.filter = "none";
  pen.restore();
}

// ---------- the hair ----------

// The hair of a head with a mesh, pulled back smooth from the brow to a knot on the back of the crown: a dark mass
// over the skull above the hairline, then strand by strand along the skull to the knot, each strand's light by its
// way against the light (Kajiya and Kay), then the knot as strands coiled round it. h: personHead()'s head. Reads
// FACE_NOW. Returns the knot's middle, [x, y], in the head's frame.
function faceHair(h) {
  var F = FACE_NOW, face = F.face, sk = face.skull, own = faceOwn(F.look.mesh), style = F.style;
  var base = faceRGB(F.look.hair || own.hair || "#191310");
  var lift = 2.2 * FACE.scale;                                    // the hair lies this far off the skull
  var R = [sk.x + lift, sk.y + lift, sk.z + lift];
  function onSkull(d) { var u = faceUnit(d); return [u[0] * R[0], sk.cy + u[1] * R[1], sk.cz + u[2] * R[2]]; }
  function dirOf(p) { return faceUnit([p[0] / R[0], (p[1] - sk.cy) / R[1], (p[2] - sk.cz) / R[2]]); }
  function slerp(a, b, t) {
    var dot = faceBound(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), w = Math.acos(dot);
    if (w < 1e-4) { return a; }
    var sa = Math.sin((1 - t) * w) / Math.sin(w), sb = Math.sin(t * w) / Math.sin(w);
    return [a[0] * sa + b[0] * sb, a[1] * sa + b[1] * sb, a[2] * sa + b[2] * sb];
  }
  // the hairline: across the brow from the traced face's top edge, raised a little; then round over each ear to
  // the nape, on the skull
  var traced = FACE_HAIRLINE.map(function (n) { var p = F.moved[n]; return [p[0] * 1.02, p[1] - 1.5 * FACE.scale, p[2] - 1]; });
  // a natural contour (2026-10-26, "make the hairline look realistic"): the traced edge, three times as many points,
  // with a soft rounded peak at the middle, the temples a little back, and an edge that is never quite smooth
  var front = [];
  for (var fi2 = 0; fi2 < (traced.length - 1) * 3 + 1; fi2++) {
    var fa = fi2 / 3, f0 = Math.min(traced.length - 2, Math.floor(fa)), ft = fa - f0;
    var fp = [0, 1, 2].map(function (c) { return traced[f0][c] + (traced[f0 + 1][c] - traced[f0][c]) * ft; });
    var fu = fi2 / ((traced.length - 1) * 3), fc = Math.abs(fu - 0.5) * 2;
    var peak = 1.3 * Math.exp(-Math.pow((fu - 0.5) / 0.07, 2));
    var recede = 1.4 * Math.exp(-Math.pow((fc - 0.62) / 0.14, 2));
    var wobble = 0.5 * (faceRandom(fi2 * 13 + 7) - 0.5);
    fp[1] += (peak - recede + wobble) * FACE.scale;
    front.push(fp);
  }
  var earTop = F.moved[234][1] - 9 * FACE.scale, nape = F.moved[152][1] - 8 * FACE.scale, back = [];
  for (var k = 1; k <= 8; k++) {                                  // from behind her left ear round the back to behind her right
    var a = Math.PI * (0.62 + 0.76 * k / 9), y = earTop + (nape - earTop) * Math.sin(Math.PI * k / 9);
    back.push(onSkull([Math.sin(a), (y - sk.cy) / R[1], Math.cos(a)]));
  }
  var loop = front.concat(back.slice().reverse());              // the front ends above her right ear: round the back from there
  var loopAt = loop.map(function (p) { return faceTurn(p, F.yaw, sk); });
  // the mass: the skull's outline grown by the hair, outside the hairline
  var massR = [Math.sqrt(Math.pow(R[0] * Math.cos(F.yaw), 2) + Math.pow(R[2] * Math.sin(F.yaw), 2)), R[1]];
  var region = new Path2D();
  region.ellipse(F.skull.x, sk.cy, massR[0], massR[1], 0, 0, 7);
  var hairFront = front.map(function (p) { return faceTurn(p, F.yaw, sk); });
  function sideOf(dy) {                                           // the skin's side of the hairline moved down by dy: below it
    var path = new Path2D();                                      // across the brow, and straight down from each temple
    path.moveTo(hairFront[0][0], hairFront[0][1] + 400);
    hairFront.forEach(function (p) { path.lineTo(p[0], p[1] + dy); });
    path.lineTo(hairFront[hairFront.length - 1][0], hairFront[hairFront.length - 1][1] + 400);
    path.closePath();
    return path;
  }
  var skinSide = sideOf(-1.8 * FACE.scale);                       // the mass stops a little above the hairline: the roots fill in
  pen.save();
  var hairClip = new Path2D();
  hairClip.addPath(region);
  hairClip.addPath(skinSide);
  pen.clip(hairClip, "evenodd");
  pen.beginPath();                                                // the hair, pulled up, ends a little below the ears
  pen.rect(-400, -700, 800, 700 + F.ears + 6 * FACE.scale);
  pen.clip();
  pen.fillStyle = faceCSS(base);
  pen.fill(region);
  // the strands, from roots along the hairline to a ring at the foot of the knot
  var knotDir = faceUnit([0.0, -0.78, -0.62]), knotFoot = onSkull(knotDir);
  var light = faceUnit(FACE.light), view = [0, 0, 1], half = faceUnit([light[0] + view[0], light[1] + view[1], light[2] + view[2]]);
  var bins = [], LEVELS = 14;
  for (k = 0; k < LEVELS; k++) { bins.push(new Path2D()); }
  var roots = [];
  for (var i = 0; i < loop.length - 1; i++) {                     // roots along the hairline, close across the brow
    var a0 = loop[i], a1 = loop[i + 1], dense = i < front.length - 1 ? 20 : 18;   // (the front has three points to the traced one)
    for (var j = 0; j < dense; j++) {
      var t = (j + faceRandom(i * 131 + j)) / dense;
      roots.push([a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t, a0[2] + (a1[2] - a0[2]) * t, i * 1000 + j]);
    }
  }
  var turn = function (p) { return faceTurn(p, F.yaw, sk); };
  roots.forEach(function (r) {
    var seed = r[3], from = dirOf(r), clump = Math.floor(seed / 7);
    var spin = (faceRandom(clump) - 0.5) * 0.18 + (faceRandom(seed) - 0.5) * 0.05;
    var to = faceUnit([knotDir[0] + Math.sin(Math.atan2(from[0], -from[2]) + spin) * 0.16, knotDir[1] + 0.05, knotDir[2] + Math.cos(Math.atan2(from[0], -from[2])) * 0.1]);
    var prev = null;
    for (var s = 0; s <= 12; s++) {
      var u = s / 12, d = slerp(from, to, u), p = onSkull(d);
      var puff = 1 + 0.035 * Math.sin(Math.PI * u) * (0.7 + 0.6 * faceRandom(clump + 5));
      p = [p[0] * puff, sk.cy + (p[1] - sk.cy) * puff, sk.cz + (p[2] - sk.cz) * puff];
      var q = turn(p);
      if (prev) {
        var normal = faceUnit([q[0] - F.skull.x, (q[1] - sk.cy) * 0.8, q[2] - sk.cz]);
        if (normal[2] > -0.15) {
          var tan = faceUnit([q[0] - prev[0], q[1] - prev[1], q[2] - prev[2]]);
          var th = tan[0] * half[0] + tan[1] * half[1] + tan[2] * half[2];
          var spec = Math.pow(Math.sqrt(Math.max(0, 1 - th * th)), 70);
          var tan2 = faceUnit([tan[0] + normal[0] * 0.3, tan[1] + normal[1] * 0.3, tan[2] + normal[2] * 0.3]);
          var th2 = tan2[0] * half[0] + tan2[1] * half[1] + tan2[2] * half[2];
          var spec2 = Math.pow(Math.sqrt(Math.max(0, 1 - th2 * th2)), 18);
          var diffuse = clamp(0.5 + 0.5 * (normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2]));
          var level = clamp(0.25 * diffuse + 0.7 * spec + 0.25 * spec2 + 0.08 * (faceRandom(seed + s) - 0.5));
          var bin = bins[Math.min(LEVELS - 1, Math.floor(level * LEVELS))];
          bin.moveTo(prev[0], prev[1]);
          bin.lineTo(q[0], q[1]);
        }
      }
      prev = q;
    }
  });
  var m = pen.getTransform(), unit = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
  pen.lineCap = "round";
  pen.lineWidth = Math.max(0.8, 0.34 * unit) / unit;              // a strand is fine at any size
  for (k = 0; k < LEVELS; k++) {
    var lv = k / (LEVELS - 1);
    var tone = faceMix(faceMix(base, [0, 0, 0], 0.45), faceMix(base, [235, 222, 210], 0.72), Math.pow(lv, 1.15));
    pen.strokeStyle = faceCSS(tone, 0.75);
    pen.stroke(bins[k]);
  }
  pen.restore();
  F.hairline = {front: front, turn: turn, dirOf: dirOf, onSkull: onSkull, slerp: slerp, knotDir: knotDir, base: base,
                mass: [F.skull.x, sk.cy, massR[0], massR[1]]};
  // the knot: a coil of strands round its middle
  var knotR = 12 * FACE.scale, kc = onSkull(knotDir);
  kc = [kc[0] + knotDir[0] * knotR * 0.55, kc[1] + knotDir[1] * knotR * 0.55, kc[2] + knotDir[2] * knotR * 0.55];
  var kAt = turn(kc);
  var kGrad = pen.createRadialGradient(kAt[0] + light[0] * knotR * 0.4, kAt[1] + light[1] * knotR * 0.4, 0, kAt[0], kAt[1], knotR);
  kGrad.addColorStop(0, faceCSS(faceMix(base, [120, 100, 90], 0.25)));
  kGrad.addColorStop(1, faceCSS(faceMix(base, [0, 0, 0], 0.3)));
  pen.fillStyle = kGrad;
  pen.beginPath(); pen.ellipse(kAt[0], kAt[1], knotR, knotR * 0.9, 0, 0, 7); pen.fill();
  var kBins = [];
  for (k = 0; k < LEVELS; k++) { kBins.push(new Path2D()); }
  var ax = knotDir, bx = faceUnit([1, 0, 0]), by = faceUnit([ax[1] * bx[2] - ax[2] * bx[1], ax[2] * bx[0] - ax[0] * bx[2], ax[0] * bx[1] - ax[1] * bx[0]]);
  for (var c = 0; c < 70; c++) {
    var rad = knotR * (0.25 + 0.75 * faceRandom(c + 700)), lat = (faceRandom(c + 800) - 0.5) * 0.9, ph = faceRandom(c + 900) * 7;
    var prevK = null;
    for (s = 0; s <= 28; s++) {
      var ang = ph + s / 28 * Math.PI * 2;
      var rr = Math.sqrt(Math.max(0, 1 - lat * lat)) * rad;
      var pk = [kc[0] + (bx[0] * Math.cos(ang) + by[0] * Math.sin(ang)) * rr + ax[0] * lat * knotR * 0.7,
                kc[1] + (bx[1] * Math.cos(ang) + by[1] * Math.sin(ang)) * rr + ax[1] * lat * knotR * 0.7,
                kc[2] + (bx[2] * Math.cos(ang) + by[2] * Math.sin(ang)) * rr + ax[2] * lat * knotR * 0.7];
      var qk = turn(pk);
      if (prevK && qk[2] > kAt[2] - knotR * 0.1) {
        var tk = faceUnit([qk[0] - prevK[0], qk[1] - prevK[1], qk[2] - prevK[2]]);
        var hk = tk[0] * half[0] + tk[1] * half[1] + tk[2] * half[2];
        var sk2 = Math.pow(Math.sqrt(Math.max(0, 1 - hk * hk)), 50);
        var nk = faceUnit([qk[0] - kAt[0], qk[1] - kAt[1], qk[2] - kAt[2]]);
        var dk = clamp(0.5 + 0.5 * (nk[0] * light[0] + nk[1] * light[1] + nk[2] * light[2]));
        var lk = clamp(0.3 * dk + 0.7 * sk2);
        var kb = kBins[Math.min(LEVELS - 1, Math.floor(lk * LEVELS))];
        kb.moveTo(prevK[0], prevK[1]);
        kb.lineTo(qk[0], qk[1]);
      }
      prevK = qk;
    }
  }
  pen.lineWidth = Math.max(0.7, 0.28 * unit) / unit;
  for (k = 0; k < LEVELS; k++) {
    var lk2 = k / (LEVELS - 1);
    pen.strokeStyle = faceCSS(faceMix(faceMix(base, [0, 0, 0], 0.35), faceMix(base, [235, 222, 210], 0.6), Math.pow(lk2, 1.3)), 0.8);
    pen.stroke(kBins[k]);
  }
  if (style.outline > 0.5) {                                      // an inked face: one line round the hair's outer edge (the face, drawn after, covers its foot)
    pen.strokeStyle = inkFor(faceCSS(base));
    pen.lineWidth = LINE * style.outline * 0.8;
    pen.beginPath(); pen.ellipse(F.skull.x, sk.cy, massR[0], massR[1], 0, Math.PI * 0.95, Math.PI * 2.05); pen.stroke();
  }
  return [kAt[0], kAt[1], knotR];
}
