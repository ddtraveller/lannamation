// forestanimals.js - four animals of the forests, the cliffs and the river of the north, for the Lanna cartoon kit.
// Load it after the kit, beasts.js, northbirds.js and lannabirds.js (it draws with their helpers):
//
//     <script src="oldcartoon.js"></script>
//     <script src="beasts.js"></script>
//     <script src="northbirds.js"></script>
//     <script src="lannabirds.js"></script>
//     <script src="forestanimals.js"></script>
//
// and call each from a scene as the kit's rooster() is called; t is the second; look holds what it does, and a
// name it does not know is warned of.
//
//   slowLoris(x, y, t, look)       the Bengal slow loris, ลิงลม: creeps hand over hand along a branch, turns its
//                                  great eyes to us, hangs under the branch, sleeps curled; its eyes shine at night
//   gibbon(x, y, t, look)          the white-handed gibbon, ชะนี: sits, swings arm over arm along a branch, walks
//                                  upright along it, sings with its head thrown back; buff or dark
//   goral(x, y, t, look)           the goral, กวางผา: stands on a ledge, walks, leaps from ledge to ledge, grazes,
//                                  looks about
//   giantCatfish(x, y, t, look)    the Mekong giant catfish, ปลาบึก: glides in deep water, its body waving, its mouth
//                                  working
//
// Why these (each said again above its animal, with its source; the research is the NotebookLM notebooks "Birds
// and animals of Lanna", "Nocturnal creatures of northern Thailand" and "Lanna fish"):
//   - the slow loris: in the north a man had the ลิงลม tattooed on his thighs for its quiet and its quickness to
//     slip away (Ramkhamhaeng Journal, the study of the tattoos at Wat Phumin); it is called the "wind monkey".
//   - the gibbon: "hilltribe people believed that the call of gibbons had a magical and beneficial effect on crops,
//     and until very recently they protected this monkey" (A Guide to Chiang Mai and Northern Thailand).
//   - the goral: the north's own wild goat of the limestone cliffs, of Doi Chiang Dao, Om Koi and Mae Ping, where
//     it is bred and let go again (its species is the Chinese goral, Naemorhedus griseus; the red goral of some
//     writings lives further west).
//   - the giant catfish: ปลาเจ้า, the lord's fish of the Mekong at Chiang Khong, a fish that keeps the precepts,
//     guarded by the spirits of the river; it is not taken without a rite to them at Songkran (the Chiang Rai
//     fisheries office; "คุณค่าปลาบึกที่สิ้นมนต์ขลัง").
// Each is drawn from rules read from photographs on Wikimedia Commons under free licences, kept with their credits
// outside the repository; nothing of them is copied. At size 1 each is as large as it would be beside the cast
// (340 px is 160 cm): a loris about 70 long, a gibbon about 130 tall standing, a goral about 140 at the shoulder,
// the catfish about 420 long (two metres; they grow to three).

var LORIS_KEYS = {}, GIBBON_KEYS = {}, GORAL_KEYS = {}, CATFISH_KEYS = {};
["size", "face", "creep", "look", "hang", "curl", "shine", "seed", "feel"].forEach(function (n) { LORIS_KEYS[n] = true; });
["size", "face", "dark", "swing", "span", "step", "sing", "seed", "feel"].forEach(function (n) { GIBBON_KEYS[n] = true; });
["size", "face", "step", "leap", "graze", "alert", "turn", "slope", "seed", "feel"].forEach(function (n) { GORAL_KEYS[n] = true; });
["size", "face", "mouth", "light", "seed"].forEach(function (n) { CATFISH_KEYS[n] = true; });

// A shape of fur: the path already begun on pen filled with "colour" (or "paint") and inked in a fine broken line,
// short strokes of hair laid along its edge pointing "out" of it. Returns nothing: it draws with pen.
// e.g. lbSmooth(pts); forestFur(pts, "#b8a088", grad, 1.6);
function forestFur(pts, colour, paint, hair) {
  pen.fillStyle = paint || colour;
  pen.fill();
  var ink = inkFor(colour), n = pts.length, k;
  pen.strokeStyle = ink;
  pen.lineWidth = LINE * 0.9;
  pen.stroke();
  pen.strokeStyle = blend(colour, "#ffffff", 0.25);  // the soft hairs standing at its edge
  pen.lineWidth = LINE * 0.6;
  pen.beginPath();
  for (k = 0; k < n; k++) {
    var a = pts[k], b = pts[(k + 1) % n], cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    for (var s = 0; s < 3; s++) {
      var px = mix(a[0], b[0], (s + 0.5) / 3), py = mix(a[1], b[1], (s + 0.5) / 3);
      pen.moveTo(px, py);
      pen.lineTo(px + dy / l * (hair || 2) - dx / l * 1.5, py - dx / l * (hair || 2) - dy / l * 1.5);
    }
  }
  pen.stroke();
}

// ---------- the slow loris ----------
// The Bengal slow loris (Nycticebus bengalensis, ลิงลม, "the wind monkey"; also นางอาย, "the shy lady"), of the
// north's forests at night. A man of the north had it tattooed on his thighs, for the loris slips away unseen
// (Ramkhamhaeng Journal, Humanities, on the thigh tattoos at Wat Phumin); some say it brings up the wind to hide
// itself. Read from photographs:
//   1. A round head with great round eyes set to the front, orange-brown, each in a ring of dark brown fur; a white
//      stripe between them down the nose; small round ears half hidden in the fur.
//   2. Thick soft fur, buff-grey to rufous, paler below; a dark stripe from the crown along the middle of the back.
//   3. No tail to see; short strong limbs of even length; hands and feet that grip round a branch, the thumb and the
//      great toe set wide from the rest.
//   4. It moves slowly and smoothly, one hand or foot at a time, never letting go with more than one; it hangs under
//      a branch by its feet; it sleeps rolled into a ball, the head tucked between its arms. Its eyes shine in a
//      light at night.
// The look's names: size, face, creep (grows a step at a time while it creeps along the branch; one hand or foot at
// a time), look (0 to 1: the head turned to face us), hang (true: under the branch, hanging by its feet and a hand),
// curl (0 to 1: rolled up asleep), shine (0 to 1: its eyes catching a light at night), seed, feel.

var LORIS = {fur: "#bfa384", furLight: "#e2ccb0", furDark: "#8a6a4a", stripe: "#6a4228", ring: "#5a3a22", belly: "#e8dcc6", eye: "#c8701e",
             nose: "#f6f0e6", skin: "#c8a090"};

// The loris's head, round, about (hx, hy), turned "turn" (0 side on, 1 to us); e a feeling; shine its eyes'
// shine. Returns nothing: it draws with pen.
// e.g. lorisHead(30, -40, 0.8, null, 0);
function lorisHead(hx, hy, turn, e, shine) {
  var r = 17, k;
  [[-1, 0], [1, 0]].forEach(function (s) {          // rule 1: the small round ears, half hidden
    var ex = hx + s[0] * mix(4, 13, turn) - (1 - turn) * 8, ey = hy - 13;
    nbOval(ex, ey, 5, 4.5); nbPaint(LORIS.furDark);
    nbOval(ex, ey + 0.5, 3, 2.6); nbFill(LORIS.skin);
  });
  var pts = [[hx + 17, hy + 2], [hx + 12, hy - 13], [hx, hy - 18], [hx - 13, hy - 14], [hx - 18, hy], [hx - 12, hy + 13], [hx + 2, hy + 16], [hx + 13, hy + 12]];
  lbSmooth(pts);
  forestFur(pts, LORIS.fur, nbGrad(hx, hy - 18, hx, hy + 16, LORIS.furLight, LORIS.fur), 1.8);
  pen.save();
  lbSmooth(pts);
  pen.clip();
  var mx = hx + (1 - turn) * 9;                      // the face's middle: to the front when side on
  pen.strokeStyle = LORIS.stripe;                    // rule 2: the dark stripe from the crown back
  pen.lineWidth = 5;
  pen.beginPath(); pen.moveTo(mx - 2, hy - 10); pen.quadraticCurveTo(hx - 8, hy - 22, hx - 20, hy - 18); pen.stroke();
  for (k = 0; k < 2; k++) {                          // rule 1: the eyes in their dark rings
    if (turn < 0.35 && k === 0) { continue; }        // side on, only the near eye shows
    var off = (k ? 1 : -1) * mix(3, 7.5, turn), ex2 = mx + off, ey2 = hy - 2;
    nbOval(ex2, ey2, 7.4, 8.2, (k ? 0.3 : -0.3));
    nbFill(LORIS.ring);
  }
  lbSmooth([[mx - 1.8, hy - 14], [mx + 1.8, hy - 14], [mx + 2.6, hy + 6], [mx, hy + 9], [mx - 2.6, hy + 6]]);   // rule 1: the white stripe down the nose
  nbFill(LORIS.nose);
  for (k = 0; k < 2; k++) {
    if (turn < 0.35 && k === 0) { continue; }
    var off2 = (k ? 1 : -1) * mix(3, 7.5, turn), ex3 = mx + off2, ey3 = hy - 2;
    nbOval(ex3, ey3, 5.2, 5.4);
    nbFill(blend(LORIS.eye, "#ffb050", shine * 0.6));
    if (e) { nbEye(ex3, ey3, 4.4, LORIS.eye, e, LORIS.ring, "#120a06"); }
    else {
      nbOval(ex3 + 0.4, ey3, 2.6, 3.4); nbFill("#120a06");
      nbOval(ex3 - 1.2, ey3 - 1.8, 1.3, 1.3); nbFill("rgba(255, 255, 255, 0.95)");
    }
    if (shine > 0) {                                 // rule 4: the eyeshine, a glow from the back of the eye
      var glow = pen.createRadialGradient(ex3, ey3, 0, ex3, ey3, 12);
      glow.addColorStop(0, "rgba(255, 190, 90, " + (0.95 * shine) + ")");
      glow.addColorStop(0.4, "rgba(255, 150, 40, " + (0.5 * shine) + ")");
      glow.addColorStop(1, "rgba(255, 140, 40, 0)");
      pen.save(); pen.restore();
      pen.fillStyle = glow;
      pen.fillRect(ex3 - 12, ey3 - 12, 24, 24);
    }
  }
  nbOval(mx + (1 - turn) * 6, hy + 8, 2.4, 1.6); nbFill("#3a2420");   // the small nose
  pen.restore();
}

// A loris's hand or foot gripping round a branch at (gx, gy): fingers over the top, the thumb under.
// Returns nothing: it draws with pen.
// e.g. lorisGrip(10, 0, LORIS.fur);
function lorisGrip(gx, gy, colour) {
  nbOval(gx, gy - 2, 5.5, 4.2); nbPaint(colour);
  for (var k = 0; k < 3; k++) { nbLimb([[gx - 2 + k * 2.5, gy - 3], [gx - 1 + k * 2.6, gy + 4]], 2.2, LORIS.skin); }
}

// The slow loris (rules above), on a branch whose top is at (x, y); at second t.
//   look   LORIS_KEYS: size, face, creep, look, hang, curl, shine, seed, feel
// Returns {eyes: [x, y]}: between its eyes, on the sheet. It draws with pen (nbBegin() and nbEnd()).
// e.g. slowLoris(800, 420, clock, {creep: clock * 0.3, shine: 1});
function slowLoris(x, y, t, look) {
  look = look || {};
  checkNames("The loris's name", look, LORIS_KEYS);
  var e = look.feel !== undefined ? creatureFeel(look, t) : null, own = t + (look.seed || 0);
  var keep = lbBegin(x, y, look, 1, 0.8);
  var creeping = look.creep !== undefined, creep = look.creep || 0, turn = clamp(look.look || 0), curl = clamp(look.curl || 0), shine = clamp(look.shine || 0);
  var hang = !!look.hang, k, eyes;
  if (hang) { pen.scale(1, -1); }                    // rule 4: hanging, the loris is the same on the branch's underside, upside down
  var limbs = [[-26, 0], [-16, 0.5], [16, 0.25], [26, 0.75]];   // hind far, hind near, fore far, fore near: x on the branch, and when in the round it moves
  var reach = function (L) {                         // rule 4: one limb at a time lifts and goes forward, slowly
    if (!creeping) { return [L[0], 0]; }
    var u = ((creep + L[1]) % 1), lift = u > 0.75 ? Math.sin((u - 0.75) / 0.25 * Math.PI) : 0;
    var fx = L[0] + (u < 0.75 ? 9 - u / 0.75 * 18 : -9 + (u - 0.75) / 0.25 * 18);
    return [fx, -lift * 6];
  };
  var sway = creeping ? 2 * Math.sin(creep * Math.PI * 2) : 0.6 * Math.sin(own * 0.8);
  if (curl > 0.5) {                                  // rule 4: asleep, a ball of fur on the branch, its arms round its head
    var pts0 = [[24, -10], [18, -30], [0, -38], [-20, -32], [-28, -14], [-20, 0], [0, 2], [18, 0]];
    lbSmooth(pts0);
    forestFur(pts0, LORIS.fur, nbGrad(0, -38, 0, 2, LORIS.furLight, LORIS.fur), 2);
    pen.strokeStyle = LORIS.stripe; pen.lineWidth = 5;
    pen.beginPath(); pen.moveTo(-22, -26); pen.quadraticCurveTo(-2, -42 - Math.sin(own * 1.2), 16, -28); pen.stroke();
    lorisGrip(-14, 0, LORIS.furDark); lorisGrip(12, 0, LORIS.furDark);
    nbLimb([[14, -8], [22, -16], [16, -24]], 8, LORIS.fur);   // an arm round the tucked head
    nbOval(6, -18, 9, 7); nbPaint(LORIS.fur);
    pen.strokeStyle = LORIS.ring; pen.lineWidth = 1.6;
    pen.beginPath(); pen.moveTo(2, -18); pen.quadraticCurveTo(6, -16, 10, -18); pen.stroke();   // a closed eye
    eyes = pen.getTransform().transformPoint(new DOMPoint(6, -18));
    nbEnd(keep);
    return {eyes: [eyes.x, eyes.y]};
  }
  limbs.forEach(function (L, n) {                    // the far limbs, behind the body
    if (n % 2) { return; }
    var p = reach(L), hip = [L[0] * 0.7, -16];
    nbLimb([hip, [mix(hip[0], p[0], 0.5) + (L[0] < 0 ? -3 : 3), -12 + p[1] * 0.5], [p[0], p[1] - 2]], 7, LORIS.furDark);
    lorisGrip(p[0], p[1], LORIS.furDark);
  });
  var pts = [[30, -20 + sway * 0.3], [20, -30], [0, -33 + sway * 0.4], [-22, -30], [-34, -20], [-30, -10], [-10, -6], [14, -8]];   // rule 2: the body, low along the branch
  lbSmooth(pts);
  forestFur(pts, LORIS.fur, nbGrad(0, -33, 0, -6, LORIS.furLight, LORIS.belly), 2.2);
  pen.save();
  lbSmooth(pts);
  pen.clip();
  pen.strokeStyle = LORIS.stripe;                    // rule 2: the dark stripe along the back
  pen.lineWidth = 6;
  pen.beginPath(); pen.moveTo(24, -28); pen.quadraticCurveTo(0, -36 + sway * 0.4, -30, -26); pen.stroke();
  pen.restore();
  limbs.forEach(function (L, n) {                    // the near limbs, over the body
    if (!(n % 2)) { return; }
    var p = reach(L), hip = [L[0] * 0.7, -14];
    nbLimb([hip, [mix(hip[0], p[0], 0.5) + (L[0] < 0 ? -3 : 3), -10 + p[1] * 0.5], [p[0], p[1] - 2]], 8, LORIS.fur);
    lorisGrip(p[0], p[1], LORIS.fur);
  });
  var hx = 34, hy = -28 + sway * 0.3 - (e ? 4 * e.raise : 0);
  if (hang) {                                        // hanging, it lifts its head to look about (upright on the sheet)
    pen.save(); pen.translate(hx, hy); pen.scale(1, -1); pen.translate(-hx, -hy);
  }
  lorisHead(hx, hy, turn, e, shine);
  eyes = pen.getTransform().transformPoint(new DOMPoint(hx + (1 - turn) * 9, hy - 2));
  if (hang) { pen.restore(); }
  nbEnd(keep);
  return {eyes: [eyes.x, eyes.y]};
}

// ---------- the gibbon ----------
// The white-handed gibbon (Hylobates lar, ชะนี) of the north's high forests. "Hilltribe people believed that the
// call of gibbons had a magical and beneficial effect on crops, and until very recently they protected this
// monkey" (A Guide to Chiang Mai and Northern Thailand); its song in the morning is the voice of the deep forest.
// Read from photographs:
//   1. A small ape, no tail; very long arms, the hands long and hooked, the legs short.
//   2. Two colours, buff to cream or dark brown to black, in the same family; on both, a ring of white fur round
//      the black face, and white hands and feet.
//   3. A black face, small, the eyes close and dark, the brow a little heavy; small ears hidden.
//   4. It swings arm over arm under a branch, the body falling and swinging up like a pendulum, the free arm
//      reaching for the next hold; it walks upright along a branch, its arms held up; it sits with its knees up;
//      it sings with its head back and its lips pushed out in a round "hoo".
// The look's names: size, face, dark (true: the dark one), swing (a number that grows a swing at a time: it
// travels along the branch, (x, y) where it started, under the branch's top; without it, it sits on the branch),
// span (how far one swing goes, 120 the default), step (grows a step at a time: walking upright along the branch),
// sing (0 to 1), seed, feel.

var GIBBON = {buff: {fur: "#d8b88a", furLight: "#f0dcb4", furDark: "#a8885a"}, dark: {fur: "#3a3028", furLight: "#5a4a3e", furDark: "#221a14"},
              face: "#1c1a1a", ring: "#f6f2ea", hand: "#f2eee6"};

// The gibbon's head about (hx, hy), its face toward +x, tipped back "back" (0 to 1, to sing); c its colours; e a
// feeling; sing (0 to 1) the round mouth. Returns nothing: it draws with pen.
// e.g. gibbonHead(0, -80, GIBBON.buff, 0, 0, null);
function gibbonHead(hx, hy, c, back, sing, e) {
  pen.save();
  pen.translate(hx, hy);
  pen.rotate(-back * 0.7);
  pen.scale(1.3, 1.3);
  var pts = [[14, -2], [11, -12], [2, -16], [-9, -14], [-14, -4], [-12, 8], [-2, 14], [10, 12]];
  lbSmooth(pts);                                     // the round head of fur, turned toward us
  forestFur(pts, c.fur, nbGrad(0, -16, 0, 14, c.furLight, c.fur), 2);
  nbOval(3.5, 0.5, 10.5, 11.5, 0.08);                // rule 2: the ring of white fur round the face
  nbFill(GIBBON.ring);
  nbOval(3.8, 1.2, 7.6, 9, 0.08);                    // rule 3: the black face
  nbPaint(GIBBON.face, nbGrad(0, -8, 0, 10, "#3a3434", GIBBON.face));
  pen.strokeStyle = "#4a4444"; pen.lineWidth = 1.2;  // the brow, a little heavy
  pen.beginPath(); pen.moveTo(-1.5, -3.5); pen.quadraticCurveTo(3.8, -6.5, 9, -3.5); pen.stroke();
  [0.6, 7].forEach(function (ex) {                   // the eyes, close and dark
    nbOval(ex, -1, 1.9, 1.7); nbFill("#6a4430");
    if (e) { nbEye(ex, -1, 1.7, "#3a2418", e, GIBBON.face); }
    else { nbOval(ex + 0.3, -1, 1, 1.1); nbFill("#140c08"); nbOval(ex - 0.4, -1.6, 0.5, 0.5); nbFill("rgba(255, 255, 255, 0.9)"); }
  });
  nbOval(3, 3.4, 0.7, 0.5); nbFill("#0c0a0a");       // the nostrils
  nbOval(4.8, 3.4, 0.7, 0.5); nbFill("#0c0a0a");
  if (sing > 0.05) {                                 // rule 4: the lips pushed out, round, singing "hoo"
    nbOval(3.9, 7, 1.6 + sing * 1.4, 1.4 + sing * 2); nbPaint("#2a2424");
    nbOval(3.9, 7.2, 0.9 + sing, 0.7 + sing * 1.6); nbFill("#5a2a2a");
  } else {
    pen.strokeStyle = "#5a5050"; pen.lineWidth = 0.9;
    pen.beginPath(); pen.moveTo(1.6, 6.6); pen.quadraticCurveTo(3.9, 7.6, 6.2, 6.6); pen.stroke();
  }
  pen.restore();
}

// An arm or a leg of the gibbon from "a" by the elbow "b" to the hand "h" ([x, y] each), "wide" thick, the hand
// white and hooked "hook" (0 open, 1 curled round a branch). Returns nothing: it draws with pen.
// e.g. gibbonLimb([0, -60], [20, -90], [30, -120], 6, GIBBON.buff.fur, 1);
function gibbonLimb(a, b, h, wide, colour, hook) {
  nbLimb([a, b, h], wide, colour);
  var dx = h[0] - b[0], dy = h[1] - b[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
  pen.beginPath();                                   // rule 1: the long hand, white, hooked at the fingers
  pen.moveTo(h[0] - uy * wide * 0.6, h[1] + ux * wide * 0.6);
  pen.lineTo(h[0] + ux * 11 - uy * wide * 0.5, h[1] + uy * 11 + ux * wide * 0.5);
  pen.quadraticCurveTo(h[0] + ux * 15 + uy * 4 * hook, h[1] + uy * 15 - ux * 4 * hook, h[0] + ux * 12 + uy * 7 * hook, h[1] + uy * 12 - ux * 7 * hook);
  pen.lineTo(h[0] + uy * wide * 0.6, h[1] - ux * wide * 0.6);
  pen.closePath();
  nbPaint(GIBBON.hand);
}

// The gibbon (rules above), on or under a branch whose top is at (x, y); at second t.
//   look   GIBBON_KEYS: size, face, dark, swing, span, step, sing, seed, feel
// Returns {at: [x, y]}, the middle of its body on the sheet (for a camera to follow a swinging one).
// e.g. gibbon(300, 260, clock, {swing: clock * 0.8});
function gibbon(x, y, t, look) {
  look = look || {};
  checkNames("The gibbon's name", look, GIBBON_KEYS);
  var c = look.dark ? GIBBON.dark : GIBBON.buff, e = look.feel !== undefined ? creatureFeel(look, t) : null, own = t + (look.seed || 0);
  var keep = lbBegin(x, y, look, 1, 0.8);
  var sing = clamp(look.sing || 0), hoo = sing * (0.5 + 0.5 * Math.sin(own * 5)), body;
  var furD = blend(c.fur, "#101010", 0.3);
  if (look.swing !== undefined) {                    // rule 4: arm over arm under the branch, the body a pendulum
    var span = look.span || 120, s = look.swing, k = Math.floor(s), u = s - k, arm = 62;
    var hold = k * span, next = hold + span;
    var ang = mix(-0.75, 0.75, u) + 0.1 * Math.sin(u * Math.PI);   // the swing about the hand on the branch
    var sh = [hold + Math.sin(ang) * arm, 8 + Math.cos(ang) * arm];
    var tilt = ang * 0.6;
    var reachOut = clamp((u - 0.35) / 0.55), free = [mix(sh[0] - 20, next, reachOut), mix(sh[1] + 30, 6, reachOut)];
    pen.save();                                      // the far arm, reaching for the next hold
    gibbonLimb([sh[0] - 4, sh[1]], [mix(sh[0], free[0], 0.5), mix(sh[1], free[1], 0.5) + 8 * (1 - reachOut)], free, 6, furD, reachOut > 0.95 ? 1 : 0.2);
    pen.restore();
    pen.save();
    pen.translate(sh[0], sh[1]);
    pen.rotate(tilt);
    nbLimb([[-6, 46], [-2, 62], [10, 70]], 9.5, furD);   // the legs, tucked up as it swings
    nbLimb([[4, 46], [14, 58], [24, 62]], 10, c.fur);
    var bpts = [[12, -6], [4, -12], [-10, -9], [-15, 10], [-13, 34], [-3, 52], [12, 50], [17, 26], [16, 6]];
    lbSmooth(bpts);
    forestFur(bpts, c.fur, nbGrad(-12, 0, 14, 0, c.furDark, c.furLight), 2.4);
    gibbonHead(6, -18, c, 0.15 + sing * 0.6, hoo, e);
    var mid = pen.getTransform().transformPoint(new DOMPoint(0, 24));
    pen.restore();
    gibbonLimb([sh[0] + 2, sh[1] - 2], [mix(sh[0], hold, 0.5) + 4, mix(sh[1], 6, 0.5)], [hold, 6], 8.5, c.fur, 1);   // the near arm, up to the hand that holds
    body = [mid.x, mid.y];
  } else if (look.step !== undefined) {              // rule 4: walking upright along the branch, the arms held up
    var st = look.step, bob = Math.abs(Math.sin(st * Math.PI * 2)) * 3;
    [[-1, 0], [1, 0.5]].forEach(function (L) {
      var ph = (st + L[1]) % 1, fx = Math.cos(ph * Math.PI * 2) * 10, up = Math.max(0, Math.sin(ph * Math.PI * 2)) * 5;
      nbLimb([[L[0] * 3, -46], [fx + 6, -26 - up], [fx + 2, -up]], 10, L[0] < 0 ? furD : c.fur);
      nbOval(fx + 6, -up - 2, 7, 3); nbPaint(GIBBON.hand);
    });
    pen.translate(0, -bob);
    gibbonLimb([-4, -86], [-26, -110], [-44, -124 + 6 * Math.sin(own * 1.5)], 8, furD, 0.3);
    var wpts = [[13, -88], [2, -98], [-13, -93], [-16, -70], [-13, -48], [0, -38], [13, -46], [16, -70]];
    lbSmooth(wpts);
    forestFur(wpts, c.fur, nbGrad(-12, 0, 12, 0, c.furDark, c.furLight), 2.4);
    gibbonHead(4, -104, c, sing * 0.7, hoo, e);
    gibbonLimb([6, -86], [30, -106], [52, -118 + 6 * Math.sin(own * 1.5 + 1)], 8.5, c.fur, 0.3);
    var m2 = pen.getTransform().transformPoint(new DOMPoint(0, -70));
    body = [m2.x, m2.y];
  } else {                                           // rule 4: sitting on the branch, the knees up, one long arm hanging; singing, the head back, the arms up
    nbLimb([[-4, -14], [16, -30], [22, -4]], 11, furD);   // the far leg, the knee up
    gibbonLimb([-2, -58], [-16, -30 - sing * 30], [-8 - sing * 10, -2 - sing * 70], 8, furD, sing > 0.5 ? 0.3 : 1);
    var spts = [[12, -60], [2, -70], [-14, -66], [-20, -40], [-18, -14], [0, -2], [16, -10], [16, -36]];
    lbSmooth(spts);
    forestFur(spts, c.fur, nbGrad(-16, 0, 14, 0, c.furDark, c.furLight), 2.4);
    nbLimb([[2, -12], [22, -26], [26, -2]], 11.5, c.fur); // the near leg
    nbOval(28, -2, 8, 3.2); nbPaint(GIBBON.hand);
    gibbonHead(4, -78, c, 0.05 + sing * 0.9, hoo, e);
    gibbonLimb([4, -58], [14 + sing * 6, -34 - sing * 40], [10 + sing * 20, 18 - sing * 112 + 4 * Math.sin(own * 0.9)], 8.5, c.fur, sing > 0.5 ? 0.3 : 0.6);
    var m3 = pen.getTransform().transformPoint(new DOMPoint(0, -40));
    body = [m3.x, m3.y];
  }
  nbEnd(keep);
  return {at: body};
}

// ---------- the goral ----------
// The goral (Naemorhedus griseus, กวางผา), the wild goat of the north's limestone cliffs: Doi Chiang Dao, Om Koi and
// the gorge of the Ping, where it is bred and let go again. Read from photographs:
//   1. Stocky and goat-like, the legs short and strong, the hooves small and hard for the rock.
//   2. Shaggy coat, grey-brown with a dark stripe along the spine; the legs paler below, the lower legs tawny.
//   3. A white patch on the throat; short horns, black, curving back, ringed at their base, on both sexes.
//   4. Big ears; a dark face; a short dark tufted tail.
//   5. It stands still on a ledge, looking down; it springs from ledge to ledge, the hind legs pushing off, the fore
//      legs reaching down for the next foothold; it grazes the cliff's grass.
// The look's names: size, face, step (grows a stride at a time while it walks), leap (0 to 1: one spring from where
// it is, all four legs pushing off, through the air, to land; the caller moves (x, y) along its arc), graze (0 to
// 1), alert (0 to 1: the head up, the ears forward), turn (-1 to 1: looking back over its shoulder at -1), slope,
// seed, feel.

GAITS.goral = [1, 40, 1.2];                          // amble("goral", ...): its scale, reach and beats a stride

var GORAL = {coat: "#8a7a68", coatLight: "#b0a088", dark: "#3e342a", leg: "#c0a07a", throat: "#f2ece0", horn: "#1c1a18", face: "#4a3e32"};

// The goral (rules above), its feet on (x, y); at second t.
//   look   GORAL_KEYS: size, face, step, leap, graze, alert, turn, slope, seed, feel
// Returns {nose: [x, y]}: its muzzle on the sheet. It draws with pen.
// e.g. goral(700, 400, clock, {alert: 1});
function goral(x, y, t, look) {
  look = look || {};
  checkNames("The goral's name", look, GORAL_KEYS);
  var e = look.feel !== undefined ? creatureFeel(look, t) : null, own = t + (look.seed || 0);
  var size = (look.size || 1) * 1.15, face = look.face || 1;
  var graze = clamp(look.graze || 0), alert = clamp(look.alert || 0), turnBack = Math.max(-1, Math.min(1, look.turn || 0)), leap = clamp(look.leap || 0);
  var walking = look.step !== undefined, gait = Object.assign({}, look, {step: walking ? look.step : undefined});
  var keepLine = LINE, keepFine = FINE;
  FINE = Math.min(1, Math.pow(size, -0.7));
  LINE = STYLE.line * FINE;
  if (!leap) {
    pen.fillStyle = "rgba(60, 50, 40, 0.18)";
    pen.beginPath(); pen.ellipse(x, y + 3, 60 * size, 6 * size, 0, 0, 7); pen.fill();
  }
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  var push = leap ? Math.sin(leap * Math.PI) : 0;    // rule 5: in a leap the body stretches, the legs out behind and before
  if (leap) { pen.rotate(mix(-0.35, 0.3, leap)); }
  var legs = [[-34, -70, 0, -1, false], [28, -66, 0.25, 1, false], [-26, -72, 0.5, -1, true], [36, -68, 0.75, 1, true]];
  var bones = [36, 30, 6];
  function hoof(ax, ay, skin, lifted) {
    pen.save(); pen.translate(ax, ay); pen.rotate(lifted ? 0.5 : 0);
    pen.beginPath(); pen.moveTo(-4.5, -2); pen.lineTo(-5.5, 5); pen.lineTo(6, 5); pen.lineTo(4.5, -2); pen.closePath();
    shape("#1c1814");
    pen.restore();
  }
  function legsSide(far) {
    if (leap) {                                      // rule 5: the hind legs pushed out behind, the fore legs reaching down ahead
      legs.forEach(function (L) {
        if (!!L[4] !== far) { return; }
        var hind = L[0] < 0, tone = far ? blend(GORAL.leg, "#1c1c22", 0.3) : GORAL.leg;
        var to = hind ? [L[0] - 40 * push - 10, -8 + 10 * push] : [L[0] + 36 * push + 4, -6 + 4 * push];
        var ank = limb(L[0], L[1], to[0], to[1], bones[0], bones[1], [7.5, 4.5, 3.4], tone, function (j) { return L[3] * j[0]; }, 0.3);
        hoof(ank[0], ank[1], tone, true);
      });
      return;
    }
    beastLegs(legs, far, gait, bones, [7.5, 4.5, 3.4], GORAL.leg, GAITS.goral[1], 12, hoof);
  }
  legsSide(true);
  pen.save();                                        // rule 4: the short dark tufted tail
  pen.translate(-52, -96);
  pen.rotate(0.5 - alert * 0.6 + 0.1 * Math.sin(own * 2.5));
  lbSmooth([[0, -3], [-10, 0], [-14, 8], [-6, 6], [0, 3]]);
  nbPaint(GORAL.dark);
  pen.restore();
  var bpts = [[44, -84], [30, -98], [0, -100], [-30, -100], [-52, -96], [-58, -80], [-50, -66], [-26, -62], [8, -62], [34, -64], [46, -72]];
  lbSmooth(bpts);
  forestFur(bpts, GORAL.coat, nbGrad(0, -100, 0, -62, GORAL.coatLight, blend(GORAL.coat, GORAL.leg, 0.4)), 3);   // rule 2: the shaggy coat
  pen.save();
  lbSmooth(bpts);
  pen.clip();
  pen.strokeStyle = GORAL.dark;                      // rule 2: the dark stripe along the spine
  pen.lineWidth = 6;
  pen.beginPath(); pen.moveTo(34, -100); pen.quadraticCurveTo(0, -104, -54, -98); pen.stroke();
  pen.strokeStyle = blend(GORAL.coat, GORAL.dark, 0.4);   // the long hairs of the coat, lying back
  pen.lineWidth = 1;
  pen.beginPath();
  for (var h = 0; h < 30; h++) { var hx0 = -50 + (h * 37) % 96, hy0 = -94 + (h * 13) % 30; pen.moveTo(hx0, hy0); pen.lineTo(hx0 - 8, hy0 + 3); }
  pen.stroke();
  pen.restore();
  legsSide(false);
  pen.save();                                        // the neck and the head: down to graze, up when alert, turned back to look
  pen.translate(36, -88);
  var down = graze * 1.2 - alert * 0.4 + (e ? 0.4 * e.nod - 0.3 * e.raise : 0) + (walking ? 0.05 * Math.sin(look.step * Math.PI * 4) : 0);
  pen.rotate(-0.55 + down);
  var npts = [[-12, -12], [12, -16], [30, -10], [32, 4], [16, 12], [-4, 14], [-14, 8]];
  lbSmooth(npts);
  forestFur(npts, GORAL.coat, nbGrad(0, -16, 0, 14, GORAL.coatLight, GORAL.coat), 2.5);
  pen.translate(30, -4);
  pen.rotate(0.75 - down * 0.4);
  if (turnBack < -0.05) { pen.scale(mix(1, -0.6, -turnBack), 1); }   // looking back over the shoulder: the head turns toward us and round
  [[-1, 0.3], [1, 0]].forEach(function (ear) {      // rule 4: the big ears
    pen.save(); pen.translate(0 + ear[0], -8); pen.rotate(-2.4 + alert * 0.6 + ear[1] + 0.08 * Math.sin(own * 1.9));
    lbSmooth([[0, -3], [9, -6], [16, -2], [10, 4], [0, 3]]); nbPaint(ear[0] < 0 ? GORAL.dark : GORAL.coat);
    pen.restore();
  });
  [[-1, 0.15], [1, 0]].forEach(function (hn) {      // rule 3: the short black horns, curving back, ringed at the base
    pen.save(); pen.translate(4 + hn[0] * 2, -10);
    pen.beginPath(); pen.moveTo(-3.5, 0); pen.quadraticCurveTo(-2, -18, -16 - hn[1] * 8, -26); pen.lineTo(-13 - hn[1] * 8, -22); pen.quadraticCurveTo(2, -15, 3.5, 0); pen.closePath();
    nbPaint(hn[0] < 0 ? "#0e0c0a" : GORAL.horn);
    pen.strokeStyle = "rgba(255, 255, 255, 0.25)"; pen.lineWidth = 0.8;
    pen.beginPath(); for (var r = 0; r < 4; r++) { pen.moveTo(-3, -2 - r * 2.4); pen.lineTo(3, -2 - r * 2.4); } pen.stroke();
    pen.restore();
  });
  var hpts = [[-4, -10], [10, -12], [26, -6], [32, 4], [26, 10], [8, 10], [-6, 4]];
  lbSmooth(hpts);
  forestFur(hpts, GORAL.face, nbGrad(0, -12, 0, 10, blend(GORAL.face, GORAL.coat, 0.5), GORAL.face), 1.5);
  lbSmooth([[-6, 4], [6, 10], [10, 18], [-2, 20], [-10, 10]]);   // rule 3: the white throat patch
  nbFill(GORAL.throat);
  nbOval(30, 4, 2, 1.5); nbFill("#100c0a");
  nbOval(12, -4, 3.6, 3.2); nbFill("#e8dcc8");
  nbEye(12.4, -4, 2.8, "#1a1410", e, GORAL.face);
  if (!e) { nbOval(13.4, -5, 0.9, 0.9); nbFill("rgba(255, 255, 255, 0.9)"); }
  var nose = pen.getTransform().transformPoint(new DOMPoint(32, 4));
  pen.restore();
  pen.restore();
  LINE = keepLine;
  FINE = keepFine;
  return {nose: [nose.x, nose.y]};
}

// ---------- the Mekong giant catfish ----------
// The Mekong giant catfish (Pangasianodon gigas, ปลาบึก), among the largest fishes of fresh water, of the Mekong at
// Chiang Khong and Chiang Saen. The river's people call it ปลาเจ้า, the lord's fish: a fish that keeps the
// precepts, under the river's spirits, not to be taken without a rite to them in April, at Songkran (the Chiang Rai
// fisheries office; "คุณค่าปลาบึกที่สิ้นมนต์ขลัง"). Read from photographs of it swimming:
//   1. Huge and heavy, the body deep at the front and long; the head broad and flat, the mouth wide at its front,
//      the eye small and set low, level with the corner of the mouth; no feelers to see on a grown one.
//   2. Dark grey above, shading to silver-white below, a sheen along its side.
//   3. A tall, pointed fin on its back, set forward, its first ray a spine; a small fleshy fin behind it; long
//      pointed fins under the chest; a long low fin under the belly toward the tail; a deeply forked tail.
//   4. It swims slowly, its body waving from the middle back, the mouth opening and closing as it breathes.
// The look's names: size, face, mouth (0 to 1: open), light (0 to 1: the dapple of light from the surface over its
// back, 0.6 the default), seed.

var CATFISH = {back: "#5a6670", side: "#8e9aa2", belly: "#e8ecea", fin: "#4a545c", eye: "#1a1e22", light: "#d8eef0"};

// The giant catfish (rules above), the middle of its body at (x, y); at second t.
//   look   CATFISH_KEYS: size, face, mouth, light, seed
// Returns {mouth: [x, y]}, its mouth on the sheet. It draws with pen (nbBegin() and nbEnd()).
// e.g. giantCatfish(900, 700, clock, {size: 0.6});
function giantCatfish(x, y, t, look) {
  look = look || {};
  checkNames("The catfish's name", look, CATFISH_KEYS);
  var own = t + (look.seed || 0), keep = lbBegin(x, y, look, 1, 1);
  var open = look.mouth === undefined ? 0.3 + 0.3 * Math.sin(own * 1.4) : clamp(look.mouth), dapple = look.light === undefined ? 0.6 : clamp(look.light);
  var N = 20, spine = [], k, phase = own * 1.6;
  for (k = 0; k <= N; k++) {                         // rule 4: the spine from the snout (0) to the tail's root (1), waving more toward the tail
    var s = k / N, sway = Math.pow(s, 1.8) * 26 * Math.sin(phase - s * 3.2);
    spine.push([mix(210, -180, s), sway]);
  }
  var deep = function (s) {                          // rule 1: the body's half-depth along it: deep at the front, tapering to the tail
    if (s < 0.12) { return 6 + 46 * Math.sqrt(s / 0.12); }   // the snout broad and rounded
    if (s < 0.35) { return mix(52, 58, (s - 0.12) / 0.23); }
    return mix(58, 12, Math.pow((s - 0.35) / 0.65, 1.1));
  };
  function at(s, side) {                             // a point on the body's edge, s along it, side 1 the back, -1 the belly
    var i = Math.min(N - 1, Math.floor(s * N)), f = s * N - i, a = spine[i], b = spine[i + 1];
    var px = mix(a[0], b[0], f), py = mix(a[1], b[1], f), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    var d = deep(s) * (side > 0 ? 1 : 0.9);
    return [px - dy / l * d * side, py + dx / l * d * side];
  }
  var tailRoot = spine[N], tailAng = Math.atan2(spine[N][1] - spine[N - 2][1], spine[N][0] - spine[N - 2][0]);
  pen.save();                                        // rule 3: the forked tail
  pen.translate(tailRoot[0], tailRoot[1]);
  pen.rotate(tailAng - Math.PI + 0.25 * Math.sin(phase - 3.4));
  pen.beginPath();
  pen.moveTo(0, -10); pen.quadraticCurveTo(-30, -30, -72, -62); pen.quadraticCurveTo(-56, -20, -40, 0); pen.quadraticCurveTo(-56, 20, -72, 60); pen.quadraticCurveTo(-30, 30, 0, 10);
  pen.closePath();
  nbPaint(CATFISH.fin, nbGrad(0, 0, -72, 0, CATFISH.side, CATFISH.fin));
  pen.strokeStyle = "rgba(30, 40, 50, 0.4)"; pen.lineWidth = 1;
  pen.beginPath(); for (k = 1; k < 7; k++) { pen.moveTo(-4, -6 + k * 2); pen.lineTo(-60, -60 + k * 17); } pen.stroke();
  pen.restore();
  function fin(s, side, tall, back, lean) {          // a fin on the edge at s: tall, its base "back" long, leaning back
    var r = at(s, side), r2 = at(Math.min(1, s + back), side), tip = [mix(r[0], r2[0], 0.3) - lean, r[1] - tall * side];
    pen.beginPath(); pen.moveTo(r[0], r[1]); pen.quadraticCurveTo(r[0] - 4, tip[1] + 10 * side, tip[0], tip[1]); pen.quadraticCurveTo(r2[0] + 6, mix(r2[1], tip[1], 0.5), r2[0], r2[1]); pen.closePath();
    nbPaint(CATFISH.fin, nbGrad(r[0], r[1], tip[0], tip[1], CATFISH.side, CATFISH.fin));
  }
  fin(0.62, -1, 22, 0.28, 10);                       // rule 3: the long low anal fin
  fin(0.68, 1, 10, 0.06, 6);                         // the small fleshy fin on the back
  pen.beginPath();                                   // the body
  for (k = 0; k <= 40; k++) { var p = at(k / 40, 1); if (k) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } }
  for (k = 40; k >= 0; k--) { var q = at(k / 40, -1); pen.lineTo(q[0], q[1]); }
  pen.closePath();
  var bodyPath = new Path2D();
  for (k = 0; k <= 40; k++) { var p2 = at(k / 40, 1); if (k) { bodyPath.lineTo(p2[0], p2[1]); } else { bodyPath.moveTo(p2[0], p2[1]); } }
  for (k = 40; k >= 0; k--) { var q2 = at(k / 40, -1); bodyPath.lineTo(q2[0], q2[1]); }
  bodyPath.closePath();
  nbPaint(CATFISH.side, nbGrad(0, -60, 0, 60, CATFISH.back, CATFISH.belly));
  pen.save();
  pen.clip(bodyPath);
  var sheen = pen.createLinearGradient(0, -20, 0, 10);   // rule 2: the sheen along its side
  sheen.addColorStop(0, "rgba(255, 255, 255, 0)");
  sheen.addColorStop(0.5, "rgba(230, 245, 250, 0.35)");
  sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
  pen.fillStyle = sheen;
  pen.fillRect(-200, -20, 420, 30);
  pen.strokeStyle = "rgba(40, 50, 60, 0.35)";        // the lateral line
  pen.lineWidth = 1.2;
  pen.beginPath();
  for (k = 2; k <= 38; k++) { var m = at(k / 40, 0.15); if (k > 2) { pen.lineTo(m[0], m[1]); } else { pen.moveTo(m[0], m[1]); } }
  pen.stroke();
  if (dapple > 0) {                                  // the light from the surface, rippling over its back
    for (k = 0; k < 16; k++) {
      var dx2 = ((k * 53 + own * 30) % 440) - 220, dy2 = -50 + (k * 17) % 26, w = 14 + (k % 4) * 6;
      nbOval(dx2, dy2 + 4 * Math.sin(own * 2 + k), w, w * 0.32, 0.3 * Math.sin(k));
      nbFill("rgba(220, 240, 245, " + (0.22 * dapple * (0.5 + 0.5 * Math.sin(own * 1.7 + k * 1.3))) + ")");
    }
  }
  pen.restore();
  fin(0.22, 1, 64, 0.1, 22);                         // rule 3: the tall pointed fin on the back, set forward
  var snout = spine[0], gape = open * 10, corner = at(0.09, -0.35);
  pen.beginPath();                                   // rule 1: the wide mouth, a slit from the snout's tip back and down, opening as it breathes
  pen.moveTo(snout[0] + 5, snout[1] + 2);
  pen.quadraticCurveTo(mix(snout[0], corner[0], 0.5), snout[1] + 6, corner[0], corner[1]);
  pen.quadraticCurveTo(mix(snout[0], corner[0], 0.5), snout[1] + 8 + gape, snout[0] + 3, snout[1] + 4 + gape);
  pen.closePath();
  nbFill("#2a2a30");
  var eyeAt = at(0.075, -0.05);                      // rule 1: the small eye, set low, level with the mouth's corner
  nbOval(eyeAt[0], eyeAt[1], 4.2, 4);
  nbPaint("#c8d0d4");
  nbOval(eyeAt[0] + 0.6, eyeAt[1], 2.6, 2.6); nbFill(CATFISH.eye);
  nbOval(eyeAt[0] - 0.4, eyeAt[1] - 1.2, 0.9, 0.9); nbFill("rgba(255, 255, 255, 0.9)");
  var head = at(0, 1), chin = at(0, -1);
  pen.strokeStyle = "rgba(30, 40, 50, 0.45)";        // the gill cover's edge
  pen.lineWidth = 1.6;
  var g0 = at(0.12, 0.6), g1 = at(0.13, -0.85);
  pen.beginPath(); pen.moveTo(g0[0], g0[1]); pen.quadraticCurveTo(g0[0] - 14, (g0[1] + g1[1]) / 2, g1[0], g1[1]); pen.stroke();
  pen.save();                                        // rule 3: the long pectoral fin under the chest, with its spine, waving
  var pf = at(0.15, -0.6);
  pen.translate(pf[0], pf[1]);
  pen.rotate(0.5 + 0.12 * Math.sin(own * 1.8));
  pen.beginPath(); pen.moveTo(0, 0); pen.quadraticCurveTo(-30, 4, -70, 18); pen.quadraticCurveTo(-40, 26, -6, 10); pen.closePath();
  nbPaint(CATFISH.fin, nbGrad(0, 0, -70, 18, CATFISH.side, CATFISH.fin));
  pen.restore();
  var mouthAt = pen.getTransform().transformPoint(new DOMPoint(head[0] + 4, mix(head[1], chin[1], 0.6)));
  nbEnd(keep);
  return {mouth: [mouthAt.x, mouthAt.y]};
}
