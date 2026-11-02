"""Solve a one-glyph-per-character custom font encoding without OCR, from word patterns against a lexicon text.
Usage: solve_font.py <in.pdf> <lexicon.txt> <out.txt>"""
import collections, re, sys
from pypdf import PdfReader

pdf, lex_path, out_path = sys.argv[1:4]
pages = [p.extract_text() or "" for p in PdfReader(pdf).pages]
is_code = lambda c: "" <= c <= ""
counts = collections.Counter(c for p in pages for c in p if is_code(c))
space = counts.most_common(1)[0][0]
cw = collections.Counter(w for p in pages for w in re.split("[" + re.escape(space) + r"\s]+", p)
                         if w and all(is_code(c) for c in w))

lex = collections.Counter(re.findall(r"[^\W\d_]+", open(lex_path, encoding="utf-8").read()))
lex = {w: n for w, n in lex.items() if n >= 2 and "?" not in w}
bylen = collections.defaultdict(list)
for w in lex:
    bylen[len(w)].append(w)

def pattern(w):
    seen = {}
    return tuple(seen.setdefault(c, len(seen)) for c in w)

mapping = {space: " "}
# seed: most frequent 3-glyph word with pattern abc = "the"
three = [w for w, _ in cw.most_common() if len(w) == 3 and len(set(w)) == 3]
for c, ch in zip(three[0], "the"):
    mapping[c] = ch

for rnd in range(30):
    votes = collections.defaultdict(collections.Counter)
    used = {v: k for k, v in mapping.items()}
    for w, n in cw.items():
        if all(c in mapping for c in w):
            continue
        pw = pattern(w)
        cands = []
        for x in bylen[len(w)]:
            if pattern(x) != pw:
                continue
            ok = True
            for c, ch in zip(w, x):
                if c in mapping:
                    if mapping[c] != ch: ok = False; break
                elif ch in used and used[ch] != c:
                    ok = False; break
            if ok:
                cands.append(x)
        if not cands:
            continue
        best = max(cands, key=lambda x: lex[x])
        weight = lex[best] / sum(lex[x] for x in cands)
        if weight < 0.6:
            continue
        for c, ch in zip(w, best):
            if c not in mapping:
                votes[c][ch] += n * weight
    added = 0
    for c, v in sorted(votes.items(), key=lambda kv: -sum(kv[1].values())):
        ch, s = v.most_common(1)[0]
        if s / sum(v.values()) >= 0.75 and s >= 2 and ch not in mapping.values():
            mapping[c] = ch; added += 1
    if not added:
        break

left = [c for c in counts if c not in mapping]
cover = 1 - sum(counts[c] for c in left) / sum(counts.values())
print(f"rounds {rnd + 1}, codes {len(counts)}, mapped {len(mapping)}, coverage {cover:.1%}")
out = [f"Source: {pdf.split('/')[-1]} (custom font decoded from word patterns; unknown glyphs = ?)\n"]
for i, p in enumerate(pages, 1):
    out.append(f"\n--- page {i} ---\n" + "".join(mapping.get(c, "?") if is_code(c) else c for c in p) + "\n")
open(out_path, "w", encoding="utf-8").write("".join(out))
