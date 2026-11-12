# Hong Hin, the stone swan: where the film stands

The fourth Lanna Tales film, after Chao Suriyawong's khao so (1901). The plan and every line: `story.py` (`python
tale_plan.py honghin` writes `plan.html`, `words.js`, `central.txt`). The owner chose the tale on 11 November 2026 and
set its rules (story.py's head); his answers to the plan's four questions are in `plan.html`.

## Done (2026-11-11)

- The kit's beings and things for the tale, the owner's picks of three rounds of candidates (docs/kit/creatures.md and
  things.md, "Hong Hin"; sheet `../honghin.html`).
- The script: 21 scenes, 96 lines, the Kam Mueang a draft in Pan's spellings (her rules change nothing in it).
- All 21 scenes built, each on its own page (`s01.html` ... `s21.html`), the owner's "Yes, and keep going" to scene 1's
  plan: built in turn, stills shown as they went. `film.html` lays them end to end (`film_page.py`).
- Shared: `sets.js` (the cast; the titles in the Lanna script; Varanasi by night; the court; the orchard; heaven; the
  giant cities; the ghouls' forest; the high pass; the fair's pavilion; a camera; cuts through black), with the Chang
  Ngu and White Eel films' sets (`../changngu/sets.js`, `../whiteeel/sets.js`) for the wall, the gate, the court, the
  Kok river and its plain, the lane, the skies, `welPerson()`.

## The owner's notes on the voiced film (2026-11-12)

The voiced film went to krueng.ai (video/lanna_tales_honghin.mp4) for Pan to see. The notes, by the film's clock, and
what was done (each scene's file says where):

- 3:20 the astrologers' boards moved, one before each of them, clear of the throne (s02).
- 4:11 Vimala lies on the mat after she faints, her eyes shut (s03).
- The puppy's spots ride on its back as it moves (honghin.js puppy()).
- 6:06 the baby crying: a frown and a tear (chiangsaen.js swaddledBaby(..., "sad")).
- 6:21, 6:58 the boy, Indra, the queens and the golden stone stand in the clouds, their feet behind a cloud's tops, no
  shadow under them (sets.js hhCloudFeet(); indra() takes ground: false).
- Indra's crown and the giants' crowns more detailed, with sparkles (himmaphan.js spireCrown(), ogre.js ogreHead()).
- 7:32, 11:10 and every ride: the swan's near wing in front of its riders (himmaphan.js hongHin(..., {rider: true}),
  then near()).
- 8:23 Vimala holds her son close, happy tears (s08).
- 10:14 Kanchai held in his hand, raised to chop (sets.js hhSword(), from the wrist person() gives back); the
  giantess's long matted white hair (ogre.js).
- 11:10 the swan flies right off the picture (s11); 11:31 it lands on the palace roof (s12).
- 12:09 the giants bring the meat to their mouths, the jaw opening and shutting (ogre.js look.jaw; sets.js
  hhJointsOf()).
- 12:30 Culakantha's arm down (sets.js hhDaughter()).
- 13:19 the empty hall shorter (s13 60 to 55 s); the ghouls throw trees too; the sword up, then down in an arc through
  them; the falling ghouls end at 14:15 (s14 60 to 56 s).
- The Hemmarat's claws grip the elephant (myth.js hatsadiling() look.held).
- 15:27 the brothers in the order of their depth, arms at their sides; 15:54 those on foot behind the elephant (s16).
- The healing 2 s shorter (s17 60 to 58 s); the boy at the city cut (s18 55 to 42 s); 19:45 cut (s20 55 to 35 s);
  20:03 the city dancing, as the hero film's night; 20:22 Vimala closer to her son, behind him, clear of the post;
  20:40 cut (s21 60 to 47 s).
- The credits (s22, 120 s), as the White Eel's.

## Open

- Pan's ear on the Kam Mueang (story.py `ASK`), then her voice; the lines retimed to her takes (each scene's
  `HNN_LINES` are placeholders from story.py's seconds).
- The scenery pass with the owner, scene by scene (docs/kit/places.md, "Painting the scenery"; story.py `SCENERY`).
- The sounds: each scene's `HNN_SOUND` names sounds to be matched to `sounds.py`'s (some, such as "cicadas", "swish",
  "crash", "elephant", are not made yet); `feelings.py` for the music.
- Checks on each scene page: `checks/kit_check.py`, `pop_check.py`, `arms_check.py`.
- Seen in the stills, to improve: the giants' cities share one hall; the ghouls in the air fly standing; the brothers'
  attack at the river is shown as their closing in, then the cut.
