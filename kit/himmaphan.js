// himmaphan.js - beings of the Himmaphan, the mythic forest above the world in Thai art, flying, for the Lanna cartoon
// kit: the thewada (an angel), the kinnari (half woman, half bird) and the hong (the golden swan) on the wing. Load it
// after the kit:
//
//     <script src="oldcartoon.js"></script>
//     <script src="himmaphan.js"></script>
//
//   thewada(x, y, t, look)     an angel flying as the murals paint them: one knee forward, the other leg swept up
//                              behind, the sole to the sky; a lotus held up, the other hand before the chest
//   kinnari(x, y, t, look)     a kinnari in flight: a woman crowned to the waist, a bird below, her wings spread
//   hongFlight(x, y, t, look)  the hong on the wing, its neck long, its tail a flame of plumes
//
// (x, y) is the middle of the figure; each flies to the right (look.face -1 to the left); t is the second; look.size,
// 1 being about 220 from crown to the lowest point; look.seed sets each one's own time, so a flight of them do not move
// as one; look.scarves (the thewada's and the kinnari's): two long scarves streaming behind; look.gift: what the
// thewada holds up, "lotus" (the default) or "garland"; look.light (0 to 1, 0.6 unless told): the low sun on them,
// gilding their edges; look.soar (the hong's): it soars and glides, its wings held out; look.beats, [when, how
// many] (with soar): from "when" (seconds) it gives that many strong beats, then glides on; look.trail (the hong's):
// a function of the time giving [x, y], where the film moves it, so its spine follows its rises and falls.
//
// Drawn for the studio's card (owner, 2026-10-21: "Change the SLS video to be of a misty mountain scene with birds
// flying and ... these Thai angels and other mystic beings flying around. Everything should move glide and soar
// effortlessly and slowly", then "Spend some time adding detail and improving the quality of each sprite"), from a
// photograph of a temple mural of thewada flying among clouds the owner gave (studied, not copied: the tall tiered
// crown, the gilded skin, the patterned cloth whose ends flare back like flames, the pose of flight).

// The look keys thewada(), kinnari() and hongFlight() take, said above; any other is warned of once (checkNames) and
// changes nothing. The three share the list, so a key one of them does not read (gift on the hong) is passed by quietly.
var HIMMA_KEYS = {};
["size", "face", "seed", "scarves", "gift", "light", "soar", "beats", "trail", "level"].forEach(function (n) { HIMMA_KEYS[n] = true; });

// The beings' colours, each "#rrggbb": gilded skin, gold, jewels, cloth, scarves, lotus, feathers. Every function here
// reads them as it draws; a page may change one before it draws.
var HIMMA = {skin: "#e8b860", skinLit: "#f8dc94", skinShade: "#c48a3c", skinLine: "#7a4e1c", gold: "#dca63c", goldLit: "#f6d47a",
             goldLine: "#6e4612", jewel: "#c8303a", jewel2: "#2e8a6a", cloth: "#a8322a", clothDeep: "#6a1c16", clothIn: "#2e6a5a",
             border: "#e3b04a", scarf: "#f0cc6a", scarf2: "#d0503c", lotus: "#f4a8ba", lotusDeep: "#c8607e", leaf: "#5f8a34",
             lip: "#b8343a", brow: "#3a2410", feather: "#f2ead6", featherDeep: "#c9b48a", featherLine: "#7a6440"};

// Fills the path now on pen with "fill" (a colour or a gradient) and strokes it with "line" (a colour), "width" pixels
// wide (1.4 when left out). Returns nothing. It leaves pen's fillStyle, strokeStyle and lineWidth as it set them, and so
// do the helpers below that draw through it; thewada(), kinnari() and hongFlight() save pen and restore it.
// e.g. pen.beginPath(); pen.arc(0, 0, 5, 0, Math.PI * 2); himmaFill(HIMMA.gold, HIMMA.goldLine);
function himmaFill(fill, line, width) {             // the kit's way: the paint, then a fine line of the colour's own ink
  pen.fillStyle = fill;
  pen.fill();
  pen.strokeStyle = line;
  pen.lineWidth = width || 1.4;
  pen.stroke();
}

// Returns a gradient (it draws nothing) along the line from (x0, y0) to (x1, y1) in pen's place now: skinLit blended in
// by "light" (0 to 1) at the start, skinShade at the end. For himmaFill().
// e.g. himmaFill(himmaSkin(-8, -10, 10, 10, 0.6), HIMMA.skinLine);
function himmaSkin(x0, y0, x1, y1, light) {          // gilded skin: lit toward the sun (the upper right), shaded away
  var g = pen.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, blend(HIMMA.skin, HIMMA.skinLit, light));
  g.addColorStop(0.55, HIMMA.skin);
  g.addColorStop(1, HIMMA.skinShade);
  return g;
}

// A hand of Thai dance at (x, y), its wrist turned "turn" (radians), the four fingers together and bent far back,
// the thumb apart: the hand the murals give every thewada.
// size: 1 is about 22 pixels from wrist to fingertips; light: 0 to 1, as himmaSkin's. Returns nothing: it draws with pen.
// e.g. himmaHand(-3, -22, -0.6, 0.95, 0.6);
function himmaHand(x, y, turn, size, light) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.scale(size, size);
  pen.beginPath();
  pen.moveTo(0, -3);
  pen.quadraticCurveTo(6, -4, 10, -3);              // the back of the hand
  pen.quadraticCurveTo(16, -5, 20, -10);             // the fingers, bending back
  pen.quadraticCurveTo(22, -13, 20, -14);
  pen.quadraticCurveTo(15, -10, 11, 2);
  pen.quadraticCurveTo(6, 4, 0, 3);
  pen.closePath();
  himmaFill(himmaSkin(0, -8, 16, 4, light), HIMMA.skinLine, 1.1);
  pen.beginPath();                                   // the thumb, apart
  pen.moveTo(6, 2);
  pen.quadraticCurveTo(10, 7, 14, 6);
  pen.strokeStyle = HIMMA.skinLine;
  pen.lineWidth = 2.6;
  pen.stroke();
  pen.strokeStyle = HIMMA.skin;
  pen.lineWidth = 1.4;
  pen.stroke();
  pen.restore();
}

// The tall crown of the thewada (chada): a band of jewels at the brow, tiers narrowing to a spire that flicks back at
// its tip, and the flame of gold behind each ear (kanchiak).
// (x, y): the middle of the brow band; the spire rises about 70 pixels above it. light: 0 to 1, the gold's shine.
// Returns nothing: it draws with pen.
// e.g. himmaCrown(4, -74, 0.6);
function himmaCrown(x, y, light) {
  pen.save();
  pen.translate(x, y);
  pen.beginPath();                                   // the ear's flame, behind
  pen.moveTo(-10, 2);
  pen.bezierCurveTo(-22, -4, -24, -16, -18, -24);
  pen.quadraticCurveTo(-16, -14, -8, -6);
  pen.closePath();
  himmaFill(HIMMA.gold, HIMMA.goldLine);
  pen.beginPath();                                   // the crown's body, from the brow to the spire
  pen.moveTo(-11, 0);
  pen.quadraticCurveTo(1, -6, 13, 0);
  pen.quadraticCurveTo(11, -14, 8, -26);
  pen.quadraticCurveTo(5, -42, 1, -54);
  pen.quadraticCurveTo(-3, -64, -9, -70);              // the spire flicks back
  pen.quadraticCurveTo(-5, -58, -4, -44);
  pen.quadraticCurveTo(-8, -24, -11, 0);
  pen.closePath();
  var g = pen.createLinearGradient(-10, 0, 12, -10);
  g.addColorStop(0, HIMMA.gold);
  g.addColorStop(1, blend(HIMMA.gold, HIMMA.goldLit, 0.4 + 0.6 * light));
  himmaFill(g, HIMMA.goldLine);
  pen.strokeStyle = HIMMA.goldLine;                  // its tiers
  pen.lineWidth = 1.1;
  for (var k = 0; k < 6; k++) {
    var ry = -6 - k * 7.5, half = 11 - k * 1.6, mid = 1 - k * 0.6;
    pen.beginPath();
    pen.moveTo(mid - half, ry + 1);
    pen.quadraticCurveTo(mid, ry - 2.5, mid + half, ry + 1);
    pen.stroke();
  }
  pen.beginPath();                                   // the band at the brow, and its jewels
  pen.moveTo(-11, 0);
  pen.quadraticCurveTo(1, -6, 13, 0);
  pen.quadraticCurveTo(1, -10, -10, -5);
  pen.closePath();
  himmaFill(HIMMA.goldLit, HIMMA.goldLine, 1);
  [[-5, -3.2, HIMMA.jewel], [1, -4.6, HIMMA.jewel2], [7, -3.6, HIMMA.jewel]].forEach(function (j) {
    pen.fillStyle = j[2];
    pen.beginPath();
    pen.arc(j[0], j[1], 1.5, 0, Math.PI * 2);
    pen.fill();
  });
  pen.restore();
}

// The face, turned a little to us: brows arched high, the eyes long and lowered, a fine nose, a small red mouth, an
// earring hanging from the long lobe.
// (x, y): the middle of the face, about 20 pixels across and 25 high, facing right; light: 0 to 1; tilt: radians, 0
// when left out. Returns nothing: it draws with pen.
// e.g. himmaHead(4, -66, 0.6, 0.08);
function himmaHead(x, y, light, tilt) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(tilt || 0);
  pen.beginPath();
  pen.ellipse(0, 0, 10, 12.5, 0.1, 0, Math.PI * 2);
  himmaFill(himmaSkin(-8, -10, 10, 10, light), HIMMA.skinLine);
  pen.beginPath();                                   // the ear and its long lobe
  pen.ellipse(-9, 1, 2.6, 4.6, 0.1, 0, Math.PI * 2);
  himmaFill(HIMMA.skin, HIMMA.skinLine, 1);
  pen.fillStyle = HIMMA.gold;                        // the earring
  pen.beginPath();
  pen.arc(-9.5, 7.5, 1.8, 0, Math.PI * 2);
  pen.fill();
  pen.strokeStyle = HIMMA.brow;
  pen.lineWidth = 1.1;
  pen.beginPath();                                   // the brows, arched
  pen.moveTo(-2, -4.5); pen.quadraticCurveTo(1, -7, 4, -5);
  pen.moveTo(5.5, -5); pen.quadraticCurveTo(8, -6.6, 10, -4.6);
  pen.stroke();
  pen.lineWidth = 1.3;
  pen.beginPath();                                   // the eyes, long, lowered, a lid's line
  pen.moveTo(-1.5, -1.5); pen.quadraticCurveTo(1.5, -0.2, 4.5, -1.6);
  pen.moveTo(6, -1.6); pen.quadraticCurveTo(8, -0.4, 10, -1.6);
  pen.stroke();
  pen.lineWidth = 0.9;
  pen.beginPath();                                   // the nose
  pen.moveTo(6.5, -1); pen.quadraticCurveTo(8.5, 3, 6.5, 4.2);
  pen.stroke();
  pen.fillStyle = HIMMA.lip;                         // the mouth, small and smiling a little
  pen.beginPath();
  pen.moveTo(3.4, 7);
  pen.quadraticCurveTo(5.8, 6.2, 8.2, 7);
  pen.quadraticCurveTo(5.8, 9, 3.4, 7);
  pen.fill();
  pen.restore();
}

// Two scarves from the shoulders, streaming back and waving slowly: each a band that narrows, its border gold.
// t: the second; seed: shifts their wave in time; from: [x, y], the shoulders; length: the pixels they stream back
// (to the left), falling about 40 pixels by their ends. Returns nothing: it draws with pen.
// e.g. himmaScarves(t, 0, [0, -42], 210);
function himmaScarves(t, seed, from, length) {
  [[HIMMA.scarf, 0, 0], [HIMMA.scarf2, 4, 1.9]].forEach(function (sc) {
    var top = [], bottom = [];
    for (var u = 0; u <= 1.0001; u += 0.05) {
      var px = from[0] - length * u, py = from[1] + sc[1] + 40 * u * u + 18 * Math.sin(t * 0.9 + seed + sc[2] + u * 4.5) * u;
      var w = 4.5 * (1 - 0.6 * u);
      top.push([px, py - w]);
      bottom.push([px, py + w]);
    }
    pen.beginPath();
    top.forEach(function (p, i) { if (i) { pen.lineTo(p[0], p[1]); } else { pen.moveTo(p[0], p[1]); } });
    for (var k = bottom.length - 1; k >= 0; k--) { pen.lineTo(bottom[k][0], bottom[k][1]); }
    pen.closePath();
    himmaFill(sc[0], HIMMA.goldLine, 1);
  });
}

// The cloth wrapped at the hips: red with rows of gold diamonds, a green under-layer showing at its edge, a gold
// border, its ends flaring back in curling flames that ripple as it flies.
// Drawn in the thewada's own place: the belt across about x -14 to 19 at y 0, the flames out to about 80 pixels behind
// and 76 below. t: the second; seed: shifts its ripple in time; light: 0 to 1, the sheen. Returns nothing: it draws
// with pen.
// e.g. himmaCloth(t, 0, 0.6);
function himmaCloth(t, seed, light) {
  var r = function (k) { return Math.sin(t * 1.1 + seed + k * 1.3) * 3.2; };
  function flames(shift, colour, line) {
    pen.beginPath();
    pen.moveTo(18 + shift, -4);
    pen.bezierCurveTo(28 + shift, 14, 32, 38, 26, 58);
    pen.quadraticCurveTo(12, 70, -4, 62);
    pen.bezierCurveTo(-12, 66, -20, 74 + r(1), -32, 76 + r(1));       // a flame, curling at its tip
    pen.quadraticCurveTo(-24, 70, -24, 62);
    pen.bezierCurveTo(-34, 62, -48, 68 + r(2), -62, 70 + r(2));
    pen.quadraticCurveTo(-52, 60, -40, 50);
    pen.bezierCurveTo(-52, 50, -66, 52 + r(3), -78, 48 + r(3));
    pen.quadraticCurveTo(-64, 40, -48, 36);
    pen.bezierCurveTo(-58, 32, -70, 28 + r(4), -80, 20 + r(4));
    pen.quadraticCurveTo(-60, 18, -40, 20);
    pen.bezierCurveTo(-30, 16, -20, 8, -14, -4);
    pen.closePath();
    himmaFill(colour, line);
  }
  flames(2, HIMMA.clothIn, blend(HIMMA.clothIn, "#000000", 0.4));       // the green under-layer, a little beyond
  flames(0, HIMMA.cloth, HIMMA.clothDeep);
  pen.save();
  pen.clip();
  pen.strokeStyle = HIMMA.border;                    // the pattern: rows of small gold diamonds, a dot in each
  pen.lineWidth = 1.2;
  pen.fillStyle = HIMMA.border;
  for (var row = 0; row < 8; row++) {
    for (var c = -7; c < 4; c++) {
      var cx = c * 11 + (row % 2) * 5.5, cy = row * 10;
      pen.beginPath();
      pen.moveTo(cx, cy - 3.2); pen.lineTo(cx + 3.2, cy); pen.lineTo(cx, cy + 3.2); pen.lineTo(cx - 3.2, cy);
      pen.closePath();
      pen.stroke();
      pen.beginPath();
      pen.arc(cx, cy, 0.8, 0, Math.PI * 2);
      pen.fill();
    }
  }
  var sheen = pen.createLinearGradient(-60, 0, 30, 0);   // the low sun along its front
  sheen.addColorStop(0, "rgba(255, 220, 150, 0)");
  sheen.addColorStop(1, "rgba(255, 220, 150, " + (0.25 * light).toFixed(3) + ")");
  pen.fillStyle = sheen;
  pen.fillRect(-90, -10, 130, 100);
  pen.restore();
  pen.beginPath();                                   // the gold belt and its hanging jewel
  pen.moveTo(-14, -4);
  pen.quadraticCurveTo(2, 4, 19, -4);
  pen.lineTo(19, 1);
  pen.quadraticCurveTo(2, 9, -14, 1);
  pen.closePath();
  himmaFill(HIMMA.gold, HIMMA.goldLine, 1);
  pen.beginPath();
  pen.moveTo(1, 5); pen.lineTo(4, 13); pen.lineTo(7, 5);
  pen.closePath();
  himmaFill(HIMMA.goldLit, HIMMA.goldLine, 0.9);
}

// A thewada, an angel, flying, as the top of this file says: (x, y) about the middle of the figure, pixels of the
// sheet; t: the second; look: its keys are HIMMA_KEYS above, the thewada reading size (1 when left out: about 220
// pixels tall), face (1, to the right; -1 to the left), seed (0), scarves (none), gift ("lotus", or "garland") and
// light (0 to 1; 0.6). Returns nothing: it draws with pen and leaves pen as it found it.
// e.g. thewada(250, 330, t, {size: 1.9, scarves: true, gift: "garland", seed: 1.5});
function thewada(x, y, t, look) {
  look = look || {};
  checkNames("The thewada's name", look, HIMMA_KEYS);
  var size = look.size || 1, seed = look.seed || 0, light = look.light === undefined ? 0.6 : look.light;
  var glide = Math.sin(t * 0.55 + seed);             // the slow rise and fall of its flight
  pen.save();
  pen.translate(x, y + 7 * glide * size);
  pen.scale(size * (look.face || 1), size);
  pen.rotate(-0.12 + 0.05 * Math.sin(t * 0.4 + seed));
  pen.translate(0, -10);
  pen.lineJoin = "round";
  pen.lineCap = "round";
  if (look.scarves) { himmaScarves(t, seed, [0, -42], 210); }
  // the leg swept up behind: a slim thigh, the knee bent, the shin rising, the foot flexed with its sole to the sky
  pen.beginPath();
  pen.moveTo(-6, 18);
  pen.bezierCurveTo(-28, 26, -46, 30, -60, 27);       // under the thigh, to the knee
  pen.bezierCurveTo(-71, 22, -76, 9, -78, -5);          // up the back of the shin
  pen.quadraticCurveTo(-80, -12, -83, -17);            // the heel
  pen.quadraticCurveTo(-81, -24, -75, -24);            // the sole, up
  pen.quadraticCurveTo(-69, -26, -66, -31);            // the toes, bent back
  pen.quadraticCurveTo(-64, -26, -69, -18);
  pen.bezierCurveTo(-68, -6, -63, 7, -55, 12);         // down the front of the shin
  pen.bezierCurveTo(-40, 14, -22, 10, -8, 5);
  pen.closePath();
  himmaFill(himmaSkin(-80, -20, -20, 30, light), HIMMA.skinLine);
  pen.strokeStyle = HIMMA.gold;                      // its anklet
  pen.lineWidth = 2;
  pen.beginPath(); pen.moveTo(-80, -9); pen.lineTo(-69, -11); pen.stroke();
  himmaCloth(t, seed, light);
  // the front leg: the knee forward and down, the shin folded back under, the foot flexed
  pen.beginPath();
  pen.moveTo(22, 46);
  pen.bezierCurveTo(30, 56, 32, 66, 26, 71);           // the knee
  pen.bezierCurveTo(14, 75, 0, 75, -12, 73);           // under the shin, folded back
  pen.quadraticCurveTo(-17, 73, -20, 70);              // the heel
  pen.quadraticCurveTo(-23, 65, -19, 62);              // the toes, bent up
  pen.quadraticCurveTo(-15, 66, -10, 67);
  pen.bezierCurveTo(2, 67, 12, 63, 12, 56);
  pen.closePath();
  himmaFill(himmaSkin(-20, 60, 30, 76, light), HIMMA.skinLine);
  pen.strokeStyle = HIMMA.gold;
  pen.lineWidth = 2;
  pen.beginPath(); pen.moveTo(-12, 67); pen.lineTo(-11, 73); pen.stroke();
  // the body: a slim waist, the chest turned a little to us, leaning into the flight
  pen.beginPath();
  pen.moveTo(-12, -2);
  pen.bezierCurveTo(-16, -16, -16, -32, -10, -46);
  pen.quadraticCurveTo(2, -54, 14, -50);
  pen.bezierCurveTo(22, -36, 18, -16, 19, -4);
  pen.closePath();
  himmaFill(himmaSkin(-12, -40, 20, 0, light), HIMMA.skinLine);
  pen.strokeStyle = HIMMA.gold;                      // the crossed chains over the chest (sangwan), a jewel where they cross
  pen.lineWidth = 1.6;
  pen.beginPath();
  pen.moveTo(-10, -42); pen.quadraticCurveTo(2, -26, 16, -10);
  pen.moveTo(14, -46); pen.quadraticCurveTo(4, -26, -10, -10);
  pen.stroke();
  pen.fillStyle = HIMMA.jewel;
  pen.beginPath(); pen.arc(3, -27, 2.2, 0, Math.PI * 2); pen.fill();
  pen.beginPath();                                   // the collar of gold, its points down, a jewel at each
  pen.moveTo(-12, -46);
  pen.quadraticCurveTo(2, -32, 16, -48);
  pen.lineTo(14, -53);
  pen.quadraticCurveTo(2, -44, -9, -52);
  pen.closePath();
  himmaFill(HIMMA.gold, HIMMA.goldLine, 1);
  [[-6, -45], [2, -40], [10, -45]].forEach(function (j) { pen.fillStyle = HIMMA.jewel; pen.beginPath(); pen.arc(j[0], j[1], 1.4, 0, Math.PI * 2); pen.fill(); });
  // the back arm, bent, its hand before the chest in the dance's hand
  pen.beginPath();
  pen.moveTo(-8, -46);
  pen.bezierCurveTo(-24, -40, -28, -26, -18, -20);
  pen.quadraticCurveTo(-10, -18, -2, -22);
  pen.quadraticCurveTo(-4, -28, -12, -28);
  pen.bezierCurveTo(-16, -32, -12, -40, -2, -43);
  pen.closePath();
  himmaFill(himmaSkin(-26, -40, 0, -20, light), HIMMA.skinLine);
  pen.strokeStyle = HIMMA.gold; pen.lineWidth = 2.6;  // its armband and bracelet
  pen.beginPath(); pen.moveTo(-20, -40); pen.lineTo(-14, -36); pen.moveTo(-6, -25); pen.lineTo(-4, -20); pen.stroke();
  himmaHand(-3, -22, -0.6, 0.95, light);
  // the front arm, up and forward, holding up its gift
  pen.beginPath();
  pen.moveTo(10, -50);
  pen.bezierCurveTo(22, -58, 32, -72, 36, -88);
  pen.quadraticCurveTo(40, -92, 44, -88);
  pen.bezierCurveTo(42, -72, 32, -56, 18, -42);
  pen.closePath();
  himmaFill(himmaSkin(10, -90, 44, -44, light), HIMMA.skinLine);
  pen.strokeStyle = HIMMA.gold; pen.lineWidth = 2.6;
  pen.beginPath(); pen.moveTo(19, -60); pen.lineTo(25, -54); pen.moveTo(35, -84); pen.lineTo(42, -82); pen.stroke();
  if (look.gift === "garland") {                     // a garland of jasmine, swinging from the hand
    pen.strokeStyle = HIMMA.feather;
    pen.lineWidth = 4;
    pen.beginPath(); pen.moveTo(40, -90); pen.quadraticCurveTo(52 + 4 * Math.sin(t + seed), -66, 46, -50); pen.stroke();
    pen.fillStyle = HIMMA.jewel;
    pen.beginPath(); pen.arc(46, -50, 3, 0, Math.PI * 2); pen.fill();
  } else {                                           // a lotus bud on its stem, its petals closed to a point
    pen.strokeStyle = HIMMA.leaf; pen.lineWidth = 1.6;
    pen.beginPath(); pen.moveTo(41, -90); pen.quadraticCurveTo(43, -98, 42, -104); pen.stroke();
    pen.beginPath();
    pen.moveTo(42, -102);
    pen.bezierCurveTo(33, -110, 36, -124, 43, -134);
    pen.bezierCurveTo(50, -124, 53, -110, 44, -102);
    pen.closePath();
    var lg = pen.createLinearGradient(42, -134, 42, -102);
    lg.addColorStop(0, HIMMA.lotusDeep); lg.addColorStop(1, HIMMA.lotus);
    himmaFill(lg, HIMMA.lotusDeep, 1.1);
    pen.strokeStyle = HIMMA.lotusDeep; pen.lineWidth = 0.9;
    pen.beginPath(); pen.moveTo(43, -104); pen.quadraticCurveTo(40, -116, 43, -130); pen.stroke();
  }
  himmaHand(40, -89, -1.2, 0.95, light);
  // the head and its crown
  himmaHead(4, -66, light, 0.08);
  himmaCrown(4, -74, light);
  pen.restore();
}

// One plume of a tail from its root, out at angle "a" for "len", "wide" across at its fullest, its tip curling by
// "curl" (radians): a leaf of gold, its rib, and a red eye near its end.
// root: [x, y]; a and curl: radians (curl 0 when left out); len and wide: pixels; colour: its fill. Returns nothing: it
// draws with pen.
// e.g. himmaPlume([-24, 28], 3.1, 100, 9, HIMMA.gold, 0.05);
function himmaPlume(root, a, len, wide, colour, curl) {
  var mid = [root[0] + Math.cos(a) * len * 0.55, root[1] + Math.sin(a) * len * 0.55];
  var tipA = a + (curl || 0), tip = [mid[0] + Math.cos(tipA) * len * 0.45, mid[1] + Math.sin(tipA) * len * 0.45];
  var nx = -Math.sin(a), ny = Math.cos(a);
  pen.beginPath();
  pen.moveTo(root[0], root[1]);
  pen.quadraticCurveTo(mid[0] + nx * wide, mid[1] + ny * wide, tip[0], tip[1]);
  pen.quadraticCurveTo(mid[0] - nx * wide, mid[1] - ny * wide, root[0], root[1]);
  pen.closePath();
  himmaFill(colour, HIMMA.goldLine, 1);
  pen.strokeStyle = HIMMA.goldLine;
  pen.lineWidth = 0.8;
  pen.beginPath(); pen.moveTo(root[0], root[1]); pen.quadraticCurveTo(mid[0], mid[1], tip[0], tip[1]); pen.stroke();
  var eye = [mid[0] + (tip[0] - mid[0]) * 0.55, mid[1] + (tip[1] - mid[1]) * 0.55];
  pen.fillStyle = HIMMA.jewel;
  pen.beginPath(); pen.ellipse(eye[0], eye[1], wide * 0.32, wide * 0.22, a, 0, Math.PI * 2); pen.fill();
}

// A wing spread for gliding, from its root (0, 0) out to the left (behind a figure flying right): coverts in rows and
// long flight feathers, white with buff edges, gilded along its leading edge by the low sun. "lift" (-1 to 1) beats it.
// light: 0 to 1, the gilt on the coverts; size: its scale, 1 about 120 pixels from root to tip. It draws at pen's
// (0, 0), so translate there first. Returns nothing: it draws with pen and leaves its place as it found it.
// e.g. pen.save(); pen.translate(-4, -40); himmaWing(Math.sin(t), 0.6, 1.05); pen.restore();
function himmaWing(lift, light, size) {
  pen.save();
  pen.scale(size, size * (0.55 + 0.45 * Math.cos(lift * 0.9)));
  pen.rotate(-0.35 * lift);
  for (var f = 6; f >= 0; f--) {                     // the long flight feathers, the outer first
    var a = -2.0 - f * 0.12, len = 120 - f * 9;
    pen.beginPath();
    pen.moveTo(-8 - f * 6, -6 + f * 2);
    pen.quadraticCurveTo(Math.cos(a + 0.2) * len * 0.6 - f * 6, Math.sin(a + 0.2) * len * 0.6, Math.cos(a) * len - f * 4, Math.sin(a) * len);
    pen.quadraticCurveTo(Math.cos(a - 0.12) * len * 0.7 - f * 6, Math.sin(a - 0.12) * len * 0.7 + 6, -2 - f * 6, 4 + f * 2);
    pen.closePath();
    himmaFill(f % 2 ? HIMMA.feather : blend(HIMMA.feather, HIMMA.featherDeep, 0.35), HIMMA.featherLine, 1);
  }
  pen.beginPath();                                   // the coverts, over the feathers' roots
  pen.moveTo(4, 0);
  pen.bezierCurveTo(-20, -30, -60, -56, -92, -64);
  pen.bezierCurveTo(-74, -40, -50, -18, -20, 10);
  pen.closePath();
  var wg = pen.createLinearGradient(0, -60, -40, 10);
  wg.addColorStop(0, blend(HIMMA.feather, HIMMA.goldLit, 0.5 * light));
  wg.addColorStop(1, HIMMA.featherDeep);
  himmaFill(wg, HIMMA.featherLine, 1);
  pen.strokeStyle = HIMMA.featherLine;               // the rows of coverts
  pen.lineWidth = 0.9;
  for (var row = 0; row < 3; row++) {
    pen.beginPath();
    for (var k = 0; k < 6; k++) {
      var px = -10 - k * 13 - row * 6, py = -12 - k * 7 + row * 10;
      pen.moveTo(px, py); pen.quadraticCurveTo(px - 4, py + 6, px - 9, py + 4);
    }
    pen.stroke();
  }
  pen.strokeStyle = blend(HIMMA.goldLit, "#ffffff", 0.3);   // gilt along its leading edge
  pen.lineWidth = 2;
  pen.beginPath(); pen.moveTo(4, 0); pen.bezierCurveTo(-20, -30, -60, -56, -92, -64); pen.stroke();
  pen.restore();
}

// A kinnari flying, as the top of this file says, her wings beating slowly (one beat about every 7 seconds): (x, y)
// about the middle of the figure, pixels of the sheet; t: the second; look: its keys are HIMMA_KEYS above, the kinnari
// reading size (1), face (1 or -1), seed (0), scarves and light (0 to 1; 0.6). Returns nothing: it draws with pen and
// leaves pen as it found it.
// e.g. kinnari(1230, 330, t, {size: 1.8, seed: 0.7});
function kinnari(x, y, t, look) {
  look = look || {};
  checkNames("The kinnari's name", look, HIMMA_KEYS);
  var size = look.size || 1, seed = look.seed || 0, light = look.light === undefined ? 0.6 : look.light;
  var beat = Math.sin(t * 0.9 + seed);               // slow, deep beats
  pen.save();
  pen.translate(x, y + 8 * Math.sin(t * 0.5 + seed) * size);
  pen.scale(size * (look.face || 1), size);
  pen.rotate(-0.08 + 0.04 * Math.sin(t * 0.35 + seed));
  pen.lineJoin = "round";
  pen.lineCap = "round";
  pen.save(); pen.translate(-6, -34); himmaWing(beat * 0.8, light * 0.6, 0.95); pen.restore();   // the far wing
  if (look.scarves) { himmaScarves(t, seed, [0, -44], 170); }
  for (var p = 4; p >= 0; p--) {                     // the bird's tail: broad plumes fanned back, each a red eye near its end
    himmaPlume([-24, 28], 3.02 + p * 0.13 + 0.05 * Math.sin(t * 0.8 + p + seed), 100 - p * 9, 9, p % 2 ? HIMMA.gold : HIMMA.goldLit, 0.05 * Math.sin(t * 0.9 + p));
  }
  pen.beginPath();                                   // the bird's body, feathered below the waist
  pen.moveTo(-14, -4);
  pen.bezierCurveTo(-34, 4, -40, 30, -24, 38);
  pen.bezierCurveTo(-4, 44, 18, 34, 20, 14);
  pen.bezierCurveTo(20, 4, 18, -2, 18, -6);
  pen.closePath();
  himmaFill(himmaSkin(-30, 0, 20, 40, light * 0.5), HIMMA.featherLine);
  pen.save(); pen.clip();
  pen.strokeStyle = HIMMA.featherLine; pen.lineWidth = 0.9;   // its feathers, in scales
  for (var row = 0; row < 5; row++) {
    for (var c = 0; c < 6; c++) {
      var sx = -30 + c * 9 + (row % 2) * 4.5, sy = 2 + row * 8;
      pen.beginPath(); pen.arc(sx, sy, 4.5, 0.2, Math.PI - 0.2); pen.stroke();
    }
  }
  pen.restore();
  [[2, 36], [10, 34]].forEach(function (leg, k) {    // the bird's legs, tucked back, the claws curled
    pen.strokeStyle = HIMMA.goldLine; pen.lineWidth = 4;
    pen.beginPath(); pen.moveTo(leg[0], leg[1]); pen.quadraticCurveTo(leg[0] - 10, leg[1] + 12, leg[0] - 22, leg[1] + 14); pen.stroke();
    pen.strokeStyle = HIMMA.gold; pen.lineWidth = 2.4; pen.stroke();
  });
  pen.beginPath();                                   // a gold belt where the woman becomes the bird
  pen.moveTo(-14, -6); pen.quadraticCurveTo(2, 2, 19, -6); pen.lineTo(19, -1); pen.quadraticCurveTo(2, 7, -14, -1);
  pen.closePath();
  himmaFill(HIMMA.gold, HIMMA.goldLine, 1);
  // her body and arms, as the thewada's
  pen.beginPath();
  pen.moveTo(-12, -4);
  pen.bezierCurveTo(-16, -18, -16, -34, -10, -48);
  pen.quadraticCurveTo(2, -56, 14, -52);
  pen.bezierCurveTo(22, -38, 18, -18, 19, -6);
  pen.closePath();
  himmaFill(himmaSkin(-12, -40, 20, 0, light), HIMMA.skinLine);
  pen.beginPath();
  pen.moveTo(-12, -48); pen.quadraticCurveTo(2, -34, 16, -50); pen.lineTo(14, -55); pen.quadraticCurveTo(2, -46, -9, -54);
  pen.closePath();
  himmaFill(HIMMA.gold, HIMMA.goldLine, 1);
  pen.beginPath();                                   // both arms forward, the hands joined before her in greeting
  pen.moveTo(10, -50);
  pen.bezierCurveTo(26, -46, 34, -38, 40, -30);
  pen.quadraticCurveTo(42, -24, 36, -24);
  pen.bezierCurveTo(28, -30, 22, -38, 10, -40);
  pen.closePath();
  himmaFill(himmaSkin(10, -50, 40, -24, light), HIMMA.skinLine);
  himmaHand(38, -27, -0.4, 0.95, light);
  pen.save(); pen.translate(-4, -40); himmaWing(beat, light, 1.05); pen.restore();   // the near wing, from her back
  himmaHead(4, -68, light, 0.06);
  himmaCrown(4, -76, light);
  pen.restore();
}

// A feather as a leaf from its root to its tip, "wide" across, shaded from its root's deep gold to its tip's light.
// root and tip: [x, y], pixels; wide: how far its one side swells (the other 0.7 of that); deep and lit: "#rrggbb"
// colours (blend() reads deep). Returns nothing: it draws with pen.
// e.g. himmaFeather([0, 0], [-60, 10], 13, HIMMA.gold, HIMMA.goldLit);
function himmaFeather(root, tip, wide, deep, lit) {
  var mx = (root[0] + tip[0]) / 2, my = (root[1] + tip[1]) / 2, dx = tip[0] - root[0], dy = tip[1] - root[1];
  var len = Math.hypot(dx, dy) || 1, nx = -dy / len * wide, ny = dx / len * wide;
  pen.beginPath();
  pen.moveTo(root[0], root[1]);
  pen.quadraticCurveTo(mx + nx, my + ny, tip[0], tip[1]);
  pen.quadraticCurveTo(mx - nx * 0.7, my - ny * 0.7, root[0], root[1]);
  pen.closePath();
  var g = pen.createLinearGradient(root[0], root[1], tip[0], tip[1]);
  g.addColorStop(0, deep);
  g.addColorStop(1, lit);
  himmaFill(g, HIMMA.goldLine, 0.9);
  pen.strokeStyle = blend(deep, HIMMA.goldLine, 0.5);   // its shaft
  pen.lineWidth = 0.7;
  pen.beginPath(); pen.moveTo(root[0], root[1]); pen.quadraticCurveTo(mx + nx * 0.15, my + ny * 0.15, tip[0], tip[1]); pen.stroke();
}

// A feather as a bird grows it, the way weaving.js weaves a cloth thread by thread (owner, 2026-10-24: "Look at how you
// did the threads for the cloth then look at the hong bird and see if you can do the wing feathers in a similar way",
// then "Make them look more pristine and beautiful"): a shaft (rachis) from its root to its tip, bowed a little, and
// off it on both sides the barbs, each its own fine line, a little over a pixel apart, swept toward the tip and curving
// evenly as they go; the outer vane narrower than the inner, as a flight feather's is, both tapering to the tip. Under
// them the vane is laid in gold like leaf, so no sky shows through; each barb is a strand over it, as each thread of
// the cloth is, a darker edge and a lit crown, shaded from the root's deep to the tip's light (five shades, so a wing
// of thousands of barbs draws in a few strokes). A sheen lies along the inner vane and drifts slowly, so the feathers
// shimmer as the bird flies; one clean line of ink goes round the vane, and the shaft is gilt. The air moves the
// barbs' ends a little: a wave travels along the feather, a function of the second alone, as the cloth's wind is (a
// film is drawn a frame at a time in any order).
// root and tip: [x, y]; wide: the inner vane's widest, pixels; deep, lit: "#rrggbb"; t: the second; air: 0 still to 1
// (how hard the air works it); seed: a number, its own phase. Returns nothing: it draws with pen.
// e.g. himmaBarbs([0, 0], [-80, 12], 14, HIMMA.gold, HIMMA.goldLit, t, 0.6, 3);
function himmaBarbs(root, tip, wide, deep, lit, t, air, seed) {
  var dx = tip[0] - root[0], dy = tip[1] - root[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
  var cm = [(root[0] + tip[0]) / 2 + nx * wide * 0.15, (root[1] + tip[1]) / 2 + ny * wide * 0.15];   // the shaft's bow
  var count = Math.max(8, Math.round(len / 1.1)), shades = [], edge = [[], []];
  for (var b = 0; b < 5; b++) { shades.push(new Path2D()); }
  for (var k = 1; k < count; k++) {
    var s = k / count, q = 1 - s;
    var px = q * q * root[0] + 2 * q * s * cm[0] + s * s * tip[0], py = q * q * root[1] + 2 * q * s * cm[1] + s * s * tip[1];
    var tx = 2 * q * (cm[0] - root[0]) + 2 * s * (tip[0] - cm[0]), ty = 2 * q * (cm[1] - root[1]) + 2 * s * (tip[1] - cm[1]);
    var tl = Math.hypot(tx, ty) || 1;
    tx /= tl; ty /= tl;
    var vane = Math.sin(Math.PI * Math.pow(s, 0.72));
    for (var side = 0; side < 2; side++) {
      var sign = side ? -1 : 1, L = wide * vane * (side ? 0.6 : 1.05);
      var ox = -ty * sign + tx * 0.75, oy = tx * sign + ty * 0.75, ol = Math.hypot(ox, oy);
      ox /= ol; oy /= ol;
      var wave = (air || 0) * L * 0.1 * s * Math.sin(2 * Math.PI * s * 1.6 - (t || 0) * 5 + (seed || 0) + side * 1.1);
      var ex = px + ox * L - ty * wave, ey = py + oy * L + tx * wave;
      var mx = px + ox * L * 0.5 + tx * L * 0.14, my = py + oy * L * 0.5 + ty * L * 0.14;   // each barb curves toward the tip
      var shade = Math.min(4, Math.floor((s * 0.62 + (side ? 0.04 : 0.2)) * 5));
      shades[shade].moveTo(px, py);
      shades[shade].quadraticCurveTo(mx, my, ex, ey);
      edge[side].push([ex, ey]);
    }
  }
  var vanePath = new Path2D();                                         // the vane's edge, one smooth line round it
  function along(path, line) {
    for (var n = 0; n < line.length - 1; n++) {
      path.quadraticCurveTo(line[n][0], line[n][1], (line[n][0] + line[n + 1][0]) / 2, (line[n][1] + line[n + 1][1]) / 2);
    }
  }
  vanePath.moveTo(root[0], root[1]);
  along(vanePath, edge[0]);
  vanePath.lineTo(tip[0], tip[1]);
  along(vanePath, edge[1].slice().reverse());
  vanePath.closePath();
  var leaf = pen.createLinearGradient(root[0], root[1], tip[0], tip[1]);   // the gold under the barbs
  leaf.addColorStop(0, deep);
  leaf.addColorStop(1, blend(deep, lit, 0.85));
  pen.fillStyle = leaf;
  pen.fill(vanePath);
  shades.forEach(function (path, n) {
    var colour = blend(deep, lit, n / 4 * 0.9);
    pen.lineWidth = 1.05;
    pen.strokeStyle = blend(colour, HIMMA.goldLine, 0.12);          // the barb's edge
    pen.stroke(path);
    pen.lineWidth = 0.45;
    pen.strokeStyle = blend(colour, HIMMA.goldLit, 0.55);           // and its lit crown
    pen.stroke(path);
  });
  pen.save();                                                          // the sheen along the inner vane, drifting
  pen.clip(vanePath);
  var drift = 0.38 + 0.1 * Math.sin((t || 0) * 0.9 + (seed || 0));
  var sheen = new Path2D();
  sheen.moveTo(root[0] + nx * wide * drift * 0.5, root[1] + ny * wide * drift * 0.5);
  sheen.quadraticCurveTo(cm[0] + nx * wide * drift, cm[1] + ny * wide * drift, tip[0], tip[1]);
  pen.lineCap = "round";
  pen.strokeStyle = "rgba(255, 248, 222, 0.22)";
  pen.lineWidth = wide * 0.6;
  pen.stroke(sheen);
  pen.strokeStyle = "rgba(255, 252, 238, 0.32)";
  pen.lineWidth = wide * 0.16;
  pen.stroke(sheen);
  pen.restore();
  pen.strokeStyle = HIMMA.goldLine;                                    // one clean line of ink round the vane
  pen.lineWidth = 0.9;
  pen.stroke(vanePath);
  pen.lineWidth = 1.1;                                                 // the shaft, gilt
  pen.beginPath(); pen.moveTo(root[0], root[1]); pen.quadraticCurveTo(cm[0], cm[1], tip[0], tip[1]); pen.stroke();
  pen.strokeStyle = blend(HIMMA.goldLit, "#fffaf0", 0.5);
  pen.lineWidth = 0.55;
  pen.stroke();
}

// The hong's wing from its shoulder (0, 0), seen from the side as it beats: long primaries fanned from the wrist, the
// secondaries along the trailing edge, rows of scalloped coverts over the arm, gilt along the leading edge. "up" (-1
// down to 1 up) is where the stroke is, "rate" how fast it is rising (+) or falling (-). The arm swings about the
// shoulder and is seen shorter as it comes toward us; the hand bends at the wrist and trails the stroke, higher than
// the arm on the way down and lower on the way up; the primaries spread on the downstroke and close on the upstroke;
// the secondaries always trail back (owner, 2026-10-21: "Make the golden bird's wing flap like a natural wing instead
// of rotating"). "far" darkens it. Its primaries and secondaries are barbed feathers (himmaBarbs), worked by the air
// in proportion to how fast the wing moves.
// up: -1 to 1; rate: about -1 to 1; light: 0 to 1; far: true for the wing behind the body; t: the second (the air in
// the feathers; left out, they are still). It draws at pen's (0, 0).
// Returns nothing: it draws with pen and leaves its place as it found it.
// e.g. hongWing(Math.sin(t), Math.cos(t), 0.6, false, t);
function hongWing(up, rate, light, far, t) {
  var air = t === undefined ? 0 : 0.35 + 0.65 * Math.min(1, Math.abs(rate));   // the air through the feathers
  var deep = far ? blend(HIMMA.gold, HIMMA.goldLine, 0.45) : blend(HIMMA.gold, HIMMA.goldLine, 0.2);
  var lit = far ? HIMMA.gold : blend(HIMMA.goldLit, "#fff6dc", 0.4 * light);
  var arm = 0.2 + 0.85 * up;                         // the arm's angle above level, -0.65 to 1.05
  var hand = arm - 0.45 * rate;                      // the hand trails the stroke
  var spread = 0.13 + 0.07 * Math.max(0, -rate);     // the primaries part on the downstroke
  pen.save();
  var wrist = [-28, -80 * Math.sin(arm)];
  for (var s = 6; s >= 0; s--) {                     // the secondaries, the inner first, trailing back from the arm
    var u = s / 6, root = [mix(-6, wrist[0] + 6, u), mix(-4, wrist[1] * 0.92, u)], len = 54 - 10 * u;
    himmaBarbs(root, [root[0] - len * 0.93, root[1] + len * 0.12 + 6], 13, deep, lit, t, air * 0.7, s + (far ? 20 : 0));
  }
  for (var f = 5; f >= 0; f--) {                     // the primaries, fanned from the wrist, broad and overlapping
    var phi = 0.2 + f * spread, plen = 90 - f * 6, root = [wrist[0] * (1 + 0.06 * f) + f * 2, wrist[1] * (1 - 0.06 * f)];
    himmaBarbs(root, [root[0] - plen * (0.3 + 0.7 * Math.sin(phi)), root[1] - plen * Math.cos(phi) * Math.sin(hand)], 15, deep, lit, t, air, 10 + f + (far ? 20 : 0));
  }
  var lead = [wrist[0] * 0.4 + 8, wrist[1] * 0.6 - 4];   // the leading edge's bow, forward of the line to the wrist
  pen.beginPath();                                   // the coverts over the arm
  pen.moveTo(6, 4);
  pen.quadraticCurveTo(lead[0], lead[1], wrist[0] - 4, wrist[1]);
  pen.lineTo(wrist[0] - 20, wrist[1] + 4);
  pen.quadraticCurveTo(-34, wrist[1] * 0.5 + 8, -20, 14);
  pen.closePath();
  var cg = pen.createLinearGradient(0, 0, wrist[0], wrist[1]);
  cg.addColorStop(0, deep);
  cg.addColorStop(1, lit);
  himmaFill(cg, HIMMA.goldLine, 1);
  pen.save();
  pen.clip();
  pen.strokeStyle = HIMMA.goldLine;                  // the scallops of the coverts, in rows
  pen.lineWidth = 0.8;
  for (var row = 0; row < 4; row++) {
    for (var k = 0; k < 7; k++) {
      var v = k / 6, cx = mix(-2, wrist[0] + 2, v) - row * 6, cy = mix(2, wrist[1] + 3, v) + row * 3;
      pen.beginPath(); pen.arc(cx, cy, 5.2, 0.3, Math.PI - 0.3); pen.stroke();
    }
  }
  pen.restore();
  pen.strokeStyle = blend(HIMMA.goldLit, "#ffffff", 0.35 + 0.3 * light);   // gilt along the leading edge
  pen.lineWidth = 2.2;
  pen.beginPath(); pen.moveTo(6, 4); pen.quadraticCurveTo(lead[0], lead[1], wrist[0] - 4, wrist[1]); pen.stroke();
  pen.restore();
}

var HONG_BEAT = 1.35;                                // seconds of one of a soaring hong's few beats (look.beats; 1.1 until
                                                     // 2026-10-24, owner: "Slow the wing beat down just a bit")
// The hong's spine, from the head back to the root of its tail, as the bird is drawn flying level to the right: the
// head, four joints down the neck's S, its root at the breast, the middle of the body, the root of the tail. The neck's
// width at each of its joints (the head's end first).
var HONG_SPINE = [[93, -56], [82, -58], [72, -46], [67, -30], [60, -12], [46, 2], [0, 4], [-60, 6]];
var HONG_NECK = [9, 12, 15, 18, 22, 28];
var HONG_AIR = 60;                                   // how fast it flies through the air, drawn pixels a second
var HONG_BEND = Math.PI / 10;                        // the most one joint turns from the one in front

// The way each joint of the hong's spine faces, by the rule of procedural_animation.html, as nagaChain's: the head
// leads, each joint turns to face the one in front, no more than HONG_BEND from it, and keeps its own gap behind it.
// The head flies on at HONG_AIR and rises and falls as "rise" says (in drawn pixels, a function of the time). A chain
// remembers where it has been and a film must not, so the chain is laid out straight as it was four seconds ago and
// led from then until now, in every frame. Returns the angle each joint faces (0 is level, to the right).
// rise: a function of the second giving the head's height, drawn pixels; t: the second. Returns HONG_SPINE.length
// angles in radians, the head's first. It changes nothing outside itself; each call leads the chain 120 steps.
// e.g. var angles = hongChain(function (s) { return 6 * Math.sin(s * 0.45); }, t);
function hongChain(rise, t) {
  var STEPS = 120, gaps = [], points = [], angles = [], n;
  for (n = 1; n < HONG_SPINE.length; n++) {
    gaps.push(Math.hypot(HONG_SPINE[n][0] - HONG_SPINE[n - 1][0], HONG_SPINE[n][1] - HONG_SPINE[n - 1][1]));
  }
  function was(ago) { return [-HONG_AIR * ago / 30, rise(t - ago / 30)]; }   // where the head was, ago thirtieths back
  var first = was(STEPS), next = was(STEPS - 1), facing = Math.atan2(next[1] - first[1], next[0] - first[0]);
  points.push(first);
  angles.push(facing);
  for (n = 1; n < HONG_SPINE.length; n++) {
    points.push([points[n - 1][0] - Math.cos(facing) * gaps[n - 1], points[n - 1][1] - Math.sin(facing) * gaps[n - 1]]);
    angles.push(facing);
  }
  for (var ago = STEPS - 1; ago >= 0; ago--) {
    var head = was(ago);
    angles[0] = Math.atan2(head[1] - points[0][1], head[0] - points[0][0]);   // it faces the way it flies
    points[0] = head;
    for (n = 1; n < HONG_SPINE.length; n++) {
      var away = Math.atan2(points[n - 1][1] - points[n][1], points[n - 1][0] - points[n][0]) - angles[n - 1];
      away -= Math.PI * 2 * Math.round(away / (Math.PI * 2));               // the short way round
      angles[n] = angles[n - 1] + Math.max(-HONG_BEND, Math.min(HONG_BEND, away));
      points[n] = [points[n - 1][0] - Math.cos(angles[n]) * gaps[n - 1], points[n - 1][1] - Math.sin(angles[n]) * gaps[n - 1]];
    }
  }
  return angles;
}

// The hong flying, about the middle of its body, to the right (look.face -1 left). Its spine moves as
// procedural_animation.html's does (owner, 2026-10-21: "Can you use the spine logic from procedural_animation on the
// bird so it's neck and head and body move more fluidly?"): the head leads and the neck and body follow it a joint at
// a time (hongChain), so as it rises the head tips up first, then the neck bends, then the body comes round; each
// piece of the drawing turns with its joint, so the S of the neck is kept. The wings lift the body under a steady
// head, so the neck flexes with every beat.
// (x, y): pixels of the sheet; t: the second; look: its keys are HIMMA_KEYS above, the hong reading size (1, as the
// top of this file says), face (1 or -1), seed (0), light (0 to 1; 0.6), soar, beats ([second, how many], with soar;
// HONG_BEAT seconds each) and trail (a function of the second giving [x, y], the path the page moves it on; only its
// y is read, for the rise) and level (true: the head and body held still and level, only the wings beating; owner,
// 2026-10-24: "I don't want it to tilt to the side. Just the wings going up and down"). Returns nothing: it draws with
// pen and leaves pen as it found it.
// e.g. hongFlight(1660, 300, t, {size: 1.6, seed: 2.1, soar: true, beats: [3, 2]});
function hongFlight(x, y, t, look) {
  look = look || {};
  checkNames("The hong's name", look, HIMMA_KEYS);
  var size = look.size || 1, seed = look.seed || 0, light = look.light === undefined ? 0.6 : look.light;
  function beating(t) {                              // [where the wings are, how fast they rise] at second t
    var beat = Math.sin(t * 0.85 + seed);            // slow deep beats, now and then a glide (the wings held up)
    var glide = Math.max(0, Math.sin(t * 0.21 + seed * 1.7));
    var rate = Math.cos(t * 0.85 + seed) * (1 - 0.8 * glide);  // rising (+) or falling (-)
    beat = beat * (1 - 0.8 * glide) + 0.35 * glide;
    if (look.soar) {                                 // soaring (owner, 2026-10-21: "Have the golden bird just soar and
      beat = 0.6 + 0.04 * Math.sin(t * 0.5 + seed);  // glide without flapping"): the wings held out and up in a V,
      rate = 0.12 * Math.sin(t * 0.7 + seed);        // only the hands flexing slowly as it rides the air
      var b = look.beats ? (t - look.beats[0]) / HONG_BEAT : -1;   // then "Actually have it beat it's wings just two
      if (b > 0 && b < look.beats[1]) {              // or three times": each beat down first and back up through the
        var ph = b * 2 * Math.PI, ease = Math.min(1, b * 4, (look.beats[1] - b) * 4);   // soaring pose, so none jumps
        beat -= Math.sin(ph) * (ph < Math.PI ? 1.4 : 0.6);   // down below the belly, back up over the back
        rate = rate * (1 - ease) - ease * Math.cos(ph);
      }
    }
    return [beat, rate];
  }
  var wings = beating(t), beat = wings[0], rate = wings[1];
  var trail = look.trail, now = trail ? trail(t)[1] : 0;
  function rise(s) {                                 // the head's height at second s, drawn pixels: its slow bob, and
    if (look.level) { return 0; }                    // the film's path, eased (none for a level bird)
    return 6 * Math.sin(s * 0.45 + seed) + (trail ? (trail(s)[1] - now) * 0.6 / size : 0);
  }
  var angles = hongChain(rise, t), spine = [[HONG_SPINE[0][0], HONG_SPINE[0][1] + rise(t)]];
  var lift = [0, 0.15, 0.35, 0.55, 0.75, 1, 1, 1];   // how much of the body's lift on the wings each joint takes
  for (var j = 1; j < HONG_SPINE.length; j++) {      // each piece of the drawing turned by its joint's angle
    var dx = HONG_SPINE[j][0] - HONG_SPINE[j - 1][0], dy = HONG_SPINE[j][1] - HONG_SPINE[j - 1][1], a = angles[j];
    spine.push([spine[j - 1][0] + dx * Math.cos(a) - dy * Math.sin(a), spine[j - 1][1] + dx * Math.sin(a) + dy * Math.cos(a)]);
  }
  if (!look.level) {                                 // the body lifts as the wings come down
    spine = spine.map(function (q, k) { return [q[0], q[1] - 4 * beat * lift[k]]; });
  }
  function onJoint(k) {                              // draw from here in the drawing's own place, turned with joint k
    pen.translate(spine[k][0], spine[k][1]);
    pen.rotate(angles[k]);
    pen.translate(-HONG_SPINE[k][0], -HONG_SPINE[k][1]);
  }
  pen.save();
  pen.translate(x, y);
  pen.scale(size * (look.face || 1), size);
  pen.lineJoin = "round";
  pen.lineCap = "round";
  pen.save(); onJoint(6); pen.translate(-6, -14 + 30 * Math.max(0, -beat));   // the far wing: the near one as the other side
  hongWing(beat, rate, light, true, t); pen.restore();   // of the body shows it from the side, the same stroke, a shade darker:
  // a little behind and above the near one as they rise, and sinking behind the body as they come down, so the body hides
  // it there (owner, 2026-10-24: "The wings should flap in unison", "The birds body should stay straight. The wings should
  // go up and down", "The backside wing looks like it's falling to the near side of the bird rather than the far side";
  // a far wing flipped to go down as the near one goes up made the bird look banked over)
  pen.save(); onJoint(7);                            // the tail, on the last joint: it comes round after the body
  for (var p = 4; p >= 0; p--) {                     // five plumes curling back and up like a flame (kranok)
    himmaPlume([-62, 6], 3.25 + p * 0.17, 82 - p * 7, 11, p % 2 ? HIMMA.gold : blend(HIMMA.goldLit, HIMMA.gold, 0.3),
               -0.55 + 0.07 * Math.sin(t * 0.9 + p + seed));
  }
  pen.restore();
  pen.save(); onJoint(6);
  pen.beginPath();                                   // the body: a full breast, the back, the belly
  pen.moveTo(-66, 4);
  pen.bezierCurveTo(-46, -14, -4, -18, 30, -10);
  pen.bezierCurveTo(52, -6, 60, 4, 54, 14);
  pen.bezierCurveTo(40, 26, 0, 26, -36, 20);
  pen.bezierCurveTo(-52, 18, -64, 12, -66, 4);
  pen.closePath();
  var bg = pen.createLinearGradient(0, -18, 0, 26);
  bg.addColorStop(0, blend(HIMMA.gold, HIMMA.goldLit, 0.35 + 0.5 * light));
  bg.addColorStop(1, blend(HIMMA.gold, HIMMA.goldLine, 0.25));
  himmaFill(bg, HIMMA.goldLine, 1.3);
  pen.save();
  pen.clip();
  pen.strokeStyle = HIMMA.goldLine;                  // the small feathers of the breast and belly, in rows
  pen.lineWidth = 0.7;
  for (var row = 0; row < 5; row++) {
    for (var c = 0; c < 10; c++) {
      pen.beginPath(); pen.arc(-50 + c * 11 + (row % 2) * 5.5, -8 + row * 7, 4.2, 0.25, Math.PI - 0.25); pen.stroke();
    }
  }
  pen.restore();
  pen.restore();
  hongNeck(spine, light);
  pen.save(); onJoint(0);
  pen.beginPath();                                   // the head
  pen.ellipse(94, -56, 10, 8.5, -0.2, 0, Math.PI * 2);
  himmaFill(blend(HIMMA.gold, HIMMA.goldLit, 0.45 + 0.4 * light), HIMMA.goldLine, 1.2);
  pen.beginPath();                                   // the crest: a flame of three curls swept back (kranok)
  pen.moveTo(92, -63);                              // slim, long, curling up at its end
  pen.bezierCurveTo(78, -70, 58, -70, 44, -78);
  pen.quadraticCurveTo(38, -84, 44, -88);
  pen.quadraticCurveTo(46, -80, 54, -76);
  pen.bezierCurveTo(48, -72, 44, -68, 42, -64);
  pen.bezierCurveTo(56, -66, 72, -62, 86, -57);
  pen.closePath();
  himmaFill(HIMMA.gold, HIMMA.goldLine, 1);
  pen.beginPath();                                   // the beak, a little curved, red with a gold base
  pen.moveTo(101, -59);
  pen.quadraticCurveTo(112, -60, 120, -54);
  pen.quadraticCurveTo(110, -52, 101, -52);
  pen.closePath();
  himmaFill(HIMMA.jewel, blend(HIMMA.jewel, "#000000", 0.4), 1);
  pen.strokeStyle = HIMMA.goldLit; pen.lineWidth = 1.6;
  pen.beginPath(); pen.moveTo(101, -59); pen.lineTo(101, -52); pen.stroke();
  pen.fillStyle = HIMMA.goldLit;                     // the eye, in a ring of gold
  pen.beginPath(); pen.arc(95, -58, 2.8, 0, Math.PI * 2); pen.fill();
  pen.fillStyle = HIMMA.brow;
  pen.beginPath(); pen.arc(95.5, -58, 1.5, 0, Math.PI * 2); pen.fill();
  pen.restore();
  pen.save(); onJoint(6); pen.translate(8, -8); hongWing(beat, rate, light, false, t); pen.restore();   // the near wing
  pen.restore();
}

// The hong's neck through the first six joints of its spine (the head's end first), as wide as HONG_NECK says at
// each: a smooth band, gold deepening down to the breast, its fine feathers in ticks, the jewelled collar at its root.
// spine: [[x, y], ...], at least six joints, drawn pixels (hongFlight()'s, turned and lifted); light: 0 to 1.
// Returns nothing: it draws with pen.
// e.g. hongNeck(spine, 0.6);
function hongNeck(spine, light) {
  var left = [], right = [], n, last = HONG_NECK.length - 1;
  for (n = 0; n <= last; n++) {                      // each joint's two edges, across the way the neck runs there
    var a = spine[Math.max(0, n - 1)], b = spine[Math.min(last, n + 1)];
    var run = Math.atan2(b[1] - a[1], b[0] - a[0]), w = HONG_NECK[n] / 2;
    left.push([spine[n][0] + Math.sin(run) * w, spine[n][1] - Math.cos(run) * w]);
    right.push([spine[n][0] - Math.sin(run) * w, spine[n][1] + Math.cos(run) * w]);
  }
  function edge(side, from, to, step) {              // a smooth curve through one edge's points
    for (var k = from; k !== to; k += step) {
      var q = side[k], r = side[k + step];
      pen.quadraticCurveTo(q[0], q[1], (q[0] + r[0]) / 2, (q[1] + r[1]) / 2);
    }
    pen.lineTo(side[to][0], side[to][1]);
  }
  pen.beginPath();
  pen.moveTo(left[last][0], left[last][1]);
  edge(left, last, 0, -1);                           // up the front, over the top under the head, down the back
  pen.lineTo(right[0][0], right[0][1]);
  edge(right, 0, last, 1);
  pen.closePath();
  var ng = pen.createLinearGradient(spine[last][0], spine[last][1], spine[0][0], spine[0][1]);
  ng.addColorStop(0, HIMMA.gold);
  ng.addColorStop(1, blend(HIMMA.gold, HIMMA.goldLit, 0.4 + 0.5 * light));
  himmaFill(ng, HIMMA.goldLine, 1.2);
  pen.strokeStyle = HIMMA.goldLine;                  // its fine feathers, in ticks down the neck
  pen.lineWidth = 0.7;
  for (n = 1; n < last; n++) {
    for (var h = 0; h < 2; h++) {
      var u = h / 2, cx = mix(spine[n][0], spine[n + 1][0], u), cy = mix(spine[n][1], spine[n + 1][1], u);
      var run2 = Math.atan2(spine[n + 1][1] - spine[n][1], spine[n + 1][0] - spine[n][0]);
      pen.save(); pen.translate(cx, cy); pen.rotate(run2 + Math.PI / 2);
      pen.beginPath(); pen.moveTo(-4, 0); pen.quadraticCurveTo(0, 3, 4, -1); pen.stroke();
      pen.restore();
    }
  }
  var c0 = mix(left[last - 1][0], left[last][0], 0.6), c1 = mix(left[last - 1][1], left[last][1], 0.6);
  var d0 = mix(right[last - 1][0], right[last][0], 0.6), d1 = mix(right[last - 1][1], right[last][1], 0.6);
  var m0 = mix(spine[last - 1][0], spine[last][0], 0.6), m1 = mix(spine[last - 1][1], spine[last][1], 0.6);
  pen.strokeStyle = HIMMA.jewel;                     // the jewelled collar at the neck's root: red, with gold beads
  pen.lineWidth = 3;
  pen.beginPath(); pen.moveTo(c0, c1); pen.quadraticCurveTo(m0 + (m0 - (c0 + d0) / 2), m1 + (m1 - (c1 + d1) / 2), d0, d1); pen.stroke();
  pen.fillStyle = HIMMA.goldLit;
  [0.25, 0.5, 0.75].forEach(function (u) {
    var bx = mix(mix(c0, m0, u), mix(m0, d0, u), u), by = mix(mix(c1, m1, u), mix(m1, d1, u), u);
    pen.beginPath(); pen.arc(bx, by, 1.4, 0, Math.PI * 2); pen.fill();
  });
}
