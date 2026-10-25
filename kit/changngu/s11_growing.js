// s11_growing.js - scene 11 of the film of Chang Ngu: growing up (40 s). The village yard by the forge as the years go:
// Phrom at seven runs to his father and points at the forge (the chronicle: from seven he asked his father for weapons,
// "เหมือนที่แม่เคยขอ", as his mother had); every year the smith hands him a new one, the light of the year's seasons
// going over the yard (the rains' green, the dry season's gold, the cool season's mist) and the boy a little taller
// each time; at thirteen he practises with a sword beside his big brother.
var C11_LONG = 40;
var C11_SOUND = {calls: []};
var C11_LINES = [[1.4, 6.74, "C046"], [7.0, 14.96, "C047"], [16.0, 21.32, "C048"], [29.0, 31.26, "C049"]];
var C11_FORGE = [1420, 860, 1.0];
var C11_YEARS = [[15.8, 8], [19.8, 10], [23.8, 12]];     // when the smith hands him a weapon, and his age then

// Phrom's age at second t: seven, then each gift a little older, thirteen at the end. e.g. c11Age(20) is 10
function c11Age(t) {
  var age = 7;
  C11_YEARS.forEach(function (y) { if (t >= y[0]) { age = y[1]; } });
  return t >= 27 ? 13 : age;
}

// The season's light over the yard at second t: the rains' green, the dry season's gold, the cool season's mist.
function c11Season(t) {
  var k = Math.floor(between(t, 15.4, 27) * 3), colour = ["rgba(60, 120, 60, 0.12)", "rgba(230, 170, 60, 0.16)", "rgba(220, 225, 235, 0.22)"][Math.min(2, k)];
  if (t > 15.4 && t < 27) { pen.fillStyle = colour; pen.fillRect(0, 0, WIDE, 1080); }
}

// The sword practice (owner, 2026-10-25: "The biceps should be angled down with the forearm at a flatter angle and the
// sword pointing almost straight up. Then the arm should extend up and the angle of the sword should naturally fall
// back"): the near wrist goes between the guard, level before the chest, the upper arm down and the forearm level,
// and the stroke, up over the head; the kit's holding "dap" keeps the blade square to the hand, so it stands upright
// at the guard and falls back as the arm goes up. x, feet: where he stands; size; face; u: 0 at the guard, 1 at the
// top of the stroke. Gives back the wrist's point, for reachA. e.g. c11Stroke(700, 860, 0.55, 1, 0.5)
function c11Stroke(x, feet, size, face, u) {
  var guard = [x + face * 95 * size, feet - 205 * size], top = [x + face * 125 * size, feet - 320 * size];   // the top: up and forward, as high as his arm reaches, the blade back over his head
  return [mix(guard[0], top[0], u), mix(guard[1], top[1], u)];
}

// Scene 11, the entry the film calls (SCENES): t, its own second, 0 to C11_LONG (40 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngVillage(), cngPerson() with CNG_PHROM, CNG_HEADMAN, CNG_SMITH and CNG_THUKKHITA,
// cngAgeSize(); from chiangsaen.js forge(), dap(). Its words are C11_LINES (C046 to C049). Its z plan: the village's back
// sheet, the yard, the forge, then by drawByZ the people by their feet; the season's light over all.
function cngSceneGrowing(t) {
  var village = cngVillage(), cam = WIDE * 0.86, f = C11_FORGE, age = c11Age(t), size = cngAgeSize(age);
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 70, CNG_CLOUDS.day);
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  pen.restore();
  csBand(pen, 0, 800, WIDE, 280, "#b9a070", "#9a8058");
  forge(pen, f[0], f[1], f[2], t);
  var sprites = [];
  if (t < 15.4) {                                          // seven: he runs to his father and points at the forge
    var run = between(t, 1, 5), px = mix(300, 760, run);
    sprites.push({name: "phrom", kind: "person", x: px, y: 840, draw: function () {
      person(px, 840, cngPerson("boy", CNG_PHROM, {id: "phrom", size: size, face: 1, step: run > 0 && run < 1 ? t / BEAT * 1.3 : 0, feel: "happy",
                                                   reachA: [f[0] - 200, 640, between(t, 6.5, 6.9)], at: t > 6.5 ? [f[0], 700] : undefined}));   // he points, eased in
    }});
    sprites.push({name: "headman", kind: "person", x: 940, y: 850, draw: function () {
      person(940, 850, cngPerson("noble", Object.assign({}, CNG_HEADMAN, {sarong: CNG_KING.sarong}),
                                 {id: "phang", face: -1, feel: t > 9 ? "happy" : undefined, at: [px, 700]}));
    }});
  } else {                                                 // the years: the smith hands him a weapon; at thirteen, practice
    var year = C11_YEARS.filter(function (y) { return t >= y[0]; }).length - 1, gift = between(t, C11_YEARS[Math.max(0, year)][0], C11_YEARS[Math.max(0, year)][0] + 1.5);
    var practice = t >= 27, bx = practice ? 700 : f[0] - 280;
    sprites.push({name: "phrom", kind: "person", x: bx, y: 860, draw: function () {
      var stroke = 0.5 - 0.5 * Math.cos(t * 3.2);          // the guard and the stroke, in turn
      person(bx, 860, cngPerson("boy", CNG_PHROM, {id: "phrom", size: size, face: 1, feel: "happy", holding: "dap",
                                                   reachA: practice ? c11Stroke(bx, 860, size, 1, stroke) : [mix(bx + 40, f[0] - 150, gift), 860 - 220 * size],
                                                   at: practice ? [bx + 300, 700] : [f[0] - 150, 700]}));
    }});
    if (practice) {
      sprites.push({name: "thukkhita", kind: "person", x: 1010, y: 870, draw: function () {
        var stroke = 0.5 - 0.5 * Math.cos(t * 3.2 + Math.PI);   // his stroke as Phrom comes to his guard
        person(1010, 870, cngPerson("boy", CNG_THUKKHITA, {id: "thukkhita", size: cngAgeSize(16), face: -1, feel: "happy", holding: "dap",
                                                           reachA: c11Stroke(1010, 870, cngAgeSize(16), -1, stroke), at: [bx, 700]}));
      }});
    } else {
      sprites.push({name: "smith", kind: "person", x: f[0] - 140, y: 870, draw: function () {
        person(f[0] - 140, 870, cngPerson("villager", CNG_SMITH, {id: "smith", face: -1, feel: "happy",
                                                                  reachA: [mix(f[0] - 200, bx + 60, gift), 860 - 200 * 0.78]}));
      }});
    }
  }
  decorate(t, cngYard(220, 878, 3), "back");                 // the yard's fowl (owner, 2026-10-25)
  drawByZ(sprites);
  c11Season(t);
  cngCutsOver(t, [15.4, 27]);
}
