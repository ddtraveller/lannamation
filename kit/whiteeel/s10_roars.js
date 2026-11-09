// s10_roars.js - scene 10 of the film of the White Eel: three roars (60 s). Inside the widow's house at night, by a lamp
// hung from the beam (the room as the Chang Ngu film painted one, changngu/sets.js cngRoom("night")). After dusk a deep
// roar: the room shakes, the lamp swings; she sits up, remembers his words, and lies down again. At midnight a second:
// she gets up and goes to the door, stops, and comes back. Before dawn the third, the loudest; then, outside, she stands
// at the top of her stairs and looks out into grey mist, and does not go down. Nothing of the city is shown falling
// (story.py). The roars are sounds (W10_SOUND, for sounds.py), each louder.
var W10_LONG = 67.2;
var W10_ROARS = [[3.0, 0.5], [23.81, 0.75], [39.86, 1.0]];   // [second, how strong]
var W10_SOUND = {calls: [[0, "crickets", 0.1, 50.68], [3.0, "roar", 0.5], [23.81, "roar", 0.75], [39.86, "roar", 1.0], [57.12, "dove", 0.12]]};
var W10_LINES = [[5.4, 14.72, "W035"], [14.99, 21.92, "W036"], [25.41, 36.4, "W037"], [41.26, 47.07, "W038"], [51.86, 57.71, "W039"]];
var W10_CUTS = [22.81, 50.68];
var W10_MAT = [760, CNG_FLOOR + 40];                   // where she lies
var W10_HANG = [1040, CNG_BEAM];                       // where the lamp hangs from the beam
var W10_DOOR = 1500;                                   // where she goes toward the door

// How much the room shakes at second t (the roars, each dying away). Gives back [dx, dy].
function w10Shake(t) {
  var x = 0, y = 0;
  W10_ROARS.forEach(function (r) {
    var u = t - r[0];
    if (u < 0 || u > 3) { return; }
    var a = 9 * r[1] * Math.exp(-u * 1.6);
    x += a * Math.sin(t * 47); y += a * 0.6 * Math.sin(t * 61 + 1);
  });
  return [x, y];
}

// The hanging lamp's swing at second t, an angle, after each roar.
function w10Swing(t) {
  return W10_ROARS.reduce(function (a, r) { var u = t - r[0]; return u < 0 ? a : a + 0.35 * r[1] * Math.exp(-u * 0.45) * Math.sin(u * 2.6); }, 0);
}

// The lamp hung from the beam on its cord, swinging; its light. Gives back where the flame is.
function w10Lamp(t) {
  var a = w10Swing(t), long = 230, fx = W10_HANG[0] + long * Math.sin(a), fy = W10_HANG[1] + long * Math.cos(a);
  pen.save();
  pen.strokeStyle = "#8a6a4a"; pen.lineWidth = 3;
  pen.beginPath(); pen.moveTo(W10_HANG[0], W10_HANG[1]); pen.lineTo(fx, fy); pen.stroke();
  pen.restore();
  pratheep(pen, fx, fy + 30, 1.6, t, 2, {});
  sceneryLampLight(t, fx, fy + 6, CNG_FLOOR + 40, {reach: 320, strength: 0.85, seed: 10});
  return [fx, fy];
}

// The widow in her room: lying (u 0), sitting up (u 1); or standing at x, walking (walking true).
function w10Lying(t, up, feel) {
  if (up < 1) {                                         // lying on her side on the mat, a cloth over her
    pen.save();
    pen.globalAlpha = 1 - up;
    pen.translate(W10_MAT[0] + 110, W10_MAT[1] - 16);
    pen.rotate(-Math.PI / 2);
    person(0, 0, welPerson("grandmother", WEL_WIDOW, {id: "widowlying", face: -1, holding: null, feel: "sleepy", blink: 1}));
    pen.restore();
    pen.save();
    pen.globalAlpha = 1 - up;
    pen.fillStyle = "#4a5a78";
    pen.beginPath(); pen.moveTo(W10_MAT[0] - 30, W10_MAT[1] - 4);
    pen.quadraticCurveTo(W10_MAT[0] + 50, W10_MAT[1] - 50, W10_MAT[0] + 130, W10_MAT[1] - 26);
    pen.lineTo(W10_MAT[0] + 130, W10_MAT[1]); pen.closePath(); pen.fill();
    pen.restore();
  }
  if (up > 0) {
    pen.save();
    pen.globalAlpha = up;
    person(W10_MAT[0], W10_MAT[1], welPerson("grandmother", WEL_WIDOW, {id: "widow", face: 1, holding: null, floor: "side", feel: feel,
                                                                       at: [W10_DOOR, CNG_FLOOR - 200]}));
    pen.restore();
  }
}

// Inside: the room, the hanging lamp, the widow; the room shaking at each roar.
function w10Inside(t) {
  var shake = w10Shake(t);
  pen.save();
  pen.translate(shake[0], shake[1]);
  pen.translate(WIDE / 2, 640);
  pen.scale(1.4, 1.4);
  pen.translate(-960, -(CNG_FLOOR - 120));
  pen.drawImage(cngRoom("night"), 0, 0);
  pen.fillStyle = "rgba(8, 6, 20, " + (t < W10_CUTS[0] ? 0.38 : 0.5) + ")";
  pen.fillRect(0, 0, WIDE, 1600);
  w10Lamp(t);
  if (t < W10_CUTS[0]) {                                // after dusk: she sits up, remembers, lies down again
    var up = between(t, 3.4, 4.2) * (1 - between(t, 18.28, 19.32));
    w10Lying(t, up, t < 10.44 ? "fear" : "thinking");
  } else {                                              // midnight and before dawn: up, to the door, and back
    var go = between(t, 25.21, 29.13), back = between(t, 31.36, 35.33), rise = between(t, 24.21, 25.01);
    if (t < 36.26) {
      if (go <= 0) { w10Lying(t, rise, "fear"); }
      else {
        var x = mix(mix(W10_MAT[0] + 40, W10_DOOR, go), W10_MAT[0] + 40, back), walking = (go > 0 && go < 1) || (back > 0 && back < 1);
        person(x, CNG_FLOOR + 40, welPerson("grandmother", WEL_WIDOW, {id: "widowup", face: back > 0 ? -1 : 1, holding: null,
          step: walking ? t / BEAT * 0.7 : 0, feel: go >= 1 && back <= 0 ? "thinking" : "fear", at: [W10_DOOR + 200, CNG_FLOOR - 220]}));
      }
    } else {                                            // she lies down; the third roar, and she gets up and goes
      var up2 = (1 - between(t, 36.26, 37.26)) + between(t, 40.26, 41.06);
      w10Lying(t, Math.min(1, up2), "fear");
    }
  }
  pen.restore();
  if (t > 42.66) {                                         // the grey before dawn coming in
    pen.fillStyle = "rgba(170, 180, 200, " + (0.3 * between(t, 42.66, 50.68)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}

// Outside: the top of her stairs at grey dawn, mist over everything; she stands and looks out, and does not go down.
function w10Stairs(t) {
  var top = WEL_YARD[1] - WEL_HOUSE_TOP * WEL_YARD[2], ladder = WEL_YARD[0] + WEL_LADDER * WEL_YARD[2];
  pen.drawImage(welSky("clear"), 0, 0);
  pen.save();                                           // closer on her and her house
  pen.translate(1310, 560); pen.scale(1.3, 1.3); pen.translate(-ladder + 60, -top);   // the yard still past both edges
  pen.drawImage(welYard("dusk"), 0, 0, WIDE, 1080);
  pen.fillStyle = "rgba(176, 186, 204, 0.55)";           // the grey mist over it all
  pen.fillRect(-WIDE, -1080, 3 * WIDE, 3 * 1080);
  softMist(t, 700, 200, 0.7, 31, "214, 220, 232");
  natSteam(t, -400, WIDE + 400, 760, {count: 50, rise: 120, wide: 180, life: 10, lean: 80, alpha: 0.32, flat: 0.1, patch: 0.9, colour: "220, 226, 236", seed: 7});
  person(ladder - 10, top + 4, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: -1, holding: null, feel: "awe", at: [-200, top + 60]}));
  pen.restore();
  softMist(t + 7, 900, 160, 0.5, 37, "222, 228, 238");
}

// Scene 10, the entry the film calls (SCENES): t, its own second, 0 to W10_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welPerson() with WEL_WIDOW, welYard(), welWidowHouse(), WEL_YARD; from changngu/sets.js:
// cngRoom("night"), CNG_FLOOR, CNG_BEAM, cngCutsOver(); from pieces.js pratheep(). Its words are W10_LINES.
function welSceneRoars(t) {
  if (t < W10_CUTS[1]) { w10Inside(t); } else { w10Stairs(t); }
  cngCutsOver(t, W10_CUTS);
  welFadeIn(t, 1.5);
}
