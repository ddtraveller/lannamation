// s09_weapons.js - scene 9 of the film of Chang Ngu: weapons (30 s). Seven months into her waiting the queen longs for
// weapons (the chronicle: she asked the headman for smiths to make "ดาบ ตาว และหอกซัดสีนาคปืนไฟ", swords, spears and
// fire-guns; her second craving, for Khom blood, is left out for children, the owner's choice). In the village a smith
// hammers on his anvil, sparks flying at each stroke, his fellow working the bamboo bellows of the forge; finished
// weapons lie on a mat; the queen watches, and smiles.
var C09_LONG = 30;
var C09_SOUND = {calls: []};
var C09_LINES = [[1.4, 9.54, "C039"], [9.74, 15.94, "C040"], [16.14, 18.44, "C041"]];
var C09_FORGE = [940, 860, 1.25];                      // the forge: x, base, size (above the words under the picture)
var C09_STRIKE = 0.9;                                  // seconds between the hammer's strokes


// Scene 9, the entry the film calls (SCENES): t, its own second, 0 to C09_LONG (30 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), CNG_GROUND, cngPerson() with CNG_QUEEN and CNG_SMITH; from
// chiangsaen.js forge(), dap(), fireGun(); from pieces.js emberFlight(). Its words are C09_LINES (C039 to C041).
// Its z plan: the village's back sheet, then the forge, then by drawByZ the people by their feet; the sparks over all.
function cngSceneWeapons(t) {
  var village = cngVillage(), cam = WIDE * 0.92, f = C09_FORGE, s = f[2];
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 40, CNG_CLOUDS.day);
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  pen.restore();
  csBand(pen, 0, 800, WIDE, 280, "#b9a070", "#9a8058");   // the beaten ground of the forge's yard
  pen.fillStyle = "#c9b07a";                               // the mat with the finished weapons
  pen.fillRect(140, 860, 420, 50);
  dap(pen, 180, 890, 0.42, {angle: Math.PI / 2});
  dap(pen, 180, 870, 0.42, {angle: Math.PI / 2 - 0.05});
  fireGun(pen, 300, 904, 0.7, {angle: -0.02, t: t});
  pen.strokeStyle = "#7a5432"; pen.lineWidth = 5;          // two spears, lying
  [[160, 852], [170, 844]].forEach(function (p) { pen.beginPath(); pen.moveTo(p[0], p[1]); pen.lineTo(p[0] + 400, p[1] - 8); pen.stroke(); });
  pen.fillStyle = "#c9ccd2";
  [[560, 844], [570, 836]].forEach(function (p) { pen.beginPath(); pen.moveTo(p[0], p[1] - 6); pen.lineTo(p[0] + 30, p[1]); pen.lineTo(p[0], p[1] + 6); pen.fill(); });
  forge(pen, f[0], f[1], s, t);
  var phase = (t % C09_STRIKE) / C09_STRIKE, up = phase < 0.6 ? phase / 0.6 : 1 - (phase - 0.6) / 0.4;   // up slowly, down fast
  var anvil = [f[0] + 126 * s, f[1] - 62 * s];
  var smith = anvil[0] + 130, bellows = [f[0] - 110 * s, f[1] - 150 * s + 20 * s * Math.sin(t * 4)];
  drawByZ([
    {name: "smith", kind: "person", x: smith, y: f[1] + 10, draw: function () {
      var j = person(smith, f[1] + 10, cngPerson("villager", CNG_SMITH, {id: "smith", face: -1, feel: "happy",
                                                                     reachA: [anvil[0] + 34, anvil[1] - 44 - 130 * up], at: anvil}));
      cngHammer(j);
    }},
    {name: "bellows man", kind: "person", x: f[0] - 200 * s, y: f[1] + 6, draw: function () {
      person(f[0] - 200 * s, f[1] + 6, cngPerson("villager", CNG_SMITH, {id: "bellows", face: 1, turban: "#3a4a5a",
                                                                       reachA: [bellows[0], bellows[1]], reachB: [bellows[0] + 26 * s, f[1] - 150 * s - 20 * s * Math.sin(t * 4)]}));
    }},
    {name: "queen", kind: "person", x: 470, y: 830, draw: function () {
      person(470, 830, cngPerson("maiden", CNG_QUEEN, {id: "thewi", face: 1, feel: t > 15.5 ? "happy" : undefined, smile: t > 15.5 ? 1 : 0.4,
                                                       at: anvil}));
    }}
  ]);
  var struck = (t % C09_STRIKE) / C09_STRIKE - 0.98;      // the sparks at each stroke, flying up off the anvil
  var since = ((t % C09_STRIKE) - C09_STRIKE * 0.98 + C09_STRIKE) % C09_STRIKE;
  for (var k = 0; k < 5; k++) {
    var u = since / 0.6;
    if (u < 1) { emberFlight(pen, anvil, [anvil[0] + (k - 2) * 60, anvil[1] - 40 + 30 * dice(k)], u, 0.9, 60 + 20 * k, t); }
  }
  void struck;
  cngFadeIn(t, 1);
}
