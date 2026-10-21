"""report.py - what every check writes when it is done: a success or a failure, item by item, to a file.

    from report import Report
    report = Report("kit_check")
    report.record("lanna.html: draws", True, "24 frames, no error")
    report.record("lanna.html: same", False, "312 pixels past a pixel's shift")
    report.finish()            # writes the files, and gives back whether all of it passed

Each check's last run is out/checks/NAME.txt (one line an item: PASS or FAIL, what was checked, what was found;
then the summary) and out/checks/NAME.json (the same, for a program), and every run adds one line to
out/checks/history.log: when, which check, how many passed and failed, and which failed. An item that was left
out because nothing it checks has changed is recorded as SKIP, with why. out/ is not kept in the repository.
"""
import hashlib
import json
import time
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "out" / "checks"


def fingerprint(paths, extra=b""):
    """One mark for the files a check's item depends on: when none of them has changed, an item that passed
    would pass again. A file that is not there counts as one that is missing.

    paths: the files (strings or Paths). extra: bytes to count in as well (a setting the item takes).
    Gives back the mark, a hex string.
    e.g. fingerprint(["oldcartoon.js", "village.html"])"""
    digest = hashlib.sha1(extra)
    for path in paths:
        path = Path(path)
        digest.update(str(path.name).encode("utf-8") + (path.read_bytes() if path.exists() else b"missing"))
    return digest.hexdigest()


class Report:
    """A check's items, and what each passed with last (out/checks/NAME_passed.json): unchanged(key, mark) says
    whether an item passed last with that mark; passed_with(key, mark) keeps the mark when it passes again."""
    def __init__(self, name):
        """A report for the check named name (kit_check, arms_check ...): reads what passed last, if any.

        e.g. report = Report("kit_check")"""
        self.name, self.items, self.started = name, [], time.time()
        self.kept = OUT / (name + "_passed.json")
        self.marks = json.loads(self.kept.read_text(encoding="utf-8")) if self.kept.exists() else {}

    def unchanged(self, key, mark):
        """True when the item key passed last with this mark.

        e.g. report.unchanged("village.html", fingerprint(files))"""
        return self.marks.get(key) == mark

    def passed_with(self, key, mark):
        """Keep mark as the one key passed with (written by finish()). Gives back nothing.

        e.g. report.passed_with("village.html", mark)"""
        self.marks[key] = mark

    def record(self, item, ok, message=""):
        """Add an item: PASS when ok is true, else FAIL; message says what was found. Gives back nothing.

        e.g. report.record("lanna.html: draws", True, "24 frames, no error")"""
        self.items.append({"item": item, "result": "PASS" if ok else "FAIL", "message": message})

    def skip(self, item, why):
        """Add an item as SKIP, with why it was left out. Gives back nothing.

        e.g. report.skip("village.html", "nothing it checks has changed")"""
        self.items.append({"item": item, "result": "SKIP", "message": why})

    def finish(self):
        """Write the report's files and print its summary: True when no item failed.

        It writes out/checks/NAME.txt, NAME.json and NAME_passed.json, and adds a line to out/checks/history.log.
        e.g. sys.exit(0 if report.finish() else 1)"""
        OUT.mkdir(parents=True, exist_ok=True)
        failed = [i for i in self.items if i["result"] == "FAIL"]
        passed = sum(i["result"] == "PASS" for i in self.items)
        skipped = sum(i["result"] == "SKIP" for i in self.items)
        when = time.strftime("%Y-%m-%d %H:%M:%S")
        verdict = "SUCCESS" if not failed else "FAILURE"
        summary = "%s %s: %d passed, %d failed, %d skipped (%.0f s)" % (verdict, self.name, passed, len(failed), skipped,
                                                                        time.time() - self.started)
        lines = ["%s  %s%s" % (i["result"], i["item"], ("  - " + i["message"]) if i["message"] else "") for i in self.items]
        (OUT / (self.name + ".txt")).write_text("%s\n%s\n\n%s\n" % (when, "\n".join(lines), summary), encoding="utf-8")
        (OUT / (self.name + ".json")).write_text(json.dumps({"when": when, "check": self.name, "verdict": verdict,
                                                             "items": self.items}, indent=1, ensure_ascii=False), encoding="utf-8")
        self.kept.write_text(json.dumps(self.marks, indent=1), encoding="utf-8")
        with open(OUT / "history.log", "a", encoding="utf-8") as log:
            log.write("%s  %s%s\n" % (when, summary, ("  failed: " + "; ".join(i["item"] for i in failed)) if failed else ""))
        print(summary + "  -> " + str(OUT / (self.name + ".txt")))
        return not failed
