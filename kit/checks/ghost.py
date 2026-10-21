"""ghost.py page.html out.png --from A --to B [--every S] [--box X Y W H]  - one picture of how things move.

    python checks/ghost.py maeng/s04.html s04_ghost.png --from 2 --to 33
    python checks/ghost.py maeng/s03.html s03_walk.png --from 0 --to 12 --every 0.5 --box 0 500 1300 500

From second A to second B the page is drawn every S seconds (a sixteenth of the stretch unless told); what does
not move (each pixel's middle colour over all of them) is the picture behind, and what moves is laid over it at
every one of those seconds, the earliest faintest, the last whole. So the spacing of the ghosts is the speed:
evenly spaced is an even pace, bunched is a slowing or a stop, far apart is a dash, and a foot that should stand
still on the ground and does not shows as a smear (the idea from HyperFrames' ghosted motion frames, 2026-10-19;
nothing of its code). A scene decorated with life (decorate.js) also has each animal's course drawn over it, in
its own colour: a dot where it was at each second drawn, the seconds written at every fourth, and its name.
A scene whose camera moves over the stretch has no picture behind that holds still: it says so, and the ghosts
are of everything. Keep the stretch short there, or within one shot.

It needs Google Chrome (through Playwright), numpy and Pillow. The page is named from the folder it is run
in. It writes the PNG named (the box cut from it with --box: x y w h in pixels of the picture), prints how
many moments and courses it drew and the first page error, and ends with exit code 0. It runs main() as it
is loaded: do not import it.
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from frames import frame_at, open_page  # noqa: E402

COLOURS = [(220, 60, 60), (40, 120, 220), (40, 160, 70), (210, 140, 20), (150, 60, 190), (20, 160, 170)]


def main():
    """The command line (see this file's docstring): draw the stretch, find the picture behind, lay the ghosts and
    the animals' courses over it, and save it."""
    ask = argparse.ArgumentParser()
    ask.add_argument("page")
    ask.add_argument("out")
    ask.add_argument("--from", dest="start", type=float, required=True)
    ask.add_argument("--to", dest="end", type=float, required=True)
    ask.add_argument("--every", type=float)
    ask.add_argument("--box", type=int, nargs=4)
    a = ask.parse_args()
    every = a.every or (a.end - a.start) / 16
    seconds = list(np.arange(a.start, a.end + every / 2, every))
    frames, seen = [], []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        errors = []
        page = open_page(browser, Path(a.page), errors)
        for t in seconds:
            page.evaluate("window.LIFE_SEEN = []")
            frames.append(frame_at(page, float(t)))
            seen.append(page.evaluate("window.LIFE_SEEN"))
        page.close()
        browser.close()
    if errors:
        print("page error:", errors[0])
    stack = np.stack(frames)
    behind = np.median(stack, axis=0)
    still = float(np.mean(np.abs(stack[0] - behind) > 30))
    if still > 0.25:
        print("the picture behind does not hold still (%.0f%% of it moves: a camera, or a change of shot): ghosts of everything" % (100 * still))
    out = behind.copy()
    for k, frame in enumerate(frames):              # the earliest faintest, the last whole
        moves = (np.abs(frame - behind) > 30).any(axis=2)
        alpha = 0.25 + 0.75 * k / max(1, len(frames) - 1)
        out[moves] = out[moves] * (1 - alpha) + frame[moves] * alpha
    picture = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    pen = ImageDraw.Draw(picture)
    try:
        font = ImageFont.truetype("georgia.ttf", 18)
    except OSError:
        font = ImageFont.load_default()
    courses = {}
    for t, one in zip(seconds, seen):                # each animal's course: where its box's middle was, second by second
        for life in one or []:
            box = life["box"]
            courses.setdefault(life["name"], []).append((t, (box[0] + box[2]) / 2, (box[1] + box[3]) / 2))
    for n, (name, points) in enumerate(sorted(courses.items())):
        colour = COLOURS[n % len(COLOURS)]
        pen.line([(x, y) for _, x, y in points], fill=colour, width=2)
        for k, (t, x, y) in enumerate(points):
            pen.ellipse([x - 4, y - 4, x + 4, y + 4], fill=colour)
            if k % 4 == 0:
                pen.text((x + 6, y - 22), "%.1f" % t, fill=colour, font=font)
        pen.text((points[0][1] + 6, points[0][2] + 6), name, fill=colour, font=font)
    if a.box:
        x, y, w, h = a.box
        picture = picture.crop((x, y, x + w, y + h))
    picture.save(a.out)
    print("%s: %d moments from %.2f to %.2f s, %d course%s" % (a.out, len(frames), a.start, a.end, len(courses), "" if len(courses) == 1 else "s"))


main()
