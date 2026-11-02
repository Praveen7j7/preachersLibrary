---
id: stage2-content-architecture
title: Stage 2 — Content architecture
status: for-review
references:
  - BG 2.59
  - BG 2.62
  - BG 2.63
  - BG 3.6
  - BG 3.8
  - BG 3.9
  - BG 3.21
  - BG 3.27
  - BG 4.17
  - BG 4.34
  - BG 6.5
  - BG 6.14
  - BG 6.16
  - BG 6.17
  - BG 6.26
  - BG 6.34
  - BG 6.35
  - BG 6.40
  - BG 7.11
  - BG 8.11
  - BG 9.30
  - BG 9.31
  - BG 10.10
  - BG 14.5
  - BG 17.8
  - BG 17.15
  - BG 18.46
  - SB 1.2.6
  - SB 1.5.17
  - SB 2.1.4
  - SB 3.25.25
  - SB 5.5.2
  - SB 5.5.8
  - SB 5.5.18
  - SB 7.5.30
  - SB 7.12.1
  - SB 7.14.5
  - SB 7.14.6
  - SB 11.2.42
  - SB 11.3.21
  - SB 11.5.32
  - CC Adi 8.24
  - CC Madhya 19.151
  - CC Madhya 19.167
  - CC Madhya 20.108
  - CC Madhya 20.124
  - CC Madhya 22.54
  - CC Madhya 22.153
  - CC Madhya 22.157
  - CC Madhya 23.14-15
  - CC Antya 20.21
  - NOI 1
  - NOI 2
  - NOI 4
  - NOI 7
---

# Stage 2: Content architecture

> **Decisions of 28 Oct 2026 applied** (Stage 1 report §9):
> - SPS2 and SPS1 are one batch, **SPS** (SPS2 first).
> - BVS is **left out** (no topics on the site).
> - The top level is **TRD** (temple residents); the head will supply its contents.
> - IYF's folders may be read.
> - The head reviews sensitive topics after the build.
> - The material is in English now; Hindi comes after the head's proofreading.

**IYFD Preacher Preparation Library** · 28 Oct 2026 · Status: **approved for build**. Builds on
[Stage 1](../research/stage1-discovery-report.md). It includes two pilot topics:
[VL1-06](../content/topics/vl1-06.md) (lower level) and [DPS-15](../content/topics/dps-15.md) (advanced).

Every verse cited here was checked against vedabase.io by `tools/verify-refs.mjs`. Results are in
`research/verification/stage2-content-architecture.json`. "Checked" means the reference exists and its
translation supports the use made of it. Where a sentence is my application rather than the verse's own
meaning, it says so.

---

## 1. The principle: every topic is a teaching assignment

A topic page prepares **the preacher**. It is not a script to read aloud. After working through a page, a
preacher should be able to do five things. Each maps to sections of the template (§3):

| The preacher can… | Template sections |
|---|---|
| **Understand** the philosophy well enough to say it in their own words | C central message, F philosophy, I core points |
| **Verify** every important claim before teaching it | E scriptural foundation (each with a link and a status), Q checklist |
| **Prepare** a lecture that fits the time and the audience | A overview, B why this level, D outcomes, G lecture flow, H opening, J stories, N visual aid |
| **Answer** the questions this audience will really ask | K questions and objections |
| **Facilitate** discussion rather than only talk | L case studies, M discussion questions, P takeaway |

Two consequences shape every page:
- **Material is graded by need.** The core (C, D, E, F, G, K) is compulsory. Stories, cases, diagrams and
  research appear only when they help this topic. A short topic is better than a padded one.
- **The page shows its own uncertainty.** Each reference carries a status; an unverified claim is labelled
  as such, never dressed up as certain.

## 2. Teaching methodology by level

### 2.1 Level profiles

Built from the brief's framework and checked against the live catalogue (Stage 1 §4). Levels marked †
need IYF confirmation.

| | **VL1** (+ DYS †) | **VL2** | **VL3** | **SPS** (SPS2 then SPS1, one batch) | **DPS** | **BSS** | **BVS** (left out: no topics yet) | **TRD** (top level; contents pending) |
|---|---|---|---|---|---|---|---|---|
| Purpose | Attraction | Reasoned faith | Devotional practice | Strengthening, steadiness | Deeper, accountable commitment; ashrama discernment | Brahmacari orientation | Grhastha orientation | Deeper understanding of pure bhakti |
| Audience assumes | Nothing: may doubt religion itself | Interest, not yet conviction | Basic conviction, starting sadhana | Steady chanting (journal: 8–16 rounds, 9–27 months) | Settled practice, taking service | Aspiring to celibate service | Aspiring to Krsna-centred family life | Devotees who have joined the temple |
| Main question | "Why should I explore this?" | "Why should I accept this?" | "How do I practise this?" | "How do I sustain it when it gets hard?" | "What does serious commitment ask of me?" | "How do I live as a brahmacari, inside and out?" | "How do I keep Krsna central in family and work?" | "What is pure devotion, and how is it cultivated?" |
| Use of scripture | 1–3 verses, introduced as wisdom, not as authority to be obeyed | Scripture as evidence, argued with reason and experience | Scripture as instruction for practice | Scripture + purport as guidance through difficulty | Systematic texts (NOI, NOD, CC) | SB/CC narratives + BIKC + Prabhupada's instructions | SB 7.14-type instructions, BG on work, letters | Textual precision (CC, NOD, SB) with context |
| Sanskrit | Almost none | Key terms, defined | Practice terms | Philosophical terms | Technical terms used accurately | As needed | As needed | Precise, never decorative |
| Tone | Conversational, curious | Respectful debate | Encouraging, practical | Honest, steadying | Mature, accountable | Serious, compassionate, shame-free | Practical, warm, realistic | Reflective, humble |
| Typical application | One small experiment (e.g. try one chanting session) | One reasoned conclusion to test | One practice to establish | One habit to repair or deepen | One commitment with accountability | One discipline + one guidance step | One family/work practice | One inner attitude to examine |
| Avoid | Assuming faith; jargon; pressure; "prove God" overreach | Straw-man opponents; easy answers; anti-science tone | Ritual without meaning | Repeating VL3 | Commitment as social pressure | Romanticising renunciation; equating austerity with advancement; shame | Portraying grhastha life as second-class; assuming everyone marries | Terminology for its own sake; esoteric speculation; claims of realisation |

### 2.2 The same topic at different levels

SPS2 and SPS1 are one batch (decision, 28 Oct 2026). A topic on both lists is **one SPS page**
(`sps-NN`), which keeps both site rows. Where a topic recurs in DPS, the DPS page **builds on the SPS page**:
it links back to it and teaches only what is *new* at DPS. A worked example with two real catalogue clusters:

**Humility** (sps-06 ← site rows SPS2-06, SPS1-10; dps-11)

| | SPS | DPS |
|---|---|---|
| Entry point | Humility as the condition for hearing: one learns from those who have seen the truth by approaching humbly (BG 4.34) | Humility as the condition for constant chanting (CC Antya 20.21): it decides whether one can chant always |
| New understanding | False ego (BG 3.27) is the root of pride; humility is accurate self-understanding, not low self-esteem | Distinguishing humility from inferiority complex (DPS-24) and superiority complex (DPS-21); humility while holding responsibility |
| Typical question | "Isn't humility weakness?" | "How do I stay humble when I lead others or am praised?" |
| Application | Ask for and accept one correction this week | Track one situation where position or praise affects your chanting |

**Chanting** (vl3-04 → sps-13 → dps-06)

| VL3 | SPS | DPS |
|---|---|---|
| Why chant; how to chant one round attentively; a starting number agreed with the facilitator | Quality over quantity: attention, hearing the sound, japa as a relationship; avoiding mechanical chanting | Offences to the Holy Name (CC Adi 8.24: there are offences to be considered while chanting). **Proposed:** a short introduction to the offences earlier, at VL3/SPS (§7) |

### 2.3 BSS and BVS: the same foundation, different preparation

> **BVS is left out for now** (decision, 28 Oct 2026): the site has no BVS topics, so no BVS page or syllabus
> is written. This section still guides the BSS pages, which must never portray grhastha life as inferior. It
> stays ready for when IYF adds BVS topics.

Both batches stand on the same philosophy and need equal seriousness. They differ because the participants'
**intended life directions** differ, so the practical preparation differs. Neither is the "higher" path.
The table separates what is shared from what is distinct.

**Shared foundation (both batches)**
- The self is not the body; the attraction between male and female is the basic principle of material
  existence, and it ties the heart to body, home, property and relatives (SB 5.5.8). Both batches must
  understand this, the BVS candidate as much as the BSS one.
- Liberation comes through service to great devotees (SB 5.5.2); guidance and association are not optional
  in either ashrama.
- Higher taste, not suppression, steadies the senses (BG 2.59). Controlling only the external senses while
  the mind dwells on sense objects is self-deception (BG 3.6). This protects BSS from external renunciation
  and BVS from merely "regulated" sense enjoyment.
- Regulation and balance (BG 6.16–17), tolerance of urges (NOI 1), simplicity (NOI 2).

**What differs**

| Dimension | **BSS — brahmacari orientation** | **BVS — grhastha orientation** |
|---|---|---|
| Life direction | Celibate service, usually in an ashrama community, for a period or for life | Marriage, family and a livelihood, with Krsna at the centre |
| Defining scripture | Brahmacari discipline: sense control, submission and service at the guru's ashrama (SB 7.12.1); celibacy practised by those who desire perfection (BG 8.11); the meditator "free from sex life" (BG 6.14); renunciation narratives already in the catalogue (Raghunatha dasa, Haridasa, Chota Haridasa, Rsabhadeva) | Sex life not contrary to religious principles is Krsna's own energy (BG 7.11); work offered as sacrifice to Visnu, not as bondage (BG 3.8–9); perfection through one's own work (BG 18.46); earning as much as needed while inwardly unattached to family affairs (SB 7.14.5); a simple programme kept firmly amid relatives' suggestions (SB 7.14.6) |
| Central danger | **Externalism**: outer austerity with an untransformed heart (BG 3.6); the chain from contemplation to fall-down (BG 2.62–63, BSS-05); pride in renunciation; shame and secrecy after a lapse | **Grha-vrata**: the home becomes the goal and life becomes "chewing the chewed" (SB 7.5.30); attachment to body, children and wife as "fallible soldiers" (SB 2.1.4) |
| Responsibility | For one's vow, one's service, and honest disclosure to guides | For the spiritual welfare of dependants: one who cannot deliver dependants from repeated birth and death should not become a father, husband or mother (SB 5.5.18). This is a high standard, not a licence for guilt |
| Practical skills to prepare | Boundaries in dealings (BSS-30…35); handling sexual desire without denial or shame (BSS-37…42, with senior review); sustainable sadhana and health (BSS-44…49); cooperation in community; discerning whether the ashrama suits *me* (DPS-56) | Choosing a spouse on shared values; communication and conflict (speech that is truthful, pleasing, beneficial and not agitating: BG 17.15); money and ethical livelihood; household sadhana; children; parents and in-laws; staying connected to association |
| Relationship to the other ashrama | Respect for grhasthas (BSS-30 "Attitudes towards grhastha men"); no contempt for family life | Respect and support for brahmacaris and the temple; no envy or comparison |
| Shape of a session | More narrative and self-examination; confidential mentoring essential | More case-based and skills-based; couples and family situations as case studies |
| Sources still needed | BIKC is on IYF's Drive (not yet opened; copyrighted) | **No grhastha-specific authorised book in the accessible inventory.** The Prabhupada compilation *Varnasrama-dharma* is on Drive (not opened); his letters on marriage are searchable on vedabase. **IYF should name the books BVS uses** |

### 2.4 Top level (TRD) and advanced topics: deepening pure bhakti, not adding terminology

The top level is **TRD**: devotees who have joined the temple. The head will supply its contents later, and
nothing is written for TRD until then. The method below applies to TRD pages when they come. Until then it
applies to the most advanced existing topics:
- dps-12…18, the sraddha → prema series
- dps-27…31: the 64 limbs, spontaneous devotion, yukta-vairagya
- sps-33: madhurya
- the later BSS studies

What makes the material "advanced" is the questions it helps a devotee ask about their own heart.

| Instead of… | The advanced track asks… | Grounding |
|---|---|---|
| Defining *uttama-bhakti* | "Which of my motives are still for myself?" (devotion free of other desires, knowledge and fruitive aims) | CC Madhya 19.167; SB 1.2.6 (unmotivated, uninterrupted) |
| Listing the stages | "Where is my practice actually unsteady, and why?" | CC Madhya 23.14-15; pilot [DPS-15](../content/topics/dps-15.md) |
| Praising sadhu-sanga | "Whose association am I actually receiving, and how?" | CC Madhya 22.54; SB 3.25.25 |
| Claiming grace makes effort unnecessary, or effort earns grace | Holding both: the seed of bhakti comes by the mercy of guru and Krsna (CC Madhya 19.151); Krsna gives understanding to those constantly engaged in loving service (BG 10.10) | BG 10.10; CC Madhya 19.151 |
| Measuring advancement by knowledge | Devotion, experience of the Lord and detachment grow together (SB 11.2.42). Knowledge without detachment is a warning sign | SB 11.2.42 |
| Discussing rasa freely | Restraint: in raganuga the advanced devotee externally follows the sastric practices like a neophyte (CC Madhya 22.156–157). Srila Prabhupada: think of Krsna's pastimes with the gopis "but not to try to imitate" (letter to Hayagriva, 8 Nov 1968, Los Angeles) | CC Madhya 22.153, 22.157; letter |
| Admiring humility | Humility as the qualification for chanting (CC Antya 20.21) | CC Antya 20.21 |

Rules for this track:
- Never present a commentator's private view as established siddhanta.
- Cite which acharya says what; when a source is not accessible (*Madhurya-kadambini*, full BRS), say so.
- No speculation about anyone's level of realisation, including the preacher's own.

### 2.5 Sensitive topics protocol

Applies to:
- BSS-37…42 (semen retention, nakedness, overcoming sexual desire, falldown, masturbation, homosexuality)
- sps-33 (madhurya rasa)
- the controversy topics (sps-19, dps-43)
- dps-04 / bss-31…32 (dealings with women)
- any topic touching depression or abuse

1. **The head reviews these pages after the build** (decision, 28 Oct 2026). They carry `sensitive: true` and
   stay at review status `senior-review` until he approves them.
2. The page gives **preacher guidance** (what to say in a group, what belongs only in one-to-one mentoring)
   rather than a full public lecture script where a group setting is inappropriate.
3. **No shame-based language.** The teaching is honest about the standard and compassionate about struggle.
   It always points to confidential guidance (VL3-08, DPS-02).
4. **Mental health:** preachers are not therapists. Every topic touching depression, anxiety, trauma or
   abuse states plainly that professional help is compatible with spiritual life, and says when to refer.
   That statement is pastoral guidance, labelled as such.
5. **Controversies:** present ISKCON's official position *with its published source*. Until IYF confirms
   which documents to cite (Stage 1, decision 6), these pages stay `requires-source-review`.

## 3. The standard topic template

File: `content/topics/<topic-id>.md`, with front matter (§5) and fixed section headings A–Q, taken from the
brief. The template file is [`content/topics/_template.md`](../content/topics/_template.md).

| § | Section | Required? |
|---|---|---|
| A | Topic overview (metadata table) | Always |
| B | Why this topic belongs at this level (+ how it differs elsewhere: a level table, VL1–DPS, the only per-level notes) | Always |
| C | Central message (1–2 sentences) | Always |
| D | Learning outcomes (3–5) | Always |
| E | Scriptural foundation: per reference, citation · short verified text · context · teaching · purport point · application, **each with a status** | Always |
| F | Philosophical explanation (principle, why it matters, connections, consequences, misunderstandings, level pitch) | Always |
| G | Lecture flow (timed) + an alternative structure, by session format: VL1 45–60 min talk; VL2/VL3 ~3 h (half lecture, half engagement; or up to 2 h lecture, activities skipped); SPS/BSS/DPS 2 h lecture + extension; TRD up to 3 h; max 3 h (head, 29 Oct 2026; writer-brief "Session formats") | Always |
| H | Opening and engagement | Always |
| I | Core teaching points (3–7) | Always |
| J | Stories and illustrations (cited) | When a verified story helps |
| K | Anticipated questions and objections | Always |
| L | Case studies (marked as invented) | When useful (common for character, relationship, BVS topics) |
| M | Discussion and reflection (comprehension · reflection · application) | Always |
| N | Visual teaching aid (inline SVG/HTML or a described diagram) | When it clarifies |
| O | Research and supplementary resources (empirical vs theological kept apart) | Only if a reliable, relevant source exists |
| P | Practical takeaway (lesson, action, reflection, next topic) | Always |
| Q | Preacher's self-review checklist | Always |
| R | Adapting for another level: deeper quotes in reserve (R.1), then the material for each other level the topic fits (VL2, VL3, SPS, DPS, BSS; TRD later), so any batch can be prepared from this page; B keeps one line per level and is never restated here; head's rule, 29 Oct 2026 | Always |

**Part 2: for students** (head's requirement, 28 Oct 2026). Every topic also carries a 1–2 page student
handout, so the topic lands in the participants' heads as well as the preacher's:

| § | Section |
|---|---|
| S1 | Summary |
| S2 | Key ideas |
| S3 | Verses to remember |
| S4 | Words to know |
| S5 | Questions and answers |
| S6 | Check your understanding (quiz + answers) |
| S7 | Try this week |
| S8 | Read or hear next |

Part 2 is written at the batch's level and makes no claim or reference that Part 1 doesn't already
support. Each topic is published as **three documents** made from the one source file by `tools/split-views.mjs`
(head's requirement, 28 Oct 2026):
- `preacher.md`: Part 1, preachers only;
- `students.md`: Part 2, safe to share with participants;
- `combined.md`: both parts.

The HTML site and later PDFs follow the same three views.

Topic **types** change emphasis, not structure:

| Type | Examples | Emphasis |
|---|---|---|
| Relevance talk | Most of VL1 | H, K, L; scripture light but exact |
| Philosophy | VL2, SPS tattva, DPS stages | E, F, K |
| Practice | VL3, SPS chanting/hearing, DPS limbs | G, P, a concrete method |
| Character / relationship | Humility, envy, dealings | L, M, self-examination |
| Life of an acharya | dps-41…53, sps-25, sps-35…39 | J with exact sources; flag gaps (*Bhakti-ratnakara* not accessible) |
| Scripture narrative / study | BSS-01…14, 50…55 | E as a passage, J as the narrative itself |
| BIKC chapter | BSS-16…49 | Summary + Prabhupada sources; no reproduction; senior review where sensitive |
| Controversy | sps-19, dps-43 | Official position + source; respectful handling of people who hold other views |

## 4. Citation and verification strategy

### 4.1 Source hierarchy

As in the brief:
1. Primary scripture in Srila Prabhupada's BBT editions
2. His purports, lectures, conversations and letters
3. Other Gaudiya acharyas, attributed by name and work
4. Official ISKCON educational sources
5. Peer-reviewed research, for empirical claims only
6. Supplementary teaching material (IYF folders, seminar notes)

A page never lets a level-5 or level-6 source settle a question of siddhanta.

### 4.2 What each status means

| Status | Requirements |
|---|---|
| **Verified** | (1) The reference exists (`verify-refs` finds the page and saves the translation). (2) An editor has read the translation, and the purport where it matters, and confirms it supports the exact use made of it. (3) Context does not contradict that use |
| **Partially verified** | (1) is met but (2) or (3) is pending, or only part of a range was checked, or the source is a reliable secondary report (e.g. a Prabhupada quote found via Vaniquotes, not yet checked in the transcript) |
| **Requires source review** | The source is not accessible (e.g. *Madhurya-kadambini*), or the citation could not be found. **Never presented as established** |

Automation does (1). People do (2) and (3). A page can be `drafted` with partial references but cannot
reach `approved` until every reference in sections C–F is Verified.

### 4.3 How a reference appears on a page

```
**BG 2.14** — Verified · vedabase.io/en/library/bg/2/14/
> "…one must learn to tolerate them without being disturbed."   ← short direct quotation (BBT)
Context: Krsna's first teaching to the grieving Arjuna, after 2.13 (the soul changes bodies).
Teaching: happiness and distress come and go like seasons; tolerance is a skill, not indifference.
Purport point: (summary in my words, with the purport's key sentence quoted if needed)
Application (preacher's): …   ← always labelled as application
```

- **Direct quotation** goes in quotation marks, kept short. BBT texts are copyrighted: a translation or a
  sentence or two of purport per reference.
- **Paraphrase** carries no quotation marks and keeps the reference.
- **Application** is always labelled "Application (preacher's)". It never sits in the "Teaching" line.
- Lectures and letters are cited with date and place: *Lecture on SB 1.2.18, Calcutta, 26 Sep 1974*.
- SB from Canto 10 ch. 14 onward and Cantos 11–12: add *"BBT translation, completed by Srila Prabhupada's
  disciples"* until the printed preface is checked (see the source inventory).

### 4.4 External resources

Required for each external resource:
- title, authors/institution, year, venue, DOI or URL
- type, why it is relevant, what the preacher should learn from it
- whether it supports a **general educational claim** or touches the subject itself

The page states the limit of the evidence (e.g. "self-reported habit data, 96 volunteers"). Research
illustrates human behaviour; it never "proves" a theological conclusion. No links are added for
decoration; most topics will have none.

### 4.5 Review workflow per topic

`drafted` → `sources-checked` (automation + editor) → `senior-review` (an IYF senior devotee, required
for sensitive topics, recommended for all) → `approved`. The content register (Stage 4) tracks each topic's
draft, verification, editorial and HTML status separately. A file existing never means "complete".

## 5. Content data schema

Content stays in plain files so it can feed HTML now, PDF later, and Hindi eventually.

| File | Holds |
|---|---|
| `data/curriculum.json` | Generated from the live site: batches (code, site id, name, order, topic count), numbering gaps, and every topic with stable `id` (`<batch>-<nn>`, e.g. `dps-15`), `sourceId` (the site's UUID), `title`, `rawTitle`, `kind` (`topic` / `group-header`), `group`, `alsoIn`, `materials`, `status: existing` |
| `data/levels.json` (Stage 4) | The level profiles of §2.1 as data, for batch pages |
| `data/sources.json` (Stage 4) | One record per source: `id`, title, author/translator, edition, language, route/URL, `access` (full-searchable, full, listed, partial, missing), relevance |
| `data/proposed.json` (Stage 4) | Proposed topics (§7) with `status: proposed` and `approved: false` |
| `content/topics/<id>.md` | One topic: front matter + sections A–Q |
| `research/verification/<id>.json` | Output of `verify-refs`: per reference, URL, status, saved translation, purport start, date checked |

Topic front matter:

```yaml
---
id: dps-15                   # stable; equals the curriculum id; proposed topics use p-<batch>-<slug>
title: …                     # as on the site (clean form)
batch: dps
status: existing             # existing | proposed
type: philosophy             # §3 topic types
alsoIn: []                   # related ids in other batches
prerequisites: [dps-12, dps-13, dps-14]
next: [dps-16]
duration: 45                 # minutes
prep: 120                    # minutes of preparation
difficulty: advanced         # introductory | intermediate | advanced
review: drafted              # drafted | sources-checked | senior-review | approved
sensitive: false
lang: en
references:                  # every scripture citation used on the page; verify-refs reads this list
  - CC Madhya 23.14-15
  - SB 1.2.18
---
```

Section headings are fixed (`## A. Topic overview` … `## Q. Preacher's self-review checklist`), so a build
script can split a page into parts without guessing.

## 6. HTML information architecture (built in Stage 5)

**Form:** a static site generated by one small Node script (`tools/build-site.mjs`) from the files above.
- No framework, no external scripts, no build chain to maintain.
- Opens from the folder (`file://`) and works offline. The search index ships as a JS file, not fetched
  JSON, so it works without a server.
- Nothing is hosted until the head says so.

| Page | Contents |
|---|---|
| **Home** (`index.html`) | IYFD identity; one-paragraph introduction; batch cards with topic counts and readiness (e.g. "DPS · 57 topics · 2 ready"); search box; filters (batch, subject area, topic type, difficulty, review status, existing/proposed); a separate, clearly labelled **Proposed additions** card |
| **Batch page** (`batches/<code>.html`) | Purpose, audience background, methodology (§2.1 row), developmental goals; topic list in site order with status badges; links to the previous and next batch; for SPS/DPS, the repeated-topic map |
| **Topic page** (`topics/<id>.html`) | Summary strip (batch, duration, difficulty, review status, sensitive flag); sections A–Q as collapsible blocks (C, D, G open by default); reference list with status chips linking to vedabase; prerequisites, next and "same topic in other batches" links; previous/next **only where the site's order is a real sequence** (DPS stages, BIKC chapters, DYS) |
| **Scripture index** (`references.html`) | Every cited verse → the topics that use it, with status |
| **Sources** (`sources.html`) | The source inventory, with access status |
| **Proposed additions** (`proposed.html`) | Every proposed topic, each headed **"Proposed — Not Yet Part of the Existing IYFD Catalogue"** |
| **Method** (`method.html`) | How to use the library, the status labels, the review process |

**Search:** client-side over titles, central messages, outcomes, references (normalised so "SB 1.2.18",
"Bhag. 1.2.18" and "SB 1-2-18" match) and section text, with ranked results and a batch filter. Built by the
same script.

**Design:** restrained educational style rather than promotional.
- One serif for reading and one sans for interface.
- Saffron as the single accent; light and dark themes; WCAG AA contrast.
- 16 px minimum body text on phones; no horizontal scrolling at 320 px.
- Tested at 320, 768, 1024 and 1440 px.

**Print:** `@media print` styles.
- Each topic page prints on its own with a header (IYFD · batch · topic), page numbers, the review status
  on the first page, expanded sections, and URLs printed after links.
- `batches/<code>-print.html` gathers a whole batch with a cover and table of contents for later PDF work.
- **No PDFs are generated until the HTML content is approved.**

**Diagrams:** inline SVG, so they stay sharp in print and need no image files.

## 7. Proposed additions

> Everything in this section is **Proposed — Not Yet Part of the Existing IYFD Catalogue**. Nothing here has
> been approved by IYF leadership. Every verse listed was checked to exist; how each verse is used is a
> proposal for IYF educators to judge.

### 7.1 Proposed topics by category

| # | Category | Proposed title | Batch | Why | Outcomes (short) | Scriptural foundation | Relation to existing | Priority |
|---|---|---|---|---|---|---|---|---|
| 1 | Foundational | The three modes of nature in daily life | VL3 | No topic covers the gunas, yet food, sleep, association and mood all depend on them | Name the three modes; recognise them in one's own day; link to sadhana choices | BG 14.5; BG 17.8 | Supports VL3-01, VL3-02, VL1 lifestyle talks | Essential |
| 2 | Foundational | Karma: what it explains and what it does not | VL2 | VL1-06 raises karma; no topic treats it properly | Explain action and reaction; admit its intricacy; avoid fatalism and victim-blaming | BG 4.17; BG 3.27 | Follows VL1-06; precedes VL2-01 | Essential |
| 3 | Foundational | Why accept a spiritual master? | SPS | VL2-07 identifies ISKCON; nothing prepares for guru-tattva before DPS | Explain the need for a guru from scripture; qualities of a bona fide guru; what discipleship asks | BG 4.34; SB 11.3.21 | Bridges VL2-07 and DPS-03, DPS-41 | Essential |
| 4 | Progression | Chanting without offences: a first introduction | VL3 or SPS | Offences are taught only at DPS-06, long after chanting begins | State why offences matter; know the list exists; one practical safeguard | CC Adi 8.24 | vl3-04 → sps-13 → dps-06 | Essential |
| 5 | Progression | Who is Sri Caitanya Mahaprabhu? | VL3 | His identity and mission arrive only at sps-23/24 | Know who He is and why the holy name is central for this age | SB 11.5.32 | Before sps-23/24 | Optional |
| 6 | Advanced | Sambandha, abhidheya, prayojana | DPS / advanced | The map of Mahaprabhu's teaching is absent | Explain the three terms; locate every practice within them | CC Madhya 20.124; CC Madhya 20.108 | Frames DPS-12…18 | Essential (advanced) |
| 7 | Advanced | Grace and endeavour | DPS / advanced | A common confusion among sincere devotees | Hold both truths without contradiction | BG 10.10; CC Madhya 19.151 | DPS-15/16 | Essential (advanced) |
| 8 | Advanced | Knowledge, realisation and the danger of spiritual pride | DPS / advanced | Brief asks for it; not covered | Tell information from realisation; recognise pride and imitation | SB 11.2.42; CC Antya 20.21; CC Madhya 22.157 | sps-15 (sahajiyaism) | Essential (advanced) |
| 9 | Contemporary | Attention, phones and sadhana | VL3 / SPS | VL1 covers technology generally; nothing applies it to japa and hearing | Name one's distraction pattern; one technique to bring the mind back | BG 6.26; BG 6.34; BG 6.35 | VL1-39, VL3-04, VL3-06 | Essential |
| 10 | Contemporary | When the mind is unwell: devotion and professional help | SPS / DPS | Depression is a VL1 topic but there is no guidance for devotees, or for preachers on when to refer | Know warning signs; know that professional help fits spiritual life; know the facilitator's role | BG 6.5; BG 6.16–17 (balance); the rest is pastoral guidance, labelled | VL1-19, VL1-33; sensitive protocol | Essential |
| 11 | Contemporary | Career, ambition and integrity | SPS / DPS | VL1-43 introduces it; no later treatment for working devotees | Offer work as sacrifice; set an honest limit; ethical decision steps | BG 3.8; BG 3.9; BG 18.46 | VL1-43 → DPS | Essential |
| 12 | Contemporary | Emotional maturity before choosing an ashrama | DPS | DPS-56 asks for a choice; nothing prepares the emotional side | Self-awareness, speech, honesty with guides | BG 6.5; BG 17.15; NOI 4 | DPS-04, DPS-56 | Essential |
| 13 | Sustained practice | Coming back after a lapse | SPS | Inconsistency is the brief's first SPS concern; no topic addresses return without shame | Know the scriptural assurance; plan the return; involve a guide | BG 6.40; BG 9.30–31; SB 1.5.17 | DPS-01 steadiness; pilot DPS-15 | Essential |
| 14 | Leadership | Serving as a leader | DPS | Devotees lead groups early; humility topics exist but leadership does not | Lead by example; sense control as qualification; service, not status | BG 3.21; NOI 1 | DPS-11, DPS-21, DPS-25 | Optional |
| 15 | Emerging (review yearly) | Online lectures, AI tools and authentic hearing | SPS | Most hearing is now online; new tools raise questions of source and authority | Choose authorised sources; hear in the right mood | BG 4.34; SB 3.25.25 | sps-11, vl3-06 | Optional |

### 7.2 BVS

No BVS syllabus is proposed. By decision (28 Oct 2026), BVS is left out until IYF adds topics.

## 8. The two pilots: what they test

| Pilot | Why chosen | What to check when reviewing |
|---|---|---|
| [**VL1-06** Why do bad things happen to good people](../content/topics/vl1-06.md) | The hardest VL1 kind of topic. It must attract without assuming faith, be honest about a real philosophical problem, and stay safe for a listener who is grieving | Does it avoid glib karma answers and victim-blaming? Is the scripture light but exact? Would a VL1 preacher feel ready? |
| [**DPS-15** Sraddha to Prema 4: Nistha](../content/topics/dps-15.md) | The pure-bhakti progression; tests depth without jargon, and handling an inaccessible source (*Madhurya-kadambini*) honestly | Is it deeper than SPS steadiness talks? Does it describe nistha accurately? Is it useful for a devotee whose practice wobbles? |
