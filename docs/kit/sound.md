# Sound: songs, music, sounds and voices

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## A song for the film, in code

The band and the singer are two Python files, and the film is cut to their beat, which we know
because we wrote it.

```
python village_music.py      # the band: ranat, ching, drum, low string  -> village.wav
python village_sing.py       # the words, tuned to the tune              -> village_song.wav
python render.py village.html village.mp4 --audio village_song.wav
```

- `village_music.py`: `BEAT` seconds a beat (the same number as in the film's page), five notes
  (`NOTES`), and `TUNE`, one letter for one beat, a dash for a rest.
- `village_sing.py`: `LINES` is a list of (the beat a line begins on, its syllables, a note for
  each). A Thai voice (edge-tts, `th-TH-PremwadeeNeural`, needs the internet) says each syllable
  once into `spoken/`; `librosa.pyin` finds the pitch it was said at; `pitch_shift` moves it to the
  note and `time_stretch` makes it 95% of a beat. Give each syllable the note the tune has on that
  beat, and start each scene on a beat just before its line.
- **One list for the song: the cue sheet** (2026-10-13). `village.html` holds the song three times:
  `LINES` in the Python for the voice, the same lines in the page for the mouths, and `WORDS` in
  seconds for the words under the picture, each second worked out by hand from a beat. Three lists
  can drift apart and nothing says so. `lanna.html` now holds it once:

  ```js
  var CUES = [
    // the beat a line starts on, its syllables (one a beat), the line as written, what it means
    [8, "เพื่อน สาม คน มา หา ที่ บ้าน", "เพื่อนสามคน มาหาที่บ้าน", "Three friends come to the house"],
    [110, "สะ หนุก จัง สะ หนุก จัง", "สนุกจัง สนุกจัง", "What fun, what fun"]
  ];
  var SUNG = sungBeats(CUES);                       // the mouths
  function draw(t) { film(t, SCENES); words(t, CUES); }   // the words under the picture
  ```

  The syllables are spelt as they are sung (`สะ หนุก`) and the written line as it is read (`สนุก`),
  which is why a row has both. `lanna_sing.py` has no list of its own: `cues_of("lanna.html")` opens
  the page in Chrome with no window, as `render.py` does, and asks it for `CUES`. A scene asks
  `cueAt(t, CUES)` which line is being sung (`{line, since, beats}`), so that what people do can
  follow the song and not a number of seconds; the lane of `lanna.html` picks its game this way
  (see 23 under "The model on its own"). Measured when `lanna.html` was moved onto it: the
  list the singer reads is the old `LINES`, row for row; forty frames spread over the film are the
  same as before; the only change is how long a line's words stay. By hand they stayed 3.6, 3.2 and
  2.8 s for lines of seven, six and five syllables; by the rule they stay 3.75, 3.25 and 2.75 s.
  `kit_check.py` reads a page's `CUES` and `SCENES` and fails a line that a change of scene cuts,
  or that is still being sung when the next begins.
- What to expect: a tuned computer voice. A recogniser hearing the finished song got some lines
  right ("แก้วเป็นสีทอง เจอแล้ว เจอแล้ว") and others wrong ("โคมลอย" as "ความร้าย"). Short open
  syllables survive best; syllables with a falling or rising tone lose it, because every syllable
  is flattened onto one note.
- **A better voice: `singer.py`** (2026-10-12; the owner asked for a better singing voice, and
  the session that builds the paperdolls wrote it). The same spoken syllable is taken apart with
  the WORLD vocoder (`pyworld`) and put together again on the note, where `pitch_shift` moved
  the mouth's shape with the pitch and `time_stretch` stretched the consonant as much as the
  vowel. The consonant keeps its own speed and only the vowel is stretched to fill the beat, and
  a share of the syllable's own Thai tone is kept. The owner heard two versions. Of the first
  (a scoop onto each note, a vibrato of a quarter of a semitone): "Switch". Then the owner asked
  that session for public singing to model, and three old Thai recordings gave the second
  manner: a note held nearly straight (a vibrato of an eighth of a semitone at 6 Hz), slid into
  from the note before it over 90 ms, and a fall as it is let go. Of that one: "It sounded good
  to me", and it was chosen for the film. `lanna_sing.py` uses it: `sung(syllable, frequency,
  before)` is one line, `sing(spoken(syllable), frequency, BEAT * 0.95, glide_from=before)`, on
  the same beats, so the mouths in `lanna.html` did not change. The song it writes was compared
  with the file the owner heard: the same, sample for sample.
  `village_sing.py` still tunes the old way. `sing_check.py` sings every line both ways, hears
  each with a recogniser (faster-whisper, medium) and measures each syllable's pitch against
  its note; `sing_check_output.txt` is its run on the chosen voice: 41% of the characters heard
  wrong in the old voice and 23% in the new; the pitch 46 cents off the note on average in the
  old voice and 33 in the new, which slides and falls on purpose, so that number now mostly
  measures the slides. The first version, by that session's earlier run, gave 21% and 10 cents.
  A bug found on the way, and mended without moving the sound: in `sing()` a local variable
  named `release` hid the argument of that name, so every voiced syllable got the fall meant
  for the last of a line. That was in the song the owner heard and chose, so the argument was
  made to say what the code did: `release` is true unless told, and every syllable falls. The
  song written after the mend is still the chosen one, sample for sample.
- A music model is the other way. ACE-Step (`spark/acestep_hf_space.py`) sang six English lines
  well on its second seed; the film was then cut to the song, with `faster_whisper` word
  timestamps giving the second each line began. **It could not sing Thai:** three takes, and the
  recogniser found none of our words in any of them.

## The hero film's sound (2026-10-16)

The owner asked for a better-quality sound for the hero film (`sash.html`) and said "it's good" of this one;
it went live the same day, muxed onto the film's picture unchanged. What was wrong, measured on the old
`sash_voice.wav`: the music was sine waves added up (99% of its energy under 1 kHz, nothing above 3 kHz),
the voice (Meta's MMS Northern Thai, as the Kam Mueang Voice extension speaks it) is made at 16 kHz and had
nothing above 8 kHz, and the mix was mono at -17.5 LUFS. The tune, the spoken lines and their seconds did not
change; how they sound did (`sash_music.py`, `sash_narrate.py`):

| | Before | Now |
|---|---|---|
| The tune | a sine and its octave, dying away | a plucked string (Karplus-Strong: noise going round a delay line that averages as it goes), on two strings 6 cents apart, as a sueng's paired strings |
| The chord | sine waves swelling | a soft bowed tone: eight overtones (1/n^1.6), a 4.8 Hz vibrato, left and right a little apart |
| The drum | a sine falling in pitch | the same body with a second mode, and a skin (noise under 1.4 kHz) |
| New | | a small ching on the strong beats of the dance (inharmonic partials from 3.15 to 11.2 kHz) |
| Space | an echo | the echo bounced between the ears, and a room (noise dying over 1.4 s, darker as it dies) at 0.22; stereo |
| The voice | resampled, peak-normalised | soxr to 44.1 kHz; `VOICE_CHAIN` (ffmpeg: highpass 75 Hz, -2.5 dB at 260 Hz, +3 dB at 3.2 kHz, `aexciter` from 6 kHz, compression 3:1); a touch of the same room |
| The mix | mono, -17.5 LUFS, peaks at -0.5 dB | -14 LUFS, true peaks under -1 dBTP (`loudnorm`, measured, then applied linearly); stereo, 24-bit |

Measured on the voice track, the level of each band against the whole: 3 to 6 kHz -28.6 dB before, -22.6 now;
8 to 12 kHz -59.8, -43.4; 12 to 16 kHz -74.0, -56.9. The music now has 1.66% of its energy between 3 and 8 kHz
(none before). The voice stays MMS's (CC BY-NC 4.0): treat it, never replace it here.

```
python sash_music.py                                        # sash.wav: stereo, 32-bit float
python sash_narrate.py <the extension's model folder> --takes 4   # sash_voice.wav: -14 LUFS, stereo, 24-bit
python scenes.py sash.html sash.mp4 --audio sash_voice.wav  # or mux it onto a film: ffmpeg -c:v copy -c:a aac -b:a 256k
```

Needs soundfile, soxr and scipy besides numpy, and an ffmpeg with `aexciter` and `loudnorm`. The live film's
sound is these two scripts' output, sample for sample (the largest difference from the file that went live is
1.2e-7, rounding). `music.py` and `village_music.py` are unchanged: still sine waves.

## The kit's sounds: voices made from outlines (2026-10-19)

The kit's creatures have voices, and none of them was recorded. `howl.py` makes a voice from an outline of
numbers: how its pitch goes over time, how loud, how open its mouth is (from "oo" to "ah"), how much growl and
breath are in it, how big its throat is, and how long a cave's echo rings after it. Underneath, each part is a
plain rule: a train of pulses that glides along the pitch is the voice; a pulse train at half the pitch,
beating against it, is the growl; noise is the breath; three resonances that move between the "oo" and the
"ah" are the mouth; noise dying away, darker as it dies, is the cave. An outline of `{"voices": [...]}` mixes
several, each from its own second at its own loudness, under the one echo.

`sounds.py` is the library: every sound the kit has, by name, with what it is for. The first are the creature
with four ears and five eyes, in the moods its story asks of it. The owner asked that "the pack and voice
should be one thing", so its voice is one voice of many throats: its own low, rough howl, and four higher,
smoother voices inside it (1.5 to 2.67 times its pitch, each a few hundredths of a second late, each wavering at
its own rate) that follow its rise and fall, so that they sound as one wild voice and not as wolves answering.

| Sound | For | What it does |
|---|---|---|
| `maeng-base` | the night on the mountain | rises, holds high, falls away into the cave (6.9 s) |
| `maeng-angry` | caught in the snare | three short roars, the last the biggest, rough all through (4.2 s) |
| `maeng-afraid` | the crowd round its pen | high yelps that break upward, then a thin, wavering cry (4.5 s) |
| `maeng-sad` | alone in the pen at night | a slow howl that falls, catching like a sob (7.9 s) |
| `maeng-happy` | eating the embers | quick bouncing howls that rise at the end, no growl (3.3 s) |
| `maeng-home` | running home into its cave | one long howl that starts low and lifts, its throats swelling (8.9 s) |

```
python sounds.py                    # every sound into out/sounds/ (NAME.wav, NAME.json), all.wav, list.js
python sounds.py maeng-sad          # one
python sounds.py --list             # the names, and what each is for
python checks/sound_check.py        # each is made, as long as its outline, loud enough, not clipped, not like another
```

Then `sounds.html` plays each one beside what it is for. The sounds are made, not kept: `out/` and `*.wav`
stay out of the repository, and anyone makes the same sounds from the same numbers. A new sound is a new
function in `sounds.py` and a row in `SOUNDS`. A sound is never cut from someone else's recording: the owner
once asked for a howl sampled from a feature film, and the kit made its own instead. Needs numpy and scipy.

## The picture's own sounds: a rooster's crow (2026-10-22)

A rooster that forages (`roosterPeck()`, creatures.md) crows between its bouts when its turn comes, at seconds
nobody writes down; the owner, 2026-10-22: "add a crow sound". So the kit notes a sound where the picture makes
it: `rooster()` tells each crow it begins, from when its beak opens (`hear()`), and `heard(from, to)` draws a
film's frames and gives back the calls, `[[second, sound, loudness], ...]`, in the form a scene writes its own
(decorate.js `calls`). The second is when the sound's file starts: `HEARD_SOUNDS` holds each sound's loudness (the
crow 0.28, as the tale's scenes call it) and its lead, the seconds of its file before the voice begins (the crow's
recording has 1.2 s of the forest before the bird). A caller is heard again only 3.6 s after its last call
(`HEARD_GAP`: a crow rings that long), so a rooster that crows on every second beat is heard once a crow's length;
another, 150 or more along the film (`HEARD_NEAR`), crows for itself.

- **`render.py` lays them under the film it renders**, from the same look that finds what blinks out (no frame
  drawn twice): over `--audio`'s sound or over silence, as loud as each is called and not turned down by how many
  there are (ffmpeg `amix`, `normalize=0`); a sound not made yet is made by `sounds.py`, and one that cannot be is
  told and left out. So the hero film (`scenes.py`), any page and the maker's films (`film.py render`) have their
  roosters' crows. Measured on `chickens.html`: each crow's sound rises within a quarter second of its beak opening.
- **`heard.py PAGE`** prints a page's calls (`--json` writes them) for a film whose sound is put together elsewhere:
  the tale's (`maeng/feelings.py --film` lays the scenes' own calls). `maeng/s02.html`'s yard rooster: 7.7, 15.19
  and 21.75 s.
- **The crow is CC BY**: Wich'yanan L.'s red junglefowl (iNaturalist; `sounds.py` FETCHED). A film that has it names
  its maker in its credits: the tale's do (`s15_credits.js`), and so the film the hero film opens.

## Music that follows the story's feelings (2026-10-19)

The owner: "Plot each scene musically against the emotion of each sentence and make sure the music always
reflects the emotion of the sentence. Start from the hero video for lanna_cartoon's music." `score.py`
does it for any film: it takes cues (a second and a feeling's name, each until the next) and makes music
that turns with them. It begins to turn 0.6 s before each cue and has turned 0.9 s after it; the two
feelings' music cross in that one window and nowhere else. The sound is the hero film's: `sash_music.py`'s
plucked sueng strings, bowed chords, drum, ching, echo and room, imported from there, not copied. "Calm" is
that film's own: its pentatonic tune on A, and its A minor and C chords.

Each feeling is a recipe, `FEELINGS` in `score.py`. The recipe sets its notes, how high its tune lies, how
often a string is plucked and whether the line climbs or falls, how long a note rings, its chords, its drum
and ching, and how loud it is:

| Feeling | Notes | How it goes |
|---|---|---|
| calm, tender, sleepy | A C D E G (the hero film's) | calm: the hero film's plucks; tender: higher, sparser, the chords warmer; sleepy: a note every other beat, quiet |
| wonder | A B C# E F# | two plucks a beat, high, climbing, ringing long |
| mystery | A B C# D# F (whole tones) | low and sparse, ringing long |
| comic, bustle | G A B D E | short, quick notes on a drum; bustle steadier, as hammers |
| joy, hope, triumph | G A B D E | joy: the hero film's dance (drum, ching); hope: climbing, a soft drum; triumph: all of it, and a low gong on the bar |
| royal | D E F# A B | stately, a note a beat, a slow drum |
| sad, grief | D F G A C | a note every other beat, falling, the chords held; grief lower, slower, softer |
| tense, fear | A Bb D E | quick soft repeated notes over a heartbeat drum; fear higher and faster |

Each set of feelings has notes of its own, and every one of its chords holds them (`CHORDS`). Sadness has its
F (the minor third), gladness its B, the royal its F#, wonder its C#, the mystery its whole tones (C#, D#, F), dread
its B flat against the A. That is what makes the music say its feeling. It is also what lets a check hear it.
`checks/score_check.py` listens to the music under every line, not to the cue sheet. It takes the stretch
where only that line's feeling sounds and scores each note the way an ear picks one out: the note itself and
its overtones together. So a bowed G's fifth overtone is not heard as a B, a drum's falling body is not
heard as notes, and an F is not heard because the A's played are its fifth. Then it finds which set holds the
music: its notes must hold the energy, and each of its notes that does not sound counts against it. That set
must be the line's feeling's. The check also draws the plot (`out/maeng_music/plot.html`): every sentence of
every scene as a block in its feeling's colour, under it the notes the music was heard in, and the music's
loudness and how many notes begin a second, along the time.

The film of the creature has its sentences' feelings in `maeng/feelings.py` (`FEEL`: each line's, from what
the sentence says). It takes the lines' seconds from the scene files themselves (`SNN_LINES`), so each scene's
music is made as the scene is, on its own:

```
python maeng/feelings.py            # every scene's music: out/maeng_music/sNN.wav and cues.json
python maeng/feelings.py 4          # one scene's, after a change to it
python checks/score_check.py        # is every line's music in its feeling's notes; the plot
```

What the check found while it was built, each fixed in the music and not in the check: the next feeling came
in a second and a half too early, so two feelings sounded together for three seconds; a feeling's chord only
began to swell as the feeling began, so its first seconds were nearly all strings (now a chord is already
sounding as each feeling comes in); and the chords, stacked from every other note of a set, could leave out
the set's own note: sadness without its F sounded like calm. And two sets shared a chord: an A minor chord is
in both the calm notes and the first mystery notes (A B C E F), so tender music resting on it was heard as
mystery; the mystery's notes are now whole tones, which share only the A with the calm.

## A voice and its subtitles, aligned (2026-10-19, evening)

The owner, hearing the tale: "It's a man's voice", "The sentences spoken are running over each other a bit", "Make
sure subtitles and voice are aligned". What it took, for any film narrated with lines spoken elsewhere:

- **The voice is told whose voice it is.** A voice model given only text draws a voice anew for each sentence;
  the tale's narrator follows one of the speaker's own takes (the voice project's fix), and every line is
  measured before it is used: pitch in her range, likeness to her recordings, heard back by a listener.
- **A take is placed by its sound, not its file.** Takes began with up to 1.5 s of quiet, which pushed a line into
  the next; each kept take is trimmed to its first and last sound (35 dB under its loudest, 30 ms kept), and its
  length is measured the same way, so a soft ending counts.
- **0.6 s of quiet between lines**, and **a subtitle from her first sound to 0.4 s after her last.** Where a voice
  needs more room, the lines after it move later into the scene's slack, with what the scene ties to them (a mouth
  that moves while someone speaks gets the voice's own window), and the scene is rendered again: the subtitles are
  drawn into its picture. The narrator (sash_narrate.py) then reports any line still longer than its subtitle.
- **A film too short for its voice is held longer, not its voice sped up.** The hero film, told in her voice,
  needed 84 s of its 82: `SLOW` in sash.html plays its picture 15% slower on its own clock and its words on the
  real one, given for one render (`render.py --set SLOW=1.15 --set LENGTH=94.3 --set WORDS=@words.json`, and the
  narrator takes the same `--set`), its music slowed with its pitch kept; the page as it is, and its video, stay.
- **The joined film's peaks are held** under -2 dB at four times the rate (chain.py): the AAC encode overshot to
  +0.5 dBTP.

## The story told in Kam Mueang (2026-10-16)

The owner: "When you render the video can you use the kam muang Chrome plugin for the audio to tell the
history of Lanna instead of using the song lyrics? Use notebooklm notebooks on kam muang and create
another on Lanna history to get the text." Asked, they chose to replace the song in the hero film, Kam
Mueang with its English under the picture, and the film's music softly under the voice. Then: "Remove
the title screen from the end of the video"; "Make the words relevant to the cartoon. Like it was for
little kids. In ancient times, life moved more slowly..."; "Then go on explaining the special artifacts
that are uniquely Lanna. Mention that the dragon is actually Chinese just before the man looks up at the
dragon. Have a people's republic of China flag appear in the dragon's claw for a moment and wave back and
forth a few times and then disappear. You may have to extend the scene a bit"; "no facts about china
just a joke about the dragon"; "You can give a fact about Chinese dragon's though".

| What | How it is made |
|---|---|
| The facts | A NotebookLM notebook, "History of Lanna: narration for the Lanna cartoon hero film", of Wikipedia on the Lanna Kingdom (English and Thai), Mangrai, Tilokaraj, Kawila, Chiang Mai, the Burmese–Siamese wars, Bo Sang, Yi Peng, the Chinese dragon, สไบ (the sabai), ตุง (the tung), โคมลอย (khom loi) and เกวียน (the kwian). Thai Wikipedia has no page for the kalae, the Lanna lantern, the water jar at the gate or the great drum (each 404), so the words say nothing of them. Every fact in a line has its citation; a line that only says what is on screen needs none. The joke's fact is the Chinese dragon's: "Many pictures of Chinese dragons show a flaming pearl under their chin or in their claws." |
| The Kam Mueang | A second notebook, "Northern Thai (Kam Mueang): models and language resources, 2026", asked to put each line in Chiang Mai Kam Mueang and name each dialect word's source (`pythainlp/lanna_dict`, the Charatrit KamMuang-Thai-English pairs, a guide to speaking Lanna). Three lines mended by hand: the parasols are Bo Sang's kind, not spun at Bo Sang; "a million fields" without ทุ่งนก ("fields of birds"); ถือ (hold) for คาบ (hold in the mouth). No native speaker has checked it. |
| The voice | The Kam Mueang Voice extension's own model, Meta's MMS Northern Thai (CC BY-NC 4.0) at full precision, run by transformers.js 4.3.1 in Node as the extension runs it: `say.mjs`. It says about 12 to 13 Thai characters a second. It drops ๆ (จ๊าๆ came out as one จ๊า, 1.8 s for the first line), so each line in `WORDS` has a spoken form with the word said twice beside its written one. |
| Takes | The voice draws its timing from noise, so a line is never said the same way twice. `sash_narrate.py --takes 4` speaks each line four times and keeps the take that faster-whisper (medium, Thai) hears closest to its words. Kept takes: 0.59 to 0.93 of the letters heard back, mean 0.78; one take a line had given 0.47 to 0.96, mean 0.74. The recogniser knows Central Thai, so these numbers are a floor for the dialect words, not a grade. |
| The mix | `sash_music.py` makes 152 beats now (79 s of notes; the first 132 are the beats they were). The music plays at 0.7 of its level, goes down to 0.3 of that over 0.35 s before each line and comes back after it; the voice's peak is 0.9; the music fades over the film's last two seconds (the end card had hidden that `render.py` stops the sound at the last frame). Every line ends before its words leave the screen, which the script prints line by line. |
| The film | 79 s, with no end card: the cloth 0–22, the lane 22–35, the pond 35–50, the rice fields 50–70, the dance 70–79. The pond's dragon is the Chinese kind; its course and the look-up come five seconds later in the scene than before, so the voice says "this dragon came from China" (39.8 s) before the two at the pond look up (43 s). The maiden wais from the scene's first second, as the voice says she greets us. The drummer no longer mouths a song. |
| The flag | `dragon()` now gives back `{claw, size}`: its near front foot in the points of the frame it was drawn in, and its size. `chinaFlag()` in `sash.html` draws the flag of the People's Republic of China as its law sets it out (3:2, red, the large star at (5, 5) of a 30 by 20 grid, the four small ones each pointing a tip at it), on a pole in that claw, from 8.8 to 11.6 s of the pond scene: it grows out of the claw, rocks back and forth three times as the cloth ripples, and shrinks away. The pole leans 0.4 forward, so the cloth flies above the head (0.7 and 1.0, drawn side by side, made the flag read as falling); 2.6 times the dragon's size; nearly opaque even far off, or the body showed through it. The dragon's pearl was gone while it held the flag, the joke of line 10, "Chinese dragons usually hold a pearl, not a flag!"; since the owner's "change the dragon so the white thing isn't coming out of its mouth" (2026-10-16) it has no flaming pearl before its snout at all (`chase: false`), and the line still says what such dragons usually hold |
| The tung by the house | Drawn live, not on the village set, by `villageTung(T)` in the cloth and lane scenes, on the film's clock so the sway goes on across the cut: the kit's `tung()` with the hong, its cloth in the shape it had on the set (the kit's wave at 0), leaning `TUNG_SWAY` either way about the pole's foot (owner, 2026-10-16: "the flag with the rooster on the top sways a little bit"). The kit's own wave was tried first: its six panels each wave on their own and came apart, and at its size it flapped rather than swayed | 1.2 degrees either way, `sin(T * 1.3)`: about 10 px at the hong, once in 4.8 s |
| The checks | `kit_check.py sash.html dragon.html dragon_china.html dragon_flight.html`: 4 pages, 0 failures; the 17 lines each inside one scene; the wai whose first frame folds an arm is at 36.0 s now (the pond's maiden, a second into the scene), so the allowance names it there. `kit_check.py`'s cue check takes a cue's own end, as its fifth entry, for a spoken line. `dragon.html`, `dragon_china.html` and `dragon_flight.html` drawn with the old and the new `dragon.js`: 0, 2 and 3 frames of 12 differ, by 1 to 3 pixels, the kit's own spread from one load to the next. |
