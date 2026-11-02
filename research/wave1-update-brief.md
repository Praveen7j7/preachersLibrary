# Wave 1 update pass: brief for each helper (29 Oct 2026)

You update existing topic pages in `content/topics/` to the head's new standard. **Edit sections in place with the
Edit tool; never rewrite a whole file; don't touch sections not listed.** Keep additions lean: the head has a tight
token budget. Background rules: `research/writer-brief.md` (read only the sections "Verses by level, durations, and
section R" and "One place, and engaging sessions"). `duration:` is already set; don't change it.

For each page you are given:

0. **A** – set the "Suggested duration" row to match `duration:` (VL1 "45–60 min"; DYS/VL2/VL3 "about 3 hours: 90 min lecture + 90 min engagement"; DPS "2 hours").
1. **B** – make the "Level | Treatment" table one line each for VL1, VL2, VL3, SPS, DPS, BSS (add missing rows only).
2. **G** – retime to the session format. VL1: one 45–60 min flow. DYS/VL2/VL3: ~90 min lecture + ~90 min engagement
   block (name the activities from M.2), plus "Alternative: up to a 2-hour lecture, activities skipped". DPS: 120 min.
   Adjust timings; keep the content.
3. **H** – add at its top **H.1 How to start (first 5 minutes)** (4–6 short steps) and **H.2 Opening questions**
   (2–3, about the audience's own life, at the level). Reuse what H already has; don't repeat it.
4. **M** – make it **M.1 Closing check questions** (4–6, each with the expected answer, easy first), **M.2 Activities**
   (VL1: one short activity; DYS/VL2/VL3: at least two ready options for the engagement block, with steps and minutes),
   **M.3 Reflection** (keep what exists). Encouraging: invite, praise good answers, no shame, no private disclosure.
5. **O** – make sure every link a preacher needs is listed in O (gather links already elsewhere on the page: IYF notes,
   decks, recordings, books). No new research.
6. **R. Adapting for another level** (before "# Part 2") – create or complete:
   - **R.1 Deeper verses in reserve:** 3–5 verses (CC, SB 10–12, NOD, BRS, NOI), one line of use each, labelled
     "For a more advanced audience; not for this level's talk or handout". **Move** any advanced verse now in this
     page's talk (I, G) or student handout into R.1 (VL1/DYS: keep talks to BG, ISO, simple SB 1–9).
   - **R.2 onward:** one block per other level the topic fits (VL2, VL3, SPS, DPS, BSS): 2–4 lines of extra points,
     one verse reference, one activity idea, in that batch's style. Never restate a B line.
   - Add every new verse to front-matter `references:`.
   - **When you move a verse, fix every other mention of it on the page** (search the page: D, E, K, L, S-sections too).
     If an advanced verse is the core of the talk and cannot move, keep it, add "(deeper verse; the talk uses only its
     plain meaning)" beside it, and list it in your report for the head.
7. **S1** – rewrite as a full summary a student who missed the session can follow: 2–4 short paragraphs, in the
   lecture's order, at the level's language. Check S5 and S6 are answerable from S1–S4 (adjust S1, not the questions).
8. **Diagram (every page; head, 29 Oct)** – if N has no `<svg>` yet (a text-drawn chart does not count: redraw it as SVG), add one small inline diagram of the page's core
   idea (flow, cycle, stages, comparison or map): `<svg viewBox=…>`, ≤ 14 elements, text ≥ 12px, `currentColor`
   strokes/text and at most one accent fill, with a one-line caption under it. Where it helps students, put a simpler
   copy in S2. One diagram per page is enough; keep it small (it must read on a phone).

**Use all our resources, smartly (head, 29 Oct).** For each page, read ONLY its entry in `data/sources-map.json`
(IYF notes and decks, IYF lectures, Encyclopedia chapters, books, radheshyamdas, chaitanyacharan, gurus) and any
transcripts in `research/iyf-materials/<id>/*.transcript.txt`. Put every relevant one in O; draw R material,
examples and activities from them. Open a source only for a section you are editing; never read whole books.

**Global, professional standard (head, 29 Oct).** This is a professional preachers' library meant for use across
the globe. Write in clear international English; explain every Sanskrit, Hindi or IYF-specific term at first use; where
an example is local (Indian campus, exams, family customs), add one that works for youth anywhere, or say how to adapt
it; no unexplained local references; precise citations; consistent formatting; respectful, inclusive tone. Audience: everyone, from the layman and the remotest, poorest communities to professionals and the highest levels of society: student pages in plain words a first-time reader follows; never assume wealth, schooling or a city life; where it helps, give one example from village or working life and one from professional or leadership life. **No vagueness, nothing fake, no assumptions:** every claim is concrete and either sourced (verse, book, paper, IYF material) or labelled as the preacher's application or an invented example; no invented quotations, stories, statistics or "studies show"; if a source cannot be checked, write "Requires source review" instead of guessing.

**No repetition inside a batch (head, 29 Oct).** A batch's pages never repeat each other's arguments, examples or
stories; DYS counts as part of VL2 and is taught first. Before editing, read the titles and central messages of the
other pages in the same batch (`dist/site/assets/search-index.js`, field `c`). Where a page overlaps an earlier one,
add one line at the top of B ("Builds on <id>: …"), cut the repeated material, keep only this page's own angle, and
link the earlier page. A key verse may recur only for a different point. Known overlaps (DYS first, VL2 builds on it):
DYS-1 "Can a scientist believe in God" ↔ vl2-08 God and Science; DYS-3 "Are Vedas relevant today" ↔ vl2-06 (keep
vl2-06 to ISKCON's ways of re-establishing practical Vedic culture); DYS-4 "Science of soul" ↔ vl2-01 reincarnation;
DYS-5 "Substance and shadow" ↔ vl2-03 happiness; DYS-6 "If God is one, why many religions" ↔ vl2-04 object of worship.

**Checks before you finish each page:** `node tools/verify-refs.mjs content/topics/<id>.md` (every reference must exist;
quote new verses only from `research/verification/<id>.json`); then `node tools/register.mjs` must not list the page as
missing a section. Write only your assigned pages and their `research/verification/<id>.json`. Report per page in one
line: what changed, verses added or moved, any problem.
