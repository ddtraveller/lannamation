// say.mjs - speak lines in Kam Mueang with the voice of the Kam Mueang Voice extension, one WAV a line.
//
//     node say.mjs <model folder> <lines.json> <out folder>
//
// The voice is the one the extension speaks with: Meta's MMS Northern Thai (facebook/mms-tts-nod,
// CC BY-NC 4.0), run by transformers.js the way the extension runs it. The model folder is the
// extension's own model/ (in krueng.ai/downloads/kammuang_voice_chrome.zip, unzipped), and
// transformers.js comes from "npm install" beside this file (package.json pins 4.3.1, as the
// extension does). lines.json is a list of [name, text]; each text, Kam Mueang in Thai script, is
// spoken to <out folder>/<name>.wav, 16 kHz mono. The voice draws its timing from noise, so the same
// line is not quite the same twice: keep the files once they are made.
import fs from "node:fs";
import path from "node:path";
import { env, pipeline } from "@huggingface/transformers";

const [MODELS, LINES, OUT] = process.argv.slice(2);

function wav(samples, rate) {
  const pcm = Buffer.alloc(44 + samples.length * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + samples.length * 2, 4); pcm.write("WAVE", 8);
  pcm.write("fmt ", 12); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(rate, 24); pcm.writeUInt32LE(rate * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36); pcm.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i += 1) pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767))), 44 + i * 2);
  return pcm;
}

env.allowRemoteModels = false;
env.localModelPath = MODELS;
const tts = await pipeline("text-to-speech", "mms-tts-nod", { dtype: "fp32" });   // full precision, the extension's default
fs.mkdirSync(OUT, { recursive: true });
for (const [name, text] of JSON.parse(fs.readFileSync(LINES, "utf8"))) {
  const out = await tts(text);
  fs.writeFileSync(path.join(OUT, name + ".wav"), wav(out.audio, out.sampling_rate));
  console.log(`${name}  ${(out.audio.length / out.sampling_rate).toFixed(2)} s`);
}
