"""sls_sound.py - the night sounds of the Slow Life Studios card: its music with the kit's crickets under it, and
two of the tokay's calls at its end (owner, 2026-10-20: "Add the crickets noise to the SLS scene and at the end 2
tokay sounds").

    python sounds.py crickets tokay                      # the kit's sounds, into out/sounds/ (once)
    python sls_sound.py music.wav sls_intro.mp4 out.mp4  # the card's music and video in, the card with its new sound out

The card's picture is copied as it is (no render); only its sound is mixed again. The crickets (sounds.py's, made
by the kit) lie under the whole card, faded in and out, heard between the music's notes; the tokay's first two
calls, "to-kay, to-kay" (its recording's first 4.2 s: Richard Ling, public domain), come in so the second ends just
before the card does, the music lowered under them.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy
import soundfile

SOUNDS = Path(__file__).resolve().parent / "out" / "sounds"
CRICKETS = 0.7        # the crickets' level: under the music, heard between its notes
TOKAY = 1.0           # the tokay's calls, the music lowered under them (DIP)
TOKAY_CUT = 4.2       # seconds of its recording: two calls, at 0.3 s and 3.3 s
TOKAY_END = 0.5       # seconds of the card left after the tokay's second call
EASE = 1.0            # the crickets' fade in and out
DIP = 0.5             # the music while the tokay calls, faded down and back over 0.3 s


def mono(path, rate):
    sound, got = soundfile.read(str(path), always_2d=True)
    sound = sound.mean(axis=1)
    if got != rate:
        sound = numpy.interp(numpy.arange(int(len(sound) * rate / got)) * got / rate, numpy.arange(len(sound)), sound)
    return sound


def main():
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    music_file, video, out = sys.argv[1:]
    music, rate = soundfile.read(music_file, always_2d=True)
    length = music.shape[0]
    crickets = mono(SOUNDS / "crickets.wav", rate)
    crickets = numpy.tile(crickets, length // len(crickets) + 1)[:length] * CRICKETS
    ease = int(EASE * rate)
    crickets[:ease] *= numpy.linspace(0, 1, ease)
    crickets[-ease:] *= numpy.linspace(1, 0, ease)
    tokay = mono(SOUNDS / "tokay.wav", rate)[:int(TOKAY_CUT * rate)] * TOKAY
    fade = int(0.05 * rate)
    tokay[-fade:] *= numpy.linspace(1, 0, fade)
    at = length - int(TOKAY_END * rate) - len(tokay) + int(0.5 * rate)   # the cut's last half second is quiet after the call
    ramp = int(0.3 * rate)                            # the music lowered under the calls
    down = numpy.clip(numpy.minimum((numpy.arange(length) - (at - ramp)) / ramp, ((at + len(tokay)) - numpy.arange(length)) / ramp), 0, 1)
    gain = 1 - (1 - DIP) * down
    mixed = music * gain[:, None]
    mixed += crickets[:, None]
    mixed[at:at + len(tokay)] += tokay[:length - at, None]
    peak = numpy.abs(mixed).max()
    if peak > 0.97:                                  # held under full scale, the whole card alike
        mixed *= 0.97 / peak
    with tempfile.TemporaryDirectory() as scratch:
        wav = Path(scratch) / "sound.wav"
        soundfile.write(str(wav), mixed, rate, subtype="FLOAT")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", str(wav), "-map", "0:v", "-map", "1:a",
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", out], check=True)
    print("%s: %.1f s, crickets under it, the tokay's two calls from %.1f s" % (out, length / rate, at / rate))


if __name__ == "__main__":
    main()
