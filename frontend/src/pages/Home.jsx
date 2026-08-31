import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Button } from "../components/UI";

/**
 * The old home page opened with a gradient hero, animated blurred blobs, a
 * stock illustration and the headline "Find Your Perfect Rental Space" — the
 * house style of generated marketing pages, and it said nothing specific.
 *
 * This says what the product does, for whom, and what to do next.
 */

const FOR_RENTERS = [
  "Search by location, price, room type and size",
  "Apply to a room and track whether you got it",
  "See every rent payment your landlord records",
  "Message your landlord without swapping numbers first",
];

const FOR_LANDLORDS = [
  "List rooms and take them off the market in one click",
  "See who applied, then accept or decline",
  "Record rent and keep a running payment history",
  "Know what you collected this month, and from whom",
];

export default function Home() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="max-w-2xl text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.022em] text-ink sm:text-[2.75rem]">
            Rooms to rent, and the paperwork that comes after.
          </h1>
          <p className="mt-4 max-w-xl text-lead text-ink-muted">
            EasyRent is where landlords list rooms and keep track of rent, and where
            renters find a home and keep proof of what they&rsquo;ve paid.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex h-10 items-center rounded border border-ink bg-ink px-4 text-body font-medium text-ink-contrast transition-colors hover:bg-ink/90"
              >
                Go to your dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center rounded border border-ink bg-ink px-4 text-body font-medium text-ink-contrast transition-colors hover:bg-ink/90"
                >
                  Create an account
                </Link>
                <Link
                  to="/findrooms"
                  className="inline-flex h-10 items-center rounded border border-line-strong bg-surface px-4 text-body font-medium text-ink transition-colors hover:bg-surface-raised"
                >
                  Browse rooms
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <CardBody>
              <h2 className="text-title text-ink">If you&rsquo;re renting</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {FOR_RENTERS.map((t) => (
                  <li key={t} className="flex gap-2.5 text-body text-ink-muted">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                to="/findrooms"
                className="mt-5 inline-flex rounded text-body font-medium text-accent hover:text-accent-hover"
              >
                Find a room
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-title text-ink">If you&rsquo;re listing</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {FOR_LANDLORDS.map((t) => (
                  <li key={t} className="flex gap-2.5 text-body text-ink-muted">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                to={user ? "/uploadrooms" : "/signup"}
                className="mt-5 inline-flex rounded text-body font-medium text-accent hover:text-accent-hover"
              >
                List a room
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <h2 className="text-title text-ink">How it works</h2>
          <ol className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              ["A landlord lists a room", "Address, rent, size — it appears in search straight away."],
              ["A renter applies", "The landlord sees who applied and picks one. Everyone else is told."],
              ["Rent gets recorded", "Every payment is logged, and both sides can see the same history."],
            ].map(([title, body], i) => (
              <li key={title}>
                <span className="tabular text-label font-semibold text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-body font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-body text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
