"""trace.py - find every face in the reference photos and keep its 478 points.

    python -P trace.py <model.task> <image dir> <out dir>

For each photo it looks for faces in the whole picture and in overlapping tiles
enlarged to 1024 px (faces in the old group photos are small), keeps one copy of
each face, and writes out/faces.json: for each face the photo, its box, the 478
landmarks in the photo's pixels (x, y, and z on the x scale) and the 52
blendshape scores. It also cuts each face to out/crops/<n>.jpg (256 px) for
sorting by eye. Nothing here is committed: the crops are of the photos.
"""
import json
import sys
from pathlib import Path

import mediapipe as mp
import numpy as np
from PIL import Image

TILE = 1024          # each tile is enlarged to this before the search
OVERLAP = 0.35       # tiles overlap by this much of their size


def landmarker(model):
    """A FaceLandmarker for still pictures that finds up to 30 faces."""
    vision = mp.tasks.vision
    options = vision.FaceLandmarkerOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=model),
        running_mode=vision.RunningMode.IMAGE, num_faces=30,
        min_face_detection_confidence=0.35, min_face_presence_confidence=0.35,
        output_face_blendshapes=True)
    return vision.FaceLandmarker.create_from_options(options)


def tiles(width, height):
    """Boxes (x0, y0, x1, y1) to search: the whole picture, then 2x2 and 3x3 overlapping tiles (and 5x5, 7x7 on a
    picture over 3000 px wide, an old group photograph)."""
    boxes = [(0, 0, width, height)]
    for count in (2, 3) + ((5, 7) if width > 3000 else ()):
        size_x = width / (count - (count - 1) * OVERLAP)
        size_y = height / (count - (count - 1) * OVERLAP)
        for row in range(count):
            for col in range(count):
                x0 = col * size_x * (1 - OVERLAP)
                y0 = row * size_y * (1 - OVERLAP)
                boxes.append((int(x0), int(y0), int(min(width, x0 + size_x)), int(min(height, y0 + size_y))))
    return boxes


def faces_in(finder, picture):
    """Every face found in a picture: list of (points as an (478, 3) array in the picture's pixels, blendshapes)."""
    found = []
    width, height = picture.size
    for x0, y0, x1, y1 in tiles(width, height):
        piece = picture.crop((x0, y0, x1, y1))
        scale = TILE / max(piece.size)
        piece = piece.resize((max(1, round(piece.size[0] * scale)), max(1, round(piece.size[1] * scale))), Image.LANCZOS)
        image = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.asarray(piece.convert("RGB")))
        result = finder.detect(image)
        for marks, shapes in zip(result.face_landmarks, result.face_blendshapes):
            points = np.array([[m.x * piece.size[0] / scale + x0, m.y * piece.size[1] / scale + y0, m.z * piece.size[0] / scale]
                               for m in marks])
            found.append((points, {s.category_name: round(s.score, 4) for s in shapes}))
    return found


def unique(found):
    """One copy of each face: of faces whose middles are nearer than a third of their width, keep the largest."""
    kept = []
    for points, shapes in sorted(found, key=lambda f: -np.ptp(f[0][:, 0])):
        middle, wide = points[:, :2].mean(axis=0), np.ptp(points[:, 0])
        if all(np.linalg.norm(middle - k[0][:, :2].mean(axis=0)) > wide / 3 for k in kept):
            kept.append((points, shapes))
    return kept


def main():
    model, folder, out = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
    (out / "crops").mkdir(parents=True, exist_ok=True)
    finder = landmarker(model)
    faces = []
    for photo in sorted(folder.glob("*.jpg")):
        picture = Image.open(photo).convert("RGB")
        for points, shapes in unique(faces_in(finder, picture)):
            x0, y0 = points[:, :2].min(axis=0)
            x1, y1 = points[:, :2].max(axis=0)
            pad = 0.35 * max(x1 - x0, y1 - y0)
            box = [int(x0 - pad), int(y0 - pad * 1.4), int(x1 + pad), int(y1 + pad * 0.6)]
            n = len(faces)
            picture.crop(box).resize((256, 256), Image.LANCZOS).save(out / "crops" / ("%03d.jpg" % n), quality=88)
            faces.append({"n": n, "photo": photo.name, "box": box, "wide": round(float(x1 - x0), 1),
                          "points": np.round(points, 2).tolist(), "shapes": shapes})
        print(photo.name, sum(1 for f in faces if f["photo"] == photo.name), "faces", flush=True)
    (out / "faces.json").write_text(json.dumps(faces))
    print(len(faces), "faces in all")


if __name__ == "__main__":
    main()
