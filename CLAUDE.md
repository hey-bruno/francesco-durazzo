# Francesco Durazzo — author website

Source for francescodurazzo.com, the author site of Francesco Durazzo.

## What this site is for

- The author's public face: who Francesco Durazzo is, his books, and where to find them.
- Francesco Durazzo is a pen name. The pen name exists so a search for the author doesn't lead to Bruno's day job; it is not a secret identity. Don't mention Bruno's employer, job title or real name on the site unless he asks.
- English-first. The Portuguese page shows the book's Portuguese title and cover; the English and Italian pages show the English title and cover.
- Audience: readers first, then booksellers, publishers and press.

## Facts and content

- Never invent facts. No biography details, dates, prices, availability, quotes, reviews or award claims that Bruno hasn't written or approved.
- No placeholders, "coming soon" filler, lorem ipsum or bracketed notes on a page that goes live. If content is missing, ask Bruno in the chat instead.
- Copy comes from the approved files in `~/grandes-galerias/publicacao/` (decisions, bio, sinopse and so on). Treat `decisoes.md` there as the source of truth for names and decisions.
- Settled facts so far:
  - Author: Francesco Durazzo (pen name).
  - First book: *Agência de Detetives Grandes Galerias Ltda.*, subtitle *Livro 1: Frequência Maldita* (Brazilian Portuguese).
  - English edition: *The Grand Galleria Detective Agency, Ltd.*, subtitle *Book 1: Cursed Frequency*.
  - Publisher: Porchester Publishing, London — https://porchesterpublishing.com

## Languages

- Three language versions: English, Brazilian Portuguese and Italian. Italian is mostly symbolic for now; it is there because of the kinds of books Bruno plans to publish later.
- Default language: Brazilian Portuguese for visitors whose browser prefers Brazilian Portuguese or who are located in Brazil; English for everyone else.
- Implement the default with a small Cloudflare Pages Function at the site root (a `functions/` folder next to `site/`, not inside it), reading the browser's Accept-Language header and Cloudflare's visitor country. Static files alone can't see the visitor's country.
- A visible language switch must always override the automatic choice, and the visitor's choice should be remembered.
- Decided: browsers preferring any Portuguese (pt, pt-BR, pt-PT) get Brazilian Portuguese; the book is in Brazilian Portuguese.
- Each language has its own address: `/en/`, `/pt-br/` and `/it/` (pages in `site/en/`, `site/pt-br/`, `site/it/`). Browsers preferring Italian get `/it/`. The root `/` is handled by `functions/index.js`, which redirects in this order: the visitor's remembered choice (`lang` cookie, set by the switch), located in Brazil, browser language preference, then English. `site/index.html` is only a plain language chooser in case the function isn't running.
- Every page carries `hreflang` links to all language versions plus `x-default` pointing at `/`.
- Book status (approved by Bruno): all three versions say the book is coming soon (Coming soon / Em breve / Prossimamente). Expected sequence: first a Brazilian Portuguese edition to buy (shown on the PT page, nothing to buy on EN and IT yet), later an English edition, later still an Italian one. Each page's purchase links follow that sequence.

## Design

- Look: a photocopied zine / case-file style reflecting the book (1994–95 underground punk scene, mystery/thriller): ransom-note name, Anton + Special Elite + Courier Prime (Google Fonts), paper-grain texture. Dark only, like white toner photocopied on black: near-black `#121211`, off-white `#e8e6df`, highlighter yellow `#e8e337`, xerox red `#ff3b3b`. Don't copy the cover's own look (cream, oxblood shadows, big condensed title); the cover image sits on the page and the page should frame it, not repeat it. Shared styles live in `site/assets/style.css`. Deliberately different from the Porchester Publishing site: the two sites are not meant to look the same.
- Copy tone stays plain and understated. No marketing superlatives.
- Pages must work on a phone first (16px side margins, no horizontal scrolling).

## Tech and deploys

- Plain static HTML and CSS, no build step. Everything public lives in `site/`; Cloudflare publishes only that folder. Keep notes and instructions (like this file) outside `site/`, because anything inside it is public. Move to Astro only when the site outgrows a few pages, and ask first.
- Hosted on Cloudflare Pages, project `francesco-durazzo`, connected to this GitHub repo (`hey-bruno/francesco-durazzo`).
- Whenever `site/assets/style.css` changes, bump the version in its link on every page (`/assets/style.css?v=N`), or browsers keep showing the old stylesheet from cache.
- Pushing to `main` deploys to production. Make changes on a branch: Cloudflare publishes each branch to a preview address for review before merging.
- Pushes go out as the GitHub account `hey-bruno`, not Bruno's work account.
