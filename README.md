# IYFD Preacher Preparation Library

A scripture-grounded preparation library for preachers at ISKCON Youth Forum Delhi: one page per topic in
the IYF Preachers Library catalogue (https://iyf-lectures.vercel.app/), level by level.

**Status (28 Oct 2026): build approved and running batch by batch. See [BUILD_PLAN.md](BUILD_PLAN.md) and
[research/content-register.md](research/content-register.md). Nothing is hosted or published.**

## Read first

1. [research/stage1-discovery-report.md](research/stage1-discovery-report.md): what exists, what's missing,
   and the decisions needed (§8)
2. [research/source-inventory.md](research/source-inventory.md): which books can be searched, read, or are
   missing
3. [docs/stage2-content-architecture.md](docs/stage2-content-architecture.md): level methodology (BVS vs
   BSS, the pure-bhakti track), topic template, citation rules, schema, HTML plan, proposed additions
4. Pilots: [content/topics/vl1-06.md](content/topics/vl1-06.md) (VL1) and
   [content/topics/dps-15.md](content/topics/dps-15.md) (DPS)

## Layout

```
preacherLibrary/
├── data/curriculum.json            generated catalogue: 8 batches, 229 topics, stable ids
├── research/
│   ├── stage1-discovery-report.md
│   ├── source-inventory.md
│   ├── catalogue-inventory.md      generated topic tables
│   ├── catalogue-snapshot-*.json   raw site data (evidence)
│   └── verification/*.json         reference checks with saved translations
├── docs/stage2-content-architecture.md
├── content/topics/                 one .md per topic (_template.md + pilots)
└── tools/
    ├── fetch-catalogue.mjs         re-read the live catalogue
    └── verify-refs.mjs             check every cited verse on vedabase.io
```

## Tools

```sh
node tools/fetch-catalogue.mjs                       # refresh data/curriculum.json + inventory
node tools/verify-refs.mjs content/topics/dps-15.md  # check a topic's references
node tools/verify-refs.mjs --cite "BG 2.14" "SB 1.2.18"
```

Node 18+ is needed, with no other dependencies. Both tools only read from public pages.

## Rules

- Existing topics are never renamed or replaced; proposals are labelled *Proposed — Not Yet Part of the
  Existing IYFD Catalogue*.
- No citation without a check. Statuses: Verified, Partially verified, Requires source review.
- Short quotations only from BBT and other copyrighted books.
- Local delivery only (HTML/.md/PDF) until the head approves hosting. No PDFs before the HTML content is approved.
