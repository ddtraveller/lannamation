"""heads_tall.py [build ...]  - how many heads tall each of the kit's cast stands, at each build.

    python checks/heads_tall.py              # builds 0, 0.5 and 1
    python checks/heads_tall.py 0 0.25 1

A figure's height is measured in its own heads: from the ground to the crown of the skull, over the crown to the
chin. person() gives back where the crown and the chin came to. Each of the cast is drawn standing straight
(up: 1), with each build in turn, on build.html, which needs nothing but the kit.

It needs Google Chrome (through Playwright) and build.html in the kit's folder. It prints a table, one row
for each of CAST, and ends with exit code 0.
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent.parent      # the folder the kit and its pages are in

MEASURE = """([builds]) => {
  var ground = 1000;
  return Object.keys(CAST).map(function (name) {
    return [name].concat(builds.map(function (build) {
      var joints = person(-3000, ground, cast(name, {up: 1, build: build}));
      return (ground - joints.crown[1]) / (joints.chin[1] - joints.crown[1]);
    }));
  });
}"""


def main():
    """The command line: heads_tall.py [BUILD ...]: draw each of the cast at each build and print how many heads tall."""
    builds = [float(word) for word in sys.argv[1:]] or [0, 0.5, 1]
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page()
        page.goto((HERE / "build.html").as_uri())
        page.evaluate("rendering = true")
        rows = page.evaluate(MEASURE, [builds])
        browser.close()
    print("%-10s" % "heads tall" + "".join("%12s" % ("build %g" % build) for build in builds))
    for row in rows:
        print("%-10s" % row[0] + "".join("%12.2f" % heads for heads in row[1:]))


if __name__ == "__main__":
    main()
