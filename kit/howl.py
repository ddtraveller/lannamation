"""howl.py - a creature's howl, synthesized from nothing but numbers: no recording goes into it.

    python howl.py outline.json howl.wav

The outline (JSON) says how the howl goes:
    "seconds"   how long it lasts
    "pitch"     [[second, hz], ...]: the voice's pitch, point to point (a howl rises, holds, and falls away)
    "loud"      [[second, 0 to 1], ...]: how loud, point to point
    "vowel"     [[second, 0 to 1], ...]: the mouth, from "oo" (0, nearly shut) to "ah" (1, wide open)
    "growl"     0 to 1: a rough voice under the tone, half its pitch (a big throat)
    "breath"    0 to 1: breath through it
    "wobble"    [hz, depth in semitones]: the voice's waver
    "size"      1, or more for a bigger throat: the vowel's resonances lower by that much
    "cave"      [seconds, 0 to 1]: an echo, how long it rings and how much of it is heard
    "seed"      for the small unevenness of a living voice

Or, for several howling together (a wolf pack round a creature), the outline is {"voices": [...], "cave": ...}:
each voice an outline as above, with "at" (the second it starts) and "gain" (how loud, 0 to 1; a far wolf is
quieter), all mixed and then echoed by the one "cave".

It writes a mono 44.1 kHz WAV. Each part is a plain rule: a train of pulses glides along the pitch (a voice); a
pulse train at half the pitch, mixed in by "growl", roughens it; noise is breath; three resonances move between the
"oo" and the "ah" (formants); an echo of decaying noise rings after it (a cave). Needs numpy and scipy.
"""
import json
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve, lfilter

RATE = 44100
VOWELS = {"oo": [(300, 90), (870, 120), (2240, 160)],      # the resonances of a mouth nearly shut, and wide open
          "ah": [(730, 110), (1090, 130), (2440, 170)]}


def track(points, times):
    """A value at every sample, from [[second, value], ...], joined smoothly (eased between the points)."""
    points = sorted(points)
    at = np.array([p[0] for p in points]), np.array([p[1] for p in points], dtype=float)
    k = np.clip(np.searchsorted(at[0], times) - 1, 0, len(points) - 2)
    span = np.maximum(at[0][k + 1] - at[0][k], 1e-9)
    u = np.clip((times - at[0][k]) / span, 0, 1)
    u = u * u * (3 - 2 * u)
    return at[1][k] + (at[1][k + 1] - at[1][k]) * u


def pulses(hz, rng, jitter):
    """A voice's pulses along a pitch: a sawtooth softened to a glottal shape, its period a little uneven."""
    wobble = 1 + jitter * np.cumsum(rng.normal(0, 1, len(hz))) / np.sqrt(np.arange(1, len(hz) + 1))
    phase = np.cumsum(hz * wobble / RATE) % 1.0
    wave = (1 - phase) ** 3 - 0.25                  # a sharp close, a slow open
    return wave - wave.mean()


def resonance(signal, centre, width):
    """One resonance (a two-pole band filter) that moves: filtered in blocks of 256 samples, each with its own
    centre, so it follows the mouth as it opens."""
    out, state, block = np.zeros_like(signal), np.zeros(2), 256
    for start in range(0, len(signal), block):
        f, w = centre[start], width[start]
        r = np.exp(-np.pi * w / RATE)
        a = [1, -2 * r * np.cos(2 * np.pi * f / RATE), r * r]
        piece = signal[start:start + block]
        y, state = lfilter([1 - r], a, piece, zi=state)
        out[start:start + block] = y
    return out


def cave(signal, seconds, amount, rng):
    """An echo: the sound once more through a ring of decaying noise, darker as it fades."""
    n = int(seconds * RATE)
    tail = rng.normal(0, 1, n) * np.exp(-np.arange(n) / (n / 6))
    tail = lfilter([0.15], [1, -0.85], tail)        # a cave rings low
    wet = np.zeros(len(signal) + n)
    wet[:len(signal) + n - 1] = fftconvolve(signal, tail)
    dry = np.concatenate([signal, np.zeros(n)])
    wet *= np.abs(dry).max() / (np.abs(wet).max() or 1)
    return (1 - amount) * dry + amount * wet


def howl(outline, echo=True):
    rng = np.random.default_rng(outline.get("seed", 1))
    times = np.arange(int(outline["seconds"] * RATE)) / RATE
    hz = track(outline["pitch"], times)
    wobble_hz, wobble_depth = outline.get("wobble", [5.5, 0.3])
    hz *= 2 ** (wobble_depth / 12 * np.sin(2 * np.pi * wobble_hz * times + rng.uniform(0, 6)))
    voice = pulses(hz, rng, 0.004)
    growl = outline.get("growl", 0)
    if growl:                                        # a rough under-voice at half the pitch, beating against the tone
        under = pulses(hz / 2 * (1 + 0.01 * np.sin(2 * np.pi * 23 * times)), rng, 0.02)
        rough = 1 + 0.6 * np.sin(2 * np.pi * 31 * times) * rng.uniform(0.6, 1, len(times))
        voice = voice + growl * under * rough
    voice = voice + outline.get("breath", 0) * rng.normal(0, 0.5, len(times))
    mouth = track(outline.get("vowel", [[0, 0.5]]), times)
    size = outline.get("size", 1)
    sound = np.zeros_like(voice)
    for n, gain in enumerate([1, 0.7, 0.35]):        # three resonances, between the "oo" and the "ah"
        centre = (VOWELS["oo"][n][0] + (VOWELS["ah"][n][0] - VOWELS["oo"][n][0]) * mouth) / size
        width = VOWELS["oo"][n][1] + (VOWELS["ah"][n][1] - VOWELS["oo"][n][1]) * mouth
        sound += gain * resonance(voice, centre, width)
    sound *= track(outline["loud"], times)
    if not echo:
        return sound / (np.abs(sound).max() or 1)
    seconds, amount = outline.get("cave", [1.5, 0.3])
    sound = cave(sound, seconds, amount, rng)
    fade = min(len(sound), int(0.05 * RATE))
    sound[-fade:] *= np.linspace(1, 0, fade)
    return 0.89 * sound / (np.abs(sound).max() or 1)


def chorus(outline):
    """Several voices mixed, each from its own second at its own loudness, then the one echo over them all."""
    voices = [(int(v.get("at", 0) * RATE), v.get("gain", 1), howl(v, echo=False)) for v in outline["voices"]]
    mixed = np.zeros(max(at + len(sound) for at, gain, sound in voices))
    for at, gain, sound in voices:
        mixed[at:at + len(sound)] += gain * sound
    seconds, amount = outline.get("cave", [1.5, 0.3])
    mixed = cave(mixed, seconds, amount, np.random.default_rng(outline.get("seed", 1)))
    fade = min(len(mixed), int(0.05 * RATE))
    mixed[-fade:] *= np.linspace(1, 0, fade)
    return 0.89 * mixed / (np.abs(mixed).max() or 1)


def main():
    outline = json.loads(open(sys.argv[1], encoding="utf-8").read())
    sound = chorus(outline) if "voices" in outline else howl(outline)
    wavfile.write(sys.argv[2], RATE, (sound * 32767).astype(np.int16))
    print(sys.argv[2], round(len(sound) / RATE, 2), "seconds")


if __name__ == "__main__":
    main()
