// taleanimals.js - five animals of the tales and the rites of Lanna, for the Lanna cartoon kit.
// Load it after the kit, beasts.js, northbirds.js and lannabirds.js (it draws with their helpers):
//
//     <script src="oldcartoon.js"></script>
//     <script src="beasts.js"></script>
//     <script src="northbirds.js"></script>
//     <script src="lannabirds.js"></script>
//     <script src="taleanimals.js"></script>
//
// and call each from a scene as the kit's rooster() is called: (x, y) is where its feet are; t is the second; look
// holds what it does, and a name it does not know is warned of.
//
//   toad(x, y, t, look)           the Asian common toad, คันคาก, or the rice-field frog, กบนา (kind: "frog"): sits
//                                 breathing, blinks, calls with its throat swelling, hops, catches a fly with its
//                                 tongue; the frog swims
//   rhinoBeetle(x, y, t, look)    the rhinoceros beetle, กว่าง: walks, raises its horns, flies; the horned male (กว่าง
//                                 โซ้ง), a smaller male (กว่างแซม) or the hornless female (แม่อี่หลุ้ม)
//   kwangFight(x, y, t, look)     two males fighting on the log for the female in its middle, as the north plays ชนกว่าง
//   goldTurtle(x, y, t, look)     the golden turtle, เต่าอองคำ: walks, swims, draws in its head, surfaces to breathe,
//                                 shines; or a plain pond turtle (gold: 0)
//   barkingDeer(x, y, t, look)    the barking deer, ฟาน: walks, runs, grazes, stands alert flagging its tail, barks,
//                                 stamps and butts; white (ฟานเผือก), a buck with his short antlers, a spotted fawn
//   whiteMice(x, y, t, look)      the white mouse and her four young (หนูเผือก), in a line after her, into their hole
//
// Why these (each said again above its animal, with its source; the research is the NotebookLM notebooks "Birds
// and animals of Lanna", "Lanna fairy tales and mythology" and "Nocturnal creatures of northern Thailand"):
//   - the toad: Phaya Khankhak (พญาคันคาก), the toad king, made war on the sky until it promised rain whenever the
//     toads and frogs call; the frog of the eclipse swallows the moon and is frightened into letting it go; frogs
//     sit on the bronze rain drums (Silpa Wattanatham; the Lanna Folktales telling of กบกินเดือนกินตะวัน).
//   - the rhinoceros beetle: ชนกว่าง, the beetle fights of the north from August to the end of Lent, on a log with a
//     female set in its middle; after ออกพรรษา the beetles are let go (Silpa Wattanatham, "ชนกว่าง"; GotoKnow,
//     "กว่างล้านนา"; LINE TODAY, "กว่างภูกามยาว").
//   - the golden turtle: in เต่าน้อยอองคำ a murdered mother comes back as a turtle with a golden shell to comfort her
//     daughter; Ban Thung Tao, Turtle Field, in Thoeng, Chiang Rai, keeps the tale (Lanna Folktales).
//   - the barking deer and the white mice: the second and third of the seven signs (ชัยมงคล 7 ประการ) that
//     showed Mangrai where to build Chiang Mai: "two white barking deer, a mother and her young, fought the dogs, and
//     all the dogs ran and could not stand against them", and "a white mouse with four of her young came out from
//     this place" (ตำนานพื้นเมืองเชียงใหม่, as the Thai Wikipedia page on the seven signs quotes it).
// Each is drawn from rules read from photographs on Wikimedia Commons under free licences, kept with their credits
// outside the repository; nothing of them is copied. At size 1 each is as large as it would be beside the cast
// (340 px is 160 cm): a toad about 22 long, a beetle about 14, the turtle about 50, the deer about 106 at the
// shoulder, a mouse as the kit's mouse() is.

var TOAD_KEYS = {}, BEETLE_KEYS = {}, FIGHT_KEYS = {}, TURTLE_KEYS = {}, DEER_KEYS = {}, MICE_KEYS = {};
["size", "face", "kind", "call", "hop", "tongue", "swim", "seed", "feel"].forEach(function (n) { TOAD_KEYS[n] = true; });
["size", "face", "kind", "step", "lift", "fly", "thread", "seed"].forEach(function (n) { BEETLE_KEYS[n] = true; });
["size", "seed", "log", "female"].forEach(function (n) { FIGHT_KEYS[n] = true; });
["size", "face", "gold", "step", "swim", "head", "breathe", "seed", "feel"].forEach(function (n) { TURTLE_KEYS[n] = true; });
["size", "face", "white", "buck", "fawn", "step", "run", "graze", "alert", "bark", "stamp", "butt", "slope", "seed", "feel"].forEach(function (n) { DEER_KEYS[n] = true; });
["size", "face", "along", "into", "young", "seed"].forEach(function (n) { MICE_KEYS[n] = true; });

// ---------- the toad and the frog ----------
// The Asian common toad (Duttaphrynus melanostictus, คันคาก in Kam Mueang, คางคก in Thai), the one that calls
// from every ditch of the north as the rains come; and the rice-field frog (Hoplobatrachus rugulosus, กบนา), the
// big frog of the paddies (kind: "frog"). Phaya Khankhak, the toad king, made war on Phaya Thaen of the sky in a
// drought until the sky promised rain whenever the toads and the frogs call; in the north the frog of the eclipse
// (กบกินเดือน) swallows the moon, and the village beats gongs and pans to make it let go. Read from photographs:
//   1. The toad: squat, sitting up on its fore legs; its skin thick with round warts, each tipped black; bony
//      black ridges round the top and the back of each eye; a big swelling (the parotoid) behind the eye.
//   2. Golden brown to dark brown, paler below; the eye gold, its pupil a dark bar across.
//   3. The frog: longer and smoother, the snout pointed; olive brown with dark blotches and long ridges down the
//      back; the eardrum a round disc behind the eye; the belly cream; the legs long, banded, the toes webbed.
//   4. It calls with its throat: the toad's one sac under the chin swells into a ball and shrinks, a long trill;
//      the frog's swells on each side of the throat. At rest the throat flutters as it breathes.
//   5. It hops: the hind legs straighten, the body stretches, the fore legs reach for the ground; it lands
//      squashed. It shoots its tongue out at a fly. The frog swims with its hind legs kicking together.
// The look's names: size, face, kind ("toad" or "frog"), call (0 to 1), hop (a number that grows a hop at a time),
// tongue (0 to 1: out to its fullest at 0.5 and back), swim (true: the frog in the water, (x, y) the middle of its
// back at the surface), seed, feel.

var TOADS = {
  toad: {skin: "#b08a4a", light: "#d8b878", dark: "#6a4a26", belly: "#e8d6a8", wart: "#2a1e14", ridge: "#1e1610", eye: "#d8a830",
         sac: "#e8c878", unit: 0.22},
  frog: {skin: "#7a7a44", light: "#a8a46a", dark: "#3e3e1e", belly: "#efe2b4", wart: "#3a3a1a", ridge: "#4a4a24", eye: "#c88a30",
         sac: "#8a8a7a", unit: 0.24}};

// The toad (rules above), its feet on (x, y), or swimming at (x, y); at second t.
//   look   TOAD_KEYS: size, face, kind, call, hop, tongue, swim, seed, feel
// Returns {mouth: [x, y]}, the tip of its snout on the sheet. It draws with pen (nbBegin() and nbEnd()).
// e.g. toad(700, GROUND, clock, {call: 1});
function toad(x, y, t, look) {
  look = look || {};
  checkNames("The toad's name", look, TOAD_KEYS);
  var kind = look.kind === "frog" ? "frog" : "toad", c = TOADS[kind], frog = kind === "frog";
  var e = look.feel !== undefined ? creatureFeel(look, t) : null, own = t + (look.seed || 0);
  var keep = lbBegin(x, y, look, c.unit, 0.7);
  var call = clamp(look.call || 0), hopping = look.hop !== undefined, hop = hopping ? look.hop % 1 : 0;
  var air = hopping ? Math.sin(Math.min(1, hop / 0.7) * Math.PI) : 0, flying = hopping && hop < 0.7;
  var land = hopping && hop >= 0.7 ? Math.sin((hop - 0.7) / 0.3 * Math.PI) : 0;   // the squash as it lands
  var stretch = flying ? Math.sin(hop / 0.7 * Math.PI) : 0;
  var swim = !!look.swim && frog, kick = swim ? (own * 1.3) % 1 : 0;
  var k, mouth;
  if (swim) {                                        // rule 5: swimming, the body level at the surface, the hind legs kicking together
    var push = kick < 0.3 ? kick / 0.3 : 1 - (kick - 0.3) / 0.7, reach = 1 - push;
    pen.translate(push * 6, 0);
    for (var side = 0; side < 2; side++) {
      var tone = side ? c.skin : blend(c.skin, c.dark, 0.35);
      nbLimb([[-30, 0], [-30 - 20 * reach - 10, 10 + 14 * reach], [-60 - 40 * push, 6 + 8 * reach], [-80 - 46 * push, 4 + 4 * reach]], 11, tone);
      pen.beginPath();                               // the webbed foot, spread as it pushes
      var fx = -80 - 46 * push, fy = 4 + 4 * reach;
      pen.moveTo(fx, fy); pen.lineTo(fx - 22, fy - 10 * push - 3); pen.lineTo(fx - 26, fy + 2); pen.lineTo(fx - 20, fy + 12 * push + 3); pen.closePath();
      nbPaint(blend(tone, "#c8b878", 0.3));
    }
    lbSmooth([[44, -6], [20, -16], [-12, -16], [-36, -6], [-34, 8], [0, 14], [30, 10]]);
    nbPaint(c.skin, nbGrad(0, -16, 0, 14, c.light, c.belly));
    pen.save(); pen.clip();
    for (k = 0; k < 9; k++) { nbOval(-26 + k * 8, -10 + (k % 3) * 4, 4 + (k % 2) * 2, 3, 0.2); nbFill(c.dark); }
    pen.restore();
    nbLimb([[24, 6], [18, 14], [6, 18]], 7, c.skin);
    nbOval(30, -12, 6, 5.5); nbPaint(c.light);
    nbEye(31, -13, 4, c.eye, e, c.skin, "#141010");
    var tip = pen.getTransform().transformPoint(new DOMPoint(46, -4));
    mouth = [tip.x, tip.y];
    nbEnd(keep);
    return {mouth: mouth};
  }
  pen.translate(0, -air * (frog ? 60 : 40));
  pen.rotate(flying ? -0.35 * stretch : 0);
  var squash = 1 + 0.12 * land, sit = 1 - stretch;
  var breathe = 0.5 + 0.5 * Math.sin(own * 9), flutter = (1 - call) * breathe;
  var trill = call * (frog ? 0.6 + 0.4 * Math.sin(own * 5) : 0.75 + 0.25 * Math.sin(own * 31));   // the sac: the frog's in deep puffs, the toad's trembling in its trill
  var dark = blend(c.skin, c.dark, 0.45);
  // rule 5: the far hind leg, folded under while it sits, straight out behind as it jumps
  function hindLeg(tone, back) {
    var hipx = -24, hipy = -18;
    if (flying) {
      var kn = [hipx - 14 - 8 * stretch, hipy + 12], an = [hipx - 28 - 16 * stretch, hipy + 14 - 6 * stretch], ft = [hipx - 40 - 22 * stretch, hipy + 18 - 10 * stretch];
      nbLimb([[hipx, hipy], kn, an, ft], 12, tone);
      pen.beginPath();                               // the webbed hind foot, trailing as it pushes off
      pen.moveTo(ft[0], ft[1]); pen.lineTo(ft[0] - 16, ft[1] - 5); pen.lineTo(ft[0] - 18, ft[1] + 1); pen.lineTo(ft[0] - 14, ft[1] + 6); pen.closePath();
      nbPaint(blend(tone, "#e8d8a8", 0.25));
    } else {
      nbLimb([[hipx, hipy], [hipx + 18, hipy + 6], [hipx - 2, -4], [hipx + 14 + back, -2]], 14, tone);
      pen.beginPath();                               // the long toes along the ground
      pen.moveTo(hipx + 10 + back, -2); pen.lineTo(hipx + 34 + back, 0); pen.moveTo(hipx + 12 + back, -1); pen.lineTo(hipx + 30 + back, 3);
      pen.strokeStyle = inkFor(tone); pen.lineWidth = 4.5; pen.stroke();
      pen.strokeStyle = tone; pen.lineWidth = 3; pen.stroke();
    }
  }
  hindLeg(dark, -4);
  nbLimb([[18, -24], [26, -12], flying ? [44 + 14 * stretch, -4 - 10 * stretch] : [24, -1]], 8, dark);   // the far fore leg
  pen.save();
  pen.scale(squash, 1 / squash);
  var bodyPts = frog ? [[46, -30], [30, -42], [0, -44], [-26, -36], [-36, -20], [-28, -8], [0, -6], [26, -10], [40, -18]]
                     : [[40, -32], [26, -46], [0, -50], [-24, -42], [-36, -24], [-30, -8], [-4, -4], [22, -8], [36, -18]];
  if (flying) { bodyPts = bodyPts.map(function (p) { return [p[0] * (1 + 0.18 * stretch), p[1] * (1 - 0.1 * stretch)]; }); }
  lbSmooth(bodyPts);
  nbPaint(c.skin, nbGrad(0, -50, 0, -4, c.light, blend(c.skin, c.belly, 0.6)));
  pen.save();
  pen.clip();
  if (frog) {                                        // rule 3: the frog's blotches and the long ridges down its back
    for (k = 0; k < 12; k++) { nbOval(-24 + (k * 13) % 56, -38 + (k * 7) % 22, 5 + (k % 3) * 2, 3.5 + (k % 2) * 1.5, (k % 4) * 0.4); nbFill(c.dark); }
    pen.strokeStyle = blend(c.light, "#ffffff", 0.2);
    pen.lineWidth = 1.6;
    for (k = 0; k < 3; k++) { pen.beginPath(); pen.moveTo(30, -38 + k * 5); pen.quadraticCurveTo(0, -44 + k * 5, -28, -30 + k * 5); pen.stroke(); }
  } else {                                           // rule 1: the toad's warts, each tipped black
    for (k = 0; k < 34; k++) {
      var wx = -30 + (k * 17) % 64, wy = -46 + (k * 11) % 40, wr = 2.2 + (k % 3) * 0.9;
      nbOval(wx, wy, wr, wr * 0.9);
      nbFill(blend(c.skin, c.light, 0.35));
      nbOval(wx + wr * 0.25, wy - wr * 0.25, wr * 0.45, wr * 0.45);
      nbFill(c.wart);
    }
  }
  var under = pen.createLinearGradient(0, -22, 0, -4);   // the pale belly
  under.addColorStop(0, "rgba(232, 214, 168, 0)");
  under.addColorStop(1, c.belly);
  pen.fillStyle = under;
  pen.fillRect(-40, -22, 90, 20);
  pen.restore();
  hindLeg(c.skin, 0);
  if (!frog) {                                       // rule 1: the parotoid gland behind the eye, warty
    nbOval(10, -40, 12, 7, -0.2);
    nbPaint(blend(c.skin, c.light, 0.3));
    for (k = 0; k < 4; k++) { nbOval(4 + k * 4, -41 + (k % 2) * 2, 1.4, 1.4); nbFill(c.wart); }
  } else {                                           // rule 3: the frog's eardrum
    nbOval(18, -34, 5.5, 5.5);
    nbPaint(blend(c.skin, c.dark, 0.3));
  }
  var sacR = (frog ? 7 : 10) * (0.15 + 0.85 * trill) + 2.5 * flutter;
  if (sacR > 3) {                                    // rule 4: the throat swelling (the frog's on its side)
    if (frog) { nbOval(36, -16, sacR * 1.1, sacR * 0.9); nbPaint(c.sac, nbGrad(36, -16 - sacR, 36, -16 + sacR, "#d8d4c4", c.sac)); }
    else { nbOval(34, -12 + sacR * 0.3, sacR * 1.15, sacR); nbPaint(c.sac, nbGrad(30, -14 - sacR, 34, -12 + sacR, "#fbecc0", c.sac)); }
    if (sacR > 6) { nbOval(31, -14, sacR * 0.35, sacR * 0.2, -0.4); nbFill("rgba(255, 255, 255, 0.55)"); }
  }
  pen.restore();
  var blink = lbPulse(own, 4.7, 0.18, 1) > 0.3;
  nbOval(28, -44, 8, 7.5);                           // rule 2: the eye on its bump, the ridge round it
  nbPaint(c.light);
  if (blink && !e) { pen.strokeStyle = c.dark; pen.lineWidth = 2; pen.beginPath(); pen.moveTo(22, -45); pen.quadraticCurveTo(28, -42, 34, -45); pen.stroke(); }
  else {
    nbOval(29, -45, 5.4, 5.2);
    nbFill(c.eye);
    nbOval(29.4, -45, 4.2, 1.3);                     // the pupil, a bar across
    nbFill("#141010");
    nbOval(27.6, -47, 1.4, 1);
    nbFill("rgba(255, 255, 255, 0.85)");
    if (e) { nbEye(29, -45, 5, c.eye, e, c.skin, "#141010"); }
  }
  if (!frog) {
    pen.strokeStyle = c.ridge;                       // rule 1: the black bony ridges over and behind the eye
    pen.lineWidth = 2.6;
    pen.beginPath(); pen.moveTo(20, -50); pen.quadraticCurveTo(28, -55, 36, -50); pen.moveTo(20, -50); pen.quadraticCurveTo(16, -44, 16, -38); pen.stroke();
  }
  pen.strokeStyle = inkFor(c.skin);                  // the long line of the mouth
  pen.lineWidth = 1.6;
  pen.beginPath(); pen.moveTo(frog ? 46 : 40, -28); pen.quadraticCurveTo(30, -24, 16, -28); pen.stroke();
  nbOval(frog ? 44 : 38, -36, 1.2, 0.9); nbFill(c.wart);   // the nostril
  var lick = clamp(look.tongue || 0), out = Math.sin(lick * Math.PI);
  if (out > 0.02) {                                  // rule 5: the tongue, sticky and pink, out at the fly and back
    var tx = (frog ? 46 : 40) + 70 * out, ty = -28 - 10 * out;
    pen.strokeStyle = "#c8505a"; pen.lineWidth = 4.5;
    pen.beginPath(); pen.moveTo(frog ? 44 : 38, -27); pen.quadraticCurveTo(tx - 20, ty - 8, tx, ty); pen.stroke();
    nbOval(tx, ty, 4, 3.4); nbPaint("#e07080");
    if (lick < 0.5) {                                // the fly, caught at the end of the stroke
      nbOval(tx + 6, ty - 2, 3, 2); nbFill("#202020");
      pen.save(); pen.globalAlpha *= 0.5; nbOval(tx + 6, ty - 5, 3, 1.5, 0.4); nbFill("#c8d8e8"); pen.restore();
    }
  }
  nbLimb([[18, -22], [24, -12], flying ? [40 + 16 * stretch, -2 - 12 * stretch] : [28, -1]], 8.5, c.skin);   // the near fore leg, and its toes
  if (!flying) {
    pen.beginPath(); pen.moveTo(28, -1); pen.lineTo(36, 0); pen.moveTo(28, -1); pen.lineTo(33, 3); pen.moveTo(28, -1); pen.lineTo(24, 2);
    pen.strokeStyle = inkFor(c.skin); pen.lineWidth = 3.4; pen.stroke();
    pen.strokeStyle = c.skin; pen.lineWidth = 2; pen.stroke();
  }
  var snout = pen.getTransform().transformPoint(new DOMPoint(frog ? 46 : 40, -30));
  nbEnd(keep);
  return {mouth: [snout.x, snout.y]};
}

// ---------- the rhinoceros beetle ----------
// The rhinoceros beetle (Xylotrupes gideon, กว่าง): in the north, from the middle of the rains to the end of Lent,
// boys and men keep the big males and set them to fight (ชนกว่าง) on a log of soft wood (ไม้แกนปอ) with a hole in
// its middle where a female (แม่อี่หลุ้ม) is put, her back showing, so the males smell her and fight for her; a
// handler strokes a male with a stick of bamboo to rouse him; after ออกพรรษา they are let go to breed (Silpa
// Wattanatham, "ชนกว่าง"; GotoKnow, "กว่างล้านนา"; LINE TODAY, "กว่างภูกามยาว"). The north names the males by
// their horns: กว่างโซ้ง, the champion with long horns, กว่างแซม, smaller. Read from photographs of it:
//   1. Glossy, dark chestnut to black, the wing cases smooth and shining with a long light on each.
//   2. The male: a long horn from the head, curving up and forward, forked at its tip; and a second horn from the
//      shield behind the head, reaching forward over it, forked too. The female has none, and her shield is rough.
//   3. Six black legs, spined, the feet long with two hooks; the fore legs longest; small clubbed feelers.
//   4. It walks three feet at a time, a tripod; to fight it lowers its head and lifts the other with its horns;
//      to fly it lifts its wing cases and unfolds its brown, veined wings from under them and beats them.
// The look's names: size, face, kind ("male", "small" or "female"), step (grows a stride at a time), lift (0 to 1:
// the head and the horns raised), fly (true: in flight, (x, y) the middle of its body), thread (true: the red
// thread a handler ties round the male's horn), seed.

var BEETLE = {shell: "#5a2214", light: "#b8684a", dark: "#1a0a08", leg: "#1a1210", wing: "rgba(170, 120, 70, 0.55)", vein: "rgba(90, 50, 25, 0.7)"};

/// One leg of the beetle from the hip (hx, hy) to its foot at (fx, fy): a thick thigh, the knee bent up and out, the
// shin spined along its outer edge, and the long foot of five joints ending in two hooks; far legs darker.
// Returns nothing: it draws with pen.
// e.g. beetleLeg(10, -24, 40, 0, false);
function beetleLeg(hx, hy, fx, fy, far) {
  var way = fx >= hx ? 1 : -1, colour = far ? "#0c0706" : BEETLE.leg;
  var kx = hx + (fx - hx) * 0.45 + way * 6, ky = Math.min(hy, fy) - 12;
  var ax = mix(kx, fx, 0.72), ay = mix(ky, fy, 0.72) - 2;
  nbLimb([[hx, hy], [kx, ky]], 6, colour);           // the thigh
  nbLimb([[kx, ky], [ax, ay]], 4.2, colour);         // the shin
  pen.strokeStyle = colour;                          // rule 3: the shin's spines, and its spurs at the end
  pen.lineWidth = 1.6;
  pen.beginPath();
  for (var s = 1; s <= 3; s++) { var px = mix(kx, ax, s / 4), py = mix(ky, ay, s / 4); pen.moveTo(px, py); pen.lineTo(px + way * 4, py - 3); }
  pen.moveTo(ax, ay); pen.lineTo(ax + way * 5, ay - 2); pen.moveTo(ax, ay); pen.lineTo(ax + way * 5, ay + 2);
  pen.stroke();
  pen.lineWidth = 2;                                 // the long foot, jointed, and its two hooks
  pen.beginPath();
  pen.moveTo(ax, ay);
  for (var j = 1; j <= 5; j++) { pen.lineTo(mix(ax, fx, j / 5) + way * j * 0.6, mix(ay, fy, j / 5)); }
  var tx = fx + way * 3;
  pen.moveTo(tx, fy); pen.lineTo(tx + way * 4, fy - 2); pen.moveTo(tx, fy); pen.lineTo(tx + way * 4, fy + 1.5);
  pen.stroke();
  for (j = 1; j < 5; j++) { nbOval(mix(ax, fx, j / 5) + way * j * 0.6, mix(ay, fy, j / 5), 1.4, 1.1); nbFill(colour); }
}

// The rhinoceros beetle (rules above), its feet on (x, y), or flying with (x, y) the middle of its body; at t.
//   look   BEETLE_KEYS: size, face, kind, step, lift, fly, thread, seed
// Returns {horn: [x, y]}, the tip of its head horn on the sheet (its head, a female's). It draws with pen.
// e.g. rhinoBeetle(700, GROUND, clock, {step: clock * 3});
function rhinoBeetle(x, y, t, look) {
  look = look || {};
  checkNames("The beetle's name", look, BEETLE_KEYS);
  var kind = look.kind || "male", H = kind === "female" ? 0 : kind === "small" ? 0.55 : 1, own = t + (look.seed || 0);
  var keep = lbBegin(x, y, look, 0.13, 0.6);
  var lift = clamp(look.lift || 0), fly = !!look.fly, walking = look.step !== undefined, step = look.step || 0, k;
  // the fore, middle and hind legs: hip x, foot x, phase in the tripod (fore and hind of one side with the middle of the other)
  var legs = [[30, 74, 0], [4, 26, 0.5], [-26, -60, 0]];
  function legsOf(far) {
    legs.forEach(function (L, n) {
      var ph = ((walking ? step : 0) + L[2] + (far ? 0.5 : 0)) % 1, up = walking ? Math.max(0, Math.sin(ph * Math.PI * 2)) * 10 : 0;
      var dx = walking ? Math.cos(ph * Math.PI * 2) * 12 : 0, hip = [L[0] + (far ? -5 : 0), -24];
      if (fly) { beetleLeg(hip[0], hip[1] + 2, hip[0] + (L[1] - L[0]) * 0.45, 14 + n * 4, far); }
      else { beetleLeg(hip[0], hip[1], L[1] + dx + (far ? -8 : 0), -up, far); }
    });
  }
  pen.translate(0, -2);
  if (fly) { pen.translate(0, -30); pen.rotate(-0.5 + 0.05 * Math.sin(own * 3)); }
  var beat = (own * 22) % 1;
  if (fly) { pen.save(); pen.globalAlpha *= 0.4; beetleWing(-1, beat); pen.restore(); }
  legsOf(true);
  if (fly) {                                         // rule 4: the wing cases lifted up and out from the back
    pen.save();
    pen.translate(4, -56);
    pen.rotate(-1.05);
    lbSmooth([[0, 0], [-16, -14], [-56, -16], [-76, -2], [-56, 12], [-12, 10]]);
    nbPaint(BEETLE.shell, nbGrad(-56, -16, -10, 12, BEETLE.light, BEETLE.dark));
    pen.restore();
  }
  var dome = fly ? [[20, -30], [-4, -46], [-38, -46], [-62, -34], [-66, -24], [-40, -18], [0, -18], [18, -22]]
                 : [[20, -40], [0, -62], [-36, -64], [-62, -50], [-72, -30], [-60, -20], [-14, -18], [18, -24]];
  lbSmooth(dome);                                    // rule 1: the domed wing cases (in flight, the body under them)
  nbPaint(BEETLE.shell, nbGrad(-24, -64, -24, -18, BEETLE.light, BEETLE.dark));
  if (!fly) {
    pen.save();
    lbSmooth(dome);
    pen.clip();
    pen.strokeStyle = "rgba(255, 228, 200, 0.6)";    // the long light along the curve of the wing case
    pen.lineWidth = 5;
    pen.beginPath(); pen.moveTo(12, -46); pen.quadraticCurveTo(-24, -64, -60, -42); pen.stroke();
    pen.strokeStyle = "rgba(255, 240, 220, 0.18)";
    pen.lineWidth = 16;
    pen.beginPath(); pen.moveTo(6, -40); pen.quadraticCurveTo(-26, -54, -56, -36); pen.stroke();
    pen.strokeStyle = BEETLE.dark;                   // the seam where the two wing cases meet, and a fine edge along the bottom
    pen.lineWidth = 1.4;
    pen.beginPath(); pen.moveTo(18, -34); pen.quadraticCurveTo(-24, -40, -68, -28); pen.stroke();
    pen.strokeStyle = "rgba(255, 200, 170, 0.35)";
    pen.lineWidth = 1.2;
    pen.beginPath(); pen.moveTo(16, -25); pen.quadraticCurveTo(-24, -22, -62, -24); pen.stroke();
    pen.restore();
  }
  pen.save();                                        // the shield and the head, raised as it lifts
  pen.translate(20, -36);
  pen.rotate(-lift * 0.42 + (walking ? 0.03 * Math.sin(step * Math.PI * 4) : 0));
  var shield = [[0, -24], [16, -30], [32, -22], [38, -6], [32, 8], [14, 12], [-2, 8], [-4, -10]];
  lbSmooth(shield);                                  // the shield (the pronotum): big and rounded, rough on a female
  nbPaint(BEETLE.shell, nbGrad(10, -30, 20, 12, H ? BEETLE.light : blend(BEETLE.shell, BEETLE.light, 0.5), BEETLE.dark));
  pen.save();
  lbSmooth(shield);
  pen.clip();
  if (!H) { for (k = 0; k < 20; k++) { nbOval(2 + (k * 7) % 32, -24 + (k * 5) % 32, 1, 1); nbFill("rgba(20, 8, 4, 0.6)"); } }
  else { pen.strokeStyle = "rgba(255, 232, 210, 0.55)"; pen.lineWidth = 3; pen.beginPath(); pen.arc(18, -2, 18, -2.6, -1.2); pen.stroke(); }
  pen.restore();
  if (H) {                                           // rule 2: the shield's horn, forward over the head, forked at the tip
    pen.beginPath();
    pen.moveTo(14, -28);
    pen.quadraticCurveTo(30 + 14 * H, -40 - 10 * H, 42 + 22 * H, -30 - 8 * H);
    pen.lineTo(48 + 22 * H, -36 - 8 * H);
    pen.lineTo(46 + 22 * H, -28 - 6 * H);
    pen.lineTo(50 + 22 * H, -24 - 6 * H);
    pen.quadraticCurveTo(32 + 12 * H, -26 - 6 * H, 28, -14);
    pen.closePath();
    nbPaint(BEETLE.shell, nbGrad(14, -30, 50, -30, BEETLE.light, BEETLE.dark));
  }
  pen.translate(34, 4);                              // the head, small, low at the front of the shield
  lbSmooth([[-2, -8], [8, -8], [14, -2], [10, 6], [0, 7], [-4, 0]]);
  nbPaint(BEETLE.dark);
  nbLimb([[10, 3], [17, 6], [20, 3]], 1.6, "#3a2018");   // a small clubbed feeler
  nbOval(20.5, 3, 2.2, 1.6); nbFill("#3a2018");
  var horn = [10, -6];
  if (H) {                                           // rule 2: the head's horn, long, sweeping up and forward, forked at the tip
    pen.beginPath();
    pen.moveTo(4, -6);
    pen.bezierCurveTo(28 * H + 6, -4 * H - 4, 44 * H + 6, -30 * H - 4, 36 * H + 8, -60 * H - 2);
    pen.lineTo(44 * H + 8, -68 * H - 2);             // the fork
    pen.lineTo(41 * H + 8, -58 * H - 2);
    pen.lineTo(48 * H + 6, -56 * H - 2);
    pen.bezierCurveTo(52 * H + 6, -28 * H - 2, 36 * H + 4, -2 * H + 2, 10, 2);
    pen.closePath();
    nbPaint(BEETLE.shell, nbGrad(4, 0, 40 * H, -60 * H, BEETLE.dark, BEETLE.light));
    pen.strokeStyle = "rgba(255, 232, 210, 0.5)";
    pen.lineWidth = 2;
    pen.beginPath(); pen.moveTo(14, -6); pen.bezierCurveTo(32 * H + 4, -10 * H, 44 * H + 2, -30 * H, 40 * H + 6, -54 * H); pen.stroke();
    horn = [42 * H + 8, -60 * H];
    if (look.thread) {                               // the red thread round the horn's root, its ends hanging
      pen.strokeStyle = "#d02a2a";
      pen.lineWidth = 2.6;
      pen.beginPath(); pen.moveTo(10, -10); pen.lineTo(18, -1); pen.moveTo(14, -6); pen.quadraticCurveTo(10, 10 + 3 * Math.sin(own * 3), 6, 22 + 2 * Math.sin(own * 3 + 1)); pen.stroke();
    }
  }
  var hornAt = pen.getTransform().transformPoint(new DOMPoint(horn[0], horn[1]));
  pen.restore();
  legsOf(false);
  if (fly) { beetleWing(1, beat); }
  nbEnd(keep);
  return {horn: [hornAt.x, hornAt.y]};
}

// One of the beetle's flying wings, unfolded from under the lifted wing case: brown, thin, veined, seen beating
// (beat 0 to 1 a stroke); side 1 the near one, -1 the far. Returns nothing: it draws with pen.
// e.g. beetleWing(1, (clock * 22) % 1);
function beetleWing(side, beat) {
  var lift = Math.cos(beat * Math.PI * 2);
  pen.save();
  pen.translate(-6 + (side < 0 ? -6 : 0), -44);
  nbLift(lift);
  lbSmooth([[0, 0], [-10, -40], [-34, -96], [-52, -100], [-46, -60], [-30, -10]]);
  pen.fillStyle = BEETLE.wing;
  pen.fill();
  pen.strokeStyle = BEETLE.vein;
  pen.lineWidth = 1.4;
  pen.stroke();
  pen.beginPath(); pen.moveTo(-4, -4); pen.lineTo(-36, -94); pen.moveTo(-14, -6); pen.lineTo(-44, -70); pen.moveTo(-22, -8); pen.lineTo(-42, -40); pen.stroke();
  pen.restore();
}

// Two male beetles fighting on the log (ชนกว่าง), the log's middle at (x, y): the log of soft wood lying level, a
// hole cut in its middle with the female in it, her back showing; the two males come at each other from the ends,
// lock horns, shove, and the stronger lifts the other until it lets go and falls back; then again. The champion
// (the left one) wears a red thread on his horn. look: size (1 as large as they are, a log about 130 long: give 6
// or so to see them), seed (where in its round it is), log (false: no log, the two alone), female (false: none in
// the log). Returns nothing: it draws with pen.
// e.g. kwangFight(960, 700, clock, {size: 6});
function kwangFight(x, y, t, look) {
  look = look || {};
  checkNames("The fight's name", look, FIGHT_KEYS);
  var size = look.size || 1, u = ((t + (look.seed || 0)) % 6) / 6;
  pen.save();
  pen.translate(x, y);
  pen.scale(size, size);
  var keepLine = LINE;
  LINE = STYLE.line / size;
  if (look.log !== false) {                          // the log: soft pale wood, its bark peeled, a hole in its middle
    lbSmooth([[-70, -8], [-30, -11], [30, -11], [70, -8], [72, 8], [30, 12], [-30, 12], [-72, 8]]);
    nbPaint("#c8a878", nbGrad(0, -11, 0, 12, "#e8d0a8", "#a08058"));
    pen.strokeStyle = "rgba(120, 90, 50, 0.5)";
    pen.lineWidth = 0.4;
    pen.beginPath();
    for (var g = 0; g < 4; g++) { pen.moveTo(-66, -4 + g * 4); pen.quadraticCurveTo(0, -6 + g * 4 + (g % 2), 66, -4 + g * 4); }
    pen.stroke();
    nbOval(-71, 0, 3, 9); nbPaint("#d8c098");        // the cut ends, with their rings
    nbOval(71, 0, 3, 9); nbPaint("#d8c098");
    nbOval(0, -10, 9, 2.6); nbFill("#3a2414");       // the hole, and the female's back in it
    if (look.female !== false) {
      pen.save();
      pen.beginPath(); pen.ellipse(0, -10, 9, 2.6, 0, Math.PI, 0); pen.lineTo(9, -20); pen.lineTo(-9, -20); pen.closePath(); pen.clip();
      nbOval(0, -9, 6.5, 3.6); nbPaint("#5a2a18", nbGrad(0, -13, 0, -6, "#a8603e", "#3a1408"));
      pen.restore();
    }
  }
  var meet = u < 0.25 ? lbEase(u / 0.25) : 1, shove = u > 0.25 && u < 0.7 ? Math.sin((u - 0.25) / 0.45 * Math.PI * 4) : 0;
  var lift = u > 0.55 && u < 0.8 ? Math.sin((u - 0.55) / 0.25 * Math.PI) : 0, back = u > 0.75 ? lbEase((u - 0.75) / 0.25) : 0;
  var gap = mix(50, 19, meet) + back * 30;
  rhinoBeetle(-gap + shove * 2, -10, t, {size: 1.5, step: meet < 1 ? u * 8 : undefined, lift: 0.3 + lift * 0.7, thread: true, seed: 0.3});
  pen.save();                                        // the other, lifted by the champion's horns, then dropping back
  pen.translate(gap + shove * 2, -10 - lift * 8);
  pen.rotate(lift * 0.5);
  rhinoBeetle(0, 0, t, {size: 1.5, face: -1, kind: "small", step: meet < 1 || back > 0 ? u * 8 : undefined, lift: 0.2 + 0.3 * Math.abs(shove)});
  pen.restore();
  LINE = keepLine;
  pen.restore();
}

// ---------- the golden turtle ----------
// The golden turtle (เต่าอองคำ) of the Lanna tale เต่าน้อยอองคำ: a mother killed by a jealous second wife comes back
// as a turtle with a shell of gold in the marsh, to comfort her daughter and to help her (the Lanna Folktales
// telling; the marsh is remembered at Ban Thung Tao, now Thung Khan Chai, in Thoeng, Chiang Rai). She is drawn as a
// pond turtle of the north, the yellow-headed temple turtle (Heosemys annandalii), whose shell is made of gold.
// Read from photographs:
//   1. A high, smooth domed shell, the plates on it (scutes) in a row down the middle and a row on each side, each
//      ringed with growth lines; the rim of small plates round the edge.
//   2. The head smooth and rounded, yellow with fine dark lines; the eye dark, ringed pale; the jaw hooked a little.
//   3. Thick legs in scales, webbed feet with claws; a short pointed tail.
//   4. It walks slowly, one leg at a time; it swims with its legs paddling, its neck out; it lifts its nose to the
//      air to breathe; frightened, it draws its head into its shell.
// The look's names: size, face, gold (0 to 1: the shell gold, 1 the default; 0 a plain dark shell), step (grows a
// step at a time while it walks), swim (true: in the water, (x, y) the middle of its shell; it paddles), head (0 to
// 1: how far its head is out, 1 the default; 0 drawn in), breathe (0 to 1: its nose lifted to the air), seed, feel.

var TURTLE = {skin: "#8a8458", skinLight: "#c8c08a", stripe: "#e8d040", line: "#3a3420", plain: "#4a4430", plainLight: "#7a7050",
              gold: "#d8a428", goldLight: "#fff0a0", goldDeep: "#8a5a10", plastron: "#e8d8a0"};

// The turtle's shell, a dome over (0, 0), its scutes drawn one by one: "g" gold (0 to 1), "shine" the sheen's place
// (0 to 1, moving with time). Returns nothing: it draws with pen.
// e.g. turtleShell(1, 0.4);
function turtleShell(g, shine) {
  var base = blend(TURTLE.plain, TURTLE.gold, g), light = blend(TURTLE.plainLight, TURTLE.goldLight, g), deep = blend("#2a2618", TURTLE.goldDeep, g);
  lbSmooth([[66, -6], [52, -40], [16, -58], [-26, -56], [-60, -34], [-70, -4], [-40, 2], [30, 2]]);
  nbPaint(base, nbGrad(-10, -58, 10, 2, light, deep));
  pen.save();
  pen.clip();
  var rows = [[[-46, -36], [-14, -50], [18, -50], [46, -34]], [[-58, -14], [-28, -24], [2, -26], [32, -24], [58, -12]]], k;
  function scute(cx, cy, w, h) {                     // rule 1: a plate, its growth lines in rings
    for (var r = 0; r < 4; r++) {
      var s = 1 - r * 0.22;
      lbSmooth([[cx + w * s, cy], [cx + w * 0.5 * s, cy - h * s], [cx - w * 0.5 * s, cy - h * s], [cx - w * s, cy], [cx - w * 0.5 * s, cy + h * s], [cx + w * 0.5 * s, cy + h * s]]);
      if (r === 0) { pen.fillStyle = nbGrad(cx, cy - h, cx, cy + h, blend(light, base, 0.3), base); pen.fill(); }
      pen.strokeStyle = r === 0 ? deep : blend(deep, base, 0.5);
      pen.lineWidth = r === 0 ? 1.6 : 0.8;
      pen.stroke();
    }
  }
  rows[0].forEach(function (p) { scute(p[0], p[1], 17, 11); });
  rows[1].forEach(function (p) { scute(p[0], p[1], 15, 10); });
  for (k = 0; k < 12; k++) {                         // the rim of small plates round the edge
    var a = k / 11, rx = mix(-66, 64, a), ry = -4 - Math.sin(a * Math.PI) * 6;
    pen.strokeStyle = deep; pen.lineWidth = 1;
    pen.beginPath(); pen.moveTo(rx, ry); pen.lineTo(rx + 3, ry + 8); pen.stroke();
  }
  if (g > 0) {                                       // the gold's sheen, a band of light sliding over the dome
    var sx = mix(-80, 80, shine);
    var sheen = pen.createLinearGradient(sx - 30, -60, sx + 30, 0);
    sheen.addColorStop(0, "rgba(255, 255, 230, 0)");
    sheen.addColorStop(0.5, "rgba(255, 255, 230, " + (0.55 * g) + ")");
    sheen.addColorStop(1, "rgba(255, 255, 230, 0)");
    pen.fillStyle = sheen;
    pen.fillRect(-80, -60, 160, 64);
  }
  pen.restore();
  lbSmooth([[64, -4], [30, 4], [-40, 4], [-68, -2], [-40, 8], [30, 8]]);   // the rim's lower edge and the pale plastron under it
  nbPaint(blend(TURTLE.plastron, TURTLE.gold, g * 0.5));
}

// The golden turtle (rules above), its feet on (x, y), or swimming with (x, y) the middle of its shell; at t.
//   look   TURTLE_KEYS: size, face, gold, step, swim, head, breathe, seed, feel
// Returns {head: [x, y]}, the tip of its nose on the sheet. It draws with pen (nbBegin() and nbEnd()).
// e.g. goldTurtle(700, GROUND, clock, {step: clock});
function goldTurtle(x, y, t, look) {
  look = look || {};
  checkNames("The turtle's name", look, TURTLE_KEYS);
  var e = look.feel !== undefined ? creatureFeel(look, t) : null, own = t + (look.seed || 0);
  var g = look.gold === undefined ? 1 : clamp(look.gold), out = look.head === undefined ? 1 : clamp(look.head), breathe = clamp(look.breathe || 0);
  var swim = !!look.swim, walking = look.step !== undefined, step = look.step || 0;
  var keep = lbBegin(x, y, look, 0.38, 0.8);
  if (swim) { pen.rotate(-0.08 + 0.04 * Math.sin(own * 1.2) - breathe * 0.25); pen.translate(0, 20); }
  else { pen.translate(0, -14 - (walking ? Math.abs(Math.sin(step * Math.PI * 2)) * 2 : 0)); }
  function leg(hx, front, far, phase) {             // rule 3: a thick leg in scales, the webbed foot clawed
    var tone = far ? blend(TURTLE.skin, "#1a1a10", 0.35) : TURTLE.skin, ph = (step + phase) % 1, k;
    var fx, fy;
    if (swim) {                                      // paddling: each foot sweeps back and comes forward folded
      var sweep = Math.sin((own * 1.6 + phase) * Math.PI * 2);
      fx = hx + (front ? 18 : -14) + sweep * 16; fy = 14 + Math.cos((own * 1.6 + phase) * Math.PI * 2) * 6;
    } else {
      var up = walking ? Math.max(0, Math.sin(ph * Math.PI * 2)) * 8 : 0;
      fx = hx + (walking ? Math.cos(ph * Math.PI * 2) * 12 : 0) + (front ? 6 : -4); fy = 14 - up;
    }
    nbLimb([[hx, -4], [fx, fy]], 15, tone);
    pen.beginPath();                                 // the foot, webbed, and three claws
    pen.moveTo(fx - 6, fy); pen.quadraticCurveTo(fx + (front ? 12 : -12), fy + 4, fx + (front ? 14 : -14), fy - 1); pen.lineTo(fx + 4, fy - 6); pen.closePath();
    nbPaint(tone);
    for (k = 0; k < 3; k++) { nbLimb([[fx + (front ? 8 + k * 3 : -8 - k * 3), fy + 1], [fx + (front ? 12 + k * 3 : -12 - k * 3), fy + 3]], 1.2, "#2a2418"); }
  }
  leg(-34, false, true, 0.5);
  leg(30, true, true, 0);
  pen.beginPath();                                   // the short tail
  pen.moveTo(-60, -4); pen.quadraticCurveTo(-76, -2, -82, 4); pen.quadraticCurveTo(-72, 4, -58, 4); pen.closePath();
  nbPaint(TURTLE.skin);
  var neck = mix(-6, 30, out), lift = breathe * 18 + (e ? -6 * e.raise : 0);
  if (out > 0.05) {                                  // rule 2: the neck and the head, out from the shell, yellow-lined
    var hx = 56 + neck, hy = -12 - lift;
    pen.beginPath();
    pen.moveTo(48, -16); pen.quadraticCurveTo(mix(48, hx, 0.5), hy - 4, hx - 8, hy - 9); pen.lineTo(hx - 6, hy + 8); pen.quadraticCurveTo(mix(48, hx, 0.5), -2, 48, 0);
    pen.closePath();
    nbPaint(TURTLE.skin, nbGrad(0, hy - 9, 0, 0, TURTLE.skinLight, TURTLE.skin));
    pen.save();
    pen.translate(hx, hy);
    pen.rotate(-breathe * 0.4 + 0.05 * Math.sin(own * 0.8));
    lbSmooth([[18, -2], [12, -10], [-2, -12], [-12, -6], [-12, 6], [2, 9], [16, 5]]);
    nbPaint(TURTLE.skin, nbGrad(0, -12, 0, 9, TURTLE.skinLight, TURTLE.skin));
    pen.strokeStyle = TURTLE.stripe;                 // the yellow lines along the head
    pen.lineWidth = 1.8;
    pen.beginPath(); pen.moveTo(12, -6); pen.quadraticCurveTo(0, -11, -12, -4); pen.moveTo(10, 2); pen.quadraticCurveTo(-2, 0, -12, 4); pen.stroke();
    pen.strokeStyle = TURTLE.line;
    pen.lineWidth = 1.1;
    pen.beginPath(); pen.moveTo(18, 1); pen.quadraticCurveTo(12, 3, 6, 2); pen.stroke();   // the mouth, hooked a little
    nbOval(6, -4, 3.4, 3.4); nbFill("#efe6c0");
    nbEye(6, -4, 2.5, "#1a1610", e, TURTLE.skin);
    if (!e) { nbOval(6.8, -4.8, 0.8, 0.8); nbFill("rgba(255, 255, 255, 0.9)"); }
    var nose = pen.getTransform().transformPoint(new DOMPoint(18, -1));
    pen.restore();
  }
  turtleShell(g, ((own * 0.18) % 1.6) / 1.6 * 1.3 - 0.15);
  if (g > 0.4) {                                     // a few points of light on the gold, twinkling
    for (var s = 0; s < 4; s++) {
      var tw = Math.max(0, Math.sin(own * 2.2 + s * 1.9)), sx = [-30, 6, 34, -8][s], sy = [-40, -50, -30, -20][s];
      if (tw > 0.7) {
        pen.strokeStyle = "rgba(255, 255, 240, " + ((tw - 0.7) / 0.3 * g) + ")";
        pen.lineWidth = 1.4;
        pen.beginPath(); pen.moveTo(sx - 6, sy); pen.lineTo(sx + 6, sy); pen.moveTo(sx, sy - 6); pen.lineTo(sx, sy + 6); pen.stroke();
      }
    }
  }
  leg(-38, false, false, 0);
  leg(26, true, false, 0.5);
  if (!nose) { var n0 = pen.getTransform().transformPoint(new DOMPoint(60, -10)); nose = n0; }
  nbEnd(keep);
  return {head: [nose.x, nose.y]};
}

// ---------- the barking deer ----------
// The barking deer (Muntiacus vaginalis, ฟาน in Kam Mueang, เก้ง in Thai), the small deer of the north's forests.
// The second of the seven signs that showed Mangrai where to build Chiang Mai was "two white barking deer, a
// mother and her young, came to this place and fought the dogs, and all the dogs ran and could not stand against
// them" (ฟานเผือกสองตัวแม่ลูก ... รบหมา หมาทั้งหลายพ่ายหนีบ่อาจจัดตั้งได้สักตัว: the chronicle, as the Thai Wikipedia
// page on ชัยมงคล 7 ประการ quotes it). Read from photographs:
//   1. Small, its back arched, the rump higher than the shoulders; the head carried low and forward.
//   2. Red-brown above; the belly, the inside of the legs and the underside of the tail white; the legs slim and
//      darker below; small black hooves.
//   3. A face narrowing to a dark muzzle, big ears, large dark eyes, a dark line down the face from each eye.
//   4. The buck: short antlers, one tine and a hooked tip, on long hairy stalks that run down the face as two dark
//      ridges in a V; long upper tusks that show below the lip. The doe has none; a fawn is spotted white in rows.
//   5. It walks with its head bobbing; it bounds away; it grazes; alarmed it stands stiff, ears forward, the tail
//      raised to show the white beneath, stamps a fore foot, and barks, a short loud cough, the head jerking.
// The look's names: size, face, white (true: the white deer of the chronicle), buck (true: antlers and tusks), fawn
// (true: a young one, spotted), step (grows a stride at a time while it walks; with run, while it runs), run (true:
// a bounding run), graze (0 to 1), alert (0 to 1), bark (0 to 1: barking, the head jerking), stamp (0 to 1: a fore
// foot stamping), butt (0 to 1: the head lowered forward to butt, as the deer that drove off the dogs), slope (as a
// beast's), seed, feel.

GAITS.deer = [1, 46, 1.1];                           // amble("deer", ...): scale, reach and the beats a stride takes

var DEER = {coat: "#a85a2c", coatLight: "#cc7a44", dark: "#5a2c16", belly: "#f6f0e6", muzzle: "#3a2418", hoof: "#1a1210", eye: "#1a1210",
            white: {coat: "#f8f4ee", coatLight: "#ffffff", dark: "#d8c8c0", belly: "#ffffff", muzzle: "#d8a8a8", hoof: "#b8a8a0", eye: "#4a1c20"}};

// The barking deer (rules above), its feet on (x, y); at second t.
//   look   DEER_KEYS: size, face, white, buck, fawn, step, run, graze, alert, bark, stamp, butt, slope, seed, feel
// Returns {nose: [x, y], seat: [x, y]}: its muzzle and its back on the sheet. It draws with pen.
// e.g. barkingDeer(700, GROUND, clock, {white: true, alert: 1});
function barkingDeer(x, y, t, look) {
  look = look || {};
  checkNames("The deer's name", look, DEER_KEYS);
  var c = look.white ? Object.assign({}, DEER, DEER.white) : DEER, own = t + (look.seed || 0);
  var e = look.feel !== undefined ? creatureFeel(look, t) : null;
  var size = (look.size || 1) * (look.fawn ? 0.55 : 1), face = look.face || 1;
  var graze = clamp(look.graze || 0), alert = clamp(look.alert || 0), bark = clamp(look.bark || 0), stamp = clamp(look.stamp || 0), butt = clamp(look.butt || 0);
  var running = !!look.run && look.step !== undefined, walking = look.step !== undefined;
  var gait = Object.assign({}, look, {step: walking ? look.step : undefined});
  var bound = running ? Math.sin((look.step % 1) * Math.PI * 2) : 0;
  var keepLine = LINE, keepFine = FINE;
  FINE = Math.min(1, Math.pow(size, -0.7));
  LINE = STYLE.line * FINE;
  pen.fillStyle = "rgba(70, 45, 30, 0.18)";          // the soft shadow on the ground
  pen.beginPath();
  pen.ellipse(x, y + 3, 64 * size, 7 * size, 0, 0, 7);
  pen.fill();
  pen.save();
  pen.translate(x, y);
  pen.scale(size * face, size);
  if (running) { pen.translate(0, -16 * Math.max(0, bound)); pen.rotate(-0.08 * bound); }
  var legs = [[-44, -80, 0, -1, false], [32, -76, 0.25, 1, false], [-36, -82, 0.5, -1, true], [40, -78, 0.75, 1, true]];
  var bones = [42, 38, 7], reach = running ? 64 : GAITS.deer[1], liftF = running ? 18 : 12;
  function hoof(ax, ay, skin, lifted) {              // a small black cloven hoof
    pen.save();
    pen.translate(ax, ay);
    pen.rotate(lifted ? 0.5 : 0);
    pen.beginPath(); pen.moveTo(-3.5, -2); pen.lineTo(-4.5, 5); pen.lineTo(5, 5); pen.lineTo(3.5, -2); pen.closePath();
    shape(c.hoof);
    pen.restore();
  }
  var stampUp = stamp * Math.max(0, Math.sin(own * 7)) * 12;
  function legsSide(far) {
    if (stampUp > 0 && !far) {                       // rule 5: one fore foot raised and struck down
      var L = legs[1], d = (look.white ? "#eee6de" : blend(c.coat, c.dark, 0.3));
      var ankle = limb(L[0], L[1], L[0] + 6, -bones[2] - stampUp, bones[0], bones[1], [6.5, 3.4, 2.4], d, function (j) { return j[0]; }, 0.3);
      hoof(ankle[0], ankle[1], d, stampUp > 3);
      beastLegs([legs[0]], false, gait, bones, [6.5, 3.4, 2.4], (look.white ? "#eee6de" : blend(c.coat, c.dark, 0.3)), reach, liftF, hoof);
      return;
    }
    beastLegs(legs, far, gait, bones, [6.5, 3.4, 2.4], (look.white ? "#eee6de" : blend(c.coat, c.dark, 0.3)), reach, liftF, hoof);
  }
  legsSide(true);
  var tailUp = alert * 0.9 + bark * 0.5 + (e ? 0.4 * e.tail : 0);
  pen.save();                                        // rule 5: the short tail, raised to flag its white
  pen.translate(-64, -96);
  pen.rotate(-0.4 - tailUp * 1.6 + 0.05 * Math.sin(own * 3));
  lbSmooth([[0, -4], [-14, -4], [-20, 2], [-12, 6], [0, 4]]);
  nbPaint(tailUp > 0.3 ? c.belly : c.coat, nbGrad(0, -4, 0, 6, c.coat, tailUp > 0.3 ? c.belly : c.coatLight));
  pen.restore();
  var rise = Math.sin(own * 2) * 0.6;
  lbSmooth([[48, -80], [34, -92], [8, -96 - rise], [-22, -100 - rise], [-46, -104], [-62, -96], [-68, -80], [-60, -66], [-46, -62], [-30, -66], [-6, -62], [22, -56], [42, -62]]);   // rule 1: the body, the back arched, the rump high
  nbPaint(c.coat, nbGrad(0, -98, 0, -56, c.coatLight, c.coat));
  pen.save();
  pen.clip();
  var belly = pen.createLinearGradient(0, -68, 0, -56);
  belly.addColorStop(0, blend(c.coat, c.belly, 0));
  belly.addColorStop(0.5, c.belly);
  pen.fillStyle = belly;
  pen.fillRect(-60, -68, 110, 14);
  if (look.fawn) {                                   // rule 4: a fawn's white spots, in rows along its sides
    for (var r = 0; r < 3; r++) { for (var s = 0; s < 8; s++) { nbOval(-48 + s * 12 + r * 4, -90 + r * 9, 2.4, 1.8); nbFill(c.belly); } }
  }
  pen.restore();
  legsSide(false);
  pen.save();                                        // the neck and the head: low and forward; down to graze; up when alert; lowered to butt
  pen.translate(38, -82);
  var nod = walking && !running ? 0.06 * Math.sin(look.step * Math.PI * 4) : 0;
  var jerk = bark * Math.max(0, Math.sin(own * 6)) * 0.3;
  var down = graze * 1.25 + butt * 0.5 - alert * 0.5 + jerk * 0.6 + nod + (e ? 0.4 * e.nod - 0.3 * e.raise : 0);
  pen.rotate(-0.32 + down);
  lbSmooth([[-12, -12], [10, -16], [30, -12], [34, 2], [20, 10], [-2, 14], [-14, 8]]);   // the neck, short and thick, carried forward
  nbPaint(c.coat, nbGrad(0, -16, 0, 14, c.coatLight, blend(c.coat, c.belly, 0.25)));
  pen.save();                                        // its pale throat
  pen.clip();
  lbSmooth([[30, 4], [18, 12], [-4, 16], [-2, 8], [22, 4]]);
  nbFill(blend(c.coat, c.belly, 0.6));
  pen.restore();
  pen.translate(30, -4);
  pen.rotate(0.55 - down * 0.4 + (running ? 0.2 : 0) - alert * 0.15);
  var earsUp = alert * 0.55 + (e ? 0.4 * e.ears : 0) + 0.1 * Math.sin(own * 1.7) + bark * 0.2;
  [[-1, 0.3], [1, 0]].forEach(function (ear) {      // rule 3: the big round ears, swung forward when alert
    pen.save();
    pen.translate(-1 + ear[0] * 2, -8);
    pen.rotate(-2.25 + earsUp + ear[1]);
    lbSmooth([[0, -5], [10, -9], [20, -7], [23, 0], [17, 6], [6, 6], [0, 4]]);
    nbPaint(ear[0] < 0 ? (look.white ? "#eee6de" : blend(c.coat, c.dark, 0.3)) : c.coat);
    if (ear[0] > 0) { lbSmooth([[5, -3], [13, -5], [18, -1], [12, 3], [6, 2]]); nbFill(look.white ? "#f0c8c8" : "#d8a888"); }
    pen.restore();
  });
  if (look.buck) {                                   // rule 4: the antlers on their long hairy stalks, a short tine and a hooked tip
    [[-1, 0.2], [1, 0]].forEach(function (a) {
      var tone = a[0] < 0 ? blend(c.coat, c.dark, 0.4) : c.coat;
      nbLimb([[4 + a[0] * 2, -10], [0 + a[0] * 2, -24]], 5, tone);
      nbLimb([[0 + a[0] * 2, -24], [-4 + a[0] * 2, -38], [3 + a[0] * 2, -43]], 3, "#e8dcc0");
      nbLimb([[0 + a[0] * 2, -27], [6 + a[0] * 2, -30]], 2.2, "#e8dcc0");
    });
  }
  lbSmooth([[-4, -10], [8, -12], [22, -8], [36, 0], [40, 7], [34, 11], [20, 9], [6, 8], [-6, 4]]);   // the head: a wedge from the brow to the muzzle
  nbPaint(c.coat, nbGrad(0, -12, 0, 11, c.coatLight, c.coat));
  pen.strokeStyle = blend(c.dark, c.coat, look.white ? 0.35 : 0);   // rules 3, 4: the dark line from the eye down the face (on a buck, his stalks' ridges)
  pen.lineWidth = look.buck ? 2.4 : 1.4;
  pen.beginPath(); pen.moveTo(4, -9); pen.quadraticCurveTo(18, -7, 32, 1); pen.stroke();
  pen.strokeStyle = blend(c.dark, "#000000", look.white ? 0 : 0.3);   // the gland below the eye, a dark slit
  pen.lineWidth = 1.6;
  pen.beginPath(); pen.moveTo(13, 1); pen.quadraticCurveTo(18, 3, 22, 2); pen.stroke();
  var open = bark * Math.max(0, Math.sin(own * 6)) * 5;
  lbSmooth([[30, 2], [38, 2], [41, 7], [36, 11 + open * 0.3], [29, 9]]);   // the muzzle, dark, and its nostril
  nbPaint(c.muzzle);
  nbOval(37.5, 5, 1.3, 0.9, 0.4); nbFill("#120c08");
  if (open > 1) { pen.strokeStyle = "#2a1410"; pen.lineWidth = 1.6; pen.beginPath(); pen.moveTo(28, 9); pen.lineTo(38, 9 + open); pen.stroke(); }
  if (look.buck) { nbLimb([[24, 8], [25, 15]], 1.8, "#f4ecd8"); }   // rule 4: the tusk below the lip
  nbOval(12, -3, 4.8, 4.2, 0.1);                     // the large dark eye, soft lashes over it
  nbFill(blend(c.coat, "#ffffff", 0.35));
  nbEye(12.4, -3, 3.6, c.eye, e, c.coat);
  if (!e) { nbOval(13.6, -4.2, 1.1, 1.1); nbFill("rgba(255, 255, 255, 0.9)"); }
  pen.strokeStyle = blend(c.dark, "#000000", 0.4);
  pen.lineWidth = 1;
  pen.beginPath(); pen.moveTo(8, -6.5); pen.quadraticCurveTo(12, -8, 16.5, -6); pen.stroke();
  var nose = pen.getTransform().transformPoint(new DOMPoint(40, 6));
  pen.restore();
  pen.restore();
  LINE = keepLine;
  FINE = keepFine;
  return {nose: [nose.x, nose.y], seat: [x - 10 * size * face, y - 96 * size]};
}

// ---------- the white mice ----------
// The white mouse and her four young (หนูเผือกกับบริวาร 4 ตัว), the third of the seven signs of Chiang Mai: they
// came out of the place where Mangrai built the city (ตำนานพื้นเมืองเชียงใหม่; the plaque at the Three Kings
// Monument tells it as a mother leading her young into a burrow). The mother is the kit's mouse() of kind "white"
// (beasts.js); her young are half her size and run after her in a line, each in its own step, stopping when she
// stops and sitting up to sniff. A burrow's mouth, a dark hole in the earth under a root, is at "into" (an x): as
// each comes to it, it goes in and is gone.
// whiteMice(x, y, t, look): the mother's feet at (x, y), the young behind her. look: size, face, along (a number
// that grows as they run: how far they have gone, in strides; without it they stand), into (the burrow's x: drawn,
// and they disappear into it), young (how many, 4 the default), seed. Returns nothing: it draws with pen.
// e.g. whiteMice(mix(400, 900, s), GROUND, clock, {along: s * 12, into: 920});
function whiteMice(x, y, t, look) {
  look = look || {};
  checkNames("The mice's name", look, MICE_KEYS);
  var size = look.size || 1, face = look.face || 1, n = look.young === undefined ? 4 : look.young, running = look.along !== undefined;
  var burrow = look.into, k;
  if (burrow !== undefined) {                        // the hole's dark mouth, behind them
    pen.beginPath();                                 // a low mound of earth, and the dark hole in it
    pen.ellipse(burrow, y, 34 * size, 16 * size, 0, Math.PI, 0);
    pen.closePath();
    nbPaint("#9a7a52", nbGrad(0, y - 16 * size, 0, y, "#b8946a", "#7a5a38"));
    pen.beginPath(); pen.ellipse(burrow, y - 4 * size, 13 * size, 9 * size, 0, Math.PI, 0); pen.lineTo(burrow + 13 * size, y - 1); pen.lineTo(burrow - 13 * size, y - 1); pen.closePath();
    nbFill(nbGrad(0, y - 13 * size, 0, y, "#1a100a", "#3a2618"));
  }
  function one(mx, ms, step, sniff, up) {
    var gone = burrow !== undefined && (face > 0 ? mx > burrow : mx < burrow);
    if (gone) { return; }
    var near = burrow !== undefined ? clamp(1 - Math.abs(mx - burrow) / (14 * size)) : 0;   // going in: the hind half last
    pen.save();
    if (near > 0) { pen.globalAlpha *= 1 - near * 0.8; }
    mouse(mx, y, {kind: "white", size: ms, face: face, step: step, sniff: sniff, up: up});
    pen.restore();
  }
  for (k = n; k >= 1; k--) {                         // the young, the last first, each its own way behind her
    var back = k * 44 * size, lag = running ? look.along - k * 0.6 : undefined;
    var mx = x - face * back, sn = running ? 0 : clamp(0.6 + 0.4 * Math.sin(t * 1.3 + k)), up = running ? 0 : (k % 2) * clamp(Math.sin(t * 0.9 + k * 2));
    one(mx, size * 0.55, lag !== undefined && lag > 0 ? lag * 1.15 : undefined, sn, up);
  }
  one(x, size, running ? look.along : undefined, running ? 0 : 0.4 + 0.4 * Math.sin(t * 1.1), 0);
  if (burrow !== undefined) {                        // the hole's near lip of earth, a little mound, in front of them
    pen.beginPath();
    pen.moveTo(burrow - 30 * size, y + 1);
    pen.quadraticCurveTo(burrow - 22 * size, y - 6 * size, burrow - 12 * size, y - 3 * size);
    pen.quadraticCurveTo(burrow, y + 2 * size, burrow + 12 * size, y - 3 * size);
    pen.quadraticCurveTo(burrow + 22 * size, y - 6 * size, burrow + 30 * size, y + 1);
    pen.closePath();
    nbPaint("#8a6a48", nbGrad(0, y - 6 * size, 0, y, "#a8845a", "#6a4a30"));
  }
}
