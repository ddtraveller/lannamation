// s25_today.js - scene 25 of the film of Chang Ngu: Chiang Saen today (30 s). One shot: evening on the road into
// Chiang Saen, the far hills and the town's trees, and at the roundabout the statue of Chang Ngu, three elephant
// heads on a snake's body, standing in its pool, the fountain lit (the Ministry of Culture's page: lit 18:00 to
// 21:00); then Bua-kham, who tells the kit's tales, comes in, says what the tale teaches, and says goodbye with a wai,
// as the first tale's goodbye (maeng/s14: the owner, 2026-10-21, a wai and not a wave); into black at the end.
var C25_LONG = 30;
var C25_SOUND = {calls: []};
var C25_LINES = [[1.4, 6.62, "C120"], [6.82, 10.26, "C121"], [13.0, 18.65, "C122"]];
// Its life (decorate.js; owner, 2026-10-25): a flock going home over the fields at dusk, after the words.
var C25_LIFE = [{name: "flock home at dusk", kind: "flock", layer: "back", course: [[19.0, 2150, 300], [27.0, -320, 240]]}];
var C25_SPEAKS = [[13.0, 18.25]];                      // Bua-kham says the moral herself: her mouth moves through it
var C25_WAI = [18.8, 19.3, 23.2, 23.7];                // the hands come up, are joined, part, are down
var C25_POOL = [880, 800, 0.9];                        // the pool: its middle's x and y, its size
var C25_CLOSE = [1.7, 9.6, 12.4];                      // close on the statue at 1.7 times, easing out to the wide from 9.6 to 12.4 s

// u: 0 to 1 (held there outside it); gives back 0 to 1, eased in and out. e.g. var up = c25Ease((t - 18.4) / 0.5);
function c25Ease(u) { u = clamp(u); return u * u * (3 - 2 * u); }

// Scene 25, the entry the film calls (SCENES): t, its own second, 0 to C25_LONG (30 s). Gives back nothing: it draws the
// whole sheet with pen. From sets.js: cngSky("dusk"), CNG_CLOUDS.dusk, cngSkyline(); from chiangsaen.js statuePool();
// from myth.js changNgu(). Its words are C25_LINES (C120 to C122). Its z plan: the sky, the hills, the road, the pool
// and the statue on its plinth; Bua-kham before them; the black over all at the end.
function cngSceneToday(t) {
  var pool = C25_POOL;
  pen.drawImage(cngSky("dusk"), 0, 0);
  cumulus(pen, t + 140, CNG_CLOUDS.dusk);
  decorate(t, C25_LIFE, "back");                      // on the frame, under the camera's close
  var out = c25Ease((t - C25_CLOSE[1]) / (C25_CLOSE[2] - C25_CLOSE[1])), zoom = mix(C25_CLOSE[0], 1, out);
  pen.save();                                                          // the camera: close on the statue, then the wide
  pen.translate(WIDE / 2, 700); pen.scale(zoom, zoom); pen.translate(-mix(pool[0], WIDE / 2, out), -700);
  cngSkyline(pen, -200, 640, 200, "#8a8aa6", 21);
  csBand(pen, -200, 620, WIDE + 400, 460, "#8fa868", "#6f8a50");               // the fields by the road at dusk
  pen.fillStyle = "#7a7470";                                           // the road, across and into the town at the right
  pen.fillRect(-200, 760, WIDE + 400, 70);
  pen.fillStyle = "#e9e2c8";
  for (var d = 0; d < WIDE; d += 120) { pen.fillRect(d, 792, 60, 5); }
  for (var k = 0; k < 7; k++) {                                        // street lamps along it, coming on
    var lx = 140 + k * 280, on = between(t, 1 + k * 0.4, 2.4 + k * 0.4);
    pen.strokeStyle = "#3a3a40"; pen.lineWidth = 5;
    pen.beginPath(); pen.moveTo(lx, 760); pen.lineTo(lx, 640); pen.lineTo(lx + 24, 640); pen.stroke();
    if (on > 0) {
      var g = pen.createRadialGradient(lx + 24, 646, 2, lx + 24, 646, 60);
      g.addColorStop(0, "rgba(255, 230, 160, " + (0.9 * on).toFixed(3) + ")"); g.addColorStop(1, "rgba(255, 230, 160, 0)");
      pen.fillStyle = g; pen.fillRect(lx - 40, 586, 130, 120);
    }
  }
  statuePool(pen, pool[0], pool[1], pool[2], t);
  changNgu(pool[0], pool[1] - 60 * pool[2], {size: 0.36, face: 1});
  var look = cast("buakham", {size: 0.86, id: "buakhamcng", smile: 1}), walk = stroll(t, 2120, 1460, 10.4, look);
  if (t > walk.arrives) {
    var speaking = C25_SPEAKS.some(function (s) { return t >= s[0] && t < s[1]; });
    var w = C25_WAI, up = c25Ease((t - w[0]) / (w[1] - w[0])) * (1 - c25Ease((t - w[2]) / (w[3] - w[2])));
    Object.assign(walk.look, {face: -1, feel: "happy", glance: [1.5, 0], bend: 0.12 * up,
                              mouth: speaking ? {open: 0.06 + 0.26 * Math.abs(Math.sin(t * 8.5)), wide: 0.5, round: 0.15} : undefined});
    if (up > 0) { walk.look.wai = up; }
  }
  person(walk.x, 880, walk.look);
  pen.restore();
  if (t > C25_LONG - 3.2) {                                           // into black
    pen.fillStyle = "rgba(0, 0, 0, " + between(t, C25_LONG - 3.2, C25_LONG - 0.6).toFixed(3) + ")";
    pen.fillRect(0, 0, WIDE, 1080);
  }
}
