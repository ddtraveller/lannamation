"""sound_check.py - one check of the kit's sounds: every sound in sounds.py is made, and comes out right.

    python checks/sound_check.py

For each sound: it is made at all; it is as long as its outline says (the echo may ring on after it, no more
than its "cave" seconds and the latest voice's start); nothing in it is not a number; it is loud enough and does
not clip (its peak between 0.5 and 0.95); it is not silent through its middle; and it is not the same as any
other sound (two moods that sound alike are one mood too many). Prints one line a sound, writes each down, PASS or
FAIL, in out/checks/sound_check.txt (report.py), and exits 1 if any fails. With --changed, it is left out when
sounds.py and howl.py have not changed since it passed.
"""
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from howl import RATE, chorus, howl  # noqa: E402
from sounds import SOUNDS  # noqa: E402
from report import Report, fingerprint  # noqa: E402


def longest(outline):
    """How long a sound may be: its latest voice's end, and the echo's ring after it."""
    voices = outline.get("voices", [outline])
    end = max(v.get("at", 0) + v["seconds"] for v in voices)
    return end, end + outline.get("cave", [1.5])[0]


def main():
    report = Report("sound_check")
    kit = Path(__file__).resolve().parent.parent
    mark = fingerprint([kit / "sounds.py", kit / "howl.py", Path(__file__)])
    if "--changed" in sys.argv and report.unchanged("sounds", mark):
        report.skip("sounds", "sounds.py and howl.py have not changed since they passed")
        report.finish()
        return
    failed, made = 0, {}
    for name, (outline_of, _) in SOUNDS.items():
        outline = outline_of()
        sound = chorus(outline) if "voices" in outline else howl(outline)
        seconds, most = longest(outline)
        middle = sound[int(0.25 * seconds * RATE):int(0.75 * seconds * RATE)]
        quiet = 20 * np.log10(np.sqrt(np.mean(middle ** 2)) + 1e-12)
        wrong = []
        if not np.all(np.isfinite(sound)):
            wrong.append("not a number in it")
        if not seconds - 0.05 <= len(sound) / RATE <= most + 0.05:
            wrong.append("%.2f s long, the outline says %.2f to %.2f" % (len(sound) / RATE, seconds, most))
        if not 0.5 <= np.abs(sound).max() <= 0.95:
            wrong.append("peak %.2f" % np.abs(sound).max())
        if quiet < -40:
            wrong.append("its middle is silent (%.0f dB)" % quiet)
        spectrum = np.abs(np.fft.rfft(sound[:RATE * 3], RATE * 3))
        spectrum /= np.linalg.norm(spectrum) or 1
        for other, theirs in made.items():
            if float(np.dot(spectrum, theirs)) > 0.97:
                wrong.append("sounds like %s" % other)
        made[name] = spectrum
        failed += bool(wrong)
        report.record(name, not wrong, "%.2f s, peak %.2f, middle %.0f dB%s" % (len(sound) / RATE, np.abs(sound).max(), quiet,
                                                                         ("; " + "; ".join(wrong)) if wrong else ""))
        print("%-14s %5.2f s  peak %.2f  middle %4.0f dB  %s" % (name, len(sound) / RATE, np.abs(sound).max(), quiet,
                                                               "; ".join(wrong) if wrong else "ok"))
    print("%d of %d sounds wrong" % (failed, len(SOUNDS)))
    if not failed:
        report.passed_with("sounds", mark)
    report.finish()
    sys.exit(1 if failed else 0)


main()
