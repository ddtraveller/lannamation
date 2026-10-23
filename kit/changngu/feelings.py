"""feelings.py - what each line of the film of Chang Ngu feels, and its music.

    python changngu/feelings.py             # every scene's music, into out/changngu_music/: sNN.wav, and cues.json
    python changngu/feelings.py 4 9         # only scenes 4 and 9
    python changngu/feelings.py --film      # then the film's: out/changngu_music/film.wav, the scenes' joined

As the first tale's (maeng/feelings.py; the owner, 2026-10-19: "make sure the music always reflects the emotion of
the sentence"): each line (words.js) has a feeling (FEEL, below: one of score.py's), the kit's tale_music.py makes
each scene's music from them, and checks/score_check.py --film changngu hears it (out/changngu_music/plot.html).
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from tale_music import run  # noqa: E402

OUT = HERE.parent / "out" / "changngu_music"

# Each line's feeling, as its sentence has it.
FEEL = {
    # 1: the Mae Khong, Yonok, the title
    "C001": "wonder", "C002": "wonder", "C003": "calm", "C004": "wonder",
    # 2: the young king; the Black Khom take the city
    "C005": "royal", "C006": "tense", "C007": "tense", "C008": "sad",
    # 3: to Si Tuang; the crown comes off
    "C009": "sad", "C010": "tender", "C011": "calm", "C012": "sad",
    # 4: four tuang of gold
    "C013": "tense", "C014": "calm", "C015": "mystery", "C016": "calm", "C017": "sad",
    # 5: Thukkhita, born in hard times
    "C018": "tender", "C019": "tender", "C020": "hope",
    # 6: the novice turned away
    "C021": "calm", "C022": "calm", "C023": "tense", "C024": "tense", "C025": "tense", "C026": "sad",
    # 7: his wish on Doi Ku Kaeo; the light to the queen
    "C027": "calm", "C028": "mystery", "C029": "hope", "C030": "hope", "C031": "sad", "C032": "wonder",
    # 8: the queen's dream
    "C033": "mystery", "C034": "wonder", "C035": "tense", "C036": "tense", "C037": "hope", "C038": "tender",
    # 9: she longs for weapons
    "C039": "comic", "C040": "bustle", "C041": "joy",
    # 10: Phrom is born
    "C042": "tender", "C043": "wonder", "C044": "wonder", "C045": "joy",
    # 11: growing up with swords and spears
    "C046": "joy", "C047": "comic", "C048": "bustle", "C049": "calm",
    # 12: the deva in a dream
    "C050": "mystery", "C051": "wonder", "C052": "mystery", "C053": "wonder", "C054": "royal", "C055": "royal",
    "C056": "triumph",
    # 13: down to the river with the children
    "C057": "hope", "C058": "bustle", "C059": "bustle", "C060": "calm",
    # 14: two snakes float by
    "C061": "mystery", "C062": "fear", "C063": "fear", "C064": "tense", "C065": "tense", "C066": "fear",
    # 15: the third snake; he leaps; a white elephant
    "C067": "calm", "C068": "mystery", "C069": "hope", "C070": "hope", "C071": "tense", "C072": "bustle",
    "C073": "wonder",
    # 16: it will not come out: Khwan Thon
    "C074": "calm", "C075": "comic", "C076": "calm", "C077": "wonder", "C078": "bustle",
    # 17: the seer; the golden plate
    "C079": "calm", "C080": "mystery", "C081": "mystery", "C082": "bustle", "C083": "tender",
    # 18: ting, ting
    "C084": "joy", "C085": "wonder", "C086": "triumph",
    # 19: no more gold for the Khom; the golden pots
    "C087": "calm", "C088": "royal", "C089": "joy", "C090": "joy", "C091": "comic", "C092": "hope",
    # 20: three years; the Khom king's fury
    "C093": "bustle", "C094": "tense", "C095": "hope", "C096": "tense", "C097": "tense", "C098": "tense",
    # 21: Thung San Chai; the gate
    "C099": "triumph", "C100": "royal", "C101": "tense", "C102": "fear", "C103": "comic", "C104": "triumph",
    # 22: the chase; Indra's pity; the stone wall
    "C105": "bustle", "C106": "tender", "C107": "wonder", "C108": "calm", "C109": "calm",
    # 23: the elephant goes home into the hill
    "C110": "tender", "C111": "sad", "C112": "wonder", "C113": "mystery", "C114": "wonder",
    # 24: two brothers; the wedding; Wiang Chai Prakan
    "C115": "royal", "C116": "royal", "C117": "tender", "C118": "joy", "C119": "triumph",
    # 25: Chiang Saen today; the moral; the goodbye
    "C120": "calm", "C121": "wonder", "C122": "tender",
}

# A scene with no words has its feelings here, as cues: 26, the credits, warm and then glad toward the studio's name
# (the end is held from 131 s).
SCENE_FEEL = {26: [[0.0, "tender"], [124.0, "joy"]]}


if __name__ == "__main__":
    run(HERE, "C", FEEL, SCENE_FEEL, OUT, sys.argv[1:])
