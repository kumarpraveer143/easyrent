import React, { useId } from "react";

/**
 * Input, Select and Textarea, all wired the same way.
 *
 * The label is a real <label htmlFor>, the error is announced, and the input
 * points at its own description via aria-describedby. This is where most of
 * the app's accessibility comes from — pages get it for free by using these
 * instead of hand-rolling <input>.
 */

const controlBase =
  "w-full rounded border bg-surface px-3 text-body text-ink placeholder:text-ink-faint " +
  "transition-colors duration-150 disabled:bg-surface-raised disabled:text-ink-faint";

function Shell({ id, label, hint, error, required, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-label font-medium text-ink">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children({ hintId, errorId })}
      {hint && !error && (
        <p id={hintId} className="text-label text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-label text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ label, hint, error, required, className = "", id, ...props }) {
  const auto = useId();
  const fieldId = id ?? auto;

  return (
    <Shell id={fieldId} label={label} hint={hint} error={error} required={required}>
      {({ hintId, errorId }) => (
        <input
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? hintId}
          className={[
            controlBase,
            "h-10",
            error ? "border-danger" : "border-line-strong hover:border-ink-faint",
            className,
          ].join(" ")}
          {...props}
        />
      )}
    </Shell>
  );
}

export function Select({ label, hint, error, required, children, className = "", id, ...props }) {
  const auto = useId();
  const fieldId = id ?? auto;

  return (
    <Shell id={fieldId} label={label} hint={hint} error={error} required={required}>
      {({ hintId, errorId }) => (
        <select
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? hintId}
          className={[
            controlBase,
            "h-10 appearance-none bg-[length:16px] bg-[right_0.6rem_center] bg-no-repeat pr-9",
            error ? "border-danger" : "border-line-strong hover:border-ink-faint",
            className,
          ].join(" ")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%2371717a' stroke-width='1.5'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
          }}
          {...props}
        >
          {children}
        </select>
      )}
    </Shell>
  );
}

export function Textarea({ label, hint, error, required, className = "", id, rows = 4, ...props }) {
  const auto = useId();
  const fieldId = id ?? auto;

  return (
    <Shell id={fieldId} label={label} hint={hint} error={error} required={required}>
      {({ hintId, errorId }) => (
        <textarea
          id={fieldId}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? hintId}
          className={[
            controlBase,
            "py-2 leading-6",
            error ? "border-danger" : "border-line-strong hover:border-ink-faint",
            className,
          ].join(" ")}
          {...props}
        />
      )}
    </Shell>
  );
}
