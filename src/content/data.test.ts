import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

import { rawContent, validateRawContent } from "./data";

function cloneContent() {
  return structuredClone(rawContent);
}

function temporaryAssets(content: ReturnType<typeof cloneContent>): string {
  const root = mkdtempSync(join(tmpdir(), "resume-content-"));
  const paths = [
    content.personal.photo,
    ...content.resumes.map((item) => item.file),
    ...content.gallery.map((item) => item.src),
  ];
  for (const asset of paths) {
    const diskPath = join(root, asset.replace(/^\//, ""));
    mkdirSync(dirname(diskPath), { recursive: true });
    writeFileSync(diskPath, "fixture");
  }
  return root;
}

describe("content validation", () => {
  it("accepts the repository content when all referenced assets exist", () => {
    expect(validateRawContent(rawContent).pages).toHaveLength(3);
  });

  it("rejects duplicate experience slugs", () => {
    const candidate = cloneContent();
    candidate.experiences[1].slug = candidate.experiences[0].slug;
    expect(() =>
      validateRawContent(candidate, temporaryAssets(candidate)),
    ).toThrow(/Duplicate experience slug/);
  });

  it("requires exactly one current resume", () => {
    const candidate = cloneContent();
    candidate.resumes[0].current = false;
    expect(() =>
      validateRawContent(candidate, temporaryAssets(candidate)),
    ).toThrow(/Exactly one resume/);
  });

  it("rejects a missing public asset", () => {
    const candidate = cloneContent();
    const root = temporaryAssets(candidate);
    candidate.personal.photo = "/images/missing-profile.jpg";
    expect(() => validateRawContent(candidate, root)).toThrow(
      /Profile photo does not exist/,
    );
  });

  it("rejects malformed live-page URLs", () => {
    const candidate = cloneContent();
    candidate.pages[0].url = "not-a-url";
    expect(() =>
      validateRawContent(candidate, temporaryAssets(candidate)),
    ).toThrow();
  });

  it("rejects an empty resume PDF", () => {
    const candidate = cloneContent();
    const root = temporaryAssets(candidate);
    const resumePath = join(root, candidate.resumes[0].file.replace(/^\//, ""));
    writeFileSync(resumePath, "");
    expect(() => validateRawContent(candidate, root)).toThrow(
      /Resume current is empty/,
    );
  });
});
