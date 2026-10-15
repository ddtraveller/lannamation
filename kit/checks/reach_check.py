"""reach_check.py [page.html]  - does a wrist sent to a point of the scene come to it?

    python checks/reach_check.py                 # together.html

A look's reachA or reachB sends a wrist to a point. The page keeps, in MISSED, how far each such wrist came to
rest from its point in the frame just drawn, and whether the point was within the arm's length. Every frame of
the page is drawn. For each reach it prints the worst miss while the point was within reach, and the worst
while it was not. A wrist more than LIMIT pixels from a point it could reach is a failure (exit code 1).
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent.parent      # the folder the kit and its pages are in
LIMIT = 2.0                                        # pixels of the sheet

EVERY_FRAME = """() => {
  var worst = {};
  rendering = true;
  for (var frame = 0; frame < Math.round(DURATION * 30); frame++) {
    draw(frame / 30);
    MISSED.forEach(function (row) {
      var kept = worst[row[0]] || (worst[row[0]] = {within: 0, beyond: 0, frames: 0, out: 0});
      kept.frames++;
      if (row[2]) { kept.within = Math.max(kept.within, row[1]); }
      else { kept.beyond = Math.max(kept.beyond, row[1]); kept.out++; }
    });
  }
  return worst;
}"""


def main():
    name = sys.argv[1] if len(sys.argv) > 1 else "together.html"
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto((HERE / name).as_uri())
        worst = page.evaluate(EVERY_FRAME)
        warnings = page.evaluate("typeof WARNINGS === 'undefined' ? [] : WARNINGS.slice()")
        browser.close()
    failed = len(errors) + len(warnings)
    for label, kept in worst.items():
        line = "%-34s within reach: %.1f px off at worst" % (label, kept["within"])
        if kept["out"]:
            line += "; out of reach in %d of %d frames: up to %.1f px short" % (kept["out"], kept["frames"], kept["beyond"])
        print(line)
        if kept["within"] > LIMIT:
            print("    FAILED: a wrist is more than %.1f px from a point it can reach" % LIMIT)
            failed += 1
    for line in warnings + errors:
        print("    FAILED:", line)
    print("%s: %d failures" % (name, failed))
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
