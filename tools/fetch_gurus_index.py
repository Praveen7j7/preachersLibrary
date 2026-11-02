"""Index ISKCON gurus' realization sites (head, 28 Oct 2026: non-ritvik ISKCON gurus may be used for their realizations;
principles and main content always come from Srila Prabhupada's books).

Each source in SOURCES is read through its own public listing (Substack archive API: 50 posts per request).
Writes research/gurus/<key>.json (title, subtitle, url, date). Add a source only after the head approves it.

Usage: .venv/bin/python tools/fetch_gurus_index.py
"""

import json
import os
import time
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "research", "gurus")
SOURCES = {
    "keshavaswami": {"name": "S.B. Keshava Swami — Tattva", "kind": "substack", "base": "https://tattva.keshavaswami.com"},
}

os.makedirs(OUT, exist_ok=True)
for key, src in SOURCES.items():
    posts, offset = [], 0
    while True:
        url = f"{src['base']}/api/v1/archive?sort=new&offset={offset}&limit=50"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (IYF preacher-library index)"})
        with urllib.request.urlopen(req, timeout=60) as r:
            batch = json.loads(r.read().decode("utf8"))
        if not batch:
            break
        for p in batch:
            posts.append({"title": p.get("title", ""), "subtitle": (p.get("subtitle") or p.get("description") or "")[:300],
                          "url": p.get("canonical_url") or f"{src['base']}/p/{p.get('slug', '')}",
                          "date": (p.get("post_date") or "")[:10]})
        offset += len(batch)
        time.sleep(2)
    json.dump({"source": src, "fetched": time.strftime("%Y-%m-%d"), "posts": posts},
              open(os.path.join(OUT, f"{key}.json"), "w"), indent=1, ensure_ascii=False)
    print(f"{key}: {len(posts)} posts")
