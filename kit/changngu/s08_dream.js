// s08_dream.js - scene 8 of the film of Chang Ngu: the queen's dream (40 s). Three shots, through black: the room at
// night, the queen asleep on her mat, a lamp burning; her dream, in a dream's pale light: a white elephant standing in
// the village, then going south through it and chasing the people, who scatter (as the chronicle: "ไล่กวด ... แตกตื่น",
// more funny than frightening); and the room at first light, the queen sitting up with a start and telling her husband,
// who answers that one of great merit will be born to her (the chronicle has King Phang read the dream himself).
var C08_LONG = 40;
var C08_SOUND = {calls: []};
var C08_LINES = [[0.8, 4.44, "C033"], [5.3, 10.46, "C034"], [10.66, 17.6, "C035"], [22.6, 26.68, "C036"], [27.2, 31.96, "C037"], [32.2, 35.46, "C038"]];
var C08_CUTS = [4.8, 21.8];
var C08_MAT = [760, CNG_FLOOR + 70];                   // where she lies, on the mat

// The queen asleep, lying on her side on the mat, her head to the left, a blanket over her: the kit's figure turned
// on its side onto the mat (the kit draws people standing), her face sleepy.
function c08Sleeper(t) {
  pen.save();
  pen.translate(C08_MAT[0] + 170, C08_MAT[1] - 24);       // her feet at the right, her head on the mat's left end
  pen.rotate(-Math.PI / 2);
  person(0, 0, cngPerson("maiden", CNG_QUEEN, {id: "thewiasleep", face: -1, feel: "sleepy", blink: 1}));
  pen.restore();
  pen.fillStyle = "#8a4a3a";                              // the blanket, rising and falling with her breath
  var breath = 3 * Math.sin(t * 1.4);
  pen.beginPath(); pen.moveTo(C08_MAT[0] - 70, C08_MAT[1] - 8);
  pen.quadraticCurveTo(C08_MAT[0] + 40, C08_MAT[1] - 70 - breath, C08_MAT[0] + 170, C08_MAT[1] - 44);
  pen.lineTo(C08_MAT[0] + 190, C08_MAT[1] - 6); pen.closePath(); pen.fill();
  pen.strokeStyle = "#c9962a"; pen.lineWidth = 3; pen.stroke();
}

// The dream: the village in a dream's light; the white elephant stands, then goes south (left) through it, the people
// running before it.
function c08Dream(t) {
  var village = cngVillage(), cam = WIDE * 0.7 - 260 * between(t, 9, 21);
  pen.drawImage(cngSky("dream"), 0, 0);
  cngClouds(t + 40, "day", 0.7);                         // soft pale clouds in the dream's sky
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  var go = between(t, 9, 21), ex = mix(WIDE + 900, WIDE - 150, go), step = go > 0 && go < 1 ? (t - 9) / BEAT / 3 : 0;
  var sprites = [{name: "the white elephant", kind: "elephant", x: ex, y: CNG_GROUND + 20, draw: function () {
    elephant(ex, CNG_GROUND + 20, {size: 0.62, face: -1, colour: "#f1ddd3", cloth: "#c9962a", step: step,
                                   trunk: 0.2 + 0.4 * Math.max(0, Math.sin(t * 1.5)), mouth: go > 0 ? 0.3 : 0});
  }}];
  [["farmer", 0], ["weaver", 1], ["villager", 2], ["girl", 3]].forEach(function (p, i) {
    var start = WIDE + 420 - i * 150, flee = between(t, 9.6 + i * 0.4, 19 + i * 0.4), x = start - 1500 * flee;
    sprites.push({name: "villager " + i, kind: "person", x: x, y: CNG_GROUND + 40 + (i % 2) * 20, draw: function () {
      person(x, CNG_GROUND + 40 + (i % 2) * 20, cngPerson(p[0], {size: p[0] === "girl" ? 0.5 : 0.7, id: "dreamer" + i, face: flee > 0 ? -1 : 1,
                                                                 step: flee > 0 ? t / BEAT * 1.4 : 0, feel: flee > 0 ? "fear" : undefined,
                                                                 handA: flee > 0 ? liftHand(0.8) : undefined}));
    }});
  });
  drawByZ(sprites);
  pen.drawImage(village.front, 0, 0);
  pen.restore();
  var veil = pen.createRadialGradient(WIDE / 2, 540, 300, WIDE / 2, 540, 1100);   // the dream's soft edge, pale
  veil.addColorStop(0, "rgba(246, 236, 248, 0)"); veil.addColorStop(1, "rgba(246, 236, 248, 0.85)");
  pen.fillStyle = veil;
  pen.fillRect(0, 0, WIDE, 1080);
  pen.fillStyle = "rgba(220, 200, 240, 0.18)";
  pen.fillRect(0, 0, WIDE, 1080);
}

// Scene 8, the entry the film calls (SCENES): t, its own second, 0 to C08_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngRoom("night"/"day"), CNG_FLOOR, cngVillage(), CNG_GROUND, cngSky("dream"),
// cngPerson() with CNG_QUEEN and CNG_HEADMAN, cngCutsOver(); from pieces.js pratheep(). Its words are C08_LINES (C033 to
// C038). Its z plan: the room or the village first, then the people (in the dream by drawByZ, the elephant and the
// people by their feet), then the dream's veil. e.g. cngSceneDream(20);
function cngSceneDream(t) {
  if (t < C08_CUTS[0]) {
    pen.save();                                            // close on the mat and the lamp
    pen.translate(WIDE / 2, 640);                          // the mat brought up to the middle of the picture
    pen.scale(1.7, 1.7);
    pen.translate(-(C08_MAT[0] + 60), -(C08_MAT[1] - 40));
    pen.drawImage(cngRoom("night"), 0, 0);
    pratheep(pen, C08_MAT[0] + 330, CNG_FLOOR + 40, 2.2, t, 1, {});
    c08Sleeper(t);
    sceneryLampLight(t, C08_MAT[0] + 330, CNG_FLOOR + 14, CNG_FLOOR + 60, {reach: 260, strength: 0.8, seed: 3});   // its light on her
    pen.restore();
  } else if (t < C08_CUTS[1]) {
    c08Dream(t);
  } else {
    pen.save();                                            // close on the two of them
    pen.translate(WIDE / 2, 560);                          // the two of them brought up, clear of the words
    pen.scale(1.5, 1.5);
    pen.translate(-(C08_MAT[0] + 90), -(CNG_FLOOR - 110));
    pen.drawImage(cngRoom("day"), 0, 0);
    pen.fillStyle = "rgba(60, 40, 80, " + (0.35 * (1 - between(t, 22, 30))).toFixed(3) + ")";   // the first light coming in
    pen.fillRect(0, 0, WIDE, 1080);
    var tells = t > 22.6 && t < 26.4, answers = (t > 27.2 && t < 31.4) || (t > 32.2 && t < 35.6);
    var talk = function (on) { return on ? {open: 0.06 + 0.24 * Math.abs(Math.sin(t * 8)), wide: 0.5, round: 0.15} : undefined; };
    person(C08_MAT[0] - 80, CNG_FLOOR + 60, cngPerson("maiden", CNG_QUEEN, {id: "thewi", floor: "side", face: 1,
                                                                            feel: t < 25 ? "surprised" : "concerned", mouth: talk(tells),
                                                                            at: [C08_MAT[0] + 260, CNG_FLOOR - 240]}));
    person(C08_MAT[0] + 260, CNG_FLOOR + 50, cngPerson("noble", Object.assign({}, CNG_HEADMAN, {sarong: CNG_KING.sarong}),
                                                      {id: "phang", floor: "cross", face: -1, feel: t > 27 ? "happy" : "concerned",
                                                       mouth: talk(answers), at: [C08_MAT[0] - 80, CNG_FLOOR - 200]}));
    cngMotes(t);                                           // dust in the first light
    pen.restore();
  }
  cngCutsOver(t, C08_CUTS);
}
