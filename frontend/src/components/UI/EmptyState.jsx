import React from "react";

/**
 * An empty list is a STATE, not a destination.
 *
 * The app currently ships five separate empty-state *routes* (NoRenters,
 * NoHistory, NoRequest, NoRoomsFound, SearchNoFound) — so an empty list
 * navigates you away from the page you were on and you lose your filters.
 * This renders in place instead.
 */
export default function EmptyState({ title, description, action, className = "" }) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded border border-dashed border-line-strong",
        "bg-surface px-6 py-12 text-center",
        className,
      ].join(" ")}
    >
      <h3 className="text-body font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-body text-ink-faint">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
