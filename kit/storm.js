// storm.js - a storm's sky and its lightning, for the Lanna cartoon kit. Load it after the kit (and rain.js, if it
// rains):
//
//     <script src="oldcartoon.js"></script>
//     <script src="storm.js"></script>
//
// and call stormSky(brush, t, look) for the sky, lightning(brush, t, look) for the strikes, and stormFlash(t, look)
// for how bright the land is lit at second t (to light a scene's own pieces). Everything is worked out from the
// second alone; a strike is told by the second it falls ("at"), so the film says when the sky breaks.
//
// Modelled on photographs (owner, 2026-10-25: "Find some shots of real lightning in Northern Thailand and model them
// rather then guess at what it looks like ... beautiful, realistic and true to the location"). No photograph of
// lightning in the north is on Wikimedia Commons; the strikes are read from Bangkok's (the same storms of the same
// monsoon: Marco Nürnberger, "Bangkok Lightning", CC BY 2.0; Nik Cyclist, "Bangkok at night with lightning", CC BY 2.0;
// Daniel Julie, "Thailand Bangkok under the monsoon Storm", CC BY 2.0), the sky from the north's (JohnoPolo, "Mountain
// Rain Squall", Chiang Rai, CC BY-SA 3.0; Photo Dharma, "Ubosot with Storm Looming", Wat Sri Suphan, Chiang Mai, CC BY
// 2.0; Janjira Jane, "Doi Luang Chiang Dao under dramatic clouds and light", CC BY-SA 4.0). What they show, as rules:
//   1. A storm's cloud is a low, flat, dark underside in rolls and layers, slate blue-grey by day; under its edge a
//      band of pale light along the horizon where the rain has not reached. By night the sky is a deep indigo and
//      violet, the cloud a darker mass on it.
//   2. The channel of a strike is thin and white, with a glow of violet round it, never gold. It goes down in many
//      small jags of every angle, its whole way wandering a little; branches leave it at sharp angles, thinner and
//      fainter, and end in the air; some crawl along under the cloud.
//   3. A strike flickers: three or four strokes down the same channel within half a second, each bright and gone,
//      then nothing. The branches fade before the channel. The cloud lights from inside, and the sky and the land
//      are lit lilac for that moment.
//   4. Far off, several small strikes stand at once along the horizon, under the cloud (Bangkok at night).

// The names a sky's look may have (stormSky() warns about any other):
//   night     0 to 1: day (0, slate and pale light) to night (1, indigo and violet)
//   dark      0 to 1: how dark the cloud is by day, from a grey shower cloud (0) to the storm's slate (1, unless told)
//   base      y of the cloud's underside (360 unless told); the band of light lies under it
//   horizon   y of the far land (640 unless told)
//   x, wide   the part of the sheet (0 and WIDE unless told)
//   seed      a number, so two skies are not alike
var STORM_SKY_KEYS = {};

["night", "dark", "base", "horizon", "x", "wide", "seed"].forEach(function (name) { STORM_SKY_KEYS[name] = true; });

// The names a strike's look may have (lightning() warns about any other):
//   at        the second it falls (a strike lasts about half a second from there)
//   x         where it leaves the cloud; to: where it reaches (x, ground), or false: it ends in the air
//   top       y where it leaves the cloud (look.base of the sky, 340 unless told)
//   ground    y where it reaches the land (700 unless told)
//   far       0 to 1: how far off it is (0 near, thick and bright; 1 on the horizon, small and faint)
//   seed      a number: the same seed is the same channel
var LIGHTNING_KEYS = {};

["at", "x", "to", "top", "ground", "far", "seed"].forEach(function (name) { LIGHTNING_KEYS[name] = true; });

// stormSky(brush, t, look): rule 1. The sky from the top of the sheet to the far land: the cloud in drifting rolls,
// darkest above; under its underside the band of light; by night indigo. Returns nothing: it draws with brush.
// e.g. stormSky(pen, t, {night: 0, base: 380, horizon: 640});
function stormSky(brush, t, look) {
  look = look || {};
  checkNames("The storm sky's name", look, STORM_SKY_KEYS);
  var x0 = look.x || 0, wide = look.wide || WIDE, base = look.base || 360, horizon = look.horizon || 640, night = clamp(look.night || 0);
  var seed = look.seed || 0, heavy = look.dark === undefined ? 1 : clamp(look.dark);
  function tone(day, dark) {                         // a lighter day cloud is its slate taken toward a pale grey
    return "rgb(" + [0, 1, 2].map(function (k) { return Math.round(mix(mix(mix(day[k], 168, 0.55), day[k], heavy), dark[k], night)); }).join(", ") + ")";
  }
  var g = brush.createLinearGradient(0, 0, 0, horizon);
  g.addColorStop(0, tone([34, 46, 60], [14, 14, 38]));
  g.addColorStop(base / horizon * 0.85, tone([48, 64, 80], [28, 26, 70]));
  g.addColorStop(base / horizon, tone([86, 102, 116], [52, 46, 104]));
  g.addColorStop(Math.min(0.99, (base + (horizon - base) * 0.45) / horizon), tone([222, 226, 220], [92, 80, 140]));   // the band of light
  g.addColorStop(1, tone([170, 182, 186], [70, 62, 118]));
  brush.save();
  brush.fillStyle = g;
  brush.fillRect(x0, 0, wide, horizon);
  for (var k = 0; k < 7; k++) {                     // the rolls of the cloud's underside, drifting with the wind
    var y = 40 + k * (base - 30) / 7, drift = t * (5 + k * 2.2) + seed * 50, deep = k / 6;
    brush.fillStyle = tone([20 + 8 * deep, 30 + 10 * deep, 44 + 10 * deep], [10 + 6 * deep, 10 + 6 * deep, 30 + 10 * deep]).replace("rgb", "rgba").replace(")", ", 0.55)");
    brush.beginPath();
    brush.moveTo(x0, y - 40);
    for (var x = 0; x <= wide; x += 30) {
      brush.lineTo(x0 + x, y + 24 * Math.sin((x + drift) * 0.005 + k * 1.3 + seed) + 10 * Math.sin((x - drift) * 0.016 + k));
    }
    brush.lineTo(x0 + wide, y - 70);
    brush.closePath();
    brush.fill();
  }
  brush.restore();
}

// The channel of a strike: a list of [x, y, w] (w its width there), from (x, top) down in small jags of any angle,
// wandering, to (to, bottom) or ending in the air; and its branches, each a list of the same, thinner. All from the
// seed, so the same strike is the same channel on every frame. Draws nothing.
function lightningChannel(seed, x, top, to, bottom, width) {
  var main = [], branches = [], px = x, py = top, n = 0, k;
  var steps = Math.max(12, Math.round((bottom - top) / 9));
  for (k = 0; k <= steps; k++) {
    var u = k / steps, aim = mix(x, to, u);
    main.push([px, py, width * (1 - 0.4 * u)]);
    var jag = (dice(seed + k * 1.31) - 0.5) * 2;    // each jag goes off at an angle of its own; the whole wanders back toward its aim
    px += jag * 13 + (aim - px) * 0.12;
    py += (bottom - top) / steps * (0.6 + 0.8 * dice(seed + k * 2.17));
    if (py > bottom) { py = bottom; }
    if (dice(seed + k * 3.7) < 0.16 && u > 0.05 && u < 0.85) {   // a branch leaves at a sharp angle and ends in the air
      var side = dice(seed + k * 5.3) < 0.5 ? -1 : 1, bx = px, by = py, branch = [], long = (bottom - py) * (0.2 + 0.45 * dice(seed + k * 7.9));
      var bsteps = Math.max(4, Math.round(long / 9)), ang = side * (0.35 + 0.6 * dice(seed + k * 9.1));
      for (var b = 0; b <= bsteps; b++) {
        branch.push([bx, by, width * 0.45 * (1 - b / bsteps)]);
        var bj = (dice(seed + k * 11 + b * 1.7) - 0.5) * 2;
        bx += Math.sin(ang) * 9 + bj * 8;
        by += Math.cos(ang) * 9 + Math.abs(bj) * 2;
      }
      branches.push(branch);
      n++;
    }
  }
  if (dice(seed * 0.7 + 3) < 0.6) {                 // rule 2: a crawler along under the cloud, from the channel's top
    var cx = x, cy = top + 6, crawl = [], dir = dice(seed + 13) < 0.5 ? -1 : 1;
    for (k = 0; k < 14; k++) {
      crawl.push([cx, cy, width * 0.35 * (1 - k / 14)]);
      cx += dir * (8 + 10 * dice(seed + k * 4.4)); cy += (dice(seed + k * 6.6) - 0.45) * 22;
    }
    branches.push(crawl);
  }
  return {main: main, branches: branches};
}

// How bright a strike is at second t: rule 3, three or four strokes down the channel, each sharp and gone. 0 before
// "at" and after about half a second. Returns {main, branch}: the channel's brightness and the branches'.
function lightningGlow(t, at, seed) {
  var since = t - at;
  if (since < 0 || since > 0.6) { return {main: 0, branch: 0}; }
  var strokes = [0, 0.07 + 0.03 * dice(seed + 1), 0.17 + 0.05 * dice(seed + 2), 0.3 + 0.08 * dice(seed + 3)], main = 0;
  strokes.forEach(function (s, k) {
    if (k === 3 && dice(seed + 4) < 0.4) { return; }   // not every strike has a fourth stroke
    var d = since - s;
    if (d >= 0) { main = Math.max(main, (1 - 0.18 * k) * Math.exp(-d / 0.035)); }
  });
  return {main: main, branch: main * Math.exp(-since / 0.12)};   // the branches fade before the channel
}

function lightningStroke(brush, points, bright, far) {
  if (bright < 0.02 || points.length < 2) { return; }
  var scale = mix(1, 0.4, far);
  [[16, "rgba(150, 130, 255, " + 0.12 * bright + ")"], [6, "rgba(200, 190, 255, " + 0.45 * bright + ")"], [1, "rgba(255, 255, 255, " + bright + ")"]].forEach(function (pass) {
    brush.strokeStyle = pass[1];
    brush.lineJoin = "round"; brush.lineCap = "round";
    for (var k = 1; k < points.length; k++) {         // the width narrows along the way, so it is stroked piece by piece
      brush.lineWidth = Math.max(0.6, (pass[0] === 1 ? points[k][2] : pass[0] * points[k][2] / 3) * scale);
      brush.beginPath(); brush.moveTo(points[k - 1][0], points[k - 1][1]); brush.lineTo(points[k][0], points[k][1]); brush.stroke();
    }
  });
}

// lightning(brush, t, look): rules 2 and 3, one strike: drawn only while it flickers (from look.at for about half a
// second), as light (screen) over whatever is under it. Returns its brightness now, 0 to 1 (stormFlash() adds them up).
// e.g. lightning(pen, t, {at: 3.2, x: 700, to: 760, top: 360, ground: 720, seed: 4});
function lightning(brush, t, look) {
  checkNames("The lightning's name", look, LIGHTNING_KEYS);
  var seed = look.seed || 0, far = clamp(look.far || 0), glow = lightningGlow(t, look.at || 0, seed);
  if (!glow.main) { return 0; }
  var top = look.top || 340, ground = look.ground || 700, x = look.x || WIDE / 2;
  var to = look.to === false ? x + 60 : (look.to === undefined ? x + 40 : look.to);
  var bottom = look.to === false ? mix(top, ground, 0.55) : ground;
  var ch = lightningChannel(seed * 97 + 1, x, top, to, bottom, mix(3.2, 1.4, far));
  brush.save();
  brush.globalCompositeOperation = "screen";
  var halo = brush.createRadialGradient(x, top, 10, x, top, mix(420, 160, far));   // rule 3: the cloud lit from inside
  halo.addColorStop(0, "rgba(200, 180, 255, " + 0.5 * glow.main * mix(1, 0.5, far) + ")");
  halo.addColorStop(1, "rgba(200, 180, 255, 0)");
  brush.fillStyle = halo;
  brush.fillRect(x - 500, top - 400, 1000, 700);
  ch.branches.forEach(function (b) { lightningStroke(brush, b, glow.branch, far); });
  lightningStroke(brush, ch.main, glow.main, far);
  brush.restore();
  return glow.main * mix(1, 0.3, far);
}

// stormFlash(t, strikes): how brightly the land is lit at second t by the strikes listed (each a look lightning()
// takes), 0 to 1: rule 3, for lighting the scene's own pieces lilac for the moment. Draws nothing.
// e.g. var lit = stormFlash(t, STRIKES);
function stormFlash(t, strikes) {
  var lit = 0;
  strikes.forEach(function (s) { lit = Math.max(lit, lightningGlow(t, s.at || 0, s.seed || 0).main * mix(1, 0.3, clamp(s.far || 0))); });
  return lit;
}

// stormLight(brush, lit, x, wide): the land lit lilac by a flash: a wash of light over the part of the sheet, as
// strong as lit (stormFlash()'s number). Returns nothing: it draws with brush.
// e.g. stormLight(pen, stormFlash(t, STRIKES));
function stormLight(brush, lit, x, wide) {
  if (lit < 0.01) { return; }
  brush.save();
  brush.globalCompositeOperation = "screen";
  brush.fillStyle = "rgba(170, 160, 230, " + 0.45 * lit + ")";
  brush.fillRect(x || 0, 0, wide || WIDE, 1080);
  brush.restore();
}

// stormStrikes(look): a storm's strikes, spread over its seconds at a natural pace (owner, 2026-10-25: "The lightning
// occurs too often"): one about every look.every seconds (15 unless told), the gaps uneven, now and then a second
// strike close after the first; each at a place of its own between look.x0 and look.x1, near or far. Gives back a
// list of looks for lightning() (at, x, to, top, ground, far, seed), in the order they fall. Draws nothing.
//   from, to     the storm's first and last second (0 and 60 unless told)
//   every        the seconds between strikes, on average (15)
//   x0, x1       where along the sheet they fall (0 and WIDE)
//   top, ground  as lightning() takes them, for a near strike; a far one keeps to the horizon (horizon, 620 unless told)
//   farOnly      true: only far strikes, along the horizon (a storm passing at a distance)
//   seed         a number, so two storms are not alike
// e.g. var STRIKES = stormStrikes({from: 0, to: 40, every: 12, top: 330, ground: 700});
function stormStrikes(look) {
  look = look || {};
  var from = look.from || 0, to = look.to === undefined ? 60 : look.to, every = look.every || 15, seed = look.seed || 0;
  var x0 = look.x0 || 0, x1 = look.x1 === undefined ? WIDE : look.x1, horizon = look.horizon || 620, strikes = [], t = from + every * (0.3 + 0.5 * dice(seed)), n = 0;
  while (t < to) {
    var far = look.farOnly ? 0.8 + 0.2 * dice(seed + n * 2.3) : (dice(seed + n * 2.3) < 0.55 ? 0.75 + 0.25 * dice(seed + n * 4.1) : 0.4 * dice(seed + n * 4.1));
    var x = mix(x0, x1, dice(seed + n * 3.7)), near = far < 0.5;
    strikes.push({at: t, x: x, to: near && dice(seed + n * 5.9) < 0.25 ? false : x + 80 * (dice(seed + n * 6.1) - 0.5),
                  top: near ? (look.top || 340) : horizon - 140, ground: near ? (look.ground || 700) : horizon, far: far, seed: seed * 13 + n});
    if (dice(seed + n * 7.7) < 0.25) {              // now and then a second strike close after the first, nearby
      strikes.push({at: t + 0.8 + 1.5 * dice(seed + n * 8.3), x: x + 160 * (dice(seed + n * 9.1) - 0.5), to: x + 40, top: strikes[strikes.length - 1].top,
                    ground: strikes[strikes.length - 1].ground, far: Math.min(1, far + 0.1), seed: seed * 13 + n + 500});
    }
    t += every * (0.4 + 1.2 * dice(seed + n * 1.9));   // uneven gaps, about "every" on average
    n++;
  }
  return strikes;
}
