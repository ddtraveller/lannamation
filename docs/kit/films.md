# The films: putting a tale together, its titles and its credits

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

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
