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
        const texts = [...svg.querySelectorAll('text')].map(t => ({ b: t.getBBox(), s: t.textContent.trim().slice(0, 40) })).filter(t => t.b.width > 0);
        const inter = (a, b) => Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
        const inside = (a, r) => a.x >= r.x - 1 && a.y >= r.y - 1 && a.x + a.width <= r.x + r.width + 1 && a.y + a.height <= r.y + r.height + 1;
        texts.forEach((t, i) => {
          if (W && (t.b.x < -1 || t.b.y < -1 || t.b.x + t.b.width > W + 1 || t.b.y + t.b.height > H + 1)) out.push(`diagram ${si + 1}: "${t.s}" goes outside the frame`);
          for (let j = i + 1; j < texts.length; j++) { const o = inter(t.b, texts[j].b);
            if (o > 0.15 * Math.min(t.b.width * t.b.height, texts[j].b.width * texts[j].b.height)) out.push(`diagram ${si + 1}: "${t.s}" overlaps "${texts[j].s}"`); }
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
