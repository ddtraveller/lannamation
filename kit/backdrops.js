// backdrops.js - nineteen backgrounds to start a film from: seven places of
// the north of Thailand, in the kit's own manner, and twelve in the manner
// of the thangka painters. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="backdrops.js"></script>
//
// backdrop(name) gives a set, 1440 x 1080, painted once and kept. A scene
// lays it down with  pen.drawImage(backdrop("meadow"), 0, 0)  and stands its
// people on the ground, which in every one of them is near y = 900.
// BACKDROPS lists the nineteen names, each with a line about it and its name
// in Thai, for a page that lets a child choose one.
//
// No painting is copied here. The twelve of the thangka keep what the tradition does, as it
// is set out in P. Lehtisalo, "Holy Grounds: Landscapes in Tibetan thangka
// paintings" (Studia Orientalia 109, 2011), which reads Jackson and Jackson's
// "Tibetan Thangka Painting: Methods and Materials" and others:
//
//   1. The sky is darker the higher it goes, and light at the horizon, or
//      there is a red glow there. The sun and the moon are both in it, near
//      the top corners: the sun at the right, orange or red, and the moon at
//      the left, white.
//   2. Snow mountains stand on the horizon behind green hills: steep,
//      pointed, wholly under snow, white to light blue, the folds of the snow
//      edged with a darker blue.
//   3. The land is green hills with rows of small tufts along their edges.
//      Land is a triangle that points up and water a triangle that points
//      down, and a picture is the two set against each other.
//   4. Stones are angular, with jagged and hollow edges, and they stand up.
//      A crag has two zones, the outer one blue and the inner one green, each
//      darker at its outer edge, and a line of gold round it.
//   5. Water is a solid thing with no reflections: zones divided by wavy
//      white lines, each zone darkest at the front. A cascade's lines follow
//      its fall, and it ends in a splash.
//   6. Clouds are of two kinds: plump ones, a row of round lobes on a flat
//      foot, and layered ones high up, thin bars joined by short necks. They
//      are of many colours, and several colours in one picture.
//   7. Rainbows twist, loop, change their width and end in the middle of
//      the air.
//   8. There are few plants and each leaf is drawn. A jewel tree is a small
//      tree hung with strings of gems.
//   9. Buildings are those of the Himalaya: walls that lean in, a dark red
//      band under a flat roof, a gilded top.
//  10. Nothing casts a shadow on the ground.
//  11. Besides the paintings of many colours there are three of one ground:
//      black with lines of gold, red with lines of gold, and gold with lines
//      of red or black.
var BACKDROPS = [
  ["paddy", "rice fields in their bunds under blue hills, a field hut and palms", "นาข้าว"],
  ["river", "a wide river with boats on it, and a house on the far bank", "แม่น้ำ"],
  ["doi", "a great green mountain in the morning mist, a gold chedi on its shoulder", "ดอย"],
  ["waterfall", "a waterfall down a cliff in the forest, in two leaps, and its pool", "น้ำตก"],
  ["village", "houses on posts along a lane, with a fence, palms and a haystack", "หมู่บ้าน"],
  ["market", "a market: stalls under striped cloth, heaped with fruit, and paper lanterns", "ตลาด"],
  ["yipeng", "the night of Yi Peng: a full moon, lanterns rising, lights on the river", "ยี่เป็ง"],
  ["meadow", "green hills under snow peaks, the sun and the moon in the sky", "ทุ่งหญ้า"],
  ["crags", "blue and green crags, a cascade from a cave, a red glow at the horizon", "ผาหิน"],
  ["lake", "a lake of lotus, its water in zones, and goldfish", "สระบัว"],
  ["sky", "nothing but sky: clouds of many colours, and rainbows that end in the air", "บนฟ้า"],
  ["midnight", "the meadow on a black ground, in lines of gold", "ทองบนดำ"],
  ["vermilion", "the crags on a red ground, in lines of gold", "ทองบนแดง"],
  ["golden", "the lake on a gold ground, in lines of red", "แดงบนทอง"],
  ["hermitage", "a cave in a crag under great snow mountains", "ถ้ำฤๅษี"],
  ["longlife", "the rock, the water and the tree of long life, with cranes", "อายุยืน"],
  ["garden", "a garden of jewel trees before a gilded hall, a rainbow behind it", "สวนแก้ว"],
  ["monastery", "a monastery on a hill, a stupa, and lines of flags", "วัดบนเขา"],
  ["valley", "an open valley, pale and wide, with a river: much left empty", "หุบเขา"]
];

var BACKDROP_SETS = {};

// ---------- the painters ----------

// The sky: "high" at the top, "low" at the horizon, and a glow of another
// colour just above the horizon if one is given.
function bdSky(brush, horizon, high, low, glow) {
  var fade = brush.createLinearGradient(0, 0, 0, horizon);
  fade.addColorStop(0, high);
  fade.addColorStop(glow ? 0.72 : 1, low);
  if (glow) { fade.addColorStop(1, glow); }
  brush.fillStyle = fade;
  brush.fillRect(0, 0, WIDE, horizon + 2);
  brush.fillStyle = glow || low;                    // and the same light on down, behind the hills
  brush.fillRect(0, horizon, WIDE, 1080 - horizon);
}

// The sun, at the right, and the moon, at the left, near the top corners.
// "crescent" makes the moon a crescent with three stars by it.
function bdSunMoon(brush, crescent) {
  brush.lineWidth = 2;
  brush.beginPath();                                // the sun: a disc with a ring round it
  brush.arc(WIDE - 150, 112, 40, 0, 7);
  brush.fillStyle = "#e8632c";
  brush.fill();
  brush.strokeStyle = "#8a2f1a";
  brush.stroke();
  brush.beginPath();
  brush.arc(WIDE - 150, 112, 50, 0, 7);
  brush.strokeStyle = "#f6c445";
  brush.lineWidth = 4;
  brush.stroke();
  brush.lineWidth = 2;
  brush.beginPath();
  brush.arc(150, 112, 38, 0, 7);
  brush.fillStyle = crescent ? "#3a4a6a" : "#f6f4ec";
  brush.fill();
  brush.strokeStyle = "#7f93b4";
  brush.stroke();
  if (crescent) {
    brush.beginPath();                              // a light crescent on the dark disc
    brush.arc(150, 112, 36, Math.PI * 0.1, Math.PI * 1.2);
    brush.arc(164, 100, 34, Math.PI * 1.25, Math.PI * 0.05, true);
    brush.closePath();
    brush.fillStyle = "#f6f4ec";
    brush.fill();
    brush.fillStyle = "#f6e9a8";
    for (var star = 0; star < 3; star++) {
      brush.beginPath();
      brush.arc(214 + star * 26, 78 + star * star * 12, 3.2, 0, 7);
      brush.fill();
    }
  }
}

// A range of snow mountains: steep, pointed, wholly under snow. The folds of
// the snow are lines of a darker blue that run down from each top. "under"
// is how far below "base" their sides and folds run on. A range stands
// behind hills, and where those dip its level foot would show, with the sky
// under it: every range in this file gives the base of its first hills less
// its own base, and 10 more, so that the foot is always behind the ridge.
function bdSnow(brush, x, base, wide, tall, seed, under) {
  var count = Math.max(3, Math.round(wide / 150)), order = [], n;
  for (n = 0; n < count; n++) { order.push(n); }
  order.sort(function (a, b) { return dice(a + seed * 7) - dice(b + seed * 7); });   // the ones behind first, in no order
  brush.lineJoin = "round";
  brush.lineCap = "round";
  for (n = 0; n < count; n++) {
    var k = order[n] + seed * 31, across = (order[n] + 0.5) / count - 0.5;
    var px = x + across * wide + (dice(k) - 0.5) * 40, high = tall * (0.55 + 0.45 * dice(k + 3)) * (1 - 0.5 * across * across);
    var half = wide / count * (0.7 + 0.35 * dice(k + 5)), lean = (dice(k + 9) - 0.5) * half * 0.4;
    brush.beginPath();
    brush.moveTo(px - half, base);
    brush.quadraticCurveTo(px - half * 0.22 + lean, base - high * 0.5, px + lean - 5, base - high + 6);
    brush.quadraticCurveTo(px + lean, base - high - 4, px + lean + 5, base - high + 6);      // a top a little rounded by snow
    brush.quadraticCurveTo(px + half * 0.22 + lean, base - high * 0.5, px + half, base);
    if (under) {                                    // each side runs on down the way it was going
      var run = under / (high * 0.5);
      brush.lineTo(px + half + (half * 0.78 - lean) * run, base + under);
      brush.lineTo(px - half - (half * 0.78 + lean) * run, base + under);
    }
    brush.closePath();
    var fade = brush.createLinearGradient(0, base - high, 0, base);
    fade.addColorStop(0, "#ffffff");
    fade.addColorStop(1, "#c4d9ee");
    brush.fillStyle = fade;
    brush.fill();
    brush.strokeStyle = "#5f86bd";
    brush.lineWidth = 1.8;
    brush.stroke();
    brush.lineWidth = 1.3;                          // the folds of the snow
    brush.beginPath();
    for (var fold = -1; fold <= 1; fold++) {
      brush.moveTo(px + lean + fold * 3, base - high + 10);
      brush.quadraticCurveTo(px + lean + fold * half * 0.16, base - high * 0.55, px + fold * half * 0.46, base - high * 0.12);
      if (under) {                                  // and a fold runs on down with the sides, the way it was going
        brush.lineTo(px + fold * half * 0.46 + (fold * half * 0.3 - lean) * (under + high * 0.12) / (high * 0.43), base + under);
      }
    }
    brush.stroke();
  }
}

// A formation of crags: angular stones that stand up, each with a blue outer
// zone and a green inner one, darker at the edge, and a line of gold. A
// stone here and there is brown.
function bdCrags(brush, x, base, size, seed, count) {
  var shapeOf = [[-0.5, 0], [-0.42, -0.3], [-0.56, -0.35], [-0.3, -0.68], [-0.38, -0.74], [-0.08, -1], [0.14, -0.9], [0.3, -0.6],
                 [0.2, -0.55], [0.46, -0.26], [0.5, 0]];
  brush.lineJoin = "round";
  for (var n = 0; n < (count || 4); n++) {
    var k = n + seed * 13, w = size * (90 + 70 * dice(k)), h = size * (170 + 190 * dice(k + 2));
    var cx = x + (n - ((count || 4) - 1) / 2) * size * 78 + (dice(k + 4) - 0.5) * 30, tilt = (dice(k + 6) - 0.5) * 0.3;
    var brown = dice(k + 8) > 0.72;
    brush.save();
    brush.translate(cx, base);
    brush.rotate(tilt);
    for (var zone = 0; zone < 2; zone++) {          // the outer zone, then the inner one over it
      var fit = zone ? 0.6 : 1;
      brush.beginPath();
      for (var p = 0; p < shapeOf.length; p++) {
        brush.lineTo(shapeOf[p][0] * w * fit + (zone ? w * 0.04 : 0), shapeOf[p][1] * h * fit);
      }
      brush.closePath();
      var deep = zone ? (brown ? "#8a5a34" : "#2f8a5f") : (brown ? "#6a3f28" : "#2c5aa0");
      var fade = brush.createLinearGradient(-w * 0.5 * fit, 0, w * 0.2 * fit, 0);     // darker at its outer edge
      fade.addColorStop(0, blend(deep, "#0c1830", 0.45));
      fade.addColorStop(0.5, deep);
      fade.addColorStop(1, blend(deep, "#eaf2ff", 0.3));
      brush.fillStyle = fade;
      brush.fill();
      brush.strokeStyle = zone ? "rgba(246, 214, 120, 0.7)" : "#e0b23a";
      brush.lineWidth = zone ? 1.2 : 2;
      brush.stroke();
    }
    brush.restore();
  }
}

// Water, as a thangka paints it: zones divided by wavy white lines, each
// zone darkest at the front. The box (x, y, wide, tall) holds it.
function bdWater(brush, x, y, wide, tall, colour) {
  var zones = Math.max(2, Math.round(tall / 30)), deep = colour || "#2f6fa8", n, at;
  brush.save();
  brush.beginPath();
  brush.rect(x, y, wide, tall);
  brush.clip();
  for (n = 0; n < zones; n++) {
    var top = y + tall * n / zones, under = y + tall * (n + 1) / zones + 8;
    function wave(px) { return top + 5 * Math.sin(px * 0.021 + n * 1.9) + 3 * Math.sin(px * 0.047 + n); }
    brush.beginPath();
    brush.moveTo(x, under);
    for (at = x; at <= x + wide; at += 16) { brush.lineTo(at, wave(at)); }
    brush.lineTo(x + wide, under);
    brush.closePath();
    var fade = brush.createLinearGradient(0, top, 0, under);
    fade.addColorStop(0, blend(deep, "#ffffff", 0.62));
    fade.addColorStop(1, deep);
    brush.fillStyle = fade;
    brush.fill();
    brush.beginPath();
    for (at = x; at <= x + wide; at += 16) { brush.lineTo(at, wave(at)); }
    brush.strokeStyle = "#ffffff";
    brush.lineWidth = 1.8;
    brush.stroke();
  }
  brush.restore();
}

// A cascade: it falls from (x, top) to "bottom", a little wider as it goes,
// its lines following the fall, and ends in a splash (the kit's foam).
function bdCascade(brush, x, top, bottom, wide) {
  brush.beginPath();
  brush.moveTo(x - wide * 0.3, top);
  brush.quadraticCurveTo(x - wide * 0.45, (top + bottom) / 2, x - wide * 0.6, bottom);
  brush.lineTo(x + wide * 0.6, bottom);
  brush.quadraticCurveTo(x + wide * 0.45, (top + bottom) / 2, x + wide * 0.3, top);
  brush.closePath();
  var fade = brush.createLinearGradient(0, top, 0, bottom);
  fade.addColorStop(0, "#9fc3e6");
  fade.addColorStop(1, "#ffffff");
  brush.fillStyle = fade;
  brush.fill();
  brush.strokeStyle = "#4f7db4";
  brush.lineWidth = 1.5;
  brush.stroke();
  brush.lineWidth = 1.1;
  brush.beginPath();
  for (var line = -2; line <= 2; line++) {
    brush.moveTo(x + line * wide * 0.1, top + 6);
    brush.quadraticCurveTo(x + line * wide * 0.16, (top + bottom) / 2, x + line * wide * 0.22, bottom - 4);
  }
  brush.stroke();
  foam(brush, x - wide * 0.9, bottom - 14, wide * 1.8, 30, "#7f9fc0", top);
}

// A layered cloud, for high in the sky: thin bars of several colours, one
// under another, joined by short necks.
function bdLayers(brush, x, y, wide, colours, seed) {
  brush.lineJoin = "round";
  for (var n = 0; n < colours.length; n++) {
    var long = wide * (0.5 + 0.5 * dice(n + seed * 5)), left = x - long / 2 + (dice(n + seed * 9) - 0.5) * wide * 0.3, level = y + n * 22;
    brush.beginPath();
    brush.moveTo(left, level + 7);
    brush.arc(left, level, 7, Math.PI / 2, Math.PI * 1.5);
    brush.lineTo(left + long, level - 7);
    brush.arc(left + long, level, 7, -Math.PI / 2, Math.PI / 2);
    brush.closePath();
    if (n < colours.length - 1) { brush.rect(left + long * (0.3 + 0.4 * dice(n + seed)), level + 6, 14, 12); }   // the neck to the bar below
    brush.fillStyle = colours[n];
    brush.fill();
    brush.strokeStyle = blend(colours[n], "#1f2a5a", 0.5);
    brush.lineWidth = 1.3;
    brush.stroke();
  }
}

// A smooth line through a list of points, as points close together.
function bdCurve(points) {
  var out = [];
  for (var n = 0; n < points.length - 1; n++) {
    var a = points[Math.max(0, n - 1)], b = points[n], c = points[n + 1], d = points[Math.min(points.length - 1, n + 2)];
    for (var k = 0; k < 14; k++) {
      var u = k / 14, u2 = u * u, u3 = u2 * u, p = [0, 0];
      for (var axis = 0; axis < 2; axis++) {
        p[axis] = 0.5 * (2 * b[axis] + (c[axis] - a[axis]) * u + (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * u2
                         + (3 * b[axis] - a[axis] - 3 * c[axis] + d[axis]) * u3);
      }
      out.push(p);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

// A rainbow, as a thangka has one: a ribbon of stripes along a line that
// twists and ends in the middle of the air. It is "wideA" across at its
// start and "wideB" at its end.
function bdRainbow(brush, points, wideA, wideB, colours) {
  var line = bdCurve(points), last = line.length - 1, n, k;
  var stripes = colours || ["#d9453a", "#f0a23a", "#f6dc5a", "#4f9a5a", "#3f6fb8"];
  function edge(n, part) {                          // a point across the ribbon at point n: part 0 is one side, 1 the other
    var a = line[Math.max(0, n - 1)], b = line[Math.min(last, n + 1)];
    var far = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) || 1;
    var w = mix(wideA, wideB, n / last) * (part - 0.5);
    return [line[n][0] - (b[1] - a[1]) / far * w, line[n][1] + (b[0] - a[0]) / far * w];
  }
  for (k = 0; k < stripes.length; k++) {
    brush.beginPath();
    for (n = 0; n <= last; n++) { var p = edge(n, k / stripes.length); brush.lineTo(p[0], p[1]); }
    for (n = last; n >= 0; n--) { var q = edge(n, (k + 1) / stripes.length); brush.lineTo(q[0], q[1]); }
    brush.closePath();
    brush.fillStyle = stripes[k];
    brush.fill();
  }
  brush.strokeStyle = "rgba(246, 226, 150, 0.9)";   // a fine line of gold down each side
  brush.lineWidth = 1.4;
  for (k = 0; k <= 1; k++) {
    brush.beginPath();
    for (n = 0; n <= last; n++) { var r = edge(n, k); brush.lineTo(r[0], r[1]); }
    brush.stroke();
  }
}

// A jewel tree: a small tree whose leaves are each drawn, in rings about its
// middle, with fruit at the heart, and strings of gems hanging from it.
function bdJewelTree(brush, x, base, size, seed, leaf) {
  var n, colour = leaf || "#2f7a4a";
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.lineJoin = "round";
  brush.lineCap = "round";
  brush.beginPath();                                // a trunk that twists
  brush.moveTo(-10, 0);
  brush.bezierCurveTo(-16, -40, 8, -70, -4, -120);
  brush.lineTo(8, -120);
  brush.bezierCurveTo(18, -72, -4, -40, 12, 0);
  brush.closePath();
  brush.fillStyle = "#7a5234";
  brush.fill();
  brush.strokeStyle = "rgba(50, 30, 18, 0.9)";
  brush.lineWidth = 2;
  brush.stroke();
  brush.beginPath();                                // the dark of the crown, behind its leaves
  brush.ellipse(2, -170, 78, 70, 0, 0, 7);
  brush.fillStyle = blend(colour, "#0c1c10", 0.55);
  brush.fill();
  for (var ring = 3; ring >= 0; ring--) {           // the leaves: the outer ring first, the ones at the heart whole
    var leaves = 8 + ring * 6, far = 16 + ring * 22;
    for (n = 0; n < leaves; n++) {
      var turn = n / leaves * Math.PI * 2 + ring * 0.4 + (dice(n + ring * 9 + seed * 3) - 0.5) * 0.2;
      brush.save();
      brush.translate(2 + Math.cos(turn) * far, -170 + Math.sin(turn) * far * 0.9);
      brush.rotate(turn + Math.PI / 2);
      paintLeaf(brush, 34, 9, 0.1, blend(colour, "#10301c", 0.4), blend(colour, "#e9f0a8", 0.35), blend(colour, "#0c1c10", 0.7),
                "rgba(246, 226, 150, 0.9)");
      brush.restore();
    }
  }
  for (n = 0; n < 5; n++) {                         // fruit at the heart
    var around = n / 5 * Math.PI * 2;
    brush.beginPath();
    brush.arc(2 + Math.cos(around) * 11, -170 + Math.sin(around) * 10, 5.5, 0, 7);
    brush.fillStyle = "#e8632c";
    brush.fill();
    brush.strokeStyle = "#7a2a1a";
    brush.lineWidth = 1.2;
    brush.stroke();
  }
  brush.fillStyle = "#f6c445";                      // strings of gems: three loops of beads, hung from the leaves
  for (var loop = -1; loop <= 1; loop++) {
    for (n = 0; n <= 8; n++) {
      var u = n / 8, gx = 2 + loop * 44 - 24 + u * 48, gy = -120 + Math.sin(u * Math.PI) * 34 + Math.abs(loop) * 14;
      brush.beginPath();
      brush.arc(gx, gy, 2.6, 0, 7);
      brush.fill();
    }
  }
  brush.restore();
}

// A hall of the Himalaya: walls that lean in, a dark red band under a flat
// roof, dark windows, and a gilded roof on top if "gilded" is true.
function bdHall(brush, x, base, wide, tall, gilded) {
  brush.lineJoin = "round";
  brush.beginPath();
  brush.moveTo(x - wide / 2, base);
  brush.lineTo(x - wide * 0.44, base - tall);
  brush.lineTo(x + wide * 0.44, base - tall);
  brush.lineTo(x + wide / 2, base);
  brush.closePath();
  brush.fillStyle = "#f6f1e6";
  brush.fill();
  brush.save();                                     // the wall has depth: one side of it is in shade, and the band throws its shade down it
  brush.clip();
  var turn = brush.createLinearGradient(x - wide / 2, 0, x + wide / 2, 0);
  turn.addColorStop(0, "rgba(120, 100, 80, 0)");
  turn.addColorStop(0.6, "rgba(120, 100, 80, 0)");
  turn.addColorStop(1, "rgba(120, 100, 80, 0.26)");
  brush.fillStyle = turn;
  brush.fillRect(x - wide / 2, base - tall, wide, tall);
  var cast = brush.createLinearGradient(0, base - tall * 0.8, 0, base - tall * 0.66);
  cast.addColorStop(0, "rgba(70, 50, 40, 0.36)");
  cast.addColorStop(1, "rgba(70, 50, 40, 0)");
  brush.fillStyle = cast;
  brush.fillRect(x - wide / 2, base - tall * 0.8, wide, tall * 0.14);
  brush.restore();
  brush.strokeStyle = "#5a3a2a";
  brush.lineWidth = 2;
  brush.stroke();
  brush.fillStyle = "#7a2a2a";                      // the dark red band under the roof
  brush.fillRect(x - wide * 0.445, base - tall, wide * 0.89, tall * 0.2);
  var deep = brush.createLinearGradient(0, base - tall, 0, base - tall * 0.8);   // the roof throws its shade on the band, and the band is darker at its foot
  deep.addColorStop(0, "rgba(30, 10, 10, 0.42)");
  deep.addColorStop(0.4, "rgba(30, 10, 10, 0)");
  deep.addColorStop(0.86, "rgba(30, 10, 10, 0)");
  deep.addColorStop(1, "rgba(30, 10, 10, 0.3)");
  brush.fillStyle = deep;
  brush.fillRect(x - wide * 0.445, base - tall, wide * 0.89, tall * 0.2);
  brush.strokeRect(x - wide * 0.445, base - tall, wide * 0.89, tall * 0.2);
  brush.fillStyle = "#f6c445";
  for (var disc = 0; disc < 5; disc++) {
    brush.beginPath();
    brush.arc(x - wide * 0.34 + disc * wide * 0.17, base - tall * 0.9, tall * 0.045, 0, 7);
    brush.fill();
  }
  brush.fillStyle = "#2a1c1c";                      // windows that lean as the walls do, and a door
  for (var win = -1; win <= 1; win += 2) {
    brush.beginPath();
    brush.moveTo(x + win * wide * 0.3 - wide * 0.07, base - tall * 0.3);
    brush.lineTo(x + win * wide * 0.3 - wide * 0.06, base - tall * 0.62);
    brush.lineTo(x + win * wide * 0.3 + wide * 0.06, base - tall * 0.62);
    brush.lineTo(x + win * wide * 0.3 + wide * 0.07, base - tall * 0.3);
    brush.closePath();
    brush.fillStyle = "#2a1c1c";
    brush.fill();
    brush.fillStyle = "rgba(255, 214, 140, 0.2)";   // a little lamplight in the room
    brush.fillRect(x + win * wide * 0.3 + wide * 0.012, base - tall * 0.58, wide * 0.03, tall * 0.26);
    brush.fillStyle = "#7a2a2a";                    // a lintel over it, and the shade under the lintel
    brush.fillRect(x + win * wide * 0.3 - wide * 0.075, base - tall * 0.66, wide * 0.15, tall * 0.04);
    brush.fillStyle = "rgba(0, 0, 0, 0.4)";
    brush.fillRect(x + win * wide * 0.3 - wide * 0.058, base - tall * 0.62, wide * 0.116, tall * 0.035);
    brush.fillStyle = "#e4dccb";                    // and a sill
    brush.fillRect(x + win * wide * 0.3 - wide * 0.085, base - tall * 0.3, wide * 0.17, tall * 0.03);
    brush.fillStyle = "rgba(90, 70, 50, 0.34)";
    brush.fillRect(x + win * wide * 0.3 - wide * 0.085, base - tall * 0.27, wide * 0.17, tall * 0.014);
  }
  brush.fillStyle = "#e0b23a";                      // the door: a frame of gold, and the door set back in it
  brush.fillRect(x - wide * 0.105, base - tall * 0.53, wide * 0.21, tall * 0.53);
  brush.fillStyle = "#a8322c";
  brush.fillRect(x - wide * 0.09, base - tall * 0.5, wide * 0.18, tall * 0.5);
  brush.fillStyle = "rgba(0, 0, 0, 0.32)";
  brush.fillRect(x - wide * 0.09, base - tall * 0.5, wide * 0.18, tall * 0.06);
  brush.fillRect(x - wide * 0.09, base - tall * 0.5, wide * 0.022, tall * 0.5);
  brush.fillStyle = "rgba(40, 12, 8, 0.7)";
  brush.fillRect(x - 1, base - tall * 0.44, 2, tall * 0.44);
  brush.strokeRect(x - wide * 0.09, base - tall * 0.5, wide * 0.18, tall * 0.5);
  brush.fillStyle = "#e4dccb";                      // a step before it
  brush.fillRect(x - wide * 0.14, base - tall * 0.035, wide * 0.28, tall * 0.035);
  brush.fillStyle = "#c9bfac";
  brush.fillRect(x - wide * 0.14, base - tall * 0.012, wide * 0.28, tall * 0.012);
  if (gilded) {                                     // a gilded roof with turned-up corners, and a top
    brush.beginPath();
    brush.moveTo(x - wide * 0.4, base - tall - 4);
    brush.quadraticCurveTo(x - wide * 0.2, base - tall - tall * 0.2, x - wide * 0.1, base - tall - tall * 0.42);
    brush.lineTo(x + wide * 0.1, base - tall - tall * 0.42);
    brush.quadraticCurveTo(x + wide * 0.2, base - tall - tall * 0.2, x + wide * 0.4, base - tall - 4);
    brush.closePath();
    brush.fillStyle = "#e0b23a";
    brush.fill();
    brush.save();                                   // it is of gilded tiles, in rows
    brush.clip();
    roofTiles(brush, x - wide * 0.4, x + wide * 0.4, base - tall - tall * 0.42, base - tall - 4, Math.max(7, wide * 0.036), "#e0b23a", "round");
    brush.restore();
    brush.beginPath();                              // its line, round the roof again (the tiles were the brush's last path)
    brush.moveTo(x - wide * 0.4, base - tall - 4);
    brush.quadraticCurveTo(x - wide * 0.2, base - tall - tall * 0.2, x - wide * 0.1, base - tall - tall * 0.42);
    brush.lineTo(x + wide * 0.1, base - tall - tall * 0.42);
    brush.quadraticCurveTo(x + wide * 0.2, base - tall - tall * 0.2, x + wide * 0.4, base - tall - 4);
    brush.closePath();
    brush.strokeStyle = "#7a5a1a";
    brush.stroke();
    brush.fillStyle = "#b8862a";                    // the board along its eave
    brush.fillRect(x - wide * 0.41, base - tall - 7, wide * 0.82, 6);
    brush.beginPath();
    brush.moveTo(x, base - tall - tall * 0.42);
    brush.lineTo(x, base - tall - tall * 0.7);
    brush.lineWidth = 4;
    brush.strokeStyle = "#e0b23a";
    brush.stroke();
    brush.lineWidth = 2;
  } else {                                          // a flat roof: the edge of it stands out over the band
    brush.fillStyle = "#5a2020";
    brush.fillRect(x - wide * 0.455, base - tall - 6, wide * 0.91, 8);
    brush.fillStyle = "rgba(255, 230, 200, 0.25)";
    brush.fillRect(x - wide * 0.455, base - tall - 6, wide * 0.91, 2);
  }
}

// A stupa: steps, a white dome, a square, a gilded spire of rings, and a sun
// and moon at its top.
function bdStupa(brush, x, base, size) {
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.lineJoin = "round";
  brush.strokeStyle = "#5a3a2a";
  brush.lineWidth = 2;
  brush.fillStyle = "#f6f1e6";
  function shaded(left, right, top, bottom) {       // what is round, or has a side, is lit on one and in shade on the other
    var turn = brush.createLinearGradient(left, 0, right, 0);
    turn.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    turn.addColorStop(0.35, "rgba(255, 255, 255, 0)");
    turn.addColorStop(0.6, "rgba(90, 70, 50, 0)");
    turn.addColorStop(1, "rgba(90, 70, 50, 0.36)");
    brush.fillStyle = turn;
    brush.fillRect(left, top, right - left, bottom - top);
  }
  for (var step = 0; step < 3; step++) {            // the steps: each in shade along its foot
    brush.fillStyle = "#f6f1e6";
    brush.fillRect(-70 + step * 12, -26 - step * 20, 140 - step * 24, 22);
    shaded(-70 + step * 12, 70 - step * 12, -26 - step * 20, -4 - step * 20);
    brush.fillStyle = "rgba(90, 70, 50, 0.26)";
    brush.fillRect(-70 + step * 12, -11 - step * 20, 140 - step * 24, 7);
    brush.strokeRect(-70 + step * 12, -26 - step * 20, 140 - step * 24, 22);
  }
  brush.fillStyle = "#f6f1e6";
  brush.beginPath();                                // the dome, wider at the shoulder
  brush.moveTo(-36, -68);
  brush.bezierCurveTo(-62, -100, -52, -150, 0, -152);
  brush.bezierCurveTo(52, -150, 62, -100, 36, -68);
  brush.closePath();
  brush.fill();
  brush.save();
  brush.clip();
  shaded(-56, 56, -152, -68);
  brush.restore();
  brush.stroke();
  brush.fillStyle = "#f6f1e6";
  brush.fillRect(-16, -172, 32, 20);                // the square on the dome
  shaded(-16, 16, -172, -152);
  brush.strokeRect(-16, -172, 32, 20);
  brush.strokeStyle = "#7a5a1a";
  for (var ring = 0; ring < 7; ring++) {            // the spire: rings, each smaller
    brush.fillStyle = "#e0b23a";
    brush.fillRect(-13 + ring * 1.6, -180 - ring * 9, 26 - ring * 3.2, 8);
    shaded(-13 + ring * 1.6, 13 - ring * 1.6, -180 - ring * 9, -172 - ring * 9);
    brush.strokeRect(-13 + ring * 1.6, -180 - ring * 9, 26 - ring * 3.2, 8);
  }
  brush.fillStyle = "#e0b23a";
  brush.beginPath();
  brush.arc(0, -252, 8, 0, 7);
  brush.fill();
  brush.stroke();
  brush.restore();
}

// A line of flags from one point to another, sagging between them: blue,
// white, red, green and yellow, over and over.
function bdFlags(brush, x1, y1, x2, y2) {
  var colours = ["#3f6fb8", "#f6f1e6", "#c8382c", "#3f8f5a", "#f0c23a"], count = Math.round(Math.abs(x2 - x1) / 26);
  function at(u) { return [mix(x1, x2, u), mix(y1, y2, u) + Math.sin(u * Math.PI) * 34]; }
  brush.strokeStyle = "rgba(60, 40, 30, 0.8)";
  brush.lineWidth = 1.3;
  brush.beginPath();
  for (var n = 0; n <= count; n++) { var p = at(n / count); brush.lineTo(p[0], p[1]); }
  brush.stroke();
  for (n = 0; n < count; n++) {
    var a = at((n + 0.15) / count), b = at((n + 0.85) / count);
    brush.beginPath();
    brush.moveTo(a[0], a[1]);
    brush.lineTo(b[0], b[1]);
    brush.lineTo(b[0] - 1, b[1] + 20);
    brush.lineTo(a[0] + 1, a[1] + 20);
    brush.closePath();
    brush.fillStyle = colours[n % 5];
    brush.fill();
    brush.stroke();
  }
}

// A crane, standing: white, with a black neck, a red crown and long legs.
// "facing" is 1 or -1.
function bdCrane(brush, x, base, size, facing) {
  brush.save();
  brush.translate(x, base);
  brush.scale(size * facing, size);
  brush.lineJoin = "round";
  brush.lineCap = "round";
  brush.strokeStyle = "#3a3a44";
  brush.lineWidth = 2.4;
  brush.beginPath();                                // the legs
  brush.moveTo(-4, -52);
  brush.lineTo(-8, 0);
  brush.moveTo(6, -52);
  brush.lineTo(12, -26);
  brush.lineTo(8, 0);
  brush.stroke();
  brush.beginPath();                                // the body, and the dark feathers of the tail
  brush.ellipse(0, -66, 34, 20, -0.2, 0, 7);
  brush.fillStyle = "#fbfaf4";
  brush.fill();
  brush.lineWidth = 1.6;
  brush.stroke();
  brush.beginPath();
  brush.moveTo(-22, -70);
  brush.quadraticCurveTo(-52, -66, -50, -44);
  brush.quadraticCurveTo(-36, -52, -18, -56);
  brush.closePath();
  brush.fillStyle = "#2a2a34";
  brush.fill();
  brush.lineWidth = 7;                              // the neck, black, in an S
  brush.strokeStyle = "#2a2a34";
  brush.beginPath();
  brush.moveTo(24, -74);
  brush.bezierCurveTo(46, -92, 14, -118, 34, -140);
  brush.stroke();
  brush.beginPath();                                // the head, its red crown, and the bill
  brush.arc(36, -144, 8, 0, 7);
  brush.fillStyle = "#fbfaf4";
  brush.fill();
  brush.lineWidth = 1.4;
  brush.strokeStyle = "#3a3a44";
  brush.stroke();
  brush.beginPath();
  brush.arc(35, -150, 4, Math.PI, 0);
  brush.fillStyle = "#c8382c";
  brush.fill();
  brush.beginPath();
  brush.moveTo(43, -146);
  brush.lineTo(66, -140);
  brush.lineTo(43, -140);
  brush.closePath();
  brush.fillStyle = "#c9a23a";
  brush.fill();
  brush.stroke();
  brush.restore();
}

// A set of one ground, made from a set of many colours. Wherever the
// picture changes, at the edge of every shape, there is a line of the line's
// colour; everything else is the ground's colour, with a little of the
// picture's own colours left in it ("keep", 0 to 1), as a black thangka may
// be darkly tinted. A black or a red thangka has light lines on a dark
// ground; a gold one has dark lines on a light ground.
function bdOneGround(set, ground, line, keep) {
  var wide = set.width, high = set.height, brush = set.getContext("2d");
  var picture = brush.getImageData(0, 0, wide, high), data = picture.data, light = new Float32Array(wide * high), n;
  var g = parseInt(ground.slice(1), 16), l = parseInt(line.slice(1), 16);
  for (n = 0; n < light.length; n++) { light[n] = (data[n * 4] * 0.3 + data[n * 4 + 1] * 0.59 + data[n * 4 + 2] * 0.11) / 255; }
  for (var y = 1; y < high - 1; y++) {
    for (var x = 1; x < wide - 1; x++) {
      n = y * wide + x;
      var change = Math.abs(light[n + 1] - light[n - 1]) + Math.abs(light[n + wide] - light[n - wide]);
      var ink = clamp((change - 0.05) * 14);         // how much of a line this pixel is: nearly all or nearly none,
                                                    // so the lines are of one weight, as a painter's are
      for (var c = 0; c < 3; c++) {
        var shift = 16 - c * 8, flat = mix((g >> shift) & 255, data[n * 4 + c], keep);
        data[n * 4 + c] = mix(flat, (l >> shift) & 255, ink);
      }
    }
  }
  brush.putImageData(picture, 0, 0);
}

// ---------- what the seven places of the north are made of ----------
//
// The seven places of the north of Thailand are in the kit's own manner, the
// manner of the film in lanna.html, and not in the thangka's: a sky that is
// pale at the horizon, ranges of hills that are bluer the further off they
// stand, earth or grass to stand on, the kit's own house, temple, trees and
// palms, and at the end the wash of watercolour over the whole sheet. In
// every one of them, as in the twelve, people stand between y = 880 and 1040.

// The ground people stand on, from "top" to the foot of the sheet: "far" is
// its colour at the top and "near" at the foot.
function bdFloor(brush, top, far, near) {
  var fade = brush.createLinearGradient(0, top, 0, 1080);
  fade.addColorStop(0, far);
  fade.addColorStop(1, near);
  brush.fillStyle = fade;
  brush.fillRect(0, top, WIDE, 1080 - top);
}

// Tufts of grass scattered between two heights, with a small flower on one
// in three. A tuft is three blades, each a leaf of the kit's with its line.
function bdTufts(brush, top, bottom, count, seed) {
  var petals = ["#f28fa8", "#f4c542", "#ffffff", "#e86f6f"];
  for (var n = 0; n < count; n++) {
    var k = seed * 53 + n, x = dice(k) * WIDE, y = top + dice(k + 400) * (bottom - top);
    for (var blade = -1; blade <= 1; blade++) {
      brush.save();
      brush.translate(x, y);
      brush.rotate(blade * 0.5 + (dice(k + 800) - 0.5) * 0.3);
      paintLeaf(brush, 14 + 7 * dice(k * 3 + blade + 1200), 3.2, blade * 0.3, "#3f7f4a", "#a9d07c",
                "rgba(35, 65, 40, 0.75)", "rgba(0, 0, 0, 0)");
      brush.restore();
    }
    if (n % 3 === 0) { blossom(brush, x + 5, y - 22, 6.5, petals[n % 4]); }
  }
}

// Something of the kit's at another size, for what stands far off: "paint"
// draws it standing at (0, 0), and it is put at (x, base), "size" times as big.
function bdSized(brush, x, base, size, paint) {
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  paint();
  brush.restore();
}

// A line of trees far off: the tops of their crowns side by side along a
// height, each a pad of leaves of the kit's, no two the same size.
function bdTreeLine(brush, left, right, y, r, colour, seed) {
  for (var x = left, n = 0; x < right; n++) {
    var size = r * (0.75 + 0.5 * dice(seed * 41 + n));
    leafPad(brush, x, y - size * 0.45, size, colour, seed + n * 1.3);
    x += size * 1.2;
  }
}

// A field hut, where a farmer rests at noon: a floor on four posts, open on
// every side, under a roof of thatch.
function bdHut(brush, x, base, size) {
  function roof() {
    brush.beginPath();
    brush.moveTo(-126, -136);
    brush.lineTo(-62, -214);
    brush.lineTo(62, -214);
    brush.lineTo(126, -136);
    brush.closePath();
  }
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.fillStyle = "rgba(60, 40, 30, 0.2)";        // its shadow on the ground
  brush.beginPath();
  brush.ellipse(0, 3, 122, 9, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "#6f4a30";                      // the two posts at the back, darker
  brush.fillRect(-58, -150, 8, 150);
  brush.fillRect(50, -150, 8, 150);
  brush.fillStyle = "rgba(40, 24, 14, 0.42)";       // the shade under the roof, seen through the open sides
  brush.fillRect(-88, -150, 176, 30);
  brush.fillStyle = "#a8714a";                      // the floor, and the shade under it
  brush.fillRect(-94, -76, 188, 11);
  brush.fillStyle = "rgba(40, 24, 14, 0.4)";
  brush.fillRect(-94, -65, 188, 4);
  for (var side = -1; side <= 1; side += 2) {       // the two posts at the front, each lit down one side
    brush.fillStyle = "#9a6642";
    brush.fillRect(side * 84 - 5, -150, 10, 150);
    brush.fillStyle = "rgba(255, 235, 200, 0.32)";
    brush.fillRect(side * 84 - 5, -150, 3, 150);
  }
  roof();
  brush.fillStyle = "#b8924a";
  brush.fill();
  brush.save();
  brush.clip();
  roofTiles(brush, -126, 126, -214, -136, 13, "#cfa858", "point");   // thatch: bundles of straw that end in points
  brush.restore();
  roof();                                           // the roof's own shape again, for its line: the brush's path was the last bundle
  brush.strokeStyle = "rgba(70, 45, 25, 0.8)";
  brush.lineWidth = 2;
  brush.lineJoin = "round";
  brush.stroke();
  brush.restore();
}

// A long boat of the river, seen from the side: a hull that rises at both
// ends and a roof of matting over its middle. "facing" is 1 or -1: the way
// its prow points.
function bdBoat(brush, x, y, size, facing) {
  brush.save();
  brush.translate(x, y);
  brush.scale(size * facing, size);
  brush.lineJoin = "round";
  brush.fillStyle = "rgba(30, 70, 70, 0.3)";        // its shade on the water
  brush.beginPath();
  brush.ellipse(6, 13, 176, 8, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "rgba(40, 24, 14, 0.5)";        // the dark under the roof
  brush.fillRect(-58, -44, 116, 36);
  brush.fillStyle = "#8a6a3c";                      // the four posts of the roof
  for (var post = 0; post < 4; post++) { brush.fillRect(-62 + post * 40, -46, 5, 38); }
  brush.beginPath();                                // the roof: a mat bent over hoops
  brush.moveTo(-72, -42);
  brush.quadraticCurveTo(0, -78, 72, -42);
  brush.lineTo(72, -34);
  brush.quadraticCurveTo(0, -68, -72, -34);
  brush.closePath();
  brush.fillStyle = "#d9b56a";
  brush.fill();
  brush.strokeStyle = "rgba(70, 45, 25, 0.8)";
  brush.lineWidth = 1.6;
  brush.stroke();
  brush.beginPath();                                // the hull
  brush.moveTo(-190, -30);
  brush.quadraticCurveTo(-156, 8, -110, 11);
  brush.lineTo(118, 11);
  brush.quadraticCurveTo(172, 6, 206, -42);
  brush.quadraticCurveTo(164, -12, 118, -10);
  brush.lineTo(-116, -10);
  brush.quadraticCurveTo(-152, -11, -190, -30);
  brush.closePath();
  var wood = brush.createLinearGradient(0, -12, 0, 12);
  wood.addColorStop(0, "#a8714a");
  wood.addColorStop(1, "#6f4630");
  brush.fillStyle = wood;
  brush.fill();
  brush.strokeStyle = "rgba(50, 30, 18, 0.85)";
  brush.lineWidth = 2;
  brush.stroke();
  brush.strokeStyle = "#e0b23a";                    // a line of gold along its side
  brush.lineWidth = 2;
  brush.beginPath();
  brush.moveTo(-150, -2);
  brush.quadraticCurveTo(0, 5, 160, -8);
  brush.stroke();
  brush.strokeStyle = "rgba(255, 250, 235, 0.7)";   // and the line it draws on the water
  brush.lineWidth = 1.6;
  brush.beginPath();
  brush.moveTo(-210, 14);
  brush.quadraticCurveTo(-120, 20, -20, 15);
  brush.moveTo(40, 17);
  brush.quadraticCurveTo(130, 21, 220, 13);
  brush.stroke();
  brush.restore();
}

// A chedi of the north, gilded: a foot of white stone in three steps, a
// square body with a niche in it, a bell, a spire of rings and an umbrella
// at the top. It is lit down one side and in shade down the other.
function bdChedi(brush, x, base, size) {
  var gold = "#e0b23a", line = "rgba(110, 70, 20, 0.8)", n;
  function turn(left, top, wide, tall) {            // what is round or square is lit on the left and in shade on the right
    var lit = brush.createLinearGradient(left, 0, left + wide, 0);
    lit.addColorStop(0, "rgba(255, 248, 210, 0.4)");
    lit.addColorStop(0.4, "rgba(255, 248, 210, 0)");
    lit.addColorStop(0.6, "rgba(90, 50, 20, 0)");
    lit.addColorStop(1, "rgba(90, 50, 20, 0.4)");
    brush.fillStyle = lit;
    brush.fillRect(left, top, wide, tall);
  }
  function bell() {
    brush.moveTo(-32, -126);
    brush.bezierCurveTo(-30, -160, -12, -168, -9, -194);
    brush.lineTo(9, -194);
    brush.bezierCurveTo(12, -168, 30, -160, 32, -126);
    brush.closePath();
  }
  function foot() {                                 // the three steps of stone, as one shape
    brush.beginPath();
    for (n = 0; n < 3; n++) { brush.rect(-70 + n * 10, -16 - n * 14, 140 - n * 20, n ? 14 : 16); }
  }
  function gilt() {                                 // everything of gold, as one shape: the body, two mouldings, the bell, the rings and the needle
    brush.beginPath();
    brush.rect(-40, -110, 80, 66);
    brush.rect(-46, -118, 92, 8);
    brush.rect(-36, -126, 72, 8);
    bell();
    for (n = 0; n < 7; n++) { brush.rect(-10 + n * 1.2, -202 - n * 9, 20 - n * 2.4, 7); }
    brush.rect(-1.5, -296, 3, 36);
  }
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.lineJoin = "round";
  foot();
  brush.fillStyle = "#efe7d6";
  brush.fill();
  brush.fillStyle = "rgba(90, 70, 50, 0.3)";        // each step is in shade along its own foot
  for (n = 0; n < 3; n++) { brush.fillRect(-70 + n * 10, -4 - n * 14, 140 - n * 20, 4); }
  brush.save();                                     // the light falls only on the stone, not on the air beside it
  foot();
  brush.clip();
  turn(-70, -44, 140, 44);
  brush.restore();
  gilt();
  brush.fillStyle = gold;
  brush.fill();
  brush.fillStyle = "rgba(90, 50, 20, 0.35)";       // the shade under the moulding, and under every ring
  brush.fillRect(-46, -112, 92, 2.5);
  for (n = 0; n < 7; n++) { brush.fillRect(-10 + n * 1.2, -196.5 - n * 9, 20 - n * 2.4, 1.5); }
  brush.fillStyle = "#5a2a1c";                      // the niche: dark, under a pointed arch
  brush.beginPath();
  brush.moveTo(-12, -44);
  brush.lineTo(-12, -78);
  brush.quadraticCurveTo(-12, -92, 0, -100);
  brush.quadraticCurveTo(12, -92, 12, -78);
  brush.lineTo(12, -44);
  brush.closePath();
  brush.fill();
  brush.save();
  gilt();
  brush.clip();
  turn(-46, -300, 92, 260);
  brush.restore();
  brush.fillStyle = gold;                           // the umbrella on the needle
  for (n = 0; n < 3; n++) {
    brush.beginPath();
    brush.ellipse(0, -270 - n * 8, 9 - n * 2.4, 2.6, 0, 0, 7);
    brush.fill();
  }
  brush.strokeStyle = line;
  brush.lineWidth = 1.5;
  brush.strokeRect(-40, -110, 80, 66);
  brush.beginPath();
  bell();
  brush.stroke();
  brush.restore();
}

// A haystack: rice straw heaped round a pole after the harvest, in layers
// that lie over one another as a roof's do.
function bdHaystack(brush, x, base, size) {
  function heap() {
    brush.beginPath();
    brush.moveTo(-98, 0);
    brush.bezierCurveTo(-112, -92, -52, -190, 0, -198);
    brush.bezierCurveTo(52, -190, 112, -92, 98, 0);
    brush.closePath();
  }
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.fillStyle = "rgba(60, 40, 30, 0.2)";        // its shadow on the ground
  brush.beginPath();
  brush.ellipse(0, 3, 112, 10, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "#7a5236";                      // the pole, out of the top
  brush.fillRect(-4, -246, 8, 60);
  heap();
  brush.fillStyle = "#d9b860";
  brush.fill();
  brush.save();
  brush.clip();
  roofTiles(brush, -112, 112, -200, 0, 16, "#dcbc66", "point");
  brush.restore();
  heap();                                           // the heap's own shape again, for its line
  brush.strokeStyle = "rgba(90, 60, 25, 0.8)";
  brush.lineWidth = 2;
  brush.lineJoin = "round";
  brush.stroke();
  brush.restore();
}

// A paper lantern of the north, the kind that hangs: a body of eight sides,
// wider at its middle, a band of gold at its top and its foot, and three
// tails of paper under it. (x, y) is where its string is tied.
function bdKhom(brush, x, y, size, colour) {
  var pale = blend(colour, "#fff6e0", 0.45), n;
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  brush.lineJoin = "round";
  brush.strokeStyle = "rgba(70, 45, 25, 0.8)";
  brush.lineWidth = 1.4;
  brush.beginPath();                                // the string
  brush.moveTo(0, 0);
  brush.lineTo(0, 14);
  brush.stroke();
  for (n = -1; n <= 1; n++) {                       // the tails, the middle one longest: they are drawn first, behind the body
    var long = n ? 34 : 46;
    brush.fillStyle = n ? pale : colour;
    brush.beginPath();
    brush.moveTo(n * 13 - 4, 60);
    brush.lineTo(n * 13 + 4, 60);
    brush.lineTo(n * 13 + 4, 60 + long);
    brush.lineTo(n * 13, 60 + long - 7);
    brush.lineTo(n * 13 - 4, 60 + long);
    brush.closePath();
    brush.fill();
    brush.stroke();
  }
  brush.beginPath();                                // the body
  brush.moveTo(-11, 16);
  brush.lineTo(11, 16);
  brush.lineTo(24, 32);
  brush.lineTo(24, 46);
  brush.lineTo(11, 62);
  brush.lineTo(-11, 62);
  brush.lineTo(-24, 46);
  brush.lineTo(-24, 32);
  brush.closePath();
  brush.fillStyle = colour;
  brush.fill();
  brush.fillStyle = pale;                           // the side that faces us is paler
  brush.fillRect(-11, 16, 22, 46);
  brush.stroke();
  brush.beginPath();
  brush.moveTo(-11, 16);
  brush.lineTo(-11, 62);
  brush.moveTo(11, 16);
  brush.lineTo(11, 62);
  brush.stroke();
  brush.fillStyle = "#e0b23a";                      // gold at the top and the foot, and a cut of gold paper in the middle
  brush.fillRect(-12, 13, 24, 5);
  brush.fillRect(-12, 60, 24, 5);
  brush.beginPath();
  brush.moveTo(0, 30);
  brush.lineTo(7, 39);
  brush.lineTo(0, 48);
  brush.lineTo(-7, 39);
  brush.closePath();
  brush.fill();
  brush.restore();
}

// A market stall: a table of goods heaped in baskets, under a cloth in
// stripes held up on four bamboo poles. "wide" is how wide its table is and
// "cloth" the colour of the stripes; "seed" changes what it sells.
function bdStall(brush, x, base, wide, cloth, seed) {
  var half = wide / 2, fruits = ["#f08a2c", "#f4c542", "#8fc45a", "#d8423a", "#7a4a7a", "#c9a06a"], n, k;
  var count = Math.max(2, Math.round(wide / 84)), stripes = Math.max(4, Math.round(wide / 62) * 2);
  var roof = [[x - half - 4, base - 300], [x + half + 4, base - 300], [x + half + 30, base - 244], [x - half - 30, base - 244]];
  function across(u, low) {                         // a place along the cloth's far edge, or along its near one
    var a = low ? roof[3] : roof[0], b = low ? roof[2] : roof[1];
    return a[0] + (b[0] - a[0]) * u;
  }
  brush.lineJoin = "round";
  brush.fillStyle = "rgba(60, 40, 30, 0.2)";        // its shadow on the ground
  brush.beginPath();
  brush.ellipse(x, base + 4, half + 34, 12, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "#8a6a3c";                      // the two poles at the back
  brush.fillRect(x - half + 4, base - 290, 7, 290);
  brush.fillRect(x + half - 11, base - 290, 7, 290);
  brush.fillStyle = "rgba(60, 36, 22, 0.28)";       // the shade under the cloth
  brush.fillRect(x - half, base - 250, wide, 148);
  for (n = 0; n < count; n++) {                     // the goods: each basket heaped with one kind of fruit
    var bx = x - half + (n + 0.5) * wide / count, fruit = fruits[(seed * 2 + n) % fruits.length];
    for (var row = 3; row >= 0; row--) {
      for (k = 0; k < 4 - row; k++) {
        var fx = bx - (3 - row) * 7.5 + k * 15, fy = base - 142 - row * 12, tone = dice(seed * 61 + n * 13 + row * 5 + k) - 0.5;
        brush.fillStyle = blend(fruit, tone > 0 ? "#ffffff" : "#000000", Math.abs(tone) * 0.3);
        brush.beginPath();
        brush.arc(fx, fy, 8.5, 0, 7);
        brush.fill();
        brush.strokeStyle = "rgba(60, 30, 15, 0.55)";
        brush.lineWidth = 1;
        brush.stroke();
        brush.fillStyle = "rgba(255, 255, 255, 0.45)";   // the light on it
        brush.beginPath();
        brush.arc(fx - 3, fy - 3, 2.2, 0, 7);
        brush.fill();
      }
    }
    brush.beginPath();                              // the basket, in front of the lowest row
    brush.moveTo(bx - 34, base - 140);
    brush.lineTo(bx + 34, base - 140);
    brush.lineTo(bx + 26, base - 106);
    brush.lineTo(bx - 26, base - 106);
    brush.closePath();
    brush.fillStyle = "#c9a05a";
    brush.fill();
    brush.strokeStyle = "rgba(80, 50, 25, 0.8)";
    brush.lineWidth = 1.4;
    brush.stroke();
    brush.lineWidth = 1;                            // its weave
    brush.beginPath();
    for (k = -3; k <= 3; k++) {
      brush.moveTo(bx + k * 9.5, base - 140);
      brush.lineTo(bx + k * 7.4, base - 106);
    }
    brush.moveTo(bx - 31, base - 128);
    brush.lineTo(bx + 31, base - 128);
    brush.moveTo(bx - 28, base - 117);
    brush.lineTo(bx + 28, base - 117);
    brush.stroke();
  }
  brush.fillStyle = blend(cloth, "#fff6e0", 0.6);   // the table: a cloth down its front, in folds,
  brush.fillRect(x - half, base - 96, wide, 88);
  brush.strokeStyle = "rgba(90, 60, 40, 0.2)";
  brush.lineWidth = 2;
  brush.beginPath();
  for (k = 1; k * 26 < wide; k++) {
    brush.moveTo(x - half + k * 26, base - 92);
    brush.lineTo(x - half + k * 26 + (k % 2 ? 3 : -3), base - 10);
  }
  brush.stroke();
  brush.fillStyle = cloth;                          // with a band of the stripes' colour along its foot,
  brush.fillRect(x - half, base - 22, wide, 8);
  brush.fillStyle = "#b07a4e";                      // and its board, with the shade under it
  brush.fillRect(x - half - 6, base - 108, wide + 12, 12);
  brush.fillStyle = "rgba(40, 20, 12, 0.35)";
  brush.fillRect(x - half - 6, base - 96, wide + 12, 4);
  brush.fillStyle = "#7a5236";
  brush.fillRect(x - half + 8, base - 8, 9, 8);
  brush.fillRect(x + half - 17, base - 8, 9, 8);
  for (n = 0; n < stripes; n++) {                   // the cloth overhead, stripe by stripe,
    brush.beginPath();
    brush.moveTo(across(n / stripes), roof[0][1]);
    brush.lineTo(across((n + 1) / stripes), roof[0][1]);
    brush.lineTo(across((n + 1) / stripes, true), roof[2][1]);
    brush.lineTo(across(n / stripes, true), roof[2][1]);
    brush.closePath();
    brush.fillStyle = n % 2 ? "#fbf3e0" : cloth;
    brush.fill();
  }
  for (n = 0; n < stripes; n++) {                   // and the edge that hangs along its front, a round tongue to each stripe
    var left = across(n / stripes, true), right = across((n + 1) / stripes, true);
    brush.beginPath();
    brush.arc((left + right) / 2, roof[2][1], (right - left) / 2, 0, Math.PI);
    brush.closePath();
    brush.fillStyle = n % 2 ? "#fbf3e0" : cloth;
    brush.fill();
    brush.strokeStyle = "rgba(70, 40, 25, 0.6)";
    brush.lineWidth = 1.2;
    brush.stroke();
  }
  var shade = brush.createLinearGradient(0, roof[0][1], 0, roof[2][1]);   // the cloth is lighter far off and darker where it hangs
  shade.addColorStop(0, "rgba(255, 245, 220, 0.2)");
  shade.addColorStop(1, "rgba(40, 20, 10, 0.18)");
  brush.beginPath();
  brush.moveTo(roof[0][0], roof[0][1]);
  for (n = 1; n < 4; n++) { brush.lineTo(roof[n][0], roof[n][1]); }
  brush.closePath();
  brush.fillStyle = shade;
  brush.fill();
  brush.strokeStyle = "rgba(70, 40, 25, 0.7)";
  brush.lineWidth = 2;
  brush.stroke();
  for (n = -1; n <= 1; n += 2) {                    // the two poles at the front, lit down one side, with their joints
    var px = x + n * (half + 22) - 4;
    brush.fillStyle = "#b08a52";
    brush.fillRect(px, base - 246, 8, 246);
    brush.fillStyle = "rgba(255, 240, 200, 0.4)";
    brush.fillRect(px, base - 246, 2.5, 246);
    brush.fillStyle = "rgba(70, 45, 25, 0.6)";
    for (k = 1; k < 5; k++) { brush.fillRect(px, base - k * 52, 8, 2); }
  }
}

// ---------- the nineteen ----------

// The green ground every one of the thangka's twelve ends in, for people to stand on: two
// low hills and the field before them.
function bdGround(brush, colour, shape) {
  hills(brush, WIDE, 900, 70, shape, colour);
  hills(brush, WIDE, 1010, 60, shape + 1.3, blend(colour, "#2f5a2a", 0.25));
}

var BACKDROP_PAINTERS = {
  meadow: function (brush) {
    bdSky(brush, 520, "#234f9a", "#d6e8f4");
    bdSunMoon(brush);
    bdSnow(brush, 720, 520, 1500, 300, 1, 90);
    scrollCloud(brush, 420, 250, 0.9, "#f6f1e6", "#7f93b4");
    scrollCloud(brush, 1010, 200, 0.75, "#f4d6d6", "#a86a7a", "#b86a8a");
    hills(brush, WIDE, 600, 130, 0.4, "#5f9a4a");
    hills(brush, WIDE, 740, 130, 1.9, "#4f8a44");
    bdGround(brush, "#6aa350", 3.1);
    bdJewelTree(brush, 200, 800, 1.1, 1);
    for (var n = 0; n < 9; n++) { blossom(brush, 420 + n * 110 + 40 * dice(n), 800 + 60 * dice(n + 20), 9, n % 2 ? "#f28fa8" : "#f6d24a"); }
  },
  crags: function (brush) {
    bdSky(brush, 560, "#2a4f8f", "#f0d9b0", "#e88a5a");
    bdSunMoon(brush);
    bdSnow(brush, 760, 560, 700, 170, 2, 90);
    scrollCloud(brush, 700, 230, 0.8, "#cfe0d6", "#5f8a7a", "#4f8f7a");
    hills(brush, WIDE, 640, 110, 2.2, "#5f9a4a");
    bdCrags(brush, 250, 760, 1.25, 1, 4);
    bdCrags(brush, 1190, 780, 1.4, 2, 4);
    bdCascade(brush, 1150, 520, 780, 60);
    hills(brush, WIDE, 800, 80, 0.9, "#4f8a44");
    brush.save();                                   // a stream: a triangle of water that points down, between the hills
    brush.beginPath();
    brush.moveTo(980, 770);
    brush.lineTo(1320, 770);
    brush.quadraticCurveTo(900, 900, 560, 1080);
    brush.lineTo(240, 1080);
    brush.quadraticCurveTo(760, 880, 980, 770);
    brush.clip();
    bdWater(brush, 200, 760, 1200, 330);
    brush.restore();
    bdGround(brush, "#6aa350", 5.2);
    brush.save();
    brush.beginPath();
    brush.moveTo(700, 880);
    brush.quadraticCurveTo(560, 960, 430, 1080);
    brush.lineTo(170, 1080);
    brush.quadraticCurveTo(480, 950, 600, 880);
    brush.clip();
    bdWater(brush, 150, 870, 600, 220);
    brush.restore();
  },
  lake: function (brush) {
    bdSky(brush, 400, "#2f5fa8", "#dcebf4");
    bdSunMoon(brush);
    bdSnow(brush, 720, 400, 1500, 190, 3, 80);
    scrollCloud(brush, 720, 190, 0.7, "#f6f1e6", "#7f93b4");
    hills(brush, WIDE, 470, 80, 1.1, "#5f9a4a");
    bdWater(brush, 0, 470, WIDE, 440, "#2a6aa8");
    for (var n = 0; n < 5; n++) { lotusClump(brush, 150 + n * 290 + 60 * dice(n + 3), 640 + (n % 2) * 110, 0.8 + 0.2 * dice(n), n + 2, n % 2 ? "#f28fa8" : "#fff6ea"); }
    fish(brush, 560, 800, 1.1, 1, "#f0a23a");
    fish(brush, 900, 740, 0.9, -1, "#e8632c");
    bdGround(brush, "#6aa350", 0.7);
  },
  sky: function (brush) {
    bdSky(brush, 1080, "#16306e", "#bcd6ee");
    bdSunMoon(brush);
    bdLayers(brush, 500, 70, 440, ["#f0c9a8", "#e9a0b4", "#a8c8e8"], 1);
    bdLayers(brush, 960, 150, 400, ["#b8e0c8", "#f6dc8a", "#e9a0b4"], 2);
    bdRainbow(brush, [[-40, 520], [260, 360], [520, 470], [640, 330], [560, 230], [700, 190]], 54, 26);
    bdRainbow(brush, [[1500, 640], [1250, 520], [1040, 600], [900, 470], [1000, 390]], 60, 22, ["#d9453a", "#f6dc5a", "#3f6fb8"]);
    var clouds = [[300, 620, 1.0, "#f6f1e6", "#7f93b4", null], [820, 560, 0.8, "#f4d6d6", "#a86a7a", "#b86a8a"],
                  [1210, 720, 0.9, "#d6ecd9", "#5f8a7a", "#4f8f7a"], [560, 780, 0.7, "#f6e2b0", "#a8823a", "#d9a441"]];
    for (var n = 0; n < clouds.length; n++) {
      scrollCloud(brush, clouds[n][0], clouds[n][1], clouds[n][2], clouds[n][3], clouds[n][4], clouds[n][5] || undefined);
    }
    for (n = 0; n < 6; n++) {                       // a bank of cloud to stand on
      scrollCloud(brush, 120 + n * 250, 960 + (n % 2) * 40, 1.5, "#fbf8f0", "#7f93b4");
    }
  },
  midnight: function (brush) {
    BACKDROP_PAINTERS.meadow(brush);
    bdOneGround(brush.canvas, "#14100e", "#e9bd4a", 0.16);
  },
  vermilion: function (brush) {
    BACKDROP_PAINTERS.crags(brush);
    bdOneGround(brush.canvas, "#a8281c", "#f6d86a", 0.12);
  },
  golden: function (brush) {
    BACKDROP_PAINTERS.lake(brush);
    bdOneGround(brush.canvas, "#e3b64a", "#7a1c14", 0.14);
  },
  hermitage: function (brush) {
    bdSky(brush, 640, "#1f3f86", "#cfe2f2");
    bdSunMoon(brush, true);
    bdSnow(brush, 720, 640, 1700, 520, 4, 90);
    scrollCloud(brush, 980, 330, 0.8, "#f6f1e6", "#7f93b4");
    hills(brush, WIDE, 720, 110, 2.8, "#5f9a4a");
    bdCrags(brush, 430, 860, 1.5, 5, 5);
    brush.beginPath();                              // the mouth of a cave: dark, and bright with stones inside
    brush.ellipse(430, 800, 70, 58, 0, Math.PI, 0);
    brush.lineTo(500, 860);
    brush.lineTo(360, 860);
    brush.closePath();
    brush.fillStyle = "#1c1a2a";
    brush.fill();
    brush.strokeStyle = "#e0b23a";
    brush.lineWidth = 2;
    brush.stroke();
    brush.fillStyle = "#f6dc8a";
    for (var n = 0; n < 14; n++) {
      brush.beginPath();
      brush.arc(380 + 100 * dice(n + 2), 770 + 70 * dice(n + 30), 2, 0, 7);
      brush.fill();
    }
    bdCascade(brush, 760, 600, 860, 50);
    bdGround(brush, "#6aa350", 1.6);
    bdJewelTree(brush, 1150, 900, 1.2, 4, "#3f6a44");
  },
  longlife: function (brush) {
    bdSky(brush, 560, "#2f5fa8", "#e6eef0");
    bdSunMoon(brush);
    bdSnow(brush, 1040, 560, 800, 200, 5, 90);
    scrollCloud(brush, 820, 240, 0.8, "#f6f1e6", "#7f93b4");
    hills(brush, WIDE, 640, 110, 0.2, "#5f9a4a");
    bdCrags(brush, 240, 880, 1.6, 7, 4);            // the rock of long life,
    bdCascade(brush, 330, 560, 860, 56);            // the water of long life,
    hills(brush, WIDE, 800, 80, 3.4, "#4f8a44");
    bdWater(brush, 180, 850, 520, 60);
    bdGround(brush, "#6aa350", 2.4);
    bdJewelTree(brush, 1090, 900, 1.9, 6, "#2f7a4a");   // and the tree of long life; the cranes are the birds of long life
    bdCrane(brush, 400, 930, 1.0, 1);
    bdCrane(brush, 250, 950, 0.9, -1);
  },
  garden: function (brush) {
    bdSky(brush, 560, "#2a4f9a", "#e9e2f0", "#f0c9d6");
    bdSunMoon(brush);
    bdRainbow(brush, [[520, 560], [540, 300], [720, 190], [900, 300], [920, 560]], 44, 44);
    bdLayers(brush, 440, 150, 360, ["#f6dc8a", "#e9a0b4"], 3);
    bdLayers(brush, 1010, 150, 360, ["#b8e0c8", "#a8c8e8"], 4);
    hills(brush, WIDE, 620, 90, 1.4, "#5f9a4a");
    bdHall(brush, 720, 690, 330, 190, true);
    bdGround(brush, "#6aa350", 4.4);
    for (var n = 0; n < 4; n++) { bdJewelTree(brush, 150 + n * 380 - (n > 1 ? 0 : 0), 880 + (n % 2) * 30, 1.15, n + 8, n % 2 ? "#3f8a6a" : "#2f7a4a"); }
    brush.save();                                   // a round pond, with two lotus on it
    brush.beginPath();
    brush.ellipse(1130, 990, 190, 52, 0, 0, 7);
    brush.clip();
    bdWater(brush, 930, 930, 400, 120, "#2f7fb8");
    brush.restore();
    brush.beginPath();
    brush.ellipse(1130, 990, 190, 52, 0, 0, 7);
    brush.strokeStyle = "#e0b23a";
    brush.lineWidth = 3;
    brush.stroke();
    lotus(brush, 1070, 990, 0.7, "#f28fa8");
    lotus(brush, 1200, 1000, 0.6, "#fff6ea");
  },
  monastery: function (brush) {
    bdSky(brush, 540, "#234f9a", "#d6e8f4");
    bdSunMoon(brush);
    bdSnow(brush, 420, 540, 900, 230, 6, 110);
    scrollCloud(brush, 1080, 210, 0.85, "#f6f1e6", "#7f93b4");
    hills(brush, WIDE, 640, 150, 3.9, "#5f9a4a");
    bdHall(brush, 600, 560, 240, 120, true);        // a monastery up its hill: halls one above another
    bdHall(brush, 470, 650, 220, 110);
    bdHall(brush, 740, 660, 260, 120);
    hills(brush, WIDE, 780, 100, 1.2, "#4f8a44");
    bdStupa(brush, 1180, 800, 1.1);
    bdFlags(brush, 880, 600, 1180, 530);
    bdFlags(brush, 1180, 530, 1420, 640);
    bdGround(brush, "#6aa350", 2.0);
  },
  valley: function (brush) {
    bdSky(brush, 600, "#b9cfdc", "#eef0e8");        // the open, pale manner: a wide sky with little in it
    bdSunMoon(brush);
    bdSnow(brush, 980, 600, 620, 130, 8, 70);
    scrollCloud(brush, 420, 300, 0.6, "#fbf8f0", "#9fb0c0");
    hills(brush, WIDE, 660, 60, 0.6, "#a8c49a");
    hills(brush, WIDE, 760, 70, 2.5, "#98bc8a");
    brush.save();                                   // a river that widens as it comes
    brush.beginPath();
    brush.moveTo(1040, 690);
    brush.lineTo(1090, 690);
    brush.bezierCurveTo(900, 800, 1150, 880, 900, 1080);
    brush.lineTo(420, 1080);
    brush.bezierCurveTo(900, 900, 760, 800, 1040, 690);
    brush.clip();
    bdWater(brush, 400, 680, 760, 410, "#6f9fc0");
    brush.restore();
    bdJewelTree(brush, 190, 900, 0.9, 9, "#6f9a6a");
    tasselTree(brush, 1290, 860, 0.8, "#4f6a4a", 3);
  },
  // the seven places of the north of Thailand
  paddy: function (brush) {
    var far = [720, 560], rows = [652, 676, 706, 746, 800, 872], greens = ["#b6d96a", "#9fcf5f", "#c9de7a", "#8cc45a", "#a8d46a"], n, b;
    function at(edge, foot, y) {                    // where a bund that reaches "edge" at the height "foot" is at the height y: every bund points at one place far off
      return far[0] + (edge - far[0]) * (y - far[1]) / (foot - far[1]);
    }
    bdSky(brush, 660, "#74bfc9", "#f4ecd2");
    scrollCloud(brush, 340, 200, 1.0, "#f6f1e6", "rgba(120, 130, 150, 0.6)");
    scrollCloud(brush, 1060, 290, 0.8, "#f6f1e6", "rgba(120, 130, 150, 0.6)");
    hills(brush, WIDE, 656, 300, 0.6, "#a9c8d8");
    hills(brush, WIDE, 664, 180, 2.2, "#8fbfae");
    for (b = 0; b < rows.length - 1; b++) {         // the fields, a row at a time, the furthest first: fewer and wider as they come nearer
      var top = rows[b], foot = rows[b + 1], count = Math.round(10 - b * 1.5), edges = [];
      for (n = 0; n <= count; n++) { edges.push(-260 + (WIDE + 520) * (n + (dice(b * 31 + n) - 0.5) * 0.4) / count); }
      for (n = 0; n < count; n++) {
        var kind = dice(b * 17 + n * 5 + 2), wet = kind < 0.16;   // one field in six is under water, and one in seven is ripe
        brush.beginPath();
        brush.moveTo(at(edges[n], foot, top), top);
        brush.lineTo(at(edges[n + 1], foot, top), top);
        brush.lineTo(edges[n + 1], foot);
        brush.lineTo(edges[n], foot);
        brush.closePath();
        brush.fillStyle = wet ? "#bfe3dc" : kind > 0.86 ? "#e3cf6a" : greens[(b * 3 + n) % greens.length];
        brush.fill();
        brush.strokeStyle = wet ? "rgba(60, 130, 90, 0.55)" : "rgba(60, 110, 50, 0.3)";   // the rows the rice was planted in
        brush.lineWidth = 1 + b * 0.3;
        brush.beginPath();
        for (var row = 1; row < 7; row++) {
          var e = edges[n] + (edges[n + 1] - edges[n]) * row / 7;
          brush.moveTo(at(e, foot, top), top);
          brush.lineTo(e, foot);
        }
        brush.stroke();
      }
      brush.strokeStyle = "#b08a58";                // the bunds between the fields, and the one along the row's far side
      brush.lineWidth = 2 + b * 1.4;
      brush.beginPath();
      for (n = 0; n <= count; n++) {
        brush.moveTo(at(edges[n], foot, top), top);
        brush.lineTo(edges[n], foot);
      }
      brush.moveTo(0, top);
      brush.lineTo(WIDE, top);
      brush.stroke();
    }
    bdSized(brush, 250, 748, 0.5, function () { palm(brush, 0, 0, 380); });   // palms on the bunds, small with distance
    bdSized(brush, 330, 716, 0.34, function () { palm(brush, 0, 0, 360); });
    bdSized(brush, 1330, 800, 0.8, function () { palm(brush, 0, 0, 400); });
    bdHut(brush, 980, 800, 0.8);
    bdFloor(brush, 866, "#efd9b8", "#dcb58c");      // the wide bund at the front, to stand on
    brush.fillStyle = "#b08a58";
    brush.fillRect(0, 866, WIDE, 5);
    bdTufts(brush, 874, 900, 40, 1);
    bdTufts(brush, 1010, 1070, 30, 2);
    wash(brush, WIDE);
  },
  river: function (brush) {
    var n, x;
    bdSky(brush, 640, "#84cbc6", "#f6edd4");
    scrollCloud(brush, 430, 170, 0.95, "#f6f1e6", "rgba(120, 130, 150, 0.6)");
    scrollCloud(brush, 1130, 260, 0.8, "#f6f1e6", "rgba(120, 130, 150, 0.6)");
    hills(brush, WIDE, 650, 330, 1.3, "#a9cfc9");
    hills(brush, WIDE, 656, 210, 3.0, "#8dbfa9");
    brush.fillStyle = "#86b87a";                    // the far bank: a strip of land, with trees, palms and a house on it
    brush.fillRect(0, 640, WIDE, 34);
    bdTreeLine(brush, -20, 540, 656, 38, "#3f7c4c", 3);
    bdTreeLine(brush, 1140, 1480, 656, 42, "#3f7c4c", 5);
    bdSized(brush, 640, 668, 0.36, function () { palm(brush, 0, 0, 380); });
    bdSized(brush, 820, 670, 0.4, function () { house(brush, 0, 0, 1); });
    bdSized(brush, 1000, 668, 0.42, function () { palm(brush, 0, 0, 340); });
    bdSized(brush, 1062, 668, 0.3, function () { banana(brush, 0, 0); });
    var water = brush.createLinearGradient(0, 668, 0, 872);   // the river: pale far off, deep near
    water.addColorStop(0, "#b4dcc8");
    water.addColorStop(1, "#3f8f8c");
    brush.fillStyle = water;
    brush.fillRect(0, 668, WIDE, 204);
    brush.fillStyle = "rgba(40, 90, 70, 0.28)";     // the far bank's shade on the water
    brush.fillRect(0, 668, WIDE, 14);
    waves(brush, 0, 678, WIDE, 190, "rgba(255, 250, 230, 0.55)");
    bdBoat(brush, 1130, 712, 0.5, -1);
    bdBoat(brush, 480, 774, 1, 1);
    brush.beginPath();                              // the near bank: grass, its edge a little uneven
    brush.moveTo(0, 1080);
    for (x = 0; x <= WIDE; x += 20) { brush.lineTo(x, 862 + 7 * Math.sin(x * 0.012) + 4 * Math.sin(x * 0.031)); }
    brush.lineTo(WIDE, 1080);
    brush.closePath();
    var grass = brush.createLinearGradient(0, 860, 0, 1080);
    grass.addColorStop(0, "#a9cf7a");
    grass.addColorStop(1, "#7fae58");
    brush.fillStyle = grass;
    brush.fill();
    brush.strokeStyle = "rgba(40, 80, 50, 0.7)";
    brush.lineWidth = 2.2;
    brush.beginPath();
    for (x = 0; x <= WIDE; x += 20) { brush.lineTo(x, 862 + 7 * Math.sin(x * 0.012) + 4 * Math.sin(x * 0.031)); }
    brush.stroke();
    tree(brush, 150, 892, 1.0);
    for (n = 0; n < 5; n++) { fanPlant(brush, [330, 420, 1090, 1310, 1400][n], 882, 0.75 + 0.3 * dice(n + 5), "#4f8a4a", n + 2); }   // reeds at the water's edge
    lotusClump(brush, 1200, 874, 0.6, 3, "#ee7f9c");
    bdTufts(brush, 890, 912, 26, 3);
    bdTufts(brush, 1005, 1070, 34, 4);
    wash(brush, WIDE);
  },
  doi: function (brush) {
    var n;
    function mountain() {                           // one great mountain: a long back, a top, and a shoulder where the temple stands
      brush.beginPath();
      brush.moveTo(-20, 620);
      brush.bezierCurveTo(140, 520, 300, 300, 520, 236);
      brush.bezierCurveTo(650, 204, 770, 336, 900, 372);
      brush.quadraticCurveTo(990, 392, 1070, 396);
      brush.bezierCurveTo(1210, 420, 1330, 560, 1460, 604);
      brush.lineTo(1460, 820);
      brush.lineTo(-20, 820);
      brush.closePath();
    }
    bdSky(brush, 700, "#5fa9c9", "#fbe9cc", "#f8d9b0");
    scrollCloud(brush, 1180, 150, 0.8, "#fbf6ea", "rgba(120, 130, 150, 0.55)");
    hills(brush, WIDE, 690, 380, 2.0, "#b4cfd9");
    mountain();
    var green = brush.createLinearGradient(0, 230, 0, 790);   // paler toward its foot, where the mist lies
    green.addColorStop(0, "#3f8562");
    green.addColorStop(1, "#93c2a0");
    brush.fillStyle = green;
    brush.fill();
    brush.save();
    brush.clip();
    brush.lineWidth = 1.6;                          // the forest on it: the tops of its trees, smaller the higher they stand
    brush.lineCap = "round";
    for (n = 0; n < 1000; n++) {
      var x = dice(n + 11) * WIDE, y = 232 + dice(n + 1900) * 540, r = 5 + (y - 232) / 540 * 11;
      brush.strokeStyle = dice(n + 3300) < 0.55 ? "rgba(24, 70, 48, 0.42)" : "rgba(200, 230, 180, 0.3)";
      brush.beginPath();
      brush.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.9);
      brush.stroke();
    }
    var spurs = [[228, 420, 60], [365, 314, 250], [520, 240, 470], [616, 244, 700], [710, 284, 900], [900, 376, 1120], [1269, 497, 1400]];
    for (n = 0; n < spurs.length; n++) {            // its spurs: each runs down from the crest, light along its back and in shade on the side away from the sun
      var sx = spurs[n][0], sy = spurs[n][1], ex = spurs[n][2], bend = (sx + ex) / 2 + 40;
      brush.beginPath();
      brush.moveTo(sx, sy);
      brush.quadraticCurveTo(bend, (sy + 800) / 2 - 60, ex, 800);
      brush.lineTo(ex + 170, 800);
      brush.quadraticCurveTo(bend + 90, (sy + 800) / 2 - 10, sx, sy);
      brush.closePath();
      brush.fillStyle = "rgba(20, 60, 50, 0.17)";
      brush.fill();
      brush.strokeStyle = "rgba(225, 242, 195, 0.26)";
      brush.lineWidth = 2.2;
      brush.beginPath();
      brush.moveTo(sx, sy);
      brush.quadraticCurveTo(bend, (sy + 800) / 2 - 60, ex, 800);
      brush.stroke();
    }
    var side = brush.createLinearGradient(0, 0, WIDE, 0);   // the morning sun is at the left: the slopes that face right are in shade
    side.addColorStop(0, "rgba(255, 240, 190, 0.16)");
    side.addColorStop(0.4, "rgba(20, 50, 60, 0)");
    side.addColorStop(1, "rgba(20, 50, 60, 0.3)");
    brush.fillStyle = side;
    brush.fillRect(0, 200, WIDE, 640);
    brush.strokeStyle = "rgba(240, 226, 196, 0.8)";  // the road up to the temple, in and out of the trees
    brush.lineWidth = 3;
    brush.beginPath();
    brush.moveTo(1004, 404);
    brush.bezierCurveTo(900, 460, 1090, 500, 960, 560);
    brush.bezierCurveTo(870, 610, 1010, 660, 930, 720);
    brush.stroke();
    brush.restore();
    mountain();                                     // the mountain's own shape again, for its line
    brush.strokeStyle = "rgba(30, 70, 50, 0.75)";
    brush.lineWidth = 2.4;
    brush.lineJoin = "round";
    brush.stroke();
    brush.fillStyle = "#f2ead8";                    // the temple on its shoulder: a white wall, a hall with two red roofs, and the gold chedi
    brush.fillRect(940, 388, 164, 18);
    brush.fillStyle = "rgba(90, 70, 50, 0.3)";
    brush.fillRect(940, 400, 164, 6);
    brush.fillStyle = "#f6efe0";
    brush.fillRect(958, 368, 56, 22);
    brush.strokeStyle = "#e0b23a";
    brush.lineWidth = 2.5;
    for (n = 0; n < 2; n++) {
      brush.fillStyle = n ? "#d9573a" : "#c8452f";
      brush.beginPath();
      brush.moveTo(948 + n * 14, 370 - n * 16);
      brush.lineTo(986, 338 - n * 18);
      brush.lineTo(1024 - n * 14, 370 - n * 16);
      brush.closePath();
      brush.fill();
      brush.stroke();
    }
    bdChedi(brush, 1060, 392, 0.42);
    bdTreeLine(brush, 926, 1120, 416, 15, "#3f7c4c", 13);   // the trees that stand before its wall
    for (n = 0; n < 3; n++) {                       // the mist: bands of white across the mountain's foot, the lowest the thickest
      var top = 560 + n * 62, mist = brush.createLinearGradient(0, top, 0, top + 120);
      mist.addColorStop(0, "rgba(255, 255, 255, 0)");
      mist.addColorStop(0.5, "rgba(255, 255, 255, " + (0.5 + n * 0.14) + ")");
      mist.addColorStop(1, "rgba(255, 255, 255, 0)");
      brush.fillStyle = mist;
      brush.fillRect(0, top, WIDE, 120);
    }
    scrollCloud(brush, 330, 600, 1.1, "#ffffff", "rgba(130, 150, 170, 0.5)");   // and two clouds that lie on it
    scrollCloud(brush, 1210, 660, 0.9, "#ffffff", "rgba(130, 150, 170, 0.5)");
    hills(brush, WIDE, 820, 130, 3.3, "#6fa868");
    tree(brush, 170, 846, 0.72);
    tree(brush, 1300, 856, 0.8);
    hills(brush, WIDE, 900, 80, 0.9, "#8fc47a");
    for (n = 0; n < 5; n++) { flowerSpray(brush, [70, 420, 640, 1010, 1390][n], 884 + 8 * (n % 2), 0.55 + 0.15 * (n % 3), ["#f28fa8", "#f4c542", "#e86f6f", "#ee7f9c", "#f08a5c"][n], n + 4); }
    bdTufts(brush, 884, 910, 26, 5);
    bdTufts(brush, 1005, 1070, 34, 6);
    wash(brush, WIDE);
  },
  waterfall: function (brush) {
    var n, x, y;
    function strata(left, right, top, foot, seed) { // the layers of the rock: lines that lie nearly level, and break
      brush.strokeStyle = "rgba(50, 44, 38, 0.35)";
      brush.lineWidth = 1.6;
      brush.lineCap = "round";
      brush.beginPath();
      for (y = top + 20; y < foot; y += 30) {
        for (x = left + 80 * dice(seed + y); x < right; x += 70 + 110 * dice(seed + x + y)) {
          var long = 60 + 130 * dice(seed * 3 + x - y);
          brush.moveTo(x, y + 6 * dice(x + seed));
          brush.quadraticCurveTo(x + long / 2, y + 8 * dice(x * 3 + seed) - 4, Math.min(right, x + long), y + 6 * dice(x * 7 + seed));
        }
      }
      brush.stroke();
    }
    function buttress(points, colour, seed) {       // a mass of rock that stands forward of the cliff, lit on the left
      brush.beginPath();
      brush.moveTo(points[0][0], points[0][1]);
      for (n = 1; n < points.length; n++) { brush.lineTo(points[n][0], points[n][1]); }
      brush.closePath();
      var rock = brush.createLinearGradient(points[0][0], 0, points[2][0], 0);
      rock.addColorStop(0, blend(colour, "#fff6e0", 0.3));
      rock.addColorStop(1, blend(colour, "#2a2420", 0.42));
      brush.fillStyle = rock;
      brush.fill();
      brush.save();
      brush.clip();
      strata(Math.min(points[0][0], points[1][0]), Math.max(points[2][0], points[3][0]), 260, 860, seed);
      brush.restore();
      brush.strokeStyle = "rgba(40, 34, 30, 0.85)";
      brush.lineWidth = 2.6;
      brush.lineJoin = "round";
      brush.stroke();
    }
    function fall(cx, top, foot, wide, seed) {      // water that falls: wider as it goes, its two sides uneven, its lines following it down, white where it lands
      var side, k;
      function edge(at, which) {                    // where a side of it is at the height "at"
        var u = (at - top) / (foot - top);
        return cx + which * (wide * (0.34 + 0.2 * u) + 2.5 * Math.sin(at * 0.17 + seed + which * 2));
      }
      brush.beginPath();
      brush.moveTo(edge(top, -1), top);
      for (y = top; y <= foot; y += 12) { brush.lineTo(edge(y, -1), y); }
      for (y = foot; y >= top; y -= 12) { brush.lineTo(edge(y, 1), y); }
      brush.closePath();
      var fade = brush.createLinearGradient(0, top, 0, foot);
      fade.addColorStop(0, "#a9cde8");
      fade.addColorStop(1, "#ffffff");
      brush.fillStyle = fade;
      brush.fill();
      brush.strokeStyle = "rgba(60, 110, 160, 0.7)";
      brush.lineWidth = 1.6;
      brush.stroke();
      brush.lineCap = "round";
      for (k = 1; k < 9; k++) {                     // its lines: some white and wide, some blue and fine, none of them whole
        var u = k / 9, from = top + 10 + 50 * dice(seed * 7 + k), to = foot - 10 - 60 * dice(seed * 11 + k);
        brush.strokeStyle = k % 3 ? "rgba(70, 120, 180, 0.5)" : "rgba(255, 255, 255, 0.85)";
        brush.lineWidth = k % 3 ? 1.2 : 3.4;
        brush.beginPath();
        for (y = from; y <= to; y += 12) { brush.lineTo(edge(y, -1) + (edge(y, 1) - edge(y, -1)) * u, y); }
        brush.stroke();
      }
      brush.fillStyle = "rgba(255, 255, 255, 0.8)";  // the lip it rolls over,
      brush.beginPath();
      brush.ellipse(cx, top + 3, wide * 0.34, 5, 0, 0, 7);
      brush.fill();
      brush.save();                                 // and the spray where it lands: wide, and low
      brush.translate(cx, foot);
      brush.scale(1, 0.4);
      side = brush.createRadialGradient(0, 0, 0, 0, 0, wide * 0.7);
      side.addColorStop(0, "rgba(255, 255, 255, 0.75)");
      side.addColorStop(1, "rgba(255, 255, 255, 0)");
      brush.fillStyle = side;
      brush.fillRect(-wide * 0.7, -wide * 0.7, wide * 1.4, wide * 1.4);
      brush.restore();
      foam(brush, cx - wide * 0.75, foot - 16, wide * 1.5, 30, "#7f9fc0", seed);
    }
    bdSky(brush, 380, "#74bfc9", "#eef2dc");
    hills(brush, WIDE, 400, 240, 0.9, "#6fa58a");
    var rock = brush.createLinearGradient(0, 300, 0, 850);   // the cliff, darker toward its foot
    rock.addColorStop(0, "#a9a090");
    rock.addColorStop(1, "#6f685e");
    brush.fillStyle = rock;
    brush.fillRect(0, 316, WIDE, 540);
    strata(0, WIDE, 316, 850, 1);
    brush.fillStyle = "rgba(255, 246, 224, 0.3)";   // a ledge half way down: light on its top, moss along it, and dark beneath
    brush.fillRect(300, 558, 840, 10);
    brush.fillStyle = "#9fbf7a";
    brush.fillRect(300, 555, 840, 5);
    brush.fillStyle = "rgba(30, 24, 20, 0.38)";
    brush.fillRect(300, 568, 840, 18);
    bdTreeLine(brush, -30, 1480, 322, 62, "#2f6a48", 7);   // the forest along the top of the cliff
    bdFloor(brush, 846, "#b9d68a", "#8fb866");      // the mossy ground
    pond(brush, 350, 786, 740, 96);                 // the pool the water falls into
    fall(706, 326, 562, 150, 1);                    // the fall, in two leaps
    fall(716, 566, 828, 230, 4);
    for (n = 0; n < 2; n++) {                       // the shade each mass of rock throws on the cliff beside it
      var from = n ? 1100 : 330, shade = brush.createLinearGradient(from, 0, from + (n ? -80 : 80), 0);
      shade.addColorStop(0, "rgba(30, 24, 20, 0.34)");
      shade.addColorStop(1, "rgba(30, 24, 20, 0)");
      brush.fillStyle = shade;
      brush.fillRect(n ? 1020 : 330, 330, 80, 520);
    }
    buttress([[-10, 290], [250, 330], [330, 600], [300, 870], [-10, 870]], "#7d6f5c", 3);
    buttress([[1180, 320], [1450, 280], [1450, 870], [1130, 870], [1100, 610]], "#74685a", 5);
    bdTreeLine(brush, -30, 290, 318, 56, "#3f7c4c", 9);
    bdTreeLine(brush, 1170, 1480, 312, 58, "#3f7c4c", 11);
    brush.strokeStyle = "#3f7c4c";                  // creepers that hang down the rock, each with its leaves
    brush.lineWidth = 2.4;
    for (n = 0; n < 7; n++) {
      var vx = [60, 170, 262, 420, 1010, 1240, 1380][n], long = 120 + 150 * dice(n + 60);
      brush.beginPath();
      brush.moveTo(vx, 330);
      brush.quadraticCurveTo(vx + 16, 330 + long / 2, vx - 6, 330 + long);
      brush.stroke();
      for (var leaf = 1; leaf < 6; leaf++) {
        var u = leaf / 6;
        brush.save();
        brush.translate(vx + 44 * u * (1 - u) - 6 * u, 330 + long * u);
        brush.rotate((leaf % 2 ? 1 : -1) * 1.2 + Math.PI);
        paintLeaf(brush, 20, 6, 0.2, "#2f6a48", "#8fc47a", "rgba(28, 58, 36, 0.8)", "rgba(0, 0, 0, 0)");
        brush.restore();
      }
    }
    for (n = 0; n < 6; n++) { fanPlant(brush, [250, 318, 1118, 1190, 420, 1010][n], [600, 606, 612, 606, 566, 566][n], 0.7 + 0.2 * dice(n + 9), "#4f8a4a", n + 3); }   // ferns on the ledges
    rocks(brush, 316, 892, 0.85, "#8a8478", 2);
    rocks(brush, 1128, 888, 0.9, "#7f7a70", 4);
    banana(brush, 1290, 884);
    tree(brush, 110, 890, 0.9);
    for (n = 0; n < 4; n++) { fanPlant(brush, [230, 1220, 1390, 40][n], 896, 0.9 + 0.3 * dice(n + 20), "#4f8a4a", n + 13); }
    bdTufts(brush, 890, 912, 22, 7);
    bdTufts(brush, 1005, 1070, 34, 8);
    wash(brush, WIDE);
  },
  village: function (brush) {
    var flowers = ["#f08a5c", "#ee7f9c", "#f4c542", "#e86f6f", "#7f9fd8"];
    bdSky(brush, 760, "#8ccfc6", "#f4ecd2");
    clouds(brush, WIDE);
    hills(brush, WIDE, 720, 420, 1.0, "#a9cfc9");
    hills(brush, WIDE, 780, 300, 2.6, "#8dbfa9");
    hills(brush, WIDE, 840, 170, 4.4, "#79ad84");
    bdFloor(brush, 850, "#f3dcc0", "#e2b895");
    house(brush, 742, 838, 0.52);                   // houses along the lane, the furthest first
    tree(brush, 560, 846, 0.85);
    palm(brush, 60, 850, 360);
    house(brush, 300, 850, 1.1);
    banana(brush, 528, 852);
    bdHaystack(brush, 930, 850, 0.8);
    house(brush, 1180, 846, 0.85);
    palm(brush, 1385, 850, 300);
    banana(brush, 1020, 852);
    flowerSpray(brush, 640, 850, 0.6, flowers[1], 3);
    flowerSpray(brush, 1420, 850, 0.7, flowers[0], 6);
    flowerSpray(brush, 20, 850, 0.55, flowers[2], 4);
    pathside(brush, WIDE);
    wash(brush, WIDE);
  },
  market: function (brush) {
    var cloths = ["#d8423a", "#2f7d5c", "#e9a23a", "#4a6797"], papers = ["#e86f6f", "#f4c542", "#8fc47a", "#f28fa8", "#8fc0cf", "#f08a5c"], n;
    bdSky(brush, 760, "#8ccfc6", "#f4ecd2");
    clouds(brush, WIDE);
    hills(brush, WIDE, 760, 380, 1.9, "#a9cfc9");
    hills(brush, WIDE, 820, 250, 3.7, "#8dbfa9");
    bdFloor(brush, 846, "#f1dcc0", "#dfb894");
    house(brush, 210, 842, 0.78);                   // the village behind the stalls
    palm(brush, 470, 848, 400);
    tree(brush, 740, 846, 0.95);
    house(brush, 1240, 842, 0.72);
    palm(brush, 1010, 848, 440);
    for (n = 0; n < 4; n++) { bdStall(brush, 196 + n * 350, 868 + (n % 2) * 8, 250, cloths[n], n + 1); }
    brush.fillStyle = "#8a6a3c";                    // a rope of paper lanterns over the market, from one pole to another
    brush.fillRect(18, 330, 8, 540);
    brush.fillRect(1414, 330, 8, 540);
    brush.strokeStyle = "rgba(70, 45, 25, 0.85)";
    brush.lineWidth = 2;
    brush.beginPath();
    brush.moveTo(22, 336);
    brush.quadraticCurveTo(720, 520, 1418, 336);
    brush.stroke();
    for (n = 0; n < 9; n++) {
      var u = (n + 0.5) / 9;
      bdKhom(brush, 22 + 1396 * u, 336 + 184 * 2 * u * (1 - u), 1.15, papers[n % papers.length]);
    }
    bdTufts(brush, 1030, 1070, 16, 9);
    wash(brush, WIDE);
  },
  yipeng: function (brush) {
    var land = document.createElement("canvas"), ink, drawing = pen, hour = clock, lights = [], n, x, y, glow;
    function flame(fx, fy, size) {                  // a small flame, and its light
      glow = brush.createRadialGradient(fx, fy, 0, fx, fy, size * 7);
      glow.addColorStop(0, "rgba(255, 200, 100, 0.55)");
      glow.addColorStop(1, "rgba(255, 180, 80, 0)");
      brush.fillStyle = glow;
      brush.fillRect(fx - size * 7, fy - size * 7, size * 14, size * 14);
      brush.fillStyle = "#fff0b0";
      brush.beginPath();
      brush.moveTo(fx - size, fy);
      brush.quadraticCurveTo(fx - size * 1.1, fy - size * 1.6, fx, fy - size * 3);
      brush.quadraticCurveTo(fx + size * 1.1, fy - size * 1.6, fx + size, fy);
      brush.closePath();
      brush.fill();
    }
    function shimmer(sx, sy, tall) {                // a light on the water: short strokes one under another, narrower and fainter as they go down
      for (var k = 0; k < 5; k++) {
        brush.fillStyle = "rgba(255, 190, 100, " + (0.4 - k * 0.07) + ")";
        brush.fillRect(sx - 7 + k + 8 * (dice(sx + k) - 0.5), sy + k * tall / 5, 14 - k * 2, 1.6);
      }
    }
    bdSky(brush, 760, "#0c1432", "#2a3a72", "#3f4a86");
    for (n = 0; n < 170; n++) {                     // the stars
      brush.fillStyle = "rgba(255, 250, 220, " + (0.35 + 0.65 * dice(n + 70)) + ")";
      brush.beginPath();
      brush.arc(dice(n) * WIDE, dice(n + 90) * 640, 0.8 + dice(n + 20) * 1.6, 0, 7);
      brush.fill();
    }
    glow = brush.createRadialGradient(250, 190, 40, 250, 190, 250);   // the full moon of the twelfth month, and the light round it
    glow.addColorStop(0, "rgba(255, 244, 200, 0.42)");
    glow.addColorStop(1, "rgba(255, 244, 200, 0)");
    brush.fillStyle = glow;
    brush.fillRect(0, 0, 520, 460);
    brush.fillStyle = "#fdf6d8";
    brush.beginPath();
    brush.arc(250, 190, 66, 0, 7);
    brush.fill();
    brush.fillStyle = "rgba(150, 150, 170, 0.16)";  // its seas, each a shape of its own
    for (n = 0; n < 3; n++) {
      brush.beginPath();
      brush.ellipse([232, 272, 246][n], [172, 206, 222][n], [22, 16, 9][n], [16, 12, 7][n], n ? 0 : 0.4, 0, 7);
      brush.fill();
    }
    land.width = WIDE;                              // the land is painted as by day on a sheet of its own, and then night falls on it:
    land.height = 1080;                             // everything on that sheet keeps its shape and loses its light
    ink = land.getContext("2d");
    hills(ink, WIDE, 740, 330, 1.2, "#8fb8b0");
    hills(ink, WIDE, 790, 220, 3.1, "#79a58a");
    ink.fillStyle = "#7fae6a";
    ink.fillRect(0, 780, WIDE, 20);
    tree(ink, 330, 796, 0.8);
    palm(ink, 520, 796, 330);
    temple(ink, 1010, 796);
    var water = ink.createLinearGradient(0, 796, 0, 872);
    water.addColorStop(0, "#9fd0c8");
    water.addColorStop(1, "#3f8f8c");
    ink.fillStyle = water;
    ink.fillRect(0, 796, WIDE, 76);
    waves(ink, 0, 800, WIDE, 70, "rgba(255, 250, 230, 0.6)");
    bdFloor(ink, 868, "#8fbf6a", "#6f9a50");
    bdTufts(ink, 890, 912, 24, 11);
    bdTufts(ink, 1005, 1070, 30, 12);
    ink.globalCompositeOperation = "source-atop";
    ink.fillStyle = "rgba(12, 20, 56, 0.74)";
    ink.fillRect(0, 0, WIDE, 1080);
    ink.globalCompositeOperation = "source-over";
    brush.drawImage(land, 0, 0);
    glow = brush.createRadialGradient(1010, 700, 0, 1010, 700, 330);   // the temple is lit from within and below
    glow.addColorStop(0, "rgba(255, 200, 110, 0.4)");
    glow.addColorStop(1, "rgba(255, 190, 100, 0)");
    brush.fillStyle = glow;
    brush.fillRect(680, 370, 660, 440);
    for (n = 0; n < 34; n++) {                      // the lanterns in the sky: where each is, and how near
      lights.push([40 + dice(n + 400) * 1360, 70 + dice(n + 500) * 560, 12 + 46 * dice(n + 600) * dice(n + 650)]);
    }
    lights.sort(function (a, b) { return a[2] - b[2]; });
    pen = brush;                                    // the kit's lantern draws on the film's sheet, "pen", at the second "clock":
    clock = 0;                                      // for the length of this it is given the set's brush, and one second, so that the set is the same every time
    for (n = 0; n < lights.length; n++) { lantern(lights[n][0], lights[n][1], lights[n][2]); }
    pen = drawing;
    clock = hour;
    for (n = 0; n < lights.length; n += 4) {        // their light on the river
      shimmer(lights[n][0], 804 + 30 * dice(n + 900), 30);
    }
    for (n = 0; n < 8; n++) {                       // krathongs on the water: a cup of leaves, a flower, a candle
      x = 90 + n * 172 + 60 * dice(n + 700);
      y = 812 + 44 * dice(n + 720);
      brush.fillStyle = "#2f5a3a";
      brush.beginPath();
      brush.ellipse(x, y, 17, 5, 0, 0, 7);
      brush.fill();
      brush.fillStyle = "#c86f8a";
      for (var petal = -1; petal <= 1; petal++) {
        brush.beginPath();
        brush.moveTo(x + petal * 9 - 5, y);
        brush.lineTo(x + petal * 12, y - 12);
        brush.lineTo(x + petal * 9 + 5, y);
        brush.closePath();
        brush.fill();
      }
      flame(x, y - 12, 3);
      shimmer(x, y + 7, 22);
    }
    for (n = 0; n < 22; n++) {                      // and a row of small clay lamps along the bank
      x = 30 + n * 66 + 16 * dice(n + 800);
      brush.fillStyle = "#6a4630";
      brush.beginPath();
      brush.ellipse(x, 878, 9, 4, 0, 0, Math.PI);
      brush.fill();
      flame(x, 877, 2.4);
    }
    brush.globalAlpha = 0.5;                        // the wash of watercolour, half as strong: on a dark sheet its pale strokes show more
    wash(brush, WIDE);
    brush.globalAlpha = 1;
  }
};

// The set of that name, painted the first time it is asked for.
function backdrop(name) {
  if (!BACKDROP_PAINTERS[name]) {
    warn('backdrops.js: there is no backdrop called "' + name + '". They are: '
         + BACKDROPS.map(function (row) { return row[0]; }).join(", "));
    name = "meadow";
  }
  if (!BACKDROP_SETS[name]) {
    var set = document.createElement("canvas");
    set.width = WIDE;
    set.height = 1080;
    BACKDROP_PAINTERS[name](set.getContext("2d"));
    BACKDROP_SETS[name] = set;
  }
  return BACKDROP_SETS[name];
}
