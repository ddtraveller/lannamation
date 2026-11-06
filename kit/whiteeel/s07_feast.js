// s07_feast.js - scene 7 of the film of the White Eel: the feast (40 s). Three shots, through black: the palace yard,
// the eel lying in the court and the old king on his dais pointing out to the lanes, and people going off this way
// and that with its pieces on banana leaves (it is cut where the picture does not see); dusk in a lane of Yonok, smoke
// going up from every kitchen, lamps lit on the verandas and families eating together on mats before their houses;
// and last, the widow's yard at dusk, the far roofs smoking and lit, and her house dark, nothing brought, she alone
// at the foot of her ladder.
var W07_LONG = 40;
var W07_SOUND = {calls: [[3.0, "hens", 0.12], [11.0, "crickets", 0.14, 29], [30.0, "dog", 0.1]]};
var W07_LINES = [[1.2, 8.4, "W022"], [12.4, 18.6, "W023"], [26.4, 32.4, "W024"]];
var W07_CUTS = [11.0, 24.0];
var W07_LANE_HOUSES = [[260, 880, 0.7], [760, 870, 0.66], [1300, 880, 0.72], [1760, 870, 0.64]];   // changngu/sets.js cngLane()'s

// A piece of the eel on a banana leaf, carried at (x, y): the leaf folded under, the pale meat on it.
function w07Leaf(x, y) {
  pen.save();
  pen.fillStyle = "#4f8a3a";
  pen.beginPath(); pen.ellipse(x, y, 30, 9, -0.1, 0, 7); pen.fill();
  pen.strokeStyle = "#3a6a2a"; pen.lineWidth = 1.2;
  pen.beginPath(); pen.moveTo(x - 28, y + 1); pen.lineTo(x + 28, y - 3); pen.stroke();
  pen.fillStyle = "#f4ece4";
  pen.beginPath(); pen.ellipse(x - 4, y - 7, 18, 7, 0, 0, 7); pen.fill();
  pen.strokeStyle = "rgba(180, 150, 150, 0.6)"; pen.stroke();
  pen.restore();
}

// A mat with a little round tray of food on it (a khantoke), at (x, y).
function w07Tray(x, y) {
  oval(x, y, 64, 14, "#c8a86a");
  oval(x, y - 6, 34, 8, "#8a3a2a");
  oval(x, y - 9, 30, 6, "#a8483a");
  [[-14, -11, "#f4ece4"], [4, -12, "#e8d080"], [16, -10, "#6a9a4a"]].forEach(function (d) { oval(x + d[0], y + d[1], 7, 3.5, d[2]); });
}

// Shot 1: the court; the old king points; the pieces go off on leaves.
function w07Court(t) {
  var p = CNG_PALACE, dais = hoKhamDais(p[1], p[2]), floor = hoKhamFloor(p[1], p[2]);
  pen.drawImage(welSky("day"), 0, 0);
  welClouds(t + 50, "day");
  pen.drawImage(cngCourt(), 0, 0);
  cngBeds(t, "court", "back");
  var sprites = [
    {name: "hall, back", kind: "palace", z: "set", y: dais - 1, draw: function () { cngPalace("back"); }},
    {name: "the king", kind: "person", z: "set", x: p[0], y: dais, draw: function () {
      person(p[0], dais, welPerson("noble", Object.assign({size: 0.8}, WEL_OLD_KING), {id: "mahachaichana", floor: "cross", face: -1,
        reachA: t > 1.6 && t < 6 ? [p[0] - 120, dais - 150, between(t, 1.6, 2.2)] : undefined, mouth: welTalk(t, t > 1.8 && t < 4.6), at: [p[0] - 600, 900]}));
    }},
    {name: "hall, front", kind: "palace", z: "set", y: dais + 1, draw: function () { cngPalace("front"); }},
    {name: "eel", kind: "beast", x: 640, y: floor + 70, draw: function () { whiteEel(330, floor + 70, t, {caught: true, size: 0.56, face: -1}); }}
  ];
  for (var k = 0; k < 8; k++) {
    (function (k) {
      var left = k % 2 === 0, go = between(t, 3 + k * 0.7, 9 + k * 0.7), from = 760 + (k % 4) * 60, y = floor + 90 + (k % 3) * 22;
      var x = mix(from, left ? -160 : WIDE + 160, go), kind = ["maiden", "farmer", "weaver", "villager", "boy", "fellow", "buakham", "inta"][k];
      if (go <= 0 || go >= 1) { return; }
      sprites.push({name: "carrier " + k, kind: "person", x: x, y: y, draw: function () {
        var face = left ? -1 : 1, size = kind === "boy" ? 0.5 : 0.7;
        var j = person(x, y, welPerson(kind, {size: size}, {id: "carrier" + k, face: face, step: t / BEAT * 0.9 + k, feel: "happy",
                                                           reachA: [x + face * 40 * size / 0.7, y - 150 * size / 0.7], reachB: [x + face * 30 * size / 0.7, y - 146 * size / 0.7]}));
        var w = cngLocal(j.wristA);
        w07Leaf(w[0] + face * 6, w[1] - 6);
      }});
    })(k);
  }
  drawByZ(sprites);
  cngBeds(t, "court", "frame");
}

// Shot 2: dusk in a lane: smoke from every kitchen, lamps lit, families eating on mats before their houses.
function w07Lane(t) {
  pen.drawImage(welSky("sunset"), 0, 0);
  welClouds(t + 90, "dusk");
  pen.drawImage(cngLane("day"), 0, 0);
  pen.fillStyle = "rgba(150, 70, 90, 0.26)";           // the dusk over it
  pen.fillRect(0, 0, WIDE, 1080);
  W07_LANE_HOUSES.forEach(function (h, k) {
    welSmoke(t + k * 2, h[0] - 40 * h[2], h[1] - 300 * h[2], {rise: 220, lean: 60, wide: 30, alpha: 0.5, colour: "236, 226, 232", count: 16});
    sceneryLampLight(t + k, h[0] - 90 * h[2], h[1] - 150 * h[2], h[1], {});
  });
  var sprites = [];
  [[520, 905, 0], [1040, 900, 1], [1560, 905, 2]].forEach(function (m, n) {   // a family round each tray
    sprites.push({name: "tray " + n, kind: "thing", x: m[0], y: m[1], draw: function () { w07Tray(m[0], m[1]); }});
    [["weaver", -1, -90, 0], ["farmer", 1, 90, 6], ["girl", -1, -40, 16]].forEach(function (who, w) {
      var x = m[0] + who[2], y = m[1] + who[3] - 4;
      sprites.push({name: "eater " + n + w, kind: "person", x: x, y: y, draw: function () {
        var size = who[0] === "girl" ? 0.42 : 0.66;
        person(x, y, welPerson(who[0], {size: size}, {id: "eater" + n + w, face: -who[1], floor: "cross", feel: "happy",
                                                    reachA: Math.sin(t * 1.6 + n + w) > 0.4 ? [m[0], m[1] - 14] : undefined,
                                                    mouth: welTalk(t + w, Math.sin(t * 0.8 + n * 2 + w) > 0.5)}));
      }});
    });
  });
  drawByZ(sprites);
  sceneryAir(t, {butterfly: null, petals: null, light: [0.3, 8]});
}

// Shot 3: the widow's yard at dusk: far roofs smoking and lit, her house dark, she alone at the ladder's foot.
function w07Yard(t) {
  pen.drawImage(welSky("sunset"), 0, 0);
  welClouds(t + 90, "dusk");
  pen.drawImage(welYard("dusk"), 0, 0, WIDE, 1080);
  pen.fillStyle = "rgba(120, 60, 90, 0.3)";
  pen.fillRect(0, 0, WIDE, 1080);
  [[160, 0.34], [420, 0.3], [640, 0.32]].forEach(function (h, k) {   // the far houses by the rampart: smoke and lamps
    welSmoke(t + k * 3, h[0], 662 - 300 * h[1], {rise: 140, lean: 40, wide: 18, alpha: 0.45, colour: "236, 226, 232", count: 12});
    var lx = h[0] - 40 * h[1], ly = 662 - 150 * h[1], glow = pen.createRadialGradient(lx, ly, 1, lx, ly, 22);   // a lamp, small and far
    glow.addColorStop(0, "rgba(255, 210, 130, 0.9)"); glow.addColorStop(1, "rgba(255, 210, 130, 0)");
    pen.fillStyle = glow; pen.fillRect(lx - 22, ly - 22, 44, 44);
  });
  var foot = [WEL_YARD[0] + WEL_LADDER * WEL_YARD[2] - 40, WEL_YARD[1] + 26];
  person(foot[0], foot[1], welPerson("grandmother", WEL_WIDOW, {id: "widow", face: -1, floor: "side", holding: null, feel: "sad",
                                                               at: [400, 560]}));
  pen.fillStyle = "rgba(20, 16, 30, " + (0.25 * between(t, 24, 40)).toFixed(3) + ")";   // the night coming
  pen.fillRect(0, 0, WIDE, 1080);
}

// Scene 7, the entry the film calls (SCENES): t, its own second, 0 to W07_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welClouds(), welYard(), WEL_YARD, WEL_LADDER, welPerson() with WEL_OLD_KING
// and WEL_WIDOW, welSmoke(), welTalk(); from changngu/sets.js: cngCourt(), cngPalace(), CNG_PALACE, cngLane(), cngBeds(),
// cngLocal(), cngCutsOver(); from chiangsaen.js whiteEel(), hoKhamDais(), hoKhamFloor(). Its words are W07_LINES.
function welSceneFeast(t) {
  if (t < W07_CUTS[0]) { w07Court(t); }
  else if (t < W07_CUTS[1]) { w07Lane(t); }
  else { w07Yard(t); }
  cngCutsOver(t, W07_CUTS);
  welFadeIn(t, 1.5);
}
