"""heard.py - the sounds a film's picture makes, as a scene's calls: [[second, sound, loudness], ...].

    python heard.py sash.html                       # the whole film
    python heard.py maeng/s02.html --from 0 --to 30 # a part of it
    python heard.py maeng/s02.html --json calls.json

The kit notes a sound where the picture makes it: a rooster's crow, from when its beak opens (oldcartoon.js,
hear() and heard()). This draws the page's film frame by frame, as render.py does but keeping no pictures, and
prints the calls in the form a scene writes its own (decorate.js calls; maeng/feelings.py lays those under a
film): the second its sound file starts, the sound (sounds.py's out/sounds/NAME.wav) and its loudness. render.py
lays the same under the films it renders; this is for a film whose sound is put together elsewhere.
It needs Google Chrome (Playwright). It ends with exit code 0, 1 when the page reported an error.
"""
import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

LOAD_SECONDS = 600   # the hero film paints its forests as it loads


def main():
    """The command line: draw the page's film, print its calls, and write them to --json when asked."""
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("--from", dest="start", type=float, default=0.0)
    parser.add_argument("--to", dest="end", type=float)
    parser.add_argument("--json", help="also write the calls to this file")
    args = parser.parse_args()
    page_file = Path(args.page).resolve()
    if not page_file.exists():
        raise SystemExit("no such page: " + args.page)
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(page_file.as_uri(), timeout=LOAD_SECONDS * 1000)
        page.evaluate("rendering = true")
        end = args.end if args.end is not None else page.evaluate("typeof LENGTH !== 'undefined' ? LENGTH : DURATION")
        calls = page.evaluate("([from, to]) => heard(from, to)", [args.start, end])
        browser.close()
    for call in calls:
        print(json.dumps(call, ensure_ascii=False))
    if args.json:
        Path(args.json).write_text(json.dumps(calls, ensure_ascii=False), encoding="utf-8")
    for error in errors[:3]:
        print("the page reported an error:", error)
    print("%s: %d calls" % (page_file.name, len(calls)))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
