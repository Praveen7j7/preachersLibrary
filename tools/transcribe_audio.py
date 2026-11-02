"""Transcribe IYF's audio lectures locally (whisper.cpp, no cloud, no Claude tokens).

For every manifest item with status "audio" (research/iyf-materials/manifest.json): download the file from its public
Drive link to .cache/audio/, run whisper-cli with the large-v3-turbo model (Hindi/English, language auto-detected),
save research/iyf-materials/<row>/<name>.transcript.txt, mark the item "transcribed", delete the audio. Resumable.

Transcripts are working notes: Sanskrit recitation comes out garbled, so verses are always taken from vedabase,
never from a transcript.

Usage: .venv/bin/python tools/transcribe_audio.py [--limit N] [row-id ...]
Needs: brew install whisper-cpp; model at .cache/whisper/ggml-large-v3-turbo-q5_0.bin
"""

import json
import os
import re
import subprocess
import sys
import time
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
MAN = os.path.join(ROOT, "research", "iyf-materials", "manifest.json")
MODEL = os.path.join(ROOT, ".cache", "whisper", "ggml-large-v3-turbo-q5_0.bin")
AUDIO = os.path.join(ROOT, ".cache", "audio")

args = sys.argv[1:]
limit = int(args[args.index("--limit") + 1]) if "--limit" in args else None
rows_wanted = {a for a in args if re.match(r"^[a-z0-9]+-\d+$", a)}

man = json.load(open(MAN))
row_of = {k: r for r, keys in man["rows"].items() for k in keys}
todo = [k for k, v in man["items"].items() if v["status"] == "audio"
        and (not rows_wanted or row_of.get(k) in rows_wanted)]
if limit:
    todo = todo[:limit]
print(f"{len(todo)} recordings to transcribe", flush=True)
os.makedirs(AUDIO, exist_ok=True)

for n, key in enumerate(todo, 1):
    item, row = man["items"][key], row_of[key]
    name = item.get("name") or key
    mp3 = os.path.join(AUDIO, f"{key}.audio")
    try:
        req = urllib.request.Request(f"https://drive.google.com/uc?export=download&id={key}",
                                     headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=300) as r, open(mp3, "wb") as f:
            if r.headers.get("Content-Type", "").startswith("text/html"):
                raise RuntimeError("not downloadable (private or too large for direct download)")
            f.write(r.read())
        base = os.path.join(ROOT, "research", "iyf-materials", row, re.sub(r"[^\w.\- ]+", "_", name)[:90] + ".transcript")
        os.makedirs(os.path.dirname(base), exist_ok=True)
        t0 = time.time()
        subprocess.run(["whisper-cli", "-m", MODEL, "-f", mp3, "-l", "auto", "-np", "-otxt", "-of", base],
                       check=True, capture_output=True)
        text = open(base + ".txt").read()
        item.update(status="transcribed", file=os.path.relpath(base + ".txt", ROOT), chars=len(text),
                    detail=f"whisper large-v3-turbo, {time.time() - t0:.0f}s")
        print(f"[{n}/{len(todo)}] {row} {name[:60]}: {len(text)} chars in {time.time() - t0:.0f}s", flush=True)
    except Exception as e:
        item["transcribeError"] = repr(e)[:200]
        print(f"[{n}/{len(todo)}] {row} {name[:60]}: FAILED {e!r}", flush=True)
    finally:
        if os.path.exists(mp3):
            os.remove(mp3)
        with open(MAN, "w") as f:
            json.dump(man, f, indent=1, ensure_ascii=False)
        time.sleep(2)
