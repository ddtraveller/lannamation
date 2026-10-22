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
//              (a face of the north, look.north, is drawn from a photograph    NORTH_FACES, northNose)
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

// warn(message): message, a sentence. Says it once in the browser's console, after "oldcartoon.js: ", and keeps it
// in WARNINGS; the same message again says nothing. Returns nothing.
// e.g. warn('the scene "dusk" has no clock');
function warn(message) {
  if (WARNINGS.indexOf(message) >= 0) { return; }   // once is enough: draw() runs 30 times a second
  WARNINGS.push(message);
  console.warn("oldcartoon.js: " + message);
}

// how many letters must change to turn one name into the other
// a, b: two names (capitals count). Returns a whole number: 0 when they are the same.
// e.g. lettersApart("handa", "handB")   // 1
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
//   what    the words that begin the warning, for the kind of name ("The look's name")
//   name    the name given
//   known   an object whose keys are the names the kit knows (LOOK_KEYS, STYLE ...)
// Returns nothing; it may warn() once.
// e.g. checkName("The feeling", "hapy", FEELINGS);
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
// "given" is the object whose keys are checked; "what" and "known" are checkName()'s. Returns nothing.
// e.g. checkNames("The look's name", look, LOOK_KEYS);
function checkNames(what, given, known) {
  for (var name in given) { checkName(what, name, known); }
}

// ---------- z: what is drawn over what ----------
// A frame is painted from the back to the front: what is drawn later covers what was drawn before. Z names the
// bands a scene's sprites are drawn in, nearer the bigger the number; within one band, the one whose feet are lower
// on the sheet (nearer us) is drawn later. Every kind stands in "people" unless Z_KINDS says otherwise, so a hen, a
// dog and a tree are sorted with the people by their feet, and a hen walking from behind the boy to before him
// passes in front of him on the way.
var Z = {sky: 0, far: 1, set: 2, back: 3, people: 5, front: 7, near: 9};

// The kinds whose band is not "people": a name of Z; "*" for one that flies toward us or away (its band from its
// depth, each frame: far 1 at depth 0 to front 7 at depth 1; "people" when it is given no depth); or null for one
// that can be anywhere (in the sky, on a perch, past the lens, in a pond behind the lotus), whose z must then be
// given where it is drawn: a null kind drawn without one is warned of, and drawn among the people.
var Z_KINDS = {
  sun: "sky", moon: "sky", cloud: "sky",
  dragon: "*", naga: "*", luang: "*", lantern: "*",
  birds: null, flock: null, magpie: null, hornbill: null, sunbird: null, egret: null, owl: null, bats: null, moth: null,
  fireflies: null, khom: null, khomphat: null, khomdao: null, khombua: null,
  gourami: null, barb: null, flyingbarb: null, snakehead: null, tokay: null, gecko: null
};

// zOf(kind, z, depth): the band, a number, one of that kind is drawn in.
//   kind   its kind's name ("hen", "dragon", "person"); one not in Z_KINDS is "people"
//   z      optional: a name of Z, a number, or "*"; left out (undefined) for its kind's own
//   depth  optional: 0 far to 1 near, read when the z is "*" (motion.js's where() gives it fifth)
// Changes nothing, but may warn() once: a null kind given no z, or a z that is not a name of Z.
// e.g. zOf("hen")              // 5
//      zOf("dragon", "*", 1)   // 7
//      zOf("magpie", "sky")    // 0
function zOf(kind, z, depth) {
  if (z === undefined) {
    z = kind in Z_KINDS ? Z_KINDS[kind] : "people";
    if (z === null) {
      warn('a ' + kind + ' can be anywhere, so the z it is drawn at must be given (a name of Z, a number, or "*")');
      z = "people";
    }
  }
  if (z === "*") { return typeof depth === "number" ? Z.far + (Z.front - Z.far) * clamp(depth) : Z.people; }
  if (typeof z === "string") { checkName("The z", z, Z); return z in Z ? Z[z] : Z.people; }
  return z;
}

// drawByZ(sprites) draws a scene's sprites from the back to the front: by band (zOf), then by feet (y, lower is
// nearer), then in the order they are listed. A long thing on the ground (a trough, a fence, a row of pots along a
// path) has no one y: it gives line instead, its own y at an x, and is drawn just before the first sprite of its
// band that stands in front of it where that sprite stands (its x), or after its band when none does. (Sorted by one
// y, a man walking along a trough's near side was drawn under it where the trough came nearer than his feet.)
//   sprites  [{kind, z, depth, y, x, line, draw, name}, ...]: kind, z, depth as zOf() takes them; y the sheet's y of
//            its feet (or the point it hangs from); x where it stands, read against a long thing's line; line, for a
//            long thing, a function (x) giving its y there, or null where it does not reach; draw a function that
//            draws it; name, optional, for a check
// Returns nothing: each draw() draws with pen. When a check has set window.Z_SEEN to a list, it pushes
// {name, kind, z, y} onto it for each sprite, in the order drawn.
// e.g. drawByZ([{kind: "person", y: 950, draw: function () { person(700, 950, cast("boy")); }},
//               {kind: "hen", y: 980, draw: function () { hen(pen, 760, 980, 1, t); }}]);   // the hen in front
function drawByZ(sprites) {
  var all = sprites.map(function (one, n) { return {one: one, n: n, z: zOf(one.kind || "person", one.z, one.depth)}; });
  var order = all.filter(function (s) { return !s.one.line; })
    .sort(function (a, b) { return a.z - b.z || (a.one.y || 0) - (b.one.y || 0) || a.n - b.n; });
  all.filter(function (s) { return s.one.line; }).forEach(function (long) {
    var at = order.length;
    for (var k = 0; k < order.length; k++) {
      var s = order[k], there = s.z === long.z && typeof s.one.x === "number" ? long.one.line(s.one.x) : null;
      if (s.z > long.z || (there !== null && there !== undefined && s.one.y > there)) { at = k; break; }
    }
    order.splice(at, 0, long);
  });
  order.forEach(function (s) {
    if (window.Z_SEEN) { window.Z_SEEN.push({name: s.one.name || s.one.kind, kind: s.one.kind, z: s.z, y: s.one.y}); }
    s.one.draw();
  });
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
  lids: "folded",                       // every person's eye folded at the lid, as the Thai face's (owner, 2026-10-20: "fix the eyes in all the models with a folded lid eye"); "kit" for the creased eye the kit drew before
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

// red: the colour a painted mouth asks for, "#rrggbb". Returns red while PAINTED, else her own lips' colour (from
// SKIN).
// e.g. pen.fillStyle = lipOf("#c8343a");
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

// x held between 0 and 1.
// e.g. clamp(1.4)   // 1
function clamp(x) { return Math.max(0, Math.min(1, x)); }

// t, a, b: one unit, mostly seconds. Gives 0 before a, 1 after b, and an eased S-curve from 0 to 1 between them.
// e.g. var come = between(t, 2, 3.5);   // 0 until 2 s, 1 from 3.5 s
function between(t, a, b) {
  var x = clamp((t - a) / (b - a));
  return x * x * (3 - 2 * x);
}

// a number "amount" of the way from a to b: amount 0 gives a, 1 gives b (beyond 0 to 1 it goes past them).
// e.g. mix(100, 300, 0.25)   // 150
function mix(a, b, amount) { return a + (b - a) * amount; }

// A number from 0 to (just under) 1 that looks random but is always the same for the same n: the kit's dice, so a
// frame can be drawn again alike. n: any number (a seed, a count).
// e.g. var gap = 40 + dice(n * 3 + 1) * 20;
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

//   t      seconds of the film (or of the scene's clock)
//   late   beats to shift the hop by, default 0 (0.5: down while the others are up)
// Returns 0 to 1. Reads BEAT and HOLD (STYLE.hold).
// e.g. var lift = hop(t, 0.25) * 12;
function hop(t, late) {
  var beats = t / BEAT + (late || 0);
  var frac = beats - Math.floor(beats);
  if (frac < HOLD || frac > 1 - HOLD) { return 0; }
  return Math.pow(Math.sin(Math.PI * (frac - HOLD) / (1 - 2 * HOLD)), 1.5);
}

// Eyes do not drift. They hold on a spot, then jump to another in a twentieth
// of a second (a saccade), after a hold of half a second to a few seconds.
// The spots and the holds come from dice, so no two people look alike.
// t: seconds (add a person's own time, so no two look alike). Returns [across, down]: where the eyes look, in face
// pixels, across -3 to 3 and down -1.2 to 1.2.
// e.g. var glance = saccade(t + ownTime("noi"));
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
//   t         the turn: -1 profile, 0 three-quarter, 1 full face
//   P, Q, F   the profile, three-quarter and full-face lists, alike point for point
// Returns a new list (Q itself when t is 0).
// e.g. outline(blendOutline(0.5, CHEST_LADY_P, CHEST_LADY, CHEST_LADY_F), function (x, y) { return [x, y]; });
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

// ---------- bodies ----------
// A body is a choice, as a face of the north is (owner, 2026-10-20: "Add a few fat bodies for men, women and children
// ... Ideally faces, hair and bodies and clothes will be swappable", then "Rather than just swelling I'd like fat bodies
// redrawn from scratch"). look.body names one of BODIES: its chests (a man's and a lady's, each as three lists:
// profile, three-quarter and full face, for blendOutline), where its shoulders, hips and feet stand from the middle
// (profile, three-quarter, full face, as blend3), how thick its arms and legs are (at the root, the joint and the
// end; legThin under a skirt), how wide its waist is where cloth hangs from it (tier), how much wider its hems,
// its waist cloth and its neck, where a hanging hand comes to rest (clear of the belly), its shadow, and how broad
// its face is drawn. "slim" is the kit's own body; a child is any body at a child's measure (build).
//
// The fat chest is its own shape, not the slim one swollen: a man's back broad and curving out from the waist, the
// shoulders sloping and round, a thick neck, the chest running down and forward into a round belly carried low, at
// its fullest under the navel, tucking under to a wide waist; a lady's bust fuller, a soft belly under it, a wide
// waist, the back rounder at the shoulder blade.
var CHEST_MAN_FAT = [[-56, 2],
                     [[-68, -24], [-78, -64], [-74, -104]],         // a broad back, out from the waist
                     [[-72, -124], [-56, -136], [-30, -142]],
                     [[0, -148], [26, -143]],                       // a thick neck
                     [[56, -138], [74, -126], [74, -104]],          // the shoulder, sloping and round
                     [[82, -84], [104, -62], [110, -32]],           // the chest running into the belly
                     [[114, -2], [86, 14], [52, 12]],               // the belly, fullest low, tucking under
                     [[0, 18], [-56, 2]]];
var CHEST_LADY_FAT = [[-50, 2],
                      [[-60, -26], [-70, -62], [-66, -100]],
                      [[-66, -120], [-52, -132], [-26, -139]],
                      [[0, -145], [22, -139]],
                      [[48, -135], [66, -122], [66, -102]],
                      [[84, -90], [86, -60], [76, -46]],            // a fuller bust
                      [[90, -36], [94, -10], [66, 6]],              // a soft belly under it, the dip between them shallow
                      [[0, 16], [-50, 2]]];
// A three-quarter chest seen in profile and from the front: in profile the back comes in to the spine and the front
// stays out (a belly is seen most from the side); from the front both sides are alike, as wide as the wider side.
// q: a three-quarter chest list (as CHEST_MAN_FAT). Returns [profile, q, full face], the three lists BODIES[..].chest
// takes; q itself is not changed.
// e.g. var turns = chestTurns(CHEST_LADY_FAT);
function chestTurns(q) {
  function each(f) {
    return q.map(function (seg, n) {
      return n === 0 ? f(seg) : seg.map(f);
    });
  }
  return [each(function (pt) { return [pt[0] * (pt[0] < 0 ? 0.62 : 0.74), pt[1]]; }), q,
          each(function (pt) { return [pt[0] * (pt[0] < 0 ? 1.12 : 0.97), pt[1]]; })];
}
var BODIES = {
  slim: {chest: {man: [CHEST_MAN_P, CHEST_MAN, CHEST_MAN_F], lady: [CHEST_LADY_P, CHEST_LADY, CHEST_LADY_F]},
         root: [4, 40, 46], hips: [6, 20, 23], feet: [8, 26, 30], arm: [12, 10, 8.5], leg: [15, 12, 9.5], legThin: [9, 7.5, 6],
         waist: 30, hem: 0, cloth: 1, neck: 13, hand: 12, shadow: 96, face: 1},
  fat: {chest: {man: chestTurns(CHEST_MAN_FAT), lady: chestTurns(CHEST_LADY_FAT)},
        root: [7, 56, 62], hips: [11, 36, 40], feet: [12, 38, 42], arm: [20, 17, 12.5], leg: [27, 21, 13], legThin: [16, 12.5, 8.5],
        waist: 56, hem: 28, cloth: 1.75, neck: 21, hand: 44, shadow: 140, face: 1.1}
};
var BODY = BODIES.slim;                             // the body being drawn now: person() sets it, as it sets SKIN

// the path of such a list, with every point put where put(x, y) says it
// goes: a drawing bent along a curve, and tipped, and still drawn only once
//   points   a list as CHEST_LADY is: a start [x, y], then curves of three points or two
//   put      put(x, y) gives [x, y]: where that point goes, in pen's pixels
// Returns nothing. It begins a new path on pen and closes it, but neither fills nor inks it: the caller does
// (shape(), pen.clip() ...).
// e.g. outline(CHEST_LADY, function (x, y) { return [x, y - 20]; }); shape("#c0392b");
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
//   rig      the rig's RIG object, from its rig.js (parts, neck, hip, ankle)
//   folder   where its images are, ending in "/"
// Returns the same rig, which it changes: it adds byName, images, scale (kit units per picture pixel) and upper,
// lower and legs (bone lengths, in kit units). The images load in the background; part() draws nothing until they
// have.
// e.g. rigImages(RIG, "rig_lady/");
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
//   rig              a rig after rigImages()
//   name             one of its parts' names ("armL_upper")
//   ax, ay, bx, by   where its two joints land, in pen's pixels
//   stretch          true to stretch it along the bone so it reaches (bx, by); else it keeps its length
// Returns nothing: it draws with pen (nothing while the image has not loaded, or for a name the rig lacks).
// e.g. part(RIG, "armL_upper", 0, -140, 24, -80, true);
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
//   rig       a rig after rigImages()
//   sx, sy    the shoulder, in pen's pixels
//   hand      [across, down]: where the hand reaches from the shoulder, in pen's pixels
//   outward   1 or -1: which way the elbow points, as armJoints() takes it
//   bend      the wrist's bend, in radians
// e.g. var wrist = rigArm(RIG, ["armL_upper", "armL_lower", "handL"], 20, -140, [36, 70], 1, 0.2);
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

//   key        a name for this hanging thing, kept across frames: the person's id and the thing ("noi/earring")
//   lx, ly     its pivot, in pen's local pixels now
//   stiff      the spring: 40 to 320 (stiffer comes back sooner)
//   damp       the slowing: 5 to 9
//   limit      the most it may lag, in screen pixels
// Returns [across, down] in local pixels. Reads clock; keeps its state in FOLLOWS[key], so call it once a frame
// for each key.
// e.g. var lag = follow("noi/earring", 50, -272, 200, 8, 10);
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
// lines: the song's rows, [beat, "syllable syllable ..."] (CUES does). Returns [[beat, syllable], ...], one beat for
// each syllable, for mouthAt().
// e.g. var SUNG = sungBeats(CUES);
function sungBeats(lines) {
  var out = [];
  for (var n = 0; n < lines.length; n++) {
    var words = lines[n][1].split(" ");
    for (var k = 0; k < words.length; k++) { out.push([lines[n][0] + k, words[k]]); }
  }
  return out;
}

// the shape of the mouth for a syllable: how wide and how round, 0 to 1
// syllable: one Thai syllable. Returns {wide: 0 or 1, round: 0 or 1}.
// e.g. vowelOf("จัง")   // {wide: 0, round: 0}
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
// syllable: one Thai syllable. Returns "lips", "teeth", "tongue", "hiss" or "".
// e.g. onsetOf("บ้าน")   // "lips"
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
// sung: the list sungBeats() gives. Reads clock and BEAT. Returns {open, wide, round} (0 to 1 each), with teeth and
// tongue (true or false) while a consonant shows; or null. The page passes it to person() as look.mouth.
// e.g. person(700, GROUND, {lady: true, mouth: mouthAt(SUNG)});
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
// t: seconds of the film; cues: the cue sheet (CUES). Returns {line: its number, -1 before the first; since:
// seconds since it began; beats: how many syllables it has}.
// e.g. if (cueAt(t, CUES).line === 2) { wave = 1; }
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
// t: seconds of the film; cues: the cue sheet (CUES). Returns nothing: it draws the line with subtitle(), or
// nothing between lines.
// e.g. words(t, CUES);
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

// The ink for a line round paint of this colour: mostly INK, a little of the paint. colour: "#rrggbb"; any other
// form ("red", "rgb(...)") gets INK itself. Returns a CSS colour.
// e.g. pen.strokeStyle = inkFor("#c0392b");
function inkFor(colour) {
  if (!/^#[0-9a-f]{6}$/i.test(colour)) { return INK; }
  var paint = parseInt(colour.slice(1), 16);
  var red = (paint >> 16) & 255, green = (paint >> 8) & 255, blue = paint & 255;
  return "rgb(" + Math.round(mix(red, 58, 0.84)) + ", " + Math.round(mix(green, 36, 0.84)) +
         ", " + Math.round(mix(blue, 24, 0.84)) + ")";
}

// From here on, whatever is drawn in "ink" is drawn a second time, one step
// down and to the left: that is the heavier side of the line.
// ink: a CSS colour. Sets pen's shadow to it, offset (-1.1, 1.1) pixels; it stays set until light().
// Returns nothing.
// e.g. heavy(INK); pen.stroke(); light();
function heavy(ink) {
  pen.shadowColor = ink;
  pen.shadowOffsetX = -1.1;
  pen.shadowOffsetY = 1.1;
}

// Ends heavy(): pen's shadow off. Returns nothing.
// e.g. light();
function light() {
  pen.shadowColor = "transparent";
  pen.shadowOffsetX = 0;
  pen.shadowOffsetY = 0;
}

// Fills the path pen holds now with "colour" and inks its line (inkFor(colour), the heavy side below and to the
// left). colour: a CSS colour; width: the line's width in pixels, default LINE. Returns nothing; leaves pen's
// fillStyle, strokeStyle, lineWidth and lineJoin as it set them.
// e.g. pen.beginPath(); pen.arc(0, -40, 20, 0, 7); shape("#c0392b");
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
// path, other: Path2D objects in pen's pixels. Inks path with pen's strokeStyle and lineWidth as they are, except
// inside other. Returns nothing; pen's clip is put back as it was.
// e.g. pen.strokeStyle = INK; strokeOutside(sleeve, body); strokeOutside(body, sleeve);
function strokeOutside(path, other) {
  var rest = new Path2D();
  rest.rect(-4000, -4000, 8000, 8000);
  rest.addPath(other);
  pen.save();
  pen.clip(rest, "evenodd");
  pen.stroke(path);
  pen.restore();
}

// A filled ellipse with its ink line: middle (x, y), half-widths rx and ry, in pen's pixels; colour a CSS colour;
// turn in radians, default 0. Returns nothing.
// e.g. oval(0, -40, 12, 8, "#f4d6b8");
function oval(x, y, rx, ry, colour, turn) {
  pen.beginPath();
  pen.ellipse(x, y, rx, ry, turn || 0, 0, 7);
  shape(colour);
}

// A rubber hose: one curved line, drawn fat in ink and then thinner in
// colour. Arms, legs, tails and necks are all hoses.
//   x1, y1, x2, y2   its two ends, in pen's pixels
//   bend             how far its middle bows out, as a share of its length: 0 straight, 0.2 a good bow (the sign
//                    picks the side)
//   width            its width in pixels, without the ink
//   colour           a CSS colour
// Returns nothing; leaves pen's lineCap "round".
// e.g. hose(0, -140, 30, -60, 0.15, 12, SKIN);
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
// Units are pen's pixels. Returns nothing.
// e.g. ribbon(-28, 2, -40, 70, 0.15, 14, "#a33a2a", "#e0b23a");
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
// x, y: the eye's middle, in pen's pixels (it is 14 wide and 26 tall); shut: true draws the blink, a curved line.
// Returns nothing.
// e.g. pieEye(20, -300, hop(t) > 0.9);
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
// down at the inner ends, eyes narrowed, corners down), sad (inner ends
// of the brows up, lids half down, corners down), sleepy (lids that hang,
// brows lifted against them, a nod and a yawn), full (heavy lids over
// an easy smile, the cheeks pink, leaning back) and worry (the brows drawn
// up and together with a fold between them, the outer lids down, the mouth
// pressed small, the eyes open on what it fears) and laugh (the eyes
// squeezed shut and bowed up, the mouth open wide and opening again on
// each "ha", the head back and shaking with it). A scene gives them as
// numbers (wonder: 0.5) or by name (feel: "surprised"), and a name also
// gives the body a lean and the head a tilt, unless the scene sets its own.
// The names: neutral, happy, laughing, sad, concerned, angry, sleepy,
// satiated, surprised; and fear. A slanted lid (see eye()) carries anger, sadness
// and worry where no brow can be seen, as under a head-cloth.
var FEELINGS = {
  neutral: {},
  happy: {smile: 1, wonder: 0.25, tilt: -0.04},
  laughing: {laugh: 1, smile: 1, bend: -0.04, tilt: -0.08},
  sad: {sad: 1, bend: 0.05, tilt: 0.12},
  concerned: {worry: 1, bend: 0.03, tilt: 0.06},
  angry: {anger: 1, bend: 0.1, tilt: 0.03},
  sleepy: {sleepy: 1, bend: 0.04, tilt: 0.08},
  satiated: {full: 1, smile: 0.8, bend: -0.07, tilt: -0.06},
  surprised: {wonder: 1, open: [0.7, 0, 1], bend: -0.05, tilt: -0.05},
  fear: {fear: 1, wonder: 0.4, open: [0.6, 1, 0], bend: -0.08, tilt: 0.1}
};
var FEELING_WAS = {calm: "neutral", joy: "happy", surprise: "surprised", anger: "angry"};   // the names the kit had first, which still work

// A time of its own for each person, from their name (see "id" above
// person()), so that a crowd of sleepers do not nod and yawn as one.
// who: the person's id, a string. Returns seconds, 0 to 13, the same each time for the same name.
// e.g. var at = clock + ownTime("yai");
function ownTime(who) {
  var sum = 0;
  for (var n = 0; n < who.length; n++) { sum = (sum * 31 + who.charCodeAt(n)) % 9973; }
  return sum * 0.618 % 13;
}

// What sleepy and full do over time, at a person's own time "at". Sleepy:
// the lids hang half down; every seven seconds the head sinks for four
// seconds as the eyes close, and comes up with a start in a quarter of a
// second, eyes open; every eleven seconds a yawn of 2.4 seconds: the mouth
// opens tall and round, the eyes squeeze shut, the brows go up and the head
// goes back (a yawn stops a nod). Full: the lids are heavy, and every six
// seconds they close for a second and a half, savouring it. Laughing: the
// eyes shut, the mouth opens on each "ha", four and a half a second, and
// the head and the shoulders shake with it, in bursts of two seconds with a
// breath of half a second between.
//   f    the feeling's numbers, as feelingOf() builds them: it reads sleepy, full and laugh (0 to 1) and adds to
//        bend and tilt
//   at   the person's own time, in seconds
// Returns f itself, changed: lids (0 to 1), browUp (pixels), ha (-1 to 1) set, bend and tilt added to, and open
// set during a yawn or a laugh.
// e.g. var f = feelingOverTime({sleepy: 1, full: 0, laugh: 0, bend: 0, tilt: 0}, clock);
function feelingOverTime(f, at) {
  var nod = (at % 7 + 7) % 7, gape = ((at + 4.5) % 11 + 11) % 11, rest = (at % 6 + 6) % 6;
  var yawn = gape < 0.7 ? Math.sin(gape / 0.7 * Math.PI / 2) : gape < 1.5 ? 1 : gape < 2.4 ? 0.5 + 0.5 * Math.cos((gape - 1.5) / 0.9 * Math.PI) : 0;
  var sink = (nod < 1 ? 0 : nod < 5 ? Math.pow((nod - 1) / 4, 2) : nod < 5.25 ? 1 - (nod - 5) / 0.25 : 0) * (1 - yawn);
  var start = nod > 5.05 && nod < 5.7 ? Math.sin((nod - 5.05) / 0.65 * Math.PI) : 0;
  var savour = rest < 2 || rest > 3.9 ? 0 : rest < 2.35 ? (rest - 2) / 0.35 : rest < 3.5 ? 1 : 1 - (rest - 3.5) / 0.4;
  var s = f.sleepy, full = f.full;
  f.lids = Math.max(s * Math.max((0.55 + 0.45 * sink) * (1 - 0.7 * start), yawn), full * (0.62 + 0.38 * savour));
  f.browUp = s * (2.5 + 5 * yawn);                   // the brows: up against the lids, and higher in a yawn
  f.bend += s * 0.05 * sink;
  f.tilt += s * (0.22 * sink - 0.16 * yawn) - full * 0.04 * savour;
  if (s * yawn > 0.02) { f.open = [s * yawn, 0.1, 0.5]; }
  var l = f.laugh, burst = (at % 2.6 + 2.6) % 2.6;
  f.ha = 0;
  if (l > 0) {
    var loud = burst < 0.15 ? 0.35 + 0.65 * burst / 0.15 : burst < 2 ? 1 : burst < 2.15 ? 1 - 0.65 * (burst - 2) / 0.15 : 0.35;   // a burst, then a breath
    var ha = loud * Math.sin(at * Math.PI * 9);     // each "ha": 4.5 a second
    f.ha = l * ha;                                  // (kept, for a creature's body: creatureFeel())
    f.lids = Math.max(f.lids, l);
    f.browUp += 3 * l;
    f.bend += l * 0.03 * ha;
    f.tilt += l * 0.05 * ha;
    if (s * yawn <= 0.02) { f.open = [l * (0.45 + 0.2 * loud + 0.2 * ha), 0.9, 0]; }
  }
  return f;
}

// The feeling a look asks for, as the numbers the face and the body read.
// "at" is the person's own time (ownTime() added to the clock).
//   look   the look: it reads feel (a name of FEELINGS, or one of FEELING_WAS) and the numbers wonder, smile,
//          fear, anger, sad, sleepy, full, worry, laugh (0 to 1, each beating the name's own), eyes and lips
//   at     the person's own time in seconds, default clock
// Returns {wonder, smile, fear, anger, sad, sleepy, full, worry, laugh, open, bend, tilt, eyes, lips} and what
// feelingOverTime() adds (lids, browUp, ha). It warns once for a feeling's name it does not know.
// e.g. var f = feelingOf({feel: "sleepy"}, clock + ownTime("yai"));
function feelingOf(look, at) {
  var name = FEELING_WAS[look.feel] || look.feel;
  if (look.feel !== undefined) { checkName("The feeling", name, FEELINGS); }
  var named = FEELINGS[name] || {};
  function amount(given, key) { return clamp(given !== undefined ? given : named[key] || 0); }
  // A cast member's resting smile (the boy's smile: 1) gives way to a sad, worried, frightened or cross feeling:
  // the boy told to be sad smiled through his tears (2026-10-20).
  var unhappy = look.feel !== undefined && (named.sad || named.worry || named.fear || named.anger);
  return feelingOverTime({wonder: amount(look.wonder, "wonder"), smile: unhappy ? clamp(named.smile || 0) : amount(look.smile, "smile"),
          fear: amount(look.fear, "fear"), anger: amount(look.anger, "anger"), sad: amount(look.sad, "sad"),
          sleepy: amount(look.sleepy, "sleepy"), full: amount(look.full, "full"), worry: amount(look.worry, "worry"),
          laugh: amount(look.laugh, "laugh"),
          open: named.open, bend: named.bend || 0, tilt: named.tilt || 0,
          eyes: look.eyes || 1, lips: look.lips || 1}, at === undefined ? clock : at);   // and the face's own measure: how large its eyes and its mouth are
}

// ---------- a creature's feeling ----------
// The feelings people have, on a creature (owner, 2026-10-18: "start the
// creatures"). A creature's look takes the same names (feel: "angry") and
// numbers, and creatureFeel() turns them into what any face and body can
// show; each creature draws what it has. With no feeling all of it is 0
// (wide 1), and a creature draws as it did before.
//   f      what feelingOf() gives, over time at the creature's own time "at"
//   lid    0 to 1: how far the upper lid is down (sleepy, full, laughing)
//   bowed  true: a laughing eye, shut and bowed up
//   slant  -1 to 1, as eye()'s: a lid low at the front corner (anger), or at
//          the back (sadness, worry)
//   wide   how wide the eye opens: 1 as it is, more in wonder and fear
//   brow   [lift, turn]: a brow raised (in eye-heights) and turned, its front
//          end down (anger) or up (sadness, worry), in radians
//   open   0 to 1: how far the mouth opens (wonder, fear, a laugh, a yawn)
//   grin   -1 to 1: the corners of a mouth up in a smile, down in a frown
//   raise  -1 to 1: the head carried high (wonder, joy) or low (sad, sleepy)
//   ears   -1 to 1: up and forward (wonder, joy) or down and back (sad,
//          afraid, angry, sleepy)
//   wag    0 to 1: how hard a tail wags (happy, laughing)
//   tail   -1 to 1: a tail carried up (happy, angry) or down (sad, afraid)
//   shake  -1 to 1: a laugh's shake, on each "ha"
//   nod    the head's tilt, down positive: the person's (a sleepy nod, a
//          yawn back, a laugh's toss)
//   startle  0 to 1: a fright, for a creature that has one of its own
//   jaw(usual)  how far a jaw opens, given how far it would otherwise
// look: the creature's look (feel and the numbers, as feelingOf() reads them); at: its own time in seconds,
// default clock. Returns the object above.
// e.g. var e = creatureFeel({feel: "angry"}, clock + ownTime("dog"));
function creatureFeel(look, at) {
  var f = feelingOf(look, at);
  var frown = clamp(f.sad + 0.6 * f.anger + 0.45 * f.worry);
  return {f: f, lid: f.lids, bowed: f.laugh > 0.5,
          slant: Math.max(-1, Math.min(1, 0.9 * f.anger - 0.7 * f.sad - 0.45 * f.worry)),
          wide: 1 + 0.3 * f.wonder + 0.45 * f.fear - 0.15 * f.anger - 0.3 * f.sad + 0.1 * f.worry,
          brow: [(7 * f.wonder + 6 * f.fear - 4 * f.anger + f.browUp + 2 * f.worry) / 9, 0.35 * f.anger - 0.3 * f.sad + 0.15 * f.fear - 0.38 * f.worry],
          open: f.open ? f.open[0] : 0,
          grin: Math.max(-1, Math.min(1, f.smile - frown)),
          raise: Math.max(-1, Math.min(1, 0.7 * f.wonder + 0.3 * f.smile + 0.2 * f.laugh - 0.7 * f.sad - 0.4 * f.worry - 0.5 * f.sleepy - 0.3 * f.fear)),
          ears: Math.max(-1, Math.min(1, 0.7 * f.wonder + 0.4 * f.smile - 0.7 * f.sad - 0.7 * f.fear - 0.8 * f.anger - 0.5 * f.sleepy - 0.3 * f.worry)),
          wag: clamp(0.8 * f.smile + 0.6 * f.laugh - 0.5 * f.full),
          tail: Math.max(-1, Math.min(1, 0.6 * f.smile + 0.4 * f.wonder + 0.5 * f.anger - 0.8 * f.sad - 0.7 * f.fear - 0.4 * f.sleepy - 0.3 * f.worry)),
          shake: f.ha, nod: f.tilt, startle: clamp(0.9 * f.wonder + f.fear),
          jaw: function (usual) {                    // how far a jaw opens: the feeling's own (a laugh, a yawn, a fright), or else shut for
            if (f.open) { return f.open[0]; }       // sadness, worry, fullness and sleep, a snarl in anger, and as it was otherwise
            return clamp(mix(usual, 0.03, clamp(f.sad + f.worry + f.full + f.sleepy)) + 0.3 * f.anger);
          }};
}

// A creature's eye: an ellipse about (x, y), rx by ry, turned by how.turn,
// looking along +x (its front). The white, an iris toward the front
// (how.iris, with a pupil in it if how.pupil is a colour), and the lid a
// feeling brings down (e, from creatureFeel()), in the colour of the skin
// (how.skin), its edge inked (how.ink). how.pie: a 1930s pie eye instead,
// black with a slice of light (how.light, the kit's skin unless told) cut out.
// how.ball: an eye coloured all through (a cat's, a pig's) in place of the
// white and the iris, with only a pupil (how.pupil; how.slit, a slit) and a light. Shut (a blink, how.shut,
// or a lid down past 0.9) it is a line bowed down; laughing, bowed up.
// x, y, rx, ry are in pen's pixels (ry is made taller by e.wide); e needs lid, wide, bowed and slant. how.skin is
// the lid's colour: give it unless no lid comes down. Returns nothing.
// e.g. creatureEye(40, -20, 6, 7, creatureFeel({feel: "sleepy"}, clock), {skin: "#c98d4e", iris: "#5a3a1a"});
function creatureEye(x, y, rx, ry, e, how) {
  var ink = how.ink || INK, closed = Math.max(e.lid, how.shut ? 1 : 0);
  ry *= e.wide;
  pen.save();
  pen.translate(x, y);
  pen.rotate(how.turn || 0);
  pen.strokeStyle = ink;
  pen.lineCap = "round";
  if (closed > 0.9 || (e.bowed && closed > 0.5)) {
    pen.lineWidth = Math.max(1.6, ry * 0.32) * FINE;
    pen.beginPath();
    pen.moveTo(-rx, 0);
    pen.quadraticCurveTo(0, (e.bowed ? -1.2 : 0.9) * ry, rx, 0);
    pen.stroke();
    pen.restore();
    return;
  }
  var ball = new Path2D();
  ball.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  if (how.pie) {                                    // black, with a slice of light cut from it
    pen.fillStyle = ink;
    pen.fill(ball);
    pen.fillStyle = how.light || SKIN;
    pen.beginPath();
    pen.moveTo(0, 0);
    pen.lineTo(rx * 1.3, -ry * 0.92);
    pen.lineTo(rx * 1.43, -ry * 0.15);
    pen.fill();
  } else {
    pen.fillStyle = how.ball || "#fff6ea";
    pen.fill(ball);
  }
  pen.save();
  pen.clip(ball);
  if (how.ball) {                                   // coloured all through: a pupil, a slit or round, and a light
    if (how.slit) { oval(rx * 0.14, 0, rx * 0.2, ry * 0.84, how.pupil || "#1f1a1a"); }
    else if (how.pupil) { oval(rx * 0.14, 0, ry * 0.6, ry * 0.62, how.pupil); }
    oval(rx * 0.32, -ry * 0.34, Math.min(rx, ry) * 0.2, Math.min(rx, ry) * 0.2, "#fff6ea");
  } else if (!how.pie) {
    oval(rx * 0.28, ry * 0.08, Math.min(rx, ry) * 0.62, ry * 0.72, how.iris || "#1f1a1a");
    if (how.pupil) { oval(rx * 0.33, ry * 0.08, Math.min(rx, ry) * 0.27, ry * 0.31, how.pupil); }
    oval(rx * 0.1, -ry * 0.25, Math.min(rx, ry) * 0.18, Math.min(rx, ry) * 0.18, "#ffffff");
  }
  var a = Math.max(0, e.slant), sad = Math.max(0, -e.slant), base = -ry + 2 * ry * 0.9 * closed;
  var back = base + ry * (1.1 * sad + 0.2 * a), front = base + ry * (1.3 * a + 0.3 * sad);
  if (closed > 0.02 || a > 0.02 || sad > 0.02) {    // the lid: down from the top to a line, low at the front in anger, at the back in sadness
    pen.beginPath();
    pen.moveTo(-rx * 1.2, -ry * 1.3);
    pen.lineTo(rx * 1.2, -ry * 1.3);
    pen.lineTo(rx * 1.2, front + 0.2 * (front - back));
    pen.lineTo(-rx * 1.2, back - 0.2 * (front - back));
    pen.closePath();
    pen.fillStyle = how.skin;
    pen.fill();
    pen.lineWidth = Math.max(1.4, ry * 0.28) * FINE;
    pen.stroke();
  }
  pen.restore();
  if (!how.pie) {
    pen.lineWidth = Math.max(1.2, ry * 0.16) * FINE;
    pen.stroke(ball);
  }
  pen.restore();
}

// A pose reached with a snap: first a small move the other way (the
// anticipation), then fast to the pose and a little past it, then settling.
// u: 0 to 1, how far through the move (between() gives one). Returns about -0.1 at first, a little past 1 in the
// middle, and 1 at u = 1: multiply the move by it.
// e.g. var reach = snap(clamp((t - 2) / 0.4)) * 30;
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
// t: the turn, -1 to 1. Returns the number on the curve that passes atProfile at -1, atQuarter at 0 and atFront
// at 1.
// e.g. blend3(0.5, 30, 2, -19)
function blend3(t, atProfile, atQuarter, atFront) {
  return atQuarter + t * (atFront - atProfile) / 2 + t * t * (atFront - 2 * atQuarter + atProfile) / 2;
}

// t: the turn, -1 to 1; P, Q, F: lists of [x, y], alike in length. Returns a new list: each point blended as
// blend3() blends a number.
// e.g. var head = blendPoints(0.5, HEAD_P, HEAD_Q, HEAD_F);
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
// Returns a Path2D in the head's pixels; it draws nothing.
// e.g. var V = view(-1, true, null); pen.fill(profilePiece(V.tip, V.side, 0, true));
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

// "lady" is true for a head with a lady's face: her profile's measure, or a fellow's.
// "north" is a face of the north (northFace(), from look.north): its cheekbones, jaw and chin reshape the outline.
// Where every feature of a head goes at a turn. turn: -1 (profile) to 1 (full face), default 0. Returns V, in the
// head's pixels: the eyes (near, nearW, far, farW), the nose (nose, tip), the mouth (mouth, mouthW), the cheeks
// (cheek, farCheek, farCheekR), the ears (ear, farEar 0 to 1), hairShift, the knots (bun, crown, nape: [x, y]),
// the outlines (head, hairLady, hairMan: points for HEAD_Q's order), and how far it has turned (t, toProfile,
// toFront, side: 0 to 1).
// e.g. var V = view(0.5, true, null);
function view(turn, lady, north) {
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
  var head = points(HEAD_P, HEAD_Q, HEAD_F, HEAD_SIDE);
  if (north) {                                      // the face of the north is shaped before the turn's own changes; none in profile
    var keep = 1 - side, front = Math.max(0, t);
    var cheek = north.cheek * keep, jaw = north.jaw * keep, chin = north.chin * keep;
    head[7][0] += cheek;                            // the far cheekbone stands out,
    head[8][0] += cheek * 0.8;
    head[13][0] -= cheek * (0.5 + 0.5 * front);     // and the near one, more as the face comes round
    head[0][0] -= cheek * 0.3 * front;
    head[9][0] += jaw;                              // the jaw's corners go out and a little down, so its sides drop straight
    head[9][1] += jaw * 0.3;
    head[8][1] += jaw * 0.4;
    head[12][0] -= jaw * (0.6 + 0.4 * front);
    head[12][1] += jaw * 0.3;
    head[10][0] += chin * 0.5;                      // and the chin is broad and full
    head[10][1] += chin * 0.25;
    head[11][1] += chin * 0.15;
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
    crown: [b(-14, -8, 0), b(-386, -383, -389)],    // a knot on the top of the head (bun "wong"), sitting into the hair
    nape: [b(-98, -94, -40), b(-292, -294, -296)],  // a low knot at the nape (bun "low"): behind the head, hidden from the front
    head: head,
    hairLady: points(HAIR_LADY_P, HAIR_LADY_Q, HAIR_LADY_F, HAIR_LADY_SIDE),
    hairMan: points(HAIR_MAN_P, HAIR_MAN_Q, HAIR_MAN_F, HAIR_MAN_SIDE)
  };
}

// ---------- faces of the north ----------
// The faces of Northern Thai people as a photograph shows them: Princess Dara
// Rasmi's ladies of the north, and the children with them, about 1909 (public
// domain; Commons, "Dara Rasami + Entourage @ Bang Pa-In"). The research had
// found no measured "Northern face" (studies of Thai skulls find almost no
// difference between the regions), so the faces are drawn from what the
// photograph shows, not from a measure. (Owner, 2026-10-18: "add Northern
// Thai/Lanna face shapes", from the photographs, each face its own; of three
// candidates drawn beside the photograph, the owner chose this one.) In it:
//   - the face is widest at the cheekbones, just below the eyes, and nearly
//     as wide there as it is tall from the brows to the chin
//   - the jaw's sides drop nearly straight and turn at a soft corner level
//     with the mouth; the chin is broad and round, never a point
//   - the eyes are small and set about an eye's width apart; the upper lid is
//     heavy, over the top of the iris, with little or no crease above it
//   - the brows are straight or gently arched, low over the eye
//   - the nose is short with a low bridge, its base broad, the wings flaring
//   - the mouth is about as wide as the pupils are apart, the lips full
//   - the cheeks are full and high; a child's face is rounder still
// NORTH holds what every face of the north shares: each eye moves out from the
// nose by "apart"; a lady's upper lid hangs "lid" (a fellow's "lidMan"), the
// crease shows "fold" of the kit's, the outer corners lift by "tilt"; the brows
// are lower by "browLow" (a fellow's, set high under a head-cloth, "browLowMan"),
// their arch and weight are times "browArch" and "browHeavy"; the bridge starts
// lower by "noseLow" and the base is "noseWide" times as broad; the mouth is
// "lipsWide" times as wide and the lips "lipsFull" times as full; a fellow's eye
// is "eyeSmall" times the height of the kit's comic eye.
var NORTH = {apart: 2.5, lid: 0.2, lidMan: 0.12, fold: 0.15, tilt: 0.06, browLow: 3, browLowMan: 8, browArch: 0.65, browHeavy: 1.4,
             noseLow: 4, noseWide: 1.3, lipsWide: 1.1, lipsFull: 1.25, eyeSmall: 0.8};
// No two faces in the photograph are one shape. look.north names one of
// these: how far the cheekbones stand out, how square the jaw's corner is, how
// broad and full the chin, and how wide the head is drawn ("head" unless told).
//   round    a round face, the cheeks full, the jaw soft, the chin full
//   square   a broad square jaw, nearly as wide as the cheekbones
//   broad    wide cheekbones, the face wider than it is tall
//   soft     narrowing a little from the cheekbones to a softer, smaller chin
//   full     the cheeks full low down, the chin fullest of all
// (The candidate the owner chose had cheek 5, jaw 4 and chin 2: these lie either side of it.)
var NORTH_FACES = {
  round: {cheek: 4, jaw: 1, chin: 4, wide: 1.06},
  square: {cheek: 5, jaw: 8, chin: 1, wide: 1.06},
  broad: {cheek: 8, jaw: 4, chin: 2, wide: 1.12},
  soft: {cheek: 5, jaw: -1, chin: 0, wide: 0.98},
  full: {cheek: 3, jaw: 3, chin: 5, wide: 1.04},
  // The Thai face (owner, 2026-10-20: "They don't really look like Asian eyes. They look Western", then "Start
  // from scratch with faces in general and try one from your research", then "fold these faces into the kit"):
  // drawn from photographs of Thai people and a 3D study of Thai faces, not from any one face. Broad cheekbones and
  // a soft jaw; the eye "folded": the upper lid with no crease and no hollow under the brow, the lid line running on
  // past the inner corner into the fold over it, a dark iris filling the opening; a slant between the 6 degrees
  // measured on men and the 9 on women; the brows straight, low and heavier; a low, broad nose; fuller lips. Its own
  // numbers ("own") take the place of NORTH's; a child keeps half of each change, as every face of the north does.
  thai: {cheek: 6, jaw: 3, chin: 3, wide: 1.08, eyes: "folded",
         own: {apart: 2, lid: 0.1, lidMan: 0.08, fold: 0, tilt: 0.13, browLow: 4, browLowMan: 7, browArch: 0.25, browHeavy: 1.7,
               noseLow: 3, noseWide: 1.45, lipsWide: 1.15, lipsFull: 1.3, eyeSmall: 0.8}}
};
var NORTH_FACE = null;                              // the face of the north being drawn now: person() sets it, as it sets SKIN
// The eye of everyone else, while STYLE.lids is "folded": the Thai face's own lid (NORTH_FACES.thai.own), not its
// face. person() sets EYE_LIDS to the face of the north it draws, or to this, or to null; eye() reads only it, so
// an animal's eye (drawn outside person()) keeps its own.
var FOLDED_EYE = {lid: 0.1, lidMan: 0.08, fold: 0, tilt: 0.13, eyes: "folded"};
var EYE_LIDS = null;
// Tears (look.tears, 0 to 1: how much one cries), drawn by eye() from the lower lid: person() sets EYE_TEARS as it
// sets EYE_LIDS. The eyes brim, and a drop gathers at the corner and falls (owner, 2026-10-20: "Add some tears for
// when the boy cries"; of three ways drawn, a stream, falling drops and this, "C welling").
var EYE_TEARS = 0;

// What a figure's face of the north is, from its look (null when it has none):
// its shape's numbers and every one of NORTH. A child keeps a child's measure:
// half of each change, a rounder jaw and a fuller chin.
// look: the figure's look; it reads north (a name of NORTH_FACES; an unknown name warns and draws "round") and
// build (below 0 a child). Returns {cheek, jaw, chin, wide, tilt, eyes, apart, lid, lidMan, browLow, browLowMan,
// noseLow, fold, browArch, browHeavy, noseWide, lipsWide, lipsFull, eyeSmall}, or null. person() keeps it in
// NORTH_FACE.
// e.g. var north = northFace({north: "thai", build: -0.5});
function northFace(look) {
  if (!look.north) { return null; }
  if (typeof look.north === "string") { checkName("A face of the north", look.north, NORTH_FACES); }
  var shape = NORTH_FACES[look.north] || NORTH_FACES.round;
  var base = Object.assign({}, NORTH, shape.own || {});   // a face's own numbers, where it has them (the Thai face)
  var child = clamp(-(look.build || 0)), half = 1 - 0.5 * child;
  var face = {cheek: shape.cheek, jaw: shape.jaw * (1 - 0.7 * child), chin: shape.chin + 2 * child, wide: shape.wide, tilt: base.tilt,
              eyes: shape.eyes || "kit"};
  ["apart", "lid", "lidMan", "browLow", "browLowMan", "noseLow"].forEach(function (name) { face[name] = base[name] * half; });
  ["fold", "browArch", "browHeavy", "noseWide", "lipsWide", "lipsFull", "eyeSmall"].forEach(function (name) {
    face[name] = 1 + (base[name] - 1) * half;
  });
  if (face.eyes === "folded") { face.eyeSmall = base.eyeSmall; }   // a child's folded eye as small as a grown one's: a child's comic eye is huge
  return face;
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
// V: the head's view (view()), with V.face, the face's Path2D, to keep the lines on it. Returns nothing: it draws
// with pen, in the head's pixels.
// e.g. ageLines(0.7, view(0.2, false, null));
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
// colour: the beard's CSS colour; V: the head's view (view()); drop: pixels the jaw has dropped, 0 when shut.
// Returns nothing: it draws with pen, in the head's pixels.
// e.g. beard("#d8d0c4", view(0.2, false, null), 0);
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
//   slant        -1 to 1: a feeling's lid. Above 0 a straight lid comes down over the inner
//                half of the eye, lowest at the inner corner (anger); below 0 it comes down
//                at the outer corner (sadness, worry). It reads where no brow can be seen,
//                as under a head-cloth, and on a creature's eye
//   bowed        true: shut, the eye bows up (^), as a laugh pushes the cheeks up under it
//   x, y     the eye's middle, between its corners, in pen's pixels
//   shut     true, false, or 0 to 1
// Reads EYE_LIDS (the heavy lid of a face of the north, or the folded eye) and EYE_TEARS, which person() sets:
// outside person() they are as the last figure left them. Returns nothing: it draws with pen.
// e.g. eye(30, -277, 9, 4.6, false, [1, 0], -1, 1, 0, false);
function eye(x, y, wide, tall, shut, glance, outer, lashes, slant, bowed) {
  var gx = glance.length ? glance[0] : glance, gy = glance.length ? glance[1] : 0;
  // "shut" may be 0 to 1: the upper lid comes down that far, and past 0.9 the eye is shut.
  // A face of the north (NORTH_FACE) has a heavy upper lid: open, it hangs at least that far.
  var north = EYE_LIDS, closed = shut === true ? 1 : shut ? shut : 0;
  // A folded eye (the Thai face): a lower arch, a dark iris that fills the opening with one light, no crease, and
  // the lid line running on past the inner corner into the fold over it.
  var folded = !!north && north.eyes === "folded", arch = folded ? 1.45 : 1.9;
  var hangs = north && closed <= 0.9 ? (lashes ? north.lid : north.lidMan) : 0;
  var heavy = Math.max(closed, hangs), lid = 1 - 0.85 * heavy, weight = north ? heavy : 0;
  shut = closed > 0.9;
  var below = slant && !shut ? slantedLid(x, y, wide, tall * 0.95 * lid, outer, slant) : null;
  pen.save();                                       // an eye with lashes is a lady's: its outer corner lifts (a little, on a face of the north)
  pen.translate(x, y);
  pen.rotate(north ? -north.tilt * outer : lashes ? -0.17 * outer : 0);
  pen.translate(-x, -y);
  var n, angle, painted = lashes === 1;
  pen.lineCap = "round";
  pen.strokeStyle = INK;
  if (shut) {                                       // a shut eye is the lower lid alone; a laughing one bows up
    pen.lineWidth = (painted ? 2.4 : 4) * FINE;
    pen.beginPath();
    pen.moveTo(x - wide, y);
    pen.quadraticCurveTo(x, y + tall * (bowed ? -1.2 : 0.9), x + wide, y);
    pen.stroke();
  } else {
    pen.fillStyle = "rgba(150, 110, 150, " + (folded ? 0 : (painted ? 0.07 : 0.22) * (north ? north.fold : 1)) + ")";    // the hollow under the brow (none over a folded lid)
    pen.beginPath();
    pen.ellipse(x, y - tall * 1.25, wide * 1.05, tall * 0.7, 0, 0, 7);
    pen.fill();
    pen.beginPath();                                // the white of the eye
    pen.moveTo(x - wide, y);
    pen.quadraticCurveTo(x - wide * 0.15, y - tall * arch * lid, x + wide, y - 1);
    pen.quadraticCurveTo(x, y + tall * 0.95, x - wide, y);
    pen.closePath();
    if (below) {                                    // a slanted lid: nothing of the eye shows above its line
      pen.save();
      pen.clip(below.open);
    }
    pen.fillStyle = "#ffffff";
    pen.fill();
    pen.save();
    pen.clip();                                     // nothing of the iris shows outside the lids
    pen.translate(0, gy);
    var round = folded ? 1.05 : painted ? 1.15 : 0.8;   // a painted eye's iris is large: it touches the upper lid and fills the eye's height (a folded one's too)
    var iris = pen.createRadialGradient(x + gx, y - tall * 0.2, tall * 0.1, x + gx, y - tall * 0.3, tall * round);
    iris.addColorStop(0, folded ? "#3e2614" : painted ? "#6a4424" : "#9a6a34");     // the brown of it: light round the pupil,
    iris.addColorStop(0.7, folded ? "#22140a" : painted ? "#3a2010" : "#6a3e1c");   // darker outward,
    iris.addColorStop(1, folded ? "#0e0804" : painted ? "#160c05" : "#2e1808");     // and a dark rim (a folded eye's, nearly black)
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
    pen.arc(x + gx - tall * 0.3, y - tall * 0.62 + weight * tall * 0.51, tall * 0.24, 0, 7);   // (under a heavy lid, lower)
    if (!painted && !folded) { pen.arc(x + gx + tall * 0.34, y - tall * 0.02, tall * 0.11, 0, 7); }
    pen.fill();
    pen.strokeStyle = "rgba(90, 50, 50, " + (0.22 + 0.25 * weight) + ")";   // the upper lid's shadow, on the white and the iris (a heavy lid's is deeper)
    pen.lineWidth = tall * (0.55 + 0.5 * weight);
    pen.beginPath();
    pen.moveTo(x - wide, y - tall * 0.1);
    pen.quadraticCurveTo(x - wide * 0.15, y - tall * (arch + 0.1) * lid, x + wide, y - tall * 0.1);
    pen.stroke();
    pen.restore();
    pen.lineWidth = (painted ? LINE * 0.95 : LINE + 0.8 * FINE) * (1 + 0.4 * weight);   // the upper lid, a little heavier
    pen.beginPath();
    pen.moveTo(x - wide, y);
    pen.quadraticCurveTo(x - wide * 0.15, y - tall * arch * lid, x + wide, y - 1);
    pen.stroke();
    if (below) {                                    // the slanted lid's own line, inside the eye: its shadow, then the ink,
      var almond = new Path2D(), cut = below.line;  // each twice as wide, since only the half under the line is seen
      almond.moveTo(x - wide, y);
      almond.quadraticCurveTo(x - wide * 0.15, y - tall * arch * lid, x + wide, y - 1);
      almond.quadraticCurveTo(x, y + tall * 0.95, x - wide, y);
      almond.closePath();
      pen.save();
      pen.clip(almond);
      pen.beginPath();
      pen.moveTo(cut[0], cut[1]);
      pen.lineTo(cut[2], cut[3]);
      pen.strokeStyle = "rgba(90, 50, 50, 0.22)";
      pen.lineWidth = tall * 1.1;
      pen.stroke();
      pen.strokeStyle = INK;
      pen.lineWidth = 2 * (painted ? LINE * 0.95 : LINE + 0.8 * FINE);
      pen.stroke();
      pen.restore();
      pen.restore();
    }
    pen.lineWidth = (painted ? 0.9 : 1.6) * FINE;          // the lower lid, light
    pen.beginPath();
    pen.moveTo(x + wide, y - 1);
    pen.quadraticCurveTo(x, y + tall * 0.95, x - wide, y);
    pen.stroke();
    pen.strokeStyle = "rgba(58, 36, 24, " + (folded ? 0 : (painted ? 0.28 : 0.4) * (below ? 1 - Math.min(1, Math.abs(slant)) : 1) * (north ? north.fold : 1)) + ")";   // the fold of the lid above it, gone under a slanted lid (and nearly gone on a face of the north)
    pen.lineWidth = (painted ? 1.1 : 2) * FINE;
    pen.beginPath();
    pen.moveTo(x - wide * 0.8, y - tall * 0.95 * lid);
    pen.quadraticCurveTo(x - wide * 0.1, y - tall * 2.25 * lid, x + wide * 0.85, y - tall * 0.9 * lid);
    pen.stroke();
    pen.strokeStyle = INK;
    if (folded) {                                   // the fold over the inner corner: the lid line runs on, down over the corner
      // short and light, measured by the eye's height (a comic eye is wide, and a long fold met the nose's line)
      var inner = x - outer * wide;
      pen.strokeStyle = "rgba(58, 36, 24, 0.6)";    // a soft crease, not an ink line: eyes set close meet over the nose
      pen.lineWidth = 1.6 * FINE;
      pen.beginPath();
      pen.moveTo(inner + outer * tall * 0.55, y - tall * 0.85 * lid);
      pen.quadraticCurveTo(inner - outer * tall * 0.05, y - tall * 0.45, inner - outer * tall * 0.08, y);
      pen.stroke();
      pen.strokeStyle = INK;
    }
  }
  if (lashes && !north) {                           // the lid line runs on past the outer corner and lifts: a flick (a painting's, not the photograph's)
    var flick = wide / 15;                          // the flick is as long as the eye is: 8 on an eye 30 across
    pen.lineWidth = (painted ? 1.9 : 3) * FINE;
    pen.beginPath();
    pen.moveTo(x + outer * wide * 0.9, y - (shut ? 0 : 2 * flick));
    pen.quadraticCurveTo(x + outer * (wide + 4 * flick), y - 3 * flick, x + outer * (wide + 8 * flick), y - 7 * flick);
    pen.stroke();
    if (!shut && !painted) {                        // two more lashes, on the outer half of the upper lid
      var cx = x - wide * 0.15, cy = y - tall * arch * lid;   // the lid is a curve through this control point
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
  if (EYE_TEARS > 0) { tearsFrom(x, y, wide, tall, outer, shut); }
  pen.restore();
}

// Tears from one eye (see EYE_TEARS): the lower lid brims with water, and a drop gathers at its middle toward the
// outer corner, grows, and now and then lets go and runs down the cheek. They move with the clock, so a still frame
// catches them on the way; the two eyes are out of step.
// x, y, wide, tall, outer, shut: as eye() was given them. Reads EYE_TEARS (0 to 1) and clock. Returns nothing:
// it draws with pen. eye() calls it.
// e.g. EYE_TEARS = 0.8; tearsFrom(30, -277, 9, 4.6, -1, false);
function tearsFrom(x, y, wide, tall, outer, shut) {
  var much = EYE_TEARS, start = [x + outer * wide * 0.25, y + tall * 0.75], fall = tall * 7 * (0.6 + 0.4 * much);
  var phase = (clock * 0.9 + (outer > 0 ? 0.37 : 0)) % 1;
  pen.strokeStyle = "rgba(200, 235, 255, " + (0.5 + 0.4 * much) + ")";   // the brimming lower lid
  pen.lineWidth = tall * 0.32;
  pen.beginPath();
  pen.moveTo(x - wide * 0.7, y + tall * 0.25);
  pen.quadraticCurveTo(x, y + tall * 0.95, x + wide * 0.7, y + tall * 0.25);
  pen.stroke();
  var hang = phase < 0.6 ? 0 : (phase - 0.6) / 0.4;  // the drop: gathering, then falling
  var px = start[0] + outer * tall * 0.3, py = start[1] + tall * 0.4 + hang * hang * fall;
  var r = tall * (0.3 + 0.25 * Math.min(1, phase / 0.6));
  pen.save();
  pen.globalAlpha *= 1 - 0.5 * hang;
  pen.beginPath();                                  // round below, pointed above
  pen.moveTo(px, py - r * 2.1);
  pen.quadraticCurveTo(px + r * 1.1, py - r * 0.4, px, py + r);
  pen.quadraticCurveTo(px - r * 1.1, py - r * 0.4, px, py - r * 2.1);
  pen.fillStyle = "rgba(170, 215, 245, 0.9)";
  pen.fill();
  pen.strokeStyle = "rgba(60, 110, 160, 0.7)";
  pen.lineWidth = 1.1 * FINE;
  pen.stroke();
  pen.fillStyle = "rgba(255, 255, 255, 0.95)";      // its light
  pen.beginPath();
  pen.arc(px - r * 0.35, py - r * 0.35, r * 0.28, 0, 7);
  pen.fill();
  pen.restore();
}

// The part of an eye left open under a slanted lid (see eye()): a Path2D
// below a straight line from the outer corner to the inner, each end as high
// as the slant leaves it ("peak": how high the lid's arch stands), and the line.
// x, y, wide, outer, slant: as eye() takes them; peak in pixels. Returns {open: a Path2D, line: [x1, y1, x2, y2]};
// it draws nothing.
// e.g. var below = slantedLid(30, -277, 9, 8, -1, 0.6);
function slantedLid(x, y, wide, peak, outer, slant) {
  var a = Math.max(0, slant), s = Math.max(0, -slant);
  var ox = x + outer * wide, oy = y - peak * (1.25 - 0.35 * a - s);
  var ix = x - outer * wide, iy = y - peak * (1.25 - 1.3 * a - 0.35 * s);
  var dx = 0.6 * (ix - ox), dy = 0.6 * (iy - oy), open = new Path2D();
  open.moveTo(ox - dx, oy - dy);
  open.lineTo(ix + dx, iy + dy);
  open.lineTo(ix + dx, y + 4 * peak + 20);
  open.lineTo(ox - dx, y + 4 * peak + 20);
  open.closePath();
  return {open: open, line: [ox - dx, oy - dy, ix + dx, iy + dy]};
}

// The fold or two that brows drawn together leave between them, in worry
// and in anger: two short lines from the brows' height "y" down toward the
// nose, either side of "x". Gone toward profile.
// x, y in the head's pixels; feel: feelingOf()'s numbers (it reads worry and anger); V: the head's view (it reads
// toProfile). Returns nothing: it draws with pen, or nothing when there is no fold.
// e.g. frownFold(28, -293, feelingOf({feel: "concerned"}), view(0.2, true, null));
function frownFold(x, y, feel, V) {
  var fold = clamp(1.25 * Math.max(feel.worry, feel.anger) - 0.25) * (1 - V.toProfile);
  if (fold <= 0) { return; }
  pen.save();
  pen.lineCap = "round";
  pen.strokeStyle = "rgba(58, 36, 24, " + 0.5 * fold + ")";
  pen.lineWidth = 1.2 * FINE;
  pen.beginPath();
  for (var side = -1; side <= 1; side += 2) {
    pen.moveTo(x + 2.5 * side, y);
    pen.quadraticCurveTo(x + 3.8 * side, y + 4, x + 2 * side, y + 8);
  }
  pen.stroke();
  pen.restore();
}

// a brow: thick where it starts, by the nose, and thin at its far end
// "tilt" turns it about its middle: the inner end down for anger, up for sadness
// x, y: its middle; wide: half its length; arch: how high its middle rises; heavy: how thick; all in pixels.
// tilt in radians, default 0. Returns nothing: it draws in INK with pen.
// e.g. brow(30, -292, 12, 9, 1.1, 0.2);
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
// x, y: its middle; r: its radius, in pixels; strength: 0 to 1. Returns nothing: it draws with pen.
// e.g. blush(-10, -250, 15);
function blush(x, y, r, strength) {
  var pink = pen.createRadialGradient(x, y, 0, x, y, r);
  pink.addColorStop(0, "rgba(236, 110, 110, " + (strength === undefined ? 0.42 : strength) + ")");
  pink.addColorStop(1, "rgba(236, 110, 110, 0)");
  pen.fillStyle = pink;
  pen.beginPath();
  pen.arc(x, y, r, 0, 7);
  pen.fill();
}

// The nose of a face of the north (NORTH_FACE), for a lady ("lady" true) or a
// fellow: a low bridge, a line only from below the eyes, a short nose with a
// broad round tip, a wing flaring each side and a nostril under it, and a soft
// shadow under the base. The far wing shows more as the face comes round; in
// profile it all fades, as the kit's noses do, because there the nose is the outline.
// V: the head's view (view()); lady: true for her measure. Reads NORTH_FACE, which must be set (person() sets it).
// Returns nothing: it draws with pen, in the head's pixels.
// e.g. NORTH_FACE = northFace({north: "round"}); northNose(view(0.3, true, NORTH_FACE), true);
function northNose(V, lady) {
  var north = NORTH_FACE, low = north.noseLow, broad = north.noseWide, back = 1 - V.toFront;
  pen.save();
  pen.lineCap = "round";
  pen.globalAlpha = (1 - V.toProfile) * (1 - 0.6 * V.toFront);
  pen.strokeStyle = "rgba(58, 36, 24, " + (lady ? 0.3 : 0.45) + ")";       // the bridge: only below the eyes, and short
  pen.lineWidth = LINE * (lady ? 0.5 : 0.7);
  pen.beginPath();
  pen.moveTo(V.nose + (V.tip - V.nose) * 0.35, -272 + low);
  pen.quadraticCurveTo(V.nose + (V.tip - V.nose) * 0.7, -264 + low * 0.5, V.tip, -259);
  pen.stroke();
  pen.globalAlpha = 1 - V.toProfile;
  pen.fillStyle = "rgba(200, 120, 90, " + (lady ? 0.08 : 0.12) + ")";      // the soft shadow under the base
  pen.beginPath();
  pen.ellipse(V.tip - 2 * back, -253, 9 * broad, 3.2, 0, 0, 7);
  pen.fill();
  pen.strokeStyle = "rgba(58, 36, 24, 0.75)";
  pen.lineWidth = LINE * (lady ? 0.6 : 0.8);
  pen.beginPath();                                  // the tip: broad and round
  pen.moveTo(V.tip - 3 * broad, -256.5);
  pen.quadraticCurveTo(V.tip + 2 * back, -253.5, V.tip + 3 * broad, -256.5);
  pen.stroke();
  pen.fillStyle = "rgba(58, 36, 24, 0.6)";
  pen.lineWidth = LINE * (lady ? 0.55 : 0.7);
  for (var wing = -1; wing <= 1; wing += 2) {       // the near wing and nostril, then the far
    if (wing > 0) { pen.globalAlpha = (1 - V.toProfile) * Math.min(1, 0.35 + V.toFront); }
    pen.beginPath();
    pen.moveTo(V.tip + 4.5 * broad * wing, -260);
    pen.quadraticCurveTo(V.tip + 9.5 * broad * wing, -257.5, V.tip + 6.5 * broad * wing, -252.5);
    pen.stroke();
    pen.beginPath();
    pen.ellipse(V.tip + 4 * broad * wing, -254, 2.2 * broad, 1.3, -0.2 * wing, 0, 7);
    pen.fill();
  }
  pen.restore();
}

// A lady's face, drawn in the head's pixels (middle (0, -286)): eyes, brows, nose, rouge, mouth.
//   V      the view of the head for its turn (see view()): where each feature sits
//   feel   {wonder, smile}, each 0 to 1
//   shut     true, false, or 0 to 1: how far the lids are down
//   mouth    mouthAt()'s shape, or null for a shut mouth
//   glance   where the irises look: across, or [across, down], in pixels (saccade() gives one)
//   feel     in full, feelingOf()'s numbers: it reads wonder, smile, fear, anger, sad, worry, laugh, full, browUp,
//            eyes and lips
// V.face (a Path2D of the face, which personHead() adds) keeps the far eye, the cheek and the mouth on the face.
// Reads NORTH_FACE. Returns nothing: it draws with pen. person() calls it; a page draws a person instead.
// e.g. ladyFace(false, null, saccade(t), view(0.3, true, null), feelingOf({feel: "happy"}));
function ladyFace(shut, mouth, glance, V, feel) {
  var lift = (mouth ? 5 * mouth.open : 0) + 7 * feel.wonder + 6 * feel.fear - 4 * feel.anger + feel.browUp + 2 * feel.worry
           - 2 * (shut === true ? 1 : shut || 0);                 // the brows drop a little in a blink
  var wide = 1 + 0.3 * feel.wonder - 0.12 * feel.smile + 0.45 * feel.fear - 0.15 * feel.anger - 0.3 * feel.sad + 0.1 * feel.worry;   // the lids
  var knit = 0.35 * feel.anger - 0.3 * feel.sad + 0.15 * feel.fear - 0.38 * feel.worry;   // the brows' inner ends: down in anger, up in sadness and worry
  var slant = 0.9 * feel.anger - 0.7 * feel.sad - 0.45 * feel.worry, close = 3 * feel.worry;   // the lids' slant (see eye()); worry draws the brows together
  // The face of the paintings (the hairline is at -316 and the chin at -229).
  // The eyes are at the middle of it, small and long and half-lidded: each a
  // third of the face across, the far one 0.85 of the near, and nearer the
  // nose than a fellow's. The brows are thin arcs one eye-height above them.
  // A face of the north (NORTH_FACE): the eyes further apart, the brows lower,
  // flatter and darker, the nose its own (northNose), the cheeks and lips fuller.
  var north = NORTH_FACE, apart = north ? north.apart : 0, browDown = north ? north.browLow : 0;
  var arch = north ? north.browArch : 1, weight = north ? north.browHeavy : 1;
  var mid = 1 - Math.abs(V.t);                      // 1 at three-quarter, 0 in profile and full face
  var nearX = V.near + 4 * mid + 2 * V.toFront - apart, farX = V.far + 3 * mid - 2 * V.toFront + apart * (0.6 + 0.4 * V.toFront);
  var nearW = V.nearW * 0.77 * feel.eyes, farW = V.farW * 0.78 * feel.eyes;
  var side = V.side || 0;                           // how far her painted profile has taken over (see view())
  var look = [(glance.length ? glance[0] : glance) * 0.7 + 2.2 * side,   // a small eye's iris has less room to move; in profile it sits in the front half
              (glance.length ? glance[1] : 0) * 0.6];
  if (V.nearW > 2) { eye(nearX, -277, nearW, 4.6 * wide * feel.eyes, shut, look, -1, 1, slant, feel.laugh > 0.5); }
  if (V.nearW > 2) { brow(nearX + close, -292 - lift + 3 * side + browDown, nearW * 1.3, 9 * arch, 1.1 * weight, knit); }   // in profile the brow lies nearer the eye
  if (V.farW > 2) {                                 // the far eye and its brow: toward profile they go round the edge of the face, and it cuts them
    pen.save();
    if (V.face) { pen.clip(V.face); }
    eye(farX, -277.5, farW, 4.4 * wide * feel.eyes, shut, look, 1, 1, slant, feel.laugh > 0.5);
    brow(farX - close, -292.5 - lift + browDown, farW * 1.3, 8.5 * arch, 1.05 * weight, -knit);
    pen.restore();
  }
  frownFold(V.nose + (V.tip - V.nose) * 0.1, -293 - lift + browDown, feel, V);
  var frown = clamp(feel.sad + 0.6 * feel.anger + 0.45 * feel.worry);  // the corners of a shut mouth go down
  // A nose as the paintings draw one: a single fine line down from the inner
  // end of the brow to the tip, three quarters of the way down the face, and
  // a small curve under it for the nostril. No shading. Turned to the front
  // the line fades and there is a nostril each side; turned to profile it
  // all fades, because there the nose is the face's outline. (A face of the
  // north has its own: northNose.)
  if (north) { northNose(V, true); } else {
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
  }                                                 // (the end of the paintings' nose)
  pen.save();                                       // the rouge stays on the face: the far cheek's lies by its edge, and spilled past it (owner, 2026-10-18)
  if (V.skin) { pen.clip(V.skin); }
  var rouge = 0.2 + 0.22 * feel.full + 0.15 * feel.laugh;
  if (north) {                                      // full cheeks: the wash a little larger and higher, out with the eyes
    blush(V.cheek + 6 - apart, -252, 17, rouge);
    if (V.farCheekR > 1) { blush(V.farCheek - 2 + apart, -254, V.farCheekR * 1.1, rouge); }
  } else {
    blush(V.cheek + 6, -250, 15, rouge);            // a faint wash of pink, low on the cheek: not a disc; pinker when full, or laughing
    if (V.farCheekR > 1) { blush(V.farCheek - 2, -252, V.farCheekR, rouge); }
  }
  pen.restore();
  pen.save();                                       // the mouth is drawn about (24, -244), then put where the turn has it,
  if (V.face) { pen.clip(V.face); }                 // (toward profile its middle is on the face's edge, and only the near half of it is on the face)
  pen.translate(V.mouth, -244);                     // three quarters the size: a small bow, 0.3 of the face across (wider and fuller on a face of the north)
  pen.scale(V.mouthW * feel.lips * 0.76 * (north ? north.lipsWide : 1) * (1 - 0.18 * feel.worry),
            0.82 * (north ? north.lipsFull : 1) * (1 - 0.25 * feel.worry));   // worry presses it small
  pen.translate(-24, 244);
  if (mouth) {                                      // red lips round an open mouth
    // an open "ah" is wider than it is tall; "ee" is wider and flatter; "oo" is small and round
    var tall = (1.5 + 7.5 * mouth.open * (1 - 0.3 * mouth.wide)) * (1 - 0.25 * mouth.round);
    var across = 7 + 5 * mouth.wide - 2.5 * mouth.round + 3 * mouth.open * (1 - mouth.round);
    pen.beginPath();
    if (feel.laugh > 0.5) {                         // a laugh: a wide D, its top nearly flat and lifted at the corners, its bottom deep
      pen.moveTo(24 - across, -243.5);
      pen.quadraticCurveTo(24, -245, 24 + across, -243.5);
      pen.quadraticCurveTo(24, -241 + tall * 2.2, 24 - across, -243.5);
      pen.closePath();
    } else {
      pen.ellipse(24, -241 - tall * 0.15, across, tall, 0, 0, 7);
    }
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

// A fellow's face, drawn as ladyFace() draws hers, with the same arguments (shut, mouth, glance, V, feel). Reads
// NORTH_FACE. Returns nothing: it draws with pen. person() calls it.
// e.g. manFace(false, mouthAt(SUNG), 0, view(0, false, null), feelingOf({}));
function manFace(shut, mouth, glance, V, feel) {
  var lift = (mouth ? 6 * mouth.open : 0) + 8 * feel.wonder + 7 * feel.fear - 5 * feel.anger + feel.browUp + 2 * feel.worry
           - 2 * (shut === true ? 1 : shut || 0);                 // the brows drop a little in a blink
  var wide = 1 + 0.3 * feel.wonder - 0.15 * feel.smile + 0.45 * feel.fear - 0.2 * feel.anger - 0.3 * feel.sad + 0.1 * feel.worry;
  var knit = 0.4 * feel.anger - 0.3 * feel.sad + 0.15 * feel.fear - 0.4 * feel.worry;   // the brows' inner ends: down in anger, up in sadness and worry
  var slant = 0.9 * feel.anger - 0.7 * feel.sad - 0.6 * feel.worry, close = 3 * feel.worry;   // as the lady's, worry more: his brows are often under a head-cloth
  var side = V.side || 0;                           // how far his profile has taken over (see view())
  var look = glance.length ? [glance[0] + 2.5 * side, glance[1]] : glance + 2.5 * side;   // in profile the iris sits in the front half
  // A face of the north (NORTH_FACE): smaller eyes than the comic fellow's, further apart, their middles
  // where his were; the brows lower, flatter and darker; the nose its own (northNose); the lips fuller.
  var north = NORTH_FACE, apart = north ? north.apart : 0, small = north ? north.eyeSmall : 1;
  var browDown = north ? north.browLowMan : 0, arch = north ? north.browArch : 1, weight = north ? north.browHeavy : 1;
  var eyeY = -282 + 8 * (1 - small);
  if (V.nearW > 2) { eye(V.near + 1 - apart, eyeY, V.nearW * 0.93 * feel.eyes, 8.5 * small * wide * feel.eyes, shut, look, -1, 0, slant, feel.laugh > 0.5); }   // long, narrow eyes
  if (V.nearW > 2) { brow(V.near + 1 - apart + close, -312 - lift + browDown, V.nearW * 0.93, 10 * arch, 2.8 * weight, knit); }
  if (V.farW > 2) {                                 // the far eye and its brow: toward profile they go round the edge of the face, and it cuts them
    pen.save();
    if (V.face) { pen.clip(V.face); }
    eye(V.far + 1 + apart * 0.7, eyeY - 1, V.farW * 0.96 * feel.eyes, 8 * small * wide * feel.eyes, shut, look, 1, 0, slant, feel.laugh > 0.5);
    brow(V.far + 1 + apart * 0.7 - close, -313 - lift + browDown, V.farW * 0.96, 9 * arch, 2.5 * weight, -knit);
    pen.restore();
  }
  frownFold(V.nose + (V.tip - V.nose) * 0.1, -313 - lift + browDown, feel, V);
  var frown = clamp(feel.sad + 0.6 * feel.anger + 0.45 * feel.worry);  // the corners of a shut mouth go down
  if (north) { blush(V.cheek - apart, -256, 18, 0.3 + 0.2 * feel.full + 0.12 * feel.laugh); }   // a softer, larger wash on the full cheek
  else { blush(V.cheek, -254, 16, 0.42 + 0.2 * feel.full + 0.12 * feel.laugh); }
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
  pen.scale(V.mouthW * feel.lips * (north ? north.lipsWide : 1) * (1 - 0.18 * feel.worry), 1);   // worry presses it small; a face of the north's is wider
  pen.translate(-25, 0);
  pen.lineCap = "round";
  pen.lineJoin = "round";
  var plump = north ? north.lipsFull - 1 : 0;       // how much fuller than the comic fellow's the lips are
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
    var grin = 4 * feel.smile - 6 * frown;          // a bigger smile: the corners go higher; a frown: down
    if (plump > 0) {                                // full lips: a little colour above and below the line
      pen.fillStyle = "rgba(170, 90, 80, " + 0.25 * plump / 0.3 + ")";
      pen.beginPath();
      pen.moveTo(13, -248 - grin * 0.6);
      pen.quadraticCurveTo(25, -251.5 - 2 * plump, 37, -248 - grin * 0.6);
      pen.quadraticCurveTo(25, -239 - 3 * plump + grin * 0.4, 13, -248 - grin * 0.6);
      pen.fill();
    }
    pen.strokeStyle = INK;
    pen.lineWidth = LINE + 0.4 * FINE;
    pen.beginPath();
    pen.moveTo(11, -249 - grin);
    pen.quadraticCurveTo(13, -246 - grin * 0.3, 17, -245 - grin * 0.2);   // a corner that turns up
    if (feel.worry > 0) {                           // worry: the middle of the line wavers, up and then down
      pen.bezierCurveTo(23, -243 + grin * 0.27 - 4.5 * feel.worry, 29, -243.3 + grin * 0.27 + 4.5 * feel.worry, 35, -246 - grin * 0.2);
    } else {
      pen.quadraticCurveTo(26, -242 + grin * 0.5, 35, -246 - grin * 0.2);
    }
    pen.quadraticCurveTo(38, -248 - grin * 0.3, 39, -251 - grin);
    pen.stroke();
  }
  pen.strokeStyle = "rgba(58, 36, 24, 0.45)";       // the lower lip, and the dent under it (a fuller lip's lies lower and wider)
  pen.lineWidth = 2 * FINE;
  pen.beginPath();
  pen.moveTo(18 - 4 * plump, -238 + open * 0.95 - 1.5 * plump);
  pen.quadraticCurveTo(26, -235 + open * 0.95 + 2 * plump, 34 + 4 * plump, -239 + open * 0.95 - 1.5 * plump);
  pen.stroke();
  pen.restore();
  // A fellow's nose is the lady's nose, drawn bigger and broader: a bridge
  // down from between the eyes, a blunt tip, and the wing of one nostril.
  // It is a line on the face, not a ball stuck to it; in profile it fades,
  // because there the nose is the outline. (A face of the north has its own: northNose.)
  if (north) { northNose(V, false); return; }
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
//   left, mid, right   [x, y] in pen's pixels: the band's two ends and the point it bows toward
//   colour, width      a CSS colour, and the line's width in pixels (for "checks" and "checks-odd", the squares' side)
//   kind               also "checks" or "checks-odd": every other square; the two stacked make a check
// Returns nothing: it draws with pen, and leaves its strokeStyle, fillStyle, lineWidth and lineJoin as it set them.
// e.g. stripe([-30, 40], [0, 46], [30, 40], STYLE.gold, 3, "diamonds");
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
//   phase        radians: the rock's phase (a beat's 2 pi gives one swing a beat)
//   colour       a CSS colour
//   stripes      (kind may also be "checks" or "checks-odd": see stripe())
// All lengths are in pen's pixels, with the waist at (0, 0). Reads BODY (its waist and hem) and clock. Returns
// nothing: it draws with pen.
// e.g. tier(120, 50, 10, clock * Math.PI * 2 / BEAT, "#a33a2a", 4, [[0.85, STYLE.gold, 3, "diamonds"]]);
function tier(long, wide, reach, phase, colour, deep, stripes, pushes) {
  var waist = BODY.waist;                           // the body's waist, where the cloth hangs from (BODIES); its hem wider with it
  wide += BODY.hem;
  // a point on one edge: u is 0 at the waist and 1 at the hem
  function edge(u, side) {
    var late = phase - 1.6 * u;                     // lower cloth is later in the swing
    var drift = -reach * Math.pow(u, 1.3) * Math.sin(late);
    var half = waist + (wide - waist) * Math.pow(u, 0.75);
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
  pen.moveTo(-waist, -6);
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
// x, y: its middle; r: its radius, in pixels. Drawn in the person's hair colour, HAIR and HAIR_LINE (until
// 2026-10-21 always the kit's dark brown, and an elder's white hair had dark curls). Returns nothing.
// e.g. curl(-40, -330, 8);
function curl(x, y, r) {
  pen.beginPath();
  pen.ellipse(x, y, r, r * 0.86, 0, 0, 7);
  pen.fillStyle = HAIR;              // the person's hair (an elder's white too), as the rest of it
  pen.fill();
  pen.strokeStyle = HAIR_LINE;
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
//   phase        radians: where the swing is (tier()'s phase)
//   plain        true: a straight lock that narrows to its tip, with no curl
// Units are pen's pixels; drawn in the person's hair colour, HAIR and HAIR_LINE. Returns nothing.
// e.g. lock(-40, -338, 150, 11, 6, clock * 3, true, follow("noi/tail", -40, -338, 50, 6, 40));
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
  pen.fillStyle = HAIR;              // the person's hair (an elder's white too), as the rest of it
  pen.fill();
  pen.strokeStyle = HAIR_LINE;
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
// lines: a list of such lines, in pen's pixels; they are drawn in HAIR_LINE and a light by turns. Returns nothing;
// leaves pen's lineCap "round".
// e.g. combed([[-30, -330, 0, -352, 34, -336], [-24, -322, 4, -344, 38, -326]]);
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
//   x, y     the wrist, in pen's pixels
//   angle    in radians: 0 points along +x
// Reads SKIN and clock (each finger moves a little by itself). Returns nothing: it draws with pen. It is the flat
// hand (STYLE.hands "flat"); hand() is the one drawn in the round.
// e.g. glove(40, -60, 1.2, 1, true, 0.6, false);
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
//   pose.arch      0 to 1: the fingers bent back at the knuckle, as the dance hand holds them;
//                  or four numbers, one for each finger, the first to the little one
//   pose.still     true: no little life in the fingers (a hand of dance is held, not trembling;
//                  so is a hand at rest in a film where nobody hops)
//   pose.pinch     [finger, amount]: the thumb's tip brought to the pad of the first finger
//                  (0) or the middle one (1), amount 0 to 1 (pinchThumb()); the jeeb
//   pose.thumb     1 or -1: which side the thumb is on, as glove() takes it (the two hands are mirrors)
//   pose.palm      the turn of the hand about its own length: 0 the back toward us, 1 the palm,
//                  0.5 the thumb's edge toward us, -0.5 the little finger's edge
//   pose.pitch     the turn about the across line, in radians: above 0 the fingertips come toward us
//   pose.nails     as glove(): true for gold tips, "long" for the nails of fon lep
//   pose.colour    the skin (SKIN unless told)
var HAND = {palm: 9.5, wrist: 6.5, knuckle: 13, apart: 5.2, fat: 2.5, thick: 2.4, finger: 12.5,
            lengths: [1.02, 1.16, 1.08, 0.84], thumb: 13};
var REST = [0.2, 0.26, 0.32, 0.38, 0.45];           // a hand hanging at rest: the fingers gently curled, the little one most

// The hands of classical dance, Thai and Khmer, as hand() takes them (owner,
// 2026-10-16: "focus on these hand positions", with pictures of the Thai wong
// and jeeb and the chart "The Meaning of Hands' Gestures in Khmer Dance").
// Four forms of the hand:
//   wong     the four fingers together, straight, bent far back at the knuckles, the thumb in
//   jeeb     the thumb's tip pressed to the first finger's, the other three fanned and bent back
//   fan      all the fingers spread and bent back (the kit's dance hand before 2026-10-16)
//   point    the first finger out straight, the thumb pressed to the middle one, the rest curled
var HAND_FORMS = {
  wong: {curls: [0, 0, 0, 0, 0.55], spread: 0.03, arch: 1},
  jeeb: {curls: [0.85, 0, 0, 0, 0.3], spread: 0.35, arch: [0, 0.8, 0.9, 1], pinch: [0, 1]},
  fan: {curls: [0, 0, 0, 0, 0.1], spread: 0.6, arch: 0.6},
  point: {curls: [0, 0.85, 0.9, 0.9, 0.5], spread: 0.05, arch: [0.15, 0, 0, 0], pinch: [1, 1]}
};
// The hands a look can ask for by name (gestureA, gestureB): [its form, how far
// the wrist bends the hand back, away from the head (radians), its turn (palm,
// as hand() takes it: 0.45 shows the thumb's edge, the side the forms read
// from), and 1 for a hand turned down: its fingers point to the ground, a
// little out, whichever way the forearm goes ("down toward the palm" turned a
// lowered hand's fingers up, for its back faces in)].
// The Khmer names are the chart's: planting is the pointing hand turned down, a
// seed put in the ground; growing, turned up; young leaves the open fan; leaves
// the wong; flowering and ripe fruit the jeeb turned up; fruit the jeeb with
// its palm toward us; falling fruit the jeeb turned down.
var GESTURES = {
  wong: ["wong", 0.5, 0.45, 0], jeeb: ["jeeb", 0.4, 0.45, 0], jeebDown: ["jeeb", 0, 0.45, 1], fan: ["fan", 0.4, 0.3, 0], point: ["point", 0, 0.45, 0],
  planting: ["point", 0, 0.45, 1], growing: ["point", 0.3, 0.45, 0], youngLeaves: ["fan", 0.4, 0.3, 0], leaves: ["wong", 0.5, 0.45, 0],
  flowering: ["jeeb", 0.4, 0.45, 0], fruit: ["jeeb", 0.4, 0.75, 0], fallingFruit: ["jeeb", 0, 0.45, 1], ripeFruit: ["jeeb", 0.6, 0.45, 0]
};

// A hand of dance, whole: a name of GESTURES, or {from, to, u} for a hand
// part of the way from one to the other; gives back the form, the wrist's
// bend and the turn, mixed. A hand goes from one form to the next joint by
// joint, and the thumb's pinch closes or opens with it.
// gesture: a name of GESTURES ("jeeb"), or {from: name, to: name, u: 0 to 1}. Returns {curls, spread, arch: four
// numbers, pinch, wrist, palm, down}: its curls, spread, arch and pinch are hand()'s pose, wrist the bend in
// radians. An unknown name warns and gives "wong".
// e.g. var g = gestureOf({from: "wong", to: "jeeb", u: 0.5});
function gestureOf(gesture) {
  function one(name) {
    var g = GESTURES[name];
    if (!g) { warn("no hand of dance is called " + name + "; GESTURES has " + Object.keys(GESTURES).join(", ")); g = GESTURES.wong; }
    var form = HAND_FORMS[g[0]];
    return {curls: form.curls, spread: form.spread, arch: [0, 1, 2, 3].map(function (f) { return Array.isArray(form.arch) ? form.arch[f] : form.arch; }),
            pinch: form.pinch, wrist: g[1], palm: g[2], down: g[3]};
  }
  if (typeof gesture === "string") { return one(gesture); }
  var a = one(gesture.from), b = one(gesture.to), u = clamp(gesture.u);
  var finger = (u < 0.5 ? a.pinch || b.pinch : b.pinch || a.pinch);
  return {curls: a.curls.map(function (c, i) { return mix(c, b.curls[i], u); }), spread: mix(a.spread, b.spread, u),
          arch: a.arch.map(function (c, i) { return mix(c, b.arch[i], u); }),
          pinch: finger ? [finger[0], mix(a.pinch ? a.pinch[1] : 0, b.pinch ? b.pinch[1] : 0, u)] : undefined,
          wrist: mix(a.wrist, b.wrist, u), palm: mix(a.palm, b.palm, u), down: mix(a.down, b.down, u)};
}

// A dancer's lifted hands, unless a look names them: one in wong and one in
// jeeb, as Thai dancers hold them, changing over every eight seconds, each
// hand going from one form to the other in the first 1.2 s of the eight,
// slowly, as a Lanna dancer's hands do (owner's reference, 2026-10-16).
// near: true for the near hand (the two are out of step); t: seconds. Returns a name of GESTURES, or {from, to,
// u} while it changes: what gestureOf() takes.
// e.g. var g = gestureOf(danceHand(true, t));
function danceHand(near, t) {
  var period = Math.floor(t / 8), u = clamp((t - period * 8) / 1.2);
  var now = (period + (near ? 0 : 1)) % 2 ? "jeeb" : "wong", before = now === "jeeb" ? "wong" : "jeeb";
  return u >= 1 ? now : {from: before, to: now, u: u * u * (3 - 2 * u)};
}

// The thumb of a pinch: from its root t0 to the pad of a fingertip ("tip" as
// hand() keeps it: [point, way, back of the joint, across]), the two bones of
// the thumb bending out at their joint, toward the thumb's side and the back
// of the hand, as a thumb does when it presses a fingertip; its root comes
// forward too, as a thumb's does to meet a finger (a curled finger's tip is
// well in front of the palm, out of reach of a root left at the wrist).
// "amount" takes it there from where it was (t0, t1, t2), so a hand can
// close into the pinch. It gives back the thumb's three points.
// t0, t1, t2: the thumb's root, joint and tip, [x, y, z] in the hand's frame; tip: [point, way, back, across],
// each [x, y, z]; amount: 0 to 1. Returns [root, joint, tip], each [x, y, z]. hand() calls it.
// e.g. var thumb = pinchThumb([-4, 5.7, -1], [3, 15, -3], [5, 23, -6],
//                         [[24, 8, -4], [1, 0, 0], [0, 0, 1], [0, 1, 0]], 0.8);
function pinchThumb(t0, t1, t2, tip, amount) {
  var root = [t0[0] + 2 * amount, t0[1], t0[2] - 5 * amount];
  var goal = [0, 1, 2].map(function (i) { return tip[0][i] - tip[2][i] * HAND.fat * 0.9; });   // the pad, under the fingertip's back
  var first = HAND.thumb, second = HAND.thumb * 0.7;
  var to = [0, 1, 2].map(function (i) { return goal[i] - root[i]; });
  var far = Math.sqrt(to[0] * to[0] + to[1] * to[1] + to[2] * to[2]) || 1;
  var way = to.map(function (v) { return v / far; }), reach = Math.min(far, first + second - 0.01);
  var along = (first * first - second * second + reach * reach) / (2 * reach);
  var high = Math.sqrt(Math.max(0, first * first - along * along));
  var out = [0, 1, 0.6], dot = out[0] * way[0] + out[1] * way[1] + out[2] * way[2];
  var side = [0, 1, 2].map(function (i) { return out[i] - dot * way[i]; });
  var sideLong = Math.sqrt(side[0] * side[0] + side[1] * side[1] + side[2] * side[2]) || 1;
  var joint = [0, 1, 2].map(function (i) { return root[i] + way[i] * along + side[i] / sideLong * high; });
  var end = [0, 1, 2].map(function (i) { return root[i] + way[i] * reach; });
  return [root, t1.map(function (v, i) { return mix(v, joint[i], amount); }), t2.map(function (v, i) { return mix(v, end[i], amount); })];
}

// A bare hand drawn in the round. x, y, angle and pose are listed at the top of this section (pixels and radians,
// as glove() takes them). Reads clock (a little life in the fingers, unless pose.still). Returns nothing: it draws
// with pen.
// e.g. hand(40, -60, 1.2, {curls: REST, thumb: 1, palm: 0.2});
function hand(x, y, angle, pose) {
  var curls = pose.curls || REST, spread = pose.spread === undefined ? 0.15 : pose.spread;
  var arches = [0, 1, 2, 3].map(function (f) { return Array.isArray(pose.arch) ? pose.arch[f] : pose.arch || 0; });   // each finger's bend back, or one for all
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
    var mine = 0.08 + 1.3 * curls[n] + (pose.still ? 0 : 0.03 * Math.sin(clock * 7 + n * 1.7));   // its own curl, and a little life (none in a held hand of dance)
    var fan = place * spread * (0.6 + 0.4 * Math.abs(place));
    var dirX = Math.cos(fan), dirY = Math.sin(fan); // the way it leaves the knuckle, in the palm's plane
    var bends = [mine * 0.62 - arches[n] * 0.6, mine * 0.7 - arches[n] * 0.3, mine * 0.5 - arches[n] * 0.1];   // a fist folds most at the knuckle, so from the back it shows knuckles, not fingers
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
  if (pose.pinch && pose.pinch[1] > 0) {            // a pinch, the jeeb of Thai and Khmer dance: the thumb's tip to a fingertip's pad
    var pinched = pinchThumb(t0, t1, t2, tips[pose.pinch[0]], clamp(pose.pinch[1]));
    t0 = pinched[0];
    t1 = pinched[1];
    t2 = pinched[2];
  }
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
// x, y: the heel, in pen's pixels; lifted: 0 on the ground to 1 lifted (the toes tip down by up to 0.45
// radians); small: true for a child's foot. Returns nothing: it draws with pen in SKIN.
// e.g. foot(-6, 0, 0, false);
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
// x, y: the heel, in pen's pixels; lifted: 0 on the ground to 1 lifted; small: true for a child's. Returns nothing:
// it draws a brown shoe with pen.
// e.g. shoe(-6, 0, 0.3, false);
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
// Points and widths are in pen's pixels; swell: how far the sides bow out beyond the ends, in pixels. Returns
// nothing: it begins a new path on pen and closes it, but neither fills nor inks it.
// e.g. bone(0, -100, 10, -40, 12, 9, 2); shape(SKIN);
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
// Points and widths are in pen's pixels; colour a CSS colour. It is not inked. Returns nothing.
// e.g. paintBone(0, -100, 10, -40, 12, 9, SKIN);
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
// key: a name for the arm ("noi/armA"), or nothing for no memory; gain: a number, above 0 when the first elbow
// is better. Returns -1 to 1. Reads clock; keeps its state in BENDS[key].
// e.g. var side = bendOf("noi/armA", 5);
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
//   wx, wy         the wrist asked for, from the shoulder, in pixels (down is +y)
// Changes BENDS[key] when a key is given (bendOf(), and the way it points).
// e.g. var at = armJoints(30, 100, 62, 58, 1, "noi/armA", 1);
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
//   x1, y1, x2, y2   the root and the end asked for, in pen's pixels
//   colour           a CSS colour
//   prefer           function (point) giving a number, or the joint itself as [x, y]
// Returns [endX, endY, jointX, jointY], in pen's pixels. It draws with pen.
// e.g. limb(20, -190, 30, -22, 106, 102, BODY.leg, "#3d4f78", function (knee) { return knee[0]; });
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
//   shoulderX, shoulderY   the shoulder, in pen's pixels
//   hand                   [across, down] from the shoulder, in pixels; or handFor()'s [x, y, 1]
//   outward                1 or -1: which side of the body the arm is on
//   colour                 the sleeve's or the skin's CSS colour
// Draws the arm, not the hand, as thick as BODY.arm. Returns [wristX, wristY, elbowX, elbowY], in pen's pixels.
// Changes BENDS[key].
// e.g. var wrist = arm(44, -112, [14, 82], 1, SKIN, "noi/armA");
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
  return limb(shoulderX, shoulderY, shoulderX + at[0], shoulderY + at[1], 62, 58, BODY.arm, colour,
              [shoulderX + at[2], shoulderY + at[3]], 0.4);
}

// The hand to give an arm so that its wrist comes to (dx, dy) from its
// shoulder. arm() does not put the wrist where the hand is given: a hand
// given near folds the arm and one given far straightens it. This is that
// rule turned round, for a wrist that has to be at a place: on a rope, in a
// friend's hand, against the other wrist. A wrist can be 32 to 119 from its
// shoulder.
// dx, dy: where the wrist must be, from the shoulder, in pixels. Returns [x, y, 1], to pass to arm() (or as a
// look's handA, handB).
// e.g. arm(44, -112, handFor(30, 60), 1, SKIN, "noi/armA");
function handFor(dx, dy) {
  var far = Math.sqrt(dx * dx + dy * dy) || 1;
  var long = Math.max(32, Math.min(119, far));
  var given = long < 74 ? (long - 30) / 2.2 : long / 1.3;
  return [dx / far * given, dy / far * given, 1];   // the 1 tells arm() that the wrist has to come to the very place
}

// A leg from a hip to an ankle: a thigh, a knee and a shin. A knee bends
// forward, the way the person faces, and never back.
//   hipX, hipY, ankleX, ankleY   in pen's pixels
//   thin                         true under a skirt: shorter, thinner bones (BODY.legThin; else BODY.leg)
//   colour                       a CSS colour
// Returns [ankleX, ankleY, kneeX, kneeY], as limb() does. It draws with pen.
// e.g. legOf(20, -190, 30, -16, false, "#3d4f78", leggyOf(0));
function legOf(hipX, hipY, ankleX, ankleY, thin, colour, longer) {
  // under a skirt the bones are a little shorter, so the knees stay inside the cloth;
  // "longer" is how much longer than the cartoon's the legs are (1 unless a build is given)
  return limb(hipX, hipY, ankleX, ankleY, (thin ? 86 : 106) * longer, (thin ? 84 : 102) * longer,
              thin ? BODY.legThin : BODY.leg, colour,
              function (knee) { return knee[0]; });
}

// A length of cloth round the legs of one who sits, or the two legs together
// in trousers: a bone from (ax, ay) to (bx, by), its line, and the woven
// bands that go across it.
//   bands      as tier() takes them, or nothing
//   from, to   how far down the whole cloth this length begins and ends (0 is the waist, 1 the hem)
//   open       how much of it, from its start, has no line (0 to 1)
// Points and widths are in pen's pixels (widths are half-widths, as bone() takes them); colour a CSS colour.
// Returns nothing: it draws with pen.
// e.g. wrap(4, -54, 92, -21, 24, 17, "#2f3f6e", SINS[0][1], 0.1, 0.5, 0.35);
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
//   kind     also "astride": one who rides, the near leg hanging down the animal's side (in cloth, both legs, as
//            side-saddle)
//   hipY     the hips' height, in pen's pixels: below 0, above the ground
// It draws in pen's frame as it is (the caller has moved pen to the person's place on the ground).
// e.g. var joints = seated("cross", -60, "#3d4f78", null, false, 1);
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
// build: -1 to 1, default 0. Returns 0.85 to 1.3.
// e.g. leggyOf(-1)   // 0.85
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
// Points in pen's pixels. Returns nothing: it draws with pen.
// e.g. tattoo(10, -190, 30, -100);
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
// Drawn about pen's origin, which is the wrist: count rings in STYLE.gold, from the wrist up the forearm (until
// 2026-10-21 it drew count + 1, and every look's count was one less than the rings it showed).
// count: a whole number. Returns nothing.
// e.g. pen.translate(wristX, wristY); bangles(1.2, 2);
function bangles(angle, count) {
  pen.save();
  pen.rotate(angle);
  for (var ring = 0; ring < count; ring++) { oval(-8 - ring * (count > 4 ? 3.4 : 4.5), 0, 2.2, 10, STYLE.gold); }   // five or more: closer
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
           sabai: ["#3f8f5a", "#e0b23a"], tail: true, pins: true, nails: "long", fan: true, bangles: 6,
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
  noble: {bare: true, regalia: true, turban: "#b8294a", pins: true, bangles: 5, sarong: ["#8a2a3a", BROCADE], shirt: "#ffffff",
          legs: "#3d4f78", size: 1.3, skin: "#f1d2b4", smile: 0.6, eyes: 1.04, lips: 0.95},
  // a Lanna monk's robe is dyed with jackfruit heartwood, an ochre-brown, not Bangkok's orange (it was "#e07a1f" until 2026-10-13)
  monk: {shirt: "#b8732a", legs: "#9a5e20", size: 1.3, sarong: "#b8732a", shaved: true, plain: true, smile: 1, skin: "#e8c09a"},
  // a girl of the village paintings: a white blouse, a shoulder cloth, an indigo sin with a red foot
  maiden: {bun: true, dance: true, shirt: "#f4efe2", sin: 0, sabai: ["#8fc0cf", "#2f4a7a"], size: 1.3, earplug: "#d9b24a",
           flower: "#fff6ea", collar: ["#2f4a7a", "#e0b23a"], bangles: 4, skin: "#f3d2b0", smile: 1, eyes: 1.08},
  // an older woman: an indigo blouse buttoned down the front, a green and black sin, a pin in her bun
  weaver: {bun: true, shirt: "#34507a", sin: 1, size: 1.25, plain: true, bangles: 2, skin: "#e2b68e", smile: 1, eyes: 0.9, lips: 1.12,
           earplug: "#b8a060"},                     // a village woman's ear plug was a rolled palm leaf; a well-off one's gold
  // a little boy and a little girl: small, with a child's build (a large round head on shorter legs) and large eyes.
  // He wears an indigo shirt and trousers; she a white blouse, a red sin, and a flower in her hair
  boy: {bare: true, turban: "#b8294a", sabai: ["#6fae5a", "#c8486e", "check"], sarong: "#5a3f32", patoi: 0.75,
        shirt: "#3f6a8a", legs: "#34496b", size: 0.8, build: -1, head: 1.06, skin: "#f0c9a2", eyes: 1.3, smile: 1, wonder: 0.3},
  girl: {bun: true, shirt: "#f4efe2", sin: 2, size: 0.78, build: -1, head: 1.08, flower: "#f28fa8", skin: "#f4d3b4", eyes: 1.4,
         lips: 0.85, smile: 1, bangles: 2},
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
                eyes: 0.85, lips: 0.95, smile: 1, bangles: 2},
  devotee: {bun: true, shirt: "#f6f1e6", sin: 0, sabai: ["#f6f1e6", "#cfc7b4"], size: 1.2, hair: "#a9a39a", age: 0.7, bend: 0.06, earplug: "#d9b24a",
            skin: "#ecc8a2", eyes: 0.9, smile: 1, holding: "lotus", flower: "#fff6ea"},
  // Six people with faces of the north (look.north, from the photograph of about 1909; owner, 2026-10-18: "Add 2 men
  // and women and 1 child of each gender with a Northern style face shape"), each face its own shape, each named as
  // the north names people. In-ta, a Chiang Mai man as the travellers saw him: head uncovered, a round-necked indigo
  // shirt, the cloth hitched to the knee over the tattoo. Kham-mun, bare and tattooed under a white head-cloth, a checked
  // cloth over the shoulder. Bua-kham in the everyday knot at the nape, a white blouse and a green and black sin.
  // Si-nuan with her knot on the crown, a dark blouse, a brick-red sin. The boy Bun-ma, bare in a hitched cloth, a
  // turmeric check over his shoulder;
  // the girl Dok-kham in a pale yellow blouse, an indigo sin, a flower in her hair.
  inta: {shirt: "#34507a", sarong: "#3a4660", patoi: 0.75, tattoo: true, legs: "#3d4f78", size: 1.3, skin: "#d6a272",
         north: "square", smile: 1},
  khammun: {bare: true, turban: "#efe9dc", sabai: ["#c8486e", "#2f4a7a", "check"], sarong: "#6a3a2a", patoi: 0.75, tattoo: true,
            shirt: "#4a6797", legs: "#3d4f78", size: 1.3, skin: "#c99668", north: "broad", smile: 1},
  buakham: {bun: "low", shirt: "#f4efe2", sin: 1, sabai: ["#e6a7b6", "#a8435a"], size: 1.25, earplug: "#d9b24a", flower: "#fff6ea",
            bangles: 3, skin: "#e8bf98", north: "soft", smile: 1},
  sinuan: {bun: "wong", shirt: "#2e2f3e", sin: 2, size: 1.25, flower: "#f28fa8", bangles: 4, earplug: "#d9b24a", skin: "#dcae84",
           north: "round", smile: 1},
  bunma: {bare: true, sabai: ["#e0b23a", "#8a5a2a", "check"], sarong: "#34496b", patoi: 0.75, shirt: "#3f6a8a", legs: "#34496b", size: 0.8, build: -1, head: 1.09,
          skin: "#e2b088", eyes: 1.25, north: "full", smile: 1, wonder: 0.3},
  dokkham: {bun: true, shirt: "#f6e3a1", sin: 0, size: 0.78, build: -1, head: 1.1, flower: "#f28fa8", skin: "#eebf96", eyes: 1.3,
            lips: 0.9, north: "round", smile: 1, bangles: 2}
};

// name: a name of CAST ("lady"; an unknown one warns and gives a bare figure); more: the look's keys to change,
// or nothing. Returns a new look; CAST is not changed.
// e.g. person(700, GROUND, cast("lady", {late: 0.5}));
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
// rows: how many rows of squares; long: the cloth's length in pixels at size 1. Returns a list of bands, as tier()
// and look.sarong take them ([colour, bands]).
// e.g. var look = cast("farmer", {sarong: ["#efe6d2", takong(9, 112)]});
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
//   t      seconds; past the last key's time it starts again from the first (the keys loop)
//   keys   [[time, look], [time, look, "snap"], ...]: at least two, the times rising
//   hold   0 to 1, default 0.5
// Returns a new look; the keys are not changed.
// e.g. var keys = [[0, {handA: [30, -80]}], [2, {handA: [60, 20]}], [4, {handA: [30, -80]}]];
//      person(700, GROUND, Object.assign(cast("dancer"), poseAt(t, keys)));
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
// Points and lengths in pixels; prefer: function (point) giving a number, the higher one wins. Returns [x, y].
// e.g. var knee = jointOf(20, -190, 30, -22, 92, 90, function (k) { return k[0]; });
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
// x, y: where it stands, in pen's pixels; look: a person's look (it reads size, sit, handA, handB, raise, bend,
// tilt, turn, glance, dance, face, and warns about names LOOK_KEYS lacks). Returns nothing: it draws with pen.
// e.g. stick(700, GROUND, {handA: [30, -80], bend: 0.1, size: 1.3});
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

// It reads BEAT and the look's size, stride, skirt, sin, sarong and patoi; the look given is not changed.
// e.g. var walk = stroll(t, 200, 1100, 2, cast("lady")); person(walk.x, GROUND, walk.look);
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

// The ways a lady wears her hair, by their names in "bun" (true is "high"),
// each with its knot's half width and half height. Read from the hair notebook
// (2026-10-17): the sources' own words in docs/kit/figures.md, "A lady's hair".
//   high   the kit's own: one high bun at the back of the head, a gold comb across it
//   wong   klao wit wong: a round knot on the crown with a lock looped up in its
//          middle and a long pin through it (the murals of Wat Phumin and Wat Phra
//          Singh; the Tai Lue wear it, under a head-cloth: turban, pink for a maiden)
//   low    kao phom, the everyday bun: coiled low at the back of the head, at the
//          nape, held by a comb of ivory (wi sap)
//   ipun   klao i-pun, Princess Dara Rasami's from 1914: the hair over the brow
//          raised on a cushion into a high frame, the knot behind it, a jewelled pin
var BUN_STYLES = {high: [25, 21], wong: [20, 15], low: [23, 18], ipun: [22, 18]};
var COMBED = {
  high: [[-44, -300, -30, -340, -4, -356], [-32, -306, -14, -338, 10, -357], [-20, -312, 0, -344, 20, -358],
         [-6, -315, 14, -345, 32, -355], [8, -318, 28, -346, 44, -350]],
  wong: [[-44, -300, -40, -344, -16, -384], [-30, -306, -22, -348, -6, -386], [-16, -312, -6, -352, 2, -388],
         [0, -316, 10, -352, 10, -386], [14, -318, 26, -352, 18, -382]],
  low: [[20, -372, -40, -372, -78, -318], [28, -360, -30, -356, -74, -306], [34, -346, -20, -340, -68, -296],
        [38, -332, -10, -322, -60, -288]],
  ipun: [[48, -334, 40, -384, 0, -394], [36, -328, 24, -380, -12, -386], [20, -322, 6, -370, -24, -374],
         [2, -318, -14, -358, -34, -364]]
};

var HIDEABLE = {hair: true};                       // the parts a look may hide (look.hidden)
var LOOK_KEYS = {};

["age", "anger", "at", "bangles", "bare", "beard", "bend", "blink", "body", "build", "bun", "buttons", "coat", "collar", "dance", "drum", "earplug", "eyes", "face",
 "fan", "fear", "feel", "fingersA", "fingersB", "floor", "flower", "full", "garland", "gestureA", "gestureB", "glance", "gloves", "grip", "ground", "hair", "halo", "handA",
 "handB", "hat", "head", "hidden", "holding", "id", "late", "laugh", "lady", "legs", "lips", "maiwai", "malai", "mouth", "nails", "north", "palmA", "palmB", "parasol", "patoi", "pins", "plain", "raise", "reachA", "reachB",
 "regalia", "regalia", "regalia", "rig", "sabai", "sad", "sarong", "shaved", "shirt", "shoes", "shoulders", "sin", "sing", "sit", "size", "skin", "skirt", "sleepy",
 "smile", "spring", "step", "stride", "sway", "tail", "tattoo", "tears", "tilt", "turban", "turn", "twist", "ueang", "up", "wai", "weave", "wonder", "worn", "worry", "wrap", "wristA", "wristB"
].forEach(function (name) { LOOK_KEYS[name] = true; });

// One villager, standing on (x, y). Everything about them is in "look".
// (Every key the kit reads is in this list, and every key in it is read:
// checks/kit_check.py compares the two.)
//   size            how large the figure is drawn: 1.25 to 1.5 fills the frame for three to five people
//   body            which body (BODIES): "slim", the kit's own (unless told), or "fat", drawn as its own shape: a
//                   broad back, sloping shoulders, a thick neck, a round belly carried low (a lady's a fuller bust and
//                   a soft belly), thicker arms and legs, wider hips, and its cloth cut wider; a child at its measure
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
//   maiwai, malai, ueang
//                   more of a lady's ornaments, from the hair notebook: dok mai wai (true, or the
//                   colour of its metal: flowers on fine springs set in the knot, that tremble as
//                   she moves), a malai rat klao (jasmine bound round the knot, a tassel of it
//                   swinging below), and a spray of dok ueang phueng, the golden orchid, that
//                   hangs from the knot's side and nods after the head
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
//   bangles         how many rings on each wrist (a lady has 3 unless told, anyone else 2, one in a coat none)
//   skin            this figure's own skin colour ("#rrggbb"); otherwise STYLE.skin
//   eyes, lips      the face's own measure: how large its eyes and how wide its mouth are (1 is the kit's)
//   head            how wide the head is: 0.9 for a lady unless told (a longer oval, lifted on
//                   a neck), 1 for a fellow or a child (the round head of the cartoon), and for a
//                   face of the north its shape's own width
//   north           a face of the north, as a photograph of about 1909 shows Northern Thai people:
//                   the name of its shape, "round", "square", "broad", "soft" or "full" (see
//                   NORTH_FACES; true is "round"). Broad cheekbones and a round jaw, small eyes set
//                   apart under a heavy lid, low straight brows, a short nose with a low bridge and a
//                   broad base, full lips. A child's (build below 0) has half of each, and stays round
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
//   hat, bun        a woven hat, or a lady's hair tied up: true, or the name of a way of
//                   wearing it, "wong", "low" or "ipun" (see BUN_STYLES)
//   lady            true: a woman's face, chest, neck, hands and jewellery; false: a man's. Left out, it follows
//                   bun (hair tied up is a lady), so the hair and the one who wears it can be chosen apart:
//                   {lady: true} with no bun is a woman with a fellow's hair, {bun: "low", lady: false} a man with a knot
//   turban          a colour: a Lanna head-cloth, a band tied round the head with the hair above it
//   tears           0 to 1: the eyes brim and a drop gathers at each and falls, now and then (owner, 2026-10-20: "Add
//                   some tears for when the boy cries"); with a sad feeling
//   wrap            a colour: a ruler's head-cloth of silk wound over the whole head, gold along its turns, its end
//                   standing at the side, a gold pin at the front: what the rulers of Lanna wore, not the Siamese
//                   court's spired crown (the kit's research, 2026-10-20; owner: "Historical Lanna"); it hides
//                   the hair under it
//   hidden          the parts not drawn: ["hair"] draws no hair at all (no knot, no bun, no hair under a hat), so a
//                   hat or a head-cloth of any shape can be worn over any hair (owner, 2026-10-20: "add a
//                   visibility feature for hair to the kit so future hats no matter the style can be worn with
//                   any hair by making the hair invisible")
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
//   wonder, smile, fear, anger, sad, sleepy, full, worry, laugh
//                   0 to 1 each: what the face feels (see FEELINGS); sleepy also nods and
//                   yawns, full shuts its eyes now and then, and laugh laughs, each at the
//                   person's own time
//   feel            a feeling by name: "neutral", "happy", "laughing", "sad", "concerned", "angry",
//                   "sleepy", "satiated", "surprised", or "fear" ("calm", "joy", "surprise"
//                   and "anger" still work); it also leans the body and tilts the head,
//                   unless bend or tilt is given
//   dance           true: a lifted hand takes the pose of Thai dance
//   gestureA, gestureB  a hand of classical dance by name (GESTURES): "wong", "jeeb", "jeebDown",
//                   "fan", "point", or the Khmer dance's "planting", "growing", "youngLeaves",
//                   "leaves", "flowering", "fruit", "fallingFruit", "ripeFruit"; or {from, to, u}
//                   for a hand on its way between two. A dancer's lifted hands take wong and jeeb
//                   by themselves (danceHand), changing over every eight seconds
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
//   ground          false: no shadow on the ground, for a figure cut from paper (the figures
//                   of light of a khom phat, khom.js), whose shape is all there is of it
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

// person() draws by personDrawn(), below. Should that fail part-way, what it had set is put back before the error
// goes on: the pen on the sheet (not on her layer, where every later frame would be drawn unseen), the usual skin,
// hair and body, and her layers with nothing left open on them. A page that keeps drawing after an error, as the
// cartoon maker does, then draws its next frame as it would have.
function person(x, y, look) {
  var sheetPen = pen;
  try {
    return personDrawn(x, y, look);
  } catch (error) {
    pen = sheetPen;
    PERSON_LAYERED = false;
    [PERSON_LAYER, WAI_LAYER].forEach(function (layer) { if (layer) { unwound(layer); } });
    personDone();
    throw error;
  }
}

// What person() sets for one person, back as it is for whatever is drawn next.
function personDone() {
  FINE = 1;
  LINE = STYLE.line;
  SKIN = STYLE.skin;
  HAIR = STYLE.hair;
  HAIR_LINE = "#7a5640";
  PAINTED = true;
  NORTH_FACE = null;
  EYE_LIDS = null;
  EYE_TEARS = 0;
  BODY = BODIES.slim;
}

// Every save() of a sheet put back, after an error left some open; restore() with none open does nothing, and no
// drawing nests anywhere near this deep.
function unwound(brush) {
  for (var k = 0; k < 64; k++) { brush.restore(); }
}

function personDrawn(x, y, look) {
  // the person being drawn: each stage below reads from it what it needs, and adds what it worked out
  var fig = {x: x, y: y, look: look};
  personLook(fig);
  personGround(fig);
  personLegs(fig);
  personTrunk(fig);
  personReach(fig);
  personBody(fig);
  personHead(fig);
  return personArms(fig);
}

// person(), stage 1 of 8: the look worked out into this person's numbers for this frame: who they are, whether they sit,
// the beat, the squash, the build, the arms' rest, the sway, the kick, the tips and the turn
function personLook(fig) {
  // where and how, as person() was called
  var look = fig.look, x = fig.x, y = fig.y;
  checkNames("The look's name", look, LOOK_KEYS);
  if (clock !== DRAWN_AT) { DRAWN = 0; DRAWN_AT = clock; }     // the n-th person drawn in a frame is the same person in the next
  var who = look.id || "n" + (DRAWN++);
  var rig = look.rig;                             // a puppet of drawn parts, or nothing
  var lady = look.lady !== undefined ? !!look.lady : !!look.bun;   // a woman's face, chest, neck, hands and jewellery (lady), whatever her hair
  // hidden: the parts not drawn, so that a hat or a head-cloth of any shape can be worn over any hair ("hair")
  (look.hidden || []).forEach(function (part) { checkName("A part to hide", part, HIDEABLE); });
  var hairShown = (look.hidden || []).indexOf("hair") < 0 && !look.wrap;   // a wound head-cloth covers the hair
  // A parasol on its way down to her side, or carried there, hangs behind her
  // (owner, 2026-10-15: "when the women put the parasols down they are behind
  // the body not in front"). She is drawn on a layer of her own, the parasol
  // goes onto the sheet first, and her layer over it; at the start of the
  // swing back a copy in front fades out, so it goes behind without a jump.
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
    inFront = 1 - clamp(hangs / 0.2) * clamp(hangs / 0.2) * (3 - 2 * clamp(hangs / 0.2));   // as it starts back from straight down, beside her skirt, before it can cross her
  }
  // One who sits on the floor: "side" or "cross" (see seated()), or nothing.
  var seat = rig || !look.floor ? null : look.floor === true ? (lady ? "side" : "cross") : look.floor;
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
  NORTH_FACE = northFace(look);
  // the lids eye() draws: a face of the north's own heavy lid, folded too while STYLE.lids is "folded"; or everyone's
  var folds = STYLE.lids === "folded";
  EYE_LIDS = NORTH_FACE ? (folds && NORTH_FACE.eyes !== "folded" ? Object.assign({}, NORTH_FACE, {eyes: "folded", fold: 0}) : NORTH_FACE)
                        : folds ? FOLDED_EYE : null;
  EYE_TEARS = clamp(look.tears || 0);
  if (look.body !== undefined) { checkName("A body", look.body, BODIES); }
  BODY = BODIES[look.body] || BODIES.slim;        // the body (BODIES): its chest, its measures, its cloth                   // a face of the north, or none
  // a tube of cloth to the ankle: a lady's pha sin (one of SINS) or a man's sarong
  var tube = look.sin !== undefined ? SINS[look.sin % SINS.length] : Array.isArray(look.sarong) ? look.sarong : look.sarong ? [look.sarong, SARONG_BANDS] : null;
  var slight = look.skirt || look.sin !== undefined;   // a lady's smaller feet, and her anklets
  var joints = {size: (look.size || 1) * 0.82, face: look.face || 1};   // where the joints come to on the film: person() gives this back
  function spot(lx, ly) {                         // a point of the drawing, in the film's own pixels
    var p = pen.getTransform().transformPoint(new DOMPoint(lx, ly));
    return [p.x, p.y];
  }
  joints.stand = spot(x, y);                        // where the person stands, which neither the hop nor the rock moves (a bubble keeps to it)
  var sceneFrame = pen.getTransform(), figureFrame = null;   // the scene's frame, and (below) the figure's own: for joints.rest
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
  var feel = feelingOf(look, clock + ownTime(who)); // the feeling on the face, and what it does to the body
  // Arms hang unless a scene places them: almost straight, a little out from
  // the body, the hand at rest. A walker swings each with the leg on the
  // other side, from the shoulder: the arm going forward bends a little more
  // at the elbow and its hand lifts, the arm going back is at its straightest.
  // The figure is seen from the front and a little to one side, so neither
  // hand crosses to the other side of the body, and the two never meet.
  var swing = look.step ? Math.cos(walk) * Math.min(1.6, gait) : 0;
  var handA = look.handA || (look.parasol ? parasolHand(parasolOf(look.parasol).tilt, parasolOf(look.parasol).hang) : look.holding === "stick" ? [34, 62] : [BODY.hand + 16 * swing, 97 - 12 * Math.max(0, swing)]);   // a hand on a stick is held forward, one on a parasol up to its handle
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
  var hipHalf = blend3(bodyTurn, BODY.hips[0], BODY.hips[1], BODY.hips[2]), footHalf = blend3(bodyTurn, BODY.feet[0], BODY.feet[1], BODY.feet[2]);   // each leg's root and foot, this far from the middle
  var sideOn = bodyTurn < -0.5;                     // nearer profile than three-quarter: the far side goes behind the body
  // what the stages after this one use
  Object.assign(fig, {bodyTurn: bodyTurn, build: build, chestTurn: chestTurn, dip: dip, feel: feel,
    figureFrame: figureFrame, footHalf: footHalf, gait: gait, hairShown: hairShown, handA: handA, handB: handB,
    hipHalf: hipHalf, hipTip: hipTip, hipX: hipX, hipY: hipY, inFront: inFront, joints: joints, lady: lady,
    land: land, layered: layered, leggy: leggy, look: look, rig: rig, rock: rock, scene: scene,
    sceneFrame: sceneFrame, seat: seat, sheetPen: sheetPen, shoulderTip: shoulderTip, sideOn: sideOn, size: size,
    slight: slight, small: small, speed: speed, spot: spot, still: still, sung: sung, swayAt: swayAt, swing: swing,
    tallness: tallness, tube: tube, turned: turned, umbrellaAt: umbrellaAt, up: up, who: who});
}

// person(), stage 2 of 8: on the ground, before the figure: its shadow, and the dust of a landing
function personGround(fig) {
  // what the stages before this one worked out
  var land = fig.land, look = fig.look, seat = fig.seat, size = fig.size, still = fig.still, up = fig.up, x = fig.x,
      y = fig.y;

  // a soft shadow on the ground, smaller while they are in the air (none for ground: false)
  if (look.ground !== false) {
  pen.fillStyle = "rgba(70, 45, 30, 0.22)";
  pen.beginPath();
  if (seat === "astride") { pen.rect(x, y, 0, 0); }   // one who rides is not on the ground, and has no shadow on it
  else if (seat) { pen.ellipse(x + (seat === "side" ? 16 : 0) * size * (look.face || 1), y + 3, 124 * size, 15 * size, 0, 0, 7); }
  else { pen.ellipse(x, y + 4, (BODY.shadow - up * 26) * size, (17 - up * 5) * size, 0, 0, 7); }
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
  }                                                 // end of the shadows on the ground

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
}

// person(), stage 3 of 8: the figure's own frame, and the legs: a thigh and a shin each, the walk, the feet, and the cloth
// a sitter's legs are in
function personLegs(fig) {
  // what the stages before this one worked out
  var figureFrame = fig.figureFrame, footHalf = fig.footHalf, gait = fig.gait, hipHalf = fig.hipHalf,
      hipTip = fig.hipTip, hipX = fig.hipX, hipY = fig.hipY, joints = fig.joints, leggy = fig.leggy, look = fig.look,
      rig = fig.rig, rock = fig.rock, seat = fig.seat, sideOn = fig.sideOn, size = fig.size, slight = fig.slight,
      spot = fig.spot, swing = fig.swing, tallness = fig.tallness, tube = fig.tube, up = fig.up, x = fig.x, y = fig.y;
  pen.save();
  pen.translate(x, y - (seat ? 0 : up * 26 * size));
  pen.scale(size * (look.face || 1) / Math.sqrt(tallness), size * tallness);
  figureFrame = pen.getTransform();

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
  // what the stages after this one use
  Object.assign(fig, {ankles: ankles, figureFrame: figureFrame, knees: knees});
}

// person(), stage 4 of 8: at the waist: the breath, the spine, the chest's outline, the shoulders that work with the
// arms, the back of the sabai, and the skirt
function personTrunk(fig) {
  // what the stages before this one worked out
  var ankles = fig.ankles, chestTurn = fig.chestTurn, dip = fig.dip, handA = fig.handA, handB = fig.handB,
      hipTip = fig.hipTip, hipX = fig.hipX, hipY = fig.hipY, joints = fig.joints, knees = fig.knees, lady = fig.lady,
      layered = fig.layered, leggy = fig.leggy, look = fig.look, rig = fig.rig, seat = fig.seat,
      sheetPen = fig.sheetPen, shoulderTip = fig.shoulderTip, spot = fig.spot, still = fig.still,
      swayAt = fig.swayAt, tube = fig.tube, turned = fig.turned, x = fig.x;

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
  // A face of the north is as broad as its shape says, a lady's too.
  var narrow = (look.head !== undefined ? look.head : NORTH_FACE ? NORTH_FACE.wide : lady ? 0.9 : 1) * BODY.face, long = narrow < 1 ? 1 : 0;
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
  // The back of a sabai hangs behind the arm, and a parasol that hangs behind
  // her is in that arm's hand: so on the sheet, before the parasol, not on her
  // layer over it (owner, 2026-10-19: "When the women are walking away with
  // their umbrellas, you can't see 2 of the handles": the cloth hid them).
  function sabaiBack(cloth, border) {
    if (!layered) { sabaiBackDrawn(cloth, border); return; }
    var frame = pen.getTransform();
    pen = sheetPen;
    pen.save();
    pen.setTransform(frame);
    sabaiBackDrawn(cloth, border);
    pen.restore();
    pen = PERSON_LAYER;
  }
  function sabaiBackDrawn(cloth, border) {          // the back of the sabai, hanging from the top end's corner at the shoulder
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
  // what the stages after this one use
  Object.assign(fig, {chest: chest, ground: ground, long: long, narrow: narrow, neckX: neckX, phase: phase,
    sabaiLine: sabaiLine, spine: spine});
}

// person(), stage 5 of 8: the arms worked out before they are drawn: the trunk, the shoulders, where each hand goes, the
// hands and the far arm
function personReach(fig) {
  // what the stages before this one worked out
  var build = fig.build, chest = fig.chest, chestTurn = fig.chestTurn, handA = fig.handA, handB = fig.handB,
      lady = fig.lady, leggy = fig.leggy, look = fig.look, phase = fig.phase, rig = fig.rig, scene = fig.scene,
      small = fig.small, spine = fig.spine, still = fig.still, up = fig.up, who = fig.who;
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
  var rootHalf = blend3(chestTurn, BODY.root[0], BODY.root[1], BODY.root[2]);      // the shoulders this far from the spine: over the middle in profile, widest seen from the front
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
  var handSize = (look.gloves ? 1.25 : lady ? 0.95 : 1.1) * arms;
  var rings = look.bangles !== undefined ? look.bangles : lady ? 3 : look.coat ? 0 : 2;   // a coat's sleeves: none
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
  // a little of the thumb's edge, so the fingers stack; in a film where nobody
  // hops it is still, with no flex and no life in its fingers. A hand closed round
  // a thing shows its thumb's edge, where a fist reads as one. palmA and
  // palmB turn a hand as a scene wants it.
  function handPose(which, wrist, given) {
    var near = which === "A", bend = near ? look.wristA : look.wristB, fingers = near ? look.fingersA : look.fingersB, turned = near ? look.palmA : look.palmB;
    var rest = given[1] >= 0 && !look.grip && !look.gloves && !fingers;
    var calm = rest && still;                       // a hand at rest where nobody hops is still: no bend on the beat, no life in its fingers (owner, 2026-10-19: "the woman's hands are shaking. Can you make them still?")
    var beat = calm ? 0 : flex * (rest ? 0.3 : 1);
    var angle = Math.atan2(wrist[1] - wrist[3], wrist[0] - wrist[2]) + (near ? 1 : -1) * beat
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
    // A hand of classical dance (GESTURES): the one the look names, or, on a
    // dancer's lifted hand that nothing else shapes, wong or jeeb (danceHand).
    // The wrist bends the hand back or down, and the hand turns its thumb's edge
    // to us; the two hands mirror each other (their thumbs are on opposite sides),
    // so that both bend back away from the head, as the dancers' do.
    var gesture = near ? look.gestureA : look.gestureB, form;
    if (gesture === undefined && look.dance && given[1] < 0 && !fingers && !look.grip && !(near && look.parasol)) { gesture = danceHand(near, clock); }
    if (gesture && !look.wai) {
      form = gestureOf(gesture);
      angle -= (near ? 1 : -1) * beat;              // held steady: no bend of the wrist on the beat (owner: "stop the hands from shaking")
      var raised = angle - thumb * form.wrist, lowered = Math.PI / 2 + (near ? -0.35 : 0.35);   // bent back away from the head; or pointing down, a little out
      angle = raised + Math.atan2(Math.sin(lowered - raised), Math.cos(lowered - raised)) * form.down;   // the shorter way round
      palm = thumb * form.palm;
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
    if (open <= 0.12 && !form) { palm = 0.3; }      // closed round a thing
    if (turned !== undefined) { palm = turned; }
    return {angle: angle, open: open, curls: curls, thumb: thumb, palm: palm, nails: nails, form: form, still: calm};
  }
  // The hand in the round takes curls; a hand given only how open it is
  // (as the flat hand is) gets them by the flat hand's own rule, and past 1
  // the dance hand: fingers straight, fanned, and bent back at the knuckle
  function roundPose(pose) {
    if (pose.form) {                                // a hand of dance: its own form
      return {curls: pose.form.curls, spread: pose.form.spread, arch: pose.form.arch, pinch: pose.form.pinch,
              thumb: pose.thumb, palm: pose.palm, nails: pose.nails, still: true};
    }
    var open = Math.min(1, pose.open), back = Math.max(0, pose.open - 1), curls = pose.curls;
    if (!curls) {
      var curl = back > 0 ? 0 : 0.12 + (1 - open);
      curls = [0, 1, 2, 3].map(function (f) { return clamp((curl + 0.1 * f - 0.08) / 1.3); });
      curls.push(clamp((0.75 * (1 - open) + 1.3 * back) / 1.1));
    }
    return {curls: curls, spread: pose.curls ? 0.15 : 0.04 + 0.2 * open + 0.22 * back, arch: 0.5 * back,
            thumb: pose.thumb, palm: pose.palm, nails: pose.nails, still: pose.still};
  }
  function drawHand(which, wrist, pose) {
    var near = which === "A";
    pen.save();
    pen.translate(wrist[0], wrist[1]);
    bangles(Math.atan2(wrist[1] - wrist[3], wrist[0] - wrist[2]), rings);   // on the forearm, from the elbow to the wrist, however the hand bends (owner, 2026-10-16: "the gold bangles on her wrists should stay pinned to the arm")
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
  // what the stages after this one use
  Object.assign(fig, {armBand: armBand, armOf: armOf, arms: arms, behindA: behindA, drawHand: drawHand, flex: flex,
    handA: handA, handB: handB, handPose: handPose, poseA: poseA, rootA: rootA, rootB: rootB, sleeve: sleeve,
    small: small, trunk: trunk, wristA: wristA});
}

// person(), stage 6 of 8: the body painted over the skirt: the torso and its shading, the chest, the cloth, the neck
function personBody(fig) {
  // what the stages before this one worked out
  var chest = fig.chest, chestTurn = fig.chestTurn, ground = fig.ground, hipTip = fig.hipTip, lady = fig.lady,
      land = fig.land, long = fig.long, look = fig.look, neckX = fig.neckX, phase = fig.phase, rig = fig.rig,
      sabaiLine = fig.sabaiLine, seat = fig.seat, shoulderTip = fig.shoulderTip, spine = fig.spine, who = fig.who,
      x = fig.x;
  if (rig) {                                        // the drawn torso, hips to shoulders, slanted to where the spine ends
    pen.save();
    pen.transform(1, 0, -spine(-134) / 134, 1, 0, 0);
    part(rig, "torso", 0, 14, 0, -134, true);
    pen.restore();
  } else {
  var chests = BODY.chest[lady ? "lady" : "man"];   // the body's chest (BODIES)
  outline(blendOutline(chestTurn, chests[0], chests[1], chests[2]), chest);   // the chest, turned, bent along the spine and tipped
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
    outline(lady ? CHEST_LADY : CHEST_MAN, chest);
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
    if (!look.coat && !look.plain && !lady) {   // a breast pocket on a mo hom
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
    var cw = BODY.cloth;                            // the waist cloth, as wide as the body's waist
    pen.moveTo(-34 * cw, -14);
    pen.quadraticCurveTo(0, -6, 34 * cw, -14);
    pen.lineTo(32 * cw, 8);
    pen.quadraticCurveTo(0, 16, -32 * cw, 8);
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
  oval(neckX, -142 - (lady ? 4 : 0) - 5 * long, BODY.neck - 1.5 * long, (lady ? 28 : 24) + 6 * long, SKIN);   // a long neck, between chest and head
  pen.fillStyle = "rgba(150, 70, 60, 0.3)";         // in the shadow of the chin
  pen.beginPath();
  pen.ellipse(2 + neckX, -152 - 11 * long, 12 - 1.5 * long, 9, 0, 0, 7);
  pen.fill();
  if (lady) {                                   // a necklace, and a pendant
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
  // what the stages after this one use
  Object.assign(fig, {sabaiFront: sabaiFront});
}

// person(), stage 7 of 8: the head, in a frame of its own: the knots and ornaments, the brow, cheek, jaw and chin, the hair,
// the ears, the face, and the blink
function personHead(fig) {
  // what the stages before this one worked out
  var bodyTurn = fig.bodyTurn, dip = fig.dip, feel = fig.feel, figureFrame = fig.figureFrame,
      hairShown = fig.hairShown, joints = fig.joints, lady = fig.lady, leggy = fig.leggy, long = fig.long,
      look = fig.look, narrow = fig.narrow, neckX = fig.neckX, phase = fig.phase, rig = fig.rig, rock = fig.rock,
      sceneFrame = fig.sceneFrame, size = fig.size, small = fig.small, speed = fig.speed, spot = fig.spot,
      still = fig.still, sung = fig.sung, swayAt = fig.swayAt, up = fig.up, who = fig.who, x = fig.x, y = fig.y;

  // The head tips against the rock of the body, and settles
  // into the shoulders on the beat.
  var lagH = follow(who + "/head", neckX, -186, 90, 7, 30);    // the head lags the body, and overshoots as it stops
  pen.save();                                     // the head, in a frame of its own
  var headWide = 0.84 * narrow, headTall = 0.92 + 0.3 * (1 - narrow);
  // The head is drawn about its middle, which is 59 above its chin. A smaller
  // head is moved down by what it lost below its middle, so the chin stays
  // where it was, on the neck.
  pen.translate(neckX, -186 - (lady ? 8 : 3) - 12 * long + (still ? 0 : 8 * (1 - up)) + 59 * headTall * (1 - small));
  var tilted = look.tilt !== undefined ? look.tilt : feel.tilt;   // how far a dancer's pose, or a feeling, tilts the head
  pen.rotate(-rock * 2.4 + 0.6 * swayAt(1.3) + tilted + lagH[0] * 0.004); // the sway reaches it last
  if (rig) {                                        // the drawn head, turning about the top of the neck
    part(rig, "head", 0, 0, 0, -100);
  } else {
  pen.scale(headWide * small, headTall * small);
  LINE = LINE / small;                              // on a smaller head the pen keeps the weight it has on the body
  pen.translate(0, 286);
  joints.crown = spot(0, -348);                     // the top of the skull, and the point of the chin
  // The crown as it would be with the hop taken out: in the figure's own frame
  // the hips' dip and the head sunk into the shoulders put back, and none of
  // the lift or the squash. A bubble's box keeps to it, so it does not hop.
  var crownIn = figureFrame.inverse().transformPoint(new DOMPoint(joints.crown[0], joints.crown[1]));
  var restY = y + (crownIn.y - (still ? 0 : dip + 8 * (1 - up))) * size, rest = sceneFrame.transformPoint(new DOMPoint(x, restY));   // (a dip is downward: put back, it is taken off)
  joints.rest = [rest.x, rest.y];
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
  // A lady's knots and ornaments by the ways of the hair notebook (BUN_STYLES).
  // The high bun's fan, flower and garland are drawn here for every knot.
  function knotFan(kx, ky) {
      if (look.fan) {                                              // a fan of gold leaves behind the bun, as the paintings' dancers wear
        var fanLeans = [-1.8, -1.4, -1.0, -0.6, -0.2, 0.2, 0.6];
        for (var spoke = 0; spoke < fanLeans.length; spoke++) {
          pen.save();
          pen.translate(kx - 4, ky + 3);
          pen.rotate(fanLeans[spoke] + sway * 0.012);
          pen.translate(0, -15);
          paintLeaf(pen, 42 - 5 * Math.abs(spoke - 3), 6.5, 0, "#b8862a", "#f8e08a", "rgba(110, 70, 20, 0.9)", "rgba(255, 250, 220, 0.7)");
          pen.restore();
        }
      }
  }
  function knotFlowers(kx, ky) {
      if (look.flower) {
        for (var petal = 0; petal < 5; petal++) {                  // a flower at the bun's side
          var pa = petal / 5 * Math.PI * 2 + sway * 0.05;
          oval(kx + 26 + Math.cos(pa) * 7, ky - 6 + Math.sin(pa) * 7, 6, 4.5, look.flower, pa);
        }
        oval(kx + 26, ky - 6, 4, 4, "#f4c542");
      }
      if (look.garland) {
        pen.fillStyle = "#fffaf0";                                 // a loop of jasmine from the bun
        pen.beginPath();
        var lagG = follow(who + "/garland", kx - 4, ky + 14, 150, 9, 8);   // the loop swings after the head
        for (var bud = 0; bud <= 14; bud++) {
          var gu = bud / 14, sag = Math.sin(gu * Math.PI) * (22 + 4 * Math.sin(late) + lagG[1] * 0.5);   // the loop sags straight down
          var gx = kx - 22 + gu * 36 + sway * (1 - gu) * 0.8 + lagG[0] * Math.sin(gu * Math.PI) + downX * sag;
          var gy = ky + 14 + downY * sag;
          pen.moveTo(gx + 2.2, gy);
          pen.arc(gx, gy, 2.2, 0, 7);
        }
        pen.fill();
      }
  }
  function ladyKnot(kx, ky, style) {                // a knot that is not the high bun: wong, low or ipun
    var r = BUN_STYLES[style];
    if (style === "wong") {
      // klao wit wong: a lock drawn out of the knot into a loop (wong) that
      // stands in its middle, as the murals of Wat Phumin and Wat Phra Singh paint it
      var loopX = kx - 1 + sway * 0.3, loopY = ky - r[1] + 3;
      pen.beginPath();                                            // an arch of hair standing up out of the knot, the sky through it
      pen.ellipse(loopX, loopY, 12, 18, -0.12, Math.PI, Math.PI * 2);
      pen.ellipse(loopX, loopY + 1, 6.5, 12, -0.12, Math.PI * 2, Math.PI, true);
      pen.closePath();
      pen.fillStyle = HAIR;
      pen.fill();
      pen.strokeStyle = HAIR_LINE;
      pen.lineWidth = 2.4 * FINE;
      pen.stroke();
    }
    oval(kx, ky, r[0], r[1], HAIR);                               // the knot
    pen.strokeStyle = HAIR_LINE;                                  // the hair wound round in it
    pen.lineWidth = 2 * FINE;
    pen.beginPath();
    pen.ellipse(kx, ky, r[0] * 0.62, r[1] * 0.55, 0.4, Math.PI * 0.15, Math.PI * 1.7);
    pen.stroke();
    if (style === "wong") {
      pen.beginPath();                                            // the neck of the knot, where the hair gathers on the crown
      pen.moveTo(kx - 15, ky + r[1] - 2);
      pen.quadraticCurveTo(kx, ky + r[1] - 8, kx + 15, ky + r[1] - 2);
      pen.stroke();
      pen.lineCap = "round";                                      // a long gold pin through it, a bud at its end (Wat Nong Bua's painting)
      pen.strokeStyle = inkFor(STYLE.gold);
      pen.lineWidth = 4.6;
      pen.beginPath();
      pen.moveTo(kx - r[0] - 10, ky + 7);
      pen.lineTo(kx + r[0] + 8, ky - 5);
      pen.stroke();
      pen.strokeStyle = STYLE.gold;
      pen.lineWidth = 3;
      pen.stroke();
      oval(kx + r[0] + 10, ky - 6, 3.6, 3, STYLE.gold);
    } else if (style === "low") {
      pen.lineCap = "round";                                      // a comb (wi sap) of ivory set in across its top
      pen.strokeStyle = "#7a6a50";
      pen.lineWidth = 5.6;
      pen.beginPath();
      pen.arc(kx, ky + 4, r[0] + 1, Math.PI * 1.12, Math.PI * 1.88);
      pen.stroke();
      pen.strokeStyle = "#efe3c4";
      pen.lineWidth = 4;
      pen.stroke();
    }
  }
  function ladyMass(HL) {                           // the outline of a lady's hair, as the mass is drawn
    var mass = new Path2D();
    mass.moveTo(HL[0][0], HL[0][1]);
    mass.bezierCurveTo(HL[1][0], HL[1][1], HL[2][0], HL[2][1], HL[3][0] + sway * 0.4, HL[3][1]);
    mass.bezierCurveTo(HL[4][0] + sway * 0.4, HL[4][1], HL[5][0], HL[5][1], HL[6][0], HL[6][1]);
    mass.quadraticCurveTo(HL[7][0], HL[7][1], HL[8][0], HL[8][1]);
    mass.quadraticCurveTo(HL[9][0], HL[9][1], HL[10][0], HL[10][1]);
    mass.quadraticCurveTo(HL[11][0], HL[11][1], HL[0][0], HL[0][1]);
    mass.closePath();
    if (hairdo === "ipun") { mass.addPath(ipunOutline(HL)); }
    return mass;
  }
  function ipunOutline(HL) {                        // the raised frame's outline (see ipunFrame)
    var lift = 9, top = HL[4], brow = HL[6], peak = [top[0] + 16, top[1] - lift - 4], frame = new Path2D();
    frame.moveTo(HL[10][0] + 4, HL[10][1] - 6);
    frame.bezierCurveTo(HL[10][0] - 6, HL[10][1] - 40, top[0] - 8, top[1] - lift - 6, peak[0], peak[1]);
    frame.bezierCurveTo(peak[0] + 24, peak[1] + 2, brow[0] + 12, brow[1] - 30, brow[0] + 4, brow[1] - 2);
    frame.quadraticCurveTo(HL[7][0], HL[7][1] - 4, HL[8][0], HL[8][1] - 2);
    frame.quadraticCurveTo(HL[9][0], HL[9][1] - 4, HL[10][0] + 4, HL[10][1] - 6);
    frame.closePath();
    return frame;
  }
  function ipunFrame(HL) {
    // klao i-pun, as Princess Dara Rasami wore it from the Japanese ladies she
    // saw in Bangkok: the hair over the brow raised on a cushion (mon rong)
    // into a high smooth frame (krabang), swept up and back to the knot; and
    // a jewelled pin at its top, its stones catching the light
    var lift = 9, top = HL[4], front = HL[5], brow = HL[6], peak = [top[0] + 16, top[1] - lift - 4];
    pen.beginPath();
    pen.moveTo(HL[10][0] + 4, HL[10][1] - 6);                     // from the temple, up and round over the top
    pen.bezierCurveTo(HL[10][0] - 6, HL[10][1] - 40, top[0] - 8, top[1] - lift - 6, peak[0], peak[1]);
    pen.bezierCurveTo(peak[0] + 24, peak[1] + 2, brow[0] + 12, brow[1] - 30, brow[0] + 4, brow[1] - 2);   // and full over the brow
    pen.quadraticCurveTo(HL[7][0], HL[7][1] - 4, HL[8][0], HL[8][1] - 2);   // the hairline
    pen.quadraticCurveTo(HL[9][0], HL[9][1] - 4, HL[10][0] + 4, HL[10][1] - 6);
    pen.closePath();
    pen.fillStyle = HAIR;
    pen.fill();
    pen.strokeStyle = HAIR_LINE;
    pen.lineWidth = 3 * FINE;
    pen.stroke();
    pen.save();                                                   // the light on its round top
    pen.clip();
    var shine = pen.createRadialGradient(top[0] + 22, top[1] - lift, 3, top[0] + 22, top[1] - lift, 40);
    shine.addColorStop(0, "rgba(255, 235, 210, 0.32)");
    shine.addColorStop(1, "rgba(255, 235, 210, 0)");
    pen.fillStyle = shine;
    pen.fillRect(-100, -440, 200, 160);
    pen.restore();
    var jx = top[0] + 6, jy = top[1] - lift - 8;                  // the jewelled pin
    pen.strokeStyle = STYLE.gold;
    pen.lineWidth = 2.4;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(jx - 3, jy + 12);
    pen.lineTo(jx + 1, jy - 6);
    pen.stroke();
    for (var stone = 0; stone < 7; stone++) {
      var sa = stone / 7 * Math.PI * 2, glint = 0.55 + 0.45 * Math.sin(clock * 3.1 + stone * 1.7);
      oval(jx + 1 + Math.cos(sa) * 5.5, jy - 8 + Math.sin(sa) * 4.5, 2.2, 2.2, blend("#cfd8e0", "#ffffff", glint));
    }
    oval(jx + 1, jy - 8, 2.6, 2.6, "#d9533a");
  }
  function knotDress(kx, ky, r) {                   // the ornaments of the hair notebook: malai, ueang, maiwai
    var k, u, at;
    function bead(x0, y0, rx, ry, colour, turn) {   // a small piece with a fine line: the body's line would swallow it
      pen.beginPath();
      pen.ellipse(x0, y0, rx, ry, turn || 0, 0, 7);
      pen.fillStyle = colour;
      pen.fill();
      pen.strokeStyle = inkFor(colour);
      pen.lineWidth = 0.9 * FINE;
      pen.stroke();
    }
    if (look.malai) {
      // a malai rat klao: jasmine bound round the knot, and from its lowest
      // point a tassel (uba) of three strings of buds, each ending in a rose
      // bud, that swings after the head
      var ringY = ky + r[1] * 0.3, ringX = r[0] + 2, ringH = r[1] * 0.5;
      pen.fillStyle = "#fffaf0";
      pen.strokeStyle = "rgba(150, 130, 100, 0.7)";
      pen.lineWidth = 0.8 * FINE;
      for (k = 0; k <= 14; k++) {                                // the front of the ring: its back is behind the knot
        var ra = Math.PI * (0.02 + 0.96 * k / 14);
        pen.beginPath();
        pen.ellipse(kx + Math.cos(ra) * ringX, ringY + Math.sin(ra) * ringH, 2.8, 2.2, ra, 0, 7);
        pen.fill();
        pen.stroke();
      }
      var footX = kx - 4, footY = ringY + ringH;
      var lagU = follow(who + "/malai", footX, footY, 90, 6, 14), acrossU = lagU[0] * downY - lagU[1] * downX;
      for (var string = 0; string < 3; string++) {
        var ux = footX - 5 + string * 5, longU = 24 + string * 5 + (string === 1 ? 5 : 0);
        var swingU = Math.sin(late - 0.5 - string * 0.45) * (3 + string * 1.5) + acrossU * (0.8 + string * 0.1);
        pen.strokeStyle = "#8aa860";
        pen.lineWidth = 1 * FINE;
        pen.beginPath();
        pen.moveTo(ux, footY);
        for (k = 1; k <= 6; k++) { u = k / 6; at = hung(ux, footY, swingU * u * u, longU * u); pen.lineTo(at[0], at[1]); }
        pen.stroke();
        for (k = 1; k <= 5; k++) {
          u = k / 6;
          at = hung(ux, footY, swingU * u * u, longU * u);
          bead(at[0], at[1], 2.4, 2, "#fffaf0");
        }
        at = hung(ux, footY, swingU, longU + 3);
        bead(at[0], at[1], 3.4, 4, "#c9384a");                   // the rose bud at its end
      }
    }
    if (look.ueang) {
      // a spray of dok ueang phueng, the golden orchid, tucked in at the knot's
      // side: an arching stem of small yellow flowers, each with a deeper
      // orange lip, that hangs and nods after the head
      var ox = kx + r[0] * 0.75, oy = ky - r[1] * 0.35;
      var lagO = follow(who + "/ueang", ox, oy, 60, 5, 18), nod = Math.sin(late - 0.6) * 3 + (lagO[0] * downY - lagO[1] * downX) * 0.9;
      function sprayAt(v) { return hung(ox, oy, 16 * Math.sin(v * Math.PI * 0.9) + nod * v * v, 44 * v - 12 * Math.sin(v * Math.PI)); }
      pen.strokeStyle = "#7a8a3a";
      pen.lineWidth = 1.4 * FINE;
      pen.beginPath();
      pen.moveTo(ox, oy);
      for (k = 1; k <= 12; k++) { at = sprayAt(k / 12); pen.lineTo(at[0], at[1]); }
      pen.stroke();
      for (k = 0; k < 7; k++) {
        u = 0.25 + k * 0.12;
        at = sprayAt(u);
        var big = 1 - 0.35 * u;
        bead(at[0] - 3.2 * big, at[1] - 1, 3.8 * big, 2.4 * big, "#f4c834", -0.6);
        bead(at[0] + 3.2 * big, at[1] - 1, 3.8 * big, 2.4 * big, "#f4c834", 0.6);
        bead(at[0], at[1] + 2 * big, 3 * big, 2.6 * big, "#e9902a");
      }
    }
    if (look.maiwai) {
      // dok mai wai: flowers beaten from thin sheet metal, each on a fine coiled
      // spring set in the top of the knot, that tremble as she moves
      var metal = look.maiwai === true ? STYLE.gold : look.maiwai;
      var lagW = follow(who + "/maiwai", kx, ky - r[1], 320, 7, 9), stir = Math.min(1, Math.hypot(lagW[0], lagW[1]) / 3);
      var acrossW = lagW[0] * downY - lagW[1] * downX;
      [[-0.55, 30, 6.2], [-0.12, 38, 7], [0.32, 27, 5.6]].forEach(function (w, n) {   // [lean from upright, the stalk's length, the flower's size]
        var bx = kx - 6 + n * 6, by = ky - r[1] * 0.6;
        var a = w[0] + sway * 0.006 + acrossW / w[1] * 1.4 + (0.02 + 0.06 * stir) * Math.sin(clock * 19 + n * 2.3);
        var tx = bx + Math.sin(a) * w[1], ty = by - Math.cos(a) * w[1];
        pen.strokeStyle = inkFor(metal);
        pen.lineWidth = 1.2 * FINE;
        pen.beginPath();
        pen.moveTo(bx, by);
        for (var c = 1; c <= 8; c++) {                            // the coil of the spring, near the knot, then the wire
          var cu = c / 8 * 0.35, wob = (c % 2 ? 2 : -2) * (1 - cu);
          pen.lineTo(bx + Math.sin(a) * w[1] * cu + Math.cos(a) * wob, by - Math.cos(a) * w[1] * cu + Math.sin(a) * wob);
        }
        pen.lineTo(tx, ty);
        pen.stroke();
        for (var petal = 0; petal < 5; petal++) {
          var pa = petal * Math.PI * 0.4 + a;
          bead(tx + Math.cos(pa) * w[2] * 0.62, ty + Math.sin(pa) * w[2] * 0.62, w[2] * 0.55, w[2] * 0.36, metal, pa);
        }
        bead(tx, ty, w[2] * 0.3, w[2] * 0.3, n === 1 ? "#d9533a" : "#3f8f7a");
        pen.fillStyle = "rgba(255, 255, 240, " + (0.45 + 0.4 * Math.sin(clock * 5 + n * 2)).toFixed(2) + ")";   // a glint on the metal
        pen.beginPath();
        pen.arc(tx - w[2] * 0.5, ty - w[2] * 0.45, 1.2, 0, 7);
        pen.fill();
      });
    }
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
  var drop = mouth ? (lady ? 5 : 11) * mouth.open : 0;
  var turn = Math.max(-1, Math.min(1, look.turn !== undefined ? look.turn : bodyTurn)), V = view(turn, lady, NORTH_FACE);   // where the turn puts every feature: the head turns with the body unless told its own turn
  // Hair moves a little after the head does. On the way up it floats and
  // spreads; on the beat it drops again.
  var late = phase - 0.9;
  var toss = 9 + 9 * up;
  var afloat = 1 - 0.1 * up;
  var sway = Math.sin(late) * toss * 0.4;                        // the top of the hair leans
  if (look.bun && hairShown) {
    // Which way she wears her hair (BUN_STYLES), and where its knot sits as
    // the head turns. The knot sinks a little on the beat and leans after the
    // head, the high one most and the one at the nape least.
    var hairdo = typeof look.bun === "string" ? look.bun : "high";
    if (!BUN_STYLES[hairdo]) { checkName("A lady's hair", hairdo, BUN_STYLES); hairdo = "high"; }
    var sink = still ? 0 : 5 * (1 - up);
    var knot = hairdo === "wong" ? [V.crown[0] + sway * 0.9, V.crown[1] + sink * 0.6]
             : hairdo === "low" ? [V.nape[0] + sway * 0.3, V.nape[1] + sink * 0.4]
             : [V.bun[0] + sway, V.bun[1] + sink - (hairdo === "ipun" ? 6 : 0)];
    var knotR = BUN_STYLES[hairdo];                              // [half its width, half its height]
    // What hangs from it is set where it hangs from the high bun, moved with the
    // knot: the high bun's own stays where it always was.
    var hangX = hairdo === "high" ? 0 : knot[0] + 28, hangY = hairdo === "high" ? 0 : knot[1] + 354;
    // What hangs from a lady's bun hangs straight, as the murals paint hair:
    // a tail of hair (tail), and strands of small gold flowers (pins).
    if (look.tail) {
      if (upright) { pen.translate(-40 + hangX, -338 + hangY); pen.rotate(upright); pen.translate(40 - hangX, 338 - hangY); }     // the tail's own frame, upright
      lock(-40 + hangX, -338 + hangY, 150 * afloat, 11, toss * 1.1, late - 0.4, true, follow(who + "/tail", -40 + hangX, -338 + hangY, 50, 6, 40));
      if (upright) { pen.translate(-40 + hangX, -338 + hangY); pen.rotate(-upright); pen.translate(40 - hangX, 338 - hangY); }    // and back to the head's
    }
    if (hairdo === "low") {                                      // a knot at the nape is behind the head: the head and the hair are drawn over its front
      knotFan(knot[0], knot[1]);
      ladyKnot(knot[0], knot[1], hairdo);
      knotFlowers(knot[0], knot[1]);
      knotDress(knot[0], knot[1], knotR);
    }
    var lagP = look.pins ? follow(who + "/pins", -36 + hangX, -340 + hangY, 120, 7, 10) : [0, 0];
    var lagAcross = lagP[0] * downY - lagP[1] * downX;           // the lag, across the way they hang
    for (var strand = 0; look.pins && strand < 3; strand++) {
      var sx = -30 - strand * 6 + hangX, sy = -340 + hangY, swingS = Math.sin(late - 0.3 - strand * 0.4) * (6 + strand * 3) + lagAcross * (0.7 + strand * 0.15);
      var longS = 48 + strand * 8, middleS = hung(sx, sy, -4, longS * 0.5), endS = hung(sx, sy, -8 + swingS, longS);
      pen.strokeStyle = "#b8862a";
      pen.lineWidth = 1.6;
      pen.beginPath();
      pen.moveTo(sx, sy);
      pen.quadraticCurveTo(middleS[0], middleS[1], endS[0], endS[1]);
      pen.stroke();
      pen.fillStyle = STYLE.gold;
      for (var bud = 1; bud <= 4; bud++) {
        var u = bud / 4, budAt = hung(sx, sy, -6 * u + swingS * u * u, longS * u);
        pen.beginPath();
        pen.ellipse(budAt[0], budAt[1], 3.4, 2.2, 0.5, 0, 7);
        pen.fill();
      }
    }
  }                                                                // a man has no tuft at the nape: the back of his head is shaved (Hallett, 1890)
  // The ear nearest the camera, where the turn puts it; as the head comes
  // round, the far ear shows at the other side.
  var earX = V.ear, earLess = V.side * (lady ? 1 : 0.4);     // in profile an ear is smaller: a lady's small, a fellow's a little
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
    if (lady && !look.earplug) {
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
  if ((lady || look.regalia) && !look.earplug && !earInFront) { earring(); }   // it hangs with its ear: behind the head here, before it toward profile
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
  var piece = V.side > 0 ? profilePiece(V.tip, V.side, drop, lady) : null;
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
  V.skin = piece ? V.face : skull;                               // the face's outline at every turn: the rouge stays inside it
  light();
  pen.save();                                                    // the back of the head is in shadow;
  pen.clip(skull);                                               // the chin has none (owner, 2026-10-12)
  var shade = pen.createLinearGradient(-58, 0, -6, 0);
  shade.addColorStop(0, "rgba(150, 70, 60, " + (long ? 0.12 : 0.3) + ")");   // a lady's skin is left nearly flat, as the paintings leave it
  shade.addColorStop(1, "rgba(150, 70, 60, 0)");
  pen.fillStyle = shade;
  pen.fillRect(-60, -350, 120, 130);
  pen.restore();
  if (look.bun && hairShown) {
    // Lanna hair: pulled back smooth from the brow into one knot, and nothing
    // curls. The high bun at the back of the head (bun: true) has a comb
    // across it and stones on the comb; the other ways (BUN_STYLES) are drawn
    // by ladyKnot(), the one at the nape before the head (see above). A flower
    // sits at the knot's side (flower), and a loop of jasmine hangs from it
    // (garland). The knot leans after the head and sinks a little on the beat.
    // The mass, the hairline and the knot take their places from the turn.
    var HL = V.hairLady, bunX = knot[0], bunY = knot[1];
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
    if (hairdo === "ipun") { ipunFrame(HL); }                     // the hair over the brow raised on its cushion
    pen.save();
    pen.translate(V.hairShift, 0);                               // the comb lines go with the hairline
    if (hairdo !== "high") {                                     // the new ways' lines stay inside the hair (the outline is not shifted)
      pen.save();
      pen.translate(-V.hairShift, 0);
      pen.clip(ladyMass(HL));
      pen.translate(V.hairShift, 0);
    }
    combed(COMBED[hairdo]);                                      // fine lines, swept to the knot
    if (hairdo !== "high") { pen.restore(); }
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
    if (hairdo !== "low") { knotFan(bunX, bunY); }
    if (hairdo === "high") {
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
    } else if (hairdo !== "low") {
      ladyKnot(bunX, bunY, hairdo);
    }
    if (hairdo !== "low") {
      knotFlowers(bunX, bunY);
      knotDress(bunX, bunY, knotR);
    }
  } else if (hairShown && !look.hat && !look.shaved) {
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
  } else if (hairShown && !look.shaved) {
    pen.fillStyle = look.hair || "#2a1a12";                      // hair, under the hat
    pen.beginPath();
    pen.ellipse(0, -312, 53, 28, 0, Math.PI * 1.03, Math.PI * 1.97);
    pen.fill();
  }
  if (earInFront) {
    nearEar();
    if ((lady || look.regalia) && !look.earplug) { earring(); }
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
  if (look.wrap) {                                  // a ruler's head-cloth of silk, wound over the whole head (see wrap in LOOK_KEYS)
    pen.save();
    pen.translate(4, -312);
    pen.scale(0.69, 0.69);
    var wrapEdge = STYLE.gold, wrapInk = inkFor(look.wrap), turnN;
    pen.beginPath();                                 // the wound mass, over the crown and low on the brow
    pen.moveTo(-94, 22);
    pen.bezierCurveTo(-112, -50, -60, -96, 0, -98);
    pen.bezierCurveTo(64, -98, 112, -52, 96, 22);
    pen.quadraticCurveTo(0, 8, -94, 22);
    pen.closePath();
    pen.fillStyle = look.wrap;
    pen.fill();
    pen.strokeStyle = wrapInk;
    pen.lineWidth = 2.9 * FINE;
    pen.stroke();
    pen.save();
    pen.clip();
    for (turnN = 0; turnN < 5; turnN++) {           // the turns of the cloth, slanting across, each gold along its edge
      pen.strokeStyle = blend(look.wrap, "#000000", 0.25);
      pen.lineWidth = 3;
      pen.beginPath(); pen.moveTo(-110, 10 - turnN * 24); pen.quadraticCurveTo(0, -20 - turnN * 24, 110, -30 - turnN * 22); pen.stroke();
      pen.strokeStyle = wrapEdge;
      pen.lineWidth = 2.4;
      pen.beginPath(); pen.moveTo(-110, 4 - turnN * 24); pen.quadraticCurveTo(0, -26 - turnN * 24, 110, -36 - turnN * 22); pen.stroke();
    }
    pen.restore();
    pen.beginPath();                                 // the end of the cloth, tucked in and standing at the side
    pen.moveTo(70, -60);
    pen.quadraticCurveTo(108, -96, 96, -120);
    pen.quadraticCurveTo(80, -98, 58, -78);
    pen.closePath();
    pen.fillStyle = look.wrap;
    pen.fill();
    pen.strokeStyle = wrapInk;
    pen.lineWidth = 2.2 * FINE;
    pen.stroke();
    oval(-8, -24, 9, 11, wrapEdge);                 // the gold pin at the front, and its red stone
    oval(-8, -24, 4, 4, "#8a1f2a");
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
  shut = Math.max(shut, feel.lids);                 // a sleepy or a full face's lids hang that far
  var glance = saccade(clock + x * 0.013);
  if (look.glance) { glance = [look.glance[0], look.glance[1]]; }   // read from a face, by a track
  else if (look.at) {                                    // the eyes turn toward a thing in the scene
    var headY = y - (330 + (look.skirt ? 190 : 216) * (leggy - 1)) * size;
    glance = [Math.max(-4, Math.min(4, (look.at[0] - x) / 120 * (look.face || 1))),
              Math.max(-3, Math.min(3, (look.at[1] - headY) / 120))];
  }
  if (lady) {
    ladyFace(shut, mouth, glance, V, feel);
  } else {
    manFace(shut, mouth, glance, V, feel);
  }
  if (look.age) { ageLines(clamp(look.age), V); }
  if (look.beard) { beard(look.beard, V, drop); }
  }                                                 // end of the kit's own head
  pen.restore();                                  // back at the waist, for the arms
  // what the stages after this one use
  Object.assign(fig, {end: end});
}

// person(), stage 8 of 8: the arms, drawn last over the body and the head; what the hands hold; her layer put over the
// parasol; and the usual pen again
function personArms(fig) {
  // what the stages before this one worked out
  var armBand = fig.armBand, armOf = fig.armOf, arms = fig.arms, behindA = fig.behindA, drawHand = fig.drawHand,
      end = fig.end, flex = fig.flex, ground = fig.ground, handA = fig.handA, handB = fig.handB,
      handPose = fig.handPose, inFront = fig.inFront, joints = fig.joints, layered = fig.layered, look = fig.look,
      poseA = fig.poseA, rig = fig.rig, rootA = fig.rootA, rootB = fig.rootB, sabaiFront = fig.sabaiFront,
      sheetPen = fig.sheetPen, sleeve = fig.sleeve, spot = fig.spot, trunk = fig.trunk, umbrellaAt = fig.umbrellaAt,
      who = fig.who, wristA = fig.wristA;
  var poseB, wristB;   // declared with the arms worked out, first given a value here
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
    var end = umbrella.tilt > 1 ? Math.cos((umbrella.tilt - 1) * Math.PI) : 1;   // the handle's end below the fist; tipped on to point down (tilt 2), it comes round above
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
    pen.moveTo(gripX, gripY + 26 * end);            // the handle's end below the fist, and the handle above it: at the fist the fingers hide it
    pen.lineTo(gripX, gripY + 14 * end);
    pen.moveTo(gripX, gripY - 14 * end);
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
  personDone();                                     // the usual pen and skin again, for whatever is drawn next
  if (joints.crown && joints.chin) { sighted((joints.crown[0] + joints.chin[0]) / 2, (joints.crown[1] + joints.chin[1]) / 2); }
  return joints;
}

// A scroll cloud, as a thangka paints one: a flat underside, a row of round
// lobes along the top with a smaller row above them, every lobe outlined,
// and a curl at each end where the cloud rolls under itself. "brush" is
// the canvas to paint on; "fill" and "line" its colours. "foot" is the colour
// that gathers toward its underside: a pale blue unless told, and a thangka
// gives an ochre cloud a green one.
// brush: a 2D context (pen, or a set's hidden sheet); x, y: its middle, in that canvas's pixels;
// size: 1 is about 300 wide; fill, line, foot: CSS colours, foot "#rrggbb". Returns nothing; brush is left as it
// was found.
// e.g. scrollCloud(pen, 400, 160, 0.8, "#f6f1e6", "rgba(120, 130, 150, 0.65)");
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
// x, y: its middle, in the sheet's pixels; size: 1 is about 300 wide; dark: a CSS colour for an evening cloud,
// or nothing. Reads STYLE.clouds. Returns nothing: it draws with pen.
// e.g. cloud(300 + t * 8, 180, 0.9);
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
// a, b: "#rrggbb" colours (no other form); amount: 0 gives a, 1 gives b. Returns "#rrggbb".
// e.g. blend("#5f9a4e", "#f6f2a4", 0.3)
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
// brush: a 2D context; long and wide in its pixels (wide is about its half-width); bow: a share of long,
// default 0. Returns nothing: it begins a new path on brush and closes it, unfilled.
// e.g. leafPath(pen, 40, 10, 0.2); pen.fill();
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
// brush: a 2D context, its origin at the petal's foot; long, wide, bow: leafPath()'s; pale, deep, line: CSS
// colours. Returns nothing; leaves brush's strokeStyle, fillStyle, lineWidth and lineJoin as it set them.
// e.g. paintPetal(pen, 34, 11, 0.1, "#fff6ea", "#f28fa8", "rgba(120, 40, 60, 0.8)");
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
// brush: a 2D context, its origin at the leaf's foot; long, wide, bow: leafPath()'s; deep, pale, line, rib: CSS
// colours, rib a pale gold unless told. Returns nothing.
// e.g. paintLeaf(pen, 50, 12, 0.22, "#1f5a48", "#6fb268", "rgba(20, 50, 40, 0.85)");
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
// brush: a 2D context; x, y: the cup at its foot; size: 1 is about 70 across; colour: the tips', "#f28fa8"
// unless told; open: 0 to 1, default 1. Returns nothing; brush is left as it was found.
// e.g. lotus(pen, 820, 700, 1.4, "#f28fa8", 0.8);
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
// brush: a 2D context; size: 1 is about 104 across; tilt: radians, default 0; colour: "#rrggbb", "#5f9a4e"
// unless told. Returns nothing; brush is left as it was found.
// e.g. lotusLeaf(pen, 760, 720, 1, -0.2);
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
// All in pixels; u: 0 to 1. Returns [x, y]: the same curve stemOf() draws.
// e.g. var p = stemPoint(0, 0, 40, -200, 30, 0.5);
function stemPoint(x0, y0, x1, y1, bow, u) {
  var ax = x0 + bow, ay = mix(y0, y1, 0.35), bx = x1 - bow * 0.7, by = mix(y0, y1, 0.7), v = 1 - u;
  return [v * v * v * x0 + 3 * v * v * u * ax + 3 * v * u * u * bx + u * u * u * x1,
          v * v * v * y0 + 3 * v * v * u * ay + 3 * v * u * u * by + u * u * u * y1];
}

// A stem: one long curve, lighter than the leaves, with a line of its own.
// A lotus stem carries small prickles.
// brush: a 2D context; from (x0, y0) to (x1, y1), with stemPoint()'s bow, in pixels; colour: a CSS colour;
// prickles: true for a lotus stem. Returns nothing; leaves brush's lineCap "round".
// e.g. stemOf(pen, 700, 900, 740, 700, 40, "#b7cf86", true);
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
// brush: a 2D context; size: 1 is about 260 tall; seed: a whole number, default 0; colour: the flowers', as
// lotus() takes it; t: seconds, or nothing for a clump that stands still. Returns nothing.
// e.g. lotusClump(pen, 900, 930, 0.8, 3, "#f28fa8", t);
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
// brush: a 2D context; x, y, wide, tall: the box it fills, in pixels; colour: a CSS colour, a pale white unless
// told; t: seconds, or nothing for still water. Returns nothing; brush is left as it was found.
// e.g. waves(pen, 0, 780, WIDE, 200, "rgba(255, 250, 230, 0.6)", t);
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
// brush: a 2D context; rings: [[x, y, at], ...], x and y in pixels, at in seconds; t: seconds, on the same clock.
// Returns nothing; brush is left as it was found.
// e.g. ripples(pen, [[700, 860, 4], [920, 880, 6.5]], t);
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
// brush: a 2D context; x, y, wide, tall: in pixels; flow: {t: seconds, rings: as ripples() takes them}, or
// nothing for still water. Returns nothing; brush is left as it was found.
// e.g. pond(pen, 300, 760, 900, 220, {t: t, rings: [[700, 860, 4]]});
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

// A fish in the water, in profile: "facing" is 1 or -1. Once an orange cartoon fish; since 2026-10-20 (owner:
// "remove the orange fish from the kit or update their look to be more consistent with the kit style") one of the
// kit's native fish of a Lanna pond (nativeFish, below), as big as the old one was: a warm colour asks for the mud
// barb, whose fins are red, any other for the gourami. Its tail sweeps on the kit's clock.
// brush: a 2D context; x, y: its middle; size: 1 is the old fish's size; facing: 1 right or -1 left, default 1;
// colour: "#rrggbb" or nothing. Reads clock. Returns nothing.
// e.g. fish(pen, 640, 840, 1, -1, "#e8873a");
function fish(brush, x, y, size, facing, colour) {
  var warm = !colour || /^#(e|f|d)/i.test(colour);
  nativeFish(brush, x, y, size * 1.25, facing || 1, warm ? "barb" : "gourami", clock);
}

// The native fish of a Lanna pond, side on, as one sees them through clear water from the bank (owner, 2026-10-20:
// "A top down view wouldn't make sense for the pond scene so try again with a side view but more realistic and as
// true to the real fish as possible"). Each is drawn to the species: its outline, where each fin begins and ends, its
// markings, its scales, the rays of its fins. From the procedural_animation page's fish it keeps what a side view
// shows of swimming: the tail sweeps (seen side on, a sweeping tail narrows and widens), the soft fins and feelers
// trail and wave a moment behind the body, and every fin has its rays.
//   gourami     three-spot gourami, ปลากระดี่หม้อ (Trichopodus trichopterus): deep, flat, leaf-shaped; a small mouth
//               turned up; a small dorsal fin far back; a long anal fin under most of the belly; the pelvic fins two
//               long threads; blue-grey to olive, with faint dark wavy bars; a dark spot mid-body and one at the
//               base of the tail (the eye is the third); the eye's iris red
//   barb        silver mud barb, ปลาสร้อยนกเขา (Osteochilus vittatus): carp-shaped; a tall dorsal fin with a long base;
//               a deeply forked tail; silver, the back olive; a dark dot on each scale, so rows of dots run along it;
//               a dark blotch at the base of the tail; the tail, the pelvic and the anal fins red
//   flying      flying barb, ปลาซิวหนวดยาว (Esomus metallicus): small and slim; a dark band from the snout to the tail,
//               gold above it; two pairs of barbels, the long pair past the pectoral fins; the pectoral fins long;
//               the dorsal fin set far back; the tail forked
//   snakehead   striped snakehead, ปลาช่อน (Channa striata): long and round; a broad flat head in big plate scales, a
//               wide mouth to below the eye, the lower jaw ahead; one long low fin along the back and one under
//               the belly; a rounded tail; olive-brown above with dark chevrons on the flank pointing forward, the belly cream
// nativeFish(brush, x, y, size, facing, kind, t): its middle on (x, y), facing 1 (right) or -1, t its swim. About 46
// long at size 1 (the snakehead about 60), as the kit's earlier fish were.
var NATIVE_FISH = {
  gourami: {beat: 3.2, body: ["#6f8a8c", "#9fb3ad", "#e2e8de"], fin: "rgba(150, 170, 175, 0.62)", ray: "rgba(70, 90, 95, 0.55)", line: "#3e5254"},
  barb: {beat: 5.0, body: ["#5f6f58", "#b9c0b4", "#f2f2ec"], fin: "rgba(214, 92, 60, 0.82)", ray: "rgba(130, 44, 24, 0.6)", line: "#4a5048"},
  flying: {beat: 9.0, body: ["#8a7a3a", "#d6d6c8", "#f4f4ee"], fin: "rgba(220, 220, 205, 0.55)", ray: "rgba(120, 120, 100, 0.5)", line: "#5a5640"},
  snakehead: {beat: 1.6, body: ["#3f3a26", "#7a7050", "#e6dcc0"], fin: "rgba(110, 100, 70, 0.8)", ray: "rgba(50, 44, 28, 0.6)", line: "#2e2a1c"}
};

// kind: one of NATIVE_FISH (an unknown kind is drawn as a gourami); t: seconds, default 0. Returns nothing;
// brush is left as it was found.
// e.g. nativeFish(pen, 640, 850, 1, 1, "snakehead", t);
function nativeFish(brush, x, y, size, facing, kind, t) {
  t = t || 0;
  var F = NATIVE_FISH[kind] || NATIVE_FISH.gourami, unit = (kind === "snakehead" ? 60 / 260 : 46 / 200) * size;
  var beat = t * F.beat, sweep = Math.sin(beat), line = 1 / unit;   // a line of about one pixel at any size
  brush.save();
  brush.translate(x, y);
  brush.scale(unit * (facing || 1), unit);
  brush.lineJoin = "round";
  brush.lineCap = "round";
  function mid(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
  function curve(points, closed) {                   // a smooth line through the midpoints of the points
    var n = points.length, s = closed ? mid(points[n - 1], points[0]) : points[0];
    brush.moveTo(s[0], s[1]);
    for (var i = closed ? 0 : 1; i < n - (closed ? 0 : 1); i++) { var m = mid(points[i], points[(i + 1) % n]); brush.quadraticCurveTo(points[i][0], points[i][1], m[0], m[1]); }
    if (!closed) { brush.lineTo(points[n - 1][0], points[n - 1][1]); }
  }
  function along(points, u) {                        // a point a share u of the way along a line of points
    var lens = [0], total = 0, i;
    for (i = 1; i < points.length; i++) { total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]); lens.push(total); }
    var want = u * total;
    for (i = 1; i < points.length; i++) {
      if (lens[i] >= want) { var f = (want - lens[i - 1]) / ((lens[i] - lens[i - 1]) || 1); return [points[i - 1][0] + (points[i][0] - points[i - 1][0]) * f, points[i - 1][1] + (points[i][1] - points[i - 1][1]) * f]; }
    }
    return points[points.length - 1];
  }
  // A fin: its base from b0 to b1 on the body, its free edge through the points of edge (from b0's side round to
  // b1's), a soft skin of the fin's colour, and rays from the base out to the edge.
  function fin(b0, b1, edge, rays, colour, rayColour) {
    var outline = [b0].concat(edge, [b1]);
    brush.beginPath(); curve(outline, false); brush.closePath();
    brush.fillStyle = colour || F.fin; brush.fill();
    brush.strokeStyle = F.line; brush.globalAlpha = 0.55; brush.lineWidth = line * 0.8; brush.stroke(); brush.globalAlpha = 1;
    brush.strokeStyle = rayColour || F.ray; brush.lineWidth = line * 0.6;
    for (var i = 1; i < rays; i++) {
      var u = i / rays, from = [b0[0] + (b1[0] - b0[0]) * u, b0[1] + (b1[1] - b0[1]) * u], to = along(edge, u);
      brush.beginPath(); brush.moveTo(from[0], from[1]); brush.quadraticCurveTo(from[0] + (to[0] - from[0]) * 0.5 + 2, from[1] + (to[1] - from[1]) * 0.6, to[0], to[1]); brush.stroke();
    }
  }
  function wave(points, amp, lag) {                  // a soft fin's edge, rippling back along it
    return points.map(function (p) { return [p[0], p[1] + amp * Math.sin(beat * 0.8 - p[0] * 0.05 + (lag || 0))]; });
  }
  // The tail, seen side on as it sweeps: narrower as it turns toward or away, wider as it comes square on.
  function tail(root, points, rays) {
    var square = 0.58 + 0.42 * Math.abs(Math.cos(beat));
    var swept = points.map(function (p) { return [root[0] + (p[0] - root[0]) * square, p[1] + (p[0] - root[0]) * 0.06 * sweep]; });
    fin([root[0], root[1] - (kind === "snakehead" ? 18 : 12)], [root[0], root[1] + (kind === "snakehead" ? 18 : 12)], swept, rays);
  }
  function body(outline, top, bottom) {               // the body: dark above, pale below, a sheen along its middle
    brush.beginPath(); curve(outline, true); brush.closePath();
    var g = brush.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, F.body[0]); g.addColorStop(0.45, F.body[1]); g.addColorStop(1, F.body[2]);
    brush.fillStyle = g; brush.fill();
  }
  function inBody(outline, draw) { brush.save(); brush.beginPath(); curve(outline, true); brush.closePath(); brush.clip(); draw(); brush.restore(); }
  function ink(outline) { brush.beginPath(); curve(outline, true); brush.closePath(); brush.strokeStyle = F.line; brush.lineWidth = line; brush.stroke(); }
  function scales(x0, x1, y0, y1, r, colour, dot) {  // rows of scales, each row half a scale on from the last
    brush.strokeStyle = colour; brush.lineWidth = line * 0.55;
    for (var row = 0, yy = y0; yy < y1; yy += r * 0.9, row++) {
      for (var xx = x1 - (row % 2) * r; xx > x0; xx -= r * 1.6) {
        brush.beginPath(); brush.arc(xx, yy, r, Math.PI * 0.62, Math.PI * 1.38); brush.stroke();
        if (dot) { brush.fillStyle = dot; brush.beginPath(); brush.arc(xx - r * 0.55, yy, r * 0.16, 0, 7); brush.fill(); }
      }
    }
  }
  function eye(ex, ey, r, iris) {
    brush.fillStyle = iris; brush.beginPath(); brush.arc(ex, ey, r, 0, 7); brush.fill();
    brush.strokeStyle = F.line; brush.lineWidth = line * 0.8; brush.stroke();
    brush.fillStyle = "#0e0c0a"; brush.beginPath(); brush.arc(ex + r * 0.08, ey, r * 0.58, 0, 7); brush.fill();
    brush.fillStyle = "rgba(255, 255, 255, 0.85)"; brush.beginPath(); brush.arc(ex + r * 0.3, ey - r * 0.3, r * 0.2, 0, 7); brush.fill();
  }
  function gill(gx, top, bottom) {                   // the edge of the gill cover, behind the eye
    brush.strokeStyle = F.line; brush.globalAlpha = 0.6; brush.lineWidth = line * 0.8;
    brush.beginPath(); brush.moveTo(gx + 6, top); brush.quadraticCurveTo(gx - 6, (top + bottom) / 2, gx + 4, bottom); brush.stroke();
    brush.globalAlpha = 1;
  }

  if (kind === "gourami") {
    var gBody = [[98, -2], [82, -20], [44, -38], [-8, -42], [-44, -32], [-62, -14], [-66, 0], [-62, 14], [-44, 28], [-6, 38], [42, 36], [80, 20], [96, 8]];
    tail([-62, 0], [[-70, -16], [-90, -34], [-102, -26], [-98, 0], [-102, 26], [-90, 34], [-70, 16]], 10);   // rounded, a shallow notch
    fin([30, 34], [-58, 16], wave([[24, 48], [0, 60], [-30, 60], [-58, 50], [-72, 34]], 2.5), 16);          // the long anal fin
    fin([-26, -40], [-50, -28], wave([[-32, -54], [-48, -56], [-62, -38]], 2), 6);                            // the small dorsal, far back
    body(gBody, -50, 46);
    inBody(gBody, function () {
      scales(-60, 70, -44, 44, 6.5, "rgba(40, 60, 64, 0.22)");
      brush.strokeStyle = "rgba(48, 66, 70, 0.13)";                          // faint, uneven wavy bars, broken in places
      for (var b = -50, q = 0; b < 64; b += 9 + 6 * dice(q * 3 + 1), q++) {
        brush.lineWidth = 3 + 4 * dice(q * 7 + 2);
        brush.beginPath(); brush.moveTo(b + 6 * dice(q), -44); brush.bezierCurveTo(b - 8, -20 + 10 * dice(q + 5), b + 9, 6, b - 3 + 6 * dice(q + 9), 40); brush.stroke();
      }
      brush.fillStyle = "#1d2628";                                           // the two spots
      brush.beginPath(); brush.ellipse(-4, 0, 9, 8, 0, 0, 7); brush.fill();
      brush.beginPath(); brush.ellipse(-58, 0, 7, 7, 0, 0, 7); brush.fill();
      brush.fillStyle = "rgba(170, 200, 210, 0.25)"; brush.fillRect(-70, -6, 170, 5);   // a blue sheen
    });
    ink(gBody);
    gill(58, -26, 28);
    brush.strokeStyle = F.line; brush.lineWidth = line;                      // the small mouth, turned up
    brush.beginPath(); brush.moveTo(96, -3); brush.lineTo(90, -1); brush.stroke();
    fin([58, 8], [52, 18], wave([[44, 22], [36, 24], [34, 16]], 1.5, 1), 5, "rgba(220, 230, 225, 0.45)");   // the clear pectoral
    eye(78, -10, 7, "#c4532e");
    brush.strokeStyle = "rgba(225, 232, 226, 0.9)"; brush.lineWidth = line * 1.2;   // the two feelers, trailing and waving
    [0, 1].forEach(function (k) {
      var sway = Math.sin(beat * 0.7 + k * 1.3);
      brush.beginPath(); brush.moveTo(48, 30);
      brush.bezierCurveTo(30, 60 + sway * 5, -20, 70 - sway * 6 + k * 6, -70 - k * 8, 74 + sway * 8 + k * 4); brush.stroke();
    });
  } else if (kind === "barb") {
    var bBody = [[100, 3], [88, -12], [58, -28], [14, -34], [-26, -30], [-58, -15], [-68, -7], [-70, 0], [-68, 7], [-58, 15], [-24, 25], [20, 29], [62, 24], [90, 13]];
    tail([-68, 0], [[-74, -12], [-96, -40], [-110, -50], [-100, -22], [-86, 0], [-100, 22], [-110, 50], [-96, 40], [-74, 12]], 14);   // deeply forked
    fin([14, -33], [-28, -30], wave([[16, -56], [6, -72], [-8, -64], [-22, -48], [-34, -34]], 1.5), 12, "rgba(170, 120, 100, 0.7)");   // the tall dorsal, a long base
    fin([-6, 27], [-20, 25], wave([[-10, 42], [-22, 44], [-26, 31]], 1.5), 6);                                         // pelvic
    fin([-34, 22], [-48, 19], wave([[-38, 37], [-50, 39], [-56, 26]], 1.5, 1), 6);                                     // anal
    body(bBody, -40, 34);
    inBody(bBody, function () {
      scales(-66, 84, -32, -6, 7, "rgba(60, 70, 60, 0.3)");                                // the back's scales, plain
      scales(-66, 84, -6, 30, 7, "rgba(60, 70, 60, 0.3)", "rgba(40, 44, 40, 0.5)");       // below, a dark dot on each: lines of dots along the rows
      brush.strokeStyle = "rgba(60, 64, 60, 0.4)"; brush.lineWidth = line * 0.7;          // the lateral line
      brush.beginPath(); brush.moveTo(64, -12); brush.quadraticCurveTo(0, -4, -64, 0); brush.stroke();
      brush.fillStyle = "#22261f"; brush.beginPath(); brush.ellipse(-60, 0, 9, 8, 0, 0, 7); brush.fill();   // the blotch at the tail
      brush.fillStyle = "rgba(255, 255, 255, 0.22)"; brush.fillRect(-60, -8, 150, 6);                       // the silver sheen
    });
    ink(bBody);
    gill(64, -22, 24);
    brush.strokeStyle = F.line; brush.lineWidth = line * 0.9;                // the mouth under the snout, and its small barbels
    brush.beginPath(); brush.moveTo(94, 8); brush.lineTo(86, 10); brush.moveTo(90, 10); brush.lineTo(84, 18); brush.stroke();
    fin([62, 14], [56, 22], wave([[46, 30], [38, 32], [38, 22]], 1.5, 1), 6, "rgba(214, 120, 90, 0.6)");   // pectoral
    eye(80, -6, 7.5, "#d8d8cc");
  } else if (kind === "flying") {
    var fBody = [[98, 0], [84, -12], [50, -18], [0, -19], [-44, -14], [-66, -7], [-72, 0], [-66, 7], [-44, 12], [0, 17], [50, 16], [84, 10]];
    tail([-70, 0], [[-76, -8], [-96, -28], [-106, -32], [-96, -12], [-86, 0], [-96, 12], [-106, 32], [-96, 28], [-76, 8]], 12);
    fin([-22, -18], [-38, -15], wave([[-28, -34], [-40, -34], [-46, -20]], 1), 6);               // dorsal, set far back
    fin([-30, 14], [-46, 11], wave([[-36, 26], [-48, 26], [-52, 15]], 1, 1), 6);                 // anal
    fin([60, 10], [54, 14], wave([[30, 26], [-4, 30], [-10, 22], [20, 16]], 1.5, 1), 8);          // the long pectoral
    body(fBody, -19, 17);
    inBody(fBody, function () {
      scales(-70, 86, -18, 16, 4.5, "rgba(80, 80, 60, 0.25)");
      brush.fillStyle = "rgba(214, 178, 70, 0.55)"; brush.fillRect(-80, -8, 180, 4);       // the gold above the band
      brush.fillStyle = "#2a2a22"; brush.beginPath();                                        // the dark band, snout to tail
      brush.moveTo(96, -1); brush.quadraticCurveTo(10, -6, -76, -2); brush.lineTo(-76, 3); brush.quadraticCurveTo(10, 0, 96, 3); brush.closePath(); brush.fill();
    });
    ink(fBody);
    gill(66, -12, 12);
    brush.strokeStyle = "rgba(230, 226, 205, 0.9)"; brush.lineWidth = line * 0.9;   // the barbels: a short pair and a long pair, waving
    var s1 = Math.sin(beat * 0.5);
    brush.beginPath(); brush.moveTo(94, 4); brush.quadraticCurveTo(84, 18, 74, 20 + s1 * 2);
    brush.moveTo(92, 6); brush.bezierCurveTo(78, 30, 40, 36 + s1 * 4, 10, 40 + s1 * 6); brush.stroke();
    eye(82, -3, 6, "#e6e2c8");
  } else {                                          // the snakehead
    var sBody = [[130, 4], [122, -14], [96, -26], [60, -30], [0, -30], [-60, -26], [-96, -20], [-104, 0], [-96, 20], [-60, 24], [0, 28], [60, 28], [100, 22], [124, 14]];
    tail([-100, 0], [[-104, -20], [-122, -26], [-132, -12], [-134, 0], [-132, 12], [-122, 26], [-104, 20]], 12);   // rounded
    fin([66, -28], [-98, -18], wave([[56, -40], [0, -44], [-60, -40], [-96, -34], [-104, -24]], 1.8), 30);   // the long dorsal
    fin([24, 27], [-98, 18], wave([[16, 38], [-40, 40], [-90, 34], [-104, 24]], 1.8, 1), 22);               // the long anal
    body(sBody, -30, 28);
    inBody(sBody, function () {
      scales(-100, 70, -28, 26, 6, "rgba(30, 26, 16, 0.3)");
      brush.strokeStyle = "rgba(30, 26, 14, 0.3)";                            // dark chevrons along the flank, pointing forward to the head
      for (var c = -88, q = 0; c < 56; c += 15 + 7 * dice(q + 40), q++) {  // (the "Lanna fish" notebook), faint and uneven, as on the fish
        brush.lineWidth = 4 + 4 * dice(q + 60);
        var tip = [c + 10 + 4 * dice(q), 4 + 4 * dice(q + 3)];
        brush.beginPath(); brush.moveTo(c - 4, -14 + 6 * dice(q + 20)); brush.quadraticCurveTo(c + 6, -6, tip[0], tip[1]);
        brush.quadraticCurveTo(c + 4, 14, c - 6 + 4 * dice(q + 8), 22); brush.stroke();
      }
      brush.strokeStyle = "rgba(30, 26, 16, 0.45)"; brush.lineWidth = line * 0.8;   // the head's big plate scales
      [[104, -14], [92, -20], [96, -6], [84, -12]].forEach(function (p) { brush.beginPath(); brush.arc(p[0], p[1], 6, Math.PI * 0.6, Math.PI * 1.4); brush.stroke(); });
    });
    ink(sBody);
    gill(78, -24, 24);
    brush.strokeStyle = F.line; brush.lineWidth = line * 1.1;                // the wide mouth, the lower jaw ahead
    brush.beginPath(); brush.moveTo(132, 6); brush.lineTo(104, 8); brush.stroke();
    fin([72, 10], [64, 18], wave([[54, 24], [46, 26], [44, 16]], 1.2, 1), 7);   // the rounded pectoral
    eye(112, -10, 5.5, "#c8a050");
  }
  brush.restore();
}

// A small flower of five round petals, pale at their rims, with a gold heart
// brush: a 2D context; x, y: its heart; r: its radius in pixels; colour: the petals' heart, a CSS colour.
// Returns nothing.
// e.g. blossom(pen, 400, 600, 8, "#f28fa8");
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
// brush: a 2D context; x, base: its root on the ground; size: 1 is 150 to 220 tall; colour: a "#rrggbb", "#f08a5c"
// unless told; seed: a whole number, default 0. Returns nothing; brush is left as it was found.
// e.g. flowerSpray(pen, 200, GROUND, 0.9, "#f08a5c", 2);
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
// brush: a 2D context; x, y: its middle; r: its radius in pixels; colour: "#rrggbb"; seed: any number (give one:
// it turns the lobes). Returns nothing.
// e.g. leafPad(pen, 300, 500, 60, "#3f7a4a", 4);
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
// t: seconds; x, y: the first bird, the rest behind it to the left, in the sheet's pixels. Returns nothing: it
// draws six birds in INK with pen.
// e.g. birds(t, 900 + t * 40, 220);
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
//   t        seconds: they bob on the beat (hop()) and wave
//   y        the foot of the nearest row, in the sheet's pixels; the others stand higher
//   slide    pixels the rows have slid to the left (the camera passing), 0 for none
// Returns nothing: it draws three rows across the sheet with pen.
// e.g. crowd(t, 820, t * 30, false);
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
// how: {feel: a feeling, as a person's (creatureFeel())}: its head is carried
// high or low, its ears go up or back, its tail wags or droops, its brows
// and its mouth show it, and its eyes close, slant or go wide.
// x, y: where its feet stand, in the sheet's pixels; it faces right and is about 140 long. t: seconds (it
// trots on the beat). how: {feel}, or nothing; another name warns. Returns nothing: it draws with pen.
// e.g. dog(500, GROUND, t, {feel: "happy"});
function dog(x, y, t, how) {
  how = how || {};
  checkNames("The dog's name", how, {feel: true});
  var e = creatureFeel(how, t), wagging = 1 + 1.6 * e.wag, carried = 14 * e.tail;
  var trot = t / BEAT * Math.PI;
  var bob = hop(t, 0.5) * 7 + 3 * e.shake;
  var coat = "#d9a86c", ink = inkFor(coat);
  var parts = [], n;
  parts.push([-34, -56, 30, -58, 24, 23, 2]);                    // the body
  parts.push([34, -62, 56, -82, 17, 15, 1]);                     // the neck
  var wag = Math.sin(trot * 2 * (1 + e.wag)) * 10 * wagging, wag2 = Math.sin(trot * 2 * (1 + e.wag) - 0.8) * 14 * wagging;
  parts.push([-52, -62, -74, -88 - carried + wag, 6, 4.5, 1]);       // the tail wags (harder when it is glad), carried up or down
  parts.push([-74, -88 - carried + wag, -84 - Math.max(0, -carried), -104 - 2 * carried + wag2, 4.5, 3, 0.5]);
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
  pen.save();                                       // the head nods against the trot, carried high or low by a feeling
  pen.translate(60, -86 - 7 * e.raise);
  pen.rotate(Math.sin(trot) * 0.08 + 0.9 * e.nod);
  oval(0, 0, 26, 23, coat);
  oval(22, 8, 13, 10, "#eccb9a");                   // the muzzle
  oval(31, 3, 6, 5, INK);                           // the nose
  pen.strokeStyle = INK;
  pen.lineWidth = LINE;
  pen.lineCap = "round";
  if (e.open > 0.05) {                              // the mouth open (a laugh, a yawn, a fright), a tongue in it
    pen.beginPath();
    pen.moveTo(13, 12);
    pen.quadraticCurveTo(22, 14 + 2 * e.grin, 31, 11);
    pen.quadraticCurveTo(23, 13 + 16 * e.open, 13, 12);
    pen.closePath();
    shape("#5a1420");
    oval(22, 13 + 10 * e.open, 5, 3 + 3 * e.open, "#f0808a");
  } else {
    pen.beginPath();
    pen.moveTo(14, 13);
    pen.quadraticCurveTo(22, 19 + 6 * e.grin, 31, 12);   // a smile; a frown when it is sad or cross
    pen.stroke();
    if (Math.sin(trot) > 0.2 && e.grin >= 0) {      // and a tongue, on every other step, when it is not sad
      oval(22, 19, 4, 5 + Math.sin(trot) * 2, "#f0808a");
    }
  }
  if (how.feel === undefined) { pieEye(9, -6); } else {
    creatureEye(9, -6, 7, 13, e, {pie: true, skin: coat});
    pen.save();                                     // a brow, raised or turned: its front end down when it is cross
    pen.translate(9, -24 - 6 * e.brow[0]);
    pen.rotate(e.brow[1] * 1.2);
    pen.beginPath();
    pen.moveTo(-8, 1);
    pen.quadraticCurveTo(0, -3, 8, 1);
    pen.strokeStyle = INK;
    pen.lineWidth = 3 * FINE;
    pen.stroke();
    pen.restore();
  }
  pen.save();                                       // an ear that flaps a moment after the head; up when it is glad, back when it is not
  pen.translate(-16, -14);
  pen.rotate(0.5 + Math.sin(trot - 1) * 0.3 - 0.45 * e.ears);
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

// A rooster's wing, from its root at (x, y) of the pen, turned by "angle"
// (0.35 folded; more lifts it up over the back, less lowers it): a few
// feathered curves, as rooster() draws it. "open", 0 to 1, spreads it, longer
// and broader, as a wing that beats or is held out is.
// x, y, in pen's pixels; angle in radians; colour a CSS colour; open 0 to 1, default 0. Returns nothing.
// e.g. roosterWing(-6, -38, 0.35, "#f0dcc0", 0);
function roosterWing(x, y, angle, colour, open) {
  pen.save();
  pen.translate(x, y);
  pen.rotate(angle);
  pen.scale(1 + 0.7 * (open || 0), 1 + 0.4 * (open || 0));
  pen.beginPath();
  pen.moveTo(8, 0);
  pen.quadraticCurveTo(-8, -14, -30, -2);
  pen.quadraticCurveTo(-22, 2, -26, 8);
  pen.quadraticCurveTo(-14, 8, -16, 14);
  pen.quadraticCurveTo(0, 14, 8, 0);
  pen.closePath();
  shape(colour);
  pen.restore();
}

// The rooster's colours, and the hen's: a brown village hen, with a short
// tail of three feathers and a small comb.
var ROOSTER_COAT = {body: "#fff6e6", wing: "#f0dcc0", far: "#e6ceb0", ruff: "#e9c76b",
                    tail: ["#2f6b5a", "#c9452e", "#2f6b5a", "#e9c76b", "#c9452e"], long: 50};
var HEN_COAT = {body: "#c98b4e", wing: "#a96a33", far: "#94592a", ruff: "#dcae72",
                tail: ["#6e3f1e", "#8a5228", "#6e3f1e"], long: 30};
// The black-boned chicken of the north (ไก่ดำ, the rooster's black: true; owner, 2026-10-20: "add a black chicken and rooster to the
// kit"): black feathers with a dark green sheen, the comb and wattles black-red, the beak, face, skin and legs
// black (HRDI's report and Maejo University's handbook on black-boned chickens, in the kit's research). The
// rooster's sickle tail and hackles green-black; the hen's comb small, as every hen's is.
var BLACK_ROOSTER_COAT = {body: "#26272a", wing: "#1e2a26", far: "#161c1a", ruff: "#2f4a3e",
                          tail: ["#1f3a30", "#2a2c30", "#1f3a30", "#34584a", "#2a2c30"], long: 50, sheen: "#3f7a62",
                          comb: "#4a1e22", beak: "#2e2a28", legs: "#2a2624", face: "#3a2c2c"};
var BLACK_HEN_COAT = {body: "#2a2b2e", wing: "#22302b", far: "#1a201e", ruff: "#30443b",
                      tail: ["#1f3a30", "#2a2c30", "#1f3a30"], long: 30, sheen: "#3f7a62",
                      comb: "#4a1e22", beak: "#2e2a28", legs: "#2a2624", face: "#3a2c2c"};

// The names a rooster's look may have (see rooster()), so that one it does
// not know is warned of.
var ROOSTER_KEYS = {};
["step", "flap", "wings", "lean", "peck", "alarm", "sink", "face", "hen", "feel", "black"].forEach(function (name) { ROOSTER_KEYS[name] = true; });

// A rooster. It crows once every two beats, in three parts, as an animator
// would time it: it sinks first (the part that makes the crow read), then
// stretches its neck up and throws its head back with its beak open and its
// wings out, then settles. "stretch" is below 0 while it sinks and runs up to
// 1 at the top of the crow.
// Its look, "bird", if given, makes it do something else, and it crows only
// when nothing is asked of it (owner, 2026-10-17: a chicken that runs a few
// steps, jumps up flapping and scurries off; "spend some time on the framework
// and chicken behaviors"; a second chicken that takes fright with it):
//   step   a number that grows a step at a time while it runs: its legs run,
//          a foot lifting as it swings forward, the body leans forward and
//          bobs, and the head reaches forward, pumping with the steps
//   flap   0 to 1: both wings beat, up over the back and down, eight times a
//          second (the far wing shows above the body as it rises), as in a jump
//   wings  0 to 1: both wings held out and up a little, shivering, as a
//          chicken holds them when it scurries
//   lean   how far it leans forward running (radians; 0.2 unless told)
//   peck   0 to 1: it tips forward from the hips and reaches down until its
//          beak is at the ground (roosterForage() gives a forager's pecks)
//   alarm  0 to 1: a fright: the head high and drawn back, the body upright,
//          the comb shaking, the eye wide
//   sink   0 to 1: it crouches, the body down on bent legs and the head drawn
//          in, as before a spring and on landing
//   face   1, facing right, or -1, left
//   hen    true: a hen (HEN_COAT), smaller, which never crows
//   feel   a feeling, as a person's (creatureFeel()): surprise is its fright,
//          sleep and fullness settle it down, sadness drops its head and
//          tail; a brow shows anger, sadness and worry, a laugh gapes the
//          beak on each "ha"; only a happy, a neutral or an angry rooster crows
// roosterBolt() puts them together into a whole fright and flight.
// x, y: where its feet stand, in the sheet's pixels; t: seconds (it crows on the beat); bird: its look, as above,
// or nothing (other names warn). Returns nothing: it draws with pen (and a note of music while it crows).
// e.g. rooster(600, GROUND, t, {hen: true, peck: roosterForage(t, 2)});
function rooster(x, y, t, bird) {
  bird = bird || {};
  checkNames("The rooster's name", bird, ROOSTER_KEYS);
  var coat = bird.black ? (bird.hen ? BLACK_HEN_COAT : BLACK_ROOSTER_COAT) : bird.hen ? HEN_COAT : ROOSTER_COAT;
  var combColour = coat.comb || "#d63a2f", beakColour = coat.beak || "#f0a030", legColour = coat.legs || "#c8861e";
  var running = bird.step !== undefined, flap = clamp(bird.flap || 0), wings = clamp(bird.wings || 0);
  var e = creatureFeel(bird, t), f = e.f;
  var peck = clamp(bird.peck || 0), alarm = Math.max(clamp(bird.alarm || 0), e.startle), sink = Math.max(clamp(bird.sink || 0), 0.5 * f.sleepy + 0.3 * f.full);
  var crows = !running && !bird.hen && bird.flap === undefined && bird.wings === undefined &&
              bird.peck === undefined && bird.alarm === undefined && bird.sink === undefined &&
              f.sad + f.worry + f.sleepy + f.full + f.laugh + f.wonder + f.fear < 0.3;   // a feeling that is not glad or cross keeps it quiet
  var turn = (t / BEAT / 2) % 1;
  var stretch = !crows ? -1.4 * sink : turn < 0.2 ? -0.35 * Math.sin(turn / 0.2 * Math.PI)
              : turn < 0.75 ? Math.sin((turn - 0.2) / 0.55 * Math.PI) : 0;
  var crowing = Math.max(0, stretch);
  var beat = flap * (0.8 + 0.95 * Math.sin(t * Math.PI * 16)) + wings * (0.7 + 0.12 * Math.sin(t * 40));   // how far up the wings are: beating in a jump, held out in a scurry
  var open = clamp(flap + 0.6 * wings);              // and how far spread
  var tip = peck * 0.35 - alarm * 0.12;             // the body tips forward from the hips to peck, back in a fright
  var size = bird.hen ? 0.85 : 1, n;
  pen.save();
  var bob = running ? 3 * Math.abs(Math.sin(bird.step * Math.PI * 2)) : 0;
  pen.translate(x, y + 4 - stretch * 5 - bob + 2 * e.shake);
  pen.scale(size * (bird.face || 1), size);
  if (running) { pen.rotate(bird.lean !== undefined ? bird.lean : 0.2); }   // leaning into the run
  pen.lineCap = "round";
  function hips() { pen.translate(0, -16); pen.rotate(tip); pen.translate(0, 16); }   // what is above the legs turns about the hips
  if (flap > 0 || wings > 0) {                      // the far wing, behind the body: it shows when the wings are up
    pen.save();
    hips();
    roosterWing(-2, -40, 0.35 + beat, coat.far, open);
    pen.restore();
  }
  for (n = 0; n < 2; n++) {                         // two legs, and three toes each
    var stride = running ? Math.sin(bird.step * Math.PI * 2 + n * Math.PI) : 0;   // running: each foot swings forward and back, the other half a step behind
    var footX = -8 + n * 18 + stride * 12, lift = running ? Math.max(0, stride) * 7 : 0;
    pen.strokeStyle = legColour;
    pen.lineWidth = 4;
    pen.beginPath();
    var hipX = -6 + n * 18;
    pen.moveTo(hipX, -16);
    pen.lineTo(footX, -2 + stretch * 5 - lift);
    pen.moveTo(footX - 9, 1 + stretch * 5 - lift);
    pen.lineTo(footX, -2 + stretch * 5 - lift);
    pen.lineTo(footX + 10, 1 + stretch * 5 - lift);
    pen.moveTo(footX, -2 + stretch * 5 - lift);
    pen.lineTo(footX + 2, 4 + stretch * 5 - lift);
    pen.stroke();
  }
  hips();
  // the tail: five feathers in a fan (a hen's three, shorter and more
  // upright). Each swings a little after the one before it, and the whole fan
  // lifts in the crow and in a fright.
  var middle = (coat.tail.length - 1) / 2;
  for (n = 0; n < coat.tail.length; n++) {
    var lean = (bird.hen ? 2 : 2.2) + n * (bird.hen ? 0.32 : 0.28) - crowing * 0.25 - alarm * 0.2 - 0.3 * e.tail + Math.sin(t * 5 - n * 0.6) * 0.07;
    var long = coat.long - Math.abs(n - middle) * 5;
    hose(-20, -34, -20 + Math.cos(lean) * long, -34 - Math.sin(lean) * long, 0.35, 8, coat.tail[n]);
  }
  pen.save();                                       // the body leans back as the neck goes up
  pen.translate(0, -30);
  pen.rotate(-0.12 - crowing * 0.22);
  oval(0, 0, 31, 24 + crowing * 3, coat.body);
  if (coat.sheen) {                                 // the black chicken's green sheen, along the back
    pen.strokeStyle = coat.sheen;
    pen.lineWidth = 4;
    pen.globalAlpha *= 0.7;
    pen.beginPath();
    pen.ellipse(0, 0, 25, 18 + crowing * 2, 0, Math.PI * 1.1, Math.PI * 1.75);
    pen.stroke();
    pen.globalAlpha /= 0.7;
  }
  pen.fillStyle = "rgba(120, 80, 60, 0.18)";        // the belly is in shadow
  pen.beginPath();
  pen.ellipse(-4, 12, 24, 9, 0, 0, 7);
  pen.fill();
  roosterWing(-6, -8, 0.35 - crowing * 1.1 + Math.sin(t * 34) * 0.14 * crowing + beat, coat.wing, open);   // a wing, which lifts and shakes in the crow, beats in a jump and is held out in a scurry
  pen.restore();
  // the neck, and a head that tips back in the crow, goes down to peck,
  // reaches forward in a run and goes up in a fright
  var headX = mix(28 + crowing * 2, 34, peck) - 5 * alarm, headY = mix(-78 - stretch * 20, -40, peck) - 14 * alarm - 18 * Math.min(0, e.raise);   // a sad or sleepy one's head sinks
  if (running) { headX += 8 + 3 * Math.sin(bird.step * Math.PI * 4); headY += 10; }
  hose(16, -42, headX - 2, headY + 8, 0.12 + crowing * 0.1, 15, coat.body);
  hose(10, -40, 20, -52, 0.3, 9, coat.ruff);        // a ruff of gold feathers at its foot
  pen.save();
  pen.translate(headX, headY);
  pen.rotate(-crowing * 0.55 + peck * 1.0 + 0.9 * e.nod);
  var comb = bird.hen ? 0.6 : 1;
  for (n = 0; n < 3; n++) {                         // the comb: three bumps that wobble, and shake in a fright
    oval((-7 + n * 7) * comb, -13 * (bird.hen ? 0.85 : 1) - (n === 1 ? 3 * comb : 0) + Math.sin(t * 9 + n) * 1.2 + alarm * Math.sin(t * 60 + n * 2) * 1.5,
         5.5 * comb, 6.5 * comb, combColour);
  }
  pen.save();                                       // the wattle swings under the beak
  pen.translate(9, 9);
  pen.rotate(Math.sin(t * 8) * 0.25 + crowing * 0.4);
  oval(0, 6 * comb, 4.5 * comb, 8 * comb, combColour);
  pen.restore();
  var gape = 0.08 + crowing * 0.5 + 0.35 * e.open;  // the beak: two halves that open (a laugh's "ha", a yawn, a fright)
  for (n = -1; n <= 1; n += 2) {
    pen.save();
    pen.translate(10, 1);
    pen.rotate(n * gape);
    pen.beginPath();
    pen.moveTo(0, n * 5);
    pen.lineTo(n < 0 ? 22 : 17, 0);
    pen.lineTo(0, 0);
    pen.closePath();
    shape(beakColour);
    pen.restore();
  }
  oval(0, 0, 14, 13, coat.body);
  if (bird.feel !== undefined && e.lid > 0.3 && alarm < 0.5) {   // a sleepy, full or laughing eye: shut, or half shut under its lid
    creatureEye(5, -3, 3.4, 3.4, e, {skin: coat.body, iris: INK});
  } else if (alarm < 0.5 && (t + 0.7) % 2.9 < 0.12) {      // it blinks, too, but not in a fright
    pen.strokeStyle = INK;
    pen.lineWidth = 2;
    pen.beginPath();
    pen.moveTo(1, -3);
    pen.lineTo(8, -3);
    pen.stroke();
  } else {
    if (alarm > 0) {                                // wide in a fright: the white shows all round it
      pen.beginPath();
      pen.arc(5, -3, 2.8 + 2.4 * alarm, 0, 7);
      shape("#ffffff", 1.4);
    }
    pen.fillStyle = INK;
    pen.beginPath();
    pen.arc(5, -3, 2.8 - 0.9 * alarm, 0, 7);
    pen.fill();
    pen.fillStyle = "#ffffff";
    pen.beginPath();
    pen.arc(4, -4, 1, 0, 7);
    pen.fill();
  }
  if (bird.feel !== undefined && (Math.abs(e.brow[1]) > 0.05 || e.brow[0] < -0.1)) {   // a brow over the eye: its front end down when it is cross, up when it is sad or worried
    pen.save();
    pen.translate(5, -10 - 3 * e.brow[0]);
    pen.rotate(e.brow[1] * 1.3);
    pen.strokeStyle = INK;
    pen.lineWidth = 2.4 * FINE;
    pen.lineCap = "round";
    pen.beginPath();
    pen.moveTo(-5, 0.5);
    pen.lineTo(5, -0.5);
    pen.stroke();
    pen.restore();
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

// A forager's pecking, for rooster()'s peck at second t: its head low,
// looking, now and then a peck or a few quick pecks at the ground, each down
// in a tenth of a second and up in a fifth, and now and then its head up a
// while, looking about. "seed" gives each bird its own.
// t: seconds; seed: any number, default 0. Returns 0 to 1: the peck to give rooster().
// e.g. rooster(600, GROUND, t, {peck: roosterForage(t, 1)});
function roosterForage(t, seed) {
  var cell = Math.floor(t / 0.3), u = t / 0.3 - cell;
  var jab = dice(cell * 5 + (seed || 0) * 17 + 1) > 0.5 ? (u < 0.3 ? Math.sin(u / 0.3 * Math.PI / 2) : Math.cos((u - 0.3) / 0.7 * Math.PI / 2)) : 0;
  var spell = Math.floor(t / 2), v = t / 2 - spell;
  var up = dice(spell * 3 + (seed || 0) * 11 + 2) > 0.6 ? Math.sin(Math.PI * clamp((v - 0.2) / 0.6)) : 0;
  return (0.3 + 0.7 * jab) * (1 - up);
}

// A fright and a flight, in seconds from the fright: when the run starts,
// the hop starts, the hop is at its top, and it lands; and how high it hops.
var BOLT = {run: 0.35, hop: 1.1, top: 1.475, land: 1.85, high: 130};

// A rooster (or a hen) that something frightens, s seconds after the fright
// (owner, 2026-10-17: "have the chicken run a few steps and then jump into the
// air flapping its wings but then come down and scurry off until it is off
// screen"). It starts up, its head high and its eye wide, jumping a little
// where it stands, and crouches; runs a few steps, faster and faster, its
// wings coming out; hops up with its wings beating, leaning back, and comes
// down, crouching as it lands; and scurries off with its wings held out,
// faster than it ran, until it is out of the picture. One that does not hop
// runs straight off as fast as a scurry. Its legs go on from step to step all
// through: in the hop they hold the stride they left the ground in.
// plan: {face: -1 to run left; hop: false for one that only runs; peck: how
// far down its head was when the fright came, so it comes up from there; hen:
// true for a hen}. It gives back {x, y, look}: how far it has gone from where
// it stood (x the way it runs; y up from the ground, so below 0) and the look
// for rooster(). Before the fright (s below 0) it stands.
// s: seconds since the fright (below 0: before it). Returns {x, y, look}, x and y in pixels.
// e.g. var b = roosterBolt(t - 3, {face: -1}); rooster(600 + b.x, GROUND + b.y, t, b.look);
function roosterBolt(s, plan) {
  plan = plan || {};
  var face = plan.face || 1, B = BOLT, bird = {face: face, alarm: 0};
  if (plan.hen) { bird.hen = true; }
  if (s < 0) { return {x: 0, y: 0, look: bird}; }
  var r = s - B.run, d;
  bird.alarm = between(s, 0, 0.06) * (1 - 0.6 * between(s, B.run, B.run + 0.4));   // the head shoots up, and stays high
  if (s < B.run) {                                  // the fright: a start, and a crouch to spring from
    bird.peck = (plan.peck || 0) * (1 - between(s, 0, 0.06));
    bird.sink = between(s, 0.2, B.run);
    return {x: 0, y: -10 * Math.sin(Math.PI * clamp(s / 0.2)), look: bird};
  }
  bird.sink = 1 - between(r, 0, 0.12);
  if (plan.hop === false) {                         // straight off, faster and faster
    bird.step = r < 0.4 ? 8 * r * r / 0.8 : 8 * (0.2 + r - 0.4);
    bird.wings = 0.55 * between(r, 0, 0.3);
    d = r < 0.4 ? 520 * r * r / 0.8 : 520 * (0.2 + r - 0.4);
    return {x: face * d, y: 0, look: bird};
  }
  if (s < B.hop) {                                  // the run: a few steps, faster and faster
    bird.step = r < 0.25 ? 6 * r * r / 0.5 : 6 * (0.125 + r - 0.25);
    bird.wings = 0.3 * between(r, 0, 0.3);
    d = r < 0.25 ? 380 * r * r / 0.5 : 380 * (0.125 + r - 0.25);
    return {x: face * d, y: 0, look: bird};
  }
  var ran = B.hop - B.run - 0.125, steps = 6 * ran;
  if (s < B.land) {                                 // the hop, its wings beating, leaning back
    var u = (s - B.hop) / (B.land - B.hop);
    bird.step = steps;
    bird.flap = between(u, 0, 0.1);
    bird.wings = 0.3 * (1 - between(u, 0, 0.1));
    bird.lean = 0.2 - 0.35 * Math.sin(Math.PI * u);
    return {x: face * (380 * ran + 340 * (s - B.hop)), y: -B.high * Math.sin(Math.PI * u), look: bird};
  }
  var l = s - B.land;                               // down: a crouch, and away, faster
  bird.sink = 0.8 * Math.sin(Math.PI * clamp(l / 0.22));
  bird.flap = 1 - between(l, 0, 0.15);
  bird.wings = 0.55 * between(l, 0, 0.15);
  bird.step = steps + (l < 0.2 ? 8 * l * l / 0.4 : 8 * (0.1 + l - 0.2));
  d = 380 * ran + 340 * (B.land - B.hop) + (l < 0.3 ? 340 * l + 180 * l * l / 0.6 : 129 + 520 * (l - 0.3));
  return {x: face * d, y: 0, look: bird};
}

// A feather: a quill and a soft vane, "long" from end to end, its middle at
// (x, y), turned by "turn" (0: the root at the left, the tip at the right).
// x, y, long in pen's pixels; turn in radians; colour a CSS colour. Returns nothing.
// e.g. feather(600, 800, 0.3, 22, "#fff6e6");
function feather(x, y, turn, long, colour) {
  var h = long / 2;
  pen.save();
  pen.translate(x, y);
  pen.rotate(turn);
  pen.beginPath();
  pen.moveTo(-h, 0);                                // the vane: from the root over to the tip, and back under
  pen.quadraticCurveTo(-h * 0.2, -long * 0.32, h, -long * 0.06);
  pen.quadraticCurveTo(h * 0.1, long * 0.24, -h * 0.75, long * 0.05);
  pen.closePath();
  shape(colour, LINE * 0.6);
  pen.strokeStyle = inkFor(colour);
  pen.lineWidth = 1.1;
  pen.beginPath();
  pen.moveTo(-h * 1.2, long * 0.03);                // the quill, out past the root
  pen.quadraticCurveTo(0, -long * 0.03, h * 0.9, -long * 0.06);
  pen.moveTo(h * 0.1, -long * 0.18);                // a notch where the vane parts
  pen.lineTo(h * 0.3, -long * 0.05);
  pen.stroke();
  pen.restore();
}

// A feather that came loose at (x, y) "age" seconds ago and falls to the
// ground at "ground" (owner, 2026-10-17: "When the chicken jumps have a small
// feather fall and descend to the ground and fade away"). It falls as a
// feather does: slowly, swinging from side to side, quickest through the
// middle of a swing and, at the ends, tipping up and rising a little before
// it swings back; it carries on "drift" the way it was going before the air
// stops it; it lands, lies flat a moment and fades. "seed" gives each its own
// swing. Nothing is drawn before it comes loose or after it has gone.
// x, y, ground in the sheet's pixels; age and drift: seconds, and pixels it carries sideways (default 0); seed:
// any number; colour: a CSS colour, the rooster's white unless told. Returns nothing: it draws with pen, or
// nothing at all.
// e.g. fallingFeather(620, 760, GROUND, t - 4.2, 1, "#c98b4e", 40);
function fallingFeather(x, y, ground, age, seed, colour, drift) {
  if (age < 0) { return; }
  var swing = 1.1 + 0.3 * dice(seed * 3 + 1), wide = 20 + 12 * dice(seed * 3 + 2), sink = 50 + 15 * dice(seed * 3 + 3);
  var w = Math.PI * 2 / swing;
  function at(a) {
    return [x + (drift || 0) * (1 - Math.exp(-a / 0.25)) + wide * Math.sin(w * a),
            y + sink * a + 1.3 * sink / (2 * w) * Math.sin(2 * w * a)];
  }
  var land = 0;                                     // when it reaches the ground
  while (at(land)[1] < ground && land < 20) { land += 0.02; }
  var fade = 1 - between(age, land + 0.6, land + 1.6);
  if (fade <= 0) { return; }
  var a = Math.min(age, land), p = at(a);
  var turn = mix(-0.5 * Math.sin(w * a), 0.1, between(age, land, land + 0.25));   // tipped up at the end of a swing; flat once it is down
  pen.save();
  pen.globalAlpha *= fade;
  feather(p[0], Math.min(p[1], ground), turn, 22, colour || ROOSTER_COAT.body);
  pen.restore();
}

// The sun. STYLE.sun is "flames" (a gold disc ringed with the flame scrolls
// of a thangka, which turn and swell on the beat) or "face" (the smiling sun
// of a 1930s cartoon). how: {feel: a feeling (creatureFeel())}, for the face:
// its pie eyes under their lids, a brow over each, the smile turned or opened.
// x, y: its middle, in the sheet's pixels (the disc is about 150 across); t: seconds (it swells on the beat and
// its flames turn); how: {feel}, or nothing; another name warns, for the face. Returns nothing: it draws with pen.
// e.g. sun(1200, 200, t);
function sun(x, y, t, how) {
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
    if (!how || how.feel === undefined) {
      pieEye(x - 24, y - 12);
      pieEye(x + 18, y - 12);
      pen.strokeStyle = INK;
      pen.lineWidth = 5;
      pen.beginPath();
      pen.arc(x, y + 6, 34, 0.3, Math.PI - 0.3);
      pen.stroke();
      return;
    }
    checkNames("The sun's name", how, {feel: true});
    var e = creatureFeel(how, t);
    [[x - 24, 1], [x + 18, -1]].forEach(function (one) {   // each eye looking toward the middle, its lid and a brow
      pen.save();
      pen.translate(one[0], y - 12);
      pen.scale(one[1], 1);
      creatureEye(0, 0, 7, 13, e, {pie: true, skin: "#ffd75e"});
      pen.translate(0, -20 - 6 * e.brow[0] + 4 * e.brow[1]);
      pen.rotate(1.1 * e.brow[1]);
      pen.strokeStyle = INK;
      pen.lineWidth = 4;
      pen.beginPath();
      pen.moveTo(-9, 1);
      pen.quadraticCurveTo(0, -3, 9, 1);
      pen.stroke();
      pen.restore();
    });
    pen.strokeStyle = INK;
    pen.lineWidth = 5;
    pen.beginPath();
    if (e.open > 0.05) {                            // open: a laugh, a yawn, a fright
      pen.ellipse(x, y + 28, 22, 6 + 18 * e.open, 0, 0, Math.PI * 2);
      pen.fillStyle = "#7a1f22";
      pen.fill();
    } else if (e.grin < -0.2) {                     // a frown
      pen.arc(x, y + 52, 30, Math.PI + 0.5, 2 * Math.PI - 0.5);
    } else {                                        // a smile, as wide as it is glad
      pen.arc(x, y + 6 - 8 * e.grin, 34 - 6 * (1 - e.grin), 0.3 + 0.3 * (1 - e.grin), Math.PI - 0.3 - 0.3 * (1 - e.grin));
    }
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
// x, y: its middle, in the sheet's pixels; size: its width in pixels (it was drawn 40 wide), the glow round it
// about seven times that. Reads clock. Returns nothing: it draws with pen.
// e.g. lantern(600, 400 - t * 30, 40);
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
// brush: a 2D context; x, base: the foot of its trunk; size: 1 is about 470 tall and 400 across. Returns nothing;
// brush is left as it was found.
// e.g. tree(pen, 1200, GROUND, 0.9);
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
// brush: a 2D context; x, base: its root; size: 1 is five leaves about 90 long. Returns nothing.
// e.g. leafClump(pen, 140, GROUND + 20, 0.7);
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
//   brush    a 2D context
//   wide     how far across it runs, from x = 0, in pixels (WIDE for the whole sheet)
//   base     the foot of the range, y in pixels; tall: how high its ridge rises above it
//   shape    any number: another number, another ridge
//   colour   "#rrggbb" for the graded hill; any other CSS colour is laid flat
// Returns nothing; leaves brush's fillStyle, strokeStyle, lineWidth, lineJoin and lineCap as it set them.
// e.g. hills(pen, WIDE, 760, 220, 1.3, "#7fa86a");
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
// brush: a 2D context; x, base, wide and tall in its pixels. Returns nothing; leaves brush's line settings and
// paint as it set them.
// e.g. peaks(pen, 700, 640, 900, 360, "#6f9a7a", 2);
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
// brush: a 2D context; x, base: its root; size: 1 is leaves about 76 long; colour: "#rrggbb"; seed: any number,
// default 0. Returns nothing; brush is left as it was found.
// e.g. fanPlant(pen, 260, GROUND, 0.8, "#3f7a4a", 5);
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
// brush: a 2D context; x, base: the foot of its trunk; size: 1 is about 230 tall; colour: the crown's, "#rrggbb";
// seed: any number, default 0. Returns nothing; brush is left as it was found.
// e.g. tasselTree(pen, 980, 700, 1, "#2f5a3a", 3);
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
// brush: a 2D context; x, base: the middle of the pile, on the ground; size: 1 is about 300 across; colour:
// "#rrggbb"; seed: any number, default 0. Returns nothing; brush is left as it was found.
// e.g. rocks(pen, 400, GROUND, 0.6, "#9a8a70", 1);
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
// brush: a 2D context; x, y, wide, tall: the box, in pixels; colour: "#rrggbb", "#6f8fb0" unless told; seed: any
// number, default 0. Returns nothing; brush is left as it was found.
// e.g. foam(pen, 0, 820, WIDE, 120, "#6f8fb0", 2);
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
// brush: a 2D context, already clipped to the roof; the box and tile in pixels; colour "#rrggbb" or a function
// (x, y) giving one. Returns nothing; leaves brush's paint and line as it set them.
// e.g. pen.save(); pen.beginPath(); pen.rect(-200, -330, 400, 100); pen.clip();
//      roofTiles(pen, -200, 200, -330, -230, 22, "#9a3a2a", "round"); pen.restore();
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
// brush: a 2D context; x, base: the middle of its foot, on the ground; size: 1 is about 380 across and 440 tall.
// Returns nothing; brush is left as it was found.
// e.g. house(pen, 900, GROUND, 0.8);
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

// A coconut palm: a ringed trunk that curves out to one side and back, a crown of fronds, three coconuts.
// brush: a 2D context; x, base: the foot of its trunk; tall: the trunk's height in pixels. Returns nothing; leaves
// brush's paint and line settings as it set them.
// e.g. palm(pen, 1300, GROUND, 360);
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
// brush: a 2D context; x, base: the foot of its pole (the pole leans to the right, its top 70 across and 470 up,
// in pixels); t: seconds, or nothing for a flag that hangs still; crowned: true for a hong on the top (pieces.js
// must be loaded, or none is drawn). Returns nothing; leaves brush's paint and line settings as it set them.
// e.g. tung(pen, 300, GROUND, t, true);
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

// x, y: the wrist, in pen's pixels; angle in radians. Reads SKIN. Returns nothing: it draws with pen.
// e.g. gripHand(0, 0, -1.4);
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
// circle), or on past that until it points at the ground (tilt 2: the crown
// below), and spun (spin, in radians). parasolAt() times a show of it.
var PARASOL = {radius: 120, dome: 38, handle: 150, gold: "#e0b23a",
               kinds: {lai: {ground: "#f3e3bf", ink: "#c8452f", line: "#7a3a24"},
                       yantra: {ground: "#1e1b18", ink: "#efe3c6", line: "#0d0c0b"},
                       buddha: {ground: "#f6efe0", ink: "#262220", line: "#262220"}}};

// How far open a parasol is (0 furled to 1 open) sets the angle of its ribs
// from the handle: closed they lie 5 degrees from it, open 72. Each rib is
// as long as the open parasol's slant, so the canopy's radius and height
// are that length's sine and cosine, as parts of the open radius.
// open: 0 furled to 1 open, default 1. Returns {radius, dome}, as shares of PARASOL.radius.
// e.g. var R = PARASOL.radius * parasolShape(0.5).radius;
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
//            and furled it swings on down until it points straight at the
//            ground (0.5 s, tilt 1 to 2), then back, to hang at her side, tip
//            to the ground behind her (0.5 s), never lifted and never across
//            her: 5.6 seconds, ending carried
// "busy" (0 to 1, in "fold") brings the other hand to the handle, as the hand
// that opens and closes it. A parasol with hang 1 is carried: {open: 0, hang: 1}. "kind" is "lai" (or
// left out), "yantra" or "buddha"; "colour" its paper, if not the kind's own.
// Give it as the look's parasol:
// cast("lady", {parasol: parasolAt(t, 4, "buddha", undefined, "bloom")}).
// t, start: seconds; kind and colour as said; show: one of the shows above, "twirl" when left out. Returns
// {tilt: 0 to 2, spin: radians, open: 0 to 1, hang: 0 to 1, busy: 0 to 1, kind, colour}.
// e.g. person(800, GROUND, cast("lady", {parasol: parasolAt(t, 4, "lai", undefined, "twirl")}));
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
      tilt = 1 + smooth((d - 4.6) / 0.5);          // and furled, it swings straight down (owner, 2026-10-17: it had swung up and over, through her)
      hang = smooth((d - 5.1) / 0.5);              // and then back, to her side
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
// tilt: 0 to 2, default 0; hang: 0 to 1, default 0. Returns [across, down] from the shoulder, in pixels: a hand
// for arm().
// e.g. var handA = parasolHand(1, 0);
function parasolHand(tilt, hang) {                 // where the near hand holds the handle: forward at shoulder height when upright (the forearm rises at a shallow angle to the fist), before the chest when tipped, lowered to her side when it points down (tilt 2), at the side when carried
  var up = [46 - 14 * (tilt || 0), -12 + 42 * (tilt || 0)], h = hang || 0;
  return [up[0] + (16 - up[0]) * h, up[1] + (64 - up[1]) * h];
}

// tilt: 0 to 2; hang: 0 to 1, default 0. Returns radians.
// e.g. var axis = -Math.PI / 2 + parasolSwing(2, 1);
function parasolSwing(tilt, hang) {                // the turn of the parasol about the fist: upright held, down behind her carried, leaning back so the hanging forearm meets the fist without a sharp wrist
  if (tilt > 1) { return 0.9 * (hang || 0); }      // pointing at the ground (tilt 2), it swings back only that far: the same carried parasol, reached without passing through her
  return -(Math.PI - 0.9) * (hang || 0);
}

// given: the look's parasol. Returns an object with at least tilt and spin (the object itself, when given one).
// e.g. var p = parasolOf("yantra");   // {tilt: 0, spin: 0, kind: "yantra"}
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
// brush: a 2D context; x, y, R in its pixels (R the open radius: PARASOL.radius); tilt 0 to 2; spin in radians;
// colour: the paper's CSS colour, or nothing for the kind's own; kind: "lai" (or anything else), "yantra" or
// "buddha"; open: 0 to 1, default 1. The handle is not drawn: person() draws it. Returns nothing.
// e.g. parasol(pen, 700, 400, PARASOL.radius, 1, t * 2, undefined, "buddha", 1);
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
// brush: a 2D context; x, base: where he stands, on the ground; facing: 1 or -1, which mirrors him (give it: it
// is not defaulted). He is about 230 tall. Returns nothing; brush is left as it was found.
// e.g. yak(pen, 500, GROUND, 1);
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
// brush: a 2D context; x, base: the middle of the hall's foot, on the ground. It spreads from about x - 345 to
// x + 410 and stands about 525 high, its two guardians (yak()) at x - 205 and x + 205. Returns nothing.
// e.g. temple(pen, 700, GROUND);
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
// brush: a 2D context (a set's sheet, painted once); wide: the sheet's width in pixels. Reads STYLE.clouds.
// Returns nothing.
// e.g. clouds(paper.getContext("2d"), WIDE);   // paper: the set's hidden canvas, WIDE x 1080
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

// The wash of watercolour over a whole sheet, 1080 high: soft blots, long strokes of a wide brush and the
// tooth of the paper, light and dark. brush: a 2D context (a set's sheet, painted once: it is slow); wide: the
// sheet's width in pixels. Returns nothing; leaves brush's lineCap "round".
// e.g. wash(paper.getContext("2d"), WIDE);
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
// brush: a 2D context of a sheet 1080 high (the fence stands at y 800 to 852, the plants down to 1075); wide: its
// width in pixels. "front" first clears the whole sheet. Returns nothing.
// e.g. pathside(paper.getContext("2d"), WIDE);
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
// brush: a 2D context; x, base: the foot of its stem; about 270 tall. Returns nothing; leaves brush's paint and
// line settings as it set them.
// e.g. banana(pen, 1250, GROUND);
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
// n: which sheet (any number). Returns a new canvas, the sheet's size at device pixels (WIDE x 1080, times PIX),
// with specks of light and dark on it. GRAIN holds three of them.
// e.g. var grain = makeGrain(4);
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

// A title card: the whole sheet in cream, a red double border, "big" in a large serif and "small" (Thai is fine)
// under it, a lotus in each lower corner and a scroll cloud in each upper. big, small: strings. Returns nothing:
// it draws with pen over everything.
// e.g. card("A Lanna Girl", "สาวล้านนา");
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
// big: the line (Thai is fine), small: what it means, or nothing. It draws on "screen", so call it from draw(t)
// after film(t, SCENES): drawn inside a scene, film() paints over it. Returns nothing.
// e.g. function draw(t) { film(t, SCENES); subtitle("สนุกจัง", "What fun"); }
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

// ---------- speech and thought bubbles ----------
// Words a person says or thinks, in a bubble over their head (owner,
// 2026-10-18: "add text that the character will see in a speech or thought
// bubble"). It is drawn on the scene after everyone, so the camera and the
// lens take it as they take the people. A speech bubble is a box of paper
// with round corners and a tail that points at the top of the head; a
// thought bubble is a cloud, with three puffs that get smaller toward the
// head. It leans the way the person faces, stays inside what the camera
// shows, and pops in over a fifth of a second. Over a person, the box keeps
// over where they stand and the height of their head at rest (joints.stand,
// joints.rest), so it neither rocks nor hops with them; only its tail follows
// the head.
//   at     what person() gave back, drawn in this frame (the bubble points at
//          the top of that head), or [x, y] in the scene
//   words  the words, or [big, small]: the words and, smaller under them,
//          what they mean
//   how    {kind: "say" (the default) or "think", side: 1 or -1 (which way it
//          leans; unless given, the way the person faces), age: the seconds
//          since it came (it pops in), size: 1}
// Returns nothing: it draws with pen, in the scene's frame as pen has it.
// e.g. var joints = person(700, GROUND, cast("girl")); bubble(joints, ["สวัสดี", "Hello"], {age: t - 2});
function bubble(at, words, how) {
  how = how || {};
  var back = pen.getTransform().inverse(), tip = at, side = how.side, still = at;
  if (at.crown) {                                   // a person's joints are in the film's own pixels: back to the scene's
    var crown = back.transformPoint(new DOMPoint(at.crown[0], at.crown[1]));
    var chin = back.transformPoint(new DOMPoint(at.chin[0], at.chin[1]));
    var stand = back.transformPoint(new DOMPoint(at.stand[0], at.stand[1])), rest = back.transformPoint(new DOMPoint(at.rest[0], at.rest[1]));
    var head = Math.abs(chin.y - crown.y);
    tip = [crown.x, crown.y - 0.3 * head];          // the tail: a little over the top of the head, wherever it is
    still = [stand.x, rest.y - 0.3 * head];         // the box: over the feet and the head at rest, so neither the rock nor the hop moves it
    if (side === undefined) { side = at.face || 1; }
  }
  side = side || 1;
  var think = how.kind === "think", s = how.size || 1;
  var big = typeof words === "string" ? words : words[0] || "", small = typeof words === "string" ? "" : words[1] || "";
  var BIG = "bold 40px 'Leelawadee UI', 'Noto Sans Thai', Tahoma, sans-serif", SMALL = "italic 26px Georgia, 'Times New Roman', serif";
  var rows = bubbleLines(big, BIG, 420).map(function (r) { return [r, BIG, 48, "#3a2418"]; });
  if (small) { rows = rows.concat(bubbleLines(small, SMALL, 420).map(function (r) { return [r, SMALL, 34, "#7a4a2a"]; })); }
  var wide = 0, tall = 0;
  rows.forEach(function (r) { pen.font = r[1]; wide = Math.max(wide, pen.measureText(r[0]).width); tall += r[2]; });
  var pad = 24, w = (wide + 2 * pad) * s, h = (tall + 2 * pad - 8) * s, puff = think ? 24 * s : 0;
  // Where it stands: leaning to its side, its foot 50 over the tip, and
  // inside what is shown (the camera may have come closer).
  var view0 = back.transformPoint(new DOMPoint(0, 0)), view1 = back.transformPoint(new DOMPoint(pen.canvas.width, pen.canvas.height));
  var edge = 16 + puff, cx = still[0] + side * (w / 2 - 40 * s), foot = still[1] - (think ? 70 : 50) * s;
  cx = Math.max(view0.x + w / 2 + edge, Math.min(view1.x - w / 2 - edge, cx));
  foot = Math.max(view0.y + h + edge, foot);
  var top = foot - h, left = cx - w / 2;
  var u = how.age === undefined ? 1 : clamp(how.age / 0.2), pop = 0.55 + 0.45 * u + 0.1 * Math.sin(Math.PI * u);
  pen.save();
  pen.globalAlpha *= 0.3 + 0.7 * u;
  pen.translate(tip[0], tip[1]);                    // it pops in, out of the head
  pen.scale(pop, pop);
  pen.translate(-tip[0], -tip[1]);
  var parts = [], body = new Path2D();
  body.roundRect(left, top, w, h, Math.min(h / 2, 34 * s));
  parts.push(body);
  if (think) {                                      // a cloud: puffs all round the box, and three little ones down to the head
    var round = 2 * (w + h), many = Math.max(10, Math.round(round / (1.5 * puff)));
    for (var k = 0; k < many; k++) {
      var d = k * round / many, px, py;
      if (d < w) { px = left + d; py = top; } else if (d < w + h) { px = left + w; py = top + d - w; }
      else if (d < 2 * w + h) { px = left + w - (d - w - h); py = top + h; } else { px = left; py = top + h - (d - 2 * w - h); }
      var one = new Path2D();
      one.arc(px, py, puff * (k % 2 ? 0.8 : 1), 0, Math.PI * 2);
      parts.push(one);
    }
    var from = [Math.max(left + puff, Math.min(left + w - puff, tip[0] + side * 20 * s)), foot + puff * 0.6];
    [[0.3, 13], [0.58, 9], [0.84, 6]].forEach(function (b) {
      var little = new Path2D();
      little.arc(from[0] + (tip[0] - from[0]) * b[0], from[1] + (tip[1] - from[1]) * b[0], b[1] * s, 0, Math.PI * 2);
      parts.push(little);
    });
  } else {                                          // a tail, from the box's foot over the head, curving down to the tip
    var root = Math.max(left + 30 * s, Math.min(left + w - 30 * s, tip[0] + side * 16 * s));
    var tail = new Path2D();
    tail.moveTo(root - 16 * s, foot - 6);
    tail.quadraticCurveTo(root - 4 * s, foot + (tip[1] - foot) * 0.45, tip[0], tip[1]);
    tail.quadraticCurveTo(root + 6 * s, foot + (tip[1] - foot) * 0.35, root + 16 * s, foot - 6);
    tail.closePath();
    parts.push(tail);
  }
  // Every shape inked twice as wide, then all filled: only the outer half of
  // the ink shows, so the tail and the puffs join the box with no line between.
  pen.lineJoin = "round";
  pen.strokeStyle = INK;
  pen.lineWidth = 2.6 * LINE;
  parts.forEach(function (q) { pen.stroke(q); });
  pen.fillStyle = "#fffaf0";
  parts.forEach(function (q) { pen.fill(q); });
  pen.translate(cx, top);                           // the words, in the middle, line by line
  pen.scale(s, s);
  pen.textAlign = "center";
  var y = pad - 6;
  rows.forEach(function (r) {
    y += r[2];
    pen.font = r[1];
    pen.fillStyle = r[3];
    pen.fillText(r[0], 0, y - r[2] * 0.24);
  });
  pen.restore();
}

// A bubble's words in lines no wider than "most": broken between words (Thai
// has no spaces: the browser's word segmenter finds its words); a word wider
// than a line is left whole.
// text: the words; font: a CSS font; most: the widest line, in pixels. Returns a list of strings (at least
// one, "" for no words). Leaves pen.font set to font.
// e.g. var rows = bubbleLines("สวัสดีเจ้า", "bold 40px Tahoma", 420);
function bubbleLines(text, font, most) {
  pen.font = font;
  var pieces = typeof Intl !== "undefined" && Intl.Segmenter
             ? Array.from(new Intl.Segmenter("th", {granularity: "word"}).segment(text), function (part) { return part.segment; })
             : text.split(/(?= )/);
  var lines = [], line = "";
  pieces.forEach(function (piece) {
    if (line.trim() && pen.measureText(line + piece).width > most) { lines.push(line.trim()); line = piece.replace(/^\s+/, ""); }
    else { line += piece; }
  });
  if (line.trim()) { lines.push(line.trim()); }
  return lines.length ? lines : [""];
}

// a red stage curtain. "open" runs from 0, shut, to 1, gone to the sides.
// open: 0 to 1. It covers the whole sheet when shut. Returns nothing: it draws with pen.
// e.g. curtain(between(t, 1, 3));
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
// open: 0 (shut: all black) to 1 (the hole is wider than the sheet). Returns nothing: it draws with pen.
// e.g. iris(1 - between(t, 7.5, 8));
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

// A fade through black at a cut (owner, 2026-10-21: "change between scenes like between the night dancers and
// SLS scene"): the sheet darkens to black over the last CUT_FADE seconds of a scene and comes back over the first
// CUT_FADE of the next, eased, as chain.py fades where two films meet. It took the place of the iris at the cuts,
// whose quick 0.5 s close read as a hard cut beside that fade. "dark" is 0 (none) to 1 (black).
var CUT_FADE = 0.75;
// dark: a number; 0 or less draws nothing, 1 or more is black. Returns nothing: it draws over the whole sheet
// with pen. filmFrameOnce() calls it at every cut.
// e.g. cutFade(between(t, 9, 10));
function cutFade(dark) {
  if (dark <= 0) { return; }
  pen.fillStyle = "rgba(0, 0, 0, " + Math.min(1, dark).toFixed(3) + ")";
  pen.fillRect(0, 0, WIDE, 1080);
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

// What the kit remembers from one frame to the next: the springs of what hangs (FOLLOWS), how each arm last bent
// (BENDS), who was drawn n-th (DRAWN), what the eyes saw (SIGHTS); a module that remembers more puts a function
// that forgets it in FORGET (paperdoll.js: the dolls' chains). When a render jumps the clock, settled() forgets it
// all before the frames it paints unseen, so that they start from rest, as the numbers above assume, and not from
// whatever the page drew live while it loaded: a render gives the same pixels every time. (2026-10-21: before, the
// same second of village.html or fonlep.html came out differently with what had been drawn before it.)
var FORGET = [];

function forget() {
  FOLLOWS = {};
  BENDS = {};
  DRAWN = 0;
  DRAWN_AT = -1;
  SIGHTS.whole = null;
  FORGET.forEach(function (more) { more(); });
}

var SETTLED_RENDERING = false;                     // whether the frame before was a render's: the first one after it a jump too

function settled(t, paint) {
  var now = typeof rendering !== "undefined" && rendering;
  var jumped = SETTLED_AT === null || t < SETTLED_AT - 1e-6 || t - SETTLED_AT > 0.1 || !SETTLED_RENDERING;
  SETTLED_RENDERING = now;
  if (jumped && now) {
    forget();
    for (var back = SETTLE; back >= 1; back--) {
      if (t - back / 30 >= 0) { paint(t - back / 30); }
    }
  }
  SETTLED_AT = t;
  paint(t);
}

// ---------- who is where, for eyes that watch ----------
// In a film's frame the kit notes where each one it draws is (each person at the middle of the face, each of a
// scene's life at the middle of its box, decorate.js), in the sheet's own pixels, so that eyes can watch the
// nearest (the creature's: myth.js). A watcher drawn before the ones it watches would see only those drawn
// before it, so then filmFrame() draws the frame again, the watcher seeing the whole list of the first time: what
// it sees is the second's own, as everything in a frame is. Only while a film's frame is drawn (SIGHTS.on).
var SIGHTS = {on: false, seen: [], whole: null, watched: false};

// x, y: in the sheet's pixels. Returns nothing; while a film's frame is drawn it adds [x, y] to SIGHTS.seen,
// else it does nothing. person() and decorate.js call it.
// e.g. sighted(700, 560);
function sighted(x, y) {                           // one seen at (x, y) in the sheet's pixels
  if (SIGHTS.on) { SIGHTS.seen.push([x, y]); }
}

// Returns [[x, y], ...]: everyone noted in this frame (empty outside a film's frame). Calling it marks the frame
// watched (SIGHTS.watched), so filmFrame() draws it a second time.
// e.g. var seen = sightsNow();   // [[700, 560], [1100, 540]]
function sightsNow() {                             // what a watcher can see in this frame, in the sheet's pixels
  if (!SIGHTS.on) { return []; }
  SIGHTS.watched = true;
  return SIGHTS.whole && SIGHTS.whole.at === clock ? SIGHTS.whole.seen : SIGHTS.seen;
}

// one frame of a film on the film's own sheet: the scene of that second,
// with the camera's slow move in, and the iris at a cut; drawn again when
// something in it watched (SIGHTS, above)
// (Since 2026-10-21 a cut fades through black, cutFade(), in place of the iris.)
//   t        seconds of the film
//   scenes   [[from, to, scene], ...]: seconds, and a function of the scene's own clock (t - from)
// Returns nothing. Sets clock to t; changes SIGHTS; draws on pen (the sheet), not on the screen.
// e.g. filmFrame(12.5, SCENES);
function filmFrame(t, scenes) {
  SIGHTS.on = true;
  SIGHTS.seen = [];
  SIGHTS.watched = false;
  filmFrameOnce(t, scenes);
  if (SIGHTS.watched && !(SIGHTS.whole && SIGHTS.whole.at === t)) {
    SIGHTS.whole = {at: t, seen: SIGHTS.seen};
    SIGHTS.seen = [];
    pen.setTransform(1, 0, 0, 1, 0, 0);
    pen.clearRect(0, 0, pen.canvas.width, pen.canvas.height);
    filmFrameOnce(t, scenes);
  }
  SIGHTS.on = false;
}

// One pass of filmFrame(): sets clock, puts pen at the sheet's base scale, draws the scene whose [from, to)
// holds t with the camera's push in (6 per cent over the scene), and the fade at a cut. t: seconds; scenes: as
// filmFrame() takes them. Returns nothing.
// e.g. filmFrameOnce(12.5, SCENES);
function filmFrameOnce(t, scenes) {
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
      if (from > 0 && t - from < CUT_FADE) { cutFade(1 - between(t - from, 0, CUT_FADE)); }
      if (to < scenes[scenes.length - 1][1] && to - t < CUT_FADE) { cutFade(1 - between(to - t, 0, CUT_FADE)); }
    }
  }
}

// Draw second t of a film: find its scene, let the camera push in, fade
// through black at the cuts, then send the sheet to the screen through the lens.
function film(t, scenes) {
  var frame = Math.round(t * 30);
  try {
    settled(t, function (at) { filmFrame(at, scenes); });
  } catch (error) {                                // a fault in a scene: what it left open on the sheet (a save, a clip) goes with this frame
    unwound(pen);
    SIGHTS.on = false;
    throw error;
  }
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

// ---------- what blinks out of a film ----------
// Nothing should blink out of a film (owner, 2026-10-22: "Everything should either continue off the edge, fade and
// shrink away, be part of a scene that is going to black or fade out. Sprites shouldn't just blink off the canvas").
// vanished() draws a film's frames one after another, as a render does but keeping no pictures, notes where on the
// film each person (person()), each of a scene's life (decorate.js) and each of drawByZ()'s sprites that gives an x
// is, and finds what is drawn in one frame and not in the next. That is all right when, in the frame it was last
// drawn,
//   most of it (edge) was already off the film,
//   it was drawn faint (pen.globalAlpha at most faint),
//   it had shrunk to a small part (small) of the most it covered, or
// where it was, the film is nearly black in either frame (dark: a cut's fade, a fade to black), or the two frames
// hardly differ (still: it was hidden, behind a sheet or a door, when the scene stopped drawing it).
// Anything else blinked out, and is told. A thing is known from one frame to the next by its name (the sprite's,
// else the person's id, else its kind) and, among those of a name, by the nearest.
// edge, faint, small: parts of 1. dark: the brightness (0-255) under which the film counts as black. still: how
// much the two frames may differ there (0-255, on the average) and the thing count as hidden. snap: how wide the
// small copy of each frame is that the pictures are compared on.
var VANISH = {edge: 0.8, faint: 0.15, small: 0.03, dark: 20, still: 6, snap: 480};

// from, to: seconds of the page's film, drawn by the page's draw(t); fps: frames a second (30 when left out).
// Returns a list of sentences, one for each thing that blinked out ([] when nothing did), each with the first second
// it did and how many times. It draws on the page's sheet as draw(t) does, so it is for a page with rendering on
// (render.py, checks/vanish_check.py): a render after it starts with a jump of the clock, and settled() forgets what
// it drew. It puts person(), drawByZ(), filmFrameOnce() and LIFE_KINDS back as they were, even when a frame throws.
// e.g. vanished(0, 22);   // ["the rooster (rooster) blinked out at 3.47 s, at x 1010-1060, y 930-1000"]
function vanished(from, to, fps) {
  fps = fps || 30;
  var keep = {person: window.person, drawByZ: window.drawByZ, filmFrameOnce: window.filmFrameOnce};
  var kinds = typeof LIFE_KINDS === "undefined" ? {} : LIFE_KINDS, keepKinds = Object.assign({}, kinds);
  var now = [], within = null, blinks = {}, order = [];
  var small = document.createElement("canvas"), scale = VANISH.snap / FILM.width;
  small.width = VANISH.snap;
  small.height = Math.round(FILM.height * scale);
  var brush = small.getContext("2d", {willReadFrequently: true});

  function area(box) { return Math.max(0, box[2] - box[0]) * Math.max(0, box[3] - box[1]); }
  function note(name, kind, box) {                 // box: in pen's pixels, as the thing was drawn
    if (pen.canvas !== FILM) { return; }           // a figure drawn on a scratch sheet to be measured is not in the film
    var m = pen.getTransform(), a = m.transformPoint(new DOMPoint(box[0], box[1])), b = m.transformPoint(new DOMPoint(box[2], box[3]));
    var on = [Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.x, b.x), Math.max(a.y, b.y)];
    now.push({name: name, kind: kind, alpha: pen.globalAlpha, box: on, most: area(on)});
    if (within) { within.noted = true; }
  }
  // what the film shows inside box (the film's pixels): its brightness in a frame (one picture), and how much two
  // frames differ there (two). Gives back a number 0-255, or null when the box holds none of the film.
  function inBox(box, one, two) {
    var left = Math.max(0, Math.floor(box[0] * scale)), right = Math.min(small.width, Math.ceil(box[2] * scale));
    var top = Math.max(0, Math.floor(box[1] * scale)), bottom = Math.min(small.height, Math.ceil(box[3] * scale));
    if (right <= left || bottom <= top) { return null; }
    var sum = 0, count = 0;
    for (var y = top; y < bottom; y++) {
      for (var x = left, i = (y * small.width + left) * 4; x < right; x++, i += 4) {
        sum += two ? (Math.abs(one[i] - two[i]) + Math.abs(one[i + 1] - two[i + 1]) + Math.abs(one[i + 2] - two[i + 2])) / 3
                   : (one[i] + one[i + 1] + one[i + 2]) / 3;
        count++;
      }
    }
    return sum / count;
  }
  function blinked(one, before, after, t) {        // whether "one", drawn in the frame before and not in this one, blinked out
    var box = one.box, film = [0, 0, FILM.width, FILM.height];
    var inside = area([Math.max(box[0], 0), Math.max(box[1], 0), Math.min(box[2], film[2]), Math.min(box[3], film[3])]);
    if (area(box) === 0 || inside <= (1 - VANISH.edge) * area(box)) { return false; }
    if (one.alpha <= VANISH.faint || area(box) <= VANISH.small * one.most) { return false; }
    var light = Math.min(inBox(box, before), inBox(box, after)), change = inBox(box, before, after);
    return light >= VANISH.dark && change >= VANISH.still;
  }

  try {
    window.person = function (x, y, look) {
      var given = keep.person.apply(this, arguments), size = (look && look.size) || 1;
      note((within && within.name) || (look && look.id) || "someone", "person", [x - 60 * size, y - 330 * size, x + 60 * size, y]);
      return given;
    };
    Object.keys(keepKinds).forEach(function (kind) {
      kinds[kind] = function () {
        var box = keepKinds[kind].apply(this, arguments);
        if (box) { note((within && within.name) || kind, kind, box); }
        return box;
      };
    });
    window.drawByZ = function (sprites) {
      return keep.drawByZ(sprites.map(function (one) {
        return Object.assign({}, one, {draw: function () {
          var outer = within;
          within = {name: one.name || one.kind, noted: false};
          try {
            one.draw();
            if (!within.noted && typeof one.x === "number" && typeof one.y === "number") {   // a sprite of its own: about where it stands
              note(within.name, one.kind || "sprite", [one.x - 80, one.y - 160, one.x + 80, one.y]);
            }
          } finally {
            within = outer;
          }
        }});
      }));
    };
    window.filmFrameOnce = function () {           // a frame drawn again (one that watches, or the frames a jump paints first): only the last counts
      now = [];
      return keep.filmFrameOnce.apply(this, arguments);
    };
    var last = null, lastPicture = null;
    for (var n = Math.round(from * fps); n < Math.round(to * fps); n++) {
      now = [];
      draw(n / fps);
      brush.clearRect(0, 0, small.width, small.height);
      brush.drawImage(FILM, 0, 0, small.width, small.height);
      var picture = brush.getImageData(0, 0, small.width, small.height).data, drawn = now, taken = [];
      if (last) {
        last.forEach(function (one) {
          var best = -1, far = Infinity;
          drawn.forEach(function (other, k) {
            if (taken[k] || other.name !== one.name || other.kind !== one.kind) { return; }
            var gap = Math.hypot((other.box[0] + other.box[2] - one.box[0] - one.box[2]) / 2, (other.box[1] + other.box[3] - one.box[1] - one.box[3]) / 2);
            if (gap < far) { far = gap; best = k; }
          });
          if (best >= 0) {
            taken[best] = true;
            drawn[best].most = Math.max(drawn[best].most, one.most);
          } else if (blinked(one, lastPicture, picture)) {
            var told = one.name + " (" + one.kind + ")";
            if (!blinks[told]) {
              blinks[told] = {at: n / fps, times: 0, box: one.box.map(function (v) { return Math.round(v / PIX); })};
              order.push(told);
            }
            blinks[told].times++;
          }
        });
      }
      last = drawn;
      lastPicture = picture;
    }
  } finally {
    window.person = keep.person;
    window.drawByZ = keep.drawByZ;
    window.filmFrameOnce = keep.filmFrameOnce;
    Object.keys(keepKinds).forEach(function (kind) { kinds[kind] = keepKinds[kind]; });
  }
  return order.map(function (told) {
    var one = blinks[told];
    return told + " blinked out at " + one.at.toFixed(2) + " s, at x " + one.box[0] + "-" + one.box[2] + ", y " + one.box[1] + "-" +
           one.box[3] + (one.times > 1 ? " (and " + (one.times - 1) + " more time" + (one.times > 2 ? "s" : "") + ")" : "");
  });
}
