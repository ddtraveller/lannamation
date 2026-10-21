"""frame_time.py - where a frame's time goes, and how many figures lie off the sheet.

    python checks/frame_time.py lanna.html            one frame a second
    python checks/frame_time.py lanna.html --step 0.5 two a second

It opens the page like stills.py, wraps person() and crowd() to time them and to
count the figures whose place, through the pen's transform, lies outside the
sheet by more than their own height, then calls draw(t) across the film and
prints, per second, the frame's milliseconds, the share spent in figures, and
the figures drawn and off the sheet. Run it before and after a speed change:
the numbers are the reason for the change, or the reason not to make it.

It needs Google Chrome (through Playwright). The page must have DURATION. It writes nothing, and ends with
exit code 0; the times are of this computer's Chrome, so compare runs on one computer only.
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

WRAP = """
(() => {
  window.FT = { person: 0, crowd: 0, people: 0, off: 0, frame: 0 };
  const sheetW = WIDE, sheetH = 1080;
  const old = person;
  person = function (x, y, look) {
    const m = pen.getTransform();
    const sx = m.a * x + m.c * y + m.e, sy = m.b * x + m.d * y + m.f;
    const reach = 450 * ((look && look.size) || 1) * Math.max(m.a, m.d);
    FT.people++;
    if (sx < -reach || sx > sheetW + reach || sy < -reach || sy > sheetH + reach) { FT.off++; }
    const s = performance.now();
    const r = old.apply(this, arguments);
    FT.person += performance.now() - s;
    return r;
  };
  if (typeof crowd === "function") {
    const oldCrowd = crowd;
    crowd = function () {
      const s = performance.now();
      const r = oldCrowd.apply(this, arguments);
      FT.crowd += performance.now() - s;
      return r;
    };
  }
})();
"""

TIME_ONE = """
(t) => {
  FT.person = 0; FT.crowd = 0; FT.people = 0; FT.off = 0;
  const s = performance.now();
  draw(t);
  FT.frame = performance.now() - s;
  return [FT.frame, FT.person, FT.crowd, FT.people, FT.off];
}
"""


def measure(page_file, step):
    """Time the page's frames: one row for each second drawn, [second, frame ms, figures ms, crowd ms, figures, off].

    page_file: the page. step: the seconds between frames timed (1.0 one a second). Each frame is drawn after the
    frame before it, so settled() does not pre-roll; person() and crowd() are wrapped to time them.
    e.g. rows = measure("lanna.html", 0.5)"""
    rows = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.goto(Path(page_file).resolve().as_uri())
        page.evaluate("rendering = true")
        duration = page.evaluate("DURATION")
        page.evaluate("draw(0)")                     # the first frame pays for fonts and sets
        page.evaluate(WRAP)
        t = 0.0
        while t < duration:
            page.evaluate("draw(%f)" % max(0, t - 1 / 30))   # the frame before, so settled() does not pre-roll
            rows.append([t] + page.evaluate(TIME_ONE, t))
            t += step
        browser.close()
    return rows


def main():
    """The command line: frame_time.py PAGE [--step S]: print each frame's times and the means."""
    page_file = sys.argv[1]
    step = float(sys.argv[sys.argv.index("--step") + 1]) if "--step" in sys.argv else 1.0
    rows = measure(page_file, step)
    print("%6s %8s %8s %8s %7s %5s" % ("second", "frame ms", "people", "crowd", "figures", "off"))
    for t, frame, person, crowd, people, off in rows:
        print("%6.1f %8.1f %8.1f %8.1f %7d %5d" % (t, frame, person, crowd, people, off))
    n = len(rows)
    frame = sum(r[1] for r in rows) / n
    person = sum(r[2] for r in rows) / n
    crowd = sum(r[3] for r in rows) / n
    people = sum(r[4] for r in rows)
    off = sum(r[5] for r in rows)
    print("%s: %d frames, mean %.1f ms a frame; figures %.1f ms (%.0f%%), crowd %.1f ms (%.0f%%); "
          "%d figures drawn, %d off the sheet (%.1f%%)"
          % (page_file, n, frame, person, 100 * person / frame, crowd, 100 * crowd / frame,
             people, off, 100 * off / max(1, people)))


if __name__ == "__main__":
    main()
