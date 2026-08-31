import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { themes, DEFAULT_THEME, DEFAULT_MODE } from "./themes.js";

const ThemeContext = createContext(null);

const THEME_KEY = "easyrent:theme";
const MODE_KEY = "easyrent:mode";

/**
 * Selects a theme by setting two attributes on <html>.
 *
 * The variables themselves live in generated CSS (see buildThemeCss), so
 * switching is a single attribute write rather than 17 style mutations — and
 * the values are already there on first paint.
 */
let switchTimer;

function paint(themeKey, resolvedMode) {
  const root = document.documentElement;

  // Suppress colour transitions for the swap itself. Components animate their
  // colours on hover, which is right — but during a theme change every element
  // animates independently, so for ~150ms you see dark surfaces with dark text
  // still on them. See the [data-theme-switching] rule in index.css.
  root.setAttribute("data-theme-switching", "");

  root.dataset.theme = themeKey in themes ? themeKey : DEFAULT_THEME;
  root.dataset.mode = resolvedMode;

  // Lets the browser render native controls (scrollbars, date pickers, form
  // fields) in the matching scheme — otherwise a dark page gets a white
  // calendar popup.
  root.style.colorScheme = resolvedMode;

  clearTimeout(switchTimer);
  // Two frames: one for the attribute swap to apply, one for the paint.
  switchTimer = setTimeout(() => root.removeAttribute("data-theme-switching"), 50);
}

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    // Private mode, or site data blocked. Not worth failing over.
    return fallback;
  }
}

/**
 * Theme state for the whole app.
 *
 * `mode` is one of light | dark | system. "system" follows the OS and keeps
 * following it — so a user who changes their OS at sunset sees the app change
 * too, without having touched a setting.
 */
export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(() => {
    const stored = readStored(THEME_KEY, DEFAULT_THEME);
    return stored in themes ? stored : DEFAULT_THEME;
  });

  const [mode, setMode] = useState(() => {
    const stored = readStored(MODE_KEY, DEFAULT_MODE);
    return ["light", "dark", "system"].includes(stored) ? stored : DEFAULT_MODE;
  });

  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolvedMode = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  useEffect(() => {
    paint(themeKey, resolvedMode);
    try {
      localStorage.setItem(THEME_KEY, themeKey);
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      // Nothing to do — the theme still applies for this session.
    }
  }, [themeKey, mode, resolvedMode]);

  const value = useMemo(
    () => ({
      themeKey,
      setTheme: setThemeKey,
      mode,
      setMode,
      resolvedMode,
      themes,
      available: Object.entries(themes).map(([key, t]) => ({
        key,
        label: t.label,
        description: t.description,
        // A swatch for the picker, straight from the theme itself.
        swatch: t[resolvedMode] ?? t.light,
      })),
    }),
    [themeKey, mode, resolvedMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/**
 * Applied before React mounts, from index.html, so the first paint is already
 * the right colours. Without it the page flashes the default theme for a frame.
 */
export const themeBootScript = `
(function(){
  try {
    var t = localStorage.getItem('${THEME_KEY}') || '${DEFAULT_THEME}';
    var m = localStorage.getItem('${MODE_KEY}') || '${DEFAULT_MODE}';
    var dark = m === 'dark' || (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = t;
    document.documentElement.dataset.mode = dark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`;
