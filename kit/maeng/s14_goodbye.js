// s14_goodbye.js - scene 14 of the film of the creature with four ears and five eyes: the goodbye (16 s).
// The yard by the hut at dusk, its lamp lit, as the tale began: Bua-kham, who tells the kit's tales, comes in
// and says what the tale teaches, be good, work hard and be honest, like Thukkhata; then she waves goodbye to
// the children. (The lanna_cartoon page's own goodbye, when the whole video ends, is a wai since 2026-10-20; this one
// is the tale's wave, inside the picture.)
var S14_LONG = 16;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets of the yard at dusk.
var S14_SOUND = {calls: [[0, "crickets", 0.3, 16]]};
var S14_LINES = [[2.0, 7.86, "M078"], [8.06, 11.78, "M079"]];
var S14_SPEAKS = [[2.0, 7.46], [8.06, 11.38]];          // she says them herself: her mouth moves through them
var S14_WAVE = [7.9, 8.7, 12.1, 12.9];               // the hand goes up, waves from, waves until, is down
var S14_LIFE = [
  {name: "flock at dusk", kind: "flock", layer: "back", course: [[0.5, -150, 230], [13.0, 2150, 180]]}
];

function s14Ease(u) { u = clamp(u); return u * u * (3 - 2 * u); }

function sceneGoodbye(t) {
  var dusk = 0.35;
  maengYardAt(t, dusk, 1);
  decorate(t, S14_LIFE, "back");
  var look = cast("buakham", {size: 1.05, id: "buakham", smile: 1}), walk = stroll(t, 2120, 1240, 0.3, look);
  if (t > walk.arrives) {
    var speaking = S14_SPEAKS.some(function (s) { return t >= s[0] && t < s[1]; });
    var w = S14_WAVE, up = s14Ease((t - w[0]) / (w[1] - w[0])) * (1 - s14Ease((t - w[2]) / (w[3] - w[2])));
    var swing = Math.sin((t - w[1]) * Math.PI * 3) * clamp((t - w[1]) / 0.3) * clamp((w[2] - t) / 0.3);
    var turn = 1.4 - 2.2 * up + 0.22 * swing;
    Object.assign(walk.look, {face: -1, feel: "happy", glance: [1.5, 0],
                              mouth: speaking ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8.5)), wide: 0.5, round: 0.15} : undefined});
    if (up > 0) { walk.look.handA = [95 * Math.cos(turn), 95 * Math.sin(turn)]; walk.look.wristA = 0.4 * swing; }
  }
  person(walk.x, 965, walk.look);
  maengDark(t, S14_LONG - 1.8, S14_LONG + 10);
  maengDark(t, -10, 0);
}
