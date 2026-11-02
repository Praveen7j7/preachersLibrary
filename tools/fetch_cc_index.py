"""Index Chaitanya Charan Das's articles (the scientific perspective; supporting source chosen by the head, 28 Oct 2026).
chaitanyacharan.com links to his two WordPress archives; their public REST API lists posts 100 at a time:
  https://www.thespiritualscientist.com   (articles, Q&A)
  https://gitadaily.com                     (daily Gita reflections)
Writes research/chaitanyacharan/<site>.json (title, link, date, categories, excerpt). Resumable; polite (2 s/page;
on 403/429 waits 5 min, then stops).

Usage: .venv/bin/python tools/fetch_cc_index.py
"""

import html
import json
import os
import re
import time
import urllib.error
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "research", "chaitanyacharan")
UA = "Mozilla/5.0 (IYF preacher-library index)"
SITES = {"thespiritualscientist": "https://www.thespiritualscientist.com", "gitadaily": "https://gitadaily.com"}


def get_json(url):
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return json.loads(r.read().decode("utf8", "ignore"))
        except urllib.error.HTTPError as e:
            if e.code == 400:  # past the last page
                return []
            if e.code in (403, 429) and attempt < 2:
                print(f"  refused ({e.code}); waiting 5 min", flush=True)
                time.sleep(300)
                continue
            raise
        except Exception as e:
            print(f"  retry: {e!r}", flush=True)
            time.sleep(15)
    raise RuntimeError(f"gave up on {url}")


def plain(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


os.makedirs(OUT, exist_ok=True)
for key, base in SITES.items():
    path = os.path.join(OUT, f"{key}.json")
    data = json.load(open(path)) if os.path.exists(path) else {"site": base, "pagesDone": 0, "categories": {}, "posts": []}
    if not data["categories"]:
        page = 1
        while True:
            time.sleep(2)
            cats = get_json(f"{base}/wp-json/wp/v2/categories?per_page=100&page={page}&_fields=id,name")
            if not cats:
                break
            data["categories"].update({str(c["id"]): plain(c["name"]) for c in cats})
            page += 1
    page = data["pagesDone"] + 1
    try:
        while True:
            time.sleep(2)
            posts = get_json(f"{base}/wp-json/wp/v2/posts?per_page=100&page={page}&_fields=id,date,link,title,categories,excerpt")
            if not posts:
                break
            for p in posts:
                data["posts"].append({"title": plain(p["title"]["rendered"]), "link": p["link"], "date": p["date"][:10],
                                      "categories": [data["categories"].get(str(c), str(c)) for c in p.get("categories", [])],
                                      "excerpt": plain(p.get("excerpt", {}).get("rendered"))[:300]})
            data["pagesDone"] = page
            with open(path, "w") as f:
                json.dump(data, f, ensure_ascii=False)
            if page % 20 == 0:
                print(key, page, len(data["posts"]), flush=True)
            page += 1
    except Exception as e:
        print(f"{key}: stopped at page {page} ({e!r}); re-run to resume", flush=True)
    print(f"{key}: {len(data['posts'])} posts, {len(data['categories'])} categories", flush=True)
