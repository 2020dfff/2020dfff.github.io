# Yang Fei (费扬) — Personal Website

Source for my academic homepage, live at
[2020dfff.github.io](https://2020dfff.github.io/) and
[comp.nus.edu.sg/~yfei11](https://www.comp.nus.edu.sg/~yfei11/).

Built with Next.js (App Router, static export), TypeScript, and Tailwind CSS.
The content is data-driven — pages, publications, and news live in `content/`
as TOML, Markdown, and BibTeX, so updates rarely need any code changes.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```

Requires Node.js 18+.

## Content (`content/`)

- `config.toml` — site title, author info, social links, navigation
- `about.toml`, `research.toml`, `internships.toml`, `projects.toml`, `education.toml`, `misc.toml` — page sections
- `publications.bib` — publications (search + filter); the `selected`, `preview`, and `badge` keys control display
- `news.toml`, `footprints.toml` — homepage news and the Atlas footprints map
- `bio.md`, `cv.md`, `misc.md` — Markdown bodies

## Structure

```
content/         site content (TOML, Markdown, BibTeX)
public/          static assets (images, papers, CV)
src/app/         Next.js App Router pages
src/components/  React components
src/lib/         parsers, config loaders, utilities
src/types/       TypeScript definitions
```

---

<sub>Built on the [PRISM](https://github.com/xyjoey/PRISM) template (MIT).</sub>
