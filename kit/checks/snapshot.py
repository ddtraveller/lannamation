"""snapshot.py save|compare [--exact] [page.html ...]  - stills of a film's key moments, kept, and compared after a change.

    python checks/snapshot.py save                  # every page that loads the kit: its stills into out/snapshots/
    python checks/snapshot.py compare               # draw them again and compare with what was saved
    python checks/snapshot.py compare --exact       # a change meant to move no pixel (a refactor): any pixel counts
    python checks/snapshot.py save maeng/s04.html   # one page

The pages are a film's scenes (*/s*.html) and the kit's own sheets (every page beside the kit that loads
oldcartoon.js, as kit_check.py finds them); a page that needs a script which is not on this computer is left out,
and said so.

Before a change to the kit, save; after it, compare. A film's scenes load the kit's shared files (beasts.js,
pieces.js, myth.js, oldcartoon.js), and a change made for one film can move something in another nobody is
looking at: this shows which page, at which second, and how much (the idea from HyperFrames' golden snapshots,
2026-10-19; nothing of its code). The stills of a page are its key moments: its first frame, a second into each
of its lines (a scene's SNN_LINES, or any LINES the page has), and its last frame; a page with no lines gets six
seconds spread over it. They are kept at half size (960 x 540), outside the repository (out/ is not kept), and
compared by kit_check.py's rule (frames.py), at half size both. A moment where a shift of one pixel does not
explain HALF_LIMIT pixels or more is a change, and is saved beside its still as NAME_now.png, with NAME_diff.png
showing where it differs, to look at. With --exact, a moment changes when any pixel of its still differs at all:
for a change that should move nothing, such as person() taken apart into its stages, on the same computer and
Chrome as the stills were saved with. Each moment compared is written down, PASS or FAIL, in out/checks/
snapshot.txt (report.py). Exits 1 if anything changed, or a still is missing.

It needs Google Chrome (through Playwright), numpy, scipy and Pillow. Pages are named from the kit's folder
(kit/). Each page's stills are in out/snapshots/PATH__NAME/ (000.05.png ... and moments.json). The report is
written as out/checks/snapshot_save.txt or snapshot_compare.txt, one for each. save ends with exit code 0
even when a page errs; with neither save nor compare it prints this and ends with exit code 1. It runs
main() as it is loaded: do not import it.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from frames import differ, frame_at, open_page  # noqa: E402
from kit_check import missing_of, pages_of  # noqa: E402
from report import Report  # noqa: E402

KIT = Path(__file__).resolve().parent.parent
OUT = KIT / "out" / "snapshots"
HALF_LIMIT = 25                                       # kit_check's SAME_LIMIT of 50, at a quarter of the pixels, kept at half

MOMENTS = """() => {
  var long = DURATION, lines = null;
  Object.keys(window).forEach(function (name) {       // a scene's lines: S04_LINES, or any LINES the page has
    if (/^(S\\d+_)?LINES$/.test(name) && Array.isArray(window[name])) { lines = window[name]; }
  });
  var at = [0.05];
  if (lines) { lines.forEach(function (line) { at.push(Math.min(long - 0.1, line[0] + 1.0)); }); }
  else { for (var k = 1; k <= 6; k++) { at.push(long * k / 7); } }
  at.push(long - 0.05);
  return at.map(function (t) { return Math.round(t * 100) / 100; });
}"""


def half(picture):
    """A picture (height, width, 3) at half of 1920 x 1080: 960 x 540, as a numpy array of int16.

    e.g. half(frame_at(page, 2.0))"""
    return np.asarray(Image.fromarray(picture.astype(np.uint8)).resize((960, 540), Image.LANCZOS)).astype(np.int16)


def folder_of(page_file):
    """Where a page's stills are kept: out/snapshots/ and its path from the kit's folder, "/" as "__" (a Path).

    e.g. folder_of(KIT / "maeng" / "s04.html")     # out/snapshots/maeng__s04"""
    return OUT / page_file.relative_to(KIT).with_suffix("").as_posix().replace("/", "__")


def main():
    """The command line: snapshot.py save|compare [--exact] [PAGE ...] (see this file's docstring)."""
    if len(sys.argv) < 2 or sys.argv[1] not in ("save", "compare"):
        sys.exit(__doc__)
    doing, names = sys.argv[1], [n for n in sys.argv[2:] if n != "--exact"]
    exact = "--exact" in sys.argv[2:]
    pages = [(KIT / n).resolve() for n in names] if names else         sorted(p for p in KIT.glob("*/s[0-9]*.html") if "node_modules" not in p.parts) + pages_of([])
    changed = 0
    report = Report("snapshot_" + doing)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        for page_file in pages:
            missing = missing_of(page_file)
            if missing:
                print("left out  %-16s it needs %s, which is not here" % (page_file.relative_to(KIT).as_posix(), ", ".join(missing)))
                report.skip(page_file.relative_to(KIT).as_posix(), "it needs %s, which is not here" % ", ".join(missing))
                continue
            folder, errors = folder_of(page_file), []
            page = open_page(browser, page_file, errors)
            moments = page.evaluate(MOMENTS)
            folder.mkdir(parents=True, exist_ok=True)
            if doing == "save":
                for t in moments:
                    Image.fromarray(half(frame_at(page, t)).astype(np.uint8)).save(folder / ("%06.2f.png" % t))
                (folder / "moments.json").write_text(json.dumps(moments), encoding="utf-8")
                print("save     %-16s %d stills" % (page_file.relative_to(KIT).as_posix(), len(moments)))
                report.record(page_file.relative_to(KIT).as_posix(), True, "%d stills saved" % len(moments))
            else:
                for t in moments:
                    kept = folder / ("%06.2f.png" % t)
                    if not kept.exists():
                        print("compare  %-16s %6.2f s  no still saved" % (page_file.relative_to(KIT).as_posix(), t))
                        report.record("%s %.2f s" % (page_file.relative_to(KIT).as_posix(), t), False, "no still saved")
                        changed += 1
                        continue
                    now = half(frame_at(page, t))
                    then = np.asarray(Image.open(kept).convert("RGB")).astype(np.int16)
                    apart, counted = differ(then, now)
                    if exact:                                 # any pixel at all
                        apart = counted = int((then != now).any(axis=2).sum())
                    limit = 1 if exact else HALF_LIMIT
                    if counted >= limit:
                        changed += 1
                        Image.fromarray(now.astype(np.uint8)).save(folder / ("%06.2f_now.png" % t))
                        mark = (np.abs(then - now) > 24).any(axis=2)
                        diff = (then * 0.35).astype(np.uint8)
                        diff[mark] = [255, 60, 60]
                        Image.fromarray(diff).save(folder / ("%06.2f_diff.png" % t))
                    report.record("%s %.2f s" % (page_file.relative_to(KIT).as_posix(), t), counted < limit,
                                  "%d differ, %d past a pixel's shift" % (apart, counted))
                    print("compare  %-16s %6.2f s  %6d differ, %5d past a pixel's shift%s"
                          % (page_file.relative_to(KIT).as_posix(), t, apart, counted, "  CHANGED" if counted >= limit else ""))
            if errors:
                print("         page error: %s" % errors[0])
                changed += 1
            page.close()
        browser.close()
    report.finish()
    if doing == "compare":
        print("%d moment%s changed or missing" % (changed, "" if changed == 1 else "s"))
        sys.exit(1 if changed else 0)


main()
