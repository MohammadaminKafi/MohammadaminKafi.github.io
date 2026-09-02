import {
  modeIds,
  sectionIds,
  type ModeId,
  type SectionId,
} from "../content/schema";

export const MODE_STORAGE_KEY = "resume-mode";
export const MODE_CHANGE_EVENT = "resume:modechange";
export const MODE_TRANSITION_COVER_MS = 360;
export const MODE_TRANSITION_REVEAL_MS = 540;

export const modeAtmospheres = {
  balanced: { theme: "light", world: "garden", themeColor: "#f4ead3" },
  job: { theme: "dark", world: "cathedral", themeColor: "#090711" },
  academic: { theme: "dark", world: "tomorrow", themeColor: "#070611" },
} as const satisfies Record<
  ModeId,
  { theme: "light" | "dark"; world: string; themeColor: string }
>;

let transitionLocked = false;

export function isModeId(value: string | null | undefined): value is ModeId {
  return modeIds.includes(value as ModeId);
}

export function isSectionId(
  value: string | null | undefined,
): value is SectionId {
  return sectionIds.includes(value as SectionId);
}

export function resolveMode(search: string, stored: string | null): ModeId {
  const requested = new URLSearchParams(search).get("mode");
  if (isModeId(requested)) return requested;
  if (isModeId(stored)) return stored;
  return "balanced";
}

export function hrefWithMode(pathname: string, mode: ModeId): string {
  const url = new URL(pathname, "https://resume.local");
  url.searchParams.set("mode", mode);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function atmosphereForMode(mode: ModeId) {
  return modeAtmospheres[mode];
}

export function applyAtmosphere(mode: ModeId): void {
  const atmosphere = atmosphereForMode(mode);
  document.documentElement.dataset.theme = atmosphere.theme;
  document.documentElement.dataset.world = atmosphere.world;
  document.documentElement.classList.toggle(
    "dark",
    atmosphere.theme === "dark",
  );
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", atmosphere.themeColor);
}

export function applyMode(
  mode: ModeId,
  section?: SectionId,
  historyMode: "push" | "replace" = "push",
): void {
  document.documentElement.dataset.mode = mode;
  applyAtmosphere(mode);
  localStorage.setItem(MODE_STORAGE_KEY, mode);

  const url = new URL(window.location.href);
  url.searchParams.set("mode", mode);
  if (section) url.searchParams.set("section", section);
  window.history[`${historyMode}State`]({}, "", url);
  window.dispatchEvent(
    new CustomEvent(MODE_CHANGE_EVENT, { detail: { mode, section } }),
  );
}

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export async function transitionToMode(
  mode: ModeId,
  section?: SectionId,
  historyMode: "push" | "replace" = "push",
): Promise<boolean> {
  if (transitionLocked) return false;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion || document.documentElement.dataset.mode === mode) {
    applyMode(mode, section, historyMode);
    return true;
  }

  transitionLocked = true;
  const root = document.documentElement;
  root.dataset.transitionTo = mode;
  root.dataset.transitioning = "true";
  root.setAttribute("aria-busy", "true");

  try {
    await wait(MODE_TRANSITION_COVER_MS);
    applyMode(mode, section, historyMode);
    await wait(MODE_TRANSITION_REVEAL_MS);
    const liveRegion = document.getElementById("mode-announcer");
    if (liveRegion) liveRegion.textContent = `${mode} design active`;
    return true;
  } finally {
    delete root.dataset.transitioning;
    delete root.dataset.transitionTo;
    root.removeAttribute("aria-busy");
    transitionLocked = false;
  }
}
