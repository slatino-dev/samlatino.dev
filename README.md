# samlatino.dev

Personal site for Sam Latino — AI engineer. Agent systems, evals, and self-hosted LLM infrastructure — Rust + Python.

Astro 6, static output, zero client JS. Terminal-dark identity: one accent, hairline borders, Iosevka + IBM Plex Sans.

## Layout

- `src/content/projects/` — six case studies (MDX), one per open-source project
- `src/content/writing/` — long-form posts (MDX)
- `src/data/resume.json` — single source for both `/resume/` and `public/resume.pdf`
- `src/pages/*.md.ts` — plain-Markdown twins of key pages for AI crawlers (`/llms.txt` indexes them)
- `src/data/metrics/` — manifest for syncing harness-produced bench numbers (no number is hand-entered)

## Commands

```bash
npm run dev          # local dev server
npm run build        # static build to dist/
npx astro check      # type + a11y diagnostics
node scripts/check-md-twins.mjs   # verify every project/writing page has a .md twin
```

## Conventions

- No fabricated numbers. Empty bench tables render an explicit "pending" state until real runs land.
- Test counts come from each project's own suite; the home-page total is summed at build time.
- `--color-delta-bad` is reserved for regression cells in data tables. Nothing else.
