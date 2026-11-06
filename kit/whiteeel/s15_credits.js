// s15_credits.js - scene 15 of the film of the White Eel: the credits (120 s). The Nong Lom marsh by night, where the tale
// began and ends, the moon over its hills, fireflies over the water, and the credits rolling up over it (credits.js, as
// the first two tales'): who made the film, the voice that tells it, the tale's people each coming out to bow, where
// the tale and its places come from, and what is known of the place; last the end, held, and the thanks to the voice,
// the three pandas rising to wai, as the first two tales' thanks.
var W15_LONG = 120;
var W15_SOUND = {calls: []};
var W15_LINES = [];                                    // no words are said: music alone
var W15_ROLL = [3.0, 101.0];                           // the credits come up from below the frame, and the end stops
var W15_THANKS = [104.5, 106.0];                       // the roll's words go, and the pandas have come up
var W15_WAIS = [[107.0, 108.0, 109.0], [111.5, 111.5, 111.5], [115.0, 115.0, 115.0]];   // when each of the three bows
var W15_THANK_YOU = ["ขอบคุณหลาย ๆ เจ้า", "Thank you, Amornrat Jaijar, for the voice of this tale"];

// What rolls (credits.js, creditRow()). The Lanna titles are scene 1's (W01_SERIES, W01_STORY), by the rules of
// krueng.ai's Kam Mueang alphabet; the tale's from its converter, not yet checked by a reader of the script.
var W15_ROWS = [
  ["title", "ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ", "Lanna Tales"],
  ["title", "ᨲᩣᩴᨶᩣ᩠ᨶᨸᩖᩣᩉᩖᩱᨹᩮᩬᩥᨠ", "The White Eel"],
  ["gap"],
  ["head", "ภาพเคลื่อนไหว", "Animation"],
  ["line", "lannamation"],
  ["line", "https://github.com/ddtraveller/lannamation"],
  ["line", "Claude AI (Anthropic)"],
  ["gap"],
  ["head", "เสียงเล่าเรื่อง", "Narrator (AI voice)"],
  ["line", "อมรรัตน์ ใจจา · Amornrat Jaijar"],
  ["gap"],
  ["head", "คำเมือง", "The Kam Mueang"],
  ["line", "put into Kam Mueang by krueng.ai's Kam Mueang writer"],
  ["small", "not yet checked by a native speaker"],
  ["gap"],
  ["head", "ตัวละคร", "The cast"],
  ["pair", ["เจ้าสิงหนวติ", "Prince Singhanavati", "who came from far away"], ["พราหมณ์", "The Brahman", "the naga Phanthu, in disguise"]],
  ["pair", ["แม่อุ้ยแม่ฮ๊าง", "The old widow", "alone at the edge of the city"], ["ป้อหนุ่ม", "The young man", "from no one knows where"]],
  ["pair", ["พญามหาชัยชนะ", "King Mahachaichana", "the last of the forty-five"], ["ป้อหลวงหมู่บ้าน", "The village heads", "who were sorry, and took her in"]],
  ["pair", ["ปลาไหลเผือก", "The white eel", "seven wa long"], ["บัวคำ", "Bua-kham", "who tells the kit's tales"]],
  ["gap"],
  ["head", "นิทาน", "The tale"],
  ["line", "ตำนานสิงหนวติกุมาร, the Singhanavati chronicle"],
  ["small", "ประชุมพงศาวดาร ภาคที่ 61 (1936), translated from Lanna by Sut Srisomwong, Thai Wikisource"],
  ["small", "the chronicle wins where the tellings differ: the young man, the three roars, the widow's house left standing"],
  ["small", "the chronicle's fish is a white barb; the eel is the fish as people know the tale today"],
  ["gap"],
  ["head", "หนองหล่ม", "What is known of Nong Lom"],
  ["small", "the marsh is far older than any city: 2.5 million to 10,000 years (Fine Arts Department, 2023)"],
  ["small", "the ground here does shake: the Mae Chan Fault, a great quake about 1,500 years ago (Wiwegwin et al., GSA 2019)"],
  ["small", "the city of Yonok is known only from the old chronicles; how it sank is a legend"],
  ["small", "Piyawit Moonkham, the naga of the Kok and the Chiang Saen basin (TRaNS, Cambridge, 2021)"],
  ["gap"],
  ["head", "ดนตรี", "Music"],
  ["line", "music made from numbers by the kit"],
  ["gap"],
  ["head", "สมุดค้นคว้า", "The research notebook, open to read (Google asks for a sign-in)"],
  ["small", "Lanna fairy tales and myths · notebooklm.google.com/notebook/fd7ed330-3806-456e-b9be-5ef912977abe"],
  ["gap"],
  ["head", "ตัวอักษร", "Letters"],
  ["line", "Noto Sans Tai Tham and Noto Serif Thai (SIL Open Font License)"],
  ["small", "Lanna spellings by the rules of krueng.ai's Kam Mueang alphabet; not yet checked by a native speaker"],
  ["gap"],
  ["end", "ᩁᩰᩫ᩠ᨦᨿᩉ᩠ᨶᩢᨦᨩᩦᩅᩥ᩠ᨲᨧ᩶ᩣ᩻", "Slow Life Studios", "แล้วปะกั๋นใหม่เจ้า · See you again",
   "animated with lannamation: https://github.com/ddtraveller/lannamation"]
];

// kind: a name of the kit's cast; own: the film's look. Gives back a painter for W15_FIGURES (the person in a wai at
// 0, 0). e.g. "The old widow": w15Who("grandmother", WEL_WIDOW)
function w15Who(kind, own) {
  return function () {
    person(0, 0, welPerson(kind, own || {}, {wai: true, feel: "happy", face: 1, id: "bow-" + kind, holding: null}));
  };
}
// The figures that bow beside the "pair" rows (credits.js creditBow()), by their English names.
var W15_FIGURES = {
  "Prince Singhanavati": w15Who("noble", WEL_PRINCE), "The Brahman": w15Who("elder", WEL_BRAHMAN),
  "The old widow": w15Who("grandmother", WEL_WIDOW), "The young man": w15Who("inta", WEL_YOUNG),
  "King Mahachaichana": w15Who("noble", Object.assign({size: 0.8}, WEL_OLD_KING)),
  "The village heads": creditMany([-90, 0, 90].map(function (dx, n) { return [dx, w15Who(WEL_HEADS[n][0], WEL_HEADS[n][1])]; })),
  "The white eel": function (b, u) { whiteEel(-120, 0, u * 2, {caught: true, size: 0.26, face: -1}); },
  "Bua-kham": function () { person(0, 0, cast("buakham", {wai: true, feel: "happy", face: 1, id: "bow-buakham"})); }
};

// The marsh by night under the credits: the sky, the moon, the hills and the water darkened, fireflies, a veil so the
// words read. t: seconds.
function w15Night(t) {
  pen.drawImage(welSky("night"), 0, 0);
  sceneryMoon(t, 1480, 170, 50, {});
  welFar(pen, WEL_WATER);
  var water = welMarshWater();
  sceneryWaterDepths(water);
  sceneryWaterSurface(t, water);
  welNightOver(WEL_WATER - 440, WEL_WATER - 220, 0.62);
  sceneryMoon(t, 1480, 170, 50, {});
  natGlitter(t, 1480, WEL_WATER, 1080, 0.5, "220, 230, 255");
  sceneryFireflies(t, {far: [[[0, WEL_WATER, WIDE, 1000], 80, 3]], near: 10});
  pen.fillStyle = "rgba(4, 6, 20, 0.45)";              // a veil, so the words read
  pen.fillRect(0, 0, WIDE, 1080);
}

// Scene 15, the entry the film calls (SCENES): t, its own second, 0 to W15_LONG: the marsh by night; the roll of
// W15_ROWS from W15_ROLL[0] until the end is held at W15_ROLL[1], each "pair" row's figures bowing as it passes; the
// words go at W15_THANKS[0] for the pandas' thanks; into black at the end. From sets.js: the marsh and the night, the
// film's looks; from credits.js creditRoll(), creditThanks(), creditMany(); from chiangsaen.js whiteEel().
function welSceneCredits(t) {
  w15Night(t);
  creditRoll(t, W15_ROWS, W15_ROLL, W15_THANKS[0], W15_FIGURES);
  creditThanks(t, W15_THANKS, W15_WAIS, W15_THANK_YOU);
  if (t > W15_LONG - 2.4) {
    pen.fillStyle = "rgba(0, 0, 0, " + clamp((t - (W15_LONG - 2.4)) / 2).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
  welFadeIn(t, 1.5);
}
