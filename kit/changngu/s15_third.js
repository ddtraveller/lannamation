// s15_third.js - scene 15 of the film of Chang Ngu: the third snake (55 s). On the bank Phrom thinks (the chronicle: the
// deva said three white elephants, but he has seen only snakes; "ชะรอยจักเป็นงู 3 ตัวนี้", these must be the sign); the
// third snake comes down the channel, pearl-white (the owner's pick); he lifts his hook and calls to the children
// ("ตายก็ตายด้วยกัน", if we die, we die together), leaps into the river and takes it by the neck; the children jump in
// after him; a ring of light and a burst of spray, and where the snake was a white elephant swims, Phrom on its neck,
// the children round it in the water (the candidates of 2026-10-22: "1 Phrom on its neck, 2 a ring of light and spray,
// 3 the white elephant").
var C15_LONG = 55;
var C15_SOUND = {calls: []};
var C15_LINES = [[1.4, 3.32, "C067"], [4.4, 11.16, "C068"], [11.36, 15.26, "C069"], [15.46, 23.18, "C070"], [23.38, 28.12, "C071"], [28.32, 32.39, "C072"], [34.2, 37.78, "C073"]];
var C15_SWIM = CNG_BANK - 54;                          // the water line in the channel before the bank
var C15_CHANGE = [31, 34];                             // the ring of light and the spray: the snake becomes the elephant
var C15_HELD = 1080;                                   // where the snake's head stops, held

// Where the third snake's head is at t: down the channel from the right to where Phrom holds it, then held there.
function c15Head(t) {
  return mix(WIDE + 500, C15_HELD, Math.min(1, between(t, 11, 19.5)));
}

// The river drawn over whoever is in it, from the water line down to the bank, so only their heads and shoulders show.
function c15Water(t) {
  csBand(pen, 0, C15_SWIM - 8, WIDE, CNG_BANK - C15_SWIM + 30, "#a68e66", "#8a7250");
  waves(pen, 0, C15_SWIM - 6, WIDE, CNG_BANK - C15_SWIM + 20, "rgba(250, 238, 210, 0.3)", t);
}

// Someone up to the chest in the river at x (the water line at C15_SWIM), drawn as a person standing lower.
function c15InWater(x, look, rise) {
  var size = look.size || 1, feet = C15_SWIM + 230 * size - (rise || 0);
  person(x, feet, look);
}


// Scene 15, the entry the film calls (SCENES): t, its own second, 0 to C15_LONG (55 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngRiver(), cngRiverLife(), CNG_BANK, cngPerson() with CNG_PHROM and CNG_CHILDREN,
// cngAgeSize(), cngLocal(); from naga.js riverSnake(); from beasts.js elephant(); from chiangsaen.js elephantHook(). Its
// words are C15_LINES (C067 to C073). Its z plan: the river's back, the snake or the elephant in the water, those in the
// water, the water over them, the near bank, those still on it, the burst over all.
function cngSceneThird(t) {
  var river = cngRiver(), size = cngAgeSize(13), changed = t >= (C15_CHANGE[0] + C15_CHANGE[1]) / 2;
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 50, CNG_CLOUDS.day);
  pen.drawImage(river.back, 0, 0);
  cngRiverLife(t, {flushed: between(t, 13, 15)});
  var hx = c15Head(t), neck = null, elephantAt = null;
  if (!changed && t > 12) {
    var snake = riverSnake(hx, C15_SWIM, {size: 0.85, face: -1, kind: "pearl"});
    neck = [snake.neck[0], snake.neck[1]];
  }
  if (changed) {                                           // the white elephant, swimming, Phrom on its neck
    var bob = 6 * Math.sin(t * 1.4), ex = C15_HELD + 120 - 60 * between(t, 34, 55);
    elephantAt = elephant(ex, C15_SWIM + 210 + bob, {size: 0.62, face: -1, colour: "#f1ddd3", cloth: "#c9962a",
                                                    trunk: 0.5 + 0.4 * Math.sin(t * 1.1), mouth: 0.2});
  }
  var leap = between(t, 22.4, 24.2), jumpIn = between(t, 27, 30);
  var inRiver = [];                                        // who is in the water now, drawn before the water over them
  if (t >= 24.2 && !changed) {
    inRiver.push(function () {                             // Phrom holding the snake by its neck
      c15InWater(neck[0] + 40, cngPerson("boy", CNG_PHROM, {id: "phrom", size: size, face: -1, feel: "concerned",
                                                            reachA: [neck[0], neck[1] - 6], reachB: [neck[0] - 20, neck[1] + 6]}), 10);
    });
  }
  for (var k = 0; k < 10; k++) {
    (function (k) {
      if (jumpIn * 10 <= k) { return; }
      var c = CNG_CHILDREN[k % CNG_CHILDREN.length], x = (neck ? neck[0] : C15_HELD) + 80 + (k % 5) * 70 - Math.floor(k / 5) * 40;
      inRiver.push(function () {
        c15InWater(x, cngPerson(c.kind, c.look, {id: "child" + k, size: cngAgeSize(9 + (k % 4)), face: -1,
                                                 feel: changed ? "happy" : "fear",
                                                 handA: changed && k % 2 ? liftHand(0.8) : undefined}), 0);
      });
    })(k);
  }
  inRiver.forEach(function (f) { f(); });
  c15Water(t);
  pen.drawImage(river.near, 0, 0);
  if (changed && elephantAt) {                             // Phrom on its neck, over the water (the elephant swims in it)
    person(elephantAt.seat[0], elephantAt.seat[1], cngPerson("boy", CNG_PHROM, {id: "phromrides", size: size, face: -1, floor: "astride",
                                                                                feel: "happy", handA: liftHand(0.6 + 0.3 * Math.sin(t * 2))}));
  }
  var onBank = [];                                         // the children still on the bank, and Phrom before he leaps
  for (var c2 = 0; c2 < 14; c2++) {
    (function (k) {
      if (k < 10 && jumpIn * 10 > k) { return; }
      var x = 120 + (k % 7) * 70, y = CNG_BANK + 90 + Math.floor(k / 7) * 34, cc = CNG_CHILDREN[k % CNG_CHILDREN.length];
      onBank.push({name: "child " + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, cngPerson(cc.kind, cc.look, {id: "child" + k, size: cngAgeSize(9 + (k % 4)), face: 1,
                                                  feel: t > 14 && t < 22 ? "fear" : "concerned", at: [hx, C15_SWIM - 80]}));
      }});
    })(c2);
  }
  if (t < 24.2) {
    var calls = t > 14.2 && t < 19.6, px = mix(1260, C15_HELD + 40, leap), py = mix(CNG_BANK + 30, C15_SWIM + 60, leap) - 110 * Math.sin(Math.PI * leap);
    onBank.push({name: "phrom", kind: "person", x: px, y: py, draw: function () {
      var j = person(px, py, cngPerson("boy", CNG_PHROM, {id: "phrom", size: size, face: leap > 0 ? -1 : 1,
                                                         feel: t < 13 ? "concerned" : "angry",
                                                         reachA: calls ? [px - 40, py - 380 * size] : undefined,
                                                         mouth: calls ? {open: 0.1 + 0.25 * Math.abs(Math.sin(t * 7)), wide: 0.6, round: 0.3} : undefined,
                                                         at: t < 12 ? [px + 300, py - 400] : [hx, C15_SWIM - 80]}));
      if (leap <= 0) { var w = cngLocal(j.wristA); elephantHook(pen, w[0], w[1] + 30 * size, size * 0.9, {angle: 0.12}); }
    }});
  }
  drawByZ(onBank);
  cngBurst(t, C15_HELD + 60, C15_SWIM - 60, C15_CHANGE);
  cngFadeIn(t, 1);
}
