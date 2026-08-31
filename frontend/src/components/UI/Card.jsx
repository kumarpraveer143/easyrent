import React from "react";

/**
 * A surface with a hairline border. No shadow, no gradient, no accent bar,
 * and no per-card colour — hierarchy comes from type and spacing.
 *
 * `interactive` adds a hover border shift for cards that are links.
 */
export default function Card({ interactive = false, className = "", children, ...props }) {
  return (
    <div
      className={[
        "rounded border border-line bg-surface",
        interactive && "transition-colors duration-150 hover:border-ink-faint",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className = "" }) {
  return (
    <div
      className={[
        "flex items-start justify-between gap-4 border-b border-line px-4 py-3",
        className,
      ].join(" ")}
    >
      <div className="min-w-0">
        <h2 className="text-body font-semibold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-label text-ink-faint">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={["px-4 py-4", className].join(" ")}>{children}</div>;
}
