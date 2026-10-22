"""vanish_check.py - does anything blink out of a film?

    python checks/vanish_check.py sash.html                  # the whole film
    python checks/vanish_check.py sash.html --from 22 --to 36  # a part of it

Nothing should blink out of a film: what leaves goes off the edge, fades, shrinks away, or goes with a scene that
fades to black. This check runs the kit's vanished() (oldcartoon.js) on the page: it draws every frame in order, as
render.py does but keeping no pictures, and tells each person, each of a scene's life and each of drawByZ()'s
sprites that gives an x which was drawn in one frame and gone in the next while it could be seen. render.py runs the
same before its first frame. It needs Google Chrome (Playwright).

It reads the page only: it writes nothing. It ends with exit code 0 when nothing blinked out, 1 when something did or
the page reported an error.
"""
import argparse
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

LOAD_SECONDS = 600   # the hero film paints its forests as it loads


def main():
    """The command line: draw the page's film frame by frame and print what blinked out."""
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("--from", dest="start", type=float, default=0.0)
    parser.add_argument("--to", dest="end", type=float)
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
        started = time.time()
        blinks = page.evaluate("([from, to]) => vanished(from, to)", [args.start, end])
        took = time.time() - started
        browser.close()
    for blink in blinks:
        print(blink)
    for error in errors[:3]:
        print("the page reported an error:", error)
    print("%s: %d blinked out (%.0f s of film looked at in %.0f s)" % (page_file.name, len(blinks), end - args.start, took))
    sys.exit(1 if blinks or errors else 0)


if __name__ == "__main__":
    main()
