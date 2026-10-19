// s15_credits.js - scene 15 of the film of the creature with four ears and five eyes: the credits.
// Doi Khao Khwai at night under its stars, and the credits rolling up over it: who made the film, the voice that
// tells it, where the tale and its sounds come from, then everything the cartoon maker can put in a film, each
// with where it was drawn from as far as the kit records it (docs/STYLE.md and the kit's files); last, the
// studio's name, held. Owner, 2026-10-19: "List animation credits as lannamation and the github repo and for AI
// voice: list Panda" (a stub: the speaker's own name goes in when she sends it), "You can also list Claude AI".
var S15_LONG = 195;
var S15_LINES = [];                                  // no words are said: music alone (feelings.py, SCENE_FEEL)
var S15_ROLL = [3.0, 174.0];                          // the credits come up from below the frame, and the last stops
// Last, the thanks (owner, 2026-10-19: "At the end of the credits feature a wai-ing panda bear in python_piggy style
// but with Lanna princess clothes as a personal thanks to Pan for her work"; of three candidates, "I like all 3",
// then "Can you do 3?"): the words go at S15_THANKS[0], and three pandas come up, in Teacher Piggy's manner (a
// chibi, a big head over the body, cut at the waist), each dressed as a Lanna princess her own way; they wai one
// after another, then all together.
var S15_THANKS = [177.5, 179.0];                      // the roll's words go, and the pandas have come up
var S15_WAIS = [[180.0, 181.0, 182.0], [184.5, 184.5, 184.5], [188.0, 188.0, 188.0]];   // when each of the three bows
var S15_PANDAS = [
  {bun: true, blouse: "#f7efe6", blouseDot: "#eadccb", sabai: "#d65a8a",
   flowers: [[78, 24, 8, "#f2cf5a"], [122, 24, 8, "#f2cf5a"], [100, 8, 6, "#fffaf0"]]},
  {bun: true, garland: true, blouse: "#e8f0e2", blouseDot: "#d0dfc4", sabai: "#7a4a9a", flowers: [[124, 22, 9, "#f6a6c0"]]},
  {bun: false, blouse: "#fbe9d4", blouseDot: "#f0d4b4", sabai: "#a8243a", flowers: [[150, 56, 13, "#f2cf5a"], [136, 48, 8, "#fffaf0"]]}
];
var S15_THANK_YOU = ["ขอบคุณหลาย ๆ เจ้า", "Thank you, Panda, for the voice of this tale"];   // her own name, when she sends it

// What rolls, in order: ["title", Lanna script, English], ["head", Thai, English], ["line", text], ["small", text],
// ["pair", [Thai, English, drawn from], [the same, or null]], ["gap"], and last ["end", Lanna script, English,
// Kam Mueang goodbye].
var S15_CREDITS = [
  ["title", "ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ", "Lanna Tales"],
  ["title", "ᨾᩯ᩠ᨦᩈᩦ᩵ᩉᩪᩉ᩶ᩣᨲᩣ", "The Creature with Four Ears and Five Eyes"],
  ["gap"],
  ["head", "ภาพเคลื่อนไหว", "Animation"],
  ["line", "lannamation"],
  ["line", "https://github.com/ddtraveller/lannamation"],
  ["line", "Claude AI (Anthropic)"],
  ["gap"],
  ["head", "เสียงเล่าเรื่อง", "Narrator (AI voice)"],
  ["line", "Panda"],
  ["gap"]
];
// Where the tale, its research, its sounds and its letters come from, as the kit records them.
var S15_SOURCES = [
  ["head", "นิทาน", "The tale"],
  ["line", "แมงสี่หูห้าตา, a folk tale of the north"],
  ["small", "the palm-leaf Tham Si Hu Ha Ta of Wat Chae Chang; the shrine of Wat Phra That Doi Khao Khwai Kaeo"],
  ["small", "and the Lanna Folktales series (Thai Media Fund): the tale is told anew, nothing of its pictures is used"],
  ["gap"],
  ["head", "ดนตรีและเสียง", "Music and sounds"],
  ["line", "music made from numbers by the kit, after the hero film's sueng, drum and ching"],
  ["line", "the creature's voice: made by the kit from outlines, nothing recorded"],
  ["line", "the tokay gecko: Richard Ling, public domain (Wikimedia Commons)"],
  ["gap"],
  ["head", "ข้าวของเครื่องใช้", "The things of a Lanna home"],
  ["small", "researched in 22 sources: the Lanna Traditional House Museum (Chiang Mai University),"],
  ["small", "a Ministry of Education book of basketry, studies of the Tai Yuan house"],
  ["gap"],
  ["head", "ค้นคว้า", "Research: 162 sources in six NotebookLM notebooks"],
  ["small", "Thai journals on ThaiJo · Chiang Mai University: Lanna Info, ACCL, Art and Culture · Chulalongkorn University"],
  ["small", "Mahidol University · Silpakorn University · Mae Fah Luang University · RMUTP · NIU SEAsite · UPSI, Malaysia"],
  ["small", "studies of Thai faces: Brunelli et al. 2017, Freas 2011, King 1997, Techataweewan et al. 2021, Rejuso-Kalbit et al."],
  ["small", "the Fine Arts Department · the Siam Society · QAGOMA · Ministry of Education · Tourism Authority of Thailand"],
  ["small", "Thailand Foundation · SEAArts · Chang Puak Magazine · Silpa Wattanatham · Matichon · Chiang Mai News"],
  ["small", "Thai PBS World · Chiang Mai City Life · Amarin TV · CPA Media · Living ASEAN · The Textile Atlas · Arts of the Kingdom"],
  ["small", "การ์ตูนแอนิเมชันตำนานและนิทานพื้นบ้านล้านนา, the Lanna Folktales series (Thai Media Fund) · ai.tstory · หลอนดูดิ"],
  ["small", "Polyglot Petra · Tamarind Village · Chiang Mai Update · Ada House · Thai Language Hut · cmocity · Lions in the Piazza"],
  ["small", "Oriental Architecture · Thai Style Studio 1984 · Kalm Village · thainarak · Karaweik Palace · Expique · Swiss Lanna Lodge"],
  ["small", "Fan Club Thailand · Chiang Mai à la carte · Hotsia · Buddha Images · Photo Dharma · Katta Shekar · Classical Theravada"],
  ["small", "chiangmai1 · Buddhist University · Araya Time · GotoKnow · Lemon8 · Yi Peng Chiang Mai · soodprod and a Lanna page on Facebook"],
  ["small", "and Wikipedia, English and Thai"],
  ["gap"],
  ["head", "ภาพถ่ายที่ใช้ศึกษา", "Photographs studied (Wikimedia Commons)"],
  ["small", "Chainwit., Big HDV, Dennis G. Jarvis, Hałun, Iudexvivorum, Photo Dharma,"],
  ["small", "Jiranee119, Leopoldoghost, Patiparn.Nice2002bkk, มะเดื่อ แสลงหลวง: drawn from, never copied"],
  ["gap"],
  ["head", "ตัวอักษร", "Letters"],
  ["line", "Noto Sans Tai Tham and Noto Serif Thai (SIL Open Font License)"],
  ["small", "Lanna spellings by the rules of krueng.ai's Kam Mueang alphabet; not yet checked by a native speaker"],
  ["gap"]
];

// The cartoon maker's people, creatures, things and places, two to a row: [Thai, English, drawn from].
var S15_MAKER = [
  ["head", "ผู้คน", "People"],
  ["pair", ["เด็กชาย", "Boy", "the kit's own"], ["เด็กหญิง", "Girl", "the kit's own"]],
  ["pair", ["สาว", "Lady", "1930s cartoons, in the manner of Thai paintings"], ["หนุ่ม", "Young man", "a Chiang Mai costume revival"]],
  ["pair", ["ชาวบ้าน", "Villager", "Thai paintings; the head-cloth after Manop Manasaem"], ["หนุ่มเจียงใหม่", "Chiang Mai lad", "Holt Hallett (1890), Lillian Curtis (1903)"]],
  ["pair", ["เจ้าชาย", "Prince", "a picture of northern regalia and brocade"], ["แม่หญิง", "Maiden", "village paintings; a gold ear plug"]],
  ["pair", ["แม่อุ๊ย", "Grandmother weaver", "village paintings; a palm-leaf ear plug"], ["พ่ออุ๊ย", "Grandfather", "a Chiang Mai costume revival"]],
  ["pair", ["ยาย", "Grandmother", "the kit's own"], ["ลุงชาวนา", "Old farmer", "a Chiang Mai costume revival"]],
  ["pair", ["ยายไปวัด", "Grandmother to the temple", "a gold ear plug, after Manop Manasaem"], ["ช่างฟ้อน", "Dancer", "a fon lep painting; a dancer's video"]],
  ["pair", ["เทวดา", "Celestial", "Thai paintings and thangkas"], ["มือกลอง", "Drummer", "a Chiang Mai costume revival"]],
  ["pair", ["นักวิทย์", "Scientist", "the kit's first cartoon"], ["อินตา คำมูล บัวคำ", "Inta, Khammun, Bua-kham", "a photograph of c. 1909 (Wikimedia Commons)"]],
  ["pair", ["ศรีนวล บุญมา ดอกคำ", "Sinuan, Bunma, Dokkham", "the same photograph of c. 1909"], null],
  ["gap"],
  ["head", "สัตว์และสิ่งของ", "Creatures and things"],
  ["pair", ["หมา", "Dog", "the kit's own"], ["ไก่", "Rooster", "the kit's own"]],
  ["pair", ["พญานาค", "Naga", "a five-headed naga drawn in gold, Chiang Mai"], ["มังกร", "Dragon", "a painting in the Tibetan manner"]],
  ["pair", ["มอม", "Mom", "the stair of Wat Phra That Doi Suthep"], ["พญาลวง", "Phaya Luang", "a gilded carving, Wat Phra Kaeo, Chiang Rai"]],
  ["pair", ["ตะวัน", "Sun", "the flame-ringed disc of a thangka"], ["ฝูงนก", "Birds", "the kit's own"]],
  ["pair", ["โคมลอย", "Sky lantern", "the kit's own"], ["โคมล้านนา", "Lanna lantern", "a drawing of three lanterns in gold"]],
  ["pair", ["เจดีย์ทราย", "Sand stupa", "sand stupas at Wat Pho (Wikimedia Commons)"], ["ผางประทีป", "Oil lamps", "Wat Phan Tao at Yi Peng (Commons)"]],
  ["pair", ["กระทง", "Krathong", "a photograph of a krathong (Commons)"], ["เกวียน", "Ox cart", "teak carts at Wat Phra Sing, Chiang Rai"]],
  ["pair", ["สะล้อ", "Salo", "a Chiang Mai maker's salo; Purinee Donchai"], ["ซึง", "Sueng", "a Chiang Mai artisan's sueng"]],
  ["pair", ["ปี่จุม", "Pi chum", "the pipe of a Lanna band"], ["พิณเปี๊ยะ", "Phin phia", "a 19th-century phin, the Metropolitan Museum"]],
  ["pair", ["โคมผัด", "Turning lantern", "a notebook of Lanna crafts"], ["โคมดาว โคมบัว", "Star and lotus lanterns", "a list of lantern shapes"]],
  ["pair", ["โคมถือ", "Hand lantern", "a notebook of Lanna crafts"], ["ตุงไส้หมู", "Tung sai mu", "Chang Puak Magazine, \"Lanna Tung\""]],
  ["pair", ["ตุงใย", "Tung yai", "Tamarind Village, on Lanna tung"], ["รถแดง", "Red truck", "photographs of Chiang Mai's songthaew"]],
  ["pair", ["ช้าง", "Elephant", "the Asian elephant"], ["เสือ", "Tiger", "a Thai drawing of two tigers in gold"]],
  ["pair", ["แมว", "Cat", "a Thai picture of three Siamese cats"], ["หมู", "Pig", "the kit's own"]],
  ["pair", ["ม้าต่าง", "Pack horse", "the pack horses of the Haw caravans"], ["หนูบ้าน หนูนา", "House and field mice", "drawn from life; the paddy mouse"]],
  ["pair", ["ตุ๊กแก", "Tokay gecko", "the tokay of a house wall"], ["นกยูง", "Green peafowl", "the peafowl of Phayao"]],
  ["pair", ["ไก่ฟ้าหางลายขวาง", "Mrs Hume's pheasant", "Doi Chiang Dao; BirdLife"], ["นกกินปลี", "Sunbird", "the sunbird of Doi Inthanon"]],
  ["pair", ["นกขุนแผน", "Blue magpie", "Thai National Parks"], ["นกเงือก", "Hornbill", "Thai PBS World; Chiang Mai City Life"]],
  ["pair", ["แมงสี่หูห้าตา", "Maeng Si Hu Ha Ta", "the shrine's statue, Doi Khao Khwai (Commons)"], ["กองไฟ หวดนึ่งข้าว", "Fire, rice steamer", "the tale; a Lanna kitchen"]],
  ["gap"],
  ["head", "บ้านเรือนและสถานที่", "Houses and places"],
  ["pair", ["บ้าน", "House", "the crossed gable ends of a northern house"], ["ต้นไม้ มะพร้าว กล้วย", "Trees, palm, banana", "a lotus-pond painting and a thangka"]],
  ["pair", ["วัด", "Temple", "Thai paintings: gold trim, a chedi"], ["ยักษ์", "Giant", "a yak at Wat Phra Kaeo"]],
  ["pair", ["น้ำต้น", "Water jar", "the custom of the north"], ["ตุง", "Tung", "the gilded hang hong of Wat Chet Yot"]],
  ["pair", ["กลองหลวง", "Great drum", "the drum cart of Wat Hiranyawat (Commons)"], ["หลองข้าว", "Granary", "the Lanna Traditional House Museum"]],
  ["pair", ["เสวียน", "Sawian", "the Lanna Traditional House Museum"], ["ตูบ", "Hut", "as the tales have it"]],
  ["pair", ["หอคำ", "Ho Kham", "the peacock gable of Wat Phan Tao"], ["ก่องข้าว กระบุง", "Rice basket, basket", "the House Museum; basketry"]],
  ["pair", ["ครกไม้", "Mortar", "the House Museum; Tai Yuan houses"], ["ตาแหลว", "Ta laew", "the House Museum; Tai Yuan houses"]],
  ["pair", ["คอก ฆ้อง ฟืน ถ้ำ", "Pen, gong, firewood, cave", "made for this tale"], null],
  ["gap"]
];
var S15_END = ["end", "ᩁᩰᩫ᩠ᨦᨿᩉ᩠ᨶᩢᨦᨩᩦᩅᩥ᩠ᨲᨧ᩶ᩣ᩻", "Slow Life Studios", "แล้วปะกั๋นใหม่เจ้า · See you again",
                 "animated with lannamation: https://github.com/ddtraveller/lannamation"];   // the kit, where it is held
var S15_TALL = {title: 150, head: 92, line: 52, small: 38, pair: 74, names4: 40, names5: 32, gap: 70, end: 300};
var S15_ROWS = null;
var S15_END_ROOM = 170;                              // from the row before the end to the end's middle: its name stands above that
var S15_GOLD = "#e0b23a", S15_INK = "#f4ecd2", S15_SOFT = "#c9c2dc";

function s15Names(names, across) {                  // a long list of names as rows of "across" (thanks.js)
  var rows = [];
  for (var n = 0; n < names.length; n += across) { rows.push(["names" + across, names.slice(n, n + across)]); }
  return rows;
}

function s15Rows() {                                 // every row: the credits, the maker's list, the thanks, the end last
  if (!S15_ROWS) {
    S15_ROWS = S15_CREDITS.concat(S15_SOURCES, [["head", "ในโรงหนังการ์ตูน", "In the cartoon maker"], ["gap"]], S15_MAKER,
      [["head", "ขอบคุณ", "With thanks to the people who made our sources"]], s15Names(MAENG_THANKED, 4), [["gap"]],
      [["head", "และผู้รู้ที่งานของท่านเป็นรากฐาน", "and the scholars whose work they rest on"]], s15Names(MAENG_SCHOLARS, 5),
      [["gap"], S15_END]);
  }
  return S15_ROWS;
}

function s15Text(text, x, y, font, colour, align, wide) {   // wide: the most it may take across (squeezed to it)
  pen.font = font;
  pen.textAlign = align || "center";
  pen.textBaseline = "middle";
  pen.fillStyle = colour;
  if (wide) { pen.fillText(text, x, y, wide); } else { pen.fillText(text, x, y); }
}

function s15Row(row, y) {                            // one row, its middle at y
  var serif = "'Noto Serif Thai', 'Leelawadee UI', serif", lanna = "'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
  if (row[0] === "title") {
    s15Text(row[1], WIDE / 2, y - 26, "700 72px " + lanna, S15_GOLD);
    s15Text(row[2], WIDE / 2, y + 44, "italic 38px Georgia, 'Times New Roman', serif", S15_INK);
  } else if (row[0] === "head") {
    s15Text(row[1] + "  ·  " + row[2], WIDE / 2, y + 10, "600 40px " + serif, S15_GOLD);
  } else if (row[0] === "line") {
    s15Text(row[1], WIDE / 2, y, "500 38px " + serif, S15_INK);
  } else if (row[0] === "names4" || row[0] === "names5") {   // names, evenly across
    var across = row[0] === "names4" ? 4 : 5, font = across === 4 ? "500 27px " + serif : "500 22px " + serif;
    var span = WIDE * 0.78;                          // inside the frame's middle: the camera's slow push and the film's gate take its edges
    row[1].forEach(function (name, k) {
      s15Text(name, WIDE / 2 + (k + 0.5 - across / 2) * span / across, y, font, across === 4 ? S15_INK : S15_SOFT, "center", span / across - 24);
    });
  } else if (row[0] === "small") {
    s15Text(row[1], WIDE / 2, y, "italic 25px Georgia, " + serif, S15_SOFT);
  } else if (row[0] === "pair") {                    // two of the maker's things, each over where it was drawn from
    [row[1], row[2]].forEach(function (one, side) {
      if (!one) { return; }
      var at = WIDE / 2 + (side ? 1 : -1) * 470;
      s15Text(one[0] + "  ·  " + one[1], at, y - 14, "500 29px " + serif, S15_INK);
      s15Text(one[2], at, y + 20, "italic 23px Georgia, " + serif, S15_SOFT);
    });
  } else if (row[0] === "end") {
    s15Text(row[1], WIDE / 2, y - 70, "700 96px " + lanna, S15_GOLD);
    s15Text(row[2], WIDE / 2, y + 30, "italic 44px Georgia, 'Times New Roman', serif", S15_INK);
    s15Text(row[3], WIDE / 2, y + 110, "500 36px " + serif, S15_SOFT);
    s15Text(row[4], WIDE / 2, y + 180, "500 30px " + serif, S15_GOLD);
  }
}

// ---------- the pandas ----------
// A panda in Teacher Piggy's manner, 200 by 240 of its own points with its waist at the bottom edge, drawn about
// (x, base) "scale" times that, dressed by "look" (S15_PANDAS), bowing into its wai by "bow" (0 to 1): the head and
// body go down, and at the deepest its eyes close in two smiling curves.
var S15_PLUM = "#4a2a3a";

function s15Ell(x, y, rx, ry, turn) { pen.beginPath(); pen.ellipse(x, y, rx, ry, turn || 0, 0, Math.PI * 2); }

function s15Inked(fill, width) {
  pen.fillStyle = fill;
  pen.fill();
  pen.lineWidth = width || 2.2;
  pen.strokeStyle = S15_PLUM;
  pen.lineJoin = "round";
  pen.stroke();
}

function s15Glow(x, y, r, stops) {
  var g = pen.createRadialGradient(x, y, 0, x, y, r);
  stops.forEach(function (one) { g.addColorStop(one[0], one[1]); });
  return g;
}

function s15Flower(x, y, r, petal) {                 // five petals and an orange heart
  for (var k = 0; k < 5; k++) {
    var a = k * Math.PI * 2 / 5 - Math.PI / 2;
    s15Ell(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.5, r * 0.36, a);
    s15Inked(petal, 1.2);
  }
  s15Ell(x, y, r * 0.28, r * 0.28);
  s15Inked("#e08a2a", 1);
}

function s15Cloth(path, base, gold, diamonds) {      // a cloth: its colour, small gold motifs in rows, inside the path
  pen.save();
  path();
  pen.clip();
  pen.fillStyle = base;
  pen.fillRect(0, 0, 200, 240);
  pen.fillStyle = gold;
  for (var y = 150; y < 240; y += 9) {
    for (var x = -10; x < 210; x += 9) {
      var ox = x + (Math.floor(y / 9) % 2) * 4.5;
      pen.beginPath();
      if (diamonds) { pen.moveTo(ox, y - 2.4); pen.lineTo(ox + 2.4, y); pen.lineTo(ox, y + 2.4); pen.lineTo(ox - 2.4, y); }
      else { pen.arc(ox, y, 1.3, 0, 7); }
      pen.fill();
    }
  }
  pen.restore();
  path();
  pen.lineWidth = 2.2;
  pen.strokeStyle = S15_PLUM;
  pen.stroke();
}

function s15Panda(x, base, scale, look, bow) {
  var fur = "#2b2630";
  pen.save();
  pen.translate(x - 100 * scale, base - 240 * scale + 14 * scale * bow);
  pen.scale(scale, scale);
  function torso() {
    pen.beginPath();
    pen.moveTo(18, 240); pen.quadraticCurveTo(14, 186, 44, 172); pen.quadraticCurveTo(100, 156, 156, 172);
    pen.quadraticCurveTo(186, 186, 182, 240); pen.closePath();
  }
  s15Cloth(torso, look.blouse, look.blouseDot, false);   // the blouse, with a round collar edged in gold
  pen.save();
  torso();
  pen.clip();
  s15Ell(100, 166, 30, 12);
  pen.fillStyle = "#f8f3ee";
  pen.fill();
  pen.lineWidth = 2.4;
  pen.strokeStyle = "#e0b23a";
  pen.stroke();
  pen.restore();
  function sabai() {                                 // over the left shoulder (our right), across the chest to the other side
    pen.beginPath();
    pen.moveTo(150, 166); pen.quadraticCurveTo(176, 174, 184, 196); pen.lineTo(186, 240); pen.lineTo(120, 240);
    pen.quadraticCurveTo(84, 214, 44, 206); pen.quadraticCurveTo(40, 194, 50, 188); pen.quadraticCurveTo(96, 196, 150, 166);
    pen.closePath();
  }
  s15Cloth(sabai, look.sabai, "#f2cf5a", true);
  pen.beginPath();                                   // its gold border, and a gold necklace with its pendant
  pen.moveTo(50, 190); pen.quadraticCurveTo(96, 198, 150, 168);
  pen.lineWidth = 3.4;
  pen.strokeStyle = "#e0b23a";
  pen.stroke();
  pen.beginPath();
  pen.moveTo(74, 170); pen.quadraticCurveTo(100, 192, 126, 170);
  pen.lineWidth = 2;
  pen.stroke();
  s15Ell(100, 184, 4, 5);
  s15Inked("#f2cf5a", 1.2);
  pen.save();                                        // the head nods deeper than the body bows
  pen.translate(0, 8 * bow);
  [-1, 1].forEach(function (side) {                  // the black ears
    s15Ell(100 + side * 62, 40, 22, 21);
    s15Inked(fur, 2.4);
    s15Ell(100 + side * 62, 42, 11, 10);
    pen.fillStyle = "#4a4250";
    pen.fill();
  });
  s15Ell(100, 104, 82, 72);                          // the round white face
  pen.fillStyle = s15Glow(84, 80, 110, [[0, "#ffffff"], [0.7, "#f6f2f0"], [1, "#e6dfe2"]]);
  pen.fill();
  pen.lineWidth = 2.6;
  pen.strokeStyle = S15_PLUM;
  pen.stroke();
  if (look.bun) {                                    // a princess's bun of black fur, its gold pins hung with pearls
    s15Ell(100, 30, 26, 18); s15Inked(fur, 2.4);
    s15Ell(100, 16, 18, 13); s15Inked(fur, 2.2);
    pen.strokeStyle = "rgba(255, 255, 255, 0.25)";
    pen.lineWidth = 1.5;
    pen.beginPath(); pen.arc(94, 26, 14, 3.6, 4.6); pen.stroke();
    [-1, 1].forEach(function (side) {
      pen.beginPath(); pen.moveTo(100 + side * 8, 24); pen.lineTo(100 + side * 40, 8);
      pen.lineWidth = 2.4; pen.strokeStyle = "#e0b23a"; pen.stroke();
      s15Ell(100 + side * 40, 8, 3.4, 3.4); s15Inked("#f2cf5a", 1);
      for (var k = 1; k <= 3; k++) { s15Ell(100 + side * 40, 8 + k * 5, 1.6, 1.6); s15Inked("#fffaf0", 0.8); }
    });
  }
  if (look.garland) {                                // a garland of jasmine round the bun
    for (var g = -4; g <= 4; g++) { s15Ell(100 + g * 6.4, 40 - 8 * Math.cos(g / 4 * 1.2), 3.6, 3.6); s15Inked(g % 2 ? "#fffaf0" : "#f6e9b0", 0.9); }
  }
  look.flowers.forEach(function (one) { s15Flower(one[0], one[1], one[2], one[3]); });
  [-1, 1].forEach(function (side) {                  // the eye patches, tipped outward and down
    s15Ell(100 + side * 32, 104, 20, 26, side * -0.5);
    pen.fillStyle = fur;
    pen.fill();
  });
  [-1, 1].forEach(function (side) {                  // the eyes: big and glossy, with lashes; shut in two smiles at the deepest bow
    var ex = 100 + side * 31, ey = 101;
    if (bow > 0.6) {
      pen.beginPath(); pen.moveTo(ex - 10, ey + 2); pen.quadraticCurveTo(ex, ey - 9, ex + 10, ey + 2);
      pen.lineWidth = 3; pen.lineCap = "round"; pen.strokeStyle = "#f4ecd2"; pen.stroke();
      return;
    }
    s15Ell(ex, ey, 12, 13);
    pen.fillStyle = s15Glow(ex, ey + 4, 14, [[0, "#6b4a5a"], [0.6, "#3a2230"], [1, "#160c12"]]);
    pen.fill();
    pen.fillStyle = "#ffffff";
    s15Ell(ex - side - 3.5, ey - 5, 4.2, 4.6); pen.fill();
    s15Ell(ex + 4, ey + 5, 2, 2); pen.fill();
    pen.strokeStyle = "#160c12"; pen.lineWidth = 1.8; pen.lineCap = "round";
    for (var k = 0; k < 3; k++) {
      var a = -Math.PI / 2 + side * (0.6 + k * 0.32);
      pen.beginPath(); pen.moveTo(ex + Math.cos(a) * 12, ey + Math.sin(a) * 13); pen.lineTo(ex + Math.cos(a) * 18, ey + Math.sin(a) * 18 - 2); pen.stroke();
    }
  });
  [-1, 1].forEach(function (side) { s15Ell(100 + side * 54, 134, 15, 10); pen.fillStyle = "rgba(246, 120, 150, 0.45)"; pen.fill(); });   // blush
  s15Ell(100, 136, 26, 19); pen.fillStyle = "#fbf7f4"; pen.fill();     // the muzzle, the nose, the smile
  pen.beginPath();
  pen.moveTo(91, 128); pen.quadraticCurveTo(100, 124, 109, 128); pen.quadraticCurveTo(104, 137, 100, 138); pen.quadraticCurveTo(96, 137, 91, 128);
  s15Inked(fur, 1.6);
  pen.beginPath(); pen.moveTo(88, 145); pen.quadraticCurveTo(100, 160, 112, 145); pen.quadraticCurveTo(100, 150, 88, 145);
  s15Inked("#8c2a48", 1.8);
  s15Ell(100, 151, 5, 2.6); pen.fillStyle = "#ff8aa5"; pen.fill();
  [-1, 1].forEach(function (side) { s15Ell(100 + side * 76, 118, 4.5, 4.5); s15Inked("#f2cf5a", 1.2); });   // gold ear plugs
  pen.restore();
  pen.lineCap = "round";                             // the wai: each arm down to the elbow and up, the paws palm to palm
  [-1, 1].forEach(function (side) {
    pen.beginPath(); pen.moveTo(100 + side * 62, 190); pen.quadraticCurveTo(100 + side * 58, 230, 100 + side * 34, 228);
    pen.quadraticCurveTo(100 + side * 16, 226, 100 + side * 9, 206 - 6 * bow);
    pen.lineWidth = 25; pen.strokeStyle = S15_PLUM; pen.stroke();
    pen.lineWidth = 20.5; pen.strokeStyle = fur; pen.stroke();
  });
  pen.save();
  pen.translate(0, -6 * bow);                        // the paws come up to the bowed face
  [-1, 1].forEach(function (side) {
    pen.beginPath(); pen.moveTo(100, 212); pen.quadraticCurveTo(100 + side * 15, 206, 100 + side * 12, 184);
    pen.quadraticCurveTo(100 + side * 8, 168, 100, 164); pen.closePath();
    s15Inked(fur, 2.2);
    s15Ell(100 + side * 6, 184, 3, 5); pen.fillStyle = "#5a4a58"; pen.fill();
  });
  pen.strokeStyle = "#6a5a68"; pen.lineWidth = 1.2;
  pen.beginPath(); pen.moveTo(100, 167); pen.lineTo(100, 210); pen.stroke();
  pen.restore();
  pen.restore();
}

function s15Thanks(t) {                              // the three pandas and the thank-you, from S15_THANKS on
  var come = clamp((t - S15_THANKS[0]) / (S15_THANKS[1] - S15_THANKS[0]));
  if (come <= 0) { return; }
  var rise = 1 - Math.pow(1 - come, 3);
  pen.save();
  pen.globalAlpha = come;
  pen.fillStyle = s15Glow(WIDE / 2, 980, 900, [[0, "rgba(255, 236, 190, 0.22)"], [1, "rgba(255, 236, 190, 0)"]]);   // a warm light behind them
  pen.fillRect(0, 0, WIDE, 1080);
  s15Text(S15_THANK_YOU[0], WIDE / 2, 150, "600 64px 'Noto Serif Thai', 'Leelawadee UI', serif", S15_GOLD);
  s15Text(S15_THANK_YOU[1], WIDE / 2, 232, "italic 42px Georgia, 'Times New Roman', serif", S15_INK);
  pen.globalAlpha = 1;                               // the pandas rise in whole: one seen through shows its own layers
  S15_PANDAS.forEach(function (look, n) {
    var bow = 0;
    S15_WAIS.forEach(function (wai) { var u = (t - wai[n]) / 1.8; if (u > 0 && u < 1) { bow = Math.max(bow, Math.sin(Math.PI * u)); } });
    s15Panda(WIDE / 2 + (n - 1) * 600, 1080 + 320 * (1 - rise), 2.5, look, bow);
  });
  pen.restore();
}

function sceneCredits(t) {
  var mountain = maengMountain();
  if (!mountain.backNight) {                         // the mountain by night, as the yard is at night
    mountain.backNight = maengTinted(mountain.back, MAENG_NIGHT[0], 0.7);
    mountain.frontNight = maengTinted(mountain.front, MAENG_NIGHT[0], 0.75);
  }
  pen.drawImage(maengSky("night"), 0, 0);
  pen.drawImage(mountain.backNight, 0, 0);
  pen.drawImage(mountain.frontNight, 0, 0);
  pen.fillStyle = "rgba(4, 6, 20, 0.45)";            // a veil, so the words read over the mountain
  pen.fillRect(0, 0, WIDE, 1080);
  // The roll: the first row comes in at the foot of the frame at S15_ROLL[0], and the end's middle reaches the
  // middle of the frame at S15_ROLL[1], and stays.
  var rows = s15Rows(), tall = 0, n;
  for (n = 0; n < rows.length - 1; n++) { tall += S15_TALL[rows[n][0]]; }
  var from = 1080 + 60, to = 540 - S15_END_ROOM - tall, top = mix(from, to, clamp((t - S15_ROLL[0]) / (S15_ROLL[1] - S15_ROLL[0])));
  var y = top;
  pen.save();
  pen.globalAlpha = 1 - clamp((t - S15_THANKS[0]) / 0.8);   // the words go before the thanks
  for (n = 0; n < rows.length; n++) {                // the end is held with its middle in the frame's
    var middle = rows[n][0] === "end" ? y + S15_END_ROOM : y + S15_TALL[rows[n][0]] / 2;
    if (middle > -160 && middle < 1240) { s15Row(rows[n], middle); }
    y += S15_TALL[rows[n][0]];
  }
  pen.restore();
  s15Thanks(t);
  maengDark(t, S15_LONG - 2.4, S15_LONG + 10);
  maengDark(t, -10, 0);
}
