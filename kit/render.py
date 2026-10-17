"""render.py - turn a page that has draw(t) into a video file.

    python render.py hello.html hello.mp4
    python render.py lanterns.html lanterns.mp4 --audio lanterns.wav
    python render.py lanna.html scene.mp4 --from 12 --to 20     # only seconds 12 to 20

It opens the page in Chrome with no window, asks for one frame at a time,
takes a picture of each, and hands the pictures to ffmpeg. Then it says
what the page said: an error, or a warning from the kit (a name it does
not know, which changes nothing).
"""
import argparse
import shutil
import subprocess
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

FPS = 30
WIDTH = 1920
HEIGHT = 1080


def ffmpeg_command(video, audio, start=0, fast=False):
    # ffmpeg reads the pictures from this program, one after another
    command = ["ffmpeg", "-y", "-loglevel", "error",
               "-f", "image2pipe", "-framerate", str(FPS), "-i", "-"]
    if audio:
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


def render(page_file, video, audio, start=0.0, end=None, fast=False):
    started = time.time()
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        page.on("pageerror", lambda error: errors.append(str(error)))
        # the hero film paints its forests as it loads: 42 s on a laptop on battery
        page.goto(Path(page_file).resolve().as_uri(), timeout=180000)
        page.evaluate("rendering = true")
        seconds = page.evaluate("DURATION")
        end = seconds if end is None else min(end, seconds)
        # a part of a film starts with a jump of the clock; the kit's settled()
        # lets what hangs and swings come to rest first, as it would in the film
        first, last = round(start * FPS), round(end * FPS)

        ffmpeg = subprocess.Popen(ffmpeg_command(video, audio, first / FPS, fast),
                                  stdin=subprocess.PIPE)
        for number in range(first, last):
            page.evaluate("draw(%f)" % (number / FPS))
            # each picture goes to ffmpeg as it was drawn: a JPEG, even at quality 95,
            # softens every ink line before the encoder sees it. --fast keeps the JPEG.
            ffmpeg.stdin.write(page.screenshot(type="jpeg", quality=95) if fast else page.screenshot(type="png"))
        ffmpeg.stdin.close()
        failed = ffmpeg.wait() != 0
        warnings = page.evaluate("typeof WARNINGS === 'undefined' ? [] : WARNINGS.slice()")
        browser.close()
    if failed:
        raise SystemExit("ffmpeg stopped with an error: no video was made")

    took = time.time() - started
    print("%s: %d frames, %.1f seconds of video" % (video, last - first, (last - first) / FPS))
    print("rendered in %.0f seconds" % took)
    for warning in warnings:
        print("the kit warned:", warning)
    for error in errors:
        print("the page reported an error:", error)
    if errors:
        raise SystemExit(1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("video")
    parser.add_argument("--audio")
    parser.add_argument("--from", dest="start", type=float, default=0.0, help="the second to start at")
    parser.add_argument("--to", dest="end", type=float, help="the second to stop at")
    parser.add_argument("--fast", action="store_true", help="JPEG frames and the encoder's usual settings: quicker, softer")
    args = parser.parse_args()
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is not installed, or not on the PATH")
    if args.audio and not Path(args.audio).exists():
        raise SystemExit("no such sound file: " + args.audio)
    if args.end is not None and args.end <= args.start:
        raise SystemExit("--to must come after --from")
    render(args.page, args.video, args.audio, args.start, args.end, args.fast)


if __name__ == "__main__":
    main()
