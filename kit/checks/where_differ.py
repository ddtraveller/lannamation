"""where_differ.py other_kit.js page.html second out.png  - where do two kits draw one frame differently?

Draws the frame (a jump from elsewhere, as a page watched live) with the repo's kit and with the other kit, prints the
boxes that hold the pixels which differ, and saves the two versions of the largest box side by side, three times size.

It needs Google Chrome (through Playwright), numpy, scipy and Pillow. The other kit is named from the folder
it is run in; the page from the kit's folder (kit/). It writes out.png only when some pixel differs, and ends
with exit code 0. The box saved is held inside the sheet, 1440 or 1920 wide (until 2026-10-21 inside 1440: a box past x 1440 was cut
there, and one wholly past it failed).
"""
import base64
import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
from scipy import ndimage

ASSETS = Path(__file__).resolve().parent.parent      # the folder the kit and its pages are in

DRAW = """([t]) => {
  rendering = false;
  try {
    draw(t > DURATION / 2 ? t - DURATION * 0.4 : t + DURATION * 0.4);
    draw(t);
  } finally { rendering = true; }
  return pen.canvas.toDataURL("image/png");
}"""


def frame(browser, page_file, kit, second):
    """The page's sheet at second, come to by a jump from elsewhere with rendering off: a PIL image.

    browser: a Playwright browser. page_file: the page, a Path. kit: another oldcartoon.js to load in place of the
    page's own, or None. A page error is printed, not raised.
    e.g. frame(browser, ASSETS / "lanna.html", "../old/oldcartoon.js", 12.5)"""
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.on("pageerror", lambda error: print("PAGE ERROR", error))
    if kit:
        page.route("**/oldcartoon.js", lambda route: route.fulfill(path=kit, content_type="text/javascript"))
    page.goto(page_file.as_uri())
    page.evaluate("rendering = true")
    url = page.evaluate(DRAW, [second])
    page.close()
    return Image.open(io.BytesIO(base64.b64decode(url.split(",", 1)[1]))).convert("RGB")


def main():
    """The command line: where_differ.py OTHER_KIT PAGE SECOND OUT: print the boxes that differ, save the largest."""
    kit, name, second, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", args=["--allow-file-access-from-files"])
        one, other = frame(browser, ASSETS / name, None, second), frame(browser, ASSETS / name, kit, second)
        browser.close()
    differ = (np.asarray(one, dtype=np.int16) != np.asarray(other, dtype=np.int16)).any(axis=2)
    print("%s at %.2f s: %d pixels differ" % (name, second, int(differ.sum())))
    if not differ.any():
        return
    labels, count = ndimage.label(ndimage.binary_dilation(differ, iterations=12))
    boxes = []
    for index, box in enumerate(ndimage.find_objects(labels), 1):
        boxes.append((int(differ[box].sum()), box[1].start, box[0].start, box[1].stop, box[0].stop))
    boxes.sort(reverse=True)
    for pixels, x0, y0, x1, y1 in boxes[:8]:
        print("   %5d px in x %d to %d, y %d to %d" % (pixels, x0, x1, y0, y1))
    _, x0, y0, x1, y1 = boxes[0]
    box = (max(0, x0 - 30), max(0, y0 - 30), min(one.width, x1 + 30), min(one.height, y1 + 30))   # inside the sheet, 1440 or 1920 wide
    a, b = one.crop(box), other.crop(box)
    pair = Image.new("RGB", (a.width * 2 + 6, a.height), "#ff00ff")
    pair.paste(a, (0, 0))
    pair.paste(b, (a.width + 6, 0))
    pair = pair.resize((pair.width * 3, pair.height * 3), Image.LANCZOS)
    pair.save(out)
    print("   saved the largest box, repo kit left and other kit right:", out, pair.size)


if __name__ == "__main__":
    main()
