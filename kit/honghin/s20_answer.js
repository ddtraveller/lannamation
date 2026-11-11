// s20_answer.js - scene 20 of the film of Hong Hin: Vimala's answer (55 s). The orchard by day: two ministers bow before
// Vimala; she sends them away: a broken bowl cannot be mended. Then the king himself on his elephant, banners before
// him; he kneels in the garden and weeps, the boy beside him; she forgives him, and asks that the old gardeners come too.
var H20_LONG = 55;
var H20_SOUND = {calls: [[0.0, "shama", 0.2, 55.0], [16.14, "elephant-trumpet", 0.3], [16.14, "plate-ting", 0.2]]};
var H20_LINES = [[2, 8.22, "H088"], [9, 15.92, "H089"], [16.6, 23.2, "H090"], [26, 32.7, "H091"]];
// The lines as the scene was drawn to them; it plays to H20_LINES, Pan's voice (sets.js hhClock()).
var H20_PLAN = [[2, 7.6, "H088"], [9, 15.2, "H089"], [16.6, 24.6, "H090"], [26, 33.2, "H091"]];
var H20_CUTS = [16];

// Scene 20, the entry the film calls. From sets.js: hhOrchardAt(), HH_ORCHARD_HOUSE, hhVimala(), hhBoy(), HH_OLD_MAN,
// HH_OLD_WOMAN (s05_gardeners.js), HH_KING; beasts.js elephant(); oldcartoon.js tung().
var H20_OLD_MAN = {size: 0.72}, H20_OLD_WOMAN = {size: 0.68};
function hhSceneAnswer(t) {
  var said = t; t = hhClock(t, H20_PLAN, H20_LINES, H20_LONG);
  var g = HH_ORCHARD_GROUND, hx = HH_ORCHARD_HOUSE[0], vx = hx - 160;
  if (t < H20_CUTS[0]) {                                // the ministers sent away
    hhCamera(0.7, hx - 380, 820, 1.45);
    hhOrchardAt(t, "day");
    var away = between(t, 11, 15.5);
    person(vx, g + 50, hhVimala({face: away > 0 ? 1 : -1, feel: "angry", mouth: welTalk(t, welSays(t, H20_PLAN, ["H089"])), at: [vx - 400, g - 200]}));
    for (var k = 0; k < 2; k++) {
      var mx = mix(vx - 380 - k * 130, vx - 900 - k * 130, away);
      person(mx, g + 60 + k * 20, welPerson("noble", {size: 0.74, turban: "#2a4a6a", sarong: ["#2a4a6a", BROCADE]},
                                            {id: "minister" + k, face: away > 0 ? -1 : 1, floor: away > 0 ? undefined : "cross", wai: away > 0 ? undefined : 1,
                                             step: away > 0 && away < 1 ? t * 0.8 + k : 0, feel: "concerned", at: [vx, g - 300]}));
    }
    hhCameraEnd();
  } else {                                               // the king comes himself; kneels; she forgives
    var s = t - H20_CUTS[0], come = between(s, 0, 6), kneel = t > 24, forgive = t > 27.5, walk = between(t, 36, 50);
    hhCamera(0.6, hx - 420, 820, 1.3);
    hhOrchardAt(t, "day");
    for (var b = 0; b < 3; b++) { tung(pen, 220 + b * 200, 900, t, b === 1); }
    var ex = mix(-400, 380, come);
    var e = elephant(ex, g + 20, {size: 0.62, face: 1, step: come < 1 ? t * 0.5 : 0, regalia: true, sit: come >= 1 && s > 7});
    if (s < 7) { person(e.seat[0], e.seat[1], welPerson("noble", HH_KING, {id: "king", floor: "astride", face: 1, size: 0.62})); }
    var kx = mix(vx - 380, vx - 600, walk);
    if (s >= 7) {
      person(kx, g + 60, welPerson("noble", HH_KING, {id: "king", face: 1, size: 0.8, floor: kneel && walk <= 0 ? "cross" : undefined,
                                                      wai: kneel && !forgive ? 1 : undefined, tears: kneel ? 1 : 0, feel: forgive ? "happy" : "sad",
                                                      step: walk > 0 && walk < 1 ? t * 0.7 : 0, at: [vx, g - 300]}));
    }
    person(mix(vx - 230, vx - 450, walk), g + 70, hhBoy(13, {face: walk > 0 ? -1 : 1, feel: forgive ? "happy" : "concerned", step: walk > 0 && walk < 1 ? t * 0.7 : 0}));
    person(mix(vx, vx - 520, walk), g + 50, hhVimala({face: -1, feel: forgive ? "happy" : "sad", tears: kneel && !forgive ? 1 : 0, step: walk > 0 && walk < 1 ? t * 0.7 : 0,
                                                      at: [kx, g - 200]}));
    if (t > 30) {                                         // the old gardeners, called to come with her
      person(mix(vx + 200, vx - 300, walk), g + 40, welPerson("elder", H20_OLD_MAN, {id: "oldman", face: -1, feel: "happy", step: walk > 0 && walk < 1 ? t * 0.6 : 0}));
      person(mix(vx + 320, vx - 180, walk), g + 56, welPerson("grandmother", H20_OLD_WOMAN, {id: "oldwoman", face: -1, feel: "happy", step: walk > 0 && walk < 1 ? t * 0.6 : 0}));
    }
    sceneryAir(t, {butterfly: null, petals: [16, "#f6dce4", 7, 1], light: [0.4, 5]});
    hhCameraEnd();
  }
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H20_CUTS, H20_PLAN, H20_LINES, H20_LONG));
}
