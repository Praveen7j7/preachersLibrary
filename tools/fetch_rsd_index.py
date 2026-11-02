"""Index the course library of https://radheshyamdas.com/ (a supporting source chosen by the head, 28 Oct 2026).

Every collection page carries schema.org JSON-LD: an ItemList of sessions, each with a name, optional description
and associatedMedia (audio, YouTube, documents). This reads the sitemap, fetches each page politely and writes:
  research/radheshyamdas/index.json   one record per collection: url, category path, title, sessions[]
  research/radheshyamdas/index.md     the same as a browsable list (grep it to find sessions for a topic)
No media is downloaded. Re-running refetches everything.

Usage: .venv/bin/python tools/fetch_rsd_index.py
"""

import json
import os
import re
import time
import urllib.error
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "research", "radheshyamdas")
UA = "Mozilla/5.0 (IYF preacher-library index)"


class Refused(Exception):
    pass


def get(url):
    """Polite fetch: a 403/429 means the site wants us to slow down, so wait 5 minutes, then give up."""
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read().decode("utf8", "ignore")
        except urllib.error.HTTPError as e:
            if e.code in (403, 429):
                if attempt == 2:
                    raise Refused(url)
                print(f"  refused ({e.code}); waiting 5 min", flush=True)
                time.sleep(300)
                continue
            return ""
        except Exception as e:
            print(f"  retry {url}: {e!r}", flush=True)
            time.sleep(15)
    return ""


def media_kind(m):
    t, u = m.get("@type", ""), m.get("contentUrl") or m.get("url") or m.get("embedUrl") or ""
    if "youtube" in u:
        return "youtube"
    if t == "AudioObject":
        return "audio"
    if t == "VideoObject":
        return "video"
    return "document"


def parse(url, page):
    rec = {"url": url, "path": url.split("radheshyamdas.com/")[-1], "title": "", "sessions": []}
    m = re.search(r"<title>(.*?)</title>", page, re.S)
    rec["title"] = re.sub(r"\s*\|.*$", "", (m.group(1) if m else "")).strip()
    for block in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', page, re.S):
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            continue
        for d in data if isinstance(data, list) else [data]:
            items = d.get("itemListElement") or (d.get("mainEntity") or {}).get("itemListElement") or []
            for it in items:
                w = it.get("item", it) if isinstance(it, dict) else it
                if not isinstance(w, dict):
                    rec["sessions"].append({"name": str(w), "description": "", "media": []})
                    continue
                media = w.get("associatedMedia") or []
                media = [x for x in (media if isinstance(media, list) else [media]) if isinstance(x, dict)]
                rec["sessions"].append({
                    "name": w.get("name", ""),
                    "description": (w.get("description") or "")[:500],
                    "media": [{"kind": media_kind(x), "name": x.get("name", ""),
                               "url": x.get("contentUrl") or x.get("url") or x.get("embedUrl") or ""} for x in media],
                })
    return rec


def main():
    os.makedirs(OUT, exist_ok=True)
    partial = os.path.join(OUT, "partial.json")
    done = json.load(open(partial)) if os.path.exists(partial) else {}
    urls = re.findall(r"<loc>([^<]+)</loc>", get("https://radheshyamdas.com/sitemap.xml"))
    urls = [u for u in urls if u.count("/") > 3]
    print(len(urls), "pages,", len(done), "already done", flush=True)
    try:
        for i, u in enumerate(urls, 1):
            if u in done:
                continue
            time.sleep(10)
            try:
                done[u] = parse(u, get(u))
            except Refused:
                raise
            except Exception as e:
                print(f"  skip {u}: {e!r}", flush=True)
                done[u] = {"url": u, "sessions": [], "error": repr(e)[:200]}
            with open(partial, "w") as f:
                json.dump(done, f, ensure_ascii=False)
            if i % 50 == 0:
                print(i, flush=True)
    except Refused as e:
        print(f"site keeps refusing ({e}); stopped politely. Re-run later to resume.", flush=True)
    records = list(done.values())
    records = [r for r in records if r["sessions"]]
    with open(os.path.join(OUT, "index.json"), "w") as f:
        json.dump({"source": "https://radheshyamdas.com/sitemap.xml", "fetched": time.strftime("%Y-%m-%d"),
                   "collections": records}, f, indent=1, ensure_ascii=False)
    kinds = {}
    lines = ["# radheshyamdas.com course index", "",
             "Supporting source (head, 28 Oct 2026). Cite by URL; never the authority for scripture.", ""]
    for r in sorted(records, key=lambda r: r["path"]):
        lines.append(f"## {r['title']}  \n`{r['path']}` · {len(r['sessions'])} sessions · {r['url']}")
        for s in r["sessions"]:
            for x in s["media"]:
                kinds[x["kind"]] = kinds.get(x["kind"], 0) + 1
            docs = [x["url"] for x in s["media"] if x["kind"] == "document"]
            yt = [x["url"] for x in s["media"] if x["kind"] == "youtube"]
            lines.append(f"- {s['name']}" + (f" — {s['description'][:160]}" if s["description"] else "")
                         + (f" · YouTube {yt[0]}" if yt else "") + (f" · docs: {' '.join(docs)}" if docs else ""))
        lines.append("")
    with open(os.path.join(OUT, "index.md"), "w") as f:
        f.write("\n".join(lines))
    print(f"done: {len(records)} collections, {sum(len(r['sessions']) for r in records)} sessions, media {kinds}", flush=True)


if __name__ == "__main__":
    main()
