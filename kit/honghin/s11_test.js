// s11_test.js - scene 11 of the film of Hong Hin: the king's test (50 s). The palace: the king commands his six "heroes"
// to bring back his mother or die. By night at the orchard the six offer the boy more gold. Then the march: three
// thousand men to a great river, where the six sit down on the bank; the stone swan rises over the army and is gone into
// the clouds, and the soldiers go down on their knees.
var H11_LONG = 50;
var H11_SOUND = {calls: [[0.0, "shama", 0.15, 11.38], [12.27, "crickets", 0.2, 7.39], [19.66, "frogs", 0.25, 30.34]]};
var H11_LINES = [[2, 10.36, "H049"], [12.8, 19.03, "H050"], [20, 26.16, "H051"], [29.4, 34.72, "H052"]];
// The lines as the scene was drawn to them; it plays to H11_LINES, Pan's voice (sets.js hhClock()).
var H11_PLAN = [[2, 11.2, "H049"], [12.8, 18, "H050"], [20, 27.8, "H051"], [29.4, 35.4, "H052"]];
var H11_CUTS = [12.2, 19.4];

// A painted man's face for soldier n (the owner, 2026-11-13: "truly different faces with different head shapes and
// lines for the eyes, noses and mouths"): one of the kit's six painted men (people.js MURAL_MEN), its jaw, brows, eyes,
// nose and smile changed by a seeded draw, as castMix() changes a woman's. Gives back the "man" settings for a look.
function h11Face(n) {
  var names = ["farmer", "drummer", "swordsman", "townsman", "lue", "elder"], m = peopleDraw(300 + n * 7);
  var f = JSON.parse(JSON.stringify(MURAL_MEN[names[n % 6]].man));
  f.face = Object.assign({}, f.face);
  f.face.jaw = {cheek: m.between(-3, 4), corner: [m.between(-4, 4), m.between(-2, 3)], chin: [m.between(-2, 3), m.between(-2, 4)], far: m.between(-1, 2)};
  f.face.brows = Object.assign({}, f.face.brows, {lift: m.between(-2, 2.5), arch: m.between(-1.5, 3), thick: m.between(0.8, 1.5)});
  f.face.eyes = Object.assign({}, f.face.eyes, {open: m.between(-0.8, 1), tilt: m.between(-0.05, 0.18), gaze: [m.between(-1, 1.5), m.between(-0.5, 0.8)]});
  f.face.mu = Object.assign({}, f.face.mu, {nose: m.pick(["now", "lanna", "between", "low", "button", "exact"]), tara: m.between(0.1, 0.6)});
  f.face.feel = {smile: m.between(0, 0.4)};
  f.face.hairdo = "knot"; f.hands = "normal";
  delete f.holds; delete f.pose;
  return f;
}
// The soldiers, each his own: skin, the shape of his face, eyes, lips, height and build.
var H11_MEN = [{skin: "#e8c4a0", north: "round", eyes: 1, lips: 1, head: 1.06, scale: 1},
               {skin: "#c89a72", north: "square", eyes: 0.88, lips: 1.15, head: 0.9, scale: 1.06, build: 0.3, beard: "#2a2018"},
               {skin: "#dcb08a", north: "full", eyes: 1.08, lips: 1.05, head: 1.16, scale: 0.95, body: "fat"},
               {skin: "#b8865e", north: "broad", eyes: 0.94, lips: 1.24, head: 1.1, scale: 1.02, lid: "crease"},
               {skin: "#f0d0b0", north: "soft", eyes: 1.16, lips: 0.86, head: 0.88, scale: 0.92},
               {skin: "#cfa07a", north: "square", eyes: 1.04, lips: 0.95, head: 0.94, scale: 1.08, build: 0.45, age: 0.3},
               {skin: "#a87a52", north: "round", eyes: 0.86, lips: 1.12, head: 1.0, scale: 0.98, age: 0.5, beard: "#3a3028"}];
// The river camp: the Kok's plain (whiteeel/sets.js) by day, the army along the bank, the six sitting. t: seconds;
// kneel: 0 to 1, the soldiers going down on their knees.
function h11Camp(t, kneel) {
  hhPlace("river-day");
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 10, "day");
  pen.drawImage(hhRangeAt(WEL_KOK - 10), 0, 0);
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok);
  sceneryWaterSurface(t, kok);
  hhFishLeap(t, 9, 1300); hhFishLeap(t, 33, 820);       // a fish leaps now and then (owner, 2026-11-13)
  sceneryBeds(t, hhRiverBank(), {sway: 0.3});           // the near bank planted, not ruled (owner, 2026-11-13)
  var list = [];
  for (var n = 0; n < 14; n++) {                         // the soldiers, in ranks along the bank
    (function (n) {
      var x = 120 + (n % 7) * 150 + (n > 6 ? 70 : 0), y = WEL_KOK_BANK + 120 + (n > 6 ? 120 : 0);
      list.push({name: "soldier " + n, kind: "person", x: x, y: y, draw: function () {
        // each his own body (owner, 2026-11-13: "unique bodies with slightly varying skin tone, shape of face, eyes and
        // height/build"): H11_MEN[n % 7], the near rank's turned about so no two side by side are alike
        var m = H11_MEN[(n * 3 + (n > 6 ? 2 : 0)) % H11_MEN.length], face = h11Face(n);
        // painted men can only stand (people.js: no seated man yet), so they stand in awe, spear in hand, looking up as the
        // swan rises (the narration says nothing of kneeling)
        var size = (0.62 + (n > 6 ? 0.06 : 0)) * m.scale, k = size / 0.62, gx = x + 30 * k, top = y - 380 * k;
        var sl = welPerson("soldier", {size: size, skin: m.skin, body: m.body, build: m.build, age: m.age, beard: m.beard, man: face},
                               {id: "sol" + n, face: 1, feel: kneel > 0 ? "awe" : "neutral", reachA: [gx - 2, y - 175 * k], grip: true,
                                at: kneel > 0 ? [1300, 200] : [1500, 800]});
        var hj = hhJointsOf(function () { return person(x, y, sl); }), hd = himmaJoint(hj.handA);
        gx = hd[0] + 2;                                   // the spear through his hand as it falls
        pen.save(); pen.lineCap = "round";                   // the spear, planted, its shaft behind his hand
        pen.strokeStyle = "#5a3a1e"; pen.lineWidth = 5; pen.beginPath(); pen.moveTo(gx, y + 4); pen.lineTo(gx, top); pen.stroke();
        pen.fillStyle = "#c8ccd4"; pen.strokeStyle = "#4a4c52"; pen.lineWidth = 1.2;
        pen.beginPath(); pen.moveTo(gx - 6, top + 4); pen.lineTo(gx, top - 34); pen.lineTo(gx + 6, top + 4); pen.closePath(); pen.fill(); pen.stroke();
        pen.fillStyle = "#b8294a"; pen.fillRect(gx - 3, top + 4, 6, 8);   // a red tassel at its neck
        pen.restore();
        person(x, y, sl);
      }});
    })(n);
  }
  for (var k = 0; k < 6; k++) {                          // the six, sitting on the bank, afraid of the water
    (function (k) {
      var x = 1240 + k * 105, y = WEL_KOK_BANK + 110 + (k % 2) * 30;
      list.push({name: "son " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, hhSon(k, {face: k % 2 ? -1 : 1, floor: "cross", feel: kneel > 0 ? "awe" : "fear", id: "son" + k,
                               at: kneel > 0 ? [1300, 200] : [1400, WEL_KOK]}));
      }});
    })(k);
  }
  drawByZ(list);
}

// Scene 11, the entry the film calls. From sets.js: hhCourt(), hhSon(), hhBoy(), hhOrchardAt(); whiteeel/sets.js welFar(),
// welPlain(), welKokWater(); himmaphan.js hongHin(), hongHinReins().
function hhSceneTest(t) {
  var said = t; t = hhClock(t, H11_PLAN, H11_LINES, H11_LONG);
  var p = CNG_PALACE;
  if (t < H11_CUTS[0]) {                                // the king commands
    var sons = [];
    for (var k = 0; k < 6; k++) {
      (function (k) {
        var x = p[0] - 360 + k * 140, y = 1010 + (k % 2) * 20;
        sons.push({name: "son " + k, kind: "person", x: x, y: y, draw: function () {
          person(x, y, hhSon(k, {face: x < p[0] ? 1 : -1, floor: "cross", wai: 1, feel: t > 8 ? "fear" : "concerned", id: "son" + k, at: [p[0], 620]}));
        }});
      })(k);
    }
    hhCamera(0.6, p[0], 760, 1.35);
    hhCourt(t, [[0, welPerson("noble", HH_KING, {id: "king", floor: "cross", face: 1, size: 0.8, feel: "angry", at: [p[0], 1000],
                                                 mouth: welTalk(t, t > 6 && t < 11)})]], sons);
    hhCameraEnd();
  } else if (t < H11_CUTS[1]) {                          // by night at the orchard: more gold for the boy
    hhCamera(0.9, HH_ORCHARD_HOUSE[0] - 300, 820, 1.6);
    hhOrchardAt(t, "night");
    var bx = HH_ORCHARD_HOUSE[0] - 160;
    person(bx, 990, hhBoy(13, {face: -1, feel: "thinking", at: [bx - 300, 700]}));
    for (var s2 = 0; s2 < 3; s2++) {
      person(bx - 260 - s2 * 120, 1000 + (s2 % 2) * 20, hhSon(s2, {face: 1, feel: "concerned", id: "son" + s2, at: [bx, 700],
                                                                   reachA: s2 === 0 ? [bx - 140, 820] : undefined}));
    }
    pen.fillStyle = "#c8a050"; pen.beginPath(); pen.ellipse(bx - 130, 830, 26, 30, 0, 0, 7); pen.fill(); pen.strokeStyle = "#6e4612"; pen.stroke();
    sceneryLampLight(t, bx - 40, 760, 990, {reach: 260, strength: 0.7, seed: 6});
    hhCameraEnd();
  } else {                                               // the camp; the swan rises over the army; they kneel
    var s = t - H11_CUTS[1], rise = between(t, 30, 38), kneel = between(t, 33, 36);
    hhCamera(0.5, 960, 700, 1.15);
    h11Camp(t, kneel);
    if (rise > 0) {
      var sx = mix(300, 2400, rise), sy = mix(820, -260, rise);   // all the way off the picture (owner, 2026-11-12)
      var h = hongHin(sx, sy, t, {size: 1.6, rider: true});
      var hands = [h.seat[0] + 50, h.seat[1] - 55];
      person(h.seat[0], h.seat[1], hhBoy(13, {floor: "astride", face: 1, feel: "happy", reachA: hands, reachB: [hands[0] - 10, hands[1] + 6]}));
      hongHinReins(h, hands);
      h.near();
    }
    hhCameraEnd();
  }
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H11_CUTS, H11_PLAN, H11_LINES, H11_LONG));
}
