"""arms_check.py page.html [from to]  - check a film's arms, frame by frame at 30 a second, as render.py draws it.

    python checks/arms_check.py lanna.html

It draws every frame with no window and notes, for every arm, where the elbow and the wrist are, measured from the
shoulder. Then it counts what an arm cannot do, by the kit's own rules (SHOULDER, ELBOW, bendOf in oldcartoon.js):
  flips     an elbow that moves more than 40 units between two frames while its hand moved less than 12 (an arm
            is followed from frame to frame by the name arm() is given, so the order arms are drawn in may change)
  inward    an upper arm pointing into the inward arc toward the spine: between 30 degrees in from straight down and
            20 degrees in past straight up (angles from straight down, growing toward the arm's own side)
  folded    a forearm folded more than 150 degrees from straight
  sweeps    the most any upper arm turns in one frame, in degrees, while its hand moved less than 12 units
An upper arm drawn shorter than 25 units (its bone is 62) is pointing at us, not across the picture: it is left out of
"inward", "folded" and "sweeps". A film is clean when the first three are 0. kit_check.py runs this on every page.

It needs Google Chrome (through Playwright). The page is named from the folder it is run in; "from" and
"to" are seconds (default the whole page). It prints the counts and up to three of each fault, and ends with
exit code 0 whatever it finds: read the counts (kit_check.py imports measure() and fails a page on them).
"""
import math
import sys
from collections import Counter
from pathlib import Path

from playwright.sync_api import sync_playwright

WRAP = """() => {
  window.ARMS = [];
  var kept = arm, drawn = 0, at = -1;
  arm = function (sx, sy, hand, outward) {
    if (clock !== at) { at = clock; drawn = 0; }
    var r = kept.apply(this, arguments);
    window.ARMS.push([drawn++, r[2] - sx, r[3] - sy, hand[0], hand[1], outward, r[0] - sx, r[1] - sy, clock, arguments[5] || null]);
    return r;
  };
}"""

# The first frame of a part of a film is come to by a jump, and the kit then paints the frames before it too
# (settled): only the arms of the frame asked for are kept, which are the ones drawn at the clock's last time.
DRAW = """([from, to]) => {
  var out = [];
  for (var n = Math.round(from * 30); n < Math.round(to * 30); n++) {
    window.ARMS.length = 0;
    draw(n / 30);
    out.push(window.ARMS.filter(function (a) { return a[8] === clock; }));
  }
  return out;
}"""


def turn_of(ex, ey, outward):
    """the upper arm's angle: 0 straight down, 90 out to its own side, 180 up, below 0 in toward the spine

    ex, ey: the elbow from the shoulder, in the person's units. outward: 1 or -1, the arm's own side (as arm()
    is given it). e.g. turn_of(10, 55, -1)"""
    return math.degrees(math.atan2(ex * outward, ey))


def measure(page, start=0.0, end=None):
    """Draw an open page from "start" to "end" (its whole length unless told) and count its arms' faults.

    page: a Playwright page with a kit page loaded and rendering on. start, end: seconds (end: the page's
    DURATION when left out). It wraps the page's arm() to note each arm (it stays wrapped) and draws every
    frame at 30 a second. Gives back a dict: start, end, frames, arms (how many drawn), flips, inward, folded
    (lists of (second, arm, ...)) and sweep (degrees, second, arm).
    e.g. found = measure(page, 0.0, 10.0)"""
    page.evaluate(WRAP)
    if end is None:
        end = page.evaluate("DURATION")
    frames = page.evaluate(DRAW, [start, end])
    flips, inward, folded, arms, sweep = [], [], [], 0, (0.0, 0.0, 0)
    for n, now in enumerate(frames):
        t = start + n / 30
        for a in now:
            arms += 1
            seen = math.hypot(a[1], a[2]) >= 25           # an upper arm that points across the picture, not at us
            turn = turn_of(a[1], a[2], a[5])
            if -159 < turn < -31 and seen:                # a degree of tolerance at either end of the arc
                inward.append((t, a[0], round(turn)))
            fx, fy = a[6] - a[1], a[7] - a[2]
            fold = abs(math.degrees(math.atan2(a[1] * fy - a[2] * fx, a[1] * fx + a[2] * fy)))
            if fold > 151 and seen:
                folded.append((t, a[0], round(fold)))
        if n == 0 or len(frames[n - 1]) != len(now):       # a cut: other people, other arms
            continue
        # An arm is followed from one frame to the next by its name (the key arm() is given, "n3/armA"):
        # the kit draws a hanging far arm before the chest and a raised one after it, so the order the
        # arms are drawn in can change between two frames without any arm moving. Arms with no name
        # (a stick figure's) are followed by the order they were drawn in.
        before, named = frames[n - 1], {a[9]: a for a in frames[n - 1] if a[9]}
        if len(named) == len(before) and all(b[9] in named for b in now) and len(set(b[9] for b in now)) == len(now):
            pairs = [(named[b[9]], b) for b in now]
        else:
            pairs = list(zip(before, now))
        for a, b in pairs:
            elbow = math.hypot(a[1] - b[1], a[2] - b[2])
            hand = math.hypot(a[3] - b[3], a[4] - b[4])
            if elbow > 40 and hand < 12:
                flips.append((t, b[0], round(elbow), [round(b[3]), round(b[4])]))
            turned = abs((turn_of(b[1], b[2], b[5]) - turn_of(a[1], a[2], a[5]) + 180) % 360 - 180)
            if turned > sweep[0] and math.hypot(a[1], a[2]) >= 25 and math.hypot(b[1], b[2]) >= 25 and hand < 12:
                sweep = (turned, t, b[0])
    return {"start": start, "end": end, "frames": len(frames), "arms": arms, "flips": flips, "inward": inward,
            "folded": folded, "sweep": sweep}


def report(name, found, errors):
    """Print what measure() found on one page: the counts, the faults by second, and the first three of each.

    name: the page's name. found: as measure() gives it. errors: the page's errors (printed when there are any).
    Gives back nothing.
    e.g. report("lanna.html", measure(page), errors)"""
    print("%s, %.0f to %.0f s: %d frames, %d arms drawn%s" % (name, found["start"], found["end"], found["frames"], found["arms"],
                                                              "  PAGE ERRORS: %s" % errors if errors else ""))
    print("  flips: %d   inward: %d   folded past 150: %d   biggest turn of an upper arm in one frame: %.0f degrees (at %.2f s, arm %d)"
          % (len(found["flips"]), len(found["inward"]), len(found["folded"]), found["sweep"][0], found["sweep"][1], found["sweep"][2]))
    for kind in ("flips", "inward"):
        if found[kind]:
            by_second = Counter(int(f[0]) for f in found[kind])
            print("  %s by second:" % kind, ", ".join("%d s: %d" % (s, c) for s, c in sorted(by_second.items())))
    for f in found["flips"][:3]:
        print("  flip at %.2f s, arm %d of the frame: the elbow moved %d units; its hand is set to %s" % f)
    for f in found["inward"][:3]:
        print("  inward at %.2f s, arm %d of the frame: the upper arm at %d degrees" % f)


def main():
    """The command line: arms_check.py PAGE [FROM TO]: open the page, measure its arms, print what was found."""
    page_file = sys.argv[1]
    start = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
    end = float(sys.argv[3]) if len(sys.argv) > 3 else None
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(Path(page_file).resolve().as_uri())
        page.evaluate("rendering = true")
        found = measure(page, start, end)
        browser.close()
    report(Path(page_file).name, found, errors)


if __name__ == "__main__":
    main()
