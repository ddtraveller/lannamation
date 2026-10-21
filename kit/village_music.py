"""village_music.py - a Thai-style tune for village.html, saved as village.wav.

    python village_music.py

The instruments of a small Thai band, each made from sine waves: a ranat
(a wooden xylophone) plays the tune, small cymbals (ching) keep the time,
a drum marks the beat, and a low string holds the chord. The tune is written
out by hand below, one letter for one beat. village_sing.py adds the voice.
"""
import wave

import numpy

RATE = 44100                 # samples in one second of sound
BEAT = 0.5                   # seconds; village.html uses the same number
# Five notes only, as in much Thai folk music: G A B D E, low and then high.
# In TUNE they are written C D E G A, the letters a beginner knows, and a
# small letter is the same note one step of the scale higher than the top.
NOTES = {"C": 196.0, "D": 220.0, "E": 246.94, "G": 293.66, "A": 329.63, "c": 392.0}
# One bar is four beats. A letter is a note, a dash is a rest.
TUNE = ("CDEG AGEG "         # the band plays alone
        "EGAG EDC- "         # the rooster crows, the sun is up
        "E-GG AcAG "         # beat the long drum, walk to the temple
        "E-GG AcAG "         # (again)
        "EDC- DECD "         # ... pound by pound,
        "EGAG EDcA "         # the herbal medicine. It's done!
        "cAAG EC-C "         # it's done, it's done
        "DEEG AccA "         # lanterns rise to the sky, good night
        "GEDC ----")
# one chord for each bar: its low note, and the two notes played above it
CHORDS = {"G": (98.0, [196.0, 293.66]), "C": (130.81, [196.0, 329.63]),
          "D": (146.83, [220.0, 293.66])}
BARS = "GG GG GC GC GG GC GG CG GG"


def tone(frequency, seconds):
    time = numpy.arange(int(seconds * RATE)) / RATE
    return time, numpy.sin(2 * numpy.pi * frequency * time)


def ranat(frequency):
    # a wooden bar hit with a mallet: a knock, and a note that dies quickly
    time, low = tone(frequency, 0.9)
    _, high = tone(frequency * 4, 0.9)
    return (low * numpy.exp(-time * 6) + high * 0.3 * numpy.exp(-time * 22)) * 0.5


def ching(open_sound):
    # two small cymbals: "ching" rings, "chap" is damped at once
    time, bright = tone(3100, 0.5)
    _, brighter = tone(4650, 0.5)
    return (bright + brighter * 0.6) * numpy.exp(-time * (9 if open_sound else 40)) * 0.07


def string(frequency):
    # a low plucked string that holds the chord
    time, wave_form = tone(frequency, BEAT * 1.8)
    _, octave = tone(frequency * 2, BEAT * 1.8)
    return (wave_form + octave * 0.4) * numpy.exp(-time * 4) * 0.4


def drum(noise, deep):
    # a drum is a thump with a little hiss on top of it
    time = numpy.arange(int(0.22 * RATE)) / RATE
    start = 130 if deep else 210
    thump = numpy.sin(2 * numpy.pi * (start - 260 * time) * time)
    hiss = noise.uniform(-1, 1, len(time)) * 0.2
    return (thump + hiss) * numpy.exp(-time * 24) * 0.3


def add(track, sound, at_second):
    start = int(at_second * RATE)
    end = min(len(track), start + len(sound))
    track[start:end] += sound[:end - start]


def compose():
    tune = TUNE.replace(" ", "")
    bars = BARS.replace(" ", "")
    noise = numpy.random.RandomState(7)          # the same hiss every time
    track = numpy.zeros(int(len(tune) * BEAT * RATE))
    for beat in range(len(tune)):
        at = beat * BEAT
        low, chord = CHORDS[bars[beat // 4]]
        if beat % 2 == 0:
            add(track, string(low), at)
            add(track, drum(noise, True), at)
        else:
            for frequency in chord:
                add(track, string(frequency * 2) * 0.3, at)
            add(track, drum(noise, False) * 0.6, at)
        add(track, ching(beat % 2 == 0), at)
        if tune[beat] != "-":
            add(track, ranat(NOTES[tune[beat]] * 2), at)       # the ranat plays high,
            add(track, ranat(NOTES[tune[beat]] * 2) * 0.5, at + BEAT / 2)   # and twice

    fade = numpy.ones(len(track))
    fade[-RATE:] = numpy.linspace(1, 0, RATE)
    track = track * fade
    return track / numpy.abs(track).max() * 0.8


def save(track, name):
    with wave.open(name, "wb") as file:
        file.setnchannels(1)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes((track * 32767).astype(numpy.int16).tobytes())


def main():
    track = compose()
    save(track, "village.wav")
    print("village.wav: %.1f seconds, %d beats of %.1f seconds"
          % (len(track) / RATE, len(track) / RATE / BEAT, BEAT))


if __name__ == "__main__":
    main()
