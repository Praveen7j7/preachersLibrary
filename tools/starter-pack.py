"""Starter packs for topics not yet written (head, 2 Nov 2026: what agents bring must be reused; prepare before writing).
For each unwritten topic (default: SPS and DPS), research/packs/<id>.starter.json gathers, with no model tokens:
  - the catalogue entry (title, site rows, the batches it also appears in)
  - IYF's own material for its site rows (manifest: readable files, with their paths)
  - its sources-map entry (supporting sources already matched)
  - related pages already written (same topic in other batches, then title-word overlap), with their verses (cite +
    translation) and traced quotations taken from those pages' source packs
  - stories mapped to the topic or its related pages
Writers read this first, then fetch only what is missing.   Usage: python3 tools/starter-pack.py [sps dps ...]
"""
import json, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
J = lambda p: json.load(open(os.path.join(ROOT, p)))
cur, man = J('data/curriculum.json'), J('research/iyf-materials/manifest.json')
smap = J('data/sources-map.json') if os.path.exists(os.path.join(ROOT, 'data/sources-map.json')) else {}
stories = J('data/stories.json')
written = {f[:-3] for f in os.listdir(os.path.join(ROOT, 'content/topics')) if re.match(r'^[a-z0-9]+-\d+.*\.md$', f)}
topics = {t['id']: t for t in cur['topics'] if t.get('kind') == 'topic'}
STOP = set('the of and a to in is for on with what how why my our your be from as at by an or it this that who are'.split())
kw = lambda s: {w for w in re.findall(r'[a-z]+', (s or '').lower()) if len(w) > 2 and w not in STOP}

def pack(pid):
    p = os.path.join(ROOT, 'research/packs', pid + '.json')
    return json.load(open(p)) if os.path.exists(p) else None

batches = sys.argv[1:] or ['sps', 'dps']
made = 0
for tid, t in topics.items():
    if t['batch'] not in batches or tid in written: continue
    rel = [i for i in t.get('alsoIn', []) if i in written]
    tk = kw(t['title'])
    scored = sorted(((len(tk & kw(topics[w]['title'])), w) for w in written if w in topics and w not in rel), reverse=True)
    rel += [w for s, w in scored[:4] if s >= 2]
    related = []
    for r in rel[:5]:
        pk = pack(r) or {}
        related.append({'id': r, 'title': topics.get(r, {}).get('title', ''),
                        'verses': [{'cite': v['cite'], 'translation': v['translation']} for v in pk.get('verses', [])][:30],
                        'quotes': [q for q in pk.get('quotes', []) if q.get('source')][:25]})
    mats = []
    for row in t.get('siteRows', []):
        for key in man.get('rows', {}).get(row, []):
            it = man['items'].get(key, {})
            if it.get('status') == 'text' and it.get('file'): mats.append({'row': row, 'name': it.get('name', ''), 'file': it['file'], 'url': it.get('url', '')})
    st = [s for s in stories if tid in str(s.get('topics', '')) or any(r in str(s.get('topics', '')) for r in rel)]
    out = {'id': tid, 'title': t['title'], 'batch': t['batch'], 'siteRows': t.get('siteRows', []), 'alsoIn': t.get('alsoIn', []),
           'note': 'Starter pack: read before fetching anything. Related pages are already written; reuse, link, do not repeat.',
           'iyfMaterials': mats, 'sourcesMap': smap.get(tid), 'related': related,
           'stories': [{k: s.get(k) for k in ('id', 'title', 'source', 'keyVerse', 'url', 'lesson')} for s in st][:12]}
    os.makedirs(os.path.join(ROOT, 'research/packs'), exist_ok=True)
    json.dump(out, open(os.path.join(ROOT, 'research/packs', tid + '.starter.json'), 'w'), indent=1); made += 1
print(f'{made} starter packs → research/packs/<id>.starter.json')
