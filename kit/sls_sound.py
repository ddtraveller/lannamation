"""sls_sound.py - the sounds of the Slow Life Studios card, high over the mountains at dawn: its music with the
wind under it (the kit's own, made by sounds.py), a red-billed blue magpie calling early on, and a flock of birds
passing softly in the middle (owner, 2026-10-21: the card became a misty mountain at dawn with the beings of the
Himmaphan flying; "Drop" the fireflies and the night's crickets and tokay, for wind and birdsong), and at its end a
white-rumped shama singing twice, where the tokay called before ("At the end of the video do two bird calls like the
way the tokay calls were but with a nice sounding bird call from a northern thai bird").

    python sounds.py wind magpie flock shama             # the kit's sounds, into out/sounds/ (once)
    python sls_sound.py music.wav sls_intro.mp4 out.mp4  # the card's music and video in, the card with its new sound out

The card's picture is copied as it is (no render); only its sound is mixed. The wind lies under the whole card,
faded in and out; the magpie (CC0, iNaturalist) at MAGPIE_AT, the flock (Gunter Koenigsmann, CC BY 4.0) at FLOCK_AT,
the shama (Utain Pummarin, CC BY 4.0) so its second song ends SHAMA_END before the card does; the music lowered
under the calls.

It needs ffmpeg on the PATH, numpy and soundfile, and wind.wav, magpie.wav, flock.wav and shama.wav in
out/sounds/ (sounds.py makes them). It writes the third file named (the second's picture, AAC sound) and prints
when each call comes in. Exit code 0; 1 with this text when it is not given three files, or when ffmpeg stops
(CalledProcessError) or a sound is missing.
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
SHAMA, SHAMA_END = 0.8, 0.5      # the shama's two songs, and the seconds of the card left after the second
DIP = 0.75            # the music under the magpie, faded down and back over 0.4 s
SHAMA_DIP = 0.5       # the music under the shama, lower: the card's last sound


def mono(path, rate):
    """A sound file read as one channel (the ears averaged) at "rate" samples a second, a numpy array.

    path: the file (a Path or a str). rate: samples a second; a file at another rate is resampled by straight
    lines between samples. Fails with soundfile's error when the file is not there.
    e.g. mono(SOUNDS / "wind.wav", 48000)
    """
    sound, got = soundfile.read(str(path), always_2d=True)
    sound = sound.mean(axis=1)
    if got != rate:
        sound = numpy.interp(numpy.arange(int(len(sound) * rate / got)) * got / rate, numpy.arange(len(sound)), sound)
    return sound


def place(mixed, sound, at, rate):
    """Adds a one-channel sound into both ears of "mixed" from second "at"; what runs past its end is cut off.

    mixed: the mix, a numpy array (samples, ears), changed in place. sound: one channel. at: seconds. rate:
    samples a second. Returns (first, last) samples it covered (equal when it starts after the end).
    e.g. place(mixed, magpie, MAGPIE_AT, rate)
    """
    a = int(at * rate)
    room = min(len(sound), len(mixed) - a)
    if room > 0:
        mixed[a:a + room] += sound[:room, None]
    return a, a + room


def main():
    """The script (the module's text says how): reads sys.argv, writes the card with its new sound, prints a line.

    Fails with SystemExit (this module's text) when it is not given three files.
    """
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
    shama = mono(SOUNDS / "shama.wav", rate) * SHAMA
    fade = int(0.05 * rate)
    shama[:fade] *= numpy.linspace(0, 1, fade)
    shama[-fade:] *= numpy.linspace(1, 0, fade)
    shama_at = (length - int(SHAMA_END * rate) - len(shama) + int(0.3 * rate)) / rate   # its cut ends 0.3 s after the call
    ramp = int(0.4 * rate)
    k = numpy.arange(length)

    def dip(at, sound, low):                         # the music faded down to "low" under a sound and back
        a, b = int(at * rate), int(at * rate) + len(sound)
        return (1 - low) * numpy.clip(numpy.minimum((k - (a - ramp)) / ramp, (b - k) / ramp), 0, 1)

    down = numpy.maximum(dip(MAGPIE_AT, magpie, DIP), dip(shama_at, shama, SHAMA_DIP))
    mixed = music * (1 - down)[:, None]
    mixed += wind[:, None]
    place(mixed, magpie, MAGPIE_AT, rate)
    place(mixed, flock, FLOCK_AT, rate)
    place(mixed, shama, shama_at, rate)
    peak = numpy.abs(mixed).max()
    if peak > 0.97:                                  # held under full scale, the whole card alike
        mixed *= 0.97 / peak
    with tempfile.TemporaryDirectory() as scratch:
        wav = Path(scratch) / "sound.wav"
        soundfile.write(str(wav), mixed, rate, subtype="FLOAT")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", str(wav), "-map", "0:v", "-map", "1:a",
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", out], check=True)
    print("%s: %.1f s, wind under it, the magpie from %.1f s, a flock from %.1f s, the shama from %.2f s" % (
        out, length / rate, MAGPIE_AT, FLOCK_AT, shama_at))


if __name__ == "__main__":
    main()
