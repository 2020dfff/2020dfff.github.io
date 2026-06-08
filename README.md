# Yang Fei (费扬) — Personal Website

Source for my academic homepage:
[2020dfff.github.io](https://2020dfff.github.io/) · [comp.nus.edu.sg/~yfei11](https://www.comp.nus.edu.sg/~yfei11/)

Built with Next.js (App Router, static export), TypeScript, and Tailwind CSS.
Content is data-driven — everything lives in `content/` as TOML, Markdown, and
BibTeX, so updates don't require touching the code.

## Develop

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

## Deploy

- **GitHub Pages** — pushing to `main` builds and publishes via `.github/workflows/deploy.yml`.
- **NUS (`~yfei11`)** — `./deploy_nus.sh` builds with the `/~yfei11` base path and uploads to `public_html`.

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

<sub>Built on the [PRISM](https://github.com/xyjoey/PRISM) website template (MIT).</sub>
