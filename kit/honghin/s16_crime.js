// s16_crime.js - scene 16 of the film of Hong Hin: the brothers' crime (60 s). The swan flies home through the clouds,
// three palaces following it: a white prasat, a palace hall, a lotus pavilion. At the river they stay on the far bank;
// the boy brings his grandmother across. At dusk the six brothers close round him; a cut to the night: they ride away on
// an elephant with the old woman, and in the weeds the boy lies still.
var H16_LONG = 60;
var H16_SOUND = {calls: [[0.0, "wind", 0.2, 9.26], [10.13, "frogs", 0.25, 49.87], [35.72, "crickets", 0.25, 24.28], [37.73, "elephant-trumpet", 0.3]]};
var H16_LINES = [[2, 8.96, "H071"], [11, 20.46, "H072"], [20.66, 28.3, "H073"], [28.6, 36.31, "H074"], [37.4, 42.99, "H097"]];
// The lines as the scene was drawn to them; it plays to H16_LINES, Pan's voice (sets.js hhClock()).
var H16_PLAN = [[2, 9.6, "H071"], [11, 17.6, "H072"], [19, 27.2, "H073"], [28.6, 36.2, "H074"], [37.4, 44.4, "H097"]];   // H097 added 2026-11-13
var H16_CUTS = [10.2, 18.6, 27.6];

// The river at an hour: the Kok's plain (whiteeel/sets.js), "dusk" or "night". t: seconds.
function h16River(t, hour) {
  hhPlace("river-" + hour);
  pen.drawImage(welSky(hour === "night" ? "clear" : "sunset"), 0, 0);
  if (hour !== "night") { scenerySun(t, 1580, 470, 36, {glow: 10, colour: "255, 180, 120"}); }
  pen.drawImage(hhRangeAt(WEL_KOK - 10, hour === "night" ? "night" : "dusk"), 0, 0);
  vimana(380, WEL_KOK - 40, t, {kind: "prasat", size: 0.16});      // the three palaces on the far bank
  vimana(700, WEL_KOK - 50, t + 2, {kind: "hall", size: 0.14});
  vimana(1000, WEL_KOK - 40, t + 4, {kind: "lotus", size: 0.15});
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok);
  if (hour !== "night") { h16Under(t, kok); }
  sceneryWaterSurface(t, kok);
  if (hour !== "night") { hhFishLeap(t, 7, 1240); hhFishLeap(t, 41, 560); decorate(t, H16_LIFE, "front"); }   // fish and birds (owner, 2026-11-13)
  sceneryBeds(t, hhRiverBank(), {sway: 0.3});           // the near bank planted, not ruled (owner, 2026-11-13)
  if (hour === "night") { hhNight(0.6, t); }
  else { pen.fillStyle = "rgba(150, 70, 60, 0.22)"; pen.fillRect(0, 0, WIDE, 1080); }
}

// The river's life by day (owner, 2026-11-13: "Display interesting fish and birds from the kit here"): a gourami, a
// flying barb and a snakehead leaping, a kingfisher on a reed that dives, an egret wading, a turtle coming up to breathe.
var H16_LIFE = [
  {name: "gourami", kind: "fish", look: {kind: "gourami", size: 0.7}, course: [[3, 1260, 650, "hide"], [4.2, 1420, 652, "hide"], [9, 1500, 648, "hide"], [10, 1600, 650, "hide"]]},
  {name: "barb", kind: "fish", look: {kind: "flying", size: 0.6}, course: [[12, 700, 660, "hide"], [13, 840, 662, "hide"], [21, 420, 655, "hide"], [21.8, 320, 656, "hide"]]},
  {name: "snakehead", kind: "fish", look: {kind: "snakehead", size: 0.8}, course: [[16, 1660, 668, "hide"], [17.4, 1500, 672, "hide"]]},
  {name: "kingfisher", kind: "kingfisher", look: {size: 0.7}, course: [[0, 1780, 690], [8, 1780, 690], [9, 1700, 640, "dive"], [10, 1690, 660, "dive"], [11, 1780, 690], [26, 1780, 690]]},
  {name: "egret", kind: "egret", look: {size: 0.8}, course: [[0, 260, 735], [6, 330, 738, "peck"], [12, 330, 738], [18, 420, 742, "peck"], [27, 420, 742]]},
];
// Under the water, as the hero film's pond fish swim (owner, 2026-11-13: the turtle was on top of the water): drawn
// after the water's depths and before its surface, half seen through it, a turtle paddling and a fish gliding by.
function h16Under(t, kok) {
  pen.save();
  pen.beginPath(); pen.rect(0, WEL_KOK + 6, WIDE, WEL_KOK_BANK - WEL_KOK - 6); pen.clip();
  pen.globalAlpha *= 0.72;
  var tu = between(t, 4, 26), tx = mix(560, 1060, tu), ty = WEL_KOK + 36 + 5 * Math.sin(t * 0.7);
  goldTurtle(tx, ty, t, {swim: true, size: 0.62, face: 1});
  var fu = (t * 0.06) % 1;
  nativeFish(pen, mix(WIDE + 80, -80, fu), WEL_KOK + 58 + 6 * Math.sin(t * 1.1), 0.8, -1, "gourami", t);
  nativeFish(pen, mix(-80, WIDE + 80, (fu + 0.4) % 1), WEL_KOK + 70, 0.6, 1, "barb", t);
  pen.restore();
  pen.save(); pen.globalAlpha *= 0.25; pen.fillStyle = "#cfe4e8";           // the water's skin over them, its glints
  pen.fillRect(0, WEL_KOK + 6, WIDE, WEL_KOK_BANK - WEL_KOK - 6); pen.restore();
}
// Scene 16, the entry the film calls. From sets.js: hhHeaven(), hhBoy(), hhSon(), HH_GRAN, hhNight(); honghin.js vimana();
// himmaphan.js hongHin(); whiteeel/sets.js welPlain(), welKokWater().
function hhSceneCrime(t) {
  var said = t; t = hhClock(t, H16_PLAN, H16_LINES, H16_LONG);
  var bank = WEL_KOK_BANK + 120;
  if (t < H16_CUTS[0]) {                                // home through the clouds, the palaces following
    hhHeaven(t, 1080);
    var hs = hongHin(mix(1500, 1100, between(t, 0, 10)), 380 + 20 * Math.sin(t), t, {size: 1.3, face: -1, rider: true});
    person(hs.behind[0], hs.behind[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: -1, feel: "happy"}));
    person(hs.seat[0], hs.seat[1], hhBoy(13, {floor: "astride", face: -1, feel: "happy"}));
    hs.near();
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
    // all in the order of their depth, the brothers at the back of the ring behind the others; their arms at their sides
    // (the owner, 2026-11-12: the two highest up were in front, and they waved)
    var ring = [{name: "gran", kind: "person", x: bx - 260, y: bank + 20, draw: function () {
                  person(bx - 260, bank + 20, welPerson("grandmother", HH_GRAN, {id: "gran", face: 1, feel: "fear", at: [bx, bank - 200]}));
                }},
                {name: "boy", kind: "person", x: bx, y: bank + 10, draw: function () {
                  person(bx, bank + 10, hhBoy(13, {face: -1, feel: close > 0.5 ? "fear" : "surprised", at: [bx + 200, bank - 200]}));
                }}];
    for (var k = 0; k < 6; k++) {
      (function (k) {
        var a = k / 6 * Math.PI * 2, r = mix(520, 170, close), sx = bx + Math.cos(a) * r * 1.2, sy = bank + 10 + Math.sin(a) * r * 0.25;
        ring.push({name: "son " + k, kind: "person", x: sx, y: sy, draw: function () {
          person(sx, sy, hhSon(k, {face: sx < bx ? 1 : -1, feel: "angry", id: "son" + k, step: close > 0 && close < 1 ? t * 0.9 + k : 0,
                                   at: [bx, bank - 200]}));
        }});
      })(k);
    }
    drawByZ(ring);
    hhCameraEnd();
  } else {                                               // night: they ride away with her; the boy lies in the weeds
    var s = t - H16_CUTS[2], ride = between(s, 1, 27);   // a little quicker to the left (34 until 2026-11-13)
    h16River(t, "night");
    pen.save(); pen.translate(520, bank + 70); pen.rotate(-Math.PI / 2);   // the boy lying still
    person(0, 160, hhBoy(13, {face: 1, feel: "sleepy", blink: 1}));
    pen.restore();
    for (var g = 0; g < 9; g++) { sceneryReeds(380 + g * 40, bank + 120, 0.5 + 0.1 * (g % 3), t, "front"); }
    var ex = mix(1500, 200, ride);
    for (var n = 1; n < 6; n++) {                        // the five on foot behind the elephant, further back (owner, 2026-11-12)
      person(ex + 150 + n * 90, bank - 70 - (n % 2) * 16, hhSon(n, {face: -1, step: t * 0.8 + n, id: "walk" + n, size: 0.72}));
    }
    // its steps from the ground it covers, one stride to every 162 pixels at this size (beasts.js amble()'s pace), so
    // its feet do not slide (owner, 2026-11-13: "the elephant looks like its walking on ice"): slower steps than before
    var e = elephant(ex, bank - 40, {size: 0.62, face: -1, step: (1500 - ex) / (120 * 1.35 * 0.62), cloth: "#8a2a3a"});
    person(e.seat[0], e.seat[1], welPerson("grandmother", HH_GRAN, {id: "gran", floor: "astride", face: -1, feel: "sad", tears: 1}));
    person(e.seat[0] + 70, e.seat[1] + 6, hhSon(0, {floor: "astride", face: -1, id: "rider"}));
    sceneryMoon(t, HH_MOON[0], HH_MOON[1], HH_MOON[2], {});
  }
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H16_CUTS, H16_PLAN, H16_LINES, H16_LONG));
}
