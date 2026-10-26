# Traced faces (experimental)

Faces for the kit's people traced from photographs of the north, in 3D, moved by their muscles, with the eye drawn
part by part, the brows hair by hair and the hair strand by strand. **Experimental: not part of the kit.** Nothing in
`kit/` loads it, the kit's files are unchanged, and the sync to krueng.ai does not copy this folder. A page that
wants it loads it after the kit (see `faces.html`); then a person whose look has `mesh` gets the traced head, and
every other person draws exactly as before.

Open `faces.html` in a browser (from this folder, so `../../kit/oldcartoon.js` is found): the hero film's first
woman, close up in full face and turned, with the kit's own hair for comparison, and small beside the kit's own face.

## How a face is made

1. **Trace.** `tools/fetch.py` downloads photographs of Lanna and Chiang Mai people from Wikimedia Commons (public
   domain or CC; no hill-tribe photographs, no book scans), at a width Commons keeps ready, slowly.
   `tools/trace.py` finds every face in them with MediaPipe's face landmarker (478 points in 3D, and 52 expression
   scores), searching enlarged tiles of the old group photographs, where the faces are small. Get the model first:
   `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`
   (Apache 2.0). Run it with `python -P`.
2. **Sort.** `tools/sheet.py` puts the traced faces on numbered sheets; `labels.json` records, by eye, each face's
   sex, age and pose, which faces are the same person (so an average never takes one person twice), and why a face
   was left out.
3. **Build.** `tools/build_mesh.py` turns every traced face to look straight ahead (by the plane of its own midline,
   then a Procrustes fit over all of them), closes an open mouth as a jaw closes (the lips meet halfway; the chin
   rises as one piece), averages the faces named, makes the result mostly symmetric, and puts it in the head units
   `person()` draws in, every face scaled by the distance between its eyes, so a round face stays round. It also
   records how much the faces smile in their photographs. `tools/to_js.py` writes `faces_data.js`; `tools/topology.py`
   the mesh's loops and triangles from MediaPipe's own lists.
4. **Draw.** `faces.js`: the mesh fitted to the kit's head; `faceFeminine()` (a look's `fem`, 0 to 1), which puts
   back the differences between women's and men's faces that MediaPipe's trace, leaning to its own average face,
   loses (a V jaw, a smaller, higher chin, cheeks drawn in a little, larger eyes, higher arched brows, narrower nose
   wings and mouth, a fuller upper lip); the muscles (`FACE_MUSCLES`, after Waters 1987: a sheet pulls the skin near
   it toward its bone, fading with the angle off its line and with distance; the rings round the eyes and the mouth
   squeeze; the jaw turns on its hinge), set by `feelingOf()` and `mouthAt()`, a traced smile counted in; the turn,
   by rotating the 3D points; the skin lit triangle by triangle, smoothly, painted small and blurred; the outline
   where the face turns away, a shade darker than the skin, never black. `faces_parts.js`: the eye (the white,
   shaded; the pink corner; the iris with its dark rim, fibres, collarette, pupil and two lights; the lid's edge;
   tapered lashes in two rows and clumps; the lid's fold by `lids`; eye shadow), the brows hair by hair, the nose,
   the lips and chin, the hairline (a soft peak, the roots thinning across it, baby hairs) and the hair strand by
   strand to the knot, its sheen by each strand's way against the light (Kajiya and Kay 1989).
   `faces_glue.js`: the way in, without changing the kit.

A look's keys: `mesh` (a name of `FACE_MESHES`), `meshStyle` (`inked`, `between`, `painted`), `fem` (0 to 1; a
face's own in `FACE_LOOKS`), `meshHair: "kit"` (the kit's own hair over the traced face).

## The faces here

`woman`: the average of traced faces 10, 41 and 15 (`labels.json`), the young women with the narrowest jaws and
calm faces. Her colours, lids and eye shadow are in `FACE_LOOKS`.

## Sources

Only the numbers of the traced points are here, never a picture.

- Face 41: *Dara Rasami + Entourage @ Bang Pa-In*, photograph by Erb Bunnag, about 1909, public domain.
  https://commons.wikimedia.org/wiki/File:Dara_Rasami_%2B_Entourage_@_Bang_Pa-In.jpg
- Face 10: *Chiang Mai (166)*, by Sasha India, CC BY 2.0.
  https://commons.wikimedia.org/wiki/File:Chiang_Mai_(166)_(28077101650).jpg
- Face 15: *Chiang Mai (170)*, by Sasha India, CC BY 2.0.
  https://commons.wikimedia.org/wiki/File:Chiang_Mai_(170)_(28325959116).jpg
- The mesh's topology (`FACE_TOPOLOGY`): MediaPipe's face mesh, Apache 2.0.
- Research on eyelids, ageing, hair and the dress of the north: a NotebookLM notebook of about 45 sources (the Thai
  eyelid crease, 40 to 80% of Asian eyes, 7.1 mm in Thai men; Southeast Asian faces wrinkling 10 to 20 years later;
  Asian hair the thickest, roundest and straightest).

## Not done

The other ages and the men; the cloth thread by thread; a face at the size of a figure in a crowd drawn more
simply (it draws everything at every size now); the kit's jasmine garland, which hangs from the knot at the back
of the crown, falls over the brow in full face.
