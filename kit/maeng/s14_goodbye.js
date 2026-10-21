// s14_goodbye.js - scene 14 of the film of the creature with four ears and five eyes: the goodbye (16 s).
// The yard by the hut at dusk, its lamp lit, as the tale began: Bua-kham, who tells the kit's tales, comes in
// and says what the tale teaches, be good, work hard and be honest, like Thukkhata; then she says goodbye to the
// children with a wai, as the lanna_cartoon page's own goodbye does (owner, 2026-10-21: "go to the very end scene
// of the video and change the woman's movement from a wave to a wai"; it was a wave).
var S14_LONG = 16;
// Its sounds (sounds.py, mixed in by feelings.py as a life's calls are: [second, sound, loudness], and a bed's
// seconds after them): the crickets of the yard at dusk.
var S14_SOUND = {calls: [[0, "crickets", 0.3, 16]]};
var S14_LINES = [[2.0, 7.86, "M078"], [8.06, 11.78, "M079"]];
var S14_SPEAKS = [[2.0, 7.46], [8.06, 11.38]];          // she says them herself: her mouth moves through them
var S14_WAI = [7.9, 8.4, 12.3, 12.8];                // the hands come up, are joined (a wai, and a small bow), part, are down
var S14_LIFE = [
  {name: "flock at dusk", kind: "flock", layer: "back", course: [[0.5, -150, 230], [13.0, 2150, 180]]}
];

// u: 0 to 1 (held there outside it); gives back 0 to 1, eased in and out. e.g. var up = s14Ease((t - 7.9) / 0.5);
function s14Ease(u) { u = clamp(u); return u * u * (3 - 2 * u); }

// Scene 14, the entry the film calls (SCENES): t, its own second, 0 to S14_LONG (16 s): Bua-kham walks in from 0.3 s,
// speaks (S14_SPEAKS), and makes a wai over S14_WAI (7.9 s to 12.8 s); out of black at the start, into it from 14.2 s.
// Gives back nothing: it draws the whole sheet with pen. From sets.js: maengYardAt() at dusk 0.35 with the lamp lit,
// maengDark(). Its life is S14_LIFE; its words S14_LINES (M078, M079), written under it by the page.
// e.g. sceneGoodbye(10);
function sceneGoodbye(t) {
  var dusk = 0.35;
  maengYardAt(t, dusk, 1);
  decorate(t, S14_LIFE, "back");
  var look = cast("buakham", {size: 1.05, id: "buakham", smile: 1}), walk = stroll(t, 2120, 1240, 0.3, look);
  if (t > walk.arrives) {
    var speaking = S14_SPEAKS.some(function (s) { return t >= s[0] && t < s[1]; });
    var w = S14_WAI, up = s14Ease((t - w[0]) / (w[1] - w[0])) * (1 - s14Ease((t - w[2]) / (w[3] - w[2])));
    Object.assign(walk.look, {face: -1, feel: "happy", glance: [1.5, 0], bend: 0.12 * up,
                              mouth: speaking ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8.5)), wide: 0.5, round: 0.15} : undefined});
    // the hands rise from beside her to before her chest, and there the kit's wai joins them palm to palm
    if (up >= 0.97) { walk.look.wai = true; }
    else if (up > 0) {
      walk.look.handA = [mix(12, -16, up), mix(92, 0, up)]; walk.look.handB = [mix(-12, 16, up), mix(92, 0, up)];
      walk.look.wristA = -1.2 * up; walk.look.wristB = 1.2 * up;
    }
  }
  person(walk.x, 965, walk.look);
  maengDark(t, S14_LONG - 1.8, S14_LONG + 10);
  maengDark(t, -10, 0);
}
