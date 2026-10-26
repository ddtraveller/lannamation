"""topology.py - the face mesh's loops and triangles, as landmark numbers, from MediaPipe's own lists.

    python -P topology.py <out.json>

Writes {"oval", "eyeR", "eyeL", "browR", "browL", "lipsOuter", "lipsInner", "irisR", "irisL": ordered loops of
landmark numbers, "tris": the mesh's triangles}. R and L are the person's own right and left (MediaPipe's
"right eye" is the one on the picture's left). The triangles are the 3-cliques of the tessellation's edges.
"""
import json
import sys
from collections import defaultdict

import mediapipe as mp

C = mp.tasks.vision.FaceLandmarksConnections


def pairs(connections):
    """A connection list as (start, end) pairs."""
    return [(c.start, c.end) for c in connections]


def loops(edges):
    """Edges that make one or more closed rings, as ordered rings of points."""
    nexts = defaultdict(list)
    for a, b in edges:
        nexts[a].append(b)
        nexts[b].append(a)
    seen, rings = set(), []
    for start in nexts:
        if start in seen:
            continue
        ring, before, here = [start], None, start
        seen.add(start)
        while True:
            onward = [n for n in nexts[here] if n != before and (n not in seen or (n == start and len(ring) > 2))]
            if not onward or onward[0] == start:
                break
            before, here = here, onward[0]
            ring.append(here)
            seen.add(here)
        rings.append(ring)
    return rings


def lips(edges):
    """The lips' list holds two rings, the outer and the inner: (outer, inner), the outer the longer about."""
    rings = sorted(loops(edges), key=len, reverse=True)
    return rings[0], rings[1]


def triangles(edges):
    """The 3-cliques of an edge list: each the three points of one triangle, smallest first."""
    near = defaultdict(set)
    for a, b in edges:
        near[a].add(b)
        near[b].add(a)
    found = set()
    for a, b in edges:
        for c in near[a] & near[b]:
            found.add(tuple(sorted((a, b, c))))
    return sorted(found)


def main():
    outer, inner = lips(pairs(C.FACE_LANDMARKS_LIPS))
    topology = {
        "oval": loops(pairs(C.FACE_LANDMARKS_FACE_OVAL))[0],
        "eyeR": loops(pairs(C.FACE_LANDMARKS_RIGHT_EYE))[0],
        "eyeL": loops(pairs(C.FACE_LANDMARKS_LEFT_EYE))[0],
        "browR": loops(pairs(C.FACE_LANDMARKS_RIGHT_EYEBROW))[0],
        "browL": loops(pairs(C.FACE_LANDMARKS_LEFT_EYEBROW))[0],
        "lipsOuter": outer, "lipsInner": inner,
        "irisR": loops(pairs(C.FACE_LANDMARKS_RIGHT_IRIS))[0],
        "irisL": loops(pairs(C.FACE_LANDMARKS_LEFT_IRIS))[0],
        "tris": triangles(pairs(C.FACE_LANDMARKS_TESSELATION)),
    }
    with open(sys.argv[1], "w") as out:
        json.dump(topology, out)
    for name, value in topology.items():
        print(name, len(value), value[:8] if name != "tris" else value[:3])


if __name__ == "__main__":
    main()
