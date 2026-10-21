"""village_sing.py - sing the Thai words over village.wav, saved as village_song.wav.

    python band_music.py village
    python village_sing.py

No singer is recorded, and no music model is used. A Thai computer voice
says each syllable once. This file then tunes each syllable to the note it
should be sung on, makes it one beat long, and lays it on the music.

It needs the internet for the voice (edge-tts), and librosa to tune it.
"""
import asyncio
import time
import wave
from pathlib import Path

import edge_tts
import librosa
import numpy

from band_music import BEAT, NOTES, RATE, add, save

VOICE = "th-TH-PremwadeeNeural"
SPOKEN = Path("spoken")      # each syllable is asked for once, and kept here
# Where each line begins (in beats), its syllables, and the note for each.
# The notes are the tune of band_music.py's village: the band and the voice agree.
LINES = [
    (8, "ไก่ ขัน แล้ว ตะ วัน ขึ้น ฟ้า", "E G A G E D C"),
    (18, "ตี กลอง ยาว เดิน ไป วัด", "G G A c A G"),
    (26, "ตี กลอง ยาว เดิน ไป วัด", "G G A c A G"),
    (38, "ตำ ที ละ ที ยา สะ หมุน ไพร", "C D E G A G E D"),
    (46, "เสร็จ แล้ว เสร็จ แล้ว", "c A c A"),
    (50, "เสร็จ แล้ว เสร็จ แล้ว", "A G E C"),
    (58, "โคม ลอย ขึ้น ฟ้า", "E G A c"),
    (62, "รา ตรี สะ หวัด", "c A G E"),
]


async def ask(syllable, file):
    await edge_tts.Communicate(syllable, VOICE, rate="-20%").save(str(file))


def spoken(syllable):
    """The voice saying one syllable, as a list of numbers."""
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


def sung(syllable, frequency):
    """One syllable, moved to the note and made one beat long."""
    sound = spoken(syllable)
    pitches, _, _ = librosa.pyin(sound, fmin=90, fmax=500, sr=RATE)
    heard = pitches[~numpy.isnan(pitches)]
    said_at = numpy.median(heard) if len(heard) else 220.0   # the pitch the voice spoke at
    steps = 12 * numpy.log2(frequency / said_at)
    sound = librosa.effects.pitch_shift(sound, sr=RATE, n_steps=float(steps))
    want = int(BEAT * 0.95 * RATE)
    sound = librosa.effects.time_stretch(sound, rate=len(sound) / want)[:want]
    edge = int(0.03 * RATE)                      # soften the two ends
    sound[:edge] *= numpy.linspace(0, 1, edge)
    sound[-edge:] *= numpy.linspace(1, 0, edge)
    return sound / (numpy.abs(sound).max() or 1) * 0.6


def main():
    with wave.open("village.wav", "rb") as file:
        band = numpy.frombuffer(file.readframes(file.getnframes()), numpy.int16) / 32767
    track = band * 0.55
    count = 0
    for start, words, notes in LINES:
        for place, (syllable, note) in enumerate(zip(words.split(), notes.split())):
            add(track, sung(syllable, NOTES[note]), (start + place) * BEAT)
            count += 1
    track = track / numpy.abs(track).max() * 0.85
    save(track, "village_song.wav")
    print("village_song.wav: %.1f seconds, %d syllables sung on %d lines"
          % (len(track) / RATE, count, len(LINES)))


if __name__ == "__main__":
    main()
