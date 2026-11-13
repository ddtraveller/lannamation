// s17_revival.js - scene 17 of the film of Hong Hin: the three wives, and Indra (60 s). Morning mist on the river: the
// three princesses cross and find him; Mukhawadi holds his head, Culakantha his hands, Salicanta weeps at his feet. Indra
// comes as a handsome prince offering palaces; they turn away. He comes as a monster to eat the body; they gather wood
// for a fire, to leap into it and die with him (as the text, the owner). He comes as an old Brahman, pours heavenly
// medicine on the boy's wounds, and the boy breathes and sits up.
var H17_LONG = 51;                                     // 60 until 2026-11-12, 58 until 2026-11-13 (owner: cut off a little more quickly at 16:50)
var H17_SOUND = {calls: [[0.0, "frogs", 0.2, 58.0], [0.0, "shama", 0.15, 58.0], [22.26, "roar", 0.3]]};
var H17_LINES = [[2, 9.6, "H075"], [10, 19.92, "H076"], [21.6, 36.14, "H077"], [36.34, 42.28, "H078"], [43, 47.97, "H098"]];
// The lines as the scene was drawn to them; it plays to H17_LINES, Pan's voice (sets.js hhClock()).
var H17_PLAN = [[2, 8.6, "H075"], [10, 20.2, "H076"], [21.6, 30.2, "H077"], [31.6, 40.2, "H078"], [43, 50, "H098"]];   // H098 added 2026-11-13
var H17_CUTS = [9.6, 21, 31];
var H17_BODY = [960, WEL_KOK_BANK + 170];

// The bank in the morning mist, the boy lying, the three about him. t: seconds; up: 0 to 1, his sitting up; feel: theirs.
function h17Bank(t, up, feel, turned) {
  hhPlace("river-day");
  pen.drawImage(cngSky("day"), 0, 0);
  pen.drawImage(hhRangeAt(WEL_KOK - 10), 0, 0);
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok); sceneryWaterSurface(t, kok);
  sceneryBeds(t, hhRiverBank(), {sway: 0.3});           // the near bank planted, not ruled (owner, 2026-11-13)
  softMist(t, WEL_KOK + 40, 60, 0.5 * (1 - between(t, 30, 50)), 31, "250, 246, 240");
  pen.save(); pen.translate(H17_BODY[0], H17_BODY[1]); pen.rotate(-Math.PI / 2 * (1 - up));
  person(0, up > 0 ? 0 : 160, hhBoy(13, {face: 1, feel: up > 0 ? "happy" : "sleepy", blink: up > 0 ? undefined : 1, floor: up > 0 ? "cross" : undefined}));
  pen.restore();
  [["mukhawadi", -220, 1], ["culakantha", 160, -1], ["salicanta", 420, -1]].forEach(function (d, k) {
    var pj = hhPrincessAt(H17_BODY[0] + d[1], H17_BODY[1] + 20, d[0], {size: 0.72, id: d[0], floor: "side", face: turned ? -d[2] : d[2],
                                                                        feel: feel, tears: feel === "sad" ? 1 : 0, at: [H17_BODY[0], H17_BODY[1] - 40]});
    if (feel === "sad" && pj && pj.crown) { hhTears(pj, turned ? -d[2] : d[2], t); }   // the painted faces draw no tears
  });
}

// Scene 17, the entry the film calls. From sets.js: hhBoy(); ogre.js ogreDaughter(), ogre(); whiteeel/sets.js WEL_BRAHMAN.
function hhSceneRevival(t) {
  var said = t; t = hhClock(t, H17_PLAN, H17_LINES, H17_LONG);
  var b = H17_BODY;
  if (t < H17_CUTS[0]) {                                // they find him
    hhCamera(0.7, b[0], 860, 1.4);
    h17Bank(t, 0, "sad");
    hhCameraEnd();
  } else if (t < H17_CUTS[1]) {                          // Indra as a handsome prince, offering palaces; they turn away
    hhCamera(0.7, b[0] + 100, 860, 1.3);
    h17Bank(t, 0, t > 15 ? "angry" : "sad", t > 15);
    var px = b[0] + 700;
    pen.save(); pen.globalAlpha = between(t, 10, 11.5);
    person(px, b[1] + 10, welPerson("noble", HH_KING, {id: "indraPrince", face: -1, size: 0.8, feel: "happy", sarong: ["#2a5a3a", BROCADE],
                                                       reachA: [px - 120, b[1] - 200], mouth: welTalk(t, t > 12 && t < 16)}));
    vimana(px + 120, 520, t, {kind: "prasat", size: 0.18});
    pen.restore();
    hhCameraEnd();
  } else if (t < H17_CUTS[2]) {                          // Indra as a monster; they gather wood for the fire
    hhCamera(0.7, b[0] + 100, 860, 1.3);
    h17Bank(t, 0, t > 24 ? "angry" : "fear");
    pen.save(); pen.globalAlpha = between(t, 21, 22.5);
    ogre(b[0] + 680, b[1] + 10, t, {kind: "forest", id: "indraMonster", face: -1, size: 1.3, feel: "angry", reachA: [b[0] + 500, b[1] - 260]});
    pen.restore();
    var wood = between(t, 25, 30);                         // the pile of wood growing beside them
    pen.fillStyle = "#6a4420"; pen.strokeStyle = "#3a2410"; pen.lineWidth = 2;
    for (var n = 0; n < Math.floor(wood * 14); n++) {
      pen.save(); pen.translate(b[0] - 520 + (n % 5) * 22, b[1] + 30 - Math.floor(n / 5) * 16); pen.rotate((n % 2 ? 0.2 : -0.2));
      pen.beginPath(); pen.rect(-60, -6, 120, 12); pen.fill(); pen.stroke(); pen.restore();
    }
    hhCameraEnd();
  } else {                                               // Indra as an old Brahman, the medicine; the boy lives again
    var pour = between(t, 34, 38), up = between(t, 41, 44);
    hhCamera(0.7, b[0], 860, 1.4);
    h17Bank(t, up, up > 0 ? "happy" : "sad");
    var ox = b[0] + 120;
    person(ox, b[1] + 40, welPerson("elder", WEL_BRAHMAN, {id: "indraBrahman", face: -1, size: 0.78, feel: "happy",
                                                           reachA: pour > 0 && up <= 0 ? [b[0] + 40, b[1] - 120] : undefined, at: [b[0], b[1]]}));
    if (pour > 0 && up <= 0) {                             // drops of heavenly medicine, shining
      pen.save(); pen.globalCompositeOperation = "lighter";
      for (var d = 0; d < 6; d++) {
        var u = (t * 1.5 + d / 6) % 1;
        pen.fillStyle = "rgba(255, 236, 170, " + (0.8 * (1 - u)) + ")";
        pen.beginPath(); pen.arc(b[0] + 30, b[1] - 110 + 90 * u, 5, 0, 7); pen.fill();
      }
      pen.restore();
    }
    hhCameraEnd();
  }
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H17_CUTS, H17_PLAN, H17_LINES, H17_LONG));
}
