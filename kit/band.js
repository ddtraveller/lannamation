// The band of the north for the Lanna cartoon kit: the salo, the sueng, the
// pi chum and the phin phia, and a musician who sits on the floor and plays
// one of them on the beat. Load this file after oldcartoon.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="band.js"></script>
//
// Each instrument is a painter on the kit's sheet, "pen": salo(x, y, size,
// angle) and the rest, drawn from (x, y) along "angle" (radians; 0 points to
// the right, -Math.PI / 2 straight up), so one can lie on a mat or stand
// against a post. musician(x, y, kind, look, late) seats a person at (x, y)
// with one in their hands, as person(x, y, look) stands one, and gives back
// where person() drew the joints.
//
// What each one is, from what is written of it (the NotebookLM notebook
// "Lanna material culture", 2026-10-16: Wikipedia on the salo and the sueng,
// the ThaiJO papers on the phin phia and on a Lanna music teacher, Hotsia on
// the salo-so-sueng band) and the photographs it was read from (Wikimedia
// Commons, free licences; nothing copied, only what they show):
//   salo       a spike fiddle of two or three wire strings: a coconut shell
//              for a body with a thin wooden plate over its face, a turned
//              spike under it, a long dark neck through it, two great pegs
//              near the top and a turned spire at the end; a cord binds the
//              strings to the neck below the pegs. The bow is apart from the
//              strings, an arched stick with its hair outside them; the
//              player tilts the fiddle to bring one string or the other to
//              it. Read from Jiranee119's photograph (CC BY-SA 4.0, File:สะล้อ
//              ทรงสะหรีกญไชย.jpg) and Purinee Donchai's drawing of its ten
//              parts (CC0, File:Salo Thai instrument component parts.png).
//   sueng      a plucked lute shaped like a paddle, carved from one piece of
//              jackfruit or teak: a round body with a plate glued over it, a
//              sound hole, a bridge below it, a carved point under the body,
//              nine frets of bamboo up the neck, four strings in two pairs,
//              a flat carved head with its pegs; played with a long pick of
//              horn. Its plate is often worked in gold and red round the
//              hole. Read from the Chiang Mai artisan's sueng photographed by
//              Leopoldoghost (CC BY-SA 4.0, File:Lai Thai decorations on
//              Sueng.jpg) and a wall of them (CC BY 2.0, File:Seung.jpg).
//   piChum     a straight pipe of bamboo with a free reed of metal near its
//              top, which the player holds whole inside the mouth (and
//              breathes round, so the note does not stop); finger holes down
//              its front; no bend and no gourd. Made in five sizes, played in
//              threes to fives behind the singing. No free photograph of one
//              was found: the hold is read from a band of the Laplae people
//              playing a straight pipe (CC BY-SA 3.0, File:Traditional Laplae
//              folk music 2.JPG): down and forward from the mouth, both hands
//              on it.
//   phinPhia   a long stick of hardwood with a half coconut on a short post
//              under it, a quarter of the way from the pegs; the far end
//              bent into a curl, often carved, capped in metal; two to seven
//              strings. Played by a man with no shirt: the open coconut is
//              pressed to the left of his bare chest and moved on it to open
//              and close the sound, the neck points down, the left forefinger
//              stops the strings and the nail of the right little finger
//              plucks them. Read from a phin phia of the 19th century at the
//              Metropolitan Museum (CC0, File:Phin phia, Thailand, 19th
//              century.jpg).
//
// The players sit on the floor, cross-legged, as the band of the Laplae
// people does, and as the north's players do at a meal or a feast.
var BAND_KINDS = ["salo", "sueng", "pichum", "phinphia"];

var BAND_WOOD = "#6e2f1f", BAND_DARK = "#3e1d12", BAND_SHELL = "#5a3a22", BAND_PLATE = "#c99a5c",
    BAND_STRING = "rgba(235, 232, 220, 0.9)", BAND_BAMBOO = "#cfa95c", BAND_GOLD = "#e0b23a";

// Fill the path the pen holds, and ink it in a darker line of its own colour.
function bandFill(colour, width) {
  pen.fillStyle = colour;
  pen.fill();
  pen.strokeStyle = inkFor(colour);
  pen.lineWidth = width || 1.6;
  pen.lineJoin = "round";
  pen.stroke();
}

// A turned piece: a solid of round section along u, from u0 to u1, with the
// half-widths "halves" spread evenly along it (a spike, a spire, a peg).
function bandTurned(u0, u1, halves, colour) {
  var n = halves.length - 1, k;
  pen.beginPath();
  for (k = 0; k <= n; k++) { pen.lineTo(mix(u0, u1, k / n), -halves[k]); }
  for (k = n; k >= 0; k--) { pen.lineTo(mix(u0, u1, k / n), halves[k]); }
  pen.closePath();
  bandFill(colour, 1.2);
}

// Strings: "count" fine lines from u0 to u1, "gap" apart about the middle.
function bandStrings(u0, u1, count, gap) {
  pen.strokeStyle = BAND_STRING;
  pen.lineWidth = 0.9;
  pen.beginPath();
  for (var k = 0; k < count; k++) {
    var v = (k - (count - 1) / 2) * gap;
    pen.moveTo(u0, v);
    pen.lineTo(u1, v);
  }
  pen.stroke();
}

function bandFrame(x, y, size, angle) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(angle || 0);
  pen.scale(size || 1, size || 1);
}

// The salo, from the tip of its spike at (x, y) along "angle"; 214 long at size 1.
function salo(x, y, size, angle) {
  bandFrame(x, y, size, angle);
  bandTurned(0, 22, [0.6, 2, 2.6, 4.2, 3, 4.6, 5], BAND_DARK);           // the spike, turned, with two beads
  pen.beginPath();                                                      // the neck, through the body to the spire
  pen.moveTo(24, -4.2);
  pen.lineTo(186, -3.4);
  pen.lineTo(186, 3.4);
  pen.lineTo(24, 4.2);
  pen.closePath();
  bandFill(BAND_WOOD, 1.2);
  pen.fillStyle = "#a8603e";                                            // two pale rings on it
  pen.fillRect(64, -4, 2.5, 8);
  pen.fillRect(140, -3.6, 2.5, 7.2);
  pen.beginPath();                                                      // the coconut, a shell striped dark
  pen.arc(38, 0, 16.5, 0, 7);
  bandFill(BAND_SHELL, 1.4);
  pen.strokeStyle = "rgba(30, 16, 8, 0.45)";
  pen.lineWidth = 1;
  pen.beginPath();
  for (var k = -2; k <= 2; k++) { pen.moveTo(24 + 3 * Math.abs(k), k * 6.5); pen.quadraticCurveTo(38, k * 7.5, 52 - 3 * Math.abs(k), k * 6.5); }
  pen.stroke();
  pen.beginPath();                                                      // the plate over its face
  pen.ellipse(38, 0, 12.5, 12, 0, 0, 7);
  bandFill(BAND_PLATE, 1);
  pen.fillStyle = BAND_DARK;                                            // the bridge
  pen.fillRect(33, -3.2, 3, 6.4);
  bandStrings(35, 172, 2, 2.2);                                          // two strings to the pegs
  pen.fillStyle = "#e8c870";                                            // the cord that binds them below the pegs
  pen.fillRect(150, -4.6, 5, 9.2);
  pen.strokeStyle = "#a8873a";
  pen.lineWidth = 0.8;
  pen.beginPath();
  pen.moveTo(151.6, -4.6); pen.lineTo(151.6, 4.6);
  pen.moveTo(153.4, -4.6); pen.lineTo(153.4, 4.6);
  pen.stroke();
  [[163, -1], [176, 1]].forEach(function (peg) {                        // the two great pegs, one to each side
    pen.save();
    pen.translate(peg[0], 0);
    pen.rotate(peg[1] * Math.PI / 2);
    bandTurned(0, 15, [1.6, 1.8, 2.4], BAND_DARK);
    pen.beginPath();
    pen.ellipse(19, 0, 5.5, 7, 0, 0, 7);
    bandFill(BAND_DARK, 1);
    pen.restore();
  });
  bandTurned(186, 214, [4.4, 6, 5.2, 3.2, 4.4, 2.4, 1.2, 0.3], BAND_WOOD); // the spire
  pen.restore();
}

// The salo's bow, from its frog at (x, y) along "angle"; 190 long. The stick
// arches to the side of +90 degrees from "angle", the hair runs straight.
function saloBow(x, y, size, angle) {
  bandFrame(x, y, size, angle);
  pen.lineCap = "round";
  pen.strokeStyle = "#efe6cf";                                          // the hair
  pen.lineWidth = 1.6;
  pen.beginPath();
  pen.moveTo(4, 0);
  pen.lineTo(186, 0);
  pen.stroke();
  pen.strokeStyle = BAND_DARK;                                          // the stick, arched, as thick as a finger
  pen.lineWidth = 3.4;
  pen.beginPath();
  pen.moveTo(0, 0);
  pen.quadraticCurveTo(95, 18, 190, 2);
  pen.stroke();
  pen.fillStyle = "#efe6cf";                                            // the tail of hair tied at its tip
  pen.beginPath();
  pen.moveTo(188, 1);
  pen.quadraticCurveTo(196, -4, 202, -10);
  pen.quadraticCurveTo(197, -2, 192, 4);
  pen.closePath();
  pen.fill();
  pen.restore();
}

// The sueng, with the middle of its round body at (x, y) and its neck along
// "angle"; 190 long, the body 60 across, at size 1.
function sueng(x, y, size, angle) {
  bandFrame(x, y, size, angle);
  pen.beginPath();                                                      // the neck and the carved head
  pen.moveTo(20, -6.5);
  pen.lineTo(108, -5);
  pen.quadraticCurveTo(116, -13, 128, -11);
  pen.quadraticCurveTo(136, -8, 142, 0);
  pen.quadraticCurveTo(136, 8, 128, 11);
  pen.quadraticCurveTo(116, 13, 108, 5);
  pen.lineTo(20, 6.5);
  pen.closePath();
  bandFill("#8a4a26", 1.3);
  pen.strokeStyle = "#e6d3a8";                                          // nine frets of bamboo, closer as they climb
  pen.lineWidth = 1.8;
  pen.beginPath();
  for (var k = 0; k < 9; k++) {
    var u = 102 - 70 * Math.pow(0.9, k * 1.2);
    pen.moveTo(u, -6);
    pen.lineTo(u, 6);
  }
  pen.stroke();
  [-1, 1].forEach(function (side) {                                     // four pegs, two to a side
    [116, 128].forEach(function (u) {
      pen.beginPath();
      pen.moveTo(u - 1.5, side * 9);
      pen.lineTo(u - 2, side * 19);
      pen.lineTo(u + 2.4, side * 19);
      pen.lineTo(u + 1.5, side * 9);
      pen.closePath();
      bandFill(BAND_DARK, 0.9);
    });
  });
  pen.beginPath();                                                      // the body, and the carved point under it
  pen.arc(0, 0, 30, -1.25, 1.25, true);
  pen.lineTo(-38, 7);
  pen.lineTo(-49, 0);
  pen.lineTo(-38, -7);
  pen.closePath();
  bandFill("#9a5a2e", 1.5);
  pen.beginPath();                                                      // the plate glued over it
  pen.arc(0, 0, 25, 0, 7);
  bandFill("#b8783e", 1);
  pen.fillStyle = "#c8432e";                                            // a flower in red and gold round the hole
  pen.beginPath();
  for (k = 0; k < 16; k++) {
    var a = k * Math.PI / 8, r = k % 2 ? 9.5 : 14;
    pen.lineTo(8 + Math.cos(a) * r, Math.sin(a) * r);
  }
  pen.closePath();
  pen.fill();
  pen.strokeStyle = BAND_GOLD;
  pen.lineWidth = 1.2;
  pen.stroke();
  pen.fillStyle = "#2a160c";                                            // the hole
  pen.beginPath();
  pen.arc(8, 0, 6.5, 0, 7);
  pen.fill();
  pen.fillStyle = "#efe2c0";                                            // the bridge, below the hole
  pen.fillRect(-14, -8, 3, 16);
  bandStrings(-12.5, 118, 4, 2.3);                                       // four strings, in two pairs
  pen.restore();
}

// The sueng's pick, a long thin blade of horn, held at (x, y) along "angle".
function suengPick(x, y, size, angle) {
  bandFrame(x, y, size, angle);
  pen.beginPath();
  pen.moveTo(-4, -2.2);
  pen.lineTo(18, -1);
  pen.lineTo(22, 0);
  pen.lineTo(18, 1);
  pen.lineTo(-4, 2.2);
  pen.closePath();
  bandFill("#e8d9b4", 0.8);
  pen.restore();
}

// The pi chum, from the end that goes in the mouth at (x, y) along "angle";
// 126 long at size 1 (the middle of its five sizes; size scales it).
function piChum(x, y, size, angle) {
  bandFrame(x, y, size, angle);
  pen.beginPath();                                                      // the pipe of bamboo, a little wider below
  pen.moveTo(0, -4.2);
  pen.lineTo(126, -5);
  pen.lineTo(126, 5);
  pen.lineTo(0, 4.2);
  pen.closePath();
  bandFill(BAND_BAMBOO, 1.2);
  pen.strokeStyle = "#8a6a2e";                                          // its nodes
  pen.lineWidth = 1.6;
  pen.beginPath();
  pen.moveTo(38, -4.6); pen.lineTo(38, 4.6);
  pen.moveTo(88, -4.9); pen.lineTo(88, 4.9);
  pen.stroke();
  pen.fillStyle = "rgba(255, 245, 210, 0.45)";                          // a gloss down it
  pen.fillRect(4, -2.6, 118, 1.4);
  pen.fillStyle = "#b8c0c4";                                            // the brass of the reed, near the top
  pen.fillRect(7, -1.6, 10, 3.2);
  pen.fillStyle = "#2a1a0c";                                            // seven finger holes down its front
  for (var k = 0; k < 7; k++) {
    pen.beginPath();
    pen.ellipse(52 + k * 10.5, 0, 1.9, 1.6, 0, 0, 7);
    pen.fill();
  }
  pen.beginPath();                                                      // the open foot
  pen.ellipse(126, 0, 1.6, 5, 0, 0, 7);
  pen.fill();
  pen.restore();
}

// The phin phia, with the post of its coconut at (x, y) on the stick and the
// stick along "angle" toward its curled end; 48 of it lies behind (x, y) to
// the pegs, 170 before it to the curl. The coconut hangs on the side of +90
// degrees from "angle" (under the stick when it lies to the right), the
// other side when "flip" is true.
function phinPhia(x, y, size, angle, flip) {
  bandFrame(x, y, size, angle);
  if (flip) { pen.scale(1, -1); }
  pen.beginPath();                                                      // the half coconut on its post, open away from the stick
  pen.moveTo(-3, 2);
  pen.lineTo(-3, 9);
  pen.lineTo(3, 9);
  pen.lineTo(3, 2);
  pen.closePath();
  bandFill(BAND_DARK, 1);
  pen.beginPath();
  pen.ellipse(0, 22, 17, 13, 0, Math.PI, 0);
  pen.closePath();
  bandFill(BAND_SHELL, 1.4);
  pen.beginPath();                                                      // its rim, seen a little from below
  pen.ellipse(0, 22, 17, 3.5, 0, 0, 7);
  bandFill("#3a2414", 1);
  pen.beginPath();                                                      // the stick
  pen.moveTo(-48, -3);
  pen.lineTo(160, -2.4);
  pen.lineTo(160, 2.4);
  pen.lineTo(-48, 3);
  pen.closePath();
  bandFill("#5b3a22", 1.1);
  pen.strokeStyle = "#a8a07a";                                          // the curl at its end, capped in metal
  pen.lineWidth = 4.2;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(158, 0);
  pen.bezierCurveTo(170, 0, 178, 8, 174, 16);
  pen.bezierCurveTo(171, 21, 163, 19, 165, 13);
  pen.stroke();
  [-42, -32].forEach(function (u) {                                     // two pegs, standing up from it
    pen.beginPath();
    pen.moveTo(u - 1.4, -2);
    pen.lineTo(u - 2.2, -20);
    pen.lineTo(u + 2.2, -20);
    pen.lineTo(u + 1.4, -2);
    pen.closePath();
    bandFill(BAND_DARK, 0.9);
  });
  bandStrings(-38, 160, 2, 1.6);                                         // the strings, tied at the curl
  pen.strokeStyle = "#c8b07a";                                          // the loop of tendon that braces them
  pen.lineWidth = 1.4;
  pen.beginPath();
  pen.moveTo(-14, -3); pen.lineTo(-14, 3);
  pen.stroke();
  pen.restore();
}

// Where each instrument is held, as numbers of the player's own frame: a
// figure of size 1 sitting cross-legged at (0, 0) and looking right
// (face 1), its shoulders at (35, -131) near and (-31, -131) far, its chin at
// (2, -150), its arms 98 long, measured from person() with floor "cross".
// "p" is the beat, counted from the clock: each kind plays on it.
//   at, angle   where the instrument's own (x, y) lies, and which way it points
//   a, b        where the wrist of the near arm (A) and of the far arm (B) goes
//   bow         the salo's bow: its frog and its angle
//   fingers     the curls of the fingers on the instrument, as person() takes them
function bandHold(kind, p) {
  var beat = Math.sin(Math.PI * p), twice = Math.sin(2 * Math.PI * p);
  if (kind === "salo") {                       // upright before the body, its spike on the floor; the near hand
    var lean = 0.24 + 0.03 * Math.sin(Math.PI * p / 2);   // high on the neck, the far hand bowing across it, out on one
    var bowX = 24 + 12 * beat;                 // beat and in on the next; a tilt brings one string or the other to the bow.
    return {at: [44, -4], angle: -Math.PI / 2 + lean, a: [80, -134], b: [bowX, -62],   // The far wrist stays within
            bow: [bowX + 8, -60, 0.05], grip: true};                                  // 97 of its shoulder
  }
  if (kind === "sueng") {                      // across the lap, the body on the near thigh, the neck up to the far side;
    var strum = 5 * twice;                     // the far hand stops the strings, the near hand plucks twice a beat
    return {at: [34, -46], angle: Math.PI + 0.45, a: [36, -60 + strum], b: [-40, -84],
            pick: [38, -52 + strum, 2.5], grip: true};
  }
  if (kind === "pichum") {                     // down and forward from the mouth, both hands on it, the far arm across
    var nod = 0.03 * beat;                     // the chest below the chin; it nods with the beat
    return {at: [17, -170], angle: 1.03 + nod, a: [68, -85], b: [48, -119], fingers: true};
  }
  var press = 2 * Math.sin(Math.PI * p / 2);   // phinphia: the stick down across the body, its coconut on the upper chest
  return {at: [press, -108 - press], angle: 0.8, flip: true, a: [61, -45 + 4 * twice], b: [22, -85],   // above the far
          fingers: true};                                                                          // forearm, pressed and eased off
}

// A musician: a person sitting cross-legged at (x, y), playing "kind" (one of
// BAND_KINDS) on the beat. "look" is a person's look (cast("fellow") and the
// like); the musician adds floor, the reach of both hands and the instrument,
// worn under the arms so the hands lie over it, and takes away a stick or a
// parasol from the hands. The phin phia is played on the bare chest: its
// player has no shirt and no cloth over the shoulder. "late" is seconds added to its clock,
// so two players do not move as one. Gives back the joints person() gives.
function musician(x, y, kind, look, late) {
  if (BAND_KINDS.indexOf(kind) < 0) {
    checkName("The musician's instrument", kind, {salo: 1, sueng: 1, pichum: 1, phinphia: 1});
    kind = "salo";
  }
  look = look || {};
  var s = look.size || 1, f = look.face || 1;
  var p = (clock + (late || 0)) / BEAT;
  var hold = bandHold(kind, p);
  function at(point) { return [x + f * s * point[0], y + s * point[1]]; }
  var frame = pen.getTransform();
  function worn() {                            // drawn by person() after the body and the head, before the arms
    pen.setTransform(frame);
    pen.translate(x, y);
    pen.scale(f * s, s);
    if (kind === "salo") {
      salo(hold.at[0], hold.at[1], 1, hold.angle);
      saloBow(hold.bow[0], hold.bow[1], 1, hold.bow[2]);
    } else if (kind === "sueng") {
      sueng(hold.at[0], hold.at[1], 1, hold.angle);
      suengPick(hold.pick[0], hold.pick[1], 1, hold.pick[2]);
    } else if (kind === "pichum") {
      piChum(hold.at[0], hold.at[1], 1, hold.angle);
    } else {
      phinPhia(hold.at[0], hold.at[1], 1, hold.angle, hold.flip);
    }
  }
  var lift = 0.5 + 0.5 * Math.sin(2 * Math.PI * p);        // a finger lifts off a hole, and goes down again
  var playing = {floor: look.floor || "cross", reachA: at(hold.a), reachB: at(hold.b), worn: worn,
                 holding: null, parasol: null};             // both hands are on the instrument: no stick, no parasol
  if (hold.grip) { playing.grip = true; }
  if (hold.fingers) {
    playing.fingersA = [0.25 + 0.3 * lift, 0.35, 0.4, 0.55, 0.45];
    playing.fingersB = [0.3, 0.25 + 0.3 * (1 - lift), 0.4, 0.55, 0.45];
  }
  if (kind === "phinphia") {                   // played on the bare chest: no shirt, and no cloth over the shoulder
    playing.bare = true;
    playing.sabai = null;
  }
  return person(x, y, Object.assign({}, look, playing));
}
