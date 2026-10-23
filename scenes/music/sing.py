"""Sing a lyric with ACE-Step 1.5 on the DGX Spark, one take per seed.

    docker exec acestep15 bash -c "cd /work/ACE-Step-1.5 && uv run python /work/jobs/sing.py /work/jobs/<job>.json"

The job file (JSON) holds: name, caption, lyrics_file (a path inside the container), language ("th"),
bpm, duration (seconds), seeds (a list), dit (e.g. "acestep-v15-xl-turbo"), lm (e.g. "acestep-5Hz-lm-1.7B"),
backend ("vllm" or "pt"). Models download on first use into /work/ACE-Step-1.5/checkpoints.
Each take goes to /work/out/<name>/<name>_<seed>.flac, with <name>_<seed>.json holding the job and the
model's own reading of the song (key, bpm, caption). Ends with exit code 0 when every take was written.
"""
import json
import pathlib
import shutil
import sys

PROJECT = "/work/ACE-Step-1.5"


def main():
    job = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
    lyrics = pathlib.Path(job["lyrics_file"]).read_text(encoding="utf-8")
    out = pathlib.Path("/work/out") / job["name"]
    out.mkdir(parents=True, exist_ok=True)

    from acestep.handler import AceStepHandler
    from acestep.inference import GenerationConfig, GenerationParams, generate_music
    from acestep.llm_inference import LLMHandler
    from acestep.model_downloader import ensure_dit_model, ensure_lm_model, ensure_main_model

    ckpt = pathlib.Path(PROJECT) / "checkpoints"
    print(ensure_main_model(ckpt), flush=True)
    print(ensure_dit_model(job["dit"], ckpt), flush=True)
    print(ensure_lm_model(job["lm"], ckpt), flush=True)

    dit = AceStepHandler()
    print(dit.initialize_service(project_root=PROJECT, config_path=job["dit"], device="cuda"), flush=True)
    lm = LLMHandler()
    print(lm.initialize(checkpoint_dir=str(ckpt), lm_model_path=job["lm"], backend=job.get("backend", "pt"),
                        device="cuda"), flush=True)

    written = 0
    for seed in job["seeds"]:
        params = GenerationParams(caption=job["caption"], lyrics=lyrics, vocal_language=job["language"],
                                  bpm=job["bpm"], duration=job["duration"], seed=seed,
                                  timesignature=job.get("timesignature", "4"), keyscale=job.get("keyscale", ""),
                                  inference_steps=job.get("steps", 8))
        config = GenerationConfig(batch_size=1, use_random_seed=False, seeds=[seed], audio_format="flac")
        result = generate_music(dit, lm, params, config, save_dir=str(out / "raw"))
        if not result.success:
            print("FAILED seed", seed, result.error, flush=True)
            continue
        audio = result.audios[0]
        dest = out / f"{job['name']}_{seed}.flac"
        shutil.copy(audio["path"], dest)
        meta = {k: v for k, v in audio.items() if k not in ("tensor", "path")}
        (out / f"{job['name']}_{seed}.json").write_text(
            json.dumps({"job": job, "model": meta}, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
        print("WROTE", dest, flush=True)
        written += 1
    sys.exit(0 if written == len(job["seeds"]) else 1)


if __name__ == "__main__":
    main()
