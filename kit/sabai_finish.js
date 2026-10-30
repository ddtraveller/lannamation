// sabai_finish.js - the woven sabai of sabai.js finished: its figures woven in thread, light and folds over it, woven
// borders, a decorated end with a knotted fringe, the end moving in the breeze, and broad bands of pattern from far.
// Load it after sabai.js and weaving.js (it weaves with WEAVE_DYES and teenJok). A cloth whose names have finish: true
// is drawn so; every other cloth is drawn by sabai.js as before, and a page without this file draws as before.
//
// The owner (2026-10-30), of the hero film's first scene: "Give me some ideas for making the cloth look better?", then
// "Write down 4-7 as next steps after 1-3 and then begin on 1-3"; of the first look: "There looks like a lighter shade
// box around the sabai ... make the color scheme a bit different so the woven icons stand out against the sash a little
// better"; then (2026-10-31) "yes to the kit". Notes: docs/kit/things.md, "The sabai finished".
//
// e.g. var CLOTH = {rows: SABAI_ROWS, finish: true, cloth: SABAI_FINISH_GROUND};
//      sabai(t, where, CLOTH, "back"); person(x, y, sabaiWorn(look, t, where, CLOTH));

SABAI_KEYS.finish = true;

// The ground the threads were chosen against: a deep red, near black, so that the woven figures stand out.
var SABAI_FINISH_GROUND = "#46101c";
// The threads the figures are woven in: gold, yellow, cream, white, a light green, pink, sky blue, orange, silver, and
// one dark (indigo) for what is dark. The reds that sank into a red ground are left out.
var SABAI_FINISH_THREADS = ["#e0b84a", "#f2d04a", "#efe2c4", "#fbf6ea", "#7ab65a", "#ee8aac", "#6e9ad8", "#e8873a", "#cfd3d8", "#2c3a78"];

var SABAI_FINISH_KIT = {tiles: sabaiTiles, sabai: sabai, edge: sabaiEdge};

// (1) Woven figures. Each frame of a tile (sabaiTile: a figure painted once) is laid again as a weave: its picture read
// on a grid of floats SF_PICKS high and SF_FLOATS across (a float wider than it is tall, as supplementary weft lies),
// each float the thread nearest the colour under it, where the picture covers enough of it; each a little rounded, lit
// along its top and shaded along its foot, the cloth showing between them as the warp does.
var SF_PICKS = 72, SF_FLOATS = 48;
var SF_THREADS = SABAI_FINISH_THREADS.map(function (c) {
  return {hex: c, rgb: [1, 3, 5].map(function (i) { return parseInt(c.slice(i, i + 2), 16); })};
});
var SF_WOVEN = new WeakSet();                        // the tiles already woven (a cloth keeps its tiles on cloth.tiles)

function sfThread(r, g, b) {                         // the thread nearest a colour (weighted as the eye weighs them)
  var best = SF_THREADS[0], gap = 1e9;
  SF_THREADS.forEach(function (d) {
    var dr = r - d.rgb[0], dg = g - d.rgb[1], db = b - d.rgb[2], e = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
    if (e < gap) { gap = e; best = d; }
  });
  return best.hex;
}

function sfWeave(sheet) {                            // one frame of a tile, woven: a new canvas of the same size
  var side = sheet.width, read = sheet.getContext("2d", {willReadFrequently: true}).getImageData(0, 0, side, side).data;
  var out = document.createElement("canvas");
  out.width = side;
  out.height = side;
  var b = out.getContext("2d"), ch = side / SF_PICKS, cw = side / SF_FLOATS;
  for (var row = 0; row < SF_PICKS; row++) {
    var y0 = Math.floor(row * ch), y1 = Math.floor((row + 1) * ch);
    var off = row % 2 ? cw / 2 : 0;                  // each pick's floats half a float along from the last, as a weave lies
    for (var col = -1; col < SF_FLOATS; col++) {
      var x0 = Math.max(0, Math.floor(col * cw + off)), x1 = Math.min(side, Math.floor((col + 1) * cw + off));
      if (x1 <= x0) { continue; }
      var r = 0, g = 0, bl = 0, a = 0, n = 0;
      for (var y = y0; y < y1; y += 2) {
        for (var x = x0; x < x1; x += 2) {
          var i = (y * side + x) * 4, al = read[i + 3] / 255;
          r += read[i] * al; g += read[i + 1] * al; bl += read[i + 2] * al; a += al; n++;
        }
      }
      if (!n || a / n < 0.42) { continue; }        // too little of the picture here: the cloth shows
      var w = x1 - x0, h = y1 - y0;
      b.fillStyle = sfThread(r / a, g / a, bl / a);
      b.beginPath(); b.roundRect(x0 + 0.6, y0 + 0.7, w - 1.2, h - 1.4, Math.min(h, w) * 0.42); b.fill();
      b.fillStyle = "rgba(255, 250, 235, 0.28)";     // the light along the float's top
      b.fillRect(x0 + w * 0.15, y0 + h * 0.2, w * 0.7, h * 0.18);
      b.fillStyle = "rgba(20, 5, 5, 0.22)";          // its foot in shade
      b.fillRect(x0 + 1, y0 + h * 0.7, w - 2, h * 0.16);
    }
  }
  return out;
}

sabaiTiles = function (cloth) {
  var tiles = SABAI_FINISH_KIT.tiles(cloth);
  if (!cloth.finish || SF_WOVEN.has(tiles)) { return tiles; }
  cloth.tiles = tiles.map(function (row) { return row.map(function (frames) { return frames.map(sfWeave); }); });
  SF_WOVEN.add(cloth.tiles);
  return cloth.tiles;
};

// The cloth's edges and rows in 97 points, not 25, and its heading turning smoothly, not in steps from one piece of its
// middle line to the next (up close both showed as small straight steps).
function sfEdge(where, across, from, to, joined) {
  for (var n = 0; n <= 96; n++) {
    var q = sabaiAt(where, mix(from, to, n / 96), across);
    if (n || joined) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); }
  }
}
function sfSmooth(where) {                           // the same cloth, its heading the line's own through each point
  var e = 1 / 48;
  return Object.assign({}, where, {angle: function (u) {
    var p = where.at(Math.max(0, u - e)), q = where.at(Math.min(1, u + e));
    return Math.atan2(q[1] - p[1], q[0] - p[0]);
  }});
}

sabai = function (t, where, cloth, part) {
  if (!cloth || !cloth.finish) { return SABAI_FINISH_KIT.sabai(t, where, cloth, part); }
  var half = (cloth.wide || 72) / 2;
  where = sfSmooth(where);
  if (part !== "front" && where.tail) { where.tail = sfSway(where.tail); }
  if (part === "front") { sfShadow(where, half); }
  sabaiEdge = sfEdge;
  try { SABAI_FINISH_KIT.sabai(t, where, cloth, part); } finally { sabaiEdge = SABAI_FINISH_KIT.edge; }
  if (part === "front") { sfFar(where, half, cloth); sfBorder(where, half, cloth); sfLight(where, half); }
  else { sfEnd(where, cloth); }
};

function sfLine(where, from, to, across, steps) {   // a line along the band at an offset across it
  var p = new Path2D();
  for (var k = 0; k <= steps; k++) { var q = sabaiAt(where, from + (to - from) * k / steps, across); if (k) { p.lineTo(q[0], q[1]); } else { p.moveTo(q[0], q[1]); } }
  return p;
}
function sfBand(where, half) {                       // the band's outline, from its cut end to its top
  var from = where.start || 0, to = where.length, p = new Path2D(), k, q;
  for (k = 0; k <= 96; k++) { q = sabaiAt(where, from + (to - from) * k / 96, -half); if (k) { p.lineTo(q[0], q[1]); } else { p.moveTo(q[0], q[1]); } }
  for (k = 96; k >= 0; k--) { q = sabaiAt(where, from + (to - from) * k / 96, half); p.lineTo(q[0], q[1]); }
  p.closePath();
  return p;
}
function sfTuck(where) {                             // nothing below the waist's line, where the cloth is tucked in
  if (where.tuck !== undefined) { pen.beginPath(); pen.rect(-1e5, -1e5, 2e5, 1e5 + where.tuck); pen.clip(); }
}

// (2) Light and folds: a soft shadow under the band on her blouse (not past her shoulder, where it would fall on the
// sky), and over the band a smooth field of light (sfLight).
function sfShadow(where, half) {
  var to = where.length - 70;
  pen.save(); sfTuck(where);
  pen.strokeStyle = "rgba(60, 20, 20, 0.16)"; pen.lineCap = "round";
  pen.lineWidth = 12; pen.stroke(sfLine(where, where.start || 0, to, half + 4, 96));
  pen.lineWidth = 5; pen.stroke(sfLine(where, where.start || 0, to, half + 2, 96));
  pen.restore();
}

var SF_LAYERS = null;                                // two small sheets for the light: made once, grown when a cloth needs more
function sfLayer(k, w, h) {
  if (!SF_LAYERS) { SF_LAYERS = [document.createElement("canvas"), document.createElement("canvas")]; }
  var c = SF_LAYERS[k];
  if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
  return c;
}

// The light, with no edge anywhere (the owner saw "a lighter shade box" where strokes had laid it, and patches laid
// see-through showed their seams). It is painted on two small sheets in the pen's own frame, the shade on white and the
// light on black, in strips along the cloth each filled across with a smooth gradient, and laid on the cloth whole, the
// shade multiplied and the light screened. Across it, a sheen on its upper part and shade toward its lower edge as it
// turns away; along it, darker over the last of it where it turns over the shoulder, and a soft glow of the silk that
// moves along it (with a mural woman's sway, WM_TILT of mural_women.js, where there is one). Then two creases at the
// turn, and the gold edge catching the light.
function sfLight(where, half) {
  var from = where.start || 0, to = where.length, frame = pen.getTransform();
  var u = 0.5 + 0.42 * Math.sin(clock * 0.55 + 220 * (typeof WM_TILT !== "undefined" ? WM_TILT : 0)), glowAt = from + (to - from) * u;
  var scale = Math.hypot(frame.a, frame.b), W = pen.canvas.width, H = pen.canvas.height;
  function toScreen(q) { return [frame.a * q[0] + frame.c * q[1] + frame.e, frame.b * q[0] + frame.d * q[1] + frame.f]; }
  var box = [W, H, 0, 0];                            // the part of the screen this cloth covers: only it is cleared and laid
  for (var b = from - 30; b <= to + 30; b += 6) {
    [-half - 6, half + 6].forEach(function (c) { var q = toScreen(sabaiAt(where, b, c)); box = [Math.min(box[0], q[0]), Math.min(box[1], q[1]), Math.max(box[2], q[0]), Math.max(box[3], q[1])]; });
  }
  box = [Math.max(0, Math.floor(box[0])), Math.max(0, Math.floor(box[1])), Math.min(W, Math.ceil(box[2])), Math.min(H, Math.ceil(box[3]))];
  if (box[2] <= box[0] || box[3] <= box[1]) { return; }
  var bw = box[2] - box[0], bh = box[3] - box[1];
  // The light changes slowly over the cloth, so its sheets are small: a pixel of them is R of the screen's (about 24
  // across the cloth's width), laid on the cloth smoothed; the cloth's own edges, which cut it, stay sharp (sheets of the
  // screen's size took 170 ms a cloth). The strips are a few of those pixels long however near the camera is (strips of
  // a fixed length had made steps 500 pixels wide in a close-up).
  var R = Math.max(1, Math.min(8, Math.floor(2 * half * scale / 24))), lw = Math.ceil(bw / R) + 1, lh = Math.ceil(bh / R) + 1;
  var shadeC = sfLayer(0, lw, lh), lightC = sfLayer(1, lw, lh), sh = shadeC.getContext("2d"), li = lightC.getContext("2d");
  [[sh, "#ffffff"], [li, "#000000"]].forEach(function (l) {
    l[0].setTransform(1, 0, 0, 1, 0, 0); l[0].fillStyle = l[1]; l[0].fillRect(0, 0, lw, lh);
    l[0].setTransform(1 / R, 0, 0, 1 / R, -box[0] / R, -box[1] / R); l[0].transform(frame.a, frame.b, frame.c, frame.d, frame.e, frame.f);
  });
  var da = Math.max(0.08, Math.min(12, 3 * R / scale)), over = 1.5 * R / scale;
  function onScreen(qs) {                            // whether a strip's corners take it onto the screen
    var X = qs.map(function (q) { return toScreen(q)[0]; }), Y = qs.map(function (q) { return toScreen(q)[1]; });
    return Math.max.apply(null, X) > 0 && Math.min.apply(null, X) < W && Math.max.apply(null, Y) > 0 && Math.min.apply(null, Y) < H;
  }
  for (var a = from - 24; a < to + 24; a += da) {
    var turn = Math.max(0, Math.min(1, (a - (to - 70)) / 60));               // over the shoulder
    var glowA = Math.exp(-Math.pow((a - glowAt + da / 2) / (half * 1.1), 2));
    var p0 = sabaiAt(where, a - over, -half - 4), p1 = sabaiAt(where, a + da + over, -half - 4), p2 = sabaiAt(where, a + da + over, half + 4), p3 = sabaiAt(where, a - over, half + 4);
    if (!onScreen([p0, p1, p2, p3])) { continue; }
    var top = sabaiAt(where, a + da / 2, -half), foot = sabaiAt(where, a + da / 2, half);
    var gs = sh.createLinearGradient(top[0], top[1], foot[0], foot[1]), gl = li.createLinearGradient(top[0], top[1], foot[0], foot[1]);
    for (var k = 0; k <= 12; k++) {
      var v = -1 + k / 6;                                                   // -1 its upper edge, 1 its lower
      var dark = Math.min(0.5, 0.2 * Math.pow(Math.max(0, v), 1.6) + 0.16 * turn * turn);
      var light = 0.1 * Math.exp(-Math.pow((v + 0.5) / 0.35, 2)) + 0.12 * glowA * Math.exp(-Math.pow((v + 0.3) / 0.5, 2));
      var d = Math.round(255 * (1 - dark)), lv = Math.round(255 * light);
      gs.addColorStop(k / 12, "rgb(" + d + "," + Math.round(d * 0.97) + "," + Math.round(d * 0.98) + ")");
      gl.addColorStop(k / 12, "rgb(" + lv + "," + Math.round(lv * 0.94) + "," + Math.round(lv * 0.85) + ")");
    }
    [[sh, gs], [li, gl]].forEach(function (l) {
      l[0].beginPath(); l[0].moveTo(p0[0], p0[1]); l[0].lineTo(p1[0], p1[1]); l[0].lineTo(p2[0], p2[1]); l[0].lineTo(p3[0], p3[1]); l[0].closePath();
      l[0].fillStyle = l[1]; l[0].fill();
    });
  }
  pen.save(); sfTuck(where); pen.clip(sfBand(where, half));
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.imageSmoothingEnabled = true; pen.imageSmoothingQuality = "high";
  pen.globalCompositeOperation = "multiply"; pen.drawImage(shadeC, 0, 0, lw, lh, box[0], box[1], lw * R, lh * R);
  pen.globalCompositeOperation = "screen"; pen.drawImage(lightC, 0, 0, lw, lh, box[0], box[1], lw * R, lh * R);
  pen.setTransform(frame); pen.globalCompositeOperation = "source-over";
  [to - 30, to - 44].forEach(function (a, i) {       // two creases where it turns
    var p = sabaiAt(where, a, -half + 6), m = sabaiAt(where, a + 6, 0), q = sabaiAt(where, a - 2, half - 6);
    pen.strokeStyle = "rgba(20, 0, 6, 0.3)"; pen.lineWidth = 1.6 - i * 0.4;
    pen.beginPath(); pen.moveTo(p[0], p[1]); pen.quadraticCurveTo(m[0], m[1], q[0], q[1]); pen.stroke();
  });
  pen.restore();
  var flash = Math.pow(0.5 + 0.5 * Math.sin(clock * 0.9 + 1.3), 8);
  pen.save(); pen.globalCompositeOperation = "lighter"; pen.lineCap = "round";
  pen.strokeStyle = "rgba(255, 240, 190, " + (0.25 + 0.55 * flash).toFixed(3) + ")"; pen.lineWidth = 2.4;
  pen.stroke(sfLine(where, glowAt - 26, glowAt + 26, -half + 1.5, 8));
  pen.restore();
}

// (4) Woven borders: in place of the flat gold hem along each long edge, a thin gold selvedge and inside it a row of
// small diamonds woven in gold thread, each three floats (short, long, short), as a teen jok's borders are.
function sfBorder(where, half, cloth) {
  var from = where.start || 0, to = where.length;
  pen.save(); sfTuck(where); pen.clip(sfBand(where, half));
  [-1, 1].forEach(function (side) {
    pen.strokeStyle = cloth.cloth || "#8a2a3a"; pen.lineWidth = 1.9; pen.lineCap = "butt";   // the flat hem's inner part, back to the cloth
    pen.stroke(sfLine(where, from, to, side * (half - 2.15), 96));
    for (var a = from + 1.5; a < to + 1.5; a += 3) {
      [[half - 1.95, 0.9], [half - 2.65, 2.3], [half - 3.35, 0.9]].forEach(function (f) {
        var q = sabaiAt(where, a, side * f[0]);
        pen.save(); pen.translate(q[0], q[1]); pen.rotate(q[2]);
        pen.fillStyle = WEAVE_DYES.gold;
        pen.beginPath(); pen.roundRect(-f[1] / 2, -0.31, f[1], 0.62, 0.26); pen.fill();
        pen.fillStyle = "rgba(255, 250, 230, 0.35)"; pen.fillRect(-f[1] * 0.35, -0.22, f[1] * 0.7, 0.12);   // its top in the light
        pen.restore();
      });
    }
  });
  pen.restore();
}

// (5) Moving as cloth: the end hanging behind her moves in the same breeze as the tung on its pole (oldcartoon.js
// tung()), less (a heavier cloth, against her), swinging more toward its foot and the foot after the top in time, with
// a faint ripple running down it; the fringe trails after the foot (sfEnd).
function sfBreeze(d) {                               // how far the hanging end is moved sideways at d: 0 the shoulder, 1 its foot
  var lag = clock - 0.8 * d;
  var breeze = Math.sin(lag * 1.1) + 0.5 * Math.sin(lag * 1.9 + 1.3) + 0.25 * Math.sin(lag * 3.1 + 0.6);
  return 5 * breeze * Math.pow(Math.max(0, d), 1.3) + 1.6 * Math.sin(d * 7 - clock * 2.4) * Math.max(0, d);
}
function sfSway(T) {
  var top = T.outer[0][1], foot = Math.max.apply(null, T.hem.map(function (q) { return q[1]; }));
  function moved(q) { var d = (q[1] - top) / (foot - top || 1); return [q[0] + sfBreeze(d), q[1]]; }
  return Object.assign({}, T, {outer: T.outer.map(moved), hem: T.hem.map(moved), inner: moved(T.inner)});
}

// (7) Less at a distance: as the camera pulls back and the cloth grows small on the screen, its rows of small figures
// give way to broader bands of pattern, as a cloth is seen from across a yard: a row of gold lozenges down its middle,
// each with a heart of green, between fine gold lines and cream stripes. Seen from near (the cloth more than 340 of the
// screen's pixels across) none of it; from far (less than 230) all of it: a short crossfade, as the two together look
// muddy.
function sfFar(where, half, cloth) {
  var f = pen.getTransform(), across = 2 * half * Math.hypot(f.a, f.b), a = Math.max(0, Math.min(1, (340 - across) / 110));
  if (a <= 0) { return; }
  var from = where.start || 0, to = where.length, ground = cloth.cloth || "#8a2a3a";
  pen.save(); sfTuck(where); pen.clip(sfBand(where, half));
  pen.globalAlpha = a;
  pen.fillStyle = ground; pen.fill(sfBand(where, half));
  function stripe(v0, v1, colour) {                  // a stripe along the whole cloth, from v0 to v1 (-1 its upper edge, 1 its lower)
    var p = new Path2D(), k, q;
    for (k = 0; k <= 96; k++) { q = sabaiAt(where, from + (to - from) * k / 96, v0 * half); if (k) { p.lineTo(q[0], q[1]); } else { p.moveTo(q[0], q[1]); } }
    for (k = 96; k >= 0; k--) { q = sabaiAt(where, from + (to - from) * k / 96, v1 * half); p.lineTo(q[0], q[1]); }
    p.closePath(); pen.fillStyle = colour; pen.fill(p);
  }
  stripe(-0.66, -0.56, WEAVE_DYES.cream); stripe(0.56, 0.66, WEAVE_DYES.cream);
  stripe(-0.47, -0.43, WEAVE_DYES.gold); stripe(0.43, 0.47, WEAVE_DYES.gold);
  stripe(-0.84, -0.8, WEAVE_DYES.gold); stripe(0.8, 0.84, WEAVE_DYES.gold);
  var tall = 0.36 * half, long = tall * 1.25, step = long * 2.5;
  function lozenge(c, l, h, colour) {
    var q = [sabaiAt(where, c - l, 0), sabaiAt(where, c, -h), sabaiAt(where, c + l, 0), sabaiAt(where, c, h)];
    pen.beginPath(); pen.moveTo(q[0][0], q[0][1]); q.slice(1).forEach(function (r) { pen.lineTo(r[0], r[1]); }); pen.closePath();
    pen.fillStyle = colour; pen.fill();
  }
  for (var c = from + step / 2; c < to + step; c += step) {
    lozenge(c, long, tall, WEAVE_DYES.gold);
    lozenge(c, long * 0.62, tall * 0.62, ground);
    lozenge(c, long * 0.36, tall * 0.36, WEAVE_DYES.green);
    lozenge(c + step / 2, long * 0.22, tall * 0.22, WEAVE_DYES.cream);   // a small one between
  }
  pen.restore();
}

// (3) A finished end: the end hanging behind her shoulder ("back") gets a woven end panel above its foot (teenJok's rows
// of Nan in the cloth's own colours: its ground, gold, cream, green, black; woven once) and a knotted fringe that swings.
function sfEndSheet(cloth) {
  var key = "sf-end|" + (cloth.cloth || "#8a2a3a");
  if (!sfEndSheet[key]) {
    var got = null, brush = {drawImage: function (img) { got = img; }};
    var size = teenJok(brush, 0, 0, 200, {town: "nan", cell: 4, palette: {ground: cloth.cloth || "#8a2a3a", threads: [WEAVE_DYES.gold, WEAVE_DYES.cream, WEAVE_DYES.green, WEAVE_DYES.black]}});
    sfEndSheet[key] = {canvas: got, w: size.w, h: size.h};
  }
  return sfEndSheet[key];
}
function sfEnd(where, cloth) {
  var T = where.tail;
  if (!T) { return; }
  var tail = new Path2D(); tail.moveTo(T.inner[0], T.inner[1]);
  T.outer.forEach(function (q) { tail.lineTo(q[0], q[1]); }); T.hem.forEach(function (q) { tail.lineTo(q[0], q[1]); }); tail.closePath();
  var last = T.outer[T.outer.length - 1], xs = T.hem.map(function (q) { return q[0]; }).concat([last[0]]), ys = T.hem.map(function (q) { return q[1]; });
  var x0 = Math.min.apply(null, xs) - 6, x1 = Math.max.apply(null, xs) + 6, foot = Math.max.apply(null, ys), tall = 64;
  var sheet = sfEndSheet(cloth);
  pen.save(); pen.clip(tail);                        // the end panel: its rows from the foot up
  var wide = sheet.w * tall / sheet.h;
  for (var x = x0; x < x1; x += wide) { pen.drawImage(sheet.canvas, x, foot - tall, wide, tall); }
  pen.fillStyle = "rgba(20, 0, 10, 0.18)"; pen.fillRect(x0, foot - tall, x1 - x0, tall);   // the back of a cloth: in its own shade
  pen.strokeStyle = STYLE.gold; pen.lineWidth = 2.4;
  pen.beginPath(); pen.moveTo(x0, foot - tall - 2); pen.lineTo(x1, foot - tall - 6); pen.stroke();
  pen.restore();
  // the fringe: the warp's ends knotted in bunches and left to hang, trailing after the foot
  var lean = T.outer[0][0] < T.inner[0] ? -1 : 1, n = 22, sway = 1.6 * (sfBreeze(1.45) - sfBreeze(1));
  for (var k = 0; k <= n; k++) {
    var u = k / n * (T.hem.length - 1), i = Math.min(T.hem.length - 2, Math.floor(u)), f = u - i;
    var p = [T.hem[i][0] + (T.hem[i + 1][0] - T.hem[i][0]) * f, T.hem[i][1] + (T.hem[i + 1][1] - T.hem[i][1]) * f];
    var long = 18 + 4 * Math.sin(k * 2.3), end = [p[0] + (sway + lean * 2) * (0.6 + 0.4 * Math.sin(k)), p[1] + long];
    pen.strokeStyle = k % 3 ? (cloth.cloth || "#8a2a3a") : STYLE.gold; pen.lineWidth = 1.6; pen.lineCap = "round";
    pen.beginPath(); pen.moveTo(p[0], p[1]); pen.quadraticCurveTo(p[0], p[1] + long * 0.5, end[0], end[1]); pen.stroke();
    pen.fillStyle = k % 3 ? blend(cloth.cloth || "#8a2a3a", "#1a0a0a", 0.3) : STYLE.gold;
    pen.beginPath(); pen.arc(p[0] + (end[0] - p[0]) * 0.3, p[1] + 5, 1.6, 0, 7); pen.fill();   // its knot
  }
}
