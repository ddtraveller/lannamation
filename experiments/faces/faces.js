// faces.js - faces traced from photographs of the north, moved by their muscles (beside oldcartoon.js; needs
// faces_data.js).
//
// The owner, 2026-10-26: the hero film's scenery and water are lovely but its faces "few in variety and low in
// quality"; trace Lanna faces of both sexes and all ages, "every line of the eye", each hair, "max out on beauty";
// then, from krueng.ai/acuchart.html's muscle chart, "a threaded puppet for the face ... to give a sense of accurate
// movement and shape" (yes). So a face here is:
//   - a mesh: the 478 points MediaPipe's face landmarker traces, averaged over two or three faces from photographs
//     of the north (FACE_MESHES), in 3D, so the head turns by rotating it, not by blending drawn keys;
//   - muscles under it (FACE_MUSCLES), after Waters (1987, "A muscle model for animating three-dimensional facial
//     expression"): each a bone point and a skin point that pulls the skin near it toward the bone, fading with the
//     angle off its line and with distance; the rings round the eyes and the mouth squeeze toward their middle; the
//     jaw turns on its hinge. A feeling (feelingOf()) and the mouth (mouthAt()) set how hard each pulls;
//   - light on the mesh's own triangles, soft, with the hollows darker; the eye drawn part by part, the brows hair
//     by hair, the hair strand by strand over the skull, its sheen from each strand's way against the light
//     (Kajiya and Kay, 1989).
// A look asks for it with `mesh` (a name of FACE_MESHES); `meshStyle` picks how it is painted (FACE_STYLES).

// How the traced face is fitted to the kit's head, and the light.
var FACE = {
  scale: 1.18,                 // the traced face made as tall as the kit's head, about the chin
  wide: 1,                     // 1.095 would undo the head frame's 0.84 : 0.92 squash; at 1 the face keeps it (narrower: 1.095 read male, owner 2026-10-26)
  deep: 1.25,                  // MediaPipe's depth is shallow: deepened
  chin: -227,
  light: [-0.42, -0.58, 0.7],  // toward the light, in the head's frame (x right, y down, z toward the viewer)
  skull: {x: 39, y: 51, z: 50, cy: -272, cz: -18}   // the skull, an ellipsoid (before scale): radii and middle
};

// How a face is painted. outline: the weight of the line round the face (1 the kit's ink line); ink: how dark the
// features' lines are; shade: how strongly the light models the face; soft: the blur of that light, in head units.
// Every line of the skin (the chin and jaw, round the nose, the ears, the head) is a shade darker than the skin,
// never black (owner, 2026-10-26: "a little darker than skin tone but not black"): faceLine().
var FACE_STYLES = {
  inked: {outline: 1, ink: 1, shade: 0.55, soft: 1.9},
  painted: {outline: 0.45, ink: 0.45, shade: 1, soft: 2.6},
  between: {outline: 0.7, ink: 0.7, shade: 0.8, soft: 2.2}
};

// The brows: MediaPipe gives each as two lines of five points, outer end first.
var FACE_BROWS = {
  R: {upper: [70, 63, 105, 66, 107], lower: [46, 53, 52, 65, 55]},
  L: {upper: [300, 293, 334, 296, 336], lower: [276, 283, 282, 295, 285]}
};
// The eyes: each lid from the outer corner to the inner, and the iris's middle and rim.
var FACE_EYES = {
  R: {upper: [33, 246, 161, 160, 159, 158, 157, 173, 133], lower: [33, 7, 163, 144, 145, 153, 154, 155, 133],
      iris: 468, rim: [469, 470, 471, 472], outer: -1},
  L: {upper: [263, 466, 388, 387, 386, 385, 384, 398, 362], lower: [263, 249, 390, 373, 374, 380, 381, 382, 362],
      iris: 473, rim: [474, 475, 476, 477], outer: 1}
};
// The lips, from the corner on her right round to it again: the outer line and the inner.
var FACE_LIPS = {
  upperOuter: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
  lowerOuter: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
  upperInner: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],
  lowerInner: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308]
};
// The hairline across the brow, from above her left ear round to above her right: the top of the traced face.
var FACE_HAIRLINE = [356, 389, 251, 284, 332, 297, 338, 10, 109, 67, 103, 54, 21, 162, 127];

// The muscles. A sheet ("sheet") pulls the skin within "cone" radians of its line toward its bone point; it
// reaches past its skin point by "past" of its length; "most" is how far, in head units, it moves the skin at
// its skin point when it pulls fully. A ring ("ring") squeezes toward its middle, "across" and "up" saying how
// much each way. Points are landmark numbers; "bone" may be [landmark, dx, dy], a point off the skin. Each named
// once, for her right side; the left is its mirror (FACE_MIRROR).
var FACE_MUSCLES = [
  {name: "frontalisIn", kind: "sheet", bone: [108, 0, -34], skin: 66, cone: 0.5, past: 0.45, most: 6},
  {name: "frontalisOut", kind: "sheet", bone: [104, -4, -30], skin: 63, cone: 0.5, past: 0.45, most: 5},
  {name: "corrugator", kind: "sheet", bone: [168, -3, -2], skin: 65, cone: 0.45, past: 0.5, most: 3.2},
  {name: "procerus", kind: "sheet", bone: 6, skin: 9, cone: 0.5, past: 0.4, most: 2.4, middle: true},
  {name: "levatorLabii", kind: "sheet", bone: 120, skin: 40, cone: 0.35, past: 0.35, most: 3.2},
  {name: "zygomaticus", kind: "sheet", bone: [116, -2, -2], skin: 61, cone: 0.4, past: 0.3, most: 7},
  {name: "risorius", kind: "sheet", bone: 132, skin: 61, cone: 0.32, past: 0.25, most: 4.5},
  {name: "depressor", kind: "sheet", bone: 150, skin: 61, cone: 0.35, past: 0.3, most: 3.8},
  {name: "mentalis", kind: "sheet", bone: 199, skin: 18, cone: 0.6, past: 0.3, most: 2.5, middle: true},
  {name: "oculi", kind: "ring", eye: "R", reach: [1.75, 2.6], hole: 0.5, across: 0.25, up: 1, most: 2.6},
  {name: "oris", kind: "ring", mouth: true, reach: [1.35, 2.6], hole: 0, across: 1, up: 0.45, most: 3.5, middle: true}
];

// ---------- the mesh ----------

var FACE_CACHE = {};

// The mirror of each landmark (its partner across the middle of the face; a point on the middle is its own).
// mesh: an array of [x, y, z]. Returns an array of landmark numbers.
// e.g. var mirror = faceMirror(faceMesh("woman").rest);
function faceMirror(points) {
  var out = [];
  for (var i = 0; i < points.length; i++) {
    var best = i, near = Infinity;
    for (var j = 0; j < points.length; j++) {
      var dx = -points[i][0] - points[j][0], dy = points[i][1] - points[j][1], dz = points[i][2] - points[j][2];
      var d = dx * dx + dy * dy + dz * dz;
      if (d < near) { near = d; best = j; }
    }
    out.push(best);
  }
  return out;
}

// A face made more a woman's, by how much ("fem", 0 to 1), on top of its trace (owner, 2026-10-26: the traced
// women "all look male still"). MediaPipe's trace leans toward its own average face, broad in the jaw, so the
// differences between women's and men's faces are put back: the jaw narrows toward the chin (a V), the chin is
// smaller and the lower face a little shorter; the eyes a little larger; the brows higher and arched; the nose's
// wings narrower; the upper lip fuller and the mouth a little narrower; the cheeks' apples fuller.
// rest: the face's points in head units, looking straight out (changed in place); fem: 0 to 1.
// e.g. faceFeminine(points, 1);
function faceFeminine(rest, fem) {
  if (!fem) { return; }
  var eyeY = (rest[33][1] + rest[263][1]) / 2, mouthY = (rest[13][1] + rest[14][1]) / 2, chinY = rest[152][1], lipY = rest[17][1];
  var n, p, t;
  var half = Math.abs(rest[454][0] - rest[234][0]) / 2, bone = eyeY + 0.25 * (mouthY - eyeY);
  for (n = 0; n < rest.length; n++) {
    p = rest[n];
    if (p[1] > eyeY) {                                            // the V: narrower from the cheekbones down, most at the jaw
      var below = p[1] > mouthY ? 0.07 + 0.2 * Math.sin(Math.min(1, (p[1] - mouthY) / (chinY - mouthY)) * Math.PI / 2)
                                : 0.07 * (p[1] - eyeY) / (mouthY - eyeY);
      // and pinched in under the cheekbone, at the face's edge, most halfway down to the jaw's corner (owner,
      // 2026-10-26: "pinch in at the cheeks a little and narrow the jaw"); the cheekbone itself stays
      var edge = clamp((Math.abs(p[0]) / half - 0.55) / 0.45);
      var hollow = p[1] > bone ? Math.sin(Math.min(1, (p[1] - bone) / (chinY - 6 - bone)) * Math.PI) : 0;
      p[0] *= 1 - fem * (below + 0.06 * edge * hollow);
    }
    if (p[1] > lipY) {                                            // a shorter, smaller chin, its tip pushed up most, so the
      t = Math.min(1, (p[1] - lipY) / (chinY - lipY));            // jaw runs into it at a gentler angle (owner, 2026-10-26)
      var centre = clamp(1 - Math.abs(p[0] - rest[152][0]) / (0.45 * Math.abs(rest[454][0] - rest[234][0])));
      p[1] -= fem * (2.6 * t + 2.4 * t * t * centre);
    }
  }
  ["R", "L"].forEach(function (e) {                               // larger eyes, with their lids and irises
    var ring = FACE_EYES[e].upper.concat(FACE_EYES[e].lower), c = [0, 0], half = Math.abs(rest[ring[0]][0] - rest[ring[8]][0]) / 2;
    ring.forEach(function (i) { c[0] += rest[i][0] / ring.length; c[1] += rest[i][1] / ring.length; });
    for (n = 0; n < rest.length; n++) {
      p = rest[n];
      var d = Math.hypot((p[0] - c[0]) / half, (p[1] - c[1]) / (half * 0.7));
      var grow = fem * 0.13 * (d < 1.1 ? 1 : Math.max(0, 1 - (d - 1.1) / 0.8));
      p[0] += (p[0] - c[0]) * grow;
      p[1] += (p[1] - c[1]) * grow;
    }
  });
  ["R", "L"].forEach(function (e) {                               // brows higher, and arched toward their outer third
    var B = FACE_BROWS[e];
    B.upper.concat(B.lower).forEach(function (i) {
      var at = B.upper.indexOf(i) >= 0 ? B.upper.indexOf(i) : B.lower.indexOf(i), u = at / 4;   // 0 at the outer end, 1 at the inner
      rest[i][1] -= fem * (1 + 1.1 * Math.sin(Math.PI * Math.min(1, u * 1.4 + 0.1)) * (u > 0.2 ? 1 : 0.6));
    });
  });
  var tip = rest[4];                                              // narrower wings to the nose
  for (n = 0; n < rest.length; n++) {
    p = rest[n];
    var dn = Math.hypot(p[0] - tip[0], (p[1] - tip[1]) * 1.3);
    if (dn < 12) { p[0] = tip[0] + (p[0] - tip[0]) * (1 - fem * 0.14 * (1 - dn / 12)); }
  }
  // the mouth narrower (0.68 of its traced width; owner, 2026-10-26: "narrow the lips", three times more), the skin round its corners
  // drawn in with them, less the further it lies from them, so nothing kinks; the upper lip fuller
  var mid = (rest[61][0] + rest[291][0]) / 2, mouthMid = (rest[13][1] + rest[14][1]) / 2;
  var halfMouth = Math.abs(rest[291][0] - rest[61][0]) / 2, lips = {};
  FACE_LIPS.upperOuter.concat(FACE_LIPS.lowerOuter, FACE_LIPS.upperInner, FACE_LIPS.lowerInner).forEach(function (i) { lips[i] = true; });
  for (n = 0; n < rest.length; n++) {
    p = rest[n];
    var reach = lips[n] ? 1 : Math.max(0, 1 - Math.hypot((Math.abs(p[0] - mid) - halfMouth) / (halfMouth * 0.9),
                                                         (p[1] - mouthMid) / (halfMouth * 0.8)));
    if (reach > 0) { p[0] = mid + (p[0] - mid) * (1 - fem * 0.32 * reach); }
  }
  FACE_LIPS.upperOuter.slice(2, 9).forEach(function (i) { rest[i][1] -= fem * 0.7; });
  [50, 280, 101, 330, 36, 266, 205, 425, 117, 346].forEach(function (i) { rest[i][2] += fem * 1.2; });   // fuller apples
}

// A face of FACE_MESHES made ready to draw, once for each "fem": its points fitted to the kit's head (FACE) and made
// that much more a woman's (faceFeminine()), its triangles turned outward, how hollow each point is, which point
// mirrors which, and its muscles on both sides.
// name: a name of FACE_MESHES; fem: 0 to 1 (0 unless told). Returns {rest, tris, hollow, mirror, muscles, skull}.
// e.g. var face = faceMesh("woman", 1);
function faceMesh(name, fem) {
  var key = name + "/" + (fem || 0);
  if (FACE_CACHE[key]) { return FACE_CACHE[key]; }
  var flat = FACE_MESHES[name].points, rest = [], n, k;
  for (n = 0; n < flat.length; n += 3) {
    rest.push([flat[n] * FACE.scale * FACE.wide, FACE.chin + (flat[n + 1] - FACE.chin) * FACE.scale, flat[n + 2] * FACE.scale * FACE.deep]);
  }
  faceFeminine(rest, fem || 0);
  var S = FACE.skull, s = FACE.scale;
  var skull = {x: S.x * s * FACE.wide, y: S.y * s, z: S.z * s * FACE.deep * 0.85,
               cy: FACE.chin + (S.cy - FACE.chin) * s, cz: S.cz * s * FACE.deep};
  var inside = [0, rest[6][1] + 10, skull.cz];      // a point inside the head: every triangle faces away from it
  var tris = FACE_TOPOLOGY.tris.map(function (t) {
    var a = rest[t[0]], b = rest[t[1]], c = rest[t[2]];
    var u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    var normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    var out = [(a[0] + b[0] + c[0]) / 3 - inside[0], (a[1] + b[1] + c[1]) / 3 - inside[1], (a[2] + b[2] + c[2]) / 3 - inside[2]];
    return normal[0] * out[0] + normal[1] * out[1] + normal[2] * out[2] < 0 ? [t[0], t[2], t[1]] : t;
  });
  var near = rest.map(function () { return []; });   // each point's neighbours, for how hollow it lies
  tris.forEach(function (t) {
    for (k = 0; k < 3; k++) { near[t[k]].push(t[(k + 1) % 3], t[(k + 2) % 3]); }
  });
  var hollow = rest.map(function (p, i) {             // how far a point lies below its ring of neighbours (two steps out)
    var ring = {}, sum = 0, count = 0;
    near[i].forEach(function (j) { ring[j] = 1; near[j].forEach(function (m) { ring[m] = 1; }); });
    delete ring[i];
    for (var j in ring) { sum += rest[j][2]; count++; }
    return count ? clamp((sum / count - p[2]) / 6) : 0;
  });
  var mirror = faceMirror(rest);
  function at(spec) {
    if (typeof spec === "number") { return rest[spec].slice(); }
    var p = rest[spec[0]];
    return [p[0] + spec[1] * s, p[1] + spec[2] * s, p[2]];
  }
  function mirrored(spec) { return typeof spec === "number" ? mirror[spec] : [mirror[spec[0]], -spec[1], spec[2]]; }
  var muscles = [];
  FACE_MUSCLES.forEach(function (m) {
    var sides = m.middle ? [["", m]] : [["R", m], ["L", Object.assign({}, m, m.kind === "ring" ? {eye: m.eye === "R" ? "L" : m.eye}
                                                                                 : {bone: mirrored(m.bone), skin: mirrored(m.skin)})]];
    sides.forEach(function (pair) {
      var one = pair[1], made = {name: m.name, side: pair[0], kind: one.kind, most: one.most * s};
      if (one.kind === "sheet") {
        made.bone = at(one.bone);
        made.skin = rest[one.skin].slice();
        made.length = Math.hypot(made.skin[0] - made.bone[0], made.skin[1] - made.bone[1]);
        made.reach = made.length * (1 + one.past);
        made.cone = one.cone;
      } else {
        var ring = one.mouth ? FACE_LIPS.upperOuter.concat(FACE_LIPS.lowerOuter) : FACE_EYES[one.eye].upper.concat(FACE_EYES[one.eye].lower);
        var mid = [0, 0], lo = [Infinity, Infinity], hi = [-Infinity, -Infinity];
        ring.forEach(function (i) {
          mid[0] += rest[i][0] / ring.length; mid[1] += rest[i][1] / ring.length;
          lo = [Math.min(lo[0], rest[i][0]), Math.min(lo[1], rest[i][1])]; hi = [Math.max(hi[0], rest[i][0]), Math.max(hi[1], rest[i][1])];
        });
        made.middle = mid;
        made.reach = [(hi[0] - lo[0]) / 2 * one.reach[0], (hi[1] - lo[1]) / 2 * one.reach[1]];
        made.across = one.across;
        made.hole = one.hole;
        made.up = one.up;
      }
      muscles.push(made);
    });
  });
  FACE_CACHE[key] = {rest: rest, tris: tris, hollow: hollow, mirror: mirror, muscles: muscles, skull: skull};
  return FACE_CACHE[key];
}

// How hard each muscle pulls (0 to 1) for a feeling (feelingOf()'s numbers) and a mouth (mouthAt()'s shape or
// null). Returns {name: pull} for both sides alike, and jaw (radians the jaw turns open).
// e.g. var pulls = facePulls(feelingOf({feel: "happy"}), null);
function facePulls(feel, mouth) {
  var smile = Math.max(feel.smile, feel.laugh);
  var pulls = {
    frontalisIn: clamp(0.9 * feel.wonder + 0.9 * feel.fear + 0.75 * feel.sad + 0.8 * feel.worry + Math.max(0, feel.browUp) / 8),
    frontalisOut: clamp(0.9 * feel.wonder + 0.5 * feel.fear + Math.max(0, feel.browUp) / 10),
    corrugator: clamp(feel.anger + 0.45 * feel.fear + 0.4 * feel.sad + 0.7 * feel.worry),
    procerus: clamp(0.6 * feel.anger),
    levatorLabii: clamp(0.25 * feel.anger + 0.15 * smile),
    zygomaticus: clamp(0.85 * feel.smile + feel.laugh),
    risorius: clamp(0.7 * feel.fear + (mouth ? 0.5 * mouth.wide : 0)),
    depressor: clamp(feel.sad + 0.3 * feel.worry),
    mentalis: clamp(0.4 * feel.sad + 0.3 * feel.anger),
    oculi: clamp(0.45 * feel.smile + 0.9 * feel.laugh + 0.3 * feel.anger),
    oris: clamp(0.3 * feel.anger + 0.2 * feel.worry + (mouth ? 0.9 * mouth.round : 0))
  };
  pulls.jaw = mouth ? 0.2 * mouth.open * (1 - 0.3 * mouth.round) : 0.02 * feel.wonder;
  return pulls;
}

// The face's points moved by its muscles and its jaw, in the face's own frame (looking straight out).
// face: faceMesh(); pulls: facePulls(). Returns a new array of [x, y, z].
// e.g. var moved = faceMoved(faceMesh("woman"), facePulls(feelingOf({}), null));
function faceMoved(face, pulls) {
  var rest = face.rest, out = rest.map(function (p) { return p.slice(); }), n;
  face.muscles.forEach(function (m) {
    var pull = pulls[m.name] || 0;                                // below 0: a muscle the trace shows pulling lets go
    if (pull === 0) { return; }
    for (n = 0; n < rest.length; n++) {
      var p = rest[n], move;
      if (m.kind === "sheet") {
        var dx = p[0] - m.bone[0], dy = p[1] - m.bone[1], d = Math.hypot(dx, dy);
        if (d < 1e-6 || d > m.reach) { continue; }
        var lx = m.skin[0] - m.bone[0], ly = m.skin[1] - m.bone[1];
        var angle = Math.acos(faceBound((dx * lx + dy * ly) / (d * m.length), -1, 1));
        if (angle > m.cone) { continue; }
        var across = Math.cos(angle / m.cone * Math.PI / 2);
        var along = d <= m.length ? Math.sin(d / m.length * Math.PI / 2) : Math.cos((d - m.length) / (m.reach - m.length) * Math.PI / 2);
        move = pull * m.most * across * along / d;
        out[n][0] -= dx * move;
        out[n][1] -= dy * move;
      } else {
        var ex = (p[0] - m.middle[0]) / m.reach[0], ey = (p[1] - m.middle[1]) / m.reach[1], e = Math.hypot(ex, ey);
        if (e >= 1) { continue; }
        if (e <= m.hole) { continue; }                              // the ring round the eye leaves the lids to their own muscle
        move = pull * m.most * Math.sin((e - m.hole) / (1 - m.hole) * Math.PI) / (e || 1);   // nothing at the hole or the rim; most between
        out[n][0] -= ex * m.across * move;
        out[n][1] -= ey * m.up * move;
      }
    }
  });
  if (pulls.oculi || pulls.zygomaticus) {                         // the cheek's apple comes forward in a smile
    var apple = 1.8 * FACE.scale * Math.max(pulls.zygomaticus || 0, pulls.oculi || 0);
    [50, 280, 101, 330, 36, 266, 205, 425, 117, 346].forEach(function (i) { out[i][2] += apple; });
  }
  if (pulls.jaw < 0.01) {                                         // a shut mouth: the lips meet (the faces averaged leave them a little apart)
    for (var q = 0; q < FACE_LIPS.upperInner.length; q++) {
      var up = out[FACE_LIPS.upperInner[q]], down = out[FACE_LIPS.lowerInner[q]];
      var meet = [(up[0] + down[0]) / 2, (up[1] + down[1]) / 2, (up[2] + down[2]) / 2];
      out[FACE_LIPS.upperInner[q]] = meet.slice();
      out[FACE_LIPS.lowerInner[q]] = meet.slice();
    }
  }
  if (pulls.jaw > 0) {                                            // the jaw turns open about its hinge, by the ears
    var hinge = [rest[234][1] - 4, rest[234][2] - 6], top = rest[13][1], bottom = rest[14][1] + 2;
    var c = Math.cos(pulls.jaw), s = Math.sin(pulls.jaw);
    for (n = 0; n < rest.length; n++) {
      var w = clamp((out[n][1] - top) / (bottom - top));
      w *= clamp(1.3 - Math.abs(out[n][0]) / Math.abs(rest[234][0]));
      if (w <= 0) { continue; }
      var y = out[n][1] - hinge[0], z = out[n][2] - hinge[1];
      var y2 = y * c + z * s, z2 = -y * s + z * c;                // opening carries the chin down and back
      out[n][1] += (hinge[0] + y2 - out[n][1]) * w;
      out[n][2] += (hinge[1] + z2 - out[n][2]) * w;
    }
  }
  return out;
}

// The head turned by "yaw" radians (the nose toward +x as it grows) about the skull's upright axis: a point
// [x, y, z] of the face's frame to [x, y, z] in the head's frame, z still toward the viewer.
// e.g. var p = faceTurn([10, -280, 20], 0.5, faceMesh("woman").skull);
function faceTurn(p, yaw, skull) {
  var c = Math.cos(yaw), s = Math.sin(yaw), z = p[2] - skull.cz;
  return [p[0] * c + z * s, p[1], -p[0] * s + z * c + skull.cz];
}

// The turn the kit's view() gives (V.t: 1 full face, 0 three-quarter, -1 profile) as radians of yaw.
// e.g. faceYaw(0)  // 0.38 (22 degrees: the kit's three-quarter, measured off its drawn keys)
function faceYaw(t) { return t >= 0 ? (1 - t) * 0.38 : 0.38 + (-t) * (Math.PI / 2 - 0.38); }

// A smooth path through points (Catmull-Rom, as Bezier curves), open or closed, added to "path" (a Path2D or pen).
// e.g. faceSmooth(pen, [[0, 0], [10, 5], [20, 0]], false);
function faceSmooth(path, pts, closed, moved) {
  var n = pts.length;
  if (n < 2) { return; }
  if (!moved) { path.moveTo(pts[0][0], pts[0][1]); }
  var last = closed ? n : n - 1;
  for (var i = 0; i < last; i++) {
    var p0 = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], p1 = pts[i], p2 = pts[(i + 1) % n];
    var p3 = pts[closed ? (i + 2) % n : Math.min(n - 1, i + 2)];
    path.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
                       p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (closed) { path.closePath(); }
}

// A fixed pseudo-random number in [0, 1) for a whole number: the same each frame, so hairs and lashes hold still.
function faceRandom(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }

// A colour "#rrggbb" as [r, g, b]; and back, from numbers, as "rgb()".
function faceRGB(hex) { var v = parseInt(hex.slice(1), 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; }
function faceCSS(c, a) {
  return "rgba(" + Math.round(faceBound(c[0], 0, 255)) + "," + Math.round(faceBound(c[1], 0, 255)) + "," + Math.round(faceBound(c[2], 0, 255)) + "," + (a === undefined ? 1 : a) + ")";
}
function faceMix(a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }

// v kept between lo and hi (the kit's clamp() keeps a number between 0 and 1 only).
function faceBound(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// The colour of a line on the skin: the skin a shade darker and warmer, never black. skin: [r, g, b]; style: a row
// of FACE_STYLES (an inked face's lines a little darker); much: 0 to 1, how strong this line is. Returns a CSS colour.
// e.g. pen.strokeStyle = faceLine([244, 214, 184], FACE_STYLES.inked, 1);
function faceLine(skin, style, much) {
  return faceCSS(faceMix(skin, [105, 48, 38], (0.3 + 0.14 * style.ink) * (0.55 + 0.45 * much)));
}

function faceUnit(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }

// ---------- the head, drawn ----------

var FACE_NOW = null;          // the face being drawn: faceSkin() works it out, the face's features read it
var FACE_SHEET = null;        // a canvas the light on the skin is painted on, small, before it is laid on softly

// The skin of a head with a mesh (look.mesh): the far ear, the skull and the face, lit, and the line round them.
// It works out the face for what comes after (FACE_NOW): the muscles' pull, the turn, every point where it is drawn.
// h: personHead()'s head. Sets V.face and V.skin, as headSkull() does. Draws with pen in the head's frame.
// e.g. (personHead() calls it for a look with mesh)
function faceSkin(h) {
  var look = h.look, V = h.V, own = faceOwn(look.mesh), style = FACE_STYLES[look.meshStyle || "painted"];
  var fem = look.fem !== undefined ? look.fem : own.fem || 0, face = faceMesh(look.mesh, fem);
  var feel = feelingOf(look), yaw = faceYaw(V.t);
  var pulls = facePulls(feel, h.mouth), smiling = FACE_MESHES[look.mesh].smiling || 0;
  if (smiling) {                                                  // a face traced smiling already wears that much of a smile: the
    pulls.zygomaticus -= smiling;                                 // muscles pull only the difference, and let go (below 0) of more
    pulls.oculi -= 0.5 * smiling;
  }
  var moved = faceMoved(face, pulls);
  var at = moved.map(function (p) { return faceTurn(p, yaw, face.skull); });
  var sk = face.skull, c = Math.cos(yaw), s = Math.sin(yaw);
  var skullRX = Math.sqrt(Math.pow(sk.x * c, 2) + Math.pow(sk.z * s, 2));   // the skull's outline as it turns: still an ellipse
  var skullC = faceTurn([0, sk.cy, sk.cz], yaw, sk);
  FACE_NOW = {look: look, face: face, style: style, moved: moved, at: at, yaw: yaw, feel: feel, fem: fem,
              skull: {x: skullC[0], y: sk.cy, rx: skullRX, ry: sk.y}};
  var skin = faceRGB(SKIN);
  faceEar(h, "far");
  // the skin: the skull (an ellipse as it turns) and every triangle that faces the viewer, as one shape
  var skullPath = new Path2D();
  skullPath.ellipse(FACE_NOW.skull.x, sk.cy, skullRX, sk.y, 0, 0, 7);
  var front = face.tris.filter(function (t) {
    var a = at[t[0]], b = at[t[1]], d = at[t[2]];
    return (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]) > 0;
  });
  var facePath = new Path2D();
  front.forEach(function (t) {
    facePath.moveTo(at[t[0]][0], at[t[0]][1]);
    facePath.lineTo(at[t[1]][0], at[t[1]][1]);
    facePath.lineTo(at[t[2]][0], at[t[2]][1]);
    facePath.closePath();
  });
  var ears = Math.max(at[234][1], at[454][1]) + 2 * FACE.scale;  // the skull's skin and its hair end at the ears: below them the
  FACE_NOW.ears = ears;                                           // jaw is the outline (a wide skull there read as a man's, 2026-10-26)
  pen.save();
  pen.beginPath();
  pen.rect(-400, -700, 800, 700 + ears);
  pen.clip();
  pen.fillStyle = SKIN;
  pen.fill(skullPath);
  pen.restore();
  var line = faceLine(skin, style, 1);
  pen.save();                                                     // the skull's line, which the hair and the face then cover:
  pen.beginPath();                                                // none below the jaw's corners (it showed under the chin)
  pen.rect(-400, -700, 800, 700 + ears);
  pen.clip();
  pen.strokeStyle = line;
  pen.lineWidth = LINE * style.outline;
  pen.stroke(skullPath);
  pen.restore();
  FACE_NOW.facePath = facePath;
  FACE_NOW.knot = look.meshHair === "kit" ? null : faceHair(h);   // the hair, behind the face (or the kit's own, drawn after it)
  faceChinShadow(FACE_NOW);                                       // and the chin's shadow on the neck, under it
  pen.fillStyle = SKIN;
  pen.fill(facePath, "nonzero");
  pen.strokeStyle = SKIN;
  pen.lineWidth = 0.6;
  pen.stroke(facePath);                                           // close the hairlines between triangles
  faceLight(face, at, front, skin, style);
  // the face's line: wherever a triangle that faces the viewer meets one that does not, or the mesh's edge, but not
  // along the top of the brow, where the hair meets the skin
  var edges = {}, key;
  face.tris.forEach(function (t) {
    var a = at[t[0]], b = at[t[1]], d = at[t[2]];
    var facing = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]) > 0;
    for (var k = 0; k < 3; k++) {
      var i = t[k], j = t[(k + 1) % 3];
      key = i < j ? i + "," + j : j + "," + i;
      (edges[key] = edges[key] || []).push(facing);
    }
  });
  var rim = new Path2D(), outer = new Path2D(), hairline = {}, oval = {};
  FACE_HAIRLINE.forEach(function (n) { hairline[n] = true; });
  var loop = FACE_TOPOLOGY.oval;
  loop.forEach(function (n, i) { var m = loop[(i + 1) % loop.length]; oval[n < m ? n + "," + m : m + "," + n] = true; });
  for (key in edges) {                                            // the edges inside the face where it turns away (a far cheek, the nose)
    var f = edges[key], ij = key.split(",").map(Number);
    if (f.length === 1) { continue; }                             // the mesh's own edge is drawn below, smooth
    if (f[0] !== f[1]) {
      rim.moveTo(at[ij[0]][0], at[ij[0]][1]);
      rim.lineTo(at[ij[1]][0], at[ij[1]][1]);
    }
  }
  // the face's outer edge (the traced oval: the jaw, the chin, the cheeks), one smooth line along each run of it that
  // shows, not along the hairline (owner, 2026-10-26: "check the jaw line": edge by edge it looked broken)
  var runs = [], run = [];
  for (var r = 0; r <= loop.length; r++) {
    var a0 = loop[r % loop.length], a1 = loop[(r + 1) % loop.length], k0 = a0 < a1 ? a0 + "," + a1 : a1 + "," + a0;
    var shows = edges[k0] && edges[k0].length === 1 && edges[k0][0] && !(hairline[a0] && hairline[a1]);
    if (shows) { if (!run.length) { run.push(at[a0]); } run.push(at[a1]); }
    else if (run.length) { runs.push(run); run = []; }
  }
  if (run.length) { runs.push(run); }
  runs.forEach(function (one) { if (one.length > 1) { faceSmooth(outer, one, false); } });
  pen.save();                                                     // the face's outer edge (the jaw, the chin) at full weight,
  pen.lineCap = "round";                                          // the edges where it turns away inside it light
  pen.strokeStyle = faceLine(skin, style, 0.6);
  pen.lineWidth = LINE * style.outline * 0.5;
  pen.stroke(rim);
  pen.strokeStyle = line;
  pen.lineWidth = LINE * Math.max(0.65, style.outline);
  pen.stroke(outer);
  pen.restore();
  V.face = new Path2D(skullPath);
  V.face.addPath(facePath);
  V.skin = V.face;
  FACE_NOW.skullPath = skullPath;
}

// The light on the skin: each triangle that faces the viewer coloured by how it faces the light (a wrap of light
// round the form, warmer where it turns to shadow) and how hollow it lies, painted small on FACE_SHEET and laid
// over the skin blurred, inside the face. face, at: the mesh and its drawn points; front: the triangles facing the
// viewer; skin: the skin as [r, g, b]; style: FACE_STYLES' row.
function faceLight(face, at, front, skin, style) {
  var box = [Infinity, Infinity, -Infinity, -Infinity];
  at.forEach(function (p) { box = [Math.min(box[0], p[0]), Math.min(box[1], p[1]), Math.max(box[2], p[0]), Math.max(box[3], p[1])]; });
  var m = pen.getTransform(), unit = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));   // device pixels a head unit
  var k = Math.max(0.6, Math.min(3, unit * 0.5)), w = Math.ceil((box[2] - box[0] + 8) * k), hgt = Math.ceil((box[3] - box[1] + 8) * k);
  if (!FACE_SHEET) { FACE_SHEET = document.createElement("canvas"); }
  if (FACE_SHEET.width < w || FACE_SHEET.height < hgt) { FACE_SHEET.width = Math.max(w, FACE_SHEET.width); FACE_SHEET.height = Math.max(hgt, FACE_SHEET.height); }
  var g = FACE_SHEET.getContext("2d");
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, FACE_SHEET.width, FACE_SHEET.height);
  g.setTransform(k, 0, 0, k, -(box[0] - 4) * k, -(box[1] - 4) * k);
  var soften = FACE_NOW && FACE_NOW.fem ? 1 - 0.3 * FACE_NOW.fem : 1;   // a woman's face modelled more softly
  var light = faceUnit(FACE.light), shadow = faceMix(skin, [95, 38, 34], 0.42 * soften), lit = faceMix(skin, [255, 244, 230], 0.35);
  var order = front.slice().sort(function (a, b) {                // far triangles first: the nose covers the far cheek
    return (at[a[0]][2] + at[a[1]][2] + at[a[2]][2]) - (at[b[0]][2] + at[b[1]][2] + at[b[2]][2]);
  });
  var normals = at.map(function () { return [0, 0, 0]; });     // each point's normal: the sum of its triangles' (so the light is smooth)
  face.tris.forEach(function (t) {
    var a = at[t[0]], b = at[t[1]], d = at[t[2]];
    var u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
    var n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    for (var k2 = 0; k2 < 3; k2++) { normals[t[k2]][0] += n[0]; normals[t[k2]][1] += n[1]; normals[t[k2]][2] += n[2]; }
  });
  normals = normals.map(function (n) { var u = faceUnit(n); return u[2] < 0 ? [-u[0], -u[1], -u[2]] : u; });
  order.forEach(function (t) {
    var a = at[t[0]], b = at[t[1]], d = at[t[2]];
    var lambert = 0;
    t.forEach(function (i) { lambert += (normals[i][0] * light[0] + normals[i][1] * light[1] + normals[i][2] * light[2]) / 3; });
    var wrap = clamp((lambert + 0.35) / 1.35);                    // light wraps a little round the form
    var hollow = (face.hollow[t[0]] + face.hollow[t[1]] + face.hollow[t[2]]) / 3;
    var tone = faceMix(shadow, skin, Math.pow(wrap, 0.9));
    tone = faceMix(tone, lit, Math.pow(clamp((wrap - 0.72) / 0.28), 2));
    var warm = 4 * wrap * (1 - wrap);                             // where the light turns, the skin glows warm
    tone = [tone[0] + 14 * warm, tone[1] + 2 * warm, tone[2] - 6 * warm];
    tone = faceMix(tone, [70, 30, 28], 0.2 * hollow);
    g.fillStyle = faceCSS(tone);
    g.strokeStyle = g.fillStyle;
    g.lineWidth = 1.2 / k;
    g.beginPath();
    g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(d[0], d[1]); g.closePath();
    g.fill();
    g.stroke();
  });
  pen.save();
  var clipTo = new Path2D();
  front.forEach(function (t) {
    clipTo.moveTo(at[t[0]][0], at[t[0]][1]); clipTo.lineTo(at[t[1]][0], at[t[1]][1]); clipTo.lineTo(at[t[2]][0], at[t[2]][1]); clipTo.closePath();
  });
  pen.clip(clipTo, "nonzero");
  pen.globalAlpha *= style.shade;
  pen.filter = "blur(" + (style.soft * unit).toFixed(2) + "px)";
  pen.drawImage(FACE_SHEET, 0, 0, w, hgt, box[0] - 4, box[1] - 4, w / k, hgt / k);
  pen.filter = "none";
  pen.restore();
}

// An ear: "near" (the one toward the viewer as the head turns) or "far". It stands at the side of the head, its
// front by the face's edge at the cheekbone, from the brow's height to the base of the nose, flaring out a little.
// h: personHead()'s head. Reads FACE_NOW. Draws with pen; the near ear returns where its lobe is ([x, y]).
function faceEar(h, which) {
  var F = FACE_NOW, face = F.face, yaw = F.yaw, rest = F.moved;
  var side = which === "near" ? (yaw >= 0 ? -1 : 1) : (yaw >= 0 ? 1 : -1);   // -1 her right (the picture's left)
  var root = rest[side < 0 ? 234 : 454], top = rest[side < 0 ? 70 : 300][1] - 2 * FACE.scale, bottom = rest[2][1] + 2 * FACE.scale;
  var tall = bottom - top, flare = 0.42;
  function place(u, v) {                                          // u back from the ear's front, v down from its top
    var p = [root[0] + side * u * tall * Math.sin(flare) * 0.6, top + v * tall, root[2] - 4 * FACE.scale - u * tall * Math.cos(flare) * 0.8];
    return faceTurn(p, yaw, face.skull);
  }
  var facing = side * Math.sin(yaw) * -1 + 0.35;                  // how far it faces the viewer
  if (which === "far" && facing < -0.6) { return null; }
  var outline = [[0.06, 0.12], [0.18, 0.02], [0.38, -0.01], [0.55, 0.06], [0.62, 0.24], [0.6, 0.45], [0.5, 0.62],
                 [0.38, 0.78], [0.3, 0.95], [0.18, 1.0], [0.08, 0.93], [0.04, 0.8], [0.03, 0.62], [0.0, 0.4]].map(function (q) { return place(q[0], q[1]); });
  var skin = faceRGB(SKIN), style = F.style;
  pen.save();
  var ear = new Path2D();
  faceSmooth(ear, outline, true);
  pen.fillStyle = faceCSS(faceMix(skin, [225, 120, 110], 0.12));
  pen.fill(ear);
  pen.save();
  pen.clip(ear);
  var mid = place(0.25, 0.48), inner = place(0.18, 0.5);
  var bowl = pen.createRadialGradient(inner[0], inner[1], 0, inner[0], inner[1], tall * 0.3);
  bowl.addColorStop(0, faceCSS(faceMix(skin, [110, 40, 35], 0.45)));
  bowl.addColorStop(1, faceCSS(faceMix(skin, [110, 40, 35], 0), 0));
  pen.fillStyle = bowl;
  pen.fill(ear);
  pen.strokeStyle = faceLine(skin, style, 0.8);                   // the rim's fold and the ridge inside it
  pen.lineWidth = LINE * 0.45;
  pen.lineCap = "round";
  pen.beginPath();
  faceSmooth(pen, [place(0.12, 0.16), place(0.34, 0.1), place(0.5, 0.2), place(0.52, 0.42), place(0.42, 0.62), place(0.3, 0.76)], false);
  pen.stroke();
  pen.beginPath();
  faceSmooth(pen, [place(0.42, 0.24), place(0.4, 0.42), place(0.3, 0.6), place(0.2, 0.66)], false);
  pen.stroke();
  pen.restore();
  pen.strokeStyle = faceLine(skin, style, 1);
  pen.lineWidth = LINE * Math.max(0.35, style.outline * 0.8);
  pen.stroke(ear);
  pen.restore();
  var lobe = place(0.17, 0.97);
  return [lobe[0], lobe[1]];
}
