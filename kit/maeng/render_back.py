"""render_back.py - render a film's scenes from the last one back, each into the clip scenes.py would make of it.

    python maeng/render_back.py maeng/film.html 14 13 12        # the scenes, in the order to render them

A second machine helping scenes.py: scenes.py renders from the first scene on and leaves alone a scene whose clip
is there already, so this one, run elsewhere on a copy of the kit, renders from the end, and each clip it makes is
copied into the first machine's film_scenes/ before scenes.py comes to it. A clip already made is not made again.

It needs what render.py needs (Google Chrome through Playwright, ffmpeg on the PATH) and a page that lists SCENES.
It writes each clip into the page's <stem>_scenes/ folder (scenes.clip_of names it; a .part.mp4 while it renders)
and prints a line as each begins and ends. Exit code 0; 1 when the page lists no SCENES or a render fails
(SystemExit from scenes.py or render.py), or with a traceback for a scene number that is not a number or not there.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import render
import scenes

page_file = Path(sys.argv[1])
listed = scenes.scenes_of(page_file)
folder = page_file.parent / (page_file.stem + "_scenes")
folder.mkdir(exist_ok=True)
for number in [int(a) for a in sys.argv[2:]]:
    clip = scenes.clip_of(folder, number, listed[number - 1])
    if clip.exists():
        continue
    start, end, name = listed[number - 1]
    print("scene %d (%s), %g to %g s:" % (number, name, start, end), flush=True)
    part = clip.with_name(clip.stem + ".part.mp4")
    render.render(str(page_file), str(part), None, start, end, False)
    part.replace(clip)
    print("made", clip.name, flush=True)
