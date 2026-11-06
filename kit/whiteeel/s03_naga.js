// s03_naga.js - scene 3 of the film of the White Eel: the naga's city (40 s). Two shots, through black: night on the
// plain by the Kok, under the moon: the Brahman stands at the water's edge, a pale light gathers round him and he is
// gone, and the naga Phanthu rises from the river in his own shape and slides round the plain, and behind him the
// ground opens into a channel of moonlit water, the moat (the chronicle: the naga dug the moat round the city's land);
// then morning at the city: Yonok's wall and gate as the Chang Ngu film painted them (changngu/sets.js), the moat
// before them, and the prince and his people on the road; the city's two names in gold as the voice says them.
var W03_LONG = 40;
var W03_SOUND = {calls: [[0, "crickets", 0.2, 19], [19.5, "birds", 0.2, 20]]};
var W03_LINES = [[1.4, 7.4, "W009"], [9.0, 17.0, "W010"], [22.4, 30.0, "W011"], [31.6, 37.4, "W012"]];
var W03_CUTS = [19.5];
var W03_MOON = [1480, 170, 46];
var W03_RISE = [1560, 690];                            // where the naga comes up out of the river
var W03_LOOP = [940, 800, 700, 96];                   // the moat's loop round the city's land: middle x, y, half wide, half tall
var W03_DIG = [8.0, 18.6];                             // the seconds the naga goes round

// Where the naga's chest is at second s of the scene: up out of the river, then once round the loop and back to the
// river where he began. Gives back [x, y].
function w03Path(s) {
  if (s < W03_DIG[0]) { var up = between(s, 5.6, W03_DIG[0]); return [W03_RISE[0], mix(W03_RISE[1] + 60, W03_RISE[1], up)]; }
  var u = between(s, W03_DIG[0], W03_DIG[1]), a = -0.35 + u * Math.PI * 2;   // from the right, round toward the front
  return [W03_LOOP[0] + W03_LOOP[2] * Math.cos(a), W03_LOOP[1] + W03_LOOP[3] * Math.sin(a)];
}

// The moat dug so far: the loop from where the naga began to where he is, a channel of moonlit water lying flat in the
// ground (thin far off, deeper near), its far edge a dark cut of earth, the moon's light along its water.
function w03Moat(t) {
  if (t <= W03_DIG[0]) { return; }
  var pts = [], end = Math.min(t, W03_DIG[1] + 0.4);
  for (var s = W03_DIG[0]; s <= end; s += 0.04) {
    var q = w03Path(Math.min(s, W03_DIG[1]));
    q.push(mix(7, 16, between(q[1], W03_LOOP[1] - W03_LOOP[3], W03_LOOP[1] + W03_LOOP[3])));   // its half depth there
    pts.push(q);
  }
  if (pts.length < 2) { return; }
  function band(top, bottom, colour) {                  // a strip along the path, from top to bottom of each half depth
    pen.beginPath();
    pts.forEach(function (q, k) { if (k) { pen.lineTo(q[0], q[1] + top * q[2]); } else { pen.moveTo(q[0], q[1] + top * q[2]); } });
    for (var k = pts.length - 1; k >= 0; k--) { pen.lineTo(pts[k][0], pts[k][1] + bottom * pts[k][2]); }
    pen.closePath();
    pen.fillStyle = colour;
    pen.fill();
  }
  pen.save();
  band(-1.3, 1, "#2a2a22");                             // the cut earth of its banks
  band(-0.8, 0.9, "#22385c");                           // the water
  band(-0.8, -0.35, "rgba(150, 175, 215, 0.45)");       // the far side catching the moon
  pen.restore();
}

// The night: the plain by the Kok under the moon; the Brahman's light; the naga going round, the moat behind him.
function w03Night(t) {
  pen.drawImage(welSky("night"), 0, 0);
  sceneryMoon(t, W03_MOON[0], W03_MOON[1], W03_MOON[2], {});
  welFar(pen, WEL_KOK);
  pen.drawImage(welPlain(), 0, 0, WIDE, 1080);
  var kok = welKokWater();
  sceneryWaterDepths(kok);
  sceneryWaterSurface(t, kok);
  pen.fillStyle = "rgba(10, 18, 48, 0.62)";             // the night over the land
  pen.fillRect(0, 0, WIDE, 1080);
  pen.drawImage(welSky("night"), 0, 0, WIDE, WEL_KOK - 300, 0, 0, WIDE, WEL_KOK - 300);   // the stars and the moon clear of it
  sceneryMoon(t, W03_MOON[0], W03_MOON[1], W03_MOON[2], {});
  natGlitter(t, W03_MOON[0], WEL_KOK, WEL_KOK_BANK, 0.5, "220, 230, 255");   // the moon's path on the river
  w03Moat(t);
  var gone = between(t, 4.2, 5.8), glow = between(t, 2.6, 4.6) * (1 - between(t, 6.2, 8));
  if (gone < 1) {                                       // the Brahman at the water's edge, small, going in a light
    pen.save();
    pen.globalAlpha = 1 - gone;
    person(W03_RISE[0] - 40, W03_RISE[1] + 50, welPerson("elder", WEL_BRAHMAN, {id: "brahman", face: 1, size: WEL_BRAHMAN.size * 0.62}));
    pen.restore();
  }
  if (glow > 0) {
    var g = pen.createRadialGradient(W03_RISE[0] - 40, W03_RISE[1], 4, W03_RISE[0] - 40, W03_RISE[1], 160);
    g.addColorStop(0, "rgba(220, 255, 230, " + (0.7 * glow).toFixed(3) + ")");
    g.addColorStop(1, "rgba(220, 255, 230, 0)");
    pen.fillStyle = g;
    pen.fillRect(W03_RISE[0] - 240, W03_RISE[1] - 200, 400, 400);
  }
  if (t > 5.6) {                                        // the naga, his chest led along the path, the body after it
    var offset = clock - t, chest = w03Path(t), dir = w03Path(t + 0.1)[0] - chest[0];
    var near = between(chest[1], W03_LOOP[1] - W03_LOOP[3], W03_LOOP[1] + W03_LOOP[3]);
    pen.save();
    pen.globalAlpha = between(t, 5.6, 6.6) * (1 - between(t, 18.4, 19.2));
    naga(chest[0], chest[1], {size: mix(0.32, 0.5, near), heads: 5, face: dir < 0 ? -1 : 1, mouth: 0.15,
                              body: "#2f7d5c", trail: function (c) { return w03Path(c - offset); }});
    pen.restore();
  }
  sceneryReeds(1700, 744, 0.8, t, "back"); sceneryReeds(1700, 744, 0.8, t, "front");
  sceneryFireflies(t, {far: [[[0, WEL_KOK_BANK, WIDE, 1000], 60, 5]], near: 8});
}

// The morning: Yonok's wall and gate across its moat (the Chang Ngu film's), the prince and his people on the road.
function w03Morning(t) {
  var u = t - W03_CUTS[0], warm = 1 - between(u, 0, 8);
  pen.drawImage(welSky("day"), 0, 0);
  pen.globalAlpha = warm;
  pen.drawImage(welSky("sunrise"), 0, 0);
  pen.globalAlpha = 1;
  welClouds(t + 80, "day");
  pen.drawImage(cngFields(), 0, 0);
  cngGateWall(between(u, 1, 4), t);
  var sprites = [];
  var walk = between(u, 0, 9), px = mix(380, 700, walk);
  sprites.push({name: "prince", kind: "person", x: px, y: 905, draw: function () {
    person(px, 905, welPerson("noble", WEL_PRINCE, {id: "prince", size: 0.7, face: 1, step: walk > 0 && walk < 1 ? t / BEAT * 0.9 : 0,
                                                   feel: "happy", at: [CNG_GATE[0], 560]}));
  }});
  WEL_FOLK.slice(0, 5).forEach(function (f, k) {
    var x = px - 110 - k * 95, y = 900 + (k % 2) * 22;
    sprites.push({name: "folk " + k, kind: "person", x: x, y: y, draw: function () {
      person(x, y, welPerson(f[0], f[1], {id: "folk" + k, size: f[1].size * 0.86, face: 1, step: walk > 0 && walk < 1 ? t / BEAT * 0.9 + k : 0,
                                         feel: "happy", at: [CNG_GATE[0], 560]}));
    }});
  });
  drawByZ(sprites);
  cngGoldName("นาคพันธุสิงหนวตินคร", "Naga Phanthu Singhanavati Nakhon", 960, 230, between(u, 3.2, 4.2) * (1 - between(u, 10.2, 11)));
  cngGoldName("โยนก", "Yonok", 960, 230, between(u, 12.4, 13.4) * (1 - between(u, 18.6, 19.6)));
  sceneryAir(t, {butterfly: null, petals: null, light: [0.4, 9]});
}

// Scene 3, the entry the film calls (SCENES): t, its own second, 0 to W03_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welFar(), welPlain(), welKokWater(), WEL_KOK, WEL_KOK_BANK, welPerson() with
// WEL_BRAHMAN, WEL_PRINCE, WEL_FOLK; from changngu/sets.js: cngFields(), cngGateWall(), CNG_GATE, cngGoldName(),
// cngCutsOver(); from naga.js naga() with a trail. Its words are W03_LINES (W009 to W012).
function welSceneNaga(t) {
  if (t < W03_CUTS[0]) { w03Night(t); } else { w03Morning(t); }
  cngCutsOver(t, W03_CUTS);
  welFadeIn(t, 1.5);
}
