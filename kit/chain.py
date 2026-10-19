"""chain.py - join whole films one after another into one video: a series' opening, a studio's card, a tale.

    python chain.py series.mp4 lanna_sash.mp4 sls_intro.mp4 maeng.mp4
    python chain.py series.mp4 lanna_sash.mp4 sls_intro.mp4 maeng_silent.mp4+maeng.wav    # a film and its sound
    python chain.py series.mp4 a.mp4 b.mp4 c.mp4 --over thanks.png,893.2,899.5   # a picture laid over, seconds of the whole

Films made at different times are encoded differently, and a video joined from them without encoding it again can
stop playing where one meets the next: so they are encoded again, once, as render.py encodes (each film 1920 x 1080
at 30 frames a second, as render.py makes them). A film given as VIDEO+SOUND takes its sound from the WAV, as
scenes.py lays a film's sound over it. Each film's sound is kept as it was mastered (the kit's films are all brought
to -14 LUFS); a film with no sound gets silence. It says where each film starts in the joined one: what a page needs
to know to do something during one of them (lanna_cartoon's fireflies, over the studio's card). --over PICTURE,FROM,TO
lays a clear picture (caption.py's words, in the kit's subtitle style) over the joined film from one second of it
to another, fading in and out over 0.4 s (or PICTURE,FROM,TO,FADE: 0, none): words added after the films were
rendered, without rendering them again; or one frame put right, with the frame after it laid over it, unfaded.
"""
import json
import subprocess
import sys
from pathlib import Path

import render


def probe(path, what):
    found = subprocess.run(["ffprobe", "-v", "error"] + what + ["-of", "json", path], capture_output=True, text=True,
                           check=True)
    return json.loads(found.stdout)


def main():
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)
    args = sys.argv[1:]
    overs = [(args[k + 1].split(",") + ["0.4"])[:4] for k, a in enumerate(args) if a == "--over"]   # picture, from, to, fade
    args = [a for k, a in enumerate(args) if a != "--over" and (k == 0 or args[k - 1] != "--over")]
    out, films = args[0], args[1:]
    # render.py's encoding: its picture filter, and its settings from the colours on (without its input and file)
    settings = render.ffmpeg_command(out, None)
    picture = settings[settings.index("-vf") + 1]
    settings = settings[settings.index("-vf") + 2:-1]
    inputs, graph, at, count = [], [], 0.0, 0     # count: the inputs so far, each one ffmpeg's -i
    for n, film in enumerate(films):
        video, _, sound = film.partition("+")
        long = float(probe(video, ["-show_entries", "format=duration"])["format"]["duration"])
        inputs += ["-i", video]
        v = a = count
        count += 1
        if sound:
            inputs += ["-i", sound]
            a, count = count, count + 1
        elif not probe(video, ["-select_streams", "a", "-show_entries", "stream=index"])["streams"]:
            inputs += ["-f", "lavfi", "-t", "%.3f" % long, "-i", "anullsrc=r=44100:cl=stereo"]
            a, count = count, count + 1
        # each film's sound padded or cut to its picture's length, so the next film starts with its own picture
        graph.append("[%d:v]fps=%d,setsar=1,%s[v%d]" % (v, render.FPS, picture, n))
        graph.append("[%d:a]aresample=44100,aformat=channel_layouts=stereo,apad,atrim=0:%.3f[a%d]" % (a, long, n))
        print("%6.1f s  %s%s" % (at, Path(video).name, " + " + Path(sound).name if sound else ""))
        at += long
    graph.append("".join("[v%d][a%d]" % (n, n) for n in range(len(films))) + "concat=n=%d:v=1:a=1[v][j]" % len(films))
    # the films' sound as it was mastered, its peaks held under -2 dB at four times the rate (so peaks between the
    # samples are caught): an AAC encode overshoots, and a joined film came out at +0.5 dBTP without it
    graph.append("[j]aresample=176400,alimiter=limit=0.794:attack=1:release=50:level=disabled,aresample=44100[a]")
    for k, (picture_file, start, end, fade) in enumerate(overs):   # each picture over the whole, faded in and out
        start, end, fade = float(start), float(end), float(fade)
        inputs += ["-loop", "1", "-t", "%.3f" % at, "-i", picture_file]
        faded = ",fade=in:st=%.3f:d=%.3f:alpha=1,fade=out:st=%.3f:d=%.3f:alpha=1" % (start, fade, end - fade, fade) if fade else ""
        graph.append("[%d:v]format=rgba%s[o%d]" % (count, faded, k))
        graph.append("[v][o%d]overlay=0:0:enable='between(t,%.3f,%.3f)',format=yuv420p[v]" % (k, start, end))
        count += 1
        print("        %s over %.1f to %.1f s" % (Path(picture_file).name, start, end))
    command = ["ffmpeg", "-y", "-loglevel", "error"] + inputs + ["-filter_complex", ";".join(graph),
                                                                 "-map", "[v]", "-map", "[a]"] + settings + \
        ["-c:a", "aac", "-b:a", "256k", out]
    if subprocess.run(command).returncode != 0:
        raise SystemExit("ffmpeg stopped with an error: nothing was joined")
    print("%6.1f s  %s: %d films" % (at, out, len(films)))


if __name__ == "__main__":
    main()
