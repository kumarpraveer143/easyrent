import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const src = readFileSync(
  homedir() + "/.digistay/work/easyrent-revamp/frontend/src/theme/themes.js",
  "utf8"
);

// Pull the palettes out of the module source without importing it (it has an
// import.meta.env guard that won't run under plain node).
const themes = {};
const themeRe = /^  (\w+): \{$/gm;
let m;
while ((m = themeRe.exec(src))) {
  const key = m[1];
  const rest = src.slice(m.index);
  themes[key] = {};
  for (const mode of ["light", "dark"]) {
    const modeIdx = rest.indexOf(`    ${mode}: {`);
    if (modeIdx === -1) continue;
    const block = rest.slice(modeIdx, rest.indexOf("    },", modeIdx));
    const pal = {};
    for (const line of block.split("\n")) {
      const t = line.match(/"?([\w-]+)"?:\s*"(\d+ \d+ \d+)"/);
      if (t) pal[t[1]] = t[2].split(" ").map(Number);
    }
    themes[key][mode] = pal;
  }
}

const lum = ([r, g, b]) => {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// text token -> background token it actually sits on in the app
const PAIRS = [
  ["ink", "surface", 4.5, "headings on cards"],
  ["ink", "surface-sunken", 4.5, "headings on the page"],
  ["ink-muted", "surface", 4.5, "body text on cards"],
  ["ink-faint", "surface", 4.5, "labels + meta text"],
  ["ink-faint", "surface-raised", 4.5, "table headers"],
  ["accent", "surface", 4.5, "links"],
  ["ink-contrast", "ink", 4.5, "primary button label"],
  ["ok", "ok-soft", 4.5, "success text"],
  ["warn", "warn-soft", 4.5, "warning text"],
  ["danger", "danger-soft", 4.5, "error text"],
  ["danger", "surface", 4.5, "inline field errors"],
  ["line", "surface", 1.4, "hairline borders (non-text)"],
];

let fails = 0;
for (const [themeKey, modes] of Object.entries(themes)) {
  for (const [mode, pal] of Object.entries(modes)) {
    const bad = [];
    for (const [fg, bg, min, what] of PAIRS) {
      if (!pal[fg] || !pal[bg]) continue;
      const r = ratio(pal[fg], pal[bg]);
      if (r < min) bad.push(`${what}: ${fg} on ${bg} = ${r.toFixed(2)} (need ${min})`);
    }
    const tag = `${themeKey}/${mode}`;
    if (bad.length === 0) {
      console.log(`  PASS  ${tag}`);
    } else {
      fails += bad.length;
      console.log(`  FAIL  ${tag}`);
      bad.forEach((b) => console.log(`          ${b}`));
    }
  }
}
console.log(fails === 0 ? "\nAll pairs meet WCAG AA." : `\n${fails} pair(s) below target.`);
process.exit(fails === 0 ? 0 : 1);
