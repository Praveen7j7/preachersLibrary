# Before deploying the website: what's left for wave 1 (VL1, DYS, VL2, VL3)

**Internal launch done 29 Oct 2026:** https://iyf-preacher-library.pages.dev (Cloudflare Pages project `iyf-preacher-library`,
separate from the Sadhana app; whole site behind one shared password, `functions/_middleware.js`, fails closed).
Redeploy: `node tools/build-site.mjs && npx wrangler@4.149.0 pages deploy dist/site --project-name iyf-preacher-library --branch main --commit-dirty=true`.
The items below remain for the full launch.

Agreed with the head, 28–29 Oct 2026. Tick items here as they're done. Nothing is deployed without the head's go-ahead.

## A. Content: needs the head

- [ ] **Review the 26 sensitive pages** and approve them (`review: approved`). List: `research/head-review-list.md` §1.
- [ ] **Confirm sensitivity flags**: vl1-26, vl1-32, vl1-39, vl3-01, vl3-03, vl3-13, vl1-34 (head-review-list §2).
- [ ] **Answer the content questions** (head-review-list §3):
  - [ ] which ISKCON documents to cite on past problems (vl2-07, vl3-09)
  - [ ] vl1-46 and vl1-47
  - [ ] vl1-35 history slides
  - [ ] accept departures from IYF material
  - [ ] titles of vl2-07 and vl2-09
  - [ ] vl3-02 tradition-based answers
  - [ ] vl3-08 confidentiality practice
  - [ ] the remaining unsourced items
  - [ ] a clinical source for vl1-19
- [ ] **Approve** the 47 `sources-checked` pages, or decide to publish them marked "checked, awaiting approval".
- [ ] **Decide on DYS:** part of VL2 (as IYF's documents say)? Current VL2 exit conditions (60/75/80%; 2 or 4 rounds)?

## B. Content: work for Claude (next week, low cost unless noted)

- [ ] **Level-appropriate verses**: VL1/DYS mainly BG, ISO and simple SB (Cantos 1–9); advanced CC / SB 10–12 /
  NOD only as "background for the preacher, not for this audience". Clean-up pass on the flagged pages: 16 VL1, 3 DYS,
  5 VL2, a few VL3 (one Fable helper + review).
  - [ ] Rule written into `research/writer-brief.md` and Stage 2.
- [ ] **Section R on all 73 pages** ("Adapting for another level"): R.1 deeper quotes in reserve, then one block per
  other level the topic fits (VL2, VL3, SPS, DPS, **BSS**; TRD later) with that level's extra points, verses, stories
  and activities. **Head, 29 Oct: every page covers the topic for every level** (e.g. Happiness timed as VL1, but
  preparable for BSS from the same page). Done in the same pass as the verse clean-up: advanced verses move from talks
  and handouts into R.1, nothing is deleted.
  - [ ] **Session formats** (head, 29 Oct; `research/writer-brief.md` "Session formats"): `duration:` and section G
    redone per level. VL1 one 45–60 min talk. VL2/VL3 a ~3-hour session: ~90 min lecture + ~90 min engagement block
    with ready options (quiz, discussion, drama, presentation, Q&A), plus the alternative of up to a 2-hour lecture
    with activities skipped. SPS/BSS/DPS a full 2-hour lecture + "if time allows" extension. TRD up to 3 hours. Nothing
    beyond 3 hours. (VL2 pages currently say 45 min.) The numbers are the time available for planning, not a length
    to fill: content stays whatever is relatable for the topic, never padded.
  - [ ] **No duplicate per-level notes** (head, 29 Oct): how other levels treat the topic lives only in B's level table;
    there is no R.2. In the same pass, complete B's table to one row each for VL1, VL2, VL3, SPS, DPS (31 pages lack
    the SPS/DPS rows) and delete any per-level text repeated elsewhere on the page.
- [ ] **One place + engaging sessions** (head, 29 Oct; writer-brief "One place, and engaging sessions"), same pass:
  H.1 how to start the session, H.2 opening questions, M.1 closing check questions with answers, M.2 level-matched
  activities; O holds every link; S1 rewritten as a full summary for a student who missed the lecture, S5/S6
  answerable from it.
- [x] **Sanskrit ślokas** (29 Oct: `tools/slokas.mjs` → `data/slokas.json`, 475 verses; shown at build time under verses in E, S3, R; re-run after new verses): Devanāgarī + transliteration from vedabase under each verse in section E, and for the 2–3
  "verses to remember" in the student handout. Script, almost no tokens.
- [ ] **DYS split**: four session pages for DYS 1–4 (DYS Book ch. 1–4 + Encyclopedia transcripts); dys-01 becomes an
  overview. About 45 minutes.
- [ ] **Research Hub**: a Research page with scholarly and empirical papers on Gauḍīya / Vaiṣṇava siddhānta by domain,
  each Crossref-verified, with "what it shows / limits"; linked into the topics. Collection by script; notes by a helper.
- [ ] Optional: trim the longest pages (some ~600 lines) toward ~400–450 **in the page's own-level sections only**;
  section R (all levels) is extra and is never trimmed to meet this (head, 29 Oct: content covers every level).

## C. Before going online: technical

- [x] **Remove local file references** (29 Oct: rewritten at build time by `tools/citations.mjs`; sources keep the paths).
- [ ] ~~old item~~ **Remove local file references.** Pages cite `research/...` paths, which break on the web and expose internal
  folders. Turn them into public links or remove them.
- [ ] **Central link registry**: each resource (Drive file, lecture, deck) gets an id in one data file, and pages use
  the id, so **a link is replaced once and updates everywhere**. Plus a link checker for broken or private links.
  - [ ] **The head's rule (29 Oct): every link must work, and moves are handled centrally.** IYF's media library sheet
    (`12QrYooU9UjavNYhHygtRJ6XcaNZbL204FlWDV19l_TE`: Audios, Brahmachari Lectures, PPTs and Videos, Training Materials)
    is that central link manager for lectures and decks. Pages must not keep their own copy of a sheet link: they name
    the sheet row (tab + S.No./Row ID), and `build-site.mjs` takes the **current** link from a fresh fetch
    (`tools/fetch_sheet.py`), so a file moved in the sheet is fixed everywhere by one rebuild. Other links (vedabase,
    articles, papers) go in one `data/links.json` the same way.
  - [x] Link checker: `node tools/check-links.mjs` (built site; 29 Oct). Run after every build; it blocks a deploy.
  - [ ] **Fix what the 29 Oct check found** (220 pages, 519 external links: 9 broken, 2 broken internal):
    - [ ] **Brahmachari Lectures tab: all 172 Drive links return "not found"** (29 Oct: the 5 on our pages were removed; restore after re-sharing, see `research/access-requests.md`) (moved, deleted or unshared; the
      Audios tab works). The sheet's owner must restore sharing or update the Download Link column. 5 are on our
      pages: dys-03 (×2), vl1-09, vl1-10 + vl1-25, vl1-13. Until then, drop or replace them.
    - [x] vl1-07: `bg/12/13/` → vedabase prints BG 12.13–14 as one page (`bg/12/13-14/`).
    - [x] vl2-08: the Vaniquotes link "Blind_faith_(Lectures)" is cut at the bracket by the build's auto-linker;
      write it as `%28Lectures%29` or teach the auto-linker balanced brackets.
    - [x] vl3-01: links to `vl1-09.md`; the build should turn `<id>.md` links into `../<id>/preacher.html` (one rule
      for all pages).
    - [x] telemanas.mohfw.gov.in and the doi.org link open fine in a browser (Node certificate quirk only).
- [ ] **Link safety**:
  - [ ] every Drive link is meant to be public (or preacher-only)
  - [ ] the `z-lib.org` copies are never linked
  - [ ] copyrighted books are quoted briefly only
- [ ] **Version control**: a private GitHub repository for `preacherLibrary/` (content, data, tools), excluding
  `.cache/` and the copyrighted research texts.
- [ ] **Automatic checks on every change**: verify-refs, the format check, the link check and the site build; a failing
  check blocks the change.
- [ ] **Who can edit**: editors propose (Decap CMS or GitHub), reviewers check, **only the head or named approvers
  publish** (protected branch).
- [ ] **Who can see what**:
  - [ ] student handouts shareable
  - [ ] **preacher pages behind sign-in**: Google sign-in via Cloudflare Access, **or** Sadhana app accounts
    (decision pending; no email-OTP, per the no-OTP rule)
- [ ] **Hosting**: Cloudflare Pages (free); domain (e.g. `library.<IYF domain>`); repository backup.
- [ ] **Editorial workflow document**: roles, review statuses, how to add a topic, resource or link; change log.
- [ ] **"Report an error" button** on each page (goes to reviewers; readers don't edit).

## D. Copies for distribution (available any time)

- [ ] PDFs per topic (Preacher, Students) and per batch (Preacher pack, Student pack), from the IYF Delhi PDF converter.
  The 26 sensitive pages are left out or marked "Draft – awaiting senior review" until approved.

## E. Courses and Gaudiya Research: separate sections (head, 29 Oct; `research/courses.md`)

- [ ] Website: "Courses" and "Gaudiya Research" as their own sections and home cards, beside the batches.
- [ ] Bhakti-sastri (BG, ISO, NOI, NOD; ~40 sessions), then Bhakti-vaibhava (SB 1–6), Bhaktivedanta (SB 7–12),
  Bhakti-sarvabhauma (CC): study-session pages, written in batches with the head's review.
- [ ] Research Hub (B above) lives in the Gaudiya Research section.
- [ ] TRD pages: list approved 29 Oct (54 topics, `research/trd-topics.md`), written in batches.

## Not required before deploying wave 1

SPS, DPS, BSS, TRD; the 19 proposed topics; Hindi translation; audio transcription.
