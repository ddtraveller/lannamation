// s09_saba.js - scene 9 of the film of Hong Hin: red seeds against gold (55 s). A lane of Varanasi by day: the six
// brothers play saba with pieces of gold, a row of them set up as targets. The boy watches; his mother brings him a
// pouch of red seeds; the brothers laugh. He throws, and throws: the gold falls row on row, and he carries it home.
var H09_LONG = 55;
var H09_SOUND = {calls: [[0.0, "shama", 0.2, 55.0]]};
var H09_LINES = [[2, 13.6, "H037"], [13.8, 20.1, "H038"], [20.3, 25.44, "H039"], [25.64, 35.18, "H040"], [35.38, 41.3, "H041"]];
// The lines as the scene was drawn to them; it plays to H09_LINES, Pan's voice (sets.js hhClock()).
var H09_PLAN = [[2, 8.2, "H037"], [9.6, 16.2, "H038"], [17.6, 21, "H039"], [22.6, 30.2, "H040"], [32, 39.4, "H041"]];
var H09_CUTS = [17.2, 31.4];
var H09_ROW = [1080, CNG_LANE_Y + 40];                  // the first gold piece of the target row; they go on to the right
var H09_THROWS = [33, 36, 39, 42, 45, 48];              // when each red seed flies (one piece falls to each)

// The lane, the six brothers, the row of gold. t: seconds; laugh: their feeling; down: how many pieces have fallen.
function h09Lane(t, feel, down, boy) {
  hhPlace("lane");
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 20, "day");
  pen.drawImage(hhLane("day"), 0, 0);              // textured, the wall's foot planted (owner, 2026-11-13)
  var list = [];
  for (var n = 0; n < 6; n++) {                          // the row of gold pieces, standing, or knocked flat
    (function (n) {
      var x = H09_ROW[0] + n * 70, y = H09_ROW[1];
      list.push({name: "gold " + n, kind: "thing", x: x, y: y, draw: function () {
        if (n < down) { pen.save(); pen.translate(x + 10, y); pen.rotate(1.2); sabaBean(0, 0); pen.restore(); } else { sabaBean(x, y); }
      }});
    })(n);
  }
  for (var k = 0; k < 6; k++) {
    (function (k) {
      var x = 700 + k * 120 + (k > 2 ? 520 : 0), y = CNG_LANE_Y + 80 + (k % 2) * 30;
      list.push({name: "son " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, hhSon(k, {face: x < H09_ROW[0] ? 1 : -1, feel: feel, at: boy ? [boy[0], boy[1] - 200] : [H09_ROW[0] + 160, H09_ROW[1]],
                               id: "son" + k}));
      }});
    })(k);
  }
  return list;
}

// Scene 9, the entry the film calls. From sets.js: hhSon(), hhBoy(), hhVimala(), hhCamera(), hhCuts(); whiteeel/sets.js
// welLane(); honghin.js sabaBean(), redSeed(), seedPouch().
function hhSceneSaba(t) {
  var said = t; t = hhClock(t, H09_PLAN, H09_LINES, H09_LONG);
  var down = H09_THROWS.filter(function (w) { return t > w + 0.8; }).length, bx = 300, by = CNG_LANE_Y + 100;
  if (t < H09_CUTS[0]) {                                // the brothers at play; the boy watching; his mother's pouch
    hhCamera(0.4, 900, 800, 1.2);
    var list = h09Lane(t, "happy", 0);
    var mx = mix(-100, bx - 130, between(t, 9.5, 13.5));
    list.push({name: "boy", kind: "person", x: bx, y: by, draw: function () { person(bx, by, hhBoy(13, {face: 1, feel: "thinking", at: [H09_ROW[0], H09_ROW[1] - 40]})); }});
    list.push({name: "vimala", kind: "person", x: mx, y: by - 20, draw: function () {
      person(mx, by - 20, hhVimala({face: 1, feel: "happy", step: t > 9.5 && t < 13.5 ? t * 0.7 : 0}));
      if (t > 13.5) { seedPouch(mx + 70, by - 140); }
    }});
    drawByZ(list);
    hhCameraEnd();
  } else if (t < H09_CUTS[1]) {                          // the brothers laugh; the boy sets the stakes
    hhCamera(1, 700, 820, 1.5);
    var l2 = h09Lane(t, t < 22.4 ? "laughing" : "angry", 0, [bx, by]);
    l2.push({name: "boy", kind: "person", x: bx + 220, y: by, draw: function () {
      person(bx + 220, by, hhBoy(13, {face: 1, feel: "neutral", mouth: welTalk(t, welSays(t, H09_PLAN, ["H040"])), at: [800, 760]}));
      seedPouch(bx + 100, by + 10);
    }});
    drawByZ(l2);
    hhCameraEnd();
  } else {                                               // the throws: a red seed flies; a gold piece falls
    hhCamera(0.6, 900, 820, 1.25);
    var l3 = h09Lane(t, down > 3 ? "sad" : "surprised", down, [bx, by]);
    var home = between(t, 50, 54);
    // Each throw as the owner's reference: the seed cocked by his head, the arm out up and forward, the wrist flicked
    // through (sets.js hhThrow()); his hand still between throws (2026-11-13: "make him stop waving").
    var release = null;
    l3.push({name: "boy", kind: "person", x: mix(bx + 200, -80, home), y: by, draw: function () {
      var x = mix(bx + 200, -80, home), look = {face: home > 0 ? -1 : 1, feel: "happy", step: home > 0 ? t * 0.8 : 0};
      var w = H09_THROWS.filter(function (w) { return t > w - 0.6 && t < w + 0.4; })[0];
      if (home <= 0 && w !== undefined) {
        var probe = hhJointsOf(function () { return person(x, by, hhBoy(13, look)); });
        var th = hhThrow(probe, 1, (t - (w - 0.6)) / 1.0);
        look.reachA = th.reach; look.wristA = th.wrist; look.grip = th.held;
        release = th.release;
        var j = person(x, by, hhBoy(13, look));
        if (th.held) { var hd = himmaJoint(j.handA); redSeed(hd[0], hd[1]); }
      } else {
        person(x, by, hhBoy(13, look));
        if (home <= 0) { release = hhThrow(hhJointsOf(function () { return person(x, by, hhBoy(13, look)); }), 1, 0.6).release; }
      }
    }});
    drawByZ(l3);
    H09_THROWS.forEach(function (w, n) {                  // each seed's arc, from where it left his hand
      var u = between(t, w, w + 0.8);
      if (u <= 0 || u >= 1 || !release) { return; }
      var x0 = release[0], y0 = release[1], x1 = H09_ROW[0] + n * 70, y1 = H09_ROW[1] - 20;
      redSeed(mix(x0, x1, u), mix(y0, y1, u) - 180 * Math.sin(u * Math.PI));
    });
    hhCameraEnd();
  }
  sceneryBeds(t, hhBottomPlants(9, {tall: 44, at: 1094}), {sway: 0.3});       // the second line: planted along the picture's foot
  hhPlaceAir(t);                                        // the place's air and framing (scenery pass)
  welFadeIn(t, 1.5);
  hhCuts(said, hhSaidAll(H09_CUTS, H09_PLAN, H09_LINES, H09_LONG));
}
