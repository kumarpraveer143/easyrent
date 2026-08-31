import React from "react";

/**
 * A single number with its label. No icon, no colour fill, no gradient —
 * the number is the thing, so it gets the size and everything else recedes.
 */
export default function Stat({ label, value, hint, tone = "default" }) {
  const tones = {
    default: "text-ink",
    ok: "text-ok",
    warn: "text-warn",
    danger: "text-danger",
  };

  return (
    <div className="border-line px-4 py-3.5">
      <div className="text-label font-medium text-ink-faint">{label}</div>
      <div className={["tabular mt-1 text-display leading-none", tones[tone] ?? tones.default].join(" ")}>
        {value}
      </div>
      {hint && <div className="mt-1.5 text-label text-ink-faint">{hint}</div>}
    </div>
  );
}

/**
 * A row of stats sharing hairline dividers — one bordered block rather than
 * N floating cards, which is what makes a dashboard read as one instrument.
 */
export function StatRow({ className = "", children }) {
  return (
    <div
      className={[
        "grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded border border-line bg-surface",
        "sm:grid-cols-4 sm:divide-y-0",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
