// s08_young.js - scene 8 of the film of the White Eel: the young man (55 s). Two shots, through black: her yard as the
// light goes, a young man she has never seen coming along the path, to the foot of her ladder, and up it, she looking
// down from her veranda; then inside her house by one lamp (the room as the Chang Ngu film painted one, changngu/sets.js
// cngRoom("night")), she sets out rice and water for him and he does not touch them, and they talk: he asks what the
// whole city is eating, she tells him, he asks if she had some, and she says who would give her any; and he says it is
// good she did not. His face is kind and calm and nothing marks him (story.py).
var W08_LONG = 63.9;
var W08_SOUND = {calls: [[0, "crickets", 0.12, 63.9], [33.09, "tokay", 0.14]]};
var W08_LINES = [[1.2, 10.73, "W025"], [11.64, 20.81, "W026"], [21.09, 27.82, "W027"], [28.09, 35.5, "W028"], [35.77, 39.7, "W029"], [39.96, 49.89, "W030"], [50.72, 57.09, "W031"]];
var W08_CUTS = [11.24];                                  // after his first line ends
var W08_SPEAKS = {young: ["W027", "W029", "W031"], widow: ["W028", "W030"]};   // who says which line
var W08_LAMP = [960, CNG_FLOOR + 30];                  // the lamp on the floor between them
var W08_BOWL = [1120, CNG_FLOOR + 40];                 // the rice and the water she sets before him

// Whether who is speaking at second t.
function w08Says(who, t) { return welSays(t, W08_LINES, W08_SPEAKS[who]); }

// Shot 1: the yard as the light goes; he comes along the path and climbs her ladder; she looks down from the veranda.
function w08Arrive(t) {
  pen.drawImage(welSky("sunset"), 0, 0);
  welClouds(t + 90, "dusk");
  pen.drawImage(welYard("dusk"), 0, 0, WIDE, 1080);
  pen.fillStyle = "rgba(60, 40, 90, 0.42)";
  pen.fillRect(0, 0, WIDE, 1080);
  var ladder = WEL_YARD[0] + WEL_LADDER * WEL_YARD[2] + 16, top = WEL_YARD[1] - WEL_HOUSE_TOP * WEL_YARD[2];
  var walk = between(t, 0.6, 5.24), climb = between(t, 5.71, 8.8);
  var x = climb > 0 ? ladder : mix(-120, ladder, walk), y = climb > 0 ? mix(WEL_YARD[1] + 22, top + 6, climb) : WEL_PATH - 30 + 50 * walk;
  if (walk >= 1) { y = mix(WEL_YARD[1] + 22, top + 6, climb); }
  person(WEL_YARD[0] - 60, top + 4, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: 1, holding: null, at: [x, y - 200],
                                                                         feel: t > 3.34 ? "surprised" : undefined}));
  person(x, y, welPerson("inta", WEL_YOUNG, {id: "young", face: climb > 0 ? -1 : 1, step: (walk > 0 && walk < 1) || (climb > 0 && climb < 1) ? t / BEAT * 0.9 : 0,
                                            at: [WEL_YARD[0] - 60, top - 200]}));
}

// Shot 2: inside by the lamp: the rice and water set out; they talk.
function w08Inside(t) {
  pen.save();                                           // the room framed higher and closer, all of it above the words
  pen.translate(WIDE / 2, 640);
  pen.scale(1.75, 1.75);
  pen.translate(-960, -(CNG_FLOOR - 70));
  pen.drawImage(cngRoom("night"), 0, 0);
  pen.fillStyle = "rgba(10, 8, 24, 0.35)";             // only her one lamp
  pen.fillRect(0, 0, WIDE, 1600);
  pratheep(pen, W08_LAMP[0], W08_LAMP[1], 2.0, t, 2, {});
  sceneryLampLight(t, W08_LAMP[0], W08_LAMP[1] - 24, W08_LAMP[1] + 20, {reach: 300, strength: 0.8, seed: 8});
  var set = between(t, 13.17, 14.92);                     // she sets the bowl before him
  var sprites = [
    {name: "widow", kind: "person", x: 720, y: CNG_FLOOR + 40, draw: function () {
      person(720, CNG_FLOOR + 40, welPerson("grandmother", WEL_WIDOW, {id: "widow", face: 1, holding: null, floor: "side",
        reachA: set > 0 && set < 1 ? [mix(800, W08_BOWL[0] - 40, set), W08_BOWL[1] - 30] : undefined,
        mouth: welTalk(t, w08Says("widow", t)), feel: t > 39.3 && t < 49.72 ? "sad" : undefined, at: [1200, CNG_FLOOR - 160]}));
    }},
    {name: "young", kind: "person", x: 1200, y: CNG_FLOOR + 40, draw: function () {
      person(1200, CNG_FLOOR + 40, welPerson("inta", WEL_YOUNG, {id: "young", face: -1, floor: "cross",
        mouth: welTalk(t, w08Says("young", t)), feel: t > 50.72 ? "concerned" : undefined, at: [720, CNG_FLOOR - 140]}));
    }}
  ];
  if (set >= 1 || (set > 0 && set < 1)) {
    var bx = set < 1 ? mix(800, W08_BOWL[0] - 40, set) : W08_BOWL[0] - 40;
    sprites.push({name: "rice", kind: "thing", x: bx, y: W08_BOWL[1], draw: function () {
      oval(bx, W08_BOWL[1], 24, 8, "#8a5a3a");          // a bowl of rice, untouched
      oval(bx, W08_BOWL[1] - 6, 20, 7, "#f4f0e6");
      oval(bx + 46, W08_BOWL[1] + 2, 10, 5, "#8a6a4a");  // and a cup of water
      oval(bx + 46, W08_BOWL[1] - 2, 8, 3, "#a8c8d8");
    }});
  }
  drawByZ(sprites);
  pen.restore();
}

// Scene 8, the entry the film calls (SCENES): t, its own second, 0 to W08_LONG. Gives back nothing: it draws the whole
// sheet with pen. From sets.js: welSky(), welYard(), WEL_YARD, WEL_LADDER, WEL_HOUSE_TOP, WEL_PATH, welPerson() with
// WEL_WIDOW and WEL_YOUNG, welTalk(); from changngu/sets.js: cngRoom("night"), CNG_FLOOR, cngCutsOver(); from pieces.js
// pratheep(). Its words are W08_LINES (W025 to W031).
function welSceneYoung(t) {
  if (t < W08_CUTS[0]) { w08Arrive(t); } else { w08Inside(t); }
  cngCutsOver(t, W08_CUTS);
  welFadeIn(t, 1.5);
}
