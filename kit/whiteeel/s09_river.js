// s09_river.js - scene 9 of the film of the White Eel: down to the river (40 s). Three shots, through black: night at
// her house, the lamp lit within; he stands on her veranda and tells her he is going out for a while, and that
// whatever happens tonight she must not come down until she sees his face again; then he goes down her ladder and away
// into the dark; the Kok under the moon, fireflies over the plain: a ripple, and something long and pale gleams once
// under the water and is gone (never a tail or a head: story.py); and her door again, she looking out toward the
// river, and going in.
var W09_LONG = 44.61;
var W09_SOUND = {calls: [[0, "crickets", 0.14, 44.61], [22.09, "frogs", 0.18, 15.52], [30.61, "toad", 0.12]]};
var W09_LINES = [[1.2, 6.91, "W032"], [7.18, 15.85, "W033"], [17.72, 24.43, "W034"]];
var W09_CUTS = [24.81, 37.61];                           // the first after the line of his going ends

// Shot 1: on her veranda; he speaks; he goes down and away into the dark.
function w09Veranda(t) {
  welYardNight(t, true);
  var top = WEL_YARD[1] - WEL_HOUSE_TOP * WEL_YARD[2], ladder = WEL_YARD[0] + WEL_LADDER * WEL_YARD[2] + 16;
  var down = between(t, 15.92, 17.72), away = between(t, 17.72, 24.41), x, y;
  if (down <= 0) { x = WEL_YARD[0] + 70; y = top + 4; }
  else if (away <= 0) { x = ladder; y = mix(top + 6, WEL_YARD[1] + 22, down); }
  else { x = mix(ladder, 760, away); y = mix(WEL_YARD[1] + 22, WEL_PATH - 20, away); }
  person(WEL_YARD[0] - 50, top + 4, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: 1, holding: null, at: [x, y - 220],
                                                                         feel: t > 7 && t < 16.92 ? "concerned" : undefined}));
  pen.save();
  pen.globalAlpha = 1 - between(t, 21.54, 24.41);         // into the dark
  person(x, y, welPerson("inta", WEL_YOUNG, {id: "young", face: down > 0 ? -1 : -1, step: (down > 0 && down < 1) || (away > 0 && away < 1) ? t / BEAT * 0.9 : 0,
                                            mouth: welTalk(t, welSays(t, W09_LINES, ["W032", "W033"])), at: down > 0 ? undefined : [WEL_YARD[0] - 50, top - 200]}));
  pen.restore();
}

// Shot 2: the Kok under the moon: a ripple, a pale gleam once under the water, gone.
function w09Kok(t) {
  var gleam = between(t, 30.21, 31.41) * (1 - between(t, 33.61, 35.01)), gx = mix(1500, 760, between(t, 30.21, 35.01));
  welKokNight(t);
  if (gleam > 0) {                                      // seen through the water's face, long and pale
    var g = pen.createRadialGradient(gx, 664, 6, gx, 664, 260);
    g.addColorStop(0, "rgba(236, 242, 250, " + (0.42 * gleam).toFixed(3) + ")");
    g.addColorStop(1, "rgba(236, 242, 250, 0)");
    pen.save(); pen.fillStyle = g; pen.translate(gx, 664); pen.scale(1, 0.1); pen.translate(-gx, -664);
    pen.beginPath(); pen.arc(gx, 664, 260, 0, 7); pen.fill(); pen.restore();
  }
  ripples(pen, [[1560, 662, 24.4], [1580, 668, 25.0], [820, 660, 30.2]], t);
  sceneryReeds(1700, 744, 0.8, t, "back"); sceneryReeds(1700, 744, 0.8, t, "front");
  sceneryReeds(260, 748, 0.7, t + 3, "back"); sceneryReeds(260, 748, 0.7, t + 3, "front");
  sceneryFireflies(t, {far: [[[0, WEL_KOK_BANK, WIDE, 1000], 60, 5]], near: 10});
}

// Shot 3: her door; she looks out toward the river, and goes in.
function w09Door(t) {
  welYardNight(t, true);
  var top = WEL_YARD[1] - WEL_HOUSE_TOP * WEL_YARD[2], go = between(t, 41.21, 43.21);
  pen.save();
  pen.globalAlpha = 1 - go;
  person(WEL_YARD[0] - 50 + 40 * go, top + 4, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: go > 0 ? 1 : -1, holding: null,
    at: [200, 700], feel: "concerned", step: go > 0 && go < 1 ? t / BEAT * 0.8 : 0}));
  pen.restore();
  sceneryFireflies(t, {far: [[[0, 700, WIDE, 1000], 30, 9]], near: 6});
}

// Scene 9, the entry the film calls (SCENES): t, its own second, 0 to W09_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welYardNight(), welKokNight(), WEL_YARD, WEL_LADDER, WEL_HOUSE_TOP, WEL_PATH,
// welPerson() with WEL_WIDOW and WEL_YOUNG, welTalk(); from changngu/sets.js cngCutsOver(). Its words are W09_LINES.
function welSceneRiver(t) {
  if (t < W09_CUTS[0]) { w09Veranda(t); }
  else if (t < W09_CUTS[1]) { w09Kok(t); }
  else { w09Door(t); }
  cngCutsOver(t, W09_CUTS);
  welFadeIn(t, 1.5);
}
