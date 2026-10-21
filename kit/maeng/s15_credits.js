// s15_credits.js - scene 15 of the film of the creature with four ears and five eyes: the credits.
// Doi Khao Khwai at night under its stars, and the credits rolling up over it: who made the film, the voice that
// tells it, where the tale and its sounds come from, then everything the cartoon maker can put in a film, each
// with where it was drawn from as far as the kit records it (docs/STYLE.md and the kit's files); last, the
// studio's name, held. Owner, 2026-10-19: "List animation credits as lannamation and the github repo and for AI
// voice: list Panda" (a stub until the speaker sent her own name), "You can also list Claude AI"; 2026-10-20: "Change
// Panda's name in the credits to" her name, in English and in Thai.
var S15_LONG = 195;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets and the frogs of the night on the mountain, under the music.
var S15_SOUND = {calls: [[0, "crickets", 0.3, 195], [0, "frogs", 0.4, 195], [186.6, "tokay-two", 0.6]]};   // and last, the tokay's two calls
// (owner, 2026-10-20: two tokay sounds "at the end of the process"), done before the dark at S15_LONG - 2.4
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
var S15_THANK_YOU = ["ขอบคุณหลาย ๆ เจ้า", "Thank you, Amornrat Jaijar, for the voice of this tale"];

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
  ["line", "อมรรัตน์ ใจจา · Amornrat Jaijar"],
  ["gap"],
  ["head", "ตัวละคร", "The cast"],
  ["pair", ["อ้ายทุกขตะ", "Thukkhata", "a poor boy of the north"], ["ป้อ", "His father", "who asked for the snare"]],
  ["pair", ["แม่", "His mother", "who went before"], ["แมงสี่หูห้าตา", "The creature", "four ears, five eyes"]],
  ["pair", ["พญาพันธุมติ", "King Phanthumati", "of the city of Phanthumati"], ["เจ้านางสีมา", "Princess Sima", "his daughter"]],
  ["pair", ["คนของพญา", "The king's man", "the gong, the news, the trough"], ["ป้อค้าฮ่อ", "The Haw traders", "a caravan of Yunnan"]],
  ["pair", ["พญาธรรมิกราช", "The Righteous King", "Thukkhata, grown"], ["บัวคำ", "Bua-kham", "who tells the kit's tales"]],
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
  ["small", "the hens: alys, public domain (Wikimedia Commons) · the rooster: Wich'yanan L., CC BY 4.0 (iNaturalist)"],
  ["small", "the buffalo: Ashwin A., CC BY 4.0 (iNaturalist) · the cicadas: Wich'yanan (Jay) Limparungpatthanakij, CC BY 4.0 (iNaturalist)"],
  ["small", "the frogs of Chom Thong: golo.foellmer, Public Domain Mark (radio aporee ::: maps) · the flock: Gunter Königsmann, CC BY 4.0"],
  ["small", "the pack horse: Hü., public domain (Wikimedia Commons) · the crickets and the mice: made by the kit from numbers"],
  ["gap"],
  ["head", "ข้าวของเครื่องใช้", "The things of a Lanna home"],
  ["small", "researched in 22 sources: the Lanna Traditional House Museum (Chiang Mai University),"],
  ["small", "a Ministry of Education book of basketry, studies of the Tai Yuan house"],
  ["gap"],
  ["head", "ค้นคว้า", "Research: 285 sources in eleven NotebookLM notebooks"],
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
  ["small", "Lanna houses: Chiang Mai University's Lanna Traditional House Museum and ACCL · STOU · Saranukrom Thai · Lek-Prapai"],
  ["small", "the Fine Arts Department's Chiang Mai library · Baan Lae Suan · SCG · Chiang Mai News · a study in ThaiJo"],
  ["small", "Royal dress: the Fine Arts Department · ACCL · Chulalongkorn University's Art and Culture · Silpa Wattanatham"],
  ["small", "the National Library of Thailand · ICH Thailand · OAPEN · cmocity · Thai Enquirer · Chiang Mai PAO"],
  ["small", "Village farming: Lanna Info (Chiang Mai University) · Maejo University · HRDI · STOU · the Ministry of Culture"],
  ["small", "AIMS Press · MDPI · Thai PBS · Read the Cloud · Krua.co · ONEP · Khon Kaen Zoo · Rakbankerd · Thai Language Hut"],
  ["small", "Lanna fish: the Field Guide to the Northern Thai Fishes · FishBase · Maejo University · the Department of Fisheries"],
  ["small", "the Lee Kong Chian Natural History Museum (NUS) · the Nagao Natural Environment Foundation · Saranukrom Thai · ThaiJo"],
  ["small", "Night creatures: Thai National Parks · Avibase · ThaiBirding · North Thailand Birding · Bangkok Herps"],
  ["small", "Amphibian & Reptile Travels · FORRU (Chiang Mai University) · Chiang Mai Rajabhat University · Naresuan University"],
  ["small", "ThaiJo · the Journal of Wildlife and Biodiversity · the Fine Arts Department · Silpa Wattanatham · Thai PBS · Thairath"],
  ["small", "siamensis.org · GotoKnow · Jorakay · LINE Today · Chiang Mai Citylife · and Wikipedia"],
  ["gap"],
  ["head", "สมุดค้นคว้า", "The research notebooks, open to read (Google asks for a sign-in)"],
  ["small", "Lanna houses · notebooklm.google.com/notebook/113b14eb-cc08-44fd-8646-dfa8a1296ea0"],
  ["small", "Lanna material culture · notebooklm.google.com/notebook/c4f5b066-4067-4a19-87bd-aad08cee36c8"],
  ["small", "Lanna village farming · notebooklm.google.com/notebook/b60a376b-2ba0-4bdd-baa9-071ae38a1f4c"],
  ["small", "Lanna royal dress · notebooklm.google.com/notebook/96884a5c-424f-4e03-abbb-a6abfea73507"],
  ["small", "Lanna fish · notebooklm.google.com/notebook/732ac6ef-3b47-4e62-9e01-c28e5132eb56"],
  ["small", "Lanna history · notebooklm.google.com/notebook/d4d0435c-e262-45d9-934b-9cdfcef9ddea"],
  ["small", "Faces of the north · notebooklm.google.com/notebook/d8935530-2558-4894-891a-f1d7954eae37"],
  ["small", "Lanna women's hair · notebooklm.google.com/notebook/918d561e-9488-47ee-8192-eacea4243181"],
  ["small", "Lanna household items · notebooklm.google.com/notebook/51aaf1ee-6676-4e56-bf69-618a3bc7a219"],
  ["small", "Lanna fairy tales and myths · notebooklm.google.com/notebook/fd7ed330-3806-456e-b9be-5ef912977abe"],
  ["small", "Night creatures of the north · notebooklm.google.com/notebook/26c20a5c-6f6e-420a-8fe9-f1f86409f91a"],
  ["gap"],
  ["head", "ภาพถ่ายที่ใช้ศึกษา", "Photographs studied (Wikimedia Commons)"],
  ["small", "Chainwit., Big HDV, Dennis G. Jarvis, Hałun, Iudexvivorum, Photo Dharma,"],
  ["small", "Jiranee119, Leopoldoghost, Patiparn.Nice2002bkk, มะเดื่อ แสลงหลวง; the night: Nikhil More, Dannymoore1973,"],
  ["small", "Charlie Marshall, Quartl, Jonathan Curley, Bernard Dupont, Manoj Karingamadathil: drawn from, never copied"],
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
  ["pair", ["แม่ไก่ ไก่ดำ", "Hen, black chickens", "the kai dam of the north; Krua.co"], ["นกยางควาย", "Cattle egret", "the egret behind the plough; Read the Cloud"]],
  ["pair", ["ปลากระดี่ ปลาสร้อย ปลาซิว ปลาช่อน", "Native fish", "the Field Guide to the Northern Thai Fishes"], null],
  ["gap"],
  ["head", "บ้านเรือนและสถานที่", "Houses and places"],
  ["pair", ["บ้าน", "House", "the crossed gable ends of a northern house"], ["ต้นไม้ มะพร้าว กล้วย", "Trees, palm, banana", "a lotus-pond painting and a thangka"]],
  ["pair", ["วัด", "Temple", "Thai paintings: gold trim, a chedi"], ["ยักษ์", "Giant", "a yak at Wat Phra Kaeo"]],
  ["pair", ["น้ำต้น", "Water jar", "the custom of the north"], ["ตุง", "Tung", "the gilded hang hong of Wat Chet Yot"]],
  ["pair", ["กลองหลวง", "Great drum", "the drum cart of Wat Hiranyawat (Commons)"], ["หลองข้าว", "Granary", "the Lanna Traditional House Museum"]],
  ["pair", ["เสวียน", "Sawian", "the Lanna Traditional House Museum"], ["ตูบ", "Hut", "as the tales have it"]],
  ["pair", ["หอคำ", "Ho Kham", "the peacock gable of Wat Phan Tao"], ["ก่องข้าว กระบุง", "Rice basket, basket", "the House Museum; basketry"]],
  ["pair", ["ครกไม้", "Mortar", "the House Museum; Tai Yuan houses"], ["ตาแหลว", "Ta laew", "the House Museum; Tai Yuan houses"]],
  ["pair", ["คอก ฆ้อง ฟืน ถ้ำ", "Pen, gong, firewood, cave", "made for this tale"], ["เรือนเครื่องผูก", "Bamboo house", "the Lanna Traditional House Museum (CMU)"]],
  ["pair", ["หญ้ามัด กล้วยน้ำว้า", "Grass, bananas", "made for this tale"], ["ไม้เขี่ยไฟ", "Fire stick", "made for this tale"]],
  ["gap"],
  ["head", "สัตว์กลางคืน", "Creatures of the night (night.js)"],
  ["pair", ["นกแสก", "Eastern barn owl", "Thai National Parks; photographs (Commons)"], ["ผีเสื้อหนอนใบกระท้อน", "Atlas moth", "a photograph by Quartl (Commons)"]],
  ["pair", ["ค้างคาว", "Bats", "house bats; bats going out at dusk (Commons)"], ["หิ่งห้อย", "Fireflies", "the fireflies of the fields, seen from far off"]],
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

// ---------- the bows ----------
// Owner, 2026-10-20: "When the credits role have all the sprites use come out and take a bow when they are listed".
// Each name of the cast and of the maker's list has its figure (S15_FIGURES, by its English name). As its row comes
// up the frame, the figure comes out from the frame's edge beside it (the left one's on the left, the right one's on
// the right, each facing in), bows as the row passes the middle (a person over a wai, a creature or a thing tipping
// forward from its feet), and goes back out as the roll goes on. Each is drawn once onto a tile (sabai.js's
// sabaiTile(), as the woven figures are), so the roll stays quick to draw; one that moves has its cycle.
var S15_BOW_TILE = 256;                               // a tile's side
var S15_BOW_TALL = 150;                               // the figure's height (or width, if wider) on the screen
var S15_BOW_EDGE = 112;                               // its middle from the frame's edge when it is out
var S15_BOW_AT = [680, 610, 520, 450];                // the row's height on the screen: it comes out from the first to the second, goes back from the third to
                                                      // the fourth, so one is coming out as the one before goes back (a row is 74 below the one before)
var S15_BOW_DEEP = [610, 520];                        // and bows while the row goes from the one to the other
var S15_TILES = {};

function s15Ease(u) { u = clamp(u); return u * u * (3 - 2 * u); }

function s15Who(kind, own) {                          // a person of the cast, in a wai
  return function () { person(0, 0, maengPerson(kind, own || {}, {wai: true, feel: "happy", face: 1, id: "bow-" + kind})); };
}
function s15Many(list) {                              // a few side by side, each painter at its offset across
  return function (b, u) { list.forEach(function (one) { b.save(); b.translate(one[0], 0); one[1](b, u); b.restore(); }); };
}
function s15Small(size, painter) {                    // a big thing drawn smaller, so its tile can hold it
  var moving = painter.length >= 2;
  return moving ? function (b, u) { b.save(); b.scale(size, size); painter(b, u); b.restore(); }
                : function (b) { b.save(); b.scale(size, size); painter(b); b.restore(); };
}
var S15_FIGURES = {
  // the cast
  "Thukkhata": s15Who("boy", MAENG_LAD), "His father": s15Who("fellow", MAENG_FATHER), "His mother": s15Who("weaver", MAENG_MOTHER),
  "The creature": function (b, u) { maengSiHuHaTa(0, 0, {size: 0.6, step: u, feel: "happy"}); },
  "King Phanthumati": s15Who("noble", MAENG_KING), "Princess Sima": s15Who("lady", MAENG_SIMA), "The king's man": s15Who("fellow", MAENG_HERALD),
  "The Haw traders": s15Many([[-60, function () { person(0, 0, maengTrader(0, {wai: true, face: 1, id: "bow-trader0"})); }],
                              [60, function () { person(0, 0, maengTrader(1, {wai: true, face: 1, id: "bow-trader1"})); }]]),
  "The Righteous King": s15Who("noble", MAENG_KING_THUKKHATA), "Bua-kham": s15Who("buakham"),
  // the maker's people
  "Boy": s15Who("boy"), "Girl": s15Who("girl"), "Lady": s15Who("lady"), "Young man": s15Who("fellow"), "Villager": s15Who("villager"),
  "Chiang Mai lad": s15Who("farmer"), "Prince": s15Who("noble"), "Maiden": s15Who("maiden"), "Grandmother weaver": s15Who("weaver", {hair: "#e8e3da", age: 1}),
  "Grandfather": s15Who("elder"), "Grandmother": s15Who("grandmother"), "Old farmer": s15Who("oldfarmer"),
  "Grandmother to the temple": s15Who("devotee"), "Dancer": s15Who("dancer"), "Celestial": s15Who("celestial"), "Drummer": s15Who("drummer"),
  "Scientist": s15Who("scientist"),
  "Inta, Khammun, Bua-kham": s15Many([[-90, s15Who("inta")], [0, s15Who("khammun")], [90, s15Who("buakham")]]),
  "Sinuan, Bunma, Dokkham": s15Many([[-80, s15Who("sinuan")], [0, s15Who("bunma")], [70, s15Who("dokkham")]]),
  // the maker's creatures and things
  "Dog": function (b, u) { dog(0, 0, u * 2); }, "Rooster": function (b, u) { rooster(0, 0, u * 2); },
  "Naga": function () { naga(0, -60, {size: 0.5, heads: 5}); }, "Dragon": function () { dragon(0, -80, {size: 0.4, breath: 0.5}); },
  "Mom": function (b, u) { mom(0, 0, {size: 0.6, step: u}); }, "Phaya Luang": function () { luang(0, 0, {size: 0.4}); },
  "Sun": function (b, u) { sun(0, -60, u * 2); }, "Birds": function (b, u) {                         // the kit's flock is drawn in its dark ink, which the night hides: here in the credits' own
    b.save(); birds(u * 2, 0, -60); b.globalCompositeOperation = "source-in"; b.fillStyle = S15_INK; b.fillRect(-400, -400, 800, 800); b.restore();
  },
  "Sky lantern": function (b) { b.save(); b.beginPath(); b.rect(-45, -190, 90, 140); b.clip(); lantern(0, -100, 70); b.restore(); },   // its glow runs past a tile: the lantern alone
  "Lanna lantern": function () { khom(0, -300, {lit: 0, sway: 0}); },
  "Sand stupa": function (b, u) { chediSai(b, 0, 0, 1, u * 2, 3); }, "Oil lamps": function (b, u) { pratheepRow(b, -90, 0, 4, 60, 1.2, u * 2); },
  "Krathong": function (b, u) { krathong(b, 0, 0, 1.2, u * 2, false); }, "Ox cart": function (b, u) { oxcart(b, 0, 0, 0.8, u * Math.PI, 1); },
  "Salo": function (b, u) { musician(0, 0, "salo", cast("fellow", {size: 1.1}), u * 2); },
  "Sueng": function (b, u) { musician(0, 0, "sueng", cast("farmer", {size: 1.1}), u * 2); },
  "Pi chum": function (b, u) { musician(0, 0, "pichum", cast("elder", {size: 1.1}), u * 2); },
  "Phin phia": function (b, u) { musician(0, 0, "phinphia", cast("fellow", {size: 1.1}), u * 2); },
  "Turning lantern": function () { khomPhat(0, -300, {lit: 0}); },
  "Star and lotus lanterns": s15Many([[-80, function () { khomDao(0, -300, {lit: 0, sway: 0}); }], [80, function () { khomBua(0, -300, {lit: 0}); }]]),
  "Hand lantern": function () { khomThue(0, -200, {size: 1, lit: 0}); },
  "Tung sai mu": function (b, u) { tungSaiMu(b, 0, 0, 1.3, u * 2, 7, 7); }, "Tung yai": function (b, u) { tungYai(b, 0, 0, 0.8, u * 2); },
  "Red truck": s15Small(0.6, function (b) { rotDaeng(b, 0, 0, 1, 0, 1, function () {}); }),
  "Elephant": function (b, u) { elephant(0, 0, {size: 0.35, step: u}); }, "Tiger": function (b, u) { tiger(0, 0, {size: 0.6, step: u}); },
  "Cat": function (b, u) { cat(0, 0, {size: 1, step: u}); }, "Pig": function (b, u) { pig(0, 0, {size: 0.8, step: u}); },
  "Pack horse": function (b, u) { horse(0, 0, {size: 0.75, step: u, pack: true}); },
  "House and field mice": s15Many([[-40, function (b, u) { mouse(0, 0, {kind: "house", size: 1.1, step: u}); }],
                                   [40, function (b, u) { mouse(0, 0, {kind: "field", size: 1.1, step: u}); }]]),
  "Tokay gecko": function (b, u) { gecko([[-90, 0], [90, 0]], 150 + 20 * u, {size: 1, t: u}); },
  "Green peafowl": function (b, u) { peafowl(0, 0, u, {size: 0.6, display: 1, shiver: 0.5}); },
  "Mrs Hume's pheasant": function (b, u) { pheasant(0, 0, u, {size: 0.9, step: u}); },
  "Sunbird": function (b, u) { sunbird(0, 0, u / 13, {size: 2.4, hover: 1}); },
  "Blue magpie": function (b, u) { blueMagpie(0, 0, u, {size: 0.9, fly: true}); }, "Hornbill": function (b, u) { hornbill(0, 0, u, {size: 0.7, fly: true}); },
  "Maeng Si Hu Ha Ta": function (b, u) { maengSiHuHaTa(0, 0, {size: 0.6, step: u}); },
  "Fire, rice steamer": s15Many([[-70, function (b, u) { campfire(b, 0, 0, 1, u * 2, {light: 0}); }], [70, function (b, u) { huad(b, 0, 0, 1, u * 2, {fire: 1}); }]]),
  // the maker's houses and places
  "House": function (b) { house(b, 0, 0, 0.6); },
  "Trees, palm, banana": s15Small(0.5, s15Many([[-260, function (b) { tree(b, 0, 0, 1.1); }], [0, function (b) { palm(b, 0, 0, 400); }], [220, function (b) { banana(b, 0, 0); }]])),
  "Temple": s15Small(0.5, function (b) { temple(b, 0, 0); }), "Giant": function (b) { yak(b, 0, 0, 1); },
  "Water jar": function (b) { namton(b, 0, 0, 1.2); }, "Tung": s15Small(0.5, function (b) { tung(b, 0, 0, 0, true); }),
  "Great drum": function (b) { drumCart(b, 0, 0, 0.5, 1); }, "Granary": function (b) { longKhao(b, 0, 0, 0.6); },
  "Sawian": function (b) { sawian(b, 0, 0, 1.2); }, "Hut": function (b) { tub(b, 0, 0, 1.4); },
  "Ho Kham": function (b) { hoKham(b, 0, 0, 0.45, {part: "back", pediment: "peacock"}); hoKham(b, 0, 0, 0.45, {part: "front", pediment: "peacock"}); },
  "Rice basket, basket": s15Many([[-50, function (b) { kongKhao(b, 0, 0, 1.1); }], [50, function (b) { krabung(b, 0, 0, 1.1); }]]),
  "Mortar": function (b) { mortar(b, 0, 0, 1.1); }, "Ta laew": function (b) { taLaew(b, 0, 0, 1.1); },
  "Hen, black chickens": s15Many([[-80, function (b, u) { rooster(0, 0, u * 2, {hen: true}); }], [0, function (b, u) { rooster(0, 0, u * 2, {black: true}); }],
                                  [80, function (b, u) { rooster(0, 0, u * 2, {black: true, hen: true}); }]]),
  "Cattle egret": function (b, u) { egret(0, 0, u, {size: 1, peck: 0.5 + 0.5 * Math.sin(u * Math.PI * 2)}); },
  "Native fish": s15Many([[-60, function (b, u) { nativeFish(b, 0, -60, 1.6, 1, "gourami", u); }], [60, function (b, u) { nativeFish(b, 0, -40, 1.6, 1, "barb", u); }],
                          [-60, function (b, u) { nativeFish(b, 0, -10, 1.6, 1, "flying", u); }], [60, function (b, u) { nativeFish(b, 0, 10, 1.6, 1, "snakehead", u); }]]),
  "Bamboo house": function (b) { ruenPhuk(b, 0, 0, 1); },
  "Grass, bananas": s15Many([[-50, function (b) { grassBundle(b, 0, -45, 1.2, {tied: true}); }], [50, function (b) { bananas(b, 0, -18, 1.2, {count: 5, ripe: 0.8}); }]]),
  "Fire stick": function (b) { fireStick(b, [-60, 0], [60, -12], {hot: 0.6}); },
  "Eastern barn owl": function (b, u) { barnOwl(0, 0, u * 2, {size: 1}); },
  "Atlas moth": function (b, u) { atlasMoth(0, -80, u, {size: 0.42}); },
  "Bats": function (b, u) { batStream(u * 3, {from: [-90, -170], to: [90, -40], count: 12, every: 0.25, long: 3, size: 1.6, far: 0.6, spread: 50}); },
  "Fireflies": function (b, u) { farFireflies(u * 4, {box: [-90, -170, 90, -10], count: 24}); },
  "Pen, gong, firewood, cave": s15Many([[-70, function (b) { gong(b, 0, 0, 1.1); }], [70, function (b) { firewood(b, 0, -8, 1.1, {loose: true}); }]])
};

function s15Bow(row, y, t) {                          // the figures of a row whose middle is at y
  [row[1], row[2]].forEach(function (one, side) {
    var painter = one && S15_FIGURES[one[1]];
    if (!painter) { return; }
    var out = s15Ease((S15_BOW_AT[0] - y) / (S15_BOW_AT[0] - S15_BOW_AT[1])) * s15Ease((y - S15_BOW_AT[3]) / (S15_BOW_AT[2] - S15_BOW_AT[3]));
    if (out <= 0) { return; }
    var frames = S15_TILES[one[1]] || (S15_TILES[one[1]] = sabaiTile(painter, S15_BOW_TILE));
    var frame = frames[Math.floor(t * 7.5) % frames.length];
    var bow = Math.sin(Math.PI * clamp((S15_BOW_DEEP[0] - y) / (S15_BOW_DEEP[0] - S15_BOW_DEEP[1])));
    var shown = S15_BOW_TALL / 0.86, face = side ? -1 : 1;   // the tile's picture fills 0.86 of it
    var x = side ? WIDE - mix(-shown / 2, S15_BOW_EDGE, out) : mix(-shown / 2, S15_BOW_EDGE, out);
    pen.save();
    pen.translate(x, y + shown * 0.43 + 6 * bow);      // about its feet, at the foot of the tile
    pen.rotate(face * 0.3 * bow);                      // tipping forward, toward the middle of the frame
    pen.scale(face, 1);
    pen.drawImage(frame, -shown / 2, -shown, shown, shown);
    pen.restore();
  });
}

// The night over the mountain while the credits roll (owner, 2026-10-21: "do the moth, the fireflies, the owl, maybe a
// common bat and add them to the credits", then "Add a Moon and clouds and change the color of the owl when it is in
// or out of moon light and show its silouette as it crosses the moon"; the bats "fly behind hills or get smaller and
// fade out"; the fireflies "subtle and distant in the background"). All of it is under the veil, as the mountain is.
var S15_MOON = [1610, 150, 58];                      // the moon: its middle and its radius, high at the right
var S15_OWLS = [                                     // [from, to, fly, path: [x, y, size] at its start and its end]
  [12, 26, "side", [[-160, 330, 0.75], [2100, 90, 0.75]]],      // across the sky and over the moon's face
  [70, 82, "front", [[700, 260, 0.3], [260, 900, 1.1]]],        // gliding toward us, out at the lower left
  [118, 130, "side", [[2080, 210, 0.75], [-160, 320, 0.75]]]    // back the other way, over the far hills
];
var S15_PERCH = [150, 195];                           // the owl on a branch at the upper left, to the end
var S15_BATS = [[34, [1760, 110], [1180, 540]], [96, [1830, 190], [1300, 560]], [158, [1700, 90], [1000, 520]]];   // [start, from, to]: out past the moon, where they show black on its glow, and down behind the near ridge
var S15_MOTHS = [[86, 98, [1960, 760], [1500, 640]], [138, 150, [-60, 700], [420, 620]]];   // [from, to, where from, where to]

function s15Owl(o, t, moon) {                        // one of S15_OWLS, at second t of its flight
  if (t < o[0] || t > o[1]) { return; }
  var u = (t - o[0]) / (o[1] - o[0]), a = o[3][0], b = o[3][1];
  var x = mix(a[0], b[0], u), y = mix(a[1], b[1], u) - (o[2] === "side" ? 60 * Math.sin(Math.PI * u) : 0);
  barnOwl(x, y, t, {fly: o[2], size: mix(a[2], b[2], u * u), face: b[0] < a[0] ? -1 : 1, lit: moonLight(x, y, moon), moon: moon});
}

function s15NightSky(t) {                             // behind the far hills: the moon, the clouds, the owl in flight
  var moon = nightMoon(S15_MOON[0], S15_MOON[1], S15_MOON[2]);
  cumulus(pen, t, CLOUD_LOOKS.night);
  S15_OWLS.forEach(function (o) { if (o[2] === "side") { s15Owl(o, t, moon); } });   // high, behind the hills
  return moon;
}

function s15NightHills(t) {                           // between the far hills and the near: the bats, going behind the near ridge
  S15_BATS.forEach(function (b) { batStream(t, {start: b[0], from: b[1], to: b[2], count: 50, every: 0.18, long: 9, size: 1.4, far: 0.35, spread: 80}); });
}

function s15NightNear(t, moon) {                      // in front of the mountain: the fireflies on its slopes, a moth, the perched owl
  farFireflies(t, {box: [0, 820, WIDE, 1070], count: 70});
  S15_OWLS.forEach(function (o) { if (o[2] === "front") { s15Owl(o, t, moon); } });   // coming down toward us, in front of the mountain
  S15_MOTHS.forEach(function (m) {
    if (t < m[0] || t > m[1]) { return; }
    var u = (t - m[0]) / (m[1] - m[0]), x = mix(m[2][0], m[3][0], s15Ease(u * 1.6)) + 40 * Math.sin(t * 2.1), y = mix(m[2][1], m[3][1], u) + 30 * Math.sin(t * 2.9);
    if (u > 0.62) { x += (m[3][0] < m[2][0] ? -1 : 1) * 1400 * (u - 0.62) * (u - 0.62); y -= 900 * (u - 0.62) * (u - 0.62); }   // it rests a moment, then flutters off and up
    atlasMoth(x, y, t, {size: 0.42, turn: 0.3 * Math.sin(t * 1.3), lit: moonLight(x, y, moon)});
  });
  if (t >= S15_PERCH[0]) {
    var come = s15Ease((t - S15_PERCH[0]) / 1.5);     // the branch reaches in from the frame's left, the owl on it
    pen.save();
    pen.translate(-260 * (1 - come), 0);
    pen.strokeStyle = "#1a1612";
    pen.lineCap = "round";
    pen.lineWidth = 16;
    pen.beginPath(); pen.moveTo(-30, 330); pen.quadraticCurveTo(150, 300, 330, 340); pen.stroke();
    pen.lineWidth = 6;
    pen.beginPath(); pen.moveTo(250, 326); pen.quadraticCurveTo(300, 290, 330, 280); pen.stroke();
    barnOwl(190, 312, t, {size: 1, lit: moonLight(190, 260, moon) + 0.2, turn: -0.4});
    pen.restore();
  }
}

function sceneCredits(t) {
  var mountain = maengMountain();
  if (!mountain.backNight) {                         // the mountain by night, as the yard is at night
    mountain.backNight = maengTinted(mountain.back, MAENG_NIGHT[0], 0.7);
    mountain.frontNight = maengTinted(mountain.front, MAENG_NIGHT[0], 0.75);
  }
  pen.drawImage(maengSky("night"), 0, 0);
  var moon = s15NightSky(t);
  pen.drawImage(mountain.backNight, 0, 0);
  s15NightHills(t);
  pen.drawImage(mountain.frontNight, 0, 0);
  s15NightNear(t, moon);
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
    if (middle > -160 && middle < 1240) { s15Row(rows[n], middle); if (rows[n][0] === "pair") { s15Bow(rows[n], middle, t); } }
    y += S15_TALL[rows[n][0]];
  }
  pen.restore();
  s15Thanks(t);
  maengDark(t, S15_LONG - 2.4, S15_LONG + 10);
  maengDark(t, -10, 0);
}
