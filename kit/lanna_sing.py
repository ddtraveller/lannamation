"""lanna_sing.py - sing the Thai words over lanna.wav, saved as lanna_song.wav.

    python lanna_music.py
    python lanna_sing.py

No singer is recorded, and no music model is used. A Thai computer voice
says each syllable once. singer.py then sings each syllable on the note it
should be sung on, for nearly one beat, and this file lays it on the music.

The lines of the song are not written here. They are the film's own list,
CUES in lanna.html, which also moves the mouths and writes the words under
the picture: one list, so the voice and the picture cannot drift apart.

It needs the internet for the voice (edge-tts), librosa to read the voice's
sound, pyworld, which singer.py sings with, and Google Chrome with
playwright, to read the list out of the film's page.

Run it in the folder that holds lanna.html and lanna.wav (lanna_music.py writes it there). It writes
lanna_song.wav there (mono, 16-bit, 44.1 kHz) and keeps each syllable the voice said in spoken/, and ends
with exit code 0. When the voice service fails eight times for a syllable, librosa cannot read the missing
file and it stops with that exception.
"""
import asyncio
import time
import wave
from pathlib import Path

import edge_tts
import librosa
import numpy
from playwright.sync_api import sync_playwright

from lanna_music import BEAT, NOTES, RATE, TUNE, add, save
from singer import sing

VOICE = "th-TH-PremwadeeNeural"
SPOKEN = Path("spoken")      # each syllable is asked for once, and kept here
FILM = "lanna.html"          # the film keeps the lines of the song, in its list CUES


def cues_of(page_file):
    """The lines of the song, from the film's own list: for each line, the
    beat it begins on and its syllables. The film's page is opened in Chrome
    with no window, as render.py opens it, and asked for its CUES. Each
    syllable takes the note the tune plays on its beat, so the band and the
    voice always agree.

    page_file: the film's page. Gives back a list of (beat, "syllables split by spaces").
    e.g. cues_of("lanna.html")"""
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page()
        page.goto(Path(page_file).resolve().as_uri())
        cues = page.evaluate("CUES")
        browser.close()
    return [(cue[0], cue[1]) for cue in cues]


def note_on(beat):
    """the note the tune plays on a beat, or the last one before a rest

    beat: a beat of the tune, 0 the first. Gives back the note in hz (C when the tune begins with rests).
    e.g. note_on(12)"""
    letters = TUNE.replace(" ", "")
    while beat > 0 and letters[beat] == "-":
        beat -= 1
    return NOTES[letters[beat]] if letters[beat] != "-" else NOTES["C"]


async def ask(syllable, file):
    """Ask the free voice service (edge-tts, VOICE at -20%) to say one syllable into file, an MP3.

    A coroutine: run it with asyncio.run(). Fails with edge-tts's exception when the service is busy or away.
    e.g. asyncio.run(ask("บ้าน", SPOKEN / "บ้าน.mp3"))"""
    await edge_tts.Communicate(syllable, VOICE, rate="-20%").save(str(file))


def spoken(syllable):
    """The voice saying one syllable, as a list of numbers.

    syllable: Thai text. It asks the voice service once and keeps the answer in spoken/SYLLABLE.mp3, trying
    up to eight times while the service is busy. Gives back the samples at RATE, the silence at each end cut.
    e.g. spoken("บ้าน")"""
    SPOKEN.mkdir(exist_ok=True)
    file = SPOKEN / (syllable + ".mp3")
    for attempt in range(8):                     # the free voice service is often busy
        if file.exists() and file.stat().st_size > 0:
            break
        try:
            asyncio.run(ask(syllable, file))
        except Exception:
            file.unlink(missing_ok=True)
            time.sleep(3 + attempt * 2)
    sound, _ = librosa.load(str(file), sr=RATE)
    sound, _ = librosa.effects.trim(sound, top_db=30)
    return sound


def sung(syllable, frequency, before):
    """One syllable, sung on the note for nearly one beat: a little short of
    it, so that each syllable ends before the next begins. "before" is the
    note of the syllable before it in its line (None for a line's first):
    the voice slides from that note to this one.

    syllable: Thai text. frequency, before: in hz. Gives back the samples, BEAT * 0.95 seconds, peaking at 0.6.
    e.g. sung("บ้าน", note_on(9), note_on(8))"""
    return sing(spoken(syllable), frequency, BEAT * 0.95, glide_from=before)


def main():
    """The command line: read the CUES of lanna.html, sing each syllable over lanna.wav, save lanna_song.wav."""
    lines = cues_of(FILM)
    with wave.open("lanna.wav", "rb") as file:
        band = numpy.frombuffer(file.readframes(file.getnframes()), numpy.int16) / 32767
    track = band * 0.55
    count = 0
    for start, words in lines:
        for place, syllable in enumerate(words.split()):
            before = note_on(start + place - 1) if place else None
            add(track, sung(syllable, note_on(start + place), before), (start + place) * BEAT)
            count += 1
    track = track / numpy.abs(track).max() * 0.85
    save(track, "lanna_song.wav")
    print("lanna_song.wav: %.1f seconds, %d syllables sung on %d lines"
          % (len(track) / RATE, count, len(lines)))


if __name__ == "__main__":
    main()
