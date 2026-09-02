import {
  Button,
  Description,
  Dropdown,
  Label,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { ChevronDown, ExternalLink, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { LivePage, Mode, ModeId } from "../content/schema";
import {
  applyMode,
  applyTheme,
  hrefWithMode,
  isModeId,
  MODE_CHANGE_EVENT,
  MODE_STORAGE_KEY,
  resolveMode,
  THEME_STORAGE_KEY,
} from "../lib/mode";

interface Props {
  modes: Mode[];
  pages: LivePage[];
  currentPath: string;
}

export default function SiteHeader({ modes, pages, currentPath }: Props) {
  const [mode, setMode] = useState<ModeId>("balanced");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const initialMode = resolveMode(
      window.location.search,
      localStorage.getItem(MODE_STORAGE_KEY),
    );
    const initialTheme =
      localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
    queueMicrotask(() => {
      setMode(initialMode);
      setTheme(initialTheme);
    });
    applyMode(initialMode, undefined, "replace");
    applyTheme(initialTheme);

    const onMode = (event: Event) => {
      const next = (event as CustomEvent<{ mode: ModeId }>).detail?.mode;
      if (isModeId(next)) setMode(next);
    };
    const onPopState = () => {
      const next = resolveMode(
        window.location.search,
        localStorage.getItem(MODE_STORAGE_KEY),
      );
      document.documentElement.dataset.mode = next;
      setMode(next);
      window.dispatchEvent(
        new CustomEvent(MODE_CHANGE_EVENT, { detail: { mode: next } }),
      );
    };
    window.addEventListener(MODE_CHANGE_EVENT, onMode);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener(MODE_CHANGE_EVENT, onMode);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const selected = useMemo(() => new Set([mode]), [mode]);
  const internalHref = (pathname: string) => hrefWithMode(pathname, mode);
  const currentMode = modes.find((item) => item.id === mode) ?? modes[0];

  function selectMode(next: ModeId) {
    const config = modes.find((item) => item.id === next);
    if (!config) return;
    setMode(next);
    applyMode(next, config.defaultSection);
  }

  function openPage(key: React.Key) {
    if (key === "all-pages") {
      window.location.assign(internalHref("/pages/"));
      return;
    }
    const page = pages.find((item) => item.id === key);
    if (page) window.open(page.url, "_blank", "noopener,noreferrer");
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="brand"
          href={internalHref("/")}
          aria-label="Mohammadamin Kafi home"
        >
          <span className="brand-mark" aria-hidden="true">
            MK
          </span>
          <span className="brand-copy">
            <strong>Mohammadamin Kafi</strong>
            <small>{currentMode.label} profile</small>
          </span>
        </a>

        <div className="mode-control-wrap" aria-label="Resume focus">
          <ToggleButtonGroup
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={selected}
            onSelectionChange={(keys) => {
              const next = Array.from(keys)[0];
              if (isModeId(String(next))) selectMode(String(next) as ModeId);
            }}
            size="sm"
            isDetached
          >
            {modes.map((item) => (
              <ToggleButton key={item.id} id={item.id} className="mode-toggle">
                {item.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Dropdown>
            <Dropdown.Trigger
              className={`pages-trigger ${currentPath.startsWith("/pages") ? "nav-active" : ""}`}
              aria-label="Open live pages menu"
            >
              Pages <ChevronDown size={14} aria-hidden="true" />
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu aria-label="Live pages" onAction={openPage}>
                {pages.map((page) => (
                  <Dropdown.Item
                    key={page.id}
                    id={page.id}
                    textValue={page.title}
                  >
                    <Label>{page.title}</Label>
                    <Description>{page.tagline}</Description>
                    <ExternalLink size={14} aria-hidden="true" />
                  </Dropdown.Item>
                ))}
                <Dropdown.Item id="all-pages" textValue="View all pages">
                  <Label>View all pages</Label>
                  <Description>
                    Descriptions, tags, and source links
                  </Description>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
          <a
            href={internalHref("/gallery/")}
            className={`nav-link ${currentPath.startsWith("/gallery") ? "nav-active" : ""}`}
          >
            Gallery
          </a>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onPress={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              applyTheme(next);
            }}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
        </nav>

        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="mobile-menu-trigger"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onPress={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </Button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href={internalHref("/")}>Home</a>
          <a href={internalHref("/pages/")}>All live pages</a>
          {pages.map((page) => (
            <a key={page.id} href={page.url} target="_blank" rel="noreferrer">
              {page.title} <ExternalLink size={13} aria-hidden="true" />
            </a>
          ))}
          <a href={internalHref("/gallery/")}>Gallery</a>
          <a href={internalHref("/resume/")}>Resume history</a>
          <button
            type="button"
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              applyTheme(next);
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}{" "}
            {theme === "dark" ? "Light" : "Dark"} theme
          </button>
        </nav>
      )}
    </header>
  );
}
