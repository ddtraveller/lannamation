// s01_doi.js - scene 1 of the film of the creature with four ears and five eyes: Doi Khao Khwai, before
// dawn (30 s). Out of the dark, the mountain over its forest and its mist, the sky going pale behind it; the
// title; the voice begins the tale; the camera comes slowly in on the cave in the mountain's side, and in its
// dark five green eyes open, blink once, and close. Its mist, as mountain mist lies at dawn: a sea of it in the
// valleys between the far ranges, its top lit by the sunrise; a band drifting at the mountain's foot; one lying
// along its side below the cave; and the film opens inside a thick fog that sinks and thins over the first
// twelve seconds, so the mountain comes out of it under the title.
var S01_LONG = 30;
var S01_LINES = [[8.0, 11.2, "M001"], [11.6, 14.8, "M002"], [15.4, 19.2, "M003"], [19.8, 24.0, "M004"]];

function s01Title(t) {                              // the title, in the picture: it fades in, holds and fades out
  var fade = between(t, 1.5, 2.7) * (1 - between(t, 6.3, 7.5));
  if (fade <= 0) { return; }
  pen.save();
  pen.globalAlpha = fade;
  pen.textAlign = "center";
  pen.lineJoin = "round";
  pen.font = "bold 110px 'Leelawadee UI', 'Noto Sans Thai', Tahoma, sans-serif";
  pen.strokeStyle = "rgba(30, 18, 40, 0.85)";
  pen.lineWidth = 12;
  pen.strokeText("แมงสี่หูห้าตา", WIDE / 2, 330);
  pen.fillStyle = "#ffe9b8";
  pen.fillText("แมงสี่หูห้าตา", WIDE / 2, 330);
  pen.font = "italic 50px Georgia, 'Times New Roman', serif";
  pen.lineWidth = 8;
  pen.strokeText("The Creature with Four Ears and Five Eyes", WIDE / 2, 410);
  pen.fillStyle = "#fff6dc";
  pen.fillText("The Creature with Four Ears and Five Eyes", WIDE / 2, 410);
  pen.restore();
}

function s01Eyes(t) {                               // five green eyes in the cave's dark: they open, blink once, close
  var open = between(t, 24.5, 25.3) * (1 - between(t, 27.6, 28.5));
  if (open <= 0 || (t > 26.3 && t < 26.5)) { return; }
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

// The trees about the cave, live with it in the scene's light: over the top of its rocks and beside them,
// so the forest grows over it (behind: drawn before it), and before its foot (after it).
var S01_BEHIND = [[-86, -58, 13, 6], [-64, -82, 14, 7], [-36, -92, 13, 8], [-6, -96, 14, 9], [24, -94, 13, 10], [52, -88, 14, 11], [80, -70, 13, 12], [94, -40, 12, 15], [-94, -26, 12, 16]];
var S01_BEFORE = [[-62, 8, 11, 1], [-40, 12, 13, 2], [-16, 14, 12, 3], [8, 13, 13, 4], [32, 12, 12, 5], [56, 9, 13, 13], [80, 6, 11, 14]];

function s01Crowns(list, dawn) {
  list.forEach(function (c) {
    var green = blend(blend(FOREST_GREENS[c[3] % FOREST_GREENS.length], "#79ad84", 0.15), MAENG_DAWN[0], dawn);   // the slope's own haze, then the light
    crown(pen, MAENG_CAVE[0] + c[0], MAENG_CAVE[1] + c[1], c[2], green, 60 + c[3]);
  });
}

function sceneDoi(t) {
  var mountain = maengMountain(), light = between(t, 0, S01_LONG);
  var day = 0.6 * light * light * (3 - 2 * light), dawn = MAENG_DAWN[1] * (1 - day);   // the sun coming up behind the mountain
  var u = Math.pow(between(t, 14, 28), 1.6), push = 1 + 0.42 * u;   // the slow push in, the cave coming to the middle
  pen.save();
  pen.translate(WIDE / 2, 540);
  pen.scale(push, push);
  pen.translate(-mix(WIDE / 2, MAENG_CAVE[0], u), -mix(540, MAENG_CAVE[1], u));
  pen.drawImage(maengSky("night"), 0, 0);
  pen.globalAlpha = 0.25 + 0.75 * light;            // the dawn comes up behind the stars
  pen.drawImage(maengSky("dawn"), 0, 0);
  pen.globalAlpha = 1;
  cumulus(pen, t + 30, MAENG_CLOUDS.dawn);
  pen.drawImage(mountain.backDawn, 0, 0);
  pen.globalAlpha = day;
  pen.drawImage(mountain.back, 0, 0);
  pen.globalAlpha = 1;
  var glow = blend("#b9a6c8", "#f6c9a0", light);    // the mist's top: grey-violet in the dark, warm as the sun comes up
  mistSea(pen, t, {level: 760, left: 0, right: WIDE, deep: 150, swell: 14, wave: 150, drift: 4, layers: 3, colour: "#efe8f2",
                   glow: glow, seed: 7, alpha: 0.85});   // the sea of mist in the valleys between the far ranges
  mistDrift(pen, t, {left: 0, right: WIDE, top: 620, bottom: 760, count: 5, drift: 10, seed: 3, alpha: 0.6});
  pen.drawImage(mountain.frontDawn, 0, 0);
  pen.globalAlpha = day;
  pen.drawImage(mountain.front, 0, 0);
  pen.globalAlpha = 1;
  mistBand(pen, 860, 770, 900, t, {tilt: -0.2, colour: "#efe8f2", glow: glow, seed: 9, alpha: 0.7});   // along the mountain's side, below the cave
  s01Crowns(S01_BEHIND, dawn);
  caveMouth(pen, MAENG_CAVE[0], MAENG_CAVE[1], 0.62, {t: t, rock: "#5f574f", tint: [MAENG_DAWN[0], dawn]});
  s01Eyes(t);
  s01Crowns(S01_BEFORE, dawn);
  mistDrift(pen, t, {left: 0, right: WIDE, top: 880, bottom: 1000, count: 4, wide: 640, drift: 7, seed: 4, alpha: 0.65});
  var lifts = between(t, 1, 12);                    // the fog the film opens in: it sinks and thins, and the mountain comes out
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
  s01Title(t);
  if (t < 2) {                                      // out of the dark
    pen.fillStyle = "rgba(0, 0, 0, " + (1 - t / 2).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
