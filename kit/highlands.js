// highlands.js - the uplands of the north of Thailand, for the Lanna cartoon
// kit: rice terraces cut into the slopes, the forest, and mist that lies in
// the valleys and drifts across the mountains. Load it after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="highlands.js"></script>
//
// The terraces and the forest are painted once, on a set's sheet, as the
// kit's hills() and tree() are. The mist goes on every frame, over the set,
// and the second t alone says where it is (as in cumulus.js): render.py's
// frames and the browser's playing agree, and scrubbing back shows the same
// mist. Mist between two ranges goes between their sheets: lay the far range,
// the mist, then the nearer range (highlands.html does).
//
//   terraces(brush, x, top, wide, tall, look)          rice terraces in a fold of a slope; (x, top) the top of the patch
//   fieldHut(brush, x, base, size)                     the hut a farmer rests in, on four posts under thatch
//   forest(brush, left, right, base, look)             a belt of forest standing on the line y = base
//   forestSlope(brush, ridge, left, right, foot, look) a mountain under the line ridge(x), clothed in forest
//   crown(brush, x, y, r, colour, seed, plain)         one crown of the canopy
//   tallTree(brush, x, base, size, colour, seed)       a tree that stands above the canopy
//   bamboo(brush, x, base, size, seed)                 a clump of bamboo
//   areca(brush, x, base, size, seed)                  an areca palm
//   mistSea(brush, t, look)                            a sea of mist lying level in a valley
//   mistBand(brush, x, y, wide, t, look)               one band of mist lying across a slope
//   mistDrift(brush, t, look)                          bands of mist drifting across a mountain
//
// What each is, is written as rules above its painters, read from
// photographs on Wikimedia Commons under free licences: the terraces of Mae
// Klang Luang and of Mae Chaem, the forest of Doi Pui and of Khao Sok, a
// bamboo grove, and a sea of mist at sunrise seen from a mountain garden in
// the north. Nothing of them is copied, only what they show. The kit's rules
// for nature hold here too: a fine line round each shape, colour that changes
// inside a shape and nowhere else, and nothing evenly spaced, the same, or
// upright (dice() decides).

// A colour "#rrggbb" as rgba() at the opacity a.
// colour: "#rrggbb"; a: 0 to 1. Returns a string "rgba(r, g, b, a)". Changes nothing.
// e.g. brush.strokeStyle = hlTint("#34521f", 0.8);
function hlTint(colour, a) {
  var c = parseInt(colour.slice(1), 16);
  return "rgba(" + ((c >> 16) & 255) + ", " + ((c >> 8) & 255) + ", " + (c & 255) + ", " + a + ")";
}

// ---------- terraces ----------
// Rice terraces, as they climb a fold of the hills at Mae Klang Luang and
// spread up from a valley in Mae Chaem:
//   1. A terrace is a level bench along the slope: a long, narrow band,
//      many times wider than it is tall, its two edges near parallel.
//   2. Each band is a bright paddy below a darker step: the riser that
//      drops from the bench above. A paddy is lightest along its lip, its
//      outer edge, and a fine line runs round every bench.
//   3. The benches follow the slope's contours: they bow up into a gully
//      and down over a spur, all of them alike, more the lower they are.
//   4. Up the slope they grow thinner, the step and the paddy both.
//   5. A patch of terraces is cut into the forest: no bench ends square,
//      each tapers to a point where the patch ends, no two end at the same
//      place, and small trees crowd the ends.
//   6. The season sets the colour: young rice in the rains, gold before the
//      harvest, the sky's own colour while it is flooded for planting, straw
//      and earth in the dry season.
//   7. A farmer's hut, thatch on four posts, stands on a bench.

var TERRACE_SEASONS = {
  green: {paddy: "#86bf45", lip: "#d2ec7a", step: "#5f7f36", line: "#34521f", mark: "#4f8a2c"},   // young rice, in the rains
  gold: {paddy: "#d4a83c", lip: "#f3dc86", step: "#8b7838", line: "#5f4a1c", mark: "#a9802a"},    // ripe, before the harvest
  water: {paddy: "#9fc8d0", lip: "#e6f3f0", step: "#7d8657", line: "#465a44", mark: "#6c9a54"},   // flooded for planting: the sky in it
  dry: {paddy: "#c7a26c", lip: "#ead09c", step: "#a3754a", line: "#664629", mark: "#9a7448"}      // stubble, in the dry season
};

// The look's names: season ("green", "gold", "water" or "dry"), count (how
// many benches; from the height if left out), bow (how far the benches bow
// with the fold, 1 as the photographs), seed, hut (true, or the bench it
// stands on), trees (false: no trees at the ends of the benches).
// It gives back lip(k, x): the height of bench k's lip at x, for a film that
// stands someone on a terrace (bench 0 is the highest, count the lowest).
// terraces(brush, x, top, wide, tall, look) paints a patch of rice terraces and gives back {count, lip}.
//   brush       a canvas 2D context (a set's sheet, painted once)
//   x, top      the middle of the patch's top, pixels of the sheet
//   wide, tall  the patch's size, pixels of the sheet
//   look        optional; the names listed just above (season "green", count from tall / 24 and at
//               least 4, bow 1, seed 1, hut off, trees on)
// Returns {count, lip}: lip(k, x) is the y, pixels of the sheet, of bench k's lip at x.
// It leaves brush's fill and line set as it last set them.
// e.g. var field = terraces(pen, 960, 420, 1100, 380, {season: "gold", hut: true}); person(700, field.lip(5, 700), cast("boy"));
function terraces(brush, x, top, wide, tall, look) {
  look = look || {};
  var season = TERRACE_SEASONS[look.season || "green"] || TERRACE_SEASONS.green, seed = look.seed || 1;
  var count = look.count || Math.max(4, Math.round(tall / 24)), bow = look.bow === undefined ? 1 : look.bow;
  var gully = (dice(seed * 13) - 0.5) * 0.5, spur = gully + (dice(seed * 13 + 1) < 0.5 ? -0.8 : 0.8), k, n, at;
  function level(v) { return top + tall * (0.45 * v + 0.55 * v * v); }       // rule 4: thinner up the slope
  function middle(v) { return x + wide * 0.07 * Math.sin(v * 2.4 + seed); }   // the fold wanders a little as it climbs
  function half(v) { return wide / 2 * (0.45 + 0.55 * v); }                  // and widens toward its foot
  function lip(bench, along) {                     // rule 3: level, bowed up into the gully and down over the spur
    var v = bench / count, u = (along - middle(v)) / half(v);
    var shape = -Math.exp(-(u - gully) * (u - gully) / 0.14) + 0.7 * Math.exp(-(u - spur) * (u - spur) / 0.06) + 0.2 * Math.sin(2.6 * u + seed);
    return level(v) + bow * tall * (0.012 + 0.045 * v) * shape;
  }
  var benches = [];
  for (k = 0; k < count; k++) {                    // rule 5: each ends at a place of its own, and tapers there
    var v = (k + 0.5) / count;
    var left = middle(v) - half(v) * (0.78 + 0.34 * dice(seed * 7 + k)), right = middle(v) + half(v) * (0.78 + 0.34 * dice(seed * 7 + k + 50));
    benches.push({k: k, v: v, left: left, right: right, taper: Math.min(90, (right - left) * 0.3)});
  }
  function lower(b, along) {                       // the bottom of bench b's band: the lip below, drawn up to meet the top at its ends
    var shut = between(along, b.left, b.left + b.taper) * between(along, b.right, b.right - b.taper);
    return lip(b.k, along) + (lip(b.k + 1, along) - lip(b.k, along)) * shut;
  }
  function band(b, depth) {                        // a band from the lip down, "depth" of the way to the bottom (1: the whole bench)
    brush.beginPath();
    for (at = b.left; at <= b.right; at += 5) { brush.lineTo(at, lip(b.k, at)); }
    brush.lineTo(b.right, lip(b.k, b.right));
    for (at = b.right; at >= b.left; at -= 5) { brush.lineTo(at, mix(lip(b.k, at), lower(b, at), depth)); }
    brush.closePath();
  }
  benches.forEach(function (b) {
    var mid = (b.left + b.right) / 2, high = lip(b.k, mid), low = lip(b.k + 1, mid), step = 0.24 + 0.08 * dice(seed * 3 + b.k);
    band(b, 1);                                    // rule 2: the paddy, deeper at its back and lightest at its lip
    var fade = brush.createLinearGradient(0, mix(high, low, step), 0, low);
    fade.addColorStop(0, season.paddy);
    fade.addColorStop(0.7, blend(season.paddy, season.lip, 0.45));
    fade.addColorStop(1, season.lip);
    brush.fillStyle = fade;
    brush.fill();
    band(b, step);                                 // the step down from the bench above: lit along its top, the bund
    var earth = brush.createLinearGradient(0, high, 0, mix(high, low, step));
    earth.addColorStop(0, blend(season.step, season.lip, 0.35));
    earth.addColorStop(1, season.step);
    brush.fillStyle = earth;
    brush.fill();
    var thick = low - high;
    if (thick > 9) {                               // the crop in rows along the bench: rice, its stubble, or the sky in the water
      brush.strokeStyle = hlTint(look.season === "water" ? "#ffffff" : season.mark, look.season === "water" ? 0.55 : 0.45);
      brush.lineWidth = Math.max(0.8, thick / 22);
      brush.lineCap = "round";
      brush.beginPath();
      for (var row = 0; row < 3; row++) {
        var f = step + (1 - step) * (0.3 + row * 0.24);
        for (at = b.left + b.taper * 0.6 + dice(seed + b.k * 5 + row) * 9; at < b.right - b.taper * 0.6; at += 7 + 5 * dice(at * 0.37 + row)) {
          var y = mix(lip(b.k, at), lower(b, at), f);
          if (look.season === "water") { brush.moveTo(at, y); brush.lineTo(at + 6 + 8 * dice(at), y); at += 10; }   // the sky caught in the water
          else if (look.season === "dry") { brush.moveTo(at, y); brush.lineTo(at + 0.5, y - thick * 0.05); }     // stubble
          else { brush.moveTo(at, y); brush.lineTo(at + thick * 0.04, y - thick * 0.14); }                        // a tuft of rice
        }
      }
      brush.stroke();
    }
    band(b, 1);                                    // the line round the bench
    brush.strokeStyle = hlTint(season.line, 0.8);
    brush.lineWidth = 0.7 + 1.1 * b.v;
    brush.lineJoin = "round";
    brush.stroke();
  });
  if (look.hut) {                                  // rule 7
    var on = benches[Math.min(count - 1, look.hut === true ? Math.round(count * 0.4) : look.hut)];
    var hx = mix(on.left + on.taper, on.right - on.taper, 0.3 + 0.4 * dice(seed * 29));
    fieldHut(brush, hx, mix(lip(on.k, hx), lip(on.k + 1, hx), 0.82), (lip(on.k + 1, hx) - lip(on.k, hx)) / 40);
  }
  if (look.trees !== false) {                      // rule 5: small trees crowd the ends of the benches, the lower over the higher
    for (n = 0; n < benches.length; n++) {
      var b = benches[n], r = 6 + (lip(b.k + 1, b.left) - lip(b.k, b.left)) * 0.55;
      [[b.left + b.taper * 0.1, -1], [b.right - b.taper * 0.1, 1]].forEach(function (end, side) {
        if (dice(seed * 41 + n * 2 + side) < 0.35) { return; }   // not at every end
        crown(brush, end[0] + end[1] * r * 0.3, lip(b.k, end[0]) + r * 0.25, r * (0.8 + 0.5 * dice(seed * 43 + n + side)),
              FOREST_GREENS[Math.floor(dice(seed * 47 + n * 3 + side) * 4)], seed * 53 + n * 2 + side);
      });
    }
  }
  return {count: count, lip: lip};
}

// The hut of the fields: a floor of split bamboo raised on four posts, open
// on every side, under a hipped roof of thatch; as tall as a person at size 1
// (its foot at (x, base)).
// brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 is about 80 tall (as tall as a
// person). Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. fieldHut(pen, 640, 820, 1.2);
function fieldHut(brush, x, base, size) {
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.lineJoin = "round";
  brush.strokeStyle = "rgba(60, 40, 25, 0.9)";
  brush.lineWidth = 2;
  brush.fillStyle = "#6e4e30";                     // the posts: the two at the back show between the two in front
  [[-17, 46], [17, 46], [-30, 52], [30, 52]].forEach(function (post) {
    brush.beginPath();
    brush.rect(post[0] - 2.5, -post[1], 5, post[1]);
    brush.fill();
    brush.stroke();
  });
  brush.fillStyle = "#c9a96e";                     // the floor, at a sitter's knee
  brush.beginPath();
  brush.rect(-36, -24, 72, 6);
  brush.fill();
  brush.stroke();
  brush.beginPath();                               // the roof: eaves wide and low, the ridge short
  brush.moveTo(-50, -46);
  brush.lineTo(-22, -78);
  brush.lineTo(22, -78);
  brush.lineTo(50, -46);
  brush.closePath();
  var thatch = brush.createLinearGradient(0, -78, 0, -46);
  thatch.addColorStop(0, "#b48a46");
  thatch.addColorStop(1, "#e2c27a");
  brush.fillStyle = thatch;
  brush.fill();
  brush.stroke();
  brush.lineWidth = 1;                             // the thatch's straws along its hem
  brush.beginPath();
  for (var n = -46; n <= 46; n += 5) { brush.moveTo(n, -47); brush.lineTo(n * 0.92, -56 - 4 * dice(n + 3)); }
  brush.stroke();
  brush.restore();
}

// ---------- the forest ----------
// The forest, as Doi Pui in the north and Khao Sok in the south show it:
//   1. It stands in layers: a few tall trees hold small, flat crowns above
//      the canopy, about half as high again; under them the canopy, crowns
//      packed close; at the front bamboo, palms and bananas.
//   2. A crown is a clump of lobes on a dome, lit along its top and deep
//      below, with one line round the whole clump.
//   3. No two crowns are the same green: deep, blue-green and yellow-green
//      side by side, and now and then, rarely, one in new leaf or in flower.
//   4. Bamboo grows in a clump: many thin culms from one foot, fanning out
//      and bending over at the top, joints along them, and narrow leaves in
//      thick sprays along the bend.
//   5. An areca palm is a thin, straight, ringed trunk with a smooth green
//      neck and a small tuft of feathered fronds at the top, their leaflets
//      hanging.
//   6. Further off a layer is paler, bluer and plainer: its crowns lose their
//      lines inside and their outline grows faint, and at the back only the
//      bumps of the crowns are left.
//   7. Seen from afar the forest is a close weave of crowns with no ground
//      between them. On a mountain the treetops stand up along the ridge, so
//      the ridge is a row of small humps, and they are smaller the higher
//      they stand.

var FOREST_GREENS = ["#3f7a4e", "#2f6a54", "#5f8f3e", "#4d8a5c", "#386646", "#6f9a4a"];
var FOREST_TINTS = ["#b8743e", "#c95f4a", "#e0a03a", "#d77fa0"];   // rule 3: new leaf, red leaf, flame of the forest, a tree in flower
var FOREST_HAZE = "#c9dcd8";                                         // what a far layer fades toward (rule 6)

// One crown: lobes on a dome, the whole clump inked, lit at the top. "plain"
// is a crown far off (rule 6): no lines inside, and a faint outline.
//   brush   a canvas 2D context
//   x, y    the middle of the clump's dome, pixels of the sheet
//   r       its radius in pixels (the clump is about 2.4 r wide)
//   colour  "#rrggbb", such as one of FOREST_GREENS
//   seed    a number: the same seed draws the same crown
//   plain   true for a far crown
// Returns nothing: it draws with brush, and leaves its fillStyle (and line, when it inks inside) set.
// e.g. crown(pen, 400, 600, 40, FOREST_GREENS[2], 7);
function crown(brush, x, y, r, colour, seed, plain) {
  var lobes = [[x, y, r * 0.6]], n, count = 6 + Math.floor(dice(seed * 3) * 3);
  for (n = 0; n < count; n++) {                    // round the top of the dome, left to right
    var a = Math.PI * (1.02 + 0.96 * n / (count - 1)) + (dice(seed * 5 + n) - 0.5) * 0.35;
    lobes.push([x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.5, r * (0.32 + 0.18 * dice(seed * 9 + n))]);
  }
  lobes.push([x - r * 0.56, y + r * 0.2, r * 0.36], [x + r * 0.58, y + r * 0.18, r * 0.34]);   // and lower at the sides
  var line = Math.max(0.7, Math.min(2.4, r / 14)), deep = blend(colour, "#0e2418", 0.55);
  function lobePath(grow) {
    brush.beginPath();
    for (var i = 0; i < lobes.length; i++) {
      brush.moveTo(lobes[i][0] + lobes[i][2] + grow, lobes[i][1]);
      brush.arc(lobes[i][0], lobes[i][1], lobes[i][2] + grow, 0, 7);
    }
  }
  brush.fillStyle = blend(colour, "#0e2418", plain ? 0.38 : 0.72);   // the line: every lobe a little larger in a deep tone of its own green
  lobePath(line);
  brush.fill();
  var fade = brush.createLinearGradient(0, y - r, 0, y + r * 0.55);   // rule 2: lit along the top, deep below
  fade.addColorStop(0, blend(colour, "#eef4b8", 0.42));
  fade.addColorStop(0.45, colour);
  fade.addColorStop(1, plain ? blend(colour, "#0e2418", 0.3) : deep);
  brush.fillStyle = fade;
  lobePath(0);
  brush.fill();
  if (plain || r < 14) { return; }
  brush.save();                                    // where one lobe rounds over another: the lower arc of a few, inside the clump
  lobePath(0);
  brush.clip();
  brush.strokeStyle = hlTint(deep, 0.55);
  brush.lineWidth = line * 0.7;
  brush.lineCap = "round";
  brush.beginPath();
  for (n = 1; n < lobes.length; n += 2) {
    var l = lobes[n];
    brush.moveTo(l[0] + Math.cos(0.25 * Math.PI) * l[2] * 0.95, l[1] + Math.sin(0.25 * Math.PI) * l[2] * 0.95);
    brush.arc(l[0], l[1], l[2] * 0.95, 0.25 * Math.PI, 0.75 * Math.PI);
  }
  brush.stroke();
  brush.restore();
}

// A bough or a culm, inked as the kit inks a hose: the line wider in ink,
// then the line again in its own colour.
// brush: a canvas 2D context; from, bend, to: [x, y] in pixels (a quadratic curve); width: pixels;
// colour, ink: CSS colours. Returns nothing: it draws with brush, and leaves its line set.
// e.g. hlHose(pen, [100, 800], [110, 600], [160, 420], 4, "#9fb85a", "rgba(32, 52, 24, 0.88)");
function hlHose(brush, from, bend, to, width, colour, ink) {
  brush.beginPath();
  brush.moveTo(from[0], from[1]);
  brush.quadraticCurveTo(bend[0], bend[1], to[0], to[1]);
  brush.lineCap = "round";
  brush.strokeStyle = ink;
  brush.lineWidth = width + 2;
  brush.stroke();
  brush.strokeStyle = colour;
  brush.lineWidth = width;
  brush.stroke();
}

// A tree that stands above the canopy (rule 1): a straight grey trunk that
// flares at its foot and bends a little, three boughs that leave it near the
// top, each at a height of its own, and a wide, flat crown of clumps at
// their ends; about 420 tall at size 1, its foot at (x, base).
// brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when about 420 tall (needed);
// colour: the crown's "#rrggbb"; seed: 1 when left out. Returns nothing: it draws with brush, and
// leaves its fill and line set.
// e.g. tallTree(pen, 820, 700, 0.8, FOREST_GREENS[0], 3);
function tallTree(brush, x, base, size, colour, seed) {
  seed = seed || 1;
  var high = 320 * size, lean = (dice(seed * 3) - 0.5) * 30 * size, wide = 10 * size, top = [x + lean, base - high], wave = 6 * size;
  var ink = "rgba(55, 45, 35, 0.9)", bark = "#a39884";
  brush.beginPath();                               // the trunk, flared at its foot
  brush.moveTo(x - wide * 2, base);
  brush.quadraticCurveTo(x - wide, base - 16 * size, x - wide, base - 36 * size);
  brush.bezierCurveTo(x - wide - wave, base - high * 0.45, top[0] - wide * 0.7 + wave, base - high * 0.75, top[0] - wide * 0.6, top[1]);
  brush.lineTo(top[0] + wide * 0.6, top[1]);
  brush.bezierCurveTo(top[0] + wide * 0.7 + wave, base - high * 0.75, x + wide - wave, base - high * 0.45, x + wide, base - 36 * size);
  brush.quadraticCurveTo(x + wide, base - 16 * size, x + wide * 2, base);
  brush.closePath();
  var shade = brush.createLinearGradient(x - wide, 0, x + wide, 0);
  shade.addColorStop(0, "#8c826f");
  shade.addColorStop(0.45, "#c2b8a2");
  shade.addColorStop(1, "#7f7563");
  brush.fillStyle = shade;
  brush.fill();
  brush.strokeStyle = ink;
  brush.lineWidth = Math.max(0.8, 1.8 * size);
  brush.lineJoin = "round";
  brush.stroke();
  var boughs = [[0.82, -1, 78, -46], [0.9, 1, 84, -40], [1.0, -0.15, 26, -60]], ends = [];   // where each leaves the trunk, its side, how far out and up
  boughs.forEach(function (b, n) {
    var from = [mix(x, top[0], b[0]), mix(base, top[1], b[0])];
    var to = [from[0] + b[1] * b[2] * size * (0.8 + 0.4 * dice(seed * 7 + n)), from[1] + b[3] * size * (0.8 + 0.4 * dice(seed * 9 + n))];
    hlHose(brush, from, [mix(from[0], to[0], 0.25), mix(from[1], to[1], 0.85)], to, wide * (0.75 - 0.15 * n), bark, ink);
    ends.push(to);
  });
  ends.push([mix(ends[0][0], ends[2][0], 0.5), mix(ends[0][1], ends[2][1], 0.5) + 8 * size],
            [mix(ends[1][0], ends[2][0], 0.5), mix(ends[1][1], ends[2][1], 0.5) + 10 * size]);
  ends.sort(function (a, b) { return b[1] - a[1]; });   // a flat crown: the lower clumps first, none much above another
  ends.forEach(function (end, n) {
    crown(brush, end[0], end[1] - 6 * size, (26 + 14 * dice(seed * 11 + n)) * size, colour, seed * 13 + n, size < 0.4);
  });
}

// A clump of bamboo (rule 4), its foot at (x, base); about 330 tall at size 1.
// brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when about 330 tall (needed);
// seed: 1 when left out. Returns nothing: it draws with brush, and leaves its fill and line set.
// e.g. bamboo(pen, 300, 900, 0.9, 5);
function bamboo(brush, x, base, size, seed) {
  seed = seed || 1;
  var count = 9 + Math.floor(dice(seed * 3) * 6), lean = (dice(seed * 3 + 1) - 0.5) * 0.5, culms = [], n, s;
  for (n = 0; n < count; n++) {
    var u = n / (count - 1) - 0.5 + (dice(seed * 11 + n) - 0.5) * 0.12;   // -0.5 at the left of the clump to 0.5 at the right
    var high = (250 + 110 * dice(seed * 13 + n)) * size * (1 - 0.45 * Math.abs(u)), out = u * 1.5 + lean;
    var foot = [x + u * 30 * size, base];
    culms.push({foot: foot, bend: [foot[0] + out * high * 0.18, base - high * 0.95], tip: [foot[0] + out * high * 0.85, base - high * (0.66 + 0.14 * dice(seed * 17 + n))], u: u, high: high});
  }
  culms.sort(function (a, b) { return Math.abs(b.u) - Math.abs(a.u); });   // the outer ones behind, the middle ones in front
  function at(c, s) {                              // a point s of the way along a culm
    return [(1 - s) * (1 - s) * c.foot[0] + 2 * (1 - s) * s * c.bend[0] + s * s * c.tip[0],
            (1 - s) * (1 - s) * c.foot[1] + 2 * (1 - s) * s * c.bend[1] + s * s * c.tip[1]];
  }
  var leaf = "#6e9a3c", ink = "rgba(32, 52, 24, 0.88)", w = Math.max(1.2, 4.2 * size);
  culms.forEach(function (c, i) {
    hlHose(brush, c.foot, c.bend, c.tip, w, i % 3 ? "#9fb85a" : "#b9c46a", ink);   // the culm
    brush.strokeStyle = ink;                       // its joints
    brush.lineWidth = Math.max(0.6, size);
    brush.beginPath();
    for (s = 0.08; s < 0.75; s += 26 * size / c.high) {
      var p = at(c, s), q = at(c, s + 0.01), dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1;
      brush.moveTo(p[0] - dy / l * w * 0.6, p[1] + dx / l * w * 0.6);
      brush.lineTo(p[0] + dy / l * w * 0.6, p[1] - dx / l * w * 0.6);
    }
    brush.stroke();
    var side = c.tip[0] >= c.foot[0] ? 1 : -1;
    for (s = 0.42; s <= 1.0; s += 0.07) {          // thick sprays of narrow leaves along the bend, hanging
      var spot = at(c, s);
      for (var f = 0; f < 4; f++) {
        var d = seed * 19 + i * 31 + Math.round(s * 100) + f * 7;
        brush.save();
        brush.translate(spot[0], spot[1]);
        brush.rotate(Math.PI * (0.62 + side * (0.12 + 0.17 * f)) + (dice(d) - 0.5) * 0.7);
        leafPath(brush, (24 + 14 * dice(d + 1)) * size, 3.2 * size, 0.15 * side);
        brush.fillStyle = f % 2 ? leaf : blend(leaf, "#d8e890", 0.35);
        brush.fill();
        brush.strokeStyle = ink;
        brush.lineWidth = Math.max(0.5, 0.9 * size);
        brush.stroke();
        brush.restore();
      }
    }
  });
}

// An areca palm (rule 5), its foot at (x, base); about 330 tall at size 1.
// brush: a canvas 2D context; x, base: pixels of the sheet; size: 1 when about 330 tall (needed);
// seed: 1 when left out. Returns nothing: it draws with brush, and leaves its fill and line set.
// e.g. areca(pen, 1500, 880, 1, 2);
function areca(brush, x, base, size, seed) {
  seed = seed || 1;
  var high = (290 + 60 * dice(seed * 3)) * size, lean = (dice(seed * 3 + 1) - 0.5) * 30 * size, w = 4 * size, n;
  var top = [x + lean, base - high], neck = [x + lean * 0.92, base - high * 0.9], ink = "rgba(32, 52, 24, 0.85)";
  brush.beginPath();                               // the trunk: thin and straight
  brush.moveTo(x - w * 1.3, base);
  brush.lineTo(neck[0] - w, neck[1]);
  brush.lineTo(neck[0] + w, neck[1]);
  brush.lineTo(x + w * 1.3, base);
  brush.closePath();
  var bark = brush.createLinearGradient(x - w, 0, x + w, 0);
  bark.addColorStop(0, "#8c8678");
  bark.addColorStop(0.5, "#c9c2b0");
  bark.addColorStop(1, "#7f796c");
  brush.fillStyle = bark;
  brush.fill();
  brush.strokeStyle = "rgba(55, 48, 38, 0.85)";
  brush.lineWidth = Math.max(0.7, 1.4 * size);
  brush.stroke();
  brush.lineWidth = Math.max(0.5, 0.8 * size);    // the rings, close together
  brush.beginPath();
  for (n = 1; n < 30; n++) {
    var y = base - high * 0.9 * n / 30, cx = mix(x, neck[0], n / 30);
    brush.moveTo(cx - w * 1.1, y);
    brush.lineTo(cx + w * 1.1, y + 1);
  }
  brush.stroke();
  brush.beginPath();                               // the smooth green neck
  brush.moveTo(neck[0] - w * 1.3, neck[1]);
  brush.lineTo(top[0] - w * 1.1, top[1]);
  brush.lineTo(top[0] + w * 1.1, top[1]);
  brush.lineTo(neck[0] + w * 1.3, neck[1]);
  brush.closePath();
  brush.fillStyle = "#7fa24e";
  brush.fill();
  brush.stroke();
  for (n = 0; n < 7; n++) {                        // the fronds: up and out, then down; their leaflets hanging from them
    var a = -Math.PI / 2 + (n / 6 - 0.5) * 2.8 + (dice(seed * 7 + n) - 0.5) * 0.3, long = (78 + 30 * dice(seed * 9 + n)) * size;
    var mid = [top[0] + Math.cos(a) * long * 0.55, top[1] + Math.sin(a) * long * 0.55 - 14 * size];
    var end = [top[0] + Math.cos(a) * long, top[1] + Math.sin(a) * long * 0.6 + long * 0.45];
    brush.strokeStyle = ink;
    brush.lineWidth = Math.max(0.7, 1.6 * size);
    brush.beginPath();
    brush.moveTo(top[0], top[1]);
    brush.quadraticCurveTo(mid[0], mid[1], end[0], end[1]);
    brush.stroke();
    for (var s = 0.12; s < 1; s += 0.075) {
      var px = (1 - s) * (1 - s) * top[0] + 2 * (1 - s) * s * mid[0] + s * s * end[0];
      var py = (1 - s) * (1 - s) * top[1] + 2 * (1 - s) * s * mid[1] + s * s * end[1];
      var tx = 2 * (1 - s) * (mid[0] - top[0]) + 2 * s * (end[0] - mid[0]), ty = 2 * (1 - s) * (mid[1] - top[1]) + 2 * s * (end[1] - mid[1]);
      var along = Math.atan2(ty, tx);
      for (var side = -1; side <= 1; side += 2) {  // a leaflet each side, swung down toward the ground
        var hang = along + side * 1.1, down = Math.PI / 2, swing = hang + Math.atan2(Math.sin(down - hang), Math.cos(down - hang)) * 0.45;
        brush.save();
        brush.translate(px, py);
        brush.rotate(swing + Math.PI / 2);
        leafPath(brush, 24 * size * (1.15 - s * 0.6), 2.6 * size, 0);
        brush.fillStyle = (n + side) % 2 ? "#5f8f3e" : "#79a548";
        brush.fill();
        brush.strokeStyle = ink;
        brush.lineWidth = Math.max(0.4, 0.6 * size);
        brush.stroke();
        brush.restore();
      }
    }
  }
}

// A belt of forest standing on y = base from left to right (rule 1). The
// look's names: tall (how high the canopy stands, 220 if left out), far (0
// near to 1 far: paler, bluer and plainer, rule 6), seed, haze (the colour it
// fades toward), ground (a function x -> y, for ground that is not level),
// bamboo, palms, trees (how many of each to a thousand pixels: 3, 2 and 2 if
// left out), front (false: no bananas at its foot).
// brush: a canvas 2D context (a set's sheet); left, right, base: pixels of the sheet; look: optional,
// the names just above. It also draws the kit's banana() (oldcartoon.js) at its foot when near.
// Returns nothing: it draws with brush, and leaves its fill and line set.
// e.g. forest(pen, 0, WIDE, 760, {tall: 260, seed: 4});  forest(pen, 0, WIDE, 560, {far: 0.7, tall: 150});
function forest(brush, left, right, base, look) {
  look = look || {};
  var tall = look.tall || 220, far = look.far || 0, seed = look.seed || 1, haze = look.haze || FOREST_HAZE, x, n;
  var ground = look.ground || function () { return base; }, plain = far > 0.4, span = right - left;
  function green(m) {                              // rule 3: now and then, rarely, a tree in new leaf or in flower
    var c = FOREST_GREENS[Math.floor(dice(seed * 83 + m) * FOREST_GREENS.length)];
    if (dice(seed * 97 + m) < 0.025) { c = blend(FOREST_TINTS[Math.floor(dice(seed * 89 + m) * FOREST_TINTS.length)], c, 0.2); }
    return blend(c, haze, far * 0.75);
  }
  function per(name, fallback) { return Math.round(span / 1000 * (look[name] === undefined ? fallback : look[name])); }
  function rise(at) {                              // the belt comes down to the ground at its two ends, as the edge of a wood does
    return 0.25 + 0.75 * between(at, left, left + tall * 0.8) * between(at, right, right - tall * 0.8);
  }
  brush.beginPath();                               // the shade under the canopy, so no sky shows between its crowns
  brush.moveTo(left, ground(left));
  for (x = left; x <= right; x += 10) { brush.lineTo(x, ground(x) - tall * rise(x) * (0.5 + 0.08 * Math.sin(x / 47 + seed))); }
  brush.lineTo(right, ground(right));
  brush.closePath();
  brush.fillStyle = blend("#1f3d2c", haze, far * 0.75);
  brush.fill();
  for (x = left, n = 0; x < right; n++) {          // the back of the canopy
    var r = tall * (0.16 + 0.08 * dice(seed * 31 + n)) * (0.5 + 0.5 * rise(x));
    crown(brush, x, ground(x) - tall * rise(x) * (0.68 + 0.2 * dice(seed * 37 + n)), r, green(n), seed * 41 + n, plain);
    x += r * (0.9 + 0.4 * dice(seed * 43 + n));
  }
  for (n = 0; n < per("trees", 2); n++) {          // the tall trees, their crowns half as high again as the canopy
    x = left + span * (n + 0.2 + 0.6 * dice(seed * 47 + n)) / per("trees", 2);
    if (rise(x) < 0.9) { continue; }               // none at the wood's edge
    tallTree(brush, x, ground(x) - tall * 0.2, tall / 330 * (0.9 + 0.2 * dice(seed * 53 + n)), green(n + 500), seed * 59 + n);
  }
  for (x = left - tall * 0.1, n = 0; x < right; n++) {   // the front of the canopy, larger and lower, down to the shade at its foot
    var big = tall * (0.22 + 0.1 * dice(seed * 61 + n)) * (0.5 + 0.5 * rise(x));
    crown(brush, x, ground(x) - tall * rise(x) * (0.28 + 0.12 * dice(seed * 67 + n)), big, green(n + 1000), seed * 71 + n, plain);
    x += big * (1.0 + 0.4 * dice(seed * 73 + n));
  }
  if (plain) { return; }
  var places = [];                                 // bamboo and palms among the front crowns
  for (n = 0; n < per("bamboo", 3); n++) { places.push(["bamboo", left + span * (n + dice(seed * 79 + n)) / per("bamboo", 3)]); }
  for (n = 0; n < per("palms", 2); n++) { places.push(["areca", left + span * (n + dice(seed * 101 + n)) / per("palms", 2)]); }
  places.sort(function (a, b) { return a[1] - b[1]; });
  places.forEach(function (p, m) {
    var foot = ground(p[1]) - tall * 0.06;
    if (p[0] === "bamboo") { bamboo(brush, p[1], foot, tall / 300 * (0.8 + 0.4 * dice(seed * 103 + m)), seed * 107 + m); }
    else { areca(brush, p[1], foot, tall / 290 * (0.85 + 0.3 * dice(seed * 109 + m)), seed * 113 + m); }
  });
  if (look.front === false || far > 0.3) { return; }
  for (x = left + 40 * dice(seed * 127), n = 0; x < right; n++) {   // bananas at its foot
    brush.save();
    brush.translate(x, ground(x));
    var scale = tall / 420 * (0.8 + 0.4 * dice(seed * 131 + n));
    brush.scale(scale * (dice(seed * 137 + n) < 0.5 ? -1 : 1), scale);
    banana(brush, 0, 0);
    brush.restore();
    x += 180 + 260 * dice(seed * 139 + n);
  }
}

// A mountain whose ridge is the line ridge(x), from left to right, standing
// down to y = foot, clothed in forest (rule 7): its own deep ground under the
// trees, crowns woven close all over it, smaller the higher they stand, and a
// row of them along the ridge. The look's names: far (0 near to 1 far), seed,
// haze, small and large (a crown's size at the ridge and at the foot: 7 and
// 26).
// brush: a canvas 2D context; ridge: a function x -> y, pixels of the sheet; left, right, foot: pixels
// of the sheet; look: optional, the names just above (far 0, seed 1, haze FOREST_HAZE, small 7,
// large 26). It draws up to 5000 crowns: paint it once on a sheet, not every frame.
// Returns nothing: it draws with brush, and leaves its fill and line set.
// e.g. forestSlope(pen, function (x) { return 420 + 120 * Math.cos(x / 300); }, 0, WIDE, 900, {far: 0.3});
function forestSlope(brush, ridge, left, right, foot, look) {
  look = look || {};
  var far = look.far || 0, seed = look.seed || 1, haze = look.haze || FOREST_HAZE, small = look.small || 7, large = look.large || 26;
  var high = Infinity, x, n, area = 0, plain = far > 0.4;
  for (x = left; x <= right; x += 8) { high = Math.min(high, ridge(x)); area += Math.max(0, foot - ridge(x)) * 8; }
  function shape() {
    brush.beginPath();
    brush.moveTo(left, foot);
    for (x = left; x <= right; x += 6) { brush.lineTo(x, ridge(x)); }
    brush.lineTo(right, ridge(right));
    brush.lineTo(right, foot);
    brush.closePath();
  }
  function green(m, height) {                      // rule 3, kept rare and quiet on a whole mountain; rule 6 by distance and height
    var c = FOREST_GREENS[Math.floor(dice(seed * 83 + m) * FOREST_GREENS.length)];
    if (dice(seed * 97 + m) < 0.012) { c = blend(FOREST_TINTS[Math.floor(dice(seed * 89 + m) * FOREST_TINTS.length)], c, 0.35); }
    return blend(c, haze, Math.min(0.9, far * 0.75 + 0.18 * height));
  }
  shape();
  var under = brush.createLinearGradient(0, high, 0, foot);
  under.addColorStop(0, blend("#1f4630", haze, far * 0.75 + 0.12));
  under.addColorStop(1, blend("#2c5a3a", haze, far * 0.75));
  brush.fillStyle = under;
  brush.fill();
  var spots = [], size = (small + large) / 2, many = Math.min(5000, Math.round(area / (size * size * 0.7)));
  for (n = 0; n < many; n++) {                     // where the crowns stand: anywhere on the slope, close enough to weave
    x = left + dice(seed * 7 + n) * (right - left);
    var y = ridge(x) + dice(seed * 11 + n) * (foot - ridge(x)), height = (foot - y) / Math.max(1, foot - high);
    spots.push([x, y, mix(large, small, height), height]);
  }
  spots.sort(function (a, b) { return a[1] - b[1]; });   // the higher first, so the nearer lie over them
  brush.save();
  shape();
  brush.clip();
  spots.forEach(function (s, m) { crown(brush, s[0], s[1] + s[2] * 0.3, s[2] * (0.8 + 0.4 * dice(seed * 13 + m)), green(m, s[3]), seed * 17 + m, plain); });
  brush.restore();
  for (x = left, n = 0; x < right; n++) {          // the treetops along the ridge, standing up out of it
    var r = small * (0.8 + 0.6 * dice(seed * 19 + n));
    crown(brush, x, ridge(x) + r * 0.25, r, green(n + 5000, 1), seed * 23 + n, true);
    x += r * (1.1 + 0.5 * dice(seed * 29 + n));
  }
}

// ---------- mist ----------
// The sea of mist (thale mok) as it is seen from the mountains of the north
// at sunrise, and the mist on their slopes:
//   1. Mist in a valley lies level: its top is flat and wide, and the far
//      ridges stand up out of it like islands.
//   2. Its top billows: many low, wide, rounded swells side by side, never
//      tall ones.
//   3. It is brightest along its top, which takes the sky's light (gold or
//      pink at sunrise), a little grey where one swell rounds over another,
//      and it thins away below into the land.
//   4. Further back it is thinner, its swells smaller, and it lies higher in
//      the picture: a pale band between the ranges.
//   5. On a mountain it lies across the slope in long bands that taper at
//      both ends, flat below and swelling above.
//   6. It moves slowly: it drifts sideways, and swells and settles. It never
//      jumps, and nothing of it is kept between frames: each swell belongs
//      to the mist, not to the picture, and keeps its size as it drifts.
//   7. It is drawn as the kit's clouds are: one faint line round its outer
//      edge, and the lower arcs of some swells inside.

var MIST_SHEET = document.createElement("canvas");   // mist is drawn whole here, then laid on the picture, as a cloud of cumulus.js is
MIST_SHEET.width = WIDE;
MIST_SHEET.height = 1080;
var MIST_PEN = MIST_SHEET.getContext("2d");

// Lay one body of mist: the puffs ([x, y, rx, ry, number], flat ellipses; the
// number, if given, is the swell's own, which picks the swells that show an
// inner arc, so that it does not change as the mist drifts) and a body
// under them (a function that adds its path), drawn on the mist sheet in the
// frame "frame" sets up (or none), the line first and every shape a little
// larger, then the fill, then the inner arcs (rule 7); then faded from solid
// at "solid" to gone at "gone" down the frame (rule 3), and laid on brush at
// "alpha" inside the box [left, top, right, bottom] of the picture.
//   brush            the canvas 2D context the mist goes onto
//   puffs            [[x, y, rx, ry, number], ...] in the frame's pixels
//   body             a function (b, grow) that adds a path to b, or null
//   frame            a function (b) that moves b's frame, or null (the sheet's own pixels)
//   box              [left, top, right, bottom], pixels of the sheet: where on MIST_SHEET it is drawn
//   look             colour ("#ffffff"), shade ("#8fa2b8"), glow (optional "#rrggbb")
//   alpha            0 to 1; solid, gone: y in the frame's pixels
// Returns nothing: it draws on brush through MIST_SHEET (left clear after), and leaves brush as it found it.
// e.g. mistLay(pen, [[600, 700, 120, 14]], null, null, [400, 660, 800, 760], {}, 0.8, 690, 760);
function mistLay(brush, puffs, body, frame, box, look, alpha, solid, gone) {
  var b = MIST_PEN, line = 1.6, colour = look.colour || "#ffffff", shade = look.shade || "#8fa2b8";
  var top = look.glow ? blend(colour, look.glow, 0.45) : colour;
  var L = Math.max(0, Math.floor(box[0])), T = Math.max(0, Math.floor(box[1])), R = Math.min(WIDE, Math.ceil(box[2])), B = Math.min(1080, Math.ceil(box[3]));
  if (R <= L || B <= T) { return; }
  b.clearRect(L, T, R - L, B - T);
  b.save();
  if (frame) { frame(b); }
  function shapes(grow) {
    b.beginPath();
    puffs.forEach(function (p) { b.moveTo(p[0] + p[2] + grow, p[1]); b.ellipse(p[0], p[1], p[2] + grow, p[3] + grow, 0, 0, 7); });
    if (body) { body(b, grow); }
  }
  b.fillStyle = shade;
  shapes(line);
  b.fill();
  var fill = b.createLinearGradient(0, solid, 0, gone);
  fill.addColorStop(0, top);
  fill.addColorStop(0.3, colour);
  fill.addColorStop(1, blend(colour, shade, 0.4));
  b.fillStyle = fill;
  shapes(0);
  b.fill();
  b.save();                                        // where one swell rounds over another: the lower arcs of some, inside the mist
  shapes(0);
  b.clip();
  b.strokeStyle = hlTint(shade, 0.55);
  b.lineWidth = line * 0.8;
  b.lineCap = "round";
  b.beginPath();
  puffs.forEach(function (p, n) {
    if (Math.abs(p.length > 4 ? p[4] : n) % 2) { return; }   // every other swell by its own number, which drifts with it (rule 6)
    b.moveTo(p[0] + Math.cos(0.15 * Math.PI) * p[2] * 0.92, p[1] + Math.sin(0.15 * Math.PI) * p[3] * 0.92);
    b.ellipse(p[0], p[1], p[2] * 0.92, p[3] * 0.92, 0, 0.15 * Math.PI, 0.85 * Math.PI);
  });
  b.stroke();
  b.restore();
  b.globalCompositeOperation = "destination-in";   // rule 3: it thins away below
  var mask = b.createLinearGradient(0, solid, 0, gone);
  mask.addColorStop(0, "rgba(0, 0, 0, 1)");
  mask.addColorStop(0.35, "rgba(0, 0, 0, 0.9)");
  mask.addColorStop(1, "rgba(0, 0, 0, 0)");
  b.fillStyle = mask;
  b.fillRect(-2 * WIDE, -2160, 5 * WIDE, 5400);
  b.globalCompositeOperation = "source-over";
  b.restore();
  brush.save();
  brush.globalAlpha *= alpha;
  brush.drawImage(MIST_SHEET, L, T, R - L, B - T, L, T, R - L, B - T);
  brush.restore();
  b.clearRect(L, T, R - L, B - T);                 // the sheet is left clear for the next
}

// A sea of mist, its top at y = level from left to right (rule 1). The
// look's names: level, left, right, deep (how far it reaches down before it
// is gone: 160), swell (the swells' height: 12), wave (a near swell's width:
// 130), drift (pixels a second: 5), layers (3: the furthest highest and
// thinnest, rule 4; give 1 to lay one between two ranges, calling it once
// for each, the furthest first), colour ("#ffffff"), glow (the sky's colour
// on its top, at sunrise), shade (its line and its grey), seed, alpha.
// brush: a canvas 2D context to lay the mist on, every frame; t: the time in seconds; look: optional,
// the names just above (level 700, left 0, right WIDE; all y and x in pixels of the sheet).
// Returns nothing: it draws on brush (through MIST_SHEET), and leaves brush as it found it.
// e.g. mistSea(pen, t, {level: 640, layers: 1, glow: "#f3b27a"});   // between the far range's sheet and the near one's
function mistSea(brush, t, look) {
  look = look || {};
  var level = look.level === undefined ? 700 : look.level, left = look.left || 0, right = look.right === undefined ? WIDE : look.right;
  var deep = look.deep || 160, swell = look.swell || 12, drift = look.drift === undefined ? 5 : look.drift, layers = look.layers || 3;
  var seed = look.seed || 1, alpha = look.alpha === undefined ? 1 : look.alpha, i, j;
  for (i = 0; i < layers; i++) {
    var near = layers > 1 ? i / (layers - 1) : 1, y0 = level - deep * 0.45 * (1 - near), sw = swell * (0.45 + 0.55 * near);
    var wave = (look.wave || 130) * (0.45 + 0.55 * near), reach = deep * (0.45 + 0.55 * near), step = wave * 0.62;
    var off = drift * t * (0.4 + 0.6 * near) + seed * 97 + i * 211, puffs = [];
    for (j = Math.floor((left - wave - off) / step); j * step + off < right + wave; j++) {
      var d = seed * 131 + i * 37 + j * 3;         // rule 6: j belongs to the mist, so a swell keeps its size as it drifts
      puffs.push([off + j * step + (dice(d) - 0.5) * step * 0.5, y0 - sw * 0.15, wave * (0.42 + 0.3 * dice(d + 1)), sw * (0.9 + 0.8 * dice(d + 2)), j]);
    }
    mistLay(brush, puffs, function (b, grow) { b.rect(left - 40, y0, right - left + 80, reach + grow); }, null,
            [left, y0 - sw * 2.2, right, y0 + reach], look, alpha * (0.55 + 0.45 * near), y0 - sw * 1.8, y0 + reach);
  }
}

// One band of mist across a slope, its middle at (x, y), "wide" long (rule
// 5). The look's names: tall (how high it swells: wide * 0.07), tilt (radians,
// to lie along a slope), colour, shade, glow, seed, alpha (0.8).
// brush: a canvas 2D context; x, y, wide: pixels of the sheet; t: the time in seconds; look: optional,
// the names just above. Returns nothing: it draws on brush (through MIST_SHEET), and leaves brush as
// it found it.
// e.g. mistBand(pen, 900, 520, 420, t, {tilt: -0.12});
function mistBand(brush, x, y, wide, t, look) {
  look = look || {};
  var seed = look.seed || 1, tall = look.tall || wide * 0.07, tilt = look.tilt || 0;
  var breathe = 1 + 0.05 * Math.sin(t * 0.35 + seed * 2.1);   // rule 6: it swells and settles
  var long = wide * breathe, humps = Math.max(3, Math.round(wide / 55)), puffs = [], n;   // how many swells, from its length at rest: as it breathes they stretch, and none comes or goes
  function env(u) { return Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.7); }   // it tapers to both ends
  for (n = 0; n < humps; n++) {
    var u = (n + 0.5) / humps, e = env(u), d = seed * 7 + n * 3;
    puffs.push([(u - 0.5) * long, -tall * 0.25 * e, long / humps * (0.62 + 0.3 * dice(d)) * (0.55 + 0.45 * e), tall * breathe * (0.55 + 0.5 * dice(d + 1)) * e + 1]);
  }
  function body(b, grow) {                         // flat below, a long lens from end to end
    b.moveTo(-long / 2, 0);
    for (var s = 0; s <= 30; s++) { b.lineTo((s / 30 - 0.5) * long, -grow); }
    for (s = 30; s >= 0; s--) { b.lineTo((s / 30 - 0.5) * long, tall * 0.3 * env(s / 30) + grow); }
    b.closePath();
  }
  var reach = long / 2 + tall * 2, lift = long / 2 * Math.abs(Math.sin(tilt)) + tall * 2.5;
  mistLay(brush, puffs, body, function (b) { b.translate(x, y); b.rotate(tilt); },
          [x - reach, y - lift, x + reach, y + lift], look, look.alpha === undefined ? 0.8 : look.alpha, -tall * 1.3, tall * 0.6);
}

// Bands of mist drifting across a mountain, inside the box left..right,
// top..bottom (rule 6): each at a depth that sets its length, its pace and
// how strong it is; it gathers as it drifts in at one side of the box and
// thins away as it leaves at the other, then comes round again. The
// look's names: left, right, top, bottom, count (5), wide (a near band's
// length: 380), drift (a near band's pixels a second: 9), tilt, seed, colour,
// shade, glow, alpha.
// brush: a canvas 2D context; t: the time in seconds; look: optional, the names just above (left 0,
// right WIDE, top 300, bottom 700, pixels of the sheet). Returns nothing: it draws on brush (through
// MIST_SHEET), and leaves brush as it found it.
// e.g. mistDrift(pen, t, {top: 360, bottom: 620, count: 4});
function mistDrift(brush, t, look) {
  look = look || {};
  var left = look.left || 0, right = look.right === undefined ? WIDE : look.right, top = look.top === undefined ? 300 : look.top;
  var bottom = look.bottom === undefined ? 700 : look.bottom, count = look.count || 5, seed = look.seed || 1, pace = look.drift === undefined ? 9 : look.drift;
  for (var n = 0; n < count; n++) {
    var k = 0.35 + 0.65 * dice(seed * 17 + n * 3), wide = (look.wide || 380) * (0.6 + 0.8 * dice(seed * 17 + n * 3 + 1)) * k;
    var room = right - left + wide, along = ((dice(seed * 17 + n * 3 + 2) * room + pace * k * t) % room + room) % room;
    var y = top + (bottom - top) * dice(seed * 19 + n);
    var come = between(along, 0, wide) * between(along, room, room - wide);   // it gathers as it comes in and thins as it leaves, so it never jumps at the box's edge (rule 6)
    mistBand(brush, left - wide / 2 + along, y, wide, t, {seed: seed * 31 + n, tall: wide * 0.07, tilt: look.tilt || 0, colour: look.colour,
                                                       shade: look.shade, glow: look.glow, alpha: (look.alpha === undefined ? 0.8 : look.alpha) * (0.45 + 0.55 * k) * come});
  }
}

// ---------- a cave's mouth ----------
// The cave of a tale on a mountain's side (the film of the creature with four ears and five eyes: its cave on
// Doi Khao Khwai). Drawn live, with the forest's own crowns before and over it, so the forest grows round it.
// The mouth of a cave in a mountain's side, its foot's middle on (x, y): a dark arched opening among
// boulders lit from the upper left, a ledge of stone before it, moss on the stones and ferns over the top
// that stir (look.t, the second). 250 wide and 135 high at size 1, the opening 120 by 92.
// look: t; rock (the stone's colour); dark (the inside's); tint, [colour, amount]: every colour of it
// blended that far toward one light (a dawn's blue, a dusk's red), as a set painted by day and tinted is.
//   brush   a canvas 2D context
//   x, y    the middle of its foot, pixels of the sheet
//   size    1 is 250 wide (needed)
//   look    optional: t (seconds, 0), rock ("#7d7266"), dark ("#0f0b0a", not tinted), tint
// Returns nothing: it draws with brush, and leaves brush as it found it.
// e.g. caveMouth(pen, 1100, 640, 1.4, {t: t, tint: ["#3a4a7a", 0.3]});
function caveMouth(brush, x, y, size, look) {
  look = look || {};
  function tone(c) { return look.tint ? blend(c, look.tint[0], look.tint[1]) : c; }
  var t = look.t || 0, rock = tone(look.rock || "#7d7266"), dark = look.dark || "#0f0b0a", n;
  var lit = blend(rock, "#f2e6cf", 0.16), deep = blend(rock, "#1c1612", 0.38), moss = tone("#5f7d3c");
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  function stone(points, colour) {                  // a boulder: a closed curve through the points, filled, lit and inked
    brush.beginPath();
    brush.moveTo((points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2);
    for (var k = 1; k <= points.length; k++) {
      var p = points[k % points.length], q = points[(k + 1) % points.length];
      brush.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    brush.closePath();
    var shade = brush.createLinearGradient(-110, -150, 60, 20);
    shade.addColorStop(0, blend(colour, "#f2e6cf", 0.3));
    shade.addColorStop(1, blend(colour, "#1c1612", 0.3));
    brush.fillStyle = shade;
    brush.fill();
    brush.strokeStyle = inkFor(colour);
    brush.lineWidth = 2.2 / Math.max(0.6, size);
    brush.lineJoin = "round";
    brush.stroke();
  }
  stone([[-118, 4], [-128, -60], [-96, -118], [-48, -128], [-56, -40], [-70, 6]], rock);   // the left jamb
  stone([[66, 6], [52, -50], [60, -112], [104, -116], [124, -54], [118, 6]], deep);        // the right jamb, in its own shade
  brush.beginPath();                                // the opening: an arch, dark, darkest deep in
  brush.moveTo(-62, 4);
  brush.bezierCurveTo(-70, -54, -40, -96, 4, -96);
  brush.bezierCurveTo(48, -96, 66, -52, 60, 4);
  brush.closePath();
  var inside = brush.createRadialGradient(4, -26, 6, 0, -40, 92);
  inside.addColorStop(0, dark);
  inside.addColorStop(0.7, blend(dark, deep, 0.25));
  inside.addColorStop(1, blend(dark, deep, 0.6));
  brush.fillStyle = inside;
  brush.fill();
  brush.strokeStyle = inkFor(deep);
  brush.lineWidth = 2.2 / Math.max(0.6, size);
  brush.stroke();
  stone([[-92, -100], [-70, -126], [0, -132], [72, -124], [98, -100], [40, -90], [-36, -90]], lit);   // the lintel over it: low, a face of rock
  stone([[-110, 2], [-80, -14], [40, -16], [112, -6], [96, 16], [-96, 16]], blend(rock, "#b8a890", 0.25));   // the ledge before it
  brush.fillStyle = moss;                           // moss along the tops of the stones
  [[-104, -112, 20], [-30, -128, 26], [50, -124, 22], [96, -104, 16], [-20, -12, 30]].forEach(function (m) {
    brush.beginPath();
    brush.ellipse(m[0], m[1], m[2], 5, -0.15, Math.PI, 0);
    brush.fill();
  });
  for (n = 0; n < 7; n++) {                         // ferns over the lintel, hanging, stirring a little
    var fx = -80 + n * 26, sway = 0.08 * Math.sin(t * 1.3 + n * 1.7), long = 30 + 10 * Math.sin(n * 2.1);
    brush.save();
    brush.translate(fx, -124 + 5 * Math.sin(n));
    brush.rotate(0.5 + 0.18 * (n - 3) / 3 + sway);
    brush.strokeStyle = tone("#41602c");
    brush.lineWidth = 2;
    brush.beginPath();
    brush.moveTo(0, 0);
    brush.quadraticCurveTo(long * 0.5, -6, long, 6);
    brush.stroke();
    brush.fillStyle = tone("#4f7a36");
    for (var leaf = 1; leaf <= 5; leaf++) {
      var u = leaf / 6, lx = long * u, ly = -6 * 4 * u * (1 - u) + 12 * u * u;
      [-1, 1].forEach(function (side) {
        brush.beginPath();
        brush.ellipse(lx, ly + side * 4, 6 * (1 - u * 0.5), 2.2, side * 0.6, 0, 7);
        brush.fill();
      });
    }
    brush.restore();
  }
  brush.restore();
}
