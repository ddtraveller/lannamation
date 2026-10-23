"""feelings.py - what each line of the film of the creature with four ears and five eyes feels, and its music.

    python maeng/feelings.py                # every scene's music, into out/maeng_music/: sNN.wav, and cues.json
    python maeng/feelings.py 4 9            # only scenes 4 and 9
    python maeng/feelings.py --film         # then the film's: out/maeng_music/film.wav, the scenes' joined, with their calls

The owner, 2026-10-19: "Plot each scene musically against the emotion of each sentence and make sure the music
always reflects the emotion of the sentence." Each line (words.js) has a feeling (FEEL, below: one of score.py's);
the kit's tale_music.py makes each scene's music from them, as it does every tale's (its text says how), and
checks/score_check.py hears it (out/maeng_music/plot.html).
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from tale_music import run  # noqa: E402

OUT = HERE.parent / "out" / "maeng_music"

# Each line's feeling, as its sentence has it.
FEEL = {
    # 1: the mountain, the cave, the title
    "M001": "wonder", "M002": "wonder", "M003": "mystery", "M004": "wonder",
    # 2: the poor family; the mother passes away
    "M005": "tender", "M006": "tender", "M007": "tender", "M008": "sad", "M009": "sad", "M010": "grief", "M011": "sad",
    # 3: work for the headman, never a complaint
    "M012": "calm", "M013": "calm", "M014": "tender",
    # 4: the father's illness, his wish, his death
    "M015": "sad", "M016": "tender", "M017": "tender", "M018": "tender", "M019": "sad", "M020": "mystery",
    "M021": "tender", "M022": "grief", "M023": "grief",
    # 5: up the mountain with the rope; the snare at the cave
    "M024": "calm", "M025": "tense", "M026": "mystery", "M027": "calm",
    # 6: something caught: the creature
    "M028": "tense", "M029": "tense", "M030": "wonder", "M031": "wonder", "M032": "wonder", "M033": "tender",
    "M034": "tender", "M035": "joy",
    # 7: it will not eat; the ember
    "M036": "calm", "M037": "comic", "M038": "comic", "M039": "sleepy", "M040": "calm", "M041": "comic",
    "M042": "comic", "M043": "joy", "M044": "joy",
    # 8: gold
    "M045": "wonder", "M046": "joy", "M047": "calm", "M048": "joy", "M049": "tender",
    # 9: the king's test
    "M050": "royal", "M051": "royal", "M052": "royal", "M053": "royal", "M054": "royal", "M055": "royal", "M056": "comic",
    # 10: the golden trough, built in a night
    "M057": "hope", "M058": "hope", "M059": "wonder", "M060": "tender", "M061": "bustle", "M062": "wonder", "M063": "triumph",
    # 11: the king's morning
    "M064": "sleepy", "M065": "wonder", "M066": "royal", "M067": "tender", "M068": "joy",
    # 12: the wedding, the Righteous King
    "M069": "joy", "M070": "tender", "M071": "tender", "M072": "triumph",
    # 13: the creature goes home
    "M073": "mystery", "M074": "fear", "M075": "fear", "M076": "sad", "M077": "calm",
    # 14: the goodbye
    "M078": "tender", "M079": "joy",
}

# A scene with no words has its feelings here, as cues: 15, the credits, warm and then glad toward the studio's name.
SCENE_FEEL = {15: [[0.0, "tender"], [166.0, "joy"]]}


if __name__ == "__main__":
    run(HERE, "S", FEEL, SCENE_FEEL, OUT, sys.argv[1:])
