"""frames.py - what the checks share: a page's frames as pictures, and whether two pictures are the same.

    from frames import open_page, frame_at, differ

open_page(browser, page_file) loads a kit page as the checks do (rendering on, so it draws only when asked);
frame_at(page, t) draws second t and gives back the film's own sheet as an array (height, width, 3), at the
picture's size (1920 x 1080 for a film of FILM_STYLE wide 1920, whatever its pixels); differ(a, b) compares two
such pictures by kit_check.py's rule for "same": a pixel differs when a colour is more than 24 apart, and it
counts when its colour lies outside what the other picture has within one pixel of it by more than 24 (a line
lying a part of a pixel aside changes the pixels along its edge, and nobody sees it). It gives back (differ,
counted). kit_check.py's own "same" works it out in the page, in JavaScript; this is the same rule in numpy.
"""
import base64
import io

import numpy as np
from PIL import Image
from scipy.ndimage import maximum_filter, minimum_filter

SHEET = """([t]) => {
  rendering = false;
  try { draw(t); } finally { rendering = true; }
  return pen.canvas.toDataURL("image/png");
}"""


# render.py's FONTS: every web font the page names, loaded before a frame is drawn
FONTS = "Promise.all(Array.from(document.fonts).map(function (f) { return f.load().catch(function () { return null; }); }))"


def open_page(browser, page_file, errors=None):
    """A new tab in browser with the kit page loaded as the checks load it: the page (Playwright's).

    browser: a Playwright browser. page_file: the page, a Path. errors: a list the page's errors are added
    to as they come, or None to keep none. The tab is 1920 x 1080; the page's web fonts are loaded and
    rendering is on, so the page draws only when asked. Waits up to 180 s for it to load.
    e.g. page = open_page(browser, Path("village.html"), errors)"""
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    if errors is not None:
        page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(page_file.resolve().as_uri(), timeout=180000)
    page.evaluate(FONTS)                             # the page's web fonts loaded first, as render.py loads them
    page.evaluate("rendering = true")
    return page


def frame_at(page, t):
    """Second t of the page, as the film's sheet shows it, at the picture's size.

    page: from open_page(). t: the second. Gives back a numpy array (height, width, 3) of int16, the colours
    0 to 255. Draws the page at t (it leaves the page at that second).
    e.g. frame_at(page, 2.5)"""
    data = page.evaluate(SHEET, [t])
    picture = Image.open(io.BytesIO(base64.b64decode(data.split(",", 1)[1]))).convert("RGB")
    wide = page.evaluate("WIDE")
    if picture.width != wide:                        # a sheet drawn at more pixels than the picture's (PIX)
        picture = picture.resize((wide, round(picture.height * wide / picture.width)), Image.LANCZOS)
    return np.asarray(picture).astype(np.int16)


def differ(a, b):
    """(how many pixels differ by more than 24 in a colour, how many of those a shift of one pixel does not explain).

    a, b: two pictures of one size, as frame_at() gives them.
    e.g. differ(frame_at(page, 1), frame_at(page, 1))"""
    apart = (np.abs(a - b) > 24).any(axis=2)
    def outside(one, other):
        """Where one has a colour more than 24 outside what other has within one pixel round it: a mask (height, width)."""
        low = minimum_filter(other, size=(3, 3, 1), mode="nearest")
        high = maximum_filter(other, size=(3, 3, 1), mode="nearest")
        return ((one < low - 24) | (one > high + 24)).any(axis=2)
    counted = apart & (outside(a, b) | outside(b, a))
    return int(apart.sum()), int(counted.sum())
