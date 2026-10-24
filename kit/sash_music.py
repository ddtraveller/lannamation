"""sash_music.py - 82 seconds of music for sash.html, saved as sash.wav.

    python sash_music.py

Three seconds of silence first, for the still close-up before the music begins; then a soft chord under
everything and a plucked pentatonic tune on top; from the twentieth second a low drum on every beat and a
small ching on the strong ones, for the dancing scenes; an echo, a room, a fade at the end.

The tune is drawn beat by beat from one seeded chooser, so it is the same every time: a longer film adds
beats at the end and leaves the ones before as they were. sash_narrate.py lays the Kam Mueang voice over it.

The instruments (2026-10-16; the owner asked for a better-quality sound for the film, and said "it's good"
of this one): until then every sound was a sine wave added up, as in music.py, and the music had nothing
above 3 kHz, which is what made it sound like a toy. Now the tune is a plucked string (Karplus-Strong: a
burst of noise going round a delay line that averages as it goes), two strings a few cents apart as a
sueng's paired strings are; the chord a soft bowed tone with overtones and a slow vibrato; the drum has a
skin as well as a body; the ching is inharmonic partials that ring and fade. In stereo, with the echo bounced
between the ears and a room (noise dying away, darker as it dies). The notes and beats are the old ones.
Needs numpy, scipy and soundfile. sash.wav is 32-bit float, so sash_narrate.py mixes it without rounding.

It writes sash.wav in the folder it is run from (stereo, 32-bit float, 44.1 kHz), prints its length,
and ends with exit code 0. score.py imports its instruments (string, pad, drum, ching, room, place, lowpass).
"""
import random
import sys

import numpy
import soundfile
from scipy.signal import butter, fftconvolve, sosfilt

RATE = 44100
BEAT = 0.5                   # sash.html uses the same number
SILENCE = 3.0                # seconds before the first note
BEATS = 164                  # 82 seconds of music: the film is 85 s (the pond 3 s longer, 2026-10-21)
TUNE_NOTES = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25]
CHORDS = [[110.0, 164.81, 220.0, 261.63],
          [87.31, 174.61, 220.0, 261.63],
          [130.81, 196.0, 261.63, 329.63],
          [98.0, 196.0, 246.94, 293.66]]


def lowpass(x, hz, order=2):
    """x with what is above hz taken away (a Butterworth low-pass of the given order): a numpy array.

    x: samples at RATE. hz: where it cuts. order: how steeply (default 2).
    e.g. lowpass(noise, 1400)"""
    return sosfilt(butter(order, hz, "low", fs=RATE, output="sos"), x)


def string(frequency, seconds=1.8, brightness=5000, decay=0.996, seed=0):
    """A plucked string (Karplus-Strong): a burst of noise going round a delay line that averages as it goes.

    frequency: in hz. seconds: how long (default 1.8). brightness: the burst's low-pass, in hz (default 5000).
    decay: how much of the sound each trip round keeps (0 to 1, default 0.996). seed: the burst's noise.
    Gives back the samples, a numpy array.
    e.g. string(220.0, seconds=2.4, seed=3)"""
    period = max(2, int(round(RATE / frequency - 0.5)))
    rng = numpy.random.default_rng(seed)
    block = lowpass(rng.uniform(-1, 1, period), brightness)
    out = numpy.empty(int(seconds * RATE) + period)
    k = 0
    while k < len(out):
        n = min(period, len(out) - k)
        out[k:k + n] = block[:n]
        block = decay * 0.5 * (block + numpy.roll(block, 1))
        k += period
    out = out[:int(seconds * RATE)]
    attack = numpy.minimum(1, numpy.arange(len(out)) / (0.002 * RATE))
    return out * attack


def pluck(frequency, seed):
    """One note of the tune, on two strings a few cents apart.

    frequency: in hz. seed: the first string's noise (the second takes seed + 1). Gives back the samples, 1.8 s.
    e.g. pluck(TUNE_NOTES[3], 12)"""
    a = string(frequency, seed=seed)
    b = string(frequency * 1.0035, seed=seed + 1)
    return (a + 0.7 * b) * 0.32


def pad(frequency, seconds, detune):
    """A soft bowed tone with overtones and a slow vibrato, swelling in and out.

    frequency: in hz. seconds: how long. detune: how far off the note, as a fraction (0.002 is about 3 cents).
    Gives back the samples, a numpy array.
    e.g. pad(110.0, BEAT * 9, -0.002)"""
    t = numpy.arange(int(seconds * RATE)) / RATE
    vibrato = 1 + 0.003 * numpy.sin(2 * numpy.pi * 4.8 * t)
    phase = 2 * numpy.pi * frequency * (1 + detune) * numpy.cumsum(vibrato) / RATE
    tone = sum(numpy.sin(n * phase) / n ** 1.6 for n in range(1, 9))
    swell = numpy.sin(numpy.pi * t / seconds) ** 2
    return tone * swell * 0.07


def drum():
    """A low drum: a body falling in pitch, and the slap of its skin. The samples, 0.45 s.

    e.g. drum() * 0.6"""
    t = numpy.arange(int(0.45 * RATE)) / RATE
    body = numpy.sin(2 * numpy.pi * (65 + 55 * numpy.exp(-t * 28)) * t) * numpy.exp(-t * 11)
    body += 0.35 * numpy.sin(2 * numpy.pi * (104 + 80 * numpy.exp(-t * 30)) * t) * numpy.exp(-t * 16)
    skin = lowpass(numpy.random.default_rng(7).uniform(-1, 1, len(t)), 1400) * numpy.exp(-t * 60) * 0.6
    return (body + skin) * 0.5


def ching():
    """The small cymbals: inharmonic partials that ring and fade. The samples, 0.9 s.

    e.g. ching()"""
    t = numpy.arange(int(0.9 * RATE)) / RATE
    partials = [(3150, 1.0), (4220, 0.7), (5380, 0.55), (6960, 0.4), (8830, 0.3), (11200, 0.2)]
    ring = sum(a * numpy.sin(2 * numpy.pi * f * t + f) for f, a in partials) * numpy.exp(-t * 7)
    tick = numpy.random.default_rng(3).uniform(-1, 1, len(t)) * numpy.exp(-t * 90)
    return (ring + 0.5 * tick) * 0.025


def room(seconds=1.4, seed=5):
    """A room: noise dying away, darker as it dies, one impulse response per ear (sash_narrate.py uses it too).

    seconds: how long it rings (default 1.4). seed: its noise. Gives back [left, right], two numpy arrays, each
    scaled to an energy of 1.
    e.g. left, right = room()"""
    t = numpy.arange(int(seconds * RATE)) / RATE
    rng = numpy.random.default_rng(seed)
    ears = []
    for _ in range(2):
        tail = rng.normal(0, 1, len(t)) * numpy.exp(-t * 6.9 / seconds)
        tail = 0.6 * tail + 0.4 * lowpass(tail, 2500)
        ears.append(tail / numpy.sqrt((tail ** 2).sum()))
    return ears


def place(track, sound, at_second, pan=0.0):
    """Add a mono sound to a stereo track at a second, panned from -1 (left) to 1 (right).

    track: a numpy array (2, samples); it is changed. sound: mono samples. at_second: where it starts (cut where the
    track ends). pan: default 0, the middle. Gives back nothing.
    e.g. place(track, ching(), 23.0, 0.45)"""
    start = int(at_second * RATE)
    end = min(track.shape[1], start + len(sound))
    if end <= start:
        return
    left, right = numpy.cos((pan + 1) * numpy.pi / 4), numpy.sin((pan + 1) * numpy.pi / 4)
    track[0, start:end] += sound[:end - start] * left
    track[1, start:end] += sound[:end - start] * right


def tune():
    """The tune, beat by beat, from one seeded chooser: for each beat, the
    note (an index into TUNE_NOTES), whether it is plucked on this beat, and
    whether its octave is plucked half a beat after.

    Gives back a list of BEATS (note, plucked, octave) tuples, the same every time.
    e.g. note, plucked, octave = tune()[0]"""
    chooser = random.Random(11)
    note = 3
    beats = []
    for beat in range(BEATS):
        plucked = chooser.random() < 0.8
        if plucked:
            note = max(0, min(6, note + chooser.choice([-2, -1, -1, 1, 1, 2])))
        octave = beat % 2 == 1 and chooser.random() < 0.5
        beats.append((note, plucked, octave))
    return beats


def compose():
    """The music as two rows, left and right, peaking at 0.8.

    Gives back a numpy array (2, samples): SILENCE, BEATS beats, then 2 s more for the echo and the fade.
    e.g. track = compose()"""
    track = numpy.zeros((2, int((SILENCE + BEATS * BEAT + 2) * RATE)))
    for beat, (note, plucked, octave) in enumerate(tune()):
        at = SILENCE + beat * BEAT
        if beat % 8 == 0:
            for k, frequency in enumerate(CHORDS[(beat // 8) % 4]):
                place(track, pad(frequency, BEAT * 9, -0.002), at, -0.6 + 0.1 * k)
                place(track, pad(frequency, BEAT * 9, 0.002), at, 0.6 - 0.1 * k)
        if plucked:
            place(track, pluck(TUNE_NOTES[note], beat), at, -0.15)
        if octave:
            place(track, pluck(TUNE_NOTES[note] * 2, beat + 500) * 0.4, at + BEAT * 0.5, 0.25)
        if beat >= 40:                                    # the drum joins for the dancing, at the lane
            place(track, drum() * (1.0 if beat % 2 == 0 else 0.6), at, 0.0)
            if beat % 2 == 0:
                place(track, ching(), at, 0.45)
    delay = int(BEAT * 0.75 * RATE)                       # the echo, bounced between the ears
    echo = numpy.zeros_like(track)
    echo[0, delay:] = track[1, :-delay] * 0.3
    echo[1, delay:] = track[0, :-delay] * 0.3
    track = track + echo
    wet = numpy.stack([fftconvolve(track.mean(0), ear)[:track.shape[1]] for ear in room()])
    track = track + 0.22 * wet
    fade = numpy.ones(track.shape[1])
    fade[-2 * RATE:] = numpy.linspace(1, 0, 2 * RATE)
    track = track * fade
    return track / numpy.abs(track).max() * 0.8


def main():
    """The command line: compose the music and write it as sash.wav (32-bit float), print its length.
    python sash_music.py [BEATS] [OUT]: another length and file, for another cut of the hero film (2026-10-24: the
    first Lanna Tale's, sash_maeng.html, read by the narrator herself: python sash_music.py 207 sash_maeng.wav)."""
    global BEATS
    if len(sys.argv) > 1:
        BEATS = int(sys.argv[1])
    out = sys.argv[2] if len(sys.argv) > 2 else "sash.wav"
    track = compose()
    soundfile.write(out, track.T, RATE, subtype="FLOAT")
    print("%s: %.1f seconds, stereo, music from %.1f s, %d beats of %.1f s"
          % (out, track.shape[1] / RATE, SILENCE, BEATS, BEAT))


if __name__ == "__main__":
    main()
