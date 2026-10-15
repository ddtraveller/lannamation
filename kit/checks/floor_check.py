"""floor_check.py [page.html]  - does the seat of one who sits stay on the ground?

    python checks/floor_check.py                 # floor.html

A look's floor seats a figure on the ground. The page keeps, in SEATS, where each figure's hips, a knee and its
neck came to on the sheet in the frame just drawn. Every frame of the page is drawn. For each figure it prints how
far each of the three travelled over the page, in pixels of the sheet: the hips and the knee should hardly move,
and the neck should, because the beat moves what is above the seat. Hips that travel more than SEAT pixels, a
knee that travels more than KNEE, or a neck that travels less than the hips, is a failure (exit code 1).
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent.parent      # the folder the kit and its pages are in
SEAT, KNEE = 8.0, 6.0                              # pixels of the sheet

EVERY_FRAME = """() => {
  var box = {};
  rendering = true;
  for (var frame = 0; frame < Math.round(DURATION * 30); frame++) {
    draw(frame / 30);
    SEATS.forEach(function (row, n) {
      var kept = box[n + " " + row[0]] || (box[n + " " + row[0]] = [null, null, null]);
      for (var k = 0; k < 3; k++) {
        var p = row[k + 1], b = kept[k] || (kept[k] = [p[0], p[1], p[0], p[1]]);
        b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]);
        b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]);
      }
    });
  }
  return box;
}"""


def travel(b):
    return max(b[2] - b[0], b[3] - b[1])


def main():
    name = sys.argv[1] if len(sys.argv) > 1 else "floor.html"
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto((HERE / name).as_uri())
        box = page.evaluate(EVERY_FRAME)
        warnings = page.evaluate("typeof WARNINGS === 'undefined' ? [] : WARNINGS.slice()")
        browser.close()
    failed = len(errors) + len(warnings)
    for label, kept in box.items():
        hips, knee, neck = travel(kept[0]), travel(kept[1]), travel(kept[2])
        print("%-30s hips %.1f px, knee %.1f px, neck %.1f px" % (label.split(" ", 1)[1], hips, knee, neck))
        if hips > SEAT or knee > KNEE or neck < hips:
            print("    FAILED: the seat does not stay put, or nothing above it moves")
            failed += 1
    for line in warnings + errors:
        print("    FAILED:", line)
    print("%s: %d figures, %d failures" % (name, len(box), failed))
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
