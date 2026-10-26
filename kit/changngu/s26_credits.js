// s26_credits.js - scene 26 of the film of Chang Ngu: the credits (150 s). The Mae Khong at Chiang Saen by night, where
// the tale began, the moon over Laos's hills, fireflies along the near bank, a barn owl over the water, and the credits
// rolling up over it (credits.js, as the first tale's): who made the film, the voice that tells it, the tale's people
// each with a figure coming out to bow (the novice is named and has none: a monk does not wai the audience), where the
// tale, its places and its things come from, the things drawn for it, each with what it was drawn from; last the end,
// held, and the thanks to the voice, the three pandas rising to wai, as the first tale's thanks.
var C26_LONG = 150;
var C26_SOUND = {calls: []};
var C26_LINES = [];                                    // no words are said: music alone
var C26_ROLL = [3.0, 131.0];                           // the credits come up from below the frame, and the end stops
var C26_THANKS = [134.5, 136.0];                       // the roll's words go, and the pandas have come up
var C26_WAIS = [[137.0, 138.0, 139.0], [141.5, 141.5, 141.5], [145.0, 145.0, 145.0]];   // when each of the three bows
var C26_THANK_YOU = ["ขอบคุณหลาย ๆ เจ้า", "Thank you, Amornrat Jaijar, for the voice of this tale"];
var C26_MOON = [1500, 170, 54];                        // the moon over Laos: its middle and its radius
var C26_OWL = [40, 54, [[-160, 360, 0.7], [2100, 120, 0.7]]];   // the barn owl across the river and the moon: from, to, path
var C26_BATS = [[70, [1700, 60], [1100, 520]], [112, [1760, 120], [900, 520]]];   // [start, from, to]: down behind the far hills

// What rolls (credits.js, creditRow()): ["title", Lanna script, English], ["head", Thai, English], ["line", text],
// ["small", text], ["pair", [Thai, English, drawn from], [the same, or null]], ["gap"], and last ["end", ...].
// The Lanna titles are by the rules of krueng.ai's Kam Mueang alphabet (alphabet.js lanna(), which gives the first
// tale's two titles back as they were written).
var C26_ROWS = [
  ["title", "ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ", "Lanna Tales"],
  ["title", "ᨲᩣᩴᨶᩣ᩠ᨶᨩ᩶ᩣ᩠ᨦᨦᩪ", "Chang Ngu, the Snake Elephant"],
  ["gap"],
  ["head", "ภาพเคลื่อนไหว", "Animation"],
  ["line", "lannamation"],
  ["line", "https://github.com/ddtraveller/lannamation"],
  ["line", "Claude AI (Anthropic)"],
  ["gap"],
  ["head", "เสียงเล่าเรื่อง", "Narrator (AI voice)"],
  ["line", "อมรรัตน์ ใจจา · Amornrat Jaijar"],
  ["gap"],
  ["head", "ค้นคว้าภาษา", "Language research"],
  ["line", "อมรรัตน์ ใจจา · Amornrat Jaijar"],
  ["gap"],
  ["head", "คำเมือง", "The Kam Mueang"],
  ["line", "put into Kam Mueang by krueng.ai's Kam Mueang writer"],
  ["small", "not yet checked by a native speaker"],
  ["gap"],
  ["head", "ตัวละคร", "The cast"],
  ["pair", ["พรหมกุมาร", "Phrom Kuman", "fair, \"like a Brahma\"; Phrom Maharat"], ["ทุกขิตกุมาร", "Thukkhita", "his elder brother, the uparaja"]],
  ["pair", ["พระองค์พัง", "King Phang", "of Yonok; the headman of Si Tuang"], ["พระนางเทวี", "Queen Thewi", "their mother, who dreamed"]],
  ["pair", ["พญาขอมดำ", "The Black Khom king", "who took Yonok, and ran"], ["หมอ", "The seer", "who read the dream and the gold"]],
  ["pair", ["สามเณร", "The novice of Si Tuang", "who vowed to be born again"], ["ช่างตีเหล็ก", "The smiths", "who made his weapons"]],
  ["pair", ["เด็กน้อยห้าสิบคน", "The fifty children", "who jumped in after him"], ["ช้างพานคำ", "Chang Phan Kham", "the white elephant"]],
  ["pair", ["ช้างงู", "Chang Ngu", "the snake elephant"], ["นางแก้วสุภา", "Nang Kaeo Supha", "of Wiang Chai Narai"]],
  ["pair", ["เทวดา", "The deva", "of the dream and of the wall"], ["บัวคำ", "Bua-kham", "who tells the kit's tales"]],
  ["gap"],
  ["head", "นิทาน", "The tale"],
  ["line", "ตำนานสิงหนวติกุมาร, the chronicle of Yonok"],
  ["small", "the 1936 text (ประชุมพงศาวดาร ภาคที่ 61), Thai Wikisource; Manit Vallibhotama's edition (1973), Wikimedia Commons,"],
  ["small", "read by Typhoon OCR; the chronicle wins where the tellings differ: the children, the brother, Indra's wall"],
  ["small", "and the Lanna Folktales series (Thai Media Fund): the tale is told anew, nothing of its pictures is used"],
  ["small", "the Ministry of Culture on the statue · Chiang Saen school, ตามรอยตำนานช้างงูเชียงแสน"],
  ["small", "Piyawit Moonkham, the mythscape of the naga in the Chiang Saen basin (Cambridge)"],
  ["gap"],
  ["head", "เมืองและข้าวของ", "The city, the river and their things"],
  ["small", "Hans Penth, \"Again: the fortifications of Chiang San\", Journal of the Siam Society 63.2 (1975),"],
  ["small", "after Holt Hallett (1884) and Carl Curt Hosseus (1904): the double wall, the moat, the teak palisade"],
  ["small", "the birds of the river: thaibirding.com, Chiang Saen · BirdLife International · khrai nam: PROSEA"],
  ["small", "the limestone of Doi Chiang Dao: GEOLEX · the Fine Arts Department's museum of Chiang Saen"],
  ["gap"],
  ["head", "ดนตรี", "Music"],
  ["line", "music made from numbers by the kit"],
  ["small", "and the golden plate's ring, made from numbers too: no free recording of a kangsadan rang true"],
  ["gap"],
  ["head", "สมุดค้นคว้า", "The research notebook, open to read (Google asks for a sign-in)"],
  ["small", "Lanna fairy tales and myths · notebooklm.google.com/notebook/fd7ed330-3806-456e-b9be-5ef912977abe"],
  ["gap"],
  ["head", "ตัวอักษร", "Letters"],
  ["line", "Noto Sans Tai Tham and Noto Serif Thai (SIL Open Font License)"],
  ["small", "Lanna spellings by the rules of krueng.ai's Kam Mueang alphabet; not yet checked by a native speaker"],
  ["gap"],
  ["head", "วาดขึ้นสำหรับนิทานเรื่องนี้", "Drawn for this tale (chiangsaen.js)"],
  ["pair", ["กำแพงเวียง", "City wall", "Chiang Saen's, after Penth"], ["ดอยช้างงู", "Doi Chang Ngu", "a tower of limestone in the paddies"]],
  ["pair", ["ดอนทราย ไคร้น้ำ", "Sandbar, khrai nam", "the Mekong's dry season; PROSEA"], ["นกแอ่นทุ่งเล็ก", "Small pratincole", "thaibirding.com, Chiang Saen"]],
  ["pair", ["นกกระแตหาด", "River lapwing", "thaibirding.com, Chiang Saen"], ["นกหัวโตเล็กขาเหลือง", "Little ringed plover", "thaibirding.com, Chiang Saen"]],
  ["pair", ["นกกระติ๊ดแดง", "Red avadavat", "in the river's margins"], ["เป็ดเทา", "Spot-billed duck", "\"often easily seen on the river\""]],
  ["pair", ["เตาตีเหล็ก", "Forge", "the upright bamboo bellows of the region"], ["ดาบ ปืนไฟ", "Dap, fire-gun", "the chronicle's weapons"]],
  ["pair", ["ขอไม้ไล่", "Bamboo hook", "the chronicle's footnote 70"], ["คาน", "Carrying pole", "open baskets on a shoulder pole"]],
  ["pair", ["ถาดร่อนคำ", "Gold pan", "footnote 63: panning for gold"], ["สลุง หม้อคำ", "Salung, gold pot", "Lanna metalwork"]],
  ["pair", ["อู่", "Hanging cradle", "a cloth sling from a beam"], ["พานคำ", "The golden plate", "a kangsadan, round and flat"]],
  ["pair", ["กำแพงหิน", "Indra's wall", "cut stone, in a deva's light"], ["รูปปั้นช้างงู", "The statue", "its pool and fountain, Chiang Saen"]],
  ["gap"],
  ["end", "ᩁᩰᩫ᩠ᨦᨿᩉ᩠ᨶᩢᨦᨩᩦᩅᩥ᩠ᨲᨧ᩶ᩣ᩻", "Slow Life Studios", "แล้วปะกั๋นใหม่เจ้า · See you again",
   "animated with lannamation: https://github.com/ddtraveller/lannamation"]
];

// kind: a name of the kit's cast; own: the film's look; size: the cast's size, or left out. Gives back a painter for
// C26_FIGURES (the person in a wai at 0, 0). e.g. "Phrom Kuman": c26Who("boy", CNG_PHROM, cngAgeSize(16))
function c26Who(kind, own, size) {
  return function () {
    person(0, 0, cngPerson(kind, own || {}, {wai: true, feel: "happy", face: 1, id: "bow-" + kind, size: size || own.size}));
  };
}
// The figures that bow beside the "pair" rows (credits.js creditBow()), by their English names.
var C26_FIGURES = {
  // the cast
  "Phrom Kuman": c26Who("boy", CNG_PHROM, cngAgeSize(16)), "Thukkhita": c26Who("boy", CNG_THUKKHITA, cngAgeSize(16)),
  "King Phang": c26Who("noble", CNG_KING), "Queen Thewi": c26Who("maiden", CNG_QUEEN),
  "The Black Khom king": c26Who("khomsoldier", CNG_KHOM_KING), "The seer": c26Who("elder", CNG_SEER),
  "The smiths": c26Who("villager", CNG_SMITH),
  "The fifty children": creditMany([-90, 0, 90].map(function (dx, n) {
    return [dx, c26Who(CNG_CHILDREN[n].kind, CNG_CHILDREN[n].look, cngAgeSize(13))];
  })),
  "Chang Phan Kham": function (b, u) { elephant(0, 0, {size: 0.35, step: u, colour: "#f1ddd3", cloth: "#c9962a"}); },
  "Chang Ngu": function () { changNgu(0, -20, {size: 0.15}); },   // small enough that its trunks stay on sabaiTile's scratch sheet (they were cut)
  "Nang Kaeo Supha": c26Who("lady", CNG_KAEO_SUPHA, 0.78),
  "The deva": function (b, u) { thewada(0, -160, u * 2, {size: 0.6, face: 1}); },
  "Bua-kham": function () { person(0, 0, cast("buakham", {wai: true, feel: "happy", face: 1, id: "bow-buakham"})); },
  // the things drawn for this tale
  "City wall": function (b) { cityWall(b, -160, 0, 320, 0.6, {open: 0}); },
  "Doi Chang Ngu": function (b) { karstHill(b, 0, 0, 0.8, {}); },
  "Sandbar, khrai nam": function (b, u) { sandbar(b, -160, -30, 320, 40, 3); khraiNam(b, -60, -20, 0.8, u * 2, 1); khraiNam(b, 50, -16, 0.7, u * 2, 2); },
  "Small pratincole": function (b, u) { pratincole(b, 0, 0, 1.6, {t: u * 2}); },
  "River lapwing": function (b, u) { riverLapwing(b, 0, 0, 1.6, {t: u * 2}); },
  "Little ringed plover": function (b, u) { ringedPlover(b, 0, 0, 1.6, {t: u * 2}); },
  "Red avadavat": function (b, u) { redAvadavat(b, 0, 0, 1.6, {t: u * 2}); },
  "Spot-billed duck": function (b, u) { spotbill(b, 0, 0, 1.6, {t: u * 2}); },
  "Forge": function (b, u) { forge(b, 0, 0, 0.8, u * 2); },
  "Dap, fire-gun": creditMany([[-60, function (b) { dap(b, 0, -60, 1, {}); }], [60, function (b) { fireGun(b, 0, -60, 1, {}); }]]),
  "Bamboo hook": function (b) { elephantHook(b, 0, 0, 1, {}); },
  "Carrying pole": function (b) { carryPole(b, 0, -80, 1, {}); },
  "Gold pan": function (b) { goldPan(b, 0, -20, 1, {}); },
  "Salung, gold pot": creditMany([[-60, function (b) { salung(b, 0, 0, 1, {}); }], [60, function (b) { goldPot(b, 0, 0, 1); }]]),
  "Hanging cradle": function (b, u) { hangingCradle(b, 0, -200, 1, u * 2, {baby: true}); },
  "The golden plate": function (b, u) { cngPlate(0, -60, 1, u * 2); },
  "Indra's wall": function (b) { risingWall(b, -150, 0, 300, 160, 1); },
  "The statue": function (b, u) { statuePool(b, 0, 0, 0.5, u * 2); changNgu(0, -30, {size: 0.2}); }
};

// The far hills, the river and the near bank by night: the river panel's two layers darkened where they are painted
// and nowhere else, so the sky above the hills stays the night sky the moon is in (owner, 2026-10-25: a band was
// darkened from above the hills down, its top edge a line across the sky). Made once. e.g. pen.drawImage(c26Land(cngRiver()), 0, 0);
var C26_LAND = null;
function c26Land(river) {
  if (C26_LAND) { return C26_LAND; }
  C26_LAND = document.createElement("canvas");
  C26_LAND.width = WIDE;
  C26_LAND.height = 1080;
  var b = C26_LAND.getContext("2d");
  b.drawImage(river.back, 0, 0);
  b.drawImage(river.near, 0, 0);
  b.globalCompositeOperation = "source-atop";           // the river by night, only over the land and the water
  b.fillStyle = "rgba(10, 14, 40, 0.62)";
  b.fillRect(0, 0, WIDE, 1080);
  return C26_LAND;
}

// The night over the river while the credits roll: the sky, the moon and its clouds, the owl across them, the far
// hills and the water, the bats going down behind the hills, the near bank and its fireflies; all of it under a
// veil, so the words read. t: seconds. Gives back nothing: it draws with pen.
function c26Night(t) {
  var river = cngRiver();
  pen.drawImage(cngSky("clear"), 0, 0);                // fine stars, no Milky Way (the scenery pass, 2026-10-26)
  sceneryStars(t, {band: null, horizon: CNG_WATER, count: 1600, bright: 24, glow: null});
  var moon = nightMoon(C26_MOON[0], C26_MOON[1], C26_MOON[2]);
  cngClouds(t, "night");                                // soft clouds in the moon's light
  if (t > C26_OWL[0] && t < C26_OWL[1]) {
    var u = (t - C26_OWL[0]) / (C26_OWL[1] - C26_OWL[0]), a = C26_OWL[2][0], b = C26_OWL[2][1];
    var ox = mix(a[0], b[0], u), oy = mix(a[1], b[1], u) - 60 * Math.sin(Math.PI * u);
    barnOwl(ox, oy, t, {fly: "side", size: a[2], face: 1, lit: moonLight(ox, oy, moon), moon: moon});
  }
  C26_BATS.forEach(function (one) {
    batStream(t, {start: one[0], from: one[1], to: one[2], count: 40, every: 0.15, long: 8, size: 2.2, far: 0.5, spread: 50, colour: "#5c536c"});
  });
  pen.drawImage(c26Land(river), 0, 0);
  pen.fillStyle = "rgba(220, 226, 250, 0.10)";         // the moon's road across the water
  for (var k = 0; k < 14; k++) {
    var wy = CNG_WATER + 14 + k * 17, ww = 30 + 14 * k + 10 * Math.sin(t * 1.3 + k);
    pen.fillRect(C26_MOON[0] - ww / 2 + 8 * Math.sin(t + k * 2), wy, ww, 3);
  }
  farFireflies(t, {box: [0, CNG_BANK - 40, WIDE, CNG_BANK + 200], count: 60});
  pen.fillStyle = "rgba(4, 6, 20, 0.45)";              // a veil, so the words read over the river
  pen.fillRect(0, 0, WIDE, 1080);
}

// Scene 26, the entry the film calls (SCENES): t, its own second, 0 to C26_LONG (150 s): the night over the river; the
// roll of C26_ROWS from C26_ROLL[0] (3 s) until the end is held at C26_ROLL[1] (131 s), each "pair" row's figures
// bowing as it passes; the words go at C26_THANKS[0] for the pandas' thanks; into black from 147.6 s. Gives back
// nothing: it draws the whole sheet with pen. From sets.js: cngRiver(), cngSky("night"), cngPerson() and the cast's
// looks, cngPlate(); from credits.js creditRoll(), creditThanks(), creditMany(); from night.js nightMoon(),
// moonLight(), barnOwl(), batStream(), farFireflies(). No words are said: C26_LINES is empty. Its z plan: no one stands
// on its ground, so it is painted in fixed layers from the back (c26Night), then the words and their figures, then
// the thanks, then the black.
function cngSceneCredits(t) {
  c26Night(t);
  creditRoll(t, C26_ROWS, C26_ROLL, C26_THANKS[0], C26_FIGURES);
  creditThanks(t, C26_THANKS, C26_WAIS, C26_THANK_YOU);
  if (t > C26_LONG - 2.4) {
    pen.fillStyle = "rgba(0, 0, 0, " + clamp((t - (C26_LONG - 2.4)) / 2).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
  cngFadeIn(t, 1.5);
}
