# The prompt that makes the sash film

(2026-10-16: the film's song gave way to the story of Lanna told in Kam Mueang by
`sash_narrate.py`, the end card went, and the film is 79 seconds; see `docs/STYLE.md`,
"The story told in Kam Mueang". Later that day a khom phat, the spinning lantern, was
hung at the left of the night of dancing, with three children under it; see "The
spinning lantern". This is the brief it was first made from.)

`sash.html` is the film at the top of `lanna_cartoon.html`, 57 seconds on the
Lanna cartoon kit, with its band from `sash_music.py` and its sung words from
`sash_sing.py`. This is the prompt to give an agent that has the `lanna-cartoon`
skill (`python film.py skill claude_code`, or `codex`, or `opencode`) and the
kit's files beside it, to make that film again, or one like it. The film is
beyond the maker's JSON (a camera that moves, a cloth of woven figures, water
drawn live, a song), so the prompt asks for what the skill names for that: a
page written by hand on the kit, as `lanna_cartoon.html` teaches, rendered
with `render.py`. Everything the prompt names is in the kit's vocabulary or
in the kit's own files; nothing is drawn from a picture.

---

Make me a 57-second cartoon on the Lanna cartoon kit, as a page of the kit
written by hand (it needs a moving camera and a woven cloth, which the maker's
JSON cannot do), with its own music and its words sung. Call the page
`sash.html`, the music script `sash_music.py` (it writes `sash.wav`) and the
song script `sash_sing.py` (it writes `sash_song.wav`). Load `oldcartoon.js`,
`beasts.js`, `naga.js`, `dragon.js`, `motion.js` and `cumulus.js`. The sheet is
1440 by 1080, the beat is 0.5 seconds, and the music begins at second 3 after
three seconds of silence. Work the way the skill says: patch, draw stills of
the seconds that matter, look at them, fix, then render with
`python render.py sash.html sash.mp4 --audio sash_song.wav`, and run
`python checks/kit_check.py sash.html --quick` before you call it done.

**The idea.** Lanna life woven on a cloth. The film opens on one row of a
woman's shoulder cloth, her sabai, where the people and animals of Thai life
walk as woven figures; the camera pulls back until she stands in her village;
then four scenes of her world: the lane, the lotus pond, the temple at dusk
and a night of dancing. Subtitles in Thai with English under them, and a
voice that sings each line.

**Scene 1, the cloth, 0 to 22 s.** The cloth is rows of woven tiles, each
tile a figure of the kit drawn as a six-frame walk cycle (people of the cast,
the dog, the rooster, fish, lotus, lanterns, a tung, the temple, a yak, a
scroll cloud, the sun, a drummer, a dancer), the rows in alternating reds,
flipped to face the way their row flows. One row is the woman's own, and she
is woven in it. Hold still for the first three seconds; when the music begins
the rows start to flow at 2.5 px a second. From 6 to 20 seconds make one
steady logarithmic pull-back, with no pause, from that row to the whole cloth
to the woman wearing it to her village: lock the camera to the cloth, which
lies as a cubic curve from her far hip over her near shoulder, turning upright
as it goes. From 20 she keeps the beat and waves. The village set is the
kit's hills, ground, tree, house and banana.

**Scene 2, the lane, 22 to 31 s.** The same village. A villager and a child
walk in from the left and stop; a weaver walks in from the right with her
hands down and stops before them. She wais them at 6.3 seconds into the
scene; the child wais her back at 7.2; the man nods his head to her twice
between 7 and 8.5. The dog crosses the whole lane, a rooster stands by the
house, birds pass.

**Scene 3, the pond, 31 to 40 s.** A set with the kit's hills and a tree at
the left; draw the water live every frame with `pond(..., {t, rings})` so it
moves, and give it three drops that ring it (a fish rising twice, a drop from
a leaf); two lotus clumps given the second so they stir; two fish that idle.
A maiden sits on the floor at the bank with a Siamese cat beside her, facing
her, and she wais from the fourth second. A fellow walks in from the right and
stops. A dragon flies across the sky behind everyone on a course of
`motion.js` that carries depth: it comes in over the far hills small and
faint, breathing a little flame, and sweeps nearer and bigger across the pond,
leaving past the fellow near the end; use `where()` for the head and the same
course as the dragon's trail. Birds.

**Scene 4, the temple at dusk, 40 to 49 s.** A dusk sky, the hills in dusk
colours with small trees on the middle range (read the ridge from the hills
themselves, so the trees stand on it), the temple, a yak, two tung. Keep the
temple, the yak and the tung on a clear front sheet of their own, so the
kit's elephant from `beasts.js`, at size 0.11, can walk the ridge to the
right of the temple by `amble()` behind them, from beside the temple to
beside a tree, in view the whole way. A crowd with umbrellas, a monk who walks
in from the left and wais at the eighth second, and five lanterns that rise
one after another.

**Scene 5, the night, 49 to 55 s.** A night sky with stars, eight lanterns
hanging, a crowd, a drummer who sings, a dancer with the dance hands, and a
celestial with a lotus. Then a card from 55 to 57.

**The skies.** Every set keeps its sky on a sheet of its own and its land on a
clear sheet, and every scene draws sky, then `cumulus()` drifting by the
film's clock (day, dusk or night look), then the land, so the same clouds
cross from one scene to the next.

**The words**, one list on the page: each line's seconds under the picture,
its syllables as sung one to a beat, the line as written, and its meaning;
make the kit's `CUES` from it and `SUNG` for the drummer's mouth through
`mouthAt()`. The lines: 23 to 30 s "วิถีชีวิตในหมู่บ้าน" (life in the village,
sung วิ ถี ชี วิต ใน หมู่ บ้าน); 32 to 39 "สระบัว ปลา และนก" (the lotus pond, the
fish and the birds, sung สะ บัว ปลา และ นก); 41 to 48 "โคมลอยที่วัดยามเย็น"
(lanterns at the temple at dusk, sung โคม ลอย ที่ วัด ยาม เยน); 50 to 54.5
"ฟ้อนรำกลางคืน" (a night of dancing, sung ฟ้อน รำ กลาง คืน).

**The music**, as the kit's `music.py` makes it, every sound a sine wave
added up: three seconds of silence, then a soft chord under everything and a
plucked pentatonic tune drawn beat by beat from one seeded chooser, a low drum
on every beat from the lane on, an echo, a fade at the end; and a function
that gives the tune's note on each beat.

**The song**, the way `lanna_sing.py` sings the lanna film: read `CUES` out of
the page in Chrome, have the Thai computer voice say each syllable once, sing
it with `singer.py` on the note the tune plucks on its beat for nearly a beat,
and lay the syllables on the music. If the voice refuses a syllable on its own,
ask for it twice over (syllable + ๆ) and keep the first half; if it refuses it
in every form, respell it in the sung column.

Show me stills of seconds 10, 25, 36.5, 45 and 52 before you render.
