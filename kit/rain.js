// rain.js - rain, for the Lanna cartoon kit, from a light shower to the monsoon. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="rain.js"></script>
//
// and call rain(brush, t, look) over a scene, after its sky, hills and ground and before (or after) its people, or
// the parts on their own, far to near: rainVeil() for the haze over the far land, rainShafts() for the rain
// falling far off, rainSheets() for the sheets the wind drives across the land between, rainStreaks() for the rain
// close by, rainSplashes() for the drops on puddles and water and the spray off the ground. One number, look.heavy,
// runs every part from a light shower (0) to the monsoon (1); rainAt(heavy) says what each part does at it.
// Everything is worked out from the second alone, as the kit's water is: no frame depends on the one before.
//
// Modelled on photographs of rain in the north (owner, 2026-10-25: "model them rather then guess ... beautiful,
// realistic and true to the location"; "Just rain alone is probably worth it's own .js"; and, of the first model,
// "The rain looks good but mild. Think about distance and the way sheets of rain look coming down. Add a slider from
// mild to monsoon rain"). What they show, as rules, far to near:
//   1. Far off, rain is not drops. It is a shaft: a soft grey curtain hanging from the flat underside of a dark
//      cloud to the ground, paler than the land behind it, finely streaked up and down, thinning at its edges and
//      toward the ground; it drifts with the wind and leans a little with it (JohnoPolo, "Mountain Rain Squall", the
//      valleys south of Chiang Rai City, CC BY-SA 3.0). In a monsoon the shafts run together into one grey wall.
//   2. What is behind the rain goes pale and blue-grey: the far hills lose their colour and their edges first; in a
//      monsoon the far land is gone, and the middle distance with it.
//   3. Between far and near, a heavy rain comes in sheets: the wind drives bands of thicker rain across the land, each
//      a slanted veil of streaks that sweeps along with the gust and thins away behind it, the next coming on.
//   4. Close by, rain is fine pale streaks, each the length a drop falls while the eye takes it in; they show
//      against what is dark (trees, a doorway, a dark sky) and nearly vanish against a bright sky, so they are laid
//      on as light (screen), never painted over. Near drops are long and quick, far ones short and slow; the gusts
//      thicken and thin them as they pass.
//   5. Where drops meet water or a puddle, each throws up a small ring that widens and is gone in a third of a
//      second; on hard ground a fine spray.
// No outline here: rain is the one thing in the kit that has none (the kit's rule 1 is for things, not air).

// The names a rain's look may have (rain() warns about any other):
//   heavy     0 to 1: how hard it rains, from a light shower (0) through a steady rain (0.5) to the monsoon (1)
//   wind      -1 to 1: which way it leans and drifts, and how far (0.25 unless told); a heavy rain leans further
//   x, wide   the part of the sheet it falls on (0 and WIDE unless told)
//   cloud     y of the cloud's underside, where far shafts begin (220 unless told)
//   far       y of the far land the shafts reach (the horizon, 640 unless told)
//   ground    y where the near rain lands (900 unless told)
//   shafts    how many far shafts (as rainAt() says unless told; 0 for none)
//   water     [x, y, wide, tall] of water or puddles the drops ring on; or a list of such boxes
//   tone      the rain's colour, "#rrggbb" (a grey-blue unless told)
//   seed      a number, so two rains are not alike
var RAIN_KEYS = {};

["heavy", "wind", "x", "wide", "cloud", "far", "ground", "shafts", "water", "tone", "seed"].forEach(function (name) { RAIN_KEYS[name] = true; });

// rainAt(heavy): what each part of the rain does at a heaviness from 0 (a shower) to 1 (the monsoon). The numbers
// a scene may read too (to dim its own far pieces, or lean its trees). Draws nothing.
//   veil     how much the far land is washed out (0 to 1); mist: how much the middle distance is
//   shafts   how many far shafts, and how wide and strong (spread, strength)
//   sheets   how many sheets cross the land between, and how thick (sheetStrength), and how fast they go (pace)
//   drops    how many near streaks, their length and their strength
//   lean     how much further the wind leans the rain
// e.g. rainAt(0.8).drops
function rainAt(heavy) {
  var h = clamp(heavy);
  return {veil: 0.12 + 0.6 * Math.pow(h, 1.2), mist: 0.3 * h * h, shafts: Math.round(2 + 3 * h), spread: 1 + 1.6 * h,
          strength: 0.1 + 0.12 * h, sheets: Math.round(1 + 4 * h), sheetStrength: 0.06 + 0.5 * Math.pow(h, 1.2),
          pace: 50 + 240 * h, drops: Math.round(90 + 1150 * Math.pow(h, 1.5)), long: 22 + 60 * h, dropStrength: 0.07 + 0.2 * h,
          lean: 0.6 + 0.9 * h};
}

// The "r, g, b" of a "#rrggbb", for a colour laid on at an alpha of its own.
function rainRGB(hex) {
  var n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(", ");
}

// The look's numbers, with what is left out filled in. Draws nothing.
function rainLook(look) {
  var heavy = look.heavy === undefined ? 0.5 : clamp(look.heavy), at = rainAt(heavy);
  return {x: look.x !== undefined ? look.x : 0, wide: look.wide || WIDE, cloud: look.cloud || 220, far: look.far || 640,
          ground: look.ground || 900, heavy: heavy, at: at, wind: (look.wind === undefined ? 0.25 : look.wind) * at.lean,
          seed: look.seed || 0, tone: look.tone || "#c8d0d8", shafts: look.shafts === undefined ? at.shafts : look.shafts, water: look.water};
}

// rainVeil(brush, look): rule 2, the haze rain lays over the land behind it: from the cloud down to the far land,
// most at the horizon; in a heavy rain a second haze over the middle distance down to the ground. look as rain's.
// Returns nothing: it draws with brush.
// e.g. rainVeil(pen, {cloud: 240, far: 640, heavy: 0.7});
function rainVeil(brush, look) {
  var r = rainLook(look), rgb = rainRGB(r.tone);
  brush.save();
  var g = brush.createLinearGradient(0, r.cloud, 0, r.far + 60);
  g.addColorStop(0, "rgba(" + rgb + ", 0)");
  g.addColorStop(0.75, "rgba(" + rgb + ", " + 0.4 * r.at.veil + ")");
  g.addColorStop(1, "rgba(" + rgb + ", " + 0.25 * r.at.veil + ")");
  brush.fillStyle = g;
  brush.fillRect(r.x, r.cloud, r.wide, r.far + 60 - r.cloud);
  if (r.at.mist > 0.005) {
    var m = brush.createLinearGradient(0, r.far - 40, 0, r.ground);
    m.addColorStop(0, "rgba(" + rgb + ", " + r.at.mist + ")");
    m.addColorStop(1, "rgba(" + rgb + ", " + 0.3 * r.at.mist + ")");
    brush.fillStyle = m;
    brush.fillRect(r.x, r.far - 40, r.wide, r.ground - r.far + 40);
  }
  brush.restore();
}

// rainShafts(brush, t, look): rule 1, the far shafts. Each is a curtain from the cloud to the far land, built of many
// thin strokes, densest in its middle and fading at its edges, at its top and at its foot; it leans with the wind
// and drifts with it, and its strength breathes slowly. Heavier rain gives more and wider shafts, until they merge.
// Returns nothing: it draws with brush.
// e.g. rainShafts(pen, t, {cloud: 240, far: 640, heavy: 0.7});
function rainShafts(brush, t, look) {
  var r = rainLook(look), rgb = rainRGB(look.tone || "#dde3e8"), top = r.cloud, foot = r.far;   // a shaft is paler than the land behind it
  brush.save();
  brush.lineCap = "round";
  for (var s = 0; s < r.shafts; s++) {
    var d = dice(r.seed * 17 + s * 3.7), span = r.wide * (0.1 + 0.14 * dice(r.seed + s * 5.1)) * r.at.spread;
    var mid = r.x + ((d * 1.3 * r.wide + t * 9 * r.wind * (1 + s * 0.3)) % (r.wide + span)) - span / 2;   // drifting with the wind
    var breathe = 0.75 + 0.25 * Math.sin(t * 0.35 + s * 2.1), lean = r.wind * 0.35 * (foot - top);
    for (var k = 0; k < 90; k++) {                  // the strokes of the curtain
      var u = dice(r.seed * 31 + s * 101 + k * 0.37), x = mid + (u - 0.5) * span, edge = 1 - Math.pow(Math.abs(u - 0.5) * 2, 2);
      var shimmer = 0.6 + 0.4 * Math.sin(t * 1.3 + k * 0.7);   // the curtain's fine streaks come and go
      var a = r.at.strength * breathe * edge * shimmer, start = top + 20 * dice(k + s), end = foot - 30 * dice(k * 1.7 + s);
      var g = brush.createLinearGradient(0, start, 0, end);
      g.addColorStop(0, "rgba(" + rgb + ", 0)");
      g.addColorStop(0.18, "rgba(" + rgb + ", " + a + ")");
      g.addColorStop(0.7, "rgba(" + rgb + ", " + a * 0.8 + ")");
      g.addColorStop(1, "rgba(" + rgb + ", 0)");
      brush.strokeStyle = g;
      brush.lineWidth = (2 + 6 * dice(k * 2.3 + s)) * (0.8 + 0.4 * r.at.spread);
      brush.beginPath();
      brush.moveTo(x, start);
      brush.lineTo(x + lean, end);
      brush.stroke();
    }
  }
  brush.restore();
}

// rainSheets(brush, t, look): rule 3, the sheets of rain the wind drives across the land between far and near. Each
// sheet is a band of fine slanted streaks from the top of the sheet to the ground, falling as dashes, sweeping along
// with the gust at rainAt().pace; when one has gone by, the next comes on. It is not a straight band (owner,
// 2026-10-25: "Imagine snake like waves traveling through that rain as it falls in uneven sheets"): a wave runs down
// through it and bends its streaks like a snake's body, a slower one makes it wider and narrower from top to foot so
// its edges are uneven, and bright and dim waves run down it as the rain in it thickens and thins.
// Returns nothing: it draws with brush.
// e.g. rainSheets(pen, t, {heavy: 0.9, wind: 0.4, cloud: 300, ground: 900});
var RAIN_SHEET_LEVELS = 6;                          // the strengths a sheet's streaks are drawn at, faint to full

function rainSheets(brush, t, look) {
  var r = rainLook(look), rgb = rainRGB(r.tone), top = -40, foot = r.ground + 40, slant = r.wind * 0.45;   // a sheet passes near as well as far: the whole height
  var way = r.wind < 0 ? -1 : 1, travel = r.wide + 900, rows = 14, step = (foot - top) / rows;
  brush.save();
  brush.globalCompositeOperation = "screen";
  brush.lineCap = "butt";
  brush.lineWidth = 1.2;
  for (var s = 0; s < r.at.sheets; s++) {
    var seed = r.seed * 41 + s * 7.3, wide = 260 + 420 * dice(seed), pace = r.at.pace * (0.7 + 0.6 * dice(seed + 1));
    var along = (dice(seed + 2) * travel + t * pace) % travel - 450;   // where the sheet's middle is, sweeping across
    var mid = way > 0 ? r.x + along : r.x + r.wide - along;
    var strength = r.at.sheetStrength * (0.6 + 0.4 * Math.sin(t * 0.6 + s * 1.9)) * (0.7 + 0.3 * dice(seed + 3));
    var snake = 14 + 26 * r.heavy, phase = dice(seed + 4) * 6.3;   // a long, gentle sway: the streaks lean only a little
    var bend = function (y) {                         // the snake's wave down through the sheet, travelling down as it falls
      return snake * Math.sin(y * 0.0045 - t * 1.8 + phase) + 0.25 * snake * Math.sin(y * 0.011 + t * 1.1 + phase * 2);
    };
    var girth = function (y) { return 0.65 + 0.35 * Math.sin(y * 0.004 - t * 0.9 + phase * 3); };   // wider and narrower: uneven edges
    var thick = function (y, x) { return 0.5 + 0.5 * Math.sin(y * 0.009 + x * 0.006 - t * 3.1 + phase); };   // bright and dim waves snaking down it on a slant
    var paths = [];
    for (var n = 0; n < RAIN_SHEET_LEVELS * 4; n++) { paths.push(new Path2D()); }
    var gap = 5 - 2 * r.heavy;
    for (var u = -0.5; u <= 0.5; u += gap / wide) {   // each streak line, across the sheet
      var jitter = 4 * dice(seed + u * 97), dash = Math.floor(dice(seed + u * 131) * 4);
      for (var row = 0; row < rows; row++) {
        var y0 = top + row * step, y1 = y0 + step, ym = (y0 + y1) / 2;
        var edge = 1 - Math.pow(Math.min(1, Math.abs(u) * 2 / girth(ym)), 2);   // soft at the uneven edges
        if (edge <= 0) { continue; }
        var level = Math.min(RAIN_SHEET_LEVELS - 1, Math.floor(edge * thick(ym, u * wide) * RAIN_SHEET_LEVELS));
        var x0 = mid + u * wide + jitter + bend(y0) - slant * (foot - y0), x1 = mid + u * wide + jitter + bend(y1) - slant * (foot - y1);
        paths[level * 4 + dash].moveTo(x0, y0);
        paths[level * 4 + dash].lineTo(x1, y1);
      }
    }
    for (n = 0; n < paths.length; n++) {            // each strength, in four dash groups out of step, so no rows line up
      var lev = Math.floor(n / 4), gs = seed + (n % 4) * 1.37;
      brush.strokeStyle = "rgba(" + rgb + ", " + strength * (lev + 1) / RAIN_SHEET_LEVELS + ")";
      brush.setLineDash([(22 + 34 * r.heavy) * (0.7 + 0.6 * dice(gs)), 10 + 14 * dice(gs + 0.5)]);
      brush.lineDashOffset = -t * (700 + 500 * r.heavy) * (0.85 + 0.3 * dice(gs + 0.9)) - 200 * dice(gs + 1.3);
      brush.stroke(paths[n]);
    }
  }
  brush.setLineDash([]);
  brush.restore();
}

// rainStreaks(brush, t, look): rule 4, the rain close by: three depths of fine streaks, far ones short, faint and
// slow, near ones long and quick, slanting with the wind, laid on as light so they show against what is dark; a gust
// passing thickens them and thins them again. Returns nothing: it draws with brush.
// e.g. rainStreaks(pen, t, {heavy: 0.8, wind: 0.3, ground: 900});
function rainStreaks(brush, t, look) {
  var r = rainLook(look), rgb = rainRGB(r.tone), slant = r.wind * 0.32;
  brush.save();
  brush.globalCompositeOperation = "screen";
  brush.lineCap = "round";
  // [how near, speed, length, width, focus]: the nearest drops pass so close they are out of focus, wide, soft and
  // faint, and slower to the eye (owner, 2026-10-25: "make the upclose heavy rain a bit slower and more indistinct")
  [[0.3, 520, 0.4, 0.8, 1], [0.6, 900, 0.65, 1.1, 1], [1, 1000, 1, 3.4, 0]].forEach(function (depth, k) {
    var near = depth[0], speed = depth[1] * (0.8 + 0.3 * r.heavy), long = r.at.long * depth[2], count = Math.round(r.at.drops * (1.3 - near));
    var floor = mix(r.ground - 220, r.ground + 40, near), a = r.at.dropStrength * mix(0.6, 1.2, near) * (depth[4] ? 1 : 0.45);
    var path = new Path2D();
    for (var n = 0; n < count; n++) {
      var i = r.seed * 1000 + k * 10000 + n;
      var fall = (dice(i * 0.71) * (floor + 200) + t * speed * (0.85 + 0.3 * dice(i * 1.9))) % (floor + 200) - 200;
      var x = r.x + (dice(i * 1.3) * (r.wide + 400) - 200 + slant * fall + t * speed * slant * 0.2) % (r.wide + 400);
      if (x < r.x - 60 || x > r.x + r.wide + 60 || fall > floor) { continue; }
      var gust = 0.5 + 0.5 * Math.sin((x - t * r.at.pace) * 0.004 + k + 1.2 * Math.sin(fall * 0.006 - t * 2));   // a gust, its front snaking, thickens the rain as it passes
      if (dice(i * 2.9) > 0.45 + 0.55 * (1 - r.heavy * 0.7 * (1 - gust))) { continue; }
      path.moveTo(x, fall);
      path.lineTo(x - slant * long, fall - long);
    }
    var width = depth[3] * (0.85 + 0.4 * r.heavy);
    if (!depth[4]) {                                // out of focus: a wide faint stroke with a narrower one inside it, no sharp core
      brush.strokeStyle = "rgba(" + rgb + ", " + a * 0.5 + ")";
      brush.lineWidth = width * 1.8;
      brush.stroke(path);
    }
    brush.strokeStyle = "rgba(" + rgb + ", " + a + ")";
    brush.lineWidth = width;
    brush.stroke(path);
  });
  brush.restore();
}

// rainSplashes(brush, t, look): rule 5, drops meeting water and the ground. On each box of look.water rings widen
// and fade, each in a third of a second, the nearer (lower) ones larger; along look.ground a fine spray (owner,
// 2026-10-25: no mist of spray, it read as spotlights on the ground). Returns nothing: it draws with brush.
// e.g. rainSplashes(pen, t, {water: [[300, 860, 600, 120]], ground: 900, heavy: 0.8});
function rainSplashes(brush, t, look) {
  var r = rainLook(look), rgb = rainRGB(look.tone || "#e4e8ec"), many = 0.3 + 1.7 * r.heavy;
  var boxes = r.water ? (typeof r.water[0] === "number" ? [r.water] : r.water) : [];
  brush.save();
  brush.lineWidth = 1.2;
  boxes.forEach(function (box, b) {
    var count = Math.round(box[2] * box[3] / 1600 * many);
    for (var n = 0; n < count; n++) {
      var i = r.seed * 500 + b * 7000 + n, life = 0.33, phase = (t + dice(i * 2.7) * life * 3) % (life * 3);
      if (phase > life) { continue; }               // each spot rings now and then, not all at once
      var u = phase / life, y = box[1] + dice(i * 1.1) * box[3], near = (y - box[1]) / box[3];
      var rr = (3 + 14 * u) * (0.6 + 0.8 * near);
      brush.strokeStyle = "rgba(" + rgb + ", " + 0.55 * (1 - u) + ")";
      brush.beginPath();
      brush.ellipse(box[0] + dice(i * 3.3) * box[2], y, rr, rr * 0.28, 0, 0, 7);
      brush.stroke();
    }
  });
  brush.fillStyle = "rgba(" + rgb + ", 0.35)";      // the fine spray where drops hit the ground
  for (var k = 0; k < 70 * many; k++) {
    var j = r.seed * 300 + k, at = (t * 3 + dice(j * 1.7)) % 1;
    if (at > 0.25) { continue; }
    var gx = r.x + dice(j * 4.1) * r.wide, gy = r.ground + 60 * dice(j * 0.9);
    brush.beginPath(); brush.arc(gx - 3, gy - 16 * at, 1.1, 0, 7); brush.arc(gx + 3, gy - 12 * at, 1, 0, 7); brush.fill();
  }
  brush.restore();
}

// rain(brush, t, look): all of it at once, far to near: the veil, the shafts, the sheets, the near streaks and the
// splashes. look: RAIN_KEYS above; it may be left out ({} is a steady rain over the whole sheet). Returns nothing.
// e.g. rain(pen, t, {heavy: 0.8, cloud: 230, far: 640, ground: 920, water: [[0, 900, WIDE, 180]]});
function rain(brush, t, look) {
  look = look || {};
  checkNames("The rain's name", look, RAIN_KEYS);
  rainVeil(brush, look);
  if (look.shafts !== 0) { rainShafts(brush, t, look); }
  rainSheets(brush, t, look);
  rainStreaks(brush, t, look);
  rainSplashes(brush, t, look);
}
