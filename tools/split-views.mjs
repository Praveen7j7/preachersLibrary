// Make the three documents for every topic from its single source file content/topics/<id>.md:
//   dist/md/<batch>/<id>/preacher.md   Part 1 only (A–Q): for preachers, not for students
//   dist/md/<batch>/<id>/students.md   Part 2 only (S1–S8): safe to share with participants
//   dist/md/<batch>/<id>/combined.md   both parts, for review and full preparation
// One source keeps the handout from drifting away from what the preacher teaches.
//
// Usage: node tools/split-views.mjs [id ...]      (default: every topic page)

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'content/topics');
const cur = JSON.parse(readFileSync(join(ROOT, 'data/curriculum.json'), 'utf8'));
const batchName = Object.fromEntries(cur.batches.map(b => [b.code, b.short]));
import { makeCiter } from './citations.mjs';
const cite = makeCiter(ROOT);

const ids = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync(SRC).filter(f => f.endsWith('.md') && !f.startsWith('_')).map(f => f.slice(0, -3));

let made = 0;
for (const id of ids) {
  const src = readFileSync(join(SRC, `${id}.md`), 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) throw new Error(`${id}: no front matter`);
  const get = k => fm[1].match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.replace(/\s+#.*$/, '').trim() ?? '';
  const body = cite(src.slice(fm[0].length));
  const cut = body.search(/^# Part 2: For students\s*$/m);
  const part1 = (cut >= 0 ? body.slice(0, cut) : body).replace(/\n---\s*$/, '').trim();
  const part2 = cut >= 0 ? body.slice(cut).replace(/^# Part 2: For students\s*\n/, '').trim() : '';
  const title = get('title');
  const batch = get('batch');
  const label = batchName[batch] ?? batch.toUpperCase();

  const preacher = [
    `# ${title}`, '',
    `> **For preachers. Not for distribution to students.** ${label} · ${get('duration')} min · review: ${get('review')}` +
      (get('sensitive') === 'true' ? ' · sensitive topic' : ''),
    '', part1.replace(/^# .*\n+/, ''), '',
  ].join('\n');
  const students = part2 ? [
    `# ${title}`, '', `> **Student handout** · ${label} · IYF Delhi`, '', part2, '',
  ].join('\n') : `# ${title}\n\n> Student handout not written yet.\n`;
  const combined = [preacher.trim(), '', '---', '', '# Part 2: For students', '', part2 || '_Not written yet._', ''].join('\n');

  const out = join(ROOT, 'dist/md', batch, id);
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'preacher.md'), preacher);
  writeFileSync(join(out, 'students.md'), students);
  writeFileSync(join(out, 'combined.md'), combined);
  made++;
  if (!part2) console.log(`${id}: no student part yet`);
}
console.log(`${made} topics → preacher.md, students.md, combined.md in dist/md/`);
