"""pop_check.py - does anyone in a film pop: a joint that jumps in one frame further than a body moves?

    python checks/pop_check.py maeng/s11.html                  # the whole film
    python checks/pop_check.py sash.html --from 22 --to 36     # a part of it

A scene that switches a look at a second ("t < 5 ? one : other") moves an arm or a leg in one frame: it pops. This
check runs the kit's popped() (oldcartoon.js: filmWatch() with popWatch()) on the page: it draws every frame in
order, as render.py does but keeping no pictures, measures each person's elbows, hands, knees, ankles and crown from
their hip in lengths of their own torso, and tells who had a joint jump POP.jump of a torso or more between two
frames, while facing the same way and not in a fade. render.py runs the same look before its first frame. The way
to mend one is poseSteps() (or poseAt()): the change eased over a quarter of a second. It needs Google Chrome
(Playwright).

It reads the page only: it writes nothing. It ends with exit code 0 when no one popped, 1 when someone did or the
page reported an error.
"""
import argparse
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

LOAD_SECONDS = 600   # the hero film paints its forests as it loads


def main():
    """The command line: draw the page's film frame by frame and print who popped."""
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
        pops = page.evaluate("([from, to]) => popped(from, to)", [args.start, end])
        took = time.time() - started
        browser.close()
    for pop in pops:
        print(pop)
    for error in errors[:3]:
        print("the page reported an error:", error)
    print("%s: %d popped (%.0f s of film looked at in %.0f s)" % (page_file.name, len(pops), end - args.start, took))
    sys.exit(1 if pops or errors else 0)


if __name__ == "__main__":
    main()
