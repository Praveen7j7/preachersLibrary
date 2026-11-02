"""Map every catalogue topic to its best supporting sources (keyword match, no model):
  IYF notes (research/iyf-materials), ISKCON Desire Tree seminars (research/desire-tree),
  radheshyamdas.com courses (research/radheshyamdas/index.json),
  Chaitanya Charan's articles (research/chaitanyacharan/*.json).
Writes data/sources-map.json and research/sources-map.md. Matches are leads for the writer to open and judge,
not citations; scripture is still verified on vedabase.

Usage: python3 tools/map_sources.py
"""

import glob
import json
import os
import re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
STOP = set("""a an and are as at be by for from how i in is it its of on or our the to vs with what why who whom
which this that these those my your we you do does can should into than then there their them they his her
art importance various part life history srila sri lord topic topics way ways level levels make making
use using through about over under more less most least very one two three four five six seven eight nine ten
meaning means also overcoming developing practical tips dealing dealings different also""".split())
TOP = {"rsd": 6, "cc": 8, "dt": 5}


def words(s):
    return [w for w in re.findall(r"[a-z]{3,}", s.lower()) if w not in STOP]


def stem(w):
    for suf in ("ing", "ness", "ment", "ies", "es", "s", "ed", "ly"):
        if w.endswith(suf) and len(w) - len(suf) >= 4:
            return w[: -len(suf)]
    return w


def score(keys, title, body=""):
    t = {stem(w) for w in words(title)}
    b = {stem(w) for w in words(body)}
    s = sum(3 for k in keys if k in t) + sum(1 for k in keys if k not in t and k in b)
    return s


cur = json.load(open(os.path.join(ROOT, "data", "curriculum.json")))
man = json.load(open(os.path.join(ROOT, "research", "iyf-materials", "manifest.json")))

rsd = []
p = os.path.join(ROOT, "research", "radheshyamdas", "index.json")
if os.path.exists(p):
    for c in json.load(open(p))["collections"]:
        rsd.append({"title": c["title"], "url": c["url"], "body": " ".join(s["name"] + " " + s["description"] for s in c["sessions"]),
                    "n": len(c["sessions"])})
cc = []
for f in glob.glob(os.path.join(ROOT, "research", "chaitanyacharan", "*.json")):
    for post in json.load(open(f))["posts"]:
        cc.append({"title": post["title"], "url": post["link"], "body": " ".join(post["categories"]) + " " + post["excerpt"]})
decks = [{"title": man["items"][k]["name"], "url": man["items"][k]["file"], "body": ""}
         for k in man["rows"].get("iyf-decks", []) if man["items"][k]["status"] in ("text", "transcribed")]
lectures = []  # IYF media library catalogue (audio; matched by title)
for f, link in (("Audios.csv", "Download"), ("Brahmachari Lectures.csv", "Download Link")):
    p2 = os.path.join(ROOT, "research", "iyf-materials", "iyf-sheet-3", f)
    if os.path.exists(p2):
        import csv
        for x in csv.DictReader(open(p2)):
            if x.get("Name", "").strip():
                lectures.append({"title": f"{x['Name'].strip()} ({x.get('Speaker', '').strip() or 'IYF'})", "url": x.get(link, ""),
                                 "body": f"{x.get('Category', '')} {x.get('Sub Category', x.get('Sub-Category', ''))}"})
enc = []  # Preaching Encyclopedia (VOICE): page title + section path
for f in glob.glob(os.path.join(ROOT, "research", "encyclopedia", "**", "*.txt"), recursive=True):
    rel = os.path.relpath(f, ROOT)
    enc.append({"title": os.path.basename(f)[5:-4], "url": rel, "body": os.path.dirname(rel)})
books = []  # acharyas' books and the head's book folder (research/books, iyf-drive-4), matched by title
for f in glob.glob(os.path.join(ROOT, "research", "books", "*.txt")):
    books.append({"title": os.path.basename(f)[:-4].replace("_", " "), "url": os.path.relpath(f, ROOT), "body": ""})
for k in man["rows"].get("iyf-drive-4", []):
    it = man["items"][k]
    if it["status"] == "text" and it.get("file"):
        books.append({"title": it["name"].replace("_", " "), "url": it["file"], "body": ""})
gurus = []
for f in glob.glob(os.path.join(ROOT, "research", "gurus", "*.json")):
    g = json.load(open(f))
    for post in g["posts"]:
        gurus.append({"title": post["title"], "url": post["url"], "body": post["subtitle"], "who": g["source"]["name"]})
dt = []
for f in glob.glob(os.path.join(ROOT, "research", "desire-tree", "**", "*.txt"), recursive=True):
    rel = os.path.relpath(f, ROOT)
    dt.append({"title": os.path.basename(f)[:-4].replace("_", " "), "url": rel, "body": rel.replace("_", " ")})

out, md = {}, ["# Topic → supporting sources map", "",
               "Keyword matches (leads to open and judge, not citations). Regenerate: `python3 tools/map_sources.py`.",
               f"Indexed: {len(rsd)} radheshyamdas.com collections · {len(cc)} Chaitanya Charan articles · {len(dt)} Desire Tree files.", ""]
for t in cur["topics"]:
    if t["kind"] != "topic":
        continue
    keys = {stem(w) for w in words(t["title"] + " " + t.get("subtitle", ""))}
    if not keys:
        continue
    iyf = [man["items"][k].get("file") for r in t["siteRows"] for k in man["rows"].get(r, [])
           if man["items"][k]["status"] in ("text", "transcribed") and man["items"][k].get("file")]

    def best(pool, n):
        ranked = sorted(((score(keys, x["title"], x["body"]), x) for x in pool), key=lambda z: -z[0])
        picked, seen = [], set()
        for s, x in ranked:  # needs at least one keyword in the title; skip duplicate titles
            k = re.sub(r"\W+", "", x["title"].lower())
            if s < 3 or len(picked) == n:
                break
            if k not in seen:
                seen.add(k)
                picked.append({"title": x["title"], "url": x["url"], "score": s})
        return picked

    rec = {"title": t["title"], "keywords": sorted(keys), "iyf": iyf, "iyfDecks": best(decks, 3), "iyfLectures": best(lectures, 4), "encyclopedia": best(enc, 4), "books": best(books, 4),
           "radheshyamdas": best(rsd, TOP["rsd"]), "chaitanyacharan": best(cc, TOP["cc"]), "gurus": best(gurus, 4), "desireTree": best(dt, TOP["dt"])}
    out[t["id"]] = rec
    md.append(f"## {t['id']} · {t['title']}")
    md.append(f"- IYF notes: {len(iyf)} file(s)" + (f" — {', '.join(os.path.basename(x) for x in iyf[:4])}" if iyf else ""))
    for label, k in (("IYF presentation catalogue", "iyfDecks"), ("IYF lectures (audio)", "iyfLectures"), ("Preaching Encyclopedia (VOICE)", "encyclopedia"), ("Books (acharyas and head folder)", "books"), ("radheshyamdas.com", "radheshyamdas"), ("Chaitanya Charan", "chaitanyacharan"), ("ISKCON gurus (realizations)", "gurus"), ("Desire Tree", "desireTree")):
        if rec[k]:
            md.append(f"- {label}: " + " · ".join(f"[{x['title'][:70]}]({x['url']})" for x in rec[k]))
    md.append("")

json.dump(out, open(os.path.join(ROOT, "data", "sources-map.json"), "w"), indent=1, ensure_ascii=False)
open(os.path.join(ROOT, "research", "sources-map.md"), "w").write("\n".join(md) + "\n")
have = lambda k: sum(1 for r in out.values() if r[k])
print(f"{len(out)} topics mapped · IYF {have('iyf')} · radheshyamdas {have('radheshyamdas')} · "
      f"IYF decks {have('iyfDecks')} · Encyclopedia {have('encyclopedia')} · books {have('books')} · IYF lectures {have('iyfLectures')} · Chaitanya Charan {have('chaitanyacharan')} · gurus {have('gurus')} · Desire Tree {have('desireTree')}")
