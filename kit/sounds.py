"""sounds.py - the kit's sounds: voices for its creatures, each made by howl.py from an outline, never recorded.

    python sounds.py                       # every sound, into out/sounds/: NAME.wav and NAME.json, all.wav, list.js
    python sounds.py maeng-angry           # one sound (or several names)
    python sounds.py --list                # the names, what each is for

Each made sound is an outline: how the pitch, the loudness and the mouth go over time (see howl.py), written here
as numbers, so it is the kit's own, free to use as the kit is. A few are fetched instead (FETCHED): recordings
their makers gave to everyone, each named with where it is from and its licence, downloaded by this file and
never kept in the repository.
Open sounds.html after making them to hear each one beside what it is for.

The creature with four ears and five eyes (myth.js, the film in maeng/) has one voice of many throats (the owner,
2026-10-19: "The pack and voice should be one thing"): its own low, rough howl with a pack's voices inside it,
higher and smoother, that start with it, follow its rise and fall a few notes above, and keep a little out of step
with it and with one another, so that they sound as one wild voice and not as wolves answering. Its moods are the
story's: the night on the mountain, the snare, the crowd, the pen at night, the embers, the way home.

It needs numpy, scipy and soundfile; the internet, for a fetched sound not downloaded yet (each is kept
in out/sounds/ after); ffmpeg, for one soundfile cannot read (m4a, mpga). It writes into out/sounds/ beside this
file: NAME.wav (mono, 16-bit, 44.1 kHz) for each sound, NAME.json for each made by howl.py, all.wav (every sound,
1.2 s apart, only when no name is given) and list.js (SOUND_LIST, read by sounds.html). It ends with exit code 0,
or 1 with a message for a name it does not know; a download or ffmpeg that fails stops it with an exception.
"""
import json
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

import numpy as np
import soundfile
from scipy.io import wavfile

from howl import RATE, chorus, howl

OUT = Path(__file__).resolve().parent / "out" / "sounds"

# The creature's own voice: low and rough (a big throat, a growl under the tone).
CREATURE = {"growl": 0.45, "breath": 0.12, "wobble": [5.2, 0.35], "size": 1.35}
# The pack's throats within its voice: how far above the creature's pitch each sings, how loud, how late (seconds).
THROATS = [(1.5, 0.42, 0.03), (1.78, 0.34, 0.08), (2.24, 0.28, 0.05), (2.67, 0.22, 0.11)]


def creature(seconds, pitch, loud, vowel, **more):
    """One outline of the creature's own voice (CREATURE's growl, breath, wobble and size), for howl.py.

    seconds: how long. pitch, loud, vowel: [[second, value], ...] as howl.py takes them. more: any other outline
    keys (seed, at, gain, or one of CREATURE's to change it). Gives back the outline, a new dict.
    e.g. creature(2.0, [[0, 150], [1, 300], [2, 120]], [[0, 0], [0.4, 1], [2, 0]], [[0, 0.2], [2, 0.6]], seed=3)"""
    voice = dict(CREATURE, seconds=seconds, pitch=pitch, loud=loud, vowel=vowel)
    voice.update(more)
    return voice


def many(lead, pack=1.0, rough=0.3):
    """One voice of many throats: the creature's own (lead), and the pack's within it, each following the lead's
    pitch a few notes higher, its loudness and its mouth, a little late, smoother (rough: how much of the growl
    they keep), and "pack" of their loudness (0 leaves the creature alone).

    lead: an outline, as creature() gives. pack: default 1.0. rough: 0 to 1, default 0.3. Gives back a list of
    outlines, the lead first, for chorus()'s "voices".
    e.g. {"voices": many(maeng_base()["voices"][0], pack=0.8), "cave": [2.0, 0.4]}"""
    voices = [dict(lead)]
    wobble = lead.get("wobble", [5, 0.3])
    for n, (above, gain, late) in enumerate(THROATS):
        voices.append(dict(lead, pitch=[[t, hz * above] for t, hz in lead["pitch"]], at=lead.get("at", 0) + late,
                           gain=lead.get("gain", 1) * gain * pack, growl=lead.get("growl", 0) * rough, size=0.85,
                           vowel=[[t, v * 0.5] for t, v in lead["vowel"]], seed=lead.get("seed", 1) * 10 + n,
                           wobble=[wobble[0] * (0.85 + 0.1 * n), wobble[1] * 0.8]))
    return voices


def maeng_base():
    """The creature's howl on the night mountain: a chorus outline (for howl.chorus), 4.6 s.

    e.g. chorus(maeng_base())"""
    lead = creature(4.6, [[0, 150], [0.5, 230], [1.2, 330], [2.4, 350], [3.2, 300], [4.0, 170], [4.6, 120]],
                    [[0, 0], [0.3, 0.6], [1.0, 1], [2.8, 0.95], [3.8, 0.5], [4.6, 0]],
                    [[0, 0.1], [1.0, 0.85], [2.6, 0.9], [3.6, 0.3], [4.6, 0]], seed=3, at=0, gain=1.0)
    return {"voices": many(lead), "cave": [2.2, 0.42], "seed": 5}


def maeng_angry():
    """Caught in the snare: three short roars, the last the biggest: a chorus outline.

    e.g. chorus(maeng_angry())"""
    def roar(at, gain, top, long, seed):
        """One roar's outline: at (its first second), gain (0 to 1), top (its highest pitch, hz), long (seconds), seed."""
        return creature(long, [[0, 110], [0.12, top], [long * 0.6, top * 0.92], [long, 90]],
                        [[0, 0], [0.06, 1], [long * 0.7, 0.85], [long, 0]], [[0, 0.6], [0.1, 1], [long, 0.4]],
                        growl=0.95, breath=0.35, wobble=[9, 0.8], size=1.2, seed=seed, at=at, gain=gain)
    roars = [roar(0.0, 0.8, 260, 0.7, 21), roar(0.95, 0.85, 290, 0.6, 22), roar(1.8, 1.0, 330, 1.4, 23)]
    return {"voices": [v for r in roars for v in many(r, pack=0.8, rough=0.7)], "cave": [0.9, 0.18], "seed": 6}


def maeng_afraid():
    """The crowd round its pen: four yelps breaking upward, then a thin wavering cry: a chorus outline.

    e.g. chorus(maeng_afraid())"""
    def yelp(at, gain, low, high, seed):
        """One yelp's outline, 0.34 s: at (its first second), gain (0 to 1), low and high (its pitches, hz), seed."""
        return {"seconds": 0.34, "pitch": [[0, low], [0.1, high], [0.34, low * 1.2]], "loud": [[0, 0], [0.04, 1], [0.34, 0]],
                "vowel": [[0, 0.5], [0.1, 0.8], [0.34, 0.2]], "growl": 0.1, "breath": 0.25, "wobble": [11, 0.5], "size": 1.05,
                "seed": seed, "at": at, "gain": gain}
    yelps = [yelp(0.0, 0.8, 200, 410, 31), yelp(0.42, 0.9, 225, 465, 32), yelp(0.8, 0.85, 215, 440, 33), yelp(1.3, 1.0, 240, 505, 34)]
    cry = creature(1.8, [[0, 420], [0.3, 560], [1.2, 480], [1.8, 300]], [[0, 0], [0.1, 0.9], [1.2, 0.7], [1.8, 0]],
                   [[0, 0.3], [0.4, 0.6], [1.8, 0.1]], growl=0.15, breath=0.3, wobble=[8, 0.7], size=1.1, seed=35, at=1.75, gain=0.9)
    return {"voices": [v for y in yelps for v in many(y, pack=0.9)] + many(cry, pack=0.9), "cave": [0.8, 0.15], "seed": 7}


def maeng_sad():
    """Alone in the pen at night: a slow falling howl that catches like a sob: a chorus outline, 5.4 s.

    e.g. chorus(maeng_sad())"""
    lead = creature(5.4, [[0, 260], [0.7, 300], [1.6, 270], [2.4, 230], [3.4, 200], [4.4, 160], [5.4, 120]],
                    [[0, 0], [0.5, 0.8], [1.3, 0.55], [1.5, 0.85], [2.6, 0.5], [2.8, 0.75], [3.9, 0.4], [4.1, 0.55], [5.4, 0]],
                    [[0, 0.15], [0.8, 0.5], [2.4, 0.35], [5.4, 0]], growl=0.2, breath=0.3, wobble=[3.6, 0.5], size=1.3, seed=41)
    return {"voices": many(lead, pack=0.7), "cave": [2.4, 0.45], "seed": 4}


def maeng_happy():
    """Eating the embers: three quick bouncing howls that rise at the end: a chorus outline.

    e.g. chorus(maeng_happy())"""
    def woo(at, low, high, seed):
        """One rising howl's outline, 0.7 s: at (its first second), low and high (its pitches, hz), seed."""
        return creature(0.7, [[0, low], [0.25, low * 0.9], [0.7, high]], [[0, 0], [0.08, 0.9], [0.55, 1], [0.7, 0]],
                        [[0, 0.1], [0.3, 0.6], [0.7, 0.9]], growl=0.05, breath=0.1, wobble=[6, 0.3], size=1.25,
                        seed=seed, at=at, gain=1.0)
    woos = [woo(0.0, 200, 300, 51), woo(0.75, 220, 340, 52), woo(1.5, 240, 400, 53)]
    return {"voices": [v for w in woos for v in many(w, pack=0.8, rough=0)], "cave": [1.0, 0.2], "seed": 8}


def maeng_home():
    """Running home into its cave: one long howl that starts low and lifts: a chorus outline, 6 s.

    e.g. chorus(maeng_home())"""
    lead = creature(6.0, [[0, 180], [0.8, 230], [1.8, 210], [2.8, 260], [3.8, 340], [5.0, 330], [6.0, 160]],
                    [[0, 0], [0.5, 0.7], [1.8, 0.6], [3.6, 1], [5.0, 0.9], [6.0, 0]],
                    [[0, 0.2], [1.8, 0.4], [3.6, 0.9], [5.2, 0.7], [6.0, 0]], growl=0.35, breath=0.15, seed=61, at=0, gain=1.0)
    return {"voices": many(lead, pack=1.1), "cave": [2.8, 0.5], "seed": 9}


# Two sounds of the village at night that no free recording had clean (2026-10-20: the takes found had speech or
# engines in them), made by the kit from numbers instead, not by howl.py: a painter of these gives back the sound.
def crickets():
    """Field crickets in the grass at night, a chorus of seven: each sings chirps of three or four pulses (a pulse
    16 ms of a tone near 4.6 kHz, one every 34 ms), two or three chirps a second, at its own pitch, pace and
    distance, a little unsteady; 20 s, so a scene can lay it end to end.

    Gives back the samples (a numpy array at RATE), peaking at 0.5; the same every time.
    e.g. crickets()"""
    seconds, rng = 20.0, np.random.default_rng(11)
    out = np.zeros(int(seconds * RATE))
    for n in range(7):
        tone, rate, gain = rng.uniform(4300, 5000), rng.uniform(2.0, 3.2), rng.uniform(0.25, 1.0)
        at = rng.uniform(0, 0.5)
        while at < seconds - 0.3:
            for k in range(int(rng.integers(3, 5))):  # the pulses of one chirp
                a = int((at + k * 0.034) * RATE)
                m = np.arange(int(0.016 * RATE))
                shape = np.sin(np.pi * m / len(m)) ** 2
                out[a:a + len(m)] += gain * shape * np.sin(2 * np.pi * tone * (a + m) / RATE)
            at += (1 / rate) * rng.uniform(0.85, 1.15)
    out += 0.004 * rng.standard_normal(len(out))      # the night air
    return 0.5 * out / np.abs(out).max()


def wind():
    """Wind high on a mountain at dawn: noise made soft and low (through low-passes at 350 Hz and 1100 Hz, mixed
    by the gust), swelling and falling in slow gusts, never quite still; 20 s, so a scene can lay it end to end
    (owner, 2026-10-21, for the studio's card high over the mountains: "wind and birdsong").

    Gives back the samples (a numpy array at RATE), peaking at 0.6; the same every time.
    e.g. wind()"""
    from scipy.signal import butter, sosfilt
    seconds, rng = 20.0, np.random.default_rng(23)
    n = int(seconds * RATE)
    t = np.arange(n) / RATE
    noise = rng.standard_normal(n)
    low = sosfilt(butter(2, 350, "low", fs=RATE, output="sos"), noise)
    mid = sosfilt(butter(2, 1100, "low", fs=RATE, output="sos"), noise)
    gust = np.clip(0.5 + 0.3 * np.sin(2 * np.pi * t / 7.3) + 0.2 * np.sin(2 * np.pi * t / 3.1 + 1.3), 0.05, 1)
    out = (low * (1 - 0.5 * gust) + 0.6 * mid * gust) * (0.35 + 0.65 * gust)
    return 0.6 * out / np.abs(out).max()


def mouse_squeak():
    """A mouse's squeaks: three short whistles, each rising then falling between 3.5 and 6.5 kHz, 50 to 80 ms.

    Gives back the samples, 0.9 s at RATE, peaking at 0.89.
    e.g. mouse_squeak()"""
    rng = np.random.default_rng(5)
    out = np.zeros(int(0.9 * RATE))
    for at, long, low, high in [(0.05, 0.06, 3800, 6200), (0.22, 0.05, 4200, 6500), (0.5, 0.08, 3500, 5600)]:
        m = np.arange(int(long * RATE)) / RATE
        pitch = low + (high - low) * np.sin(np.pi * m / long)
        wave = np.sin(2 * np.pi * np.cumsum(pitch) / RATE) + 0.2 * np.sin(4 * np.pi * np.cumsum(pitch) / RATE)
        a = int(at * RATE)
        out[a:a + len(m)] += wave * np.sin(np.pi * m / long) ** 1.5 * rng.uniform(0.7, 1)
    return 0.89 * out / np.abs(out).max()


# Every sound: its name, what makes its outline, and what it is for.
SOUNDS = {
    "maeng-base": (maeng_base, "the creature's howl, the night on the mountain: rises, holds high, falls away into the cave"),
    "maeng-angry": (maeng_angry, "caught in the snare: three short roars, the last the biggest, rough all through"),
    "maeng-afraid": (maeng_afraid, "the crowd round its pen: high yelps that break upward, then a thin wavering cry"),
    "maeng-sad": (maeng_sad, "alone in the pen at night: a slow howl that falls, catching like a sob"),
    "maeng-happy": (maeng_happy, "eating the embers: quick bouncing howls that rise at the end, no growl"),
    "maeng-home": (maeng_home, "running home into its cave: one long howl that starts low and lifts, its throats swelling"),
    "crickets": (crickets, "field crickets in the grass at night, seven of them chirping, 20 s to lay end to end"),
    "mouse-squeak": (mouse_squeak, "a mouse's three high squeaks, for the mice along a wall"),
    "wind": (wind, "wind high on a mountain at dawn, soft and low, in slow gusts, 20 s to lay end to end"),
}
MADE = ("crickets", "mouse-squeak", "wind")     # the ones made from numbers, not by howl.py

# Sounds the kit does not make but fetches: recordings whose makers gave them to everyone (public domain, or a
# licence that lets the kit use them, named here with them), each from where it lives, cut if a part is wanted.
# Nothing of them is kept in the repository: python sounds.py fetches them, as it makes the others.
TOKAY = "https://upload.wikimedia.org/wikipedia/commons/9/91/Mating_call_of_a_male_Tokay_gecko_%28Gekko_gecko%29.ogg"
TOKAY_FROM = ("Richard Ling, 22 April 2007, on the bank of the Mekong north of Huay Xai, Bokeo, Laos; public domain "
              "(Wikimedia Commons: File:Mating_call_of_a_male_Tokay_gecko_(Gekko_gecko).ogg)")
FETCHED = {
    "tokay-call": {"url": TOKAY, "cut": None, "from": TOKAY_FROM,
                   "what": "a tokay gecko calling at nightfall, recorded: a cackle, then five to-kays (29 s)"},
    "tokay": {"url": TOKAY, "cut": [10.8, 24.0], "from": TOKAY_FROM,
              "what": "the tokay's five to-kays, cut from that recording, for a gecko on a wall at night"},
    "tokay-two": {"url": TOKAY, "cut": [10.8, 15.0], "from": TOKAY_FROM,
                  "what": "two of the tokay's to-kays, cut from that recording: the last sound of the film (2026-10-20)"},
}
# The village's animals and the day and night around them (owner, 2026-10-20: "Do a round of sounds research for the
# video and try to find sounds for the story for animals and birds that appear in it such as with the gecko. Add some
# cicadas singing and crickets at night", and "Make sure sounds get added to the kit"). Each take was chosen from
# several, then heard through an AudioSet classifier (AST) two seconds at a time, and cut where it hears only the
# animal (no speech, no engine): the stretches are those. A tree cricket's trill from Doi Suthep was
# heard as a fire alarm, and is not here: the kit's own crickets (above) sing the nights. A bed (cicadas, frogs) lies under a
# scene, laid end to end for as long as the scene asks; "rms" brings a bed to a steady level (dB), where the others
# are brought to the same peak. A CC BY recording's maker is named in a film that uses it (its credits).
COMMONS = "https://upload.wikimedia.org/wikipedia/commons/"
INAT = "https://static.inaturalist.org/sounds/"
FETCHED.update({
    "hens": {"url": COMMONS + "d/d6/Chickens_demanding_food.ogg", "cut": [6.0, 11.2],
             "from": 'alys, "Chickens demanding food"; public domain (Wikimedia Commons: File:Chickens_demanding_food.ogg)',
             "what": "hens clucking in a yard, wanting their food (5 s)"},
    "hen-cackle": {"url": COMMONS + "4/44/Hen_announcing_shes_lain_an_egg.ogg", "cut": None,
                   "from": 'alys, "Hen announcing she\'s lain an egg"; public domain (Wikimedia Commons)',
                   "what": "a hen's cackle when she has laid an egg (9 s)"},
    "rooster-crow": {"url": INAT + "383475.wav", "cut": [0.0, 3.6],
                     "from": "Wich'yanan L., red junglefowl, Kaeng Krachan, Phetchaburi, Thailand; CC BY 4.0 "
                             "(iNaturalist observation 110186322)",
                     "what": "a rooster's crow: the red junglefowl, the village rooster's wild kin, in a Thai forest"},
    "buffalo": {"url": INAT + "1241617.mpga", "cut": [14.0, 16.6],
                "from": "Ashwin A., water buffalo, Aluva, Kerala, India; CC BY 4.0 (iNaturalist observation 249871642)",
                "what": "a water buffalo's low call"},
    "elephant-trumpet": {"url": COMMONS + "4/40/Elephant_voice_-_trumpeting.ogg", "cut": None,
                         "from": 'Thagavaluzhavan (தகவலுழவன்), "Elephant voice - trumpeting"; CC0 (Wikimedia Commons)',
                         "what": "an elephant's short trumpet (1.4 s)"},
    "horse": {"url": COMMONS + "d/db/Wiehern.ogg", "cut": None,
              "from": 'Hü., "Wiehern"; public domain (Wikimedia Commons: File:Wiehern.ogg)',
              "what": "a horse's whinny (2.3 s), for the pack horses of a caravan"},
    "magpie": {"url": INAT + "828421.wav", "cut": [2.0, 7.2],
               "from": "red-billed blue magpie, Sham Shui Po, Hong Kong; CC0 (iNaturalist observation 187003410)",
               "what": "the red-billed blue magpie's calls"},
    "dog": {"url": INAT + "1346356.m4a", "cut": [16.0, 24.0],
            "from": "domestic dog, Jiufengshan, Ningbo, China; CC0 (iNaturalist observation 266621147)",
            "what": "a village dog barking"},
    "flock": {"url": COMMONS + "e/e9/2018-10-10_kreisende_stare.ogg", "cut": [12.0, 24.0],
              "from": 'Gunter Königsmann, "2018-10-10 kreisende Stare"; CC BY 4.0 (Wikimedia Commons)',
              "what": "a flock of birds wheeling overhead, wings and calls (12 s)"},
    "frogs": {"url": "https://archive.org/download/aporee_38387_43891/NochmehrKlapperfroschatmoChomThongbeiPuhAnna1708200132.mp3",
              "cut": [66.0, 92.0], "rms": -24,
              "from": "golo.foellmer, frogs at a pond and rice field, Chom Thong, Chiang Mai; Public Domain Mark "
                      "(radio aporee ::: maps, archive.org aporee_38387_43891)",
              "what": "the frogs of the rice fields of Chiang Mai at night, a bed (26 s)"},
    "cicadas": {"url": INAT + "1818207.wav", "cut": [20.0, 43.5], "rms": -24,
                "from": "Wich'yanan (Jay) Limparungpatthanakij, cicadas, Ban Luang, Chom Thong, Chiang Mai; CC BY 4.0 "
                        "(iNaturalist observation 344470233)",
                "what": "cicadas singing in the trees by day, Chiang Mai, a bed (23 s)"},
    # A songbird of the north's forests for the studio's card (owner, 2026-10-21: "At the end of the video do two bird
    # calls like the way the tokay calls were but with a nice sounding bird call from a northern thai bird"). Of ten
    # CC BY recordings of the shama in Thailand, this was the clearest; the one from Mae Chaem was too faint.
    "shama": {"url": INAT + "1016066.wav", "cut": [17.15, 20.5],
              "from": "Utain Pummarin, white-rumped shama, Wang Saphung, Loei, Thailand; CC BY 4.0 "
                      "(iNaturalist observation 213325298)",
              "what": "the white-rumped shama (นกกางเขนดง) singing twice: fluted notes, then a bright whistle rising (3 s)"},
})


def fetch(name, out):
    """A fetched sound: the recording downloaded once (kept in out/sounds/ under its own name), cut, as a WAV.

    name: a key of FETCHED. out: the folder, a Path. It writes out/NAME.wav (mono, at RATE, faded 0.05 s at each
    end; a bed brought to its "rms" level, the others to a peak of 0.89) and gives back its samples.
    Fails with urllib's errors when the download fails, CalledProcessError when ffmpeg cannot read it.
    e.g. fetch("tokay", OUT)"""
    one = FETCHED[name]
    source = out / one["url"].rsplit("/", 1)[1].replace("%28", "(").replace("%29", ")")
    if not source.exists():
        request = urllib.request.Request(one["url"], headers={"User-Agent": "lannamation-kit/1.0 (sounds.py)"})
        source.write_bytes(urllib.request.urlopen(request, timeout=60).read())
    try:
        sound, rate = soundfile.read(str(source), always_2d=True)
    except (RuntimeError, soundfile.LibsndfileError):   # what soundfile cannot read (m4a, an mp3 called .mpga): ffmpeg reads it
        with tempfile.TemporaryDirectory() as scratch:
            plain = Path(scratch) / "plain.wav"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(source), str(plain)], check=True)
            sound, rate = soundfile.read(str(plain), always_2d=True)
    sound = sound.mean(axis=1)
    if one["cut"]:
        sound = sound[int(one["cut"][0] * rate):int(one["cut"][1] * rate)]
    if rate != RATE:                                 # to the kit's rate, by plain interpolation (both are speech-band sounds)
        sound = np.interp(np.arange(int(len(sound) * RATE / rate)) * rate / RATE, np.arange(len(sound)), sound)
    fade = int(0.05 * RATE)
    sound[:fade] *= np.linspace(0, 1, fade)
    sound[-fade:] *= np.linspace(1, 0, fade)
    if one.get("rms"):                               # a bed: a steady level, its peaks kept under 0.89
        sound = sound * min(10 ** (one["rms"] / 20) / (np.sqrt(np.mean(sound ** 2)) or 1), 0.89 / (np.abs(sound).max() or 1))
    else:
        sound = 0.89 * sound / (np.abs(sound).max() or 1)
    wavfile.write(str(out / (name + ".wav")), RATE, (sound * 32767).astype(np.int16))
    return sound


def make(name, out):
    """Make one sound by its name and write it into out: its samples, a numpy array at RATE.

    name: a key of SOUNDS or FETCHED. out: the folder, a Path. It writes out/NAME.wav, and out/NAME.json (the
    outline) for a sound howl.py makes. A name in neither is a KeyError.
    e.g. make("maeng-sad", OUT)"""
    if name in FETCHED:
        return fetch(name, out)
    outline = SOUNDS[name][0]()
    if name in MADE:                                 # made from numbers by its painter: the sound itself
        wavfile.write(str(out / (name + ".wav")), RATE, (outline * 32767).astype(np.int16))
        return outline
    sound = chorus(outline) if "voices" in outline else howl(outline)
    (out / (name + ".json")).write_text(json.dumps(outline, indent=1), encoding="utf-8")
    wavfile.write(str(out / (name + ".wav")), RATE, (sound * 32767).astype(np.int16))
    return sound


def main():
    """The command line: sounds.py [NAME...] | --list. Makes the sounds named (every one when none is), writes
    all.wav when none is named, and list.js. Fails with SystemExit for a name it does not know."""
    args = sys.argv[1:]
    every = dict({n: what for n, (_, what) in SOUNDS.items()}, **{n: f["what"] for n, f in FETCHED.items()})
    if "--list" in args:
        for name, what in every.items():
            print("%-14s %s%s" % (name, what, "  [fetched: %s]" % FETCHED[name]["from"] if name in FETCHED else ""))
        return
    names = args or list(every)
    unknown = [n for n in names if n not in every]
    if unknown:
        sys.exit("no sound called %s; python sounds.py --list" % ", ".join(unknown))
    OUT.mkdir(parents=True, exist_ok=True)
    reel, gap, made = [], np.zeros(int(1.2 * RATE)), {}
    if not args:                                     # the sheet lists what was made before, too
        made = {n: np.zeros(0) for n in every if (OUT / (n + ".wav")).exists()}
    for name in names:
        sound = made[name] = make(name, OUT)
        print("%-14s %5.2f s  %s" % (name, len(sound) / RATE, OUT / (name + ".wav")))
        reel += [sound, gap]
    if not args:                                     # all of them, one after another, to hear together
        wavfile.write(str(OUT / "all.wav"), RATE, (np.concatenate(reel) * 32767).astype(np.int16))
        print("all.wav: every sound, %.1f s apart" % 1.2)
    listed = [{"name": n, "what": every[n], "seconds": round(len(made[n]) / RATE, 2),
               "from": FETCHED[n]["from"] if n in FETCHED else "made by the kit from numbers in sounds.py" if n in MADE
               else "made by howl.py from its outline in sounds.py"} for n in made]
    (OUT / "list.js").write_text("var SOUND_LIST = %s;\n" % json.dumps(listed, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
