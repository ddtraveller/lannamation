"""render.py - turn a page that has draw(t) into a video file.

    python render.py hello.html hello.mp4
    python render.py lanterns.html lanterns.mp4 --audio lanterns.wav
    python render.py lanna.html scene.mp4 --from 12 --to 20     # only seconds 12 to 20

It opens the page in Chrome with no window, asks for one frame at a time,
takes a picture of each, and hands the pictures to ffmpeg. Then it says
what the page said: an error, or a warning from the kit (a name it does
not know, which changes nothing).

Before the first picture it draws the film's frames once more with no pictures (the kit's vanished(),
oldcartoon.js; seconds, not the minutes the pictures take) and tells anything that blinked out: drawn in
one frame and gone in the next, while it could be seen, not gone off the edge, faded, shrunk away or
taken by a fade to black. It tells them again at the end, and makes the video all the same: stop it and
mend the scene. --no-vanish leaves the look out.

In the same look it listens: a sound the picture makes (a rooster's crow, the kit's heard()) is laid under
the film at its second, over the --audio sound or alone, from sounds.py's out/sounds/NAME.wav (made by
sounds.py when it is not there yet; told and left out when it cannot be). A fetched sound's maker and
licence are in sounds.py (FETCHED): a CC BY one is named in the film's credits.

It needs Google Chrome (Playwright drives it: channel "chrome") and ffmpeg on the PATH. The page must
have draw(t), the switch rendering, and LENGTH or DURATION (the film's seconds), as every kit page does.
It writes the video where it is named, 1920 x 1080 at 30 frames a second (H.264; AAC sound with --audio),
and prints how many frames it made and how long that took. It ends with exit code 0; 1 when the page
reported an error (the video is made all the same) or when ffmpeg stopped (no video); 2 for arguments
argparse does not take. From Python: render.render(page, video, audio, start, end, fast, sets, vanish).
"""
import argparse
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

FPS = 30
FONTS = "Promise.all(Array.from(document.fonts).map(function (f) { return f.load().catch(function () { return null; }); }))"   # checks/frames.py waits for them the same way
WIDTH = 1920
HEIGHT = 1080
SOUNDS = Path(__file__).resolve().parent / "out" / "sounds"   # sounds.py's, NAME.wav


def ffmpeg_command(video, audio, start=0, fast=False, sounds=()):
    """The ffmpeg command that reads frames on its stdin and encodes them as render.py does: a list of words.

    video: the file to write. audio: a sound file to lay under the pictures, or None for none.
    start: the second of the sound the first frame stands at (for a part of a film; default 0).
    fast: True for the encoder's usual settings (quicker, softer); False (the default) for clean ink lines.
    sounds: [(second, file, loudness), ...]: sounds laid in at those seconds of the video, over the sound
    file or over silence (the picture's own: heard()); one before the video's start loses that much of its head.
    Changes nothing; chain.py takes its picture settings from it as well.
    e.g. ffmpeg_command("hello.mp4", None, sounds=[(1.5, "out/sounds/rooster-crow.wav", 0.28)])"""
    # ffmpeg reads the pictures from this program, one after another
    command = ["ffmpeg", "-y", "-loglevel", "error",
               "-f", "image2pipe", "-framerate", str(FPS), "-i", "-"]
    if sounds:
        # the sound under the pictures (or silence), and each of the picture's own laid in at its second, as loud as
        # it is called: mixed as they are, not each turned down by how many there are (normalize=0)
        command += ["-ss", "%.3f" % start, "-i", audio] if audio else ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"]
        steps, ins = ["[1:a]aformat=sample_rates=44100:channel_layouts=stereo[under]"], ["[under]"]
        for n, (at, file, loud) in enumerate(sounds):
            command += ["-i", str(file)]
            late, head = max(0, round(at * 1000)), max(0.0, -at)
            steps.append("[%d:a]atrim=start=%.3f,asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=stereo,"
                         "volume=%.3f,adelay=%d|%d[s%d]" % (n + 2, head, loud, late, late, n))
            ins.append("[s%d]" % n)
        steps.append("%samix=inputs=%d:duration=first:normalize=0[heard]" % ("".join(ins), len(ins)))
        command += ["-filter_complex", ";".join(steps), "-map", "0:v", "-map", "[heard]",
                    "-c:a", "aac", "-b:a", "192k", "-shortest"]
    elif audio:
        # the sound starts where the pictures start
        command += ["-ss", "%.3f" % start, "-i", audio, "-c:a", "aac", "-b:a", "192k", "-shortest"]
    # these settings are the ones phones can play
    command += ["-vf", "scale=out_range=tv:out_color_matrix=bt709,format=yuv420p",
                "-colorspace", "bt709", "-color_primaries", "bt709",
                "-color_trc", "bt709",
                "-c:v", "libx264", "-profile:v", "high", "-level", "4.0"]
    if not fast:
        # A drawn film is flat colour and ink lines, which the encoder's
        # usual settings smear: a lower rate factor keeps the lines clean,
        # "animation" tunes the encoder for flat colour, and the slower
        # preset finds the smaller file for the same picture.
        command += ["-crf", "18", "-preset", "slow", "-tune", "animation"]
    command += ["-movflags", "+faststart", video]
    return command


def render(page_file, video, audio, start=0.0, end=None, fast=False, sets=(), vanish=True):
    """Render a kit page to a video file, frame by frame, in Chrome with no window: gives back nothing.

    page_file: the page (a path). video: the file to write. audio: a sound file, or None.
    start, end: the seconds to render from and to (default 0 to the page's LENGTH; end is held to LENGTH).
    fast: JPEG frames and the encoder's usual settings. sets: (name, value) pairs set on window before
    the first frame (render.py --set). vanish: first look for what blinks out of the film (vanished()), and tell it.
    It prints what blinked out, the frames made, the time it took, the kit's warnings and the page's errors.
    It fails with SystemExit (a message) when ffmpeg stops, and SystemExit(1) when the page reported an
    error; then the video is written all the same. scenes.py calls it once for each scene.
    e.g. render("hello.html", "hello.mp4", None, 0.0, 5.0)"""
    started = time.time()
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        page.on("pageerror", lambda error: errors.append(str(error)))
        # the hero film paints its forests as it loads: 42 s on a laptop on battery
        page.goto(Path(page_file).resolve().as_uri(), timeout=180000)
        # every web font the page names, loaded before the first frame: a canvas asks for a font only when it first
        # draws in it, and that frame would be in another (the credits of the creature's film: one frame of 2925)
        page.evaluate(FONTS)
        for name, value in sets:          # --set: a value the page is given for this render (sash.html's SLOW)
            page.evaluate("([name, value]) => { window[name] = value; }", [name, value])
        page.evaluate("rendering = true")
        seconds = page.evaluate("typeof LENGTH !== 'undefined' ? LENGTH : DURATION")
        end = seconds if end is None else min(end, seconds)
        # a part of a film starts with a jump of the clock; the kit's settled()
        # lets what hangs and swings come to rest first, as it would in the film
        first, last = round(start * FPS), round(end * FPS)
        # what blinks out of the film, told before the pictures, while there is time to stop and mend the scene (a
        # page made before the kit had vanished() has nothing to tell)
        blinks = []
        if vanish:
            looked = time.time()
            page.evaluate("if (typeof HEARD !== 'undefined') { HEARD = []; }")   # it listens in the same look (heard())
            blinks = page.evaluate("([a, b, fps]) => typeof vanished === 'function' ? vanished(a, b, fps) : []",
                                   [first / FPS, last / FPS, FPS])
            for blink in blinks:
                print("warning:", blink, flush=True)
            print("looked for what blinks out in %.0f seconds: %d found" % (time.time() - looked, len(blinks)), flush=True)
            calls = page.evaluate("([a, b]) => { if (typeof heardCalls !== 'function') { return []; } var calls = heardCalls()"
                                  ".filter(function (c) { return c[0] + ((HEARD_SOUNDS[c[1]] || {}).lead || 0) >= a && c[0] < b; });"
                                  " HEARD = null; return calls; }", [first / FPS, last / FPS])
        else:
            calls = page.evaluate("([a, b, fps]) => typeof heard === 'function' ? heard(a, b, fps) : []",
                                  [first / FPS, last / FPS, FPS])
        sounds = []
        for at, sound, loud in calls:     # the picture's own sounds, laid under it
            file = SOUNDS / (sound + ".wav")
            if not file.exists() and (SOUNDS.parent.parent / "sounds.py").exists():
                subprocess.run([sys.executable, str(SOUNDS.parent.parent / "sounds.py"), sound])
            if file.exists():
                sounds.append((at - first / FPS, file, loud))
                print("heard: %s at %.2f s" % (sound, at), flush=True)
            else:
                print("warning: the picture calls %s at %.2f s, and there is no %s (sounds.py makes it): left out" % (sound, at, file), flush=True)

        ffmpeg = subprocess.Popen(ffmpeg_command(video, audio, first / FPS, fast, sounds),
                                  stdin=subprocess.PIPE)
        try:
            for number in range(first, last):
                page.evaluate("draw(%f)" % (number / FPS))
                # each picture goes to ffmpeg as it was drawn: a JPEG, even at quality 95,
                # softens every ink line before the encoder sees it. --fast keeps the JPEG.
                ffmpeg.stdin.write(page.screenshot(type="jpeg", quality=95) if fast else page.screenshot(type="png"))
            ffmpeg.stdin.close()
        except BrokenPipeError:
            pass                          # ffmpeg stopped part-way, and has said why above: told below
        failed = ffmpeg.wait() != 0
        warnings = page.evaluate("typeof WARNINGS === 'undefined' ? [] : WARNINGS.slice()")
        browser.close()
    if failed:
        raise SystemExit("ffmpeg stopped with an error: no video was made")

    took = time.time() - started
    print("%s: %d frames, %.1f seconds of video" % (video, last - first, (last - first) / FPS))
    print("rendered in %.0f seconds" % took)
    for blink in blinks:
        print("warning:", blink)
    for warning in warnings:
        print("the kit warned:", warning)
    for error in errors:
        print("the page reported an error:", error)
    if errors:
        raise SystemExit(1)


def main():
    """The command line: read the arguments, check that ffmpeg and the sound file are there, render.

    Fails with SystemExit (a message, exit code 1) when ffmpeg is missing, the sound file is not there,
    or --to does not come after --from."""
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("video")
    parser.add_argument("--audio")
    parser.add_argument("--from", dest="start", type=float, default=0.0, help="the second to start at")
    parser.add_argument("--to", dest="end", type=float, help="the second to stop at")
    parser.add_argument("--fast", action="store_true", help="JPEG frames and the encoder's usual settings: quicker, softer")
    parser.add_argument("--set", action="append", default=[], metavar="NAME=VALUE",
                        help="give the page a value for this render: VALUE is JSON, or @file.json (sash.html: SLOW, LENGTH, WORDS)")
    parser.add_argument("--no-vanish", dest="vanish", action="store_false",
                        help="do not look first for what blinks out of the film")
    args = parser.parse_args()
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is not installed, or not on the PATH")
    if args.audio and not Path(args.audio).exists():
        raise SystemExit("no such sound file: " + args.audio)
    if args.end is not None and args.end <= args.start:
        raise SystemExit("--to must come after --from")
    sets = []
    for one in args.set:
        name, _, value = one.partition("=")
        sets.append((name, json.loads(Path(value[1:]).read_text(encoding="utf-8") if value.startswith("@") else value)))
    render(args.page, args.video, args.audio, args.start, args.end, args.fast, sets, args.vanish)


if __name__ == "__main__":
    main()
