"""lai_check.py - what the weaving motifs mean (LAI's means, realm, meansFrom), and the realms down each teen jok.

    python checks/lai_check.py

Every motif of weaving.js must carry its meaning's fields (means, realm and meansFrom, each null where no source
says), a realm of "sky", "earth" or "underworld", and a source for any meaning or realm it has: those are passed
or failed. Then, for each town's hem (TEEN_JOK_ROWS), it lists the realm of each row from the top, and says where
a lower row's realm stands above a higher one's: only reported, never failed, because the sources give that order
(the birds above, the Mom in the middle, the naga below) for Tai Lue cloth, and a Tai Yuan hem may keep its own
(Mueang Long weaves its paired birds in the main row, the middle of the hem).

It needs Google Chrome (through Playwright) and weaving.html in the kit's folder. It writes out/checks/lai_check.txt
and .json (report.py) and ends with exit code 1 when an item failed, else 0.
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from report import Report  # noqa: E402

HERE = Path(__file__).resolve().parent.parent      # the folder the kit and its pages are in
REALMS = {"sky": 0, "earth": 1, "underworld": 2}    # from the top of a cloth down

READ = """() => ({
  motifs: Object.keys(LAI).map(function (key) {
    var m = LAI[key];
    return {key: key, has: ["means", "realm", "meansFrom"].every(function (f) { return f in m; }),
            means: m.means, realm: m.realm, from: m.meansFrom};
  }),
  rows: Object.keys(TEEN_JOK_ROWS).map(function (town) {
    return {town: town, keys: TEEN_JOK_ROWS[town].map(function (r) {
      return r[0] === "band" ? [r[1]] : r[0] === "main" ? r[1] : [];
    })};
  })
})"""


def main():
    """Read LAI and TEEN_JOK_ROWS from weaving.html, record each motif's fields, print the hems' realms."""
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page()
        page.goto((HERE / "weaving.html").as_uri())
        page.evaluate("rendering = true")
        found = page.evaluate(READ)
        browser.close()
    report = Report("lai_check")
    realm_of = {}
    for m in found["motifs"]:
        wrong = []
        if not m["has"]:
            wrong.append("means, realm or meansFrom missing")
        if m["realm"] is not None and m["realm"] not in REALMS:
            wrong.append("realm %r is not sky, earth or underworld" % m["realm"])
        if (m["means"] is not None or m["realm"] is not None) and not m["from"]:
            wrong.append("a meaning or a realm with no source")
        realm_of[m["key"]] = m["realm"]
        report.record("LAI.%s" % m["key"], not wrong, "; ".join(wrong) or (m["means"] or "no meaning in the sources")[:80])
    meant = sum(m["means"] is not None for m in found["motifs"])
    print("%d motifs, %d with a meaning, %d with a realm" % (len(found["motifs"]), meant,
                                                            sum(m["realm"] is not None for m in found["motifs"])))
    for hem in found["rows"]:
        seen, steps, lowest = [], [], None
        for keys in hem["keys"]:
            for key in keys:
                realm = realm_of.get(key)
                if realm is None:
                    continue
                seen.append("%s %s" % (key, realm))
                if lowest is not None and REALMS[realm] < REALMS[lowest[1]]:
                    steps.append("%s (%s) under %s (%s)" % (key, realm, lowest[0], lowest[1]))
                if lowest is None or REALMS[realm] > REALMS[lowest[1]]:
                    lowest = (key, realm)
        print("  %-9s top to foot: %s%s" % (hem["town"], ", ".join(seen) or "no row with a realm",
                                             ("; reported: " + "; ".join(steps)) if steps else ""))
    sys.exit(0 if report.finish() else 1)


if __name__ == "__main__":
    main()
