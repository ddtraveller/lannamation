"""person_same.py [--against REV] [--cases N] [--harvest]  - person() before and after a change, drawn alike.

    python checks/person_same.py                    # this oldcartoon.js against the one last committed (HEAD)
    python checks/person_same.py --against 0a15826  # against the one of any commit
    python checks/person_same.py --harvest          # read the looks from the pages again first

For a change to oldcartoon.js that should move no pixel of a person: taking person() apart, renaming inside it,
tidying. It draws the same cases with the two oldcartoon.js, each in a page of its own with the cartoon maker's
modules, in the same order, and compares for each case the sheet's pixels, the joints person() gives back, the
error if one was thrown, the warnings, and what person() puts back after itself (the skin, hair, body, pen ...).

The cases are the looks the kit's own pages give person(): every page that loads the kit, and a film's scenes
(*/s*.html), drawn at six moments with person() listening, kept in out/checks/person_looks.json (--harvest makes
it again, after new pages or looks; it takes some minutes). A case is one of those looks, as it was or with one to
four of its keys given a value seen for that key elsewhere, at a random second and place; a dozen people are
followed from case to case, as in a film, so what lags and swings is compared too. The random choices are seeded:
the same cases every time.

Before the person() split (2026-10-21) this compared 1500 cases at each of its eight steps: none differed, and a
change of one number in the kit made 631 of them differ. A planted change is how to check this check.

Prints each case that differs (up to five), writes PASS or FAIL in out/checks/person_same.txt (report.py), and
exits 1 if any differs.
"""
import argparse
import json
import random
import re
import subprocess
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from kit_check import missing_of, pages_of  # noqa: E402
from report import Report  # noqa: E402

KIT = Path(__file__).resolve().parent.parent
OUT = KIT / "out" / "checks"
LOOKS = OUT / "person_looks.json"
# the cartoon maker's modules: what a look can ask for besides the kit
MODULES = ["naga.js", "dragon.js", "beasts.js", "myth.js", "flora.js", "khom.js", "motion.js", "cumulus.js", "sabai.js",
           "backdrops.js", "pieces.js", "highlands.js", "band.js", "northbirds.js"]

LISTEN = """() => {
  window.SEEN = [];
  var real = person;
  person = function (x, y, look) {
    try { var copy = JSON.parse(JSON.stringify(look)); if (copy) { SEEN.push(copy); } } catch (e) {}
    return real.apply(this, arguments);
  };
}"""

DRAW = """(cases) => {
  function hash() {
    var d = new Uint32Array(pen.getImageData(0, 0, pen.canvas.width, pen.canvas.height).data.buffer), h = 2166136261;
    for (var i = 0; i < d.length; i++) { h = Math.imul(h ^ d[i], 16777619) >>> 0; }
    return h.toString(16);
  }
  var sheet = pen;
  return cases.map(function (c) {
    clock = c.t;
    pen.setTransform(1, 0, 0, 1, 0, 0);
    pen.clearRect(0, 0, pen.canvas.width, pen.canvas.height);
    var said;
    try { said = JSON.stringify(person(c.x, c.y, JSON.parse(c.look))); } catch (error) { said = "ERROR " + error.message; }
    // what person() puts back; a name an older kit did not have yet reads as undefined, not as an error
    var kept = ["SKIN", "HAIR", "LINE", "FINE", "PERSON_LAYERED", "NORTH_FACE", "EYE_LIDS", "EYE_TEARS"].map(function (name) { return window[name]; });
    return [hash(), said, WARNINGS.length, BODY === BODIES.slim, pen === sheet].concat(kept).join(" | ");
  });
}"""


def harvest(browser):
    """The looks the kit's pages give person(), and for each key the values seen (only what JSON can carry)."""
    pages = sorted(p for p in KIT.glob("*/s[0-9]*.html") if "node_modules" not in p.parts) + pages_of([])
    looks, values = [], {}
    for page_file in pages:
        if missing_of(page_file):
            continue
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        try:
            page.goto(page_file.as_uri(), timeout=600000)
            page.evaluate("rendering = true")
            page.evaluate(LISTEN)
            long = page.evaluate("typeof DURATION === 'number' ? DURATION : 10")
            for k in range(6):
                try:
                    page.evaluate("t => draw(t)", long * (k + 0.5) / 6)
                except Exception:
                    pass
            seen = page.evaluate("SEEN.slice(0, 400)")
        except Exception as error:
            print("left out %s: %s" % (page_file.name, str(error).splitlines()[0][:100]))
            seen = []
        page.close()
        for look in seen:
            if isinstance(look, dict) and "rig" not in look:
                looks.append(look)
                for key, value in look.items():
                    bag = values.setdefault(key, [])
                    if value not in bag and len(bag) < 40:
                        bag.append(value)
    unique = list({json.dumps(l, sort_keys=True): l for l in looks}.values())
    OUT.mkdir(parents=True, exist_ok=True)
    LOOKS.write_text(json.dumps({"looks": unique, "values": values}), encoding="utf-8")
    print("looks: %d from %d pages (%d unlike), %d keys -> %s" % (len(looks), len(pages), len(unique), len(values), LOOKS))


def cases_of(count):
    data = json.loads(LOOKS.read_text(encoding="utf-8"))
    looks, values, rng = data["looks"], data["values"], random.Random(20261021)
    cases = []
    for _ in range(count):
        look = dict(rng.choice(looks))
        for _ in range(rng.choice([0, 0, 1, 2, 3, 4])):
            key = rng.choice(sorted(values))
            look[key] = rng.choice(values[key])
        look["id"] = "case%d" % rng.randrange(12)
        cases.append({"look": json.dumps(look), "t": round(rng.uniform(0, 20), 3), "x": rng.randrange(300, 1150),
                      "y": rng.randrange(700, 1000)})
    return cases


def drawn(browser, kit_file, cases):
    """Each case's answer, drawn with this oldcartoon.js and the maker's modules beside the kit."""
    page_file = OUT / ("person_same_%s.html" % kit_file.stem)
    scripts = [kit_file.as_uri()] + [(KIT / m).as_uri() for m in MODULES]
    page_file.write_text('<!doctype html><html><body><canvas id="stage" width="1920" height="1080"></canvas>\n' +
                         "".join('<script src="%s"></script>\n' % s for s in scripts) +
                         "<script>var DURATION = 20, BEAT = 0.5, rendering = true;</script></body></html>", encoding="utf-8")
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(page_file.as_uri())
    out = []
    for k in range(0, len(cases), 100):
        out += page.evaluate(DRAW, cases[k:k + 100])
    page.close()
    page_file.unlink()
    if errors:
        raise SystemExit("%s: the page's own error: %s" % (kit_file.name, errors[0]))
    return out


def main():
    parser = argparse.ArgumentParser(description="person() before and after a change, drawn alike")
    parser.add_argument("--against", default="HEAD", help="the commit whose oldcartoon.js is compared (default HEAD)")
    parser.add_argument("--cases", type=int, default=1500)
    parser.add_argument("--harvest", action="store_true", help="read the looks from the pages again first")
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    old = OUT / "person_same_old.js"
    shown = subprocess.run(["git", "-C", str(KIT), "show", "%s:./oldcartoon.js" % args.against], capture_output=True)
    if shown.returncode != 0:
        raise SystemExit("no oldcartoon.js at %s: %s" % (args.against, shown.stderr.decode("utf-8", "replace").strip()))
    old.write_bytes(shown.stdout)
    report = Report("person_same")
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", args=["--allow-file-access-from-files"])
        if args.harvest or not LOOKS.exists():
            harvest(browser)
        cases = cases_of(args.cases)
        before = drawn(browser, old, cases)
        after = drawn(browser, KIT / "oldcartoon.js", cases)
        browser.close()
    old.unlink()
    differ = [k for k in range(len(cases)) if before[k] != after[k]]
    print("%d cases against %s: %d differ, %d threw in both, %d distinct pictures" % (
        len(cases), args.against, len(differ), sum(" | ERROR " in r for r in before), len(set(r.split(" | ")[0] for r in before))))
    for k in differ[:5]:
        print("case %d:\n  before %s\n  after  %s\n  look   %s" % (k, before[k][:200], after[k][:200], cases[k]["look"][:200]))
    report.record("person() against %s" % args.against, not differ, "%d of %d cases differ" % (len(differ), len(cases)))
    report.finish()
    sys.exit(1 if differ else 0)


if __name__ == "__main__":
    main()
