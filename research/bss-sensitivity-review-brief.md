# BSS sensitivity review: brief for each reviewer (29 Oct 2026)

> **SUPERSEDED in part (head, 30 Oct 2026):** item 1's "harsh purport wording is taught as its principle" is withdrawn.
> Rule now: research/writer-brief.md "As it is, no softening".

Step (2) of the order agreed with the head (BUILD_PLAN.md, "Order agreed with the head"): a focused review of every
`sensitive: true` BSS page before the head's own review. Fix in place; do not rewrite. The page stays `review: drafted`.

## Read first
- `CLAUDE.md` (this folder)
- `research/writer-brief.md`: "Plain, clear English", "Every story, verse and example used in a Krishna conscious way",
  "Global, professional standard", "Rules"
- `research/head-review-list.md` §5: questions already put to the head. Do not decide them; do not ask them again.
- BUILD_PLAN.md lines on sensitive pages: frank about the dangers, practical about protection, women always spoken of with
  respect (the point is guarding celibacy, never blame), no shame language, help-seeking guidance.

## Check each page for
1. **Respect.** No blame, contempt or sweeping statements about women (or men, or any group, orientation or nation).
   Purport wording that is harsh is taught as its principle, not quoted harshly. Scripture characters are not mocked.
2. **No shame language.** A fall is described as something to be honest about and recover from with a senior's help and
   chanting, never as worthlessness. No fear tactics; no physical or medical claims without a cited source
   (a claim from BIKC is "BIKC says", not fact; a research paper must pass `python3 tools/find_research.py doi <doi>`).
3. **Help-seeking and safeguarding.** Where the page touches distress, compulsive habits, abuse, self-harm or children:
   it names a trusted senior, a trained counsellor or doctor, Tele-MANAS 14416 (India) plus "your local crisis service".
   Any child or abuse matter says it is reported to the temple authority / child-protection contact, never kept private.
   Group sessions never invite private disclosure; private matters go to one senior, privately.
4. **Audience notes.** Section A states the audience (adult men in brahmacari training, or wider) and any limit already
   decided by the writer (e.g. bss-41 not for mixed-age groups). Part 2 (S1–S8, the student handout) must be safe to hand
   out on its own: no explicit detail, nothing that would embarrass a student reading it alone.
5. **Accuracy on the sensitive claims.** Every sensitive claim is supported by the translation or purport saved in
   `research/verification/<id>.json` (fetch the vedabase page to read the full purport when the claim rests on it).
   Your own reading is "Application (preacher's)". Unsupported → soften to what the source says, or drop the reference
   and re-run `node tools/verify-refs.mjs content/topics/<id>.md`. Non-Prabhupada narrative sources (Brahma-vaivarta
   Purana Sen 1920, Ganguli, Griffith) are labelled as such, narrative only, sexual detail left out.
6. **Krishna conscious and plain.** The answer to every problem leads to chanting, hearing, service and Krishna; sentences
   are plain, full and understood at first reading.

## Do not
- Rewrite sections that pass, change structure, or lengthen the page (keep ~400 lines or less).
- Fix the batch overlaps (Rsyasrnga on bss-31/bss-51; Narada's childhood on bss-33/39/44): that is the next step.
- Edit any file other than your own pages and their `research/verification/<id>.json`.
- Invent verses, quotations, purport statements, stories, letters, dates, helplines or papers.

## Reply (short)
One line per page: id; verdict (passed / fixed); what you changed (a few words each); anything for the head that is NOT
already in head-review-list §5. Then the total number of edits.
