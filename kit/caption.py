"""caption.py - a line in the kit's subtitle style, alone on a clear 1920 x 1080 picture, to lay over a video.

    python caption.py thanks.png "ขอบคุณเป๋นพิเศษเจ้า Jing's Kitchen" "特别感谢 Jing's Kitchen" "Special thanks to Jing's Kitchen"
    python chain.py series.mp4 a.mp4 b.mp4 tale.mp4 --over thanks.png,890.5,897.3

For words that come after a film is rendered: drawn by the kit's own subtitle() (oldcartoon.js: the big line, and
the small one under it), in Chrome as render.py draws, onto a clear sheet, so it is the same as the film's own
subtitles. Given more than two lines, every line but the last is a big one, stacked up from the subtitles' place
(a line in each of three languages: Kam Mueang, Chinese, then English small under them), and the last is the small
one. chain.py --over lays it over the joined film from one second to another, fading in and out, as the films are
encoded again: nothing of the film is rendered again.
"""
import base64
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
PAGE = """<!doctype html><html><head><meta charset="utf-8"></head><body>
<canvas id="stage" width="1920" height="1080"></canvas>
<script src="%s"></script></body></html>"""


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    out, lines = sys.argv[1], sys.argv[2:]
    bigs, small = (lines, None) if len(lines) == 1 else (lines[:-1], lines[-1])
    page_file = HERE / "out" / "caption_page.html"
    page_file.parent.mkdir(exist_ok=True)
    page_file.write_text(PAGE % (HERE / "oldcartoon.js").as_uri(), encoding="utf-8")
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page()
        page.goto(page_file.as_uri())
        data = page.evaluate("""([bigs, small]) => {
            var sheet = document.createElement("canvas");
            sheet.width = 1920; sheet.height = 1080;
            var keep = screen;
            screen = sheet.getContext("2d");
            subtitle(bigs[bigs.length - 1], small || undefined);      // the last big line and the small one, in their place
            for (var k = bigs.length - 2; k >= 0; k--) {              // the others above, a big line's height each
                screen.setTransform(1, 0, 0, 1, 0, -66 * (bigs.length - 1 - k));
                subtitle(bigs[k]);
            }
            screen = keep;
            return sheet.toDataURL("image/png");
        }""", [bigs, small])
        browser.close()
    Path(out).write_bytes(base64.b64decode(data.split(",", 1)[1]))
    page_file.unlink()
    print(out + ": the caption, on a clear 1920 x 1080 picture")


if __name__ == "__main__":
    main()
