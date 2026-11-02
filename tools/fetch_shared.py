"""Collect two IYF sources the head shared on 28 Oct 2026, using tools/fetch_materials.py:
  - IYF curriculum documents folder (Drive 1TM5DLj8Vj-IuNXe6PhrsSuEH8OR5nMVh) → row "iyf-docs"
  - IYF presentation catalogue (sheet 1UcYYwTHf_YTaCh8XT5s-HPRbQ0Sh-5YT: Title, Download, Made by, Audio, Date) → row "iyf-decks"
Text lands in research/iyf-materials/<row>/; the catalogue itself is saved as research/iyf-materials/iyf-decks/catalogue.csv.

Usage: .venv/bin/python tools/fetch_shared.py
"""
import csv, importlib.util, os, shutil, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
spec = importlib.util.spec_from_file_location("fm", os.path.join(ROOT, "tools", "fetch_materials.py"))
fm = importlib.util.module_from_spec(spec); spec.loader.exec_module(fm)

fm.handle("https://drive.google.com/drive/folders/1TM5DLj8Vj-IuNXe6PhrsSuEH8OR5nMVh", "iyf-docs", "IYF curriculum documents")
print("folder done", flush=True)

url = "https://docs.google.com/spreadsheets/d/1UcYYwTHf_YTaCh8XT5s-HPRbQ0Sh-5YT/export?format=csv&gid=1113532479"
dest = os.path.join(ROOT, "research", "iyf-materials", "iyf-decks")
os.makedirs(dest, exist_ok=True)
with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=60) as r:
    open(os.path.join(dest, "catalogue.csv"), "wb").write(r.read())
rows = [x for x in csv.DictReader(open(os.path.join(dest, "catalogue.csv"))) if x["Title"].strip()]
for i, x in enumerate(rows, 1):
    title = f"{x['Title'].strip()} — {x['Made by'].strip() or 'IYF'}"
    if "drive.google" in x["Download"] or "docs.google" in x["Download"]:
        fm.handle(x["Download"].strip(), "iyf-decks", title)
    if x["Audio"].strip():
        fm.handle(x["Audio"].strip(), "iyf-decks", title + " (audio).mp3")
    print(f"{i}/{len(rows)} {title[:70]}", flush=True)
print("done", flush=True)
