// s17_plate.js - scene 17 of the film of Chang Ngu: the golden plate (40 s). Three shots, through black: in Si Tuang the
// child who ran home has told the headman, and the headman's seer, an old man in white, tells him what to do (the
// chronicle: "beat a thousand of gold into a plate, and lead it ahead, and the elephant will come up"); at the forge the
// smiths beat the gold into a shining plate (the kit's kangsadan: flat, plain, rings engraved, the owner's pick); and
// Thukkhita, the elder brother, sixteen, runs it to the river by its red cord (the chronicle: "ให้ทุกขิตกุมารผู้เป็นพี่
// นั้นเอาไปให้แก่พรหมกุมารผู้น้อง").
var C17_LONG = 44.97;
var C17_SOUND = {calls: []};
var C17_LINES = [[1.4, 4.99, "C079"], [5.25, 10.74, "C080"], [11.4, 16.53, "C081"], [18.05, 25.19, "C082"], [30.82, 40.16, "C083"]];
var C17_CUTS = [17.49, 30.02];


// The yard: the runner child arrived; the headman listens; the seer speaks.
function c17Yard(t) {
  var village = cngVillage(), cam = WIDE * 0.85;
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 30, "day");
  pen.save(); pen.translate(-cam, 0); pen.drawImage(village.back, 0, 0); pen.restore();
  pen.drawImage(cngForgeGround(null, false), 0, 0);       // the yard's beaten earth (sets.js)
  var speaks = (t > 5.25 && t < 10.44) || (t > 11.4 && t < 16.23);
  decorate(t, cngYard(1360, 884, 4).slice(1), "back");        // the yard's fowl (owner, 2026-10-25), its two hens: the rooster
                                                               // walked under the seer's feet, drawn behind him (owner,
                                                               // 2026-11-18: "you can just remove the chicken in question")
  drawByZ([
    {name: "headman", kind: "person", x: 820, y: 860, draw: function () {
      person(820, 860, cngPerson("noble", Object.assign({}, CNG_HEADMAN, {sarong: CNG_KING.sarong, age: 0.45}),
                                 {id: "phang", face: 1, feel: t < 4.04 ? "surprised" : "concerned", at: [1150, 600]}));
    }},
    {name: "seer", kind: "person", x: 1150, y: 870, draw: function () {
      person(1150, 870, poseEased(t, function (s) {          // his hand out while he speaks, eased in and out (poseEased)
        var speaking = (s > 5.2 && s < 10.75) || (s > 11.35 && s < 16.71);   // the hand grows out and back (a reach's third number)
        var out = between(s, 5.2, 5.7) * (1 - between(s, 10.25, 10.75)) + between(s, 11.35, 11.85) * (1 - between(s, 16.21, 16.71));
        return cngPerson("elder", CNG_SEER, {id: "seer", face: -1, feel: "happy",
                                             reachA: speaking ? [1060, 640 + 30 * Math.sin(s * 2), out] : undefined,
                                             mouth: speaking ? {open: 0.06 + 0.22 * Math.abs(Math.sin(s * 7)), wide: 0.5, round: 0.2} : undefined,
                                             at: [820, 600]});
      }));
    }},
    {name: "runner", kind: "person", x: 600, y: 880, draw: function () {
      var c = CNG_CHILDREN[3];
      person(600, 880, cngPerson(c.kind, c.look, {id: "runner", size: cngAgeSize(11), face: 1, feel: "concerned", sit: 0.15, bend: 0.2}));
    }}
  ]);  cngBeds(t, "village", "frame");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.45, 21]});
}

// The forge: the smiths beat the gold into the plate on the anvil, sparks of gold at each stroke.
function c17Forge(t) {
  var village = cngVillage(), cam = WIDE * 0.92;
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 30, "day");
  pen.save(); pen.translate(-cam, 0); pen.drawImage(village.back, 0, 0); pen.restore();
  var f = [900, 860, 1.25], s = f[2], anvil = [f[0] + 126 * s, f[1] - 62 * s];
  pen.drawImage(cngForgeGround(f, false), 0, 0);          // the forge's yard (sets.js), as scenes 9 and 11
  forge(pen, f[0], f[1], s, t);
  natSteam(t, f[0] - 40 * s, f[0] + 40 * s, f[1] - 70 * s, {count: 10, rise: 260, wide: 70, life: 6, lean: 120, alpha: 0.22, flat: 0.8,
                                                            patch: 0.6, colour: "190, 184, 176", seed: 17});   // its smoke
  var grow = between(t, 18.05, 27.82);                           // the gold spreading into a plate under the hammer
  cngPlate(anvil[0], anvil[1] - 8, 0.25 + 0.35 * grow, t);
  var phase = (t % 0.8) / 0.8, up = phase < 0.6 ? phase / 0.6 : 1 - (phase - 0.6) / 0.4;
  drawByZ([
    {name: "smith", kind: "person", x: anvil[0] + 130, y: f[1] + 10, draw: function () {
      person(anvil[0] + 130, f[1] + 10, cngPerson("villager", CNG_SMITH, {id: "smith", face: -1, feel: "happy",
                                                                                 reachA: [anvil[0] + 34, anvil[1] - 44 - 130 * up], at: anvil,
                                                                                 holdA: cngHammerHeld}));   // the hammer in his fist
    }},
    {name: "smith 2", kind: "person", x: f[0] - 200 * s, y: f[1] + 14, draw: function () {
      // at the bellows, a hand on each plunger's top as forge() works it (the owner, 2026-11-19: "have one of the men work
      // the bellows while the other makes the gold plate - Now, one is just standing there")
      var rod = function (b) { return [f[0] - 120 * s + b * 26 * s + 10 * s, f[1] - 150 * s + 20 * s * Math.sin(t * 4 + b * Math.PI) + 4 * s]; };
      person(f[0] - 200 * s, f[1] + 14, cngPerson("villager", CNG_SMITH, {id: "smith2", face: 1, turban: "#3a4a5a", feel: "happy", at: anvil,
                                                                         reachA: rod(1), reachB: rod(0)}));
    }}
  ]);
  sceneryLampLight(t, f[0], f[1] - 64 * s, f[1] + 10, {reach: 340, strength: 0.7, colour: "255, 150, 70", seed: 6});   // the fire's light
  cngBeds(t, "village", "frame");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.45, 17]});
}

// The path out of the village: Thukkhita runs with the plate by its cord toward the river.
function c17Run(t) {
  var village = cngVillage(), run = between(t, 30.42, 43.97), cam = mix(WIDE * 0.9, WIDE * 0.1, run);
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 30, "day");
  pen.save(); pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  var x = cam + 900;
  // the cord in his fist, the plate hanging from it (the owner, 2026-11-19: "make the hand look like it is holding the
  // cord with fingers and thumb wrapped around a cord")
  person(x, CNG_GROUND, cngPerson("boy", CNG_THUKKHITA, {id: "thukkhita", size: cngAgeSize(16), face: -1, feel: "happy",
                                                         step: t / BEAT * 1.6, reachA: [x - 70, CNG_GROUND - 190],
                                                         holdA: {way: Math.PI / 2, draw: function (g) {
    pen.strokeStyle = "#b8294a"; pen.lineWidth = 3;
    pen.beginPath(); pen.moveTo(g.x, g.y - 12); pen.lineTo(g.x - 4, g.y + 40); pen.stroke();
    cngPlate(g.x - 4, g.y + 80, 0.55, t);
  }}}));
  pen.drawImage(village.front, 0, 0);
  pen.restore();
  cngBeds(t, "village", "frame");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.45, 19]});
}

// Scene 17, the entry the film calls (SCENES): t, its own second, 0 to C17_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), CNG_GROUND, cngPerson() with CNG_HEADMAN, CNG_SEER, CNG_SMITH,
// CNG_THUKKHITA and CNG_CHILDREN, cngAgeSize(), cngLocal(), cngCutsOver(), cngHammer(); from chiangsaen.js forge().
// Its words are C17_LINES (C079 to C083). Its z plan: each shot's set, then by drawByZ the
// people by their feet, the plate in a hand drawn with whoever holds it.
function cngScenePlate(t) {
  if (t < C17_CUTS[0]) { c17Yard(t); }
  else if (t < C17_CUTS[1]) { c17Forge(t); }
  else { c17Run(t); }
  cngCutsOver(t, C17_CUTS);
}
