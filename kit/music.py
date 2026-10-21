"""music.py - compose 32 seconds of calm music and save it as lanterns.wav.

    python music.py

No instrument is recorded. Every sound is a sine wave that this file adds up:
a soft chord under everything, and a plucked tune on top of it.

It needs numpy. It writes lanterns.wav in the folder it is run from (mono, 16-bit, 44.1 kHz), prints
its length, and ends with exit code 0.
"""
import random
import wave

import numpy

RATE = 44100                 # samples in one second of sound
BEAT = 0.8                   # seconds; lanterns.html uses the same number
BEATS = 40
# The tune uses a pentatonic scale: five notes (A C D E G), and A and C again,
# higher. In the tune, any of them sounds fine after any other.
TUNE_NOTES = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25]
# four chords (A minor, F, C, G), one for every four beats, round and round
CHORDS = [[110.0, 164.81, 220.0, 261.63],
          [87.31, 174.61, 220.0, 261.63],
          [130.81, 196.0, 261.63, 329.63],
          [98.0, 196.0, 246.94, 293.66]]


def tone(frequency, seconds):
    """A sine wave: (the time of each sample in seconds, its value from -1 to 1), as two numpy arrays.

    frequency: in hz. seconds: how long.
    e.g. time, wave_form = tone(440.0, 0.5)"""
    time = numpy.arange(int(seconds * RATE)) / RATE
    return time, numpy.sin(2 * numpy.pi * frequency * time)


def pad(frequency, seconds):
    """A soft, slow note that swells in and fades away: the samples, a numpy array "seconds" long.

    frequency: in hz. seconds: how long the note lasts.
    e.g. pad(110.0, BEAT * 4.6)"""
    # a soft, slow note: it swells in, then fades away
    time, wave_form = tone(frequency, seconds)
    swell = numpy.sin(numpy.pi * time / seconds) ** 2
    return wave_form * swell * 0.12


def pluck(frequency):
    """A note like a plucked string, loud at once and dying away: the samples, 2.4 s.

    frequency: in hz.
    e.g. pluck(329.63)"""
    # a note like a plucked string: loud at once, then dying away
    time, wave_form = tone(frequency, 2.4)
    _, octave = tone(frequency * 2, 2.4)
    return (wave_form + octave * 0.3) * numpy.exp(-time * 2.6) * 0.3


def add(track, sound, at_second):
    """Add sound into track from at_second on, cut where the track ends. Changes track; gives back nothing.

    e.g. add(track, pluck(220.0), 3.2)"""
    start = int(at_second * RATE)
    end = min(len(track), start + len(sound))
    track[start:end] += sound[:end - start]


def compose():
    """The whole 32 seconds as one numpy array of samples: the chords, the tune (always the same, from a seeded
    chooser), an echo and a fade at each end, peaking at 0.8.

    e.g. track = compose()"""
    chooser = random.Random(7)       # the same "random" tune every time
    track = numpy.zeros(int(BEATS * BEAT * RATE))
    note = 3
    for beat in range(BEATS):
        chord = CHORDS[(beat // 4) % 4]
        if beat % 4 == 0:
            for frequency in chord:
                add(track, pad(frequency, BEAT * 4.6), beat * BEAT)
        # the tune walks up or down a step or two, and sometimes rests
        if chooser.random() < 0.75:
            note = max(0, min(6, note + chooser.choice([-2, -1, -1, 1, 1, 2])))
            add(track, pluck(TUNE_NOTES[note]), beat * BEAT)
        if beat % 2 == 1 and chooser.random() < 0.4:
            add(track, pluck(TUNE_NOTES[note] * 2) * 0.4, (beat + 0.5) * BEAT)

    # an echo: the same music again, later and quieter
    echo = numpy.zeros_like(track)
    delay = int(BEAT * 0.75 * RATE)
    echo[delay:] = track[:-delay] * 0.35
    track = track + echo

    fade = numpy.ones(len(track))
    edge = 2 * RATE
    fade[:edge] = numpy.linspace(0, 1, edge)
    fade[-edge:] = numpy.linspace(1, 0, edge)
    track = track * fade
    return track / numpy.abs(track).max() * 0.8


def save(track, name):
    """Write track (samples from -1 to 1) as a mono 16-bit WAV file called name. Gives back nothing.

    e.g. save(compose(), "lanterns.wav")"""
    with wave.open(name, "wb") as file:
        file.setnchannels(1)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes((track * 32767).astype(numpy.int16).tobytes())


def main():
    """The command line: compose the music, save it as lanterns.wav, print its length."""
    track = compose()
    save(track, "lanterns.wav")
    print("lanterns.wav: %.1f seconds, %d beats of %.1f seconds"
          % (len(track) / RATE, BEATS, BEAT))


if __name__ == "__main__":
    main()
