// s19_pots.js - scene 19 of the film of Chang Ngu: golden pots (40 s). Three shots, through black: in the village Phrom,
// the elephant behind him, tells his father to send no more gold to the Khom (the chronicle: "อย่าได้ส่งส่วยแก่พระยาขอม
// ตนนั้นต่อไป ... จงไว้ธุระแก่ลูกเทอญ"); in the stable his father built, the elephant eats grass from a golden salung, and
// then, behind it, a man of the house holds a golden pot for its dung, wrinkling his nose (the chronicle: its vessels
// "for its grass, and even for its dung and its water, all of gold"; the owner's "a quick laugh"); and round the village
// men dig a moat and set up gates of timber in a bank of earth: Wiang Phan.
var C19_LONG = 42;
var C19_SOUND = {calls: []};
var C19_LINES = [[1.4, 5.96, "C087"], [6.16, 14.64, "C088"], [15.8, 18.56, "C089"], [19.0, 21.68, "C090"], [23.0, 26.96, "C091"], [30.0, 35.12, "C092"]];
var C19_CUTS = [15.2, 29.4];

// At home the elephant wears its white and gold blanket and its head ornament, but no howdah and no parasol (the owner,
// 2026-11-18, of the stable: "remove the umbrella and sitting box on the elephant but keep the white blanket on its back";
// the parasol stood up through the stable's roof); in the yard too, so it does not change within the scene.
var C19_DRESS = {howdah: false, parasol: false};

// The yard: Phrom speaks to his father, the elephant standing behind him.
function c19Yard(t) {
  var village = cngVillage(), cam = WIDE * 0.62;
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 20, "day");
  pen.save(); pen.translate(-cam, 0); pen.drawImage(village.back, 0, 0); pen.restore();
  pen.drawImage(cngForgeGround(null, false), 0, 0);       // the yard's beaten earth (sets.js)
  var speaks = t > 6.2 && t < 14.2;
  elephant(1420, 830, {size: 0.5, face: -1, colour: "#f1ddd3", regalia: C19_DRESS, trunk: 0.2 + 0.2 * Math.sin(t)});
  decorate(t, cngYard(1780, 880, 6), "back");                 // the yard's fowl (owner, 2026-10-25)
  drawByZ([
    {name: "phrom", kind: "person", x: 980, y: 870, draw: function () {
      person(980, 870, poseEased(t, function (s) {           // his hand out while he speaks, eased in and out (poseEased)
        var speaking = s > 6.2 && s < 14.2;
        return cngPerson("boy", CNG_PHROM, {id: "phrom", size: cngAgeSize(14), face: -1, feel: "happy",
                                            reachA: speaking ? [900, 640 + 20 * Math.sin(s * 2)] : undefined,
                                            mouth: speaking ? {open: 0.06 + 0.24 * Math.abs(Math.sin(s * 7)), wide: 0.5, round: 0.2} : undefined,
                                            at: [680, 600]});
      }));
    }},
    {name: "headman", kind: "person", x: 680, y: 860, draw: function () {
      person(680, 860, cngPerson("noble", Object.assign({}, CNG_HEADMAN, {sarong: CNG_KING.sarong, age: 0.45}),
                                 {id: "phang", face: 1, feel: t > 8 ? "happy" : "surprised", at: [980, 620]}));
    }}
  ]);
  cngBeds(t, "village", "frame");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.45, 27]});
}

// The stable: the elephant at its golden salung of grass; then the man with the golden pot behind it.
function c19Stable(t) {
  var village = cngVillage(), cam = WIDE * 0.75, sx = 900, base = 880;
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 20, "day");
  pen.save(); pen.translate(-cam, 0); pen.drawImage(village.back, 0, 0); pen.restore();
  pen.drawImage(cngForgeGround(null, false), 0, 0);
  cngStable(pen, sx, base, 1, "back");
  var eats = t < 21 ? Math.max(0, Math.sin((t - 15) * 1.4)) : 0;
  salung(pen, sx - 300, base - 4, 0.9, {grass: true});
  elephant(sx + 30, base, {size: 0.55, face: -1, colour: "#f1ddd3", regalia: C19_DRESS, trunk: 0.15 + 0.45 * eats, mouth: 0.3 * eats});
  var pot = t > 22.6, plop = between(t, 25.2, 26.0);
  if (pot) {
    var px = sx + 300;
    var potLook = cngPerson("villager", {size: 0.66, id: "potman", face: -1, sabai: false, feel: t > 25.2 ? "surprised" : "concerned",
                                         reachA: [px, base - 70]});
    var head = cngMeasure(px + 60, base + 10, potLook), hh = Math.hypot(head.chin[0] - head.crown[0], head.chin[1] - head.crown[1]);
    // his other hand over his eyes, his elbow bent, peeking out under it (the owner, 2026-11-19: "like he is trying to
    // cover his eyes but he should be peeking out but not raising his hand like asking a question")
    person(px + 60, base + 10, Object.assign(potLook, {reachB: [head.crown[0] - 0.5 * hh, head.crown[1] + 0.3 * hh]}));
    goldPot(pen, px, base - 10, 0.8);
    if (plop > 0 && plop < 1) {                            // a small dark ball dropping into the pot
      pen.fillStyle = "#5a4630";
      pen.beginPath(); pen.arc(px - 10, mix(base - 200, base - 70, plop * plop), 9, 0, 7); pen.fill();
    }
  }
  cngStable(pen, sx, base, 1, "front");
  cngBeds(t, "village", "frame");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.45, 25]});
}

// Four hill mynas (นกขุนทอง) flying over Wiang Phan as the men dig, right to left in a loose line, wings beating (the
// owner, 2026-11-18: "Add 4 'nok kun tong' birds flying over in this scene"). In flight, as the kit draws none (mangrai.js
// hillMyna() stands on a branch): glossy black, the white patch on each wing that shows when it flies, the yellow wattle
// behind the eye, the stout orange bill, the legs tucked away. x, y: its body's middle; s: size (1, about 70 long);
// face: -1 to the left; beat: -1 to 1, the wings down to up. e.g. c19FlyingMyna(900, 240, 0.8, -1, Math.sin(t * 14));
function c19FlyingMyna(x, y, s, face, beat) {
  pen.save();
  pen.translate(x, y);
  pen.scale(s * face, s);
  pen.lineJoin = "round"; pen.lineWidth = 1.6 / s; pen.strokeStyle = "#050408";
  function wing(far) {                                   // root over the shoulder, the tip up or down with the beat
    var b = beat * (far ? 0.85 : 1), tipY = -4 - 48 * b, tipX = -8 + 8 * Math.abs(b);
    pen.beginPath(); pen.moveTo(12, -5);
    pen.quadraticCurveTo(10, -4 - 22 * b, tipX + 4, tipY);
    pen.lineTo(tipX - 6, tipY + 6 * Math.sign(b || 1));
    pen.quadraticCurveTo(-8, -4 - 14 * b, -10, -4); pen.closePath();
    pen.fillStyle = far ? "#0c0a10" : "#1a1622"; pen.fill(); pen.stroke();
    pen.beginPath();                                     // the white patch across the flight feathers
    pen.ellipse(mix(2, tipX, 0.55), mix(-4, tipY, 0.55), 5, 3.2, Math.atan2(tipY + 4, tipX - 2), 0, 7);
    pen.fillStyle = "#f4f0e8"; pen.fill();
  }
  wing(true);
  pen.beginPath(); pen.moveTo(-18, -2); pen.lineTo(-34, -6); pen.lineTo(-34, 3); pen.closePath();   // the short tail
  pen.fillStyle = "#14121a"; pen.fill(); pen.stroke();
  pen.beginPath(); pen.ellipse(0, 0, 22, 9, -0.05, 0, 7);                                    // the body, a purple-green sheen
  var gloss = pen.createLinearGradient(-20, -9, 20, 9);
  gloss.addColorStop(0, "#2a1e3a"); gloss.addColorStop(0.5, "#14121a"); gloss.addColorStop(1, "#16241e");
  pen.fillStyle = gloss; pen.fill(); pen.stroke();
  pen.beginPath(); pen.arc(23, -5, 8, 0, 7); pen.fillStyle = "#14121a"; pen.fill(); pen.stroke();  // the head
  pen.beginPath(); pen.ellipse(20, -6, 3, 4.5, 0.3, 0, 7); pen.fillStyle = "#f2c81e"; pen.fill(); // the yellow wattle
  pen.beginPath(); pen.arc(25, -7, 1.6, 0, 7); pen.fillStyle = "#3a1a10"; pen.fill();             // the eye
  pen.beginPath(); pen.moveTo(29, -8); pen.quadraticCurveTo(38, -6, 40, -3); pen.lineTo(29, -2); pen.closePath();   // the bill
  pen.fillStyle = "#f29a1a"; pen.fill(); pen.strokeStyle = "#8a4a08"; pen.stroke();
  pen.strokeStyle = "#050408";
  wing(false);
  pen.restore();
}
function c19Mynas(t) {
  [[31.0, 250], [31.5, 210], [31.9, 280], [32.6, 236]].forEach(function (b, k) {
    var x = WIDE + 120 - (t - b[0]) * 300;
    if (x < -120 || x > WIDE + 120) { return; }
    c19FlyingMyna(x, b[1] + 10 * Math.sin(t * 2 + k), 0.8, -1, Math.sin(t * 13 + k * 1.7));
  });
}

// Wiang Phan: men dig the moat; the bank of earth with its palisade and a timber gate, opening and shutting.
function c19Moat(t) {
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 40, "day");
  pen.drawImage(cngVillage().back, -WIDE * 0.5, 0);
  cityWall(pen, -60, 760, WIDE + 120, 0.9, {plain: true, open: 0.5 + 0.5 * Math.sin((t - 29.4) * 0.8), outer: true, t: t});
  pen.drawImage(cngFields(), 0, 830, WIDE, 250, 0, 830, WIDE, 250);   // outside it the fields and the road to its gate, not the village
  c19Mynas(t);
  var sprites = [];
  [[300, 1], [520, -1], [1350, 1], [1600, -1]].forEach(function (d, k) {
    var dig = Math.max(0, Math.sin(t * 2.4 + k));
    sprites.push({name: "digger " + k, kind: "person", x: d[0], y: 930, draw: function () {
      // both hands on the hoe's handle, the stroke from the shoulder down (the owner, 2026-11-18: "stop all hand waving
      // behavior": one hand swung up to his brow with a short hoe, like a salute, the other hand rocked on the beat)
      var grip = [d[0] + 64 * d[1], 930 - 120 + 90 * dig];   // from his chest down to the ground, never at his face
      // a hoe (chok): its handle through both fists, drawn with the lower (far) one, the upper closing over it too (the
      // owner, 2026-11-19: "hold the tools they are using in their hands properly with fingers and thumbs around the staff")
      var way = Math.atan2(110, 50 * d[1]), ux = Math.cos(way), uy = Math.sin(way);
      person(d[0], 930, cngPerson("villager", {size: 0.66, id: "digger" + k, face: d[1], sabai: false, bend: 0.3 + 0.3 * dig,
                                               reachA: grip, reachB: [grip[0] + 12 * d[1], grip[1] + 44], holdA: {way: way},
                                               holdB: {way: way, draw: function (g) {
        pen.strokeStyle = "#7a5432"; pen.lineWidth = 5;
        pen.beginPath(); pen.moveTo(g.x - ux * 110, g.y - uy * 110); pen.lineTo(g.x + ux * 66, g.y + uy * 66); pen.stroke();
        pen.save(); pen.translate(g.x + ux * 66, g.y + uy * 66); pen.rotate(way + Math.PI / 2);
        pen.fillStyle = "#4a4a50"; pen.fillRect(-4, -4, 26 * d[1], 10);
        pen.restore();
      }}}));
    }});
  });
  drawByZ(sprites);
  cngBeds(t, "village", "frame");
  sceneryAir(t, {butterfly: null, petals: null, light: [0.45, 23]});
}

// Scene 19, the entry the film calls (SCENES): t, its own second, 0 to C19_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), cngStable(), cngPerson() with CNG_PHROM and CNG_HEADMAN, cngAgeSize(),
// cngLocal(), cngCutsOver(); from chiangsaen.js salung(), goldPot(), cityWall(); from beasts.js elephant(). Its words are
// C19_LINES (C087 to C092). Its z plan: each shot's set, the stable's back, the elephant, the people by their feet, the
// stable's front.
function cngScenePots(t) {
  if (t < C19_CUTS[0]) { c19Yard(t); }
  else if (t < C19_CUTS[1]) { c19Stable(t); }
  else { c19Moat(t); }
  cngCutsOver(t, C19_CUTS);
}
