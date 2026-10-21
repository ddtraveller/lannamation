// sabai.js - a sabai woven with figures that walk, for films made with
// oldcartoon.js: the shoulder cloth of the sash film (sash.html), as a piece
// of the kit. Load it after the kit and the creatures its rows use:
//
//     <script src="oldcartoon.js"></script>
//     <script src="naga.js"></script>
//     <script src="dragon.js"></script>
//     <script src="beasts.js"></script>
//     <script src="khom.js"></script>
//     <script src="myth.js"></script>
//     <script src="flora.js"></script>
//     <script src="pieces.js"></script>
//     <script src="band.js"></script>
//     <script src="northbirds.js"></script>
//     <script src="sabai.js"></script>
//
// and in a scene, draw the back of the cloth, then the person wearing it:
// the kit paints the band after the body and the head and before the arms,
// so the near arm hangs over its lower end:
//
//     var where = sabaiOf(t, 720, 1010, look);     // where the cloth lies on this person, this frame
//     sabai(t, where, {from: 3}, "back");          // the end that hangs behind her shoulder, down her back
//     person(720, 1010, sabaiWorn(look, t, where, {from: 3}));   // the woven band across the chest, under the arm; its rows flow from second 3
//
// The cloth is twelve rows of woven tiles, each tile one picture of the kit
// drawn by the kit's own painter at the size of a woven figure (a house and a
// rice granary, lotus, a sunbird at a flower, khom, a tung, the temple, a yak,
// a naga, the luang and the mom, a hong, a sand pagoda, a krathong), and in every row the people and animals that live
// among those things, each a six-frame walk cycle, so that on the cloth they
// walk. The rows flow along the cloth, each the other way from its neighbour,
// and the figures face the way their row flows. The cloth lies on the person
// the way the kit's own sabai lies on a woman, and covers it: two cubic curves
// from the waist on the near side, where the end is tucked in, across the
// chest, up over the top of the far shoulder beside the neck, and from that
// fold down the back behind the body, read from the joints the kit gives back
// for that person in that frame: so it follows a figure who breathes, bends
// or walks. It gathers narrower as it goes over the shoulder. The whole cloth
// is drawn before the person and the part up to the fold again over them, so
// the tail hangs behind the shoulder and only a little of it shows beyond the
// body's edge, as the models wear it.
//
// The names a cloth (the third argument of sabai()) may have; it warns about any other:
//   wide    how wide the cloth is across, in the kit's units (72, as wide as the sabai the kit draws)
//   rows    its rows, top to bottom: a list of lists of painters, as SABAI_ROWS below (the default).
//           A painter takes the sheet to draw on and "u", where in its walk cycle it is, 0 to 1;
//           a painter that takes no "u" stands still
//   tiles   the rows already made into tiles by sabaiTile() (made from "rows" once, and kept, if not given)
//   cloth   the colour of the cloth under the weave ("#8a2a3a")
//   flow    how fast the rows flow along the cloth, in units a second (2.5); 0 for a still cloth
//   from    the second the rows begin to flow and the figures to walk (0): before it the cloth is still
//   row     which row the camera of sabaiCamera() opens on (4)
//   fine    how many rows on each side of "row" get tiles of the full size (SABAI_TILE): the rest are made at half
//           of it, since the camera is far out before they fill the screen. Left out, every row is full size
//   follow  which figure of "row" (its place in the row's list) sabaiCamera() holds in the middle until it pulls back:
//           the film opens on that figure and keeps it as the row moves. Left out, a fixed place on the chest
var SABAI_KEYS = {wide: true, rows: true, tiles: true, cloth: true, flow: true, from: true, row: true, fine: true, follow: true};

var SABAI_TILE = 384;                   // a tile's side: large enough for a camera that shows one row close up
var SABAI_FRAMES = 6;                   // moments of a walk in one tile's cycle

// Run a painter that draws with the kit's "pen" on another sheet, at second "at".
// brush: a canvas 2D context; action: a function of no arguments that draws with pen; at: the second
// to set the kit's clock to while it runs (0 when left out). Returns nothing. It sets the globals pen
// and clock for the while and puts them back after, even if action throws (since 2026-10-21: before, a painter's
// error left every later drawing on the tile's sheet).
// e.g. var sheet = document.createElement("canvas"); paintWith(sheet.getContext("2d"), function () { person(150, 280, cast("boy")); }, 2.5);
function paintWith(brush, action, at) {
  var keep = pen, was = clock;
  pen = brush;
  clock = at || 0;
  try {
    action();
  } finally {
    pen = keep;
    clock = was;
  }
}

// A tile from a painter: the picture is drawn once on a scratch sheet and
// measured, then drawn again to fit the tile, at each moment of its cycle.
// painter: a function (brush, u): it draws standing on (0, 0) of the pen's frame (pen is brush while
// it runs), u 0 to 1 its walk; one that takes fewer than two arguments stands still. side: the
// tile's side in pixels (SABAI_TILE, 384, when left out). Returns a list of canvases, side by side
// pixels: SABAI_FRAMES (6) of them for a painter that walks, else 1. Slow: make tiles once, not per frame.
// e.g. var frames = sabaiTile(function (b, u) { person(0, 0, cast("boy", {step: u})); }, 192);
function sabaiTile(painter, side) {
  var scratch = document.createElement("canvas");
  scratch.width = 800;
  scratch.height = 800;
  var probe = scratch.getContext("2d");
  probe.save();
  probe.translate(400, 520);
  paintWith(probe, function () { painter(probe, 0); });
  probe.restore();
  var data = probe.getImageData(0, 0, 800, 800).data, left = 800, top = 800, right = 0, bottom = 0;
  for (var y = 0; y < 800; y += 2) {
    for (var x = 0; x < 800; x += 2) {
      if (data[(y * 800 + x) * 4 + 3] > 40) {
        if (x < left) { left = x; } if (x > right) { right = x; } if (y < top) { top = y; } if (y > bottom) { bottom = y; }
      }
    }
  }
  side = side || SABAI_TILE;
  var wide = Math.max(8, right - left), tall = Math.max(8, bottom - top), fit = (side * 0.86) / Math.max(wide, tall);
  var frames = [], count = painter.length >= 2 ? SABAI_FRAMES : 1;   // a painter that takes "u" moves; the rest stand
  for (var n = 0; n < count; n++) {
    var sheet = document.createElement("canvas");
    sheet.width = side;
    sheet.height = side;
    var brush = sheet.getContext("2d");
    brush.translate(side / 2 - ((left + right) / 2 - 400) * fit, side / 2 - ((top + bottom) / 2 - 520) * fit);
    brush.scale(fit, fit);
    var u = n / SABAI_FRAMES;
    paintWith(brush, (function (b, moment) { return function () { painter(b, moment); }; })(brush, u), u);
    frames.push(sheet);
  }
  return frames;
}

// The twelve rows the sash film weaves, top to bottom: what Thai life is made
// of, and in every row the people and the animals that live among those things.
// The owner (2026-10-15): "remove some of the repeating sprites like the monk
// and add the temple guardian, the oxen, a baby pig, and a few of the hanging
// lanterns". So no monk (there were two), one dog fewer, two fish fewer, one
// drummer and one villager fewer, one khom loi fewer; the temple guardian (yak,
// as the statue at Wat Phra Kaeo) stands between the two naga as well as by
// the temple; the water buffalo, the kit's draught animal (it pulls the cart
// in the rain), walks among the lotus leaves; a sow walks with her piglet
// behind her among the houses (a tile is fitted to its picture, so a piglet
// alone would be drawn as large as a sow); and three khom, the hanging
// lanterns, red, blue and green, hang by the temple and among the lanterns. A
// khom is tied 400 above the tile's middle so it hangs inside it.
// Then (owner, 2026-10-17): "Replace the fish on the sash with the humingbird
// type bird and review the items on the sash and replace generic items with
// special Lanna specific items". The two fish are the green-tailed sunbird of
// northbirds.js, one sipping at a thong kwao flower and one hovering; and what
// any land might weave is now Lanna's own: the second house is the long khao,
// the rice granary of a farmstead of the north; the plain tree, the coconut
// palm and the banana are a kwian, the wooden ox cart (its wheels turn), a
// bunch of longan (the fruit of Lamphun and Chiang Mai) and the nam ton, the
// water jar at the gate (a thong kwao tree and a longan tree in fruit were
// tried first: at a tile's size both read as the same green tree); a dog is an elephant, and the other a green peafowl in
// display (Phayao's); the plain paper lantern is the khom dao, the star lantern
// of Yi Peng; a yellow blossom is the dok ueang, the orchid of the north; the
// two dragons of the Himalayan paintings are Lanna's own creatures, the luang
// and the mom, and the scientist in his white coat is a player of the sueng;
// the sun and the cloud of the thangka are the hong, the golden swan on its
// pole, and a chedi sai, the sand pagoda of Songkran with its flags; and the
// two plain blossoms are a thong kwao flower and a krathong of Yi Peng. A film
// made before this that loads no northbirds.js weaves a gourami, a barb and the dog (the kit's native fish:
// owner, 2026-10-20, "Replace any of the old style fish on the sash").
// sabaiBird(painter, before) gives back a painter (b, u) that runs painter when northbirds.js is
// loaded (sunbird() is a function), and before when it is not. Both are painters as sabaiTile() takes.
// e.g. sabaiBird(function (b, u) { sunbird(0, 0, u / 13, {size: 2.4, hover: 1}); }, function (b) { dog(0, 0, 0); })
function sabaiBird(painter, before) {    // a tile of northbirds.js, or what was woven there before it
  return function (b, u) { if (typeof sunbird === "function") { painter(b, u); } else { before(b, u); } };
}

var SABAI_ROWS = [
  [function (b) { house(b, 0, 0, 0.7); }, function (b, u) { person(0, 0, cast("villager", {size: 1.1, step: u})); }, function (b) { longKhao(b, 0, 0, 0.6); },
   function (b, u) { pig(60, 0, {size: 0.8, step: u}); pig(-150, 0, {size: 0.42, step: u + 0.3}); }],
  [function (b, u) { oxcart(b, 0, 0, 1, u * Math.PI, 1); }, function (b, u) { person(0, 0, cast("child", {size: 1.2, step: u, smile: 1})); },
   function () { flora("longan", 0, 0, {size: 2, ground: false}); }, function (b, u) { rooster(0, 0, u * 2); }, function (b) { namton(b, 0, 0, 1.2); }],
  [function (b) { lotus(b, 0, 0, 1.3, "#f28fa8", 1); }, function (b, u) { person(0, 0, cast("maiden", {size: 1.1, step: u})); }, function (b) { lotus(b, 0, 0, 1.1, "#e9627f", 0.4); },
   sabaiBird(function (b, u) { flora("thongkwao", 26, 64, {size: 0.6, ground: false}); sunbird(-36, -14, u / 13, {size: 3.4, hover: 1, sip: 1}); },
             function (b) { nativeFish(b, 0, 0, 1.6, 1, "gourami", 0); })],
  [sabaiBird(function (b, u) { sunbird(0, 0, u / 13, {size: 2.4, hover: 1}); }, function (b) { nativeFish(b, 0, 0, 1.6, 1, "barb", 0); }),
   function (b, u) { person(0, 0, cast("fellow", {size: 1.1, step: u})); }, function (b, u) { buffalo(0, 0, {size: 0.55, step: u}); },
   function (b) { lotusLeaf(b, 0, 10, 1.0, 0.2, "#3f8f5a"); }],
  [function (b, u) { rooster(0, 0, u * 2); }, function (b, u) { person(0, 0, cast("weaver", {size: 1.1, step: u})); }, function (b, u) { elephant(0, 0, {size: 0.35, step: u}); },
   function (b, u) { person(0, 0, cast("lady", {size: 1.1, step: u})); }],
  [function () { khom(0, -400, {colour: KHOM_RED, lit: 0, sway: 0}); }, function (b, u) { person(0, 0, cast("celestial", {size: 1.1, step: u})); },
   function () { khom(0, -400, {colour: KHOM_BLUE, lit: 0, sway: 0}); }, function () { khomDao(0, -300, {colour: KHOM_GOLD, lit: 0, sway: 0}); }],
  [function (b) { tung(b, 0, 0, 0); }, function (b, u) { person(0, 0, cast("child", {size: 1.2, step: u})); }, function () { flora("orchid", 0, 0, {size: 1.6, ground: false}); },
   function (b, u) { person(0, 0, cast("dancer", {size: 1.1, step: u, handA: [60, -120], handB: [-50, -100]})); }],
  [function (b) { temple(b, 0, 0); }, function (b) { yak(b, 0, 0, 1); }, function () { khom(0, -400, {colour: KHOM_GREEN, lit: 0, sway: 0}); }, function (b, u) { person(0, 0, cast("drummer", {size: 1.1, step: u})); }],
  [function (b, u) { naga(0, -60, {size: 0.5, heads: 3}); }, function (b) { yak(b, 0, 0, -1); }, function (b, u) { naga(0, -60, {size: 0.5, heads: 5, body: "#d9a441", crest: "#3a2418"}); }, function (b, u) { person(0, 0, cast("maiden", {size: 1.1, step: u})); }],
  [function () { luang(0, 0, {size: 0.4}); }, function (b, u) { musician(0, 0, "sueng", cast("fellow", {size: 1.1}), u * 2); },
   function (b, u) { mom(0, 0, {size: 0.6, step: u}); }, function (b, u) { person(0, 0, cast("lady", {size: 1.1, floor: true})); }],
  [function (b) { hong(b, 0, 0, 1); }, function (b, u) { chediSai(b, 0, 0, 1, u * 2, 2); }, function (b, u) { person(0, 0, cast("dancer", {size: 1.1, step: u, handA: [70, -130]})); }],
  [function () { flora("thongkwao", 0, 0, {size: 1.4, ground: false}); }, function (b, u) { person(0, 0, cast("child", {size: 1.2, floor: true})); },
   function (b, u) { krathong(b, 0, 0, 1, u * 2, false); },
   sabaiBird(function (b, u) { peafowl(0, 0, u, {size: 0.6, display: 1, shiver: 0.5}); }, function (b, u) { dog(0, 0, u); })]
];

// Every figure on the cloth its own (owner, 2026-10-20: "review the initial
// sash scene and try to make sure each sprite on the sash is unique"): a row
// of three to five painters repeats each of them six times along it. So
// sabaiUnique() fills each row up to the number of figures it holds with
// painters from sabaiPool(), none of them twice, and no item twice in another
// colour (owner: "totally unique items"): every member of the cast in eight
// ways, each a different person to look at by the kit's face, body and hair
// (walking, sitting, laughing with the Thai face, with a fat body, fat and
// laughing with the Thai face, with a hair style of their own, sitting with a
// fat body, sitting with the Thai face and a hair style of their own), the band's players, the animals, birds and fish, the creatures of
// the myths, the flowers and fruits, the trees of a shape of their own, each
// lantern, and the things of a house and a village.
// Each painter has a "key" (its name and its way, "villager walk"); a row's
// own painters do not have one, and the keys a film's rows already show are
// passed as "shown", so the pool does not weave them a second time. What the
// pool has comes from the scripts the page loads: a painter whose script is
// not loaded is not in it. The kit's monk is not woven, nor the Hatsadiling.
var SABAI_PEOPLE = ["villager", "child", "maiden", "fellow", "weaver", "lady", "celestial", "dancer", "drummer", "boy", "girl",
                    "farmer", "noble", "elder", "grandmother", "oldfarmer", "devotee", "inta", "khammun", "buakham", "sinuan", "bunma", "dokkham",
                    "scientist"];
var SABAI_WAYS = {                      // a person's ways, each a look added to the cast member's own; a way with no step stands
  walk: {walks: true},
  hair: {walks: true, north: "thai", hair: true},   // a hair style of its own (SABAI_HAIRS, by the person's place in the list)
  sit: {floor: true},
  laugh: {walks: true, north: "thai", feel: "laughing"},
  fat: {walks: true, body: "fat"},
  fatlaugh: {walks: true, body: "fat", north: "thai", feel: "laughing"},
  fatsit: {floor: true, body: "fat"},
  hairsit: {floor: true, north: "thai", hair: true}
};
// No wai on the cloth (owner, 2026-10-20: "There are people who look like they have bells or tissues over their
// noses. Get rid of those ones": at a woven figure's size, hands pressed together before the chest read as something
// held over the nose).
var SABAI_HAIRS = ["low", "wong", "ipun", true];   // BUN_STYLES: a low knot, a knot on top, the e-pun knot, a high bun
var SABAI_PLAYERS = {salo: "fellow", sueng: "farmer", pichum: "elder", phinphia: "fellow"};
// What comes first on the cloth, nearest where the film opens, and what last: by what matters most to Lanna (owner,
// 2026-10-20: "Use mythical and exotic things like animals, birds, people, etc. before common items", then "Think
// about what's important to lanna culture and place items more important to Lanna towards the center"). First Yi
// Peng's lanterns and lamps and the tung of the temples; the tale's creature and the tattooed pu man; the Lanna table
// (sticky rice in its kong khao, the khantoke, khao soi, sai ua, nam phrik); the house and the palace hall; the band
// of the north and the gong; the ta laew that guards a yard; the people in Lanna dress and at their work; the north's
// birds and beasts (the peafowl of Phayao, the hornbill, Mrs Hume's pheasant, the tokay of the house wall, the Haw
// caravans' pack horse) and the pond's fish; the flowers of its temples and gardens. Then whatever else (the Chinese
// dragon, the apsara, the dishes of elsewhere, the fruits), then the things of every day (SABAI_COMMON), and last the
// people's other ways. (The rows' own figures, sash.html's, already hold the naga, the elephant, the temple, the khom,
// the tung, the krathong, the chedi sai, the hong, the Mom, Phaya Luang, the yak, the granary and the water jar.)
var SABAI_LANNA = ["khom phat", "khom bua", "hand lantern", "sky lantern", "pratheep", "tung sai mu", "tung yai",
                   "maeng", "pu man", "stickyrice", "rice basket", "khantoke", "khaosoi", "saiua", "namphrik",
                   "bamboo house", "hall", "drum cart", "salo", "pichum", "phinphia", "gong", "ta laew",
                   "dancer walk", "noble walk", "devotee walk", "elder walk", "grandmother walk", "farmer walk", "oldfarmer walk",
                   "buakham walk", "sinuan walk", "inta walk", "khammun walk", "bunma walk", "dokkham walk", "lady walk", "girl walk", "boy walk",
                   "peafowl walking", "hornbill", "pheasant", "magpie", "tokay", "horse", "tiger", "egret",
                   "gourami", "barb", "flying", "snakehead", "ratchaphruek", "frangipani", "jasmine", "marigold"];
var SABAI_COMMON = ["house", "bamboo house", "field hut", "hut", "granary", "basket", "rice basket", "open basket", "mortar", "ta laew",
                    "firewood", "huad", "grass", "bananas", "gold", "fire stick", "pen", "gong", "snare", "cave", "namton",
                    "lotus leaf", "tree", "palm", "banana", "bamboo", "areca"];   // the band's players, as the maker has them

// sabaiPool() gives back the painters the cloth may weave, a list of functions (b, u), each with a
// .key string ("villager walk", "khom dao", "khaosoi"): every item first, by SABAI_LANNA's order,
// then the rest, then SABAI_COMMON's, then the people's other ways. Only painters whose script the
// page loaded are in it. Changes nothing outside itself.
// e.g. var keys = sabaiPool().map(function (p) { return p.key; });
function sabaiPool() {
  var people = [];
  Object.keys(SABAI_WAYS).forEach(function (way) {
    SABAI_PEOPLE.forEach(function (name) {
      if (!CAST[name]) { return; }
      var how = Object.assign({}, SABAI_WAYS[way]), walks = how.walks;
      delete how.walks;
      if (how.hair) {                                 // the hair changes, not who wears it (the kit's lady apart from bun)
        delete how.hair;
        how.bun = SABAI_HAIRS[SABAI_PEOPLE.indexOf(name) % SABAI_HAIRS.length];
        how.lady = !!CAST[name].bun;
      }
      var painter = walks ? function (b, u) { person(0, 0, cast(name, Object.assign({size: 1.1, step: u}, how))); }
                          : function (b) { person(0, 0, cast(name, Object.assign({size: 1.1}, how))); };
      painter.key = name + " " + way;
      people.push(painter);
    });
  });
  var others = [];
  function more(key, needs, painter) { if (typeof window[needs] === "function") { painter.key = key; others.push(painter); } }
  Object.keys(SABAI_PLAYERS).forEach(function (kind) {
    more(kind, "musician", function (b, u) { musician(0, 0, kind, cast(SABAI_PLAYERS[kind], {size: 1.1}), u * 2); });
  });
  // the animals, the birds and the fish
  more("rooster", "rooster", function (b, u) { rooster(0, 0, u * 2); });
  more("hen", "rooster", function (b, u) { rooster(0, 0, u * 2, {hen: true}); });
  more("dog", "dog", function (b, u) { dog(0, 0, u * 2); });
  more("pig", "pig", function (b, u) { pig(0, 0, {size: 0.8, step: u}); });
  more("buffalo", "buffalo", function (b, u) { buffalo(0, 0, {size: 0.55, step: u}); });
  more("elephant", "elephant", function (b, u) { elephant(0, 0, {size: 0.35, step: u}); });
  more("tiger", "tiger", function (b, u) { tiger(0, 0, {size: 0.6, step: u}); });
  more("cat", "cat", function (b, u) { cat(0, 0, {size: 1, step: u}); });
  more("horse", "horse", function (b, u) { horse(0, 0, {size: 0.75, step: u, pack: true}); });
  more("house mouse", "mouse", function (b, u) { mouse(0, 0, {kind: "house", size: 1.1, step: u}); });
  more("field mouse", "mouse", function (b, u) { mouse(0, 0, {kind: "field", size: 1.1, step: u}); });
  more("tokay", "gecko", function (b, u) { gecko([[-90, 0], [90, 0]], 150 + 20 * u, {size: 1, t: u}); });
  more("peafowl", "peafowl", function (b, u) { peafowl(0, 0, u, {size: 0.6, display: 1, shiver: 0.5}); });
  more("peafowl walking", "peafowl", function (b, u) { peafowl(0, 0, u, {size: 0.6, step: u}); });   // its train down (owner, 2026-10-20: "replace the camp fire with a peafowl")
  more("pheasant", "pheasant", function (b, u) { pheasant(0, 0, u, {size: 0.9, step: u}); });
  more("sunbird", "sunbird", function (b, u) { sunbird(0, 0, u / 13, {size: 2.4, hover: 1}); });
  more("magpie", "blueMagpie", function (b, u) { blueMagpie(0, 0, u, {size: 0.9, fly: true}); });
  more("hornbill", "hornbill", function (b, u) { hornbill(0, 0, u, {size: 0.7, fly: true}); });
  ["gourami", "barb", "flying", "snakehead"].forEach(function (kind) {
    more(kind, "nativeFish", function (b, u) { nativeFish(b, 0, 0, 1.6, 1, kind, u); });
  });
  // the creatures of the myths
  more("mom", "mom", function (b, u) { mom(0, 0, {size: 0.6, step: u}); });
  more("luang", "luang", function () { luang(0, 0, {size: 0.4}); });
  more("maeng", "maengSiHuHaTa", function (b, u) { maengSiHuHaTa(0, 0, {size: 0.6, step: u}); });
  more("naga", "naga", function () { naga(0, -60, {size: 0.5, heads: 3}); });
  more("yak", "yak", function (b) { yak(b, 0, 0, 1); });
  more("hong", "hong", function (b) { hong(b, 0, 0, 1); });
  // the flowers and fruits (owner, 2026-10-20: "I see repeat items. Specifically a tree. Make sure flowers are
  // represented": the twelve trees in flower or fruit were one round green tree at the cloth's size, so only trees
  // of a shape of their own are woven, below; each flower once, in its own colour: "totally unique items")
  Object.keys(window.FLORA || {}).forEach(function (name) {
    more(name, "flora", function () { flora(name, 0, 0, {size: 1.6, ground: false}); });
  });
  more("tree", "tree", function (b) { tree(b, 0, 0, 1.1); });
  more("palm", "palm", function (b) { palm(b, 0, 0, 400); });
  more("banana", "banana", function (b) { banana(b, 0, 0); });
  more("bamboo", "bamboo", function (b) { bamboo(b, 0, 0, 1, 3); });
  more("areca", "areca", function (b) { areca(b, 0, 0, 1, 5); });
  more("lotus", "lotus", function (b) { lotus(b, 0, 0, 1.3, "#f28fa8", 1); });
  more("lotus leaf", "lotusLeaf", function (b) { lotusLeaf(b, 0, 10, 1.0, 0.2, "#3f8f5a"); });
  // the lanterns
  more("khom", "khom", function () { khom(0, -400, {colour: KHOM_RED, lit: 0, sway: 0}); });   // each lantern once, in one colour
  more("khom dao", "khomDao", function () { khomDao(0, -300, {colour: KHOM_GOLD, lit: 0, sway: 0}); });   // khom.js, as KHOM_GOLD is
  more("khom phat", "khomPhat", function () { khomPhat(0, -300, {lit: 0}); });
  more("khom bua", "khomBua", function () { khomBua(0, -300, {lit: 0}); });
  // the things of a house and of a village
  more("house", "house", function (b) { house(b, 0, 0, 0.7); });
  more("bamboo house", "ruenPhuk", function (b) { ruenPhuk(b, 0, 0, 1); });
  more("field hut", "fieldHut", function (b) { fieldHut(b, 0, 0, 1); });
  more("granary", "longKhao", function (b) { longKhao(b, 0, 0, 0.6); });
  more("temple", "temple", function (b) { temple(b, 0, 0); });
  more("tung", "tung", function (b) { tung(b, 0, 0, 0); });
  more("tung sai mu", "tungSaiMu", function (b, u) { tungSaiMu(b, 0, 0, 1.3, u * 2, 7, 7); });
  more("tung yai", "tungYai", function (b, u) { tungYai(b, 0, 0, 0.8, u * 2); });
  more("chedi sai", "chediSai", function (b, u) { chediSai(b, 0, 0, 1, u * 2, 2); });
  more("krathong", "krathong", function (b, u) { krathong(b, 0, 0, 1, u * 2, false); });
  more("pratheep", "pratheep", function (b, u) { pratheep(b, 0, 0, 1.6, u * 2, 1, {glow: false}); });   // no glow on the ground: it would show square
  more("namton", "namton", function (b) { namton(b, 0, 0, 1.2); });
  more("oxcart", "oxcart", function (b, u) { oxcart(b, 0, 0, 1, u * Math.PI, 1); });
  more("drum cart", "drumCart", function (b) { drumCart(b, 0, 0, 0.5, 1); });
  more("hall", "hoKham", function (b) { hoKham(b, 0, 0, 0.5, {part: "back", pediment: "peacock"}); hoKham(b, 0, 0, 0.5, {part: "front", pediment: "peacock"}); });
  more("gong", "gong", function (b) { gong(b, 0, 0, 1.1); });
  more("pen", "kok", function (b) { kok(b, 0, 0, 380, 1, {part: "back"}); kok(b, 0, 0, 380, 1, {part: "front"}); });
  more("basket", "sawian", function (b) { sawian(b, 0, 0, 1.2); });
  more("rice basket", "kongKhao", function (b) { kongKhao(b, 0, 0, 1.1); });
  more("open basket", "krabung", function (b) { krabung(b, 0, 0, 1.1); });
  more("mortar", "mortar", function (b) { mortar(b, 0, 0, 1.1); });
  more("ta laew", "taLaew", function (b) { taLaew(b, 0, 0, 1.1); });
  more("firewood", "firewood", function (b) { firewood(b, 0, -8, 1.1, {loose: true}); });
  more("huad", "huad", function (b, u) { huad(b, 0, 0, 1, u * 2, {fire: 1}); });
  more("grass", "grassBundle", function (b) { grassBundle(b, 0, 0, 1, {}); });
  more("bananas", "bananas", function (b) { bananas(b, 0, 0, 1, {}); });
  more("gold", "goldNugget", function (b, u) { goldNugget(b, 0, 0, 1, u, {}); });
  more("fire stick", "fireStick", function (b) { fireStick(b, [-60, 0], [60, -12], {hot: 0.6}); });
  more("cave", "caveMouth", function (b) { caveMouth(b, 0, 0, 0.6, {}); });
  more("red truck", "rotDaeng", function (b) { b.save(); b.scale(0.6, 0.6); rotDaeng(b, 0, 0, 1, 0, 1, function () {}); b.restore(); });
  more("sky lantern", "lantern", function (b) { b.save(); b.beginPath(); b.rect(-45, -190, 90, 140); b.clip(); lantern(0, -100, 70); b.restore(); });
  more("sun", "sun", function (b, u) { sun(0, -60, u * 2); });
  more("dragon", "dragon", function () { dragon(0, -80, {size: 0.4, breath: 0.5}); });
  more("egret", "egret", function (b, u) { egret(0, 0, u, {size: 1, peck: 0.5 + 0.5 * Math.sin(u * Math.PI * 2)}); });
  more("birds", "birds", function (b, u) {             // the kit's flock is drawn in its dark ink, which the cloth would hide: here in cream
    b.save(); birds(u * 2, 0, -60); b.globalCompositeOperation = "source-in"; b.fillStyle = "#f4ecd2"; b.fillRect(-400, -400, 800, 800); b.restore();
  });
  more("apsara", "apsara", function () { apsara(0, 0, {size: 1}); });
  more("pu man", "puman", function (b, u) { puman(0, 0, {size: 1, step: u}); });
  more("hut", "tub", function (b) { tub(b, 0, 0, 1.4); });
  more("snare", "snare", function (b) { snare(b, 0, 0, 0.8, {}); });
  more("hand lantern", "khomThue", function () { khomThue(0, -200, {size: 1, lit: 0}); });
  Object.keys(window.FOODS || {}).forEach(function (name) {   // food.js: the dishes of the north, and the khantoke they are set out on
    more(name, "food", function () { food(name, 0, 0, {size: 2, steam: false}); });
  });
  // Every item first, each person once among them (their first way), and only then the people's other ways, the
  // variations on a theme (owner, 2026-10-20: "Make sure all unique items are represented before repeating themes"):
  // a cloth with fewer places than the pool has leaves out a variation, never an item. sabaiUnique() deals the pool
  // to the rows in turn, so the items are spread over every row.
  // And among the items, by what matters most to Lanna, then the rest, then the things of every day (SABAI_LANNA,
  // SABAI_COMMON): sabaiUnique() with a centre deals the first nearest it.
  var items = others.concat(people.filter(function (one) { return / walk$/.test(one.key); }));
  var again = people.filter(function (one) { return !/ walk$/.test(one.key); });
  var rank = function (one) { var at = SABAI_LANNA.indexOf(one.key); return at >= 0 ? at : SABAI_COMMON.indexOf(one.key) >= 0 ? 2000 : 1000; };
  var ranked = items.map(function (one, i) { return [rank(one), i, one]; });
  ranked.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
  return ranked.map(function (one) { return one[2]; }).concat(again);
}

// The rows, each filled with painters of the pool up to "count" figures, none of them twice on the cloth and none
// whose key is in "shown". A row that has more than "count" painters already is left as it is.
// With "centre" ([row, slot]: where the film opens, the figure it follows), the places nearest it, in its row and the
// rows beside it, are dealt first, so the pool's first (the mythical and the exotic) are what is seen there.
//   rows    a list of rows, each a list of painters (SABAI_ROWS or a film's own); not changed
//   count   how many figures each row should hold
//   shown   optional: a list of keys (sabaiPool()'s) not to weave again
//   centre  optional: [row, slot], where the film opens
// Returns a new list of rows. It warns (the kit's warn()) when the pool is too small and painters come twice.
// e.g. var ROWS = sabaiUnique(SABAI_ROWS, 24, [], [4, 8]);  var CLOTH = {rows: ROWS, row: 4, follow: 8};
function sabaiUnique(rows, count, shown, centre) {
  var pool = sabaiPool().filter(function (painter) { return !(shown || []).some(function (k) { return k === painter.key; }); });
  var out = rows.map(function (row) { return row.slice(); }), need = 0, n = 0;
  out.forEach(function (row) { need += Math.max(0, count - row.length); });
  if (need > pool.length) { warn("sabaiUnique: the cloth needs " + need + " more figures and the pool has " + pool.length + ": some come twice"); }
  if (centre) {
    var places = [];
    out.forEach(function (row, r) { for (var i = row.length; i < count; i++) { places.push([r, i, Math.abs(r - centre[0]) * 2.5 + Math.abs(i - centre[1])]); } });
    places.sort(function (a, b) { return a[2] - b[2] || a[0] - b[0] || a[1] - b[1]; });
    places.forEach(function (one) { out[one[0]][one[1]] = pool[n++ % pool.length]; });
    return out;
  }
  for (var k = 0; k < count; k++) {                  // a figure to each row in turn, so the rows share the pool's mix
    out.forEach(function (row) {
      if (row.length >= count) { return; }
      row.push(pool[n++ % pool.length]);
    });
  }
  return out;
}

var SABAI_SCRATCH = null;               // a sheet the person is drawn on to ask where their joints are
var SABAI_SLEEVE = {};                  // how far the sleeve's outer line is from the far elbow, for each build of figure, read once
var SABAI_ARMS = ["handA", "handB", "reachA", "reachB", "wai", "grip", "parasol", "holding", "wristA", "wristB"];   // what moves the arms: the cloth is read with them hanging
var SABAI_FLEETING = ["step", "late", "spring", "at", "glance", "blink", "mouth", "smile", "feel", "wonder", "fear", "anger", "sad",
                      "sing", "sway", "up", "tilt", "turn", "stride", "eyes", "lips", "id"];   // what changes from frame to frame and not the sleeve's line

// The look with the arms hanging, under an id of its own, so that the cloth
// does not move when the arms do (a wai, a wave), and the drawing that is
// measured keeps its own swing apart from the person's.
// look: a person's look; id: a string. Returns a copy of look with that id and without the keys of
// SABAI_ARMS. Changes nothing outside itself.
// e.g. var still = sabaiHanging(cast("lady", {sabai: false}), "lady/sabai");
function sabaiHanging(look, id) {
  var still = Object.assign({}, look, {id: id});
  SABAI_ARMS.forEach(function (name) { delete still[name]; });
  return still;
}

// Where the cloth lies on a person drawn at (x, y) with "look", at second t.
// The owner (2026-10-15), building it up a step at a time: a rectangle from
// the neck off the shoulder down to the waist on the opposite side; its upper
// corner where the neck meets the shirt, then moved down and to the side so
// it starts beside the neck, not at its middle; the top end rounded, curving
// down over the shoulder; the two long sides bent so it looks like it wraps
// her body; cut off just past the vertical line of her shirt on the far side;
// then the whole of it up and to the right a little, and the long sides bent
// to the right, the way she faces. So: one band, 72 wide, at 45 degrees, from
// beside the base of the neck on the near side (her left, in the kit's
// three-quarter view) down across the chest, its middle line bowed a little
// the way she faces, worn under the far arm (sabaiWorn), its lower end cut
// on a slant under that arm: the middle line is laid to a vertical line 4
// outside the shirt's own line on that side (the sleeve's outer edge at the
// elbow's height, read off the drawing of the person on the scratch sheet),
// the band begins 59 along from where it would meet that line, so that its
// upper corner lies 12 inside the line, under the arm, and its lower corner
// is 10 further to the left (and down) along the lower edge (owner: "the
// long left and right side both need to be shorter", "make sure the top two
// corners stay pinned where they are": the curve is the same, only cut
// shorter; then "just move the bottom most corner over to the left about 10
// px"). It is tucked into the skirt at the waist: nothing of it is drawn
// below the waist's line (owner: "cut it off near where the shirt tucks into
// the skirt"). The wearer has sabai: false, so the kit draws no band of its
// own on the other diagonal.
// The back of the cloth (owner, with a photograph of a woman in a red
// sabai, its end hanging in folds behind her arm to the ground with a
// fringe): "add a line from the right most corner down to just past the
// hand that gently undulates down past the waist and hand and a curved line
// to the left and fill with the red sash color and shade it but leave it
// unmarked. Add tassels to the end of the sash." So from the top end's
// corner at the shoulder an outer edge waves gently down the far side of
// the body, leaning out a little, to a hem just past the hand; the hem
// curves to the left, bowing down, to an inner edge behind the body; it is
// drawn before the person, so only what lies past the body's and the arm's
// edge is seen. The hem is read from the hip, not the hand, so a hand
// raised to wave does not lift it.
// Gives back {at(u), angle(u), uAt(along), length, start, fold, top,
// squeeze(along), middle, tilt, startCap, endCap, tuck, tail}: a point and a
// heading at u of the way along; the u of a distance along; the length; how
// far along the band begins; how far along the fold is and how far the part
// drawn over the person ends (both the whole length while there is no
// fold); how much narrower the cloth is at a distance along (1: it does not
// gather); the part across the chest that a camera holds (0.4 of the way);
// how each end is cut (see sabai()); the height of the waist's line, below
// which the cloth is tucked away; and the back of the cloth, {outer, hem,
// inner}: the outer edge's points from the shoulder down, the hem's from
// the outer edge's foot to the inner edge, and the inner edge's top.
//   t      the time in seconds
//   x, y   where the person stands, pixels of the sheet, as person(x, y, look) takes them
//   look   the person's look (needed; its keys: person()'s, in oldcartoon.js); give it sabai: false
// It draws the person twice on SABAI_SCRATCH (a sheet it makes the first time) and fills
// SABAI_SLEEVE, a cache by build (emptied past 200). It does not draw on pen.
// e.g. var where = sabaiOf(t, 720, 1010, cast("lady", {sabai: false}));
function sabaiOf(t, x, y, look) {
  if (!SABAI_SCRATCH) {
    SABAI_SCRATCH = document.createElement("canvas");
    SABAI_SCRATCH.width = WIDE;
    SABAI_SCRATCH.height = 1080;
  }
  var scratchPen = SABAI_SCRATCH.getContext("2d"), joints;
  var hanging = sabaiHanging(look, (look.id || "someone") + "/sabai");
  paintWith(scratchPen, function () { scratchPen.clearRect(0, 0, WIDE, 1080); joints = person(x, y, hanging); }, t);
  var face = look.face || 1, shoulder = joints.shoulderA, elbow = joints.elbowB, hip = joints.hip, n;
  var half = 36, bow = 20;                            // half the band's width; how far its middle line bows the way she faces
  var slope = -Math.PI / 4;                           // the band's heading up the chest: 45 degrees
  var dx = Math.cos(slope) * face, dy = Math.sin(slope);                     // along the band, upward
  var nx = -Math.sin(slope) * face, ny = Math.cos(slope);                    // across the band, to its lower side
  var neck = [shoulder[0] - 22 * face, shoulder[1] - 38];                    // beside the base of the neck, the near side, a little up and forward of it
  var top = [neck[0] + nx * half, neck[1] + ny * half];                      // the middle of the band's upper end: its upper corner is beside the neck
  // The shirt's line on the far side, at the far elbow's height, where the
  // sleeve hangs beside the body: from outside inward, the first pixel of the
  // person. It is read once for each build of figure, standing still at
  // second 0 with the arms hanging, as a distance from the elbow, and from
  // then on the cut follows the elbow joint: read afresh every frame, in
  // whole pixels, it jumped a pixel at a time, and the opening's camera, a
  // row of the cloth 90 times as large, threw the woven figures 50 pixels in
  // a frame (owner: "why is it so choppy to start? It should be smooth").
  // The middle line is laid to the vertical line 4 outside it.
  // The figure measured is the look itself with the arms hanging and what
  // changes from frame to frame left out, standing at a fixed place, so the
  // measure is the same whichever frame asks first, and a still agrees with
  // the film; that look is also the key it is kept under.
  var steady = sabaiHanging(look, "sabai/measure");
  SABAI_FLEETING.forEach(function (name) { delete steady[name]; });
  var build = JSON.stringify(steady);
  steady.id = "sabai/measure";
  if (SABAI_SLEEVE[build] === undefined) {
    if (Object.keys(SABAI_SLEEVE).length > 200) { SABAI_SLEEVE = {}; }   // a scene that changes a figure's build every frame does not fill the memory
    var measured;
    paintWith(scratchPen, function () {
      scratchPen.clearRect(0, 0, WIDE, 1080);
      measured = person(400, 1000, steady);
    }, 0);
    var count = 150, left = Math.round(face > 0 ? measured.hip[0] - count + 1 : measured.hip[0]);
    var strip = scratchPen.getImageData(left, Math.round(measured.elbowB[1]), count, 1).data, edge = measured.hip[0] - 50 * face;   // no outline found: a guess
    for (n = 0; n < count; n++) {
      var px = face > 0 ? n : count - 1 - n;
      if (strip[px * 4 + 3] >= 60) { edge = left + px; break; }
    }
    SABAI_SLEEVE[build] = edge - measured.elbowB[0];
  }
  var cutX = elbow[0] + SABAI_SLEEVE[build] - 4 * face;
  var reach = Math.abs((top[0] - cutX) / (dx || 1e-6));   // how far down the band's heading that line is
  var end = [top[0] - dx * reach, top[1] - dy * reach];   // where the band's middle line would meet it: the curve's far end
  var start = (16 + half * Math.SQRT1_2) * Math.SQRT2;    // the band begins this far along from there: its upper corner (half a width up the normal) lies 12 inside the sleeve's line, under the arm
  var slant = 10 * Math.SQRT2;                            // and its lower corner is this much further along the lower edge, 10 to the left and 10 down: the end slants
  var mid = [(top[0] + end[0]) / 2 + face * bow * 2, (top[1] + end[1]) / 2];   // the curve's control: the middle bows "bow" the way she faces, so the long sides bend to her front
  var points = [], marks = [0], length = 0;
  for (n = 0; n <= 24; n++) {                        // the line as points, from the end up to the top, a quadratic curve
    var s = n / 24, v = 1 - s;
    points.push([v * v * end[0] + 2 * v * s * mid[0] + s * s * top[0], v * v * end[1] + 2 * v * s * mid[1] + s * s * top[1]]);
    if (n) { length += Math.hypot(points[n][0] - points[n - 1][0], points[n][1] - points[n - 1][1]); marks.push(length); }
  }
  function seek(along) {                             // which segment a distance along falls in, and how far through it
    along = Math.max(0, Math.min(length, along));
    var lo = 0, hi = marks.length - 1;
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (marks[m] <= along) { lo = m; } else { hi = m; } }
    return [lo, (along - marks[lo]) / (marks[hi] - marks[lo] || 1)];
  }
  function pointAt(along) {
    var w = seek(along), p = points[w[0]], q = points[w[0] + 1] || p;
    return [p[0] + (q[0] - p[0]) * w[1], p[1] + (q[1] - p[1]) * w[1]];
  }
  function headingAt(along) {                        // the heading of the segment a distance along falls in
    var i = Math.min(points.length - 2, seek(along)[0]), p = points[i], q = points[i + 1];
    return Math.atan2(q[1] - p[1], q[0] - p[0]);
  }
  function at(u) { return pointAt(u * length); }
  function angle(u) { return headingAt(u * length); }
  function uAt(along) { return Math.max(0, Math.min(1, along / length)); }
  function squeeze(along) { return 1; }
  function side(along, across) {                     // a point of an edge: "across" from the middle line, as sabaiAt() has it
    var q = pointAt(along), g = headingAt(along);
    return [q[0] - Math.sin(g) * across, q[1] + Math.cos(g) * across];
  }
  // The slanted end: a line through its two corners, the upper at "start"
  // and the lower "slant" further along; sabai() cuts the band's edges to it.
  var upper = side(start, -half), lower = side(start - slant, half);
  var vx = lower[0] - upper[0], vy = lower[1] - upper[1], vl = Math.hypot(vx, vy) || 1, g = headingAt(start - slant / 2);
  var startCap = {N: [(upper[0] + lower[0]) / 2, (upper[1] + lower[1]) / 2], c: Math.cos(g), s: Math.sin(g), kx: -vy / vl, ky: vx / vl};
  // The back of the cloth, from the top end's corner at the shoulder down.
  var corner = side(length, half), foot = hip[1] + 54, outer = [], hem = [], k;
  for (k = 0; k <= 16; k++) {                        // the outer edge: down past the waist and the hand, leaning out 32 by the foot, waving 5 either way
    var yy = corner[1] + (foot - corner[1]) * k / 16;
    outer.push([corner[0] + (32 * k / 16 + Math.sin(k / 16 * Math.PI * 2.5 + t * 0.8) * 5) * face, yy]);
  }
  var innerX = hip[0] + 24 * face, last = outer[16];
  for (k = 0; k <= 8; k++) {                         // the hem: a curve to the left, from the outer edge's foot to the inner edge, bowing down 10
    var sh = k / 8;
    hem.push([last[0] + (innerX - last[0]) * sh, foot + Math.sin(sh * Math.PI) * 10 - sh * 8]);
  }
  var tail = {outer: outer, hem: hem, inner: [innerX, corner[1] + 16]};
  return {at: at, angle: angle, uAt: uAt, length: length, start: start, fold: length, top: length, squeeze: squeeze,
          middle: pointAt(0.4 * length), tilt: headingAt(0.4 * length),
          startCap: startCap,                                                              // the slanted lower end
          endCap: {bulge: 26},                                                             // rounded, curving down over the shoulder
          tuck: joints.waist[1] + 8,                                                       // tucked into the skirt from the waist's line down
          tail: tail};                                                                     // the back of the cloth, hanging behind the shoulder
}

// The look of a person wearing the cloth: the same look with "worn", a painter
// the kit calls after the body and the head and before the arms, so the near
// arm hangs over the cloth's lower end (owner, 2026-10-15: "put it behind the
// right arm"); in a wai the kit calls it again inside the upper arm on the
// cloth's shoulder, so that upper arm is under the cloth and its forearm over
// it (owner, 2026-10-16). It draws the front of the cloth in the frame the pen
// has now, the scene's, so call it where the person is drawn, inside the camera.
//   look    the person's look; t: seconds; where: sabaiOf()'s answer for that person and frame
//   cloth   the cloth's names (SABAI_KEYS, at the top of this file), as sabai() takes them
// Returns a new look for person(); it reads pen's frame now, when it is called.
// e.g. person(720, 1010, sabaiWorn(look, t, where, {from: 3}));
function sabaiWorn(look, t, where, cloth) {
  var frame = pen.getTransform();
  return Object.assign({}, look, {worn: function () { pen.setTransform(frame); sabai(t, where, cloth, "front"); }});
}

// A point of the cloth: "along" is the distance from the hip end, "across" the
// offset from the middle line; gives [x, y, heading].
// where: sabaiOf()'s answer; along, across: pixels of the sheet (along held to 0 .. where.length).
// Returns [x, y, heading] (heading in radians). Changes nothing.
// e.g. var p = sabaiAt(where, where.length * 0.4, 0);
function sabaiAt(where, along, across) {
  var u = where.uAt(along), p = where.at(u), ang = where.angle(u);
  across *= where.squeeze(along);                      // narrower where the cloth gathers over the shoulder
  return [p[0] - Math.sin(ang) * across, p[1] + Math.cos(ang) * across, ang];
}

// A point of the cloth as sabaiAt() gives it, also beyond either end of the
// middle line: there the line runs on straight along the end's heading, so a
// row of figures goes on into a slanted cut or a rounded end, which clip it.
// where: sabaiOf()'s answer; along (any, even past the ends), across: pixels of the sheet.
// Returns [x, y, heading]. Changes nothing.
// e.g. var q = sabaiOn(where, -20, 10);
function sabaiOn(where, along, across) {
  var end = Math.max(0, Math.min(where.length, along)), q = sabaiAt(where, end, across), past = along - end;
  return [q[0] + Math.cos(q[2]) * past, q[1] + Math.sin(q[2]) * past, q[2]];
}

// sabaiEdge(where, across, from, to, joined) adds one edge of the cloth to pen's path: 25 points at
// offset across, from distance from to distance to along (pixels of the sheet). joined: true goes on
// from the open path, false starts with a moveTo. Returns nothing.
// e.g. pen.beginPath(); sabaiEdge(where, -36, 0, where.length, false); pen.stroke();
function sabaiEdge(where, across, from, to, joined) {   // one edge of the cloth, or of a row, from one end to the other
  for (var n = 0; n <= 24; n++) {                         // "joined": continue the path that is open, instead of starting one
    var q = sabaiAt(where, mix(from, to, n / 24), across);
    if (n || joined) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); }
  }
}

// sabaiBand(where, inner, outer, from, to) sets pen's path to the closed shape between offsets inner
// and outer, from distance from to distance to (pixels of the sheet). Returns nothing; fill or
// stroke it after.
// e.g. sabaiBand(where, -36, 36, 0, where.length); pen.fillStyle = "#8a2a3a"; pen.fill();
function sabaiBand(where, inner, outer, from, to) {  // the shape between two offsets, from one distance along to another: one closed path
  pen.beginPath();
  sabaiEdge(where, inner, from, to, false);
  sabaiEdge(where, outer, to, from, true);
  pen.closePath();
}

// sabaiTiles(cloth) gives back the cloth's tiles, a list of rows, each a list of sabaiTile() frame
// lists. cloth: the cloth's names (rows, row, fine). Made the first time and kept on cloth.tiles,
// so pass the same cloth object every frame.
// e.g. var tiles = sabaiTiles(CLOTH);
function sabaiTiles(cloth) {                         // the cloth's tiles, made once from its rows
  if (!cloth.tiles) {
    var near = cloth.row === undefined ? 4 : cloth.row;
    cloth.tiles = (cloth.rows || SABAI_ROWS).map(function (row, r) {
      var side = cloth.fine === undefined || Math.abs(r - near) <= cloth.fine ? SABAI_TILE : SABAI_TILE / 2;
      return row.map(function (painter) { return sabaiTile(painter, side); });
    });
  }
  return cloth.tiles;
}

// How far along the cloth's middle line figure k of a row is at second t: the row holds a whole number of its patterns,
// evenly spaced, flowing along the cloth (each row the other way from its neighbour) from second cloth.from on, the
// figure walking off one end coming on at the other. sabai() lays its figures by it, and sabaiCamera() follows one.
// sabaiAlong(where, cloth, row, k, t) gives back the distance along the middle line, pixels of the
// sheet, of figure k of a row at second t. where: sabaiOf()'s; cloth: the cloth's names; row: its
// index; k: the figure's place (any whole number). Makes the cloth's tiles if they are not made yet.
// e.g. var along = sabaiAlong(where, CLOTH, 4, 8, t);
function sabaiAlong(where, cloth, row, k, t) {
  var wide = cloth.wide || 72, tiles = sabaiTiles(cloth), rowTall = (wide - 6) / tiles.length, step = rowTall * 0.92 * 1.15;
  var flow = cloth.flow === undefined ? 2.5 : cloth.flow, dancing = Math.max(0, t - (cloth.from || 0));
  var lo = where.start || 0, round = where.length - lo + step, n = tiles[row].length;
  var count = n * Math.max(1, Math.round(round / (step * n))), gap = round / count;
  var slide = (row % 2 ? 1 : -1) * flow * dancing;
  return lo + ((k * gap + slide) % round + round) % round - gap / 2;
}

// The woven cloth at "where" (from sabaiOf), at second t, drawn as bands. Each
// end of a band is cut one of three ways: square (nothing), on a line
// ({N, c, s, kx, ky}: the line through N with the normal (kx, ky), met by a
// band heading (c, s): a fold's crease, or a cut parallel to the shirt), or
// rounded ({bulge}: the end bows out that far along the band's heading, as
// cloth does lying over a shoulder). While the cloth has no fold (where.fold
// is its whole length) it is one band, cut as where.startCap and where.endCap
// say. With a fold it is three: the chest, up to the fold at the neck; the
// shoulder, from the fold to where the shoulder ends; and the tail, behind
// the arm; the chest and shoulder bands meet on one crease line at the fold,
// as a folded ribbon does. "part" is which of it to draw: "front", all but
// the tail, over the person; "back" (or nothing), all of it, before the
// person, so the tail hangs behind the arm.
//   t      the time in seconds
//   where  sabaiOf()'s answer for the person, this frame
//   cloth  optional; its keys: SABAI_KEYS, at the top of this file (wide 72, rows SABAI_ROWS,
//          cloth "#8a2a3a", flow 2.5, from 0, row 4, fine, follow, tiles). Keep one object for the
//          film: the tiles are made into it on the first call (slow) and kept
//   part   "back" before the person, "front" over them (sabaiWorn() does that one)
// Returns nothing: it draws with pen, and leaves its line set (gold, 3 wide).
// e.g. sabai(t, where, CLOTH, "back");
function sabai(t, where, cloth, part) {
  cloth = cloth || {};
  checkNames("The sabai's name", cloth, SABAI_KEYS);
  var wide = cloth.wide || 72, half = wide / 2, tiles = sabaiTiles(cloth), rows = tiles.length;
  var flow = cloth.flow === undefined ? 2.5 : cloth.flow, dancing = Math.max(0, t - (cloth.from || 0));
  var rowTall = (wide - 6) / rows, size = rowTall * 0.92, step = size * 1.15;
  var fold = where.fold, hasFold = fold < where.length - 1;
  function corner(cap, across, sq) {                 // where a band's edge at an offset "across" meets the cap's line
    var ex = cap.N[0] - cap.s * across * sq, ey = cap.N[1] + cap.c * across * sq;   // the edge's point level with N
    var denom = cap.c * cap.kx + cap.s * cap.ky, u = Math.abs(denom) < 1e-6 ? 0 : -((ex - cap.N[0]) * cap.kx + (ey - cap.N[1]) * cap.ky) / denom;
    return [ex + cap.c * u, ey + cap.s * u];
  }
  function bow(cap, along, inner, outer, backward) { // the points of a rounded end between two offsets, as a list
    var pi = sabaiAt(where, along, inner), po = sabaiAt(where, along, outer), ang = where.angle(where.uAt(along));
    var q0 = sabaiAt(where, along, -half), q1 = sabaiAt(where, along, half), sq = where.squeeze(along);
    var cx = (q0[0] + q1[0]) / 2 + Math.cos(ang) * cap.bulge * sq, cy = (q0[1] + q1[1]) / 2 + Math.sin(ang) * cap.bulge * sq;   // the curve's control, ahead of the end
    var s0 = (inner + half) / wide, s1 = (outer + half) / wide, list = [];
    for (var k = 0; k <= 6; k++) {
      var s = s0 + (s1 - s0) * k / 6, v = 1 - s;
      list.push([v * v * q0[0] + 2 * v * s * cx + s * s * q1[0], v * v * q0[1] + 2 * v * s * cy + s * s * q1[1]]);
    }
    return backward ? list.reverse() : list;
  }
  function shape(inner, outer, from, to, endCap, startCap) {   // the shape between two offsets, with its ends cut as the caps say
    var sq0 = where.squeeze(from), sq1 = where.squeeze(to), p, list;
    pen.beginPath();
    if (startCap && startCap.N) { p = corner(startCap, inner, sq0); pen.moveTo(p[0], p[1]); sabaiEdge(where, inner, from, to, true); }
    else { sabaiEdge(where, inner, from, to, false); }
    if (endCap && endCap.N) { p = corner(endCap, inner, sq1); pen.lineTo(p[0], p[1]); p = corner(endCap, outer, sq1); pen.lineTo(p[0], p[1]); }
    else if (endCap && endCap.bulge) { list = bow(endCap, to, inner, outer, false); list.forEach(function (q) { pen.lineTo(q[0], q[1]); }); }
    sabaiEdge(where, outer, to, from, true);
    if (startCap && startCap.N) { p = corner(startCap, outer, sq0); pen.lineTo(p[0], p[1]); }
    else if (startCap && startCap.bulge) { list = bow(startCap, from, inner, outer, true); list.forEach(function (q) { pen.lineTo(q[0], q[1]); }); }
    pen.closePath();
  }
  function band(from, to, endCap, startCap) {        // one band of the cloth, from one distance along to another
    var p, list;
    pen.save();
    shape(-half, half, from, to, endCap, startCap);
    pen.fillStyle = cloth.cloth || "#8a2a3a";        // the cloth
    pen.fill();
    pen.clip();
    for (var row = 0; row < rows; row++) {
      var across = -half + 3 + (row + 0.5) * rowTall;
      shape(across - rowTall / 2, across + rowTall / 2, from, to, endCap, startCap);
      pen.fillStyle = row % 2 ? "rgba(255, 240, 200, 0.10)" : "rgba(40, 10, 20, 0.12)";   // the weave's alternate bands
      pen.fill();
      var toward = row % 2 ? 1 : -1;                 // which way this row flows: each the other way from its neighbour
      var slide = toward * flow * dancing, cycles = tiles[row];
      // The figures walk along the part of the cloth that is drawn, from the
      // cut end to the rounded top: one that walks off one end comes on at
      // the other, with no gap in the row (owner: "the sprites should walk
      // to the end of the row and wrap to the other side"; they had walked
      // the whole middle line, of which the first 59 is cut away, and were
      // gone a while before they came back).
      // The row holds a whole number of its patterns (its tiles in turn),
      // evenly spaced, so at the wrap the pattern goes on unbroken and no
      // figure is laid on another (the loop had placed one or two past a
      // round, on top of the first: two temples, two fish, two lanterns).
      // The row runs on to both ends of the cloth (owner, 2026-10-16: "they
      // don't go all the way to the end of the sash ... go all the way to the
      // end of the sash on either side"): the slanted cut reaches further back
      // on the lower rows than the ring begins, and the rounded end bows past
      // the middle line's end. So the pattern is drawn once more a round before
      // and a round after itself, past the ends along the end's heading, and
      // the band's cut and rounded end clip it. A figure inside the ends is
      // where it was.
      var lo = where.start || 0, round = where.length - lo + step, reach = half + step;
      var count = cycles.length * Math.max(1, Math.round(round / (step * cycles.length))), gap = round / count;
      for (var k = 0; k < count; k++) {
        var first = sabaiAlong(where, cloth, row, k, t);
        var bob = dancing ? hop(t, row * 0.1 + k * 0.05) * size * 0.16 : 0;
        var rock = dancing ? Math.sin(t * 2 * Math.PI / BEAT / 2 + row + k) * 0.14 : 0;
        var cycle = cycles[((k % cycles.length) + cycles.length) % cycles.length];
        var frame = dancing ? (((Math.floor(t * 7.5) + k * 2) % cycle.length) + cycle.length) % cycle.length : 0;   // six frames in 0.8 s: a walking pace (k may be negative)
        for (var copy = -1; copy <= 1; copy++) {
          var along = first + copy * round;
          if (along < from - reach || along > to + reach) { continue; }   // a figure that is not on this band
          var q = sabaiOn(where, along, across - bob);
          pen.save();
          pen.translate(q[0], q[1]);
          pen.rotate(q[2] + rock);
          var gathered = where.squeeze(Math.max(0, Math.min(where.length, along)));
          pen.scale(toward * gathered, gathered);    // the figures face the way the row flows, and are smaller where the cloth gathers
          pen.drawImage(cycle[frame], -size / 2, -size / 2, size, size);
          pen.restore();
        }
      }
    }
    pen.restore();
    pen.strokeStyle = STYLE.gold;                    // the gold hems: the two long edges, and a rounded end
    pen.lineWidth = 3;
    pen.lineJoin = "bevel";
    pen.lineCap = "butt";
    [-half + 1.5, half - 1.5].forEach(function (edge) {
      pen.beginPath();
      if (startCap && startCap.N) { p = corner(startCap, edge, where.squeeze(from)); pen.moveTo(p[0], p[1]); }
      sabaiEdge(where, edge, from, to, !!(startCap && startCap.N));
      if (endCap && endCap.N) { p = corner(endCap, edge, where.squeeze(to)); pen.lineTo(p[0], p[1]); }
      pen.stroke();
    });
    if (endCap && endCap.bulge) {
      list = bow(endCap, to, -half + 1.5, half - 1.5, false);
      pen.beginPath();
      list.forEach(function (q, i) { if (i) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); } });
      pen.stroke();
    }
  }
  function back() {                                  // the back of the cloth: the end hanging behind the shoulder and down past the hip, plain, in shadow, with a fringe
    var T = where.tail, n, p, lean;
    if (!T) { return; }
    pen.save();
    pen.beginPath();
    pen.moveTo(T.inner[0], T.inner[1]);
    T.outer.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    T.hem.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    pen.closePath();
    pen.fillStyle = cloth.cloth || "#8a2a3a";        // the cloth, unmarked
    pen.fill();
    pen.clip();
    var shade = pen.createLinearGradient(T.inner[0], 0, T.outer[8][0], 0);   // darker toward the body, as the back of a cloth is
    shade.addColorStop(0, "rgba(20, 0, 10, 0.38)");
    shade.addColorStop(1, "rgba(20, 0, 10, 0.08)");
    pen.fillStyle = shade;
    pen.fill();
    pen.strokeStyle = "rgba(20, 0, 10, 0.16)";       // three soft folds down the hanging cloth
    pen.lineWidth = 7;
    for (n = 1; n <= 3; n++) {
      pen.beginPath();
      T.outer.forEach(function (q, i) {
        var x = q[0] + (T.inner[0] - q[0]) * (n / 4) + Math.sin(i / 4 + n) * 2;
        if (i) { pen.lineTo(x, q[1]); } else { pen.moveTo(x, q[1]); }
      });
      pen.stroke();
    }
    pen.restore();
    pen.strokeStyle = STYLE.gold;                    // the gold hem down the outer edge and along the foot
    pen.lineWidth = 3;
    pen.lineCap = "butt";
    pen.beginPath();
    T.outer.forEach(function (q, i) { if (i) { pen.lineTo(q[0], q[1]); } else { pen.moveTo(q[0], q[1]); } });
    T.hem.forEach(function (q) { pen.lineTo(q[0], q[1]); });
    pen.stroke();
    pen.lineWidth = 2;                               // the tassels: a fringe hanging from the hem, fanning out a little
    lean = T.outer[0][0] < T.inner[0] ? -1 : 1;
    for (n = 0; n < T.hem.length; n++) {
      p = T.hem[n];
      pen.beginPath();
      pen.moveTo(p[0], p[1]);
      pen.lineTo(p[0] + (4 - n) * 0.7 * lean, p[1] + 16 - Math.abs(4 - n) * 1.2);
      pen.stroke();
    }
  }
  if (!hasFold) {                                    // one band and the back of the cloth, no fold
    if (part !== "front") { back(); }                // "back", or all of it: the end behind her, before the person
    if (part === "back") { return; }
    pen.save();
    if (where.tuck !== undefined) {                  // tucked into the skirt: nothing below the waist's line
      pen.beginPath();
      pen.rect(-1e5, -1e5, 2e5, 1e5 + where.tuck);
      pen.clip();
    }
    band(where.start || 0, where.length, where.endCap, where.startCap);
    pen.restore();
    return;
  }
  // The crease at the fold: through the fold point, square to the difference
  // of the headings in and out (a fold reflects the heading across the crease),
  // each taken over a run of 24.
  var N = where.at(where.uAt(fold));
  var before = where.at(where.uAt(fold - 24)), after = where.at(where.uAt(fold + 24));
  var l1 = Math.hypot(N[0] - before[0], N[1] - before[1]) || 1, l2 = Math.hypot(after[0] - N[0], after[1] - N[1]) || 1;
  var c1 = (N[0] - before[0]) / l1, s1 = (N[1] - before[1]) / l1, c2 = (after[0] - N[0]) / l2, s2 = (after[1] - N[1]) / l2;
  var kx = c2 - c1, ky = s2 - s1, kl = Math.hypot(kx, ky) || 1;
  var crease1 = {N: N, c: c1, s: s1, kx: kx / kl, ky: ky / kl}, crease2 = {N: N, c: c2, s: s2, kx: kx / kl, ky: ky / kl};
  band(0, fold - 1, crease1, where.startCap);
  band(fold + 1, where.top, null, crease2);
  if (part !== "front") { band(where.top, where.length, where.endCap, null); }
}

// The camera of the sash film's opening: it holds one row of the cloth (cloth.row)
// close up, the part across the chest, and between seconds "start" and "end"
// makes one steady pull-back, with no pause, from the row to the whole cloth to
// the person to the whole stage, turning upright as it goes. Call it inside
// pen.save() ... pen.restore(), before the scene is drawn.
//   t           the time in seconds; start, end: the seconds of the pull-back
//   where       sabaiOf()'s answer; cloth: the cloth's names (wide, rows or tiles, row, follow)
// Returns nothing. It moves pen's frame (translate, rotate, scale) and leaves it moved: the caller's
// pen.restore() undoes it.
// e.g. pen.save(); sabaiCamera(t, where, CLOTH, 6, 20); /* draw the scene */ pen.restore();
function sabaiCamera(t, where, cloth, start, end) {
  cloth = cloth || {};
  var wide = cloth.wide || 72, rows = (cloth.tiles || cloth.rows || SABAI_ROWS).length, row = cloth.row === undefined ? 4 : cloth.row;
  var rowTall = (wide - 6) / rows;
  var rowZoom = (1080 * 0.46) / rowTall;
  var u = between(t, start, end);
  var zoom = Math.exp(mix(Math.log(rowZoom), 0, u));   // the same share of the way out every second: steady to the eye
  var turn = mix(-where.tilt, 0, u);
  var rowAcross = -wide / 2 + 3 + (row + 0.5) * rowTall;
  var along = cloth.follow === undefined ? where.top * 0.4 : sabaiAlong(where, cloth, row, cloth.follow, t);   // the figure it follows, or the chest
  var point = sabaiAt(where, along, mix(rowAcross, 0, Math.min(1, u * 3)));   // from the row to the cloth's middle line (on the chest, 0.4 of the way to the shoulder, "tilt" is read)
  var slow = u * u * u;                          // the cloth stays in the middle until the view is wide
  var cx = mix(point[0], WIDE / 2, slow), cy = mix(point[1], 540, slow);
  pen.translate(WIDE / 2, 540);
  pen.rotate(turn);
  pen.scale(zoom, zoom);
  pen.translate(-cx, -cy);
}
