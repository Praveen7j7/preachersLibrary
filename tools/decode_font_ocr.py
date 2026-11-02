"""Decode a PDF whose text layer uses a private-use custom font encoding (one glyph code per character).
Learns the code->char map from pages where an OCR text exists, by aligning words of equal length.
Usage: decode_font.py <in.pdf> <ocr.txt> <out.txt>"""
import collections, difflib, re, sys
from pypdf import PdfReader

pdf, ocr_path, out_path = sys.argv[1:4]
pages = [p.extract_text() or "" for p in PdfReader(pdf).pages]
ocr = re.split(r"--- page (\d+) ---", open(ocr_path, encoding="utf-8").read())
ocr_pages = {int(ocr[i]): ocr[i + 1] for i in range(1, len(ocr), 2)}

def is_code(c):
    return "" <= c <= ""

# space glyph = most common code
counts = collections.Counter(c for p in pages for c in p if is_code(c))
space = counts.most_common(1)[0][0]

def cwords(t):
    return [w for w in re.split("[" + re.escape(space) + r"\s]+", t) if w]

votes = collections.defaultdict(collections.Counter)
for n, otext in ocr_pages.items():
    if len(otext.strip()) < 50 or n - 1 >= len(pages):
        continue
    cw = cwords(pages[n - 1])
    ow = otext.split()
    sm = difflib.SequenceMatcher(None, [len(w) for w in cw], [len(w) for w in ow], autojunk=False)
    for a, b, size in sm.get_matching_blocks():
        if size < 3:  # need a run of equal-length words to trust the alignment
            continue
        for k in range(size):
            for x, y in zip(cw[a + k], ow[b + k]):
                if is_code(x):
                    votes[x][y] += 1

mapping = {space: " "}
for code, c in votes.items():
    ch, v = c.most_common(1)[0]
    if v >= 2:
        mapping[code] = ch
unmapped = [c for c in counts if c not in mapping]
print(f"codes {len(counts)}, mapped {len(mapping)}, unmapped {len(unmapped)} "
      f"({sum(counts[c] for c in unmapped)} of {sum(counts.values())} chars)")

out = [f"Source: {pdf.split('/')[-1]} (custom font decoded via OCR-aligned map; unknown glyphs = ?)\n"]
for i, p in enumerate(pages, 1):
    text = "".join(mapping.get(c, "?") if is_code(c) else c for c in p)
    out.append(f"\n--- page {i} ---\n{text}\n")
open(out_path, "w", encoding="utf-8").write("".join(out))

# Pass 2: fill diacritic glyphs from known IAST words in other books (argv[4] = glob of word sources)
if len(sys.argv) > 4:
    import glob
    lex = collections.Counter()
    for f in glob.glob(sys.argv[4]):
        for w in re.findall(r"[A-Za-zĀāĪīŪūṚṛṜṝḶḷṄṅÑñṬṭḌḍṆṇŚśṢṣḤḥṂṃ]+", open(f, encoding="utf-8", errors="ignore").read()):
            if any(ord(c) > 127 for c in w):
                lex[w] += 1
    bylen = collections.defaultdict(list)
    for w, n in lex.items():
        if n >= 3:
            bylen[len(w)].append(w)
    votes2 = collections.defaultdict(collections.Counter)
    for p in pages:
        for w in cwords(p):
            if not any(c in unmapped for c in w) or not all(is_code(c) for c in w):
                continue
            pat = [mapping.get(c) for c in w]
            cands = [x for x in bylen[len(w)] if all(k is None or k == ch for k, ch in zip(pat, x))]
            if len(cands) == 1:
                for c, ch in zip(w, cands[0]):
                    if c in unmapped:
                        votes2[c][ch] += 1
    for code, c in votes2.items():
        (ch, v), total = c.most_common(1)[0], sum(c.values())
        if v >= 3 and v / total >= 0.8:
            mapping[code] = ch
    left = [c for c in counts if c not in mapping]
    print(f"pass 2: unmapped {len(left)} ({sum(counts[c] for c in left)} chars): "
          + ", ".join(f"{hex(ord(c))}x{counts[c]}" for c in left))
    out = [f"Source: {pdf.split('/')[-1]} (custom font decoded via OCR-aligned map + IAST lexicon; unknown glyphs = ?)\n"]
    for i, p in enumerate(pages, 1):
        text = "".join(mapping.get(c, "?") if is_code(c) else c for c in p)
        out.append(f"\n--- page {i} ---\n{text}\n")
    open(out_path, "w", encoding="utf-8").write("".join(out))
