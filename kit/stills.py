"""stills.py - look at single frames of a film before rendering all of it.

    python stills.py village.html sheet.jpg 2 10.25 17.8 28

It opens the page in Chrome with no window, asks for the picture of each
second you name, and saves them all on one sheet. Six frames show most
mistakes, and they take seconds, not minutes.

It needs Google Chrome (through Playwright) and Pillow. The page must have draw(t) and the switch
rendering. It writes one JPEG where it is named: two frames a row, each 960 x 540, in the order the
seconds are given; then prints the kit's warnings and the page's errors. It ends with exit code 0 even
when the page reported an error: read what it prints.
"""
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

from render import FONTS

WIDE = 960                   # each frame on the sheet is 960 x 540
TALL = 540


def frames(page_file, seconds):
    """The page's picture at each second named: (pictures, errors, warnings).

    page_file: the page. seconds: a list of seconds. pictures are PIL images, 1920 x 1080, the screen as
    shown; errors are what the page reported; warnings are the kit's WARNINGS.
    e.g. frames("village.html", [2, 10.25])"""
    pictures = []
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.on("pageerror", lambda error: errors.append(str(error)))
        # the hero film paints its forests as it loads: 42 s on a laptop on battery
        page.goto(Path(page_file).resolve().as_uri(), timeout=180000)
        page.evaluate(FONTS)                      # the page's web fonts first, as render.py loads them: a still shows what the video does
        page.evaluate("rendering = true")
        for second in seconds:
            page.evaluate("draw(%f)" % second)
            shot = page.screenshot(type="jpeg", quality=90)
            pictures.append(Image.open(io.BytesIO(shot)))
        warnings = page.evaluate("typeof WARNINGS === 'undefined' ? [] : WARNINGS.slice()")
        browser.close()
    return pictures, errors, warnings


def sheet(pictures):
    """One picture with all of pictures on it, two a row, each scaled to 960 x 540: a PIL image.

    e.g. sheet(frames("village.html", [2, 10.25])[0]).save("sheet.jpg")"""
    columns = 2 if len(pictures) > 1 else 1
    rows = (len(pictures) + columns - 1) // columns
    paper = Image.new("RGB", (columns * WIDE, rows * TALL))
    for number, picture in enumerate(pictures):
        place = ((number % columns) * WIDE, (number // columns) * TALL)
        paper.paste(picture.resize((WIDE, TALL)), place)
    return paper


def main():
    """The command line: stills.py PAGE OUT SECONDS...; saves the sheet and prints what it found."""
    page_file, out = sys.argv[1], sys.argv[2]
    seconds = [float(word) for word in sys.argv[3:]]
    pictures, errors, warnings = frames(page_file, seconds)
    sheet(pictures).save(out, quality=88)
    print("%s: %d frames at seconds %s" % (out, len(pictures), ", ".join(sys.argv[3:])))
    for warning in warnings:
        print("the kit warned:", warning)
    for error in errors:
        print("the page reported an error:", error)


if __name__ == "__main__":
    main()
