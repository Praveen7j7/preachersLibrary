"""Save every tab of a shared Google Sheet as CSV under research/iyf-materials/<name>/ and print a summary.
The sheet must be shared "anyone with the link". Reads the .xlsx export with the standard library only.

Usage: python3 tools/fetch_sheet.py <sheet-id> <name>
"""

import csv
import html
import io
import os
import re
import sys
import urllib.request
import zipfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sheet_id, name = sys.argv[1], sys.argv[2]
out = os.path.join(ROOT, "research", "iyf-materials", name)
os.makedirs(out, exist_ok=True)

url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=xlsx"
with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=120) as r:
    z = zipfile.ZipFile(io.BytesIO(r.read()))

wb = z.read("xl/workbook.xml").decode()
tabs = re.findall(r'<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"', wb)
rels = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"', z.read("xl/_rels/workbook.xml.rels").decode()))
shared = []
if "xl/sharedStrings.xml" in z.namelist():
    shared = [html.unescape("".join(re.findall(r"<t[^>]*>([^<]*)</t>", si)))
              for si in re.findall(r"<si>(.*?)</si>", z.read("xl/sharedStrings.xml").decode(), re.S)]


def col(ref):
    n = 0
    for ch in re.match(r"[A-Z]+", ref).group(0):
        n = n * 26 + ord(ch) - 64
    return n - 1


for tab, rid in tabs:
    xml = z.read("xl/" + rels[rid].replace("/xl/", "").lstrip("/")).decode()
    rows = []
    for row in re.findall(r"<row[^>]*>(.*?)</row>", xml, re.S):
        cells = {}
        for ref, attrs, body in re.findall(r'<c r="([A-Z]+\d+)"([^>]*?)(?:/>|>(.*?)</c>)', row, re.S):
            v = re.search(r"<v>([^<]*)</v>", body or "")
            if 't="s"' in attrs and v:
                val = shared[int(v.group(1))]
            elif v:
                val = v.group(1)
            else:
                val = html.unescape("".join(re.findall(r"<t[^>]*>([^<]*)</t>", body or "")))
            cells[col(ref)] = val.strip()
        if any(cells.values()):
            rows.append([cells.get(i, "") for i in range(max(cells) + 1)])
    fn = os.path.join(out, re.sub(r"[^\w.\- ]+", "_", tab)[:60] + ".csv")
    csv.writer(open(fn, "w")).writerows(rows)
    first = " | ".join(c for c in (rows[0] if rows else []) if c)[:110]
    print(f"{tab!r}: {len(rows)} rows · {sum(len(' '.join(r)) for r in rows)} chars · {first}")
