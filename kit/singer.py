"""singer.py - a better singing voice for the songs: a spoken syllable taken
apart with the WORLD vocoder and put together again on the note.

    from singer import sing
    sound = sing(spoken("บ้าน"), 293.66, 0.475)      # one syllable, on G, one beat long

village_sing.py tunes a spoken syllable with librosa's pitch_shift and
time_stretch, as lanna_sing.py did until it took this file (2026-10-12).
Both have a cost: pitch_shift moves the
formants with the pitch, so a voice raised ten semitones sounds like a small
creature, and time_stretch stretches the consonant as much as the vowel, so
the start of every word smears. WORLD (Morise 2016; pyworld) splits a voice
into three things - the pitch (f0), the shape of the mouth (the spectral
envelope) and the breath in it (aperiodicity) - and puts them back together
with any pitch at all, and the mouth's shape kept. So this file:
  1. keeps the consonant at its own speed, and stretches only the vowel to
     fill the beat (the voiced frames, less the first 40 ms and the last 30);
  2. sings the vowel on the note, with a share of the syllable's own tone
     kept (Thai tones rise and fall; a singer bends toward them: "tone" is
     how much, 0 for a flat note), the way the old Thai recordings sing:
     the note is held nearly straight, with a vibrato of an eighth of a
     semitone at 6 Hz that grows in after 120 ms; a new note is reached by
     a slide from the note before it over the first 90 ms ("glide_from", the
     last note's frequency; without it, a scoop from a semitone below over
     45 ms); and every syllable is let go with a fall of a whole semitone
     over its last 120 ms ("release", the default; false gives half a
     semitone over 40 ms);
  3. fades the two ends shortly (8 ms in, 35 ms out), so the words are not
     clipped and the beats do not click.
The numbers in 2 were read from three public recordings of Thai singing
(a royal anthem sung in 1907 and in the 1950s, an Uttaradit folk song):
their sustained notes wobble 0.09 to 0.16 semitones at 5 to 7 Hz, their
notes are joined by slides of up to seven semitones over most of a second,
and their phrase ends fall. The result is still the computer voice, only
sung; sing_check.py hears the old voice and this one with a recogniser and
measures the pitch of both.
"""
import numpy
import pyworld

RATE = 44100                 # samples in one second, as the songs use
FRAME = 5.0                  # milliseconds between WORLD's frames
ONSET = 8                    # frames (40 ms) of the voice's start that keep their own speed
RELEASE = 6                  # frames (30 ms) of its end that keep theirs


def analyse(sound):
    """A syllable as WORLD hears it: the pitch of each frame (0 where there is
    none), the mouth's shape and the breath."""
    x = numpy.ascontiguousarray(sound, dtype=numpy.float64)
    f0, t = pyworld.harvest(x, RATE, f0_floor=90.0, f0_ceil=500.0, frame_period=FRAME)
    f0 = pyworld.stonemask(x, f0, t, RATE)
    return f0, pyworld.cheaptrick(x, f0, t, RATE), pyworld.d4c(x, f0, t, RATE)


def between(frames, positions):
    """Frames read at fractional positions, each a mix of the two it lies between."""
    low = numpy.floor(positions).astype(int)
    high = numpy.minimum(low + 1, len(frames) - 1)
    weight = (positions - low)[:, None]
    return frames[low] * (1 - weight) + frames[high] * weight


def sing(sound, frequency, seconds, tone=0.3, vibrato=0.12, glide_from=None, release=True, vibrato_hz=6.0):
    """One spoken syllable sung on "frequency" (Hz) for "seconds", as a list of
    numbers at RATE, its peak at 0.6. "tone" is the share of the syllable's
    own rise or fall that is kept (0 to 1); "vibrato" its depth in semitones
    and "vibrato_hz" its rate; "glide_from" the frequency of the note before,
    slid from; "release" true (the default) lets every syllable go with a fall
    of a semitone over its last 120 ms, false with half a semitone over 40 ms.
    The film's voice, chosen by the owner on 2026-10-12, is the defaults with
    glide_from; the first candidate they heard was vibrato=0.25 at 5.5 Hz
    with no glide_from. (Until that day a local variable shadowed "release",
    so every syllable fell whatever the caller asked: that is the sound the
    owner chose, and so it is now what the default says.)"""
    f0, sp, ap = analyse(sound)
    count = len(f0)
    voiced = numpy.where(f0 > 0)[0]
    want = max(4, int(round(seconds * 1000 / FRAME)))
    if len(voiced) < 4:                                   # no voice to sing: just make it the right length
        positions = numpy.linspace(0, count - 1, want)
        onset_at = 0
    else:
        start, stop = voiced[0], voiced[-1]
        onset = min(count - 1, start + ONSET)             # the consonant, and the voice's first 40 ms
        release_at = max(onset + 1, stop - RELEASE + 1)   # the voice's last 30 ms, and what follows
        middle = want - onset - (count - release_at)
        if middle < 2:                                    # a beat too short for the consonants alone: all of it, scaled
            positions = numpy.linspace(0, count - 1, want)
        else:
            positions = numpy.concatenate([numpy.arange(onset), numpy.linspace(onset, release_at - 1, middle), numpy.arange(release_at, count)])
        onset_at = start
    sp2 = numpy.exp(between(numpy.log(sp), positions))
    ap2 = numpy.clip(between(ap, positions), 0, 1)
    source = f0[numpy.round(positions).astype(int)]
    voiced2 = source > 0
    # the pitch: the note, bent a little by the syllable's own tone, landed
    # on with a scoop, given a vibrato, and let go of at the end
    spoken_at = numpy.median(f0[f0 > 0]) if len(voiced) else frequency
    own = numpy.where(source > 0, 12 * numpy.log2(numpy.maximum(source, 1) / spoken_at), 0)
    semitones = numpy.clip(own, -1.5, 1.5) * tone
    time = numpy.arange(want) * FRAME / 1000
    since = numpy.maximum(0, time - onset_at * FRAME / 1000)   # seconds since the voice began
    if glide_from:                                        # slid into from the note before, as the recordings join their notes
        away = numpy.clip(12 * numpy.log2(glide_from / frequency), -7, 7)
        semitones = semitones + away * numpy.exp(-since / 0.09)
    else:                                                 # or landed on with a scoop from a semitone below
        semitones = semitones - 1.0 * numpy.exp(-since / 0.045)
    grow = numpy.clip((since - 0.12) / 0.15, 0, 1)
    semitones = semitones + vibrato * grow * numpy.sin(2 * numpy.pi * vibrato_hz * since)
    if release:                                           # the end of a phrase falls as it is let go
        end = numpy.clip((time - (seconds - 0.12)) / 0.12, 0, 1)
        semitones = semitones - 1.0 * end * end
    else:
        end = numpy.clip((time - (seconds - 0.04)) / 0.04, 0, 1)
        semitones = semitones - 0.5 * end
    f02 = numpy.where(voiced2, frequency * numpy.power(2, semitones / 12), 0.0)
    sung = pyworld.synthesize(f02, sp2, ap2, RATE, FRAME)
    length = int(seconds * RATE)
    sung = sung[:length] if len(sung) >= length else numpy.pad(sung, (0, length - len(sung)))
    sung[:int(0.008 * RATE)] *= numpy.linspace(0, 1, int(0.008 * RATE))
    sung[-int(0.035 * RATE):] *= numpy.linspace(1, 0, int(0.035 * RATE))
    return sung / (numpy.abs(sung).max() or 1) * 0.6
