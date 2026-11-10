// s11_water.js - scene 11 of the film of the White Eel: morning water (40 s). One shot. Sunrise: where the city was there
// is only still water, wide to both edges of the picture and on past them, mist lifting off it as the light comes; reeds;
// egrets crossing low; and in the middle of it the widow's house alone on its posts, standing in the water, her small
// figure on its veranda looking to the north and to the south. The camera draws slowly back from her house to the
// whole of the water. The water is the marsh of today's Nong Lom (scene 1's: sets.js welMarshWater()), as it was born.
var W11_LONG = 43.93;
var W11_SOUND = {calls: [[0, "wind", 0.1, 43.93], [3.02, "egret", 0.15], [9.07, "plover", 0.18], [23.93, "dove", 0.12]]};
var W11_LINES = [[1.6, 7.61, "W040"], [10.47, 15.55, "W041"], [18.34, 23.85, "W042"]];
var W11_HOUSE = [980, 760, 1.1];                       // her house in the water: x, the posts' foot (under the water), size
var W11_WATERLINE = 712;                               // where the water stands on its posts
var W11_SUN = [1400, 520, 300];
var W11_EGRETS = [{course: [[3.02, 2050, 600], [16.34, -150, 570]], high: 30, look: {fly: true, size: 0.7, seed: 4}},
                  {course: [[4.23, 2100, 630], [17.94, -120, 600]], high: 26, look: {fly: true, size: 0.6, seed: 9}}];
var W11_REEDS = [[300, 700, 0.5], [520, 690, 0.4], [1420, 696, 0.45], [1660, 706, 0.55], [1180, 740, 0.35], [760, 738, 0.3]];

// Scene 11, the entry the film calls (SCENES): t, its own second, 0 to W11_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welClouds(), welFar(), welMarshWater(), WEL_WATER, welWidowHouse(), welAbove(),
// welPerson() with WEL_WIDOW; from kit's lannabirds egret(). Its words are W11_LINES (W040 to W042).
function welSceneWater(t) {
  var light = between(t, 0, W11_LONG), dawn = 1 - between(t, 4, W11_LONG - 4), back = between(t, 0, 33.93);
  var zoom = mix(1.45, 1.0, back * back * (3 - 2 * back));
  pen.save();
  pen.translate(W11_HOUSE[0], 620); pen.scale(zoom, zoom); pen.translate(-W11_HOUSE[0], -620);   // drawing back from her house
  pen.drawImage(welSky("sunrise"), -200, 0, WIDE + 400, 1080);
  pen.globalAlpha = 0.2 + 0.6 * light;
  pen.drawImage(welSky("day"), -200, 0, WIDE + 400, 1080);
  pen.globalAlpha = 1;
  welClouds(t + 30, "dawn", 1 - light);
  welClouds(t + 30, "day", light);
  scenerySun(t, W11_SUN[0], mix(W11_SUN[1], W11_SUN[2], light), 30, {glow: 10, colour: "255, 206, 150"});
  welFar(pen, WEL_WATER);
  pen.globalAlpha = 1 - light;
  welFar(pen, WEL_WATER, "dawn");
  pen.globalAlpha = 1;
  welFlocks(t, [[-300, 220, 50]]);
  var water = welMarshWater(), top = W11_HOUSE[1] - WEL_HOUSE_TOP * W11_HOUSE[2];
  sceneryWaterDepths(water);
  welFish(t, [["barb", 520, 900, 220, 0.8, 5], ["gourami", 1450, 960, 200, 0.9, 6], ["snakehead", 900, 1020, 180, 0.8, 7]]);
  function herHouse() {
    welWidowHouse(pen, W11_HOUSE[0], W11_HOUSE[1], W11_HOUSE[2]);
    person(W11_HOUSE[0] - 50, top + 4, welPerson("grandmother", WEL_WIDOW, {id: "widow", holding: null, face: Math.sin(t * 0.5) > 0 ? 1 : -1,
                                                                            size: WEL_WIDOW.size * W11_HOUSE[2] / WEL_YARD[2],   // to her house's scale, as in her yard
                                                                             feel: t > 10.07 ? "awe" : undefined,
                                                                            at: [Math.sin(t * 0.5) > 0 ? 1900 : 0, top - 40]}));
  }
  herHouse();                                           // whole, so the water's face lies over its posts
  sceneryWaterSurface(t, water, function () {           // the egrets' reflections
    W11_EGRETS.forEach(function (e) {
      var at = courseAt(t, e.course);
      if (!at.on) { return; }
      pen.save(); pen.globalAlpha = 0.45; pen.translate(0, 2 * (at.y + e.high)); pen.scale(1, -1);
      egret(at.x, at.y, t, Object.assign({}, e.look, {face: at.face})); pen.restore();
    });
  });
  welAbove(W11_WATERLINE, herHouse);                    // and again above the water: the posts go down into it
  welWadeRings(W11_HOUSE[0], W11_WATERLINE, 300, t * 0.4);
  softMist(t, WEL_WATER + 30, 60, 0.6 * dawn, 21, "250, 232, 214");   // the mist on the water, lifting as the day comes
  natSteam(t, -300, WIDE + 300, WEL_WATER + 80, {count: 50, rise: 70, wide: 160, life: 9, lean: 90, alpha: 0.3 * dawn, flat: 0.2, patch: 0.85,
                                                  colour: "250, 236, 222", sun: W11_SUN[0], glow: 0.6, seed: 13});
  natSteam(t, -300, WIDE + 300, WEL_WATER + 220, {count: 60, rise: 90, wide: 130, life: 8, lean: 120, alpha: 0.32 * dawn, flat: 0.05, patch: 0.85,
                                                   colour: "250, 236, 222", sun: W11_SUN[0], glow: 0.6, seed: 15});
  natGlitter(t, W11_SUN[0], WEL_WATER, 1080, 0.8 * (0.5 + 0.5 * dawn), "255, 214, 160");
  W11_REEDS.forEach(function (r) { sceneryReeds(r[0], r[1], r[2], t, "back"); sceneryReeds(r[0], r[1], r[2], t, "front"); });
  W11_EGRETS.forEach(function (e) {
    var at = courseAt(t, e.course);
    if (at.on) { egret(at.x, at.y, t, Object.assign({}, e.look, {face: at.face})); }
  });
  sceneryReeds(60, 1110, 1.5, t, "back"); sceneryReeds(60, 1110, 1.5, t, "front");   // reeds framing the front
  sceneryReeds(1870, 1100, 1.35, t + 2, "back"); sceneryReeds(1870, 1100, 1.35, t + 2, "front");
  welDragonflies(t, [["glider", [300, 700, 800, 840], 6, 1.2], ["scarlet", [1150, 720, 1650, 850], 7, 1.2]]);
  sceneryAir(t, {butterfly: null, petals: null, light: [0.5, 6]});
  pen.restore();
  welFadeIn(t, 1.5);
}
