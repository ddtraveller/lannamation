// s03_situang.js - scene 3 of the film of Chang Ngu: to Si Tuang (35 s). King Phang and Queen Thewi walk the path along
// the Mae Sai under Doi Nang Non, two of their people behind them with their things on carrying poles, the camera going
// with them out of the valley and into the village; before the house that will be theirs he lifts the crown from his
// head with both hands, and stands in a headman's plain head-cloth, the queen beside him.
var C03_LONG = 50.85;
var C03_SOUND = {calls: []};
var C03_LINES = [[1.6, 14.24, "C009"], [14.52, 29.05, "C010"], [29.31, 33.8, "C011"], [40.36, 47.5, "C012"]];
var C03_OFF = [38.76, 40.16];                            // he lifts the crown off: his hands up, then down
// The meadow's life (sets.js cngVillage(): the valley a meadow in flower, the owner, 2026-10-27), in the two panels'
// pixels: a barking deer and her fawn grazing at the forest's edge, doves on the near ground, butterflies over the
// flowers, a flock going over; and on the path ahead of the walkers six red avadavats (C03_FLOCK), which took the
// egrets' place (the owner, 2026-11-18: "replace the egrets with a flock of nok gating daeng").
var C03_LIFE = [
  cngFeeding("barking deer", "deer", {size: 0.4}, 1840, 786, 9, 0, 36, 120),
  cngFeeding("her fawn", "deer", {size: 0.4, fawn: true}, 1730, 790, 11, 0, 36, 90),
  cngFeeding("dove 1", "dove", {size: 0.55}, 520, 1046, 13, 0, 36, 140),
  cngFeeding("dove 2", "dove", {size: 0.55}, 640, 1052, 15, 0, 36, 140),
  {name: "butterfly 1", kind: "butterfly", layer: "back", look: {size: 0.7, seed: 1},
   course: [[0, 260, 1010], [4.51, 520, 990, "sip"], [8.68, 520, 990], [16.26, 900, 1020, "sip"], [22.46, 900, 1020], [29.79, 1300, 1000], [51.85, 2600, 980]]},
  {name: "butterfly 2", kind: "butterfly", layer: "back", look: {kind: "birdwing", size: 0.6, seed: 2},
   course: [[0, 1180, 980], [6.6, 980, 1000, "sip"], [12.84, 980, 1000], [22.46, 1400, 970, "sip"], [28.66, 1400, 970], [51.85, 2900, 990]]},
  {name: "flock", kind: "flock", layer: "back", course: [[2.43, 2150, 240], [20.4, -320, 190]]}
];

// Where the walkers are at second t: the king's x (pixels of the village's two panels) and his step; they walk from the
// valley's far left to before the headman's house, arriving at 37.76 s, at one pace from the first step to the last
// (the owner, 2026-11-18: "the people are walking without moving at first": between() eased in, so their legs strode
// for seconds while they hardly moved). e.g. var w = c03Walk(10);
function c03Walk(t) {
  var u = clamp((t - 1) / 36.76);
  return {x: mix(220, CNG_HOUSE[0] - 160, u), step: u > 0 && u < 1 ? (t - 1) / BEAT / 2 : 0, walking: u > 0 && u < 1};
}

// Six red avadavats (chiangsaen.js redAvadavat(), นกกระติ๊ดแดง) pecking on the path ahead of the walkers (the owner,
// 2026-11-18: "Add 6 birds in a flock pecking on the ground and when the people approach the nearest bird should fly
// away off screen and as soon as it takes off the other birds should fly away as well"). [x, y] on the ground, the
// nearest to the walkers first; the first goes up when the king is C03_SHY pixels from it, the others one by one
// after it, each away from the walkers and up out of the picture.
var C03_FLOCK = [[1150, 876], [1196, 884], [1232, 870], [1278, 880], [1318, 873], [1362, 883]];   // on the meadow behind the path, clear of the words
var C03_SHY = 260;
var C03_FINCH = 1.3;                                     // their size: redAvadavat()'s (a little over life, to be seen)
function c03Up(k) {                                      // the second bird k takes off
  var first = 1 + 36.76 * (C03_FLOCK[0][0] - C03_SHY - 220) / (CNG_HOUSE[0] - 160 - 220);
  return first + (k ? 0.3 + 0.13 * k : 0);
}
function c03OnGround(k, t) {                             // on the ground: pecking, a little hop now and then
  var clock = t / 1.7 + dice(k * 7 + 1), slot = Math.floor(clock), into = clock - slot;
  var spot = function (n) { return (dice(k * 31 + n * 3) - 0.5) * 30; };
  var hop = clamp(into / 0.16), dx = mix(spot(slot - 1), spot(slot), hop);
  return {x: C03_FLOCK[k][0] + dx, y: C03_FLOCK[k][1] - 7 * Math.sin(Math.PI * hop) * (into < 0.16 ? 1 : 0),
          face: spot(slot) >= spot(slot - 1) ? 1 : -1, peck: into > 0.24 ? Math.max(0, Math.sin((t + k * 0.37) * Math.PI * 4)) : 0};
}
function c03Flock(t) {
  C03_FLOCK.forEach(function (home, k) {
    var up = c03Up(k);
    if (t < up) {
      var at = c03OnGround(k, t);
      redAvadavat(pen, at.x, at.y, C03_FINCH, {face: at.face, t: t + k, peck: at.peck});
      return;
    }
    var u = (t - up) / 1.9;
    if (u >= 1) { return; }
    var from = c03OnGround(k, up);                       // up and away ahead of them, gone off the top right
    var x = from.x + 1300 * u + 60 * Math.sin(u * 7 + k), y = from.y - 18 - 820 * u * (0.6 + 0.4 * u);
    redAvadavat(pen, x, y, C03_FINCH, {face: 1, t: t + k * 0.2, fly: true});
  });
}

// Scene 3, the entry the film calls (SCENES): t, its own second, 0 to C03_LONG (35 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngSky("day"), cngClouds(), cngVillage(), cngFeeding(), CNG_HOUSE, CNG_GROUND, cngPerson()
// with CNG_KING, CNG_HEADMAN and CNG_QUEEN. Its words are C03_LINES (C009 to C012).
// Its z plan: the sky and the village's back sheet painted first; then by drawByZ the walkers by their feet; then the
// near ground's fences over them. e.g. cngSceneSituang(12);
function cngSceneSituang(t) {
  var w = c03Walk(t), cam = Math.max(0, Math.min(WIDE, w.x - 720));
  var lift = between(t, C03_OFF[0] - 0.5, C03_OFF[0] + 0.7) * (1 - between(t, C03_OFF[1] - 0.2, C03_OFF[1] + 1.2));   // over 1.2 and 1.4 s: faster, the forearm's reach jumps (pop_check)
  var crowned = t < (C03_OFF[0] + C03_OFF[1]) / 2;       // the crown comes off while his hands are at his head
  var king = Object.assign({}, crowned ? CNG_KING : CNG_HEADMAN, crowned ? {} : {sarong: CNG_KING.sarong});
  pen.drawImage(cngSky("day"), 0, 0);
  cngClouds(t + 10, "day");
  var village = cngVillage();
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  decorate(t, cngYard(CNG_HOUSE[0] + 300, CNG_GROUND - 24, 1), "back");                 // the yard's fowl (owner, 2026-10-25)
  decorate(t, C03_LIFE, "back");                         // the meadow's birds, deer and butterflies
  c03Flock(t);                                           // the red avadavats on the path, until the walkers come
  var ground = CNG_GROUND;
  drawByZ([
    {name: "king", kind: "person", x: w.x, y: ground, draw: function () {
      person(w.x, ground, cngPerson("noble", king, {id: "phang", face: 1, step: w.step, feel: t > 34.76 ? "sad" : undefined,
                                                   handA: lift > 0 ? liftHand(lift) : undefined,
                                                   handB: lift > 0 ? liftHand(lift, -1) : undefined}));
    }},
    {name: "queen", kind: "person", x: w.x - 120, y: ground - 14, draw: function () {
      person(w.x - 120, ground - 14, cngPerson("maiden", CNG_QUEEN, {id: "thewi", face: 1, step: w.step + 0.4, feel: t > 36.76 ? "concerned" : undefined}));
    }},
    {name: "porter 1", kind: "person", x: w.x - 300, y: ground + 10, draw: function () {
      cngPorter(w.x - 300, ground + 10, cngPerson("villager", {size: 0.66, id: "porter1", face: 1, step: w.step + 0.2, sabai: false}));
    }},
    {name: "porter 2", kind: "person", x: w.x - 470, y: ground + 4, draw: function () {
      cngPorter(w.x - 470, ground + 4, cngPerson("villager", {size: 0.64, id: "porter2", face: 1, step: w.step + 0.6, sabai: false}));
    }}
  ]);
  pen.drawImage(village.front, 0, 0);
  pen.restore();
  cngBeds(t, "village", "frame");                        // soft grass in the corners, and the light coming through: no
  sceneryAir(t, {butterfly: null, petals: null, light: [0.5, 3]});   // petals or butterfly, he is losing his crown
  cngFadeIn(t, 1);
}
