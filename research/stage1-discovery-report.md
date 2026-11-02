# Stage 1: Discovery and audit

**IYFD Preacher Preparation Library** · 28 Oct 2026 · Status: **for review**. Nothing has been built or published.

Companion files:
- [catalogue-inventory.md](catalogue-inventory.md): every topic, by batch, with materials and repeats (generated)
- [source-inventory.md](source-inventory.md): what can be read, searched and cited, and what is missing
- [../data/curriculum.json](../data/curriculum.json): the same catalogue as structured data with stable topic IDs
- `catalogue-snapshot-2026-10-28.json`: the raw reply from the site, kept as evidence

---

## 1. What I found, in brief

1. **The live catalogue has 8 batches and 229 topics**, read directly from the site's data (all 235 published
   rows; 6 are spreadsheet header rows, not topics). It was last edited on **21 Jan 2026**.
2. **There is no BVS batch on the site** and no "top level / pure devotion" batch. BVS exists elsewhere in
   IYF (reading list, an 81-week hearing journal, Kartik camps), but it has **no class topics** anywhere I can see.
3. **The site holds titles only.** No batch and no topic has a description; 5 VL2 topics have a subtitle.
   Teaching objectives therefore have to be inferred and **confirmed by IYF educators**.
4. **SPS1, SPS2 and DPS overlap heavily**: 22 titles appear in two or three batches, almost all within
   SPS/DPS. How a repeated topic should differ by level is the main design question for these batches.
5. **The scriptures are in good shape.** BG, SB, CC, ISO, NOI, NOD, TLC and Brahma-samhita, plus Prabhupada's
   lectures, conversations and letters, are fully reachable and searchable verse by verse on vedabase.io. The
   83 distinct references used in Stage 2 and the pilots were all found there; results are saved in
   `research/verification/`.
6. **Real gaps:** full *Bhakti-rasamrta-sindhu*, *Madhurya-kadambini*, *Caitanya-bhagavata*,
   *Brahma-vaivarta Purana* (needed by one BSS topic), and authorised grhastha-specific material for BVS.
   *Brahmacarya in Krsna Consciousness* (29 BSS topics) is on IYF's Drive but copyrighted.
7. **IYF's own teaching material exists**: 130 topic folders (slides, lecture audio, notes). I listed a
   sample but did not read them. They are the best guide to how IYF already teaches each topic.
   **I need the head's OK to use them.**

## 2. What was inspected, and how

| Source | Method | Result |
|---|---|---|
| iyf-lectures.vercel.app | Read the page and its JS bundle. Batches are hard-coded in the bundle; topics come from a public Supabase table. Ran the same read-only query the site runs (published rows only) | 8 batches, 235 rows, 75 attached resources, 130 folder links |
| Topic folders | Listed 5 sample folders anonymously | 4 listed files publicly (slides, MP3s, docs); DYS folder: 404 |
| This workspace | Searched `prompt/` and the home folder for scripture files; read the Sadhana app's reading/hearing data | No local copies of BG/SB/CC; IYF reading sequence (76 books), hearing journals (972 + 84 entries), Drive file list (118 books) |
| `prompt/iskcon_pdf_library/` | Listed | 333 PDFs of ISKCON Desire Tree seminar notes and transcripts (secondary) |
| vedabase.io, vanisource, vaniquotes, prabhupadabooks | Fetched verse pages, purports, a lecture transcript, search | All reachable; full text present in the HTML |
| Web search | Publisher pages, research papers | BIKC only sold (no free edition); 3 research papers confirmed |

`tools/fetch-catalogue.mjs` repeats the catalogue read at any time. `tools/verify-refs.mjs` repeats the reference checks.

## 3. The live catalogue

### 3.1 Batches

Listed in the site's own order (its sidebar shows SPS2 before SPS1).

| Site order | Batch | Site name | Topics | With a material folder | With attached resources | No material on the site |
|---|---|---|---|---|---|---|
| 1 | VL1 | Vedic Level 1 | 48 | 34 | 2 | 13 |
| 2 | DYS | Discover Yourself | 3 | 3 | 3 | 0 |
| 3 | VL2 | Vedic Level 2 | 9 | 7 | 8 | 1 |
| 4 | VL3 | Vedic Level 3 | 12 | 9 | 10 | 0 |
| 5 | SPS2 | Srila Prabhupada Sabha 2 | 25 | 18 | 21 | 2 |
| 6 | SPS1 | Srila Prabhupada Sabha 1 | 26 | 2 | 1 | 23 |
| 7 | DPS | Dhruva Prahlada Sabha | 57 | 57 | 5 | 0 |
| 8 | BSS | Bhakti Siddhanta Sabha | 49 | 0 | 0 | **49** |
| | **Total** | | **229** | 130 | 50 | 88 |

Not on the site: **BVS**, any batch above BSS/BVS, **NS** (Nityananda Sabha; the hearing-journal index groups
it with SPS/DPS) and **SNS** (appears only in Drive folder names `BSS/BVS/SNS`, `DPS/SNS/NS`; not defined anywhere I found).

### 3.2 Shape of each batch

| Batch | Shape | Themes (topic numbers) |
|---|---|---|
| **VL1** (48) | A **pool of stand-alone talks**, not a sequence; many are topical ("God and Google", "World Cup of Life"); several Hindi titles | Mind and emotions (3, 16–20, 30, 33, 40) · Habits and self-management (4, 9, 12, 24–26, 29, 32) · Happiness and meaning (1, 13, 21, 22, 31, 48) · Success and work (10, 11, 23, 28, 36, 41–43) · Why spirituality / God (5–7, 14, 15, 34, 37, 39) · Vedic culture and India (2, 8, 27, 35, 46, 47) · Youth and association (38, 44, 45) |
| **DYS** (3) | A short course: "DYS 1–4", "DYS 5", "DYS 6 & Test"; the *DYS Book* is the 2nd book on the VL-1 reading list | Content only in the folders (one folder returned 404) |
| **VL2** (9) | Short sequence; subtitles show an **apologetics** emphasis (Vedic culture "systematically attacked", ISKCON vs other organisations, bias in science) | Soul and reincarnation (1, 2) · Goal of life (3) · Object of worship (4) · Vedic culture (5, 6) · Guide / ISKCON (7) · God and science (8, 9) |
| **VL3** (12) | **Practice-forming**; #12 is missing | Sadhana: chanting, reading, hearing and notes, morning programme (4–7) · Lifestyle: self-management, 4 regulative principles, PEACE formula (1–3) · Guidance: one-to-one with the facilitator (8) · Clarifying: misconceptions about ISKCON, transcendental morality, two debates (9–11) · Family and friends (13) |
| **SPS2** (25) | Tattva + practice + character; #11 missing | Tattva: object of worship, God and gods, personal/impersonal, sampradaya, Lord Caitanya as Supreme (1–3, 17, 24) · Practice: nine processes, books, hearing, chanting, Deity worship (9, 10, 12–14) · Character: service attitude, humility, gratitude, false ego, envy, sahajiyaism (5, 6, 15, 16, 22, 23) · Community: relationships, dealings, connectivity, talents (4, 18, 19, 21) · Varnasrama, surrender (7, 8) · Controversies (20) · Lives: Lord Caitanya, Rupa Gosvami (25, 26) |
| **SPS1** (26) | Mostly the same character/relationship topics as SPS2 and DPS; #5–7 missing (row 4 merges four "controversial issues") | Character (2, 3, 10–13, 22) · Relationships (1, 8, 15, 20, 28, 29) · Association (16) · Philosophy incl. **"Krishna's sweetness: Madhurya rasa"** (14, 17, 19) · Practice (18, 21) · Service (9) · Controversies (4) · Five Gosvamis' lives (23–27) |
| **DPS** (57) | The **largest and most systematic** batch: a 7-part *sraddha → prema* series, 64 limbs, NOI 1–4, 26 Vaishnava qualities, acharya lives, Vrndavana, choosing an ashrama | Steadiness and guidance (1–3) · Offences (6, 7, 55) · Stages of bhakti (12–18) · Sadhana limbs, raganuga, vairagya (5, 27–31) · NOI 1–4 and association (32–36) · Character (11, 19–21, 24, 37–40, 57) · Relationships and etiquette (4, 8, 9, 22, 23, 25) · Service (10, 26) · Srila Prabhupada and the acharyas (41, 42, 44–53) · Controversies (43) · Dham (54) · **Choosing an ashrama (56)** |
| **BSS** (49) | Three blocks: **14 renunciation narratives** (SB/CC), **29 chapters of *Brahmacarya in Krsna Consciousness*** (BIKC), **6 scripture studies** | Narratives: Raghunatha dasa, Dhruva, Chota Haridasa, the milk-drinking brahmacari, Ajamila, Prahlada, Rsabhadeva, Avadhuta, Yayati, Haridasa and the prostitute, Dhrtarastra, Kapila (1–14) · BIKC: meaning and benefits (16–19), sex desire (21–24), austerity and discipline (26–28), dealings (30–35), celibacy challenges incl. falldown, masturbation, homosexuality (37–42), sadhana and lifestyle (44–49) · Studies: SB 3.31.32–42, SB 4.25–29 + 11.26, SB 5.13–14, SB 7.12.1–16, Rsyasrnga, Sankhacuda and Tulasi from *Brahma-vaivarta Purana* (50–55) |

### 3.3 Topics taught in more than one batch

The automatic match found **22 clusters (49 topics)**. Four more pairs are related but differently titled
(last four rows).

| Topic | Taught in |
|---|---|
| Art of Self Management | VL1-09, VL3-01 |
| Who should be the object of my worship | VL2-04, SPS2-01 |
| Building Vaishnava relationships | SPS2-04, SPS1-01, DPS-09 |
| Developing humility | SPS2-06, SPS1-10, DPS-11 |
| Dealings with seniors, equals and juniors | SPS2-18, SPS1-08, DPS-25 |
| Dedicating for the higher cause | SPS2-21, SPS1-09, DPS-26 |
| Overcoming envy | SPS2-23, SPS1-22, DPS-20 |
| Developing service attitude (TASQ) | SPS2-05, DPS-10 |
| Overcoming false ego | SPS2-22, DPS-19 |
| Nine-fold devotional service | SPS2-09, SPS1-21 |
| Kirtanam: japa, importance and art of chanting | SPS2-14, SPS1-18 |
| Attitude of gratitude | SPS2-15, SPS1-03 |
| Giving up sahajiyaism | SPS2-16, SPS1-13 |
| Controversial issues: ritvik and poison | SPS2-20, SPS1-04 |
| Constructive criticism | SPS1-15, DPS-22 |
| Jana sanga (asat-sanga) | SPS1-16, DPS-35 |
| Seeing good in others; appreciation | SPS1-20, DPS-23 |
| Lives of Rupa, Sanatana, Jiva, Raghunatha dasa, Gopala Bhatta, Raghunatha Bhatta | SPS2-26 / SPS1-23…27, DPS-42, 44–48 |
| *Related:* Revealing the heart in confidence | VL3-08, DPS-02 |
| *Related:* 26 qualities of Vaishnavas | SPS1-02, DPS-37…40 |
| *Related:* Controversial issues (jiva fall, Gopi-bhava club, apasampradaya) | SPS1-04, DPS-43 |
| *Related:* Chanting → offences to the Holy Name | VL3-04, SPS2-14, SPS1-18 → DPS-06 |

### 3.4 Data-quality notes on the site

These matter for stable IDs and for what preachers see. They are not criticisms of the content.

- **Header rows in BSS:** six rows read `"BIKC (Brahmachari In Krishna Consciousness)` with stray quotes
  left over from a spreadsheet import. The book's title is *Brahmacarya in Krsna Consciousness*.
- **Numbering gaps:** VL3 #12, SPS2 #11, SPS1 #5–7. Rows may have been removed or are unpublished.
- **Merged rows:** SPS1-04 holds four topics; VL3-11 holds two debates; DPS-43 holds four controversies.
- **Objectives typed into titles:** SPS2-05/DPS-10 (TASQ), SPS2-19 (connectivity) and SPS2-21 (talents)
  carry teaching objectives in the title. They are useful as stated aims.
- **Typos:** "Buidling" (SPS2-04, SPS1-01), "hapiness" (VL2-05 subtitle).
- **SPS2-19** mentions "Daily SMS, E-mail, skype": the topic predates current tools.

## 4. Purpose of each level: the brief's framework against the evidence

The brief's progression is: VL1 attraction → VL2 reasoned faith → VL3 devotional practice → SPS strengthening
→ DPS deeper commitment → BVS (grhastha) / BSS (brahmacari) → top levels (pure devotion). No IYF document I
can reach **states** these purposes. What the evidence shows:

| Level | Evidence found | Fit with the framework | Confidence |
|---|---|---|---|
| VL1 | Talk pool on mind, habits, happiness, success, Vedic pride; reading list of popular apologetics (*Open Eyed Meditations*, Chaitanya Charan Das) | Strong fit: **attraction through relevance** | High |
| DYS | Separate 6-session course with its own book | Not in the framework. Looks like a **structured entry course** alongside VL1 | Ask |
| VL2 | Reincarnation, goal of life, object of worship, Vedic culture, guru/ISKCON, science; reading list heavy on archaeology and evolution critiques | Fits **reasoned faith**, with a strong cultural-apologetics flavour | High |
| VL3 | Chanting, reading, hearing, morning programme, 4 regulative principles, facilitator meetings | Strong fit: **devotional practice** | High |
| SPS2 / SPS1 | Tattva, nine processes, character, relationships, controversies, acharya lives; hearing journal "Level 4" shared with DPS and NS; reading list *SPS/DPS* (Prabhupada's small books); journal index: "9–27 months, 8–16 rounds" | Fits **strengthening**. **Order unclear**: the site shows SPS2 before SPS1, and the Sadhana app has "SPS", "SPS Group 2" and "SPS Online" | Medium |
| DPS | Sraddha→prema series, 64 limbs, NOI, offences, Vaishnava etiquette, the acharyas, **choosing an ashrama**, dealings with women | Strong fit: **deeper commitment**, and the point where the ashrama choice is prepared | High |
| BSS | Renunciation narratives + BIKC + SB studies; Level 5 BSS hearing journal; BSS camps | Strong fit: **brahmacari orientation** | High |
| BVS | No class topics. Level 5 BVS hearing journal (141 of 324 slots differ from BSS: BVS camps, "Congregation" lectures, "Principles of Grihasthas" at Kartik camp 2018); shares the BSS/BVS reading list | Fits **grhastha orientation** in principle, but **there is nothing to map**. A BVS syllabus would have to be proposed | Low (content) |
| Top levels | Nothing found. The most advanced bhakti-tattva content on the site sits in DPS (stages, 64 limbs, raganuga) and SPS1-19 (madhurya rasa) | **Not present as a batch** | — |

**Recommendation for Stage 2 (adopted there, subject to your review):** keep the brief's framework, adjusted as follows.
- Treat DYS as an entry course alongside VL1.
- Treat SPS2/SPS1/DPS as one stage of growing depth, with level notes for each repeated topic.
- Mark BVS as **proposed content**.
- Implement "pure devotion" as an **advanced track**: the DPS stage series, raganuga, the 64 limbs, and the
  later BSS studies. Don't invent a new batch.

## 5. Initial gap analysis

Detailed proposals with outcomes and references are in Stage 2 (`docs/stage2-content-architecture.md`, §7).

| Area | Gap |
|---|---|
| **BVS** | No class curriculum at all, although the batch is real (reading list, hearing journal, camps) |
| **Pure devotion / advanced** | No level above BSS/BVS. Sambandha–abhidheya–prayojana, the grace/endeavour relationship and the dangers of imitation are not explicit topics (sahajiyaism is, at SPS) |
| **Foundations** | No explicit topic on the **three modes of nature**, on **karma** as such (VL1-06 touches it), or on **accepting a spiritual master** (VL2-07 is about identifying ISKCON; no topic on diksha or guru-tattva before DPS) |
| **Progression** | Chanting is taught at VL3 and twice at SPS, but **offences to the Holy Name** wait until DPS. Lord Caitanya's life and divinity come only at SPS2-24/25 |
| **Sensitive placement** | "Krishna's sweetness: Madhurya rasa" sits at **SPS1**. The brief asks for restraint on rasa topics, so its treatment should be agreed with senior devotees |
| **Contemporary** | VL1 covers mind, stress, habits and technology well. From VL3 up nothing addresses **digital distraction in sadhana**, **mental health and when to seek professional help**, **career ethics**, or (outside DPS-04/56) **relationships and emotional maturity** before the ashrama choice |
| **Materials** | BSS has **no** materials on the site; SPS1 has almost none |
| **Sources** | Full BRS, *Madhurya-kadambini*, *Caitanya-bhagavata*, *Brahma-vaivarta Purana*, *Bhakti-ratnakara* (for acharya lives) are not accessible |

## 6. Access limitations

Full table: [source-inventory.md](source-inventory.md).
- **Full + searchable:** BG, SB, CC, ISO, NOI, NOD, TLC, Brahma-samhita, Prabhupada's lectures,
  conversations and letters.
- **Listed but not opened:** IYF's 130 topic folders and 75 resources, and the Drive PDFs (BIKC, Jaiva-dharma,
  Harinama-cintamani, compilations, biographies).
- **Partial:** BRS (only via NOD), acharya biographies (partly in CC), research papers (abstracts only).
- **Missing:** *Madhurya-kadambini*, *Caitanya-bhagavata*, *Brahma-vaivarta Purana*, *Bhakti-sandarbha*,
  grhastha-specific authorised books.
- **Not searchable yet:** the local ISKCON Desire Tree PDFs (no PDF text tool installed).

## 7. Implementation plan

| Stage | Output | Gate |
|---|---|---|
| 1 Discovery (this file) | Catalogue, sources, map, gaps | Your review |
| 2 Architecture (delivered alongside) | Topic template, level methodology (incl. BVS ≠ BSS, the pure-bhakti track), citation strategy, schema, HTML plan, proposed additions, **2 pilot topics** | Your review: **stop here** |
| 3 Pilot review | Revise the two pilots from feedback; senior-devotee read of both | Approval of the approach |
| 4 Content | All 229 topics in batches (suggested order: VL3, DPS stages, SPS clusters, VL2, VL1, BSS, then proposed BVS), with a content register; nothing marked complete until source-checked and reviewed | Per batch |
| 5 HTML | Static, offline site generated from the content files; search, filters, print styles | Test at 320–1440 px + print |
| 6 Final audit | Counts, register, verification report, known limits | Before any PDF |

Delivery stays local (HTML, `.md`). Nothing goes to claude.ai or any host without the head's OK.

## 8. Decisions needed from the head / IYF educators

1. **BVS:** Is there a BVS class syllabus outside the site? If not, may this library propose one, clearly
   marked *Proposed*?
2. **Top level:** Is there an IYF batch above BSS/BVS? What are **SNS** and **NS** in IYF's terms? If there is
   no batch above BSS/BVS, is an "advanced track" across DPS/BSS acceptable?
3. **SPS order:** Which comes first, SPS1 or SPS2? Is SPS2 the Sadhana app's "SPS Group 2"?
4. **Repeated topics:** For the ~20 topics shared by SPS1/SPS2/DPS, should there be one core preparation plus
   level notes (recommended), or a separate full preparation per batch?
5. **IYF's own folders:** May I read the 130 topic folders and the Drive PDFs (BIKC, Jaiva-dharma, etc.) to
   align with how IYF teaches? Via which account?
6. **Sensitive topics:** BSS-38/41/42 (nakedness, masturbation, homosexuality), the BIKC celibacy topics,
   SPS1-19 (madhurya rasa) and the controversy topics. I propose they get preparation notes plus mandatory
   senior-devotee review before use. For controversies, which official ISKCON positions does IYF follow, and
   where are they published?
7. **Language:** English preparation material with Hindi talk titles kept as they are? Many talks are given
   in Hindi.
8. **Drive copies marked `z-lib.org`:** replace them with purchased or library copies?

## 9. Decisions recorded (28 Oct 2026, the head)

| # | Question | Decision |
|---|---|---|
| 1 | BVS | Leave out what is not there: no BVS syllabus is proposed |
| 2 | Top level | **TRD**: those who have joined the temple. The head will supply its contents later |
| 3 | SPS order | SPS2 first, then SPS1 |
| 4 | Repeated topics | SPS2 and SPS1 are **one batch, SPS**; duplicates inside it become one page (`sps-NN`, 41 topics). The catalogue now has **219 topics** |
| 5 | IYF's folders and Drive PDFs | May be read through any account that has access. Harvesting public links with `tools/fetch_materials.py` |
| 6 | Sensitive topics | The head reviews them after the build |
| 7 | Language | English now; Hindi after the head proofreads the final English |
| 9 | VL1-02, VL1-08 (nationalism, Vedic history) | **On the sensitive list** (controversy); the head reviews them with the others |
| 10 | radheshyamdas.com, chaitanyacharan.com | Use as supporting sources (structure, examples, modern framing), cited by URL; scripture claims still verified on vedabase |
| 11 | Start VL2 | Confirmed (28 Oct), with VL1 batch 2 |
| 8 | `z-lib.org` copies | **Use them** (the head). Read for preparation; cite the published edition, never link the Drive file, short quotes only |
