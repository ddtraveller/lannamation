// s07_wish.js - scene 7 of the film of Chang Ngu: the wish (40 s). Doi Ku Kaeo at dusk: the novice climbs the path to the
// chedi of the great relic and lifts his bowl of rice above his head (the chronicle: "ยกบาตรข้าวขึ้นใส่หัวถวาย", he raised
// the bowl and the rice to his head and gave them to the relic); close, he kneels before it with his hands together
// and makes his wish; then under the great tree at the hill's foot he sits, and the days go over him, day and night;
// and in the night a small light rises from where he sat and drifts away over the hills toward Si Tuang. Told gently
// (the owner's choice): he fades as the light rises; nothing of his death is shown.
var C07_LONG = 46.4;
var C07_SOUND = {calls: []};
var C07_LINES = [[1.6, 7.9, "C027"], [8.4, 10.58, "C028"], [15.6, 22.8, "C029"], [23.0, 28.94, "C030"], [30.0, 34.44, "C031"], [37.0, 44.94, "C032"]];
var C07_CUTS = [14.6, 29.4];

// The climb, wide: the novice small on the path, up to the chedi; there he lifts his bowl above his head.
function c07Climb(t) {
  pen.drawImage(cngSky("dusk"), 0, 0);
  cumulus(pen, t + 20, CNG_CLOUDS.dusk);
  pen.drawImage(cngKuKaeo(), 0, 0);
  var u = between(t, 0.5, 8), size = mix(0.42, 0.3, u);
  var x = mix(760, CNG_CHEDI[0] - 110, u), y = mix(800, CNG_CHEDI[1] + 8, Math.pow(u, 0.8));
  var lift = between(t, 8.6, 10.2), face = 1;
  var bowl = [mix(x + 34 * size * face, x + 6 * face, lift), y - mix(236, 330, lift) * size];   // from his waist up over his head, no jump
  person(x, y, cngPerson("monk", CNG_NOVICE, {id: "novice", size: size, face: face, step: u > 0 && u < 1 ? (t - 0.5) / BEAT / 2 : 0,
                                              reachA: [bowl[0] - 20 * size, bowl[1] + 10 * size], reachB: [bowl[0] + 20 * size, bowl[1] + 10 * size]}));
  almsBowl(pen, bowl[0], bowl[1], size * 0.8);
}

// Close at the chedi: he kneels before it, his hands together, and says his wish.
function c07Kneel(t) {
  var zoom = 2.3;
  pen.save();
  pen.translate(WIDE / 2, 640);
  pen.scale(zoom, zoom);
  pen.translate(-CNG_CHEDI[0] + 60, -CNG_CHEDI[1] + 60);
  pen.drawImage(cngSky("dusk"), 0, 0);
  pen.drawImage(cngKuKaeo(), 0, 0);
  var speaking = t > 21.2 && t < 26.4;
  person(CNG_CHEDI[0] - 130, CNG_CHEDI[1] + 26, cngPerson("monk", CNG_NOVICE, {id: "novice2", size: 0.3, face: 1, floor: "side", wai: 1,
                                                                             mouth: speaking ? {open: 0.04 + 0.12 * Math.abs(Math.sin(t * 7)), wide: 0.4, round: 0.1} : undefined}));
  almsBowl(pen, CNG_CHEDI[0] - 60, CNG_CHEDI[1] + 4, 0.2);   // his bowl given, set down before the chedi
  pen.restore();
}

// Under the great tree: he sits; the days go over him (the sky from day to night and back, three times, slow); in the
// night a small light rises from where he sat, and goes away over the hills.
function c07Days(t) {
  var turn = between(t, 29.8, 36.3), dark = 0.5 - 0.5 * Math.cos(turn * Math.PI * 5);   // day, night, day, night, ... night
  if (t > 36.3) { dark = 1; }
  pen.save();                                              // close on the tree, so he sits clear of the words under him
  pen.translate(560, 560);
  pen.scale(1.35, 1.35);
  pen.translate(-560, -560);
  pen.drawImage(cngSky("day"), 0, 0);
  pen.globalAlpha = dark;
  pen.drawImage(cngSky("night"), 0, 0);
  pen.globalAlpha = 1;
  pen.drawImage(cngKuKaeo(), 0, 0);
  pen.fillStyle = "rgba(10, 14, 40, " + (0.62 * dark).toFixed(3) + ")";
  pen.fillRect(0, 0, WIDE, 1080);
  var gone = between(t, 36.8, 39.3), seat = [CNG_KUKAEO_TREE[0] + 90, CNG_KUKAEO_TREE[1] + 40];
  if (gone < 1) {
    pen.save();
    pen.globalAlpha = 1 - gone;
    person(seat[0], seat[1], cngPerson("monk", CNG_NOVICE, {id: "novice3", face: -1, floor: "cross", wai: 1, feel: "sleepy"}));
    pen.restore();
  }
  var rise = between(t, 36.8, 41.8);                           // the small light: up from where he sat, then away to the left
  if (rise > 0) {
    var lx = mix(seat[0], seat[0] - 520, Math.max(0, rise - 0.35) / 0.65), ly = seat[1] - 140 - 520 * Math.min(1, rise * 1.6) + 20 * Math.sin(t * 2);
    var glow = pen.createRadialGradient(lx, ly, 2, lx, ly, 46);
    glow.addColorStop(0, "rgba(255, 246, 210, 1)"); glow.addColorStop(0.3, "rgba(255, 220, 140, 0.7)"); glow.addColorStop(1, "rgba(255, 200, 120, 0)");
    pen.fillStyle = glow;
    pen.beginPath(); pen.arc(lx, ly, 46, 0, 7); pen.fill();
  }
  pen.restore();
}

// Scene 7, the entry the film calls (SCENES): t, its own second, 0 to C07_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngKuKaeo(), CNG_CHEDI, CNG_KUKAEO_TREE, cngPerson() with CNG_NOVICE,
// cngCutsOver(); from chiangsaen.js almsBowl(). Its words are C07_LINES (C027 to C032). Its z plan: the set, then the
// one person, then the light over all. e.g. cngSceneWish(20);
function cngSceneWish(t) {
  if (t < C07_CUTS[0]) { c07Climb(t); }
  else if (t < C07_CUTS[1]) { c07Kneel(t); }
  else { c07Days(t); }
  cngCutsOver(t, C07_CUTS);
}
