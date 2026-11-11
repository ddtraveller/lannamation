// s16_crime.js - scene 16 of the film of Hong Hin: the brothers' crime (60 s). The swan flies home through the clouds,
// three palaces following it: a white prasat, a palace hall, a lotus pavilion. At the river they stay on the far bank;
// the boy brings his grandmother across. At dusk the six brothers close round him; a cut to the night: they ride away on
// an elephant with the old woman, and in the weeds the boy lies still.
var H16_LONG = 60;
var H16_SOUND = {calls: [[0, "wind", 0.2, 10], [10.5, "frogs", 0.25, 49.5], [36, "crickets", 0.25, 24], [38, "elephant-trumpet", 0.3]]};
var H16_LINES = [[2, 9.6, "H071"], [11, 17.6, "H072"], [19, 27.2, "H073"], [28.6, 36.2, "H074"]];
var H16_CUTS = [10.2, 18.6, 27.6];

// The river at an hour: the Kok's plain (whiteeel/sets.js), "dusk" or "night". t: seconds.
function h16River(t, hour) {
  pen.drawImage(welSky(hour === "night" ? "clear" : "sunset"), 0, 0);
  if (hour !== "night") { scenerySun(t, 1580, 470, 36, {glow: 10, colour: "255, 180, 120"}); }
  welFar(pen, WEL_KOK);
  vimana(380, WEL_KOK - 40, t, {kind: "prasat", size: 0.16});      // the three palaces on the far bank
  vimana(700, WEL_KOK - 50, t + 2, {kind: "hall", size: 0.14});
  vimana(1000, WEL_KOK - 40, t + 4, {kind: "lotus", size: 0.15});
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok);
  sceneryWaterSurface(t, kok);
  if (hour === "night") { hhNight(0.6, t); }
  else { pen.fillStyle = "rgba(150, 70, 60, 0.22)"; pen.fillRect(0, 0, WIDE, 1080); }
}

// Scene 16, the entry the film calls. From sets.js: hhHeaven(), hhBoy(), hhSon(), HH_GRAN, hhNight(); honghin.js vimana();
// himmaphan.js hongHin(); whiteeel/sets.js welPlain(), welKokWater().
function hhSceneCrime(t) {
  var bank = WEL_KOK_BANK + 120;
  if (t < H16_CUTS[0]) {                                // home through the clouds, the palaces following
    hhHeaven(t, 1080);
    var hs = hongHin(mix(1500, 1100, between(t, 0, 10)), 380 + 20 * Math.sin(t), t, {size: 1.3, face: -1});
    person(hs.behind[0], hs.behind[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: -1, feel: "happy"}));
    person(hs.seat[0], hs.seat[1], hhBoy(13, {floor: "astride", face: -1, feel: "happy"}));
    vimana(hs.seat[0] + 420, 560, t, {kind: "prasat", size: 0.24, face: -1});
    vimana(hs.seat[0] + 760, 470, t + 2, {kind: "hall", size: 0.22, face: -1});
    vimana(hs.seat[0] + 1060, 600, t + 4, {kind: "lotus", size: 0.22, face: -1});
  } else if (t < H16_CUTS[1]) {                          // across the river with his grandmother
    h16River(t, "dusk");
    var w = between(t, 11, 17), x = mix(1300, 760, w);
    person(x, bank, welPerson("grandmother", HH_GRAN, {id: "gran", face: -1, step: w > 0 && w < 1 ? t * 0.6 : 0, feel: "happy"}));
    person(x + 110, bank + 10, hhBoy(13, {face: -1, step: w > 0 && w < 1 ? t * 0.7 : 0, feel: "happy"}));
  } else if (t < H16_CUTS[2]) {                          // at dusk the six close round him
    var close = between(t, 20, 26);
    hhCamera(0.7, 800, 820, 1.4);
    h16River(t, "dusk");
    var bx = 820;
    person(bx - 260, bank + 20, welPerson("grandmother", HH_GRAN, {id: "gran", face: 1, feel: "fear", at: [bx, bank - 200]}));
    person(bx, bank + 10, hhBoy(13, {face: -1, feel: close > 0.5 ? "fear" : "surprised", at: [bx + 200, bank - 200]}));
    for (var k = 0; k < 6; k++) {
      var a = k / 6 * Math.PI * 2, r = mix(520, 170, close), sx = bx + Math.cos(a) * r * 1.2, sy = bank + 10 + Math.sin(a) * r * 0.25;
      person(sx, sy, hhSon(k, {face: sx < bx ? 1 : -1, feel: "angry", id: "son" + k, step: close > 0 && close < 1 ? t * 0.9 + k : 0,
                               at: [bx, bank - 200], reachA: close >= 1 ? [sx + (sx < bx ? 90 : -90), bank - 300] : undefined}));
    }
    hhCameraEnd();
  } else {                                               // night: they ride away with her; the boy lies in the weeds
    var s = t - H16_CUTS[2], ride = between(s, 1, 34);
    h16River(t, "night");
    pen.save(); pen.translate(520, bank + 70); pen.rotate(-Math.PI / 2);   // the boy lying still
    person(0, 160, hhBoy(13, {face: 1, feel: "sleepy", blink: 1}));
    pen.restore();
    for (var g = 0; g < 9; g++) { sceneryReeds(380 + g * 40, bank + 120, 0.5 + 0.1 * (g % 3), t, "front"); }
    var ex = mix(1500, 200, ride);
    var e = elephant(ex, bank - 40, {size: 0.62, face: -1, step: t * 0.5, cloth: "#8a2a3a"});
    person(e.seat[0], e.seat[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: -1, feel: "sad", tears: 1}));
    person(e.seat[0] + 70, e.seat[1] + 6, hhSon(0, {floor: "astride", face: -1, id: "rider"}));
    for (var n = 1; n < 6; n++) { person(ex + 150 + n * 90, bank + (n % 2) * 26, hhSon(n, {face: -1, step: t * 0.8 + n, id: "walk" + n})); }
    sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
  }
  welFadeIn(t, 1.5);
  hhCuts(t, H16_CUTS);
}
