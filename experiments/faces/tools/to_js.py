"""to_js.py - the face mesh's topology and the cast's traced meshes as one JavaScript file for faces.js.

    python to_js.py <topology.json> <out faces_data.js> <mesh.json> [<mesh.json> ...]

Writes FACE_TOPOLOGY (loops and triangles, landmark numbers from MediaPipe's face mesh, Apache 2.0) and
FACE_MESHES (each traced face: the numbers it was averaged from, and its 478 points in head units).
"""
import json
import sys


def main():
    topology = json.load(open(sys.argv[1]))
    lines = [
        "// faces_data.js - the numbers faces.js draws from (written by the faces lab's to_js.py; do not edit by hand).",
        "// FACE_TOPOLOGY: MediaPipe's face mesh (Apache 2.0): ordered loops of its landmark numbers and its triangles.",
        "// FACE_MESHES: each face of the cast, the average of two or three faces traced from photographs of the north",
        "// (Wikimedia Commons, public domain or CC; see docs/kit/figures.md), as 478 points [x, y, z] in person()'s head",
        "// units: the eye line at y -277, the chin at -227, z toward the viewer. Only the numbers, never a picture.",
        "var FACE_TOPOLOGY = " + json.dumps({k: v for k, v in topology.items() if k != "tris"}, separators=(",", ":")) + ";",
        "FACE_TOPOLOGY.tris = " + json.dumps([list(t) for t in topology["tris"]], separators=(",", ":")) + ";",
        "var FACE_MESHES = {};",
    ]
    for path in sys.argv[3:]:
        mesh = json.load(open(path))
        flat = [round(v, 1) for p in mesh["points"] for v in p]
        lines.append("FACE_MESHES[%s] = {from: %s, smiling: %s, points: %s};" % (
            json.dumps(mesh["name"]), json.dumps(mesh["from"]), json.dumps(mesh.get("smiling", 0)), json.dumps(flat, separators=(",", ":"))))
    with open(sys.argv[2], "w", newline="\n") as out:
        out.write("\n".join(lines) + "\n")
    print(sys.argv[2], sum(len(l) for l in lines), "characters")


if __name__ == "__main__":
    main()
