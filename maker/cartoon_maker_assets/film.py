"""film.py - a cartoon from the command line: a film as JSON in; a page, stills and a video out.

    python film.py vocabulary                       the names the kit knows, the JSON shape and the rules
    python film.py page film.json out.html          the film as a page of the Lanna cartoon kit
    python film.py stills film.json 2 6 10          one picture per second named: stills/film_2.0s.png ...
    python film.py render film.json out.mp4         the video (add --from 2 --to 8 for a part of it)
    python film.py write "a story" film.json --base http://127.0.0.1:11434/v1 --model qwen2.5:3b
                                                    a model writes the JSON (--key KEY for OpenAI)
    python film.py skill claude_code                give the skill to an agent: claude_code, codex or opencode

The JSON is the same data that krueng.ai/cartoon_maker.html makes with its
palette, and this program uses that page itself, open in a browser with no
window, to check the film and to write its code. So the page and this program
can never disagree. The page is the one beside this program when there is one
(in a copy of the lannamation repository, or of the site), else the site's;
--maker gives another address.

A page it writes carries the kit inside it, so the film draws the same for
good and plays with no internet; --local writes one that loads the kit from
files beside it instead.

Needs: Python 3, playwright (pip install playwright) with Chrome installed,
and ffmpeg on the PATH for a video.

Each command prints what the maker kept of the film and the kit's warnings. It ends with exit code 0;
1 with a message when the maker refuses the film or the model's server answers with an error; render ends
with render.py's own exit code. page writes OUT; stills and render write FILM.html beside the film's JSON
first, and stills its pictures into --folder (default stills/).
"""
import argparse
import json
import pathlib
import subprocess
import sys
import urllib.request

SITE = "https://krueng.ai/js_animation_assets/"
HERE = pathlib.Path(__file__).resolve().parent
# the maker beside this program (maker/ in lannamation, the site's folder in a copy of it), else the site's
BESIDE = HERE.parent / "cartoon_maker.html"
MAKER = BESIDE.as_uri() if BESIDE.exists() else "https://krueng.ai/cartoon_maker.html"


def open_maker(url):
    """The maker page in a browser with no window: its functions are ours to call.

    url: the maker's address (a file:// address or the site's). Gives back (playwright, browser, page): close
    them with close_maker() when done. The maker's saved film in the browser's storage is cleared first.
    e.g. playwright, browser, page = open_maker(MAKER)"""
    from playwright.sync_api import sync_playwright
    playwright = sync_playwright().start()
    # a maker opened as a file reads the kit's scripts, to carry them inside the page it writes, only when Chrome is
    # told that files may read files; nothing else about it changes
    browser = playwright.chromium.launch(channel="chrome", headless=True, args=["--allow-file-access-from-files"])
    page = browser.new_page(viewport={"width": 1300, "height": 800})
    page.goto(url, wait_until="load")
    page.wait_for_function("() => typeof pageCode === 'function' && typeof takeFilm === 'function'")
    page.evaluate("() => { try { localStorage.removeItem('cartoon_maker'); } catch (e) {} }")
    return playwright, browser, page


def close_maker(playwright, browser):
    """Close the browser and stop Playwright, as open_maker() started them. Gives back nothing.

    e.g. close_maker(playwright, browser)"""
    browser.close()
    playwright.stop()


def take(page, film):
    """Hand the film to the page: it checks every name and number, and says what it kept.

    page: the maker, from open_maker(). film: the film, a dict (the JSON). Gives back (summary, warnings): what
    the page says it kept, and the kit's warnings while it drew each second a key or a text starts at. It changes
    the page's film (movie). Fails with SystemExit when the page refuses the film.
    e.g. summary, warnings = take(page, read_film("film.json"))"""
    summary = page.evaluate("data => { try { return takeFilm(data); } catch (error) { return 'ERROR ' + error.message; } }", film)
    if summary.startswith("ERROR"):
        raise SystemExit("the page refused the film: " + summary[6:])
    seconds = page.evaluate("() => movie.items.map(i => i.keys.map(k => k[0])).flat().concat(movie.texts.map(t => t.from))")
    warnings = page.evaluate("secs => { WARNINGS.length = 0; secs.forEach(s => { time = s; show(); }); return WARNINGS.slice(); }",
                             sorted(set([0] + seconds)))
    return summary, warnings


def vocabulary(args):
    """film.py vocabulary: print the maker's own instructions (filmPrompt()): the names, the JSON shape, the rules.

    args: the parsed arguments (args.maker). Gives back nothing."""
    playwright, browser, page = open_maker(args.maker)
    print(page.evaluate("() => filmPrompt()"))
    close_maker(playwright, browser)


def read_film(path):
    """The film's JSON file at path, as a dict. Fails with json's error when it is not JSON.

    e.g. read_film("film.json")"""
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))


def page_code(page, local):
    """The page of the film the maker holds, as HTML text: the kit inside it, or loaded from files beside it.

    page: the maker. local: True for a page that loads the kit's scripts from files beside it (render.py
    without the site); False for one that carries them inside. Fails with SystemExit when the maker cannot
    read the kit's scripts.
    e.g. page_code(page, False)"""
    if local:                           # the kit's files beside the page, for render.py without the site
        return page.evaluate("() => pageCode()").replace('src="' + SITE, 'src="')
    code = page.evaluate("() => new Promise(done => kitSources(sources => done(sources && pageCode(sources))))")
    if not code:
        raise SystemExit("the maker could not read the kit's scripts to put them inside the page")
    return code


def make_page(args):
    """film.py page FILM OUT [--local]: write the film as a page of the kit. Gives back nothing.

    args: the parsed arguments (film, out, local, maker)."""
    playwright, browser, page = open_maker(args.maker)
    summary, warnings = take(page, read_film(args.film))
    pathlib.Path(args.out).write_text(page_code(page, args.local), encoding="utf-8")
    close_maker(playwright, browser)
    report(args.out, summary, warnings)


def report(what, summary, warnings):
    """Print what was made, what the maker kept of the film, and the kit's warnings (or that there were none).

    what: the file made. summary, warnings: as take() gives them. Gives back nothing.
    e.g. report("out.html", summary, warnings)"""
    print(what + ": " + summary)
    for warning in warnings:
        print("the kit warns: " + warning)
    if not warnings:
        print("the kit raised no warning")


def stills(args):
    """One picture per second named, from the film's own page: draw(t), then a photograph of the stage.

    film.py stills FILM SECONDS... [--folder F]: writes FILM.html beside the film and one PNG a second named,
    FOLDER/FILM_2.0s.png (1920 x 1080). args: the parsed arguments. Gives back nothing."""
    playwright, browser, page = open_maker(args.maker)
    summary, warnings = take(page, read_film(args.film))
    html = pathlib.Path(args.film).with_suffix(".html")
    html.write_text(page_code(page, False), encoding="utf-8")
    film_page = browser.new_page(viewport={"width": 1920, "height": 1080})
    film_page.goto(html.resolve().as_uri(), wait_until="load")
    film_page.wait_for_function("() => typeof draw === 'function'")
    film_page.evaluate("() => { rendering = true; }")
    folder = pathlib.Path(args.folder)
    folder.mkdir(parents=True, exist_ok=True)
    stem = pathlib.Path(args.film).stem
    for second in args.seconds:
        film_page.evaluate("t => draw(t)", second)
        out = folder / ("%s_%.1fs.png" % (stem, second))
        film_page.locator("#stage").screenshot(path=str(out))
        print("wrote " + str(out))
    close_maker(playwright, browser)
    report(str(html), summary, warnings)


def find_render():
    """The kit's render.py: beside the kit (kit/ in lannamation, js_animation_assets/ in the site's folder), or
    fetched from the site once.

    Gives back its Path; a fetched one is kept in tools/ beside this file. Fails with urllib's error when it
    must fetch it and cannot. e.g. find_render()"""
    for beside in (HERE.parent.parent / "kit" / "render.py", HERE.parent / "js_animation_assets" / "render.py"):
        if beside.exists():
            return beside
    cached = HERE / "tools" / "render.py"
    if not cached.exists():
        cached.parent.mkdir(exist_ok=True)
        with urllib.request.urlopen(SITE + "render.py") as reply:
            cached.write_bytes(reply.read())
        print("fetched render.py from the site into " + str(cached))
    return cached


def render(args):
    """film.py render FILM OUT [--from S] [--to S] [--audio WAV]: write FILM.html beside the film, then run
    render.py on it.

    args: the parsed arguments. It does not come back: it ends the program by SystemExit with render.py's exit code."""
    playwright, browser, page = open_maker(args.maker)
    summary, warnings = take(page, read_film(args.film))
    html = pathlib.Path(args.film).with_suffix(".html")
    html.write_text(page_code(page, False), encoding="utf-8")
    close_maker(playwright, browser)
    report(str(html), summary, warnings)
    command = [sys.executable, str(find_render()), str(html), args.out, "--from", str(args.start)]
    if args.end is not None:
        command += ["--to", str(args.end)]
    if args.audio:
        command += ["--audio", args.audio]
    raise SystemExit(subprocess.call(command))


def write(args):
    """Ask a model for the film, with the page's own instructions, and keep what the page accepts.

    film.py write STORY OUT [--base URL] [--model NAME] [--key KEY]: an OpenAI-style /chat/completions server
    (Ollama's /v1 works) writes the JSON; OUT gets the film as the maker kept it. args: the parsed arguments.
    Gives back nothing. Fails with SystemExit when the server answers with an error, json's error when the
    answer holds no JSON, SystemExit when the maker refuses it."""
    playwright, browser, page = open_maker(args.maker)
    prompt = page.evaluate("() => filmPrompt()")
    body = {"model": args.model, "temperature": 0.7,
            "messages": [{"role": "system", "content": prompt}, {"role": "user", "content": args.story}],
            "response_format": {"type": "json_object"}}
    headers = {"Content-Type": "application/json"}
    if args.key:
        headers["Authorization"] = "Bearer " + args.key
    request = urllib.request.Request(args.base.rstrip("/") + "/chat/completions", data=json.dumps(body).encode("utf-8"),
                                     headers=headers, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=600) as reply:
            content = json.load(reply)["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as error:
        raise SystemExit("the server said %d: %s" % (error.code, error.read().decode("utf-8", "replace")[:300]))
    start, end = content.find("{"), content.rfind("}")
    film = json.loads(content[start:end + 1])
    summary, warnings = take(page, film)
    kept = page.evaluate("() => movie")
    pathlib.Path(args.out).write_text(json.dumps(kept, ensure_ascii=False, indent=1), encoding="utf-8")
    close_maker(playwright, browser)
    report(args.out, summary, warnings)


# Where each agent looks for its skills: a folder per skill, holding SKILL.md.
# Claude Code reads the personal folder below (and .claude/skills in a project);
# Codex and OpenCode share one folder, as REA's setup showed on a Mac.
SKILL_FOLDERS = {"claude_code": "~/.claude/skills", "codex": "~/.agents/skills", "opencode": "~/.agents/skills"}


def skill(args):
    """Put SKILL.md where the agent finds it, so that "make a cartoon of ..." reaches this tool.

    film.py skill AGENT (claude_code, codex or opencode): writes ~/.claude/skills/lanna-cartoon/SKILL.md (or
    ~/.agents/skills/...), fetching SKILL.md from the site first when it is not beside this file. Gives back nothing."""
    source = HERE / "SKILL.md"
    if not source.exists():                       # film.py alone was downloaded: fetch its skill from the site
        with urllib.request.urlopen("https://krueng.ai/cartoon_maker_assets/SKILL.md") as reply:
            source.write_bytes(reply.read())
        print("fetched SKILL.md from the site into " + str(source))
    folder = pathlib.Path(SKILL_FOLDERS[args.agent]).expanduser() / "lanna-cartoon"
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / "SKILL.md"
    target.write_text(source.read_text(encoding="utf-8"), encoding="utf-8")
    print("wrote " + str(target).replace(str(pathlib.Path.home()), "~"))
    print("the agent needs this file beside it too: " + str(HERE / "film.py").replace(str(pathlib.Path.home()), "~"))
    print("start " + args.agent.replace("_", " ") + " again, then ask it for a cartoon")


def main():
    """The command line: film.py [--maker URL] COMMAND ...; each command's function does the work."""
    parser = argparse.ArgumentParser(description="a cartoon from the command line, on the Lanna cartoon kit")
    parser.add_argument("--maker", default=MAKER, help="the maker page to use (default: the one beside this program, else the site's)")
    commands = parser.add_subparsers(dest="command", required=True)

    commands.add_parser("vocabulary", help="the names, the JSON shape and the rules").set_defaults(run=vocabulary)

    one = commands.add_parser("page", help="the film as a page of the kit")
    one.add_argument("film")
    one.add_argument("out")
    one.add_argument("--local", action="store_true", help="load the kit from files beside the page, not carry it inside")
    one.set_defaults(run=make_page)

    two = commands.add_parser("stills", help="one picture per second named")
    two.add_argument("film")
    two.add_argument("seconds", nargs="+", type=float)
    two.add_argument("--folder", default="stills")
    two.set_defaults(run=stills)

    three = commands.add_parser("render", help="the video")
    three.add_argument("film")
    three.add_argument("out")
    three.add_argument("--from", dest="start", type=float, default=0.0)
    three.add_argument("--to", dest="end", type=float)
    three.add_argument("--audio")
    three.set_defaults(run=render)

    four = commands.add_parser("write", help="a model writes the film")
    four.add_argument("story")
    four.add_argument("out")
    four.add_argument("--base", default="https://api.openai.com/v1")
    four.add_argument("--model", default="gpt-4o-mini")
    four.add_argument("--key", default="")
    four.set_defaults(run=write)

    five = commands.add_parser("skill", help="give the skill to an agent")
    five.add_argument("agent", choices=sorted(SKILL_FOLDERS))
    five.set_defaults(run=skill)

    args = parser.parse_args()
    args.run(args)


if __name__ == "__main__":
    main()
