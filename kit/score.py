"""score.py - music that follows a story's feelings: cues in, music out, in the hero film's sound.

    from score import compose, FEELINGS
    track = compose([[0, "wonder"], [9.4, "sad"], [21.0, "joy"]], seconds=30)

A film says what each moment feels (a cue: a second and a feeling's name, each until the next), and the music
turns with it: a moment before each cue it crosses over, in a second and a half, to that feeling's music. It is
the hero film's music (sash_music.py: its plucked sueng strings, its bowed chords, its drum and ching, its echo
and its room, imported from there, not copied), and "calm" is that film's own: its pentatonic tune on A, its four
chords. Every other feeling changes what that music does, by plain rules (FEELINGS below): which notes it plays,
how high, how often a string is plucked and whether its line climbs or falls, its chords, its drum and ching, how
long its notes ring, how loud it is.

Each feeling's notes are its own set of five (or four), and a set of feelings that are alike share theirs: the
calm and the gentle (A C D E G, the hero film's), the glad (G A B D E: a B), the royal (D E F# A B: an F#), the
wondering (A B C# E F#: a C#), the mysterious (A B C# D# F: whole tones), the sad (D F G A C: an F), the tense and the afraid (a
B flat against the A). So the notes of the music under a moment say which feeling it carries, and a check can hear
it (checks/score_check.py). Needs numpy, scipy and soundfile, as sash_music.py does.
"""
import random

import numpy
from scipy.signal import fftconvolve

from sash_music import RATE, ching, drum, lowpass, pad, place, room, string

BEAT = 0.5
A = 220.0


def hz(semitones):                                  # a note, in semitones from the A below middle C
    """A note's frequency in hz, from semitones above (or below, when less than 0) the A of 220 hz.

    e.g. hz(3)          # 261.63, the C above it"""
    return A * 2 ** (semitones / 12)


# The notes of each set of feelings, in semitones from A (one octave), low to high.
SETS = {"hero": [0, 3, 5, 7, 10],                   # A C D E G, the hero film's own
        "glad": [-2, 0, 2, 5, 7],                   # G A B D E
        "royal": [-7, -5, -3, 0, 2],                # D E F# A B
        "wonder": [0, 2, 4, 7, 9],                  # A B C# E F#
        "mystery": [0, 2, 4, 6, 8],                 # A B C# D# F: whole tones, the sound of a dream
        "sad": [-7, -4, -2, 0, 3],                  # D F G A C
        "dread": [0, 1, 5, 7]}                      # A Bb D E

# Each feeling (every name a cue may use):
#   notes    its set of notes (SETS)
#   octave   how far up (1) or down (-1) its tune lies
#   pluck    how many plucks a beat (0.5, 1, 2, 4) and how likely each is (0 to 1)
#   lean     which way its tune leans: up (above 0) or down
#   ring     how long a plucked note rings, in seconds
#   chord    how loud its bowed chord is (0, none)
#   drum     its drum: none, "slow" (every other beat), "beat", "dance" (every beat, the strong ones harder,
#            the ching on them), "heart" (a soft double beat, low), "big" (dance, and a low gong on the bar)
#   loud     how loud, against the others
FEELINGS = {
    "calm":    {"notes": "hero", "octave": 0, "pluck": [1, 0.8], "lean": 0, "ring": 1.8, "chord": 1, "drum": None, "loud": 0.8},
    "tender":  {"notes": "hero", "octave": 1, "pluck": [1, 0.5], "lean": 0, "ring": 2.4, "chord": 1.3, "drum": None, "loud": 0.6},
    "sleepy":  {"notes": "hero", "octave": 0, "pluck": [0.5, 0.5], "lean": -0.2, "ring": 2.6, "chord": 0.8, "drum": None, "loud": 0.45},
    "wonder":  {"notes": "wonder", "octave": 1, "pluck": [2, 0.8], "lean": 0.4, "ring": 2.6, "chord": 1, "drum": None, "loud": 0.7},
    "mystery": {"notes": "mystery", "octave": -1, "pluck": [0.5, 0.7], "lean": 0, "ring": 2.8, "chord": 0.9, "drum": None, "loud": 0.6},
    "comic":   {"notes": "glad", "octave": 0, "pluck": [2, 0.85], "lean": 0, "ring": 0.35, "chord": 0.4, "drum": "beat", "loud": 0.8},
    "joy":     {"notes": "glad", "octave": 1, "pluck": [2, 0.75], "lean": 0.2, "ring": 1.4, "chord": 1, "drum": "dance", "loud": 0.9},
    "hope":    {"notes": "glad", "octave": 0, "pluck": [1, 0.75], "lean": 0.5, "ring": 1.8, "chord": 1, "drum": "slow", "loud": 0.75},
    "bustle":  {"notes": "glad", "octave": 0, "pluck": [2, 0.9], "lean": 0, "ring": 0.6, "chord": 0.6, "drum": "beat", "loud": 0.85},
    "triumph": {"notes": "glad", "octave": 1, "pluck": [2, 0.9], "lean": 0.3, "ring": 1.6, "chord": 1.4, "drum": "big", "loud": 1.0},
    "royal":   {"notes": "royal", "octave": 0, "pluck": [1, 0.9], "lean": 0, "ring": 2.0, "chord": 1.2, "drum": "slow", "loud": 0.8},
    "sad":     {"notes": "sad", "octave": 0, "pluck": [0.5, 0.85], "lean": -0.4, "ring": 2.6, "chord": 1.2, "drum": None, "loud": 0.6},
    "grief":   {"notes": "sad", "octave": -1, "pluck": [0.5, 0.6], "lean": -0.6, "ring": 3.0, "chord": 1.5, "drum": None, "loud": 0.5},
    "tense":   {"notes": "dread", "octave": -1, "pluck": [4, 0.6], "lean": 0, "ring": 0.5, "chord": 0.7, "drum": "heart", "loud": 0.7},
    "fear":    {"notes": "dread", "octave": 0, "pluck": [4, 0.85], "lean": 0.2, "ring": 0.4, "chord": 0.8, "drum": "heart", "loud": 0.85},
}
CROSS = 1.5                                          # seconds over which the music turns from one feeling to the next
EARLY = 0.6                                          # it begins to turn this long before its cue


# Each set's four chords (semitones from A 220, the bass first): every chord holds the notes that are the set's
# own, so that a chord says its feeling: sadness's minor third (F), gladness's B, the royal F#, wonder's C#, the
# mystery's whole tones (C#, D#, F), dread's B flat against the A. The calm's are the hero film's A minor and C chords
# (sash_music.py's first and third), and two of its own five notes in place of that film's F and G, whose F and
# B are not in its tune.
CHORDS = {"hero": [[-12, -5, 0, 3], [-9, -2, 3, 7], [-19, -7, 3, 7], [-14, -2, 3, 7]],      # Am; C; D A C E; G C E
          "glad": [[-14, -2, 2, 5], [-17, -5, 2, 10], [-19, -7, 0, 2], [-12, -5, 2, 7]],    # G B D; E G B (D); D A B; A E B E
          "royal": [[-19, -7, -3, 0], [-22, -10, -7, -3], [-17, -5, 0, 9], [-12, 0, 7, 9]], # D F# A; B D F#; E A F#; A E F#
          "wonder": [[-12, 0, 4, 7], [-15, -3, 0, 4], [-17, -5, 2, 4], [-22, -10, -3, 4]],  # A C# E; F# A C#; E B C#; B F# C#
          "mystery": [[-12, -8, -4, 0], [-10, -6, -4, 2], [-20, -8, -4, 0], [-18, -6, 2, 8]],  # A C# F; B D# F; C# F A; D# B F
          "sad": [[-19, -7, -4, 0], [-16, -4, 0, 3], [-14, -2, 3, 8], [-12, 0, 3, 8]],     # D F A; F A C; G C F; A C F
          "dread": [[-12, -5, 1, 7], [-23, -11, -7, -5], [-19, -7, 0, 1], [-17, -5, 1, 5]]}  # A E Bb; Bb D E; D A Bb; E Bb D


def chords(notes):
    """A set's four chords, as frequencies.

    notes: a key of SETS and CHORDS ("hero", "glad" ...). Gives back four lists of hz, the bass first.
    e.g. chords("sad")"""
    return [[hz(s) for s in row] for row in CHORDS[notes]]


def feeling_music(name, seconds, seed):
    """One feeling's music, "seconds" long: a stereo track, its tune, chords and drum by the feeling's rules.

    name: a key of FEELINGS. seconds: how long the tune plays. seed: its chooser (the same seed, the same music).
    Gives back a numpy array (2, samples), 3.5 s longer than "seconds" for the notes to ring out, at the
    feeling's loudness. A name not in FEELINGS is a KeyError.
    e.g. feeling_music("joy", 10, 1)"""
    f = FEELINGS[name]
    track = numpy.zeros((2, int((seconds + 3.5) * RATE)))
    steps = SETS[f["notes"]]
    notes = [hz(s + 12 * f["octave"]) for s in steps] + [hz(s + 12 * (f["octave"] + 1)) for s in steps[:2]]
    every, likely = f["pluck"]
    chooser = random.Random(seed)
    note, beats = 2, int(seconds / BEAT) + 1
    rows = chords(f["notes"])
    if f["chord"]:                                    # a chord already sounding as the feeling comes in, fading as the first swells
        half = int(BEAT * 4.5 * RATE)
        for k, frequency in enumerate(rows[3]):
            place(track, pad(frequency, BEAT * 9, -0.002)[half:] * f["chord"], 0.0, -0.6 + 0.1 * k)
            place(track, pad(frequency, BEAT * 9, 0.002)[half:] * f["chord"], 0.0, 0.6 - 0.1 * k)
    for beat in range(beats):
        at = beat * BEAT
        if beat % 8 == 0 and f["chord"]:            # the chord, swelling over two bars, as the hero film's
            for k, frequency in enumerate(rows[(beat // 8) % 4]):
                place(track, pad(frequency, BEAT * 9, -0.002) * f["chord"], at, -0.6 + 0.1 * k)
                place(track, pad(frequency, BEAT * 9, 0.002) * f["chord"], at, 0.6 - 0.1 * k)
        for sub in range(max(1, int(every))):
            if every < 1 and beat % int(round(1 / every)):
                continue
            if chooser.random() >= likely:
                continue
            step = chooser.choice([-2, -1, -1, 1, 1, 2]) + (1 if chooser.random() < abs(f["lean"]) else 0) * (1 if f["lean"] > 0 else -1)
            note = max(0, min(len(notes) - 1, note + step))
            when = at + sub * BEAT / max(1, every)
            a = string(notes[note], seconds=f["ring"], seed=seed * 1000 + beat * 4 + sub)
            b = string(notes[note] * 1.0035, seconds=f["ring"], seed=seed * 1000 + beat * 4 + sub + 1)
            place(track, (a + 0.7 * b) * 0.32 * (0.75 if sub else 1), when, -0.15)
        kind = f["drum"]
        if kind == "slow" and beat % 2 == 0:
            place(track, drum() * 0.7, at, 0.0)
        elif kind == "beat":
            place(track, drum() * (0.8 if beat % 2 == 0 else 0.5), at, 0.0)
        elif kind in ("dance", "big"):
            place(track, drum() * (1.0 if beat % 2 == 0 else 0.6), at, 0.0)
            if beat % 2 == 0:
                place(track, ching(), at, 0.45)
            if kind == "big" and beat % 8 == 0:     # a low gong on the bar
                t = numpy.arange(int(2.5 * RATE)) / RATE
                gong = sum(a * numpy.sin(2 * numpy.pi * f0 * t) for f0, a in [(98, 1), (196.4, 0.5), (279, 0.35), (417, 0.2)])
                place(track, gong * numpy.exp(-t * 1.6) * 0.18, at, 0.0)
        elif kind == "heart":                        # a soft double beat, low, as a heart beats
            place(track, lowpass(drum(), 300) * 0.55, at, 0.0)
            place(track, lowpass(drum(), 300) * 0.35, at + 0.22, 0.0)
    return track * f["loud"]


def compose(cues, seconds, seed=1):
    """The music of a stretch of film "seconds" long whose feelings are "cues" ([[second, feeling], ...], each
    until the next): each feeling's music, crossed over to the next from EARLY before its cue, over CROSS
    seconds; then the hero film's echo and room over all of it, and a fade at the end. Stereo, peaking at 0.8.

    seed: default 1. Gives back a numpy array (2, samples), 2 s longer than "seconds". Fails with ValueError
    for a feeling not in FEELINGS. The first cue's music starts at second 0, wherever that cue is.
    e.g. compose([[0, "wonder"], [9.4, "sad"], [21.0, "joy"]], seconds=30)"""
    cues = sorted(cues)
    track = numpy.zeros((2, int((seconds + 4) * RATE)))
    for n, (at, name) in enumerate(cues):
        if name not in FEELINGS:
            raise ValueError("no feeling called %r; the feelings are %s" % (name, ", ".join(FEELINGS)))
        # each feeling comes in over CROSS from EARLY before its cue, and goes out over the same CROSS as the next
        # comes in: the two cross in the one window, and nowhere else
        start = 0.0 if n == 0 else max(0.0, at - EARLY)
        end = seconds if n == len(cues) - 1 else max(start + 0.1, cues[n + 1][0] - EARLY)
        length = int((end - start + CROSS + 3) * RATE)
        piece = feeling_music(name, end - start + CROSS + 3, seed * 100 + n)[:, :length]
        shape = numpy.ones(piece.shape[1])
        if n:
            shape[:int(CROSS * RATE)] = numpy.linspace(0, 1, int(CROSS * RATE))
        tail = int((end - start) * RATE)
        if n < len(cues) - 1:                         # out over CROSS, as the next comes in
            shape[tail:tail + int(CROSS * RATE)] = numpy.linspace(1, 0, int(CROSS * RATE))
            shape[tail + int(CROSS * RATE):] = 0
        piece = piece * shape
        begin = int(start * RATE)
        stop = min(track.shape[1], begin + piece.shape[1])
        track[:, begin:stop] += piece[:, :stop - begin]
    track = track[:, :int((seconds + 2) * RATE)]
    delay = int(BEAT * 0.75 * RATE)                   # the hero film's echo, bounced between the ears
    echo = numpy.zeros_like(track)
    echo[0, delay:] = track[1, :-delay] * 0.3
    echo[1, delay:] = track[0, :-delay] * 0.3
    track = track + echo
    wet = numpy.stack([fftconvolve(track.mean(0), ear)[:track.shape[1]] for ear in room()])
    track = track + 0.22 * wet
    fade = numpy.ones(track.shape[1])
    fade[-2 * RATE:] = numpy.linspace(1, 0, 2 * RATE)
    track = track * fade
    return track / (numpy.abs(track).max() or 1) * 0.8
