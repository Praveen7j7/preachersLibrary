"""Make the local ISKCON Desire Tree PDF library searchable (prompt/iskcon_pdf_library/, 333 PDFs of seminar notes
and transcripts; secondary sources). Writes one .txt per PDF under research/desire-tree/ (same folder structure)
and research/desire-tree/index.md (speaker · series · title · pages · characters). Already-extracted files are skipped.

Usage: .venv/bin/python tools/extract_local_pdfs.py
"""

import os

from pypdf import PdfReader

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.join(ROOT, "..", "iskcon_pdf_library")
OUT = os.path.join(ROOT, "research", "desire-tree")

rows, empty, failed = [], 0, 0
for dirpath, _, files in os.walk(SRC):
    for name in sorted(files):
        if not name.lower().endswith(".pdf"):
            continue
        rel = os.path.relpath(os.path.join(dirpath, name), SRC)
        dest = os.path.join(OUT, rel[:-4] + ".txt")
        if not os.path.exists(dest):
            try:
                reader = PdfReader(os.path.join(dirpath, name))
                text = "\n\n".join((p.extract_text() or "") for p in reader.pages)
                pages = len(reader.pages)
            except Exception as e:
                print("failed:", rel, repr(e)[:120], flush=True)
                failed += 1
                continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, "w") as f:
                f.write(text)
        else:
            text, pages = open(dest).read(), "?"
        if not text.strip():
            empty += 1  # scanned PDF without a text layer
        parts = rel.split(os.sep)
        rows.append((parts[1] if len(parts) > 2 else parts[0], " / ".join(parts[2:-1]), name[:-4], pages, len(text)))

lines = ["# ISKCON Desire Tree PDFs: searchable text", "",
         "Secondary sources (seminar notes and transcripts). Useful for lecture flow and examples; never the authority for",
         "siddhanta. Text files mirror `prompt/iskcon_pdf_library/` under `research/desire-tree/`.", "",
         f"{len(rows)} PDFs · {empty} without a text layer (scanned) · {failed} failed.", "",
         "| Speaker | Series | Title | Pages | Characters |", "|---|---|---|---|---|"]
lines += [f"| {a.replace('_', ' ')} | {b.replace('_', ' ')} | {c.replace('_', ' ')} | {p} | {n} |" for a, b, c, p, n in sorted(rows)]
os.makedirs(OUT, exist_ok=True)
with open(os.path.join(OUT, "index.md"), "w") as f:
    f.write("\n".join(lines) + "\n")
print(f"{len(rows)} PDFs, {empty} scanned/empty, {failed} failed", flush=True)
