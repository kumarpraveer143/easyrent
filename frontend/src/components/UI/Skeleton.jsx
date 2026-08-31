import React from "react";

/**
 * Loading placeholders that hold the shape of the content that's coming,
 * so the page doesn't blank out and reflow. Replaces the full-page spinner.
 */
export default function Skeleton({ className = "" }) {
  return (
    <div
      className={["animate-pulse rounded bg-surface-raised", className].join(" ")}
      aria-hidden="true"
    />
  );
}

/** A skeleton shaped like a listing card. */
export function SkeletonCard() {
  return (
    <div className="rounded border border-line bg-surface p-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="mt-4 h-8 w-full" />
    </div>
  );
}

/** A skeleton shaped like table rows. */
export function SkeletonRows({ rows = 4, cols = 4 }) {
  return (
    <div className="divide-y divide-line">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3.5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Screen-reader announcement to pair with any skeleton region. */
export function LoadingAnnounce({ children = "Loading" }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {children}
    </span>
  );
}
