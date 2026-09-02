# Content editing reference

All paths below are relative to the repository root. Run `docker compose run --rm test` after editing content.

## Edit a mode

The three records in `src/data/modes.json` control hero copy, section order, and the default section. Their visual identities are intentionally fixed: Balanced uses `garden` with a light atmosphere, Job uses `cathedral` with a dark atmosphere, and Academic uses `tomorrow` with a dark atmosphere. The matching `themeColor` is used by the browser chrome during the scene change.

Changing copy or section order requires no component changes. A new artistic world does require a layout and transition implementation because modes are full experiences rather than palette presets.

## Add a live page

Append an object to `src/data/pages.json`:

```json
{
  "id": "unique-kebab-case-id",
  "title": "Project name",
  "tagline": "One concise outcome-oriented sentence.",
  "description": "A factual description of the live experience and its useful features.",
  "url": "https://example.com/",
  "sourceUrl": "https://github.com/example/project",
  "tags": ["Topic", "Technology"],
  "accent": "green"
}
```

`accent` must be `green`, `cyan`, or `violet`. The header dropdown and `/pages/` update automatically.

## Archive a resume

1. Place a non-empty PDF in `public/resumes/`.
2. Append a record to `src/data/resumes.json`:

```json
{
  "id": "2026-09",
  "label": "September 2026 resume",
  "file": "/resumes/resume-2026-09.pdf",
  "published": "2026-09-01",
  "notes": "Optional short note describing this version.",
  "current": false
}
```

Exactly one record must have `current: true`. To publish a new current resume, archive the previous record and switch the flag.

## Add gallery artwork

Place the image under `public/images/gallery/`, then append:

```json
{
  "id": "unique-image-id",
  "src": "/images/gallery/example.webp",
  "caption": "Short visible caption",
  "alt": "A concise visual description for visitors who cannot see the image",
  "width": 1536,
  "height": 1024,
  "generated": false
}
```

Use the image’s real pixel dimensions. Keep `generated: true` for AI-generated artwork.

## Add a job or education entry

- Add the complete record, including its slug and detail sections, to `jobs-details.json` or `education-details.json`.
- Do not create a second summary record: overview cards and static detail routes are generated from the same object.
- Slugs must be unique lowercase kebab case.
- Job capability data may retain the `skills-tree` section name for backwards-compatible content, but the UI intentionally renders it as flat skill groups rather than a nested tree.

## Empty sections

Awards and research sections are omitted when their `items` arrays are empty. Do not add placeholder records solely to make a section appear.
