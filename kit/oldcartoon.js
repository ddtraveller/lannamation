// oldcartoon.js - the style of a 1930s cartoon, as a kit.
//
// A film that uses this kit is a web page that:
//   1. has  <canvas id="stage" width="1920" height="1080">  and then loads this file;
//   2. sets  var DURATION  (seconds) and  var BEAT  (seconds for one beat of its music);
//   3. writes its scenes as functions of their own clock, and lists them:
//          var SCENES = [[0, 8, sceneOne], [8, 20, sceneTwo]];
//   4. ends with   function draw(t) { film(t, SCENES); }
// village.html is such a film. Everything a scene draws, it draws with "pen".
//
// The style is these rules, and each is a function below:
//   ink        thin brown outlines on the actors, none on the backgrounds   shape, oval
//   hoses      arms, legs, tails: one curve drawn fat and dark, then thinner in colour   hose
//   the beat   hop(t) is 0 on the beat and 1 between beats; everything moves by it
//              (a film whose style has hop: false is the other kind: its people stand
//              still, and walk evenly from place to place with stroll())
//   bodies     tall; a chest with a waist; tails, coat or skirt that flare and swing;
//              legs that bow at the knee as the hips drop on the beat          person
//   cloth      tiers with a hem of scallops that breathe and swing             tier
//   hair       rolled curls with a line of light                               curl
//   faces      a lady: lashed almond eyes, a heart of a mouth. A fellow: big white
//              eyes, a broad nose, a wide grin. Both blink and sing            ladyFace, manFace
//   sets       soft watercolour, painted once on a hidden canvas               hills, house, wash ...
//   the film   a nearly square picture, a soft brown lens, grain, flicker, dust,
//              a round iris between scenes, a curtain, a slow push-in          film, iris, curtain

// The film is 1440 x 1080, like old film, with black bars either side of it on
// the 1920 screen; a film that sets window.FILM_STYLE = {wide: 1920} before
// this file loads fills the screen instead. SIDE is the bar's width.
var WIDE = (window.FILM_STYLE && window.FILM_STYLE.wide) || 1440;
var SIDE = (1920 - WIDE) / 2;
// Device pixels per film pixel. {pixels: 2} draws the sheet and the screen at
// twice the size, with a base scale on the pen, and the browser's downscale to
// the 1920 picture smooths every ink line; the video stays 1920 x 1080. What
// is painted once at the sheet's size (sets, clouds, the woven cloth) is scaled
// up as it is drawn, as the lens scales it today.
var PIX = (window.FILM_STYLE && window.FILM_STYLE.pixels) || 1;

var GROUND = 900;

// ---------- warnings ----------
// A name the kit does not know is not an error: the page still draws. But it
// draws as if the name were not there, so a misspelt one (handa for handA)
// would change nothing and say nothing. warn() says it, once, in the
// browser's console, and keeps it in WARNINGS, where checks/kit_check.py,
// render.py and stills.py look for it.
var WARNINGS = [];

function warn(message) {
  if (WARNINGS.indexOf(message) >= 0) { return; }   // once is enough: draw() runs 30 times a second
  WARNINGS.push(message);
  console.warn("oldcartoon.js: " + message);
}

// how many letters must change to turn one name into the other
function lettersApart(a, b) {
  var row = [], i, j, last, next;
  for (j = 0; j <= b.length; j++) { row.push(j); }
  for (i = 1; i <= a.length; i++) {
    last = row[0];
    row[0] = i;
    for (j = 1; j <= b.length; j++) {
      next = Math.min(row[j] + 1, row[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = row[j];
      row[j] = next;
    }
  }
  return row[b.length];
}

// Warn if "name" is not a name in "known", and offer the known name nearest
// to it: one that differs only in capitals, or by one or two letters.
function checkName(what, name, known) {
  if (name in known) { return; }
  var near = null, best = 3;
  for (var other in known) {
    var apart = other.toLowerCase() === name.toLowerCase() ? 0 : lettersApart(name, other);
    if (apart < best) { best = apart; near = other; }
  }
  warn(what + ' "' + name + '" is not a name the kit knows, so it changes nothing'
       + (near ? '. Did you mean "' + near + '"?' : ""));
}

// the same for every key of an object, such as a look
function checkNames(what, given, known) {
  for (var name in given) { checkName(what, name, known); }
}

// ---------- the style sheet ----------
// Every number and colour that gives the look its name is here, so that a
// film can change the look without touching the kit: before it loads this
// file, it sets window.FILM_STYLE = {ink: "#000000", line: 3}, and only
// those entries change.
var STYLE = {
  ink: "#3a2418",                       // old films were inked in brown, not black
  skin: "#f4d6b8",                      // pale, as the murals paint it
  line: 2.3,                            // the weight of the ink line
  hold: 0.06,                           // of a beat: the pause at the bottom of a hop
  sway: 1,                              // how much the spine sways: 0 for none, 2 for twice as much
  hop: true,                            // everyone hops on the beat, as in the 1930s; false: they stand still and walk evenly
  hands: "round",                       // a bare hand drawn in the round (hand()), which can show its edge or its palm; "flat" is the flat hand the kit drew until 2026-10-15 (glove)
  gold: "#e0b23a",
  hair: "#2a1a12",
  clouds: "scroll",                     // a thangka's scroll cloud; "soft" for blurred blobs
  sun: "flames",                        // a disc ringed with flame scrolls; "face" for the 1930s sun
  lens: "blur(0.5px) saturate(0.93) sepia(0.14) contrast(1.04)",  // the old print
  wide: 1440,                           // the sheet's width: 1440 with black bars, 1920 to fill the screen (read before this sheet: see WIDE)
  film: 1,                              // how much of the old print shows: grain, flicker, dust, scratches, dark corners, the shake in the gate; 0 is a clean picture
  pixels: 1,                            // device pixels per film pixel: 2 draws everything at twice the size and lets the browser smooth it down (read before this sheet: see PIX)
  light: null                           // where the light comes from, [across, down]: [-0.6, 0.5] throws a shadow to the right; null for the soft pool alone
};

checkNames("FILM_STYLE's entry", window.FILM_STYLE || {}, STYLE);

Object.assign(STYLE, window.FILM_STYLE || {});

var INK = STYLE.ink;

var SKIN = STYLE.skin;

// The same for hair, and for the line round it and the lines a comb leaves:
// person() sets them for one whose look has a hair colour of its own.
var HAIR = STYLE.hair, HAIR_LINE = "#7a5640";

// A lady paints her lips red. A child does not, and neither do the old:
// person() sets PAINTED for the figure it draws, and lipOf() gives the red a
// lady's mouth asks for, or else the colour of her own lips.
var PAINTED = true;

function lipOf(red) {
  return PAINTED ? red : blend(SKIN, "#a8504a", 0.5);
}

var stage = document.getElementById("stage");

if (PIX !== 1) {                        // the screen at the film's device pixels; its CSS size is the page's
  stage.width = 1920 * PIX;
  stage.height = 1080 * PIX;
}

var screen = stage.getContext("2d");

// Every scene is painted on a hidden sheet, FILM. At the end of a frame the
// sheet is copied to the screen through a soft, slightly brown lens.
var FILM = document.createElement("canvas");

FILM.width = WIDE * PIX;

FILM.height = 1080 * PIX;

var pen = FILM.getContext("2d");

var clock = 0;                          // the second being drawn; draw(t) sets it

// ---------- numbers ----------

function clamp(x) { return Math.max(0, Math.min(1, x)); }

function between(t, a, b) {
  var x = clamp((t - a) / (b - a));
  return x * x * (3 - 2 * x);
}

function mix(a, b, amount) { return a + (b - a) * amount; }

function dice(n) {
  var x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

// 0 on the beat, 1 half way to the next beat: one hop for every beat.
// "late" moves the hop, so that people in a row do not all hop together.
// The dip is gentle: the body slows as it comes down to the low point,
// rests there for a moment (HOLD of a beat on either side of the beat),
// and slows away from it again. The power above 1 is what makes the
// slowing; the hold is the pause. (Owner, 2026-10-11.)
var HOLD = STYLE.hold;

function hop(t, late) {
  var beats = t / BEAT + (late || 0);
  var frac = beats - Math.floor(beats);
  if (frac < HOLD || frac > 1 - HOLD) { return 0; }
  return Math.pow(Math.sin(Math.PI * (frac - HOLD) / (1 - 2 * HOLD)), 1.5);
}

// Eyes do not drift. They hold on a spot, then jump to another in a twentieth
// of a second (a saccade), after a hold of half a second to a few seconds.
// The spots and the holds come from dice, so no two people look alike.
function saccade(t) {
  var cell = Math.floor(t / 0.55), here = cell, before;
  while (here > cell - 8 && dice(here * 7 + 3) > 0.45) { here--; }         // the cell in which the eyes last jumped
  before = here - 1;
  while (before > here - 8 && dice(before * 7 + 3) > 0.45) { before--; }   // and the jump before that one
  var jump = clamp((t - here * 0.55) / 0.05);
  return [mix((dice(before * 3 + 1) - 0.5) * 6, (dice(here * 3 + 1) - 0.5) * 6, jump),
          mix((dice(before * 3 + 2) - 0.5) * 2.4, (dice(here * 3 + 2) - 0.5) * 2.4, jump)];
}

// ---------- the chest ----------
// The chest's outline, as points: a start, then curves, each of two controls
// and an end, or of one control and an end. Seen a little from one side, its
// two edges are not alike: the back runs nearly straight up to the shoulder
// blade, and the front swells. Shoulders slope down from the neck. A lady's
// is narrower, with a bust and a smaller waist; a fellow's is broader, and
// fuller low down.
var CHEST_LADY = [[-24, 2],
                  [[-30, -28], [-44, -64], [-44, -98]],         // up the back
                  [[-46, -116], [-36, -128], [-18, -134]],      // the back shoulder
                  [[0, -140], [14, -134]],                      // the neck sits here
                  [[34, -130], [46, -118], [46, -100]],         // the front shoulder
                  [[54, -84], [50, -62], [34, -48]],            // the bust
                  [[24, -36], [24, -16], [26, 2]],              // in to the waist
                  [[0, 10], [-24, 2]]];
var CHEST_MAN = [[-29, 2],
                 [[-36, -30], [-50, -70], [-52, -100]],
                 [[-54, -118], [-44, -130], [-22, -136]],
                 [[0, -142], [16, -136]],
                 [[40, -132], [56, -120], [56, -100]],
                 [[60, -70], [52, -36], [34, -14]],             // the chest, then a little belly
                 [[31, -6], [31, 2]],
                 [[0, 12], [-29, 2]]];
// The same chests turned about the spine (look.twist): to profile (the body
// facing the way the figure faces, as the head's turn -1), and round to full
// face (turn 1). Seen from the side a chest is narrow: the back curves out
// to the shoulder blade and in to the neck, the front swells forward at the
// bust, and both shoulders stand over the middle. Seen from the front it is
// at its widest and the two sides are alike. Each list has the segments of
// its three-quarter list, point for point, so that blendOutline() can mix
// them for any turn between.
var CHEST_LADY_P = [[-16, 2],
                    [[-20, -28], [-28, -64], [-28, -98]],
                    [[-30, -116], [-26, -130], [-12, -136]],
                    [[0, -140], [10, -136]],
                    [[20, -132], [26, -120], [24, -104]],
                    [[34, -86], [32, -62], [22, -48]],
                    [[16, -36], [16, -16], [18, 2]],
                    [[0, 10], [-16, 2]]];
var CHEST_LADY_F = [[-28, 2],
                    [[-30, -30], [-46, -60], [-50, -98]],
                    [[-52, -116], [-42, -130], [-20, -136]],
                    [[0, -140], [20, -136]],
                    [[42, -130], [52, -116], [50, -98]],
                    [[50, -84], [46, -60], [30, -30]],
                    [[28, -18], [28, -8], [28, 2]],
                    [[0, 10], [-28, 2]]];
var CHEST_MAN_P = [[-18, 2],
                   [[-22, -30], [-32, -70], [-34, -100]],
                   [[-36, -118], [-30, -132], [-12, -138]],
                   [[0, -142], [10, -138]],
                   [[22, -134], [30, -122], [30, -104]],
                   [[36, -72], [32, -36], [24, -14]],
                   [[20, -6], [20, 2]],
                   [[0, 12], [-18, 2]]];
var CHEST_MAN_F = [[-34, 2],
                   [[-40, -30], [-56, -70], [-58, -100]],
                   [[-60, -118], [-48, -132], [-24, -138]],
                   [[0, -142], [24, -138]],
                   [[48, -132], [60, -118], [58, -100]],
                   [[56, -70], [48, -36], [36, -14]],
                   [[34, -6], [34, 2]],
                   [[0, 12], [-34, 2]]];

// an outline (a list as CHEST_LADY is) for a turn t, blended through its
// profile, three-quarter and full-face lists as blend3() blends a number
function blendOutline(t, P, Q, F) {
  if (!t) { return Q; }
  var out = [[blend3(t, P[0][0], Q[0][0], F[0][0]), blend3(t, P[0][1], Q[0][1], F[0][1])]];
  for (var n = 1; n < Q.length; n++) {
    var seg = [];
    for (var k = 0; k < Q[n].length; k++) {
      seg.push([blend3(t, P[n][k][0], Q[n][k][0], F[n][k][0]), blend3(t, P[n][k][1], Q[n][k][1], F[n][k][1])]);
    }
    out.push(seg);
  }
  return out;
}

// the path of such a list, with every point put where put(x, y) says it
// goes: a drawing bent along a curve, and tipped, and still drawn only once
function outline(points, put) {
  var at = put(points[0][0], points[0][1]);
  pen.beginPath();
  pen.moveTo(at[0], at[1]);
  for (var n = 1; n < points.length; n++) {
    var c = points[n], flat = [];
    for (var k = 0; k < c.length; k++) {
      at = put(c[k][0], c[k][1]);
      flat.push(at[0], at[1]);
    }
    if (c.length === 3) { pen.bezierCurveTo(flat[0], flat[1], flat[2], flat[3], flat[4], flat[5]); }
    else { pen.quadraticCurveTo(flat[0], flat[1], flat[2], flat[3]); }
  }
  pen.closePath();
}

// ---------- a puppet of drawn parts ----------
// A rig is a drawing cut into parts (rig_cut.py): each part is an image and
// the two joints it hangs between, in its own pixels. A page loads the rig's
// rig.js (var RIG = {...}), calls rigImages(RIG, "folder/") once, and then
// person(x, y, {rig: RIG, ...}) moves the drawing instead of drawing the
// kit's own shapes: the same hops, steps, poses and lags, on a drawn body.
function rigImages(rig, folder) {
  rig.byName = {};
  rig.images = {};
  for (var n = 0; n < rig.parts.length; n++) {
    var p = rig.parts[n];
    rig.byName[p.name] = p;
    rig.images[p.name] = new Image();
    rig.images[p.name].src = folder + p.file;
  }
  rig.scale = 148 / (rig.hip[1] - rig.neck[1]);   // kit units per picture pixel: the kit's shoulders are 148 above its hips
  function long(name) {                           // a bone's length in the picture, in kit units
    var p = rig.byName[name];
    return p ? Math.sqrt((p.b[0] - p.a[0]) * (p.b[0] - p.a[0]) + (p.b[1] - p.a[1]) * (p.b[1] - p.a[1])) * rig.scale : 60;
  }
  rig.upper = long("armL_upper");
  rig.lower = long("armL_lower");
  rig.legs = (rig.ankle[1] - rig.hip[1]) * rig.scale;   // the drawing's own leg length: its hips stand this high
  return rig;
}

// One part, drawn so that its joints land on (ax, ay) and (bx, by): turned
// to the bone's direction, scaled alike both ways by the rig's scale, and,
// with "stretch", stretched along the bone to reach the far joint.
function part(rig, name, ax, ay, bx, by, stretch) {
  var p = rig.byName[name], img = rig.images[name];
  if (!p || !img.complete || !img.naturalWidth) { return; }
  var pdx = p.b[0] - p.a[0], pdy = p.b[1] - p.a[1], plen = Math.sqrt(pdx * pdx + pdy * pdy) || 1;
  var kdx = bx - ax, kdy = by - ay, klen = Math.sqrt(kdx * kdx + kdy * kdy) || 1;
  var along = stretch ? klen / (plen * rig.scale) : 1;
  pen.save();
  pen.translate(ax, ay);
  pen.rotate(Math.atan2(kdy, kdx));
  pen.scale(along * rig.scale, rig.scale);
  pen.rotate(-Math.atan2(pdy, pdx));
  pen.drawImage(img, -p.a[0], -p.a[1]);
  pen.restore();
}

// An arm of parts from a shoulder toward a hand, as arm() places the bones:
// the elbow is found from the rig's own bone lengths. "names" are the upper
// arm, the forearm and the hand; "bend" is the wrist's bend. Returns the
// wrist and the elbow, as limb() does.
function rigArm(rig, names, sx, sy, hand, outward, bend) {
  var far = Math.sqrt(hand[0] * hand[0] + hand[1] * hand[1]) || 1;
  var reach = Math.max(0.62, Math.min(0.97, far * 1.3 / 120)) * (rig.upper + rig.lower);
  var at = armJoints(hand[0] / far * reach, hand[1] / far * reach, rig.upper, rig.lower, outward);
  var ex = sx + at[0], ey = sy + at[1], elbow = [sx + at[2], sy + at[3]];
  part(rig, names[0], sx, sy, elbow[0], elbow[1], true);
  part(rig, names[1], elbow[0], elbow[1], ex, ey, true);
  var angle = Math.atan2(ey - elbow[1], ex - elbow[0]) + bend;
  part(rig, names[2], ex, ey, ex + Math.cos(angle) * 30, ey + Math.sin(angle) * 30);
  return [ex, ey, elbow[0], elbow[1]];
}

// ---------- following ----------
// What hangs from a person - an earring, the ends of a sabai, a drum on its
// strap - does not move with the body. It lags behind, and swings on after
// the body stops. follow() gives that lag for a free end hung from the local
// point (lx, ly). Each frame it finds where that point is on the screen, how
// fast it moves and how hard it accelerates, and lets the end be thrown the
// other way, pulled back by a spring ("stiff") and slowed by "damp". "limit"
// caps the lag, in screen pixels. The answer is in local pixels, to add to
// where the end is drawn. The state lives from one frame to the next under
// "key": a key that jumps across the screen (a cut), or whose clock runs
// backward or stops for longer than a moment, starts again at rest.
var FOLLOWS = {}, DRAWN = 0, DRAWN_AT = -1;

function follow(key, lx, ly, stiff, damp, limit) {
  var m = pen.getTransform();
  var p = m.transformPoint(new DOMPoint(lx, ly));   // the pivot, on the screen
  var s = FOLLOWS[key], dt = s ? clock - s.t : 0;
  if (!s || dt < 0 || dt > 0.25 || Math.abs(p.x - s.px) + Math.abs(p.y - s.py) > 150 + 1500 * dt) {
    s = FOLLOWS[key] = {t: clock, px: p.x, py: p.y, vx: 0, vy: 0, dx: 0, dy: 0, sx: 0, sy: 0, fresh: true};
    dt = 0;
  }
  if (dt > 0) {
    var vx = (p.x - s.px) / dt, vy = (p.y - s.py) / dt;           // how fast the pivot moves,
    var ax = (vx - s.vx) / dt, ay = (vy - s.vy) / dt * 0.35;      // and how hard it accelerates (less of the up and down)
    if (s.fresh) { ax = 0; ay = 0; s.fresh = false; }             // the first frame knows the speed but not yet the change in it
    var h = dt / 4;
    for (var n = 0; n < 4; n++) {                                 // four small steps, so a stiff spring stays stable
      s.sx += (-stiff * s.dx - damp * s.sx - ax) * h;             // the end's speed, relative to the pivot
      s.sy += (-stiff * s.dy - damp * s.sy - ay) * h;
      s.dx += s.sx * h;                                           // and its lag
      s.dy += s.sy * h;
    }
    var far = Math.sqrt(s.dx * s.dx + s.dy * s.dy);
    if (far > limit) { s.dx *= limit / far; s.dy *= limit / far; s.sx = 0; s.sy = 0; }
    s.t = clock; s.px = p.x; s.py = p.y; s.vx = vx; s.vy = vy;
  }
  var back = m.inverse();                                         // the lag, turned into local pixels
  return [back.a * s.dx + back.c * s.dy, back.b * s.dx + back.d * s.dy];
}

// ---------- singing ----------
// A song is a list of syllables and the beat each is sung on. A mouth opens
// once for each syllable, in the shape of its vowel: "a" is open, "i" and
// "e" are wide, "o" and "u" are round; and first, for a moment, in the
// shape of the consonant it starts with. Both are read from the Thai
// spelling of the syllable.

// [beat, "syllable syllable ..."] lines, as in village_sing.py, to a flat
// list of [beat, syllable]
function sungBeats(lines) {
  var out = [];
  for (var n = 0; n < lines.length; n++) {
    var words = lines[n][1].split(" ");
    for (var k = 0; k < words.length; k++) { out.push([lines[n][0] + k, words[k]]); }
  }
  return out;
}

// the shape of the mouth for a syllable: how wide and how round, 0 to 1
function vowelOf(syllable) {
  var round = /[โอูุ]/.test(syllable) && !/เ/.test(syllable);
  if (!round && !/[ะาัิีึืุูเแโใไำ]/.test(syllable)) { round = true; }   // no vowel written: a short "o"
  var wide = /[ิีึืเ]/.test(syllable);
  return {wide: wide ? 1 : 0, round: round ? 1 : 0};
}

// The consonant a syllable starts with, as the mouth makes it: "lips" for
// ม บ ป พ ผ ภ (the lips meet first), "teeth" for ฟ ฝ (the upper teeth on
// the lower lip), "tongue" for ล ร น ด ต ถ ท ธ ณ (the tongue up behind the
// teeth), "hiss" for ส ซ ศ ษ (the teeth near, the lips wide), and nothing
// for the rest, which start open. A written vowel before the consonant
// (เ แ โ ใ ไ) and a silent ห or อ leading it are passed over.
function onsetOf(syllable) {
  var letters = syllable.replace(/^[เแโใไ]+/, "");
  if (/^[หอ][^ะาัิีึืุูเแโใไำ]/.test(letters)) { letters = letters.slice(1); }
  var first = letters.charAt(0);
  if (/[มบปพผภ]/.test(first)) { return "lips"; }
  if (/[ฟฝ]/.test(first)) { return "teeth"; }
  if (/[ลรนดตถทธณฏฐฑฒ]/.test(first)) { return "tongue"; }
  if (/[สซศษ]/.test(first)) { return "hiss"; }
  return "";
}

var ONSETS = {lips: {open: 0.02, wide: 0.2, round: 0}, teeth: {open: 0.16, wide: 0.5, round: 0, teeth: 1},
              tongue: {open: 0.38, wide: 0.3, round: 0, tongue: 1}, hiss: {open: 0.14, wide: 1, round: 0, teeth: 1}};

// The mouth at this moment of the film, or null when nothing is sung. A
// syllable lasts one beat: for its first 0.08 s the mouth makes the
// consonant it starts with, then opens fast into the vowel, holds, and
// shuts before the next.
function mouthAt(sung) {
  for (var n = 0; n < sung.length; n++) {
    var since = clock - sung[n][0] * BEAT;
    if (since >= 0 && since < BEAT) {
      var shape = vowelOf(sung[n][1]), onset = ONSETS[onsetOf(sung[n][1])];
      var shutting = clamp((BEAT - 0.02 - since) / 0.14);
      if (!onset) {
        shape.open = Math.min(1, since / 0.07) * shutting;
        return shape;
      }
      var w = clamp((0.08 - since) / 0.03);         // the consonant: whole until 0.05 s, gone by 0.08
      var vowel = clamp((since - 0.05) / 0.07);     // the vowel opens from 0.05 s
      return {open: Math.max(onset.open * w, vowel) * shutting, wide: mix(shape.wide, onset.wide, w),
              round: mix(shape.round, onset.round, w), teeth: !!onset.teeth && w > 0, tongue: !!onset.tongue && w > 0};
    }
  }
  return null;
}

// ---------- the cue sheet ----------
// A film with a song keeps one list of it, and everything that follows the
// song reads that list. Each row is one line of the song:
//   [the beat it starts on, its syllables (one is sung on each beat),
//    the line as it is written under the picture, what it means]
//   var CUES = [[8, "สะ หนุก จัง", "สนุกจัง", "What fun"]];
// The syllables are spelt as they are sung (สะ หนุก); the written line is
// spelt as it is read (สนุก). sungBeats(CUES) gives the mouths their
// syllables, words(t, CUES) writes the line under the picture, cueAt(t, CUES)
// tells a scene which line is being sung, and the song's own script reads
// CUES out of the film's page. There is one list to change, so the voice,
// the mouths, the words and what people do cannot drift apart.

// The line being sung at second t of the film: its number in the list (-1
// before the first line), the seconds since it began, and the beats it is
// sung for. A line stays "the line" until the next one begins.
function cueAt(t, cues) {
  var line = -1;
  for (var n = 0; n < cues.length; n++) {
    if (t >= cues[n][0] * BEAT) { line = n; }
  }
  if (line < 0) { return {line: -1, since: 0, beats: 0}; }
  return {line: line, since: t - cues[line][0] * BEAT, beats: cues[line][1].split(" ").length};
}

// The words of the line being sung, under the picture: from its first beat
// until half a beat after its last syllable.
function words(t, cues) {
  var cue = cueAt(t, cues);
  if (cue.line >= 0 && cue.since < (cue.beats + 0.5) * BEAT && cues[cue.line][2]) {
    subtitle(cues[cue.line][2], cues[cue.line][3]);
  }
}

// ---------- ink and paint ----------

// The line round a shape. Three things make it look drawn with a pen:
//   it is thin, and the same weight everywhere (LINE);
//   it takes its colour from the paint inside it: mostly ink, a little paint,
//     so the line round a red skirt is a dark red and not a black;
//   it is heavier on the side away from the light, below and to the left.
var LINE = STYLE.line;

// A pen does not grow with the picture: a figure drawn three times as large
// is not inked three times as thick. FINE is what a figure's pen lines are
// multiplied by: 1 up to the film's usual size, and less for a larger
// figure. person() sets it, and LINE with it, while it draws.
var FINE = 1;

function inkFor(colour) {
  if (!/^#[0-9a-f]{6}$/i.test(colour)) { return INK; }
  var paint = parseInt(colour.slice(1), 16);
  var red = (paint >> 16) & 255, green = (paint >> 8) & 255, blue = paint & 255;
  return "rgb(" + Math.round(mix(red, 58, 0.84)) + ", " + Math.round(mix(green, 36, 0.84)) +
         ", " + Math.round(mix(blue, 24, 0.84)) + ")";
}

// From here on, whatever is drawn in "ink" is drawn a second time, one step
// down and to the left: that is the heavier side of the line.
function heavy(ink) {
  pen.shadowColor = ink;
  pen.shadowOffsetX = -1.1;
  pen.shadowOffsetY = 1.1;
}

function light() {
  pen.shadowColor = "transparent";
  pen.shadowOffsetX = 0;
  pen.shadowOffsetY = 0;
}

function shape(colour, width) {
  var ink = inkFor(colour);
  pen.fillStyle = colour;
  pen.fill();
  pen.strokeStyle = ink;
  pen.lineWidth = width || LINE;
  pen.lineJoin = "round";
  heavy(ink);
  pen.stroke();
  light();
}

// Ink the line of one shape, but not where it runs inside another. Two shapes
// that overlap, each inked this way against the other, read as one shape
// with one line round it.
function strokeOutside(path, other) {
  var rest = new Path2D();
  rest.rect(-4000, -4000, 8000, 8000);
  rest.addPath(other);
  pen.save();
  pen.clip(rest, "evenodd");
  pen.stroke(path);
  pen.restore();
}

function oval(x, y, rx, ry, colour, turn) {
  pen.beginPath();
  pen.ellipse(x, y, rx, ry, turn || 0, 0, 7);
  shape(colour);
}

// A rubber hose: one curved line, drawn fat in ink and then thinner in
// colour. Arms, legs, tails and necks are all hoses.
function hose(x1, y1, x2, y2, bend, width, colour) {
  var middleX = (x1 + x2) / 2 - (y2 - y1) * bend;
  var middleY = (y1 + y2) / 2 + (x2 - x1) * bend;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(x1, y1);
  pen.quadraticCurveTo(middleX, middleY, x2, y2);
  pen.strokeStyle = inkFor(colour);
  pen.lineWidth = width + LINE * 2;
  heavy(pen.strokeStyle);
  pen.stroke();
  light();
  pen.strokeStyle = colour;
  pen.lineWidth = width;
  pen.stroke();
}

// A hanging end of cloth: a flat band from (x1, y1) to (x2, y2) that bends
// like a hose but is drawn as cloth, wide at its root and a little wider at
// its hem, with an ink edge, a fold line down its middle where it turns, and,
// for a checked cloth, bars across it in the border's colour. "bend" is the
// hose's; "width" its width at the root; "border" the colour of the bars, or
// nothing for a plain cloth.
function ribbon(x1, y1, x2, y2, bend, width, colour, border) {
  var middleX = (x1 + x2) / 2 - (y2 - y1) * bend, middleY = (y1 + y2) / 2 + (x2 - x1) * bend;
  var left = [], right = [], n, u, px, py, tx, ty, tl, w;
  for (n = 0; n <= 8; n++) {                        // the band's two edges, along the bent middle line
    u = n / 8;
    px = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * middleX + u * u * x2;
    py = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * middleY + u * u * y2;
    tx = 2 * (1 - u) * (middleX - x1) + 2 * u * (x2 - middleX);
    ty = 2 * (1 - u) * (middleY - y1) + 2 * u * (y2 - middleY);
    tl = Math.sqrt(tx * tx + ty * ty) || 1;
    w = width * (0.5 + 0.25 * u);                   // half the width: a little wider toward the hem
    left.push([px - ty / tl * w, py + tx / tl * w]);
    right.push([px + ty / tl * w, py - tx / tl * w]);
  }
  pen.beginPath();
  pen.moveTo(left[0][0], left[0][1]);
  for (n = 1; n <= 8; n++) { pen.lineTo(left[n][0], left[n][1]); }
  pen.lineTo(right[8][0] + (left[8][0] - right[8][0]) * 0.5 + (ty / tl) * 3, right[8][1] + (left[8][1] - right[8][1]) * 0.5 + (-tx / tl) * 3);   // a point at the hem
  for (n = 8; n >= 0; n--) { pen.lineTo(right[n][0], right[n][1]); }
  pen.closePath();
  shape(colour);
  pen.save();
  pen.clip();
  pen.strokeStyle = inkFor(colour);                 // the fold down the middle, where the cloth turns
  pen.globalAlpha = 0.35;
  pen.lineWidth = 1.4 * FINE;
  pen.beginPath();
  pen.moveTo(x1, y1);
  pen.quadraticCurveTo(middleX, middleY, x2, y2);
  pen.stroke();
  if (border) {                                     // the bars of a check
    pen.strokeStyle = inkFor(border);
    pen.globalAlpha = 0.45;
    pen.lineWidth = 2.2;
    pen.beginPath();
    for (n = 1; n < 8; n++) {
      pen.moveTo(left[n][0], left[n][1]);
      pen.lineTo(right[n][0], right[n][1]);
    }
    pen.stroke();
  }
  pen.restore();
}

// ---------- the actors ----------

// The eye of a 1930s cartoon: a tall black oval with a slice cut out of it.
// Now and then it blinks: for a moment it is only a curved line.
function pieEye(x, y, shut) {
  if (shut) {
    pen.strokeStyle = INK;
    pen.lineWidth = 4;
    pen.beginPath();
    pen.arc(x, y - 4, 8, 0.2, Math.PI - 0.2);
    pen.stroke();
    return;
  }
  pen.fillStyle = INK;
  pen.beginPath();
  pen.ellipse(x, y, 7, 13, 0, 0, 7);
  pen.fill();
  pen.fillStyle = SKIN;
  pen.beginPath();
  pen.moveTo(x, y);
  pen.lineTo(x + 9, y - 12);
  pen.lineTo(x + 10, y - 2);
  pen.fill();
}

// ---------- feelings ----------
// A feeling is numbers on the face: wonder (brows up, eyes wide), smile,
// fear (brows up and drawn in, eyes wide, mouth open wide), anger (brows
// down at the inner ends, eyes narrowed, corners down) and sad (inner ends
// of the brows up, lids half down, corners down). A scene gives them as
// numbers (wonder: 0.5) or by name (feel: "surprise"), and a name also
// gives the body a lean and the head a tilt, unless the scene sets its own.
var FEELINGS = {
  calm: {},
  joy: {smile: 1, wonder: 0.25, tilt: -0.04},
  surprise: {wonder: 1, open: [0.7, 0, 1], bend: -0.05, tilt: -0.05},
  fear: {fear: 1, wonder: 0.4, open: [0.6, 1, 0], bend: -0.08, tilt: 0.1},
  anger: {anger: 1, bend: 0.1, tilt: 0.03},
  sad: {sad: 1, bend: 0.05, tilt: 0.12}
};

function feelingOf(look) {
  if (look.feel !== undefined) { checkName("The feeling", look.feel, FEELINGS); }
  var named = FEELINGS[look.feel] || {};
  return {wonder: clamp(look.wonder !== undefined ? look.wonder : named.wonder || 0),
          smile: clamp(look.smile !== undefined ? look.smile : named.smile || 0),
          fear: clamp(look.fear !== undefined ? look.fear : named.fear || 0),
          anger: clamp(look.anger !== undefined ? look.anger : named.anger || 0),
          sad: clamp(look.sad !== undefined ? look.sad : named.sad || 0),
          open: named.open, bend: named.bend || 0, tilt: named.tilt || 0,
          eyes: look.eyes || 1, lips: look.lips || 1};   // and the face's own measure: how large its eyes and its mouth are
}

// A pose reached with a snap: first a small move the other way (the
// anticipation), then fast to the pose and a little past it, then settling.
function snap(u) {
  if (u < 0.22) { return -0.1 * Math.sin(Math.PI * u / 0.22); }
  var v = (u - 0.22) / 0.78;
  return 1 - Math.pow(1 - v, 3) + 0.15 * Math.sin(Math.PI * v) * Math.sqrt(1 - v);
}

// ---------- the turn of the head ----------
// A head is drawn at a turn from -1 (profile, the face pointing the way the
// figure faces) through 0 (the three-quarter view the kit was drawn in) to
// 1 (full face). Every feature has a place and a width at those three views,
// keyed below, and view() blends them for any turn between, on a curve
// through the three. The features sit on the front of an egg: as it turns
// to the camera they spread and come to the middle; as it turns away they
// crowd to the front, the far eye goes behind the nose, and the nose
// becomes part of the outline.
function blend3(t, atProfile, atQuarter, atFront) {
  return atQuarter + t * (atFront - atProfile) / 2 + t * t * (atFront - 2 * atQuarter + atProfile) / 2;
}

function blendPoints(t, P, Q, F) {
  var out = [];
  for (var n = 0; n < Q.length; n++) {
    out.push([blend3(t, P[n][0], Q[n][0], F[n][0]), blend3(t, P[n][1], Q[n][1], F[n][1])]);
  }
  return out;
}

// the head's outline: start, (two controls, end) x 3 as curves, (one control, end) for the chin, (two controls) back to the start
var HEAD_Q = [[-54, -298], [-56, -334], [-26, -344], [4, -342], [36, -340], [58, -320], [56, -292], [55, -270], [51, -248], [34, -236], [18, -227], [2, -229], [-20, -233], [-50, -266]];
var HEAD_F = [[-56, -298], [-58, -336], [-30, -346], [0, -345], [30, -346], [58, -336], [56, -298], [56, -274], [50, -246], [30, -234], [14, -226], [0, -227], [-30, -233], [-56, -262]];
var HEAD_P = [[-60, -298], [-62, -336], [-34, -348], [-2, -346], [28, -344], [56, -330], [58, -300], [78, -284], [72, -260], [46, -240], [34, -226], [18, -229], [-12, -236], [-52, -262]];
// a lady's hair: the mass from behind the ear up over the top to the brow, then the hairline back
var HAIR_LADY_Q = [[-46, -270], [-84, -288], [-82, -346], [-40, -362], [-6, -378], [48, -366], [60, -324], [52, -312], [36, -318], [0, -312], [-34, -288], [-40, -276]];
var HAIR_LADY_F = [[-50, -272], [-86, -292], [-80, -350], [-30, -372], [-4, -386], [40, -372], [62, -318], [56, -300], [46, -298], [0, -316], [-44, -298], [-50, -282]];
var HAIR_LADY_P = [[-44, -266], [-86, -286], [-86, -348], [-46, -366], [-12, -382], [40, -372], [56, -330], [56, -318], [50, -316], [16, -310], [-28, -292], [-38, -278]];
// a fellow's hair, cut close, the same way round
var HAIR_MAN_Q = [[-44, -296], [-62, -318], [-56, -352], [-22, -362], [4, -370], [44, -362], [56, -326], [40, -316], [30, -320], [6, -328], [-22, -312], [-34, -304]];
var HAIR_MAN_F = [[-48, -296], [-64, -320], [-58, -356], [-20, -366], [6, -372], [46, -362], [52, -322], [42, -310], [28, -308], [0, -322], [-28, -308], [-40, -300]];
var HAIR_MAN_P = [[-40, -292], [-64, -316], [-60, -352], [-28, -364], [-2, -372], [44, -366], [56, -330], [52, -318], [44, -320], [16, -328], [-18, -310], [-30, -302]];

// A profile, by the painting. (Owner, 2026-10-12, of a lady's side view:
// "looks weird". It was a round head with a bulge where a nose is.) Measured
// on the profile of a painted fon lep dancer: the forehead slopes back from
// the brow; the brow runs into the nose with a small dip; the nose is one
// straight line, 0.3 of the head long and 25 degrees forward of the face;
// the lips and a small round chin stand under it, each a little behind the
// one above; the jaw is a straight line back to under the ear; the eye is
// long, just behind the bridge; the ear is small and far back.
// The skull keeps the fourteen points of the other views, with a flat front
// (HEAD_SIDE). Brow, nose, lips and chin are a piece of their own
// (profilePiece), which slides out of the front of the head as it turns: its
// tip is always where the face draws the tip of the nose. A lady's piece is
// the painting's. A fellow's is the same build with his own measure, as his
// face has: a heavier brow, a shorter and blunter nose, lips that are a line
// and not paint, a fuller chin.
// These take over as the head turns from three-quarter to profile ("side",
// 0 to 1). From three-quarter to full face nothing changes: there the old
// profile keys (the first of each three) still shape the curve.
var HEAD_SIDE = [[-60, -298], [-62, -336], [-34, -348], [-2, -346], [26, -345], [50, -334], [57, -300], [56, -280], [54, -250], [52, -234], [50, -227], [40, -227.5], [10, -231], [-40, -250]];
var HAIR_LADY_SIDE = [[-40, -266], [-86, -286], [-86, -348], [-46, -366], [-12, -382], [34, -374], [45, -329], [46, -323], [41, -321], [12, -316], [-22, -296], [-31, -282]];
var HAIR_MAN_SIDE = [[-40, -292], [-64, -316], [-60, -352], [-28, -364], [-2, -372], [36, -368], [44, -332], [48, -322], [42, -321], [16, -328], [-18, -310], [-30, -302]];
var NOSE_TIP = {lady: 74, man: 71};                 // where V.tip is in profile: the piece is slid so that its tip stays on V.tip

// The piece of a profile that stands before the skull: from inside the
// forehead, out at the brow, down the nose, the lips and the chin, and back
// into the jaw.
//   tip     where the face draws the tip of the nose (V.tip): the piece is slid to it
//   side    how far the profile has taken over (until it has, the chin is kept up inside the jaw)
//   drop    how far the jaw has dropped to open the mouth
//   lady    true for a lady's piece, false for a fellow's
function profilePiece(tip, side, drop, lady) {
  var piece = new Path2D(), dx = tip - (lady ? NOSE_TIP.lady : NOSE_TIP.man);
  var under = (lady ? -226.8 : -226.2) - 5 * (1 - side) + drop;
  if (lady) {
    piece.moveTo(46 + dx, -318);
    piece.lineTo(56.2 + dx, -304);                                           // out of the forehead, along its slope
    piece.quadraticCurveTo(58.2 + dx, -296.5, 56.3 + dx, -291);              // the brow,
    piece.quadraticCurveTo(55.5 + dx, -288.6, 57.5 + dx, -286.3);            // the small dip under it,
    piece.lineTo(72 + dx, -262.2);                                           // and the nose: one straight line
    piece.quadraticCurveTo(74.5 + dx, -260.4, 74.5 + dx, -258.2);            // round the tip,
    piece.quadraticCurveTo(74.5 + dx, -255.4, 71.8 + dx, -254.6);            // a small round end
    piece.quadraticCurveTo(67.5 + dx, -253.6, 62.8 + dx, -253.6);            // and back under it
    piece.quadraticCurveTo(62 + dx, -250, 63.5 + dx, -248.5);
    piece.quadraticCurveTo(67 + dx, -247.3, 65.8 + dx, -244.8);              // the upper lip
    piece.lineTo(63.8 + dx, -243.6 + drop * 0.3);                            // where the lips meet
    piece.quadraticCurveTo(67 + dx, -242 + drop, 65 + dx, -239.2 + drop);    // the lower lip, fuller
    piece.quadraticCurveTo(59.5 + dx, -237 + drop, 60.5 + dx, -234 + drop);  // the hollow under it
    piece.quadraticCurveTo(62.5 + dx, under - 2.2, 54 + dx, under);          // a small round chin
  } else {
    piece.moveTo(46 + dx, -320);
    piece.lineTo(56.4 + dx, -306);                                           // out of the forehead, along its slope
    piece.quadraticCurveTo(59.6 + dx, -298.5, 56.6 + dx, -292);              // a heavier brow,
    piece.quadraticCurveTo(55.6 + dx, -289.4, 57.8 + dx, -287);              // the dip under it,
    piece.lineTo(71 + dx, -266.5);                                           // and the nose: shorter,
    piece.quadraticCurveTo(75.6 + dx, -263.6, 75.8 + dx, -260.4);            // with a blunt round tip
    piece.quadraticCurveTo(76 + dx, -256.6, 71 + dx, -255.6);
    piece.quadraticCurveTo(66.5 + dx, -254.8, 63 + dx, -255.4);              // back under it
    piece.quadraticCurveTo(62.2 + dx, -252.5, 64 + dx, -250.5);
    piece.quadraticCurveTo(66.4 + dx, -248.6, 63.2 + dx, -246.4);            // the upper lip
    piece.lineTo(62.4 + dx, -245.6 + drop * 0.3);                            // the mouth
    piece.quadraticCurveTo(66.4 + dx, -244 + drop, 64.4 + dx, -240.4 + drop);   // the lower lip
    piece.quadraticCurveTo(60 + dx, -238.6 + drop, 61.6 + dx, -235 + drop);  // the hollow under it
    piece.quadraticCurveTo(65 + dx, under - 2.6, 55.5 + dx, under);          // a fuller chin
  }
  piece.quadraticCurveTo(46 + dx, under + 0.2, 38 + dx, under - 1.8);        // and back along the jaw,
  piece.lineTo(30 + dx, -236 + drop);                                        // into it
  piece.closePath();
  return piece;
}

// "lady" is true for a head with a lady's face: her profile's measure, or a fellow's
function view(turn, lady) {
  var t = Math.max(-1, Math.min(1, turn || 0));
  var away = Math.max(0, -t), side = away * away * (3 - 2 * away);
  // a key at profile, three-quarter and full face; and where the painted profile has it, for her and for him
  function b(p, q, f, hers, his) {
    return blend3(t, p, q, f) + (hers === undefined ? 0 : side * ((lady ? hers : his) - p));
  }
  function points(P, Q, F, S) {
    var out = blendPoints(t, P, Q, F);
    for (var n = 0; n < out.length; n++) {
      out[n][0] += side * (S[n][0] - P[n][0]);
      out[n][1] += side * (S[n][1] - P[n][1]);
    }
    return out;
  }
  return {
    t: t, toProfile: away, toFront: Math.max(0, t), side: side,
    near: b(30, 2, -19, 37, 36), nearW: b(9, 15, 15, 15.5, 13),   // the near eye: in profile it sits just behind the nose
    far: b(40, 37, 19), farW: b(0, 12.5, 15),       // the far eye: gone behind the nose in profile
    nose: b(52, 24, 0, 57, 57), tip: b(58, 30, 0, NOSE_TIP.lady, NOSE_TIP.man),   // the bridge, and the tip
    mouth: b(48, 24, 0, 64.5, 62.5), mouthW: b(0.55, 1, 1.15, 1.45, 1),   // where the mouth's middle is, and how wide it reads
    cheek: b(10, -16, -30), farCheek: b(52, 46, 30), farCheekR: b(0, 10, 16),
    ear: b(-24, -52, -50, -17, -20), farEar: clamp((t - 0.2) / 0.8),   // the near ear's x; how much of the far ear shows
    hairShift: b(10, 0, -8),                        // the comb lines and the temple strand go with the hairline
    bun: [b(-44, -28, 0), b(-350, -354, -372)],     // at the back; on top, seen from the front
    head: points(HEAD_P, HEAD_Q, HEAD_F, HEAD_SIDE),
    hairLady: points(HAIR_LADY_P, HAIR_LADY_Q, HAIR_LADY_F, HAIR_LADY_SIDE),
    hairMan: points(HAIR_MAN_P, HAIR_MAN_Q, HAIR_MAN_F, HAIR_MAN_SIDE)
  };
}

// ---------- faces ----------
// Faces are drawn on a head whose middle is at (0, -286), turned a little to
// the right, so the eye on the right is further away and a little smaller.
// The films of the 1930s drew two kinds: a lady with long lashes and a small
// heart of a mouth, and a comic fellow with big eyes, a broad nose and a grin.

// The lines of age, over a face that ladyFace() or manFace() has drawn, in
// the head's own frame: two across the brow, three at the outer corner of
// the near eye, one under each eye, the fold from beside the nose down past
// each corner of the mouth, and the hollow of the cheek. "age" is 0 to 1:
// the lines are firmer the older the face.
function ageLines(age, V) {
  var n, middle = (V.near + V.far) / 2, corner = V.near - V.nearW - 3;
  pen.save();
  if (V.face) { pen.clip(V.face); }
  pen.strokeStyle = "rgba(120, 66, 48, " + (0.3 + 0.45 * age) + ")";
  pen.lineWidth = 1.5 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  for (n = 0; n < 2; n++) {
    pen.moveTo(V.near - V.nearW * 0.9, -322 - n * 7);
    pen.quadraticCurveTo(middle, -327 - n * 8, V.far + V.farW * 0.8, -322 - n * 7);
  }
  for (n = -1; n <= 1; n++) {
    pen.moveTo(corner, -282 + n * 2);
    pen.lineTo(corner - 8, -283 + n * 6);
  }
  if (V.nearW > 2) {
    pen.moveTo(V.near - V.nearW * 0.7, -271);
    pen.quadraticCurveTo(V.near, -266, V.near + V.nearW * 0.7, -271);
  }
  if (V.farW > 6) {
    pen.moveTo(V.far - V.farW * 0.6, -272);
    pen.quadraticCurveTo(V.far, -267, V.far + V.farW * 0.6, -272);
    pen.moveTo(V.tip + 5, -259);
    pen.quadraticCurveTo(V.mouth + 19, -250, V.mouth + 16, -237);
  }
  pen.moveTo(V.nose - 12, -262);
  pen.quadraticCurveTo(V.mouth - 23, -252, V.mouth - 19, -235);
  pen.moveTo(V.cheek - 4, -264);
  pen.quadraticCurveTo(V.cheek - 9, -252, V.cheek - 1, -241);
  pen.stroke();
  pen.restore();
}

// A beard, over a face: a moustache that droops from under the nose past
// each corner of the mouth, and a tuft that hangs from the chin. "drop" is
// how far the jaw has dropped: the tuft goes down with it.
function beard(colour, V, drop) {
  for (var half = -1; half <= 1; half += 2) {       // the two halves of the moustache, the far one first
    var out = half < 0 ? 15 : -21;                  // how far its end is from the middle of the mouth
    pen.beginPath();
    pen.moveTo(V.mouth + 1, -256);
    pen.quadraticCurveTo(V.mouth + out * 0.6, -259, V.mouth + out, -236);
    pen.quadraticCurveTo(V.mouth + out * 0.5, -250, V.mouth + 1, -250);
    pen.closePath();
    shape(colour, 1.4 * FINE);
  }
  pen.beginPath();                                  // the tuft on the chin
  pen.moveTo(V.mouth - 9, -231 + drop);
  pen.quadraticCurveTo(V.mouth - 5, -208 + drop, V.mouth + 3, -194 + drop);
  pen.quadraticCurveTo(V.mouth + 8, -212 + drop, V.mouth + 10, -231 + drop);
  pen.closePath();
  shape(colour, 1.4 * FINE);
}

// One eye. It is an almond: the upper lid is a high arch, the lower lid is
// nearly flat, and both meet in a point at each corner. The iris sits behind
// the lids, so the upper lid always hides the top of it.
//   wide, tall   half the width of the eye, and the height of its arch
//   outer        -1 or 1: which corner is the outer one, where lashes grow
//   lashes       0 for a fellow; 3 for the lady of the 1930s films, with lashes on her lid;
//                1 for an eye as the paintings draw it: a fine lid line with a flick at
//                the outer corner, a large dark iris that touches the lid, no lashes
//   glance       where the iris sits: across, or [across, down]
function eye(x, y, wide, tall, shut, glance, outer, lashes) {
  var gx = glance.length ? glance[0] : glance, gy = glance.length ? glance[1] : 0;
  // "shut" may be 0 to 1: the upper lid comes down that far, and past 0.9 the eye is shut
  var closed = shut === true ? 1 : shut ? shut : 0, lid = 1 - 0.85 * closed;
  shut = closed > 0.9;
  pen.save();                                       // an eye with lashes is a lady's: its outer corner lifts
  pen.translate(x, y);
  pen.rotate(lashes ? -0.17 * outer : 0);
  pen.translate(-x, -y);
  var n, angle, painted = lashes === 1;
  pen.lineCap = "round";
  pen.strokeStyle = INK;
  if (shut) {                                       // a shut eye is the lower lid alone
    pen.lineWidth = (painted ? 2.4 : 4) * FINE;
    pen.beginPath();
    pen.moveTo(x - wide, y);
    pen.quadraticCurveTo(x, y + tall * 0.9, x + wide, y);
    pen.stroke();
  } else {
    pen.fillStyle = "rgba(150, 110, 150, " + (painted ? 0.07 : 0.22) + ")";    // the hollow under the brow
    pen.beginPath();
    pen.ellipse(x, y - tall * 1.25, wide * 1.05, tall * 0.7, 0, 0, 7);
    pen.fill();
    pen.beginPath();                                // the white of the eye
    pen.moveTo(x - wide, y);
    pen.quadraticCurveTo(x - wide * 0.15, y - tall * 1.9 * lid, x + wide, y - 1);
    pen.quadraticCurveTo(x, y + tall * 0.95, x - wide, y);
    pen.closePath();
    pen.fillStyle = "#ffffff";
    pen.fill();
    pen.save();
    pen.clip();                                     // nothing of the iris shows outside the lids
    pen.translate(0, gy);
    var round = painted ? 1.15 : 0.8;               // a painted eye's iris is large: it touches the upper lid and fills the eye's height
    var iris = pen.createRadialGradient(x + gx, y - tall * 0.2, tall * 0.1, x + gx, y - tall * 0.3, tall * round);
    iris.addColorStop(0, painted ? "#6a4424" : "#9a6a34");     // the brown of it: light round the pupil,
    iris.addColorStop(0.7, painted ? "#3a2010" : "#6a3e1c");   // darker outward,
    iris.addColorStop(1, painted ? "#160c05" : "#2e1808");     // and a dark rim
    pen.fillStyle = iris;
    pen.beginPath();
    pen.arc(x + gx, y - tall * 0.3, tall * round, 0, 7);
    pen.fill();
    pen.fillStyle = "#120a06";
    pen.beginPath();
    pen.arc(x + gx, y - tall * 0.3, tall * (painted ? 0.5 : 0.32), 0, 7);
    pen.fill();
    pen.fillStyle = "#ffffff";                      // two lights, one big and one small; a painted eye has one
    pen.beginPath();
    pen.arc(x + gx - tall * 0.3, y - tall * 0.62, tall * 0.24, 0, 7);
    if (!painted) { pen.arc(x + gx + tall * 0.34, y - tall * 0.02, tall * 0.11, 0, 7); }
    pen.fill();
    pen.strokeStyle = "rgba(90, 50, 50, 0.22)";     // the upper lid's shadow, on the white and the iris
    pen.lineWidth = tall * 0.55;
    pen.beginPath();
    pen.moveTo(x - wide, y - tall * 0.1);
    pen.quadraticCurveTo(x - wide * 0.15, y - tall * 2.0 * lid, x + wide, y - tall * 0.1);
    pen.stroke();
    pen.restore();
    pen.lineWidth = painted ? LINE * 0.95 : LINE + 0.8 * FINE;   // the upper lid, a little heavier
    pen.beginPath();
    pen.moveTo(x - wide, y);
    pen.quadraticCurveTo(x - wide * 0.15, y - tall * 1.9 * lid, x + wide, y - 1);
    pen.stroke();
    pen.lineWidth = (painted ? 0.9 : 1.6) * FINE;          // the lower lid, light
    pen.beginPath();
    pen.moveTo(x + wide, y - 1);
    pen.quadraticCurveTo(x, y + tall * 0.95, x - wide, y);
    pen.stroke();
    pen.strokeStyle = "rgba(58, 36, 24, " + (painted ? 0.28 : 0.4) + ")";      // the fold of the lid above it
    pen.lineWidth = (painted ? 1.1 : 2) * FINE;
    pen.beginPath();
    pen.moveTo(x - wide * 0.8, y - tall * 0.95 * lid);
    pen.quadraticCurveTo(x - wide * 0.1, y - tall * 2.25 * lid, x + wide * 0.85, y - tall * 0.9 * lid);
    pen.stroke();
    pen.strokeStyle = INK;
  }
  if (lashes) {                                     // the lid line runs on past the outer corner and lifts: a flick
    var flick = wide / 15;                          // the flick is as long as the eye is: 8 on an eye 30 across
    pen.lineWidth = (painted ? 1.9 : 3) * FINE;
    pen.beginPath();
    pen.moveTo(x + outer * wide * 0.9, y - (shut ? 0 : 2 * flick));
    pen.quadraticCurveTo(x + outer * (wide + 4 * flick), y - 3 * flick, x + outer * (wide + 8 * flick), y - 7 * flick);
    pen.stroke();
    if (!shut && !painted) {                        // two more lashes, on the outer half of the upper lid
      var cx = x - wide * 0.15, cy = y - tall * 1.9 * lid;   // the lid is a curve through this control point
      pen.lineWidth = 2 * FINE;
      for (var lash = 0; lash < 2; lash++) {
        var u = outer > 0 ? 0.74 + lash * 0.12 : 0.26 - lash * 0.12;   // along the lid, toward the outer corner
        var lx = (1 - u) * (1 - u) * (x - wide) + 2 * (1 - u) * u * cx + u * u * (x + wide);
        var ly = (1 - u) * (1 - u) * y + 2 * (1 - u) * u * cy + u * u * (y - 1);
        var tx = 2 * (1 - u) * (cx - x + wide) + 2 * u * (x + wide - cx);   // the way the lid runs there
        var ty = 2 * (1 - u) * (cy - y) + 2 * u * (y - 1 - cy);
        var tl = Math.sqrt(tx * tx + ty * ty) || 1, len = 5.5 - lash * 1.5;
        pen.beginPath();                            // a lash leaves the lid upward, leaning outward
        pen.moveTo(lx, ly);
        pen.lineTo(lx + (ty / tl + outer * 0.6 * tx / tl) * len, ly + (-tx / tl + outer * 0.6 * ty / tl) * len);
        pen.stroke();
      }
    }
  }
  pen.restore();
}

// a brow: thick where it starts, by the nose, and thin at its far end
// "tilt" turns it about its middle: the inner end down for anger, up for sadness
function brow(x, y, wide, arch, heavy, tilt) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(tilt || 0);
  pen.translate(-x, -y);
  pen.beginPath();
  pen.moveTo(x - wide, y + 2);
  pen.quadraticCurveTo(x, y - arch, x + wide, y);
  pen.quadraticCurveTo(x, y - arch + heavy, x - wide, y + 2 + heavy * 0.4);
  pen.closePath();
  pen.fillStyle = INK;
  pen.fill();
  pen.restore();
}

// colour in a cheek: strongest in the middle ("strength", 0.42 unless told), gone at the edge, with no line
function blush(x, y, r, strength) {
  var pink = pen.createRadialGradient(x, y, 0, x, y, r);
  pink.addColorStop(0, "rgba(236, 110, 110, " + (strength === undefined ? 0.42 : strength) + ")");
  pink.addColorStop(1, "rgba(236, 110, 110, 0)");
  pen.fillStyle = pink;
  pen.beginPath();
  pen.arc(x, y, r, 0, 7);
  pen.fill();
}

//   V      the view of the head for its turn (see view()): where each feature sits
//   feel   {wonder, smile}, each 0 to 1
function ladyFace(shut, mouth, glance, V, feel) {
  var lift = (mouth ? 5 * mouth.open : 0) + 7 * feel.wonder + 6 * feel.fear - 4 * feel.anger
           - 2 * (shut === true ? 1 : shut || 0);                 // the brows drop a little in a blink
  var wide = 1 + 0.3 * feel.wonder - 0.12 * feel.smile + 0.45 * feel.fear - 0.15 * feel.anger - 0.3 * feel.sad;   // the lids
  var knit = 0.35 * feel.anger - 0.3 * feel.sad + 0.15 * feel.fear;   // the brows' inner ends: down in anger, up in sadness
  // The face of the paintings (the hairline is at -316 and the chin at -229).
  // The eyes are at the middle of it, small and long and half-lidded: each a
  // third of the face across, the far one 0.85 of the near, and nearer the
  // nose than a fellow's. The brows are thin arcs one eye-height above them.
  var mid = 1 - Math.abs(V.t);                      // 1 at three-quarter, 0 in profile and full face
  var nearX = V.near + 4 * mid + 2 * V.toFront, farX = V.far + 3 * mid - 2 * V.toFront;
  var nearW = V.nearW * 0.77 * feel.eyes, farW = V.farW * 0.78 * feel.eyes;
  var side = V.side || 0;                           // how far her painted profile has taken over (see view())
  var look = [(glance.length ? glance[0] : glance) * 0.7 + 2.2 * side,   // a small eye's iris has less room to move; in profile it sits in the front half
              (glance.length ? glance[1] : 0) * 0.6];
  if (V.nearW > 2) { eye(nearX, -277, nearW, 4.6 * wide * feel.eyes, shut, look, -1, 1); }
  if (V.nearW > 2) { brow(nearX, -292 - lift + 3 * side, nearW * 1.3, 9, 1.1, knit); }   // in profile the brow lies nearer the eye
  if (V.farW > 2) {                                 // the far eye and its brow: toward profile they go round the edge of the face, and it cuts them
    pen.save();
    if (V.face) { pen.clip(V.face); }
    eye(farX, -277.5, farW, 4.4 * wide * feel.eyes, shut, look, 1, 1);
    brow(farX, -292.5 - lift, farW * 1.3, 8.5, 1.05, -knit);
    pen.restore();
  }
  var frown = clamp(feel.sad + 0.6 * feel.anger);  // the corners of a shut mouth go down
  // A nose as the paintings draw one: a single fine line down from the inner
  // end of the brow to the tip, three quarters of the way down the face, and
  // a small curve under it for the nostril. No shading. Turned to the front
  // the line fades and there is a nostril each side; turned to profile it
  // all fades, because there the nose is the face's outline.
  pen.save();
  pen.lineCap = "round";
  pen.globalAlpha = (1 - V.toProfile) * (1 - 0.6 * V.toFront);
  pen.strokeStyle = "rgba(58, 36, 24, 0.3)";        // the line of the bridge: faint, and only from below the eye
  pen.lineWidth = LINE * 0.5;
  pen.beginPath();
  pen.moveTo(V.nose + (V.tip - V.nose) * 0.25, -274);
  pen.quadraticCurveTo(V.nose + (V.tip - V.nose) * 0.6, -266, V.tip, -259);
  pen.stroke();
  pen.globalAlpha = 1 - V.toProfile;
  pen.strokeStyle = "rgba(58, 36, 24, 0.75)";       // the tip, and the nostril's curve beside it
  pen.lineWidth = LINE * 0.65;
  pen.beginPath();
  pen.moveTo(V.tip, -259);
  pen.quadraticCurveTo(V.tip + 3 * (1 - V.toFront), -254, V.tip - 3 * (1 - V.toFront), -253);
  // In her profile the nostril's curve is the one line of the nose that stays
  // (the rest is the outline): behind the tip, and above the base of the nose.
  // So toward profile it is inked on its own, and does not fade with the tip.
  if (side > 0) {
    pen.stroke();
    pen.globalAlpha = Math.min(1, 1 - V.toProfile + side);
    pen.beginPath();
  }
  pen.moveTo(V.tip - 5 - 2.5 * side, -255.5 - 3 * side);
  pen.quadraticCurveTo(V.tip - 8.5 - 3 * side, -253.5 - 3.3 * side, V.tip - 6 - 4 * side, -251.5 - 3.1 * side);
  pen.stroke();
  if (V.toFront > 0) {                              // the other nostril, as the face comes round
    pen.globalAlpha = V.toFront;
    pen.beginPath();
    pen.moveTo(V.tip + 5, -255.5);
    pen.quadraticCurveTo(V.tip + 8.5, -253.5, V.tip + 6, -251.5);
    pen.stroke();
  }
  pen.restore();
  blush(V.cheek + 6, -250, 15, 0.2);                // a faint wash of pink, low on the cheek: not a disc
  if (V.farCheekR > 1) { blush(V.farCheek - 2, -252, V.farCheekR, 0.2); }
  pen.save();                                       // the mouth is drawn about (24, -244), then put where the turn has it,
  if (V.face) { pen.clip(V.face); }                 // (toward profile its middle is on the face's edge, and only the near half of it is on the face)
  pen.translate(V.mouth, -244);                     // three quarters the size: a small bow, 0.3 of the face across
  pen.scale(V.mouthW * feel.lips * 0.76, 0.82);
  pen.translate(-24, 244);
  if (mouth) {                                      // red lips round an open mouth
    // an open "ah" is wider than it is tall; "ee" is wider and flatter; "oo" is small and round
    var tall = (1.5 + 7.5 * mouth.open * (1 - 0.3 * mouth.wide)) * (1 - 0.25 * mouth.round);
    var across = 7 + 5 * mouth.wide - 2.5 * mouth.round + 3 * mouth.open * (1 - mouth.round);
    pen.beginPath();
    pen.ellipse(24, -241 - tall * 0.15, across, tall, 0, 0, 7);
    pen.fillStyle = "#6a1522";
    pen.fill();
    pen.save();
    pen.clip();                                     // teeth and tongue stay inside the mouth
    if (tall > 5 || mouth.teeth) {                  // teeth show at the top, or on the lip for an F or an S
      pen.fillStyle = "#fffaf0";
      pen.fillRect(10, -241 - tall * 1.15, 28, 3 + tall * 0.3 + (mouth.teeth ? 2 : 0));
    }
    // The tongue has a path of its own (a Path2D), so the mouth's stays the
    // current path and the lips are drawn round the mouth, not round the tongue.
    var tongue = new Path2D();
    if (mouth.tongue) {                             // up behind the teeth, for an L, an N, a D or a T
      tongue.ellipse(24, -241 + tall * 0.15, across * 0.6, tall * 0.5, 0, 0, 7);
    } else if (tall > 6) {                          // in a mouth open wide, it lies at the bottom
      tongue.ellipse(24, -241 + tall * 0.7, across * 0.62, tall * 0.4, 0, 0, 7);
    }
    pen.fillStyle = "#e8727c";
    pen.fill(tongue);
    pen.restore();
    pen.strokeStyle = lipOf("#d2283a");
    pen.lineWidth = 4 + mouth.round * 1.5;
    pen.stroke();
  } else if (feel.smile > 0.5) {                    // a smile: the lips thin, the corners go up
    pen.beginPath();
    pen.moveTo(10, -247);
    pen.quadraticCurveTo(16, -246, 21, -244);       // the upper lip, with a bow in the middle
    pen.quadraticCurveTo(24, -246, 27, -244);
    pen.quadraticCurveTo(32, -246, 38, -247);
    pen.quadraticCurveTo(26, -232, 10, -247);       // a fuller lower lip
    pen.closePath();
    pen.fillStyle = lipOf("#d2283a");
    pen.fill();
    pen.strokeStyle = "rgba(90, 20, 30, 0.7)";
    pen.lineWidth = 1.5 * FINE;
    pen.stroke();
    pen.lineWidth = 1.2 * FINE;
    pen.beginPath();                                // the line where the lips meet
    pen.moveTo(12, -246.5);
    pen.quadraticCurveTo(24, -242.5, 36, -246.5);
    pen.stroke();
    pen.fillStyle = "rgba(255, 215, 215, 0.5)";     // a light on the lower lip
    pen.beginPath();
    pen.ellipse(24, -238, 5, 1.5, 0, 0, 7);
    pen.fill();
  } else {                                          // a small bow of a mouth: two peaks above, a fuller lip below
    var down = 4 * frown;                           // a frown: the corners drop, the middle stays
    pen.beginPath();
    pen.moveTo(14, -244 + down);
    pen.quadraticCurveTo(19, -249 + down * 0.3, 23, -246);
    pen.quadraticCurveTo(26, -249 + down * 0.3, 33, -244 + down);
    pen.quadraticCurveTo(26, -234 + down * 0.5, 14, -244 + down);
    pen.closePath();
    pen.fillStyle = lipOf("#c8303f");
    pen.fill();
    pen.strokeStyle = "rgba(90, 20, 30, 0.55)";
    pen.lineWidth = 1.2 * FINE;
    pen.stroke();
    pen.beginPath();                                // the line where the lips meet
    pen.moveTo(15, -244 + down);
    pen.quadraticCurveTo(24, -241 - down * 0.5, 32, -244 + down);
    pen.stroke();
  }
  pen.restore();
}

function manFace(shut, mouth, glance, V, feel) {
  var lift = (mouth ? 6 * mouth.open : 0) + 8 * feel.wonder + 7 * feel.fear - 5 * feel.anger
           - 2 * (shut === true ? 1 : shut || 0);                 // the brows drop a little in a blink
  var wide = 1 + 0.3 * feel.wonder - 0.15 * feel.smile + 0.45 * feel.fear - 0.2 * feel.anger - 0.3 * feel.sad;
  var knit = 0.4 * feel.anger - 0.3 * feel.sad + 0.15 * feel.fear;   // the brows' inner ends: down in anger, up in sadness
  var side = V.side || 0;                           // how far his profile has taken over (see view())
  var look = glance.length ? [glance[0] + 2.5 * side, glance[1]] : glance + 2.5 * side;   // in profile the iris sits in the front half
  if (V.nearW > 2) { eye(V.near + 1, -282, V.nearW * 0.93 * feel.eyes, 8.5 * wide * feel.eyes, shut, look, -1, 0); }   // long, narrow eyes
  if (V.nearW > 2) { brow(V.near + 1, -312 - lift, V.nearW * 0.93, 10, 2.8, knit); }
  if (V.farW > 2) {                                 // the far eye and its brow: toward profile they go round the edge of the face, and it cuts them
    pen.save();
    if (V.face) { pen.clip(V.face); }
    eye(V.far + 1, -283, V.farW * 0.96 * feel.eyes, 8 * wide * feel.eyes, shut, look, 1, 0);
    brow(V.far + 1, -313 - lift, V.farW * 0.96, 9, 2.5, -knit);
    pen.restore();
  }
  var frown = clamp(feel.sad + 0.6 * feel.anger);  // the corners of a shut mouth go down
  blush(V.cheek, -254, 16);
  // A fellow's mouth. Shut, it is a smile: one line that turns up at the
  // corners, and a short line under it for the lower lip. Singing, it opens
  // downward from the upper lip, as wide or as round as the vowel asks:
  // teeth show at the top and a tongue below. It is drawn about x = 25, and
  // put where the turn has it.
  var open = mouth ? 5 + 13 * mouth.open : 0;
  var half = mouth ? 13 + 3 * mouth.wide - 5 * mouth.round : 13;
  pen.save();
  if (V.face) { pen.clip(V.face); }                 // (toward profile its middle is on the face's edge, and only the near half of it is on the face)
  pen.translate(V.mouth + 1, 0);
  pen.scale(V.mouthW * feel.lips, 1);
  pen.translate(-25, 0);
  pen.lineCap = "round";
  pen.lineJoin = "round";
  if (open > 0) {
    pen.beginPath();
    pen.moveTo(25 - half, -247);
    pen.quadraticCurveTo(25, -252, 25 + half, -248);           // the upper lip
    pen.bezierCurveTo(25 + half * 0.9, -246 + open * 1.25, 25 - half * 0.8, -245 + open * 1.25, 25 - half, -247);
    pen.closePath();
    pen.fillStyle = "#5a1420";
    pen.fill();
    pen.save();
    pen.clip();                                     // teeth and tongue stay inside the mouth
    pen.fillStyle = "#fffaf0";
    pen.fillRect(6, -254, 40, 8.5);
    var tongue = new Path2D();                      // a path of its own, so the ink line goes round the mouth, not round the tongue
    tongue.ellipse(25, -244 + open * (mouth.tongue ? 0.5 : 1.05), half * 0.65, open * 0.45, 0, 0, 7);   // up for an L
    pen.fillStyle = "#e8727c";
    pen.fill(tongue);
    pen.restore();
    pen.strokeStyle = INK;
    pen.lineWidth = LINE;
    pen.stroke();
  } else {
    pen.strokeStyle = INK;
    pen.lineWidth = LINE + 0.4 * FINE;
    pen.beginPath();
    var grin = 4 * feel.smile - 6 * frown;          // a bigger smile: the corners go higher; a frown: down
    pen.moveTo(11, -249 - grin);
    pen.quadraticCurveTo(13, -246 - grin * 0.3, 17, -245 - grin * 0.2);   // a corner that turns up
    pen.quadraticCurveTo(26, -242 + grin * 0.5, 35, -246 - grin * 0.2);
    pen.quadraticCurveTo(38, -248 - grin * 0.3, 39, -251 - grin);
    pen.stroke();
  }
  pen.strokeStyle = "rgba(58, 36, 24, 0.45)";       // the lower lip, and the dent under it
  pen.lineWidth = 2 * FINE;
  pen.beginPath();
  pen.moveTo(18, -238 + open * 0.95);
  pen.quadraticCurveTo(26, -235 + open * 0.95, 34, -239 + open * 0.95);
  pen.stroke();
  pen.restore();
  // A fellow's nose is the lady's nose, drawn bigger and broader: a bridge
  // down from between the eyes, a blunt tip, and the wing of one nostril.
  // It is a line on the face, not a ball stuck to it; in profile it fades,
  // because there the nose is the outline.
  pen.save();
  pen.globalAlpha = 1 - V.toProfile;
  pen.fillStyle = "rgba(200, 120, 90, 0.12)";       // its shadow side
  pen.beginPath();
  pen.ellipse(V.nose, -272, 7 - 2 * V.toFront, 15, 0.12, 0, 7);
  pen.fill();
  pen.strokeStyle = INK;
  pen.lineWidth = LINE;
  pen.lineCap = "round";
  pen.lineJoin = "round";
  pen.beginPath();
  pen.moveTo(V.nose - 1, -288);
  pen.quadraticCurveTo(V.nose + 1, -274, V.tip + 3, -267);        // down the bridge to the tip
  pen.quadraticCurveTo(V.tip + 8, -260, V.tip - 1, -257);         // round the tip, and under
  pen.quadraticCurveTo(V.tip - 5, -256, V.tip - 7, -259);
  pen.stroke();
  pen.globalAlpha = Math.min(1, 1 - V.toProfile + side);          // the wing and the nostril stay in his profile: there they are all of the nose that is not outline
  pen.lineWidth = 2 * FINE;
  pen.beginPath();
  pen.arc(V.tip - 11 + 3 * side, -261, 5, Math.PI * 0.6, Math.PI * 1.4);     // the wing of the nostril
  pen.stroke();
  pen.fillStyle = "rgba(58, 36, 24, 0.75)";         // a nostril
  pen.beginPath();
  pen.ellipse(V.tip - 4, -259, 2.6, 1.6, 0.3, 0, 7);
  pen.fill();
  if (V.toFront > 0) {                              // the other nostril, as the face comes round
    pen.globalAlpha = V.toFront;
    pen.beginPath();
    pen.ellipse(V.tip + 6, -259, 2.6, 1.6, -0.3, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// One woven band across a cloth: from "left" to "right", bowed toward "mid".
// "kind" is nothing (a line), "zigzag", "diamonds", "dots", "braid" or
// "roundels". What stands up from the band stands across it, whichever way
// the band runs: (ux, uy) is the way along it, and (-uy, ux) the way across.
function stripe(left, mid, right, colour, width, kind) {
  var far = Math.sqrt((right[0] - left[0]) * (right[0] - left[0]) + (right[1] - left[1]) * (right[1] - left[1])) || 1;
  var ux = (right[0] - left[0]) / far, uy = (right[1] - left[1]) / far;
  function along(u) {                               // a point on the band: 0 at the left end, 1 at the right
    return [(1 - u) * (1 - u) * left[0] + 2 * (1 - u) * u * mid[0] + u * u * right[0],
            (1 - u) * (1 - u) * left[1] + 2 * (1 - u) * u * mid[1] + u * u * right[1]];
  }
  function off(p, a, c) { return [p[0] + ux * a - uy * c, p[1] + uy * a + ux * c]; }   // so far along the band from p, and so far across it
  var p, q;
  pen.strokeStyle = colour;
  pen.fillStyle = colour;
  pen.lineWidth = width;
  pen.lineJoin = "round";
  pen.beginPath();
  if (kind === "zigzag") {                          // a row of teeth
    for (var tooth = 0; tooth <= 8; tooth++) {
      p = off(along(tooth / 8), 0, tooth % 2 ? -4 : 4);
      pen.lineTo(p[0], p[1]);
    }
    pen.stroke();
  } else if (kind === "diamonds") {                 // a row of small diamonds, as a woven band has
    for (var gem = 0; gem < 12; gem++) {
      p = along(gem / 12 + 1 / 24);
      q = off(p, 0, -3.2);
      pen.moveTo(q[0], q[1]);
      q = off(p, 2.8, 0);
      pen.lineTo(q[0], q[1]);
      q = off(p, 0, 3.2);
      pen.lineTo(q[0], q[1]);
      q = off(p, -2.8, 0);
      pen.lineTo(q[0], q[1]);
      pen.closePath();
    }
    pen.fill();
  } else if (kind === "dots") {                     // a row of dots
    for (var dot = 0; dot < 16; dot++) {
      p = along(dot / 16 + 1 / 32);
      pen.moveTo(p[0] + 1.4, p[1]);
      pen.arc(p[0], p[1], 1.4, 0, 7);
    }
    pen.fill();
  } else if (kind === "braid") {                    // two strands that cross and cross again: an interlace
    for (var strand = -1; strand <= 1; strand += 2) {
      for (var bit = 0; bit <= 60; bit++) {
        p = along(bit / 60);
        if (bit === 0) { pen.moveTo(p[0], p[1]); }
        else {
          q = off(p, 0, strand * 4.5 * Math.sin(bit / 60 * Math.PI * 14));
          pen.lineTo(q[0], q[1]);
        }
      }
    }
    pen.stroke();
  } else if (kind === "checks" || kind === "checks-odd") {   // squares of the band's width, every other one: bands "checks" and
    var squares = Math.max(2, Math.round(far / (2 * width))), sq;   // "checks-odd" stacked make a check, the pha ta kong of a Lanna man
    for (sq = kind === "checks" ? 0 : 1; sq < squares * 2; sq += 2) {
      p = along((sq + 0.5) / (squares * 2));
      q = off(p, -width / 2, -width / 2);
      pen.moveTo(q[0], q[1]);
      q = off(p, width / 2, -width / 2);
      pen.lineTo(q[0], q[1]);
      q = off(p, width / 2, width / 2);
      pen.lineTo(q[0], q[1]);
      q = off(p, -width / 2, width / 2);
      pen.lineTo(q[0], q[1]);
      pen.closePath();
    }
    pen.fill();
  } else if (kind === "roundels") {                 // a row of rings, each with a dot at its heart
    for (var ring = 0; ring < 9; ring++) {
      p = along(ring / 9 + 1 / 18);
      pen.moveTo(p[0] + 4.6, p[1]);
      pen.arc(p[0], p[1], 4.6, 0, 7);
    }
    pen.stroke();
    pen.beginPath();
    for (ring = 0; ring < 9; ring++) {
      p = along(ring / 9 + 1 / 18);
      pen.moveTo(p[0] + 1.5, p[1]);
      pen.arc(p[0], p[1], 1.5, 0, 7);
    }
    pen.fill();
  } else {
    p = off(left, -3, 0);
    q = off(right, 3, 0);
    pen.moveTo(p[0], p[1]);
    pen.quadraticCurveTo(mid[0], mid[1], q[0], q[1]);
    pen.stroke();
  }
}

// One tier of cloth, hanging from the waist: a skirt, a coat, or the hem of
// a shirt. Cloth does not swing like a board. A wave runs down it: the waist
// moves first and the hem follows a moment later, so the sides bend into
// soft S-curves, and the side the cloth is leaving swells out.
//   long, wide   how far down it hangs, and half its width at the hem
//   reach        how far the hem swings to each side
//   phase        where the wearer is in their rock from side to side
//   deep         how deep the scallops of the hem are
//   stripes      woven bands, each [how far down (0 to 1), colour, width, kind]: kind is
//                nothing (a line), "zigzag", "diamonds", "dots", "braid" or "roundels";
//                they bend with the cloth, and sag a little across it
//   pushes       [x, y, reach] points under the cloth, such as knees, measured from
//                the waist: an edge within "reach" of one moves out to cover it
function tier(long, wide, reach, phase, colour, deep, stripes, pushes) {
  // a point on one edge: u is 0 at the waist and 1 at the hem
  function edge(u, side) {
    var late = phase - 1.6 * u;                     // lower cloth is later in the swing
    var drift = -reach * Math.pow(u, 1.3) * Math.sin(late);
    var half = 30 + (wide - 30) * Math.pow(u, 0.75);
    half *= 1 - side * Math.cos(late) * 0.16 * u;   // one side swells, the other tucks in
    var level = -6 + (long + 6) * u;
    for (var p = 0; pushes && p < pushes.length; p++) {   // a knee under the cloth pushes it out
      var push = pushes[p], dy = (level - push[1]) / push[2];
      if (push[0] * side > 0 && dy > -1 && dy < 1) {
        var need = Math.abs(push[0]) + 12 - half;
        if (need > 0) { half += need * (1 - dy * dy); }
      }
    }
    return [drift + side * half, level];
  }
  var steps = 12, scallops = 6, n, point;
  pen.beginPath();
  pen.moveTo(-30, -6);
  for (n = 1; n <= steps; n++) {                    // down the left side
    point = edge(n / steps, -1);
    pen.lineTo(point[0], point[1]);
  }
  var left = edge(1, -1), right = edge(1, 1);
  for (n = 0; n < scallops; n++) {                  // along the hem, in scallops
    var from = left[0] + (right[0] - left[0]) * n / scallops;
    var to = left[0] + (right[0] - left[0]) * (n + 1) / scallops;
    var dip = deep * (1 + 0.5 * Math.sin(clock * 5 + n * 1.3 + long * 0.05));
    pen.quadraticCurveTo((from + to) / 2, long + dip, to, long);
  }
  for (n = steps - 1; n >= 0; n--) {                // and up the right side
    point = edge(n / steps, 1);
    pen.lineTo(point[0], point[1]);
  }
  pen.closePath();
  shape(colour);
  pen.save();
  pen.clip();                                       // stripes and shadow stay inside the cloth
  for (n = 0; stripes && n < stripes.length; n++) {
    var at = stripes[n][0], left = edge(at, -1), right = edge(at, 1);
    var sag = wide * 0.1;                           // a band sags a little across the cloth
    stripe(left, [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2 + sag * 2], right, stripes[n][1], stripes[n][2], stripes[n][3]);
  }
                                                    // the back of the cloth is in shadow,
                                                    // and so is the cloth just under the tier above
  var shadow = pen.createLinearGradient(-wide, 0, wide * 0.2, 0);
  shadow.addColorStop(0, "rgba(60, 30, 50, 0.3)");
  shadow.addColorStop(1, "rgba(60, 30, 50, 0)");
  pen.fillStyle = shadow;
  pen.fillRect(-wide * 2, 0, wide * 4, long + deep * 2);
  var under = pen.createLinearGradient(0, long * 0.45, 0, long * 0.7);
  under.addColorStop(0, "rgba(60, 30, 50, 0.16)");
  under.addColorStop(1, "rgba(60, 30, 50, 0)");
  pen.fillStyle = under;
  pen.fillRect(-wide * 2, long * 0.45, wide * 4, long * 0.25);
  pen.restore();
  pen.strokeStyle = "rgba(60, 30, 20, 0.22)";       // two folds, which bend with the cloth
  pen.lineWidth = 2 * FINE;
  for (var fold = -1; fold <= 1; fold += 2) {
    pen.beginPath();
    for (n = 2; n <= steps; n++) {
      var a = edge(n / steps, -1), b = edge(n / steps, 1);
      var x = (a[0] + b[0]) / 2 + fold * (b[0] - a[0]) * 0.2;
      if (n === 2) { pen.moveTo(x, a[1]); } else { pen.lineTo(x, a[1] - 4); }
    }
    pen.stroke();
  }
}

// one rolled curl of hair, with the light on it
function curl(x, y, r) {
  pen.beginPath();
  pen.ellipse(x, y, r, r * 0.86, 0, 0, 7);
  pen.fillStyle = "#2a1a12";
  pen.fill();
  pen.strokeStyle = "#7a5640";
  pen.lineWidth = 2.5 * FINE;
  pen.stroke();
  pen.lineWidth = 2 * FINE;                                // the roll: a spiral, from the middle out
  pen.beginPath();
  for (var turn = 0; turn <= 9; turn += 0.3) {
    pen.lineTo(x + Math.cos(turn) * r * turn / 11, y + Math.sin(turn) * r * 0.86 * turn / 11);
  }
  pen.stroke();
}

// One lock of hair, hanging from (x, y) and ending in a rolled curl. The
// root is fixed to the head. A wave runs down the lock, so the tip swings
// the furthest and the latest, as the hem of a skirt does.
//   long, wide   the length of the lock, and half its width
//   swing        how far the tip swings to each side
//   shove        [across, down]: a lag for the tip, from follow()
function lock(x, y, long, wide, swing, phase, plain, shove) {
  var parts = 8, left = [], right = [], middles = [], n;
  for (n = 0; n <= parts; n++) {
    var down = n / parts;                           // 0 at the root, 1 at the tip
    var middle = x + Math.sin(down * 3.4) * wide * (plain ? 0.1 : 0.3)   // the wave set in the hair
               + Math.sin(phase - down * 2.4) * swing * down * down
               + (shove ? shove[0] * down * down : 0);                 // and the lag of the tip behind the head
    var half = plain ? wide * (1 - 0.75 * down) : wide * (0.55 + 0.6 * Math.sin(down * Math.PI * 0.85));
    var level = y + long * down + (shove ? shove[1] * 0.3 * down * down : 0);
    left.push([middle - half, level]);
    right.push([middle + half, level]);
    middles.push([middle, level]);
  }
  pen.beginPath();
  pen.moveTo(left[0][0], left[0][1]);
  for (n = 1; n < parts; n++) {                     // down one side, in soft curves
    pen.quadraticCurveTo(left[n][0], left[n][1],
                         (left[n][0] + left[n + 1][0]) / 2, (left[n][1] + left[n + 1][1]) / 2);
  }
  pen.lineTo(right[parts][0], right[parts][1]);
  for (n = parts - 1; n > 0; n--) {                 // and back up the other
    pen.quadraticCurveTo(right[n][0], right[n][1],
                         (right[n][0] + right[n - 1][0]) / 2, (right[n][1] + right[n - 1][1]) / 2);
  }
  pen.closePath();
  pen.fillStyle = "#2a1a12";
  pen.fill();
  pen.strokeStyle = "#7a5640";
  pen.lineWidth = 3 * FINE;
  pen.lineJoin = "round";
  pen.stroke();
  pen.strokeStyle = "rgba(255, 235, 210, 0.35)";    // one strand catches the light
  pen.lineWidth = 2 * FINE;
  pen.beginPath();
  pen.moveTo(middles[1][0], middles[1][1]);
  for (n = 2; n < parts; n++) { pen.lineTo(middles[n][0], middles[n][1]); }
  pen.stroke();
  if (!plain) { curl(middles[parts][0], middles[parts][1], wide * 1.15); }
}

// the lines a comb leaves in hair: each is [fromX, fromY, bendX, bendY, toX, toY]
function combed(lines) {
  pen.lineCap = "round";
  for (var n = 0; n < lines.length; n++) {
    var l = lines[n];
    pen.strokeStyle = n % 2 ? "rgba(255, 235, 210, 0.4)" : HAIR_LINE;
    pen.lineWidth = 1.8 * FINE;
    pen.beginPath();
    pen.moveTo(l[0], l[1]);
    pen.quadraticCurveTo(l[2], l[3], l[4], l[5]);
    pen.stroke();
  }
}

// A hand: a palm, fingers of two joints each, and a thumb. Every part is
// drawn first a little fat in ink and then in colour, so the parts join
// into one shape with one line round it, as a drawn hand has. Only short
// lines between the fingers are left inside.
//   angle    the way the hand points
//   thumb    -1 or 1: the side the thumb is on, so a left hand is not a right hand
//   bare     a lady's hand: skin, four slim fingers, a narrow wrist.
//            Otherwise a white glove: three fat fingers and a rolled cuff.
//   open     0 is a loose fist, 1 is a hand spread wide
//   nails    true for a dancer's gold nail tips; "long" for the long curved nails of fon lep
// A finger has three joints, as a real one has: at the knuckle, in the
// middle and near the tip. Each bends a little more than the one before
// it, so a closing finger rolls up. A thumb has two.
//   curls    five numbers, 0 straight to 1 curled (the first finger to the little
//            one, then the thumb): each finger then curls its own way. A hand
//            model reads them from a video; REST_A and REST_B are a hand at
//            rest. Below 0 a finger bends the other way, away from the thumb's side
function glove(x, y, angle, thumb, bare, open, nails, curls) {
  var colour = bare ? SKIN : "#ffffff";
  var count = bare ? 4 : 3;
  var apart = bare ? 5.2 : 10;                      // from one finger to the next
  var fat = bare ? 2.5 : 7;                         // half the width of a finger
  var palm = bare ? 9.5 : 15;
  // Past 1, "open" is the dance hand of Thai dance: the fingers bend back
  // from the knuckles and fan, and the thumb comes round to the first finger.
  var back = Math.max(0, open - 1);
  open = Math.min(1, open);
  var spread = 0.04 + 0.2 * open + 0.22 * back;   // from one finger to the next: the fan
  var curl = 0.12 + 1.0 * (1 - open);             // a closing finger rolls up, joint by joint
  var arch = 0.5 * back;                          // the dance hand bends back at the knuckle, then runs nearly straight
  // No two fingers are the same length. From the thumb's side: the first
  // finger, the long middle one, the next, and the little finger.
  var lengths = bare ? [1.02, 1.16, 1.08, 0.84] : [1, 1.12, 0.9];
  var fingers = [], n, k;
  for (n = 0; n < count; n++) {
    var place = n - (count - 1) / 2;                // -1, 0, 1 for three fingers
    var fromThumb = thumb > 0 ? count - 1 - n : n;  // 0 for the finger beside the thumb
    var long = (bare ? 12.5 : 10) * lengths[fromThumb];
    var baseX = 13 - Math.abs(place) * 1.5, baseY = place * apart;
    var mine = (curls ? 0.08 + 1.3 * curls[Math.min(fromThumb, 3)]   // a finger read from a hand: its own curl
              : back > 0 ? 0 : curl + (bare ? 0.1 * fromThumb : 0))   // the little finger curls the most;
             + (curls ? 0.03 : 0.1) * Math.sin(clock * 7 + n * 1.7);  // each finger moves a little by itself
    var fan = place * spread * (0.6 + 0.4 * Math.abs(place));   // the outer fingers part more than the middle two
    var first = fan + thumb * (mine * 0.4 - arch * 0.6);        // the first joint
    var second = first + thumb * (mine * 0.75 - arch * 0.3);    // the second bends further
    var third = second + thumb * (mine * 0.55 - arch * 0.1);    // and the third further still
    var oneX = baseX + Math.cos(first) * long * 0.8, oneY = baseY + Math.sin(first) * long * 0.8;
    var twoX = oneX + Math.cos(second) * long * 0.62, twoY = oneY + Math.sin(second) * long * 0.62;
    var tipX = twoX + Math.cos(third) * long * 0.5, tipY = twoY + Math.sin(third) * long * 0.5;
    var thin = bare ? 0.6 : 0.84;                   // a bare finger narrows to its tip
    var puff = bare ? 0.3 : 1;                      // a glove's fingers are plump; a bare one is even
    fingers.push([[baseX, baseY, oneX, oneY, fat * 1.04, fat * 0.94, 0.4 * puff],
                  [oneX, oneY, twoX, twoY, fat * 0.94, fat * (0.5 + thin / 2), 0.6 * puff],   // the knuckle swells
                  [twoX, twoY, tipX, tipY, fat * (0.5 + thin / 2), fat * thin, 0.3 * puff]]);
  }
  // the thumb leaves the side of the palm, and folds across it in a fist
  var thumbTurn = thumb * (curls ? 1.15 - 1.1 * curls[4] : 1.15 - 0.75 * (1 - open) - 1.3 * back);
  var thumbLong = bare ? 13 : 15;
  var thumbX = Math.cos(thumbTurn) * thumbLong, thumbY = thumb * palm * 0.7 + Math.sin(thumbTurn) * thumbLong;
  fingers.push([[-4, thumb * palm * 0.6, thumbX, thumbY, fat * 1.2, fat * 1.05, 0.5],
                [thumbX, thumbY, thumbX + Math.cos(thumbTurn - thumb * 0.5) * thumbLong * 0.7,
                 thumbY + Math.sin(thumbTurn - thumb * 0.5) * thumbLong * 0.7, fat * 1.05, fat * 0.85, 0.4]]);
  // the palm: narrow at the wrist, wide at the knuckles
  var palmPart = [-13, 0, 7, 0, bare ? 6.5 : 12, palm, bare ? 1.2 : 2.5];

  function fill(part, more, paint) {
    bone(part[0], part[1], part[2], part[3], part[4] + more, part[5] + more, part[6]);
    pen.fillStyle = paint;
    pen.fill();
  }

  pen.save();
  pen.translate(x, y);
  pen.rotate(angle);
  var line = LINE / (bare ? 1 : 1.25);              // the hand is scaled, so its line is scaled back
  var ink = inkFor(colour);
  heavy(ink);                                       // 1. the whole hand in ink: its outline
  fill(palmPart, line, ink);
  for (n = 0; n < fingers.length; n++) {
    for (k = 0; k < fingers[n].length; k++) { fill(fingers[n][k], line, ink); }
  }
  light();
  // 2. One finger at a time: a thin line of ink, then its colour. Where a
  // finger lies against the next one, that line is all that parts them,
  // and it runs the whole length of the finger, as it does on a hand.
  for (n = 0; n < fingers.length; n++) {
    for (k = 0; k < fingers[n].length; k++) { fill(fingers[n][k], line * 0.55, ink); }
    for (k = 0; k < fingers[n].length; k++) { fill(fingers[n][k], 0, colour); }
  }
  fill(palmPart, 0, colour);                        // 3. the palm last: no line where a finger begins
  fill([-14, thumb * 3, -4, thumb * (palm * 0.55), (bare ? 4 : 6), (bare ? 5 : 7), 1.5], 0, colour);   // the heel of the hand, below the thumb
  pen.strokeStyle = bare ? "rgba(150, 70, 60, 0.4)" : "rgba(58, 36, 24, 0.35)";
  pen.lineWidth = 1.2 * FINE;
  pen.beginPath();
  for (n = 0; n < count; n++) {                     // the knuckles: a short curve at each finger's base
    var kb = fingers[n][0];
    pen.moveTo(kb[0] - 2, kb[1] - fat * 0.6);
    pen.quadraticCurveTo(kb[0] + 1.5, kb[1], kb[0] - 2, kb[1] + fat * 0.6);
  }
  pen.stroke();
  if (bare && !nails) {                             // nails on the fingertips
    pen.fillStyle = "rgba(255, 240, 230, 0.85)";
    for (n = 0; n < count; n++) {
      var tipSeg = fingers[n][2], tdx = tipSeg[2] - tipSeg[0], tdy = tipSeg[3] - tipSeg[1];
      var tl = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
      pen.beginPath();
      pen.ellipse(tipSeg[2] - tdx / tl * 2.2, tipSeg[3] - tdy / tl * 2.2, 2.2, 1.4, Math.atan2(tdy, tdx), 0, 7);
      pen.fill();
    }
  }
  if (nails && bare) {                              // the gold nail extensions of a dancer
    // "long" is the nail of fon lep, the fingernail dance: a finger and a
    // half long, and curving back, away from the palm, as the fingers do.
    var nailLong = nails === "long" ? 36 : 15, curve = nails === "long" ? 0.36 : 0;
    for (n = 0; n < count; n++) {
      var last = fingers[n][2], ddx = last[2] - last[0], ddy = last[3] - last[1];
      var dl = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
      var ux = ddx / dl, uy = ddy / dl, px = -uy * -thumb, py = ux * -thumb;     // along the finger, and across it, away from the thumb's side
      var endX = last[2] + ux * nailLong + px * nailLong * curve, endY = last[3] + uy * nailLong + py * nailLong * curve;
      pen.beginPath();
      pen.moveTo(last[2] - uy * 1.9, last[3] + ux * 1.9);
      pen.quadraticCurveTo(last[2] + ux * nailLong * 0.6 - uy * 1.2, last[3] + uy * nailLong * 0.6 + ux * 1.2, endX, endY);
      pen.quadraticCurveTo(last[2] + ux * nailLong * 0.6 + uy * 1.2, last[3] + uy * nailLong * 0.6 - ux * 1.2,
                           last[2] + uy * 1.9, last[3] - ux * 1.9);
      pen.closePath();
      pen.fillStyle = STYLE.gold;
      pen.fill();
      if (nails === "long") {
        pen.strokeStyle = "rgba(110, 70, 20, 0.8)";
        pen.lineWidth = 0.8;
        pen.stroke();
      }
    }
  }
  pen.strokeStyle = ink;
  pen.lineCap = "round";
  if (!bare) {
    pen.lineWidth = 1.6 * FINE;
    for (var mark = -1; mark <= 1; mark++) {        // three short seams on the back of a glove
      pen.beginPath();
      pen.moveTo(-9, mark * 5.5);
      pen.lineTo(-3, mark * 5.5);
      pen.stroke();
    }
    heavy(ink);
    fill([-19, -11, -19, 11, 6, 6, 0], line, ink);  // the rolled cuff, across the wrist
    light();
    fill([-19, -11, -19, 11, 6, 6, 0], 0, colour);
  } else {
    pen.strokeStyle = "rgba(150, 70, 60, 0.45)";    // on a bare hand, the crease at the base of the thumb
    pen.lineWidth = 1.3 * FINE;
    pen.beginPath();
    pen.moveTo(-6, thumb * 2);
    pen.quadraticCurveTo(0, thumb * 1, 5, thumb * 6);
    pen.stroke();
  }
  pen.restore();
}

// ---------- a hand in the round ----------
// A bare hand drawn from a small skeleton: a palm, four fingers of three
// joints each and a thumb of two, laid out in the hand's own frame (x along
// the hand from the wrist to the fingertips, y across it toward the thumb,
// z out of the back of the hand), bent at their joints, turned as a whole,
// and then seen from the front. Each part lands where it comes to, and the
// parts are painted from the furthest to the nearest, so a finger lies over
// the one behind it and a curled finger goes under the palm. A hand can so
// show its back, its edge or its palm, and a fist its knuckles, as the flat
// hand of the 1930s films (glove) cannot. The measures are glove()'s bare
// hand, so that a film's figures keep their hands' size.
//   x, y, angle    the wrist, and the way the hand points, as glove() takes them
//   pose.curls     five numbers, 0 straight to 1 curled: the first finger to the
//                  little one, then the thumb (REST is a hand at rest)
//   pose.spread    0 to 1: how far the fingers fan apart (0.15 at rest)
//   pose.arch      0 to 1: the fingers bent back at the knuckle, as the dance hand holds them
//   pose.thumb     1 or -1: which side the thumb is on, as glove() takes it (the two hands are mirrors)
//   pose.palm      the turn of the hand about its own length: 0 the back toward us, 1 the palm,
//                  0.5 the thumb's edge toward us, -0.5 the little finger's edge
//   pose.pitch     the turn about the across line, in radians: above 0 the fingertips come toward us
//   pose.nails     as glove(): true for gold tips, "long" for the nails of fon lep
//   pose.colour    the skin (SKIN unless told)
var HAND = {palm: 9.5, wrist: 6.5, knuckle: 13, apart: 5.2, fat: 2.5, thick: 2.4, finger: 12.5,
            lengths: [1.02, 1.16, 1.08, 0.84], thumb: 13};
var REST = [0.2, 0.26, 0.32, 0.38, 0.45];           // a hand hanging at rest: the fingers gently curled, the little one most

function hand(x, y, angle, pose) {
  var curls = pose.curls || REST, spread = pose.spread === undefined ? 0.15 : pose.spread, arch = pose.arch || 0;
  var thumb = pose.thumb || 1, roll = (pose.palm || 0) * Math.PI, pitch = pose.pitch || 0;
  var colour = pose.colour || SKIN, ink = inkFor(colour), line = LINE, n, k;
  var cr = Math.cos(roll), sr = Math.sin(roll), cp = Math.cos(pitch), sp = Math.sin(pitch);
  // A point of the hand's frame as it is seen: mirrored for the other hand,
  // turned about x by the roll, about y by the pitch: [across, down, depth]
  function see(px, py, pz) {
    py *= thumb;
    var ry = py * cr - pz * sr, rz = py * sr + pz * cr;
    return [px * cp + rz * sp, ry, -px * sp + rz * cp];
  }
  // The back of a part faces us by this much (1 to -1): its normal's depth
  function facing(nx, ny, nz) { return see(nx, ny, nz)[2]; }
  // A part is a bone between two points of the frame, round (a finger) or a
  // slab (the palm: as wide as the hand across, as thick as a palm is, so
  // seen edge-on it is thin): [depth, ax, ay, bx, by, wideA, wideB, swell, back, kind, unit].
  // The parts of one finger are one unit: inked and painted together, so
  // that no line crosses a finger at its joints.
  var parts = [], unit = 0;
  function part(a, b, wideA, wideB, swell, slab, kind, normal) {
    var A = see(a[0], a[1], a[2]), B = see(b[0], b[1], b[2]);
    if (slab) {                                     // the slab's half-width across the bone, as seen: its width where it faces us, its thickness edge-on
      var dx = B[0] - A[0], dy = B[1] - A[1], far = Math.sqrt(dx * dx + dy * dy) || 1;
      var across = see(0, 1, 0), up = see(0, 0, 1);
      var acrossSeen = Math.abs((-across[0] * dy + across[1] * dx) / far), upSeen = Math.abs((-up[0] * dy + up[1] * dx) / far);
      wideA = Math.sqrt(wideA * wideA * acrossSeen * acrossSeen + HAND.thick * HAND.thick * upSeen * upSeen);
      wideB = Math.sqrt(wideB * wideB * acrossSeen * acrossSeen + HAND.thick * HAND.thick * upSeen * upSeen);
    }
    parts.push([(A[2] + B[2]) / 2, A[0], A[1], B[0], B[1], wideA, wideB, swell, normal ? facing(normal[0], normal[1], normal[2]) : 0, kind, unit]);
  }
  // the palm, and the heel of the hand below the thumb
  part([-13, 0, 0], [7, 0, 0], HAND.wrist, HAND.palm, 1.2, true, "palm", [0, 0, 1]);
  unit++;
  part([-14, 3, -0.5], [-4, HAND.palm * 0.55, -0.5], 4, 5, 1.5, true, "heel");
  // The fingers: each from its knuckle, fanned a little, and curled toward
  // the palm joint by joint, the second more than the first and the third
  // more still, so a closing finger rolls up. The first finger stands beside
  // the thumb. No two are the same length (HAND.lengths).
  var tips = [];
  for (n = 0; n < 4; n++) {
    unit++;
    var place = 1.5 - n;                            // 1.5 for the first finger, -1.5 for the little one
    var long = HAND.finger * HAND.lengths[n];
    var base = [HAND.knuckle - Math.abs(place) * 1.5, place * HAND.apart, 0];
    var mine = 0.08 + 1.3 * curls[n] + 0.03 * Math.sin(clock * 7 + n * 1.7);   // its own curl, and a little life
    var fan = place * spread * (0.6 + 0.4 * Math.abs(place));
    var dirX = Math.cos(fan), dirY = Math.sin(fan); // the way it leaves the knuckle, in the palm's plane
    var bends = [mine * 0.62 - arch * 0.6, mine * 0.7 - arch * 0.3, mine * 0.5 - arch * 0.1];   // a fist folds most at the knuckle, so from the back it shows knuckles, not fingers
    var lens = [long * 0.8, long * 0.62, long * 0.5];
    var wides = [[HAND.fat * 1.04, HAND.fat * 0.94, 0.12], [HAND.fat * 0.94, HAND.fat * 0.8, 0.18], [HAND.fat * 0.8, HAND.fat * 0.6, 0.09]];
    var at = base, bent = 0, d;
    for (k = 0; k < 3; k++) {
      bent += bends[k];                             // the joints add up: each bends further than the one before it
      d = [dirX * Math.cos(bent), dirY * Math.cos(bent), -Math.sin(bent)];   // into the palm as it bends
      var next = [at[0] + d[0] * lens[k], at[1] + d[1] * lens[k], at[2] + d[2] * lens[k]];
      part(at, next, wides[k][0], wides[k][1], wides[k][2], false, k === 0 ? "knuckle" : k === 2 ? "tip" : "finger",
           [dirX * Math.sin(bent), dirY * Math.sin(bent), Math.cos(bent)]);   // the back of this joint
      at = next;
    }
    tips.push([at, d, [dirX * Math.sin(bent), dirY * Math.sin(bent), Math.cos(bent)], [-dirY, dirX, 0]]);
  }
  // The thumb leaves the side of the palm, and folds across it in a fist:
  // as it curls it turns in toward the fingers and dips toward the palm.
  var tt = 1.15 - 1.1 * curls[4], dip = 0.35 * curls[4];
  var t0 = [-4, HAND.palm * 0.6, -1];
  var t1 = [t0[0] + Math.cos(tt) * Math.cos(dip) * HAND.thumb, t0[1] + Math.sin(tt) * Math.cos(dip) * HAND.thumb, t0[2] - Math.sin(dip) * HAND.thumb];
  var tt2 = tt - 0.5, dip2 = dip + 0.3 * curls[4];
  var t2 = [t1[0] + Math.cos(tt2) * Math.cos(dip2) * HAND.thumb * 0.7, t1[1] + Math.sin(tt2) * Math.cos(dip2) * HAND.thumb * 0.7, t1[2] - Math.sin(dip2) * HAND.thumb * 0.7];
  unit++;
  part(t0, t1, HAND.fat * 1.2, HAND.fat * 1.05, 0.2, false, "thumb", [0, 0, 1]);
  part(t1, t2, HAND.fat * 1.05, HAND.fat * 0.85, 0.15, false, "thumbtip", [Math.sin(dip2) * Math.cos(tt2), Math.sin(dip2) * Math.sin(tt2), Math.cos(dip2)]);
  // The units, each with the depth of its parts' middle, the furthest
  // first. The palm goes after the fingers that lie level with it, so no
  // line shows where a finger begins (as glove() has it).
  var units = [];
  for (n = 0; n < parts.length; n++) {
    var u = parts[n][10];
    if (!units[u]) { units[u] = {depth: 0, count: 0, parts: []}; }
    units[u].parts.push(parts[n]);
    units[u].depth += parts[n][0];
    units[u].count++;
  }
  units = units.filter(function (one) { return one; });
  units.forEach(function (one) { one.depth = one.depth / one.count + (one.parts[0][9] === "palm" ? 0.3 : 0); });
  units.sort(function (a, b) { return a.depth - b.depth; });

  function fill(p, more, paint) {
    bone(p[1], p[2], p[3], p[4], p[5] + more, p[6] + more, p[7]);
    pen.fillStyle = paint;
    pen.fill();
  }

  pen.save();
  pen.translate(x, y);
  pen.rotate(angle);
  heavy(ink);                                       // 1. the whole hand in ink: its outline
  for (n = 0; n < parts.length; n++) { fill(parts[n], line, ink); }
  light();
  for (n = 0; n < units.length; n++) {              // 2. each unit, the furthest first: a thin line of ink round it, then its colour
    for (k = 0; k < units[n].parts.length; k++) { fill(units[n].parts[k], line * 0.55, ink); }
    for (k = 0; k < units[n].parts.length; k++) { fill(units[n].parts[k], 0, colour); }
  }
  // 3. what is drawn on the skin: the knuckles and the nails on the back of
  // the hand, the creases on the palm, each as far as that side faces us
  var backUp = facing(0, 0, 1), palmUp = -backUp;
  pen.lineWidth = 1.2 * FINE;
  pen.lineCap = "round";
  if (backUp > 0.15) {
    pen.strokeStyle = "rgba(150, 70, 60, " + (0.4 * clamp((backUp - 0.15) / 0.4)) + ")";
    pen.beginPath();
    for (n = 0; n < parts.length; n++) {
      var p = parts[n];
      if (p[9] !== "knuckle" || p[8] < 0.3) { continue; }
      var ux = p[3] - p[1], uy = p[4] - p[2], ul = Math.sqrt(ux * ux + uy * uy) || 1;
      ux /= ul; uy /= ul;
      pen.moveTo(p[1] - ux * 2 - uy * HAND.fat * 0.6, p[2] - uy * 2 + ux * HAND.fat * 0.6);
      pen.quadraticCurveTo(p[1] + ux * 1.5, p[2] + uy * 1.5, p[1] - ux * 2 + uy * HAND.fat * 0.6, p[2] - uy * 2 - ux * HAND.fat * 0.6);
    }
    pen.stroke();
    pen.strokeStyle = "rgba(150, 70, 60, " + (0.45 * clamp((backUp - 0.15) / 0.4)) + ")";   // the crease at the base of the thumb
    pen.lineWidth = 1.3 * FINE;
    var c0 = see(-6, 2, 0), c1 = see(0, 1, 0), c2 = see(5, 6, 0);
    pen.beginPath();
    pen.moveTo(c0[0], c0[1]);
    pen.quadraticCurveTo(c1[0], c1[1], c2[0], c2[1]);
    pen.stroke();
  }
  if (palmUp > 0.15) {                              // the two lines across the palm, and the one round the thumb's root
    pen.strokeStyle = "rgba(150, 70, 60, " + (0.45 * clamp((palmUp - 0.15) / 0.4)) + ")";
    pen.lineWidth = 1.3 * FINE;
    var creases = [[[-2, 9, -0.5], [2, 1, -0.5], [6, -8, -0.5]], [[0, 7, -0.5], [-3, 0, -0.5], [-2, -8, -0.5]], [[-9, 7, -0.5], [-4, 3, -0.5], [2, 0, -0.5]]];
    pen.beginPath();
    for (n = 0; n < creases.length; n++) {
      var a = see(creases[n][0][0], creases[n][0][1], creases[n][0][2]), m = see(creases[n][1][0], creases[n][1][1], creases[n][1][2]), b = see(creases[n][2][0], creases[n][2][1], creases[n][2][2]);
      pen.moveTo(a[0], a[1]);
      pen.quadraticCurveTo(m[0], m[1], b[0], b[1]);
    }
    pen.stroke();
  }
  for (n = 0; n < 4; n++) {                         // the nails, on the back of each fingertip
    var tip = tips[n], seen = facing(tip[2][0], tip[2][1], tip[2][2]);
    if (pose.nails) {
      // The gold nail tips of a dancer, and "long", the nail of fon lep: a
      // finger and a half long, curving back, away from the palm, as the
      // fingers do. Its spine is bent in the hand's own frame and then
      // seen, so it curves as the hand turns.
      var nailLong = pose.nails === "long" ? 36 : 15, curve = pose.nails === "long" ? 0.55 : 0, spine = [], s;
      for (s = 0; s <= 5; s++) {
        var u = s / 5, turnBy = curve * u * u, ax = tip[1], bk = tip[2];
        var way = [ax[0] * Math.cos(turnBy) + bk[0] * Math.sin(turnBy), ax[1] * Math.cos(turnBy) + bk[1] * Math.sin(turnBy), ax[2] * Math.cos(turnBy) + bk[2] * Math.sin(turnBy)];
        spine.push(see(tip[0][0] + way[0] * nailLong * u, tip[0][1] + way[1] * nailLong * u, tip[0][2] + way[2] * nailLong * u));
      }
      pen.beginPath();
      for (s = 0; s <= 5; s++) {
        var w = 1.9 * (1 - s / 5), v = spine[Math.min(5, s + 1)], q = spine[Math.max(0, s - 1)];
        var ddx = v[0] - q[0], ddy = v[1] - q[1], dl = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
        if (s === 0) { pen.moveTo(spine[s][0] - ddy / dl * w, spine[s][1] + ddx / dl * w); }
        else { pen.lineTo(spine[s][0] - ddy / dl * w, spine[s][1] + ddx / dl * w); }
      }
      for (s = 5; s >= 0; s--) {
        var w2 = 1.9 * (1 - s / 5), v2 = spine[Math.min(5, s + 1)], q2 = spine[Math.max(0, s - 1)];
        var ddx2 = v2[0] - q2[0], ddy2 = v2[1] - q2[1], dl2 = Math.sqrt(ddx2 * ddx2 + ddy2 * ddy2) || 1;
        pen.lineTo(spine[s][0] + ddy2 / dl2 * w2, spine[s][1] - ddx2 / dl2 * w2);
      }
      pen.closePath();
      pen.fillStyle = STYLE.gold;
      pen.fill();
      if (pose.nails === "long") {
        pen.strokeStyle = "rgba(110, 70, 20, 0.8)";
        pen.lineWidth = 0.8;
        pen.stroke();
      }
    } else if (seen > 0.2) {
      var end = see(tip[0][0], tip[0][1], tip[0][2]), dir = see(tip[1][0], tip[1][1], tip[1][2]);
      var dxs = dir[0], dys = dir[1], dls = Math.sqrt(dxs * dxs + dys * dys) || 1;
      pen.fillStyle = "rgba(255, 240, 230, " + (0.85 * clamp((seen - 0.2) / 0.4)) + ")";
      pen.beginPath();
      pen.ellipse(end[0] - dxs / dls * 2.2, end[1] - dys / dls * 2.2, 2.2, 1.4 * Math.max(0.4, Math.min(1, dls)), Math.atan2(dys, dxs), 0, 7);
      pen.fill();
    }
  }
  pen.restore();
}

// A bare foot, as the murals and paintings draw one: its heel at (x, y) and
// its toes pointing the way the person faces. The top of the foot slopes
// down from the ankle to the toes; the big toe is the first of four bumps.
// A lifted foot points its toes down, as a real ankle lets it.
function foot(x, y, lifted, small) {
  var long = small ? 40 : 48, tall = small ? 11 : 13;
  pen.save();
  pen.translate(x, y);
  pen.rotate(lifted * 0.45);
  pen.beginPath();
  pen.moveTo(-10, -tall * 1.6);                     // the back of the ankle
  pen.quadraticCurveTo(-16, -tall * 0.5, -9, 0);    // the heel
  pen.quadraticCurveTo(long * 0.4, 2, long * 0.8, 0);           // the sole, to the ball of the foot
  pen.quadraticCurveTo(long + 4, -2, long * 0.96, -7);          // round the big toe
  pen.quadraticCurveTo(long * 0.8, -11, long * 0.55, -tall * 0.8);   // over the toes and up the top of the foot
  pen.quadraticCurveTo(long * 0.2, -tall * 1.3, 10, -tall * 1.6);
  pen.closePath();
  shape(SKIN);
  pen.fillStyle = "rgba(150, 70, 60, 0.18)";        // the arch is in shadow
  pen.beginPath();
  pen.ellipse(long * 0.3, -3, long * 0.2, 3, 0, 0, 7);
  pen.fill();
  pen.strokeStyle = "rgba(58, 36, 24, 0.55)";       // the toes, parted by short lines
  pen.lineWidth = 1.3 * FINE;
  pen.lineCap = "round";
  pen.beginPath();
  for (var toe = 1; toe <= 3; toe++) {
    var tx = long * (0.9 - toe * 0.07);
    pen.moveTo(tx, -1);
    pen.quadraticCurveTo(tx - 1, -4 - toe * 0.4, tx - 2, -7 - toe * 0.6);
  }
  pen.stroke();
  pen.beginPath();                                  // the nail of the big toe
  pen.ellipse(long * 0.92, -5, 2.2, 1.4, 0.3, 0, 7);
  pen.fillStyle = "rgba(255, 240, 230, 0.8)";
  pen.fill();
  pen.restore();
}

// A shoe, with its heel at (x, y) and its toe pointing the way the person
// faces. A lifted foot tips its toe down, as a real ankle lets it.
function shoe(x, y, lifted, small) {
  var long = small ? 50 : 66, tall = small ? 22 : 30;
  pen.save();
  pen.translate(x, y);
  pen.rotate(lifted * 0.5);
  pen.beginPath();
  pen.moveTo(-14, 0);                               // the heel
  pen.quadraticCurveTo(-18, -tall * 0.9, 2, -tall);
  pen.quadraticCurveTo(long * 0.45, -tall * 0.75, long * 0.6, -tall * 0.95);   // up to the toe cap
  pen.quadraticCurveTo(long, -tall * 0.9, long, -tall * 0.3);
  pen.quadraticCurveTo(long, 0, long * 0.8, 0);
  pen.closePath();
  shape("#8a4b2a");
  pen.strokeStyle = INK;                            // the sole, and the front of the heel
  pen.lineWidth = 3 * FINE;
  pen.beginPath();
  pen.moveTo(-12, -5);
  pen.lineTo(long * 0.92, -5);
  pen.moveTo(8, -5);
  pen.lineTo(8, 0);
  pen.stroke();
  pen.strokeStyle = INK;                            // a strap across the instep
  pen.lineWidth = 2 * FINE;
  pen.beginPath();
  pen.moveTo(long * 0.3, -tall * 0.92);
  pen.quadraticCurveTo(long * 0.42, -tall * 0.5, long * 0.4, -4);
  pen.stroke();
  pen.fillStyle = "rgba(255, 255, 255, 0.18)";      // a shine on the toe
  pen.beginPath();
  pen.ellipse(long * 0.74, -tall * 0.62, 8, 4, -0.3, 0, 7);
  pen.fill();
  pen.restore();
}

// ---------- limbs ----------
// An arm or a leg is two bones that meet at a joint. Each bone is drawn as a
// shape that is thick at one end and thinner at the other, with sides that
// curve out a little, as a muscle does.

// the outline of one bone, from (ax, ay) to (bx, by): half as wide as
// "wideA" at its start and "wideB" at its end, round at both ends
function bone(ax, ay, bx, by, wideA, wideB, swell) {
  var angle = Math.atan2(by - ay, bx - ax);
  var nx = -Math.sin(angle), ny = Math.cos(angle);  // the way across the bone
  var middleX = (ax + bx) / 2, middleY = (ay + by) / 2;
  var fat = (wideA + wideB) / 2 + swell;
  pen.beginPath();
  pen.moveTo(ax + nx * wideA, ay + ny * wideA);
  pen.quadraticCurveTo(middleX + nx * fat, middleY + ny * fat, bx + nx * wideB, by + ny * wideB);
  pen.arc(bx, by, wideB, angle + Math.PI / 2, angle - Math.PI / 2, true);
  pen.quadraticCurveTo(middleX - nx * fat, middleY - ny * fat, ax - nx * wideA, ay - ny * wideA);
  pen.arc(ax, ay, wideA, angle - Math.PI / 2, angle + Math.PI / 2, true);
  pen.closePath();
}

// One bone, painted: its colour, and a shadow down the side that is away
// from the light. The shadow is what is left when the same shape is painted
// again a little toward the light, inside the first one.
function paintBone(ax, ay, bx, by, wideA, wideB, colour) {
  var toLight = wideA * 0.4;
  bone(ax, ay, bx, by, wideA, wideB, 3);
  pen.fillStyle = colour;
  pen.fill();
  pen.save();
  pen.clip();
  pen.fillStyle = "rgba(60, 30, 50, 0.18)";
  pen.fill();
  bone(ax + toLight, ay - toLight * 0.6, bx + toLight, by - toLight * 0.6, wideA, wideB, 3);
  pen.fillStyle = colour;
  pen.fill();
  pen.restore();
}

// ---------- how an arm may turn ----------
// A shoulder does not turn all the way round, and neither does an elbow
// (owner, 2026-10-12). An arm's angles are measured from straight down,
// growing toward the arm's own side: 90 is straight out to that side, 180
// is straight up, and below 0 is in, toward the spine.
//   SHOULDER   the arc the upper arm keeps to: from a little in toward the
//              spine as it hangs, round the outside, to a little past
//              straight up. It never points into the inward arc between. A
//              hand that asks for that gets the upper arm at the nearer end
//              of the arc, and the forearm does the rest.
//   ELBOW      the most a forearm folds from straight, to either side: it
//              never lies flat along the upper arm, and never bends back.
// And neither joint jumps: of two elbows as good as each other an arm keeps
// the one it has, and when the better one changes, the elbow swings across
// in a fifth of a second (bendOf).
var SHOULDER = [-30, 200], ELBOW = 150;
// Where a leg ends: the ankle this far up and forward from the heel's point on
// the ground. Measured on standing people (joint_models.md, 2026-10-15): 14 to
// 18 up, 6 to 10 forward. It was 22 and 6.
var ANKLE_UP = 16, ANKLE_FWD = 7;

var BENDS = {};

// Which of its two elbows an arm takes: 1 for the first, -1 for the second,
// and between the two while it swings from one to the other. "gain" is how
// much better the first is than the second. With a key the arm remembers:
// it keeps the elbow it has unless the other is better by a clear margin,
// and a change takes a fifth of a second. A cut (no memory, or the clock
// gone back, or stopped a while) takes the better elbow at once.
function bendOf(key, gain) {
  var s = key && BENDS[key], dt = s ? clock - s.t : -1;
  if (!s || dt < 0 || dt > 0.25) {
    s = {t: clock, way: gain >= -2 ? 1 : -1};
    s.side = s.way;
    if (key) { BENDS[key] = s; }
    return s.side;
  }
  if (gain * s.way < -2) { s.way = -s.way; }
  s.side = Math.max(-1, Math.min(1, s.side + s.way * dt / 0.1));
  s.t = clock;
  return s.side;
}

// Where an arm's wrist and elbow are, measured from its shoulder, for a wrist
// asked for at (wx, wy): [wristX, wristY, elbowX, elbowY]. Two elbows reach
// any wrist, one on each side of the line to it. Each is first made to keep
// the two rules; then the arm takes the one it likes better: back and down
// for a hanging arm, out to its own side and down for a lifted one, and the
// one that leaves the wrist nearer to where it was asked for.
//   upper, lower   the lengths of the two bones
//   outward        1 or -1: which side of the body the arm is on
//   key            a name to remember the bend by (or nothing)
//   sure           0 to 1: how sure the way to the wrist is. A hand lying on
//                  its own shoulder points nowhere in particular, and the
//                  arm then leans on the way it pointed the frame before.
//                  2: the wrist has a place to be (a reach). Then the elbow
//                  that brings it there wins over the one the arm likes
//                  better, and the wrist is there at once while the elbow
//                  comes round
function armJoints(wx, wy, upper, lower, outward, key, sure) {
  var must = sure > 1;
  var far = Math.sqrt(wx * wx + wy * wy) || 1, reach = Math.min(far, upper + lower - 1);
  var dx = wx / far, dy = wy / far;
  var seen = key && BENDS[key];
  if (seen && sure < 1 && seen.dx !== undefined && clock - seen.t >= 0 && clock - seen.t <= 0.25) {
    dx = dx * sure + seen.dx * (1 - sure);
    dy = dy * sure + seen.dy * (1 - sure);
    far = Math.sqrt(dx * dx + dy * dy) || 1;
    dx /= far;
    dy /= far;
  }
  wx = dx * reach;
  wy = dy * reach;
  var along = (upper * upper - lower * lower + reach * reach) / (2 * reach);
  var out = Math.sqrt(Math.max(0, upper * upper - along * along));
  var most = ELBOW * Math.PI / 180, ways = [];
  for (var n = 0; n < 2; n++) {
    var side = n ? -1 : 1;
    var ex = dx * along - side * dy * out, ey = dy * along + side * dx * out;
    var turn = Math.atan2(ex * outward, ey) * 180 / Math.PI;       // the upper arm's angle
    if (turn < SHOULDER[0] && turn > SHOULDER[1] - 360) {           // in the inward arc: back to its nearer end
      turn = (turn > (SHOULDER[0] + SHOULDER[1] - 360) / 2 ? SHOULDER[0] : SHOULDER[1]) * Math.PI / 180;
      ex = Math.sin(turn) * outward * upper;
      ey = Math.cos(turn) * upper;
    }
    var fx = wx - ex, fy = wy - ey;                                // the forearm, toward the wrist asked for
    var fold = Math.atan2(ex * fy - ey * fx, ex * fx + ey * fy);   // how far it folds from straight
    if (Math.abs(fold) > most) {                                    // further than an elbow folds: as far as it does
      fold = fold < 0 ? -most : most;
      fx = ex * Math.cos(fold) - ey * Math.sin(fold);
      fy = ex * Math.sin(fold) + ey * Math.cos(fold);
    }
    var fl = Math.sqrt(fx * fx + fy * fy) || 1;
    var hx = ex + fx / fl * lower, hy = ey + fy / fl * lower;      // where the wrist comes to
    var miss = Math.sqrt((hx - wx) * (hx - wx) + (hy - wy) * (hy - wy));
    ways.push([hx, hy, ex, ey, ex * (wy < 0 ? outward : -0.6) + ey * 0.8 - (must ? 60 : 6) * miss, miss]);
  }
  var part = (bendOf(key, ways[0][4] - ways[1][4]) + 1) / 2;       // 1: the first elbow; 0: the second
  if (key) {                                                        // the way it points, for the next frame
    BENDS[key].dx = dx;
    BENDS[key].dy = dy;
  }
  // While it changes from one elbow to the other, the elbow goes by way of
  // the shoulder: the upper arm draws in until it points at us, and comes
  // out again the new way. It does not sweep across the chest to get there.
  var first = part * part, second = (1 - part) * (1 - part), through = 2 * part * (1 - part);
  var wrist = must ? (ways[0][5] <= ways[1][5] ? ways[0] : ways[1]) : null;   // the nearer of the two, for a wrist with a place to be
  return [wrist ? wrist[0] : mix(ways[1][0], ways[0][0], part), wrist ? wrist[1] : mix(ways[1][1], ways[0][1], part),
          first * ways[0][2] + second * ways[1][2] + through * outward * 12, first * ways[0][3] + second * ways[1][3]];
}

// Two bones from (x1, y1) toward (x2, y2), and where the joint between them
// must be. A limb cannot stretch: if the end is too far it stops short, and
// the nearer the end is, the more the joint bends. Of the two ways a joint
// could bend, "prefer" picks one: it is given a point and answers with a
// number, and the higher number wins. A caller that has found the joint
// itself, as an arm does by rules of its own, gives it as [x, y] instead.
//   upper, lower   the lengths of the two bones
//   wide           half-widths: [at the start, at the joint, at the end]
//   open           how much of the first bone, from its start, has no ink line
//                  (0 to 1). An arm is open at the shoulder: a line there would
//                  draw a ball on the chest, and the ball would turn like a wheel.
function limb(x1, y1, x2, y2, upper, lower, wide, colour, prefer, open) {
  var far = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) || 1;
  var reach = Math.min(far, upper + lower - 1);
  var dx = (x2 - x1) / far, dy = (y2 - y1) / far;
  var endX = x1 + dx * reach, endY = y1 + dy * reach;
  // the joint: "along" down the line to the end, and "out" to one side of it
  var along = (upper * upper - lower * lower + reach * reach) / (2 * reach);
  var out = Math.sqrt(Math.max(0, upper * upper - along * along));
  var one = [x1 + dx * along - dy * out, y1 + dy * along + dx * out];
  var two = [x1 + dx * along + dy * out, y1 + dy * along - dx * out];
  var joint = typeof prefer === "function" ? (prefer(one) >= prefer(two) ? one : two) : prefer;
  // where the ink line of the first bone begins, and how wide the bone is there
  var from = open || 0;
  var inkX = x1 + (joint[0] - x1) * from, inkY = y1 + (joint[1] - y1) * from;
  var inkWide = wide[0] + (wide[1] - wide[0]) * from;
  // ink first for both bones, then colour, so no line crosses the joint
  var ink = inkFor(colour);
  heavy(ink);
  bone(inkX, inkY, joint[0], joint[1], inkWide + LINE, wide[1] + LINE, 3);
  pen.fillStyle = ink;
  pen.fill();
  bone(joint[0], joint[1], endX, endY, wide[1] + LINE, wide[2] + LINE, 3);
  pen.fill();
  light();
  if (from > 0) {                                   // the open part: colour only, no line, no shadow
    bone(x1, y1, joint[0], joint[1], wide[0], wide[1], 3);
    pen.fillStyle = colour;
    pen.fill();
  }
  paintBone(inkX, inkY, joint[0], joint[1], inkWide, wide[1], colour);
  paintBone(joint[0], joint[1], endX, endY, wide[1], wide[2], colour);
  pen.strokeStyle = "rgba(58, 36, 24, 0.35)";       // a small crease inside the joint
  pen.lineWidth = 2 * FINE;
  pen.lineCap = "round";
  var creaseX = (x1 + endX) / 2 - joint[0], creaseY = (y1 + endY) / 2 - joint[1];
  var deep = Math.sqrt(creaseX * creaseX + creaseY * creaseY) || 1;
  if (deep > 6) {
    pen.beginPath();
    pen.moveTo(joint[0] + creaseX / deep * wide[1] * 0.2, joint[1] + creaseY / deep * wide[1] * 0.2);
    pen.lineTo(joint[0] + creaseX / deep * wide[1] * 0.95, joint[1] + creaseY / deep * wide[1] * 0.95);
    pen.stroke();
  }
  return [endX, endY, joint[0], joint[1]];          // the end, and the joint
}

// An arm from a shoulder to a hand: an upper arm, an elbow and a forearm.
// A hanging arm bends its elbow back; a lifted arm bends it out to the side;
// an arm that reaches forward lets it drop. "hand" is the way the hand lies;
// "key" names the arm, so that it remembers its bend from frame to frame.
// Where the joints go is armJoints(), with its two rules.
function arm(shoulderX, shoulderY, hand, outward, colour, key) {
  var far = Math.sqrt(hand[0] * hand[0] + hand[1] * hand[1]) || 1;
  // How far the wrist reaches. A hand given 92 or more from the shoulder is
  // an arm almost straight: 119 of its 120, an elbow of about 15 degrees, as
  // an arm has when it hangs. A hand given nearer bends the elbow to reach
  // it, and one given close to the shoulder is drawn folded close to it.
  var long = Math.max(Math.min(74, 30 + far * 2.2), Math.min(119, far * 1.3));
  // A hand given near its shoulder points nowhere in particular, so the arm
  // leans on the way it pointed the frame before. A hand from handFor() is
  // near on purpose (a third number, 1, says so): its wrist has a place to be.
  var at = armJoints(hand[0] / far * long, hand[1] / far * long, 62, 58, outward, key, hand[2] ? 2 : clamp(far / 25));
  return limb(shoulderX, shoulderY, shoulderX + at[0], shoulderY + at[1], 62, 58, [12, 10, 8.5], colour,
              [shoulderX + at[2], shoulderY + at[3]], 0.4);
}

// The hand to give an arm so that its wrist comes to (dx, dy) from its
// shoulder. arm() does not put the wrist where the hand is given: a hand
// given near folds the arm and one given far straightens it. This is that
// rule turned round, for a wrist that has to be at a place: on a rope, in a
// friend's hand, against the other wrist. A wrist can be 32 to 119 from its
// shoulder.
function handFor(dx, dy) {
  var far = Math.sqrt(dx * dx + dy * dy) || 1;
  var long = Math.max(32, Math.min(119, far));
  var given = long < 74 ? (long - 30) / 2.2 : long / 1.3;
  return [dx / far * given, dy / far * given, 1];   // the 1 tells arm() that the wrist has to come to the very place
}

// A leg from a hip to an ankle: a thigh, a knee and a shin. A knee bends
// forward, the way the person faces, and never back.
function legOf(hipX, hipY, ankleX, ankleY, thin, colour, longer) {
  // under a skirt the bones are a little shorter, so the knees stay inside the cloth;
  // "longer" is how much longer than the cartoon's the legs are (1 unless a build is given)
  return limb(hipX, hipY, ankleX, ankleY, (thin ? 86 : 106) * longer, (thin ? 84 : 102) * longer,
              thin ? [9, 7.5, 6] : [15, 12, 9.5], colour,
              function (knee) { return knee[0]; });
}

// A length of cloth round the legs of one who sits, or the two legs together
// in trousers: a bone from (ax, ay) to (bx, by), its line, and the woven
// bands that go across it.
//   bands      as tier() takes them, or nothing
//   from, to   how far down the whole cloth this length begins and ends (0 is the waist, 1 the hem)
//   open       how much of it, from its start, has no line (0 to 1)
function wrap(ax, ay, bx, by, wideA, wideB, colour, bands, from, to, open) {
  var ink = inkFor(colour), part = open || 0;
  heavy(ink);
  bone(mix(ax, bx, part), mix(ay, by, part), bx, by, mix(wideA, wideB, part) + LINE, wideB + LINE, 3);
  pen.fillStyle = ink;
  pen.fill();
  light();
  paintBone(ax, ay, bx, by, wideA, wideB, colour);
  var far = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay)) || 1;
  var ux = (bx - ax) / far, uy = (by - ay) / far;   // the way along the cloth
  bone(ax, ay, bx, by, wideA, wideB, 3);
  pen.save();
  pen.clip();                                       // the bands stay on the cloth
  for (var n = 0; bands && n < bands.length; n++) {
    var v = (bands[n][0] - from) / (to - from);
    if (v < 0 || v > 1) { continue; }
    var px = mix(ax, bx, v), py = mix(ay, by, v), half = mix(wideA, wideB, v) + 5;
    stripe([px + uy * half, py - ux * half], [px + ux * half * 0.3, py + uy * half * 0.3], [px - uy * half, py + ux * half],
           bands[n][1], bands[n][2], bands[n][3]);   // a band goes round the leg, so it bows toward the hem
  }
  pen.restore();
}

// The lower body of one who sits on the floor, drawn about the hips at
// (0, hipY). The ground is y = 0, and the person faces along x.
//   kind     "side": both legs folded to one side, the knees to the front and the feet out
//            behind (phap phiap); "cross": cross-legged
//   colour   the colour of the trousers, or of the cloth
//   bands    the woven bands of a skirt, a pha sin or a sarong, as tier() takes them, from
//            the waist (0) to the hem (1); nothing for trousers
//   slight   a lady's smaller feet
//   longer   how much longer than the cartoon's the legs are (1 unless a build is given)
// It gives back where the joints are: [knee B, knee A, ankle B, ankle A].
function seated(kind, hipY, colour, bands, slight, longer) {
  function toes(x, y, way, turn) {                  // a foot with its heel at (x, y), its toes pointing along x (way 1) or back (-1)
    pen.save();
    pen.translate(x, y);
    pen.scale(way, 1);
    pen.rotate(turn);
    foot(0, 0, 0, slight);
    pen.restore();
  }
  function seat() {                                 // the hips, down to the ground
    pen.beginPath();
    pen.moveTo(-30, hipY - 10);
    pen.quadraticCurveTo(-52, hipY + 6, -40, -3);
    pen.lineTo(34, -3);
    pen.quadraticCurveTo(46, hipY + 8, 30, hipY - 10);
    pen.closePath();
    shape(colour);
  }
  if (kind === "astride") {
    // One who rides. The seat is on the animal's back, and the near leg hangs
    // down its side with the knee forward; the far leg is on the animal's
    // other side and is not seen. In cloth both legs hang together on the
    // near side, as one who rides side-saddle.
    var hang = bands ? [24, 19, 13] : [16, 13, 10];
    var kneeAt = [52, hipY + 44], ankleAt = [38, hipY + 44 + 104 * longer];
    seat();
    if (bands) {
      wrap(4, hipY + 6, kneeAt[0], kneeAt[1], hang[0], hang[1], colour, bands, 0.1, 0.5, 0.35);
      toes(ankleAt[0] - 6, ankleAt[1] + 12, 1, 0.5);
      wrap(kneeAt[0], kneeAt[1], ankleAt[0], ankleAt[1], hang[1], hang[2], colour, bands, 0.5, 1);
    } else {
      limb(6, hipY + 4, ankleAt[0], ankleAt[1], 400, 400, hang, colour, kneeAt, 0.3);
      toes(ankleAt[0] - 6, ankleAt[1] + 12, 1, 0.5);
    }
    return [kneeAt, kneeAt, ankleAt, ankleAt];
  }
  if (kind === "side") {
    // The thighs lie along the ground to the knees, in front. The shins fold
    // back along them, nearer to us, so they are drawn over the thighs and
    // lower; and the feet come out behind, one on the other.
    var wides = bands ? [24, 17, 16, 12] : [21, 15, 14, 10];
    var knee = [8 + 84 * longer, -wides[2] - 5], ankle = [-36 - 16 * longer, -wides[3]];
    seat();
    wrap(4, hipY + 6, knee[0], knee[1], wides[0], wides[1], colour, bands, 0.1, 0.5, 0.35);
    toes(ankle[0] - 2, -11, -1, -0.1);
    toes(ankle[0] + 8, -2, -1, 0);
    wrap(knee[0], -wides[2], ankle[0], ankle[1], wides[2], wides[3], colour, bands, 0.5, 1);
    return [knee, knee, ankle, ankle];
  }
  var kneeX = 100 * longer, ankleX = 16;
  if (bands) {
    // Cloth pulled over both knees is one shape, wide and low. Between the
    // knees its hem lifts off the ground, and the feet show under it, each
    // lying toward the other knee; its bands run from knee to knee the way
    // the hem does.
    toes(ankleX - 6, -1, 1, 0);
    toes(-ankleX + 6, 0, -1, 0);
    pen.beginPath();
    pen.moveTo(-30, hipY - 10);
    pen.quadraticCurveTo(-kneeX * 0.6, hipY - 6, -kneeX - 4, -30);   // out along one thigh to its knee,
    pen.quadraticCurveTo(-kneeX - 16, -4, -kneeX + 22, -2);          // round the knee to the ground,
    pen.quadraticCurveTo(0, -30, kneeX - 22, -2);                    // along the hem,
    pen.quadraticCurveTo(kneeX + 16, -4, kneeX + 4, -30);            // and up round the other
    pen.quadraticCurveTo(kneeX * 0.6, hipY - 6, 30, hipY - 10);
    pen.closePath();
    shape(colour);
    pen.save();
    pen.clip();
    for (var n = 0; n < bands.length; n++) {
      var u = bands[n][0], out = mix(30, kneeX + 10, Math.pow(u, 0.7)), level = mix(hipY - 10, -12, u);
      stripe([-out, level], [0, mix(hipY - 12, -36, u)], [out, level], bands[n][1], bands[n][2], bands[n][3]);
    }
    pen.restore();
    return [[-kneeX, -18], [kneeX, -18], [ankleX, -8], [-ankleX, -8]];
  }
  // In trousers the two legs show: each thigh goes out to its knee, and each
  // shin comes back across to the other side, where its foot lies under the
  // other knee. The leg at the back is drawn first.
  seat();
  toes(ankleX - 4, -1, 1, 0);
  limb(-16, hipY + 2, ankleX, -12, 400, 400, [16, 13, 10], colour, [-kneeX, -22], 0.3);
  toes(-ankleX + 4, 0, -1, 0);
  limb(16, hipY + 2, -ankleX, -11, 400, 400, [16, 13, 10], colour, [kneeX, -22], 0.3);
  return [[-kneeX, -22], [kneeX, -22], [ankleX, -12], [-ankleX, -11]];
}

// How much longer than the cartoon's a figure's legs are, for its build: up
// to 1.3 times at build 1, and down to 0.85 at -1, a child's (see person()).
function leggyOf(build) {
  var b = Math.max(-1, Math.min(1, build || 0));
  return 1 + (b < 0 ? 0.15 : 0.3) * b;
}

// A hand at rest, as it hangs at the end of an arm with nothing to do: the
// fingers lie together and bend a little toward the body, the little finger
// most, and the thumb lies along them. The palm faces the leg, so on the
// arm at the picture's right (A) the fingers bend away from the thumb's
// side, and on the arm at the picture's left (B) toward it. (Before this a
// hanging hand was the half-closed hand, curled toward the thumb's side:
// forward and up, a cupped hand held out as if to carry something.)
var REST_A = [-0.17, -0.2, -0.23, -0.29, 0.55], REST_B = [0.05, 0.08, 0.11, 0.17, 0.55];
var PARASOL_FREE = [0.25, 0.3, 0.35, 0.4, 0.6];      // the free hand of one who carries a parasol: hanging, a little cupped, the back of the hand out
var WAI = [0, 0, 0, 0, 0.3];                        // the hands of a wai: four fingers straight, the thumb lying along them

// The tattoo of a man of the north on one thigh, from the hip at (ax, ay) to the
// knee at (bx, by): rows of small dark marks across the leg, the way the ink
// reads from a few steps off. It is drawn under the cloth, so only what the
// cloth leaves bare shows: nothing under a cloth to the ankle, a hand's width
// under one to the knee, the whole thigh under one hitched up for work.
function tattoo(ax, ay, bx, by) {
  var far = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay)) || 1;
  var ux = (bx - ax) / far, uy = (by - ay) / far;
  pen.save();
  bone(ax, ay, bx, by, 15, 12, 3);                  // the thigh's own outline keeps the ink on the leg
  pen.clip();
  for (var row = 0; row < 7; row++) {
    var v = 0.14 + row * 0.13, px = mix(ax, bx, v), py = mix(ay, by, v), half = mix(16, 13, v);
    stripe([px + uy * half, py - ux * half], [px + ux * 2.5, py + uy * 2.5], [px - uy * half, py + ux * half],
           "rgba(28, 36, 64, 0.72)", 3.2, ["zigzag", "dots", "diamonds"][row % 3]);
  }
  pen.restore();
}

// gold rings round a wrist, drawn across the forearm: "angle" is the way the arm points
function bangles(angle, count) {
  pen.save();
  pen.rotate(angle);
  for (var ring = 0; ring <= count; ring++) { oval(-8 - ring * (count > 3 ? 3.4 : 4.5), 0, 2.2, 10, STYLE.gold); }
  pen.restore();
}

// The cast: the people a film can take as they are, or alter. cast("lady",
// {late: 0.5}) is the lady with one thing changed. A film adds its own with
// CAST.monk = {...} before its scenes run.
var CAST = {
  lady: {skirt: true, bun: true, dance: true, shirt: "#f2ead8", legs: "#b2455a", size: 1.3,
         flower: "#f28fa8", garland: true, pins: true},
  // The men, from the owner's reference picture (a Chiang Mai costume studio's revival of the old dress, 2026-10-14): the hair in
  // a knot on top under a red head-cloth, the chest bare and tattooed, a cord round each arm, a checked cloth over the shoulder,
  // a brown cloth hitched high over tattooed thighs, a bright sash hanging from the waist, bare feet
  fellow: {bare: true, turban: "#b8294a", sabai: ["#6fae5a", "#c8486e", "check"], sarong: "#5a3f32", patoi: 0.75, tattoo: true,
           shirt: "#4a6797", legs: "#3d4f78", size: 1.3, skin: "#e6bd95", lips: 1.1},
  child: {bare: true, turban: "#b8294a", sabai: ["#6fae5a", "#c8486e", "check"], sarong: "#5a3f32", patoi: 0.75,
          shirt: "#e9c45c", legs: "#3d4f78", size: 0.95, wonder: 0.5, smile: 1, skin: "#f1cda8", eyes: 1.12},
  scientist: {coat: true, shirt: "#ffffff", legs: "#3d4f78", size: 1.25},
  drummer: {bare: true, turban: "#b8294a", sabai: ["#6fae5a", "#c8486e", "check"], sarong: "#5a3f32", patoi: 0.75, tattoo: true,
            drum: true, shirt: "#4a6797", legs: "#3d4f78", size: 1.35, smile: 1},
  // models from the paintings and the thangkas
  celestial: {skirt: true, bun: true, dance: true, shirt: "#e9c45c", legs: "#8a2a3a", size: 1.3, weave: 1,
              sabai: ["#e0b23a", "#8a2a3a"], halo: true, holding: "lotus", pins: true, smile: 1},
  dancer: {skirt: true, bun: true, dance: true, shirt: "#d9573a", legs: "#1f1a1a", size: 1.3, weave: 1,
           sabai: ["#3f8f5a", "#e0b23a"], tail: true, pins: true, nails: "long", fan: true, bangles: 5,
           collar: ["#b23a2a", "#e0b23a"], skin: "#f6e2d0", eyes: 1.06, lips: 0.9},
  // the head-cloth is Tai Yai, Tai Lue or Burmese wear, not Tai Yuan (Manop Manasaem; 2026-10-13): he is a man of those
  // peoples, as the north's villages held them, and not a Chiang Mai farmer
  villager: {bare: true, turban: "#b8294a", sabai: ["#8a5aa0", "#c8486e", "check"], sarong: "#5a3f32", patoi: 0.75, tattoo: true,
             shirt: "#4a6797", legs: "#3d4f78", size: 1.3, smile: 1, skin: "#d9a878", eyes: 0.94},
  // A man of Chiang Mai as the travellers saw him (Holt Hallett, 1890: no head-cloth, the hair a brush at the crown, "tattooed from
  // the waist downwards"; Lillian Curtis, 1903: the pa toi "should fall to the knee", plain or plaid, "the feet are always bare, and
  // the head uncovered"): a round-necked shirt of undyed cotton, the checked ta kong hitched to the knee, the tattoo showing beneath
  farmer: {bare: true, turban: "#b8294a", sabai: ["#6fae5a", "#c8486e", "check"], sarong: ["#efe6d2", takong(9, 112)], patoi: 0.75,
           tattoo: true, shirt: "#efe6d2", legs: "#3d4f78", size: 1.3, smile: 1, skin: "#d9a878", eyes: 0.94},
  // A noble, from the owner's second picture: the knot set with gold flowers under a patterned red head-cloth, gold earrings, a
  // broad gold collar, gold armbands and bracelets, a jewelled sash across the chest and a jewelled belt, a brocade cloth to the ankle
  noble: {bare: true, regalia: true, turban: "#b8294a", pins: true, bangles: 4, sarong: ["#8a2a3a", BROCADE], shirt: "#ffffff",
          legs: "#3d4f78", size: 1.3, skin: "#f1d2b4", smile: 0.6, eyes: 1.04, lips: 0.95},
  // a Lanna monk's robe is dyed with jackfruit heartwood, an ochre-brown, not Bangkok's orange (it was "#e07a1f" until 2026-10-13)
  monk: {shirt: "#b8732a", legs: "#9a5e20", size: 1.3, sarong: "#b8732a", shaved: true, plain: true, smile: 1, skin: "#e8c09a"},
  // a girl of the village paintings: a white blouse, a shoulder cloth, an indigo sin with a red foot
  maiden: {bun: true, dance: true, shirt: "#f4efe2", sin: 0, sabai: ["#8fc0cf", "#2f4a7a"], size: 1.3, earplug: "#d9b24a",
           flower: "#fff6ea", collar: ["#2f4a7a", "#e0b23a"], bangles: 3, skin: "#f3d2b0", smile: 1, eyes: 1.08},
  // an older woman: an indigo blouse buttoned down the front, a green and black sin, a pin in her bun
  weaver: {bun: true, shirt: "#34507a", sin: 1, size: 1.25, plain: true, bangles: 1, skin: "#e2b68e", smile: 1, eyes: 0.9, lips: 1.12,
           earplug: "#b8a060"},                     // a village woman's ear plug was a rolled palm leaf; a well-off one's gold
  // a little boy and a little girl: small, with a child's build (a large round head on shorter legs) and large eyes.
  // He wears an indigo shirt and trousers; she a white blouse, a red sin, and a flower in her hair
  boy: {bare: true, turban: "#b8294a", sabai: ["#6fae5a", "#c8486e", "check"], sarong: "#5a3f32", patoi: 0.75,
        shirt: "#3f6a8a", legs: "#34496b", size: 0.8, build: -1, head: 1.06, skin: "#f0c9a2", eyes: 1.3, smile: 1, wonder: 0.3},
  girl: {bun: true, shirt: "#f4efe2", sin: 2, size: 0.78, build: -1, head: 1.08, flower: "#f28fa8", skin: "#f4d3b4", eyes: 1.4,
         lips: 0.85, smile: 1, bangles: 1},
  // Four old people, each of a different style: white or grey hair, the lines of age, and a stoop.
  // An elder of the village, with a white beard and a stick; an old farmer under his hat;
  // a grandmother, small and bent, in a plum blouse; and an old woman dressed in white for the temple
  // The old men in the same dress (the owner, 2026-10-14: "redo the kids and old people but give the old man a shirt"): the
  // elder keeps a round-necked indigo shirt over the hitched cloth, his white hair in the knot under the head-cloth
  elder: {turban: "#b8294a", sabai: ["#6fae5a", "#c8486e", "check"], sarong: "#5a3f32", patoi: 0.75, tattoo: true,
          shirt: "#2f4a6a", legs: "#3d4f78", size: 1.2, hair: "#ece7dd", beard: "#f4f0e6", age: 1, bend: 0.16,
          holding: "stick", skin: "#d9a87c", eyes: 0.9, smile: 1},
  oldfarmer: {hat: true, bare: true, sabai: ["#6fae5a", "#c8486e", "check"], sarong: "#5a3f32", patoi: 0.75, tattoo: true,
              shirt: "#6f8fa8", legs: "#4f4a3a", size: 1.25, hair: "#b8b2a8", age: 0.8, bend: 0.1, skin: "#c98f62",
              eyes: 0.92, lips: 1.15, smile: 1},
  grandmother: {bun: true, shirt: "#6a3f52", sin: 2, size: 1.1, plain: true, hair: "#e8e3da", age: 1, bend: 0.2, skin: "#e0b48c",
                eyes: 0.85, lips: 0.95, smile: 1, bangles: 1},
  devotee: {bun: true, shirt: "#f6f1e6", sin: 0, sabai: ["#f6f1e6", "#cfc7b4"], size: 1.2, hair: "#a9a39a", age: 0.7, bend: 0.06, earplug: "#d9b24a",
            skin: "#ecc8a2", eyes: 0.9, smile: 1, holding: "lotus", flower: "#fff6ea"}
};

function cast(name, more) {
  checkName("The cast member", name, CAST);       // otherwise the figure comes out bare
  return Object.assign({}, CAST[name], more || {});
}

// A pha sin as the Lanna paintings draw one: a straight tube to the ankle, in
// three parts. The head (hua sin), at the waist, is a hand's span of plain
// white or pale cotton, with a narrow red or rust band under it (Manop
// Manasaem, Fine Arts Journal CMU; McIntosh, Textiles Asia 2012: it was dark
// here until 2026-10-13); the body is striped across (a sin ta); the foot is
// a band of its own colour with a woven pattern (a tin jok). Each design here
// is the body's colour and its bands, as tier() takes them. look.sin picks one.
var SIN_HEAD = "#ece4d0", SIN_HEAD_BAND = "#b5562e";
var SINS = [
  ["#2f3f6e", [[0.05, SIN_HEAD, 20], [0.11, SIN_HEAD_BAND, 2.5], [0.22, "#b23a3a", 2.5], [0.27, "#e0b23a", 1.2], [0.32, "#b23a3a", 2.5],
               [0.44, "#e9dcc0", 1.5], [0.5, "#b23a3a", 2.5], [0.55, "#e0b23a", 1.2], [0.6, "#b23a3a", 2.5],
               [0.71, "#e9dcc0", 1.5], [0.89, "#a8262e", 34], [0.83, "#e0b23a", 2, "diamonds"],
               [0.9, "#f6e3a1", 1.2, "dots"], [0.96, "#e0b23a", 1.5, "zigzag"]]],          // 0: indigo, with a red foot
  ["#3f7a4a", [[0.05, SIN_HEAD, 20], [0.11, SIN_HEAD_BAND, 2.5], [0.2, "#1f1a1a", 5], [0.26, "#f4c542", 1.5], [0.34, "#1f1a1a", 5],
               [0.4, "#f4c542", 1.5], [0.48, "#1f1a1a", 5], [0.54, "#f4c542", 1.5], [0.62, "#1f1a1a", 5],
               [0.68, "#f4c542", 1.5], [0.89, "#b23a3a", 34], [0.83, "#f6e3a1", 1.5, "zigzag"],
               [0.9, "#e0b23a", 1.6, "braid"], [0.97, "#1f1a1a", 2]]],                     // 1: green and black, with a red foot
  ["#c8553d", [[0.05, SIN_HEAD, 20], [0.11, SIN_HEAD_BAND, 2.5], [0.18, "#8a2a3a", 4], [0.23, "#f4c542", 1.2], [0.31, "#1f1a1a", 1.4],
               [0.38, "#8a2a3a", 4], [0.43, "#f4c542", 1.2], [0.51, "#1f1a1a", 1.4], [0.58, "#8a2a3a", 4],
               [0.63, "#f4c542", 1.2], [0.71, "#1f1a1a", 1.4], [0.89, "#2f3f6e", 34],
               [0.84, "#e0b23a", 1.5, "roundels"], [0.94, "#e0b23a", 1.6, "braid"]]]       // 2: brick red, with an indigo foot
];

// the bands of a man's sarong
// The pha ta kong, the black-and-white check a man of the north wore (Manasaem):
// bands of squares as close as the squares are wide, every other row shifted,
// make the check. "rows" squares down a cloth "long" pixels long at size 1: a
// cloth to the knee is about 112 long, to the ankle about 196.
function takong(rows, long) {
  var bands = [];
  for (var row = 0; row < rows; row++) { bands.push([(row + 0.5) / rows, "#1f1a1a", long / rows, row % 2 ? "checks-odd" : "checks"]); }
  return bands;
}

// A noble's brocade: red silk with bands of silver and gold across it
var BROCADE = [[0.12, "#d8dbe0", 3], [0.2, STYLE.gold, 1.5], [0.3, "#d8dbe0", 4, "diamonds"], [0.42, STYLE.gold, 1.5], [0.5, "#d8dbe0", 3],
               [0.62, STYLE.gold, 2, "zigzag"], [0.72, "#d8dbe0", 3], [0.82, STYLE.gold, 1.5], [0.9, "#d8dbe0", 5, "diamonds"]];

var SARONG_BANDS = [[0.3, "rgba(255, 240, 220, 0.5)", 3], [0.42, STYLE.gold, 1.5], [0.56, "rgba(40, 20, 30, 0.4)", 3],
                    [0.7, "rgba(255, 240, 220, 0.5)", 3], [0.82, STYLE.gold, 1.5], [0.92, "rgba(40, 20, 30, 0.4)", 2.5]];

// Four weaves of pha sin, as the paintings and murals show them: each is the
// bands on a tier, the bands on the foot band, and the foot band's cloth.
var WEAVES = [
  [[[0.66, "rgba(40, 20, 30, 0.4)", 2.5], [0.73, "#e0b23a", 2, "diamonds"], [0.8, "rgba(40, 20, 30, 0.4)", 2.5],
    [0.87, "rgba(255, 240, 220, 0.7)", 1.5, "dots"], [0.93, "#e0b23a", 1.5]],
   [[0.76, "#8a2a3a", 14], [0.73, "#e0b23a", 2, "diamonds"], [0.79, "rgba(255, 240, 220, 0.8)", 1.2, "dots"],
    [0.86, "#3d4f78", 5], [0.86, "#e0b23a", 1.5, "zigzag"], [0.93, "#8a2a3a", 2.5], [0.97, "#e0b23a", 1.2]],
   "#f6e3a1"],                                                   // 0: dark red and gold, the classic
  [[[0.7, "#e0b23a", 3], [0.78, "#e0b23a", 2, "diamonds"], [0.86, "#e0b23a", 1.2],
    [0.93, "rgba(255, 230, 180, 0.6)", 1.5, "dots"]],
   [[0.74, "#1f1a1a", 14], [0.74, "#e0b23a", 2, "zigzag"], [0.86, "#e0b23a", 5], [0.86, "#1f1a1a", 1.5, "dots"],
    [0.95, "#1f1a1a", 2]],
   "#e9c45c"],                                                   // 1: black and gold, for a dancer
  [[[0.68, "rgba(255, 255, 255, 0.5)", 1.5, "dots"], [0.76, "#e86f9a", 2.5, "dots"],
    [0.84, "rgba(255, 255, 255, 0.5)", 1.5, "dots"], [0.92, "#e0b23a", 1.5]],
   [[0.76, "#e86f9a", 12], [0.76, "rgba(255, 255, 255, 0.8)", 1.4, "dots"], [0.88, "#2f6b5a", 4], [0.95, "#e0b23a", 2]],
   "#f6e3a1"],                                                   // 2: flowers on teal, from the mural
  [[[0.66, "#e0b23a", 1.5, "zigzag"], [0.76, "rgba(255, 240, 220, 0.6)", 2], [0.84, "#e0b23a", 1.5, "zigzag"],
    [0.93, "rgba(40, 20, 30, 0.4)", 2.5]],
   [[0.76, "#3d4f78", 14], [0.74, "#e0b23a", 2, "diamonds"], [0.8, "rgba(255, 240, 220, 0.7)", 1.2, "dots"],
    [0.88, "#8a2a3a", 5], [0.88, "#e0b23a", 1.5, "zigzag"], [0.96, "#e0b23a", 1.5]],
   "#f6e3a1"]                                                    // 3: gold zigzags, blue and dark red
];

// ---------- poses ----------
// A pose is a "look" with numbers in it: where the hands are, how far the
// body bends, sits, tilts. poseAt(t, keys, hold) gives the look at time t
// from a list of [time, look] keys: it holds each key for "hold" of the way
// to the next (half, unless told otherwise), then eases into the next, the
// way a dancer hits a position and holds it. A track read from a video, a
// pose every tenth of a second, plays with hold 0. Numbers and pairs of
// numbers are eased; anything else is taken from the key being held. A key
// [time, look, "snap"] is reached the way a cartoon hits a pose: a small move
// the other way first, then fast, a little past, and settling.
function poseAt(t, keys, hold) {
  hold = hold === undefined ? 0.5 : hold;
  var last = keys[keys.length - 1][0];
  t = ((t % last) + last) % last;
  var i = 0;
  while (i < keys.length - 2 && keys[i + 1][0] <= t) { i++; }
  var a = keys[i][1], b = keys[i + 1][1];
  var u = (t - keys[i][0]) / (keys[i + 1][0] - keys[i][0]);
  u = clamp((u - hold) / (1 - hold));
  u = keys[i + 1][2] === "snap" ? snap(u) : u * u * (3 - 2 * u);   // a key marked "snap" is hit with anticipation and overshoot
  var out = {}, key, from, to;
  for (key in a) { out[key] = a[key]; }
  for (key in b) {
    from = a[key];
    to = b[key];
    if (typeof to === "number") {
      from = typeof from === "number" ? from : 0;
      out[key] = from + (to - from) * u;
    } else if (to && to.length && typeof to[0] === "number") {   // a pair, or a list of numbers such as a hand's curls
      from = from && from.length === to.length ? from : to;
      out[key] = to.map(function (v, j) { return from[j] + (v - from[j]) * u; });
    } else if (u >= 0.5) {
      out[key] = to;
    }
  }
  for (key in a) {                                  // what the next key does not have fades out
    if (key in b) { continue; }
    if (typeof a[key] === "number") { out[key] = a[key] * (1 - u); }
    else if (u >= 0.5) { delete out[key]; }
  }
  return out;
}

// where the joint of two bones lies, from (x1, y1) toward (x2, y2); the
// same answer limb() draws, so a stick figure and a person agree
function jointOf(x1, y1, x2, y2, upper, lower, prefer) {
  var far = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) || 1;
  var reach = Math.min(far, upper + lower - 1);
  var dx = (x2 - x1) / far, dy = (y2 - y1) / far;
  var along = (upper * upper - lower * lower + reach * reach) / (2 * reach);
  var out = Math.sqrt(Math.max(0, upper * upper - along * along));
  var one = [x1 + dx * along - dy * out, y1 + dy * along + dx * out];
  var two = [x1 + dx * along + dy * out, y1 + dy * along - dx * out];
  return prefer(one) >= prefer(two) ? one : two;
}

// A stick figure standing on (x, y), in the same pose a person would take
// from the same look: the movement guide, drawn as joints and bones.
function stick(x, y, look) {
  checkNames("The look's name", look, LOOK_KEYS);
  var size = (look.size || 1) * 0.82, sit = look.sit || 0;
  var hipY = -190 + 40 * sit, shoulderY = -112;
  var handA = look.handA || [14, 82], handB = look.handB || [-14, 82];
  function line(ax, ay, bx, by) {
    pen.beginPath();
    pen.moveTo(ax, ay);
    pen.lineTo(bx, by);
    pen.stroke();
  }
  function dot(px, py) {
    pen.beginPath();
    pen.arc(px, py, 6, 0, 7);
    pen.fill();
  }
  function armOf(sx, hand, outward) {
    var far = Math.sqrt(hand[0] * hand[0] + hand[1] * hand[1]) || 1;
    var long = Math.max(Math.min(74, 30 + far * 2.2), Math.min(119, far * 1.3));   // as arm() reaches
    var at = armJoints(hand[0] / far * long, hand[1] / far * long, 62, 58, outward);
    var ex = sx + at[0], ey = shoulderY + at[1], elbow = [sx + at[2], shoulderY + at[3]];
    var lifted = hand[1] < 0;
    line(sx, shoulderY, elbow[0], elbow[1]);
    line(elbow[0], elbow[1], ex, ey);
    dot(elbow[0], elbow[1]);
    pen.lineWidth = 3;                              // the hand: a flat palm, or fingers spread
    var spread = look.dance && lifted ? 0.5 : 0.12;
    for (var f = -1; f <= 1; f++) {
      var fa = Math.atan2(hand[1], hand[0]) + f * spread;
      line(ex, ey, ex + Math.cos(fa) * 22, ey + Math.sin(fa) * 22);
    }
    pen.lineWidth = 6;
  }
  pen.save();
  pen.translate(x, y);
  pen.scale(size * (look.face || 1), size);
  pen.strokeStyle = "#2a2a3a";
  pen.fillStyle = "#2a2a3a";
  pen.lineWidth = 6;
  pen.lineCap = "round";
  pen.lineJoin = "round";
  for (var leg = 0; leg < 2; leg++) {               // legs, with a foot that may be lifted
    var side = leg ? 1 : -1, fx = side * (26 + 24 * sit), fy = -8;
    if (look.raise && look.raise[0] === leg) { fx += look.raise[2]; fy = -8 - look.raise[1]; }
    var knee = jointOf(side * 20, hipY, fx, fy - 14, 92, 90, function (k) { return k[0]; });
    line(side * 20, hipY, knee[0], knee[1]);
    line(knee[0], knee[1], fx, fy - 14);
    line(fx - 6, fy - 12, fx + 42, fy - 6);
    dot(knee[0], knee[1]);
    dot(side * 20, hipY);
  }
  pen.save();                                       // everything above the hips turns with the bend
  pen.translate(0, hipY - 14);
  pen.rotate(look.bend || 0);
  line(0, 0, 0, shoulderY);
  line(-44, shoulderY, 44, shoulderY);
  dot(-44, shoulderY);
  dot(44, shoulderY);
  armOf(-44, handB, -1);
  armOf(44, handA, 1);
  pen.translate(0, shoulderY - 8);                  // the neck, and a head that tilts
  pen.rotate(look.tilt || 0);
  line(0, 0, 0, -30);
  pen.beginPath();
  pen.arc(0, -58, 28, 0, 7);
  pen.stroke();
  pen.beginPath();                                  // the eyes look the way the head turns
  var gl = look.glance || [0, 0];
  pen.arc(8 + 10 * (look.turn || 0) + gl[0], -62 + gl[1], 3, 0, 7);
  pen.arc(22 + 6 * (look.turn || 0) + gl[0], -62 + gl[1], 3, 0, 7);
  pen.fill();
  pen.restore();
  pen.restore();
}

// The names a look may have: the ones written down above person(), as the
// browser can read them. person() and stick() warn about any other name.
// checks/kit_check.py fails if this list and the written one differ.
// ---------- a walk from one place to another ----------
// stroll() takes a person along the ground at an even pace, one step on
// every beat. The feet do not slide: the body goes forward just as far as
// the foot on the ground goes back. The first step and the last are short
// ones, so the walk begins and ends with the feet together.
//   t          the scene's clock
//   from, to   where the walk begins and where it ends (x)
//   start      the second the walker sets off
//   look       the walker's look. Its own "stride" is how long the steps are; left out,
//              stroll() takes STROLL: a longer step than the cartoon's, and in a skirt
//              or a sarong a shorter one than in trousers
// It gives back {x, look, arrives}: where the walker is at t; the look to
// draw them with, which is the one given with step, stride and face set;
// and the second they arrive.
//     var walk = stroll(t, 200, 1100, 2, cast("lady", {size: 1.2}));
//     person(walk.x, GROUND, walk.look);
var STROLL = {skirt: 1.2, trousers: 1.8};

function stroll(t, from, to, start, look) {
  var size = (look.size || 1) * 0.82, far = Math.abs(to - from), way = to < from ? -1 : 1;
  var long = look.stride || ((look.skirt || look.sin !== undefined || look.sarong) && !look.patoi ? STROLL.skirt : STROLL.trousers);
  var pace = 136 * long * size;                     // how far two steps take the body: at a stride of 1 each foot goes back 68 on the ground
  if (far < pace / 2) {                             // too near for two whole steps: two shorter ones
    long = long * far / (pace / 2);
    pace = far * 2;
  }
  // "strides" is how many strides (two steps each) the walk takes. Step and
  // stride grow together through the first half stride and shrink together
  // through the last, so those two halves cover a quarter of a stride each.
  var strides = pace ? far / pace + 0.5 : 0, done = Math.max(0, Math.min(strides, (t - start) / (2 * BEAT)));
  var gone = done < 0.5 ? done * done : done < strides - 0.5 ? done - 0.25 : strides - 0.5 - (strides - done) * (strides - done);
  var walking = done > 0 && done < strides;
  return {x: from + way * pace * gone,
          look: Object.assign({}, look, {face: way, step: walking ? done : 0,
                                         stride: long * Math.min(1, 2 * done, 2 * (strides - done))}),
          arrives: start + strides * 2 * BEAT};
}

var LOOK_KEYS = {};

["age", "anger", "at", "bangles", "bare", "beard", "bend", "blink", "build", "bun", "buttons", "coat", "collar", "dance", "drum", "earplug", "eyes", "face",
 "fan", "fear", "feel", "fingersA", "fingersB", "floor", "flower", "garland", "glance", "gloves", "grip", "hair", "halo", "handA",
 "handB", "hat", "head", "holding", "id", "late", "legs", "lips", "mouth", "nails", "palmA", "palmB", "parasol", "patoi", "pins", "plain", "raise", "reachA", "reachB",
 "regalia", "regalia", "regalia", "rig", "sabai", "sad", "sarong", "shaved", "shirt", "shoes", "shoulders", "sin", "sing", "sit", "size", "skin", "skirt",
 "smile", "spring", "step", "stride", "sway", "tail", "tattoo", "tilt", "turban", "turn", "twist", "up", "wai", "weave", "wonder", "worn", "wristA", "wristB"
].forEach(function (name) { LOOK_KEYS[name] = true; });

// One villager, standing on (x, y). Everything about them is in "look".
// (Every key the kit reads is in this list, and every key in it is read:
// checks/kit_check.py compares the two.)
//   size            how large the figure is drawn: 1.25 to 1.5 fills the frame for three to five people
//   shirt, legs     colours
//   skirt           true for a long striped skirt (a pha sin)
//   weave           0 to 3: which weave the pha sin is (see WEAVES)
//   sabai           [cloth colour, border colour] of the sabai over the shoulder: one wide band
//                   from beside the neck on the side the figure faces down across the chest,
//                   rounded over the shoulder, cut on a slant under the other arm and tucked
//                   in at the waist, with the back of it hanging behind the shoulder, fringed:
//                   the shape of the sash film's cloth (sabai.js); a third name "check" bars it
//   worn            a painter the kit calls after the body and the head and before the arms,
//                   with the pen in the person's own frame: a cloth that goes under the arms,
//                   as the kit's own sabai does (sabaiWorn() in sabai.js); in a wai the kit
//                   calls it again inside the upper arm on the side the figure faces, and
//                   lays that forearm over it, as it does with its own sabai
//   flower, garland, pins, tail, nails
//                   a lady's ornaments: a flower (its colour) at the bun, a loop of
//                   jasmine, strands of gold flowers, a straight tail of hair, gold
//                   nail tips on a lifted hand (nails: "long" for the long curved nails
//                   of fon lep, worn all the time)
//   earplug         a colour: a lan hu, the rolled palm-leaf or gold ear plug of old Lanna, in
//                   the lobe of each ear in place of a lady's earring (gold "#d9b24a"; a leaf
//                   "#b8a060"); worn by the women and the men of the murals
//   sarong          a colour: a man's striped sarong, to the ankle, over bare legs; or [colour, bands] for a cloth of
//                   its own, bands as in SARONG_BANDS ([where, colour, width, kind]); takong(rows, long) gives the
//                   black-and-white check of a man of the north's pha ta kong
//   patoi           with a sarong: the cloth is hitched up, a pa toi, to the knee (true) or higher (a number: how far
//                   down the thigh its hem comes, 0.5 half-way), over bare legs, and he strides as in trousers
//   tattoo          true: the tattoo of a man of the north, from the waist to the knee, on each bare thigh; what the
//                   cloth leaves bare shows it (nothing under a sarong to the ankle)
//   sin             0, 1 or 2: a lady's pha sin as the paintings draw it (see SINS): a straight
//                   striped tube to the ankle with a patterned foot. She stands a little
//                   taller in it than in the tiered skirt. With a sabai she wears it over
//                   one shoulder; without, her blouse buttons down the front
//   collar          [band colour, pattern colour]: a wrap blouse, with a patterned band down
//                   its V neck and front edge
//   fan             true: a fan of gold leaves behind the bun
//   bangles         how many rings on each wrist (a lady has 2 unless told)
//   skin            this figure's own skin colour ("#rrggbb"); otherwise STYLE.skin
//   eyes, lips      the face's own measure: how large its eyes and how wide its mouth are (1 is the kit's)
//   head            how wide the head is: 0.9 for a lady unless told (a longer oval, lifted on
//                   a neck), 1 for a fellow or a child (the round head of the cartoon)
//   build           0 to 1: how far the figure is from the cartoon's build (0, or left out:
//                   about four and a half heads tall) toward the paintings' (1: about six and
//                   a half). The head is drawn smaller, on the same chin, and the legs longer.
//                   Below 0, down to -1, is a child's build: a larger head, and legs a little
//                   shorter (about three and a half heads tall at -1), with arms and hands
//                   shorter by as much as the legs, and a trunk shorter and narrower
//   coat            true for a scientist's long white coat
//   buttons         false: no buttons down the front
//   bare            true: no shirt. The chest and the arms are skin (with tattoo, the ink of a man of the north on the
//                   breast and along the collarbones too), a ring round the neck, a cord round each upper arm, and the
//                   waist cloth's ends hanging bright to the knee (the owner's reference picture, 2026-10-14)
//   regalia         true, with bare: a noble's gold: a broad collar, armbands and a sash of gold across the chest,
//                   a jewelled belt, earrings, and gold flowers at the knot of the hair; the head-cloth is patterned
//   hat, bun        a woven hat, or hair tied up with a flower
//   turban          a colour: a Lanna head-cloth, a band tied round the head with the hair above it
//   face            1 looks right, -1 looks left
//   turn            -1 to 1: the head turned to profile, or round to full face (0 is three-quarter).
//                   A lady's profile is the paintings', and a fellow's the same build (see view()).
//                   Left out, the head turns with the body (twist)
//   twist           -1 to 1: the body turned about its spine, to profile (-1, facing the way the
//                   figure faces) or round to full face (1); 0 is the three-quarter view the kit was
//                   drawn in. The chest narrows and its shoulders come over the middle toward
//                   profile (CHEST_LADY_P, CHEST_MAN_P), and widen toward full face; the legs and
//                   the feet come together or apart with it; seen from the side the far leg is
//                   drawn behind. A walker's shoulders also turn against the stride by themselves,
//                   about 8 degrees each way. At every turn a hanging far arm (A) is drawn behind
//                   the body (see behindA in person())
//   at              [x, y] in the scene: the eyes look at it
//   wonder, smile, fear, anger, sad
//                   0 to 1 each: what the face feels (see FEELINGS)
//   feel            a feeling by name: "calm", "joy", "surprise", "fear", "anger", "sad";
//                   it also leans the body and tilts the head, unless bend or tilt is given
//   dance           true: a lifted hand takes the pose of Thai dance
//   halo            true: a halo behind the head (a celestial). A crown is not the kit's:
//                   a paperdoll draws its own (apsara.js)
//   shaved, plain   no hair; no waist cloth, collar or pocket (a monk's robe)
//   holding         "lotus": a lotus in the near hand; "stick": a walking stick, from the
//                   near hand to the ground (the hand goes to it unless handA is given)
//   parasol         a paper parasol in the near hand, its rings of pattern seen as bands from
//                   the side: true (upright, open), a kind ("lai", "yantra", "buddha": see PARASOL),
//                   a colour for its paper, or parasolAt()'s {tilt, spin, open, kind, colour}:
//                   tipped down toward the viewer (0 upright to 1, a full circle), turned
//                   (radians), and furled (0) to open (1). The hand goes to the handle unless
//                   handA is given
//   hair            this figure's own hair colour ("#rrggbb"), such as an old person's
//                   white; otherwise STYLE.hair
//   age             0 to 1: the lines of age on the face: across the brow, at the corner of
//                   the eye and under it, and from the nose down past the mouth
//   beard           a colour: a moustache that droops past the mouth, and a tuft on the chin
//   sit, tilt       a dancer's half-sit (0 to 1); the head tilted (radians)
//   palmA, palmB    the turn of each hand about its own length, as hand() takes it: 0 the back of the
//                   hand toward us, 1 the palm, 0.5 the thumb's edge, -0.5 the little finger's edge.
//                   Left out, a hanging hand shows its back and a little of the thumb's edge (0.15),
//                   a lifted hand its palm (0.85), a dancer's lifted hand its back (0.15, so the
//                   long nails are seen whole), a hand closed round a thing its thumb's edge (0.3),
//                   a wai 0.25
//   wristA, wristB  the bend of each wrist, in radians: a hand laid flat on a thing
//   grip            true: both hands closed round a thing, such as a pestle
//   fingersA, fingersB
//                   five curls each, 0 straight to 1 curled (the first finger to the little
//                   one, then the thumb), as a track reads them from a hand model
//   glance, blink   the eyes as a track read them from a face: [across, down] for the
//                   irises, and 0 to 1 for a blink (the lid comes down with it)
//   raise           [leg 0 or 1, how high, how far forward]: a foot lifted on purpose. A fourth
//                   number is the foot's own turn, in radians: toes up below 0, as a foot that
//                   kicks holds them; without it a lifted foot lets its toes hang. With the
//                   fourth number the lift is a kick: the hips drop by up to 55 and go 20
//                   toward the standing foot, so the standing knee bends (see person())
//   gloves          true: the big white gloves of a 1930s cartoon; otherwise bare hands
//   shoes           true: the big shoes of a 1930s cartoon; otherwise bare feet
//   up              0 to 1: how high in the hop; or give "late" instead
//   late            the hop's timing, as hop(t, late) takes it: the kit then
//                   works out "up" itself, and also how fast the body moves,
//                   so it can stretch the figure as it springs and squash it
//                   as it lands. In a film whose style has hop: false nobody hops,
//                   and "late" only times the mouth of one who sings
//   spring          scales the hop that "late" gives (1 is a full hop)
//   step            a number that grows while walking: 1 more for every two steps.
//                   stroll() works it out for a walk from one place to another
//   stride          how long the steps of a walk are: 1, or left out, is the cartoon's short
//                   step (each foot goes 34 before the body and 34 behind it). stroll()
//                   sets it, and makes the first step and the last shorter with it
//   bend            how far the body leans forward, to look closely
//   shoulders       how far the line of the shoulders is tipped, as a track read it from a
//                   dancer (radians; above 0, its right end is the lower). Without it the
//                   kit tips the line itself, by how far to one side the body has moved
//   sway            a lean of the chest to one side over the hips, added to the kit's own
//                   sway (radians; 0.1 is a lot)
//   handA, handB    where each hand is, measured from its shoulder. Leave one out and that
//                   arm hangs, almost straight, with its hand at rest, and swings when the
//                   person walks. A hand given nearer than about 90 bends the elbow to
//                   reach it: [30, 60] is an elbow at a right angle, not a hanging arm
//   reachA, reachB  [x, y]: a point of the scene that the wrist of that arm goes to (the space
//                   person(x, y) and "at" are in). It takes the place of handA or handB. The
//                   hand goes on from the wrist the way the forearm points. An arm is 120
//                   long and keeps to its joints, so a point too far, or behind the body, is
//                   reached for and not touched. Two people given one point hold hands
//   wai             true: both wrists together before the chest and the hands upright, palm
//                   to palm, as in a wai
//   floor           true: sitting on the floor. One with her hair tied up (bun) folds both legs
//                   to one side, the knees to the front and the feet out behind (phap phiap);
//                   anyone else sits cross-legged. "side" or "cross" says which, and "astride"
//                   is for one who rides: the near leg hangs down the animal's side (in a
//                   skirt, both legs together, as one who rides side-saddle). The seat stays
//                   on the ground: the beat only moves what is above it. One who sits does not
//                   walk, half-sit or lift a foot: step, sit and raise are not read
//   drum            true to carry a long drum
//   sing            true to open the mouth on every beat
//   mouth           the shape of the mouth from mouthAt(), for one who sings the words
//   rig             a drawing cut into parts (rigImages): the parts move instead of the kit's shapes
//   id              a name, so that what hangs from the person (earrings, the ends of a
//                   sabai) can follow them from frame to frame; without one, the n-th
//                   person drawn in a frame is taken to be the same person in the next
// The shapes follow the cartoons of the 1930s: tall figures, a chest that
// narrows to a waist, tails or a skirt that flare and swing, thick legs that
// bow at the knee, big hands and feet, and nothing that stays still.
// A sheet a person is drawn on when their parasol hangs behind them (see
// person()), made once at the size of the sheet it goes onto.
var PERSON_LAYER = null, PERSON_LAYERED = false;
// A sheet for a forearm laid over a sabai in a wai (see person()), made once
// at the size of the sheet it goes onto.
var WAI_LAYER = null;

function person(x, y, look) {
  checkNames("The look's name", look, LOOK_KEYS);
  if (clock !== DRAWN_AT) { DRAWN = 0; DRAWN_AT = clock; }     // the n-th person drawn in a frame is the same person in the next
  var who = look.id || "n" + (DRAWN++);
  var rig = look.rig;                             // a puppet of drawn parts, or nothing
  // A parasol on its way down to her side, or carried there, hangs behind her
  // (owner, 2026-10-15: "when the women put the parasols down they are behind
  // the body not in front"). She is drawn on a layer of her own, the parasol
  // goes onto the sheet first, and her layer over it; over the middle of the
  // swing down a copy in front fades out, so it goes behind without a jump.
  var hangs = !rig && look.parasol && typeof look.parasol === "object" ? look.parasol.hang || 0 : 0;
  var sheetPen = pen, layered = hangs > 0 && !PERSON_LAYERED && !!pen.canvas, umbrellaAt = null, inFront = 1;
  if (layered) {
    if (!PERSON_LAYER || PERSON_LAYER.canvas.width !== pen.canvas.width || PERSON_LAYER.canvas.height !== pen.canvas.height) {
      var layerSheet = document.createElement("canvas");
      layerSheet.width = pen.canvas.width;
      layerSheet.height = pen.canvas.height;
      PERSON_LAYER = layerSheet.getContext("2d");
    }
    PERSON_LAYER.setTransform(1, 0, 0, 1, 0, 0);
    PERSON_LAYER.clearRect(0, 0, PERSON_LAYER.canvas.width, PERSON_LAYER.canvas.height);
    ["lineJoin", "lineCap", "miterLimit", "imageSmoothingEnabled", "imageSmoothingQuality"].forEach(function (name) { PERSON_LAYER[name] = pen[name]; });
    PERSON_LAYER.setTransform(pen.getTransform());
    PERSON_LAYERED = true;
    pen = PERSON_LAYER;
    inFront = 1 - clamp((hangs - 0.25) / 0.5) * clamp((hangs - 0.25) / 0.5) * (3 - 2 * clamp((hangs - 0.25) / 0.5));
  }
  // One who sits on the floor: "side" or "cross" (see seated()), or nothing.
  var seat = rig || !look.floor ? null : look.floor === true ? (look.bun ? "side" : "cross") : look.floor;
  if (seat) {
    look = Object.assign({}, look, {step: 0, sit: 0, raise: null});   // one who sits does not walk, half-sit or lift a foot
    // Hands that a scene does not place lie in the lap, turned in toward
    // each other, or one on each knee.
    var lapA = seat === "side" ? [[-2, 76], 1] : [[34, 90], 0], lapB = seat === "side" ? [[22, 76], -1] : [[-34, 90], 0];
    if (!look.handA && !look.reachA && !look.wai) { look.handA = lapA[0]; look.wristA = look.wristA || lapA[1]; }
    if (!look.handB && !look.reachB && !look.wai) { look.handB = lapB[0]; look.wristB = look.wristB || lapB[1]; }
  }
  var scene = pen.getTransform();                 // the scene's own frame, before this figure moves the pen: a reach is given in it
  SKIN = look.skin || STYLE.skin;                 // this figure's own skin, or the film's
  HAIR = look.hair || STYLE.hair;                 // and its own hair: white hair wants a line of its own too
  HAIR_LINE = look.hair ? inkFor(look.hair) : "#7a5640";
  PAINTED = !(look.age || look.build < 0);        // a child's lips, and an old woman's, are their own colour
  // a tube of cloth to the ankle: a lady's pha sin (one of SINS) or a man's sarong
  var tube = look.sin !== undefined ? SINS[look.sin % SINS.length] : Array.isArray(look.sarong) ? look.sarong : look.sarong ? [look.sarong, SARONG_BANDS] : null;
  var slight = look.skirt || look.sin !== undefined;   // a lady's smaller feet, and her anklets
  var joints = {size: (look.size || 1) * 0.82, face: look.face || 1};   // where the joints come to on the film: person() gives this back
  function spot(lx, ly) {                         // a point of the drawing, in the film's own pixels
    var p = pen.getTransform().transformPoint(new DOMPoint(lx, ly));
    return [p.x, p.y];
  }
  // The film's style says whether people hop (STYLE.hop). Where they do,
  // everyone given "late" hops on the beat, rocks from side to side,
  // squashes on landing and stands with the knees bent, and cloth swings
  // with the rock. Where they do not ("still"), people stand upright and
  // still, and one who walks (step) walks evenly.
  var still = !STYLE.hop;
  var up = look.up || 0, speed = 0, land = 1, sung = up;
  if (look.late !== undefined) {
    var spring = look.spring === undefined ? 1 : look.spring;
    sung = hop(clock, look.late) * spring;          // the beat, as one who sings keeps it whether they hop or not
    if (!still) {
      up = sung;
      speed = (hop(clock + 0.01, look.late) - hop(clock - 0.01, look.late)) / 0.02 * spring;
    }
    var beats = clock / BEAT + look.late;
    land = Math.min(beats - Math.floor(beats), Math.ceil(beats) - beats) * BEAT;   // seconds from the nearest beat
  }
  // Squash and stretch: the body is a bag of water. On the way up or down
  // it is longer and thinner; for a moment either side of landing it is
  // shorter and wider. The area stays about the same.
  var squash = still ? 0 : clamp(1 - land / 0.07);
  var stretch = clamp(Math.abs(speed) / 10) * (1 - squash);
  var tallness = 1 + 0.07 * stretch - 0.09 * squash;
  if (seat) { tallness = 1 + (tallness - 1) * 0.4; }   // one who sits is squashed and stretched less
  var walk = (look.step || 0) * Math.PI * 2;
  var gait = look.step ? (look.stride === undefined ? 1 : look.stride) : 0;   // how long the steps are; 0 for one who stands
  var feel = feelingOf(look);                       // the feeling on the face, and what it does to the body
  // Arms hang unless a scene places them: almost straight, a little out from
  // the body, the hand at rest. A walker swings each with the leg on the
  // other side, from the shoulder: the arm going forward bends a little more
  // at the elbow and its hand lifts, the arm going back is at its straightest.
  // The figure is seen from the front and a little to one side, so neither
  // hand crosses to the other side of the body, and the two never meet.
  var swing = look.step ? Math.cos(walk) * Math.min(1.6, gait) : 0;
  var handA = look.handA || (look.parasol ? parasolHand(parasolOf(look.parasol).tilt, parasolOf(look.parasol).hang) : look.holding === "stick" ? [34, 62] : [12 + 16 * swing, 97 - 12 * Math.max(0, swing)]);   // a hand on a stick is held forward, one on a parasol up to its handle
  var handB = look.handB || [-12 - 16 * swing, 97 - 12 * Math.max(0, -swing)];
  if (look.parasol && parasolOf(look.parasol).busy) {   // the other hand at the parasol's handle, working it
    var busy = parasolOf(look.parasol).busy;
    handB = [handB[0] + (80 - handB[0]) * busy, handB[1] + (56 - handB[1]) * busy];
  }
  var size = (look.size || 1) * 0.82;
  // A wrist sent to a point of the scene (reachA, reachB), or both brought
  // together before the chest (wai). The arm is aimed when it is drawn, once
  // the shoulder is known. Until then the hand is set about right, for the
  // things that only ask whether it is above its shoulder or below.
  function about(reach, side) {
    var shoulder = y - ((look.skirt ? 190 : 216) * leggyOf(look.build) + 126) * size;
    return [(reach[0] - x) / (size * (look.face || 1)) - side * 40, (reach[1] - shoulder) / size];
  }
  if (look.reachA) { handA = about(look.reachA, 1); }
  if (look.reachB) { handB = about(look.reachB, -1); }
  if (look.wai) { handA = [-34, 30]; handB = [34, 30]; }
  // The pen for this figure: the usual one up to the film's usual size (1.3),
  // and finer on a larger figure, so that the line on the film grows far
  // more slowly than the figure does. It is never heavier on a small figure:
  // a heavier pen fills in a small face.
  FINE = Math.min(1, Math.pow((look.size || 1) / 1.3, -0.7));
  LINE = STYLE.line * FINE;
  // the whole body rocks from side to side, once every two beats
  var rock = still ? 0 : Math.sin(clock * Math.PI / BEAT + x * 0.01) * 0.05;
  // The build. The cartoon's figure is about four and a half heads tall: a
  // big head on short legs. The figures of the paintings are six or seven,
  // with a small head and long legs. look.build goes from the one (0) to the
  // other (1): at 1 the head is 0.72 of its size and the legs are 1.3 times
  // as long, and with them a skirt, a sarong or a coat that hangs to them.
  // Below 0 it goes the other way, as far as -1: a child's larger head (1.28
  // of its size) on legs a little shorter (0.85 of their length).
  var build = Math.max(-1, Math.min(1, look.build || 0));
  var small = 1 - 0.28 * build, leggy = leggyOf(look.build);
  // On the beat the hips drop, and the knees have to bend. A fellow in
  // trousers stands taller than a lady in a skirt: his legs are longer.
  var dip = seat ? 5 * (1 - up) : (look.skirt ? 30 : 24) * (1 - up);
  var bob = look.step ? 4 * Math.cos(2 * walk) * gait : 0;              // a walker's hips rise as a leg passes under them
  if (still && !seat && !rig) {
    // One who does not hop stands upright: the hips are as high as legs that
    // are almost straight hold them, which depends on what the legs are in
    // (see legOf()). In a walk the hips only sink from there, most when the
    // feet are furthest apart, so the leg under the body can always reach.
    // 0.997 of the leg's length puts the standing knee at 171 degrees: photographs
    // of people standing measure 172 to 179 (joint_models.md, 2026-10-15); 0.985
    // gave 160, a knee always a little bent. ANKLE_UP is how high the ankle is.
    dip = (look.skirt ? 190 : 216) * leggy - ANKLE_UP - 0.997 * (look.skirt || tube ? 170 : 208) * leggy;
    bob = look.step ? 2.5 * gait * (1 + Math.cos(2 * walk)) : 0;
  }
  var hipY = (rig ? -rig.legs : (look.skirt ? -190 : -216) * leggy) + dip + 40 * (look.sit || 0)   // a dancer's half-sit lowers the hips
           + bob;
  if (seat) { hipY = -38 + dip; }                   // the hips of one who sits are just above the ground
  // The spine sways: the chest goes to one side and the hips a little to the
  // other, once every four beats when standing, and against the hips in a
  // walk, so a walker's hips swing under shoulders that stay nearly still.
  // A walker's hips go over the foot that is on the ground.
  // It goes up the spine as a wave: "late" is how far up, so the chest is
  // behind the hips and the head behind the chest. A scene adds its own
  // lean with "sway"; STYLE.sway scales the kit's part.
  function swayAt(late) {
    return STYLE.sway * (0.08 * Math.sin(clock * Math.PI / BEAT / 2 + x * 0.01 - 0.6 - late) * (still ? 0.25 : 1)
                         + (look.step ? 0.08 * Math.sin(walk - late) * Math.min(1, gait) : 0)) + (look.sway || 0);
  }
  var hipX = rock * 240 - (look.step ? 5 * Math.sin(walk) * Math.min(1, gait) : 0) - 45 * swayAt(0);   // a walker's hips sway with the stride
  if (seat) { hipX = 0; }                           // a seat does not slide on the ground: only what is above it moves
  // A kick lowers the body. When a foot is lifted and held as a kicking foot
  // (raise with its fourth number), the hips drop by up to 55 and go 20 toward
  // the standing foot, and the standing knee bends to about 150 degrees through
  // the two bones. Measured on a teep and a round kick (joint_models.md,
  // 2026-10-15). A foot only lifted, as a dancer's, does not do this.
  if (look.raise && look.raise[3] !== undefined && !seat && !rig) {
    var kick = clamp(look.raise[1] / 110);
    hipY += 55 * kick;
    hipX += (look.raise[0] === 0 ? 1 : -1) * 20 * kick;
  }
  var turned = (look.bend !== undefined ? look.bend : feel.bend) + rock * 1.4 + (look.step ? 0.05 * Math.min(1.25, gait) : 0);   // how far all above the hips leans: a walker into the walk, a feeling its own way
  // When the body moves to one side, the shoulder on that side dips and the
  // other rises, and the line of the hips tips the other way (owner,
  // 2026-10-12). "moved" is how far to one side the hips have gone: about 1
  // at the end of a rock. A line's tip is an angle: above 0, its right end
  // is the lower one. Both tips are on top of the lean the body has. A
  // track read from a dancer gives her shoulder line as it found it
  // (shoulders), and the hips answer it the other way all the same.
  var moved = hipX / 12;
  var shoulderTip = look.shoulders !== undefined ? Math.max(-0.25, Math.min(0.25, look.shoulders - turned)) : 0.05 * moved;
  var hipTip = look.shoulders !== undefined ? -0.6 * shoulderTip : -0.13 * moved;
  if (seat) { hipTip = 0; }
  // The body turns about its spine (twist): to profile at -1, facing the way
  // the figure faces, round to full face at 1, through the three-quarter
  // view it was drawn in at 0, as the head's turn goes. The hips and the
  // legs keep the body's own turn. The chest turns a little further by
  // itself when the person walks: the shoulders turn against the stride,
  // the shoulder of the arm swinging forward coming forward, so the chest
  // faces us a little more while the near arm is before the body and a
  // little less while it is behind (about 8 degrees each way).
  var bodyTurn = Math.max(-1, Math.min(1, look.twist || 0));
  var chestTurn = Math.max(-1, Math.min(1, bodyTurn + (look.step && !seat ? 0.15 * Math.cos(walk) * Math.min(1, gait) : 0)));
  var hipHalf = blend3(bodyTurn, 6, 20, 23), footHalf = blend3(bodyTurn, 8, 26, 30);   // each leg's root and foot, this far from the middle
  var sideOn = bodyTurn < -0.5;                     // nearer profile than three-quarter: the far side goes behind the body

  // a soft shadow on the ground, smaller while they are in the air
  pen.fillStyle = "rgba(70, 45, 30, 0.22)";
  pen.beginPath();
  if (seat === "astride") { pen.rect(x, y, 0, 0); }   // one who rides is not on the ground, and has no shadow on it
  else if (seat) { pen.ellipse(x + (seat === "side" ? 16 : 0) * size * (look.face || 1), y + 3, 124 * size, 15 * size, 0, 0, 7); }
  else { pen.ellipse(x, y + 4, (96 - up * 26) * size, (17 - up * 5) * size, 0, 0, 7); }
  pen.fill();
  if (STYLE.light && seat !== "astride") {          // and the shadow the light throws: a lozenge on the ground, leaning away from the light
    pen.save();
    pen.translate(x, y + 4);
    pen.transform(1, 0, -STYLE.light[0] * 1.4, 1, 0, 0);      // sheared away from the light's side
    pen.fillStyle = "rgba(70, 45, 30, " + (0.1 * (1 - up * 0.5)) + ")";
    pen.beginPath();
    pen.ellipse(0, (seat ? 20 : 34) * size * STYLE.light[1], (seat ? 110 : 60) * size, (seat ? 24 : 46) * size * STYLE.light[1], 0, 0, 7);
    pen.fill();
    pen.restore();
  }

  // Dust at the feet for a moment either side of landing: three puffs that
  // spread and fade. They stay on the ground while the body springs up.
  if (look.late !== undefined && land < 0.1 && !seat && !still) {
    var puff = 1 - land / 0.1;
    pen.fillStyle = "rgba(225, 195, 150, " + (0.5 * puff) + ")";
    for (var p = -1; p <= 1; p++) {
      pen.beginPath();
      pen.ellipse(x + p * (28 + (1 - puff) * 46) * size, y + 2 - ((1 - puff) * 10 + Math.abs(p) * 3) * size,
                  (9 + (1 - puff) * 12) * size, (5 + (1 - puff) * 5) * size, 0, 0, 7);
      pen.fill();
    }
  }
  pen.save();
  pen.translate(x, y - (seat ? 0 : up * 26 * size));
  pen.scale(size * (look.face || 1) / Math.sqrt(tallness), size * tallness);

  // Legs: a thigh and a shin each. The feet stay where they are, so the
  // lower the hips drop on the beat, the more the knees have to bend.
  // The walk: a foot on the ground goes straight back, at the speed of the
  // walk; a foot in the air swings forward along an arc. The two feet are
  // half a stride apart. With no step, both feet stand still.
  // A step rolls through the foot. It lands on the heel with the toes up,
  // rolls flat, and at the end of its time on the ground the heel lifts
  // while the ball of the foot stays down: the toe-off. In the air it starts
  // with the toes down and comes round to land on the heel again. "pitch"
  // is the turn of the foot: toes down above 0, toes up below it.
  var feet = [0, 0], lift = [0, 0], pitch = [0, 0], knees = [null, null], ankles = [[0, 0], [0, 0]];
  if (look.step) {
    var ball = (look.shoes ? (slight ? 50 : 66) : (slight ? 40 : 48)) * 0.72;   // from the heel to the ball of the foot
    var reach = 34 * gait, roll = Math.min(1, gait);   // how far a foot goes before and behind; a short step rolls less
    var offTurn = 0.55 * roll;                      // how far the foot has turned as its toes leave the ground
    for (var which = 0; which < 2; which++) {
      var stride = (look.step + which * 0.5) % 1;
      if (stride < 0.5) {                           // on the ground, going back
        var onGround = stride / 0.5;
        pitch[which] = onGround < 0.15 ? -0.3 * roll * (1 - onGround / 0.15)              // the heel strikes: toes up, then flat
                     : onGround > 0.65 ? offTurn * Math.pow((onGround - 0.65) / 0.35, 1.3)   // the toe-off: the heel rises
                     : 0;
        var heelUp = Math.max(0, pitch[which]);     // the foot turns about its ball, so the heel comes up and a little forward
        feet[which] = reach - onGround * 2 * reach + ball * (1 - Math.cos(heelUp));
        lift[which] = ball * Math.sin(heelUp);
      } else {                                      // in the air, swinging forward
        var swing = (stride - 0.5) / 0.5, eased = (1 - Math.cos(swing * Math.PI)) / 2;
        feet[which] = mix(-reach + ball * (1 - Math.cos(offTurn)), reach, eased);
        lift[which] = ball * Math.sin(offTurn) * (1 - swing) * (1 - swing) + Math.sin(swing * Math.PI) * 16 * roll;
        pitch[which] = mix(offTurn, -0.3 * roll, eased);
      }
    }
  }
  // The cloth a sitter's legs are in, as one length from the waist to the
  // hem: a tube as it is, and a tiered skirt with its tiers' bands laid end
  // to end and the foot band's cloth as one wide band.
  var lap = tube;
  if (seat && look.skirt) {
    var woven = WEAVES[look.weave || 0];
    lap = [look.legs, woven[0].map(function (band) { return [band[0] * 0.4, band[1], band[2], band[3]]; })
                      .concat(woven[0].map(function (band) { return [band[0] * 0.76, band[1], band[2], band[3]]; }),
                              [[0.88, woven[2], 60]], woven[1])];
  }
  if (seat) {
    var sat = seated(seat, hipY, lap ? lap[0] : look.legs, lap ? lap[1] : null, slight, leggy);
    knees = [[sat[0][0], sat[0][1] - hipY + 14], [sat[1][0], sat[1][1] - hipY + 14]];
    joints.kneeB = spot(sat[0][0], sat[0][1]);
    joints.kneeA = spot(sat[1][0], sat[1][1]);
    joints.ankleB = spot(sat[2][0], sat[2][1]);
    joints.ankleA = spot(sat[3][0], sat[3][1]);
  }
  for (var legN = 0; !seat && legN < 2; legN++) {
    var leg = sideOn ? 1 - legN : legN;             // the far leg first; seen from the side the far leg is the other one
    var side = leg === 0 ? -1 : 1;
    var footX = side * (footHalf + 24 * (look.sit || 0)) + feet[leg], footY = -8 - lift[leg];
    var lifted = look.raise && look.raise[0] === leg;
    if (lifted) {                                   // a foot lifted on purpose: [which leg, how high, how far forward, its turn]
      footX += look.raise[2];
      footY = -8 - look.raise[1];
      lift[leg] = look.raise[1];
      if (look.raise[3] !== undefined) { pitch[leg] = look.raise[3]; }   // a kicking foot is held as it is told to be
    }
    var stepping = lifted ? look.raise[3] !== undefined : !!look.step;   // the foot's turn is known: a step's roll, or the turn a lifted foot was given
    var raised = stepping ? pitch[leg] / (look.shoes ? 0.5 : 0.45) : lift[leg] / 24;   // how far the foot is turned, as foot() and shoe() take it
    // Where the leg ends: the ankle, ANKLE_FWD forward and ANKLE_UP up from the heel,
    // which is at (footX - 6, footY + 8). Measured on standing people: 14 to 18 up
    // and 6 to 10 forward (joint_models.md, 2026-10-15); it was 22 and 6, an ankle
    // a third too high, which made every shin that much shorter than its thigh.
    var ankleX = footX - 6 + ANKLE_FWD, ankleY = footY + 8 - ANKLE_UP;
    if (stepping) {                                 // a turned foot carries its ankle round the heel
      ankleX = footX - 6 + ANKLE_FWD * Math.cos(pitch[leg]) + ANKLE_UP * Math.sin(pitch[leg]);
      ankleY = footY + 8 + ANKLE_FWD * Math.sin(pitch[leg]) - ANKLE_UP * Math.cos(pitch[leg]);
    }
    if (rig) {                                      // a drawn foot hangs from the ankle, toes to the ground
      knees[leg] = [side * 20, 90];
      var footPart = rig.byName[leg === 0 ? "footR" : "footL"];
      var footLong = footPart ? Math.sqrt(Math.pow(footPart.b[0] - footPart.a[0], 2) + Math.pow(footPart.b[1] - footPart.a[1], 2)) * rig.scale : 40;
      pen.save();
      pen.translate(footX, footY + 8 - footLong);
      pen.rotate(raised * 0.45);
      part(rig, leg === 0 ? "footR" : "footL", 0, 0, 0, footLong);
      pen.restore();
      continue;
    }
    var bareLeg = look.skirt || tube;
    var legDrawn = legOf(hipX + side * hipHalf, hipY + side * hipHalf * (hipTip + rock * 1.4), ankleX, ankleY,   // each leg from its own end of the hips' line
                         bareLeg, bareLeg ? SKIN : look.legs, leggy);
    knees[leg] = [legDrawn[2] - hipX, legDrawn[3] - hipY + 14];   // the knee, measured from the waist, for the cloth
    ankles[leg] = [ankleX - hipX, ankleY - hipY + 14];            // and the ankle
    if (look.tattoo && bareLeg) {                   // the tattoo of a man of the north, from the waist to the knee (Hallett 1890:
      tattoo(hipX + side * hipHalf, hipY + side * hipHalf * (hipTip + rock * 1.4), legDrawn[2], legDrawn[3]);   // "tattooed from the waist downwards")
    }
    if (look.shoes) { shoe(footX - 6, footY + 8, raised, slight); }
    else { foot(footX - 6, footY + 8, raised, slight); }
    if (slight) { oval(ankleX - 1, ankleY + 2, 8, 3, "#e0b23a"); }   // an anklet
    joints["knee" + (leg ? "A" : "B")] = spot(legDrawn[2], legDrawn[3]);
    joints["ankle" + (leg ? "A" : "B")] = spot(ankleX, ankleY);
  }
  joints.hip = spot(hipX, hipY);

  // everything above the hips turns about the waist: a lean, and the rock
  pen.translate(hipX, hipY - 14);
  pen.rotate(turned);
  var breath = Math.sin(clock * 1.5 + x * 0.02);                        // the chest, and all above it, rises
  pen.scale(1 + 0.004 * breath, 1 + 0.007 * breath);                    // and falls about every four seconds
  // The spine is a curve, not a plank. spine(y) is how far across the middle
  // of the torso is at height y (2 at the waist, -134 at the shoulders).
  // A lean is an arc: the waist stays nearer upright and the chest carries
  // on, so the side leaned toward folds and the other stretches. And the
  // sway is a wave: later the higher up, and wider.
  var arc = Math.max(-0.22, Math.min(0.22, 0.6 * turned));
  function spine(y) {
    var u = Math.max(0, (2 - y) / 136);             // 0 at the waist, 1 at the shoulders
    return -arc * 136 * u * (1 - u) + 136 * Math.pow(u, 1.5) * swayAt(0.7 * u);
  }
  var neckX = spine(-138);                          // where the neck stands: the head and the necklace go with it
  // A grown lady's face is a longer oval than a fellow's or a child's, and it
  // stands on a neck: look.head is how wide the head is (0.9 for her unless
  // told, 1 for anyone else), and a head narrower than 1 is lifted by 12.
  var narrow = look.head !== undefined ? look.head : look.bun ? 0.9 : 1, long = narrow < 1 ? 1 : 0;
  joints.waist = spot(0, 0);
  joints.neck = spot(neckX, -148);
  // Where a point of the chest is, once the spine has bent it and the two
  // lines have tipped it: at the waist it goes with the hips' line, at the
  // shoulders with the shoulders', so the side the body has moved to folds
  // and the other side stretches.
  // The shoulders work with the arms. As an arm rises above the level of
  // its shoulder, the shoulder itself rises (the collarbone swings up) and
  // comes in toward the neck, by more the higher the arm goes: 10 up and
  // 10 in with the arm straight overhead, and little in the first part of
  // the rise (measured on photographs, 2026-10-15: see the style doc). An
  // arm held straight out to its side lifts it a little. A hand sent across
  // the body to the other side brings its shoulder forward and in (10 at
  // the most), as the shoulder blade slides round the ribs. The chest's
  // outline carries its shoulder with the root of the arm (chest()).
  function shoulderWork(given, outward) {
    var far = Math.sqrt(given[0] * given[0] + given[1] * given[1]) || 1;
    var raised = given[1] < 0 ? clamp(Math.atan2(-given[1], Math.abs(given[0])) / (Math.PI / 2)) : 0;   // 0 at the shoulder's level, 1 straight up
    var out = clamp((given[0] * outward - 40) / 60) * (1 - raised);                                  // straight out to its own side
    var across = clamp(-given[0] * outward / 60) * clamp(far / 40);                                   // to the other side of the body
    return [10 * Math.pow(raised, 1.5) + 3 * out, 10 * raised + 10 * across];                         // [up, in]
  }
  var workA = shoulderWork(handA, 1), workB = shoulderWork(handB, -1);
  var liftA = workA[0], liftB = workB[0], inA = workA[1], inB = workB[1];
  function chest(px, py) {
    var u = Math.min(1.1, Math.max(0, (2 - py) / 136));
    var high = clamp((-py - 86) / 24);              // the top of the chest, where the shoulders are
    var onA = clamp((px - 10) / 20) * high, onB = clamp((-px - 10) / 20) * high;   // how much of each shoulder this point is
    px += inB * onB - inA * onA;                    // a shoulder comes in with its arm
    py -= liftA * onA + liftB * onB;                // and rises with it
    return [px + spine(py), py + px * (hipTip + (shoulderTip - hipTip) * u)];
  }
  var phase = clock * Math.PI / BEAT + x * 0.01;    // the same clock the rock uses
  var stir = still ? 0.2 : 1;                       // how far cloth swings with it: where nobody rocks, it hangs almost still
  var swell = 1 + dip / 280;                        // cloth spreads as the body drops
  var kneePush = [[knees[0][0], knees[0][1], 44], [knees[1][0], knees[1][1], 44]];   // the knees push the cloth
  if (still && !seat && !rig) {
    // Where nobody hops, cloth has to cover the whole leg of one who walks:
    // the shin and the ankle push it as the knee does. And the cloth leans
    // with the body while the legs do not, so each point is put where the
    // lean leaves it.
    for (var shin = 0; shin < 2; shin++) {
      kneePush.push([(knees[shin][0] + ankles[shin][0]) / 2, (knees[shin][1] + ankles[shin][1]) / 2, 50]);
      kneePush.push([ankles[shin][0], ankles[shin][1], 60]);
    }
    kneePush = kneePush.map(function (push) { return [push[0] + push[1] * turned, push[1], push[2]]; });
  }
  var ground = 14 - hipY;                           // how far below the waist the ground is, for what lies on it when one sits
  // The sabai: one band from beside the base of the neck on the side the
  // figure faces down across the chest, as the sash film's cloth (sabai.js)
  // lies since 2026-10-15 (owner: "make sure all the sashes in the framework
  // sprites look like what you just made"): the top end rounded over the
  // shoulder, the long sides bowed the way the figure faces, the lower end
  // cut on a slant under the other arm (B, the near one in the three-quarter
  // view, drawn last), tucked into the skirt at the waist; and the back of
  // the cloth, from the top end's corner at the shoulder down behind the body
  // past the hip, plain, in shadow, fringed, drawn before the skirt and the
  // chest (sabaiBack), so only what lies past the body's edge is seen. The
  // numbers are the film's in the kit's units (its woman is 1.19 tall): 60
  // wide, the neck point 18 beside and 32 above the shoulder's root, the
  // middle line laid to 33 outside the far root, the band from 50 along it,
  // the lower corner 12 further, bowed 34, the top's bulge 22, the foot 59
  // below the waist. Every point goes through chest(), so it bends with the
  // spine.
  function sabaiLine() {                            // the band's middle line and sides, in the chest's space
    var root = blend3(chestTurn, 4, 40, 46), half = 30;
    var dx = Math.SQRT1_2, dy = -Math.SQRT1_2;      // up the band, 45 degrees
    var neck = [root - 18, -112 - 32], top = [neck[0] + half * Math.SQRT1_2, neck[1] + half * Math.SQRT1_2];
    var cutX = -root - 33, reach = (top[0] - cutX) / dx;
    var end = [top[0] - dx * reach, top[1] - dy * reach];
    var mid = [(top[0] + end[0]) / 2 + 34, (top[1] + end[1]) / 2];   // the curve's control: the middle bows the way the figure faces
    var points = [], marks = [0], len = 0, n;
    for (n = 0; n <= 24; n++) {
      var s = n / 24, v = 1 - s;
      points.push([v * v * end[0] + 2 * v * s * mid[0] + s * s * top[0], v * v * end[1] + 2 * v * s * mid[1] + s * s * top[1]]);
      if (n) { len += Math.hypot(points[n][0] - points[n - 1][0], points[n][1] - points[n - 1][1]); marks.push(len); }
    }
    function at(along) {                            // [x, y, heading] a distance along the middle line, from the lower end
      along = Math.max(0, Math.min(len, along));
      var lo = 0, hi = 24;
      while (hi - lo > 1) { var m = (lo + hi) >> 1; if (marks[m] <= along) { lo = m; } else { hi = m; } }
      var p = points[lo], q = points[lo + 1] || p, w = (along - marks[lo]) / (marks[hi] - marks[lo] || 1);
      return [p[0] + (q[0] - p[0]) * w, p[1] + (q[1] - p[1]) * w, Math.atan2(q[1] - p[1], q[0] - p[0])];
    }
    function side(along, across) {                  // a point "across" from the middle line, to the lower side when positive
      var p = at(along);
      return [p[0] - Math.sin(p[2]) * across, p[1] + Math.cos(p[2]) * across];
    }
    return {half: half, length: len, start: 50, slant: 12, at: at, side: side};
  }
  function sabaiBack(cloth, border) {               // the back of the sabai, hanging from the top end's corner at the shoulder
    var L = sabaiLine(), corner = L.side(L.length, L.half), foot = seat ? ground - 8 : 59, outer = [], hem = [], n, p;
    for (n = 0; n <= 16; n++) {                     // the outer edge: down past the waist and the hand, leaning out 27 by the foot, waving 4 either way
      var yy = corner[1] + (foot - corner[1]) * n / 16;
      outer.push([corner[0] + 27 * n / 16 + Math.sin(n / 16 * Math.PI * 2.5 + clock * 0.8) * 4, yy]);
    }
    var last = outer[16];
    for (n = 0; n <= 8; n++) {                      // the hem: a curve from the outer edge's foot to the inner edge, 20 past the middle, bowing down 8
      var sh = n / 8;
      hem.push([last[0] + (20 - last[0]) * sh, foot + Math.sin(sh * Math.PI) * 8 - sh * 7]);
    }
    pen.save();
    pen.transform(1, -hipTip, 0, 1, 0, 0);       // the skirt is drawn under the hips' tilt; chest() has it already
    var inner = chest(20, corner[1] + 13), on = outer.map(function (q) { return chest(q[0], q[1]); }), hm = hem.map(function (q) { return chest(q[0], q[1]); });
    pen.save();
    pen.beginPath();
    pen.moveTo(inner[0], inner[1]);
    on.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    hm.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    pen.closePath();
    pen.fillStyle = cloth;                          // the cloth, unmarked
    pen.fill();
    pen.clip();
    var shade = pen.createLinearGradient(inner[0], 0, on[8][0], 0);   // darker toward the body, as the back of a cloth is
    shade.addColorStop(0, "rgba(20, 0, 10, 0.38)");
    shade.addColorStop(1, "rgba(20, 0, 10, 0.08)");
    pen.fillStyle = shade;
    pen.fill();
    pen.strokeStyle = "rgba(20, 0, 10, 0.16)";      // three soft folds down it
    pen.lineWidth = 6;
    for (n = 1; n <= 3; n++) {
      pen.beginPath();
      on.forEach(function (q, i) {
        var xx = q[0] + (inner[0] - q[0]) * (n / 4) + Math.sin(i / 4 + n) * 2;
        if (i) { pen.lineTo(xx, q[1]); } else { pen.moveTo(xx, q[1]); }
      });
      pen.stroke();
    }
    pen.restore();
    pen.strokeStyle = border;                       // the border down the outer edge and along the foot, and the fringe from the foot
    pen.lineWidth = 3;
    pen.lineCap = "butt";
    pen.beginPath();
    on.forEach(function (q, i) { if (i) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); } });
    hm.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    pen.stroke();
    pen.lineWidth = 1.6;
    for (n = 0; n < hm.length; n++) {
      p = hm[n];
      pen.beginPath();
      pen.moveTo(p[0], p[1]);
      pen.lineTo(p[0] + (4 - n) * 0.6, p[1] + 13 - Math.abs(4 - n));
      pen.stroke();
    }
    pen.restore();
  }
  pen.save();
  pen.transform(1, hipTip, 0, 1, 0, 0);             // what hangs from the hips tips with their line
  if (rig) {                                        // a drawn skirt hangs from the hips and sways a little
    pen.save();
    pen.translate(0, 14);
    pen.rotate(0.05 * Math.sin(phase - 1));
    part(rig, "skirt", 0, 0, 0, 100);
    pen.restore();
  } else if (look.skirt) {
    // A pha sin in three tiers, the longest drawn first. The lowest tier
    // swings the furthest and the latest, as the bottom of a real skirt does.
    var hem = 158 * leggy - dip;
    var sabaiCloth = look.sabai || ["#f6e3a1", "#8a2a3a"];
    if (look.sabai !== false) { sabaiBack(sabaiCloth[0], sabaiCloth[1]); }   // the back of the sabai hangs behind her, before the skirt
    if (!seat) {
    var weave = WEAVES[look.weave || 0];
    tier(hem, 86 * swell, 36 * stir, phase, weave[2], 14, weave[1], kneePush);     // the woven band at the foot: a teen jok
    tier(hem * 0.76, 74 * swell, 27 * stir, phase, look.legs, 13, weave[0], kneePush);
    tier(hem * 0.4, 56, 14 * stir, phase, look.legs, 11, weave[0], kneePush);
    }
  } else if (tube) {                               // a pha sin or a sarong: one long tier, striped across
    if (look.sabai) { sabaiBack(look.sabai[0], look.sabai[1]); }   // the back of a man's shoulder cloth hangs behind him, before the sarong
    if (!seat) {
    var hemAt = 196 * leggy - dip * 0.5;            // to the ankle; a patoi stops at the knee (true) or higher (0.5 is half-way up the thigh)
    if (look.patoi) { hemAt = ((knees[0][1] + knees[1][1]) / 2 + 6) * (look.patoi === true ? 1 : look.patoi); }
    tier(hemAt, (look.sin !== undefined ? 58 : 64) * swell, 22 * stir, phase, tube[0], look.sin !== undefined ? 3 : 6,
         tube[1], kneePush);
    }
  } else if (look.coat) {
    tier(seat ? ground - 6 : 120 * leggy - dip * 0.6, 70 * swell, (seat ? 6 : 26) * stir, phase, "#ffffff", seat ? 3 : 9);  // a long coat flows the same way
  } else if (!look.bare) {                         // (a bare chest has no shirt, so no hem)
    tier(seat ? 30 : 60, 58 * swell, (seat ? 5 : 17) * stir, phase, look.shirt, 5,  // the hem of a shirt, over the hips, with a trim
         look.coat ? null : [[0.86, "rgba(230, 140, 60, 0.85)", 2.2]]);
  }
  pen.restore();
  // A child's trunk is shorter and narrower, not a grown-up's made small:
  // all that is above the waist is drawn smaller about the waist, by up to
  // 0.88 at a build of -1. The head and the arms are given back what that
  // takes from them, so the head keeps its size and the arms their length.
  var trunk = 1 + 0.12 * Math.min(0, build);
  pen.scale(trunk, trunk);
  small = small / trunk;
  var shoulderY = -112;
  // The arms, worked out here so that an arm which hangs behind the body
  // (the far arm of a figure seen from the side) can be drawn before the
  // chest; the rest are drawn after the head, over the body.
  var flex = Math.sin(phase * 2 - 1.1) * 0.22;     // the wrist bends a little after the arm, once a beat
  var wristA, wristB, poseA, poseB;
  var rootHalf = blend3(chestTurn, 4, 40, 46);      // the shoulders this far from the spine: over the middle in profile, widest seen from the front
  var rootA = chest(rootHalf, shoulderY), rootB = chest(-rootHalf, shoulderY);   // the shoulders, where the spine, their line and the arms have put them
  // A child's arms are as much shorter as its legs are, and its hands with
  // them: an arm is drawn smaller about its shoulder, with the pen's weight
  // kept, and the wrist and the elbow it gives back are put where they came
  // to. Anyone else's arms are drawn as they are.
  var arms = Math.min(1, leggy) / trunk;
  var sleeve = look.bare ? SKIN : look.shirt;       // a bare chest has bare arms
  function armOf(root, hand, outward, key) {
    if (arms === 1) { return arm(root[0], root[1], hand, outward, sleeve, key); }
    var pen0 = LINE;
    LINE = LINE / arms;
    pen.save();
    pen.translate(root[0], root[1]);
    pen.scale(arms, arms);
    pen.translate(-root[0], -root[1]);
    var at = arm(root[0], root[1], hand, outward, sleeve, key);
    pen.restore();
    LINE = pen0;
    return [root[0] + (at[0] - root[0]) * arms, root[1] + (at[1] - root[1]) * arms,
            root[0] + (at[2] - root[0]) * arms, root[1] + (at[3] - root[1]) * arms];
  }
  function aimed(reach, root) {                     // the hand that takes this arm's wrist to a point of the scene
    var onSheet = scene.transformPoint(new DOMPoint(reach[0], reach[1]));
    var here = pen.getTransform().inverse().transformPoint(onSheet);
    return handFor((here.x - root[0]) / arms, (here.y - root[1]) / arms);
  }
  if (look.reachA) { handA = aimed(look.reachA, rootA); }
  if (look.reachB) { handB = aimed(look.reachB, rootB); }
  if (look.wai) {                                   // the two wrists side by side before the chest, a little below the shoulders' line
    var waiX = spine(-84) + 8;
    handA = handFor((waiX + 4 - rootA[0]) / arms, (-84 - rootA[1]) / arms);
    handB = handFor((waiX - 4 - rootB[0]) / arms, (-84 - rootB[1]) / arms);
  }
  // Big gloved hands for the fellows, as they drew them, and small bare
  // hands for the ladies.
  var handSize = (look.gloves ? 1.25 : look.bun ? 0.95 : 1.1) * arms;
  var rings = look.bangles !== undefined ? look.bangles : look.bun ? 2 : look.coat ? 0 : 1;
  // Everything about a hand, from the look and the arm it ends ("A" the
  // near arm, "B" the far one; "given" is where the hand was asked for).
  // A hand points the way its forearm points, from the elbow to the wrist,
  // plus the bend of the wrist a scene asks for (wristA, wristB: a hand
  // laid flat on a drum head bends about 1), plus a little flex on the
  // beat. A lifted hand is open, and opens wider at the top of a hop, and
  // shows its palm; a dancer's lifted hand is the dance hand. A hanging
  // hand is half closed. A bare hand below its shoulder, holding nothing
  // and with no reading of its fingers, is at rest: its wrist is nearly
  // still, its fingers lie gently curled (REST), and it shows its back and
  // a little of the thumb's edge, so the fingers stack. A hand closed round
  // a thing shows its thumb's edge, where a fist reads as one. palmA and
  // palmB turn a hand as a scene wants it.
  function handPose(which, wrist, given) {
    var near = which === "A", bend = near ? look.wristA : look.wristB, fingers = near ? look.fingersA : look.fingersB, turned = near ? look.palmA : look.palmB;
    var rest = given[1] >= 0 && !look.grip && !look.gloves && !fingers;
    var angle = Math.atan2(wrist[1] - wrist[3], wrist[0] - wrist[2]) + (near ? 1 : -1) * flex * (rest ? 0.3 : 1)
              + (bend !== undefined ? bend : near && look.holding === "stick" ? 0.9 : 0);   // a hand on a stick lies over its top
    var lifted = look.dance ? 1.6 : 0.7 + 0.3 * up;
    var open = look.grip || (near && look.holding === "stick") ? 0.12 : given[1] < 0 ? lifted : rest ? 0.1 : 0.35;   // a grip is a fist round a thing
    var curls = fingers || (rest ? (STYLE.hands === "flat" ? (near ? REST_A : REST_B) : REST) : undefined);
    if (near && look.holding === "stick") { curls = undefined; }
    var thumb = near ? -1 : given[1] < 0 ? 1 : -1;  // a lifted hand turns its thumb to the head; a hanging hand turns its thumb forward
    var palm = rest ? 0.15 : given[1] < 0 ? (look.dance ? 0.15 : 0.85) : 0.3;   // the back of a hanging hand; the palm of a lifted one; the dance hand's back, its long nails seen whole
    var nails = look.nails === "long" ? "long" : look.nails && given[1] < 0;   // long nails are worn all the time; tips show on a lifted hand
    if (look.wai) {                                 // the hands stand upright whatever the forearms do, the fingers straight and together, the thumbs to the chest
      angle = -Math.PI / 2 + (near ? -0.05 : 0.05);
      open = 0;
      curls = WAI;
      palm = 0.25;
    }
    if (look.parasol) {
      if (near) {                                   // the near hand closed round the parasol's handle, pointing up it (or down behind her, carried)
        var holdHang = parasolOf(look.parasol).hang || 0, holdAxis = -Math.PI / 2 + parasolSwing(parasolOf(look.parasol).tilt, holdHang);
        angle = holdAxis + Math.PI / 2;             // the fist square to the handle, the wrist behind it and the fingers wrapping forward (gripHand)
        if (Math.cos(angle) < 0) { angle = holdAxis - Math.PI / 2; }
      } else {
        if (rest) { curls = PARASOL_FREE; }
        if (parasolOf(look.parasol).busy > 0.5) { open = 0.12; curls = undefined; palm = 0; }
      }
    }
    if (open <= 0.12) { palm = 0.3; }               // closed round a thing
    if (turned !== undefined) { palm = turned; }
    return {angle: angle, open: open, curls: curls, thumb: thumb, palm: palm, nails: nails};
  }
  // The hand in the round takes curls; a hand given only how open it is
  // (as the flat hand is) gets them by the flat hand's own rule, and past 1
  // the dance hand: fingers straight, fanned, and bent back at the knuckle
  function roundPose(pose) {
    var open = Math.min(1, pose.open), back = Math.max(0, pose.open - 1), curls = pose.curls;
    if (!curls) {
      var curl = back > 0 ? 0 : 0.12 + (1 - open);
      curls = [0, 1, 2, 3].map(function (f) { return clamp((curl + 0.1 * f - 0.08) / 1.3); });
      curls.push(clamp((0.75 * (1 - open) + 1.3 * back) / 1.1));
    }
    return {curls: curls, spread: pose.curls ? 0.15 : 0.04 + 0.2 * open + 0.22 * back, arch: 0.5 * back,
            thumb: pose.thumb, palm: pose.palm, nails: pose.nails};
  }
  function drawHand(which, wrist, pose) {
    var near = which === "A";
    pen.save();
    pen.translate(wrist[0], wrist[1]);
    bangles(pose.angle, rings);
    pen.scale(handSize, handSize);
    if (near && look.parasol) { gripHand(0, 0, pose.angle); }   // a hand closed round the parasol's handle, from the photograph
    else if (look.gloves || STYLE.hands === "flat") { glove(0, 0, pose.angle, pose.thumb, !look.gloves, pose.open, pose.nails, pose.curls); }
    else { hand(0, 0, pose.angle, roundPose(pose)); }
    pen.restore();
  }
  // The far arm (A, on the side the figure faces, the far shoulder of a
  // body seen three-quarter) hangs behind the body: it is drawn before the
  // chest, hand and all, at every turn, and shows only where it comes out
  // past the chest's edge (owner, 2026-10-15: "the far shoulder should be
  // behind the body"). It stays in front when its hand is lifted (a dance
  // hand before the face), crosses to the other side, goes to a point of
  // the scene, makes a wai or closes round a thing with the other hand:
  // all of those lie before the body.
  var behindA = !rig && handA[1] > 0 && handA[0] > -10 && !look.wai && !look.grip && !look.reachA;
  // a band of dark cord round a bare upper arm (gold, with a stone, on a noble), drawn with its arm
  function armBand(root, wrist) {
    var ax = root[0] + (wrist[2] - root[0]) * 0.42, ay = root[1] + (wrist[3] - root[1]) * 0.42;
    pen.save();
    pen.translate(ax, ay);
    pen.rotate(Math.atan2(wrist[3] - root[1], wrist[2] - root[0]));
    oval(0, 0, look.regalia ? 4.5 : 3, 12.5 * arms, look.regalia ? STYLE.gold : "#3b2a24");
    if (look.regalia) { oval(0, 0, 1.6, 1.8, "#d9533a"); }   // a stone on the gold band
    pen.restore();
  }
  if (behindA) {
    wristA = armOf(rootA, handA, 1, who + "/armA");
    if (look.bare) { armBand(rootA, wristA); }
    poseA = handPose("A", wristA, handA);
    drawHand("A", wristA, poseA);
  }
  if (rig) {                                        // the drawn torso, hips to shoulders, slanted to where the spine ends
    pen.save();
    pen.transform(1, 0, -spine(-134) / 134, 1, 0, 0);
    part(rig, "torso", 0, 14, 0, -134, true);
    pen.restore();
  } else {
  outline(look.bun ? blendOutline(chestTurn, CHEST_LADY_P, CHEST_LADY, CHEST_LADY_F)
                   : blendOutline(chestTurn, CHEST_MAN_P, CHEST_MAN, CHEST_MAN_F), chest);   // the chest, turned, bent along the spine and tipped
  shape(look.bare ? SKIN : look.shirt);              // a bare chest is the skin
  // Paint on the body, kept inside its outline: the back is in shadow, the
  // head throws a shadow on the shoulders, and the front catches the light.
  var midX = spine(-70);                            // the paint goes across with the middle of the chest
  pen.save();
  pen.clip();
  var shadow = pen.createLinearGradient(-62 + midX, 0, 14 + midX, 0);
  shadow.addColorStop(0, "rgba(60, 30, 50, 0.34)");
  shadow.addColorStop(1, "rgba(60, 30, 50, 0)");
  pen.fillStyle = shadow;
  pen.fillRect(-100, -150, 200, 170);
  pen.fillStyle = "rgba(60, 30, 50, 0.2)";
  pen.beginPath();
  pen.ellipse(6 + neckX, -132, 30, 13, 0, 0, 7);
  pen.fill();
  var lit = pen.createLinearGradient(26 + midX, 0, 62 + midX, 0);   // the front edge, in the light
  lit.addColorStop(0, "rgba(255, 250, 235, 0)");
  lit.addColorStop(1, "rgba(255, 250, 235, 0.22)");
  pen.fillStyle = lit;
  pen.fillRect(20 + midX, -150, 80, 170);
  pen.restore();
  if (look.collar) {
    // A wrap blouse, as the dancers of the paintings wear: a patterned band
    // down both sides of a V neck, and on from its point down the front edge
    // to the waist. look.collar is [the band's colour, the pattern's].
    var c0 = chest(-17, -133), c1 = chest(5, -97), c2 = chest(25, -132), c3 = chest(27, -6);
    outline(look.bun ? CHEST_LADY : CHEST_MAN, chest);
    pen.save();
    pen.clip();                                     // the band stays on the blouse
    pen.lineCap = "round";
    pen.lineJoin = "round";
    for (var edge = 0; edge < 3; edge++) {          // its dark edge, the band, then the pattern as a dotted line
      pen.strokeStyle = [inkFor(look.collar[0]), look.collar[0], look.collar[1] || STYLE.gold][edge];
      pen.lineWidth = [11.5, 8.5, 2.4][edge];
      pen.setLineDash(edge === 2 ? [0.1, 5.5] : []);
      pen.beginPath();
      pen.moveTo(c0[0], c0[1]);
      pen.lineTo(c1[0], c1[1]);
      pen.lineTo(c2[0], c2[1]);
      pen.moveTo(c1[0], c1[1]);
      pen.quadraticCurveTo(c1[0] + 16, (c1[1] + c3[1]) / 2, c3[0], c3[1]);
      pen.stroke();
    }
    pen.setLineDash([]);
    pen.restore();
  }
  var sabaiFront = null;                            // the kit's sabai, kept to be drawn again over an upper arm in a wai
  if ((look.skirt || look.sabai) && look.sabai !== false) {   // the sabai across the chest, over the body and under the arms; sabai: false for none (a cloth of sabai.js is worn instead)
    var sabaiOf = look.sabai || ["#f6e3a1", "#8a2a3a"], L = sabaiLine(), half = L.half;
    var sabaiCorner = function (a) { return L.side(L.start - L.slant * (a + half) / (2 * half), a); };   // where the slanted end meets the edge "a" across
    var sabaiPath = function (inner, outer) {       // the band between two offsets, from the slanted end up to the rounded top and back, through chest()
      var n, p, s, v, q0 = L.side(L.length, -half), q1 = L.side(L.length, half), tip = L.at(L.length);
      var cx = (q0[0] + q1[0]) / 2 + Math.cos(tip[2]) * 22, cy = (q0[1] + q1[1]) / 2 + Math.sin(tip[2]) * 22;   // the top's bulge, ahead of the end
      pen.beginPath();
      p = chest.apply(null, sabaiCorner(inner));
      pen.moveTo(p[0], p[1]);
      for (n = 0; n <= 16; n++) { p = chest.apply(null, L.side(L.start + (L.length - L.start) * n / 16, inner)); pen.lineTo(p[0], p[1]); }
      for (n = 0; n <= 6; n++) {
        s = (inner + half) / (2 * half) + (outer - inner) / (2 * half) * n / 6;
        v = 1 - s;
        p = chest(v * v * q0[0] + 2 * v * s * cx + s * s * q1[0], v * v * q0[1] + 2 * v * s * cy + s * s * q1[1]);
        pen.lineTo(p[0], p[1]);
      }
      for (n = 16; n >= 0; n--) { p = chest.apply(null, L.side(L.start + (L.length - L.start) * n / 16, outer)); pen.lineTo(p[0], p[1]); }
      p = chest.apply(null, sabaiCorner(outer));
      pen.lineTo(p[0], p[1]);
      pen.closePath();
    };
    var sabaiEdgeLine = function (edge) {           // along one edge, from the slanted end to the top
      var n, p;
      pen.beginPath();
      p = chest.apply(null, sabaiCorner(edge));
      pen.moveTo(p[0], p[1]);
      for (n = 0; n <= 16; n++) { p = chest.apply(null, L.side(L.start + (L.length - L.start) * n / 16, edge)); pen.lineTo(p[0], p[1]); }
      pen.stroke();
    };
    var sabaiFrame = pen.getTransform();
    sabaiFront = function () {
    pen.save();
    pen.setTransform(sabaiFrame);                   // the frame it was first drawn in, wherever the pen is now
    pen.beginPath();
    pen.rect(-1e4, -1e4, 2e4, 1e4 + 7);             // tucked into the skirt at the waist: nothing below it
    pen.clip();
    sabaiPath(-half, half);
    pen.fillStyle = sabaiOf[0];                     // the cloth
    pen.fill();
    pen.clip();
    pen.fillStyle = sabaiOf[1];                     // the woven border along each long side
    sabaiPath(-half + 2, -half + 8);
    pen.fill();
    sabaiPath(half - 8, half - 2);
    pen.fill();
    if (sabaiOf[2] === "check") {                   // a checked cloth: bars across it, and two threads along it, in the border's colour
      pen.strokeStyle = inkFor(sabaiOf[1]);
      pen.globalAlpha = 0.4;
      pen.lineWidth = 2 * half - 6;
      pen.setLineDash([5, 7]);
      sabaiEdgeLine(0);
      pen.setLineDash([]);
      pen.globalAlpha = 1;
      pen.lineWidth = 1.6;
      sabaiEdgeLine(-half + 14);
      sabaiEdgeLine(half - 14);
    }
    pen.strokeStyle = STYLE.gold;                   // a gold thread at each edge
    pen.lineWidth = 1.6;
    sabaiEdgeLine(-half + 1);
    sabaiEdgeLine(half - 1);
    pen.restore();
    };
    sabaiFront();
  } else if (look.bare && look.tattoo) {            // a bare chest: the tattoo of a man of the north reaches the chest and the collarbones
    var star = chest(26, -94), bones = chest(2, -128);
    pen.save();
    outline(CHEST_MAN, chest);
    pen.clip();                                     // the ink stays on the body
    pen.strokeStyle = "rgba(28, 36, 64, 0.6)";
    pen.lineCap = "round";
    pen.lineWidth = 2 * FINE;
    pen.beginPath();
    for (var ray = 0; ray < 8; ray++) {             // a star on the breast
      var way = ray * Math.PI / 4;
      pen.moveTo(star[0] + Math.cos(way) * 4, star[1] + Math.sin(way) * 4);
      pen.lineTo(star[0] + Math.cos(way) * 13, star[1] + Math.sin(way) * 13);
    }
    pen.stroke();
    pen.setLineDash([0.1, 5]);                      // a row of dots along the collarbones
    pen.lineWidth = 3 * FINE;
    pen.beginPath();
    pen.moveTo(bones[0] - 36, bones[1] + 4);
    pen.quadraticCurveTo(bones[0], bones[1] + 18, bones[0] + 36, bones[1] + 4);
    pen.stroke();
    pen.setLineDash([]);
    pen.restore();
  } else {                                          // buttons down the front
    if (!look.coat && !look.plain) {                // a mo hom's neck: round, with no collar. The shirts of the north from the
      pen.save();                                   // reign of Rama V on were round-necked, open down the front and tied or
      pen.translate(spine(-130), 0);                // buttoned (Manop Manasaem, Fine Arts Journal 1:1); the stand collar the
      pen.transform(1, shoulderTip, 0, 1, 0, 0);    // kit drew until 2026-10-13 is not in that record
      pen.strokeStyle = "rgba(20, 20, 50, 0.45)";
      pen.lineWidth = 4;
      pen.lineCap = "round";
      pen.beginPath();
      pen.moveTo(-22, -138);
      pen.quadraticCurveTo(0, -120, 24, -138);      // the neckline, a shallow bowl
      pen.moveTo(2, -126);
      pen.lineTo(4, -108);                          // and the slit of the front opening
      pen.stroke();
      pen.restore();
    }
    for (var button = 0; look.buttons !== false && button < 3; button++) {
      pen.fillStyle = look.coat ? "#8fa3b5" : "rgba(20, 20, 40, 0.55)";
      pen.beginPath();
      var buttonAt = chest(16, -98 + button * 30);  // each button goes with the chest at its height
      pen.arc(buttonAt[0], buttonAt[1], 5, 0, 7);
      pen.fill();
    }
    if (!look.coat && !look.plain && !look.bun) {   // a breast pocket on a mo hom
      var pocketAt = chest(37, -85), pocketX = pocketAt[0] - 37, pocketY = pocketAt[1] + 85;
      pen.strokeStyle = "rgba(20, 20, 50, 0.4)";
      pen.lineWidth = 2 * FINE;
      pen.beginPath();
      pen.moveTo(28 + pocketX, -94 + pocketY);
      pen.lineTo(28 + pocketX, -74 + pocketY);
      pen.lineTo(46 + pocketX, -76 + pocketY);
      pen.lineTo(46 + pocketX, -96 + pocketY);
      pen.stroke();
    }
  }
  if (!look.coat && !look.skirt && !look.plain && look.sin === undefined) {   // a pha khao ma round the waist
    pen.save();
    pen.transform(1, hipTip, 0, 1, 0, 0);           // it lies along the hips' line
    var lagW = follow(who + "/waist", -28, 2, 60, 7, 30);   // the ends lag behind the body
    var endA = [-46 - 6 * Math.sin(phase - 1) + lagW[0], 44 + 8 * Math.sin(clock * 5 + x) + lagW[1] * 0.5];
    var endB = [-36 - 8 * Math.sin(phase - 1.3) + lagW[0] * 0.8, 52 + 6 * Math.cos(clock * 5 + x) + lagW[1] * 0.5];
    if (look.bare && !seat) {                       // a bare-chested man's sash: a bright cloth whose ends hang to the knee
      endA = [-18 - 6 * Math.sin(phase - 1) + lagW[0] * 0.6, 118 + 6 * Math.sin(clock * 5 + x) + lagW[1] * 0.3];
      endB = [-6 - 8 * Math.sin(phase - 1.3) + lagW[0] * 0.5, 128 + 5 * Math.cos(clock * 5 + x) + lagW[1] * 0.3];
    }
    if (seat) {                                     // they lie on the ground beside him
      endA = [-58 + lagW[0] * 0.2, ground - 16];
      endB = [-46 + lagW[0] * 0.2, ground - 13];
    }
    ribbon(-28, 2, endA[0], endA[1], 0.3, 10, look.bare ? "#d6336c" : "#c8553d");
    ribbon(-28, 2, endB[0], endB[1], 0.2, 10, look.bare ? "#e8507f" : "#f4c542");
    pen.strokeStyle = INK;                          // the fringe at the ends
    pen.lineWidth = 1.4 * FINE;
    pen.beginPath();
    for (var thread = -1; thread <= 1; thread++) {
      pen.moveTo(endA[0] + thread * 3, endA[1] + 4);
      pen.lineTo(endA[0] + thread * 3.5, endA[1] + 11);
      pen.moveTo(endB[0] + thread * 3, endB[1] + 4);
      pen.lineTo(endB[0] + thread * 3.5, endB[1] + 11);
    }
    pen.stroke();
    pen.beginPath();
    pen.moveTo(-34, -14);
    pen.quadraticCurveTo(0, -6, 34, -14);
    pen.lineTo(32, 8);
    pen.quadraticCurveTo(0, 16, -32, 8);
    pen.closePath();
    shape("#c8553d");
    pen.save();
    pen.clip();
    pen.strokeStyle = "rgba(255, 230, 180, 0.6)";   // the checks
    pen.lineWidth = 3;
    for (var check = -4; check <= 4; check++) {
      pen.beginPath();
      pen.moveTo(check * 8, -16);
      pen.lineTo(check * 8, 18);
      pen.moveTo(-40, -12 + check * 6);
      pen.lineTo(40, -4 + check * 6);
      pen.stroke();
    }
    pen.restore();
    oval(-30, -3, 7, 6, "#c8553d");                  // the knot
    pen.restore();
  }
  }                                                 // end of the kit's own torso
  if (look.drum) {
    pen.save();                                     // the drum hangs on a strap: it bounces a little late
    var strap = chest(46, -70);                     // the strap crosses the chest here, and goes with it
    var lagD = follow(who + "/drum", strap[0], strap[1], 40, 5, 30);   // it swings on its strap after the body
    pen.translate(strap[0] + 2 * Math.sin(phase - 1.5) + lagD[0] * 0.3, strap[1] + 5 * Math.sin(phase - 1.2) + lagD[1] * 0.3);
    pen.rotate(-0.6 + 0.06 * Math.sin(phase - 1.5) - lagD[0] * 0.004);
    pen.beginPath();
    pen.moveTo(-38, 0);
    pen.lineTo(-16, 190);
    pen.lineTo(16, 190);
    pen.lineTo(38, 0);
    pen.closePath();
    shape("#b5532c");
    pen.fillStyle = "#f4c542";
    pen.fillRect(-33, 28, 66, 11);
    pen.fillRect(-24, 108, 48, 9);
    oval(0, 0, 39, 15, land < 0.08 ? "#fff9ea" : "#f3e3c3");
    if (look.late !== undefined && land < 0.08) {     // the hand has just hit: the head rings
      pen.strokeStyle = INK;
      pen.lineWidth = 2 * FINE;
      pen.lineCap = "round";
      for (var ray = 0; ray < 5; ray++) {
        var ang = -2.2 + ray * 0.55, far = 46 + (0.08 - land) * 120;
        pen.beginPath();
        pen.moveTo(Math.cos(ang) * 44, Math.sin(ang) * 18);
        pen.lineTo(Math.cos(ang) * far, Math.sin(ang) * far * 0.4);
        pen.stroke();
      }
    }
    pen.restore();
  }
  if (!rig) {                                       // a drawn head brings its own neck
  oval(neckX, -142 - (look.bun ? 4 : 0) - 5 * long, 13 - 1.5 * long, (look.bun ? 28 : 24) + 6 * long, SKIN);   // a long neck, between chest and head
  pen.fillStyle = "rgba(150, 70, 60, 0.3)";         // in the shadow of the chin
  pen.beginPath();
  pen.ellipse(2 + neckX, -152 - 11 * long, 12 - 1.5 * long, 9, 0, 0, 7);
  pen.fill();
  if (look.bun) {                                   // a necklace, and a pendant
    pen.strokeStyle = "#e0b23a";
    pen.lineWidth = 3;
    pen.beginPath();
    pen.arc(neckX, -138, 14, 0.15, Math.PI - 0.15);
    pen.stroke();
    pen.lineWidth = 2;
    pen.beginPath();
    pen.arc(neckX, -138, 18, 0.25, Math.PI - 0.25);
    pen.stroke();
    var chestX = spine(-120);                       // the pendant lies on the chest
    oval(chestX - 7, -121, 2.6, 4, STYLE.gold);
    oval(chestX, -119, 3, 5, STYLE.gold);
    oval(chestX + 7, -121, 2.6, 4, STYLE.gold);
    oval(chestX, -120, 1.4, 1.8, "#d9533a");            // a red stone in the middle drop
  } else if (look.bare && look.regalia) {           // a noble's collar: a broad plate of gold round the neck, beaded at its edge
    pen.strokeStyle = STYLE.gold;
    pen.lineWidth = 11;
    pen.beginPath();
    pen.arc(neckX, -140, 19, 0.1, Math.PI - 0.1);
    pen.stroke();
    pen.strokeStyle = "rgba(120, 80, 20, 0.6)";
    pen.lineWidth = 1.2;
    pen.beginPath();
    pen.arc(neckX, -140, 24, 0.15, Math.PI - 0.15);
    pen.stroke();
    pen.fillStyle = "#d9533a";
    for (var bead = 0; bead < 5; bead++) {           // red stones along it
      var beadAt = 0.4 + bead * (Math.PI - 0.8) / 4;
      pen.beginPath();
      pen.arc(neckX + Math.cos(beadAt) * 19, -140 + Math.sin(beadAt) * 19, 2.2, 0, 7);
      pen.fill();
    }
    var sashA = chest(-30, -112), sashB = chest(34, -20);   // a jewelled sash from the shoulder across to the hip
    pen.strokeStyle = STYLE.gold;
    pen.lineWidth = 9;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(sashA[0], sashA[1]);
    pen.quadraticCurveTo((sashA[0] + sashB[0]) / 2 - 6, (sashA[1] + sashB[1]) / 2, sashB[0], sashB[1]);
    pen.stroke();
    pen.fillStyle = "#d9533a";
    for (var gem = 1; gem < 5; gem++) {
      var gu = gem / 5, gx = (1 - gu) * (1 - gu) * sashA[0] + 2 * (1 - gu) * gu * ((sashA[0] + sashB[0]) / 2 - 6) + gu * gu * sashB[0];
      var gy = (1 - gu) * (1 - gu) * sashA[1] + 2 * (1 - gu) * gu * ((sashA[1] + sashB[1]) / 2) + gu * gu * sashB[1];
      pen.beginPath();
      pen.arc(gx, gy, 2, 0, 7);
      pen.fill();
    }
    var buckle = chest(4, 2);                        // the belt's jewelled plate at the waist
    oval(buckle[0], buckle[1], 13, 8, STYLE.gold);
    oval(buckle[0], buckle[1], 4, 4, "#d9533a");
  } else if (look.bare) {                           // a silver ring round the neck
    pen.strokeStyle = "#d8dbe0";
    pen.lineWidth = 4;
    pen.beginPath();
    pen.arc(neckX, -138, 16, 0.2, Math.PI - 0.2);
    pen.stroke();
    pen.strokeStyle = "rgba(60, 60, 80, 0.5)";
    pen.lineWidth = 1.2;
    pen.beginPath();
    pen.arc(neckX, -138, 18, 0.25, Math.PI - 0.25);
    pen.stroke();
  }
  }

  // The head tips against the rock of the body, and settles
  // into the shoulders on the beat.
  var lagH = follow(who + "/head", neckX, -186, 90, 7, 30);    // the head lags the body, and overshoots as it stops
  pen.save();                                     // the head, in a frame of its own
  var headWide = 0.84 * narrow, headTall = 0.92 + 0.3 * (1 - narrow);
  // The head is drawn about its middle, which is 59 above its chin. A smaller
  // head is moved down by what it lost below its middle, so the chin stays
  // where it was, on the neck.
  pen.translate(neckX, -186 - (look.bun ? 8 : 3) - 12 * long + (still ? 0 : 8 * (1 - up)) + 59 * headTall * (1 - small));
  var tilted = look.tilt !== undefined ? look.tilt : feel.tilt;   // how far a dancer's pose, or a feeling, tilts the head
  pen.rotate(-rock * 2.4 + 0.6 * swayAt(1.3) + tilted + lagH[0] * 0.004); // the sway reaches it last
  if (rig) {                                        // the drawn head, turning about the top of the neck
    part(rig, "head", 0, 0, 0, -100);
  } else {
  pen.scale(headWide * small, headTall * small);
  LINE = LINE / small;                              // on a smaller head the pen keeps the weight it has on the body
  pen.translate(0, 286);
  joints.crown = spot(0, -348);                     // the top of the skull, and the point of the chin
  joints.chin = spot(0, -227);
  // What hangs from a head hangs straight down, however far a pose tilts
  // the head: a tail of hair, strands of flowers, a garland, an earring.
  // "upright" is the turn that takes this tilted frame's "down" back to the
  // film's (the frame is narrower than it is tall, which the turn allows
  // for), and (downX, downY) is that way down, measured in this frame. With
  // no tilt they are 0 and (0, 1), and nothing changes.
  var upright = -Math.atan(Math.tan(tilted) * headTall / headWide);
  var downX = -Math.sin(upright), downY = Math.cos(upright);
  function hung(x0, y0, across, along) {            // a point of a thing that hangs from (x0, y0): so far across, so far down
    return [x0 + downY * across + downX * along, y0 - downX * across + downY * along];
  }
  if (look.halo) {                                               // a halo behind the head, as a thangka paints one
    pen.fillStyle = "rgba(90, 150, 100, 0.35)";
    pen.beginPath();
    pen.arc(2, -300, 96, 0, 7);
    pen.fill();
    pen.strokeStyle = STYLE.gold;
    pen.lineWidth = 5;
    pen.stroke();
    pen.lineWidth = 1.5;                                         // a ring of small marks on its rim
    pen.beginPath();
    for (var mark = 0; mark < 36; mark++) {
      var ma = mark / 36 * Math.PI * 2;
      pen.moveTo(2 + Math.cos(ma) * 90, -300 + Math.sin(ma) * 90);
      pen.lineTo(2 + Math.cos(ma) * 84, -300 + Math.sin(ma) * 84);
    }
    pen.stroke();
  }
  // A head with a brow, a cheek, a jaw and a chin, seen a little from the
  // side. When the mouth opens to sing, the jaw drops with it.
  // The mouth: the song's syllable, if the scene gives one, or else open on
  // every beat for a person who only sings along.
  var mouth = look.mouth || (look.sing && sung < 0.55 ? {open: 1 - sung, wide: 0.3, round: 0} : null);
  if (!mouth && feel.open) { mouth = {open: feel.open[0], wide: feel.open[1], round: feel.open[2]}; }   // a feeling that opens the mouth
  var drop = mouth ? (look.bun ? 5 : 11) * mouth.open : 0;
  var turn = Math.max(-1, Math.min(1, look.turn !== undefined ? look.turn : bodyTurn)), V = view(turn, look.bun);   // where the turn puts every feature: the head turns with the body unless told its own turn
  // Hair moves a little after the head does. On the way up it floats and
  // spreads; on the beat it drops again.
  var late = phase - 0.9;
  var toss = 9 + 9 * up;
  var afloat = 1 - 0.1 * up;
  if (look.bun) {
    // What hangs from a lady's bun hangs straight, as the murals paint hair:
    // a tail of hair (tail), and strands of small gold flowers (pins).
    if (look.tail) {
      if (upright) { pen.translate(-40, -338); pen.rotate(upright); pen.translate(40, 338); }     // the tail's own frame, upright
      lock(-40, -338, 150 * afloat, 11, toss * 1.1, late - 0.4, true, follow(who + "/tail", -40, -338, 50, 6, 40));
      if (upright) { pen.translate(-40, -338); pen.rotate(-upright); pen.translate(40, 338); }    // and back to the head's
    }
    var lagP = look.pins ? follow(who + "/pins", -36, -340, 120, 7, 10) : [0, 0];
    var lagAcross = lagP[0] * downY - lagP[1] * downX;           // the lag, across the way they hang
    for (var strand = 0; look.pins && strand < 3; strand++) {
      var sx = -30 - strand * 6, swingS = Math.sin(late - 0.3 - strand * 0.4) * (6 + strand * 3) + lagAcross * (0.7 + strand * 0.15);
      var longS = 48 + strand * 8, middleS = hung(sx, -340, -4, longS * 0.5), endS = hung(sx, -340, -8 + swingS, longS);
      pen.strokeStyle = "#b8862a";
      pen.lineWidth = 1.6;
      pen.beginPath();
      pen.moveTo(sx, -340);
      pen.quadraticCurveTo(middleS[0], middleS[1], endS[0], endS[1]);
      pen.stroke();
      pen.fillStyle = STYLE.gold;
      for (var bud = 1; bud <= 4; bud++) {
        var u = bud / 4, budAt = hung(sx, -340, -6 * u + swingS * u * u, longS * u);
        pen.beginPath();
        pen.ellipse(budAt[0], budAt[1], 3.4, 2.2, 0.5, 0, 7);
        pen.fill();
      }
    }
  }                                                                // a man has no tuft at the nape: the back of his head is shaved (Hallett, 1890)
  // The ear nearest the camera, where the turn puts it; as the head comes
  // round, the far ear shows at the other side.
  var earX = V.ear, earLess = V.side * (look.bun ? 1 : 0.4);     // in profile an ear is smaller: a lady's small, a fellow's a little
  function earplug(x, fade) {                                    // a lan hu: a rolled leaf or sheet of gold through the stretched lobe
    oval(x, -272, 5.5 - 1.5 * fade, 6 - 1.5 * fade, look.earplug);
    pen.strokeStyle = "rgba(58, 36, 24, 0.55)";                  // the roll's edge, a curl inside it
    pen.lineWidth = 1.2 * FINE;
    pen.beginPath();
    pen.arc(x, -272, 3 - fade, 0.4, 5);
    pen.stroke();
  }
  function nearEar() {
    oval(earX, -283, 11 - 3.5 * earLess, 14 - 4.5 * earLess, SKIN);   // an ear
    pen.strokeStyle = "rgba(58, 36, 24, 0.5)";                   // the curve inside it
    pen.lineWidth = 1.6 * FINE;
    pen.beginPath();
    pen.arc(earX + 1, -284, 6 - 2 * earLess, Math.PI * 0.6, Math.PI * 1.4);
    pen.stroke();
    if (look.earplug) { earplug(earX, earLess); }
  }
  var earInFront = V.t < -0.2;                                   // toward profile the ear stands before hair pulled back
  if (!earInFront) { nearEar(); }
  if (V.farEar > 0) {
    pen.save();
    pen.globalAlpha = V.farEar;
    oval(50, -283, 11, 14, SKIN);
    pen.strokeStyle = "rgba(58, 36, 24, 0.5)";
    pen.lineWidth = 1.6 * FINE;
    pen.beginPath();
    pen.arc(49, -284, 6, -Math.PI * 0.4, Math.PI * 0.4);
    pen.stroke();
    if (look.earplug) { earplug(50, 0); }
    if (look.bun && !look.earplug) {
      var farDrop = hung(50, -272, 0, 15), farBead = hung(50, -272, 0, 18);
      hose(50, -272, farDrop[0], farDrop[1], 0, 2, "#f4c542");
      oval(farBead[0], farBead[1], 4, 5, "#f4c542");
    }
    pen.restore();
  }
  function earring() {                                           // an earring, swinging after the head
    var lagE = follow(who + "/ear", earX, -272, 200, 8, 10);
    var swingE = 2 * Math.sin(late) + lagE[0] * downY - lagE[1] * downX, sinkE = (lagE[0] * downX + lagE[1] * downY) * 0.3;
    var dropE = hung(earX, -272, swingE, 15 + sinkE), beadE = hung(earX, -272, swingE, 18 + sinkE);
    hose(earX, -272, dropE[0], dropE[1], 0, 2, "#f4c542");
    oval(beadE[0], beadE[1], 4, 5, "#f4c542");
  }
  if ((look.bun || look.regalia) && !look.earplug && !earInFront) { earring(); }   // it hangs with its ear: behind the head here, before it toward profile
  // The head: one path with a brow, a cheek, a jaw and a chin, blended for
  // the turn between its profile, three-quarter and full-face shapes. When
  // the mouth opens to sing, the jaw drops with it.
  var H = V.head;
  if (long) {                                                    // a lady's jaw tapers to a small chin (less so toward profile, where that curve is her nose)
    var taper = 1 - V.toProfile;
    H[8][0] -= 4 * taper;                                        // the cheek comes in,
    H[9][0] -= 3 * taper;                                        // the jaw a little,
    H[12][0] += 3 * taper;                                       // and the back of the jaw: the chin itself stays round
    H[13][0] += 4 * taper;
    H[13][1] -= 3 * taper;
  }
  var skull = new Path2D();
  skull.moveTo(H[0][0], H[0][1]);
  skull.bezierCurveTo(H[1][0], H[1][1], H[2][0], H[2][1], H[3][0], H[3][1]);                    // the top of the head
  skull.bezierCurveTo(H[4][0], H[4][1], H[5][0], H[5][1], H[6][0], H[6][1]);                    // the brow
  skull.bezierCurveTo(H[7][0], H[7][1], H[8][0], H[8][1] + drop * 0.5, H[9][0], H[9][1] + drop);   // the cheek, to the jaw
  skull.quadraticCurveTo(H[10][0], H[10][1] + drop, H[11][0], H[11][1] + drop);                 // a rounded chin
  skull.bezierCurveTo(H[12][0], H[12][1] + drop * 0.6, H[13][0], H[13][1], H[0][0], H[0][1]);   // the back of the jaw
  skull.closePath();
  // Toward profile, the brow, the nose, the lips and the chin come out of
  // the front of the skull as a piece of their own. Its tip is where the
  // face draws the tip of the nose (V.tip), so while that is still inside
  // the face the piece is hidden, and the nose is the first of it to show.
  var piece = V.side > 0 ? profilePiece(V.tip, V.side, drop, look.bun) : null;
  var skinInk = inkFor(SKIN);
  pen.fillStyle = SKIN;
  pen.fill(skull);
  if (piece) { pen.fill(piece); }
  pen.strokeStyle = skinInk;
  pen.lineWidth = LINE;
  pen.lineJoin = "round";
  heavy(skinInk);
  if (piece) {                                                   // one line round the two
    strokeOutside(skull, piece);
    strokeOutside(piece, skull);
    V.face = new Path2D(skull);                                  // the whole face, for what must stay inside it (the mouth, the far eye)
    V.face.addPath(piece);
  } else {
    pen.stroke(skull);
  }
  light();
  pen.save();                                                    // the back of the head is in shadow;
  pen.clip(skull);                                               // the chin has none (owner, 2026-10-12)
  var shade = pen.createLinearGradient(-58, 0, -6, 0);
  shade.addColorStop(0, "rgba(150, 70, 60, " + (long ? 0.12 : 0.3) + ")");   // a lady's skin is left nearly flat, as the paintings leave it
  shade.addColorStop(1, "rgba(150, 70, 60, 0)");
  pen.fillStyle = shade;
  pen.fillRect(-60, -350, 120, 130);
  pen.restore();
  var sway = Math.sin(late) * toss * 0.4;                        // the top of the hair leans
  if (look.bun) {
    // Lanna hair: pulled back smooth from the brow into one high bun at the
    // back of the head, with a comb across it and stones on the comb. Nothing
    // curls. A flower sits at the bun's side (flower), and a loop of jasmine
    // hangs from it (garland). The bun leans after the head and sinks a
    // little on the beat. The mass, the hairline and the bun take their
    // places from the turn.
    var knotY = still ? 0 : 5 * (1 - up), HL = V.hairLady, bunX = V.bun[0] + sway, bunY = V.bun[1] + knotY;
    pen.beginPath();                                             // the mass, swept back
    pen.moveTo(HL[0][0], HL[0][1]);
    pen.bezierCurveTo(HL[1][0], HL[1][1], HL[2][0], HL[2][1], HL[3][0] + sway * 0.4, HL[3][1]);
    pen.bezierCurveTo(HL[4][0] + sway * 0.4, HL[4][1], HL[5][0], HL[5][1], HL[6][0], HL[6][1]);   // over the top, to the brow
    pen.quadraticCurveTo(HL[7][0], HL[7][1], HL[8][0], HL[8][1]);                    // a smooth hairline
    pen.quadraticCurveTo(HL[9][0], HL[9][1], HL[10][0], HL[10][1]);
    pen.quadraticCurveTo(HL[11][0], HL[11][1], HL[0][0], HL[0][1]);
    pen.closePath();
    pen.fillStyle = HAIR;
    pen.fill();
    pen.strokeStyle = HAIR_LINE;
    pen.lineWidth = 3 * FINE;
    pen.lineJoin = "round";
    pen.stroke();
    pen.save();                                                  // a sheen where the light falls on the hair
    pen.clip();
    var sheen = pen.createRadialGradient(14 + V.hairShift, -350, 4, 14 + V.hairShift, -350, 48);
    sheen.addColorStop(0, "rgba(255, 235, 210, 0.3)");
    sheen.addColorStop(1, "rgba(255, 235, 210, 0)");
    pen.fillStyle = sheen;
    pen.fillRect(-90, -400, 180, 140);
    pen.restore();
    pen.save();
    pen.translate(V.hairShift, 0);                               // the comb lines go with the hairline
    combed([[-44, -300, -30, -340, -4, -356], [-32, -306, -14, -338, 10, -357], [-20, -312, 0, -344, 20, -358],
            [-6, -315, 14, -345, 32, -355], [8, -318, 28, -346, 44, -350]]);   // fine lines, swept back to the bun
    pen.strokeStyle = HAIR;                                // a fine strand at the temple, before the ear
    pen.globalAlpha = 1 - V.side;                                // (not in her profile: there the ear stands where it would hang)
    pen.lineWidth = 1.6 * FINE;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(-38, -288);
    pen.quadraticCurveTo(-44, -280, -41, -268);
    pen.stroke();
    pen.restore();
    joints.bun = spot(bunX, bunY);
    if (look.fan) {                                              // a fan of gold leaves behind the bun, as the paintings' dancers wear
      var fanLeans = [-1.8, -1.4, -1.0, -0.6, -0.2, 0.2, 0.6];
      for (var spoke = 0; spoke < fanLeans.length; spoke++) {
        pen.save();
        pen.translate(bunX - 4, bunY + 3);
        pen.rotate(fanLeans[spoke] + sway * 0.012);
        pen.translate(0, -15);
        paintLeaf(pen, 42 - 5 * Math.abs(spoke - 3), 6.5, 0, "#b8862a", "#f8e08a", "rgba(110, 70, 20, 0.9)", "rgba(255, 250, 220, 0.7)");
        pen.restore();
      }
    }
    oval(bunX, bunY, 25, 21, HAIR);                        // the bun, at the back of the head
    pen.strokeStyle = HAIR_LINE;                                 // the wrap of the bun
    pen.lineWidth = 2 * FINE;
    pen.beginPath();
    pen.ellipse(bunX, bunY, 16, 12, 0.4, 0, 7);
    pen.stroke();
    pen.strokeStyle = STYLE.gold;                                // a gold comb across the bun
    pen.lineWidth = 3.5;
    pen.lineCap = "round";
    pen.beginPath();
    pen.arc(bunX, bunY + 2, 27, Math.PI * 1.05, Math.PI * 1.75);
    pen.stroke();
    oval(bunX - 2, bunY - 25, 4, 4, "#d9533a");                  // its stones
    oval(bunX - 19, bunY - 17, 3, 3, "#3f8f7a");
    oval(bunX + 15, bunY - 20, 3, 3, "#3f8f7a");
    if (look.flower) {
      for (var petal = 0; petal < 5; petal++) {                  // a flower at the bun's side
        var pa = petal / 5 * Math.PI * 2 + sway * 0.05;
        oval(bunX + 26 + Math.cos(pa) * 7, bunY - 6 + Math.sin(pa) * 7, 6, 4.5, look.flower, pa);
      }
      oval(bunX + 26, bunY - 6, 4, 4, "#f4c542");
    }
    if (look.garland) {
      pen.fillStyle = "#fffaf0";                                 // a loop of jasmine from the bun
      pen.beginPath();
      var lagG = follow(who + "/garland", bunX - 4, bunY + 14, 150, 9, 8);   // the loop swings after the head
      for (var bud = 0; bud <= 14; bud++) {
        var gu = bud / 14, sag = Math.sin(gu * Math.PI) * (22 + 4 * Math.sin(late) + lagG[1] * 0.5);   // the loop sags straight down
        var gx = bunX - 22 + gu * 36 + sway * (1 - gu) * 0.8 + lagG[0] * Math.sin(gu * Math.PI) + downX * sag;
        var gy = bunY + 14 + downY * sag;
        pen.moveTo(gx + 2.2, gy);
        pen.arc(gx, gy, 2.2, 0, 7);
      }
      pen.fill();
    }
  } else if (!look.hat && !look.shaved) {
    // A man's hair gathered up into a knot on the top of the head (the
    // owner's reference picture, 2026-10-14; the men of the murals wear it
    // so, with a head-cloth wound round below the knot): the hair combed up
    // from the brow and the nape, and tied in a round knot at the crown with
    // the tie's loop showing through it. The mass and the hairline take their
    // places from the turn; the knot leans a little with the sway. (Until
    // this day the kit drew Hallett's Chiang Mai man, the sides and back
    // shaved and a brush at the crown; the record is in the style doc.)
    var HM = V.hairMan, crownX = (HM[2][0] + HM[5][0]) / 2 + sway * 0.3, knotX = crownX + sway * 0.8, knotY = -386;
    pen.beginPath();
    pen.moveTo(HM[0][0], HM[0][1]);
    pen.bezierCurveTo(HM[1][0], HM[1][1], HM[2][0], HM[2][1], HM[3][0] + sway * 0.3, HM[3][1]);
    pen.bezierCurveTo(HM[4][0] + sway * 0.3, HM[4][1], HM[5][0], HM[5][1], HM[6][0], HM[6][1]);   // over the top, to the brow
    pen.quadraticCurveTo(HM[7][0], HM[7][1], HM[8][0], HM[8][1]);                    // the hairline
    pen.quadraticCurveTo(HM[9][0], HM[9][1], HM[10][0], HM[10][1]);
    pen.quadraticCurveTo(HM[11][0], HM[11][1], HM[0][0], HM[0][1]);
    pen.closePath();
    pen.fillStyle = HAIR;
    pen.fill();
    pen.strokeStyle = HAIR_LINE;
    pen.lineWidth = 3 * FINE;
    pen.lineJoin = "round";
    pen.stroke();
    pen.save();
    pen.translate(crownX, 0);
    combed([[-46, -316, -34, -350, -10, -368], [-12, -304, -2, -344, 4, -370], [38, -320, 26, -352, 12, -368]]);   // combed up to the crown
    pen.restore();
    pen.beginPath();                                             // the knot: a round mass sitting on the crown
    pen.ellipse(knotX, knotY, 24, 17, 0, 0, 7);
    pen.fillStyle = HAIR;
    pen.fill();
    pen.strokeStyle = HAIR_LINE;
    pen.stroke();
    pen.lineWidth = 2 * FINE;
    pen.beginPath();                                             // the loop of the tie, through it
    pen.ellipse(knotX - 4, knotY - 2, 11, 7, -0.5, 0, 7);
    pen.stroke();
    pen.beginPath();                                             // the neck of the knot, where the hair gathers
    pen.moveTo(knotX - 16, knotY + 14);
    pen.quadraticCurveTo(knotX, knotY + 6, knotX + 16, knotY + 14);
    pen.stroke();
    if (look.pins) {                                             // gold flowers set in the knot (a noble's)
      [[-14, -6], [2, -14], [16, -4]].forEach(function (at, n) {
        for (var petal = 0; petal < 5; petal++) {
          var pa = petal * Math.PI * 0.4 + n;
          oval(knotX + at[0] + Math.cos(pa) * 3.2, knotY + at[1] + Math.sin(pa) * 3.2, 1.8, 1.4, STYLE.gold);
        }
        oval(knotX + at[0], knotY + at[1], 1.4, 1.4, "#d9533a");
      });
    }
  } else if (!look.shaved) {
    pen.fillStyle = look.hair || "#2a1a12";                      // hair, under the hat
    pen.beginPath();
    pen.ellipse(0, -312, 53, 28, 0, Math.PI * 1.03, Math.PI * 1.97);
    pen.fill();
  }
  if (earInFront) {
    nearEar();
    if ((look.bun || look.regalia) && !look.earplug) { earring(); }
  }
  if (look.hat) {
    pen.save();                                                  // a hat is loose: it lags the head,
    pen.translate(0, -4 * clamp(speed / 10));                    // and floats up as the body springs
    pen.rotate(Math.sin(late) * 0.05);
    pen.beginPath();
    pen.moveTo(-104, -316);
    pen.quadraticCurveTo(0, -412, 104, -316);
    pen.quadraticCurveTo(0, -296, -104, -316);
    shape("#e9c76b");
    pen.strokeStyle = "rgba(120, 80, 20, 0.5)";                  // the weave
    pen.lineWidth = 2 * FINE;
    for (var line = -2; line <= 2; line++) {
      pen.beginPath();
      pen.moveTo(line * 32, -314);
      pen.lineTo(line * 6, -360);
      pen.stroke();
    }
    pen.restore();
  }
  if (look.turban) {
    // A Lanna head-cloth: a band folded and tied round the head, low on the
    // brow, with the hair showing above it. The knot is at the back, and
    // its two ends stand out and swing a little after the head.
    pen.beginPath();
    pen.moveTo(-56, -302);
    pen.bezierCurveTo(-54, -322, -20, -332, 10, -332);           // the top edge of the band
    pen.bezierCurveTo(40, -332, 58, -324, 60, -306);
    pen.lineTo(58, -292);                                        // the lower edge, across the brow
    pen.bezierCurveTo(44, -306, 14, -312, -14, -310);
    pen.bezierCurveTo(-38, -308, -52, -298, -56, -286);
    pen.closePath();
    shape(look.turban);
    pen.save();
    pen.clip();
    pen.strokeStyle = "rgba(40, 20, 20, 0.35)";                   // the fold of the cloth
    pen.lineWidth = 2 * FINE;
    pen.beginPath();
    pen.moveTo(-58, -300);
    pen.bezierCurveTo(-20, -320, 30, -320, 62, -304);
    pen.stroke();
    pen.restore();
    var lagT = follow(who + "/turban", -58, -296, 70, 7, 30);        // the ends swing after the head, late
    for (var end = 0; end < 2; end++) {                           // the two ends, from the knot at the back
      var ex = -58 - end * 4 - sway * (0.6 + end * 0.3) + lagT[0] * 0.5, ey = -296 + end * 10 + lagT[1] * 0.3;
      pen.beginPath();
      pen.moveTo(-54, -300 + end * 6);
      pen.quadraticCurveTo(ex - 14, ey - 10 - end * 6, ex - 22, ey + 4 + end * 8);
      pen.quadraticCurveTo(ex - 10, ey + 4, -52, -290 + end * 6);
      pen.closePath();
      shape(look.turban);
    }
    oval(-56, -296, 6, 5, look.turban);                            // the knot
    if (look.regalia) {                                            // a noble's head-cloth is patterned silk: rows of small gold marks
      pen.save();
      pen.beginPath();
      pen.moveTo(-56, -302);
      pen.bezierCurveTo(-54, -322, -20, -332, 10, -332);
      pen.bezierCurveTo(40, -332, 58, -324, 60, -306);
      pen.lineTo(58, -292);
      pen.bezierCurveTo(44, -306, 14, -312, -14, -310);
      pen.bezierCurveTo(-38, -308, -52, -298, -56, -286);
      pen.closePath();
      pen.clip();
      pen.fillStyle = "rgba(240, 200, 90, 0.8)";
      for (var mark = 0; mark < 14; mark++) {
        pen.beginPath();
        pen.ellipse(-50 + mark * 8, -322 + (mark % 2) * 9 + Math.sin(mark) * 3, 1.6, 1.2, 0, 0, 7);
        pen.fill();
      }
      pen.restore();
    }
  }
  // each person blinks at a time of their own, about every three seconds,
  // and their eyes wander a little
  // A blink drops the lid in a twelfth of a second and lifts it in a sixth,
  // about every three seconds, each person at a time of their own. A track's
  // score for the blink (0 to 1) sets the lid directly.
  var blinkAt = (clock + x * 0.013) % 3.3;
  var shut = look.blink !== undefined ? clamp((look.blink - 0.15) / 0.55)
           : blinkAt < 0.08 ? blinkAt / 0.08 : blinkAt < 0.24 ? 1 - (blinkAt - 0.08) / 0.16 : 0;
  var glance = saccade(clock + x * 0.013);
  if (look.glance) { glance = [look.glance[0], look.glance[1]]; }   // read from a face, by a track
  else if (look.at) {                                    // the eyes turn toward a thing in the scene
    var headY = y - (330 + (look.skirt ? 190 : 216) * (leggy - 1)) * size;
    glance = [Math.max(-4, Math.min(4, (look.at[0] - x) / 120 * (look.face || 1))),
              Math.max(-3, Math.min(3, (look.at[1] - headY) / 120))];
  }
  if (look.bun) {
    ladyFace(shut, mouth, glance, V, feel);
  } else {
    manFace(shut, mouth, glance, V, feel);
  }
  if (look.age) { ageLines(clamp(look.age), V); }
  if (look.beard) { beard(look.beard, V, drop); }
  }                                                 // end of the kit's own head
  pen.restore();                                  // back at the waist, for the arms
  LINE = STYLE.line * FINE;                         // and the body's pen again
  // The arms are drawn last, over the body and the head (owner, 2026-10-11),
  // so an arm that crosses the chest, or a hand raised before the face, as a
  // dancer's is, is never hidden by them; a hanging far arm went behind the
  // chest already (behindA, owner 2026-10-15).
  if (look.worn) {                                  // what is worn under the arms (a cloth of sabai.js)
    pen.save();
    look.worn();
    pen.restore();
  }
  if (rig) {                                        // the drawn arms: the picture's left arm is the near one
    wristB = rigArm(rig, ["armR_upper", "armR_lower", "handR"], rootB[0], rootB[1], handB, -1, -flex + (look.wristB || 0));
    wristA = rigArm(rig, ["armL_upper", "armL_lower", "handL"], rootA[0], rootA[1], handA, 1, flex + (look.wristA || 0));
  } else {
  wristB = armOf(rootB, handB, -1, who + "/armB");  // the far arm
  if (!behindA) { wristA = armOf(rootA, handA, 1, who + "/armA"); }   // the near arm (unless it hangs behind the body, drawn already)
  // In a wai the sabai comes over the upper arm on its shoulder's side (A)
  // and the forearm lies over the sabai (owner, 2026-10-16: "when women wai
  // their biceps are under the sabai and forearms show over it"). On a layer
  // of its own: the cloth, worn or the kit's own, inside that upper arm's
  // shape, its ink line too; then the forearm, ink and colour, only where
  // that cloth is; then the layer onto the sheet. Where no cloth lies over
  // the upper arm, the arm stays as arm() drew it, no line across the elbow.
  if (look.wai && (look.worn || sabaiFront) && pen.canvas) {
    var waiSheet = pen;
    if (!WAI_LAYER || WAI_LAYER.canvas.width !== pen.canvas.width || WAI_LAYER.canvas.height !== pen.canvas.height) {
      var waiCanvas = document.createElement("canvas");
      waiCanvas.width = pen.canvas.width;
      waiCanvas.height = pen.canvas.height;
      WAI_LAYER = waiCanvas.getContext("2d", {willReadFrequently: true});   // on the CPU: a layer on the GPU drawn onto a sheet that is read back (a check, a still) changes how the sheet draws every frame after it
    }
    WAI_LAYER.setTransform(1, 0, 0, 1, 0, 0);
    WAI_LAYER.clearRect(0, 0, WAI_LAYER.canvas.width, WAI_LAYER.canvas.height);
    ["lineJoin", "lineCap", "miterLimit", "imageSmoothingEnabled", "imageSmoothingQuality"].forEach(function (name) { WAI_LAYER[name] = pen[name]; });
    WAI_LAYER.setTransform(pen.getTransform());
    pen = WAI_LAYER;
    pen.save();
    bone(rootA[0], rootA[1], wristA[2], wristA[3], 12 * arms + LINE, 10 * arms + LINE, 3 * arms);   // arm(): half-widths 12 and 10, swell 3
    pen.clip();
    if (look.worn) { look.worn(); } else { sabaiFront(); }
    pen.restore();
    pen.save();
    pen.globalCompositeOperation = "source-atop";   // the forearm, only over the cloth just drawn
    pen.translate(rootA[0], rootA[1]);              // in the arm's own size, as armOf() draws it
    pen.scale(arms, arms);
    var waiLine = LINE, waiInk = inkFor(sleeve);
    LINE = LINE / arms;
    var elbowX = (wristA[2] - rootA[0]) / arms, elbowY = (wristA[3] - rootA[1]) / arms;
    var handX = (wristA[0] - rootA[0]) / arms, handY = (wristA[1] - rootA[1]) / arms;
    heavy(waiInk);
    bone(elbowX, elbowY, handX, handY, 10 + LINE, 8.5 + LINE, 3);   // limb(): the forearm's ink, then its colour
    pen.fillStyle = waiInk;
    pen.fill();
    light();
    paintBone(elbowX, elbowY, handX, handY, 10, 8.5, sleeve);
    LINE = waiLine;
    pen.restore();
    pen = waiSheet;
    pen.save();
    pen.setTransform(1, 0, 0, 1, 0, 0);
    pen.drawImage(WAI_LAYER.canvas, 0, 0);
    pen.restore();
  }
  joints.shoulderA = spot(rootA[0], rootA[1]);
  joints.shoulderB = spot(rootB[0], rootB[1]);
  joints.elbowA = spot(wristA[2], wristA[3]);
  joints.elbowB = spot(wristB[2], wristB[3]);
  joints.wristA = spot(wristA[0], wristA[1]);
  joints.wristB = spot(wristB[0], wristB[1]);
  if (look.bare) {                                  // the band of cord round each upper arm; the far arm's went on with that arm if it hangs behind the body
    armBand(rootB, wristB);
    if (!behindA) { armBand(rootA, wristA); }
  }
  poseB = handPose("B", wristB, handB);
  if (!poseA) { poseA = handPose("A", wristA, handA); }
  var angleA = poseA.angle, angleB = poseB.angle;
  joints.handA = spot(wristA[0] + Math.cos(angleA) * 24, wristA[1] + Math.sin(angleA) * 24);   // a point along each hand, for its direction
  joints.handB = spot(wristB[0] + Math.cos(angleB) * 24, wristB[1] + Math.sin(angleB) * 24);
  drawHand("B", wristB, poseB);
  if (look.holding === "stick") {                   // a walking stick: from above the palm down to the ground, behind the fingers
    var palmX = wristA[0] + Math.cos(angleA) * 13, palmY = wristA[1] + Math.sin(angleA) * 13;
    hose(palmX - 3, palmY - 20, palmX + 8, ground / trunk - 2, 0.02, 6, "#7a5234");
  }
  if (!behindA) { drawHand("A", wristA, poseA); }
  }                                                 // end of the kit's own arms
  if (look.holding === "lotus") {                   // a lotus held up in the near hand
    pen.strokeStyle = "#3f6e45";
    pen.lineWidth = 3;
    pen.beginPath();
    pen.moveTo(wristA[0] + 6, wristA[1]);
    pen.quadraticCurveTo(wristA[0] + 14, wristA[1] - 20, wristA[0] + 10, wristA[1] - 40);
    pen.stroke();
    lotus(pen, wristA[0] + 10, wristA[1] - 40, 1, "#f28fa8");
  }
  if (look.parasol) {                               // a parasol: the handle through the fist, the canopy above, drawn over everything
    var umbrella = parasolOf(look.parasol), swung = parasolSwing(umbrella.tilt, umbrella.hang), tipped = Math.cos((umbrella.tilt || 0) * Math.PI / 2);
    var gripX = wristA[0] + Math.cos(angleA) * GRIP_AT, gripY = wristA[1] + Math.sin(angleA) * GRIP_AT;   // where the handle crosses the fist
    var canopyY = gripY - (PARASOL.handle + PARASOL.dome) * tipped + PARASOL.radius * parasolShape(umbrella.open).dome * tipped;   // the crown stays at the top of the handle; furled, the rim rises to it
    var drawUmbrella = function () {
    pen.save();                                     // carried, the whole parasol is turned about the fist to hang down behind her
    pen.translate(gripX, gripY);
    pen.rotate(swung);
    pen.translate(-gripX, -gripY);
    pen.strokeStyle = "#7a5234";
    pen.lineWidth = 5;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(gripX, gripY + 26);                  // the handle's end below the fist, and the handle above it: at the fist the fingers hide it
    pen.lineTo(gripX, gripY + 14);
    pen.moveTo(gripX, gripY - 14);
    pen.lineTo(gripX, canopyY);
    pen.stroke();
    parasol(pen, gripX, canopyY, PARASOL.radius, umbrella.tilt || 0, umbrella.spin || 0, umbrella.colour, umbrella.kind, umbrella.open);
    joints.parasol = spot(gripX, canopyY);          // the middle of the rim, and a point on the rim, in the film's pixels: a film throws rain off it
    joints.parasolRim = spot(gripX + PARASOL.radius * parasolShape(umbrella.open).radius, canopyY);
    pen.restore();
    };
    if (layered) {                                  // hanging: onto the sheet, behind the layer she is on
      umbrellaAt = pen.getTransform();
      pen = sheetPen;
      pen.save();
      pen.setTransform(umbrellaAt);
      drawUmbrella();
      pen.restore();
      pen = PERSON_LAYER;
    } else {
      drawUmbrella();
    }
  }
  pen.restore();
  if (layered) {                                    // her layer over the parasol, and the copy in front, fading as it swings down
    pen = sheetPen;
    PERSON_LAYERED = false;
    pen.save();
    pen.setTransform(1, 0, 0, 1, 0, 0);
    pen.drawImage(PERSON_LAYER.canvas, 0, 0);
    pen.restore();
    if (umbrellaAt && inFront > 0.001) {
      pen.save();
      pen.setTransform(umbrellaAt);
      pen.globalAlpha *= inFront;
      drawUmbrella();
      pen.restore();
    }
  }
  FINE = 1;                                         // the usual pen and skin again, for whatever is drawn next
  LINE = STYLE.line;
  SKIN = STYLE.skin;
  HAIR = STYLE.hair;
  HAIR_LINE = "#7a5640";
  PAINTED = true;
  return joints;
}

// A scroll cloud, as a thangka paints one: a flat underside, a row of round
// lobes along the top with a smaller row above them, every lobe outlined,
// and a curl at each end where the cloud rolls under itself. "brush" is
// the canvas to paint on; "fill" and "line" its colours. "foot" is the colour
// that gathers toward its underside: a pale blue unless told, and a thangka
// gives an ochre cloud a green one.
function scrollCloud(brush, x, y, size, fill, line, foot) {
  var lobes = [[-128, -4, 26], [-84, -24, 34], [-34, -38, 40], [22, -32, 38], [74, -20, 32], [118, -4, 26]];
  var crown = [[-40, -60, 22], [4, -68, 26], [46, -56, 20]], n;
  function body() {
    brush.beginPath();
    brush.moveTo(-150, 20);
    for (var k = 0; k < lobes.length; k++) { brush.arc(lobes[k][0], lobes[k][1], lobes[k][2], Math.PI, 0); }
    brush.lineTo(150, 20);
    brush.quadraticCurveTo(0, 30, -150, 20);
    brush.closePath();
  }
  function top() {                                  // the smaller row above
    brush.beginPath();
    brush.moveTo(-62, -40);
    for (var k = 0; k < crown.length; k++) { brush.arc(crown[k][0], crown[k][1], crown[k][2], Math.PI, 0); }
    brush.lineTo(66, -36);
    brush.closePath();
  }
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  brush.lineWidth = 2;
  brush.lineJoin = "round";
  brush.lineCap = "round";
  brush.strokeStyle = line;
  var tint = brush.createLinearGradient(0, -90, 0, 28);     // white along the lobes, a tint gathering toward the foot
  var paint = foot ? parseInt(foot.slice(1), 16) : 0;
  var under = foot ? "rgba(" + ((paint >> 16) & 255) + ", " + ((paint >> 8) & 255) + ", " + (paint & 255) + ", " : "rgba(110, 150, 205, ";
  tint.addColorStop(0, under + "0)");
  tint.addColorStop(0.45, under + (foot ? "0.2)" : "0.05)"));
  tint.addColorStop(1, under + (foot ? "0.9)" : "0.42)"));
  for (var pass = 0; pass < 2; pass++) {            // the row above first, so the body's line lies over it
    if (pass === 0) { top(); } else { body(); }
    brush.fillStyle = fill;
    brush.fill();
    brush.fillStyle = tint;
    brush.fill();
    brush.stroke();
  }
  brush.globalAlpha = 0.6;                          // a small spiral in each of the middle lobes, and a curl at each end
  brush.lineWidth = 1.5;
  brush.beginPath();
  for (n = 1; n < lobes.length - 1; n++) {
    var lx = lobes[n][0], ly = lobes[n][1] + lobes[n][2] * 0.12, r = lobes[n][2] * 0.32, left = n < 3;
    brush.moveTo(lx + (left ? r : -r), ly);         // three quarters of a turn, then half a turn inside it
    brush.arc(lx, ly, r, left ? 0 : Math.PI, left ? Math.PI * 1.5 : -Math.PI * 0.5, !left);
    brush.arc(lx, ly - r * 0.5, r * 0.5, -Math.PI * 0.5, Math.PI * 0.5, !left);
  }
  brush.moveTo(-138 + 9 * Math.cos(Math.PI * 0.5), 8 + 9);
  brush.arc(-138, 8, 9, Math.PI * 0.5, Math.PI * 1.9);
  brush.moveTo(147, 8);
  brush.arc(138, 8, 9, Math.PI * 2.5, Math.PI * 1.1, true);
  brush.stroke();
  brush.restore();
}

// A cloud drawn live, so it can drift. STYLE.clouds is "scroll" (a thangka's
// cloud) or "soft" (three blurred blobs). "dark" is an evening colour.
function cloud(x, y, size, dark) {
  if (STYLE.clouds === "soft") {
    pen.save();
    pen.filter = "blur(7px)";
    pen.fillStyle = dark || "rgba(255, 255, 255, 0.7)";
    pen.beginPath();
    pen.ellipse(x, y, 150 * size, 44 * size, 0, 0, 7);
    pen.ellipse(x + 90 * size, y - 30 * size, 100 * size, 50 * size, 0, 0, 7);
    pen.ellipse(x - 80 * size, y - 14 * size, 80 * size, 36 * size, 0, 0, 7);
    pen.fill();
    pen.restore();
    return;
  }
  scrollCloud(pen, x, y, size, dark || "#f6f1e6", dark ? "rgba(90, 70, 110, 0.55)" : "rgba(120, 130, 150, 0.65)");
}

// ---------- nature, as the paintings draw it ----------
// How a Thai mural of a lotus pond and a thangka draw what grows (the
// owner's references, 2026-10-12). Every painter below keeps these rules:
//   1. A plant is drawn, not smudged: a fine line round each petal, leaf
//      and stem, darker than what it holds. No blur.
//   2. Colour changes inside a shape, from its foot to its tip or from its
//      heart to its rim, and nowhere else: no cast shadows, no shine.
//   3. A petal and a leaf are one pointed shape, widest below its middle.
//   4. A flower is built from the back: the outer petals low and wide, the
//      next ring rising, the heart closed.
//   5. A stem is one long curve from the root, and no two bend alike.
//   6. Nothing is evenly spaced, the same height, or upright: dice() decides.
//   7. Water is rows of overlapping arcs. A hill is a hump, deepest along
//      its ridge, with a firm line and tufts. A cloud is a scroll.

// a colour between two: "#rrggbb" a and b, "amount" of the way from a to b. Each
// channel is mixed as light (its square), not as the number written, so the
// middle of a blend between two unlike colours keeps its brightness instead of
// going grey or dark the way plain averaging does.
function blend(a, b, amount) {
  var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), out = 0, ca, cb;
  for (var shift = 16; shift >= 0; shift -= 8) {
    ca = (pa >> shift) & 255;
    cb = (pb >> shift) & 255;
    out = out * 256 + Math.round(Math.sqrt(Math.max(0, mix(ca * ca, cb * cb, amount))));
  }
  return "#" + ("000000" + out.toString(16)).slice(-6);
}

// The shape a petal and a leaf share: pointed, widest below its middle, from
// its foot at (0, 0) to its tip "long" above. "bow" bends the tip to one side.
function leafPath(brush, long, wide, bow) {
  var tip = (bow || 0) * long;
  brush.beginPath();
  brush.moveTo(0, 0);
  brush.bezierCurveTo(-wide, -long * 0.3, -wide * 0.5 + tip * 0.7, -long * 0.8, tip, -long);
  brush.bezierCurveTo(wide * 0.5 + tip * 0.7, -long * 0.8, wide, -long * 0.3, 0, 0);
  brush.closePath();
}

// One petal: pale at its foot and its colour at the tip, fine veins that fan
// toward the tip, and a thin line round it.
function paintPetal(brush, long, wide, bow, pale, deep, line) {
  var tip = (bow || 0) * long;
  leafPath(brush, long, wide, bow);
  var fade = brush.createLinearGradient(0, 0, tip, -long);
  fade.addColorStop(0, pale);
  fade.addColorStop(0.4, pale);
  fade.addColorStop(1, deep);
  brush.fillStyle = fade;
  brush.fill();
  brush.save();
  brush.clip();                                     // the veins stay inside the petal
  brush.strokeStyle = deep;
  brush.globalAlpha = 0.6;
  brush.lineWidth = 0.7;
  brush.beginPath();
  for (var v = -2; v <= 2; v++) {
    brush.moveTo(v * wide * 0.14, -long * 0.38);
    brush.quadraticCurveTo(v * wide * 0.36 + tip * 0.5, -long * 0.7, tip + v * wide * 0.07, -long * 0.98);
  }
  brush.stroke();
  brush.restore();
  leafPath(brush, long, wide, bow);
  brush.strokeStyle = line;
  brush.lineWidth = 1.2;
  brush.lineJoin = "round";
  brush.stroke();
}

// One leaf: deep at its foot and lighter at the tip, a rib up its middle,
// and a line round it.
function paintLeaf(brush, long, wide, bow, deep, pale, line, rib) {
  var tip = (bow || 0) * long;
  leafPath(brush, long, wide, bow);
  var fade = brush.createLinearGradient(0, 0, tip, -long);
  fade.addColorStop(0, deep);
  fade.addColorStop(1, pale);
  brush.fillStyle = fade;
  brush.fill();
  brush.strokeStyle = line;
  brush.lineWidth = 1.4;
  brush.lineJoin = "round";
  brush.stroke();
  brush.strokeStyle = rib || "rgba(240, 225, 150, 0.75)";
  brush.lineWidth = 1;
  brush.beginPath();
  brush.moveTo(0, -long * 0.06);
  brush.quadraticCurveTo(tip * 0.35, -long * 0.6, tip * 0.9, -long * 0.92);
  brush.stroke();
}

// A lotus, seen from the side, as the mural draws it: the lowest petals
// droop, the outer ring lies wide, the next ring rises and the heart stays
// shut. Each petal is pale at its foot and "colour" at its tip. "open" runs
// from 0, a bud, to 1, the flower full out. Thai and Tibetan painting put
// one wherever there is room, and in the hand of anyone holy.
function lotus(brush, x, y, size, colour, open) {
  colour = colour || "#f28fa8";
  open = open === undefined ? 1 : open;
  var pale = "#fff6ea", line = "rgba(120, 40, 60, 0.8)";
  function ring(leans, long, wide, least) {         // "least": how far open this ring is even in a bud
    for (var n = 0; n < leans.length; n++) {
      var out = Math.max(open, least || 0);
      brush.save();
      brush.rotate(leans[n] * out);
      paintPetal(brush, long, wide, leans[n] * 0.1 * out, pale, colour, line);
      brush.restore();
    }
  }
  brush.save();
  brush.translate(x, y);
  brush.scale(size, size);
  brush.fillStyle = "#7fa35c";                      // the cup the petals stand in
  brush.beginPath();
  brush.ellipse(0, 1, 6, 3.5, 0, 0, 7);
  brush.fill();
  if (open > 0.15) {
    ring([-1.75, 1.75], 29, 9);                     // the two lowest, drooping
    ring([-1.22, 1.22, -0.66, 0.66], 34, 11);       // the outer ring
    ring([-0.9, 0.9, -0.34, 0.34], 36, 12);         // the next, rising
  }
  ring([-0.4, 0.4], 35, 12, 0.5);                   // the heart: three that stay nearly shut, and show in a bud
  ring([0], 37, 13);
  brush.restore();
}

// A lotus leaf on its stem, seen from the side and a little from above: a
// shallow cup. We see its underside, deep green, with veins running down to
// the stem, and over the near rim a slice of the top, lighter, with a wavy
// edge. The stem joins it at (x, y); "tilt" leans it.
function lotusLeaf(brush, x, y, size, tilt, colour) {
  colour = colour || "#5f9a4e";
  var line = "rgba(35, 65, 40, 0.85)", half = 52, rim = -30, n, p;
  function wavy(u, lift) {                          // a point on a rim: u from -1 at one end to 1 at the other
    return [u * half, rim + lift * (1 - u * u) + 2.4 * Math.sin(u * 8 + lift)];
  }
  brush.save();
  brush.translate(x, y);
  brush.rotate(tilt || 0);
  brush.scale(size, size);
  brush.lineJoin = "round";
  brush.beginPath();                                // the top of the leaf: from the far rim to the near one
  for (n = -10; n <= 10; n++) {
    p = wavy(n / 10, -15);
    if (n === -10) { brush.moveTo(p[0], p[1]); } else { brush.lineTo(p[0], p[1]); }
  }
  for (n = 10; n >= -10; n--) {
    p = wavy(n / 10, 9);
    brush.lineTo(p[0], p[1]);
  }
  brush.closePath();
  var top = brush.createLinearGradient(0, rim - 15, 0, rim + 9);
  top.addColorStop(0, blend(colour, "#f6f2a4", 0.8));
  top.addColorStop(1, blend(colour, "#f6f2a4", 0.3));
  brush.fillStyle = top;
  brush.fill();
  brush.strokeStyle = line;
  brush.lineWidth = 1.4;
  brush.stroke();
  brush.beginPath();                                // the underside: from the near rim down to the stem
  for (n = -10; n <= 10; n++) {
    p = wavy(n / 10, 9);
    if (n === -10) { brush.moveTo(p[0], p[1]); } else { brush.lineTo(p[0], p[1]); }
  }
  brush.quadraticCurveTo(half * 0.45, -5, 0, 0);
  brush.quadraticCurveTo(-half * 0.45, -5, -half, rim + 2.4 * Math.sin(-8 + 9));
  brush.closePath();
  var under = brush.createLinearGradient(0, 0, 0, rim + 9);
  under.addColorStop(0, blend(colour, "#17402e", 0.55));
  under.addColorStop(1, colour);
  brush.fillStyle = under;
  brush.fill();
  brush.save();
  brush.clip();
  brush.strokeStyle = blend(colour, "#f6f2a4", 0.55);   // the veins, down to the stem
  brush.lineWidth = 0.9;
  brush.beginPath();
  for (n = -4; n <= 4; n++) {
    p = wavy(n / 4.4, 9);
    brush.moveTo(0, 0);
    brush.quadraticCurveTo(p[0] * 0.45, -6, p[0], p[1]);
  }
  brush.stroke();
  brush.restore();
  brush.strokeStyle = line;
  brush.lineWidth = 1.4;
  brush.stroke();
  brush.restore();
}

// A point on a stem: u is 0 at its root (x0, y0) and 1 at its top (x1, y1).
// "bow" swings the lower half to one side and the upper half back, so the
// stem is a long S.
function stemPoint(x0, y0, x1, y1, bow, u) {
  var ax = x0 + bow, ay = mix(y0, y1, 0.35), bx = x1 - bow * 0.7, by = mix(y0, y1, 0.7), v = 1 - u;
  return [v * v * v * x0 + 3 * v * v * u * ax + 3 * v * u * u * bx + u * u * u * x1,
          v * v * v * y0 + 3 * v * v * u * ay + 3 * v * u * u * by + u * u * u * y1];
}

// A stem: one long curve, lighter than the leaves, with a line of its own.
// A lotus stem carries small prickles.
function stemOf(brush, x0, y0, x1, y1, bow, colour, prickles) {
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(x0, y0);
  brush.bezierCurveTo(x0 + bow, mix(y0, y1, 0.35), x1 - bow * 0.7, mix(y0, y1, 0.7), x1, y1);
  brush.strokeStyle = "rgba(35, 65, 40, 0.85)";
  brush.lineWidth = 4.6;
  brush.stroke();
  brush.strokeStyle = colour;
  brush.lineWidth = 2.6;
  brush.stroke();
  if (prickles) {
    brush.fillStyle = "rgba(35, 65, 40, 0.7)";
    brush.beginPath();
    for (var n = 2; n < 19; n++) {
      var p = stemPoint(x0, y0, x1, y1, bow, n / 20);
      brush.moveTo(p[0] + (n % 2 ? 3.6 : -3.6) + 0.9, p[1]);
      brush.arc(p[0] + (n % 2 ? 3.6 : -3.6), p[1], 0.9, 0, 7);
    }
    brush.fill();
  }
}

// A clump of lotus, all its stems from one root at (x, base): flowers, buds
// and leaves, each at a height and a lean of its own, with curling blades at
// the root. "seed" changes the clump; "colour" is the flowers'.
// Seven to nine stems from one root. Given a second t the clump stirs in a breeze,
// and no frame depends on the one before: each stem's tip sways on two gusts of
// different pace (the taller the stem, the further), the stem bending with it rather
// than sliding; the leaves rock on the water; and an open flower breathes, its petals
// closing a little and opening again.
function lotusClump(brush, x, base, size, seed, colour, t) {
  seed = seed || 0;
  var stir = typeof t === "number";
  var kinds = ["leaf", "bud", "bloom", "leaf", "bud", "leaf", "bloom", "leaf", "bud"];
  var count = 7 + seed % 3, parts = [], n, part;
  for (n = 0; n < count; n++) {
    var spread = (n - (count - 1) / 2) / ((count - 1) / 2);     // -1 to 1 across the clump
    var kind = kinds[(n + seed) % kinds.length];
    var tall = (kind === "bloom" ? 260 : kind === "bud" ? 200 : 150) * (0.72 + 0.5 * dice(seed * 13 + n * 7 + 1));
    var lean = spread * 0.6 + (dice(seed * 17 + n * 5 + 2) - 0.5) * 0.3;
    var sway = stir ? (5 * Math.sin(t * 1.3 + seed + n * 0.9) + 2.5 * Math.sin(t * 2.7 + n * 1.7)) * tall / 260 : 0;
    parts.push({kind: kind, x: Math.sin(lean) * tall + sway, y: -Math.cos(lean) * tall, lean: lean + sway * 0.004,
                bow: (dice(seed * 19 + n * 3) - 0.5) * 100 + sway * 0.5, big: 0.8 + 0.4 * dice(seed * 23 + n),
                rock: stir ? 0.06 * Math.sin(t * 1.9 + n) : 0, breath: stir ? 0.04 * (1 + Math.sin(t * 0.9 + n)) : 0});
  }
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  for (n = 0; n < parts.length; n++) {
    part = parts[n];
    stemOf(brush, 0, 0, part.x, part.y, part.bow, "#b7cf86", true);
  }
  for (var pass = 0; pass < 3; pass++) {            // leaves first, then buds, then the flowers in front
    for (n = 0; n < parts.length; n++) {
      part = parts[n];
      if (part.kind !== ["leaf", "bud", "bloom"][pass]) { continue; }
      if (pass === 0) {
        lotusLeaf(brush, part.x, part.y, part.big, part.lean * 0.9 + part.rock);
      } else {
        brush.save();
        brush.translate(part.x, part.y);
        brush.rotate(part.lean * 0.5);
        lotus(brush, 0, 0, pass === 1 ? 0.95 * part.big : 1.5 * part.big, colour, pass === 1 ? 0 : 1 - part.breath);
        brush.restore();
      }
    }
  }
  for (n = 0; n < 5; n++) {                         // the blades at the root, each curling its own way
    var side = n % 2 ? 1 : -1;
    brush.save();
    brush.rotate(side * (0.5 + 0.28 * n) + (dice(seed * 29 + n) - 0.5) * 0.3);
    paintLeaf(brush, 62 + 30 * dice(seed * 31 + n), 11, side * 0.35, "#2f6a48", "#9fc77a", "rgba(35, 65, 40, 0.85)");
    brush.restore();
  }
  brush.restore();
}

// Water, as the murals draw it: rows of overlapping arcs, like scales, each
// with a smaller arc inside it. The rows further off are smaller and fainter.
// Rows of overlapping arcs, the water of the murals. Given a second t the water
// moves, and no frame depends on the one before: each row slides along at a pace
// set by how far off it is (the far rows slowly, the near rows faster, as a camera
// passing would show them), every arc rides two swells of different length that
// cross at different speeds, and a few glints along the far water brighten and fade.
function waves(brush, x, y, wide, tall, colour, t) {
  var rows = Math.max(1, Math.round(tall / 20)), moving = typeof t === "number";
  brush.save();
  brush.beginPath();
  brush.rect(x, y, wide, tall);
  brush.clip();
  brush.strokeStyle = colour || "rgba(255, 255, 255, 0.5)";
  brush.lineWidth = 1.4;
  for (var row = 0; row < rows; row++) {
    var u = row / rows, r = 15 + 15 * u, pitch = r * 1.6, level = y + tall * u + r * 0.6;
    var slide = moving ? (t * (6 + 16 * u)) % pitch : 0;          // along by depth; after one pitch the row is itself again
    brush.globalAlpha = 0.3 + 0.7 * u;
    brush.beginPath();
    for (var k = -2; (k - 1) * pitch < wide; k++) {
      var cx = x + (k + (row % 2) * 0.5) * pitch + slide;
      var lift = moving ? 1.6 * Math.sin(t * 1.7 + cx * 0.021) + 1.1 * Math.sin(t * 2.6 - cx * 0.043 + row) : 0;   // two swells crossing
      brush.moveTo(cx - r, level + lift);
      brush.arc(cx, level + lift, r, Math.PI, 0);
      brush.moveTo(cx - r * 0.58, level + lift);
      brush.arc(cx, level + lift, r * 0.58, Math.PI, 0);
    }
    brush.stroke();
  }
  if (moving) {                                                     // glints: short bright dashes on the far water that come and go
    brush.lineWidth = 2.2;
    brush.lineCap = "round";
    for (var g = 0; g < 10; g++) {
      var gu = dice(g * 5 + 1) * 0.5, gy = y + tall * gu, gx = x + ((dice(g * 5 + 2) * wide + t * (4 + 10 * gu)) % wide);
      brush.globalAlpha = clamp(0.4 + 0.6 * Math.sin(t * 2.4 + g * 2.1)) * (0.5 + gu);
      brush.beginPath();
      brush.moveTo(gx - 5 - 6 * gu, gy);
      brush.lineTo(gx + 5 + 6 * gu, gy);
      brush.stroke();
    }
  }
  brush.restore();
}

// Drops on the water: rings is [[x, y, at], ...], and from second "at" a ring
// spreads from (x, y) for 2.5 seconds, a second ring behind it, fading as it
// widens. The film says when a fish rose or a drop fell, so nothing is remembered.
function ripples(brush, rings, t) {
  brush.save();
  brush.strokeStyle = "rgba(255, 250, 230, 0.9)";
  brush.lineWidth = 1.6;
  (rings || []).forEach(function (ring) {
    var since = t - ring[2];
    if (since < 0 || since > 2.5) { return; }
    var u = since / 2.5;
    brush.globalAlpha = 0.85 * (1 - u) * (1 - u);
    for (var n = 0; n < 2; n++) {
      var r = (12 + 70 * u) * (1 - 0.35 * n);
      brush.beginPath();
      brush.ellipse(ring[0], ring[1], r, r * 0.35, 0, 0, 7);
      brush.stroke();
    }
  });
  brush.restore();
}

// A pond: a pool of graded water with a line along its bank and rows of
// wave arcs on it. The box (x, y, wide, tall) holds it: its near bank is the
// bottom of the box, and its far bank curves across the top.
// A pool with a bank line. Given flow.t the water moves (see waves), and
// flow.rings are drops on it (see ripples).
function pond(brush, x, y, wide, tall, flow) {
  flow = flow || {};
  brush.save();
  brush.beginPath();
  brush.moveTo(x, y + tall);
  brush.bezierCurveTo(x - wide * 0.03, y + tall * 0.3, x + wide * 0.2, y, x + wide * 0.5, y + tall * 0.07);
  brush.bezierCurveTo(x + wide * 0.8, y + tall * 0.14, x + wide * 1.03, y + tall * 0.3, x + wide, y + tall);
  brush.closePath();
  var water = brush.createLinearGradient(0, y, 0, y + tall);
  water.addColorStop(0, "#a4d4c0");
  water.addColorStop(1, "#2f7f7c");
  brush.fillStyle = water;
  brush.fill();
  brush.strokeStyle = "rgba(40, 80, 70, 0.85)";
  brush.lineWidth = 2.2;
  brush.lineJoin = "round";
  brush.stroke();
  brush.clip();
  waves(brush, x, y, wide, tall, "rgba(255, 250, 230, 0.6)", flow.t);
  if (flow.rings) { ripples(brush, flow.rings, flow.t || 0); }
  brush.restore();
}

// A fish in the water, in profile: "facing" is 1 or -1
function fish(brush, x, y, size, facing, colour) {
  colour = colour || "#e8793a";
  brush.save();
  brush.translate(x, y);
  brush.scale(size * (facing || 1), size);
  brush.beginPath();                                // the tail, then the body over it
  brush.moveTo(-20, 0);
  brush.lineTo(-36, -10);
  brush.quadraticCurveTo(-30, 0, -36, 10);
  brush.closePath();
  brush.fillStyle = colour;
  brush.fill();
  brush.strokeStyle = "rgba(110, 45, 25, 0.8)";
  brush.lineWidth = 1.2;
  brush.lineJoin = "round";
  brush.stroke();
  brush.beginPath();
  brush.moveTo(22, 0);
  brush.quadraticCurveTo(4, -15, -22, 0);
  brush.quadraticCurveTo(4, 13, 22, 0);
  brush.closePath();
  var side = brush.createLinearGradient(0, -12, 0, 11);
  side.addColorStop(0, colour);
  side.addColorStop(1, "#fff3dc");
  brush.fillStyle = side;
  brush.fill();
  brush.stroke();
  brush.fillStyle = "#2a1a12";
  brush.beginPath();
  brush.arc(13, -2, 1.6, 0, 7);
  brush.fill();
  brush.restore();
}

// A small flower of five round petals, pale at their rims, with a gold heart
function blossom(brush, x, y, r, colour) {
  var fade = brush.createRadialGradient(x, y, r * 0.1, x, y, r * 1.15);
  fade.addColorStop(0, colour);
  fade.addColorStop(1, "#fffaf0");
  for (var n = 0; n < 5; n++) {
    var a = n / 5 * Math.PI * 2 - Math.PI / 2;
    brush.fillStyle = fade;
    brush.beginPath();
    brush.ellipse(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.52, r * 0.42, a, 0, 7);
    brush.fill();
    brush.strokeStyle = "rgba(120, 50, 60, 0.6)";
    brush.lineWidth = 1;
    brush.stroke();
  }
  brush.fillStyle = "#e0b23a";
  brush.beginPath();
  brush.arc(x, y, r * 0.26, 0, 7);
  brush.fill();
}

// A flowering plant, as a thangka paints one: a curving stem, leaves up it
// on both sides (deep green, lighter at the tip, with a pale rib), and at
// its top a round flower of three rings of petals, each ring pale at its
// rim and "colour" toward the heart. "seed" changes the plant.
function flowerSpray(brush, x, base, size, colour, seed) {
  seed = seed || 0;
  colour = colour || "#f08a5c";
  var tall = 150 + 70 * dice(seed * 11 + 3), bow = (dice(seed * 7 + 1) - 0.5) * 120;
  var topX = (dice(seed * 3 + 5) - 0.5) * 120, topY = -tall, n, p;   // it leans, and bends on the way
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  stemOf(brush, 0, 0, topX, topY, bow, "#8fbf72", false);
  for (n = 0; n < 6; n++) {                         // the leaves, smaller toward the top
    var u = 0.14 + n * 0.125 + 0.06 * dice(seed * 13 + n), side = n % 2 ? 1 : -1;
    p = stemPoint(0, 0, topX, topY, bow, u);
    brush.save();
    brush.translate(p[0], p[1]);
    brush.rotate(side * (0.95 + 0.35 * dice(seed * 5 + n)));
    paintLeaf(brush, 50 - 22 * u, 12 - 4 * u, side * 0.22, "#1f5a48", "#6fb268", "rgba(20, 50, 40, 0.85)");
    brush.restore();
  }
  var rings = [[[9, 30, 15], [7, 19, 13], [5, 8.5, 10]],                  // for each ring: how many petals, how far out, how big
               [[7, 27, 17], [5, 15, 13], [3, 6, 9]],                     // a flower of fewer, broader petals
               [[11, 31, 12], [8, 20, 11], [5, 9, 9]]][seed % 3];         // and one of many narrow ones
  var heart = brush.createRadialGradient(topX, topY, 2, topX, topY, 46);
  heart.addColorStop(0, blend(colour, "#7a1830", 0.35));
  heart.addColorStop(0.55, colour);
  heart.addColorStop(1, "#fffaf0");
  for (var ring = 0; ring < rings.length; ring++) {
    for (n = 0; n < rings[ring][0]; n++) {
      var a = n / rings[ring][0] * Math.PI * 2 + ring * 0.45 + seed;
      brush.beginPath();
      brush.ellipse(topX + Math.cos(a) * rings[ring][1], topY + Math.sin(a) * rings[ring][1] * 0.9,
                    rings[ring][2], rings[ring][2] * 0.76, a, 0, 7);
      brush.fillStyle = heart;
      brush.fill();
      brush.strokeStyle = blend(colour, "#5a1420", 0.55);
      brush.lineWidth = 1.1;
      brush.stroke();
    }
  }
  brush.fillStyle = "#e0b23a";                      // the heart, in gold
  brush.beginPath();
  brush.arc(topX, topY, 4.5, 0, 7);
  brush.fill();
  brush.restore();
}

// A pad of leaves: a cluster of round lobes with one line round the whole
// cluster, deep green at its heart and lighter at its rim, and small leaves
// marked on it. A tree's foliage is pads, not one blob.
function leafPad(brush, x, y, r, colour, seed) {
  var lobes = [[x, y, r * 0.62]], n;
  for (n = 0; n < 7; n++) {
    var a = n / 7 * Math.PI * 2 + seed;
    lobes.push([x + Math.cos(a) * r * 0.52, y + Math.sin(a) * r * 0.42, r * (0.46 + 0.14 * dice(seed * 9 + n))]);
  }
  brush.fillStyle = "rgba(22, 50, 32, 0.92)";       // the line: every lobe a little larger, in the line's colour
  brush.beginPath();
  for (n = 0; n < lobes.length; n++) {
    brush.moveTo(lobes[n][0] + lobes[n][2] + 2.4, lobes[n][1]);
    brush.arc(lobes[n][0], lobes[n][1], lobes[n][2] + 2.4, 0, 7);
  }
  brush.fill();
  var fade = brush.createRadialGradient(x, y + r * 0.25, r * 0.1, x, y, r * 1.12);
  fade.addColorStop(0, blend(colour, "#123a2a", 0.6));
  fade.addColorStop(0.65, colour);
  fade.addColorStop(1, blend(colour, "#eaf2a4", 0.55));
  brush.fillStyle = fade;
  brush.beginPath();
  for (n = 0; n < lobes.length; n++) {
    brush.moveTo(lobes[n][0] + lobes[n][2], lobes[n][1]);
    brush.arc(lobes[n][0], lobes[n][1], lobes[n][2], 0, 7);
  }
  brush.fill();
  brush.strokeStyle = "rgba(228, 242, 170, 0.5)";   // small leaves: short curved marks
  brush.lineWidth = 1.5;
  brush.lineCap = "round";
  brush.beginPath();
  for (n = 0; n < lobes.length; n++) {
    for (var k = 0; k < 3; k++) {
      var b = seed + n * 2.1 + k * 2.2;
      var lx = lobes[n][0] + Math.cos(b) * lobes[n][2] * 0.5, ly = lobes[n][1] + Math.sin(b) * lobes[n][2] * 0.5;
      brush.moveTo(lx - 5, ly + 2);
      brush.quadraticCurveTo(lx, ly - 5, lx + 5, ly + 2);
    }
  }
  brush.stroke();
}

// A flock of birds, far off: each is two strokes that flap, and they fly
// in a loose line, each a little behind the one before.
function birds(t, x, y) {
  pen.strokeStyle = INK;
  pen.lineWidth = 2.5;
  pen.lineCap = "round";
  for (var n = 0; n < 6; n++) {
    var bx = x - n * 44 - dice(n + 20) * 20, by = y + Math.sin(n * 1.7) * 24 + Math.sin(t * 2 + n) * 6;
    var flap = Math.sin(t * 9 + n * 1.3) * 7;
    pen.beginPath();
    pen.moveTo(bx - 12, by - flap);
    pen.quadraticCurveTo(bx - 5, by + 2, bx, by);
    pen.quadraticCurveTo(bx + 5, by + 2, bx + 12, by - flap);
    pen.stroke();
  }
}

// People far away, watching: no ink line, only soft shapes that bob. As a
// mural draws a crowd, they stand in rows: the further row is higher on the
// picture and smaller, and even the furthest face has eyes and a mouth.
// Every so often one holds up a red paper umbrella, or carries a gong.
//   lanterns   true in the evening: some hold a lantern
function crowd(t, y, slide, lanterns) {
  var coats = ["#c4654f", "#4a6797", "#f2ead8", "#5a9686", "#e6a7b6", "#e9c45c", "#9a7bb0"];
  var sarongs = ["#3d4f78", "#b2455a", "#814a77", "#3d4f78", "#b2455a", "#5a9686", "#3d4f78"];
  for (var row = 0; row < 3; row++) {
    var rowY = y - [74, 38, 0][row], rowScale = [0.6, 0.78, 0.95][row], rowFade = [0.72, 0.8, 0.88][row];
    var apart = [92, 118, 150][row];
    for (var n = 0; n < 40; n++) {
      var x = ((n * apart + row * 47 - slide) % 3600 + 3600) % 3600 - 200;
      if (x > WIDE + 100) { continue; }
      var id = n + row * 40;
      var woman = id % 2 === 1, scale = rowScale * (0.9 + dice(id + 40) * 0.2);
      var bob = hop(t, dice(id) * 0.9) * 8;
      var wave = Math.sin(t * Math.PI / BEAT / 2 + id * 1.1);
      var umbrella = row === 2 && id % 5 === 2, gong = row === 1 && !woman && id % 6 === 0;
      pen.save();
      pen.translate(x, rowY - bob);
      pen.scale(scale, scale);
      pen.globalAlpha = rowFade;
      pen.fillStyle = sarongs[id % 7];
      pen.beginPath();
      if (woman) {                                  // a pha sin, wider at the hem
        pen.moveTo(-13, -48);
        pen.lineTo(-21, 0);
        pen.lineTo(21, 0);
        pen.lineTo(13, -48);
      } else {                                      // trousers
        pen.rect(-14, -48, 12, 48);
        pen.rect(2, -48, 12, 48);
      }
      pen.closePath();
      pen.fill();
      if (woman) {                                  // stripes on the pha sin
        pen.strokeStyle = "rgba(255, 230, 180, 0.5)";
        pen.lineWidth = 2;
        pen.beginPath();
        pen.moveTo(-18, -14);
        pen.lineTo(18, -14);
        pen.moveTo(-20, -6);
        pen.lineTo(20, -6);
        pen.stroke();
      }
      pen.fillStyle = coats[id % 7];                // the shirt
      pen.beginPath();
      pen.ellipse(0, -64, 17, 28, 0, 0, 7);
      pen.fill();
      pen.strokeStyle = coats[id % 7];              // one arm up, waving in time (or holding something); one down
      pen.lineWidth = 9;
      pen.lineCap = "round";
      pen.beginPath();
      pen.moveTo(12, -78);
      pen.lineTo(26, umbrella ? -118 : -106 - wave * 10);
      pen.moveTo(-12, -78);
      pen.lineTo(-22, gong ? -70 : -46);
      pen.stroke();
      pen.fillStyle = SKIN;                         // hands, and a head
      pen.beginPath();
      pen.arc(27, umbrella ? -122 : -110 - wave * 10, 5, 0, 7);
      pen.arc(-23, gong ? -72 : -43, 5, 0, 7);
      pen.arc(0, -104, 15, 0, 7);
      pen.fill();
      pen.fillStyle = INK;                          // hair: a bun, or a cap; and a face
      pen.beginPath();
      pen.ellipse(0, -110, 15, 11, 0, Math.PI, 0);
      if (woman) { pen.arc(2, -121, 7, 0, 7); }
      pen.fill();
      pen.beginPath();
      pen.arc(-5, -104, 1.6, 0, 7);
      pen.arc(5, -104, 1.6, 0, 7);
      pen.fill();
      pen.strokeStyle = INK;
      pen.lineWidth = 1.4;
      pen.beginPath();
      pen.moveTo(-3, -96);
      pen.quadraticCurveTo(0, -94, 3, -96);
      pen.stroke();
      if (!woman && id % 4 === 0) {                 // a woven hat on every fourth man
        pen.fillStyle = "#e9c76b";
        pen.beginPath();
        pen.ellipse(0, -116, 24, 7, 0, 0, 7);
        pen.fill();
        pen.beginPath();
        pen.moveTo(-16, -116);
        pen.lineTo(0, -134);
        pen.lineTo(16, -116);
        pen.fill();
      }
      if (umbrella) {                               // a red paper umbrella, on a stick in the raised hand
        pen.strokeStyle = "#5a3a20";
        pen.lineWidth = 2.5;
        pen.beginPath();
        pen.moveTo(27, -118);
        pen.lineTo(27, -160);
        pen.stroke();
        pen.fillStyle = "#c8402a";
        pen.beginPath();
        pen.ellipse(27, -158, 40, 13, 0, Math.PI, 0);
        pen.fill();
        pen.strokeStyle = "#e0b23a";                // a gold rim, and the ribs
        pen.lineWidth = 1.5;
        pen.beginPath();
        pen.ellipse(27, -158, 40, 13, 0, Math.PI, 0);
        for (var rib = 1; rib < 5; rib++) {
          var ra = Math.PI + rib / 5 * Math.PI;
          pen.moveTo(27, -158);
          pen.lineTo(27 + Math.cos(ra) * 40, -158 + Math.sin(ra) * 13);
        }
        pen.stroke();
      }
      if (gong) {                                   // a gong, hung from the lowered hand
        pen.fillStyle = "#b8862a";
        pen.beginPath();
        pen.arc(-24, -52, 15, 0, 7);
        pen.fill();
        pen.fillStyle = "#e0b23a";
        pen.beginPath();
        pen.arc(-24, -52, 5, 0, 7);
        pen.fill();
      }
      if (lanterns && id % 3 === 0 && !umbrella) {  // a lantern, held up in the waving hand
        var glow = pen.createRadialGradient(28, -130 - wave * 10, 0, 28, -130 - wave * 10, 40);
        glow.addColorStop(0, "rgba(255, 200, 100, 0.5)");
        glow.addColorStop(1, "rgba(255, 200, 100, 0)");
        pen.fillStyle = glow;
        pen.fillRect(-12, -170 - wave * 10, 80, 80);
        pen.fillStyle = "#ffcf70";
        pen.beginPath();
        pen.ellipse(28, -130 - wave * 10, 8, 11, 0, 0, 7);
        pen.fill();
      }
      pen.restore();
    }
  }
}

// A dog that trots. Its body, neck, legs and tail are painted the way a
// hand is: all of them first in ink, a little fat, then all of them in
// colour. So one line goes round the whole dog, and no line cuts a leg off
// from the body. A leg is two bones, and its knee bends as it steps.
function dog(x, y, t) {
  var trot = t / BEAT * Math.PI;
  var bob = hop(t, 0.5) * 7;
  var coat = "#d9a86c", ink = inkFor(coat);
  var parts = [], n;
  parts.push([-34, -56, 30, -58, 24, 23, 2]);                    // the body
  parts.push([34, -62, 56, -82, 17, 15, 1]);                     // the neck
  parts.push([-52, -62, -74, -88 + Math.sin(trot * 2) * 10, 6, 4.5, 1]);       // the tail wags
  parts.push([-74, -88 + Math.sin(trot * 2) * 10, -84, -104 + Math.sin(trot * 2 - 0.8) * 14, 4.5, 3, 0.5]);
  for (n = 0; n < 4; n++) {
    var front = n > 1;
    var hipX = front ? 24 + (n - 2) * 12 : -40 + n * 12, hipY = -44;
    var swing = Math.sin(trot + (n % 2) * Math.PI + (front ? 0 : Math.PI));     // legs trot in crossed pairs
    var lifted = Math.max(0, Math.cos(trot + (n % 2) * Math.PI + (front ? 0 : Math.PI))) * 9;
    var pawX = hipX + swing * 15, pawY = bob - 6 - lifted;
    var kneeX = (hipX + pawX) / 2 + (front ? 4 : -5) + lifted * (front ? 0.5 : -0.5);
    var kneeY = (hipY + pawY) / 2;
    parts.push([hipX, hipY, kneeX, kneeY, 8.5, 6, 1]);
    parts.push([kneeX, kneeY, pawX, pawY, 6, 5, 0.5]);
    parts.push([pawX, pawY + 2, pawX + 7, pawY + 3, 5, 4.5, 0]);  // a paw
  }
  pen.save();
  pen.translate(x, y - bob);
  heavy(ink);
  for (n = 0; n < parts.length; n++) {
    bone(parts[n][0], parts[n][1], parts[n][2], parts[n][3], parts[n][4] + LINE, parts[n][5] + LINE, parts[n][6]);
    pen.fillStyle = ink;
    pen.fill();
  }
  light();
  for (n = 0; n < parts.length; n++) {
    bone(parts[n][0], parts[n][1], parts[n][2], parts[n][3], parts[n][4], parts[n][5], parts[n][6]);
    pen.fillStyle = coat;
    pen.fill();
  }
  pen.fillStyle = "rgba(90, 50, 30, 0.2)";          // the belly is in shadow
  pen.beginPath();
  pen.ellipse(-4, -40, 44, 9, 0, 0, 7);
  pen.fill();
  pen.fillStyle = "rgba(255, 245, 225, 0.5)";       // a pale chest
  pen.beginPath();
  pen.ellipse(34, -52, 10, 14, 0.4, 0, 7);
  pen.fill();
  pen.save();                                       // the head nods against the trot
  pen.translate(60, -86);
  pen.rotate(Math.sin(trot) * 0.08);
  oval(0, 0, 26, 23, coat);
  oval(22, 8, 13, 10, "#eccb9a");                   // the muzzle
  oval(31, 3, 6, 5, INK);                           // the nose
  pen.strokeStyle = INK;
  pen.lineWidth = LINE;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(14, 13);
  pen.quadraticCurveTo(22, 19, 31, 12);             // a smile
  pen.stroke();
  if (Math.sin(trot) > 0.2) {                       // and a tongue, on every other step
    oval(22, 19, 4, 5 + Math.sin(trot) * 2, "#f0808a");
  }
  pieEye(9, -6);
  pen.save();                                       // an ear that flaps a moment after the head
  pen.translate(-16, -14);
  pen.rotate(0.5 + Math.sin(trot - 1) * 0.3);
  pen.beginPath();
  pen.moveTo(-7, 0);
  pen.quadraticCurveTo(-12, 26, 0, 32);
  pen.quadraticCurveTo(12, 24, 8, 0);
  pen.closePath();
  shape("#8a5a36");
  pen.restore();
  pen.restore();
  pen.restore();
}

// A rooster. It crows once every two beats, in three parts, as an animator
// would time it: it sinks first (the part that makes the crow read), then
// stretches its neck up and throws its head back with its beak open and its
// wings out, then settles. "stretch" is below 0 while it sinks and runs up to
// 1 at the top of the crow.
function rooster(x, y, t) {
  var turn = (t / BEAT / 2) % 1;
  var stretch = turn < 0.2 ? -0.35 * Math.sin(turn / 0.2 * Math.PI)
              : turn < 0.75 ? Math.sin((turn - 0.2) / 0.55 * Math.PI) : 0;
  var crowing = Math.max(0, stretch);
  var n;
  pen.save();
  pen.translate(x, y + 4 - stretch * 5);
  pen.lineCap = "round";
  for (n = 0; n < 2; n++) {                         // two legs, and three toes each
    var footX = -8 + n * 18;
    pen.strokeStyle = "#c8861e";
    pen.lineWidth = 4;
    pen.beginPath();
    pen.moveTo(footX + 2, -16);
    pen.lineTo(footX, -2 + stretch * 5);
    pen.moveTo(footX - 9, 1 + stretch * 5);
    pen.lineTo(footX, -2 + stretch * 5);
    pen.lineTo(footX + 10, 1 + stretch * 5);
    pen.moveTo(footX, -2 + stretch * 5);
    pen.lineTo(footX + 2, 4 + stretch * 5);
    pen.stroke();
  }
  // the tail: five feathers in a fan. Each swings a little after the one
  // before it, and the whole fan lifts in the crow.
  var feathers = ["#2f6b5a", "#c9452e", "#2f6b5a", "#e9c76b", "#c9452e"];
  for (n = 0; n < 5; n++) {
    var lean = 2.2 + n * 0.28 - crowing * 0.25 + Math.sin(t * 5 - n * 0.6) * 0.07;
    var long = 50 - Math.abs(n - 2) * 5;
    hose(-20, -34, -20 + Math.cos(lean) * long, -34 - Math.sin(lean) * long, 0.35, 8, feathers[n]);
  }
  pen.save();                                       // the body leans back as the neck goes up
  pen.translate(0, -30);
  pen.rotate(-0.12 - crowing * 0.22);
  oval(0, 0, 31, 24 + crowing * 3, "#fff6e6");
  pen.fillStyle = "rgba(120, 80, 60, 0.18)";        // the belly is in shadow
  pen.beginPath();
  pen.ellipse(-4, 12, 24, 9, 0, 0, 7);
  pen.fill();
  pen.save();                                       // a wing, which lifts and shakes in the crow
  pen.translate(-6, -8);
  pen.rotate(0.35 - crowing * 1.1 + Math.sin(t * 34) * 0.14 * crowing);
  pen.beginPath();
  pen.moveTo(8, 0);
  pen.quadraticCurveTo(-8, -14, -30, -2);
  pen.quadraticCurveTo(-22, 2, -26, 8);
  pen.quadraticCurveTo(-14, 8, -16, 14);
  pen.quadraticCurveTo(0, 14, 8, 0);
  pen.closePath();
  shape("#f0dcc0");
  pen.restore();
  pen.restore();
  // the neck, and a head that tips back
  var headX = 28 + crowing * 2, headY = -78 - stretch * 20;
  hose(16, -42, headX - 2, headY + 8, 0.12 + crowing * 0.1, 15, "#fff6e6");
  hose(10, -40, 20, -52, 0.3, 9, "#e9c76b");        // a ruff of gold feathers at its foot
  pen.save();
  pen.translate(headX, headY);
  pen.rotate(-crowing * 0.55);
  for (n = 0; n < 3; n++) {                         // the comb: three bumps that wobble
    oval(-7 + n * 7, -13 - (n === 1 ? 3 : 0) + Math.sin(t * 9 + n) * 1.2, 5.5, 6.5, "#d63a2f");
  }
  pen.save();                                       // the wattle swings under the beak
  pen.translate(9, 9);
  pen.rotate(Math.sin(t * 8) * 0.25 + crowing * 0.4);
  oval(0, 6, 4.5, 8, "#d63a2f");
  pen.restore();
  var gape = 0.08 + crowing * 0.5;                  // the beak: two halves that open
  for (n = -1; n <= 1; n += 2) {
    pen.save();
    pen.translate(10, 1);
    pen.rotate(n * gape);
    pen.beginPath();
    pen.moveTo(0, n * 5);
    pen.lineTo(n < 0 ? 22 : 17, 0);
    pen.lineTo(0, 0);
    pen.closePath();
    shape("#f0a030");
    pen.restore();
  }
  oval(0, 0, 14, 13, "#fff6e6");
  if ((t + 0.7) % 2.9 < 0.12) {                     // it blinks, too
    pen.strokeStyle = INK;
    pen.lineWidth = 2;
    pen.beginPath();
    pen.moveTo(1, -3);
    pen.lineTo(8, -3);
    pen.stroke();
  } else {
    pen.fillStyle = INK;
    pen.beginPath();
    pen.arc(5, -3, 2.8, 0, 7);
    pen.fill();
    pen.fillStyle = "#ffffff";
    pen.beginPath();
    pen.arc(4, -4, 1, 0, 7);
    pen.fill();
  }
  pen.restore();
  pen.restore();
  // a note of music flies off while it crows
  if (crowing > 0) {
    var fly = (turn - 0.2) / 0.55;
    pen.globalAlpha = 1 - fly;
    oval(x + 80 + fly * 70, y - 120 - fly * 80, 11, 8, INK, -0.4);
    hose(x + 90 + fly * 70, y - 122 - fly * 80, x + 90 + fly * 70, y - 160 - fly * 80, 0, 2, INK);
    pen.globalAlpha = 1;
  }
}

// The sun. STYLE.sun is "flames" (a gold disc ringed with the flame scrolls
// of a thangka, which turn and swell on the beat) or "face" (the smiling sun
// of a 1930s cartoon).
function sun(x, y, t) {
  var big = 74 + hop(t, 0) * 7;
  if (STYLE.sun === "face") {
    pen.strokeStyle = "#f4b740";
    pen.lineWidth = 9;
    pen.lineCap = "round";
    for (var ray = 0; ray < 12; ray++) {
      var angle = ray / 12 * Math.PI * 2 + t * 0.4;
      var reach = 44 + (ray % 2 ? 10 : -4) * hop(t, 0.5);
      pen.beginPath();
      pen.moveTo(x + Math.cos(angle) * (big + 16), y + Math.sin(angle) * (big + 16));
      pen.lineTo(x + Math.cos(angle) * (big + reach), y + Math.sin(angle) * (big + reach));
      pen.stroke();
    }
    oval(x, y, big, big, "#ffd75e");
    pieEye(x - 24, y - 12);
    pieEye(x + 18, y - 12);
    pen.strokeStyle = INK;
    pen.lineWidth = 5;
    pen.beginPath();
    pen.arc(x, y + 6, 34, 0.3, Math.PI - 0.3);
    pen.stroke();
    return;
  }
  pen.save();
  pen.translate(x, y);
  pen.rotate(t * 0.15);
  for (var flame = 0; flame < 14; flame++) {        // each ray is a flame that curls at its tip
    var fa = flame / 14 * Math.PI * 2, reach = big + 34 + (flame % 2 ? 12 : 0) * hop(t, 0.5);
    pen.save();
    pen.rotate(fa);
    pen.beginPath();
    pen.moveTo(big - 4, -10);
    pen.quadraticCurveTo(reach * 0.8, -16, reach, -4);
    pen.quadraticCurveTo(reach * 0.92, 4, reach * 0.82, 10);
    pen.quadraticCurveTo(reach * 0.7, 2, big - 4, 10);
    pen.closePath();
    pen.fillStyle = flame % 2 ? "#f0a030" : "#e4552a";
    pen.fill();
    pen.strokeStyle = "rgba(120, 50, 20, 0.5)";
    pen.lineWidth = 1.5;
    pen.stroke();
    pen.restore();
  }
  pen.restore();
  var disc = pen.createRadialGradient(x - 10, y - 10, 10, x, y, big);
  disc.addColorStop(0, "#fff0a0");
  disc.addColorStop(1, "#f0b030");
  pen.fillStyle = disc;
  pen.beginPath();
  pen.arc(x, y, big, 0, 7);
  pen.fill();
  pen.strokeStyle = "#c8641a";
  pen.lineWidth = 3;
  pen.stroke();
  pen.lineWidth = 1.5;                              // a ring of small lotus petals inside the rim
  pen.beginPath();
  for (var p = 0; p < 16; p++) {
    var pa = p / 16 * Math.PI * 2 - t * 0.15;
    pen.moveTo(x + Math.cos(pa) * (big - 4), y + Math.sin(pa) * (big - 4));
    pen.lineTo(x + Math.cos(pa) * (big - 16), y + Math.sin(pa) * (big - 16));
  }
  pen.stroke();
}

// A khom loi: a paper lantern that flies because the air in it is hot. The
// paper is brightest low down, by the flame, and darker toward the closed
// top. Thin bamboo hoops show through it. It leans a little one way and
// then the other as it climbs, and its flame never holds still.
function lantern(x, y, size) {
  var flicker = 0.85 + 0.15 * Math.sin(clock * 23 + x) * Math.sin(clock * 7.3 + x * 0.5);
  var light = pen.createRadialGradient(x, y + size * 0.3, 0, x, y + size * 0.3, size * 3.4);
  light.addColorStop(0, "rgba(255, 200, 100, " + (0.5 * flicker) + ")");
  light.addColorStop(0.35, "rgba(255, 180, 90, " + (0.2 * flicker) + ")");
  light.addColorStop(1, "rgba(255, 170, 80, 0)");
  pen.fillStyle = light;
  pen.fillRect(x - size * 3.4, y - size * 3.4, size * 6.8, size * 6.8);
  pen.save();
  pen.translate(x, y);
  pen.rotate(Math.sin(clock * 1.4 + x * 0.05) * 0.09);
  pen.scale(size / 40, size / 40);                  // drawn for a lantern 40 wide
  pen.beginPath();                                  // the paper: straight sides, a round top
  pen.moveTo(-17, 26);
  pen.bezierCurveTo(-23, 4, -26, -22, -16, -32);
  pen.quadraticCurveTo(0, -42, 16, -32);
  pen.bezierCurveTo(26, -22, 23, 4, 17, 26);
  pen.quadraticCurveTo(0, 31, -17, 26);
  pen.closePath();
  var paper = pen.createLinearGradient(0, 28, 0, -38);
  paper.addColorStop(0, "#fff3b8");
  paper.addColorStop(0.35, "#ffcf70");
  paper.addColorStop(1, "#ee8a3e");
  pen.fillStyle = paper;
  pen.fill();
  pen.save();
  pen.clip();
  var core = pen.createRadialGradient(0, 22, 0, 0, 22, 34);      // the flame, seen through the paper
  core.addColorStop(0, "rgba(255, 255, 235, " + (0.85 * flicker) + ")");
  core.addColorStop(1, "rgba(255, 255, 235, 0)");
  pen.fillStyle = core;
  pen.fillRect(-30, -12, 60, 46);
  pen.fillStyle = "rgba(160, 70, 30, 0.2)";         // the side away from us is darker
  pen.fillRect(-30, -44, 13, 80);
  pen.strokeStyle = "rgba(150, 80, 30, 0.4)";       // two hoops of bamboo, and two seams in the paper
  pen.lineWidth = 1.4;
  for (var hoop = 0; hoop < 2; hoop++) {
    pen.beginPath();
    pen.ellipse(0, -12 + hoop * 18, 26, 5, 0, 0, Math.PI);
    pen.stroke();
  }
  for (var seam = -1; seam <= 1; seam += 2) {
    pen.beginPath();
    pen.moveTo(seam * 8, -38);
    pen.quadraticCurveTo(seam * 11, -4, seam * 7, 30);
    pen.stroke();
  }
  pen.restore();
  pen.strokeStyle = "#a8592a";                      // the line round the paper, and the ring at its mouth
  pen.lineWidth = LINE * 0.8;
  pen.lineJoin = "round";
  pen.stroke();
  pen.beginPath();
  pen.ellipse(0, 27, 17, 4, 0, 0, 7);
  pen.strokeStyle = "#7a4a22";
  pen.lineWidth = 2;
  pen.stroke();
  pen.beginPath();                                  // the flame itself, below the ring
  pen.moveTo(-4, 29);
  pen.quadraticCurveTo(-6, 20, Math.sin(clock * 17 + x) * 2, 16 - flicker * 5);
  pen.quadraticCurveTo(6, 20, 4, 29);
  pen.closePath();
  pen.fillStyle = "#fff8d6";
  pen.fill();
  pen.strokeStyle = "rgba(255, 255, 255, 0.22)";    // a wisp of smoke from the top
  pen.lineWidth = 2;
  pen.lineCap = "round";
  pen.beginPath();
  pen.moveTo(0, -40);
  pen.bezierCurveTo(6 + Math.sin(clock * 3 + x) * 6, -60, -8 + Math.sin(clock * 2 + x) * 8, -80, 4, -104);
  pen.stroke();
  pen.restore();
}

// A big tree with a round canopy, as the murals paint one: a trunk that
// forks, drawn as a shape with a line round it, and its leaves in pads.
function tree(brush, x, base, size) {
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.beginPath();                                // the trunk and its two boughs, one shape
  brush.moveTo(-17, 0);
  brush.bezierCurveTo(-9, -70, -19, -120, -8, -170);
  brush.quadraticCurveTo(-40, -205, -86, -262);     // out along the left bough
  brush.lineTo(-73, -269);
  brush.quadraticCurveTo(-30, -222, 0, -196);       // and back to the fork
  brush.quadraticCurveTo(52, -232, 88, -277);       // the right bough
  brush.lineTo(99, -268);
  brush.quadraticCurveTo(52, -210, 14, -168);
  brush.bezierCurveTo(23, -120, 11, -60, 20, 0);
  brush.closePath();
  var bark = brush.createLinearGradient(-20, 0, 22, 0);
  bark.addColorStop(0, "#5a3e2a");
  bark.addColorStop(0.55, "#8f6846");
  bark.addColorStop(1, "#6f4f34");
  brush.fillStyle = bark;
  brush.fill();
  brush.strokeStyle = "rgba(55, 35, 22, 0.9)";
  brush.lineWidth = 2.5;
  brush.lineJoin = "round";
  brush.stroke();
  brush.lineWidth = 1.2;                            // the grain of the bark
  brush.beginPath();
  brush.moveTo(-4, -20);
  brush.quadraticCurveTo(-8, -70, -2, -120);
  brush.moveTo(7, -40);
  brush.quadraticCurveTo(3, -90, 8, -150);
  brush.stroke();
  var pads = [[-150, -232, 50], [150, -240, 52], [-110, -292, 70], [110, -300, 72], [0, -282, 64],
              [-40, -344, 80], [50, -352, 78], [0, -412, 60]];
  for (var n = 0; n < pads.length; n++) { leafPad(brush, pads[n][0], pads[n][1], pads[n][2], "#3f7c4c", n * 1.7); }
  brush.restore();
}

// a clump of leaves at the edge of the path, each leaf outlined, as a mural draws foliage
function leafClump(brush, x, base, size) {
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  for (var n = -2; n <= 2; n++) {
    var angle = -Math.PI / 2 + n * 0.42;
    brush.beginPath();
    brush.moveTo(0, 0);
    brush.quadraticCurveTo(Math.cos(angle - 0.25) * 60, Math.sin(angle - 0.25) * 60,
                           Math.cos(angle) * 90, Math.sin(angle) * 90);
    brush.quadraticCurveTo(Math.cos(angle + 0.25) * 60, Math.sin(angle + 0.25) * 60, 0, 0);
    brush.closePath();
    brush.fillStyle = n % 2 ? "#4f8a4a" : "#3d6e3e";
    brush.fill();
    brush.strokeStyle = "rgba(30, 50, 25, 0.7)";
    brush.lineWidth = 2;
    brush.stroke();
    brush.beginPath();                              // the rib
    brush.moveTo(0, 0);
    brush.lineTo(Math.cos(angle) * 80, Math.sin(angle) * 80);
    brush.stroke();
  }
  brush.restore();
}

// A range of hills across the picture: one ridge, graded from deep along
// the top to pale at the foot, with a firm line and tufts of grass. A film
// lays three or four, the furthest first.
function hills(brush, wide, base, tall, shape, colour) {
  var x, plain = !/^#[0-9a-f]{6}$/i.test(colour);
  function ridge(at) {
    return base - tall * (0.5 + 0.3 * Math.sin(at * 0.004 + shape) + 0.2 * Math.sin(at * 0.011 + shape * 3));
  }
  brush.beginPath();
  brush.moveTo(0, 1080);
  for (x = 0; x <= wide; x += 20) { brush.lineTo(x, ridge(x)); }
  brush.lineTo(wide, 1080);
  brush.closePath();
  if (plain) {
    brush.fillStyle = colour;
  } else {                                          // deepest along the ridge, and pale where the next range begins
    var fade = brush.createLinearGradient(0, base - tall, 0, base + 60);
    fade.addColorStop(0, blend(colour, "#1f4a44", 0.32));
    fade.addColorStop(0.45, colour);
    fade.addColorStop(1, blend(colour, "#fff6e0", 0.5));
    brush.fillStyle = fade;
  }
  brush.fill();
  brush.beginPath();                                // the ridge: a firm line
  for (x = 0; x <= wide; x += 20) { brush.lineTo(x, ridge(x)); }
  brush.strokeStyle = plain ? "rgba(90, 60, 40, 0.4)" : blend(colour, "#22382c", 0.6);
  brush.lineWidth = 2.5;
  brush.lineJoin = "round";
  brush.stroke();
  brush.lineWidth = 1.6;                            // and tufts of grass along it, no two spaced alike
  brush.lineCap = "round";
  brush.beginPath();
  for (var n = 0, at = 20; at < wide; n++, at += 36 + 44 * dice(n + shape * 31)) {
    var top = ridge(at), long = 7 + 6 * dice(n * 3 + shape * 17);
    for (var blade = -1; blade <= 1; blade++) {
      brush.moveTo(at, top + 1);
      brush.lineTo(at + blade * long * 0.5, top - long * (blade ? 0.8 : 1));
    }
  }
  brush.stroke();
}

// A heap of peaks, as a thangka piles a mountain: pointed, one before
// another, the furthest and tallest first. Each peak is pale at its tip and
// deep at its foot, its sides a little hollow, with a ridge line from the tip
// down and short strokes down the side away from the light.
//   x, base     the middle of the heap's foot
//   wide, tall  how far the heap spreads, and how high its tallest peak stands
//   colour      "#rrggbb"
//   seed        which heap it is: another number, another heap
function peaks(brush, x, base, wide, tall, colour, seed) {
  var line = blend(colour, "#2a1a10", 0.72), rows = [[5, 1], [6, 0.72], [5, 0.46]];
  brush.lineJoin = "round";
  brush.lineCap = "round";
  for (var row = 0; row < rows.length; row++) {
    var count = rows[row][0];
    for (var n = 0; n < count; n++) {
      var k = row * 10 + n + (seed || 0) * 37;
      var across = ((n + 0.5) / count * 2 - 1) * (0.7 + 0.15 * row) + (dice(k) - 0.5) * 0.7 / count;   // -1 to 1 across the heap
      var high = tall * rows[row][1] * (0.55 + 0.45 * (1 - across * across)) * (0.82 + 0.36 * dice(k + 5));
      var half = wide / count * (0.95 + 0.45 * dice(k + 9)), px = x + across * wide * 0.5, lean = (dice(k + 13) - 0.5) * half * 0.4;
      brush.beginPath();
      brush.moveTo(px - half, base);
      brush.quadraticCurveTo(px - half * 0.42 + lean * 0.5, base - high * 0.46, px + lean, base - high);
      brush.quadraticCurveTo(px + half * 0.42 + lean * 0.5, base - high * 0.46, px + half, base);
      brush.closePath();
      var fade = brush.createLinearGradient(0, base - high, 0, base);
      fade.addColorStop(0, blend(colour, "#fff3c8", 0.6));
      fade.addColorStop(0.5, colour);
      fade.addColorStop(1, blend(colour, "#2f4a2a", 0.5));
      brush.fillStyle = fade;
      brush.fill();
      brush.strokeStyle = line;
      brush.lineWidth = 1.8;
      brush.stroke();
      brush.lineWidth = 1.1;                        // the ridge, and the strokes down the side away from the light
      brush.beginPath();
      brush.moveTo(px + lean, base - high);
      brush.quadraticCurveTo(px + lean * 0.4 + half * 0.14, base - high * 0.5, px + half * 0.1, base - high * 0.06);
      for (var s = 1; s <= 4; s++) {
        var u = s / 5, ax = px + lean * (1 - u) + half * 0.13 * u, ay = base - high * (1 - u);
        brush.moveTo(ax, ay);
        brush.quadraticCurveTo(ax + half * 0.16 * u, ay + high * 0.07, ax + half * 0.42 * u, ay + high * 0.2);
      }
      brush.stroke();
    }
  }
}

// A plant that is a fan of long leaves from one root, as a thangka fills
// its hills with: the leaves at the sides lie low and are drawn first, the
// ones in the middle stand and lie over them. Each is a leaf of the kit's
// (paintLeaf): deep at its foot, lighter at its tip, a pale rib, a fine line.
function fanPlant(brush, x, base, size, colour, seed) {
  var count = 9 + Math.floor(dice((seed || 0) + 3) * 5), line = blend(colour, "#16281c", 0.7), leaves = [], n;
  for (n = 0; n < count; n++) { leaves.push((n / (count - 1) * 2 - 1) * 1.25 + (dice((seed || 0) * 7 + n) - 0.5) * 0.14); }
  leaves.sort(function (a, b) { return Math.abs(b) - Math.abs(a); });
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  for (n = 0; n < count; n++) {
    var lean = leaves[n];
    brush.save();
    brush.rotate(lean);
    paintLeaf(brush, 76 * (1 - 0.3 * Math.abs(lean) / 1.25) * (0.84 + 0.32 * dice((seed || 0) + n * 3)), 7.5,
              (lean > 0 ? 1 : -1) * 0.18 * (0.4 + dice((seed || 0) + n * 5)), blend(colour, "#143524", 0.45), blend(colour, "#f1e9a8", 0.4),
              line, "rgba(246, 226, 150, 0.85)");
    brush.restore();
  }
  brush.restore();
}

// A tree as a thangka paints one: a trunk that leans, and a crown of round
// dark clumps, each carrying one pale tassel: a small arc with lines that
// hang from it and meet. The clumps further back are drawn first.
function tasselTree(brush, x, base, size, colour, seed) {
  var k = (seed || 0) * 13, lean = (dice(k) - 0.5) * 36, n;
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.lineJoin = "round";
  brush.lineCap = "round";
  brush.beginPath();                                // the trunk: one shape, thick at the root
  brush.moveTo(-13, 0);
  brush.bezierCurveTo(-5, -40, -14 + lean * 0.4, -80, -6 + lean, -128);
  brush.lineTo(7 + lean, -128);
  brush.bezierCurveTo(4 + lean * 0.4, -80, 9, -40, 15, 0);
  brush.closePath();
  var bark = brush.createLinearGradient(-14, 0, 16, 0);
  bark.addColorStop(0, "#4f3423");
  bark.addColorStop(0.55, "#86603f");
  bark.addColorStop(1, "#65462e");
  brush.fillStyle = bark;
  brush.fill();
  brush.strokeStyle = "rgba(50, 30, 18, 0.9)";
  brush.lineWidth = 2;
  brush.stroke();
  var clumps = [[-34, -196, 30], [30, -202, 31], [-66, -158, 29], [0, -168, 33], [64, -160, 30], [-36, -122, 30], [34, -126, 31]];
  for (n = 0; n < clumps.length; n++) {
    var cx = clumps[n][0] + lean + (dice(k + n * 3) - 0.5) * 12, cy = clumps[n][1] + (dice(k + n * 3 + 1) - 0.5) * 10;
    var r = clumps[n][2] * (0.9 + 0.2 * dice(k + n * 3 + 2));
    brush.beginPath();
    brush.arc(cx, cy, r, 0, 7);
    var deep = brush.createRadialGradient(cx, cy, r * 0.15, cx, cy, r);   // deep at its heart, lighter at its rim
    deep.addColorStop(0, blend(colour, "#10180f", 0.5));
    deep.addColorStop(1, colour);
    brush.fillStyle = deep;
    brush.fill();
    brush.strokeStyle = blend(colour, "#0c120b", 0.7);
    brush.lineWidth = 1.8;
    brush.stroke();
    brush.strokeStyle = "rgba(246, 226, 160, 0.9)";   // the tassel
    brush.lineWidth = 1.3;
    brush.beginPath();
    brush.arc(cx, cy - r * 0.02, r * 0.46, Math.PI * 1.12, Math.PI * 1.88);
    for (var hang = 0; hang <= 5; hang++) {
      var at = Math.PI * (1.12 + 0.76 * hang / 5);
      brush.moveTo(cx + Math.cos(at) * r * 0.46, cy - r * 0.02 + Math.sin(at) * r * 0.46);
      brush.lineTo(cx + (hang - 2.5) * r * 0.03, cy + r * 0.56);
    }
    brush.stroke();
  }
  brush.restore();
}

// Rocks, as a thangka paints them: round boulders piled one before another,
// each banded in layers: lines inside it that arch the way its top does, one
// under another. A boulder is deep at its heart and its colour at its rim.
function rocks(brush, x, base, size, colour, seed) {
  var k = (seed || 0) * 17, piles = [[-58, 0.95], [44, 1.1], [-8, 1.3], [-92, 0.62], [84, 0.7], [18, 0.74]], n;
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.lineJoin = "round";
  for (n = 0; n < piles.length; n++) {
    var cx = piles[n][0] + (dice(k + n) - 0.5) * 16, rx = 50 * piles[n][1] * (0.85 + 0.3 * dice(k + n + 7));
    var ry = rx * (0.7 + 0.5 * dice(k + n + 11)), cy = n < 3 ? -ry * 0.5 : -ry * 0.3;
    brush.save();
    brush.beginPath();
    brush.rect(-400, -600, 800, 600);               // a boulder stands on the ground: nothing of it shows below
    brush.clip();
    brush.beginPath();
    brush.ellipse(cx, cy, rx, ry, 0, 0, 7);
    var deep = brush.createRadialGradient(cx, cy, rx * 0.1, cx, cy, Math.max(rx, ry));
    deep.addColorStop(0, blend(colour, "#1c1410", 0.45));
    deep.addColorStop(1, blend(colour, "#f1e3c0", 0.12));
    brush.fillStyle = deep;
    brush.fill();
    brush.strokeStyle = blend(colour, "#120c08", 0.75);
    brush.lineWidth = 2;
    brush.stroke();
    brush.strokeStyle = "rgba(246, 226, 160, 0.75)";  // its rings
    brush.lineWidth = 1.2;
    for (var ring = 1; ring <= 3; ring++) {            // each arches over the one inside it, and all stand on the ground
      var shrink = 1 - ring * 0.2;
      brush.beginPath();
      brush.ellipse(cx - rx * 0.07 * ring, cy + ry * 0.16 * ring, rx * shrink, ry * shrink, 0, Math.PI * 0.86, Math.PI * 2.14);
      brush.stroke();
    }
    brush.restore();
  }
  brush.restore();
}

// Water that runs, as a thangka paints it: rows of waves, each a hump whose
// crest curls over, white at the crest and the water's colour at the foot,
// with two lines inside it that follow its back. The rows further off are
// drawn first, and each row sits between the waves of the one behind.
function foam(brush, x, y, wide, tall, colour, seed) {
  var rows = Math.max(1, Math.round(tall / 26)), line = blend(colour || "#6f8fb0", "#16243a", 0.7);
  brush.save();
  brush.lineJoin = "round";
  brush.lineCap = "round";
  for (var row = 0; row < rows; row++) {
    var w = 54 + 10 * row, h = 30 + 6 * row, level = y + (row + 1) * tall / rows;
    for (var k = 0; (k - 0.5) * w * 0.82 < wide; k++) {
      var wx = x + (k + (row % 2) * 0.5) * w * 0.82 + (dice((seed || 0) + row * 9 + k) - 0.5) * 10;
      brush.beginPath();
      brush.moveTo(wx - w / 2, level);
      brush.quadraticCurveTo(wx - w * 0.3, level - h * 0.9, wx + w * 0.12, level - h);        // up its back to the crest
      brush.quadraticCurveTo(wx + w * 0.44, level - h * 1.02, wx + w * 0.4, level - h * 0.6);  // the crest curls over
      brush.quadraticCurveTo(wx + w * 0.38, level - h * 0.4, wx + w * 0.24, level - h * 0.5);  // and in on itself
      brush.quadraticCurveTo(wx + w * 0.34, level - h * 0.18, wx + w / 2, level);
      brush.closePath();
      var fade = brush.createLinearGradient(0, level - h, 0, level);
      fade.addColorStop(0, "#ffffff");
      fade.addColorStop(0.45, blend(colour || "#6f8fb0", "#ffffff", 0.6));
      fade.addColorStop(1, colour || "#6f8fb0");
      brush.fillStyle = fade;
      brush.fill();
      brush.strokeStyle = line;
      brush.lineWidth = 1.5;
      brush.stroke();
      brush.lineWidth = 1;                          // the two lines that follow its back
      brush.beginPath();
      brush.moveTo(wx - w * 0.36, level - h * 0.06);
      brush.quadraticCurveTo(wx - w * 0.2, level - h * 0.66, wx + w * 0.1, level - h * 0.78);
      brush.moveTo(wx - w * 0.2, level - h * 0.04);
      brush.quadraticCurveTo(wx - w * 0.08, level - h * 0.44, wx + w * 0.12, level - h * 0.54);
      brush.stroke();
    }
  }
  brush.restore();
}

// Rows of tiles on a roof, inside the brush's clip: the roof's own shape is
// clipped before this is called. Each row lies over the one below it, as
// tiles do, so only the lower end of a tile shows. No two tiles are quite
// one colour, each row throws a line of shade on the row below, and the
// whole roof is lighter toward its ridge and darker at its eave.
//   left, right, top, bottom   the box the roof is in
//   tile                       how wide a tile is; a row is 0.75 of that high
//   colour                     the tiles' colour, or a function of (x, y) that gives one, for a roof in bands
//   end                        how a tile ends: "round" (scales), "point" or "square"
function roofTiles(brush, left, right, top, bottom, tile, colour, end) {
  var high = tile * 0.75, rows = Math.ceil((bottom - top) / high) + 1;
  for (var row = 0; row < rows; row++) {            // from the eave up, so that each row lies over the one below
    var y = bottom - row * high, shift = (row % 2) * tile / 2;
    brush.fillStyle = "rgba(20, 10, 6, 0.24)";      // the shade this row throws on the row below
    brush.fillRect(left, y, right - left, high * 0.3);
    for (var across = Math.floor(left / tile) - 1; across * tile + shift < right; across++) {
      var x = across * tile + shift, own = typeof colour === "function" ? colour(x + tile / 2, y - high / 2) : colour;
      var tone = dice(row * 37 + across * 11 + 5) - 0.5;
      brush.fillStyle = blend(own, tone > 0 ? "#ffffff" : "#000000", Math.abs(tone) * 0.24);
      brush.beginPath();
      brush.moveTo(x + 0.5, y - high * 1.4);
      if (end === "point") {
        brush.lineTo(x + 0.5, y - high * 0.45);
        brush.lineTo(x + tile / 2, y);
        brush.lineTo(x + tile - 0.5, y - high * 0.45);
      } else if (end === "square") {
        brush.lineTo(x + 0.5, y);
        brush.lineTo(x + tile - 0.5, y);
      } else {
        brush.lineTo(x + 0.5, y - tile / 2);
        brush.arc(x + tile / 2, y - tile / 2, tile / 2 - 0.5, Math.PI, 0, true);
      }
      brush.lineTo(x + tile - 0.5, y - high * 1.4);
      brush.closePath();
      brush.fill();
      brush.strokeStyle = "rgba(20, 10, 6, 0.3)";
      brush.lineWidth = 1;
      brush.stroke();
    }
  }
  var lit = brush.createLinearGradient(0, top, 0, bottom);
  lit.addColorStop(0, "rgba(255, 240, 210, 0.22)");
  lit.addColorStop(0.5, "rgba(255, 240, 210, 0)");
  lit.addColorStop(1, "rgba(20, 10, 6, 0.22)");
  brush.fillStyle = lit;
  brush.fillRect(left, top, right - left, bottom - top);
}

// A wooden house on posts, with the crossed roof ends of a northern house.
// It has depth: a second row of posts behind the first and shade under the
// floor; posts with a lit side and a side in shade, each on a stone; boards
// of more than one brown, with their grain; a window set into the wall,
// with a sill; a roof of tiles in rows with a board along its eave; and the
// shade the eave throws on the wall.
function house(brush, x, base, size) {
  var n, tone;
  brush.save();
  brush.translate(x, base);
  brush.scale(size, size);
  brush.fillStyle = "rgba(60, 40, 30, 0.22)";    // its shadow on the ground
  brush.beginPath();
  brush.ellipse(0, 4, 190, 13, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "#553324";                    // the posts at the back: darker, thinner, and set in
  for (n = 0; n < 3; n++) { brush.fillRect([-96, 16, 126][n], -110, 10, 104); }
  var under = brush.createLinearGradient(0, -110, 0, 0);   // it is dark under the floor
  under.addColorStop(0, "rgba(40, 24, 16, 0.44)");
  under.addColorStop(1, "rgba(40, 24, 16, 0)");
  brush.fillStyle = under;
  brush.fillRect(-118, -110, 236, 110);
  brush.fillStyle = "#a8552f";                    // jars under the floor, each with its rim and a light on its shoulder
  brush.beginPath();
  brush.ellipse(-70, -24, 22, 26, 0, 0, 7);
  brush.ellipse(-30, -18, 16, 20, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "rgba(60, 24, 12, 0.3)";
  brush.beginPath();
  brush.ellipse(-62, -18, 13, 20, 0, 0, 7);
  brush.ellipse(-24, -13, 9, 15, 0, 0, 7);
  brush.fill();
  brush.fillStyle = "rgba(255, 220, 180, 0.4)";
  brush.beginPath();
  brush.ellipse(-80, -34, 5, 9, 0.3, 0, 7);
  brush.ellipse(-37, -26, 4, 7, 0.3, 0, 7);
  brush.fill();
  brush.fillStyle = "#6a3320";
  brush.beginPath();
  brush.ellipse(-70, -49, 12, 3.5, 0, 0, 7);
  brush.ellipse(-30, -37, 9, 3, 0, 0, 7);
  brush.fill();
  for (n = 0; n < 3; n++) {                       // the posts at the front: a lit side, a side in shade, a stone under each
    var px = [-120, -10, 106][n];
    brush.fillStyle = "#7a4a30";
    brush.fillRect(px, -110, 14, 110);
    brush.fillStyle = "#5e3824";
    brush.fillRect(px + 9, -110, 5, 110);
    brush.fillStyle = "#96623f";
    brush.fillRect(px, -110, 2.5, 110);
    brush.fillStyle = "#a59a8c";
    brush.fillRect(px - 4, -7, 22, 7);
    brush.fillStyle = "#8a8073";
    brush.fillRect(px - 4, -3, 22, 3);
  }
  for (n = 0; n < 14; n++) {                      // the wall is vertical boards: no two quite one brown
    tone = dice(n * 7 + 3) - 0.5;
    brush.fillStyle = blend("#b9774a", tone > 0 ? "#e2b07a" : "#6e4028", Math.abs(tone) * 0.5);
    brush.fillRect(-140 + n * 20, -230, 20, 124);
    brush.fillStyle = "rgba(70, 36, 20, 0.55)";   // the gap between two boards
    brush.fillRect(-140 + n * 20, -230, 2, 124);
    brush.strokeStyle = "rgba(70, 36, 20, 0.18)"; // the grain of the wood
    brush.lineWidth = 1;
    brush.beginPath();
    for (var grain = 0; grain < 2; grain++) {
      var gx = -140 + n * 20 + 6 + grain * 7 + dice(n + grain * 13) * 3;
      brush.moveTo(gx, -224 + dice(n * 3 + grain) * 30);
      brush.lineTo(gx + (dice(n + grain * 5) - 0.5) * 3, -114 - dice(n * 5 + grain) * 30);
    }
    brush.stroke();
  }
  var eave = brush.createLinearGradient(0, -230, 0, -182);   // the eaves throw a shadow on the wall, deepest under them
  eave.addColorStop(0, "rgba(40, 20, 12, 0.55)");
  eave.addColorStop(1, "rgba(40, 20, 12, 0)");
  brush.fillStyle = eave;
  brush.fillRect(-140, -230, 280, 48);
  brush.fillStyle = "#6e4028";                    // the window: a frame, the dark of the room, and the wall's own thickness in shade
  brush.fillRect(-35, -205, 70, 70);
  brush.fillStyle = "#3a211a";
  brush.fillRect(-30, -200, 60, 60);
  brush.fillStyle = "rgba(0, 0, 0, 0.34)";
  brush.fillRect(-30, -200, 60, 10);
  brush.fillRect(-30, -200, 8, 60);
  brush.fillStyle = "#8f5636";
  brush.fillRect(-30, -172, 60, 3);                 // the bars of the window
  brush.fillRect(-2, -200, 3, 60);
  brush.fillStyle = "#d8a06a";                    // its sill, and the shade under the sill
  brush.fillRect(-41, -138, 82, 6);
  brush.fillStyle = "rgba(40, 20, 12, 0.38)";
  brush.fillRect(-41, -132, 82, 3);
  for (n = -1; n <= 1; n += 2) {                  // shutters, open either side: two boards and two battens each
    var sx = n < 0 ? -54 : 38;
    brush.fillStyle = "rgba(40, 20, 12, 0.3)";    // the shade a shutter throws on the wall
    brush.fillRect(sx + 3, -200, 16, 64);
    brush.fillStyle = "#c98a5a";
    brush.fillRect(sx, -203, 16, 64);
    brush.fillStyle = "rgba(70, 36, 20, 0.5)";
    brush.fillRect(sx + 7.5, -203, 1.5, 64);
    brush.fillRect(sx, -188, 16, 2.5);
    brush.fillRect(sx, -158, 16, 2.5);
  }
  brush.fillStyle = "#8a5434";                    // the floor: a beam under the wall, dark beneath
  brush.fillRect(-146, -112, 292, 9);
  brush.fillStyle = "rgba(40, 20, 12, 0.5)";
  brush.fillRect(-146, -105, 292, 3);
  brush.fillStyle = "#c98a5a";                    // a rail along the veranda, and the shade under it
  brush.fillRect(-152, -126, 304, 5);
  for (var post = -150; post <= 150; post += 30) {
    brush.fillStyle = "#c98a5a";
    brush.fillRect(post, -126, 4, 20);
    brush.fillStyle = "rgba(40, 20, 12, 0.3)";
    brush.fillRect(post + 3, -121, 1.5, 15);
  }
  brush.fillStyle = "rgba(40, 20, 12, 0.3)";
  brush.fillRect(-152, -121, 304, 2);
  brush.fillStyle = "#5e4236";                    // a roof of tiles
  brush.beginPath();
  brush.moveTo(-180, -224);
  brush.lineTo(0, -350);
  brush.lineTo(180, -224);
  brush.closePath();
  brush.fill();
  brush.save();
  brush.clip();
  roofTiles(brush, -180, 180, -350, -224, 15, "#75503c", "round");
  brush.restore();
  brush.fillStyle = "#4a3026";                    // the board along the eave, lit on top
  brush.fillRect(-186, -228, 372, 8);
  brush.fillStyle = "rgba(255, 230, 200, 0.28)";
  brush.fillRect(-186, -228, 372, 2);
  brush.strokeStyle = "rgba(74, 44, 34, 0.8)";    // a thin brown line round it all
  brush.lineWidth = 3;
  brush.strokeRect(-140, -230, 280, 124);
  brush.beginPath();
  brush.moveTo(-180, -224);
  brush.lineTo(0, -350);
  brush.lineTo(180, -224);
  brush.stroke();
  brush.fillStyle = "#c98a5a";                    // a ladder: two rails with a side in shade, and rungs that throw shade
  brush.fillRect(60, -106, 8, 106);
  brush.fillRect(96, -106, 8, 106);
  brush.fillStyle = "rgba(70, 36, 20, 0.4)";
  brush.fillRect(65, -106, 3, 106);
  brush.fillRect(101, -106, 3, 106);
  for (var rung = 0; rung < 4; rung++) {
    brush.fillStyle = "rgba(40, 20, 12, 0.3)";
    brush.fillRect(60, -84 + rung * 24, 44, 3);
    brush.fillStyle = "#d8a06a";
    brush.fillRect(60, -90 + rung * 24, 44, 6);
  }
  brush.lineCap = "butt";
  brush.strokeStyle = "#6a3b29";
  brush.lineWidth = 9;
  brush.beginPath();                    // the kalae: two boards that cross
  brush.moveTo(-22, -330);
  brush.lineTo(30, -410);
  brush.moveTo(22, -330);
  brush.lineTo(-30, -410);
  brush.stroke();
  brush.strokeStyle = "#93603f";                  // each lit along one edge
  brush.lineWidth = 2;
  brush.beginPath();
  brush.moveTo(-25, -332);
  brush.lineTo(27, -412);
  brush.moveTo(19, -332);
  brush.lineTo(-33, -412);
  brush.stroke();
  brush.strokeStyle = "#6a3b29";                  // each board ends in a carved tip that curls outward, as a kalae's does
  brush.lineWidth = 6;
  brush.lineCap = "round";
  brush.beginPath();
  brush.moveTo(30, -410);
  brush.quadraticCurveTo(44, -424, 40, -438);
  brush.moveTo(-30, -410);
  brush.quadraticCurveTo(-44, -424, -40, -438);
  brush.stroke();
  brush.restore();
}

function palm(brush, x, base, tall) {
  var line = "rgba(55, 35, 22, 0.85)";
  brush.beginPath();                                // the trunk: a shape that leans
  brush.moveTo(x - 9, base);
  brush.quadraticCurveTo(x + 22, base - tall / 2, x + 4, base - tall);
  brush.lineTo(x + 16, base - tall);
  brush.quadraticCurveTo(x + 38, base - tall / 2, x + 10, base);
  brush.closePath();
  var bark = brush.createLinearGradient(x - 9, 0, x + 32, 0);
  bark.addColorStop(0, "#7a5a3c");
  bark.addColorStop(1, "#ad8a62");
  brush.fillStyle = bark;
  brush.fill();
  brush.strokeStyle = line;
  brush.lineWidth = 2;
  brush.lineJoin = "round";
  brush.stroke();
  brush.lineWidth = 1.2;
  for (var ring = 1; ring < 9; ring++) {            // rings up the trunk
    var u = ring / 9.5, cx = x + 4 * u + 44 * u * (1 - u), cy = base - tall * u;
    brush.beginPath();
    brush.moveTo(cx - 8, cy);
    brush.quadraticCurveTo(cx + 2, cy + 4, cx + 13, cy - 2);
    brush.stroke();
  }
  var leans = [-2.05, 2.05, -1.5, 1.5, -0.95, 0.95, -0.4, 0.4, 0];   // the fronds, the lowest first
  for (var n = 0; n < leans.length; n++) {
    var long = 108 - Math.abs(leans[n]) * 9;
    brush.save();
    brush.translate(x + 10, base - tall);
    brush.rotate(leans[n]);
    paintLeaf(brush, long, 15, leans[n] * 0.17, "#2c6846", "#86bd6c", "rgba(28, 58, 36, 0.85)");
    leafPath(brush, long, 15, leans[n] * 0.17);     // the leaflets: cuts from the rib to the edge
    brush.clip();
    brush.strokeStyle = "rgba(28, 58, 36, 0.5)";
    brush.lineWidth = 1;
    brush.beginPath();
    for (var cut = 2; cut < 12; cut++) {
      var cu = cut / 12, mid = leans[n] * 0.17 * long * 0.9 * cu * cu;
      brush.moveTo(mid, -long * cu);
      brush.lineTo(mid - 16, -long * cu - 9);
      brush.moveTo(mid, -long * cu);
      brush.lineTo(mid + 16, -long * cu - 9);
    }
    brush.stroke();
    brush.restore();
  }
  for (var nut = 0; nut < 3; nut++) {               // the coconuts, under the crown
    brush.beginPath();
    brush.arc(x + 4 + nut * 9, base - tall + 9 + (nut % 2) * 5, 6.5, 0, 7);
    brush.fillStyle = "#8a6a3c";
    brush.fill();
    brush.strokeStyle = line;
    brush.lineWidth = 1.2;
    brush.stroke();
  }
}

// a tung: the long woven flag that hangs from a bamboo pole at a festival
// With "crowned", a hong (pieces.js) stands on the top of the pole, as the
// hamsa crowns the tall tung poles of a northern temple.
function tung(brush, x, base, t, crowned) {
  if (crowned && typeof hong === "function") { hong(brush, x + 70, base - 466, 0.7); }
  brush.strokeStyle = "#8a6a4a";
  brush.lineWidth = 7;
  brush.beginPath();
  brush.moveTo(x, base);
  brush.quadraticCurveTo(x + 10, base - 300, x + 70, base - 470);
  brush.stroke();
  var colours = ["#d8423a", "#f4c542", "#3f8f7a", "#f2ead8", "#d8423a", "#f4c542"];
  // Given the second t, the cloth hangs from the top of the pole and sways in
  // the breeze as one long strip, the pole standing still (owner, 2026-10-16:
  // "the flag doesn't sway. I'd prefer the stick not to sway or barely at
  // all"): it swings from where it is tied, more toward its foot, the foot a
  // little behind the top in time, with a faint ripple down it. Every panel is
  // a stretch of the one strip, so they never come apart.
  function off(d) {                                 // how far the cloth is moved sideways at d: 0 its top, 1 its foot
    var lag = t - 0.8 * d;
    var breeze = Math.sin(lag * 1.1) + 0.5 * Math.sin(lag * 1.9 + 1.3) + 0.25 * Math.sin(lag * 3.1 + 0.6);   // comes and goes, never twice alike
    return 14 * breeze * Math.pow(d, 1.3) + 2.5 * Math.sin(d * 7 - t * 2.4) * d;
  }
  for (var part = 0; part < 6; part++) {
    brush.fillStyle = colours[part];
    if (t === undefined) { brush.fillRect(x + 56, base - 460 + part * 50, 30, 46); continue; }
    var top = base - 460 + part * 50, above = off(part * 50 / 296), below = off((part * 50 + 46) / 296);
    brush.beginPath();
    brush.moveTo(x + 56 + above, top);
    brush.lineTo(x + 86 + above, top);
    brush.lineTo(x + 86 + below, top + 46);
    brush.lineTo(x + 56 + below, top + 46);
    brush.closePath();
    brush.fill();
  }
}

// A hand closed round a handle, seen from the back, as a photograph of a hand
// on the bar of a gym machine shows it (Wikimedia Commons, CC BY 2.0; nothing
// of it is copied, only what it does): the back of the hand is a wedge that
// widens from the wrist to a ridge of knuckles just before the handle; the
// four fingers, stacked from the first at the top to the little one at the
// bottom, leave the ridge and wrap round the handle, their first joints
// crossing in front of it, so that at the grip the handle is hidden and shows
// only above and below the fist; the little finger is the shortest; and the
// thumb comes over the top from the wrist's side and lies along the first
// finger, its tip and nail past the handle. The hand is drawn pointing +x,
// the handle crossing it at GRIP_AT, and turned by "angle" as glove() is.
// The caller draws the handle with a gap where the fist is.
var GRIP_AT = 16;

function gripHand(x, y, angle) {
  var colour = SKIN, ink = inkFor(colour), line = LINE, n;
  var fingers = [[12, -8.5, 29, -7.5, 3.3, 3.0], [12, -3, 30, -2, 3.3, 3.0], [12, 2.5, 29, 3.5, 3.2, 2.9], [12, 8, 26, 9, 2.9, 2.6]];   // first to little
  var thumb = [[3, -11, 14, -12.5, 3.6, 3.2], [14, -12.5, 24, -12, 3.2, 2.7]];
  var back = [[-13, 0, 10, 0, 7.5, 11.5, 1.5]];     // the back of the hand: narrow at the wrist, wide at the knuckles
  function part(p, more, paint) {
    bone(p[0], p[1], p[2], p[3], p[4] + more, p[5] + more, p[6] === undefined ? 0.5 : p[6]);
    pen.fillStyle = paint;
    pen.fill();
  }
  pen.save();
  pen.translate(x, y);
  pen.rotate(angle);
  heavy(ink);                                       // 1. the whole hand in ink: its outline
  part(back[0], line, ink);
  for (n = 0; n < 4; n++) { part(fingers[n], line, ink); }
  part(thumb[0], line, ink);
  part(thumb[1], line, ink);
  light();
  part(back[0], 0, colour);                         // 2. the back of the hand
  for (n = 3; n >= 0; n--) {                        // 3. the fingers, the little one first, so each lies under the one above
    part(fingers[n], line * 0.55, ink);
    part(fingers[n], 0, colour);
  }
  part(thumb[0], line * 0.55, ink);                 // 4. the thumb over the first finger
  part(thumb[0], 0, colour);
  part(thumb[1], line * 0.55, ink);
  part(thumb[1], 0, colour);
  pen.strokeStyle = "rgba(150, 70, 60, 0.4)";       // the knuckles: a short curve where each finger leaves the ridge
  pen.lineWidth = 1.2 * FINE;
  pen.beginPath();
  for (n = 0; n < 4; n++) {
    pen.moveTo(10.5, fingers[n][1] - 2.2);
    pen.quadraticCurveTo(13.5, fingers[n][1], 10.5, fingers[n][1] + 2.2);
  }
  pen.stroke();
  pen.fillStyle = "rgba(255, 240, 230, 0.85)";      // the thumb's nail
  pen.beginPath();
  pen.ellipse(22.5, -12, 2.2, 1.4, -0.05, 0, 7);
  pen.fill();
  pen.restore();
}

// A paper parasol of the north, as a woman holds it: a shallow cone on a
// handle, with a pattern running round it in rings. Three kinds, each from a
// picture the owner sent, written as rules:
//   "lai"     the border patterns of Thai painting, red on cream: along the
//             hem a row of pointed petals; a ring of round rosettes between
//             two rails of dots, each a many-petalled flower with a ring and
//             a dot at its heart, a small square flower between every two; a
//             ring of diamond flowers, a lozenge with a ring of dots inside
//             and a dot at its centre, a small three-fingered leaf pointing
//             out between each pair; a vine that scrolls round in S-curves
//             with a lotus bud at every turn; a rosette at the crown.
//   "yantra"  the eight-direction yantra of the tattoo, ivory on black: rings
//             of script round a core with a spiral; eight rays, each a spike
//             that tapers to the hem with script down its length; a small
//             circle with a cross between every two rays, and a cluster of
//             dots beyond it; a rim of dots.
//   "buddha"  a Lanna cloth, black on white: a hem of close triangles; a vine
//             of kanok flames; a row of smaller triangles pointing in;
//             elephants walking round in a file, a rosette above each; a
//             rail of dots; diamond flowers; and at the crown the Buddha
//             seated on a lotus in an aureole of flame. When the parasol
//             spins, everything turns but the Buddha: he and his lotus and
//             aureole stay still.
// The parasol is held upright (tilt 0: seen from the side, a low dome with the
// rings as bands across it), or tipped down toward the viewer (tilt 1: a full
// circle), and spun (spin, in radians). parasolAt() times a show of it.
var PARASOL = {radius: 120, dome: 38, handle: 150, gold: "#e0b23a",
               kinds: {lai: {ground: "#f3e3bf", ink: "#c8452f", line: "#7a3a24"},
                       yantra: {ground: "#1e1b18", ink: "#efe3c6", line: "#0d0c0b"},
                       buddha: {ground: "#f6efe0", ink: "#262220", line: "#262220"}}};

// How far open a parasol is (0 furled to 1 open) sets the angle of its ribs
// from the handle: closed they lie 5 degrees from it, open 72. Each rib is
// as long as the open parasol's slant, so the canopy's radius and height
// are that length's sine and cosine, as parts of the open radius.
function parasolShape(open) {
  var slant = Math.sqrt(1 + Math.pow(PARASOL.dome / PARASOL.radius, 2)), wide = Math.atan2(1, PARASOL.dome / PARASOL.radius);
  var u = clamp(open === undefined ? 1 : open), angle = 0.09 + (wide - 0.09) * u * u * (3 - 2 * u);
  return {radius: slant * Math.sin(angle), dome: slant * Math.cos(angle)};
}

// The tilt, spin and openness of a parasol at second t, for a show that
// begins at "start". The shows:
//   "twirl"  (or left out) open all along: over 1.2 s it tips down toward the
//            viewer, spins three times round over the next 3.2 s (quickening,
//            then slowing to a stop), rests for 0.6 s, and over 1.2 s comes
//            back up: six seconds
//   "open"   upright, furled before the start; it opens over 1.4 s and stays open
//   "close"  upright, open before the start; it furls over 1.4 s and stays furled
//   "bloom"  furled and upright before the start: it tips down furled (1.2 s),
//            opens (1.4 s), spins three times (3.2 s), rests (0.6 s), furls
//            (1.4 s) and comes back up (1.2 s): nine seconds, ending furled
//   "spin"   it tips down toward the viewer (1.2 s), the other hand comes to
//            it (0.4 s), and it spins three times (3.2 s) and stays tipped down,
//            open, with the hand on it (5 s)
//   "fold"   tipped down and open before the start (after "spin"), the other
//            hand on it: it closes (1.4 s), snaps open (0.35 s, as if shaking
//            the rain off) and closes again (1.4 s); the hand drops (0.5 s);
//            and furled it swings from the down position to hang at her side,
//            tip to the ground behind her (1 s), never lifted: 5.6 seconds,
//            ending carried
// "busy" (0 to 1, in "fold") brings the other hand to the handle, as the hand
// that opens and closes it. A parasol with hang 1 is carried: {open: 0, hang: 1}. "kind" is "lai" (or
// left out), "yantra" or "buddha"; "colour" its paper, if not the kind's own.
// Give it as the look's parasol:
// cast("lady", {parasol: parasolAt(t, 4, "buddha", undefined, "bloom")}).
function parasolAt(t, start, kind, colour, show) {
  var d = t - start, tilt = 0, spin = 0, open = 1, hang = 0, busy = 0;
  function smooth(u) { u = clamp(u); return u * u * (3 - 2 * u); }
  if (show === "spin") {
    if (d >= 0) {
      tilt = smooth(d / 1.2);
      busy = smooth((d - 1.2) / 0.4);              // down, the other hand comes to it, and then it spins
      spin = 6 * Math.PI * smooth((d - 1.8) / 3.2);
    }
  } else if (show === "fold") {
    tilt = 1;
    busy = 1;
    if (d >= 0) {
      open = d < 1.4 ? 1 - smooth(d / 1.4) : d < 1.8 ? 0 : d < 2.15 ? smooth((d - 1.8) / 0.35) : d < 2.6 ? 1 : 1 - smooth((d - 2.6) / 1.4);
      busy = 1 - smooth((d - 4.0) / 0.5);          // the hand that worked it drops
      hang = smooth((d - 4.6) / 1.0);              // and furled, it swings from the down position to her side
      tilt = 1 - hang;
    }
  } else if (show === "open") {
    open = d < 0 ? 0 : smooth(d / 1.4);
  } else if (show === "close") {
    open = d < 0 ? 1 : 1 - smooth(d / 1.4);
  } else if (show === "bloom") {
    open = d < 0 ? 0 : d < 1.2 ? 0 : d < 2.6 ? smooth((d - 1.2) / 1.4) : d < 6.4 ? 1 : 1 - smooth((d - 6.4) / 1.4);
    if (d >= 0) {
      tilt = d < 1.2 ? smooth(d / 1.2) : d < 7.8 ? 1 : 1 - smooth((d - 7.8) / 1.2);
      spin = 6 * Math.PI * smooth((d - 2.6) / 3.2);
    }
  } else if (d >= 0) {
    tilt = d < 1.2 ? smooth(d / 1.2) : d < 5.0 ? 1 : 1 - smooth((d - 5.0) / 1.2);
    spin = 6 * Math.PI * smooth((d - 1.2) / 3.2);
  }
  return {tilt: tilt, spin: spin, open: open, hang: hang, busy: busy, kind: kind, colour: colour};
}

// The hand on the handle is the owner's picture of a Victorian woman with a
// parasol (2026-10-15): a fist closed round the handle, the back of the hand
// and the knuckles to the viewer, the thumb on top, the handle going in at
// the top of the fist and out at the bottom. (The picture's hold, the handle
// over the shoulder and the canopy behind the head, was tried the same day
// and taken out: "modify how the hand is, not the positions".)
function parasolHand(tilt, hang) {                 // where the near hand holds the handle: forward at shoulder height when upright (the forearm rises at a shallow angle to the fist), before the chest when tipped, at the side when carried
  var up = [46 - 14 * (tilt || 0), -12 + 42 * (tilt || 0)], h = hang || 0;
  return [up[0] + (16 - up[0]) * h, up[1] + (64 - up[1]) * h];
}

function parasolSwing(tilt, hang) {                // the turn of the parasol about the fist: upright held, down behind her carried, leaning back so the hanging forearm meets the fist without a sharp wrist
  return -(Math.PI - 0.9) * (hang || 0);
}

function parasolOf(given) {                        // the look's parasol as {tilt, spin, kind, colour}: true, a kind, a colour, or parasolAt()'s object
  if (typeof given === "object") { return given; }
  if (typeof given === "string") { return given.charAt(0) === "#" ? {tilt: 0, spin: 0, colour: given} : {tilt: 0, spin: 0, kind: given}; }
  return {tilt: 0, spin: 0};
}

// The canopy, its centre (the middle of the rim) at (x, y), of radius R, tipped
// toward the viewer by tilt (0 upright, 1 face on) and turned by spin. Each
// ring of the pattern is a circle of the cone seen at that tilt: an ellipse
// as wide as the ring and as tall as the tilt makes it, raised toward the
// crown by the cone's height. The rings are drawn from the hem inward, each
// band's ground painted over the far side of the band outside it, so the far
// side of the dome is hidden as it should be, and the front shows every ring.
function parasol(brush, x, y, R, tilt, spin, colour, kind, open) {
  var a = tilt * Math.PI / 2, cosA = Math.cos(a), k = 0.18 + 0.82 * Math.sin(a), shape = parasolShape(open), H = R * shape.dome;
  var paper = PARASOL.kinds[kind] || PARASOL.kinds.lai, ground = colour || paper.ground, ink = paper.ink, line = paper.line, i, s;
  var full = R;                                    // the open radius, for the finial, which does not shrink
  R = R * shape.radius;                            // furled, the rings draw in close to the handle and the dome is tall
  function ring(r, paint) {                        // the frame of the ring at r (0..1 of R): x along, y across, foreshortened
    brush.save();
    brush.translate(x, y - H * (1 - r) * cosA);
    brush.scale(1, k);
    paint(r * R);
    brush.restore();
  }
  function fillRing(r, edge) {
    ring(r, function (rr) {
      brush.beginPath();
      brush.ellipse(0, 0, rr, rr, 0, 0, 7);
      brush.fillStyle = ground;
      brush.fill();
      if (edge) {
        brush.strokeStyle = line;
        brush.lineWidth = 1.5 / k;
        brush.stroke();
      }
    });
  }
  function each(r, count, offset, motif, still) {  // "motif" is drawn at every place round the ring, x pointing outward; "still" = not turned by the spin
    ring(r, function (rr) {
      for (var j = 0; j < count; j++) {
        var th = (still ? 0 : spin) + offset + j * 2 * Math.PI / count;
        brush.save();
        brush.translate(rr * Math.cos(th), rr * Math.sin(th));
        brush.rotate(th);
        motif(j);
        brush.restore();
      }
    });
  }
  function dot(cx, cy, size, colourOf) {
    brush.fillStyle = colourOf || ink;
    brush.beginPath();
    brush.ellipse(cx, cy, size, size, 0, 0, 7);
    brush.fill();
  }
  function dots(r, count, size) {
    each(r, count, 0, function () { dot(0, 0, size); });
  }
  function circle(r, width) {                      // a line round the ring
    ring(r, function (rr) {
      brush.strokeStyle = ink;
      brush.lineWidth = width;
      brush.beginPath();
      brush.ellipse(0, 0, rr, rr, 0, 0, 7);
      brush.stroke();
    });
  }
  function script(r, count, long) {                // a ring of script: short radial strokes, by turns longer and shorter, as a line of letters reads from afar
    each(r, count, 0, function (j) {
      brush.strokeStyle = ink;
      brush.lineWidth = R * 0.008;
      brush.beginPath();
      brush.moveTo(-long * (j % 3 === 0 ? 1 : 0.6), 0);
      brush.lineTo(long * (j % 2 ? 1 : 0.7), 0);
      brush.stroke();
    });
  }
  function rosette(m) {                            // a many-petalled flower: an ink disc with gaps of the ground, a ring, a heart
    dot(0, 0, m);
    for (var p = 0; p < 10; p++) { dot(Math.cos(p * 0.628) * m * 0.8, Math.sin(p * 0.628) * m * 0.8, m * 0.17, ground); }
    dot(0, 0, m * 0.5, ground);
    dot(0, 0, m * 0.24);
  }
  function lozenge(m, w, lobes) {                  // a diamond flower: a lozenge, a ring of dots of the ground, a heart; with "lobes", a small lobe at each point
    brush.fillStyle = ink;
    brush.beginPath();
    brush.moveTo(m, 0);
    brush.lineTo(0, w);
    brush.lineTo(-m, 0);
    brush.lineTo(0, -w);
    brush.closePath();
    brush.fill();
    if (lobes) {
      for (var q = 0; q < 4; q++) { dot(Math.cos(q * 1.571) * m * 1.05, Math.sin(q * 1.571) * w * 1.05, m * 0.16); }
      brush.strokeStyle = ground;
      brush.lineWidth = m * 0.07;
      brush.beginPath();
      brush.moveTo(m * 0.7, 0);
      brush.lineTo(0, w * 0.7);
      brush.lineTo(-m * 0.7, 0);
      brush.lineTo(0, -w * 0.7);
      brush.closePath();
      brush.stroke();
    }
    for (var p = 0; p < 4; p++) { dot(Math.cos(p * 1.571) * m * 0.45, Math.sin(p * 1.571) * w * 0.45, m * 0.13, ground); }
    dot(0, 0, m * 0.3, ground);
    dot(0, 0, m * 0.14);
  }
  function petal(len, w, inner) {                  // a pointed leaf along +x, with a smaller one of the ground inside
    brush.fillStyle = ink;
    brush.beginPath();
    brush.moveTo(0, -w);
    brush.quadraticCurveTo(len * 0.7, -w * 0.9, len, 0);
    brush.quadraticCurveTo(len * 0.7, w * 0.9, 0, w);
    brush.closePath();
    brush.fill();
    if (inner) {
      brush.fillStyle = ground;
      brush.beginPath();
      brush.moveTo(len * 0.2, -w * 0.4);
      brush.quadraticCurveTo(len * 0.65, -w * 0.35, len * 0.78, 0);
      brush.quadraticCurveTo(len * 0.65, w * 0.35, len * 0.2, w * 0.4);
      brush.closePath();
      brush.fill();
    }
  }
  function triangle(len, w) {                      // a plain point along +x
    brush.fillStyle = ink;
    brush.beginPath();
    brush.moveTo(0, -w);
    brush.lineTo(len, 0);
    brush.lineTo(0, w);
    brush.closePath();
    brush.fill();
  }
  function elephant(m) {                           // walking round the ring: feet outward (+x), head the way it goes (+y)
    brush.fillStyle = ink;
    brush.beginPath();
    brush.ellipse(0, 0, m * 0.5, m * 0.85, 0, 0, 7);           // the body
    brush.fill();
    for (var leg = 0; leg < 4; leg++) {                        // four legs, two a little forward
      var along = [-0.6, -0.25, 0.2, 0.55][leg] * m;
      brush.fillRect(m * 0.25, along - m * 0.11, m * 0.75, m * 0.22);
    }
    brush.beginPath();
    brush.ellipse(m * 0.05, m * 0.95, m * 0.38, m * 0.4, 0, 0, 7);   // the head
    brush.fill();
    brush.beginPath();
    brush.ellipse(-m * 0.18, m * 0.82, m * 0.22, m * 0.26, 0, 0, 7);  // the ear
    brush.fill();
    brush.strokeStyle = ink;
    brush.lineWidth = m * 0.16;
    brush.lineCap = "round";
    brush.beginPath();                                          // the trunk, down to the ground and curling forward
    brush.moveTo(m * 0.3, m * 1.15);
    brush.quadraticCurveTo(m * 0.95, m * 1.3, m * 1.0, m * 1.55);
    brush.stroke();
    brush.strokeStyle = ground;                                 // a tusk
    brush.lineWidth = m * 0.07;
    brush.beginPath();
    brush.moveTo(m * 0.4, m * 1.05);
    brush.lineTo(m * 0.72, m * 1.25);
    brush.stroke();
    brush.fillStyle = ground;                                   // a cloth on its back, with a border
    brush.fillRect(-m * 0.42, -m * 0.4, m * 0.34, m * 0.8);
    brush.strokeStyle = ink;
    brush.lineWidth = m * 0.05;
    brush.strokeRect(-m * 0.36, -m * 0.32, m * 0.22, m * 0.64);
    dot(-m * 0.25, m * 0.85, m * 0.045, ground);                // the eye
  }
  function buddha(b) {                             // seated on a lotus in an aureole of flame, drawn upright at the crown, and never turned
    brush.strokeStyle = ink;
    brush.lineWidth = b * 0.07;
    brush.lineJoin = "round";
    brush.beginPath();                                          // the aureole: a pointed arch
    brush.moveTo(-b * 0.95, b * 0.7);
    brush.quadraticCurveTo(-b * 1.05, -b * 0.6, 0, -b * 1.2);
    brush.quadraticCurveTo(b * 1.05, -b * 0.6, b * 0.95, b * 0.7);
    brush.stroke();
    for (var f = 0; f < 9; f++) {                               // flames along it, pointing out
      var u = -1 + f / 4, ax = Math.sin(u * 1.3) * b * 1.0, ay = -b * 1.2 + (1 - Math.cos(u * 1.3)) * b * 1.9;
      brush.save();
      brush.translate(ax, ay);
      brush.rotate(Math.atan2(ay + b * 0.35, ax));
      petal(b * 0.22, b * 0.08, false);
      brush.restore();
    }
    for (var p = -2; p <= 2; p++) {                             // the lotus he sits on
      brush.save();
      brush.translate(p * b * 0.3, b * 0.92);
      brush.rotate(-Math.PI / 2);
      petal(b * 0.22, b * 0.12, true);
      brush.restore();
    }
    brush.fillStyle = ink;
    brush.beginPath();                                          // the folded legs
    brush.ellipse(0, b * 0.62, b * 0.72, b * 0.2, 0, 0, 7);
    brush.fill();
    brush.beginPath();                                          // the body, the shoulders round
    brush.moveTo(-b * 0.5, b * 0.62);
    brush.quadraticCurveTo(-b * 0.5, -b * 0.15, -b * 0.2, -b * 0.18);
    brush.lineTo(b * 0.2, -b * 0.18);
    brush.quadraticCurveTo(b * 0.5, -b * 0.15, b * 0.5, b * 0.62);
    brush.closePath();
    brush.fill();
    brush.fillRect(-b * 0.08, -b * 0.28, b * 0.16, b * 0.14);  // the neck
    brush.beginPath();                                          // the head
    brush.ellipse(0, -b * 0.46, b * 0.2, b * 0.23, 0, 0, 7);
    brush.fill();
    brush.save();                                               // the flame of the ushnisha
    brush.translate(0, -b * 0.66);
    brush.rotate(-Math.PI / 2);
    petal(b * 0.3, b * 0.07, false);
    brush.restore();
  }
  brush.fillStyle = ground;                        // the cone itself, from the crown to the rim's two sides: furled, the rings alone would leave gaps
  brush.beginPath();
  brush.moveTo(x - R, y);
  brush.lineTo(x, y - H * cosA);
  brush.lineTo(x + R, y);
  brush.closePath();
  brush.fill();
  brush.strokeStyle = line;
  brush.lineWidth = 1.5;
  brush.stroke();
  brush.save();                                    // every ring is kept inside the cone and its rim: a ray or an elephant on the far side would reach above the dome
  brush.beginPath();
  brush.moveTo(x - R, y);
  brush.lineTo(x, y - H * cosA);
  brush.lineTo(x + R, y);
  brush.closePath();
  brush.moveTo(x + R, y);                          // its own subpath, and exactly one turn: an arc past a turn closes across the disc and cuts a wedge out
  brush.ellipse(x, y, R, Math.max(R * k, 0.01), 0, 0, 2 * Math.PI);
  brush.clip();
  fillRing(1, true);
  if (kind === "yantra") {
    dots(0.955, 40, R * 0.012);                     // a rim of dots
    fillRing(0.92);
    each(0.30, 8, 0, function () {                 // the eight rays: a spike to the hem, script down its length
      triangle(R * 0.62, R * 0.055);
      brush.strokeStyle = ground;
      brush.lineWidth = R * 0.008;
      brush.beginPath();
      for (var q = 1; q < 11; q++) {
        var w = R * 0.04 * (1 - q / 11) * (q % 2 ? 1 : 0.6);
        brush.moveTo(R * 0.055 * q, -w);
        brush.lineTo(R * 0.055 * q, w);
      }
      brush.stroke();
    });
    each(0.64, 8, Math.PI / 8, function () {       // a small circle with a cross between every two rays
      brush.strokeStyle = ink;
      brush.lineWidth = R * 0.012;
      brush.beginPath();
      brush.ellipse(0, 0, R * 0.045, R * 0.045, 0, 0, 7);
      brush.moveTo(-R * 0.045, 0);
      brush.lineTo(R * 0.045, 0);
      brush.moveTo(0, -R * 0.045);
      brush.lineTo(0, R * 0.045);
      brush.stroke();
    });
    each(0.80, 8, Math.PI / 8, function () {       // a cluster of dots beyond it
      dot(0, 0, R * 0.014);
      dot(-R * 0.03, -R * 0.03, R * 0.011);
      dot(-R * 0.03, R * 0.03, R * 0.011);
    });
    fillRing(0.31);
    circle(0.30, R * 0.01);                        // rings of script round the core
    script(0.265, 48, R * 0.028);
    circle(0.23, R * 0.01);
    script(0.195, 36, R * 0.026);
    circle(0.16, R * 0.01);
    script(0.13, 24, R * 0.022);
    circle(0.10, R * 0.01);
    ring(0, function () {                          // the core: a spiral that rises to a point, the unalome
      brush.strokeStyle = ink;
      brush.lineWidth = R * 0.012;
      brush.beginPath();
      for (var q = 0; q <= 40; q++) {
        var u = q / 40, th = spin + u * 5 * Math.PI, rr = R * 0.07 * (1 - u);
        if (q === 0) { brush.moveTo(Math.cos(th) * rr, Math.sin(th) * rr); } else { brush.lineTo(Math.cos(th) * rr, Math.sin(th) * rr); }
      }
      brush.stroke();
    });
  } else if (kind === "buddha") {
    each(0.955, 48, 0, function () { triangle(R * 0.06, R * 0.028); });   // the hem of close triangles
    fillRing(0.90);
    each(0.84, 12, 0, function (j) {               // the vine of kanok flames: a curled flame and a leaf, by turns
      brush.rotate(Math.PI / 2 + (j % 2 ? 0.55 : -0.55));
      petal(R * 0.08, R * 0.03, true);
      brush.rotate(j % 2 ? -1.1 : 1.1);
      petal(R * 0.045, R * 0.016, false);
    });
    fillRing(0.775);
    each(0.77, 36, 0, function () { brush.rotate(Math.PI); triangle(R * 0.05, R * 0.02); });   // smaller triangles pointing in
    each(0.70, 8, Math.PI / 8, function () { rosette(R * 0.035); });     // a rosette above each elephant
    each(0.56, 8, 0, function () { elephant(R * 0.075); });              // the elephants, walking round
    fillRing(0.455);
    dots(0.43, 28, R * 0.011);
    each(0.33, 6, 0, function () { lozenge(R * 0.075, R * 0.075, true); });   // the diamond flowers
    fillRing(0.245);
    ring(0, function () { buddha(R * 0.2); });     // the Buddha at the crown, still
  } else {
    each(0.955, 36, 0, function () { petal(R * 0.075, R * 0.028, true); });   // the hem of petals
    fillRing(0.895);
    dots(0.87, 48, R * 0.011);                      // a rail of dots
    each(0.775, 20, 0, function (j) {              // rosettes, and a small square flower between
      if (j % 2 === 0) { rosette(R * 0.068); } else { brush.rotate(Math.PI / 4); lozenge(R * 0.034, R * 0.034); }
    });
    fillRing(0.70);
    dots(0.675, 36, R * 0.011);
    each(0.555, 20, 0, function (j) {              // diamond flowers, and a three-fingered leaf pointing out between
      if (j % 2 === 0) { lozenge(R * 0.082, R * 0.062); return; }
      for (var f = -1; f <= 1; f++) {
        brush.save();
        brush.rotate(f * 0.45);
        petal(R * 0.05, R * 0.012, false);
        brush.restore();
      }
    });
    fillRing(0.46);
    ring(0.36, function (rr) {                     // the vine: S-curves round the ring, a bud at every turn
      brush.strokeStyle = ink;
      brush.lineWidth = R * 0.016;
      brush.lineCap = "round";
      brush.beginPath();
      for (i = 0; i < 8; i++) {
        var t0 = spin + i * Math.PI / 4, t1 = t0 + Math.PI / 4, tm = t0 + Math.PI / 8, bulge = (i % 2 ? 1.28 : 0.74);
        brush.moveTo(rr * Math.cos(t0), rr * Math.sin(t0));
        brush.quadraticCurveTo(rr * bulge * Math.cos(tm), rr * bulge * Math.sin(tm), rr * Math.cos(t1), rr * Math.sin(t1));
      }
      brush.stroke();
    });
    each(0.36, 8, 0, function (j) {                // the buds lean along the vine, pointing the way it scrolls
      brush.rotate(Math.PI / 2 + (j % 2 ? 0.5 : -0.5));
      petal(R * 0.062, R * 0.022, true);
    });
    fillRing(0.255);
    dots(0.23, 20, R * 0.011);
    ring(0, function () { rosette(R * 0.15); });   // the rosette at the crown
  }
  brush.restore();                                 // the clip to the outline
  brush.save();                                    // the ribs, faint through the paper, from the crown to the hem
  brush.strokeStyle = kind === "yantra" ? "rgba(255, 240, 210, 0.2)" : "rgba(90, 60, 30, 0.22)";
  brush.lineWidth = 1;
  brush.beginPath();
  for (i = 0; i < 16; i++) {
    s = spin + i * Math.PI / 8;
    brush.moveTo(x, y - H * cosA);
    brush.lineTo(x + R * Math.cos(s), y + R * k * Math.sin(s));
  }
  brush.stroke();
  brush.restore();
  brush.fillStyle = PARASOL.gold;                  // the finial at the crown: a gold knob, and a red point that stands up when upright
  brush.beginPath();
  brush.ellipse(x, y - H * cosA, full * 0.035, full * 0.035 * (0.5 + 0.5 * k), 0, 0, 7);
  brush.fill();
  brush.fillStyle = "#c8452f";
  brush.beginPath();
  brush.moveTo(x - full * 0.02, y - H * cosA);
  brush.lineTo(x, y - H * cosA - full * 0.09 * cosA);
  brush.lineTo(x + full * 0.02, y - H * cosA);
  brush.closePath();
  brush.fill();
}

// A yak, the giant that guards a temple gate, as the painted statues of a
// Bangkok temple stand: a green giant facing straight out, both hands clasped
// on a club held upright before him, its foot on the plinth between his feet.
// What such a statue does, as rules: the crown is a tall gold spire of tiers,
// each narrower than the one under it, rising from a bell on a band above the
// brow, half again the height of the face; gold flames flare up and out behind
// each ear; the eyes are round and white and bulge, with a blue rim and a thick
// curved brow over each; the mouth runs the width of the face, a row of white
// teeth between pink lips, and a fang rises from each corner; a gold collar of
// mosaic lies over the shoulders and ends in points; the chest is gold armour in
// a lattice over the green; a band at each upper arm and a stack of bracelets at
// each wrist; a jewelled sash hangs before the hips to the knees; only the face,
// neck, arms, hands and shins show green. They stand in pairs, one each side of
// the gate.
function yak(brush, x, base, facing) {
  var green = "#2f7f4e", gold = "#e0b23a", gilt = "#a8781e", blue = "#3a5fae", red = "#c8452f", white = "#ffffff", s, i, w, top;
  brush.save();
  brush.translate(x, base);
  brush.scale(facing, 1);
  brush.lineCap = "round";
  brush.fillStyle = "#cfc6b4";                     // the plinth
  brush.fillRect(-28, -28, 56, 28);
  brush.fillStyle = "#b8ae9a";
  brush.fillRect(-28, -4, 56, 4);
  brush.fillStyle = green;                         // the shins, apart, with gold anklets
  brush.fillRect(-19, -64, 14, 36);
  brush.fillRect(5, -64, 14, 36);
  brush.fillStyle = gold;
  brush.fillRect(-20, -38, 16, 5);
  brush.fillRect(4, -38, 16, 5);
  brush.fillStyle = gold;                          // the hips: a jewelled sash over the thighs,
  brush.beginPath();
  brush.moveTo(-21, -78);
  brush.lineTo(21, -78);
  brush.lineTo(19, -56);
  brush.lineTo(12, -50);
  brush.lineTo(0, -54);
  brush.lineTo(-12, -50);
  brush.lineTo(-19, -56);
  brush.closePath();
  brush.fill();
  brush.fillStyle = blue;                          // a blue panel down its middle, to a point
  brush.beginPath();
  brush.moveTo(-7, -76);
  brush.lineTo(7, -76);
  brush.lineTo(6, -52);
  brush.lineTo(0, -46);
  brush.lineTo(-6, -52);
  brush.closePath();
  brush.fill();
  brush.fillStyle = gold;                          // the chest: gold armour in a lattice
  brush.fillRect(-21, -114, 42, 38);
  brush.strokeStyle = gilt;
  brush.lineWidth = 1;
  brush.save();
  brush.beginPath();
  brush.rect(-21, -114, 42, 38);
  brush.clip();
  brush.beginPath();
  for (i = -8; i <= 8; i++) {
    brush.moveTo(i * 7 - 40, -114);
    brush.lineTo(i * 7, -74);
    brush.moveTo(i * 7 + 40, -114);
    brush.lineTo(i * 7, -74);
  }
  brush.stroke();
  brush.restore();
  brush.fillStyle = red;                           // the belt, with a jewel
  brush.fillRect(-21, -82, 42, 6);
  brush.fillStyle = gold;
  brush.fillRect(-3, -83, 6, 8);
  brush.fillStyle = green;                         // the neck
  brush.fillRect(-9, -124, 18, 12);
  brush.fillStyle = gold;                          // the collar of mosaic over the shoulders, ending in points
  brush.beginPath();
  brush.moveTo(-36, -100);
  brush.lineTo(-26, -118);
  brush.lineTo(26, -118);
  brush.lineTo(36, -100);
  brush.lineTo(28, -100);
  brush.lineTo(14, -106);
  brush.lineTo(0, -98);
  brush.lineTo(-14, -106);
  brush.lineTo(-28, -100);
  brush.closePath();
  brush.fill();
  brush.strokeStyle = gilt;
  brush.lineWidth = 1.2;
  brush.stroke();
  brush.strokeStyle = gold;                        // the club, upright before him: a gold shaft with red bands, a knob on top
  brush.lineWidth = 7;
  brush.beginPath();
  brush.moveTo(0, -104);
  brush.lineTo(0, -28);
  brush.stroke();
  brush.strokeStyle = red;
  brush.lineWidth = 7;
  brush.lineCap = "butt";
  brush.beginPath();
  for (i = 0; i < 4; i++) {
    brush.moveTo(0, -98 + i * 18);
    brush.lineTo(0, -95 + i * 18);
  }
  brush.stroke();
  brush.lineCap = "round";
  brush.fillStyle = gold;
  brush.beginPath();
  brush.ellipse(0, -108, 5, 6, 0, 0, 7);
  brush.fill();
  brush.fillStyle = red;
  brush.beginPath();
  brush.ellipse(0, -109, 2, 2.5, 0, 0, 7);
  brush.fill();
  for (s = -1; s <= 1; s += 2) {                   // the arms: down and out to the elbow, then in across the belly to the club
    brush.strokeStyle = green;
    brush.lineWidth = 11;
    brush.beginPath();
    brush.moveTo(s * 22, -108);
    brush.lineTo(s * 31, -86);
    brush.lineTo(s * 4, -84 + s * 5);
    brush.stroke();
    brush.strokeStyle = gold;                      // a band at the upper arm, bracelets stacked at the wrist
    brush.lineWidth = 4;
    brush.lineCap = "butt";
    brush.beginPath();
    brush.moveTo(s * 32, -100);
    brush.lineTo(s * 22, -94);
    brush.stroke();
    brush.lineWidth = 12;
    brush.beginPath();
    brush.moveTo(s * 24, -86 + s * 1);
    brush.lineTo(s * 14, -85 + s * 3);
    brush.stroke();
    brush.strokeStyle = gilt;
    brush.lineWidth = 1;
    brush.beginPath();
    for (i = 1; i < 4; i++) {
      brush.moveTo(s * (24 - i * 2.5), -92 + s * 1.5);
      brush.lineTo(s * (24 - i * 2.5), -80 + s * 1.5);
    }
    brush.stroke();
    brush.lineCap = "round";
    brush.fillStyle = green;                       // the hand, closed round the club
    brush.beginPath();
    brush.ellipse(s * 2, -84 + s * 5, 7, 5.5, 0, 0, 7);
    brush.fill();
    brush.strokeStyle = "#1f5a36";
    brush.lineWidth = 0.8;
    brush.beginPath();
    for (i = 0; i < 3; i++) {
      brush.moveTo(s * 2 - 4 + i * 3.5, -88 + s * 5);
      brush.lineTo(s * 2 - 4 + i * 3.5, -80 + s * 5);
    }
    brush.stroke();
  }
  for (s = -1; s <= 1; s += 2) {                   // gold flames flaring up and out behind each ear
    brush.fillStyle = gold;
    brush.beginPath();
    brush.moveTo(s * 15, -152);
    brush.quadraticCurveTo(s * 25, -158, s * 29, -178);
    brush.quadraticCurveTo(s * 31, -150, s * 27, -127);
    brush.lineTo(s * 15, -132);
    brush.closePath();
    brush.fill();
    brush.strokeStyle = gilt;
    brush.lineWidth = 1;
    brush.stroke();
  }
  brush.fillStyle = green;                         // the head: a broad face with a square jaw
  brush.beginPath();
  brush.ellipse(0, -140, 19, 20, 0, 0, 7);
  brush.fill();
  brush.fillRect(-15, -134, 30, 12);
  brush.fillStyle = blue;                          // a blue mask across the eyes, edged in gold
  brush.beginPath();
  brush.ellipse(0, -141, 17.5, 7.5, 0, 0, 7);
  brush.fill();
  brush.strokeStyle = gold;
  brush.lineWidth = 1;
  brush.stroke();
  brush.strokeStyle = gold;                        // thick curved brows
  brush.lineWidth = 3;
  brush.beginPath();
  brush.moveTo(-16, -146);
  brush.quadraticCurveTo(-8, -156, -1, -148);
  brush.moveTo(16, -146);
  brush.quadraticCurveTo(8, -156, 1, -148);
  brush.stroke();
  brush.fillStyle = white;                         // round white eyes that bulge, rimmed in blue
  brush.beginPath();
  brush.ellipse(-8, -141, 6, 6, 0, 0, 7);
  brush.ellipse(8, -141, 6, 6, 0, 0, 7);
  brush.fill();
  brush.strokeStyle = blue;
  brush.lineWidth = 1.6;
  brush.beginPath();
  brush.ellipse(-8, -141, 6, 6, 0, 0, 7);
  brush.stroke();
  brush.beginPath();
  brush.ellipse(8, -141, 6, 6, 0, 0, 7);
  brush.stroke();
  brush.fillStyle = "#1a1a1a";
  brush.beginPath();
  brush.ellipse(-8, -141, 2.6, 2.6, 0, 0, 7);
  brush.ellipse(8, -141, 2.6, 2.6, 0, 0, 7);
  brush.fill();
  brush.fillStyle = blue;                          // a broad flat nose
  brush.beginPath();
  brush.ellipse(0, -133, 4.5, 2.5, 0, 0, 7);
  brush.fill();
  brush.fillStyle = white;                         // the mouth across the width of the face: a row of teeth between pink lips
  brush.fillRect(-14, -129, 28, 7);
  brush.strokeStyle = "#555555";
  brush.lineWidth = 0.8;
  brush.beginPath();
  for (i = -3; i <= 3; i++) {
    brush.moveTo(i * 3.5, -129);
    brush.lineTo(i * 3.5, -122);
  }
  brush.moveTo(-14, -125.5);
  brush.lineTo(14, -125.5);
  brush.stroke();
  brush.strokeStyle = "#e58aa0";
  brush.lineWidth = 2;
  brush.strokeRect(-14, -129, 28, 7);
  brush.fillStyle = white;                         // a fang rising from each corner
  brush.beginPath();
  brush.moveTo(-15, -124);
  brush.lineTo(-12, -138);
  brush.lineTo(-9, -126);
  brush.moveTo(15, -124);
  brush.lineTo(12, -138);
  brush.lineTo(9, -126);
  brush.fill();
  brush.fillStyle = gold;                          // the crown: a band above the brow, a bell with a jewel, and tiers to a spire
  brush.fillRect(-22, -162, 44, 7);
  brush.beginPath();
  brush.moveTo(-21, -162);
  brush.lineTo(21, -162);
  brush.lineTo(13, -180);
  brush.lineTo(-13, -180);
  brush.closePath();
  brush.fill();
  brush.fillStyle = red;
  brush.beginPath();
  brush.ellipse(0, -171, 3, 4, 0, 0, 7);
  brush.fill();
  for (i = 0; i < 5; i++) {
    w = 12 - i * 2.2;
    top = -180 - (i + 1) * 8;
    brush.fillStyle = gold;
    brush.beginPath();
    brush.moveTo(-w - 1, top + 8);
    brush.lineTo(w + 1, top + 8);
    brush.lineTo(w, top);
    brush.lineTo(-w, top);
    brush.closePath();
    brush.fill();
    brush.fillStyle = gilt;
    brush.fillRect(-w - 2.5, top + 7, 2 * w + 5, 1.6);
  }
  brush.fillStyle = gold;
  brush.beginPath();
  brush.moveTo(-2.5, -220);
  brush.lineTo(0, -232);
  brush.lineTo(2.5, -220);
  brush.closePath();
  brush.fill();
  brush.restore();
}

// A temple hall with three roofs, a white chedi beside it, a gilded one
// behind, and two guardians at its gate. It has depth: roofs that sweep, of
// glazed tiles in rows, with a border of green and a line of yellow along
// each slope; a board of gold along each slope, toothed, with a horn at the
// top and one at each lower end; the shade each roof throws on what is
// under it; four pillars before the white wall; a door set into it under a
// gold arch, with studs; a window each side; a foot of stone and steps; and
// the two chedis are round: each is in shade down one side.
function temple(brush, x, base) {
  var i, n, roofs = [[210, 220, "#c8452f"], [160, 290, "#d9573a"], [110, 350, "#c8452f"]], gold = "#e0b23a", shade = "rgba(90, 70, 50, 0.28)";
  function slope(w, low, top) {                     // one roof: its two slopes sag a little, as a temple's do
    brush.beginPath();
    brush.moveTo(x - w, low);
    brush.quadraticCurveTo(x - w * 0.42, low - 46, x, top);
    brush.quadraticCurveTo(x + w * 0.42, low - 46, x + w, low);
    brush.closePath();
  }
  function reach(w, low, top, y) {                  // how far to each side the roof reaches at height y
    var a = 0, b = 1;
    for (var k = 0; k < 14; k++) {
      var t = (a + b) / 2, at = (1 - t) * (1 - t) * low + 2 * (1 - t) * t * (low - 46) + t * t * top;
      if (at > y) { a = t; } else { b = t; }
    }
    return (1 - a) * (1 - a) * w + 2 * (1 - a) * a * w * 0.42;
  }
  brush.fillStyle = "#f6efe0";                    // the wall, and its side in shade
  brush.fillRect(x - 170, base - 220, 340, 220);
  var side = brush.createLinearGradient(x - 170, 0, x + 170, 0);
  side.addColorStop(0, "rgba(120, 100, 80, 0)");
  side.addColorStop(0.62, "rgba(120, 100, 80, 0)");
  side.addColorStop(1, "rgba(120, 100, 80, 0.26)");
  brush.fillStyle = side;
  brush.fillRect(x - 170, base - 220, 340, 220);
  var eave = brush.createLinearGradient(0, base - 220, 0, base - 160);   // the lowest roof throws its shade on the wall
  eave.addColorStop(0, "rgba(70, 50, 40, 0.42)");
  eave.addColorStop(1, "rgba(70, 50, 40, 0)");
  brush.fillStyle = eave;
  brush.fillRect(x - 170, base - 220, 340, 60);
  for (n = -1; n <= 1; n += 2) {                  // a window each side: a gold frame with a pointed top, red shutters, and the wall's thickness in shade
    var wx = x + n * 108;
    brush.fillStyle = gold;
    brush.beginPath();
    brush.moveTo(wx - 21, base - 66);
    brush.lineTo(wx - 21, base - 142);
    brush.lineTo(wx, base - 172);
    brush.lineTo(wx + 21, base - 142);
    brush.lineTo(wx + 21, base - 66);
    brush.closePath();
    brush.fill();
    brush.beginPath();
    brush.moveTo(wx - 15, base - 72);
    brush.lineTo(wx - 15, base - 140);
    brush.lineTo(wx, base - 162);
    brush.lineTo(wx + 15, base - 140);
    brush.lineTo(wx + 15, base - 72);
    brush.closePath();
    brush.fillStyle = "#7a2f25";
    brush.fill();
    brush.save();
    brush.clip();
    brush.fillStyle = "rgba(0, 0, 0, 0.32)";
    brush.fillRect(wx - 15, base - 164, 30, 32);
    brush.fillRect(wx - 15, base - 164, 6, 94);
    brush.restore();
    brush.fillStyle = gold;
    brush.fillRect(wx - 1, base - 140, 2, 68);
    brush.fillStyle = "#e4dccb";                  // its sill
    brush.fillRect(wx - 25, base - 66, 50, 6);
    brush.fillStyle = shade;
    brush.fillRect(wx - 25, base - 60, 50, 3);
  }
  brush.fillStyle = gold;                         // the door: a gold arch, and the door itself set back in it
  brush.beginPath();
  brush.moveTo(x - 48, base - 16);
  brush.lineTo(x - 48, base - 150);
  brush.quadraticCurveTo(x - 46, base - 188, x, base - 208);
  brush.quadraticCurveTo(x + 46, base - 188, x + 48, base - 150);
  brush.lineTo(x + 48, base - 16);
  brush.closePath();
  brush.fill();
  brush.beginPath();
  brush.moveTo(x - 39, base - 16);
  brush.lineTo(x - 39, base - 148);
  brush.quadraticCurveTo(x - 37, base - 178, x, base - 194);
  brush.quadraticCurveTo(x + 37, base - 178, x + 39, base - 148);
  brush.lineTo(x + 39, base - 16);
  brush.closePath();
  brush.fillStyle = "#7a2f25";
  brush.fill();
  brush.save();
  brush.clip();
  brush.fillStyle = "rgba(0, 0, 0, 0.34)";        // the arch is deep: its top and one side are in shade
  brush.fillRect(x - 39, base - 196, 78, 34);
  brush.fillRect(x - 39, base - 196, 9, 180);
  brush.restore();
  brush.fillStyle = "rgba(40, 12, 8, 0.7)";       // where the two leaves of the door meet
  brush.fillRect(x - 1, base - 162, 2, 146);
  brush.fillStyle = gold;                         // studs of gold on each leaf
  for (n = 0; n < 8; n++) {
    brush.beginPath();
    brush.arc(x + (n % 2 ? 18 : -18), base - 138 + Math.floor(n / 2) * 34, 3.4, 0, 7);
    brush.fill();
  }
  brush.fillStyle = "#e4dccb";                    // the foot of the wall: stone, lit on top and in shade below
  brush.fillRect(x - 178, base - 16, 356, 16);
  brush.fillStyle = "#cfc5b2";
  brush.fillRect(x - 178, base - 7, 356, 7);
  brush.fillStyle = "#f1eadb";                    // two steps before the door
  brush.fillRect(x - 58, base - 16, 116, 8);
  brush.fillRect(x - 70, base - 8, 140, 8);
  brush.fillStyle = "#c9bfac";
  brush.fillRect(x - 58, base - 11, 116, 3);
  brush.fillRect(x - 70, base - 3, 140, 3);
  for (n = 0; n < 4; n++) {                       // four pillars before the wall: each lit down one side and in shade down the other, with gold at its head
    var px = x + [-166, -68, 52, 150][n];
    brush.fillStyle = shade;                      // the shade a pillar throws on the wall
    brush.fillRect(px + 16, base - 214, 7, 198);
    brush.fillStyle = "#fbf7ee";
    brush.fillRect(px, base - 216, 16, 200);
    brush.fillStyle = "rgba(120, 100, 80, 0.3)";
    brush.fillRect(px + 10, base - 216, 6, 200);
    brush.fillStyle = gold;
    brush.fillRect(px - 3, base - 222, 22, 12);
    brush.fillStyle = "#b8862a";
    brush.fillRect(px - 3, base - 213, 22, 3);
    brush.fillStyle = "#e4dccb";
    brush.fillRect(px - 3, base - 26, 22, 10);
  }
  for (i = 0; i < 3; i++) {                       // the three roofs, the lowest first
    var w = roofs[i][0], low = base - roofs[i][1] + 6, top = base - roofs[i][1] - 120, red = roofs[i][2];
    slope(w, low, top);
    brush.fillStyle = red;
    brush.fill();
    brush.save();
    brush.clip();
    roofTiles(brush, x - w, x + w, top, low, 11, function (tx, ty) {
      var inside = reach(w, low, top, ty) - Math.abs(tx - x);     // how far in from the slope this tile is
      return inside < 18 ? "#2f6a4a" : inside < 24 ? "#e8c23a" : red;
    }, "square");
    if (i < 2) {                                  // the roof above throws its shade on this one
      var over = base - roofs[i + 1][1] + 6, cast = brush.createLinearGradient(0, over, 0, over + 30);
      cast.addColorStop(0, "rgba(30, 12, 8, 0.5)");
      cast.addColorStop(1, "rgba(30, 12, 8, 0)");
      brush.fillStyle = cast;
      brush.fillRect(x - roofs[i + 1][0] - 6, over, roofs[i + 1][0] * 2 + 12, 30);
    }
    brush.restore();
    brush.fillStyle = "#8f2a1e";                  // the board along the eave, with a line of gold on it
    brush.fillRect(x - w - 2, low - 3, w * 2 + 4, 8);
    brush.fillStyle = gold;
    brush.fillRect(x - w - 2, low - 3, w * 2 + 4, 3);
    for (n = -1; n <= 1; n += 2) {                // down each slope: teeth of gold, the board they stand on, and a horn at its lower end
      brush.fillStyle = gold;
      for (var k = 1; k < 9; k++) {
        var t = k / 9.5, tx = (1 - t) * (1 - t) * w + 2 * (1 - t) * t * w * 0.42, ty = (1 - t) * (1 - t) * low + 2 * (1 - t) * t * (low - 46) + t * t * top;
        var ax = -2 * (1 - t) * w + 2 * (1 - 2 * t) * w * 0.42, ay = -2 * (1 - t) * low + 2 * (1 - 2 * t) * (low - 46) + 2 * t * top;
        var far = Math.sqrt(ax * ax + ay * ay) || 1, ux = ax / far, uy = ay / far;   // the way up the slope, on the right-hand side
        brush.beginPath();
        brush.moveTo(x + n * (tx - ux * 6), ty - uy * 6);
        brush.lineTo(x + n * (tx + ux * 4 - uy * 13), ty + uy * 4 + ux * 13 - 3);
        brush.lineTo(x + n * (tx + ux * 6), ty + uy * 6);
        brush.closePath();
        brush.fill();
      }
      brush.beginPath();
      brush.moveTo(x + n * (w - 8), low + 3);
      brush.quadraticCurveTo(x + n * (w + 18), low + 3, x + n * (w + 24), low - 22);
      brush.quadraticCurveTo(x + n * (w + 8), low - 8, x + n * (w - 6), low - 5);
      brush.closePath();
      brush.fill();
    }
    brush.lineJoin = "round";
    brush.beginPath();                            // the board of gold along the two slopes, and a darker line inside it
    brush.moveTo(x - w, low);
    brush.quadraticCurveTo(x - w * 0.42, low - 46, x, top);
    brush.quadraticCurveTo(x + w * 0.42, low - 46, x + w, low);
    brush.strokeStyle = gold;
    brush.lineWidth = 7;
    brush.stroke();
    brush.strokeStyle = "#b8862a";
    brush.lineWidth = 1.6;
    brush.stroke();
  }
  brush.fillStyle = gold;                         // the horn at the top of all: a cho fa
  brush.beginPath();
  brush.moveTo(x - 6, base - 464);
  brush.quadraticCurveTo(x - 9, base - 500, x + 13, base - 524);
  brush.quadraticCurveTo(x + 2, base - 496, x + 6, base - 464);
  brush.closePath();
  brush.fill();
  function round(left, right, top, bottom) {      // what is round is lit down one side and in shade down the other
    var turn = brush.createLinearGradient(left, 0, right, 0);
    turn.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    turn.addColorStop(0.35, "rgba(255, 255, 255, 0)");
    turn.addColorStop(0.6, "rgba(70, 50, 30, 0)");
    turn.addColorStop(1, "rgba(70, 50, 30, 0.34)");
    brush.fillStyle = turn;
    brush.fillRect(left, top, right - left, bottom - top);
  }
  brush.fillStyle = "#e4dccb";                    // a chedi: on two steps of stone,
  brush.fillRect(x - 344, base - 12, 128, 12);
  brush.fillRect(x - 338, base - 24, 116, 12);
  brush.fillStyle = "#c9bfac";
  brush.fillRect(x - 344, base - 3, 128, 3);
  brush.fillRect(x - 338, base - 15, 116, 3);
  brush.beginPath();                              // a white bell,
  brush.moveTo(x - 330, base - 24);
  brush.quadraticCurveTo(x - 330, base - 176, x - 300, base - 232);
  brush.lineTo(x - 260, base - 232);
  brush.quadraticCurveTo(x - 230, base - 176, x - 230, base - 24);
  brush.closePath();
  brush.fillStyle = "#f6efe0";
  brush.fill();
  brush.save();
  brush.clip();
  round(x - 330, x - 230, base - 232, base - 24);
  brush.strokeStyle = "rgba(120, 100, 80, 0.4)";  // with two rings round it
  brush.lineWidth = 3;
  brush.beginPath();
  brush.ellipse(x - 280, base - 66, 52, 7, 0, 0, Math.PI);
  brush.stroke();
  brush.beginPath();
  brush.ellipse(x - 280, base - 206, 34, 5, 0, 0, Math.PI);
  brush.stroke();
  brush.restore();
  brush.beginPath();                              // and a gold spire with rings
  brush.moveTo(x - 302, base - 230);
  brush.lineTo(x - 280, base - 400);
  brush.lineTo(x - 258, base - 230);
  brush.closePath();
  brush.fillStyle = gold;
  brush.fill();
  brush.save();
  brush.clip();
  round(x - 302, x - 258, base - 400, base - 230);
  brush.restore();
  for (var ringS = 0; ringS < 5; ringS++) {
    brush.fillStyle = gold;
    brush.fillRect(x - 306 + ringS * 4, base - 250 - ringS * 28, 52 - ringS * 8, 4);
    brush.fillStyle = "rgba(90, 60, 10, 0.4)";    // each ring in shade beneath
    brush.fillRect(x - 306 + ringS * 4, base - 246 - ringS * 28, 52 - ringS * 8, 2);
  }
  yak(brush, x - 205, base, 1);                   // the guardians of the gate
  yak(brush, x + 205, base, -1);
  brush.fillStyle = "#e4dccb";                    // a gilded chedi behind: a foot of stone,
  brush.fillRect(x + 252, base - 12, 156, 12);
  brush.fillStyle = "#c9bfac";
  brush.fillRect(x + 252, base - 3, 156, 3);
  brush.beginPath();                              // and gold from there to its point
  brush.moveTo(x + 260, base - 12);
  brush.quadraticCurveTo(x + 270, base - 224, x + 330, base - 420);
  brush.quadraticCurveTo(x + 390, base - 224, x + 400, base - 12);
  brush.closePath();
  brush.fillStyle = "#f0c048";
  brush.fill();
  brush.save();
  brush.clip();
  round(x + 260, x + 400, base - 420, base - 12);
  brush.strokeStyle = "rgba(120, 80, 10, 0.42)";  // with rings round it, closer toward the top
  brush.lineWidth = 3;
  brush.beginPath();
  for (n = 0; n < 8; n++) {
    var ry = base - 60 - n * (52 - n * 3.4);
    brush.moveTo(x + 250, ry);
    brush.quadraticCurveTo(x + 330, ry + 12, x + 410, ry);
  }
  brush.stroke();
  brush.restore();
}

// soft white clouds, and the uneven wash of watercolour over the whole sheet
function clouds(brush, wide) {
  for (var n = 0; n * 520 < wide; n++) {
    var x = 200 + n * 520, y = 150 + (n % 3) * 70;
    if (STYLE.clouds === "soft") {
      brush.filter = "blur(10px)";
      brush.fillStyle = "rgba(255, 255, 255, 0.75)";
      brush.beginPath();
      brush.ellipse(x, y, 150, 44, 0, 0, 7);
      brush.ellipse(x + 90, y - 30, 100, 50, 0, 0, 7);
      brush.ellipse(x - 80, y - 14, 80, 36, 0, 0, 7);
      brush.fill();
      brush.filter = "none";
    } else {
      scrollCloud(brush, x, y, 0.9 + (n % 2) * 0.2, "#f6f1e6", "rgba(120, 130, 150, 0.6)");
    }
  }
}

function wash(brush, wide) {
  brush.filter = "blur(26px)";
  for (var n = 0; n < wide / 9; n++) {
    var light = dice(n + 300) < 0.5;
    brush.fillStyle = light ? "rgba(255, 250, 235, 0.07)" : "rgba(120, 80, 60, 0.05)";
    brush.beginPath();
    brush.ellipse(dice(n + 100) * wide, dice(n + 200) * 1080, 60 + dice(n) * 120,
                  40 + dice(n + 50) * 80, 0, 0, 7);
    brush.fill();
  }
  brush.filter = "blur(2px)";                     // long strokes of a wide brush
  brush.lineCap = "round";
  for (n = 0; n < wide / 24; n++) {
    var y = dice(n + 400) * 1080, long = 160 + dice(n + 500) * 360;
    brush.strokeStyle = dice(n + 600) < 0.5 ? "rgba(255, 250, 235, 0.09)" : "rgba(90, 60, 40, 0.06)";
    brush.lineWidth = 10 + dice(n + 650) * 30;
    brush.beginPath();
    brush.moveTo(dice(n + 450) * wide - 100, y);
    brush.lineTo(dice(n + 450) * wide - 100 + long, y + (dice(n + 550) - 0.5) * 30);
    brush.stroke();
  }
  brush.filter = "none";
  for (n = 0; n < wide * 1080 / 90; n++) {          // the tooth of the paper
    brush.fillStyle = dice(n + 900) < 0.5 ? "rgba(60, 40, 30, 0.05)" : "rgba(255, 255, 255, 0.06)";
    brush.fillRect(dice(n + 1000) * wide, dice(n + 1100) * 1080, 2, 1.5);
  }
}

// what lies along the path: a fence, tufts of grass, flowers and stones
// The edge of the path: a fence at the back, flowers and stones along it.
// "part" is "back" (the fence and what grows behind the people), "front"
// (only what grows in front of them) or nothing, for all of it at once.
function pathside(brush, wide, part) {
  if (part === "front") { brush.clearRect(0, 0, wide, 1080); }
  else {
  brush.strokeStyle = "rgba(122, 74, 48, 0.75)";
  brush.lineWidth = 6;
  brush.beginPath();
  brush.moveTo(0, 818);
  brush.lineTo(wide, 818);
  brush.moveTo(0, 838);
  brush.lineTo(wide, 838);
  brush.stroke();
  for (var post = 0; post < wide; post += 60) {
    brush.fillStyle = "#9a6642";
    brush.fillRect(post, 800, 9, 52);
  }
  }
  var petals = ["#f28fa8", "#f4c542", "#ffffff", "#e86f6f"];
  for (var n = 0; n < wide / 14; n++) {
    var x = dice(n + 700) * wide, y = 852 + dice(n + 800) * 215;
    if (y > 905 && y < 1000) { continue; }          // keep the middle of the path clear
    if (part === "back" && y >= 1000) { continue; }
    if (part === "front" && y < 1000) { continue; }
    if (part !== "back" && n % 23 === 5) { leafClump(brush, x, 1075, 0.5 + dice(n + 1200) * 0.3); }
    for (var blade = -1; blade <= 1; blade++) {     // a tuft of grass: three small blades, each with its line
      brush.save();
      brush.translate(x, y);
      brush.rotate(blade * 0.5 + (dice(n + 1300) - 0.5) * 0.3);
      paintLeaf(brush, 14 + 7 * dice(n * 3 + blade + 1400), 3.2, blade * 0.3, "#3f7f4a", "#a9d07c",
                "rgba(35, 65, 40, 0.75)", "rgba(0, 0, 0, 0)");
      brush.restore();
    }
    if (n % 9 === 4) { lotus(brush, x + 6, y - 4, 0.5, petals[n % 4 === 2 ? 0 : n % 4]); }
    if (n % 3 === 0) { blossom(brush, x + 5, y - 22, 6.5, petals[n % 4]); }
    if (n % 7 === 0) {
      brush.fillStyle = "rgba(150, 130, 115, 0.8)";
      brush.beginPath();
      brush.ellipse(x + 30, y, 13, 7, 0, 0, 7);
      brush.fill();
    }
  }
}

// a banana tree: a short green stem and wide leaves, torn along their edges
function banana(brush, x, base) {
  var line = "rgba(28, 58, 36, 0.85)";
  brush.beginPath();                                // the stem, wider at its foot
  brush.moveTo(x - 12, base);
  brush.quadraticCurveTo(x - 6, base - 80, x - 3, base - 152);
  brush.lineTo(x + 13, base - 152);
  brush.quadraticCurveTo(x + 12, base - 80, x + 14, base);
  brush.closePath();
  var stem = brush.createLinearGradient(x - 12, 0, x + 14, 0);
  stem.addColorStop(0, "#6f9a52");
  stem.addColorStop(1, "#a9cf80");
  brush.fillStyle = stem;
  brush.fill();
  brush.strokeStyle = line;
  brush.lineWidth = 2;
  brush.lineJoin = "round";
  brush.stroke();
  var leans = [-1.5, 1.45, -0.85, 0.9, 0.1];        // the leaves, the lowest first
  for (var n = 0; n < leans.length; n++) {
    var long = 120 - Math.abs(leans[n]) * 12, bow = leans[n] * 0.22;
    brush.save();
    brush.translate(x + 5, base - 150);
    brush.rotate(leans[n]);
    paintLeaf(brush, long, 30, bow, n % 2 ? "#3f8050" : "#357448", "#a4d27e", line);
    leafPath(brush, long, 30, bow);                 // the tears: lines in from the edge toward the rib
    brush.clip();
    brush.strokeStyle = "rgba(28, 58, 36, 0.4)";
    brush.lineWidth = 1;
    brush.beginPath();
    for (var tear = 2; tear < 10; tear++) {
      var u = tear / 10, mid = bow * long * 0.9 * u * u, side = tear % 2 ? 1 : -1;
      brush.moveTo(mid, -long * u);
      brush.lineTo(mid + side * 32, -long * u - 10);
    }
    brush.stroke();
    brush.restore();
  }
}

// three sheets of film grain, used one after another
function makeGrain(n) {
  var paper = document.createElement("canvas");
  paper.width = WIDE * PIX;                       // at the device pixels, so the grain stays fine
  paper.height = 1080 * PIX;
  var brush = paper.getContext("2d");
  for (var i = 0; i < 9000 * PIX * PIX; i++) {
    var shade = dice(n * 99991 + i) < 0.5 ? "0, 0, 0" : "255, 255, 255";
    brush.fillStyle = "rgba(" + shade + ", 0.07)";
    brush.fillRect(dice(n * 7 + i * 3) * WIDE * PIX, dice(n * 13 + i * 5) * 1080 * PIX, 2, 2);
  }
  return paper;
}

var GRAIN = [makeGrain(1), makeGrain(2), makeGrain(3)];

// ---------- the scenes ----------

function card(big, small) {
  pen.fillStyle = "#f3e6c4";
  pen.fillRect(0, 0, WIDE, 1080);
  pen.strokeStyle = "#7a2f25";
  pen.lineWidth = 10;
  pen.strokeRect(60, 60, WIDE - 120, 960);
  pen.lineWidth = 3;
  pen.strokeRect(84, 84, WIDE - 168, 912);
  pen.fillStyle = "#7a2f25";
  pen.textAlign = "center";
  pen.font = "bold 96px Georgia, 'Times New Roman', serif";
  pen.fillText(big, WIDE / 2, 520);
  pen.font = "52px 'Leelawadee UI', 'Noto Sans Thai', Tahoma, sans-serif";
  pen.fillText(small, WIDE / 2, 620);
  lotus(pen, 190, 930, 1.6, "#f28fa8");                        // the ornaments of a thangka's border
  lotus(pen, WIDE - 190, 930, 1.6, "#f28fa8");
  scrollCloud(pen, 260, 200, 0.55, "#fff8e8", "#7a2f25");
  scrollCloud(pen, WIDE - 260, 200, 0.55, "#fff8e8", "#7a2f25");
}

// Words under the picture: the line being sung, and what it means. They
// are drawn on the screen after the film's lens, grain and dust, so they
// stay sharp and still while the picture behind them shakes.
function subtitle(big, small) {
  screen.save();
  screen.textAlign = "center";
  screen.lineJoin = "round";
  screen.font = "bold 58px 'Leelawadee UI', 'Noto Sans Thai', Tahoma, sans-serif";
  screen.strokeStyle = "rgba(30, 18, 10, 0.9)";
  screen.lineWidth = 9;
  screen.strokeText(big, 960, 960);
  screen.fillStyle = "#fff6dc";
  screen.fillText(big, 960, 960);
  if (small) {
    screen.font = "italic 36px Georgia, 'Times New Roman', serif";
    screen.lineWidth = 7;
    screen.strokeText(small, 960, 1012);
    screen.fillStyle = "#ffe9a8";
    screen.fillText(small, 960, 1012);
  }
  screen.restore();
}

// a red stage curtain. "open" runs from 0, shut, to 1, gone to the sides.
function curtain(open) {
  for (var half = -1; half <= 1; half += 2) {
    var edge = WIDE / 2 + half * open * 760;        // where this half ends
    var from = half < 0 ? edge - 760 : edge;
    pen.fillStyle = "#b3262b";
    pen.fillRect(from, 0, 760, 1080);
    for (var fold = 0; fold < 9; fold++) {          // the dark and light of the folds
      pen.fillStyle = fold % 2 ? "rgba(0, 0, 0, 0.16)" : "rgba(255, 190, 170, 0.14)";
      pen.fillRect(from + 20 + fold * 84 * (1 - open * 0.3), 0, 36, 1080);
    }
    pen.fillStyle = "#f0c048";                      // a gold band along the bottom
    pen.fillRect(from, 1010, 760, 26);
  }
}

// the iris: black everywhere but a round hole, which closes on a scene
// and opens on the next one
function iris(open) {
  pen.fillStyle = "#000000";
  pen.beginPath();
  pen.rect(0, 0, WIDE, 1080);
  // The hole is a path of its own, begun on the circle and once round. (It
  // was joined to the sheet's corner by a line, and went a little more than
  // once round: the two made a black bar across the hole at every cut.)
  pen.moveTo(WIDE / 2 + open * 920, 540);
  pen.arc(WIDE / 2, 540, open * 920, 0, Math.PI * 2, true);
  pen.fill("evenodd");
}

// ---------- the film ----------

// ---------- a frame that does not depend on the last one drawn ----------
// What hangs (follow) and what an arm remembers (bendOf) come from the frames
// before. So a frame come to by a jump of the clock - a still, a render that
// starts part of the way in, a scrub - would show them at rest, and not as
// the film has them. settled(t, paint) paints the frame at t with paint(t).
// When the page is being rendered (its "rendering" is true) and the clock has
// jumped, it first paints the SETTLE frames before t, unseen.
//
// Why two seconds: a spring forgets how it started at the rate of its "damp".
// The kit's slowest (a drum on its strap, damp 5) loses half of a wrong start
// every 0.28 s: a twelfth is left after one second, less than a hundredth
// after two. Measured on four films (checks/kit_check.py --settle N), against
// the same frame come to by running the four seconds before it, counting the
// pixels of the sheet that a shift of one pixel does not explain: with no
// frames before, up to 42,114; with 15, 4,231; with 30, 3,655; with 60, 3;
// with 90, none. kit_check.py makes that comparison on every page.
//
// A page watched live is left alone: its clock runs on by itself, and a slow
// computer must not be made to paint sixty frames for one.
var SETTLE = 60, SETTLED_AT = null;

function settled(t, paint) {
  var jumped = SETTLED_AT === null || t < SETTLED_AT - 1e-6 || t - SETTLED_AT > 0.1;
  if (jumped && typeof rendering !== "undefined" && rendering) {
    for (var back = SETTLE; back >= 1; back--) {
      if (t - back / 30 >= 0) { paint(t - back / 30); }
    }
  }
  SETTLED_AT = t;
  paint(t);
}

// one frame of a film on the film's own sheet: the scene of that second,
// with the camera's slow move in, and the iris at a cut
function filmFrame(t, scenes) {
  clock = t;
  pen.setTransform(PIX, 0, 0, PIX, 0, 0);          // the sheet's base scale: film pixels to device pixels
  for (var i = 0; i < scenes.length; i++) {
    var from = scenes[i][0], to = scenes[i][1];
    if (t >= from && t < to) {
      var push = 1 + 0.06 * (t - from) / (to - from);   // the camera moves in, slowly
      pen.save();
      pen.translate(WIDE / 2, 620);
      pen.scale(push, push);
      pen.translate(-WIDE / 2, -620);
      scenes[i][2](t - from);
      pen.restore();
      if (from > 0 && t - from < 0.5) { iris(between(t - from, 0, 0.5)); }
      if (to < scenes[scenes.length - 1][1] && to - t < 0.5) { iris(between(to - t, 0, 0.5)); }
    }
  }
}

// Draw second t of a film: find its scene, let the camera push in, close and
// open the iris at the cuts, then send the sheet to the screen through the lens.
function film(t, scenes) {
  var frame = Math.round(t * 30);
  settled(t, function (at) { filmFrame(at, scenes); });
  // Old film. The sheet goes to the screen a little soft and a little brown,
  // with black bars left and right, and it shakes by a pixel or two in the gate.
  var wear = STYLE.film;                           // how much of the old print shows
  screen.setTransform(PIX, 0, 0, PIX, 0, 0);       // the screen's base scale, kept for the subtitles drawn after
  screen.fillStyle = "#000000";
  screen.fillRect(0, 0, 1920, 1080);
  screen.save();
  screen.beginPath();
  screen.rect(SIDE, 0, WIDE, 1080);
  screen.clip();
  screen.filter = STYLE.lens;
  screen.drawImage(FILM, SIDE + (dice(frame + 9) - 0.5) * 3 * wear, (dice(frame + 5) - 0.5) * 3 * wear, WIDE, 1080);
  screen.filter = "none";
  screen.translate(SIDE, 0);
  if (wear > 0) {
  // grain, a flicker, specks of dust, now and then a scratch, and dark corners
  screen.globalAlpha = wear;
  screen.drawImage(GRAIN[frame % 3], 0, 0, WIDE, 1080);
  screen.globalAlpha = 1;
  screen.fillStyle = "rgba(255, 240, 200, " + ((0.03 + dice(frame) * 0.04) * wear) + ")";
  screen.fillRect(0, 0, WIDE, 1080);
  screen.fillStyle = "rgba(30, 20, 10, 0.5)";
  for (var speck = 0; speck < 4 * wear; speck++) {
    screen.fillRect(dice(frame * 7 + speck) * WIDE, dice(frame * 11 + speck) * 1080,
                    2 + dice(frame + speck) * 3, 2 + dice(frame * 3 + speck) * 3);
  }
  if (dice(frame * 0.37) < 0.06 * wear) {
    screen.fillStyle = "rgba(255, 250, 235, 0.35)";
    screen.fillRect(dice(frame * 1.7) * WIDE, 0, 2, 1080);
  }
  var corners = screen.createRadialGradient(WIDE / 2, 540, 520, WIDE / 2, 540, 960);
  corners.addColorStop(0, "rgba(20, 10, 0, 0)");
  corners.addColorStop(1, "rgba(20, 10, 0, " + (0.5 * wear) + ")");
  screen.fillStyle = corners;
  screen.fillRect(0, 0, WIDE, 1080);
  }
  screen.restore();
}
