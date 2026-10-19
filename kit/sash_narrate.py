"""sash_narrate.py - tell the story of sash.html in Kam Mueang over sash.wav, saved as sash_voice.wav.

    python sash_music.py
    python sash_narrate.py --voice assistant --takes 4      # the Kam Mueang assistant's voice (since 2026-10-18)
    python sash_narrate.py <the Kam Mueang Voice extension's model folder> --takes 4    # or the extension's
    python render.py sash.html sash.mp4 --audio sash_voice.wav
    python sash_narrate.py --page maeng/film.html --music out/maeng_music/film.wav --spoken <folder> --out maeng.wav

The words are the film's own: the page is opened in Chrome with no window, as render.py opens it,
and asked for its WORDS: for each line, the seconds it shows, what the voice says and what is
written. Each line is spoken by the voice of the Kam Mueang Voice extension (say.mjs: Meta's MMS
Northern Thai, run by transformers.js as the extension runs it) once, and kept in spoken_km/ under a
name made from its words, so a line is spoken again only when its words change. With --voice assistant
the same model speaks as the Kam Mueang assistant speaks it (owner, 2026-10-18: "use the new assistant
voice"): in PyTorch (transformers' VitsModel, facebook/mms-tts-nod, its own settings), the line in pieces
of up to 150 letters with a quarter of a second between them; its takes are kept in spoken_km_assistant/.
The assistant also respells its answers by its speaker's rules: those are in the film's words themselves
(WORDS in sash.html), not here. Either voice draws its
timing from noise, and the same line is never quite the same twice. With --takes N each new line is
spoken N times and the take a speech recogniser (faster-whisper, medium, Thai) hears closest to the
words is kept: the takes differ, and one can be much clearer than another (four takes of one line
scored 0.57 to 0.72 of its letters heard back, the first take 0.47). Delete spoken_km/ to speak every
line again. Each line starts at its second.
The music is lowered while the voice speaks and comes back between lines, and fades over the film's
last two seconds. Then it says, line by line, how long the voice took and whether the line is over
before its words leave the screen.
With --spoken the lines were spoken already, elsewhere, one file a line: the page's WORDS give each line its id
as a sixth item (or, with no ids, 01.wav, 02.wav ... in order), and the folder has ID.wav for each (the film of the creature with four ears and five eyes:
Pan's voice, from her toolset's voice service, each line heard back by the voice project's listener first).

The voice's treatment and the mix (2026-10-16; the owner asked for a better-quality sound for the film,
and said "it's good" of this one). The voice speaks at 16 kHz, so it had nothing above 8 kHz, and the old
mix was mono at -17.5 LUFS. Now each line is resampled to 44.1 kHz (soxr), goes through VOICE_CHAIN (ffmpeg:
the mud at 260 Hz taken down, presence at 3.2 kHz lifted, harmonics above the voice's 8 kHz edge from
aexciter, gentle compression) and a touch of sash_music.py's room; the voice stays in the middle of the
stereo music; the whole is brought to -14 LUFS with true peaks under -1 dBTP (ffmpeg loudnorm, measured
first, then applied linearly) and written 24-bit stereo. Needs soundfile, soxr and ffmpeg besides.

The model folder is model/ in the extension (krueng.ai/downloads/kammuang_voice_chrome.zip,
unzipped); say.mjs needs "npm install" in this folder first.
"""
import argparse
import difflib
import hashlib
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy
import soundfile
import soxr
from playwright.sync_api import sync_playwright
from scipy.signal import fftconvolve

from sash_music import room

RATE = 44100
HERE = Path(__file__).resolve().parent
SPOKEN = HERE / "spoken_km"           # the extension's takes; the assistant's go to spoken_km_assistant (main())
ASSISTANT_VOICE = "facebook/mms-tts-nod"
MUSIC = 0.7          # the music between lines, of the level sash_music.py made it
UNDER = 0.3          # the music while the voice speaks, of that
RAMP = 0.35          # seconds the music takes to go down before a line and to come back after it
VOICE = 0.9          # the voice's peak
FADE = 2.0           # seconds of the music's fade at the end


def words_of(page_file, sets=()):
    """The film's lines and its length, asked of the page itself; given the values render.py --set gave it."""
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page()
        page.goto(Path(page_file).resolve().as_uri())
        for name, value in sets:
            page.evaluate("([name, value]) => { window[name] = value; }", [name, value])
        words, seconds = page.evaluate("[WORDS, typeof LENGTH !== 'undefined' ? LENGTH : DURATION]")
        browser.close()
    return words, seconds


VOICE_CHAIN = ("highpass=f=75,equalizer=f=260:t=q:w=1:g=-2.5,equalizer=f=3200:t=q:w=1.2:g=3,"
               "aexciter=amount=2:drive=6:blend=0:freq=6000:ceil=16000,"
               "acompressor=threshold=0.125:ratio=3:attack=5:release=80:makeup=1")


def voice_line(path, scratch):
    """One spoken line at 44.1 kHz, through VOICE_CHAIN, with a touch of the room, peaking at VOICE."""
    sound, rate = soundfile.read(str(path), dtype="float64", always_2d=True)
    sound = soxr.resample(sound[:, 0], rate, RATE, quality="VHQ")
    raw, done = Path(scratch) / "line.wav", Path(scratch) / "line_chain.wav"
    soundfile.write(str(raw), sound, RATE, subtype="FLOAT")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", VOICE_CHAIN, "-c:a", "pcm_f32le",
                    str(done)], check=True)
    sound, _ = soundfile.read(str(done), dtype="float64")
    sound = sound + 0.08 * fftconvolve(sound, room(0.6, seed=9)[0])[:len(sound)]
    return sound / numpy.abs(sound).max() * VOICE


def master(track, out, scratch):
    """-14 LUFS integrated, true peaks under -1 dBTP: ffmpeg loudnorm, measured first, then applied linearly."""
    raw = Path(scratch) / "mix.wav"
    soundfile.write(str(raw), track.T, RATE, subtype="FLOAT")
    want = "I=-14:TP=-1.0:LRA=11"
    probe = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(raw), "-af", f"loudnorm={want}:print_format=json",
                            "-f", "null", "-"], capture_output=True, text=True).stderr
    m = json.loads(probe[probe.rindex("{"):probe.rindex("}") + 1])
    applied = (f"loudnorm={want}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
               f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", applied, "-ar", str(RATE),
                    "-c:a", "pcm_s24le", str(out)], check=True)


def file_of(text):
    return SPOKEN / (hashlib.sha1(text.encode("utf-8")).hexdigest()[:12] + ".wav")


def heard(text, sound_file, listener):
    """how much of a line's letters the recogniser hears back, 0 to 1"""
    said = "".join(part.text for part in listener.transcribe(str(sound_file), language="th", beam_size=5)[0])
    return difflib.SequenceMatcher(None, re.sub(r"[\sๆ]", "", text), re.sub(r"[\sๆ]", "", said)).ratio()


def say_as_assistant(jobs):
    """Each [name, text] spoken as the Kam Mueang assistant speaks (its server.py, speak()): MMS Northern Thai in
    PyTorch, the text in pieces of up to 150 letters, a quarter of a second of silence between them; to SPOKEN/name.wav."""
    import torch
    from transformers import AutoTokenizer, VitsModel
    tokenizer, voice = AutoTokenizer.from_pretrained(ASSISTANT_VOICE), VitsModel.from_pretrained(ASSISTANT_VOICE).eval()
    rate = voice.config.sampling_rate
    for name, text in jobs:
        pieces, piece = [], ""
        for word in re.split(r"(?<=[\s.!?])", text):
            if len(piece) + len(word) > 150 and piece.strip():
                pieces.append(piece.strip())
                piece = ""
            piece += word
        if piece.strip():
            pieces.append(piece.strip())
        out = []
        for p in pieces:
            ids = tokenizer(p, return_tensors="pt")
            if ids["input_ids"].shape[1] < 2:
                continue
            if out:                                 # a quarter of a second between pieces (none after the last: the film times its lines)
                out.append(numpy.zeros(int(0.25 * rate), dtype=numpy.float32))
            with torch.no_grad():
                out.append(voice(**ids).waveform[0].float().numpy())
        soundfile.write(str(SPOKEN / (name + ".wav")), numpy.concatenate(out), rate, subtype="PCM_16")


def say(jobs, model):
    """[name, text] jobs, each spoken to SPOKEN/name.wav: by say.mjs in one run, or the assistant's way."""
    if model == "assistant":
        say_as_assistant(jobs)
    else:
        listing = SPOKEN / "to_say.json"
        listing.write_text(json.dumps(jobs, ensure_ascii=False), encoding="utf-8")
        subprocess.run(["node", str(HERE / "say.mjs"), model, str(listing), str(SPOKEN)], check=True)
        listing.unlink()


def line_id(line, n):
    """A line's name for --spoken: its id, WORDS' sixth item, or for a page whose WORDS have none its number, 01 on."""
    return line[5] if len(line) > 5 else "%02d" % (n + 1)


def seconds_of(sound_file):
    info = soundfile.info(str(sound_file))
    return info.frames / info.samplerate


def speak(lines, model, takes, fit=False):
    """Every line not spoken yet, "takes" times; the clearest take is kept. lines: [text, room], room the seconds
    from its start until its words leave the screen or the next line begins. With fit, the clearest take that
    ends inside its room is kept; if none of them does, as many takes again are spoken, once, and the choice
    made again (the voice's timing is drawn from noise: one take can be half a second shorter than another)."""
    room = dict(lines)
    missing = [text for text, _ in lines if not file_of(text).exists()]
    if not missing:
        return
    SPOKEN.mkdir(exist_ok=True)
    say([[file_of(text).stem + "_%d" % k, text] for text in missing for k in range(takes)], model)
    listener = None
    if takes > 1:
        from faster_whisper import WhisperModel
        listener = WhisperModel("medium", device="cpu", compute_type="int8")
    for text in missing:
        count = takes
        files = [SPOKEN / (file_of(text).stem + "_%d.wav" % k) for k in range(count)]
        if fit and not any(seconds_of(one) <= room[text] for one in files):
            say([[file_of(text).stem + "_%d" % k, text] for k in range(count, 2 * count)], model)
            files += [SPOKEN / (file_of(text).stem + "_%d.wav" % k) for k in range(count, 2 * count)]
        scores = [heard(text, one, listener) for one in files] if listener else [0] * len(files)
        fitting = [k for k, one in enumerate(files) if seconds_of(one) <= room[text]] if fit else []
        best = max(fitting or range(len(files)), key=lambda k: scores[k])
        files[best].rename(file_of(text))
        for one in files:
            one.unlink(missing_ok=True)
        if listener:
            print("%s  takes heard %s: kept %.2f, %.2f s%s" % (text, " ".join("%.2f" % s for s in scores), scores[best],
                                                        seconds_of(file_of(text)),
                                                        "" if not fit else " (fits %.2f)" % room[text] if fitting else " (NONE fits %.2f)" % room[text]))


def main():
    global SPOKEN
    parser = argparse.ArgumentParser()
    parser.add_argument("model", nargs="?", help="the extension's model folder (or --voice assistant)")
    parser.add_argument("--voice", choices=["extension", "assistant"], default="extension",
                        help="assistant: the Kam Mueang assistant's voice, which needs no model folder")
    parser.add_argument("--page", default=str(HERE / "sash.html"))
    parser.add_argument("--music", default=str(HERE / "sash.wav"))
    parser.add_argument("--out", default=str(HERE / "sash_voice.wav"))
    parser.add_argument("--takes", type=int, default=1, help="takes of each new line; the clearest is kept")
    parser.add_argument("--spoken", help="a folder of lines spoken already, ID.wav for each line's id (WORDS' sixth item)")
    parser.add_argument("--set", action="append", default=[], metavar="NAME=VALUE",
                        help="as render.py --set: the values the page was rendered with (JSON, or @file.json)")
    parser.add_argument("--fit", action="store_true",
                        help="keep the clearest take that ends before its words leave the screen and the next line begins")
    args = parser.parse_args()
    if args.voice == "assistant":
        SPOKEN = HERE / "spoken_km_assistant"
    elif not args.model and not args.spoken:
        parser.error("give the extension's model folder, or --voice assistant")

    sets = []
    for one in args.set:
        name, _, value = one.partition("=")
        sets.append((name, json.loads(Path(value[1:]).read_text(encoding="utf-8") if value.startswith("@") else value)))
    words, seconds = words_of(args.page, sets)
    rooms = [min(w[1], words[n + 1][0] if n + 1 < len(words) else seconds) - w[0] - 0.05 for n, w in enumerate(words)]
    if args.spoken:
        missing = [line_id(w, n) for n, w in enumerate(words) if not (Path(args.spoken) / (line_id(w, n) + ".wav")).exists()]
        if missing:
            raise SystemExit("no voice file for " + ", ".join(missing))
    else:
        speak([[w[2], room] for w, room in zip(words, rooms)], "assistant" if args.voice == "assistant" else args.model,
              args.takes, args.fit)
    length = int(seconds * RATE)
    music, _ = soundfile.read(args.music, dtype="float64", always_2d=True)  # sash_music.py's two rows
    music = music.T
    music = numpy.pad(music, ((0, 0), (0, max(0, length - music.shape[1]))))[:, :length] * MUSIC
    voice = numpy.zeros(length)
    gain = numpy.ones(length)
    clock = numpy.arange(length) / RATE
    scratch = tempfile.TemporaryDirectory()
    print("line   from    voice  ends   shown to")
    for n, line in enumerate(words):
        start, shown, said = line[:3]
        sound = voice_line(Path(args.spoken) / (line_id(line, n) + ".wav") if args.spoken else file_of(said), scratch.name)
        at = int(start * RATE)
        voice[at:at + len(sound)] += sound[:max(0, length - at)]
        end = start + len(sound) / RATE
        # down to UNDER from RAMP before the line, back up over RAMP after it
        dip = numpy.clip(numpy.minimum((clock - (start - RAMP)) / RAMP, ((end + RAMP) - clock) / RAMP), 0, 1)
        gain = numpy.minimum(gain, 1 - (1 - UNDER) * dip)
        after = words[n + 1][0] if n + 1 < len(words) else seconds
        late = end - min(shown, after)
        print("%3d  %6.1f  %5.2f  %5.1f  %5.1f   %s" % (n + 1, start, len(sound) / RATE, end, shown,
                                                     "fits" if late <= 0 else "TOO LONG by %.2f s" % late))
    gain[-int(FADE * RATE):] *= numpy.linspace(1, 0, int(FADE * RATE))
    track = music * gain + voice  # the voice in the middle of both ears
    master(track, args.out, scratch.name)
    scratch.cleanup()
    print("%s: %.1f s, %d lines, -14 LUFS, stereo" % (Path(args.out).name, seconds, len(words)))


if __name__ == "__main__":
    main()
