"""Write whiteeel/film.html: every scene of the film of the White Eel one after another, with their words, as
changngu/film.html lays out the second tale (C:/jslab/tale2/film_page.py, made for it). The scenes are read from the
folder (sNN_name.js, each with its W{NN}_LONG, W{NN}_LINES and its entry, function welScene...), so the page is made
again whenever a scene is added. Run: python film_page.py"""
import re
from pathlib import Path

FOLDER = Path("C:/jslab/eel/wt/kit/whiteeel")
LINK = ('<link href="https://fonts.googleapis.com/css2?family=Gelasio:ital,wght@1,400&family=Noto+Sans+Tai+Tham:wght@700'
        '&family=Noto+Sans+Thai:wght@700&family=Noto+Serif+Thai:wght@500;600;700&display=swap" rel="stylesheet">')
# Every kit module a scene of this film uses, in the order its scene pages load them (weaving.js, sabai.js and
# sabai_finish.js before credits.js; people.js last of the kit's, for the painted people), then the Chang Ngu film's sets (Yonok's places) before this film's.
MODULES = ["oldcartoon", "backdrops", "naga", "beasts", "myth", "himmaphan", "cumulus", "highlands", "pieces", "night",
           "flora", "butterflies", "thicket", "pinewoods", "wildplaces", "scenery", "chiangsaen", "northbirds", "lannabirds",
           "taleanimals", "decorate", "weaving", "sabai", "sabai_finish", "credits", "people"]


def scenes():
    """[(number, file name, entry function)] for each scene file, in order."""
    found = []
    for path in sorted(FOLDER.glob("s[0-9][0-9]_*.js")):
        number = int(path.name[1:3])
        entry = re.findall(r"^function (welScene\w+)\(t\)", path.read_text(encoding="utf-8"), re.M)
        assert entry, path.name + " has no welScene entry"
        found.append((number, path.name, entry[-1]))
    assert [n for n, _, _ in found] == list(range(1, len(found) + 1)), "the scenes are not numbered 1 to N"
    return found


def main():
    template = (FOLDER.parent / "changngu" / "film.html").read_text(encoding="utf-8").replace("\r\n", "\n")
    head = template.split('<script src="style.js"></script>')[0].replace("changngu - the whole film", "whiteeel - the whole film")
    head = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?[^"]*" rel="stylesheet">', LINK, head)
    tail = template.split("var SCENES = [], at = 0;")[1]
    tail = tail.replace("CHANGNGU_WORDS", "WHITEEEL_WORDS").replace("cngSubtitles", "welSubtitles")
    found = scenes()
    lines = [head.rstrip("\n"), '<script src="style.js"></script>', "<script>var BEAT = 0.5;</script>"]
    lines += ['<script src="../%s.js"></script>' % m for m in MODULES]
    lines += ['<script src="words.js"></script>', '<script src="../changngu/sets.js"></script>', '<script src="sets.js"></script>']
    lines += ['<script src="%s"></script>' % name for _, name, _ in found]
    parts = ", ".join("[W%02d_LONG, %s, W%02d_LINES]" % (n, entry, n) for n, _, entry in found)
    lines += ["<script>",
              "// The film of the White Eel, its %d scenes one after another, with their words. Each scene is its own file and" % len(found),
              "// its own page (s01.html ... s%02d.html); this one only lays them end to end. Made by film_page.py." % len(found),
              "var PARTS = [%s];" % parts,
              "var SCENES = [], at = 0;" + tail.rstrip("\n")]
    out = FOLDER / "film.html"
    out.write_bytes(("\r\n".join(lines) + "\r\n").encode("utf-8"))
    print("wrote", out, "with", len(found), "scenes")


if __name__ == "__main__":
    main()
