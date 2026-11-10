// s10_roars.js - scene 10 of the film of the White Eel: three roars (60 s). Inside the widow's house at night, by a lamp
// hung from the beam (the room as the Chang Ngu film painted one, changngu/sets.js cngRoom("night")). After dusk a deep
// roar: the room shakes, the lamp swings; she sits up, remembers his words, and lies down again. At midnight a second:
// she gets up and goes to the door, stops, and comes back. Before dawn the third, the loudest; then, outside, she stands
// at the top of her stairs and looks out into the storm, and does not go down. Nothing of the city is shown falling
// (story.py). The roars are sounds (W10_SOUND, for sounds.py), each louder.
// A storm all night (the owner, 2026-11-10: "When the widow is waiting through the night show a big rain storm outside
// with lightning and add sound effects like thunder. When she goes outside to stand at the top part of her house and
// look out it should be dark and stormy and the rain should mostly obscure the view of the city"): rain through her
// window, and at each stroke the sky white in it and a bolt, the room lit cold for a moment, the thunder after it
// (picked from two: this, or the sky lit whole and the rain blowing in); outside, black cloud and rain so thick the
// city is all but gone in it, water already lying between it and her house, mist over the water (picked, with
// "substantially more rain", the water and the mist added). The strokes fall between the roars (W10_STRIKES).
var W10_LONG = 67.2;
var W10_ROARS = [[3.0, 0.5], [23.81, 0.75], [39.86, 1.0]];   // [second, how strong]
var W10_STRIKES = [9.6, 16.9, 30.6, 45.4, 52.6, 58.4, 63.6];   // the lightning: none on a roar
var W10_SOUND = {calls: [[0, "rain", 0.16, 50.68], [50.68, "rain", 0.34, 16.52], [3.0, "roar", 0.5], [23.81, "roar", 0.75], [39.86, "roar", 1.0],
                         [10.3, "thunder", 0.56], [17.5, "thunder", 0.7], [31.2, "thunder", 0.7], [45.9, "thunder", 0.77],
                         [52.9, "thunder", 0.98], [59.1, "thunder", 0.77], [64.0, "thunder", 0.84]]};   // indoors the rain is muffled
var W10_LINES = [[5.4, 14.72, "W035"], [14.99, 21.92, "W036"], [25.41, 36.4, "W037"], [41.26, 47.07, "W038"], [51.86, 57.71, "W039"]];
var W10_CUTS = [22.81, 50.68];
var W10_MAT = [760, CNG_FLOOR + 40];                   // where she lies
var W10_HANG = [1040, CNG_BEAM];                       // where the lamp hangs from the beam
var W10_DOOR = 1500;                                   // where she goes toward the door

// The lightning's light at second t, 0 to 1: each stroke's flash dying fast, flickering, with a dip in it.
function w10Flash(t) {
  return W10_STRIKES.reduce(function (a, s) {
    var u = t - s;
    if (u < 0 || u > 1.2) { return a; }
    return Math.max(a, Math.exp(-u * 4) * (0.6 + 0.4 * Math.abs(Math.sin(u * 40))) * (u > 0.12 && u < 0.2 ? 0.4 : 1));
  }, 0);
}
// Which stroke is lit at second t (its number in W10_STRIKES), for its bolt's shape.
function w10Stroke(t) { var k = -1; W10_STRIKES.forEach(function (s, n) { if (t >= s) { k = n; } }); return k; }
// Rain: count streaks falling slant through the box (x0, y0, wide, tall); look {colour, width, long, lean, fall}.
function w10Rain(t, x0, y0, wide, tall, count, look) {
  pen.save();
  pen.strokeStyle = look.colour || "rgba(200, 212, 235, 0.38)";
  pen.lineWidth = look.width || 1.6;
  pen.lineCap = "round";
  var long = look.long || 36, lean = look.lean || -0.28, fall = look.fall || 1300, seed = look.seed || 0;
  pen.beginPath();
  for (var i = 0; i < count; i++) {
    var y = y0 + ((dice(seed + i * 3 + 1) * (tall + long) + t * fall * (0.85 + 0.3 * dice(seed + i * 3 + 2))) % (tall + long)) - long;
    var x = x0 + dice(seed + i * 3 + 3) * (wide + tall * 0.3) - lean * (y - y0);
    pen.moveTo(x, y); pen.lineTo(x + lean * long, y + long);
  }
  pen.stroke();
  pen.restore();
}
// A bolt: a jagged stroke down from (x, y), tall, a fork off it; seed its shape.
function w10Bolt(x, y, tall, seed) {
  pen.save();
  pen.strokeStyle = "rgba(240, 244, 255, 0.95)"; pen.lineWidth = 3; pen.shadowColor = "rgba(190, 210, 255, 0.9)"; pen.shadowBlur = 18;
  pen.lineJoin = "round";
  var px = x, py = y, fork = null;
  pen.beginPath(); pen.moveTo(px, py);
  for (var n = 1; n <= 9; n++) {
    px += (dice(seed + n) - 0.5) * 50; py += tall / 9;
    pen.lineTo(px, py);
    if (n === 4) { fork = [px, py]; }
  }
  pen.stroke();
  pen.lineWidth = 1.6; pen.beginPath(); pen.moveTo(fork[0], fork[1]);
  for (n = 1; n <= 4; n++) { pen.lineTo(fork[0] + n * 18 + (dice(seed + 20 + n) - 0.5) * 20, fork[1] + n * tall / 14); }
  pen.stroke();
  pen.restore();
}
// The storm in her window (in the room's frame: CNG_WINDOW): dark, the rain, and at a stroke the sky white and a bolt.
function w10WindowStorm(t) {
  var w = CNG_WINDOW, f = w10Flash(t), k = w10Stroke(t);
  pen.save();
  pen.beginPath(); pen.rect(w[0] + 5, w[1] + 5, w[2] - 10, w[3] - 10); pen.clip();
  pen.fillStyle = "rgba(6, 10, 22, 0.55)"; pen.fillRect(w[0], w[1], w[2], w[3]);
  if (f > 0) {
    pen.globalCompositeOperation = "screen";
    pen.fillStyle = "rgba(190, 205, 255, " + (0.9 * f).toFixed(3) + ")"; pen.fillRect(w[0], w[1], w[2], w[3]);
    pen.globalCompositeOperation = "source-over";
    if (f > 0.3) { w10Bolt(w[0] + 120 + 160 * dice(k + 11), w[1] - 10, 260, k * 7 + 3); }
  }
  w10Rain(t, w[0] - 60, w[1], w[2] + 60, w[3], 160, {colour: "rgba(190, 205, 232, " + (0.35 + 0.3 * f).toFixed(2) + ")"});
  pen.restore();
  for (var n = 1; n < 6; n++) { pen.fillStyle = "#2a1a10"; pen.fillRect(w[0] + n * w[2] / 6 - 2.5, w[1], 5, w[3]); }   // the bars over it
}
// The flash in the room, cold, from the window's side (over the whole sheet).
function w10RoomFlash(t) {
  var f = w10Flash(t);
  if (f <= 0) { return; }
  var r = pen.createRadialGradient(1500, 300, 50, 1500, 300, 1500);
  r.addColorStop(0, "rgba(175, 195, 255, " + (0.42 * f).toFixed(3) + ")"); r.addColorStop(1, "rgba(175, 195, 255, " + (0.12 * f).toFixed(3) + ")");
  pen.save(); pen.globalCompositeOperation = "screen"; pen.fillStyle = r; pen.fillRect(0, 0, WIDE, 1080); pen.restore();
}

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
  w10WindowStorm(t);
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
  w10RoomFlash(t);
  if (t > 42.66) {                                         // the grey before dawn coming in
    pen.fillStyle = "rgba(170, 180, 200, " + (0.3 * between(t, 42.66, 50.68)).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}

// The water already lying between the city and her house as the storm goes on (yard's frame): a dark sheet from under
// the rampart's houses to before her posts, its face pocked with the rain.
function w10Flood(t) {
  pen.save();
  pen.beginPath();
  pen.moveTo(-WIDE, 668); pen.lineTo(900, 670); pen.quadraticCurveTo(1150, 674, 1230, 700);
  pen.quadraticCurveTo(1260, 760, 1040, 800); pen.quadraticCurveTo(500, 816, -WIDE, 812); pen.closePath();
  var g = pen.createLinearGradient(0, 668, 0, 812);
  g.addColorStop(0, "rgba(66, 78, 100, 0.95)"); g.addColorStop(1, "rgba(36, 46, 62, 0.95)");
  pen.fillStyle = g; pen.fill();
  pen.clip();
  var sheen = pen.createLinearGradient(0, 668, 0, 700);   // the grey of the sky on its far edge, as water shows it
  sheen.addColorStop(0, "rgba(150, 162, 186, 0.55)"); sheen.addColorStop(1, "rgba(150, 162, 186, 0)");
  pen.fillStyle = sheen; pen.fillRect(-WIDE, 660, WIDE + 1300, 50);
  pen.strokeStyle = "rgba(170, 182, 206, 0.3)"; pen.lineWidth = 1.5;   // long low streaks of light on its face
  for (var r = 0; r < 9; r++) {
    var ry = 690 + r * 13, rx = -200 + 140 * dice(r + 330) + (t * 6) % 40;
    pen.beginPath(); pen.moveTo(rx, ry); pen.lineTo(rx + 300 + 400 * dice(r + 340), ry); pen.stroke();
  }
  pen.strokeStyle = "rgba(150, 165, 190, 0.35)"; pen.lineWidth = 1;   // the rings of the drops, opening and gone
  for (var i = 0; i < 70; i++) {
    var u = (t * 1.6 + dice(i + 300)) % 1, x = -300 + dice(i + 310) * 1500, y = 672 + dice(i + 320) * 140;
    pen.globalAlpha = 1 - u;
    pen.beginPath(); pen.ellipse(x, y, 3 + 14 * u, (3 + 14 * u) * 0.25, 0, 0, 7); pen.stroke();
  }
  pen.restore();
}

// Her house again over the water and its mist (the owner, 2026-11-10: "the water z order should be behind the house"):
// welWidowHouse()'s sheet as dark as the yard under it, drawn where welYard() put it. e.g. w10House();
var W10_HOUSE = null;
function w10House() {
  if (!W10_HOUSE) {
    W10_HOUSE = document.createElement("canvas");
    W10_HOUSE.width = WEL_HOUSE.width; W10_HOUSE.height = WEL_HOUSE.height;
    var b = W10_HOUSE.getContext("2d");
    b.drawImage(WEL_HOUSE, 0, 0);
    b.globalCompositeOperation = "source-atop"; b.fillStyle = "rgba(8, 12, 26, 0.62)"; b.fillRect(0, 0, W10_HOUSE.width, W10_HOUSE.height);
  }
  var x = WEL_YARD[0], base = WEL_YARD[1], size = WEL_YARD[2];
  pen.drawImage(W10_HOUSE, x - 220 * size, base - 455 * size, 440 * size, 480 * size);
}

// Outside: the top of her stairs before dawn in the storm, black cloud, the rain so thick the city at the left is all but
// gone in it, water lying between it and her house, mist on the water; a stroke far off over the city lights it all a
// moment; she stands and looks out, and does not go down.
function w10Stairs(t) {
  var top = WEL_YARD[1] - WEL_HOUSE_TOP * WEL_YARD[2], ladder = WEL_YARD[0] + WEL_LADDER * WEL_YARD[2], f = w10Flash(t), k = w10Stroke(t);
  pen.drawImage(welSky("night"), 0, 0);
  pen.fillStyle = "rgba(10, 12, 22, 0.7)"; pen.fillRect(0, 0, WIDE, 1080);
  for (var c = 0; c < 9; c++) {                       // low storm cloud rolling
    pen.fillStyle = "rgba(24, 26, 36, 0.55)";
    pen.beginPath(); pen.ellipse(((c * 260 + t * 14) % (WIDE + 400)) - 200, 80 + 60 * dice(c + 5), 260, 70 + 30 * dice(c), 0, 0, 7); pen.fill();
  }
  pen.save();                                           // closer on her and her house
  pen.translate(1310, 560); pen.scale(1.3, 1.3); pen.translate(-ladder + 60, -top);   // the yard still past both edges
  pen.drawImage(welYard("dusk"), 0, 0, WIDE, 1080);
  pen.fillStyle = "rgba(8, 12, 26, 0.62)"; pen.fillRect(-WIDE, -1080, 3 * WIDE, 3 * 1080);
  w10Flood(t);
  softMist(t, 700, 90, 0.32, 31, "120, 132, 156");    // mist lying on the water
  w10House();                                           // her house in front of the water and the mist
  var haze = pen.createLinearGradient(0, 0, 1150, 0);  // the rain thickest over the city: it is all but gone in it
  haze.addColorStop(0, "rgba(60, 68, 88, 0.9)"); haze.addColorStop(0.7, "rgba(60, 68, 88, 0.62)"); haze.addColorStop(1, "rgba(60, 68, 88, 0.15)");
  pen.fillStyle = haze; pen.fillRect(-WIDE, -1080, 1150 + WIDE, 3 * 1080);
  if (f > 0.3) { pen.save(); pen.globalAlpha = 0.85; w10Bolt(470 + 260 * dice(k + 21), 300, 300, k * 5 + 1); pen.restore(); }   // far off, over the city (in the picture: x 423 on)
  person(ladder - 10, top + 4, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: -1, holding: null, feel: "awe", at: [-200, top + 60]}));
  pen.restore();
  w10Rain(t, -100, 0, WIDE + 200, 1080, 1100, {colour: "rgba(170, 185, 215, 0.4)", long: 46, fall: 1500, lean: -0.22});
  w10Rain(t + 3, -100, 0, WIDE + 200, 1080, 520, {colour: "rgba(220, 230, 250, 0.26)", long: 70, fall: 2100, lean: -0.22, width: 2.4, seed: 5000});
  w10Rain(t + 7, -100, 0, WIDE + 200, 1080, 700, {colour: "rgba(150, 165, 195, 0.3)", long: 28, fall: 1100, lean: -0.22, width: 1.1, seed: 9000});
  if (f > 0) { pen.save(); pen.globalCompositeOperation = "screen"; pen.fillStyle = "rgba(170, 190, 240, " + (0.55 * f).toFixed(3) + ")"; pen.fillRect(0, 0, WIDE, 1080); pen.restore(); }
}

// Scene 10, the entry the film calls (SCENES): t, its own second, 0 to W10_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welPerson() with WEL_WIDOW, welYard(), welWidowHouse(), WEL_YARD; from changngu/sets.js:
// cngRoom("night"), CNG_FLOOR, CNG_BEAM, cngCutsOver(); from pieces.js pratheep(). Its words are W10_LINES.
function welSceneRoars(t) {
  if (t < W10_CUTS[1]) { w10Inside(t); } else { w10Stairs(t); }
  cngCutsOver(t, W10_CUTS);
  welFadeIn(t, 1.5);
}
