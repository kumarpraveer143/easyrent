import React from "react";
import { Link } from "react-router-dom";

/**
 * The old footer was a four-column marketing block whose "Company" section
 * linked to Careers and a Blog that don't exist, and whose social icons were
 * the developer's personal accounts — which reads as a portfolio project rather
 * than a business a landlord would trust with rent.
 *
 * Real links only. Anything not built yet isn't listed.
 */

const COLUMNS = [
  {
    heading: "Renting",
    links: [
      { to: "/findrooms", label: "Find a room" },
      { to: "/rentersMyRoom", label: "My room" },
      { to: "/renter-history", label: "Rent paid" },
      { to: "/favouriteRooms", label: "Saved rooms" },
    ],
  },
  {
    heading: "Listing",
    links: [
      { to: "/uploadrooms", label: "List a room" },
      { to: "/landowner-rooms", label: "My rooms" },
      { to: "/my-renters", label: "Tenants" },
      { to: "/incoming-request", label: "Applications" },
    ],
  },
  {
    heading: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="text-lead font-semibold tracking-tight text-ink">EasyRent</p>
          <p className="mt-2 max-w-xs text-label text-ink-faint">
            List a room, find a home, and keep rent and receipts in one place.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="text-label font-semibold text-ink">{col.heading}</h2>
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="rounded text-label text-ink-faint transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-label text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} EasyRent</p>
          {/* Terms and Privacy are genuine gaps, not oversights — they land with
              B36. Listing them as dead links would be worse than omitting them. */}
          <p>Built for landlords and renters in India.</p>
        </div>
      </div>
    </footer>
  );
}
