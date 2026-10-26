"""api_index.py - docs/api.md: every function of the kit and every tool, with what its comments say, on one page.

    python kit/api_index.py            # from the repository: writes docs/api.md

For an AI agent (or anyone) using the kit as a set of tools: each module beside the kit (kit/*.js), what its first
comment says it is, then each of its top-level functions, as it is called (its signature) with the comment written
above it; each command-line tool (kit/*.py, kit/checks/*.py, maker/cartoon_maker_assets/film.py) with its own
description, the docstring at its top, and each of its functions with the first line of its docstring. The comments
are the source: this page is made from them, so run this again after a function or its comment changes. Needs
only Python 3.
"""
import ast
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KIT = ROOT / "kit"
OUT = ROOT / "docs" / "api.md"
ORDER = ["oldcartoon.js", "motion.js", "backdrops.js", "pieces.js", "offerings.js", "tools.js", "flora.js", "food.js", "khom.js", "highlands.js", "pinewoods.js", "wildplaces.js",
         "cumulus.js", "rain.js", "storm.js", "flood.js", "band.js", "sabai.js", "weaving.js", "decorate.js", "naga.js", "dragon.js", "beasts.js", "myth.js", "ogre.js", "night.js",
         "northbirds.js", "lannabirds.js", "taleanimals.js", "forestanimals.js", "mangrai.js", "butterflies.js", "himmaphan.js", "paperdoll.js", "puman.js", "fonlep.js", "apsara.js", "finger_dance.js",
         "dance_track.js"]


def head_comment(lines):
    """The file's first block of // lines: what the module is."""
    out = []
    for line in lines:
        if line.startswith("//"):
            out.append(line[2:].strip())
        elif out:
            break
    return " ".join(out)


def functions_of(lines):
    """Each top-level function: its signature line and the // block right above it."""
    found = []
    for i, line in enumerate(lines):
        m = re.match(r"^function ([A-Za-z_]\w*)\(([^)]*)\)", line)
        if not m:
            continue
        j, block = i - 1, []
        while j >= 0 and lines[j].startswith("//"):
            block.insert(0, lines[j][2:].rstrip())
            j -= 1
        trailing = re.search(r"\{\s*//\s*(.*)$", line)
        if trailing:
            block.append(" " + trailing.group(1))
        found.append(("%s(%s)" % (m.group(1), m.group(2)), block))
    return found


def js_section(path):
    lines = path.read_text(encoding="utf-8").split("\n")
    out = ["## %s" % path.name, "", head_comment(lines)[:1200], ""]
    for signature, block in functions_of(lines):
        out.append("### `%s`" % signature)
        out.append("")
        if block:
            out.append("```")
            out.extend(line[1:] if line.startswith(" ") else line for line in block)
            out.append("```")
        else:
            out.append("(no comment)")
        out.append("")
    return out


def py_section(path):
    tree = ast.parse(path.read_text(encoding="utf-8"))
    out = ["## %s" % path.relative_to(ROOT).as_posix(), "", "```", (ast.get_docstring(tree) or "(no description)").strip(), "```", ""]
    for node in tree.body:
        if isinstance(node, ast.FunctionDef):
            doc = (ast.get_docstring(node) or "(no docstring)").strip().split("\n")[0]
            out.append("- `%s(%s)`: %s" % (node.name, ", ".join(a.arg for a in node.args.args), doc))
    out.append("")
    return out


def main():
    scripts = [KIT / n for n in ORDER if (KIT / n).exists()]
    scripts += sorted(p for p in KIT.glob("*.js") if p.name not in ORDER)
    tools = sorted(KIT.glob("*.py")) + sorted((KIT / "checks").glob("*.py")) + [ROOT / "maker" / "cartoon_maker_assets" / "film.py"]
    page = ["# The kit's functions and tools", "",
            "Made by `kit/api_index.py` from the comments in the code (run it again after a change). A film is a page "
            "that loads `oldcartoon.js`, then the modules it needs, and draws second t in `draw(t)`: see the README's "
            "\"A film is a page\" and `docs/STYLE.md`. The look keys of `person()` are listed in the comment above it in "
            "`oldcartoon.js`. Distances are pixels of the film's sheet (1440 x 1080, or 1920 with FILM_STYLE.wide), "
            "times are seconds.", "", "# Modules (JavaScript)", ""]
    for path in scripts:
        page += js_section(path)
    page += ["# Tools (Python, from the command line)", ""]
    for path in tools:
        if path.exists():
            page += py_section(path)
    OUT.write_text("\n".join(page) + "\n", encoding="utf-8")
    count = sum(len(functions_of(p.read_text(encoding="utf-8").split("\n"))) for p in scripts)
    print("%s: %d modules, %d functions, %d tools" % (OUT.relative_to(ROOT).as_posix(), len(scripts), count, len(tools)))


if __name__ == "__main__":
    main()
