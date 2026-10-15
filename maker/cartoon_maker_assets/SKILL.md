---
name: lanna-cartoon
description: Make a short cartoon video on the Lanna cartoon kit from a story. Write the film as JSON, look at stills, fix, render to mp4. Use when asked for a cartoon, an animated clip, or a video of Thai village characters, creatures (naga, dragon) or set pieces.
---

# A cartoon from a story, with film.py

You write the film as data; the kit draws it. `film.py` (beside this file, or
at https://krueng.ai/cartoon_maker_assets/film.py) checks your data with the
maker page itself and turns it into a page, stills and a video. It needs
Python 3, `pip install playwright` with Chrome installed, and ffmpeg for video.

## The loop

1. `python film.py vocabulary` prints the exact names the kit knows, the JSON
   shape and the rules. Read it before writing: it is generated from the kit
   and is the only authority. Names not in it are dropped.
2. Write `film.json` in that shape: `duration`, `backdrop`, `items` (people,
   things, set pieces, each with `keys` as `[[second, x, y], ...]`), `texts`
   (a `card` fills the screen; a `subtitle` sits under the picture).
3. `python film.py stills film.json 0 3 6 9` writes one picture per second
   named into `stills/`. Look at them. Pick the seconds of your course points
   and the middle of each walk.
4. Fix the JSON and look again. The output lines "the kit warns: ..." name
   anything the kit did not understand; aim for "the kit raised no warning".
5. `python film.py render film.json out.mp4` makes the video, 1920x1080 at 30
   frames a second, in a form phones play. `--from 2 --to 8` renders a part
   while you iterate. A 20-second film takes about a minute on a laptop.

## Rules that decide whether it looks right

- The stage is 1440 wide, 1080 high. Feet stand on y 880 to 1040 (900 is
  usual). The sky is y 60 to 600. Someone lower on the stage is drawn in front.
- A course's seconds strictly increase; the first key is when and where the
  item appears. The item travels one smooth curve through its keys and passes
  the ones between without stopping; to make it wait, repeat the same x, y at
  a later second. Walking looks right at about 150 px per second; faster reads
  as running, slower as drifting.
- A `card` hides everything while it shows: put it at the start or the end.
  A `subtitle` is one short line; keep it 2 to 4 seconds.
- A second may be a word instead of a number. `"+2"` is two seconds after the
  previous thing: for a text's `from`, after the previous text ends; for its
  `to`, after its own `from`; for a key, after the item's key before. `"<"` is
  with the previous text's start, `"<+1"` a second after it. A top-level
  `"marks": {"dance": 8}` names moments, and `"dance"` or `"dance+2"` is that
  second anywhere. So a story is written as "then, meanwhile, a beat later",
  and the page turns the words into seconds when it takes the film.
- A person's key may carry a pose as a fourth entry, `[second, x, y, "wave"]`
  (walk, wave, wai, sit, sing): the person holds it from that key on, so "she
  waves when she reaches the tree" is one key. Without one, the pose before
  carries on. A fifth entry is a size, 0.5 to 2, reached by that key and grown
  along the way, so she is bigger as she comes nearer: `[second, x, y, null, 1.5]`
  keeps the pose and changes the size. A person's steps are counted from the
  ground covered, so the feet keep to the ground however fast a leg of the course
  is; so are the Mom's.
- Scenes: the film begins on `backdrop`; `"cuts": [{"at": 8, "backdrop": "river"}]`
  begins a new scene at that second, and the kit closes and opens its iris at the
  cut. A set piece's one key says which scene it stands in by its second (0 for
  the first, the cut's second for the next). A person or thing is drawn in the
  scenes its course overlaps or begins in: give it a key in each scene it is in,
  and none in a scene it is away from.
- Camera: `"camera": [[second, x, y, zoom], ...]` is what the viewer sees at that
  second: the centre of the view on the stage and how close (1 is the whole stage,
  2 twice as close, up to 3). It glides between points. Leave it out for the whole
  stage. Cards and subtitles are not zoomed.
- Any item may take `"size"`, 0.5 to 2: a person's height (1.2 is usual), and
  for a thing or a set piece the kit's own size is 1.2, so 0.6 is half of it.
  In the maker the same size is the corner handle on the stage.
- 3 to 8 items. A set piece has one key. The naga's key is its
  chest and the dragon's its head; both may fly. A dragon's key takes a fourth
  number, its depth: 0 far from the screen (small, faint, behind everyone) to
  1 near (big, in front); change it along the course and it flies toward or
  away from the viewer. The sun and the birds live at y 100 to 400. The
  lantern rises only if its course goes up. The clouds drift by themselves.
  `khom` is the hanging paper lantern of Lanna: its key is where its string is
  tied (y 60 to 500 hangs it high), it swings and turns in the breeze with its
  tail swaying; its candle is off by day and on at dusk and night, or
  `"candle": "on"` / `"off"` says; carried along a course it leans back
  against the way it goes.
- The flowers and fruits of Thailand (the vocabulary lists them: mango,
  durian, longan, orchid, marigold ...) are things that stand on the ground;
  a name ending in `Tree` (`longanTree`, `ratchaphruekTree` ...) is that tree
  in flower or fruit, a piece.
- A person may take `"sabai": true`: a shoulder cloth woven with small figures of
  the kit that walk along it as the person moves (sabai.js). It costs a moment the
  first time it is drawn, while its tiles are made.
- Colours are optional: a person's `shirt`, `legs`, `skin`; the naga's `body`,
  `belly`, `crest`, `fire`; the dragon's `body`, `spots`, `belly`, `flame`,
  `mane`, `pearl`; as `#rrggbb`.
- Thai in texts is welcome; keep each line under 40 characters.

## When a model should write the JSON for you

`python film.py write "the story" film.json --base URL --model NAME [--key KEY]`
asks any OpenAI-compatible server (OpenAI, or Ollama at
`http://127.0.0.1:11434/v1` with `qwen2.5:3b` or better) and keeps what the
page accepts. Then continue the loop at step 3.

## Giving this skill to an agent

An agent uses a skill it can find. `python film.py skill claude_code` (or
`codex`, or `opencode`) copies this file into the agent's own skills folder,
`~/.claude/skills/lanna-cartoon/` for Claude Code and `~/.agents/skills/lanna-cartoon/`
for Codex and OpenCode; keep `film.py` beside this file. In a repository, Claude
Code also reads `.claude/skills/<name>/SKILL.md`. Start the agent again and ask
it for a cartoon: it reads this file, runs the loop above, and shows you the
stills and the video. A film beyond the JSON (a camera that moves, a cloth of
woven figures) it writes by hand as a page of the kit, as `lanna_cartoon.html`
teaches, and renders with `render.py`.

## What the page is

`cartoon_maker.html` is the same maker a child uses with a mouse; `film.py`
runs it headless and calls its functions, so your JSON is checked by the same
code and rendered by the same generator. The page's own help (the ❓ button)
and `lanna_cartoon.html` explain the kit and how films are written by hand.
