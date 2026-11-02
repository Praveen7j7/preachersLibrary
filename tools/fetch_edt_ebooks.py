"""ISKCON Desire Tree ebook library (https://ebooks.iskcondesiretree.com/): the head's source for authorized books that are
missing elsewhere (28 Oct 2026).

  index                 list the /pdf tree (names, sizes, links; no downloads) → research/edt-ebooks/index.json + index.md
  get "<path>" ...      download listed PDFs to .cache/edt/ and extract text to research/books/<name>.txt

Usage: .venv/bin/python tools/fetch_edt_ebooks.py index
       .venv/bin/python tools/fetch_edt_ebooks.py get "/pdf/Gaudiya_Books /Rupa_Goswami/<file>.pdf"
"""

import html
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
BASE = "https://ebooks.iskcondesiretree.com"
UA = {"User-Agent": "Mozilla/5.0 (IYF preacher-library)"}
OUT = os.path.join(ROOT, "research", "edt-ebooks")


def page(folder):
    time.sleep(1.5)
    url = f"{BASE}/index.php?q=f&f={urllib.parse.quote(folder)}"
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read().decode("utf8", "ignore")


def listing(folder):
    s = page(folder)
    # links are written unquoted: href=index.php?q=f&f=%2Fpdf%2FGaudiya_Books+  (spaces as +)
    dirs = sorted({urllib.parse.unquote_plus(html.unescape(m)) for m in re.findall(r'href=["\']?index\.php\?q=f&(?:amp;)?f=([^"\'\s>&]+)', s)})
    dirs = [d for d in dirs if d.startswith(folder.rstrip("/") + "/") and d.rstrip("/") != folder.rstrip("/")
            and d.count("/") == folder.rstrip("/").count("/") + 1]
    files = []
    for href in sorted(set(re.findall(r'href=["\']?(/pdf/[^"\'\s>]+\.pdf)', s, re.I))):
        path = urllib.parse.unquote(html.unescape(href))
        m = re.search(re.escape(os.path.basename(path).rsplit(".", 1)[0].replace("_", " ")) + r"\s*([\d.]+\s*[KMG]B)", s)
        files.append({"path": path, "name": os.path.basename(path), "size": m.group(1) if m else ""})
    return dirs, files


def index():
    os.makedirs(OUT, exist_ok=True)
    tree, todo = {}, [("/pdf", 0)]
    while todo:
        folder, depth = todo.pop(0)
        try:
            dirs, files = listing(folder)
        except Exception as e:
            print("skip", folder, repr(e)[:80], flush=True)
            continue
        tree[folder] = files
        print(f"{folder}: {len(dirs)} folders, {len(files)} files", flush=True)
        if depth < 3:
            todo += [(d, depth + 1) for d in dirs]
    json.dump(tree, open(os.path.join(OUT, "index.json"), "w"), indent=1, ensure_ascii=False)
    lines = ["# ISKCON Desire Tree ebooks: catalogue", "", f"Source {BASE} (head's choice for missing authorized books).",
             "Fetch with `tools/fetch_edt_ebooks.py get \"<path>\"`.", ""]
    for folder in sorted(tree):
        if tree[folder]:
            lines.append(f"## {folder}")
            lines += [f"- {f['name']} {f['size']} · `{f['path']}`" for f in tree[folder]]
            lines.append("")
    open(os.path.join(OUT, "index.md"), "w").write("\n".join(lines))
    print(sum(len(v) for v in tree.values()), "PDFs in", len(tree), "folders")


def get(paths):
    from pypdf import PdfReader
    os.makedirs(os.path.join(ROOT, ".cache", "edt"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "research", "books"), exist_ok=True)
    for path in paths:
        time.sleep(1.5)
        with urllib.request.urlopen(urllib.request.Request(BASE + urllib.parse.quote(path), headers=UA), timeout=300) as r:
            data = r.read()
        name = os.path.basename(path)
        open(os.path.join(ROOT, ".cache", "edt", name), "wb").write(data)
        reader = PdfReader(io.BytesIO(data))
        text = "\n\n".join((p.extract_text() or "") for p in reader.pages)
        dest = os.path.join(ROOT, "research", "books", name[:-4] + ".txt")
        open(dest, "w").write(f"Source: {BASE}{path}\n\n{text}")
        print(f"{name}: {len(reader.pages)} pages, {len(text)} chars" + ("  (no text layer: scanned)" if len(text.strip()) < 500 else ""))


if __name__ == "__main__":
    if sys.argv[1:2] == ["index"]:
        index()
    elif sys.argv[1:2] == ["get"]:
        get(sys.argv[2:])
    else:
        print(__doc__)
