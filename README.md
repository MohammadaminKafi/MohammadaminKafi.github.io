# Mohammadamin Kafi — Resume Website

A modern, interactive resume built with **Astro**, **React**, and **Tailwind CSS**.  
Features inline pages, dark/light theme toggle, timelines, skill trees, search & filter, and JSON-driven data for easy updates.

🚀 **Live Site**: [https://mohammadaminkafi.github.io](https://mohammadaminkafi.github.io)

---

## ✨ Features

- **Personalized Hero** section with photo, name, title, and contact links
- **Dark/Light Theme** toggle (dark by default)
- **Gallery** page with Home/Gallery switch
- **Aurora Background** effect in both themes
- **Professional Summary** with quick resume download
- **Inline Pages**:
  - Education (timeline)
  - Job Experience (timeline)
  - Teaching Experience (assistants & instructors, searchable & filterable)
  - Projects (searchable & filterable by tags)
  - Skills (soft, hard, programming languages, multi-level dropdowns)
  - Languages (proficiency bars)
  - Awards & Achievements
  - Research Interests
- Data stored in separate `.json` files for easy editing
- Fully responsive design

---

## 📂 Project Structure

```

.
├── public/               # Static assets (images, resume.pdf)
├── src/
│   ├── components/       # React & Astro UI components
│   ├── data/             # JSON files for each resume section
│   ├── layouts/          # Base layout files
│   ├── pages/            # Main & gallery pages
│   └── styles/           # Global styles
├── astro.config.mjs      # Astro configuration
├── docker-compose.yml    # Local dev with Docker
├── Dockerfile            # Container setup
├── tailwind.config.cjs   # Tailwind config
└── README.md

````

---

## 🛠 Local Development

### **Option 1: Node.js**
```bash
npm install
npm run dev
````

Site will be available at:
[http://localhost:4321](http://localhost:4321)

---

### **Option 2: Docker**

```bash
docker compose up --build
```

Visit: [http://localhost:4321](http://localhost:4321)

---

## 🚢 Deployment to GitHub Pages

1. Create a public repository named:

   ```
   mohammadaminkafi.github.io
   ```
2. Commit and push your project:

   ```bash
   git init
   git branch -M main
   git remote add origin git@github.com:mohammadaminkafi/mohammadaminkafi.github.io.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```
3. Add `.github/workflows/deploy.yml` (GitHub Actions workflow) to build & deploy Astro site.
4. In **Settings → Pages**, set source to **GitHub Actions**.
5. Push to `main`. Your site will be live at:
   **[https://mohammadaminkafi.github.io](https://mohammadaminkafi.github.io)**

---

## 🗂 Editing Content

All main content is in `src/data/`:

* `personal.json` — Name, title, summary, contact info
* `education.json` — Timeline of degrees
* `jobs.json` — Work experience
* `teaching.json` — Assistantships & instructing experience
* `projects.json` — Projects with tags & filters
* `skills-soft.json`, `skills-hard.json`, `skills-languages.json` — Skills & proficiency
* `languages.json` — Language proficiency
* `awards.json` — Awards & achievements
* `research.json` — Research interests

Update the JSON, restart the dev server, and changes will appear.
