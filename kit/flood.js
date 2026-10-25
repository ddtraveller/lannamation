// flood.js - water rising over a town, for the Lanna cartoon kit: the floods that drove Mangrai out of Wiang Kum Kam,
// and Yonok going under the water of Wiang Nong Lom. Load it after oldcartoon.js and pieces.js (what floats is
// pieces.js's krabung()):
//
//     <script src="oldcartoon.js"></script>
//     <script src="pieces.js"></script>
//     <script src="flood.js"></script>
//
// and call flood(brush, t, look) after the scene's land (it lays what stands above the water into the water, upside
// down) and before (or after) its people. Everything is worked out from the second alone.
// The owner's pick, 2026-10-25, of three waters: "Try a combination of B and C where the water isn't quite so busy":
// B's flat still water, brown with the silt, the sky's pale light along its far edge and a few long ripple lines;
// with C's zones (the thangka's water, as bdWater draws it), only a few wavy pale lines, far apart and faint. Flood
// water is still where it stands among houses, so nothing in it is busy; what moves is the ripples, what floats, and
// the rain's rings on it (rain.js rainSplashes, given the water's box).

// flood(brush, t, look): the water over the part of the sheet below look.level.
//   level       y of the water's surface (a number; or rising: give from, to and the seconds rise [start, end])
//   x, wide     the part of the sheet (0 and WIDE unless told)
//   colour      the water, "#rrggbb" (a silty brown unless told)
//   floating    true: a basket, a coop and a log afloat, drifting
//   reflect     0 to 1: how strongly what stands above the water shows in it, upside down and broken by the ripples
//               (0.25 unless told; drawn from what brush already holds, so draw the flood after the scene's land)
// Returns the level now (y), so a scene can sink its own pieces. Draws with brush.
function flood(brush, t, look) {
  var x0 = look.x || 0, wide = look.wide || WIDE, level = look.level;
  if (look.rise) { level = mix(look.from, look.to, (1 - Math.cos(between(t, look.rise[0], look.rise[1]) * Math.PI)) / 2); }
  var c = look.colour || "#8a6a42", deep = blend(c, "#2a1e12", 0.45), pale = blend(c, "#e8e0cc", 0.55);
  brush.save();
  var body = brush.createLinearGradient(0, level, 0, 1080);
  body.addColorStop(0, pale);                       // the sky's light along the far edge, then the silt's brown, deeper near
  body.addColorStop(0.08, c);
  body.addColorStop(1, deep);
  var mirror = look.reflect === undefined ? 0.25 : look.reflect, above = Math.min(level, 1080 - level);
  if (mirror > 0 && above > 4) {                    // what stands above the water, upside down, kept before the water covers it
    var keep = document.createElement("canvas");
    keep.width = wide; keep.height = above;
    keep.getContext("2d").drawImage(brush.canvas, x0, level - above, wide, above, 0, 0, wide, above);
  }
  brush.fillStyle = body;
  brush.fillRect(x0, level, wide, 1080 - level);
  brush.beginPath(); brush.rect(x0, level, wide, 1080 - level); brush.clip();
  if (keep) {                                       // laid on the water in slices that sway with the ripples, fading with depth
    for (var row = 0; row < above; row += 6) {
      var sway = 5 * Math.sin(row * 0.09 + t * 1.6) * (0.3 + row / above);
      brush.globalAlpha = mirror * (1 - row / above);
      brush.drawImage(keep, 0, above - row - 6, wide, 6, x0 + sway, level + row, wide, 6);
    }
    brush.globalAlpha = 1;
  }
  for (var z = 1; z <= 4; z++) {                    // C's zones: a few wavy pale lines, far apart, the nearer ones wider
    var y = level + Math.pow(z / 4.5, 1.6) * (1080 - level), amp = 3 + 3 * z;
    brush.strokeStyle = "rgba(236, 228, 206, " + (0.16 + 0.04 * z) + ")";
    brush.lineWidth = 1 + 0.5 * z;
    brush.beginPath();
    for (var x = x0; x <= x0 + wide; x += 12) {
      var wy = y + amp * Math.sin((x + t * (6 + z * 3)) * (0.012 / z) + z * 1.7);
      if (x === x0) { brush.moveTo(x, wy); } else { brush.lineTo(x, wy); }
    }
    brush.stroke();
  }
  brush.strokeStyle = "rgba(236, 228, 206, 0.28)";  // B's long ripple lines, drifting slowly
  brush.lineWidth = 1.4;
  brush.beginPath();
  for (var n = 0; n < 10; n++) {
    var ry = level + 16 + Math.pow(n / 10, 1.5) * (1080 - level - 30), long = 50 + n * 14, rx = x0 + ((dice(n * 3.3) * wide + t * (8 + n * 2)) % (wide + long)) - long;
    brush.moveTo(rx, ry); brush.lineTo(rx + long, ry);
  }
  brush.stroke();
  brush.restore();
  brush.strokeStyle = "rgba(244, 238, 222, 0.7)";   // the water's edge against what stands in it: a thin bright line
  brush.lineWidth = 1.6;
  brush.beginPath(); brush.moveTo(x0, level); brush.lineTo(x0 + wide, level); brush.stroke();
  if (look.floating) { floodFloaters(brush, x0, wide, level, t); }
  return level;
}

// What floats: a basket, a chicken coop and a log, small, bobbing and drifting slowly.
function floodFloaters(brush, x0, wide, level, t) {
  [[0.2, 0, "basket"], [0.55, 1, "coop"], [0.82, 2, "log"]].forEach(function (f) {
    var x = x0 + f[0] * wide + 14 * Math.sin(t * 0.3 + f[1]), y = level + 26 + 4 * Math.sin(t * 1.4 + f[1] * 2), tilt = 0.06 * Math.sin(t * 1.1 + f[1]);
    brush.save();
    brush.translate(x, y); brush.rotate(tilt); brush.scale(0.55, 0.55);
    if (f[2] === "basket") { krabung(brush, 0, 0, 0.8); }
    else if (f[2] === "coop") {
      brush.fillStyle = "#b08850"; brush.strokeStyle = "#4a3420"; brush.lineWidth = 2;
      brush.beginPath(); brush.rect(-50, -40, 100, 44); brush.fill(); brush.stroke();
      brush.beginPath(); brush.moveTo(-58, -40); brush.lineTo(0, -70); brush.lineTo(58, -40); brush.closePath(); brush.fillStyle = "#8a6438"; brush.fill(); brush.stroke();
      brush.beginPath(); for (var k = -40; k <= 40; k += 13) { brush.moveTo(k, -36); brush.lineTo(k, 0); } brush.stroke();
    } else {
      brush.fillStyle = "#7a5634"; brush.strokeStyle = "#3a2614"; brush.lineWidth = 2;
      brush.beginPath(); brush.ellipse(0, -6, 80, 11, 0, 0, 7); brush.fill(); brush.stroke();
      brush.beginPath(); brush.ellipse(78, -6, 6, 10, 0, 0, 7); brush.fillStyle = "#c9a070"; brush.fill(); brush.stroke();
    }
    brush.restore();
    brush.fillStyle = "rgba(244, 238, 222, 0.5)";
    brush.fillRect(x - 30, y + 1, 60, 1.5);
  });
}
