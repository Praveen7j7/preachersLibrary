# Build plan: batch by batch, measuring the load

Approved by the head on 28 Oct 2026. Decisions: `research/stage1-discovery-report.md` §9. Method:
`docs/stage2-content-architecture.md`. Quality bar: the two pilots, `content/topics/vl1-06.md` and `content/topics/dps-15.md`.
Status of every topic: `research/content-register.md` (regenerate with `node tools/register.mjs`).

**Never start a new phase (level: VL1, DYS+VL2, VL3, SPS, DPS, BSS) without the head's explicit confirmation**
(head, 28 Oct 2026). Within a phase, report each batch's cost before the next.

**Confirmed 28 Oct 2026 (head):** VL1 (all), VL2 (done), VL3, SPS. Writers now follow `research/writer-brief.md`.
New/proposed topics (`data/proposed.json`) are built later, after approval. **Refresh rule:** when new resources arrive,
re-run `tools/map_sources.py`, then a light pass adds the new material to pages already built (sources in E/J/O/S8 only,
no rewrite) and re-runs verify-refs.

## Next week (head, 29 Oct 2026: wait for the weekly usage reset)

**Wave 1 pre-deploy work is listed in `docs/PRE_DEPLOY_CHECKLIST.md`** (verse-level clean-up, Sanskrit ślokas, DYS split,
Research Hub, link registry, removing local paths, repo + checks + access). Do those before SPS if the head wants to
deploy wave 1 first.

Start in a **fresh session** (`/clear`). Check the usage panel (weekly was 70% on 29 Oct, Max 20x, shared account).
1. **DYS split** (~45 min, ~3–5 weekly points):
   - Write four session pages from dys-01 "DYS 1-4": DYS Book ch. 1–4 + Preaching Encyclopedia "Discover Your Self"
     transcripts and SS articles per session.
   - Ids `dys-01-s1`…`dys-01-s4`; add them to `tools/fetch-catalogue.mjs` as a library split, like the SPS merge.
   - Keep dys-01 as a short overview linking to the four sessions.
   - Two Fable writers, `research/writer-brief.md`; then a focused Opus review.
2. **SPS in two halves** (sps-01…20, then sps-21…41; ~10–15 points each):
   - Fable writers with `research/writer-brief.md`, same prompts as on 28 Oct.
   - Focused Opus reviews; check the panel between halves.
   - Pause if the weekly figure is near 90%.
3. Then DPS and BSS, each **only after the head confirms**. Open decisions: `research/head-review-list.md`.

**SPS paused 28 Oct ~22:00 (head: finish wave 1 first).** Its 7 writers were stopped before writing any page; restart
SPS later with `research/writer-brief.md` (7 writers × ~6 topics, same prompts).

**Start each batch in a fresh session** (`/clear` first). Everything needed is in files; a long conversation
multiplies the cost of every step.

## RESUME HERE (30 Oct ~03:45, session near its limit). Start a FRESH session; everything needed is in files.

**Head's rulings of 30 Oct (all in CLAUDE.md / research/writer-brief.md, apply to every batch):** history as it is (no add-on,
no subtraction); as it is, no softening (verses, purports, BIKC in their own words; no glosses of our own); spiritual
dimension > material needs; bss-19 may also be TRD; bss-03 handout add-ons + crisis line removed. Open: crisis lines on other
pages (keep/remove?) and head-review-list §5 items 2–12.

**State of every agent run (each writes straight to disk; nothing is lost if a run is cut off):**
00000. **30 Oct ~13:30: DEPLOYED 5fc3e9a1** (TRD trd-01…34 + 49…54 = 40 pages; DYS 5/6 named; titles unquoted). No agents running.
   Chunked OCR of the scrambled books RUNNING (scratchpad/ocr_chunked.sh; skips complete books; re-run it if cut off).
   **OCR DONE (30 Oct afternoon):** all 66 files in research/books/ readable (English ratio > 12%, ≥ 800 chars/page),
   incl. every Sandarbha, Jaiva-dharma, HBV, Brhad-bhagavatamrta, Being Guru. Old scrambled texts in the session scratchpad.
   **2 Nov:** TRD 54/54 written + live (414e5a2f). Layout check (tools/layout-check.mjs) built: all 179 topics × 2 views × 2 widths
   now 0 issues (label fit improved; 10 loose caption lines moved out of diagrams; 8 diagrams re-placed by hand). Pre-pass
   (tools/prepass.py): stock phrases stripped (log research/prepass/strip-log.md); prep files research/prepass/<id>.md.
   Pending deploy: layout fixes, strip edits, trd-46 diagram, "Prabhupada's English" rewording.
   **Advanced-book chapter links (head, 2 Nov):** link each cited chapter to the Desire Tree PDF page (#page=N), never host our
   OCR text. Approved: Tier A (Kusakratha: Prameya-ratnavali, Tattva-viveka, Manah-siksa; Bhumipati: Brahmana and Vaisnava; Bhanu
   Swami: Harinama-cintamani Nama-bhajana; Tattva-sandarbha) and Tier C (link, incl. Madhurya-kadambini GVP and Sri Siksastaka).
   Tier B (head, 2 Nov): title pages carry no credits (Desire Tree Gaudiya_Books start at Text 1). LINK, labelled "Desire Tree
   edition (translator not named)": Bhagavat, Paramatma, Krsna, Priti, Bhakti-sandarbha; Ujjvala-nilamani; Laghu- and
   Brhad-bhagavatamrta; Jaiva-dharma file 1. Tattva-sandarbha → Tier A (Gopiparanadhana). NO LINK: Jaiva-dharma file 2
   (different, rough translation), Hari-bhakti-vilasa "selected verses" (a selection, compiler not named).
   **WAVE 1 = ONE combined pass (head, 2 Nov):** the 76 wave-1 pages (VL1 48, DYS 6, VL2 9, VL3 12, dps-15) get ONE visit
   per page covering everything: plain English + Krishna conscious (P05–P17 brief) + as it is (≈22 pages with softening
   phrases) + history as it is + questions ladder + complete end to end + spiritual > material + book refresh (dys-01-s1,
   vl2-03 07 08, vl3-09) + gate FAILs (research/verification/gate.json). Head rulings still open: vl1-37 NOI 4, vl1-39
   NOI 2 + sensitive flag, vl1-43 SB 10.88.8 / CC Adi 10.84, helplines 988/116 123. ~13 Fable runs × 6 pages, pack first.
   **ORDER NEXT (head, 30 Oct):** (1) OCR finishes → (2) T7 trd-35…40, T8 trd-41…48 (quote the clean books) → (3) ONE pass per
   page = book-refresh (replace "Requires source review" with OCR'd quotes) + gate FAIL fixes (research/verification/gate.json),
   ~33 pages across BSS/DYS/VL2/VL3/TRD → (4) deploy → (5) SPS + DPS together → (6) courses → (7) P01–P17 once at the very end.
   BRS scan may be quoted (verse translations only, labelled; NOD primary) — CLAUDE.md.
   **Questions ladder (head, 30 Oct):** existing BSS (49) and TRD (40) pages ask too much theory in S5/S6 etc. Re-pitch them to
   realization/application/challenges/daily reflection in the step-(3) pass (one visit per page: refresh + gate fixes + questions).
   T7/T8 and SPS/DPS writers follow the ladder from the brief.
0000. **30 Oct ~12:15 (plan switched):** T5 DONE (trd-23…28 gated 6/6). T6 resumed (trd-32 verify, write 33, 34). OCR of the
   30 font-scrambled books in research/books/ RUNNING (priority: Ujjvala-nilamani, Kiranah, Raga-vartma, Priti/other Sandarbhas,
   Brhad-bhagavatamrta, Jaiva-dharma, Prema-bhakti-candrika, Manah-siksa, Laghu-bhagavatamrta, Vedanta-sutra, Prameya-ratnavali);
   old texts backed up in the session scratchpad. After OCR: T7/T8 can quote them; a light pass on trd-23…27 can replace their
   "Requires source review" (Sandarbhas cited via purports) with direct anuccheda quotes.
   **Book-refresh pass (after OCR, Fable, research/refresh-brief.md):** up to 33 pages mention a scrambled book next to a
   review note: bss-01 27 28 31 33 35 46 47 53 55, dys-01-s1, trd-04 08 12 15 18 22 23 24 25 26 27 29 30 31 32 33 49 53,
   vl2-03 07 08, vl3-09 (re-list with the grep in the session log; some are other review notes). Replace each note with the
   exact passage from the OCR'd book (chapter/anuccheda), no rewrite; gate checks every new quote.
000. **30 Oct ~11:45: DEPLOYED bd9c831c** (all 49 BSS after as-it-is, TRD wave 1 = 28 pages, reading UI, diagram fit;
   links 0 broken). Built with SKIP=trd-23…31 (wave 2 in progress; build-site.mjs SKIP env leaves pages out).
   Wave 2 stopped on the limit (resets 13:00 IST). RESUME (same session, SendMessage), do NOT relaunch:
   T5 → gate trd-23…28 + report only (all written + verified). T6 → verify trd-32, write trd-33, trd-34, gate, report.
   Then T7 trd-35…40, T8 trd-41…48 (not started). Then rebuild WITHOUT SKIP, check-links, deploy.
   OCR done for 8 scrambled books (Being Guru still unreadable). Gate: 33 pages with quote/softening FAILs to fix
   (research/verification/gate.json) — send to Fable in the next session.
00. **30 Oct ~09:30:** BSS as-it-is sweep DONE (all 49 BSS pages). TRD wave 1 DONE (28 pages, all refs exist; head questions →
   head-review-list §6). tools/gate.mjs built (quotes verbatim vs vedabase cache/BIKC/Sen/books with OCR tolerance; caps by
   format: 3-hour batches 450/560). TRD wave 2 LAUNCHED 2 at a time: T5 trd-23…28, T6 trd-29…34; then T7 trd-35…40, T8 trd-41…48.
   Next: gate all BSS+TRD → send real quote FAILs back (Fable) → build, check-links, deploy.
0. **03:50: all 6 agents stopped on the 5-hour limit (resets 08:00 IST).** Their context is saved: from THIS session, resume
   them with one short SendMessage each ("limit reset; continue from where you stopped") instead of new agents: TRD T1–T4 and
   sweeps S1/S2. From a fresh session they cannot be resumed: relaunch only missing pages.
1. As-it-is pass: DONE on bss-21 22 27 32 37 38 41 42 50 53 54 55 (quotes spot-checked). bss-50 now quotes SB 9.19.14 + BG 3.39
   purport beside Sen's "fire fed with ghee" (head's pointer).
2. As-it-is SWEEP of 19 pages was RUNNING (S1: bss-03 08 09 11 12 14 16 19 23 24 · S2: bss-28 30 31 33 39 40 47 51 52).
   Check: `grep -l -i "no shame language\|not an insult\|not a verdict\|spoken of with respect" content/topics/bss-*.md`.
   At 03:45 still showing: bss-12 16 19 23 31 51 52. Relaunch the sweep ONLY for pages still showing (same prompt:
   research/as-it-is-brief.md, "SWEEP" wording; keep crisis lines and bss-33 safeguarding).
3. TRD wave 1 was RUNNING (T1 trd-01…07 · T2 trd-08…13 · T3 trd-14…20 · T4 trd-21 22 49…54; brief research/trd-writer-brief.md).
   At 03:45 written: trd-01 02 03 08 14 15 21 22. Check `ls content/topics/trd-*.md` + `node tools/register.mjs`;
   a page with only front matter/references, or not "ok" in the register, is a cut-off stub: rewrite it. Relaunch only the
   missing ids, ~7 per Fable writer. **Length:** trd-08 (626), trd-14/15/21/22 (490–541) exceed the ~400-line guide:
   in review, trim our own commentary (never sources). Wave 2 (T5 trd-23…28 · T6 29…34 · T7 35…40 · T8 41…48) NOT launched.
4. Reading UI DONE in tools/build-site.mjs (book typography, Paper/Sepia/Night, "Aa" panel: colour, size, font, spacing;
   progress + minutes left; resume; gold ornaments; diagram labels auto-fit, never overflow). bss-44 diagram box/arrow fixed.
   Checked 390/1366 px, 10 pages: 0 overflowing labels, 0 sideways scroll. NOT yet deployed.
5. Next, in order: finish 2 and 3 → node tools/slokas.mjs; register; split-views; build-site; check-links on a frozen copy
   (cp -R dist/site <scratch>) → deploy (head's OK given for BSS + UI; run `npx wrangler@4.149.0 pages deployment list
   --project-name iyf-preacher-library` first) → TRD wave 2 → SPS + DPS together → P01–P17 ONCE at the very end.
   **Method (head, 30 Oct): optimised path, output equal to an all-Fable run.**
   Models: Fable = writing new pages and every judgement pass; scripts = everything mechanical; Sonnet = only narrow
   edits whose result a script checks (fail → back to Fable); Sonnet takes a task type only after a 2-page pilot matches Fable.
   Quality gate (script, every page, any model): quotes found verbatim in saved vedabase/BIKC text; verify-refs all exist;
   no banned softening phrases; line cap + all sections + register ok; links ok. Fail → same agent fixes (resume), else Fable.
   Agent path: (1) main: ls/register, pre-fetch sources by script, group ~7 related topics; (2) 2 Fable writers at a time,
   rolling; full writer-brief once, own sources, one write per page, ≤400 lines, verify-refs; (3) gate on report; (4) main
   spot-checks 3–4 quotes/page + sensitive pages, one line to the head; (5) close: slokas, register, build, check-links,
   deploy with OK, update RESUME HERE, fresh main session for the next batch; (6) limit hit: resume same agents with one
   line (same session) or relaunch missing pages only (new session).
   Order: resume 6 stopped agents → build gate script, run on BSS+TRD → TRD wave 2 → SPS → DPS → P01–P17 (Fable).

## (older) RESUME HERE (written 29 Oct 22:15 before the head's account switch; a fresh window starts here)

0. **All 49 BSS pages were written and reported by 22:25 (B1–B8 ticked).** Skip to step 3 unless register shows a gap.
1. `ls content/topics/bss-*.md` and `node tools/register.mjs`. At 22:14, 47 of 49 BSS pages were written; bss-51 (Rsyasrnga)
   and bss-52 (SB 3.31) were still being written by group B8; B6 reported done at ~22:18. Any BSS page missing
   or not "ok" → relaunch only that page (writer brief + the B8 prompt pattern: research/writer-brief.md incl. "Plain,
   clear English" and "Krishna conscious way"; read full purports; check every BIKC citation; Sonnet helper).
   A page written by a helper that was cut off may be a stub (front matter + references only): treat it as missing.
2. Tick B6/B8 below when their pages are ok. All B1–B5 and B7 are done.
   **29 Oct (late): register check done — all 49 BSS pages ok. Sensitivity review (28 pages) LAUNCHED, brief
   research/bss-sensitivity-review-brief.md, 5 Fable 5.1 reviewers: R1 bss-01 03 05 12 16 17 · R2 bss-18 19 21 22 23 28 ·
   R3 bss-31 32 33 35 37 38 · R4 bss-39 40 41 42 49 · R5 bss-50 51 52 53 55.**
   **Sensitivity review DONE (all 5 reported; 51 fixes; head questions → head-review-list §5.13). verify-refs now keeps
   purportExtracts on re-run.**
   **Batch clean-up DONE (29 Oct late):** Rsyasrnga told in full only on bss-51 (bss-31 J.2 = one sentence + pointer);
   Narada's boyhood told in full only on bss-44 (bss-33, 35, 55 = short angle + pointer; bss-39 never had it); old-numbering
   links fixed on bss-21, 22, 23; R.1 count: no verse on more than 2 BSS pages. slokas.mjs (989 verses), register,
   split-views, build (125 pages) run. check-links: 9 broken fixed (5 vedabase URLs → range pages; 6 lines with known-dead
   Drive recordings removed from bss-21, 22, 32, 39, 49, 52 and logged in access-requests.md); now 0 broken (Tele-MANAS =
   Node certificate only). **Next: deploy with the head's OK → P01–P17.**
   **Head rulings 30 Oct (§5.13 answered):** history told as it is, no add-on/subtraction (bss-03 fixed; rule in writer-brief
   + pass brief 3b); spiritual dimension > material needs (bss-49 sleep reframed, vl1-29 tightened; pass brief 3c);
   bss-19 stays in BSS, may also be in TRD (R.4 added; trd-44 builds on it). Site rebuilt.
   **Deployed 30 Oct** (5d6a2999; bss-03 handout add-ons + crisis line removed, head: "remove and deploy").
   **"As it is, no softening" (head, 30 Oct):** rule in writer-brief/CLAUDE.md; brief research/as-it-is-brief.md; LAUNCHED 4 Fable
   helpers: A1 bss-32 38 53 · A2 bss-54 55 27 · A3 bss-42 50 21 · A4 bss-22 37 41. Then: sweep the other BSS pages for our own
   softening glosses ("not an insult", "not a judgement" — e.g. bss-03, 06, 52), rebuild, check-links, deploy with OK.
   Crisis lines on other pages: head to decide.

## NOW: TRD (head, 30 Oct 2026: "start with this", then SPS + DPS together, P01–P17 pass ONCE at the very end; "use tokens optimized way")
TRD added to the catalogue (tools/fetch-catalogue.mjs reads research/trd-topics.md; 54 topics). Brief: research/trd-writer-brief.md.
Fable writers, ~7 topics each, two waves of 4 (head checks usage between waves). Tick when the register shows the pages ok.
- [ ] T1 trd-01…07 (A missionary spirit)        - [ ] T2 trd-08…13 (B depth with Krishna)     ← wave 1 LAUNCHED 30 Oct
- [ ] T3 trd-14…20 (C non-duplicity, D together) - [ ] T4 trd-21 22 49…54 (E happiness, H blockers) ← wave 1 LAUNCHED 30 Oct
- [ ] T5 trd-23…28 (F siddhanta 1)  - [ ] T6 trd-29…34 (F 2)  - [ ] T7 trd-35…40 (F 3)  - [ ] T8 trd-41…48 (G rasa)  ← wave 2
Then: SPS (sps-01…41) + DPS (dps-01…57 except dps-15) as one wave; then P01–P17 once at the end.

**Reading UI (head, 30 Oct: "reading friendly for long reading, not like an app; both modes; all screens; Kindle and reading sites as
reference; best bargain; fonts; not devoid of rasa"):** done in tools/build-site.mjs: book typography, flowing chapters (all
sections open), warm paper/charcoal palettes, "Aa" panel (page colour Auto/Paper/Sepia/Night, text size, Book/Clean font,
line spacing; saved in the browser), progress line + minutes left, resume where you left off, gold ornaments. System fonts
only (no downloads). Checked at 390 px and 1366 px in Paper, Sepia and Night. Deploy together with the as-it-is pass.
3. Then follow "Order agreed with the head" under the BSS groups: Fable 5.1 sensitivity review of all sensitive BSS pages →
   batch clean-up (overlaps: Rsyasrnga on bss-31 + bss-51; Narada's childhood on bss-33 + bss-44 + bss-39; cross-links on older pages (e.g. bss-21) that use the old
   numbering for bss-39 to 42; R.1 repetition count) →
   slokas.mjs, build, check-links → deploy only with the head's OK → plain-English + Krishna-conscious pass P01–P17.
4. Questions for the head from every group: research/head-review-list.md §5 (items 1–10).

## NEXT: BSS batch (head chose to proceed, 29 Oct 2026). Run from a FRESH session (/clear): this is ~50 new pages.

Deploy first if not yet live (dist/site is built; the head runs or approves
`npx wrangler@4.149.0 pages deploy dist/site --project-name iyf-preacher-library --branch main --commit-dirty=true`).

Writers: Sonnet 5.5 helpers, 6 pages each, writing NEW pages from `content/topics/_template.md` and
`research/writer-brief.md` (all rules there apply: session format SPS/BSS/DPS = 2-hour lecture; one place; opening and
closing questions with answers; activities; R per level; full S1; diagram; global audience; no vagueness; no repetition
in the batch; stories from data/stories.json; every verse via verify-refs). Front matter: batch: bss, duration: 120.
Sources per page: its `data/sources-map.json` entry; BIKC text
`research/iyf-materials/iyf-drive-4/7. Brahmacarya in Krishna consciousness - Bhakti Vikasa Swami.pdf.txt` (copyrighted:
summarise and cite, quote briefly); research/radheshyamdas (brahmachari-training); SB/CC for the story topics;
`research/books/Brahma-vaivarta Purana…` for bss-50. The Brahmachari Lectures recordings are dead (access-requests.md).
Groups (29 Oct ~night: B1–B4 were LAUNCHED from the old session and write straight to content/topics/. In the fresh
session, first run `ls content/topics/bss-*.md` and `node tools/register.mjs`: a group whose pages all exist and pass is
done (tick it); relaunch only missing pages. Then launch B5–B8. Weekly usage was 81% at launch: check the panel
between groups and pause near 90%.)
- [x] B1 bss-01…06 (Raghunatha dasa, Dhruva, Chota Haridasa, milk-drinking brahmacari, Ajamila drama, Prahlada)
- [x] B2 bss-07…12 (Rsabhadeva, avadhuta's 24 gurus and sermons, forest of enjoyment, Yayati, Haridasa and the prostitute)
- [x] B3 bss-13 14 16 17 18 19 (Dhrtarastra, Kapila, BIKC 1–4)
- [x] B4 bss-21 22 23 24 26 27 (BIKC: mundane sex desires, sex and suffering, sex fascination, sense gratification, detachment, discipline) SENSITIVE
B5–B8 + purport pass on bss-21…27 LAUNCHED 29 Oct ~21:45 (head: "ok"; Sonnet helpers). Tick each when register shows it ok.
**Order agreed with the head (29 Oct ~22:10):** B5–B8 finish → head switches account → then, on the new account:
(1) register check, relaunch any page missing/incomplete; (2) Fable 5.1 focused sensitivity review of all `sensitive: true`
BSS pages; (3) R.1 repetition count, slokas.mjs, build, check-links; (4) deploy with the head's OK; (5) plain-English +
Krishna-conscious pass P01–P17 (below), waves of ~6.
- [x] B5 bss-28 30 31 32 33 34 (determination; dealings with grhasthas, women devotees, nondevotee women, children, family) SENSITIVE (31, 32)
- [x] B6 bss-35 37 38 39 40 41 (nondevotees; semen retention; nakedness; overcoming sexual desire; falldown; masturbation) SENSITIVE
- [x] B7 bss-42 44 45 46 47 48 (homosexuality SENSITIVE; sadhana; regulation; engagement; preaching; travelling)
- [x] B8 bss-49…55 (health; Sankhacuda and Tulasi; Rsyasrnga; SB 3.31; Puranjana; SB 5.13–14; SB 7.12)
Sensitive pages: `sensitive: true`; frank about the dangers, practical about protection, women always spoken of with
respect (the point is guarding celibacy, never blame), no shame language, help-seeking guidance; then a focused review
by Fable 5.1 before the head's review. After all groups: R.1 repetition count (≤3 per verse), slokas.mjs, build,
check-links, deploy with the head's OK.
**Krishna conscious use (head, 29 Oct, all pages):** every story, verse and example leads to Krishna (writer-brief.md
section). B1–B4 writers were told mid-run; B5–B8 get it from the brief. Wave-1 pages (77) and any BSS page written before
the message still need a check-and-fix pass against this rule. That pass waits for the head's OK on usage.
**Plain, clear English (head, 29 Oct, all pages):** writer-brief.md section. B5–B8 told mid-run; vl1-41 S7 + B fixed by hand
(the head's example). All other existing pages (wave 1 + bss-01…27) need a plain-English pass, which can be combined with the
Krishna-conscious check pass above. Then TRD (research/trd-topics.md, 54), then Bhakti-sastri (research/courses.md).

## Plain-English + Krishna-conscious pass on existing pages (head, 29 Oct 2026: "for all already written as well")

Brief: `research/plain-english-pass-brief.md`. 100 pages written before the rule (wave 1 + bss-01…27), Sonnet
helpers, 6 pages each, launched in waves of ~6 after the account switch. B5–B8 pages (bss-28…55) were written under
the rule; spot-check them afterwards. Tick each group when the helper reports.

- [ ] P01 bss-01 bss-02 bss-03 bss-04 bss-05 bss-06
- [ ] P02 bss-07 bss-08 bss-09 bss-10 bss-11 bss-12
- [ ] P03 bss-13 bss-14 bss-16 bss-17 bss-18 bss-19
- [ ] P04 bss-21 bss-22 bss-23 bss-24 bss-26 bss-27
- [ ] P05 dps-15 dys-01-s1 dys-01-s2 dys-01-s3 dys-01-s4 dys-02
- [ ] P06 dys-03 vl1-01 vl1-02 vl1-03 vl1-04 vl1-05
- [ ] P07 vl1-06 vl1-07 vl1-08 vl1-09 vl1-10 vl1-11
- [ ] P08 vl1-12 vl1-13 vl1-14 vl1-15 vl1-16 vl1-17
- [ ] P09 vl1-18 vl1-19 vl1-20 vl1-21 vl1-22 vl1-23
- [ ] P10 vl1-24 vl1-25 vl1-26 vl1-27 vl1-28 vl1-29
- [ ] P11 vl1-30 vl1-31 vl1-32 vl1-33 vl1-34 vl1-35
- [ ] P12 vl1-36 vl1-37 vl1-38 vl1-39 vl1-40 vl1-41
- [ ] P13 vl1-42 vl1-43 vl1-44 vl1-45 vl1-46 vl1-47
- [ ] P14 vl1-48 vl2-01 vl2-02 vl2-03 vl2-04 vl2-05
- [ ] P15 vl2-06 vl2-07 vl2-08 vl2-09 vl3-01 vl3-02
- [ ] P16 vl3-03 vl3-04 vl3-05 vl3-06 vl3-07 vl3-08
- [ ] P17 vl3-09 vl3-10 vl3-11 vl3-13

## Wave 1 update pass (head, 29 Oct 2026: "finish wave 1 completely, update don't rewrite, optimised")

Standard: `research/wave1-update-brief.md` (Sonnet 5.5 helpers, ~6 pages each, ~60–90k tokens a page; pilot vl1-05
done). Durations already set by script for all 73 pages. Groups and status (tick when the helper reports done):
- [x] vl1-05 (pilot)
- [x] DYS split: dys-01-s1…s4 + dys-01 overview + catalogue split (dys-02 DYS 5, dys-03 DYS 6 stay separate)
- [x] vl1-01 02 03 04 06 07 · [x] vl1-08…13 · [x] vl1-14…19 · [x] vl1-20…25 · [x] vl1-26…31 · [x] vl1-32…37
- [x] vl1-38…43 · [x] vl1-44…48
- [x] after the DYS split: dys-02, dys-03, vl2-01…09 (VL2 builds on DYS; no repetition)
- [x] vl3-01…06 · [x] vl3-07…11 + dps-15 (no vl3-12 page; vl3-13 sent to the same helper)
- [x] Research Hub: content/research/gaudiya-research.md (45 papers, every figure from the abstract)
- [x] Clean-up: R.1 verses repeated across many VL1 pages (CC Madhya 20.108, NOI 3, SB 11.9.29, SB 11.2.42): vary by topic — rule: a verse may sit in R.1 on at most 3 pages of a batch; each R.1 has ≥2 topic-specific verses (counts 29 Oct: NOI 3 ×17, CC Madhya 20.108 ×14, NOI 1 ×10, NOI 2 ×9). Also vl1-48 S5/K: add "or your local crisis service".
- [ ] Head rulings also: vl1-37 NOI 4, vl1-39 NOI 2 (and its sensitive flag), vl1-43 SB 10.88.8 + CC Adi 10.84; helplines 988 / Samaritans 116 123 to confirm
- [x] Clean-up: leftover mentions of moved verses (vl1-02 D/L, vl1-06 E, vl1-07 K); head rulings on core advanced verses (vl1-15 SB 11.2.42, vl1-17 NOI 1, vl1-18 SB 11.2.37)
- [x] Build-time: Sanskrit under verses (data/slokas.json), "More from the library" in O (sources-map), All research cited page
- [x] Story index: 60 stories (key verses verified; summaries to spot-check), 8 Upanisad slokas as quoted by Prabhupada. Pending: Mahabharata/Ramayana beyond Prabhupada's narration (Ganguli via archive.org), Puranas (Wilson); missing: Jagai-Madhai, Bilvamangala, milk-drinking brahmacari, Sankhacuda, Jada Bharata, Yaksha-prasna. Was (SB, CC, Mahabharata, Ramayana, Puranas, Upanishads, Vedas); J shows them at build
- [x] rebuilt 29 Oct night: 77 pages, 555 verses with Sanskrit, stories on 71 pages, links clean (1,036 external, 0 internal broken). Deploy awaits the head's OK.
- [ ] then rebuild, `node tools/check-links.mjs`, deploy; ślokas script (`research/courses.md` §4) next.

## Batches (natural level order, ~12 topics each)

| # | Batch | Topics | Count | Notes |
|---|---|---|---|---|
| 1 | VL1 part 1 | vl1-01…05, 07…13 | 12 | vl1-06 is the pilot (done). **First measurement batch** |
| 2 | VL1 part 2 | vl1-14…25 | 12 | |
| 3 | VL1 part 3 | vl1-26…37 | 12 | |
| 4 | VL1 part 4 | vl1-38…48 | 11 | |
| 5 | DYS + VL2 | dys-01…03, vl2-01…09 | 12 | DYS folders are private. Use the *DYS Book* (VL-1 reading list B02, IYF Drive) if it can be opened; otherwise mark DYS pages `requires-source-review` |
| 6 | VL3 | vl3-01…11, vl3-13 | 12 | |
| 7 | SPS part 1 | sps-01…14 | 14 | Each page lists its site rows (SPS2/SPS1) |
| 8 | SPS part 2 | sps-15…28 | 14 | sps-19 controversies: sensitive |
| 9 | SPS part 3 | sps-29…41 | 13 | sps-33 madhurya rasa: sensitive |
| 10 | DPS part 1 | dps-01…14 | 14 | Pages that repeat an SPS topic build on the SPS page |
| 11 | DPS part 2 | dps-16…28 | 13 | dps-15 is the pilot. **Add its student part (S1–S8) in this batch** |
| 12 | DPS part 3 | dps-29…42 | 14 | |
| 13 | DPS part 4 | dps-43…57 | 15 | dps-43 controversies, dps-04 dealings with women: sensitive |
| 14 | BSS narratives | bss-01…14 | 14 | No IYF material on the site; scripture-led |
| 15 | BSS / BIKC part 1 | bss-16…35 (topics only, not header rows) | 16 | BIKC is on IYF's Drive: summarise and cite, never reproduce |
| 16 | BSS / BIKC part 2 | bss-37…49 (topics only) | 11 | bss-37…42 sensitive |
| 17 | BSS studies | bss-50…55 | 6 | bss-50 needs *Brahma-vaivarta Purana* (missing): `requires-source-review` |
| — | HTML site | `tools/build-site.mjs` (Stage 2 §6) | — | Build after batch 1, so pages can be viewed as they are written |
| — | TRD | — | — | Waits for the head's contents |

## Models (optimised for cost, head's request 28 Oct 2026)

| Work | Done by |
|---|---|
| Writing pages | **`fable` helpers** (batch 1 review: clearly more accurate than Sonnet; separate weekly allowance). Cap ~400 lines per page |
| Verse existence, translations, format, register, three documents, HTML | Scripts: no tokens |
| Theology/accuracy review | One fresh `opus` review agent per batch (never review inside a long conversation) |
| Coordination and reports | Main session, kept short |

## How to run one batch

1. **Before:** note Session %, Weekly % and Fable % from the usage panel in the log below.
2. **Write:** 2–3 helper agents, each with 4–6 topics, using the brief below.
   - Batch 1: one helper on `sonnet` and one on `fable`, to compare quality and see which allowance each uses.
3. **Review (main session, Opus):** read every page.
   - Check each claim against the saved translations in `research/verification/<id>.json`.
   - Fix anything overstated.
   - Make sure applications are labelled.
   - Set `review: sources-checked` only when every reference exists and supports its use; otherwise leave `drafted`.
4. **Close:** run `node tools/register.mjs`, `node tools/split-views.mjs` and `node tools/build-site.mjs`
   (HTML: open `dist/site/index.html`). The second writes each topic's three
   documents to `dist/md/<batch>/<id>/`: `preacher.md` (Part 1, preachers only), `students.md` (Part 2, safe to
   share) and `combined.md`. Then note the usage % after the batch in the log.

## Helper brief (paste with the topic list)

> You are writing preacher-preparation pages for the IYFD Preacher Library in
> `/Users/maclapctp409/Downloads/files/hpStuff/prompt/preacherLibrary/`. Read first:
> - `CLAUDE.md`
> - `docs/stage2-content-architecture.md` §1–5 (level profiles, template, citation rules)
> - the two finished examples `content/topics/vl1-06.md` and `content/topics/dps-15.md`, which set the quality and format bar
>
> For each topic id given to you:
> 1. Find it in `data/curriculum.json` (title, batch, `siteRows`, `alsoIn`).
> 2. Read IYF's own notes for its site rows. In `research/iyf-materials/manifest.json`, the `rows[<siteRow>]`
>    keys lead to `items` with `status: "text"` and a `file`. Skim; read at most ~30,000 characters per topic,
>    using grep for long files. Align the page with how IYF teaches the topic, but every claim still needs a
>    scriptural source.
> 3. Write `content/topics/<id>.md` from `content/topics/_template.md`, pitched for the batch's level
>    (Stage 2 §2.1). It has **two parts**:
>    - Part 1, for the preacher: front matter plus sections A–Q.
>    - Part 2, for students: S1–S8, a 1–2 page handout with summary, key ideas, verses to remember, words to
>      know, questions and answers, a self-check quiz with answers, a practice for the week, and what to read
>      next. Part 2 makes no claim and cites no reference that is not already in Part 1.
>
>    The finished `content/topics/vl1-06.md` shows both parts.
> 4. Cite only Srila Prabhupada's BBT books and the other sources the citation rules allow. List every
>    scripture citation under `references:`.
> 5. Run `node tools/verify-refs.mjs content/topics/<id>.md`. Open `research/verification/<id>.json` and read
>    the saved translation of each reference. Drop or replace any reference that is not found or does not
>    support your use.
> 5b. Teaching lines say only what the verse or purport says. Your own reading goes under "Application (preacher's)".
>     Read the full purport (fetch the vedabase page) before writing any "Purport point". Keep each page to
>     about 400 lines.
> 5c. Supporting sources for each topic are pre-matched in research/sources-map.md: IYF notes, VOICE/radheshyamdas.com,
>     Chaitanya Charan (scientific perspective), ISKCON gurus' realizations (attributed; principles only from Prabhupada's
>     books), Desire Tree seminars. Research: `python3 tools/find_research.py search "<topic>"`, and every paper you cite must
>     pass `python3 tools/find_research.py doi <doi>`.
> 6. Never invent:
>    - verses
>    - quotations
>    - purport statements
>    - stories
>    - dates
>    - research papers
>
>    Label every application "Application (preacher's)" and every invented case "Invented case for discussion".
>    A source you cannot access is "Requires source review".
> 7. Set `review: drafted`. Set `sensitive: true` for celibacy, rasa, controversy, mental-health or abuse topics.
>
> Write only your own topic files (and their verification JSON). Don't edit any other file. Reply with one line
> per topic: id, number of references, any reference you dropped, anything you could not source.

## Usage log

| Batch | Date | Session % before → after | Weekly % before → after | Fable % before → after | Helpers (model) | Pages | Notes |
|---|---|---|---|---|---|---|---|
| (setup) | 28 Oct | 58 at check | 18 at check | 0 at check | — | 2 pilots | Stages 1–2, harvest; this long session cost the most |
| 1 (VL1 01–13) | 28 Oct | head to fill | head to fill | head to fill | 2× sonnet (~147k, ~157k), 1× fable (~238k); opus review (~339k). Total ~881k ≈ 73k/page | 12, all sources-checked | Review: Fable more accurate; Sonnet Teaching lines drifted into the writer's own ideas |
| 2 + 5 (VL1 14–25; DYS + VL2) | 28 Oct | head to fill | head to fill | head to fill | 4× fable (~273k, ~354k, ~404k, ~344k = 1.37M); 2× focused opus review (~212k + ~230k); total ≈ 1.81M ≈ 75k/page | 24, all checked | Fable writers + focused review; sensitive pages → senior-review |
