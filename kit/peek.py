"""peek.py - full-size crops of one figure on a kit page, beside the reference.

    python peek.py fonlep.html out.jpg --box 340 60 460 720 --ref reference_523.jpg 1 3.2 5.5

Each second named is drawn (the page pre-rolls the cloth itself), the box
(x y w h, screen pixels) is cut out at full size, and all the cuts stand in a
row after the reference, scaled to the same height.

It needs Google Chrome (through Playwright) and Pillow. --box is x y w h in screen pixels of the
1920 x 1080 picture (default 340 60 460 720); --ref-box crops the reference first. It writes one JPEG
where it is named and prints its size and the page's errors; exit code 1 when the page reported an error
(0 until 2026-10-21), else 0. It waits up to 180 s for the page to load (the hero film paints its forests as it loads), and for its web fonts.
"""
import argparse
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

from render import FONTS


def shots(page_file, seconds, box):
    """The box cut from the page's picture at each second named: (cuts, errors).

    page_file: the page. seconds: a list of seconds. box: [x, y, w, h] in screen pixels. cuts are PIL images,
    w x h each; errors are what the page reported.
    e.g. shots("fonlep.html", [1, 3.2], [340, 60, 460, 720])"""
    cuts, errors = [], []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(Path(page_file).resolve().as_uri(), timeout=180000)   # the hero film paints its forests as it loads
        page.evaluate(FONTS)                      # the page's web fonts first, as render.py loads them
        page.evaluate("rendering = true")
        for second in seconds:
            page.evaluate("draw(%f)" % second)
            shot = Image.open(io.BytesIO(page.screenshot(type="png")))
            cuts.append(shot.crop((box[0], box[1], box[0] + box[2], box[1] + box[3])))
        browser.close()
    return cuts, errors


def main():
    """The command line: peek.py PAGE OUT [--box X Y W H] [--ref FILE [--ref-box X Y W H]] SECONDS..."""
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("out")
    parser.add_argument("--box", nargs=4, type=int, default=[340, 60, 460, 720])
    parser.add_argument("--ref")
    parser.add_argument("--ref-box", nargs=4, type=int, default=None, help="x y w h of the reference to show")
    parser.add_argument("seconds", nargs="+", type=float)
    args = parser.parse_args()
    cuts, errors = shots(args.page, args.seconds, args.box)
    tall = args.box[3]
    tiles = []
    if args.ref:
        ref = Image.open(args.ref).convert("RGB")
        if args.ref_box:
            ref = ref.crop((args.ref_box[0], args.ref_box[1], args.ref_box[0] + args.ref_box[2], args.ref_box[1] + args.ref_box[3]))
        tiles.append(ref.resize((int(ref.width * tall / ref.height), tall), Image.LANCZOS))
    tiles += [cut.convert("RGB") for cut in cuts]
    sheet = Image.new("RGB", (sum(t.width for t in tiles) + 8 * (len(tiles) + 1), tall + 16), "#222")
    x = 8
    for tile in tiles:
        sheet.paste(tile, (x, 8))
        x += tile.width + 8
    sheet.save(args.out, quality=92)
    print("%s: %d cuts at %s, %dx%d" % (args.out, len(cuts), args.seconds, sheet.width, sheet.height))
    for error in errors:
        print("the page reported an error:", error)
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
