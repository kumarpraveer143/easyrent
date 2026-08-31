/**
 * One place that decides how money and dates look.
 *
 * The app currently prints rent as `₹{rentPrice}` in some places, plain
 * numbers in others, and `${amount}` (US dollars) on the landowner Payment
 * Dashboard. Formatting is a presentation concern, so it gets fixed once
 * here rather than per page.
 */

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const INR_PRECISE = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₹14,500 — for rents and totals. */
export function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return INR.format(n);
}

/** ₹14,500.00 — for anything that must reconcile to the paise. */
export function moneyExact(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return INR_PRECISE.format(n);
}

/** 12 Aug 2026 */
export function date(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** 12 Aug 2026, 4:30 pm */
export function dateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "single" -> "Single", "apartment" -> "Apartment" */
export function titleCase(value) {
  if (!value) return "—";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

/** "14 Kasturba Road, Bengaluru, Karnataka 560001" */
export function address(a) {
  if (!a) return "—";
  const line = [a.street, a.city, a.state].filter(Boolean).join(", ");
  return a.zipCode ? `${line} ${a.zipCode}` : line;
}
