"""Collect the text of IYF's own teaching material for every catalogue topic.

The IYF Preachers Library links, per site row, a Drive folder and/or resources (Docs, Slides, PDFs,
audio, video). This reads them through their public links only:
  - Google Docs / Slides / Sheets: exported as text (or CSV)
  - PDF, PPTX, DOCX in Drive: downloaded to .cache/, text extracted
  - audio, video, YouTube, other sites: recorded in the manifest, not downloaded
Folders are listed recursively (depth 3).

Output: research/iyf-materials/<site-row-id>/<name>.txt and research/iyf-materials/manifest.json.
Re-running skips what is already done. Google rate-limits anonymous use (~1,000 page loads an hour);
on a /sorry or 429 reply the script waits 15 minutes and retries.

Usage: .venv/bin/python tools/fetch_materials.py [row-id ...]     (default: every row)
       .venv/bin/python tools/fetch_materials.py --legacy         (re-read cached .doc/.ppt, no network)
"""

import glob
import html
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import zipfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "research", "iyf-materials")
CACHE = os.path.join(ROOT, ".cache", "materials")
CODE = {"vedic-level-1": "vl1", "dys": "dys", "vedic-level-2": "vl2", "vedic-level-3": "vl3",
        "sps-2": "sps2", "sps-1": "sps1", "dps": "dps", "bss": "bss"}
UA = "Mozilla/5.0 (IYF preacher-library material reader)"
MAX_BYTES = 40 * 1024 * 1024
PAUSE = 1.0

manifest_path = os.path.join(OUT, "manifest.json")
manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {"rows": {}, "items": {}}


def save_manifest():
    os.makedirs(OUT, exist_ok=True)
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=1, ensure_ascii=False)


def get(url, max_bytes=MAX_BYTES, accept_html=True):
    """Fetch url; returns (final_url, content_type, bytes or None if skipped by type)."""
    for attempt in range(5):
        time.sleep(PAUSE)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                final, ctype = r.geturl(), r.headers.get("Content-Type", "")
                if "/sorry" in final:
                    raise urllib.error.HTTPError(url, 429, "sorry", None, None)
                if ctype.startswith(("audio/", "video/")):
                    return final, ctype, None
                if not accept_html and ctype.startswith("text/html"):
                    return final, ctype, b""
                length = int(r.headers.get("Content-Length") or 0)
                if length > max_bytes:
                    return final, ctype, None
                data = r.read(max_bytes + 1)
                return final, ctype, (None if len(data) > max_bytes else data)
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                print(f"  rate-limited; waiting 15 min (attempt {attempt + 1})", flush=True)
                time.sleep(900)
                continue
            return url, f"http-{e.code}", b""
        except Exception as e:  # network hiccup
            print(f"  error {e!r}; retrying", flush=True)
            time.sleep(20)
    return url, "failed", b""


def safe(name):
    return re.sub(r"[^\w.\- ]+", "_", name).strip()[:90] or "file"


def text_from_pdf(data):
    from pypdf import PdfReader
    reader = PdfReader(io.BytesIO(data))
    return "\n\n".join((p.extract_text() or "") for p in reader.pages)


def text_from_ooxml(data, kind):
    z = zipfile.ZipFile(io.BytesIO(data))
    if kind == "pptx":
        names = sorted((n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml$", n)),
                       key=lambda n: int(re.search(r"(\d+)", n.split("/")[-1]).group(1)))
        out = []
        for i, n in enumerate(names, 1):
            xml = z.read(n).decode("utf8", "ignore")
            paras = [" ".join(re.findall(r"<a:t>([^<]*)</a:t>", p)) for p in re.split(r"</a:p>", xml)]
            out.append(f"--- slide {i} ---\n" + "\n".join(html.unescape(p) for p in paras if p.strip()))
        return "\n\n".join(out)
    xml = z.read("word/document.xml").decode("utf8", "ignore")
    paras = ["".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", p)) for p in re.split(r"</w:p>", xml)]
    return "\n".join(html.unescape(p) for p in paras if p.strip())


def text_from_legacy(path, name):
    """Old binary Office files: .doc via macOS textutil; .ppt/.pps by reading the slide-text records
    (TextCharsAtom 0x0FA0, UTF-16; TextBytesAtom 0x0FA8, 8-bit). Heuristic: a record split across
    storage sectors can come out garbled, so this text is marked as approximate."""
    if not re.search(r"\.pp[st]$", name, re.I):
        import subprocess
        r = subprocess.run(["textutil", "-convert", "txt", "-stdout", path], capture_output=True)
        return r.stdout.decode("utf8", "ignore") if r.returncode == 0 else ""
    data = open(path, "rb").read()
    out = []
    for tag, enc in ((b"\x00\x00\xa0\x0f", "utf-16-le"), (b"\x00\x00\xa8\x0f", "latin-1")):
        pos = data.find(tag)
        while pos >= 0:
            size = int.from_bytes(data[pos + 4:pos + 8], "little")
            if 0 < size < 65536 and pos + 8 + size <= len(data):
                out.append((pos, data[pos + 8:pos + 8 + size].decode(enc, "ignore").replace("\r", "\n").strip()))
            pos = data.find(tag, pos + 4)
    boiler = re.compile(r"^(Click to edit Master .*|Second level|Third level|Fourth level|Fifth level|\*|‹#›|\d+)$")
    lines = []
    for _, t in sorted(out):
        t = "\n".join(l for l in t.split("\n") if not boiler.match(l.strip())).strip()
        if t and (not lines or lines[-1] != t):
            lines.append(t)
    return "\n".join(lines)


def reprocess_legacy():
    """Extract text from legacy files already in .cache (no network)."""
    for key, it in manifest["items"].items():
        if it.get("type") != "legacy-office" or it.get("status") == "text":
            continue
        path = os.path.join(CACHE, f"{key}.legacy-office")
        if not os.path.exists(path):
            continue
        text = text_from_legacy(path, it.get("name") or "")
        row = next(r for r, keys in manifest["rows"].items() if key in keys)
        if text.strip():
            approx = bool(re.search(r"\.pp[st]$", it.get("name") or "", re.I))
            it.update(status="text", file=write_text(row, it.get("name") or key, text), chars=len(text),
                      detail="approximate (legacy PowerPoint)" if approx else "via textutil")
        else:
            it.update(status="no-text")
    save_manifest()


def sniff(data, ctype, name):
    if data[:4] == b"%PDF":
        return "pdf"
    if data[:2] == b"PK":
        try:
            names = zipfile.ZipFile(io.BytesIO(data)).namelist()
            if any(n.startswith("ppt/") for n in names):
                return "pptx"
            if any(n.startswith("word/") for n in names):
                return "docx"
            return "zip"
        except zipfile.BadZipFile:
            pass
    if data[:8] == b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1":
        return "legacy-office"
    if ctype.startswith("text/plain"):
        return "txt"
    return "other"


def write_text(row, name, text):
    d = os.path.join(OUT, row)
    os.makedirs(d, exist_ok=True)
    path = os.path.join(d, safe(name) + ".txt")
    with open(path, "w") as f:
        f.write(text)
    return os.path.relpath(path, ROOT)


def record(row, key, entry):
    manifest["items"][key] = entry
    rows = manifest["rows"].setdefault(row, [])
    if key not in rows:
        rows.append(key)
    save_manifest()


def handle(url, row, name="", icon="", depth=0):
    url = html.unescape(url).strip()
    m = re.search(r"/drive/(?:u/\d+/)?folders/([\w-]+)", url)
    if m:
        return handle_folder(m.group(1), row, name, depth)
    m = re.search(r"docs\.google\.com/(document|presentation|spreadsheets)/d/([\w-]+)", url)
    if m:
        kind, fid = m.groups()
        key = fid
        if manifest["items"].get(key, {}).get("status") == "text":
            return manifest["rows"].setdefault(row, []).append(key) if key not in manifest["rows"].get(row, []) else None
        exp = {"document": f"https://docs.google.com/document/d/{fid}/export?format=txt",
               "presentation": f"https://docs.google.com/presentation/d/{fid}/export/txt",
               "spreadsheets": f"https://docs.google.com/spreadsheets/d/{fid}/export?format=csv"}[kind]
        final, ctype, data = get(exp, accept_html=False)
        if data and not ctype.startswith("text/html"):
            text = data.decode("utf8", "ignore").lstrip("﻿")
            label = name or text.strip().split("\n")[0][:60] or fid
            record(row, key, {"url": url, "name": label, "type": f"google-{kind}", "status": "text",
                              "file": write_text(row, label, text), "chars": len(text)})
        else:
            record(row, key, {"url": url, "name": name, "type": f"google-{kind}", "status": "no-access", "detail": ctype})
        return
    m = re.search(r"drive\.google\.com/(?:file/d/|open\?id=|uc\?(?:[^ ]*&)?id=)([\w-]+)", url)
    if m:
        fid = m.group(1)
        if manifest["items"].get(fid, {}).get("status") in ("text", "audio", "video", "skipped"):
            if fid not in manifest["rows"].get(row, []):
                manifest["rows"].setdefault(row, []).append(fid)
            return
        if "/type/audio/" in icon or re.search(r"\.(mp3|m4a|wav|aac|ogg|amr)$", name, re.I):
            return record(row, fid, {"url": url, "name": name, "type": "audio", "status": "audio"})
        if "/type/video/" in icon or re.search(r"\.(mp4|mkv|avi|mov|webm|3gp)$", name, re.I):
            return record(row, fid, {"url": url, "name": name, "type": "video", "status": "video"})
        if re.search(r"\.(jpe?g|png|gif|webp)$", name, re.I):
            return record(row, fid, {"url": url, "name": name, "type": "image", "status": "skipped"})
        doc_like = not name or re.search(r"\.(pptx?|pdf|docx?)$", name, re.I)
        final, ctype, data = get(f"https://drive.google.com/uc?export=download&id={fid}",
                                 max_bytes=150 * 1024 * 1024 if doc_like else MAX_BYTES, accept_html=False)
        if data is None:
            kind = "audio" if ctype.startswith("audio/") else "video" if ctype.startswith("video/") else "large"
            return record(row, fid, {"url": url, "name": name, "type": kind, "status": kind if kind != "large" else "skipped",
                                     "detail": ctype})
        if not data:
            return record(row, fid, {"url": url, "name": name, "type": "unknown", "status": "no-access", "detail": ctype})
        kind = sniff(data, ctype, name)
        os.makedirs(CACHE, exist_ok=True)
        with open(os.path.join(CACHE, f"{fid}.{kind}"), "wb") as f:
            f.write(data)
        try:
            if kind == "pdf":
                text = text_from_pdf(data)
            elif kind in ("pptx", "docx"):
                text = text_from_ooxml(data, kind)
            elif kind == "txt":
                text = data.decode("utf8", "ignore")
            elif kind == "legacy-office":
                text = text_from_legacy(os.path.join(CACHE, f"{fid}.{kind}"), name)
            elif kind == "zip":
                return handle_zip(data, row, name or fid, url, fid)
            else:
                return record(row, fid, {"url": url, "name": name, "type": kind, "status": "skipped",
                                         "detail": "format not readable here"})
        except Exception as e:
            return record(row, fid, {"url": url, "name": name, "type": kind, "status": "error", "detail": repr(e)[:200]})
        label = name or fid
        status = "text" if text.strip() else "no-text"  # scanned PDFs have no text layer
        return record(row, fid, {"url": url, "name": label, "type": kind, "status": status,
                                 "file": write_text(row, label, text) if text.strip() else None, "chars": len(text)})
    kind = "youtube" if re.search(r"youtu\.?be", url) else "external"
    record(row, url, {"url": url, "name": name, "type": kind, "status": "external"})


def handle_zip(data, row, name, url, key):
    """A zip of course material: read its PDF / Office documents in memory (never extract or run anything else)."""
    z = zipfile.ZipFile(io.BytesIO(data))
    n = 0
    for member in z.infolist():
        low = member.filename.lower()
        if member.is_dir() or member.file_size > MAX_BYTES or not low.endswith((".pdf", ".pptx", ".docx", ".doc", ".ppt", ".txt")):
            continue
        blob = z.read(member)
        try:
            if low.endswith(".pdf"):
                text = text_from_pdf(blob)
            elif low.endswith((".pptx", ".docx")):
                text = text_from_ooxml(blob, low[-4:])
            elif low.endswith(".txt"):
                text = blob.decode("utf8", "ignore")
            else:
                tmp = os.path.join(CACHE, "zipmember" + os.path.splitext(low)[1])
                open(tmp, "wb").write(blob)
                text = text_from_legacy(tmp, low)
        except Exception as e:
            print("  zip member failed:", member.filename, repr(e)[:80], flush=True)
            continue
        if text.strip():
            label = f"{name} - {member.filename}".replace("/", " - ")
            record(row, f"{key}:{member.filename}", {"url": url, "name": label, "type": "zip-member", "status": "text",
                                                     "file": write_text(row, label, text), "chars": len(text)})
            n += 1
    record(row, key, {"url": url, "name": name, "type": "zip", "status": "text" if n else "no-text", "detail": f"{n} documents"})


def handle_folder(fid, row, name, depth):
    if depth > 3:
        return
    final, ctype, data = get(f"https://drive.google.com/embeddedfolderview?id={fid}")
    page = (data or b"").decode("utf8", "ignore")
    entries = re.findall(r'<div class="flip-entry" id="entry-([^"]+)".*?<a href="([^"]+)".*?<img src="([^"]+)"'
                         r'.*?flip-entry-title">([^<]*)<', page, re.S)
    record(row, f"folder:{fid}", {"url": f"https://drive.google.com/drive/folders/{fid}", "name": name, "type": "folder",
                                  "status": "listed" if entries else ("empty-or-private" if ctype.startswith("text/html") else ctype),
                                  "entries": len(entries)})
    for eid, href, icon, title in entries:
        handle(href, row, html.unescape(title), icon, depth + 1)


def main():
    if sys.argv[1:] == ["--legacy"]:
        reprocess_legacy()
        return
    snap = sorted(glob.glob(os.path.join(ROOT, "research", "catalogue-snapshot-*.json")))[-1]
    sessions = json.load(open(snap))["sessions"]
    want = set(sys.argv[1:])
    for s in sorted(sessions, key=lambda s: (s["category_id"], s["session_number"])):
        row = f'{CODE[s["category_id"]]}-{s["session_number"]:02d}'
        if want and row not in want:
            continue
        links = ([s["folder_link"]] if s.get("folder_link") else []) + [r["url"] for r in s["resources"]]
        if not links:
            continue
        print(row, f"({len(links)} links)", flush=True)
        for link in links:
            handle(link, row)
    items = manifest["items"].values()
    counts = {}
    for it in items:
        counts[it["status"]] = counts.get(it["status"], 0) + 1
    print("done:", counts, flush=True)


if __name__ == "__main__":
    main()
