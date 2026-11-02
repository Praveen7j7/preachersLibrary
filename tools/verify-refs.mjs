// Check that cited verses exist and record their translation from vedabase.io
// (BBT editions of Srila Prabhupada's books).
//
// A topic file lists its citations in front matter:
//   references:
//     - BG 2.14
//     - SB 1.8.25
//     - CC Madhya 23.14-15
//     - NOI 3
// Usage:
//   node tools/verify-refs.mjs content/topics/vl1-06.md [...]   -> research/verification/<id>.json
//   node tools/verify-refs.mjs --cite "BG 2.14" "SB 1.9.16"     -> prints only
//
// "exists" proves the reference is real; it does not prove the topic's use of it is fair.
// That second check is the editor's, against the translation and purport saved here.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://vedabase.io/en/library';

// Citation -> candidate vedabase paths (a range may be one joined page or separate pages).
function paths(cite) {
  const c = cite.trim().replace(/\s+/g, ' ');
  let m;
  if ((m = c.match(/^BG (\d+)\.(\d+(?:-\d+)?)$/i))) return variants(`bg/${m[1]}`, m[2]);
  if ((m = c.match(/^SB (\d+)\.(\d+)\.(\d+(?:-\d+)?)$/i))) return variants(`sb/${m[1]}/${m[2]}`, m[3]);
  if ((m = c.match(/^CC (Adi|Madhya|Antya) (\d+)\.(\d+(?:-\d+)?)$/i))) return variants(`cc/${m[1].toLowerCase()}/${m[2]}`, m[3]);
  if ((m = c.match(/^(NOI|ISO) (\d+|Invocation)$/i))) return [`${m[1].toLowerCase()}/${m[2].toLowerCase()}`];
  if ((m = c.match(/^Bs 5\.(\d+)$/i))) return [`bs/5/${m[1]}`];
  if ((m = c.match(/^(NOD|TLC|KB) (?:ch\.? ?)?(\d+)$/i))) return [`${m[1].toLowerCase()}/${m[2]}`];
  return null;
}

// Vedabase prints some verses as one joined page (BG 6.13-14), so a single verse may only
// exist inside a neighbouring range.
function variants(prefix, verse) {
  const [a] = verse.split('-');
  if (verse.includes('-')) return [`${prefix}/${verse}`, `${prefix}/${a}`];
  const v = +verse;
  return [`${prefix}/${v}`, `${prefix}/${v - 1}-${v}`, `${prefix}/${v}-${v + 1}`, `${prefix}/${v - 2}-${v}`, `${prefix}/${v}-${v + 2}`];
}

function plain(html) {
  return html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
}

async function check(cite) {
  const cands = paths(cite);
  if (!cands) return { cite, status: 'unsupported-format' };
  for (const p of cands) {
    const url = `${BASE}/${p}/`;
    const r = await fetch(url, { headers: { 'User-Agent': 'IYF preacher-library reference check' } });
    if (r.status === 404) continue;
    if (!r.ok) return { cite, url, status: `http-${r.status}` };
    const t = plain(await r.text());
    const title = t.match(/^\s*(.*?)\s+(?:Bhaktivedanta VedaBase|Vedabase)/i)?.[1]?.slice(0, 120) ?? '';
    const i = t.indexOf(' Translation ');
    const j = t.indexOf(' Purport ', i);
    const translation = i >= 0 ? t.slice(i + 13, j > i ? Math.min(j, i + 13 + 900) : i + 13 + 900)
      .split(/\s(?:Text \d+|TEXT \d+|CHAPTER [A-Z]+|Donate)\b/)[0].trim() : '';
    const purport = j >= 0 ? t.slice(j + 9, j + 9 + 400).trim() : '';
    return {
      cite, url, status: translation || p.startsWith('nod/') || p.startsWith('tlc/') ? 'exists' : 'exists-no-translation-found',
      partial: p === cands[0] ? undefined
        : cite.includes('-') ? `range page not found; checked first verse only (${p})`
        : `verse is printed on the joined page ${p}`,
      title, translation, purportStart: purport,
    };
  }
  return { cite, status: 'not-found', tried: cands.map(p => `${BASE}/${p}/`) };
}

function refsFromTopic(file) {
  const src = readFileSync(file, 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const block = fm.match(/^references:\n((?:\s+- .*\n?)*)/m)?.[1] ?? '';
  return block.split('\n').map(l => l.replace(/^\s+- /, '').replace(/\s+#.*$/, '').trim()).filter(Boolean);
}

const args = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
if (args[0] === '--cite') {
  for (const c of args.slice(1)) { console.log(JSON.stringify(await check(c), null, 1)); await sleep(400); }
} else {
  mkdirSync(join(ROOT, 'research/verification'), { recursive: true });
  for (const file of args) {
    const refs = refsFromTopic(file);
    const results = [];
    for (const c of refs) { results.push(await check(c)); await sleep(400); }
    const id = basename(file, '.md');
    const out = join(ROOT, `research/verification/${id}.json`);
    // keep editors' additions (e.g. purportExtracts) across re-runs
    let prev = {};
    try { prev = JSON.parse(readFileSync(out, 'utf8')); } catch {}
    writeFileSync(out,
      JSON.stringify({ ...prev, topic: id, checked: new Date().toISOString(), source: BASE, results }, null, 1) + '\n');
    const bad = results.filter(r => !r.status.startsWith('exists'));
    console.log(`${id}: ${results.length} refs, ${results.length - bad.length} exist` +
      (bad.length ? `; PROBLEMS: ${bad.map(b => `${b.cite} (${b.status})`).join(', ')}` : ''));
  }
}
