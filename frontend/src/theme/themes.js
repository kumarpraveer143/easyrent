/**
 * THE ONE PLACE THE APP'S COLOURS ARE DEFINED.
 *
 * Change a value here and it changes everywhere — every button, border, badge,
 * table, focus ring and empty state — because nothing anywhere else names a
 * colour. Components only ever use semantic classes (`bg-surface`, `text-ink`,
 * `border-line`, `text-accent`), never `bg-zinc-100` or a hex.
 *
 * ── Why the values look like "24 24 27" and not "#18181b" ────────────────────
 * They are R G B channels, unquoted, so Tailwind's opacity modifiers keep
 * working: `bg-ink/40` compiles to `rgb(var(--c-ink) / 0.4)`. Store a hex here
 * and every `/40`, `/25` and `/30` in the codebase silently breaks.
 * `hexToChannels()` at the bottom converts if you'd rather think in hex.
 *
 * ── Adding a theme ──────────────────────────────────────────────────────────
 * Copy a block, change the values, give it a `label`. It appears in the theme
 * switcher automatically. Every theme MUST define every token in TOKENS, or the
 * self-check below throws in development and tells you which one is missing.
 */

/** Every token the app is allowed to use. Adding one here means adding it to
 *  every theme AND to tailwind.config.js. */
export const TOKENS = [
  "ink", // headings, primary buttons
  "ink-muted", // body text
  "ink-faint", // secondary / meta text
  "ink-contrast", // text that sits ON an ink background (primary buttons)
  "line", // hairline borders — the main structural device
  "line-strong", // input borders, dividers that need to read
  "surface", // cards, inputs, the nav
  "surface-sunken", // page background
  "surface-raised", // subtle fills, table headers
  "accent", // links, focus rings, the one emphasis colour
  "accent-hover",
  "accent-soft",
  "ok", // semantic — state, never decoration
  "ok-soft",
  "warn",
  "warn-soft",
  "danger",
  "danger-soft",
];

export const themes = {
  /** The default. Zinc neutrals with a desaturated institutional blue. */
  slate: {
    label: "Slate",
    description: "Neutral greys, one restrained blue. The default.",
    light: {
      ink: "24 24 27",
      "ink-muted": "82 82 91",
      "ink-faint": "109 109 118",
      "ink-contrast": "255 255 255",
      line: "214 214 217",
      "line-strong": "212 212 216",
      surface: "255 255 255",
      "surface-sunken": "250 250 250",
      "surface-raised": "244 244 245",
      accent: "36 80 181",
      "accent-hover": "28 63 146",
      "accent-soft": "238 242 251",
      ok: "21 128 61",
      "ok-soft": "240 253 244",
      warn: "161 98 7",
      "warn-soft": "254 252 232",
      danger: "185 28 28",
      "danger-soft": "254 242 242",
    },
    dark: {
      ink: "244 244 245",
      "ink-muted": "212 212 216",
      "ink-faint": "161 161 170",
      "ink-contrast": "24 24 27",
      line: "54 54 57",
      "line-strong": "63 63 70",
      surface: "24 24 27",
      "surface-sunken": "9 9 11",
      "surface-raised": "39 39 42",
      accent: "147 178 236",
      "accent-hover": "180 202 244",
      "accent-soft": "30 41 66",
      ok: "134 214 170",
      "ok-soft": "16 43 31",
      warn: "228 190 106",
      "warn-soft": "48 39 14",
      danger: "248 154 154",
      "danger-soft": "56 22 22",
    },
  },

  /** Warmer, earthier. Reads friendlier for non-technical landlords. */
  clay: {
    label: "Clay",
    description: "Warm neutrals with a muted terracotta.",
    light: {
      ink: "41 37 36",
      "ink-muted": "87 83 78",
      "ink-faint": "116 109 104",
      "ink-contrast": "255 255 255",
      line: "215 213 212",
      "line-strong": "214 211 209",
      surface: "255 255 255",
      "surface-sunken": "250 249 247",
      "surface-raised": "245 245 244",
      accent: "159 84 51",
      "accent-hover": "124 63 37",
      "accent-soft": "251 243 238",
      ok: "58 105 74",
      "ok-soft": "241 248 243",
      warn: "156 99 20",
      "warn-soft": "253 250 235",
      danger: "166 54 43",
      "danger-soft": "253 243 242",
    },
    dark: {
      ink: "245 245 244",
      "ink-muted": "214 211 209",
      "ink-faint": "168 162 158",
      "ink-contrast": "28 25 23",
      line: "58 54 53",
      "line-strong": "68 64 60",
      surface: "28 25 23",
      "surface-sunken": "18 16 15",
      "surface-raised": "41 37 36",
      accent: "224 152 116",
      "accent-hover": "236 180 152",
      "accent-soft": "56 32 22",
      ok: "134 197 156",
      "ok-soft": "20 40 29",
      warn: "224 184 106",
      "warn-soft": "48 38 14",
      danger: "234 148 138",
      "danger-soft": "56 25 22",
    },
  },

  /** Cool and clinical. Reads like an operations tool. */
  harbour: {
    label: "Harbour",
    description: "Cool greys with a deep teal.",
    light: {
      ink: "15 23 42",
      "ink-muted": "71 85 105",
      "ink-faint": "96 112 135",
      "ink-contrast": "255 255 255",
      line: "208 214 222",
      "line-strong": "203 213 225",
      surface: "255 255 255",
      "surface-sunken": "248 250 252",
      "surface-raised": "241 245 249",
      accent: "13 108 116",
      "accent-hover": "10 85 91",
      "accent-soft": "236 248 249",
      ok: "21 128 61",
      "ok-soft": "240 253 244",
      warn: "161 98 7",
      "warn-soft": "254 252 232",
      danger: "185 28 28",
      "danger-soft": "254 242 242",
    },
    dark: {
      ink: "241 245 249",
      "ink-muted": "203 213 225",
      "ink-faint": "148 163 184",
      "ink-contrast": "15 23 42",
      line: "43 54 72",
      "line-strong": "51 65 85",
      surface: "15 23 42",
      "surface-sunken": "2 6 23",
      "surface-raised": "30 41 59",
      accent: "103 197 205",
      "accent-hover": "148 216 222",
      "accent-soft": "12 48 52",
      ok: "134 214 170",
      "ok-soft": "16 43 31",
      warn: "228 190 106",
      "warn-soft": "48 39 14",
      danger: "248 154 154",
      "danger-soft": "56 22 22",
    },
  },

  /** Near-monochrome. Borders and spacing do everything. */
  paper: {
    label: "Paper",
    description: "Almost no colour. Maximum restraint.",
    light: {
      ink: "23 23 23",
      "ink-muted": "82 82 82",
      "ink-faint": "111 111 111",
      "ink-contrast": "255 255 255",
      line: "214 214 214",
      "line-strong": "212 212 212",
      surface: "255 255 255",
      "surface-sunken": "250 250 250",
      "surface-raised": "245 245 245",
      accent: "23 23 23",
      "accent-hover": "64 64 64",
      "accent-soft": "245 245 245",
      ok: "60 90 70",
      "ok-soft": "244 247 245",
      warn: "124 100 40",
      "warn-soft": "250 248 240",
      danger: "150 45 45",
      "danger-soft": "251 244 244",
    },
    dark: {
      ink: "250 250 250",
      "ink-muted": "212 212 212",
      "ink-faint": "163 163 163",
      "ink-contrast": "23 23 23",
      line: "53 53 53",
      "line-strong": "64 64 64",
      surface: "23 23 23",
      "surface-sunken": "10 10 10",
      "surface-raised": "38 38 38",
      accent: "250 250 250",
      "accent-hover": "212 212 212",
      "accent-soft": "38 38 38",
      ok: "140 190 160",
      "ok-soft": "22 34 27",
      warn: "212 186 120",
      "warn-soft": "42 36 18",
      danger: "228 150 150",
      "danger-soft": "48 26 26",
    },
  },
};

/** The theme used when nothing is stored. Change this line to reskin the app. */
export const DEFAULT_THEME = "slate";

/** "light" | "dark" | "system" */
export const DEFAULT_MODE = "system";

/**
 * Emit every theme as CSS, selected by data attributes on <html>.
 *
 * This is what makes the "one place" claim honest: the CSS is GENERATED from
 * the objects above, so there is no second copy of the palette to keep in step.
 * Injected synchronously before React mounts (see main.jsx), so the first paint
 * is already correct — setting these from JS after mount flashes the wrong
 * colours for a frame.
 */
export function buildThemeCss() {
  const blocks = [];

  for (const [key, theme] of Object.entries(themes)) {
    for (const mode of ["light", "dark"]) {
      const decls = TOKENS.map((t) => `--c-${t}:${theme[mode][t]}`).join(";");
      blocks.push(`[data-theme="${key}"][data-mode="${mode}"]{${decls}}`);
    }
  }

  // Fallback: if no attributes are set at all (JS disabled, or a crash before
  // the boot script runs) the app still renders in the default theme rather
  // than with every colour undefined.
  const fallback = TOKENS.map(
    (t) => `--c-${t}:${themes[DEFAULT_THEME].light[t]}`
  ).join(";");

  return `:root{${fallback}}` + blocks.join("");
}

// ----------------------------------------------------------------- helpers --

/** `#18181b` → `"24 24 27"`, for when you'd rather paste a hex. */
export function hexToChannels(hex) {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/**
 * Fail loudly in development if a theme is missing a token, rather than
 * shipping a page where one border silently renders as transparent.
 */
if (import.meta.env?.DEV) {
  for (const [key, theme] of Object.entries(themes)) {
    for (const mode of ["light", "dark"]) {
      const missing = TOKENS.filter((t) => !(t in theme[mode]));
      if (missing.length) {
        throw new Error(
          `Theme "${key}" (${mode}) is missing: ${missing.join(", ")}. ` +
            `Every theme must define every token in TOKENS.`
        );
      }
    }
  }
}
