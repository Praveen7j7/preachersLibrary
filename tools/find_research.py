"""Find and verify research papers for section O (modern research), from free scholarly indexes.

  search "<query>" [n]   OpenAlex: the most-cited of the 25 most relevant papers, with authors, year, venue, DOI, citations, open-access link.
                         Falls back to Europe PMC (health, psychology) if OpenAlex is busy.
  doi <doi>              Crossref: confirm a paper exists and print its exact metadata (use before citing).

Research supports educational claims about human behaviour only; it is never proof of a theological conclusion.

Usage: python3 tools/find_research.py search "habit formation" 5
       python3 tools/find_research.py doi 10.1002/ejsp.674
"""

import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

UA = {"User-Agent": "IYF-preacher-library/1.0 (research lookup)"}


def fetch(url):
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return json.loads(r.read().decode("utf8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 3:
                wait = 35
                try:
                    wait = int(json.loads(e.read().decode("utf8")).get("retryAfter", 35)) + 2
                except Exception:
                    pass
                time.sleep(wait)
                continue
            raise
    raise RuntimeError("busy")


def openalex(q, n):
    url = ("https://api.openalex.org/works?per-page=25&search=%s&select=title,doi,publication_year,cited_by_count,"
           "authorships,primary_location,open_access" % urllib.parse.quote(q))
    # 25 most relevant, shown most-cited first: established studies before obscure ones
    for w in sorted(fetch(url)["results"], key=lambda w: -w["cited_by_count"])[:n]:
        authors = ", ".join(a["author"]["display_name"] for a in w["authorships"][:3]) + (" et al." if len(w["authorships"]) > 3 else "")
        venue = ((w.get("primary_location") or {}).get("source") or {}).get("display_name", "")
        oa = (w.get("open_access") or {}).get("oa_url") or ""
        print(f"- {w['title']} — {authors} ({w['publication_year']}), {venue}. {w.get('doi') or 'no DOI'} · cited {w['cited_by_count']}"
              + (f" · open access: {oa}" if oa else ""))


def europepmc(q, n):
    url = ("https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&pageSize=%d&query=%s"
           % (n, urllib.parse.quote(q)))
    for w in fetch(url)["resultList"]["result"]:
        print(f"- {w.get('title')} — {w.get('authorString', '')[:80]} ({w.get('pubYear')}), {w.get('journalTitle', '')}. "
              f"doi:{w.get('doi', 'none')} · cited {w.get('citedByCount', 0)}")


def crossref(doi):
    m = fetch("https://api.crossref.org/works/" + urllib.parse.quote(doi.replace("https://doi.org/", "")))["message"]
    authors = ", ".join(f"{a.get('family', '')} {a.get('given', '')[:1]}." for a in m.get("author", [])[:6])
    year = (m.get("issued", {}).get("date-parts") or [[None]])[0][0]
    print(f"VERIFIED: {authors} ({year}). {m.get('title', [''])[0]}. {(m.get('container-title') or [''])[0]} "
          f"{m.get('volume', '')}({m.get('issue', '')}):{m.get('page', '')}. doi:{m['DOI']} · type {m.get('type')}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "search":
        n = int(sys.argv[3]) if len(sys.argv) > 3 else 5
        try:
            openalex(sys.argv[2], n)
        except Exception as e:
            print(f"(OpenAlex unavailable: {e!r}; Europe PMC instead)")
            europepmc(sys.argv[2], n)
    elif cmd == "doi":
        try:
            crossref(sys.argv[2])
        except urllib.error.HTTPError as e:
            print(f"NOT FOUND in Crossref ({e.code}): do not cite until verified another way")
    else:
        print(__doc__)
