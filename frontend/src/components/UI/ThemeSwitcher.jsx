import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider.jsx";

const MODES = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];

/**
 * Runtime theme picker. Reads its options straight from `themes.js`, so adding
 * a theme there makes it appear here with no change to this file.
 *
 * The swatches are drawn from each theme's own values, so the preview can never
 * disagree with what you actually get.
 */
export default function ThemeSwitcher() {
  const { themeKey, setTheme, mode, setMode, available } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = available.find((t) => t.key === themeKey) ?? available[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Appearance"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex h-9 w-9 items-center justify-center rounded text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink"
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full border border-line-strong"
          style={{ background: `rgb(${current?.swatch?.accent ?? "0 0 0"})` }}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-60 rounded border border-line bg-surface p-1 shadow-overlay"
        >
          <p className="px-2 pb-1 pt-2 text-label font-semibold text-ink-faint">Theme</p>
          {available.map((t) => (
            <button
              key={t.key}
              type="button"
              role="menuitemradio"
              aria-checked={t.key === themeKey}
              onClick={() => setTheme(t.key)}
              className={[
                "flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left transition-colors",
                t.key === themeKey ? "bg-surface-raised" : "hover:bg-surface-raised",
              ].join(" ")}
            >
              <span aria-hidden="true" className="flex shrink-0 gap-0.5">
                {["surface-sunken", "accent", "ink"].map((k) => (
                  <span
                    key={k}
                    className="h-4 w-2 rounded-[2px] border border-line"
                    style={{ background: `rgb(${t.swatch[k]})` }}
                  />
                ))}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-body text-ink">{t.label}</span>
                <span className="block truncate text-label text-ink-faint">
                  {t.description}
                </span>
              </span>
            </button>
          ))}

          <p className="border-t border-line px-2 pb-1 pt-2 text-label font-semibold text-ink-faint">
            Appearance
          </p>
          <div className="flex gap-1 p-1">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                role="menuitemradio"
                aria-checked={m.key === mode}
                onClick={() => setMode(m.key)}
                className={[
                  "flex-1 rounded border px-2 py-1 text-label transition-colors",
                  m.key === mode
                    ? "border-ink bg-ink text-ink-contrast"
                    : "border-line-strong text-ink-muted hover:bg-surface-raised",
                ].join(" ")}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
