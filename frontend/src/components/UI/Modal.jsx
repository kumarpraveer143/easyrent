import React, { useEffect, useRef, useCallback } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * A dialog that behaves like one: Escape closes it, focus moves into it and
 * is trapped while it's open, focus returns to whatever opened it, and the
 * page behind it doesn't scroll.
 *
 * The app currently uses SweetAlert2 for confirmations, which ships its own
 * styling and fights the design system. This replaces it.
 */
export default function Modal({ open, onClose, title, description, footer, children }) {
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`).current;

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null
      );
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first control inside the dialog, or the panel itself.
    const node = panelRef.current?.querySelector(FOCUSABLE) ?? panelRef.current;
    node?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="w-full max-w-md rounded border border-line bg-surface shadow-overlay"
      >
        <div className="border-b border-line px-4 py-3">
          <h2 id={titleId} className="text-body font-semibold text-ink">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-label text-ink-faint">{description}</p>}
        </div>

        {children && <div className="px-4 py-4 text-body">{children}</div>}

        {footer && (
          <div className="flex justify-end gap-2 border-t border-line px-4 py-3">{footer}</div>
        )}
      </div>
    </div>
  );
}
