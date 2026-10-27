// s01_doi.js - scene 1 of the film of the creature with four ears and five eyes: Doi Khao Khwai, before
// dawn (30 s). Out of the dark, the mountain over its forest and its mist, the sky going pale behind it; the
// title; the voice begins the tale; the camera comes slowly in on the cave in the mountain's side, and in its
// dark five green eyes open, blink once, and close. Its mist, as mountain mist lies at dawn: a sea of it in the
// valleys between the far ranges, its top lit by the sunrise; a band drifting at the mountain's foot; one lying
// along its side below the cave; and the film opens inside a thick fog that sinks and thins over the first
// twelve seconds, so the mountain comes out of it under the title.
var S01_LONG = 36.27;   // 30 until 2026-10-24: 6.27 s inserted for the narrator's own reading (scene_retime.py)
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets of the hour before dawn, gone before the howl.
var S01_SOUND = {calls: [[0, "crickets", 0.35, 28.27]]};
var S01_LINES = [[8.0, 12.55, "M001"], [12.75, 18.7, "M002"], [18.9, 25.87, "M003"], [26.07, 31.53, "M004"]];
// Its sound (owner, 2026-10-19: "where was the howl?"): when the tale has been named, the creature howls once from
// its cave, far off on the mountain (sounds.py, maeng-base), and the howl fades as the film goes on. Heard only:
// nothing of the scene is drawn for it (feelings.py --film lays the calls of a scene's life into the film's sound).
var S01_LIFE = [
  {name: "the creature's howl, far off", kind: "flock", z: "sky", course: [[0, -999, -999], [0.1, -999, -999]],
   calls: [[30.77, "maeng-base", 0.87]]}
];

// The titles over the opening, in the fog (owner, 2026-10-19: text over the first seconds, "the story name and
// series title name ... just write it in the fancy kam muang script and then the story name"): the series, Lanna
// Tales (นิทานล้านนา, as the voice project's writer has it), in the Lanna script alone, gold; then the tale's name
// in the Lanna script under it, with its English small beneath for those who do not read it. Both written by the
// Kam Mueang alphabet's own rules (alphabet.js lanna(); ทาน from its Wiktionary list), not yet checked by a native
// speaker. The page loads Noto Sans Tai Tham for them.
var S01_SERIES = "ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ";                     // นิทานล้านนา, Lanna Tales
var S01_STORY = "ᨾᩯ᩠ᨦᩈᩦ᩵ᩉᩪᩉ᩶ᩣᨲᩣ";                   // แมงสี่หูห้าตา, the creature with four ears and five eyes

// t: the scene's second (seen from 1.2 s to 7.6 s). Gives back nothing: it writes S01_SERIES and S01_STORY with pen,
// over the whole sheet with no camera. e.g. s01Title(t);
function s01Title(t) {                              // the series, then the tale, faded in and out over the fog
  var series = between(t, 1.2, 2.4) * (1 - between(t, 6.6, 7.6)), story = between(t, 3.4, 4.6) * (1 - between(t, 6.6, 7.6));
  if (series <= 0) { return; }
  pen.save();
  pen.textAlign = "center";
  pen.shadowColor = "rgba(255, 196, 90, 0.7)";
  var gold = pen.createLinearGradient(0, 180, 0, 440);
  gold.addColorStop(0, "#fff1c0");
  gold.addColorStop(0.5, "#e8b84a");
  gold.addColorStop(1, "#b07a22");
  pen.fillStyle = gold;
  pen.globalAlpha = series;
  pen.shadowBlur = 22;
  pen.font = "700 92px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
  pen.fillText(S01_SERIES, WIDE / 2, 250);
  pen.shadowBlur = 8;
  pen.strokeStyle = "rgba(255, 230, 170, 0.8)";        // a fine flourish between the series and the tale
  pen.lineWidth = 2;
  var reach = 260 * between(t, 2.0, 3.6);
  pen.beginPath();
  pen.moveTo(WIDE / 2 - reach, 312); pen.quadraticCurveTo(WIDE / 2, 322, WIDE / 2 + reach, 312);
  pen.stroke();
  if (story > 0) {
    pen.globalAlpha = story;
    pen.shadowBlur = 26;
    pen.font = "700 124px 'Noto Sans Tai Tham', 'Sans Serif Collection', serif";
    pen.fillText(S01_STORY, WIDE / 2, 440);
    pen.shadowBlur = 0;
    pen.font = "italic 42px Georgia, 'Times New Roman', serif";
    pen.fillStyle = "#fff6dc";
    pen.fillText("The Creature with Four Ears and Five Eyes", WIDE / 2, 530);
  }
  pen.restore();
}

// t: the scene's second (seen from 24.5 s to 28.5 s); drawn at MAENG_CAVE, under the scene's camera. Gives back
// nothing: it draws with pen. e.g. s01Eyes(t);
function s01Eyes(t) {                               // five green eyes in the cave's dark: they open, blink once, close
  var open = between(t, 30.77, 31.57) * (1 - between(t, 33.87, 34.77));
  if (open <= 0 || (t > 32.57 && t < 32.77)) { return; }
  var at = [MAENG_CAVE[0] + 2, MAENG_CAVE[1] - 27], star = [[0, -11], [-12, -4], [12, -4], [-7, 4], [7, 4]];
  star.forEach(function (one) {
    pen.fillStyle = "rgba(170, 255, 110, " + (0.25 * open).toFixed(3) + ")";
    pen.beginPath();
    pen.arc(at[0] + one[0], at[1] + one[1], 3.4, 0, 7);
    pen.fill();
    pen.fillStyle = "rgba(190, 255, 120, " + open.toFixed(3) + ")";
    pen.beginPath();
    pen.ellipse(at[0] + one[0], at[1] + one[1], 1.7, 1.7 * open, 0, 0, 7);
    pen.fill();
  });
}

// Scene 1, the entry the film calls (SCENES): t, its own second, 0 to S01_LONG (30 s). Gives back nothing: it draws
// the whole sheet with pen and leaves it as it found it. From sets.js: maengMountain(), maengSky("night"/"dawn"),
// MAENG_CLOUDS.dawn, MAENG_CAVE, MAENG_DAWN. Its words are S01_LINES (M001 to M004, 8 s to 24 s), written under it
// by the page (maengSubtitles); S01_SOUND and S01_LIFE are heard only. e.g. sceneDoi(12);
// Its z plan (oldcartoon.js, Z): nothing stands on the ground here, so nothing is sorted by drawByZ: all of it is the
// set, painted from the back to the front (the skies with their stars, moon and clouds, the far ranges, the sea of mist,
// the bats, the mountain, the cave, the eyes in its dark, the bushes before it, the low mist, the fog), then the titles
// over it. Its
// life is only the howl's sound, in "sky", drawn by nothing.
function sceneDoi(t) {
  var mountain = maengMountain(), light = between(t, 0, S01_LONG);
  var day = 0.6 * light * light * (3 - 2 * light), dawn = MAENG_DAWN[1] * (1 - day);   // the sun coming up behind the mountain
  var u = Math.pow(between(t, 15.15, 34.27), 1.6), push = 1 + 0.42 * u;   // the slow push in, the cave coming to the middle
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(push, push);
  pen.translate(-mix(WIDE / 2, MAENG_CAVE[0], u), -mix(540, MAENG_CAVE[1], u));
  pen.drawImage(maengSky("night"), 0, 0);
  // the night's stars, many and fine, a few bright and twinkling, and the moon (scenery.js; owner, 2026-10-26: "some
  // nice stars to the night", "get rid of the milky way", "Maybe re-add the moon"), going as the dawn comes
  sceneryStars(t, {band: null, horizon: 760, count: 1600, bright: 30, glow: "240, 150, 70", alpha: 1 - light});
  sceneryMoon(t, 1480, 190, 44, {alpha: 1 - light});
  pen.globalAlpha = 0.25 + 0.75 * light;            // the dawn comes up behind the stars
  pen.drawImage(maengSky("dawn"), 0, 0);
  pen.globalAlpha = 1;
  sceneryClouds(t + 30, {light: "night", count: 4, top: 120, bottom: 380, wide: [300, 560], seed: 4, alpha: 1 - light});   // soft clouds, moonlit,
  sceneryClouds(t + 30, {light: "dawn", count: 4, top: 120, bottom: 380, wide: [300, 560], seed: 4, alpha: light});       // then lit by the dawn
  natRays(t, 1205, 360, 0.5 * between(t, 16, 30), "255, 214, 160", 3);   // the sun coming up behind the mountain: its rays in the sky, the mountain before them (wildplaces.js)
  pen.drawImage(mountain.backDawn, 0, 0);
  pen.globalAlpha = day;
  pen.drawImage(mountain.back, 0, 0);
  pen.globalAlpha = 1;
  var glow = blend("#b9a6c8", "#f6c9a0", light);    // the mist's top: grey-violet in the dark, warm as the sun comes up
  mistSea(pen, t, {level: 760, left: 0, right: WIDE, deep: 150, swell: 14, wave: 150, drift: 4, layers: 3, colour: "#efe8f2",
                   glow: glow, seed: 7, alpha: 0.85});   // the sea of mist in the valleys between the far ranges
  mistDrift(pen, t, {left: 0, right: WIDE, top: 620, bottom: 760, count: 5, drift: 10, seed: 3, alpha: 0.6});
  // bats, between the far ridges and the mountain (owner, 2026-10-26: "add some bats that fly behind the mountain"): a
  // stream rising from behind its peak into the sky (a second, crossing the far ridges from the right, went: owner,
  // 2026-10-26, of the render: "get rid of the second set of bats")
  batStream(t, {from: [1180, 560], to: [380, 120], start: 3, count: 26, size: 1.7, far: 0.55, spread: 90, colour: "#2c2638", long: 11});
  // a barn owl going home to roost at the night's end, across the moon as the fog thins (night.js; the beauty pass,
  // owner, 2026-10-27; the eastern barn owl hunts the fields by night: nature_research.md)
  if (t > 5 && t < 14) { barnOwl(mix(1820, 1080, (t - 5) / 9), 205 + 18 * Math.sin(t * 0.9), t, {fly: "side", face: -1, size: 0.55, lit: 0.3}); }
  pen.drawImage(mountain.frontDawn, 0, 0);
  pen.globalAlpha = day;
  pen.drawImage(mountain.front, 0, 0);
  pen.globalAlpha = 1;
  mistBand(pen, 860, 770, 900, t, {tilt: -0.2, colour: "#efe8f2", glow: glow, seed: 9, alpha: 0.7});   // along the mountain's side, below the cave
  // the cave, made new among mossy limestone (scenery.js sceneryCave(); owner, 2026-10-26: "Make new cave rocks, too"),
  // the eyes in its dark, and bushes before its foot, in the dawn's light
  sceneryCave(pen, MAENG_CAVE[0], MAENG_CAVE[1], 0.99, {t: t, rock: "#7a7468", tint: [MAENG_DAWN[0], dawn]});
  s01Eyes(t);
  var bushes = thkOnce("maeng-cave-bushes", maengCaveBushesBuild);
  sceneryBeds(t, bushes.day, {sway: 0.2});
  pen.globalAlpha = dawn;
  sceneryBeds(t, bushes.dawn, {sway: 0.2});
  mistDrift(pen, t, {left: 0, right: WIDE, top: 880, bottom: 1000, count: 4, wide: 640, drift: 7, seed: 4, alpha: 0.65});
  var lifts = between(t, 1, 13.15);                    // the fog the film opens in: it sinks and thins, and the mountain comes out
  if (lifts < 1) {
    var veil = pen.createLinearGradient(0, 0, 0, 1080), thick = 0.82 * (1 - between(t, 1, 9));   // a veil over all of it, thinning
    veil.addColorStop(0, "rgba(214, 206, 226, " + (thick * 0.7).toFixed(3) + ")");
    veil.addColorStop(1, "rgba(236, 230, 240, " + thick.toFixed(3) + ")");
    pen.fillStyle = veil;
    pen.fillRect(-WIDE, -1080, 3 * WIDE, 3 * 1080);
    mistDrift(pen, t, {left: -200, right: WIDE + 200, top: mix(120, 860, lifts), bottom: 1080, count: 9, wide: 900, drift: 6,
                       seed: 11, glow: glow, alpha: 0.95 * (1 - lifts)});
  }
  pen.restore();
  // the frame, soft and before the camera (the beauty pass, owner, 2026-10-27): the cogon grass of the cold season,
  // its white plumes; it comes out of the fog with the mountain, dark at first and lit as the sun comes up
  pen.save();
  pen.globalAlpha = between(t, 3, 13.15);
  maengNature(t, "doi", 1 - 0.8 * light, 4);
  pen.restore();
  s01Title(t);
  if (t < 2) {                                      // out of the dark
    pen.fillStyle = "rgba(0, 0, 0, " + (1 - t / 2).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
