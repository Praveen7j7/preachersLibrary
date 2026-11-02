// Build the offline HTML library from content/topics/*.md (Stage 2 §6).
//   dist/site/index.html                      home: batches, search, every topic with its status
//   dist/site/topics/<id>/preacher.html       Part 1 only (preachers)
//   dist/site/topics/<id>/students.html       Part 2 only (safe to share)
// No dependencies, no server: open dist/site/index.html from the folder. Nothing is published.
//
// Usage: node tools/build-site.mjs

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.SITE_OUT || join(ROOT, 'dist/site');   // SITE_OUT: build a copy elsewhere (checks)
const cur = JSON.parse(readFileSync(join(ROOT, 'data/curriculum.json'), 'utf8'));
import { makeCiter } from './citations.mjs';
const cite = makeCiter(ROOT);
// Sanskrit of every verified verse (tools/slokas.mjs), shown under the verse in E, S3 and R.
// Every public resource mapped to a topic (data/sources-map.json) that its page does not already link is listed at the
// end of O as "More from the library", so each page holds all our resources in one place (head, 29 Oct). Known-dead
// Drive files (data/dead-links.json) are skipped.
const SMAP = existsSync(join(ROOT, 'data/sources-map.json')) ? JSON.parse(readFileSync(join(ROOT, 'data/sources-map.json'), 'utf8')) : {};
const DEAD = new Set(existsSync(join(ROOT, 'data/dead-links.json')) ? JSON.parse(readFileSync(join(ROOT, 'data/dead-links.json'), 'utf8')).driveIds : []);
const MAPLABEL = { iyfLectures: 'IYF lecture', iyfDecks: 'IYF deck', chaitanyacharan: 'Chaitanya Charan Das', radheshyamdas: 'Radheshyam Das', gurus: 'Realizations' };
function moreResources(id, src) {
  const e = SMAP[id]; if (!e) return '';
  const seen = new Set(), items = [];
  for (const [k, label] of Object.entries(MAPLABEL)) for (const r of [...(e[k] ?? [])].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 4)) {  // best 4 per type: keyword matching is noisy
    const u = r.url ?? ''; if (!/^https?:/.test(u) || seen.has(u) || src.includes(u)) continue;
    const did = u.match(/[?&]id=([\w-]+)|\/d\/([\w-]+)/); if (did && DEAD.has(did[1] || did[2])) continue;
    seen.add(u); items.push(`- ${label}: [${(r.title || u).replace(/[\[\]]/g, '')}](${u})`);
  }
  return items.length ? `\n\n**More from the library** (matched to this topic; open what fits your session)\n\n${items.join('\n')}\n` : '';
}
// Scripture stories for each topic (data/stories.json), appended to J so every talk has real narratives to tell.
const STORIES = existsSync(join(ROOT, 'data/stories.json')) ? JSON.parse(readFileSync(join(ROOT, 'data/stories.json'), 'utf8')) : [];
function storiesFor(id) {
  const st = STORIES.filter(x => (x.topics ?? []).includes(id));
  return st.length ? '\n\n**Stories from scripture for this topic** (from Srila Prabhupada\'s books: read the linked chapter before you tell it, then tell it in your own words)\n\n' +
    st.map(x => `- **${x.title}** ([${x.source}](${x.url})). ${x.summary} *Lesson:* ${x.lesson} *Use it:* ${x.useFor}`).join('\n') + '\n' : '';
}
const SLOKAS = existsSync(join(ROOT, 'data/slokas.json')) ? JSON.parse(readFileSync(join(ROOT, 'data/slokas.json'), 'utf8')) : {};
const slokaBlock = c => { const v = SLOKAS[c]; return v && (v.dev || v.iast) ? `<div class="sloka">${v.dev ? `<p class="dev" lang="sa">${esc(v.dev).replace(/\n/g, '<br>')}</p>` : ''}${v.iast ? `<p class="iast" lang="sa-Latn">${esc(v.iast).replace(/\n/g, '<br>')}</p>` : ''}</div>` : ''; };
// A paragraph or list item that opens with a bold citation gets that verse's Sanskrit after its first line.
const withSanskrit = html => html
  .replace(/(<p><strong>([^<]{3,40}?)<\/strong>[\s\S]*?<\/p>)/g, (all, p, c) => all + slokaBlock(c.replace(/[:.\s]+$/, '').trim()))
  .replace(/(<li><strong>([^<]{3,40}?)<\/strong>)([\s\S]*?)(<\/li>|<ul>|<ol>)/g, (all, open, c, rest, end) => open + rest + slokaBlock(c.replace(/[:.\s]+$/, '').trim()) + end);

// ---------- minimal Markdown → HTML (covers what the topic files use) ----------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(esc(c)) - 1}\u0000`);
  s = esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => { const m = u.match(/^([a-z0-9]+-\d+(?:-s\d+)?)\.md(#.*)?$/); if (!m) return `<a href="${u}">${t}</a>`; return existsSync(join(ROOT, 'content/topics', m[1] + '.md')) && !SKIP.has(m[1]) ? `<a href="../${m[1]}/preacher.html${m[2] ?? ''}">${t}</a>` : `${t} <span class="meta">(not written yet)</span>`; })  // <id>.md = another topic
    .replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:])/g, '$1<a href="$2">$2</a>')
    .replace(/\b(doi:\s?)(10\.\d{4,9}\/[^\s<)\],;]*[^\s<)\],;.:])/gi, '<a href="https://doi.org/$2">$1$2</a>')  // bare DOIs clickable
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/(^|[^\w])_([^_\s][^_]*?)_(?!\w)/g, '$1<em>$2</em>')
    .replace(/^\[ \] /, '<input type="checkbox" disabled> ')
    .replace(/^\[x\] /i, '<input type="checkbox" checked disabled> ');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[+i]}</code>`);
}
const indentOf = l => l.match(/^ */)[0].length;
const listRe = /^(\s*)([-*]|\d+\.)\s+(.*)$/;

function renderList(lines) {
  const base = indentOf(lines[0]);
  const ordered = /^\s*\d+\./.test(lines[0]);
  const items = [];
  for (const l of lines) {
    const m = l.match(listRe);
    if (m && m[1].length === base) items.push([m[3]]);
    else items.at(-1).push(l);
  }
  const lis = items.map(([first, ...rest]) => {
    const sub = rest.filter(l => l.trim());
    const nestedStart = sub.findIndex(l => listRe.test(l));
    const cont = nestedStart < 0 ? sub : sub.slice(0, nestedStart);
    const nested = nestedStart < 0 ? [] : sub.slice(nestedStart);
    const text = [first, ...cont.map(l => l.trim())].join(' ');
    return `<li>${inline(text)}${nested.length ? renderList(nested) : ''}</li>`;
  });
  return ordered ? `<ol>${lis.join('')}</ol>` : `<ul>${lis.join('')}</ul>`;
}

function md(src) {
  const lines = src.replace(/<!--[\s\S]*?-->/g, '').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^```/.test(l)) {
      const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue;
    }
    if (/^\s*<svg/.test(l)) {
      const buf = [];
      while (i < lines.length) { buf.push(lines[i]); if (/<\/svg>/.test(lines[i++])) break; }
      out.push(`<figure class="diagram">${buf.join('\n')}</figure>`); continue;
    }
    let m;
    if ((m = l.match(/^(#{1,4})\s+(.*)$/))) {
      const n = m[1].length, text = m[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
      out.push(`<h${n} id="${id}">${inline(text)}</h${n}>`); i++; continue;
    }
    if (/^-{3,}\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (/^>/.test(l)) {
      const buf = [];
      while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^> ?/, ''));
      out.push(`<blockquote>${md(buf.join('\n'))}</blockquote>`); continue;
    }
    if (/^\|/.test(l) && /^\|?\s*:?-{2,}/.test(lines[i + 1] ?? '')) {
      const row = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const head = row(l); i += 2;
      const body = [];
      while (i < lines.length && /^\|/.test(lines[i])) body.push(row(lines[i++]));
      out.push(`<div class="table"><table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>` +
        body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>');
      continue;
    }
    if (listRe.test(l)) {
      const buf = [];
      while (i < lines.length && (listRe.test(lines[i]) || (lines[i].trim() && indentOf(lines[i]) > 0) ||
        (!lines[i].trim() && (listRe.test(lines[i + 1] ?? '') || indentOf(lines[i + 1] ?? '') > 0)))) buf.push(lines[i++]);
      out.push(renderList(buf.filter(x => x.trim()))); continue;
    }
    const buf = [];
    // As in CommonMark, only a bullet or a list starting at 1 interrupts a paragraph: a wrapped "… 3. x\n4. y" stays text.
    const interrupts = x => listRe.test(x) && !/^\s*([2-9]|\d{2,})\.\s/.test(x);
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|\||```|-{3,}\s*$|\s*<svg)/.test(lines[i]) && (!buf.length || !interrupts(lines[i]))) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

// Student questions (S5, S6): questions only by default; a "Show answers" tick box reveals each answer under its
// question (head, 29 Oct). S5 answers follow the bold question in the same item; S6 keeps one "Answers: 1. … 2. …"
// paragraph, which is split and paired with the questions only when its numbers run 1…n like them; otherwise the
// whole paragraph is the hidden answer block.
function withAnswers(body) {
  let n = 0;
  body = body.replace(/<li><strong>([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/li>/g, (all, q, a) =>
    a.trim() && !/<li>/.test(a) ? (n++, `<li><strong>${q}</strong><div class="ans">${a}</div></li>`) : all);
  const m = body.match(/<p><strong>Answers:<\/strong>\s*([\s\S]*?)<\/p>/);
  if (m) {
    const qs = (body.slice(0, m.index).match(/<ol>([\s\S]*?)<\/ol>/)?.[1] ?? '').match(/<li>[\s\S]*?<\/li>/g) ?? [];
    const parts = m[1].split(/(?:^|\s)(\d+)\.\s+/).slice(1);
    const nums = parts.filter((_, i) => i % 2 === 0).map(Number);
    if (qs.length && nums.length === qs.length && nums.every((x, i) => x === i + 1)) {
      let k = 0;
      body = body.slice(0, m.index).replace(/(<ol>)([\s\S]*?)(<\/ol>)/, (_, o, inner, c) =>
        o + inner.replace(/<li>([\s\S]*?)<\/li>/g, (__, q) => `<li>${q}<div class="ans">${parts[2 * k++ + 1].trim()}</div></li>`) + c) +
        body.slice(m.index + m[0].length);
    } else body = body.replace(m[0], `<div class="ans"><p><strong>Answers:</strong> ${m[1]}</p></div>`);
    n++;
  }
  return n ? `<label class="reveal"><input type="checkbox"> Show answers</label><div class="qa">${body}</div>` : body;
}

// Wrap each "## X. Heading" section in a card (<details>) so preachers can scan; C, D, G and all student sections
// open. Returns the HTML and a table of contents [{id, letter, title}]. Quiz answers (S6) sit behind "Show answers".
function sections(html, openAll) {
  const toc = [];
  const out = html.split(/(?=<h2 )/).map(p => {
    const m = p.match(/^<h2 id="([^"]*)">(.*?)<\/h2>/);
    if (!m) return p;
    const [, id, head] = m;
    const lm = head.match(/^([A-Z]\d?)\.\s*(.*)$/);
    const letter = lm ? lm[1] : '', title = lm ? lm[2] : head;
    toc.push({ id, letter, title: title.replace(/<[^>]+>/g, '') });
    let body = p.slice(m[0].length);
    if (letter === 'S5' || letter === 'S6') body = withAnswers(body);
    if (letter === 'E' || letter === 'S3' || letter === 'R') body = withSanskrit(body);
    const open = openAll || /^(C|D|G)$/.test(letter);
    return `<details class="sec"${open ? ' open' : ''} id="${id}"><summary>${letter ? `<span class="letter">${letter}</span>` : ''}<h2>${title}</h2></summary><div class="body">${body}</div></details>`;
  }).join('');
  return { html: out, toc };
}

// ---------- page shell ----------
// Design tokens follow the Sadhana Record app (warm sandalwood neutrals, IYF logo blue, gold, a colour per batch,
// serif titles, 4 px spacing, 44 px tap targets) so both IYF Delhi sites look and behave alike.
const CSS = `
:root{--acc:#004fdc;--on-acc:#fff;--gold:#7a5300;--gold-d:#f8b000;--bg:#f3eee5;--surface:#fbf9f6;--card:#fff;--muted-bg:#efe9df;
--line:#e3dbcd;--line-strong:#8c8273;--fg:#1e1a15;--fg2:#4a433a;--muted:#655c50;--ok:#1d7348;--warn:#865400;--danger:#b02e1c;
--acc-soft:#e8ecf5;--ok-soft:#e4f0e9;--warn-soft:#f5ecdc;
--sh1:0 1px 2px rgb(60 40 10/.08),0 2px 6px -2px rgb(60 40 10/.08);--sh2:0 8px 20px -8px rgb(60 40 10/.18),0 2px 4px rgb(60 40 10/.05);
--serif:'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua','Noto Serif',Georgia,serif;
--sans:system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans',sans-serif;--mono:ui-monospace,Menlo,monospace;
--r-sm:8px;--r-md:12px;--r-lg:16px;--read:760px;--gutter:16px;--bar:56px;
--b-vl1:#2e8b57;--b-dys:#8a5cd6;--b-vl2:#c0456b;--b-vl3:#0e7490;--b-sps:#3b6fe0;--b-dps:#c99a1c;--b-bss:#1f9a8a;--b-trd:#e07b1f;--batch:var(--acc);
color-scheme:light}
:root[data-theme=dark]{--acc:#78a8ff;--on-acc:#0b1640;--gold:#f8b000;--bg:#0d0b13;--surface:#1b1826;--card:#272339;--muted-bg:#221e2f;
--line:#3d3752;--line-strong:#756e86;--fg:#f1ede6;--fg2:#c9c2b7;--muted:#a39c91;--ok:#6fd49b;--warn:#f2c46a;--danger:#ff917c;
--acc-soft:#232a45;--ok-soft:#1d2f2a;--warn-soft:#352f2b;--sh1:0 1px 2px rgb(0 0 0/.4);--sh2:0 8px 22px -8px rgb(0 0 0/.6);
--b-vl1:#5fc98a;--b-dys:#b394ee;--b-vl2:#ec86a5;--b-vl3:#4cc0d8;--b-sps:#7aa2ff;--b-dps:#e3b84a;--b-bss:#4cc4b2;--b-trd:#f2a25a;color-scheme:dark}
@media (prefers-color-scheme:dark){:root:not([data-theme]){--acc:#78a8ff;--on-acc:#0b1640;--gold:#f8b000;--bg:#0d0b13;--surface:#1b1826;--card:#272339;--muted-bg:#221e2f;
--line:#3d3752;--line-strong:#756e86;--fg:#f1ede6;--fg2:#c9c2b7;--muted:#a39c91;--ok:#6fd49b;--warn:#f2c46a;--danger:#ff917c;
--acc-soft:#232a45;--ok-soft:#1d2f2a;--warn-soft:#352f2b;--sh1:0 1px 2px rgb(0 0 0/.4);--sh2:0 8px 22px -8px rgb(0 0 0/.6);
--b-vl1:#5fc98a;--b-dys:#b394ee;--b-vl2:#ec86a5;--b-vl3:#4cc0d8;--b-sps:#7aa2ff;--b-dps:#e3b84a;--b-bss:#4cc4b2;--b-trd:#f2a25a;color-scheme:dark}}
@media (min-width:600px){:root{--gutter:24px}}
[data-batch=vl1]{--batch:var(--b-vl1)}[data-batch=dys]{--batch:var(--b-dys)}[data-batch=vl2]{--batch:var(--b-vl2)}[data-batch=vl3]{--batch:var(--b-vl3)}
[data-batch=sps]{--batch:var(--b-sps)}[data-batch=dps]{--batch:var(--b-dps)}[data-batch=bss]{--batch:var(--b-bss)}[data-batch=trd]{--batch:var(--b-trd)}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-padding-top:calc(var(--bar) + 16px)}
body{margin:0;background:var(--bg);color:var(--fg);font:16.5px/1.6 var(--sans)}
body::before{content:'';position:fixed;inset:0 0 auto;height:40vh;z-index:-1;pointer-events:none;
background:radial-gradient(120% 100% at 50% 0,color-mix(in srgb,var(--acc) 9%,transparent),transparent),radial-gradient(60% 80% at 100% 0,color-mix(in srgb,var(--gold-d) 10%,transparent),transparent)}
.skip{position:absolute;left:-999px}.skip:focus{left:8px;top:8px;z-index:50;background:var(--card);padding:8px 12px;border-radius:var(--r-sm)}
:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
header.top{position:sticky;top:0;z-index:30;background:color-mix(in srgb,var(--surface) 86%,transparent);backdrop-filter:blur(8px) saturate(140%);-webkit-backdrop-filter:blur(8px) saturate(140%);border-bottom:1px solid var(--line)}
.bar{max-width:1180px;margin:0 auto;min-height:var(--bar);padding:6px var(--gutter);display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center}
.brand{display:flex;align-items:center;gap:10px;font:600 17px var(--serif);color:var(--fg);text-decoration:none;margin-right:auto}
.brand img{width:32px;height:32px}.brand small{display:block;font:600 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
nav.views{display:flex;background:var(--muted-bg);border:1px solid var(--line);border-radius:999px;padding:3px}
nav.views a{font:600 14px var(--sans);min-height:36px;display:flex;align-items:center;padding:0 14px;border-radius:999px;color:var(--fg2);text-decoration:none}
nav.views a.on{background:var(--card);color:var(--fg);box-shadow:var(--sh1)}
.iconbtn{min-width:40px;min-height:40px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;font:600 14px var(--sans);cursor:pointer;padding:0 12px}
.iconbtn:hover{border-color:var(--line-strong)}
.layout{max-width:1180px;margin:0 auto;padding:0 var(--gutter);display:grid;grid-template-columns:minmax(0,1fr);gap:32px}
@media (min-width:1100px){.layout.has-toc{grid-template-columns:220px minmax(0,var(--read))}}
main{max-width:var(--read);width:100%;padding:24px 0 96px}.home main{max-width:1180px;margin:0 auto;padding:24px var(--gutter) 96px}
h1{font:var(--fw,600) clamp(1.6rem,1.35rem + 1.2vw,2.25rem)/1.18 var(--serif);margin:.2em 0 .4em;letter-spacing:-.01em}
h2{font:650 1.15rem/1.3 var(--sans);margin:0}h3{font:650 1.05rem/1.35 var(--sans);margin:1.4em 0 .4em}h4{font:650 1rem var(--sans);margin:1.2em 0 .3em}
p{margin:.6em 0}a{color:var(--acc);text-underline-offset:2px}
main a,main code{overflow-wrap:anywhere;word-break:break-word}main p,main li,main td,main th,main blockquote{overflow-wrap:break-word}
.overline{font:700 12px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--batch)}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.chip{display:inline-flex;align-items:center;font:600 12.5px var(--sans);padding:3px 10px;border-radius:999px;background:var(--muted-bg);color:var(--fg2);border:1px solid var(--line)}
.chip.batch{background:color-mix(in srgb,var(--batch) 14%,var(--card));color:var(--fg);border-color:color-mix(in srgb,var(--batch) 45%,var(--line))}
.chip.ok{background:var(--ok-soft);color:var(--ok);border-color:transparent}.chip.warn{background:var(--warn-soft);color:var(--warn);border-color:transparent}
.banner{font:600 14px var(--sans);padding:10px 14px;border-radius:var(--r-sm);margin:12px 0;background:var(--warn-soft);color:var(--warn)}
.start{background:var(--card);border:1px solid var(--line);border-top:4px solid var(--batch);border-radius:var(--r-lg);padding:16px 18px;margin:16px 0 20px;box-shadow:var(--sh1)}
.start h2{font:600 1.2rem var(--serif);margin-bottom:6px}.start .msg{font:1.06rem/1.5 var(--serif);margin:.4em 0 .8em}
.jump{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.jump a{display:flex;flex-direction:column;gap:2px;min-height:56px;padding:10px 12px;border-radius:var(--r-md);background:var(--surface);border:1px solid var(--line);text-decoration:none;color:var(--fg);font:600 14px var(--sans)}
.jump a small{font-weight:500;color:var(--muted);font-size:12.5px}.jump a:hover{border-color:var(--batch)}
.tools{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px}
.toc{display:none}
@media (min-width:1100px){.toc{display:block;position:sticky;top:calc(var(--bar) + 16px);align-self:start;max-height:calc(100vh - var(--bar) - 32px);overflow:auto;padding:24px 0}
.toc a{display:block;padding:6px 10px;border-radius:var(--r-sm);color:var(--fg2);text-decoration:none;font:500 13.5px/1.3 var(--sans)}.toc a:hover,.toc a.on{background:var(--card);color:var(--fg);box-shadow:var(--sh1)}
.toc b{display:block;font:700 12px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:0 10px 6px}}
.tocbar{display:flex;gap:6px;overflow-x:auto;padding:4px 0 10px;margin:0 calc(-1*var(--gutter));padding-left:var(--gutter);scrollbar-width:none}
.tocbar::-webkit-scrollbar{display:none}.tocbar a{flex:none;font:600 13px var(--sans);padding:6px 12px;border-radius:999px;background:var(--card);border:1px solid var(--line);color:var(--fg2);text-decoration:none}
@media (min-width:1100px){.tocbar{display:none}}
details.sec{background:var(--card);border:1px solid var(--line);border-radius:var(--r-md);margin:10px 0;box-shadow:var(--sh1)}
details.sec>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px;padding:14px 16px;min-height:52px}
details.sec>summary::-webkit-details-marker{display:none}
details.sec>summary::after{content:'';margin-left:auto;width:10px;height:10px;border-right:2px solid var(--muted);border-bottom:2px solid var(--muted);transform:translateY(-2px) rotate(45deg);transition:transform .2s}
details.sec[open]>summary::after{transform:translateY(2px) rotate(-135deg)}
details.sec>summary .letter{flex:none;width:28px;height:28px;border-radius:8px;display:grid;place-items:center;font:700 13px var(--sans);background:color-mix(in srgb,var(--batch) 16%,var(--card));color:var(--fg)}
details.sec>.body{padding:0 16px 14px;border-top:1px solid var(--line)}
.sloka{margin:6px 0 10px;padding:8px 12px;border-radius:var(--r-sm);background:var(--surface);border:1px solid var(--line)}.sloka p{margin:.2em 0}.sloka .dev{font:1.08rem/1.6 'Noto Sans Devanagari','Kohinoor Devanagari','Noto Sans Bengali',var(--serif)}.sloka .iast{font:italic .98rem/1.5 var(--serif);color:var(--fg2)}
.reveal{display:inline-flex;align-items:center;gap:8px;min-height:40px;margin:10px 0 2px;padding:0 14px;border:1px solid var(--line);border-radius:999px;background:var(--surface);font:600 14px var(--sans);cursor:pointer;user-select:none}
.reveal input{width:18px;height:18px;accent-color:var(--acc);margin:0}
.qa .ans{display:none;margin:6px 0 4px;padding:8px 12px;border-left:3px solid var(--ok);background:var(--ok-soft);border-radius:0 var(--r-sm) var(--r-sm) 0;font-weight:400}
.qa .ans::before{content:'Answer';display:block;font:700 11.5px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--ok);margin-bottom:2px}
.qa.show .ans{display:block}.qa li{margin:.5em 0}
blockquote{margin:1em 0;padding:.7em 1em;border-left:4px solid var(--gold-d);background:var(--surface);border-radius:0 var(--r-sm) var(--r-sm) 0;font:1.03rem/1.5 var(--serif)}
blockquote p{margin:.3em 0}
.table{overflow-x:auto;margin:1em 0;border:1px solid var(--line);border-radius:var(--r-sm)}table{border-collapse:collapse;width:100%;font-size:15px}
th,td{border-bottom:1px solid var(--line);padding:8px 10px;vertical-align:top;text-align:left}th{background:var(--surface);font-weight:650}tr:last-child td{border-bottom:0}
code{font:14px var(--mono);background:var(--muted-bg);padding:1px 5px;border-radius:5px}pre{overflow-x:auto}
hr{border:0;border-top:1px solid var(--line);margin:28px 0}
.meta{color:var(--muted);font-size:14px}.pending{color:var(--muted)}
figure.diagram{margin:1em 0;overflow-x:auto}figure.diagram svg{max-width:100%;height:auto}
.part{font:600 1.35rem var(--serif);margin:28px 0 6px}
.hero{padding:12px 0 8px}.hero p{color:var(--fg2);max-width:62ch}
.search{width:100%;font:16px var(--sans);min-height:48px;padding:12px 16px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--card);color:var(--fg);box-shadow:var(--sh1)}
.search:focus{outline:2px solid var(--acc);outline-offset:1px}
.filters{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 4px}
.filters button{font:600 13.5px var(--sans);min-height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--fg2);cursor:pointer}
.filters button.on{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin:16px 0 8px}
.card{display:block;background:var(--card);border:1px solid var(--line);border-top:4px solid var(--batch);border-radius:var(--r-md);padding:12px 14px;text-decoration:none;color:var(--fg);box-shadow:var(--sh1)}
.card b{display:block;font:600 1.3rem var(--serif)}.card small{color:var(--muted)}
.prog{height:6px;border-radius:99px;background:var(--muted-bg);overflow:hidden;margin:8px 0 6px}.prog i{display:block;height:100%;background:var(--batch)}
section.batch{margin-top:28px}section.batch>h2{font:600 1.35rem var(--serif);display:flex;align-items:center;gap:10px}
section.batch>h2::before{content:'';width:12px;height:12px;border-radius:4px;background:var(--batch)}
ul.topics{list-style:none;padding:0;margin:10px 0;display:grid;gap:8px}
ul.topics li{background:var(--card);border:1px solid var(--line);border-radius:var(--r-md);padding:10px 14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
ul.topics li.pending{background:transparent;box-shadow:none;border-style:dashed}
ul.topics .id{color:var(--muted);font:12.5px var(--mono);min-width:54px}ul.topics .t{flex:1;min-width:200px;font-weight:550}
ul.topics .v{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
ul.topics .v a{font:600 13px var(--sans);text-decoration:none;padding:5px 11px;border-radius:999px;border:1px solid var(--line);color:var(--fg)}
ul.topics .v a:first-of-type{background:var(--acc);border-color:var(--acc);color:var(--on-acc)}
.totop{position:fixed;right:16px;bottom:16px;z-index:20;width:44px;height:44px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--fg);box-shadow:var(--sh2);font-size:18px;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .2s}
.totop.show{opacity:1;pointer-events:auto}
/* Reading pages (head, 30 Oct 2026: "reading friendly, for long reading, not like an app"): book typography, flowing
   chapters instead of cards, quiet chrome. The home page keeps its index layout. */
body:not(.home){font:calc(18px * var(--fz,1))/var(--lh,1.75) var(--rf,var(--serif));--read:44rem}
:root[data-font=sans]{--rf:var(--sans)}:root[data-lh=compact]{--lh:1.55}:root[data-lh=relaxed]{--lh:1.95}
/* Reading palette: warm paper and soft ink in light mode; warm charcoal and parchment text in dark mode (never pure black or white). */
body{--bg:#f6f1e7;--surface:#efe8db;--fg:#2b2620;--fg2:#4d453b;--line:#e2d9c9;background:var(--bg);color:var(--fg)}
:root[data-theme=dark] body{--bg:#1d1a16;--surface:#24201b;--card:#2a2520;--muted-bg:#2a2520;--line:#3b352d;--line-strong:#6b6255;--fg:#e6ddcf;--fg2:#c9bfae;--muted:#a1968a;--acc:#9cbcf2;--gold-d:#d9a94e;--ok-soft:#1f2b22;--warn-soft:#332a1d}
@media (prefers-color-scheme:dark){:root:not([data-theme]) body{--bg:#1d1a16;--surface:#24201b;--card:#2a2520;--muted-bg:#2a2520;--line:#3b352d;--line-strong:#6b6255;--fg:#e6ddcf;--fg2:#c9bfae;--muted:#a1968a;--acc:#9cbcf2;--gold-d:#d9a94e;--ok-soft:#1f2b22;--warn-soft:#332a1d}}
@media (max-width:599px){body:not(.home){font-size:calc(17px * var(--fz,1))}}
body::before{display:none}
:root[data-theme=sepia] body{--bg:#f4ecd8;--surface:#ece2c8;--card:#f8f1df;--muted-bg:#ece2c8;--fg:#3b2f22;--fg2:#5a4936;--muted:#77664f;--line:#ddcfb2;--line-strong:#a8977a}
header.top .bar{position:relative}
.reader{position:absolute;right:var(--gutter);top:calc(100% + 6px);z-index:40;width:min(320px,calc(100vw - 2*var(--gutter)));background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:var(--r-md);box-shadow:var(--sh2);padding:14px;font:500 14px var(--sans)}
.reader b{display:block;font:700 11.5px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:2px 0 8px}
.reader .row{display:flex;gap:6px;margin-bottom:14px}.reader .row:last-child{margin-bottom:0}
.reader button{flex:1;min-height:40px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);color:var(--fg);font:600 14px var(--sans);cursor:pointer}
.reader button.on{outline:2px solid var(--acc);outline-offset:-2px}
.reader [data-t=light]{background:#f6f1e7;color:#2b2620}.reader [data-t=sepia]{background:#f4ecd8;color:#3b2f22}.reader [data-t=dark]{background:#1d1a16;color:#e6ddcf}
.reader [data-f=""]{font:600 15px var(--serif)}
.progress{position:fixed;left:0;top:0;height:3px;width:0;z-index:45;background:linear-gradient(90deg,var(--gold-d),var(--batch));opacity:.9;pointer-events:none}
.left{position:fixed;left:16px;bottom:16px;z-index:20;font:500 12.5px var(--sans);color:var(--muted);background:var(--bg);padding:2px 8px;border-radius:999px;opacity:0;transition:opacity .3s;pointer-events:none}.left.show{opacity:.9}
.resume{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:46;background:var(--fg);color:var(--bg);font:500 14px var(--sans);padding:8px 14px;border-radius:999px;box-shadow:var(--sh2);display:flex;gap:12px;align-items:center;max-width:calc(100vw - 32px)}
.resume button{background:none;border:0;color:inherit;font:600 14px var(--sans);text-decoration:underline;cursor:pointer;padding:0}
/* Rasa (head, 30 Oct: "not devoid of rasa, appealing and attractive"): a book's ornaments, in gold, kept light. */
body:not(.home) h1{font-size:clamp(1.8rem,1.5rem + 1.4vw,2.6rem);font-weight:600}
body:not(.home) h1::after{content:'';display:block;width:88px;height:10px;margin:.45em 0 .1em;
background:radial-gradient(circle,var(--gold-d) 2.6px,transparent 3px) center/10px 10px no-repeat,linear-gradient(var(--gold-d),var(--gold-d)) left center/36px 1px no-repeat,linear-gradient(var(--gold-d),var(--gold-d)) right center/36px 1px no-repeat;opacity:.85}
body:not(.home) details.sec{border-top:0;margin-top:2.6em}
body:not(.home) details.sec::before{content:'✿';display:block;text-align:center;color:var(--gold-d);font-size:15px;letter-spacing:.6em;opacity:.8;
background:linear-gradient(var(--line),var(--line)) left center/calc(50% - 22px) 1px no-repeat,linear-gradient(var(--line),var(--line)) right center/calc(50% - 22px) 1px no-repeat}
body:not(.home) .start .msg{font-style:italic;font-size:1.18rem;line-height:1.6}
body:not(.home) blockquote{background:color-mix(in srgb,var(--gold-d) 7%,var(--bg));border-left-color:var(--gold-d)}
body:not(.home) .sloka{background:color-mix(in srgb,var(--gold-d) 5%,var(--bg));border-color:color-mix(in srgb,var(--gold-d) 30%,var(--line));text-align:center}
body:not(.home) .sloka .dev{color:color-mix(in srgb,var(--gold) 70%,var(--fg))}
body:not(.home) .overline{letter-spacing:.14em}
.home .card,.home ul.topics li,.home .search{box-shadow:none}.home .hero p{font:1.08rem/1.6 var(--serif)}
.home ul.topics .t{font:1.02rem/1.4 var(--serif)}.home section.batch>h2{font-size:1.45rem}
body:not(.home) header.top{position:static;backdrop-filter:none;-webkit-backdrop-filter:none;background:var(--bg)}
body:not(.home) main{padding-top:8px}
body:not(.home) main p,body:not(.home) main li{text-wrap:pretty}
body:not(.home) main p{margin:.85em 0}body:not(.home) main li{margin:.35em 0}
body:not(.home) main ul,body:not(.home) main ol{padding-left:1.4em}
body:not(.home) h3{font:600 1.15rem/1.35 var(--serif);margin:1.8em 0 .5em}body:not(.home) h4{font:600 1.03rem var(--serif)}
body:not(.home) details.sec{background:none;border:0;border-top:1px solid var(--line);border-radius:0;box-shadow:none;margin:2.4em 0 0}
body:not(.home) details.sec>summary{padding:1.1em 0 .3em;min-height:0;gap:12px}
body:not(.home) details.sec>summary h2{font:600 1.45rem/1.25 var(--serif)}
body:not(.home) details.sec>summary .letter{background:none;width:auto;height:auto;font:600 1rem var(--serif);color:var(--batch)}
body:not(.home) details.sec>.body{padding:0;border:0}
/* Slokas page (head, 2 Nov): each level and each book in its own bordered panel, easy to trace. */
body:not(.home) details.sec.panel{border:1px solid var(--line-strong);border-radius:var(--r-md);background:var(--card);margin:14px 0;padding:0 18px}
body:not(.home) details.sec.panel::before{display:none}body:not(.home) details.sec.panel>summary{padding:14px 0}body:not(.home) details.sec.panel>.body{padding:0 0 14px;border-top:1px solid var(--line)}
.carry{margin:12px 0;padding:10px 14px;border-left:3px solid var(--gold-d);background:var(--surface);border-radius:0 var(--r-sm) var(--r-sm) 0}.carried{margin:.3em 0;font:15px/1.6 var(--sans)}
body:not(.home) .start{box-shadow:none;border:0;border-left:3px solid var(--batch);border-radius:0;background:none;padding:2px 0 2px 18px}
body:not(.home) .start .msg{font-size:1.15rem}
body:not(.home) .jump{display:block;columns:2 14rem;column-gap:2rem}
body:not(.home) .jump a{display:block;min-height:0;padding:3px 0;background:none;border:0;border-radius:0;font:1rem/1.5 var(--serif);color:var(--acc);text-decoration:underline;text-underline-offset:3px}
body:not(.home) .jump a small{display:none}
a.iconbtn{display:inline-flex;align-items:center;text-decoration:none}
body:not(.home) .tools .iconbtn{border:0;background:none;padding:0 8px 0 0;min-height:32px;font:500 14px var(--sans);color:var(--acc);text-decoration:underline}
body:not(.home) .chip{font-weight:500}
body:not(.home) blockquote{font-size:1.04rem;line-height:1.65}
body:not(.home) table{font:15px/1.5 var(--sans)}
body:not(.home) .tocbar a{border:0;background:none;padding:4px 8px;font-weight:500;color:var(--acc)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
@media print{header.top,nav.views,.search,.toc,.tocbar,.tools,.totop,.jump,.filters,.progress,.left,.resume{display:none!important}body{background:#fff;color:#000;font-size:11.5pt}body::before{display:none}
.layout{display:block;padding:0}main{max-width:none;padding:0}details.sec{box-shadow:none;border:0;margin:0}details.sec>summary::after{display:none}details.sec>.body{border:0;padding:0}
a{color:#000}a[href^="http"]::after{content:" (" attr(href) ")";font-size:9pt}h2{break-after:avoid}table,blockquote,figure{break-inside:avoid}}
`;

// Behaviour shared by every page: theme switch, expand/collapse, open a section reached by link, highlight the
// current section in the side contents, back-to-top, and the home page's batch filter. localStorage is optional.
const JS = `
(()=>{const d=document,root=d.documentElement;
const st=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}},gt=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const rb=d.querySelector('[data-reader]'),rp=d.querySelector('.reader');
const pick=(attr,ds,key)=>rp.querySelectorAll('['+attr+']').forEach(b=>{const v=b.getAttribute(attr);b.classList.toggle('on',(root.dataset[ds]||'')===v);
b.onclick=()=>{if(v)root.dataset[ds]=v;else delete root.dataset[ds];st(key,v||(key==='theme'?'auto':null));pick(attr,ds,key)}});
if(rb&&rp){pick('data-t','theme','theme');pick('data-f','font','font');pick('data-l','lh','lh');
rb.onclick=e=>{e.stopPropagation();rp.hidden=!rp.hidden;rb.setAttribute('aria-expanded',!rp.hidden)};
d.addEventListener('click',e=>{if(!rp.hidden&&!rp.contains(e.target)){rp.hidden=true;rb.setAttribute('aria-expanded','false')}});
d.addEventListener('keydown',e=>{if(e.key==='Escape'&&!rp.hidden){rp.hidden=true;rb.focus()}});
const Z=[.85,.92,1,1.1,1.2,1.32];rp.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{const cur=+(getComputedStyle(root).getPropertyValue('--fz')||1);
let i=Z.indexOf(Z.reduce((a,x)=>Math.abs(x-cur)<Math.abs(a-cur)?x:a));i=+b.dataset.z?Math.max(0,Math.min(Z.length-1,i+ +b.dataset.z)):2;
root.style.setProperty('--fz',Z[i]);st('fz',i===2?null:Z[i])})}
// Diagram labels never overflow their box: a label wider than its box is set smaller (proportions kept, never stretched).
d.querySelectorAll('figure.diagram svg, main svg').forEach(svg=>{try{const vb=svg.viewBox.baseVal,W=vb&&vb.width||svg.getBBox().width;
const boxes=[...svg.querySelectorAll('rect')].map(r=>r.getBBox()).filter(b=>b.width<W*.95);
svg.querySelectorAll('text').forEach(t=>{const b=t.getBBox();if(!b.width)return;const cx=b.x+b.width/2,cy=b.y+b.height/2;
const box=boxes.filter(r=>cx>=r.x&&cx<=r.x+r.width&&cy>=r.y&&cy<=r.y+r.height).sort((p,q)=>p.width*p.height-q.width*q.height)[0];
const L=box?box.x+4:3,R=box?box.x+box.width-4:W-3,a=getComputedStyle(t).textAnchor,c=b.x+b.width/2;
const s=a==='middle'?2*Math.min(c-L,R-c)/b.width:a==='end'?(b.x+b.width-L)/b.width:(R-b.x)/b.width;
if(s<1&&s>0.4){const fs=parseFloat(getComputedStyle(t).fontSize)||12;t.style.fontSize=(fs*s*0.98).toFixed(2)+'px'}})}catch(e){}});
// Export and share. A document is the page's own text in a Word-compatible file; nothing is sent anywhere.
const openAll=()=>secs.forEach(x=>x.open=true);
const docOf=(el,name)=>{const c=el.cloneNode(true);c.querySelectorAll('.tools,.tocbar,.toc,.start .jump,button,input,script,.reveal').forEach(x=>x.remove());
c.querySelectorAll('details').forEach(x=>x.setAttribute('open',''));c.querySelectorAll('.qa .ans').forEach(x=>x.style.display='block');
const h='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>'+name+'</title>'+
'<style>body{font-family:Georgia,serif;font-size:12pt;line-height:1.5}h1{font-size:20pt}h2{font-size:15pt;margin-top:18pt}table{border-collapse:collapse}td,th{border:1px solid #999;padding:4pt}blockquote{border-left:3pt solid #c9a227;margin-left:0;padding-left:8pt}</style></head><body>'+c.innerHTML+'<p style="color:#777">Source: '+location.href+'</p></body></html>';
const a=d.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff',h],{type:'application/msword'}));a.download=name.replace(/[^A-Za-z0-9 ._-]+/g,'').trim().slice(0,80)+'.doc';d.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)};
const toast=m=>{const n=d.createElement('div');n.className='resume';n.textContent=m;d.body.append(n);setTimeout(()=>n.remove(),2500)};
const title=d.title,url=location.href.split('#')[0],pre=d.querySelector('.banner')?'(For preachers only, not for students) ':'';
d.querySelectorAll('[data-pdf]').forEach(b=>b.onclick=()=>{openAll();setTimeout(()=>print(),150)});
// Copy for slides (head, 2 Nov 2026): the page text plus a prompt that keeps any AI slide tool to the page's own sources.
d.querySelectorAll('[data-slides]').forEach(b=>b.onclick=async()=>{openAll();const m=d.querySelector('main').cloneNode(true);
m.querySelectorAll('.tools,.tocbar,.start .jump,button,input,script').forEach(x=>x.remove());const min=(d.querySelector('.start .meta')?.textContent.match(/(\\d+)\\s*min/)||[])[1]||'60';
const P='Make a presentation for a '+min+'-minute lecture from the preacher page below. Follow section G (lecture flow) for the slide order and timing. '+
'Use ONLY the verses, quotations, stories and examples on the page, word for word: do not add any verse, quotation or story of your own, and do not soften or reword what Srila Prabhupada or the scriptures say. '+
'One idea per slide, large readable text; on verse slides give the Sanskrit transliteration and the translation exactly as on the page, with the reference. Use the diagram idea from section N, '+
'the opening questions from section H and the discussion from section M. Put speaker notes from the page under each slide. Warm, devotional design; simple animations (appear, fade). '+
'This is preacher material: do not add a student handout.\\n\\nPAGE: '+d.title+'\\nSOURCE: '+url+'\\n\\n';
const text=P+m.innerText.replace(/\\n{3,}/g,'\\n\\n');
try{await navigator.clipboard.writeText(text);toast('Copied: paste it into ChatGPT, Gemini, Copilot, Gamma or Canva')}
catch(e){const t=d.createElement('textarea');t.value=text;t.style.cssText='position:fixed;inset:10%;width:80%;height:80%;z-index:60';d.body.append(t);t.select();toast('Select all and copy, then close with Esc');t.onkeydown=k=>{if(k.key==='Escape')t.remove()}}});
d.querySelectorAll('[data-doc]').forEach(b=>b.onclick=()=>docOf(d.querySelector('main'),title));
d.querySelectorAll('[data-doc-panel]').forEach(b=>b.onclick=()=>docOf(b.closest('details'),b.dataset.docPanel));
d.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(url);toast('Link copied')}catch(e){prompt('Copy this link:',url)}});
d.querySelectorAll('[data-share]').forEach(b=>b.onclick=async()=>{const t=pre+title;if(navigator.share){try{await navigator.share({title:t,text:t,url})}catch(e){}}
else{const w='https://wa.me/?text='+encodeURIComponent(t+' '+url);if(confirm('Share on WhatsApp? (Cancel copies the link instead.)'))open(w,'_blank');else{try{await navigator.clipboard.writeText(url);toast('Link copied')}catch(e){}}}});
const main=d.querySelector('main');if(main&&!d.body.classList.contains('home')){
const pg=d.createElement('div');pg.className='progress';const lf=d.createElement('div');lf.className='left';d.body.append(pg,lf);
const words=(main.innerText.match(/\S+/g)||[]).length,key='pos:'+location.pathname;let tm;
const upd=()=>{const h=d.documentElement.scrollHeight-innerHeight,f=h>0?Math.min(1,scrollY/h):1;pg.style.width=(f*100)+'%';
const m=Math.ceil(words*(1-f)/200);lf.textContent=m>1?m+' min left':'';lf.classList.toggle('show',scrollY>300&&m>1);
clearTimeout(tm);tm=setTimeout(()=>st(key,scrollY>400&&f<.98?Math.round(scrollY):null),400)};
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);
const saved=+gt(key);if(saved&&!location.hash){scrollTo(0,saved);const n=d.createElement('div');n.className='resume';n.setAttribute('role','status');
n.innerHTML='Continued where you left off <button type="button">Back to start</button>';d.body.append(n);
n.querySelector('button').onclick=()=>{scrollTo({top:0});n.remove()};setTimeout(()=>n.remove(),6000)}upd()}
const secs=[...d.querySelectorAll('details.sec')];
d.querySelector('[data-expand]')?.addEventListener('click',()=>secs.forEach(s=>s.open=true));
d.querySelector('[data-collapse]')?.addEventListener('click',()=>secs.forEach(s=>s.open=false));
const hd=d.querySelector('header.top');const pad=()=>{if(hd)root.style.scrollPaddingTop=(hd.offsetHeight+12)+'px'};pad();addEventListener('resize',pad);
const openHash=()=>{const t=location.hash&&d.getElementById(decodeURIComponent(location.hash.slice(1)));if(t&&t.tagName==='DETAILS'){t.open=true;t.scrollIntoView()}};
addEventListener('hashchange',openHash);openHash();
const links=[...d.querySelectorAll('.toc a')];if(links.length&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id))}),{rootMargin:'-20% 0px -70% 0px'});secs.forEach(s=>io.observe(s))}
const top=d.querySelector('.totop');if(top){top.onclick=()=>scrollTo({top:0,behavior:'smooth'});addEventListener('scroll',()=>top.classList.toggle('show',scrollY>600),{passive:true})}
d.querySelectorAll('.reveal input').forEach(c=>{const qa=c.closest('.body').querySelector('.qa');c.checked=false;c.onchange=()=>qa.classList.toggle('show',c.checked)});
const fs=[...d.querySelectorAll('.filters button')];fs.forEach(b=>b.onclick=()=>{fs.forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;
d.querySelectorAll('section.batch,.cards .card').forEach(el=>el.hidden=!!f&&el.dataset.batch!==f)});
})();
`;

const up = depth => '../'.repeat(depth);
const page = (title, body, depth, batch = '') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#f3eee5" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#0d0b13" media="(prefers-color-scheme: dark)">
<title>${esc(title)}</title><link rel="icon" href="${up(depth)}assets/favicon-32.png"><link rel="apple-touch-icon" href="${up(depth)}assets/apple-touch-icon.png">
<script>try{var r=document.documentElement,L=localStorage,t=L.getItem('theme')||'light',z=L.getItem('fz'),f=L.getItem('font'),l=L.getItem('lh');if(t!=='auto')r.dataset.theme=t;if(z)r.style.setProperty('--fz',z);if(f)r.dataset.font=f;if(l)r.dataset.lh=l}catch(e){document.documentElement.dataset.theme='light'}</script>
<link rel="stylesheet" href="${up(depth)}assets/site.css"></head>
<body${batch ? ` data-batch="${batch}"` : ''}${depth ? '' : ' class="home"'}><a class="skip" href="#main">Skip to content</a>${body}
<button class="totop" type="button" aria-label="Back to top">↑</button><script src="${up(depth)}assets/site.js" defer></script></body></html>`;

const header = (depth, views = '') => `<header class="top"><div class="bar">
<a class="brand" href="${up(depth)}index.html"><img src="${up(depth)}assets/iyf-emblem-64.png" alt="" width="32" height="32"><span><small>IYF Delhi</small>Preacher Library</span></a>${views}
<button class="iconbtn" type="button" data-reader aria-label="Reading settings" aria-expanded="false">Aa</button>
<div class="reader" hidden><b>Page colour</b><div class="row"><button data-t="">Auto</button><button data-t="light">Paper</button><button data-t="sepia">Sepia</button><button data-t="dark">Night</button></div>
<b>Text size</b><div class="row"><button data-z="-1" aria-label="Smaller text">A−</button><button data-z="0">Reset</button><button data-z="1" aria-label="Larger text">A+</button></div>
<b>Font</b><div class="row"><button data-f="">Book</button><button data-f="sans">Clean</button></div>
<b>Line spacing</b><div class="row"><button data-l="compact">Compact</button><button data-l="">Normal</button><button data-l="relaxed">Relaxed</button></div></div></div></header>`;

const tocNav = toc => `<nav class="toc" aria-label="Sections"><b>On this page</b>${toc.map(t => `<a href="#${t.id}">${t.letter ? t.letter + ' · ' : ''}${t.title}</a>`).join('')}</nav>`;
const tocBar = toc => `<nav class="tocbar" aria-label="Jump to section">${toc.map(t => `<a href="#${t.id}">${t.letter || t.title}</a>`).join('')}</nav>`;
// Export and share (head, 2 Nov 2026): save as PDF, download as a document (.doc, opens in Word/Google Docs), share, copy link.
const shareBar = '<button class="iconbtn" type="button" data-share>Share</button><button class="iconbtn" type="button" data-pdf>Save as PDF</button>' +
  '<button class="iconbtn" type="button" data-doc>Download document</button><button class="iconbtn" type="button" data-copy>Copy link</button>';
// Edit on GitHub (head, 2 Nov 2026): opens the page's source in GitHub's editor; only people with access to the private repo can
// save, and a save rebuilds and redeploys the site (.github/workflows/deploy.yml).
const REPO = 'https://github.com/Praveen7j7/preachersLibrary';
const editBtn = id => `<a class="iconbtn edit" href="${REPO}/edit/main/content/topics/${id}.md" target="_blank" rel="noopener" title="For editors with access to the library's GitHub">Edit this page</a>`;
const tools = id => '<div class="tools"><button class="iconbtn" type="button" data-expand>Expand all</button><button class="iconbtn" type="button" data-collapse>Collapse all</button>' +
  '<button class="iconbtn" type="button" data-slides>Copy for slides</button>' + shareBar + editBtn(id) + '</div>';
const shareTools = id => '<div class="tools">' + shareBar + (id ? editBtn(id) : '') + '</div>';

// The preacher's "Start here" panel: the central message and one tap to each part a preacher reaches for.
const JUMPS = [['H', 'How to start', 'Opening and first questions'], ['G', 'Lecture plan', 'Timed flow'], ['E', 'Scripture', 'Verified verses'],
  ['K', 'Questions to expect', 'And answers'], ['M', 'Ask the audience', 'Check understanding, activities'], ['O', 'All resources', 'Every link in one place'],
  ['R', 'Other levels', 'Adapt this topic']];
const startPanel = (central, toc, minutes) => `<section class="start"><h2>Start here</h2>${central ? `<p class="msg">${inline(central)}</p>` : ''}` +
  `<p class="meta">Session: ${minutes} min · everything for this talk is on this page.</p><div class="jump">` +
  JUMPS.map(([l, t, d]) => { const x = toc.find(e => e.letter === l); return x ? `<a href="#${x.id}">${t}<small>${d}</small></a>` : ''; }).join('') + '</div></section>';

// ---------- topics ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'assets'), { recursive: true });
writeFileSync(join(OUT, 'assets/site.css'), CSS.trim() + '\n');
writeFileSync(join(OUT, 'assets/site.js'), JS.trim() + '\n');
for (const f of ['iyf-emblem-64.png', 'favicon-32.png', 'apple-touch-icon.png']) copyFileSync(join(ROOT, 'brand', f), join(OUT, 'assets', f));
writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');  // internal: keep out of search engines
// The combined view was dropped (head, 29 Oct: redundant); old links land on the preacher page (Cloudflare Pages rule).
writeFileSync(join(OUT, '_redirects'), '/topics/dys-01/* /topics/dys-01-s1/preacher 301\n/topics/:id/combined.html /topics/:id/preacher 301\n/topics/:id/combined /topics/:id/preacher 301\n');  // dys-01 retired: split into six sessions

const batchShort = Object.fromEntries(cur.batches.map(b => [b.code, b.short]));
// SKIP=trd-24,trd-25 leaves pages that are still being written out of this build (they show as not written yet).
const SKIP = new Set((process.env.SKIP ?? '').split(',').filter(Boolean));
const files = readdirSync(join(ROOT, 'content/topics')).filter(f => f.endsWith('.md') && !f.startsWith('_') && !SKIP.has(f.slice(0, -3)));
const built = {};
const searchIndex = [];

for (const f of files) {
  const id = f.slice(0, -3);
  const src = readFileSync(join(ROOT, 'content/topics', f), 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  // YAML values may be quoted ("DYS 5: …" needs quotes because of the colon): strip the quotes for display.
  const get = k => fm[1].match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.replace(/\s+#.*$/, '').trim().replace(/^"(.*)"$|^'(.*)'$/, (_, a, b) => a ?? b) ?? '';
  const body = cite(src.slice(fm[0].length));
  const cut = body.search(/^# Part 2: For students\s*$/m);
  let part1 = (cut >= 0 ? body.slice(0, cut) : body).replace(/\n---\s*$/, '').trim().replace(/^# .*\n+/, '');
  const more = moreResources(id, src);
  const tales = storiesFor(id);
  if (tales) part1 = part1.replace(/(## J\. [^\n]*\n[\s\S]*?)(?=\n## [K-Z]\. )/, (j) => j.trimEnd() + tales);
  if (more) part1 = part1.replace(/(## O\. [^\n]*\n[\s\S]*?)(?=\n## [P-Z]\. )/, (o) => o.trimEnd() + more);
  const part2 = cut >= 0 ? body.slice(cut).replace(/^# Part 2: For students\s*\n/, '').trim() : '';
  const title = get('title'), batch = get('batch'), review = get('review'), sensitive = get('sensitive') === 'true';
  const central = (part1.match(/## C\. [^\n]*\n+([\s\S]*?)(?=\n## )/)?.[1] ?? '').replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim();
  const chips = `<div class="chips"><span class="chip batch">${batchShort[batch] ?? batch}</span><span class="chip">${get('duration')} min</span>` +
    `<span class="chip ${review === 'approved' ? 'ok' : review === 'drafted' ? 'warn' : ''}">review: ${review}</span>` +
    (sensitive ? '<span class="chip warn">sensitive</span>' : '') + '</div>';
  const dir = join(OUT, 'topics', id);
  mkdirSync(dir, { recursive: true });
  const views = on => `<nav class="views" aria-label="View">${[['preacher', 'Preacher'], ['students', 'Students']]
    .map(([k, l]) => k === 'students' && !part2 ? '' : `<a href="${k}.html"${k === on ? ' class="on" aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`;
  const P = sections(md(part1), true);   // all open: pages are read top to bottom (head, 30 Oct)
  const S = part2 ? sections(md(part2), true) : { html: '<p class="pending">Student handout not written yet.</p>', toc: [] };
  const shell = (on, toc, inner) => header(2, views(on)) + `<div class="layout has-toc">${tocNav(toc)}<main id="main">${inner}</main></div>`;

  writeFileSync(join(dir, 'preacher.html'), page(`${title} · Preacher`, shell('preacher', P.toc,
    `<p class="overline">${batchShort[batch] ?? batch} · For the preacher</p><h1>${inline(title)}</h1>${chips}` +
    `<div class="banner">For preachers. Not for distribution to students.</div>${startPanel(central, P.toc, get('duration'))}` +
    `${tocBar(P.toc)}${tools(id)}${P.html}`), 2, batch));
  if (part2) writeFileSync(join(dir, 'students.html'), page(`${title} · Student handout`, shell('students', S.toc,
    `<p class="overline">${batchShort[batch] ?? batch} · Student handout</p><h1>${inline(title)}</h1>` +
    `<p class="meta">Missed the session? Read the summary first: it covers the whole lecture. The questions below are answered from it.</p>` +
    `${tocBar(S.toc)}${shareTools(id)}${S.html}`), 2, batch));

  built[id] = { review, sensitive, students: Boolean(part2) };
  searchIndex.push({ id, b: batchShort[batch] ?? batch, t: title, c: central.slice(0, 400),
    r: (fm[1].match(/^references:\n((?:\s+- .*\n?)*)/m)?.[1] ?? '').split('\n').map(x => x.replace(/^\s+- /, '').trim()).filter(Boolean).join(' · ') });
}

// ---------- Gaudiya Research (its own section, beside the batches; head, 29 Oct) ----------
const research = [];
const rdir = join(ROOT, 'content/research');
if (existsSync(rdir)) for (const f of readdirSync(rdir).filter(f => f.endsWith('.md'))) {
  const src = readFileSync(join(rdir, f), 'utf8'), fmr = src.match(/^---\n([\s\S]*?)\n---\n/);
  const title = fmr?.[1].match(/^title:\s*(.+)$/m)?.[1].trim() ?? f.slice(0, -3);
  const R = sections(md(src.slice(fmr ? fmr[0].length : 0).replace(/^# .*\n+/, '')), true);
  mkdirSync(join(OUT, 'research'), { recursive: true });
  writeFileSync(join(OUT, 'research', f.replace(/\.md$/, '.html')), page(title, header(1) +
    `<div class="layout has-toc">${tocNav(R.toc)}<main id="main"><p class="overline">Gaudiya Research</p><h1>${inline(title)}</h1>${tocBar(R.toc)}${shareTools()}${R.html}</main></div>`, 1));
  research.push({ href: `research/${f.replace(/\.md$/, '.html')}`, title });
}

// Every research reference cited on any topic page, traceable to the pages that cite it (built from the pages, so it
// never goes stale). A "research link" is a DOI or a known journal / paper host.
{
  const HOST = /(doi\.org|pubmed|ncbi\.nlm\.nih\.gov|europepmc|sciencedirect|springer|tandfonline|jstor|academic\.oup|wiley|nature\.com|frontiersin|plos|sagepub|cambridge\.org|mdpi|researchgate|semanticscholar|bmj\.com|thelancet)/i;
  const refs = new Map();
  for (const f of files) {
    const id = f.slice(0, -3);
    for (const line of readFileSync(join(ROOT, 'content/topics', f), 'utf8').split('\n')) {
      const bare = [...line.matchAll(/(?<![\w/.])10\.\d{4,9}\/[^\s<)\]|,;]*[^\s<)\]|,;.:]/g)].map(m => ({ 0: 'https://doi.org/' + m[0] }));
      for (const m of [...line.matchAll(/https?:\/\/[^\s<)\]|,;]+[^\s<)\]|,;.]/g), ...bare]) {
        const u = m[0]; if (!HOST.test(u)) continue;
        const key = u.toLowerCase().replace(/^https?:\/\/(dx\.)?/, '').replace(/\/$/, '');
        const text = line.replace(/https?:\/\/\S+/g, '').replace(/[*_`>|#]/g, '').replace(/^\s*[-\d.]+\s*/, '').replace(/\s+/g, ' ').trim().slice(0, 260);
        const r = refs.get(key) ?? { u, text: '', ids: new Set() };
        if (text.length > r.text.length) r.text = text;
        r.ids.add(id); refs.set(key, r);
      }
    }
  }
  const list = [...refs.values()].sort((a, b) => b.ids.size - a.ids.size || a.text.localeCompare(b.text));
  const body = `<p class="meta">${list.length} research references cited across our pages, each linked to the pages that use it. Rebuilt with the site.</p><ul class="topics">` +
    list.map(r => `<li><span class="t">${esc(r.text || r.u)}<br><a href="${esc(r.u)}">${esc(r.u)}</a><br><span class="meta">Cited on: ${[...r.ids].sort().map(i => `<a href="../topics/${i}/preacher.html">${i}</a>`).join(', ')}</span></span></li>`).join('') + '</ul>';
  mkdirSync(join(OUT, 'research'), { recursive: true });
  writeFileSync(join(OUT, 'research', 'all-cited.html'), page('All research cited', header(1) +
    `<main id="main" style="margin:0 auto;padding:24px var(--gutter) 96px"><p class="overline">Gaudiya Research</p><h1>All research cited on our pages</h1>${body}</main>`, 1));
  research.push({ href: 'research/all-cited.html', title: `All research cited on our pages (${list.length})` });
}

// ---------- Slokas: every verified verse, by book, with Sanskrit, translation, where it is used, and per-batch
// memorisation lists from each page's S3 (head, 29 Oct). Built from data, no page edits. ----------
const slokaPages = [];
{
  const used = {};
  for (const f of readdirSync(join(ROOT, 'research/verification')).filter(f => f.endsWith('.json'))) {
    const d = JSON.parse(readFileSync(join(ROOT, 'research/verification', f), 'utf8')), id = f.slice(0, -5);
    if (SKIP.has(id)) continue;
    if (!existsSync(join(ROOT, 'content/topics', id + '.md'))) continue;
    for (const r of d.results ?? []) if (r.status === 'exists') (used[r.cite] ??= new Set()).add(id);
  }
  const memo = {};
  for (const f of files) {
    const src = readFileSync(join(ROOT, 'content/topics', f), 'utf8'), b = src.match(/^batch:\s*(\S+)/m)?.[1];
    const s3 = src.match(/## S3\.[^\n]*\n([\s\S]*?)(?=\n## )/)?.[1] ?? '';
    for (const m of s3.matchAll(/\*\*((?:BG|SB|CC|NOI|ISO|Bs)[^*:]{1,25}?):?\*\*/g)) (memo[b] ??= new Set()).add(m[1].trim());
  }
  const BOOK = c => /^BG/.test(c) ? 'Bhagavad-gita As It Is' : /^ISO/.test(c) ? 'Sri Isopanisad' : /^NOI/.test(c) ? 'Nectar of Instruction'
    : /^SB/.test(c) ? 'Srimad-Bhagavatam' : /^CC/.test(c) ? 'Sri Caitanya-caritamrta' : /^Bs/.test(c) ? 'Brahma-samhita' : 'Other';
  const ORDER = ['Bhagavad-gita As It Is', 'Sri Isopanisad', 'Nectar of Instruction', 'Srimad-Bhagavatam', 'Sri Caitanya-caritamrta', 'Brahma-samhita', 'Other'];
  const card = (c, v) => `<li data-q="${esc((c + ' ' + (v.iast || '') + ' ' + (v.translation || '')).toLowerCase())}"><span class="t"><b><a href="${esc(v.url || '#')}">${esc(c)}</a></b>${slokaBlock(c)}<span>${esc(v.translation || '')}</span>` +
    (used[c] ? `<br><span class="meta">Used on: ${[...used[c]].sort().map(i => `<a href="../topics/${i}/preacher.html">${i}</a>`).join(', ')}</span>` : '') + '</span></li>';
  const groups = {};
  for (const [c, v] of Object.entries(SLOKAS)) (groups[BOOK(c)] ??= []).push([c, v]);
  const extra = existsSync(join(ROOT, 'data/extra-slokas.json')) ? JSON.parse(readFileSync(join(ROOT, 'data/extra-slokas.json'), 'utf8')) : [];
  // Memorisation ladder (head, 2 Nov 2026): levels in curriculum order; each verse is introduced once, at the first level whose
  // handouts (S3) list it; every level expects all verses introduced up to it (carried ones listed compactly, linked to where
  // they were introduced), with a running total up to TRD.
  const ladder = () => {
    const lv = cur.batches.filter(b => memo[b.code]?.size), first = {}, slug = c => c.replace(/[^A-Za-z0-9]+/g, '-');
    lv.forEach((b, i) => { for (const c of memo[b.code]) if (!(c in first)) first[c] = i; });
    const sortc = a => a.sort((x, y) => x.localeCompare(y, 'en', { numeric: true }));
    let total = 0; const rows = lv.map((b, i) => { const n = Object.values(first).filter(x => x === i).length; total += n; return [b, n, total]; });
    let h = '<h2 class="part">Memorise, level by level</h2><p class="meta">Each verse is introduced once, at the first level that expects it. ' +
      'Every level expects all verses up to it: the new ones are listed in full, the earlier ones by reference.</p>' +
      '<div class="table"><table><thead><tr><th>Level</th><th>New verses</th><th>To know in all</th></tr></thead><tbody>' +
      rows.map(([b, n, t]) => `<tr><td>${b.short}</td><td>${n}</td><td>${t}</td></tr>`).join('') + '</tbody></table></div>';
    h += rows.map(([b, n, t], i) => {
      const fresh = sortc(Object.keys(first).filter(c => first[c] === i));
      const carried = lv.slice(0, i).map((pb, k) => { const cs = sortc(Object.keys(first).filter(c => first[c] === k)); return cs.length ?
        `<p class="carried"><b>From ${pb.short}:</b> ${cs.map(c => `<a href="#m-${slug(c)}">${esc(c)}</a>`).join(' · ')}</p>` : ''; }).join('');
      return `<details class="sec panel" data-batch="${b.code}"><summary><span class="letter">${b.short}</span><h2>${esc(b.name)}: ${n} new · ${t} to know in all</h2></summary><div class="body">` +
        `<div class="tools"><button class="iconbtn" type="button" data-doc-panel="${esc(b.short)} slokas to remember">Download this level's list</button></div>` +
        (carried ? `<div class="carry">${carried}</div>` : '') + (fresh.length ? `<h3>New at ${b.short} (${n})</h3><ul class="topics">` +
        fresh.map(c => (SLOKAS[c] ? card(c, SLOKAS[c]) : `<li><span class="t"><b>${esc(c)}</b></span></li>`).replace('<li', `<li id="m-${slug(c)}"`)).join('') + '</ul>' : '') + '</div></details>';
    }).join('');
    return h;
  };
  let body = `<p class="meta">${Object.keys(SLOKAS).length + extra.length} verses: every verse our pages cite, with the Sanskrit and Srila Prabhupada's translation (BBT), and where each is used. Type to filter.</p>` +
    `<input class="search" id="sq" type="search" placeholder="Filter: a reference, a Sanskrit word or an English word" autocomplete="off" aria-label="Filter slokas">` +
    ladder() +
    '<h2 class="part">All verses, by book</h2>' + ORDER.filter(g => groups[g]).map(g =>
      `<details class="sec panel"><summary><h2>${g} (${groups[g].length})</h2></summary><div class="body"><ul class="topics">` +
      groups[g].sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })).map(([c, v]) => card(c, v)).join('') + '</ul></div></details>').join('');
  // The Nectar of Devotion is cited by chapter (a summary study of Bhakti-rasamrta-sindhu, no numbered verses): list the
  // chapters our pages use, with their names (data/nod-chapters.json, built from the verified vedabase pages).
  const NOD = existsSync(join(ROOT, 'data/nod-chapters.json')) ? JSON.parse(readFileSync(join(ROOT, 'data/nod-chapters.json'), 'utf8')) : {};
  const nodIds = Object.keys(NOD).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  if (nodIds.length) body += `<details class="sec panel"><summary><h2>The Nectar of Devotion, by chapter (${nodIds.length})</h2></summary><div class="body">` +
    '<p class="meta">Srila Prabhupada\'s summary study of Bhakti-rasāmṛta-sindhu, cited by chapter.</p><ul class="topics">' +
    nodIds.map(c => `<li data-q="${esc((c + ' ' + NOD[c].name).toLowerCase())}"><span class="t"><b><a href="${esc(NOD[c].url)}">${esc(c)}</a></b> · ${esc(NOD[c].name)}` +
      (used[c] ? `<br><span class="meta">Used on: ${[...used[c]].sort().map(i => `<a href="../topics/${i}/preacher.html">${i}</a>`).join(', ')}</span>` : '') + '</span></li>').join('') +
    '</ul></div></details>';
  // Verses from other sastras as Srila Prabhupada quotes them in his purports (data/quoted-sastras.json, tools/quoted-sastras.mjs).
  const QS = existsSync(join(ROOT, 'data/quoted-sastras.json')) ? JSON.parse(readFileSync(join(ROOT, 'data/quoted-sastras.json'), 'utf8')) : [];
  if (QS.length) {
    body += '<h2 class="part">Mahābhārata, Rāmāyaṇa, Purāṇas and other śāstras, as Srila Prabhupada quotes them</h2>' +
      '<p class="meta">Each verse is taken from Srila Prabhupada\'s purport that quotes it, with his translation where he gives one.</p>';
    for (const g of ['Mahābhārata', 'Rāmāyaṇa', 'Purāṇas', 'Upaniṣads', 'Pañcarātra', 'Manu-saṁhitā', 'Cāṇakya Paṇḍita', 'Other śāstras']) {
      const xs = QS.filter(e => e.group === g); if (!xs.length) continue;
      body += `<details class="sec panel"><summary><h2>${g} (${xs.length})</h2></summary><div class="body"><ul class="topics">` +
        xs.map(e => `<li data-q="${esc((e.source + ' ' + e.ref + ' ' + e.sanskrit + ' ' + e.translation).toLowerCase())}"><span class="t"><b>${esc(e.source)}${e.ref ? ' ' + esc(e.ref) : ''}</b>` +
          `<div class="sloka"><p class="iast">${esc(e.sanskrit).replace(/\n/g, '<br>')}</p></div>${e.translation ? `<span>${esc(e.translation)}</span>` : ''}` +
          `<br><span class="meta">Quoted in: ${e.quotedIn.map(q => `<a href="${esc(q.url)}">${esc(q.cite)} purport</a>`).join(', ')}</span></span></li>`).join('') +
        '</ul></div></details>';
    }
  }
  if (extra.length) body += `<details class="sec panel"><summary><h2>Upanisads and other sastras, as Srila Prabhupada quotes them (${extra.length})</h2></summary><div class="body"><ul class="topics">` +
    extra.map(x => `<li data-q="${esc((x.cite + ' ' + (x.iast || '') + ' ' + (x.translation || '')).toLowerCase())}"><span class="t"><b>${x.source_url ? `<a href="${esc(x.source_url)}">${esc(x.cite)}</a>` : esc(x.cite)}</b>` +
      `${x.iast ? `<div class="sloka"><p class="iast">${esc(x.iast)}</p></div>` : ''}<span>${esc(x.translation || '')}</span></span></li>`).join('') + '</ul></div></details>';
  const js = `<script>const q=document.getElementById('sq');q.addEventListener('input',()=>{const w=q.value.toLowerCase().trim();document.querySelectorAll('li[data-q]').forEach(li=>li.hidden=!!w&&!li.dataset.q.includes(w));if(w)document.querySelectorAll('details.sec').forEach(d=>d.open=true)})</script>`;
  mkdirSync(join(OUT, 'slokas'), { recursive: true });
  writeFileSync(join(OUT, 'slokas', 'index.html'), page('Slokas', header(1) + `<main id="main" style="margin:0 auto;padding:24px var(--gutter) 96px;max-width:900px"><p class="overline">Slokas</p><h1>Important slokas</h1>${shareTools()}${body}</main>` + js, 1));
  slokaPages.push({ href: 'slokas/index.html', title: `Important slokas (${Object.keys(SLOKAS).length + extra.length} verses, memorisation lists by batch)` });
}

// ---------- home ----------
const allTopics = cur.topics.filter(t => t.kind === 'topic');
let home = `<main id="main"><section class="hero"><p class="overline">IYF Delhi · for preachers</p><h1>Preacher Library</h1>
<p>Everything to prepare each IYF topic in one place: what to teach and why at this level, verified scripture, a timed lecture plan,
questions to ask and to expect, every resource link, and a handout students can read even if they missed the class.</p>
<p class="meta">Built ${new Date().toISOString().slice(0, 10)} · internal draft for review · not for public distribution.</p></section>
<input class="search" id="q" type="search" placeholder="Search topics, ideas or verses (e.g. habits, BG 2.14)" autocomplete="off" aria-label="Search">
<div id="results"></div>
<div class="filters" role="group" aria-label="Show batch"><button type="button" class="on" data-f="">All</button>${cur.batches.map(b => `<button type="button" data-f="${b.code}">${b.short}</button>`).join('')}</div>
<div class="cards">` + cur.batches.map(b => {
  const ts = allTopics.filter(t => t.batch === b.code), n = ts.filter(t => built[t.id]).length;
  return `<a class="card" data-batch="${b.code}" href="#${b.code}"><b>${b.short}</b><small>${esc(b.name)}</small><div class="prog"><i style="width:${ts.length ? Math.round(100 * n / ts.length) : 0}%"></i></div><small>${n} of ${ts.length} ready</small></a>`;
}).join('') + cur.notOnSite.map(n => `<div class="card" data-batch="${n.code}"><b>${n.code.toUpperCase()}</b><small>${esc(n.note)}</small></div>`).join('') + '</div>';

home += `<section class="batch" data-batch="sps"><h2 id="slokas">Slokas</h2><ul class="topics">` + slokaPages.map(r => `<li><span class="t"><a href="${r.href}">${esc(r.title)}</a></span></li>`).join('') + '</ul></section>';
if (research.length) home += `<section class="batch" data-batch="trd"><h2 id="research">Gaudiya Research</h2><p class="meta">Scholarly and empirical studies, each checked on Crossref, with what they show and their limits.</p><ul class="topics">` +
  research.map(r => `<li><span class="t"><a href="${r.href}">${esc(r.title)}</a></span></li>`).join('') + '</ul></section>';
for (const b of cur.batches) {
  const ts = allTopics.filter(t => t.batch === b.code);
  home += `<section class="batch" data-batch="${b.code}"><h2 id="${b.code}">${b.short} · ${esc(b.name)}</h2>${b.note ? `<p class="meta">${esc(b.note)}</p>` : ''}<ul class="topics">`;
  for (const t of ts) {
    const x = built[t.id];
    home += `<li${x ? '' : ' class="pending"'}><span class="id">${t.id}</span><span class="t">${esc(t.title)}</span>` + (x
      ? `<span class="v">${x.sensitive ? '<span class="chip warn">sensitive</span>' : ''}<span class="chip">${x.review}</span>` +
        `<a href="topics/${t.id}/preacher.html">Preacher</a>${x.students ? `<a href="topics/${t.id}/students.html">Students</a>` : ''}</span>`
      : '<span class="meta">not written yet</span>') + '</li>';
  }
  home += '</ul></section>';
}
home += '</main>';

const searchJs = `<script src="assets/search-index.js"></script><script>
const q=document.getElementById('q'),out=document.getElementById('results');
const h=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>s.toLowerCase().replace(/[āáà]/g,'a').replace(/[īí]/g,'i').replace(/[ūú]/g,'u').replace(/[ṛṝ]/g,'r').replace(/[ṣś]/g,'s').replace(/[ṭ]/g,'t').replace(/[ḍ]/g,'d').replace(/[ṇñṅ]/g,'n').replace(/[ṁṃ]/g,'m').replace(/ḥ/g,'h').replace(/bhag\\.? ?/g,'sb ').replace(/(\\d)[-:](\\d)/g,'$1.$2');
q.addEventListener('input',()=>{const w=norm(q.value).split(/\\s+/).filter(Boolean);if(!w.length){out.innerHTML='';return}
const hits=SEARCH.map(d=>{const t=norm(d.t),c=norm(d.c),r=norm(d.r);let s=0;for(const x of w){if(t.includes(x))s+=5;else if(r.includes(x))s+=3;else if(c.includes(x))s+=1;else return null}return[s,d]}).filter(Boolean).sort((a,b)=>b[0]-a[0]).slice(0,20);
out.innerHTML=hits.length?'<ul class="topics">'+hits.map(([,d])=>'<li><span class="id">'+h(d.id)+'</span><span class="t"><a href="topics/'+encodeURIComponent(d.id)+'/preacher.html">'+h(d.t)+'</a><br><span class="meta">'+h(d.c.slice(0,160))+'…</span></span></li>').join('')+'</ul>':'<p class="meta">No written topic matches yet.</p>'});
</script>`;
writeFileSync(join(OUT, 'assets/search-index.js'), 'const SEARCH=' + JSON.stringify(searchIndex) + ';\n');
writeFileSync(join(OUT, 'index.html'), page('IYF Preacher Library', header(0) + home + searchJs, 0));
console.log(`${Object.keys(built).length} topics built → ${join(OUT, 'index.html')}`);
