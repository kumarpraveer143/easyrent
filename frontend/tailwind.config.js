/** @type {import('tailwindcss').Config} */

/**
 * Colours are NOT defined here. They live in `src/theme/themes.js` — the single
 * place — and arrive as `--c-*` custom properties.
 *
 * The `<alpha-value>` placeholder is what keeps opacity modifiers working:
 * `bg-ink/40` compiles to `rgb(var(--c-ink) / 0.4)`. That is why the theme
 * stores "24 24 27" rather than "#18181b".
 */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // A deliberately tight scale. If a value isn't here, it isn't in the design.
    extend: {
      colors: {
        ink: {
          DEFAULT: token("ink"), // headings, primary buttons
          muted: token("ink-muted"), // body text
          faint: token("ink-faint"), // secondary / meta text
          contrast: token("ink-contrast"), // text ON an ink background
        },
        line: {
          DEFAULT: token("line"), // hairline borders — the main structural device
          strong: token("line-strong"), // input borders, dividers that need to read
        },
        surface: {
          DEFAULT: token("surface"),
          sunken: token("surface-sunken"), // page background
          raised: token("surface-raised"), // subtle fills, table headers
        },
        // ONE accent. Links, focus rings, and the occasional emphasised value.
        accent: {
          DEFAULT: token("accent"),
          hover: token("accent-hover"),
          soft: token("accent-soft"),
        },
        // Semantic colours are SEPARATE from the accent and encode state only —
        // never decoration.
        ok: { DEFAULT: token("ok"), soft: token("ok-soft") },
        warn: { DEFAULT: token("warn"), soft: token("warn-soft") },
        danger: { DEFAULT: token("danger"), soft: token("danger-soft") },
      },
      fontFamily: {
        sans: [
          // Must match the family @fontsource-variable/inter registers, or the
          // face never loads and everything silently falls back to the system
          // font — which is what was happening.
          "Inter Variable",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // Five sizes for the whole app.
        label: ["0.8125rem", { lineHeight: "1.15rem", letterSpacing: "0.005em" }], // 13px
        body: ["0.9375rem", { lineHeight: "1.5rem" }], // 15px
        lead: ["1.0625rem", { lineHeight: "1.6rem" }], // 17px
        title: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.011em" }], // 20px
        display: ["1.75rem", { lineHeight: "2.125rem", letterSpacing: "-0.019em" }], // 28px
      },
      borderRadius: {
        // One radius.
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        // Borders do the structural work, not shadows. The only shadow in the
        // system is for genuinely floating layers.
        overlay: "0 8px 28px -8px rgb(var(--c-ink) / 0.18)",
        none: "none",
      },
      ringWidth: { DEFAULT: "2px" },
    },
  },
  plugins: [],
};
