"""score_check.py - does the music under every line carry that line's feeling? And a plot of it, scene by scene.

    python checks/score_check.py            # after python maeng/feelings.py: every scene in out/maeng_music/

It listens to the music, not to the cue sheet. Under each line, from the moment its feeling's music has fully come
in (score.py turns EARLY before the line, over CROSS seconds) to the moment the next line's begins to come in,
it measures which notes sound (how much of the music's energy is in each of the twelve notes), and which of
score.py's sets of notes holds most of it: that set must be the line's feeling's. A line too short to hear on
its own (under a second of its feeling alone) is measured over what there is, and said so. It also measures how
loud the music is, how bright (where the middle of its energy lies) and how busy (how many notes begin a
second), and draws all of it, one scene to a row, into out/maeng_music/plot.html: every sentence a block in its
feeling's colour, under it the set the music was heard in, and the music's loudness and busyness along the time.
Each line is written down, PASS or FAIL, in out/checks/score_check.txt (report.py). With --changed, it is left out
when the music (out/maeng_music/), score.py, feelings.py and the scene files have not changed since it passed.
Exits 1 if any line's music is heard in another feeling's notes.

It needs numpy and soundfile, and out/maeng_music/ (cues.json and a WAV for each scene, made by
maeng/feelings.py) and maeng/words.js. It runs main() as it is loaded: do not import it.
"""
import html
import json
import sys
from pathlib import Path

import numpy
import soundfile

KIT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(KIT))
sys.path.insert(0, str(KIT / "maeng"))
from score import CROSS, EARLY, FEELINGS, SETS  # noqa: E402
from report import Report, fingerprint  # noqa: E402

OUT = KIT / "out" / "maeng_music"
WORDS = KIT / "maeng" / "words.js"
COLOURS = {"calm": "#9fb8a0", "tender": "#e8b7c0", "sleepy": "#9a9ab8", "wonder": "#8fc8e8", "mystery": "#6a6a9a",
           "comic": "#f2c94c", "joy": "#f2994a", "hope": "#b8d86a", "bustle": "#d8a24a", "triumph": "#e0b23a",
           "royal": "#b06ab0", "sad": "#7a96b8", "grief": "#4a5a7a", "tense": "#c85a4a", "fear": "#9a2a2a"}


def notes_heard(piece, rate):
    """How strongly each of the twelve notes (A first) sounds, as an ear picks a note out: every note from 100 to
    1100 Hz scored by its own overtones together (the first five, each counted less the higher it is: a harmonic
    sum), so that a plucked or bowed note outweighs its own overtones (a G's fifth is a B) and a drum, whose body
    sweeps through the low notes without overtones in a row, counts for little. Squared, so the notes played
    stand out over the rest, and summed over the notes' octaves.

    piece: the samples (one channel, or a row for each channel), at rate samples a second. Gives back twelve
    shares, A first, adding up to 1 (all 0 when the piece is shorter than 8192 samples).
    e.g. notes_heard(music[0:44100 * 4], 44100)"""
    mono = piece.mean(axis=1) if piece.ndim > 1 else piece
    window = 8192
    freqs = numpy.fft.rfftfreq(window, 1 / rate)
    notes = numpy.arange(-14, 28)                     # semitones from A 220: about 98 to 1100 Hz
    energy = numpy.zeros(12)
    for start in range(0, max(1, len(mono) - window), window // 2):
        frame = mono[start:start + window]
        if len(frame) < window:
            break
        power = numpy.abs(numpy.fft.rfft(frame * numpy.hanning(window))) ** 2
        salience = numpy.zeros(len(notes))
        for k, n in enumerate(notes):
            f0 = 220.0 * 2 ** (n / 12)
            heard = []
            for h in range(1, 6):                     # the power within a quarter-tone of each overtone
                lo, hi = f0 * h * 2 ** (-1 / 24), f0 * h * 2 ** (1 / 24)
                heard.append(power[(freqs >= lo) & (freqs < hi)].sum() / h)
            # the note itself and its overtones, both: an F does not sound because the A's played are its fifth
            salience[k] = numpy.sqrt(heard[0] * sum(heard[1:]))
        numpy.add.at(energy, notes % 12, salience ** 2)
    return energy / (energy.sum() or 1)


def set_heard(energy):
    """The set of notes that holds the most of the music's energy, and how much it holds.

    energy: the twelve shares notes_heard() gives. Gives back (the set's name, its share 0 to 1, every set's
    share as a dict). e.g. heard, share, _ = set_heard(notes_heard(piece, rate))"""
    shares = {name: float(sum(energy[s % 12] for s in set(st % 12 for st in steps))) for name, steps in SETS.items()}
    # a set is heard when its notes hold the music's energy AND its notes sound: each of its notes that does not
    # (under 1% of the energy) counts against it, so a set is not heard in music that only shares its other notes
    silent = {name: sum(energy[st % 12] < 0.01 for st in set(steps)) for name, steps in SETS.items()}
    best = max(shares, key=lambda name: shares[name] - 0.05 * silent[name])
    return best, shares[best], shares


def busy(piece, rate):
    """How many notes begin a second: rises in the energy above 300 Hz, in 20 ms steps.

    piece: the samples, at rate samples a second. Gives back notes a second; 0.0 for under 60 ms of sound.
    e.g. busy(piece, 44100)"""
    mono = piece.mean(axis=1) if piece.ndim > 1 else piece
    hop = int(0.02 * rate)
    frames = len(mono) // hop
    if frames < 3:
        return 0.0
    level = numpy.array([numpy.sqrt(numpy.mean(mono[k * hop:(k + 1) * hop] ** 2)) for k in range(frames)])
    rises = numpy.diff(level) > 0.35 * level[:-1] + 0.004
    starts = rises & ~numpy.concatenate([[False], rises[:-1]])
    return float(starts.sum()) / (len(mono) / rate)


def english():
    """Each line's English, from words.js.

    Gives back {line id ("M001" ...): its English}, from the lines of words.js that start with an id.
    e.g. words = english()"""
    text = WORDS.read_text(encoding="utf-8")
    found = {}
    for line in text.splitlines():
        line = line.strip()
        if line[:1] == "M" and line[4:6] == ": ":
            found[line[:4]] = json.loads(line[6:].rstrip(","))[2]
    return found


def main():
    """The command line: score_check.py [--changed]: hear each line's music, print and record each, draw the plot,
    exit 1 if any line's music is in another feeling's notes."""
    report = Report("score_check")
    depends = sorted(OUT.glob("*.wav")) + [OUT / "cues.json", KIT / "score.py", KIT / "maeng" / "feelings.py", Path(__file__)]
    depends += sorted((KIT / "maeng").glob("s[0-9][0-9]_*.js"))
    mark = fingerprint(depends)
    if "--changed" in sys.argv and report.unchanged("music", mark):
        report.skip("music", "the music and what it is made from have not changed since it passed")
        report.finish()
        return
    sheet = json.loads((OUT / "cues.json").read_text(encoding="utf-8"))
    words, wrong, rows = english(), 0, []
    for scene, info in sorted(sheet.items()):
        wav = OUT / (scene + ".wav")
        if not wav.exists():
            print("%s: no music yet (python maeng/feelings.py)" % scene)
            continue
        music, rate = soundfile.read(str(wav))
        lines, measured = info["lines"], []
        for k, (start, end, line) in enumerate(lines):
            feeling = info["feel"][line]
            alone_from = start + CROSS - EARLY if k else 0.0
            alone_to = lines[k + 1][0] - EARLY if k + 1 < len(lines) else info["seconds"] - 2
            short = alone_to - alone_from < 1.0
            if short:                                 # too short alone: what there is of it, from its first second
                alone_from, alone_to = start, max(end, start + 1.0)
            piece = music[int(alone_from * rate):int(alone_to * rate)]
            heard, share, _ = set_heard(notes_heard(piece, rate))
            expected = FEELINGS[feeling]["notes"]
            ok = heard == expected
            wrong += not ok
            report.record("%s %s (%s)" % (scene, line, feeling), ok, "wants %s, heard %s (%.0f%%)%s"
                          % (expected, heard, 100 * share, ", too short to hear alone" if short else ""))
            loud = 20 * numpy.log10(numpy.sqrt(numpy.mean(piece ** 2)) + 1e-9)
            measured.append({"line": line, "start": start, "end": end, "feeling": feeling, "expected": expected,
                             "heard": heard, "share": share, "ok": ok, "short": short, "loud": float(loud),
                             "busy": busy(piece, rate), "english": words.get(line, "")})
            print("%s %s %-8s wants %-7s heard %-7s (%.0f%%)%s%s" % (scene, line, feeling, expected, heard, 100 * share,
                                                                    "" if ok else "  WRONG", "  (short)" if short else ""))
        rows.append((scene, info["seconds"], measured))
    plot(rows)
    total = sum(len(r[2]) for r in rows)
    print("%d of %d lines' music in another feeling's notes; plot: %s" % (wrong, total, OUT / "plot.html"))
    if not wrong:
        report.passed_with("music", mark)
    report.finish()
    sys.exit(1 if wrong else 0)


def plot(rows):
    """Every scene a row: its sentences as blocks in their feelings' colours, the set heard under each, and the
    music's loudness and busyness along the time.

    rows: one (scene, its seconds, the lines measured) a scene, as main() makes them. It writes
    out/maeng_music/plot.html; gives back nothing."""
    wide, out = 1500, []
    out.append("<!doctype html><html><head><meta charset='utf-8'><title>The film's music against its feelings</title>"
               "<style>body{font:15px Georgia,serif;background:#f3ead8;color:#3a2e22;margin:24px}"
               "h1{font-weight:normal}h2{font-weight:normal;margin:26px 0 4px}.key span{display:inline-block;"
               "padding:2px 8px;margin:2px;border-radius:4px}svg{background:#fbf6ea;border-radius:6px}</style></head><body>"
               "<h1>The film's music against the feeling of each sentence</h1><p>Each block is a sentence, in its "
               "feeling's colour, its English under it. Under each block: the notes the music was heard in (✓ its "
               "feeling's own, ✗ another's). The line is the music's loudness; the dots how busy it is (notes a second).</p>"
               "<p class='key'>" + "".join("<span style='background:%s'>%s</span>" % (c, n) for n, c in COLOURS.items()) + "</p>")
    for scene, seconds, measured in rows:
        scale = (wide - 20) / seconds
        svg = ["<svg width='%d' height='250' viewBox='0 0 %d 250'>" % (wide, wide)]
        for s in range(0, int(seconds) + 1, 5):
            svg.append("<line x1='%.1f' y1='0' x2='%.1f' y2='250' stroke='#e6dbc4'/><text x='%.1f' y='246' font-size='11'>%d s</text>"
                       % (10 + s * scale, 10 + s * scale, 12 + s * scale, s))
        for m in measured:
            x, w = 10 + m["start"] * scale, max(4, (m["end"] - m["start"]) * scale)
            svg.append("<rect x='%.1f' y='8' width='%.1f' height='34' rx='4' fill='%s'><title>%s %s: %s</title></rect>"
                       % (x, w, COLOURS[m["feeling"]], m["line"], m["feeling"], html.escape(m["english"])))
            svg.append("<text x='%.1f' y='30' font-size='12'>%s</text>" % (x + 4, m["feeling"]))
            svg.append("<foreignObject x='%.1f' y='46' width='%.1f' height='60'><div xmlns='http://www.w3.org/1999/xhtml' "
                       "style='font-size:11px;line-height:1.2'>%s</div></foreignObject>" % (x, w, html.escape(m["english"])))
            svg.append("<text x='%.1f' y='122' font-size='12' fill='%s'>%s %s</text>"
                       % (x + 2, "#2a7a3a" if m["ok"] else "#b02a2a", "✓" if m["ok"] else "✗", m["heard"]))
            y_loud = 200 - (m["loud"] + 40) * 1.6
            svg.append("<line x1='%.1f' y1='%.1f' x2='%.1f' y2='%.1f' stroke='#3a2e22' stroke-width='3'/>" % (x, y_loud, x + w, y_loud))
            svg.append("<circle cx='%.1f' cy='%.1f' r='5' fill='%s' stroke='#3a2e22'/>" % (x + w / 2, 225 - min(20, m["busy"]) * 4, COLOURS[m["feeling"]]))
        svg.append("</svg>")
        out.append("<h2>Scene %s (%.0f s)</h2>" % (scene[1:].lstrip("0"), seconds) + "".join(svg))
    out.append("</body></html>")
    (OUT / "plot.html").write_text("\n".join(out), encoding="utf-8")


main()
