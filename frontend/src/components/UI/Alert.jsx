import React from "react";

/**
 * An inline message attached to the thing it's about.
 *
 * Errors are announced (role="alert") so a screen-reader user hears them;
 * the app currently renders most failures to console.log and shows nothing.
 */
const TONES = {
  info: "border-line-strong bg-surface-raised text-ink-muted",
  ok: "border-ok/25 bg-ok-soft text-ok",
  warn: "border-warn/25 bg-warn-soft text-warn",
  danger: "border-danger/25 bg-danger-soft text-danger",
};

export default function Alert({ tone = "info", title, className = "", children }) {
  const isLive = tone === "danger" || tone === "warn";

  return (
    <div
      role={isLive ? "alert" : undefined}
      className={[
        "rounded border px-3 py-2.5 text-body",
        TONES[tone] ?? TONES.info,
        className,
      ].join(" ")}
    >
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? "mt-0.5" : undefined}>{children}</div>}
    </div>
  );
}
