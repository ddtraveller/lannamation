// finger_dance.js - the fingernail dance of the north, ฟ้อนเล็บ (fon lep), for the kit: its poses
// as numbers, the order they come in, and fingerDancer(), one of the kit's people dancing it.
// Load it after oldcartoon.js:
//
//     <script src="oldcartoon.js"></script>
//     <script src="finger_dance.js"></script>
//
// Read by eye (owner, 2026-10-16: "Look at that video and see if you can animate some finger
// dancers to move like that") from a performance of some hundreds of dancers at the Three Kings
// Monument, Chiang Mai, in 2015: YouTube WGAjuI6bNhw, "Incredible Lanna Style traditional dance
// performance in Chiang Mai Thailand 2015", by 55Secrets Travel. The video is not here and nothing
// of it is copied: only what the dancers do, written down as numbers.
//
// It was first read by machine, as dance_track.py read a dancer before: MediaPipe's pose model, the
// full one and then the heavy one, whole frames and a crop that followed one dancer. It could not
// read these dancers: silk sashes over white sleeves, arms held out stiff and rows of dancers in the
// same colours behind. Their arms came out hanging at their sides, or a wrist above a shoulder where
// it was plainly below, and a follow slid onto the half-hidden dancer behind. One stretch of three
// seconds, checked by eye, read true; it gave the walk's arms, low and out, the wrists some 108 below
// the shoulders, the body upright and square to the front. The rest is read by eye from the video's
// frames, a half-second apart through the walk and every two and a half seconds through the close-ups.
//
// The poses that recur, each as the kit's look keys (arm A on the picture's right):
//   low      the walk: arms low and out to the sides, each wrist bent back so the nails fan outward
//   highA    arm A curved up above the head, the wrist bent back; arm B out at the shoulder, the hand
//            up; the head toward the low hand. highB is the same the other way round
//   offer    both arms forward at the chest, the hands standing up from the bent wrists, the body
//            turned toward them, the far hand lower
//   wings    both arms spread wide at the shoulders, the hands up and back
//   peak     both hands raised over the head, the nails meeting above it
// The kit's own dancer (dance: true, nails: "long") gives every lifted hand the shape of Thai dance
// and the long gold nails; the poses only place the hands.
//
// The dance is a procession: the dancers keep walking, a step a second, dipping a little at each,
// whatever their arms do. The poses change every two seconds and each is held a third of that.
var FINGER_POSES = {
  low:   {handA: [62, 100], handB: [-62, 100], wristA: -0.9, wristB: 0.9, tilt: 0, twist: 0.8, sit: 0.08},
  highA: {handA: [22, -106], handB: [-100, -14], tilt: -0.15, twist: 0.6, sit: 0.18},
  highB: {handA: [100, -14], handB: [-22, -106], tilt: 0.15, twist: 0.6, sit: 0.18},
  offer: {handA: [100, -22], handB: [80, 4], tilt: 0.1, twist: -0.3, sit: 0.22},
  wings: {handA: [104, -16], handB: [-104, -16], tilt: 0, twist: 0.9, sit: 0.1},
  sweep: {handA: [102, -18], handB: [-36, 72], tilt: 0.05, twist: 0.4, sit: 0.16},   // on the way from the offering to the wings
  peak:  {handA: [-8, -116], handB: [8, -116], tilt: 0, twist: 1, sit: 0.05}
};

// The order, in the phrase the video's dancers go through: the walk, the hands raised in turn, the
// offering, the wings, the peak, a last raised hand, and the walk again. 32 seconds, round and round.
// From the offering to the wings the far arm goes down and round past the hip ("sweep"): straight
// across, its wrist passed through its own shoulder, where an arm has no clean bend, and every
// dancer's elbow jumped from one side to the other in a frame (arms_check: 11 flips).
var FINGER_DANCE = [["low", 0], ["low", 2], ["highA", 4], ["highB", 6], ["highA", 8], ["highB", 10],
                    ["offer", 12], ["offer", 14], ["sweep", 15], ["wings", 16], ["wings", 18], ["peak", 20], ["peak", 22],
                    ["highA", 24], ["highB", 26], ["low", 28], ["low", 30], ["low", 32]]
  .map(function (key) { return [key[1], FINGER_POSES[key[0]]]; });

// The three dresses of the video, in the kit's look keys: a white blouse and a pale blue sabai, a
// navy blouse and a pink one, a red blouse and a cream one, each with a pha sin (the kit has three:
// green and black for the first, the video's being yellow; indigo; brick red) and yellow flowers in
// the hair.
var FINGER_DRESSES = {
  blue: {shirt: "#f4efe4", sabai: ["#5fb7e0", "#c9d4dc"], sin: 1},
  pink: {shirt: "#2e3a8a", sabai: ["#ec7fb3", "#f3c6dc"], sin: 0},
  cream: {shirt: "#c8243a", sabai: ["#f2e6c8", "#e0b23a"], sin: 2}
};

// One dancer at (x, y), the ground under her, dancing at the kit's second "clock". "dress" is one of
// FINGER_DRESSES' names; "more" is any of a person's look keys (size, face, id ...), over the dance's.
// "late" is seconds added to her clock, so a troupe is together but not one figure copied.
// Gives back where person() drew her joints.
//   x, y   where her feet stand, pixels of the sheet
//   dress  "blue", "pink" or "cream" (FINGER_DRESSES); anything else is "blue"
//   more   look keys over the dance's own (the pose, step, sit, sway): size, id, face ...; or nothing
//   late   seconds, 0 when left out; the dance goes round every 32 seconds
// Returns person()'s joints ({shoulderA, wristA, hip, kneeA, ...}, pixels of the film). She is the
// kit's "dancer" cast member, not a paperdoll: it needs only oldcartoon.js. A troupe needs an id each.
// e.g. fingerDancer(400, 900, "pink", {size: 1.2, id: "dancer-0-1"}, -0.05);
function fingerDancer(x, y, dress, more, late) {
  var t = clock + (late || 0);
  var pose = poseAt(t, FINGER_DANCE, 0.35);
  var steps = t / 1.0;                               // a step a second
  var dip = 0.07 * Math.pow(Math.sin(Math.PI * steps), 2);
  var look = cast("dancer", Object.assign({skirt: false, fan: false, tail: false, collar: null, flower: "#f4c542"},
                                          FINGER_DRESSES[dress] || FINGER_DRESSES.blue, pose,
                                          {step: steps / 2, stride: 0.45, sit: (pose.sit || 0) + dip,
                                           sway: 0.035 * Math.sin(Math.PI * steps)}, more || {}));
  return person(x, y, look);
}
