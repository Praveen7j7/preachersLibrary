// Turn internal source paths (research/...) into readable citations for published output (site, documents, PDFs).
// The topic source files keep the exact paths for reviewers; only what readers see is rewritten.
//   research/encyclopedia/<section>/<nnnn title>.txt → Preaching Encyclopedia (HG Radheshyam Das, VOICE): section › title
//   research/iyf-materials/<row>/<file>.txt          → IYF notes: <file>, linked to the original Drive file when known
//   research/books/<name>.txt                        → <book title>
//   research/desire-tree/.../<file>.txt              → ISKCON Desire Tree seminar: <title>
//   internal planning files                          → plain label, no link

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function makeCiter(root) {
  const manPath = join(root, 'research/iyf-materials/manifest.json');
  const man = existsSync(manPath) ? JSON.parse(readFileSync(manPath, 'utf8')) : { items: {} };
  const urlOf = {};
  for (const it of Object.values(man.items)) if (it.file && /^https?:/.test(it.url || '')) urlOf[it.file] = it.url;

  const nice = s => s.replace(/\.(txt|md|json|csv)$/i, '').replace(/[_]+/g, ' ').replace(/\s*\(OCR\)\s*/i, ' ')
    .replace(/\.(pdf|pptx?|docx?)$/i, '').replace(/\s+/g, ' ').trim();

  function label(path) {
    const p = path.replace(/[.,;:)]+$/, '');
    const parts = p.split('/');
    const top = parts[1] || '';
    if (top === 'encyclopedia') {
      const section = parts.length > 3 ? nice(parts[2]) : '';
      const title = parts.length > 2 && /\.txt$/.test(p) ? nice(parts.at(-1).replace(/^\d{4}\s+/, '')) : '';
      return { text: 'Preaching Encyclopedia (HG Radheshyam Das, VOICE)' + (section || title ? ': ' + [section, title].filter(Boolean).join(' › ') : '') };
    }
    if (top === 'iyf-materials') {
      if (parts[2] === 'iyf-kra') return { text: 'IYF KRA/KPI workbook (internal)' };
      if (parts[2] === 'iyf-docs') return { text: `IYF curriculum document${parts[3] ? ': ' + nice(parts.at(-1)) : 's'} (internal)` };
      if (parts[2] === 'dys-book') return { text: 'Discover Your Self (VOICE, Pune)' };
      const file = /\.(txt|csv)$/.test(p) ? nice(parts.at(-1)) : '';
      return { text: file ? `IYF notes: ${file}` : 'IYF notes', url: urlOf[p] };
    }
    if (top === 'books') return { text: bookTitle(parts.at(-1) || 'book') };
    if (top === 'desire-tree') return { text: `ISKCON Desire Tree seminar${/\.txt$/.test(p) ? ': ' + nice(parts.at(-1)) : 's'}` };
    if (top === 'radheshyamdas') return { text: 'radheshyamdas.com course index' };
    if (top === 'chaitanyacharan') return { text: 'Chaitanya Charan Das articles' };
    if (top === 'gurus') return { text: 'S.B. Keshava Swami, Tattva' };
    if (top === 'voice') return { text: 'VOICE Pune courses' };
    if (top === 'verification') return { text: 'verification record (internal)' };
    if (/batch-criteria/.test(p)) return { text: 'IYF batch criteria (internal)' };
    if (/sources-map/.test(p)) return { text: 'IYF source map (internal)' };
    return { text: '\u0000' };   // internal planning files (briefs, lists): nothing shown to readers
  }
  // research/books/<Author_Name_Sri_Title>.txt → "Author, Title (Desire Tree edition)"
  const AUTHORS = [['Rupa_Goswami', 'Rupa Gosvami'], ['Jiva_Goswami', 'Jiva Gosvami'], ['Sanatana_Goswami', 'Sanatana Gosvami'],
    ['Raghunatha_dasa_Goswami', 'Raghunatha dasa Gosvami'], ['Gopala_Bhatta_Goswami', 'Gopala Bhatta Gosvami'],
    ['Krsnadasa_Kaviraja_Goswami', 'Krsnadasa Kaviraja Gosvami'], ['Bhaktivinoda_Thakura', 'Bhaktivinoda Thakura'],
    ['Bhaktisiddhanta_Sarasvati_Thakura', 'Bhaktisiddhanta Sarasvati Thakura'], ['Visvanath_Cakravarti_Thakura', 'Visvanatha Cakravarti Thakura'],
    ['Baladeva_Vidyabhusana', 'Baladeva Vidyabhusana'], ['Narottama_dasa_Thakura', 'Narottama dasa Thakura'],
    ['Narahari_Cakravarti_Thakura', 'Narahari Cakravarti Thakura'], ['Nityananda_dasa', 'Nityananda dasa'], ['Kavi_Karnapura', 'Kavi Karnapura']];
  function bookTitle(file) {
    const name = file.replace(/\.txt$/i, '');
    for (const [k, v] of AUTHORS) if (name.startsWith(k + '_') || name.startsWith(k + '-')) {
      const t = nice(name.slice(k.length + 1).replace(/^(Sri_)+/, '').replace(/\d+$/, '').replace(/-0?\d+$/, ''));
      return `${v}, ${t}`;
    }
    return nice(name);
  }

  const render = path => {
    const l = label(path);
    return l.url ? `[${l.text}](${l.url})` : l.text;
  };

  return function clean(md) {
    const out = md.replace(/research\/books\/([^\s`]+) \(OCR\)\.txt/g, (_, n) => render('research/books/' + n + '.txt'))
      .replace(/`(research\/[^`]+)`/g, (_, p) => render(p))
      .replace(/\[([^\]]*)\]\((research\/[^)]+)\)/g, (_, t, p) => { const l = label(p); return l.url ? `[${t || l.text}](${l.url})` : (t || l.text); })
      .replace(/(?<![\w/])(research\/[^\s)\]|,;"'`]+)/g, (_, p) => render(p));
    // tidy what is left where an internal note was removed: "(background only; \0 §2)" → "(background only)"
    return out.replace(/\s*[;,:]?\s*\u0000(\s*§\s*\d+)?/g, '').replace(/\(\s*\)/g, '').replace(/\(\s*[;,]\s*/g, '(').replace(/\s+\)/g, ')');
  };
}
