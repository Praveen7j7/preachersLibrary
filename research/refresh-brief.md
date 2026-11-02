# Refresh brief: adding new resources to pages already written

**Source pack first (head, 2 Nov 2026):** before reading any source, open research/packs/<id>.json and <id>.notes.md for your
topic (and for any page you link to). Fetch only what is not there. In research/packs/<id>.notes.md keep a "Further
sources" list: verses, purport passages, book passages, letters and stories relevant to the topic that the page does not
use, each with its exact location and the level or deeper session it would serve, so the next writer need not search again.

The head (28 Oct 2026): when new resources arrive, add them to pages already built. **No rewrite.**

Work in `/Users/maclapctp409/Downloads/files/hpStuff/prompt/preacherLibrary/` (cd there). Read `CLAUDE.md` and
`research/writer-brief.md` (sources and rules).

## For each page you are given (`content/topics/<id>.md`)
1. Open `research/sources-map.md` at that id. It lists IYF notes, IYF presentations, the Preaching Encyclopedia, IYF
   lectures, VOICE/radheshyamdas.com, Chaitanya Charan, Keshava Swami's *Tattva*, and Desire Tree. Also check:
   - books newly available in `research/books/` (e.g. *Madhurya-kadambini*, *Caitanya-bhagavata*, *Bhakti-ratnakara*)
   - `research/iyf-materials/iyf-drive-4/`, which holds the head's new folder of books and level material
2. Note which of these the page does **not** use yet. Open only the relevant ones (≤ ~20,000 characters per page) and
   decide whether they genuinely improve the page.
3. **Add, don't rewrite.** Allowed additions:
   - **J:** a story or illustration that the new source documents, cited.
   - **K:** a better answer, if a new source has one.
   - **O:** supporting resources (IYF deck or Encyclopedia page, Chaitanya Charan article, Keshava Swami realization,
     attributed).
   - **S8:** an IYF lecture or deck to "hear next".
   - **E or F:** an acharya's book passage (e.g. *Madhurya-kadambini*, *Bhakti-ratnakara*), cited with its edition.
   - A previous "Requires source review" item that a new source now settles: fix it and say which source.
   - **O, research where it genuinely applies** (behaviour, mind, emotions, habits, health, learning, relationships):
     find with `python3 tools/find_research.py search "<topic>"`; cite only papers that pass
     `python3 tools/find_research.py doi <doi>`. State the limits, and present research as illustrating human
     behaviour, never as proof of theology. Skip it where no solid study fits.
   Keep every existing verified line. Part 2 changes only if Part 1 changed in a way students need.
4. **Scripture references.** If you add or change one, list it under `references:`, run
   `node tools/verify-refs.mjs content/topics/<id>.md`, match quotations exactly, and **set `review: drafted`** so the
   page is reviewed again. If you added only supporting links, IYF material or attributed realizations, keep the review
   status as it is.
5. **No change needed?** Then don't touch the file.

Write only the pages you were given and their `research/verification/<id>.json`.

**Reply (≤ 1 line per page):** what you added, or "no change".
