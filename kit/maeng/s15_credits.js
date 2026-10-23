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
  // owner, 2026-10-21: "add Writer: Amornrat Jaijar because she is going to rewrite the text properly. Language
  // Research: Amornrat Jaijar for her work on recording and checking and correcting the language model results"
  ["head", "ผู้เขียน", "Writer"],
  ["line", "อมรรัตน์ ใจจา · Amornrat Jaijar"],
  ["gap"],
  ["head", "ค้นคว้าภาษา", "Language research"],
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
  ["small", "the hens: alys, public domain (Wikimedia Commons) · the rooster's crow: made with MOSS-SoundEffect (OpenMOSS, Apache-2.0)"],
  ["small", "the buffalo: Ashwin A., CC BY 4.0 (iNaturalist) · the cicadas: Wich'yanan (Jay) Limparungpatthanakij, CC BY 4.0 (iNaturalist)"],
  ["small", "the frogs of Chom Thong: golo.foellmer, Public Domain Mark (radio aporee ::: maps) · the flock: Gunter Königsmann, CC BY 4.0"],
  ["small", "the pack horse: Hü., public domain (Wikimedia Commons) · the crickets and the mice: made by the kit from numbers"],
  ["small", "the studio's card: the wind made by the kit · the blue magpie, CC0 · the shama: Utain Pummarin, CC BY 4.0 (iNaturalist)"],
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
var S15_ROWS = null;

// Gives back the whole list of rows, as S15_CREDITS describes them, made on the first call and kept in S15_ROWS
// after. e.g. var rows = s15Rows();
function s15Rows() {                                 // every row: the credits, the maker's list, the thanks, the end last
  if (!S15_ROWS) {
    S15_ROWS = S15_CREDITS.concat(S15_SOURCES, [["head", "ในโรงหนังการ์ตูน", "In the cartoon maker"], ["gap"]], S15_MAKER,
      [["head", "ขอบคุณ", "With thanks to the people who made our sources"]], creditNames(MAENG_THANKED, 4), [["gap"]],
      [["head", "และผู้รู้ที่งานของท่านเป็นรากฐาน", "and the scholars whose work they rest on"]], creditNames(MAENG_SCHOLARS, 5),
      [["gap"], S15_END]);
  }
  return S15_ROWS;
}



// kind: a name of the kit's cast; own: the film's look (MAENG_LAD, ...), or left out. Gives back a painter for
// S15_FIGURES (it draws the person at 0, 0 when called). e.g. "Thukkhata": s15Who("boy", MAENG_LAD)
function s15Who(kind, own) {                          // a person of the cast, in a wai
  return function () { person(0, 0, maengPerson(kind, own || {}, {wai: true, feel: "happy", face: 1, id: "bow-" + kind})); };
}
var S15_FIGURES = {
  // the cast
  "Thukkhata": s15Who("boy", MAENG_LAD), "His father": s15Who("fellow", MAENG_FATHER), "His mother": s15Who("weaver", MAENG_MOTHER),
  "The creature": function (b, u) { maengSiHuHaTa(0, 0, {size: 0.6, step: u, feel: "happy"}); },
  "King Phanthumati": s15Who("noble", MAENG_KING), "Princess Sima": s15Who("lady", MAENG_SIMA), "The king's man": s15Who("fellow", MAENG_HERALD),
  "The Haw traders": creditMany([[-60, function () { person(0, 0, maengTrader(0, {wai: true, face: 1, id: "bow-trader0"})); }],
                              [60, function () { person(0, 0, maengTrader(1, {wai: true, face: 1, id: "bow-trader1"})); }]]),
  "The Righteous King": s15Who("noble", MAENG_KING_THUKKHATA), "Bua-kham": s15Who("buakham"),
  // the maker's people
  "Boy": s15Who("boy"), "Girl": s15Who("girl"), "Lady": s15Who("lady"), "Young man": s15Who("fellow"), "Villager": s15Who("villager"),
  "Chiang Mai lad": s15Who("farmer"), "Prince": s15Who("noble"), "Maiden": s15Who("maiden"), "Grandmother weaver": s15Who("weaver", {hair: "#e8e3da", age: 1}),
  "Grandfather": s15Who("elder"), "Grandmother": s15Who("grandmother"), "Old farmer": s15Who("oldfarmer"),
  "Grandmother to the temple": s15Who("devotee"), "Dancer": s15Who("dancer"), "Celestial": s15Who("celestial"), "Drummer": s15Who("drummer"),
  "Scientist": s15Who("scientist"),
  "Inta, Khammun, Bua-kham": creditMany([[-90, s15Who("inta")], [0, s15Who("khammun")], [90, s15Who("buakham")]]),
  "Sinuan, Bunma, Dokkham": creditMany([[-80, s15Who("sinuan")], [0, s15Who("bunma")], [70, s15Who("dokkham")]]),
  // the maker's creatures and things
  "Dog": function (b, u) { dog(0, 0, u * 2); }, "Rooster": function (b, u) { rooster(0, 0, u * 2); },
  "Naga": function () { naga(0, -60, {size: 0.5, heads: 5}); }, "Dragon": function () { dragon(0, -80, {size: 0.4, breath: 0.5}); },
  "Mom": function (b, u) { mom(0, 0, {size: 0.6, step: u}); }, "Phaya Luang": function () { luang(0, 0, {size: 0.4}); },
  "Sun": function (b, u) { sun(0, -60, u * 2); }, "Birds": function (b, u) {                         // the kit's flock is drawn in its dark ink, which the night hides: here in the credits' own
    b.save(); birds(u * 2, 0, -60); b.globalCompositeOperation = "source-in"; b.fillStyle = CREDIT_INK; b.fillRect(-400, -400, 800, 800); b.restore();
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
  "Star and lotus lanterns": creditMany([[-80, function () { khomDao(0, -300, {lit: 0, sway: 0}); }], [80, function () { khomBua(0, -300, {lit: 0}); }]]),
  "Hand lantern": function () { khomThue(0, -200, {size: 1, lit: 0}); },
  "Tung sai mu": function (b, u) { tungSaiMu(b, 0, 0, 1.3, u * 2, 7, 7); }, "Tung yai": function (b, u) { tungYai(b, 0, 0, 0.8, u * 2); },
  "Red truck": creditSmall(0.6, function (b) { rotDaeng(b, 0, 0, 1, 0, 1, function () {}); }),
  "Elephant": function (b, u) { elephant(0, 0, {size: 0.35, step: u}); }, "Tiger": function (b, u) { tiger(0, 0, {size: 0.6, step: u}); },
  "Cat": function (b, u) { cat(0, 0, {size: 1, step: u}); }, "Pig": function (b, u) { pig(0, 0, {size: 0.8, step: u}); },
  "Pack horse": function (b, u) { horse(0, 0, {size: 0.75, step: u, pack: true}); },
  "House and field mice": creditMany([[-40, function (b, u) { mouse(0, 0, {kind: "house", size: 1.1, step: u}); }],
                                   [40, function (b, u) { mouse(0, 0, {kind: "field", size: 1.1, step: u}); }]]),
  "Tokay gecko": function (b, u) { gecko([[-90, 0], [90, 0]], 150 + 20 * u, {size: 1, t: u}); },
  "Green peafowl": function (b, u) { peafowl(0, 0, u, {size: 0.6, display: 1, shiver: 0.5}); },
  "Mrs Hume's pheasant": function (b, u) { pheasant(0, 0, u, {size: 0.9, step: u}); },
  "Sunbird": function (b, u) { sunbird(0, 0, u / 13, {size: 2.4, hover: 1}); },
  "Blue magpie": function (b, u) { blueMagpie(0, 0, u, {size: 0.9, fly: true}); }, "Hornbill": function (b, u) { hornbill(0, 0, u, {size: 0.7, fly: true}); },
  "Maeng Si Hu Ha Ta": function (b, u) { maengSiHuHaTa(0, 0, {size: 0.6, step: u}); },
  "Fire, rice steamer": creditMany([[-70, function (b, u) { campfire(b, 0, 0, 1, u * 2, {light: 0}); }], [70, function (b, u) { huad(b, 0, 0, 1, u * 2, {fire: 1}); }]]),
  // the maker's houses and places
  "House": function (b) { house(b, 0, 0, 0.6); },
  "Trees, palm, banana": creditSmall(0.5, creditMany([[-260, function (b) { tree(b, 0, 0, 1.1); }], [0, function (b) { palm(b, 0, 0, 400); }], [220, function (b) { banana(b, 0, 0); }]])),
  "Temple": creditSmall(0.5, function (b) { temple(b, 0, 0); }), "Giant": function (b) { yak(b, 0, 0, 1); },
  "Water jar": function (b) { namton(b, 0, 0, 1.2); }, "Tung": creditSmall(0.5, function (b) { tung(b, 0, 0, 0, true); }),
  "Great drum": function (b) { drumCart(b, 0, 0, 0.5, 1); }, "Granary": function (b) { longKhao(b, 0, 0, 0.6); },
  "Sawian": function (b) { sawian(b, 0, 0, 1.2); }, "Hut": function (b) { tub(b, 0, 0, 1.4); },
  "Ho Kham": function (b) { hoKham(b, 0, 0, 0.45, {part: "back", pediment: "peacock"}); hoKham(b, 0, 0, 0.45, {part: "front", pediment: "peacock"}); },
  "Rice basket, basket": creditMany([[-50, function (b) { kongKhao(b, 0, 0, 1.1); }], [50, function (b) { krabung(b, 0, 0, 1.1); }]]),
  "Mortar": function (b) { mortar(b, 0, 0, 1.1); }, "Ta laew": function (b) { taLaew(b, 0, 0, 1.1); },
  "Hen, black chickens": creditMany([[-80, function (b, u) { rooster(0, 0, u * 2, {hen: true}); }], [0, function (b, u) { rooster(0, 0, u * 2, {black: true}); }],
                                  [80, function (b, u) { rooster(0, 0, u * 2, {black: true, hen: true}); }]]),
  "Cattle egret": function (b, u) { egret(0, 0, u, {size: 1, peck: 0.5 + 0.5 * Math.sin(u * Math.PI * 2)}); },
  "Native fish": creditMany([[-60, function (b, u) { nativeFish(b, 0, -60, 1.6, 1, "gourami", u); }], [60, function (b, u) { nativeFish(b, 0, -40, 1.6, 1, "barb", u); }],
                          [-60, function (b, u) { nativeFish(b, 0, -10, 1.6, 1, "flying", u); }], [60, function (b, u) { nativeFish(b, 0, 10, 1.6, 1, "snakehead", u); }]]),
  "Bamboo house": function (b) { ruenPhuk(b, 0, 0, 1); },
  "Grass, bananas": creditMany([[-50, function (b) { grassBundle(b, 0, -45, 1.2, {tied: true}); }], [50, function (b) { bananas(b, 0, -18, 1.2, {count: 5, ripe: 0.8}); }]]),
  "Fire stick": function (b) { fireStick(b, [-60, 0], [60, -12], {hot: 0.6}); },
  "Eastern barn owl": function (b, u) { barnOwl(0, 0, u * 2, {size: 1}); },
  "Atlas moth": function (b, u) { atlasMoth(0, -80, u, {size: 0.42}); },
  "Bats": function (b, u) { batStream(u * 3, {from: [-90, -170], to: [90, -40], count: 12, every: 0.25, long: 3, size: 1.6, far: 0.6, spread: 50}); },
  "Fireflies": function (b, u) { farFireflies(u * 4, {box: [-90, -170, 90, -10], count: 24}); },
  "Pen, gong, firewood, cave": creditMany([[-70, function (b) { gong(b, 0, 0, 1.1); }], [70, function (b) { firewood(b, 0, -8, 1.1, {loose: true}); }]])
};


// The night over the mountain while the credits roll (owner, 2026-10-21: "do the moth, the fireflies, the owl, maybe a
// common bat and add them to the credits", then "Add a Moon and clouds and change the color of the owl when it is in
// or out of moon light and show its silouette as it crosses the moon"; the bats "fly behind hills or get smaller and
// fade out"; the fireflies "subtle and distant in the background"). All of it is under the veil, as the mountain is.
var S15_MOON = [1610, 150, 58];                      // the moon: its middle and its radius, high at the right
var S15_OWLS = [                                     // [from, to, fly, path: [x, y, size] at its start and its end]
  [12, 26, "side", [[-160, 330, 0.75], [2100, 90, 0.75]]],      // across the sky and over the moon's face
  [70, 82, "front", [[700, 260, 0.3], [260, 900, 1.1]]],        // gliding toward us, then on down and out past the frame's foot
  [118, 130, "side", [[2080, 210, 0.75], [-160, 320, 0.75]]]    // back the other way, over the far hills
];
var S15_PERCH = [150, 195];                           // the owl on a branch at the upper left, to the end
var S15_BATS = [[34, [1790, 50], [1080, 560]], [96, [1820, 110], [1200, 560]], [158, [1760, 40], [1000, 540]]];   // [start, from, to]: across the moon's face and down behind the near ridge
var S15_MOTHS = [[86, 98, [1960, 760], [1500, 640]], [138, 150, [-60, 700], [420, 620]]];   // [from, to, where from, where to]

// o: one of S15_OWLS; t: seconds; moon: what nightMoon() gave back (for its light). Gives back nothing: it draws
// with pen, and nothing outside o's seconds. e.g. s15Owl(S15_OWLS[0], 20, moon);
// A "front" owl does not stop at the end of its path: it carries on at the same pace and heading, nearer still, until it
// has gone past the frame's foot (owner, 2026-10-22: "an owl that disappears that should go down to the bottom of the
// screen and go off it"; its glide ended at y 900, still in the picture, and it was gone).
function s15Owl(o, t, moon) {                        // one of S15_OWLS, at second t of its flight
  if (t < o[0] || (t > o[1] && o[2] !== "front")) { return; }
  var u = (t - o[0]) / (o[1] - o[0]), a = o[3][0], b = o[3][1];
  var x = mix(a[0], b[0], u), y = mix(a[1], b[1], u) - (o[2] === "side" ? 60 * Math.sin(Math.PI * u) : 0);
  var size = u <= 1 ? mix(a[2], b[2], u * u) : b[2] + (b[2] - a[2]) * (u - 1);   // past its path's end, growing as it comes on
  if (y - 260 * size > 1080) { return; }             // gone past the frame's foot
  barnOwl(x, y, t, {fly: o[2], size: size, face: b[0] < a[0] ? -1 : 1, lit: moonLight(x, y, moon), moon: moon});
}

// t: seconds. Draws the moon (S15_MOON), the clouds and the "side" owls with pen; gives back the moon, as
// nightMoon() gives it. e.g. var moon = s15NightSky(t);
function s15NightSky(t) {                             // behind the far hills: the moon, the clouds, the owl in flight
  var moon = nightMoon(S15_MOON[0], S15_MOON[1], S15_MOON[2]);
  cumulus(pen, t, CLOUD_LOOKS.night);
  S15_OWLS.forEach(function (o) { if (o[2] === "side") { s15Owl(o, t, moon); } });   // high, behind the hills
  return moon;
}

// The bats over the veil, so it does not dim them away (owner, 2026-10-21: "I don't see the bats. Are they hidden
// behind a layer?": they were, dark on the dark sky under it), on a sheet of their own with the near ridge cut out of
// it, so they still go behind the hills; moonlit grey, larger, every stream across the moon's face.
var S15_BAT_SHEET = null;
// t: seconds; front: the sheet of the near ridge to cut them out by (the mountain's frontNight). It makes
// S15_BAT_SHEET (pen's canvas size) on its first call and draws on it with pen pointed there, then lays it over the
// picture; pen is given back as it was. Gives back nothing. e.g. s15NightBats(t, mountain.frontNight);
function s15NightBats(t, front) {
  if (!S15_BAT_SHEET) {
    S15_BAT_SHEET = document.createElement("canvas");
    S15_BAT_SHEET.width = pen.canvas.width;
    S15_BAT_SHEET.height = pen.canvas.height;
  }
  var sheet = S15_BAT_SHEET.getContext("2d"), keep = pen;
  sheet.setTransform(1, 0, 0, 1, 0, 0);
  sheet.clearRect(0, 0, S15_BAT_SHEET.width, S15_BAT_SHEET.height);
  sheet.setTransform(pen.getTransform());
  pen = sheet;
  S15_BATS.forEach(function (b) { batStream(t, {start: b[0], from: b[1], to: b[2], count: 60, every: 0.15, long: 9, size: 2.4, far: 0.5, spread: 50, colour: "#5c536c"}); });
  pen = keep;
  sheet.globalCompositeOperation = "destination-out";   // the near ridge, cut out: behind it they are gone
  sheet.drawImage(front, 0, 0);
  sheet.globalCompositeOperation = "source-over";
  pen.save();
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.drawImage(S15_BAT_SHEET, 0, 0);
  pen.restore();
}

// t: seconds; moon: as s15NightSky() gave it. Gives back nothing: it draws with pen (the perched owl from
// S15_PERCH[0], the moths of S15_MOTHS, the "front" owl). e.g. s15NightNear(t, moon);
function s15NightNear(t, moon) {                      // in front of the mountain: the fireflies on its slopes, a moth, the perched owl
  farFireflies(t, {box: [0, 820, WIDE, 1070], count: 70});
  S15_OWLS.forEach(function (o) { if (o[2] === "front") { s15Owl(o, t, moon); } });   // coming down toward us, in front of the mountain
  S15_MOTHS.forEach(function (m) {
    if (t < m[0] || t > m[1]) { return; }
    var u = (t - m[0]) / (m[1] - m[0]), x = mix(m[2][0], m[3][0], creditEase(u * 1.6)) + 40 * Math.sin(t * 2.1), y = mix(m[2][1], m[3][1], u) + 30 * Math.sin(t * 2.9);
    if (u > 0.62) { x += (m[3][0] < m[2][0] ? -1 : 1) * 1400 * (u - 0.62) * (u - 0.62); y -= 900 * (u - 0.62) * (u - 0.62); }   // it rests a moment, then flutters off and up
    // and as it flutters away it grows smaller, to nothing, by the end of its seconds (owner, 2026-10-22: "a moth that
    // disappears. It should slowly shrink into nothingness"; it was gone at its full size)
    var size = 0.42 * (1 - creditEase((u - 0.62) / 0.38));
    if (size > 0.004) { atlasMoth(x, y, t, {size: size, turn: 0.3 * Math.sin(t * 1.3), lit: moonLight(x, y, moon)}); }
  });
  if (t >= S15_PERCH[0]) {
    var come = creditEase((t - S15_PERCH[0]) / 1.5);     // the branch reaches in from the frame's left, the owl on it
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

// Scene 15, the entry the film calls (SCENES): t, its own second, 0 to S15_LONG (195 s): the night over the mountain;
// the roll of s15Rows() from S15_ROLL[0] (3 s) until the end is held at S15_ROLL[1] (174 s), each "pair" row's
// figures bowing as it passes (creditBow()); the words go at S15_THANKS[0] (177.5 s) for the pandas' thanks; into black
// from 192.6 s. Gives back nothing: it draws the whole sheet with pen. On the first call it adds backNight and
// frontNight to MAENG_MOUNTAIN. From sets.js: maengMountain(), maengTinted(), maengSky("night"), MAENG_NIGHT,
// maengDark(), maengPerson() and maengTrader() (the figures); from thanks.js MAENG_THANKED and MAENG_SCHOLARS. No
// words are said: S15_LINES is empty. e.g. sceneCredits(60);
// Its z plan (oldcartoon.js, Z): no one stands on its ground, so nothing is sorted by drawByZ: it is painted in fixed
// layers from the back: the night sky with the moon, the clouds and the far owl (s15NightSky), the mountain, what is in
// front of it (the fireflies on its slopes, the near owl, the moths, the perched owl: s15NightNear), the veil for the
// words, the bats over it all but cut out behind the near ridge, the rolling words with their bowing figures, and the
// pandas' thanks.
function sceneCredits(t) {
  var mountain = maengMountain();
  if (!mountain.backNight) {                         // the mountain by night, as the yard is at night
    mountain.backNight = maengTinted(mountain.back, MAENG_NIGHT[0], 0.7);
    mountain.frontNight = maengTinted(mountain.front, MAENG_NIGHT[0], 0.75);
  }
  pen.drawImage(maengSky("night"), 0, 0);
  var moon = s15NightSky(t);
  pen.drawImage(mountain.backNight, 0, 0);
  pen.drawImage(mountain.frontNight, 0, 0);
  s15NightNear(t, moon);
  pen.fillStyle = "rgba(4, 6, 20, 0.45)";            // a veil, so the words read over the mountain
  pen.fillRect(0, 0, WIDE, 1080);
  s15NightBats(t, mountain.frontNight);
  // The roll: the first row comes in at the foot of the frame at S15_ROLL[0], and the end's middle reaches the
  // middle of the frame at S15_ROLL[1], and stays.
  creditRoll(t, s15Rows(), S15_ROLL, S15_THANKS[0], S15_FIGURES);
  creditThanks(t, S15_THANKS, S15_WAIS, S15_THANK_YOU);
  maengDark(t, S15_LONG - 2.4, S15_LONG + 10);
  maengDark(t, -10, 0);
}
