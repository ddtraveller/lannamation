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

## The owner's notes on v2 (2026-11-13): the plan

Film time = v2's (the tale starts at 2:14.49); the scene and its own second in brackets. Done = a still checked.

**A. The kit, once for every scene**
1. Hands: a lifted hand no longer opens its palm to us by default (it read as "waving hello" everywhere); it stays
   still, loosely curled, its back or edge to us. An open palm only when a look asks (look.hello) or for dance/lift.
2. Indra: every jewel sparkles as the sash, necklace, arm bands and belt do (himmaphan.js).
3. The swan: the saddle behind the near wing (himmaphan.js hongHin()).
4. The sword Kanchai: the hilt and blade one piece, no gap (sets.js hhSword()); held in a closed hand.
5. Giants after the owner's reference (the sea giantess statue): tusks rising from the lower jaw, heavy brow, broad
   nose, round eyes, beaded headband, collar and arm bands. The giant princesses: small fangs, otherwise the same.
   The giantess under the tree: ragged clothes, red skin everywhere (hands, feet, neck: no gap).
6. A throw (sets.js): the arm cocked back and folded, the stone by the head, the wrist bent back; then the arm extends
   up and forward and the wrist flexes through (the owner's jump-shot reference). The boy's stones (s09) and the
   ghouls' throws (s14).
7. The six brothers distinct: one shorter and stouter, one taller and thinner, one with wrinkles; face shapes, lips
   and eyes a little different each.
8. Ground: no wide field of one flat colour (texture and things on it), and no ruler-straight edge where ground meets
   ground, water or a building: the two-line way (an undulating line along the edge, planted thick with bushes,
   grasses, trees and flowers; a second line along the bottom of the picture, planted too).

**B. Scene by scene**
- 2:45 (s01 30.5): the king behind the battlements, his feet hidden by them. The banana tree near the middle behind the
  bush it overlaps.
- 3:06 (s02 6.5): the things either side of the king and queen as detailed as possible.
- ~5:23 (s04 ~43): Vimala on reaching the road walks straight left (off the picture is fine), not stuck at the end.
- 5:44 (s05 19.5): the torch a wooden stick (a brand), the woman holding it still.
- 6:54 (s07 4.5): the swan stone 5-10 px lower, its foot wholly in the clouds.
- 7:20 (s07 30.5): the prince holds the sword (closed hand, no wave). 7:35 (s07 45.5): his lower leg angled clear of
  the near wing; the swan and prince behind the clouds.
- 8:20 (s08 35.5): the embrace: no wave; the mother's right arm behind him; his right arm straighter, in front of her.
- 8:48 (s09 8.5): the brown ground textured and decorated. 9:25 (s09 45.5): the throw (A6).
- s10: the giantess (A5). 10:26 (s10 51.5): the last brother still. 10:29 (s10 54.5): blood stains placed on the
  ground in the right depth; the prince's hand on the gold not waving.
- 11:16 (s11 41.5): the soldiers each different: skin, face, eyes, height and build.
- 11:26 (s12 1.5): the brown field textured. s12 feast: giant guests of their own (not the kings of s13/s14); 12:19
  (s12 54.5): the bones held in the hand, thumb over the bone, fingers behind.
- 13:17 (s14 5.5): the brown field; 13:21 (s14 9.5) huts and water pots detailed and shaded; 13:33 (s14 21.5) the
  two lines and a jungle; 13:45 (s14 33.5) the wrecked huts rough (hay, broken wood), the pots' smashed bottoms;
  13:58 (s14 46.5) the ghouls throw as A6, no waving.
- 14:29 (s15 21.5): the prince not waving; the monster a lower jaw with fangs; it falls in front of the prince and swan.
- 15:28 (s16 35.5): the elephant's steps slower and its travel left a little quicker, so its feet do not slide.
- 16:50 (s17 end): cut a little sooner. 17:26 (s18 35.5): the mother in front of the roof and throne.
- Every scene: straight edges replaced by the two lines (A8).

**C. Life in every scene, as fits:** birds, flowers, plants, animals, fish (kit lannabirds/taleanimals/forestanimals.js,
   thicket.js, butterflies.js, the pine lake's fish).

**Done 2026-11-13 (stills checked):** A1 (oldcartoon.js handPose: a lifted hand curled, its back to us; look.hello opens
it), A2 (himmaphan.js himmaTwinkle on the crown, throne and the flying figure's jewels), A3 (hongHin's near wing after the
saddle), A4 (honghin.js kanchai: hilt and blade's root under the guard), A5 (ogre.js ogreStatueFace, ogreCollar, the
feast's guests violet/ochre/teal/ash, the giantess's rags ogreRags and look.ivory false; sets.js hhFangs for the
princesses), A6 (sets.js hhThrow: s09, s14), A7 (sets.js HH_SON_FACES), A8 (sets.js hhGroundTexture, hhWander,
hhEdgePlants, hhBottomPlants; the lane via welLane()'s dressing, the giant courts hhGiantGround, the ghouls' ground, the
fields' road and wall foot hhFieldsEdge, the orchard's far edge, the river's near bank hhRiverBank). B: every scene note
above (s01 the king behind the parapet hhEdgeWallNight + the middle banana behind the wood hhForestBananas; s02 chatra;
s04 the walk; s05 hhBrand/hhFlame; s07 stone, sword held, look.shin, clouds after; s08 hhArmOver embrace; s09; s10 blood
h10Blood, gold bag h10GoldBag, rows in depth; s11 H11_MEN; s12; s14 hhGhoulHut, hhWreckedHut, hhWaterPot, hhSmashedPot;
s15 myth.js look.jaw; s16 the elephant's stride from its travel; s17 58 to 55 s; s18 the old queen after the pavilion).
C: sets.js HH_LIFE (each place's life with its air), hhFishLeap. E: the skill and docs/kit/places.md 10-12.

**F. The clouds (owner, 2026-11-13, added): "Replace the clouds in the video with the new style clouds and default to
using them in the future"** (the soft clouds of Chang Ngu's film). Done: scenery.js sceneryCloudBank() and the heaven's
light; hhHeaven()'s floor, hhCloudFeet(), s03's cloud, s07's dive, vimana()'s cloud (look.thai for the old); thaiCloud()
documented as the old style; the skill and docs/kit/places.md 7 say soft clouds by default.

**D. Before any render:** stills of every scene (two or three moments each) to the owner for z-order, scenery and
   detail; render only after the owner's yes.

**E. The making notes** (skill lanna-tale-film and docs/kit/places.md): check each item's z-order on the stills after
   each scene; no wide field of one colour; the two-line way; the owner's stills QA before the render.

## The owner's QA of the v3 stills (2026-11-13): the plan

The owner's references (a yaksha mural: long face, great nose, bared green lower jaw with fangs, a
bulging eye under a heavy brow, a gold band and a topknot; chart1/chart3 astrology charts: a circle in nine cells with
Thai numerals and animals of the year, a wheel of twelve signs in a gold kranok rim; astro2 a mural sage, bare, a finger
raised; swing.jpg a two-handed swing from overhead down to low).
1. s01: no ruled lines, texture on the plain green fields; the ghouls their own look, apart from the giants: bony and
   thin, muscles drawn, the head after the mural yaksha (colours kept).
2. s02: the astrologers each his own; their charts after the references; the first like the mural sage (no crown); the
   second as now with a long goatee and beads hanging from his headband over his eyes (not past the nose); the women's
   faces more their own.
3. s03: the queen square on the mat, a pillow and a blanket (second part); the dog still, not walking in place.
4. s05: the garden full: flowers, fruit, plants, herbs; birds; animals far off at the jungle's edge.
5. s07: the prince further back on the swan, his knee clear of the wing.
6. s08: his far arm behind her, his near arm round her over her; her far arm behind him, her near arm in front of him.
7. s09: the stout brother's cloth cut to fit him; the brothers' skin a little different each; hair, faces, head shapes.
8. s10: the giantess a skirt of bones; the musket a stick; the brothers swing as the reference (two hands, overhead, down).
9. s11: the soldiers' faces and head shapes each their own.
10. s12, s13: the princesses tiny tusks like their fathers'.
11. s14: straight lines that do not follow the bushes; birds; more kinds of plant, in detail, before and behind the
    bushes on the undulating line under the bananas.
12. s15: struck, the Hemmarat's eyes widen then close; it drops the elephant, which is very surprised.
13. s16: fish and birds of the kit; a new line: the brothers told her they had only knocked him out, so she would not
    cry out.
14. s17: a new line: he decides to go to the city to find the king and his mother.
15. s18: a new line: the king wants to look for the one on the swan without the brothers knowing.
16. s19: fetters round each wrist.
New lines (13-15): Kam Mueang drafts in Pan's spellings, takes in her voice (kmv-pan-voice on the Spark), the scenes
retimed, the music and mix again.

## The owner's QA of round 2 (2026-11-13): the plan
1. s02 the minor wives all young and pretty, dark hair. 2. s03 the blanket from her neck to her feet; the baby goes
down the hole, not half over it. 3. s05 (again, stronger) the garden full, birds, a jungle's edge behind with animals.
4. s07 (again) the prince further back, his knee clear of the wing. 5. s08 her far arm and his far arm behind everything.
6. s10 the bent arms of the swing straighter. 7. s11 truly different faces: head shapes, the eyes', noses' and mouths'
lines. 8. s12 the tusks up from her lower lip. 9. s13 the tusks in the mouth. 10. s14 the ghouls two eyes. 11. s15
(again, stronger) eyes wide then shut, the elephant dropped and astonished. 12. s16 the palaces in the clouds, not on.

## The owner's QA of round 3 (2026-11-13): the plan
1. s03 the blanket's head end folded back, its end draped over her arm; the six wives' faces from worried through
neutral and serious to mean and angry. 2. s05, s07, s08: the round-2 notes again (likely left in the page's boxes;
checked again). 3. s06 Indra's chest and belly drawn in detail. 4. s09/s11: the stout brother and the two at the far
right drawn new, from scratch, after northern temple murals and thangka (not the kit's figures); s11 the stretched ones.
5. s10 every brother's arms near straight as the far right one's, the sticks up and down out of step. 6. s12/s13 a
larger mouth fitted round the tusks. 7. s16 the turtle under the water, as the hero film's pond fish swim. 8. s17 a new
kind of bird in flight in the kit.

## Open

- Pan's ear on the Kam Mueang (story.py `ASK`), then her voice; the lines retimed to her takes (each scene's
  `HNN_LINES` are placeholders from story.py's seconds).
- The scenery pass with the owner, scene by scene (docs/kit/places.md, "Painting the scenery"; story.py `SCENERY`).
- The sounds: each scene's `HNN_SOUND` names sounds to be matched to `sounds.py`'s (some, such as "cicadas", "swish",
  "crash", "elephant", are not made yet); `feelings.py` for the music.
- Checks on each scene page: `checks/kit_check.py`, `pop_check.py`, `arms_check.py`.
- Seen in the stills, to improve: the giants' cities share one hall; the ghouls in the air fly standing; the brothers'
  attack at the river is shown as their closing in, then the cut.
