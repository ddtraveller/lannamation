"""kit_check.py [page.html ...] [--quick]  - one check of the kit: every page that uses it still draws, and draws right.

    python checks/kit_check.py                 # every page beside the kit that loads oldcartoon.js
    python checks/kit_check.py lanna.html      # one page
    python checks/kit_check.py --quick         # without the arms, which take the longest
    python checks/kit_check.py model.html --quick --settle 30     # "same" as it would be with a pre-roll of 30 frames

Run it after any change to oldcartoon.js. First the kit's own list: every key of a "look" that the kit reads must be
written down in the comment above person(), and every key written there must be read. Then the names: no top-level
name may be defined in two script files beside the kit, since the one loaded last silently replaces the other. Then
for each page, in Chrome with no window:
  draws     the page loads, and draws 24 frames spread over its length, with no error
  same      a still shows what the film shows. A frame come to by a jump of the clock, as a still comes to it, is
            compared with the same frame come to by running the four seconds before it, pixel by pixel on the film's
            own sheet, at two places in the page. Two numbers, each the worse of the two places: how many pixels
            differ by more than 24 in a colour, and how many of those a shift of one pixel does not explain (a line
            lying a part of a pixel aside changes the pixels along its edge, and nobody sees it; a pixel counts when
            its colour is outside what the other picture has within one pixel of it). A page passes with fewer than
            SAME_LIMIT of the second. The kit's settled() is what brings a jump that near: a page whose draw() does
            not use it shows what hangs at rest, and fails here.
  arms      what arms_check.py counts over the whole page: elbows that flip, upper arms that point in toward the
            spine, forearms folded past 150 degrees. A page passes with none, or with no more than KNOWN allows.
  ms        how long one frame takes to draw, after a warm-up (whatever is timed first comes out about five times
            too slow)
  cues      only for a page with a song's cue sheet (CUES): every line of the song is sung inside one scene (a cut
            in the middle of a line fails), and has ended before the next line begins. One more line is printed
            under the page's.
A page that needs a file which is not on this computer (a page's pictures are not kept in git) is left out, and said
so. It prints one line a page, then what failed, and ends with exit code 1 if anything did.
"""
import argparse
import re
import sys
from pathlib import Path

from playwright.sync_api import Error, sync_playwright

import arms_check

HERE = Path(__file__).resolve().parent.parent

# Faults that are known, with why. A page may have these and no more.
KNOWN = {
    "dance.html": {"flips": 7, "why": "the tracked wrist lies within 12 units of its shoulder in those frames"},
    "sash.html": {"folded": 4, "why": "the first frame of each wai (20.0, 28.3, 29.2 and 35.0 s): while the elbow swings across by way of the shoulder (bendOf), the blended elbow measures 154-155 degrees for that one frame; each candidate elbow is within ELBOW"},
}

PLACES = (0.4, 0.78)      # where in a page "same" is measured, as parts of its length
RUN = 120                 # the frames of the run a jump is compared with
SAME_LIMIT = 50           # pixels of the 1440 x 1080 sheet that a shift of one pixel does not explain

DRAWS = """([long]) => {
  rendering = false;                                  // as a page watched live: one frame is one frame
  try {
    for (var k = 0; k < 24; k++) { draw(long * (k + 0.5) / 24); }
  } finally { rendering = true; }
}"""

SAME = """([frame, back, long]) => {
  function sheet() { return pen.getImageData(0, 0, WIDE, 1080).data; }
  var t = frame / 30;
  try {
    rendering = false;
    draw(t > long / 2 ? t - long * 0.4 : t + long * 0.4);   // somewhere else first, so that t is come to by a jump
    rendering = true;
    draw(t);                                                // the jump, as a still comes to it
    var jumped = sheet();
    rendering = false;                                      // the run: from rest, every frame up to t
    for (var n = Math.max(0, frame - back); n <= frame; n++) { draw(n / 30); }
  } finally { rendering = true; }
  var run = sheet(), differ = 0, past = 0;
  // is the colour of pixel (x, y) of "one" outside what "other" has within a pixel of there, by more than 24?
  function outside(one, other, x, y) {
    for (var c = 0; c < 3; c++) {
      var low = 255, high = 0;
      for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
          var px = Math.min(WIDE - 1, Math.max(0, x + dx)), py = Math.min(1079, Math.max(0, y + dy));
          var v = other[(py * WIDE + px) * 4 + c];
          if (v < low) { low = v; }
          if (v > high) { high = v; }
        }
      }
      var mine = one[(y * WIDE + x) * 4 + c];
      if (mine < low - 24 || mine > high + 24) { return true; }
    }
    return false;
  }
  for (var y = 0; y < 1080; y++) {
    for (var x = 0; x < WIDE; x++) {
      var i = (y * WIDE + x) * 4;
      if (Math.abs(run[i] - jumped[i]) > 24 || Math.abs(run[i + 1] - jumped[i + 1]) > 24 || Math.abs(run[i + 2] - jumped[i + 2]) > 24) {
        differ++;
        if (outside(run, jumped, x, y) || outside(jumped, run, x, y)) { past++; }
      }
    }
  }
  return [differ, past];
}"""

CUES = """() => {
  if (typeof CUES === "undefined" || typeof SCENES === "undefined") { return null; }
  var bad = [];
  CUES.forEach(function (cue, n) {
    var from = cue[0] * BEAT, to = from + cue[1].split(" ").length * BEAT;
    var whole = SCENES.some(function (scene) { return from >= scene[0] && to <= scene[1]; });
    if (!whole) { bad.push("line " + (n + 1) + " of the song (" + from + " to " + to + " s) is cut by a change of scene"); }
    if (n + 1 < CUES.length && to > CUES[n + 1][0] * BEAT) {
      bad.push("line " + (n + 1) + " of the song is still being sung when line " + (n + 2) + " begins");
    }
  });
  return {lines: CUES.length, bad: bad};
}"""

TIME = """([t]) => {
  rendering = false;
  try {
    for (var k = 0; k < 5; k++) { draw(t + k / 30); }   // the warm-up
    var a = performance.now();
    for (k = 5; k < 25; k++) { draw(t + k / 30); }
    pen.getImageData(0, 0, 1, 1);                       // force what was drawn to be painted
    return (performance.now() - a) / 20;
  } finally { rendering = true; }
}"""


def pages_of(names):
    if names:
        return [HERE / n for n in names]
    return sorted(p for p in HERE.glob("*.html") if 'src="oldcartoon.js"' in p.read_text(encoding="utf-8"))


def keys_of(kit):
    """The look keys the kit reads, the ones written down in the comment above person(), and the ones in LOOK_KEYS,
    the list the browser reads to warn about a name it does not know."""
    source = kit.read_text(encoding="utf-8")
    read = set(re.findall(r"\blook\.([A-Za-z]\w*)", source))
    start = source.index("// One villager, standing on (x, y)")
    written = set()
    for line in source[start:source.index("function person(", start)].splitlines():
        names = re.match(r"//   ([A-Za-z][\w, ]*?)(?:  |$)", line)     # "//   name, name   what they are"
        if names:
            written.update(name.strip() for name in names.group(1).split(",") if name.strip())
    listed = re.search(r"var LOOK_KEYS = \{\};\s*\[(.*?)\]\.forEach", source, re.S)
    listed = set(re.findall(r'"(\w+)"', listed.group(1))) if listed else set()
    return read, written, listed


def shared_names():
    """Top-level names that two script files beside the kit both define. The files share one page, so the one loaded
    last silently replaces the other's: paperdoll.js's ribbon() replaced the kit's on 2026-10-14 and three sheets
    stopped drawing; puman.js's tattoo() replaced the kit's and nothing said so."""
    owners = {}
    for script in sorted(HERE.glob("*.js")):
        for name in set(re.findall(r"^(?:function|var|let|const) ([A-Za-z_]\w*)", script.read_text(encoding="utf-8"), re.M)):
            owners.setdefault(name, []).append(script.name)
    return {name: files for name, files in owners.items() if len(files) > 1}


def missing_of(page_file):
    """The script files a page asks for that are not on this computer."""
    asked = re.findall(r'<script src="([^":]+)"', page_file.read_text(encoding="utf-8"))
    return [name for name in asked if not (page_file.parent / name).exists()]


def check(browser, page_file, quick, settle=None):
    """One page: what was found, and a list of what failed."""
    missing = missing_of(page_file)
    if missing:
        return {"skipped": "left out: it needs %s, which is not here" % ", ".join(missing)}, []
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    own, found, failed = [], {}, []
    page.on("pageerror", lambda error: own.append(str(error)))
    try:
        page.goto(page_file.as_uri())
        page.evaluate("rendering = true")
        if settle is not None:
            page.evaluate("SETTLE = %d" % settle)
        found["long"] = long = page.evaluate("DURATION")
        page.evaluate(DRAWS, [long])
        found["draws"] = True
        found["warnings"] = page.evaluate("typeof WARNINGS === 'undefined' ? [] : WARNINGS.slice()")
        for warning in found["warnings"]:
            failed.append("the kit warns: %s" % warning)
        counts = [page.evaluate(SAME, [round(long * part * 30), RUN, long]) for part in PLACES]
        found["differ"], found["past"] = max(c[0] for c in counts), max(c[1] for c in counts)
        if found["past"] >= SAME_LIMIT:
            failed.append("a still does not show what the film shows: between a jump and a run %d pixels differ, "
                          "%d of them by more than a pixel's shift" % (found["differ"], found["past"]))
        found["ms"] = page.evaluate(TIME, [long * 0.3])
        found["cues"] = cues = page.evaluate(CUES)
        failed.extend(cues["bad"] if cues else [])
        if not quick:
            found["arms"] = arms = arms_check.measure(page)
            allowed = KNOWN.get(page_file.name, {})
            for kind in ("flips", "inward", "folded"):
                if len(arms[kind]) > allowed.get(kind, 0):
                    failed.append("%d arm %s (allowed %d)" % (len(arms[kind]), kind, allowed.get(kind, 0)))
    except Error as error:
        failed.append("an error: %s" % str(error).splitlines()[0])
    if own:
        failed.append("the page's own error: %s" % own[0])
    page.close()
    return found, failed


def line_of(name, found):
    """What was found on one page, as one line of the table."""
    arms = found.get("arms")
    told = "not run" if arms is None else "%d, %d, %d" % (len(arms["flips"]), len(arms["inward"]), len(arms["folded"]))
    if name in KNOWN and arms is not None:
        told += "   (known: %s)" % KNOWN[name]["why"]
    same = "%d / %d" % (found["differ"], found["past"]) if "past" in found else "-"
    return "%-16s %6s  %-7s %14s %9s  %s" % (
        name, "%.1f s" % found["long"] if "long" in found else "-", "yes" if found.get("draws") else "no",
        same, "%.1f" % found["ms"] if "ms" in found else "-", told)


def main():
    parser = argparse.ArgumentParser(description="One check of the kit: every page that uses it still draws, and draws right.")
    parser.add_argument("pages", nargs="*", help="pages to check (every page that loads oldcartoon.js unless told)")
    parser.add_argument("--quick", action="store_true", help="leave out the arms, which take the longest")
    parser.add_argument("--settle", type=int, help="measure with this many frames painted before a jump, not the kit's SETTLE")
    args = parser.parse_args()
    files = pages_of(args.pages)
    read, written, listed = keys_of(HERE / "oldcartoon.js")
    drift = ["look.%s is read by the kit and not written down above person()" % key for key in sorted(read - written)]
    drift += ["%s is written down above person() and read nowhere" % key for key in sorted(written - read)]
    drift += ["%s is written down above person() and missing from LOOK_KEYS" % key for key in sorted(written - listed)]
    drift += ["%s is in LOOK_KEYS and not written down above person()" % key for key in sorted(listed - written)]
    print("look keys: %d read by the kit, %d written down above person(), %d in LOOK_KEYS"
          % (len(read), len(written), len(listed)))
    for line in drift:
        print("    FAILED: %s" % line)
    shared = shared_names()
    print("names: %d top-level names defined in two script files" % len(shared))
    for name in sorted(shared):
        print("    FAILED: %s() is defined in %s; the one loaded last replaces the other" % (name, " and ".join(shared[name])))
    bad = len(drift) + len(shared)
    with sync_playwright() as playwright:
        # a sheet that has drawn a picture from a file cannot be read back pixel by pixel unless Chrome is told
        # that files may read files; nothing else about the drawing changes
        browser = playwright.chromium.launch(channel="chrome", args=["--allow-file-access-from-files"])
        print("%-16s %6s  %-7s %14s %9s  %s" % ("page", "length", "draws", "same (px)", "ms/frame", "arms: flips, inward, folded"))
        for page_file in files:
            found, failed = check(browser, page_file, args.quick, args.settle)
            print("%-16s %s" % (page_file.name, found["skipped"]) if "skipped" in found else line_of(page_file.name, found))
            if found.get("cues"):
                print("    cues: %d lines of the song, %s" % (found["cues"]["lines"], "%d of them cut or overlapping"
                      % len(found["cues"]["bad"]) if found["cues"]["bad"] else "each sung inside one scene"))
            for line in failed:
                print("    FAILED: %s" % line)
            bad += len(failed)
        browser.close()
    print("%d pages, %d failures" % (len(files), bad))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
