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

## 0. Under way now (finish first)

1. **The kit: faces, bodies, eyes** (uncommitted in `../oldcartoon.js`): the Thai face (`north: "thai"`), bodies
   (`body: "fat"`, drawn from scratch), `lady` apart from `bun` (face, hair and body swappable), and everyone's
   folded eye (`STYLE.lids`). The maker's person panel chooses face, hair and body (`style` in its JSON), and reads
   subtitles and speech bubbles aloud (🔊). Left: the whole kit check with the folded eye, then commit by path,
   sync into the site (`scripts/sync_lannamation.py`), push.
2. **The live film, put right without waiting for the rest**: the narrator's own name in the credits (owner: "Change
   Panda's name in the credits to" Amornrat Jaijar, อมรรัตน์ ใจจา), the tokay's way down the hut wall kept off the
   doorway and ending at the top of the wall instead of disappearing (`s04`), the hen in front of the golden trough
   (`s11`). Rendered from the film's own frozen kit on the Spark; then joined, checked and put live.
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

26. "increase the volume on the monster howls to be a little less than the voice": the creature's howls brought up
    to a little under the narrator's level (measured), in the tale's mix; no picture changes.

## 7. Render, join, check, put live

27. Every scene of the tale and the hero film, once, from the kit as it then is (the Spark's GPU; `../scenes.py`);
    the hero film keeps its narration and timing (`SLOW` 1.15).
28. "When switching from the intro to the SLS scene fade out and back in over a second or two to give the scenes a
    transition": a fade through black at that join in `../chain.py`, taken from the two films' ends so the length,
    the page's fireflies (94.3 s to 106.3 s) and the narrator's toolset's line times do not move.
28b. "change the woman who waves at the end and peaks out from the video to wai instead of wave": the lanna_cartoon
    page's goodbye (the kit figure who leans out past the video's edge after the film) gives a wai, not a wave. A page
    change only: no render. (The film's own goodbye, `s14`, where Bua-kham waves inside the picture, is not this one.)
29. The joined film's checks (loudness, subtitles against the voice, the credits), then up, and the page.
