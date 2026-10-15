"""sash_music.py - 79 seconds of music for sash.html, saved as sash.wav.

    python sash_music.py

As music.py of the kit: every sound is a sine wave added up. Three seconds of
silence first, for the still close-up before the music begins; then a soft chord
under everything and a plucked pentatonic tune on top; from the twenty-second
second a low drum on every beat, for the dancing scenes; a fade at the end.

The tune is drawn beat by beat from one seeded chooser, so it is the same every
time: a longer film adds beats at the end and leaves the ones before as they were.
sash_narrate.py lays the Kam Mueang voice over it.
"""
import random
import wave

import numpy

RATE = 44100
BEAT = 0.5                   # sash.html uses the same number
SILENCE = 3.0                # seconds before the first note
BEATS = 152                  # 76 seconds of music: the film is 79 s
TUNE_NOTES = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25]
CHORDS = [[110.0, 164.81, 220.0, 261.63],
          [87.31, 174.61, 220.0, 261.63],
          [130.81, 196.0, 261.63, 329.63],
          [98.0, 196.0, 246.94, 293.66]]


def tone(frequency, seconds):
    time = numpy.arange(int(seconds * RATE)) / RATE
    return time, numpy.sin(2 * numpy.pi * frequency * time)


def pad(frequency, seconds):
    time, wave_form = tone(frequency, seconds)
    swell = numpy.sin(numpy.pi * time / seconds) ** 2
    return wave_form * swell * 0.12


def pluck(frequency):
    time, wave_form = tone(frequency, 1.6)
    _, octave = tone(frequency * 2, 1.6)
    return (wave_form + octave * 0.3) * numpy.exp(-time * 3.2) * 0.3


def drum():
    # a low, short thump: a sine that drops in pitch as it dies
    time = numpy.arange(int(0.25 * RATE)) / RATE
    return numpy.sin(2 * numpy.pi * (70 + 60 * numpy.exp(-time * 30)) * time) * numpy.exp(-time * 18) * 0.5


def add(track, sound, at_second):
    start = int(at_second * RATE)
    end = min(len(track), start + len(sound))
    track[start:end] += sound[:end - start]


def save(track, name):
    with wave.open(name, "wb") as file:
        file.setnchannels(1)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes((track * 32767).astype(numpy.int16).tobytes())


def tune():
    """The tune, beat by beat, from one seeded chooser: for each beat, the
    note (an index into TUNE_NOTES), whether it is plucked on this beat, and
    whether its octave is plucked half a beat after."""
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
    track = numpy.zeros(int((SILENCE + BEATS * BEAT + 2) * RATE))
    for beat, (note, plucked, octave) in enumerate(tune()):
        at = SILENCE + beat * BEAT
        chord = CHORDS[(beat // 8) % 4]
        if beat % 8 == 0:
            for frequency in chord:
                add(track, pad(frequency, BEAT * 9), at)
        if plucked:
            add(track, pluck(TUNE_NOTES[note]), at)
        if octave:
            add(track, pluck(TUNE_NOTES[note] * 2) * 0.4, at + BEAT * 0.5)
        if beat >= 40:                                    # the drum joins for the dancing, at the lane
            add(track, drum() * (1.0 if beat % 2 == 0 else 0.6), at)
    echo = numpy.zeros_like(track)
    delay = int(BEAT * 0.75 * RATE)
    echo[delay:] = track[:-delay] * 0.3
    track = track + echo
    fade = numpy.ones(len(track))
    edge = 2 * RATE
    fade[-edge:] = numpy.linspace(1, 0, edge)
    track = track * fade
    return track / numpy.abs(track).max() * 0.8


def main():
    track = compose()
    save(track, "sash.wav")
    print("sash.wav: %.1f seconds, music from %.1f s, %d beats of %.1f s" % (len(track) / RATE, SILENCE, BEATS, BEAT))


if __name__ == "__main__":
    main()
