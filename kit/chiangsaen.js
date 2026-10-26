// chiangsaen.js - Chiang Saen and the things of its tale, Chang Ngu, for the Lanna cartoon kit: the city's wall and
// moat, the Mae Khong's sandbars with their scrub, reeds and birds, the limestone hill the elephant goes back into,
// and the tale's things (a forge, a sword and a fire-gun, the hook of bamboo, a carrying pole, a pan for gold, the gold
// vessels, a hanging cradle, Indra's wall, the statue's pool). Load it after oldcartoon.js. Each is a painter on a
// brush, as pieces.js's are: (brush, x, base or y, size, look), size 1 the kit's own scale, look optional, and t the
// film's second where something moves. Each was picked by the owner from candidates (2026-10-23: "try to be
// accurate"), and each comment says what it is drawn from. The novice's alms bowl is kit only: never in the maker.
//
//   cityWall(brush, x, base, wide, size, look)       the wall as Chiang Saen's was, a gate in its middle
//   karstHill(brush, x, base, size, look)            a tower of limestone out of the paddies, a cave at its foot
//   sandbar(brush, x, y, wide, tall, seed)           a bar of sand and gravel in the river
//   khraiNam(brush, x, base, size, t, seed)          khrai nam scrub, Homonoia riparia, on a sandbar or among rocks
//   riverReeds(brush, x, base, wide, size, t, seed)  tall reeds and wild cane along a bank
//   pratincole, riverLapwing, ringedPlover, redAvadavat (brush, x, y, size, look)   the birds of the sandbar
//   spotbill(brush, x, y, size, look)                the Indian spot-billed duck, swimming
//   forge, dap, fireGun, elephantHook, carryPole, goldPan, salung, goldPot, hangingCradle, almsBowl, risingWall,
//   statuePool: the tale's things, each below.
//   whiteEel(x, y, t, look)                          the white eel of Wiang Nong Lom, swimming or caught (needs naga.js)

var CHIANGSAEN_KIT = ["cityWall", "karstHill", "sandbar", "khraiNam", "riverReeds", "pratincole", "riverLapwing",
                      "ringedPlover", "redAvadavat", "spotbill", "forge", "dap", "fireGun", "elephantHook", "carryPole",
                      "goldPan", "salung", "goldPot", "hangingCradle", "almsBowl", "risingWall", "statuePool", "whiteEel"];

// A vertical gradient over a rectangle, top colour to bottom colour, filled with brush.
// e.g. csBand(pen, 0, 700, WIDE, 200, "#a8906a", "#7e6546");
function csBand(brush, x, y, wide, tall, top, bottom) {
  var g = brush.createLinearGradient(0, y, 0, y + tall);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  brush.fillStyle = g;
  brush.fillRect(x, y, wide, tall);
}

// ---------- the city wall ----------
// The wall of a city as Chiang Saen's was, after Hans Penth, "Again: the fortifications of Chiang San" (JSS 63.2,
// 1975), from Hallett (1884) and Hosseus (1904): a double wall, "the higher wall facing the town, the lower wall the
// outside", a moat between; the high rampart "at its inner side ... of bricks, while its outer side is surrounded by a
// palisade" of teak (Hallett: "a strong teak palisade 6 feet high"), its top crenellated. Seen from outside: the low
// outer rampart of earth nearest, the moat, the high rampart's earth face behind its palisade, a parapet of brick on
// top. A gate in its middle (look.gate, true unless false): how a gate looked is not known ("we do not know what a
// gate looked like in those times"), so this claims the least: a passage through the rampart, lined with brick,
// under the parapet, two teak doors, a bridge of timber over the moat. Along the river there was no wall (the Mae
// Khong was the east moat). The owner's pick, 2026-10-23 (of three gates).
//   x, base: the left end and the foot of the high rampart (the moat's edge); wide: pixels; size: 1 is a rampart 150
//   pixels high; look: gate (true), open (0 shut to 1 open; 0), outer (true: the low outer rampart and the moat), plain
//   (true: a village's defences, earth and timber only, no brick: the chronicle's Wiang Phan, a moat dug and filled
//   and "ประตูหับไข", gates that open and shut), t (seconds, the moat's ripples: 0).
// e.g. cityWall(pen, 200, 820, 1500, 1, {open: 0.8});
function cityWall(brush, x, base, wide, size, look) {
  look = look || {};
  var s = size, top = base - 150 * s, gx = x + wide / 2, gw = 96 * s, n;
  var gate = look.gate !== false, open = look.open || 0;
  // In depth (owner, 2026-10-26: "make the ... brick wall look more 3D ... It just needs to have thickness"): the earth
  // face shaded toward its foot, each merlon with its lit top and its side in shade, the passage of the gate with its
  // sides and the town's daylight beyond as the doors open, shade where the wall meets the moat, and the moat a water
  // that mirrors the wall (scenery.js's way) where it was a band of waves.
  var face = brush.createLinearGradient(0, top + 20 * s, 0, base);
  face.addColorStop(0, "#949a5a"); face.addColorStop(1, "#727a44");
  brush.fillStyle = face;                                                   // the high rampart, its earth face
  brush.beginPath(); brush.moveTo(x, base); brush.lineTo(x + 30 * s, top + 20 * s); brush.lineTo(x + wide - 30 * s, top + 20 * s);
  brush.lineTo(x + wide, base); brush.closePath(); brush.fill();
  brush.strokeStyle = "rgba(60, 80, 30, 0.35)";                             // grass growing on it, in short strokes
  brush.lineWidth = 1.2 * s;
  for (n = 0; n < wide / (6 * s); n++) {
    var gx0 = x + 30 * s + dice(n * 3 + 1) * (wide - 60 * s), gy0 = top + 30 * s + dice(n * 5 + 2) * (base - top - 34 * s), gl = (3 + 4 * dice(n)) * s;
    brush.beginPath(); brush.moveTo(gx0, gy0); brush.lineTo(gx0 + (dice(n + 9) - 0.5) * 2 * s, gy0 - gl); brush.stroke();
  }
  if (!look.plain) {
    csBand(brush, x + 30 * s, top - 14 * s, wide - 60 * s, 34 * s, "#b5664a", "#9a5440");   // the brick parapet
    brush.fillStyle = "rgba(255, 226, 190, 0.35)";                          // its coping, lit
    brush.fillRect(x + 30 * s, top - 14 * s, wide - 60 * s, 3 * s);
    brush.fillStyle = "rgba(50, 24, 14, 0.3)";                              // its shade on the earth below
    brush.fillRect(x + 30 * s, top + 20 * s, wide - 60 * s, 6 * s);
    for (n = x + 30 * s; n < x + wide - 40 * s; n += 28 * s) {              // the merlons: face, lit top, side in shade
      brush.fillStyle = "#b5664a"; brush.fillRect(n, top - 30 * s, 16 * s, 18 * s);
      brush.fillStyle = "#d69a76";
      brush.beginPath(); brush.moveTo(n, top - 30 * s); brush.lineTo(n + 16 * s, top - 30 * s);
      brush.lineTo(n + 20 * s, top - 33 * s); brush.lineTo(n + 4 * s, top - 33 * s); brush.closePath(); brush.fill();
      brush.fillStyle = "#87452f";
      brush.beginPath(); brush.moveTo(n + 16 * s, top - 30 * s); brush.lineTo(n + 20 * s, top - 33 * s);
      brush.lineTo(n + 20 * s, top - 15 * s); brush.lineTo(n + 16 * s, top - 12 * s); brush.closePath(); brush.fill();
    }
    brush.strokeStyle = "rgba(70, 30, 20, 0.35)";
    brush.lineWidth = 1;
    for (n = top - 12 * s; n < top + 20 * s; n += 8 * s) { brush.beginPath(); brush.moveTo(x + 30 * s, n); brush.lineTo(x + wide - 30 * s, n); brush.stroke(); }
  }
  for (n = x + 20 * s; n < x + wide - 20 * s; n += 11 * s) {                // the teak palisade on the outer slope
    if (gate && Math.abs(n - gx) < gw / 2 + 10 * s) { continue; }
    var foot = base - 40 * s - 50 * s * Math.min(1, Math.min(n - x, x + wide - n) / (60 * s));
    brush.fillStyle = "#7a5432";
    brush.fillRect(n, foot - 52 * s, 7 * s, 52 * s);
    brush.beginPath(); brush.moveTo(n, foot - 52 * s); brush.lineTo(n + 3.5 * s, foot - 60 * s); brush.lineTo(n + 7 * s, foot - 52 * s); brush.fill();
    brush.fillStyle = "#57391f";                                            // each post's shaded side
    brush.fillRect(n + 4.5 * s, foot - 52 * s, 2.5 * s, 52 * s);
  }
  if (gate) {
    var inset = 16 * s, deep = 10 * s;                                      // how far the passage's far end is set in
    brush.fillStyle = look.plain ? "#6a4a2a" : "#9a5440";                    // the lining of the passage: brick, or timber
    brush.fillRect(gx - gw / 2 - 12 * s, base - 116 * s, gw + 24 * s, 116 * s);
    brush.fillStyle = "#2a2018";
    brush.fillRect(gx - gw / 2, base - 104 * s, gw, 104 * s);
    brush.fillStyle = look.plain ? "#c9b48a" : "#d8c49a";                   // the town's daylight at the far end
    brush.fillRect(gx - gw / 2 + inset, base - 104 * s + deep, gw - 2 * inset, 104 * s - deep);
    brush.fillStyle = look.plain ? "#4a3420" : "#6e3a28";                   // the passage's sides, going in
    brush.beginPath(); brush.moveTo(gx - gw / 2, base - 104 * s); brush.lineTo(gx - gw / 2 + inset, base - 104 * s + deep);
    brush.lineTo(gx - gw / 2 + inset, base); brush.lineTo(gx - gw / 2, base); brush.closePath(); brush.fill();
    brush.fillStyle = look.plain ? "#3a2818" : "#56301f";
    brush.beginPath(); brush.moveTo(gx + gw / 2, base - 104 * s); brush.lineTo(gx + gw / 2 - inset, base - 104 * s + deep);
    brush.lineTo(gx + gw / 2 - inset, base); brush.lineTo(gx + gw / 2, base); brush.closePath(); brush.fill();
    brush.fillStyle = "#2a2018";                                            // its ceiling
    brush.beginPath(); brush.moveTo(gx - gw / 2, base - 104 * s); brush.lineTo(gx + gw / 2, base - 104 * s);
    brush.lineTo(gx + gw / 2 - inset, base - 104 * s + deep); brush.lineTo(gx - gw / 2 + inset, base - 104 * s + deep); brush.closePath(); brush.fill();
    brush.fillStyle = "#7a4a26";                                            // the two teak doors, swung in
    var leaf = (gw / 2) * (1 - 0.85 * open);
    brush.fillRect(gx - gw / 2, base - 104 * s, leaf, 104 * s);
    brush.fillRect(gx + gw / 2 - leaf, base - 104 * s, leaf, 104 * s);
    brush.strokeStyle = "#4a2c14"; brush.lineWidth = 2 * s;
    brush.strokeRect(gx - gw / 2, base - 104 * s, leaf, 104 * s);
    brush.strokeRect(gx + gw / 2 - leaf, base - 104 * s, leaf, 104 * s);
  }
  if (look.outer !== false) {
    var moat = brush.createLinearGradient(0, base, 0, base + 46 * s);       // the moat: still water, the wall mirrored in it
    moat.addColorStop(0, "#4f7a76"); moat.addColorStop(1, "#3a6260");
    brush.fillStyle = moat;
    brush.fillRect(x - 10 * s, base, wide + 20 * s, 46 * s);
    if (typeof natReflect === "function") {                                 // a page with the scenery's painters (pinewoods.js)
      var keep = pen;
      pen = brush;                                                          // natReflect() draws with pen
      natReflect(look.t || 0, base, {left: x - 10 * s, right: x + wide + 10 * s, foot: base + 46 * s, ripple: 0.4, tint: "30, 64, 60",
                                      deep: 0.55, sheen: Math.round(wide / 60), line: 0.4});
      pen = keep;
    } else {
      waves(brush, x - 10 * s, base + 4 * s, wide + 20 * s, 40 * s, "rgba(240, 250, 240, 0.35)", look.t || 0);
    }
    if (gate) { brush.fillStyle = "#8a6a44"; brush.fillRect(gx - 34 * s, base - 2 * s, 68 * s, 48 * s); }   // the bridge
    brush.fillStyle = "#93ab5e";                                            // the low outer rampart, nearest us
    brush.beginPath(); brush.moveTo(x - 10 * s, base + 76 * s); brush.lineTo(x - 10 * s, base + 52 * s);
    brush.quadraticCurveTo(x + wide / 2, base + 38 * s, x + wide + 10 * s, base + 52 * s);
    brush.lineTo(x + wide + 10 * s, base + 76 * s); brush.closePath(); brush.fill();
  }
}

// ---------- Doi Chang Ngu ----------
// A tower of grey limestone standing up out of the paddies, sheer cliffs streaked by the rain, forest on its top and on
// a ledge, a cave at its foot: the karst of the north (Doi Chiang Dao, a limestone massif with vertical cliffs; GEOLEX,
// "Doi Chiang Dao Limestone Fm": pale-grey massive limestone). Doi Chang Ngu stands "in the middle of the plain"
// (the chronicle) and the elephant goes into it as a snake. The owner's pick, 2026-10-23 (of three landforms).
//   x, base: the middle of its foot; size 1 is 300 wide and 220 high; look: cave (true).
// e.g. karstHill(pen, 1200, 880, 1.6, {});
function karstHill(brush, x, base, size, look) {
  look = look || {};
  var s = size, half = 150 * s, tall = 220 * s, pts = [], k;
  for (k = 0; k <= 40; k++) {
    var u = k / 40;
    var up = Math.min(1, Math.pow(Math.sin(Math.PI * u), 0.25)) * (0.9 + 0.1 * Math.sin(u * 9));
    pts.push([x - half + u * 2 * half, base - tall * up - 18 * s * (dice(k + 4) - 0.5)]);
  }
  var g = brush.createLinearGradient(x - half, 0, x + half, 0);
  g.addColorStop(0, "#d2cfc2"); g.addColorStop(0.6, "#a8a598"); g.addColorStop(1, "#86837a");
  brush.fillStyle = g;
  brush.beginPath(); brush.moveTo(pts[0][0], base);
  pts.forEach(function (p) { brush.lineTo(p[0], p[1]); });
  brush.lineTo(pts[40][0], base); brush.closePath(); brush.fill();
  brush.strokeStyle = "rgba(90, 86, 76, 0.45)";                             // streaks where the rain runs down
  brush.lineWidth = 2 * s;
  for (k = 3; k < 38; k += 3) { brush.beginPath(); brush.moveTo(pts[k][0], pts[k][1] + 10 * s); brush.lineTo(pts[k][0] + 3 * s, base - 8 * s - 30 * s * dice(k)); brush.stroke(); }
  if (typeof natBush === "function") {                                      // a page with the scenery's painters: the
    var keep = pen, pool = [0, 1, 2].map(function (m) {                     // forest painted as a mountain's is (2026-10-26)
      return natBush(200, 110, 610 + m, THK_SHADE.map(function (g) { return blend(g, "#7a8a3a", 0.1 * m); }), [], PIX);
    });
    pen = brush;
    for (k = 2; k <= 38; k += 2) { thkPlace(pool[k % 3], pts[k][0], pts[k][1] + 10 * s, (0.16 + 0.05 * dice(k)) * s, 0); }
    for (k = 0; k < 6; k++) { thkPlace(pool[k % 3], x - 84 * s + k * 18 * s, base - tall * 0.5 + 8 * s, 0.13 * s, 0); }   // a ledge
    pen = keep;
  } else {
    for (k = 2; k <= 38; k += 2) {                                          // the forest on its top
      for (var j = 0; j < 3; j++) {
        brush.fillStyle = ["#5d8c44", "#79a856", "#4a7638"][(k + j) % 3];
        brush.beginPath(); brush.arc(pts[k][0] + (j - 1) * 8 * s, pts[k][1] - 4 * s - 6 * s * dice(k * 3 + j), (8 + 4 * dice(k + j)) * s, 0, 7); brush.fill();
      }
    }
    for (k = 0; k < 9; k++) {                                               // a ledge of trees across its face
      brush.fillStyle = ["#5d8c44", "#4a7638"][k % 2];
      brush.beginPath(); brush.arc(x - 90 * s + k * 14 * s, base - tall * 0.5 - 4 * s * dice(k), 8 * s, 0, 7); brush.fill();
    }
  }
  if (look.cave !== false) {                                                // the cave at its foot
    brush.fillStyle = "#1e1c18";
    brush.beginPath(); brush.moveTo(x - 24 * s, base); brush.quadraticCurveTo(x - 22 * s, base - 66 * s, x + 10 * s, base - 72 * s);
    brush.quadraticCurveTo(x + 40 * s, base - 52 * s, x + 44 * s, base); brush.closePath(); brush.fill();
  }
}

// ---------- the Mae Khong's sandbars ----------
// The river at Chiang Saen in the dry season, as thaibirding.com's Chiang Saen page and BirdLife's factsheet for the
// Mekong channel near Pakchom have it: bars of sand and gravel, "the larger sandbanks ... covered in Homonoia riparia
// scrub", small pratincoles "if there is any sand or gravel exposed", the river lapwing, little ringed plovers,
// spot-billed ducks "often easily seen on the river", and prinias and red avadavats in the fringing grass, which
// "drink and bathe in the river's margins". The owner's pick, 2026-10-23.

// A bar of sand and gravel in the river, from x to x + wide, its top at y, tall pixels to the water; pebbles on it.
// e.g. sandbar(pen, 600, 760, 700, 50, 3);
function sandbar(brush, x, y, wide, tall, seed) {
  brush.fillStyle = "#d9c79a";
  brush.beginPath(); brush.moveTo(x, y + tall); brush.quadraticCurveTo(x + wide * 0.15, y, x + wide * 0.5, y + 2);
  brush.quadraticCurveTo(x + wide * 0.85, y + 1, x + wide, y + tall); brush.closePath(); brush.fill();
  brush.fillStyle = "#c2ad80";
  brush.beginPath(); brush.moveTo(x + wide * 0.1, y + tall); brush.quadraticCurveTo(x + wide * 0.5, y + tall * 0.4, x + wide * 0.9, y + tall); brush.fill();
  for (var p = 0; p < wide / 9; p++) {
    brush.fillStyle = ["#9a8a70", "#b0a088", "#7d7060"][p % 3];
    brush.beginPath(); brush.arc(x + wide * (0.1 + 0.8 * dice(seed + p)), y + tall * (0.4 + 0.5 * dice(seed * 2 + p)), 2 + 2 * dice(p), 0, 7); brush.fill();
  }
}

// Khrai nam (ไคร้น้ำ, Homonoia riparia; PROSEA: a shrub 1 to 4 m, planted to hold river banks): a clump of willow-like
// stems leaning downstream, narrow grey-green leaves, moving a little with t. Its foot at (x, base); size 1 is 150
// pixels tall; seed varies the clump. e.g. khraiNam(pen, 1300, 780, 0.6, t, 1);
function khraiNam(brush, x, base, size, t, seed) {
  var lean = 0.25 + 0.05 * Math.sin((t || 0) * 1.3 + seed);
  for (var s = 0; s < 9; s++) {
    var sx = x + (dice(seed * 13 + s) - 0.5) * 60 * size, tall = (90 + 70 * dice(seed * 7 + s)) * size;
    var tx = sx + tall * lean * (0.6 + 0.6 * dice(s + seed)), ty = base - tall;
    brush.strokeStyle = "#6a5a40";
    brush.lineWidth = 2.2 * size;
    brush.beginPath(); brush.moveTo(sx, base); brush.quadraticCurveTo(sx + tall * lean * 0.2, base - tall * 0.6, tx, ty); brush.stroke();
    for (var l = 0; l < 7; l++) {
      var u = 0.35 + l * 0.09, lx = sx + (tx - sx) * u, ly = base + (ty - base) * u, side = l % 2 ? 1 : -1;
      brush.fillStyle = ["#8a9e7a", "#a7b892", "#6f8662"][(l + s) % 3];
      brush.beginPath(); brush.ellipse(lx + side * 9 * size, ly, 13 * size, 3.2 * size, side * 0.5 + lean, 0, 7); brush.fill();
    }
  }
}

// Tall reeds and wild cane along a bank from x to x + wide, their feet on base, the plumes nodding with t.
// e.g. riverReeds(pen, 0, 900, 600, 1, t, 2);
function riverReeds(brush, x, base, wide, size, t, seed) {
  for (var r = 0; r < wide / 7; r++) {
    var rx = x + r * 7 + 4 * dice(seed + r), tall = (110 + 70 * dice(seed * 3 + r)) * size;
    var sway = 6 * Math.sin((t || 0) * 1.1 + r * 0.4) * size;
    brush.strokeStyle = r % 3 ? "#7f8f4a" : "#9aa65a";
    brush.lineWidth = 2;
    brush.beginPath(); brush.moveTo(rx, base); brush.quadraticCurveTo(rx + 3, base - tall * 0.6, rx + sway, base - tall); brush.stroke();
    if (r % 4 === 0) {
      brush.fillStyle = "rgba(236, 226, 200, 0.85)";
      brush.beginPath(); brush.ellipse(rx + sway + 4, base - tall - 12 * size, 5 * size, 16 * size, 0.3, 0, 7); brush.fill();
    }
  }
}

// One small bird of the sandbar, the shared shape (owner, 2026-10-25: "Upgrade the quality of the birds ... Add detail
// and make sure the birds have eyes"; the pick of three, C): a teardrop body tilted with the peck, pale below, a neck
// into a round head, a folded wing with pale feather edges and its dark primaries past the tail, a tail, two legs bent
// back at the ankle with three toes each, a shadow on the sand; in flight long pointed wings bent at the wrist, dark at
// the tips, a wader's legs trailing. The eye is drawn last, over any cap or mask, with a ring and a light, so it always
// shows. c holds its colours and parts: legs (how long), back, belly, head, bill, wing, tip (the primaries), leg,
// tail (how long), billLong, ring (the eye's ring, pale unless told), tailBand (a dark end to the tail), breast(b) and
// mark(b, legs, hx, hy) (its markings, on the body and on the head). look: face (1 right, -1 left), peck (0 to 1: its
// head down to the sand), fly (true: in the air, wings beating with t), t.
function csBird(brush, x, y, size, look, c) {
  look = look || {};
  var face = look.face || 1, peck = look.peck || 0, t = look.t || 0, fly = !!look.fly;
  var legs = fly ? 0 : c.legs, ink = "rgba(38, 28, 20, 0.8)", by = -legs - 10;
  var wing = c.wing || c.back, tip = c.tip || "#2a221c";
  brush.save(); brush.translate(x, y); brush.scale(face * size, size);
  brush.lineCap = "round"; brush.lineJoin = "round";
  if (!fly) {                                                            // its shadow on the sand
    brush.fillStyle = "rgba(60, 44, 24, 0.18)"; brush.beginPath(); brush.ellipse(0, 1, 15, 2.6, 0, 0, 7); brush.fill();
  }
  var beat = Math.sin(t * 16);
  var flyWing = function (far) {                                         // a long pointed wing, bent at the wrist
    var amp = far ? 0.75 : 1, wy = by - 4, wx = 1;
    var wrist = [wx - 6, wy - 16 * beat * amp], end = [wx - 22, wy - (30 * beat + 4) * amp];
    var outline = function () {
      brush.beginPath(); brush.moveTo(wx + 5, wy);
      brush.quadraticCurveTo(wrist[0] + 6, wrist[1] - 2 * Math.sign(beat || 1), wrist[0], wrist[1]);
      brush.lineTo(end[0], end[1]);
      brush.quadraticCurveTo(wrist[0] - 6, (wrist[1] + wy) / 2 + 3, wx - 10, wy + 1);
      brush.closePath();
    };
    outline(); brush.fillStyle = wing; brush.fill();
    if (far) { brush.fillStyle = "rgba(0, 0, 0, 0.22)"; brush.fill(); }  // the far wing, in the body's shade
    brush.fillStyle = tip;                                               // the dark primaries at the tip
    brush.beginPath(); brush.moveTo(wrist[0], wrist[1]); brush.lineTo(end[0], end[1]);
    brush.lineTo(wrist[0] * 0.45 + end[0] * 0.55 + 3, wrist[1] * 0.45 + end[1] * 0.55 + 4); brush.closePath(); brush.fill();
    outline(); brush.strokeStyle = ink; brush.lineWidth = 0.8; brush.stroke();
  };
  if (fly) { flyWing(true); }
  if (!fly) {                                                            // the legs, bent back at the ankle, three toes
    brush.strokeStyle = c.leg; brush.lineWidth = 1.5;
    [-2, 3].forEach(function (lx) {
      var ankle = [lx - 2.5, by + 5 + (legs + 5) * 0.5], foot = [lx + 1, 0];
      brush.beginPath(); brush.moveTo(lx, by + 5); brush.lineTo(ankle[0], ankle[1]); brush.lineTo(foot[0], foot[1]);
      brush.moveTo(foot[0], foot[1]); brush.lineTo(foot[0] + 5, foot[1] + 0.3);
      brush.moveTo(foot[0], foot[1]); brush.lineTo(foot[0] + 3, foot[1] + 1.4);
      brush.moveTo(foot[0], foot[1]); brush.lineTo(foot[0] - 3, foot[1] + 0.3); brush.stroke();
    });
  } else if (c.legs > 15) {                                              // a wader's legs trail behind in flight
    brush.strokeStyle = c.leg; brush.lineWidth = 1.4;
    brush.beginPath(); brush.moveTo(-8, by + 3); brush.lineTo(-30 - c.tail, by + 5); brush.moveTo(-8, by + 4); brush.lineTo(-29 - c.tail, by + 7); brush.stroke();
  }
  brush.save(); brush.translate(0, by); brush.rotate(-0.08 + 0.38 * peck);
  var tail = function () {
    brush.beginPath(); brush.moveTo(-12, -4); brush.lineTo(-24 - c.tail, -2.5); brush.lineTo(-24 - c.tail, 1.5); brush.lineTo(-12, 3); brush.closePath();
  };
  tail(); brush.fillStyle = c.back; brush.fill();                        // the tail
  if (c.tailBand) { brush.fillStyle = c.tailBand; brush.fillRect(-24 - c.tail, -2.5, 3.5, 4); }
  tail(); brush.strokeStyle = ink; brush.lineWidth = 0.8; brush.stroke();
  var body = function () {
    brush.beginPath(); brush.moveTo(16, -3);
    brush.bezierCurveTo(15, -11, 3, -12, -7, -8.5);
    brush.bezierCurveTo(-13, -6, -17, -2, -18, 0);
    brush.bezierCurveTo(-12, 5, -2, 9.5, 6, 8.5);
    brush.bezierCurveTo(13, 7.5, 16.5, 3, 16, -3); brush.closePath();
  };
  body(); brush.fillStyle = c.back; brush.fill();
  brush.save(); body(); brush.clip();
  brush.fillStyle = c.belly; brush.beginPath(); brush.ellipse(5, 7.5, 15, 7.5, -0.12, 0, 7); brush.fill();
  if (c.breast) { c.breast(brush); }
  brush.fillStyle = "rgba(255, 255, 255, 0.22)"; brush.beginPath(); brush.ellipse(4, -7, 9, 2.5, -0.1, 0, 7); brush.fill();   // light on the back
  brush.restore();
  body(); brush.strokeStyle = ink; brush.lineWidth = 0.9; brush.stroke();
  if (!fly) {                                                            // the folded wing, its primaries past the tail
    var folded = function () {
      brush.beginPath(); brush.moveTo(10, -6);
      brush.bezierCurveTo(4, -10, -8, -9, -14, -4);
      brush.lineTo(-25 - c.tail * 0.6, -1.5);
      brush.bezierCurveTo(-14, 1.5, -2, 2, 10, -6); brush.closePath();
    };
    folded(); brush.fillStyle = wing; brush.fill();
    brush.fillStyle = tip; brush.beginPath(); brush.moveTo(-14, -4); brush.lineTo(-25 - c.tail * 0.6, -1.5); brush.lineTo(-13, 0.5); brush.closePath(); brush.fill();
    brush.strokeStyle = "rgba(255, 250, 235, 0.55)"; brush.lineWidth = 0.6;   // the coverts' pale edges
    [[6, -6], [1, -6.5], [-4, -6]].forEach(function (p) { brush.beginPath(); brush.arc(p[0], p[1] + 2.5, 2.4, 0.2, Math.PI - 0.2); brush.stroke(); });
    folded(); brush.strokeStyle = ink; brush.lineWidth = 0.8; brush.stroke();
  }
  brush.restore();
  var hx = 14 - 4 * peck, hy = -legs - 19 + 14 * peck;
  brush.fillStyle = c.head;                                              // the neck into the head
  brush.beginPath(); brush.moveTo(7, by - 7); brush.quadraticCurveTo(hx - 4, hy + 2, hx - 5, hy + 1); brush.lineTo(hx + 3, hy + 5); brush.quadraticCurveTo(14, by - 1, 14, by + 1); brush.closePath(); brush.fill();
  brush.beginPath(); brush.arc(hx, hy, 6.6, 0, 7); brush.fill();
  brush.strokeStyle = ink; brush.lineWidth = 0.9; brush.beginPath(); brush.arc(hx, hy, 6.6, -2.4, 0.7); brush.stroke();
  if (c.mark) { c.mark(brush, legs, hx, hy); }
  brush.fillStyle = c.bill;                                              // the bill, a little curved, tapering
  brush.beginPath(); brush.moveTo(hx + 5.5, hy - 1.8);
  brush.quadraticCurveTo(hx + 6 + c.billLong * 0.6, hy - 1.5 + 2 * peck, hx + 6.5 + c.billLong, hy + 0.8 + 3 * peck);
  brush.quadraticCurveTo(hx + 6 + c.billLong * 0.5, hy + 1.5 + 2 * peck, hx + 5.5, hy + 1.8); brush.closePath(); brush.fill();
  brush.fillStyle = c.ring || "#fbf8ef"; brush.beginPath(); brush.arc(hx + 2, hy - 1, 2.85, 0, 7); brush.fill();   // the eye, last
  brush.fillStyle = "#14100c"; brush.beginPath(); brush.arc(hx + 2.3, hy - 1, 1.75, 0, 7); brush.fill();
  brush.fillStyle = "#ffffff"; brush.beginPath(); brush.arc(hx + 2.8, hy - 1.6, 0.67, 0, 7); brush.fill();
  if (fly) { flyWing(false); }
  brush.restore();
}

// The small pratincole: sandy grey, a buff breast, a black line from the bill through the eye, a short black bill,
// short legs, dark wingtips and a dark end to the tail; it sits close on the sand and flies like a swallow. At (x, y),
// its feet. e.g. pratincole(pen, 700, 770, 1, {face: -1, t: t});
function pratincole(brush, x, y, size, look) {
  csBird(brush, x, y, size, look, {legs: 6, back: "#b8ab94", belly: "#efe7d6", head: "#b8ab94", bill: "#2a2420", wing: "#8a7e6a",
    tip: "#2e2a26", leg: "#3a3430", tail: 4, billLong: 5, tailBand: "#2a2420",
    breast: function (b) { b.fillStyle = "#d8c8a8"; b.beginPath(); b.ellipse(12, 1, 6, 5, 0, 0, 7); b.fill(); },
    mark: function (b, legs, hx, hy) {
      b.strokeStyle = "#1a1612"; b.lineWidth = 1.2; b.beginPath(); b.moveTo(hx + 6, hy - 0.5); b.lineTo(hx - 5, hy + 1.5); b.stroke(); }});
}

// The river lapwing: a black cap and throat, a white cheek, a grey breast, a grey-brown back, a white belly with a
// black patch, black wingtips and tail end, long black legs. e.g. riverLapwing(pen, 900, 770, 1, {face: 1});
function riverLapwing(brush, x, y, size, look) {
  csBird(brush, x, y, size, look, {legs: 22, back: "#9a8a70", belly: "#f4f2ea", head: "#f0ece2", bill: "#1a1612", wing: "#8a7a62",
    tip: "#1a1612", leg: "#1a1612", tail: 0, billLong: 7, tailBand: "#1a1612",
    breast: function (b) {
      b.fillStyle = "#8e8a80"; b.beginPath(); b.ellipse(12, 0, 5, 6, 0, 0, 7); b.fill();
      b.fillStyle = "#1a1612"; b.beginPath(); b.ellipse(3, 4, 3.4, 2.6, 0, 0, 7); b.fill(); },
    mark: function (b, legs, hx, hy) {
      b.fillStyle = "#1a1612"; b.beginPath(); b.arc(hx, hy - 1.5, 6.7, Math.PI * 0.95, Math.PI * 2.05); b.closePath(); b.fill();   // the cap
      b.beginPath(); b.moveTo(hx + 1, hy + 3); b.lineTo(hx + 4, hy + 3.5); b.lineTo(hx + 1, hy + 11); b.lineTo(hx - 2, hy + 10); b.closePath(); b.fill(); }});   // the throat
}

// The little ringed plover: a brown back, a white collar and a black band across the breast, a black mask under a
// white brow, a yellow ring round the eye, yellow legs. e.g. ringedPlover(pen, 640, 775, 1, {peck: 0.6});
function ringedPlover(brush, x, y, size, look) {
  csBird(brush, x, y, size, look, {legs: 10, back: "#a08868", belly: "#f6f2e8", head: "#a08868", bill: "#1a1612", wing: "#957c5e",
    tip: "#3a2e24", leg: "#c9a84a", tail: 2, billLong: 4, ring: "#f2d23a",
    breast: function (b) { b.fillStyle = "#1a1612"; b.beginPath(); b.ellipse(12, 0, 4, 7, 0.2, 0, 7); b.fill(); },
    mark: function (b, legs, hx, hy) {
      b.fillStyle = "#f6f2e8"; b.beginPath(); b.ellipse(hx + 1, hy + 4.5, 6, 2.2, 0, 0, 7); b.fill();   // the white collar
      b.fillStyle = "#1a1612"; b.beginPath(); b.moveTo(hx + 6, hy - 3); b.lineTo(hx - 2, hy - 2.5); b.lineTo(hx - 3, hy + 1); b.lineTo(hx + 5, hy + 0.5); b.closePath(); b.fill();   // the mask
      b.fillStyle = "#f6f2e8"; b.fillRect(hx + 1, hy - 6, 4.5, 2.4); }});   // the white brow
}

// The red avadavat: a tiny finch, the male crimson with white spots and a red bill; drinking at the margin.
// e.g. redAvadavat(pen, 500, 900, 1, {peck: 0.8});
function redAvadavat(brush, x, y, size, look) {
  csBird(brush, x, y, size * 0.55, look, {legs: 6, back: "#c0303a", belly: "#a02a32", head: "#c8343e", bill: "#e04a3a",
    leg: "#b08a7a", tail: 2, billLong: 4, mark: function (b, legs) {
      b.fillStyle = "#fff"; [[-4, -legs - 12], [2, -legs - 7], [-8, -legs - 6]].forEach(function (p) { b.beginPath(); b.arc(p[0], p[1], 1.3, 0, 7); b.fill(); }); }});
}

// The Indian spot-billed duck, swimming (owner, 2026-10-26: "The 2 birds in the water could use a lot more detail"; the
// pick B, drawn from photographs of the bird): a pale head and a long pale neck finely streaked, a dark crown and a
// dark stripe through the eye, the red spot at the base of the bill, the black bill tipped yellow; the flanks dark,
// each feather edged pale like scales, the breast paler and spotted; the folded wing dark, the white tertials a patch
// at the rear, the green speculum edged white, the tail black and cocked. Shaded from above, its reflection under it
// broken by the water, a small wake behind it; it bobs with t. At (x, y), the waterline; size 1 about 70 across.
// e.g. spotbill(pen, 300, 800, 1, {face: 1, t: t});
function spotbill(brush, x, y, size, look) {
  look = look || {};
  var face = look.face || 1, t = look.t || 0, bob = Math.sin(t * 2 + x) * 1.5, k;
  function body() {
    brush.beginPath();
    brush.moveTo(26, -1);
    brush.bezierCurveTo(28, -8, 24, -14, 14, -15);         // breast up to the shoulder
    brush.bezierCurveTo(2, -17, -16, -17, -28, -14);        // the back
    brush.lineTo(-40, -19);                                 // the tail's point, cocked up
    brush.lineTo(-33, -9);
    brush.bezierCurveTo(-28, -3, -20, 0, -12, 1);           // the stern into the water
    brush.lineTo(24, 1);
    brush.closePath();
  }
  function neckHead(pale) {
    brush.fillStyle = pale;
    brush.beginPath();                                      // the neck, long and upright
    brush.moveTo(11, -12); brush.bezierCurveTo(13, -24, 15, -32, 16.5, -38);
    brush.lineTo(24, -38); brush.bezierCurveTo(22.5, -30, 23.5, -20, 25.5, -8); brush.closePath(); brush.fill();
    brush.beginPath(); brush.ellipse(21, -41, 8.5, 7, -0.15, 0, 7); brush.fill();   // the head
  }
  brush.save();
  brush.translate(x, y + bob);
  brush.scale(face * size, size);
  brush.save();                                             // the reflection: the duck upside down, dim, in slices
  brush.globalAlpha = 0.28;
  for (k = 0; k < 6; k++) {
    brush.save();
    brush.beginPath(); brush.rect(-50, 1 + k * 4, 100, 4); brush.clip();
    brush.translate(Math.sin(t * 3 + k * 1.7) * 1.6, 2);
    brush.scale(1, -0.8);
    neckHead("#cfc2a6"); brush.fillStyle = "#4a3828"; body(); brush.fill();
    brush.restore();
  }
  brush.restore();
  brush.strokeStyle = "rgba(240, 232, 214, 0.45)";        // the wake, two lines opening behind it
  brush.lineWidth = 1;
  [3.5, 6].forEach(function (open, i) {
    brush.beginPath(); brush.moveTo(-12, 1 + i); brush.quadraticCurveTo(-30, open, -52, open + 2 + Math.sin(t * 2 + i)); brush.stroke(); });
  var neck = brush.createLinearGradient(10, -48, 26, -10);
  neck.addColorStop(0, "#f0e6d0"); neck.addColorStop(1, "#cbbd9e");
  neckHead(neck);
  var shade = brush.createLinearGradient(0, -18, 0, 2);
  shade.addColorStop(0, "#6a5240"); shade.addColorStop(1, "#3e2e22");
  brush.fillStyle = shade; body(); brush.fill();
  brush.save();                                             // the flanks
  body(); brush.clip();
  var front = brush.createLinearGradient(8, 0, 26, 0);     // the breast paler, toward the neck
  front.addColorStop(0, "rgba(214, 198, 168, 0)"); front.addColorStop(1, "rgba(214, 198, 168, 0.9)");
  brush.fillStyle = front; brush.fillRect(0, -20, 30, 22);
  for (var row = 0; row < 6; row++) {
    for (var c = 0; c < 16; c++) {
      var fx = -26 + c * 3.4 + (row % 2) * 1.7 + (dice(row * 31 + c) - 0.5) * 1.2, fy = -12.5 + row * 2.3;
      var w = 1.9 + 0.5 * dice(c * 7 + row);
      if (fx > 24 - row * 1.5) { continue; }
      if (fx > 9) {                                         // the breast: dark spots on pale
        brush.fillStyle = "rgba(78, 58, 42, 0.8)";
        brush.beginPath(); brush.ellipse(fx, fy, w * 0.45, w * 0.35, 0, 0, 7); brush.fill();
        continue;
      }
      brush.fillStyle = "#e4d6bc";                          // the flank: dark feathers edged pale
      brush.beginPath(); brush.ellipse(fx, fy, w, w * 0.72, 0, 0, 7); brush.fill();
      brush.fillStyle = fx < -12 ? "#3e2c20" : "#54402e";
      brush.beginPath(); brush.ellipse(fx - 0.2, fy - 0.35, w * 0.7, w * 0.5, 0, 0, 7); brush.fill();
    }
  }
  var under = brush.createLinearGradient(0, -6, 0, 1);     // shade under the flank, where it meets the water
  under.addColorStop(0, "rgba(30, 20, 14, 0)"); under.addColorStop(1, "rgba(30, 20, 14, 0.45)");
  brush.fillStyle = under; brush.fillRect(-45, -8, 80, 10);
  brush.restore();
  brush.fillStyle = "#33261c";                              // the folded wing over the back
  brush.beginPath(); brush.moveTo(14, -15); brush.bezierCurveTo(4, -17, -14, -18, -30, -14);
  brush.bezierCurveTo(-20, -10, -6, -10, 10, -12); brush.closePath(); brush.fill();
  brush.strokeStyle = "rgba(200, 180, 150, 0.45)";        // its feathers' edges
  brush.lineWidth = 0.8;
  [[6, -13.5], [-2, -13.8], [-10, -13.6]].forEach(function (p) {
    brush.beginPath(); brush.moveTo(p[0], p[1]); brush.quadraticCurveTo(p[0] - 5, p[1] - 1.5, p[0] - 9, p[1] + 0.5); brush.stroke(); });
  brush.fillStyle = "#2a8a7a";                              // the green speculum
  brush.beginPath(); brush.moveTo(-14, -12.2); brush.lineTo(-24, -12.6); brush.lineTo(-23, -10.6); brush.lineTo(-14, -10.4); brush.fill();
  brush.fillStyle = "#f6f2ea";                              // the white tertials
  brush.beginPath(); brush.moveTo(-15, -14.6); brush.quadraticCurveTo(-24, -16, -31, -14.2);
  brush.quadraticCurveTo(-24, -13.2, -15, -12.8); brush.closePath(); brush.fill();
  brush.fillStyle = "#1e1814";                              // the black tail
  brush.beginPath(); brush.moveTo(-28, -14); brush.lineTo(-40, -19); brush.lineTo(-33, -9); brush.quadraticCurveTo(-30, -8, -26, -10); brush.fill();
  brush.strokeStyle = "rgba(255, 246, 226, 0.35)";        // the light along the back
  brush.lineWidth = 1;
  brush.beginPath(); brush.moveTo(16, -15.3); brush.bezierCurveTo(4, -17.4, -12, -17.6, -26, -14.8); brush.stroke();
  brush.save();                                             // the dark crown, on the head's own outline, and the eye stripe
  brush.beginPath(); brush.ellipse(21, -41, 8.5, 7, -0.15, 0, 7); brush.clip();
  brush.fillStyle = "#3a2c22";
  brush.beginPath(); brush.moveTo(10, -44.6); brush.quadraticCurveTo(20, -46.2, 30, -45.2); brush.lineTo(30, -52); brush.lineTo(10, -52); brush.fill();
  brush.strokeStyle = "rgba(74, 58, 46, 0.9)";
  brush.lineWidth = 1.2;
  brush.lineCap = "round";
  brush.beginPath(); brush.moveTo(12.5, -40.4); brush.quadraticCurveTo(20, -42.9, 28.5, -42.4); brush.stroke();
  brush.restore();
  brush.fillStyle = "#1a1410"; brush.beginPath(); brush.arc(23.5, -42.6, 1.6, 0, 7); brush.fill();   // the eye
  brush.fillStyle = "#fff"; brush.beginPath(); brush.arc(24, -43.1, 0.55, 0, 7); brush.fill();
  brush.fillStyle = "#e04a2a";                              // the red spot at the bill's base
  brush.beginPath(); brush.ellipse(28.4, -42, 1.3, 1.9, 0.3, 0, 7); brush.fill();
  brush.fillStyle = "#1e1c1e";                              // the bill, black, a little down-curved
  brush.beginPath(); brush.moveTo(28, -43.5); brush.quadraticCurveTo(36, -42, 41, -37.6); brush.lineTo(39.5, -36.2);
  brush.quadraticCurveTo(34, -37.5, 28, -38.6); brush.closePath(); brush.fill();
  brush.fillStyle = "#f2d23a";                              // its yellow tip
  brush.beginPath(); brush.moveTo(36.2, -39.6); brush.quadraticCurveTo(39.5, -38.6, 41, -37.6); brush.lineTo(39.5, -36.2);
  brush.quadraticCurveTo(37.8, -37, 35.6, -37.6); brush.closePath(); brush.fill();
  brush.strokeStyle = "rgba(255, 255, 255, 0.25)";        // the light on it
  brush.lineWidth = 0.8;
  brush.beginPath(); brush.moveTo(30, -42.8); brush.quadraticCurveTo(35, -41.6, 38.5, -39.2); brush.stroke();
  brush.strokeStyle = "rgba(90, 70, 50, 0.35)";           // fine streaks down the neck
  brush.lineWidth = 0.7;
  for (k = 0; k < 9; k++) {
    var sx = 13 + (k % 3) * 3.5, sy = -34 + Math.floor(k / 3) * 8;
    brush.beginPath(); brush.moveTo(sx, sy); brush.lineTo(sx + 0.6, sy + 2.4); brush.stroke();
  }
  brush.strokeStyle = "rgba(250, 244, 228, 0.8)";         // the water at its side
  brush.lineWidth = 1.2;
  brush.beginPath(); brush.moveTo(-16, 1.2); brush.quadraticCurveTo(4, 3, 30, 1.2); brush.stroke();
  brush.restore();
}

// ---------- the tale's things ----------

// The smiths' forge: a clay hearth with its fire, the upright bellows of mainland Southeast Asia (two tubes of bamboo,
// a plunger in each, worked turn and turn about) and an anvil of iron on a log. The hearth's foot's middle on (x, base),
// size 1 about 340 wide; t moves the fire and the plungers. e.g. forge(pen, 800, 900, 1, t);
function forge(brush, x, base, size, t) {
  var s = size;
  brush.fillStyle = "#9a6a4a";
  brush.beginPath(); brush.moveTo(x - 70 * s, base); brush.lineTo(x - 60 * s, base - 60 * s); brush.lineTo(x + 60 * s, base - 60 * s); brush.lineTo(x + 70 * s, base); brush.fill();
  for (var f = 0; f < 5; f++) {
    var fx = x - 30 * s + f * 15 * s, fh = (30 + 18 * Math.sin((t || 0) * 9 + f * 1.7)) * s;
    brush.fillStyle = f % 2 ? "#f2a23c" : "#e0582a";
    brush.beginPath(); brush.moveTo(fx - 10 * s, base - 58 * s); brush.quadraticCurveTo(fx, base - 58 * s - fh, fx + 10 * s, base - 58 * s); brush.fill();
  }
  brush.fillStyle = "#f6d06a";
  brush.beginPath(); brush.arc(x, base - 64 * s, 10 * s, 0, 7); brush.fill();
  for (var b = 0; b < 2; b++) {
    var bx = x - 120 * s + b * 26 * s, up = 20 * s * Math.sin((t || 0) * 4 + b * Math.PI);
    brush.fillStyle = "#b8a058"; brush.fillRect(bx, base - 110 * s, 20 * s, 110 * s);
    brush.strokeStyle = "#7a6a30"; brush.lineWidth = 2; brush.strokeRect(bx, base - 110 * s, 20 * s, 110 * s);
    brush.fillStyle = "#6a4a2a"; brush.fillRect(bx + 8 * s, base - 150 * s + up, 4 * s, 50 * s);
  }
  brush.fillStyle = "#6a4a2a"; brush.fillRect(x + 100 * s, base - 40 * s, 50 * s, 40 * s);
  brush.fillStyle = "#3a3a40";
  brush.beginPath(); brush.moveTo(x + 92 * s, base - 40 * s); brush.lineTo(x + 160 * s, base - 40 * s); brush.lineTo(x + 150 * s, base - 62 * s);
  brush.lineTo(x + 102 * s, base - 62 * s); brush.closePath(); brush.fill();
}

// A dap (ดาบ), the long Lanna sword, point up, its hilt's top at (x, y): a long, slightly curved blade, a wooden hilt
// bound with cord. size 1 is 300 long; look: angle (radians, 0 upright), sheath (true: its sheath beside it).
// e.g. dap(pen, 900, 600, 0.5, {angle: 0.3});
function dap(brush, x, y, size, look) {
  look = look || {};
  var s = size;
  brush.save(); brush.translate(x, y); brush.rotate(look.angle || 0);
  brush.fillStyle = "#c9ccd2";
  brush.beginPath(); brush.moveTo(-5 * s, 0); brush.quadraticCurveTo(-14 * s, -140 * s, 4 * s, -230 * s);
  brush.quadraticCurveTo(8 * s, -120 * s, 5 * s, 0); brush.closePath(); brush.fill();
  brush.strokeStyle = "#7a7c84"; brush.lineWidth = 1.5; brush.stroke();
  brush.fillStyle = "#6a4a2a"; brush.fillRect(-5 * s, 0, 10 * s, 70 * s);
  brush.fillStyle = "#3a2a1a";
  for (var k = 0; k < 6; k++) { brush.fillRect(-5 * s, 8 * s + k * 10 * s, 10 * s, 3 * s); }
  if (look.sheath) {
    brush.fillStyle = "#5a2e1e";
    brush.beginPath(); brush.moveTo(30 * s, 70 * s); brush.quadraticCurveTo(22 * s, -140 * s, 40 * s, -230 * s);
    brush.lineTo(50 * s, -228 * s); brush.quadraticCurveTo(40 * s, -120 * s, 44 * s, 70 * s); brush.fill();
  }
  brush.restore();
}

// A fire-gun (ปืนไฟ, the chronicle's), a long matchlock, its butt at (x, y): a wooden stock, an iron barrel, a match
// cord smoking a little at the lock. size 1 is 280 long; look: angle (radians; -0.5 by default, raised), t.
// e.g. fireGun(pen, 1000, 700, 0.8, {angle: -0.3, t: t});
function fireGun(brush, x, y, size, look) {
  look = look || {};
  var s = size;
  brush.save(); brush.translate(x, y); brush.rotate(look.angle === undefined ? -0.5 : look.angle);
  brush.fillStyle = "#7a4a26";
  brush.beginPath(); brush.moveTo(0, -8 * s); brush.lineTo(60 * s, -6 * s); brush.lineTo(120 * s, -4 * s);
  brush.lineTo(120 * s, 4 * s); brush.lineTo(50 * s, 6 * s); brush.lineTo(0, 14 * s); brush.closePath(); brush.fill();
  brush.fillStyle = "#4a4a50"; brush.fillRect(80 * s, -6 * s, 200 * s, 7 * s);
  brush.fillStyle = "#3a3a40"; brush.fillRect(272 * s, -8 * s, 8 * s, 11 * s);
  brush.strokeStyle = "#c9b48a"; brush.lineWidth = 2;
  brush.beginPath(); brush.moveTo(70 * s, -6 * s); brush.quadraticCurveTo(60 * s, -30 * s, 76 * s, -36 * s); brush.stroke();
  brush.fillStyle = "rgba(200, 200, 200, 0.5)";
  brush.beginPath(); brush.arc(78 * s, -44 * s - 6 * Math.sin((look.t || 0) * 2), 5 * s, 0, 7); brush.fill();
  brush.restore();
}

// The hook Phrom cuts (ขอไม้ไล่): the chronicle's footnote (Prachum Phongsawadan 61, 1936, note 70) says of it "ชื่อไม้
// ชะนิดหนึ่งในจำพวกไม้ไผ่ แต่ไม่มีหนามลำเล็ก ๆ มีแขนงเป็นขอดีนัก", a kind of bamboo with no thorns, small culms, whose
// side branches make very good hooks: a culm of bamboo, its nodes showing, a side branch left on near the top and cut
// short to make the hook. Its foot at (x, base); size 1 is 190 tall; look: angle (radians, 0 upright).
// e.g. elephantHook(pen, 700, 900, 1, {angle: 0.2});
function elephantHook(brush, x, base, size, look) {
  look = look || {};
  var s = size;
  brush.save(); brush.translate(x, base); brush.rotate(look.angle || 0);
  brush.lineCap = "round";
  brush.strokeStyle = "#a8a050";                                            // the culm
  brush.lineWidth = 8 * s;
  brush.beginPath(); brush.moveTo(0, 0); brush.lineTo(4 * s, -190 * s); brush.stroke();
  brush.strokeStyle = "#7a7430";                                            // its nodes
  brush.lineWidth = 2 * s;
  for (var k = 1; k < 6; k++) { brush.beginPath(); brush.moveTo(-5 * s, -k * 32 * s); brush.lineTo(9 * s, -k * 32 * s - 1); brush.stroke(); }
  brush.strokeStyle = "#a8a050";                                            // the side branch, cut short: the hook
  brush.lineWidth = 5 * s;
  brush.beginPath(); brush.moveTo(3 * s, -160 * s); brush.quadraticCurveTo(24 * s, -168 * s, 30 * s, -146 * s); brush.stroke();
  brush.lineCap = "butt";
  brush.restore();
}

// A carrying pole (คาน) across the shoulder with a basket at each end on cords; the pole's middle at (x, y). size 1 is
// 260 wide; look: gold (true: the tribute's gold showing in the baskets).
// e.g. carryPole(pen, 600, 700, 0.8, {gold: true});
function carryPole(brush, x, y, size, look) {
  look = look || {};
  var s = size;
  brush.strokeStyle = "#a8884a"; brush.lineWidth = 7 * s;
  brush.beginPath(); brush.moveTo(x - 130 * s, y); brush.quadraticCurveTo(x, y - 12 * s, x + 130 * s, y); brush.stroke();
  [-1, 1].forEach(function (side) {
    var bx = x + side * 118 * s;
    brush.strokeStyle = "#5a4a30"; brush.lineWidth = 2;
    brush.beginPath(); brush.moveTo(bx, y); brush.lineTo(bx - 22 * s, y + 70 * s); brush.moveTo(bx, y); brush.lineTo(bx + 22 * s, y + 70 * s); brush.stroke();
    brush.fillStyle = "#c79a5a";
    brush.beginPath(); brush.moveTo(bx - 30 * s, y + 70 * s); brush.lineTo(bx + 30 * s, y + 70 * s);
    brush.lineTo(bx + 24 * s, y + 110 * s); brush.lineTo(bx - 24 * s, y + 110 * s); brush.closePath(); brush.fill();
    if (look.gold) {
      brush.fillStyle = "#e8c044";
      for (var g = 0; g < 4; g++) { brush.beginPath(); brush.arc(bx - 15 * s + g * 10 * s, y + 68 * s, 7 * s, 0, 7); brush.fill(); }
    }
  });
}

// A pan for gold (the chronicle: another copy has "หาร่อนคำ", panning for gold, for the tribute): a wide shallow pan of
// wood, its middle at (x, y), tilted with look.tilt (radians), water swirling in it with t and, with look.gold, a
// few grains shining in the bottom. size 1 is 120 across. e.g. goldPan(pen, 700, 880, 1, {tilt: 0.2, gold: true, t: t});
function goldPan(brush, x, y, size, look) {
  look = look || {};
  var s = size;
  brush.save(); brush.translate(x, y); brush.rotate(look.tilt || 0);
  brush.fillStyle = "#7a5432";
  brush.beginPath(); brush.ellipse(0, 0, 60 * s, 16 * s, 0, 0, 7); brush.fill();
  brush.fillStyle = "#9a6e44";
  brush.beginPath(); brush.ellipse(0, -2 * s, 52 * s, 11 * s, 0, 0, 7); brush.fill();
  brush.strokeStyle = "rgba(220, 235, 240, 0.7)"; brush.lineWidth = 1.5;
  brush.beginPath(); brush.ellipse(0, -2 * s, 34 * s, 6 * s, (look.t || 0) * 2, 0.4, 4.2); brush.stroke();
  if (look.gold) {
    brush.fillStyle = "#f2d04a";
    for (var g = 0; g < 5; g++) { brush.beginPath(); brush.arc((g - 2) * 6 * s, 2 * s + (g % 2) * 2 * s, 1.8 * s, 0, 7); brush.fill(); }
  }
  brush.restore();
}

// A salung (สลุง), the wide Lanna bowl of beaten metal with a flared lip and a band of beaten figures, here of gold
// and heaped with grass, as the elephant's vessels were: the chronicle has all its vessels of gold, for its grass and
// even for its dung (their word, รวงทวง, is "not known" to the 1936 editors, note 73), so they take the forms of Lanna
// metalwork. Its foot's middle on (x, base); size 1 is 140 across; look: grass (true).
// e.g. salung(pen, 800, 900, 1, {grass: true});
function salung(brush, x, base, size, look) {
  look = look || {};
  var s = size;
  brush.fillStyle = "#c9962a";
  brush.beginPath(); brush.moveTo(x - 70 * s, base - 46 * s); brush.quadraticCurveTo(x - 60 * s, base, x, base);
  brush.quadraticCurveTo(x + 60 * s, base, x + 70 * s, base - 46 * s); brush.closePath(); brush.fill();
  brush.fillStyle = "#e8bc4a";                                              // the band of beaten figures
  brush.fillRect(x - 64 * s, base - 36 * s, 128 * s, 12 * s);
  brush.fillStyle = "#b8862a";
  for (var k = 0; k < 7; k++) { brush.beginPath(); brush.arc(x - 54 * s + k * 18 * s, base - 30 * s, 4 * s, 0, 7); brush.fill(); }
  brush.fillStyle = "#f2d27a";                                              // the flared lip
  brush.beginPath(); brush.ellipse(x, base - 46 * s, 74 * s, 10 * s, 0, 0, 7); brush.fill();
  if (look.grass !== false) {
    brush.strokeStyle = "#7aa04c"; brush.lineWidth = 2.5;
    for (var g = 0; g < 18; g++) {
      var gx = x - 54 * s + g * 6 * s;
      brush.beginPath(); brush.moveTo(gx, base - 48 * s); brush.quadraticCurveTo(gx + 8 * s, base - 72 * s, gx + 14 * s * dice(g), base - 82 * s); brush.stroke();
    }
  }
}

// A round pot of gold with its lid, the form of the north's round-bellied pots: the elephant's other vessel. Its foot's
// middle on (x, base); size 1 is 110 across. e.g. goldPot(pen, 980, 900, 1);
function goldPot(brush, x, base, size) {
  var s = size;
  brush.fillStyle = "#d9a83a";
  brush.beginPath(); brush.moveTo(x - 26 * s, base - 70 * s);
  brush.bezierCurveTo(x - 60 * s, base - 50 * s, x - 50 * s, base, x, base);
  brush.bezierCurveTo(x + 50 * s, base, x + 60 * s, base - 50 * s, x + 26 * s, base - 70 * s); brush.closePath(); brush.fill();
  brush.strokeStyle = "#a8782a"; brush.lineWidth = 2; brush.stroke();
  brush.fillStyle = "#f2d27a"; brush.beginPath(); brush.ellipse(x - 18 * s, base - 40 * s, 8 * s, 18 * s, -0.3, 0, 7); brush.fill();
  brush.fillStyle = "#c9962a"; brush.beginPath(); brush.ellipse(x, base - 72 * s, 28 * s, 7 * s, 0, 0, 7); brush.fill();
  brush.beginPath(); brush.arc(x, base - 80 * s, 6 * s, 0, 7); brush.fill();
}

// A hanging cradle (อู่) of cloth slung from a beam on two cords, swinging with t, a baby swaddled in it; the sling's
// lowest point at (x, y); size 1 is 150 across. look: baby (true), beam (true: the beam it hangs from), top (the y of
// the beam its cords go up to; 170 above it at size 1 when left out: a cradle hangs low, by someone sitting).
// e.g. hangingCradle(pen, 900, 760, 1, t, {top: 300, beam: false});
function hangingCradle(brush, x, y, size, t, look) {
  look = look || {};
  var s = size, swing = Math.sin((t || 0) * 1.6) * 10 * s, top = look.top !== undefined ? look.top : y - 170 * s, w = 150 * s;
  brush.strokeStyle = "#6a4a2a"; brush.lineWidth = 3 * s;
  brush.beginPath();
  brush.moveTo(x - w / 2 + swing, y - 20 * s); brush.lineTo(x - 20 * s, top);
  brush.moveTo(x + w / 2 + swing, y - 20 * s); brush.lineTo(x + 20 * s, top);
  brush.stroke();
  if (look.beam !== false) { brush.fillStyle = "#7a5432"; brush.fillRect(x - 160 * s, top - 10 * s, 320 * s, 12 * s); }
  brush.fillStyle = "#d8b878";
  brush.beginPath();
  brush.moveTo(x - w / 2 + swing, y - 22 * s);
  brush.quadraticCurveTo(x + swing, y + 22 * s, x + w / 2 + swing, y - 22 * s);
  brush.quadraticCurveTo(x + swing, y - 6 * s, x - w / 2 + swing, y - 22 * s);
  brush.fill();
  brush.strokeStyle = "#a8323a"; brush.lineWidth = 3 * s; brush.stroke();
  if (look.baby !== false) { swaddledBaby(brush, x + swing, y - 26 * s, s * 0.9); }
}

// A baby swaddled in cloth, lying, its head to the left, eyes shut, a tuft of hair. At (x, y), its middle.
// e.g. swaddledBaby(pen, 900, 730, 1);
function swaddledBaby(brush, x, y, size) {
  var s = size;
  brush.fillStyle = "#f2ead8";
  brush.beginPath(); brush.ellipse(x + 12 * s, y, 46 * s, 18 * s, 0, 0, 7); brush.fill();
  brush.fillStyle = "#f1cda8";
  brush.beginPath(); brush.arc(x - 34 * s, y - 4 * s, 18 * s, 0, 7); brush.fill();
  brush.strokeStyle = "#5a3a2a"; brush.lineWidth = 2 * s;
  brush.beginPath(); brush.arc(x - 38 * s, y - 4 * s, 4 * s, 0.2, Math.PI - 0.2); brush.stroke();
  brush.beginPath(); brush.arc(x - 28 * s, y - 4 * s, 4 * s, 0.2, Math.PI - 0.2); brush.stroke();
  brush.fillStyle = "rgba(232, 120, 110, 0.35)";       // pink cheeks, and a small smile (owner, 2026-10-25)
  brush.beginPath(); brush.arc(x - 44 * s, y + 3 * s, 3.6 * s, 0, 7); brush.arc(x - 22 * s, y + 3 * s, 3.6 * s, 0, 7); brush.fill();
  brush.lineWidth = 1.8 * s;
  brush.beginPath(); brush.arc(x - 33 * s, y + 1.5 * s, 4.5 * s, 0.45, Math.PI - 0.45); brush.stroke();
  brush.fillStyle = "#2a2220";
  brush.beginPath(); brush.arc(x - 36 * s, y - 21 * s, 5 * s, 0, 7); brush.fill();
}

// A novice's alms bowl of dark lacquer, its lid off, on its cloth sling, held at the waist: at (x, y), its rim's middle.
// Kit only: never in the maker (the respect rule). size 1 is 60 across. e.g. almsBowl(pen, 820, 700, 1);
function almsBowl(brush, x, y, size) {
  var s = size;
  brush.fillStyle = "#2a2622";
  brush.beginPath(); brush.ellipse(x, y + 16 * s, 30 * s, 26 * s, 0, 0, Math.PI); brush.fill();
  brush.fillRect(x - 30 * s, y + 2 * s, 60 * s, 14 * s);
  brush.fillStyle = "#4a443c";
  brush.beginPath(); brush.ellipse(x, y + 2 * s, 30 * s, 8 * s, 0, 0, 7); brush.fill();
  brush.strokeStyle = "#b8732a"; brush.lineWidth = 4 * s;
  brush.beginPath(); brush.moveTo(x - 30 * s, y + 8 * s); brush.quadraticCurveTo(x - 50 * s, y - 60 * s, x - 10 * s, y - 120 * s); brush.stroke();
}

// Indra's wall (the chronicle: a deva "เนรมิตกำแพงหินศิลา", raises a wall of stone before Phrom): cut stone rising out
// of the ground across x..x + wide, u 0 (none) to 1 (risen to tall pixels), a deva's light along its top as it rises,
// dust at its foot. The owner's pick, 2026-10-23. In depth since 2026-10-26 (the scenery pass): each stone lit along
// its top and left, shaded along its bottom and right, its face speckled, moss in a joint here and there; the wall's
// top lit and its near end in shade, so it has thickness. e.g. risingWall(pen, 600, 900, 700, 360, between(t, 2, 5));
function risingWall(brush, x, base, wide, tall, u) {
  var h = tall * Math.max(0, Math.min(1, u));
  if (h <= 0) { return; }
  brush.save();
  brush.beginPath(); brush.rect(x - 20, base - h, wide + 40, h); brush.clip();
  for (var row = 0; row * 40 < tall; row++) {
    for (var k = 0; k < wide / 70 + 1; k++) {
      var bx = x + k * 70 - (row % 2) * 35, by = base - (row + 1) * 40 + (tall - h);
      brush.fillStyle = ["#9a968a", "#8a8678", "#a8a496"][(row + k) % 3];
      brush.fillRect(bx + 2, by + 2, 66, 36);
      brush.fillStyle = "rgba(255, 250, 236, 0.35)";       // lit along its top and left
      brush.fillRect(bx + 2, by + 2, 66, 3); brush.fillRect(bx + 2, by + 2, 3, 36);
      brush.fillStyle = "rgba(40, 36, 28, 0.35)";          // in shade along its bottom and right
      brush.fillRect(bx + 2, by + 35, 66, 3); brush.fillRect(bx + 65, by + 2, 3, 36);
      for (var d = 0; d < 6; d++) {                        // its face speckled
        brush.fillStyle = d % 2 ? "rgba(60, 56, 46, 0.3)" : "rgba(230, 226, 210, 0.3)";
        brush.fillRect(bx + 8 + 52 * dice(row * 31 + k * 7 + d), by + 8 + 24 * dice(row * 13 + k * 3 + d * 5), 2, 2);
      }
      if (dice(row * 17 + k * 5) < 0.18) {                 // moss in a joint
        brush.fillStyle = "rgba(96, 120, 60, 0.7)";
        brush.beginPath(); brush.ellipse(bx + 20 + 30 * dice(k + row), by + 38, 12, 3, 0, 0, 7); brush.fill();
      }
      brush.strokeStyle = "#6a665a"; brush.lineWidth = 1.5; brush.strokeRect(bx + 2, by + 2, 66, 36);
    }
  }
  brush.restore();
  brush.fillStyle = "#c8c4b4";                             // its top, lit: the wall's thickness
  brush.beginPath(); brush.moveTo(x - 20, base - h); brush.lineTo(x + wide + 20, base - h);
  brush.lineTo(x + wide + 44, base - h - 14); brush.lineTo(x + 4, base - h - 14); brush.closePath(); brush.fill();
  brush.fillStyle = "#6e6a5e";                             // its near end, in shade
  brush.beginPath(); brush.moveTo(x + wide + 20, base - h); brush.lineTo(x + wide + 44, base - h - 14);
  brush.lineTo(x + wide + 44, base - 14); brush.lineTo(x + wide + 20, base); brush.closePath(); brush.fill();
  if (u < 1) {
    var glow = brush.createLinearGradient(0, base - h - 30, 0, base - h + 10);
    glow.addColorStop(0, "rgba(255, 240, 180, 0)"); glow.addColorStop(1, "rgba(255, 240, 180, 0.8)");
    brush.fillStyle = glow; brush.fillRect(x - 20, base - h - 30, wide + 40, 40);
  }
  brush.fillStyle = "rgba(140, 120, 90, " + (0.5 * (1 - u * 0.6)) + ")";
  brush.beginPath(); brush.ellipse(x + wide / 2, base, wide / 2 + 30, 14, 0, 0, 7); brush.fill();
}

// The pool round the base of the Chang Ngu statue at the roundabout before Chiang Saen (the Ministry of Culture's page:
// a fountain, lit 18:00 to 21:00), its jets playing with t; the plinth in its middle, its top at (x, y - 60 * size),
// where the statue stands. Its middle at (x, y); size 1 is 520 across. The owner's pick, 2026-10-23.
// e.g. statuePool(pen, 960, 900, 1, t); changNgu(960, 840, {size: 0.4});
function statuePool(brush, x, y, size, t) {
  var s = size;
  brush.fillStyle = "#cfc6b4"; brush.beginPath(); brush.ellipse(x, y, 260 * s, 46 * s, 0, 0, 7); brush.fill();
  brush.fillStyle = "#5f9eae"; brush.beginPath(); brush.ellipse(x, y - 6 * s, 236 * s, 36 * s, 0, 0, 7); brush.fill();
  for (var j = 0; j < 7; j++) {
    var jx = x - 180 * s + j * 60 * s, jh = (60 + 20 * Math.sin((t || 0) * 3 + j)) * s;
    brush.strokeStyle = "rgba(230, 245, 250, 0.8)"; brush.lineWidth = 3;
    brush.beginPath(); brush.moveTo(jx, y - 6 * s); brush.quadraticCurveTo(jx + 10 * s, y - 6 * s - jh, jx + 24 * s, y - 10 * s); brush.stroke();
  }
  brush.fillStyle = "#e6dfcf"; brush.fillRect(x - 70 * s, y - 60 * s, 140 * s, 54 * s);
}

// ---------- the white eel of Wiang Nong Lom ----------
// The giant white eel (ปลาไหลเผือก) of the tale of Wiang Nong Lom: the people of Yonok catch it in the river, "seven
// fathoms long", and share its meat in every house but a widow's; that night the city sinks into the lake (the
// Singhanawat chronicle; the Lanna Folktales telling). Drawn from photographs of eels (the swamp eel and the long-finned
// river eels of the north), white for the tale: the owner's pick of three, 2026-10-25 ("I like the C image"). An eel,
// not a snake: a fin along its back from a third of the way back round the tail's end, finely rayed; a blunt rounded
// head, the lower jaw a little longer, a wide mouth back under a small eye, the gill slit and a round fin behind it;
// no scales, a sheen along its back. Its body is the river snake's band (naga.js riverSnakeStrip), so the sheet that
// draws it loads naga.js first.
//   whiteEel(x, y, t, look)   look.caught: true, it lies on the bank (y the ground), its tail still moving a little;
//                             otherwise it swims at the surface (y the water line), low humps running back along it
//                             (only what is above the water line shows). look.size: 1 is 1400 long swimming, 1000
//                             lying, about 88 thick; look.face: 1 its head to the right, -1 to the left.
// Returns its head, [x, y], a point of the sheet. It draws with pen.
// e.g. whiteEel(1100, 960, t, {caught: true, size: 0.55});
var WHITE_EEL = {body: "#f3ebe6", belly: "#fde9ec", fin: "#f6d9dc", sheen: true, blot: null};

// The eel's middle, swimming at the surface: low humps that run back along it (an eel waves its whole length).
// x, water: the head's x and the water line; s the size (1 is 1400 long, 70 thick); face; phase. 81 [x, y], head first.
function whiteEelSpine(x, water, s, face, phase) {
  var points = [];
  for (var n = 0; n <= 80; n++) {
    var u = n / 80, back = u * 1400 * s;
    var rise = -30 * s * Math.sin(u * 14 - phase) * (0.5 + 0.5 * u) + 10 * s;
    var head = Math.pow(Math.max(0, 1 - u * 9), 1.5);
    points.push([x - face * back, water + rise * (1 - head) - 56 * s * head]);
  }
  return points;
}
// Lying on the bank: a slow S along the ground at y, a little lift and fall where it still moves.
function whiteEelLying(x, y, s, face, t) {
  var points = [];
  for (var n = 0; n <= 80; n++) {
    var u = n / 80;
    points.push([x - face * u * 1000 * s, y - 26 * s + 50 * s * Math.sin(u * 5.2 + 0.4) - 4 * s * Math.sin(t * 2 + u * 6) * u]);
  }
  return points;
}

// The fin along the back, from a third of the way back to the tail, where it goes round the tail's end: a frill
// with fine rays, the eel's colour paler, outlined.
function whiteEelFin(spine, wide, s) {
  var last = spine.length - 1, outer = [], inner = [], n;
  for (n = Math.round(last * 0.3); n <= last; n++) {
    var a = spine[Math.max(0, n - 1)], b = spine[Math.min(last, n + 1)], far = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    var nx = (b[1] - a[1]) / far, ny = -(b[0] - a[0]) / far;    // the side of the back (up, when it swims right)
    if (ny > 0) { nx = -nx; ny = -ny; }
    var u = n / last, w = wide(u), rise = s * (10 + 16 * Math.sin(Math.min(1, (u - 0.3) / 0.6) * Math.PI * 0.5));
    inner.push([spine[n][0] + nx * w * 0.8, spine[n][1] + ny * w * 0.8]);
    outer.push([spine[n][0] + nx * (w + rise), spine[n][1] + ny * (w + rise)]);
  }
  pen.beginPath();
  inner.forEach(function (p, k) { if (k) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } });
  for (n = outer.length - 1; n >= 0; n--) { pen.lineTo(outer[n][0], outer[n][1]); }
  pen.closePath();
  pen.fillStyle = WHITE_EEL.fin;
  pen.fill();
  pen.strokeStyle = "rgba(170, 120, 126, 0.55)";    // its rays
  pen.lineWidth = 1;
  pen.beginPath();
  for (n = 0; n < outer.length; n += 2) { pen.moveTo(inner[n][0], inner[n][1]); pen.lineTo(outer[n][0], outer[n][1]); }
  pen.stroke();
  pen.beginPath();
  outer.forEach(function (p, k) { if (k) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } });
  pen.strokeStyle = inkFor(WHITE_EEL.body);
  pen.lineWidth = 1.8;
  pen.stroke();
}

// An eel's head: blunt and rounded, the lower jaw a little longer, a wide mouth line back past the eye, a small
// eye high and forward, the gill slit, and the round fin behind it. (hx, hy) its middle; angle the way it faces.
function whiteEelHead(hx, hy, s, face, angle) {
  pen.save();
  pen.translate(hx, hy);
  pen.rotate(angle);
  pen.scale(s * face, s);
  pen.beginPath();                                  // the pectoral fin, behind the head
  pen.moveTo(-34, 14);
  pen.quadraticCurveTo(-30, 44, -12, 40);
  pen.quadraticCurveTo(-14, 22, -22, 12);
  pen.closePath();
  shape(WHITE_EEL.fin);
  pen.beginPath();                                  // the head grows out of the body: filled to well behind it, lined
  pen.moveTo(-60, -34);                             // only round its front
  pen.bezierCurveTo(-10, -44, 50, -40, 70, -14);
  pen.bezierCurveTo(84, 4, 78, 28, 58, 32);
  pen.bezierCurveTo(20, 40, -20, 40, -60, 34);
  pen.closePath();
  pen.fillStyle = WHITE_EEL.body;
  pen.fill();
  pen.strokeStyle = inkFor(WHITE_EEL.body);
  pen.lineWidth = 2.2;
  pen.beginPath();
  pen.moveTo(-40, -38);
  pen.bezierCurveTo(-10, -44, 50, -40, 70, -14);
  pen.bezierCurveTo(84, 4, 78, 28, 58, 32);
  pen.bezierCurveTo(20, 40, -10, 40, -40, 37);
  pen.stroke();
  pen.lineWidth = 2;
  pen.beginPath();                                  // the mouth, wide, back under the eye
  pen.moveTo(72, 6);
  pen.quadraticCurveTo(46, 12, 22, 6);
  pen.stroke();
  pen.beginPath();                                  // the gill slit
  pen.moveTo(-26, -4); pen.quadraticCurveTo(-32, 8, -28, 20);
  pen.stroke();
  oval(36, -12, 5.5, 5, "#fff6ea");                 // a small eye, and the nostril's little tube
  oval(37.5, -12, 3, 3.4, "#2a1a1e");
  oval(66, -12, 2.4, 2, inkFor(WHITE_EEL.body));
  pen.restore();
}

// The eel swimming at the surface: its fin, its band, rings where it goes in and out, its head. Returns its head.
function whiteEelSwim(x, water, s, face, t) {
  var spine = whiteEelSpine(x, water, s, face, t * 2.2), wide = function (u) { return s * mix(44, 7, Math.pow(u, 1.3)); };
  pen.save();
  pen.beginPath(); pen.rect(-1e4, -1e4, 2e4, water + 4 + 1e4); pen.clip();
  whiteEelFin(spine, wide, s);
  riverSnakeStrip(spine, wide, WHITE_EEL);
  pen.restore();
  pen.strokeStyle = "rgba(255, 252, 238, 0.75)";
  pen.lineWidth = 2.2;
  for (var n = 5; n < spine.length - 1; n++) {
    if ((spine[n][1] - water) * (spine[n + 1][1] - water) <= 0) {
      pen.beginPath(); pen.ellipse(spine[n][0], water + 2, 34 * s, 7 * s, 0, 0, 7); pen.stroke();
    }
  }
  var a = Math.atan2(spine[2][1] - spine[0][1], (spine[0][0] - spine[2][0]) * face) * face;
  whiteEelHead(spine[0][0] + face * 22 * s, spine[0][1], 1.15 * s, face, -a * 0.5);
  return spine[0];
}
// The eel caught, lying on the bank.
function whiteEelCaught(x, y, s, face, t) {
  var spine = whiteEelLying(x, y, s, face, t), wide = function (u) { return s * mix(44, 7, Math.pow(u, 1.3)); };
  whiteEelFin(spine, wide, s);
  riverSnakeStrip(spine, wide, WHITE_EEL);
  var a = Math.atan2(spine[2][1] - spine[0][1], (spine[0][0] - spine[2][0]) * face);
  whiteEelHead(spine[0][0] + face * 22 * s, spine[0][1], 1.15 * s, face, -a * face);
}

var WHITE_EEL_KEYS = {caught: true, size: true, face: true};

function whiteEel(x, y, t, look) {
  look = look || {};
  checkNames("The white eel's name", look, WHITE_EEL_KEYS);
  var s = look.size || 1, face = look.face || 1;
  if (look.caught) { whiteEelCaught(x, y, s, face, t); return [x, y - 26 * s]; }
  return whiteEelSwim(x, y, s, face, t);
}
