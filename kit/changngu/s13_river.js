// s13_river.js - scene 13 of the film of Chang Ngu: to the river (35 s). Three shots, through black: at dawn by a clump of
// bamboo at the village's edge, Phrom cuts a culm with his dap and holds up his hook, a side branch left on near its
// top (the chronicle's ขอไม้ไล่, "a kind of bamboo without thorns, whose side branches make very good hooks", note 70);
// in the village he calls the children, and they come running from the houses, many of them (the chronicle: fifty
// children, เด็กน้อยทั้งหลาย); on the Mae Khong's bank they run in, and he kneels at the water's edge and washes his
// face while they wait on the sand, looking at the river.
var C13_LONG = 35;
var C13_SOUND = {calls: []};
var C13_LINES = [[1.4, 6.28, "C057"], [10.6, 13.31, "C058"], [20.6, 23.9, "C059"], [25.0, 32.12, "C060"]];
var C13_CUTS = [10.0, 20.0];

// Phrom at 13 with his hook in his near hand, held up (the hook's foot at his hand). look: the scene's keys.
function c13Phrom(x, y, look) {
  var size = cngAgeSize(13), j = person(x, y, cngPerson("boy", CNG_PHROM, Object.assign({id: "phrom", size: size}, look)));
  var w = cngLocal(j.wristA);
  elephantHook(pen, w[0], w[1] + 30 * size, size * 0.9, {angle: (look.face || 1) * 0.12});
  return j;
}

// One of the village's children at (x, y): k picks a look from CNG_CHILDREN; look: the scene's keys.
function c13Child(k, x, y, look) {
  var c = CNG_CHILDREN[k % CNG_CHILDREN.length];
  person(x, y, cngPerson(c.kind, c.look, Object.assign({id: "child" + k, size: cngAgeSize(9 + (k % 4))}, look)));
}

// The bamboo at dawn: he cuts a culm (the dap's strokes), then holds up his hook.
function c13Bamboo(t) {
  pen.drawImage(cngSky("dawn"), 0, 0);
  var village = cngVillage();
  pen.save(); pen.translate(-WIDE * 0.15, 0); pen.drawImage(village.back, 0, 0); pen.restore();
  bamboo(pen, 1260, 900, 1.3, 3);
  bamboo(pen, 1460, 920, 1.1, 5);
  pen.fillStyle = "rgba(240, 170, 120, 0.2)"; pen.fillRect(0, 0, WIDE, 1080);
  var cut = t < 4.5, swing = cut ? Math.max(0, Math.sin(t * 5)) : 0, size = cngAgeSize(13);
  if (cut) {
    var j = person(1080, 900, cngPerson("boy", CNG_PHROM, {id: "phrom", size: size, face: 1, at: [1260, 760],
                                                          reachA: [1180 + 30 * swing, 760 - 70 * swing]}));
    var w = cngLocal(j.wristA);
    dap(pen, w[0], w[1], size * 0.5, {angle: 0.9 - 1.2 * swing});
  } else {
    c13Phrom(1080, 900, {face: -1, feel: "happy", reachA: [1010, 700]});
  }
}

// The village: he calls, and the children come running from the houses to him.
function c13Children(t) {
  var village = cngVillage(), cam = WIDE * 0.6;
  pen.drawImage(cngSky("day"), 0, 0);
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  var px = WIDE + 400, calls = t > 10.4 && t < 12.6;
  var sprites = [{name: "phrom", kind: "person", x: px, y: CNG_GROUND, draw: function () {
    c13Phrom(px, CNG_GROUND, {face: 1, feel: "happy", mouth: calls ? {open: 0.3, wide: 0.6, round: 0.3} : undefined,
                              reachB: [px + 80, CNG_GROUND - 360, between(t, 10.4, 10.7) * (1 - between(t, 12.3, 12.6))]});   // his arm up as he calls, eased
  }}];
  for (var k = 0; k < 12; k++) {
    (function (k) {
      var start = 11 + k * 0.4, run = between(t, start, start + 3.5);
      var fromX = WIDE + 700 + (k % 6) * 160, fromY = CNG_GROUND - 40 + (k % 3) * 30;
      var x = mix(fromX, px + 150 + (k % 4) * 70, run), y = mix(fromY, CNG_GROUND + 20 + Math.floor(k / 4) * 22, run);
      sprites.push({name: "child " + k, kind: "person", x: x, y: y, draw: function () {
        c13Child(k, x, y, {face: run < 1 ? -1 : -1, step: run > 0 && run < 1 ? t / BEAT * 1.4 + k : 0, feel: "happy"});
      }});
    })(k);
  }
  drawByZ(sprites);
  pen.drawImage(village.front, 0, 0);
  pen.restore();
}

// The bank: they run in along the sand; he kneels at the edge and washes his face; they wait, looking at the river.
function c13Bank(t) {
  var river = cngRiver();
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 10, CNG_CLOUDS.day);
  pen.drawImage(river.back, 0, 0);
  cngRiverLife(t, {});
  pen.drawImage(river.near, 0, 0);
  var run = between(t, 20, 25), px = mix(-100, 1260, run), washing = t > 25 && t < 31;
  var sprites = [{name: "phrom", kind: "person", x: px, y: CNG_BANK + 30, draw: function () {
    if (run < 1) { c13Phrom(px, CNG_BANK + 30, {face: 1, step: t / BEAT * 1.4}); return; }
    var dip = washing ? Math.max(0, Math.sin((t - 25) * 2.4)) * (1 - between(t, 30.2, 31)) : 0;   // his hands down to the water and up to his face, still by the end
    var down = between(t, 25, 25.6);                          // he crouches at the water's edge, eased from his run
    person(px, CNG_BANK + 30, cngPerson("boy", CNG_PHROM, {id: "phrom", size: cngAgeSize(13), face: 1, sit: 0.7 * down, bend: (0.4 + 0.3 * dip) * down,
                                                          reachA: [px + 60, CNG_BANK - 40 * (1 - dip) - 120 * (1 - dip), down],
                                                          reachB: [px + 80, CNG_BANK - 30 - 130 * (1 - dip), down]}));
    elephantHook(pen, px - 60, CNG_BANK + 40, cngAgeSize(13) * 0.9, {angle: -1.3});   // laid down on the sand beside him
  }}];
  for (var k = 0; k < 14; k++) {
    (function (k) {
      var r = between(t, 20.4 + k * 0.25, 26 + k * 0.25), x = mix(-160 - k * 40, 200 + (k % 7) * 140 + Math.floor(k / 7) * 60, r), y = CNG_BANK + 40 + Math.floor(k / 7) * 46;
      sprites.push({name: "child " + k, kind: "person", x: x, y: y, draw: function () {
        c13Child(k, x, y, {face: 1, step: r > 0 && r < 1 ? t / BEAT * 1.4 + k : 0, feel: t > 28 ? "surprised" : "happy", at: [1200, CNG_WATER + 80]});
      }});
    })(k);
  }
  drawByZ(sprites);
  if (washing) {                                           // the splash at his hands
    pen.fillStyle = "rgba(240, 250, 245, 0.7)";
    for (var d = 0; d < 6; d++) { pen.beginPath(); pen.arc(px + 70 + 30 * dice(d + Math.floor(t * 4)), CNG_BANK - 4 - 20 * dice(d * 3 + Math.floor(t * 4)), 4, 0, 7); pen.fill(); }
  }
}

// Scene 13, the entry the film calls (SCENES): t, its own second, 0 to C13_LONG (35 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), CNG_GROUND, cngRiver(), cngRiverLife(), CNG_BANK, CNG_WATER,
// cngPerson() with CNG_PHROM and CNG_CHILDREN, cngAgeSize(), cngLocal(); from chiangsaen.js elephantHook(), dap(); from
// highlands.js bamboo(). Its words are C13_LINES (C057 to C060). Its z plan: each shot's set, then by drawByZ the
// people by their feet, then what is over them (the village's fences, the splash).
function cngSceneRiver(t) {
  if (t < C13_CUTS[0]) { c13Bamboo(t); }
  else if (t < C13_CUTS[1]) { c13Children(t); }
  else { c13Bank(t); }
  cngCutsOver(t, C13_CUTS);
}
