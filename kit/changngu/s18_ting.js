// s18_ting.js - scene 18 of the film of Chang Ngu: ting, ting (35 s). On the bank Thukkhita, come running with the golden
// plate, holds it up by its cord and strikes it (the chronicle: "ตีต่อยยังพานคำ", the plate struck): it rings, rings
// of sound going out over the water; the white elephant, out in the river with Phrom on its neck, turns at the sound
// and comes in and walks up out of the water onto the sand (the chronicle: "ออกจากน้ำแม่ของด้วยสวัสดี"); its name,
// Chang Phan Kham, the elephant of the golden plate, comes up in gold; the two brothers laugh together.
var C18_LONG = 35;
var C18_SOUND = {calls: [[2.0, "plate-ting", 0.5], [3.0, "plate-ting", 0.5], [4.4, "plate-ting", 0.5], [5.4, "plate-ting", 0.5]]};   // each stroke rings (owner, 2026-10-25)
var C18_LINES = [[1.6, 6.54, "C084"], [7.0, 12.52, "C085"], [14.0, 18.42, "C086"]];
// Its life (decorate.js; owner, 2026-10-25): once the words are done and the brothers laugh, a flock goes over the
// river and a barb leaps by the sandbar.
var C18_LIFE = [
  {name: "flock over the river", kind: "flock", layer: "back", course: [[20.0, -320, 220], [27.0, 2150, 260]]},
  {name: "barb", kind: "fish", layer: "back", look: {size: 1.1}, course: [[23.0, 1350, 712, "hide"], [25.0, 1350, 712], [25.8, 1470, 712, "hide"], [99, 1470, 712, "hide"]]}
];
var C18_STRIKES = [2.0, 3.0, 4.4, 5.4];                // when the plate is struck ("ting ting", twice and twice)
var C18_SWIM = CNG_BANK - 54;

// Seconds since the plate was last struck at t, or a large number before the first stroke. e.g. c18Since(3.4)
function c18Since(t) {
  var since = 99;
  C18_STRIKES.forEach(function (s) { if (t >= s) { since = t - s; } });
  return since;
}

// The rings of its sound, going out from the plate over the water as it rings. e.g. c18Rings(t, [700, 600]);
function c18Rings(t, at) {
  C18_STRIKES.forEach(function (s) {
    var u = (t - s) / 1.6;
    if (u <= 0 || u >= 1) { return; }
    pen.strokeStyle = "rgba(255, 240, 180, " + (0.8 * (1 - u)).toFixed(3) + ")"; pen.lineWidth = 4;
    pen.beginPath(); pen.ellipse(at[0], at[1], 60 + 520 * u, 30 + 200 * u, 0, 0, 7); pen.stroke();
  });
}

// The elephant's name in gold, as the voice says it. e.g. c18Name(16);
function c18Name(t) {
  var a = between(t, 14.2, 15.2) * (1 - between(t, 19.8, 20.8));
  if (a <= 0) { return; }
  pen.save();
  pen.globalAlpha = a;
  pen.textAlign = "center";
  pen.shadowColor = "rgba(255, 196, 90, 0.7)"; pen.shadowBlur = 16;
  pen.fillStyle = "#f2d27a";
  pen.font = "700 80px 'Noto Serif Thai', 'Leelawadee UI', serif";
  pen.fillText("ช้างพานคำ", WIDE / 2, 200);
  pen.shadowBlur = 0;
  pen.font = "italic 38px " + LETTERS_LATIN + ", serif";
  pen.fillStyle = "#fff6dc";
  pen.fillText("Chang Phan Kham, the elephant of the golden plate", WIDE / 2, 256);
  pen.restore();
}

// Scene 18, the entry the film calls (SCENES): t, its own second, 0 to C18_LONG (35 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngRiver(), cngRiverLife(), CNG_BANK, cngPerson() with CNG_PHROM and CNG_THUKKHITA,
// cngAgeSize(), cngLocal(), cngPlate(); from beasts.js elephant(). Its words are C18_LINES (C084 to C086). Its z plan:
// the river's back, the elephant (in the water: the water over its legs; then on the sand), the near bank, Phrom on it,
// Thukkhita with the plate, the rings and the name over all.
function cngSceneTing(t) {
  var river = cngRiver(), comes = between(t, 6, 13), out = between(t, 10.5, 13);
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 90, CNG_CLOUDS.day);
  pen.drawImage(river.back, 0, 0);
  cngRiverLife(t, {});
  decorate(t, C18_LIFE, "back");
  var ex = mix(1400, 1050, comes), ey = mix(C18_SWIM + 160, CNG_BANK + 60, out) + (out < 1 ? 6 * Math.sin(t * 1.4) : 0);
  var face = t < 6.6 ? 1 : -1, walking = comes > 0 && comes < 1;
  var e = null;
  if (out < 1) {                                           // in the river; on the sand it is drawn once, over the bank, below
    e = elephant(ex, ey, {size: 0.62, face: face, colour: "#f1ddd3", cloth: "#c9962a", step: walking ? t / BEAT / 3 : 0,
                          trunk: t > 6 && t < 9 ? 0.8 : 0.3, mouth: t > 15 ? 0.3 : 0.1});   // (both at once: two trunks)
  }
  if (out < 1) {                                           // the water over its legs while it is still in the river
    pen.save();
    pen.globalAlpha = 1 - out;
    csBand(pen, 0, C18_SWIM - 8, WIDE, CNG_BANK - C18_SWIM + 30, "#a68e66", "#8a7250");
    waves(pen, 0, C18_SWIM - 6, WIDE, CNG_BANK - C18_SWIM + 20, "rgba(250, 238, 210, 0.3)", t);
    pen.restore();
  }
  pen.drawImage(river.near, 0, 0);
  if (out >= 1) {                                          // on the sand now: it is drawn again over the bank
    e = elephant(ex, ey, {size: 0.62, face: face, colour: "#f1ddd3", cloth: "#c9962a", trunk: 0.3 + 0.5 * Math.max(0, Math.sin(t * 2)),
                          mouth: t > 15 ? 0.3 : 0.1});
  }
  var laugh = t > 20;
  person(e.seat[0], e.seat[1], cngPerson("boy", CNG_PHROM, {id: "phromrides", size: cngAgeSize(13), face: face, floor: "astride",
                                                           feel: laugh ? "laughing" : "happy"}));
  var tx = 520, ty = CNG_BANK + 70, struck = c18Since(t) < 0.25;   // Thukkhita, the plate held up by its cord
  var j = person(tx, ty, cngPerson("boy", CNG_THUKKHITA, {id: "thukkhita", size: cngAgeSize(16), face: 1, feel: laugh ? "laughing" : "happy",
                                                          reachA: [tx + 80, ty - 330], reachB: struck ? [tx + 70, ty - 250] : [tx + 30, ty - 210]}));
  var hand = cngLocal(j.wristA), swing = Math.sin(Math.min(c18Since(t), 3) * 9) * Math.exp(-Math.min(c18Since(t), 3) * 1.5) * 0.15;
  pen.save();
  pen.translate(hand[0], hand[1]);
  pen.rotate(swing);
  pen.strokeStyle = "#b8294a"; pen.lineWidth = 3;
  pen.beginPath(); pen.moveTo(0, 0); pen.lineTo(0, 40); pen.stroke();
  cngPlate(0, 90, 0.6, t);
  pen.restore();
  c18Rings(t, [hand[0], hand[1] + 90]);
  c18Name(t);
  cngFadeIn(t, 1);
}
