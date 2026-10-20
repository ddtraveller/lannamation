# The Lanna Tales film and the kit: what is left, in the order to do it

Written 2026-10-20 from the owner's list of that day (each item quoted below), with the work already under way.
The film is `lanna_tales_maeng.mp4`: the hero film (`../sash.html`, in the narrator's voice), the studio's card
(`../sls_intro.html`) and the tale (`film.html`, scenes `s01` to `s15`), joined by `../chain.py` (`series.json`).

**Why this order.** Rendering is the slow step (the tale's 15 scenes take hours on the Spark's GPU), and every
scene of the tale changes anyway: the kit's eye is folded for everyone since 2026-10-20 ("fix the eyes in all the
models with a folded lid eye"), and the film was rendered before that. So everything is drawn and checked first,
each new look as a sheet of candidates beside its reference (the owner picks, one sheet for many items to save
rounds), then the kit check once, then every scene rendered once, then the sound, then the join. Research that
waits on others starts first and runs while the drawing goes on.

## Where it stands (2026-10-20, afternoon)

Drawn and checked in stills: 14 (the fields), 14b (the bamboo house), 15 to 21 (tears, snare, grass and bananas, the
fire stick, the nose rope, the head-cloth and the e-pun knot, the black chickens), 21d (the vine: the creature
follows him 250 behind, `S06_VINE`), 22 (every figure on the sash its own: `sabaiUnique()`, 288 figures, none twice),
23 to 25 (the pond retold, the elephants, the dancers). 21c: the credits' bows (`S15_FIGURES`, 88 figures, and a cast
part for the tale's own people). 25b: 13 sounds into the kit (`sounds.py`: 11 recordings, each heard through an
AudioSet classifier and cut where only the animal is heard, and the kit's own crickets and mouse), laid into every
scene (`SNN_SOUND`, beds by feelings.py's `bed()`), each at a measured level. 26: the howls 1.5 to 6 LU under the voice
(measured in a trial mix). The maker offers the hen, the black chickens, the egret (now `egret()` in
northbirds.js), the four native fish, the bamboo house, grass, bananas and the fire stick. 26b: the credits name the
sounds' makers, the four new notebooks' sources, all ten notebooks' links, 241 sources. 28: `../chain.py --fade 1,0.75`,
to be given at the join. 28b: the page's goodbye is a wai (site commit f0076df1). Left: 27 (render every scene and
the hero film once), then 29 (the join's checks, and up, on the owner's word).

**Done 2026-10-20 17:40 (Thailand): the whole list, live.** After the list: the pond's fish redrawn side on and true
to each species, behind the lotus, the cat beside the maiden; the old orange fish gone from the kit; the studio card's
crickets and two tokay calls (`../sls_sound.py`), and the tokay's two calls at the end of the credits. Rendered once
(laptop and Spark, from lannamation c0237ba to be1e1d0), joined with `../chain.py --fade 1,0.75 --over
thanks_jing.png,905.5,911.8`: 927.3 s, -14.1 LUFS, peak -1.4 dBFS; uploaded over s3://krueng.ai/video/
lanna_tales_maeng.mp4 on the owner's word ("ship it"), CloudFront invalidated (I8OP849T9PRW0F6L7XEYBVKUJY).

## 0. Under way now (finish first)

1. **The kit: faces, bodies, eyes** (uncommitted in `../oldcartoon.js`): the Thai face (`north: "thai"`), bodies
   (`body: "fat"`, drawn from scratch), `lady` apart from `bun` (face, hair and body swappable), and everyone's
   folded eye (`STYLE.lids`). The maker's person panel chooses face, hair and body (`style` in its JSON), and reads
   subtitles and speech bubbles aloud (🔊). Left: the whole kit check with the folded eye, then commit by path,
   sync into the site (`scripts/sync_lannamation.py`), push.
2. **The live film, put right without waiting for the rest**: the narrator's own name in the credits (owner: "Change
   Panda's name in the credits to" Amornrat Jaijar, อมรรัตน์ ใจจา), the tokay's way down the hut wall kept off the
   doorway and ending at the top of the wall instead of disappearing (`s04`), the hen in front of the golden trough
   (`s11`). **Done 2026-10-20 12:29 (Thailand):** the two halves of the credits and scenes 4 and 11 rendered from the
   film's frozen kit on the Spark, the tale joined (821 s), the film joined (927.3 s, -14.1 LUFS, -1.5 dBTP; the
   credits' one-frame font patch is no longer needed), uploaded and the CDN cleared; the live page plays it.
3. **The narrator's voice for the cartoon maker** (private, the owner's machines only): training, then the best
   checkpoint by the voice test, into the private copy of the Kam Mueang extension. Tracked outside this repository.
4. Done 2026-10-20: the gecko of procedural_animation.html no longer folds over itself (a stiffer back).

## 1. Start now, runs in the background

5. **Research the fish of Lanna** ("research notebooklm to find lanna fish"): notebook "Lanna fish" (deep web
   research started 2026-10-20). Then the same for what the new drawings need: the king's and the princess's crowns,
   the black chicken of the north, the buffalo's nose ring and rope, a strong snare, flooded rice fields with
   farmers, buffalo and a crane (the "Lanna material culture" notebook, asked one question at a time).

## 2. New parts of the kit (one sheet of candidates, the owner picks, then one kit check)

6. "add a black chicken and rooster to the kit": a black hen and a black rooster beside the kit's hen and rooster.
7. "Make grass and a banana for the kit": a bundle of cut grass, a banana (and a hand of them), things a person can
   hold and give.
8. "Add some tears for when the boy cries": tears as part of the kit's feelings, for the sad face.
9. "Give the king and princess crowns like these" (two pictures: a tiered spire crown with flame-shaped leaves, and
   a Lanna crown of flowers and spikes), then "Try to be historically accurate and copy the crowns as best you can":
   the two crowns drawn as close to the pictures as the kit's line allows (the spire's tiers, its flame leaves, the
   band's jewel; the princess's silver flowers and spikes), and checked against the record of Lanna royal dress
   (research, 5): what the rulers of Lanna and their princesses wore, so the film does not put a Siamese stage
   crown where the north wore something else; where the record and the pictures differ, the owner decides.
10. "Change the rope to the buffalo to go around a ring in its nose": a nose ring on the buffalo, the lead rope tied
    to it.
11. "Increase the size of the snare and make it look a little stronger": a bigger snare, its cord thicker, its
    stake and spring pole stout.
12. "have the boy flip them up with a stick": a stick the boy holds, and the pose that flips a coal up off the fire.
13. "Work to improve the fish in the pond scene": the pond's fish redrawn from the research (5).

## 3. The fields behind the poor family's home (a candidate still first)

14. "Increase the quality of the background fields behind the home of the poor family and the fields as well. A few
    of the fields should be flooded and a few farmers and buffalo, etc. should be working the fields and a crane
    should fly off from the fields." The yard's far fields (`sets.js`, `maengYardAt`): seen in most of the tale's
    scenes, so done before any of them is rendered.

14b. "research traditional Lanna housing and redo the poor house like this" (a picture from Chiang Mai University's
    Lanna Traditional House Museum: a bamboo house, เรือนไม้ไผ่): the poor family's hut drawn anew after it, on bamboo
    posts with the space under it open, walls of flattened woven bamboo, a roof of leaf shingles (ตองตึง, dried
    dipterocarp leaves) laid in rows, an open veranda with a bamboo railing, a ladder. Researched first (how such a
    house is built and lived in), then a candidate beside the picture, then the hut of every scene it stands in
    (and the room inside it, `s04`). With 14, as the yard's backdrop.

## 4. The tale's scenes, using the new parts

15. "Add some tears for when the boy cries": the grief of `s04` (and the mother's night of `s02` if he cries there).
16. The snare, bigger and stronger: `s04` (the wish), `s05` (setting it), `s06` (the creature in it).
17. "Work on the feeding of grass and the bannana": `s07`, with the kit's new grass and banana.
18. "When he's feeding the monster coals, have the boy flip them up with a stick": `s07`.
19. The buffalo led by its nose ring: `s03`, `s08`, `s10`.
20. The crowns: the king (`s09`, `s11`, `s12`) and the princess (`s12`).
21. The black hen and rooster among the yard's chickens (`s02`, `s08`, `s11`).
21b. "make the lanna notebooklm notebooks public and add links to them all to the credits": every NotebookLM notebook
    made for the Lanna kit and its films (the ones named for Lanna: history, faces, women's hair, material culture,
    household items, fairy tales and mythology, fish, and any made for the items above) shared so anyone with the
    link can read it, then each one's title and link in the credits' research part (`s15_credits.js`), checked
    from a browser that is not signed in. After the research of 5, so the new notebooks are in it too.
    **Public since 2026-10-20** (all ten named for Lanna, viewers see the full notebook: chat, sources and notes):
    houses 113b14eb, material culture c4f5b066, village farming b60a376b, royal dress 96884a5c, fish 732ac6ef, history
    d4d0435c, faces d8935530, women's hair 918d561e, household items 51aaf1ee, fairy tales fd7ed330, each at
    https://notebooklm.google.com/notebook/<its id>. A browser not signed in is sent to Google's sign-in first:
    NotebookLM's "public" means anyone with a Google account, so the credits say so. The links go in with 26b.
21c. "When the credits roll have all the sprites used come out and take a bow when they are listed": as each person,
    creature or thing of the film comes up in the credits, it comes out beside its name and bows (a person bows or
    gives a wai, an animal dips its head, a thing tips), then steps back as the roll goes on. After 6 to 21, so the
    new parts (the black chickens, the crowned king and princess) are among them; the credits' length and its
    music stay as they are.
21d. (owner, 2026-10-20) "reshoot when the boy takes the monster away with the vine. The vine becomes very long.
    Have the boy stay closer to the monster as they walk away." `s06` from 39.5 s: the boy walks off with stroll()
    (1070 wide, a person's pace) and the creature with amble() (860 wide, its own pace, from another start), each on
    its own, so the gap between them grows and the vine with it. The creature follows him instead, a short vine's
    length behind (about 150), its steps from the ground it covers; the vine stays short and sags a little.

## 5. The hero film's scenes

22. "review the initial sash scene and try to make sure each sprite on the sash is unique": the woven figures of
    `../sabai.js` in the first scene, no two alike.
23. The pond's fish (13), and the pond scene told anew (owner, 2026-10-20): "Change the pond scene so it starts with
    the woman looking into the pond and watching fish swim and then she looks up to see the man and dragon from the
    current scene. Put the cat in the reeds like it's watching the fish, too." The scene's length and its narrated
    lines stay as they are (the narration is timed to them).
24. "When the elephants walk over the hill make them a bit smaller and make it look like they are walking through
    the foliage rather than on top of it": smaller, and the forest's front edge drawn over their legs.
25. "Add a few more dancers to the night scene."

## 6. The sound

25b. "Do a round of sounds research for the video and try to find sounds for the story for animals and birds that
    appear in it such as with the gecko. Add some cicadas singing and crickets at night." Every animal and bird the
    film shows (the hens and rooster, the buffalo, the mice, the elephants, the horses, the magpie, the flock, the
    pond's fish jumping, the dog, the frogs of the rice fields), each a recording with a licence that allows it
    (public domain or CC BY, its maker credited, as the tokay's: Richard Ling), or made by the kit where none is
    found; cicadas by day in the trees, crickets and frogs at night. Laid into each scene's sound under the voice
    (the decorate `calls`, sounds.py), and their makers into the credits. Research first (it runs in the background,
    with 5); the mix with 26.

26. "increase the volume on the monster howls to be a little less than the voice": the creature's howls brought up
    to a little under the narrator's level (measured), in the tale's mix; no picture changes.

## 7. Render, join, check, put live

26b. **The last thing before the render:** "update credits with new resources used in the video". Every new
    source the film took from since the credits were written: the research notebooks and their sources (Lanna fish;
    royal dress; village farming; Lanna houses, with Chiang Mai University's Lanna Traditional House Museum), the
    sound recordings and their makers (25b), the people thanked by name in them, and the new things of the cartoon
    maker (the black chickens, the egret, the bamboo house, grass and bananas, the fire stick), each with where it
    was drawn from. Together with 21b (the notebooks' public links) and 21c (the bows), so the credits are written
    once, after everything else is final, and rendered with the rest.

27. Every scene of the tale and the hero film, once, from the kit as it then is (the Spark's GPU; `../scenes.py`);
    the hero film keeps its narration and timing (`SLOW` 1.15).
28. "When switching from the intro to the SLS scene fade out and back in over a second or two to give the scenes a
    transition": a fade through black at that join in `../chain.py`, taken from the two films' ends so the length,
    the page's fireflies (94.3 s to 106.3 s) and the narrator's toolset's line times do not move.
28b. "change the woman who waves at the end and peaks out from the video to wai instead of wave": the lanna_cartoon
    page's goodbye (the kit figure who leans out past the video's edge after the film) gives a wai, not a wave. A page
    change only: no render. (The film's own goodbye, `s14`, where Bua-kham waves inside the picture, is not this one.)
29. The joined film's checks (loudness, subtitles against the voice, the credits), then up, and the page.
