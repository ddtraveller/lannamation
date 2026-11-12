"""feelings.py - what each line of the film of the White Eel feels, and its music.

    python whiteeel/feelings.py             # every scene's music, into out/whiteeel_music/: sNN.wav, and cues.json
    python whiteeel/feelings.py 4 9         # only scenes 4 and 9
    python whiteeel/feelings.py --film      # then the film's: out/whiteeel_music/film.wav, the scenes' joined

As the first two tales' (maeng/feelings.py, changngu/feelings.py; the owner, 2026-10-19: "make sure the music always
reflects the emotion of the sentence"): each line (words.js) has a feeling (FEEL, below: one of score.py's), the
kit's tale_music.py makes each scene's music from them, and checks/score_check.py --film whiteeel hears it.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from tale_music import run  # noqa: E402

OUT = HERE.parent / "out" / "whiteeel_music"

# Each line's feeling, as its sentence has it.
FEEL = {
    # 1: Nong Lom today; the title
    "W000": "calm", "W001": "calm", "W002": "mystery", "W003": "wonder",
    # 2: the Brahman meets the prince
    "W004": "hope", "W005": "mystery", "W006": "royal", "W007": "tender", "W008": "mystery",
    # 3: the naga digs the moat; the city is named
    "W009": "wonder", "W010": "wonder", "W011": "royal", "W012": "triumph",
    # 4: forty-five kings
    "W013": "joy", "W014": "royal", "W015": "calm",
    # 5: the old widow, alone
    "W016": "sad", "W017": "sad", "W018": "grief",
    # 6: the white eel caught
    "W019": "mystery", "W020": "wonder", "W021": "bustle",
    # 7: the feast; her house dark
    "W022": "royal", "W023": "joy", "W024": "sad",
    # 8: the young man by her lamp
    "W025": "mystery", "W026": "tender", "W027": "calm", "W028": "calm", "W029": "tender", "W030": "sad",
    "W031": "mystery",
    # 9: down to the river
    "W032": "calm", "W033": "tense", "W034": "mystery",
    # 10: three roars
    "W035": "fear", "W036": "tense", "W037": "fear", "W038": "fear", "W039": "tense",
    # 11: morning water
    "W040": "sad", "W041": "grief", "W042": "tender",
    # 12: the village heads
    "W043": "tense", "W044": "sad", "W045": "calm", "W046": "calm", "W047": "wonder", "W048": "calm",
    # 13: we were wrong; Khun Lang; Wiang Prueksa
    "W049": "sad", "W050": "tender", "W051": "hope", "W052": "triumph",
    # 14: the marsh today; who was he; the moral
    "W053": "calm", "W054": "tender", "W055": "mystery", "W056": "mystery", "W057": "wonder", "W058": "tender",
}

# A scene with no words has its feelings here, as cues: 15, the credits, warm and then glad toward the studio's name
# (the end is held from 101 s).
SCENE_FEEL = {15: [[0.0, "tender"], [96.0, "joy"]]}


if __name__ == "__main__":
    run(HERE, "W", FEEL, SCENE_FEEL, OUT, sys.argv[1:])
