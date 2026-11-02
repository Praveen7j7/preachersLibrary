"""Token-free pre-pass before the combined agent pass (head, 2 Nov 2026). No model is used.

  python3 tools/prepass.py strip      remove fixed stock softening phrases (backups in .cache/prepass-backup/, log in research/prepass/strip-log.md)
  python3 tools/prepass.py prep       write research/prepass/<id>.md per page: for each quotation the gate could not find, the closest true
                                      source text from the page's pack; for each "Requires source review" note naming a book we now hold,
                                      candidate passages from the OCR'd book. Agents start from these files instead of searching.
"""
import json, os, re, shutil, sys
from datetime import date

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
TOP, PACKS, OUT, BOOKS = (os.path.join(ROOT, p) for p in ('content/topics', 'research/packs', 'research/prepass', 'research/books'))
os.makedirs(OUT, exist_ok=True)
CRISIS = re.compile(r'14416|crisis|helpline|samaritans|\b988\b', re.I)
STOCK = r'(?:no shame language|spoken of with respect|women (?:are )?(?:always )?spoken of with respect|never graphically|told without detail|not an insult|not a verdict|with respect for all|without shame)'

def pages():
    return sorted(f[:-3] for f in os.listdir(TOP) if re.match(r'^[a-z0-9]+-\d+.*\.md$', f))

def strip():
    bak = os.path.join(ROOT, '.cache/prepass-backup'); os.makedirs(bak, exist_ok=True)
    log, total = [f'# Stock phrases removed ({date.today()})\n'], 0
    for pid in pages():
        p = os.path.join(TOP, pid + '.md'); src = open(p).read(); out = []
        for n, line in enumerate(src.split('\n'), 1):
            if CRISIS.search(line) or not re.search(STOCK, line, re.I):
                out.append(line); continue
            if re.match(r'^\s*- \[ \]', line) and len(re.sub(STOCK, '', line, flags=re.I).strip(' -[].;,')) < 25:
                log.append(f'- {pid}:{n} deleted checklist line: `{line.strip()[:120]}`'); total += 1; continue
            new = re.sub(r'\s*[;,]\s*' + STOCK + r'(?=[;,.)]|\s*$)', '', line, flags=re.I)      # "…; no shame language;" clause
            new = re.sub(r'\(\s*' + STOCK + r'\s*\)', '', new, flags=re.I)                     # "(no shame language)"
            if new != line:
                log.append(f'- {pid}:{n} `{line.strip()[:110]}` → `{new.strip()[:110]}`'); total += 1
            else:
                log.append(f'- {pid}:{n} LEFT FOR AGENT (inside a sentence): `{line.strip()[:120]}`')
            out.append(new)
        res = '\n'.join(out)
        if res != src:
            shutil.copy(p, os.path.join(bak, pid + '.md')); open(p, 'w').write(res)
    open(os.path.join(OUT, 'strip-log.md'), 'w').write('\n'.join(log) + '\n')
    print(f'{total} stock phrases removed; log research/prepass/strip-log.md')

def words(s):
    return re.findall(r'[a-z0-9]+', s.lower())

def best_window(q, text, size=None):
    """Closest passage in text to quote q, by word overlap over sliding sentence windows."""
    qs = set(words(q)); size = size or max(1, len(q) // 120 + 1)
    sents = re.split(r'(?<=[.!?])\s+', text); best, bs = 0.0, ''
    for i in range(len(sents)):
        w = ' '.join(sents[i:i + size]); ws = set(words(w))
        if not ws: continue
        sc = len(qs & ws) / max(1, len(qs))
        if sc > best: best, bs = sc, w
    return best, bs

BOOKFILES = {k: v for k, v in [
    ('tattva-sandarbha', 'Jiva_Goswami_Sri_Tattva_Sandarbha'), ('bhagavat-sandarbha', 'Jiva_Goswami_Sri_Bhagavat_Sandarbha'),
    ('paramatma-sandarbha', 'Jiva_Goswami_Sri_Paramatma_Sandarbha'), ('krsna-sandarbha', 'Jiva_Goswami_Sri_Krishna_Sandarbha'),
    ('krishna-sandarbha', 'Jiva_Goswami_Sri_Krishna_Sandarbha'), ('priti-sandarbha', 'Jiva_Goswami_Sri_Priti_Sandarbha'),
    ('bhakti-sandarbha', 'Jiva_Goswami_Sri_Bhakti_Sandarbha (OCR)'), ('jaiva-dharma', 'Bhaktivinoda_Thakura_Jaiva_Dharma'),
    ('brhad-bhagavatamrta', 'Sanatana_Goswami_Sri_Brhad_Bhagavatamrta'), ('laghu-bhagavatamrta', 'Rupa_Goswami_Sri_Laghu_Bhagavatamrta'),
    ('hari-bhakti-vilasa', 'Sanatana_Goswami_Hari_Bhakti_vilasa'), ('harinama-cintamani', 'Bhaktivinoda_Thakura_Hari_Nama_Cintamani'),
    ('prameya-ratnavali', 'Baladeva_Vidyabhusana_Prameya_Ratnavali'), ('govinda-bhasya', 'Baladeva_Vidyabhusana_Sri_Vedanta-sutra'),
    ('ujjvala-nilamani', 'Rupa_Goswami_Sri_Ujjvala_Nilamani'), ('gaura-ganoddesa', 'Kavi_Karnapura_Sri_Gaura_Ganodesa_Dipika'),
    ('caitanya-siksamrta', 'Bhaktivinoda_Thakura_Sri_Caitanya_Siksamrta'), ('tattva-sutra', 'Bhaktivinoda_Thakura_Tattva_sutra2'),
    ('dasa-mula', 'Bhaktivinoda_Thakura_Dasa_Mula_Tattva'), ('bhajana-rahasya', 'Bhaktivinoda_Thakura_Sri_Bhajana_Rahasya'),
    ('manah-siksa', 'Raghunatha_dasa_Goswami_Sri_Manah_Siksa'), ('prema-bhakti-candrika', 'Narottama_dasa_Thakura_Sri_Prema_bhakti_candrika'),
    ('raga-vartma', 'Visvanath_Cakravarti_Thakura_Sri_Sri_Raga_Vartma_Candrika'), ('bhagavatamrta-kanika', 'Visvanath_Cakravarti_Thakura_Sri_Bhagavatamrta_Kanika'),
    ('being guru', 'Bhaktisiddhanta_Sarasvati_Thakura_Being_Guru'), ('vaishnavism real', 'Bhaktisiddhanta_Sarasvati_Thakura_Vaishnavism_Real_and_Apparent'),
    ('sanmodana', 'Bhaktivinoda_Thakura_Sri_Sanmodana_Bhasyam'), ('sat-kriya', 'Gopala_Bhatta_Goswami_Sat_Kriya_Sara_Dipika')]}
_book_cache = {}
def book(name):
    if name not in _book_cache:
        p = os.path.join(BOOKS, name + '.txt'); _book_cache[name] = open(p, errors='ignore').read() if os.path.exists(p) else ''
    return _book_cache[name]

def prep():
    gate = {}
    for g in ('gate-bss-trd.json', 'gate-wave1.json', 'gate.json'):
        p = os.path.join(ROOT, 'research/verification', g)
        if os.path.exists(p): gate.update(json.load(open(p)))
    made = 0
    for pid in pages():
        src = open(os.path.join(TOP, pid + '.md')).read(); lines = src.split('\n'); md = []
        pk = os.path.join(PACKS, pid + '.json'); pack = json.load(open(pk)) if os.path.exists(pk) else {'verses': []}
        corpus = [(v['cite'], v['translation'] + ' ' + v['purport']) for v in pack.get('verses', [])]
        for f in gate.get(pid, {}).get('fail', []):
            m = re.match(r'line (\d+): quote not found in source: "(.*)"', f)
            if not m: continue
            n, q = int(m.group(1)), m.group(2).rstrip('…')
            full = re.findall(r'["“]([^"”]*' + re.escape(q[:30]) + r'[^"”]*)["”]', lines[n - 1]) if n <= len(lines) else []
            q = full[0] if full else q
            cands = sorted(((best_window(q, t), c) for c, t in corpus), key=lambda x: -x[0][0])[:1]
            if cands and cands[0][0][0] >= 0.5:
                (sc, w), c = cands[0]
                md.append(f'### Line {n}: quotation not found word for word\n> page: "{q}"\n\nClosest source ({c}, {sc:.0%} of the words): "{w}"\n\nFix: quote the source exactly, or remove the quotation marks and mark it as a paraphrase.\n')
            else:
                md.append(f'### Line {n}: quotation not found word for word\n> page: "{q}"\n\nNo close passage in the page\'s pack: check the source named on the page; if none, it is our wording: remove the quotation marks.\n')
        for n, line in enumerate(lines, 1):
            if not re.search(r'requires source review|unreadable|font-scrambled', line, re.I): continue
            low = line.lower(); hits = [(k, v) for k, v in BOOKFILES.items() if k in low]
            for k, v in hits[:2]:
                text = book(v)
                if not text: continue
                keys = [w for w in words(re.sub(r'\b(requires|source|review|unreadable|font|scrambled|cited|only|through)\b', '', low)) if len(w) > 5][:12]
                paras = [p for p in re.split(r'\n\s*\n', text) if len(p) > 200]
                scored = sorted(((len(set(keys) & set(words(p))), p) for p in paras), key=lambda x: -x[0])[:2]
                if not scored or scored[0][0] < 2: continue
                md.append(f'### Line {n}: "Requires source review" for {k}, which is now readable (research/books/{v}.txt)\n> page: {line.strip()[:200]}\n\n' +
                          '\n\n'.join(f'Candidate passage ({s} matching words):\n```\n{p.strip()[:900]}\n```' for s, p in scored) +
                          '\n\nFix: if a candidate supports the point, quote it exactly with chapter/anuccheda and remove the review note.\n')
        if md:
            open(os.path.join(OUT, pid + '.md'), 'w').write(f'# {pid}: prepared for the combined pass ({date.today()})\n\n' + '\n'.join(md)); made += 1
    print(f'{made} prep files → research/prepass/')

if __name__ == '__main__':
    {'strip': strip, 'prep': prep}[sys.argv[1]]()
