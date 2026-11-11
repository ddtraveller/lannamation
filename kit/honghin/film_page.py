"""Write honghin/film.html: every scene of the film of Hong Hin one after another, with their words, as the White Eel's
film_page.py lays out its film. The scenes are read from the folder (sNN_name.js, each with its H{NN}_LONG, H{NN}_LINES
and its entry, function hhScene...), so the page is made again whenever a scene is added. Run: python film_page.py"""
import re
from pathlib import Path

FOLDER = Path(__file__).resolve().parent
LINK = ('<link href="https://fonts.googleapis.com/css2?family=Gelasio:ital,wght@1,400&family=Noto+Sans+Tai+Tham:wght@700'
        '&family=Noto+Sans+Thai:wght@700&family=Noto+Serif+Thai:wght@500;600;700&display=swap" rel="stylesheet">')
# Every kit module a scene of this film uses, in the order its scene pages load them (people.js last of the kit's, for
# the painted people), then the Chang Ngu and White Eel films' sets, whose places and helpers this film shares.
MODULES = ["oldcartoon", "backdrops", "naga", "beasts", "myth", "himmaphan", "cumulus", "highlands", "pieces", "night",
           "flora", "butterflies", "thicket", "pinewoods", "wildplaces", "scenery", "chiangsaen", "northbirds", "lannabirds",
           "taleanimals", "decorate", "ogre", "honghin", "weaving", "sabai", "sabai_finish", "credits", "people"]


def scenes():
    """[(number, file name, entry function)] for each scene file, in order."""
    found = []
    for path in sorted(FOLDER.glob("s[0-9][0-9]_*.js")):
        number = int(path.name[1:3])
        entry = re.findall(r"^function (hhScene\w+)\(t\)", path.read_text(encoding="utf-8"), re.M)
        assert entry, path.name + " has no hhScene entry"
        found.append((number, path.name, entry[-1]))
    assert [n for n, _, _ in found] == list(range(1, len(found) + 1)), "the scenes are not numbered 1 to N"
    return found


def main():
    template = (FOLDER.parent / "changngu" / "film.html").read_text(encoding="utf-8").replace("\r\n", "\n")
    head = template.split('<script src="style.js"></script>')[0].replace("changngu - the whole film", "honghin - the whole film")
    head = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?[^"]*" rel="stylesheet">', LINK, head)
    tail = template.split("var SCENES = [], at = 0;")[1]
    tail = tail.replace("CHANGNGU_WORDS", "HONGHIN_WORDS").replace("cngSubtitles", "hhSubtitles")
    found = scenes()
    lines = [head.rstrip("\n"), '<script src="style.js"></script>', "<script>var BEAT = 0.5;</script>"]
    lines += ['<script src="../%s.js"></script>' % m for m in MODULES]
    lines += ['<script src="words.js"></script>', '<script src="../changngu/sets.js"></script>',
              '<script src="../whiteeel/sets.js"></script>', '<script src="sets.js"></script>']
    lines += ['<script src="%s"></script>' % name for _, name, _ in found]
    parts = ", ".join("[H%02d_LONG, %s, H%02d_LINES]" % (n, entry, n) for n, _, entry in found)
    lines += ["<script>",
              "// The film of Hong Hin, its %d scenes one after another, with their words. Each scene is its own file and" % len(found),
              "// its own page (s01.html ... s%02d.html); this one only lays them end to end. Made by film_page.py." % len(found),
              "var PARTS = [%s];" % parts,
              "var SCENES = [], at = 0;" + tail.rstrip("\n")]
    out = FOLDER / "film.html"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("wrote", out, "with", len(found), "scenes")


if __name__ == "__main__":
    main()
