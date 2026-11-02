// Verses from other sastras as Srila Prabhupada quotes them (head, 2 Nov 2026): Mahabharata, Ramayana, the Puranas, Upanisads,
// Pancaratra, Manu-samhita, Canakya Pandita and others, taken only from his purports in the verified vedabase pages already
// downloaded (.cache/vedabase). Each entry keeps the Sanskrit exactly as printed, his translation when he gives one, the source
// as he names it, and the purport that quotes it. No model tokens, nothing invented.
// Usage: node tools/quoted-sastras.mjs   → data/quoted-sastras.json (read by build-site for the Slokas page)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), CACHE = join(ROOT, '.cache/vedabase');
// Books outside Prabhupada's own translated works (those are already listed by verse on the Slokas page).
const BOOK = /(Mahābhārata|Rāmāyaṇa|[A-ZŚṢ][a-zāīūṛṣṇṭḍśñṁḥ]+(?:-[a-zāīūṛṣṇṭḍśñṁḥ]+)* Purāṇa|Purāṇa|[A-ZŚṢ][a-zāīūṛṣṇṭḍśñṁḥ]+(?:-[a-zāīūṛṣṇṭḍśñṁḥ]+)* Upaniṣad|Upaniṣad|[A-ZŚṢ][a-zāīūṛṣṇṭḍśñṁḥ]+-pañcarātra|Pañcarātra|Manu-saṁhitā|Manu-smṛti|Cāṇakya(?: Paṇḍita)?|Hari-bhakti-vilāsa|Bhakti-rasāmṛta-sindhu|Vedānta-sūtra|Padyāvalī|Laghu-bhāgavatāmṛta|Bṛhad-bhāgavatāmṛta|Garga-saṁhitā|Hari-vaṁśa|Bhakti-sandarbha|Ṣaṭ-sandarbha|Tattva-sandarbha|Prema-vivarta|Stotra-ratna|Mukunda-mālā-stotra|Nārada-bhakti-sūtra|Śikṣāṣṭaka)/;
const plain = h => h.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\\u003c/g, '<').replace(/\s*\n\s*/g, '\n').trim();
const citeOf = url => {
  const m = url.match(/library\/([a-z]+)\/(.+?)\/?$/); if (!m) return url;
  const book = { bg: 'BG', sb: 'SB', cc: 'CC', noi: 'NOI', iso: 'ISO', bs: 'Bs', nod: 'NOD' }[m[1]] ?? m[1].toUpperCase();
  const parts = m[2].split('/'); if (m[1] === 'cc') return `CC ${parts[0][0].toUpperCase() + parts[0].slice(1)} ${parts.slice(1).join('.')}`;
  return `${book} ${parts.join('.')}`;
};
const groupOf = src => /Mahābhārata/.test(src) ? 'Mahābhārata' : /Rāmāyaṇa/.test(src) ? 'Rāmāyaṇa' : /Purāṇa/.test(src) ? 'Purāṇas'
  : /Upaniṣad/.test(src) ? 'Upaniṣads' : /Cāṇakya/.test(src) ? 'Cāṇakya Paṇḍita' : /Manu/.test(src) ? 'Manu-saṁhitā'
  : /pañcarātra|Pañcarātra/.test(src) ? 'Pañcarātra' : 'Other śāstras';

const found = new Map();   // key: normalized Sanskrit → entry
const add = (sk, src, ref, tr, url) => {
  sk = sk.replace(/[“”"]/g, '').trim(); if (sk.split(/\s+/).length < 3) return;
  const key = sk.normalize('NFKD').replace(/[̀-ͯ’'.,;:!?\-]/g, '').toLowerCase().replace(/\s+/g, ' ');
  const e = found.get(key) ?? { sanskrit: sk, source: src.trim(), ref: (ref || '').trim(), translation: tr || '', group: groupOf(src), quotedIn: [] };
  if (!e.translation && tr) e.translation = tr; if (!e.ref && ref) e.ref = ref.trim();
  if (!e.quotedIn.some(q => q.url === url)) e.quotedIn.push({ cite: citeOf(url), url });
  found.set(key, e);
};
for (const f of readdirSync(CACHE)) {
  const html = readFileSync(join(CACHE, f), 'utf8'), url = 'https://' + f.replace(/\.html$/, '').replace(/_/g, '/');   // cache names come in two styles
  const p = html.indexOf('>Purport<'); if (p < 0) continue;
  const blocks = [...html.slice(p).matchAll(/<div id="bb\d+"[^>]*>([\s\S]*?)<\/div><\/div>/g)].map(m => m[1]);
  blocks.forEach((b, i) => {
    // 1. A verse set apart (centred italics), named in the sentence before it or credited in brackets after it
    if (/text-c/.test(b) && /<em>[\s\S]*<br/.test(b)) {
      const sk = plain(b), before = plain(blocks[i - 1] || '').slice(-260), after = plain(blocks[i + 1] || '');
      const credit = after.match(/^\(([^)]{3,80})\)/) || plain(b).match(/\(([^)]{3,80})\)\s*$/);
      const src = (credit && BOOK.test(credit[1]) ? credit[1] : (before.match(new RegExp(BOOK.source + '[^.:]{0,40}', 'g')) || []).pop()) || '';
      if (!BOOK.test(src)) return;
      const tr = (after.match(/^[“"]([^”"]{10,600})[”"]/) || plain(blocks[i + 2] || '').match(/^[“"]([^”"]{10,600})[”"]/) || [])[1];
      add(sk.replace(/\([^)]*\)\s*$/, ''), src.match(BOOK)[0], credit ? credit[1].replace(BOOK, '').replace(/^[,\s]+/, '') : '', tr, url);
      return;
    }
    // 2. An inline quotation: <em>Sanskrit</em> (<em>Book, part</em> ref)  or  "Book says, <em>Sanskrit</em>"
    for (const m of b.matchAll(/<em>([^<]{12,200})<\/em>\s*\(\s*(?:<em>)?([^<)]{3,60})(?:<\/em>)?\s*([^)]{0,30})\)/g))
      if (BOOK.test(m[2])) add(plain(m[1]), m[2].match(BOOK)[0], (m[2].replace(BOOK, '').replace(/^[,\s]+/, '') + ' ' + m[3]).trim(), '', url);
    for (const m of b.matchAll(new RegExp('(' + BOOK.source + ')(?:<\\/em>)?[^<.]{0,40}(?:says|said|states|it is said)[^<]{0,12}<em>([^<]{12,200})<\\/em>', 'g')))
      add(plain(m[m.length - 1]), m[1], '', '', url);
  });
}
const list = [...found.values()].sort((a, b) => a.group.localeCompare(b.group) || a.source.localeCompare(b.source) || a.sanskrit.localeCompare(b.sanskrit));
writeFileSync(join(ROOT, 'data/quoted-sastras.json'), JSON.stringify(list, null, 1) + '\n');
const by = {}; for (const e of list) by[e.group] = (by[e.group] || 0) + 1;
console.log(`${list.length} verses quoted by Srila Prabhupada from other sastras → data/quoted-sastras.json`, by,
  `· with his translation: ${list.filter(e => e.translation).length}`);
