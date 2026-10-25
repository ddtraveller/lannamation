// s03_situang.js - scene 3 of the film of Chang Ngu: to Si Tuang (35 s). King Phang and Queen Thewi walk the path along
// the Mae Sai under Doi Nang Non, two of their people behind them with their things on carrying poles, the camera going
// with them out of the valley and into the village; before the house that will be theirs he lifts the crown from his
// head with both hands, and stands in a headman's plain head-cloth, the queen beside him.
var C03_LONG = 35;
var C03_SOUND = {calls: []};
var C03_LINES = [[1.6, 7.96, "C009"], [8.16, 15.45, "C010"], [15.65, 19.11, "C011"], [25.6, 31.72, "C012"]];
var C03_OFF = [24.0, 25.4];                            // he lifts the crown off: his hands up, then down

// Where the walkers are at second t: the king's x (pixels of the village's two panels) and his step; they walk from the
// valley's far left to before the headman's house, arriving at 23 s. e.g. var w = c03Walk(10);
function c03Walk(t) {
  var u = between(t, 1, 23), eased = u < 1 ? u : 1;
  return {x: mix(220, CNG_HOUSE[0] - 160, eased), step: u > 0 && u < 1 ? (t - 1) / BEAT / 2 : 0, walking: u > 0 && u < 1};
}

// Scene 3, the entry the film calls (SCENES): t, its own second, 0 to C03_LONG (35 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngSky("day"), CNG_CLOUDS.day, cngVillage(), CNG_HOUSE, CNG_GROUND, cngPerson()
// with CNG_KING, CNG_HEADMAN and CNG_QUEEN. Its words are C03_LINES (C009 to C012).
// Its z plan: the sky and the village's back sheet painted first; then by drawByZ the walkers by their feet; then the
// near ground's fences over them. e.g. cngSceneSituang(12);
function cngSceneSituang(t) {
  var w = c03Walk(t), cam = Math.max(0, Math.min(WIDE, w.x - 720));
  var lift = between(t, C03_OFF[0] - 0.5, C03_OFF[0] + 0.7) * (1 - between(t, C03_OFF[1] - 0.2, C03_OFF[1] + 1.2));   // over 1.2 and 1.4 s: faster, the forearm's reach jumps (pop_check)
  var crowned = t < (C03_OFF[0] + C03_OFF[1]) / 2;       // the crown comes off while his hands are at his head
  var king = Object.assign({}, crowned ? CNG_KING : CNG_HEADMAN, crowned ? {} : {sarong: CNG_KING.sarong});
  pen.drawImage(cngSky("day"), 0, 0);
  cumulus(pen, t + 10, CNG_CLOUDS.day);
  var village = cngVillage();
  pen.save();
  pen.translate(-cam, 0);
  pen.drawImage(village.back, 0, 0);
  decorate(t, cngYard(CNG_HOUSE[0] + 300, CNG_GROUND - 24, 1), "back");                 // the yard's fowl (owner, 2026-10-25)
  var ground = CNG_GROUND;
  drawByZ([
    {name: "king", kind: "person", x: w.x, y: ground, draw: function () {
      person(w.x, ground, cngPerson("noble", king, {id: "phang", face: 1, step: w.step, feel: t > 20 ? "sad" : undefined,
                                                   handA: lift > 0 ? liftHand(lift) : undefined,
                                                   handB: lift > 0 ? liftHand(lift, -1) : undefined}));
    }},
    {name: "queen", kind: "person", x: w.x - 120, y: ground - 14, draw: function () {
      person(w.x - 120, ground - 14, cngPerson("maiden", CNG_QUEEN, {id: "thewi", face: 1, step: w.step + 0.4, feel: t > 22 ? "concerned" : undefined}));
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
  cngFadeIn(t, 1);
}
