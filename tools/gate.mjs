// Quality gate (head, 30 Oct 2026: the optimised path must give output equal to an all-Fable run). Every page, whichever
// model wrote it, must pass before it counts as done. No model tokens.
//   1. sections A–R and S1–S8 present; within the line cap
//   2. research/verification/<id>.json: every reference exists
//   3. no banned softening phrases (head: "as it is, no softening")
//   4. every quotation attributed to scripture, a purport, Srila Prabhupada, BIKC or the Purana is found word for word in
//      the saved source: the page's vedabase pages (.cache/vedabase/, fetched if missing), BIKC, Sen, research/books/
// Usage: node tools/gate.mjs [ids or batch prefixes...]   e.g.  node tools/gate.mjs bss trd   |   node tools/gate.mjs trd-08
// Report: research/verification/gate.json. Exit code 1 if any page fails.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOPICS = join(ROOT, 'content/topics'), CACHE = join(ROOT, '.cache/vedabase');
// Line caps follow the session format: 3-hour batches (TRD, VL2, VL3) carry full narrations ("history as it is").
const CAPS = { trd: [450, 560], vl2: [450, 560], vl3: [450, 560] }, CAP_DEF = [400, 480];
const BANNED = [/no shame language/i, /not an insult/i, /\bnot a verdict\b/i, /a prayer, not a/i, /not a (condemnation|criticism|judge?ment)\b/i, /not a judge?ment (on|of)/i, /do not read (it|this|them|those)( parts)? out/i,
  /teach (it as )?the principle only/i, /principle only/i, /gentler (gita )?language/i, /never graphically/i, /told without detail/i,
  /spoken of with respect/i, /(harsh|strong) wording (deliberately )?not repeated/i, /leave out (verses|\d)/i];
// A quotation counts as attributed (and must match) when the words just before it name a source, or a citation follows it.
const BEFORE = /(purport|translation|\bBIKC\b|ch\.\s*\d+|\bSen\b|Purana|the text|the verse|Prabhupāda|Prabhupada|(Lord|Krishna|Kṛṣṇa|Kapila|Narada|Nārada) (says|said))[^".]{0,25}[:,]?\s*$/i;
const AFTER = /^[\s,.;:]{0,3}\((BG|SB|CC|NOI|NOD|ISO|Bs|BIKC|Sen|p\.|pp\.|ch\.|Madhya|Adi|Antya)/;
// Old Balarama-font encoding in the BIKC text (å=ṛ, ñ=ṣ, ë=ṇ, ç=ś, ö=ṭ, ò=ḍ, ì=ṅ, ï=ñ, à=ṁ, ù=ḥ; ä é ü are long vowels).
const BAL = { 'é': 'i', 'É': 'I', 'å': 'r', 'ñ': 's', 'ë': 'n', 'ç': 's', 'ö': 't', 'ò': 'd', 'ì': 'n', 'ï': 'n', 'à': 'm', 'ù': 'h', 'Å': 'R', 'Ñ': 'S', 'Ç': 'S' };

const words = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// Matching compares letters only (no spaces or punctuation): the PDF texts split words ("th ese") and hyphenate line ends.
const norm = s => words(s).replace(/ /g, '');
const normLegacy = s => norm(s.replace(/[éÉåñëçöòìïàùÅÑÇ]/g, c => BAL[c]).replace(/-\s*\n\s*/g, ''));
const htmlText = h => h.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\"/g, '"').replace(/<[^>]+>/g, ' ')
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const cacheFile = url => join(CACHE, url.replace(/^https?:\/\//, '').replace(/\//g, '_'));

let BIG = null;   // all cached vedabase pages + BIKC + Sen + research/books, loaded only when a quote is not in the page's own pages
const big = () => BIG ??= [...readdirSync(CACHE).map(f => norm(htmlText(readFileSync(join(CACHE, f), 'utf8')))),
  ...[join(ROOT, 'research/iyf-materials/iyf-drive-4/7. Brahmacarya in Krishna consciousness - Bhakti Vikasa Swami.pdf.txt'),
  ...readdirSync(join(ROOT, 'research/books')).filter(f => f.endsWith('.txt')).map(f => join(ROOT, 'research/books', f))]
  .filter(existsSync).map(f => normLegacy(readFileSync(f, 'utf8')))].join('|');

async function vedabase(urls) {
  mkdirSync(CACHE, { recursive: true });
  const out = [];
  for (const u of urls) {
    const f = cacheFile(u);
    if (!existsSync(f)) { try { const r = await fetch(u); if (r.ok) writeFileSync(f, await r.text()); await new Promise(z => setTimeout(z, 300)); } catch {} }
    if (existsSync(f)) out.push(norm(htmlText(readFileSync(f, 'utf8'))));
  }
  return out.join('|');
}

const args = process.argv.slice(2);
const files = readdirSync(TOPICS).filter(f => /^[a-z0-9]+-\d+.*\.md$/.test(f))
  .filter(f => !args.length || args.some(a => f === a + '.md' || f.startsWith(a + '-')));
const report = {}; let failed = 0;
for (const f of files) {
  const id = f.slice(0, -3), src = readFileSync(join(TOPICS, f), 'utf8'), lines = src.split('\n');
  const fail = [], note = [];
  // 1. structure
  for (const l of 'ABCDEFGHIJKLMNOPQR') if (!new RegExp(`^## ${l}\\.`, 'm').test(src)) fail.push(`section ${l} missing`);
  for (let k = 1; k <= 8; k++) if (!new RegExp(`^## S${k}\\.`, 'm').test(src)) fail.push(`section S${k} missing`);
  const [CAP, CAP_HARD] = CAPS[id.split('-')[0]] ?? CAP_DEF;
  // Head, 30 Oct: the page must meet the topic's need end to end; length is a reminder (trim repetition), never a reason to cut.
  if (lines.length > CAP) note.push(`${lines.length} lines (guide ${CAP}–${CAP_HARD}): trim only repetition or padding`);
  // 2. references
  const vf = join(ROOT, 'research/verification', id + '.json');
  const refs = (src.match(/^references:\n((?:\s+- .*\n?)*)/m)?.[1] ?? '').split('\n').filter(x => x.trim());
  let urls = [];
  if (!existsSync(vf)) fail.push('no verification file (run verify-refs)');
  else {
    const v = JSON.parse(readFileSync(vf, 'utf8')), res = v.results ?? [];
    const bad = res.filter(r => !String(r.status).startsWith('exists'));
    if (bad.length) fail.push('refs not found: ' + bad.map(r => r.cite).join(', '));
    if (res.length < refs.length) fail.push(`verify-refs stale (${res.length} checked, ${refs.length} listed)`);
    urls = res.map(r => r.url).filter(Boolean);
  }
  // 3. banned softening phrases (crisis/helpline lines are a separate decision and are not checked)
  lines.forEach((l, i) => { if (/14416|crisis|helpline|samaritans|988/i.test(l)) return;
    for (const b of BANNED) if (b.test(l)) { fail.push(`line ${i + 1}: softening "${l.match(b)[0]}"`); break; } });
  // 4. quotations. Sources searched: the page's references, every verse cited anywhere on the page, every vedabase link on
  // the page (letters, lectures), all vedabase pages already cached, BIKC, Sen and research/books.
  const cited = new Set(urls);
  for (const m of src.matchAll(/https:\/\/vedabase\.io\/en\/library\/[^\s)\]>"]+/g)) cited.add(m[0].endsWith('/') ? m[0] : m[0] + '/');
  for (const m of src.matchAll(/\b(BG|SB|CC (Adi|Ādi|Madhya|Antya)|NOI|ISO|Iso)\s+(\d+(?:\.\d+)*)(?:[-–](\d+))?/g)) {
    const n = m[3].split('.'), book = m[1].startsWith('CC') ? 'cc/' + m[2].replace('Ā', 'A').toLowerCase() : m[1].toLowerCase().replace('iso', 'iso');
    const need = { bg: 2, sb: 3, noi: 1, iso: 1 }[book] ?? 2; if (n.length !== need) continue;
    cited.add(`https://vedabase.io/en/library/${book}/${n.join('/')}/`);
    if (m[4]) cited.add(`https://vedabase.io/en/library/${book}/${n.slice(0, -1).join('/')}/${n.at(-1)}-${m[4]}/`);
  }
  const own = await vedabase([...cited]);
  // found = exact letter sequence; a fragment of 10+ words also passes when 90% of its 4-word runs are found (one OCR slip).
  const found = frag => { const w = words(frag).split(' '), x = w.join('');
    if (own.includes(x) || big().includes(x)) return true;
    if (w.length < 10) return near(x, own) || near(x, big());
    const runs = []; for (let k = 0; k + 4 <= w.length; k++) runs.push(w.slice(k, k + 4).join(''));
    if (runs.filter(r => own.includes(r) || big().includes(r)).length >= runs.length * 0.9) return true;
    return near(x, own) || near(x, big()); };
  // OCR tolerance: anchor on a 12-letter piece of the quote, then allow 1 wrong letter in 25 over the whole quote.
  const lev = (a, b) => { const d = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i;
      for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; } }
    return d[b.length]; };
  const near = (x, hay) => { if (x.length < 30) return false; const tol = Math.max(2, Math.floor(x.length / 25));
    for (const off of [0, Math.floor(x.length / 2) - 6, x.length - 12]) { const a = x.slice(off, off + 12); let k = hay.indexOf(a), n = 0;
      while (k >= 0 && n++ < 50) { const st = Math.max(0, k - off - tol); if (lev(x, hay.slice(st, st + x.length + 2 * tol)) <= tol * 3) {
          const w = hay.slice(st, st + x.length + 2 * tol); let best = Infinity;
          for (let s = 0; s <= 2 * tol; s++) for (let e = x.length - tol; e <= x.length + tol; e++) best = Math.min(best, lev(x, w.slice(s, s + e)));
          if (best <= tol) return true; }
        k = hay.indexOf(a, k + 1); } }
    return false; };
  lines.forEach((l, i) => {
    const t = l.replace(/[“”]/g, '"'), odd = (t.match(/"/g) || []).length % 2 === 1;   // odd count: pairing unsure → note only
    let prevEnd = 0;
    for (const m of t.matchAll(/"([^"]*)"/g)) {            // quotes taken in pairs, in order
      const from = prevEnd; prevEnd = m.index + m[0].length;
      if (m[1].length < 24) continue;
      const frags = m[1].split(/…|\.\.\.|\[\.\.\.\]/).filter(x => words(x).split(' ').length >= 5);
      if (!frags.length || frags.every(found)) continue;
      const attributed = !odd && (BEFORE.test(t.slice(Math.max(from, m.index - 80), m.index)) || (!/\?\s*$/.test(m[1]) && AFTER.test(t.slice(m.index + m[0].length))) || /^\s*>/.test(l));
      (attributed ? fail : note).push(`line ${i + 1}: quote not found in source: "${m[1].slice(0, 70)}${m[1].length > 70 ? '…' : ''}"`);
    }
  });
  report[id] = { pass: !fail.length, lines: lines.length, fail, note };
  if (fail.length) failed++;
  console.log(`${fail.length ? 'FAIL' : 'pass'} ${id}` + (fail.length ? `: ${fail.length} issue(s)` : '') + (note.length ? ` · ${note.length} note(s)` : ''));
}
writeFileSync(join(ROOT, 'research/verification/gate.json'), JSON.stringify(report, null, 1) + '\n');
console.log(`${files.length - failed}/${files.length} pass → research/verification/gate.json`);
process.exit(failed ? 1 : 0);
