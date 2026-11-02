# Plain-English and Krishna-conscious pass: brief for each helper (29 Oct 2026)

**Source pack first (head, 2 Nov 2026):** before reading any source, open research/packs/<id>.json and <id>.notes.md for your
topic (and for any page you link to). Fetch only what is not there. In research/packs/<id>.notes.md keep a "Further
sources" list: verses, purport passages, book passages, letters and stories relevant to the topic that the page does not
use, each with its exact location and the level or deeper session it would serve, so the next writer need not search again.

The head (29 Oct): "things should be clear and understandable… for all already written as well, I shouldn't see any
such things vague." You fix existing pages in `content/topics/` in place. Work in
`/Users/maclapctp409/Downloads/files/hpStuff/prompt/preacherLibrary/` (absolute paths).

Read first: `research/writer-brief.md` sections **"Plain, clear English"** (with its bad/good example) and **"Every
story, verse and example used in a Krishna conscious way"**. Then, for each page you are given:

1. **Read the whole page**, Part 1 (A–R) and Part 2 (S1–S8). Part 2 and the B, H, K, M sections are read by students
   and new preachers, so be strictest there.
2. **Rewrite every unclear sentence in place** (Edit tool; never rewrite the whole file):
   - clipped, slogan-like or poetic fragments ("First move: ask.", "Play fully without owning the fruit.", "Decide.")
     → full everyday sentences;
   - vague instructions → exact steps: who (a senior devotee, your mentor), what (which verse or chapter), how long,
     when, and an example;
   - unexplained images or metaphors ("a losing streak is only a season", "Kurukshetra every day") → say plainly
     what they mean, or drop them;
   - fill-in-the-blank lines whose answer the reader must guess → a complete sentence;
   - jargon and Sanskrit, Hindi or IYF terms not explained at first use on the page → explain them.
   Keep the meaning, the teaching and the length roughly the same: clearer, not longer. Section headings, labels
   ("Application (preacher's)", "Requires source review" …) and table structure stay.
3. **Krishna-conscious check:** every story, example, illustration, activity and closing action ends in the Krishna
   conscious point it serves (chanting, hearing, association, service, remembering Krishna). Fix any that end in plain
   self-help, motivation or moral advice. If a teaching line claims more than its verse or purport says, soften it to
   what the verse says or label it "Application (preacher's)".
3b. **History as it is (head, 30 Oct):** every story is told exactly as the verses tell it (check against
   `research/verification/<id>.json`): restore anything left out or softened; remove any detail the verses do not give.
3e. **Questions climb the ladder (head, 30 Oct):** re-pitch H, K, M, S5, S6, S7 to the batch's rung (writer-brief.md):
   higher batches → realization, application, challenges, daily reflection; keep answers sourced from the page.
3d. **As it is, no softening (head, 30 Oct):** restore any verse, purport or BIKC wording left out or softened for tone;
   remove our own softening glosses (writer-brief.md "As it is, no softening").
3c. **Spiritual dimension > material needs (head, 30 Oct):** if a page sets research against a purport's measure as an
   equal standard, rewrite so the purport's measure leads and research is background only.
4. **Don't change** verse references, quotations (they must keep matching `research/verification/<id>.json`),
   front matter, or links. If a quotation itself is the unclear part, add a plain explanation after it.
5. Run `node tools/verify-refs.mjs content/topics/<id>.md` at the end of each page: all refs must still be found.

Write only your own pages. Don't run register or build-site; don't edit BUILD_PLAN.md or other files.

**Reply (≤ 12 lines):** per page: number of sentences rewritten (roughly), Krishna-conscious fixes, anything you could
not fix and why.
