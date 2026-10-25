// s14_snakes.js - scene 14 of the film of Chang Ngu: two snakes (55 s). On the Mae Khong's bank, the children waiting,
// Phrom at the water's edge. Down the channel between the bank and the sandbar comes the first snake, as big as a rice
// granary, mottled (the chronicle: "ใหญ่เท่าเทนซาวข้าว เป็นเบื้อเป็นเหลื้องยาว"; naga.js riverSnake, the plain kind at
// its largest); the birds on the bar burst up; the children scream and scramble back from the water and huddle; it goes
// by. Then the second, as thick as a palm trunk, smooth and shining (the chronicle: "ใหญ่ประมาณเท่าต้นตาล มีวรรณเลื่อมสว่าง");
// they shake with fear as it passes; and Phrom stands alone at the edge, looking after it.
var C14_LONG = 55;
var C14_SOUND = {calls: []};
var C14_LINES = [[1.4, 5.92, "C061"], [6.12, 10.97, "C062"], [12.0, 15.5, "C063"], [21.0, 28.88, "C064"], [29.08, 33.08, "C065"], [33.28, 37.96, "C066"]];
var C14_SWIM = CNG_BANK - 54;                          // the snakes' water line, the channel before the bank
var C14_SNAKES = [[3, 21, 1.6, {kind: "plain"}],       // from, to (seconds), size, look
                  [22, 41, 1.0, {kind: "plain", body: "#a89060", blot: null, belly: "#f0e4c0", late: 0.4}]];

// Where a snake's head is at second t, or null when it is not in the river: from the right edge to past the left.
function c14Head(snake, t) {
  var u = between(t, snake[0], snake[1]);
  return u > 0 && u < 1 ? mix(WIDE + 500 * snake[2], -900 * snake[2], u) : null;
}

// How frightened the children are at t: 1 while a snake is close to them, falling off as it goes.
function c14Fear(t) {
  var most = 0;
  C14_SNAKES.forEach(function (s) {
    var x = c14Head(s, t);
    if (x !== null) { most = Math.max(most, 1 - Math.min(1, Math.abs(x - 700) / 900)); }
  });
  return most;
}

// Scene 14, the entry the film calls (SCENES): t, its own second, 0 to C14_LONG (55 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngRiver(), cngRiverLife(), CNG_BANK, cngPerson() with CNG_PHROM and CNG_CHILDREN,
// cngAgeSize(); from naga.js riverSnake(). Its words are C14_LINES (C061 to C066). Its z plan: the river's back and its
// life, the snakes in the water (only what is above the water shows), the near bank, then by drawByZ the children
// and Phrom by their feet.
function cngSceneSnakes(t) {
  var river = cngRiver(), fear = c14Fear(t), first = between(t, 5, 7);
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 20, CNG_CLOUDS.day);
  pen.drawImage(river.back, 0, 0);
  cngRiverLife(t, {flushed: first, away: t - 7});       // the birds rise and fly away (owner, 2026-10-25)
  C14_SNAKES.forEach(function (s) {
    var x = c14Head(s, t);
    if (x !== null) { riverSnake(x, C14_SWIM, Object.assign({size: s[2], face: -1}, s[3])); }
  });
  pen.drawImage(river.near, 0, 0);
  var sprites = [], back = between(t, 6, 9) * (1 - between(t, 44, 52));   // they scramble back from the water and huddle
  for (var k = 0; k < CNG_KIDS; k++) {
    (function (k) {
      var wait = cngWaiting(k), huddle = cngHuddle(k);
      var x = mix(wait[0], huddle[0], back), y = mix(wait[1], huddle[1], back);
      var shake = fear > 0.2 ? 4 * fear * Math.sin(t * 40 + k) : 0;
      sprites.push({name: "child " + k, kind: "person", x: x + shake, y: y, draw: function () {
        var c = CNG_CHILDREN[k % CNG_CHILDREN.length];
        person(x + shake, y, cngPerson(c.kind, c.look, {id: "child" + k, size: cngAgeSize(9 + (k % 4)), face: 1,
                                                        step: back > 0 && back < 1 ? t / BEAT * 1.5 + k : 0,
                                                        feel: fear > 0.15 ? "fear" : t > 40 ? "concerned" : "surprised",
                                                        handA: k % 2 ? liftHand(liftEven(liftShare(0.7) * between(fear, 0.3, 0.6))) : undefined,   // up as fear comes, at an even pace
                                                        at: [1200, C14_SWIM - 60]}));
      }});
    })(k);
  }
  var px = 1260, py = CNG_BANK + 30;
  sprites.push({name: "phrom", kind: "person", x: px, y: py, draw: function () {
    var j = person(px, py, cngPerson("boy", CNG_PHROM, {id: "phrom", size: cngAgeSize(13), face: 1,
                                                        feel: fear > 0.4 ? "surprised" : t > 40 ? "concerned" : undefined,
                                                        at: [mix(1500, 400, between(t, 22, 41)), C14_SWIM - 80]}));
    var w = cngLocal(j.wristA);
    elephantHook(pen, w[0], w[1] + 30 * cngAgeSize(13), cngAgeSize(13) * 0.9, {angle: 0.12});
  }});
  drawByZ(sprites);
  cngFadeIn(t, 1);
}
