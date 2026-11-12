"""feelings.py - what each line of the film of Hong Hin feels, and its music.

    python honghin/feelings.py             # every scene's music, into out/honghin_music/: sNN.wav, and cues.json
    python honghin/feelings.py 4 9         # only scenes 4 and 9
    python honghin/feelings.py --film      # then the film's: out/honghin_music/film.wav, the scenes' joined

As the earlier tales' (the owner, 2026-10-19: "make sure the music always reflects the emotion of the sentence"):
each line (words.js) has a feeling (FEEL, below: one of score.py's), the kit's tale_music.py makes each scene's music
from them, and checks/score_check.py --film honghin hears it.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from tale_music import run  # noqa: E402

OUT = HERE.parent / "out" / "honghin_music"

# Each line's feeling, as its sentence has it.
FEEL = {
    # 1: the ghouls come by night; the title
    "H001": "calm", "H002": "mystery", "H003": "fear", "H004": "sad", "H005": "wonder",
    # 2: the astrologers; the six wives afraid
    "H006": "royal", "H007": "calm", "H008": "tense", "H009": "wonder", "H010": "tense",
    # 3: the puppy; Indra's throne; the catch
    "H011": "tense", "H012": "fear", "H013": "tense", "H014": "fear", "H015": "mystery", "H016": "wonder",
    # 4: driven out
    "H017": "tense", "H018": "sad", "H019": "grief",
    # 5: the gardeners
    "H020": "tender", "H021": "tender", "H022": "calm", "H023": "hope",
    # 6: the boy in heaven
    "H024": "sad", "H025": "tender", "H026": "mystery",
    # 7: the stone swan
    "H027": "hope", "H028": "wonder", "H029": "triumph", "H030": "royal",
    # 8: mother
    "H031": "mystery", "H032": "tender", "H033": "sad", "H034": "tense", "H035": "joy", "H036": "tender",
    # 9: red seeds against gold
    "H037": "bustle", "H038": "tender", "H039": "comic", "H040": "tense", "H041": "triumph",
    # 10: the giantess under the palm
    "H042": "mystery", "H043": "fear", "H044": "tense", "H045": "comic", "H046": "triumph", "H047": "tense", "H048": "sad",
    # 11: the king's test; the river
    "H049": "royal", "H050": "comic", "H051": "tense", "H052": "wonder",
    # 12: the first giant king
    "H053": "wonder", "H054": "tender", "H055": "fear", "H056": "calm", "H057": "joy",
    # 13: the second and the third
    "H058": "tender", "H059": "tense", "H060": "wonder", "H061": "mystery",
    # 14: the ghoul city
    "H062": "mystery", "H063": "sad", "H064": "grief", "H065": "triumph", "H066": "fear", "H067": "triumph",
    # 15: the Hemmarat
    "H068": "fear", "H069": "tense", "H070": "triumph",
    # 16: the brothers' crime
    "H071": "wonder", "H072": "calm", "H073": "fear", "H074": "grief",
    # 17: the three wives, and Indra
    "H075": "grief", "H076": "tender", "H077": "tense", "H078": "wonder",
    # 18: the grandmother speaks
    "H079": "royal", "H080": "sad", "H081": "tense", "H082": "bustle", "H083": "joy",
    # 19: the truth
    "H084": "tense", "H085": "tense", "H086": "sad", "H087": "grief",
    # 20: Vimala's answer
    "H088": "royal", "H089": "sad", "H090": "tender", "H091": "hope",
    # 21: Hong Hin is crowned
    "H092": "wonder", "H093": "joy", "H094": "royal", "H095": "triumph", "H096": "tender",
}

# A scene with no words has its feelings here, as cues. None yet (the credits are still to make).
# A scene with no words has its feelings here, as cues: 22, the credits (2026-11-12), warm and then glad toward the
# studio's name, as the White Eel's.
SCENE_FEEL = {22: [[0.0, "tender"], [96.0, "joy"]]}


if __name__ == "__main__":
    run(HERE, "H", FEEL, SCENE_FEEL, OUT, sys.argv[1:])
