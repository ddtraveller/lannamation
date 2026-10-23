# Lannamation

Cartoons of Lanna, the old north of Thailand, drawn by JavaScript in the manner of a 1930s
cartoon. Every frame is code. A film is a web page with a `draw(t)` function, and the kit draws
the people, the creatures, the places and the old-film lens for it. No model draws anything, so a
film can be written by hand, made by a program or written by an AI agent, and it draws the same
every time.

![Six moments of the hero film, every one drawn by the kit, with its Kam Mueang words and their English underneath: a row of the woven sabai close up, the sabai as the camera pulls back, a village lane with its tung banner, a Chinese dragon waving a flag over the lotus pond, three women spinning the rain off their paper parasols, and a night of dancing as the khom loi rise](docs/stills.jpg)

- The hero film: [krueng.ai/video/lanna_sash.mp4](https://krueng.ai/video/lanna_sash.mp4)
- How the kit was built, and how to make your own: [krueng.ai/lanna_cartoon.html](https://krueng.ai/lanna_cartoon.html)
- The method, `draw(t)` + Chrome + ffmpeg: [krueng.ai/js_animation.html](https://krueng.ai/js_animation.html)
- The cartoon maker, in your browser: [krueng.ai/cartoon_maker.html](https://krueng.ai/cartoon_maker.html)

## Three ways to use it

| You want | You write | You get | Read |
|---|---|---|---|
| an AI agent to make a video | a story, in words | stills to check, then an mp4 | [By AI](#by-ai) |
| a cartoon in a web page, like the cartoon maker | a page that keeps a film as data | a cartoon that plays, scrubs and records in the browser | [In a web page](#in-a-web-page) |
| films from a program | a film page, or a film as JSON | stills, an mp4, a batch of films | [In a script](#in-a-script) |

All three rest on one thing, [a film page](#a-film-is-a-page).

## Set up

```
git clone https://github.com/ddtraveller/lannamation
cd lannamation
pip install -r requirements.txt
```

- **Python 3.** `requirements.txt` draws, renders and checks. Two more, each only for what it says:
  `pip install -r requirements-sound.txt` for the sounds, the music and the songs, and
  `pip install -r requirements-dance.txt` for the dance track.
- **Google Chrome.** The scripts start it by name (`channel="chrome"`), with no window.
- **ffmpeg** on the path, for video.
- **For the hero film's narration only:** PyTorch and transformers for its voice (`sash_narrate.py --voice
  assistant`: Meta's MMS Northern Thai as the Kam Mueang assistant speaks it; the model comes from Hugging
  Face the first time). Or, for the Kam Mueang Voice extension's voice: Node.js, `npm install` in `kit/`
  (transformers.js, pinned in `kit/package.json`), and the folder `model/` of the extension, in
  [krueng.ai/downloads/kammuang_voice_chrome.zip](https://krueng.ai/downloads/kammuang_voice_chrome.zip).

A film page plays when you open it in a browser. The cartoon maker wants to be served:
`python -m http.server 8000` in the repository, then
[127.0.0.1:8000/maker/cartoon_maker.html](http://127.0.0.1:8000/maker/cartoon_maker.html).

## A film is a page

A page is a film of the kit when it:

1. has `<canvas id="stage" width="1920" height="1080">`, then loads `oldcartoon.js`, then any modules;
2. sets `var DURATION` (seconds; `render.py` reads it) and `var BEAT` (seconds of one beat: the kit
   times steps, blinks and hops by it);
3. writes its scenes as functions of their own clock, listed as `var SCENES = [[from, to, scene], ...]`;
4. has `function draw(t) { film(t, SCENES); }`, which draws second `t` from nothing;
5. plays itself by the clock unless `rendering` is set, which `render.py` sets before it asks for
   each frame itself.

Save this as `kit/my_film.html`, beside the kit, and open it:

```html
<!doctype html>
<html><head><meta charset="utf-8"><title>my film</title>
<style>html, body { margin: 0; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; object-fit: contain; }</style></head>
<body>
<canvas id="stage" width="1920" height="1080"></canvas>
<script>window.FILM_STYLE = {hop: false};   // people walk evenly, with no 1930s hop</script>
<script src="oldcartoon.js"></script>
<script src="motion.js"></script>
<script src="backdrops.js"></script>
<script>
var DURATION = 10;
var BEAT = 0.5;

// A course: [second, x, y] points; she waits at 600 from 4 to 6 seconds.
var GIRL = [[0, 1250, 960], [4, 600, 950], [6, 600, 950], [10, 150, 965]];

function sceneField(t) {
  pen.drawImage(backdrop("paddy"), 0, 0);
  var walk = stroll(t, 200, 1000, 1, cast("farmer", {size: 1.2}));
  person(walk.x, GROUND, walk.look);
  var p = where(GIRL, t);
  person(p[0], p[1], cast("girl", {face: p[3], step: p[2] ? p[6] / 112 : 0}));
}

var SCENES = [[0, DURATION, sceneField]];
function draw(t) {
  film(t, SCENES);
  if (t > 5) { subtitle("ไปนากัน", "Off to the fields"); }
}

var rendering = false;   // render.py sets this, then draws each frame itself
function play(now) { if (!rendering) { draw((now / 1000) % DURATION); } requestAnimationFrame(play); }
requestAnimationFrame(play);
</script></body></html>
```

A farmer walks across the rice fields from the first second, and a girl comes the other way, waits,
and goes on; after five seconds a line of words sits under the picture.

### What a film calls

| Call | From | What it does |
|---|---|---|
| `person(x, y, look)` | `oldcartoon.js` | draws a person standing at (x, y); gives back where the joints were drawn |
| `cast(name, changes)` | `oldcartoon.js` | a look from `CAST`: `lady`, `fellow`, `child`, `boy`, `girl`, `farmer`, `noble`, `maiden`, `weaver`, `elder`, `grandmother`, `dancer`, six with faces of the north (`inta`, `khammun`, `buakham`, `sinuan`, `bunma`, `dokkham`) and seven more |
| `stroll(t, from, to, start, look)` | `oldcartoon.js` | an even walk, feet planted: gives back `{x, look, arrives}` |
| `where(keys, t)` | `motion.js` | a smooth course through `[second, x, y]` keys: `[x, y, moving, facing, depth, angle, distance, reached, speed]` |
| `backdrop(name)` | `backdrops.js` | one of nineteen painted places (`paddy`, `river`, `doi`, `village`, `market`, `yipeng` ...), painted once; `backdrop(name, true)` leaves out what hangs in it (the market's lanterns, the monastery's flags), which `backdropSway(name, t)` then draws swaying |
| `film(t, scenes)` | `oldcartoon.js` | finds the scene, closes and opens the iris at the cuts, puts the picture through the lens |
| `card(big, small)`, `subtitle(big, small)` | `oldcartoon.js` | a title card; words under the picture |
| `bubble(at, words, how)` | `oldcartoon.js` | words a person says (`kind: "say"`) or thinks (`"think"`) in a bubble over their head: `at` is what `person()` gave back in this frame, or an `[x, y]`; `words` a line or `[big, small]`; it leans the way they face, keeps inside the picture, pops in (`age`), and neither hops nor rocks with them |
| `hills`, `house`, `temple`, `tree`, `palm`, `pond`, `lotusClump` ... | `oldcartoon.js` | painters for a set, drawn once on a sheet of your own |

A look is a plain object of names (`size`, `face`, `feel`, `wave`, `wai`, `parasol` ...): 94 of
them, each shown on `kit/looks.html`. `feel` is how the person feels: `"neutral"`, `"happy"`, `"laughing"`, `"sad"`,
`"concerned"`, `"angry"`, `"sleepy"`, `"satiated"` or `"surprised"`; it sets the face and how the body
is carried; a laughing person laughs in bursts, and a sleepy one nods and yawns by themselves
(`kit/feelings.html` shows all nine). The dog, the rooster, the Naga, the dragons, the Mom, the Luang,
the beasts, the birds of the north, the Hatsadiling and the 1930s sun take `feel` too: eyes, brows, a
mouth, a jaw or a bill, and how they carry the head, the ears, the trunk and the tail
(`kit/creatures.html`). A name the kit does not know is reported once in `WARNINGS`,
with the nearest name it does know, and `render.py` and `stills.py` print it.

## In a script

From `kit/`:

```
python stills.py my_film.html sheet.jpg 1 4 5.5 8      # single frames on one sheet: look before you render
python render.py my_film.html my_film.mp4              # the film, 1920 x 1080 at 30 frames a second
python render.py my_film.html part.mp4 --from 4 --to 8 # a part of it
python render.py lanna.html lanna.mp4 --audio lanna_song.wav
python sash_music.py                                   # the hero film's music, sash.wav
python sash_narrate.py --voice assistant --takes 4 --fit   # its story in Kam Mueang over it, sash_voice.wav
python render.py sash.html sash.mp4 --audio sash_voice.wav
python scenes.py sash.html sash.mp4 --audio sash_voice.wav            # the same film, scene by scene, then joined
python scenes.py sash.html sash.mp4 --audio sash_voice.wav --scene 3  # after a change to scene 3: only it again
python sounds.py                                       # the creatures' voices, made from outlines (out/sounds/); sounds.html plays them
python maeng/feelings.py                               # music that turns with each line's feeling (score.py), scene by scene
python checks/score_check.py                           # is each line's music in its feeling's notes; plot.html
python checks/kit_check.py my_film.html --quick        # does the page draw, and draw right
python checks/seek_check.py                            # no clock read, and every scene come back to the same
python checks/snapshot.py save                         # key stills of every film scene, before a kit change; compare after
python checks/ghost.py maeng/s04.html g.png --from 2 --to 33   # how things move: ghosts, and each animal's course
```

`render.py` opens the page in Chrome with no window, calls `draw(t)` for every frame, and hands the
pictures to ffmpeg in a form phones play.

`scenes.py` renders a film whose page lists its `SCENES` one scene at a time, each into a video
of its own in a folder beside the page (`sash_scenes/` for `sash.html`), and joins them, with the
sound laid over the whole film at once: the scenes are not encoded a second time, and the sound
has no seam. A scene whose video is there is not rendered again, so after a change to one scene,
`--scene N` renders that scene alone and the film is joined from it and the scenes made before:
minutes, where the whole of `sash.html` takes about half an hour. Which scenes a change touches is
for you to say: a change to the kit, or to a set that two scenes share, can touch several, and
`--all` renders them all again. `--list` shows each scene's video, and which were made before the
page or a script file it loads last changed.

To do something else with the frames, drive the page yourself:

```python
from pathlib import Path

from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(channel="chrome")
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto(Path("my_film.html").resolve().as_uri())
    page.evaluate("rendering = true")              # stop the page's own clock
    for second in [1, 4, 8]:
        page.evaluate("draw(%f)" % second)         # draw that second from nothing
        page.screenshot(path="frame_%g.png" % second)
    print(page.evaluate("WARNINGS"))               # look names the kit did not know
    browser.close()
```

Any second can be drawn on its own. What hangs and swings (earrings, cloth, a lantern's tail) moves
on springs from frame to frame, so when the clock jumps the kit first plays the frames before it
(`settled()`), and a jumped frame matches the film to a few pixels. So a film can be rendered in
parts, on several machines.

To make many films from data, write each as JSON and let `film.py` (below) turn it into a page and
a video: `python maker/cartoon_maker_assets/film.py render film.json film.mp4`.

## In a web page

### The cartoon maker

`maker/cartoon_maker.html` is a cartoon maker for children, in Thai and English: drag people,
creatures, things and places onto the stage, chart each one's course through time, give each person
a feeling, put their words in speech and thought bubbles, add titles and
words under the picture, cut between scenes, move a camera, let a model write a film from a story,
look at the code, and record a video. Serve the repository (see [Set up](#set-up)) and open it, or
use it at [krueng.ai/cartoon_maker.html](https://krueng.ai/cartoon_maker.html). Its 🧒 guide takes a
child through a scene a step at a time (a background, then what stands in it, plants, animals and
people, each placed with a tap anywhere in the picture; then each person's walk, how they feel at the
start and when they get there, and their words; then the scene plays), with skip and skip all at every step, and ends on a choice: change it, make the video,
or save it. 💾 saves the film as JSON at any time, the same data `film.py` renders.

How it works, which is also how to build your own:

- the film is data, one object called `movie`: its length, backdrop, the items with their courses
  (`keys: [[second, x, y], ...]`), the texts;
- `filmCode()` writes that data as the kit's JavaScript, and the stage runs that very code
  (`new Function`), so the code it shows is the film it plays;
- the export is a whole film page (`pageCode()`) that loads the kit from krueng.ai, so `render.py`
  can render it;
- the video button records the canvas with the browser's `MediaRecorder`.

### A page of your own

The smallest page of this kind: a film kept as data, drawn every frame from it, with play, a time
slider and a record button that saves a `.webm`. Save it as `kit/live.html`:

```html
<!doctype html>
<html><head><meta charset="utf-8"><title>live cartoon</title>
<style>body { margin: 0; background: #111; color: #eee; font: 16px sans-serif; }
canvas { display: block; width: 100%; max-width: 960px; margin: auto; }
.bar { display: flex; gap: 8px; max-width: 960px; margin: 8px auto; }
.bar input { flex: 1; }</style></head>
<body>
<canvas id="stage" width="1920" height="1080"></canvas>
<div class="bar">
  <button id="playBtn">pause</button>
  <input id="scrub" type="range" min="0" max="10" step="0.01" value="0">
  <button id="recBtn">record</button>
</div>
<script>window.FILM_STYLE = {hop: false};</script>
<script src="oldcartoon.js"></script>
<script src="motion.js"></script>
<script src="backdrops.js"></script>
<script>
// The film as data, as cartoon_maker.html keeps it. Change it, and the next frame shows it.
var movie = {
  duration: 10,
  backdrop: "river",
  people: [
    {cast: "girl", keys: [[0, 200, 960], [5, 800, 940], [10, 1250, 960]]},
    {cast: "elder", keys: [[2, 1300, 930], [8, 900, 935]]}
  ]
};

function sceneMovie(t) {
  pen.drawImage(backdrop(movie.backdrop), 0, 0);
  var who = movie.people.map(function (one) {
    return {one: one, p: where(one.keys, t)};
  });
  who.sort(function (a, b) { return a.p[1] - b.p[1]; });   // lower on the stage = nearer = drawn last
  who.forEach(function (w) {
    var p = w.p;
    person(p[0], p[1], cast(w.one.cast, {face: p[3], step: p[2] ? p[6] / 112 : 0}));
  });
}

var BEAT = 0.5;                  // the kit times steps and blinks by the beat
var DURATION = movie.duration;   // render.py reads it

function draw(t) { film(t, [[0, movie.duration, sceneMovie]]); }

var playBtn = document.getElementById("playBtn");
var scrub = document.getElementById("scrub");
var recBtn = document.getElementById("recBtn");
var time = 0, playing = true, last = null;

function tick(now) {
  if (playing && last !== null) { time = (time + (now - last) / 1000) % movie.duration; }
  last = now;
  scrub.max = movie.duration;
  scrub.value = time;
  draw(time);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

playBtn.onclick = function () {
  playing = !playing;
  playBtn.textContent = playing ? "pause" : "play";
};
scrub.oninput = function () {
  playing = false;
  playBtn.textContent = "play";
  time = Number(scrub.value);
};

// Record the canvas while the film plays once from the start, as the maker's video button does.
recBtn.onclick = function () {
  var parts = [];
  var recorder = new MediaRecorder(stage.captureStream(30), {mimeType: "video/webm"});
  recorder.ondataavailable = function (e) { parts.push(e.data); };
  recorder.onstop = function () {
    var link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(parts, {type: "video/webm"}));
    link.download = "cartoon.webm";
    link.click();
  };
  time = 0;
  playing = true;
  recorder.start();
  setTimeout(function () { recorder.stop(); }, movie.duration * 1000);
};
</script></body></html>
```

Things a page must get right:

- one canvas, `id="stage"`, 1920 x 1080, before the kit loads; the kit draws on it with `pen`;
- `BEAT` defined before the first `draw()`: without it nothing is drawn;
- `oldcartoon.js` first, then the modules; `dragon.js` needs `naga.js` before it;
- `window.FILM_STYLE` set before the kit loads (`hop: false` for an even walk, `wide: 1920` to fill
  the screen instead of the old film's 1440 with bars).

The page loads the kit from beside it. A page elsewhere can load the same files from
`https://krueng.ai/js_animation_assets/` (`oldcartoon.js`, `motion.js`, `backdrops.js` ...), as the
code the maker shows does. The page the maker downloads, and the one `film.py` writes, carries the kit
inside it instead (about 1.2 MB), so the film plays with no internet and draws the same for good.

## By AI

An agent can make a film two ways: as JSON through the cartoon maker, or as a page written by hand
on the kit.

### 1. The film as JSON, with `film.py`

`maker/cartoon_maker_assets/SKILL.md` is a skill an agent follows, and `film.py` is its tool. The
agent writes the film as JSON in the maker's vocabulary; `film.py` opens the maker with no window,
checks the JSON with the maker's own code, and makes stills and the video.

Give the skill to an agent, then start the agent again and ask it for a cartoon:

```
python maker/cartoon_maker_assets/film.py skill claude_code     # or codex, or opencode
```

It writes `SKILL.md` into the agent's skills folder (`~/.claude/skills/lanna-cartoon/` for Claude
Code) and says where `film.py` is. The loop the agent follows, which you can run yourself from the
repository:

```
python maker/cartoon_maker_assets/film.py vocabulary                 # the names the kit knows, the JSON shape, the rules
python maker/cartoon_maker_assets/film.py stills film.json 3 6 9     # one picture per second named, in stills/
python maker/cartoon_maker_assets/film.py render film.json film.mp4  # the video
python maker/cartoon_maker_assets/film.py page film.json kit/film.html --local   # a page that loads the kit from beside it
```

A film, as JSON:

```json
{
  "duration": 12,
  "backdrop": "river",
  "items": [
    {"kind": "person", "name": "girl", "keys": [[0, 200, 960], [5, 700, 950, "wave"], [7, 700, 950], [12, 1250, 960, "walk"]]},
    {"kind": "thing", "name": "khom", "keys": [[0, 1100, 260]]},
    {"kind": "thing", "name": "naga", "keys": [[2, 1500, 300], [12, -200, 420]]}
  ],
  "texts": [
    {"kind": "card", "from": 0, "to": 2, "big": "ริมแม่น้ำ", "small": "By the river"},
    {"kind": "subtitle", "from": 5, "to": 8, "big": "สวัสดีพญานาค", "small": "Hello, Naga"}
  ]
}
```

A girl walks along the river under a hanging lantern, stops and waves as a naga flies past, and
walks on. Any model can write the JSON: `film.py write "the story" film.json --base
http://127.0.0.1:11434/v1 --model qwen2.5:3b` asks a local Ollama, and `--base` with `--key` asks
any OpenAI-compatible server. `film.py` uses the maker beside it, this repository's, and the
kit's `render.py`; a `film.py` downloaded on its own uses the maker on krueng.ai (`--maker URL` before
the command gives another).

### 2. A film page written by the agent

For what the JSON cannot say (a camera that follows a cloth, a woven sash, a song, a dance read from
a video), the agent writes a page on the kit, as the hero film was written. A prompt that works:

> Read `docs/STYLE.md`, "Make a new film" and the rules, and `kit/starter.html`. Write
> `kit/<name>.html`: *the film, scene by scene, and how long it is*. Before you render, run
> `python stills.py <name>.html sheet.jpg` with five or six seconds and look at the sheet; fix what is
> wrong and look again. The page must raise no kit warning. Then run
> `python checks/kit_check.py <name>.html`, and only then `python render.py <name>.html <name>.mp4`.

`kit/sash_prompt.md` is the brief the hero film was made from. Give the job to an agent that can
look at images: the sheet of stills is where a hand through a head, or a figure off the ground,
shows up in seconds instead of after a render.

## What is here

```
kit/              the kit and everything that uses it, side by side
  oldcartoon.js     the kit: the style sheet (STYLE), the cast (CAST), person(x, y, look),
                    painted sets, the lens, cuts, subtitles, film()
  *.js              modules on top of the kit (below)
  *.html            model sheets (one subject each) and seven films
  render.py         a page -> an mp4
  stills.py         a page -> one sheet of single frames
  checks/           kit_check.py, the one check after any change, and the tools it uses
  *_music.py        the films' music, every sound a sine wave
  *_sing.py         the films' Thai singing; singer.py sings a syllable on a note
  sash_narrate.py   the hero film's story, told in Kam Mueang (the Kam Mueang assistant's voice; or say.mjs, the extension's)
  dance_track.py    a dancer's moves, read from a video, -> dance_track.js
maker/            the cartoon maker, its film.py and its skill for agents
docs/STYLE.md     the rules with their numbers, the framework, the checks, what is not done
docs/kit/         how each part was built, a file for each: figures, feelings, creatures, places ...
docs/api.md       every function and tool, as its comments describe it (kit/api_index.py makes it): for an agent
```

The kit's files sit side by side on purpose: every page loads `oldcartoon.js` and its modules by a
plain relative `<script src>`, and `kit_check.py` checks every page in the folder.

### The modules

Each loads after `oldcartoon.js` and adds drawings of its own; none changes the kit.

| File | Adds | Sheet |
|---|---|---|
| `motion.js` | eases, springs, stagger, tweens, a course with depth and heading: `where(keys, t)` | `motion.html` |
| `cumulus.js` | puffy clouds that drift, by depth | |
| `backdrops.js` | nineteen backgrounds: seven places of the north and twelve from thangka paintings, `backdrop(name)` | `backdrops.html` |
| `flora.js` | the flowers and fruits of Thailand | `flora.html` |
| `highlands.js` | the uplands of the north: rice terraces cut into a slope, in four seasons; the forest (crowns, tall trees, bamboo, areca palms, and a mountain clothed in it); and mist, a sea of it lying in the valleys and bands drifting across the slopes | `highlands.html` |
| `northbirds.js` | five birds of the north: the green peafowl, which walks, pecks, calls and raises its train into a fan and shivers it; Mrs Hume's pheasant and his hen; the green-tailed sunbird, perched or hovering at a flower; the red-billed blue magpie, perched with its long tail or flying; the great hornbill, perched or flying | `northbirds.html` |
| `food.js` | a dozen Thai dishes, `food(name, x, y, look)` | `food.html` |
| `khom.js` | the hanging paper lantern of Lanna, `khom(x, y, look)`; the spinning khom phat, whose cut figures' shadows go round its paper, the khom thue carried in parades, the star and the lotus lanterns | `khom.html`, `khom_kinds.html` |
| `pieces.js` | things of the north: hong, water jar, chedi sai, lamps, krathong, ox cart, drum cart; the rice granary (long khao) and its sawian baskets, the cluster tung and the web tung of Songkran, and Chiang Mai's red truck (rot daeng) with seats for riders | `pieces.html`, `farmstead.html` |
| `band.js` | the band of the north: the salo, the sueng, the pi chum and the phin phia, and `musician(x, y, kind, look)`, who sits on the floor and plays one on the beat | `band.html` |
| `sabai.js` | a sabai woven with figures that walk | `sabai.html` |
| `naga.js` | a Naga, the many-headed serpent of the temple stairs | `naga.html` |
| `dragon.js` | a dragon of the Himalayan paintings, and a Chinese one (`kind: "chinese"`); needs `naga.js` | `dragon.html`, `dragon_china.html`, `dragon_flight.html` |
| `beasts.js` | an elephant, a water buffalo, a cat, a tiger and a pig | `beasts.html`, `elephant.html`, `felines.html`, `pig.html` |
| `myth.js` | three creatures of the myths of Lanna | `myth.html` |
| `chiangsaen.js` | Chiang Saen and the things of its tale, Chang Ngu: the city wall and moat as Chiang Saen's were, the Mae Khong's sandbars with khrai nam scrub, reeds and their birds (pratincole, river lapwing, little ringed plover, red avadavat, spot-billed duck), a limestone hill with a cave, a forge, a dap and a fire-gun, the bamboo elephant hook, a carrying pole, a pan for gold, a gold salung and pot, a hanging cradle, Indra's rising wall, the statue's pool | `chiangsaen.html` |
| `paperdoll.js` | paperdolls: one character each, with cloth that flows | |
| `fonlep.js`, `apsara.js`, `puman.js` | three paperdolls: the fingernail dancer, the celestial dancer, the whisperer | `fonlep.html`, `apsara.html`, `puman.html` |
| `dance_track.js` | a whole dance as the kit's poses, for `poseAt()` | `dance.html` |
| `finger_dance.js` | the fingernail dance of the north (fon lep): its six poses read from a performance, the 32-second phrase for `poseAt()`, the dresses, and `fingerDancer(x, y, dress)`, who dances it walking | `finger_dance.html` |

The kit's own sheets: `model.html` (one figure close up), `looks.html` (every look name a person
takes), `walk.html`, `body.html`, `legs.html`, `build.html`, `children.html`, `elders.html`,
`floor.html`, `together.html`, `nature.html`, `landscape.html`, `buildings.html`,
`dance_hands.html` (the hands of classical dance, Thai and Khmer), `chickens.html` (the rooster and the hen),
`hairdos.html` (the ways a Lanna lady wears her hair, and the ornaments she sets in it),
`feelings.html` (the nine feelings on a lady, a fellow, a girl and an elder, close up and whole),
`bubbles.html` (speech and thought bubbles in Thai and English, over people who hop and walk, under a
camera that comes closer), `creatures.html` (the nine feelings on the dog, the rooster, the Naga, both
dragons, the Mom, the Luang, the elephant, the buffalo, the cat, the tiger, the pig, the Hatsadiling,
the five birds of the north and the sun).

### The films

| Film | Seconds | Sound |
|---|---|---|
| `starter.html` | 8 | none; the smallest film, the one to copy |
| `village.html` | 36 | `village_music.py`, then `village_sing.py` |
| `lanna.html` | 60 | `lanna_music.py`, then `lanna_sing.py` |
| `sash.html` | 79 | `sash_music.py`, then `sash_narrate.py`: the story of Lanna for children, told in Kam Mueang; the brief it was first made from is `sash_prompt.md` |
| `parasol_rain.html` | 35 | none |
| `finger_dance.html` | 32 | none; a troupe of fifteen dancing the fingernail dance on the night of Yi Peng |
| `gesture_dancer.html` | 39 | none; one fingernail dancer through every hand of dance, ending in a wai |

## Not here

- The puppet route (a drawing cut into parts and moved by the kit's joints) is still in
  `oldcartoon.js` as `person(x, y, {rig})`, unused; its tools and its drawing are not in this
  repository.
- The lessons about the kit are pages of krueng.ai, linked at the top.

## Sources

The style was read from paintings, murals, thangkas and photographs and written down as rules;
nothing of them is copied, and no picture of them is in this repository. The photographs used for
measurements are credited where they are used, in `docs/STYLE.md` and `docs/kit/`. `dance_track.js` holds numbers
read by MediaPipe Pose from a video of a Bharatanatyam dancer; the video is not here.

The hero film's narration: its facts come from a NotebookLM notebook of Lanna's history (Wikipedia on
Mangrai, Chiang Mai, the sabai, the tung, the kwian, Bo Sang, khom loi, Yi Peng and the Chinese dragon),
its Kam Mueang from a second notebook whose word sources (`pythainlp/lanna_dict`, the Charatrit
KamMuang-Thai-English pairs, a guide to speaking Lanna) are named in `sash.html`; no native speaker has
checked it yet. Its voice is Meta's MMS Northern Thai (`facebook/mms-tts-nod`, CC BY-NC 4.0), as the Kam
Mueang assistant speaks it (since 2026-10-18; before, as the Kam Mueang Voice extension carries it), so the
narration is for non-commercial use.

The band, the four new lanterns, the granary, the two tung and the red truck (2026-10-16): what each
is, and how it is held or built, comes from a NotebookLM notebook of Lanna's material culture
(Wikipedia on the salo, the sueng, Yi Peng and the songthaew; ThaiJO papers on the phin phia and on a
Lanna music teacher; Chang Puak Magazine on the tung of Songkran; the Lanna Traditional House Museum
of Chiang Mai University on its granary; Polyglot Petra and Bangkok Bank's Soodprod on the lanterns),
and each shape from Wikimedia Commons photographs under free licences, credited at the head of the
file that draws it. No free photograph was found of the pi chum, the khom phat, the star and lotus
lanterns or the two tung: those are drawn from the written words, and say so where they are drawn.

The code was written with Claude Code (Anthropic), directed by David Dockhorn.

## Licence

MIT: see [LICENSE](LICENSE).
