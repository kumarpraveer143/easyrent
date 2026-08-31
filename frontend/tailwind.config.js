/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // A deliberately tight scale. If a value isn't here, it isn't in the design.
    extend: {
      colors: {
        // Neutrals: zinc, not a pure grey. Slightly cool, reads as chosen.
        ink: {
          DEFAULT: "#18181b", // primary action, headings
          muted: "#52525b", // body text
          faint: "#71717a", // secondary/meta text
        },
        line: {
          DEFAULT: "#e4e4e7", // hairline borders — the main structural device
          strong: "#d4d4d8", // input borders, dividers that need to read
        },
        surface: {
          DEFAULT: "#ffffff",
          sunken: "#fafafa", // page background
          raised: "#f4f4f5", // subtle fills, table headers
        },
        // ONE accent. Links, focus rings, and the occasional emphasised value.
        // A desaturated institutional blue — not the default Tailwind blue.
        accent: {
          DEFAULT: "#2450b5",
          hover: "#1c3f92",
          soft: "#eef2fb",
        },
        // Semantic colours are SEPARATE from the accent and are used only to
        // encode state — never for decoration.
        ok: { DEFAULT: "#15803d", soft: "#f0fdf4" },
        warn: { DEFAULT: "#a16207", soft: "#fefce8" },
        danger: { DEFAULT: "#b91c1c", soft: "#fef2f2" },
      },
      fontFamily: {
        sans: [
          "Inter var",
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
        // Tight scale — five sizes for the whole app.
        label: ["0.8125rem", { lineHeight: "1.15rem", letterSpacing: "0.005em" }], // 13px
        body: ["0.9375rem", { lineHeight: "1.5rem" }], // 15px
        lead: ["1.0625rem", { lineHeight: "1.6rem" }], // 17px
        title: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.011em" }], // 20px
        display: ["1.75rem", { lineHeight: "2.125rem", letterSpacing: "-0.019em" }], // 28px
      },
      borderRadius: {
        // One radius. Two if you count the pill.
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        // Deliberately minimal. Borders do the structural work, not shadows.
        // The only shadow in the system is for genuinely floating layers.
        overlay: "0 8px 28px -8px rgba(24, 24, 27, 0.18)",
        none: "none",
      },
      ringWidth: { DEFAULT: "2px" },
    },
  },
  plugins: [],
};
