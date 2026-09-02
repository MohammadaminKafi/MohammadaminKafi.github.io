import { describe, expect, it } from "vitest";

import { hrefWithMode, resolveMode } from "./mode";

describe("mode URL behavior", () => {
  it("gives a valid URL mode priority over storage", () => {
    expect(resolveMode("?mode=academic", "job")).toBe("academic");
  });

  it("falls back to storage and then balanced", () => {
    expect(resolveMode("?mode=invalid", "job")).toBe("job");
    expect(resolveMode("", null)).toBe("balanced");
  });

  it("adds a mode without discarding existing query state", () => {
    expect(hrefWithMode("/gallery/?view=grid", "academic")).toBe(
      "/gallery/?view=grid&mode=academic",
    );
  });
});
