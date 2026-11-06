// s12_heads.js - scene 12 of the film of the White Eel: the village heads (50 s). Three shots, through black, late in the
// morning: from outside the walls the village heads come in a line along the shore to the new water's edge and stand
// staring, her house small out on the water; then on a bamboo raft they pole out to her house, and she comes down her
// ladder to them and tells them of the eel, the young man and the three roars, and they ask how big the eel was; and
// last one of them looks back across the water at the long groove where the eel was dragged, a stream now running down
// into the water: the Mae Nam Lak, its name in gold.
var W12_LONG = 50;
var W12_SOUND = {calls: [[0, "dawn", 0.12, 50]]};
var W12_LINES = [[1.2, 7.6, "W043"], [9.0, 13.8, "W044"], [16.4, 22.2, "W045"], [24.0, 27.4, "W046"], [29.0, 35.8, "W047"], [39.6, 46.8, "W048"]];
var W12_CUTS = [14.6, 38.4];
var W12_SHORE = 860;                                   // the near shore's edge in the first shot
var W12_SPEAKS = {heads: [[24.0, 27.4]], widow: [[16.6, 22.0], [29.0, 35.8]]};

// The new water with a near shore of grass at shore (its edge's y), its far edge at top (WEL_WATER unless told), as
// scenery.js takes a water. Made once for each.
var W12_WATERS = {};
function w12Water(shore, top) {
  var far = top || WEL_WATER, key = shore + " " + far;
  if (W12_WATERS[key]) { return W12_WATERS[key]; }
  var line = [], near = [];
  for (var k = 0; k <= 10; k++) { line.push([-400 + k * (WIDE + 800) / 10, far + (k % 2 ? 1.5 : 0)]); }
  for (k = 10; k >= 0; k--) { near.push([-400 + k * (WIDE + 800) / 10, shore + 8 * Math.sin(k * 1.9) + 5 * dice(k + 60)]); }
  W12_WATERS[key] = {edge: [[-400, shore]].concat(line, near), top: line, line: far, left: -200, right: WIDE + 200, foot: shore + 20,
                     depths: ["#7a968a", "#3c5a4e"], mirror: [[far, 1], [far + 70, 0.85], [far + 170, 0.6]], tint: "70, 96, 84", rings: [], mist: null};
  return W12_WATERS[key];
}

// The land, the water and the sky of late morning; shore: the near shore's y (none: water to the foot); house: [x, base,
// size, waterline] of her house in the water, and who (a function) drawn on it before the water's face goes over.
function w12Set(t, shore, house, who) {
  pen.drawImage(welSky("day"), -200, 0, WIDE + 400, 1080);
  welClouds(t + 140, "day");
  welFar(pen, WEL_WATER);
  if (shore) { sceneryMeadow(pen, -40, WIDE + 40, shore - 30, 1080, {seed: 21}); }
  var water = shore ? w12Water(shore) : welMarshWater();
  sceneryWaterDepths(water);
  function onIt() { if (house) { welWidowHouse(pen, house[0], house[1], house[2]); } if (who) { who(); } }
  onIt();
  sceneryWaterSurface(t, water);
  if (house) { welAbove(house[3], onIt); welWadeRings(house[0], house[3], 260 * house[2], t * 0.4); }
  natGlitter(t, 1300, WEL_WATER, shore || 1080, 0.5, "255, 250, 230");
}

// A raft of bamboo poles lashed side by side, floating at (x, y), long wide.
function w12Raft(x, y, wide) {
  for (var k = 0; k < 5; k++) {
    var py = y - 8 + k * 4;
    pen.fillStyle = k % 2 ? "#b89a5a" : "#a8884a";
    pen.beginPath(); pen.ellipse(x, py, wide / 2, 5, 0, 0, 7); pen.fill();
    pen.strokeStyle = "rgba(60, 40, 20, 0.5)"; pen.lineWidth = 1; pen.stroke();
  }
  pen.fillStyle = "#6a5030";
  [-0.35, 0, 0.35].forEach(function (u) { pen.fillRect(x + u * wide - 2, y - 12, 4, 20); });   // the lashings
}

// Shot 1: they come along the shore to the water's edge and stand staring, her house small out on the water.
function w12Shore(t) {
  w12Set(t, W12_SHORE, [1260, 690, 0.42, 668]);
  var sprites = [];
  WEL_HEADS.forEach(function (h, k) {
    var come = between(t, 0.6 + k * 0.6, 7.6 + k * 0.6), x = mix(-180 - k * 160, 420 + k * 210, come), y = W12_SHORE + 50 + (k % 2) * 22;
    sprites.push({name: "head " + k, kind: "person", x: x, y: y, draw: function () {
      person(x, y, welPerson(h[0], h[1], {id: "head" + k, face: 1, step: come > 0 && come < 1 ? t / BEAT * 0.9 + k : 0,
                                         feel: come >= 1 ? "surprised" : undefined, at: [1260, 620]}));
    }});
  });
  drawByZ(sprites);
}

// Shot 2: on the raft at her house; she comes down her ladder to them; they talk.
function w12Raft2(t) {
  var house = [1100, 820, 1.4, 760], top = house[1] - WEL_HOUSE_TOP * house[2], ladder = house[0] + WEL_LADDER * house[2] + 14;
  var arrive = between(t, 14.8, 19.0), rx = mix(-300, ladder - 330, arrive), ry = 790;
  var down = between(t, 17.6, 20.6), wx = ladder, wy = mix(top + 6, house[3] - 18, down);
  w12Set(t, null, house, function () {
    person(wx, wy, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: -1, holding: null, size: WEL_WIDOW.size * house[2] / WEL_YARD[2],
      step: down > 0 && down < 1 ? t / BEAT * 0.7 : 0, at: [rx, ry - 200],
      mouth: welTalk(t, W12_SPEAKS.widow.some(function (s) { return t > s[0] && t < s[1]; }))}));
  });
  w12Raft(rx, ry, 360);
  WEL_HEADS.forEach(function (h, k) {
    var x = rx - 120 + k * 110, y = ry - 4 + (k % 2) * 6, poling = k === 0 && arrive < 1;
    var look = {id: "raft" + k, face: 1, size: h[1].size * 0.9, at: [wx, wy - 160], feel: arrive >= 1 && k === 2 ? "sad" : undefined,
                mouth: welTalk(t + k, W12_SPEAKS.heads.some(function (s) { return t > s[0] && t < s[1]; }) && k === 1)};
    if (poling) { look.reachA = [x - 30, y - 150]; look.reachB = [x - 10, y - 190]; }
    var j = person(x, y, welPerson(h[0], h[1], look));
    if (poling) {                                       // the pole, from his hands down into the water
      var w = cngLocal(j.wristB);
      pen.save(); pen.strokeStyle = "#8a6a3a"; pen.lineWidth = 4;
      pen.beginPath(); pen.moveTo(w[0] + 10, w[1] - 60); pen.lineTo(w[0] - 70, ry + 70); pen.stroke(); pen.restore();
    }
  });
}

// Shot 3: across the water, the long groove where the eel was dragged, a stream now running down into the water; one
// of the heads on the raft looking back at it; its name in gold.
function w12Stream(t) {
  pen.drawImage(welSky("day"), -200, 0, WIDE + 400, 1080);
  welClouds(t + 140, "day");
  welFar(pen, WEL_WATER);
  sceneryMeadow(pen, -40, WIDE + 40, WEL_WATER - 10, 1080, {seed: 23});   // the land the city stood on, beyond the water's edge
  var stream = new Path2D();                            // the stream, winding down from the far side into the water
  stream.moveTo(1560, WEL_WATER + 10);
  stream.bezierCurveTo(1380, 660, 1560, 720, 1240, 760);
  stream.bezierCurveTo(1060, 790, 1020, 820, 960, 860);
  pen.save();
  pen.lineCap = "round";
  [[40, "#a8865a"], [30, "#4e6e70"], [14, "#6e9496"]].forEach(function (b) { pen.strokeStyle = b[1]; pen.lineWidth = b[0]; pen.stroke(stream); });
  pen.strokeStyle = "rgba(230, 240, 240, " + (0.4 + 0.2 * Math.sin(t * 3)).toFixed(3) + ")"; pen.lineWidth = 3; pen.setLineDash([18, 30]);
  pen.lineDashOffset = -t * 40;                         // its water running down
  pen.stroke(stream);
  pen.restore();
  var water = w12Water(1120, 850);                      // the water this side, the stream running down into it
  sceneryWaterDepths(water);
  sceneryWaterSurface(t, water);
  var h = WEL_HEADS[1];
  w12Raft(400, 1046, 420);                              // he stands on the raft, looking back
  person(380, 1040, welPerson(h[0], h[1], {id: "looker", face: 1, size: 1.0, at: [1200, 760], feel: "awe"}));
  cngGoldName("แม่น้ำลาก", "the Mae Nam Lak, the dragged river", 1180, 230, between(t, 41.4, 42.4) * (1 - between(t, 48, 49.4)));
}

// Scene 12, the entry the film calls (SCENES): t, its own second, 0 to W12_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welClouds(), welFar(), WEL_WATER, welMarshWater(), welWidowHouse(),
// WEL_HOUSE_TOP, WEL_LADDER, welAbove(), welWadeRings(), welPerson() with WEL_HEADS and WEL_WIDOW, welTalk(); from
// changngu/sets.js cngLocal(), cngGoldName(), cngCutsOver(). Its words are W12_LINES (W043 to W048).
function welSceneHeads(t) {
  if (t < W12_CUTS[0]) { w12Shore(t); }
  else if (t < W12_CUTS[1]) { w12Raft2(t); }
  else { w12Stream(t); }
  sceneryAir(t, {butterfly: null, petals: null, light: [0.4, 12]});
  cngCutsOver(t, W12_CUTS);
  welFadeIn(t, 1.5);
}
