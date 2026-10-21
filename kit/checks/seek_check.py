"""seek_check.py [page.html ...]  - is every frame worked out from its second alone, as a still and a render need?

    python checks/seek_check.py                    # the lint, and the back test on every film scene (*/s*.html)
    python checks/seek_check.py maeng/s04.html     # the lint, and one page

The kit's rule is that a still is the film's own frame: render.py, stills.py and scenes.py ask a page for any
second in any order, so nothing a page draws may hang on the clock of the computer or on what it drew before.
Two checks (the idea from HyperFrames' seekable timelines, 2026-10-19; nothing of its code):

  lint   no script of the kit, of a film's scenes or of a page reads the computer's time or keeps it going by
         itself: Date.now, new Date, performance.now, setTimeout, setInterval, Math.random (unseeded: the kit's
         dice() is seeded). A page's play() is let off: it is what plays the page live, and it hands draw() the
         time it is given.
  back   a frame come to after a later one is the same as the frame come to first: second 0.3 of the page's
         length is drawn on a fresh page, then 0.85 of it, then 0.3 again, and the two pictures of 0.3 compared
         by kit_check.py's rule (frames.py: a pixel counts when a shift of one pixel does not explain it). A page
         passes with fewer than kit_check's SAME_LIMIT. kit_check's "same" comes to a frame forward, by a jump and
         by a run; this comes back to one, which is where a creature that remembers where it was goes wrong.
Each item is written down, PASS or FAIL (or SKIP), in out/checks/seek_check.txt (report.py). With --changed, a page
is come back to only when it or a script it loads has changed since it last passed. Exits 1 if either finds anything.

It needs Google Chrome (through Playwright), numpy, scipy and Pillow. Pages are named from the kit's folder
(kit/). It runs main() as it is loaded: do not import it.
"""
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from frames import differ, frame_at, open_page  # noqa: E402
from report import Report, fingerprint  # noqa: E402

KIT = Path(__file__).resolve().parent.parent
LIMIT = 50                                           # kit_check.py's SAME_LIMIT
CLOCKS = re.compile(r"\bDate\.now\s*\(|\bnew\s+Date\s*\(|\bperformance\.now\s*\(|\bsetTimeout\s*\(|\bsetInterval\s*\(|\bMath\.random\s*\(")


def without_play(text):
    """A page's script with its play() taken out (the one place that is given the computer's time).

    text: a page's script. Gives back the text with "function play(" ... its closing brace cut out, or the
    text as it was when it has no play(). e.g. without_play(script)"""
    start = text.find("function play(")
    if start < 0:
        return text
    depth, k = 0, text.index("{", start)
    for k in range(k, len(text)):
        depth += {"{": 1, "}": -1}.get(text[k], 0)
        if depth == 0:
            break
    return text[:start] + text[k + 1:]


def lint():
    """Every line of the kit's scripts and pages that reads the computer's clock (CLOCKS), a page's play() let off.

    Gives back a list of "path:line  the line" strings; [] when there are none.
    e.g. found = lint()"""
    found = []
    scripts = [p for p in list(KIT.glob("*.js")) + list(KIT.glob("*/*.js")) if "node_modules" not in p.parts]
    pages = [p for p in list(KIT.glob("*.html")) + list(KIT.glob("*/*.html")) if "node_modules" not in p.parts]
    for path in sorted(scripts) + sorted(pages):
        text = path.read_text(encoding="utf-8", errors="replace")
        if path.suffix == ".html":
            text = "\n".join(without_play(block) for block in re.findall(r"<script>(.*?)</script>", text, re.S))
        for number, line in enumerate(text.splitlines(), 1):
            if CLOCKS.search(line.split("//")[0]):
                found.append("%s:%d  %s" % (path.relative_to(KIT).as_posix(), number, line.strip()[:100]))
    return found


def page_files(page_file):
    """A page and every script it loads: what its back test depends on.

    page_file: the page, a Path. Gives back a list of Paths (frames.py among them, since the test uses it).
    e.g. fingerprint(page_files(KIT / "maeng" / "s04.html"))"""
    names = re.findall(r'<script src="([^":]+)"', page_file.read_text(encoding="utf-8"))
    return [page_file] + [page_file.parent / name for name in names] + [KIT / "checks" / "frames.py"]


def back(browser, page_file):
    """The back test on one page: draw 0.3 of its length, then 0.85, then 0.3 again, and compare the two pictures.

    browser: a Playwright browser. page_file: the page, a Path. Gives back ((differ, counted), errors): differ()'s
    two counts, and the page's errors.
    e.g. (apart, counted), errors = back(browser, KIT / "maeng" / "s04.html")"""
    errors = []
    page = open_page(browser, page_file, errors)
    long = page.evaluate("DURATION")
    first = frame_at(page, long * 0.3)
    frame_at(page, long * 0.85)
    again = frame_at(page, long * 0.3)
    page.close()
    return differ(first, again), errors


def main():
    """The command line: seek_check.py [PAGE ...] [--changed]: run the lint, then the back test on each page."""
    names = [a for a in sys.argv[1:] if a.endswith(".html")]
    changed = "--changed" in sys.argv
    report = Report("seek_check")
    pages = [(KIT / n).resolve() for n in names] if names else sorted(p for p in KIT.glob("*/s[0-9]*.html") if "node_modules" not in p.parts)
    found, failed = lint(), 0
    for line in found:
        print("lint  " + line)
    print("lint: %d clock%s read by a script" % (len(found), "" if len(found) == 1 else "s"))
    report.record("lint", not found, "%d clocks read%s" % (len(found), (": " + "; ".join(found)) if found else ""))
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        for page_file in pages:
            name = page_file.relative_to(KIT).as_posix() if KIT in page_file.parents else page_file.name
            mark = fingerprint(page_files(page_file))
            if changed and report.unchanged(name, mark):
                report.skip(name, "nothing it loads has changed since it passed")
                print("back  %-16s left out: nothing it loads has changed since it passed" % name)
                continue
            (apart, counted), errors = back(browser, page_file)
            report.record(name, not (counted >= LIMIT or errors), "%d differ, %d past a pixel's shift%s"
                          % (apart, counted, ("; page error: " + errors[0]) if errors else ""))
            if not (counted >= LIMIT or errors):
                report.passed_with(name, mark)
            bad = counted >= LIMIT or errors
            failed += bool(bad)
            print("back  %-16s %6d pixels differ, %5d of them past a pixel's shift%s%s"
                  % (page_file.relative_to(KIT).as_posix() if KIT in page_file.parents else page_file.name, apart, counted, "  FAILS" if counted >= LIMIT else "",
                     "  page error: " + errors[0] if errors else ""))
        browser.close()
    print("back: %d of %d pages fail" % (failed, len(pages)))
    report.finish()
    sys.exit(1 if found or failed else 0)


main()
