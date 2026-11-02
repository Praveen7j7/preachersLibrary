"""Make HG Radheshyam Das's "Preaching Encyclopedia" (VOICE Pune; All EBG lecture transcriptions and books, .chm) searchable.

Step 1 (done once by hand): 7zz x -o.cache/encyclopedia/raw "<the .chm file>"
Step 2 (this script): follow the table of contents (Preaching Encyclopedia.hhc), convert every page to text in reading
order, write research/encyclopedia/<section>/<nn page>.txt and research/encyclopedia/index.md (the contents with sizes).
Pages not in the contents are converted too, under research/encyclopedia/_other/.

Usage: python3 -I tools/extract_encyclopedia.py
"""

import html
import os
import re
import urllib.parse

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
RAW = os.path.join(ROOT, ".cache", "encyclopedia", "raw")
OUT = os.path.join(ROOT, "research", "encyclopedia")


def read(path):
    data = open(path, "rb").read()
    m = re.search(rb'charset=["\']?([\w-]+)', data[:3000], re.I)
    enc = m.group(1).decode() if m else "windows-1252"
    try:
        return data.decode(enc, "ignore")
    except LookupError:
        return data.decode("windows-1252", "ignore")


def text(page):
    page = re.sub(r"(?is)<(script|style|head)[^>]*>.*?</\1>", " ", page)
    page = re.sub(r"(?i)<br\s*/?>|</p>|</div>|</h\d>|</li>|</tr>", "\n", page)
    page = re.sub(r"<[^>]+>", " ", page)
    page = html.unescape(page).replace("\xa0", " ")
    lines = [re.sub(r"[ \t]+", " ", l).strip() for l in page.split("\n")]
    out, blank = [], 0
    for l in lines:
        blank = blank + 1 if not l else 0
        if blank < 2:
            out.append(l)
    return "\n".join(out).strip()


safe = lambda s: re.sub(r"[^\w.\- ]+", "_", s).strip()[:80] or "page"

# Table of contents: nested <UL> of <OBJECT> items with Name and Local.
hhc = read(os.path.join(RAW, "Preaching Encyclopedia.hhc"))
entries, depth = [], 0
for tok in re.finditer(r"(?is)<ul>|</ul>|<object[^>]*>(.*?)</object>", hhc):
    t = tok.group(0).lower()
    if t == "<ul>":
        depth += 1
    elif t == "</ul>":
        depth -= 1
    else:
        name = re.search(r'(?i)name="Name"\s+value="([^"]*)"', tok.group(1))
        local = re.search(r'(?i)name="Local"\s+value="([^"]*)"', tok.group(1))
        entries.append((depth, html.unescape(name.group(1)) if name else "", local.group(1) if local else ""))

os.makedirs(OUT, exist_ok=True)
index = ["# Preaching Encyclopedia (HG Radheshyam Das, VOICE Pune): contents", "",
         "All EBG lecture transcriptions and books. Supporting source (VOICE): use for structure, explanations and examples;",
         "scripture is still verified on vedabase. Text under `research/encyclopedia/`.", ""]
done, section, n, total = set(), "front", 0, 0
for d, name, local in entries:
    if d <= 1:
        section = safe(name)
    if not local:
        index.append("  " * (d - 1) + f"- **{name}**")
        continue
    src = os.path.join(RAW, urllib.parse.unquote(local.split("#")[0]).replace("\\", "/"))
    if src in done or not os.path.exists(src):
        index.append("  " * (d - 1) + f"- {name}" + ("" if os.path.exists(src) else " *(missing)*"))
        continue
    done.add(src)
    body = text(read(src))
    n += 1
    total += len(body)
    dest = os.path.join(OUT, section, f"{n:04d} {safe(name)}.txt")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, "w").write(f"{name}\n\n{body}\n")
    index.append("  " * (d - 1) + f"- {name} · {len(body)} chars · `{os.path.relpath(dest, OUT)}`")

others = 0
for dirpath, _, files in os.walk(RAW):
    for f in files:
        p = os.path.join(dirpath, f)
        if f.lower().endswith((".htm", ".html")) and p not in done:
            body = text(read(p))
            if len(body) > 200:
                rel = safe(os.path.relpath(p, RAW).replace(os.sep, " - ")[:-4])
                os.makedirs(os.path.join(OUT, "_other"), exist_ok=True)
                open(os.path.join(OUT, "_other", rel + ".txt"), "w").write(body + "\n")
                others += 1
                total += len(body)

index.insert(4, f"{n} pages in the contents · {others} further pages under `_other/` · {total:,} characters in all.")
open(os.path.join(OUT, "index.md"), "w").write("\n".join(index) + "\n")
print(f"{n} contents pages, {others} other pages, {total:,} chars")
