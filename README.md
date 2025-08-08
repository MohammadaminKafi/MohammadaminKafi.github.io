# Mohammadamin Kafi — Resume Site (Astro + Tailwind + React)

This is an **Astro + Tailwind + React islands** resume/site that loads content from JSON files and supports inline pages, timelines, search/filter, dark mode, and a gallery.

---

## 1) Prerequisites
- **Option A (no Docker):** Install Node.js (LTS recommended).
- **Option B (Docker, recommended for easy local run):** Install Docker Desktop or Docker Engine + docker compose.

---

## 2) Run Locally

### A) Using Node (classic)
```bash
npm install
npm run dev
# open http://localhost:4321
```

### B) Using Docker (hot reload)
```bash
# First time or after changes to dependencies
docker compose up --build web
# open http://localhost:4321
```
- Your working directory is mounted into the container, so edits trigger live reload.
- If port 4321 is busy, change it in `astro.config.mjs` and in `docker-compose.yml`.

### C) Production-like static server (Docker)
Build and serve the optimized static site with Nginx:
```bash
docker compose up --build prod
# open http://localhost:8080
```

> CLI alternative (without compose):
```bash
# Dev
docker build -t astro-resume:dev --target dev .
docker run --rm -it -p 4321:4321 -v "$PWD":/app -v /app/node_modules astro-resume:dev

# Prod
docker build -t astro-resume:prod --target prod .
docker run --rm -p 8080:80 astro-resume:prod
```

---

## 3) Edit Your Content
Update the JSON files in `src/data/`:
- `personal.json` (name, emails, links, summary, photo path, resume path)
- `education.json` (timeline items)
- `jobs.json` (timeline items; details collapsed by default)
- `teaching.json` (searchable + filterable; 5 notable shown)
- `projects.json` (searchable + filterable by tag/time; 5 notable shown)
- `skills.json` (soft + nested hard skills with progress bars)
- `languages.json` (1–5 proficiency)
- `awards.json`, `research.json` (optional)
- `gallery.json` (images for the Gallery page)

Place your assets:
- Profile photo → `public/images/profile.jpg`
- Resume PDF → `public/resume.pdf`

---

## 4) Dark Mode
Dark is default. Use the top-right toggle to switch. Preference is saved in `localStorage`.

---

## 5) Build & Preview (without Docker)
```bash
npm run build
npm run preview
# open http://localhost:4321 (Astro preview will print the exact URL)
```

---

## 6) Deploy (later)
When ready for GitHub Pages or any static host, use `npm run build` to generate `dist/`. The included `prod` Docker target shows how to serve it via Nginx.
```
```bash
npm install
npm run dev
```
Now open http://localhost:4321 in your browser.

## 3) Edit Your Content
Update the JSON files in `src/data/`:
- `personal.json` (name, emails, links, summary, photo path, resume path)
- `education.json` (timeline items)
- `jobs.json` (timeline items; details are collapsed by default, click to open)
- `teaching.json` (searchable + filterable; 5 notable shown, rest toggle)
- `projects.json` (searchable + filterable by tag/time; 5 notable shown)
- `skills.json` (soft + nested hard skills with progress bars)
- `languages.json` (1–5 proficiency)
- `awards.json`, `research.json` (optional)
- `gallery.json` (images for the Gallery page)

## 4) Dark Mode
Dark is default. Use the top-right toggle to switch. Preference is saved in `localStorage`.

## 5) Build (optional)
```bash
npm run build
npm run preview
```

## 6) Deploy to GitHub Pages (later)
When you're ready, we can add a simple GitHub Action. For now, local is enough.