"""sls_sound.py - the sounds of the Slow Life Studios card, high over the mountains at dawn: its music with the
wind under it (the kit's own, made by sounds.py), a red-billed blue magpie calling early on, and a flock of birds
passing softly in the middle (owner, 2026-10-21: the card became a misty mountain at dawn with the beings of the
Himmaphan flying; "Drop" the fireflies and the night's crickets and tokay, for wind and birdsong).

    python sounds.py wind magpie flock                   # the kit's sounds, into out/sounds/ (once)
    python sls_sound.py music.wav sls_intro.mp4 out.mp4  # the card's music and video in, the card with its new sound out

The card's picture is copied as it is (no render); only its sound is mixed. The wind lies under the whole card,
faded in and out; the magpie (CC0, iNaturalist) at MAGPIE_AT, the flock (Gunter Koenigsmann, CC BY 4.0) at FLOCK_AT,
the music lowered a little under the calls.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy
import soundfile

SOUNDS = Path(__file__).resolve().parent / "out" / "sounds"
WIND = 0.55           # the wind's level, under the music
MAGPIE, MAGPIE_AT = 0.45, 2.2     # the magpie's calls, soft, and when they begin
FLOCK, FLOCK_AT = 0.3, 5.5        # the flock passing, softer, and when
EASE = 1.5            # the wind's and the flock's fade in and out
DIP = 0.75            # the music under the calls, faded down and back over 0.4 s


def mono(path, rate):
    sound, got = soundfile.read(str(path), always_2d=True)
    sound = sound.mean(axis=1)
    if got != rate:
        sound = numpy.interp(numpy.arange(int(len(sound) * rate / got)) * got / rate, numpy.arange(len(sound)), sound)
    return sound


def place(mixed, sound, at, rate):
    a = int(at * rate)
    room = min(len(sound), len(mixed) - a)
    if room > 0:
        mixed[a:a + room] += sound[:room, None]
    return a, a + room


def main():
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    music_file, video, out = sys.argv[1:]
    music, rate = soundfile.read(music_file, always_2d=True)
    length = music.shape[0]
    ease = int(EASE * rate)
    wind = mono(SOUNDS / "wind.wav", rate)
    wind = numpy.tile(wind, length // len(wind) + 1)[:length] * WIND
    wind[:ease] *= numpy.linspace(0, 1, ease)
    wind[-ease:] *= numpy.linspace(1, 0, ease)
    magpie = mono(SOUNDS / "magpie.wav", rate) * MAGPIE
    flock = mono(SOUNDS / "flock.wav", rate) * FLOCK
    flock[:ease] *= numpy.linspace(0, 1, ease)
    flock[-ease:] *= numpy.linspace(1, 0, ease)
    a, b = int(MAGPIE_AT * rate), int(MAGPIE_AT * rate) + len(magpie)
    ramp = int(0.4 * rate)
    k = numpy.arange(length)
    down = numpy.clip(numpy.minimum((k - (a - ramp)) / ramp, (b - k) / ramp), 0, 1)
    mixed = music * (1 - (1 - DIP) * down)[:, None]
    mixed += wind[:, None]
    place(mixed, magpie, MAGPIE_AT, rate)
    place(mixed, flock, FLOCK_AT, rate)
    peak = numpy.abs(mixed).max()
    if peak > 0.97:                                  # held under full scale, the whole card alike
        mixed *= 0.97 / peak
    with tempfile.TemporaryDirectory() as scratch:
        wav = Path(scratch) / "sound.wav"
        soundfile.write(str(wav), mixed, rate, subtype="FLOAT")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", str(wav), "-map", "0:v", "-map", "1:a",
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", out], check=True)
    print("%s: %.1f s, wind under it, the magpie from %.1f s, a flock from %.1f s" % (out, length / rate, MAGPIE_AT, FLOCK_AT))


if __name__ == "__main__":
    main()
