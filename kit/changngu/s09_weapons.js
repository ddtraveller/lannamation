// s09_weapons.js - scene 9 of the film of Chang Ngu: weapons (30 s). Seven months into her waiting the queen longs for
// weapons (the chronicle: she asked the headman for smiths to make "ดาบ ตาว และหอกซัดสีนาคปืนไฟ", swords, spears and
// fire-guns; her second craving, for Khom blood, is left out for children, the owner's choice). In the village a smith
// hammers on his anvil, sparks flying at each stroke, his fellow working the bamboo bellows of the forge; finished
// weapons lie on a mat; the queen watches, and smiles.
var C09_LONG = 34.97;
var C09_SOUND = {calls: []};
var C09_LINES = [[1.4, 10.48, "C039"], [10.75, 19.64, "C040"], [19.91, 23.35, "C041"]];
var C09_FORGE = [940, 860, 1.25];
var C09_HANDLE = 190;                                   // the bellows' handles this high over the forge's base (times its size)
var C09_GRIP = [10, 2];                                 // his wrists this far back of and under each handle (times its size)                      // the forge: x, base, size (above the words under the picture)
var C09_PUMPER = 140;                                  // where he stands, on his block, back of the forge (times its size; 200 until 2026-11-18: out of reach)
var C09_STRIKE = 0.9;                                  // seconds between the hammer's strokes


// Scene 9, the entry the film calls (SCENES): t, its own second, 0 to C09_LONG (30 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), CNG_GROUND, cngPerson() with CNG_QUEEN and CNG_SMITH; from
// chiangsaen.js forge(), dap(), fireGun(); from pieces.js emberFlight(). Its words are C09_LINES (C039 to C041).
// Its z plan: the village's back sheet, then the forge, then by drawByZ the people by their feet; the sparks over all.
function cngSceneWeapons(t) {
  var village = cngVillage(), cam = WIDE * 0.92, f = C09_FORGE, s = f[2];
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 40, "day");
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  pen.restore();
  pen.drawImage(cngForgeGround(C09_FORGE, true), 0, 0);   // the yard, and the mat with the finished weapons
  dap(pen, 180, 890, 0.42, {angle: Math.PI / 2});
  dap(pen, 180, 870, 0.42, {angle: Math.PI / 2 - 0.05});
  fireGun(pen, 300, 904, 0.7, {angle: -0.02, t: t});
  pen.strokeStyle = "#7a5432"; pen.lineWidth = 5;          // two spears, lying
  [[160, 852], [170, 844]].forEach(function (p) { pen.beginPath(); pen.moveTo(p[0], p[1]); pen.lineTo(p[0] + 400, p[1] - 8); pen.stroke(); });
  pen.fillStyle = "#c9ccd2";
  [[560, 844], [570, 836]].forEach(function (p) { pen.beginPath(); pen.moveTo(p[0], p[1] - 6); pen.lineTo(p[0] + 30, p[1]); pen.lineTo(p[0], p[1] + 6); pen.fill(); });
  forge(pen, f[0], f[1], s, t);
  natSteam(t, f[0] - 40 * s, f[0] + 40 * s, f[1] - 70 * s, {count: 10, rise: 260, wide: 70, life: 6, lean: 120, alpha: 0.22, flat: 0.8,
                                                            patch: 0.6, colour: "190, 184, 176", seed: 9});   // its smoke, rising and leaning
  var phase = (t % C09_STRIKE) / C09_STRIKE, up = phase < 0.6 ? phase / 0.6 : 1 - (phase - 0.6) / 0.4;   // up slowly, down fast
  var anvil = [f[0] + 126 * s, f[1] - 62 * s];
  var smith = anvil[0] + 130;
  // The bellows' two plungers drawn on up to handles at his hips, each with a crossbar, pumping in turn as forge()'s
  // short rods do (the owner, 2026-11-18: "extend the bellows controls and put the man's hands on them so it looks like
  // he is working the bellows": the rods ended below his hands); his hands on the crossbars.
  var handles = [0, 1].map(function (b) {
    var hx = f[0] - 120 * s + b * 26 * s + 10 * s, hy = f[1] - C09_HANDLE * s + 20 * s * Math.sin(t * 4 + b * Math.PI);
    pen.fillStyle = "#6a4a2a"; pen.fillRect(hx - 2.5 * s, hy, 5 * s, f[1] - 100 * s + 20 * s * Math.sin(t * 4 + b * Math.PI) - hy);
    pen.fillStyle = "#4a3018"; pen.fillRect(hx - 10 * s, hy - 3 * s, 20 * s, 6 * s);
    return [hx, hy];
  });
  decorate(t, cngYard(1500, 872, 2), "back");                 // the yard's fowl (owner, 2026-10-25)
  drawByZ([
    {name: "smith", kind: "person", x: smith, y: f[1] + 10, draw: function () {
      var j = person(smith, f[1] + 10, cngPerson("villager", CNG_SMITH, {id: "smith", face: -1, feel: "happy",
                                                                     reachA: [anvil[0] + 34, anvil[1] - 44 - 130 * up], at: anvil}));
      cngHammer(j);
    }},
    {name: "bellows man", kind: "person", x: f[0] - C09_PUMPER * s, y: f[1] + 6, draw: function () {
      // he stands on a low block of wood, as a bellows man does, and pumps down: at the ground the handles were at his
      // shoulder, his arms at full stretch, and his far hand jumped twice a stroke (pop_check)
      var up = 70 * s;
      pen.fillStyle = "#7a5432"; pen.fillRect(f[0] - C09_PUMPER * s - 42 * s, f[1] + 6 - up, 60 * s, up);   // narrow, clear of the bamboo
      pen.strokeStyle = "#4a3018"; pen.lineWidth = 2; pen.strokeRect(f[0] - C09_PUMPER * s - 42 * s, f[1] + 6 - up, 60 * s, up);
      person(f[0] - C09_PUMPER * s, f[1] + 6 - up, cngPerson("villager", CNG_SMITH, {id: "bellows", face: 1, turban: "#3a4a5a",
                                                                       reachA: [handles[0][0] - C09_GRIP[0] * s, handles[0][1] + C09_GRIP[1] * s],
                                                                       reachB: [handles[1][0] - C09_GRIP[0] * s, handles[1][1] + C09_GRIP[1] * s]}));
    }},
    {name: "queen", kind: "person", x: 470, y: 830, draw: function () {
      person(470, 830, cngPerson("maiden", CNG_QUEEN, {id: "thewi", face: 1, feel: t > 19.27 ? "happy" : undefined, smile: t > 19.27 ? 1 : 0.4,
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
