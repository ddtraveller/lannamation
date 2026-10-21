"""scenes.py - render a film one scene at a time, and join the scenes into one video.

    python scenes.py sash.html sash.mp4 --audio sash_voice.wav            # every scene not made yet, then the film
    python scenes.py sash.html sash.mp4 --audio sash_voice.wav --scene 3  # scene 3 again, then the film
    python scenes.py sash.html --list                                     # the scenes and their videos
    python scenes.py sash.html sash.mp4 --all --jobs 3                    # three scenes at a time

A page that lists its scenes in SCENES ([from, to, scene], as the kit's
film() takes them) is rendered one scene at a time, each scene into a video
of its own in a folder beside the page (sash_scenes/ for sash.html). A scene
whose video is there already is not rendered again. So after a change to one
scene, render that scene again with --scene and the film is joined from it
and the scenes made before: minutes, where the whole film takes half an hour.

Which scenes a change touches is for you to say. A change to one scene's
function touches that scene; a change to the kit, or to a set two scenes
share, can touch several, and --all renders every scene again. --list shows
each scene's video, and says which were made before the page, or a script
file it loads, last changed.

The pictures of each scene are rendered by render.py, from a jump of the
clock to the scene's first second, as a still is (the kit's settled() lets
what hangs and swings come to rest first). The scenes are joined without
encoding them again, and the sound is laid over the whole film at once, so
it has no seam where the scenes meet.

With --jobs, that many scenes are rendered at once, each by render.py in a
process and a Chrome of its own: about that many times sooner, while the
computer has the cores and the memory (a Chrome drawing the hero film holds
1 to 2 GB). Each scene is rendered as it is alone. (A scene that starts
part-way into a film does not come out bit for bit the same from one render
to the next, alone or not: village.html's second scene, twice, differed in
225 of 300 frames, at 42 dB or more. --jobs adds nothing to that.)
"""
import argparse
import concurrent.futures
import re
import shutil
import subprocess
from pathlib import Path

from playwright.sync_api import sync_playwright

import render

# each scene of the page as [from, to, the name of its function]
SCENES_OF = "SCENES.map(function (s) { return [s[0], s[1], s[2].name || 'scene']; })"


def scenes_of(page_file):
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome")
        page = browser.new_page()
        # the hero film paints its forests as it loads: 42 s on a laptop on battery
        page.goto(page_file.resolve().as_uri(), timeout=180000)
        listed = page.evaluate("typeof SCENES !== 'undefined'")
        scenes = page.evaluate(SCENES_OF) if listed else None
        browser.close()
    if not scenes:
        raise SystemExit(page_file.name + " lists no SCENES: render it whole with render.py")
    return scenes


def clip_of(folder, number, scene):
    # the scene's seconds are in the name, so a scene that is moved or made longer gets a new video
    start, end, name = scene
    return folder / ("%02d_%s_%g-%g.mp4" % (number, name, start, end))


def last_changed(page_file):
    """When the page, or a script file it loads, last changed."""
    names = re.findall(r'<script src="([^":]+)"', page_file.read_text(encoding="utf-8"))
    files = [page_file] + [page_file.parent / name for name in names]
    return max(f.stat().st_mtime for f in files if f.exists())


def show(scenes, clips, changed):
    for number, (scene, clip) in enumerate(zip(scenes, clips), 1):
        start, end, name = scene
        if not clip.exists():
            state = "not made yet"
        elif clip.stat().st_mtime < changed:
            state = "made before the page or a file it loads last changed"
        else:
            state = "made"
        print("%d  %-12s %5g to %-5g s  %s: %s" % (number, name, start, end, clip.name, state))


def join(clips, video, audio, folder):
    # ffmpeg's concat list: one line for each scene's video, in order
    listing = folder / "scenes.txt"
    listing.write_text("".join("file '%s'\n" % clip.name for clip in clips), encoding="utf-8")
    command = ["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(listing)]
    if audio:
        # 256k: the hero film's sound is mastered in stereo (sash_narrate.py), and its live file carries it at 256k
        command += ["-i", audio, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "256k", "-shortest"]
    command += ["-c:v", "copy", "-movflags", "+faststart", str(video)]
    if subprocess.run(command).returncode != 0:
        raise SystemExit("ffmpeg stopped with an error: the film was not joined")
    print("%s: joined from %d scenes" % (video, len(clips)))


def render_scene(page_file, part, start, end, fast):
    """One scene into its file, in a process of its own (--jobs): what went wrong, or None."""
    try:
        render.render(page_file, part, None, start, end, fast)
    except SystemExit as stop:          # render.py ends by SystemExit when ffmpeg or the page fails
        return "render.py stopped: %s" % stop
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("video", nargs="?", help="the film to join the scenes into")
    parser.add_argument("--audio")
    parser.add_argument("--scene", type=int, action="append", default=[], help="render this scene again (1 is the first); give it more than once for more")
    parser.add_argument("--all", action="store_true", help="render every scene again")
    parser.add_argument("--list", action="store_true", help="show the scenes and their videos, and render nothing")
    parser.add_argument("--fast", action="store_true", help="as render.py --fast; its scenes go in a folder of their own")
    parser.add_argument("--jobs", type=int, default=1, help="render this many scenes at once, each in a Chrome of its own")
    args = parser.parse_args()
    page_file = Path(args.page)
    if not page_file.exists():
        raise SystemExit("no such page: " + args.page)
    if not args.list and not args.video:
        raise SystemExit("name the film to make, or ask for --list")
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is not installed, or not on the PATH")
    if args.audio and not Path(args.audio).exists():
        raise SystemExit("no such sound file: " + args.audio)

    scenes = scenes_of(page_file)
    # a fast scene and a full one are encoded differently, and cannot be joined without encoding again
    folder = page_file.parent / (page_file.stem + ("_scenes_fast" if args.fast else "_scenes"))
    folder.mkdir(exist_ok=True)
    clips = [clip_of(folder, number, scene) for number, scene in enumerate(scenes, 1)]
    if args.list:
        show(scenes, clips, last_changed(page_file))
        return
    for number in args.scene:
        if not 1 <= number <= len(scenes):
            raise SystemExit("there is no scene %d: the page has %d" % (number, len(scenes)))

    wanted = [(number, scene, clip) for number, (scene, clip) in enumerate(zip(scenes, clips), 1)
              if args.all or number in args.scene or not clip.exists()]
    # each into a file of another name first, so a render that stops half way leaves no scene behind it
    if args.jobs <= 1:
        for number, (start, end, name), clip in wanted:
            print("scene %d (%s), %g to %g s:" % (number, name, start, end))
            part = clip.with_name(clip.stem + ".part.mp4")
            render.render(str(page_file), str(part), None, start, end, args.fast)
            part.replace(clip)
    else:
        failed = []
        with concurrent.futures.ProcessPoolExecutor(max_workers=args.jobs) as pool:
            running = {pool.submit(render_scene, str(page_file), str(clip.with_name(clip.stem + ".part.mp4")),
                                   start, end, args.fast): (number, name, clip)
                       for number, (start, end, name), clip in wanted}
            print("%d scenes, %d at a time" % (len(running), args.jobs))
            for done in concurrent.futures.as_completed(running):
                number, name, clip = running[done]
                trouble = done.result()
                if trouble:
                    failed.append("scene %d (%s): %s" % (number, name, trouble))
                    continue
                clip.with_name(clip.stem + ".part.mp4").replace(clip)
                print("scene %d (%s) made" % (number, name))
        if failed:
            raise SystemExit("not every scene was made, and the film was not joined:\n  " + "\n  ".join(failed))
    join(clips, Path(args.video), args.audio, folder)


if __name__ == "__main__":
    main()
