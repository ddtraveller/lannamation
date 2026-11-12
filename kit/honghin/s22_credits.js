// s22_credits.js - scene 22 of the film of Hong Hin: the credits (120 s). Varanasi by night, where the tale began, the
// moon over the palace roofs and the lamps on the gate, and the credits rolling up over it (credits.js, as the first three
// tales'): who made the film, the voice that tells it, the tale's people each coming out to bow, where the tale comes
// from and what made its sounds; last the end, held, and the thanks to the voice, the three pandas rising to wai.
// The owner, 2026-11-12: "add the credits".
var H22_LONG = 120;
var H22_SOUND = {calls: []};
var H22_LINES = [];                                    // no words are said: music alone
var H22_ROLL = [3.0, 101.0];                           // the credits come up from below the frame, and the end stops
var H22_THANKS = [104.5, 106.0];                       // the roll's words go, and the pandas have come up
var H22_WAIS = [[107.0, 108.0, 109.0], [111.5, 111.5, 111.5], [115.0, 115.0, 115.0]];   // when each of the three bows
var H22_THANK_YOU = ["ขอบคุณหลาย ๆ เจ้า", "Thank you, Amornrat Jaijar, for the voice of this tale"];

// What rolls (credits.js, creditRow()). The Lanna titles are the film's own (sets.js HH_SERIES, HH_STORY). A Thai name
// is the script's (story.py); where the script has none, the row gives the name in English only.
var H22_ROWS = [
  ["title", HH_SERIES, "Lanna Tales"],
  ["title", HH_STORY, "Hong Hin, the Stone Swan"],
  ["gap"],
  ["head", "ภาพเคลื่อนไหว", "Animation"],
  ["line", "lannamation"],
  ["line", "https://github.com/ddtraveller/lannamation"],
  ["line", "Claude AI (Anthropic)"],
  ["gap"],
  ["head", "เสียงเล่าเรื่อง", "Narrator (AI voice)"],
  ["line", "อมรรัตน์ ใจจา · Amornrat Jaijar"],
  ["small", "a computer voice made from her own recordings"],
  ["gap"],
  ["head", "คำเมือง", "The Kam Mueang"],
  ["line", "a first draft by Claude, in Amornrat Jaijar's spellings"],
  ["small", "not yet checked by a native speaker"],
  ["gap"],
  ["head", "ตัวละคร", "The cast"],
  ["pair", ["หงส์หิน", "Hong Hin", "the boy, born of suffering"], ["พระอินทร์", "Indra", "who raised him in heaven"]],
  ["pair", ["นางวิมาลา", "Vimala", "the chief queen, his mother"], ["พระเจ้าปุรันตปะ", "King Purantapa", "of Varanasi"]],
  ["pair", ["", "The six wives", "who stole the child"], ["", "Their six sons", "the brothers"]],
  ["pair", ["ย่ายักษ์เถ้า", "The old giantess", "under the palm at the south gate"], ["ยักษ์ผีดิบ", "The ghouls", "who eat their meat raw"]],
  ["pair", ["พญายักษ์วัสสะวโร", "King Wassawaro", "and his daughter Mukhawadi"], ["พญากุมภัณฑ์", "King Kumbhanda", "and his daughter Culakantha"]],
  ["pair", ["", "King Anumat", "and his daughter Salicanta"], ["", "The old queen", "the king's mother, twenty years with the ghouls"]],
  ["pair", ["เหมะราช", "The Hemmarat", "that swallows elephants"], ["หงส์หิน", "The stone swan", "and Kanchai, the sword"]],
  ["gap"],
  ["head", "นิทาน", "The tale"],
  ["line", "ค่าวหงส์หิน, the khao so of Hong Hin"],
  ["small", "by Chao Suriyawong (1901, printed 1917), with the palm-leaf Jataka where the two agree"],
  ["small", "the names are the khao so's, as the research notebook quotes them; told as the old text tells it"],
  ["gap"],
  ["head", "ดนตรีและเสียง", "Music and sounds"],
  ["line", "music made from numbers by the kit"],
  ["small", "crickets, wind, the roars and the swan's plates made from numbers too"],
  ["small", "rooster and barn owl by MOSS-SoundEffect (OpenMOSS-Team, Apache-2.0)"],
  ["small", "white-rumped shama: Utain Pummarin · cicadas at Chom Thong: Wich'yanan (Jay) Limparungpatthanakij;"],
  ["small", "both CC BY 4.0, iNaturalist · frogs at Chom Thong: golo.foellmer (radio aporee), public domain"],
  ["small", "elephant: Thagavaluzhavan, CC0 (Wikimedia Commons)"],
  ["gap"],
  ["head", "สมุดค้นคว้า", "The research notebook, open to read (Google asks for a sign-in)"],
  ["small", "Hong Hin · notebooklm.google.com/notebook/fd40508c-6881-466e-9027-a913e471248d"],
  ["gap"],
  ["head", "ตัวอักษร", "Letters"],
  ["line", "Noto Sans Tai Tham and Noto Serif Thai (SIL Open Font License)"],
  ["small", "Lanna spellings by the rules of krueng.ai's Kam Mueang alphabet; not yet checked by a native speaker"],
  ["gap"],
  ["end", "ᩁᩰᩫ᩠ᨦᨿᩉ᩠ᨶᩢᨦᨩᩦᩅᩥ᩠ᨲᨧ᩶ᩣ᩻", "Slow Life Studios", "แล้วปะกั๋นใหม่เจ้า · See you again",
   "animated with lannamation: https://github.com/ddtraveller/lannamation"]
];

// A person of the film making a wai, as a painter for H22_FIGURES (at 0, 0). look: what welPerson() gives back or the
// look itself. e.g. "Vimala": h22Who(function () { return hhVimala({wai: true}); })
function h22Who(make) {
  return function () { person(0, 0, Object.assign(make(), {wai: true, feel: "happy", face: 1, holding: null})); };
}
function h22Ogre(kind, size) {
  return function (b, u) { ogre(0, 0, u * 2, {kind: kind, id: "bow-" + kind, face: 1, size: size || 1.1, wai: true, feel: "happy"}); };
}
// The figures that bow beside the "pair" rows (credits.js creditBow()), by their English names.
var H22_FIGURES = {
  "Hong Hin": h22Who(function () { return welPerson("fellow", Object.assign({}, HH_BOY_CROWNED, {size: 0.66}), {id: "bow-boy"}); }),
  "Indra": function (b, u) { indra(0, 0, u * 2, {pose: "stand", id: "bow-indra", face: 1, size: 1.1, feel: "happy", ground: false}); },
  "Vimala": h22Who(function () { return hhVimala({id: "bow-vimala"}); }),
  "King Purantapa": h22Who(function () { return welPerson("noble", HH_KING, {id: "bow-king", size: 0.8}); }),
  "The six wives": creditMany([-90, 0, 90].map(function (dx, n) { return [dx, h22Who(function () { return hhWife(n, {id: "bow-wife" + n}); })]; })),
  "Their six sons": creditMany([-90, 0, 90].map(function (dx, n) { return [dx, h22Who(function () { return hhSon(n, {id: "bow-son" + n}); })]; })),
  "The old giantess": h22Ogre("giantess", 1.0),
  "The ghouls": creditMany([[-100, h22Ogre("ghoul", 0.8)], [0, h22Ogre("ghoulPale", 0.8)], [100, h22Ogre("ghoulDark", 0.8)]]),
  "King Wassawaro": creditMany([[-70, h22Ogre("king", 1.0)], [80, h22Who(function () { return ogreDaughter("mukhawadi", {size: 0.8, id: "bow-mukhawadi"}); })]]),
  "King Kumbhanda": creditMany([[-70, h22Ogre("mural", 1.0)], [80, h22Who(function () { return hhDaughter("culakantha", {size: 0.8, id: "bow-culakantha"}); })]]),
  "King Anumat": creditMany([[-70, h22Ogre("forest", 1.0)], [80, h22Who(function () { return ogreDaughter("salicanta", {size: 0.8, id: "bow-salicanta"}); })]]),
  "The old queen": h22Who(function () { return welPerson("grandmother", HH_OLD_QUEEN, {id: "bow-gran"}); }),
  "The Hemmarat": function (b, u) { hemmarat(0, -60, {size: 0.4, face: 1}); },
  "The stone swan": function (b, u) { hongHin(-20, -160, u * 2, {size: 0.9, face: 1}); kanchai(150, 0, {size: 0.4, angle: 0.3}); }
};

// Varanasi by night under the credits (sets.js hhCityNight()), a veil so the words read. t: seconds.
function h22Night(t) {
  hhCityNight(t);
  pen.fillStyle = "rgba(4, 6, 20, 0.5)";
  pen.fillRect(0, 0, WIDE, 1080);
}

// Scene 22, the entry the film calls (SCENES): t, its own second, 0 to H22_LONG: Varanasi by night; the roll of H22_ROWS
// from H22_ROLL[0] until the end is held at H22_ROLL[1], each "pair" row's figures bowing as it passes; the words go at
// H22_THANKS[0] for the pandas' thanks; into black at the end. From credits.js creditRoll(), creditThanks(), creditMany().
function hhSceneCredits(t) {
  h22Night(t);
  creditRoll(t, H22_ROWS, H22_ROLL, H22_THANKS[0], H22_FIGURES);
  creditThanks(t, H22_THANKS, H22_WAIS, H22_THANK_YOU);
  if (t > H22_LONG - 2.4) {
    pen.fillStyle = "rgba(0, 0, 0, " + clamp((t - (H22_LONG - 2.4)) / 2).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
  welFadeIn(t, 1.5);
}
