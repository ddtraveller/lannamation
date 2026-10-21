"""dance_track.py - read a dancer's moves from a video with MediaPipe Pose, and write them as the
kit's poses: dance_track.js, a TRACK of [second, pose] the dance film plays.

    python -P dance_track.py dance.webm pose_landmarker_full.task dance_track.js 10 face_landmarker.task hand_landmarker.task

The model file is Google's pose_landmarker_full.task (storage.googleapis.com/mediapipe-models/
pose_landmarker/pose_landmarker_full/float16/latest/). The video is the reference the owner gave;
neither is in the repo. With a hand model as well (hand_landmarker.task, from the same place), each
hand's fingers: how far each is curled, read from the 21 points of the hand nearest each wrist.

Each frame gives the joints of the dancer. From them, for the kit's person():
  handA, handB   each wrist as a direction from its shoulder, in the person's units: A is the
                 arm on the picture's right (the dancer's left), B the one on the picture's left
                 (the torso, hip to shoulder, is 112 in the kit)
  bend           how far the torso leans from upright
  tilt           how far the head tilts from the torso
  sit            how bent the knees are (0 straight, 1 a deep half-sit)
  raise          [leg, how high, how far forward] when one foot is well above the other
  turn           how square to the camera the shoulders are (1 face on)
  shoulders      how far the line of the shoulders is tipped: above 0 when its end on the
                 picture's right is the lower one. (The kit tips the line of the hips the other
                 way by rule. Measured, this dancer's hips tipped the same way as her shoulders
                 more often than not: 36 of 115 clearly tipped poses were opposite.)
  fingersA, fingersB
                 five curls, 0 straight to 1 curled: the first finger, the middle, the next,
                 the little finger, then the thumb (from the hand model)
With a face model as well (face_landmarker.task, from the same place), the eyes: where the
irises look, blinks, raised brows, a smile, an open mouth, read from a crop round the face.
Also a few frames with the joints and irises drawn on them, to check the tracking by eye.

It needs opencv-python, mediapipe and numpy; run it with python -P, as above (-P keeps this folder off
the module path). Arguments: VIDEO POSE_MODEL OUT.js FPS [FACE_MODEL [HAND_MODEL]] (FPS: the frames a second
read from the video). It writes OUT.js, and check_N.jpg and face_N.jpg (frames marked to check by eye) in the
folder it is run from. It ends with exit code 0, or 1 when no dancer is found in any frame.
"""
import json
import math
import sys
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks import python as mpp
from mediapipe.tasks.python import vision

TORSO = 112.0                # the kit's torso: hip to shoulder, before size
NOSE, L_EAR, R_EAR = 0, 7, 8
L_SH, R_SH, L_EL, R_EL, L_WR, R_WR = 11, 12, 13, 14, 15, 16
L_HIP, R_HIP, L_KNEE, R_KNEE, L_ANK, R_ANK = 23, 24, 25, 26, 27, 28


def angle(a, b, c):
    """the angle at b, in degrees

    a, b, c: points, numpy arrays (x, y). e.g. angle(pts[L_HIP], pts[L_KNEE], pts[L_ANK])"""
    ba, bc = a - b, c - b
    cos = float(np.dot(ba, bc) / ((np.linalg.norm(ba) * np.linalg.norm(bc)) or 1e-6))
    return math.degrees(math.acos(max(-1, min(1, cos))))


def line_tip(pts, left, right, shoulder_max):
    """How far a line across the body is tipped, in radians: above 0 when its end on the picture's
    right is the lower one. "left" and "right" are the joints at its two ends, as the picture shows
    them. A body turned side-on has the two joints nearly one behind the other, and then a small
    difference in height would read as a steep line: so the line is never taken to be shorter
    across than half the widest the shoulders get.

    pts: the frame's landmarks (x, y in pixels). shoulder_max: the widest the shoulders get, in pixels.
    e.g. line_tip(pts, R_SH, L_SH, shoulder_max)"""
    across = max(abs(float(pts[right][0] - pts[left][0])), 0.5 * shoulder_max)
    down = float(pts[right][1] - pts[left][1])
    return round(max(-0.35, min(0.35, math.atan2(down, across))), 3)


def pose_of(pts, width, height, shoulder_max):
    """the kit's pose from one frame's landmarks (x, y in pixels)

    pts: the 33 landmarks, an array (33, 2). width, height: the frame's (not used). shoulder_max: the widest
    the shoulders get, in pixels. Gives back a dict: handA, handB, bend, tilt, sit, turn, shoulders, and raise
    when one foot is up (the keys in this file's docstring).
    e.g. pose_of(smooth[i], width, height, shoulder_max)"""
    sh = (pts[L_SH] + pts[R_SH]) / 2
    hip = (pts[L_HIP] + pts[R_HIP]) / 2
    torso = float(np.linalg.norm(sh - hip)) or 1.0
    k = TORSO / torso
    up = sh - hip                                    # hip to shoulder: upright is (0, -1)
    bend = math.atan2(up[0], -up[1])
    nose = pts[NOSE] - sh
    tilt = math.atan2(nose[0], -nose[1]) - bend
    knee_l = angle(pts[L_HIP], pts[L_KNEE], pts[L_ANK])
    knee_r = angle(pts[R_HIP], pts[R_KNEE], pts[R_ANK])
    sit = max(0.0, min(1.0, (172 - min(knee_l, knee_r)) / 70))
    # The kit's figure is drawn as the video shows the dancer: its arm A hangs from the shoulder on
    # the picture's right, which is the dancer's LEFT arm, and its arm B from the one on the
    # picture's left, her RIGHT. (Until 2026-10-12 these two were the other way round, so each arm
    # was drawn from the wrong shoulder and reached across the body most of the time.)
    pose = {
        "handA": [round(float((pts[L_WR][0] - pts[L_SH][0]) * k), 1), round(float((pts[L_WR][1] - pts[L_SH][1]) * k), 1)],
        "handB": [round(float((pts[R_WR][0] - pts[R_SH][0]) * k), 1), round(float((pts[R_WR][1] - pts[R_SH][1]) * k), 1)],
        "bend": round(max(-0.6, min(0.6, bend)), 3),
        "tilt": round(max(-0.5, min(0.5, tilt)), 3),
        "sit": round(sit, 2),
        "turn": round(max(0.0, min(1.0, abs(float(pts[L_SH][0] - pts[R_SH][0])) / shoulder_max)), 2),
        "shoulders": line_tip(pts, R_SH, L_SH, shoulder_max),
    }
    lift = float(pts[L_ANK][1] - pts[R_ANK][1]) * k       # positive: the right foot is higher
    if abs(lift) > 18:
        leg = 0 if lift > 0 else 1                        # the kit's leg 0 is on the picture's left: her right leg
        ankle, hipp = (pts[R_ANK], pts[R_HIP]) if lift > 0 else (pts[L_ANK], pts[L_HIP])
        pose["raise"] = [leg, round(min(70.0, abs(lift)), 1), round(float((ankle[0] - hipp[0]) * k), 1)]
    return pose




# ---------- the hands ----------
# A hand model gives 21 points on each hand it sees: the wrist, then four
# points up each finger (the thumb from its base to its tip). A finger's
# curl is how far its two outer joints bend, added, over three-quarters of
# a half turn; the thumb's over a little less, since it bends less.
WRIST = 0
FINGERS = [[5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20], [1, 2, 3, 4]]   # first, middle, next, little, thumb


def curl_of(pts, chain, full):
    """0 straight to 1 curled: the bends at the two outer joints, added

    pts: a hand's 21 points. chain: four point numbers up one finger (FINGERS). full: the bend, in degrees,
    that counts as fully curled. e.g. curl_of(hand, FINGERS[0], 135.0)"""
    a, b, c, d = (pts[i] for i in chain)
    bent = (180 - angle(a, b, c)) + (180 - angle(b, c, d))
    return max(0.0, min(1.0, bent / full))


def hands_of(hander, frame, pts, width, height):
    """the curls of each hand: {"A": [...] or None, "B": [...] or None}. A hand is small in a
    full-body frame, so each is looked for in a crop round its wrist, pushed on past the wrist the
    way the forearm points, and scaled up, as the face is.

    hander: a MediaPipe HandLandmarker. frame: the video frame (BGR). pts: the pose's landmarks in pixels.
    width, height: the frame's. e.g. hands_of(hander, frame, pts, width, height)"""
    found = {"A": None, "B": None}
    for name, elbow, wrist in (("A", L_EL, L_WR), ("B", R_EL, R_WR)):   # A: her left hand, on the picture's right
        forearm = pts[wrist] - pts[elbow]
        reach = float(np.linalg.norm(forearm)) or 40.0
        centre = pts[wrist] + forearm / reach * reach * 0.45
        size = max(80.0, reach * 1.7)
        x0, y0 = int(max(0, centre[0] - size / 2)), int(max(0, centre[1] - size / 2))
        x1, y1 = int(min(width, centre[0] + size / 2)), int(min(height, centre[1] + size / 2))
        crop = frame[y0:y1, x0:x1]
        if crop.size == 0:
            continue
        scale = max(1.0, 256.0 / max(1, crop.shape[1]))
        if scale > 1:
            crop = cv2.resize(crop, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
        result = hander.detect(image)
        best, best_far = None, None
        for marks in result.hand_landmarks:          # the hand whose own wrist is nearest the crop's wrist
            hand = np.array([[p.x, p.y, p.z] for p in marks])
            at = np.array([x0 + hand[WRIST][0] * crop.shape[1] / scale, y0 + hand[WRIST][1] * crop.shape[0] / scale])
            far = float(np.linalg.norm(at - pts[wrist]))
            if far < size * 0.4 and (best_far is None or far < best_far):
                best, best_far = hand, far
        if best is not None:
            found[name] = [round(curl_of(best, chain, 135.0 if n < 4 else 100.0), 2) for n, chain in enumerate(FINGERS)]
    return found


# ---------- the face ----------
# A face model gives, for each frame, how far the irises look in, out, up and
# down, how shut each eye is, how high the brows are, how wide the eyes,
# how much of a smile, how open the jaw: the "blendshapes". They become
# the kit's glance [across, down], blink, wonder, smile, and the mouth.

def face_box(pts, width, height):
    """a square round the face, from the pose's nose and ears

    Gives back (x0, y0, x1, y1) in pixels, inside the frame. e.g. face_box(pts, width, height)"""
    ears = float(np.linalg.norm(pts[L_EAR] - pts[R_EAR])) or 20.0
    size = max(60.0, ears * 3.2)
    cx, cy = float(pts[NOSE][0]), float(pts[NOSE][1]) - size * 0.1
    x0, y0 = int(max(0, cx - size / 2)), int(max(0, cy - size / 2))
    x1, y1 = int(min(width, cx + size / 2)), int(min(height, cy + size / 2))
    return x0, y0, x1, y1


def face_of(facer, frame, box):
    """the kit's face fields from one frame, or None when no face is found

    facer: a MediaPipe FaceLandmarker. frame: the video frame (BGR). box: (x0, y0, x1, y1), as face_box()
    gives. The dict has glance, blink, wonder, smile, mouth when it is open, and "_iris" (the two irises in
    pixels, for marking the check frames; not written to the track).
    e.g. face_of(facer, frame, face_box(pts, width, height))"""
    x0, y0, x1, y1 = box
    crop = frame[y0:y1, x0:x1]
    if crop.size == 0:
        return None
    scale = max(1.0, 320.0 / max(1, crop.shape[1]))
    if scale > 1:
        crop = cv2.resize(crop, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
    result = facer.detect(image)
    if not result.face_blendshapes:
        return None
    b = {c.category_name: c.score for c in result.face_blendshapes[0]}
    right_of_image = (b["eyeLookOutLeft"] + b["eyeLookInRight"]) / 2 - (b["eyeLookInLeft"] + b["eyeLookOutRight"]) / 2
    down = (b["eyeLookDownLeft"] + b["eyeLookDownRight"]) / 2 - (b["eyeLookUpLeft"] + b["eyeLookUpRight"]) / 2
    blink = (b["eyeBlinkLeft"] + b["eyeBlinkRight"]) / 2
    wonder = min(1.0, b["browInnerUp"] * 0.8 + (b["eyeWideLeft"] + b["eyeWideRight"]) / 2 * 0.8)
    smile = min(1.0, (b["mouthSmileLeft"] + b["mouthSmileRight"]))
    jaw = b["jawOpen"]
    face = {"glance": [round(right_of_image * 6, 1), round(down * 4, 1)], "blink": round(blink, 2),
            "wonder": round(wonder, 2), "smile": round(smile, 2)}
    if jaw > 0.12:
        face["mouth"] = {"open": round(min(1.0, (jaw - 0.12) * 2.5), 2), "wide": round(smile, 2), "round": 0}
    pts = result.face_landmarks[0]
    face["_iris"] = [(x0 + p.x * crop.shape[1] / scale, y0 + p.y * crop.shape[0] / scale) for p in (pts[468], pts[473])]
    return face


def main():
    """The command line (see this file's docstring): track the dancer frame by frame, smooth the joints over
    five frames, and write TRACK to the .js file. Fails with SystemExit when no dancer is found."""
    video, model, out, fps = sys.argv[1], sys.argv[2], Path(sys.argv[3]), float(sys.argv[4])
    face_model = sys.argv[5] if len(sys.argv) > 5 else None
    hand_model = sys.argv[6] if len(sys.argv) > 6 else None
    facer = vision.FaceLandmarker.create_from_options(vision.FaceLandmarkerOptions(
        base_options=mpp.BaseOptions(model_asset_path=face_model), running_mode=vision.RunningMode.IMAGE,
        num_faces=1, output_face_blendshapes=True, min_face_detection_confidence=0.4)) if face_model else None
    hander = vision.HandLandmarker.create_from_options(vision.HandLandmarkerOptions(
        base_options=mpp.BaseOptions(model_asset_path=hand_model), running_mode=vision.RunningMode.IMAGE,
        num_hands=2, min_hand_detection_confidence=0.3)) if hand_model else None
    faces, faces_found, last_pts = {}, 0, None
    hands, hands_found = {}, 0
    options = vision.PoseLandmarkerOptions(
        base_options=mpp.BaseOptions(model_asset_path=model),
        running_mode=vision.RunningMode.VIDEO, num_poses=1,
        min_pose_detection_confidence=0.4, min_tracking_confidence=0.4)
    cap = cv2.VideoCapture(video)
    native = cap.get(cv2.CAP_PROP_FPS) or 30
    width, height = int(cap.get(3)), int(cap.get(4))
    every = max(1, round(native / fps))
    frames, found, n = [], 0, 0
    with vision.PoseLandmarker.create_from_options(options) as marker:
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            if n % every:
                n += 1
                continue
            t = n / native
            image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            result = marker.detect_for_video(image, int(t * 1000))
            face = None
            if result.pose_landmarks:
                pts = np.array([[p.x * width, p.y * height] for p in result.pose_landmarks[0]])
                last_pts = pts
                if facer:
                    face = face_of(facer, frame, face_box(pts, width, height))
            elif facer and last_pts is not None:      # a close-up: no body, but a face
                face = face_of(facer, frame, (0, 0, width, height))
                pts = last_pts if face else None
            else:
                pts = None
            if face:
                faces[len(frames)] = face
                faces_found += 1
                if faces_found in (30, 300, 600, 740):   # faces with the irises marked, to check by eye
                    for ix, iy in face["_iris"]:
                        cv2.circle(frame, (int(ix), int(iy)), 4, (0, 0, 255), -1)
                    bx = face_box(pts, width, height)
                    cv2.imwrite("face_%d.jpg" % faces_found, frame[max(0, bx[1] - 20):bx[3] + 20, max(0, bx[0] - 20):bx[2] + 20])
            if pts is not None and hander and result.pose_landmarks:
                both = hands_of(hander, frame, pts, width, height)
                if both["A"] or both["B"]:
                    hands[len(frames)] = both
                    hands_found += 1
            if pts is not None:
                frames.append((t, pts))
                found += 1
                if found in (40, 200, 400, 700):          # a few frames with the joints drawn, to check by eye
                    for a, b in [(L_SH, R_SH), (L_SH, L_EL), (L_EL, L_WR), (R_SH, R_EL), (R_EL, R_WR), (L_SH, L_HIP),
                                 (R_SH, R_HIP), (L_HIP, R_HIP), (L_HIP, L_KNEE), (L_KNEE, L_ANK), (R_HIP, R_KNEE), (R_KNEE, R_ANK)]:
                        cv2.line(frame, tuple(pts[a].astype(int)), tuple(pts[b].astype(int)), (0, 255, 255), 3)
                    cv2.imwrite("check_%d.jpg" % found, frame)
            n += 1
    cap.release()
    print("frames looked at: %d, dancer found in %d (%.0f%%), %.1f seconds of video" % (
        (n + every - 1) // every, found, 100.0 * found / max(1, (n + every - 1) // every), n / native))
    if not frames:
        sys.exit("no dancer found")
    shoulder_max = float(np.percentile([abs(p[L_SH][0] - p[R_SH][0]) for _, p in frames], 95))
    # smooth each joint over five frames, so a missed finger or a blur does not twitch the pose
    pts_all = np.array([p for _, p in frames])
    smooth = pts_all.copy()
    for i in range(len(frames)):
        lo, hi = max(0, i - 2), min(len(frames), i + 3)
        smooth[i] = np.median(pts_all[lo:hi], axis=0)
    track = []
    for i, (t, _) in enumerate(frames):
        pose = pose_of(smooth[i], width, height, shoulder_max)
        if i in faces:
            pose.update({k: v for k, v in faces[i].items() if not k.startswith("_")})
        for name in ("A", "B"):                     # each hand's curls: the median over five frames,
            near = [hands[j][name] for j in range(i - 2, i + 3) if j in hands and hands[j][name]]
            if near:
                pose["fingers" + name] = [round(float(v), 2) for v in np.median(np.array(near), axis=0)]
            else:                                   # or, across a gap of up to a second, the line between the readings either side
                before = next((j for j in range(i - 1, max(-1, i - 11), -1) if j in hands and hands[j][name]), None)
                after = next((j for j in range(i + 1, min(len(frames), i + 11)) if j in hands and hands[j][name]), None)
                if before is not None and after is not None:
                    u = (i - before) / (after - before)
                    pose["fingers" + name] = [round(float(a + (b - a) * u), 2) for a, b in zip(hands[before][name], hands[after][name])]
        track.append([round(t, 2), pose])
    print("faces found in %d of those frames, hands in %d" % (len(faces), len(hands)))
    js = "// The dancer's moves, read from the reference video by dance_track.py (MediaPipe Pose),\n" \
         "// %d frames at %g a second: [second, pose] for the kit's poseAt().\n" % (len(track), fps) + \
         "var TRACK = " + json.dumps(track, separators=(",", ":")).replace("],[", "],\n[") + ";\n"
    out.write_text(js, encoding="utf-8")
    print("wrote", out, "with", len(track), "poses; sits: %.2f mean, raises in %d frames" % (
        np.mean([p["sit"] for _, p in track]), sum(1 for _, p in track if "raise" in p)))


if __name__ == "__main__":
    main()
