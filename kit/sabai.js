// sabai.js - a sabai woven with figures that walk, for films made with
// oldcartoon.js: the shoulder cloth of the sash film (sash.html), as a piece
// of the kit. Load it after the kit and the creatures its rows use:
//
//     <script src="oldcartoon.js"></script>
//     <script src="naga.js"></script>
//     <script src="dragon.js"></script>
//     <script src="beasts.js"></script>
//     <script src="khom.js"></script>
//     <script src="sabai.js"></script>
//
// and in a scene, draw the back of the cloth, then the person wearing it:
// the kit paints the band after the body and the head and before the arms,
// so the near arm hangs over its lower end:
//
//     var where = sabaiOf(t, 720, 1010, look);     // where the cloth lies on this person, this frame
//     sabai(t, where, {from: 3}, "back");          // the end that hangs behind her shoulder, down her back
//     person(720, 1010, sabaiWorn(look, t, where, {from: 3}));   // the woven band across the chest, under the arm; its rows flow from second 3
//
// The cloth is twelve rows of woven tiles, each tile one picture of the kit
// drawn by the kit's own painter at the size of a woven figure (a house, a
// lotus, a fish, a lantern, a tung, the temple, a yak, a naga, a dragon, the
// sun, a cloud, a blossom), and in every row the people and animals that live
// among those things, each a six-frame walk cycle, so that on the cloth they
// walk. The rows flow along the cloth, each the other way from its neighbour,
// and the figures face the way their row flows. The cloth lies on the person
// the way the kit's own sabai lies on a woman, and covers it: two cubic curves
// from the waist on the near side, where the end is tucked in, across the
// chest, up over the top of the far shoulder beside the neck, and from that
// fold down the back behind the body, read from the joints the kit gives back
// for that person in that frame: so it follows a figure who breathes, bends
// or walks. It gathers narrower as it goes over the shoulder. The whole cloth
// is drawn before the person and the part up to the fold again over them, so
// the tail hangs behind the shoulder and only a little of it shows beyond the
// body's edge, as the models wear it.
//
// The names a cloth (the third argument of sabai()) may have; it warns about any other:
//   wide    how wide the cloth is across, in the kit's units (72, as wide as the sabai the kit draws)
//   rows    its rows, top to bottom: a list of lists of painters, as SABAI_ROWS below (the default).
//           A painter takes the sheet to draw on and "u", where in its walk cycle it is, 0 to 1;
//           a painter that takes no "u" stands still
//   tiles   the rows already made into tiles by sabaiTile() (made from "rows" once, and kept, if not given)
//   cloth   the colour of the cloth under the weave ("#8a2a3a")
//   flow    how fast the rows flow along the cloth, in units a second (2.5); 0 for a still cloth
//   from    the second the rows begin to flow and the figures to walk (0): before it the cloth is still
//   row     which row the camera of sabaiCamera() opens on (4)
var SABAI_KEYS = {wide: true, rows: true, tiles: true, cloth: true, flow: true, from: true, row: true};

var SABAI_TILE = 384;                   // a tile's side: large enough for a camera that shows one row close up
var SABAI_FRAMES = 6;                   // moments of a walk in one tile's cycle

// Run a painter that draws with the kit's "pen" on another sheet, at second "at".
function paintWith(brush, action, at) {
  var keep = pen, was = clock;
  pen = brush;
  clock = at || 0;
  action();
  pen = keep;
  clock = was;
}

// A tile from a painter: the picture is drawn once on a scratch sheet and
// measured, then drawn again to fit the tile, at each moment of its cycle.
function sabaiTile(painter) {
  var scratch = document.createElement("canvas");
  scratch.width = 800;
  scratch.height = 800;
  var probe = scratch.getContext("2d");
  probe.save();
  probe.translate(400, 520);
  paintWith(probe, function () { painter(probe, 0); });
  probe.restore();
  var data = probe.getImageData(0, 0, 800, 800).data, left = 800, top = 800, right = 0, bottom = 0;
  for (var y = 0; y < 800; y += 2) {
    for (var x = 0; x < 800; x += 2) {
      if (data[(y * 800 + x) * 4 + 3] > 40) {
        if (x < left) { left = x; } if (x > right) { right = x; } if (y < top) { top = y; } if (y > bottom) { bottom = y; }
      }
    }
  }
  var wide = Math.max(8, right - left), tall = Math.max(8, bottom - top), fit = (SABAI_TILE * 0.86) / Math.max(wide, tall);
  var frames = [], count = painter.length >= 2 ? SABAI_FRAMES : 1;   // a painter that takes "u" moves; the rest stand
  for (var n = 0; n < count; n++) {
    var sheet = document.createElement("canvas");
    sheet.width = SABAI_TILE;
    sheet.height = SABAI_TILE;
    var brush = sheet.getContext("2d");
    brush.translate(SABAI_TILE / 2 - ((left + right) / 2 - 400) * fit, SABAI_TILE / 2 - ((top + bottom) / 2 - 520) * fit);
    brush.scale(fit, fit);
    var u = n / SABAI_FRAMES;
    paintWith(brush, (function (b, moment) { return function () { painter(b, moment); }; })(brush, u), u);
    frames.push(sheet);
  }
  return frames;
}

// The twelve rows the sash film weaves, top to bottom: what Thai life is made
// of, and in every row the people and the animals that live among those things.
// The owner (2026-10-15): "remove some of the repeating sprites like the monk
// and add the temple guardian, the oxen, a baby pig, and a few of the hanging
// lanterns". So no monk (there were two), one dog fewer, two fish fewer, one
// drummer and one villager fewer, one khom loi fewer; the temple guardian (yak,
// as the statue at Wat Phra Kaeo) stands between the two naga as well as by
// the temple; the water buffalo, the kit's draught animal (it pulls the cart
// in the rain), walks among the fish and the lotus leaves; a sow walks with
// her piglet behind her among the houses (a tile is fitted to its picture,
// so a piglet alone would be drawn as large as a sow); and three khom, the
// hanging lanterns, red, blue and green, hang by the temple and among the
// lanterns. A khom is tied 400 above the tile's middle so it hangs inside it.
var SABAI_ROWS = [
  [function (b) { house(b, 0, 0, 0.7); }, function (b, u) { person(0, 0, cast("villager", {size: 1.1, step: u})); }, function (b) { house(b, 0, 0, 0.55); },
   function (b, u) { pig(60, 0, {size: 0.8, step: u}); pig(-150, 0, {size: 0.42, step: u + 0.3}); }],
  [function (b) { tree(b, 0, 0, 0.5); }, function (b, u) { person(0, 0, cast("child", {size: 1.2, step: u, smile: 1})); }, function (b) { palm(b, 0, 0, 240); }, function (b, u) { rooster(0, 0, u * 2); }, function (b) { banana(b, 0, 0); }],
  [function (b) { lotus(b, 0, 0, 1.3, "#f28fa8", 1); }, function (b, u) { person(0, 0, cast("maiden", {size: 1.1, step: u})); }, function (b) { lotus(b, 0, 0, 1.1, "#e9627f", 0.4); }, function (b) { fish(b, 0, 0, 1.6, 1, "#f0803a"); }],
  [function (b) { fish(b, 0, 0, 1.6, 1, "#f6a24a"); }, function (b, u) { person(0, 0, cast("fellow", {size: 1.1, step: u})); }, function (b, u) { buffalo(0, 0, {size: 0.55, step: u}); }, function (b) { lotusLeaf(b, 0, 10, 1.0, 0.2, "#3f8f5a"); }],
  [function (b, u) { rooster(0, 0, u * 2); }, function (b, u) { person(0, 0, cast("weaver", {size: 1.1, step: u})); }, function (b, u) { dog(0, 0, u); }, function (b, u) { person(0, 0, cast("lady", {size: 1.1, step: u})); }],
  [function () { khom(0, -400, {colour: KHOM_RED, lit: 0, sway: 0}); }, function (b, u) { person(0, 0, cast("celestial", {size: 1.1, step: u})); }, function () { khom(0, -400, {colour: KHOM_BLUE, lit: 0, sway: 0}); }, function () { lantern(0, -30, 64); }],
  [function (b) { tung(b, 0, 0, 0); }, function (b, u) { person(0, 0, cast("child", {size: 1.2, step: u})); }, function (b) { blossom(b, 0, -20, 26, "#f4c542"); }, function (b, u) { person(0, 0, cast("dancer", {size: 1.1, step: u, handA: [60, -120], handB: [-50, -100]})); }],
  [function (b) { temple(b, 0, 0); }, function (b) { yak(b, 0, 0, 1); }, function () { khom(0, -400, {colour: KHOM_GREEN, lit: 0, sway: 0}); }, function (b, u) { person(0, 0, cast("drummer", {size: 1.1, step: u})); }],
  [function (b, u) { naga(0, -60, {size: 0.5, heads: 3}); }, function (b) { yak(b, 0, 0, -1); }, function (b, u) { naga(0, -60, {size: 0.5, heads: 5, body: "#d9a441", crest: "#3a2418"}); }, function (b, u) { person(0, 0, cast("maiden", {size: 1.1, step: u})); }],
  [function (b, u) { dragon(80, -40, {size: 0.3}); }, function (b, u) { person(0, 0, cast("scientist", {size: 1.1, step: u})); }, function (b, u) { dragon(80, -40, {size: 0.3, body: "#8fb7a6", spots: "#2f5a4a"}); }, function (b, u) { person(0, 0, cast("lady", {size: 1.1, floor: true})); }],
  [function (b, u) { sun(0, 0, u); }, function (b) { scrollCloud(b, 0, 0, 0.9, "#f6f1e6", "#7a2f25"); }, function (b, u) { person(0, 0, cast("dancer", {size: 1.1, step: u, handA: [70, -130]})); }],
  [function (b) { blossom(b, 0, 0, 30, "#ee7f9c"); }, function (b, u) { person(0, 0, cast("child", {size: 1.2, floor: true})); }, function (b) { blossom(b, 0, 0, 26, "#7f9fd8"); }, function (b, u) { dog(0, 0, u); }]
];

var SABAI_SCRATCH = null;               // a sheet the person is drawn on to ask where their joints are
var SABAI_SLEEVE = {};                  // how far the sleeve's outer line is from the far elbow, for each build of figure, read once
var SABAI_ARMS = ["handA", "handB", "reachA", "reachB", "wai", "grip", "parasol", "holding", "wristA", "wristB"];   // what moves the arms: the cloth is read with them hanging
var SABAI_FLEETING = ["step", "late", "spring", "at", "glance", "blink", "mouth", "smile", "feel", "wonder", "fear", "anger", "sad",
                      "sing", "sway", "up", "tilt", "turn", "stride", "eyes", "lips", "id"];   // what changes from frame to frame and not the sleeve's line

// The look with the arms hanging, under an id of its own, so that the cloth
// does not move when the arms do (a wai, a wave), and the drawing that is
// measured keeps its own swing apart from the person's.
function sabaiHanging(look, id) {
  var still = Object.assign({}, look, {id: id});
  SABAI_ARMS.forEach(function (name) { delete still[name]; });
  return still;
}

// Where the cloth lies on a person drawn at (x, y) with "look", at second t.
// The owner (2026-10-15), building it up a step at a time: a rectangle from
// the neck off the shoulder down to the waist on the opposite side; its upper
// corner where the neck meets the shirt, then moved down and to the side so
// it starts beside the neck, not at its middle; the top end rounded, curving
// down over the shoulder; the two long sides bent so it looks like it wraps
// her body; cut off just past the vertical line of her shirt on the far side;
// then the whole of it up and to the right a little, and the long sides bent
// to the right, the way she faces. So: one band, 72 wide, at 45 degrees, from
// beside the base of the neck on the near side (her left, in the kit's
// three-quarter view) down across the chest, its middle line bowed a little
// the way she faces, worn under the far arm (sabaiWorn), its lower end cut
// on a slant under that arm: the middle line is laid to a vertical line 4
// outside the shirt's own line on that side (the sleeve's outer edge at the
// elbow's height, read off the drawing of the person on the scratch sheet),
// the band begins 59 along from where it would meet that line, so that its
// upper corner lies 12 inside the line, under the arm, and its lower corner
// is 10 further to the left (and down) along the lower edge (owner: "the
// long left and right side both need to be shorter", "make sure the top two
// corners stay pinned where they are": the curve is the same, only cut
// shorter; then "just move the bottom most corner over to the left about 10
// px"). It is tucked into the skirt at the waist: nothing of it is drawn
// below the waist's line (owner: "cut it off near where the shirt tucks into
// the skirt"). The wearer has sabai: false, so the kit draws no band of its
// own on the other diagonal.
// The back of the cloth (owner, with a photograph of a woman in a red
// sabai, its end hanging in folds behind her arm to the ground with a
// fringe): "add a line from the right most corner down to just past the
// hand that gently undulates down past the waist and hand and a curved line
// to the left and fill with the red sash color and shade it but leave it
// unmarked. Add tassels to the end of the sash." So from the top end's
// corner at the shoulder an outer edge waves gently down the far side of
// the body, leaning out a little, to a hem just past the hand; the hem
// curves to the left, bowing down, to an inner edge behind the body; it is
// drawn before the person, so only what lies past the body's and the arm's
// edge is seen. The hem is read from the hip, not the hand, so a hand
// raised to wave does not lift it.
// Gives back {at(u), angle(u), uAt(along), length, start, fold, top,
// squeeze(along), middle, tilt, startCap, endCap, tuck, tail}: a point and a
// heading at u of the way along; the u of a distance along; the length; how
// far along the band begins; how far along the fold is and how far the part
// drawn over the person ends (both the whole length while there is no
// fold); how much narrower the cloth is at a distance along (1: it does not
// gather); the part across the chest that a camera holds (0.4 of the way);
// how each end is cut (see sabai()); the height of the waist's line, below
// which the cloth is tucked away; and the back of the cloth, {outer, hem,
// inner}: the outer edge's points from the shoulder down, the hem's from
// the outer edge's foot to the inner edge, and the inner edge's top.
function sabaiOf(t, x, y, look) {
  if (!SABAI_SCRATCH) {
    SABAI_SCRATCH = document.createElement("canvas");
    SABAI_SCRATCH.width = WIDE;
    SABAI_SCRATCH.height = 1080;
  }
  var scratchPen = SABAI_SCRATCH.getContext("2d"), joints;
  var hanging = sabaiHanging(look, (look.id || "someone") + "/sabai");
  paintWith(scratchPen, function () { scratchPen.clearRect(0, 0, WIDE, 1080); joints = person(x, y, hanging); }, t);
  var face = look.face || 1, shoulder = joints.shoulderA, elbow = joints.elbowB, hip = joints.hip, n;
  var half = 36, bow = 20;                            // half the band's width; how far its middle line bows the way she faces
  var slope = -Math.PI / 4;                           // the band's heading up the chest: 45 degrees
  var dx = Math.cos(slope) * face, dy = Math.sin(slope);                     // along the band, upward
  var nx = -Math.sin(slope) * face, ny = Math.cos(slope);                    // across the band, to its lower side
  var neck = [shoulder[0] - 22 * face, shoulder[1] - 38];                    // beside the base of the neck, the near side, a little up and forward of it
  var top = [neck[0] + nx * half, neck[1] + ny * half];                      // the middle of the band's upper end: its upper corner is beside the neck
  // The shirt's line on the far side, at the far elbow's height, where the
  // sleeve hangs beside the body: from outside inward, the first pixel of the
  // person. It is read once for each build of figure, standing still at
  // second 0 with the arms hanging, as a distance from the elbow, and from
  // then on the cut follows the elbow joint: read afresh every frame, in
  // whole pixels, it jumped a pixel at a time, and the opening's camera, a
  // row of the cloth 90 times as large, threw the woven figures 50 pixels in
  // a frame (owner: "why is it so choppy to start? It should be smooth").
  // The middle line is laid to the vertical line 4 outside it.
  // The figure measured is the look itself with the arms hanging and what
  // changes from frame to frame left out, standing at a fixed place, so the
  // measure is the same whichever frame asks first, and a still agrees with
  // the film; that look is also the key it is kept under.
  var steady = sabaiHanging(look, "sabai/measure");
  SABAI_FLEETING.forEach(function (name) { delete steady[name]; });
  var build = JSON.stringify(steady);
  steady.id = "sabai/measure";
  if (SABAI_SLEEVE[build] === undefined) {
    if (Object.keys(SABAI_SLEEVE).length > 200) { SABAI_SLEEVE = {}; }   // a scene that changes a figure's build every frame does not fill the memory
    var measured;
    paintWith(scratchPen, function () {
      scratchPen.clearRect(0, 0, WIDE, 1080);
      measured = person(400, 1000, steady);
    }, 0);
    var count = 150, left = Math.round(face > 0 ? measured.hip[0] - count + 1 : measured.hip[0]);
    var strip = scratchPen.getImageData(left, Math.round(measured.elbowB[1]), count, 1).data, edge = measured.hip[0] - 50 * face;   // no outline found: a guess
    for (n = 0; n < count; n++) {
      var px = face > 0 ? n : count - 1 - n;
      if (strip[px * 4 + 3] >= 60) { edge = left + px; break; }
    }
    SABAI_SLEEVE[build] = edge - measured.elbowB[0];
  }
  var cutX = elbow[0] + SABAI_SLEEVE[build] - 4 * face;
  var reach = Math.abs((top[0] - cutX) / (dx || 1e-6));   // how far down the band's heading that line is
  var end = [top[0] - dx * reach, top[1] - dy * reach];   // where the band's middle line would meet it: the curve's far end
  var start = (16 + half * Math.SQRT1_2) * Math.SQRT2;    // the band begins this far along from there: its upper corner (half a width up the normal) lies 12 inside the sleeve's line, under the arm
  var slant = 10 * Math.SQRT2;                            // and its lower corner is this much further along the lower edge, 10 to the left and 10 down: the end slants
  var mid = [(top[0] + end[0]) / 2 + face * bow * 2, (top[1] + end[1]) / 2];   // the curve's control: the middle bows "bow" the way she faces, so the long sides bend to her front
  var points = [], marks = [0], length = 0;
  for (n = 0; n <= 24; n++) {                        // the line as points, from the end up to the top, a quadratic curve
    var s = n / 24, v = 1 - s;
    points.push([v * v * end[0] + 2 * v * s * mid[0] + s * s * top[0], v * v * end[1] + 2 * v * s * mid[1] + s * s * top[1]]);
    if (n) { length += Math.hypot(points[n][0] - points[n - 1][0], points[n][1] - points[n - 1][1]); marks.push(length); }
  }
  function seek(along) {                             // which segment a distance along falls in, and how far through it
    along = Math.max(0, Math.min(length, along));
    var lo = 0, hi = marks.length - 1;
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (marks[m] <= along) { lo = m; } else { hi = m; } }
    return [lo, (along - marks[lo]) / (marks[hi] - marks[lo] || 1)];
  }
  function pointAt(along) {
    var w = seek(along), p = points[w[0]], q = points[w[0] + 1] || p;
    return [p[0] + (q[0] - p[0]) * w[1], p[1] + (q[1] - p[1]) * w[1]];
  }
  function headingAt(along) {                        // the heading of the segment a distance along falls in
    var i = Math.min(points.length - 2, seek(along)[0]), p = points[i], q = points[i + 1];
    return Math.atan2(q[1] - p[1], q[0] - p[0]);
  }
  function at(u) { return pointAt(u * length); }
  function angle(u) { return headingAt(u * length); }
  function uAt(along) { return Math.max(0, Math.min(1, along / length)); }
  function squeeze(along) { return 1; }
  function side(along, across) {                     // a point of an edge: "across" from the middle line, as sabaiAt() has it
    var q = pointAt(along), g = headingAt(along);
    return [q[0] - Math.sin(g) * across, q[1] + Math.cos(g) * across];
  }
  // The slanted end: a line through its two corners, the upper at "start"
  // and the lower "slant" further along; sabai() cuts the band's edges to it.
  var upper = side(start, -half), lower = side(start - slant, half);
  var vx = lower[0] - upper[0], vy = lower[1] - upper[1], vl = Math.hypot(vx, vy) || 1, g = headingAt(start - slant / 2);
  var startCap = {N: [(upper[0] + lower[0]) / 2, (upper[1] + lower[1]) / 2], c: Math.cos(g), s: Math.sin(g), kx: -vy / vl, ky: vx / vl};
  // The back of the cloth, from the top end's corner at the shoulder down.
  var corner = side(length, half), foot = hip[1] + 54, outer = [], hem = [], k;
  for (k = 0; k <= 16; k++) {                        // the outer edge: down past the waist and the hand, leaning out 32 by the foot, waving 5 either way
    var yy = corner[1] + (foot - corner[1]) * k / 16;
    outer.push([corner[0] + (32 * k / 16 + Math.sin(k / 16 * Math.PI * 2.5 + t * 0.8) * 5) * face, yy]);
  }
  var innerX = hip[0] + 24 * face, last = outer[16];
  for (k = 0; k <= 8; k++) {                         // the hem: a curve to the left, from the outer edge's foot to the inner edge, bowing down 10
    var sh = k / 8;
    hem.push([last[0] + (innerX - last[0]) * sh, foot + Math.sin(sh * Math.PI) * 10 - sh * 8]);
  }
  var tail = {outer: outer, hem: hem, inner: [innerX, corner[1] + 16]};
  return {at: at, angle: angle, uAt: uAt, length: length, start: start, fold: length, top: length, squeeze: squeeze,
          middle: pointAt(0.4 * length), tilt: headingAt(0.4 * length),
          startCap: startCap,                                                              // the slanted lower end
          endCap: {bulge: 26},                                                             // rounded, curving down over the shoulder
          tuck: joints.waist[1] + 8,                                                       // tucked into the skirt from the waist's line down
          tail: tail};                                                                     // the back of the cloth, hanging behind the shoulder
}

// The look of a person wearing the cloth: the same look with "worn", a painter
// the kit calls after the body and the head and before the arms, so the near
// arm hangs over the cloth's lower end (owner, 2026-10-15: "put it behind the
// right arm"). It draws the front of the cloth in the frame the pen has now,
// the scene's, so call it where the person is drawn, inside the camera.
function sabaiWorn(look, t, where, cloth) {
  var frame = pen.getTransform();
  return Object.assign({}, look, {worn: function () { pen.setTransform(frame); sabai(t, where, cloth, "front"); }});
}

// A point of the cloth: "along" is the distance from the hip end, "across" the
// offset from the middle line; gives [x, y, heading].
function sabaiAt(where, along, across) {
  var u = where.uAt(along), p = where.at(u), ang = where.angle(u);
  across *= where.squeeze(along);                      // narrower where the cloth gathers over the shoulder
  return [p[0] - Math.sin(ang) * across, p[1] + Math.cos(ang) * across, ang];
}

// A point of the cloth as sabaiAt() gives it, also beyond either end of the
// middle line: there the line runs on straight along the end's heading, so a
// row of figures goes on into a slanted cut or a rounded end, which clip it.
function sabaiOn(where, along, across) {
  var end = Math.max(0, Math.min(where.length, along)), q = sabaiAt(where, end, across), past = along - end;
  return [q[0] + Math.cos(q[2]) * past, q[1] + Math.sin(q[2]) * past, q[2]];
}

function sabaiEdge(where, across, from, to, joined) {   // one edge of the cloth, or of a row, from one end to the other
  for (var n = 0; n <= 24; n++) {                         // "joined": continue the path that is open, instead of starting one
    var q = sabaiAt(where, mix(from, to, n / 24), across);
    if (n || joined) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); }
  }
}

function sabaiBand(where, inner, outer, from, to) {  // the shape between two offsets, from one distance along to another: one closed path
  pen.beginPath();
  sabaiEdge(where, inner, from, to, false);
  sabaiEdge(where, outer, to, from, true);
  pen.closePath();
}

function sabaiTiles(cloth) {                         // the cloth's tiles, made once from its rows
  if (!cloth.tiles) { cloth.tiles = (cloth.rows || SABAI_ROWS).map(function (row) { return row.map(sabaiTile); }); }
  return cloth.tiles;
}

// The woven cloth at "where" (from sabaiOf), at second t, drawn as bands. Each
// end of a band is cut one of three ways: square (nothing), on a line
// ({N, c, s, kx, ky}: the line through N with the normal (kx, ky), met by a
// band heading (c, s): a fold's crease, or a cut parallel to the shirt), or
// rounded ({bulge}: the end bows out that far along the band's heading, as
// cloth does lying over a shoulder). While the cloth has no fold (where.fold
// is its whole length) it is one band, cut as where.startCap and where.endCap
// say. With a fold it is three: the chest, up to the fold at the neck; the
// shoulder, from the fold to where the shoulder ends; and the tail, behind
// the arm; the chest and shoulder bands meet on one crease line at the fold,
// as a folded ribbon does. "part" is which of it to draw: "front", all but
// the tail, over the person; "back" (or nothing), all of it, before the
// person, so the tail hangs behind the arm.
function sabai(t, where, cloth, part) {
  cloth = cloth || {};
  checkNames("The sabai's name", cloth, SABAI_KEYS);
  var wide = cloth.wide || 72, half = wide / 2, tiles = sabaiTiles(cloth), rows = tiles.length;
  var flow = cloth.flow === undefined ? 2.5 : cloth.flow, dancing = Math.max(0, t - (cloth.from || 0));
  var rowTall = (wide - 6) / rows, size = rowTall * 0.92, step = size * 1.15;
  var fold = where.fold, hasFold = fold < where.length - 1;
  function corner(cap, across, sq) {                 // where a band's edge at an offset "across" meets the cap's line
    var ex = cap.N[0] - cap.s * across * sq, ey = cap.N[1] + cap.c * across * sq;   // the edge's point level with N
    var denom = cap.c * cap.kx + cap.s * cap.ky, u = Math.abs(denom) < 1e-6 ? 0 : -((ex - cap.N[0]) * cap.kx + (ey - cap.N[1]) * cap.ky) / denom;
    return [ex + cap.c * u, ey + cap.s * u];
  }
  function bow(cap, along, inner, outer, backward) { // the points of a rounded end between two offsets, as a list
    var pi = sabaiAt(where, along, inner), po = sabaiAt(where, along, outer), ang = where.angle(where.uAt(along));
    var q0 = sabaiAt(where, along, -half), q1 = sabaiAt(where, along, half), sq = where.squeeze(along);
    var cx = (q0[0] + q1[0]) / 2 + Math.cos(ang) * cap.bulge * sq, cy = (q0[1] + q1[1]) / 2 + Math.sin(ang) * cap.bulge * sq;   // the curve's control, ahead of the end
    var s0 = (inner + half) / wide, s1 = (outer + half) / wide, list = [];
    for (var k = 0; k <= 6; k++) {
      var s = s0 + (s1 - s0) * k / 6, v = 1 - s;
      list.push([v * v * q0[0] + 2 * v * s * cx + s * s * q1[0], v * v * q0[1] + 2 * v * s * cy + s * s * q1[1]]);
    }
    return backward ? list.reverse() : list;
  }
  function shape(inner, outer, from, to, endCap, startCap) {   // the shape between two offsets, with its ends cut as the caps say
    var sq0 = where.squeeze(from), sq1 = where.squeeze(to), p, list;
    pen.beginPath();
    if (startCap && startCap.N) { p = corner(startCap, inner, sq0); pen.moveTo(p[0], p[1]); sabaiEdge(where, inner, from, to, true); }
    else { sabaiEdge(where, inner, from, to, false); }
    if (endCap && endCap.N) { p = corner(endCap, inner, sq1); pen.lineTo(p[0], p[1]); p = corner(endCap, outer, sq1); pen.lineTo(p[0], p[1]); }
    else if (endCap && endCap.bulge) { list = bow(endCap, to, inner, outer, false); list.forEach(function (q) { pen.lineTo(q[0], q[1]); }); }
    sabaiEdge(where, outer, to, from, true);
    if (startCap && startCap.N) { p = corner(startCap, outer, sq0); pen.lineTo(p[0], p[1]); }
    else if (startCap && startCap.bulge) { list = bow(startCap, from, inner, outer, true); list.forEach(function (q) { pen.lineTo(q[0], q[1]); }); }
    pen.closePath();
  }
  function band(from, to, endCap, startCap) {        // one band of the cloth, from one distance along to another
    var p, list;
    pen.save();
    shape(-half, half, from, to, endCap, startCap);
    pen.fillStyle = cloth.cloth || "#8a2a3a";        // the cloth
    pen.fill();
    pen.clip();
    for (var row = 0; row < rows; row++) {
      var across = -half + 3 + (row + 0.5) * rowTall;
      shape(across - rowTall / 2, across + rowTall / 2, from, to, endCap, startCap);
      pen.fillStyle = row % 2 ? "rgba(255, 240, 200, 0.10)" : "rgba(40, 10, 20, 0.12)";   // the weave's alternate bands
      pen.fill();
      var toward = row % 2 ? 1 : -1;                 // which way this row flows: each the other way from its neighbour
      var slide = toward * flow * dancing, cycles = tiles[row];
      // The figures walk along the part of the cloth that is drawn, from the
      // cut end to the rounded top: one that walks off one end comes on at
      // the other, with no gap in the row (owner: "the sprites should walk
      // to the end of the row and wrap to the other side"; they had walked
      // the whole middle line, of which the first 59 is cut away, and were
      // gone a while before they came back).
      // The row holds a whole number of its patterns (its tiles in turn),
      // evenly spaced, so at the wrap the pattern goes on unbroken and no
      // figure is laid on another (the loop had placed one or two past a
      // round, on top of the first: two temples, two fish, two lanterns).
      // The row runs on to both ends of the cloth (owner, 2026-10-16: "they
      // don't go all the way to the end of the sash ... go all the way to the
      // end of the sash on either side"): the slanted cut reaches further back
      // on the lower rows than the ring begins, and the rounded end bows past
      // the middle line's end. So the pattern is drawn once more a round before
      // and a round after itself, past the ends along the end's heading, and
      // the band's cut and rounded end clip it. A figure inside the ends is
      // where it was.
      var lo = where.start || 0, round = where.length - lo + step, reach = half + step;
      var count = cycles.length * Math.max(1, Math.round(round / (step * cycles.length))), gap = round / count;
      for (var k = 0; k < count; k++) {
        var first = lo + ((k * gap + slide) % round + round) % round - gap / 2;
        var bob = dancing ? hop(t, row * 0.1 + k * 0.05) * size * 0.16 : 0;
        var rock = dancing ? Math.sin(t * 2 * Math.PI / BEAT / 2 + row + k) * 0.14 : 0;
        var cycle = cycles[((k % cycles.length) + cycles.length) % cycles.length];
        var frame = dancing ? (((Math.floor(t * 7.5) + k * 2) % cycle.length) + cycle.length) % cycle.length : 0;   // six frames in 0.8 s: a walking pace (k may be negative)
        for (var copy = -1; copy <= 1; copy++) {
          var along = first + copy * round;
          if (along < from - reach || along > to + reach) { continue; }   // a figure that is not on this band
          var q = sabaiOn(where, along, across - bob);
          pen.save();
          pen.translate(q[0], q[1]);
          pen.rotate(q[2] + rock);
          var gathered = where.squeeze(Math.max(0, Math.min(where.length, along)));
          pen.scale(toward * gathered, gathered);    // the figures face the way the row flows, and are smaller where the cloth gathers
          pen.drawImage(cycle[frame], -size / 2, -size / 2, size, size);
          pen.restore();
        }
      }
    }
    pen.restore();
    pen.strokeStyle = STYLE.gold;                    // the gold hems: the two long edges, and a rounded end
    pen.lineWidth = 3;
    pen.lineJoin = "bevel";
    pen.lineCap = "butt";
    [-half + 1.5, half - 1.5].forEach(function (edge) {
      pen.beginPath();
      if (startCap && startCap.N) { p = corner(startCap, edge, where.squeeze(from)); pen.moveTo(p[0], p[1]); }
      sabaiEdge(where, edge, from, to, !!(startCap && startCap.N));
      if (endCap && endCap.N) { p = corner(endCap, edge, where.squeeze(to)); pen.lineTo(p[0], p[1]); }
      pen.stroke();
    });
    if (endCap && endCap.bulge) {
      list = bow(endCap, to, -half + 1.5, half - 1.5, false);
      pen.beginPath();
      list.forEach(function (q, i) { if (i) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); } });
      pen.stroke();
    }
  }
  function back() {                                  // the back of the cloth: the end hanging behind the shoulder and down past the hip, plain, in shadow, with a fringe
    var T = where.tail, n, p, lean;
    if (!T) { return; }
    pen.save();
    pen.beginPath();
    pen.moveTo(T.inner[0], T.inner[1]);
    T.outer.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    T.hem.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    pen.closePath();
    pen.fillStyle = cloth.cloth || "#8a2a3a";        // the cloth, unmarked
    pen.fill();
    pen.clip();
    var shade = pen.createLinearGradient(T.inner[0], 0, T.outer[8][0], 0);   // darker toward the body, as the back of a cloth is
    shade.addColorStop(0, "rgba(20, 0, 10, 0.38)");
    shade.addColorStop(1, "rgba(20, 0, 10, 0.08)");
    pen.fillStyle = shade;
    pen.fill();
    pen.strokeStyle = "rgba(20, 0, 10, 0.16)";       // three soft folds down the hanging cloth
    pen.lineWidth = 7;
    for (n = 1; n <= 3; n++) {
      pen.beginPath();
      T.outer.forEach(function (q, i) {
        var x = q[0] + (T.inner[0] - q[0]) * (n / 4) + Math.sin(i / 4 + n) * 2;
        if (i) { pen.lineTo(x, q[1]); } else { pen.moveTo(x, q[1]); }
      });
      pen.stroke();
    }
    pen.restore();
    pen.strokeStyle = STYLE.gold;                    // the gold hem down the outer edge and along the foot
    pen.lineWidth = 3;
    pen.lineCap = "butt";
    pen.beginPath();
    T.outer.forEach(function (q, i) { if (i) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); } });
    T.hem.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    pen.stroke();
    pen.lineWidth = 2;                               // the tassels: a fringe hanging from the hem, fanning out a little
    lean = T.outer[0][0] < T.inner[0] ? -1 : 1;
    for (n = 0; n < T.hem.length; n++) {
      p = T.hem[n];
      pen.beginPath();
      pen.moveTo(p[0], p[1]);
      pen.lineTo(p[0] + (4 - n) * 0.7 * lean, p[1] + 16 - Math.abs(4 - n) * 1.2);
      pen.stroke();
    }
  }
  if (!hasFold) {                                    // one band and the back of the cloth, no fold
    if (part !== "front") { back(); }                // "back", or all of it: the end behind her, before the person
    if (part === "back") { return; }
    pen.save();
    if (where.tuck !== undefined) {                  // tucked into the skirt: nothing below the waist's line
      pen.beginPath();
      pen.rect(-1e5, -1e5, 2e5, 1e5 + where.tuck);
      pen.clip();
    }
    band(where.start || 0, where.length, where.endCap, where.startCap);
    pen.restore();
    return;
  }
  // The crease at the fold: through the fold point, square to the difference
  // of the headings in and out (a fold reflects the heading across the crease),
  // each taken over a run of 24.
  var N = where.at(where.uAt(fold));
  var before = where.at(where.uAt(fold - 24)), after = where.at(where.uAt(fold + 24));
  var l1 = Math.hypot(N[0] - before[0], N[1] - before[1]) || 1, l2 = Math.hypot(after[0] - N[0], after[1] - N[1]) || 1;
  var c1 = (N[0] - before[0]) / l1, s1 = (N[1] - before[1]) / l1, c2 = (after[0] - N[0]) / l2, s2 = (after[1] - N[1]) / l2;
  var kx = c2 - c1, ky = s2 - s1, kl = Math.hypot(kx, ky) || 1;
  var crease1 = {N: N, c: c1, s: s1, kx: kx / kl, ky: ky / kl}, crease2 = {N: N, c: c2, s: s2, kx: kx / kl, ky: ky / kl};
  band(0, fold - 1, crease1, where.startCap);
  band(fold + 1, where.top, null, crease2);
  if (part !== "front") { band(where.top, where.length, where.endCap, null); }
}

// The camera of the sash film's opening: it holds one row of the cloth (cloth.row)
// close up, the part across the chest, and between seconds "start" and "end"
// makes one steady pull-back, with no pause, from the row to the whole cloth to
// the person to the whole stage, turning upright as it goes. Call it inside
// pen.save() ... pen.restore(), before the scene is drawn.
function sabaiCamera(t, where, cloth, start, end) {
  cloth = cloth || {};
  var wide = cloth.wide || 72, rows = (cloth.tiles || cloth.rows || SABAI_ROWS).length, row = cloth.row === undefined ? 4 : cloth.row;
  var rowTall = (wide - 6) / rows;
  var rowZoom = (1080 * 0.46) / rowTall;
  var u = between(t, start, end);
  var zoom = Math.exp(mix(Math.log(rowZoom), 0, u));   // the same share of the way out every second: steady to the eye
  var turn = mix(-where.tilt, 0, u);
  var rowAcross = -wide / 2 + 3 + (row + 0.5) * rowTall;
  var point = sabaiAt(where, where.top * 0.4, mix(rowAcross, 0, Math.min(1, u * 3)));   // from the row to the cloth's middle line, on the chest (0.4 of the way to the shoulder, where "tilt" is read)
  var slow = u * u * u;                          // the cloth stays in the middle until the view is wide
  var cx = mix(point[0], WIDE / 2, slow), cy = mix(point[1], 540, slow);
  pen.translate(WIDE / 2, 540);
  pen.rotate(turn);
  pen.scale(zoom, zoom);
  pen.translate(-cx, -cy);
}
