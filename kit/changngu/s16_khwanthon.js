// s16_khwanthon.js - scene 16 of the film of Chang Ngu: Khwan Thon (35 s). The white elephant in the river, Phrom on its
// neck reaching forward with his hook of bamboo to lead it out (the chronicle: "เอาขอไม้ไล่เกาะให้ออกจากแม่น้ำ"); it
// shakes its head and will not come; it swims along the bank against the current, upstream (to the right, the water
// going left), and the place takes the name (the chronicle: "สถานที่ช้างทวนน้ำอยู่นั้นก็ได้ชื่อว่าควานทน", the place
// where the elephant swam against the water was called Khwan Thon), the name coming up in gold; the children climb out,
// and one of them runs off along the bank for home, to tell Phrom's father.
var C16_LONG = 35;
var C16_SOUND = {calls: []};
var C16_LINES = [[1.4, 6.14, "C074"], [7.0, 9.38, "C075"], [12.5, 15.5, "C076"], [18.5, 22.58, "C077"], [25.0, 29.56, "C078"]];
// Its life (decorate.js; owner, 2026-10-25): a flock over the river in the quiet after "C075", a barb that leaps by
// the sandbar, twice.
var C16_LIFE = [
  {name: "flock over the river", kind: "flock", layer: "back", course: [[9.4, 2150, 240], [12.4, -320, 190]]},
  {name: "barb", kind: "fish", layer: "back", look: {size: 1.1}, course: [[2.0, 1420, 712, "hide"], [4.0, 1420, 712], [4.8, 1540, 712, "hide"], [99, 1540, 712, "hide"]]},
  {name: "barb again", kind: "fish", layer: "back", look: {size: 1}, course: [[14.0, 1500, 712, "hide"], [16.0, 1500, 712], [16.8, 1620, 712, "hide"], [99, 1620, 712, "hide"]]}
];
var C16_SWIM = CNG_BANK - 54;

// The name of the place in gold over the river, as the voice says it. e.g. c16Name(20);
function c16Name(t) {
  var a = between(t, 18.6, 19.6) * (1 - between(t, 23.4, 24.4));
  if (a <= 0) { return; }
  pen.save();
  pen.globalAlpha = a;
  pen.textAlign = "center";
  pen.shadowColor = "rgba(255, 196, 90, 0.7)"; pen.shadowBlur = 16;
  pen.fillStyle = "#f2d27a";
  pen.font = "700 76px 'Noto Serif Thai', 'Leelawadee UI', serif";
  pen.fillText("ควานทน", 520, 230);
  pen.shadowBlur = 0;
  pen.font = "italic 36px " + LETTERS_LATIN + ", serif";
  pen.fillStyle = "#fff6dc";
  pen.fillText("Khwan Thon", 520, 282);
  pen.restore();
}

// Scene 16, the entry the film calls (SCENES): t, its own second, 0 to C16_LONG (35 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngRiver(), cngRiverLife(), CNG_BANK, cngPerson() with CNG_PHROM and CNG_CHILDREN,
// cngAgeSize(), cngLocal(); from beasts.js elephant(); from chiangsaen.js elephantHook(). Its words are C16_LINES (C074
// to C078). Its z plan: the river's back, the elephant swimming, the water over its legs, the near bank, then Phrom on
// its neck and by drawByZ the children on the bank; the name over all.
function cngSceneKhwanthon(t) {
  var river = cngRiver(), size = cngAgeSize(13);
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 80, CNG_CLOUDS.day);
  pen.drawImage(river.back, 0, 0);
  cngRiverLife(t, {flushed: 1 - between(t, 0, 20)});
  decorate(t, C16_LIFE, "back");
  var upstream = between(t, 11, 30), shake = t > 7 && t < 11 ? Math.sin((t - 7) * 9) * 0.5 : 0;
  var ex = mix(1000, 1500, upstream), bob = 6 * Math.sin(t * 1.4);
  var e = elephant(ex, C16_SWIM + 210 + bob, {size: 0.62, face: shake > 0 ? 1 : -1, colour: "#f1ddd3", cloth: "#c9962a",
                                              trunk: 0.3 + 0.4 * Math.abs(Math.sin(t * 1.3)), mouth: shake ? 0.3 : 0.1});
  csBand(pen, 0, C16_SWIM - 8, WIDE, CNG_BANK - C16_SWIM + 30, "#a68e66", "#8a7250");   // the water over it, moving left
  waves(pen, 0, C16_SWIM - 6, WIDE, CNG_BANK - C16_SWIM + 20, "rgba(250, 238, 210, 0.3)", t * 2);
  for (var w = 0; w < 6; w++) {                             // its wake as it pushes against the current
    pen.strokeStyle = "rgba(250, 245, 230, " + (0.5 * upstream * (1 - upstream)).toFixed(3) + ")"; pen.lineWidth = 3;
    pen.beginPath(); pen.moveTo(ex - 200 - w * 50, C16_SWIM - 2 + w * 4); pen.lineTo(ex - 120 - w * 50, C16_SWIM + w * 4); pen.stroke();
  }
  pen.drawImage(river.near, 0, 0);
  var reach = t < 11 ? Math.max(0, Math.sin(t * 1.6)) : 0;  // he reaches forward with the hook, toward its head
  var j = person(e.seat[0], e.seat[1], cngPerson("boy", CNG_PHROM, {id: "phromrides", size: size, face: -1, floor: "astride",
                                                                   feel: t < 11 ? "concerned" : "surprised",
                                                                   reachA: [e.head[0] + 30 - 30 * reach, e.head[1] - 40 + 20 * reach]}));
  var hand = cngLocal(j.wristA);
  elephantHook(pen, hand[0], hand[1] + 30 * size, size * 0.9, {angle: -0.9 - 0.4 * reach});
  var kids = [];
  for (var k = 0; k < CNG_KIDS; k++) {                     // all of them, three deep, as they huddled (sets.js cngHuddle)
    (function (k) {
      var x = cngHuddle(k)[0], y = cngHuddle(k)[1], c = CNG_CHILDREN[k % CNG_CHILDREN.length];
      var runs = k === 3 ? between(t, 25.4, 33) : 0, rx = mix(x, -260, runs);
      kids.push({name: "child " + k, kind: "person", x: rx, y: y, draw: function () {
        person(rx, y, cngPerson(c.kind, c.look, {id: "child" + k, size: cngAgeSize(9 + (k % 4)), face: runs > 0 ? -1 : 1,
                                                 step: runs > 0 && runs < 1 ? t / BEAT * 1.6 : 0,
                                                 feel: t > 11 ? "surprised" : "happy", at: [ex, C16_SWIM - 80]}));
      }});
    })(k);
  }
  drawByZ(kids);
  c16Name(t);
  cngFadeIn(t, 1);
}
