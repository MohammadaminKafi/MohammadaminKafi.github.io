# Mohammadamin Kafi — Resume Website

A static, responsive resume and portfolio built with Astro, React, HeroUI v3, TypeScript, and Tailwind CSS 4. It supports three shareable profile modes—Balanced, Job, and Academic—plus live-project pages, resume history, gallery artwork, and detailed experience and education routes.

## Run with Docker

Docker is the supported local toolchain; Node.js is not required on the host.

```bash
# Development with hot reload
docker compose up app
# http://localhost:4321

# Format, lint, type-check, validate content, unit tests, and production build
docker compose run --rm test

# Production-like Nginx preview
docker compose up preview
# http://localhost:8080

# Browser and accessibility tests against the preview
docker compose run --rm e2e
```

With Node 22.23.2 or newer, the equivalent commands are `npm ci`, `npm run dev`, `npm run check`, and `npm run test:e2e`.

## Routes

- `/` — mode-aware resume with HeroUI tabs
- `/pages/` — JSON-driven live projects
- `/gallery/` — generated aurora studies
- `/resume/` — current resume and archive
- `/jobs/[slug]/` — experience detail
- `/education/[slug]/` — education and coursework detail

Mode and section state are shareable, for example `/?mode=academic&section=teaching`. The URL takes priority over the saved preference; first-time visits use Balanced and dark mode.

## Content editing

Content lives in `src/data/` and is checked before every build. Invalid URLs, duplicate IDs or slugs, missing files, zero-byte PDFs, and an invalid current-resume count fail with a readable error.

- `personal.json` — identity, contact links, profile image, and baseline summary
- `modes.json` — mode labels, hero copy, default tab, and tab order
- `jobs-details.json` — the single source for job summaries and detail pages
- `education-details.json` — the single source for education summaries and details
- `projects.json`, `teaching.json`, and skill JSON files — resume sections
- `pages.json` — live applications shown in the header and Pages hub
- `resumes.json` — current and archived PDFs
- `gallery.json` — gallery image metadata

See [CONTENT.md](./CONTENT.md) for copy-ready examples.

## GitHub Pages

The site is statically rendered for `https://mohammadaminkafi.github.io`. Pull requests run all checks; successful pushes to `main` build and deploy through the official Astro GitHub Pages action. The lockfile is committed and CI uses `npm ci`.
