"""same_kit.py other_kit.js page.html [page.html ...]  - do two copies of the kit draw the same pictures?

Each page is drawn at twelve seconds spread over its length (one frame each, as a page watched live) with the kit in
the repo and with the other kit, and the film's own sheet is compared pixel for pixel. Prints how many of the twelve
frames differ, and for those the count of pixels that differ at all.

Not for a page whose cloth is a chain (the paperdoll sheets, apsara.html, fonlep.html, puman.html). Such a page
does not draw the same picture twice: the kit against an exact copy of itself differs there in every frame
(measured 2026-10-13: 7,000 to 12,000 pixels a frame on apsara.html), and it still does when each frame is come to
through the kit's settled(). For those pages use kit_check.py, whose "same" allows for a line that lies a part of
a pixel aside.

It needs Google Chrome (through Playwright), numpy and Pillow. The other kit is named from the folder it is
run in; the pages from the kit's folder (kit/). It prints one line a page and ends with exit code 1 when a frame
of a page differs between the two kits, else 0 (0 whatever it found, until 2026-10-21).
"""
import base64
import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

ASSETS = Path(__file__).resolve().parent.parent      # the folder the kit and its pages are in

DRAW = """([k]) => {
  rendering = false;
  var t = DURATION * (k + 0.5) / 12;
  try {
    draw(t > DURATION / 2 ? t - DURATION * 0.4 : t + DURATION * 0.4);   // somewhere else first: what hangs starts at rest
    draw(t);
  } finally { rendering = true; }
  return pen.canvas.toDataURL("image/png");
}"""


def frames(browser, page_file, kit):
    """The page's twelve frames as PNG data URLs, each come to by a jump from elsewhere, as a page watched live.

    browser: a Playwright browser. page_file: the page, a Path. kit: another oldcartoon.js to load in place of
    the page's own, or None for the page's own. A page error is printed, not raised.
    e.g. frames(browser, ASSETS / "lanna.html", "../old/oldcartoon.js")"""
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.on("pageerror", lambda error: print("PAGE ERROR", error))
    if kit:
        page.route("**/oldcartoon.js", lambda route: route.fulfill(path=kit, content_type="text/javascript"))
    page.goto(page_file.as_uri())
    page.evaluate("rendering = true")
    out = [page.evaluate(DRAW, [k]) for k in range(12)]
    page.close()
    return out


def pixels(url):
    """A PNG data URL as a numpy array (height, width, 3) of int16.

    e.g. pixels(frames(browser, page_file, None)[0])"""
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(url.split(",", 1)[1]))).convert("RGB"), dtype=np.int16)


def main():
    """The command line: same_kit.py OTHER_KIT PAGE [PAGE ...]: print how many of each page's twelve frames differ."""
    kit = sys.argv[1]
    any_differ = False
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", args=["--allow-file-access-from-files"])
        for name in sys.argv[2:]:
            one, other = frames(browser, ASSETS / name, None), frames(browser, ASSETS / name, kit)
            differ = [(k, int((pixels(a) != pixels(b)).any(axis=2).sum())) for k, (a, b) in enumerate(zip(one, other)) if a != b]
            print("%-14s %d of 12 frames differ%s" % (name, len(differ), ": " + ", ".join("frame %d by %d px" % d for d in differ) if differ else ""))
            any_differ = any_differ or bool(differ)
        browser.close()
    if any_differ:
        sys.exit(1)


if __name__ == "__main__":
    main()
