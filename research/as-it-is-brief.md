# "As it is" pass on BSS: brief for each helper (30 Oct 2026)

**Source pack first (head, 2 Nov 2026):** before reading any source, open research/packs/<id>.json and <id>.notes.md for your
topic (and for any page you link to). Fetch only what is not there. In research/packs/<id>.notes.md keep a "Further
sources" list: verses, purport passages, book passages, letters and stories relevant to the topic that the page does not
use, each with its exact location and the level or deeper session it would serve, so the next writer need not search again.

**The head's ruling (30 Oct 2026), verbatim:** "do as it is no softening and use BIKC and scriptures, don't speculate based on
your material understanding." Rule text: `research/writer-brief.md` "As it is, no softening". Earlier review instructions to
teach strong purport wording "as its principle only" are withdrawn.

## Read first
- `CLAUDE.md` (this folder) and `research/writer-brief.md` sections "Stories from scripture" (both rules there) and "Rules"
- Your pages, in full. BIKC text: `research/iyf-materials/iyf-drive-4/7. Brahmacarya in Krishna consciousness - Bhakti Vikasa Swami.pdf.txt`
- Every verse and purport you restore: fetch the vedabase page (https://vedabase.io/en/library/...) and copy the words exactly.

## What to do on each page
1. **Restore what was left out for tone** (the items listed for your page, and anything else of the same kind you find):
   the verse translation and the purport passages, in Srila Prabhupada's exact words, in the talk sections (E, I, J) and,
   where the page teaches that verse to students, in the handout (S1–S8) too. Add any newly used verse to `references:`.
2. **BIKC in its own words.** Where the page says BIKC's wording or claims are "not repeated", "harsh", or replaces them with
   gentler language, give BIKC's own words as short exact quotations with the chapter: "BIKC (ch. N) says: ...". BIKC is
   copyrighted: quote a sentence or two at a time, never whole passages.
3. **Remove the softening layer:** instructions such as "do not read this out", "teach the principle only", "leave out
   verses x–y", "use gentler language", and our own glosses that explain away or soften what the source says (for example
   "this is not about women", "the warning is not a verdict on anyone", "this is not an insult"), unless the purport itself
   says it. If the purport gives the reason for strong words, quote the purport's reason.
4. **Don't speculate.** Add nothing from our own material understanding. Each teaching line says only what the verse,
   purport, BIKC or the scripture says. "Application (preacher's)" stays short and follows the source.
5. **Keep the accuracy limits:** a letter, lecture or remark not found on vedabase is still not quoted as Prabhupada's words;
   non-Prabhupada translations (Sen 1920 Brahma-vaivarta Purana, Ganguli, Griffith) are labelled as such, but read as they are.
6. Keep `sensitive: true` and `review: drafted`. Don't touch crisis-line or helpline lines in this pass (separate decision).
   Don't restructure; keep the page about 400 lines (trim our own commentary, not sources, if you need room).
7. Run `node tools/verify-refs.mjs content/topics/<id>.md` (from the preacherLibrary folder) after editing; all refs must exist.
   The tool now keeps `purportExtracts`.

## Edit only
Your own pages and their `research/verification/<id>.json`. Other helpers are editing other BSS pages at the same time.

## Reply (short)
One line per page: id; what was restored (verse/purport/BIKC refs); what softening was removed; refs count after verify-refs.
