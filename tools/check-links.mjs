// Check every link in the built site (run after tools/build-site.mjs). Read-only: changes nothing.
//   external links: fetched (redirects followed); 4xx/5xx, no answer, or a Google sign-in page = broken
//   internal links: the target file must exist in the site folder
// A Drive link that 404s usually means the file was moved or unshared: fix its row in IYF's media library sheet
// (12QrYooU9UjavNYhHygtRJ6XcaNZbL204FlWDV19l_TE), then rebuild. Node's own certificate store rejects a few
// government / DOI sites that browsers accept; those show as "no answer" and are worth one manual look.
//
// Usage: node tools/check-links.mjs [site-dir] [report.json]     defaults: dist/site, research/verification/links.json
// Run it on a copy (cp -R dist/site <scratch>) if a rebuild may happen meanwhile.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = resolve(process.argv[2] || join(ROOT, 'dist', 'site'));
const outFile = process.argv[3] || join(ROOT, 'research', 'verification', 'links.json');

const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(site);

const ext = new Map(); const internalBad = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const u = m[1].replace(/&amp;/g, '&');
    if (/^https?:\/\//.test(u)) { if (!ext.has(u)) ext.set(u, new Set()); ext.get(u).add(f.slice(site.length + 1)); continue; }
    if (/^(#|data:|mailto:|tel:|javascript:)/.test(u) || u.includes("'+")) continue; // '+ = built by the page's own script
    const p = resolve(dirname(f), u.split('#')[0].split('?')[0]);
    if (!existsSync(p) && !existsSync(p + '.html') && !existsSync(join(p, 'index.html'))) internalBad.push({ page: f.slice(site.length + 1), href: u });
  }
}

async function check(u) {
  // A DOI is good when doi.org redirects it (registered); publishers often refuse automated checkers (403).
  if (/^https?:\/\/(dx\.)?doi\.org\//i.test(u)) {
    try {
      const r = await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
      return r.status >= 300 && r.status < 400 ? { status: 200, note: undefined } : { status: r.status, note: 'DOI not registered' };
    } catch (e) { return { status: 0, note: String(e.cause?.code || e.name || e) }; }
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(25000), headers: { 'user-agent': 'Mozilla/5.0 (link check, IYF Preacher Library)' } });
      if (r.status === 429) { await new Promise(s => setTimeout(s, 4000)); continue; }
      const note = /accounts\.google\.com|ServiceLogin/.test(r.url) ? 'private (asks Google sign-in)' : undefined;
      return { status: r.status, final: r.url !== u ? r.url : undefined, note };
    } catch (e) { if (attempt) return { status: 0, note: String(e.cause?.code || e.name || e) }; }
  }
  return { status: 429, note: 'rate-limited twice' };
}

const urls = [...ext.keys()]; const res = {};
let i = 0;
async function worker() { while (i < urls.length) { const u = urls[i++]; res[u] = await check(u); await new Promise(s => setTimeout(s, 250)); } }
await Promise.all(Array.from({ length: 6 }, worker));

const bad = urls.filter(u => res[u].status === 0 || res[u].status >= 400 || res[u].note)
  .map(u => ({ url: u, ...res[u], pageCount: ext.get(u).size, pages: [...ext.get(u)].slice(0, 5) }));
writeFileSync(outFile, JSON.stringify({ checkedAt: new Date().toISOString(), pages: files.length, external: urls.length, internalBad, bad }, null, 1) + '\n');
console.log(`pages ${files.length} · external links ${urls.length} · broken external ${bad.length} · broken internal ${internalBad.length} → ${outFile}`);
for (const b of bad) console.log(`  ${b.status || '---'} ${b.note || ''} ${b.url}  (${b.pages[0]}${b.pageCount > 1 ? ` +${b.pageCount - 1}` : ''})`);
for (const b of internalBad) console.log(`  internal ${b.href}  (${b.page})`);
process.exitCode = bad.some(b => b.status >= 400) || internalBad.length ? 1 : 0;
