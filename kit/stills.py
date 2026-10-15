"""stills.py - look at single frames of a film before rendering all of it.

    python stills.py village.html sheet.jpg 2 10.25 17.8 28

It opens the page in Chrome with no window, asks for the picture of each
second you name, and saves them all on one sheet. Six frames show most
mistakes, and they take seconds, not minutes.
"""
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

WIDE = 960                   # each frame on the sheet is 960 x 540
TALL = 540


def frames(page_file, seconds):
    pictures = []
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(Path(page_file).resolve().as_uri())
        page.evaluate("rendering = true")
        for second in seconds:
            page.evaluate("draw(%f)" % second)
            shot = page.screenshot(type="jpeg", quality=90)
            pictures.append(Image.open(io.BytesIO(shot)))
        warnings = page.evaluate("typeof WARNINGS === 'undefined' ? [] : WARNINGS.slice()")
        browser.close()
    return pictures, errors, warnings


def sheet(pictures):
    columns = 2 if len(pictures) > 1 else 1
    rows = (len(pictures) + columns - 1) // columns
    paper = Image.new("RGB", (columns * WIDE, rows * TALL))
    for number, picture in enumerate(pictures):
        place = ((number % columns) * WIDE, (number // columns) * TALL)
        paper.paste(picture.resize((WIDE, TALL)), place)
    return paper


def main():
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
