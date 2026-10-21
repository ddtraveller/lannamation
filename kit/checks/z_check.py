"""z_check.py - is anything on the ground drawn over what stands in front of it?

    python checks/z_check.py maeng/s11.html                # every second of the page
    python checks/z_check.py sash.html --from 35 --to 53    # a part of it
    python checks/z_check.py village.html --every 0.5

A frame is painted from the back to the front, so what stands nearer us (its feet lower on the sheet) must be drawn
after what it overlaps. This check watches the page draw, as render.py draws it, and notes each person (person())
and each animal of a scene's life (decorate.js's kinds) with its box and its feet, in the order drawn. Where two
boxes overlap and the one drawn later has its feet further back than the other's by more than SLACK, it reports
them: the later is drawn over the nearer. Some are meant (one sits on a cart, one rides an elephant, a bird flies
over the yard): read them, and give what is meant a z (oldcartoon.js, drawByZ()). It needs Google Chrome (Playwright).

It reads the page only: it writes nothing. It prints each pair once, with the seconds it was seen at, and ends with
exit code 0 when there is none, 1 when there is one or more, or when the page reported an error.
"""
import argparse
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

SLACK = 12           # pixels of the sheet: feet this close are side by side, either may be drawn first
LOAD_SECONDS = 600   # the hero film paints its forests as it loads

# Wraps person() and each of decorate.js's kinds to note, while Z_DRAWN is a list, what was drawn and where:
# {name, box: [left, top, right, bottom], feet}, in the pixels of the canvas (the camera's turn applied). A person's
# box is the kit's figure at its size (about 120 wide and 330 high at size 1); an animal's is the box its kind gives.
WRAP = """() => {
  function note(name, box, feet) {
    if (!window.Z_DRAWN) { return; }
    var m = pen.getTransform(), a = m.transformPoint(new DOMPoint(box[0], box[1])), b = m.transformPoint(new DOMPoint(box[2], box[3]));
    var f = m.transformPoint(new DOMPoint((box[0] + box[2]) / 2, feet));
    Z_DRAWN.push({name: name, box: [Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.x, b.x), Math.max(a.y, b.y)], feet: f.y / m.d});
  }
  var drawPerson = person;
  window.person = function (x, y, look) {
    var given = drawPerson.apply(this, arguments), size = (look && look.size) || 1;
    note("person " + ((look && (look.id || look.name)) || "?"), [x - 60 * size, y - 330 * size, x + 60 * size, y], y);
    return given;
  };
  if (window.filmFrameOnce) {             // a film's frame is drawn twice when something in it watches, and a jump of
    var once = filmFrameOnce;             // the clock paints the frames before it first: only the last drawing counts
    window.filmFrameOnce = function () { if (window.Z_DRAWN) { Z_DRAWN.length = 0; } return once.apply(this, arguments); };
  }
  if (window.LIFE_KINDS) {
    Object.keys(LIFE_KINDS).forEach(function (kind) {
      var drawKind = LIFE_KINDS[kind];
      LIFE_KINDS[kind] = function (at, look, t) {
        var box = drawKind.apply(this, arguments);
        if (box) { note(kind, box, at.y); }
        return box;
      };
    });
  }
}"""
FRAME = """(t) => {
  window.Z_DRAWN = [];
  draw(t);
  var drawn = Z_DRAWN, found = [];
  window.Z_DRAWN = null;
  for (var i = 0; i < drawn.length; i++) {
    for (var j = i + 1; j < drawn.length; j++) {
      var a = drawn[i], b = drawn[j];
      var w = Math.min(a.box[2], b.box[2]) - Math.max(a.box[0], b.box[0]), h = Math.min(a.box[3], b.box[3]) - Math.max(a.box[1], b.box[1]);
      if (w > 0 && h > 0 && b.feet < a.feet - %d && a.name !== b.name) { found.push(b.name + " is drawn over " + a.name + ", who stands nearer"); }
    }
  }
  return found;
}""" % SLACK


def main():
    """The command line: watch the page draw each sampled second and print what is drawn over what is nearer."""
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("--from", dest="start", type=float, default=0.0)
    parser.add_argument("--to", dest="end", type=float)
    parser.add_argument("--every", type=float, default=1.0, help="seconds between the frames looked at")
    args = parser.parse_args()
    page_file = Path(args.page).resolve()
    if not page_file.exists():
        raise SystemExit("no such page: " + args.page)
    seen, errors = {}, []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(page_file.as_uri(), timeout=LOAD_SECONDS * 1000)
        page.evaluate("rendering = true")
        page.evaluate(WRAP)
        end = args.end if args.end is not None else page.evaluate("typeof LENGTH !== 'undefined' ? LENGTH : DURATION")
        t = args.start
        while t < end:
            for pair in page.evaluate(FRAME, t):
                seen.setdefault(pair, []).append(t)
            t = round(t + args.every, 3)
        browser.close()
    for pair, seconds in seen.items():
        print("%s (at %s s)" % (pair, ", ".join("%g" % s for s in seconds[:6]) + (" ..." if len(seconds) > 6 else "")))
    for error in errors[:3]:
        print("the page reported an error:", error)
    print("%s: %d drawn over what stands nearer" % (page_file.name, len(seen)))
    sys.exit(1 if seen or errors else 0)


if __name__ == "__main__":
    main()
