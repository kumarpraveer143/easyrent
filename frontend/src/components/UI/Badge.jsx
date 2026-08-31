import React from "react";

/**
 * Encodes state, never decoration. If a badge isn't telling you something
 * that changes what you'd do next, it shouldn't be on the screen.
 */
const TONES = {
  neutral: "bg-surface-raised text-ink-muted border-line-strong",
  ok: "bg-ok-soft text-ok border-ok/25",
  warn: "bg-warn-soft text-warn border-warn/25",
  danger: "bg-danger-soft text-danger border-danger/25",
  accent: "bg-accent-soft text-accent border-accent/25",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded border px-1.5 py-0.5 text-label font-medium leading-4",
        TONES[tone] ?? TONES.neutral,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
