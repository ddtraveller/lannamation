# Dance: the fingernail dance and the hands of classical dance

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## The fingernail dance, read from a performance (2026-10-16)

The owner gave a video of fon lep (ฟ้อนเล็บ), some hundreds of dancers at the Three Kings Monument,
Chiang Mai, in 2015 (YouTube WGAjuI6bNhw, 55Secrets Travel): "Look at that video and see if you can
animate some finger dancers to move like that." `finger_dance.js` is the answer: the dance's poses as
numbers, the order they come in, and `fingerDancer(x, y, dress, more, late)`, the kit's own dancer
(`dance: true`, `nails: "long"`) dancing them; `finger_dance.html` is a troupe of fifteen dancing it.
The video is not in the repository, and nothing of it is copied.

**The machine could not read it.** `dance_track.py` read the classical dancer of `dance.html`; here
MediaPipe read the arms wrong, whatever was tried, on the steady shot from 18.9 to 51.9 s (a front row
in full figure, before the close-ups):

| Tried | What came back |
|---|---|
| `dance_track.py` (the full pose model), the frame with its left edge cut off | a dancer in 99% of the frames, but her wrists almost straight under her shoulders: the median of each wrist across from its shoulder 9 and -1 (kit units; arms held out as the video shows them would be 50 to 70), a hand at the shoulder at 3.2 s, a bow of 0.5 at 26 s. Its own check frames drew the arms down the body |
| the full model on one dancer, cut out and scaled up twice | the arms again inside the body, the shoulders far too narrow |
| the heavy model on that same cut | the arms right: out and down along the sleeves, a little short of the wrists |
| the heavy model following one dancer with a moving cut, 30 to 51.5 s | three seconds true (checked by eye: the wrists some 108 below the shoulders, 17 to 30 across, the body square to us, `turn` 0.92); then the camera zooms (about 33 s), the cut no longer fits her, and it slides onto the dancers of the second row, half hidden, whose arms it reads wrong |
| the heavy model on the whole frame, eight people asked for | two found; hers with one wrist above its shoulder where it is plainly below |

The silk sashes over white sleeves, the arms held out stiff, and rows behind in the same colours are
what defeat it. So the poses are read by eye from the video's frames, a half second apart through the
walk and every two and a half seconds through the close-ups (1:00 to 2:30), and set against a sheet of
the kit's dancer in each until they matched; the three true seconds are the check on the walk.

**The poses** (`FINGER_POSES`, the kit's look keys; arm A is on the picture's right):

| Pose | In the video | Numbers |
|---|---|---|
| `low` | the walk (0:19 to 0:33): arms low and out to the sides, the wrists bent back so the nails fan outward | hands (±62, 100); the wrists bent 0.9 each the other way (A -0.9, B +0.9: the same sign on both curled the left hand down); `twist` 0.8 |
| `highA`, `highB` | one arm curved up above the head, the wrist bent back, the other out at the shoulder with the hand up; the head toward the low hand (1:02 to 1:10, 1:27) | the high hand (±22, -106), the low (∓100, -14); `tilt` ∓0.15; `twist` 0.6 |
| `offer` | both arms forward at the chest, the hands up from the bent wrists, the body turned toward them (1:15 to 1:22) | (100, -22) and (80, 4); `twist` -0.3, the body nearly in profile. Both hands before the chest at `twist` 0.1 bunched there and read as nothing |
| `wings` | both arms spread wide at the shoulders, the hands up and back (1:35 to 1:42) | (±104, -16) |
| `sweep` | not a pose of its own: the way from the offering to the wings, the far arm down and round past the hip | (102, -18) and (-36, 72), a second after the offering |
| `peak` | both hands over the head, the nails meeting above it (2:15 to 2:27) | (∓8, -116), the arms straight up beside the face. The wrists crossing over the head's middle ((∓30, -110) or (∓22, -114)) brought the arms up across her face: the kit picks which way an elbow bends, and the video's elbows open out to the sides |

The kit's dancer gives every lifted hand the shape of Thai dance, the back of the hand toward us and
the long nails curving back, so the poses only place the wrists.

**The phrase** (`FINGER_DANCE`, for `poseAt(t, FINGER_DANCE, 0.35)`): the walk, the hands raised in
turn twice, the offering, the wings, the peak, a hand raised each side, and the walk again: a pose
every two seconds, each held a third of that and then moving to the next, 32 seconds round and round.
The first phrase went straight from the offering to the wings, and the whole check failed it with 11
arm flips: the far arm crossed from before the body to its own side, its wrist passed through its
shoulder (at (-10, -31) from it, at 15.33 s), where an arm has no clean bend, and every dancer's elbow
jumped across in one frame, 69 units. With `sweep` between them the arm goes down and round, and no
elbow of a dancer moves more than 22 units in a frame over the whole phrase (measured on one dancer,
every frame).
Under it the dance is a procession: a step a second (`step` = seconds / 2, `stride` 0.45), a dip at
each step (`sit` up 0.07 as `sin²` of the step), the chest swaying 0.035 with it, whatever the arms do.

**The dresses** (`FINGER_DRESSES`): `blue` a white blouse and a pale blue sabai, `pink` a navy blouse
and a pink one, `cream` a red blouse and a cream one, each with a pha sin and yellow flowers at the
bun, as in the video. The kit has three sins: indigo (`pink`), brick red (`cream`), and green and black
(`blue`, whose sin in the video is yellow and striped).

**The troupe** (`finger_dance.html`, 1920 wide, on the `yipeng` backdrop): three rows, a dress to a
row as the dancers there stood in blocks: six in cream at the back (size 0.82, y 865), five in pink
(0.95, 930), four in blue in front (1.1, 1005), set wide enough apart that the wings of one do not
cross the next (the first spacing, five in front at 1.2, tangled them), each a few hundredths of a
second from her neighbour (`late` -0.05 a row, -0.025 a place). It renders in 952 s for its 32 s on
the laptop: fifteen people at 1920.

**Not done.** The yellow striped sin of the video's front rows is not one of the kit's. The peak's
elbows do not open out round the head. The dancers walk in place; the video's advance, turn about, and
go round in lines. The fingers are not moved: the hand model found hands in too few frames of the
steady shot to read them, and the kit's dance hand stands for them.

## The hands of classical dance (2026-10-16)

The owner sent three pictures, the Thai wong and jeeb (an arm in four positions; a wong over a jeeb)
and the chart "The Meaning of Hands' Gestures in Khmer Dance" (CPA 2010), with "focus on these hand
positions", and chose: every dancer in the kit, and the Khmer gestures too. Nothing of the pictures
is copied; the forms are read from them as rules, and drawn by the kit's own hand in the round.

| What it is | In the code | Numbers |
|---|---|---|
| A finger bent back on its own | `hand()`'s `arch` may be four numbers, one a finger, the first to the little one (one number, as before, bends all four) | |
| The pinch | `hand()`'s `pinch` [finger, amount]: `pinchThumb()` brings the thumb's tip to the pad under the first finger's tip (0) or the middle one's (1): its two bones bend out at their joint, toward the thumb's side and the back of the hand, and its root comes forward, as a thumb's does to meet a finger. Without that a curled finger's tip, well in front of the palm, was out of the thumb's reach, and the thumb stood out straight beside it | the root 2 forward, 5 toward the palm at a full pinch; the thumb 13 + 9.1 long |
| Four forms | `HAND_FORMS`: **wong**, the four fingers together, straight, bent far back, the thumb in; **jeeb**, the first finger curled to meet the thumb, the other three fanned and bent back, the little one most; **fan**, all spread and bent back (the kit's dance hand before); **point**, the first finger out, the thumb to the middle one, the rest curled | wong `arch` 1, spread 0.03; jeeb index curl 0.85, `arch` [0, 0.8, 0.9, 1], spread 0.35 |
| Thirteen names | `GESTURES`: wong, jeeb, jeebDown, fan, point, and the chart's planting (the pointing hand turned down), growing (turned up), youngLeaves (the fan), leaves (the wong), flowering and ripeFruit (the jeeb turned up), fruit (the jeeb, its palm toward us), fallingFruit (the jeeb turned down). Each: a form, the wrist's bend back (above 0) or down, and the hand's turn: the thumb's edge (0.45), the side the forms read from, as in the pictures | wrist from -1 to 0.6 radians |
| A look asks for them | the look keys `gestureA` and `gestureB`: a name, or {from, to, u} for a hand on its way between two (`gestureOf()` mixes the curls, the spread, each finger's bend, the pinch, the wrist and the turn) | 87 look keys |
| Every dancer | `handPose()`: a lifted hand of a figure with `dance` that nothing else shapes (no fingers, grip, wai, or the near hand on a parasol) takes `danceHand()`: one hand in wong, the other in jeeb, changing over every eight seconds, each going from one to the other in the first 1.2 s (0.6 s at first: too quick beside the owner's reference). The two hands mirror each other, each bending back away from the head (the wrist's bend and the turn signed by the thumb's side: with one sign for both, one hand bent out and the other curled in over the head) | |
| Where it shows | the hero film's night dancer and the celestial (who now holds her lotus in a jeeb), the dancers woven into the opening's cloth, `dance.html`, `finger_dance.html`, `fonlep.html`, `apsara.html`, `lanna.html`, `village.html`, and any lady of the cast (whose look has `dance`) who lifts a hand | `finger_dance.html` 219 to 225 ms a frame, as before (196 to 248) |
| The sheet | `dance_hands.html`: the four forms large and a dancer changing over (0–5 s), then every name on a lady with both hands raised (5–10 s); `looks.html` shows `gestureA` and `gestureB` | |
| Turned down | the gestures turned down (jeebDown, planting, fallingFruit) do not bend the wrist toward the palm: a lowered hand's back faces in, so that turned one hand's fingers up; their hands point to the ground, a little out (0.35 from straight down), taking the shorter way round from where the arm puts them | |
| Bangles stay on the arm | `drawHand()` turns `bangles()` by the forearm's angle, from the elbow to the wrist, not by the hand's: with a wrist bent back or down the rings swung out with the hand (owner, 2026-10-16: "the gold bangles on her wrists should stay pinned to the arm"). Every figure wears one or two rings unless told, so every wrist moves a little | |
| Held steady | a hand in a form of dance has no bend of the wrist on the beat (`handPose()` takes `flex` back off its angle) and no little life in its fingers (`hand()`'s `pose.still`, which `roundPose()` sets for a form): with them the held hands shook (owner, 2026-10-16: "stop the hands from shaking") | in a held pose of a solo dancer, the hands' change from frame to frame 12.9 to 2.8 grey levels, its jerky part (the change of the change) 23.1 to 2.75 |
| The pace | the owner's reference, an 8 s short of a Lanna dancer at night in Chiang Mai (YouTube A9_m6vP4tZ0, read by eye at four frames a second; nothing of it is copied or kept): the hands keep their form through every move, the wrists bent back; an arm takes about 1 to 1.5 s to go from one place to the next, eased at both ends; between moves the arms are never quite still and the knees dip slowly; she ends in a wai held 2.5 s. A film moves its dancers' arms at that pace; the kit's own part is the steady hand and the slow change-over | |
