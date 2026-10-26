# The films: putting a tale together, its titles and its credits

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## A new tale, from start to finish (2026-10-23)

The owner, 2026-10-23: "Write down the template of how to do all this for future cartoons." The order the second
tale, Chang Ngu (`changngu/`), is made in, from the first, Maeng (`maeng/`); the sections below say how each
step went the first time. Each step ends in something the owner looks at, and nothing goes live without the owner's word.

1. **Choose the tale, and check it.** Gather the tellings (a NotebookLM notebook of picked sources works: journals,
   museums, universities, the old chronicles; Wikipedia last and never alone), have the tales summarised, and let the
   owner pick. Then read the tale itself in its sources, the oldest first: a summary gets names, numbers and who does
   what wrong. Where tellings differ, the owner decides the rule (for Chang Ngu: "historical accuracy as much as
   possible", so the chronicle wins). Ask early what to leave out for children (a death, blood) and keep the respect
   rule: a temple may stand in a film, a monk or novice is kit only, never in the maker.
2. **The plan, one file.** `<film>/story.py` holds every scene (title, seconds, what we see, the kit it has, what
   it needs new) and every line (English, Central Thai, Kam Mueang); `python tale_plan.py <film>` writes the plan page
   (`plan.html`), the words (`words.js`, `<FILM>_WORDS[id]`) and the Central Thai for a writer (`central.txt`); its
   `SCENERY` names how each scene's place is painted (step 6b), and the plan shows a scene without it red. The
   length: the whole film the owner asks for, less the hero film (97.75 s), the studio's card (12 s) and the
   credits; Maeng told about 0.12 lines a second (79 lines in 626 s), scenes of 25 to 55 s. Questions the sources
   leave open go to the owner before anything is drawn, all at once.
3. **The words.** The Central Thai first, plain and short; the Kam Mueang drafted in a native speaker's spellings
   (her rules run over it should change nothing), checked against the voice project's lexicon and set beside a Kam
   Mueang writer's version of the same lines, whose Northern words are taken and whose mistakes are not (it turned the
   Khom king into a monk and an elephant into a cow). Names said the Northern way go in `SAY_AS` (ช้าง is said จ๊าง),
   so the subtitle keeps the spelling and the voice the sound. No ๆ in the Kam Mueang: write the word twice. A
   native speaker's ear before the voice reads them (`ASK` lists the words that most need it).
4. **The voice, then the seconds.** One WAV a line, several takes each; keep the take in the speaker's own pitch,
   heard back best by the listener, trimmed to its first and last sound (see "Putting a tale together", below). Then
   time each scene to its lines (`SNN_LINES`, [from, to, id] in the scene's own seconds) with 0.6 s between lines,
   measured on the voiced part, never sped up; a scene's length is its lines and the action between them.
5. **New pieces, candidates first.** For each thing the plan marks new: two or three candidates drawn beside a
   reference, one sheet for many items, the owner picks; then into the kit with its demo page and a note in
   `docs/kit`, and `kit_check.py`. What only one film needs (its sets, its cast's looks) goes in `<film>/sets.js`.
6. **Each scene alone** (`<film>/sNN_name.js`, `sNN.html`; owner, 2026-10-19: "make them separately and then wire
   them together at the end"): on its own clock from 0, drawn by its z plan (`drawByZ`), looked at in stills
   (`stills.py`) and checked (`checks/kit_check.py`, `pop_check.py`, `arms_check.py`; render.py's blink check), shown to
   the owner as stills. Scene cuts fade through black.
6b. **Paint the scenery** (owner, 2026-10-26: "Make sure new videos will be generated with this process!"), as the
   hero film's places were: `docs/kit/places.md`, "Painting the scenery", with `scenery.js`. Scene by scene with the
   owner (stills of the scene, a short plan, the owner's yes, stills again); far mountains of the film's own
   (`farRange()`), painted trees in flower, beds of flowering bushes behind the people, the picture framed by soft
   blossom, water as the pine lake's, a sky of its hour (a sunset, a sunrise, the sun, the moon and fine stars), the
   light on things (lamps, gold, the grain of wood), and the air (light, petals, one butterfly at most; fireflies at
   night) as the line's feeling allows. A set shared by many
   scenes is painted once, in `<film>/sets.js`. Stills, then a quick clip of the scene with its narration for the owner.
7. **Wire, sound, render, join**, as "Putting a tale together" below: `film.html` lays the scenes end to end; each
   line's feeling makes the music and the scenes' life calls their sounds; the voice is laid over the music
   (`sash_narrate.py --spoken`); the scenes render on two machines (`scenes.py`, `render_back.py`) from one clean
   copy of the kit at one commit; `chain.py` joins the hero film, the card (`--fade 1,0.75`) and the tale. The
   finished film is checked for its length and its sound (-14 LUFS, peaks under -1 dB) and opened for the owner.

## The studio's card, and the tale's titles (2026-10-19)

The films open on the hero film, then the card of Slow Life Studios, then the tale (the owner). `sls_intro.html`
is the card, 12 s: an evening by a river in the north, a house on its stilts with its lamp lit, a mountain with mist
in its folds, fireflies rising and blinking over the water (`fireflies()`, drawn from the second alone), and the
studio's name coming up in gold in the Lanna script: ᩁᩰᩫ᩠ᨦᨿᩉ᩠ᨶᩢᨦᨩᩦᩅᩥ᩠ᨲᨧ᩶ᩣ᩻, โรงยะหนังชีวิตจ้า ๆ (a house that makes films of a
slow life: the north's ยะ for "make" and จ้า for "slow"; the owner chose this, the more Kam Mueang of two
wordings), with its Thai letters and its English under it. A studio card
of another studio was its only reference, for its calm: nothing of it is taken. The tale's own titles are over
its first seconds, in the fog: the series, Lanna Tales (นิทานล้านนา: ᨶᩥᨴᩤ᩠ᨶᩃ᩶ᩣ᩠ᨶᨶᩣ), in the Lanna script alone, then the
tale, ᨾᩯ᩠ᨦᩈᩦ᩵ᩉᩪᩉ᩶ᩣᨲᩣ, with its English small under it. Every Lanna spelling was written by the Kam Mueang alphabet's
own rules (krueng.ai's alphabet page, `lanna()`), in Noto Sans Tai Tham, and none is yet checked by a native speaker.

## Putting a tale together: its voice, its sound and its scenes (2026-10-19)

The owner: "Please use Pan's voice for the narrator", and "I'd like the new complete video to go on the
lanna_cartoon page": the hero film, then the studio's card, then the tale. How the film of the creature with four
ears and five eyes was put together, in order, each step a tool anyone can run again:

1. **Each scene alone** (`maeng/sNN_*.js` and `sNN.html`), its lines in `SNN_LINES` ([from, to, id] in the scene's
   own seconds). The fourteenth is the goodbye: Bua-kham, who tells the kit's tales, says what the tale teaches
   and waves to the children, the same raise and wave as lanna_cartoon's goodbye after the film.
2. **The voice first, then the lines' seconds fitted to it.** The narration was spoken by a voice made from a
   speaker of Kam Mueang (her toolset's voice service, one WAV a line), and each line measured against the room
   before the next line. Measure the voiced part, not the file: each WAV ends in about 0.4 s of silence, and five
   of eleven lines that seemed too long were not. Where a line was too long, the next lines were moved later into
   the slack a scene had further on, and what the picture does on those lines moved with them (what is held out,
   when the ember flies, when someone laughs or a mouth moves). A line is never sped up.
3. **Heard back before it is used.** Every line went through the voice project's listener (Whisper, fine-tuned on
   Kam Mueang): the share of its letters heard back, median 0.89. The five lowest were spoken three times more
   and the clearest take that still fits its room kept (one line went from 0.46, garbled, to 0.95); a take that
   does not fit is not used, however clear. What is left low is mostly the listener's spelling (tone marks,
   spaces), which a native speaker's ear should still check.
4. **The film page** (`maeng/film.html`) lays the scenes end to end from their `SNN_LONG`, and lists WORDS as the
   hero film does ([from, to, said, written, English, id], in the film's seconds). Its bar of scene buttons is for
   watching; it hides itself when render.py renders, which photographs the whole page.
5. **The music**: `maeng/feelings.py` (every scene's, from its lines' feelings), then `feelings.py --film` joins
   them with a 50 ms fade at each join and lays in the sounds the scenes' life calls (decorate.js `calls`): the
   tokay at night, the creature's howl from its cave, its roar in the snare, its joy at the first ember, its fear
   in the crowd and its howl going home. `checks/score_check.py` then hears every line's music.
6. **The voice over the music**: `sash_narrate.py --page maeng/film.html --music out/maeng_music/film.wav
   --spoken <folder>`, the hero film's own narrator (the voice's treatment, the music lowered under each line,
   -14 LUFS): `--spoken` takes lines spoken elsewhere, `ID.wav` for each line's id.
7. **The pictures, on two machines**: `scenes.py maeng/film.html <film>` renders from the first scene on;
   `maeng/render_back.py maeng/film.html 14 13 ...` renders from the last back on a copy of the kit elsewhere
   (the Spark, its GPU). scenes.py leaves alone a scene whose clip is there, so each machine's finished clips are
   copied to the other (a clip copied under another name first, then renamed: never half a file). Clips from
   both machines join without encoding again: the same encoder settings make the same stream.
8. **The films one after another**: `chain.py <out> lanna_sash.mp4 sls_intro.mp4 <tale>+<tale's sound>` encodes
   them again once, as render.py does (films made at different times are encoded differently, and a video joined
   from them without encoding can stop where they meet), and says where each starts: the page needs the card's
   seconds for its fireflies. `--fade 1,0.75` fades through black where the hero film meets the studio's card
   (owner, 2026-10-20: "fade out and back in over a second or two"): the fades are cut from the two films' own
   ends, so nothing after the join moves.
   The studio's card has the night's sounds over its music (owner, 2026-10-20: "Add the crickets noise to the SLS
   scene and at the end 2 tokay sounds"): `sls_sound.py music.wav sls_intro.mp4 out.mp4` lays the kit's crickets
   under it and the tokay's first two calls at its end, the music lowered under them; the picture is copied as it is.

## Nothing blinks out (2026-10-22)

The owner, 2026-10-22: "Everything should either continue off the edge, fade and shrink away, be part of a scene that
is going to black or fade out. Sprites shouldn't just blink off the canvas." The kit's `vanished(from, to)`
(oldcartoon.js, after `film()`) draws a film's frames one after another, as a render does but keeping no pictures,
and notes where on the film each person (`person()`), each of a scene's life (`decorate.js`) and each of `drawByZ()`'s
sprites that gives an x is. What is drawn in one frame and not in the next is let go when, in the frame it was last
drawn:

- most of it (`VANISH.edge`, 0.8) was already off the film: it walked off the edge;
- it was drawn faint (`pen.globalAlpha` at most `VANISH.faint`, 0.15): it faded;
- it had shrunk to `VANISH.small` (0.03) of the most it covered: it went into the distance;
- it is a kind that dives (`VANISH.dives`, `["fish"]`): decorate.js's fish going back into the water at the end of a
  leap, its ring on the water where it went in (owner, 2026-10-27: "Add that kind of fish as an exception to the blink
  check");
- where it was, the film is nearly black in either frame (`VANISH.dark`): a cut's fade, a fade to black;
- where it was, the two frames hardly differ (`VANISH.still`): it was hidden, behind a sheet or a door.

Anything else blinked out, and is told with the first second it did, where, and how many times more. A thing is known
from frame to frame by its name: the sprite's, else the person's id, else its kind; among those of one name, by the
nearest. It wraps `person()`, `drawByZ()`, `filmFrameOnce()` and `LIFE_KINDS` while it draws and puts them back.

- **`render.py` looks first.** Before its first picture it runs `vanished()` over the part it renders and prints each
  as "warning: ... blinked out at ...", and again at the end; the video is made all the same, so stop it and mend the scene.
  The look takes a fraction of the render: a frame drawn, not photographed and encoded (the hero film's 85 s in about
  6 minutes on the laptop, the village's 36 s in 1). `--no-vanish` leaves it out. `film.py render` and `scenes.py`
  render through it, so the maker's films are looked at too.
- **`checks/vanish_check.py PAGE`** runs the same look with no render; `--from`, `--to` for a part. Exit code 1 when
  something blinked out. Not in `kit_check.py`.
- **What it found first** (2026-10-22): the house mouse of s04 at 16.0 s and once more, as it went into the gap by the
  door post (owner: "a disappearing mouse"); in `bubbles.html` the girl at 6 s, when the others start to walk; in
  `lanna.html` the lane's games, which change at 20, 23 and 29 s with no fade. A planted one (a figure no longer drawn
  at 3 s, beside one walking off the edge, one fading and one shrinking) is told alone, at 3.00 s.
- **What it cannot see**: something painted straight onto the sheet, not by `person()`, a scene's life or a sprite
  with an x; and a sprite whose `draw()` sometimes paints nothing (`if (t > 3.5) { birds(...); }`): it is still drawn.
  A sprite of its own (no person or animal in it) is taken to stand in a box 160 wide and 160 high above its feet.

## Nothing pops (2026-10-22)

Of the kit's research into 2D animation (NotebookLM, 2026-10-22): Spine, Rive and Unity ease from one pose to the next
over a mix time, where a scene that sets a look at a second ("t < 5 ? one : other") changes it in one frame, and an
arm or a leg jumps. The owner: "I don't need things to be identical, I want to improve."

- **`popped(from, to)`** (oldcartoon.js, beside `vanished()`) draws the film as `vanished()` does and measures each
  person's elbows, hands, knees, ankles and crown from their hip, in lengths of their own torso, so that walking and a
  camera's push do not count. A joint that moves `POP.jump` (0.35) of a torso or more in one frame, and at least
  `POP.sudden` (2) times as far as it moved the frame before, popped: a quick move that is eased goes fast for a few
  frames together and is not told. A turn to face the other way and a fade to black are let go. `filmWatch()` draws
  the frames once for any number of watchers (`blinkWatch()`, `hearWatch()`, `popWatch()`); `lookOver()` is the three
  together, and `render.py` runs it before its first picture and prints "... popped at ...".
- **`checks/pop_check.py PAGE`** runs it with no render; `--from`, `--to`. Exit code 1 when someone popped. Not in
  `kit_check.py`.
- **The mends**, in the kit:
  - `poseSteps(t, steps, mix)`: a look that changes at given seconds, each change eased over `mix` (0.25 s). Where a
    scene wrote `t < 1.6 ? a : b`, it writes `poseSteps(t, [[0, a], [1.6, b]])`.
  - `poseBlend(a, b, u)`: the look between two (what `poseAt()` and `poseSteps()` use); a hand one of them leaves unset
    comes from or goes to where it hangs (`handRest()`), so letting a hand go is not a jump.
  - `handSwing(key, from, to, u)`: a hand goes in a straight line unless that line passes within `HAND_ARC` (45) of
    its shoulder; then it swings round the shoulder on the arm's own side, as an arm can. `poseBlend()` moves hands by it.
  - `trackAt(t, keys, soft)`: a track read from a video (`TRACK`, ten keys a second) played as one movement, each
    number the average of the keys near t; `poseAt()` stopped and started the dancer at every key. A hand the video
    sees pass through its shoulder goes round it on the side it passed (`trackBulges()`); a hand held at its shoulder
    takes its way from a longer while, as the video's way for it wanders; across a gap in the keys (the video lost
    her) the look goes from the key before to the key after, eased.
  - `poseBlend()` lets a raised foot (`raise`) come up from the ground and go down to it, as it does a hand.
  - A reach (`reachA`, `reachB`, a point of the scene) takes a third number, 0 to 1: how far the wrist goes from
    where it would be toward the point, by an arc (`handSwing()`). `poseBlend()` and `poseSteps()` ease a reach in
    and out by it, so `poseSteps(t, [[0, {}], [30.5, {reachA: [x, y]}], [34, {}]])` is a hand that goes out to a
    point and comes back.
  - `softReach()`: an arm coming to its full reach slows into it (Spine's IK softness) instead of snapping straight.
  - In `armJoints()`, a forearm from an upper arm held at the end of its arc (`SHOULDER`), reaching across the body
    to a wrist nearer than its length, is drawn shorter, pointing toward us (`FOREARM_SHORT`, 0.4 of it at least), so
    the wrist comes to its place by either elbow and does not jump as the elbow goes from one way to the other.
- **What it found** (2026-10-22, and after): `village.html` 8 people popping, now none (the three throwing their arms
  up as the medicine is ready, the herb doctor's far hand through his shoulder, the night's dancers losing their lift
  when their hands were copied for the wai); `lanna.html` 38 pops, now none; `dance.html` 72, now 2. Those two are one
  step of the track, at 76.7 s: her hand B goes from out at her side to across her body in one key (0.11 s), and her
  hand A jumps as far at the same moment, which looks like the video losing her hands. The Maeng scenes s11 (the king
  at 5.00 s, the lad at 30.53 s, their reaches switched at a second) and s13 (the crowd pointing as they arrive) popped
  as well: now none, by `poseSteps()` and a reach's third number.
- **The films that ship** (the sweep of 2026-10-22, on the Spark): the hero film (`sash.html`) had four wais switched
  on at a second (the woman at 20.00 s, the weaver at 28.30, the child at 29.23, the maiden at the pond at 40.50):
  `wai` now takes a number, 0 to 1, how far the hands have come, each by an arc (`handSwing()`) from where it would be
  (a seated one's from her lap), its shape turning to the wai's as it comes, so `wai: between(t, 20, 20.4)` brings
  one in. In the tale, s03 (the lad's stoop to the wood), s04 (the father's and the son's hands meeting), s05 (the
  crouch at the snare), s06 (the vine tied), s07 (the grass, the banana and the fire stick held out), s08 (the gold
  held up) s10 (the lad's hand to the heap, the trader getting up at dawn) and s14 (Buakham's goodbye wai, now the kit's wai by how far it has come)
  were switched at a second: now eased by `poseSteps()`, a reach's third number or `between()`. s01, s09, s12 and s15 had none. Left: in s03 the lad's elbow swings across in one frame as he lifts the
  bundle to his shoulder (23.73 s; arms_check; it was there before).
- **Pops eased by the model (2026-10-23).** The owner: "Is there some easing code you could write into the model to
  prevent pops? ... don't inhibit spontaneous movement but see if there is similarity in the kinds of pops you're
  finding." Chang Ngu's render found 10 more, and with Maeng's they are two kinds. (1) A pose key that is a function of
  the second with a step in it (a reach or a wai on only within a while, a hand switched from one place to another at
  a second): `poseEased(t, lookAt, mix)` takes the look as that function, reads it at the frames around t, and eases
  only a key that stepped (far in one frame, and twice as far as both the frame before and the frame after went), from
  where it had got to; every other key comes as given. A fast smooth whirl came back unchanged on 600 of 600 frames, a
  walk's step is never touched, and it reads nothing but t (a still and a render agree). (2) A lift eased in time still
  raced where `liftJoints()` brings the elbow forward (an eighth of its u): `poseBlend()` now moves a lift by how far
  along the arm's way it is (`liftShare()`, `liftEven()`), so every eased lift goes at an even pace and takes longer the
  further it goes (`POSE_LIFT_MIX`, 0.8 s for a whole one); a lift held still is where it always was. A word key
  (`floor: "astride"`) cannot be blended: Chang Ngu s23 hides Phrom's change behind the elephant.
- **What it cannot see**: a person not drawn by `person()`; a pop smaller than a third of a torso (a hand's curl, a
  face).

## The credits (2026-10-19)

`maeng/s15_credits.js`, after the goodbye: Doi Khao Khwai at night under its stars, the credits rolling up over
it at 90 pixels a second, then the studio's name held with the kit's address under it, then the thanks. The owner
asked for each part:

- **Who made it.** Animation: lannamation, https://github.com/ddtraveller/lannamation, and Claude AI. The voice of
  the tale: อมรรัตน์ ใจจา · Amornrat Jaijar (2026-10-20; "Panda" stood in until she sent her name), thanked by name
  again under the three pandas.
- **Where it comes from**, as the kit records it: the tale's sources, the music and sounds (the tokay's recording
  and who made it), the household research, the letters; the photographers on Wikimedia Commons whose pictures the
  drawings were studied from; and every one of the cartoon maker's people, creatures, things and places, two to a
  row, each with what it was drawn from (docs/STYLE.md and the kit's files, as far as they say).
- **The research.** The six NotebookLM notebooks the kit and its films were researched in hold 162 sources from 66
  websites: named by kind, journals and universities first. Wikipedia is named last: the owner, "Wikipedia hasn't
  shown to be particularly accurate in studies depending on the subject", and it is not leaned on.
- **Thanks to as many people as possible** (the owner). Each notebook was asked for the people its sources name, and
  each name was kept only where it is in that notebook's sources' own text (all 162 sources' texts were read for
  it; 30 names not found there were left out). They are in `maeng/thanks.js`, made by the film's lab, two lists:
  the 286 who made the sources (their authors, photographers, editors and advisers, the weavers and basket makers
  a ministry's book names, the people interviewed, the hosts of the videos), four to a row, and the 807 whose work
  the sources rest on (whom they cite), five to a row. Left out: names that are no person (a site's
  "administrator", a desk), people a source is only about, and a member of the royal family named in a ministry's
  book, whose titles the credits could not give rightly.
- **A thank-you to the voice.** The owner: "At the end of the credits feature a wai-ing panda bear in python_piggy
  style but with Lanna princess clothes as a personal thanks to Pan for her work." Three candidates were drawn
  beside Teacher Piggy (the owner: "I like all 3", then "Can you do 3?"): three pandas in Teacher Piggy's manner (a
  chibi, a big head over the body, cut at the waist; plum lines, glossy eyes with lashes, blush), each dressed as a
  Lanna princess her own way (a bun of black fur with gold pins hung with pearls, or with a jasmine garland, or a
  big orchid by one ear; a fitted blouse; a sabai over one shoulder, patterned in gold; gold ear plugs and a gold
  necklace). They come up whole from below (a figure drawn see-through shows its own layers), and wai one after
  another, then all together, their eyes closing in two smiling curves at the deepest of each bow.

## The band and an old couple at the night of dancing (2026-10-16)

The owner: "Add the band members to the night scene", then "Add an old couple to the end scene too". Both
are in `sceneDance()` of `sash.html`, at the right of the picture, clear of the words under it (which end
at about x 1410) and of the khom phat and the children at the left.

- **The band** (`band.js`): four players sitting cross-legged at y 1005, a step nearer than the dancers,
  size 1.0, facing left toward them, each on the beat: the elder on the pi chum (x 1420), a fellow on the
  salo (1570), the farmer on the sueng (1715), a fellow with no shirt on the phin phia (1850). In that
  order each instrument reaches into room of its own: the salo's bow lies across the piper's empty lap,
  the sueng's neck goes behind the next player. (In a first order, the salo's bow cut across the phin
  phia's player, whose instrument could not be read.) It adds about a fifth to the time a frame of the
  dance takes to draw.
- **The old couple**: the cast's grandmother (x 1715, y 950, size 1.0) and elder (1575, 955, 1.1), a step
  behind the band, so the players in front hide only their legs; side by side, turned to us
  (`twist: 1`), their eyes on the dancer, holding hands: one point given to both as `reachA`, swinging
  4 px. The elder leaves his stick (`holding: null`), whose hand it would take. Between the dancers and
  the band, where they were first put, the elder hid half the celestial. **The hands, measured:** at
  hanging height (y 795) the point was 117 to 121 from his shoulder and his arm is 108 long at size
  1.1, so his wrist stopped 5 to 18 px short of hers; at y 772, and with no hop (`spring: 0`: the hop's
  stretch would take his hand from hers), the widest gap between their wrists over every frame of the
  scene is 3.4 px.

## Every figure its own, the village's sounds, the credits' bows (2026-10-20)

The owner, of the tale and its hero film: "make sure each sprite on the sash is unique", "Do a round of sounds
research ... Add some cicadas singing and crickets at night", "Make sure sounds get added to the kit", "When the
credits roll have all the sprites used come out and take a bow when they are listed".

- **The sash.** A row of the woven cloth held three to five painters, each repeated about six times along it.
  `sabaiUnique(rows, count, shown)` (sabai.js) fills each row to the figures it holds from `sabaiPool()`: every
  member of the cast in seven ways (walking, a wai, a wave, sitting, laughing with the Thai face, a fat body, a wai
  with both), the band's players, the animals, birds and fish, the creatures of the myths, the flowers, fruits and
  their trees, the lanterns and the things of a house; none twice, and none that the rows weave already (`shown`,
  by key). sash.html: 288 figures, all different. A cloth's `fine` keeps full-size tiles for the rows the camera
  opens on and makes the rest at half, so the 288 tiles stay in memory.
- **The sounds.** sounds.py fetches eleven more recordings, public domain, CC0 or CC BY, each named with its maker
  and licence: hens, the rooster (a Thai red junglefowl), the buffalo, an elephant, a horse, the blue magpie, a dog,
  a flock, the frogs of a Chom Thong rice field, the cicadas of Chom Thong. Each take was heard through an AudioSet
  classifier two seconds at a time and cut where it heard only the animal (the takes had speech, engines and music
  in them); a tree cricket's trill was heard as a fire alarm and left out. Two the kit makes from numbers: a chorus
  of field crickets (heard as "Cricket") and a mouse's squeaks. A scene's call with a fourth number is a bed, laid
  end to end for that many seconds (maeng/feelings.py's `bed()`); each scene's are its `SNN_SOUND`, set to measured
  levels: beds near -30 LUFS in the mix, under the music, and the creature's howls a few LU under the narrator.
- **The bows.** As each name of the tale's cast and of the maker's list rolls up past the middle, its figure comes
  out from the frame's edge beside it, bows (a person over a wai, a creature or a thing tipping forward), and goes
  back as the next comes (s15_credits.js, `S15_FIGURES`). Each is a tile, as the sash's are.
- **The fish of a Lanna pond** (`nativeFish`): redrawn side on and true to each species (owner: "try again with a
  side view but more realistic and as true to the real fish as possible"): the gourami's long anal fin, feelers and
  two spots, the barb's tall dorsal, forked red tail and rows of dots, the flying barb's band and barbels, the
  snakehead's long fins and forward-pointing chevrons (the "Lanna fish" notebook). The tail sweeps (narrower as it
  turns), the soft fins and feelers wave a moment behind, every fin has its rays. The kit's old orange `fish()` now
  draws one of them; the pond's cat sits beside the maiden again.
- **The maker** offers the hen and the black chickens, the cattle egret (northbirds.js `egret()`, moved out of the
  tale's fields), the four native fish, the bamboo house, grass, bananas and the fire stick.


## Every tale's credits and music from one place (2026-10-23)

The second tale, Chang Ngu, needed what the first tale's credits and music did, so both moved out of `maeng/` into
the kit, and each film keeps only what is its own (the owner's rule: one tool, the film's data passed in, no copy
for each film).

- **`credits.js`**: the roll (`creditRoll(t, rows, roll, gone, figures)`), the kinds of row (`creditRow()`: a
  title, a heading, a line, small print, a pair over where each was drawn from, names four or five across, the
  end), the figures that come out to bow beside the pairs (`creditBow()`, the film's own figures by their English
  names) and the thanks of the three pandas (`creditThanks(t, at, wais, words)`). `maeng/s15_credits.js` keeps its
  rows, its figures and its night over the mountain; `changngu/s26_credits.js` its rows, its figures and its night
  over the Mae Khong. Maeng's credits were drawn again after the move, eight seconds from the roll to the pandas'
  wai: every pixel the same.
- **`tale_music.py`**: what `maeng/feelings.py` did, for any tale: `run(folder, prefix, FEEL, SCENE_FEEL, out,
  args)`. A film's `feelings.py` is now its feelings only, each line's, and the cues of its scenes with no words.
  Maeng's music made again through it: every scene's samples the same. `checks/score_check.py --film changngu`
  hears another tale's (`score_check` alone is still Maeng's); Chang Ngu's 122 lines all heard in their feelings.
- **Chang Ngu's credits** run 150 s for the film's 21 minutes: fewer rows than Maeng's (no maker's list, no names
  of the notebooks' people), so they roll at about 39 pixels a second against Maeng's 106, and each figure stays
  out about 6 s. A monk does not wai the audience: the novice is named in the cast with no figure.
- **One film on two machines: its letters.** The kit's words were lettered in the Windows fonts it was made with,
  Leelawadee UI and Georgia; the Spark's Linux has neither, so a scene rendered there was lettered otherwise
  (measured on scene 24, 2026-10-23). `FILM_STYLE.letters = {thai, latin}` names a film's own (`LETTERS_THAI`,
  `LETTERS_LATIN`, read by `subtitle()`, the credits and the names a film writes): Chang Ngu's are Noto Sans
  Thai and Gelasio (made to Georgia's measure), web fonts every page of the film loads, so the laptop and the
  Spark letter it alike (owner: "Same open fonts"). Left out, the kit's own: Maeng's stills before and after,
  the same.

## Through the flowers: a walk through the kit's flora, with no one in it (2026-10-25)

The owner (2026-10-25), giving a clip of Spirited Away (the flowering shrubs and the green hedge) as the
reference: "Make a video like this without a person in it of moving through dense vegetation with flowers. Use
this as a reference video to showcase the flora of the kit. Add fauna as appropriate." `thicket/` is that film,
48 s, written by hand as a page of the kit (the JSON of film.py has no camera that moves through layers): four
scenes, each its own file and page as the tales' are (`s01.html` to `s04.html`, `s01_pink.js` ...), joined in
`thicket/film.html`. Render: `python render.py thicket/film.html out/thicket.mp4`.

| Scene | What the camera does | What is in it |
|---|---|---|
| 1, the pink thicket (0-12 s) | pushes slowly forward; the near bushes part to each side | bougainvillea, hibiscus and the wild cherry in bushes of pink, an opening of light, a tall soft wall of leaves behind; a leopard lacewing resting on a bush, a golden birdwing crossing; petals falling; a shama sings |
| 2, the green hedge (12-24 s) | slides along a hedge that fills the frame | the hedge dotted with jasmine, dok kaew, sarapee, a purple orchid and the wild cherry; hibiscus, orchids, ket tha wa, marigold, ta hern and jasmine on their stems before it; a green-tailed sunbird hovering to sip at a hibiscus (its call); grass yellows; tall grass passing near, soft |
| 3, under the trees (24-36 s) | slides on and rises a little | trunks with golden orchids (ueang), a tokay crawling up one, an atlas moth resting on another; saban nga hanging from above; ta hern, hom, betel on its stake, miang, som poi, ket tha wa on the floor among bushes in flower; teak leaves near; a blue magpie flying through (its call), a bluebottle; shafts of light |
| 4, the clearing (36-48 s) | draws back and rises | a slope of bua tong in leafy mounds and on stems, marigold, thong kwao, frangipani, ratchaphruek; the wild cherry bare and in blossom beside a sarapee in flower; hills; a great hornbill crossing the sky; a birdwing and grass yellows; petals falling; it fades out |

**How it is drawn.** `thicket.js` (beside the kit since the hero film uses it too) is what the scenes share. Every bush, plant and tree is painted once,
the first time its scene is drawn, into a picture of its own (`thkSprite()`, at 1.6 times the sheet's pixels so a
near layer pushed in stays sharp), and each frame places those pictures (`thkPlace()`): this is what lets a scene
hold hundreds of thousands of leaves. A scene is layers far to near (`thkLayers(t, layers, cam)`): each has a
depth (how fast it passes as the camera moves, and how much it grows as it pushes in), a blur (the far ones, and
the nearest that the eye does not hold), a haze of the air's colour, its items swaying in the air (`thkSway()`,
each at its own phase) and its animals (`live`). `thkBush()` paints a bush as the Ghibli painters do: a lumpy
mound of clumps, hundreds of small leaves each lit by its clump's upper left as well as the bush's, a fringe of
leaves standing out from the edge, and flowers of flora.js (`THK_BLOOMS`, their own bloom painters) in clusters on
the sunny faces. `thkGrass()`, `thkTrunk()`, `thkPetals()`, `thkLight()` (shafts and pollen) and `thkVignette()`
make the rest. `thkOnce()` builds a scene's layers once. The style (`thicket/style.js`): 1920 wide at two pixels,
the old print at three tenths. Sounds by `hear()`: the cicadas of Chom Thong under all of it (sounds.py, CC BY 4.0),
the shama, the sunbird and the magpie where they are.

Looked at as stills large, round by round, each scene on its own (owner, 2026-10-25: "a few iterations making them
as beautiful as possible"): the bushes were boxes cut off by their pictures' edges (the clumps now keep inside), one
flat texture (now each clump lit), the flowers scattered (now in clusters); the hedge's flowers were hidden by grass
(the grass now at the left, as the reference has it); the forest was too open (two layers of understory); the
clearing was flatter than the rest (now meadow mounds and a sarapee painted as the bushes are). Rendered
(2026-10-25): 1440 frames in 2428 s on the laptop (the looking over: 481 s, 0 blinked out, 0 popped); the sound
-26.7 LUFS, peak -11.9 dBFS. kit_check: film.html draws, same 0 / 0, 348 ms a frame (the bushes' pictures are
placed, not drawn again; the cost is their size and blur).

**Not done:** the camera's moves are simple (a push, a slide, a rise): no turn, no going round a bush. Leaves and
flowers sway with their picture, a bush as one; no single leaf moves. The animals are the kit's as they are (the
magpie and the hornbill fly side-on). No music, only the birds and cicadas. Not uploaded anywhere.

## The hero film's garden: the Spirited Away look in the opening film (2026-10-25)

The owner, shown stills of the hero film (sash_maeng.html) as it was beside two candidates (A: the air of "Through
the flowers" only; B: that, and painted flowering bushes behind the people and soft blossom at the edges), chose
neither: "Go C all the way and redo the pond scene so it seems like the viewer is coming through a beautiful garden
into the pond area." So, with `thicket.js` (moved beside the kit from `thicket/`, as both films use it):

- **The sets' trees are painted trees** (`thkTreeOn()`: a trunk of `thkTrunk()` and a crown of `thkBush()` with
  flowers or fruit, `THK_BLOOMS`, which now has the golden shower's racemes, longan and mango): the lane's longan
  in fruit and bougainvillea, the pond's golden shower and flame of the forest (the sunbird still sips at its
  flowers, the orchids still grow on the trunks), the paddy's mango and the night's frangipani, where floraTree()
  stood.
- **Beds of flowering bushes behind each scene's people** (`gardenBack()`, before its drawByZ()): pink
  bougainvillea, hibiscus and wild cherry, white jasmine, dok kaew and sarapee, marigolds by the house; at the pond a
  hedge in flower along the far bank and ta hern by the water; bua tong and marigold at the paddy's edges; jasmine and
  frangipani by night.
- **In front of everything** (`gardenFront()`, after it): blossom hanging in from a top corner and soft bushes or
  grass at the foot, out of focus; shafts of light, pollen, falling petals and one butterfly (butterflies.js) by day,
  that drifts across and out of the frame (two all through each scene were "a bit too many butterflies", the owner,
  2026-10-26);
  at the dance fireflies, far ones and near ones that glow over the dancers.
- **The pond is come to through the garden:** for its first GARDEN_IN (4.2) seconds, under the narrator's
  "People were more in harmony with nature", the camera pushes through two near layers of flowering bushes and
  plants (`thkLayers()`), which part to each side onto the pond; the last of them fades, and the pond is open by
  her next line (the flame-of-the-forest trees, elephants and lotus). The plants near the middle went to the sides,
  where the push carries them out: one left in the middle stood in front of the maiden.
- **The pond's water as the pine lake's** (owner, 2026-10-26: "update the pond scene with the pine lake style of water
  and mist with what is behind the water being reflected in it"; pinewoods.js): `pondDepths()` under the fish, dark
  still water; `pondSurface()` over them, the far bank, the trees, the hills and the sky mirrored about the far bank's
  line (`natReflect()`), strong across the water and fading toward the near bank (`POND_MIRROR`), so the fish are seen
  down in it near at hand; the drops' rings; mist lying on the water and strands rising off it (`softMist()`,
  `natSteam()`), and a few wisps over the far bank. The kit's `pond()` is no longer drawn here. Then (owner: "Add some
  vegetation along the back side of the pond and erase the hard black line for its edge. Extend the water to the
  bottom of the canvas and move the woman back a bit and give the sides of the pond a more natural shape", "Consider
  lowering the top edge"): its bank a smooth line through `POND_EDGE`, the sides wandering in and out, the far bank 40
  lower, the water running off the foot of the picture; no line round it (`natReflect()`'s new `line: 0`); low bushes
  and grass along the far bank (`pondBank()`), mirrored in the water; the maiden and her cat 35 back from it. Then
  ("The sides look almost like straight lines. Add some smaller plants to hide the top line of the pond. Give the left
  side an S shape. In the foreground add some more reeds or plants ... put the lotus into the water", "Mirror the
  butterfly flying over the lake"): the left bank an S and the right in and out twice (`POND_TOP`, `POND_EDGE`); small
  grass and short reeds along the water's top edge and reeds and grass over its sides (`pondFringe()`); each lotus
  rooted 60 under the water (`pondLotus()`: the whole clump under the water's face, what stands above the water line
  over it, pads on the water and a ring round the stems); the bluebottle flies low across the pond
  (`pondButterfly()`) and the water mirrors it, upside down, twice its height below it (`pondButterflyMirror()`).
  More grass over the near corners; a mud barb that leaps once out of the water at 20.5 s of the pond's clock, a ring
  and a splash where it leaves and where it goes back in, and is gone (`pondLeap()`; owner: "Add a leaping fish that
  jumps once", then "Just have it disappear").
- **The far mountains** (owner, 2026-10-26: "see if you can use the new kit to make better background mountains"):
  `farRange()` in `paintSet()`, for the village, the pond, the dusk and the night sets: a far ridge pale with the air
  (`ridgeLayer()`), a limestone peak standing up out of it as Doi Luang Chiang Dao does (`peakSprite()`), and a range
  clothed in forest with pines (`forestHill()`), each hazed by the air before it; painted once for each light. The
  middle range, whose ridge the elephants walk, and the rice fields' mountains are as they were (kit/TODO.md).

The woven cloth (the first scene) is as it was. sash.html, the hero film before it was the Maeng film's opening, is
as it was. Not re-rendered: lanna_tales_maeng.mp4 on the site still has the hero film as it was.
