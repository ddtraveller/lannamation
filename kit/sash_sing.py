"""sash_sing.py - sing the words of sash.html over sash.wav, saved as sash_song.wav.

    python sash_music.py
    python sash_sing.py

As lanna_sing.py does for the lanna film, and with its voice: a Thai computer
voice says each syllable once, singer.py sings it on its note for nearly one
beat, and this file lays the syllables on the music. The lines are not written
here: they are the film's own list, CUES in sash.html, read out of the page in
Chrome, so the voice and the words under the picture cannot drift apart. Each
syllable takes the note the tune plucks on its beat (sash_music.tune_notes).
The voice alone is saved too, as sash_voice.wav, to listen to on its own.

The voice refuses some syllables on their own (ปลา, ยาม: "no audio was
received", every time, in any spelling tried). Asked for the syllable twice
over (ปลาๆ, said "pla pla"), it answers, and the first half is kept, cut at
the quietest moment of the middle. A syllable it refuses in every form is
respelled in the film's sung column (เย็น is sung as เยน), as lanna.html
spells สนุก as "สะ หนุก".

It needs what lanna_sing.py needs: the internet for the voice (edge-tts),
librosa, pyworld, and Google Chrome with playwright.
"""
import asyncio
import time
import wave
from pathlib import Path

import edge_tts
import librosa
import numpy

from lanna_sing import SPOKEN, VOICE, cues_of        # the voice, its cache of spoken syllables, and reading CUES from a page
from sash_music import BEAT, RATE, SILENCE, TUNE_NOTES, add, save, tune_notes
from singer import sing

FILM = "sash.html"
NOTES = tune_notes()                        # the tune's note on each beat of the music


def ask(text, file, attempts):
    """The voice saying "text", saved to file; True when it answered."""
    for attempt in range(attempts):
        if file.exists() and file.stat().st_size > 0:
            return True
        try:
            asyncio.run(edge_tts.Communicate(text, VOICE, rate="-20%").save(str(file)))
        except Exception:                            # the free voice service is often busy, and refuses some words
            file.unlink(missing_ok=True)
            time.sleep(3 + attempt * 2)
    return file.exists() and file.stat().st_size > 0


def spoken(syllable):
    """The voice saying one syllable, as a list of numbers: asked for on its
    own, or, if it refuses, twice over and cut to the first half."""
    SPOKEN.mkdir(exist_ok=True)
    file = SPOKEN / (syllable + ".mp3")
    if ask(syllable, file, 3):
        sound, _ = librosa.load(str(file), sr=RATE)
        sound, _ = librosa.effects.trim(sound, top_db=30)
        return sound
    twice = SPOKEN / (syllable + "ๆ.mp3")
    if not ask(syllable + "ๆ", twice, 3):
        raise SystemExit("the voice refused " + syllable + " on its own and twice over: respell it in the film's sung column")
    sound, _ = librosa.load(str(twice), sr=RATE)
    sound, _ = librosa.effects.trim(sound, top_db=30)
    loud = librosa.feature.rms(y=sound, frame_length=1024, hop_length=256)[0]
    middle = slice(int(len(loud) * 0.35), int(len(loud) * 0.65))
    cut = (int(numpy.argmin(loud[middle])) + middle.start) * 256
    print("  %s: the voice refused it alone; sung from %sๆ, its first %.2f s" % (syllable, syllable, cut / RATE))
    return sound[:cut]


def note_on(beat):
    """The frequency the tune is on at a beat of the film: the music begins
    after the film's silence, so a film beat is that many beats later."""
    music_beat = beat - round(SILENCE / BEAT)
    return TUNE_NOTES[NOTES[max(0, min(len(NOTES) - 1, music_beat))]]


def sung(syllable, frequency, before):
    """One syllable on its note, a little short of a beat so that each ends
    before the next; "before" is the note before it in the line, slid from."""
    return sing(spoken(syllable), frequency, BEAT * 0.95, glide_from=before)


def main():
    lines = cues_of(FILM)
    with wave.open("sash.wav", "rb") as file:
        band = numpy.frombuffer(file.readframes(file.getnframes()), numpy.int16) / 32767
    voice = numpy.zeros(len(band))
    count = 0
    for start, words in lines:
        for place, syllable in enumerate(words.split()):
            before = note_on(start + place - 1) if place else None
            add(voice, sung(syllable, note_on(start + place), before), (start + place) * BEAT)
            count += 1
    track = band * 0.55 + voice
    save(voice / max(1e-9, numpy.abs(voice).max()) * 0.85, "sash_voice.wav")
    save(track / numpy.abs(track).max() * 0.85, "sash_song.wav")
    print("sash_song.wav: %.1f seconds, %d syllables sung on %d lines; the voice alone is sash_voice.wav"
          % (len(track) / RATE, count, len(lines)))


if __name__ == "__main__":
    main()
