import React from "react";

/**
 * The only button in the app.
 *
 * Deliberately has no gradient, no transform-on-hover, and no shadow — hover
 * is a flat colour shift. Variants encode intent, not decoration.
 */

const VARIANTS = {
  // Solid ink. The one primary action on a screen.
  primary:
    "bg-ink text-white border border-ink hover:bg-black disabled:bg-ink/40 disabled:border-transparent",
  // Bordered. Everything else that is still an action.
  secondary:
    "bg-surface text-ink border border-line-strong hover:bg-surface-raised disabled:text-ink-faint",
  // No chrome until hovered. Tertiary actions, table row actions.
  ghost:
    "bg-transparent text-ink-muted border border-transparent hover:bg-surface-raised hover:text-ink",
  // Destructive. Only for actions that lose data.
  danger:
    "bg-surface text-danger border border-danger/30 hover:bg-danger-soft disabled:text-danger/40",
};

const SIZES = {
  sm: "h-8 px-3 text-label gap-1.5",
  md: "h-10 px-4 text-body gap-2",
};

export default function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        "inline-flex items-center justify-center rounded font-medium",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed",
        VARIANTS[variant] ?? VARIANTS.secondary,
        SIZES[size] ?? SIZES.md,
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
