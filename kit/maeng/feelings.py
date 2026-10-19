"""feelings.py - what each line of the film of the creature with four ears and five eyes feels, and its music.

    python maeng/feelings.py                # every scene's music, into out/maeng_music/: sNN.wav, and cues.json
    python maeng/feelings.py 4 9            # only scenes 4 and 9
    python maeng/feelings.py --film         # then the film's: out/maeng_music/film.wav, the scenes' joined, with their calls

The owner, 2026-10-19: "Plot each scene musically against the emotion of each sentence and make sure the music
always reflects the emotion of the sentence. Start from the hero video for lanna_cartoon's music." So each line
(words.js) has a feeling (FEEL, below: one of score.py's), and each scene's music (score.py, the hero film's
sound) turns to a line's feeling a moment before the line is said, and holds it until the next line's comes in.
A scene's first feeling holds from its start. The lines' seconds are the scene files' own (sNN_LINES in
sNN_*.js), so a scene's music is made as the scene is, on its own, and the film's music is the scenes' joined.
checks/score_check.py hears the music under every line and says whether it carries that line's feeling, and
writes the plot of it (out/maeng_music/plot.html).
"""
import json
import re
import sys
from pathlib import Path

import numpy
import soundfile

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from score import FEELINGS, RATE, compose  # noqa: E402

OUT = HERE.parent / "out" / "maeng_music"

# Each line's feeling, as its sentence has it.
FEEL = {
    # 1: the mountain, the cave, the title
    "M001": "wonder", "M002": "wonder", "M003": "mystery", "M004": "wonder",
    # 2: the poor family; the mother passes away
    "M005": "tender", "M006": "tender", "M007": "tender", "M008": "sad", "M009": "sad", "M010": "grief", "M011": "sad",
    # 3: work for the headman, never a complaint
    "M012": "calm", "M013": "calm", "M014": "tender",
    # 4: the father's illness, his wish, his death
    "M015": "sad", "M016": "tender", "M017": "tender", "M018": "tender", "M019": "sad", "M020": "mystery",
    "M021": "tender", "M022": "grief", "M023": "grief",
    # 5: up the mountain with the rope; the snare at the cave
    "M024": "calm", "M025": "tense", "M026": "mystery", "M027": "calm",
    # 6: something caught: the creature
    "M028": "tense", "M029": "tense", "M030": "wonder", "M031": "wonder", "M032": "wonder", "M033": "tender",
    "M034": "tender", "M035": "joy",
    # 7: it will not eat; the ember
    "M036": "calm", "M037": "comic", "M038": "comic", "M039": "sleepy", "M040": "calm", "M041": "comic",
    "M042": "comic", "M043": "joy", "M044": "joy",
    # 8: gold
    "M045": "wonder", "M046": "joy", "M047": "calm", "M048": "joy", "M049": "tender",
    # 9: the king's test
    "M050": "royal", "M051": "royal", "M052": "royal", "M053": "royal", "M054": "royal", "M055": "royal", "M056": "comic",
    # 10: the golden trough, built in a night
    "M057": "hope", "M058": "hope", "M059": "wonder", "M060": "tender", "M061": "bustle", "M062": "wonder", "M063": "triumph",
    # 11: the king's morning
    "M064": "sleepy", "M065": "wonder", "M066": "royal", "M067": "tender", "M068": "joy",
    # 12: the wedding, the Righteous King
    "M069": "joy", "M070": "tender", "M071": "tender", "M072": "triumph",
    # 13: the creature goes home
    "M073": "mystery", "M074": "fear", "M075": "fear", "M076": "sad", "M077": "calm",
    # 14: the goodbye
    "M078": "tender", "M079": "joy",
}

# A scene with no words has its feelings here, as cues: 15, the credits, warm and then glad toward the studio's name.
SCENE_FEEL = {15: [[0.0, "tender"], [166.0, "joy"]]}


def scenes():
    """Each scene file's number, length and lines: {n: (seconds, [[from, to, id], ...], file)}."""
    found = {}
    for script in sorted(HERE.glob("s[0-9][0-9]_*.js")):
        text = script.read_text(encoding="utf-8")
        n = int(script.name[1:3])
        long = re.search(r"var S%02d_LONG = ([0-9.]+);" % n, text)
        lines = re.search(r"var S%02d_LINES = (\[.*?\]);" % n, text, re.S)
        if not long or not lines:
            continue
        rows = json.loads(re.sub(r'"(M\d+)"', r'"\1"', lines.group(1)))
        found[n] = (float(long.group(1)), rows, script.name)
    return found


def cues_of(lines, n=None):
    """A scene's cues: each line's feeling from its first second; the first from the scene's start. A scene with no
    lines takes its cues from SCENE_FEEL."""
    if not lines:
        return SCENE_FEEL[n]
    cues = []
    for k, (start, _, line) in enumerate(lines):
        feeling = FEEL[line]
        if feeling not in FEELINGS:
            raise ValueError("%s feels %r, which score.py has no music for" % (line, feeling))
        cues.append([0.0 if k == 0 else start, feeling])
    return cues


CALLS = re.compile(r'calls: (\[\[.*?\]\])', re.S)
JOIN = 0.05            # seconds of fade at each join of two scenes' music, so it does not click


def film():
    """The film's music: every scene's (sNN.wav, made first) one after another, as film.html lays the scenes, with
    the sounds their life calls (decorate.js: calls [[second, sound, loudness], ...], sounds.py's out/sounds/NAME.wav)
    laid in at their seconds, in the middle of both ears. Into out/maeng_music/film.wav."""
    parts, calls = [], []
    for n, (seconds, lines, name) in sorted(scenes().items()):
        music, rate = soundfile.read(str(OUT / ("s%02d.wav" % n)), always_2d=True)
        assert rate == RATE, name
        music = numpy.pad(music.T, ((0, 0), (0, max(0, int(seconds * RATE) - music.shape[0]))))[:, :int(seconds * RATE)]
        fade = int(JOIN * RATE)
        music[:, :fade] *= numpy.linspace(0, 1, fade)
        music[:, -fade:] *= numpy.linspace(1, 0, fade)
        start = sum(p.shape[1] for p in parts) / RATE
        for found in CALLS.findall((HERE / name).read_text(encoding="utf-8")):
            calls += [[start + at, sound, loud, name] for at, sound, loud in json.loads(found)]
        parts.append(music)
    track = numpy.concatenate(parts, axis=1)
    for at, sound, loud, name in calls:
        heard, rate = soundfile.read(str(HERE.parent / "out" / "sounds" / (sound + ".wav")), always_2d=True)
        assert rate == RATE, sound
        heard = heard.mean(axis=1) * loud
        first = int(at * RATE)
        heard = heard[:max(0, track.shape[1] - first)]
        track[:, first:first + len(heard)] += heard
        print("%7.1f s  %-13s %.2f  (%s)" % (at, sound, loud, name))
    soundfile.write(str(OUT / "film.wav"), track.T, RATE, subtype="FLOAT")
    print("film.wav: %.1f s, %d scenes, %d calls" % (track.shape[1] / RATE, len(parts), len(calls)))


def main():
    if sys.argv[1:] == ["--film"]:
        film()
        return
    wanted = [int(a) for a in sys.argv[1:]]
    OUT.mkdir(parents=True, exist_ok=True)
    sheet = {}
    for n, (seconds, lines, name) in sorted(scenes().items()):
        cues = cues_of(lines, n)
        sheet["s%02d" % n] = {"file": name, "seconds": seconds, "lines": lines, "cues": cues,
                              "feel": {line: FEEL[line] for _, _, line in lines}}
        if wanted and n not in wanted:
            continue
        track = compose(cues, seconds, seed=n)[:, :int(seconds * RATE)]
        soundfile.write(str(OUT / ("s%02d.wav" % n)), track.T, RATE, subtype="FLOAT")
        print("s%02d  %5.1f s  %s" % (n, seconds, " ".join("%g:%s" % (c[0], c[1]) for c in cues)))
    (OUT / "cues.json").write_text(json.dumps(sheet, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
