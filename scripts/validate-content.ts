import { validateContent } from "../src/content/data";

const content = validateContent();
console.log(
  `Validated ${content.experiences.length} experiences, ${content.education.length} education entries, ${content.pages.length} live pages, ${content.resumes.length} resumes, and ${content.gallery.length} gallery images.`,
);
