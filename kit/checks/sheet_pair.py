"""sheet_pair.py other_kit.js out.png page.html second [x y w h]  - one frame of a page with the repo's kit (left) and another kit (right).

The frame is come to by a jump with the page being rendered, as a still is. The box is the part of the 1440 x 1080
sheet to keep (all of it unless told).
"""
import base64
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ASSETS = Path(__file__).resolve().parent.parent      # the folder the kit and its pages are in


def frame(browser, page_file, kit, second):
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.on("pageerror", lambda error: print("PAGE ERROR", error))
    if kit:
        page.route("**/oldcartoon.js", lambda route: route.fulfill(path=kit, content_type="text/javascript"))
    page.goto(page_file.as_uri())
    page.evaluate("rendering = true")
    page.evaluate("draw(%f)" % second)
    url = page.evaluate("pen.canvas.toDataURL('image/png')")
    page.close()
    return Image.open(io.BytesIO(base64.b64decode(url.split(",", 1)[1]))).convert("RGB")


def main():
    kit, out, name, second = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
    box = [int(v) for v in sys.argv[5:9]] if len(sys.argv) > 8 else [0, 0, 1440, 1080]
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", args=["--allow-file-access-from-files"])
        pictures = [frame(browser, ASSETS / name, None, second), frame(browser, ASSETS / name, kit, second)]
        browser.close()
    crops = [p.crop((box[0], box[1], box[0] + box[2], box[1] + box[3])) for p in pictures]
    pair = Image.new("RGB", (crops[0].width * 2 + 8, crops[0].height), "#222222")
    pair.paste(crops[0], (0, 0))
    pair.paste(crops[1], (crops[0].width + 8, 0))
    pair.save(out)
    print(out, pair.size)


if __name__ == "__main__":
    main()
