"""fetch.py - download the chosen Commons photos, gently, at a standard thumbnail width.

    python fetch.py <commons_list.json> <out dir>

Keeps the photos of Lanna and Chiang Mai people from the listing (no hill tribes, no book scans), writes
<out>/../selected.json (title, licence, page, file name) and each photo as <out>/NNN.jpg, 1920 wide at most
(a width Commons keeps ready). A photo already there is left alone; a failed one leaves no file.
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

KEEP = re.compile(r"Dara|Rachaya|Vimolnaka|Goods carriers|Siam 1904|ชาวลับแล|เจ้าลดาคำ|Erb Bunnag|Thai dancer Chiang Mai|"
                  r"Thai traditional costumes Chiang Mai|Schoolgirl outside|Trio of Schoolboys|Girl in Tuk-Tuk|Boy in Market|"
                  r"Man Weaving|Woman at Riverside|Old men in Chiang Mai|Chiang Mai \(\d+\)|Chiang Mai, Thailand \(|"
                  r"Thailand \(2|Thailand \(1|Khum Khantoke|Doormen Khun Ta|Festival - Chiang|Kaew Nawarat|Kawilawong|"
                  r"ถนนท่าแพ|Songkran-Festival|Chiangmai-market2|201704061304")
AGENT = {"User-Agent": "lannamation-research/1.0 (faces study; https://github.com/ddtraveller/lannamation)"}


def main():
    listing, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    chosen = [o for o in json.loads(listing.read_text(encoding="utf-8"))
              if KEEP.search(o["title"]) and o["title"].lower().endswith((".jpg", ".jpeg", ".png"))]
    for n, o in enumerate(chosen):
        o["file"] = "%03d.jpg" % n
    (out.parent / "selected.json").write_text(json.dumps(chosen, ensure_ascii=False, indent=1), encoding="utf-8")
    for o in chosen:
        target = out / o["file"]
        if target.exists() and target.stat().st_size > 10000:
            continue
        url = ("https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(o["title"][5:])
               + ("?width=1920" if (o["w"] or 0) > 1920 else ""))
        for attempt in range(5):
            try:
                data = urllib.request.urlopen(urllib.request.Request(url, headers=AGENT), timeout=90).read()
                target.write_bytes(data)
                print(o["file"], len(data), flush=True)
                break
            except Exception as error:
                print(o["file"], "retry", attempt, error, flush=True)
                time.sleep(20 * (attempt + 1))
        time.sleep(4)
    print("done", sum(1 for f in out.glob("*.jpg") if f.stat().st_size > 10000), "of", len(chosen))


if __name__ == "__main__":
    main()
