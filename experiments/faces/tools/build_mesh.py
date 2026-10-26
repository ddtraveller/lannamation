"""build_mesh.py - one face of the cast, as the average of two or three traced faces, in the kit's head units.

    python build_mesh.py <faces.json> <name> <n> <n> [<n>] [--out mesh.json] [--symmetry 0.8]

Every traced face (trace.py) is turned to face the front, centred and scaled alike (a generalised Procrustes
fit in 3D over all of them), so faces from different photos and poses can be laid on one another. The faces
named by number are averaged, the average made "symmetry" of the way symmetric (its mirror image blended in),
and put in the head units person() draws in: the eye line at y -277, the chin at -227, the middle of the face
at x 0, and z toward the viewer, 0 at the depth of the face's sides by the ears (where the head turns).
Writes {name, from: [the faces' n], points: [[x, y, z] x 478]}. Only numbers leave here, never a picture.
"""
import argparse
import json

import numpy as np

STABLE = [33, 133, 362, 263, 168, 6, 197, 195, 5, 4, 1, 10, 151, 9, 152, 234, 454, 127, 356, 61, 291]
EYE_R = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
EYE_L = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466]
EYE_Y, CHIN_Y = -277.0, -227.0


def standard(points):
    """A face centred on its stable points and scaled so the eyes' middles are 1 apart; z toward the viewer."""
    p = np.array(points, dtype=float)[:478]
    p[:, 1] *= 1                       # y is down, as on the canvas
    p[:, 2] *= -1                      # MediaPipe's z grows away from the camera: turn it toward the viewer
    p -= p[STABLE].mean(axis=0)
    apart = np.linalg.norm(p[EYE_R].mean(axis=0) - p[EYE_L].mean(axis=0))
    return frontal(p / apart)


MIDLINE = [10, 151, 9, 8, 168, 6, 197, 195, 5, 4, 1, 2, 164, 0, 13, 14, 17, 18, 200, 199, 175, 152]


def frontal(face):
    """A face turned to look straight ahead by its own midline: the plane through its midline points gives the
    left-right axis, chin to forehead gives up."""
    mid = face[MIDLINE] - face[MIDLINE].mean(axis=0)
    across = np.linalg.svd(mid)[2][2]                 # the normal of the midline's plane
    if np.dot(across, face[263] - face[33]) < 0:
        across = -across                              # toward the face's left (its x grows that way)
    up = face[10] - face[152]
    up -= np.dot(up, across) * across
    up /= np.linalg.norm(up)
    toward = np.cross(across, -up)                    # y is down: x across, y down, z toward the viewer
    if np.dot(toward, face[1] - face[MIDLINE].mean(axis=0)) < 0:
        toward = -toward
    turn = np.array([across, -up, toward])
    return face @ turn.T


def kabsch(moving, fixed):
    """The rotation that lays the stable points of "moving" best on those of "fixed" (both centred)."""
    a, b = moving[STABLE], fixed[STABLE]
    u, _, vt = np.linalg.svd(a.T @ b)
    d = np.sign(np.linalg.det(u @ vt))
    return u @ np.diag([1, 1, d]) @ vt


def mirror_pairs(template):
    """For each landmark, the one where its mirror image (x to -x) falls: midline points are their own."""
    flipped = template * np.array([-1, 1, 1])
    distance = np.linalg.norm(template[:, None, :] - flipped[None, :, :], axis=2)
    return distance.argmin(axis=1)


def procrustes(faces, rounds=6):
    """All faces turned to a common front: returns (the faces so turned, their mean)."""
    mean = faces[0].copy()
    for _ in range(rounds):
        mean = 0.5 * (mean + mean[mirror_pairs(mean)] * np.array([-1, 1, 1]))   # the template faces straight ahead
        faces = [f @ kabsch(f, mean) for f in faces]
        mean = np.mean(faces, axis=0)
        mean -= mean[STABLE].mean(axis=0)
    return faces, mean


UPPER_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308]
UPPER_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291]
LOWER_OUTER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]
LOWER_INNER = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308]


def close_mouth(face):
    """A face traced with its mouth open, closed as a jaw closes, by how far apart the lips are at each place along
    the mouth (nothing at the corners, where they meet). The lips meet halfway: the upper lip comes down half the
    gap, and what lies below its inner line rises by the other half, fully from the lower lip's inner line down,
    fading beyond the corners and toward the sides of the jaw. So the lips keep their own thickness, nothing folds
    over at the corners, and a grin's lifted upper lip does not leave a frown (2026-10-26)."""
    out = face.copy()
    xs = np.array([face[i, 0] for i in UPPER_INNER])
    tops = np.array([face[i, 1] for i in UPPER_INNER])
    gaps = np.maximum(0, np.array([face[j, 1] - face[i, 1] for i, j in zip(UPPER_INNER, LOWER_INNER)]))
    if gaps.max() <= 0:
        return out
    bottoms = np.array([face[i, 1] for i in LOWER_OUTER])
    order = np.argsort(xs)
    xs, tops, gaps = xs[order], tops[order], gaps[order]
    bx = np.array([face[i, 0] for i in LOWER_OUTER])
    border = np.argsort(bx)
    bx, bottoms = bx[border], bottoms[border]
    most = gaps.max()
    ox = np.array([face[i, 0] for i in UPPER_OUTER])
    oorder = np.argsort(ox)
    ox, oys = ox[oorder], np.array([face[i, 1] for i in UPPER_OUTER])[oorder]
    mouth = xs[-1] - xs[0]
    side = abs(face[234, 0] - face[454, 0]) / 2
    for i, p in enumerate(face):
        x = np.clip(p[0], xs[0], xs[-1])
        gap = np.interp(x, xs, gaps)
        beyond = max(xs[0] - p[0], p[0] - xs[-1], 0)
        gap *= np.clip(1 - beyond / (0.35 * mouth), 0, 1)        # past a corner, the closing fades out
        below = np.clip((p[1] - np.interp(np.clip(p[0], bx[0], bx[-1]), bx, bottoms)) / (0.3 * mouth), 0, 1)
        gap += (most - gap) * below                              # under the lower lip the jaw rises as one piece
        if gap <= 0:
            continue
        top = np.interp(x, xs, tops)
        lateral = np.clip(1.3 - abs(p[0] - xs.mean()) / side, 0, 1)
        roof = np.interp(x, ox, oys)
        if p[1] < top:                                           # the upper lip comes down half the gap
            out[i, 1] += 0.5 * gap * np.clip((p[1] - roof) / max(top - roof, 1e-6), 0, 1) * lateral
        else:                                                    # what lies below rises the other half
            out[i, 1] -= 0.5 * gap * np.clip((p[1] - top) / gap, 0, 1) * lateral
    return out


def to_head(face, unit):
    """A front-facing standard face put in person()'s head units. Every face is scaled alike (its eyes are 1 apart
    in a standard face): "unit" is how far below the eyes the chin of the traced faces lies on average, made the
    kit's 50, so a round face stays round and a long one long, the chin near the kit's -227."""
    eyes = 0.5 * (face[EYE_R].mean(axis=0) + face[EYE_L].mean(axis=0))
    scale = (CHIN_Y - EYE_Y) / unit
    out = (face - eyes) * scale
    out[:, 0] -= out[[1, 4, 6, 152, 10, 168], 0].mean()
    out[:, 1] += EYE_Y
    out[:, 2] -= 0.5 * (out[234, 2] + out[454, 2])
    return out


def main():
    ask = argparse.ArgumentParser()
    ask.add_argument("faces")
    ask.add_argument("name")
    ask.add_argument("chosen", type=int, nargs="+")
    ask.add_argument("--out", default=None)
    ask.add_argument("--symmetry", type=float, default=0.8)
    ask.add_argument("--fit", type=int, nargs="*", default=None, help="faces the common front is fitted over (default: all)")
    ask.add_argument("--labels", default=None, help="labels.json: with --push, the women and men the push is measured from")
    ask.add_argument("--push", type=float, default=0, help="move the face this far along (mean woman - mean man); <0 toward the man")
    args = ask.parse_args()
    traced = {f["n"]: f for f in json.load(open(args.faces))}
    fit = args.fit if args.fit else sorted(traced)
    numbers = sorted(set(fit) | set(args.chosen))
    turned, mean = procrustes([standard(traced[n]["points"]) for n in numbers])
    by_n = dict(zip(numbers, turned))
    face = np.mean([by_n[n] for n in args.chosen], axis=0)
    if args.push:                                   # the measured difference between the traced women and men
        labels = json.load(open(args.labels))["faces"]
        def usable(n, sex):
            v = labels.get(str(n), {})
            return n in by_n and v.get("sex") == sex and "skip" not in v and "pose" not in v and v.get("age") in ("young", "adult")
        women = [by_n[n] for n in by_n if usable(n, "f")]
        men = [by_n[n] for n in by_n if usable(n, "m")]
        face = face + args.push * (np.mean(women, axis=0) - np.mean(men, axis=0))
        print("push %.2f along %d women - %d men" % (args.push, len(women), len(men)))
    pairs = mirror_pairs(mean)
    face = (1 - 0.5 * args.symmetry) * face + 0.5 * args.symmetry * face[pairs] * np.array([-1, 1, 1])
    def chin_below(f):
        f = close_mouth(f)
        return f[152, 1] - 0.5 * (f[EYE_R].mean(axis=0) + f[EYE_L].mean(axis=0))[1]
    unit = float(np.mean([chin_below(by_n[n]) for n in fit if n in by_n]))
    head = to_head(close_mouth(face), unit)
    smiling = float(np.mean([(traced[n]["shapes"].get("mouthSmileLeft", 0) + traced[n]["shapes"].get("mouthSmileRight", 0)) / 2
                             for n in args.chosen]))   # how much the faces smile in their photos (MediaPipe's blendshapes)
    result = {"name": args.name, "from": args.chosen, "push": args.push, "smiling": round(smiling, 2), "points": np.round(head, 2).tolist()}
    with open(args.out or args.name + ".json", "w") as out:
        json.dump(result, out)
    wide = head[454, 0] - head[234, 0]
    print(args.name, "from", args.chosen, "face width (234-454) %.1f, chin y %.1f, nose tip z %.1f, forehead (10) y %.1f"
          % (wide, head[152, 1], head[1, 2], head[10, 1]))


if __name__ == "__main__":
    main()
