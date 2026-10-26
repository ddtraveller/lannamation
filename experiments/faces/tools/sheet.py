"""sheet.py - the traced faces' crops on numbered sheets, for sorting them by eye.

    python sheet.py <trace out dir> <sheet prefix> [--min 60]

Writes <prefix>_1.jpg, <prefix>_2.jpg ... (40 faces a sheet, 160 px each), each crop labelled with its number,
photo, the face's width in pixels, and two of its blendshape scores (smile, jaw open). Faces narrower than
--min pixels in their photo are left off (too small to trace well).
"""
import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw

SIDE, PER_ROW, PER_SHEET = 160, 10, 40


def main():
    ask = argparse.ArgumentParser()
    ask.add_argument("folder")
    ask.add_argument("prefix")
    ask.add_argument("--min", type=float, default=60)
    args = ask.parse_args()
    folder = Path(args.folder)
    faces = [f for f in json.loads((folder / "faces.json").read_text()) if f["wide"] >= args.min]
    for start in range(0, len(faces), PER_SHEET):
        group = faces[start:start + PER_SHEET]
        rows = (len(group) + PER_ROW - 1) // PER_ROW
        sheet = Image.new("RGB", (SIDE * PER_ROW, (SIDE + 30) * rows), "white")
        draw = ImageDraw.Draw(sheet)
        for i, face in enumerate(group):
            x, y = (i % PER_ROW) * SIDE, (i // PER_ROW) * (SIDE + 30)
            sheet.paste(Image.open(folder / "crops" / ("%03d.jpg" % face["n"])).resize((SIDE, SIDE)), (x, y))
            shapes = face["shapes"]
            draw.text((x + 3, y + SIDE + 2), "#%d  %s  w%d" % (face["n"], face["photo"], face["wide"]), fill="black")
            draw.text((x + 3, y + SIDE + 15), "smile %.2f jaw %.2f" % (
                (shapes.get("mouthSmileLeft", 0) + shapes.get("mouthSmileRight", 0)) / 2, shapes.get("jawOpen", 0)), fill="#444")
        sheet.save("%s_%d.jpg" % (args.prefix, start // PER_SHEET + 1), quality=88)
    print(len(faces), "faces on", (len(faces) + PER_SHEET - 1) // PER_SHEET, "sheets")


if __name__ == "__main__":
    main()
