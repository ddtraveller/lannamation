"""sing_check.py - hear the song's old voice and singer.py's, line by line.

    python sing_check.py                       # the lanna song, voices heard by the medium model
    python sing_check.py --model large-v3      # a better listener, slower
    python sing_check.py --out ../../../scratch   # where the sound files go (default: sing_check_out/)

For every line of lanna_sing.py it sings the syllables twice - the old way
(librosa, as lanna_sing.sung does) and the new way (singer.sing, WORLD) -
lays both voices on their own, and both over the band, and then:
  - hears each line of each voice with faster-whisper (Thai), and prints the
    words written beside the words heard, with the share of characters wrong
    (the listener is part of the measurement: Whisper's Thai is imperfect, so
    read the side by side, and trust a difference more than a number);
  - measures the pitch of every sung syllable against its note, in cents.
It writes the four sound files, so the owner can listen as well.

It needs what lanna_sing.py needs, and faster-whisper. Run it in the folder that holds lanna.wav. It
writes voice_old.wav, voice_new.wav, song_old.wav and song_new.wav into --out, and what it printed into
sing_check_output.txt in the folder it is run from. The song's lines are the film's own, lanna.html's CUES,
read as lanna_sing.py reads them (lanna_sing.cues_of: Chrome with no window); it read a list lanna_sing.py no
longer has, and stopped, until 2026-10-21.
"""
import argparse
import time
from pathlib import Path

import librosa
import numpy

import lanna_sing
import singer
from lanna_music import BEAT, RATE, add, save


def sung_old(syllable, frequency):
    """The old tuning, kept here as the "before": librosa's pitch_shift to the
    note and time_stretch to the beat, as lanna_sing.sung did until the song
    switched to singer.sing (2026-10-12).

    syllable: Thai text. frequency: the note, in hz. Gives back the samples, BEAT * 0.95 seconds, peaking at 0.6.
    e.g. sung_old("บ้าน", 293.66)"""
    sound = lanna_sing.spoken(syllable)
    pitches, _, _ = librosa.pyin(sound, fmin=90, fmax=500, sr=RATE)
    heard = pitches[~numpy.isnan(pitches)]
    said_at = numpy.median(heard) if len(heard) else 220.0
    steps = 12 * numpy.log2(frequency / said_at)
    sound = librosa.effects.pitch_shift(sound, sr=RATE, n_steps=float(steps))
    want = int(BEAT * 0.95 * RATE)
    sound = librosa.effects.time_stretch(sound, rate=len(sound) / want)[:want]
    edge = int(0.03 * RATE)
    sound[:edge] *= numpy.linspace(0, 1, edge)
    sound[-edge:] *= numpy.linspace(1, 0, edge)
    return sound / (numpy.abs(sound).max() or 1) * 0.6


def character_error(written, heard):
    """The share of the written characters that are wrong in what was heard.

    written, heard: Thai text (spaces left out). Gives back 0 (all right) and up; 0.0 when nothing is written.
    e.g. character_error("ไป เที่ยว", "ไปเทียว")"""
    a, b = written.replace(" ", ""), heard.replace(" ", "")
    if not a:
        return 0.0
    before = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        now = [i]
        for j, y in enumerate(b, 1):
            now.append(min(before[j] + 1, now[j - 1] + 1, before[j - 1] + (x != y)))
        before = now
    return before[-1] / len(a)


def cents_off(sound, frequency):
    """How far the sung pitch is from the note, in cents, by its median.

    sound: samples at RATE. frequency: the note, in hz. Gives back cents (100 a semitone), or nan when no
    pitch is heard. e.g. cents_off(sound, 293.66)"""
    pitches, _, _ = librosa.pyin(sound, fmin=90, fmax=500, sr=RATE)
    heard = pitches[~numpy.isnan(pitches)]
    if not len(heard):
        return float("nan")
    return 1200 * numpy.log2(numpy.median(heard) / frequency)


def build(method, length, lines):
    """The voice alone, as long as the band, and the cents off for each
    syllable: method is "old" or "new".

    length: the band's length in samples. lines: the song's lines, (beat, syllables) each (lanna_sing.cues_of).
    Gives back (voice, offs): the samples, and a numpy array of cents.
    e.g. voice, offs = build("new", len(band), lanna_sing.cues_of(lanna_sing.FILM))"""
    voice = numpy.zeros(length)
    offs = []
    for start, words in lines:
        syllables = words.split()
        for place, syllable in enumerate(syllables):
            note = lanna_sing.note_on(start + place)
            if method == "old":
                sound = sung_old(syllable, note)
            else:                                         # slid from the note before; every syllable let go with its fall
                before = lanna_sing.note_on(start + place - 1) if place else None
                sound = singer.sing(lanna_sing.spoken(syllable), note, BEAT * 0.95, glide_from=before)
            offs.append(cents_off(sound, note))
            add(voice, sound, (start + place) * BEAT)
    return voice, numpy.array(offs)


def hear(model, sound, start, stop):
    """What the listener hears in one stretch of a sound: the Thai text it writes down.

    model: a faster-whisper WhisperModel. sound: samples at RATE. start, stop: the stretch, in seconds.
    e.g. hear(model, voices["new"], 3.85, 8.4)"""
    piece = sound[int(start * RATE):int(stop * RATE)]
    piece = librosa.resample(piece, orig_sr=RATE, target_sr=16000).astype(numpy.float32)
    segments, _ = model.transcribe(piece, language="th", beam_size=5, vad_filter=False)
    return "".join(segment.text for segment in segments).strip()


SAID = []                    # every line printed, for sing_check_output.txt


def say(line):
    """Print line and keep it in SAID, for sing_check_output.txt. Gives back nothing.

    e.g. say("old voice: 40 syllables")"""
    print(line)
    SAID.append(line)


def main():
    """The command line: make --out, run the check, and write sing_check_output.txt even when it fails."""
    import sys
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")   # Thai on a Windows console
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="medium")
    parser.add_argument("--out", default="sing_check_out")
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(exist_ok=True)
    try:
        run(args, out)
    finally:                                                      # what was printed, kept beside the song as the page's other steps keep theirs
        Path("sing_check_output.txt").write_text("\n".join(SAID) + "\n", encoding="utf-8")


def run(args, out):
    """Build both voices, save the four sound files into out, then hear each line of each and print the share wrong.

    args: the parsed arguments (args.model names the listener). out: the folder, a Path. Gives back nothing."""
    import wave
    with wave.open("lanna.wav", "rb") as file:
        band = numpy.frombuffer(file.readframes(file.getnframes()), numpy.int16) / 32767
    lines = lanna_sing.cues_of(lanna_sing.FILM)                  # the film's own lines, as lanna_sing.py sings them
    voices = {}
    for method in ("old", "new"):
        started = time.time()
        voice, offs = build(method, len(band), lines)
        voices[method] = voice
        save(voice / (numpy.abs(voice).max() or 1) * 0.85, str(out / ("voice_%s.wav" % method)))
        track = band * 0.55 + voice
        save(track / numpy.abs(track).max() * 0.85, str(out / ("song_%s.wav" % method)))
        say("%s voice: %d syllables, pitch off by %.0f cents on average (worst %.0f), built in %.0f s"
              % (method, len(offs), numpy.nanmean(numpy.abs(offs)), numpy.nanmax(numpy.abs(offs)), time.time() - started))
    from faster_whisper import WhisperModel
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    totals = {"old": [], "new": []}
    say("\nline by line: written / heard old / heard new")
    for start, words in lines:
        first, last = start * BEAT - 0.15, (start + len(words.split())) * BEAT + 0.4
        say("  " + words)
        for method in ("old", "new"):
            heard = hear(model, voices[method], first, last)
            wrong = character_error(words, heard)
            totals[method].append(wrong)
            say("    %s: %-40s %3.0f%% wrong" % (method, heard or "(nothing)", 100 * wrong))
    say("\ncharacters wrong over all lines: old %.0f%%, new %.0f%% (listener: %s)"
          % (100 * numpy.mean(totals["old"]), 100 * numpy.mean(totals["new"]), args.model))
    say("sound files in %s: voice_old.wav, voice_new.wav, song_old.wav, song_new.wav" % out)


if __name__ == "__main__":
    main()
