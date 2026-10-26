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
// Where child k (0 to 9) is at second t as the ten jump in after Phrom, a quarter second apart from 27 s: a run along
// the bank to its edge, then a leap that comes down in the water where it holds on, beside neckX (the snake's neck).
// Gives back {x, y: its feet, run, leap: 0 to 1, swims: true once it is low enough to go behind the water}.
// e.g. c15ChildAt(28.9, 0, 1080).leap   // 0.5, high over the water
function c15ChildAt(t, k, neckX) {
  var from = 27 + 0.25 * k, run = between(t, from, from + 1.6), leap = between(t, from + 1.6, from + 2.2);
  var bank = cngHuddle(k);
  var water = [neckX + 80 + (k % 5) * 70 - Math.floor(k / 5) * 40, C15_SWIM + 230 * cngAgeSize(9 + (k % 4))];
  var edge = [water[0] - 160, CNG_BANK + 30];
  if (leap <= 0) { return {x: mix(bank[0], edge[0], run), y: mix(bank[1], edge[1], run), run: run, leap: 0, swims: false}; }
  return {x: mix(edge[0], water[0], leap), y: mix(edge[1], water[1], leap) - 90 * Math.sin(Math.PI * leap), run: 1, leap: leap,
          swims: leap > 0.6};
}

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
  cngRiverLife(t, {flushed: between(t, 13, 15), away: t - 15});   // and fly away again
  var hx = c15Head(t), neck = null, elephantAt = null;
  if (!changed && t > 12) {
    var snake = riverSnake(hx, C15_SWIM, {size: 0.85, face: -1, kind: "pearl"});
    neck = [snake.neck[0], snake.neck[1]];
  }
  if (changed) {                                           // the white elephant, swimming, Phrom on its neck
    var bob = 6 * Math.sin(t * 1.4), ex = C15_HELD + 120 - 60 * between(t, 34, 55);
    elephantAt = elephant(ex, C15_SWIM + 160 + bob, {size: 0.62, face: -1, colour: "#f1ddd3", cloth: "#c9962a",
                                                    trunk: 0.5 + 0.4 * Math.sin(t * 1.1), mouth: 0.2});
  }
  var leap = between(t, 22.4, 24.2);
  var inRiver = [];                                        // who is in the water now, drawn before the water over them
  if (t >= 24.2 && !changed) {
    inRiver.push(function () {                             // Phrom holding the snake by its neck
      c15InWater(neck[0] + 40, cngPerson("boy", CNG_PHROM, {id: "phrom", size: size, face: -1, feel: "concerned",
                                                            reachA: [neck[0], neck[1] - 6], reachB: [neck[0] - 20, neck[1] + 6]}), 10);
    });
  }
  for (var k = 0; k < 10; k++) {
    (function (k) {
      var at = c15ChildAt(t, k, neck ? neck[0] : C15_HELD), c = CNG_CHILDREN[k % CNG_CHILDREN.length];
      if (!at.swims) { return; }                           // still running, or high in the leap: drawn with the bank
      inRiver.push(function () {
        var look = cngPerson(c.kind, c.look, {id: "child" + k, size: cngAgeSize(9 + (k % 4)), face: at.leap < 1 ? 1 : -1,
                                              feel: changed ? "happy" : "fear",
                                              handA: k % 2 ? liftHand(liftEven(liftShare(0.8) * between(t, C15_CHANGE[1], C15_CHANGE[1] + 0.8))) : undefined});   // up for joy, eased
        if (at.leap < 1) { person(at.x, at.y, look); } else { c15InWater(at.x, look, 0); }
      });
    })(k);
  }
  var leaper = null;                                       // Phrom calling on the bank, then leaping: the end of his leap into
  if (t < 24.2) {                                         // the water is drawn with who is in it, before the water over them
    var calls = t > 14.2 && t < 19.6, land = [(neck || [C15_HELD])[0] + 40, C15_SWIM + 230 * size - 10];   // where he is in the water, holding on
    var px = mix(1260, land[0], leap), py = mix(CNG_BANK + 30, land[1], leap) - 110 * Math.sin(Math.PI * leap);
    leaper = {name: "phrom", kind: "person", x: px, y: py, draw: function () {
      var j = person(px, py, cngPerson("boy", CNG_PHROM, {id: "phrom", size: size, face: leap > 0 ? -1 : 1,
                                                         feel: t < 13 ? "thinking" : "angry",   // thinking hard (owner, 2026-10-25)
                                                         reachA: t < 21 ? [px - 40, py - 380 * size, between(t, 14.2, 14.5) * (1 - between(t, 19.3, 19.6))]   // his arm up as he calls, eased
                                                                 : [(neck || [C15_HELD])[0], (neck || [0, C15_SWIM])[1] - 6, leap],   // then out for the neck as he leaps
                                                         reachB: [(neck || [C15_HELD])[0] - 20, (neck || [0, C15_SWIM])[1] + 6, leap],
                                                         mouth: calls ? {open: 0.1 + 0.25 * Math.abs(Math.sin(t * 7)), wide: 0.6, round: 0.3} : undefined,
                                                         at: t < 12 ? [px + 300, py - 400] : [hx, C15_SWIM - 80]}));
      if (leap <= 0) { var w = cngLocal(j.wristA); elephantHook(pen, w[0], w[1] + 30 * size, size * 0.9, {angle: 0.12}); }
    }};
    if (leap > 0.6) { inRiver.push(leaper.draw); }
  }
  inRiver.forEach(function (f) { f(); });
  c15Water(t);
  pen.drawImage(river.near, 0, 0);
  if (changed && elephantAt) {                             // Phrom on its neck, over the water (the elephant swims in it)
    person(elephantAt.seat[0], elephantAt.seat[1], cngPerson("boy", CNG_PHROM, {id: "phromrides", size: size, face: -1, floor: "astride",
                                                                                feel: "happy", handA: liftHand(0.6 + 0.3 * Math.sin(t * 2))}));
  }
  var onBank = [];                                         // the children still on the bank, and Phrom before he leaps
  for (var c2 = 0; c2 < CNG_KIDS; c2++) {
    (function (k) {
      var at = k < 10 ? c15ChildAt(t, k, neck ? neck[0] : C15_HELD) : {x: cngHuddle(k)[0], y: cngHuddle(k)[1], run: 0};
      if (at.swims) { return; }
      var x = at.x, y = at.y, cc = CNG_CHILDREN[k % CNG_CHILDREN.length];
      onBank.push({name: "child" + k, kind: "person", x: x, y: y, draw: function () {
        person(x, y, cngPerson(cc.kind, cc.look, {id: "child" + k, size: cngAgeSize(9 + (k % 4)), face: 1,
                                                  step: at.run > 0 && at.run < 1 ? t / BEAT * 1.4 + k : 0,
                                                  feel: t > 14 && t < 22 ? "fear" : "concerned", at: [hx, C15_SWIM - 80]}));
      }});
    })(c2);
  }
  if (leaper && leap <= 0.6) { onBank.push(leaper); }
  drawByZ(onBank);
  cngBurst(t, C15_HELD + 60, C15_SWIM - 60, C15_CHANGE);
  cngFadeIn(t, 1);
}
