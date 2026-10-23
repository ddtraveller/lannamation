"""tale_music.py - a Lanna tale's music, scene by scene, each line's music in the feeling its sentence has.

A film's own feelings.py (maeng/feelings.py, changngu/feelings.py) holds what each of its lines feels (FEEL, by the
line's id) and the feelings of its scenes with no words (SCENE_FEEL), and runs this:

    python maeng/feelings.py                # every scene's music, into out/maeng_music/: sNN.wav, and cues.json
    python maeng/feelings.py 4 9            # only scenes 4 and 9
    python maeng/feelings.py --film         # then the film's: out/maeng_music/film.wav, the scenes' joined, with their calls

The owner, 2026-10-19: "Plot each scene musically against the emotion of each sentence and make sure the music
always reflects the emotion of the sentence. Start from the hero video for lanna_cartoon's music." So each line
has a feeling (one of score.py's), and each scene's music (score.py, the hero film's sound) turns to a line's
feeling a moment before the line is said, and holds it until the next line's comes in. A scene's first feeling
holds from its start. The lines' seconds are the scene files' own (their LINES), so a scene's music is made as the
scene is, on its own, and the film's music is the scenes' joined. checks/score_check.py --film NAME hears the
music under every line and says whether it carries that line's feeling, and writes the plot of it (plot.html).

It needs numpy, soundfile and the kit's score.py; --film needs the scenes' sNN.wav made first and sounds.py's
out/sounds/NAME.wav for every call. It prints a line a scene (its cues) or a call, and ends with exit code 0; 1
with a traceback when a line's feeling is not one score.py has (ValueError), a file is missing, or an argument is
not a scene number.
"""
import json
import re
import sys
from pathlib import Path

import numpy
import soundfile

KIT = Path(__file__).resolve().parent
sys.path.insert(0, str(KIT))
from score import FEELINGS, RATE, compose  # noqa: E402


def scenes(folder, prefix):
    """Each scene file's number, length and lines: {n: (seconds, [[from, to, id], ...], file)}.

    folder: the film's folder (a Path); prefix: the letter its scenes' names start with ("S" for S04_LONG, "C" for
    C04_LONG). Reads every sNN_*.js in it for its LONG and LINES; a file without both is left out.
    e.g. scenes(KIT / "maeng", "S")[4]   # (seconds, lines, "s04_wish.js")
    """
    found = {}
    for script in sorted(folder.glob("s[0-9][0-9]_*.js")):
        text = script.read_text(encoding="utf-8")
        n = int(script.name[1:3])
        long = re.search(r"var %s%02d_LONG = ([0-9.]+);" % (prefix, n), text)
        lines = re.search(r"var %s%02d_LINES = (\[.*?\]);" % (prefix, n), text, re.S)
        if not long or not lines:
            continue
        found[n] = (float(long.group(1)), json.loads(lines.group(1)), script.name)
    return found


def cues_of(lines, feel, scene_feel, n=None):
    """A scene's cues: each line's feeling from its first second; the first from the scene's start. A scene with no
    lines takes its cues from scene_feel.

    lines: [[from, to, id], ...] as scenes() gives them (seconds). feel: {line id: feeling}; scene_feel: {scene number:
    cues} for scenes with no words. n: the scene's number, read only when lines is empty. Returns [[second, feeling],
    ...], score.compose's cues. Fails with ValueError when a line's feeling is not in score.FEELINGS, KeyError when a
    line has no feeling or a scene with no lines has no scene_feel.
    e.g. cues_of(scenes(folder, "S")[4][1], FEEL, SCENE_FEEL, 4)
    """
    if not lines:
        return scene_feel[n]
    cues = []
    for k, (start, _, line) in enumerate(lines):
        feeling = feel[line]
        if feeling not in FEELINGS:
            raise ValueError("%s feels %r, which score.py has no music for" % (line, feeling))
        cues.append([0.0 if k == 0 else start, feeling])
    return cues


CALLS = re.compile(r'calls: (\[\[.*?\]\])', re.S)
JOIN = 0.05            # seconds of fade at each join of two scenes' music, so it does not click
LAP = 0.5              # a bed laid end to end: the seconds each lap crosses into the next
EASE = 1.5             # a bed's fade in and out


def bed(heard, seconds):
    """A sound laid end to end for "seconds", each lap crossing into the next over LAP, faded in and out over EASE
    (cicadas, frogs, crickets: a call with a fourth number, how long it lies under the scene).

    heard: one channel at RATE, a numpy array, longer than LAP. seconds: how long the bed is. Returns the new array,
    "seconds" long; heard is not changed.
    e.g. bed(heard, 12.0)
    """
    lap, want = int(LAP * RATE), int(seconds * RATE)
    out = heard.copy()
    rise = numpy.linspace(0, 1, lap)
    while len(out) < want:
        out[-lap:] = out[-lap:] * (1 - rise) + heard[:lap] * rise
        out = numpy.concatenate([out, heard[lap:]])
    out = out[:want]
    ease = min(int(EASE * RATE), want // 2)
    out[:ease] *= numpy.linspace(0, 1, ease)
    out[-ease:] *= numpy.linspace(1, 0, ease)
    return out


def film(folder, prefix, out):
    """The film's music: every scene's (sNN.wav, made first) one after another, as film.html lays the scenes, with
    the sounds their life calls (decorate.js: calls [[second, sound, loudness], ...], sounds.py's out/sounds/NAME.wav)
    laid in at their seconds, in the middle of both ears; a call with a fourth number is a bed, laid end to end for
    that many seconds (bed()). Into out/film.wav.

    folder, prefix: as scenes() takes them; out: the folder of the music (a Path). Returns nothing; prints a line a
    call and one for the film. Fails (AssertionError) when a file is not at score.RATE, and with soundfile's error
    when a sNN.wav or a sound is missing.
    e.g. film(KIT / "maeng", "S", KIT / "out" / "maeng_music")
    """
    parts, calls = [], []
    for n, (seconds, lines, name) in sorted(scenes(folder, prefix).items()):
        music, rate = soundfile.read(str(out / ("s%02d.wav" % n)), always_2d=True)
        assert rate == RATE, name
        music = numpy.pad(music.T, ((0, 0), (0, max(0, int(seconds * RATE) - music.shape[0]))))[:, :int(seconds * RATE)]
        fade = int(JOIN * RATE)
        music[:, :fade] *= numpy.linspace(0, 1, fade)
        music[:, -fade:] *= numpy.linspace(1, 0, fade)
        start = sum(p.shape[1] for p in parts) / RATE
        for found in CALLS.findall((folder / name).read_text(encoding="utf-8")):
            calls += [[start + c[0], c[1], c[2], name] + c[3:] for c in json.loads(found)]
        parts.append(music)
    track = numpy.concatenate(parts, axis=1)
    for at, sound, loud, name, *lies in calls:
        heard, rate = soundfile.read(str(KIT / "out" / "sounds" / (sound + ".wav")), always_2d=True)
        assert rate == RATE, sound
        heard = heard.mean(axis=1) * loud
        if lies:
            heard = bed(heard, lies[0])
        first = int(at * RATE)
        heard = heard[:max(0, track.shape[1] - first)]
        track[:, first:first + len(heard)] += heard
        print("%7.1f s  %-13s %.2f  (%s)%s" % (at, sound, loud, name, "  for %.1f s" % lies[0] if lies else ""))
    soundfile.write(str(out / "film.wav"), track.T, RATE, subtype="FLOAT")
    print("film.wav: %.1f s, %d scenes, %d calls" % (track.shape[1] / RATE, len(parts), len(calls)))


def run(folder, prefix, feel, scene_feel, out, args):
    """A film's feelings.py's command line (the module's text says how): each wanted scene's music into out/sNN.wav
    and every scene's cues into out/cues.json, or with --film alone, film().

    folder, prefix: as scenes() takes them; feel, scene_feel: as cues_of() takes them; out: the music's folder (a
    Path); args: the command line's words after the script's name. Fails as cues_of() and film() do.
    e.g. run(HERE, "S", FEEL, SCENE_FEEL, OUT, sys.argv[1:])
    """
    if args == ["--film"]:
        film(folder, prefix, out)
        return
    wanted = [int(a) for a in args]
    out.mkdir(parents=True, exist_ok=True)
    sheet = {}
    for n, (seconds, lines, name) in sorted(scenes(folder, prefix).items()):
        cues = cues_of(lines, feel, scene_feel, n)
        sheet["s%02d" % n] = {"file": name, "seconds": seconds, "lines": lines, "cues": cues,
                              "feel": {line: feel[line] for _, _, line in lines}}
        if wanted and n not in wanted:
            continue
        track = compose(cues, seconds, seed=n)[:, :int(seconds * RATE)]
        soundfile.write(str(out / ("s%02d.wav" % n)), track.T, RATE, subtype="FLOAT")
        print("s%02d  %5.1f s  %s" % (n, seconds, " ".join("%g:%s" % (c[0], c[1]) for c in cues)))
    (out / "cues.json").write_text(json.dumps(sheet, indent=1), encoding="utf-8")
