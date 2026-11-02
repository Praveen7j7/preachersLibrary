// Layout check (head, 2 Nov 2026: "whenever you make a page, check the basic UI: nothing overlapping, no basic nuisance").
// Opens every built page in a real browser (headless Chromium, already on this Mac) at phone (390 px) and desktop (1280 px)
// width and reports, per page:
//   - diagram text overlapping other diagram text
//   - diagram text running across a box it is not inside
//   - diagram parts outside the drawing's frame
//   - the page scrolling sideways
// No model tokens. Run after tools/build-site.mjs:  node tools/layout-check.mjs [ids...]   → research/verification/layout.json
import { readdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), SITE = join(ROOT, 'dist/site/topics');
async function loadChromium() {
  try { return (await import('playwright-core')).chromium; } catch {}
  const npx = join(homedir(), '.npm/_npx');
  for (const d of existsSync(npx) ? readdirSync(npx) : []) {
    const m = join(npx, d, 'node_modules/playwright-core/index.mjs');
    if (existsSync(m)) return (await import(pathToFileURL(m).href)).chromium;
  }
  throw new Error('playwright-core not found: run `npx playwright install chromium` once (setup step)');
}
const chromium = await loadChromium();
const args = process.argv.slice(2);
const ids = readdirSync(SITE).filter(d => !args.length || args.some(a => d === a || d.startsWith(a + '-')));
// Use whichever headless Chromium is already installed (no download needed); Playwright's own default if none is found.
const MS = join(homedir(), 'Library/Caches/ms-playwright');
const shell = existsSync(MS) ? readdirSync(MS).filter(d => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map(d => join(MS, d, 'chrome-headless-shell-mac-arm64/chrome-headless-shell')).find(existsSync) : undefined;
const browser = await chromium.launch(shell ? { executablePath: shell } : {});
const report = {}; let bad = 0;
for (const width of [390, 1280]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const id of ids) for (const view of ['preacher', 'students']) {
    const f = join(SITE, id, view + '.html'); if (!existsSync(f)) continue;
    await page.goto(pathToFileURL(f).href, { waitUntil: 'load' });
    await page.waitForTimeout(150);   // let the label-fit script run
    const issues = await page.evaluate(() => {
      const out = [], d = document.documentElement;
      if (d.scrollWidth > d.clientWidth + 1) out.push(`page scrolls sideways (${d.scrollWidth - d.clientWidth}px)`);
      document.querySelectorAll('details').forEach(x => x.open = true);
      document.querySelectorAll('main svg').forEach((svg, si) => {
        const vb = svg.viewBox.baseVal, W = vb?.width || 0, H = vb?.height || 0;
        const rects = [...svg.querySelectorAll('rect')].map(r => r.getBBox()).filter(b => !(W && b.width >= W * .95 && b.height >= H * .95));
        const shapes = [...svg.querySelectorAll('ellipse, circle')].map(e => { const a = n => +(e.getAttribute(n) || 0);
          return e.tagName === 'circle' ? { cx: a('cx'), cy: a('cy'), rx: a('r'), ry: a('r') } : { cx: a('cx'), cy: a('cy'), rx: a('rx'), ry: a('ry') }; }).filter(e => e.rx > 0 && e.ry > 0);
        const segs = [...svg.querySelectorAll('line')].map(l => ({ x1: +l.getAttribute('x1'), y1: +l.getAttribute('y1'), x2: +l.getAttribute('x2'), y2: +l.getAttribute('y2') }));
        const texts = [...svg.querySelectorAll('text')].map(t => ({ b: t.getBBox(), s: t.textContent.trim().slice(0, 40) })).filter(t => t.b.width > 0);
        const inter = (a, b) => Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
        const inside = (a, r) => a.x >= r.x - 1 && a.y >= r.y - 1 && a.x + a.width <= r.x + r.width + 1 && a.y + a.height <= r.y + r.height + 1;
        texts.forEach((t, i) => {
          if (W && (t.b.x < -1 || t.b.y < -1 || t.b.x + t.b.width > W + 1 || t.b.y + t.b.height > H + 1)) out.push(`diagram ${si + 1}: "${t.s}" goes outside the frame`);
          for (let j = i + 1; j < texts.length; j++) { const u = texts[j].b;   // any real touch: >3px across and >25% of a line's height
            const ox = Math.min(t.b.x + t.b.width, u.x + u.width) - Math.max(t.b.x, u.x), oy = Math.min(t.b.y + t.b.height, u.y + u.height) - Math.max(t.b.y, u.y);
            if (ox > 3 && oy > 0.25 * Math.min(t.b.height, u.height)) out.push(`diagram ${si + 1}: "${t.s}" overlaps "${texts[j].s}"`); }
          // circles and ellipses: text whose corners fall both inside and outside an outline crosses it
          for (const e of shapes) { const pts = [[t.b.x + 2, t.b.y + 2], [t.b.x + t.b.width - 2, t.b.y + 2], [t.b.x + 2, t.b.y + t.b.height - 2], [t.b.x + t.b.width - 2, t.b.y + t.b.height - 2]];
            const ins = pts.map(([px, py]) => ((px - e.cx) / e.rx) ** 2 + ((py - e.cy) / e.ry) ** 2 <= 1); if (ins.some(Boolean) && !ins.every(Boolean)) { out.push(`diagram ${si + 1}: "${t.s}" crosses a circle's outline`); break; } }
          // connector lines: text lying on a line segment
          for (const l of segs) { const n = 12; let hit = false;
            for (let k = 1; k < n; k++) { const px = l.x1 + (l.x2 - l.x1) * k / n, py = l.y1 + (l.y2 - l.y1) * k / n;
              if (px > t.b.x + 2 && px < t.b.x + t.b.width - 2 && py > t.b.y + 2 && py < t.b.y + t.b.height - 2) { hit = true; break; } }
            if (hit && getComputedStyle(svg.querySelector('text')).paintOrder.indexOf('stroke') !== 0) { out.push(`diagram ${si + 1}: "${t.s}" sits on a line`); break; } }   // outlined text over a line is fine
          const home = rects.filter(r => inside(t.b, r));
          for (const r of rects) if (!home.includes(r) && inter(t.b, r) > 0.1 * t.b.width * t.b.height && !home.some(h => inside(h, r) || inside(r, h)))
            { out.push(`diagram ${si + 1}: "${t.s}" runs across a box`); break; }
        });
      });
      return [...new Set(out)];
    });
    if (issues.length) { (report[`${id}/${view}`] ??= {})[width] = issues; }
  }
  await page.close();
}
await browser.close();
bad = Object.keys(report).length;
writeFileSync(join(ROOT, 'research/verification/layout.json'), JSON.stringify(report, null, 1) + '\n');
console.log(`${ids.length} topics checked at 390 and 1280 px · ${bad} page views with layout issues → research/verification/layout.json`);
for (const [k, v] of Object.entries(report)) console.log(`  ${k}: ${[...new Set(Object.values(v).flat())].slice(0, 3).join(' | ')}`);
process.exit(bad ? 1 : 0);
