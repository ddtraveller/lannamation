"""strip.py page out.png t0 dt n x y w h  - n crops of frames t0, t0+dt, ... side by side, one browser."""
import sys
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

def main():
    page_file, out, t0, dt, n = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), int(sys.argv[5])
    x, y, w, h = [int(v) for v in sys.argv[6:10]]
    frames = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.goto(Path(page_file).resolve().as_uri())
        page.evaluate("rendering = true")
        for k in range(n):
            page.evaluate("draw(%f)" % (t0 + dt * k))
            shot = out + ".%d.png" % k
            page.screenshot(path=shot)
            frames.append(Image.open(shot).crop((x, y, x + w, y + h)))
        browser.close()
    strip = Image.new("RGB", (w * n, h))
    for k, frame in enumerate(frames):
        strip.paste(frame, (w * k, 0))
        Path(out + ".%d.png" % k).unlink()
    strip.save(out)
    print(out, strip.size)

if __name__ == "__main__":
    main()
