# Feelings, speech and thought bubbles, and eyes that watch

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## Eyes that watch, and who is where (2026-10-19)

The owner: "Have 4 eyes always look at the closest sprite to them. One other eye should look out at the screen or
scan slowly side to side suspiciously and one eye should just wander aimlessly. After 10 seconds the wandering eye
should switch to be a different eye as should the screenward looking eye. Give the eyes different emotions as
well." The creature has five eyes, as its name says, so (the owner chose): three watch the nearest one in the
frame, one stares out at the viewer for four seconds and then narrows and scans slowly from side to side, one
wanders; every ten seconds the staring and the wandering eye change to two others; three eyes, chosen once for the
creature (by its `id`), have its feeling and the other two a second (`eyeFeel`, or MAENG_EYE_FEEL's: wary beside
calm, wide beside happy). `maengEyes()` and `maengGaze()` in myth.js; `watch: false` puts them back as one.

**Who is where.** To watch the nearest, the kit has to know where everyone is in the frame: `SIGHTS` in
oldcartoon.js. While a film's frame is drawn, person() notes each face's middle and decorate() each of a scene's
life, in the sheet's pixels; `sightsNow()` gives a watcher the list. A watcher is often drawn before those it
watches (the creature in its pen, then the boy in front of it), so filmFrame() then draws the frame a second time,
the watcher seeing the whole list of the first: what it sees is the second's own, as everything in a frame is
(seek to any second and the eyes are where they were). Drawing a frame twice at one second moves nothing that
swings (follow() steps only when the clock moves). The kit check: 169 pages and scenes, none changed but the
creature's.

## Nine feelings (2026-10-18)

The owner: "Work on adding emotions for each of the sprites. Sad, happy, concerned, angry, sleepy,
satiated, neutral, surprised." Asked how, they chose people first (one face drawing serves the whole
cast, the band's players and the paperdolls) and the creatures after they have looked; the face and how
the body is carried, the hands left to the film; and a picker in the cartoon maker. The sheet is
`feelings.html`: each face close up with all of them, then a lady and a fellow whole. Then, the same
morning: "Add a laugh for each of the sprites, too": laughing is the ninth.

| Name | The numbers | What shows |
|---|---|---|
| neutral | none | the face at rest (a fellow's shut mouth still turns up a little: it is drawn so) |
| happy | smile 1, wonder 0.25; head up 0.04 | the kit's first `joy`, unchanged |
| laughing | laugh 1, smile 1; lean back 0.04, head up 0.08 | the eyes shut and bowed up (`eye()`'s `bowed`: a laugh pushes the cheeks up under them); the mouth open wide, 0.9 wide, and opening again on each "ha", 4.5 a second (a lady's is a D, its top nearly flat and lifted at the corners, its bottom deep; a fellow's was a D already); the head (0.05) and the shoulders (0.03) shake with it; in bursts of 2 s with a breath of 0.6 s, the "ha" at a third; the brows up 3; the cheeks pinker (+0.15, a fellow's +0.12) |
| sad | sad 1; lean 0.05, head down 0.12 | as before, and the lids come down at the outer corners (slant -0.7) |
| concerned | worry 1; lean 0.03, head down 0.06 | the brows up at their inner ends (0.38 to 0.4 rad) and 3 in toward the nose, with a fold between them; the lids 10% wider and down at the outer corners (slant -0.45, a fellow's -0.6); a lady's mouth pressed to 0.82 of its width and 0.75 of its height; a fellow's line wavers, up and then down by 4.5 |
| angry | anger 1; lean 0.1 forward | as before, with a straight lid down over the inner half of each eye (slant 0.9) and the fold between the brows |
| sleepy | sleepy 1; lean 0.04, head down 0.08 | the lids 0.55 shut and the brows up 2.5 against them; every 7 s the head sinks for 4 s (0.22 more) as the eyes close, and comes up in a quarter of a second with the eyes wide; every 11 s a yawn of 2.4 s: the mouth open tall and round, the eyes shut, the brows up 7.5, the head back 0.16. A yawn stops a nod |
| satiated | full 1, smile 0.8; lean back 0.07, head up 0.06 | the lids 0.62 shut over an easy smile, the cheeks pinker (blush 0.2 + 0.22 on a lady, 0.42 + 0.2 on a fellow); every 6 s the eyes close for 1.5 s and the head tips back 0.04 more |
| surprised | wonder 1, the mouth round 0.7; lean back 0.05 | the kit's first `surprise`, unchanged |

- **The first names still work.** `calm`, `joy`, `surprise` and `anger` are neutral, happy, surprised and
  angry (`FEELING_WAS`) with the same numbers; `fear` stays, a tenth.
- **The slanted lid** (`slant` in `eye()`, from -1 to 1; `slantedLid()` gives the part of the eye left open
  under it). Since 2026-10-14 the kit's men wear a head-cloth over the brows, and on the first sheet a
  fellow's angry and concerned faces had nothing to show them. A straight lid across the eye, low at the
  inner corner for anger and at the outer corner for sadness and worry, reads on any face, and is ready
  for the creatures' eyes. The eye is cut under it, and its line is inked twice as wide inside the eye,
  so the half that shows has the lid's weight. The fold of the lid above fades with the slant.
- **A time of their own.** The nod, the yawn and the savouring run on the clock plus `ownTime(who)`, a
  number from the person's `id`, or else from their place in the frame's drawing order, as `follow()`
  keys its springs: a crowd of sleepers do not nod as one. All of it is a function of the clock, so a
  still matches the film.
- **What changes on the pages.** With no feeling given, every number new here is 0, and a page draws as
  before. A face given anger or sadness now has the slanted lid, and anger the fold: `model.html`'s angry
  fellow, the anger and sad rows of `looks.html`. New look names: `sleepy`, `full`, `worry`, `laugh` (94 in all).
- **The rouge stays on the face.** The owner, on the sheet: "clean up the rouge that is outside the
  woman's face". A lady's two washes of pink are clipped to the face's outline (`V.skin`: the skull, and
  the profile piece toward profile). The far cheek's lies by the edge and spilled past it, the more so
  with a full face's stronger pink. Every lady's face changes so, on every page.
- **The maker.** `item.feel`, one of `FEELS`: a row of eight buttons (😐 เฉย ๆ, 😊 ดีใจ, 😢 เศร้า,
  😟 กังวล, 😠 โกรธ, 😪 ง่วง, 😌 อิ่ม, 😮 ประหลาดใจ) where the smile slider was. The owner then: "Add
  the emotions to the cartoon maker and the kids walk through ... set the emotion from a drop down in
  the resizer and then again at each point of movement". So a person's feeling is also a dropdown in
  the bar over a sprite just put in (`#barFeel`), and a point of a person's course may change it from
  there on: a key's sixth entry, `[second, x, y, pose or null, size or null, feeling]` (`feelsOf()`,
  `setKeyFeel()`; the film's code is then `feel: [...][p[7]]`, the feeling of the key reached). Each
  point's row has the dropdown on a second line beside the pose (a feeling of its own, or "〰 the
  same"), and so has the box that opens when a point is placed by a drag (at the first point it is the
  person's own feeling). In the 🧒 guide, each person's turn asks how they feel after where they start
  (a tap shows it on the picture), and, if they walk, how they feel when they get there. A dropdown
  holding the keys no longer lets Delete remove the sprite or the arrows nudge it. The film's JSON has
  `"feel"` and the keys' sixth entries, and the model's prompt lists the eight. A film kept with a smile loads as happy (a smile of 0.5
  or more) or neutral, and the kit's first names are read too (`feelOf()`). `film.py stills` and `render`
  draw with the kit on krueng.ai, so they show the feelings once the site has this kit.
- **Tried first.** Concerned as sad 0.7 and fear 0.5 together: on the lady, at film size, it read as
  neutral. The first sheet had all eight across and four people down at size 1.5: the faces were too
  small to judge.
- **Not done.** The creatures (the next round). Hands for a feeling (the owner chose the face and the
  posture). `paperdoll.js` reads a feeling's lean without the person's own time, so a sleepy doll's skirt
  follows the nod on the clock alone.

## The pond's feelings, and the assistant's voice (2026-10-18)

The owner: "redo the hero video for lanna_cartoon? In the pond scene the man should look surprised when
the dragon appears and then angry when it shows a Chinese flag for a moment and then go back to being
happy. The woman should laugh when the flag comes out and put her hands in her lap. Also, use the new
assistant voice." Asked which voice, they chose the Kam Mueang assistant's: the same MMS model, as the
assistant speaks it, with the assistant's spelling rules.

| What | How |
|---|---|
| The fellow | `feel` by the scene's seconds (`POND_SEEN`, `POND_FLAG`, `POND_CALM` in `sash.html`): happy, then surprised from 7.4 (the dragon's head comes into the picture at 7.2, by `DRAGON_COURSE`), angry from `FLAG[0] + 0.2` (the flag out of the claw), happy again from `FLAG[1] + 0.3`; his eyes on the dragon from the first to the last |
| The woman | her wonder at the dragon as before, then laughing from `FLAG[0] + 0.2` to `FLAG[1] + 0.6`, and happy after; from the flag on her hands lie in her lap, in place of the wai: the kit's own hands for one who sits (no handA or handB given), turned in toward each other. At first they were placed (`POND_LAP`: handA [-20, 100], handB [60, 96]), which crossed the arms and laid the far arm over the cloth; the owner, the same day: "the woman crosses her arms but she should look like she is sitting naturally and her left arm should be below the sash". The far arm (A, the one toward where she faces) is her left, the sabai's shoulder: with its hand on its own side (`handA[0] > -10`) it goes behind the chest and the cloth (behindA) and only its hand shows. Picked from four drawn side by side |
| The voice | `sash_narrate.py --voice assistant`: MMS Northern Thai in PyTorch (transformers' `VitsModel`, `facebook/mms-tts-nod`, its own settings) as the assistant's `speak()` runs it, a line in pieces of up to 150 letters with a quarter of a second between them. The assistant also put one after the last piece; in the film that made each line 0.25 s longer for nothing, so the film's lines have none (the takes already made were trimmed of it) |
| The words | the assistant's spelling rules (its speaker's corrections, kept with the assistant, not here) changed five lines, said and written: บ้าน → เฮือน (23.0 s), บ่ → บะ (28.3 and 44.7 s), และ → ละก่อ (31.0 and 37.4 s). Still unchecked by a native speaker |
| The takes | four of each line, the clearest kept (heard back 0.62 to 0.96 of their letters). With the new voice four lines ran past their words or into the next line (by up to 0.23 s), and the pond scene leaves no room to move them (its last line must end before the cut at 50 s); `--fit` keeps the clearest take that ends in its room, and speaks as many takes again when none does: all 18 lines fit (line 9 needed eight takes) |

## Feelings on the creatures (2026-10-18)

The owner: "start the creatures", after the people's nine feelings. The first round is the six a child
can put in the cartoon maker: the dog, the rooster, the Naga, the dragon (both kinds), the Mom and the
Luang. Each takes `feel` (and the same numbers) in its look, as a person does; with none, it draws as it
did before. The sheet is `creatures.html`: each creature a part, its nine feelings close up, the big ones
placed by where their own drawing puts the eye. The second round ("begin") is the rest of the kit's
creatures with a face: the beasts, the birds of the north, the Hatsadiling and the sun's 1930s face.
The sheet now has 19 parts, 12 seconds each (228 s).

| The kit's part | What it does |
|---|---|
| `creatureFeel(look, at)` | the person's numbers (`feelingOf()`, over time at the creature's own time) as what any face and body can show: `lid`, `bowed`, `slant`, `wide`, `brow` [lift, turn], `open`, `grin`, `raise` (the head high or low), `ears`, `wag`, `tail`, `shake` (each "ha"), `nod`, `startle`, and `jaw(usual)`: a jaw shut for sadness, worry, fullness and sleep, a snarl in anger, the feeling's own opening for a laugh, a yawn or a fright, and as it was otherwise |
| `creatureEye(x, y, rx, ry, e, how)` | a creature's eye looking along +x: the white, an iris toward the front (and a pupil), or a 1930s pie eye; a lid in the colour of the skin, down by `lid`, low at the front in anger and at the back in sadness; shut, a line bowed down, and laughing, bowed up. `how.ball`: an eye that is all one colour (a bird's, a cat's, a pig's), with a round pupil, or with `how.slit` a cat's slit, and a light |

| Creature | Where the feeling shows |
|---|---|
| dog | `dog(x, y, t, how)`, `how.feel`: the pie eye under its lid, a brow, the smile turned to a frown or opened (a tongue in a laugh), the head carried high or low and nodding, the ear up or back, the tail wagging harder or drooping, a laugh's bounce |
| rooster | surprise is its own fright (`alarm`), sleep and fullness its crouch (`sink`); its head sinks when sad, its tail rises or drops, its beak gapes on each "ha" or in a yawn; a brow over the dot of its eye; a lid when it is sleepy, full or laughing; only a happy, a neutral or an angry rooster crows |
| Naga | each head: its eye and its brow, its jaw, and how high it is held (one head a moment after another) |
| dragon, both kinds | the eye (its yellow iris and dark middle), the bushy brow lock raised or turned (its root down in anger), the jaw, the head lifted or hung |
| Mom | the great eye, its lid the gold of its ring; the heavy gold brow; the jaw; the head |
| Luang | the eye under its gold brow, the brow, the jaw, the head |
| elephant, side and front (`beasts.js`) | `elephantEye(ink, shut, e, skin)`: the eye under a lid of its hide, the fold of the brow raised or turned with the brow, the folds under the eye; the trunk raised in wonder and gladness (unless the look sets `trunk`), and the mouth open under it; the head lifted or hung; the ears flare in anger, lie close in sadness and flap faster with a wag; the tail swings harder |
| water buffalo, side and front | the eye (both eyes, each looking toward the middle, from the front); the ear down when it is sad, up in wonder; the head's nod; the tail swings faster and wider with a wag |
| Siamese cat, tiger | `felineHead(kind, open, c, m, seed, e)`: the almond eye in its own colour under a lid of the face's colour (the cat's pupil a slit, the tiger's round); the ears laid back in anger, fear and sadness or pricked; the tiger's heavy brow raised or turned; the corner of the mouth up in a smile, down in a frown; the jaw; the head; the tail up when glad, down when sad, lashing in anger |
| pig | the small dark eye under its lid, and a brow over it raised or turned (its front end down in anger, up in worry); the corner of the mouth up in a smile, down in a frown; the ears flop down when it is sad; the tail wags harder; the head and the jaw; the cheek pinker when it is full or laughing. The owner: "Make sure to include the pig". Its first round had no brow and no corner, and happy and concerned looked neutral. The brow sits close over the eye (12 units above its middle): 21 units up it lay on the edge of the forehead and could not be seen |
| peafowl, pheasant (`northbirds.js`) | the eye (`nbEye()`: the dot it always was, or with a feeling a small eye under a lid of the head's colour); the head and neck carried high or low; the peafowl's bill opens in a laugh, a yawn or a fright |
| sunbird, magpie, hornbill | the eye only. A bird's eye is a few pixels at a film's size: on these three a feeling shows on the sheet, close up, and hardly in a film |
| Hatsadiling (`myth.js`) | the elephant's eye and brow; its trunk raised in wonder and gladness; its head lifted or hung, shaking a little in a laugh |
| the creature with four ears and five eyes (`myth.js`) | all five eyes under lids of its fur (the middle one takes the mean of the two corners), wide or shut and bowed up; the four ears laid back low and flat; the grin narrowed and its corners dropped, or the jaw dropped; the head lifted or hung; the tail wags |
| sun, `sun(x, y, t, how)` with `STYLE.sun = "face"` | `how.feel`: its pie eyes, each looking toward the middle, under lids of its gold; a brow over each; the smile turned (as wide as it is glad) or a frown, or opened in a laugh, a yawn or a fright. The flame sun (`"flames"`, the kit's own) has no face and takes no feeling |

- **The maker.** Its six creatures have the feeling buttons in their panel, the dropdown in the bar over a
  new one, a feeling at any point of a course (a key's sixth entry; the dragon's depth stays its fourth),
  and the box that opens at a new point. The model's prompt says which things take `"feel"`. In the
  second round the ox cart joined them: the feeling is its buffalo's.
- **A name used twice.** The peafowl already had an `e`: how far its train is raised, eased
  (`d * d * (3 - 2 * d)`). A second `var e` for its feeling took that number, so with the train up its bill
  was drawn at `NaN` and did not show (a canvas skips a point that is not a number), and nothing said
  so. The HEAD-against-new pixel comparison found it: 97 pixels in 3 frames of 6 on `northbirds.html`.
  The peafowl's feeling is `mood`.
- **Not done.** The yak (a painted set piece with no face to move); bubbles over creatures. In the
  maker: the beasts and the birds are not in its palette (the ox cart's buffalo is the one beast there),
  the Hatsadiling is kept out of it, and its sun is the flame sun, so none of them has the picker.

## Speech and thought bubbles (2026-10-18)

The owner: "Add a way in the maker to add text that the character will see in a speech or thought
bubble and a way to add subtitles as well. Make sure the kids walk through includes help with this
too." The kit had title cards and subtitles, and nothing over a head. `bubble(at, words, how)` is drawn
in the scene after everyone, so the camera and the lens take it as they take the people. The sheet is
`bubbles.html`.

| What | The rule | In the code |
|---|---|---|
| A speech bubble | a box of paper (#fffaf0) with round corners (34, or half its height), the kit's ink round it; a tail from its foot, over the head, curving down to a point a third of a head over the crown | `body.roundRect`, `tail` |
| A thought bubble | the same box with puffs all round it (one every 1.5 puffs of its edge, every other one 0.8 the size), and three puffs (13, 9, 6) from its foot down to the head; it stands 20 higher | `think`, `many` |
| One outline | every shape inked twice as wide (2.6 lines), then all of them filled: only the outer half of the ink shows, so the tail and the puffs join the box with no line between | `parts` |
| The words | Thai bold 40 (Leelawadee UI, Noto Sans Thai), English italic 26 under it; lines no wider than 420, broken between words: Thai has no spaces, so the browser's word segmenter (`Intl.Segmenter("th")`) finds them | `bubbleLines()` |
| Where | leaning the way the person faces, its foot 50 over the tip; inside what the camera shows (the canvas's corners taken back through the pen's transform), 16 from its edge | `view0`, `view1` |
| It does not hop | the box keeps over where the person stands (`joints.stand`) and at the height of their head with the hop taken out (`joints.rest`: in the figure's own frame, the hips' dip and the head sunk into the shoulders taken off, and none of the lift or the squash); only the tail follows the head. Over a beat of a hopping lady the crown moves 116 pixels and the rest point 1 | `joints.rest` in `person()` |
| It pops in | over a fifth of a second, from 0.55 of its size, a little past, from the head | `how.age` |

- **The first box rocked** with the lady from side to side, 62 pixels in 0.4 s, and dropped 90 with
  each hop. Keeping its height to the head in steps of half a head made it jump instead. The first
  `joints.rest` put the dip back the wrong way (a dip is downward in the figure's frame): the rest point
  moved 81 pixels over a beat; with the sign mended, 1.
- **The maker.** Texts of two more kinds, `say` and `think`, each with `who`, the id of its person:
  💬 คำพูด and 💭 ความคิด beside 🎞️ the card and 🔤 the subtitle (which was 💬 before); 💬 พูด / 💭 คิด in a
  person's own panel make one for them from the second being looked at; a bubble's panel picks its
  person and turns it from said to thought. In the film's code each person who speaks in a scene keeps
  what `person()` gave back (`heads[n]`), and the bubbles are drawn after everyone. A person taken away
  takes their bubbles. In the JSON, `"who"` is the person's place in `items` (or their name); a film
  this page saved keeps its ids, and they are read first. In the 🧒 guide, each person's turn asks if
  they say or think something, and how it shows: 💬 a speech bubble, 💭 a thought bubble, or 🔤 words
  under the picture, with a line for a child on what each one is.
- **Not done.** Bubbles for the creatures (they have no joints to point at yet; an `[x, y]` works
  meanwhile); two bubbles at once can overlap: the kit does not move one out of another's way.

## Feelings eased (2026-10-23)

The owner, watching the hero film: "Add facial expression easing to the kit so when a sprite changes facial
expressions it doesn't instantly pop from one expression to the next. If you look at the man looking at the Chinese
dragon in the hero video his angry face pops to happy instantly." His `feel` changed by the scene's seconds, and the
face read the new name in the next frame.

| What | How |
|---|---|
| Kept from frame to frame | `easedFeeling(key, f)` in `oldcartoon.js`: each face's numbers (`FEEL_NUMBERS`: wonder, smile, fear, anger, sad, sleepy, full, worry, laugh, and the body's bend and tilt, and the mouth a feeling opens) under a key, in `FEEL_KEPT` |
| When it eases | when what the look asks for jumps: a number by more than `FEEL_JUMP` (0.12) in one frame, as a new name does. Then the face goes from where it is to the new numbers over `FEEL_EASE` (0.4 s), eased in and out (`between()`); a change in the middle of one starts from where the face has got to. A number a scene moves smoothly (the pond woman's wonder, rising with the dragon) is followed as it moves, so no film's slow change lags |
| Whose | every person (`person()` passes its id, or "n" and its place in the frame's drawing order, the name `follow()` already keys by), and every creature (`creatureFeel(look, at, key)`: "c/" and its id, or the n-th creature whose feeling is asked in the frame). The creature with five eyes keeps its second feeling (`maengEyes()`) under a key of its own. `feelingOf(look, at)` with no key, as `paperdoll.js` calls it, shows the new feeling at once, as before |
| Stills match the film | as `follow()`'s springs: a key whose clock runs backward or skips more than a quarter of a second starts at the new feeling, and `forget()` clears `FEEL_KEPT`; `settled()` paints two seconds before a jump, longer than the ease, so a still in the middle of a change shows what the film shows (checked: frames of the pond, seeked one by one, step from angry to happy over 0.4 s) |
| What still switches | the shapes a face picks by a threshold: a lady's shut mouth is a smile above `smile` 0.5 and a bow below, and a laugh's bowed eyes and D mouth come at `laugh` 0.5; these switch at the middle of the ease, while the brows, the lids, the fold, a fellow's mouth (`grin`), the lean and the tilt glide |
