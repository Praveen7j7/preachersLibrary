// Snapshot the live IYF Preachers Library catalogue (https://iyf-lectures.vercel.app/).
//
// The site is a Vite SPA: its batch list is hard-coded in the JS bundle and its topics
// ("sessions") come from a public Supabase table. This script reads the bundle to find
// the endpoint, the public (anon) key and the batch list, then makes the same read-only
// query the site makes (published sessions + resources). Nothing is written to the site.
//
// Usage: node tools/fetch-catalogue.mjs
// Writes: research/catalogue-snapshot-<date>.json, data/curriculum.json,
//         research/catalogue-inventory.md

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://iyf-lectures.vercel.app';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const today = new Date().toISOString().slice(0, 10);

// Short, stable batch codes for topic IDs. Keyed by the site's category id.
const CODE = {
  'vedic-level-1': 'vl1', dys: 'dys', 'vedic-level-2': 'vl2', 'vedic-level-3': 'vl3',
  'sps-2': 'sps2', 'sps-1': 'sps1', dps: 'dps', bss: 'bss',
};

async function text(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.text();
}

function must(value, what) {
  if (!value) throw new Error(`could not find ${what} in the site bundle; the site changed`);
  return value;
}

// Strip CSV-import debris (stray quotes, doubled quotes) without changing wording.
function clean(title) {
  return title.replace(/""/g, '"').replace(/^"+|"+$/g, '').replace(/\s+/g, ' ').trim();
}

// Key used only to detect the same topic taught in several batches.
function topicKey(title) {
  return clean(title).toLowerCase()
    .replace(/buidling/g, 'building')
    .replace(/^\d+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 38);
}

const html = await text(SITE + '/');
const bundlePath = must(html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1], 'bundle path');
const js = await text(SITE + bundlePath);
const supabaseUrl = must(js.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0], 'Supabase URL');
const anonKey = must(js.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[\w-]+\.[\w-]+/)?.[0], 'public key');
const catSrc = must(js.match(/xn=(\[\{id:"vedic-level-1".*?\}\])/)?.[1], 'batch list');
const batches = [...catSrc.matchAll(/\{id:"([^"]+)",name:"([^"]+)",shortName:"([^"]+)",description:"([^"]*)",order:(\d+)\}/g)]
  .map(([, id, name, shortName, description, order]) => ({ id, name, shortName, description, order: +order }));
must(batches.length, 'batches');

const q = `${supabaseUrl}/rest/v1/sessions?select=*,resources(*)&status=eq.published&order=session_number.asc`;
const r = await fetch(q, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Range: '0-4999' } });
if (!r.ok) throw new Error(`sessions -> ${r.status}`);
const sessions = await r.json();

mkdirSync(join(ROOT, 'research'), { recursive: true });
mkdirSync(join(ROOT, 'data'), { recursive: true });
writeFileSync(join(ROOT, `research/catalogue-snapshot-${today}.json`),
  JSON.stringify({ fetched: new Date().toISOString(), site: SITE, bundle: bundlePath, batches, sessions }, null, 1));

// BSS rows are an imported spreadsheet: a '"BIKC (...)' header row, then chapter rows
// "N. Title" from the book Brahmacarya in Krsna Consciousness. Mark both.
const rowsOut = [];
for (const b of batches) {
  let inBikc = false;
  const rows = sessions.filter(s => s.category_id === b.id).sort((a, z) => a.session_number - z.session_number);
  for (const s of rows) {
    const code = CODE[b.id] ?? b.id;
    const title = clean(s.title);
    const t = {
      id: `${code}-${String(s.session_number).padStart(2, '0')}`,
      sourceId: s.id,
      batch: code,
      number: s.session_number,
      title,
      rawTitle: s.title,
      subtitle: clean(s.subtitle || ''),
      status: 'existing',
      kind: 'topic',
      materials: { folder: Boolean(s.folder_link), resources: s.resources.map(x => x.type) },
      updated: s.updated_at,
    };
    if (/^BIKC\b/.test(title)) { t.kind = 'group-header'; inBikc = true; }
    else if (inBikc && /^\d+\.\s/.test(title)) { t.group = 'BIKC'; t.bikcChapter = +title.match(/^(\d+)\./)[1]; }
    else inBikc = false;
    rowsOut.push(t);
  }
}

// Gaps in the site's own numbering (could be removed or unpublished sessions).
const gaps = {};
for (const b of batches) {
  const nums = rowsOut.filter(t => t.batch === CODE[b.id]).map(t => t.number);
  const missing = [];
  for (let n = 1; n < Math.max(...nums); n++) if (!nums.includes(n)) missing.push(n);
  if (missing.length) gaps[CODE[b.id]] = missing;
}

// IYF decision (28 Oct 2026): SPS2 and SPS1 are one batch, SPS, taught SPS2 first and then SPS1.
// A topic on both lists becomes one SPS topic that keeps every site row it came from.
const SPS_SAME = { 'sps1-04': 'sps2-20' }; // same topic, differently titled
const topics = [];
const spsByKey = new Map();
let spsN = 0;
for (const r of rowsOut) {
  if (r.batch !== 'sps2' && r.batch !== 'sps1') { topics.push({ ...r, siteRows: [r.id] }); continue; }
  const twin = SPS_SAME[r.id] ? topics.find(t => t.siteRows?.includes(SPS_SAME[r.id])) : spsByKey.get(topicKey(r.title));
  if (twin) {
    twin.siteRows.push(r.id);
    twin.sourceIds.push(r.sourceId);
    if (r.title !== twin.title) twin.otherTitles = [...(twin.otherTitles ?? []), r.title];
    twin.materials.folder ||= r.materials.folder;
    twin.materials.resources.push(...r.materials.resources);
    continue;
  }
  spsN++;
  const t = {
    ...r, id: `sps-${String(spsN).padStart(2, '0')}`, batch: 'sps', number: spsN,
    siteRows: [r.id], sourceIds: [r.sourceId], materials: { ...r.materials, resources: [...r.materials.resources] },
  };
  delete t.sourceId;
  topics.push(t);
  spsByKey.set(topicKey(r.title), t);
}

// Library split (head, 29 Oct 2026): the site's one row "DYS 1-4" is four sessions. dys-01 stays as the overview;
// dys-01-s1 .. s4 are the session pages, listed right after it and keeping the site row they came from.
const DYS_SPLIT = [
  ['dys-01-s1', 'DYS 1: Can a Scientist Believe in God?'],
  ['dys-01-s2', 'DYS 2: Getting the Eyes to See God'],
  ['dys-01-s3', 'DYS 3: Are the Vedas Relevant Today?'],
  ['dys-01-s4', 'DYS 4: Science of the Soul'],
];
{
  const i = topics.findIndex(t => t.id === 'dys-01');
  if (i < 0) throw new Error('DYS split: dys-01 not found on the site');
  const base = topics[i];
  const parts = DYS_SPLIT.map(([id, title], k) => ({
    ...base, id, title, subtitle: undefined, number: base.number, session: k + 1, splitFrom: 'dys-01',
    siteRows: [...base.siteRows], sourceIds: [...(base.sourceIds ?? [])],
    materials: { ...base.materials, resources: [...base.materials.resources] },
  }));
  topics.splice(i, 1, ...parts);   // the six DYS sessions replace the old combined "DYS 1-4" row (head, 29 Oct: no redundant overview)
}

// Session names from the DYS Book's contents (the site lists only "DYS 5" and "DYS 6 & TEST").
for (const [id, title] of [['dys-02', 'DYS 5: Substance and Shadow'], ['dys-03', 'DYS 6: If God Is One, Then Why So Many Religions? (and the DYS test)']]) {
  const t = topics.find(x => x.id === id); if (!t) throw new Error(`DYS title: ${id} not found on the site`); t.title = title;
}

// Same topic in several batches.
const byKey = new Map();
for (const t of topics.filter(t => t.kind === 'topic')) {
  const k = topicKey(t.title);
  byKey.set(k, [...(byKey.get(k) ?? []), t.id]);
}
for (const t of topics) {
  const ids = byKey.get(topicKey(t.title)) ?? [];
  const others = ids.filter(id => id !== t.id && id.split('-')[0] !== t.batch);
  if (others.length) t.alsoIn = others;
}

const libBatches = [];
for (const b of batches) {
  const code = CODE[b.id];
  if (code === 'sps1') continue;
  if (code === 'sps2') {
    libBatches.push({ code: 'sps', siteIds: ['sps-2', 'sps-1'], name: 'Srila Prabhupada Sabha', short: 'SPS', siteOrder: b.order,
      note: 'SPS2 then SPS1, taught as one batch (IYF decision, 28 Oct 2026)' });
    continue;
  }
  libBatches.push({ code, siteIds: [b.id], name: b.name, short: b.shortName, siteOrder: b.order });
}
// TRD (head, 29 Oct 2026): not on the site; its approved list lives in research/trd-topics.md (ids trd-NN, groups A-H).
{
  let group = '';
  for (const line of readFileSync(join(ROOT, 'research/trd-topics.md'), 'utf8').split('\n')) {
    const g = line.match(/^## ([A-H])\. (.+?)(?: \(head|$)/); if (g) { group = `${g[1]}. ${g[2]}`; continue; }
    const m = line.match(/^\| (trd-(\d+)) \| \*\*(.+?)\*\*( \(`sensitive: true`\))? \|/); if (!m) continue;
    topics.push({ id: m[1], batch: 'trd', number: +m[2], title: m[3], subtitle: '', status: 'library', kind: 'topic',
      materials: { folder: false, resources: [] }, group, siteRows: [], ...(m[4] ? { sensitive: true } : {}) });
  }
  libBatches.push({ code: 'trd', siteIds: [], name: 'Temple Residents', short: 'TRD', siteOrder: 99,
    note: 'Library batch (head, 29 Oct 2026): approved list in research/trd-topics.md; not on the IYF site' });
}
for (const b of libBatches) b.topics = topics.filter(t => t.batch === b.code && t.kind === 'topic').length;

const curriculum = {
  source: SITE, fetched: today, catalogueLastUpdated: sessions.map(s => s.updated_at).sort().at(-1),
  batches: libBatches,
  notOnSite: [
    { code: 'bvs', name: 'BVS', note: 'No topics on the site; left out until IYF adds them (decision, 28 Oct 2026).' },
  ],
  numberingGaps: gaps,
  topics,
};
writeFileSync(join(ROOT, 'data/curriculum.json'), JSON.stringify(curriculum, null, 1) + '\n');

// Readable inventory.
const md = [];
md.push(`# IYF Preachers Library: catalogue inventory`, '');
md.push(`Snapshot of ${SITE} taken ${today} by \`tools/fetch-catalogue.mjs\` (published sessions only).`);
md.push(`Catalogue last updated on the site: ${curriculum.catalogueLastUpdated.slice(0, 10)}.`, '');
md.push('SPS2 and SPS1 are one batch, **SPS** (SPS2 first, then SPS1; IYF decision, 28 Oct 2026). A topic on both',
  'lists appears once; "Site rows" shows where it came from.', '');
md.push(`| Batch | Site name | Topics | Group-header rows | Numbering gaps (site rows) |`, `|---|---|---|---|---|`);
for (const b of curriculum.batches) {
  const headers = topics.filter(t => t.batch === b.code && t.kind === 'group-header').length;
  const g = b.siteIds.map(id => CODE[id]).filter(c => gaps[c]).map(c => `${c}: ${gaps[c].join(', ')}`).join('; ');
  md.push(`| ${b.short} | ${b.name} | ${b.topics} | ${headers || ''} | ${g} |`);
}
md.push(`| **All** | | **${topics.filter(t => t.kind === 'topic').length}** | ${topics.filter(t => t.kind === 'group-header').length} | |`, '');
md.push('Not on the site: ' + curriculum.notOnSite.map(n => `**${n.name}**: ${n.note}`).join(' '), '');
md.push('Materials: "F" = a Drive/other folder is linked; letters list attached resources (a=audio, v=video, d=doc, p=pdf, s=slides).',
  '"Also in" = the same title appears in another batch.', '');
const abbrev = { audio: 'a', video: 'v', doc: 'd', pdf: 'p', ppt: 's', folder: 'F' };
for (const b of curriculum.batches) {
  md.push(`## ${b.short}: ${b.name} (${b.topics})`, '', '| ID | Site rows | Title | Materials | Also in |', '|---|---|---|---|---|');
  for (const t of topics.filter(t => t.batch === b.code)) {
    const mats = [t.materials.folder ? 'F' : '', ...t.materials.resources.map(x => abbrev[x] ?? x)].join(' ').trim();
    const title = (t.kind === 'group-header' ? `*(group header)* ${t.title}` : t.title) + (t.subtitle ? ` — ${t.subtitle}` : '')
      + (t.otherTitles ? ` *(also listed as: ${t.otherTitles.join('; ')})*` : '');
    md.push(`| ${t.id} | ${t.siteRows.join(', ')} | ${title.replace(/\|/g, '/')} | ${mats} | ${(t.alsoIn ?? []).join(', ')} |`);
  }
  md.push('');
}
writeFileSync(join(ROOT, 'research/catalogue-inventory.md'), md.join('\n'));

console.log(`${sessions.length} sessions, ${topics.filter(t => t.kind === 'topic').length} topics, ` +
  `${batches.length} batches; gaps ${JSON.stringify(gaps)}`);
