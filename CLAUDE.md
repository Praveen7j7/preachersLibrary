# Preacher Library: context

**Goal (head, 29 Oct 2026): a professional-level preachers' library usable across the globe** — international English,
terms explained, examples that travel, **every head decision applies to all batches, courses and topics**, no compromise on accuracy or deliverables. For everyone: from the layman and remotest communities to the highest levels of society.

Preparation pages for IYFD preachers, one per topic of https://iyf-lectures.vercel.app/. See README.md.

- **Separate project.** It reads the Sadhana app's reading/hearing data (`../sadhanaRecord/setup/data/journals.json`)
  but never changes `sadhanaRecord/` or `faciliatorDashboard/`.
- **Stage gate.** The head reviewed Stages 1–2 and approved the build on 28 Oct 2026; he reviews the content after the
  build. English first, Hindi only after his proofreading. No PDFs before the HTML content is approved.
- **Catalogue facts come from the site, never memory.** Re-run `node tools/fetch-catalogue.mjs`; topic ids are
  `<batch>-<nn>` from the site's numbering.
- **Every verse cited goes through `node tools/verify-refs.mjs`.** "Exists" is not "Verified": an editor must also
  check that the translation and purport support the use. Label applications as "Application (preacher's)".
- **SB from Canto 10 ch. 14 and Cantos 11–12:** add "BBT translation, completed by Srila Prabhupada's disciples".
- **Inaccessible sources** (none left since 29 Oct; *Brahma-vaivarta Purana* = Sen 1920 tr. in research/books/) are cited only as "Requires source review", never as
  established. *Madhurya-kadambini* (approved), *Caitanya-bhagavata* (narratives), BRS, *Bhakti-ratnakara*, *Prema-vilasa*,
  *Bhakti-sandarbha* are in research/books/ (OCR where needed).
- **BVS is left out** and **TRD** (temple residents: ashram brahmacaris and full-time preachers) is the top level; aims (head, 29 Oct): missionary spirit, depth with Krishna, non-duplicity, relishing transcendental sweetness while preaching. Approved list (54): research/trd-topics.md. Advanced siddhanta (Sat-sandarbhas, Harinama-cintamani, Govinda-bhasya etc.) is TRD material (head, 29 Oct); which books are advanced and which confidential rasa texts stay out of lectures: research/advanced-books.md. SPS2+SPS1 = one batch SPS (`sps-NN`). Decisions: research/stage1-discovery-report.md §9.
- **Session formats and links (head, 29 Oct):** plan pages to the session format in research/writer-brief.md "Session formats" (VL1 45–60 min; VL2/VL3 ~3 h half lecture, half engagement; SPS/BSS/DPS 2 h; TRD ≤3 h) — time available, not a length to fill. Content covers every level (e.g. Happiness timed as VL1, preparable for BSS from the same page): B = one line per level, R = the material per level, never repeated. Every link must work: run `node tools/check-links.mjs` after each build; lecture/deck links come from IYF's media library sheet (the central link manager). Recordings may be Hindi (whisper auto-detects; verses always from vedabase). Files IYF must re-share: research/access-requests.md.
- **Three parts (head, 29 Oct):** batches; **Courses** (Bhakti-sastri BG/ISO/NOI/NOD, Bhakti-vaibhava SB 1–6, Bhaktivedanta
  SB 7–12, Bhakti-sarvabhauma CC; study sessions, no exams) and **Gaudiya Research** (Research Hub), each its own section:
  research/courses.md. No "BBS" batch exists. TRD list approved (54 topics, incl. rasa and senior blockers).
- **Plain, clear English (head, 29 Oct):** every sentence understood at first reading by a student reading alone:
  full everyday sentences, exact steps (who, which verse, what to do), no clipped slogans, riddles or unexplained
  images. Rule and bad/good example: research/writer-brief.md "Plain, clear English".
- **Krishna conscious use (head, 29 Oct):** every story, verse and example on every page leads the listener to Krishna and
  bhakti. Verses are read as Srila Prabhupada's purport reads them, stories end in their devotional lesson, worldly
  examples end in the Krishna conscious point they serve, and problems are solved by chanting, hearing and service.
  Rule text: research/writer-brief.md.
- **Source packs, read once, reuse forever (head, 2 Nov 2026):** every page has research/packs/<id>.json (built by
  `node tools/source-pack.mjs <id>`: every verse cited incl. section R with full translation + purport, every quote traced
  to its source passage, stories, links) and research/packs/<id>.notes.md. Any agent working on a topic READS THE PACK
  FIRST and fetches only what is genuinely new. In the notes file it keeps a "Further sources" list: verses, purport
  passages, book passages, letters and stories relevant to the topic that the page does not use, each with its exact
  location and the level or deeper session it would serve.
  After an agent finishes, rerun source-pack for its pages. Edits later change only what the page needs, from the pack.
- **Questions climb the ladder (head, 30 Oct 2026):** higher batches ask less theory and more realization, application,
  imbibing, brainstorming, real challenges and daily reflection (S5/S6/S7, H, K, M). Ladder: research/writer-brief.md.
- **Complete, end to end (head, 30 Oct 2026):** each page fully meets its topic's need: the preacher can give the whole
  session, and a student who has that problem finds the full answer and the steps to take. Line counts are a guide only:
  trim repetition or padding, never content the topic needs.
- **BRS scan (head, 30 Oct 2026):** the Bhakti-rasamrta-sindhu OCR in research/books/ (translator not named) may be quoted beside
  NOD: Rupa Gosvami's verse translations only, labelled "BRS, Desire Tree edition (translator not named)"; the translator's
  own remarks are never given as BRS. NOD remains the primary source.
- **Most reliable source (head, 30 Oct 2026):** a statement found in several places is cited from the most reliable,
  authoritative one (order in research/writer-brief.md "Sources"); others only as "also in".
- **As it is, no softening (head, 30 Oct 2026):** scripture, purports and BIKC in their own words, strong wording included;
  no speculative glosses from material understanding (rule: research/writer-brief.md "As it is, no softening").
  **Clarified (head, 2 Nov 2026):** no addition and no subtraction, in content or in intensity, as per the level the page is
  prepared for; the top batch (TRD) is the highest intensity and holds nothing back. Our own reassuring glosses ("not a verdict", "not an insult") are additions.
- **Layout check before done (head, 2 Nov 2026):** no page counts as done until `node tools/build-site.mjs` then
  `node tools/layout-check.mjs <id>` passes (no diagram text overlapping, no text across boxes, nothing outside a diagram's
  frame, no sideways scroll; phone 390 px and desktop 1280 px). Diagrams hold labels only; explanations go in text below.
- **Reading site (head, 30 Oct 2026):** pages read like a book, not an app: comfortable in light/sepia/dark, on every screen,
  appealing (not devoid of rasa), nothing distorted or overflowing (tools/build-site.mjs). Status/next steps: BUILD_PLAN.md "RESUME HERE".
- **History as it is (head, 30 Oct 2026):** stories are told exactly as the verses tell them, no addition, no subtraction,
  no softening (rule: research/writer-brief.md "Stories from scripture").
- Sensitive topics (BIKC celibacy chapters, madhurya rasa, controversies, mental health): `sensitive: true`, reviewed by the head after the build.
- IYF's own material (topic folders, Drive) may be read: `tools/fetch_materials.py` → `research/iyf-materials/`. Align pages with it.
- Supporting sources (head, 28 Oct; cite by URL, never the authority for siddhanta): **radheshyamdas.com** = systematic courses
  (index: research/radheshyamdas/index.md; brahmachari-training for BSS); **chaitanyacharan.com** = the scientific perspective (VL2, DYS).
- **ISKCON gurus' realizations** (head, 28 Oct): non-ritvik ISKCON gurus' sites may be used to ADD their realizations, attributed by
  name and URL. Principles and main content always come from Srila Prabhupada's books. Approved so far: S.B. Keshava Swami,
  tattva.keshavaswami.com (index: research/gurus/). Add others to tools/fetch_gurus_index.py only after the head names them;
  never ritvik or non-ISKCON groups.
- **Preaching Encyclopedia** (HG Radheshyam Das, VOICE): research/encyclopedia/ (index.md = contents). DYS and EBG transcriptions:
  follow its structure for DYS/VL2/EBG-based topics. **Madhurya-kadambini** in research/books/ (Gaudiya Vedanta Publications
  edition) is approved by the head (28 Oct): cite the edition. Missing authorized books: take from ebooks.iskcondesiretree.com
  (catalogue research/edt-ebooks/index.md; `tools/fetch_edt_ebooks.py get "<path>"`). **Caitanya-bhagavata** (translator not named): narratives only.
- **VOICE Pune** (Radheshyam Das): structured courses; course list in research/voice/courses.md (voicepune.com). IYF folders already
  hold some VOICE material (e.g. PARTHA, GAME decks). Books at voicepublication.in are sold: cite, don't copy.
- **Research papers:** find with `python3 tools/find_research.py search "<topic>"` (OpenAlex/Europe PMC); every paper cited must pass
  `python3 tools/find_research.py doi <doi>` (Crossref). Research supports educational claims only, never theology.
  **Spiritual dimension > material needs (head, 30 Oct 2026):** where Prabhupada's books give a measure (e.g. sleep, BG 6.16
  purport: not more than six hours), that measure is taught; research is material-level background and is never set
  against it as an equal standard. Medical safety stays: "if always unwell, see a doctor".
- ISKCON Desire Tree PDFs (secondary) are searchable text in research/desire-tree/ (index.md). Re-extract: `.venv/bin/python tools/extract_local_pdfs.py`.
- The DYS Book text is in research/iyf-materials/dys-book/ (DYS 1–4 = ch. 1–4, DYS 5 = ch. 5, DYS 6 = ch. 6 + appendices).
- The two `z-lib.org` files in IYF's Drive may be used (head, 28 Oct): cite the published edition, never link the file, short quotes only.
- **Internal site (29 Oct 2026):** https://iyf-preacher-library.pages.dev, its own Cloudflare Pages project `iyf-preacher-library`
  (never inside the Sadhana app). **Open to anyone with the link since 29 Oct (head)**, noindex; to close: `LOCKED = true` in `functions/_middleware.js` + redeploy
  (password already stored as secret LIBRARY_PASSWORD). Rebuild
  then `npx wrangler@4.149.0 pages deploy dist/site --project-name iyf-preacher-library --branch main --commit-dirty=true`.
