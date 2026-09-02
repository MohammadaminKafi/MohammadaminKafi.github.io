import {
  modeIds,
  sectionIds,
  type ModeId,
  type SectionId,
} from "../content/schema";

export const MODE_STORAGE_KEY = "resume-mode";
export const THEME_STORAGE_KEY = "resume-theme";
export const MODE_CHANGE_EVENT = "resume:modechange";

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

export function applyMode(
  mode: ModeId,
  section?: SectionId,
  historyMode: "push" | "replace" = "push",
): void {
  document.documentElement.dataset.mode = mode;
  localStorage.setItem(MODE_STORAGE_KEY, mode);

  const url = new URL(window.location.href);
  url.searchParams.set("mode", mode);
  if (section) url.searchParams.set("section", section);
  window.history[`${historyMode}State`]({}, "", url);
  window.dispatchEvent(
    new CustomEvent(MODE_CHANGE_EVENT, { detail: { mode, section } }),
  );
}

export function applyTheme(theme: "dark" | "light"): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#07110d" : "#f2f7f4");
}
