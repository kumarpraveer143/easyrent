import React from "react";

/**
 * The route-transition fallback. It used to be a full-screen frosted card
 * with three animated blobs, a ping, a bounce and the copy "Loading
 * Experience… / Preparing your perfect home".
 *
 * A loading state is not a moment to decorate — the user is waiting. This is
 * a quiet bar that says the app is working and gets out of the way. Anywhere
 * we know the SHAPE of what's coming, use <Skeleton> instead of this.
 */
export default function Loading({ label = "Loading" }) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center px-4">
      <div className="flex items-center gap-2.5 text-ink-faint">
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-line-strong border-t-ink-muted"
          aria-hidden="true"
        />
        <span role="status" aria-live="polite" className="text-body">
          {label}
        </span>
      </div>
    </div>
  );
}
