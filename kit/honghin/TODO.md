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

## Open

- Pan's ear on the Kam Mueang (story.py `ASK`), then her voice; the lines retimed to her takes (each scene's
  `HNN_LINES` are placeholders from story.py's seconds).
- The scenery pass with the owner, scene by scene (docs/kit/places.md, "Painting the scenery"; story.py `SCENERY`).
- The sounds: each scene's `HNN_SOUND` names sounds to be matched to `sounds.py`'s (some, such as "cicadas", "swish",
  "crash", "elephant", are not made yet); `feelings.py` for the music.
- The credits scene (as `../whiteeel/s15_credits.js`).
- Checks on each scene page: `checks/kit_check.py`, `pop_check.py`, `arms_check.py`.
- Seen in the stills, to improve: the giants' cities share one hall; the ghouls in the air fly standing; the brothers'
  attack at the river is shown as their closing in, then the cut.
