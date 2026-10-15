// dragon.js - a dragon of the Himalayan paintings, for films made with
// oldcartoon.js. It is built on the Naga's spine, so load it after naga.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="naga.js"></script>
//     <script src="dragon.js"></script>
//
// and call dragon(x, y, look) from a scene. (x, y) is where its head is.
//
// It was read from one painting the owner gave (2026-10-13): a dragon among
// clouds, in the manner of the Tibetan and Bhutanese painters. Nothing of the
// painting is copied. This file keeps what the painting does, as rules, and
// draws its own dragon in the kit's manner: flat colour inside a fine dark line.
//
//   1. One long body that rises and falls in arches, as thick as the head
//      behind the shoulders and narrowing to the tail.
//   2. Its skin is dots, not scales: rows of dark dots on tan, larger toward
//      the back. Its belly is a pink band of plates.
//   3. A band of flame runs down the whole back with small points to it, and
//      taller flames rise from it here and there.
//   4. Four short legs, the same dotted skin, a tuft of hair at each
//      shoulder, and every paw holds a pearl: a pale ball with a spiral on it.
//   5. The head is round, more a lion's than a snake's: a short muzzle, a
//      pink nose, a round eye with a yellow iris. A mane of long gold locks
//      streams back from it, and whiskers from beside the nose.
//   6. It breathes a scroll of flame.
//   7. The tail ends in long gold hair.
//
// And it moves. The arches travel down the body, the legs paddle, the mane,
// the long whiskers and the tail's hair stream, and the flames flicker. How
// the tail goes is the dragon's flight, "fly", in three manners taken from
// how the dragon is painted and danced (the painters' names for its
// postures: 行龙 the travelling dragon, level, 升龙 and 降龙 rising and
// descending, 盘龙 the coiled dragon; and the dragon dance moves "in a
// wave-like pattern", Wikipedia, Dragon dance):
//   glide   the travelling dragon (the default): the tail undulates up and
//           down behind the body's arches, and now and then a corkscrew, a
//           full loop of the body, runs the whole length of it from behind
//           the head and off the tip
//   hover   as good as still: slow swells, the tail waving slowly, mane and
//           whiskers afloat
//   fast    a streak: the body nearly straight with quick small ripples down
//           it, the tail whipping, mane, whiskers and hair blown straight back
// With "trail" it flies where the film leads its head, and the body follows
// as a chain (the rule of procedural_animation.html, as naga.js has it); the
// tail's flight is laid over the chain.

// The names a dragon's look may have (dragon() warns about any other):
//   size       how large it is drawn (1 is about 1080 long and 350 high)
//   depth      0 far from the screen to 1 near: it is drawn a third of its size
//              and faint in the distance, half as big again and bold close up
//   face       1 looks right, -1 looks left
//   body       the colour of the skin; "spots" is the colour of its dots
//   belly      the colour of the belly's plates
//   flame      the colour of the flames, on the back and from the mouth
//   mane       the colour of the mane, the whiskers, the tufts and the tail's hair
//   pearl      the colour of the pearls; pearls: false and it holds none
//   trail      a function of the time that gives [x, y], where the head is at
//              that time (the function the film itself moves it with): the
//              body then follows the head as a chain
//   breath     0 to 1: how much flame it breathes
//   late       the timing of the beat, as hop(t, late) takes it
//   sing       true to open the mouth on every beat
//   mouth      0 to 1: how far the mouth is open, if the scene says
//   fly        "glide" (the default), "hover" or "fast": the manner of its flight, above
//   corkscrew  in a glide, when the body corkscrews: the seconds from one to the
//              next (8 if unsaid), or a list of the clock's seconds at which one
//              starts, for a film that wants them at its own moments
//   kind       "chinese": the dragon of the Chinese painters and the glazed walls
//              (below), instead of the thangka's. Its skin is scales, its back a
//              ridge of spines, its head long, its paws an eagle's, and it chases
//              a flaming pearl instead of holding pearls
//   claws      how many claws on each paw of a Chinese dragon: 4 (as most are),
//              5 (the emperor's), or 3
//   chase      false, and a Chinese dragon has no pearl before its mouth
//
// The Chinese dragon (kind: "chinese") was read from the Nine-Dragon Wall of
// the Forbidden City and of Beihai Park (glazed tile reliefs, photographs on
// Wikimedia Commons, 2026-10-15) and from Chen Rong's Nine Dragons scroll
// (1244, Museum of Fine Arts, Boston). Nothing is copied; what they do, as
// rules, with the old "nine resemblances" of Wang Fu behind them:
//   1. A body that loops in full S-curves, under rows of overlapping crescent
//      scales (a carp's), each about a sixth of the body's width; a pale belly
//      of cross plates (a clam's) about two fifths of the width; a sawtooth of
//      spines down the whole back, not flames.
//   2. A long head (a camel's): the snout long and turned up at its end into a
//      bulbous nose; the mouth open wide on a row of teeth and a tongue; round
//      bulging eyes under bushy brows; a lump on the crown (the chimu, without
//      which, the old books say, it cannot rise to the sky); cow's ears; two
//      antlers (a stag's) that branch; two long whiskers that curl from beside
//      the nose; a beard under the chin; a mane streaming back from the skull.
//   3. Four legs bent hard at the elbow, the elbow pointing back, each with an
//      eagle's foot: four claws (five for an emperor's dragon) spread wide, long
//      and curved, one turned back; a tuft of hair or flame streams from each
//      elbow.
//   4. The flaming pearl floats before the snout, ringed with flames, and the
//      dragon reaches for it; it holds nothing.
//   5. The tail ends in a tuft of hair. Among scroll clouds, over waves.
//   6. Yellow or gold for the emperor's, with a pale belly; also azure, white,
//      purple and green on the walls.
var DRAGON_KEYS = {};

["size", "depth", "face", "body", "spots", "belly", "flame", "mane", "pearl", "pearls", "trail", "breath", "late", "sing", "mouth", "fly", "corkscrew",
 "kind", "claws", "chase"
].forEach(function (name) { DRAGON_KEYS[name] = true; });

// A lock of hair, from (0, 0) out along x: a ribbon that narrows to a point
// and waves as it goes, with a fine line down its middle. "wave" is how far
// it swings to each side, and "turn" where in its swing it is: a turn that
// grows with the time makes the hair stream.
var DRAGON_AIR = {wave: 1, turn: 1};               // how the locks of the dragon being drawn wave and stream: set by its flight

function dragonLock(long, wide, wave, turn, colour) {
  var middle = [], n;
  wave *= DRAGON_AIR.wave;
  turn *= DRAGON_AIR.turn;
  for (n = 0; n <= 12; n++) {
    var u = n / 12;
    middle.push([long * u, wave * u * Math.sin(u * 5.2 - turn), wide / 2 * (1 - u * u) + 0.6]);
  }
  pen.beginPath();
  for (n = 0; n <= 12; n++) { pen.lineTo(middle[n][0], middle[n][1] - middle[n][2]); }
  for (n = 12; n >= 0; n--) { pen.lineTo(middle[n][0], middle[n][1] + middle[n][2]); }
  pen.closePath();
  shape(colour, 1.5 * FINE);
  pen.strokeStyle = blend(colour, "#5a3a14", 0.45);
  pen.lineWidth = 1.1 * FINE;
  pen.beginPath();
  for (n = 1; n <= 11; n++) { pen.lineTo(middle[n][0], middle[n][1]); }
  pen.stroke();
}

// A flame that waves: a lock in the flame's colour, with a shorter one of
// the fire's own colour inside it.
function dragonFire(long, wide, wave, turn, c) {
  dragonLock(long, wide, wave, turn, c.crest);
  pen.save();
  pen.translate(long * 0.04, 0);
  var middle = [], n;
  for (n = 0; n <= 12; n++) {
    var u = n / 12;
    middle.push([long * 0.62 * u, wave * 0.62 * u * Math.sin(u * 0.62 * 5.2 - turn), wide * 0.24 * (1 - u * u)]);
  }
  pen.beginPath();
  for (n = 0; n <= 12; n++) { pen.lineTo(middle[n][0], middle[n][1] - middle[n][2]); }
  for (n = 12; n >= 0; n--) { pen.lineTo(middle[n][0], middle[n][1] + middle[n][2]); }
  pen.closePath();
  pen.fillStyle = c.fire;
  pen.fill();
  pen.restore();
}

// A pearl: a pale ball with a spiral on it.
function dragonPearl(x, y, r, colour) {
  pen.beginPath();
  pen.arc(x, y, r, 0, 7);
  shape(colour);
  pen.strokeStyle = blend(colour, "#3f5f9a", 0.6);
  pen.lineWidth = 1.6 * FINE;
  pen.beginPath();
  for (var n = 0; n <= 60; n++) {
    var turn = n / 60 * Math.PI * 5.2, far = r * 0.8 * n / 60;
    pen.lineTo(x + Math.cos(turn) * far, y + Math.sin(turn) * far);
  }
  pen.stroke();
}

// One leg, from the shoulder (sx, sy) to the paw at (px, py), and what the
// paw holds. "knee" is 1 for a leg whose joint points forward and -1 for one
// whose joint points back; "skin" is the leg's colour.
// A Chinese dragon's leg is longer in the bone, bent hard at the elbow, and
// ends in an eagle's foot ("claws" of them); a tuft streams from the elbow.
// It gives back where the foot is, in the dragon's own drawing.
function dragonLeg(sx, sy, px, py, knee, skin, c, pearls, china, claws) {
  for (var lock = 0; lock < 3; lock++) {            // the tuft at the shoulder streams back
    pen.save();
    pen.translate(sx - 4, sy - 4 + lock * 5);
    pen.rotate(Math.PI - 0.35 + lock * 0.3);
    dragonLock(70 - lock * 8, 16, 9, clock * 3 + lock + sx * 0.01, c.mane);
    pen.restore();
  }
  var leg = limb(sx, sy, px, py, china ? 74 : 66, china ? 68 : 60, china ? [20, 13, 10] : [23, 16, 12], skin,
                 function (joint) { return knee * joint[0]; }, 0.25);
  if (china) {
    for (lock = 0; lock < 3; lock++) {              // the tuft at the elbow, streaming back
      pen.save();
      pen.translate(leg[2] - knee * 6, leg[3] + lock * 4 - 4);
      pen.rotate(knee > 0 ? Math.PI - 0.5 + lock * 0.3 : Math.PI + 0.2 - lock * 0.3);
      dragonLock(54 - lock * 8, 12, 8, clock * 3 + lock + sx * 0.01, c.mane);
      pen.restore();
    }
    dragonTalons(leg[0], leg[1], Math.atan2(leg[1] - leg[3], leg[0] - leg[2]), claws, skin);
    return [leg[0], leg[1]];
  }
  pen.fillStyle = c.spots;                          // the dots, down both bones
  pen.beginPath();
  var bones = [[sx, sy, leg[2], leg[3], 17], [leg[2], leg[3], leg[0], leg[1], 12]];
  for (var b = 0; b < 2; b++) {
    var bone = bones[b], far = Math.sqrt(Math.pow(bone[2] - bone[0], 2) + Math.pow(bone[3] - bone[1], 2)) || 1;
    var ux = (bone[2] - bone[0]) / far, uy = (bone[3] - bone[1]) / far;
    for (var k = 1; k * 9 < far - 4; k++) {
      var side = (k % 2 ? 0.45 : -0.4) * bone[4];
      pen.moveTo(bone[0] + ux * k * 9 - uy * side + 3.2, bone[1] + uy * k * 9 + ux * side);
      pen.arc(bone[0] + ux * k * 9 - uy * side, bone[1] + uy * k * 9 + ux * side, 3.2, 0, 7);
    }
  }
  pen.fill();
  if (pearls) { dragonPearl(leg[0] + 12, leg[1] + 22, 29, c.pearl); }
  for (var toe = 0; toe < 3; toe++) {               // three toes over the pearl, each with a claw
    pen.save();
    pen.translate(leg[0] - 8 + toe * 15, leg[1] + 5);
    pen.rotate(0.5 - toe * 0.42);
    pen.beginPath();
    pen.moveTo(-4, 20);
    pen.lineTo(0, 34);
    pen.lineTo(5, 20);
    pen.fillStyle = "#fff6ea";
    pen.fill();
    pen.strokeStyle = inkFor(skin);
    pen.lineWidth = 1.2 * FINE;
    pen.stroke();
    oval(0, 10, 8.5, 14, skin);
    pen.restore();
  }
  return [leg[0], leg[1]];
}

// A dragon's head in profile, looking along x, its neck joining at (0, 0):
// round, more a lion's than a snake's, with a high skull, a short muzzle
// that steps down from the brow, a pink nose, an ear, and two horns. "open"
// is how far the mouth is open and "breath" how much flame it breathes,
// both 0 to 1.
function dragonHead(open, breath, c) {
  var blink = Math.sin(clock * 0.8 + 1.3) > 0.985, n, horn = "#f1e3c0";
  function antler(x, y) {                           // one horn: a beam that sweeps back, and a tine that stands on it
    hose(x, y, x - 48, y - 62, -0.2, 9, horn);
    hose(x - 24, y - 34, x - 16, y - 68, 0.16, 6, horn);
  }
  antler(16, -60);                                  // the far horn, behind the head
  var locks = [[-6, -58, -0.8, 150], [-24, -50, -0.56, 176], [-38, -34, -0.34, 196], [-44, -14, -0.12, 204], [-40, 6, 0.1, 186],
               [-30, 22, 0.3, 160], [-14, 30, 0.5, 128]];
  for (n = 0; n < locks.length; n++) {              // the mane, streaming back from the head
    pen.save();
    pen.translate(locks[n][0], locks[n][1]);
    pen.rotate(Math.PI + locks[n][2]);
    dragonLock(locks[n][3], 36, 15, clock * 3.2 + n * 1.3, c.mane);
    pen.restore();
  }
  if (breath > 0.02) {                              // the breath: flames that wave out of the mouth, the longest in the middle
    var fans = [[-0.5, 0.52], [0.5, 0.56], [-0.26, 0.76], [0.28, 0.8], [0, 1]];
    for (n = 0; n < fans.length; n++) {
      pen.save();
      pen.translate(76, 18);
      pen.rotate(0.12 + fans[n][0]);
      dragonFire(300 * breath * fans[n][1], 46, 22, clock * 6 + n * 1.9, c);
      pen.restore();
    }
  }
  pen.beginPath();                                  // the inside of the mouth
  pen.moveTo(4, 12);
  pen.lineTo(84, 8);
  pen.lineTo(62 + 4 * open, 20 + 30 * open);
  pen.closePath();
  pen.fillStyle = "#a8322c";
  pen.fill();
  pen.save();                                       // the lower jaw turns about the corner of the mouth
  pen.translate(8, 16);
  pen.rotate(0.5 * open);
  for (n = 0; n < 2; n++) {                         // its beard
    pen.save();
    pen.translate(26 - n * 16, 14);
    pen.rotate(Math.PI - 0.75 + n * 0.25);
    dragonLock(84 + n * 16, 18, 10, clock * 3 + n * 2, c.mane);
    pen.restore();
  }
  pen.beginPath();
  pen.moveTo(-26, -2);
  pen.quadraticCurveTo(24, -6, 60, -2);
  pen.quadraticCurveTo(72, 6, 58, 12);
  pen.quadraticCurveTo(22, 22, -26, 16);
  pen.closePath();
  shape(c.body);
  pen.beginPath();                                  // its teeth
  for (n = 0; n < 3; n++) {
    pen.moveTo(18 + n * 14, -4);
    pen.lineTo(22 + n * 14, -13);
    pen.lineTo(26 + n * 14, -4);
  }
  pen.fillStyle = "#fff6ea";
  pen.fill();
  pen.restore();
  pen.beginPath();                                  // the skull: high and round, then a step down to a short muzzle
  pen.moveTo(-34, 20);
  pen.quadraticCurveTo(-56, -22, -24, -52);
  pen.quadraticCurveTo(6, -72, 36, -54);
  pen.quadraticCurveTo(50, -46, 52, -34);
  pen.quadraticCurveTo(70, -40, 88, -30);
  pen.quadraticCurveTo(102, -22, 98, -6);
  pen.quadraticCurveTo(96, 6, 80, 10);
  pen.quadraticCurveTo(44, 16, 6, 16);
  pen.closePath();
  shape(c.body);
  pen.save();
  pen.clip();
  // The head is modelled, as the painting's is, but inside its own line:
  // the cheek stands out and takes the light, the back of the skull turns
  // away into shade, and there is shade under the brow and under the muzzle.
  var cheek = pen.createRadialGradient(20, -4, 4, 20, -4, 48);
  cheek.addColorStop(0, "rgba(255, 244, 214, 0.55)");
  cheek.addColorStop(1, "rgba(255, 244, 214, 0)");
  pen.fillStyle = cheek;
  pen.fillRect(-60, -80, 170, 110);
  var away = pen.createLinearGradient(-58, 0, 6, 0);
  away.addColorStop(0, "rgba(70, 36, 20, 0.42)");
  away.addColorStop(1, "rgba(70, 36, 20, 0)");
  pen.fillStyle = away;
  pen.fillRect(-60, -80, 70, 110);
  pen.fillStyle = "rgba(70, 36, 20, 0.26)";
  pen.beginPath();
  pen.ellipse(36, -54, 36, 10, 0.2, 0, 7);
  pen.fill();
  pen.beginPath();
  pen.ellipse(70, 8, 30, 7, -0.05, 0, 7);
  pen.fill();
  var snout = pen.createLinearGradient(0, -40, 0, -14);   // and the top of the muzzle takes the light
  snout.addColorStop(0, "rgba(255, 244, 214, 0.4)");
  snout.addColorStop(1, "rgba(255, 244, 214, 0)");
  pen.fillStyle = snout;
  pen.fillRect(52, -42, 50, 30);
  pen.fillStyle = c.spots;                          // its dots, kept off the eye and the nose
  pen.beginPath();
  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 12; col++) {
      var dx = -50 + col * 11 + (row % 2) * 5.5, dy = -66 + row * 10;
      if (Math.pow(dx - 30, 2) + Math.pow(dy + 34, 2) < 480 || dx > 76) { continue; }
      pen.moveTo(dx + 2.8, dy);
      pen.arc(dx, dy, 2.8, 0, 7);
    }
  }
  pen.fill();
  pen.restore();
  pen.strokeStyle = inkFor(c.body);                 // the line of the cheek, from under the eye round to the corner of the mouth
  pen.lineWidth = 1.8 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(44, -14);
  pen.quadraticCurveTo(22, -2, 30, 14);
  for (n = 0; n < 3; n++) {                         // three folds across the muzzle, behind the nose
    pen.moveTo(60 + n * 8, -35 + n * 1.5);
    pen.quadraticCurveTo(66 + n * 8, -27 + n * 1.5, 62 + n * 8, -18 + n * 1.5);
  }
  pen.moveTo(40, 12);                               // and the line of the upper lip
  pen.quadraticCurveTo(62, 6, 84, 4);
  pen.stroke();
  pen.beginPath();                                  // the upper teeth: two fangs at the front, smaller ones behind
  pen.moveTo(74, 9);
  pen.lineTo(79, 26);
  pen.lineTo(85, 8);
  pen.moveTo(56, 12);
  pen.lineTo(60, 25);
  pen.lineTo(66, 11);
  pen.moveTo(36, 14);
  pen.lineTo(39, 22);
  pen.lineTo(44, 13);
  pen.fillStyle = "#fff6ea";
  pen.fill();
  oval(91, -20, 12, 9, c.belly);                    // the nose, and its nostrils
  oval(95, -19, 2.4, 3, "#7a3a3a");
  oval(87, -17, 2, 2.6, "#7a3a3a");
  pen.beginPath();                                  // the eye: white, a yellow iris, a dark middle
  pen.ellipse(30, -34, 16, blink ? 1.5 : 15.5, 0, 0, 7);
  shape("#fff6ea");
  if (!blink) {
    oval(33, -34, 9.5, 9.5, "#e9b53a");
    oval(34, -34, 4, 4.4, "#1f1a1a");
  }
  pen.save();                                       // the brow: a bushy lock that sweeps back over the eye
  pen.translate(52, -50);
  pen.rotate(Math.PI + 0.28);
  dragonLock(64, 18, 6, clock * 3 + 1, c.mane);
  pen.restore();
  pen.save();                                       // the ear, behind the eye
  pen.translate(-6, -52);
  pen.rotate(-2.3);
  nagaTongue(42, 24, 6, c.body, 1.6 * FINE);
  pen.translate(6, 0);
  nagaTongue(26, 12, 4, c.belly);
  pen.restore();
  antler(2, -64);                                   // the near horn
  for (n = 0; n < 2; n++) {                         // the whiskers: long, and they undulate as they stream back from beside the nose
    pen.save();
    pen.translate(86 - n * 8, -4 + n * 6);
    pen.rotate(Math.PI - 0.06 - n * 0.3);
    dragonLock(360 - n * 70, 13, 58, clock * 2.2 + n * 2, c.mane);
    pen.restore();
  }
}

// An eagle's foot at (x, y), the shin coming in at the angle "down": "claws"
// toes spread like a bird's, all but one forward and that one turned back,
// each a short bone and a long curved talon.
function dragonTalons(x, y, down, claws, skin) {
  var count = Math.max(3, Math.min(5, claws || 4)), n;
  pen.save();
  pen.translate(x, y);
  oval(0, 2, 13, 10, skin);                         // the palm
  for (n = 0; n < count; n++) {
    var back = n === count - 1;                     // the last toe turns back, as an eagle's does
    var spread = back ? down + Math.PI * 0.95 : down + 0.55 - 1.45 * n / Math.max(1, count - 2);
    pen.save();
    pen.rotate(spread);
    hose(4, 0, 22, 0, 0, 7, skin);                  // the toe
    pen.beginPath();                                // the talon: it curves down and in
    pen.moveTo(20, -3.5);
    pen.quadraticCurveTo(40, -4, 44, 10);
    pen.quadraticCurveTo(34, 2, 20, 3.5);
    pen.closePath();
    shape("#fff6ea", 1.2 * FINE);
    pen.restore();
  }
  pen.restore();
}

// Scales over the body: rows of overlapping crescents, each opening toward
// the tail, about a sixth of the body's width, kept off the belly's plates
// and inside the body's own line. The body's edges are found as nagaStrip
// finds them: the back to the right of the way to the tail.
function dragonScales(line, wide, c) {
  var last = line.length - 1, at = [], n, k;
  for (n = 0; n <= last; n++) {
    var a = line[Math.max(0, n - 1)], b = line[Math.min(last, n + 1)];
    var far = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) || 1;
    at.push({x: line[n][0], y: line[n][1], tx: (b[0] - a[0]) / far, ty: (b[1] - a[1]) / far, w: wide(n / last)});
  }
  pen.save();
  pen.beginPath();                                  // the body's outline, to keep the scales inside it
  for (n = 0; n <= last; n++) { pen.lineTo(at[n].x - at[n].ty * at[n].w, at[n].y + at[n].tx * at[n].w); }
  for (n = last; n >= 0; n--) { pen.lineTo(at[n].x + at[n].ty * at[n].w * 0.52, at[n].y - at[n].tx * at[n].w * 0.52); }
  pen.closePath();
  pen.clip();
  pen.strokeStyle = c.spots;
  pen.lineWidth = 1.3 * FINE;
  pen.beginPath();
  for (n = 1; n < last; n++) {
    var p = at[n], r = Math.max(3, p.w * 0.17), turn = Math.atan2(p.ty, p.tx);
    for (k = 0; k < 6; k++) {                       // rows across, from the back toward the belly, each row half a scale on from the last point's
      var v = 0.9 - k * 0.3 + (n % 2 ? 0.15 : 0);
      if (v < -0.45) { continue; }
      var cx = p.x - p.ty * p.w * v, cy = p.y + p.tx * p.w * v;
      pen.moveTo(cx + Math.cos(turn - Math.PI / 2) * r, cy + Math.sin(turn - Math.PI / 2) * r);
      pen.arc(cx, cy, r, turn - Math.PI / 2, turn + Math.PI / 2);
    }
  }
  pen.stroke();
  pen.restore();
}

// The flaming pearl a Chinese dragon chases: a pearl ringed with flames that
// lick round it, at (x, y).
function dragonChasedPearl(x, y, r, c) {
  var n;
  for (n = 0; n < 5; n++) {
    pen.save();
    pen.translate(x, y);
    pen.rotate(-1.9 + n * 0.75 + 0.1 * Math.sin(clock * 4 + n));
    pen.translate(r * 0.6, 0);
    dragonFire(r * (1.6 + 0.5 * (n % 2)), r * 0.7, r * 0.35, clock * 5 + n * 1.7, c);
    pen.restore();
  }
  dragonPearl(x, y, r, c.pearl);
}

// A Chinese dragon's head in profile, looking along x, its neck joining at
// (0, 0): long, a camel's more than a lion's, the snout turned up into a
// bulbous nose, the mouth open on a row of teeth, round bulging eyes under
// bushy brows, the lump on the crown, a cow's ear, branched antlers, long
// curling whiskers, a beard, and the mane streaming back.
function dragonHeadChina(open, breath, c) {
  var blink = Math.sin(clock * 0.8 + 1.3) > 0.985, n, horn = "#f1e3c0";
  function antler(x, y) {                           // a stag's: a beam that sweeps back, with two tines that stand up from it
    hose(x, y, x - 96, y - 44, -0.3, 9, horn);
    hose(x - 30, y - 22, x - 26, y - 62, 0.14, 6, horn);
    hose(x - 64, y - 36, x - 72, y - 78, 0.1, 5, horn);
  }
  antler(18, -62);                                  // the far antler, behind the head
  var locks = [[-10, -60, -0.85, 160], [-28, -50, -0.6, 184], [-42, -34, -0.36, 200], [-48, -14, -0.12, 206], [-44, 6, 0.1, 190],
               [-34, 24, 0.3, 164], [-16, 32, 0.5, 130]];
  for (n = 0; n < locks.length; n++) {              // the mane, streaming back from the skull
    pen.save();
    pen.translate(locks[n][0], locks[n][1]);
    pen.rotate(Math.PI + locks[n][2]);
    dragonLock(locks[n][3], 44, 15, clock * 3.2 + n * 1.3, c.mane);
    pen.restore();
  }
  if (breath > 0.02) {                              // the breath, out of the open mouth
    var fans = [[-0.5, 0.52], [0.5, 0.56], [-0.26, 0.76], [0.28, 0.8], [0, 1]];
    for (n = 0; n < fans.length; n++) {
      pen.save();
      pen.translate(104, 12);
      pen.rotate(0.12 + fans[n][0]);
      dragonFire(300 * breath * fans[n][1], 46, 22, clock * 6 + n * 1.9, c);
      pen.restore();
    }
  }
  pen.beginPath();                                  // the inside of the mouth
  pen.moveTo(10, 10);
  pen.lineTo(116, 2);
  pen.lineTo(96 + 4 * open, 18 + 34 * open);
  pen.closePath();
  pen.fillStyle = "#a8322c";
  pen.fill();
  pen.save();                                       // the tongue, out of the mouth and curling up
  pen.translate(40, 14 + 10 * open);
  pen.rotate(0.3 * open);
  nagaTongue(52 + 20 * open, 11, 10, "#c9453d", 1.2 * FINE);
  pen.restore();
  pen.save();                                       // the lower jaw turns about the corner of the mouth
  pen.translate(10, 14);
  pen.rotate(0.55 * open);
  for (n = 0; n < 3; n++) {                         // the beard under the chin
    pen.save();
    pen.translate(60 - n * 18, 12);
    pen.rotate(Math.PI - 0.9 + n * 0.2);
    dragonLock(70 + n * 14, 14, 9, clock * 3 + n * 2, c.mane);
    pen.restore();
  }
  pen.beginPath();
  pen.moveTo(-26, -2);
  pen.quadraticCurveTo(40, -8, 92, -4);
  pen.quadraticCurveTo(104, 4, 90, 12);
  pen.quadraticCurveTo(30, 22, -26, 16);
  pen.closePath();
  shape(c.body);
  pen.beginPath();                                  // the lower teeth, a row of them
  for (n = 0; n < 5; n++) {
    pen.moveTo(22 + n * 15, -5);
    pen.lineTo(26 + n * 15, -14 - (n === 4 ? 4 : 0));
    pen.lineTo(30 + n * 15, -5);
  }
  pen.fillStyle = "#fff6ea";
  pen.fill();
  pen.restore();
  pen.beginPath();                                  // the skull: the lump on the crown, then a long snout that rises at the nose
  pen.moveTo(-34, 20);
  pen.quadraticCurveTo(-56, -22, -24, -56);
  pen.quadraticCurveTo(-12, -78, 10, -70);         // the chimu, the lump on the crown
  pen.quadraticCurveTo(30, -62, 46, -50);
  pen.quadraticCurveTo(76, -42, 100, -40);
  pen.quadraticCurveTo(118, -44, 126, -30);         // the nose turns up
  pen.quadraticCurveTo(130, -14, 120, -4);
  pen.quadraticCurveTo(112, 6, 96, 8);
  pen.quadraticCurveTo(50, 14, 8, 14);
  pen.closePath();
  shape(c.body);
  pen.save();
  pen.clip();
  var cheek = pen.createRadialGradient(24, -10, 4, 24, -10, 50);   // the cheek takes the light, the back of the skull turns away
  cheek.addColorStop(0, "rgba(255, 244, 214, 0.5)");
  cheek.addColorStop(1, "rgba(255, 244, 214, 0)");
  pen.fillStyle = cheek;
  pen.fillRect(-60, -90, 200, 120);
  var away = pen.createLinearGradient(-58, 0, 6, 0);
  away.addColorStop(0, "rgba(70, 36, 20, 0.42)");
  away.addColorStop(1, "rgba(70, 36, 20, 0)");
  pen.fillStyle = away;
  pen.fillRect(-60, -90, 70, 120);
  pen.fillStyle = "rgba(70, 36, 20, 0.24)";         // shade under the brow and along the snout's underside
  pen.beginPath();
  pen.ellipse(44, -54, 30, 8, 0.15, 0, 7);
  pen.fill();
  pen.beginPath();
  pen.ellipse(84, 6, 36, 6, -0.04, 0, 7);
  pen.fill();
  pen.strokeStyle = c.spots;                        // scales on the skull, behind the eye
  pen.lineWidth = 1.2 * FINE;
  pen.beginPath();
  for (var row = 0; row < 6; row++) {
    for (var col = 0; col < 5; col++) {
      var dx = -46 + col * 12 + (row % 2) * 6, dy = -56 + row * 12;
      pen.moveTo(dx, dy - 5);
      pen.arc(dx - 5, dy, 5, -Math.PI / 2, Math.PI / 2);
    }
  }
  pen.stroke();
  pen.restore();
  pen.strokeStyle = inkFor(c.body);                 // the line of the cheek, the folds behind the nose, the upper lip
  pen.lineWidth = 1.8 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(50, -18);
  pen.quadraticCurveTo(28, -4, 36, 12);
  for (n = 0; n < 3; n++) {
    pen.moveTo(84 + n * 9, -38 + n * 1.5);
    pen.quadraticCurveTo(90 + n * 9, -28 + n * 1.5, 86 + n * 9, -16 + n * 1.5);
  }
  pen.moveTo(44, 12);
  pen.quadraticCurveTo(80, 6, 116, 1);
  pen.stroke();
  pen.beginPath();                                  // the upper teeth: a row, with two fangs
  for (n = 0; n < 5; n++) {
    var fang = n === 0 || n === 3;
    pen.moveTo(40 + n * 15, 10 - n * 1.6);
    pen.lineTo(44 + n * 15, (fang ? 28 : 20) - n * 1.6);
    pen.lineTo(49 + n * 15, 9 - n * 1.6);
  }
  pen.fillStyle = "#fff6ea";
  pen.fill();
  oval(119, -28, 11, 9, c.belly);                   // the bulbous nose, and its nostrils, flared
  oval(123, -27, 2.6, 3.4, "#7a3a3a");
  oval(114, -24, 2.2, 2.8, "#7a3a3a");
  pen.beginPath();                                  // the eye: round and bulging, a yellow iris
  pen.ellipse(38, -40, 15, blink ? 1.5 : 15, 0, 0, 7);
  shape("#fff6ea");
  if (!blink) {
    oval(41, -40, 9.5, 9.5, "#e9b53a");
    oval(42, -40, 4, 4.4, "#1f1a1a");
  }
  pen.save();                                       // the brow: a bushy lock over the eye
  pen.translate(58, -58);
  pen.rotate(Math.PI + 0.34);
  dragonLock(68, 20, 6, clock * 3 + 1, c.mane);
  pen.restore();
  pen.save();                                       // a cow's ear, behind the eye, leaf-shaped, pointing back and up
  pen.translate(-8, -58);
  pen.rotate(-2.5);
  nagaTongue(46, 20, 4, c.body, 1.6 * FINE);
  pen.translate(6, 0);
  nagaTongue(28, 10, 3, c.belly);
  pen.restore();
  antler(4, -68);                                   // the near antler
  for (n = 0; n < 2; n++) {                         // the whiskers: long, from beside the nose, curling as they stream back
    pen.save();
    pen.translate(112 - n * 8, -12 + n * 8);
    pen.rotate(Math.PI - 0.1 - n * 0.35);
    dragonLock(380 - n * 80, 20, 70, clock * 2.2 + n * 2, c.mane);
    pen.restore();
  }
}

// The three manners of flight. arch: the height of a standing dragon's arches,
// archK and archSpeed their closeness and their travel; wave, waveK, waveSpeed
// the tail's own undulation, which grows from "from" of the body to the tip;
// cork: whether the body corkscrews now and then; lock and stream: how the
// locks wave and how fast they stream; legs: how fast the legs paddle.
var DRAGON_FLIGHT = {
  glide: {arch: 80, archK: 0.75, archSpeed: 2.2, wave: 72, waveK: 12, waveSpeed: 3.2, from: 0.3, cork: true, lock: 1, stream: 1, legs: 1},
  hover: {arch: 80, archK: 0.75, archSpeed: 0.9, wave: 50, waveK: 9, waveSpeed: 1.2, from: 0.3, lock: 1.5, stream: 0.4, legs: 0.5},
  fast: {arch: 25, archK: 1.3, archSpeed: 7, wave: 28, waveK: 22, waveSpeed: 9, from: 0.1, lock: 0.45, stream: 2.4, legs: 2.2}
};

// The flight, laid over the body's line (the dense one), whether the body is
// a straight line or the chain behind a led head: the arches, small behind
// the head and full from 0.19 of the body, travelling down it; the tail's
// own undulation across the body, nothing at the shoulders, growing down the
// body and fullest at the tip, travelling toward it; and in a glide, now and
// then, the corkscrew. Each point is moved across the line's own way there,
// so the waves lie across the body whichever way the body runs (owner,
// 2026-10-15: "make the whole body glide, not just the tail": before this
// the led dragon's body was the chain alone).
//
// The corkscrew (owner: "a corkscrew through the whole body"): over a short
// stretch of the body the line is carried once round a circle, along the body
// and across it, which is nothing at the stretch's ends of itself, so the body
// makes a full loop there (the circle is wider than the stretch, so the line
// comes back on itself) and runs smoothly into it and out of it; the loop is
// large where the body is thick and smaller toward the tail. It is drawn in
// ONE frame, the line's way at the loop's middle (in each point's own frame it
// smears into a hairpin where the body bends), with the waves held still
// through it (or they shear it). It starts behind the mane and runs off the
// tip in 3.6 s, every "when" seconds (8 if unsaid) or at the moments "when"
// lists; "seed" keeps two dragons on the same period from looping together.
function dragonFlight(line, air, when, seed) {
  var last = line.length - 1, out = [], cork = null, p = -1, n;
  if (air.cork) {
    if (when && when.length !== undefined) {
      for (n = 0; n < when.length; n++) { if (clock >= when[n] && clock < when[n] + 3.6) { p = (clock - when[n]) / 3.6; } }
    } else { p = ((clock + seed) % (when || 8)) / 3.6; }
    if (p >= 0 && p < 1) {
      var at = 0.2 + 0.88 * p;                        // from behind the mane off the tip
      cork = {at: at, half: 0.07, r: (84 - 34 * Math.min(1, at)) * Math.min(1, p / 0.1)};
    }
  }
  function wave(u) {                                // the arches and the tail's undulation across the body at u
    var grow = Math.pow(clamp((u - air.from) / (1 - air.from)), 2);
    return -air.arch * Math.min(1, u * 16 / 3) * Math.sin(u * 16 * air.archK - clock * air.archSpeed)
           + air.wave * grow * Math.sin(u * air.waveK - clock * air.waveSpeed);
  }
  function way(n) {                                 // the way the line runs at its nth point
    var a = line[Math.max(0, n - 1)], b = line[Math.min(last, n + 1)];
    var far = Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2)) || 1;
    return [(b[0] - a[0]) / far, (b[1] - a[1]) / far];
  }
  var loopWay = cork ? way(Math.round(Math.max(0, Math.min(1, cork.at)) * last)) : null;
  for (n = 0; n <= last; n++) {
    var t = way(n), u = n / last, across = wave(u), x = line[n][0], y = line[n][1];
    if (cork && Math.abs(u - cork.at) < cork.half) {
      var v = (u - cork.at + cork.half) / (2 * cork.half), th = v * Math.PI * 2;
      across = mix(across, wave(cork.at), Math.pow(Math.sin(v * Math.PI), 2));
      x += loopWay[0] * cork.r * Math.sin(th) - loopWay[1] * cork.r * (1 - Math.cos(th));
      y += loopWay[1] * cork.r * Math.sin(th) + loopWay[0] * cork.r * (1 - Math.cos(th));
    }
    out.push([x - t[1] * across, y + t[0] * across]);
  }
  return out;
}

// A dragon, its head at (x, y). Everything about it is in "look" (see
// DRAGON_KEYS above). It gives back {claw, size}: where its near front foot
// is, in the points of the frame it was drawn in, so a film can put something
// in that claw; and how large it was drawn, depth and all.
function dragon(x, y, look) {
  checkNames("The dragon's name", look, DRAGON_KEYS);
  var scene = pen.getTransform(), claw = null;
  var size = (look.size || 1) * (look.depth === undefined ? 1 : 0.35 + 1.25 * look.depth), face = look.face || 1, n;
  var china = look.kind === "chinese";
  // The Chinese dragon's own colours when none are given: the emperor's gold
  // with a pale belly, the scales drawn in a darker gold, spines of vermilion.
  var c = china
        ? {body: look.body || "#e0b24a", spots: look.spots || "#8a5a1a", belly: look.belly || "#f4e6bf",
           crest: look.flame || "#c9552a", fire: "#f6c445", mane: look.mane || "#d9a441", pearl: look.pearl || "#f2f4f8", skin: "dots"}
        : {body: look.body || "#dcb47c", spots: look.spots || "#7a4a2a", belly: look.belly || "#eeb0aa",
           crest: look.flame || "#e8632c", fire: "#f6c445", mane: look.mane || "#d9a441", pearl: look.pearl || "#dfe6f2", skin: "dots"};
  c.bars = blend(c.belly, "#7a2a2a", 0.4);          // the lines between the belly's plates
  FINE = Math.min(1, Math.pow(size, -0.7));         // a larger dragon is not inked heavier
  LINE = STYLE.line * FINE;
  pen.save();
  if (look.depth !== undefined) { pen.globalAlpha *= 0.55 + 0.45 * look.depth; }   // far off, it fades like a hill in haze
  pen.translate(x, y);
  pen.scale(size * face, size);

  var air = DRAGON_FLIGHT[look.fly || "glide"] || DRAGON_FLIGHT.glide;
  DRAGON_AIR = {wave: air.lock, turn: air.stream};

  // The spine. One that is led follows its head as a chain; one that stays
  // is a straight line. Then the flight, the arches and the tail's wave, is
  // laid over it, and the line walked again so its points are evenly spaced
  // for the painter.
  var spine = [];
  if (look.trail) { spine = nagaChain(look.trail, x, y, size, face).slice(0, 62); }
  else { for (n = 0; n < 17; n++) { spine.push([-n * 52, 0]); } }
  var line = nagaWalk(dragonFlight(nagaLine(spine, 4), air, look.corkscrew, 2.5 * (look.late || 0) + (face < 0 ? 1.5 : 0)), 9), last = line.length - 1;
  function wide(u) { return mix(45, 10, Math.pow(u, 1.2)) - 13 * Math.pow(1 - Math.min(1, u / 0.1), 2); }
  function along(u) {                               // a point of the spine: where it is, the way to the tail, and half its width
    var k = Math.max(1, Math.min(last - 1, Math.round(u * last)));
    var far = Math.sqrt(Math.pow(line[k + 1][0] - line[k - 1][0], 2) + Math.pow(line[k + 1][1] - line[k - 1][1], 2)) || 1;
    return {x: line[k][0], y: line[k][1], tx: (line[k + 1][0] - line[k - 1][0]) / far, ty: (line[k + 1][1] - line[k - 1][1]) / far, w: wide(u)};
  }
  var paws = [[0.19, -1, 0], [0.56, 1, 1.6]], dark = blend(c.body, "#5a3a22", 0.2);
  function legs(near) {                             // the two legs of one side: the far ones are behind the body, and a little darker
    for (var k = 0; k < 2; k++) {
      var s = along(paws[k][0]), beat = clock * 2.4 * air.legs + paws[k][2] + (near ? 0 : Math.PI);
      var sx = s.x + (near ? 0 : -24), sy = s.y + s.w * 0.4 + (near ? 0 : -8);
      var foot = dragonLeg(sx, sy, sx + 34 + 20 * Math.sin(beat), sy + 96 + 12 * Math.cos(beat), paws[k][1], near ? c.body : dark, c,
                           china ? look.pearls === true : look.pearls !== false, china, look.claws);
      if (near && k === 0) { claw = scene.inverse().transformPoint(pen.getTransform().transformPoint(new DOMPoint(foot[0], foot[1]))); }
    }
  }
  legs(false);
  var tip = along(1);                               // the tail's hair
  for (n = 0; n < 5; n++) {
    pen.save();
    pen.translate(tip.x, tip.y);
    pen.rotate(Math.atan2(tip.ty, tip.tx) + (n - 2) * 0.2);
    dragonLock(190 - Math.abs(n - 2) * 26, 26, 20, clock * 3 + n * 1.2, c.mane);
    pen.restore();
  }
  var fires = china ? [] : [0.1, 0.22, 0.36, 0.5, 0.63, 0.76, 0.88];   // a Chinese dragon's back is a ridge of spines, no flames
  for (n = 0; n < fires.length; n++) {              // the taller flames of the back, under the body's edge
    var f = along(fires[n]);
    pen.save();
    pen.translate(f.x - f.ty * f.w * 0.9, f.y + f.tx * f.w * 0.9);
    pen.rotate(Math.atan2(f.tx * 0.75 + f.ty * 0.66, -f.ty * 0.75 + f.tx * 0.66));   // out from the back, and leaning toward the tail
    nagaFlame(34 + 1.7 * f.w, 16 + 0.5 * f.w, [[-0.5, 0.55, -1], [0.45, 0.6, 1], [0, 1, 1]], n, c);
    pen.restore();
  }
  nagaStrip(line, wide, c, []);
  if (china) { dragonScales(line, wide, c); }       // scales over the dots: the strip's belly of plates and its spines stay
  legs(true);
  var neck = along(0.03), nod = Math.max(-0.5, Math.min(0.5, Math.atan2(-neck.ty, -neck.tx)));
  var up = look.late !== undefined ? hop(clock, look.late) : 0, breath = clamp(look.breath || 0);
  var open = look.mouth !== undefined ? look.mouth : look.sing ? 1 - up : 0.22 + 0.12 * Math.sin(clock * 1.3);
  pen.save();
  pen.translate(line[0][0], line[0][1]);
  pen.rotate(0.3 * nod);                            // the head keeps nearly level, whatever the neck does
  pen.scale(1.22, 1.22);
  if (china) {
    dragonHeadChina(clamp(Math.max(open, 0.75 * breath)), breath, c);
    if (look.chase !== false) { dragonChasedPearl(168, -40 + 6 * Math.sin(clock * 1.7), 30, c); }   // the flaming pearl, just off the snout
  } else {
    dragonHead(clamp(Math.max(open, 0.75 * breath)), breath, c);
  }
  pen.restore();
  pen.restore();
  FINE = 1;
  DRAGON_AIR = {wave: 1, turn: 1};
  LINE = STYLE.line;
  return {claw: [claw.x, claw.y], size: size};
}
