// s05_thukkhita.js - scene 5 of the film of Chang Ngu: Thukkhita (25 s). A year after the exile, inside the headman's
// house by day: the queen sits on the mat beside the hanging cradle and rocks it, her hand on its edge, the baby
// asleep in it; the headman stands by, tired and smiling at him; the camera comes slowly in on the cradle as the voice
// says to remember the boy's name.
var C05_LONG = 25;
var C05_SOUND = {calls: []};
var C05_LINES = [[1.6, 7.22, "C018"], [7.42, 14.62, "C019"], [14.82, 20.34, "C020"]];
var C05_CRADLE = [860, 820];                           // the cradle's lowest point, low over the floor by the queen

// Scene 5, the entry the film calls (SCENES): t, its own second, 0 to C05_LONG (25 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngRoom("day"), CNG_FLOOR, CNG_BEAM, cngPerson() with CNG_QUEEN and CNG_HEADMAN;
// from chiangsaen.js hangingCradle(). Its words are C05_LINES (C018 to C020). Its z plan: the room, then by drawByZ the
// queen, the cradle (hung over the floor, by its foot) and the headman, nearer lower. e.g. cngSceneThukkhita(10);
function cngSceneThukkhita(t) {
  var push = Math.pow(between(t, 12, 24), 1.3), zoom = 1.45 + 0.35 * push * push * (3 - 2 * push);
  pen.save();
  pen.translate(C05_CRADLE[0], C05_CRADLE[1]);
  pen.scale(zoom, zoom);
  pen.translate(-C05_CRADLE[0], -C05_CRADLE[1]);
  pen.drawImage(cngRoom("day"), 0, 0);
  var swing = Math.sin(t * 1.6) * 10 * 0.9;              // as hangingCradle swings it
  drawByZ([
    {name: "queen", kind: "person", x: C05_CRADLE[0] - 200, y: CNG_FLOOR + 40, draw: function () {
      person(C05_CRADLE[0] - 200, CNG_FLOOR + 40, cngPerson("maiden", CNG_QUEEN, {id: "thewi", floor: "side", face: 1, feel: "happy",
                                                                                  reachA: [C05_CRADLE[0] - 64 + swing, C05_CRADLE[1] - 18],
                                                                                  at: [C05_CRADLE[0], C05_CRADLE[1] - 30]}));
    }},
    {name: "cradle", kind: "thing", x: C05_CRADLE[0], y: CNG_FLOOR + 30, draw: function () {
      hangingCradle(pen, C05_CRADLE[0], C05_CRADLE[1], 0.9, t, {beam: false, top: CNG_BEAM});
    }},
    {name: "headman", kind: "person", x: C05_CRADLE[0] + 260, y: CNG_FLOOR + 60, draw: function () {
      person(C05_CRADLE[0] + 260, CNG_FLOOR + 60, cngPerson("noble", Object.assign({}, CNG_HEADMAN, {sarong: CNG_KING.sarong}),
                                                           {id: "phang", face: -1, feel: "happy", smile: 0.4, at: [C05_CRADLE[0], C05_CRADLE[1] - 30]}));
    }}
  ]);
  pen.restore();
  cngFadeIn(t, 1);
}
