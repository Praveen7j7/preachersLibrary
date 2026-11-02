# Writer brief (current; 28 Oct 2026)

**Layout check (head, 2 Nov 2026):** diagrams (section N) hold short labels inside boxes only; put any explanation as normal text
below the diagram, never as loose lines inside it. Before reporting, run `node tools/build-site.mjs` then
`node tools/layout-check.mjs <id>` and fix every issue it lists.

**Source pack first (head, 2 Nov 2026):** before reading any source, open research/packs/<id>.json and <id>.notes.md for your
topic (and for any page you link to). Fetch only what is not there. In research/packs/<id>.notes.md keep a "Further
sources" list: verses, purport passages, book passages, letters and stories relevant to the topic that the page does not
use, each with its exact location and the level or deeper session it would serve, so the next writer need not search again.

You write preacher-preparation pages for the IYFD (ISKCON Youth Forum Delhi) Preacher Library in
`/Users/maclapctp409/Downloads/files/hpStuff/prompt/preacherLibrary/` (cd there; absolute paths).


**Scope (head, 29 Oct 2026): every rule and decision in this brief applies to all batches (VL1–TRD), the courses and every topic,
existing and future, unless a rule names its own scope.**

## Read first
- `CLAUDE.md`
- `docs/stage2-content-architecture.md` §1–5 (template, citation rules, sensitive topics)
- `research/batch-criteria.md`: **your batch's conditions, motive, KRAs and MOOD, from IYF's own documents** (these
  override Stage 2 where they differ)
- `content/topics/_template.md`
- reviewed examples of your level: `content/topics/vl1-06.md` and `content/topics/vl1-17.md` (VL1),
  `content/topics/vl2-02.md` (VL2), `content/topics/dps-15.md` (advanced)

## Sources for each topic, in order of authority
**Questions climb the ladder (head, 30 Oct 2026):** the higher the batch, the less theory and the more realization in every
question set (H openings, K, M discussion, S5 questions and answers, S6 self-check, S7 practice, closing reflections).
- VL1: mostly understanding (what is it, why); one or two "how would this look in my day?".
- VL2 / VL3 / DYS: understanding plus application.
- SPS / DPS: mostly application and realization; theory only where needed to answer.
- BSS / TRD: almost all realization, application, imbibing, brainstorming and challenges: "What have I realized from this?",
  "How will I live this in my service, this life?", "What is stopping me, and what will I do about it?", "What will I reflect on
  each day this week?", "How do I keep this when I am tired, busy or praised?". A theory question appears only when the answer
  must be known before it can be lived. Answers are given from the page's verses and purports, not from opinion.
**Complete, end to end (head, 30 Oct 2026):** the page must fully meet the topic's need, for the preacher and for a student who
has that problem (cause, scripture, the Krishna conscious answer, exact steps, where to get help). Length is a guide only.
**Most reliable source first (head, 30 Oct 2026):** a statement may appear in several places; cite the most reliable and
authoritative one (Prabhupada's books > BBT-published records such as the Lilamrta > vedabase letters/lectures/conversations >
secondary collections), and name others only as "also in".
1. **Srila Prabhupada's BBT books, lectures, letters** (vedabase.io): the only authority for principles. Formats the
   checker understands: "BG 2.14", "SB 1.2.18", "CC Madhya 23.14-15", "NOI 3", "ISO 1", "Bs 5.1".
2. Other acharyas' books in `research/books/` (e.g. *Madhurya-kadambini*, approved, cite the edition; *Caitanya-bhagavata*,
   narratives only). Missing authorized book → `research/edt-ebooks/index.md` and
   `.venv/bin/python tools/fetch_edt_ebooks.py get "<path>"`.
3. **IYF's own material** (follow its flow and examples where they hold up). Open `research/sources-map.md` at your
   topic id; it lists:
   - IYF notes (`research/iyf-materials/<site row>/`)
   - IYF presentations
   - the **Preaching Encyclopedia** (HG Radheshyam Das, VOICE; `research/encyclopedia/`: DYS/EBG transcriptions, Holy
     Name, Mantra Meditation, Morning Program, Book Distribution…)
   - IYF lectures (audio; cite as "hear next")
4. Supporting, cited by URL, never authority for principles:
   - **VOICE/radheshyamdas.com**: systematic courses (`research/voice/courses.md`)
   - **Chaitanya Charan Das**: scientific perspective (thespiritualscientist.com, gitadaily.com)
   - **ISKCON gurus' realizations**: S.B. Keshava Swami, *Tattva*; attributed, only to ADD a realization
   - Desire Tree seminars (`research/desire-tree/`)
5. **Research**:
   - `python3 tools/find_research.py search "<topic>"`; every paper cited must pass
     `python3 tools/find_research.py doi <doi>`.
   - Educational claims only, never proof of theology.

Read at most ~30,000 characters of supporting material per topic (grep long files).

## Write `content/topics/<id>.md`
- **Two parts.**
  - Part 1 for the preacher: front matter + sections A–Q.
  - `# Part 2: For students`: S1–S8, with a quiz and **Answers:**.
  - Part 2 makes no claim and uses no reference that Part 1 does not support.
- **Front matter:** status: existing, review: drafted, lang: en, duration by level (VL1 60, VL2/VL3 180, SPS/BSS/DPS 120, TRD 180; see "Session formats" below), type, difficulty.
  List **every** scripture citation under `references:`. Keep the site title as given. For SPS topics, list the site rows
  (`siteRows` in data/curriculum.json) in section A.
- **Length:** about 400 lines per page.
- **Teaching lines say only what the verse says;** your reading goes under "Application (preacher's)".
- **Read the full purport** (fetch the vedabase page) before writing any "Purport point".
- **SB 10.14 onwards and Cantos 11–12:** add "BBT translation, completed by Srila Prabhupada's disciples".
- **Never invent** verses, quotations, purport statements, stories, dialogue, dates, statistics or research. Use these
  labels:
  - "Application (preacher's)"
  - "Invented case for discussion"
  - "traditional saying"
  - "Requires source review"
- **Unsourced IYF claims:** leave out or flag IYF's unsourced statistics and anecdotes.
- **sensitive: true** for mental health, sexuality/celibacy, rasa, controversy (including nationalism and comparisons with
  other faiths or organisations), abuse. Mental-health pages carry referral guidance (Tele-MANAS 14416); no shame language.

## Verses by level, durations, and section R (head, 29 Oct 2026)
- **Talk and student handout use only this level's verses.**
  - VL1/DYS: mainly BG, ISO and simple SB (Cantos 1–9).
  - VL2: plus SB 1–2 philosophy; CC only where essential.
  - VL3: plus NOI, SB on practice, CC holy-name verses.
  - SPS/DPS onward: CC, NOD, NOI in depth, BRS, MK.
- **Session formats (head, 29 Oct 2026; replaces the earlier durations).** Plan section G and `duration:` by level.
  No session goes beyond 3 hours.

  | Level | Session | `duration:` | Plan in G |
  |---|---|---|---|
  | VL1 (beginners) | One talk, 45–60 min | 60 | One timed 45–60 min flow |
  | VL2, VL3 | About 3 hours: first half lecture (~90 min), second half engagement: activities, Q&A, drama, quiz, discussion or presentation | 180 | (a) ~90 min lecture + ~90 min engagement block with at least two ready options (e.g. quiz questions, a discussion set, a short drama or presentation brief); (b) alternative: up to a 2-hour lecture with activities skipped (the speaker's choice) |
  | SPS, BSS, DPS | Full 2-hour lecture; the speaker may say more | 120 | A 120 min flow + "if time allows" extension material (extra points, verses, Q&A) |
  | TRD | The longest, up to 3 hours | 180 | A flow up to 180 min |

  Engagement must be ready to use (questions written out, roles and steps given), never just "do an activity".
  **These numbers are the time a session actually has, for planning — not a length to fill** (head, 29 Oct). Give all
  the relatable content the topic genuinely has, never padding; G shows how it fits the session and what to drop first
  if time is short.
- **Every page covers the topic for every level** (head, 29 Oct 2026). Timing follows the page's own level (Happiness:
  a 45–60 min VL1 talk), but the content must let a speaker prepare the same topic for any batch, BSS included, from
  this page alone, without going elsewhere.
- **Section R "Adapting for another level"** (before Part 2), the material for the other levels:
  - R.1: deeper verses in reserve (as many as the topic genuinely has), verified and labelled "For a more advanced
    audience; not for this level's talk or handout".
  - R.2 onwards, one block per other level where the topic fits (VL2, VL3, SPS, DPS, BSS; TRD once the head gives its
    contents): the extra teaching points, verses, stories or illustrations, and activities for that level, in that
    batch's style (BSS: brahmacari life, sense control, service attitude, from BIKC, SB/BG purports and the Brahmachari
    Lectures).
  - **B vs R, no repetition:** B's level table gives each level's treatment in one line (VL1, VL2, VL3, SPS, DPS,
    BSS); R gives the material. Never restate a B line in R or the other way round (head: remove the redundant one).
  - Advanced verses go here, never into the level's talk or handout.

## One place, and engaging sessions (head, 29 Oct 2026)
- **Preacher page = everything in one place.** H.1 says exactly how to start the session; O lists every link (IYF
  notes, decks, recordings, books, papers). A preacher should never need a second source to prepare.
- **Questions to the audience:** H.2 opening questions (2–3) and M.1 closing check questions (4–6, with expected
  answers), plus level-matched activities in M.2 (and in G's engagement block for VL2/VL3).
- **Student page stands alone:** S1 is a full summary a student who missed the lecture can follow; S5 and S6 are
  answerable from S1–S4 alone.
- **Make it encouraging (how people learn):** open with curiosity and their own life; involve the audience every
  10–15 minutes; easy questions first so everyone succeeds; praise effort and good answers by name; positive framing
  (what to gain, not what is wrong with them); invite, never pressure; end with one concrete, achievable step. No shame,
  no fear, no private disclosure.

## Use all our resources (head, 29 Oct 2026)
Start each page from its entry in `data/sources-map.json` and its transcripts in `research/iyf-materials/<id>/`;
advanced texts: `research/advanced-books.md`. Every relevant resource is linked in O.

## Global, professional standard (head, 29 Oct 2026)
This is a professional preachers' library meant for use across
the globe. Write in clear international English; explain every Sanskrit, Hindi or IYF-specific term at first use; where
an example is local (Indian campus, exams, family customs), add one that works for youth anywhere, or say how to adapt
it; no unexplained local references; precise citations; consistent formatting; respectful, inclusive tone. Audience: everyone, from the layman and the remotest, poorest communities to professionals and the highest levels of society: student pages in plain words a first-time reader follows; never assume wealth, schooling or a city life; where it helps, give one example from village or working life and one from professional or leadership life. **No vagueness, nothing fake, no assumptions:** every claim is concrete and either sourced (verse, book, paper, IYF material) or labelled as the preacher's application or an invented example; no invented quotations, stories, statistics or "studies show"; if a source cannot be checked, write "Requires source review" instead of guessing.

## Stories from scripture (head, 29 Oct 2026)
Tell the stories of Srimad-Bhagavatam, Caitanya-caritamrta and the other scriptures (e.g. Yayati for lust). `data/stories.json`
lists them per topic; the site attaches them to J automatically. Use them in the talk where they fit; never invent details.
**As it is: no addition, no subtraction, in content or intensity, as per the level (head, 2 Nov 2026).** The top batch (TRD) is the
highest intensity and holds nothing back. Our own reassuring glosses ("not a verdict", "not an insult", "a prayer, not a judgement") are additions: leave them out.
**As it is, no softening (head, 30 Oct 2026):** "do as it is, no softening, use BIKC and scriptures, don't speculate based
on your material understanding." Verses, purports and BIKC are given in their own words, in the talk and in the handout,
including strong wording about lust, women, the body or any group. No "teach the principle only / do not read it out"
instructions, no leaving verses out for tone, and no glosses of our own that soften or explain away what the source says.
Accuracy limits stay: nothing unverified is quoted as Prabhupada's words, and BIKC is cited as BIKC.
**Spiritual dimension > material needs (head, 30 Oct 2026):** where Srila Prabhupada's books give a measure (sleep, food,
austerity), teach that measure; research is material-level background only and is never set against a purport as an
equal standard, in the talk or in the handout. Keep plain medical safety ("if you are always unwell, see a doctor").
**History as it is (head, 30 Oct 2026):** tell every event exactly as the verses tell it, in the talk and in the handout:
no addition and no subtraction, no softening of hard events (e.g. Chota Haridasa's end, CC Antya 2.145-155). Lessons,
applications and safety notes stay outside the narration, labelled as such.

## Plain, clear English (head, 29 Oct 2026: "things should be clear and understandable")
Write so that a student reading alone understands every sentence the first time.
- **Full, normal sentences** in everyday words. No clipped, slogan-like or poetic fragments ("First move: ask.",
  "Take one live decision.", "someone who sees further than you").
- **Say exactly what to do, how and why.** Name the person ("a senior devotee or your mentor"), the text ("Bhagavad-gita
  2.47"), the time and the step, and give an example where it helps.
- **No figures of speech left unexplained.** If you use an image ("Kurukshetra every day"), say plainly what it means.
- **Short sentences, one idea each.** No riddles, no fill-in lines whose meaning the reader must guess.
- **Check:** read each sentence as a first-time student with average English. If you would have to ask "what does
  this mean?", rewrite it.

Bad: "Take one live decision. Ask one person who sees further than you, and read the Gita's second chapter for ten
minutes. Then write one line: 'What is mine here is the work; what is not mine is ___.' Decide."
Good: "This week, choose one real decision you have to make, for example which course to take. Before deciding, ask
a senior devotee or your mentor for advice, and read Bhagavad-gita chapter 2 for ten minutes. Then write one sentence:
'My duty is to do this work sincerely as service to Krishna; the result is in Krishna's hands' (BG 2.47). Then make
your decision."

## Every story, verse and example used in a Krishna conscious way (head, 29 Oct 2026)
Every story, verse, example, illustration, research finding, activity and verse on the page serves one end: to bring the listener
closer to Krishna and to devotional service, as Srila Prabhupada teaches.
- **Worldly examples** (science, sport, business, village life, research papers) are only illustrations. Each one ends
  in the Krishna conscious point it serves; never leave one as plain self-help, moral advice or motivation.
- **Verses are explained as Srila Prabhupada's translation and purport explain them,** toward bhakti. Never use a verse
  for a mundane, impersonal or merely ethical point, and never pull it from its context to fit an argument.
- **Scriptural stories** end in their devotional lesson (what it shows about Krishna, His devotees, or bhakti), not
  just a moral.
- **Problems are solved the Krishna conscious way.** Stress, lust, loneliness and failure are met with chanting,
  hearing, association and service to Krishna. Material techniques may support that, never replace it.
- Check each J point, story and activity: "How does this lead the listener to Krishna?" If there's no answer, fix it or drop it.

## No repetition inside a batch (head, 29 Oct 2026)
A batch's pages never repeat each other's arguments, examples or stories (DYS counts with VL2 and comes first). Check
the batch's other pages first; where they overlap, write "Builds on <id>" at the top of B, link it, and keep only this
page's own angle. A key verse may recur only for a different point.

## Check before you finish
- `node tools/verify-refs.mjs content/topics/<id>.md`: all must exist.
- Every quotation must match `research/verification/<id>.json` exactly.

## Rules
Write only your own `content/topics/<id>.md` and `research/verification/<id>.json`. Touch nothing else; don't run
split-views, register or build-site.

**Reply (≤ 15 lines):** per topic: refs (all found?), refs dropped, what you couldn't source, main sources used.
