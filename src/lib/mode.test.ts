import { afterEach, describe, expect, it, vi } from "vitest";

import {
  applyAtmosphere,
  atmosphereForMode,
  hrefWithMode,
  MODE_TRANSITION_COVER_MS,
  MODE_TRANSITION_REVEAL_MS,
  resolveMode,
  transitionToMode,
} from "./mode";

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.removeAttribute("data-transitioning");
  document.documentElement.removeAttribute("data-transition-to");
  document.documentElement.removeAttribute("aria-busy");
});

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

describe("fixed artistic atmospheres", () => {
  it("maps every mode to its own world and light model", () => {
    expect(atmosphereForMode("balanced")).toEqual({
      theme: "light",
      world: "garden",
      themeColor: "#f4ead3",
    });
    expect(atmosphereForMode("job").world).toBe("cathedral");
    expect(atmosphereForMode("job").theme).toBe("dark");
    expect(atmosphereForMode("academic").world).toBe("tomorrow");
    expect(atmosphereForMode("academic").theme).toBe("dark");
  });

  it("applies the atmosphere and document theme color together", () => {
    document.head.innerHTML = '<meta name="theme-color" content="#000000">';
    applyAtmosphere("academic");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.world).toBe("tomorrow");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#070611",
    );
  });
});

describe("mode scene transition", () => {
  it("locks repeated activation and changes the world at the midpoint", async () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
    window.history.replaceState({}, "", "/?mode=balanced");
    document.documentElement.dataset.mode = "balanced";
    document.body.innerHTML = '<p id="mode-announcer"></p>';

    const transition = transitionToMode("job", "experience");
    const repeated = transitionToMode("academic", "education");
    expect(await repeated).toBe(false);
    expect(document.documentElement.dataset.transitionTo).toBe("job");
    expect(document.documentElement.dataset.mode).toBe("balanced");

    await vi.advanceTimersByTimeAsync(MODE_TRANSITION_COVER_MS);
    expect(document.documentElement.dataset.mode).toBe("job");
    expect(document.documentElement.dataset.world).toBe("cathedral");

    await vi.advanceTimersByTimeAsync(MODE_TRANSITION_REVEAL_MS);
    expect(await transition).toBe(true);
    expect(document.documentElement).not.toHaveAttribute("aria-busy");
    expect(document.getElementById("mode-announcer")).toHaveTextContent(
      "job design active",
    );
  });

  it("bypasses the scene when reduced motion is requested", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    document.documentElement.dataset.mode = "balanced";
    expect(await transitionToMode("academic", "education", "replace")).toBe(
      true,
    );
    expect(document.documentElement.dataset.mode).toBe("academic");
    expect(document.documentElement.dataset.transitioning).toBeUndefined();
  });
});
