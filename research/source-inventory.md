# Source inventory: what can actually be read, searched and cited

Stage 1 audit, 28 Oct 2026. Every row says how access was **tested**. "Listed" means the file or book is known
to exist but was not opened in this audit. Nothing here claims a book has been read cover to cover.

## Status key

| Status | Meaning |
|---|---|
| **Full + searchable** | Every verse/page reachable and full-text search works; checked this session |
| **Full, not searchable here** | Complete file exists and is reachable, but no text search set up yet |
| **Listed, not opened** | Known to exist (file listing, catalogue), access route known, content not read |
| **Partial** | Only a summary, extract, abstract or some chapters are available |
| **Missing** | Not found in any accessible source |

## A. Primary scriptures (Srila Prabhupada's BBT editions)

Main access route: **vedabase.io** (Bhaktivedanta VedaBase, BBT). Each verse page carries the Sanskrit,
synonyms, translation and purport, all in the HTML. I fetched sample pages and searched the site.
`tools/verify-refs.mjs` uses this route.

| # | Work | Author / translator | Online (vedabase.io) | IYF Drive copy | Status | How tested |
|---|---|---|---|---|---|---|
| 1 | Bhagavad-gita As It Is | A.C. Bhaktivedanta Swami Prabhupada (BBT) | `/library/bg/` | Yes (`1a. Bhagavad-Gita As It Is_English.pdf`) | **Full + searchable** | 21 verses fetched, translation + purport present |
| 2 | Srimad-Bhagavatam, Cantos 1–12 | Prabhupada; **from Canto 10 ch. 14 on, completed by his disciples (BBT)** † | `/library/sb/` | Yes (SB01–SB12 PDFs) | **Full + searchable** | 20 verses fetched across Cantos 1, 7, 10, 11 |
| 3 | Sri Caitanya-caritamrta (Adi, Madhya, Antya) | Krsnadasa Kaviraja; tr. Prabhupada (BBT) | `/library/cc/` | Yes (Adi, Madhya, Antya PDFs) | **Full + searchable** | Madhya 19.151, 23.14-15; Antya 20.21 fetched |
| 4 | Sri Isopanisad | Prabhupada (BBT) | `/library/iso/` | Yes | **Full + searchable** | Mantra 1 fetched |
| 5 | Nectar of Instruction | Rupa Gosvami; tr. Prabhupada (BBT) | `/library/noi/` | Yes | **Full + searchable** | Texts 1, 3, 7 fetched, purport read |
| 6 | Nectar of Devotion | Prabhupada's summary study of *Bhakti-rasamrta-sindhu* (BBT) | `/library/nod/` | Yes | **Full + searchable** (as a summary of BRS) | Chapter 1 fetched |
| 7 | Teachings of Lord Caitanya | Prabhupada (BBT) | `/library/tlc/` | Yes (B57 in reading list) | **Full + searchable** | Chapter 1 fetched |
| 8 | Sri Brahma-samhita (ch. 5) | Tr. and purport Bhaktisiddhanta Sarasvati (BBT) | `/library/bs/` | Yes (under "Writings of previous acaryas") | **Full + searchable** | Verse 5.1 fetched |
| 9 | Krsna, the Supreme Personality of Godhead | Prabhupada (BBT) | `/library/kb/` | Yes (B31) | Listed on vedabase, not opened | Library index lists `kb` |
| 10 | Other Prabhupada books (Science of Self-Realization, Perfect Questions Perfect Answers, Teachings of Queen Kunti, Teachings of Lord Kapila, Path of Perfection, Raja-vidya, etc.) | Prabhupada (BBT) | 29 sections in the vedabase library index | Yes, most (reading list B28–B57) | Listed on vedabase, not opened one by one | Library index lists `ssr pqpa tqk owk pop poy rv lob spl ...` |

† I couldn't see a credit line in the vedabase text I retrieved for SB Canto 10. It is widely documented
that Srila Prabhupada's own translation ends in Canto 10, chapter 13, and that the BBT edition was completed
by his disciples. **Confirm against the printed preface.** Until then, label any citation from SB 10.14
onward or Cantos 11–12 *"BBT translation, completed by Srila Prabhupada's disciples"*.

## B. Srila Prabhupada's lectures, conversations and letters

| Source | Route | Status | How tested |
|---|---|---|---|
| Lectures, morning walks, conversations (transcripts) | vedabase.io `/library/transcripts/` | **Full + searchable** | Opened the SB 1.2.18 lecture (Calcutta, 26 Sep 1974); found via search for "niṣṭhā" |
| Letters | vedabase.io `/library/letters/` | **Full + searchable** | Index page loaded (1.1 MB of entries) |
| Vanisource / Vaniquotes (topic-indexed quotes) | vanisource.org, vaniquotes.org | **Full + searchable** (secondary index; quotes link back to sources) | Main pages loaded |
| prabhupadabooks.com | prabhupadabooks.com | Full (alternative edition check) | BG 2.13 loaded |

Edition note: vedabase.io shows the current BBT text. Where older (pre-1977) and revised editions differ,
a citation should say which edition it uses. That matters only for exact quotations, not for verse numbers.

## C. Works of earlier Gaudiya Vaishnava acharyas

| Work | Where | Status | Note |
|---|---|---|---|
| Brahma-samhita (Bhaktisiddhanta's purport) | vedabase + IYF Drive | **Full + searchable** | Same as A-8 |
| Jaiva-dharma (Bhaktivinoda Thakura) | IYF Drive, folder `5. BSS/BVS/SNS/11. Writings of previous acaryas` | Listed, not opened | Translator/edition not shown in the file name; check before citing |
| Harinama-cintamani (Bhaktivinoda; tr. Bhanu Swami) | IYF Drive | Listed, not opened | Relevant to DPS-06 (offences to the Holy Name) |
| Dasamula-tattva, Bhaktyaloka, Vaishnava-siddhanta-mala, Hari-bhakti-kalpa-latika, Songs (Bhaktivinoda) | IYF Drive | Listed, not opened | Bhaktyaloka is directly relevant to NOI 2–3 topics (DPS-33/34) |
| Bhaktisiddhanta Sarasvati: Articles, Lectures, "Dusta mana" | IYF Drive | Listed, not opened | |
| Gitavali (Bhaktivinoda; Visvanatha "Sri Gitavali") | `~/Downloads/*.pdf` (3 files) | Full, not searchable here | Songs; useful for illustrations |
| **Bhakti-rasamrta-sindhu, full text** (Rupa Gosvami) | ISKCON Desire Tree ebooks → `research/books/` (OCR, 107 pp.) | **Full English rendering** (translator not named in the file; Eastern Ocean with explanations); NOD remains the primary BBT source | Needed for DPS-27/28/29 (64 limbs) and DPS-30 (raganuga). A full English translation exists in print; **request** |
| **Madhurya-kadambini** (Visvanatha Cakravarti) | Downloads → `research/books/` (516 pp.) | **Full + searchable**: Gaudiya Vedanta Publications 2018 edition, CC BY-ND | **Approved for use by the head (28 Oct 2026)**; cite the edition |
| **Caitanya-bhagavata** (Vrndavana dasa Thakura) | Downloads → `research/books/` (292 pp.) | **Full text, translation only; translator not named** | Narratives only (Haridasa Thakura, early Mahaprabhu); cross-check key passages; never for siddhanta |
| **Brahma-vaivarta Purana** | tr. Rajendra Nath Sen, Sacred Books of the Hindus XXIV (Panini Office, Allahabad 1920; public domain), archive.org | **Full text (OCR)** in `research/books/` since 29 Oct 2026 (not in the Desire Tree ebook library) | BSS-50 (Sankhacuda and Tulasi): Prakriti Khanda; cite the edition and chapter; not in Prabhupada's books |
| Bhakti-sandarbha / Sat-sandarbhas (Jiva Gosvami) | ISKCON Desire Tree ebooks → `research/books/` (Bhakti-sandarbha, OCR, 324 pp.); the other Sandarbhas are in the catalogue | **Full** (Bhakti-sandarbha) | Only needed at the most advanced level |
| Biographies of the Six Gosvamis, Narottama, Srinivasa, Syamananda | CC + *Bhakti-ratnakara* (373 pp.) and *Prema-vilasa* (121 pp.), both OCR'd into `research/books/`; *Six Gosvamis of Vrindavan* and *The Seventh Goswami* in the head's Drive folder | **Full** | DPS-42…53 and SPS1-23…27 need these; CC covers Rupa, Sanatana, Raghunatha dasa well, Jiva and Gopala Bhatta only briefly |

## D. ISKCON / IYF educational material

| Source | Where | Status | Note |
|---|---|---|---|
| **IYF Preachers Library topic folders** (130 of 235 sessions link one) | Google Drive (126), OneDrive (1), others | **Harvested 28 Oct 2026** (`tools/fetch_materials.py`): text from 238 Docs, Slides, PDF and Office files covers **92 of 219 topics** (VL1 32, DYS 1, VL2 7, VL3 6, SPS 13, DPS 33, BSS 0). 170 audio and 10 video files are listed but not transcribed; 15 folders are private or empty. Text is in `research/iyf-materials/` | IYF's own slides, audio and notes per topic. Sampled: "Happiness Module-1/2.pptx", "VMML-45 Controversial Issues…", lecture MP3s. **The most important source for how IYF already teaches each topic.** |
| IYF Preachers Library attached resources (75) | Drive, YouTube | Listed, not opened | Audio/video/PPT/doc per topic (mostly SPS2, VL2, VL3) |
| **Brahmacarya in Krsna Consciousness** (Bhakti Vikasa Swami, Bhakti Vikas Trust) | IYF Drive `5. BSS/BVS/SNS/7. Brahmacarya…pdf` | Listed, not opened | 29 BSS topics are its chapters. Copyrighted (the publisher sells it; no free edition found). Use for preparation; quote briefly |
| Compilations from Prabhupada's books: Sri Namamrta, Preaching Is the Essence, The Spiritual Master and Disciple, **Varnasrama-dharma** | IYF Drive | Listed, not opened | Varnasrama-dharma is a key BVS source |
| IYF reading sequence (76 books by level) | `sadhanaRecord/setup/data/journals.json` | **Full** (titles, levels, order) | Book list per batch: VL-1 6, VL-2 17, VL-3 12, SPS/DPS 13, BSS/BVS 28 |
| IYF hearing journals (SPS/DPS, BSS, BVS: 81 weeks × 4 slots; VL3: 12 weeks) | `journals.json`, `tools/lectures/vl3-journal.json` | **Full** (titles); audio on Drive | Shows IYF's chosen hearing curriculum. BVS titles are mostly generic ("BVS Folder_Lecture 7"); a few are explicit ("Principals of Grihastas", Kartik camp 2018) |
| Biographies / glorification (Lilamrta, TKG's Diary, Transcendental Diary, Jayananda, Visnujana, Vamsidasa Babaji, "The Seventh Goswami", "A Ray of Vishnu") | IYF Drive | Listed, not opened | Story sources for DPS-41 (Srila Prabhupada) and acharya topics |
| ISKCON Desire Tree seminar notes/transcripts (333 PDFs: Srimati Mataji on guru-tattva and Madhya 20, Urmila Mataji on BG, Jayapataka Swami, Radha Govinda Swami, etc.) | `prompt/iskcon_pdf_library/` | **Full + searchable** (28 Oct): text of all 333 PDFs in `research/desire-tree/` (index.md lists speaker, series, title); 3 are scans with no text | Secondary. Useful for lecture flow ideas; not for siddhanta claims |
| Ten VL-1/VL-2 books by Chaitanya Charan Das, Stephen Knapp, Michael Cremo, etc. | IYF Drive | Listed, not opened | Apologetics/culture books used by VL1/VL2 |

### D2. ISKCON teachers' sites (added by the head, 28 Oct 2026)

| Source | Status | Use |
|---|---|---|
| https://radheshyamdas.com/ (Radheshyam Das, VOICE Pune) | Reachable | **Systematic courses** (head, 28 Oct): ~1,000 collections of recorded sessions by audience: newcomers (GAME, Positive Thinker, Fundamentals of Spirituality), senior youth, leaders' training, **brahmachari training (91, for BSS)**, japa talks, temple lectures. Indexed in `research/radheshyamdas/` by `tools/fetch_rsd_index.py`. Same lineage as the *DYS Book* (VOICE Pune) |
| https://chaitanyacharan.com/ (Chaitanya Charan Das) | Reachable | **The scientific perspective** (head, 28 Oct): science and spirituality, reasoned answers. Key for VL2 (God and science, evolution), DYS and rational VL1 talks. Several of his books are on the VL1/VL2 reading list |

Level 4/6 in the source hierarchy: fine for structure, examples and contemporary framing, cited by URL. Never the
final authority for siddhanta; scripture claims are still verified on vedabase.

### D2b. IYF internal documents shared by the head (28 Oct 2026)

| Source | Status | Use |
|---|---|---|
| KRA/KPI workbook (Google Sheet 1M1-xYlB…; 27 tabs: vision, mission, department KRAs, IYF courses and eligibility, systems, calendars) | **Full**: `research/iyf-materials/iyf-kra/` | **Authority for batch conditions and motives** |
| IYF curriculum documents folder (Drive 1TM5DLj8…: VL1 documentation, VL2 syllabus, OTP speaker and facilitator guidelines, forms) | Harvested to `research/iyf-materials/iyf-docs/` | Level purposes, syllabus |
| IYF media library (Sheet 12QrYooU…; tabs Audios 557, Brahmachari Lectures 172, PPTs and Videos 117, Training Materials 12 COASTOK) | **Catalogue full** (`research/iyf-materials/iyf-sheet-3/`); recordings not transcribed | Lectures matched to topics by title in `research/sources-map.md` ("hear next"); Brahmachari Lectures = the BSS source |
| IYF presentation catalogue (Sheet 1UcYYwTH…: 117 decks by HG Sundar Gopal Pr, HG Rambhadra Pr and others) | Harvesting to `research/iyf-materials/iyf-decks/` | Topic material; candidate topics |

| **Preaching Encyclopedia** (HG Radheshyam Das, VOICE Pune; "All EBG lecture transcriptions and books", .chm) | **Full + searchable**: 456 pages in chapter order, 6 M characters (`research/encyclopedia/`, `tools/extract_encyclopedia.py`) | DYS and EBG lecture transcriptions, Holy Name, Mantra Meditation, First-Year Morning Program, Book Distribution, College Preaching, SP Speaks Out, Spiritual Scientist articles. **IYF's core preaching method**: follow its structure; scripture still verified |

| **ISKCON Desire Tree ebooks** (ebooks.iskcondesiretree.com/pdf) | Catalogue in `research/edt-ebooks/` (`tools/fetch_edt_ebooks.py`) | **The head's source for any missing authorized book** (Gaudiya_Books: ~45 acharyas, e.g. Jiva Goswami's six Sandarbhas). Fetched on demand into `research/books/` |

### D3. ISKCON gurus and VOICE (added by the head, 28 Oct 2026)

| Source | Status | Use |
|---|---|---|
| S.B. Keshava Swami, *Tattva* (tattva.keshavaswami.com) | **Indexed**: 371 articles (`research/gurus/keshavaswami.json`) | Realizations, attributed; never the source of principles |
| Other non-ritvik ISKCON gurus' sites | Only once the head names them | As above |
| VOICE Pune (voicepune.com) | Course list saved (`research/voice/courses.md`); material not public | Structure and framing; matches several VL1 topics |
| voicepublication.in (VOICE books, 100+) | Store only | Cite as further reading; don't copy |

## E. External research (for teaching method only, never as proof of theology)

| Source | Status | Use |
|---|---|---|
| **OpenAlex, Europe PMC (search) and Crossref (DOI check)** via `tools/find_research.py` | **Working** (28 Oct): free, no key; OpenAlex sometimes rate-limits and the tool waits | Find established studies; verify every citation's DOI |
| Open web search + publisher/catalogue pages | Available | Confirms that a paper exists, plus its authors, journal and DOI |
| Full text of journal articles | **Partial**: abstracts and open-access copies only; no institutional login | Cite findings only to the depth the abstract supports |
| Verified this session: Lally et al. 2010 (*Eur. J. Soc. Psychol.* 40(6):998–1009, doi:10.1002/ejsp.674); Tedeschi & Calhoun 2004 (*Psychological Inquiry* 15(1):1–18, doi:10.1207/s15327965pli1501_01); Lerner 1980 (*The Belief in a Just World*, Plenum) | Bibliographic details + abstract | Used in the two pilots |

## F. Problems found in the sources

1. **Possible unauthorised copies on IYF's Drive.** Two VL-1/VL-2 files carry `z-lib.org` in the name
   (*Merchants of Doubt*; *End of Modern Civilization…*), the mark of a shadow-library download. **The
   head said to use them (28 Oct 2026).** They are read for preparation and cited by published edition
   (author, publisher, year). The library never links or redistributes the Drive files and quotes only briefly.
   Legitimate copies are advisable before any material is shared outside IYF.
2. **BIKC is copyrighted** and not freely published. The 29 BSS topics built on it can summarise and cite
   chapters but must not reproduce them.
3. **BBT texts are copyrighted.** Topic pages will use short quotations (a translation, a few purport
   sentences) with exact references, and summarise the rest.
4. **PDF text extraction is installed** (pypdf 4.3.1 in `preacherLibrary/.venv`, 28 Oct 2026). The IYF topic files, the DYS Book
   and the 333 Desire Tree PDFs are searchable text now.
5. **OCR for PDFs with unreadable fonts** (28 Oct 2026): `swift tools/ocr_pdf.swift <in.pdf> <out.txt>` (macOS Vision, offline).
   Used for Bhakti-rasamrta-sindhu, Prema-vilasa, Bhakti-ratnakara, Bhakti-sandarbha.
