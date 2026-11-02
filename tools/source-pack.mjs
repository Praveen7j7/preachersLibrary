// Source pack per topic (head, 30 Oct 2026: "what agents bring must be cached, so later changes never fetch again").
// For every topic page, research/packs/<id>.json gathers everything the page stands on, in full:
//   verses   every verse cited anywhere on the page (references, body, section R for deeper levels): translation + full purport
//   quotes   every quotation on the page, with the source it was found in and the surrounding passage
//   stories  the story index entries mapped to this topic
//   links    every link on the page
// Writers keep a "Further sources" list in research/packs/<id>.notes.md (candidate verses, passages, stories for other
// levels or deeper sessions). Later edits read the pack first and fetch only what is genuinely new. No model tokens.
// Usage: node tools/source-pack.mjs [ids or batch prefixes...]      (no arguments = every page)
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOPICS = join(ROOT, 'content/topics'), CACHE = join(ROOT, '.cache/vedabase'), OUT = join(ROOT, 'research/packs');
const BIKC = join(ROOT, 'research/iyf-materials/iyf-drive-4/7. Brahmacarya in Krishna consciousness - Bhakti Vikasa Swami.pdf.txt');
mkdirSync(OUT, { recursive: true }); mkdirSync(CACHE, { recursive: true });

const cacheFile = url => join(CACHE, url.replace(/^https?:\/\//, '').replace(/\//g, '_'));
const lines = h => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, '\n')
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
  .split('\n').map(s => s.trim()).filter(Boolean);
function verse(url) {
  const f = cacheFile(url); if (!existsSync(f)) return null;
  const t = lines(readFileSync(f, 'utf8'));
  const i = t.findIndex(s => /^Translation$/i.test(s)), j = t.findIndex(s => /^Purport$/i.test(s));
  if (i < 0) return null;
  const end = t.findIndex((s, x) => x > Math.max(i, j) && /^(Donate|Previous|Next)$/.test(s));
  return { translation: t.slice(i + 1, j > i ? j : i + 2).join(' '), purport: j > 0 ? t.slice(j + 1, end > j ? end : undefined).join('\n') : '' };
}
const words = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const BAL = { 'é': 'i', 'É': 'I', 'å': 'r', 'ñ': 's', 'ë': 'n', 'ç': 's', 'ö': 't', 'ò': 'd', 'ì': 'n', 'ï': 'n', 'à': 'm', 'ù': 'h', 'Å': 'R', 'Ñ': 'S', 'Ç': 'S' };
// normalized letters with a map back to raw positions, so a found quote can be shown in its surrounding passage
function index(raw, legacy) {
  const src = legacy ? raw.replace(/[éÉåñëçöòìïàùÅÑÇ]/g, c => BAL[c]) : raw;
  const memo = new Map(), parts = [], at = [];
  for (let k = 0; k < src.length; k++) {
    const ch = src[k]; let w = memo.get(ch); if (w === undefined) { w = words(ch).replace(/ /g, ''); memo.set(ch, w); }
    for (const c of w) { parts.push(c); at.push(k); } }
  return { s: parts.join(''), at, raw };
}
const citeUrls = src => {
  const set = new Set();
  for (const m of src.matchAll(/\b(BG|SB|CC (Adi|Ādi|Madhya|Antya)|NOI|ISO|Iso)\s+(\d+(?:\.\d+)*)(?:[-–](\d+))?/g)) {
    const n = m[3].split('.'), book = m[1].startsWith('CC') ? 'cc/' + m[2].replace('Ā', 'A').toLowerCase() : m[1].toLowerCase();
    if (n.length !== ({ bg: 2, sb: 3, noi: 1, iso: 1 }[book] ?? 2)) continue;
    const cite = m[0].replace('Ādi', 'Adi'), base = `https://vedabase.io/en/library/${book}/`;
    set.add(JSON.stringify([cite, base + n.join('/') + '/']));
    if (m[4]) set.add(JSON.stringify([cite, base + n.slice(0, -1).join('/') + '/' + n.at(-1) + '-' + m[4] + '/']));
  }
  return [...set].map(x => JSON.parse(x));
};

const args = process.argv.slice(2);
const files = readdirSync(TOPICS).filter(f => /^[a-z0-9]+-\d+.*\.md$/.test(f)).filter(f => !args.length || args.some(a => f === a + '.md' || f.startsWith(a + '-')));
const STORIES = existsSync(join(ROOT, 'data/stories.json')) ? JSON.parse(readFileSync(join(ROOT, 'data/stories.json'), 'utf8')) : [];
const packs = {}, pending = [];
for (const f of files) {
  const id = f.slice(0, -3), src = readFileSync(join(TOPICS, f), 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '', get = k => fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.replace(/^"|"$/g, '') ?? '';
  const vf = join(ROOT, 'research/verification', id + '.json'), ver = existsSync(vf) ? JSON.parse(readFileSync(vf, 'utf8')) : {};
  const pairs = new Map((ver.results ?? []).filter(r => r.url).map(r => [r.url, r.cite]));
  for (const [cite, url] of citeUrls(src)) if (!pairs.has(url)) pairs.set(url, cite);
  const verses = [];
  for (const [url, cite] of pairs) {
    if (!existsSync(cacheFile(url))) { try { const r = await fetch(url); if (r.ok) writeFileSync(cacheFile(url), await r.text()); await new Promise(z => setTimeout(z, 300)); } catch {} }
    const v = verse(url); if (v) verses.push({ cite, url, ...v });
  }
  const quotes = [];
  for (const m of src.replace(/[“”]/g, '"').matchAll(/"([^"\n]{24,})"/g)) if (words(m[1]).split(' ').length >= 5) quotes.push({ text: m[1] });
  for (const q of quotes) { const x = words(q.text.split(/…|\.\.\./)[0]).replace(/ /g, '');
    const hit = verses.find(v => words(v.translation + ' ' + v.purport).replace(/ /g, '').includes(x)); if (hit) q.source = hit.cite; else pending.push([id, q]); }
  packs[id] = { id, title: get('title'), batch: get('batch'), built: new Date().toISOString(),
    note: 'Read this pack (and ' + id + '.notes.md) before fetching anything. Add what you newly read to the notes file.',
    verses, quotes, extracts: ver.purportExtracts ?? undefined,
    stories: STORIES.filter(s => String(s.topics ?? '').includes(id)),
    links: [...new Set(src.match(/https?:\/\/[^\s)\]>"]+/g) ?? [])] };
}
// quotations not in the page's verses: look them up book by book (BIKC, Sen, OCR'd acarya books, Ganguli, Griffith)
const books = [BIKC, ...readdirSync(join(ROOT, 'research/books')).filter(f => f.endsWith('.txt')).map(f => join(ROOT, 'research/books', f))].filter(existsSync);
for (const b of books) {
  if (!pending.some(([, q]) => !q.source)) break;
  const ix = index(readFileSync(b, 'utf8'), b === BIKC), name = b.split('/').pop().replace(/\.txt$/, '');
  for (const [, q] of pending) { if (q.source) continue; const x = words(q.text.split(/…|\.\.\./)[0]).replace(/ /g, ''); if (x.length < 20) continue;
    const k = ix.s.indexOf(x); if (k < 0) continue;
    const a = ix.at[k], z = ix.at[Math.min(ix.at.length - 1, k + x.length)];
    q.source = name === BIKC.split('/').pop().replace(/\.txt$/, '') ? 'BIKC' : name;
    q.context = ix.raw.slice(Math.max(0, a - 700), Math.min(ix.raw.length, z + 700)); }
}
let nv = 0, nq = 0, nu = 0;
for (const [id, p] of Object.entries(packs)) {
  writeFileSync(join(OUT, id + '.json'), JSON.stringify(p, null, 1) + '\n');
  const notes = join(OUT, id + '.notes.md');
  if (!existsSync(notes)) writeFileSync(notes, `# ${id}: material read but not (yet) on the page\n\n## Further sources\nVerses, purport passages, book passages, letters and stories relevant to this topic that the page does not use,\neach with its exact location (cite, book file + chapter/anuccheda, URL) and the level or deeper session it would serve.\n`);
  nv += p.verses.length; nq += p.quotes.filter(q => q.source).length; nu += p.quotes.filter(q => !q.source).length;
}
console.log(`${Object.keys(packs).length} packs → research/packs/ · ${nv} verses with full purports · ${nq} quotes traced · ${nu} quotes not traced (own words, decks, web sources)`);
