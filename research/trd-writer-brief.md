# TRD pages: brief for each writer (30 Oct 2026)

**Layout check (head, 2 Nov 2026):** diagrams (section N) hold short labels inside boxes only; put any explanation as normal text
below the diagram, never as loose lines inside it. Before reporting, run `node tools/build-site.mjs` then
`node tools/layout-check.mjs <id>` and fix every issue it lists.

**Source pack first (head, 2 Nov 2026):** before reading any source, open research/packs/<id>.json and <id>.notes.md for your
topic (and for any page you link to). Fetch only what is not there. In research/packs/<id>.notes.md keep a "Further
sources" list: verses, purport passages, book passages, letters and stories relevant to the topic that the page does not
use, each with its exact location and the level or deeper session it would serve, so the next writer need not search again.

TRD = temple residents: ashram brahmacaris and full-time preachers who have already given their lives (aims and list:
`research/trd-topics.md`, approved by the head 29 Oct 2026). Write NEW pages `content/topics/trd-NN.md`.

## Read (token budget: read these once, then only what each topic needs)
1. `CLAUDE.md` (this folder): every head rule applies, incl. 30 Oct: history as it is; as it is, no softening;
   spiritual dimension > material needs.
2. `research/writer-brief.md` in full (template use, citation rules, session formats, plain English, Krishna conscious use).
3. `content/topics/_template.md`, and ONE finished page as the bar: `content/topics/dps-15.md`.
4. `research/trd-topics.md`: the intro, your group's intro and your rows (core sources = starting points).
5. Groups F and G: `research/advanced-books.md` (§1 lecture material; §2 confidential rasa texts are background only, never quoted
   as lecture content; §3–4). Books are in `research/books/` (grep; never read a whole book).

## Per topic
- Front matter: `batch: trd`, `duration: 180`, `status: existing`, `review: drafted`, `lang: en`, `difficulty: advanced`;
  `sensitive: true` for every group G topic, trd-33, trd-38, and any topic on scandals, falldown or mental strain.
- Up to 3 hours is time available, not a length to fill: aim for about 450 lines; the page must still meet the topic's need
  end to end (head, 30 Oct), so trim only repetition or padding, never needed content. Cite the most reliable source when a statement exists in several
  places (CLAUDE.md). Check your page with `node tools/gate.mjs trd-NN` before reporting; fix every FAIL it lists.
- Main content from Srila Prabhupada's books (vedabase). Advanced texts (Sandarbhas, Madhurya-kadambini, Harinama-cintamani,
  Jaiva-dharma, Govinda-bhasya etc.) are cited by edition and chapter/anuccheda from the file in research/books/; never
  invent a quotation or a number. "Requires source review" where you cannot locate the passage.
- Every verse: `node tools/verify-refs.mjs content/topics/<id>.md`; read the full purport on vedabase before any purport point.
- Don't repeat BSS/DPS: link to the page that already covers it (ids in `data/curriculum.json`; `ls content/topics/`).
- Section R: notes for using the topic at BSS/DPS level (one short block per level).
- Questions (H, K, M, S5, S6, S7): TRD level of the ladder (writer-brief "Questions climb the ladder"): realization,
  application, challenges, daily reflection; theory only where it must be known first.
- Source budget: about 30,000 characters read per topic; grep first.

## Edit only
Your own `content/topics/trd-NN.md` files and their `research/verification/trd-NN.json`. Other writers work in parallel.

## Reply (short)
One line per topic: id, lines, references (count), anything marked "Requires source review", any question for the head.
