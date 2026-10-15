// Cumulus for the Lanna cartoon kit: puffy clouds that drift, with depth, drawn as
// the old cartoons drew them: flat colour in three tones inside a line round the
// outside of each cloud, and a few lines inside it where one puff rounds over another.
// (The kit's own clouds() paints the flat scroll clouds of the murals; this is the other kind.)
//
// Each cloud is a pile of discs on a flat base, taller in the middle. Each puff is
// one of three flat tones by how high it sits, lit on top and in shade below (at
// dusk the light comes from below), and a little lighter toward the sun's side.
// The line round the outside is drawn as the kit draws a hose: every disc first in
// ink and a little larger, then every disc in its tone, so only the outer edge of
// the pile keeps its ink. The inner lines are the lower arcs of every third puff,
// stroked in ink and kept inside the pile. A cloud is drawn whole and opaque on a
// sheet of its own and then laid on the sky at one transparency, so its puffs do
// not show through each other. Each cloud sits at a depth, 1 near to 0.3 far, that
// sets its size, how fast it crosses the sky, how low it hangs toward the horizon,
// how much it fades into the distance, and how fine its line is. Nothing is kept
// between frames: second t alone says where each cloud is, so render.py's frames
// and the browser's playing agree, and scrubbing back shows the same sky.
//
// Load this file after oldcartoon.js. The sky is painted once; the clouds go on
// each frame, over the sky and under the hills, so a film keeps its land on a
// clear sheet of its own:
//   pen.drawImage(SKY, 0, 0);
//   cumulus(pen, t, CLOUD_LOOKS.day);
//   pen.drawImage(LAND, 0, 0);
// A look may name its own "ink"; otherwise the line is the kit's ink for the lit tone.

var CLOUD_LOOKS = {                      // lit on top and in shade below; lit from below at dusk
  day: {count: 7, lit: "#ffffff", shade: "#aebdcc", below: false},
  dusk: {count: 5, lit: "#ffd9a8", shade: "#8a6888", below: true},
  night: {count: 4, lit: "#4a5a7a", shade: "#2a3352", below: false, ink: "#0d1226"}   // the kit's brown ink would read light on a night cloud
};

var CUMULUS_SHEET = document.createElement("canvas");   // one cloud at a time is drawn here, whole, then laid on the sky
CUMULUS_SHEET.width = WIDE;
CUMULUS_SHEET.height = 1080;
var CUMULUS_PEN = CUMULUS_SHEET.getContext("2d");

function cumulus(brush, t, look) {
  var ink = look.ink || inkFor(look.lit), mid = blend(look.shade, look.lit, 0.55), b = CUMULUS_PEN;
  for (var n = 0; n < look.count; n++) {
    var k = 0.3 + 0.7 * dice(n * 7 + 1), wide = (260 + 320 * dice(n * 7 + 2)) * k, tall = wide * 0.42;
    var room = WIDE + 2 * wide, x = ((dice(n * 7 + 3) * WIDE + 40 * t * k + wide) % room + room) % room - wide;   // off one side, back on the other
    var base = 100 + 260 * dice(n * 7 + 4) + 200 * (1 - k);
    var line = STYLE.line * (0.5 + 0.7 * k), puffs = [], p, puff;
    var left = WIDE, right = 0, top = 1080, bottom = 0;
    for (p = 0; p < 12; p++) {
      var across = dice(n * 31 + p * 3) - 0.5, up = dice(n * 31 + p * 3 + 1) * dice(n * 31 + p * 3 + 2);
      var px = x + across * wide, py = base - up * tall * (1 - 1.4 * across * across);
      var r = wide * (0.15 + 0.12 * dice(n * 31 + p * 3 + 2)) * (1 - 0.8 * across * across);
      var high = (look.below ? 1 - up : up) + across * 0.2;   // how lit this puff is: by its height, and a little toward the sun's side
      puffs.push({x: px, y: py, r: r, high: high, tone: high > 0.4 ? look.lit : high > 0.12 ? mid : look.shade});
      left = Math.min(left, px - r - line);
      right = Math.max(right, px + r + line);
      top = Math.min(top, py - r - line);
      bottom = Math.max(bottom, py + r + line);
    }
    left = Math.max(0, Math.floor(left));            // the part of the cloud that is on the sheet
    top = Math.max(0, Math.floor(top));
    right = Math.min(WIDE, Math.ceil(right));
    bottom = Math.min(1080, Math.ceil(bottom));
    if (right <= left || bottom <= top) { continue; }
    b.clearRect(left, top, right - left, bottom - top);
    b.fillStyle = ink;                               // the ink first, every puff a little larger: the pile's outer edge keeps a line
    b.beginPath();
    for (p = 0; p < puffs.length; p++) {
      puff = puffs[p];
      b.moveTo(puff.x + puff.r + line, puff.y);
      b.arc(puff.x, puff.y, puff.r + line, 0, 7);
    }
    b.fill();
    puffs.sort(function (c, d) { return c.high - d.high; });   // the shaded puffs first, so that the lit ones lie over them, whichever side the light is on
    for (p = 0; p < puffs.length; p++) {
      puff = puffs[p];
      b.fillStyle = puff.tone;
      b.beginPath();
      b.arc(puff.x, puff.y, puff.r, 0, 7);
      b.fill();
    }
    b.save();                                        // the inner lines: the lower arc of every third puff, kept inside the pile
    b.beginPath();
    for (p = 0; p < puffs.length; p++) {
      puff = puffs[p];
      b.moveTo(puff.x + puff.r, puff.y);
      b.arc(puff.x, puff.y, puff.r, 0, 7);
    }
    b.clip();
    b.strokeStyle = ink;
    b.lineWidth = line * 0.8;
    b.lineCap = "round";
    b.beginPath();
    for (p = 1; p < puffs.length; p += 3) {
      puff = puffs[p];
      b.moveTo(puff.x + Math.cos(0.2 * Math.PI) * puff.r * 0.96, puff.y + Math.sin(0.2 * Math.PI) * puff.r * 0.96);
      b.arc(puff.x, puff.y, puff.r * 0.96, 0.2 * Math.PI, 0.8 * Math.PI);
    }
    b.stroke();
    b.restore();
    brush.globalAlpha = 0.35 + 0.6 * k;              // the whole cloud at once, fainter the further off it is
    brush.drawImage(CUMULUS_SHEET, left, top, right - left, bottom - top, left, top, right - left, bottom - top);
    b.clearRect(left, top, right - left, bottom - top);   // the sheet is left clear: a cloud's edge must not pick up another's pixels beside it
  }
  brush.globalAlpha = 1;
}
