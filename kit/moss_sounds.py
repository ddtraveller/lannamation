"""moss_sounds.py - the kit's sounds that a model makes: animal calls no free recording has, made by MOSS-SoundEffect.

    python moss_sounds.py --list                    the names, and the prompt each is made from
    python moss_sounds.py peafowl chick --out made  takes of those, into made/NAME_take.wav
    python moss_sounds.py --out made                takes of every one

MOSS-SoundEffect v2.0 (OpenMOSS-Team, Apache-2.0) turns a sentence into a sound: no recording is in what it makes,
and what it makes is free to use, so a film may carry it anywhere. It is used for a creature of the kit only when no
recording of it is free to use (public domain, CC0 or CC BY), or the free ones have other sounds over the animal; the
rest are fetched by sounds.py. Its seed changes nothing (the pipeline sets its own), so the takes of a sound are made
from small changes to its sentence (TAKES). A person picks the take, and it is kept in sounds/ as FLAC, with a
"file" row in sounds.py's FETCHED: the model is 11 GB and needs a GPU, too much to run again for each copy of the kit.

Needs a CUDA GPU with about 16 GB free, and the model's code: git clone https://github.com/OpenMOSS/MOSS-TTS, then
pip install -e its moss_soundeffect_v2 folder. On an NVIDIA DGX Spark (arm64, GB10) it runs in NVIDIA's own PyTorch
container, keeping its PyTorch (the pins of the model's repository would replace it):

    docker run --rm --gpus all --memory 48g --name moss-sfx -e HF_HOME=/work/hf -e TORCHDYNAMO_DISABLE=1 \\
      -v $PWD:/work -w /work nvcr.io/nvidia/pytorch:25.04-py3 bash -c '
        pip install -q einops safetensors transformers==4.57.1 diffusers==0.37.1 ftfy regex soundfile imageio randomname \\
          argbind pyloudnorm importlib-resources rich librosa pystoi flatten_dict markdown2 ffmpy &&
        pip install -q --no-deps descript-audiotools==0.7.2 torchaudio==2.7.0 julius torch-stoi &&
        pip install -q --no-deps -e MOSS-TTS/moss_soundeffect_v2 && pip uninstall -y -q flash-attn;
        python moss_sounds.py --out made'

(FlashAttention is taken out because it takes only half precision; the model then uses PyTorch's own attention.)
A 4-second sound takes about 29 s at 100 steps; the first run downloads the model.
"""
import argparse
import os
import time

# Each sound: the sentence it is made from, its seconds, and what it is for. Every sentence asks for the animal
# alone and close, with nothing behind it, as the rooster's crow that was picked did.
ALONE = (" Only this one animal, close to the microphone; absolutely no other birds, no insects, no wind, no water, "
         "no ambience and no echo: a completely silent background.")
# for wings, which must not bring a bird's voice with them
WINGS_ALONE = (" Absolutely no birdsong, no chirping, no calls, no insects, no wind, no ambience and no echo: a "
               "completely silent background.")
SOUNDS = {
    "peafowl": ("A green peafowl calls from the forest edge at dawn: a loud, deep, trumpeting two-note call, ki-wao, "
                "ki-wao, repeated three times, recorded close, silent background, no other birds.", 5,
                "the green peafowl's call (Pavo muticus): no free recording of it exists"),
    "chick": ("Two small baby chicks peeping, high soft cheep cheep cheep, recorded close in a quiet farmyard, "
              "silent background, no hens, no insects.", 4, "a chick's peeping: no clean free recording"),
    "tiger": ("A tiger roars once outdoors in an open forest, a deep, loud, rumbling roar, then breathes out." + ALONE, 4,
              "a tiger's roar, dry, outdoors (the free one sounds as if it is in a room)"),
    # the small birds whose free recordings are too faint, or have wind, engines or voices over them; each sentence
    # says the call as the field guides write it
    "sunbird": ("A tiny sunbird calls from a flowering bush: high, thin, metallic chips, tsip tsip tsip, then a short "
                "quick twittering song, recorded close, silent background.", 4,
                "the green-tailed sunbird's chips and twitter (Aethopyga nipalensis)"),
    "lapwing": ("A river lapwing on a sandbar gives its sharp, high, repeated alarm call, did-did-do-weet, did-did-"
                "do-weet, recorded close, with only a soft river behind it.", 6,
                "the river lapwing's alarm call (Vanellus duvaucelii); 6 s, so the call is not cut off"),
    "plover": ("A little ringed plover gives a clear, falling whistle, pee-oo, pee-oo, three times, recorded close on "
               "a riverbank, silent background.", 4, "the little ringed plover's whistle (Charadrius dubius)"),
    "pratincole": ("A single small pratincole gives soft rolling calls, prrip, prrip, and short tern-like chirps." + ALONE, 4,
                   "the small pratincole's rolling calls (Glareola lactea)"),
    # the free recordings of these have other birds, insects or wind over them (heard by the owner, 2026-10-23)
    "egret": ("A cattle egret gives a few short, low, croaking calls, rick-rack, rick-rack." + ALONE, 4,
              "the cattle egret's croak (Bubulcus coromandus)"),
    "barnowl": ("A barn owl gives one long, harsh, rasping screech, shreeee, hissing as it fades, then another." + ALONE, 5,
                "the barn owl's screech (Tyto javanica), like the free recording from Kerala the owner heard"),
    "avadavat": ("A tiny red avadavat finch gives high, thin, sweet whistles, teei teei, and a soft twittering song." + ALONE, 4,
                 "the red avadavat's whistles (Amandava amandava)"),
    "cat": ("A village cat meows twice, a clear, plaintive meow, meeow." + ALONE, 3, "a cat's meow"),
    # the new creatures of 2026-10-25 (lannabirds.js, taleanimals.js): a dove's wings, which no free recording has,
    # and beside the free recordings of four more, whose clean stretches were short, faint or had other birds over them
    # (a first sentence for the wings, "A dove bursts up from the ground ...", came out with birds chirping in every take)
    "dove-wings": ("The sound of a pigeon's wings only, and no voice: a sudden loud clatter of wings clapping together "
                   "as it takes off, then fast flapping that fades as it flies away." + WINGS_ALONE, 3,
                   "the spotted dove's wing claps as it takes off (Spilopelia chinensis)"),
    "dove": ("A spotted dove coos from a tree: a soft, mellow, rhythmic cooing, kroo-kroo-krooo, the last note the "
             "longest, said twice." + ALONE, 5, "the spotted dove's cooing (Spilopelia chinensis)"),
    "kingfisher-wt": ("A white-throated kingfisher gives its loud, laughing, whinnying rattle from a perch, a shrill, "
                      "falling kililililili." + ALONE, 4, "the white-throated kingfisher's laughing rattle (Halcyon smyrnensis)"),
    "kingfisher": ("A small common kingfisher flies past low, giving its shrill, high, piercing whistle, tsee, "
                   "tsee-tsee." + ALONE, 3, "the common kingfisher's high whistle (Alcedo atthis)"),
    "parakeet": ("A red-breasted parakeet gives loud, harsh, nasal screeches, kaink, kaink, from a treetop." + ALONE, 4,
                 "the red-breasted parakeet's screech (Psittacula alexandri)"),
    "toad": ("An Asian common toad calls at night: a long, rattling, purring trill, krrrrrrr, then again after a "
             "pause." + ALONE, 5, "the Asian common toad's trill (Duttaphrynus melanostictus)"),
}
# The small changes a sound's takes are made from: the sentence as written, then with each of these after it. A take is
# NAME_k.wav, k from 1, the k-th of these.
TAKES = ["", " A clean, isolated sound effect.", " Natural, as recorded in the wild.", " Studio quality sound effect.",
         " A field recording made very close, with a quiet background."]
# The takes the owner picked (2026-10-23), kept in sounds/ as FLAC: the sound's name, then its take's number.
KEPT = {"peafowl": [1], "sunbird": [1], "plover": [1, 3], "chick": [1], "egret": [1], "barnowl": [2], "pratincole": [5],
        "lapwing": [1], "avadavat": [1], "cat": [1], "tiger": [3],
        "dove-wings": [4], "dove": [2], "kingfisher-wt": [4], "kingfisher": [5], "parakeet": [3], "toad": [3]}
# Tried and not kept (the owner heard them, 2026-10-23): bats, Mrs Hume's pheasant (other birds behind every take),
# the great hornbill, the spot-billed duck and a pig; their sentences are gone from SOUNDS.
# And of 2026-10-25 (the owner heard them beside free recordings): a rhinoceros beetle's squeak and its flight, a
# goral's alarm (no free recording of one exists; the kit has none), the rice-field frog, the barking deer and the
# gibbon (free recordings were picked for those three); their sentences are gone from SOUNDS.


def main():
    ask = argparse.ArgumentParser(description="the kit's sounds that a model makes")
    ask.add_argument("names", nargs="*", help="which sounds (all when none is named)")
    ask.add_argument("--out", default="made", help="the folder the takes go into")
    ask.add_argument("--list", action="store_true", help="the names and their sentences")
    ask.add_argument("--steps", type=int, default=100)
    ask.add_argument("--cfg", type=float, default=4.0)
    given = ask.parse_args()
    if given.list:
        for name, (prompt, seconds, what) in SOUNDS.items():
            print("%-10s %d s  %s\n           %s" % (name, seconds, what, prompt))
        return
    names = given.names or list(SOUNDS)
    unknown = [n for n in names if n not in SOUNDS]
    if unknown:
        raise SystemExit("not a sound here: " + ", ".join(unknown))
    import torch
    from moss_soundeffect_v2 import MossSoundEffectPipeline
    os.makedirs(given.out, exist_ok=True)
    started = time.time()
    pipe = MossSoundEffectPipeline.from_pretrained("OpenMOSS-Team/MOSS-SoundEffect-v2.0", torch_dtype=torch.bfloat16, device="cuda")
    print("loaded in %.0f s" % (time.time() - started), flush=True)
    for name in names:
        prompt, seconds, what = SOUNDS[name]
        for k, more in enumerate(TAKES):
            made = time.time()
            audio = pipe(prompt=prompt + more, seconds=seconds, num_inference_steps=given.steps, cfg_scale=given.cfg)
            path = os.path.join(given.out, "%s_%d.wav" % (name, k + 1))
            pipe.save_audio(audio, path)
            print("%s in %.0f s" % (path, time.time() - made), flush=True)
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
