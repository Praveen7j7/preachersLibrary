// Collect the Sanskrit (Devanagari + transliteration) of every verified verse into data/slokas.json, from the
// vedabase pages that tools/verify-refs.mjs already found. The site shows it under each verse (build-site.mjs), and it
// feeds the Slokas section. No model tokens; pages fetched once and cached in .cache/vedabase/.
//
// Usage: node tools/slokas.mjs        (run after verify-refs; safe to re-run, only new verses are fetched)

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, '.cache/vedabase');
const OUTF = join(ROOT, 'data/slokas.json');
mkdirSync(CACHE, { recursive: true });

const want = new Map();   // cite -> { url, translation }
for (const f of readdirSync(join(ROOT, 'research/verification')).filter(f => f.endsWith('.json'))) {
  const d = JSON.parse(readFileSync(join(ROOT, 'research/verification', f), 'utf8'));
  for (const r of d.results ?? []) if (r.status === 'exists' && r.url && !want.has(r.cite)) want.set(r.cite, { url: r.url, translation: r.translation ?? '' });
}

const out = existsSync(OUTF) ? JSON.parse(readFileSync(OUTF, 'utf8')) : {};
const field = (h, cls) => {
  const m = h.match(new RegExp(`class="${cls}"[^>]*>([\\s\\S]*?)</div>\\s*</div>`));
  if (!m) return '';
  return m[1].replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/^\s*(Devanagari|Verse text|Bengali)\s*/, '').split('\n').map(l => l.trim()).filter(Boolean).join('\n');
};

let fetched = 0, missing = [];
for (const [cite, { url, translation }] of want) {
  if (out[cite]?.dev || out[cite]?.iast) continue;
  const file = join(CACHE, url.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_') + '.html');
  let h = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (!h) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (IYF Preacher Library slokas)' }, signal: AbortSignal.timeout(30000) });
      h = r.ok ? await r.text() : '';
      if (h) writeFileSync(file, h);
    } catch { h = ''; }
    fetched++; await new Promise(s => setTimeout(s, 300));
  }
  const dev = field(h, 'av-devanagari') || field(h, 'av-bengali'), iast = field(h, 'av-verse_text');
  if (dev || iast) out[cite] = { url, dev, iast, translation };
  else missing.push(cite);   // prose works (NOD, KB chapters) have no verse text: expected
}
const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
writeFileSync(OUTF, JSON.stringify(sorted, null, 1) + '\n');
console.log(`${Object.keys(sorted).length} verses with Sanskrit in data/slokas.json · fetched ${fetched} · no verse text ${missing.length}` +
  (missing.length ? ` (e.g. ${missing.slice(0, 6).join(', ')})` : ''));
