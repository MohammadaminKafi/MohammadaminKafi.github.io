import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

import awards from "../data/awards.json";
import education from "../data/education-details.json";
import experiences from "../data/jobs-details.json";
import gallery from "../data/gallery.json";
import hardSkills from "../data/skills-hard.json";
import languages from "../data/languages.json";
import modes from "../data/modes.json";
import pages from "../data/pages.json";
import personal from "../data/personal.json";
import programmingLanguages from "../data/skills-languages.json";
import projects from "../data/projects.json";
import research from "../data/research.json";
import resumes from "../data/resumes.json";
import softSkills from "../data/skills-soft.json";
import teaching from "../data/teaching.json";
import { ContentSchema, type SiteContent } from "./schema";

export const rawContent = {
  personal,
  modes: modes.items,
  experiences: experiences.items,
  education,
  projects: projects.items,
  teaching: teaching.items,
  pages: pages.items,
  resumes: resumes.items,
  gallery: gallery.items,
  softSkills,
  hardSkills,
  programmingLanguages,
  languages,
  awards,
  research,
};

function assertUnique(values: string[], label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function assertAsset(
  publicDir: string,
  assetPath: string,
  label: string,
): void {
  const diskPath = join(publicDir, assetPath.replace(/^\//, ""));
  if (!existsSync(diskPath))
    throw new Error(`${label} does not exist: ${assetPath}`);
  if (statSync(diskPath).size === 0)
    throw new Error(`${label} is empty: ${assetPath}`);
}

export function validateRawContent(
  input: unknown,
  publicDir = join(process.cwd(), "public"),
): SiteContent {
  const parsed = ContentSchema.parse(input);

  assertUnique(
    parsed.modes.map((item) => item.id),
    "mode id",
  );
  assertUnique(
    parsed.experiences.map((item) => item.id),
    "experience id",
  );
  assertUnique(
    parsed.experiences.map((item) => item.slug),
    "experience slug",
  );
  assertUnique(
    parsed.education.map((item) => item.id),
    "education id",
  );
  assertUnique(
    parsed.education.map((item) => item.slug),
    "education slug",
  );
  assertUnique(
    parsed.pages.map((item) => item.id),
    "page id",
  );
  assertUnique(
    parsed.resumes.map((item) => item.id),
    "resume id",
  );
  assertUnique(
    parsed.gallery.map((item) => item.id),
    "gallery id",
  );

  for (const mode of parsed.modes) {
    if (!mode.sections.includes(mode.defaultSection)) {
      throw new Error(
        `Mode ${mode.id} default section is not included in its sections`,
      );
    }
  }

  if (parsed.resumes.filter((item) => item.current).length !== 1) {
    throw new Error("Exactly one resume must be marked current");
  }

  assertAsset(publicDir, parsed.personal.photo, "Profile photo");
  for (const resume of parsed.resumes)
    assertAsset(publicDir, resume.file, `Resume ${resume.id}`);
  for (const image of parsed.gallery)
    assertAsset(publicDir, image.src, `Gallery image ${image.id}`);

  return parsed;
}

export function validateContent(
  publicDir = join(process.cwd(), "public"),
): SiteContent {
  return validateRawContent(rawContent, publicDir);
}

export const content = validateContent();
