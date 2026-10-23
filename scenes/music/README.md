# The living scenes' music

Quiet instrumental pieces for `../living_scenes.html`, one for each setting and one for the night places, made
2026-10-23 with ACE-Step 1.5 (ACE-Step, Apache-2.0: what it makes is free to use) on a DGX Spark. The owner heard two
takes of each and picked these. The files are not kept here (they are 2.4 MB each); krueng.ai serves them at
`audio/kit_sounds/music_scene_<place>.mp3`, and these files make them again.

| Page's piece | Job | Take kept (seed) |
|---|---|---|
| `music_scene_natural` | `scene_natural.json` | 102 |
| `music_scene_rural` | `scene_farm.json` | 301 (a farm take, picked for the countryside) |
| `music_scene_farm` | `scene_farm.json` | 302 |
| `music_scene_town` | `scene_town.json` | 401 |
| `music_scene_mythical` | `scene_mythical.json` | 501 |
| `music_scene_night` | `scene_night.json` | 602 |

Each job asks for 150 s of music with no vocals (`instrumental.txt` is the lyric: `[Instrumental]`), its caption
naming the northern instruments (sueng, salo, khlui flute, pin phia) and a slow, calm tempo. The AudioSet classifier
(AST) heard no singing or speech in any take: the most in any 10 s window was 0.04.

```
# in a container with ACE-Step 1.5 (github.com/ace-step/ACE-Step-1.5), this folder at /work/jobs:
cd /work/ACE-Step-1.5 && uv run python /work/jobs/sing.py /work/jobs/scene_natural.json   # -> /work/out/scene_natural/
# the page's file from a take: faded in and out so the loop does not click, one loudness for all
ffmpeg -i scene_natural_102.flac -af "afade=t=in:d=1.5,areverse,afade=t=in:d=3,areverse,loudnorm=I=-20:TP=-2:LRA=11" \
       -ar 44100 -c:a libmp3lame -b:a 128k music_scene_natural.mp3
```

`sing.py` (written for a Thai song first, so its words say "sing") runs one job: each seed's take into
`/work/out/<name>/<name>_<seed>.flac`. The seed fixes the take, so the same job and seed make the same piece.
