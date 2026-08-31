import React from "react";

/**
 * Page shell + header. Every screen uses this, so page titles, widths and
 * vertical rhythm are identical everywhere instead of being re-invented per
 * page (which is why the app currently has a different heading treatment on
 * almost every screen).
 */
export default function Page({ width = "default", className = "", children }) {
  const widths = {
    default: "max-w-5xl",
    wide: "max-w-7xl",
    narrow: "max-w-2xl",
  };

  return (
    <main
      id="main"
      className={["mx-auto w-full px-4 py-8 sm:px-6", widths[width] ?? widths.default, className].join(
        " "
      )}
    >
      {children}
    </main>
  );
}

export function PageHeader({ title, description, actions, className = "" }) {
  return (
    <header
      className={[
        "mb-6 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between",
        className,
      ].join(" ")}
    >
      <div className="min-w-0">
        <h1 className="text-display text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-body text-ink-faint">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

/** A labelled block within a page. */
export function Section({ title, description, actions, className = "", children }) {
  return (
    <section className={["mb-8", className].join(" ")}>
      {(title || actions) && (
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            {title && <h2 className="text-title text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-label text-ink-faint">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
