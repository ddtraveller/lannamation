"""tale_plan.py - a tale's plan and its words, from one file: the scenes, what each shows, and every line said.

    python tale_plan.py changngu                # changngu/story.py -> changngu/plan.html, words.js, central.txt
    python tale_plan.py changngu --check        # only say what is wrong with story.py: writes nothing

A new tale starts as a plan the owner reads before anything is drawn (docs/kit/films.md, "A new tale, from start to
finish"). Its folder's story.py holds it all: SCENES, each (title, seconds, what we see, what the kit has, what it
needs, [(English, Central Thai, Kam Mueang), ...]), the plan's own words around them (PLAN), and SAY_AS, the
names said the Northern way by the voice. From it this writes:
  plan.html     the plan: the tale in short, the choices made, every scene with its seconds, its kit (green: there,
                red: new) and its lines in English, Central Thai and Kam Mueang. For the owner, before anything else.
  words.js      the film's words for its pages, <FOLDER>_WORDS[id] = [what the voice says, what the subtitle writes,
                the English], as maeng/words.js: a scene names its lines by id (sNN_LINES), the film page puts them
                on its clock. The ids are PLAN["prefix"] and a number in the order of the lines (C001, C002 ...):
                a line put in or taken out renumbers those after it, so ids are settled before the voice speaks.
  central.txt   the Central Thai, a line each, in order: what a writer of Kam Mueang (or a translator) is given.
Edit story.py and run it again; nothing else is hand-written.

It needs only Python. It ends with exit code 0, or 1 with what is wrong: a line with no Kam Mueang, a ๆ in a
line's Kam Mueang (the voice
reads the written repeat badly: write the word twice), or a scene with no lines and no seconds.
"""
import html
import importlib.util
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def story_of(folder):
    """The film folder's story.py, as a module. e.g. story_of(Path("changngu")).SCENES[0][0] is "The Mae Khong"."""
    spec = importlib.util.spec_from_file_location("story", folder / "story.py")
    story = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(story)
    return story


def clock(seconds):
    """m:ss for a number of seconds. e.g. clock(95) is "1:35"."""
    return "%d:%02d" % (seconds // 60, seconds % 60)


def lines_of(story):
    """Every line in order: [id, scene number, English, Central Thai, Kam Mueang]."""
    out = []
    for number, scene in enumerate(story.SCENES, 1):
        for english, central, kam in scene[5]:
            out.append(["%s%03d" % (story.PLAN["prefix"], len(out) + 1), number, english, central, kam])
    return out


def spoken(story, written):
    """What the voice says for a written line: each name in SAY_AS said its way. e.g. spoken(s, "ช้าง") is "จ๊าง"."""
    for name, said in story.SAY_AS.items():
        written = written.replace(name, said)
    return written


def problems(story):
    """What is wrong with story.py, as sentences; none when it is ready."""
    out = []
    for number, scene in enumerate(story.SCENES, 1):
        if len(scene) != 6:
            out.append("scene %d has %d parts, not 6 (title, seconds, see, have, new, lines)" % (number, len(scene)))
            continue
        if scene[1] <= 0:
            out.append("scene %d (%s) has no seconds" % (number, scene[0]))
        for english, central, kam in scene[5]:
            if not kam.strip():
                out.append("scene %d: no Kam Mueang for %r" % (number, english))
            if "ๆ" in kam:
                out.append("scene %d: a ๆ in the Kam Mueang of %r (write the word twice: the voice reads ๆ badly)"
                           % (number, english))
    return out


def e(text):
    return html.escape(text, quote=False)


def plan_page(story, lines):
    """plan.html's text."""
    plan, story_seconds = story.PLAN, sum(s[1] for s in story.SCENES)
    total = plan["before"] + story_seconds + plan["credits"]
    rows, at = [], 0
    for number, (title, seconds, see, have, new, said) in enumerate(story.SCENES, 1):
        mine = [line for line in lines if line[1] == number]
        words = "".join("<li><span class='id'>%s</span> %s<br><span class='th'>%s</span><br><span class='th km'>%s</span></li>"
                        % (line[0], e(line[2]), e(line[3]), e(line[4])) for line in mine)
        kit = "<span class='have'>%s</span>" % e(have) + ("<br><span class='new'>new: %s</span>" % e(new) if new else "")
        rows.append("<tr><td>%d</td><td class='t'>%s–%s</td><td><b>%s</b><br>%s</td><td>%s</td></tr>"
                    "<tr class='words'><td></td><td colspan='3'><ol>%s</ol></td></tr>"
                    % (number, clock(at), clock(at + seconds), e(title), e(see), kit, words))
        at += seconds
    sections = lambda part: "".join("<h2>%s</h2>\n%s\n" % (e(head), body) for head, body in plan.get(part, []))
    return PAGE.format(title=e(plan["title"]), thai=e(plan["thai"]), subtitle=e(plan["subtitle"]), lede=plan["lede"],
                       count=len(story.SCENES), lines=len(lines), story=clock(story_seconds), credits=plan["credits"],
                       before=plan["before_words"], total=clock(total), first=sections("first"),
                       table="\n".join(rows), last=sections("last"))


def words_js(story, lines, name):
    """words.js's text: NAME_WORDS[id] = [spoken, written, English]."""
    head = ("// words.js - the narration of %s, line by line: %s_WORDS[id] = [what the voice says, what the subtitle\n"
            "// writes, the English]. Written by ../tale_plan.py from story.py: do not edit by hand.\n"
            % (story.PLAN["title"], name))
    body = "".join("  %s: %s,\n" % (line[0], json.dumps([spoken(story, line[4]), line[4], line[2]], ensure_ascii=False))
                   for line in lines)
    return head + "var %s_WORDS = {\n%s};\n" % (name, body)


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    folder = HERE / sys.argv[1]
    story = story_of(folder)
    wrong = problems(story)
    for sentence in wrong:
        print(sentence)
    if wrong:
        raise SystemExit(1)
    lines = lines_of(story)
    if "--check" in sys.argv:
        print("%s/story.py: %d scenes, %d lines, nothing wrong" % (sys.argv[1], len(story.SCENES), len(lines)))
        return
    name = folder.name.upper()
    (folder / "plan.html").write_text(plan_page(story, lines), encoding="utf-8", newline="\n")
    (folder / "words.js").write_text(words_js(story, lines, name), encoding="utf-8", newline="\n")
    (folder / "central.txt").write_text("".join(line[3] + "\n" for line in lines), encoding="utf-8", newline="\n")
    story_seconds = sum(s[1] for s in story.SCENES)
    print("%d scenes, %d lines; the tale %s, the whole film %s; wrote plan.html, words.js (%s_WORDS), central.txt"
          % (len(story.SCENES), len(lines), clock(story_seconds),
             clock(story.PLAN["before"] + story_seconds + story.PLAN["credits"]), name))


PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} plan</title>
<style>
  :root {{ --ink: #2b2620; --soft: #6b6157; --paper: #faf6ee; --card: #fffdf8; --rule: #e3d9c8; --gold: #b07d1e;
          --new: #a8432e; --have: #3f6b3a; }}
  @media (prefers-color-scheme: dark) {{
    :root:not([data-theme="light"]) {{ --ink: #ece4d6; --soft: #b3a796; --paper: #1d1a16; --card: #26221d; --rule: #3d362d;
                                      --gold: #d9a845; --new: #e07a62; --have: #8cc07f; }}
  }}
  :root[data-theme="dark"] {{ --ink: #ece4d6; --soft: #b3a796; --paper: #1d1a16; --card: #26221d; --rule: #3d362d;
                             --gold: #d9a845; --new: #e07a62; --have: #8cc07f; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.55 Georgia, "Leelawadee UI", serif; }}
  main {{ max-width: 980px; margin: 0 auto; padding: 28px 16px 60px; }}
  h1 {{ font-size: 1.9em; margin: 0 0 4px; }} h1 small {{ display: block; font-size: 0.5em; color: var(--soft); font-weight: normal; }}
  h2 {{ margin-top: 2em; border-bottom: 2px solid var(--gold); padding-bottom: 4px; }}
  .lede {{ font-size: 1.1em; }}
  table {{ width: 100%; border-collapse: collapse; margin: 12px 0; background: var(--card); }}
  th, td {{ border: 1px solid var(--rule); padding: 7px 9px; vertical-align: top; text-align: left; }}
  th {{ background: var(--rule); font-family: "Segoe UI", sans-serif; font-size: 0.85em; }}
  td.t {{ white-space: nowrap; font-family: Consolas, monospace; font-size: 0.9em; }}
  tr.words td {{ border-top: none; font-size: 0.92em; }}
  tr.words ol {{ margin: 0; padding-left: 0; list-style: none; }}
  tr.words li {{ margin: 0 0 8px; }}
  .id {{ font-family: Consolas, monospace; color: var(--soft); font-size: 0.85em; }}
  .km {{ color: var(--gold); }}
  .wrap {{ overflow-x: auto; }}
  .wrap table {{ min-width: 640px; }}
  .new {{ color: var(--new); font-weight: bold; }} .have {{ color: var(--have); }}
  .th {{ font-family: "Leelawadee UI", "Noto Sans Thai", sans-serif; }}
  .note {{ color: var(--soft); font-size: 0.92em; }}
  code {{ font-size: 0.9em; }}
</style>
</head>
<body>
<main>
<h1>{title} <span class="th">{thai}</span><small>{subtitle}</small></h1>
<p class="lede">{lede}</p>
<p>{count} scenes, the tale {story} long with {lines} narration lines; then about {credits} s of credits. With {before}
first, the whole film is {total}.</p>
{first}
<h2>The scenes</h2>
<p class="note">Times are the tale's own, from 0. <span class="have">Green: the kit has it.</span>
<span class="new">Red: new for the kit.</span> Under each scene, its lines: English, Central Thai, then the Kam Mueang
the voice says (in gold).</p>
<div class="wrap"><table>
<tr><th>#</th><th>Time</th><th>What we see</th><th>Kit</th></tr>
{table}
</table></div>
{last}
</main>
</body>
</html>
"""

if __name__ == "__main__":
    main()
