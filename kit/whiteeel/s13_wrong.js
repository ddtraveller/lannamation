// s13_wrong.js - scene 13 of the film of the White Eel: we were wrong (50 s). Three shots, through black, at midday: in
// a village outside the old walls (the Chang Ngu film's village, changngu/sets.js cngVillage()), the village heads bow
// to the old woman with their hands joined, and she is set down before a tray of food and served first; then all of
// them sit in a circle and talk together, and one of them, Khun Lang, is chosen, and the rest raise their joined hands
// to him; and last, on the bank of the Mae Khong (the Chang Ngu film's river, cngRiver()), the posts of a new town going
// up one by one, people carrying more: Wiang Prueksa, the town of talking together, its name in gold.
var W13_LONG = 55.55;
var W13_SOUND = {calls: [[0.5, "hens", 0.15], [8.96, "rooster-crow", 0.12], [35.5, "plover", 0.15], [45.55, "kingfisher", 0.15]]};
var W13_LINES = [[1.2, 9.51, "W049"], [10.98, 17.45, "W050"], [21.56, 28.39, "W051"], [36.5, 43.19, "W052"]];
var W13_CUTS = [17.96, 34.5];
var W13_HER = [1500, CNG_GROUND - 10];                 // where the old woman stands, then sits at her tray (in the village panel)
var W13_LANG = 1;                                      // which of WEL_HEADS is Khun Lang (the elder)

// A mat with a little round tray of food on it (a khantoke), at (x, y).
function w13Tray(x, y) {
  oval(x, y, 64, 14, "#c8a86a");
  oval(x, y - 6, 34, 8, "#8a3a2a");
  oval(x, y - 9, 30, 6, "#a8483a");
  [[-14, -11, "#f4ece4"], [4, -12, "#e8d080"], [16, -10, "#6a9a4a"]].forEach(function (d) { oval(x + d[0], y + d[1], 7, 3.5, d[2]); });
}

// Shot 1: they bow to her; she is served first.
function w13Bow(t) {
  var village = cngVillage(), cam = WIDE * 0.55;
  pen.drawImage(welSky("day"), 0, 0);
  welClouds(t + 40, "day");
  welFlocks(t, [[-250, 190, 50]]);
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  var sat = between(t, 9.58, 10.58), served = between(t, 11.46, 13.84), bow = between(t, 1.43, 2.57) * (1 - between(t, 7.14, 8.28));
  var sprites = [{name: "widow", kind: "person", x: W13_HER[0], y: W13_HER[1], draw: function () {
    person(W13_HER[0], W13_HER[1], welPerson("grandmother", WEL_WIDOW, sat > 0.5 ? {id: "widow", face: 1, holding: null, floor: "side", feel: "happy",
        reachA: t > 14.56 ? [W13_HER[0] + 70, W13_HER[1] - 16] : undefined} : {id: "widow", face: 1, feel: t > 4.4 ? "happy" : "concerned"}));
  }}];
  if (served > 0) {
    var tx = W13_HER[0] + 90;
    sprites.push({name: "tray", kind: "thing", x: tx, y: W13_HER[1] + 6, draw: function () { w13Tray(tx, W13_HER[1] + 6); }});
  }
  WEL_HEADS.forEach(function (h, k) {
    var x = W13_HER[0] + 230 + k * 120, y = W13_HER[1] + (k % 2) * 18;
    sprites.push({name: "head " + k, kind: "person", x: x, y: y, draw: function () {
      person(x, y, welPerson(h[0], h[1], {id: "head" + k, face: -1, wai: bow || undefined, bend: 0.3 * bow, feel: "sad",
                                         at: [W13_HER[0], W13_HER[1] - 220], mouth: welTalk(t + k, k === 0 && welSays(t, W13_LINES, ["W049"]))}));
    }});
  });
  var giver = between(t, 10.58, 12.65) * (1 - between(t, 13.84, 15.75));   // a woman of the village brings the tray
  if (giver > 0) {
    sprites.push({name: "giver", kind: "person", x: W13_HER[0] + 160, y: W13_HER[1] + 30, draw: function () {
      person(W13_HER[0] + 160, W13_HER[1] + 30, welPerson(24, {size: 0.7, free: true}, {id: "giver", face: -1, bend: 0.3 * served, feel: "happy",
                                                                                reachA: [W13_HER[0] + 100, W13_HER[1] - 20]}));
    }});
  }
  drawByZ(sprites);
  pen.drawImage(village.front, 0, 0);
  pen.restore();
}

// Shot 2: all sit in a circle and talk; Khun Lang is chosen and the rest raise their joined hands to him.
function w13Circle(t) {
  var village = cngVillage(), cam = WIDE * 0.35, chosen = between(t, 28.1, 29.1);
  pen.drawImage(welSky("day"), 0, 0);
  welClouds(t + 40, "day");
  welFlocks(t, [[-250, 190, 50]]);
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  var middle = [WIDE * 0.35 + 960, CNG_GROUND - 20], sprites = [];
  var circle = WEL_HEADS.map(function (h, k) { return [h[0], h[1], k]; }).concat([["farmer", {size: 0.76}, 3], ["villager", {size: 0.76, turban: "#2a6a5a"}, 4],
                                                                                  ["inta", {size: 0.76}, 5], ["khammun", {size: 0.76}, 6]]);
  circle.forEach(function (c, n) {
    var a = n / circle.length * Math.PI * 2 + 0.3, x = middle[0] + 300 * Math.cos(a), y = middle[1] + 46 * Math.sin(a);
    var isLang = c[2] === W13_LANG, up = isLang ? chosen : 0;
    sprites.push({name: "sitter " + n, kind: "person", x: x, y: y, draw: function () {
      person(x, y, welPerson(c[0], c[1], {id: "circle" + n, face: x < middle[0] ? 1 : -1, floor: up > 0.5 ? undefined : "cross",
        wai: !isLang && t > 29.1 ? 1 : undefined, feel: t > 28.5 ? "happy" : "thinking",
        at: t > 28.1 ? [middle[0] + 300 * Math.cos(W13_LANG / circle.length * Math.PI * 2 + 0.3), middle[1] - 200] : [middle[0], middle[1] - 140],
        mouth: welTalk(t + n, t < 27.18 && Math.sin(t * 0.9 + n * 1.7) > 0.45)}));
    }});
  });
  drawByZ(sprites);
  pen.drawImage(village.front, 0, 0);
  pen.restore();
  cngGoldName("ขุนลัง", "Khun Lang", 960, 230, between(t, 28.9, 29.7) * (1 - between(t, 33.3, 34.3)));
}

// Shot 3: the bank of the Mae Khong; the posts of a new town going up; people carrying more.
var W13_POSTS = [[620, 0], [760, 1], [900, 2], [1040, 3], [1180, 4], [1320, 5], [700, 6], [980, 7], [1260, 8]];
function w13Town(t) {
  var u = t - W13_CUTS[1], river = cngRiver();
  pen.drawImage(welSky("day"), 0, 0);
  welClouds(t + 10, "day");
  welFlocks(t, [[2200, 170, -48]]);
  pen.drawImage(river.back, 0, 0);
  cngRiverLife(t, {});
  pen.drawImage(river.near, 0, 0);
  cngRiverBank(t, "edge");
  var sprites = [];
  W13_POSTS.forEach(function (p) {                      // the posts, each raised in its turn
    var row = p[1] >= 6 ? 1 : 0, y = CNG_BANK + 60 + row * 60, up = between(u, 0.6 + p[1] * 1.3, 1.6 + p[1] * 1.3);
    if (up <= 0) { return; }
    sprites.push({name: "post " + p[1], kind: "thing", x: p[0], y: y, draw: function () {
      pen.save(); pen.translate(p[0], y); pen.rotate((1 - up) * -1.2);
      pen.fillStyle = "#7a5234"; pen.fillRect(-7, -190, 14, 190);
      pen.fillStyle = "rgba(255, 230, 190, 0.3)"; pen.fillRect(-7, -190, 4, 190);
      pen.restore();
    }});
  });
  [["farmer", {size: 0.72}, -1], ["villager", {size: 0.72, turban: "#c9962a"}, 1], ["fellow", {size: 0.72}, -1], ["khammun", {size: 0.72}, 1]].forEach(function (w, k) {
    var along = (k * 420 + 90 * u) % (WIDE + 400), x = w[2] > 0 ? along - 200 : WIDE + 200 - along, y = CNG_BANK + 150 + (k % 2) * 30;
    sprites.push({name: "carrier " + k, kind: "person", x: x, y: y, draw: function () {
      var j = person(x, y, welPerson(w[0], w[1], {id: "builder" + k, face: w[2], step: t / BEAT * 0.9 + k, feel: "happy",
                                                 reachA: [x + w[2] * 30, y - 170], reachB: [x - w[2] * 10, y - 175]}));
      var r = cngLocal(j.wristA);                       // a post on his shoulder
      pen.save(); pen.strokeStyle = "#7a5234"; pen.lineWidth = 9; pen.lineCap = "round";
      pen.beginPath(); pen.moveTo(r[0] - w[2] * 120, r[1] + 10); pen.lineTo(r[0] + w[2] * 60, r[1] - 6); pen.stroke(); pen.restore();
    }});
  });
  drawByZ(sprites);
  cngRiverBank(t, "frame");
  cngGoldName("เวียงปรึกษา", "Wiang Prueksa, the town of talking together", 960, 230, between(u, 6, 7) * (1 - between(u, 17.6, 19)));
}

// Scene 13, the entry the film calls (SCENES): t, its own second, 0 to W13_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welClouds(), welPerson() with WEL_WIDOW and WEL_HEADS, welTalk(); from
// changngu/sets.js: cngVillage(), CNG_GROUND, cngRiver(), cngRiverLife(), cngRiverBank(), CNG_BANK, cngLocal(),
// cngGoldName(), cngCutsOver(). Its words are W13_LINES (W049 to W052).
function welSceneWrong(t) {
  if (t < W13_CUTS[0]) { w13Bow(t); }
  else if (t < W13_CUTS[1]) { w13Circle(t); }
  else { w13Town(t); }
  welDragonflies(t, [["scarlet", [1350, 740, 1800, 850], 9, 1.2]]);
  sceneryAir(t, {butterfly: null, petals: null, light: [0.4, 12]});
  cngCutsOver(t, W13_CUTS);
  welFadeIn(t, 1.5);
}
